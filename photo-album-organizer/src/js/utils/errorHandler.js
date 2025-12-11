/**
 * Global error handler and error boundary
 * @module utils/errorHandler
 */

import { showNotification } from '../components/notification.js';

/**
 * Initialize global error handlers
 */
export function initErrorHandler() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification(
      'An unexpected error occurred. Please try again.',
      'error'
    );
    event.preventDefault();
  });
  
  // Handle global errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showNotification(
      'An unexpected error occurred. Please refresh the page.',
      'error'
    );
  });
}

/**
 * Wrap async functions with error handling
 * @param {Function} fn - Async function to wrap
 * @param {string} errorMessage - User-friendly error message
 * @returns {Function} Wrapped function
 */
export function withErrorHandling(fn, errorMessage = 'An error occurred') {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(error);
      showNotification(errorMessage, 'error');
      throw error;
    }
  };
}

/**
 * Handle storage quota exceeded error
 * @param {Error} error - Error object
 */
export function handleStorageError(error) {
  if (error.name === 'QuotaExceededError') {
    showNotification(
      'Storage quota exceeded. Please delete some photos to free up space.',
      'error'
    );
  } else {
    showNotification(
      'Failed to store data. Please check your browser storage settings.',
      'error'
    );
  }
}
