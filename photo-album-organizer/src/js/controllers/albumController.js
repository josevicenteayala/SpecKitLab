/**
 * Album Controller
 * Handles album CRUD operations
 */

import * as albumService from '../services/albumService.js';
import * as photoService from '../services/photoService.js';
import { showAlbumForm } from '../components/albumForm.js';
import { showConfirmDialog } from '../components/confirmDialog.js';
import { showNotification } from '../components/notification.js';

/**
 * Handle album creation
 * @param {Function} onSuccess - Callback after successful creation
 * @returns {Promise<void>}
 */
export async function handleCreateAlbum(onSuccess) {
  try {
    // Check album limit
    const albums = await albumService.getAll();
    if (albums.length >= 100) {
      showNotification('Cannot create album. Maximum limit of 100 albums reached.', 'error');
      return;
    }

    // Show form
    showAlbumForm(null, async (formData) => {
      try {
        const album = await albumService.create(formData.name, formData.date);
        showNotification(`Album "${album.name}" created successfully`, 'success');
        
        if (onSuccess) {
          await onSuccess(album);
        }
      } catch (error) {
        console.error('Failed to create album:', error);
        showNotification('Failed to create album. Please try again.', 'error');
      }
    });
  } catch (error) {
    console.error('Failed to check album limit:', error);
    showNotification('Failed to create album. Please try again.', 'error');
  }
}

/**
 * Handle album editing
 * @param {Object} album - Album to edit
 * @param {Function} onSuccess - Callback after successful edit
 * @returns {Promise<void>}
 */
export async function handleEditAlbum(album, onSuccess) {
  showAlbumForm(album, async (formData, albumId) => {
    try {
      await albumService.update(albumId, formData.name, formData.date);
      showNotification(`Album "${formData.name}" updated successfully`, 'success');
      
      if (onSuccess) {
        await onSuccess(albumId, formData);
      }
    } catch (error) {
      console.error('Failed to update album:', error);
      showNotification('Failed to update album. Please try again.', 'error');
    }
  });
}

/**
 * Handle album deletion
 * @param {Object} album - Album to delete
 * @param {Function} onSuccess - Callback after successful deletion
 * @returns {Promise<void>}
 */
export async function handleDeleteAlbum(album, onSuccess) {
  const photoCount = album.photoCount || 0;
  const message = photoCount > 0
    ? `Delete album "${album.name}" and all ${photoCount} photo${photoCount !== 1 ? 's' : ''}? This cannot be undone.`
    : `Delete album "${album.name}"? This cannot be undone.`;

  showConfirmDialog(
    message,
    async () => {
      try {
        // Delete all photos in the album (cascade delete)
        await photoService.deleteByAlbumId(album.id);
        
        // Delete the album
        await albumService.delete(album.id);
        
        showNotification(`Album "${album.name}" deleted successfully`, 'success');
        
        if (onSuccess) {
          await onSuccess(album.id);
        }
      } catch (error) {
        console.error('Failed to delete album:', error);
        showNotification('Failed to delete album. Please try again.', 'error');
      }
    },
    null // Cancel callback (optional)
  );
}
