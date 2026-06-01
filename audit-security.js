/**
 * AUDIT ET CORRECTIONS DE SÉCURITÉ - Total Lakay
 * Ce module effectue des vérifications de sécurité et des corrections
 */

// ============================================
// 1. AUDIT DES DONNÉES FICTIVES & PAIEMENTS
// ============================================

async function auditTestData() {
  console.log('🔍 Audit des données de test en cours...');
  
  try {
    const ordersSnap = await db.collection('orders').get();
    const orders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    const testPatterns = [
      /test|demo|test order|fake|simulation|développement/i,
      /dev|test@/i,
      /123456|111111|999999/,  // Patterns de numéros fictifs
    ];
    
    const suspiciousOrders = [];
    
    for (const order of orders) {
      let isTestData = false;
      let reason = [];
      
      // Vérifier les patterns de test
      for (const pattern of testPatterns) {
        if (pattern.test(order.productName) || 
            pattern.test(order.userEmail) ||
            pattern.test(order.address) ||
            pattern.test(order.phone)) {
          isTestData = true;
          reason.push('Pattern de test détecté');
        }
      }
      
      // Vérifier les paiements fictifs
      if (order.paymentStatus === 'paid' && !order.paymentReference) {
        isTestData = true;
        reason.push('Paiement "paid" sans référence');
      }
      
      // Vérifier les montants suspects
      if (order.price < 0 || order.price > 1000000) {
        isTestData = true;
        reason.push('Montant suspect');
      }
      
      // Vérifier l'utilisateur Matheo spécifiquement
      if (order.userId === currentUser?.uid || order.userEmail?.includes('matheo')) {
        reason.push('Compte Matheo');
      }
      
      if (isTestData || reason.length > 0) {
        suspiciousOrders.push({ ...order, reason });
      }
    }
    
    console.log('📊 Résultats de l\'audit:');
    console.log(`Total commandes: ${orders.length}`);
    console.log(`Commandes suspectes: ${suspiciousOrders.length}`);
    console.log('Détails:', suspiciousOrders);
    
    return { orders, suspiciousOrders };
  } catch (e) {
    console.error('Erreur audit:', e);
    return { orders: [], suspiciousOrders: [] };
  }
}

async function auditUserBalances() {
  console.log('💰 Audit des soldes utilisateurs...');
  
  try {
    const usersSnap = await db.collection('users').get();
    const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    const suspiciousBalances = [];
    
    for (const user of users) {
      const balance = user.balance || 0;
      
      // Vérifier les soldes irréalistes
      if (balance > 1000000 || balance < 0) {
        suspiciousBalances.push({
          ...user,
          reason: 'Solde irréaliste',
          balance
        });
      }
      
      // Calculer le solde réel à partir des transactions
      const ordersSnap = await db.collection('orders')
        .where('userId', '==', user.id)
        .get();
      
      const orders = ordersSnap.docs.map(d => d.data());
      const validOrders = orders.filter(o => o.paymentStatus === 'paid');
      const calculatedBalance = validOrders.reduce((sum, o) => sum + (o.price || 0), 0);
      
      if (Math.abs(balance - calculatedBalance) > 0.01) {
        console.warn(`⚠️ Incohérence pour ${user.displayName}: solde ${balance} vs calculé ${calculatedBalance}`);
      }
    }
    
    console.log(`Total utilisateurs: ${users.length}`);
    console.log(`Soldes suspects: ${suspiciousBalances.length}`);
    console.log('Détails:', suspiciousBalances);
    
    return { users, suspiciousBalances };
  } catch (e) {
    console.error('Erreur audit soldes:', e);
    return { users: [], suspiciousBalances: [] };
  }
}

async function auditPaymentConsistency() {
  console.log('🔐 Audit de cohérence des paiements...');
  
  try {
    const ordersSnap = await db.collection('orders').get();
    const orders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    const moncashSnap = await db.collection('moncash_requests').get();
    const moncashRequests = moncashSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    const inconsistencies = [];
    
    // Chercher les commandes sans paiement réel
    for (const order of orders) {
      if (order.paymentStatus === 'paid' && order.paymentMethod === 'MonCash') {
        const paymentRecord = moncashRequests.find(m => m.orderId === order.id);
        if (!paymentRecord || paymentRecord.status !== 'success') {
          inconsistencies.push({
            type: 'missing-payment-record',
            orderId: order.id,
            message: 'Commande marquée payée sans enregistrement MonCash valide'
          });
        }
      }
    }
    
    // Chercher les remboursements sans paiement original
    const refundSnap = await db.collection('notifications')
      .where('type', '==', 'refund')
      .get();
    
    const refunds = refundSnap.docs.map(d => d.data());
    console.log(`💸 ${refunds.length} remboursements détectés`);
    
    console.log(`Incohérences trouvées: ${inconsistencies.length}`);
    console.log('Détails:', inconsistencies);
    
    return { orders, moncashRequests, inconsistencies };
  } catch (e) {
    console.error('Erreur audit paiements:', e);
    return { orders: [], moncashRequests: [], inconsistencies: [] };
  }
}

// ============================================
// 2. FONCTION CORRIGÉE DE REMBOURSEMENT SÉCURISÉE
// ============================================

async function refundUserSecure(userId, amount, orderId) {
  console.log(`🔒 Remboursement sécurisé pour ${userId}...`);
  
  try {
    // ÉTAPE 1: Vérifier que l'ordre existe
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      throw new Error('Commande non trouvée');
    }
    
    const order = orderDoc.data();
    
    // ÉTAPE 2: Vérifier que l'utilisateur correspond
    if (order.userId !== userId) {
      throw new Error('L\'utilisateur ne correspond pas à la commande');
    }
    
    // ÉTAPE 3: Vérifier qu'un paiement réel a été effectué
    if (order.paymentStatus !== 'paid') {
      throw new Error(`Impossible de rembourser: le paiement n'est pas confirmé (statut: ${order.paymentStatus})`);
    }
    
    // ÉTAPE 4: Pour MonCash, vérifier le paiement dans moncash_requests
    if (order.paymentMethod === 'MonCash') {
      const moncashSnap = await db.collection('moncash_requests')
        .where('orderId', '==', orderId)
        .where('status', '==', 'success')
        .get();
      
      if (moncashSnap.empty) {
        throw new Error('Aucun paiement MonCash valide trouvé pour cette commande');
      }
    }
    
    // ÉTAPE 5: Effectuer le remboursement en transaction
    const userRef = db.collection('users').doc(userId);
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) throw new Error('Utilisateur non trouvé');
      
      const currentBalance = userDoc.data().balance || 0;
      
      // Mettre à jour le solde
      transaction.update(userRef, {
        balance: currentBalance + amount,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Enregistrer la transaction de remboursement
      transaction.set(db.collection('refund_transactions').doc(), {
        userId,
        orderId,
        amount,
        paymentMethod: order.paymentMethod,
        status: 'completed',
        processedAt: firebase.firestore.FieldValue.serverTimestamp(),
        notes: `Remboursement de ${amount} pour commande #${orderId.substring(0, 6)}`
      });
      
      // Notifier l'utilisateur
      transaction.set(db.collection('notifications').doc(), {
        targetUserId: userId,
        title: '💸 Remboursement traité',
        message: `Remboursement de ${formatPrice(amount)} pour commande #${orderId.substring(0, 6)} approuvé.`,
        type: 'refund',
        read: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Mettre à jour le statut de la commande
      transaction.update(db.collection('orders').doc(orderId), {
        status: 'refunded',
        refundedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
    
    showMessage('✅ Remboursement traité avec succès!', 'success');
    return true;
  } catch (e) {
    console.error('Erreur remboursement:', e);
    showMessage('❌ Erreur remboursement: ' + e.message, 'error');
    return false;
  }
}

// ============================================
// 3. VALIDATION SÉCURISÉE DES COMMANDES
// ============================================

async function validateOrderSecure(orderId) {
  console.log(`✅ Validation sécurisée de commande ${orderId}...`);
  
  try {
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) throw new Error('Commande non trouvée');
    
    const order = orderDoc.data();
    
    // Vérifier le paiement AVANT de valider
    if (order.paymentMethod === 'MonCash') {
      if (order.paymentStatus !== 'paid') {
        throw new Error('Paiement MonCash non confirmé. Impossible de valider.');
      }
      
      // Vérifier dans moncash_requests
      const moncashSnap = await db.collection('moncash_requests')
        .where('orderId', '==', orderId)
        .get();
      
      const successPayment = moncashSnap.docs.find(d => d.data().status === 'success');
      if (!successPayment) {
        throw new Error('Aucun paiement MonCash valide enregistré');
      }
    } else if (order.paymentMethod === 'cash_due') {
      // Pour le paiement à la livraison, on peut valider
      // mais on marque comme "pending_delivery_payment"
      if (order.paymentStatus !== 'cash_due' && order.paymentStatus !== 'paid') {
        throw new Error('Statut de paiement invalide pour cash_due');
      }
    }
    
    // Mettre à jour le statut
    await db.collection('orders').doc(orderId).update({
      status: 'validated',
      validatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true, message: 'Commande validée' };
  } catch (e) {
    console.error('Erreur validation:', e);
    return { success: false, message: e.message };
  }
}

// ============================================
// 4. NETTOYAGE DES DONNÉES FICTIVES
// ============================================

async function deleteTestOrder(orderId) {
  if (!confirm('Êtes-vous sûr? Cette action est irréversible.')) return;
  
  console.log(`🗑️ Suppression de la commande de test ${orderId}...`);
  
  try {
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) throw new Error('Commande non trouvée');
    
    const order = orderDoc.data();
    
    // Supprimer la commande
    await db.collection('orders').doc(orderId).delete();
    
    // Supprimer les requêtes de paiement associées
    const moncashSnap = await db.collection('moncash_requests')
      .where('orderId', '==', orderId)
      .get();
    
    for (const doc of moncashSnap.docs) {
      await doc.ref.delete();
    }
    
    console.log('✅ Commande de test supprimée');
    showMessage('✅ Données de test supprimées', 'success');
  } catch (e) {
    console.error('Erreur suppression:', e);
    showMessage('❌ Erreur: ' + e.message, 'error');
  }
}

async function resetUserBalance(userId) {
  if (!confirm('Êtes-vous ABSOLUMENT sûr? Cela recalculera le solde de cet utilisateur.')) return;
  
  console.log(`🔄 Réinitialisation du solde pour ${userId}...`);
  
  try {
    // Calculer le solde réel
    const ordersSnap = await db.collection('orders')
      .where('userId', '==', userId)
      .where('paymentStatus', '==', 'paid')
      .get();
    
    let correctBalance = 0;
    for (const doc of ordersSnap.docs) {
      const order = doc.data();
      correctBalance += order.price || 0;
    }
    
    // Mettre à jour le solde
    await db.collection('users').doc(userId).update({
      balance: correctBalance,
      balanceAuditedAt: firebase.firestore.FieldValue.serverTimestamp(),
      balanceResetReason: 'Audit de sécurité'
    });
    
    console.log(`✅ Solde réinitialisé à ${correctBalance}`);
    showMessage(`✅ Solde recalculé: ${formatPrice(correctBalance)}`, 'success');
  } catch (e) {
    console.error('Erreur réinitialisation:', e);
    showMessage('❌ Erreur: ' + e.message, 'error');
  }
}

// Exporter pour utilisation en console (développeurs)
window.AuditSecurity = {
  auditTestData,
  auditUserBalances,
  auditPaymentConsistency,
  refundUserSecure,
  validateOrderSecure,
  deleteTestOrder,
  resetUserBalance
};

console.log('✅ Module Audit & Sécurité chargé');
console.log('Utilisation: AuditSecurity.auditTestData(), etc.');
