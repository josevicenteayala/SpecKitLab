/**
 * Confirmation Dialog Component
 * Reusable modal dialog for confirming destructive actions
 */

let dialogElement = null;
let resolveCallback = null;

/**
 * Initialize the confirmation dialog
 * Creates the dialog element and appends it to the DOM
 */
export function initConfirmDialog() {
  if (dialogElement) return;

  dialogElement = document.createElement('div');
  dialogElement.className = 'dialog-overlay';
  dialogElement.setAttribute('role', 'dialog');
  dialogElement.setAttribute('aria-modal', 'true');
  dialogElement.setAttribute('aria-labelledby', 'dialog-title');
  dialogElement.setAttribute('aria-describedby', 'dialog-message');
  dialogElement.style.display = 'none';

  dialogElement.innerHTML = `
    <div class="dialog-content">
      <h2 id="dialog-title" class="dialog-title"></h2>
      <p id="dialog-message" class="dialog-message"></p>
      <div class="dialog-actions">
        <button id="dialog-cancel" class="btn-secondary">Cancel</button>
        <button id="dialog-confirm" class="btn-primary btn-danger">Confirm</button>
      </div>
    </div>
  `;

  document.body.appendChild(dialogElement);

  // Event listeners
  dialogElement.querySelector('#dialog-cancel').addEventListener('click', () => {
    closeDialog(false);
  });

  dialogElement.querySelector('#dialog-confirm').addEventListener('click', () => {
    closeDialog(true);
  });

  // Close on overlay click
  dialogElement.addEventListener('click', (e) => {
    if (e.target === dialogElement) {
      closeDialog(false);
    }
  });

  // Handle escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialogElement.style.display === 'flex') {
      closeDialog(false);
    }
  });
}

/**
 * Show confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {Object} options - Additional options
 * @param {string} options.confirmText - Text for confirm button (default: "Confirm")
 * @param {string} options.cancelText - Text for cancel button (default: "Cancel")
 * @param {boolean} options.danger - Style confirm button as danger (default: true)
 * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
 */
export function showConfirmDialog(title, message, options = {}) {
  const {
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = true,
  } = options;

  if (!dialogElement) {
    initConfirmDialog();
  }

  return new Promise((resolve) => {
    resolveCallback = resolve;

    // Set content
    dialogElement.querySelector('#dialog-title').textContent = title;
    dialogElement.querySelector('#dialog-message').textContent = message;
    dialogElement.querySelector('#dialog-confirm').textContent = confirmText;
    dialogElement.querySelector('#dialog-cancel').textContent = cancelText;

    // Apply danger styling
    const confirmBtn = dialogElement.querySelector('#dialog-confirm');
    if (danger) {
      confirmBtn.classList.add('btn-danger');
    } else {
      confirmBtn.classList.remove('btn-danger');
    }

    // Show dialog
    dialogElement.style.display = 'flex';
    dialogElement.querySelector('#dialog-cancel').focus();
  });
}

/**
 * Close dialog and resolve promise
 * @param {boolean} confirmed - Whether the user confirmed
 */
function closeDialog(confirmed) {
  if (!dialogElement || !resolveCallback) return;

  dialogElement.style.display = 'none';
  resolveCallback(confirmed);
  resolveCallback = null;
}

/**
 * Convenience method for delete confirmations
 * @param {string} itemName - Name of the item being deleted
 * @param {string} itemType - Type of item (e.g., "album", "photo")
 * @returns {Promise<boolean>}
 */
export function confirmDelete(itemName, itemType = 'item') {
  return showConfirmDialog(
    `Delete ${itemType}?`,
    `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
    { confirmText: 'Delete', danger: true }
  );
}
