/**
 * Navigation Controller
 * Handles navigation between views
 */

import * as mainView from '../views/mainView.js';
import * as albumView from '../views/albumView.js';
import * as albumService from '../services/albumService.js';
import * as photoService from '../services/photoService.js';
import { showNotification } from '../components/notification.js';
import { withErrorHandling } from '../utils/errorHandler.js';
import { handlePhotoUpload } from './uploadController.js';
import { showAlbumForm } from '../components/albumForm.js';
import { createDragHandlers } from './dragDropController.js';
import { enableKeyboardReordering } from './keyboardReorderController.js';
import { handleEditAlbum, handleDeleteAlbum, handleCreateAlbum } from './albumController.js';

// Navigation state
let currentView = 'main';
let currentAlbumId = null;

/**
 * Initialize navigation
 */
export function init() {
  // Load initial view
  showMainView();

  // Handle browser back/forward buttons
  window.addEventListener('popstate', handlePopState);
}

/**
 * Show main view with album list
 */
export async function showMainView() {
  await withErrorHandling(async () => {
    mainView.showLoading();

    // Load albums sorted by custom order (respects drag-drop)
    const albums = await albumService.getAllWithPhotoCounts('order');

    // Create drag-and-drop handlers
    const dragHandlers = createDragHandlers(() => {
      // Refresh view after reorder
      showMainView();
    });

    // Create action handlers for edit/delete
    const actions = {
      onEdit: (album) => {
        handleEditAlbum(album, async () => {
          await showMainView();
        });
      },
      onDelete: (album) => {
        handleDeleteAlbum(album, async () => {
          await showMainView();
        });
      },
    };

    // Render main view with drag-and-drop and actions
    mainView.render(albums, handleAlbumClick, handleNewAlbum, dragHandlers, actions);

    // Enable keyboard reordering for accessibility
    const container = document.getElementById('album-list-container');
    if (container) {
      enableKeyboardReordering(container, () => {
        showMainView();
      });
    }

    // Update state
    currentView = 'main';
    currentAlbumId = null;

    // Update URL (without reload)
    window.history.pushState({ view: 'main' }, '', '/');
  }, 'Failed to load albums');
}

/**
 * Show album detail view
 * @param {number} albumId - Album ID to display
 */
export async function showAlbumView(albumId) {
  await withErrorHandling(async () => {
    albumView.showLoading();

    // Load album and photos
    const album = await albumService.getById(albumId);
    if (!album) {
      throw new Error('Album not found');
    }

    const photos = await photoService.getAlbumPhotosWithThumbnails(albumId);

    // Render album view
    albumView.render(
      album,
      photos,
      handleBackToMain,
      () => handleUploadPhotos(albumId),
      (photoId) => handleDeletePhoto(photoId, albumId)
    );

    // Update state
    currentView = 'album';
    currentAlbumId = albumId;

    // Update URL (without reload)
    window.history.pushState(
      { view: 'album', albumId },
      album.name,
      `/album/${albumId}`
    );
  }, 'Failed to load album');
}

/**
 * Handle album card click
 * @param {number} albumId - Album ID
 */
function handleAlbumClick(albumId) {
  showAlbumView(albumId);
}

/**
 * Handle back button click
 */
function handleBackToMain() {
  albumView.clear();
  showMainView();
}

/**
 * Handle new album button click
 */
async function handleNewAlbum() {
  await handleCreateAlbum(async () => {
    await showMainView();
  });
}

/**
 * Handle upload photos button click
 * @param {number} albumId - Album ID
 */
async function handleUploadPhotos(albumId) {
  await handlePhotoUpload(albumId, async () => {
    // Refresh album view after upload
    await showAlbumView(albumId);
  });
}

/**
 * Handle delete photo
 * @param {number} photoId - Photo ID
 * @param {number} albumId - Album ID
 */
async function handleDeletePhoto(photoId, albumId) {
  await withErrorHandling(async () => {
    await photoService.deletePhoto(photoId);
    showNotification('Photo deleted successfully', 'success');

    // Refresh album view
    await showAlbumView(albumId);
  }, 'Failed to delete photo');
}

/**
 * Handle browser back/forward buttons
 * @param {PopStateEvent} event - PopState event
 */
function handlePopState(event) {
  if (event.state) {
    if (event.state.view === 'main') {
      albumView.clear();
      showMainView();
    } else if (event.state.view === 'album' && event.state.albumId) {
      showAlbumView(event.state.albumId);
    }
  }
}

/**
 * Get current view
 * @returns {string} Current view name
 */
export function getCurrentView() {
  return currentView;
}

/**
 * Get current album ID
 * @returns {number|null} Current album ID
 */
export function getCurrentAlbumId() {
  return currentAlbumId;
}

/**
 * Refresh current view
 */
export async function refresh() {
  if (currentView === 'main') {
    await showMainView();
  } else if (currentView === 'album' && currentAlbumId) {
    await showAlbumView(currentAlbumId);
  }
}
