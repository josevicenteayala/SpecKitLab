/**
 * File hashing utility for duplicate detection
 * Uses SubtleCrypto Web API (SHA-256)
 * @module utils/hash
 */

/**
 * Calculate SHA-256 hash of a file
 * @param {File|Blob} file - File to hash
 * @returns {Promise<string>} Hex string hash
 */
export async function calculateFileHash(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('Failed to calculate file hash:', error);
    throw error;
  }
}

/**
 * Calculate hash for multiple files
 * @param {FileList|File[]} files - Files to hash
 * @returns {Promise<Map<File, string>>} Map of file to hash
 */
export async function calculateMultipleHashes(files) {
  const hashMap = new Map();
  
  for (const file of files) {
    const hash = await calculateFileHash(file);
    hashMap.set(file, hash);
  }
  
  return hashMap;
}
