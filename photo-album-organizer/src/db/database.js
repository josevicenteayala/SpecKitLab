/**
 * Database module for SQLite operations via sql.js
 * @module database
 */

import initSqlJs from 'sql.js';

let db = null;
let SQL = null;

/**
 * Initialize the SQLite database
 * @returns {Promise<Object>} Database instance
 */
export async function initDatabase() {
  if (db) return db;

  try {
    // Initialize sql.js with WebAssembly
    SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });

    // Try to load existing database from localStorage
    const savedDb = localStorage.getItem('photo-album-db');
    
    if (savedDb) {
      const uint8Array = new Uint8Array(JSON.parse(savedDb));
      db = new SQL.Database(uint8Array);
      console.log('Database loaded from localStorage');
    } else {
      db = new SQL.Database();
      console.log('New database created');
    }

    // Execute schema
    const schema = await fetch('/src/db/schema.sql').then(r => r.text());
    db.run(schema);
    
    // Save database
    await saveDatabase();
    
    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

/**
 * Save database to localStorage
 */
export async function saveDatabase() {
  if (!db) return;
  
  try {
    const data = db.export();
    const buffer = Array.from(data);
    localStorage.setItem('photo-album-db', JSON.stringify(buffer));
  } catch (error) {
    console.error('Failed to save database:', error);
  }
}

/**
 * Get the database instance
 * @returns {Object} Database instance
 */
export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Execute a SQL query
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Array} Query results
 */
export function query(sql, params = []) {
  const db = getDatabase();
  const results = [];
  
  const stmt = db.prepare(sql);
  stmt.bind(params);
  
  while (stmt.step()) {
    const row = stmt.getAsObject();
    results.push(row);
  }
  
  stmt.free();
  return results;
}

/**
 * Execute a SQL command (INSERT, UPDATE, DELETE)
 * @param {string} sql - SQL command
 * @param {Array} params - Command parameters
 * @returns {Object} Result with lastInsertId and changes
 */
export function execute(sql, params = []) {
  const db = getDatabase();
  db.run(sql, params);
  
  const result = {
    lastInsertId: query('SELECT last_insert_rowid() as id')[0]?.id,
    changes: db.getRowsModified()
  };
  
  saveDatabase();
  return result;
}
