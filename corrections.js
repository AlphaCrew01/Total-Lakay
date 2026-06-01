/* ============================================
   CORRECTIONS MAJEURES - Total Lakay
   Corrections pour les problèmes de sécurité
   ============================================ */

// ============================================
// 1. CORRECTION: Éviter les commandes fictives
// ============================================

// Intercepter la création de commande pour valider
const originalCartAdd = window.addToCart;
window.addToCart = function(productId, quantity = 1) {
  // Vérifier que le produit existe
  const product = products.find(p => p.id === productId);
  if (!product) {
    console.warn('⚠️ Tentative d\'ajouter un produit qui n\'existe pas:', productId);
    showMessage('❌ Produit non trouvé', 'error');
    return;
  }
  
  // Vérifier que le prix est réaliste
  if (product.price < 0 || product.price > 1000000) {
    console.error('❌ Prix suspect:', product.price);
    showMessage('❌ Erreur: prix invalide', 'error');
    return;
  }
  
  if (originalCartAdd) originalCartAdd.call(this, productId, quantity);
};

// ============================================
// 2. CORRECTION: Éviter le double chargement
// ============================================

// Flag pour éviter les rendu multiple
let isInitialized = false;
let isRendering = false;

// Remplacement de renderView pour éviter les doublons
const originalRenderView = window.renderView;
window.renderView = async function(view) {
  // Éviter les rendus simultanés
  if (isRendering) {
    console.warn('⚠️ Rendu déjà en cours, ignoré');
    return;
  }
  
  isRendering = true;
  try {
    if (originalRenderView) await originalRenderView.call(this, view);
  } finally {
    isRendering = false;
  }
};

// ============================================
// 3. CORRECTION: Gestion centralisée des rôles
// ============================================

// Fonction pour afficher/masquer les éléments selon le rôle
function applyRoleBasedVisibility() {
  const effectiveRole = userRole || 'guest';
  const isAdminUser = isAdmin;
  
  // Afficher/masquer les éléments selon le rôle
  document.querySelectorAll('.admin-only').forEach(el => {
    el.classList.toggle('hidden', !isAdminUser);
  });
  
  document.querySelectorAll('.vendor-only').forEach(el => {
    el.classList.toggle('hidden', effectiveRole !== 'vendor');
  });

  document.querySelectorAll('.admin-or-vendor-only').forEach(el => {
    el.classList.toggle('hidden', !(isAdminUser || effectiveRole === 'vendor'));
  });
  
  document.querySelectorAll('.client-only').forEach(el => {
    el.classList.toggle('hidden', !currentUser);
  });
  
  document.querySelectorAll('.user-only').forEach(el => {
    el.classList.toggle('hidden', !currentUser);
  });
  
  console.log(`✅ Visibilité appliquée pour: ${effectiveRole}${isAdminUser ? ' (Admin)' : ''}`);
}

// Appeler après la connexion
const originalOnAuthStateChanged = auth?.onAuthStateChanged;
if (originalOnAuthStateChanged) {
  // Ce code s'exécutera après l'authentification
  setTimeout(applyRoleBasedVisibility, 500);
}

// ============================================
// 4. CORRECTION: Validation stricte des paiements
// ============================================

// Fonction pour vérifier qu'une commande peut être remboursée
async function canRefundOrder(orderId) {
  try {
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) return { can: false, reason: 'Commande non trouvée' };
    
    const order = orderDoc.data();
    
    // Un remboursement ne peut avoir lieu que si :
    // 1. Le paiement a été confirmé (paymentStatus === 'paid')
    // 2. Une transaction réelle existe
    
    if (order.paymentStatus !== 'paid') {
      return {
        can: false,
        reason: `Paiement non confirmé (statut: ${order.paymentStatus})`
      };
    }
    
    // Vérifier pour MonCash
    if (order.paymentProvider === 'MonCash') {
      const moncashSnap = await db.collection('moncash_requests')
        .where('orderId', '==', orderId)
        .where('status', '==', 'paid')
        .get();
      
      if (moncashSnap.empty) {
        return {
          can: false,
          reason: 'Aucune confirmation MonCash trouvée'
        };
      }
    }
    
    return {
      can: true,
      reason: 'Remboursement autorisé',
      order
    };
  } catch (e) {
    console.error('Erreur vérification remboursement:', e);
    return { can: false, reason: e.message };
  }
}

// ============================================
// 5. CORRECTION: Logs améliorés pour la sécurité
// ============================================

// Fonction pour enregistrer les actions critiques
async function logSecurityEvent(action, details) {
  const event = {
    action,
    details,
    userId: currentUser?.uid,
    timestamp: new Date().toISOString(),
    url: window.location.href
  };
  
  try {
    await db.collection('security_logs').add(event);
    console.log('🔐 Événement sécurité enregistré:', action);
  } catch (e) {
    console.error('Erreur enregistrement événement:', e);
  }
}

// Enregistrer les actions sensibles
window.addEventListener('beforeunload', () => {
  if (currentUser && isAdmin) {
    logSecurityEvent('admin_session_end', { lastView: currentView });
  }
});

// ============================================
// 6. CORRECTION: Validation des données
// ============================================

// Vérifier l'intégrité des données
async function validateDataIntegrity() {
  console.log('🔍 Vérification de l\'intégrité des données...');
  
  const issues = [];
  
  // Vérifier les commandes
  const ordersSnap = await db.collection('orders').get();
  for (const doc of ordersSnap.docs) {
    const order = doc.data();
    
    // Vérification 1: Une commande payée doit avoir une référence de paiement
    if (order.paymentStatus === 'paid' && !order.paymentReference) {
      issues.push(`Commande ${doc.id}: 'paid' sans référence`);
    }
    
    // Vérification 2: Prix negatif ou trop élevé
    if (order.price < 0 || order.price > 1000000) {
      issues.push(`Commande ${doc.id}: prix invalide (${order.price})`);
    }
  }
  
  if (issues.length > 0) {
    console.warn('⚠️ Problèmes d\'intégrité détectés:', issues);
  } else {
    console.log('✅ Intégrité des données OK');
  }
  
  return issues;
}

// ============================================
// 7. CORRECTION: Affichage des informations de débogage
// ============================================

// Ajouter un badge de debug en mode développement
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🚀 Mode Développement Active');
  console.log('Commandes utiles pour l\'audit:');
  console.log('  - AuditSecurity.auditTestData()');
  console.log('  - AuditSecurity.auditUserBalances()');
  console.log('  - AuditSecurity.auditPaymentConsistency()');
  console.log('  - canRefundOrder(orderId)');
  console.log('  - validateDataIntegrity()');
}

// ============================================
// 8. CORRECTION: Initialisation sécurisée
// ============================================

// S'assurer que les données critiques sont chargées avant d'afficher l'UI
document.addEventListener('DOMContentLoaded', async () => {
  if (!isInitialized) {
    isInitialized = true;
    
    // Attendre un peu pour que les scripts se chargent
    setTimeout(() => {
      applyRoleBasedVisibility();
      if (isAdmin) {
        console.log('🔓 Accès Admin Détecté');
      }
    }, 1000);
  }
});

console.log('✅ Module Corrections chargé');
