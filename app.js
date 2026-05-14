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
    mostRecent: "Pi resan",
    priceLowToHigh: "Pri: Ba → Wo",
    priceHighToLow: "Pri: Wo → Ba",
    categoryElectronics: "📱 Elektwonik",
    categoryClothing: "👕 Vètman ak Akseswa",
    categorySchool: "🎓 Lekòl",
    categoryWork: "💼 Travay",
    categoryHome: "🏠 Kay",
    categoryBeauty: "💄 Bote",
    categoryOther: "📦 Lòt",
    categoryClothingAccessories: "👕 Vètman ak Akseswa",
    categorySchoolOffice: "🎓 Lekòl ak Travay",
    categoryHomePersonal: "🏠 Kay ak Pèsonèl",
    categoryElectronicsTech: "📱 Elektwonik",
    balance: "Balans",
    myBalance: "Balans ou",
    refund: "Lajan Rembourse",
    onlineClients: "Kliyan an liy",
    moncashSettings: "Anviwònman MonCash (Peman Reyèl)",
    saveConfig: "Anrejistre Konfigirasyon",
    linkMoncash: "Konekte kont MonCash ou",
    moncashPhone: "Nimewo MonCash ou",
    moncashTerms: "Mwen aksepte kondisyon itilizasyon MonCash ak règleman konfidansyalite nou an",
    aiAssistant: "Asistan IA",
    aiPageTitle: "Konvèsasyon ak IA",
    aiPageDesc: "Poze asistan entèlijan nou an nenpòt kesyon sou platfòm lan oswa sou pwodui nou yo.",
    aiWelcome: "Bonjou! Kouman mwen ka ede w jodi a?",
    aiInputPlaceholder: "Ekri mesaj ou a...",
    aiError: "Mwen gen yon ti pwoblèm koneksyon. Tanpri eseye ankò.",
    aiTyping: "🤔 Analize...",
    aiLoginRequiredDesc: "Ou dwe konekte pou w ka pale ak asistan entèlijan nou an.",
    connect: "Konekte",
    connected: "Konekte ak siksè",
    termsConsentTitle: "Kondisyon Itilizasyon",
    termsConsentDesc: "Pou w ka kontinye sèvi ak Total Lakay, ou dwe aksepte kondisyon itilizasyon nou yo ak politik konfidansyalite nou an.",
    accept: "Aksepte", decline: "Refize",
    cancellationReason: "Rezon anilasyon", reasonPlaceholder: "Poukisa ou anile kòmand sa?",
    reasonRequired: "Ou dwe bay yon rezon pou anilasyon an.",
    recentProducts: "Pwodui Resan", categoriesTitle: "Kategori yo", exploreCategories: "Eksplore tout kategori nou yo",
    school: "Lekòl", work: "Travay", home: "Kay", electronics: "Elektwonik", beauty: "Bote", clothing: "Vètman",
    stock: "Kantite nan stòk", category: "Kategori", colors: "Koulè (separe ak vigil)", sizes: "Gwosè / Size (separe ak vigil)",
    selectColor: "Chwazi Koulè", selectSize: "Chwazi Gwosè", quantity: "Kantite", outOfStock: "Pa gen nan stòk ankò",
    servicesTitle: "Sèvis nou yo", privacyTitle: "Konfidansyalite", termsTitle: "Kondisyon yo",
    phoneRecommend: "Nimewo telefòn ou", addressRecommend: "Adrès ou konplè", phoneRequired: "Telefòn obligatwa",
    cart: "Panyen", checkout: "Peye kounye a", securePaymentInfo: "Peman 100% sekirize",
    profile: "Profil", phone: "Telefòn", phonePlaceholder: "Ex: +509 1234 5678",
    updateProfile: "Mete ajou profil", profileUpdated: "Profil mete ajou ak siksè!",
    phoneNumber: "Nimewo telefòn", saveProfile: "Anrejistre Profil",
    addressRecommend: "Adrès (Rekòmande)", phoneRecommend: "Telefòn (Rekòmande)",
    addToCart: "Ajoute nan panyen", removeFromCart: "Retire",
    notifSettings: "Paramèt Notifikasyon", notifPushEnable: "Aktive notifikasyon sou telefòn",
    notifNewProducts: "Nouvo Pwodui", notifSpecialPrices: "Pri Spesyal & Pwomo",
    notifUpdates: "Mizajou sou sit la", notifStatus: "Estati Notifikasyon",
    notifBlocked: "Bloke pa navigatè a", notifGranted: "Otorize",
    notifRequest: "Otorize kounye a", notifSave: "Anrejistre preferans",
    notifPreferencesSaved: "Preferans notifikasyon anrejistre!",
    total: "Total", emptyCart: "Panyen ou vid",
    securePayment: "Peman Sekirize", contactUs: "Kontakte nou",
    favorites: "Favori", noFavorites: "Pa gen favori ankò",
    reviews: "Avi", leaveReview: "Kite yon avi", addReview: "Ajoute yon avi", noReviews: "Pa gen avi ankò",
    rating: "Nòt", comment: "Kòmantè", submit: "Voye", invalidAddress: "Adrès ou antre a pa valab",
    ratingError: "Chwazi yon nòt (zetwal)", commentError: "Ekri yon kòmantè", reviewSuccess: "Mèsi pou avi ou!", reviewError: "Erè voye avi",
    servicesIntro: "Total Lakay sèvi ak teknoloji dènye kri pou ba ou pi bon eksperyans lan :",
    servicesOnline: "Vant ak IA :",
    servicesOnlineDesc: "Yon asistan entèlijan ki ede w jwenn sa w bezwen epi rekòmandasyon pèsonalize.",
    servicesDelivery: "Livrezon ak PWA :",
    servicesDeliveryDesc: "Aksè rapid sou sit la menm lè ou pa gen entènèt, ak notifikasyon an tan reyèl.",
    servicesCustomer: "Sipò 24/7 :",
    servicesCustomerDesc: "Nou disponib via WhatsApp ak asistan IA nou an pou reponn tout kesyon ou yo.",
    servicesSecure: "Peman MonCash :",
    servicesSecureDesc: "Peman rapid epi sekirize ak sistèm MonCash la dirèkteman sou platfòm lan.",
    privacyIntro: "Nan Total Lakay, nou pwoteje done ou yo ak entèlijans atifisyèl :",
    privacyData: "Kolek done :",
    privacyDataDesc: "Nou kolekte sèlman enfòmasyon ki nesesè pou livrezon ou yo (non, adrès, telefòn).",
    privacySecurity: "Sekirite ak IA :",
    privacySecurityDesc: "Nou itilize IA pou detekte fwod epi asire tranzaksyon ou yo fèt an sekirite.",
    privacySharing: "Konfidansyalite :",
    privacySharingDesc: "Done ou yo chiffres epi yo pa janm pataje ak twazyèm pati san konsantman w.",
    privacyRights: "Dwa w yo :",
    privacyRightsDesc: "Ou ka efase oswa modifye enfòmasyon ou yo nenpòt kilè nan pwofil ou.",
    termsIntro: "Lè w itilize Total Lakay, ou asepte kondisyon sa yo :",
    termsAccount: "Kont ak Sekirite :",
    termsAccountDesc: "Ou responsab sekirite modpas ou ak tout aktivite ki fèt sou kont ou an.",
    termsPurchase: "Acha ak IA :",
    termsPurchaseDesc: "Sistèm IA nou an analize chak kòmand pou evite fwod. Tout acha final sof si gen domaj.",
    termsPrice: "Pri ak Pwodwi :",
    termsPriceDesc: "Pri yo ka chanje san avètisman. Nou fè efò pou deskripsyon yo toujou egzak.",
    termsMod: "Mizajou :",
    termsModDesc: "Total Lakay ka modifye kondisyon sa yo epi n ap voye notifikasyon pou fè w konnen.",
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
    welcomeBack: "Bienvenue !", welcomeAdmin: "Bienvenue Admin !",
    accountCreated: "Compte créé avec succès !", loggedOut: "Déconnexion réussie",
    productAdded: "Produit ajouté !", productUpdated: "Produit mis à jour !",
    productDeleted: "Produit supprimé", delayUpdated: "Délai de livraison mis à jour !",
    statusUpdated: "Statut mis à jour !", delayRequired: "Entrez un délai de livraison",
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
    mostRecent: "Le plus récent",
    priceLowToHigh: "Prix : Bas → Haut",
    priceHighToLow: "Prix : Haut → Bas",
    categoryElectronics: "📱 Électronique",
    categoryClothing: "👕 Vêtements & Accessoires",
    categorySchool: "🎓 École",
    categoryWork: "💼 Travail",
    categoryHome: "🏠 Maison",
    categoryBeauty: "💄 Beauté",
    categoryOther: "📦 Autres",
    categoryClothingAccessories: "👕 Vêtements & Accessoires",
    categorySchoolOffice: "🎓 École & Travail",
    categoryHomePersonal: "🏠 Maison & Personnel",
    categoryElectronicsTech: "📱 Électronique",
    balance: "Solde",
    myBalance: "Votre solde",
    refund: "Argent Remboursé",
    onlineClients: "Clients en ligne",
    moncashSettings: "Paramètres MonCash (Paiement Réel)",
    saveConfig: "Enregistrer la Configuration",
    linkMoncash: "Lier votre compte MonCash",
    moncashPhone: "Votre numéro MonCash",
    moncashTerms: "J'accepte les conditions d'utilisation et la politique de confidentialité de MonCash",
    aiAssistant: "Assistant IA",
    aiPageTitle: "Conversation avec l'IA",
    aiPageDesc: "Posez à notre assistant intelligent toutes vos questions sur la plateforme ou sur nos produits.",
    aiWelcome: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    aiInputPlaceholder: "Écrivez votre message...",
    aiError: "J'ai un petit problème de connexion. Veuillez réessayer.",
    aiTyping: "🤔 Analyse...",
    aiLoginRequiredDesc: "Vous devez être connecté pour discuter avec notre assistant intelligent.",
    connect: "Lier",
    connected: "Lié avec succès",
    termsConsentTitle: "Conditions d'Utilisation",
    termsConsentDesc: "Pour continuer à utiliser Total Lakay, vous devez accepter nos conditions d'utilisation et notre politique de confidentialité.",
    accept: "Accepter", decline: "Refuser",
    cancellationReason: "Raison de l'annulation", reasonPlaceholder: "Pourquoi annulez-vous cette commande ?",
    reasonRequired: "Vous devez fournir une raison pour l'annulation.",
    recentProducts: "Produits Récents", categoriesTitle: "Catégories", exploreCategories: "Explorez toutes nos catégories",
    school: "École", work: "Travail", home: "Maison", electronics: "Électronique", beauty: "Beauté", clothing: "Vêtements",
    stock: "Quantité en stock", category: "Catégorie", colors: "Couleurs (séparées par virgule)", sizes: "Tailles / Sizes (séparées par virgule)",
    selectColor: "Choisir Couleur", selectSize: "Choisir Taille", quantity: "Quantité", outOfStock: "Rupture de stock",
    servicesTitle: "Nos Services", privacyTitle: "Confidentialité", termsTitle: "Conditions",
    phoneRecommend: "Votre numéro de téléphone", addressRecommend: "Votre adresse complète", phoneRequired: "Téléphone requis",
    cart: "Panier", checkout: "Payer maintenant", securePaymentInfo: "Paiement 100% sécurisé",
    profile: "Profil", phone: "Téléphone", phonePlaceholder: "Ex : +509 1234 5678",
    updateProfile: "Mettre à jour le profil", profileUpdated: "Profil mis à jour avec succès !",
    phoneNumber: "Numéro de téléphone", saveProfile: "Enregistrer le Profil",
    addressRecommend: "Adresse (Recommandé)", phoneRecommend: "Téléphone (Recommandé)",
    addToCart: "Ajouter au panier", removeFromCart: "Retirer",
    notifSettings: "Paramètres de Notifications", notifPushEnable: "Activer les notifications push",
    notifNewProducts: "Nouveaux Produits", notifSpecialPrices: "Prix Spéciaux & Promos",
    notifUpdates: "Mises à jour du site", notifStatus: "Statut des Notifications",
    notifBlocked: "Bloqué par le navigateur", notifGranted: "Autorisé",
    notifRequest: "Autoriser maintenant", notifSave: "Enregistrer les préférences",
    notifPreferencesSaved: "Préférences de notifications enregistrées !",
    accountInfo: "Informations du Compte", email: "Email", name: "Nom", role: "Rôle", emailVerified: "Email Vérifié",
    yes: "Oui", no: "Non", resendVerifyEmail: "Renvoyer l'email de vérification",
    total: "Total", emptyCart: "Votre panier est vide",
    securePayment: "Paiement Sécurisé", contactUs: "Contactez-nous",
    favorites: "Favoris", noFavorites: "Pas encore de favoris",
    reviews: "Avis", leaveReview: "Laisser un avis", addReview: "Ajouter un avis", noReviews: "Pas encore d'avis",
    rating: "Note", comment: "Commentaire", submit: "Envoyer", invalidAddress: "Adresse invalide",
    ratingError: "Choisissez une note (étoiles)", commentError: "Écrivez un commentaire", reviewSuccess: "Merci pour votre avis !", reviewError: "Erreur d'envoi",
    servicesIntro: "Total Lakay utilise les dernières technologies pour vous offrir une expérience d'achat inégalée :",
    servicesOnline: "Vente avec IA :",
    servicesOnlineDesc: "Un assistant intelligent pour vous guider et des recommandations basées sur vos goûts.",
    servicesDelivery: "Expérience PWA :",
    servicesDeliveryDesc: "Application installable avec accès hors-ligne et notifications instantanées.",
    servicesCustomer: "Support Premium :",
    servicesCustomerDesc: "Assistance 24/7 via WhatsApp et notre IA pour toutes vos préoccupations.",
    servicesSecure: "Paiements MonCash :",
    servicesSecureDesc: "Intégration directe de MonCash pour des transactions locales rapides et sécurisées.",
    privacyIntro: "Chez Total Lakay, nous protégeons vos données avec l'aide de l'IA :",
    privacyData: "Collecte Minimale :",
    privacyDataDesc: "Nous ne collectons que les informations essentielles au traitement de vos commandes.",
    privacySecurity: "Sécurité Avancée :",
    privacySecurityDesc: "Utilisation de l'IA pour la détection des fraudes et la protection de vos transactions.",
    privacySharing: "Confidentialité Totale :",
    privacySharingDesc: "Vos données sont cryptées et ne sont jamais partagées sans votre accord explicite.",
    privacyRights: "Contrôle Total :",
    privacyRightsDesc: "Modifiez ou supprimez vos données à tout moment depuis votre profil.",
    termsIntro: "En utilisant Total Lakay, vous acceptez nos conditions générales :",
    termsAccount: "Responsabilité :",
    termsAccountDesc: "Vous êtes garant de la sécurité de votre compte et de vos accès.",
    termsPurchase: "Vérification IA :",
    termsPurchaseDesc: "Chaque commande est analysée par notre IA pour garantir la sécurité du vendeur et de l'acheteur.",
    termsPrice: "Exactitude :",
    termsPriceDesc: "Nous nous efforçons d'afficher des prix et des descriptions exacts en temps réel.",
    termsMod: "Évolution :",
    termsModDesc: "Nos conditions peuvent évoluer ; vous serez informé par notification push.",
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
    mostRecent: "Más reciente",
    priceLowToHigh: "Precio: Bajo → Alto",
    priceHighToLow: "Precio: Alto → Bajo",
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
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px;">
      <span style="font-size:1.2rem;">${type === 'success' ? '✅' : type === 'info' ? 'ℹ️' : '⚠️'}</span>
      <span>${message}</span>
    </div>
  `;
  toast.style.cssText = `
    position:fixed; bottom:30px; right:30px;
    background: ${type === 'success' ? 'var(--blue-deep)' : type === 'info' ? 'var(--blue-medium)' : 'var(--danger)'};
    color:white; padding:16px 24px; border-radius:var(--radius);
    font-weight:600; z-index:3000;
    box-shadow: var(--shadow-xl);
    border-left: 5px solid ${type === 'success' ? 'var(--gold)' : 'white'};
    animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'var(--transition)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
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
// MENU DROPDOWN
// ============================================
document.getElementById('navShop')?.addEventListener('click', (e) => {
  e.stopPropagation();
  renderView('shop');
});

document.getElementById('navAI')?.addEventListener('click', (e) => {
  e.stopPropagation();
  renderView('aiPage');
});

document.getElementById('menuAI')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('dropdownMenu')?.classList.add('hidden');
  renderView('aiPage');
});

document.getElementById('menuBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const dropdown = document.getElementById('dropdownMenu');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
    // Mettre à jour les sélecteurs mobiles avec les valeurs actuelles
    const lsM = document.getElementById('langSwitchMobile');
    const csM = document.getElementById('currencySwitchMobile');
    if (lsM) lsM.value = currentLang;
    if (csM) csM.value = currentCurrency;
  }
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
document.getElementById('menuHome')?.addEventListener('click', (e) => {
  e.preventDefault(); document.getElementById('dropdownMenu')?.classList.add('hidden');
  renderView(isAdmin ? 'admin' : 'home');
});
document.getElementById('menuShop')?.addEventListener('click', (e) => {
  e.preventDefault(); document.getElementById('dropdownMenu')?.classList.add('hidden');
  renderView('shop');
});

function renderSpecialOffers(app) {
  const promoProducts = products.filter(p => p.oldPrice && p.oldPrice > p.price);
  app.innerHTML = `
    <div class="shop-hero" style="background:var(--gold-gradient); padding:60px 0; text-align:center; color:var(--blue-deep); margin-bottom:40px;">
      <h1 style="font-size:2.5rem; font-weight:900; margin-bottom:10px;">🔥 ${t('specialOffers')}</h1>
      <p style="font-size:1.1rem; font-weight:600;">Pwofite pi bon rabè nou yo !</p>
    </div>
    <div class="container">
      <div class="grid">
        ${promoProducts.length === 0 ? `<p class="text-center" style="grid-column:1/-1;">${t('noSpecialOffers')}</p>` : promoProducts.map(p => productCardHTML(p)).join('')}
      </div>
    </div>`;
  attachBuyButtons();
}

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

  const searchTerm = (document.getElementById('searchInput') || document.getElementById('shopSearchInput'))?.value?.toLowerCase()?.trim() || '';
  const category = (document.getElementById('categoryFilter') || document.getElementById('shopCategoryFilter'))?.value || 'all';
  const priceMin = parseFloat(document.getElementById('priceMin')?.value) || 0;
  const priceMax = parseFloat(document.getElementById('priceMax')?.value) || Infinity;
  const sortBy = (document.getElementById('sortBy') || document.getElementById('sortFilter'))?.value || 'recent';

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
    case 'recent': filtered.sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0)); break;
    case 'low': filtered.sort((a, b) => a.price - b.price); break;
    case 'high': filtered.sort((a, b) => b.price - a.price); break;
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

  const searchInput = document.getElementById('searchInput') || document.getElementById('shopSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => refreshProductGrid(), 500));
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
  const category = product.category || 'Shop';
  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-img-container">
        ${hasPromo ? `<div class="product-badge">🔥 ${t('specialPrice')}</div>` : ''}
        <button class="wishlist-btn ${favorites.includes(product.id) ? 'active' : ''}" onclick="toggleFavorite('${product.id}')">
          <i class="fas fa-heart"></i> ❤️
        </button>
        <img src="${product.image || 'logo.jpeg'}" alt="${gt(product.name)}" class="product-img" loading="lazy" onerror="this.src='logo.jpeg'">
      </div>
      <div class="product-info">
        <div class="product-category">${t('category' + category.charAt(0).toUpperCase() + category.slice(1)) || category}</div>
        <div class="product-title">${gt(product.name)}</div>
        <div class="product-price-row">
          <div class="product-price">${formatPrice(product.price)}</div>
          ${hasPromo ? `<div class="old-price">${formatPrice(product.oldPrice)}</div>` : ''}
        </div>
        <div style="display:flex; gap:10px; margin-top:auto;">
          <button class="btn-gold add-cart-btn" data-product-id="${product.id}" style="flex:1; padding:8px 12px; font-size:0.85rem;">🛒 ${t('addToCart')}</button>
          <button class="btn-outline buy-now-btn" data-product-id="${product.id}" style="padding:8px 15px;">⚡</button>
        </div>
      </div>
    </div>`;
}

async function renderAdminDashboard(app) {
  if (!isAdmin) { app.innerHTML = `<div class="card text-center"><p>⛔ ${t('adminOnly')}</p></div>`; return; }
  await loadMoncashConfig();
  await loadAllData();
  const onlineCount = await getOnlineUsersCount();
  setTimeout(() => {
    const el = document.getElementById('onlineCountAdmin');
    if (el) el.textContent = onlineCount;
  }, 100);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalClients = allUsers.filter(u => u.role === 'client').length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.filter(o => o.status === 'confirmed' || o.status === 'delivered').reduce((sum, o) => sum + (o.price || 0), 0);

  app.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
      <h2 style="margin:0; font-size:2rem;">📊 ${t('dashboard')}</h2>
      <div style="background:var(--gold-gradient); color:var(--blue-deep); padding:8px 20px; border-radius:30px; font-weight:800; box-shadow:var(--shadow-gold);">
        👑 ${t('welcomeAdmin')}
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:20px; margin-bottom:40px;">
      <div class="admin-stat-card" style="background:var(--white); padding:25px; border-radius:var(--radius-lg); border-left:5px solid var(--gold); box-shadow:var(--shadow-md);">
        <div style="font-size:2rem; font-weight:900; color:var(--blue-deep);">${totalProducts}</div>
        <div style="color:var(--text-soft); font-weight:600; font-size:0.9rem;">📦 ${t('totalProducts')}</div>
      </div>
      <div class="admin-stat-card" style="background:var(--white); padding:25px; border-radius:var(--radius-lg); border-left:5px solid var(--success); box-shadow:var(--shadow-md);">
        <div style="font-size:2rem; font-weight:900; color:var(--blue-deep);">${totalOrders}</div>
        <div style="color:var(--text-soft); font-weight:600; font-size:0.9rem;">📋 ${t('totalOrders')}</div>
      </div>
      <div class="admin-stat-card" style="background:var(--white); padding:25px; border-radius:var(--radius-lg); border-left:5px solid var(--blue-light); box-shadow:var(--shadow-md);">
        <div style="font-size:2rem; font-weight:900; color:var(--blue-deep);">${totalClients}</div>
        <div style="color:var(--text-soft); font-weight:600; font-size:0.9rem;">👥 ${t('totalClients')}</div>
      </div>
      <div class="admin-stat-card" id="onlineStatsCard" style="background:var(--white); padding:25px; border-radius:var(--radius-lg); border-left:5px solid #f39c12; box-shadow:var(--shadow-md); cursor:pointer;">
        <div id="onlineCountAdmin" style="font-size:2rem; font-weight:900; color:var(--blue-deep);">${onlineCount}</div>
        <div style="color:var(--text-soft); font-weight:600; font-size:0.9rem;">🟢 ${t('onlineClients')}</div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:30px; margin-bottom:40px;">
      <div class="card-premium" style="background:var(--white); padding:30px; border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); border:1px solid var(--gray-200);">
        <h3 style="margin-bottom:20px;">💰 ${t('revenue')} & MonCash</h3>
        <div style="font-size:2rem; font-weight:900; color:var(--success); margin-bottom:20px;">${formatPrice(totalRevenue)}</div>
        <div style="display:flex; flex-direction:column; gap:15px; border-top:1px solid #eee; pt-20">
          <div>
            <label style="display:block; margin-bottom:8px; font-weight:600; color:var(--text-soft);">Client ID</label>
            <input id="mcClientId" class="search-input" style="width:100%; background:var(--gray-100);" value="${moncashConfig.clientId || ''}" placeholder="Client ID MonCash" />
          </div>
          <div>
            <label style="display:block; margin-bottom:8px; font-weight:600; color:var(--text-soft);">Client Secret</label>
            <input id="mcClientSecret" class="search-input" style="width:100%; background:var(--gray-100);" type="password" value="${moncashConfig.clientSecret || ''}" placeholder="Client Secret" />
          </div>
          <button id="saveMcConfig" class="btn-gold" style="width:100%; padding:15px;">💾 ${t('saveConfig')}</button>
        </div>
      </div>

      <div class="card-premium" style="background:var(--white); padding:30px; border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); border:1px solid var(--gray-200);">
        <h3 style="margin-bottom:20px;">⚡ ${t('quickActions')}</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
          <button class="btn-gold" id="adminAddProductBtn">➕ ${t('addProduct')}</button>
          <button class="btn-outline" id="adminManageOrdersBtn">📦 ${t('manageOrders')}</button>
          <button class="btn-outline" id="adminManageClientsBtn">👥 ${t('manageClients')}</button>
          <button class="btn-outline" id="adminSendNotifBtn">🔔 ${t('sendNotification')}</button>
        </div>
      </div>
    </div>

    <!-- MODAL ADD PRODUCT -->
    <div id="adminAddProductForm" class="modal hidden">
      <div class="modal-content" style="max-width:800px;">
        <span class="close-modal" onclick="this.closest('.modal').classList.add('hidden')">&times;</span>
        <h2 style="margin-bottom:20px;">➕ ${t('addProduct')}</h2>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
          <div><label style="display:block; margin-bottom:8px;">${t('productName')}</label><input id="adminProdName" class="search-input" style="width:100%;" placeholder="${t('productNamePlaceholder')}"></div>
          <div><label style="display:block; margin-bottom:8px;">${t('productPrice')} (G)</label><input id="adminProdPrice" class="search-input" style="width:100%;" type="number" placeholder="${t('productPricePlaceholder')}"></div>
          <div><label style="display:block; margin-bottom:8px;">${t('oldPrice')} (Promo)</label><input id="adminProdOldPrice" class="search-input" style="width:100%;" type="number" placeholder="Ansyen pri"></div>
          <div>
            <label style="display:block; margin-bottom:8px;">${t('category')}</label>
            <select id="adminProdCategory" class="filter-select" style="width:100%;">
              <option value="clothing">${t('categoryClothingAccessories')}</option>
              <option value="school">${t('categorySchoolOffice')}</option>
              <option value="home">${t('categoryHomePersonal')}</option>
              <option value="electronics">${t('categoryElectronicsTech')}</option>
            </select>
          </div>
          <div><label style="display:block; margin-bottom:8px;">${t('stock')}</label><input id="adminProdStock" class="search-input" style="width:100%;" type="number" placeholder="0"></div>
          <div><label style="display:block; margin-bottom:8px;">${t('productImage')} (URL)</label><input id="adminProdImage" class="search-input" style="width:100%;" placeholder="${t('productImagePlaceholder')}"></div>
        </div>
        <div style="margin-top:20px;">
          <label style="display:block; margin-bottom:8px;">${t('productDesc')}</label>
          <textarea id="adminProdDesc" class="search-input" style="width:100%; height:100px;" placeholder="${t('productDescPlaceholder')}"></textarea>
        </div>
        <button id="saveProductBtn" class="btn-gold mt-2" style="width:100%; padding:15px;">✅ ${t('save')}</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: 1fr 1.5fr; gap:30px;">
      <!-- PRODUCT LIST -->
      <div class="card-premium" style="background:var(--white); padding:25px; border-radius:var(--radius-lg); border:1px solid var(--gray-200);">
        <h3 style="margin-bottom:20px;">📦 ${t('existingProducts')}</h3>
        <div id="adminProductList" style="max-height:600px; overflow-y:auto; padding-right:10px;">
          ${products.map(p => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:15px 0; border-bottom:1px solid var(--gray-100);">
              <div style="display:flex; align-items:center; gap:12px;">
                <img src="${p.image || 'logo.jpeg'}" style="width:45px; height:45px; object-fit:cover; border-radius:8px; border:1px solid var(--gray-200);">
                <div>
                  <div style="font-weight:700; color:var(--blue-deep);">${gt(p.name)}</div>
                  <div style="font-size:0.85rem; color:var(--gold); font-weight:600;">${formatPrice(p.price)}</div>
                </div>
              </div>
              <button class="wishlist-btn delete-product" data-id="${p.id}" style="color:var(--danger); background:rgba(239, 68, 68, 0.1);">🗑️</button>
            </div>`).join('')}
        </div>
      </div>

      <!-- ORDER LIST -->
      <div class="card-premium" id="orderManagementSection" style="background:var(--white); padding:25px; border-radius:var(--radius-lg); border:1px solid var(--gray-200);">
        <h3 style="margin-bottom:20px;">📋 ${t('manageOrders')}</h3>
        <div id="adminOrderList" style="max-height:600px; overflow-y:auto; padding-right:10px;">
          ${orders.map(o => `
            <div style="padding:20px; border-radius:var(--radius); background:var(--white-soft); border:1px solid var(--gray-200); margin-bottom:15px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:10px;">
                <strong style="color:var(--blue-deep); font-size:1.05rem;">${o.productName}</strong>
                <select class="status-select filter-select" data-order-id="${o.id}" style="padding:5px 15px; font-size:0.8rem; border-radius:20px;">
                  <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>⏳ ${t('pending')}</option>
                  <option value="confirmed" ${o.status === 'confirmed' ? 'selected' : ''}>✅ ${t('confirmed')}</option>
                  <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>🚚 ${t('delivered')}</option>
                  <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>❌ ${t('cancelled')}</option>
                </select>
              </div>
              <div style="font-size:0.85rem; color:var(--text-soft); line-height:1.6; margin-bottom:15px;">
                <div>💰 <strong>${formatPrice(o.price)}</strong> | 👤 ${o.userEmail}</div>
                <div>📍 ${o.address} | 📞 ${o.phone || '---'}</div>
                ${o.items ? `<div style="margin-top:5px; padding:8px; background:white; border-radius:8px; border:1px dashed #ddd;"><strong>Articles:</strong> ${o.items.map(it => it.name).join(', ')}</div>` : ''}
              </div>
              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <input id="delay-${o.id}" class="search-input" style="flex:1; padding:8px 15px; font-size:0.8rem; border-radius:20px;" placeholder="${t('delayPlaceholder')}" value="${o.deliveryEstimate || ''}">
                <button class="btn-gold update-delay" data-id="${o.id}" style="padding:8px 15px; border-radius:20px;">⏱️</button>
                <button class="btn-outline refund-order-btn" data-id="${o.id}" data-user-id="${o.userId}" data-amount="${o.price}" style="color:var(--danger); border-color:var(--danger); padding:8px 15px; border-radius:20px;">💸 ${t('refund')}</button>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- CLIENT MANAGEMENT -->
    <div id="adminClientsList" class="card-premium hidden" style="margin-top:30px;">
      <h3 style="margin-bottom:20px;">👥 ${t('manageClients')} (${allUsers.length})</h3>
      <div style="max-height:400px; overflow-y:auto; padding-right:10px;">
        ${allUsers.map(u => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:15px 0; border-bottom:1px solid var(--gray-100);">
            <div>
              <strong style="color:var(--blue-deep);">${u.displayName || u.email}</strong>
              <span style="margin-left:10px; font-size:0.75rem; background:var(--gray-100); padding:3px 10px; border-radius:10px;">${u.role}</span>
            </div>
            <button class="btn-outline toggle-role" data-uid="${u.id}" data-role="${u.role}" style="padding:5px 15px; font-size:0.8rem;">
              ${u.role === 'admin' ? t('makeClient') : t('makeAdmin')}
            </button>
          </div>`).join('')}
      </div>
    </div>

    <!-- NOTIFICATIONS -->
    <div id="adminSendNotifForm" class="card-premium hidden" style="margin-top:30px;">
      <h3 style="margin-bottom:20px;">🔔 ${t('sendNotification')}</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
        <div>
          <label style="display:block; margin-bottom:8px; font-weight:600;">🎯 Destinataire</label>
          <select id="notifTarget" class="filter-select" style="width:100%;">
            <option value="all">📢 Tout moun</option>
            ${allUsers.map(u => `<option value="${u.id}">${u.displayName || u.email}</option>`).join('')}
          </select>
        </div>
        <div>
          <label style="display:block; margin-bottom:8px; font-weight:600;">🏷️ Titre</label>
          <input id="notifTitle" class="search-input" style="width:100%;" placeholder="${t('notificationTitle')}">
        </div>
      </div>
      <div style="margin-bottom:20px;">
        <label style="display:block; margin-bottom:8px; font-weight:600;">✉️ Mesaj</label>
        <textarea id="notifMessage" class="search-input" style="width:100%; height:100px;" placeholder="${t('notificationMessage')}"></textarea>
      </div>
      <button id="sendNotifBtn" class="btn-gold" style="width:100%; padding:15px;">📤 ${t('sendNotification')}</button>
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
    const category = document.getElementById('adminProdCategory')?.value;
    const stock = parseInt(document.getElementById('adminProdStock')?.value) || 0;
    const colorsRaw = document.getElementById('adminProdColors')?.value.trim();
    const sizesRaw = document.getElementById('adminProdSizes')?.value.trim();
    const image = document.getElementById('adminProdImage')?.value.trim();
    const description = document.getElementById('adminProdDesc')?.value.trim();

    if (!name || !price) { showMessage(t('fillAllFields'), 'error'); return; }

    const colors = colorsRaw ? colorsRaw.split(',').map(c => c.trim()) : [];
    const sizes = sizesRaw ? sizesRaw.split(',').map(s => s.trim()) : [];

    try {
      showMessage("Traduction automatique en cours...", "info");
      const [nameTrans, descTrans] = await Promise.all([
        getTranslations(name),
        getTranslations(description)
      ]);

      await db.collection('products').add({
        name: nameTrans,
        price, oldPrice, category, stock, colors, sizes,
        image: image || '',
        description: descTrans,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
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
      const orderId = e.target.dataset.orderId;
      const newStatus = e.target.value;
      const order = orders.find(o => o.id === orderId);
      const oldStatus = order ? order.status : 'pending';
      let reason = '';

      if (newStatus === 'cancelled') {
        reason = prompt(t('reasonPlaceholder'));
        if (!reason) {
          e.target.value = oldStatus;
          showMessage(t('reasonRequired'), 'error');
          return;
        }
      }

      try {
        await db.collection('orders').doc(orderId).update({
          status: newStatus,
          cancellationReason: reason || null
        });

        // Stock Decrement Logic
        if (newStatus === 'confirmed' && oldStatus !== 'confirmed' && order.productId) {
          const productRef = db.collection('products').doc(order.productId);
          const productDoc = await productRef.get();
          if (productDoc.exists) {
            const currentStock = productDoc.data().stock || 0;
            const orderQty = order.quantity || 1;
            await productRef.update({ stock: Math.max(0, currentStock - orderQty) });
            await loadProducts(true); // Refresh local products list
          }
        }

        showMessage(t('statusUpdated'), 'success');
        await loadAllOrders(); // Refresh orders to ensure UI is up to date
      } catch (error) { showMessage(t('errorOccurred') + error.message, 'error'); }
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
    const target = document.getElementById('notifTarget')?.value;
    const title = document.getElementById('notifTitle')?.value.trim();
    const reason = document.getElementById('notifReason')?.value.trim();
    const message = document.getElementById('notifMessage')?.value.trim();

    if (!title || !message) { showMessage(t('fillAllFields'), 'error'); return; }

    try {
      showMessage("Tradiksyon ak Voye nan kou...", "info");

      // Traduction automatique pour tous les champs
      const [titleTrans, reasonTrans, messageTrans] = await Promise.all([
        getTranslations(title),
        getTranslations(reason),
        getTranslations(message)
      ]);

      const notifData = {
        title: titleTrans,
        reason: reasonTrans,
        message: messageTrans,
        type: reason.toLowerCase().includes('promo') ? 'promo' : 'info',
        targetUserId: target === 'all' ? null : target,
        targetRole: target === 'all' ? 'all' : null,
        read: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('notifications').add(notifData);

      // Simulation Notification Push (Navigateur)
      if (Notification.permission === "granted") {
        new Notification(gt(titleTrans), {
          body: (reason ? gt(reasonTrans) + ": " : "") + gt(messageTrans),
          icon: 'logo.jpeg'
        });
      }

      showMessage(t('notifSent'), 'success');
      document.getElementById('notifTitle').value = '';
      document.getElementById('notifReason').value = '';
      document.getElementById('notifMessage').value = '';
      document.getElementById('adminSendNotifForm').classList.add('hidden');
    } catch (e) { showMessage(t('errorOccurred') + e.message, 'error'); }
  });

  // Save MonCash Config
  document.getElementById('saveMcConfig')?.addEventListener('click', async () => {
    const clientId = document.getElementById('mcClientId').value.trim();
    const clientSecret = document.getElementById('mcClientSecret').value.trim();
    const mode = document.getElementById('mcMode').value;
    try {
      await db.collection('settings').doc('moncash').set({ clientId, clientSecret, mode, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
      moncashConfig = { clientId, clientSecret, mode };
      showMessage('✅ Konfigirasyon MonCash sove!', 'success');
    } catch (e) { showMessage('Erreur: ' + e.message, 'error'); }
  });

  // Refund Order
  document.querySelectorAll('.refund-order-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const orderId = e.currentTarget.dataset.id;
      const userId = e.currentTarget.dataset.userId;
      const amount = parseFloat(e.currentTarget.dataset.amount);
      if (confirm(`Eske w sèten ou vle anile epi remèt $${amount} bay kliyan an?`)) {
        await refundUser(userId, amount, orderId);
        await db.collection('orders').doc(orderId).update({ status: 'cancelled' });
        renderView('admin');
      }
    });
  });

  // Stats Card Presence Click
  document.getElementById('onlineStatsCard')?.addEventListener('click', () => {
    document.getElementById('presenceModal')?.classList.remove('hidden');
    renderPresenceList();
  });

  // Close Presence Modal
  document.getElementById('closePresenceModal')?.addEventListener('click', () => {
    document.getElementById('presenceModal')?.classList.add('hidden');
  });
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
    <div class="hero-section">
      <img src="logo.jpeg" alt="Total Lakay" class="hero-logo" onerror="this.style.display='none';">
      <h1 class="hero-title">🏠 ${t('welcome')}</h1>
      <p class="hero-subtitle">${t('slogan')}</p>
      <div id="homePromo"></div>
      <button class="btn-gold mt-2" id="goShopBtn" style="font-size:1.1rem; padding:15px 40px;">🛒 ${t('goShop')}</button>
    </div>

    <div class="container">
      <!-- CATEGORIES QUICK ACCESS -->
      <div class="category-section" style="padding: 60px 0;">
        <h2 style="text-align:center; margin-bottom:40px;">📁 ${t('categoriesTitle')}</h2>
        <div class="category-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:20px;">
          <div class="category-card" onclick="filterByCategory('school')" style="background:var(--white); padding:30px; border-radius:var(--radius-lg); text-align:center; box-shadow:var(--shadow-md); cursor:pointer; transition:var(--transition); border:1px solid var(--gray-200);">
            <div style="font-size:3rem; margin-bottom:15px;">🎓</div>
            <h4 style="color:var(--blue-deep);">${t('school')}</h4>
          </div>
          <div class="category-card" onclick="filterByCategory('home')" style="background:var(--white); padding:30px; border-radius:var(--radius-lg); text-align:center; box-shadow:var(--shadow-md); cursor:pointer; transition:var(--transition); border:1px solid var(--gray-200);">
            <div style="font-size:3rem; margin-bottom:15px;">🏠</div>
            <h4 style="color:var(--blue-deep);">${t('home')}</h4>
          </div>
          <div class="category-card" onclick="filterByCategory('clothing')" style="background:var(--white); padding:30px; border-radius:var(--radius-lg); text-align:center; box-shadow:var(--shadow-md); cursor:pointer; transition:var(--transition); border:1px solid var(--gray-200);">
            <div style="font-size:3rem; margin-bottom:15px;">👕</div>
            <h4 style="color:var(--blue-deep);">${t('clothing')}</h4>
          </div>
          <div class="category-card" onclick="filterByCategory('electronics')" style="background:var(--white); padding:30px; border-radius:var(--radius-lg); text-align:center; box-shadow:var(--shadow-md); cursor:pointer; transition:var(--transition); border:1px solid var(--gray-200);">
            <div style="font-size:3rem; margin-bottom:15px;">📱</div>
            <h4 style="color:var(--blue-deep);">${t('electronics')}</h4>
          </div>
        </div>
      </div>

      <div class="recent-section" style="padding-bottom:60px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
          <h2 style="margin:0;">🆕 ${t('recentProducts')}</h2>
          <button class="btn-outline" onclick="renderView('shop')">${t('viewAll') || 'Tout Boutik'}</button>
        </div>
        <div class="grid" id="featuredProducts">
          ${Array(4).fill(0).map(() => `<div class="product-card skeleton"><div class="skeleton-img"></div><div class="product-info"><div class="skeleton-text"></div><div class="skeleton-text" style="width:60%;"></div></div></div>`).join('')}
        </div>
      </div>
      
      <!-- AI RECOMMENDATIONS SECTION -->
      <div id="aiRecommendations" class="ai-section"></div>
    </div>
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
    <div class="shop-hero" style="background:var(--blue-deep); padding:80px 0; text-align:center; color:white; margin-bottom:40px; position:relative; overflow:hidden;">
      <div style="position:absolute; top:0; left:0; width:100%; height:100%; background:url('logo.jpeg') center/cover; opacity:0.1; filter:blur(5px);"></div>
      <div style="position:relative; z-index:1;">
        <h1 style="font-size:3rem; font-weight:900; margin-bottom:15px; letter-spacing:-1px;">🛍️ ${t('shop')}</h1>
        <p style="font-size:1.2rem; opacity:0.9; max-width:600px; margin:0 auto;">Jwenn tout kalite pwodwi nou yo nan yon sèl plas.</p>
      </div>
    </div>

    <div class="container">
      <div class="shop-controls" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px; margin-bottom:50px; background:var(--white); padding:20px; border-radius:var(--radius-lg); box-shadow:var(--shadow-md); border:1px solid var(--gray-200);">
        <div class="search-bar-container" style="flex:1; min-width:300px; position:relative;">
          <input type="text" id="shopSearchInput" class="search-input" style="width:100%; padding:15px 15px 15px 50px; font-size:1rem; border-radius:30px; border:2px solid var(--gray-100); transition:var(--transition);" placeholder="${t('searchPlaceholder')}">
          <span style="position:absolute; left:20px; top:50%; transform:translateY(-50%); font-size:1.2rem; opacity:0.5;">🔍</span>
        </div>
        <div class="filters-container" style="display:flex; gap:15px; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-weight:700; color:var(--text-soft); font-size:0.9rem;">${t('category')}:</span>
            <select id="categoryFilter" class="filter-select" style="padding:10px 20px; border-radius:30px; font-weight:600;">
              <option value="all">📁 ${t('allCategories')}</option>
              <option value="clothing">👕 ${t('categoryClothingAccessories')}</option>
              <option value="school">🎓 ${t('categorySchoolOffice')}</option>
              <option value="home">🏠 ${t('categoryHomePersonal')}</option>
              <option value="electronics">📱 ${t('categoryElectronicsTech')}</option>
            </select>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-weight:700; color:var(--text-soft); font-size:0.9rem;">Trier:</span>
            <select id="sortFilter" class="filter-select" style="padding:10px 20px; border-radius:30px; font-weight:600;">
              <option value="recent">🆕 ${t('mostRecent')}</option>
              <option value="low">📉 ${t('priceLowToHigh')}</option>
              <option value="high">📈 ${t('priceHighToLow')}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="grid" id="allProducts" style="margin-bottom:60px;">
        ${Array(8).fill(0).map(() => `<div class="product-card skeleton"><div class="skeleton-img"></div><div class="product-info"><div class="skeleton-text"></div><div class="skeleton-text" style="width:60%;"></div></div></div>`).join('')}
      </div>
    </div>
  `;
  
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
      <div class="container" style="padding:100px 0;">
        <div class="card-premium text-center" style="max-width:500px; margin:0 auto; padding:40px;">
          <div style="font-size:4rem; margin-bottom:20px;">🔐</div>
          <h2 style="color:var(--blue-deep); margin-bottom:15px;">${t('loginRequired')}</h2>
          <p style="color:var(--text-soft); margin-bottom:30px;">${t('aiLoginRequiredDesc') || 'Ou dwe konekte pou w ka pale ak asistan entèlijan nou an.'}</p>
          <button class="btn-gold" id="loginFromAI" style="width:100%; padding:15px;">${t('login')}</button>
        </div>
      </div>
    `;
    document.getElementById('loginFromAI')?.addEventListener('click', () => document.getElementById('authBtn')?.click());
    return;
  }

  app.innerHTML = `
    <div class="container" style="padding:40px 0;">
      <div class="card-premium" style="max-width:1000px; margin:0 auto; padding:0; overflow:hidden; border:none; box-shadow:var(--shadow-xl);">
        <div style="background:var(--blue-deep); padding:30px; color:white; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2 style="margin:0; font-size:1.8rem; display:flex; align-items:center; gap:12px;">🤖 ${t('aiAssistant')}</h2>
            <p style="margin:5px 0 0; opacity:0.8; font-size:0.9rem;">${t('aiPageDesc')}</p>
          </div>
          <div style="background:rgba(255,255,255,0.1); padding:8px 20px; border-radius:30px; font-size:0.8rem; font-weight:700; border:1px solid rgba(255,255,255,0.2);">
            ONLINE
          </div>
        </div>
        
        <div style="height:600px; display:flex; flex-direction:column; background:var(--white);">
          <div id="aiPageMessages" style="flex:1; padding:30px; overflow-y:auto; display:flex; flex-direction:column; gap:20px; background:#f8f9fb;">
            <div style="background:var(--white); color:var(--blue-deep); align-self:flex-start; border-radius:20px 20px 20px 5px; padding:20px; max-width:80%; box-shadow:var(--shadow-sm); border:1px solid var(--gray-100); line-height:1.6;">
              👋 ${t('aiWelcome')}
            </div>
          </div>
          
          <div style="padding:25px; background:var(--white); border-top:1px solid var(--gray-200);">
            <div style="display:flex; gap:15px; background:var(--gray-100); padding:8px; border-radius:40px; border:2px solid transparent; transition:var(--transition);" onfocusin="this.style.borderColor='var(--gold)'; this.style.background='white'" onfocusout="this.style.borderColor='transparent'; this.style.background='var(--gray-100)'">
              <input type="text" id="aiPageInput" placeholder="${t('aiInputPlaceholder')}" style="flex:1; border:none; background:transparent; padding:12px 25px; font-size:1rem; outline:none;">
              <button id="sendAiPageMsg" style="background:var(--gold-gradient); color:var(--blue-deep); width:50px; height:50px; border-radius:50%; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:1.2rem; transition:var(--transition); box-shadow:var(--shadow-gold);">
                📤
              </button>
            </div>
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
    botMsg.style = 'background: var(--gray-100); align-self: flex-start; border-radius: 16px 16px 16px 4px; padding: 1rem; max-width: 80%; line-height: 1.5; animation: fadeIn 0.3s ease;';
    botMsg.innerHTML = answer;
    messages.appendChild(botMsg);
    messages.scrollTop = messages.scrollHeight;
  } catch (err) {
    if (typingEl) typingEl.remove();
    showMessage(t('errorOccurred'), 'error');
  }
}

async function renderProfile(app) {
  if (!currentUser) {
    app.innerHTML = `<div class="card text-center"><p>🔐 ${t('loginRequired')}</p><button class="btn-gold" id="loginFromOrders">${t('login')}</button></div>`;
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
    <div class="container" style="padding-top:40px; padding-bottom:60px;">
      <div style="display:grid; grid-template-columns: 300px 1fr; gap:40px;">
        <!-- SIDEBAR -->
        <div style="background:var(--white); padding:30px; border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); height:fit-content; border:1px solid var(--gray-200);">
          <div style="text-align:center; margin-bottom:30px;">
            <div class="avatar" id="profileAvatar" style="width:120px; height:120px; background:var(--gold-gradient); color:var(--blue-deep); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-size:2.5rem; font-weight:900; position:relative; cursor:pointer; border:4px solid var(--white); box-shadow:var(--shadow-md);">
              ${currentUser.photoURL ? `<img src="${currentUser.photoURL}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">` : initials}
              <div style="position:absolute; bottom:5px; right:5px; background:var(--blue-deep); color:white; width:35px; height:35px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1rem; border:2px solid var(--white);">📷</div>
            </div>
            <input type="file" id="profPhotoInput" accept="image/*" style="display:none;">
            <h3 style="color:var(--blue-deep); margin-bottom:5px;">${currentUser.displayName || t('clientLabel')}</h3>
            <p style="font-size:0.85rem; color:var(--text-soft); word-break:break-all;">${currentUser.email}</p>
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="tab-btn active" data-target="tab-overview" style="width:100%; text-align:left; padding:12px 20px; border-radius:12px; border:none; background:none; color:var(--text-soft); font-weight:600; cursor:pointer; display:flex; align-items:center; gap:12px; transition:var(--transition);">📊 Aperçu</button>
            <button class="tab-btn" data-target="tab-info" style="width:100%; text-align:left; padding:12px 20px; border-radius:12px; border:none; background:none; color:var(--text-soft); font-weight:600; cursor:pointer; display:flex; align-items:center; gap:12px; transition:var(--transition);">👤 ${t('profile')}</button>
            <button class="tab-btn" data-target="tab-orders" style="width:100%; text-align:left; padding:12px 20px; border-radius:12px; border:none; background:none; color:var(--text-soft); font-weight:600; cursor:pointer; display:flex; align-items:center; gap:12px; transition:var(--transition);">📦 ${t('myOrders')}</button>
            <button class="tab-btn" data-target="tab-security" style="width:100%; text-align:left; padding:12px 20px; border-radius:12px; border:none; background:none; color:var(--text-soft); font-weight:600; cursor:pointer; display:flex; align-items:center; gap:12px; transition:var(--transition);">🔒 Sécurité</button>
          </div>
        </div>

        <!-- CONTENT -->
        <div style="background:var(--white); padding:40px; border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); border:1px solid var(--gray-200);">
          
          <!-- TAB: OVERVIEW -->
          <div id="tab-overview" class="profile-tab-content active">
            <h2 style="margin-bottom:30px; font-size:1.8rem; color:var(--blue-deep);">📊 Aperçu du Compte</h2>
            <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin-bottom:40px;">
              <div style="background:var(--blue-deep); color:white; padding:30px; border-radius:var(--radius); border-left:6px solid var(--gold); box-shadow:var(--shadow-md);">
                <div style="font-size:2rem; font-weight:900; color:var(--gold); margin-bottom:5px;">${formatPrice(currentUserData?.balance || 0)}</div>
                <div style="font-size:1rem; opacity:0.8; font-weight:600;">${t('myBalance')}</div>
              </div>
              <div style="background:var(--white-soft); padding:30px; border-radius:var(--radius); border:1px solid var(--gray-200);">
                <div style="font-size:2rem; font-weight:900; color:var(--blue-deep); margin-bottom:5px;">${totalOrders}</div>
                <div style="font-size:1rem; color:var(--text-soft); font-weight:600;">Commandes</div>
              </div>
              <div style="background:var(--white-soft); padding:30px; border-radius:var(--radius); border:1px solid var(--gray-200);">
                <div style="font-size:2rem; font-weight:900; color:var(--blue-deep); margin-bottom:5px;">${formatPrice(totalSpent)}</div>
                <div style="font-size:1rem; color:var(--text-soft); font-weight:600;">Total Dépensé</div>
              </div>
            </div>

            <div style="background:rgba(212, 175, 55, 0.05); padding:35px; border-radius:var(--radius); border:1px solid var(--gold-pale);">
              <h3 style="color:var(--blue-deep); margin-bottom:20px; display:flex; align-items:center; gap:10px;">💳 ${t('linkMoncash')}</h3>
              <div style="margin-bottom:20px;">
                <label style="display:block; margin-bottom:10px; font-weight:600; color:var(--text-soft);">${t('moncashPhone')}</label>
                <input type="text" id="userMoncashPhone" class="search-input" style="width:100%; background:var(--white); font-size:1.1rem; padding:15px;" value="${currentUserData?.moncashPhone || ''}" placeholder="+509 3XXX XXXX">
              </div>
              <div style="display:flex; align-items:center; gap:12px; margin-bottom:25px;">
                <input type="checkbox" id="userMoncashConsent" ${currentUserData?.moncashConsent ? 'checked' : ''} style="width:22px; height:22px; cursor:pointer;">
                <label for="userMoncashConsent" style="font-size:0.9rem; color:var(--text-soft); cursor:pointer;">${t('moncashTerms')}</label>
              </div>
              <button id="linkMoncashBtn" class="btn-gold" style="width:100%; padding:18px; font-size:1.1rem;">${currentUserData?.moncashPhone ? t('save') : t('connect')}</button>
            </div>
          </div>

          <!-- TAB: INFO -->
          <div id="tab-info" class="profile-tab-content" style="display:none;">
            <h2 style="margin-bottom:30px; font-size:1.8rem; color:var(--blue-deep);">👤 ${t('profile')}</h2>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:25px; margin-bottom:30px;">
              <div>
                <label style="display:block; margin-bottom:10px; font-weight:600; color:var(--text-soft);">${t('name')}</label>
                <input type="text" id="profName" class="search-input" style="width:100%; padding:15px;" value="${currentUser.displayName || ''}">
              </div>
              <div>
                <label style="display:block; margin-bottom:10px; font-weight:600; color:var(--text-soft);">${t('email')}</label>
                <input type="text" class="search-input" style="width:100%; background:var(--gray-100); color:var(--text-soft); padding:15px;" value="${currentUser.email}" disabled>
              </div>
              <div>
                <label style="display:block; margin-bottom:10px; font-weight:600; color:var(--text-soft);">${t('addressRecommend')}</label>
                <input type="text" id="profAddress" class="search-input" style="width:100%; padding:15px;" value="${userAddress}">
              </div>
              <div>
                <label style="display:block; margin-bottom:10px; font-weight:600; color:var(--text-soft);">${t('phoneRecommend')}</label>
                <input type="text" id="profPhone" class="search-input" style="width:100%; padding:15px;" value="${userPhone}">
              </div>
            </div>
            <button id="saveProfileBtn" class="btn-gold" style="width:100%; padding:18px; font-size:1.1rem;">💾 ${t('saveProfile')}</button>
          </div>

          <!-- TAB: ORDERS -->
          <div id="tab-orders" class="profile-tab-content" style="display:none;">
            <h2 style="margin-bottom:30px; font-size:1.8rem; color:var(--blue-deep);">📦 ${t('myOrders')}</h2>
            <div style="display:flex; flex-direction:column; gap:20px;">
              ${orders.length === 0 ? `
                <div style="text-align:center; padding:60px; background:var(--white-soft); border-radius:var(--radius); border:2px dashed var(--gray-200);">
                  <div style="font-size:4rem; margin-bottom:20px;">📭</div>
                  <p style="color:var(--text-soft); font-size:1.2rem;">${t('noOrders')}</p>
                </div>
              ` : orders.map(o => `
                <div style="padding:25px; border-radius:var(--radius); border:1px solid var(--gray-200); background:var(--white-soft); transition:var(--transition); cursor:default;" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='var(--gray-200)'">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <strong style="color:var(--blue-deep); font-size:1.2rem;">${o.productName}</strong>
                    <span style="background:var(--blue-deep); color:white; padding:6px 15px; border-radius:30px; font-size:0.8rem; font-weight:700; text-transform:uppercase; letter-spacing:1px;">${t(o.status)}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-size:1rem; color:var(--text-soft);">
                      <span style="color:var(--blue-deep); font-weight:800; font-size:1.1rem;">${formatPrice(o.price)}</span>
                      <span style="margin:0 10px; color:var(--gray-300);">|</span>
                      <span>📅 ${o.createdAt?.toDate?.()?.toLocaleDateString() || '---'}</span>
                    </div>
                    ${o.deliveryEstimate ? `<div style="font-weight:700; color:var(--success); font-size:0.9rem;">🚚 ${t('delivery')}: ${o.deliveryEstimate}</div>` : ''}
                  </div>
                </div>`).join('')}
            </div>
          </div>

          <!-- TAB: SECURITY -->
          <div id="tab-security" class="profile-tab-content" style="display:none;">
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
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.style.background = 'none';
        b.style.color = 'var(--text-soft)';
      });
      document.querySelectorAll('.profile-tab-content').forEach(c => {
        c.style.display = 'none';
        c.classList.remove('active');
      });

      const clicked = e.currentTarget;
      clicked.classList.add('active');
      clicked.style.background = 'var(--blue-deep)';
      clicked.style.color = 'white';
      
      const targetId = clicked.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.style.display = 'block';
        targetContent.classList.add('active');
      }
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
