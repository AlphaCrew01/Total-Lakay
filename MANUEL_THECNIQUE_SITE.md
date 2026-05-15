# 🔐 MANUEL TECHNIQUE & SECRET DU SITE - TOTAL LAKAY

Ce document contient les secrets de fonctionnement de la plateforme. **Réservé exclusivement à l'administration.**

---

## 🏗️ 1. ARCHITECTURE DES DONNÉES (FIREBASE)
Total Lakay repose sur **Firebase Firestore**. Voici la structure des collections :

### `users/` (Utilisateurs)
- `uid` : Identifiant unique Firebase Auth.
- `role` : 'client' ou 'admin'.
- `isVerified` : Statut de l'email.
- `cart`, `favorites` : Données persistantes si l'utilisateur change d'appareil.
- `moncashPhone` : Pour les remboursements et paiements.

### `products/` (Inventaire)
- `name`, `desc`, `price`, `oldPrice`.
- `stock` : Nombre d'unités restantes (décompté à la validation).
- `category` : Permet le filtrage intelligent.
- `colors`, `sizes` : Tableaux d'options pour le client.

### `orders/` (Commandes)
- `status` : 'pending', 'validated', 'processing', 'in_transit', 'delivered', 'cancelled'.
- `coords` : Coordonnées GPS pour le suivi sur la carte.
- `paymentMethod` : 'MonCash' ou 'Cash'.
- `history` : Journal des changements de statut.

---

## 🤖 2. INTELLIGENCE ARTIFICIELLE (GEMINI)
- **Modèle utilisé** : Gemini 1.5 Flash (ou supérieur selon configuration).
- **Endpoint** : `v1beta` pour une compatibilité maximale.
- **Système de Mémoire** : L'IA conserve les 10 derniers tours de parole dans l'array `aiHistory`.
- **Rôles IA** : L'IA reçoit un prompt différent selon si `isAdmin` est vrai ou faux.

---

## 💳 3. SYSTÈME DE PAIEMENT MONCASH
- **Sécurité** : Les clés Client ID et Secret sont stockées dans `settings/moncash_config`.
- **Flux** : Le bouton de paiement génère un lien sécurisé via l'API MonCash. Une fois payé, le statut passe à `Konfime`.
- **Remboursements** : Doivent être effectués manuellement via le portail MonCash Business, mais l'IA peut aider à identifier les transactions.

---

## 📱 4. PROGRESSIVE WEB APP (PWA)
- **Fichier `sw.js`** : Gère le cache `total-lakay-v6`. Utilise une stratégie "Cache First" pour charger le site en 0.5s.
- **Installation** : Le site détecte si l'utilisateur est sur mobile et propose l'installation via un toast discret.

---

## 🛠️ 5. DÉPANNAGE & MAINTENANCE
- **Erreur 404 IA** : Signifie que le modèle sélectionné n'est pas supporté par la clé API. Utiliser l'outil de diagnostic.
- **Erreur 403 (Leaked Key)** : La clé a été exposée. Désactivez-la sur Google Cloud et générez-en une nouvelle immédiatement.
- **Problème de Cache** : Si une modification ne s'affiche pas, incrémentez `CACHE_NAME` dans `sw.js`.

---

## 📈 6. VISION FUTURE
Total Lakay est conçu pour évoluer vers :
- Une détection automatique de la langue par la voix.
- Un système de parrainage (Referral).
- Une intégration de livraison par drones (via les coordonnées GPS déjà collectées).

---

*Ce document est la propriété de Total Lakay. Ne pas partager.*
