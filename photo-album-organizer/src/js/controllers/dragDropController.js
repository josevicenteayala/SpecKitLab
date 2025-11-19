/**
 * Drag and Drop Controller
 * Handles album reordering via drag-and-drop
 */

import { reorderAlbums } from '../services/albumService.js';
import { showNotification } from '../components/notification.js';

let draggedAlbumId = null;
let dropTargetCard = null;

/**
 * Create drag-and-drop handlers for album cards
 * @param {Function} onReorder - Callback when albums are reordered
 * @returns {Object} Drag-and-drop event handlers
 */
export function createDragHandlers(onReorder) {
  return {
    /**
     * Handle drag start
     * @param {Object} album - Album being dragged
     * @param {DragEvent} event - Drag event
     */
    onDragStart(album, event) {
      draggedAlbumId = album.id;
      
      // Set drag image (optional - browser default works well)
      if (event.dataTransfer.setDragImage) {
        const card = event.target;
        event.dataTransfer.setDragImage(card, card.offsetWidth / 2, card.offsetHeight / 2);
      }
    },

    /**
     * Handle drag end
     * @param {Object} album - Album being dragged
     * @param {DragEvent} event - Drag event
     */
    onDragEnd(album, event) {
      draggedAlbumId = null;
      
      // Clear all drop indicators
      document.querySelectorAll('.album-card-drop-target').forEach((card) => {
        card.classList.remove('album-card-drop-target');
      });
    },

    /**
     * Handle drag over
     * @param {Object} album - Album being hovered over
     * @param {DragEvent} event - Drag event
     * @param {HTMLElement} card - Card element
     */
    onDragOver(album, event, card) {
      // Don't allow dropping on self
      if (album.id === draggedAlbumId) {
        return;
      }

      // Prevent default to allow drop
      event.preventDefault();
    },

    /**
     * Handle drag enter
     * @param {Object} album - Album being entered
     * @param {DragEvent} event - Drag event
     * @param {HTMLElement} card - Card element
     */
    onDragEnter(album, event, card) {
      // Don't highlight self
      if (album.id === draggedAlbumId) {
        return;
      }

      card.classList.add('album-card-drop-target');
      dropTargetCard = card;
    },

    /**
     * Handle drag leave
     * @param {Object} album - Album being left
     * @param {DragEvent} event - Drag event
     * @param {HTMLElement} card - Card element
     */
    onDragLeave(album, event, card) {
      // Only remove highlight if actually leaving (not entering child)
      if (!card.contains(event.relatedTarget)) {
        card.classList.remove('album-card-drop-target');
      }
    },

    /**
     * Handle drop
     * @param {Object} targetAlbum - Album being dropped on
     * @param {DragEvent} event - Drag event
     * @param {HTMLElement} card - Card element
     */
    async onDrop(targetAlbum, event, card) {
      card.classList.remove('album-card-drop-target');

      // Don't allow dropping on self
      if (targetAlbum.id === draggedAlbumId) {
        return;
      }

      // Get all album cards in current order
      const albumList = card.closest('.album-list');
      if (!albumList) return;

      const cards = Array.from(albumList.querySelectorAll('.album-card'));
      const albumIds = cards.map((c) => parseInt(c.getAttribute('data-album-id')));

      // Find current positions
      const draggedIndex = albumIds.indexOf(draggedAlbumId);
      const targetIndex = albumIds.indexOf(targetAlbum.id);

      if (draggedIndex === -1 || targetIndex === -1) return;

      // Calculate new order
      const newOrder = [...albumIds];
      newOrder.splice(draggedIndex, 1); // Remove dragged item
      newOrder.splice(targetIndex, 0, draggedAlbumId); // Insert at new position

      // Save new order
      try {
        await reorderAlbums(newOrder);
        showNotification('Album order saved', 'success', 2000);
        
        // Notify parent to refresh view
        if (onReorder) {
          onReorder();
        }
      } catch (error) {
        showNotification('Failed to save album order', 'error');
        console.error('Reorder error:', error);
      }
    },
  };
}

/**
 * Check if device supports touch
 * @returns {boolean} True if touch is supported
 */
export function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Add touch support for drag-and-drop
 * This is a simplified polyfill for touch devices
 * @param {HTMLElement} element - Element to add touch support to
 * @param {Object} handlers - Drag handlers
 */
export function addTouchSupport(element, handlers) {
  if (!isTouchDevice()) return;

  let touchStartX = 0;
  let touchStartY = 0;
  let isDragging = false;

  element.addEventListener('touchstart', (e) => {
    // Only handle if drag handle is touched
    if (e.target.classList.contains('album-card-drag-handle')) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isDragging = false;
    }
  });

  element.addEventListener('touchmove', (e) => {
    if (!isDragging) {
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
      
      // Start dragging if moved more than 10px
      if (deltaX > 10 || deltaY > 10) {
        isDragging = true;
        e.preventDefault();
      }
    }

    if (isDragging) {
      e.preventDefault();
      // Visual feedback for touch drag (could be enhanced)
      element.style.opacity = '0.5';
    }
  });

  element.addEventListener('touchend', (e) => {
    if (isDragging) {
      e.preventDefault();
      element.style.opacity = '';
      isDragging = false;
    }
  });
}
