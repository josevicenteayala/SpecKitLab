/**
 * Photo Tile Component
 * Individual photo tile for the photo grid
 */

/**
 * Create a photo tile
 * @param {Object} photo - Photo data with thumbnailBlob
 * @param {Function} onDelete - Delete handler
 * @returns {HTMLElement} Photo tile element
 */
export function createPhotoTile(photo, onDelete) {
  const tile = document.createElement('article');
  tile.className = 'photo-tile';
  tile.setAttribute('role', 'listitem');
  tile.setAttribute('data-photo-id', photo.id);
  tile.setAttribute('aria-label', `Photo: ${photo.filename}, uploaded ${formatDate(photo.upload_timestamp)}`);

  // Create thumbnail image
  const thumbnailUrl = URL.createObjectURL(photo.thumbnailBlob);
  
  tile.innerHTML = `
    <div class="photo-tile-image-container">
      <img 
        src="${thumbnailUrl}" 
        alt="${escapeHtml(photo.filename)}"
        class="photo-tile-image"
        loading="lazy"
      />
      <div class="photo-tile-overlay">
        <button 
          class="photo-tile-delete" 
          aria-label="Delete photo ${escapeHtml(photo.filename)}"
          title="Delete photo"
        >
          <span aria-hidden="true">🗑️</span>
        </button>
      </div>
    </div>
    <div class="photo-tile-info">
      <p class="photo-tile-filename" title="${escapeHtml(photo.filename)}">
        ${truncateFilename(photo.filename, 20)}
      </p>
      <p class="photo-tile-meta">
        ${formatFileSize(photo.file_size)} · ${photo.width}×${photo.height}
      </p>
    </div>
  `;

  // Wire up delete button
  const deleteBtn = tile.querySelector('.photo-tile-delete');
  deleteBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    
    // Import confirmDelete dynamically to avoid circular dependencies
    const { confirmDelete } = await import('./confirmDialog.js');
    const confirmed = await confirmDelete(photo.filename, 'photo');
    
    if (confirmed) {
      onDelete();
    }
  });

  // Clean up object URL when tile is removed
  tile.addEventListener('DOMNodeRemoved', () => {
    URL.revokeObjectURL(thumbnailUrl);
  });

  return tile;
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

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Truncate filename for display
 * @param {string} filename - Filename
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated filename
 */
function truncateFilename(filename, maxLength) {
  if (filename.length <= maxLength) return filename;
  
  const extension = filename.split('.').pop();
  const nameWithoutExt = filename.substring(0, filename.length - extension.length - 1);
  const truncated = nameWithoutExt.substring(0, maxLength - extension.length - 4);
  
  return `${truncated}...${extension}`;
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
