# 🕊️ Olivienne (BNUSHOP) | Curated Catalog & Recommendations

Katalog rekomendasi barang belanja pilihan dengan estetika **Quiet Luxury**, modern, simpel, dan elegan (terinspirasi dari desain editorial *high-fashion* seperti Olivienne, The Row, dan Céline).

Mendukung kurasi link belanja multi-platform (**Tokopedia**, **Shopee**, **TikTok Shop**, dan toko resmi lainnya) lengkap dengan **Cloud Database Supabase** dan **Panel Admin Mandiri (`admin.html`)**.

---

## ⚡ Fitur Cloud Database Supabase

Dengan integrasi **Supabase Cloud Database**:
1. **Pembaruan Global Realtime**: Produk yang Anda tambah, edit, atau hapus di `admin.html` langsung ter-update di seluruh dunia (HP pengunjung, laptop, dll) tanpa perlu push ulang ke GitHub!
2. **Realtime Subscription**: Pengunjung yang sedang membuka katalog akan melihat barang baru muncul secara otomatis (*live*) tanpa reload halaman.
3. **Fallback Pintar**: Jika Supabase belum dikonfigurasi, sistem otomatis menggunakan data lokal sehingga website tetap berjalan lancar tanpa error.
4. **Migrasi 1-Klik**: Tombol *"Migrasikan ke Supabase"* di dashboard admin langsung mengunggah semua produk katalog ke database cloud Anda.

---

## 🛠️ Cara Menghubungkan ke Supabase (3 Langkah Mudah)

### Langkah 1: Buat Proyek di Supabase
1. Buka [https://supabase.com](https://supabase.com) dan buat akun (bisa login dengan akun GitHub).
2. Klik **"New project"**, beri nama misalnya: `catalog-online` dan buat database password.
3. Tunggu ~1 menit hingga database selesai dibuat.

### Langkah 2: Jalankan Script SQL
1. Di dashboard Supabase, klik menu **SQL Editor** (ikon terminal/dokumen di sidebar kiri).
2. Buka file **`supabase-schema.sql`** di proyek ini, salin (copy) seluruh kodenya.
3. Tempel (paste) ke SQL Editor di Supabase, lalu klik tombol **"Run"** (Ctrl+Enter).
4. Tabel `products`, hak akses public read, dan realtime replication sudah otomatis aktif!

### Langkah 3: Masukkan API Key di Admin Panel
1. Di Supabase, buka menu **Project Settings > API** (ikon roda gigi di kiri bawah).
2. Salin:
   - **Project URL** (misal: `https://xyzabcdef.supabase.co`)
   - **Project API keys: `anon` `public`** (dimulai dengan `eyJhbGci...`)
3. Buka **[admin.html](file:///c:/Users/ADVAN/OneDrive/Dokumen/Catalog%20Online/admin.html)** di browser, klik tombol **"Supabase"** di navigasi atas.
4. Masukkan Project URL dan Anon Key Anda, lalu klik **"Tes Koneksi & Simpan"**.
5. Klik tombol **"Migrasikan ke Supabase"** di toolbar untuk mengunggah 12 produk awal. Selesai!

---

## 🎨 Karakter Desain "Modern, Simpel & Kelihatan Mahal"

1. **Palet Warna Warm Alabaster / Ivory (`#FAF9F5`)**: Nuansa kertas majalah premium yang hangat, bersih, dan menenangkan mata.
2. **Tipografi Editorial Bergengsi**:
   - Judul & Logo: Menggunakan *Playfair Display* & *Cormorant Garamond* Serif yang anggun dan berkelas.
   - Konten & Harga: Menggunakan sans-serif modern *Plus Jakarta Sans*.
3. **Bingkai Produk Berasio 3:4 Portret**: Foto barang dipajang di atas alas frame netral (`#F3F1EC`) dengan transisi *smooth zoom hover*.
4. **Detail Produk Terpusat (Centered Minimalist Typography)**:
   - Nama produk minimalis di bagian tengah.
   - Format harga elegan dengan harga coret diskon.
   - Indikator marketplace micro-dot (`● Tokopedia`, `● Shopee`, `● TikTok Shop`).
   - Tombol belanja monokrom hitam minimalis (*"Beli di Tokopedia →"*).

---

## 📁 Struktur File

```text
Catalog Online/
├── index.html            # Halaman publik katalog mewah
├── admin.html            # Halaman portal login & admin panel khusus pemilik
├── supabase-schema.sql   # Script SQL siap pakai untuk membuat tabel di Supabase
├── css/
│   ├── style.css         # Desain Quiet Luxury / Editorial Fashion
│   └── admin.css         # Desain dashboard studio admin yang serasi
├── js/
│   ├── supabase-config.js# Konfigurasi & client wrapper Supabase Cloud
│   ├── data.js           # Sumber data sampel produk & marketplace
│   ├── app.js            # Logika katalog publik + Supabase Realtime
│   └── admin.js          # Logika otentikasi login, Cloud CRUD & Migrasi
├── assets/
│   └── images/           # Penyimpanan foto produk lokal
└── README.md             # Panduan penggunaan
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
  - ➕ **Tambah postingan produk baru** (otomatis tersimpan ke Supabase Cloud).
  - ✏️ **Edit postingan yang ada** kapan saja.
  - 🗑️ **Hapus produk** yang sudah habis/tidak direkomendasikan.
  - ⭐ **Toggle 1-klik** untuk produk pilihan utama (*Editor's Pick*).
  - ☁️ **Atur koneksi Supabase & migrasi data**.
  - 🔑 **Ganti password** admin.
