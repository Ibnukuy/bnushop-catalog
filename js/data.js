/**
 * DATA PRODUK REKOMENDASI BELANJA - OLIVIENNE CURATED EDITION
 * Koleksi pilihan berkualitas dengan estetika modern, simpel, dan elegan.
 * Mendukung Tokopedia, Shopee, TikTok Shop, Lazada, Blibli, dan Toko Resmi.
 */

const MARKETPLACES = {
  tokopedia: {
    name: 'Tokopedia',
    color: '#03AC0E',
    icon: 'fas fa-store',
    label: 'Beli di Tokopedia',
    badgeClass: 'badge-tokopedia'
  },
  shopee: {
    name: 'Shopee',
    color: '#EE4D2D',
    icon: 'fas fa-shopping-bag',
    label: 'Beli di Shopee',
    badgeClass: 'badge-shopee'
  },
  tiktok: {
    name: 'TikTok Shop',
    color: '#18181B',
    icon: 'fab fa-tiktok',
    label: 'Beli di TikTok Shop',
    badgeClass: 'badge-tiktok'
  },
  lazada: {
    name: 'Lazada',
    color: '#0F146D',
    icon: 'fas fa-shopping-cart',
    label: 'Beli di Lazada',
    badgeClass: 'badge-lazada'
  },
  blibli: {
    name: 'Blibli',
    color: '#0095DA',
    icon: 'fas fa-box-open',
    label: 'Beli di Blibli',
    badgeClass: 'badge-blibli'
  },
  other: {
    name: 'Official Store',
    color: '#18181B',
    icon: 'fas fa-external-link-alt',
    label: 'Kunjungi Toko',
    badgeClass: 'badge-other'
  }
};

const CATEGORIES = [
  { id: 'all', name: 'All Collection', icon: 'fas fa-border-all' },
  { id: 'featured', name: 'Curated Picks', icon: 'fas fa-star' },
  { id: 'fashion', name: 'Ready-to-Wear', icon: 'fas fa-tshirt' },
  { id: 'elektronik', name: 'Electronics & Audio', icon: 'fas fa-laptop' },
  { id: 'aksesori', name: 'Accessories & Leather', icon: 'fas fa-gem' },
  { id: 'rumah-tangga', name: 'Home Living', icon: 'fas fa-couch' },
  { id: 'kecantikan', name: 'Beauty & Skincare', icon: 'fas fa-heart' }
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    title: 'Blend High-Neck Knit Sweater Oatmeal',
    category: 'fashion',
    price: 189000,
    originalPrice: 299000,
    rating: 4.9,
    soldCount: '4.8rb+',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80',
    platform: 'tokopedia',
    productUrl: 'https://www.tokopedia.com',
    secondaryPlatform: 'shopee',
    secondaryUrl: 'https://shopee.co.id',
    isFeatured: true,
    badgeText: 'Curator Choice',
    description: 'Rajut premium wool-blend dengan siluet high-neck yang hangat dan jatuh lembut. Memberikan kesan clean luxury khas editorial fashion.',
    recommendationReason: 'Kualitas rajutan sangat rapat dan tidak mudah berbulu. Warna oatmeal netral mudah dipadukan dengan celana kulot maupun tailored trousers.'
  },
  {
    id: 2,
    title: 'Wool Blend Boat-Neck Pullover Powder Rose',
    category: 'fashion',
    price: 175000,
    originalPrice: 260000,
    rating: 4.8,
    soldCount: '2.4rb+',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=700&q=80',
    platform: 'shopee',
    productUrl: 'https://shopee.co.id',
    secondaryPlatform: 'tokopedia',
    secondaryUrl: 'https://www.tokopedia.com',
    isFeatured: true,
    badgeText: 'Editor Pick',
    description: 'Sweater berpotongan boat-neck dengan tekstur halus dan aksen unfinished hem yang modern dan effortlessly chic.',
    recommendationReason: 'Potongan santai tapi tetap rapi dan mahal saat dipakai. Cocok untuk cuaca ber-AC dan hangout santai.'
  },
  {
    id: 3,
    title: 'Minimalist Smooth Leather Crossbody Satchel',
    category: 'aksesori',
    price: 249000,
    originalPrice: 420000,
    rating: 4.9,
    soldCount: '1.8rb+',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80',
    platform: 'tiktok',
    productUrl: 'https://shop.tiktok.com',
    secondaryPlatform: 'tokopedia',
    secondaryUrl: 'https://www.tokopedia.com',
    isFeatured: true,
    badgeText: 'Best Seller',
    description: 'Tas selempang dengan material smooth vegan leather premium, jahitan presisi, dan hardware matte gold minimalis.',
    recommendationReason: 'Bentuk geometris yang timeless mirip tas branded jutaan rupiah. Muat handphone besar, dompet, lipstik, dan kunci.'
  },
  {
    id: 4,
    title: 'Minimalist Wireless Noise Cancelling Earbuds',
    category: 'elektronik',
    price: 199000,
    originalPrice: 380000,
    rating: 4.8,
    soldCount: '3.1rb+',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80',
    platform: 'tokopedia',
    productUrl: 'https://www.tokopedia.com',
    secondaryPlatform: 'shopee',
    secondaryUrl: 'https://shopee.co.id',
    isFeatured: true,
    badgeText: 'Hi-Fi Audio',
    description: 'TWS berdesain ergonomis minimalis dengan case finishing matte. Dilengkapi peredam kebisingan aktif dan mikrofon jernih.',
    recommendationReason: 'Suara bass bulat dan vokal renyah. Case ringkas muat di saku kecil dan baterai tahan hingga 28 jam pemakaian.'
  },
  {
    id: 5,
    title: 'Vintage Tortoise Shell UV400 Polarized Sunglasses',
    category: 'aksesori',
    price: 79000,
    originalPrice: 150000,
    rating: 4.9,
    soldCount: '5.2rb+',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80',
    platform: 'shopee',
    productUrl: 'https://shopee.co.id',
    secondaryPlatform: 'tokopedia',
    secondaryUrl: 'https://www.tokopedia.com',
    isFeatured: true,
    badgeText: 'Essential',
    description: 'Kacamata hitam berframe asetat motif tortoise klasik. Lensa polarized melindungi mata dari radiasi UV matahari secara optimal.',
    recommendationReason: 'Frame kokoh tidak ringkih, engsel metal kuat, dan langsung membuat penampilan kasual terlihat sophisticated.'
  },
  {
    id: 6,
    title: 'Ceramic Ultrasonic Aroma Diffuser & Ambient Lamp',
    category: 'rumah-tangga',
    price: 185000,
    originalPrice: 320000,
    rating: 4.9,
    soldCount: '2.9rb+',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=80',
    platform: 'tokopedia',
    productUrl: 'https://www.tokopedia.com',
    isFeatured: true,
    badgeText: 'Home Decor',
    description: 'Diffuser aromaterapi berbahan keramik matte dengan lampu warm ambient. Menyebarkan aroma essential oil secara merata dan hening.',
    recommendationReason: 'Desainnya layaknya keramik seni di galeri boutique. Sangat estetik ditaruh di atas nakas kamar tidur atau meja kerja.'
  },
  {
    id: 7,
    title: 'Double-Walled Matte Vacuum Insulated Tumbler 600ml',
    category: 'rumah-tangga',
    price: 98000,
    originalPrice: 175000,
    rating: 4.8,
    soldCount: '4.1rb+',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80',
    platform: 'shopee',
    productUrl: 'https://shopee.co.id',
    isFeatured: false,
    badgeText: 'Eco Friendly',
    description: 'Tumbler stainless steel 304 food-grade dengan lapisan powder coating anti-gores. Menjaga es tetap dingin hingga 18 jam.',
    recommendationReason: 'Tutup kedap anti-bocor dengan siluet silinder minimalis yang nyaman digenggam dan elegan dibawa ke kantor.'
  },
  {
    id: 8,
    title: 'Botanical Barrier Recovery Serum SPF 50+ PA++++',
    category: 'kecantikan',
    price: 89000,
    originalPrice: 135000,
    rating: 4.9,
    soldCount: '8.7rb+',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
    platform: 'tiktok',
    productUrl: 'https://shop.tiktok.com',
    secondaryPlatform: 'shopee',
    secondaryUrl: 'https://shopee.co.id',
    isFeatured: true,
    badgeText: 'Top Rated',
    description: 'Serum pelindung matahari berbahan alami botani dengan hasil akhir dewy glow tanpa whitecast dan bebas lengket.',
    recommendationReason: 'Tekstur cepat menyerap seperti air, aman untuk kulit sensitif dan memberikan efek wajah sehat bercahaya alami.'
  },
  {
    id: 9,
    title: 'Compact Wireless Mechanical Keyboard Dual Tone Grey',
    category: 'elektronik',
    price: 389000,
    originalPrice: 620000,
    rating: 4.8,
    soldCount: '950+',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80',
    platform: 'tokopedia',
    productUrl: 'https://www.tokopedia.com',
    isFeatured: false,
    badgeText: 'Desk Setup',
    description: 'Keyboard mekanikal nirkabel 75% dengan keycaps PBT kombinasi abu-abu matte dan switch lembut berkarakter thocky tenang.',
    recommendationReason: 'Koneksi multi-device stabil untuk laptop dan iPad. Menjadikan meja kerja tampak sangat rapi dan berkelas.'
  },
  {
    id: 10,
    title: 'Low-Top Canvas Heritage Sneakers Ecru White',
    category: 'fashion',
    price: 195000,
    originalPrice: 310000,
    rating: 4.8,
    soldCount: '2.8rb+',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=80',
    platform: 'shopee',
    productUrl: 'https://shopee.co.id',
    isFeatured: true,
    badgeText: 'Timeless',
    description: 'Sneakers kanvas klasik bernuansa ecru vintage dengan sol karet vulcanized fleksibel dan insole busa penyerap hentakan.',
    recommendationReason: 'Desain understated yang cocok dipakai dengan outfit apa saja, dari jeans santai hingga setelan blazer kasual.'
  },
  {
    id: 11,
    title: 'Minimalist Nordic Desk Reading Lamp Touch Dimmer',
    category: 'rumah-tangga',
    price: 78000,
    originalPrice: 140000,
    rating: 4.9,
    soldCount: '3.6rb+',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80',
    platform: 'tokopedia',
    productUrl: 'https://www.tokopedia.com',
    isFeatured: false,
    badgeText: 'Interior',
    description: 'Lampu meja dengan tiang matte aluminium dan sensor sentuh 3 tingkat kecerahan cahaya lembut yang ramah untuk mata.',
    recommendationReason: 'Baterai rechargeable tahan hingga 12 jam tanpa kabel melintang. Bentuk ramping hemat ruang dan estetik.'
  },
  {
    id: 12,
    title: 'Slim Leather Card Case & Billfold Charcoal',
    category: 'aksesori',
    price: 58000,
    originalPrice: 99000,
    rating: 4.9,
    soldCount: '6.4rb+',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80',
    platform: 'tokopedia',
    productUrl: 'https://www.tokopedia.com',
    secondaryPlatform: 'shopee',
    secondaryUrl: 'https://shopee.co.id',
    isFeatured: false,
    badgeText: 'RFID Safe',
    description: 'Dompet kartu ultra-ramping dengan 6 slot kartu dan kompartemen uang tunai tersembunyi berpelindung sinyal RFID.',
    recommendationReason: 'Sangat tipis dan rapi di saku depan kemeja atau saku celana tanpa membuat tonjolan yang mengganggu postur.'
  }
];
