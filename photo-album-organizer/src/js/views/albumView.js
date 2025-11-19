/**
 * Album View
 * Renders the album detail page with photo grid
 */

import { createPhotoGrid } from '../components/photoGrid.js';

let currentAlbumId = null;

/**
 * Render the album view
 * @param {Object} album - Album data
 * @param {Object[]} photos - Array of photos with thumbnail blobs
 * @param {Function} onBack - Callback when back button is clicked
 * @param {Function} onUploadPhotos - Callback when upload button is clicked
 * @param {Function} onDeletePhoto - Callback when delete photo is clicked
 */
export function render(album, photos, onBack, onUploadPhotos, onDeletePhoto) {
  const container = document.getElementById('album-view-container');
  if (!container) {
    console.error('Album view container not found');
    return;
  }

  // Clear previous content
  container.innerHTML = '';
  container.removeAttribute('hidden');

  // Hide album list
  const albumListContainer = document.getElementById('album-list-container');
  if (albumListContainer) {
    albumListContainer.setAttribute('hidden', '');
  }

  // Create header
  const header = document.createElement('div');
  header.className = 'album-view-header';
  header.innerHTML = `
    <button id="back-btn" class="btn-secondary" aria-label="Back to albums">
      <span aria-hidden="true">←</span> Back
    </button>
    <div class="album-info">
      <h2>${escapeHtml(album.name)}</h2>
      <p class="album-date">${formatDate(album.date)}</p>
      <p class="photo-count">${photos.length} photo${photos.length !== 1 ? 's' : ''}</p>
    </div>
    <button id="upload-photos-btn" class="btn-primary" aria-label="Upload photos">
      <span aria-hidden="true">+</span> Upload Photos
    </button>
  `;
  container.appendChild(header);

  // Wire up buttons
  header.querySelector('#back-btn').addEventListener('click', onBack);
  header.querySelector('#upload-photos-btn').addEventListener('click', onUploadPhotos);

  // Show empty state if no photos
  if (photos.length === 0) {
    showEmptyState(container);
    currentAlbumId = album.id;
    return;
  }

  // Create and append photo grid
  const photoGrid = createPhotoGrid(photos, onDeletePhoto);
  container.appendChild(photoGrid);

  currentAlbumId = album.id;
}

/**
 * Show empty state when no photos exist
 * @param {HTMLElement} container - Container element
 */
function showEmptyState(container) {
  const emptyState = document.createElement('div');
  emptyState.className = 'empty-state';
  emptyState.innerHTML = `
    <div class="empty-state-icon" aria-hidden="true">📷</div>
    <h3>No Photos Yet</h3>
    <p>Upload your first photo to this album.</p>
  `;
  container.appendChild(emptyState);
}

/**
 * Show loading state
 */
export function showLoading() {
  const container = document.getElementById('album-view-container');
  if (!container) return;

  container.innerHTML = `
    <div class="loader-container" role="status" aria-live="polite">
      <div class="loader"></div>
      <p>Loading photos...</p>
    </div>
  `;
  container.removeAttribute('hidden');

  // Hide album list
  const albumListContainer = document.getElementById('album-list-container');
  if (albumListContainer) {
    albumListContainer.setAttribute('hidden', '');
  }
}

/**
 * Show error state
 * @param {string} message - Error message
 */
export function showError(message) {
  const container = document.getElementById('album-view-container');
  if (!container) return;

  container.innerHTML = `
    <div class="error-state" role="alert">
      <div class="error-icon" aria-hidden="true">⚠️</div>
      <h3>Error Loading Album</h3>
      <p>${message}</p>
      <button class="btn-secondary" onclick="history.back()">Go Back</button>
    </div>
  `;
  container.removeAttribute('hidden');
}

/**
 * Clear the album view and show main view
 */
export function clear() {
  const container = document.getElementById('album-view-container');
  if (container) {
    container.innerHTML = '';
    container.setAttribute('hidden', '');
  }

  // Show album list
  const albumListContainer = document.getElementById('album-list-container');
  if (albumListContainer) {
    albumListContainer.removeAttribute('hidden');
  }

  currentAlbumId = null;
}

/**
 * Get current album ID
 * @returns {number|null} Current album ID
 */
export function getCurrentAlbumId() {
  return currentAlbumId;
}

/**
 * Format date for display
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
