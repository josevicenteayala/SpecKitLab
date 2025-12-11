/**
 * Album Card Component
 * Individual album card for the album list
 */

/**
 * Create an album card
 * @param {Object} album - Album data with photoCount
 * @param {Function} onClick - Click handler
 * @param {Object} dragHandlers - Optional drag-and-drop handlers
 * @param {Object} actions - Optional action handlers { onEdit, onDelete }
 * @returns {HTMLElement} Album card element
 */
export function createAlbumCard(album, onClick, dragHandlers = null, actions = null) {
  const card = document.createElement('article');
  card.className = 'album-card';
  card.setAttribute('role', 'listitem');
  card.setAttribute('tabindex', '0');
  card.setAttribute('data-album-id', album.id);
  card.setAttribute('aria-label', `Album: ${album.name}, ${album.photoCount} photos, created on ${formatDate(album.date)}`);

  // Enable drag-and-drop if handlers provided
  if (dragHandlers) {
    card.setAttribute('draggable', 'true');
    card.classList.add('album-card-draggable');
  }

  // Create card content
  card.innerHTML = `
    ${dragHandlers ? '<div class="album-card-drag-handle" aria-hidden="true">⋮⋮</div>' : ''}
    ${actions ? `
      <div class="album-card-menu">
        <button class="album-card-menu-btn" aria-label="Album actions" aria-haspopup="true">
          <span aria-hidden="true">⋮</span>
        </button>
        <div class="album-card-menu-dropdown" role="menu" hidden>
          <button class="album-card-menu-item album-card-edit" role="menuitem">
            <span aria-hidden="true">✏️</span> Edit Album
          </button>
          <button class="album-card-menu-item album-card-delete" role="menuitem">
            <span aria-hidden="true">🗑️</span> Delete Album
          </button>
        </div>
      </div>
    ` : ''}
    <div class="album-card-preview">
      <div class="album-card-icon" aria-hidden="true">📁</div>
      <div class="album-card-count">${album.photoCount}</div>
    </div>
    <div class="album-card-info">
      <h3 class="album-card-title">${escapeHtml(album.name)}</h3>
      <p class="album-card-date">${formatDate(album.date)}</p>
      <p class="album-card-meta">${album.photoCount} photo${album.photoCount !== 1 ? 's' : ''}</p>
    </div>
  `;

  // Click handler (but not when dragging)
  let isDragging = false;
  card.addEventListener('click', (e) => {
    // Don't trigger if clicking menu button or menu items
    if (e.target.closest('.album-card-menu-btn') || e.target.closest('.album-card-menu-dropdown')) {
      return;
    }
    if (!isDragging && !e.target.classList.contains('album-card-drag-handle')) {
      e.preventDefault();
      onClick();
    }
  });

  // Keyboard support
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  });

  // Context menu handlers
  if (actions) {
    const menuBtn = card.querySelector('.album-card-menu-btn');
    const menuDropdown = card.querySelector('.album-card-menu-dropdown');
    const editBtn = card.querySelector('.album-card-edit');
    const deleteBtn = card.querySelector('.album-card-delete');

    // Toggle menu
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = menuDropdown.hasAttribute('hidden');
      
      // Close all other menus
      document.querySelectorAll('.album-card-menu-dropdown').forEach((menu) => {
        menu.setAttribute('hidden', '');
      });
      
      if (isHidden) {
        menuDropdown.removeAttribute('hidden');
        menuBtn.setAttribute('aria-expanded', 'true');
      } else {
        menuDropdown.setAttribute('hidden', '');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Edit action
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menuDropdown.setAttribute('hidden', '');
      menuBtn.setAttribute('aria-expanded', 'false');
      if (actions.onEdit) {
        actions.onEdit(album);
      }
    });

    // Delete action
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menuDropdown.setAttribute('hidden', '');
      menuBtn.setAttribute('aria-expanded', 'false');
      if (actions.onDelete) {
        actions.onDelete(album);
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!card.contains(e.target)) {
        menuDropdown.setAttribute('hidden', '');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Drag-and-drop event listeners
  if (dragHandlers) {
    card.addEventListener('dragstart', (e) => {
      isDragging = true;
      card.classList.add('album-card-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', album.id.toString());
      
      if (dragHandlers.onDragStart) {
        dragHandlers.onDragStart(album, e);
      }
    });

    card.addEventListener('dragend', (e) => {
      setTimeout(() => { isDragging = false; }, 100);
      card.classList.remove('album-card-dragging');
      
      if (dragHandlers.onDragEnd) {
        dragHandlers.onDragEnd(album, e);
      }
    });

    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      
      if (dragHandlers.onDragOver) {
        dragHandlers.onDragOver(album, e, card);
      }
    });

    card.addEventListener('dragenter', (e) => {
      e.preventDefault();
      
      if (dragHandlers.onDragEnter) {
        dragHandlers.onDragEnter(album, e, card);
      }
    });

    card.addEventListener('dragleave', (e) => {
      if (dragHandlers.onDragLeave) {
        dragHandlers.onDragLeave(album, e, card);
      }
    });

    card.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (dragHandlers.onDrop) {
        dragHandlers.onDrop(album, e, card);
      }
    });
  }

  return card;
}

/**
 * Format date for display
 * @param {string} dateString - Date string (YYYY-MM-DD)
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
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
