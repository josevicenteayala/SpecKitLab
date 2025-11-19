/**
 * Album List Component
 * Displays a grid of album cards
 */

import { createAlbumCard } from './albumCard.js';

/**
 * Create album list component
 * @param {Object[]} albums - Array of albums with photo counts
 * @param {Function} onAlbumClick - Callback when album is clicked
 * @param {Object} dragHandlers - Optional drag-and-drop handlers
 * @param {Object} actions - Optional action handlers { onEdit, onDelete }
 * @returns {HTMLElement} Album list element
 */
export function createAlbumList(albums, onAlbumClick, dragHandlers = null, actions = null) {
  const listContainer = document.createElement('div');
  listContainer.className = 'album-list';
  listContainer.setAttribute('role', 'list');
  listContainer.setAttribute('aria-label', 'Albums');

  // Create album cards
  albums.forEach((album) => {
    const card = createAlbumCard(
      album, 
      () => onAlbumClick(album.id),
      dragHandlers,
      actions
    );
    listContainer.appendChild(card);
  });

  return listContainer;
}

/**
 * Update album list with new data
 * @param {HTMLElement} listElement - The album list element
 * @param {Object[]} albums - New array of albums
 * @param {Function} onAlbumClick - Callback when album is clicked
 * @param {Object} dragHandlers - Optional drag-and-drop handlers
 * @param {Object} actions - Optional action handlers { onEdit, onDelete }
 */
export function updateAlbumList(listElement, albums, onAlbumClick, dragHandlers = null, actions = null) {
  // Clear existing cards
  listElement.innerHTML = '';

  // Re-create album cards
  albums.forEach((album) => {
    const card = createAlbumCard(
      album, 
      () => onAlbumClick(album.id),
      dragHandlers,
      actions
    );
    listElement.appendChild(card);
  });
}
