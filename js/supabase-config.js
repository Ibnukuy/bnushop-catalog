/**
 * SUPABASE CONFIGURATION & CLIENT WRAPPER
 * Mengatur koneksi cloud database Supabase untuk Katalog Belanja.
 * Anda dapat memasukkan URL & Anon Key di file ini, atau melalui menu "Koneksi Database" di admin.html.
 */

const SUPABASE_CONFIG = {
  // Masukkan Project URL Supabase Anda di sini (misal: https://xyzcompany.supabase.co)
  url: '',
  // Masukkan Public Anon Key Supabase Anda di sini (dimulai dengan eyJhbGciOi...)
  anonKey: ''
};

class SupabaseService {
  constructor() {
    this.client = null;
    this.initClient();
  }

  // Ambil config dari localStorage jika pernah disimpan lewat form admin, atau gunakan config default
  getConfig() {
    const savedUrl = localStorage.getItem('supabase_project_url');
    const savedKey = localStorage.getItem('supabase_anon_key');

    return {
      url: (savedUrl || SUPABASE_CONFIG.url || '').trim(),
      anonKey: (savedKey || SUPABASE_CONFIG.anonKey || '').trim()
    };
  }

  saveConfig(url, anonKey) {
    localStorage.setItem('supabase_project_url', (url || '').trim());
    localStorage.setItem('supabase_anon_key', (anonKey || '').trim());
    this.initClient();
  }

  clearConfig() {
    localStorage.removeItem('supabase_project_url');
    localStorage.removeItem('supabase_anon_key');
    this.client = null;
  }

  initClient() {
    const { url, anonKey } = this.getConfig();
    if (url && anonKey && typeof window.supabase !== 'undefined') {
      try {
        this.client = window.supabase.createClient(url, anonKey);
      } catch (err) {
        console.error('Inisialisasi Supabase gagal:', err);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  isConfigured() {
    const { url, anonKey } = this.getConfig();
    return !!(url && anonKey && this.client);
  }

  // Format dari kolom database Supabase ke model produk aplikasi
  static mapFromDb(row) {
    return {
      id: row.id,
      title: row.title,
      category: row.category,
      platform: row.platform,
      productUrl: row.product_url,
      secondaryPlatform: row.secondary_platform,
      secondaryUrl: row.secondary_url,
      price: Number(row.price),
      originalPrice: row.original_price ? Number(row.original_price) : null,
      rating: Number(row.rating || 5.0),
      soldCount: row.sold_count || 'Curated',
      image: row.image,
      description: row.description,
      recommendationReason: row.recommendation_reason,
      badgeText: row.badge_text,
      isFeatured: !!row.is_featured,
      createdAt: row.created_at
    };
  }

  // Format dari model produk aplikasi ke kolom database Supabase
  static mapToDb(item) {
    const payload = {
      title: item.title,
      category: item.category,
      platform: item.platform,
      product_url: item.productUrl || item.shopeeUrl || '',
      secondary_platform: item.secondaryPlatform || null,
      secondary_url: item.secondaryUrl || null,
      price: Number(item.price),
      original_price: item.originalPrice ? Number(item.originalPrice) : null,
      rating: Number(item.rating || 5.0),
      sold_count: item.soldCount || 'Curated',
      image: item.image,
      description: item.description || '',
      recommendation_reason: item.recommendationReason || '',
      badge_text: item.badgeText || '',
      is_featured: !!item.isFeatured
    };

    return payload;
  }
}

// Inisialisasi instance global
const supabaseService = new SupabaseService();
