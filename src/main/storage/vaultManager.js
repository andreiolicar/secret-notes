import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { app } from 'electron';
import { hashPassword, verifyPassword, generateSalt } from '../crypto/encryption.js';

const APP_DATA_PATH = path.join(app.getPath('appData'), 'SecretNotes');
const VAULT_PATH = path.join(APP_DATA_PATH, 'vault.meta.json');
const NOTES_PATH = path.join(APP_DATA_PATH, 'notes');

// Garantir que os diretórios existem
async function ensureDirectories() {
    try {
        await fsPromises.mkdir(APP_DATA_PATH, { recursive: true });
        await fsPromises.mkdir(NOTES_PATH, { recursive: true });
    } catch (error) {
        console.error('Erro ao criar diretórios:', error);
        throw error;
    }
}

// Obter caminho do vault
export function getVaultPath() {
    return VAULT_PATH;
}

// Obter caminho do diretório de notas
export function getNotesPath() {
    return NOTES_PATH;
}

// Verificar se o vault está inicializado
export async function isVaultInitialized() {
    try {
        await fsPromises.access(VAULT_PATH);
        return true;
    } catch {
        return false;
    }
}

/**
 * Criar vault inicial
 * @param {string} masterPassword - Senha mestra
 * @returns {Promise<Object>} Resultado da operação
 */
export async function createVault(masterPassword) {
    try {
        // Garantir que diretórios existem
        await ensureDirectories();

        // Verificar se vault já existe
        if (await isVaultInitialized()) {
            throw new Error('Vault já existe');
        }

        // Validar senha
        if (!masterPassword || masterPassword.length < 4) {
            throw new Error('Senha mestra deve ter pelo menos 4 caracteres');
        }

        // Criar hash da senha mestra
        const passwordHash = await hashPassword(masterPassword);

        // Gerar salt para derivação de chaves
        const masterSalt = generateSalt();

        // Criar metadata do vault
        const vaultData = {
            version: '1.0.0',
            createdAt: new Date().toISOString(),
            passwordHash,
            masterSalt: masterSalt.toString('hex'),
            notesCount: 0,
        };

        // Salvar vault
        await fsPromises.writeFile(
            VAULT_PATH,
            JSON.stringify(vaultData, null, 2),
            'utf8'
        );

        console.log('✅ Vault criado com sucesso');

        return {
            success: true,
            vaultPath: VAULT_PATH,
        };
    } catch (error) {
        console.error('❌ Erro ao criar vault:', error);
        throw error;
    }
}

/**
 * Desbloquear vault com senha mestra
 * @param {string} masterPassword - Senha mestra
 * @returns {Promise<Object>} Dados do vault e chave mestra derivada
 */
export async function unlockVault(masterPassword) {
    try {
        // Verificar se vault existe
        if (!(await isVaultInitialized())) {
            throw new Error('Vault não existe. Crie um primeiro.');
        }

        // Ler vault
        const vaultContent = await fsPromises.readFile(VAULT_PATH, 'utf8');
        const vaultData = JSON.parse(vaultContent);

        // Verificar senha
        const isValid = await verifyPassword(vaultData.passwordHash, masterPassword);

        if (!isValid) {
            throw new Error('Senha mestra incorreta');
        }

        console.log('✅ Vault desbloqueado com sucesso');

        return {
            success: true,
            vault: vaultData,
            masterSalt: Buffer.from(vaultData.masterSalt, 'hex'),
        };
    } catch (error) {
        console.error('❌ Erro ao desbloquear vault:', error);
        throw error;
    }
}

/**
 * Atualizar contador de notas no vault
 * @param {number} count - Novo contador
 */
export async function updateNotesCount(count) {
    try {
        const vaultContent = await fsPromises.readFile(VAULT_PATH, 'utf8');
        const vaultData = JSON.parse(vaultContent);

        vaultData.notesCount = count;
        vaultData.updatedAt = new Date().toISOString();

        await fsPromises.writeFile(
            VAULT_PATH,
            JSON.stringify(vaultData, null, 2),
            'utf8'
        );
    } catch (error) {
        console.error('Erro ao atualizar contador de notas:', error);
    }
}