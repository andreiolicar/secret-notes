import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { generateId, generateSalt, deriveKey, encrypt, decrypt, hashPassword, verifyPassword } from '../crypto/encryption.js';
import { getNotesPath, updateNotesCount } from './vaultManager.js';

// Obter caminho do arquivo de uma nota
function getNotePath(noteId) {
    return path.join(getNotesPath(), `note-${noteId}.enc`);
}

// Obter caminho do arquivo de metadata de uma nota
function getNoteMetaPath(noteId) {
    return path.join(getNotesPath(), `note-${noteId}.meta.json`);
}

// Criar nova nota
export async function createNote(title, content, masterKey, hasPassword = false, notePassword = null) {
    try {
        const noteId = generateId();
        const now = new Date().toISOString();

        if (!title || title.trim() === '') {
            throw new Error('Título é obrigatório');
        }

        if (hasPassword && !notePassword) {
            throw new Error('Senha da nota é obrigatória quando hasPassword é true');
        }

        let encryptionKey = masterKey;
        let noteSalt = null;
        let notePasswordHash = null;

        if (hasPassword && notePassword) {
            noteSalt = generateSalt();
            encryptionKey = await deriveKey(notePassword, noteSalt);
            notePasswordHash = await hashPassword(notePassword);
        }

        const noteData = {
            id: noteId,
            title: title.trim(),
            content: content || {},
            createdAt: now,
            updatedAt: now,
        };

        const noteContent = JSON.stringify(noteData);
        const encryptedData = encrypt(noteContent, encryptionKey);

        const metadata = {
            id: noteId,
            title: title.trim(),
            createdAt: now,
            updatedAt: now,
            hasPassword,
            passwordHash: notePasswordHash,
            noteSalt: noteSalt ? noteSalt.toString('hex') : null,
            encrypted: true,
        };

        await fsPromises.writeFile(
            getNotePath(noteId),
            JSON.stringify(encryptedData),
            'utf8'
        );

        await fsPromises.writeFile(
            getNoteMetaPath(noteId),
            JSON.stringify(metadata, null, 2),
            'utf8'
        );

        console.log(`✅ Nota criada: ${noteId} - "${title}"`);

        const notes = await getNotesList();
        await updateNotesCount(notes.length);

        return {
            success: true,
            note: {
                ...metadata,
                content: noteData.content,
            },
        };
    } catch (error) {
        console.error('❌ Erro ao criar nota:', error);
        throw error;
    }
}

// Atualizar nota existente
export async function updateNote(noteId, updates, masterKey, notePassword = null) {
    try {
        if (!noteId) {
            throw new Error('ID da nota é obrigatório');
        }

        if (!updates || Object.keys(updates).length === 0) {
            throw new Error('Nenhuma atualização fornecida');
        }

        const metaContent = await fsPromises.readFile(getNoteMetaPath(noteId), 'utf8');
        const metadata = JSON.parse(metaContent);

        // Se está atualizando apenas o título (metadado), não precisa de senha
        const isOnlyTitleUpdate = updates.title !== undefined && updates.content === undefined;

        if (metadata.hasPassword && !isOnlyTitleUpdate) {
            if (!notePassword) {
                throw new Error('Nota protegida. Senha necessária.');
            }

            const isValid = await verifyPassword(metadata.passwordHash, notePassword);
            if (!isValid) {
                throw new Error('Senha da nota incorreta');
            }
        }

        // Se está atualizando apenas título, não precisa descriptografar/criptografar conteúdo
        if (isOnlyTitleUpdate) {
            metadata.title = updates.title.trim();
            metadata.updatedAt = new Date().toISOString();

            await fsPromises.writeFile(
                getNoteMetaPath(noteId),
                JSON.stringify(metadata, null, 2),
                'utf8'
            );

            console.log(`✅ Título da nota atualizado: ${noteId}`);

            return {
                success: true,
                note: {
                    ...metadata,
                },
            };
        }

        // Atualização completa (com conteúdo)
        let encryptionKey = masterKey;
        if (metadata.hasPassword && notePassword) {
            const noteSalt = Buffer.from(metadata.noteSalt, 'hex');
            encryptionKey = await deriveKey(notePassword, noteSalt);
        }

        const encContent = await fsPromises.readFile(getNotePath(noteId), 'utf8');
        const encryptedData = JSON.parse(encContent);
        const decryptedContent = decrypt(encryptedData, encryptionKey);
        const currentNote = JSON.parse(decryptedContent);

        const updatedNote = {
            ...currentNote,
            title: updates.title !== undefined ? updates.title.trim() : currentNote.title,
            content: updates.content !== undefined ? updates.content : currentNote.content,
            updatedAt: new Date().toISOString(),
        };

        const newEncryptedData = encrypt(JSON.stringify(updatedNote), encryptionKey);

        await fsPromises.writeFile(
            getNotePath(noteId),
            JSON.stringify(newEncryptedData),
            'utf8'
        );

        metadata.title = updatedNote.title;
        metadata.updatedAt = updatedNote.updatedAt;

        await fsPromises.writeFile(
            getNoteMetaPath(noteId),
            JSON.stringify(metadata, null, 2),
            'utf8'
        );

        console.log(`✅ Nota atualizada: ${noteId}`);

        return {
            success: true,
            note: {
                ...metadata,
                content: updatedNote.content,
            },
        };
    } catch (error) {
        console.error(`❌ Erro ao atualizar nota ${noteId}:`, error);
        throw error;
    }
}

// Deletar nota
export async function deleteNote(noteId) {
    try {
        if (!noteId) {
            throw new Error('ID da nota é obrigatório');
        }

        try {
            await fsPromises.access(getNotePath(noteId));
        } catch {
            throw new Error('Nota não encontrada');
        }

        await fsPromises.unlink(getNotePath(noteId));
        await fsPromises.unlink(getNoteMetaPath(noteId));

        console.log(`✅ Nota deletada: ${noteId}`);

        const notes = await getNotesList();
        await updateNotesCount(notes.length);

        return {
            success: true,
            message: 'Nota deletada com sucesso',
        };
    } catch (error) {
        console.error(`❌ Erro ao deletar nota ${noteId}:`, error);
        throw error;
    }
}

// Obter lista de notas (apenas metadata)
export async function getNotesList() {
    try {
        const notesDir = getNotesPath();

        await fsPromises.mkdir(notesDir, { recursive: true });

        const files = await fsPromises.readdir(notesDir);
        const metaFiles = files.filter((file) => file.endsWith('.meta.json'));

        const notes = await Promise.all(
            metaFiles.map(async (file) => {
                try {
                    const content = await fsPromises.readFile(
                        path.join(notesDir, file),
                        'utf8'
                    );
                    return JSON.parse(content);
                } catch (error) {
                    console.error(`Erro ao ler ${file}:`, error);
                    return null;
                }
            })
        );

        return notes
            .filter((note) => note !== null)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (error) {
        console.error('❌ Erro ao listar notas:', error);
        throw error;
    }
}

// Obter conteúdo completo de uma nota
export async function getNoteContent(noteId, masterKey, notePassword = null) {
    try {
        if (!noteId) {
            throw new Error('ID da nota é obrigatório');
        }

        const metaContent = await fsPromises.readFile(getNoteMetaPath(noteId), 'utf8');
        const metadata = JSON.parse(metaContent);

        if (metadata.hasPassword) {
            if (!notePassword) {
                return {
                    ...metadata,
                    locked: true,
                    content: null,
                    message: 'Nota protegida. Senha necessária.',
                };
            }

            const isValid = await verifyPassword(metadata.passwordHash, notePassword);
            if (!isValid) {
                throw new Error('Senha da nota incorreta');
            }
        }

        let decryptionKey = masterKey;
        if (metadata.hasPassword && notePassword) {
            const noteSalt = Buffer.from(metadata.noteSalt, 'hex');
            decryptionKey = await deriveKey(notePassword, noteSalt);
        }

        const encContent = await fsPromises.readFile(getNotePath(noteId), 'utf8');
        const encryptedData = JSON.parse(encContent);

        const decryptedContent = decrypt(encryptedData, decryptionKey);
        const noteData = JSON.parse(decryptedContent);

        console.log(`✅ Conteúdo da nota carregado: ${noteId}`);

        return {
            ...noteData,
            hasPassword: metadata.hasPassword,
            locked: false,
        };
    } catch (error) {
        console.error(`❌ Erro ao carregar conteúdo da nota ${noteId}:`, error);
        throw error;
    }
}

/**
 * Buscar notas por termo
 * @param {string} query - Termo de busca
 * @param {Buffer} masterKey - Chave mestra
 * @returns {Promise<Array>} Notas filtradas
 */
export async function searchNotes(query, masterKey) {
    try {
        if (!query || query.trim() === '') {
            return await getNotesList();
        }

        const searchTerm = query.toLowerCase().trim();
        const allNotes = await getNotesList();
        const results = [];

        // Buscar em cada nota
        for (const noteMeta of allNotes) {
            // Buscar no título
            const titleMatch = noteMeta.title.toLowerCase().includes(searchTerm);

            // Se não tem senha, buscar no conteúdo também
            let contentMatch = false;
            if (!noteMeta.hasPassword) {
                try {
                    const noteContent = await getNoteContent(noteMeta.id, masterKey);
                    const textContent = extractTextFromContent(noteContent.content);
                    contentMatch = textContent.toLowerCase().includes(searchTerm);
                } catch (err) {
                    console.error(`Erro ao buscar conteúdo da nota ${noteMeta.id}:`, err);
                }
            }

            if (titleMatch || contentMatch) {
                results.push({
                    ...noteMeta,
                    matchedIn: titleMatch ? 'title' : 'content',
                });
            }
        }

        return results;
    } catch (error) {
        console.error('❌ Erro ao buscar notas:', error);
        throw error;
    }
}

// Extrair texto puro do conteúdo TipTap
function extractTextFromContent(content) {
    if (!content || !content.content) return '';

    let text = '';

    function traverse(node) {
        if (node.type === 'text') {
            text += node.text + ' ';
        }
        if (node.content && Array.isArray(node.content)) {
            node.content.forEach(traverse);
        }
    }

    traverse(content);
    return text.trim();
}