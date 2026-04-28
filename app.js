/* ============================================
   TOTAL LAKAY - Application Complète Finale
   Firebase configuré - Admin Dashboard + Client
   Toutes traductions - Tous les boutons OK
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
let userRole = null;
let isAdmin = false;
let currentLang = 'ht';
let currentView = 'home';
let products = [];
let orders = [];
let allUsers = [];
let notifications = [];
let selectedProductId = null;

// ---------- TRADUCTIONS COMPLÈTES ----------
const i18n = {
  ht: {
    home: "Akèy", shop: "Boutik", orders: "Kòmand", admin: "Admin",
    login: "Konekte", logout: "Dekonekte",
    dashboard: "Tablodbò", totalProducts: "Total Pwodui",
    totalOrders: "Total Kòmand", totalClients: "Total Kliyan",
    pendingOrders: "Kòmand An Atant", confirmedOrders: "Kòmand Konfime",
    revenue: "Revni Total", recentOrders: "Dènye Kòmand",
    manageProducts: "Jere Pwodui", manageOrders: "Jere Kòmand",
    manageClients: "Jere Kliyan", statistics: "Estatistik",
    quickActions: "Aksyon Rapid",
    welcome: "Byenveni nan Total Lakay", slogan: "Tout bagay lakay ou nan yon sèl klike.",
    featured: "Pwodui rekòmande", goShop: "Ale nan boutik",
    buy: "Achte", price: "Pri", noProducts: "Pa gen pwodui ankò",
    loading: "Chajman...",
    address: "Adrès ou", addressPlaceholder: "Rue, Ville, Kòd postal",
    payment: "Mwayen peman", orderNow: "Kòmande",
    orderSuccess: "Kòmand anrejistre ak siksè !",
    loginRequired: "Ou dwe konekte pou achte", fillAllFields: "Ranpli tout chan yo",
    myOrders: "Kòmand mwen yo", status: "Estati", delivery: "Délai livrezon",
    noOrders: "Pa gen kòmand ankò", pending: "An atant", confirmed: "Konfime",
    cancelled: "Anile", delivered: "Livre", waiting: "An atant...",
    addProduct: "Ajoute yon pwodui", productName: "Non pwodui",
    productNamePlaceholder: "Ex: Diri blan", productPrice: "Pri",
    productPricePlaceholder: "25.00", productImage: "URL imaj",
    productImagePlaceholder: "https://...", productDesc: "Deskripsyon",
    productDescPlaceholder: "Deskripsyon pwodui a...",
    oldPrice: "Ansyen pri (si genyen)", oldPricePlaceholder: "30.00",
    save: "Anrejistre", delete: "Efase", edit: "Modifye",
    existingProducts: "Pwodui ki deja egziste", customerOrders: "Kòmand kliyan yo",
    noOrdersAdmin: "Pa gen kòmand", noProductsAdmin: "Pa gen pwodui",
    delayPlaceholder: "Ex: 3 jou", updateStatus: "Mete ajou estati",
    clients: "Kliyan", client: "Kliyan", clientName: "Non kliyan",
    clientEmail: "Email kliyan", clientSince: "Kliyan depi",
    role: "Wòl", makeAdmin: "Fè admin", makeClient: "Fè kliyan",
    loginTitle: "Konekte pou achte", createAccount: "Kreye yon kont",
    createAccountTitle: "Kreye kont ou", noAccount: "Pa gen kont?",
    alreadyAccount: "Deja gen yon kont?", or: "oubyen",
    continueGoogle: "Kontinye ak Google", emailPlaceholder: "Email",
    passwordPlaceholder: "Modpas", namePlaceholder: "Non ou",
    passwordMin: "Modpas (min 6 karaktè)", selectRole: "Chwazi wòl ou (default: Kliyan)",
    notifications: "Notifikasyon", specialOffers: "Òf espesyal",
    settings: "Paramèt", history: "Istwa",
    specialPrice: "Pri espesyal!", promo: "Promosyon!",
    noSpecialOffers: "Pa gen òf espesyal pou kounye a", offer: "ÒFÈ",
    noNotifications: "Pa gen notifikasyon", today: "Jodi a",
    sendNotification: "Voye notifikasyon", notificationTitle: "Tit notifikasyon",
    notificationMessage: "Mesaj notifikasyon",
    language: "Langue / Language", accountInfo: "Enfòmasyon kont",
    email: "Email", name: "Non", emailVerified: "Email verifye",
    yes: "Wi", no: "Non", resendVerifyEmail: "Renvwaye email verifikasyon",
    welcomeBack: "Byenveni!", welcomeAdmin: "Byenveni Admin!",
    accountCreated: "Kont kreye ak siksè!", loggedOut: "Ou dekonekte",
    productAdded: "Pwodui ajoute!", productUpdated: "Pwodui modifye!",
    productDeleted: "Pwodui efase", delayUpdated: "Délai mete!",
    statusUpdated: "Estati modifye!", delayRequired: "Antre yon délai",
    accountNotFound: "Kont sa a pa egziste. Kreye yon kont.",
    passwordError: "Modpas dwe gen omwen 6 karaktè",
    confirmDelete: "Eske w sèten ou vle efase sa a?",
    adminOnly: "Admin sèlman",
    emailVerifySent: "📩 Tcheke email ou pou verifye kont lan!",
    emailNotVerified: "❌ Verifye email ou avan ou konekte!",
    emailVerifyWarning: "⚠️ Verifye email ou pou kontinye",
    resendEmail: "⏳ Si w poko wè email la, tcheke spam ou...",
    errorOccurred: "Erè: ", clientLabel: "Kliyan", date: "Dat",
    footerRights: "Total Lakay © 2025", footerContact: "Kontakte nou",
    footerServices: "Sèvis", footerPrivacy: "Konfidansyalite",
    notifSent: "✅ Notifikasyon voye!",
    roleChanged: "✅ Wòl modifye!",
    madeAdmin: "✅ Fè admin!",
    madeClient: "✅ Fè kliyan!",
  },
  fr: {
    home: "Accueil", shop: "Boutique", orders: "Commandes", admin: "Admin",
    login: "Connexion", logout: "Déconnexion",
    dashboard: "Tableau de bord", totalProducts: "Total Produits",
    totalOrders: "Total Commandes", totalClients: "Total Clients",
    pendingOrders: "Commandes En Attente", confirmedOrders: "Commandes Confirmées",
    revenue: "Revenu Total", recentOrders: "Dernières Commandes",
    manageProducts: "Gérer Produits", manageOrders: "Gérer Commandes",
    manageClients: "Gérer Clients", statistics: "Statistiques",
    quickActions: "Actions Rapides",
    welcome: "Bienvenue sur Total Lakay", slogan: "Tout ce qu'il vous faut, en un clic.",
    featured: "Produits recommandés", goShop: "Aller à la boutique",
    buy: "Acheter", price: "Prix", noProducts: "Aucun produit",
    loading: "Chargement...",
    address: "Votre adresse", addressPlaceholder: "Rue, Ville, Code postal",
    payment: "Moyen de paiement", orderNow: "Commander",
    orderSuccess: "Commande enregistrée avec succès !",
    loginRequired: "Vous devez être connecté pour acheter",
    fillAllFields: "Remplissez tous les champs",
    myOrders: "Mes commandes", status: "Statut", delivery: "Délai de livraison",
    noOrders: "Aucune commande", pending: "En attente", confirmed: "Confirmé",
    cancelled: "Annulé", delivered: "Livré", waiting: "En attente...",
    addProduct: "Ajouter un produit", productName: "Nom du produit",
    productNamePlaceholder: "Ex: Riz blanc", productPrice: "Prix",
    productPricePlaceholder: "25.00", productImage: "URL de l'image",
    productImagePlaceholder: "https://...", productDesc: "Description",
    productDescPlaceholder: "Description du produit...",
    oldPrice: "Ancien prix (si applicable)", oldPricePlaceholder: "30.00",
    save: "Enregistrer", delete: "Supprimer", edit: "Modifier",
    existingProducts: "Produits existants", customerOrders: "Commandes clients",
    noOrdersAdmin: "Aucune commande", noProductsAdmin: "Aucun produit",
    delayPlaceholder: "Ex: 3 jours", updateStatus: "Mettre à jour le statut",
    clients: "Clients", client: "Client", clientName: "Nom client",
    clientEmail: "Email client", clientSince: "Client depuis",
    role: "Rôle", makeAdmin: "Passer admin", makeClient: "Passer client",
    loginTitle: "Connectez-vous pour acheter", createAccount: "Créer un compte",
    createAccountTitle: "Créer votre compte", noAccount: "Pas de compte ?",
    alreadyAccount: "Déjà un compte ?", or: "ou",
    continueGoogle: "Continuer avec Google", emailPlaceholder: "Email",
    passwordPlaceholder: "Mot de passe", namePlaceholder: "Votre nom",
    passwordMin: "Mot de passe (min 6 caractères)", selectRole: "Choisissez votre rôle (défaut: Client)",
    notifications: "Notifications", specialOffers: "Offres spéciales",
    settings: "Paramètres", history: "Historique",
    specialPrice: "Prix spécial !", promo: "Promotion !",
    noSpecialOffers: "Pas d'offres spéciales pour le moment", offer: "OFFRE",
    noNotifications: "Aucune notification", today: "Aujourd'hui",
    sendNotification: "Envoyer notification", notificationTitle: "Titre notification",
    notificationMessage: "Message notification",
    language: "Langue / Language", accountInfo: "Informations du compte",
    email: "Email", name: "Nom", emailVerified: "Email vérifié",
    yes: "Oui", no: "Non", resendVerifyEmail: "Renvoyer l'email de vérification",
    welcomeBack: "Bienvenue !", welcomeAdmin: "Bienvenue Admin !",
    accountCreated: "Compte créé avec succès !", loggedOut: "Vous êtes déconnecté",
    productAdded: "Produit ajouté !", productUpdated: "Produit modifié !",
    productDeleted: "Produit supprimé", delayUpdated: "Délai mis à jour !",
    statusUpdated: "Statut modifié !", delayRequired: "Entrez un délai",
    accountNotFound: "Ce compte n'existe pas. Créez un compte.",
    passwordError: "Le mot de passe doit avoir au moins 6 caractères",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer ?",
    adminOnly: "Admin seulement",
    emailVerifySent: "📩 Vérifiez votre email pour activer votre compte !",
    emailNotVerified: "❌ Vérifiez votre email avant de vous connecter !",
    emailVerifyWarning: "⚠️ Vérifiez votre email pour continuer",
    resendEmail: "⏳ Si vous ne voyez pas l'email, vérifiez vos spams...",
    errorOccurred: "Erreur : ", clientLabel: "Client", date: "Date",
    footerRights: "Total Lakay © 2025", footerContact: "Contactez-nous",
    footerServices: "Services", footerPrivacy: "Confidentialité",
    notifSent: "✅ Notification envoyée !",
    roleChanged: "✅ Rôle modifié !",
    madeAdmin: "✅ Passé admin !",
    madeClient: "✅ Passé client !",
  },
  en: {
    home: "Home", shop: "Shop", orders: "Orders", admin: "Admin",
    login: "Login", logout: "Logout",
    dashboard: "Dashboard", totalProducts: "Total Products",
    totalOrders: "Total Orders", totalClients: "Total Clients",
    pendingOrders: "Pending Orders", confirmedOrders: "Confirmed Orders",
    revenue: "Total Revenue", recentOrders: "Recent Orders",
    manageProducts: "Manage Products", manageOrders: "Manage Orders",
    manageClients: "Manage Clients", statistics: "Statistics",
    quickActions: "Quick Actions",
    welcome: "Welcome to Total Lakay", slogan: "Everything you need, one click away.",
    featured: "Featured products", goShop: "Go to shop",
    buy: "Buy", price: "Price", noProducts: "No products yet",
    loading: "Loading...",
    address: "Your address", addressPlaceholder: "Street, City, Zip code",
    payment: "Payment method", orderNow: "Order Now",
    orderSuccess: "Order successfully placed!",
    loginRequired: "You must login to purchase", fillAllFields: "Please fill all fields",
    myOrders: "My Orders", status: "Status", delivery: "Delivery estimate",
    noOrders: "No orders yet", pending: "Pending", confirmed: "Confirmed",
    cancelled: "Cancelled", delivered: "Delivered", waiting: "Waiting...",
    addProduct: "Add a product", productName: "Product name",
    productNamePlaceholder: "Ex: White rice", productPrice: "Price",
    productPricePlaceholder: "25.00", productImage: "Image URL",
    productImagePlaceholder: "https://...", productDesc: "Description",
    productDescPlaceholder: "Product description...",
    oldPrice: "Old price (if any)", oldPricePlaceholder: "30.00",
    save: "Save", delete: "Delete", edit: "Edit",
    existingProducts: "Existing products", customerOrders: "Customer orders",
    noOrdersAdmin: "No orders", noProductsAdmin: "No products",
    delayPlaceholder: "Ex: 3 days", updateStatus: "Update status",
    clients: "Clients", client: "Client", clientName: "Client name",
    clientEmail: "Client email", clientSince: "Client since",
    role: "Role", makeAdmin: "Make admin", makeClient: "Make client",
    loginTitle: "Login to purchase", createAccount: "Create account",
    createAccountTitle: "Create your account", noAccount: "No account?",
    alreadyAccount: "Already have an account?", or: "or",
    continueGoogle: "Continue with Google", emailPlaceholder: "Email",
    passwordPlaceholder: "Password", namePlaceholder: "Your name",
    passwordMin: "Password (min 6 characters)", selectRole: "Select your role (default: Client)",
    notifications: "Notifications", specialOffers: "Special Offers",
    settings: "Settings", history: "History",
    specialPrice: "Special price!", promo: "Promotion!",
    noSpecialOffers: "No special offers at the moment", offer: "OFFER",
    noNotifications: "No notifications", today: "Today",
    sendNotification: "Send notification", notificationTitle: "Notification title",
    notificationMessage: "Notification message",
    language: "Language", accountInfo: "Account info",
    email: "Email", name: "Name", emailVerified: "Email verified",
    yes: "Yes", no: "No", resendVerifyEmail: "Resend verification email",
    welcomeBack: "Welcome!", welcomeAdmin: "Welcome Admin!",
    accountCreated: "Account created successfully!", loggedOut: "You are logged out",
    productAdded: "Product added!", productUpdated: "Product updated!",
    productDeleted: "Product deleted", delayUpdated: "Delivery time updated!",
    statusUpdated: "Status updated!", delayRequired: "Enter a delivery time",
    accountNotFound: "This account doesn't exist. Create an account.",
    passwordError: "Password must be at least 6 characters",
    confirmDelete: "Are you sure you want to delete?",
    adminOnly: "Admin only",
    emailVerifySent: "📩 Check your email to verify your account!",
    emailNotVerified: "❌ Verify your email before logging in!",
    emailVerifyWarning: "⚠️ Verify your email to continue",
    resendEmail: "⏳ If you don't see the email, check your spam folder...",
    errorOccurred: "Error: ", clientLabel: "Client", date: "Date",
    footerRights: "Total Lakay © 2025", footerContact: "Contact us",
    footerServices: "Services", footerPrivacy: "Privacy",
    notifSent: "✅ Notification sent!",
    roleChanged: "✅ Role changed!",
    madeAdmin: "✅ Made admin!",
    madeClient: "✅ Made client!",
  },
  es: {
    home: "Inicio", shop: "Tienda", orders: "Pedidos", admin: "Admin",
    login: "Iniciar sesión", logout: "Cerrar sesión",
    dashboard: "Panel de control", totalProducts: "Total Productos",
    totalOrders: "Total Pedidos", totalClients: "Total Clientes",
    pendingOrders: "Pedidos Pendientes", confirmedOrders: "Pedidos Confirmados",
    revenue: "Ingresos Totales", recentOrders: "Pedidos Recientes",
    manageProducts: "Gestionar Productos", manageOrders: "Gestionar Pedidos",
    manageClients: "Gestionar Clientes", statistics: "Estadísticas",
    quickActions: "Acciones Rápidas",
    welcome: "Bienvenido a Total Lakay", slogan: "Todo lo que necesitas, a un clic.",
    featured: "Productos destacados", goShop: "Ir a la tienda",
    buy: "Comprar", price: "Precio", noProducts: "No hay productos aún",
    loading: "Cargando...",
    address: "Tu dirección", addressPlaceholder: "Calle, Ciudad, Código postal",
    payment: "Método de pago", orderNow: "Ordenar ahora",
    orderSuccess: "¡Pedido registrado con éxito!",
    loginRequired: "Debes iniciar sesión para comprar",
    fillAllFields: "Completa todos los campos",
    myOrders: "Mis pedidos", status: "Estado", delivery: "Tiempo de entrega",
    noOrders: "No hay pedidos", pending: "Pendiente", confirmed: "Confirmado",
    cancelled: "Cancelado", delivered: "Entregado", waiting: "Esperando...",
    addProduct: "Añadir producto", productName: "Nombre del producto",
    productNamePlaceholder: "Ej: Arroz blanco", productPrice: "Precio",
    productPricePlaceholder: "25.00", productImage: "URL de imagen",
    productImagePlaceholder: "https://...", productDesc: "Descripción",
    productDescPlaceholder: "Descripción del producto...",
    oldPrice: "Precio anterior (si aplica)", oldPricePlaceholder: "30.00",
    save: "Guardar", delete: "Eliminar", edit: "Editar",
    existingProducts: "Productos existentes", customerOrders: "Pedidos de clientes",
    noOrdersAdmin: "No hay pedidos", noProductsAdmin: "No hay productos",
    delayPlaceholder: "Ej: 3 días", updateStatus: "Actualizar estado",
    clients: "Clientes", client: "Cliente", clientName: "Nombre cliente",
    clientEmail: "Email cliente", clientSince: "Cliente desde",
    role: "Rol", makeAdmin: "Hacer admin", makeClient: "Hacer cliente",
    loginTitle: "Inicia sesión para comprar", createAccount: "Crear cuenta",
    createAccountTitle: "Crea tu cuenta", noAccount: "¿No tienes cuenta?",
    alreadyAccount: "¿Ya tienes cuenta?", or: "o",
    continueGoogle: "Continuar con Google", emailPlaceholder: "Email",
    passwordPlaceholder: "Contraseña", namePlaceholder: "Tu nombre",
    passwordMin: "Contraseña (mín 6 caracteres)", selectRole: "Elige tu rol (defecto: Cliente)",
    notifications: "Notificaciones", specialOffers: "Ofertas especiales",
    settings: "Configuración", history: "Historial",
    specialPrice: "¡Precio especial!", promo: "¡Promoción!",
    noSpecialOffers: "No hay ofertas especiales ahora", offer: "OFERTA",
    noNotifications: "No hay notificaciones", today: "Hoy",
    sendNotification: "Enviar notificación", notificationTitle: "Título notificación",
    notificationMessage: "Mensaje notificación",
    language: "Idioma", accountInfo: "Información de cuenta",
    email: "Email", name: "Nombre", emailVerified: "Email verificado",
    yes: "Sí", no: "No", resendVerifyEmail: "Reenviar email de verificación",
    welcomeBack: "¡Bienvenido!", welcomeAdmin: "¡Bienvenido Admin!",
    accountCreated: "¡Cuenta creada con éxito!", loggedOut: "Has cerrado sesión",
    productAdded: "¡Producto añadido!", productUpdated: "¡Producto actualizado!",
    productDeleted: "Producto eliminado", delayUpdated: "¡Tiempo de entrega actualizado!",
    statusUpdated: "¡Estado actualizado!", delayRequired: "Ingresa un tiempo de entrega",
    accountNotFound: "Esta cuenta no existe. Crea una cuenta.",
    passwordError: "La contraseña debe tener al menos 6 caracteres",
    confirmDelete: "¿Estás seguro de eliminar?",
    adminOnly: "Solo admin",
    emailVerifySent: "📩 ¡Revisa tu email para verificar tu cuenta!",
    emailNotVerified: "❌ ¡Verifica tu email antes de iniciar sesión!",
    emailVerifyWarning: "⚠️ Verifica tu email para continuar",
    resendEmail: "⏳ Si no ves el email, revisa tu carpeta de spam...",
    errorOccurred: "Error: ", clientLabel: "Cliente", date: "Fecha",
    footerRights: "Total Lakay © 2025", footerContact: "Contáctanos",
    footerServices: "Servicios", footerPrivacy: "Privacidad",
    notifSent: "✅ ¡Notificación enviada!",
    roleChanged: "✅ ¡Rol cambiado!",
    madeAdmin: "✅ ¡Hecho admin!",
    madeClient: "✅ ¡Hecho cliente!",
  }
};

// ---------- FONCTIONS UTILITAIRES ----------
function t(key) { return i18n[currentLang]?.[key] || key; }

function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[currentLang]?.[key]) el.textContent = i18n[currentLang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (i18n[currentLang]?.[key]) el.placeholder = i18n[currentLang][key];
  });
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
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

// ============================================
// AUTHENTIFICATION AVEC RÔLES
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
      setTimeout(() => { if (currentUser && !currentUser.emailVerified) auth.signOut(); }, 5000);
      return;
    }
    
    try {
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        userRole = userDoc.data().role || 'client';
        isAdmin = (userRole === 'admin');
      } else {
        userRole = 'client'; isAdmin = false;
        await db.collection('users').doc(user.uid).set({
          email: user.email, displayName: user.displayName || '',
          photoURL: user.photoURL || '', role: 'client',
          emailVerified: true, createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    } catch (e) { userRole = 'client'; isAdmin = false; }
    
    if (authBtn) authBtn.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.remove('hidden');
    userElements.forEach(el => el.classList.remove('hidden'));
    
    if (isAdmin) {
      adminElements.forEach(el => el.classList.remove('hidden'));
    } else {
      adminElements.forEach(el => el.classList.add('hidden'));
    }
    
    if (logoutBtn) logoutBtn.textContent = '🚪 ' + (isAdmin ? 'Admin: ' : '') + t('logout');
  } else {
    if (authBtn) authBtn.classList.remove('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
    adminElements.forEach(el => el.classList.add('hidden'));
    userElements.forEach(el => el.classList.add('hidden'));
    isAdmin = false; userRole = null;
  }
  
  if (currentView === 'admin' && !isAdmin) currentView = 'home';
  renderView(currentView);
  if (isAdmin) loadAllData();
  loadNotifications();
});

// ============================================
// BOUTON CONNEXION
// ============================================
document.getElementById('authBtn')?.addEventListener('click', () => {
  const modal = document.getElementById('loginModal');
  const loginCard = document.getElementById('loginFormCard');
  const registerForm = document.getElementById('registerForm');
  if (modal) modal.classList.remove('hidden');
  if (loginCard) loginCard.classList.remove('hidden');
  if (registerForm) registerForm.classList.add('hidden');
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
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

document.getElementById('googleLoginBtn')?.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(() => { document.getElementById('loginModal')?.classList.add('hidden'); showMessage(t('welcomeBack'), 'success'); })
    .catch(err => showMessage(t('errorOccurred') + err.message, 'error'));
});

document.getElementById('emailLoginBtn')?.addEventListener('click', () => {
  const email = document.getElementById('loginEmail')?.value.trim();
  const password = document.getElementById('loginPassword')?.value;
  if (!email || !password) { showMessage(t('fillAllFields'), 'error'); return; }
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      if (!userCredential.user.emailVerified) {
        showMessage(t('emailNotVerified'), 'error');
        userCredential.user.sendEmailVerification().catch(() => {});
        auth.signOut(); return;
      }
      document.getElementById('loginModal')?.classList.add('hidden');
      showMessage(t('welcomeBack'), 'success');
    })
    .catch(err => {
      if (err.code === 'auth/user-not-found') showMessage(t('accountNotFound'), 'error');
      else showMessage(t('errorOccurred') + err.message, 'error');
    });
});

document.getElementById('switchToRegister')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('loginFormCard').classList.add('hidden');
  document.getElementById('registerForm').classList.remove('hidden');
  document.getElementById('registerName').value = '';
  document.getElementById('registerEmail').value = '';
  document.getElementById('registerPassword').value = '';
  applyLanguage();
});

document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('registerForm').classList.add('hidden');
  document.getElementById('loginFormCard').classList.remove('hidden');
  applyLanguage();
});

document.getElementById('registerBtn')?.addEventListener('click', () => {
  const name = document.getElementById('registerName')?.value.trim();
  const email = document.getElementById('registerEmail')?.value.trim();
  const password = document.getElementById('registerPassword')?.value;
  if (!name || !email || !password) { showMessage(t('fillAllFields'), 'error'); return; }
  if (password.length < 6) { showMessage(t('passwordError'), 'error'); return; }
  auth.createUserWithEmailAndPassword(email, password)
    .then(async (cred) => {
      await cred.user.sendEmailVerification();
      await db.collection('users').doc(cred.user.uid).set({
        email, displayName: name, role: 'client', emailVerified: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      document.getElementById('loginModal')?.classList.add('hidden');
      await auth.signOut();
      showMessage(t('emailVerifySent'), 'success');
    })
    .catch(err => showMessage(t('errorOccurred') + err.message, 'error'));
});

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  auth.signOut();
  showMessage(t('loggedOut'), 'success');
});

// ============================================
// MENU DROPDOWN
// ============================================
document.getElementById('menuBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  document.getElementById('dropdownMenu')?.classList.toggle('hidden');
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('#menuDropdown')) {
    document.getElementById('dropdownMenu')?.classList.add('hidden');
  }
});
document.getElementById('menuSpecial')?.addEventListener('click', (e) => {
  e.preventDefault(); document.getElementById('dropdownMenu')?.classList.add('hidden');
  currentView = 'specialOffers'; renderView('specialOffers');
});
document.getElementById('menuSettings')?.addEventListener('click', (e) => {
  e.preventDefault(); document.getElementById('dropdownMenu')?.classList.add('hidden');
  currentView = 'settings'; renderView('settings');
});
document.getElementById('menuHistory')?.addEventListener('click', (e) => {
  e.preventDefault(); document.getElementById('dropdownMenu')?.classList.add('hidden');
  currentView = 'history'; renderView('history');
});

// ============================================
// NOTIFICATIONS
// ============================================
async function loadNotifications() {
  try {
    const snap = await db.collection('notifications').orderBy('createdAt', 'desc').limit(20).get();
    notifications = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    updateNotifBadge();
  } catch (e) { notifications = []; updateNotifBadge(); }
}
function updateNotifBadge() {
  const badge = document.getElementById('notifBadge');
  if (!badge) return;
  const unread = notifications.filter(n => !n.read).length;
  if (unread > 0) { badge.textContent = unread > 99 ? '99+' : unread; badge.classList.remove('hidden'); }
  else badge.classList.add('hidden');
}
document.getElementById('notifBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  document.getElementById('notifModal').classList.remove('hidden');
  renderNotifList();
});
document.getElementById('closeNotifModal')?.addEventListener('click', () => {
  document.getElementById('notifModal')?.classList.add('hidden');
});
document.getElementById('notifModal')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('notifModal')) document.getElementById('notifModal').classList.add('hidden');
});
function renderNotifList() {
  const list = document.getElementById('notifList');
  if (!list) return;
  if (notifications.length === 0) {
    list.innerHTML = `<p class="text-center" style="padding:2rem;">🔔 ${t('noNotifications')}</p>`; return;
  }
  list.innerHTML = notifications.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}">
      <div class="notif-title">${n.type==='promo'?'🎉':n.type==='new'?'🆕':'💰'} ${n.title}</div>
      <p>${n.message}</p>
      <div class="notif-date">${n.createdAt?.toDate?.()?.toLocaleDateString?.('fr-FR') || t('today')}</div>
    </div>`).join('');
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
  e.preventDefault(); setActiveNav('navHome');
  currentView = isAdmin ? 'admin' : 'home'; renderView(currentView);
});
document.getElementById('navShop')?.addEventListener('click', (e) => {
  e.preventDefault(); setActiveNav('navShop');
  currentView = 'shop'; renderView('shop');
});
document.getElementById('navOrders')?.addEventListener('click', (e) => {
  e.preventDefault(); setActiveNav('navOrders');
  currentView = 'orders'; renderView('orders');
});
document.getElementById('navAdmin')?.addEventListener('click', (e) => {
  e.preventDefault(); setActiveNav('navAdmin');
  currentView = 'admin'; renderView('admin');
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
document.getElementById('submitOrder')?.addEventListener('click', async () => {
  if (!currentUser) { showMessage(t('loginRequired'), 'error'); return; }
  if (!currentUser.emailVerified) { showMessage(t('emailNotVerified'), 'error'); return; }
  const address = document.getElementById('orderAddress')?.value.trim();
  const payment = document.getElementById('orderPayment')?.value;
  if (!address) { showMessage(t('fillAllFields'), 'error'); return; }
  const product = products.find(p => p.id === selectedProductId);
  if (!product) return;
  try {
    await db.collection('orders').add({
      userId: currentUser.uid, userEmail: currentUser.email,
      productId: product.id, productName: product.name,
      price: product.price, image: product.image || '',
      address, payment, status: 'pending', deliveryEstimate: '',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById('buyModal')?.classList.add('hidden');
    document.getElementById('orderAddress').value = '';
    showMessage(t('orderSuccess'), 'success');
  } catch (error) { showMessage(t('errorOccurred') + error.message, 'error'); }
});

// ============================================
// CHARGEMENT DONNÉES
// ============================================
async function loadProducts() {
  try {
    const snap = await db.collection('products').orderBy('createdAt', 'desc').get();
    products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) { products = []; }
}
async function loadAllOrders() {
  try {
    const snap = await db.collection('orders').orderBy('createdAt', 'desc').get();
    orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) { orders = []; }
}
async function loadMyOrders() {
  if (!currentUser) { orders = []; return; }
  try {
    const snap = await db.collection('orders').where('userId', '==', currentUser.uid).orderBy('createdAt', 'desc').get();
    orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) { orders = []; }
}
async function loadAllUsers() {
  try {
    const snap = await db.collection('users').get();
    allUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) { allUsers = []; }
}
async function loadAllData() {
  await Promise.all([loadProducts(), loadAllOrders(), loadAllUsers()]);
}

// ============================================
// RENDU VUES
// ============================================
async function renderView(view) {
  currentView = view;
  const app = document.getElementById('appContent');
  if (!app) return;
  
  if (isAdmin && (view === 'home' || view === 'admin')) {
    await renderAdminDashboard(app);
  } else {
    switch (view) {
      case 'home': await renderHome(app); break;
      case 'shop': await renderShop(app); break;
      case 'orders': await renderClientOrders(app); break;
      case 'specialOffers': await renderSpecialOffers(app); break;
      case 'settings': renderSettings(app); break;
      case 'history': await renderClientOrders(app); break;
      default: await renderHome(app);
    }
  }
}

function productCardHTML(product) {
  const hasPromo = product.oldPrice && product.oldPrice > product.price;
  return `
    <div class="product-card" style="position:relative;">
      ${hasPromo ? `<div class="product-badge">🔥 ${t('specialPrice')}</div>` : ''}
      <img src="${product.image || 'https://via.placeholder.com/400x250/0f1f38/c8963e?text=Total+Lakay'}" alt="${product.name}" class="product-img" onerror="this.src='https://via.placeholder.com/400x250/0f1f38/c8963e?text=Total+Lakay'">
      <div class="product-info">
        <div class="product-title">${product.name}</div>
        ${product.description ? `<div class="product-description">${product.description.substring(0, 60)}...</div>` : ''}
        <div class="product-price">$${product.price} ${hasPromo ? `<span class="old-price">$${product.oldPrice}</span>` : ''}</div>
        <button class="btn btn-gold btn-sm buy-btn" data-product-id="${product.id}">🛒 ${t('buy')}</button>
      </div>
    </div>`;
}

// ============================================
// DASHBOARD ADMIN
// ============================================
async function renderAdminDashboard(app) {
  if (!isAdmin) { app.innerHTML = `<div class="card text-center"><p>⛔ ${t('adminOnly')}</p></div>`; return; }
  await loadAllData();
  
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalClients = allUsers.filter(u => u.role === 'client').length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0);
  
  app.innerHTML = `
    <h2>📊 ${t('dashboard')} - ${t('welcomeAdmin')}</h2>
    
    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap:1rem; margin:1.5rem 0;">
      <div class="card text-center" style="padding:1.2rem; border-left:4px solid #c8963e;">
        <div style="font-size:2rem; font-weight:800; color:#c8963e;">${totalProducts}</div>
        <div>📦 ${t('totalProducts')}</div>
      </div>
      <div class="card text-center" style="padding:1.2rem; border-left:4px solid #1e7e5b;">
        <div style="font-size:2rem; font-weight:800; color:#1e7e5b;">${totalOrders}</div>
        <div>📋 ${t('totalOrders')}</div>
      </div>
      <div class="card text-center" style="padding:1.2rem; border-left:4px solid #1e6b8a;">
        <div style="font-size:2rem; font-weight:800; color:#1e6b8a;">${totalClients}</div>
        <div>👥 ${t('totalClients')}</div>
      </div>
      <div class="card text-center" style="padding:1.2rem; border-left:4px solid #f39c12;">
        <div style="font-size:2rem; font-weight:800; color:#f39c12;">$${totalRevenue.toFixed(2)}</div>
        <div>💰 ${t('revenue')}</div>
      </div>
    </div>
    
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
      <div class="card text-center" style="padding:1rem;">
        <div style="font-size:1.5rem; font-weight:800; color:#f39c12;">${pendingCount}</div>
        <div>⏳ ${t('pendingOrders')}</div>
      </div>
      <div class="card text-center" style="padding:1rem;">
        <div style="font-size:1.5rem; font-weight:800; color:#1e7e5b;">${confirmedCount}</div>
        <div>✅ ${t('confirmedOrders')}</div>
      </div>
    </div>
    
    <div class="card">
      <h3>⚡ ${t('quickActions')}</h3>
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.5rem;">
        <button class="btn btn-gold btn-sm" id="adminAddProductBtn">➕ ${t('addProduct')}</button>
        <button class="btn btn-sm" id="adminManageOrdersBtn">📦 ${t('manageOrders')}</button>
        <button class="btn btn-sm" id="adminManageClientsBtn">👥 ${t('manageClients')}</button>
        <button class="btn btn-accent btn-sm" id="adminSendNotifBtn">🔔 ${t('sendNotification')}</button>
      </div>
    </div>
    
    <div id="adminAddProductForm" class="card hidden">
      <h3>➕ ${t('addProduct')}</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
        <div><label>${t('productName')}</label><input id="adminProdName" placeholder="${t('productNamePlaceholder')}"></div>
        <div><label>${t('productPrice')} ($)</label><input id="adminProdPrice" type="number" placeholder="${t('productPricePlaceholder')}" step="0.01"></div>
      </div>
      <label>${t('oldPrice')}</label><input id="adminProdOldPrice" type="number" placeholder="${t('oldPricePlaceholder')}" step="0.01">
      <label>${t('productImage')}</label><input id="adminProdImage" placeholder="${t('productImagePlaceholder')}">
      <label>${t('productDesc')}</label><textarea id="adminProdDesc" rows="2" placeholder="${t('productDescPlaceholder')}"></textarea>
      <button id="saveProductBtn" class="btn btn-gold mt-2">✅ ${t('save')}</button>
    </div>
    
    <div class="card mt-2">
      <h3>📋 ${t('existingProducts')} (${totalProducts})</h3>
      <div id="adminProductList">
        ${products.length === 0 ? `<p>${t('noProductsAdmin')}</p>` : products.map(p => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0; border-bottom:1px solid #eee;">
            <span>📦 ${p.name} - <strong>$${p.price}</strong></span>
            <button class="btn btn-danger btn-sm delete-product" data-id="${p.id}">🗑️</button>
          </div>`).join('')}
      </div>
    </div>
    
    <div class="card mt-2">
      <h3>🕐 ${t('recentOrders')} (${totalOrders})</h3>
      <div id="adminOrderList">
        ${orders.length === 0 ? `<p>${t('noOrdersAdmin')}</p>` : orders.slice(0, 10).map(o => `
          <div style="padding:0.6rem 0; border-bottom:1px solid #eee;">
            <div style="display:flex; justify-content:space-between; flex-wrap:wrap;">
              <strong>${o.productName}</strong>
              <select class="status-select" data-order-id="${o.id}" style="width:auto; padding:0.3rem;">
                <option value="pending" ${o.status==='pending'?'selected':''}>⏳ ${t('pending')}</option>
                <option value="confirmed" ${o.status==='confirmed'?'selected':''}>✅ ${t('confirmed')}</option>
                <option value="delivered" ${o.status==='delivered'?'selected':''}>🚚 ${t('delivered')}</option>
                <option value="cancelled" ${o.status==='cancelled'?'selected':''}>❌ ${t('cancelled')}</option>
              </select>
            </div>
            <p style="font-size:0.85rem;">💰 $${o.price} | 👤 ${o.userEmail || t('clientLabel')} | 📍 ${o.address}</p>
            <input id="delay-${o.id}" placeholder="${t('delayPlaceholder')}" value="${o.deliveryEstimate || ''}" style="width:60%; display:inline;">
            <button class="btn btn-success btn-sm update-delay" data-id="${o.id}">⏱️</button>
          </div>`).join('')}
      </div>
    </div>
    
    <div id="adminClientsList" class="card mt-2 hidden">
      <h3>👥 ${t('manageClients')} (${allUsers.length})</h3>
      ${allUsers.map(u => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid #eee;">
          <div>
            <strong>${u.displayName || u.email}</strong>
            <span class="badge ${u.role==='admin'?'badge-success':''}" style="margin-left:0.5rem;">${u.role}</span>
          </div>
          <button class="btn btn-sm ${u.role==='admin'?'btn-danger':'btn-gold'} toggle-role" data-uid="${u.id}" data-role="${u.role}">
            ${u.role==='admin' ? t('makeClient') : t('makeAdmin')}
          </button>
        </div>`).join('')}
    </div>
    
    <div id="adminSendNotifForm" class="card mt-2 hidden">
      <h3>🔔 ${t('sendNotification')}</h3>
      <input id="notifTitle" placeholder="${t('notificationTitle')}">
      <textarea id="notifMessage" placeholder="${t('notificationMessage')}"></textarea>
      <button id="sendNotifBtn" class="btn btn-gold mt-2">📤 ${t('sendNotification')}</button>
    </div>
  `;
  
  // Events Admin
  document.getElementById('adminAddProductBtn')?.addEventListener('click', () => {
    document.getElementById('adminAddProductForm').classList.toggle('hidden');
    document.getElementById('adminClientsList').classList.add('hidden');
    document.getElementById('adminSendNotifForm').classList.add('hidden');
  });
  document.getElementById('adminManageOrdersBtn')?.addEventListener('click', () => {
    document.getElementById('adminOrderList').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('adminManageClientsBtn')?.addEventListener('click', () => {
    document.getElementById('adminClientsList').classList.toggle('hidden');
    document.getElementById('adminAddProductForm').classList.add('hidden');
    document.getElementById('adminSendNotifForm').classList.add('hidden');
  });
  document.getElementById('adminSendNotifBtn')?.addEventListener('click', () => {
    document.getElementById('adminSendNotifForm').classList.toggle('hidden');
    document.getElementById('adminAddProductForm').classList.add('hidden');
    document.getElementById('adminClientsList').classList.add('hidden');
  });
  
  document.getElementById('saveProductBtn')?.addEventListener('click', async () => {
    const name = document.getElementById('adminProdName')?.value.trim();
    const price = parseFloat(document.getElementById('adminProdPrice')?.value);
    const oldPrice = parseFloat(document.getElementById('adminProdOldPrice')?.value) || null;
    const image = document.getElementById('adminProdImage')?.value.trim();
    const description = document.getElementById('adminProdDesc')?.value.trim();
    if (!name || !price) { showMessage(t('fillAllFields'), 'error'); return; }
    try {
      await db.collection('products').add({ name, price, oldPrice, image: image || '', description, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      showMessage(t('productAdded'), 'success');
      await loadAllData(); renderView('admin');
    } catch (error) { showMessage(t('errorOccurred') + error.message, 'error'); }
  });
  
  document.querySelectorAll('.delete-product').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      if (confirm(t('confirmDelete'))) {
        await db.collection('products').doc(e.currentTarget.dataset.id).delete();
        showMessage(t('productDeleted'), 'success');
        await loadAllData(); renderView('admin');
      }
    });
  });
  
  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', async (e) => {
      await db.collection('orders').doc(e.target.dataset.orderId).update({ status: e.target.value });
      showMessage(t('statusUpdated'), 'success');
    });
  });
  
  document.querySelectorAll('.update-delay').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const orderId = e.currentTarget.dataset.id;
      const delay = document.getElementById(`delay-${orderId}`).value.trim();
      if (!delay) { showMessage(t('delayRequired'), 'error'); return; }
      await db.collection('orders').doc(orderId).update({ deliveryEstimate: delay });
      showMessage(t('delayUpdated'), 'success');
    });
  });
  
  document.querySelectorAll('.toggle-role').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const uid = e.currentTarget.dataset.uid;
      const currentRole = e.currentTarget.dataset.role;
      const newRole = currentRole === 'admin' ? 'client' : 'admin';
      await db.collection('users').doc(uid).update({ role: newRole });
      showMessage(newRole === 'admin' ? t('madeAdmin') : t('madeClient'), 'success');
      await loadAllData(); renderView('admin');
    });
  });
  
  document.getElementById('sendNotifBtn')?.addEventListener('click', async () => {
    const title = document.getElementById('notifTitle')?.value.trim();
    const message = document.getElementById('notifMessage')?.value.trim();
    if (!title || !message) { showMessage(t('fillAllFields'), 'error'); return; }
    await db.collection('notifications').add({ title, message, type: 'promo', read: false, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    showMessage(t('notifSent'), 'success');
    document.getElementById('notifTitle').value = '';
    document.getElementById('notifMessage').value = '';
    document.getElementById('adminSendNotifForm').classList.add('hidden');
  });
}

// ============================================
// PAGES CLIENT
// ============================================
async function renderHome(app) {
  await loadProducts();
  const specials = products.filter(p => p.oldPrice && p.oldPrice > p.price);
  app.innerHTML = `
    <div class="card text-center">
      <h1 style="color:var(--blue-deep);">🏠 ${t('welcome')}</h1>
      <p style="font-size:1.2rem;">${t('slogan')}</p>
      ${specials.length > 0 ? `<div class="special-offer-card mt-2" style="text-align:left;"><h3>🎉 ${t('specialPrice')}!</h3><p><strong>${specials[0].name}</strong> - $${specials[0].price} <span style="text-decoration:line-through;">$${specials[0].oldPrice}</span></p></div>` : ''}
      <button class="btn btn-gold mt-2" id="goShopBtn">🛒 ${t('goShop')}</button>
    </div>
    <h2>🔥 ${t('featured')}</h2>
    <div class="grid">${products.length===0?`<p>📦 ${t('noProducts')}</p>`:products.slice(0,4).map(p=>productCardHTML(p)).join('')}</div>`;
  document.getElementById('goShopBtn')?.addEventListener('click', () => { currentView='shop'; renderView('shop'); });
  attachBuyButtons();
}
async function renderShop(app) {
  await loadProducts();
  app.innerHTML = `<h2>🛍️ ${t('shop')}</h2><div class="grid">${products.length===0?`<p>📦 ${t('noProducts')}</p>`:products.map(p=>productCardHTML(p)).join('')}</div>`;
  attachBuyButtons();
}
async function renderSpecialOffers(app) {
  await loadProducts();
  const specials = products.filter(p => p.oldPrice && p.oldPrice > p.price);
  app.innerHTML = `<h2>🎉 ${t('specialOffers')}</h2>${specials.length===0?`<p>📭 ${t('noSpecialOffers')}</p>`:`<div class="grid">${specials.map(p=>productCardHTML(p)).join('')}</div>`}`;
  attachBuyButtons();
}
async function renderClientOrders(app) {
  if (!currentUser) { app.innerHTML = `<div class="card text-center"><p>🔐 ${t('loginRequired')}</p><button class="btn btn-gold" id="loginFromOrders">${t('login')}</button></div>`; document.getElementById('loginFromOrders')?.addEventListener('click', () => document.getElementById('authBtn')?.click()); return; }
  await loadMyOrders();
  app.innerHTML = `<h2>📦 ${t('myOrders')}</h2>${orders.length===0?`<p>📭 ${t('noOrders')}</p>`:orders.map(o=>`
    <div class="card" style="margin-bottom:0.8rem;">
      <div style="display:flex; justify-content:space-between; flex-wrap:wrap;"><strong>${o.productName}</strong><span class="badge ${o.status==='confirmed'?'badge-success':'badge-pending'}">${t(o.status)}</span></div>
      <p>💰 $${o.price} | 💳 ${o.payment} | 📍 ${o.address}</p>
      ${o.deliveryEstimate?`<p>🚚 ${t('delivery')}: ${o.deliveryEstimate}</p>`:`<p>⏳ ${t('waiting')}</p>`}
    </div>`).join('')}`;
}
function renderSettings(app) {
  app.innerHTML = `
    <div class="card-premium">
      <h2>⚙️ ${t('settings')}</h2>
      <div><label>🌍 ${t('language')}</label><select id="settingsLang" style="width:auto;"><option value="ht" ${currentLang==='ht'?'selected':''}>🇭🇹 Kreyòl</option><option value="fr" ${currentLang==='fr'?'selected':''}>🇫🇷 Français</option><option value="en" ${currentLang==='en'?'selected':''}>🇺🇸 English</option><option value="es" ${currentLang==='es'?'selected':''}>🇪🇸 Español</option></select></div>
      ${currentUser?`<div style="margin-top:1.5rem; padding-top:1.5rem; border-top:1px solid #eee;"><h4>${t('accountInfo')}</h4><p><strong>${t('email')}:</strong> ${currentUser.email}</p><p><strong>${t('name')}:</strong> ${currentUser.displayName||'---'}</p><p><strong>${t('role')}:</strong> ${isAdmin?'Admin':'Client'}</p><p><strong>${t('emailVerified')}:</strong> ${currentUser.emailVerified?'✅ '+t('yes'):'❌ '+t('no')}</p>${!currentUser.emailVerified?`<button class="btn btn-gold btn-sm mt-2" id="resendVerifyEmail">📧 ${t('resendVerifyEmail')}</button>`:''}</div>`:''}
    </div>`;
  document.getElementById('settingsLang')?.addEventListener('change', (e) => { currentLang=e.target.value; document.getElementById('langSwitch').value=currentLang; applyLanguage(); });
  document.getElementById('resendVerifyEmail')?.addEventListener('click', async () => { if(currentUser){ await currentUser.sendEmailVerification(); showMessage(t('emailVerifySent'),'success'); } });
}

// ============================================
// ATTACHER BOUTONS ACHAT
// ============================================
function attachBuyButtons() {
  document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!currentUser) { showMessage(t('loginRequired'),'error'); document.getElementById('authBtn')?.click(); return; }
      if (!currentUser.emailVerified) { showMessage(t('emailNotVerified'),'error'); return; }
      const product = products.find(p => p.id === e.currentTarget.dataset.productId);
      if (!product) return;
      selectedProductId = product.id;
      document.getElementById('modalProductName').textContent = product.name;
      document.getElementById('modalProductPrice').textContent = `$${product.price}`;
      document.getElementById('buyModal').classList.remove('hidden');
      document.getElementById('orderAddress').value = '';
    });
  });
}

// ============================================
// DÉMARRAGE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Total Lakay - Version Finale Admin+Client');
  applyLanguage();
  renderView('home');
});
