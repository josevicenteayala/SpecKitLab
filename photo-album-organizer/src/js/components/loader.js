/**
 * Loader Component
 * Loading spinner for async operations
 */

/**
 * Create a loader element
 * @param {string} message - Loading message (default: "Loading...")
 * @returns {HTMLElement} Loader element
 */
export function createLoader(message = 'Loading...') {
  const container = document.createElement('div');
  container.className = 'loader-container';
  container.setAttribute('role', 'status');
  container.setAttribute('aria-live', 'polite');
  container.setAttribute('aria-busy', 'true');

  container.innerHTML = `
    <div class="loader" aria-hidden="true"></div>
    <p class="loader-message">${message}</p>
  `;

  return container;
}

/**
 * Show loader in a container
 * @param {HTMLElement} container - Container element
 * @param {string} message - Loading message
 */
export function showLoader(container, message = 'Loading...') {
  const loader = createLoader(message);
  container.innerHTML = '';
  container.appendChild(loader);
}

/**
 * Remove loader from a container
 * @param {HTMLElement} container - Container element
 */
export function hideLoader(container) {
  const loader = container.querySelector('.loader-container');
  if (loader) {
    loader.remove();
  }
}

/**
 * Create inline loader (smaller, for buttons)
 * @returns {HTMLElement} Inline loader element
 */
export function createInlineLoader() {
  const loader = document.createElement('span');
  loader.className = 'loader-inline';
  loader.setAttribute('aria-hidden', 'true');
  return loader;
}
