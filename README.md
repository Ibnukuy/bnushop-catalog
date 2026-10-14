# 🕊️ Olivienne | Curated Catalog & Recommendations

Katalog rekomendasi barang belanja pilihan dengan estetika **Quiet Luxury**, modern, simpel, dan elegan (terinspirasi dari desain editorial *high-fashion* seperti Olivienne, The Row, dan Céline).

Mendukung kurasi link belanja multi-platform (**Tokopedia**, **Shopee**, **TikTok Shop**, dan toko resmi lainnya) lengkap dengan **Panel Admin Mandiri (`admin.html`)** yang terlindungi password/PIN.

---

## 🎨 Karakter Desain "Modern, Simpel & Kelihatan Mahal"

1. **Palet Warna Warm Alabaster / Ivory (`#FAF9F5`)**: Nuansa kertas majalah premium yang hangat, bersih, dan menenangkan mata tanpa warna-warna neon yang mencolok.
2. **Tipografi Editorial Bergengsi**:
   - Judul & Logo: Menggunakan *Playfair Display* & *Cormorant Garamond* Serif yang anggun dan berkelas.
   - Konten & Harga: Menggunakan sans-serif modern *Plus Jakarta Sans* dengan *letter-spacing* yang lega dan presisi.
3. **Bingkai Produk Berasio 3:4 Portret**: Foto barang dipajang di atas alas frame netral (`#F3F1EC`) dengan transisi *smooth zoom hover*.
4. **Detail Produk Terpusat (Centered Minimalist Typography)**:
   - Nama produk minimalis di bagian tengah.
   - Format harga elegan dengan harga coret diskon yang rapi.
   - Indikator marketplace micro-dot (`● Tokopedia`, `● Shopee`, `● TikTok Shop`).
   - Tombol belanja monokrom hitam minimalis (*"Beli di Tokopedia →"*).
5. **Sub-Bar Editorial**:
   - Breadcrumb di kiri: *Shop • Curated Items • View All*.
   - Counter barang di kanan: *12 items • Filter*.
6. **Drawer Pencarian Minimalis**: Mengklik ikon kaca pembesar akan membuka bilah pencarian ramping yang elegan.

---

## 📁 Struktur File

```text
Catalog Online/
├── index.html          # Halaman publik katalog mewah (tampilan pengunjung)
├── admin.html          # Halaman portal login & admin panel khusus pemilik
├── css/
│   ├── style.css       # Desain Quiet Luxury / Editorial Fashion
│   └── admin.css       # Desain dashboard studio admin yang serasi
├── js/
│   ├── data.js         # Sumber data produk kurasi & marketplace
│   ├── app.js          # Logika katalog publik (kategori, search drawer, modal)
│   └── admin.js        # Logika otentikasi login, CRUD postingan & ekspor
├── assets/
│   └── images/         # Penyimpanan foto produk lokal
└── README.md           # Panduan penggunaan
```

---

## 🚀 Cara Menjalankan

### 1. Membuka Halaman Katalog Pengunjung
- Cukup klik dua kali file **[index.html](file:///c:/Users/ADVAN/OneDrive/Dokumen/Catalog%20Online/index.html)**.
- Katalog akan langsung terbuka di browser dengan tampilan minimalis dan mewah.

### 2. Membuka Halaman Admin (Khusus Anda)
- Buka file **[admin.html](file:///c:/Users/ADVAN/OneDrive/Dokumen/Catalog%20Online/admin.html)** (atau klik ikon profil `👤` di pojok kanan atas katalog).
- Masukkan password:
  ```text
  admin123
  ```
- Di dalam dashboard admin, Anda dapat:
  - ➕ **Tambah postingan produk baru** (masukkan link Tokopedia, Shopee, TikTok Shop, foto, dan harga).
  - ✏️ **Edit postingan yang ada** kapan saja.
  - 🗑️ **Hapus produk** yang sudah habis/tidak direkomendasikan.
  - ⭐ **Toggle 1-klik** untuk produk pilihan utama (*Editor's Pick*).
  - 🔑 **Ganti password** admin.
  - 💾 **Ekspor ke data.js** untuk menyimpan perubahan secara permanen saat di-deploy ke internet.
