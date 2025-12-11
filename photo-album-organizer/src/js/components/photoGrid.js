/**
 * Photo Grid Component
 * Displays photos in a responsive tile grid
 */

import { createPhotoTile } from './photoTile.js';

/**
 * Create photo grid component
 * @param {Object[]} photos - Array of photos with thumbnail blobs
 * @param {Function} onDeletePhoto - Callback when delete photo is clicked
 * @returns {HTMLElement} Photo grid element
 */
export function createPhotoGrid(photos, onDeletePhoto) {
  const gridContainer = document.createElement('div');
  gridContainer.className = 'photo-grid';
  gridContainer.setAttribute('role', 'list');
  gridContainer.setAttribute('aria-label', 'Photos');

  // Create photo tiles
  photos.forEach((photo) => {
    const tile = createPhotoTile(photo, () => onDeletePhoto(photo.id));
    gridContainer.appendChild(tile);
  });

  return gridContainer;
}

/**
 * Update photo grid with new data
 * @param {HTMLElement} gridElement - The photo grid element
 * @param {Object[]} photos - New array of photos
 * @param {Function} onDeletePhoto - Callback when delete photo is clicked
 */
export function updatePhotoGrid(gridElement, photos, onDeletePhoto) {
  // Clear existing tiles
  gridElement.innerHTML = '';

  // Re-create photo tiles
  photos.forEach((photo) => {
    const tile = createPhotoTile(photo, () => onDeletePhoto(photo.id));
    gridElement.appendChild(tile);
  });
}
