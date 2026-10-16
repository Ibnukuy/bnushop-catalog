/**
 * KATALOG REKOMENDASI BELANJA - GLOWÉRIVE BOTANICAL LUXURY THEME
 * Deep Forest Teal, Fresh Mint, Clean White, Modern & Simpel.
 * Mendukung Cloud Database Supabase & Sinkronisasi Realtime.
 */

const DEFAULT_PLACEHOLDER = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e6f4f1%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2218%22%20fill%3D%22%230f3e3c%22%20font-weight%3D%22bold%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3EBNUSHOP%3C%2Ftext%3E%3C%2Fsvg%3E";

class CatalogApp {
  constructor() {
    this.products = this.loadLocalProducts();
    this.wishlist = this.loadWishlist();
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.sortBy = 'recommended';
    this.selectedProduct = null;

    this.initElements();
    this.initEvents();
    this.renderCategories();
    this.renderProducts();

    // Sinkronisasi dengan Supabase jika aktif
    this.initSupabaseSync();
  }

  loadWishlist() {
    try {
      const saved = localStorage.getItem('user_catalog_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem('user_catalog_wishlist', JSON.stringify(this.wishlist));
    } catch (e) {}
  }

  toggleWishlist(productId) {
    const id = Number(productId);
    const index = this.wishlist.indexOf(id);
    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.showToast('Dihapus dari daftar favorit');
    } else {
      this.wishlist.push(id);
      this.showToast('Ditambahkan ke daftar favorit!');
    }
    this.saveWishlist();
    this.renderProducts();
  }

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

  async initSupabaseSync() {
    if (typeof supabaseService !== 'undefined' && supabaseService.isConfigured()) {
      await this.fetchProductsFromSupabase();
      this.subscribeRealtime();
    }
  }

  async fetchProductsFromSupabase() {
    try {
      const { data, error } = await supabaseService.client
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.warn('Gagal fetch Supabase:', error.message);
        return;
      }

      if (data && data.length > 0) {
        this.products = data.map(SupabaseService.mapFromDb);
        localStorage.setItem('catalog_products_data', JSON.stringify(this.products));
        this.renderCategories();
        this.renderProducts();
      }
    } catch (err) {
      console.error('Error fetch Supabase:', err);
    }
  }

  subscribeRealtime() {
    try {
      supabaseService.client
        .channel('public:products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          this.fetchProductsFromSupabase();
          this.showToast('Katalog diperbarui dari Cloud!');
        })
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription tidak aktif:', e);
    }
  }

  initElements() {
    this.searchInput = document.getElementById('searchInput');
    this.searchDrawer = document.getElementById('searchDrawer');
    this.categoryContainer = document.getElementById('categoryScroll');
    this.sortSelect = document.getElementById('sortSelect');
    this.productsGrid = document.getElementById('productsGrid');
    
    // Header Bag Count
    this.headerBagCount = document.getElementById('headerBagCount');
    
    // Modal Detail
    this.detailModal = document.getElementById('detailModal');
    this.detailModalContent = document.getElementById('detailModalContent');
    
    // Toast
    this.toastEl = document.getElementById('toastNotification');
    this.toastMessage = document.getElementById('toastMessage');
  }

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

  // Render Shop By Category (Circular Cards seperti di screenshot Glowérive)
  renderCategories() {
    if (!this.categoryContainer) return;

    this.categoryContainer.innerHTML = CATEGORIES.map(cat => {
      const isActive = this.activeCategory === cat.id ? 'active' : '';
      return `
        <div class="cat-circle-card ${isActive}" data-category="${cat.id}">
          <div class="cat-circle-frame">
            <img src="${cat.image || DEFAULT_PLACEHOLDER}" alt="${cat.name}" class="cat-circle-img" />
          </div>
          <div class="cat-circle-name">${cat.name}</div>
          <div class="cat-circle-explore">Explore</div>
        </div>
      `;
    }).join('');

    const cards = this.categoryContainer.querySelectorAll('.cat-circle-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const catId = card.getAttribute('data-category');
        this.setCategory(catId);
        // Scroll ke grid produk
        const target = document.getElementById('featuredSection');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  setCategory(catId) {
    this.activeCategory = catId;
    this.renderCategories();
    this.renderProducts();

    const activeCard = this.categoryContainer.querySelector(`.cat-circle-card[data-category="${catId}"]`);
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  getPlatformInfo(platformKey) {
    const key = (platformKey || 'other').toLowerCase();
    if (typeof MARKETPLACES !== 'undefined' && MARKETPLACES[key]) {
      return MARKETPLACES[key];
    }
    return {
      name: 'Toko Online',
      color: '#0F3E3C',
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

  // Render Grid Produk (Exact Match Card Style Glowérive)
  renderProducts() {
    if (!this.productsGrid) return;

    const filtered = this.getFilteredProducts();

    if (this.headerBagCount) {
      this.headerBagCount.textContent = this.products.length;
    }

    if (filtered.length === 0) {
      this.productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: #FFFFFF; border-radius: 16px; border: 1px dashed #DDEEE9;">
          <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--teal-primary); margin-bottom: 0.5rem;">Tidak Ada Produk</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.5rem;">
            Tidak ada produk yang cocok dengan pencarian atau filter yang dipilih.
          </p>
          <button class="btn-hero-primary" onclick="app.resetFilters()">
            Reset Filter
          </button>
        </div>
      `;
      return;
    }

    this.productsGrid.innerHTML = filtered.map(product => {
      // Tentukan Badge Status (seperti BEST SELLER, NEW, LIMITED, SALE pada screenshot)
      let badgeText = product.badgeText || (product.isFeatured ? 'BEST SELLER' : '');
      let badgeClass = 'badge-status';
      if (product.originalPrice && product.originalPrice > product.price) {
        const discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        badgeText = badgeText || `SALE -${discountPct}%`;
        badgeClass = 'badge-status badge-sale';
      }

      const badgeHtml = badgeText ? `<span class="${badgeClass}">${this.escapeHtml(badgeText)}</span>` : '';

      const originalPriceHtml = product.originalPrice && product.originalPrice > product.price 
        ? `<span class="price-discounted">${this.formatRupiah(product.originalPrice)}</span>` 
        : '';

      const isWishlisted = this.wishlist.includes(Number(product.id));
      const heartIconClass = isWishlisted ? 'fas fa-heart' : 'far fa-heart';
      const heartActiveClass = isWishlisted ? 'active' : '';

      const platInfo = this.getPlatformInfo(product.platform);
      const buyLink = product.productUrl || product.shopeeUrl || '#';

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
            ${badgeHtml}
            <button 
              type="button" 
              class="btn-card-wishlist ${heartActiveClass}" 
              onclick="event.stopPropagation(); app.toggleWishlist(${product.id})"
              title="Favorit"
            >
              <i class="${heartIconClass}"></i>
            </button>
          </div>

          <div class="card-body">
            <h3 class="card-title" onclick="app.openDetailModal(${product.id})" title="${this.escapeHtml(product.title)}">
              ${this.escapeHtml(product.title)}
            </h3>

            <div class="card-rating-row">
              <div class="stars-list">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
              <span class="reviews-count">(${product.soldCount || '245'})</span>
            </div>

            <div class="card-price-row">
              <span class="price-main">${this.formatRupiah(product.price)}</span>
              ${originalPriceHtml}
            </div>

            <div class="card-action-row">
              <a 
                href="${this.escapeHtml(buyLink)}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn-add-cart"
                title="Beli produk ini di ${platInfo.name}"
              >
                ${platInfo.label} &rarr;
              </a>
              <button 
                type="button" 
                class="btn-heart-action ${heartActiveClass}" 
                onclick="app.toggleWishlist(${product.id})"
                title="Simpan Favorit"
              >
                <i class="${heartIconClass}"></i>
              </button>
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
        <strong>Review & Alasan Rekomendasi</strong>
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
          Beli di ${secPlatInfo.name}
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

          <div class="card-rating-row" style="margin-bottom: 0.85rem;">
            <div class="stars-list" style="font-size: 0.85rem;">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <span class="reviews-count" style="font-size: 0.82rem;">(Teruji ${product.soldCount || 'Rekomendasi'})</span>
          </div>

          <div class="modal-price-box">
            <span class="modal-price-current">${this.formatRupiah(product.price)}</span>
            ${discountHtml}
          </div>

          <div class="modal-section-title">Deskripsi Produk</div>
          <div class="modal-desc-box">
            ${this.escapeHtml(product.description || 'Kurasi produk rekomendasi dengan kualitas dan keaslian terjamin.')}
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
              Salin Link
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
        this.showToast('Link berhasil disalin!');
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
      this.showToast('Link berhasil disalin!');
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
