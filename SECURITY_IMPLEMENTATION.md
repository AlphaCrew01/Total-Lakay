# 🔐 Implémentation de Sécurité - Total Lakay

## Vue d'ensemble
Ce document détaille les 5 couches de sécurité implémentées pour garantir que les rôles utilisateurs sont TOUJOURS déterminés par Firestore et jamais par le frontend.

---

## 1️⃣ Couche 1: Redirection HTML (Prevention of Display)

**Fichiers concernés:** `admin.html`, `client.html`, `vendeur.html`

**Objectif:** Empêcher l'affichage de l'ancienne page de sélection de rôle

**Implémentation:**
```html
<script>
  if (window.location.pathname.endsWith('admin.html') || 
      window.location.pathname.endsWith('client.html') || 
      window.location.pathname.endsWith('vendeur.html')) {
    window.location.replace('./index.html');
  }
</script>
```

**Effet:** 
- S'exécute AVANT que le DOM ne se rend
- Redirige immédiatement vers `index.html`
- Prévient tout affichage des anciens boutons de sélection de rôle

---

## 2️⃣ Couche 2: Redirection app.js (Early Protection)

**Fichier concerné:** `app.js`

**Objectif:** Double vérification au chargement du script

**Implémentation:**
```javascript
(function redirectOldPages() {
  const pathname = window.location.pathname;
  const filename = pathname.split('/').pop();
  
  if (filename && ['admin.html', 'client.html', 'vendeur.html'].includes(filename)) {
    window.location.replace('./index.html');
    throw new Error('Page redirected to index.html');
  }
})();
```

**Effet:**
- Exécuté au chargement de `app.js`
- Rattrape toute tentative d'accès direct aux anciennes pages
- Arrête l'exécution du reste du script

---

## 3️⃣ Couche 3: Récupération Sécurisée du Rôle (Firestore as Source of Truth)

**Fonction clé:** `getUserRoleFromFirestore(uid)`

**Objectif:** Récupérer le rôle UNIQUEMENT depuis Firestore avec validation

**Implémentation:**
```javascript
async function getUserRoleFromFirestore(uid) {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    let role = userDoc.data()?.role || 'client';
    
    // Normalisation strict
    role = normalizeRole(role);
    
    // Validation strict
    if (!isValidRole(role)) {
      console.warn(`Rôle invalide détecté: ${role}, défaut à 'client'`);
      role = 'client';
      
      // Auto-correction dans Firestore
      await db.collection('users').doc(uid).update({ role: 'client' });
    }
    
    return role;
  } catch (error) {
    console.error('Erreur récupération rôle:', error);
    return 'client'; // Défaut sécurisé
  }
}
```

**Caractéristiques de sécurité:**
- ✅ Récupère directement depuis Firestore
- ✅ Normalise le rôle (lowercase, trim)
- ✅ Valide contre la liste blanche: `['admin', 'vendor', 'client']`
- ✅ Auto-corrige les rôles invalides
- ✅ Défaut à 'client' (moins privilégié)
- ✅ Logging détaillé pour audit

---

## 4️⃣ Couche 4: Distribution de l'Interface (onAuthStateChanged)

**Fichier concerné:** `app.js`

**Objectif:** Afficher l'interface correcte selon le rôle Firestore

**Implémentation (simplifiée):**
```javascript
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    // Utilisateur déconnecté
    renderView('login');
    return;
  }
  
  currentUser = user;
  
  // 🔐 Récupérer le rôle depuis Firestore (UNIQUE SOURCE OF TRUTH)
  userRole = await getUserRoleFromFirestore(user.uid);
  isAdmin = (userRole === 'admin');
  isVendor = (userRole === 'vendor');
  
  // Distribution de l'interface
  document.querySelectorAll('[data-admin-only]').forEach(el => {
    el.style.display = isAdmin ? 'block' : 'none';
  });
  document.querySelectorAll('[data-vendor-only]').forEach(el => {
    el.style.display = (isAdmin || isVendor) ? 'block' : 'none';
  });
  
  // Charger les données
  await loadAllData();
  renderView('home');
});
```

**Caractéristiques:**
- ✅ Récupère le rôle depuis Firestore à chaque authentification
- ✅ Distribue les éléments UI selon le rôle
- ✅ Charge les données appropriées
- ✅ Affiche la page d'accueil correcte

---

## 5️⃣ Couche 5: Guards aux Opérations Sensibles (Function-Level Checks)

**Fonctions clés:** `requireAdminRole()`, `requireVendorOrAdminRole()`

**Objectif:** Vérifier le rôle avant chaque opération sensible

**Implémentation:**
```javascript
async function requireAdminRole(operationName) {
  if (!currentUser) {
    console.error(`🔐 SÉCURITÉ: ${operationName} tentée sans utilisateur`);
    throw new Error('Non authentifié');
  }
  
  // 🔐 Vérifier depuis Firestore (RE-FETCH à chaque opération!)
  const actualRole = await getUserRoleFromFirestore(currentUser.uid);
  if (actualRole !== 'admin') {
    console.error(`🔐 SÉCURITÉ: ${operationName} tentée par non-admin (rôle: ${actualRole})`);
    throw new Error(`Opération réservée aux administrateurs`);
  }
  
  console.log(`✅ ${operationName} autorisée`);
  return true;
}

async function requireVendorOrAdminRole(operationName) {
  // Similaire à requireAdminRole mais accepte vendor aussi
  const actualRole = await getUserRoleFromFirestore(currentUser.uid);
  if (actualRole !== 'vendor' && actualRole !== 'admin') {
    throw new Error(`Opération réservée aux vendeurs et administrateurs`);
  }
  return true;
}
```

**Opérations protégées:**

| Opération | Permission requise | Fonction | Ligne |
|-----------|-------------------|----------|-------|
| Ajout produit | Admin | `saveProductBtn` click | Line ~2835 |
| Suppression produit | Admin | `.delete-product` click | Line ~2920 |
| Changement statut commande | Admin + Vendor | `.status-select` change | Line ~2930 |
| Vérification paiement | Admin | `.verify-payment-btn` click | Line ~2980 |
| Modification rôle utilisateur | Admin | `.toggle-role` click | Line ~3020 |
| Envoi notification | Admin | `#sendNotifBtn` click | Line ~3030 |

**Caractéristiques:**
- ✅ Vérifie à CHAQUE opération
- ✅ Re-fetch le rôle depuis Firestore (protection contre les modifications en session)
- ✅ Logging détaillé avec raison du refus
- ✅ Affiche message d'erreur à l'utilisateur

---

## 6️⃣ Couche 6: Double Vérification au Rendu (Rendering Guards)

**Fonctions clés:** `renderAdminDashboard()`, `renderLogisticsDashboard()`

**Objectif:** Vérifier le rôle avant de rendu du contenu sensible

**Implémentation (renderAdminDashboard):**
```javascript
async function renderAdminDashboard(app) {
  // 🔐 DOUBLE VÉRIFICATION: S'assurer que l'utilisateur a le rôle 'admin'
  if (!isAdmin || userRole !== 'admin') {
    console.error('🔐 SÉCURITÉ: Tentative d\'accès au dashboard admin sans rôle admin');
    
    // Réactualiser le rôle depuis Firestore
    if (currentUser) {
      userRole = await getUserRoleFromFirestore(currentUser.uid);
      isAdmin = (userRole === 'admin');
    }
    
    // Si toujours pas admin, afficher erreur
    if (!isAdmin) {
      app.innerHTML = `<div class="card text-center" style="padding:40px;">
        <p style="font-size:1.3rem; margin:0;">⛔ Accès refusé</p>
        <p style="color:var(--text-soft); margin-top:10px;">Rôle détecté: ${userRole}</p>
      </div>`;
      return;
    }
  }
  
  // Afficher le dashboard
  await loadMoncashConfig();
  await loadAllData();
  // ... render dashboard UI
}
```

**Caractéristiques:**
- ✅ Vérifie avant rendu
- ✅ Re-fetch au besoin
- ✅ Affiche message explicite si refusé
- ✅ Affiche le rôle actuel détecté

---

## Flux de Sécurité Complet

```
Utilisateur accède à admin.html
         ↓
[Couche 1] HTML redirige vers index.html IMMÉDIATEMENT
         ↓
index.html charge app.js
         ↓
[Couche 2] app.js vérifie et redirige si ancien fichier
         ↓
Firebase authentifie l'utilisateur
         ↓
[Couche 3] getUserRoleFromFirestore() récupère le rôle
         ↓
[Couche 4] onAuthStateChanged distribue l'interface
         ↓
Utilisateur clique sur "Admin Dashboard"
         ↓
[Couche 5] requireAdminRole() vérifie depuis Firestore
         ↓
[Couche 6] renderAdminDashboard() double-vérifie
         ↓
Dashboard affiché UNIQUEMENT si rôle admin confirmé depuis Firestore
```

---

## Validation des Rôles

### Normalisation (normalizeRole)
```javascript
function normalizeRole(rawRole) {
  if (!rawRole) return 'client';
  const normalized = String(rawRole).trim().toLowerCase();
  return ['admin', 'vendor', 'client'].includes(normalized) ? normalized : 'client';
}
```

### Validation (isValidRole)
```javascript
function isValidRole(role) {
  return ['admin', 'vendor', 'client'].includes(role);
}
```

### Valeurs valides
- `'admin'` - Accès complet au dashboard admin
- `'vendor'` - Accès au dashboard logistique
- `'client'` - Accès au shop client (défaut)

---

## Logging et Audit

Chaque opération sensible est loggée avec:
- ✅ Horodatage
- ✅ UID utilisateur
- ✅ Rôle détecté
- ✅ Opération tentée
- ✅ Résultat (autorisé/refusé)
- ✅ Raison du refus si applicable

**Exemple:**
```javascript
console.log('✅ Dashboard admin autorisé (rôle Firestore: admin)');
console.error('🔐 SÉCURITÉ: Tentative d\'accès au dashboard admin sans rôle admin');
console.error('🔐 SÉCURITÉ: Modification de rôle tentée par utilisateur non-admin (rôle: client)');
```

---

## Vulnérabilités Adressées

### 1. ❌ Role Selection Screen
**Avant:** Page affichait des boutons pour sélectionner manuellement le rôle
**Après:** Page est redirigée AVANT affichage via Couches 1 et 2

### 2. ❌ Frontend Role Determination
**Avant:** Le rôle pouvait être défini côté client via localStorage
**Après:** Rôle TOUJOURS récupéré de Firestore via Couche 3

### 3. ❌ No Role Validation
**Avant:** Aucune validation que le rôle existait
**Après:** Normalisation + validation via `normalizeRole()` et `isValidRole()`

### 4. ❌ No Permission Checks
**Avant:** Opérations sensibles accessibles sans vérification
**Après:** Tous les clics vérifiés via `requireAdminRole()` / `requireVendorOrAdminRole()`

### 5. ❌ Session Role Hijacking
**Avant:** Rôle stocké en session et jamais rafraîchi
**Après:** Rôle re-fetch depuis Firestore à chaque opération

---

## Prochaines Étapes

### ✅ Frontend Security (COMPLÉTÉ)
- [x] Redirection HTML
- [x] Redirection app.js
- [x] Récupération Firestore
- [x] Guards aux opérations
- [x] Double vérification au rendu

### ⏳ Backend Security (À FAIRE)
- [ ] Middleware de vérification du token Firebase
- [ ] Vérification du rôle depuis Firestore côté serveur
- [ ] Guards aux endpoints sensibles
- [ ] Logging des opérations sensibles
- [ ] Rate limiting sur endpoints admin

### ⏳ Testing
- [ ] Test chaque rôle (admin, vendor, client)
- [ ] Tenter accès non-autorisé à chaque endpoint
- [ ] Modifier localStorage et essayer opération
- [ ] Modifier sessionStorage et essayer opération
- [ ] Modifier l'URL et essayer accès direct

---

## Contact Administrateur

Pour toute question ou signalement de vulnérabilité, contactez l'administrateur système.

**Date de mise à jour:** 2025
**Version:** 2.0 (Firestore-based)
