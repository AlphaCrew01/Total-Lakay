/* ============================================
   TOTAL LAKAY - Version Finale Ultime
   Firebase configuré - Admin Dashboard + Client
   Recherche & Filtres - Toutes traductions
   ============================================ */

// ---------- GESTION DES ERREURS GLOBALE ----------
window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.error('Total Lakay Error:', msg, url, lineNo);
    return false;
};

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
let currentCurrency = 'HTG';
let currentView = 'home';
let products = [];
let orders = [];
let allUsers = [];
let notifications = [];
let cart = JSON.parse(localStorage.getItem('totalLakayCart') || '[]');
let favorites = JSON.parse(localStorage.getItem('totalLakayFavorites') || '[]');
let selectedProductId = null;
let moncashConfig = { clientId: '', clientSecret: '', mode: 'sandbox' };

const exchangeRates = {
    HTG: 1,
    USD: 1 / 135,
    EUR: 1 / 140
};

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
        save: "Enrejistre", delete: "Efase", edit: "Modifye",
        existingProducts: "Pwodui ki deja egziste", customerOrders: "Kòmand kliyan yo",
        noOrdersAdmin: "Pa gen kòmand", noProductsAdmin: "Pa gen pwodui",
        delayPlaceholder: "Ex: 3 jou", updateStatus: "Mete ajou estati",
        clients: "Kliyan", client: "Kliyan", clientName: "Non kliyan",
        clientEmail: "Email kliyan", clientSince: "Kliyan depi",
        role: "Ròl", makeAdmin: "Fè admin", makeClient: "Fè kliyan",
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
        emailVerifySent: "Tcheke email ou pou verifye kont lan!",
        emailNotVerified: "Verifye email ou avan ou konekte!",
        emailVerifyWarning: "Verifye email ou pou kontinye",
        resendEmail: "Si w poko wè email la, tcheke spam ou...",
        errorOccurred: "Erè: ", clientLabel: "Kliyan", date: "Dat",
        footerRights: "Total Lakay © 2026", footerContact: "Kontakte nou",
        footerServices: "Sèvis", footerPrivacy: "Konfidansyalite",
        footerTerms: "Kondisyon Itilizasyon",
        notifSent: "Notifikasyon voye!",
        roleChanged: "Wòl modifye!",
        madeAdmin: "Fè admin!",
        madeClient: "Fè kliyan!",
        searchPlaceholder: "Rechèche yon pwodui...",
        allCategories: "Tout kategori",
        priceMin: "Pri min",
        priceMax: "Pri max",
        applyFilters: "Filtre",
        resetFilters: "Reinisyalize",
        sortDateDesc: "Pi resan",
        sortDateAsc: "Pi ansyen",
        sortPriceAsc: "Pri: Ba → Wo",
        sortPriceDesc: "Pri: Wo → Ba",
        sortNameAsc: "Non: A → Z",
        sortNameDesc: "Non: Z → A",
        resultsFound: "rezilta jwenn",
        noResultsFound: "Pa gen rezilta. Eseye ak lòt mo.",
        categoryElectronicsTech: "Elektwonik",
        categoryClothingAccessories: "Vètman ak Akseswa",
        categorySchoolOffice: "Lekòl ak Travay",
        categoryHomePersonal: "Kay ak Pèsonèl",
        categoryBeauty: "Bote",
        categoryOther: "Lòt",
        balance: "Balans",
        myBalance: "Balans ou",
        refund: "Lajan Rembourse",
        onlineClients: "Kliyan an liy",
        aiAssistant: "Asistan IA",
        aiPageTitle: "Konvèsasyon ak IA",
        aiWelcome: "Bonjou! Kouman mwen ka ede w jodi a?",
        aiInputPlaceholder: "Ekri mesaj ou a...",
        aiError: "Mwen gen yon ti pwoblèm koneksyon. Tanpri eseye ankò.",
        aiTyping: "Analize...",
        aiLoginRequiredDesc: "Ou dwe konekte pou w ka pale ak asistan entèlijan nou an.",
        cart: "Panyen", checkout: "Peye kounye a", securePaymentInfo: "Peman 100% sekirize",
        favorites: "Favori", noFavorites: "Pa gen favori ankò",
        profile: "Profil",
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
        loginRequired: "Vous devez être connecté pour acheter", fillAllFields: "Remplissez tous les champs",
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
        role: "Rôle", makeAdmin: "Faire admin", makeClient: "Faire client",
        loginTitle: "Connexion pour acheter", createAccount: "Créer un compte",
        createAccountTitle: "Créez votre compte", noAccount: "Pas de compte ?",
        alreadyAccount: "Déjà un compte ?", or: "ou",
        continueGoogle: "Continuer avec Google", emailPlaceholder: "Email",
        passwordPlaceholder: "Mot de passe", namePlaceholder: "Votre nom",
        passwordMin: "Mot de passe (min 6 caractères)", selectRole: "Choisissez votre rôle (défaut : Client)",
        notifications: "Notifications", specialOffers: "Offres spéciales",
        settings: "Paramètres", history: "Historique",
        specialPrice: "Prix spécial !", promo: "Promotion !",
        noSpecialOffers: "Aucune offre spéciale pour le moment", offer: "OFFRE",
        noNotifications: "Aucune notification", today: "Aujourd'hui",
        sendNotification: "Envoyer notification", notificationTitle: "Titre notification",
        notificationMessage: "Message notification",
        language: "Langue", accountInfo: "Informations du compte",
        email: "Email", name: "Nom", emailVerified: "Email vérifié",
        yes: "Oui", no: "Non", resendVerifyEmail: "Renvoyer l'email de vérification",
        aiAssistant: "Assistant IA",
        aiPageTitle: "Discussion avec l'IA",
        aiWelcome: "Bonjour ! Comment puis-je vous aider ?",
        aiInputPlaceholder: "Écrivez votre message...",
        aiError: "Erreur de connexion IA.",
        aiTyping: "Analyse...",
        aiLoginRequiredDesc: "Connectez-vous pour parler à l'IA.",
        allCategories: "Toutes catégories",
        categoryElectronicsTech: "Électronique",
        categoryClothingAccessories: "Vêtements",
        categorySchoolOffice: "École & Travail",
        categoryHomePersonal: "Maison",
        categoryBeauty: "Beauté",
        categoryOther: "Autres",
        cart: "Panier", checkout: "Payer", securePaymentInfo: "Paiement sécurisé",
        favorites: "Favoris", noFavorites: "Pas encore de favoris",
        profile: "Profil",
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
        accountNotFound: "This account doesn't exist. Create an account.",
        passwordError: "Password must be at least 6 characters",
        confirmDelete: "Are you sure you want to delete?",
        adminOnly: "Admin only",
        emailVerifySent: "📩 Check your email to verify your account!",
        emailNotVerified: "❌ Verify your email before logging in!",
        emailVerifyWarning: "⚠️ Verify your email to continue",
        resendEmail: "⏳ If you don't see the email, check your spam folder...",
        errorOccurred: "Error: ", clientLabel: "Client", date: "Date",
        footerRights: "Total Lakay © 2026", footerContact: "Contact us",
        footerServices: "Services", footerPrivacy: "Privacy",
        footerTerms: "Terms of Use",
        notifSent: "✅ Notification sent!",
        roleChanged: "✅ Role changed!",
        madeAdmin: "✅ Made admin!",
        madeClient: "✅ Made client!",
        searchPlaceholder: "🔍 Search a product...",
        aiAssistant: "AI Assistant",
        aiPageTitle: "Chat with AI",
        aiPageDesc: "Ask our intelligent assistant any questions about the platform or our products.",
        aiWelcome: "Hello! How can I help you today?",
        aiInputPlaceholder: "Type your message...",
        aiError: "I have a connection problem. Please try again.",
        aiTyping: "🤔 Analyzing...",
        aiLoginRequiredDesc: "You must be logged in to chat with our intelligent assistant.",
        allCategories: "All categories",
        priceMin: "Min price",
        priceMax: "Max price",
        applyFilters: "Filter",
        resetFilters: "Reset",
        sortDateDesc: "Newest",
        sortDateAsc: "Oldest",
        sortPriceAsc: "Price: Low → High",
        sortPriceDesc: "Price: High → Low",
        sortNameAsc: "Name: A → Z",
        sortNameDesc: "Name: Z → A",
        resultsFound: "results found",
        noResultsFound: "No results. Try other words.",
        categoryElectronics: "📱 Electronics",
        categoryClothing: "👕 Clothing & Accessories",
        categorySchool: "🎓 School",
        categoryWork: "💼 Work",
        categoryHome: "🏠 Home",
        categoryBeauty: "💄 Beauty",
        categoryOther: "📦 Other",
        categoryClothingAccessories: "👕 Clothing & Accessories",
        categorySchoolOffice: "🎓 School & Work",
        categoryHomePersonal: "🏠 Home & Personal",
        categoryElectronicsTech: "📱 Electronics",
        balance: "Balance",
        myBalance: "Your balance",
        refund: "Money Refunded",
        onlineClients: "Online Clients",
        moncashSettings: "MonCash Settings (Real Payment)",
        saveConfig: "Save Configuration",
        linkMoncash: "Link your MonCash account",
        moncashPhone: "Your MonCash number",
        moncashTerms: "I accept the MonCash terms of use and privacy policy",
        connect: "Link",
        connected: "Linked successfully",
        termsConsentTitle: "Terms of Use",
        termsConsentDesc: "To continue using Total Lakay, you must accept our terms of use and our privacy policy.",
        accept: "Accept", decline: "Decline",
        cancellationReason: "Cancellation Reason", reasonPlaceholder: "Why are you cancelling this order?",
        reasonRequired: "You must provide a reason for the cancellation.",
        recentProducts: "Recent Products", categoriesTitle: "Categories", exploreCategories: "Explore all our categories",
        school: "School", work: "Work", home: "Home", electronics: "Electronics", beauty: "Beauty", clothing: "Clothing",
        stock: "Stock Quantity", category: "Category", colors: "Colors (comma separated)", sizes: "Sizes (comma separated)",
        selectColor: "Select Color", selectSize: "Select Size", quantity: "Quantity", outOfStock: "Out of stock",
        servicesTitle: "Our Services", privacyTitle: "Privacy Policy", termsTitle: "Terms of Use",
        phoneRecommend: "Your phone number", addressRecommend: "Your full address", phoneRequired: "Phone is required",
        cart: "Cart", checkout: "Checkout now", securePaymentInfo: "100% Secure Payment",
        profile: "Profile", phone: "Phone", phonePlaceholder: "Ex: +509 1234 5678",
        updateProfile: "Update Profile", profileUpdated: "Profile updated successfully!",
        phoneNumber: "Phone Number", saveProfile: "Save Profile",
        addressRecommend: "Address (Recommended)", phoneRecommend: "Phone (Recommended)",
        addToCart: "Add to cart", removeFromCart: "Remove",
        notifSettings: "Notification Settings", notifPushEnable: "Enable Push Notifications",
        notifNewProducts: "New Products", notifSpecialPrices: "Special Prices & Promos",
        notifUpdates: "Site Updates", notifStatus: "Notification Status",
        notifBlocked: "Blocked by browser", notifGranted: "Authorized",
        notifRequest: "Authorize Now", notifSave: "Save Preferences",
        notifPreferencesSaved: "Notification preferences saved!",
        accountInfo: "Account Info", email: "Email", name: "Name", role: "Role", emailVerified: "Email Verified",
        yes: "Yes", no: "No", resendVerifyEmail: "Resend verification email",
        total: "Total", emptyCart: "Your cart is empty",
        securePayment: "Secure Payment", contactUs: "Contact Us",
        favorites: "Favorites", noFavorites: "No favorites yet",
        reviews: "Reviews", leaveReview: "Leave a review", addReview: "Add a review", noReviews: "No reviews yet",
        rating: "Rating", comment: "Comment", submit: "Submit", invalidAddress: "Invalid address",
        ratingError: "Choose a rating (stars)", commentError: "Write a comment", reviewSuccess: "Thank you for your review!", reviewError: "Error sending review",
        servicesIntro: "Total Lakay uses cutting-edge technology to give you the best experience:",
        servicesOnline: "AI-Powered Sales:",
        servicesOnlineDesc: "An intelligent assistant to help you find what you need and personalized recommendations.",
        servicesDelivery: "PWA & Offline Access:",
        servicesDeliveryDesc: "Fast access even without internet thanks to our PWA technology and real-time notifications.",
        servicesCustomer: "24/7 Support:",
        servicesCustomerDesc: "We are available via WhatsApp and our AI assistant to answer all your questions.",
        servicesSecure: "MonCash Payments:",
        servicesSecureDesc: "Fast and secure payments with the MonCash system directly on the platform.",
        privacyIntro: "At Total Lakay, we protect your data with AI technology:",
        privacyData: "Data Collection:",
        privacyDataDesc: "We only collect information necessary for your deliveries (name, address, phone).",
        privacySecurity: "AI Security:",
        privacySecurityDesc: "We use AI to detect fraud and ensure your transactions are secure.",
        privacySharing: "Privacy:",
        privacySharingDesc: "Your data is encrypted and never shared with third parties without your consent.",
        privacyRights: "Your Rights:",
        privacyRightsDesc: "You can delete or modify your information anytime in your profile.",
        termsIntro: "By using Total Lakay, you accept the following conditions:",
        termsAccount: "Account & Security:",
        termsAccountDesc: "You are responsible for your password security and all activities on your account.",
        termsPurchase: "AI-Verified Purchases:",
        termsPurchaseDesc: "Our AI system analyzes each order to prevent fraud. All purchases are final unless damaged.",
        termsPrice: "Price and Products:",
        termsPriceDesc: "Prices may change without notice. We strive for accurate descriptions.",
        termsMod: "Updates:",
        termsModDesc: "Total Lakay may modify these terms and we will notify you.",
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
        loginRequired: "Debes iniciar sesión para comprar", fillAllFields: "Completa todos los campos",
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
        footerRights: "Total Lakay © 2026", footerContact: "Contáctanos",
        footerServices: "Servicios", footerPrivacy: "Privacidad",
        footerTerms: "Condiciones de Uso",
        notifSent: "✅ ¡Notificación enviada!",
        roleChanged: "✅ ¡Rol cambiado!",
        madeAdmin: "✅ ¡Hecho admin!",
        madeClient: "✅ ¡Hecho cliente!",
        searchPlaceholder: "🔍 Buscar un producto...",
        aiAssistant: "Asistente IA",
        aiPageTitle: "Chat con IA",
        aiPageDesc: "Pregúntale a nuestro asistente inteligente cualquier cosa sobre la plataforma o nuestros productos.",
        aiWelcome: "¡Hola! ¿Cómo puedo ayudarte hoy?",
        aiInputPlaceholder: "Escribe tu mensaje...",
        aiError: "Tengo un pequeño problema de conexión. Inténtalo de nuevo.",
        aiTyping: "🤔 Analizando...",
        aiLoginRequiredDesc: "Debes iniciar sesión para chatear con nuestro asistente inteligente.",
        allCategories: "Todas categorías",
        priceMin: "Precio mín",
        priceMax: "Precio máx",
        applyFilters: "Filtrar",
        resetFilters: "Restablecer",
        sortDateDesc: "Más reciente",
        sortDateAsc: "Más antiguo",
        sortPriceAsc: "Precio: Bajo → Alto",
        sortPriceDesc: "Precio: Alto → Bajo",
        sortNameAsc: "Nombre: A → Z",
        sortNameDesc: "Nombre: Z → A",
        resultsFound: "resultados encontrados",
        noResultsFound: "Sin resultados. Prueba otras palabras.",
        categoryElectronics: "📱 Electrónica",
        categoryClothing: "👕 Ropa y Accesorios",
        categorySchool: "🎓 Escuela",
        categoryWork: "💼 Trabajo",
        categoryHome: "🏠 Hogar",
        categoryBeauty: "💄 Belleza",
        categoryOther: "📦 Otros",
        categoryClothingAccessories: "👕 Ropa y Accesorios",
        categorySchoolOffice: "🎓 Escuela y Trabajo",
        categoryHomePersonal: "🏠 Hogar y Personal",
        categoryElectronicsTech: "📱 Electrónica",
        balance: "Saldo",
        myBalance: "Tu saldo",
        refund: "Dinero Reembolsado",
        onlineClients: "Clientes en línea",
        moncashSettings: "Ajustes de MonCash (Pago Real)",
        saveConfig: "Guardar Configuración",
        linkMoncash: "Vincular tu cuenta MonCash",
        moncashPhone: "Tu número MonCash",
        moncashTerms: "Acepto los términos de uso y la política de privacidad de MonCash",
        connect: "Vincular",
        connected: "Vinculado con éxito",
        termsConsentTitle: "Términos de Uso",
        termsConsentDesc: "Para continuar usando Total Lakay, debe aceptar nuestros términos de uso y nuestra política de privacidad.",
        accept: "Aceptar", decline: "Rechazar",
        cancellationReason: "Razón de cancelación", reasonPlaceholder: "¿Por qué cancela este pedido?",
        reasonRequired: "Debe proporcionar una razón para la cancelación.",
        recentProducts: "Productos Recientes", categoriesTitle: "Categorías", exploreCategories: "Explora todas nuestras categorías",
        school: "Escuela", work: "Trabajo", home: "Hogar", electronics: "Electrónica", beauty: "Belleza", clothing: "Ropa",
        stock: "Cantidad en stock", category: "Categoría", colors: "Colores (separados por comas)", sizes: "Tallas (separadas por comas)",
        selectColor: "Seleccionar Color", selectSize: "Seleccionar Talla", quantity: "Cantidad", outOfStock: "Sin stock",
        servicesTitle: "Nuestros Servicios", privacyTitle: "Privacidad", termsTitle: "Condiciones",
        phoneRecommend: "Tu número de teléfono", addressRecommend: "Tu dirección completa", phoneRequired: "Teléfono requerido",
        cart: "Carrito", checkout: "Pagar ahora", securePaymentInfo: "Pago 100% seguro",
        profile: "Perfil", phone: "Teléfono", phonePlaceholder: "Ej: +509 1234 5678",
        updateProfile: "Actualizar perfil", profileUpdated: "¡Perfil actualizado con éxito!",
        phoneNumber: "Número de teléfono", saveProfile: "Guardar Perfil",
        addressRecommend: "Dirección (Recomendado)", phoneRecommend: "Teléfono (Recommandado)",
        total: "Total", emptyCart: "Tu carrito está vacío",
        securePayment: "Pago Seguro", contactUs: "Contáctenos",
        notifications: "Notificaciones", noNotifications: "No hay notificaciones",
        favorites: "Favoritos", noFavorites: "Aún no hay favoritos",
        reviews: "Reseñas", leaveReview: "Dejar una reseña", addReview: "Agregar una reseña", noReviews: "Aún no hay reseñas",
        rating: "Calificación", comment: "Comentario", submit: "Enviar", invalidAddress: "Dirección inválida",
        ratingError: "Elige una calificación (estrellas)", commentError: "Escribe un comentario", reviewSuccess: "¡Gracias por tu reseña!", reviewError: "Error enviando reseña",
        servicesIntro: "Total Lakay utiliza tecnología de vanguardia para ofrecerte la mejor experiencia:",
        servicesOnline: "Venta con IA:",
        servicesOnlineDesc: "Un asistente inteligente para ayudarte a encontrar lo que necesitas y recomendaciones personalizadas.",
        servicesDelivery: "Experiencia PWA:",
        servicesDeliveryDesc: "Acceso rápido incluso sin internet gracias a nuestra tecnología PWA y notificaciones en tiempo real.",
        servicesCustomer: "Soporte 24/7:",
        servicesCustomerDesc: "Estamos disponibles a través de WhatsApp y nuestro asistente de IA para responder todas tus preguntas.",
        servicesSecure: "Pagos MonCash:",
        servicesSecureDesc: "Pagos rápidos y seguros con el sistema MonCash directamente en la plataforma.",
        privacyIntro: "En Total Lakay, protegemos tus datos con tecnología de IA:",
        privacyData: "Recopilación de Datos:",
        privacyDataDesc: "Solo recopilamos información necesaria para tus entregas (nombre, dirección, teléfono).",
        privacySecurity: "Seguridad con IA:",
        privacySecurityDesc: "Utilizamos IA para detectar fraudes y garantizar que tus transacciones sean seguras.",
        privacySharing: "Privacidad:",
        privacySharingDesc: "Tus datos están cifrados y nunca se comparten con terceros sin tu consentimiento.",
        privacyRights: "Tus Derechos:",
        privacyRightsDesc: "Puedes eliminar o modificar tu información en cualquier momento en tu perfil.",
        termsIntro: "Al usar Total Lakay, aceptas las siguientes condiciones:",
        termsAccount: "Cuenta y Seguridad:",
        termsAccountDesc: "Eres responsable de la seguridad de tu contraseña y de todas las actividades en tu cuenta.",
        termsPurchase: "Compras Verificadas por IA:",
        termsPurchaseDesc: "Nuestro sistema de IA analiza cada pedido para evitar fraudes. Todas las compras son definitivas a menos que haya daños.",
        termsPrice: "Precios y Productos:",
        termsPriceDesc: "Los precios pueden cambiar sin previo aviso. Nos esforzamos por tener descripciones precisas.",
        termsMod: "Actualizaciones:",
        termsModDesc: "Total Lakay puede modificar estos términos y te notificaremos.",
        termsConsentTitle: "Condiciones de Uso",
        termsConsentDesc: "Para continuar usando Total Lakay, debe aceptar nuestros términos de uso y nuestra política de privacidad.",
        accept: "Aceptar", decline: "Rechazar",
    }
};

// ---------- CART FUNCTIONS ----------
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    cart.push(product);
    localStorage.setItem('totalLakayCart', JSON.stringify(cart));
    updateCartBadge();
    showMessage(t('addToCart') + ': ' + product.name);
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    if (cart.length > 0) {
        badge.textContent = cart.length;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function renderCart() {
    const list = document.getElementById('cartItemsList');
    const totalEl = document.getElementById('cartTotalAmount');
    if (!list || !totalEl) return;

    if (cart.length === 0) {
        list.innerHTML = `<p class="text-center" style="padding:2rem;">🛒 ${t('emptyCart')}</p>`;
        totalEl.textContent = formatPrice(0);
        return;
    }

    let total = 0;
    list.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
      <div class="cart-item" style="display:flex; align-items:center; gap:1rem; padding:0.8rem; border-bottom:1px solid #eee;">
        <img src="${item.image || 'logo.jpeg'}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;" loading="lazy" onerror="this.src='logo.jpeg'">
        <div style="flex:1;">
          <div style="font-weight:700; color:var(--blue-deep);">${item.name}</div>
          <div style="color:var(--gold); font-weight:600;">${formatPrice(item.price)}</div>
        </div>
        <button class="btn btn-danger btn-sm remove-cart-item" data-index="${index}">🗑️</button>
      </div>
    `;
    }).join('');
    totalEl.textContent = formatPrice(total);

    document.querySelectorAll('.remove-cart-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            removeFromCart(index);
        });
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('totalLakayCart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
}

function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
        showMessage('Retire nan favori');
    } else {
        favorites.push(productId);
        showMessage('Ajoute nan favori');
    }
    localStorage.setItem('totalLakayFavorites', JSON.stringify(favorites));
    if (currentView === 'shop' || currentView === 'home') renderView(currentView);
}

// ---------- NOTIFICATIONS FUNCTIONS ----------
function listenNotifications() {
    db.collection('notifications').orderBy('createdAt', 'desc').limit(20).onSnapshot(snap => {
        const allNotifs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        if (isAdmin) {
            notifications = allNotifs;
        } else {
            notifications = allNotifs.filter(n =>
                n.targetRole === 'all' ||
                !n.targetRole ||
                (n.targetUserId && n.targetUserId === currentUser.uid)
            );
        }

        updateNotifBadge();
    });
}

function updateNotifBadge() {
    const badge = document.getElementById('notifBadge');
    if (!badge) return;
    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function renderNotificationsModal() {
    const app = document.getElementById('appContent');
    if (!app) return;
    app.innerHTML = `
    <div class="card-premium">
      <h2>🔔 ${t('notifications')}</h2>
      ${notifications.length === 0 ? `<p class="text-center" style="padding:2rem;">📭 ${t('noNotifications')}</p>` : notifications.map(n => `
        <div class="card" style="margin-bottom:0.8rem; border-left:4px solid ${n.read ? '#ccc' : 'var(--gold)'}">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong>${n.title}</strong>
            ${!n.read ? `<button class="btn btn-sm btn-outline mark-read" data-id="${n.id}">👁️</button>` : ''}
          </div>
          <p>${n.message}</p>
        </div>`).join('')}
    </div>
  `;
    document.querySelectorAll('.mark-read').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            await db.collection('notifications').doc(id).update({ read: true });
            renderNotificationsModal();
        });
    });
}

function formatPrice(priceBase) {
    const rate = exchangeRates[currentCurrency] || 1;
    const converted = priceBase * rate;
    if (currentCurrency === 'USD') return `$${converted.toFixed(2)}`;
    if (currentCurrency === 'HTG') return `${Math.round(converted).toLocaleString()} G`;
    if (currentCurrency === 'EUR') return `${converted.toFixed(2)} €`;
    return `${converted.toFixed(2)} ${currentCurrency}`;
}

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
    background:${type === 'success' ? '#1e7e5b' : type === 'info' ? '#2980b9' : '#c0392b'};
    color:white; padding:1rem 1.5rem; border-radius:30px;
    font-weight:600; z-index:3000;
    box-shadow:0 20px 40px rgba(0,0,0,0.3);
  `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

// Translation Helpers
async function autoTranslate(text, targetLang) {
    if (!text) return "";
    const sourceLang = currentLang;
    if (sourceLang === targetLang) return text;
    try {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`);
        const data = await res.json();
        return data.responseData.translatedText || text;
    } catch (e) { return text; }
}

async function getTranslations(text) {
    if (!text) return "";
    const langs = ['ht', 'fr', 'en', 'es'];
    const results = {};
    await Promise.all(langs.map(async (l) => {
        results[l] = await autoTranslate(text, l);
    }));
    return results;
}

function gt(field) {
    if (!field) return "";
    if (typeof field === 'object') {
        return field[currentLang] || field['ht'] || field['en'] || Object.values(field)[0] || "";
    }
    return field;
}

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
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

                // Vérifier consentement
                if (!isAdmin && !userDoc.data().termsAccepted) {
                    document.getElementById('consentModal')?.classList.remove('hidden');
                }
            } else {
                userRole = 'client'; isAdmin = false;
                await db.collection('users').doc(user.uid).set({
                    email: user.email, displayName: user.displayName || '',
                    photoURL: user.photoURL || '', role: 'client',
                    emailVerified: true, termsAccepted: false, createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                document.getElementById('consentModal')?.classList.remove('hidden');
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

        if (logoutBtn) {
            logoutBtn.innerHTML = `🚪 <span>${(isAdmin ? 'Admin: ' : '') + t('logout')}</span>`;
        }
        listenNotifications();
    } else {
        if (authBtn) authBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        adminElements.forEach(el => el.classList.add('hidden'));
        userElements.forEach(el => el.classList.add('hidden'));
        isAdmin = false; userRole = null;
    }

    if (user) {
        updatePresence();
        setInterval(updatePresence, 2 * 60 * 1000); // Mettre à jour toutes les 2 minutes
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
                userCredential.user.sendEmailVerification().catch(() => { });
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
            await cred.user.updateProfile({ displayName: name });
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
// SIDE DRAWER (Menu latéral)
// ============================================
function toggleDrawer(open) {
    const drawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (!drawer || !overlay) return;

    if (open) {
        drawer.classList.add('open');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden'; // Empêcher le scroll
    } else {
        drawer.classList.remove('open');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
    }
}

document.getElementById('menuBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDrawer(true);
});

document.getElementById('closeDrawer')?.addEventListener('click', () => {
    toggleDrawer(false);
});

document.getElementById('drawerOverlay')?.addEventListener('click', () => {
    toggleDrawer(false);
});

// Navigation Menu Items
document.getElementById('navHome')?.addEventListener('click', (e) => {
    e.preventDefault(); toggleDrawer(false); setActiveNav('navHome');
    currentView = isAdmin ? 'admin' : 'home'; renderView(currentView);
});

document.getElementById('navShop')?.addEventListener('click', (e) => {
    e.preventDefault(); toggleDrawer(false); setActiveNav('navShop');
    currentView = 'shop'; renderView('shop');
});

document.getElementById('navAI')?.addEventListener('click', (e) => {
    e.preventDefault(); toggleDrawer(false); setActiveNav('navAI');
    currentView = 'aiPage'; renderView('aiPage');
});

document.getElementById('navProfile')?.addEventListener('click', (e) => {
    e.preventDefault(); toggleDrawer(false); setActiveNav('navProfile');
    currentView = 'profile'; renderView('profile');
});

document.getElementById('navAdmin')?.addEventListener('click', (e) => {
    e.preventDefault(); toggleDrawer(false); setActiveNav('navAdmin');
    currentView = 'admin'; renderView('admin');
});

document.getElementById('menuFavorites')?.addEventListener('click', (e) => {
    e.preventDefault(); toggleDrawer(false);
    currentView = 'favorites'; renderView('favorites');
});

document.getElementById('menuHistory')?.addEventListener('click', (e) => {
    e.preventDefault(); toggleDrawer(false);
    currentView = 'history'; renderView('history');
});

function renderFavorites(app) {
    const favProducts = products.filter(p => favorites.includes(p.id));
    app.innerHTML = `
    <div class="card-premium">
        <h2 style="display:flex; align-items:center; gap:0.5rem;">❤️ ${t('favorites')}</h2>
        <div class="grid">
          ${favProducts.length === 0 ? `<p class="text-center" style="grid-column:1/-1; padding:2rem;">${t('noFavorites')}</p>` : favProducts.map(p => productCardHTML(p)).join('')}
        </div>
    </div>`;
    attachBuyButtons();
}

// ============================================
// NOTIFICATIONS
// ============================================
async function loadNotifications() {
    if (!currentUser) { notifications = []; updateNotifBadge(); return; }
    try {
        const snap = await db.collection('notifications').orderBy('createdAt', 'desc').limit(20).get();
        const allNotifs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Filtre local selon le rôle
        if (isAdmin) {
            notifications = allNotifs;
        } else {
            notifications = allNotifs.filter(n =>
                n.targetRole === 'all' ||
                !n.targetRole ||
                (n.targetUserId && n.targetUserId === currentUser.uid)
            );
        }

        updateNotifBadge();
    } catch (e) { notifications = []; updateNotifBadge(); }
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
    <div class="notif-item ${n.read ? '' : 'unread'}" onclick="markNotifAsRead('${n.id}')" style="cursor:pointer; border-left:4px solid ${n.type === 'promo' ? 'var(--gold)' : 'var(--blue-light)'};">
      <div class="notif-title" style="display:flex; justify-content:space-between; align-items:center;">
        <span>${n.type === 'promo' ? '🎉' : n.type === 'refund' ? '💸' : '🔔'} ${gt(n.title)}</span>
        ${n.reason ? `<span class="badge" style="font-size:0.65rem; background:rgba(200, 150, 62, 0.1); color:var(--gold); border:1px solid var(--gold);">${gt(n.reason)}</span>` : ''}
      </div>
      <p style="margin:0.4rem 0; font-size:0.9rem;">${gt(n.message)}</p>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:var(--text-soft);">
        <div class="notif-date">${n.createdAt?.toDate?.()?.toLocaleDateString?.('fr-FR') || t('today')}</div>
        ${!n.read ? `<span style="color:var(--gold); font-weight:700;">● ${t('new')}</span>` : ''}
      </div>
    </div>`).join('');
}

async function markNotifAsRead(notifId) {
    try {
        await db.collection('notifications').doc(notifId).update({ read: true });
        // Update local state to avoid re-fetch immediately
        const notif = notifications.find(n => n.id === notifId);
        if (notif) {
            notif.read = true;
            updateNotifBadge();
            renderNotifList();
        }
    } catch (e) { console.error("Erreur lecture notif:", e); }
}

// ============================================
// LANGUE
// ============================================
document.getElementById('langSwitch')?.addEventListener('change', (e) => {
    currentLang = e.target.value;
    applyLanguage();
});
document.getElementById('langSwitchMobile')?.addEventListener('change', (e) => {
    currentLang = e.target.value;
    applyLanguage();
    document.getElementById('dropdownMenu')?.classList.add('hidden');
});

document.getElementById('currencySwitch')?.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    renderView(currentView);
});
document.getElementById('currencySwitchMobile')?.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    renderView(currentView);
    document.getElementById('dropdownMenu')?.classList.add('hidden');
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
document.getElementById('navProfile')?.addEventListener('click', (e) => {
    e.preventDefault(); setActiveNav('navProfile');
    currentView = 'profile'; renderView('profile');
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
document.getElementById('buyModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('buyModal')) document.getElementById('buyModal').classList.add('hidden');
});
document.getElementById('submitOrder')?.addEventListener('click', async () => {
    if (!currentUser) { showMessage(t('loginRequired'), 'error'); return; }
    if (!currentUser.emailVerified) { showMessage(t('emailNotVerified'), 'error'); return; }
    const address = document.getElementById('orderAddress')?.value.trim();
    const payment = document.getElementById('orderPayment')?.value;
    if (!address || address.length < 5) { showMessage(t('invalidAddress'), 'error'); return; }
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;
    const quantity = parseInt(document.getElementById('orderQuantity')?.value) || 1;
    const color = document.getElementById('orderColor')?.value || null;
    const size = document.getElementById('orderSize')?.value || null;

    try {
        const phone = document.getElementById('orderPhone')?.value.trim();
        if (!phone) { showMessage(t('phoneRequired') || "Telefòn obligatwa", 'error'); return; }

        if (payment === 'MonCash') {
            if (!moncashConfig.clientId || !moncashConfig.clientSecret) {
                showMessage('⚠️ Konfigirasyon MonCash manke nan Admin an!', 'error');
            } else {
                showMessage('💳 Inisyalize peman MonCash Reyèl...', 'info');
                console.log('Appel API MonCash avec ClientID:', moncashConfig.clientId);
            }
        }

        await db.collection('orders').add({
            userId: currentUser.uid, userEmail: currentUser.email,
            productId: product.id, productName: product.name,
            price: product.price, quantity, color, size,
            totalPrice: product.price * quantity,
            currency: currentCurrency, image: product.image || '',
            address, phone, payment, status: 'pending', deliveryEstimate: '',
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
let productsLoaded = false;
async function loadProducts(forceRefresh = false) {
    if (productsLoaded && !forceRefresh) return;
    try {
        const snap = await db.collection('products').orderBy('createdAt', 'desc').get();
        products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        productsLoaded = true;
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
        const snap = await db.collection('orders').where('userId', '==', currentUser.uid).get();
        orders = snap.docs.map(d => ({ id: d.id, ...d.data() }))
            .sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0));
    } catch (e) { orders = []; }
}
async function loadAllUsers() {
    try {
        const snap = await db.collection('users').get();
        allUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) { allUsers = []; }
}
async function loadAllData() {
    await Promise.all([loadProducts(true), loadAllOrders(), loadAllUsers()]);
}

// ============================================
// RECHERCHE & FILTRES
// ============================================
function getFilteredProducts() {
    let filtered = [...products];

    const searchTerm = document.getElementById('searchInput')?.value?.toLowerCase()?.trim() || '';
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const priceMin = parseFloat(document.getElementById('priceMin')?.value) || 0;
    const priceMax = parseFloat(document.getElementById('priceMax')?.value) || Infinity;
    const sortBy = document.getElementById('sortBy')?.value || 'date-desc';

    if (searchTerm) {
        filtered = filtered.filter(p =>
            p.name?.toLowerCase().includes(searchTerm) ||
            p.description?.toLowerCase().includes(searchTerm)
        );
    }

    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }

    filtered = filtered.filter(p => p.price >= priceMin && p.price <= priceMax);

    switch (sortBy) {
        case 'date-asc': filtered.sort((a, b) => (a.createdAt?.toDate?.() || 0) - (b.createdAt?.toDate?.() || 0)); break;
        case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
        case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
        case 'name-asc': filtered.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
        case 'name-desc': filtered.sort((a, b) => (b.name || '').localeCompare(a.name || '')); break;
        default: filtered.sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0)); break;
    }

    return filtered;
}

function displayFilteredProducts() {
    const filtered = getFilteredProducts();
    const resultsCount = document.getElementById('resultsCount');

    if (resultsCount) {
        if (filtered.length === 0) {
            resultsCount.innerHTML = `🔍 ${t('noResultsFound')}`;
        } else {
            resultsCount.innerHTML = `<span>${filtered.length}</span> ${t('resultsFound')}`;
        }
    }

    if (filtered.length === 0) {
        return `<p class="text-center" style="grid-column:1/-1; padding:3rem;">📭 ${t('noResultsFound')}</p>`;
    }

    return filtered.map(p => productCardHTML(p)).join('');
}

function setupSearchAndFilters() {
    const searchBar = document.getElementById('searchFilterBar');
    if (searchBar) searchBar.classList.remove('hidden');

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => refreshProductGrid(), 300));
    }

    document.getElementById('searchBtn')?.addEventListener('click', () => refreshProductGrid());

    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') refreshProductGrid();
    });

    document.getElementById('applyFiltersBtn')?.addEventListener('click', () => refreshProductGrid());

    document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {
        const si = document.getElementById('searchInput');
        const cf = document.getElementById('categoryFilter');
        const pmin = document.getElementById('priceMin');
        const pmax = document.getElementById('priceMax');
        const sb = document.getElementById('sortBy');
        if (si) si.value = '';
        if (cf) cf.value = 'all';
        if (pmin) pmin.value = '';
        if (pmax) pmax.value = '';
        if (sb) sb.value = 'date-desc';
        refreshProductGrid();
    });

    document.getElementById('categoryFilter')?.addEventListener('change', () => refreshProductGrid());
    document.getElementById('sortBy')?.addEventListener('change', () => refreshProductGrid());
    document.getElementById('priceMin')?.addEventListener('input', debounce(() => refreshProductGrid(), 500));
    document.getElementById('priceMax')?.addEventListener('input', debounce(() => refreshProductGrid(), 500));
}

function refreshProductGrid() {
    const grid = document.getElementById('allProducts') || document.getElementById('featuredProducts');
    if (grid) {
        grid.innerHTML = displayFilteredProducts();
        attachBuyButtons();
    }
}

// ============================================
// RENDU VUES
// ============================================
async function renderView(view) {
    currentView = view;
    const app = document.getElementById('appContent');
    if (!app) return;

    // Afficher/cacher la barre de recherche
    const searchBar = document.getElementById('searchFilterBar');
    if (searchBar) {
        if (view === 'shop' || view === 'specialOffers') {
            searchBar.classList.remove('hidden');
        } else {
            searchBar.classList.add('hidden');
        }
    }

    if (isAdmin && (view === 'home' || view === 'admin')) {
        await renderAdminDashboard(app);
    } else {
        switch (view) {
            case 'home': await renderHome(app); break;
            case 'shop': await renderShop(app); break;
            case 'aiPage': await renderAIPage(app); break;
            case 'orders': await renderProfile(app); break;
            case 'profile': await renderProfile(app); break;
            case 'specialOffers': await renderSpecialOffers(app); break;
            case 'favorites': renderFavorites(app); break;
            case 'settings': renderSettings(app); break;
            case 'history': await renderProfile(app); break;
            case 'services': renderServices(app); break;
            case 'privacy': renderPrivacy(app); break;
            case 'terms': renderTerms(app); break;
            default: await renderHome(app);
        }
    }
}
function productCardHTML(product) {
    const hasPromo = product.oldPrice && product.oldPrice > product.price;
    return `
    <div class="product-card" data-id="${product.id}">
      ${hasPromo ? `<div class="product-badge">🔥 ${t('specialPrice')}</div>` : ''}
      <button class="wishlist-btn ${favorites.includes(product.id) ? 'active' : ''}" onclick="toggleFavorite('${product.id}')">❤️</button>
      <img src="${product.image || 'logo.jpeg'}" alt="${gt(product.name)}" class="product-img" loading="lazy" onerror="this.src='logo.jpeg'">
      <div class="product-info">
        <div class="product-title">${gt(product.name)}</div>
        ${product.description ? `<div class="product-description">${gt(product.description).substring(0, 60)}...</div>` : ''}
        <div class="product-price">${formatPrice(product.price)} ${hasPromo ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}</div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-gold btn-sm add-cart-btn" data-product-id="${product.id}" style="flex:1;">${t('addToCart')}</button>
          <button class="btn btn-outline btn-sm buy-now-btn" data-product-id="${product.id}">⚡</button>
        </div>
      </div>
    </div>`;
}

// ============================================
// DASHBOARD ADMIN - VERSION PREMIUM
// ============================================
async function renderAdminDashboard(app) {
    if (!isAdmin) { app.innerHTML = `<div class="card text-center"><p>${t('adminOnly')}</p></div>`; return; }
    await loadMoncashConfig();
    await loadAllData();
    const onlineCount = await getOnlineUsersCount();

    const totalProducts = products.length;
    const totalOrders = orders.length;
    const confirmedCount = orders.filter(o => o.status === 'confirmed' || o.status === 'delivered').length;
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const cancelledCount = orders.filter(o => o.status === 'cancelled').length;
    const totalRevenue = orders.filter(o => o.status === 'confirmed' || o.status === 'delivered').reduce((sum, o) => sum + (o.price || 0), 0);

    app.innerHTML = `
    <div class="admin-dashboard-container">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:1rem;">
          <h2 style="margin:0;">Tableau de Bord Administrateur</h2>
          <div class="badge badge-success" style="padding:0.6rem 1.2rem; border-radius:30px; font-weight:700; background:rgba(30, 126, 91, 0.1); color:var(--success); border:1px solid var(--success);">Session Active</div>
        </div>

        <!-- Statistiques Clés -->
        <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:1.5rem; margin-bottom:3rem;">
          <div class="admin-stat-card" style="border-left-color: var(--gold);">
            <div class="admin-stat-val">${totalProducts}</div>
            <div class="admin-stat-label">Produits en Stock</div>
          </div>
          <div class="admin-stat-card" style="border-left-color: var(--success);">
            <div class="admin-stat-val">${totalOrders}</div>
            <div class="admin-stat-label">Commandes Totales</div>
          </div>
          <div class="admin-stat-card" style="border-left-color: #3498db; cursor:pointer;" id="onlineStatsCard">
            <div class="admin-stat-val">${onlineCount}</div>
            <div class="admin-stat-label">Clients en Ligne</div>
          </div>
          <div class="admin-stat-card" style="border-left-color: #f39c12;">
            <div class="admin-stat-val">${formatPrice(totalRevenue)}</div>
            <div class="admin-stat-label">Chiffre d'Affaire (G)</div>
          </div>
        </div>

        <!-- Analyses Graphiques -->
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap:2rem; margin-bottom:3rem;">
            <div class="chart-card">
                <div class="chart-title">Analyse des Commandes</div>
                <div style="height:300px;"><canvas id="ordersChart"></canvas></div>
            </div>
            <div class="chart-card">
                <div class="chart-title">Répartition par Catégorie</div>
                <div style="height:300px;"><canvas id="categoriesChart"></canvas></div>
            </div>
        </div>

        <!-- Actions Rapides -->
        <div class="card-premium" style="margin-bottom:3rem;">
          <h3 style="margin-bottom:1.5rem;">⚡ Actions de Gestion</h3>
          <div style="display:flex; gap:1rem; flex-wrap:wrap;">
            <button class="btn btn-gold" id="adminAddProductBtn">➕ Nouveau Produit</button>
            <button class="btn btn-outline" style="color:var(--blue-deep); border-color:var(--blue-deep);" id="adminManageOrdersBtn">📦 Gérer Commandes</button>
            <button class="btn btn-outline" style="color:var(--blue-deep); border-color:var(--blue-deep);" id="adminManageClientsBtn">👥 Liste Clients</button>
            <button class="btn btn-outline" style="color:var(--blue-deep); border-color:var(--blue-deep);" id="adminSendNotifBtn">🔔 Alerte Notif</button>
            <button id="adminMoncash" class="btn btn-outline" style="color:var(--blue-deep); border-color:var(--blue-deep);">💳 Config MonCash</button>
          </div>
        </div>

        <!-- Formulaire Ajout Produit -->
        <div id="adminAddProductForm" class="card hidden mt-2">
            <h3>➕ Ajouter un Nouveau Produit</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div><label>Nom du Produit</label><input id="adminProdName" placeholder="Ex: Sac à dos"></div>
                <div><label>Prix (G)</label><input id="adminProdPrice" type="number" placeholder="2500"></div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:0.8rem;">
                <div>
                    <label>Catégorie</label>
                    <select id="adminProdCategory">
                        <option value="clothing">Vêtements</option>
                        <option value="school">École</option>
                        <option value="home">Maison</option>
                        <option value="electronics">Électronique</option>
                        <option value="beauty">Beauté</option>
                        <option value="other">Autre</option>
                    </select>
                </div>
                <div><label>Quantité en Stock</label><input id="adminProdStock" type="number" value="10"></div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:0.8rem;">
                <div><label>Couleurs (séparez par virgule)</label><input id="adminProdColors" placeholder="Rouge, Bleu"></div>
                <div><label>Tailles (séparez par virgule)</label><input id="adminProdSizes" placeholder="S, M, L"></div>
            </div>
            <label>Lien de l'Image</label><input id="adminProdImage" placeholder="https://...">
            <label>Description</label><textarea id="adminProdDesc" rows="3" placeholder="Description détaillée..."></textarea>
            <button id="saveProductBtn" class="btn btn-gold mt-2" style="width:100%;">Enregistrer le Produit</button>
        </div>

        <!-- Liste des Produits -->
        <div class="card mt-2">
          <h3>📋 Produits Existants (${totalProducts})</h3>
          <div id="adminProductList" style="max-height:400px; overflow-y:auto; padding:1rem;">
            ${products.length === 0 ? `<p>Aucun produit en stock.</p>` : products.map(p => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; border-bottom:1px solid #eee; background:#fff; border-radius:12px; margin-bottom:0.5rem;">
                <div style="display:flex; align-items:center; gap:1rem;">
                  <img src="${p.image || 'logo.jpeg'}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;" onerror="this.src='logo.jpeg'">
                  <div>
                    <div style="font-weight:700;">${gt(p.name)}</div>
                    <div style="color:var(--gold); font-size:0.9rem;">${formatPrice(p.price)}</div>
                  </div>
                </div>
                <button class="btn btn-danger btn-sm delete-product" data-id="${p.id}">🗑️</button>
              </div>`).join('')}
          </div>
        </div>

        <!-- Liste des Commandes -->
        <div class="card mt-2">
          <h3>🕐 Dènières Commandes (${totalOrders})</h3>
          <div id="adminOrderList" style="max-height:500px; overflow-y:auto; padding:1rem;">
            ${orders.length === 0 ? `<p>Aucune commande récente.</p>` : orders.slice(0, 20).map(o => `
              <div style="padding:1.5rem; border:1px solid #eee; border-radius:15px; margin-bottom:1.5rem; background:#fff; box-shadow:0 5px 15px rgba(0,0,0,0.02);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
                  <strong style="font-size:1.1rem; color:var(--blue-deep);">${o.productName}</strong>
                  <select class="status-select" data-order-id="${o.id}" style="width:auto; padding:0.5rem; border-radius:10px; background:#f9f9f9; border:1px solid #ddd; margin:0;">
                    <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>⏳ En Attente</option>
                    <option value="confirmed" ${o.status === 'confirmed' ? 'selected' : ''}>✅ Confirmé</option>
                    <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>🚚 Livré</option>
                    <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>❌ Annulé</option>
                  </select>
                </div>
                <div style="font-size:0.95rem; color:var(--text-soft); margin-bottom:1rem; display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                  <div>💰 <strong>${formatPrice(o.price)}</strong> x${o.quantity || 1}</div>
                  <div>👤 ${o.userName || o.userEmail || 'Client'}</div>
                  <div>📍 ${o.address}</div>
                  <div>📞 ${o.phone || '---'}</div>
                </div>
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
                  <input id="delay-${o.id}" placeholder="Délai (ex: 2 jou)" value="${o.deliveryEstimate || ''}" style="margin:0; padding:0.6rem; flex:1; min-width:120px;">
                  <button class="btn btn-success btn-sm update-delay" data-id="${o.id}" style="border-radius:10px; padding:0.6rem 1rem;">⏱️ Délai</button>
                  <button class="btn btn-danger btn-sm refund-order-btn" data-id="${o.id}" data-user-id="${o.userId}" data-amount="${o.price}" style="border-radius:10px; padding:0.6rem 1rem;">💸 Rembourser</button>
                </div>
              </div>`).join('')}
          </div>
        </div>

        <!-- Liste des Clients -->
        <div id="adminClientsList" class="card mt-2 hidden">
          <h3>👥 Gestion des Utilisateurs (${allUsers.length})</h3>
          <div style="max-height:400px; overflow-y:auto; padding:1rem;">
            ${allUsers.map(u => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; border-bottom:1px solid #eee; background:#fff; border-radius:12px; margin-bottom:0.5rem;">
                <div>
                  <div style="font-weight:700;">${u.displayName || u.email}</div>
                  <div style="font-size:0.85rem; color:var(--text-soft);">${u.email}</div>
                  <span class="badge ${u.role === 'admin' ? 'badge-success' : ''}" style="font-size:0.75rem;">${u.role}</span>
                </div>
                <button class="btn btn-sm ${u.role === 'admin' ? 'btn-danger' : 'btn-gold'} toggle-role" data-uid="${u.id}" data-role="${u.role}" style="border-radius:20px;">
                  ${u.role === 'admin' ? 'Rétrograder' : 'Promouvoir Admin'}
                </button>
              </div>`).join('')}
          </div>
        </div>

        <!-- Formulaire Notification -->
        <div id="adminSendNotifForm" class="card mt-2 hidden">
            <h3>🔔 Envoyer une Notification Push</h3>
            <label>Cible</label>
            <select id="notifTarget" style="margin-bottom:1rem;">
                <option value="all">📢 Tous les utilisateurs</option>
                ${allUsers.map(u => `<option value="${u.id}">${u.displayName || u.email}</option>`).join('')}
            </select>
            <label>Titre</label><input id="notifTitle" placeholder="Ex: Nouvelle Promotion !">
            <label>Sujet / Motif</label><input id="notifReason" placeholder="Promo, Livraison, Update">
            <label>Message</label><textarea id="notifMessage" rows="3" placeholder="Contenu de la notification..."></textarea>
            <button id="sendNotifBtn" class="btn btn-gold mt-2" style="width:100%;">Voyer la Notification</button>
        </div>

        <!-- Config MonCash -->
        <div id="adminMoncashForm" class="card hidden mt-2">
          <h3>💳 Configuration MonCash</h3>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
            <div><label>Client ID</label><input id="mcClientId" value="${moncashConfig.clientId || ''}"></div>
            <div><label>Client Secret</label><input id="mcClientSecret" type="password" value="${moncashConfig.clientSecret || ''}"></div>
          </div>
          <label>Mode de Paiement</label>
          <select id="mcMode">
            <option value="sandbox" ${moncashConfig.mode === 'sandbox' ? 'selected' : ''}>SandBox (Test)</option>
            <option value="live" ${moncashConfig.mode === 'live' ? 'selected' : ''}>Live (Réel)</option>
          </select>
          <button id="saveMcConfig" class="btn btn-blue mt-2" style="width:100%;">Sauvegarder Configuration</button>
        </div>
    </div>`;

    // --- Initialisation des Graphiques ---
    setTimeout(() => {
        initCharts(confirmedCount, pendingCount, cancelledCount);
    }, 200);

    // --- Attachement des Événements ---

    // Toggle Forms
    document.getElementById('adminAddProductBtn')?.addEventListener('click', () => {
        document.getElementById('adminAddProductForm').classList.toggle('hidden');
        document.getElementById('adminClientsList').classList.add('hidden');
        document.getElementById('adminSendNotifForm').classList.add('hidden');
        document.getElementById('adminMoncashForm').classList.add('hidden');
    });

    document.getElementById('adminManageClientsBtn')?.addEventListener('click', () => {
        document.getElementById('adminClientsList').classList.toggle('hidden');
        document.getElementById('adminAddProductForm').classList.add('hidden');
        document.getElementById('adminSendNotifForm').classList.add('hidden');
        document.getElementById('adminMoncashForm').classList.add('hidden');
    });

    document.getElementById('adminSendNotifBtn')?.addEventListener('click', () => {
        document.getElementById('adminSendNotifForm').classList.toggle('hidden');
        document.getElementById('adminAddProductForm').classList.add('hidden');
        document.getElementById('adminClientsList').classList.add('hidden');
        document.getElementById('adminMoncashForm').classList.add('hidden');
    });

    document.getElementById('adminMoncash')?.addEventListener('click', () => {
        document.getElementById('adminMoncashForm').classList.toggle('hidden');
        document.getElementById('adminAddProductForm').classList.add('hidden');
        document.getElementById('adminClientsList').classList.add('hidden');
        document.getElementById('adminSendNotifForm').classList.add('hidden');
    });

    document.getElementById('adminManageOrdersBtn')?.addEventListener('click', () => {
        document.getElementById('adminOrderList').scrollIntoView({ behavior: 'smooth' });
    });

    // Save Product
    document.getElementById('saveProductBtn')?.addEventListener('click', async () => {
        const name = document.getElementById('adminProdName')?.value.trim();
        const price = parseFloat(document.getElementById('adminProdPrice')?.value);
        const category = document.getElementById('adminProdCategory')?.value;
        const stock = parseInt(document.getElementById('adminProdStock')?.value) || 0;
        const colors = document.getElementById('adminProdColors')?.value.split(',').map(c => c.trim()).filter(Boolean);
        const sizes = document.getElementById('adminProdSizes')?.value.split(',').map(s => s.trim()).filter(Boolean);
        const image = document.getElementById('adminProdImage')?.value.trim();
        const description = document.getElementById('adminProdDesc')?.value.trim();

        if (!name || !price) { showMessage(t('fillAllFields'), 'error'); return; }

        try {
            showMessage("Traduction en cours...", "info");
            const [nameTrans, descTrans] = await Promise.all([
                getTranslations(name),
                getTranslations(description)
            ]);

            await db.collection('products').add({
                name: nameTrans, price, category, stock, colors, sizes,
                image: image || 'logo.jpeg',
                description: descTrans,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            showMessage("Produit ajouté avec succès!", 'success');
            renderView('admin');
        } catch (error) { showMessage("Erreur: " + error.message, 'error'); }
    });

    // Delete Product
    document.querySelectorAll('.delete-product').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
                await db.collection('products').doc(e.currentTarget.dataset.id).delete();
                showMessage("Produit supprimé", 'success');
                renderView('admin');
            }
        });
    });

    // Update Status
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const orderId = e.target.dataset.orderId;
            const newStatus = e.target.value;
            await db.collection('orders').doc(orderId).update({ status: newStatus });
            showMessage("Statut mis à jour", 'success');
        });
    });

    // Update Delay
    document.querySelectorAll('.update-delay').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const orderId = e.currentTarget.dataset.id;
            const delay = document.getElementById(`delay-${orderId}`).value.trim();
            if (!delay) return;
            await db.collection('orders').doc(orderId).update({ deliveryEstimate: delay });
            showMessage("Délai mis à jour", 'success');
        });
    });

    // Toggle Role
    document.querySelectorAll('.toggle-role').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const uid = e.currentTarget.dataset.uid;
            const currentRole = e.currentTarget.dataset.role;
            const newRole = currentRole === 'admin' ? 'client' : 'admin';
            await db.collection('users').doc(uid).update({ role: newRole });
            showMessage("Rôle utilisateur modifié", 'success');
            renderView('admin');
        });
    });

    // Send Notification
    document.getElementById('sendNotifBtn')?.addEventListener('click', async () => {
        const target = document.getElementById('notifTarget').value;
        const title = document.getElementById('notifTitle').value.trim();
        const reason = document.getElementById('notifReason').value.trim();
        const message = document.getElementById('notifMessage').value.trim();

        if (!title || !message) { showMessage("Titre et message requis", 'error'); return; }

        try {
            showMessage("Voye notifikasyon...", "info");
            const [tTitle, tReason, tMessage] = await Promise.all([
                getTranslations(title), getTranslations(reason), getTranslations(message)
            ]);

            await db.collection('notifications').add({
                title: tTitle, reason: tReason, message: tMessage,
                targetUserId: target === 'all' ? null : target,
                targetRole: target === 'all' ? 'all' : null,
                read: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            showMessage("Notification envoyée!", 'success');
            document.getElementById('adminSendNotifForm').classList.add('hidden');
        } catch (e) { showMessage("Erreur: " + e.message, 'error'); }
    });

    // Save Mc Config
    document.getElementById('saveMcConfig')?.addEventListener('click', async () => {
        const clientId = document.getElementById('mcClientId').value.trim();
        const clientSecret = document.getElementById('mcClientSecret').value.trim();
        const mode = document.getElementById('mcMode').value;
        await db.collection('settings').doc('moncash').set({ clientId, clientSecret, mode });
        showMessage("Configuration MonCash enregistrée", 'success');
    });

    // Refund
    document.querySelectorAll('.refund-order-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const orderId = e.currentTarget.dataset.id;
            const userId = e.currentTarget.dataset.userId;
            const amount = parseFloat(e.currentTarget.dataset.amount);
            if (confirm(`Rembourser ${amount} G à ce client ?`)) {
                await refundUser(userId, amount, orderId);
                renderView('admin');
            }
        });
    });

    // Presence
    document.getElementById('onlineStatsCard')?.addEventListener('click', () => {
        document.getElementById('presenceModal')?.classList.remove('hidden');
        renderPresenceList();
    });

    setTimeout(() => {
        initCharts(confirmedCount, pendingCount, cancelledCount);
    }, 200);
}


function initCharts(confirmed, pending, cancelled) {
    const ordersCtx = document.getElementById('ordersChart')?.getContext('2d');
    if (ordersCtx) {
        new Chart(ordersCtx, {
            type: 'doughnut',
            data: {
                labels: ['Confirmées', 'En Attente', 'Annulées'],
                datasets: [{
                    data: [confirmed, pending, cancelled],
                    backgroundColor: ['#1e7e5b', '#f39c12', '#c0392b'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
                }
            }
        });
    }

    const categoriesCtx = document.getElementById('categoriesChart')?.getContext('2d');
    if (categoriesCtx) {
        const catMap = {};
        products.forEach(p => {
            const cat = p.category || 'Autres';
            catMap[cat] = (catMap[cat] || 0) + 1;
        });

        new Chart(categoriesCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(catMap),
                datasets: [{
                    label: 'Nombre de Produits',
                    data: Object.values(catMap),
                    backgroundColor: 'rgba(200, 150, 62, 0.7)',
                    borderColor: 'rgba(200, 150, 62, 1)',
                    borderWidth: 1,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { display: false } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
}

// ---------- NEW ADMIN FUNCTIONS ----------
async function loadMoncashConfig() {
    try {
        const doc = await db.collection('settings').doc('moncash').get();
        if (doc.exists) moncashConfig = doc.data();
    } catch (e) { console.error('Erreur config MonCash:', e); }
}

async function refundUser(userId, amount, orderId) {
    try {
        const userRef = db.collection('users').doc(userId);
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) throw "Kliyan sa a pa egziste!";
            const currentBalance = userDoc.data().balance || 0;
            transaction.update(userRef, { balance: currentBalance + amount, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
            transaction.set(db.collection('notifications').doc(), {
                targetUserId: userId, title: t('refund'),
                message: `Nou remèt ou ${formatPrice(amount)} pou kòmand #${orderId.substring(0, 6)} ki anile a.`,
                type: 'refund', read: false, createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
        showMessage('✅ Lajan an remèt kliyan an!', 'success');
    } catch (e) { showMessage('Erreur remboursement: ' + e, 'error'); }
}

async function updatePresence() {
    if (!currentUser) return;
    try {
        await db.collection('users').doc(currentUser.uid).update({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            online: true
        });
    } catch (e) { console.error("Presence error:", e); }
}

async function getOnlineUsersCount() {
    try {
        const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
        const snap = await db.collection('users').where('lastSeen', '>=', fiveMinsAgo).get();
        return snap.size;
    } catch (e) { return 0; }
}

async function renderPresenceList() {
    const list = document.getElementById('presenceList');
    if (!list) return;
    list.innerHTML = `<p class="text-center" style="padding:2rem;">⏳ ${t('loading')}</p>`;
    try {
        const snap = await db.collection('users').orderBy('lastSeen', 'desc').limit(50).get();
        const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);

        list.innerHTML = users.map(u => {
            const isOnline = u.lastSeen?.toDate?.() >= fiveMinsAgo;
            return `
            <div class="user-presence-item">
                <div style="display:flex; align-items:center;">
                    <span class="presence-status-dot ${isOnline ? 'status-online' : 'status-offline'}"></span>
                    <div>
                        <div style="font-weight:700; color:var(--blue-deep);">${u.displayName || u.email}</div>
                        <div style="font-size:0.75rem; color:var(--text-soft);">${u.role}</div>
                    </div>
                </div>
                <div style="font-size:0.7rem; color:var(--text-soft);">
                    ${u.lastSeen?.toDate?.()?.toLocaleTimeString() || '---'}
                </div>
            </div>`;
        }).join('');
    } catch (e) { list.innerHTML = `<p class="text-center">${t('errorOccurred')}</p>`; }
}

// ---------- SCROLL LISTENER FOR NAVBAR ----------
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    const searchBar = document.getElementById('searchFilterBar');
    if (!nav) return;

    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
        // Cacher la barre de recherche au défilement pour libérer de l'espace
        if (searchBar && !searchBar.classList.contains('hidden') && window.scrollY > 300) {
            searchBar.classList.add('hidden');
        }
    } else {
        nav.classList.remove('scrolled');
    }
});

// ============================================
// PAGES CLIENT
// ============================================
async function renderHome(app) {
    app.innerHTML = `
    <div class="card text-center">
      <h1 style="color:var(--blue-deep);">🏠 ${t('welcome')}</h1>
      <p style="font-size:1.2rem;">${t('slogan')}</p>
      <div id="homePromo"></div>
      <button class="btn btn-gold mt-2" id="goShopBtn">🛒 ${t('goShop')}</button>
    </div>

    <!-- CATEGORIES QUICK ACCESS -->
    <div class="category-section">
      <h2 style="margin-bottom:0.5rem;">📁 ${t('categoriesTitle')}</h2>
      <p style="color:var(--text-soft); font-size:0.9rem;">${t('exploreCategories')}</p>
      <div class="category-grid">
        <div class="category-card" onclick="filterByCategory('school')">
          <span class="category-icon">🎓</span>
          <span class="category-name">${t('school')}</span>
        </div>
        <div class="category-card" onclick="filterByCategory('home')">
          <span class="category-icon">🏠</span>
          <span class="category-name">${t('home')}</span>
        </div>
        <div class="category-card" onclick="filterByCategory('clothing')">
          <span class="category-icon">👕</span>
          <span class="category-name">${t('clothing')}</span>
        </div>
        <div class="category-card" onclick="filterByCategory('electronics')">
          <span class="category-icon">📱</span>
          <span class="category-name">${t('electronics')}</span>
        </div>
      </div>
    </div>

    <div class="recent-section">
      <h2>🆕 ${t('recentProducts')}</h2>
      <div class="grid" id="featuredProducts">
        ${Array(4).fill(0).map(() => `<div class="product-card skeleton"><div class="skeleton-img"></div><div class="product-info"><div class="skeleton-text"></div><div class="skeleton-text" style="width:60%;"></div></div></div>`).join('')}
      </div>
    </div>
    
    <!-- AI RECOMMENDATIONS SECTION -->
    <div id="aiRecommendations" class="ai-section container"></div>
    `;

    await loadProducts();
    const grid = document.getElementById('featuredProducts');
    if (grid) {
        grid.innerHTML = products.length === 0 ? `<p>📦 ${t('noProducts')}</p>` : products.slice(0, 4).map(p => productCardHTML(p)).join('');
    }

    document.getElementById('goShopBtn')?.addEventListener('click', () => { currentView = 'shop'; renderView('shop'); });
    attachBuyButtons();
}

function filterByCategory(cat) {
    currentView = 'shop';
    renderView('shop').then(() => {
        const filter = document.getElementById('categoryFilter');
        if (filter) {
            filter.value = cat;
            refreshProductGrid();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

async function renderShop(app) {
    app.innerHTML = `
    <h2>🛍️ ${t('shop')}</h2>
    <div class="grid" id="allProducts">
      ${Array(8).fill(0).map(() => `
        <div class="product-card skeleton">
          <div class="skeleton-img"></div>
          <div class="product-info">
            <div class="skeleton-text"></div>
            <div class="skeleton-text" style="width:60%;"></div>
          </div>
        </div>`).join('')}
    </div>`;

    await loadProducts();
    const grid = document.getElementById('allProducts');
    if (grid) {
        grid.innerHTML = displayFilteredProducts();
    }
    attachBuyButtons();
    setupSearchAndFilters();
}

async function renderAIPage(app) {
    if (!currentUser) {
        app.innerHTML = `
            <div class="card text-center" style="padding: 3rem; animation: viewFadeIn 0.3s ease;">
                <h2 style="color:var(--blue-deep);">🔐 ${t('loginRequired')}</h2>
                <p style="margin: 1.5rem 0; color: var(--text-soft);">${t('aiLoginRequiredDesc') || 'Ou dwe konekte pou w ka pale ak asistan entèlijan nou an.'}</p>
                <button class="btn btn-gold" id="loginFromAI">🔐 ${t('login')}</button>
            </div>
        `;
        document.getElementById('loginFromAI')?.addEventListener('click', () => document.getElementById('authBtn')?.click());
        return;
    }

    app.innerHTML = `
        <div class="card-premium" style="max-width: 900px; margin: 0 auto; animation: viewFadeIn 0.4s ease; padding: 2rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h2 style="display:flex; align-items:center; gap:0.8rem; color:var(--blue-deep); margin:0;">🤖 ${t('aiAssistant')}</h2>
                    <p style="color:var(--text-soft); margin: 0.5rem 0 0 0;">${t('aiPageDesc')}</p>
                </div>
                <div style="background: var(--gold-pale); padding: 0.5rem 1rem; border-radius: 20px; color: var(--blue-deep); font-weight: 600; font-size: 0.85rem;">
                    ✨ Total Lakay Intelligence
                </div>
            </div>
            
            <div class="ai-chat-interface" style="height: 550px; display: flex; flex-direction: column; background: var(--white); border-radius: 16px; border: 1px solid var(--gray-200); box-shadow: var(--shadow-md); overflow:hidden; position: relative;">
                <div class="chatbot-messages" id="aiPageMessages" style="flex: 1; padding: 1.5rem; overflow-y:auto; background: linear-gradient(to bottom, #fdfdfd, #ffffff); display: flex; flex-direction: column; gap: 1rem;">
                    <div class="message bot" style="background: var(--gray-100); align-self: flex-start; border-radius: 16px 16px 16px 4px; padding: 1rem; max-width: 80%; line-height: 1.5;">
                        👋 ${t('aiWelcome')}
                    </div>
                </div>
                
                <div style="padding: 1.2rem; background: white; border-top: 1px solid var(--gray-100);">
                    <div class="chatbot-input" style="display: flex; gap: 0.8rem; background: #f8f9fa; padding: 0.5rem; border-radius: 30px; border: 2px solid var(--gray-100); transition: border-color 0.3s ease;">
                        <input type="text" id="aiPageInput" placeholder="${t('aiInputPlaceholder')}" style="flex:1; border:none; background:transparent; padding: 0.8rem 1.2rem; outline:none; font-size: 1rem; margin:0 !important;">
                        <button id="sendAiPageMsg" style="background: var(--gold); color: var(--blue-deep); width: 48px; height: 48px; border-radius: 50%; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size: 1.2rem; transition: transform 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 4px 10px rgba(200,150,62,0.3);">
                            📤
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const input = document.getElementById('aiPageInput');
    const btn = document.getElementById('sendAiPageMsg');

    input.focus();

    btn.addEventListener('click', () => sendAIPageMessage());
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendAIPageMessage();
    });
}

async function sendAIPageMessage() {
    const input = document.getElementById('aiPageInput');
    const messages = document.getElementById('aiPageMessages');
    if (!input || !messages) return;

    const question = input.value.trim();
    if (!question) return;

    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.style = 'background: var(--gold); color: var(--blue-deep); align-self: flex-end; border-radius: 16px 16px 4px 16px; padding: 1rem; max-width: 80%; line-height: 1.5; font-weight: 500; animation: slideUp 0.3s ease-out;';
    userMsg.textContent = question;
    messages.appendChild(userMsg);

    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    // Bot typing
    const typingEl = document.createElement('div');
    typingEl.className = 'message bot typing';
    typingEl.style = 'background: #f0f0f0; color: #888; align-self: flex-start; border-radius: 16px 16px 16px 4px; padding: 0.8rem 1.2rem; font-style: italic; animation: fadeIn 0.3s ease;';
    typingEl.textContent = t('aiTyping');
    messages.appendChild(typingEl);
    messages.scrollTop = messages.scrollHeight;

    try {
        const answer = await askAIAssistant(question);
        if (typingEl) typingEl.remove();

        const botMsg = document.createElement('div');
        botMsg.className = 'message bot';
        botMsg.style = 'background: var(--gray-100); color: var(--blue-deep); align-self: flex-start; border-radius: 16px 16px 16px 4px; padding: 1rem; max-width: 85%; line-height: 1.5; animation: fadeIn 0.4s ease; border-left: 4px solid var(--gold);';
        botMsg.textContent = answer;
        messages.appendChild(botMsg);
    } catch (err) {
        if (typingEl) typingEl.remove();
        const botMsg = document.createElement('div');
        botMsg.className = 'message bot';
        botMsg.style = 'background: #fee; color: #c00; align-self: flex-start; border-radius: 12px; padding: 1rem;';
        botMsg.textContent = t('aiError');
        messages.appendChild(botMsg);
    }

    messages.scrollTop = messages.scrollHeight;
}

async function renderSpecialOffers(app) {
    await loadProducts();
    app.innerHTML = `<h2>🎉 ${t('specialOffers')}</h2><div class="grid" id="allProducts">${displayFilteredProducts()}</div>`;
    attachBuyButtons();
    setupSearchAndFilters();
}

async function renderProfile(app) {
    if (!currentUser) {
        app.innerHTML = `<div class="card text-center"><p>🔐 ${t('loginRequired')}</p><button class="btn btn-gold" id="loginFromOrders">${t('login')}</button></div>`;
        document.getElementById('loginFromOrders')?.addEventListener('click', () => document.getElementById('authBtn')?.click());
        return;
    }

    let userAddress = '';
    let userPhone = '';
    let currentUserData = {};
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            currentUserData = userDoc.data();
            userAddress = currentUserData.address || '';
            userPhone = currentUserData.phone || '';
        }
    } catch (e) { console.error("Erreur profil:", e); }

    await loadMyOrders();

    const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.price || 0), 0);
    const totalOrders = orders.length;
    const initials = (currentUser.displayName || currentUser.email || 'U').substring(0, 2).toUpperCase();

    app.innerHTML = `
    <div class="profile-layout">
      <!-- SIDEBAR -->
      <div class="profile-sidebar">
        <div class="avatar-container">
          <div class="avatar" id="profileAvatar" style="cursor:pointer; position:relative;" title="${t('changePhoto')}">
            ${currentUser.photoURL ? `<img src="${currentUser.photoURL}" id="avatarImg">` : `<span id="avatarInitials">${initials}</span>`}
            <div style="position:absolute; bottom:0; right:0; background:var(--gold); color:white; width:25px; height:25px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; border:2px solid var(--white);">📷</div>
          </div>
          <input type="file" id="profPhotoInput" accept="image/*" style="display:none;">
          <h3 style="color:var(--blue-deep); font-size:1.1rem; margin-bottom:0.2rem;">${currentUser.displayName || t('clientLabel')}</h3>
          <p style="font-size:0.8rem; color:var(--text-soft); word-break:break-all;">${currentUser.email}</p>
        </div>
        <nav>
          <button class="tab-btn active" data-target="tab-overview">📊 Aperçu</button>
          <button class="tab-btn" data-target="tab-info">👤 ${t('profile')}</button>
          <button class="tab-btn" data-target="tab-orders">📦 ${t('myOrders')}</button>
          <button class="tab-btn" data-target="tab-security">🔒 Sécurité</button>
        </nav>
      </div>

      <!-- CONTENT -->
      <div class="profile-content">
        
        <!-- TAB: OVERVIEW -->
        <div id="tab-overview" class="profile-tab-content active">
          <h2 style="color:var(--blue-deep); margin-bottom:1.5rem;">📊 Aperçu du Compte</h2>
          <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap:1.5rem; margin-bottom:2rem;">
            <div class="profile-stat-box" style="background:var(--blue-deep); color:white;">
              <div class="profile-stat-val" style="color:var(--gold);">${formatPrice(currentUserData?.balance || 0)}</div>
              <div style="font-size:0.9rem; opacity:0.8; font-weight:600;">${t('myBalance')}</div>
              <div style="font-size:0.7rem; margin-top:0.5rem; opacity:0.7;">
                ${currentUserData?.moncashPhone ? `🔗 Linked: ${currentUserData.moncashPhone}` : `❌ Not Linked to MonCash`}
              </div>
            </div>
            <div class="profile-stat-box">
              <div class="profile-stat-val">${totalOrders}</div>
              <div style="font-size:0.9rem; color:var(--text-soft); font-weight:600;">Commandes</div>
            </div>
            <div class="profile-stat-box">
              <div class="profile-stat-val">${formatPrice(totalSpent)}</div>
              <div style="font-size:0.9rem; color:var(--text-soft); font-weight:600;">Total Dépensé</div>
            </div>
          </div>
          ${orders.length > 0 ? `
            <h3 style="margin-bottom:1rem; font-size:1.1rem;">Dernière commande</h3>
            <div class="card" style="margin-bottom:0; padding:1.2rem; border-color:var(--gold-pale);">
              <div style="display:flex; justify-content:space-between; flex-wrap:wrap; margin-bottom:0.5rem;">
                <strong style="color:var(--blue-deep); font-size:1.05rem;">${orders[0].productName}</strong>
                <span class="badge ${orders[0].status === 'confirmed' || orders[0].status === 'delivered' ? 'badge-success' : 'badge-pending'}">${t(orders[0].status)}</span>
              </div>
              <p style="font-size:0.9rem; color:var(--text-soft);">💰 <strong>${formatPrice(orders[0].price)}</strong> | 📍 ${orders[0].address}</p>
              ${orders[0].deliveryEstimate ? `<div style="margin-top:0.5rem; font-size:0.85rem; font-weight:600; color:var(--success);">🚚 ${t('delivery')}: ${orders[0].deliveryEstimate}</div>` : `<div style="margin-top:0.5rem; font-size:0.85rem; color:#f39c12;">⏳ ${t('waiting')}</div>`}
            </div>
          ` : `<p class="text-center" style="padding:2rem; background:var(--gray-100); border-radius:12px; color:var(--text-soft);">Vous n'avez pas encore passé de commande.</p>`}
          
          <div class="card-premium mt-2" style="background:rgba(200, 150, 62, 0.03); border:1px solid var(--gold-pale);">
            <h3 style="color:var(--blue-deep); margin-bottom:1rem;">💳 ${t('linkMoncash')}</h3>
            <div style="margin-bottom:1rem;">
                <label>${t('moncashPhone')}</label>
                <input type="text" id="userMoncashPhone" value="${currentUserData?.moncashPhone || ''}" placeholder="+509 3XXX XXXX" style="background:white;">
            </div>
            <div style="display:flex; align-items:flex-start; gap:0.8rem; margin-bottom:1.5rem; background:white; padding:1rem; border-radius:12px; border:1px solid #eee;">
                <input type="checkbox" id="userMoncashConsent" ${currentUserData?.moncashConsent ? 'checked' : ''} style="width:22px; height:22px; margin:0; cursor:pointer; flex-shrink:0;">
                <label for="userMoncashConsent" style="margin:0; font-weight:400; font-size:0.85rem; cursor:pointer; line-height:1.4;">${t('moncashTerms')}</label>
            </div>
            <button id="linkMoncashBtn" class="btn btn-gold" style="width:100%;">${currentUserData?.moncashPhone ? t('save') : t('connect')}</button>
            ${currentUserData?.moncashPhone ? `<p style="color:var(--success); font-size:0.8rem; margin-top:0.8rem; text-align:center; font-weight:600;">✅ ${t('connected')}</p>` : ''}
          </div>
        </div>

        <!-- TAB: INFO -->
        <div id="tab-info" class="profile-tab-content">
          <h2 style="color:var(--blue-deep); margin-bottom:1.5rem;">👤 ${t('profile')}</h2>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
            <div>
              <label>👤 ${t('name')}</label>
              <input type="text" id="profName" value="${currentUser.displayName || ''}" placeholder="${t('namePlaceholder')}">
            </div>
            <div>
              <label>📧 ${t('email')}</label>
              <input type="text" value="${currentUser.email}" disabled style="background:#eee; cursor:not-allowed;">
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
            <div>
              <label>📍 ${t('addressRecommend')}</label>
              <input type="text" id="profAddress" value="${userAddress}" placeholder="${t('addressPlaceholder')}">
            </div>
            <div>
              <label>📞 ${t('phoneRecommend')}</label>
              <input type="text" id="profPhone" value="${userPhone}" placeholder="${t('phonePlaceholder')}">
            </div>
          </div>
          <button id="saveProfileBtn" class="btn btn-gold" style="width:100%;">💾 ${t('saveProfile')}</button>
        </div>

        <!-- TAB: ORDERS -->
        <div id="tab-orders" class="profile-tab-content">
          <h2 style="color:var(--blue-deep); margin-bottom:1.5rem;">📦 ${t('myOrders')}</h2>
          <div style="max-height:500px; overflow-y:auto; padding-right:0.5rem;">
          ${orders.length === 0 ? `<p class="text-center" style="padding:2rem; background:var(--gray-100); border-radius:12px; color:var(--text-soft);">📭 ${t('noOrders')}</p>` : orders.map(o => `
            <div class="card" style="margin-bottom:0.8rem; padding:1.2rem; border-left:4px solid var(--gold);">
              <div style="display:flex; justify-content:space-between; flex-wrap:wrap; margin-bottom:0.5rem;">
                <strong style="font-size:1.05rem; color:var(--blue-deep);">${o.productName}</strong>
                <span class="badge ${o.status === 'confirmed' || o.status === 'delivered' ? 'badge-success' : 'badge-pending'}">${t(o.status)}</span>
              </div>
              <div style="font-size:0.9rem; color:var(--text-soft);">
                <span style="font-weight:600; color:var(--blue-deep);">💰 ${formatPrice(o.price)} ${o.quantity > 1 ? `(x${o.quantity})` : ''}</span> | 
                ${o.color ? `<span>🎨 ${o.color}</span> | ` : ''}
                ${o.size ? `<span>📏 ${o.size}</span> | ` : ''}
                <span>💳 ${o.payment}</span> | 
                <span>📍 ${o.address}</span>
              </div>
              ${o.deliveryEstimate ? `<div style="margin-top:0.5rem; font-size:0.85rem; font-weight:600; color:var(--success);">🚚 ${t('delivery')}: ${o.deliveryEstimate}</div>` : o.status !== 'cancelled' ? `<div style="margin-top:0.5rem; font-size:0.85rem; color:#f39c12;">⏳ ${t('waiting')}</div>` : ''}
              ${o.status === 'cancelled' && o.cancellationReason ? `
                <div class="cancellation-reason">
                  <strong>❌ ${t('cancellationReason')}</strong>
                  ${o.cancellationReason}
                </div>` : ''}
            </div>`).join('')}
          </div>
        </div>

        <!-- TAB: SECURITY -->
        <div id="tab-security" class="profile-tab-content">
          <h2 style="color:var(--blue-deep); margin-bottom:1.5rem;">🔒 Sécurité</h2>
          <div class="card" style="padding:1.5rem; border-color:var(--gray-200); background:var(--white-soft);">
            <h3 style="margin-bottom:0.5rem; font-size:1.1rem;">Mot de passe</h3>
            <p style="font-size:0.9rem; color:var(--text-soft); margin-bottom:1rem;">Vous pouvez demander un lien sécurisé par email pour réinitialiser votre mot de passe.</p>
            <button id="resetPasswordBtn" class="btn btn-outline" style="color:var(--blue-deep); border-color:var(--blue-deep); font-weight:600;">📧 Envoyer lien de réinitialisation</button>
          </div>
          <div style="margin-top:2.5rem; text-align:center; padding-top:2rem; border-top:1px solid var(--gray-200);">
             <button id="profileLogoutBtn" class="btn btn-danger" style="min-width:200px;">🚪 ${t('logout')}</button>
          </div>
        </div>

      </div>
    </div>
  `;

    // Tab Switching Logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.profile-tab-content').forEach(c => c.classList.remove('active'));

            e.currentTarget.classList.add('active');
            const targetId = e.currentTarget.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Save Profile Logic
    document.getElementById('saveProfileBtn')?.addEventListener('click', async () => {
        const name = document.getElementById('profName').value.trim();
        const address = document.getElementById('profAddress').value.trim();
        const phone = document.getElementById('profPhone').value.trim();

        if (address && address.length < 5) {
            showMessage(t('invalidAddress'), 'error');
            return;
        }

        try {
            await db.collection('users').doc(currentUser.uid).update({
                displayName: name,
                address: address,
                phone: phone
            });
            await currentUser.updateProfile({ displayName: name });
            showMessage(t('profileUpdated'), 'success');
            // Update UI without full reload
            document.querySelector('.avatar-container h3').textContent = name || t('clientLabel');

            const avatarEl = document.querySelector('.avatar');
            if (!currentUser.photoURL) {
                avatarEl.innerHTML = `<span id="avatarInitials">${(name || currentUser.email || 'U').substring(0, 2).toUpperCase()}</span><div style="position:absolute; bottom:0; right:0; background:var(--gold); color:white; width:25px; height:25px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; border:2px solid var(--white);">📷</div>`;
            }
        } catch (e) { showMessage(t('errorOccurred') + e.message, 'error'); }
    });

    // Link MonCash Logic
    document.getElementById('linkMoncashBtn')?.addEventListener('click', async () => {
        const phone = document.getElementById('userMoncashPhone').value.trim();
        const consent = document.getElementById('userMoncashConsent').checked;

        if (!phone) { showMessage(t('phoneRequired') || "Telefòn obligatwa", 'error'); return; }
        if (!consent) { showMessage("Ou dwe aksepte kondisyon yo", 'error'); return; }

        try {
            await db.collection('users').doc(currentUser.uid).update({
                moncashPhone: phone,
                moncashConsent: consent,
                moncashLinkedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            showMessage("✅ MonCash konekte ak siksè!", 'success');
            renderView('profile');
        } catch (e) { showMessage('Erreur: ' + e.message, 'error'); }
    });

    // Photo Upload Logic
    document.getElementById('profileAvatar')?.addEventListener('click', () => {
        document.getElementById('profPhotoInput')?.click();
    });

    document.getElementById('profPhotoInput')?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            showMessage(t('fileTooLarge') || "Fichier trop volumineux (max 2Mo)", "error");
            return;
        }

        try {
            showMessage(t('uploading') || "Chargement...", "info");
            const ref = storage.ref(`profiles/${currentUser.uid}/${file.name}`);
            await ref.put(file);
            const url = await ref.getDownloadURL();

            await currentUser.updateProfile({ photoURL: url });
            await db.collection('users').doc(currentUser.uid).update({ photoURL: url });

            const avatarEl = document.getElementById('profileAvatar');
            avatarEl.innerHTML = `<img src="${url}" id="avatarImg"><div style="position:absolute; bottom:0; right:0; background:var(--gold); color:white; width:25px; height:25px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; border:2px solid var(--white);">📷</div>`;

            showMessage(t('profileUpdated'), "success");
        } catch (err) {
            console.error(err);
            showMessage(t('errorOccurred') + err.message, "error");
        }
    });

    // Reset Password Logic
    document.getElementById('resetPasswordBtn')?.addEventListener('click', async () => {
        try {
            await auth.sendPasswordResetEmail(currentUser.email);
            showMessage('Email de réinitialisation envoyé !', 'success');
        } catch (e) {
            showMessage('Erreur: ' + e.message, 'error');
        }
    });

    // Logout Logic
    document.getElementById('profileLogoutBtn')?.addEventListener('click', () => {
        auth.signOut();
        showMessage(t('loggedOut'), 'success');
    });
}

async function renderClientOrders(app) {
    await renderProfile(app);
}

async function renderSettings(app) {
    let notifPrefs = { newProducts: true, specialPrices: true, updates: true };
    if (currentUser) {
        try {
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            if (userDoc.exists && userDoc.data().notifPrefs) {
                notifPrefs = userDoc.data().notifPrefs;
            }
        } catch (e) { console.error(e); }
    }

    app.innerHTML = `
    <div class="card-premium settings-card" style="animation: viewFadeIn 0.4s ease;">
      <h2 style="margin-bottom:2rem; color:var(--blue-deep);">⚙️ ${t('settings')}</h2>
      
      <div class="settings-section">
        <h3>🌍 ${t('language')}</h3>
        <select id="settingsLang" class="filter-select" style="width:100%; max-width:300px;">
          <option value="ht" ${currentLang === 'ht' ? 'selected' : ''}>🇭🇹 Kreyòl</option>
          <option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
          <option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇺🇸 English</option>
          <option value="es" ${currentLang === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
        </select>
      </div>

      <div class="settings-section mt-3">
        <h3>🔔 ${t('notifSettings')}</h3>
        <div class="notif-status-box" id="notifStatusBox">
          <span>${t('notifStatus')}: <strong id="notifStatusLabel">...</strong></span>
          <button class="btn btn-gold btn-sm" id="requestNotifBtn" style="display:none;">${t('notifRequest')}</button>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-title">${t('notifNewProducts')}</div>
            <div class="setting-desc">Recevez une alerte pour chaque nouveauté</div>
          </div>
          <label class="switch">
            <input type="checkbox" id="prefNewProducts" ${notifPrefs.newProducts ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-title">${t('notifSpecialPrices')}</div>
            <div class="setting-desc">Promotions et ventes flash</div>
          </div>
          <label class="switch">
            <input type="checkbox" id="prefSpecialPrices" ${notifPrefs.specialPrices ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-title">${t('notifUpdates')}</div>
            <div class="setting-desc">Infos sur le site et nouvelles fonctions</div>
          </div>
          <label class="switch">
            <input type="checkbox" id="prefUpdates" ${notifPrefs.updates ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>

        <button class="btn btn-gold mt-2" id="saveNotifPrefsBtn" style="width:100%;">${t('notifSave')}</button>
      </div>

      ${currentUser ? `
      <div class="settings-section mt-3" style="padding-top:1.5rem; border-top:1px solid #eee;">
        <h3>👤 ${t('accountInfo')}</h3>
        <div class="account-details">
          <p><strong>${t('email')}:</strong> ${currentUser.email}</p>
          <p><strong>${t('name')}:</strong> ${currentUser.displayName || '---'}</p>
          <p><strong>${t('role')}:</strong> ${isAdmin ? 'Admin' : 'Client'}</p>
          <p><strong>${t('emailVerified')}:</strong> ${currentUser.emailVerified ? '✅ ' + t('yes') : '❌ ' + t('no')}</p>
          ${!currentUser.emailVerified ? `<button class="btn btn-gold btn-sm mt-2" id="resendVerifyEmail">📧 ${t('resendVerifyEmail')}</button>` : ''}
        </div>
      </div>` : ''}
    </div>`;

    // Language Change
    document.getElementById('settingsLang')?.addEventListener('change', (e) => {
        currentLang = e.target.value;
        document.getElementById('langSwitch').value = currentLang;
        applyLanguage();
        renderView('settings'); // Refresh to update labels
    });

    // Notif Status Update
    updateNotifUI();

    document.getElementById('requestNotifBtn')?.addEventListener('click', async () => {
        const permission = await Notification.requestPermission();
        updateNotifUI();
        if (permission === 'granted') showMessage("Notifications autorisées !", "success");
    });

    document.getElementById('saveNotifPrefsBtn')?.addEventListener('click', async () => {
        if (!currentUser) { showMessage(t('loginRequired'), 'error'); return; }
        const prefs = {
            newProducts: document.getElementById('prefNewProducts').checked,
            specialPrices: document.getElementById('prefSpecialPrices').checked,
            updates: document.getElementById('prefUpdates').checked
        };
        try {
            await db.collection('users').doc(currentUser.uid).update({ notifPrefs: prefs });
            showMessage(t('notifPreferencesSaved'), 'success');
        } catch (e) { showMessage(t('errorOccurred') + e.message, 'error'); }
    });

    document.getElementById('resendVerifyEmail')?.addEventListener('click', async () => {
        if (currentUser) { await currentUser.sendEmailVerification(); showMessage(t('emailVerifySent'), 'success'); }
    });
}

function updateNotifUI() {
    const label = document.getElementById('notifStatusLabel');
    const btn = document.getElementById('requestNotifBtn');
    if (!label) return;

    if (!("Notification" in window)) {
        label.textContent = "Non supporté";
        label.style.color = "var(--danger)";
        return;
    }

    if (Notification.permission === 'granted') {
        label.textContent = t('notifGranted');
        label.style.color = "var(--success)";
        btn.style.display = 'none';
    } else if (Notification.permission === 'denied') {
        label.textContent = t('notifBlocked');
        label.style.color = "var(--danger)";
        btn.style.display = 'none';
    } else {
        label.textContent = "Non configuré";
        label.style.color = "#f39c12";
        btn.style.display = 'inline-block';
    }
}


// ============================================
// ATTACHER BOUTONS ACHAT
// ============================================
function attachBuyButtons() {
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            addToCart(e.currentTarget.dataset.productId);
        });
    });

    document.querySelectorAll('.buy-now-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (!currentUser) { showMessage(t('loginRequired'), 'error'); document.getElementById('authBtn')?.click(); return; }
            if (!currentUser.emailVerified) { showMessage(t('emailNotVerified'), 'error'); return; }
            const product = products.find(p => p.id === e.currentTarget.dataset.productId);
            if (!product) return;
            selectedProductId = product.id;
            document.getElementById('modalProductName').textContent = gt(product.name);
            document.getElementById('modalProductPrice').textContent = formatPrice(product.price);
            document.getElementById('productDetailsContent').innerHTML = `<p style="margin:1rem 0; color:var(--text-soft);">${gt(product.description) || ''}</p>`;

            const variationContainer = document.getElementById('variationSelectors');
            if (variationContainer) {
                let html = '';

                // Stock / Quantity
                if (product.stock > 0) {
                    html += `
            <div>
              <label>🔢 ${t('quantity')}</label>
              <input type="number" id="orderQuantity" value="1" min="1" max="${product.stock}" style="width:100px;">
              <span style="font-size:0.8rem; color:var(--text-soft); margin-left:0.5rem;">(${product.stock} ${t('available') || 'disponibles'})</span>
            </div>`;
                } else {
                    html += `<p style="color:var(--danger); font-weight:700;">🚫 ${t('outOfStock')}</p>`;
                }

                // Colors
                if (product.colors && product.colors.length > 0) {
                    html += `
            <div>
              <label>🎨 ${t('selectColor')}</label>
              <select id="orderColor">
                ${product.colors.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>`;
                }

                // Sizes
                if (product.sizes && product.sizes.length > 0) {
                    html += `
            <div>
              <label>📏 ${t('selectSize')}</label>
              <select id="orderSize">
                ${product.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
              </select>
            </div>`;
                }

                variationContainer.innerHTML = html;
            }

            document.getElementById('buyModal').classList.remove('hidden');

            try {
                const userDoc = await db.collection('users').doc(currentUser.uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    if (userData.address) document.getElementById('orderAddress').value = userData.address;
                    if (userData.phone) document.getElementById('orderPhone').value = userData.phone;
                } else {
                    document.getElementById('orderAddress').value = '';
                    document.getElementById('orderPhone').value = '';
                }
                renderReviews(product.id);
            } catch (e) {
                document.getElementById('orderAddress').value = '';
                document.getElementById('orderPhone').value = '';
            }
        });
    });
}

// Event Listeners Panier
document.getElementById('cartBtn')?.addEventListener('click', () => {
    document.getElementById('cartModal').classList.remove('hidden');
    renderCart();
});



document.getElementById('closeCartModal')?.addEventListener('click', () => {
    document.getElementById('cartModal').classList.add('hidden');
});
document.getElementById('cartModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('cartModal')) document.getElementById('cartModal').classList.add('hidden');
});

document.getElementById('checkoutBtn')?.addEventListener('click', async () => {
    if (!currentUser) {
        document.getElementById('cartModal').classList.add('hidden');
        showMessage(t('loginRequired'), 'error');
        document.getElementById('authBtn')?.click();
        return;
    }
    if (cart.length === 0) return;

    // Vérifier profil
    let userDoc;
    try {
        userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (!userDoc.exists || !userDoc.data().address || userDoc.data().address.length < 5 || !userDoc.data().phone) {
            document.getElementById('cartModal').classList.add('hidden');
            showMessage(t('invalidAddress') + " / " + t('fillAllFields'), 'error');
            currentView = 'profile'; renderView('profile');
            return;
        }
    } catch (e) { return; }

    const userData = userDoc.data();
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

    try {
        const orderRef = await db.collection('orders').add({
            userId: currentUser.uid, userEmail: currentUser.email,
            userName: userData.displayName || currentUser.displayName || 'Client',
            address: userData.address, phone: userData.phone,
            items: cart.map(item => ({ id: item.id, name: item.name, price: item.price })),
            productName: cart.length > 1 ? `${cart[0].name} + ${cart.length - 1}` : cart[0].name,
            price: totalPrice, currency: currentCurrency, status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Fraud Detection Integration
        try {
            const fraudCheck = await detectFraudulentOrder({
                id: orderRef.id,
                userId: currentUser.uid,
                userEmail: currentUser.email,
                userName: userData.displayName || currentUser.displayName || 'Client',
                productName: cart.length > 1 ? `${cart[0].name} + ...` : cart[0].name,
                price: totalPrice,
                address: userData.address,
                phone: userData.phone
            });

            if (fraudCheck.isFraudulent && fraudCheck.riskScore > 0.7) {
                await orderRef.update({
                    flaggedForReview: true,
                    fraudScore: fraudCheck.riskScore
                });
            }
        } catch (fraudErr) { console.error("Fraud check failed:", fraudErr); }

        cart = [];
        localStorage.removeItem('totalLakayCart');
        updateCartBadge();
        document.getElementById('cartModal').classList.add('hidden');
        showMessage(t('orderSuccess'), 'success');
        renderView('profile');
    } catch (error) { showMessage(t('errorOccurred') + error.message, 'error'); }
});

// Reviews Logic
let currentRating = 0;
document.querySelectorAll('#starRating span').forEach(star => {
    star.addEventListener('click', (e) => {
        currentRating = parseInt(e.target.dataset.rating);
        document.querySelectorAll('#starRating span').forEach(s => {
            s.classList.toggle('active', parseInt(s.dataset.rating) <= currentRating);
        });
    });
});

document.getElementById('submitReviewBtn')?.addEventListener('click', async () => {
    if (!currentUser) { showMessage(t('loginRequired'), 'error'); return; }
    if (currentRating === 0) { showMessage(t('ratingError'), 'error'); return; }
    const comment = document.getElementById('reviewComment').value.trim();
    if (!comment) { showMessage(t('commentError'), 'error'); return; }

    try {
        await db.collection('reviews').add({
            productId: selectedProductId,
            userId: currentUser.uid,
            userName: currentUser.displayName || 'Kliyan',
            rating: currentRating,
            comment,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Notifier l'admin
        await db.collection('notifications').add({
            title: 'Nouvel avis',
            message: `${currentUser.displayName || 'Client'} a laissé un avis de ${currentRating} étoiles.`,
            type: 'review',
            targetRole: 'admin',
            read: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showMessage(t('reviewSuccess'));
        document.getElementById('reviewComment').value = '';
        currentRating = 0;
        document.querySelectorAll('#starRating span').forEach(s => s.classList.remove('active'));
        renderReviews(selectedProductId);
    } catch (e) { showMessage(t('reviewError'), 'error'); }
});

async function renderReviews(productId) {
    const list = document.getElementById('productReviewsList');
    if (!list) return;
    list.innerHTML = t('loading');
    try {
        const snap = await db.collection('reviews').where('productId', '==', productId).get();
        const revs = snap.docs.map(d => d.data()).sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0));
        if (revs.length === 0) { list.innerHTML = `<p>${t('noReviews')}</p>`; return; }
        list.innerHTML = revs.map(r => `
      <div class="review-item">
        <div class="review-user">${r.userName}</div>
        <div class="review-stars">${'★'.repeat(r.rating)}</div>
        <p>${r.comment}</p>
      </div>`).join('');
    } catch (e) { list.innerHTML = ''; }
}

function renderServices(app) {
    app.innerHTML = `
    <div class="card-premium" style="animation: viewFadeIn 0.4s ease;">
      <h2>🛠️ ${t('servicesTitle')}</h2>
      <div style="padding: 1rem 0; line-height: 1.8;">
        <p>${t('servicesIntro')}</p>
        <ul style="margin-left: 1.5rem; margin-top: 1rem;">
          <li style="margin-bottom: 0.5rem;"><strong>${t('servicesOnline')}</strong> ${t('servicesOnlineDesc')}</li>
          <li style="margin-bottom: 0.5rem;"><strong>${t('servicesDelivery')}</strong> ${t('servicesDeliveryDesc')}</li>
          <li style="margin-bottom: 0.5rem;"><strong>${t('servicesCustomer')}</strong> ${t('servicesCustomerDesc')}</li>
          <li style="margin-bottom: 0.5rem;"><strong>${t('servicesSecure')}</strong> ${t('servicesSecureDesc')}</li>
        </ul>
      </div>
    </div>
  `;
}

function renderPrivacy(app) {
    app.innerHTML = `
    <div class="card-premium" style="animation: viewFadeIn 0.4s ease;">
      <h2>🔒 ${t('privacyTitle')}</h2>
      <div style="padding: 1rem 0; line-height: 1.8;">
        <p>${t('privacyIntro')}</p>
        <ul style="margin-left: 1.5rem; margin-top: 1rem;">
          <li style="margin-bottom: 0.5rem;"><strong>${t('privacyData')}</strong> ${t('privacyDataDesc')}</li>
          <li style="margin-bottom: 0.5rem;"><strong>${t('privacySecurity')}</strong> ${t('privacySecurityDesc')}</li>
          <li style="margin-bottom: 0.5rem;"><strong>${t('privacySharing')}</strong> ${t('privacySharingDesc')}</li>
          <li style="margin-bottom: 0.5rem;"><strong>${t('privacyRights')}</strong> ${t('privacyRightsDesc')}</li>
        </ul>
      </div>
    </div>
  `;
}

function renderTerms(app) {
    app.innerHTML = `
    <div class="card-premium" style="animation: viewFadeIn 0.4s ease;">
      <h2>📜 ${t('termsTitle')}</h2>
      <div style="padding: 1rem 0; line-height: 1.8;">
        <p>${t('termsIntro')}</p>
        <ul style="margin-left: 1.5rem; margin-top: 1rem;">
          <li style="margin-bottom: 0.5rem;"><strong>${t('termsAccount')}</strong> ${t('termsAccountDesc')}</li>
          <li style="margin-bottom: 0.5rem;"><strong>${t('termsPurchase')}</strong> ${t('termsPurchaseDesc')}</li>
          <li style="margin-bottom: 0.5rem;"><strong>${t('termsPrice')}</strong> ${t('termsPriceDesc')}</li>
          <li style="margin-bottom: 0.5rem;"><strong>${t('termsMod')}</strong> ${t('termsModDesc')}</li>
        </ul>
      </div>
    </div>
  `;
}

// ============================================
// MODULE IA - TOTAL LAKAY INTELLIGENT (SÉCURISÉ)
// ============================================

// Configuration par défaut (sera écrasée par Remote Config)
let AIConfig = {
    provider: 'gemini',
    apiKey: '', // 🔒 Chargé depuis Firebase Remote Config
    model: 'gemini-1.5-flash',
    maxTokens: 500,
    temperature: 0.7,
    enabled: true
};

// Initialisation sécurisée depuis Firebase Remote Config
async function initAIConfig() {
    try {
        const remoteConfig = firebase.remoteConfig();

        // Configuration pour le développement
        remoteConfig.settings = {
            minimumFetchIntervalMillis: 3600000, // 1 heure en production
            fetchTimeoutMillis: 10000
        };

        // Pour le développement : intervalle plus court
        if (window.location.hostname === 'localhost') {
            remoteConfig.settings.minimumFetchIntervalMillis = 0;
        }

        // Fetch et activation
        await remoteConfig.fetchAndActivate();

        // Récupération des valeurs
        AIConfig.apiKey = remoteConfig.getString('gemini_api_key');
        AIConfig.model = remoteConfig.getString('gemini_model');
        AIConfig.maxTokens = remoteConfig.getNumber('gemini_max_tokens');
        AIConfig.enabled = remoteConfig.getBoolean('ai_enabled');

        console.log('✅ Configuration IA chargée avec succès');

        // Valeurs par défaut si Remote Config échoue
        if (!AIConfig.apiKey) {
            console.warn('⚠️ Clé API non trouvée dans Remote Config, utilisation des valeurs par défaut');
            AIConfig.apiKey = 'AIzaSyB1DeWg50GnDttlYBJZsMzzBKoW4w-87uA'; // Fallback
        }

    } catch (e) {
        console.error('❌ Erreur chargement Remote Config:', e);
        // Fallback en cas d'erreur
        AIConfig.apiKey = 'AIzaSyB1DeWg50GnDttlYBJZsMzzBKoW4w-87uA';
    }
}

// ============================================
// 1. RECOMMANDATIONS PERSONNALISÉES
// ============================================
async function getAIRecommendations() {
    if (!currentUser) return products.slice(0, 4); // Fallback

    const userHistory = orders.map(o => o.productName).join(', ');
    const userFavorites = favorites.map(id => {
        const p = products.find(pr => pr.id === id);
        return p ? p.name : '';
    }).filter(Boolean).join(', ');

    const prompt = `
En tant qu'expert e-commerce pour Total Lakay en Haïti, analyse :
- Historique d'achats : ${userHistory || 'Aucun'}
- Favoris : ${userFavorites || 'Aucun'}
- Produits disponibles : ${products.map(p => `${p.name} (${p.category}, ${p.price} G)`).join(' | ')}

Recommande 4 produits que ce client devrait acheter. Réponds UNIQUEMENT en JSON : 
{"recommendations": ["id_produit_1", "id_produit_2", "id_produit_3", "id_produit_4"]}
`;

    try {
        const response = await callAI(prompt);
        // Nettoyage de la réponse au cas où le markdown JSON est inclus
        const cleanedResponse = response.replace(/```json|```/g, '').trim();
        const { recommendations } = JSON.parse(cleanedResponse);
        return recommendations.map(id => products.find(p => p.id === id)).filter(Boolean);
    } catch (e) {
        console.error('Erreur IA recommandations:', e);
        return products.slice(0, 4); // Fallback
    }
}

// ============================================
// 2. CHATBOT ASSISTANT CLIENT
// ============================================
async function askAIAssistant(question) {
    const context = `
Tu es l'assistant virtuel de Total Lakay, la boutique en ligne #1 en Haïti.
"Tout bagay lakay ou nan yon sèl klike."

CONNAISSANCES RÉCENTES (MANUEL) :
- Objectifs : Vendre Électronique, Vêtements, Maison, École partout en Haïti.
- Paiement : MonCash et Cash (Lajan Kach).
- WhatsApp : +509 38824664.
- Commande : Cliquer sur Achte, remplir adresse et téléphone, choisir paiement.
- Inscription : Obligatoire pour acheter, validation par email nécessaire.

Langue actuelle : ${currentLang}
Devise : ${currentCurrency}

Règles :
- Réponds UNIQUEMENT dans la langue ${currentLang} (ou créole si demandé).
- Sois TRÈS CONCIS (max 2 phrases).
- Utilise les infos du manuel ci-dessus pour répondre aux questions sur le site.
- Sois amical et professionnel 🤖.
`;

    const fullPrompt = `${context}\n\nQuestion Client: ${question}\nAssistant Total Lakay:`;
    return await callAI(fullPrompt);
}

// ============================================
// 3. GÉNÉRATION DE DESCRIPTIONS PRODUITS
// ============================================
async function generateProductDescription(productName, category, features) {
    const prompt = `
En tant que copywriter e-commerce expert, crée une description de produit pour Total Lakay.
Produit : ${productName}
Catégorie : ${category}
Caractéristiques : ${features}

Génère dans ces 4 langues :
- Créole haïtien (ht)
- Français (fr)
- Anglais (en)
- Espagnol (es)

Format JSON UNIQUEMENT :
{
  "ht": "description en créole",
  "fr": "description en français", 
  "en": "description en anglais",
  "es": "description en espagnol"
}
`;

    try {
        const response = await callAI(prompt);
        const cleanedResponse = response.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanedResponse);
    } catch (e) {
        return null;
    }
}

// ============================================
// 4. ANALYSE DE SENTIMENT DES AVIS
// ============================================
async function analyzeReviewSentiment(review) {
    const prompt = `
Analyse cet avis client pour Total Lakay :
"${review}"

Retourne UNIQUEMENT un JSON :
{
  "sentiment": "positif" | "neutre" | "négatif",
  "score": 0.0 à 1.0,
  "tags": ["mot-clé1", "mot-clé2"],
  "summary": "résumé en une phrase"
}
`;

    try {
        const response = await callAI(prompt);
        const cleanedResponse = response.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanedResponse);
    } catch (e) {
        return { sentiment: 'neutre', score: 0.5, tags: [], summary: review };
    }
}

// ============================================
// 5. DÉTECTION DE FRAUDE
// ============================================
async function detectFraudulentOrder(order) {
    const prompt = `
Analyse cette commande suspecte sur Total Lakay :
- Client : ${order.userName || order.userEmail}
- Produit : ${order.productName}
- Prix : ${order.price} G
- Adresse : ${order.address}
- Téléphone : ${order.phone}
- Quantité : ${order.quantity || 1}

Historique du client : ${orders.filter(o => o.userId === order.userId).length} commandes

Est-ce une commande frauduleuse ? Réponds UNIQUEMENT en JSON :
{
  "isFraudulent": true/false,
  "riskScore": 0.0 à 1.0,
  "reason": "explication courte"
}
`;

    try {
        const response = await callAI(prompt);
        const cleanedResponse = response.replace(/```json|```/g, '').trim();
        const { isFraudulent, riskScore } = JSON.parse(cleanedResponse);

        if (isFraudulent && riskScore > 0.8) {
            await db.collection('notifications').add({
                title: '🚨 Commande Suspecte',
                message: `Commande #${order.id?.substring(0, 6)} risque ${Math.round(riskScore * 100)}%`,
                type: 'fraud',
                targetRole: 'admin',
                read: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        return { isFraudulent, riskScore };
    } catch (e) {
        return { isFraudulent: false, riskScore: 0 };
    }
}

// ============================================
// 6. MOTEUR D'APPEL IA (SÉCURISÉ)
// ============================================
async function callAI(prompt) {
    if (!AIConfig.enabled) {
        throw new Error('IA désactivée temporairement');
    }

    if (!AIConfig.apiKey) {
        await initAIConfig(); // Réessayer de charger la config
        if (!AIConfig.apiKey) {
            throw new Error('Configuration IA manquante');
        }
    }

    if (AIConfig.provider === 'gemini') {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${AIConfig.model}:generateContent?key=${AIConfig.apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            maxOutputTokens: AIConfig.maxTokens,
                            temperature: AIConfig.temperature
                        }
                    })
                }
            );

            if (!response.ok) {
                const errData = await response.json();
                console.error('Gemini API Error:', errData);

                // Si quota dépassé, désactiver temporairement
                if (response.status === 429) {
                    AIConfig.enabled = false;
                    setTimeout(() => { AIConfig.enabled = true; }, 60000); // Réactiver après 1 min
                    throw new Error('Service IA momentanément indisponible. Réessayez dans une minute.');
                }

                throw new Error(errData.error?.message || 'Erreur API Gemini');
            }

            const data = await response.json();
            if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
                console.error('Réponse Gemini inattendue:', data);
                throw new Error('Réponse IA invalide');
            }
            return data.candidates[0].content.parts[0].text;

        } catch (e) {
            console.error('❌ Erreur réseau ou API IA:', e);
            // Tentative de diagnostic
            if (!navigator.onLine) throw new Error('Pas de connexion internet');
            throw new Error('Erreur de communication avec le serveur IA');
        }
    }

    throw new Error('Fournisseur IA non supporté');
}

// ============================================
// 7. INTÉGRATION DANS L'INTERFACE
// ============================================

// Suppression du bouton dynamique car on utilise navAI dans le HTML
function addChatbotToNavbar() { return; }

function toggleChatbot() {
    if (!currentUser) {
        showMessage(t('loginRequired'), 'error');
        document.getElementById('authBtn')?.click();
        return;
    }

    let chatbot = document.getElementById('chatbotContainer');

    if (chatbot) {
        chatbot.classList.toggle('hidden');
        return;
    }

    chatbot = document.createElement('div');
    chatbot.id = 'chatbotContainer';
    chatbot.innerHTML = `
        <div class="chatbot-window">
            <div class="chatbot-header">
                <span>🤖 Assistant</span>
                <div style="display:flex; gap:10px;">
                    <button id="openAIPageFromPop" title="Plein écran" style="background:none; border:none; color:white; cursor:pointer; font-size:1rem;">🔲</button>
                    <button id="closeChatbot" style="background:none; border:none; color:white; cursor:pointer; font-size:1rem;">✕</button>
                </div>
            </div>
            <div class="chatbot-messages" id="chatbotMessages">
                <div class="message bot">
                    👋 Bonjour ! Je suis l'assistant IA de Total Lakay. Comment puis-je vous aider ?
                </div>
            </div>
            <div class="chatbot-input">
                <input type="text" id="chatbotInput" placeholder="Posez votre question...">
                <button id="sendChatbotMsg">📤</button>
            </div>
        </div>
    `;

    document.body.appendChild(chatbot);

    document.getElementById('closeChatbot').addEventListener('click', () => {
        chatbot.classList.add('hidden');
    });

    document.getElementById('openAIPageFromPop').addEventListener('click', () => {
        chatbot.classList.add('hidden');
        renderView('aiPage');
    });

    document.getElementById('sendChatbotMsg').addEventListener('click', sendChatbotMessage);
    document.getElementById('chatbotInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatbotMessage();
    });
}

async function sendChatbotMessage() {
    const input = document.getElementById('chatbotInput');
    const messages = document.getElementById('chatbotMessages');
    const question = input.value.trim();

    if (!question) return;

    // Message utilisateur avec animation
    const userDiv = document.createElement('div');
    userDiv.className = 'message user';
    userDiv.style.animation = 'aiSlideUp 0.3s ease-out';
    userDiv.textContent = question;
    messages.appendChild(userDiv);
    input.value = '';

    // Indicateur de réflexion animé
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing';
    typingDiv.innerHTML = `<span class="dot-flashing"></span> ${t('aiTyping')}`;
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;

    try {
        const answer = await askAIAssistant(question);
        if (typingDiv) typingDiv.remove();

        const botDiv = document.createElement('div');
        botDiv.className = 'message bot';
        botDiv.style.animation = 'fadeIn 0.3s ease';
        botDiv.textContent = answer;
        messages.appendChild(botDiv);
    } catch (e) {
        if (typingDiv) typingDiv.remove();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message bot';
        errorDiv.textContent = t('aiError');
        messages.appendChild(errorDiv);
    }
    messages.scrollTop = messages.scrollHeight;
}

async function renderAIRecommendations() {
    const container = document.getElementById('aiRecommendations');
    if (!container) return;

    container.innerHTML = '<div class="spinner"></div>';

    const recommendations = await getAIRecommendations();

    container.innerHTML = `
        <h3>🤖 ${currentLang === 'ht' ? 'Rekòmandasyon Entèlijan' : 'Recommandations Intelligentes'}</h3>
        <div class="grid">
            ${recommendations.map(p => productCardHTML(p)).join('')}
        </div>
    `;

    attachBuyButtons();
}

// ============================================
// DÉMARRAGE
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Total Lakay - Version Ultime avec IA Sécurisée');

    // Charger la configuration IA AVANT tout
    await initAIConfig();

    applyLanguage();

    // Navigation Links (Menu & Footer)
    const navActions = [
        { id: 'linkServices', view: 'services' },
        { id: 'linkPrivacy', view: 'privacy' },
        { id: 'linkTerms', view: 'terms' },
        { id: 'footerServices', view: 'services' },
        { id: 'footerPrivacy', view: 'privacy' },
        { id: 'footerTerms', view: 'terms' }
    ];

    navActions.forEach(action => {
        document.getElementById(action.id)?.addEventListener('click', (e) => {
            e.preventDefault(); renderView(action.view); window.scrollTo(0, 0);
        });
    });

    document.getElementById('footerContact')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://wa.me/50938824664', '_blank');
    });

    // Consent Modal Events
    document.getElementById('acceptConsent')?.addEventListener('click', async () => {
        if (currentUser) {
            await db.collection('users').doc(currentUser.uid).update({ termsAccepted: true });
            document.getElementById('consentModal').classList.add('hidden');
            showMessage(t('welcome'), 'success');
        }
    });

    document.getElementById('declineConsent')?.addEventListener('click', () => {
        auth.signOut();
        document.getElementById('consentModal').classList.add('hidden');
        showMessage(t('loggedOut'), 'error');
    });

    renderView('home');

    // ============================================
    // LOGIQUE SIDE DRAWER (MENU)
    // ============================================
    const sideDrawer = document.getElementById('sideDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const menuBtn = document.getElementById('menuBtn');
    const closeDrawer = document.getElementById('closeDrawer');

    const toggleDrawer = () => {
        sideDrawer.classList.toggle('open');
        drawerOverlay.classList.toggle('active');
        document.body.style.overflow = sideDrawer.classList.contains('open') ? 'hidden' : '';
    };

    menuBtn?.addEventListener('click', toggleDrawer);
    closeDrawer?.addEventListener('click', toggleDrawer);
    drawerOverlay?.addEventListener('click', toggleDrawer);

    // Navigation Items dans le drawer
    const drawerNavs = [
        { id: 'navHome', view: 'home' },
        { id: 'navShop', view: 'shop' },
        { id: 'navAI', view: 'aiPage' },
        { id: 'navProfile', view: 'profile' },
        { id: 'navAdmin', view: 'admin' },
        { id: 'menuFavorites', view: 'favorites' },
        { id: 'menuHistory', view: 'history' }
    ];

    drawerNavs.forEach(nav => {
        document.getElementById(nav.id)?.addEventListener('click', (e) => {
            e.preventDefault();
            renderView(nav.view);
            toggleDrawer();
            window.scrollTo(0, 0);
        });
    });

    // Language & Currency switches in drawer
    document.getElementById('langSwitch')?.addEventListener('change', (e) => {
        currentLang = e.target.value;
        localStorage.setItem('totalLakayLang', currentLang);
        applyLanguage();
        renderView(currentView);
    });

    document.getElementById('currencySwitch')?.addEventListener('change', (e) => {
        currentCurrency = e.target.value;
        localStorage.setItem('totalLakayCurrency', currentCurrency);
        renderView(currentView);
    });

    // Initialisation IA
    addChatbotToNavbar();
    if (AIConfig.enabled && AIConfig.apiKey) {
        if (currentView === 'home') {
            setTimeout(renderAIRecommendations, 2000);
        }
    } else {
        console.warn('⚠️ IA désactivée ou non configurée');
    }
});
