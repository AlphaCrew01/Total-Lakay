/**
 * Secure Storage Manager
 * Handles localStorage with encryption ready support
 */

class SecureStorage {
  constructor(prefix = 'tl_') {
    this.prefix = prefix;
  }

  /**
   * Set item with prefix
   */
  setItem(key, value) {
    try {
      const prefixedKey = this.prefix + key;
      const serialized = JSON.stringify(value);
      localStorage.setItem(prefixedKey, serialized);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }

  /**
   * Get item with prefix
   */
  getItem(key, defaultValue = null) {
    try {
      const prefixedKey = this.prefix + key;
      const item = localStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage error:', error);
      return defaultValue;
    }
  }

  /**
   * Remove item
   */
  removeItem(key) {
    const prefixedKey = this.prefix + key;
    localStorage.removeItem(prefixedKey);
  }

  /**
   * Clear all prefixed items
   */
  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }

  /**
   * Get all items as object
   */
  getAllItems() {
    const items = {};
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => {
        const cleanKey = key.replace(this.prefix, '');
        items[cleanKey] = this.getItem(cleanKey);
      });
    return items;
  }
}

const storage = new SecureStorage();

export default storage;
