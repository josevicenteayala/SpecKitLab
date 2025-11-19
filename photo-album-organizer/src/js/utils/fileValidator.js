/**
 * File Validator
 * Validates file types and browser compatibility
 */

/**
 * Supported image formats
 */
const SUPPORTED_FORMATS = {
  'image/jpeg': { ext: ['.jpg', '.jpeg'], name: 'JPEG' },
  'image/png': { ext: ['.png'], name: 'PNG' },
  'image/webp': { ext: ['.webp'], name: 'WebP' },
  'image/heic': { ext: ['.heic', '.heif'], name: 'HEIC' },
};

/**
 * Check if HEIC format is supported by the browser
 * HEIC is only supported natively in Safari
 * @returns {boolean} True if HEIC is supported
 */
export function isHeicSupported() {
  // Check if Safari (only browser with native HEIC support)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  return isSafari;
}

/**
 * Validate file format
 * @param {File} file - File to validate
 * @returns {Object} Validation result { valid: boolean, error?: string }
 */
export function validateFileFormat(file) {
  const fileType = file.type.toLowerCase();

  // Check if format is supported
  if (!SUPPORTED_FORMATS[fileType]) {
    return {
      valid: false,
      error: `Unsupported file format: ${file.type}. Supported formats: JPEG, PNG, WebP${isHeicSupported() ? ', HEIC' : ''}`,
    };
  }

  // Check HEIC compatibility
  if (fileType === 'image/heic' && !isHeicSupported()) {
    return {
      valid: false,
      error: 'HEIC format is only supported in Safari. Please convert to JPEG or PNG.',
    };
  }

  return { valid: true };
}

/**
 * Validate multiple files
 * @param {File[]} files - Array of files to validate
 * @returns {Object} Validation result { valid: File[], invalid: Array<{file: File, error: string}> }
 */
export function validateFiles(files) {
  const valid = [];
  const invalid = [];

  files.forEach((file) => {
    const result = validateFileFormat(file);
    if (result.valid) {
      valid.push(file);
    } else {
      invalid.push({ file, error: result.error });
    }
  });

  return { valid, invalid };
}

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum file size in MB (default: 50MB)
 * @returns {Object} Validation result { valid: boolean, error?: string }
 */
export function validateFileSize(file, maxSizeMB = 50) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size (${formatFileSize(file.size)}) exceeds maximum allowed size of ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Get accepted file types string for input element
 * @returns {string} Comma-separated list of accepted MIME types
 */
export function getAcceptedFileTypes() {
  const types = Object.keys(SUPPORTED_FORMATS);
  
  // Remove HEIC if not supported
  if (!isHeicSupported()) {
    return types.filter((type) => type !== 'image/heic').join(',');
  }

  return types.join(',');
}

/**
 * Get human-readable list of supported formats
 * @returns {string} Formatted list of supported formats
 */
export function getSupportedFormatsText() {
  const formats = Object.values(SUPPORTED_FORMATS)
    .filter((format) => {
      // Exclude HEIC if not supported
      if (format.name === 'HEIC' && !isHeicSupported()) {
        return false;
      }
      return true;
    })
    .map((format) => format.name);

  return formats.join(', ');
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
