/**
 * Album Service
 * Business logic for album operations
 */

import { Album } from '../models/Album.js';
import { Photo } from '../models/Photo.js';
import { deletePhotosByAlbum } from '../storage.js';

/**
 * Get all albums sorted by custom order
 * @returns {Promise<Album[]>} Array of all albums
 */
export async function getAll() {
  return await Album.findAll();
}

/**
 * Get all albums sorted by date (chronological)
 * @param {string} order - Sort order: 'ASC' (oldest first) or 'DESC' (newest first, default)
 * @returns {Promise<Album[]>} Array of albums sorted by date
 */
export async function getAllByDate(order = 'DESC') {
  return await Album.findAllByDate(order);
}

/**
 * Get an album by ID
 * @param {number} id - Album ID
 * @returns {Promise<Album|null>} The album or null if not found
 */
export async function getById(id) {
  return await Album.findById(id);
}

/**
 * Create a new album
 * @param {string} name - Album name
 * @param {string} date - Album date in YYYY-MM-DD format
 * @returns {Promise<Album>} The created album
 * @throws {Error} If validation fails
 */
export async function create(name, date) {
  // Validate inputs
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Album name is required and must be a non-empty string');
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Album date must be in YYYY-MM-DD format');
  }

  // Validate date is valid
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }

  // Check album limit (max 100 albums per spec)
  const existingAlbums = await Album.findAll();
  if (existingAlbums.length >= 100) {
    throw new Error('Maximum album limit (100) reached');
  }

  return await Album.create(name.trim(), date);
}

/**
 * Update an album
 * @param {number} id - Album ID
 * @param {string} name - New album name
 * @param {string} date - New album date (YYYY-MM-DD)
 * @returns {Promise<Album>} The updated album
 * @throws {Error} If album not found or validation fails
 */
export async function update(id, name, date) {
  const album = await Album.findById(id);
  if (!album) {
    throw new Error(`Album with ID ${id} not found`);
  }

  // Validate name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Album name must be a non-empty string');
  }
  if (name.trim().length > 100) {
    throw new Error('Album name must be 100 characters or less');
  }

  // Validate date
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Album date must be in YYYY-MM-DD format');
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }

  return await album.update({
    name: name.trim(),
    date,
  });
}

/**
 * Delete an album and all its photos
 * @param {number} id - Album ID
 * @returns {Promise<void>}
 * @throws {Error} If album not found
 */
export async function deleteAlbum(id) {
  const album = await Album.findById(id);
  if (!album) {
    throw new Error(`Album with ID ${id} not found`);
  }

  // Delete photos from IndexedDB first
  await deletePhotosByAlbum(id);

  // Delete album (will cascade delete photos in SQLite)
  await album.delete();
}

/**
 * Alias for deleteAlbum (for consistency)
 * @param {number} id - Album ID
 * @returns {Promise<void>}
 */
export async function delete_(id) {
  return await deleteAlbum(id);
}

// Export as 'delete' for consistency with CRUD naming
export { delete_ as delete };

/**
 * Reorder albums after drag-and-drop
 * @param {number[]} albumIds - Array of album IDs in new order
 * @returns {Promise<void>}
 */
export async function reorderAlbums(albumIds) {
  // Update custom_order for each album based on array index
  const updatePromises = albumIds.map((albumId, index) => {
    return Album.findById(albumId).then((album) => {
      if (album) {
        return album.updateOrder(index);
      }
    });
  });

  await Promise.all(updatePromises);
}

/**
 * Get album with photo count
 * @param {number} id - Album ID
 * @returns {Promise<Object>} Album with photoCount property
 * @throws {Error} If album not found
 */
export async function getAlbumWithPhotoCount(id) {
  const album = await Album.findById(id);
  if (!album) {
    throw new Error(`Album with ID ${id} not found`);
  }

  const photoCount = await album.getPhotoCount();

  return {
    ...album.toJSON(),
    photoCount,
  };
}

/**
 * Get all albums with photo counts
 * @param {string} sortBy - Sort method: 'order' (custom order) or 'date' (chronological)
 * @returns {Promise<Object[]>} Array of albums with photoCount property
 */
export async function getAllWithPhotoCounts(sortBy = 'date') {
  const albums =
    sortBy === 'date' ? await Album.findAllByDate() : await Album.findAll();

  const albumsWithCounts = await Promise.all(
    albums.map(async (album) => {
      const photoCount = await album.getPhotoCount();
      return {
        ...album.toJSON(),
        photoCount,
      };
    })
  );

  return albumsWithCounts;
}
