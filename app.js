/* ============================================
   TOTAL LAKAY - Version Finale Ultime
   Firebase configuré - Admin Dashboard + Client
   Recherche & Filtres - Toutes traductions
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
let currentCurrency = 'USD';
let currentView = 'home';
let products = [];
let orders = [];
let allUsers = [];
let notifications = [];
let cart = JSON.parse(localStorage.getItem('totalLakayCart') || '[]');
let favorites = JSON.parse(localStorage.getItem('totalLakayFavorites') || '[]');
let selectedProductId = null;

const exchangeRates = {
  USD: 1,
  HTG: 135,
  EUR: 0.95
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
    footerRights: "Total Lakay © 2026", footerContact: "Kontakte nou",
    footerServices: "Sèvis", footerPrivacy: "Konfidansyalite",
    footerTerms: "Kondisyon Itilizasyon",
    notifSent: "✅ Notifikasyon voye!",
    roleChanged: "✅ Wòl modifye!",
    madeAdmin: "✅ Fè admin!",
    madeClient: "✅ Fè kliyan!",
    // Recherche & Filtres
    searchPlaceholder: "🔍 Rechèche yon pwodui...",
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
    categoryFood: "🍚 Manje / Alimentation",
    categoryElectronics: "📱 Elektwonik",
    categoryClothing: "👕 Vètman",
    categoryHome: "🏠 Kay / Maison",
    categoryBeauty: "💄 Bote / Beauté",
    categoryOther: "📦 Lòt / Autres",
    profile: "Profil", phone: "Telefòn", phonePlaceholder: "Ex: +509 1234 5678",
    updateProfile: "Mete ajou profil", profileUpdated: "Profil mete ajou ak siksè!",
    phoneNumber: "Nimewo telefòn", saveProfile: "Anrejistre Profil",
    addressRecommend: "Adrès (Rekòmande)", phoneRecommend: "Telefòn (Rekòmande)",
    cart: "Panyen", addToCart: "Ajoute nan panyen", removeFromCart: "Retire",
    checkout: "Peye kounye a", total: "Total", emptyCart: "Panyen ou vid",
    securePayment: "Peman Sekirize", contactUs: "Kontakte nou",
    securePaymentInfo: "Peman 100% sekirize",
    notifications: "Notifikasyon", noNotifications: "Pa gen notifikasyon",
    favorites: "Favori", noFavorites: "Pa gen favori ankò",
    reviews: "Avi", leaveReview: "Kite yon avi", addReview: "Ajoute yon avi", noReviews: "Pa gen avi ankò",
    rating: "Nòt", comment: "Kòmantè", submit: "Voye", invalidAddress: "Adrès ou antre a pa valab",
    ratingError: "Chwazi yon nòt (zetwal)", commentError: "Ekri yon kòmantè", reviewSuccess: "Mèsi pou avi ou!", reviewError: "Erè voye avi",
    servicesTitle: "Sèvis nou yo",
    servicesIntro: "Total Lakay ofri plizyè sèvis pou fasilite lavi w :",
    servicesOnline: "Vant an liy :",
    servicesOnlineDesc: "Yon gran chwa pwodwi nan plizyè kategori (elektwonik, akseswa pou kay, akseswa pèsonel, elatriye).",
    servicesDelivery: "Livrezon rapid :",
    servicesDeliveryDesc: "Nou asire nou ke ou jwenn komand ou nan pi bon delè yo.",
    servicesCustomer: "Sèvis kliyan :",
    servicesCustomerDesc: "Nou disponib pou reponn tout kesyon w via apèl dirèk, WhatsApp oswa imèl.",
    servicesSecure: "Peman sekirize :",
    servicesSecureDesc: "Nou aksepte plizyè mwayen peman pou sekirite w ak konfò w.",
    privacyTitle: "Politik Konfidansyalite",
    privacyIntro: "Nan Total Lakay, nou pran vi prive w trè oserye. Men kijan nou itilize ak pwoteje done ou yo :",
    privacyData: "Kolek done :",
    privacyDataDesc: "Nou sèlman kolekte enfòmasyon ki nesesè pou trete komand ou yo (non, adrès, imèl, nimewo telefòn).",
    privacySecurity: "Sekirite :",
    privacySecurityDesc: "Tout done pèsonèl ou yo chiffres epi estoke sou sèvè ki an sekirite (Firebase).",
    privacySharing: "Pataj done :",
    privacySharingDesc: "Nou pa janm vann oswa pataje enfòmasyon pèsonèl ou ak twazyèm pati san konsantman w, sof si lalwa mande sa.",
    privacyRights: "Dwa w yo :",
    privacyRightsDesc: "Ou gen dwa pou w modifye oswa efase kont ou nenpòt kilè nan paramèt pwofil ou.",
    termsTitle: "Kondisyon Itilizasyon",
    termsIntro: "Lè w itilize platfòm Total Lakay la, ou asepte kondisyon sa yo :",
    termsAccount: "Kont itilizatè :",
    termsAccountDesc: "Ou responsab pou kenbe modpas ou an sekirite. Tout aktivite sou kont ou se responsablite w.",
    termsPurchase: "Acha :",
    termsPurchaseDesc: "Tout acha fèt final sof nan ka kote pwodwi a domaje nan livrezon. Nou rezève dwa pou n anile nenpòt komand sispèk.",
    termsPrice: "Pri ak Pwodwi :",
    termsPriceDesc: "Pri yo ka chanje san avètisman alavans. Nou fè efò pou n gen deskripsyon egzak pou cada pwodwi.",
    termsMod: "Modifikasyon :",
    termsModDesc: "Total Lakay ka modifye kondisyon sa yo nenpòt moman. N ap fè itilizatè yo konnen via notifikasyon.",
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
    footerRights: "Total Lakay © 2026", footerContact: "Contactez-nous",
    footerServices: "Services", footerPrivacy: "Confidentialité",
    footerTerms: "Conditions d'Utilisation",
    notifSent: "✅ Notification envoyée !",
    roleChanged: "✅ Rôle modifié !",
    madeAdmin: "✅ Passé admin !",
    madeClient: "✅ Passé client !",
    // Recherche & Filtres
    searchPlaceholder: "🔍 Rechercher un produit...",
    allCategories: "Toutes catégories",
    priceMin: "Prix min",
    priceMax: "Prix max",
    applyFilters: "Filtrer",
    resetFilters: "Réinitialiser",
    sortDateDesc: "Plus récent",
    sortDateAsc: "Plus ancien",
    sortPriceAsc: "Prix: Bas → Haut",
    sortPriceDesc: "Prix: Haut → Bas",
    sortNameAsc: "Nom: A → Z",
    sortNameDesc: "Nom: Z → A",
    resultsFound: "résultats trouvés",
    noResultsFound: "Aucun résultat. Essayez d'autres mots.",
    categoryFood: "🍚 Alimentation",
    categoryElectronics: "📱 Électronique",
    categoryClothing: "👕 Vêtements",
    categoryHome: "🏠 Maison",
    categoryBeauty: "💄 Beauté",
    categoryOther: "📦 Autres",
    profile: "Profil", phone: "Téléphone", phonePlaceholder: "Ex: +509 1234 5678",
    updateProfile: "Mettre à jour le profil", profileUpdated: "Profil mis à jour avec succès !",
    phoneNumber: "Numéro de téléphone", saveProfile: "Enregistrer le Profil",
    addressRecommend: "Adresse (Recommandé)", phoneRecommend: "Téléphone (Recommandé)",
    cart: "Panier", addToCart: "Ajouter au panier", removeFromCart: "Retirer",
    checkout: "Payer maintenant", total: "Total", emptyCart: "Votre panier est vide",
    securePayment: "Paiement Sécurisé", contactUs: "Contactez-nous",
    securePaymentInfo: "Paiement 100% sécurisé",
    notifications: "Notifications", noNotifications: "Pas de notifications",
    favorites: "Favoris", noFavorites: "Pas encore de favoris",
    reviews: "Avis", leaveReview: "Laisser un avis", addReview: "Ajouter un avis", noReviews: "Pas encore d'avis",
    rating: "Note", comment: "Commentaire", submit: "Envoyer", invalidAddress: "Adresse invalide",
    ratingError: "Choisissez une note (étoiles)", commentError: "Écrivez un commentaire", reviewSuccess: "Merci pour votre avis !", reviewError: "Erreur d'envoi",
    servicesTitle: "Nos Services",
    servicesIntro: "Total Lakay offre plusieurs services pour vous faciliter la vie :",
    servicesOnline: "Vente en ligne :",
    servicesOnlineDesc: "Un grand choix de produits dans plusieurs catégories (électronique, accessoires pour la maison, accessoires personnels, etc.).",
    servicesDelivery: "Livraison rapide :",
    servicesDeliveryDesc: "Nous nous assurons que vous recevez votre commande dans les meilleurs délais.",
    servicesCustomer: "Service client :",
    servicesCustomerDesc: "Nous sommes disponibles pour répondre à toutes vos questions via appel direct, WhatsApp ou e-mail.",
    servicesSecure: "Paiement sécurisé :",
    servicesSecureDesc: "Nous acceptons plusieurs moyens de paiement pour votre sécurité et votre confort.",
    privacyTitle: "Politique de Confidentialité",
    privacyIntro: "Chez Total Lakay, nous prenons votre vie privée très au sérieux. Voici comment nous utilisons et protégeons vos données :",
    privacyData: "Collecte de données :",
    privacyDataDesc: "Nous ne collectons que les informations nécessaires au traitement de vos commandes (nom, adresse, e-mail, numéro de téléphone).",
    privacySecurity: "Sécurité :",
    privacySecurityDesc: "Toutes vos données personnelles sont cryptées et stockées sur des serveurs sécurisés (Firebase).",
    privacySharing: "Partage de données :",
    privacySharingDesc: "Nous ne vendons ni ne partageons jamais vos informations personnelles avec des tiers sans votre consentement, sauf si la loi l'exige.",
    privacyRights: "Vos droits :",
    privacyRightsDesc: "Vous avez le droit de modifier ou de supprimer votre compte à tout moment dans vos paramètres de profil.",
    termsTitle: "Conditions d'Utilisation",
    termsIntro: "En utilisant la plateforme Total Lakay, vous acceptez les conditions suivantes :",
    termsAccount: "Compte utilisateur :",
    termsAccountDesc: "Vous êtes responsable du maintien de la sécurité de votre mot de passe. Toutes les activités sur votre compte sont sous votre responsabilité.",
    termsPurchase: "Achat :",
    termsPurchaseDesc: "Tous les achats sont définitifs sauf si le produit est endommagé lors de la livraison. Nous nous réservons le droit d'annuler toute commande suspecte.",
    termsPrice: "Prix et Produits :",
    termsPriceDesc: "Les prix sont sujets à changement sans préavis. Nous nous efforçons d'avoir des descriptions exactes pour chaque produit.",
    termsMod: "Modifications :",
    termsModDesc: "Total Lakay peut modifier ces conditions à tout moment. Nous en informerons les utilisateurs via des notifications.",
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
    footerRights: "Total Lakay © 2026", footerContact: "Contact us",
    footerServices: "Services", footerPrivacy: "Privacy",
    footerTerms: "Terms of Use",
    notifSent: "✅ Notification sent!",
    roleChanged: "✅ Role changed!",
    madeAdmin: "✅ Made admin!",
    madeClient: "✅ Made client!",
    // Search & Filters
    searchPlaceholder: "🔍 Search a product...",
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
    categoryFood: "🍚 Food",
    categoryElectronics: "📱 Electronics",
    categoryClothing: "👕 Clothing",
    categoryHome: "🏠 Home",
    categoryBeauty: "💄 Beauty",
    categoryOther: "📦 Other",
    profile: "Profile", phone: "Phone", phonePlaceholder: "Ex: +509 1234 5678",
    updateProfile: "Update Profile", profileUpdated: "Profile updated successfully!",
    phoneNumber: "Phone Number", saveProfile: "Save Profile",
    addressRecommend: "Address (Recommended)", phoneRecommend: "Phone (Recommended)",
    cart: "Cart", addToCart: "Add to cart", removeFromCart: "Remove",
    checkout: "Checkout now", total: "Total", emptyCart: "Your cart is empty",
    securePayment: "Secure Payment", contactUs: "Contact Us",
    securePaymentInfo: "100% Secure Payment",
    notifications: "Notifications", noNotifications: "No notifications",
    favorites: "Favorites", noFavorites: "No favorites yet",
    reviews: "Reviews", leaveReview: "Leave a review", addReview: "Add a review", noReviews: "No reviews yet",
    rating: "Rating", comment: "Comment", submit: "Submit", invalidAddress: "Invalid address",
    ratingError: "Choose a rating (stars)", commentError: "Write a comment", reviewSuccess: "Thank you for your review!", reviewError: "Error sending review",
    servicesTitle: "Our Services",
    servicesIntro: "Total Lakay offers several services to make your life easier:",
    servicesOnline: "Online sales:",
    servicesOnlineDesc: "A wide choice of products in several categories (electronics, home accessories, personal accessories, etc.).",
    servicesDelivery: "Fast delivery:",
    servicesDeliveryDesc: "We ensure that you receive your order in the best possible time.",
    servicesCustomer: "Customer service:",
    servicesCustomerDesc: "We are available to answer all your questions via direct call, WhatsApp or email.",
    servicesSecure: "Secure payment:",
    servicesSecureDesc: "We accept several payment methods for your security and comfort.",
    privacyTitle: "Privacy Policy",
    privacyIntro: "At Total Lakay, we take your privacy very seriously. Here is how we use and protect your data:",
    privacyData: "Data collection:",
    privacyDataDesc: "We only collect the information necessary to process your orders (name, address, email, phone number).",
    privacySecurity: "Security:",
    privacySecurityDesc: "All your personal data is encrypted and stored on secure servers (Firebase).",
    privacySharing: "Data sharing:",
    privacySharingDesc: "We never sell or share your personal information with third parties without your consent, unless required by law.",
    privacyRights: "Your rights:",
    privacyRightsDesc: "You have the right to modify or delete your account at any time in your profile settings.",
    termsTitle: "Terms of Use",
    termsIntro: "By using the Total Lakay platform, you accept the following conditions:",
    termsAccount: "User account:",
    termsAccountDesc: "You are responsible for maintaining the security of your password. All activities on your account are your responsibility.",
    termsPurchase: "Purchase:",
    termsPurchaseDesc: "All purchases are final unless the product is damaged during delivery. We reserve the right to cancel any suspicious order.",
    termsPrice: "Price and Products:",
    termsPriceDesc: "Prices are subject to change without notice. We strive to have accurate descriptions for each product.",
    termsMod: "Modifications:",
    termsModDesc: "Total Lakay may modify these conditions at any time. We will notify users via notifications.",
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
    footerRights: "Total Lakay © 2026", footerContact: "Contáctanos",
    footerServices: "Servicios", footerPrivacy: "Privacidad",
    footerTerms: "Condiciones de Uso",
    notifSent: "✅ ¡Notificación enviada!",
    roleChanged: "✅ ¡Rol cambiado!",
    madeAdmin: "✅ ¡Hecho admin!",
    madeClient: "✅ ¡Hecho cliente!",
    // Búsqueda y Filtros
    searchPlaceholder: "🔍 Buscar un producto...",
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
    categoryFood: "🍚 Comida",
    categoryElectronics: "📱 Electrónica",
    categoryClothing: "👕 Ropa",
    categoryHome: "🏠 Hogar",
    categoryBeauty: "💄 Belleza",
    categoryOther: "📦 Otros",
    profile: "Perfil", phone: "Teléfono", phonePlaceholder: "Ej: +509 1234 5678",
    updateProfile: "Actualizar perfil", profileUpdated: "¡Perfil actualizado con éxito!",
    phoneNumber: "Número de teléfono", saveProfile: "Guardar Perfil",
    addressRecommend: "Dirección (Recomendado)", phoneRecommend: "Teléfono (Recommandado)",
    cart: "Carrito", addToCart: "Añadir al carrito", removeFromCart: "Eliminar",
    checkout: "Pagar ahora", total: "Total", emptyCart: "Tu carrito está vacío",
    securePayment: "Pago Seguro", contactUs: "Contáctenos",
    securePaymentInfo: "Pago 100% seguro",
    notifications: "Notificaciones", noNotifications: "No hay notificaciones",
    favorites: "Favoritos", noFavorites: "Aún no hay favoritos",
    reviews: "Reseñas", leaveReview: "Dejar una reseña", addReview: "Agregar una reseña", noReviews: "Aún no hay reseñas",
    rating: "Calificación", comment: "Comentario", submit: "Enviar", invalidAddress: "Dirección inválida",
    ratingError: "Elige una calificación (estrellas)", commentError: "Escribe un comentario", reviewSuccess: "¡Gracias por tu reseña!", reviewError: "Error enviando reseña",
    servicesTitle: "Nuestros Servicios",
    servicesIntro: "Total Lakay ofrece varios servicios para facilitar su vida:",
    servicesOnline: "Ventas en línea:",
    servicesOnlineDesc: "Una gran selección de productos en varias categorías (electrónica, accesorios para el hogar, accesorios personales, etc.).",
    servicesDelivery: "Entrega rápida:",
    servicesDeliveryDesc: "Nos aseguramos de que reciba su pedido en el mejor tiempo posible.",
    servicesCustomer: "Servicio al cliente:",
    servicesCustomerDesc: "Estamos disponibles para responder a todas sus preguntas a través de llamada directa, WhatsApp o correo electrónico.",
    servicesSecure: "Pago seguro:",
    servicesSecureDesc: "Aceptamos varios métodos de pago para su seguridad y comodidad.",
    privacyTitle: "Política de Privacidad",
    privacyIntro: "En Total Lakay, nos tomamos su privacidad muy en serio. Aquí le mostramos cómo usamos y protegemos sus datos:",
    privacyData: "Recopilación de datos:",
    privacyDataDesc: "Solo recopilamos la información necesaria para procesar sus pedidos (nombre, dirección, correo electrónico, número de teléfono).",
    privacySecurity: "Seguridad:",
    privacySecurityDesc: "Todos sus datos personales están cifrados y almacenados en servidores seguros (Firebase).",
    privacySharing: "Intercambio de datos:",
    privacySharingDesc: "Nunca vendemos ni compartimos su información personal con terceros sin su consentimiento, a menos que la ley lo exija.",
    privacyRights: "Sus derechos:",
    privacyRightsDesc: "Tiene derecho a modificar o eliminar su cuenta en cualquier momento en la configuración de su perfil.",
    termsTitle: "Condiciones de Uso",
    termsIntro: "Al usar la plataforma Total Lakay, usted acepta las siguientes condiciones:",
    termsAccount: "Cuenta de usuario:",
    termsAccountDesc: "Usted es responsable de mantener la seguridad de su contraseña. Todas las actividades en su cuenta son su responsabilidad.",
    termsPurchase: "Compra:",
    termsPurchaseDesc: "Todas las compras son finales a menos que el producto se dañe durante la entrega. Nos reservamos el derecho de cancelar cualquier pedido sospechoso.",
    termsPrice: "Precio y Productos:",
    termsPriceDesc: "Los precios están sujetos a cambios sin previo aviso. Nos esforzamos por tener descripciones precisas para cada producto.",
    termsMod: "Modificaciones:",
    termsModDesc: "Total Lakay puede modificar estas condiciones en cualquier momento. Notificaremos a los usuarios a través de notificaciones.",
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
        <img src="${item.image || 'logo.jpeg'}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;" onerror="this.src='logo.jpeg'">
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
    notifications = snap.docs.map(d => ({ id: d.id, ...d.data() }));
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

function formatPrice(priceUSD) {
  const rate = exchangeRates[currentCurrency] || 1;
  const converted = priceUSD * rate;
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
  // Mettre à jour les options de catégorie
  updateCategoryOptions();
  if (currentView) renderView(currentView);
}

function updateCategoryOptions() {
  const categorySelect = document.getElementById('categoryFilter');
  if (!categorySelect) return;
  const options = categorySelect.querySelectorAll('option');
  const categoryKeys = ['all', 'food', 'electronics', 'clothing', 'home', 'beauty', 'other'];
  const translationKeys = ['allCategories', 'categoryFood', 'categoryElectronics', 'categoryClothing', 'categoryHome', 'categoryBeauty', 'categoryOther'];

  options.forEach((option, index) => {
    if (translationKeys[index]) {
      option.textContent = t(translationKeys[index]);
    }
  });
}

function showMessage(message, type = 'success') {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position:fixed; bottom:20px; right:20px;
    background:${type === 'success' ? '#1e7e5b' : '#c0392b'};
    color:white; padding:1rem 1.5rem; border-radius:30px;
    font-weight:600; z-index:3000;
    box-shadow:0 20px 40px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
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
    listenNotifications();
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
document.getElementById('menuFavorites')?.addEventListener('click', (e) => {
  e.preventDefault(); document.getElementById('dropdownMenu')?.classList.add('hidden');
  currentView = 'favorites'; renderView('favorites');
});

function renderFavorites(app) {
  const favProducts = products.filter(p => favorites.includes(p.id));
  app.innerHTML = `
    <h2>❤️ ${t('favorites') || 'Favori'}</h2>
    <div class="grid">
      ${favProducts.length === 0 ? `<p class="text-center" style="grid-column:1/-1;">${t('noFavorites')}</p>` : favProducts.map(p => productCardHTML(p)).join('')}
    </div>`;
  attachBuyButtons();
}

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
      <div class="notif-title">${n.type === 'promo' ? '🎉' : n.type === 'new' ? '🆕' : '💰'} ${n.title}</div>
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

document.getElementById('currencySwitch')?.addEventListener('change', (e) => {
  currentCurrency = e.target.value;
  renderView(currentView);
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
  try {
    await db.collection('orders').add({
      userId: currentUser.uid, userEmail: currentUser.email,
      productId: product.id, productName: product.name,
      price: product.price, currency: currentCurrency, image: product.image || '',
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
      <img src="${product.image || 'logo.jpeg'}" alt="${product.name}" class="product-img" onerror="this.src='logo.jpeg'">
      <div class="product-info">
        <div class="product-title">${product.name}</div>
        ${product.description ? `<div class="product-description">${product.description.substring(0, 60)}...</div>` : ''}
        <div class="product-price">${formatPrice(product.price)} ${hasPromo ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}</div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-gold btn-sm add-cart-btn" data-product-id="${product.id}" style="flex:1;">🛒 ${t('addToCart')}</button>
          <button class="btn btn-outline btn-sm buy-now-btn" data-product-id="${product.id}">⚡</button>
        </div>
      </div>
    </div>`;
}

// ============================================
// DASHBOARD ADMIN (inchangé - déjà complet)
// ============================================
async function renderAdminDashboard(app) {
  if (!isAdmin) { app.innerHTML = `<div class="card text-center"><p>⛔ ${t('adminOnly')}</p></div>`; return; }
  await loadAllData();

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalClients = allUsers.filter(u => u.role === 'client').length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.price || 0), 0);

  app.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
      <h2 style="margin:0;">📊 ${t('dashboard')}</h2>
      <div class="badge badge-success">${t('welcomeAdmin')}</div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:1.5rem; margin-bottom:2rem;">
      <div class="admin-stat-card" style="border-left-color: var(--gold);">
        <div class="admin-stat-val">${totalProducts}</div>
        <div class="admin-stat-label">📦 ${t('totalProducts')}</div>
      </div>
      <div class="admin-stat-card" style="border-left-color: var(--success);">
        <div class="admin-stat-val">${totalOrders}</div>
        <div class="admin-stat-label">📋 ${t('totalOrders')}</div>
      </div>
      <div class="admin-stat-card" style="border-left-color: #1e6b8a;">
        <div class="admin-stat-val">${totalClients}</div>
        <div class="admin-stat-label">👥 ${t('totalClients')}</div>
      </div>
      <div class="admin-stat-card" style="border-left-color: #f39c12;">
        <div class="admin-stat-val">${formatPrice(totalRevenue)}</div>
        <div class="admin-stat-label">💰 ${t('revenue')}</div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:2rem;">
      <div class="card text-center" style="padding:1.5rem; background:rgba(243, 156, 18, 0.05);">
        <div style="font-size:1.8rem; font-weight:800; color:#f39c12;">${pendingCount}</div>
        <div class="admin-stat-label">⏳ ${t('pendingOrders')}</div>
      </div>
      <div class="card text-center" style="padding:1.5rem; background:rgba(30, 126, 91, 0.05);">
        <div style="font-size:1.8rem; font-weight:800; color:#1e7e5b;">${confirmedCount}</div>
        <div class="admin-stat-label">✅ ${t('confirmedOrders')}</div>
      </div>
    </div>

    <div class="card-premium">
      <h3 style="margin-bottom:1rem;">⚡ ${t('quickActions')}</h3>
      <div style="display:flex; gap:1rem; flex-wrap:wrap;">
        <button class="btn btn-gold" id="adminAddProductBtn">➕ ${t('addProduct')}</button>
        <button class="btn btn-outline" style="color:var(--blue-deep); border-color:var(--blue-deep);" id="adminManageOrdersBtn">📦 ${t('manageOrders')}</button>
        <button class="btn btn-outline" style="color:var(--blue-deep); border-color:var(--blue-deep);" id="adminManageClientsBtn">👥 ${t('manageClients')}</button>
        <button class="btn btn-outline" style="color:var(--blue-deep); border-color:var(--blue-deep);" id="adminSendNotifBtn">🔔 ${t('sendNotification')}</button>
      </div>
    </div>

    <div id="adminAddProductForm" class="card hidden mt-2">
      <h3>➕ ${t('addProduct')}</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
        <div><label>${t('productName')}</label><input id="adminProdName" placeholder="${t('productNamePlaceholder')}"></div>
        <div><label>${t('productPrice')} ($)</label><input id="adminProdPrice" type="number" placeholder="${t('productPricePlaceholder')}" step="0.01"></div>
      </div>
      <label>${t('oldPrice')}</label><input id="adminProdOldPrice" type="number" placeholder="${t('oldPricePlaceholder')}" step="0.01">
      <label>${t('productImage')}</label><input id="adminProdImage" placeholder="${t('productImagePlaceholder')}">
      <label>${t('productDesc')}</label><textarea id="adminProdDesc" rows="2" placeholder="${t('productDescPlaceholder')}"></textarea>
      <button id="saveProductBtn" class="btn btn-gold mt-2" style="width:100%;">✅ ${t('save')}</button>
    </div>

    <div class="card mt-2">
      <h3>📋 ${t('existingProducts')} (${totalProducts})</h3>
      <div id="adminProductList">
        ${products.length === 0 ? `<p>${t('noProductsAdmin')}</p>` : products.map(p => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem 0; border-bottom:1px solid #eee;">
            <div style="display:flex; align-items:center; gap:1rem;">
              <img src="${p.image || 'logo.jpeg'}" style="width:40px; height:40px; object-fit:cover; border-radius:8px;" onerror="this.src='logo.jpeg'">
              <span><strong>${p.name}</strong> - ${formatPrice(p.price)}</span>
            </div>
            <button class="btn btn-danger btn-sm delete-product" data-id="${p.id}">🗑️</button>
          </div>`).join('')}
      </div>
    </div>

    <div class="card mt-2">
      <h3>🕐 ${t('recentOrders')} (${totalOrders})</h3>
      <div id="adminOrderList">
        ${orders.length === 0 ? `<p>${t('noOrdersAdmin')}</p>` : orders.slice(0, 10).map(o => `
          <div style="padding:1.2rem; border:1px solid #eee; border-radius:12px; margin-bottom:1rem; background:#fcfcfc;">
            <div style="display:flex; justify-content:space-between; flex-wrap:wrap; margin-bottom:0.5rem;">
              <strong style="font-size:1.1rem; color:var(--blue-deep);">${o.productName}</strong>
              <select class="status-select" data-order-id="${o.id}" style="width:auto; padding:0.4rem; border-radius:8px; background:white;">
                <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>⏳ ${t('pending')}</option>
                <option value="confirmed" ${o.status === 'confirmed' ? 'selected' : ''}>✅ ${t('confirmed')}</option>
                <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>🚚 ${t('delivered')}</option>
                <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>❌ ${t('cancelled')}</option>
              </select>
            </div>
            <div style="font-size:0.9rem; color:var(--text-soft); margin-bottom:0.5rem;">
              <div>💰 <strong>${formatPrice(o.price)}</strong> | 👤 ${o.userName || o.userEmail || t('clientLabel')}</div>
              <div>📍 ${o.address} | 📞 ${o.phone || '---'}</div>
            </div>
            ${o.items ? `<div style="font-size:0.8rem; background:#fff; padding:0.5rem; border-radius:8px; margin-bottom:0.5rem; border:1px dashed #ccc;">
              <strong>Articles:</strong> ${o.items.map(it => it.name).join(', ')}
            </div>` : ''}
            <div style="display:flex; gap:0.5rem;">
              <input id="delay-${o.id}" placeholder="${t('delayPlaceholder')}" value="${o.deliveryEstimate || ''}" style="margin:0; padding:0.4rem 0.8rem; flex:1;">
              <button class="btn btn-success btn-sm update-delay" data-id="${o.id}" style="border-radius:25px;">⏱️</button>
            </div>
          </div>`).join('')}
      </div>
    </div>
    <div id="adminClientsList" class="card mt-2 hidden"><h3>👥 ${t('manageClients')} (${allUsers.length})</h3>${allUsers.map(u => `<div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid #eee;"><div><strong>${u.displayName || u.email}</strong><span class="badge ${u.role === 'admin' ? 'badge-success' : ''}" style="margin-left:0.5rem;">${u.role}</span></div><button class="btn btn-sm ${u.role === 'admin' ? 'btn-danger' : 'btn-gold'} toggle-role" data-uid="${u.id}" data-role="${u.role}">${u.role === 'admin' ? t('makeClient') : t('makeAdmin')}</button></div>`).join('')}</div>
    <div id="adminSendNotifForm" class="card mt-2 hidden"><h3>🔔 ${t('sendNotification')}</h3><input id="notifTitle" placeholder="${t('notificationTitle')}"><textarea id="notifMessage" placeholder="${t('notificationMessage')}"></textarea><button id="sendNotifBtn" class="btn btn-gold mt-2">📤 ${t('sendNotification')}</button></div>
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
  app.innerHTML = `
    <div class="card text-center">
      <h1 style="color:var(--blue-deep);">🏠 ${t('welcome')}</h1>
      <p style="font-size:1.2rem;">${t('slogan')}</p>
      <div id="homePromo"></div>
      <button class="btn btn-gold mt-2" id="goShopBtn">🛒 ${t('goShop')}</button>
    </div>
    <h2>🔥 ${t('featured')}</h2>
    <div class="grid" id="featuredProducts">
      ${Array(4).fill(0).map(() => `
        <div class="product-card skeleton">
          <div class="skeleton-img"></div>
          <div class="product-info">
            <div class="skeleton-text"></div>
            <div class="skeleton-text" style="width:60%;"></div>
          </div>
        </div>`).join('')}
    </div>`;

  await loadProducts();
  const specials = products.filter(p => p.oldPrice && p.oldPrice > p.price);
  const promoEl = document.getElementById('homePromo');
  if (promoEl && specials.length > 0) {
    promoEl.innerHTML = `<div class="special-offer-card mt-2" style="text-align:left;"><h3>🎉 ${t('specialPrice')}!</h3><p><strong>${specials[0].name}</strong> - $${specials[0].price} <span style="text-decoration:line-through;">$${specials[0].oldPrice}</span></p></div>`;
  }

  const grid = document.getElementById('featuredProducts');
  if (grid) {
    grid.innerHTML = products.length === 0 ? `<p>📦 ${t('noProducts')}</p>` : products.slice(0, 4).map(p => productCardHTML(p)).join('');
  }

  document.getElementById('goShopBtn')?.addEventListener('click', () => { currentView = 'shop'; renderView('shop'); });
  attachBuyButtons();
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
  try {
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    if (userDoc.exists) {
      userAddress = userDoc.data().address || '';
      userPhone = userDoc.data().phone || '';
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
          <div class="avatar">${currentUser.photoURL ? `<img src="${currentUser.photoURL}">` : initials}</div>
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
                <span style="font-weight:600; color:var(--blue-deep);">💰 ${formatPrice(o.price)}</span> | 
                <span>💳 ${o.payment}</span> | 
                <span>📍 ${o.address}</span>
              </div>
              ${o.deliveryEstimate ? `<div style="margin-top:0.5rem; font-size:0.85rem; font-weight:600; color:var(--success);">🚚 ${t('delivery')}: ${o.deliveryEstimate}</div>` : `<div style="margin-top:0.5rem; font-size:0.85rem; color:#f39c12;">⏳ ${t('waiting')}</div>`}
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
      document.querySelector('.avatar').innerHTML = (name || currentUser.email || 'U').substring(0, 2).toUpperCase();
    } catch (e) { showMessage(t('errorOccurred') + e.message, 'error'); }
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

function renderSettings(app) {
  app.innerHTML = `
    <div class="card-premium">
      <h2>⚙️ ${t('settings')}</h2>
      <div><label>🌍 ${t('language')}</label><select id="settingsLang" style="width:auto;"><option value="ht" ${currentLang === 'ht' ? 'selected' : ''}>🇭🇹 Kreyòl</option><option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>🇫🇷 Français</option><option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇺🇸 English</option><option value="es" ${currentLang === 'es' ? 'selected' : ''}>🇪🇸 Español</option></select></div>
      ${currentUser ? `<div style="margin-top:1.5rem; padding-top:1.5rem; border-top:1px solid #eee;"><h4>${t('accountInfo')}</h4><p><strong>${t('email')}:</strong> ${currentUser.email}</p><p><strong>${t('name')}:</strong> ${currentUser.displayName || '---'}</p><p><strong>${t('role')}:</strong> ${isAdmin ? 'Admin' : 'Client'}</p><p><strong>${t('emailVerified')}:</strong> ${currentUser.emailVerified ? '✅ ' + t('yes') : '❌ ' + t('no')}</p>${!currentUser.emailVerified ? `<button class="btn btn-gold btn-sm mt-2" id="resendVerifyEmail">📧 ${t('resendVerifyEmail')}</button>` : ''}</div>` : ''}
    </div>`;
  document.getElementById('settingsLang')?.addEventListener('change', (e) => { currentLang = e.target.value; document.getElementById('langSwitch').value = currentLang; applyLanguage(); });
  document.getElementById('resendVerifyEmail')?.addEventListener('click', async () => { if (currentUser) { await currentUser.sendEmailVerification(); showMessage(t('emailVerifySent'), 'success'); } });
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
      document.getElementById('modalProductName').textContent = product.name;
      document.getElementById('modalProductPrice').textContent = formatPrice(product.price);
      document.getElementById('productDetailsContent').innerHTML = `<p style="margin:1rem 0; color:var(--text-soft);">${product.description || ''}</p>`;
      document.getElementById('buyModal').classList.remove('hidden');

      try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists && userDoc.data().address) {
          document.getElementById('orderAddress').value = userDoc.data().address;
        } else {
          document.getElementById('orderAddress').value = '';
        }
        renderReviews(product.id);
      } catch (e) { document.getElementById('orderAddress').value = ''; }
    });
  });
}

// Event Listeners Panier
document.getElementById('cartBtn')?.addEventListener('click', () => {
  document.getElementById('cartModal').classList.remove('hidden');
  renderCart();
});

document.getElementById('notifBtn')?.addEventListener('click', () => {
  currentView = 'notifications';
  renderNotificationsModal();
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
    await db.collection('orders').add({
      userId: currentUser.uid, userEmail: currentUser.email,
      userName: userData.displayName || currentUser.displayName || 'Client',
      address: userData.address, phone: userData.phone,
      items: cart.map(item => ({ id: item.id, name: item.name, price: item.price })),
      productName: cart.length > 1 ? `${cart[0].name} + ${cart.length - 1}` : cart[0].name,
      price: totalPrice, currency: currentCurrency, status: 'pending',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
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
// DÉMARRAGE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Total Lakay - Version Ultime avec Recherche & Filtres');
  applyLanguage();

  document.getElementById('linkServices')?.addEventListener('click', (e) => {
    e.preventDefault(); renderView('services');
    window.scrollTo(0, 0);
  });
  document.getElementById('linkPrivacy')?.addEventListener('click', (e) => {
    e.preventDefault(); renderView('privacy');
    window.scrollTo(0, 0);
  });
  document.getElementById('linkTerms')?.addEventListener('click', (e) => {
    e.preventDefault(); renderView('terms');
    window.scrollTo(0, 0);
  });

  renderView('home');
});
