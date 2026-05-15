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
- **Backend (Serverless) :** Firebase (Authentication, Firestore Real-time Database, Storage, Remote Config).
- **Analytique :** Chart.js pour les graphiques de performance.
- **PWA :** Service Workers & Manifest pour une installation native.

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
