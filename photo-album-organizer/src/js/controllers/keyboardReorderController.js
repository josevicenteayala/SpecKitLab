/**
 * Keyboard Reorder Controller
 * Provides keyboard accessibility for album reordering
 */

import { reorderAlbums } from '../services/albumService.js';
import { showNotification } from '../components/notification.js';

/**
 * Add keyboard reordering support to album list
 * @param {HTMLElement} albumListContainer - Container with album cards
 * @param {Function} onReorder - Callback when albums are reordered
 */
export function enableKeyboardReordering(albumListContainer, onReorder) {
  albumListContainer.addEventListener('keydown', async (e) => {
    const card = e.target.closest('.album-card');
    if (!card) return;

    const albumList = card.closest('.album-list');
    if (!albumList) return;

    let handled = false;

    // Ctrl/Cmd + Arrow Up: Move album up
    if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowUp') {
      e.preventDefault();
      handled = true;
      await moveAlbumUp(card, albumList, onReorder);
    }

    // Ctrl/Cmd + Arrow Down: Move album down
    if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowDown') {
      e.preventDefault();
      handled = true;
      await moveAlbumDown(card, albumList, onReorder);
    }

    // Show help on Ctrl/Cmd + ?
    if ((e.ctrlKey || e.metaKey) && e.key === '?') {
      e.preventDefault();
      showReorderHelp();
    }
  });
}

/**
 * Move album up in the list
 * @param {HTMLElement} card - Album card element
 * @param {HTMLElement} albumList - Album list container
 * @param {Function} onReorder - Reorder callback
 */
async function moveAlbumUp(card, albumList, onReorder) {
  const previousCard = card.previousElementSibling;
  if (!previousCard) {
    showNotification('Album is already at the top', 'info', 2000);
    return;
  }

  // Get all album IDs in current order
  const cards = Array.from(albumList.querySelectorAll('.album-card'));
  const albumIds = cards.map((c) => parseInt(c.getAttribute('data-album-id')));
  
  // Find current index and swap with previous
  const currentIndex = cards.indexOf(card);
  if (currentIndex > 0) {
    [albumIds[currentIndex], albumIds[currentIndex - 1]] = 
    [albumIds[currentIndex - 1], albumIds[currentIndex]];
    
    await saveNewOrder(albumIds, onReorder);
    
    // Move focus to maintain keyboard navigation
    setTimeout(() => {
      const newCard = albumList.querySelectorAll('.album-card')[currentIndex - 1];
      newCard?.focus();
    }, 100);
  }
}

/**
 * Move album down in the list
 * @param {HTMLElement} card - Album card element
 * @param {HTMLElement} albumList - Album list container
 * @param {Function} onReorder - Reorder callback
 */
async function moveAlbumDown(card, albumList, onReorder) {
  const nextCard = card.nextElementSibling;
  if (!nextCard) {
    showNotification('Album is already at the bottom', 'info', 2000);
    return;
  }

  // Get all album IDs in current order
  const cards = Array.from(albumList.querySelectorAll('.album-card'));
  const albumIds = cards.map((c) => parseInt(c.getAttribute('data-album-id')));
  
  // Find current index and swap with next
  const currentIndex = cards.indexOf(card);
  if (currentIndex < cards.length - 1) {
    [albumIds[currentIndex], albumIds[currentIndex + 1]] = 
    [albumIds[currentIndex + 1], albumIds[currentIndex]];
    
    await saveNewOrder(albumIds, onReorder);
    
    // Move focus to maintain keyboard navigation
    setTimeout(() => {
      const newCard = albumList.querySelectorAll('.album-card')[currentIndex + 1];
      newCard?.focus();
    }, 100);
  }
}

/**
 * Save new album order
 * @param {number[]} albumIds - New order of album IDs
 * @param {Function} onReorder - Reorder callback
 */
async function saveNewOrder(albumIds, onReorder) {
  try {
    await reorderAlbums(albumIds);
    showNotification('Album moved', 'success', 1500);
    
    if (onReorder) {
      onReorder();
    }
  } catch (error) {
    showNotification('Failed to reorder albums', 'error');
    console.error('Keyboard reorder error:', error);
  }
}

/**
 * Show keyboard shortcuts help
 */
function showReorderHelp() {
  const issueMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifier = isMac ? 'Cmd' : 'Ctrl';
  
  showNotification(
    `Keyboard shortcuts: ${modifier}+↑ to move up, ${modifier}+↓ to move down`,
    'info',
    5000
  );
}
