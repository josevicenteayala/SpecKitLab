-- Database Schema for Photo Album Organizer
-- SQLite schema executed via sql.js in browser

-- Albums table
CREATE TABLE IF NOT EXISTS albums (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  custom_order INTEGER DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_albums_date ON albums(date);
CREATE INDEX idx_albums_custom_order ON albums(custom_order);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  album_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  file_hash TEXT NOT NULL,
  upload_timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  file_size INTEGER NOT NULL,
  format TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);

CREATE INDEX idx_photos_album_id ON photos(album_id);
CREATE INDEX idx_photos_file_hash ON photos(file_hash);
CREATE UNIQUE INDEX idx_photos_album_hash ON photos(album_id, file_hash);

-- Album Order table (for drag-and-drop custom ordering)
CREATE TABLE IF NOT EXISTS album_order (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  album_id INTEGER NOT NULL UNIQUE,
  position INTEGER NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);

CREATE INDEX idx_album_order_position ON album_order(position);
