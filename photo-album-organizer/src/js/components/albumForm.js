/**
 * Album Form Component
 * Form for creating and editing albums
 */

import { validateAlbumForm, sanitizeAlbumName } from '../utils/formValidator.js';

/**
 * Create album form modal
 * @param {Object} album - Existing album data for editing (null for new album)
 * @param {Function} onSave - Callback when form is submitted
 * @returns {HTMLElement} Modal element
 */
export function createAlbumFormModal(album = null, onSave) {
  const isEditing = album !== null;
  const modal = document.createElement('div');
  modal.className = 'dialog-overlay album-form-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'album-form-title');

  modal.innerHTML = `
    <div class="dialog-content album-form-content">
      <h2 id="album-form-title">${isEditing ? 'Edit Album' : 'Create New Album'}</h2>
      <form id="album-form" class="album-form" novalidate>
        <div class="form-group">
          <label for="album-name">Album Name *</label>
          <input 
            type="text" 
            id="album-name" 
            name="name" 
            required 
            maxlength="100"
            placeholder="Enter album name"
            value="${isEditing ? escapeHtml(album.name) : ''}"
            aria-required="true"
          />
          <span class="form-error" id="name-error" role="alert" aria-live="polite"></span>
          <span class="form-hint">Maximum 100 characters</span>
        </div>
        <div class="form-group">
          <label for="album-date">Date *</label>
          <input 
            type="date" 
            id="album-date" 
            name="date" 
            required
            max="${getTodayDate()}"
            value="${isEditing ? album.date : getTodayDate()}"
            aria-required="true"
          />
          <span class="form-error" id="date-error" role="alert" aria-live="polite"></span>
          <span class="form-hint">Albums are sorted by this date</span>
        </div>
        <div class="dialog-actions">
          <button type="button" class="btn-secondary album-form-cancel">Cancel</button>
          <button type="submit" class="btn-primary album-form-save">
            ${isEditing ? 'Save Changes' : 'Create Album'}
          </button>
        </div>
      </form>
    </div>
  `;

  const form = modal.querySelector('#album-form');
  const nameInput = modal.querySelector('#album-name');
  const dateInput = modal.querySelector('#album-date');
  const cancelBtn = modal.querySelector('.album-form-cancel');

  // Focus on name input
  setTimeout(() => nameInput.focus(), 100);

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      name: sanitizeAlbumName(nameInput.value),
      date: dateInput.value,
    };

    // Validate using formValidator
    const validation = validateAlbumForm(formData);
    if (!validation.valid) {
      // Show errors
      if (validation.errors.name) {
        showValidationError(nameInput, validation.errors.name);
      }
      if (validation.errors.date) {
        showValidationError(dateInput, validation.errors.date);
      }
      return;
    }

    // Clear errors
    clearValidationError(nameInput);
    clearValidationError(dateInput);

    // Call save callback with album ID for edit mode
    if (onSave) {
      onSave(formData, isEditing ? album.id : null);
    }

    modal.remove();
  });

  // Cancel button
  cancelBtn.addEventListener('click', () => {
    modal.remove();
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
 * Show album form modal
 * @param {Object} album - Existing album data for editing (null for new album)
 * @param {Function} onSave - Callback when form is submitted
 */
export function showAlbumForm(album = null, onSave) {
  const modal = createAlbumFormModal(album, onSave);
  document.body.appendChild(modal);
}

/**
 * Show validation error for an input
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message
 */
function showValidationError(input, message) {
  input.classList.add('input-error');
  input.setAttribute('aria-invalid', 'true');
  
  const errorId = input.id + '-error';
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    input.setAttribute('aria-describedby', errorId);
  }
  
  input.focus();
}

/**
 * Clear validation error for an input
 * @param {HTMLElement} input - Input element
 */
function clearValidationError(input) {
  input.classList.remove('input-error');
  input.removeAttribute('aria-invalid');
  input.removeAttribute('aria-describedby');
  
  const errorId = input.id + '-error';
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
