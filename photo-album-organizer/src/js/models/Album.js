/**
 * Album Model
 * Represents an album with CRUD operations
 */

import { getDatabase, query, execute } from '../../db/database.js';

export class Album {
  /**
   * Create a new Album instance
   * @param {Object} data - Album data
   * @param {number} data.id - Album ID
   * @param {string} data.name - Album name
   * @param {string} data.date - Album date (YYYY-MM-DD format)
   * @param {number} data.custom_order - Custom order for manual sorting
   * @param {string} data.created_at - Creation timestamp
   * @param {string} data.updated_at - Last update timestamp
   */
  constructor({ id, name, date, custom_order, created_at, updated_at }) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.custom_order = custom_order;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Create a new album in the database
   * @param {string} name - Album name
   * @param {string} date - Album date (YYYY-MM-DD format)
   * @returns {Promise<Album>} The created album
   */
  static async create(name, date) {
    const db = getDatabase();
    if (!db) throw new Error('Database not initialized');

    const created_at = new Date().toISOString();
    const updated_at = created_at;

    // Get the highest custom_order and increment by 1
    const maxOrderResult = await query(
      'SELECT MAX(custom_order) as max_order FROM albums'
    );
    const custom_order = (maxOrderResult[0]?.max_order ?? -1) + 1;

    await execute(
      `INSERT INTO albums (name, date, custom_order, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, date, custom_order, created_at, updated_at]
    );

    // Get the last inserted ID
    const result = await query('SELECT last_insert_rowid() as id');
    const id = result[0].id;

    return new Album({ id, name, date, custom_order, created_at, updated_at });
  }

  /**
   * Find an album by ID
   * @param {number} id - Album ID
   * @returns {Promise<Album|null>} The album or null if not found
   */
  static async findById(id) {
    const results = await query('SELECT * FROM albums WHERE id = ?', [id]);
    return results.length > 0 ? new Album(results[0]) : null;
  }

  /**
   * Find all albums
   * @returns {Promise<Album[]>} Array of all albums
   */
  static async findAll() {
    const results = await query('SELECT * FROM albums ORDER BY custom_order ASC');
    return results.map((row) => new Album(row));
  }

  /**
   * Find albums sorted by date (chronological)
   * @param {string} order - Sort order: 'ASC' or 'DESC' (default: 'DESC' - newest first)
   * @returns {Promise<Album[]>} Array of albums sorted by date
   */
  static async findAllByDate(order = 'DESC') {
    const orderClause = order === 'ASC' ? 'ASC' : 'DESC';
    const results = await query(
      `SELECT * FROM albums ORDER BY date ${orderClause}, created_at ${orderClause}`
    );
    return results.map((row) => new Album(row));
  }

  /**
   * Update album details
   * @param {Object} updates - Fields to update
   * @param {string} [updates.name] - New album name
   * @param {string} [updates.date] - New album date
   * @returns {Promise<Album>} The updated album
   */
  async update({ name, date }) {
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
      this.name = name;
    }

    if (date !== undefined) {
      updates.push('date = ?');
      values.push(date);
      this.date = date;
    }

    if (updates.length === 0) return this;

    const updated_at = new Date().toISOString();
    updates.push('updated_at = ?');
    values.push(updated_at);
    this.updated_at = updated_at;

    values.push(this.id);

    await execute(
      `UPDATE albums SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this;
  }

  /**
   * Update the custom order for drag-and-drop reordering
   * @param {number} newOrder - New order position
   * @returns {Promise<Album>} The updated album
   */
  async updateOrder(newOrder) {
    const updated_at = new Date().toISOString();
    await execute(
      'UPDATE albums SET custom_order = ?, updated_at = ? WHERE id = ?',
      [newOrder, updated_at, this.id]
    );

    this.custom_order = newOrder;
    this.updated_at = updated_at;

    return this;
  }

  /**
   * Delete this album and all associated photos
   * @returns {Promise<void>}
   */
  async delete() {
    // First delete all photos in this album
    await execute('DELETE FROM photos WHERE album_id = ?', [this.id]);
    
    // Delete album order entry if exists
    await execute('DELETE FROM album_order WHERE album_id = ?', [this.id]);
    
    // Delete the album
    await execute('DELETE FROM albums WHERE id = ?', [this.id]);
  }

  /**
   * Get the count of photos in this album
   * @returns {Promise<number>} Number of photos
   */
  async getPhotoCount() {
    const results = await query(
      'SELECT COUNT(*) as count FROM photos WHERE album_id = ?',
      [this.id]
    );
    return results[0].count;
  }

  /**
   * Convert to plain object
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      date: this.date,
      custom_order: this.custom_order,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
