/**
 * Simple State Manager (Alternative to Redux/Vuex)
 * Centralized state management with observers
 */

class StateManager {
  constructor() {
    this.state = {
      currentUser: null,
      userRole: null,
      isAdmin: false,
      isPremium: false,
      currentLang: localStorage.getItem('totalLakayLang') || 'ht',
      currentCurrency: localStorage.getItem('totalLakayCurrency') || 'HTG',
      currentView: 'home',
      products: [],
      orders: [],
      cart: [],
      favorites: [],
      notifications: [],
      loading: false,
      error: null
    };

    this.observers = {};
  }

  /**
   * Get current state (immutable reference)
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Get specific state value
   */
  get(key) {
    return this.state[key];
  }

  /**
   * Update state (triggers observers)
   */
  setState(updates) {
    const previousState = { ...this.state };
    this.state = { ...this.state, ...updates };

    // Notify observers
    Object.keys(updates).forEach(key => {
      if (this.observers[key]) {
        this.observers[key].forEach(callback => {
          callback(this.state[key], previousState[key]);
        });
      }
    });

    console.log('🔄 State updated:', updates);
  }

  /**
   * Subscribe to state changes
   */
  subscribe(key, callback) {
    if (!this.observers[key]) {
      this.observers[key] = [];
    }
    this.observers[key].push(callback);

    // Return unsubscribe function
    return () => {
      this.observers[key] = this.observers[key].filter(cb => cb !== callback);
    };
  }

  /**
   * Subscribe to multiple state changes
   */
  subscribeMultiple(keys, callback) {
    const unsubscribers = keys.map(key =>
      this.subscribe(key, () => callback(this.getState()))
    );

    return () => unsubscribers.forEach(unsub => unsub());
  }

  /**
   * Reset state to initial
   */
  reset() {
    this.setState({
      currentUser: null,
      userRole: null,
      isAdmin: false,
      isPremium: false,
      currentView: 'home',
      products: [],
      orders: [],
      cart: [],
      notifications: [],
      error: null
    });
  }
}

const stateManager = new StateManager();

export default stateManager;
