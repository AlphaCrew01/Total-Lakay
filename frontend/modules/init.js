/**
 * Application Initialization
 * Entry point that sets up all modules
 */

import { initializeFirebase } from '../services/firebase.js';
import stateManager from '../state/stateManager.js';
import logger from '../utils/logger.js';
import storage from '../utils/storage.js';
import i18n from '../utils/i18n.js';
import currencyManager from '../utils/currency.js';
import { applyRoleBasedVisibility, getUserRole } from '../modules/auth.js';

class AppInitializer {
  constructor() {
    this.initialized = false;
    this.initPromise = null;
  }

  /**
   * Initialize the application
   */
  async init() {
    if (this.initialized) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._doInit();
    return this.initPromise;
  }

  async _doInit() {
    try {
      logger.info('🚀 Starting Total Lakay Application...');

      // 1. Initialize Firebase
      logger.info('📡 Initializing Firebase...');
      initializeFirebase();

      // 2. Restore previous state from storage
      logger.info('💾 Restoring application state...');
      this._restoreState();

      // 3. Update exchange rates
      logger.info('💱 Updating exchange rates...');
      await currencyManager.updateRates();

      // 4. Setup authentication listener
      logger.info('🔐 Setting up authentication...');
      this._setupAuthListener();

      // 5. Setup event listeners
      logger.info('🎯 Setting up event listeners...');
      this._setupEventListeners();

      logger.success('✅ Application initialized successfully');
      this.initialized = true;

      return true;
    } catch (error) {
      logger.error('❌ Application initialization failed', error);
      throw error;
    }
  }

  /**
   * Restore state from storage
   */
  _restoreState() {
    try {
      const savedLang = storage.getItem('lang', 'ht');
      const savedCurrency = storage.getItem('currency', 'HTG');
      const cart = storage.getItem('cart', []);
      const favorites = storage.getItem('favorites', []);

      i18n.setLanguage(savedLang);
      
      stateManager.setState({
        currentLang: savedLang,
        currentCurrency: savedCurrency,
        cart,
        favorites
      });

      logger.debug('State restored', { savedLang, savedCurrency });
    } catch (error) {
      logger.warn('⚠️ Failed to restore state', error);
    }
  }

  /**
   * Setup authentication listener
   */
  _setupAuthListener() {
    const { auth, db } = require('../services/firebase.js').getFirebaseServices();

    auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          logger.info('👤 User logged in', { uid: user.uid, email: user.email });

          // Get user role
          const role = await getUserRole(user.uid);
          const isAdmin = role === 'admin';

          stateManager.setState({
            currentUser: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified
            },
            userRole: role,
            isAdmin
          });

          // Apply role-based visibility
          applyRoleBasedVisibility();
        } else {
          logger.info('👤 User logged out');
          stateManager.setState({
            currentUser: null,
            userRole: 'client',
            isAdmin: false
          });
        }
      } catch (error) {
        logger.error('❌ Auth state change error', error);
      }
    });
  }

  /**
   * Setup global event listeners
   */
  _setupEventListeners() {
    // Save state to storage when it changes
    stateManager.subscribeMultiple(['cart', 'favorites'], () => {
      const state = stateManager.getState();
      storage.setItem('cart', state.cart);
      storage.setItem('favorites', state.favorites);
    });

    // Update exchange rates periodically
    setInterval(() => {
      currencyManager.updateRates().catch(error => {
        logger.warn('⚠️ Periodic exchange rate update failed', error);
      });
    }, 6 * 60 * 60 * 1000); // Every 6 hours

    // Handle online/offline
    window.addEventListener('online', () => {
      logger.info('🟢 Application is online');
      currencyManager.updateRates().catch(() => {});
    });

    window.addEventListener('offline', () => {
      logger.warn('🔴 Application is offline');
    });
  }
}

const appInitializer = new AppInitializer();

export default appInitializer;
