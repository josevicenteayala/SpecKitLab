/**
 * Form Validation Utilities
 * Validation functions for album forms
 */

/**
 * Validate album form data
 * @param {Object} formData - Form data to validate
 * @param {string} formData.name - Album name
 * @param {string} formData.date - Album date (YYYY-MM-DD)
 * @returns {Object} Validation result { valid: boolean, errors: Object }
 */
export function validateAlbumForm(formData) {
  const errors = {};

  // Validate name
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Album name is required';
  } else if (formData.name.trim().length < 1) {
    errors.name = 'Album name must not be empty';
  } else if (formData.name.trim().length > 100) {
    errors.name = 'Album name must be 100 characters or less';
  }

  // Validate date
  if (!formData.date || !formData.date.trim()) {
    errors.date = 'Album date is required';
  } else if (!isValidDate(formData.date)) {
    errors.date = 'Invalid date format (use YYYY-MM-DD)';
  } else if (isFutureDate(formData.date)) {
    errors.date = 'Album date cannot be in the future';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate date string format (YYYY-MM-DD)
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date format
 */
function isValidDate(dateString) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Check if date is in the future
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @returns {boolean} True if date is in the future
 */
function isFutureDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
}

/**
 * Sanitize album name
 * @param {string} name - Album name to sanitize
 * @returns {string} Sanitized name
 */
export function sanitizeAlbumName(name) {
  return name.trim().substring(0, 100);
}

/**
 * Format date for input field (YYYY-MM-DD)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDateForInput(date) {
  const dateObj = date instanceof Date ? date : new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
