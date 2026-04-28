/* ============================================
   TOTAL LAKAY - Application Complète
   Firebase configuré - 100% Traductions OK
   Avec vérification d'email
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

// ---------- TRADUCTIONS COMPLÈTES (TOUS LES TEXTES) ----------
const i18n = {
  ht: {
    // Navigation
    home: "Akèy",
    shop: "Boutik",
    orders: "Kòmand",
    admin: "Admin",
    login: "Konekte",
    logout: "Dekonekte",
    // Accueil
    welcome: "Byenveni nan Total Lakay",
    slogan: "Tout bagay lakay ou nan yon sèl klike.",
    featured: "Pwodui rekòmande",
    goShop: "Ale nan boutik",
    // Produits
    buy: "Achte",
    price: "Pri",
    noProducts: "Pa gen pwodui ankò",
    loading: "Chajman...",
    // Achat
    address: "Adrès ou",
    addressPlaceholder: "Rue, Ville, Kòd postal",
    payment: "Mwayen peman",
    orderNow: "Kòmande",
    orderSuccess: "Kòmand anrejistre ak siksè !",
    loginRequired: "Ou dwe konekte pou achte",
    fillAllFields: "Ranpli tout chan yo",
    // Commandes
    myOrders: "Kòmand mwen yo",
    status: "Estati",
    delivery: "Délai livrezon",
    noOrders: "Pa gen kòmand ankò",
    pending: "An atant",
    confirmed: "Konfime",
    waiting: "An atant...",
    // Admin
    addProduct: "Ajoute yon pwodui",
    productName: "Non pwodui",
    productNamePlaceholder: "Ex: Diri blan",
    productPrice: "Pri",
    productPricePlaceholder: "25.00",
    productImage: "URL imaj",
    productImagePlaceholder: "https://...",
    productDesc: "Deskripsyon",
    productDescPlaceholder: "Deskripsyon pwodui a...",
    oldPrice: "Ansyen pri (si genyen)",
    oldPricePlaceholder: "30.00",
    save: "Anrejistre",
    delete: "Efase",
    existingProducts: "Pwodui ki deja egziste",
    customerOrders: "Kòmand kliyan yo",
    noOrdersAdmin: "Pa gen kòmand",
    noProductsAdmin: "Pa gen pwodui",
    delayPlaceholder: "Ex: 3 jou",
    // Connexion
    loginTitle: "Konekte pou achte",
    createAccount: "Kreye yon kont",
    createAccountTitle: "Kreye kont ou",
    noAccount: "Pa gen kont?",
    alreadyAccount: "Deja gen yon kont?",
    or: "oubyen",
    continueGoogle: "Kontinye ak Google",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Modpas",
    namePlaceholder: "Non ou",
    passwordMin: "Modpas (min 6 karaktè)",
    // Menu
    notifications: "Notifikasyon",
    specialOffers: "Òf espesyal",
    settings: "Paramèt",
    history: "Istwa",
    contactUs: "Kontakte nou",
    services: "Sèvis",
    privacy: "Konfidansyalite",
    // Offres
    specialPrice: "Pri espesyal!",
    newProduct: "Nouvo pwodui!",
    promo: "Promosyon!",
    noSpecialOffers: "Pa gen òf espesyal pou kounye a",
    offer: "ÒFÈ",
    // Notifications
    noNotifications: "Pa gen notifikasyon",
    today: "Jodi a",
    // Paramètres
    language: "Langue / Language",
    accountInfo: "Enfòmasyon kont",
    email: "Email",
    name: "Non",
    emailVerified: "Email verifye",
    yes: "Wi",
    no: "Non",
    resendVerifyEmail: "Renvwaye email verifikasyon",
    // Messages
    welcomeBack: "Byenveni!",
    accountCreated: "Kont kreye ak siksè!",
    loggedOut: "Ou dekonekte",
    productAdded: "Pwodui ajoute!",
    productDeleted: "Pwodui efase",
    delayUpdated: "Délai mete!",
    delayRequired: "Antre yon délai",
    accountNotFound: "Kont sa a pa egziste. Kreye yon kont.",
    passwordError: "Modpas dwe gen omwen 6 karaktè",
    confirmDelete: "Eske w sèten ou vle efase pwodui sa a?",
    adminOnly: "Admin sèlman",
    emailVerifySent: "📩 Tcheke email ou pou verifye kont lan!",
    emailNotVerified: "❌ Verifye email ou avan ou konekte!",
    emailVerifyWarning: "⚠️ Verifye email ou pou kontinye",
    resendEmail: "⏳ Si w poko wè email la, tcheke spam ou...",
    errorOccurred: "Erè: ",
    client: "Kliyan",
    date: "Dat",
    // Footer
    footerRights: "Total Lakay © 2025",
    footerContact: "Kontakte nou",
    footerServices: "Sèvis",
    footerPrivacy: "Konfidansyalite",
  },
  fr: {
    // Navigation
    home: "Accueil",
    shop: "Boutique",
    orders: "Commandes",
    admin: "Admin",
    login: "Connexion",
    logout: "Déconnexion",
    // Accueil
    welcome: "Bienvenue sur Total Lakay",
    slogan: "Tout ce qu'il vous faut, en un clic.",
    featured: "Produits recommandés",
    goShop: "Aller à la boutique",
    // Produits
    buy: "Acheter",
    price: "Prix",
    noProducts: "Aucun produit pour le moment",
    loading: "Chargement...",
    // Achat
    address: "Votre adresse",
    addressPlaceholder: "Rue, Ville, Code postal",
    payment: "Moyen de paiement",
    orderNow: "Commander",
    orderSuccess: "Commande enregistrée avec succès !",
    loginRequired: "Vous devez être connecté pour acheter",
    fillAllFields: "Remplissez tous les champs",
    // Commandes
    myOrders: "Mes commandes",
    status: "Statut",
    delivery: "Délai de livraison",
    noOrders: "Aucune commande",
    pending: "En attente",
    confirmed: "Confirmé",
    waiting: "En attente...",
    // Admin
    addProduct: "Ajouter un produit",
    productName: "Nom du produit",
    productNamePlaceholder: "Ex: Riz blanc",
    productPrice: "Prix",
    productPricePlaceholder: "25.00",
    productImage: "URL de l'image",
    productImagePlaceholder: "https://...",
    productDesc: "Description",
    productDescPlaceholder: "Description du produit...",
    oldPrice: "Ancien prix (si applicable)",
    oldPricePlaceholder: "30.00",
    save: "Enregistrer",
    delete: "Supprimer",
    existingProducts: "Produits existants",
    customerOrders: "Commandes clients",
    noOrdersAdmin: "Aucune commande",
    noProductsAdmin: "Aucun produit",
    delayPlaceholder: "Ex: 3 jours",
    // Connexion
    loginTitle: "Connectez-vous pour acheter",
    createAccount: "Créer un compte",
    createAccountTitle: "Créer votre compte",
    noAccount: "Pas de compte ?",
    alreadyAccount: "Déjà un compte ?",
    or: "ou",
    continueGoogle: "Continuer avec Google",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Mot de passe",
    namePlaceholder: "Votre nom",
    passwordMin: "Mot de passe (min 6 caractères)",
    // Menu
    notifications: "Notifications",
    specialOffers: "Offres spéciales",
    settings: "Paramètres",
    history: "Historique",
    contactUs: "Contactez-nous",
    services: "Services",
    privacy: "Confidentialité",
    // Offres
    specialPrice: "Prix spécial !",
    newProduct: "Nouveau produit !",
    promo: "Promotion !",
    noSpecialOffers: "Pas d'offres spéciales pour le moment",
    offer: "OFFRE",
    // Notifications
    noNotifications: "Aucune notification",
    today: "Aujourd'hui",
    // Paramètres
    language: "Langue / Language",
    accountInfo: "Informations du compte",
    email: "Email",
    name: "Nom",
    emailVerified: "Email vérifié",
    yes: "Oui",
    no: "Non",
    resendVerifyEmail: "Renvoyer l'email de vérification",
    // Messages
    welcomeBack: "Bienvenue !",
    accountCreated: "Compte créé avec succès !",
    loggedOut: "Vous êtes déconnecté",
    productAdded: "Produit ajouté !",
    productDeleted: "Produit supprimé",
    delayUpdated: "Délai mis à jour !",
    delayRequired: "Entrez un délai",
    accountNotFound: "Ce compte n'existe pas. Créez un compte.",
    passwordError: "Le mot de passe doit avoir au moins 6 caractères",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer ce produit ?",
    adminOnly: "Admin seulement",
    emailVerifySent: "📩 Vérifiez votre email pour activer votre compte !",
    emailNotVerified: "❌ Vérifiez votre email avant de vous connecter !",
    emailVerifyWarning: "⚠️ Vérifiez votre email pour continuer",
    resendEmail: "⏳ Si vous ne voyez pas l'email, vérifiez vos spams...",
    errorOccurred: "Erreur : ",
    client: "Client",
    date: "Date",
    // Footer
    footerRights: "Total Lakay © 2025",
    footerContact: "Contactez-nous",
    footerServices: "Services",
    footerPrivacy: "Confidentialité",
  },
  en: {
    // Navigation
    home: "Home",
    shop: "Shop",
    orders: "Orders",
    admin: "Admin",
    login: "Login",
    logout: "Logout",
    // Accueil
    welcome: "Welcome to Total Lakay",
    slogan: "Everything you need, one click away.",
    featured: "Featured products",
    goShop: "Go to shop",
    // Produits
    buy: "Buy",
    price: "Price",
    noProducts: "No products yet",
    loading: "Loading...",
    // Achat
    address: "Your address",
    addressPlaceholder: "Street, City, Zip code",
    payment: "Payment method",
    orderNow: "Order Now",
    orderSuccess: "Order successfully placed!",
    loginRequired: "You must login to purchase",
    fillAllFields: "Please fill all fields",
    // Commandes
    myOrders: "My Orders",
    status: "Status",
    delivery: "Delivery estimate",
    noOrders: "No orders yet",
    pending: "Pending",
    confirmed: "Confirmed",
    waiting: "Waiting...",
    // Admin
    addProduct: "Add a product",
    productName: "Product name",
    productNamePlaceholder: "Ex: White rice",
    productPrice: "Price",
    productPricePlaceholder: "25.00",
    productImage: "Image URL",
    productImagePlaceholder: "https://...",
    productDesc: "Description",
    productDescPlaceholder: "Product description...",
    oldPrice: "Old price (if any)",
    oldPricePlaceholder: "30.00",
    save: "Save",
    delete: "Delete",
    existingProducts: "Existing products",
    customerOrders: "Customer orders",
    noOrdersAdmin: "No orders",
    noProductsAdmin: "No products",
    delayPlaceholder: "Ex: 3 days",
    // Connexion
    loginTitle: "Login to purchase",
    createAccount: "Create account",
    createAccountTitle: "Create your account",
    noAccount: "No account?",
    alreadyAccount: "Already have an account?",
    or: "or",
    continueGoogle: "Continue with Google",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    namePlaceholder: "Your name",
    passwordMin: "Password (min 6 characters)",
    // Menu
    notifications: "Notifications",
    specialOffers: "Special Offers",
    settings: "Settings",
    history: "History",
    contactUs: "Contact us",
    services: "Services",
    privacy: "Privacy",
    // Offres
    specialPrice: "Special price!",
    newProduct: "New product!",
    promo: "Promotion!",
    noSpecialOffers: "No special offers at the moment",
    offer: "OFFER",
    // Notifications
    noNotifications: "No notifications",
    today: "Today",
    // Paramètres
    language: "Language",
    accountInfo: "Account info",
    email: "Email",
    name: "Name",
    emailVerified: "Email verified",
    yes: "Yes",
    no: "No",
    resendVerifyEmail: "Resend verification email",
    // Messages
    welcomeBack: "Welcome!",
    accountCreated: "Account created successfully!",
    loggedOut: "You are logged out",
    productAdded: "Product added!",
    productDeleted: "Product deleted",
    delayUpdated: "Delivery time updated!",
    delayRequired: "Enter a delivery time",
    accountNotFound: "This account doesn't exist. Create an account.",
    passwordError: "Password must be at least 6 characters",
    confirmDelete: "Are you sure you want to delete this product?",
    adminOnly: "Admin only",
    emailVerifySent: "📩 Check your email to verify your account!",
    emailNotVerified: "❌ Verify your email before logging in!",
    emailVerifyWarning: "⚠️ Verify your email to continue",
    resendEmail: "⏳ If you don't see the email, check your spam folder...",
    errorOccurred: "Error: ",
    client: "Client",
    date: "Date",
    // Footer
    footerRights: "Total Lakay © 2025",
    footerContact: "Contact us",
    footerServices: "Services",
    footerPrivacy: "Privacy",
  },
  es: {
    // Navigation
    home: "Inicio",
    shop: "Tienda",
    orders: "Pedidos",
    admin: "Admin",
    login: "Iniciar sesión",
    logout: "Cerrar sesión",
    // Accueil
    welcome: "Bienvenido a Total Lakay",
    slogan: "Todo lo que necesitas, a un clic.",
    featured: "Productos destacados",
    goShop: "Ir a la tienda",
    // Produits
    buy: "Comprar",
    price: "Precio",
    noProducts: "No hay productos aún",
    loading: "Cargando...",
    // Achat
    address: "Tu dirección",
    addressPlaceholder: "Calle, Ciudad, Código postal",
    payment: "Método de pago",
    orderNow: "Ordenar ahora",
    orderSuccess: "¡Pedido registrado con éxito!",
    loginRequired: "Debes iniciar sesión para comprar",
    fillAllFields: "Completa todos los campos",
    // Commandes
    myOrders: "Mis pedidos",
    status: "Estado",
    delivery: "Tiempo de entrega",
    noOrders: "No hay pedidos",
    pending: "Pendiente",
    confirmed: "Confirmado",
    waiting: "Esperando...",
    // Admin
    addProduct: "Añadir producto",
    productName: "Nombre del producto",
    productNamePlaceholder: "Ej: Arroz blanco",
    productPrice: "Precio",
    productPricePlaceholder: "25.00",
    productImage: "URL de imagen",
    productImagePlaceholder: "https://...",
    productDesc: "Descripción",
    productDescPlaceholder: "Descripción del producto...",
    oldPrice: "Precio anterior (si aplica)",
    oldPricePlaceholder: "30.00",
    save: "Guardar",
    delete: "Eliminar",
    existingProducts: "Productos existentes",
    customerOrders: "Pedidos de clientes",
    noOrdersAdmin: "No hay pedidos",
    noProductsAdmin: "No hay productos",
    delayPlaceholder: "Ej: 3 días",
    // Connexion
    loginTitle: "Inicia sesión para comprar",
    createAccount: "Crear cuenta",
    createAccountTitle: "Crea tu cuenta",
    noAccount: "¿No tienes cuenta?",
    alreadyAccount: "¿Ya tienes cuenta?",
    or: "o",
    continueGoogle: "Continuar con Google",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Contraseña",
    namePlaceholder: "Tu nombre",
    passwordMin: "Contraseña (mín 6 caracteres)",
    // Menu
    notifications: "Notificaciones",
    specialOffers: "Ofertas especiales",
    settings: "Configuración",
    history: "Historial",
    contactUs: "Contáctanos",
    services: "Servicios",
    privacy: "Privacidad",
    // Offres
    specialPrice: "¡Precio especial!",
    newProduct: "¡Nuevo producto!",
    promo: "¡Promoción!",
    noSpecialOffers: "No hay ofertas especiales ahora",
    offer: "OFERTA",
    // Notifications
    noNotifications: "No hay notificaciones",
    today: "Hoy",
    // Paramètres
    language: "Idioma",
    accountInfo: "Información de cuenta",
    email: "Email",
    name: "Nombre",
    emailVerified: "Email verificado",
    yes: "Sí",
    no: "No",
    resendVerifyEmail: "Reenviar email de verificación",
    // Messages
    welcomeBack: "¡Bienvenido!",
    accountCreated: "¡Cuenta creada con éxito!",
    loggedOut: "Has cerrado sesión",
    productAdded: "¡Producto añadido!",
    productDeleted: "Producto eliminado",
    delayUpdated: "¡Tiempo de entrega actualizado!",
    delayRequired: "Ingresa un tiempo de entrega",
    accountNotFound: "Esta cuenta no existe. Crea una cuenta.",
    passwordError: "La contraseña debe tener al menos 6 caracteres",
    confirmDelete: "¿Estás seguro de eliminar este producto?",
    adminOnly: "Solo admin",
    emailVerifySent: "📩 ¡Revisa tu email para verificar tu cuenta!",
    emailNotVerified: "❌ ¡Verifica tu email antes de iniciar sesión!",
    emailVerifyWarning: "⚠️ Verifica tu email para continuar",
    resendEmail: "⏳ Si no ves el email, revisa tu carpeta de spam...",
    errorOccurred: "Error: ",
    client: "Cliente",
    date: "Fecha",
    // Footer
    footerRights: "Total Lakay © 2025",
    footerContact: "Contáctanos",
    footerServices: "Servicios",
    footerPrivacy: "Privacidad",
  }
};

// ---------- FONCTIONS UTILITAIRES ----------
function t(key) { return i18n[currentLang]?.[key] || key; }

function applyLanguage() {
  // Mettre à jour tous les éléments avec data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[currentLang]?.[key]) {
      el.textContent = i18n[currentLang][key];
    }
  });
  
  // Mettre à jour les placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (i18n[currentLang]?.[key]) {
      el.placeholder = i18n[currentLang][key];
    }
  });
  
  // Mettre à jour la vue actuelle pour les textes dynamiques
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
    if (!user.emailVerified) {
      showMessage(t('emailVerifyWarning'), 'error');
      setTimeout(() => {
        if (currentUser && !currentUser.emailVerified) {
          auth.signOut();
        }
      }, 5000);
      return;
    }
    
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
    
    const userDocSnap = await db.collection('users').doc(user.uid).get();
    if (!userDocSnap.exists) {
      await db.collection('users').doc(user.uid).set({
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: 'customer',
        emailVerified: user.emailVerified,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } else {
      await db.collection('users').doc(user.uid).update({
        emailVerified: user.emailVerified
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
// BOUTON CONNEXION
// ============================================
document.getElementById('authBtn')?.addEventListener('click', () => {
  const modal = document.getElementById('loginModal');
  const loginCard = document.querySelector('#loginModal .login-card');
  const registerForm = document.getElementById('registerForm');
  
  if (modal) modal.classList.remove('hidden');
  if (loginCard) loginCard.classList.remove('hidden');
  if (registerForm) registerForm.classList.add('hidden');
  
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPassword');
  if (emailInput) emailInput.value = '';
  if (passInput) passInput.value = '';
  
  applyLanguage();
});

document.getElementById('closeLoginModal')?.addEventListener('click', () => {
  document.getElementById('loginModal')?.classList.add('hidden');
});

document.getElementById('closeRegisterModal')?.addEventListener('click', () => {
  document.getElementById('loginModal')?.classList.add('hidden');
});

document.getElementById('loginModal')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('loginModal')) {
    document.getElementById('loginModal').classList.add('hidden');
  }
});

// Google Login
document.getElementById('googleLoginBtn')?.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(() => {
      document.getElementById('loginModal')?.classList.add('hidden');
      showMessage(t('welcomeBack'), 'success');
    })
    .catch(err => showMessage(t('errorOccurred') + err.message, 'error'));
});

// Email Login
document.getElementById('emailLoginBtn')?.addEventListener('click', () => {
  const email = document.getElementById('loginEmail')?.value.trim();
  const password = document.getElementById('loginPassword')?.value;
  
  if (!email || !password) {
    showMessage(t('fillAllFields'), 'error');
    return;
  }
  
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (!user.emailVerified) {
        showMessage(t('emailNotVerified'), 'error');
        showMessage(t('resendEmail'), 'error');
        user.sendEmailVerification().catch(err => console.log(err));
        auth.signOut();
        return;
      }
      document.getElementById('loginModal')?.classList.add('hidden');
      showMessage(t('welcomeBack'), 'success');
    })
    .catch(err => {
      if (err.code === 'auth/user-not-found') {
        showMessage(t('accountNotFound'), 'error');
      } else {
        showMessage(t('errorOccurred') + err.message, 'error');
      }
    });
});

// Switch inscription
document.getElementById('switchToRegister')?.addEventListener('click', (e) => {
  e.preventDefault();
  const loginCard = document.querySelector('#loginModal .login-card');
  const registerForm = document.getElementById('registerForm');
  if (loginCard) loginCard.classList.add('hidden');
  if (registerForm) {
    registerForm.classList.remove('hidden');
    const nameInput = document.getElementById('registerName');
    const emailInput = document.getElementById('registerEmail');
    const passInput = document.getElementById('registerPassword');
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (passInput) passInput.value = '';
  }
  applyLanguage();
});

// Switch connexion
document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
  e.preventDefault();
  const loginCard = document.querySelector('#loginModal .login-card');
  const registerForm = document.getElementById('registerForm');
  if (registerForm) registerForm.classList.add('hidden');
  if (loginCard) loginCard.classList.remove('hidden');
  applyLanguage();
});

// Inscription
document.getElementById('registerBtn')?.addEventListener('click', () => {
  const name = document.getElementById('registerName')?.value.trim();
  const email = document.getElementById('registerEmail')?.value.trim();
  const password = document.getElementById('registerPassword')?.value;
  
  if (!name || !email || !password) {
    showMessage(t('fillAllFields'), 'error');
    return;
  }
  if (password.length < 6) {
    showMessage(t('passwordError'), 'error');
    return;
  }
  
  auth.createUserWithEmailAndPassword(email, password)
    .then(async (cred) => {
      const user = cred.user;
      await user.sendEmailVerification();
      await db.collection('users').doc(user.uid).set({
        email,
        displayName: name,
        role: 'customer',
        emailVerified: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      document.getElementById('loginModal')?.classList.add('hidden');
      await auth.signOut();
      showMessage(t('emailVerifySent'), 'success');
      showMessage(t('resendEmail'), 'success');
    })
    .catch(err => showMessage(t('errorOccurred') + err.message, 'error'));
});

// Déconnexion
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  auth.signOut();
  showMessage(t('loggedOut'), 'success');
});

// ============================================
// MENU DROPDOWN
// ============================================
document.getElementById('menuBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const menu = document.getElementById('dropdownMenu');
  if (menu) menu.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('menuDropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    document.getElementById('dropdownMenu')?.classList.add('hidden');
  }
});

document.getElementById('menuSpecial')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('dropdownMenu')?.classList.add('hidden');
  currentView = 'specialOffers';
  renderView('specialOffers');
});

document.getElementById('menuSettings')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('dropdownMenu')?.classList.add('hidden');
  currentView = 'settings';
  renderView('settings');
});

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

document.getElementById('notifBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const modal = document.getElementById('notifModal');
  if (modal) {
    modal.classList.remove('hidden');
    renderNotifList();
  }
});

document.getElementById('closeNotifModal')?.addEventListener('click', () => {
  document.getElementById('notifModal')?.classList.add('hidden');
});

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
      <div class="notif-date">${n.createdAt?.toDate?.()?.toLocaleDateString?.('fr-FR') || t('today')}</div>
    </div>
  `).join('');
}

// ============================================
// LANGUE
// ============================================
document.getElementById('langSwitch')?.addEventListener('change', (e) => {
  currentLang = e.target.value;
  applyLanguage();
});

// ============================================
// NAVIGATION
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
  
  if (!currentUser.emailVerified) {
    showMessage(t('emailNotVerified'), 'error');
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
    showMessage(t('errorOccurred') + error.message, 'error');
  }
});

// ============================================
// CHARGEMENT DONNÉES
// ============================================
async function loadProducts() {
  try {
    const snap = await db.collection('products').orderBy('createdAt', 'desc').get();
    products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    products = [];
  }
}

async function loadOrders() {
  if (!currentUser) { orders = []; return; }
  try {
    let query = db.collection('orders').orderBy('createdAt', 'desc');
    if (!isAdmin) query = query.where('userId', '==', currentUser.uid);
    const snap = await query.get();
    orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) { orders = []; }
}

// ============================================
// RENDU VUES
// ============================================
async function renderView(view) {
  currentView = view;
  const app = document.getElementById('appContent');
  if (!app) return;
  
  switch (view) {
    case 'home': await renderHome(app); break;
    case 'shop': await renderShop(app); break;
    case 'orders': await renderOrders(app); break;
    case 'admin': await renderAdmin(app); break;
    case 'specialOffers': await renderSpecialOffers(app); break;
    case 'settings': renderSettings(app); break;
    case 'history': await renderHistory(app); break;
    default: await renderHome(app);
  }
}

function productCardHTML(product) {
  const hasPromo = product.oldPrice && product.oldPrice > product.price;
  return `
    <div class="product-card" style="position:relative;">
      ${hasPromo ? `<div class="product-badge">🔥 ${t('specialPrice')}</div>` : ''}
      <img src="${product.image || 'https://via.placeholder.com/400x250/0f1f38/c8963e?text=Total+Lakay'}" 
           alt="${product.name}" class="product-img"
           onerror="this.src='https://via.placeholder.com/400x250/0f1f38/c8963e?text=Total+Lakay'">
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
    </div>`;
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
      <button class="btn btn-gold mt-2" id="goShopBtn">🛒 ${t('goShop')}</button>
    </div>
    <h2 style="margin-top:2rem;">🔥 ${t('featured')}</h2>
    <div class="grid" id="featuredProducts">
      ${products.length === 0 
        ? `<p class="text-center" style="grid-column:1/-1; padding:2rem;">📦 ${t('noProducts')}</p>` 
        : products.slice(0, 4).map(p => productCardHTML(p)).join('')}
    </div>`;
  
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
        : products.map(p => productCardHTML(p)).join('')}
    </div>`;
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
      : `<div class="grid">${specials.map(p => productCardHTML(p)).join('')}</div>`}`;
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
        <label style="font-weight:700;">🌍 ${t('language')}</label>
        <select id="settingsLang" style="color:var(--text-dark); background:white; width:auto; min-width:200px;">
          <option value="ht" ${currentLang==='ht'?'selected':''}>🇭🇹 Kreyòl Ayisyen</option>
          <option value="fr" ${currentLang==='fr'?'selected':''}>🇫🇷 Français</option>
          <option value="en" ${currentLang==='en'?'selected':''}>🇺🇸 English</option>
          <option value="es" ${currentLang==='es'?'selected':''}>🇪🇸 Español</option>
        </select>
      </div>
      ${currentUser ? `
        <div style="margin-top:1.5rem; padding-top:1.5rem; border-top:1px solid var(--gray-200);">
          <h4>${t('accountInfo')}</h4>
          <p><strong>${t('email')}:</strong> ${currentUser.email}</p>
          <p><strong>${t('name')}:</strong> ${currentUser.displayName || '---'}</p>
          <p><strong>${t('emailVerified')}:</strong> ${currentUser.emailVerified ? '✅ ' + t('yes') : '❌ ' + t('no')}</p>
          ${!currentUser.emailVerified ? `
            <button class="btn btn-gold btn-sm mt-2" id="resendVerifyEmail">📧 ${t('resendVerifyEmail')}</button>
          ` : ''}
        </div>
      ` : ''}
    </div>`;
  
  document.getElementById('settingsLang')?.addEventListener('change', (e) => {
    currentLang = e.target.value;
    const langSwitch = document.getElementById('langSwitch');
    if (langSwitch) langSwitch.value = currentLang;
    applyLanguage();
  });
  
  document.getElementById('resendVerifyEmail')?.addEventListener('click', async () => {
    if (currentUser) {
      try {
        await currentUser.sendEmailVerification();
        showMessage(t('emailVerifySent'), 'success');
      } catch (err) {
        showMessage(t('errorOccurred') + err.message, 'error');
      }
    }
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
      </div>`;
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
            ${o.deliveryEstimate ? `<p>🚚 <strong>${t('delivery')}:</strong> ${o.deliveryEstimate}</p>` : `<p>⏳ ${t('waiting')}</p>`}
            <p style="font-size:0.75rem; color:#aaa;">${o.createdAt?.toDate?.()?.toLocaleDateString?.('fr-FR') || ''}</p>
          </div>`).join('')}`;
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
      </div>`;
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
            ${o.deliveryEstimate ? `<p>🚚 <strong>${t('delivery')}:</strong> ${o.deliveryEstimate}</p>` : `<p>⏳ ${t('waiting')}</p>`}
          </div>`).join('')}`;
}

// ============================================
// PAGE ADMIN
// ============================================
async function renderAdmin(app) {
  if (!isAdmin) {
    app.innerHTML = `<div class="card text-center" style="padding:3rem;"><p>⛔ ${t('adminOnly')}</p></div>`;
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
          <input id="adminProdName" placeholder="${t('productNamePlaceholder')}" />
        </div>
        <div>
          <label>${t('productPrice')} ($)</label>
          <input id="adminProdPrice" type="number" placeholder="${t('productPricePlaceholder')}" step="0.01" />
        </div>
      </div>
      <label>${t('oldPrice')}</label>
      <input id="adminProdOldPrice" type="number" placeholder="${t('oldPricePlaceholder')}" step="0.01" />
      <label>${t('productImage')}</label>
      <input id="adminProdImage" placeholder="${t('productImagePlaceholder')}" />
      <label>${t('productDesc')}</label>
      <textarea id="adminProdDesc" rows="2" placeholder="${t('productDescPlaceholder')}"></textarea>
      <button id="addProductBtn" class="btn btn-gold mt-2">✅ ${t('save')}</button>
    </div>
    
    <div class="card">
      <h3>📋 ${t('existingProducts')}</h3>
      <div id="adminProductList">
        ${products.length === 0 ? `<p>${t('noProductsAdmin')}</p>` : products.map(p => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.7rem 0; border-bottom:1px solid var(--gray-200);">
            <span>${p.name} - $${p.price}</span>
            <button class="btn btn-danger btn-sm delete-product" data-id="${p.id}">🗑️ ${t('delete')}</button>
          </div>`).join('')}
      </div>
    </div>
    
    <div class="card">
      <h3>📦 ${t('customerOrders')}</h3>
      <div id="adminOrderList">
        ${orders.length === 0 ? `<p>${t('noOrdersAdmin')}</p>` : orders.map(o => `
          <div style="padding:0.8rem 0; border-bottom:1px solid var(--gray-200);">
            <p><strong>${o.productName}</strong> - $${o.price}</p>
            <p>👤 ${o.userEmail || t('client')} | 📍 ${o.address}</p>
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <input id="delay-${o.id}" placeholder="${t('delayPlaceholder')}" value="${o.deliveryEstimate || ''}" style="flex:1;" />
              <button class="btn btn-success btn-sm update-delay" data-id="${o.id}">⏱️ ${t('save')}</button>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
  
  document.getElementById('addProductBtn')?.addEventListener('click', async () => {
    const name = document.getElementById('adminProdName')?.value.trim();
    const price = parseFloat(document.getElementById('adminProdPrice')?.value);
    const oldPrice = parseFloat(document.getElementById('adminProdOldPrice')?.value) || null;
    const image = document.getElementById('adminProdImage')?.value.trim();
    const description = document.getElementById('adminProdDesc')?.value.trim();
    
    if (!name || !price) { showMessage(t('fillAllFields'), 'error'); return; }
    try {
      await db.collection('products').add({
        name, price, oldPrice, image: image || '', description,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showMessage(t('productAdded'), 'success');
      renderView('admin');
    } catch (error) { showMessage(t('errorOccurred') + error.message, 'error'); }
  });
  
  document.querySelectorAll('.delete-product').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      if (confirm(t('confirmDelete'))) {
        await db.collection('products').doc(e.currentTarget.dataset.id).delete();
        showMessage(t('productDeleted'), 'success');
        renderView('admin');
      }
    });
  });
  
  document.querySelectorAll('.update-delay').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const orderId = e.currentTarget.dataset.id;
      const delay = document.getElementById(`delay-${orderId}`)?.value.trim();
      if (!delay) { showMessage(t('delayRequired'), 'error'); return; }
      try {
        await db.collection('orders').doc(orderId).update({
          deliveryEstimate: delay,
          status: 'confirmed'
        });
        showMessage(t('delayUpdated'), 'success');
        renderView('admin');
      } catch (error) { showMessage(t('errorOccurred') + error.message, 'error'); }
    });
  });
}

// ============================================
// ATTACHER BOUTONS ACHAT + OUVRIR MODAL
// ============================================
function attachBuyButtons() {
  document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = e.currentTarget.getAttribute('data-product-id');
      if (!currentUser) {
        showMessage(t('loginRequired'), 'error');
        document.getElementById('authBtn')?.click();
        return;
      }
      if (!currentUser.emailVerified) {
        showMessage(t('emailNotVerified'), 'error');
        currentView = 'settings';
        renderView('settings');
        return;
      }
      const product = products.find(p => p.id === productId);
      if (!product) return;
      selectedProductId = productId;
      document.getElementById('modalProductName').textContent = product.name;
      document.getElementById('modalProductPrice').textContent = `$${product.price}`;
      document.getElementById('buyModal').classList.remove('hidden');
      const addressInput = document.getElementById('orderAddress');
      if (addressInput) addressInput.value = '';
    });
  });
}

// ============================================
// DÉMARRAGE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Total Lakay démarré!');
  applyLanguage();
  renderView('home');
});
