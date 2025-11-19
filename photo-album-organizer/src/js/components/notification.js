/**
 * Notification (toast) component
 * @module components/notification
 */

const NOTIFICATION_DURATION = 4000; // 4 seconds

/**
 * Show a notification toast
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds
 */
export function showNotification(message, type = 'info', duration = NOTIFICATION_DURATION) {
  const container = document.getElementById('notification-container');
  if (!container) return;
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.setAttribute('role', 'alert');
  
  container.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.add('notification-show');
  }, 10);
  
  // Remove after duration
  setTimeout(() => {
    notification.classList.remove('notification-show');
    setTimeout(() => {
      container.removeChild(notification);
    }, 300);
  }, duration);
}

/**
 * Show success notification
 * @param {string} message - Success message
 */
export function showSuccess(message) {
  showNotification(message, 'success');
}

/**
 * Show error notification
 * @param {string} message - Error message
 */
export function showError(message) {
  showNotification(message, 'error');
}

/**
 * Show warning notification
 * @param {string} message - Warning message
 */
export function showWarning(message) {
  showNotification(message, 'warning');
}
