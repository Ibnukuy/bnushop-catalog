/**
 * LOGIKA DASHBOARD ADMIN (admin.js)
 * Mengelola Otentikasi, CRUD Postingan Produk (Tambah, Edit, Hapus),
 * Toggle Produk Pilihan, Ekspor Data, dan Pengaturan Password.
 */

const DEFAULT_ADMIN_PASSWORD = 'admin123';
const DEFAULT_PLACEHOLDER = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f1f5f9%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20fill%3D%22%2394a3b8%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3EFoto%20Produk%3C%2Ftext%3E%3C%2Fsvg%3E";

class AdminManager {
  constructor() {
    this.products = this.loadProducts();
    this.editingProductId = null;
    this.searchQuery = '';
    
    this.initElements();
    this.checkAuthStatus();
    this.initEvents();
  }

  // Load Products
  loadProducts() {
    try {
      const saved = localStorage.getItem('catalog_products_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Gagal membaca data dari localStorage', e);
    }
    return typeof INITIAL_PRODUCTS !== 'undefined' ? [...INITIAL_PRODUCTS] : [];
  }

  saveProducts() {
    try {
      localStorage.setItem('catalog_products_data', JSON.stringify(this.products));
    } catch (e) {
      console.error('Gagal menyimpan produk ke localStorage', e);
    }
  }

  getAdminPassword() {
    return localStorage.getItem('catalog_admin_password') || DEFAULT_ADMIN_PASSWORD;
  }

  setAdminPassword(newPass) {
    localStorage.setItem('catalog_admin_password', newPass);
  }

  // Elemen DOM
  initElements() {
    this.loginScreen = document.getElementById('loginScreen');
    this.adminApp = document.getElementById('adminApp');
    this.loginForm = document.getElementById('loginForm');
    this.passwordInput = document.getElementById('adminPasswordInput');
    this.loginError = document.getElementById('loginError');

    // Dashboard
    this.statTotal = document.getElementById('statTotalProducts');
    this.statFeatured = document.getElementById('statFeaturedProducts');
    this.statTokopedia = document.getElementById('statTokopediaProducts');
    this.statCategories = document.getElementById('statCategoriesCount');

    // Table
    this.productsTableBody = document.getElementById('productsTableBody');
    this.adminSearchInput = document.getElementById('adminSearchInput');

    // Modal Form Postingan
    this.productModal = document.getElementById('productFormModal');
    this.modalTitle = document.getElementById('modalFormTitle');
    this.productForm = document.getElementById('productForm');
    this.imgUrlInput = document.getElementById('formImage');
    this.imgPreview = document.getElementById('formImagePreview');

    // Modal Ganti Password
    this.passwordModal = document.getElementById('passwordModal');
    this.passwordForm = document.getElementById('changePasswordForm');

    // Toast
    this.toastEl = document.getElementById('adminToast');
    this.toastMessage = document.getElementById('adminToastMessage');
  }

  // Cek Status Login
  checkAuthStatus() {
    const isLoggedIn = sessionStorage.getItem('catalog_admin_auth') === 'true';
    if (isLoggedIn) {
      this.showAdminDashboard();
    } else {
      this.showLoginScreen();
    }
  }

  showLoginScreen() {
    if (this.loginScreen) this.loginScreen.style.display = 'flex';
    if (this.adminApp) this.adminApp.style.display = 'none';
  }

  showAdminDashboard() {
    if (this.loginScreen) this.loginScreen.style.display = 'none';
    if (this.adminApp) this.adminApp.style.display = 'flex';
    this.renderStats();
    this.renderTable();
  }

  // Event Listeners
  initEvents() {
    // Submit Login
    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputVal = (this.passwordInput.value || '').trim();
        const correctPassword = this.getAdminPassword();

        if (inputVal === correctPassword) {
          sessionStorage.setItem('catalog_admin_auth', 'true');
          if (this.loginError) this.loginError.style.display = 'none';
          this.passwordInput.value = '';
          this.showAdminDashboard();
          this.showToast('Berhasil masuk ke Admin Panel!');
        } else {
          if (this.loginError) {
            this.loginError.textContent = 'Password salah! Default password adalah: admin123';
            this.loginError.style.display = 'block';
          }
        }
      });
    }

    // Toggle Password Visibility
    const togglePassBtn = document.getElementById('togglePasswordBtn');
    if (togglePassBtn) {
      togglePassBtn.addEventListener('click', () => {
        const type = this.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        this.passwordInput.setAttribute('type', type);
        togglePassBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
      });
    }

    // Form Tambah / Edit Submit
    if (this.productForm) {
      this.productForm.addEventListener('submit', (e) => this.handleProductFormSubmit(e));
    }

    // Live Image Preview
    if (this.imgUrlInput && this.imgPreview) {
      this.imgUrlInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        this.imgPreview.src = val || DEFAULT_PLACEHOLDER;
      });
    }

    // Search input
    if (this.adminSearchInput) {
      this.adminSearchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderTable();
      });
    }

    // Ganti Password Submit
    if (this.passwordForm) {
      this.passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const oldPass = document.getElementById('oldPassword').value.trim();
        const newPass = document.getElementById('newPassword').value.trim();
        const confirmPass = document.getElementById('confirmPassword').value.trim();

        if (oldPass !== this.getAdminPassword()) {
          alert('Password lama Anda tidak cocok!');
          return;
        }

        if (newPass.length < 4) {
          alert('Password baru minimal 4 karakter!');
          return;
        }

        if (newPass !== confirmPass) {
          alert('Konfirmasi password baru tidak cocok!');
          return;
        }

        this.setAdminPassword(newPass);
        this.closePasswordModal();
        this.showToast('Password admin berhasil diubah!');
      });
    }
  }

  // Logout
  logout() {
    if (confirm('Apakah Anda ingin keluar dari Admin Panel?')) {
      sessionStorage.removeItem('catalog_admin_auth');
      this.showLoginScreen();
      this.showToast('Anda telah keluar.');
    }
  }

  // Render Stats
  renderStats() {
    if (this.statTotal) this.statTotal.textContent = this.products.length;
    if (this.statFeatured) this.statFeatured.textContent = this.products.filter(p => p.isFeatured).length;
    
    const uniqueCats = new Set(this.products.map(p => p.category));
    if (this.statCategories) this.statCategories.textContent = uniqueCats.size;

    const tokpedCount = this.products.filter(p => p.platform === 'tokopedia').length;
    if (this.statTokopedia) this.statTokopedia.textContent = tokpedCount;
  }

  // Format Rupiah
  formatRupiah(num) {
    if (!num || isNaN(num)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  }

  // Render Table
  renderTable() {
    if (!this.productsTableBody) return;

    let filtered = [...this.products];
    if (this.searchQuery) {
      filtered = filtered.filter(p => {
        const titleMatch = (p.title || '').toLowerCase().includes(this.searchQuery);
        const catMatch = (p.category || '').toLowerCase().includes(this.searchQuery);
        const platMatch = (p.platform || '').toLowerCase().includes(this.searchQuery);
        return titleMatch || catMatch || platMatch;
      });
    }

    if (filtered.length === 0) {
      this.productsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 3rem; color: #64748B;">
            <i class="fas fa-box-open" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; color: #CBD5E1;"></i>
            Belum ada produk yang cocok dengan pencarian.
          </td>
        </tr>
      `;
      return;
    }

    this.productsTableBody.innerHTML = filtered.map(p => {
      const platKey = (p.platform || 'other').toLowerCase();
      const platName = (typeof MARKETPLACES !== 'undefined' && MARKETPLACES[platKey]) ? MARKETPLACES[platKey].name : platKey;
      const platIcon = (typeof MARKETPLACES !== 'undefined' && MARKETPLACES[platKey]) ? MARKETPLACES[platKey].icon : 'fas fa-store';
      const platClass = `badge-plat-${platKey}`;
      const starClass = p.isFeatured ? 'starred' : '';
      const starIcon = p.isFeatured ? 'fas fa-star' : 'far fa-star';

      const buyUrl = p.productUrl || p.shopeeUrl || '#';

      return `
        <tr>
          <td>
            <button 
              type="button" 
              class="star-toggle-btn ${starClass}" 
              onclick="admin.toggleFeatured(${p.id})"
              title="${p.isFeatured ? 'Klik untuk batal jadikan pilihan' : 'Klik untuk jadikan Produk Pilihan'}"
            >
              <i class="${starIcon}"></i>
            </button>
          </td>
          <td>
            <div class="product-cell">
              <img 
                src="${p.image || DEFAULT_PLACEHOLDER}" 
                alt="${this.escapeHtml(p.title)}" 
                class="product-thumb" 
                onerror="this.src='${DEFAULT_PLACEHOLDER}'"
              />
              <div>
                <div class="product-info-title" title="${this.escapeHtml(p.title)}">
                  ${this.escapeHtml(p.title)}
                </div>
                <div class="product-info-subtitle">
                  ID: ${p.id} ${p.badgeText ? '• <span style="color:#EE4D2D; font-weight:600;">' + this.escapeHtml(p.badgeText) + '</span>' : ''}
                </div>
              </div>
            </div>
          </td>
          <td>
            <span style="text-transform: capitalize; font-weight: 600;">${p.category || '-'}</span>
          </td>
          <td>
            <span class="badge-plat-tag ${platClass}">
              <i class="${platIcon}"></i> ${platName}
            </span>
          </td>
          <td>
            <strong style="color: #0F172A;">${this.formatRupiah(p.price)}</strong>
            ${p.originalPrice && p.originalPrice > p.price ? `<br><small style="text-decoration: line-through; color: #94A3B8;">${this.formatRupiah(p.originalPrice)}</small>` : ''}
          </td>
          <td>
            <div class="row-actions">
              <a 
                href="${this.escapeHtml(buyUrl)}" 
                target="_blank" 
                class="btn-table-action" 
                title="Buka Link Produk"
              >
                <i class="fas fa-external-link-alt"></i>
              </a>
              <button 
                type="button" 
                class="btn-table-action btn-table-edit" 
                onclick="admin.openEditModal(${p.id})"
                title="Edit Postingan"
              >
                <i class="fas fa-pen"></i>
              </button>
              <button 
                type="button" 
                class="btn-table-action btn-table-delete" 
                onclick="admin.deleteProduct(${p.id})"
                title="Hapus Postingan"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Toggle Bintang Produk Pilihan
  toggleFeatured(productId) {
    const item = this.products.find(p => p.id === productId);
    if (!item) return;

    item.isFeatured = !item.isFeatured;
    this.saveProducts();
    this.renderStats();
    this.renderTable();
    this.showToast(item.isFeatured ? 'Ditandai sebagai ⭐ Produk Pilihan!' : 'Dihapus dari Produk Pilihan.');
  }

  // Hapus Produk
  deleteProduct(productId) {
    const item = this.products.find(p => p.id === productId);
    if (!item) return;

    if (confirm(`Apakah Anda yakin ingin menghapus postingan: "${item.title}"?`)) {
      this.products = this.products.filter(p => p.id !== productId);
      this.saveProducts();
      this.renderStats();
      this.renderTable();
      this.showToast('Postingan berhasil dihapus!');
    }
  }

  // Modal Tambah Postingan Baru
  openAddModal() {
    this.editingProductId = null;
    this.modalTitle.textContent = 'Tambah Postingan Produk Baru';
    this.productForm.reset();
    document.getElementById('formFeatured').checked = true;
    if (this.imgPreview) this.imgPreview.src = DEFAULT_PLACEHOLDER;
    this.productModal.classList.add('active');
  }

  // Modal Edit Postingan
  openEditModal(productId) {
    const item = this.products.find(p => p.id === productId);
    if (!item) return;

    this.editingProductId = productId;
    this.modalTitle.textContent = 'Edit Postingan Produk';

    document.getElementById('formTitle').value = item.title || '';
    document.getElementById('formCategory').value = item.category || 'fashion';
    document.getElementById('formPlatform').value = item.platform || 'tokopedia';
    document.getElementById('formProductUrl').value = item.productUrl || item.shopeeUrl || '';
    document.getElementById('formPrice').value = item.price || '';
    document.getElementById('formOriginalPrice').value = item.originalPrice || '';
    document.getElementById('formImage').value = item.image || '';
    document.getElementById('formDescription').value = item.description || '';
    document.getElementById('formRecommendation').value = item.recommendationReason || '';
    document.getElementById('formBadgeText').value = item.badgeText || '';
    document.getElementById('formFeatured').checked = !!item.isFeatured;

    // Optional Secondary link
    document.getElementById('formSecondaryPlatform').value = item.secondaryPlatform || '';
    document.getElementById('formSecondaryUrl').value = item.secondaryUrl || '';

    if (this.imgPreview) {
      this.imgPreview.src = item.image || DEFAULT_PLACEHOLDER;
    }

    this.productModal.classList.add('active');
  }

  closeProductModal() {
    if (this.productModal) {
      this.productModal.classList.remove('active');
      this.editingProductId = null;
      this.productForm.reset();
    }
  }

  // Handle Form Submit (Create or Update)
  handleProductFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('formTitle').value.trim();
    const category = document.getElementById('formCategory').value;
    const platform = document.getElementById('formPlatform').value;
    const productUrl = document.getElementById('formProductUrl').value.trim();
    const price = parseInt(document.getElementById('formPrice').value, 10);
    const originalPrice = document.getElementById('formOriginalPrice').value ? parseInt(document.getElementById('formOriginalPrice').value, 10) : null;
    const image = document.getElementById('formImage').value.trim() || DEFAULT_PLACEHOLDER;
    const description = document.getElementById('formDescription').value.trim();
    const recommendationReason = document.getElementById('formRecommendation').value.trim();
    const badgeText = document.getElementById('formBadgeText').value.trim();
    const isFeatured = document.getElementById('formFeatured').checked;

    const secondaryPlatform = document.getElementById('formSecondaryPlatform').value || null;
    const secondaryUrl = document.getElementById('formSecondaryUrl').value.trim() || null;

    if (!title || isNaN(price) || !productUrl) {
      alert('Mohon isi judul, harga, dan link belanja produk.');
      return;
    }

    if (this.editingProductId) {
      // Update existing
      const index = this.products.findIndex(p => p.id === this.editingProductId);
      if (index !== -1) {
        this.products[index] = {
          ...this.products[index],
          title,
          category,
          platform,
          productUrl,
          price,
          originalPrice,
          image,
          description,
          recommendationReason,
          badgeText: badgeText || (isFeatured ? '⭐ Pilihan Kami' : ''),
          isFeatured,
          secondaryPlatform,
          secondaryUrl
        };
        this.showToast('Postingan produk berhasil diperbarui!');
      }
    } else {
      // Create new
      const newProduct = {
        id: Date.now(),
        title,
        category,
        platform,
        productUrl,
        price,
        originalPrice,
        rating: 5.0,
        soldCount: 'Baru',
        image,
        description,
        recommendationReason,
        badgeText: badgeText || (isFeatured ? '⭐ Baru & Pilihan' : 'Baru'),
        isFeatured,
        secondaryPlatform,
        secondaryUrl
      };
      this.products.unshift(newProduct);
      this.showToast('Postingan produk baru berhasil ditambahkan!');
    }

    this.saveProducts();
    this.closeProductModal();
    this.renderStats();
    this.renderTable();
  }

  // Modal Ganti Password
  openPasswordModal() {
    if (this.passwordModal) {
      this.passwordForm.reset();
      this.passwordModal.classList.add('active');
    }
  }

  closePasswordModal() {
    if (this.passwordModal) {
      this.passwordModal.classList.remove('active');
      this.passwordForm.reset();
    }
  }

  // Ekspor Data ke File / Clipboard
  exportData() {
    const codeContent = `/**
 * DATA PRODUK REKOMENDASI BELANJA MULTI-MARKETPLACE
 * Otomatis diekspor dari Admin Panel pada ${new Date().toLocaleString('id-ID')}
 */

const MARKETPLACES = ${JSON.stringify(MARKETPLACES, null, 2)};

const CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)};

const INITIAL_PRODUCTS = ${JSON.stringify(this.products, null, 2)};
`;

    // Coba salin ke clipboard
    navigator.clipboard.writeText(codeContent).then(() => {
      this.showToast('Kode data berhasil disalin ke clipboard!');
      alert('Kode data produk telah disalin ke Clipboard! Anda bisa menempelkannya ke file "js/data.js" agar permanen di server/hosting.');
    }).catch(() => {
      // Download file sebagai alternatif
      const blob = new Blob([codeContent], { type: 'text/javascript' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'data.js';
      a.click();
      this.showToast('File data.js berhasil diunduh!');
    });
  }

  // Reset ke data awal bawaan
  resetToDefault() {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin menghapus semua perubahan dan mengembalikan ke data awal bawaan?')) {
      localStorage.removeItem('catalog_products_data');
      this.products = typeof INITIAL_PRODUCTS !== 'undefined' ? [...INITIAL_PRODUCTS] : [];
      this.renderStats();
      this.renderTable();
      this.showToast('Data berhasil di-reset ke bawaan awal.');
    }
  }

  // Toast
  showToast(message) {
    if (!this.toastEl || !this.toastMessage) return;
    this.toastMessage.textContent = message;
    this.toastEl.classList.add('show');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, 3000);
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

let admin;
document.addEventListener('DOMContentLoaded', () => {
  admin = new AdminManager();
});

