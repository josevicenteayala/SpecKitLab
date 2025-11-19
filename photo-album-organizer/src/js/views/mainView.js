/**
 * Main View
 * Renders the main page with album list
 */

import { createAlbumList } from '../components/albumList.js';
import { showNotification } from '../components/notification.js';

let currentView = null;

/**
 * Render the main view
 * @param {Object[]} albums - Array of albums with photo counts
 * @param {Function} onAlbumClick - Callback when album is clicked
 * @param {Function} onNewAlbum - Callback when "New Album" button is clicked
 * @param {Object} dragHandlers - Optional drag-and-drop handlers
 * @param {Object} actions - Optional action handlers { onEdit, onDelete }
 */
export function render(albums, onAlbumClick, onNewAlbum, dragHandlers = null, actions = null) {
  const container = document.getElementById('album-list-container');
  if (!container) {
    console.error('Album list container not found');
    return;
  }

  // Clear previous content
  container.innerHTML = '';

  // Create header with New Album button
  const header = document.createElement('div');
  header.className = 'main-view-header';
  header.innerHTML = `
    <h2>My Albums</h2>
    <button id="new-album-btn" class="btn-primary" aria-label="Create new album">
        <span aria-hidden="true">+</span> New Album
    </button>
  `;
  container.appendChild(header);

  // Wire up New Album button
  const newAlbumBtn = header.querySelector('#new-album-btn');
  newAlbumBtn.addEventListener('click', onNewAlbum);

  // Show empty state if no albums
  if (albums.length === 0) {
    showEmptyState(container);
    return;
  }

  // Create and append album list with actions
  const albumList = createAlbumList(albums, onAlbumClick, dragHandlers, actions);
  container.appendChild(albumList);

  currentView = 'main';
}

/**
 * Show empty state when no albums exist
 * @param {HTMLElement} container - Container element
 */
function showEmptyState(container) {
  const emptyState = document.createElement('div');
  emptyState.className = 'empty-state';
  emptyState.innerHTML = `
    <div class="empty-state-icon" aria-hidden="true">📁</div>
    <h3>No Albums Yet</h3>
    <p>Create your first album to get started organizing your photos.</p>
  `;
  container.appendChild(emptyState);
}

/**
 * Show loading state
 */
export function showLoading() {
  const container = document.getElementById('album-list-container');
  if (!container) return;

  container.innerHTML = `
    <div class="loader-container" role="status" aria-live="polite">
        <div class="loader"></div>
      <p>Loading albums...</p>
    </div>
  `;
}

/**
 * Show error state
 * @param {string} message - Error message
 */
export function showError(message) {
  const container = document.getElementById('album-list-container');
  if (!container) return;

  container.innerHTML = `
    <div class="error-state" role="alert">
      <div class="error-icon" aria-hidden="true">⚠️</div>
      <h3>Error Loading Albums</h3>
      <p>${message}</p>
      <button class="btn-primary" onclick="location.reload()">Retry</button>
    </div>
  `;
}

/**
 * Get current view
 * @returns {string|null} Current view name
 */
export function getCurrentView() {
  return currentView;
}

/**
 * Clear the main view
 */
export function clear() {
  const container = document.getElementById('album-list-container');
  if (container) {
    container.innerHTML = '';
  }
  currentView = null;
}
