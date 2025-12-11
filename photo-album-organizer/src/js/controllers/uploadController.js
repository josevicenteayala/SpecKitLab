/**
 * Upload Controller
 * Manages photo upload workflow
 */

import { showUploadModal } from '../components/fileUpload.js';
import { showUploadProgress } from '../components/uploadProgress.js';
import { validateFiles } from '../utils/fileValidator.js';
import { uploadPhotos } from '../services/uploadService.js';
import { showNotification } from '../components/notification.js';

/**
 * Handle photo upload for an album
 * @param {number} albumId - Album ID
 * @param {Function} onComplete - Callback when upload completes
 */
export async function handlePhotoUpload(albumId, onComplete) {
  // Show upload modal
  showUploadModal(async (files) => {
    // Validate files
    const { valid, invalid } = validateFiles(files);

    // Show warnings for invalid files
    if (invalid.length > 0) {
      invalid.forEach((item) => {
        showNotification(`${item.file.name}: ${item.error}`, 'warning', 5000);
      });
    }

    // If no valid files, abort
    if (valid.length === 0) {
      showNotification('No valid files selected', 'error');
      return;
    }

    // Show progress modal
    const progress = showUploadProgress(valid.length, null, () => {
      if (onComplete) {
        onComplete();
      }
    });

    // Upload files
    try {
      await uploadPhotos(albumId, valid, (current, total, result) => {
        progress.update(current, total, result);
      });
    } catch (error) {
      showNotification(`Upload failed: ${error.message}`, 'error');
      progress.close();
    }
  });
}
