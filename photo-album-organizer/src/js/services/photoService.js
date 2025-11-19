/**
 * Photo Service
 * Business logic for photo operations
 */

import { Photo } from '../models/Photo.js';
import { calculateFileHash } from '../utils/hash.js';
import { generateThumbnail } from '../utils/thumbnail.js';
import { photoExists } from '../storage.js';

/**
 * Get all photos in an album
 * @param {number} albumId - Album ID
 * @returns {Promise<Photo[]>} Array of photos
 */
export async function getByAlbumId(albumId) {
  return await Photo.findByAlbumId(albumId);
}

/**
 * Get a photo by ID
 * @param {number} id - Photo ID
 * @returns {Promise<Photo|null>} The photo or null if not found
 */
export async function getById(id) {
  return await Photo.findById(id);
}

/**
 * Add a new photo to an album
 * @param {number} albumId - Album ID
 * @param {File} file - Photo file
 * @returns {Promise<Photo>} The created photo
 * @throws {Error} If validation fails or duplicate detected
 */
export async function add(albumId, file) {
  // Validate file type
  const validFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  if (!validFormats.includes(file.type)) {
    throw new Error(
      `Unsupported file format: ${file.type}. Supported formats: JPEG, PNG, WebP, HEIC`
    );
  }

  // Check photo limit for album (500 max per spec)
  const photoCount = await Photo.countByAlbum(albumId);
  if (photoCount >= 500) {
    throw new Error('Album has reached maximum photo limit (500)');
  }

  // Calculate file hash for duplicate detection
  const fileHash = await calculateFileHash(file);

  // Check if photo already exists in this album
  const existingPhoto = await Photo.findByAlbumAndHash(albumId, fileHash);
  if (existingPhoto) {
    throw new Error(`Duplicate photo detected: ${file.name} already exists in this album`);
  }

  // Get image dimensions
  const dimensions = await getImageDimensions(file);

  // Generate thumbnail
  const thumbnailBlob = await generateThumbnail(file);

  // Extract format from MIME type
  const format = file.type.split('/')[1]; // e.g., 'image/jpeg' -> 'jpeg'

  // Create photo metadata
  const photoData = {
    album_id: albumId,
    filename: file.name,
    file_hash: fileHash,
    file_size: file.size,
    format: format,
    width: dimensions.width,
    height: dimensions.height,
  };

  // Create photo in database and storage
  return await Photo.create(photoData, file, thumbnailBlob);
}

/**
 * Add multiple photos to an album
 * @param {number} albumId - Album ID
 * @param {File[]} files - Array of photo files
 * @returns {Promise<Object>} Result object with successful and failed uploads
 */
export async function addMultiple(albumId, files) {
  const results = {
    successful: [],
    failed: [],
    duplicates: [],
  };

  for (const file of files) {
    try {
      const photo = await add(albumId, file);
      results.successful.push({ file: file.name, photo });
    } catch (error) {
      if (error.message.includes('Duplicate photo')) {
        results.duplicates.push({ file: file.name, error: error.message });
      } else {
        results.failed.push({ file: file.name, error: error.message });
      }
    }
  }

  return results;
}

/**
 * Delete a photo
 * @param {number} id - Photo ID
 * @returns {Promise<void>}
 * @throws {Error} If photo not found
 */
export async function deletePhoto(id) {
  const photo = await Photo.findById(id);
  if (!photo) {
    throw new Error(`Photo with ID ${id} not found`);
  }

  await photo.delete();
}

/**
 * Delete multiple photos
 * @param {number[]} photoIds - Array of photo IDs
 * @returns {Promise<void>}
 */
export async function deleteMultiple(photoIds) {
  const deletePromises = photoIds.map((id) => deletePhoto(id));
  await Promise.all(deletePromises);
}

/**
 * Delete all photos in an album (cascade delete)
 * @param {number} albumId - Album ID
 * @returns {Promise<void>}
 */
export async function deleteByAlbumId(albumId) {
  const photos = await Photo.findByAlbumId(albumId);
  const photoIds = photos.map((photo) => photo.id);
  
  if (photoIds.length > 0) {
    await deleteMultiple(photoIds);
  }
}

/**
 * Get photo with blob data
 * @param {number} id - Photo ID
 * @returns {Promise<Object>} Photo metadata with blob data
 * @throws {Error} If photo not found
 */
export async function getPhotoWithBlob(id) {
  const photo = await Photo.findById(id);
  if (!photo) {
    throw new Error(`Photo with ID ${id} not found`);
  }

  const blobs = await photo.getBlobs();

  return {
    ...photo.toJSON(),
    photoBlob: blobs.photo,
    thumbnailBlob: blobs.thumbnail,
  };
}

/**
 * Get all photos in an album with thumbnail blobs
 * @param {number} albumId - Album ID
 * @returns {Promise<Object[]>} Array of photos with thumbnail data
 */
export async function getAlbumPhotosWithThumbnails(albumId) {
  const photos = await Photo.findByAlbumId(albumId);

  const photosWithThumbnails = await Promise.all(
    photos.map(async (photo) => {
      const blobs = await photo.getBlobs();
      return {
        ...photo.toJSON(),
        thumbnailBlob: blobs.thumbnail,
      };
    })
  );

  return photosWithThumbnails;
}

/**
 * Check if a file hash exists in any album
 * @param {string} fileHash - SHA-256 hash
 * @returns {Promise<Photo|null>} Existing photo or null
 */
export async function findDuplicate(fileHash) {
  return await Photo.findByHash(fileHash);
}

/**
 * Get image dimensions from file
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>} Image dimensions
 */
function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Get storage statistics for an album
 * @param {number} albumId - Album ID
 * @returns {Promise<Object>} Storage stats
 */
export async function getAlbumStats(albumId) {
  const photoCount = await Photo.countByAlbum(albumId);
  const totalSize = await Photo.getTotalSizeByAlbum(albumId);

  return {
    photoCount,
    totalSize,
    averageSize: photoCount > 0 ? Math.round(totalSize / photoCount) : 0,
  };
}
