/**
 * i18n (Internationalization) Module
 * Language & translation management
 */

const translations = {
  ht: {
    forgotPassword: "Modpas oubliye?",
    enterEmailReset: "Tanpri mete email ou pou reset modpas la",
    resetEmailSent: "Lien reset modpas la voye nan email ou!",
    home: "Akèy",
    shop: "Boutik",
    orders: "Kòmand",
    admin: "Admin",
    login: "Konekte",
    logout: "Dekonekte",
    dashboard: "Tablodbò",
    totalProducts: "Total Pwodui",
    totalOrders: "Total Kòmand",
    totalClients: "Total Kliyan",
    error: "Erè",
    success: "Siksè",
    loading: "Chajman...",
    noResults: "Pa gen rezilta",
    add: "Ajoute",
    edit: "Modifye",
    delete: "Efase",
    save: "Sove",
    cancel: "Anile",
    close: "Fèmen",
    submit: "Soumèt"
  },
  fr: {
    forgotPassword: "Mot de passe oublié?",
    enterEmailReset: "Entrez votre email pour réinitialiser le mot de passe",
    resetEmailSent: "Lien de réinitialisation envoyé à votre email!",
    home: "Accueil",
    shop: "Boutique",
    orders: "Commandes",
    admin: "Admin",
    login: "Connexion",
    logout: "Déconnexion",
    dashboard: "Tableau de bord",
    totalProducts: "Total Produits",
    totalOrders: "Total Commandes",
    totalClients: "Total Clients",
    error: "Erreur",
    success: "Succès",
    loading: "Chargement...",
    noResults: "Aucun résultat",
    add: "Ajouter",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Enregistrer",
    cancel: "Annuler",
    close: "Fermer",
    submit: "Soumettre"
  },
  en: {
    forgotPassword: "Forgot password?",
    enterEmailReset: "Enter your email to reset password",
    resetEmailSent: "Reset link sent to your email!",
    home: "Home",
    shop: "Shop",
    orders: "Orders",
    admin: "Admin",
    login: "Login",
    logout: "Logout",
    dashboard: "Dashboard",
    totalProducts: "Total Products",
    totalOrders: "Total Orders",
    totalClients: "Total Clients",
    error: "Error",
    success: "Success",
    loading: "Loading...",
    noResults: "No results",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    submit: "Submit"
  },
  es: {
    forgotPassword: "¿Contraseña olvidada?",
    enterEmailReset: "Ingrese su correo electrónico para restablecer la contraseña",
    resetEmailSent: "¡Enlace de restablecimiento enviado a su correo!",
    home: "Inicio",
    shop: "Tienda",
    orders: "Pedidos",
    admin: "Admin",
    login: "Iniciar sesión",
    logout: "Cerrar sesión",
    dashboard: "Panel de control",
    totalProducts: "Total Productos",
    totalOrders: "Total Pedidos",
    totalClients: "Total Clientes",
    error: "Error",
    success: "Éxito",
    loading: "Cargando...",
    noResults: "Sin resultados",
    add: "Añadir",
    edit: "Editar",
    delete: "Borrar",
    save: "Guardar",
    cancel: "Cancelar",
    close: "Cerrar",
    submit: "Enviar"
  }
};

class I18n {
  constructor(defaultLang = 'ht') {
    this.currentLang = defaultLang;
    this.observers = [];
  }

  /**
   * Set language
   */
  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('totalLakayLang', lang);
      this.notifyObservers();
      console.log(`🌍 Language changed to: ${lang}`);
      return true;
    }
    console.warn(`⚠️ Language not supported: ${lang}`);
    return false;
  }

  /**
   * Get translation
   */
  t(key, defaultValue = key) {
    return translations[this.currentLang]?.[key] || defaultValue;
  }

  /**
   * Get all translations for current language
   */
  getAll() {
    return translations[this.currentLang] || {};
  }

  /**
   * Subscribe to language changes
   */
  subscribe(callback) {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(cb => cb !== callback);
    };
  }

  notifyObservers() {
    this.observers.forEach(callback => callback(this.currentLang));
  }

  /**
   * Get available languages
   */
  getAvailableLanguages() {
    return Object.keys(translations);
  }
}

const i18n = new I18n();

export default i18n;
