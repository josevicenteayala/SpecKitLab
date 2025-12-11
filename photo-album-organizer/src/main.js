/**
 * Main Application Entry Point
 */

import './css/variables.css';
import './css/main.css';

import { initDatabase } from './db/database.js';
import { initStorage } from './js/storage.js';
import { initErrorHandler } from './js/utils/errorHandler.js';
import { initConfirmDialog } from './js/components/confirmDialog.js';
import { init as initNavigation } from './js/controllers/navigation.js';
import { showNotification } from './js/components/notification.js';

/**
 * Initialize the application
 */
async function init() {
  try {
    // Show loading indicator
    const appContainer = document.getElementById('album-list-container');
    if (appContainer) {
      appContainer.innerHTML = `
        <div class="loader-container" role="status" aria-live="polite">
          <div class="loader"></div>
          <p>Initializing application...</p>
        </div>
      `;
    }

    // Initialize error handler first
    initErrorHandler();

    // Initialize confirmation dialog
    initConfirmDialog();

    // Initialize database (SQLite)
    await initDatabase();

    // Initialize storage (IndexedDB)
    await initStorage();

    // Initialize navigation and load main view
    initNavigation();

    // Show success notification
    showNotification('Application loaded successfully', 'success', 2000);
  } catch (error) {
    console.error('Failed to initialize application:', error);
    
    // Show error in UI
    const appContainer = document.getElementById('album-list-container');
    if (appContainer) {
      appContainer.innerHTML = `
        <div class="error-state" role="alert">
          <div class="error-icon" aria-hidden="true">⚠️</div>
          <h3>Application Failed to Load</h3>
          <p>${error.message}</p>
          <button class="btn-primary" onclick="location.reload()">Reload</button>
        </div>
      `;
    }
  }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
