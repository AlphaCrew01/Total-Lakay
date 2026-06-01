/* ============================================
   FIX: Double Chargement & Initialisation
   ============================================ */

// Flag global pour éviter les doubles initialisations
let APP_INITIALIZED = false;
let APP_INITIALIZING = false;
const INITIALIZATION_TIMEOUT = 3000; // ms

// Fonction d'initialisation unifiée
async function initializeAppOnce() {
  // Éviter les initialisations multiples simultanées
  if (APP_INITIALIZED) {
    console.log('⚠️ App déjà initialisée, abandon');
    return;
  }
  
  if (APP_INITIALIZING) {
    console.log('⚠️ Initialisation en cours, attente...');
    return;
  }
  
  APP_INITIALIZING = true;
  const startTime = Date.now();
  
  try {
    console.log('🚀 Initialisation unique de l\'app...');
    
    // Étape 1: Charger le thème (rapide)
    loadTheme?.();
    
    // Étape 2: Charger la config IA (rapide)
    await initAIConfig?.();
    
    // Étape 3: Appliquer la langue (rapide)
    applyLanguage?.();
    
    // Étape 4: Passer l'initialisation à onAuthStateChanged
    // Celui-ci va charger les données et afficher l'UI
    
    console.log(`✅ Initialisation complétée en ${Date.now() - startTime}ms`);
    APP_INITIALIZED = true;
  } catch (error) {
    console.error('❌ Erreur initialisation:', error);
  } finally {
    APP_INITIALIZING = false;
  }
}

// Écoute l'authentification UNIQUE
let authStateInitialized = false;

const fixedAuthStateListener = async (user) => {
  console.log('📝 Changement d\'état Auth:', user ? user.email : 'déconnecté');
  
  currentUser = user;
  const authBtn = document.getElementById('authBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminElements = document.querySelectorAll('.admin-only');
  const userElements = document.querySelectorAll('.user-only');

  if (user) {
    // Vérifier email
    if (!user.emailVerified) {
      showMessage?.('Veuillez vérifier votre email', 'error');
      setTimeout(() => {
        if (currentUser && !currentUser.emailVerified) {
          auth.signOut();
        }
      }, 5000);
      return;
    }

    try {
      // Charger le profil utilisateur
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        userRole = userDoc.data().role || 'client';
        isAdmin = userRole === 'admin';
        isPremium = userDoc.data().isPremium || isAdmin;

        // Vérifier le consentement
        if (!isAdmin && !userDoc.data().termsAccepted) {
          document.getElementById('consentModal')?.classList.remove('hidden');
        }
      } else {
        // Créer le profil utilisateur s'il n'existe pas
        userRole = 'client';
        isAdmin = false;
        await db.collection('users').doc(user.uid).set({
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          role: 'client',
          emailVerified: true,
          termsAccepted: false,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById('consentModal')?.classList.remove('hidden');
      }
    } catch (e) {
      console.error('Erreur chargement profil:', e);
      userRole = 'client';
      isAdmin = false;
    }

    // Afficher les boutons appropriés
    if (authBtn) authBtn.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.remove('hidden');
    userElements.forEach(el => el.classList.remove('hidden'));

    if (isAdmin) {
      adminElements.forEach(el => el.classList.remove('hidden'));
    } else {
      adminElements.forEach(el => el.classList.add('hidden'));
    }

    if (logoutBtn) {
      logoutBtn.innerHTML = `🚪 <span>${(isAdmin ? 'Admin: ' : '') + (t?.('logout') || 'Déconnecte')}</span>`;
    }

    // Écouter les notifications
    listenNotifications?.();
    
    // Mettre à jour la présence
    updatePresence?.();
    setInterval(updatePresence, 2 * 60 * 1000);
  } else {
    // Utilisateur déconnecté
    if (authBtn) authBtn.classList.remove('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
    adminElements.forEach(el => el.classList.add('hidden'));
    userElements.forEach(el => el.classList.add('hidden'));
    isAdmin = false;
    userRole = null;
  }

  // 🔑 CORRECTION: Afficher la vue QUE UNE SEULE FOIS
  if (!authStateInitialized) {
    authStateInitialized = true;
    
    // Corriger la vue si elle n'est pas appropriée
    if (currentView === 'admin' && !isAdmin) {
      currentView = 'home';
    }
    
    console.log('🎯 Affichage de la vue:', currentView, '| Rôle:', userRole);
    renderView?.(currentView);
    
    // Charger les données si admin
    if (isAdmin) {
      console.log('📊 Chargement des données admin...');
      loadAllData?.();
    }
    
    // Charger les notifications
    loadNotifications?.();
  } else {
    // Si c'est un changement d'état (reconnexion/déconnexion), rafraîchir
    console.log('🔄 Rafraîchissement après changement d\'état');
    renderView?.(currentView);
  }
};

// Remplacer l'écoute auth
if (window.auth) {
  auth.onAuthStateChanged(fixedAuthStateListener);
}

// ============================================
// CORRECTION: Éviter les appels multiples de DOMContentLoaded
// ============================================

let domContentLoadedFired = false;

document.addEventListener('DOMContentLoaded', async () => {
  if (domContentLoadedFired) {
    console.warn('⚠️ DOMContentLoaded s\'est déclenché plusieurs fois!');
    return;
  }
  domContentLoadedFired = true;

  console.log('🚀 Total Lakay - Initialisation');

  // Initialiser l'app UNE FOIS
  await initializeAppOnce();

  // Configuration de la navigation (une seule fois)
  setupNavigation?.();
  setupEventListeners?.();
});

// ============================================
// CORRECTION: Désactiver les initialisations multiples
// ============================================

// Créer un alias sûr pour renderView
const originalRenderView = window.renderView;
let lastRenderedView = null;
let isCurrentlyRendering = false;

window.renderView = async function(view) {
  if (isCurrentlyRendering) {
    console.warn(`⚠️ Rendu de '${view}' déjà en cours, ignoré`);
    return;
  }
  
  if (view === lastRenderedView) {
    console.log(`ℹ️ Vue '${view}' déjà rendue, pas de changement`);
    return;
  }
  
  isCurrentlyRendering = true;
  lastRenderedView = view;
  
  try {
    if (originalRenderView) {
      await originalRenderView.call(this, view);
    }
  } finally {
    isCurrentlyRendering = false;
  }
};

// ============================================
// CORRECTION: Monitorer les problèmes de chargement
// ============================================

window.addEventListener('load', () => {
  console.log('✅ Page complètement chargée');
  
  // Vérifier les données d'intégrité si admin
  if (isAdmin) {
    validateDataIntegrity?.().then(issues => {
      if (issues.length > 0) {
        console.warn(`⚠️ ${issues.length} problèmes détectés`);
      }
    });
  }
});

window.addEventListener('unload', () => {
  console.log('👋 Déchargement de la page');
  if (currentUser && isAdmin) {
    logSecurityEvent?.('session_end', { view: currentView });
  }
});

// ============================================
// CORRECTION: Gestion des erreurs globales
// ============================================

window.addEventListener('error', (event) => {
  console.error('❌ Erreur JavaScript:', event.error);
  logSecurityEvent?.('javascript_error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promise rejetée non gérée:', event.reason);
  logSecurityEvent?.('unhandled_rejection', {
    reason: String(event.reason)
  });
});

console.log('✅ Fixes d\'initialisation chargés');
