import crypto from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'); // Must be 32 bytes (64 hex chars)
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Encrypt a slug to create a secure, random-looking identifier
 * @param {string} text - The slug to encrypt
 * @returns {string} - Encrypted slug (URL-safe base64)
 */
export function encryptSlug(text) {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');

        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Combine IV and encrypted data, then convert to URL-safe base64
        const combined = iv.toString('hex') + ':' + encrypted;
        return Buffer.from(combined).toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt slug');
    }
}

/**
 * Decrypt an encrypted slug back to the original
 * @param {string} encryptedText - The encrypted slug
 * @returns {string} - Original slug
 */
export function decryptSlug(encryptedText) {
    try {
        // Convert from URL-safe base64 back to normal base64
        let base64 = encryptedText
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        // Add padding if needed
        while (base64.length % 4) {
            base64 += '=';
        }

        const combined = Buffer.from(base64, 'base64').toString('utf8');
        const parts = combined.split(':');

        if (parts.length !== 2) {
            throw new Error('Invalid encrypted format');
        }

        const iv = Buffer.from(parts[0], 'hex');
        const encryptedData = parts[1];
        const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt slug');
    }
}

/**
 * Generate a random short code (alternative to encryption)
 * @param {number} length - Length of the code (default: 8)
 * @returns {string} - Random URL-safe code
 */
export function generateShortCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        result += chars[randomBytes[i] % chars.length];
    }

    return result;
}
