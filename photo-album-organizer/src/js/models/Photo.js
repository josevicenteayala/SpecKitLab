/**
 * Photo Model
 * Represents a photo with CRUD operations
 */

import { getDatabase, query, execute } from '../../db/database.js';
import { getPhoto, storePhoto, deletePhoto } from '../storage.js';

export class Photo {
  /**
   * Create a new Photo instance
   * @param {Object} data - Photo data
   * @param {number} data.id - Photo ID
   * @param {number} data.album_id - Album ID this photo belongs to
   * @param {string} data.filename - Original filename
   * @param {string} data.file_hash - SHA-256 hash for duplicate detection
   * @param {string} data.upload_timestamp - Upload timestamp
   * @param {number} data.file_size - File size in bytes
   * @param {string} data.format - Image format (jpeg, png, webp, heic)
   * @param {number} data.width - Image width in pixels
   * @param {number} data.height - Image height in pixels
   */
  constructor({
    id,
    album_id,
    filename,
    file_hash,
    upload_timestamp,
    file_size,
    format,
    width,
    height,
  }) {
    this.id = id;
    this.album_id = album_id;
    this.filename = filename;
    this.file_hash = file_hash;
    this.upload_timestamp = upload_timestamp;
    this.file_size = file_size;
    this.format = format;
    this.width = width;
    this.height = height;
  }

  /**
   * Create a new photo in the database and store file in IndexedDB
   * @param {Object} photoData - Photo metadata
   * @param {number} photoData.album_id - Album ID
   * @param {string} photoData.filename - Original filename
   * @param {string} photoData.file_hash - File hash
   * @param {number} photoData.file_size - File size in bytes
   * @param {string} photoData.format - Image format
   * @param {number} photoData.width - Image width
   * @param {number} photoData.height - Image height
   * @param {Blob} photoBlob - Photo file blob
   * @param {Blob} thumbnailBlob - Thumbnail blob
   * @returns {Promise<Photo>} The created photo
   */
  static async create(photoData, photoBlob, thumbnailBlob) {
    const db = getDatabase();
    if (!db) throw new Error('Database not initialized');

    const {
      album_id,
      filename,
      file_hash,
      file_size,
      format,
      width,
      height,
    } = photoData;

    const upload_timestamp = new Date().toISOString();

    // Insert metadata into SQLite
    await execute(
      `INSERT INTO photos (album_id, filename, file_hash, upload_timestamp, file_size, format, width, height)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [album_id, filename, file_hash, upload_timestamp, file_size, format, width, height]
    );

    // Get the last inserted ID
    const result = await query('SELECT last_insert_rowid() as id');
    const id = result[0].id;

    // Store photo and thumbnail in IndexedDB
    await storePhoto(id, album_id, photoBlob, thumbnailBlob, file_hash);

    return new Photo({
      id,
      album_id,
      filename,
      file_hash,
      upload_timestamp,
      file_size,
      format,
      width,
      height,
    });
  }

  /**
   * Find a photo by ID
   * @param {number} id - Photo ID
   * @returns {Promise<Photo|null>} The photo or null if not found
   */
  static async findById(id) {
    const results = await query('SELECT * FROM photos WHERE id = ?', [id]);
    return results.length > 0 ? new Photo(results[0]) : null;
  }

  /**
   * Find all photos in an album
   * @param {number} albumId - Album ID
   * @returns {Promise<Photo[]>} Array of photos in the album
   */
  static async findByAlbumId(albumId) {
    const results = await query(
      'SELECT * FROM photos WHERE album_id = ? ORDER BY upload_timestamp ASC',
      [albumId]
    );
    return results.map((row) => new Photo(row));
  }

  /**
   * Find photo by file hash (for duplicate detection)
   * @param {string} fileHash - SHA-256 hash of the file
   * @returns {Promise<Photo|null>} Existing photo with same hash, or null
   */
  static async findByHash(fileHash) {
    const results = await query('SELECT * FROM photos WHERE file_hash = ? LIMIT 1', [
      fileHash,
    ]);
    return results.length > 0 ? new Photo(results[0]) : null;
  }

  /**
   * Find photo by hash in a specific album
   * @param {number} albumId - Album ID
   * @param {string} fileHash - SHA-256 hash of the file
   * @returns {Promise<Photo|null>} Existing photo in album with same hash, or null
   */
  static async findByAlbumAndHash(albumId, fileHash) {
    const results = await query(
      'SELECT * FROM photos WHERE album_id = ? AND file_hash = ? LIMIT 1',
      [albumId, fileHash]
    );
    return results.length > 0 ? new Photo(results[0]) : null;
  }

  /**
   * Get the photo blob from IndexedDB
   * @returns {Promise<Object>} Object with photo and thumbnail blobs
   */
  async getBlobs() {
    return await getPhoto(this.id);
  }

  /**
   * Delete this photo from database and storage
   * @returns {Promise<void>}
   */
  async delete() {
    // Delete from IndexedDB
    await deletePhoto(this.id);

    // Delete from SQLite
    await execute('DELETE FROM photos WHERE id = ?', [this.id]);
  }

  /**
   * Get total count of photos in an album
   * @param {number} albumId - Album ID
   * @returns {Promise<number>} Number of photos
   */
  static async countByAlbum(albumId) {
    const results = await query(
      'SELECT COUNT(*) as count FROM photos WHERE album_id = ?',
      [albumId]
    );
    return results[0].count;
  }

  /**
   * Get total storage used by an album's photos
   * @param {number} albumId - Album ID
   * @returns {Promise<number>} Total file size in bytes
   */
  static async getTotalSizeByAlbum(albumId) {
    const results = await query(
      'SELECT SUM(file_size) as total_size FROM photos WHERE album_id = ?',
      [albumId]
    );
    return results[0].total_size || 0;
  }

  /**
   * Convert to plain object
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      album_id: this.album_id,
      filename: this.filename,
      file_hash: this.file_hash,
      upload_timestamp: this.upload_timestamp,
      file_size: this.file_size,
      format: this.format,
      width: this.width,
      height: this.height,
    };
  }
}
