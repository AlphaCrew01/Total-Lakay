# Total Lakay 🇭🇹🛒

**Total Lakay** ("Tout bagay lakay ou") est une plateforme e-commerce de nouvelle génération, conçue pour offrir une expérience d'achat ultra-moderne, sécurisée et intelligente en Haïti.

## 🌟 Fonctionnalités Premium

- **Tableau de Bord Administrateur (BI) :** Analyses avancées avec **Chart.js** pour visualiser les ventes, le stock et l'activité des clients en temps réel.
- **Intelligence Artificielle :** Assistant IA intégré pour guider les utilisateurs, répondre aux questions et faciliter la recherche de produits.
- **Expérience PWA (Progressive Web App) :** Installation sur mobile, accès rapide, mode hors ligne partiel et notifications push pour ne rater aucune commande.
- **Interface UI/UX de pointe :** Design sophistiqué utilisant le **Glassmorphism**, des effets de transparence, des chargeurs "skeleton" et une navigation fluide via Side Drawer.
- **Multilingue & Multidevise :** Support complet du Kreyòl (HT), Français (FR), Anglais (EN) et Espagnol (ES). Conversion dynamique des prix en HTG, USD et EUR.
- **Gestion d'Inventaire Avancée :** Support des variations (couleurs, tailles) et suivi précis du stock par les administrateurs.
- **Paiements Sécurisés :** Intégration du système MonCash pour des transactions rapides et locales.
- **Transparence Totale :** Suivi détaillé des commandes avec motifs d'annulation et avis clients étoilés.

## 🛠️ Stack Technique

- **Frontend :** HTML5 Sémantique, CSS3 (Variables, Flexbox, Grid, Animations), JavaScript ES6+.
- **Backend :** Firebase (Authentication, Firestore, Storage) + un helper Node.js pour la validation MonCash côté serveur.
- **Analytique :** Chart.js pour les graphiques de performance.
- **PWA :** Service Workers & Manifest pour une installation native.

## 🔐 Backend MonCash

Le dossier `backend/` contient un serveur Express minimal qui expose des routes sécurisées pour :

- `POST /api/moncash/create-payment` : créer une demande de paiement MonCash côté serveur.
- `POST /api/moncash/verify-payment` : vérifier le statut d'un paiement MonCash.

### Configuration

Placez les variables d'environnement suivantes dans un fichier local ou votre hébergeur de backend :

- `FIREBASE_SERVICE_ACCOUNT_KEY` (JSON string)
- `MONCASH_API_BASE_URL`
- `MONCASH_CLIENT_ID`
- `MONCASH_CLIENT_SECRET`
- `MONCASH_CREATE_PATH` (optionnel, défaut `/payments`)
- `MONCASH_VERIFY_PATH` (optionnel, défaut `/payments/verify`)
- `MONCASH_CREATE_METHOD` (optionnel, `POST` par défaut)
- `MONCASH_VERIFY_METHOD` (optionnel, `POST` par défaut)

### Démarrage

```bash
cd backend
npm install
cp .env.example .env
# remplir .env avec vos clés Firebase et MonCash
npm start
```

## 📂 Structure du Projet

- `index.html` : Architecture de l'application, modales dynamiques et système de vues.
- `style.css` : Système de design premium avec variables CSS centralisées.
- `app.js` : Cœur de l'application (logique métier, Firebase, i18n, routage dynamique).
- `sw.js` : Gestionnaire de cache et de notifications PWA.

## 🛡️ Sécurité & Confidentialité

La plateforme repose sur des règles de sécurité Firestore strictes (`firestore.rules`) garantissant que :
1. Les utilisateurs ne peuvent modifier que leurs propres données.
2. Seuls les administrateurs authentifiés peuvent gérer le stock, les commandes et les rôles utilisateurs.
3. La vérification d'email est obligatoire pour valider un compte.

---
*Total Lakay &copy; 2026 - Tout bagay lakay ou nan yon sèl klike.*
