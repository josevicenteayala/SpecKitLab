/**
 * Upload Progress Component
 * Shows progress during file uploads
 */

/**
 * Create upload progress indicator
 * @param {number} total - Total number of files
 * @returns {HTMLElement} Progress element
 */
export function createUploadProgress(total) {
  const container = document.createElement('div');
  container.className = 'upload-progress';
  container.setAttribute('role', 'status');
  container.setAttribute('aria-live', 'polite');

  container.innerHTML = `
    <div class="upload-progress-header">
      <h3>Uploading Photos</h3>
      <button class="upload-progress-close" aria-label="Close" disabled>×</button>
    </div>
    <div class="upload-progress-bar-container">
      <div class="upload-progress-bar" style="width: 0%"></div>
    </div>
    <p class="upload-progress-text">0 of ${total} uploaded</p>
    <div class="upload-progress-details"></div>
  `;

  return container;
}

/**
 * Update progress indicator
 * @param {HTMLElement} progressElement - Progress element
 * @param {number} current - Current number of files uploaded
 * @param {number} total - Total number of files
 * @param {Object} result - Upload result
 */
export function updateProgress(progressElement, current, total, result) {
  const percentage = Math.round((current / total) * 100);
  
  // Update progress bar
  const progressBar = progressElement.querySelector('.upload-progress-bar');
  progressBar.style.width = `${percentage}%`;

  // Update text
  const progressText = progressElement.querySelector('.upload-progress-text');
  progressText.textContent = `${current} of ${total} uploaded`;

  // Add detail item
  if (result) {
    const details = progressElement.querySelector('.upload-progress-details');
    const detail = document.createElement('div');
    detail.className = 'upload-progress-item';

    if (result.success) {
      detail.innerHTML = `
        <span class="upload-progress-icon">✓</span>
        <span class="upload-progress-filename">${result.metadata.filename}</span>
      `;
      detail.classList.add('upload-progress-item-success');
    } else {
      detail.innerHTML = `
        <span class="upload-progress-icon">✗</span>
        <span class="upload-progress-filename">${result.metadata.filename}</span>
        <span class="upload-progress-error">${result.error}</span>
      `;
      detail.classList.add('upload-progress-item-error');
    }

    details.appendChild(detail);
    
    // Scroll to bottom
    details.scrollTop = details.scrollHeight;
  }

  // Enable close button when complete
  if (current === total) {
    const closeBtn = progressElement.querySelector('.upload-progress-close');
    closeBtn.disabled = false;
    progressText.textContent = `Upload complete: ${current} of ${total}`;
  }
}

/**
 * Show upload progress in a modal
 * @param {number} total - Total number of files
 * @param {Function} onProgress - Progress callback
 * @param {Function} onComplete - Completion callback
 * @returns {Object} Progress control object
 */
export function showUploadProgress(total, onProgress, onComplete) {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'dialog-overlay upload-progress-overlay';
  overlay.style.cursor = 'default';

  // Create progress element
  const progressElement = createUploadProgress(total);
  overlay.appendChild(progressElement);

  // Add to DOM
  document.body.appendChild(overlay);

  // Wire up close button
  const closeBtn = progressElement.querySelector('.upload-progress-close');
  closeBtn.addEventListener('click', () => {
    overlay.remove();
    if (onComplete) {
      onComplete();
    }
  });

  // Prevent closing by clicking overlay during upload
  let uploadComplete = false;
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay && uploadComplete) {
      overlay.remove();
      if (onComplete) {
        onComplete();
      }
    }
  });

  return {
    /**
     * Update progress
     * @param {number} current - Current count
     * @param {number} total - Total count
     * @param {Object} result - Upload result
     */
    update(current, total, result) {
      updateProgress(progressElement, current, total, result);
      
      if (current === total) {
        uploadComplete = true;
      }

      if (onProgress) {
        onProgress(current, total, result);
      }
    },

    /**
     * Close progress modal
     */
    close() {
      overlay.remove();
      if (onComplete) {
        onComplete();
      }
    },
  };
}
