/* ============================================
   PRODUCT MANAGER - Total Lakay v2.0
   Image compression, validation, multi-upload
   Full CRUD operations
   Supabase Storage: tamdcigvxeswtawwymyi
   ============================================ */

// ============================================
// FIREBASE CONFIG
// ============================================
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

// ============================================
// SUPABASE CONFIG (Storage uniquement)
// ============================================
const SUPABASE_URL = 'https://tamdcigvxeswtawwymyi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_mAtPj_VI0O7SsZM6x9guzQ_WKtpDDPu';
const SUPABASE_BUCKET = 'product-images';

// ============================================
// STATE MANAGEMENT
// ============================================
let currentUser = null;
let isAdmin = false;
let products = [];
let selectedProductId = null;
let imageFiles = [];
let existingImageUrls = []; // Pour garder les images existantes lors de l'édition
let isSubmitting = false;

// Image compression settings
const IMAGE_CONFIG = {
  maxSize: 8 * 1024 * 1024, // 8MB avant compression
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.82,
  maxImages: 6
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showToast(message, type = 'success') {
  const container = document.getElementById('pmToastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `pm-toast ${type}`;
  toast.innerHTML = message;
  container.appendChild(toast);

  // Auto-remove
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

function showProgress(text, percent) {
  const container = document.getElementById('pmUploadProgress');
  if (!container) return;
  const textEl = document.getElementById('pmUploadText');
  const percentEl = document.getElementById('pmUploadPercent');
  const fillEl = document.getElementById('pmProgressFill');

  if (textEl) textEl.textContent = text;
  if (percentEl) percentEl.textContent = `${Math.round(percent)}%`;
  if (fillEl) fillEl.style.width = `${Math.round(percent)}%`;

  container.classList.add('active');
  if (percent >= 100) {
    setTimeout(() => container.classList.remove('active'), 1200);
  }
}

function hideProgress() {
  const container = document.getElementById('pmUploadProgress');
  if (container) container.classList.remove('active');
}

function getPlaceholderImage() {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='%23bbb'%3E📦%3C/text%3E%3C/svg%3E`;
}

function formatPrice(price) {
  return Math.round(price).toLocaleString('fr-FR');
}

function sanitizeFileName(name) {
  return name
    .replace(/[^a-zA-Z0-9\-_.]/g, '_')
    .replace(/__+/g, '_')
    .toLowerCase();
}

// ============================================
// IMAGE VALIDATION & COMPRESSION
// ============================================

async function validateAndCompressImage(file) {
  if (!IMAGE_CONFIG.allowedFormats.includes(file.type)) {
    throw new Error(`Format non autorisé: ${file.type}. Formats acceptés: JPG, PNG, WEBP, GIF`);
  }

  if (file.size > IMAGE_CONFIG.maxSize) {
    throw new Error(`Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)}MB). Max: 8MB`);
  }

  const canvas = await compressImage(file);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Échec compression image'));
        const compressedFile = new File(
          [blob],
          `${Date.now()}_${sanitizeFileName(file.name.replace(/\.[^/.]+$/, ''))}.jpg`,
          { type: 'image/jpeg' }
        );
        resolve(compressedFile);
      },
      'image/jpeg',
      IMAGE_CONFIG.quality
    );
  });
}

async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          // Calcul proportionnel
          const ratio = Math.min(
            IMAGE_CONFIG.maxWidth / width,
            IMAGE_CONFIG.maxHeight / height,
            1
          );
          width = Math.max(Math.round(width * ratio), 100);
          height = Math.max(Math.round(height * ratio), 100);

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Impossible de créer le contexte canvas');

          // Amélioration qualité rendu
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas);
        } catch (err) {
          reject(new Error(`Erreur compression: ${err.message}`));
        }
      };
      img.onerror = () => reject(new Error('Erreur chargement image - format invalide'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Erreur lecture fichier'));
    reader.readAsDataURL(file);
  });
}

// ============================================
// UPLOAD IMAGE — SUPABASE STORAGE
// ============================================

async function uploadProductImage(file, onProgress) {
  try {
    const compressed = await validateAndCompressImage(file);
    const fileName = compressed.name;

    if (onProgress) onProgress(20);

    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${fileName}`;
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'image/jpeg',
        'x-upsert': 'true'
      },
      body: compressed
    });

    if (!response.ok) {
      let errMsg = 'Upload échoué';
      try {
        const errData = await response.json();
        errMsg = errData.error || errData.message || errMsg;
      } catch (_) {}
      throw new Error(`${errMsg} (HTTP ${response.status})`);
    }

    if (onProgress) onProgress(100);

    return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${fileName}`;
  } catch (error) {
    throw new Error(`Upload image échoué: ${error.message}`);
  }
}

async function deleteSupabaseImage(imageUrl) {
  try {
    const parts = imageUrl.split(`/public/${SUPABASE_BUCKET}/`);
    if (parts.length < 2) return;
    const fileName = parts[1];

    await fetch(`${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${fileName}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
  } catch (e) {
    console.warn('Erreur suppression image Supabase:', e);
  }
}

// ============================================
// IMAGE HANDLING — DROP ZONE
// ============================================

function setupImageUpload() {
  const dropZone = document.getElementById('pmImageDrop');
  if (!dropZone) return;

  let fileInput = dropZone.querySelector('input[type="file"]');
  if (!fileInput) {
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/jpeg,image/png,image/webp,image/gif';
    fileInput.style.display = 'none';
    dropZone.appendChild(fileInput);
  }

  dropZone.addEventListener('click', (e) => {
    if (!e.target.closest('.pm-existing-img-remove')) {
      fileInput.click();
    }
  });

  ['dragenter', 'dragover'].forEach(ev => {
    dropZone.addEventListener(ev, (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
  });

  ['dragleave', 'dragend'].forEach(ev => {
    dropZone.addEventListener(ev, () => {
      dropZone.classList.remove('dragover');
    });
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleImageSelection(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', (e) => {
    handleImageSelection(e.target.files);
    e.target.value = '';
  });
}

async function handleImageSelection(files) {
  const newFiles = Array.from(files);
  const totalCount = existingImageUrls.length + imageFiles.length + newFiles.length;

  if (totalCount > IMAGE_CONFIG.maxImages) {
    showToast(`⚠️ Maximum ${IMAGE_CONFIG.maxImages} images autorisées`, 'warning');
    return;
  }

  if (newFiles.length === 0) return;

  showProgress('Validation des images...', 5);

  try {
    for (let i = 0; i < newFiles.length; i++) {
      showProgress(`Compression image ${i + 1}/${newFiles.length}...`, 5 + ((i / newFiles.length) * 90));
      const validated = await validateAndCompressImage(newFiles[i]);
      imageFiles.push(validated);
    }
    updateImagePreviews();
    showToast(`✅ ${newFiles.length} image(s) ajoutée(s)`, 'success');
  } catch (error) {
    showToast(`❌ ${error.message}`, 'error');
  } finally {
    hideProgress();
  }
}

function updateImagePreviews() {
  const container = document.getElementById('pmImagePreviews');
  if (!container) return;

  const existingHTML = existingImageUrls.map((url, index) => `
    <div class="pm-image-preview existing" data-index="${index}">
      <img src="${url}" alt="Image ${index + 1}" loading="lazy" onerror="this.src='${getPlaceholderImage()}'">
      <button class="pm-image-preview-close" onclick="removeExistingImage(${index})" type="button" title="Supprimer">×</button>
      <span class="pm-img-badge">Actuelle</span>
    </div>
  `).join('');

  const newHTML = imageFiles.map((file, index) => {
    const url = URL.createObjectURL(file);
    return `
      <div class="pm-image-preview new" data-index="${index}">
        <img src="${url}" alt="Nouvelle image ${index + 1}">
        <button class="pm-image-preview-close" onclick="removeNewImage(${index})" type="button" title="Supprimer">×</button>
        <span class="pm-img-badge new-badge">Nouvelle</span>
      </div>
    `;
  }).join('');

  const countLeft = IMAGE_CONFIG.maxImages - existingImageUrls.length - imageFiles.length;
  const hint = countLeft > 0 ? `<p class="pm-img-count">Vous pouvez encore ajouter ${countLeft} image(s)</p>` : '';

  container.innerHTML = existingHTML + newHTML + hint;
}

function removeNewImage(index) {
  imageFiles.splice(index, 1);
  updateImagePreviews();
}

function removeExistingImage(index) {
  existingImageUrls.splice(index, 1);
  updateImagePreviews();
}

// ============================================
// PRODUCT CRUD OPERATIONS
// ============================================

async function loadProducts() {
  const listEl = document.getElementById('pmAllProducts');
  if (listEl) listEl.innerHTML = '<div class="pm-loading"><span class="pm-spinner"></span> Chargement...</div>';

  try {
    const snap = await db.collection('products').orderBy('createdAt', 'desc').get();
    products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderProducts();
    updateStatistics();
  } catch (error) {
    showToast(`❌ Erreur chargement: ${error.message}`, 'error');
    if (listEl) listEl.innerHTML = '<div class="pm-empty-state"><div class="pm-empty-state-icon">⚠️</div><div>Erreur de chargement. Réessayez.</div></div>';
  }
}

async function saveProduct() {
  if (isSubmitting) return;

  const form = document.getElementById('pmProductForm');
  if (!form) return;

  const name = document.getElementById('pmName')?.value.trim();
  const category = document.getElementById('pmCategory')?.value;
  const priceVal = document.getElementById('pmPrice')?.value;
  const stockVal = document.getElementById('pmStock')?.value;

  if (!name || !category || !priceVal || stockVal === '') {
    showToast('❌ Nom, catégorie, prix et stock sont obligatoires', 'error');
    return;
  }

  const price = parseFloat(priceVal);
  const stock = parseInt(stockVal);
  const oldPriceVal = document.getElementById('pmOldPrice')?.value;
  const oldPrice = oldPriceVal ? parseFloat(oldPriceVal) : null;

  if (isNaN(price) || price < 0) {
    showToast('❌ Prix invalide', 'error');
    return;
  }
  if (isNaN(stock) || stock < 0) {
    showToast('❌ Stock invalide', 'error');
    return;
  }

  isSubmitting = true;
  const submitBtn = document.getElementById('pmSubmitBtn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
  }

  try {
    showProgress('Préparation...', 5);

    const productData = {
      name,
      description: document.getElementById('pmDescription')?.value.trim() || '',
      category,
      price,
      oldPrice,
      stock,
      colors: parseCommaSeparated(document.getElementById('pmColors')?.value),
      sizes: parseCommaSeparated(document.getElementById('pmSizes')?.value),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Upload nouvelles images
    let newUploadedUrls = [];
    if (imageFiles.length > 0) {
      showProgress(`Upload de ${imageFiles.length} image(s)...`, 20);
      const uploadPromises = imageFiles.map((file, index) =>
        uploadProductImage(file, (progress) => {
          const total = 20 + ((index + progress / 100) / imageFiles.length) * 65;
          showProgress(`Upload image ${index + 1}/${imageFiles.length}...`, total);
        })
      );
      newUploadedUrls = await Promise.all(uploadPromises);
    }

    // Fusion images existantes + nouvelles
    const allImages = [...existingImageUrls, ...newUploadedUrls];

    if (allImages.length > 0) {
      productData.images = allImages;
      productData.image = allImages[0];
    } else if (!selectedProductId) {
      // Nouveau produit sans image — ok
      productData.images = [];
      productData.image = null;
    }

    showProgress('Sauvegarde...', 90);

    if (selectedProductId) {
      // Si on edit, supprimer les images retirées de Supabase
      const oldProduct = products.find(p => p.id === selectedProductId);
      if (oldProduct?.images) {
        const removedImages = (oldProduct.images || []).filter(url => !existingImageUrls.includes(url));
        await Promise.all(removedImages.map(url => deleteSupabaseImage(url)));
      }
      await db.collection('products').doc(selectedProductId).update(productData);
      showToast('✅ Produit mis à jour avec succès', 'success');
    } else {
      productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('products').add(productData);
      showToast('✅ Produit créé avec succès', 'success');
    }

    resetForm();
    await loadProducts();
    showProgress('Terminé !', 100);

  } catch (error) {
    console.error('Save error:', error);
    showToast(`❌ Erreur: ${error.message}`, 'error');
    hideProgress();
  } finally {
    isSubmitting = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  }
}

function parseCommaSeparated(value) {
  if (!value) return [];
  return value.split(',').map(v => v.trim()).filter(v => v.length > 0);
}

function editProduct(productId) {
  selectedProductId = productId;
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Remplir le formulaire
  setValue('pmName', product.name || '');
  setValue('pmDescription', product.description || '');
  setValue('pmCategory', product.category || '');
  setValue('pmPrice', product.price || '');
  setValue('pmOldPrice', product.oldPrice || '');
  setValue('pmStock', product.stock ?? '');
  setValue('pmColors', (product.colors || []).join(', '));
  setValue('pmSizes', (product.sizes || []).join(', '));

  // Charger images existantes
  existingImageUrls = Array.isArray(product.images) ? [...product.images] : (product.image ? [product.image] : []);
  imageFiles = [];
  updateImagePreviews();

  // Mettre à jour l'UI du formulaire
  const formTitle = document.getElementById('pmFormTitle');
  const submitText = document.getElementById('pmSubmitText');
  const submitBtn = document.getElementById('pmSubmitBtn');
  if (formTitle) formTitle.textContent = '✏️ Modifier le Produit';
  if (submitText) submitText.textContent = 'Mettre à jour';
  if (submitBtn) submitBtn.className = 'pm-btn pm-btn-warning';

  // Scroll vers le formulaire
  const sidebar = document.querySelector('.pm-sidebar');
  if (sidebar) sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function deleteProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('pmConfirmModal');
  const confirmText = document.getElementById('pmConfirmText');
  if (confirmText) {
    confirmText.textContent = `Supprimer "${product.name}" ? Cette action est irréversible et supprimera aussi toutes les images associées.`;
  }

  const confirmBtn = document.getElementById('pmConfirmBtn');
  if (confirmBtn) {
    // Nettoyer ancien handler
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

    newBtn.onclick = async () => {
      modal.classList.remove('active');
      showProgress('Suppression en cours...', 30);
      try {
        // Supprimer images Supabase
        const imagesToDelete = product.images || (product.image ? [product.image] : []);
        if (imagesToDelete.length > 0) {
          showProgress('Suppression des images...', 60);
          await Promise.all(imagesToDelete.map(url => deleteSupabaseImage(url)));
        }

        await db.collection('products').doc(productId).delete();
        showToast('✅ Produit supprimé avec succès', 'success');
        await loadProducts();
        showProgress('Terminé', 100);
      } catch (error) {
        showToast(`❌ Erreur suppression: ${error.message}`, 'error');
        hideProgress();
      }
    };
  }

  if (modal) modal.classList.add('active');
}

function resetForm() {
  const form = document.getElementById('pmProductForm');
  if (form) form.reset();
  selectedProductId = null;
  imageFiles = [];
  existingImageUrls = [];
  updateImagePreviews();

  const formTitle = document.getElementById('pmFormTitle');
  const submitText = document.getElementById('pmSubmitText');
  const submitBtn = document.getElementById('pmSubmitBtn');
  if (formTitle) formTitle.textContent = '➕ Ajouter un Produit';
  if (submitText) submitText.textContent = 'Ajouter Produit';
  if (submitBtn) submitBtn.className = 'pm-btn pm-btn-primary';
}

// ============================================
// RENDERING & UI
// ============================================

function renderProducts() {
  const search = document.getElementById('pmSearch')?.value.toLowerCase().trim() || '';

  const filtered = search
    ? products.filter(p =>
        (p.name || '').toLowerCase().includes(search) ||
        (p.description || '').toLowerCase().includes(search) ||
        (p.category || '').toLowerCase().includes(search)
      )
    : products;

  const lowStock = products.filter(p => (p.stock ?? 0) <= 5 && (p.stock ?? 0) > 0);
  const outOfStock = products.filter(p => (p.stock ?? 0) === 0);
  const promos = products.filter(p => p.oldPrice && p.oldPrice > p.price);

  const allEl = document.getElementById('pmAllProducts');
  const lowStockEl = document.getElementById('pmLowstockProducts');
  const outOfStockEl = document.getElementById('pmOutofstockProducts');
  const promoEl = document.getElementById('pmPromoProducts');

  if (allEl) allEl.innerHTML = renderProductsTable(filtered, search ? `${filtered.length} résultat(s) pour "${search}"` : null);
  if (lowStockEl) lowStockEl.innerHTML = lowStock.length === 0
    ? emptyState('📦', 'Aucun produit en stock faible')
    : renderProductsTable(lowStock);
  if (outOfStockEl) outOfStockEl.innerHTML = outOfStock.length === 0
    ? emptyState('✅', 'Aucun produit en rupture de stock')
    : renderProductsTable(outOfStock);
  if (promoEl) promoEl.innerHTML = promos.length === 0
    ? emptyState('🔥', 'Aucune promotion active')
    : renderProductsTable(promos);
}

function emptyState(icon, text) {
  return `<div class="pm-empty-state"><div class="pm-empty-state-icon">${icon}</div><div class="pm-empty-state-text">${text}</div></div>`;
}

function renderProductsTable(productList, subtitle = null) {
  if (productList.length === 0) {
    return emptyState('📭', 'Aucun produit trouvé');
  }

  const subtitleHTML = subtitle ? `<div class="pm-results-subtitle">${subtitle}</div>` : '';

  return `
    ${subtitleHTML}
    <div class="pm-products-list">
      <div class="pm-products-header">
        <div>Image</div>
        <div>Produit</div>
        <div>Prix</div>
        <div>Stock</div>
        <div>Catégorie</div>
        <div>Actions</div>
      </div>
      ${productList.map(p => {
        const stockClass = p.stock === 0 ? 'out' : p.stock <= 5 ? 'low' : 'ok';
        const stockIcon = p.stock === 0 ? '🔴' : p.stock <= 5 ? '⚠️' : '✅';
        const discountPct = (p.oldPrice && p.oldPrice > p.price)
          ? Math.round((1 - p.price / p.oldPrice) * 100)
          : null;

        return `
          <div class="pm-product-row" data-id="${p.id}">
            <div class="pm-product-img-wrap">
              <img src="${p.image || getPlaceholderImage()}" alt="${escapeHtml(p.name)}" class="pm-product-image" loading="lazy" onerror="this.src='${getPlaceholderImage()}'">
              ${p.images && p.images.length > 1 ? `<span class="pm-img-count-badge">${p.images.length}</span>` : ''}
            </div>
            <div class="pm-product-info">
              <div class="pm-product-name">${escapeHtml(p.name)}</div>
              <div class="pm-product-desc">${escapeHtml((p.description || '').substring(0, 55))}${p.description?.length > 55 ? '…' : ''}</div>
              ${p.colors?.length ? `<div class="pm-product-tags">${p.colors.slice(0, 3).map(c => `<span class="pm-tag color-tag">${escapeHtml(c)}</span>`).join('')}</div>` : ''}
            </div>
            <div class="pm-product-price-col">
              <div class="pm-product-price">${formatPrice(p.price)} G</div>
              ${p.oldPrice ? `<div class="pm-product-old-price">${formatPrice(p.oldPrice)} G</div>` : ''}
              ${discountPct ? `<span class="pm-discount-badge">-${discountPct}%</span>` : ''}
            </div>
            <div class="pm-product-stock ${stockClass}">
              ${stockIcon} ${p.stock ?? 'N/A'}
            </div>
            <div class="pm-product-cat">
              <span class="pm-cat-badge">${escapeHtml(p.category || '-')}</span>
            </div>
            <div class="pm-product-actions">
              <button class="pm-product-btn pm-product-btn-edit" onclick="editProduct('${p.id}')" title="Modifier">✏️</button>
              <button class="pm-product-btn pm-product-btn-delete" onclick="deleteProduct('${p.id}')" title="Supprimer">🗑️</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function updateStatistics() {
  const total = products.length;
  const lowStock = products.filter(p => (p.stock ?? 0) <= 5 && (p.stock ?? 0) > 0).length;
  const outOfStock = products.filter(p => (p.stock ?? 0) === 0).length;
  const totalInventory = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const promo = products.filter(p => p.oldPrice && p.oldPrice > p.price).length;
  const avgPrice = total > 0
    ? Math.round(products.reduce((sum, p) => sum + (p.price || 0), 0) / total)
    : 0;

  const statsEl = document.getElementById('pmStats');
  if (!statsEl) return;

  statsEl.innerHTML = `
    <div class="pm-stat-card">
      <div class="pm-stat-label">📦 Total Produits</div>
      <div class="pm-stat-value">${total}</div>
    </div>
    <div class="pm-stat-card warning">
      <div class="pm-stat-label">⚠️ Stock Faible</div>
      <div class="pm-stat-value">${lowStock}</div>
    </div>
    <div class="pm-stat-card danger">
      <div class="pm-stat-label">🔴 En Rupture</div>
      <div class="pm-stat-value">${outOfStock}</div>
    </div>
    <div class="pm-stat-card">
      <div class="pm-stat-label">📊 Stock Total</div>
      <div class="pm-stat-value">${totalInventory.toLocaleString('fr-FR')}</div>
    </div>
    <div class="pm-stat-card">
      <div class="pm-stat-label">💰 Prix Moyen</div>
      <div class="pm-stat-value">${avgPrice.toLocaleString('fr-FR')} G</div>
    </div>
    <div class="pm-stat-card promo">
      <div class="pm-stat-label">🎉 Promotions</div>
      <div class="pm-stat-value">${promo}</div>
    </div>
  `;
}

// ============================================
// SEARCH & FILTERING
// ============================================

let searchTimeout;
document.getElementById('pmSearch')?.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => renderProducts(), 250);
});

// ============================================
// TABS
// ============================================

function setupTabs() {
  document.querySelectorAll('.pm-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pm-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.pm-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');

      const key = tab.dataset.tab;
      const tabId = `pm${key.charAt(0).toUpperCase() + key.slice(1)}Products`;
      document.getElementById(tabId)?.classList.add('active');
    });
  });
}

// ============================================
// FORM HANDLING
// ============================================

function setupForm() {
  const form = document.getElementById('pmProductForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveProduct();
  });

  document.getElementById('pmAddNewBtn')?.addEventListener('click', () => {
    if (selectedProductId) {
      resetForm();
      showToast('ℹ️ Formulaire réinitialisé', 'info');
    } else {
      document.querySelector('.pm-sidebar')?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  document.getElementById('pmCancelBtn')?.addEventListener('click', () => {
    resetForm();
  });

  document.getElementById('pmConfirmCancel')?.addEventListener('click', () => {
    document.getElementById('pmConfirmModal')?.classList.remove('active');
  });

  document.getElementById('pmConfirmModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.classList.remove('active');
    }
  });
}

// ============================================
// AUTHENTICATION
// ============================================

auth.onAuthStateChanged(async (user) => {
  currentUser = user;

  if (!user) {
    console.warn('🔐 Non authentifié, redirection...');
    window.location.replace('./index.html');
    return;
  }

  try {
    const userDoc = await db.collection('users').doc(user.uid).get();
    isAdmin = userDoc.data()?.role === 'admin';

    if (!isAdmin) {
      console.warn('🔐 Accès refusé (non admin), redirection...');
      window.location.replace('./index.html');
      return;
    }

    await loadProducts();
  } catch (error) {
    console.error('🔐 Erreur auth:', error);
    window.location.replace('./index.html');
  }
});

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  auth.signOut().then(() => window.location.replace('./index.html'));
});

document.getElementById('backToAdmin')?.addEventListener('click', () => {
  window.location.href = './index.html';
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  setupImageUpload();
  setupTabs();
  setupForm();
  document.title = 'Gestion Produits — Total Lakay';
});