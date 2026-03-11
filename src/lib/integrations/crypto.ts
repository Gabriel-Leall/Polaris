import * as crypto from "crypto";

// For AES-256-GCM, the algorithm name must be exact
const ALGORITHM = "aes-256-gcm";

/**
 * Retrieves and validates the encryption key from environment variable ENCRYPTION_KEY.
 * It is expected to be a 64-character hex string representing 32 bytes.
 */
function getEncryptionKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex) {
    throw new Error("ENCRYPTION_KEY environment variable is not set.");
  }
  
  if (keyHex.length !== 64) {
    throw new Error("ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters).");
  }
  
  return Buffer.from(keyHex, "hex");
}

/**
 * Encrypts a string (e.g. an OAuth token) securely using AES-256-GCM.
 * Returns a string containing the IV, Auth Tag, and Encrypted Payload separated by colons.
 */
export function encryptToken(text: string): string {
  if (!text) {
    throw new Error("Cannot encrypt empty token.");
  }

  const key = getEncryptionKey();
  
  // 12 bytes is the recommended IV size for AES-GCM
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  
  const authTag = cipher.getAuthTag().toString("base64");
  
  return `${iv.toString("base64")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a secure token string created by encryptToken() back to its original plain text.
 */
export function decryptToken(encryptedData: string): string {
  if (!encryptedData) {
    throw new Error("Cannot decrypt empty token.");
  }

  const parts = encryptedData.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted data format.");
  }
  
  const [ivBase64, authTagBase64, encryptedText] = parts;
  
  const key = getEncryptionKey();
  const iv = Buffer.from(ivBase64, "base64");
  const authTag = Buffer.from(authTagBase64, "base64");
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}
