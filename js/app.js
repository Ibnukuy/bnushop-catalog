/**
 * KATALOG REKOMENDASI BELANJA - OLIVIENNE EDITORIAL LUXURY EDITION
 * Didukung Cloud Database Supabase & Sinkronisasi Realtime.
 */

const DEFAULT_PLACEHOLDER = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22533%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f3f1ec%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22serif%22%20font-size%3D%2218%22%20fill%3D%22%23a1a1aa%22%20letter-spacing%3D%222%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3EOLIVIENNE%3C%2Ftext%3E%3C%2Fsvg%3E";

class CatalogApp {
  constructor() {
    this.products = this.loadLocalProducts();
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.sortBy = 'recommended';
    this.selectedProduct = null;

    this.initElements();
    this.initEvents();
    this.renderCategories();
    this.renderProducts();

    // Muat data dari Supabase jika sudah dikonfigurasi
    this.initSupabaseSync();
  }

  // Muat produk lokal (fallback instan)
  loadLocalProducts() {
    try {
      const saved = localStorage.getItem('catalog_products_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Gagal membaca data dari localStorage', e);
    }
    return typeof INITIAL_PRODUCTS !== 'undefined' ? [...INITIAL_PRODUCTS] : [];
  }

  // Inisialisasi Supabase
  async initSupabaseSync() {
    if (typeof supabaseService !== 'undefined' && supabaseService.isConfigured()) {
      await this.fetchProductsFromSupabase();
      this.subscribeRealtime();
    }
  }

  // Ambil produk dari Cloud Database Supabase
  async fetchProductsFromSupabase() {
    try {
      const { data, error } = await supabaseService.client
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.warn('Gagal mengambil data dari Supabase:', error.message);
        return;
      }

      if (data && data.length > 0) {
        this.products = data.map(SupabaseService.mapFromDb);
        // Simpan cache lokal
        localStorage.setItem('catalog_products_data', JSON.stringify(this.products));
        this.renderCategories();
        this.renderProducts();
      }
    } catch (err) {
      console.error('Error fetch Supabase:', err);
    }
  }

  // Langganan pembaruan realtime dari Supabase
  subscribeRealtime() {
    try {
      supabaseService.client
        .channel('public:products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
          this.fetchProductsFromSupabase();
          this.showToast('Katalog otomatis diperbarui dari Cloud!');
        })
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription tidak aktif:', e);
    }
  }

  // Inisialisasi Elemen DOM
  initElements() {
    this.searchInput = document.getElementById('searchInput');
    this.searchDrawer = document.getElementById('searchDrawer');
    this.categoryContainer = document.getElementById('categoryScroll');
    this.sortSelect = document.getElementById('sortSelect');
    this.productsGrid = document.getElementById('productsGrid');
    
    // Breadcrumbs & Counter
    this.breadcrumbCategory = document.getElementById('breadcrumbCategory');
    this.breadcrumbView = document.getElementById('breadcrumbView');
    this.itemsCountDisplay = document.getElementById('itemsCountDisplay');
    this.headerBagCount = document.getElementById('headerBagCount');
    
    // Modal Detail
    this.detailModal = document.getElementById('detailModal');
    this.detailModalContent = document.getElementById('detailModalContent');
    
    // Toast
    this.toastEl = document.getElementById('toastNotification');
    this.toastMessage = document.getElementById('toastMessage');
  }

  // Setup Event Listeners
  initEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderProducts();
      });
    }

    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderProducts();
      });
    }

    window.addEventListener('click', (e) => {
      if (e.target === this.detailModal) this.closeDetailModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDetailModal();
        this.toggleSearchDrawer(false);
      }
    });

    // Real-time synchronization tab sebelah
    window.addEventListener('storage', (e) => {
      if (e.key === 'catalog_products_data') {
        this.products = this.loadLocalProducts();
        this.renderCategories();
        this.renderProducts();
      }
    });
  }

  toggleSearchDrawer(force) {
    if (!this.searchDrawer) return;
    const shouldOpen = typeof force === 'boolean' ? force : !this.searchDrawer.classList.contains('active');
    
    if (shouldOpen) {
      this.searchDrawer.classList.add('active');
      if (this.searchInput) {
        this.searchInput.focus();
      }
    } else {
      this.searchDrawer.classList.remove('active');
    }
  }

  formatRupiah(number) {
    if (!number || isNaN(number)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  }

  getProductCountByCategory(catId) {
    if (catId === 'all') return this.products.length;
    if (catId === 'featured') return this.products.filter(p => p.isFeatured).length;
    return this.products.filter(p => p.category === catId).length;
  }

  renderCategories() {
    if (!this.categoryContainer) return;

    this.categoryContainer.innerHTML = CATEGORIES.map(cat => {
      const count = this.getProductCountByCategory(cat.id);
      const isActive = this.activeCategory === cat.id ? 'active' : '';
      return `
        <button type="button" class="cat-btn ${isActive}" data-category="${cat.id}">
          ${cat.name} (${count})
        </button>
      `;
    }).join('');

    const btns = this.categoryContainer.querySelectorAll('.cat-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.getAttribute('data-category');
        this.setCategory(catId);
      });
    });
  }

  setCategory(catId) {
    this.activeCategory = catId;
    this.renderCategories();
    this.renderProducts();

    const activeBtn = this.categoryContainer.querySelector(`.cat-btn[data-category="${catId}"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  getPlatformInfo(platformKey) {
    const key = (platformKey || 'other').toLowerCase();
    if (typeof MARKETPLACES !== 'undefined' && MARKETPLACES[key]) {
      return MARKETPLACES[key];
    }
    return {
      name: 'Toko Online',
      color: '#18181B',
      icon: 'fas fa-external-link-alt',
      label: 'Beli Sekarang',
      badgeClass: 'badge-other'
    };
  }

  getFilteredProducts() {
    let result = [...this.products];

    if (this.activeCategory === 'featured') {
      result = result.filter(item => item.isFeatured === true);
    } else if (this.activeCategory !== 'all') {
      result = result.filter(item => item.category === this.activeCategory);
    }

    if (this.searchQuery) {
      result = result.filter(item => {
        const titleMatch = (item.title || '').toLowerCase().includes(this.searchQuery);
        const descMatch = (item.description || '').toLowerCase().includes(this.searchQuery);
        const catMatch = (item.category || '').toLowerCase().includes(this.searchQuery);
        const platMatch = (item.platform || '').toLowerCase().includes(this.searchQuery);
        return titleMatch || descMatch || catMatch || platMatch;
      });
    }

    result.sort((a, b) => {
      if (this.sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (this.sortBy === 'price-high') {
        return b.price - a.price;
      }
      if (this.sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (a.isFeatured !== b.isFeatured) {
        return a.isFeatured ? -1 : 1;
      }
      return (b.rating || 0) - (a.rating || 0);
    });

    return result;
  }

  renderProducts() {
    if (!this.productsGrid) return;

    const filtered = this.getFilteredProducts();

    if (this.itemsCountDisplay) {
      this.itemsCountDisplay.textContent = `${filtered.length} items`;
    }
    if (this.headerBagCount) {
      this.headerBagCount.textContent = this.products.length;
    }

    if (this.breadcrumbCategory) {
      const activeCatObj = CATEGORIES.find(c => c.id === this.activeCategory);
      this.breadcrumbCategory.textContent = activeCatObj ? activeCatObj.name : 'Curated Items';
    }

    if (this.breadcrumbView) {
      this.breadcrumbView.textContent = this.searchQuery ? `Search "${this.searchQuery}"` : 'View All';
    }

    if (filtered.length === 0) {
      this.productsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h3 class="empty-state-title">No products found</h3>
          <p class="empty-state-desc">
            Tidak ada koleksi yang cocok dengan filter atau pencarian saat ini.
          </p>
          <button class="btn-reset-filter" onclick="app.resetFilters()">
            Reset Filter
          </button>
        </div>
      `;
      return;
    }

    this.productsGrid.innerHTML = filtered.map(product => {
      let discountBadge = '';
      if (product.originalPrice && product.originalPrice > product.price) {
        const discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        discountBadge = `<span class="badge-tag">-${discountPct}%</span>`;
      }

      const featuredBadge = product.isFeatured 
        ? `<span class="badge-featured">Editor's Pick</span>` 
        : '';

      const originalPriceHtml = product.originalPrice && product.originalPrice > product.price 
        ? `<span class="price-original">${this.formatRupiah(product.originalPrice)}</span>` 
        : '';

      const platInfo = this.getPlatformInfo(product.platform);
      const buyLink = product.productUrl || product.shopeeUrl || '#';
      const dotClass = `dot-${product.platform || 'other'}`;

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="card-img-wrapper" onclick="app.openDetailModal(${product.id})">
            <img 
              src="${product.image || DEFAULT_PLACEHOLDER}" 
              alt="${this.escapeHtml(product.title)}" 
              class="card-img" 
              loading="lazy" 
              onerror="this.src='${DEFAULT_PLACEHOLDER}'"
            />
            <div class="card-badges">
              ${featuredBadge}
              ${discountBadge}
            </div>
          </div>

          <div class="card-body">
            <div class="platform-micro-tag" onclick="app.openDetailModal(${product.id})">
              <span class="platform-dot ${dotClass}"></span>
              <span>${platInfo.name}</span>
            </div>

            <h3 class="card-title" onclick="app.openDetailModal(${product.id})" title="${this.escapeHtml(product.title)}">
              ${this.escapeHtml(product.title)}
            </h3>

            <div class="card-price-box" onclick="app.openDetailModal(${product.id})">
              ${originalPriceHtml}
              <span class="price-current">${this.formatRupiah(product.price)}</span>
            </div>

            <div class="card-actions">
              <a 
                href="${this.escapeHtml(buyLink)}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn-luxury-buy"
                title="Beli produk ini di ${platInfo.name}"
              >
                ${platInfo.label} &rarr;
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  resetFilters() {
    this.activeCategory = 'all';
    this.searchQuery = '';
    if (this.searchInput) this.searchInput.value = '';
    this.toggleSearchDrawer(false);
    this.renderCategories();
    this.renderProducts();
  }

  openDetailModal(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    this.selectedProduct = product;
    const platInfo = this.getPlatformInfo(product.platform);
    const mainBuyLink = product.productUrl || product.shopeeUrl || '#';

    let discountHtml = '';
    if (product.originalPrice && product.originalPrice > product.price) {
      discountHtml = `
        <span class="modal-price-original">${this.formatRupiah(product.originalPrice)}</span>
      `;
    }

    const recommendationHtml = product.recommendationReason ? `
      <div class="modal-recommendation-box">
        <strong>Curator's Note</strong>
        <p>${this.escapeHtml(product.recommendationReason)}</p>
      </div>
    ` : '';

    let secondaryBtnHtml = '';
    if (product.secondaryUrl) {
      const secPlatInfo = this.getPlatformInfo(product.secondaryPlatform);
      secondaryBtnHtml = `
        <a 
          href="${this.escapeHtml(product.secondaryUrl)}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="modal-btn-secondary"
        >
          Check on ${secPlatInfo.name}
        </a>
      `;
    }

    this.detailModalContent.innerHTML = `
      <div class="modal-product-layout">
        <div class="modal-img-wrapper">
          <img 
            src="${product.image || DEFAULT_PLACEHOLDER}" 
            alt="${this.escapeHtml(product.title)}" 
            class="modal-img"
            onerror="this.src='${DEFAULT_PLACEHOLDER}'"
          />
        </div>

        <div class="modal-info-col">
          <div class="modal-category-meta">
            ${product.category} &bull; ${platInfo.name}
          </div>

          <h2 class="modal-title">${this.escapeHtml(product.title)}</h2>

          <div class="modal-price-box">
            <span class="modal-price-current">${this.formatRupiah(product.price)}</span>
            ${discountHtml}
          </div>

          <div class="modal-section-title">Product Details</div>
          <div class="modal-desc-box">
            ${this.escapeHtml(product.description || 'Kurasi barang pilihan dengan kualitas dan estetika teruji.')}
          </div>

          ${recommendationHtml}

          <div class="modal-actions">
            <a 
              href="${this.escapeHtml(mainBuyLink)}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="modal-btn-buy"
            >
              ${platInfo.label} &rarr;
            </a>
            ${secondaryBtnHtml}
            <button 
              type="button" 
              class="modal-btn-copy" 
              onclick="app.copyLink('${this.escapeHtml(mainBuyLink)}')"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    `;

    this.detailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeDetailModal() {
    if (this.detailModal) {
      this.detailModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  copyLink(url) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(() => {
        this.showToast('Link berhasil disalin');
      }).catch(() => {
        this.fallbackCopy(url);
      });
    } else {
      this.fallbackCopy(url);
    }
  }

  fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      this.showToast('Link berhasil disalin');
    } catch (err) {
      prompt("Salin link:", text);
    }
    document.body.removeChild(textArea);
  }

  showToast(message) {
    if (!this.toastEl || !this.toastMessage) return;
    this.toastMessage.textContent = message;
    this.toastEl.classList.add('show');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, 2800);
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

let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new CatalogApp();
});
