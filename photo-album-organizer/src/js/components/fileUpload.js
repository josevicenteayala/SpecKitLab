/**
 * File Upload Component
 * Handles file selection and drag-and-drop upload UI
 */

import { getAcceptedFileTypes, getSupportedFormatsText } from '../utils/fileValidator.js';

/**
 * Create file upload component
 * @param {Function} onFilesSelected - Callback when files are selected
 * @returns {HTMLElement} Upload component element
 */
export function createFileUpload(onFilesSelected) {
  const container = document.createElement('div');
  container.className = 'file-upload';

  container.innerHTML = `
    <div class="file-upload-area" tabindex="0" role="button" aria-label="Upload photos">
      <input 
        type="file" 
        id="file-input" 
        class="file-upload-input" 
        accept="${getAcceptedFileTypes()}"
        multiple
        aria-label="Select photos to upload"
      />
      <div class="file-upload-content">
        <div class="file-upload-icon" aria-hidden="true">📁</div>
        <p class="file-upload-text">
          <strong>Click to upload</strong> or drag and drop
        </p>
        <p class="file-upload-hint">
          Supported formats: ${getSupportedFormatsText()}
        </p>
      </div>
    </div>
    <div class="file-upload-selected" hidden>
      <p class="file-upload-count"></p>
      <button class="btn-secondary file-upload-clear">Clear</button>
    </div>
  `;

  const fileInput = container.querySelector('#file-input');
  const uploadArea = container.querySelector('.file-upload-area');
  const selectedArea = container.querySelector('.file-upload-selected');
  const countText = container.querySelector('.file-upload-count');
  const clearBtn = container.querySelector('.file-upload-clear');

  let selectedFiles = [];

  // Click to select files
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });

  // Keyboard support
  uploadArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  // File input change
  fileInput.addEventListener('change', (e) => {
    handleFiles(Array.from(e.target.files));
  });

  // Drag and drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('file-upload-area-dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('file-upload-area-dragover');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('file-upload-area-dragover');

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  });

  // Clear selection
  clearBtn.addEventListener('click', () => {
    selectedFiles = [];
    fileInput.value = '';
    selectedArea.setAttribute('hidden', '');
    uploadArea.removeAttribute('hidden');
  });

  /**
   * Handle selected files
   * @param {File[]} files - Selected files
   */
  function handleFiles(files) {
    if (files.length === 0) return;

    selectedFiles = files;
    
    // Show selected count
    countText.textContent = `${files.length} file${files.length !== 1 ? 's' : ''} selected`;
    selectedArea.removeAttribute('hidden');
    
    // Notify callback
    if (onFilesSelected) {
      onFilesSelected(files);
    }
  }

  return container;
}

/**
 * Create upload modal dialog
 * @param {Function} onUpload - Callback when upload is confirmed
 * @returns {HTMLElement} Modal element
 */
export function createUploadModal(onUpload) {
  const modal = document.createElement('div');
  modal.className = 'dialog-overlay upload-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'upload-modal-title');

  let selectedFiles = [];

  modal.innerHTML = `
    <div class="dialog-content upload-modal-content">
      <h2 id="upload-modal-title">Upload Photos</h2>
      <div id="upload-area-container"></div>
      <div class="dialog-actions">
        <button class="btn-secondary upload-modal-cancel">Cancel</button>
        <button class="btn-primary upload-modal-confirm" disabled>Upload</button>
      </div>
    </div>
  `;

  const uploadAreaContainer = modal.querySelector('#upload-area-container');
  const cancelBtn = modal.querySelector('.upload-modal-cancel');
  const confirmBtn = modal.querySelector('.upload-modal-confirm');

  // Create file upload component
  const fileUpload = createFileUpload((files) => {
    selectedFiles = files;
    confirmBtn.disabled = files.length === 0;
  });
  uploadAreaContainer.appendChild(fileUpload);

  // Cancel button
  cancelBtn.addEventListener('click', () => {
    modal.remove();
  });

  // Confirm button
  confirmBtn.addEventListener('click', () => {
    if (selectedFiles.length > 0 && onUpload) {
      onUpload(selectedFiles);
      modal.remove();
    }
  });

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Handle escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  return modal;
}

/**
 * Show upload modal
 * @param {Function} onUpload - Callback when upload is confirmed
 */
export function showUploadModal(onUpload) {
  const modal = createUploadModal(onUpload);
  document.body.appendChild(modal);
}
