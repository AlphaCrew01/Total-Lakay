/* ============================================
   TOTAL LAKAY - Application Complète
   Firebase configuré - Tous les boutons OK
   ============================================ */

// ---------- CONFIGURATION FIREBASE ----------
const firebaseConfig = {
  apiKey: "AIzaSyBA_cEX_pHmlUZ4xv10GIOLVOv9g_-iolQ",
  authDomain: "total-lakay.firebaseapp.com",
  projectId: "total-lakay",
  storageBucket: "total-lakay.firebasestorage.app",
  messagingSenderId: "37969355540",
  appId: "1:37969355540:web:514e3869a9422e3681d801",
  measurementId: "G-HC09M5HTVZ"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ---------- ÉTAT GLOBAL ----------
let currentUser = null;
let isAdmin = false;
let currentLang = 'ht';
let currentView = 'home';
let products = [];
let orders = [];
let notifications = [];
let selectedProductId = null;

// ---------- TRADUCTIONS ----------
const i18n = {
  ht: {
    home: "Akèy", shop: "Boutik", orders: "Kòmand", admin: "Admin",
    login: "Konekte", logout: "Dekonekte", welcome: "Byenveni nan Total Lakay",
    slogan: "Tout bagay lakay ou nan yon sèl klike.",
    buy: "Achte", price: "Pri", address: "Adrès ou", payment: "Mwayen peman",
    orderNow: "Kòmande", myOrders: "Kòmand mwen yo", status: "Estati",
    delivery: "Délai livrezon", addProduct: "Ajoute yon pwodui",
    productName: "Non pwodui", productPrice: "Pri", productImage: "URL imaj",
    productDesc: "Deskripsyon", save: "Anrejistre", delete: "Efase",
    noProducts: "Pa gen pwodui ankò", loading: "Chajman...",
    orderSuccess: "Kòmand anrejistre ak siksè !",
    loginRequired: "Ou dwe konekte pou achte",
    fillAllFields: "Ranpli tout chan yo",
    featured: "Pwodui rekòmande",
    loginTitle: "Konekte pou achte",
    createAccount: "Kreye yon kont",
    noAccount: "Pa gen kont?",
    createAccountTitle: "Kreye kont ou",
    alreadyAccount: "Deja gen yon kont?",
    or: "oubyen",
    notifications: "Notifikasyon",
    specialOffers: "Òf espesyal",
    settings: "Paramèt",
    history: "Istwa",
    specialPrice: "Pri espesyal!",
    newProduct: "Nouvo pwodui!",
    promo: "Promosyon!",
    noNotifications: "Pa gen notifikasyon",
    noOrders: "Pa gen kòmand ankò",
    noSpecialOffers: "Pa gen òf espesyal pou kounye a",
    orderConfirmed: "Kòmand konfime",
    pending: "An atant",
    confirmed: "Konfime"
  },
  fr: {
    home: "Accueil", shop: "Boutique", orders: "Commandes", admin: "Admin",
    login: "Connexion", logout: "Déconnexion", welcome: "Bienvenue sur Total Lakay",
    slogan: "Tout ce qu'il vous faut, en un clic.",
    buy: "Acheter", price: "Prix", address: "Votre adresse", payment: "Moyen de paiement",
    orderNow: "Commander", myOrders: "Mes commandes", status: "Statut",
    delivery: "Délai de livraison", addProduct: "Ajouter un produit",
    productName: "Nom du produit", productPrice: "Prix", productImage: "URL de l'image",
    productDesc: "Description", save: "Enregistrer", delete: "Supprimer",
    noProducts: "Aucun produit", loading: "Chargement...",
    orderSuccess: "Commande enregistrée avec succès !",
    loginRequired: "Vous devez être connecté pour acheter",
    fillAllFields: "Remplissez tous les champs",
    featured: "Produits recommandés",
    loginTitle: "Connectez-vous pour acheter",
    createAccount: "Créer un compte",
    noAccount: "Pas de compte?",
    createAccountTitle: "Créer votre compte",
    alreadyAccount: "Déjà un compte?",
    or: "ou",
    notifications: "Notifications",
    specialOffers: "Offres spéciales",
    settings: "Paramètres",
    history: "Historique",
    specialPrice: "Prix spécial!",
    newProduct: "Nouveau produit!",
    promo: "Promotion!",
    noNotifications: "Aucune notification",
    noOrders: "Aucune commande",
    noSpecialOffers: "Pas d'offres spéciales pour le moment",
    orderConfirmed: "Commande confirmée",
    pending: "En attente",
    confirmed: "Confirmé"
  },
  en: {
    home: "Home", shop: "Shop", orders: "Orders", admin: "Admin",
    login: "Login", logout: "Logout", welcome: "Welcome to Total Lakay",
    slogan: "Everything you need, one click away.",
    buy: "Buy", price: "Price", address: "Your address", payment: "Payment method",
    orderNow: "Order Now", myOrders: "My Orders", status: "Status",
    delivery: "Delivery estimate", addProduct: "Add a product",
    productName: "Product name", productPrice: "Price", productImage: "Image URL",
    productDesc: "Description", save: "Save", delete: "Delete",
    noProducts: "No products yet", loading: "Loading...",
    orderSuccess: "Order successfully placed!",
    loginRequired: "You must login to purchase",
    fillAllFields: "Please fill all fields",
    featured: "Featured products",
    loginTitle: "Login to purchase",
    createAccount: "Create account",
    noAccount: "No account?",
    createAccountTitle: "Create your account",
    alreadyAccount: "Already have an account?",
    or: "or",
    notifications: "Notifications",
    specialOffers: "Special Offers",
    settings: "Settings",
    history: "History",
    specialPrice: "Special price!",
    newProduct: "New product!",
    promo: "Promotion!",
    noNotifications: "No notifications",
    noOrders: "No orders yet",
    noSpecialOffers: "No special offers at the moment",
    orderConfirmed: "Order confirmed",
    pending: "Pending",
    confirmed: "Confirmed"
  },
  es: {
    home: "Inicio", shop: "Tienda", orders: "Pedidos", admin: "Admin",
    login: "Iniciar sesión", logout: "Cerrar sesión", welcome: "Bienvenido a Total Lakay",
    slogan: "Todo lo que necesitas, a un clic.",
    buy: "Comprar", price: "Precio", address: "Tu dirección", payment: "Método de pago",
    orderNow: "Ordenar ahora", myOrders: "Mis pedidos", status: "Estado",
    delivery: "Tiempo de entrega", addProduct: "Añadir producto",
    productName: "Nombre del producto", productPrice: "Precio", productImage: "URL de imagen",
    productDesc: "Descripción", save: "Guardar", delete: "Eliminar",
    noProducts: "No hay productos aún", loading: "Cargando...",
    orderSuccess: "¡Pedido registrado con éxito!",
    loginRequired: "Debes iniciar sesión para comprar",
    fillAllFields: "Completa todos los campos",
    featured: "Productos destacados",
    loginTitle: "Inicia sesión para comprar",
    createAccount: "Crear cuenta",
    noAccount: "¿No tienes cuenta?",
    createAccountTitle: "Crea tu cuenta",
    alreadyAccount: "¿Ya tienes cuenta?",
    or: "o",
    notifications: "Notificaciones",
    specialOffers: "Ofertas especiales",
    settings: "Configuración",
    history: "Historial",
    specialPrice: "¡Precio especial!",
    newProduct: "¡Nuevo producto!",
    promo: "¡Promoción!",
    noNotifications: "No hay notificaciones",
    noOrders: "No hay pedidos",
    noSpecialOffers: "No hay ofertas especiales ahora",
    orderConfirmed: "Pedido confirmado",
    pending: "Pendiente",
    confirmed: "Confirmado"
  }
};

function t(key) { return i18n[currentLang]?.[key] || key; }

function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[currentLang]?.[key]) el.textContent = i18n[currentLang][key];
  });
  // Mettre à jour la vue actuelle
  if (currentView) renderView(currentView);
}

function showMessage(message, type = 'success') {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position:fixed; bottom:20px; right:20px;
    background:${type==='success'?'#1e7e5b':'#c0392b'};
    color:white; padding:1rem 1.5rem; border-radius:30px;
    font-weight:600; z-index:3000;
    box-shadow:0 20px 40px rgba(0,0,0,0.3);
    animation: modalIn 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ============================================
// AUTHENTIFICATION
// ============================================
auth.onAuthStateChanged(async (user) => {
  currentUser = user;
  const authBtn = document.getElementById('authBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminElements = document.querySelectorAll('.admin-only');
  const userElements = document.querySelectorAll('.user-only');
  
  if (user) {
    if (authBtn) authBtn.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.remove('hidden');
    userElements.forEach(el => el.classList.remove('hidden'));
    
    try {
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists && userDoc.data().role === 'admin') {
        isAdmin = true;
        adminElements.forEach(el => el.classList.remove('hidden'));
      } else {
        isAdmin = false;
        adminElements.forEach(el => el.classList.add('hidden'));
      }
    } catch (e) { 
      isAdmin = false;
      adminElements.forEach(el => el.classList.add('hidden'));
    }
    
    // Sauvegarder l'utilisateur
    const userDocSnap = await db.collection('users').doc(user.uid).get();
    if (!userDocSnap.exists) {
      await db.collection('users').doc(user.uid).set({
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: 'customer',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  } else {
    if (authBtn) authBtn.classList.remove('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
    adminElements.forEach(el => el.classList.add('hidden'));
    userElements.forEach(el => el.classList.add('hidden'));
    isAdmin = false;
  }
  
  renderView(currentView);
  loadNotifications();
});

// ============================================
// BOUTON CONNEXION - Ouvre la modale
// ============================================
document.getElementById('authBtn')?.addEventListener('click', () => {
  console.log('Bouton connexion cliqué');
  const modal = document.getElementById('loginModal');
  const loginCard = document.querySelector('#loginModal .login-card');
  const registerForm = document.getElementById('registerForm');
  
  if (modal) modal.classList.remove('hidden');
  if (loginCard) loginCard.classList.remove('hidden');
  if (registerForm) registerForm.classList.add('hidden');
  
  // Réinitialiser les champs
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPassword');
  if (emailInput) emailInput.value = '';
  if (passInput) passInput.value = '';
});

// Fermer modale connexion
document.getElementById('closeLoginModal')?.addEventListener('click', () => {
  document.getElementById('loginModal')?.classList.add('hidden');
});

document.getElementById('closeRegisterModal')?.addEventListener('click', () => {
  document.getElementById('loginModal')?.classList.add('hidden');
});

// Fermer en cliquant en dehors
document.getElementById('loginModal')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('loginModal')) {
    document.getElementById('loginModal').classList.add('hidden');
  }
});

// Google Login
document.getElementById('googleLoginBtn')?.addEventListener('click', () => {
  console.log('Google login cliqué');
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(() => {
      document.getElementById('loginModal')?.classList.add('hidden');
      showMessage('✅ Byenveni!', 'success');
    })
    .catch(err => showMessage(err.message, 'error'));
});

// Email Login
document.getElementById('emailLoginBtn')?.addEventListener('click', () => {
  console.log('Email login cliqué');
  const email = document.getElementById('loginEmail')?.value.trim();
  const password = document.getElementById('loginPassword')?.value;
  
  if (!email || !password) {
    showMessage(t('fillAllFields'), 'error');
    return;
  }
  
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById('loginModal')?.classList.add('hidden');
      showMessage('✅ Byenveni!', 'success');
    })
    .catch(err => {
      if (err.code === 'auth/user-not-found') {
        showMessage('Kont sa a pa egziste. Kreye yon kont.', 'error');
      } else {
        showMessage(err.message, 'error');
      }
    });
});

// Switch vers inscription
document.getElementById('switchToRegister')?.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Switch to register');
  const loginCard = document.querySelector('#loginModal .login-card');
  const registerForm = document.getElementById('registerForm');
  if (loginCard) loginCard.classList.add('hidden');
  if (registerForm) registerForm.classList.remove('hidden');
});

// Switch vers connexion
document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Switch to login');
  const loginCard = document.querySelector('#loginModal .login-card');
  const registerForm = document.getElementById('registerForm');
  if (registerForm) registerForm.classList.add('hidden');
  if (loginCard) loginCard.classList.remove('hidden');
});

// Inscription
document.getElementById('registerBtn')?.addEventListener('click', () => {
  console.log('Register cliqué');
  const name = document.getElementById('registerName')?.value.trim();
  const email = document.getElementById('registerEmail')?.value.trim();
  const password = document.getElementById('registerPassword')?.value;
  
  if (!name || !email || !password) {
    showMessage(t('fillAllFields'), 'error');
    return;
  }
  if (password.length < 6) {
    showMessage('Modpas dwe gen omwen 6 karaktè', 'error');
    return;
  }
  
  auth.createUserWithEmailAndPassword(email, password)
    .then(async (cred) => {
      await db.collection('users').doc(cred.user.uid).set({
        email,
        displayName: name,
        role: 'customer',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      document.getElementById('loginModal')?.classList.add('hidden');
      showMessage('✅ Kont kreye ak siksè!', 'success');
    })
    .catch(err => showMessage(err.message, 'error'));
});

// Déconnexion
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  auth.signOut();
  showMessage('Ou dekonekte', 'success');
});

// ============================================
// MENU DROPDOWN
// ============================================
document.getElementById('menuBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('Menu bouton cliqué');
  const menu = document.getElementById('dropdownMenu');
  if (menu) {
    menu.classList.toggle('hidden');
    console.log('Menu visible:', !menu.classList.contains('hidden'));
  }
});

// Fermer le menu en cliquant ailleurs
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('menuDropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    document.getElementById('dropdownMenu')?.classList.add('hidden');
  }
});

// Menu - Òf espesyal
document.getElementById('menuSpecial')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('dropdownMenu')?.classList.add('hidden');
  currentView = 'specialOffers';
  renderView('specialOffers');
});

// Menu - Paramèt
document.getElementById('menuSettings')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('dropdownMenu')?.classList.add('hidden');
  currentView = 'settings';
  renderView('settings');
});

// Menu - Istwa
document.getElementById('menuHistory')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('dropdownMenu')?.classList.add('hidden');
  currentView = 'history';
  renderView('history');
});

// ============================================
// NOTIFICATIONS
// ============================================
async function loadNotifications() {
  try {
    const snap = await db.collection('notifications')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();
    notifications = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    updateNotifBadge();
  } catch (e) {
    console.log('Pas de collection notifications encore');
    notifications = [];
    updateNotifBadge();
  }
}

function updateNotifBadge() {
  const badge = document.getElementById('notifBadge');
  if (!badge) return;
  const unread = notifications.filter(n => !n.read).length;
  if (unread > 0) {
    badge.textContent = unread > 99 ? '99+' : unread;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

// Ouvrir modale notifications
document.getElementById('notifBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('Bouton notification cliqué');
  const modal = document.getElementById('notifModal');
  if (modal) {
    modal.classList.remove('hidden');
    renderNotifList();
  }
});

// Fermer modale notifications
document.getElementById('closeNotifModal')?.addEventListener('click', () => {
  document.getElementById('notifModal')?.classList.add('hidden');
});

// Fermer en cliquant en dehors
document.getElementById('notifModal')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('notifModal')) {
    document.getElementById('notifModal').classList.add('hidden');
  }
});

function renderNotifList() {
  const list = document.getElementById('notifList');
  if (!list) return;
  
  if (notifications.length === 0) {
    list.innerHTML = `<p class="text-center" style="padding:2rem; color:#999;">🔔 ${t('noNotifications')}</p>`;
    return;
  }
  
  list.innerHTML = notifications.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}" style="cursor:pointer;">
      <div class="notif-title">${n.type === 'promo' ? '🎉' : n.type === 'new' ? '🆕' : '💰'} ${n.title}</div>
      <p style="font-size:0.9rem; margin:0.3rem 0;">${n.message}</p>
      <div class="notif-date">${n.createdAt?.toDate?.()?.toLocaleDateString?.('fr-FR') || 'Jodi a'}</div>
    </div>
  `).join('');
}

// ============================================
// CHANGEMENT DE LANGUE
// ============================================
document.getElementById('langSwitch')?.addEventListener('change', (e) => {
  currentLang = e.target.value;
  console.log('Langue changée:', currentLang);
  applyLanguage();
});

// ============================================
// NAVIGATION PRINCIPALE
// ============================================
document.getElementById('navHome')?.addEventListener('click', (e) => {
  e.preventDefault();
  setActiveNav('navHome');
  currentView = 'home';
  renderView('home');
});

document.getElementById('navShop')?.addEventListener('click', (e) => {
  e.preventDefault();
  setActiveNav('navShop');
  currentView = 'shop';
  renderView('shop');
});

document.getElementById('navOrders')?.addEventListener('click', (e) => {
  e.preventDefault();
  setActiveNav('navOrders');
  currentView = 'orders';
  renderView('orders');
});

document.getElementById('navAdmin')?.addEventListener('click', (e) => {
  e.preventDefault();
  setActiveNav('navAdmin');
  currentView = 'admin';
  renderView('admin');
});

function setActiveNav(activeId) {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.getElementById(activeId)?.classList.add('active');
}

// ============================================
// MODAL ACHAT
// ============================================
document.getElementById('closeBuyModal')?.addEventListener('click', () => {
  document.getElementById('buyModal')?.classList.add('hidden');
});

document.getElementById('buyModal')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('buyModal')) {
    document.getElementById('buyModal').classList.add('hidden');
  }
});

document.getElementById('submitOrder')?.addEventListener('click', async () => {
  if (!currentUser) {
    showMessage(t('loginRequired'), 'error');
    return;
  }
  
  const address = document.getElementById('orderAddress')?.value.trim();
  const payment = document.getElementById('orderPayment')?.value;
  
  if (!address) {
    showMessage(t('fillAllFields'), 'error');
    return;
  }
  
  const product = products.find(p => p.id === selectedProductId);
  if (!product) return;
  
  try {
    await db.collection('orders').add({
      userId: currentUser.uid,
      userEmail: currentUser.email,
      productId: product.id,
      productName: product.name,
      price: product.price,
      image: product.image || '',
      address: address,
      payment: payment,
      status: 'pending',
      deliveryEstimate: '',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    document.getElementById('buyModal')?.classList.add('hidden');
    const addressInput = document.getElementById('orderAddress');
    if (addressInput) addressInput.value = '';
    showMessage(t('orderSuccess'), 'success');
  } catch (error) {
    showMessage('Erreur: ' + error.message, 'error');
  }
});

// ============================================
// CHARGEMENT DES DONNÉES
// ============================================
async function loadProducts() {
  try {
    const snap = await db.collection('products').orderBy('createdAt', 'desc').get();
    products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error('Erreur chargement produits:', e);
    products = [];
  }
}

async function loadOrders() {
  if (!currentUser) {
    orders = [];
    return;
  }
  try {
    let query = db.collection('orders').orderBy('createdAt', 'desc');
    if (!isAdmin) {
      query = query.where('userId', '==', currentUser.uid);
    }
    const snap = await query.get();
    orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error('Erreur chargement commandes:', e);
    orders = [];
  }
}

// ============================================
// RENDU DES VUES
// ============================================
async function renderView(view) {
  currentView = view;
  const app = document.getElementById('appContent');
  if (!app) return;
  
  console.log('Rendu vue:', view);
  
  switch (view) {
    case 'home':
      await renderHome(app);
      break;
    case 'shop':
      await renderShop(app);
      break;
    case 'orders':
      await renderOrders(app);
      break;
    case 'admin':
      await renderAdmin(app);
      break;
    case 'specialOffers':
      await renderSpecialOffers(app);
      break;
    case 'settings':
      renderSettings(app);
      break;
    case 'history':
      await renderHistory(app);
      break;
    default:
      await renderHome(app);
  }
}

// ============================================
// HTML CARTE PRODUIT
// ============================================
function productCardHTML(product) {
  const hasPromo = product.oldPrice && product.oldPrice > product.price;
  return `
    <div class="product-card" style="position:relative;">
      ${hasPromo ? `<div class="product-badge">🔥 ${t('specialPrice')}</div>` : ''}
      <img 
        src="${product.image || 'https://via.placeholder.com/400x250/0f1f38/c8963e?text=Total+Lakay'}" 
        alt="${product.name}" 
        class="product-img"
        onerror="this.src='https://via.placeholder.com/400x250/0f1f38/c8963e?text=Total+Lakay'"
      />
      <div class="product-info">
        <div class="product-title">${product.name}</div>
        ${product.description ? `<div class="product-description">${product.description.substring(0, 80)}${product.description.length > 80 ? '...' : ''}</div>` : ''}
        <div class="product-price">
          $${product.price}
          ${hasPromo ? `<span class="old-price">$${product.oldPrice}</span>` : ''}
        </div>
        <button class="btn btn-gold btn-sm buy-btn" data-product-id="${product.id}">
          🛒 ${t('buy')}
        </button>
      </div>
    </div>
  `;
}

// ============================================
// PAGE ACCUEIL
// ============================================
async function renderHome(app) {
  await loadProducts();
  const specials = products.filter(p => p.oldPrice && p.oldPrice > p.price);
  
  app.innerHTML = `
    <div class="card text-center">
      <h1 style="color:var(--blue-deep); font-size:2rem;">🏠 ${t('welcome')}</h1>
      <p style="font-size:1.2rem; color:var(--text-soft); margin:1rem 0;">${t('slogan')}</p>
      ${specials.length > 0 ? `
        <div class="special-offer-card mt-2" style="text-align:left;">
          <h3>🎉 ${t('specialPrice')}!</h3>
          <p style="font-size:1.1rem;"><strong>${specials[0].name}</strong></p>
          <p style="font-size:1.4rem; font-weight:800; color:var(--danger);">
            $${specials[0].price} 
            <span style="text-decoration:line-through; color:#aaa; font-size:1rem;">$${specials[0].oldPrice}</span>
          </p>
        </div>
      ` : ''}
      <button class="btn btn-gold mt-2" id="goShopBtn">🛒 ${t('shop')}</button>
    </div>
    
    <h2 style="margin-top:2rem;">🔥 ${t('featured')}</h2>
    <div class="grid" id="featuredProducts">
      ${products.length === 0 
        ? `<p class="text-center" style="grid-column:1/-1; padding:2rem;">📦 ${t('noProducts')}</p>` 
        : products.slice(0, 4).map(p => productCardHTML(p)).join('')
      }
    </div>
  `;
  
  document.getElementById('goShopBtn')?.addEventListener('click', () => {
    setActiveNav('navShop');
    currentView = 'shop';
    renderView('shop');
  });
  attachBuyButtons();
}

// ============================================
// PAGE BOUTIQUE
// ============================================
async function renderShop(app) {
  await loadProducts();
  app.innerHTML = `
    <h2>🛍️ ${t('shop')}</h2>
    <div class="grid" id="allProducts">
      ${products.length === 0 
        ? `<p class="text-center" style="grid-column:1/-1; padding:2rem;">📦 ${t('noProducts')}</p>` 
        : products.map(p => productCardHTML(p)).join('')
      }
    </div>
  `;
  attachBuyButtons();
}

// ============================================
// PAGE OFFRES SPÉCIALES
// ============================================
async function renderSpecialOffers(app) {
  await loadProducts();
  const specials = products.filter(p => p.oldPrice && p.oldPrice > p.price);
  
  app.innerHTML = `
    <h2>🎉 ${t('specialOffers')}</h2>
    ${specials.length === 0 
      ? `<p class="text-center" style="padding:3rem;">📭 ${t('noSpecialOffers')}</p>` 
      : `<div class="grid">${specials.map(p => productCardHTML(p)).join('')}</div>`
    }
  `;
  attachBuyButtons();
}

// ============================================
// PAGE PARAMÈTRES
// ============================================
function renderSettings(app) {
  app.innerHTML = `
    <div class="card-premium">
      <h2>⚙️ ${t('settings')}</h2>
      <div style="margin-top:1.5rem;">
        <label style="font-weight:700;">🌍 Langue / Language</label>
        <select id="settingsLang" style="color:var(--text-dark); background:white; width:auto; min-width:200px;">
          <option value="ht" ${currentLang==='ht'?'selected':''}>🇭🇹 Kreyòl Ayisyen</option>
          <option value="fr" ${currentLang==='fr'?'selected':''}>🇫🇷 Français</option>
          <option value="en" ${currentLang==='en'?'selected':''}>🇺🇸 English</option>
          <option value="es" ${currentLang==='es'?'selected':''}>🇪🇸 Español</option>
        </select>
      </div>
      ${currentUser ? `
        <div style="margin-top:1.5rem; padding-top:1.5rem; border-top:1px solid var(--gray-200);">
          <p><strong>Email:</strong> ${currentUser.email}</p>
          <p><strong>Non:</strong> ${currentUser.displayName || '---'}</p>
        </div>
      ` : ''}
    </div>
  `;
  
  document.getElementById('settingsLang')?.addEventListener('change', (e) => {
    currentLang = e.target.value;
    const langSwitch = document.getElementById('langSwitch');
    if (langSwitch) langSwitch.value = currentLang;
    applyLanguage();
  });
}

// ============================================
// PAGE HISTORIQUE
// ============================================
async function renderHistory(app) {
  if (!currentUser) {
    app.innerHTML = `
      <div class="card text-center" style="padding:3rem;">
        <p>🔐 ${t('loginRequired')}</p>
        <button class="btn btn-gold mt-2" id="loginFromHistory">${t('login')}</button>
      </div>
    `;
    document.getElementById('loginFromHistory')?.addEventListener('click', () => {
      document.getElementById('authBtn')?.click();
    });
    return;
  }
  
  await loadOrders();
  
  app.innerHTML = `
    <h2>🕐 ${t('history')}</h2>
    ${orders.length === 0 
      ? `<p class="text-center" style="padding:3rem;">📭 ${t('noOrders')}</p>` 
      : orders.map(o => `
          <div class="card" style="margin-bottom:0.8rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <strong>${o.productName}</strong>
              <span class="badge ${o.status==='confirmed'?'badge-success':'badge-pending'}">
                ${o.status==='confirmed' ? t('confirmed') : t('pending')}
              </span>
            </div>
            <p>💰 <strong>$${o.price}</strong> | 💳 ${o.payment}</p>
            <p>📍 ${o.address}</p>
            ${o.deliveryEstimate ? `<p>🚚 <strong>${t('delivery')}:</strong> ${o.deliveryEstimate}</p>` : ''}
            <p style="font-size:0.75rem; color:#aaa;">${o.createdAt?.toDate?.()?.toLocaleDateString?.('fr-FR') || ''}</p>
          </div>
        `).join('')
    }
  `;
}

// ============================================
// PAGE COMMANDES
// ============================================
async function renderOrders(app) {
  if (!currentUser) {
    app.innerHTML = `
      <div class="card text-center" style="padding:3rem;">
        <p>🔐 ${t('loginRequired')}</p>
        <button class="btn btn-gold mt-2" id="loginFromOrders">${t('login')}</button>
      </div>
    `;
    document.getElementById('loginFromOrders')?.addEventListener('click', () => {
      document.getElementById('authBtn')?.click();
    });
    return;
  }
  
  await loadOrders();
  
  app.innerHTML = `
    <h2>📦 ${t('myOrders')}</h2>
    ${orders.length === 0 
      ? `<p class="text-center" style="padding:3rem;">📭 ${t('noOrders')}</p>` 
      : orders.map(o => `
          <div class="card" style="margin-bottom:0.8rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <strong>${o.productName}</strong>
              <span class="badge ${o.status==='confirmed'?'badge-success':'badge-pending'}">
                ${o.status==='confirmed' ? t('confirmed') : t('pending')}
              </span>
            </div>
            <p>💰 <strong>$${o.price}</strong> | 💳 ${o.payment}</p>
            <p>📍 ${o.address}</p>
            ${o.deliveryEstimate ? `<p>🚚 <strong>${t('delivery')}:</strong> ${o.deliveryEstimate}</p>` : '<p>⏳ An atant...</p>'}
          </div>
        `).join('')
    }
  `;
}

// ============================================
// PAGE ADMIN
// ============================================
async function renderAdmin(app) {
  if (!isAdmin) {
    app.innerHTML = `
      <div class="card text-center" style="padding:3rem;">
        <p>⛔ ${t('admin')} sèlman</p>
      </div>
    `;
    return;
  }
  
  await loadProducts();
  await loadOrders();
  
  app.innerHTML = `
    <div class="card-premium">
      <h3>➕ ${t('addProduct')}</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
        <div>
          <label>${t('productName')}</label>
          <input id="adminProdName" placeholder="Ex: Diri blan" />
        </div>
        <div>
          <label>${t('productPrice')} ($)</label>
          <input id="adminProdPrice" type="number" placeholder="25.00" step="0.01" />
        </div>
      </div>
      <label>Ansyen pri (si genyen)</label>
      <input id="adminProdOldPrice" type="number" placeholder="30.00" step="0.01" />
      <label>${t('productImage')}</label>
      <input id="adminProdImage" placeholder="https://..." />
      <label>${t('productDesc')}</label>
      <textarea id="adminProdDesc" rows="2" placeholder="Deskripsyon..."></textarea>
      <button id="addProductBtn" class="btn btn-gold mt-2">✅ ${t('save')}</button>
    </div>
    
    <div class="card">
      <h3>📋 Pwodui ki deja egziste</h3>
      <div id="adminProductList">
        ${products.length === 0 ? '<p>Pa gen pwodui</p>' : products.map(p => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.7rem 0; border-bottom:1px solid var(--gray-200);">
            <span>${p.name} - $${p.price}</span>
            <button class="btn btn-danger btn-sm delete-product" data-id="${p.id}">🗑️ ${t('delete')}</button>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="card">
      <h3>📦 Kòmand kliyan yo</h3>
      <div id="adminOrderList">
        ${orders.length === 0 ? '<p>Pa gen kòmand</p>' : orders.map(o => `
          <div style="padding:0.8rem 0; border-bottom:1px solid var(--gray-200);">
            <p><strong>${o.productName}</strong> - $${o.price}</p>
            <p>👤 ${o.userEmail || 'Kliyan'} | 📍 ${o.address}</p>
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <input id="delay-${o.id}" placeholder="Délai (ex: 3 jou)" value="${o.deliveryEstimate || ''}" style="flex:1;" />
              <button class="btn btn-success btn-sm update-delay" data-id="${o.id}">⏱️ ${t('save')}</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Ajouter produit
  document.getElementById('addProductBtn')?.addEventListener('click', async () => {
    const name = document.getElementById('adminProdName')?.value.trim();
    const price = parseFloat(document.getElementById('adminProdPrice')?.value);
    const oldPrice = parseFloat(document.getElementById('adminProdOldPrice')?.value) || null;
    const image = document.getElementById('adminProdImage')?.value.trim();
    const description = document.getElementById('adminProdDesc')?.value.trim();
    
    if (!name || !price) {
      showMessage(t('fillAllFields'), 'error');
      return;
    }
    
    try {
      await db.collection('products').add({
        name, price, oldPrice,
        image: image || '',
        description,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showMessage('✅ Pwodui ajoute!', 'success');
      renderView('admin');
    } catch (error) {
      showMessage('Erreur: ' + error.message, 'error');
    }
  });
  
  // Supprimer produit
  document.querySelectorAll('.delete-product').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      if (confirm('Eske w sèten ou vle efase pwodui sa a?')) {
        await db.collection('products').doc(e.currentTarget.dataset.id).delete();
        showMessage('🗑️ Pwodui efase', 'success');
        renderView('admin');
      }
    });
  });
  
  // Mettre à jour délai
  document.querySelectorAll('.update-delay').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const orderId = e.currentTarget.dataset.id;
      const delay = document.getElementById(`delay-${orderId}`)?.value.trim();
      
      if (!delay) {
        showMessage('Antre yon délai', 'error');
        return;
      }
      
      try {
        await db.collection('orders').doc(orderId).update({
          deliveryEstimate: delay,
          status: 'confirmed'
        });
        showMessage('✅ Délai mete!', 'success');
        renderView('admin');
      } catch (error) {
        showMessage('Erreur: ' + error.message, 'error');
      }
    });
  });
}

// ============================================
// ATTACHER BOUTONS ACHAT
// ============================================
function attachBuyButtons() {
  document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = e.currentTarget.getAttribute('data-product-id');
      openBuyModal(productId);
    });
  });
}

// ============================================
// OUVRIR MODAL ACHAT
// ============================================
function openBuyModal(productId) {
  if (!currentUser) {
    showMessage(t('loginRequired'), 'error');
    // Ouvrir la modale de connexion
    document.getElementById('authBtn')?.click();
    return;
  }
  
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  selectedProductId = productId;
  
  const modalName = document.getElementById('modalProductName');
  const modalPrice = document.getElementById('modalProductPrice');
  const modal = document.getElementById('buyModal');
  const addressInput = document.getElementById('orderAddress');
  
  if (modalName) modalName.textContent = product.name;
  if (modalPrice) modalPrice.textContent = `$${product.price}`;
  if (modal) modal.classList.remove('hidden');
  if (addressInput) addressInput.value = '';
}

// ============================================
// DÉMARRAGE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Total Lakay démarré!');
  applyLanguage();
  renderView('home');
});