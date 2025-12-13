import { ipcMain } from 'electron';
import { createVault, unlockVault, isVaultInitialized } from './storage/vaultManager.js';
import { createNote, updateNote, deleteNote, getNotesList, getNoteContent } from './storage/notesManager.js';
import { deriveKey } from './crypto/encryption.js';

// Estado da sessão
let isAuthenticated = false;
let masterKey = null;
let masterSalt = null;

// Registrar todos os handlers IPC
export function registerIpcHandlers() {
    // Vault Handlers

    ipcMain.handle('vault:is-first-time', async () => {
        try {
            const initialized = await isVaultInitialized();
            return !initialized;
        } catch (error) {
            console.error('Erro ao verificar vault:', error);
            return true;
        }
    });

    ipcMain.handle('vault:create', async (event, password) => {
        try {
            await createVault(password);
            const unlockResult = await unlockVault(password);

            masterSalt = unlockResult.masterSalt;
            masterKey = await deriveKey(password, masterSalt);
            isAuthenticated = true;

            return { success: true };
        } catch (error) {
            console.error('Error creating vault:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('vault:unlock', async (event, password) => {
        try {
            const result = await unlockVault(password);

            masterSalt = result.masterSalt;
            masterKey = await deriveKey(password, masterSalt);
            isAuthenticated = true;

            return { success: true };
        } catch (error) {
            console.error('Error unlocking vault:', error);
            return { success: false, error: error.message };
        }
    });

    // Notes Handlers

    // Listar notas (metadata apenas)
    ipcMain.handle('notes:list', async () => {
        try {
            if (!isAuthenticated) {
                throw new Error('Não autenticado');
            }

            return await getNotesList();
        } catch (error) {
            console.error('Error listing notes:', error);
            throw error;
        }
    });

    // Obter conteúdo de uma nota
    ipcMain.handle('notes:get', async (event, noteId, notePassword = null) => {
        try {
            if (!isAuthenticated) {
                throw new Error('Não autenticado');
            }

            return await getNoteContent(noteId, masterKey, notePassword);
        } catch (error) {
            console.error('Error getting note:', error);
            throw error;
        }
    });

    // Criar nova nota
    ipcMain.handle('notes:create', async (event, data) => {
        try {
            if (!isAuthenticated) {
                throw new Error('Não autenticado');
            }

            const { title, content, hasPassword, password } = data;

            return await createNote(
                title || 'Nota sem título',
                content || {},
                masterKey,
                hasPassword || false,
                password || null
            );
        } catch (error) {
            console.error('Error creating note:', error);
            throw error;
        }
    });

    // Atualizar nota existente
    ipcMain.handle('notes:update', async (event, noteId, updates, notePassword = null) => {
        try {
            if (!isAuthenticated) {
                throw new Error('Não autenticado');
            }

            return await updateNote(noteId, updates, masterKey, notePassword);
        } catch (error) {
            console.error('Error updating note:', error);
            throw error;
        }
    });

    // Deletar nota
    ipcMain.handle('notes:delete', async (event, noteId) => {
        try {
            if (!isAuthenticated) {
                throw new Error('Não autenticado');
            }

            return await deleteNote(noteId);
        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    });

    // Desbloquear nota protegida (alias para get com senha)
    ipcMain.handle('notes:unlock', async (event, noteId, password) => {
        try {
            if (!isAuthenticated) {
                throw new Error('Não autenticado');
            }

            return await getNoteContent(noteId, masterKey, password);
        } catch (error) {
            console.error('Error unlocking note:', error);
            throw error;
        }
    });

    // Buscar notas
    ipcMain.handle('notes:search', async (event, query) => {
        try {
            if (!isAuthenticated) {
                throw new Error('Não autenticado');
            }

            const { searchNotes } = await import('./storage/notesManager.js');
            return await searchNotes(query, masterKey);
        } catch (error) {
            console.error('Error searching notes:', error);
            throw error;
        }
    });
}

export function getAuthStatus() {
    return isAuthenticated;
}

export function clearSession() {
    isAuthenticated = false;
    if (masterKey) {
        masterKey.fill(0);
        masterKey = null;
    }
    masterSalt = null;
}