/**
 * Get items from local storage
 * @param {string} key
 * @returns {string}
 */
function getItems(key) {
  return localStorage.getItem(key);
}

/**
 * Set items in local storage
 * @param {string} key
 * @param {string} value
 */
function setItems(key, value) {
  localStorage.setItem(key, value);
}

/**
 * Remove item from local storage
 * @param {string} key
 */
function removeItem(key) {
  localStorage.removeItem(key);
}

export { getItems, setItems, removeItem };
