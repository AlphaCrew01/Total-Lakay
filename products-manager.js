/* ============================================
   PRODUCT MANAGER - Total Lakay
   Image compression, validation, multi-upload
   Full CRUD operations
   ============================================ */

// Firebase Config
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

// ============================================
// STATE MANAGEMENT
// ============================================

let currentUser = null;
let isAdmin = false;
let products = [];
let categories = ['clothing', 'school', 'home', 'electronics'];
let selectedProductId = null;
let imageFiles = [];
let currentTab = 'all';

// Image compression settings
const IMAGE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
  maxImages: 5
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showToast(message, type = 'success') {
  const container = document.getElementById('pmToastContainer');
  const toast = document.createElement('div');
  toast.className = `pm-toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(400px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function showProgress(text, percent) {
  const container = document.getElementById('pmUploadProgress');
  document.getElementById('pmUploadText').textContent = text;
  document.getElementById('pmUploadPercent').textContent = `${percent}%`;
  document.getElementById('pmProgressFill').style.width = `${percent}%`;
  container.classList.add('active');
  if (percent >= 100) {
    setTimeout(() => container.classList.remove('active'), 1000);
  }
}

function getPlaceholderImage() {
  return 'placeholder-image.svg';
}

// ============================================
// IMAGE VALIDATION & COMPRESSION
// ============================================

async function validateAndCompressImage(file) {
  try {
    // Check file size
    if (file.size > IMAGE_CONFIG.maxSize) {
      throw new Error(`Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(2)}MB). Max: 5MB`);
    }

    // Check format
    if (!IMAGE_CONFIG.allowedFormats.includes(file.type)) {
      throw new Error(`Format non autorisé. Formats acceptés: JPG, PNG, WEBP`);
    }

    // Compress image
    const canvas = await compressImage(file);
    
    // Convert to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
          resolve(compressedFile);
        },
        'image/jpeg',
        IMAGE_CONFIG.quality
      );
    });
  } catch (error) {
    throw new Error(`Erreur image: ${error.message}`);
  }
}

async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate dimensions maintaining aspect ratio
          if (width > height) {
            if (width > IMAGE_CONFIG.maxWidth) {
              height *= IMAGE_CONFIG.maxWidth / width;
              width = IMAGE_CONFIG.maxWidth;
            }
          } else {
            if (height > IMAGE_CONFIG.maxHeight) {
              width *= IMAGE_CONFIG.maxHeight / height;
              height = IMAGE_CONFIG.maxHeight;
            }
          }

          // Set minimum dimensions
          width = Math.max(width, 100);
          height = Math.max(height, 100);

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Impossible de créer le contexte canvas');
          
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas);
        } catch (err) {
          reject(new Error(`Erreur compression: ${err.message}`));
        }
      };
      img.onerror = () => reject(new Error('Erreur chargement image - format invalide'));
      img.onabort = () => reject(new Error('Chargement image annulé'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Erreur lecture fichier'));
    reader.onabort = () => reject(new Error('Lecture fichier annulée'));
    reader.readAsDataURL(file);
  });
}

async function uploadProductImage(file, onProgress) {
  try {
    const compressed = await validateAndCompressImage(file);
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9-_.]/g, '_')}`;
    const storageRef = storage.ref().child(`product_images/${fileName}`);
    
    const uploadTask = storageRef.put(compressed);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const url = await uploadTask.snapshot.ref.getDownloadURL();
          resolve(url);
        }
      );
    });
  } catch (error) {
    throw new Error(`Upload image échoué: ${error.message}`);
  }
}

// ============================================
// IMAGE HANDLING
// ============================================

function setupImageUpload() {
  const dropZone = document.getElementById('pmImageDrop');
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.multiple = true;
  fileInput.accept = 'image/jpeg,image/png,image/webp';
  fileInput.style.display = 'none';
  dropZone.appendChild(fileInput);

  dropZone.addEventListener('click', () => fileInput.click());
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleImageSelection(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', (e) => {
    handleImageSelection(e.target.files);
  });
}

async function handleImageSelection(files) {
  const newFiles = Array.from(files);
  
  if (imageFiles.length + newFiles.length > IMAGE_CONFIG.maxImages) {
    showToast(`Maximum ${IMAGE_CONFIG.maxImages} images autorisées`, 'warning');
    return;
  }

  try {
    showProgress('Validation des images...', 0);
    for (let i = 0; i < newFiles.length; i++) {
      const validated = await validateAndCompressImage(newFiles[i]);
      imageFiles.push(validated);
      showProgress(`Préparation image ${i + 1}/${newFiles.length}...`, ((i + 1) / newFiles.length) * 100);
    }
    updateImagePreviews();
    showToast(`${newFiles.length} image(s) ajoutée(s)`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function updateImagePreviews() {
  const container = document.getElementById('pmImagePreviews');
  container.innerHTML = imageFiles.map((file, index) => {
    const url = URL.createObjectURL(file);
    return `
      <div class="pm-image-preview">
        <img src="${url}" alt="Preview ${index}">
        <button class="pm-image-preview-close" onclick="removeImage(${index})" type="button">×</button>
      </div>
    `;
  }).join('');
}

function removeImage(index) {
  imageFiles.splice(index, 1);
  updateImagePreviews();
}

// ============================================
// PRODUCT CRUD OPERATIONS
// ============================================

async function loadProducts() {
  try {
    const snap = await db.collection('products').orderBy('createdAt', 'desc').get();
    products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderProducts();
    updateStatistics();
  } catch (error) {
    showToast(`Erreur chargement: ${error.message}`, 'error');
  }
}

async function saveProduct() {
  const form = document.getElementById('pmProductForm');
  
  // Validate form
  if (!form.checkValidity()) {
    form.reportValidity();
    showToast('❌ Veuillez remplir tous les champs requis', 'error');
    return;
  }

  // Validate that at least name, price, and category are filled
  const name = document.getElementById('pmName').value.trim();
  const category = document.getElementById('pmCategory').value;
  const price = document.getElementById('pmPrice').value;
  const stock = document.getElementById('pmStock').value;

  if (!name || !category || !price || stock === '') {
    showToast('❌ Nom, catégorie, prix et stock sont obligatoires', 'error');
    return;
  }

  try {
    showProgress('Préparation du produit...', 10);

    const productData = {
      name: name,
      description: document.getElementById('pmDescription').value.trim(),
      category: category,
      price: parseFloat(price),
      oldPrice: document.getElementById('pmOldPrice').value ? parseFloat(document.getElementById('pmOldPrice').value) : null,
      stock: parseInt(stock),
      colors: document.getElementById('pmColors').value.split(',').map(c => c.trim()).filter(c => c),
      sizes: document.getElementById('pmSizes').value.split(',').map(s => s.trim()).filter(s => s),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Upload images if any new ones were added
    let imageUrls = [];
    if (imageFiles.length > 0) {
      showProgress('Upload des images...', 30);
      imageUrls = await Promise.all(
        imageFiles.map((file, index) =>
          uploadProductImage(file, (progress) => {
            const totalProgress = 30 + ((index + (progress / 100)) / imageFiles.length) * 60;
            showProgress(`Upload image ${index + 1}/${imageFiles.length}...`, Math.round(totalProgress));
          })
        )
      );
    }

    if (imageUrls.length > 0) {
      productData.images = imageUrls;
      productData.image = imageUrls[0]; // Primary image
    }

    // Save or update
    showProgress('Sauvegarde en base de données...', 90);
    if (selectedProductId) {
      await db.collection('products').doc(selectedProductId).update(productData);
      showToast('✅ Produit mis à jour avec succès', 'success');
    } else {
      productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('products').add(productData);
      showToast('✅ Produit créé avec succès', 'success');
    }

    resetForm();
    await loadProducts();
    showProgress('Terminé', 100);
  } catch (error) {
    console.error('Save error:', error);
    showToast(`❌ Erreur: ${error.message}`, 'error');
  }
}

async function editProduct(productId) {
  selectedProductId = productId;
  const product = products.find(p => p.id === productId);
  
  if (!product) return;

  // Populate form
  document.getElementById('pmName').value = product.name || '';
  document.getElementById('pmDescription').value = product.description || '';
  document.getElementById('pmCategory').value = product.category || '';
  document.getElementById('pmPrice').value = product.price || '';
  document.getElementById('pmOldPrice').value = product.oldPrice || '';
  document.getElementById('pmStock').value = product.stock || '';
  document.getElementById('pmColors').value = (product.colors || []).join(', ');
  document.getElementById('pmSizes').value = (product.sizes || []).join(', ');

  // Clear images for new upload (user can add more images)
  imageFiles = [];
  updateImagePreviews();

  // Update UI
  document.getElementById('pmFormTitle').textContent = 'Modifier le Produit';
  document.getElementById('pmSubmitText').textContent = '✏️ Mettre à jour';
  document.getElementById('pmSubmitBtn').className = 'pm-btn pm-btn-primary';

  // Scroll to form
  document.querySelector('.pm-sidebar').scrollIntoView({ behavior: 'smooth' });
}

async function deleteProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('pmConfirmModal');
  document.getElementById('pmConfirmText').textContent = `Êtes-vous sûr de vouloir supprimer "${product.name}"? Cette action est irréversible et supprimera aussi les images.`;
  
  document.getElementById('pmConfirmBtn').onclick = async () => {
    try {
      modal.classList.remove('active');
      showProgress('Suppression en cours...', 50);
      
      // Delete images from storage
      if (product.images && Array.isArray(product.images)) {
        for (const imageUrl of product.images) {
          try {
            const ref = storage.refFromURL(imageUrl);
            await ref.delete().catch(e => {
              console.warn('Avertissement: Image non supprimée du storage:', e);
            });
          } catch (e) {
            console.warn('Erreur suppression image:', e);
          }
        }
      }

      // Delete product from Firestore
      await db.collection('products').doc(productId).delete();
      showToast('✅ Produit supprimé avec succès', 'success');
      await loadProducts();
    } catch (error) {
      showToast(`❌ Erreur suppression: ${error.message}`, 'error');
      console.error('Delete error:', error);
    }
  };

  modal.classList.add('active');
}

function resetForm() {
  document.getElementById('pmProductForm').reset();
  selectedProductId = null;
  imageFiles = [];
  document.getElementById('pmImagePreviews').innerHTML = '';
  document.getElementById('pmFormTitle').textContent = 'Ajouter un Produit';
  document.getElementById('pmSubmitText').textContent = '➕ Ajouter Produit';
}

// ============================================
// RENDERING & UI
// ============================================

function renderProducts() {
  const filtered = getFilteredProducts();
  
  // Render all products
  document.getElementById('pmAllProducts').innerHTML = renderProductsTable(products);
  
  // Render low stock
  const lowStock = products.filter(p => p.stock <= 5);
  document.getElementById('pmLowstockProducts').innerHTML = 
    lowStock.length === 0 
      ? '<div class="pm-empty-state"><div class="pm-empty-state-icon">📦</div><div class="pm-empty-state-text">Aucun produit en rupture</div></div>'
      : renderProductsTable(lowStock);
  
  // Render promos
  const promos = products.filter(p => p.oldPrice && p.oldPrice > p.price);
  document.getElementById('pmPromoProducts').innerHTML = 
    promos.length === 0
      ? '<div class="pm-empty-state"><div class="pm-empty-state-icon">🔥</div><div class="pm-empty-state-text">Aucune promotion active</div></div>'
      : renderProductsTable(promos);
}

function renderProductsTable(productList) {
  if (productList.length === 0) {
    return '<div class="pm-empty-state"><div class="pm-empty-state-icon">📭</div><div class="pm-empty-state-text">Aucun produit trouvé</div></div>';
  }

  return `
    <div class="pm-products-list">
      <div class="pm-products-header">
        <div></div>
        <div>Produit</div>
        <div>Prix</div>
        <div>Stock</div>
        <div>Catégorie</div>
        <div>Actions</div>
      </div>
      ${productList.map(p => `
        <div class="pm-product-row">
          <img src="${p.image || getPlaceholderImage()}" alt="${p.name}" class="pm-product-image" onerror="this.src='${getPlaceholderImage()}'">
          <div>
            <div class="pm-product-name">${p.name}</div>
            <div style="font-size: 0.85rem; color: var(--text-soft);">${p.description?.substring(0, 50) || 'N/A'}...</div>
          </div>
          <div class="pm-product-price">${Math.round(p.price).toLocaleString()} G</div>
          <div class="pm-product-stock ${p.stock <= 5 ? 'low' : 'ok'}">
            ${p.stock} ${p.stock <= 5 ? '⚠️' : ''}
          </div>
          <div>${p.category?.charAt(0).toUpperCase() + p.category?.slice(1)}</div>
          <div class="pm-product-actions">
            <button class="pm-product-btn pm-product-btn-edit" onclick="editProduct('${p.id}')">✏️</button>
            <button class="pm-product-btn pm-product-btn-delete" onclick="deleteProduct('${p.id}')">🗑️</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function updateStatistics() {
  const stats = {
    total: products.length,
    lowStock: products.filter(p => p.stock <= 5).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    totalInventory: products.reduce((sum, p) => sum + (p.stock || 0), 0),
    promo: products.filter(p => p.oldPrice && p.oldPrice > p.price).length,
    avgPrice: products.length > 0 ? Math.round(products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length) : 0
  };

  document.getElementById('pmStats').innerHTML = `
    <div class="pm-stat-card">
      <div class="pm-stat-label">📦 Total Produits</div>
      <div class="pm-stat-value">${stats.total}</div>
    </div>
    <div class="pm-stat-card">
      <div class="pm-stat-label">⚠️ Stock Faible</div>
      <div class="pm-stat-value" style="color: var(--warning);">${stats.lowStock}</div>
    </div>
    <div class="pm-stat-card">
      <div class="pm-stat-label">🔥 En Rupture</div>
      <div class="pm-stat-value" style="color: var(--danger);">${stats.outOfStock}</div>
    </div>
    <div class="pm-stat-card">
      <div class="pm-stat-label">📊 Stock Total</div>
      <div class="pm-stat-value">${stats.totalInventory}</div>
    </div>
    <div class="pm-stat-card">
      <div class="pm-stat-label">💰 Prix Moyen</div>
      <div class="pm-stat-value">${stats.avgPrice.toLocaleString()} G</div>
    </div>
    <div class="pm-stat-card">
      <div class="pm-stat-label">🎉 Promotions</div>
      <div class="pm-stat-value" style="color: var(--gold);">${stats.promo}</div>
    </div>
  `;
}

function getFilteredProducts() {
  const search = document.getElementById('pmSearch').value.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(search) ||
    (p.description || '').toLowerCase().includes(search)
  );
}

// ============================================
// SEARCH & FILTERING
// ============================================

let searchTimeout;
document.getElementById('pmSearch').addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    renderProducts();
  }, 300);
});

// ============================================
// TABS
// ============================================

document.querySelectorAll('.pm-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.pm-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.pm-tab-content').forEach(c => c.classList.remove('active'));
    
    tab.classList.add('active');
    const tabId = `pm${tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)}Products`;
    document.getElementById(tabId).classList.add('active');
  });
});

// ============================================
// FORM HANDLING
// ============================================

document.getElementById('pmProductForm').addEventListener('submit', (e) => {
  e.preventDefault();
  saveProduct();
});

document.getElementById('pmAddNewBtn').addEventListener('click', () => {
  if (selectedProductId) {
    resetForm();
  } else {
    document.querySelector('.pm-sidebar').scrollIntoView({ behavior: 'smooth' });
  }
});

// ============================================
// AUTHENTICATION
// ============================================

auth.onAuthStateChanged(async (user) => {
  currentUser = user;

  if (!user) {
    console.warn('🔐 Utilisateur non authentifié, redirection vers index.html');
    window.location.replace('./index.html');
    return;
  }

  try {
    const userDoc = await db.collection('users').doc(user.uid).get();
    isAdmin = userDoc.data()?.role === 'admin';

    if (!isAdmin) {
      console.warn('🔐 Utilisateur non admin, redirection vers index.html');
      window.location.replace('./index.html');
      return;
    }

    // Load data
    await loadProducts();
  } catch (error) {
    console.error('🔐 Erreur authentification:', error);
    window.location.replace('./index.html');
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  auth.signOut();
});

document.getElementById('backToAdmin').addEventListener('click', () => {
  window.location.href = './index.html';
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  setupImageUpload();
  applyLanguage();
});

function applyLanguage() {
  // Simple language support - can be extended
  document.title = 'Gestion des Produits - Total Lakay';
}