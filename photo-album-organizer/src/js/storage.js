/**
 * IndexedDB storage module for photo files
 * @module storage
 */

const DB_NAME = 'PhotoAlbumDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

let db = null;

/**
 * Initialize IndexedDB
 * @returns {Promise<IDBDatabase>}
 */
export function initStorage() {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      console.log('IndexedDB initialized');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('albumId', 'albumId', { unique: false });
        objectStore.createIndex('fileHash', 'fileHash', { unique: true });
        console.log('Object store created');
      }
    };
  });
}

/**
 * Store a photo file in IndexedDB
 * @param {number} photoId - Photo ID from SQLite
 * @param {number} albumId - Album ID
 * @param {Blob} photoBlob - Photo file blob
 * @param {Blob} thumbnailBlob - Thumbnail blob
 * @param {string} fileHash - File content hash
 * @returns {Promise<void>}
 */
export async function storePhoto(photoId, albumId, photoBlob, thumbnailBlob, fileHash) {
  await initStorage();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const photoData = {
      id: photoId,
      albumId,
      photo: photoBlob,
      thumbnail: thumbnailBlob,
      fileHash,
      timestamp: Date.now()
    };
    
    const request = store.put(photoData);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieve a photo from IndexedDB
 * @param {number} photoId - Photo ID
 * @returns {Promise<Object>} Photo data
 */
export async function getPhoto(photoId) {
  await initStorage();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(photoId);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all photos for an album
 * @param {number} albumId - Album ID
 * @returns {Promise<Array>} Array of photo data
 */
export async function getPhotosByAlbum(albumId) {
  await initStorage();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('albumId');
    const request = index.getAll(albumId);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete a photo from IndexedDB
 * @param {number} photoId - Photo ID
 * @returns {Promise<void>}
 */
export async function deletePhoto(photoId) {
  await initStorage();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(photoId);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete all photos for an album
 * @param {number} albumId - Album ID
 * @returns {Promise<void>}
 */
export async function deletePhotosByAlbum(albumId) {
  const photos = await getPhotosByAlbum(albumId);
  
  for (const photo of photos) {
    await deletePhoto(photo.id);
  }
}

/**
 * Check if photo with hash exists
 * @param {string} fileHash - File hash
 * @returns {Promise<boolean>}
 */
export async function photoExists(fileHash) {
  await initStorage();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('fileHash');
    const request = index.get(fileHash);
    
    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => reject(request.error);
  });
}
