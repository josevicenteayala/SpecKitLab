/**
 * Upload Service
 * Handles photo upload queue and batch processing
 */

import * as photoService from './photoService.js';
import { showNotification } from '../components/notification.js';

/**
 * Upload queue for managing concurrent uploads
 */
class UploadQueue {
  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent;
    this.queue = [];
    this.active = [];
    this.results = {
      successful: [],
      failed: [],
      duplicates: [],
    };
  }

  /**
   * Add upload task to queue
   * @param {Function} uploadTask - Async function that performs the upload
   * @param {Object} metadata - Upload metadata for tracking
   */
  add(uploadTask, metadata) {
    this.queue.push({ uploadTask, metadata });
  }

  /**
   * Start processing the queue
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} Upload results
   */
  async process(onProgress) {
    const total = this.queue.length;
    let completed = 0;

    while (this.queue.length > 0 || this.active.length > 0) {
      // Start new uploads up to max concurrent
      while (this.active.length < this.maxConcurrent && this.queue.length > 0) {
        const item = this.queue.shift();
        const promise = this.executeUpload(item)
          .then((result) => {
            completed++;
            this.active = this.active.filter((p) => p !== promise);
            
            if (onProgress) {
              onProgress(completed, total, result);
            }
          })
          .catch((error) => {
            completed++;
            this.active = this.active.filter((p) => p !== promise);
            
            if (onProgress) {
              onProgress(completed, total, { error, metadata: item.metadata });
            }
          });

        this.active.push(promise);
      }

      // Wait for at least one to complete
      if (this.active.length > 0) {
        await Promise.race(this.active);
      }
    }

    return this.results;
  }

  /**
   * Execute a single upload task
   * @param {Object} item - Queue item
   * @returns {Promise<Object>} Upload result
   */
  async executeUpload(item) {
    try {
      const result = await item.uploadTask();
      this.results.successful.push({ ...item.metadata, photo: result });
      return { success: true, metadata: item.metadata, photo: result };
    } catch (error) {
      if (error.message.includes('Duplicate photo')) {
        this.results.duplicates.push({ ...item.metadata, error: error.message });
      } else {
        this.results.failed.push({ ...item.metadata, error: error.message });
      }
      return { success: false, metadata: item.metadata, error: error.message };
    }
  }
}

/**
 * Upload multiple photos to an album
 * @param {number} albumId - Album ID
 * @param {File[]} files - Array of photo files
 * @param {Function} onProgress - Progress callback (current, total, result)
 * @returns {Promise<Object>} Upload results
 */
export async function uploadPhotos(albumId, files, onProgress) {
  const queue = new UploadQueue(3); // Max 3 concurrent uploads

  // Add all files to queue
  files.forEach((file) => {
    const uploadTask = () => photoService.add(albumId, file);
    queue.add(uploadTask, { filename: file.name, size: file.size });
  });

  // Process queue with progress updates
  const results = await queue.process(onProgress);

  // Show summary notification
  showUploadSummary(results);

  return results;
}

/**
 * Show upload summary notification
 * @param {Object} results - Upload results
 */
function showUploadSummary(results) {
  const { successful, failed, duplicates } = results;
  const total = successful.length + failed.length + duplicates.length;

  if (successful.length === total) {
    showNotification(
      `Successfully uploaded ${successful.length} photo${successful.length !== 1 ? 's' : ''}`,
      'success'
    );
  } else if (successful.length > 0) {
    showNotification(
      `Uploaded ${successful.length}/${total} photos. ${failed.length} failed, ${duplicates.length} duplicates skipped.`,
      'warning'
    );
  } else {
    showNotification(`Failed to upload photos. Check console for details.`, 'error');
  }
}
