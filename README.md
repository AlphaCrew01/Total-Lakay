# 🏠 Total Lakay

**Total Lakay** est une plateforme e-commerce moderne permettant d’acheter des produits facilement depuis chez soi.

👉 Site en ligne : https://totallakayst.netlify.app/

---

## 🚀 Fonctionnalités

### 👤 Utilisateurs
- Création de compte (email + Google)
- Vérification email obligatoire
- Acheter des produits
- Voir ses commandes
- Notifications en temps réel

### 🛒 Boutique
- Recherche de produits 🔍
- Filtres (prix, catégorie)
- Tri (prix, nom, date)
- Promotions 🔥

### 🧑‍💼 Admin Dashboard
- Ajouter / modifier / supprimer des produits
- Gérer les commandes
- Changer les rôles (admin / client)
- Voir statistiques (revenus, commandes)
- Envoyer des notifications

### 🌍 Multilingue
- 🇭🇹 Kreyòl
- 🇫🇷 Français
- 🇺🇸 English
- 🇪🇸 Español

---

## 🛠️ Technologies utilisées

- **Frontend** : HTML, CSS, JavaScript
- **Backend** : Firebase
  - Authentication
  - Firestore Database
  - Storage
- **Hosting** : Netlify

---

## ⚙️ Configuration Firebase

Créer un projet Firebase et remplacer :

```js
const firebaseConfig = {
  apiKey: "AIzaSyBA_cEX_pHmlUZ4xv10GIOLVOv9g_-iolQ",
  authDomain: "total-lakay.firebaseapp.com",
  projectId: "total-lakay",
  storageBucket: "total-lakay.firebasestorage.app",
  messagingSenderId: "37969355540",
  appId: "1:37969355540:web:514e3869a9422e3681d801",
  measurementId: "G-HC09M5HTVZ"
};
