import crypto from 'crypto';
import argon2 from 'argon2';

// Configurações de criptografia
const ENCRYPTION_CONFIG = {
    algorithm: 'aes-256-gcm',
    keyLength: 32, // 256 bits
    ivLength: 16,  // 128 bits
    saltLength: 32,
    tagLength: 16,
    argon2: {
        type: argon2.argon2id,
        memoryCost: 65536, // 64 MB
        timeCost: 3,
        parallelism: 4,
    },
};

// Gerar salt aleatório
export function generateSalt() {
    return crypto.randomBytes(ENCRYPTION_CONFIG.saltLength);
}

// Gerar ID único para notas
export function generateId() {
    return crypto.randomUUID();
}

/**
 * Derivar chave a partir de senha usando Argon2
 * @param {string} password - Senha em texto plano
 * @param {Buffer} salt - Salt para derivação
 * @returns {Promise<Buffer>} Chave derivada
 */
export async function deriveKey(password, salt) {
    try {
        const hash = await argon2.hash(password, {
            ...ENCRYPTION_CONFIG.argon2,
            salt,
            raw: true, // Retornar buffer raw em vez de string encoded
            hashLength: ENCRYPTION_CONFIG.keyLength,
        });

        return hash;
    } catch (error) {
        throw new Error(`Erro ao derivar chave: ${error.message}`);
    }
}

/**
 * Criptografar dados usando AES-256-GCM
 * @param {string} plaintext - Dados em texto plano
 * @param {Buffer} key - Chave de criptografia (32 bytes)
 * @returns {Object} Dados criptografados { iv, encrypted, tag }
 */
export function encrypt(plaintext, key) {
    try {
        if (key.length !== ENCRYPTION_CONFIG.keyLength) {
            throw new Error(`Chave deve ter ${ENCRYPTION_CONFIG.keyLength} bytes`);
        }

        // Gerar IV aleatório
        const iv = crypto.randomBytes(ENCRYPTION_CONFIG.ivLength);

        // Criar cipher
        const cipher = crypto.createCipheriv(
            ENCRYPTION_CONFIG.algorithm,
            key,
            iv
        );

        // Criptografar
        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Obter authentication tag
        const tag = cipher.getAuthTag();

        return {
            iv: iv.toString('hex'),
            encrypted,
            tag: tag.toString('hex'),
        };
    } catch (error) {
        throw new Error(`Erro ao criptografar: ${error.message}`);
    }
}

/**
 * Descriptografar dados usando AES-256-GCM
 * @param {Object} encryptedData - Dados criptografados { iv, encrypted, tag }
 * @param {Buffer} key - Chave de descriptografia (32 bytes)
 * @returns {string} Dados descriptografados
 */
export function decrypt(encryptedData, key) {
    try {
        if (key.length !== ENCRYPTION_CONFIG.keyLength) {
            throw new Error(`Chave deve ter ${ENCRYPTION_CONFIG.keyLength} bytes`);
        }

        const { iv, encrypted, tag } = encryptedData;

        // Converter de hex para Buffer
        const ivBuffer = Buffer.from(iv, 'hex');
        const tagBuffer = Buffer.from(tag, 'hex');

        // Criar decipher
        const decipher = crypto.createDecipheriv(
            ENCRYPTION_CONFIG.algorithm,
            key,
            ivBuffer
        );

        // Configurar authentication tag
        decipher.setAuthTag(tagBuffer);

        // Descriptografar
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        // Erro de autenticação ou chave incorreta
        if (error.message.includes('auth')) {
            throw new Error('Senha incorreta ou dados corrompidos');
        }
        throw new Error(`Erro ao descriptografar: ${error.message}`);
    }
}

/**
 * Hash de senha para verificação (para senhas mestras)
 * @param {string} password - Senha em texto plano
 * @returns {Promise<string>} Hash da senha
 */
export async function hashPassword(password) {
    try {
        return await argon2.hash(password, ENCRYPTION_CONFIG.argon2);
    } catch (error) {
        throw new Error(`Erro ao fazer hash da senha: ${error.message}`);
    }
}

/**
 * Verificar senha contra hash
 * @param {string} hash - Hash armazenado
 * @param {string} password - Senha em texto plano
 * @returns {Promise<boolean>} True se a senha está correta
 */
export async function verifyPassword(hash, password) {
    try {
        return await argon2.verify(hash, password);
    } catch (error) {
        throw new Error(`Erro ao verificar senha: ${error.message}`);
    }
}