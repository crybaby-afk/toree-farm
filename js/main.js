/* ========================================
   TOREE FARM & NURSERY LTD
   Main JavaScript
   ======================================== */

// ---- PRODUCTS DATA ----
let PRODUCTS = [];
const FALLBACK_PRODUCTS = [
  {"id":1,"name":"Tomatoes Terminator F1","category":"fruit","emoji":"🍅","price":4,"description":"Disease-resistant hybrid tomato seedlings","growth":"70-90 days","spacing":"60cm x 60cm","watering":"Regular","stock":"In Stock","img":"tomato-seedlings"},
  {"id":2,"name":"Spinach Seedlings","category":"leafy","emoji":"🌿","price":2,"description":"Nutrient-rich spinach seedlings","growth":"40-50 days","spacing":"20cm x 30cm","watering":"Moderate","stock":"In Stock","img":"spinach"},
  {"id":3,"name":"Eggplant (Brinjal)","category":"fruit","emoji":"🍆","price":2,"description":"Robust eggplant seedlings","growth":"70-85 days","spacing":"50cm x 70cm","watering":"Regular","stock":"In Stock","img":"eggplant"},
  {"id":4,"name":"Broccoli Seedlings","category":"brassica","emoji":"🥦","price":4,"description":"Cold-tolerant broccoli seedlings","growth":"60-80 days","spacing":"45cm x 60cm","watering":"Regular","stock":"In Stock","img":"product-broccoli"},
  {"id":5,"name":"Cauliflower Seedlings","category":"brassica","emoji":"🥬","price":4,"description":"Excellent cauliflower head formation","growth":"60-75 days","spacing":"45cm x 60cm","watering":"Consistent","stock":"In Stock","img":"product-cauliflower"},
  {"id":6,"name":"Lettuce Seedlings","category":"leafy","emoji":"🥗","price":4,"description":"Crisp, fast-growing lettuce seedlings","growth":"30-45 days","spacing":"25cm x 30cm","watering":"Frequent","stock":"In Stock","img":"lettuce-seedling"},
  {"id":7,"name":"Red Cabbage Seedlings","category":"brassica","emoji":"🥬","price":7,"description":"Firm red cabbage with rich color","growth":"70-90 days","spacing":"50cm x 60cm","watering":"Moderate","stock":"In Stock","img":"red-cabbage"},
  {"id":8,"name":"Black Nightshade (Managu)","category":"specialty","emoji":"🌱","price":2,"description":"Traditional African leafy green","growth":"30-40 days","spacing":"30cm x 40cm","watering":"Moderate","stock":"In Stock","img":"black-nightshade"},
  {"id":9,"name":"Beetroot Seedlings","category":"specialty","emoji":"❤️","price":2,"description":"Deep-red beetroot seedlings","growth":"55-70 days","spacing":"10cm x 25cm","watering":"Regular","stock":"In Stock","img":"beetroot-plants"},
  {"id":10,"name":"Curly Kales (Sukuma Wiki)","category":"leafy","emoji":"🥬","price":2,"description":"Prolific curly kales","growth":"45-60 days","spacing":"30cm x 45cm","watering":"Regular","stock":"In Stock","img":"sukuma-wiki"},
  {"id":11,"name":"Bulb Onions Seedlings","category":"specialty","emoji":"🧅","price":2,"description":"Strong bulb onion seedlings","growth":"100-120 days","spacing":"10cm x 15cm","watering":"Moderate","stock":"In Stock","img":"onion-seedlings"},
  {"id":12,"name":"Spring Onions Seedlings","category":"specialty","emoji":"🌾","price":2,"description":"Fast-growing spring onions","growth":"30-40 days","spacing":"5cm x 10cm","watering":"Keep moist","stock":"In Stock","img":"spring-onions"},
  {"id":13,"name":"Cabbage Gloria F1","category":"brassica","emoji":"🥬","price":2.5,"description":"Gloria F1 compact hybrid cabbage","growth":"65-80 days","spacing":"50cm x 60cm","watering":"Moderate","stock":"In Stock","img":"cabbage-seedlings"},
  {"id":14,"name":"Cabbage Gloria Star F1","category":"brassica","emoji":"🥬","price":2.5,"description":"Gloria Star F1 premium cabbage","growth":"65-80 days","spacing":"50cm x 60cm","watering":"Moderate","stock":"In Stock","img":"cabbage-seedlings"},
  {"id":15,"name":"Cabbage Victoria F1","category":"brassica","emoji":"🥬","price":2.5,"description":"Victoria F1 hybrid cabbage","growth":"65-80 days","spacing":"50cm x 60cm","watering":"Moderate","stock":"In Stock","img":"cabbage-seedlings"},
  {"id":16,"name":"Cabbage Pretoria F1","category":"brassica","emoji":"🥬","price":2.5,"description":"Pretoria F1 hybrid cabbage","growth":"65-80 days","spacing":"50cm x 60cm","watering":"Moderate","stock":"In Stock","img":"cabbage-seedlings"},
  {"id":17,"name":"Sukumawiki Tausi F1","category":"leafy","emoji":"🥬","price":2,"description":"Tausi F1 fast-growing sukumawiki","growth":"45-60 days","spacing":"30cm x 45cm","watering":"Regular","stock":"In Stock","img":"sukuma-wiki"},
  {"id":18,"name":"Sukumawiki Ahadi F1","category":"leafy","emoji":"🥬","price":2,"description":"Ahadi F1 reliable sukumawiki","growth":"45-60 days","spacing":"30cm x 45cm","watering":"Regular","stock":"In Stock","img":"sukuma-wiki"},
  {"id":19,"name":"Capsicum (Hoho)","category":"fruit","emoji":"🫑","price":4,"description":"Sweet capsicum seedlings","growth":"70-90 days","spacing":"45cm x 60cm","watering":"Regular","stock":"In Stock","img":"capsicum hoho"}
];

function getPathPrefix() {
  const path = window.location.pathname.replace(/\\/g, '/');
  return path.includes('/pages/') ? '../' : '';
}

function getShopPageHref() {
  return getPathPrefix() ? 'shop.html' : 'pages/shop.html';
}

const INDEXNOW_KEY = '8f3b2c7a19d44c4a9e0d7b5f2a6143ce';

function notifyIndexNow(urls = [window.location.href]) {
  const isLiveSite = window.location.hostname === 'toreefarm.com' || window.location.hostname === 'www.toreefarm.com';
  if (!isLiveSite || !Array.isArray(urls) || urls.length === 0) return;

  const endpoint = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(urls[0])}&key=${INDEXNOW_KEY}`;
  fetch(endpoint, { method: 'GET', mode: 'no-cors', keepalive: true }).catch(() => {});
}

function formatCurrency(value) {
  return `KES ${Number(value).toFixed(2)}`;
}

function getSeasonTag(product) {
  const seasonal = {
    leafy: 'Fast mover',
    fruit: 'High demand',
    brassica: 'Cool season',
    specialty: 'Farm favorite'
  };
  return seasonal[product.category] || 'Fresh pick';
}

function getStockTone(product) {
  return Number(product.price) >= 5 ? 'premium' : Number(product.price) <= 2.5 ? 'starter' : 'steady';
}

function getStockLabel(product) {
  const tone = getStockTone(product);
  if (tone === 'premium') return 'Premium line';
  if (tone === 'starter') return 'Ready now';
  return 'Fresh batch';
}

async function loadProducts() {
  try {
    const response = await fetch(`${getPathPrefix()}data/products.json`);
    if (!response.ok) throw new Error('Failed to load products data');
    PRODUCTS = await response.json();
    return PRODUCTS;
  } catch (error) {
    console.error('Product load error:', error);
    // Fallback static data if JSON can't load in a local preview.
    PRODUCTS = [...FALLBACK_PRODUCTS];
    return PRODUCTS;
  }
}

// ---- GALLERY DATA ----
const GALLERY = [
  { id: 1, img: 'gallery-1', caption: 'Lush seedling beds in full growth', filter: 'nursery' },
  { id: 2, img: 'gallery-2', caption: 'Premium quality nursery operations', filter: 'nursery' },
  { id: 3, img: 'nursery-1', caption: 'Our dedicated nursery staff at work', filter: 'process' },
  { id: 4, img: 'nursery-2', caption: 'Healthy seedlings ready for market', filter: 'varieties' },
  { id: 5, img: 'nursery-3', caption: 'Top-quality vegetables from Toree Farm', filter: 'process' },
  { id: 6, img: 'nursery-banner', caption: 'Toree Farm\'s premium seedling collection', filter: 'nursery' },
  { id: 7, img: 'spinach', caption: 'Fresh spinach seedlings ready for planning and transplanting', filter: 'varieties' },
  { id: 8, img: 'product-broccoli', caption: 'Premium broccoli seedlings with strong roots', filter: 'varieties' },
  { id: 9, img: 'product-cauliflower', caption: 'Healthy cauliflower seedlings for optimal growth', filter: 'varieties' },
  { id: 10, img: 'capsicum hoho', caption: 'Sweet capsicum (hoho) seedlings in our nursery', filter: 'varieties' },
  { id: 11, img: 'eggplant', caption: 'Robust eggplant seedlings with disease resistance', filter: 'varieties' },
  { id: 12, img: '1', caption: 'Our modern nursery facilities and equipment', filter: 'process' },
  { id: 13, img: '2', caption: 'Quality control inspection of seedlings', filter: 'process' },
  { id: 14, img: '3', caption: 'Seedling hardening process for field readiness', filter: 'process' },
  { id: 15, img: '4', caption: 'Freshly harvested vegetables from our farm', filter: 'varieties' },
  { id: 16, img: '5', caption: 'Nursery greenhouse with controlled environment', filter: 'nursery' },
  { id: 17, img: '6', caption: 'Professional seedling packaging for delivery', filter: 'process' },
  { id: 18, img: '7', caption: 'Real nursery seedlings lined up for healthy field starts', filter: 'nursery' },
  { id: 19, img: '8', caption: 'Protected greenhouse rows with strong young seedlings', filter: 'nursery' },
  { id: 20, img: '9', caption: 'Fresh nursery seedlings arranged for customer pickup', filter: 'varieties' },
  { id: 21, img: '10', caption: 'Dense seedling beds showing even growth and vigor', filter: 'nursery' },
  { id: 22, img: '11', caption: 'Leafy seedlings raised under careful nursery management', filter: 'varieties' },
  { id: 23, img: '12', caption: 'Healthy seedlings at a stage ideal for farmer planning', filter: 'process' },
  { id: 24, img: '13', caption: 'Protected seedling production inside the nursery', filter: 'nursery' },
  { id: 25, img: '14', caption: 'Strong mixed seedlings prepared for reliable field establishment', filter: 'varieties' },
  { id: 26, img: '15', caption: 'Customer-ready seedlings displayed from the real farm', filter: 'process' },
  { id: 27, img: '16', caption: 'Our nursery space stocked with healthy seedling lines', filter: 'nursery' },
  { id: 28, img: '17', caption: 'A closer look at real Toree Farm seedling quality', filter: 'varieties' },
  { id: 29, img: '18', caption: 'Seedlings grouped neatly for faster buying and collection', filter: 'process' },
  { id: 30, img: '19', caption: 'More of the nursery in active daily production', filter: 'nursery' },
  { id: 31, img: '20', caption: 'Seedlings grown with steady care and clean presentation', filter: 'varieties' },
  { id: 32, img: '21', caption: 'A real farm view showing healthy nursery output', filter: 'process' },
  { id: 33, img: '22', caption: 'Extra nursery scenes from Toree Farm operations', filter: 'nursery' },
];

function renderGalleryItem(item) {
  const imgBase = `../images/optimized/${item.img}`;
  // Handle numbered images (1, 2, 3, etc.) which are .jpeg files
  const isNumbered = /^\d+$/.test(item.img);
  const webpSrc = isNumbered ?
    `${imgBase}.jpeg 640w` :
    `${imgBase}-640.webp 640w, ${imgBase}-1024.webp 1024w`;
  const jpgSrc = isNumbered ?
    `${imgBase}.jpeg 640w` :
    `${imgBase}-640.jpg 640w, ${imgBase}-1024.jpg 1024w`;
  const imgSrc = isNumbered ? `${imgBase}.jpeg` : `${imgBase}-640.jpg`;
  const lightboxSrc = isNumbered ? `${imgBase}.jpeg` : `${imgBase}-1024.jpg`;

  return `
    <div class="gallery-item" data-filter="${item.filter}" data-animate="fade-in" role="button" tabindex="0" aria-label="${item.caption}" onclick="openLightbox('${lightboxSrc}', event)" onkeydown="handleGalleryKeydown(event, '${lightboxSrc}')">
      <picture>
        <source srcset="${webpSrc}" type="image/webp">
        <source srcset="${jpgSrc}" type="image/jpeg">
        <img src="${imgSrc}" alt="${item.caption}" loading="lazy" decoding="async">
      </picture>
      <div class="gallery-overlay">
        <p>${item.caption}</p>
      </div>
    </div>
  `;
}

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  grid.innerHTML = GALLERY.map(renderGalleryItem).join('');
  initScrollAnimations();
  updateGalleryNavigation();
}

function updateGalleryNavigation() {
  const items = document.querySelectorAll('.gallery-item');
  const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');
  const totalItems = visibleItems.length;
  const itemsPerPage = 12; // Show 12 items per page
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Update page indicators
  const currentPageEl = document.getElementById('current-page');
  const totalPagesEl = document.getElementById('total-pages');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  if (currentPageEl) currentPageEl.textContent = '1';
  if (totalPagesEl) totalPagesEl.textContent = totalPages;
  
  // Show/hide navigation based on total pages
  const navContainer = document.querySelector('.gallery-nav');
  if (navContainer) {
    navContainer.style.display = totalPages > 1 ? 'flex' : 'none';
  }
  
  // Enable/disable buttons
  if (prevBtn) prevBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = totalPages <= 1;
  
  // Show first page
  showGalleryPage(1);
}

function showGalleryPage(page) {
  const items = document.querySelectorAll('.gallery-item');
  const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');
  const itemsPerPage = 12;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  visibleItems.forEach((item, index) => {
    if (index >= startIndex && index < endIndex) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
  
  // Update page indicator
  const currentPageEl = document.getElementById('current-page');
  if (currentPageEl) currentPageEl.textContent = page;
  
  // Update button states
  const totalPages = Math.ceil(visibleItems.length / itemsPerPage);
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  if (prevBtn) prevBtn.disabled = page <= 1;
  if (nextBtn) nextBtn.disabled = page >= totalPages;
}

function nextGalleryPage() {
  const currentPageEl = document.getElementById('current-page');
  const totalPagesEl = document.getElementById('total-pages');
  if (!currentPageEl || !totalPagesEl) return;
  
  const currentPage = parseInt(currentPageEl.textContent);
  const totalPages = parseInt(totalPagesEl.textContent);
  
  if (currentPage < totalPages) {
    showGalleryPage(currentPage + 1);
  }
}

function prevGalleryPage() {
  const currentPageEl = document.getElementById('current-page');
  if (!currentPageEl) return;
  
  const currentPage = parseInt(currentPageEl.textContent);
  
  if (currentPage > 1) {
    showGalleryPage(currentPage - 1);
  }
}

function filterGallery(filterType) {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    if (filterType === 'all' || item.dataset.filter === filterType) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
  updateGalleryNavigation();
}

function openLightbox(src, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox) {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lightboxImg) {
      window.setTimeout(() => {
        if (!lightbox.classList.contains('open')) lightboxImg.src = '';
      }, 180);
    }
  }
}

function handleGalleryKeydown(event, src) {
  if (event.key === 'Enter' || event.key === ' ') {
    openLightbox(src, event);
  }
}

// ---- CART MANAGEMENT ----
let cart = JSON.parse(localStorage.getItem('toree_cart') || '[]');

function saveCart() {
  localStorage.setItem('toree_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge, .cart-count');
  const count = cart.reduce((s, i) => s + i.qty, 0);
  badges.forEach(b => {
    b.textContent = count;
    b.classList.toggle('show', count > 0);
  });
}

function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, name: product.name, price: product.price, emoji: product.emoji, qty });
  }
  saveCart();
  showToast(`Added to cart: ${product.name}`);
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
}

function updateCartQty(productId, qty) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart();
  }
}

function getCartTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

// ---- TOAST NOTIFICATION ----
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---- MODAL FUNCTIONS ----
let currentModalProduct = null;

function openModal(product) {
  currentModalProduct = product;
  const modal = document.getElementById('product-modal');
  const title = document.getElementById('modal-title') || document.getElementById('modal-name');
  const img = document.getElementById('modal-img');
  const desc = document.getElementById('modal-desc');
  const price = document.getElementById('modal-price');
  const stock = document.getElementById('modal-stock');
  const watering = document.getElementById('modal-watering');
  const category = document.getElementById('modal-category');
  const growth = document.getElementById('modal-growth');
  const spacing = document.getElementById('modal-spacing');
  const qtyInput = document.getElementById('modal-qty-input');

  if (modal && title && img && desc && price && stock && watering && qtyInput) {
    title.textContent = product.name;
    img.src = `${getPathPrefix()}images/optimized/${product.img || product.image}-640.jpg`;
    img.alt = product.name;
    desc.textContent = product.description;
    price.textContent = `KES ${product.price.toFixed(2)}`;
    stock.textContent = typeof product.stock === 'number' ? `${product.stock} available` : product.stock;
    watering.textContent = product.watering || 'Regular watering';
    if (category) category.textContent = product.category || '';
    if (growth) growth.textContent = product.growth || '';
    if (spacing) spacing.textContent = product.spacing || '';
    qtyInput.value = 1;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  currentModalProduct = null;
}

function modalChangeQty(delta) {
  const qtyInput = document.getElementById('modal-qty-input');
  if (qtyInput) {
    let newQty = parseInt(qtyInput.value) + delta;
    newQty = Math.max(1, Math.min(10000, newQty));
    qtyInput.value = newQty;
  }
}

function modalUpdateQty(value) {
  const qtyInput = document.getElementById('modal-qty-input');
  if (qtyInput) {
    let newQty = parseInt(value);
    if (isNaN(newQty) || newQty < 1) newQty = 1;
    if (newQty > 10000) newQty = 10000;
    qtyInput.value = newQty;
  }
}

function modalAddToCart() {
  if (currentModalProduct) {
    const qtyInput = document.getElementById('modal-qty-input');
    const qty = qtyInput ? parseInt(qtyInput.value) : 1;
    addToCart(currentModalProduct.id, qty);
    closeModal();
  }
}

// ---- NAVIGATION ----
function initNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }
  // Mark active page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
    link.addEventListener('click', () => {
      if (navLinks && hamburger) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!navLinks || !hamburger) return;
    if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
  updateCartBadge();
}

function initMobileQuickNav() {
  // Disabled intentionally: the extra fixed quick-nav was colliding with the
  // main mobile header and creating broken spacing on phones.
  return;
}

// ---- SCROLL ANIMATIONS ----
function initScrollAnimations() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.getAttribute('data-animate-delay') || 0) * 1000;
        const type = el.getAttribute('data-animate') || '';
        if (reduceMotion) {
          // Respect reduced motion: reveal immediately without delay
          el.classList.add('visible');
        } else {
          setTimeout(() => {
            el.classList.add('visible');
            if (type === 'fade-scale') el.style.transitionTimingFunction = 'cubic-bezier(0.2,0,0.2,1)';
          }, delay);
        }
      }
    });
  }, { threshold: 0.12 });

  // Observe elements that opt-in via data-animate
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  // Backwards-compatible: still observe .fade-in elements
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function initPagePolish() {
  document.body.classList.add('page-enter');

  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
    <div class="page-loader-mark">
      <span class="page-loader-title">Toree Farm</span>
      <span class="page-loader-subtitle">Preparing healthy starts</span>
    </div>
  `;
  document.body.appendChild(loader);

  requestAnimationFrame(() => {
    document.body.classList.add('page-ready');
    window.setTimeout(() => {
      loader.classList.add('done');
      window.setTimeout(() => loader.remove(), 500);
    }, 380);
  });

  const hero = document.querySelector('.story-hero, .premium-shop-hero');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layers = hero.querySelectorAll('.hero-bg, .hero-parallax-orb, .hero-story-card, .shop-hero-panel');
  window.addEventListener('scroll', () => {
    const rect = hero.getBoundingClientRect();
    const progress = Math.max(-1, Math.min(1, rect.top / window.innerHeight));
    layers.forEach((layer, index) => {
      const depth = (index + 1) * 8;
      layer.style.transform = `translate3d(0, ${progress * depth}px, 0)`;
    });
  }, { passive: true });
}

/* ========================================
   Accessibility helpers: focus trap + global key handling
   ======================================== */
let _lastFocused = null;
let _focusTrapContainer = null;
function _getFocusable(container) {
  return Array.from(container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'))
    .filter(el => el.offsetParent !== null);
}

function _enableFocusTrap(container) {
  _focusTrapContainer = container;
  _lastFocused = document.activeElement;
  const focusable = _getFocusable(container);
  if (focusable.length) focusable[0].focus();
  document.addEventListener('keydown', _globalKeyHandler);
}

function _disableFocusTrap() {
  document.removeEventListener('keydown', _globalKeyHandler);
  _focusTrapContainer = null;
  if (_lastFocused && typeof _lastFocused.focus === 'function') _lastFocused.focus();
}

function _globalKeyHandler(e) {
  // Close on Escape if a modal or lightbox is open
  const modalOpen = document.getElementById('product-modal')?.classList.contains('open');
  const lightboxOpen = document.getElementById('lightbox')?.classList.contains('open');
  if (e.key === 'Escape') {
    if (modalOpen) closeModal();
    if (lightboxOpen) closeLightbox();
  }

  // Handle Tab focus trap
  if (e.key === 'Tab' && _focusTrapContainer) {
    const focusable = _getFocusable(_focusTrapContainer);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  }
}

// ---- WHATSAPP ORDER ----
function buildWhatsAppMessage() {
  if (cart.length === 0) return null;
  let msg = '*Order from Toree Farm & Nursery Ltd*\n\n';
  cart.forEach(item => {
    msg += `- ${item.name} x${item.qty} = KES ${(item.price * item.qty).toFixed(2)}\n`;
  });
  msg += `\n*Total: KES ${getCartTotal().toFixed(2)}*\n\nPlease confirm availability. Thank you!`;
  return encodeURIComponent(msg);
}

function orderViaWhatsApp() {
  const msg = buildWhatsAppMessage();
  if (!msg) { showToast('Your cart is empty.', 'error'); return; }
  window.open(`https://wa.me/254715108351?text=${msg}`, '_blank');
}

// ---- PRODUCT CARDS HTML ----
function renderProductCard(product, isShopPage = false) {
  const baseName = product.img;
  const pathPrefix = isShopPage ? '../' : '';
  const imgBase = `${pathPrefix}images/optimized/${baseName}`;
  const srcSet = `${imgBase}-640.jpg 640w, ${imgBase}-1024.jpg 1024w`;
  const seasonTag = getSeasonTag(product);
  const stockTone = getStockTone(product);
  const stockLabel = getStockLabel(product);
  const priceLabel = Number(product.price) <= 2.5 ? 'Starter pack' : Number(product.price) >= 5 ? 'Premium line' : 'Farmer pick';
  const stockStatus = product.stock || 'Available now';
  return `
    <div class="product-card ${isShopPage ? 'shop-premium-card' : ''}" data-animate="slide-left" data-animate-delay="0.06" data-category="${product.category}" data-id="${product.id}">
      <div class="product-img">
        <img src="${imgBase}-640.jpg" srcset="${srcSet}" sizes="${isShopPage ? '(max-width: 900px) 100vw, 33vw' : '(max-width: 900px) 100vw, 25vw'}" alt="${product.name}" loading="lazy" decoding="async" onerror="this.onerror=null; this.closest('.product-img').classList.add('image-missing');">
        <div class="product-emoji" aria-hidden="true">${product.emoji}</div>
        <span class="product-category">${product.category}</span>
        <span class="product-season-badge">${seasonTag}</span>
      </div>
      <div class="product-body">
        <div class="product-chip-row">
          <span class="product-chip ${stockTone}">${stockLabel}</span>
          <span class="product-chip subtle">${priceLabel}</span>
        </div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        ${isShopPage ? `<div class="product-store-line"><span class="product-store-status">${stockStatus}</span><span class="product-store-unit">Per seedling</span></div>` : ''}
        <div class="product-meta-grid">
          <div><strong>Growth</strong><span>${product.growth || 'Healthy cycle'}</span></div>
          <div><strong>Spacing</strong><span>${product.spacing || 'Standard spacing'}</span></div>
        </div>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${product.id}, -1)">-</button>
          <input type="number" id="qty-${product.id}" class="qty-input" value="1" min="1" max="10000" oninput="updateQtyDisplay(${product.id}, this.value)">
          <button class="qty-btn" onclick="changeQty(${product.id}, 1)">+</button>
        </div>
        <div class="product-footer">
          <div class="price-tag"><span>${formatCurrency(product.price)}</span><small>/ seedling</small></div>
          <button class="add-to-cart-btn" onclick="addToCartFromCard(${product.id})">Add to cart</button>
        </div>
        ${isShopPage ? `<div class="product-card-actions"><a class="product-link-btn whatsapp primary" href="https://wa.me/254715108351?text=${encodeURIComponent(`Hello Toree Farm, I would like ${product.name}.`)}" target="_blank">Buy on WhatsApp</a><button class="product-link-btn" onclick="openModal(PRODUCTS.find(p => p.id === ${product.id}))">View details</button></div>` : ''}
      </div>
    </div>`;
}

function renderFeaturedProducts() {
  const featured = document.getElementById('featured-products');
  if (!featured || !Array.isArray(PRODUCTS)) return;
  const selected = PRODUCTS.slice(0, 6);
  featured.innerHTML = selected.map(product => renderProductCard(product, false)).join('');
  initScrollAnimations();
}

function renderPickupCard() {
  const container = document.getElementById('pickup-card');
  if (!container || !Array.isArray(PRODUCTS) || PRODUCTS.length === 0) return;
  const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  container.innerHTML = `
    <div class="pickup-card cinematic" data-animate="fade-scale" data-animate-delay="0.1">
      <div class="pickup-kicker">Best for this month</div>
      <h3>${product.name}</h3>
      <p>Strong ${product.category} seedlings for fast establishment and clean transplanting.</p>
      <span class="pickup-price">${formatCurrency(product.price)} <small>per seedling</small></span>
      <div class="pickup-actions">
        <a class="btn btn-primary" href="${getShopPageHref()}">Shop ${product.category}</a>
        <a class="btn btn-outline" href="https://wa.me/254715108351?text=${encodeURIComponent(`Hello Toree Farm, I would like to order ${product.name}.`)}" target="_blank">Quick WhatsApp</a>
      </div>
    </div>
  `;
}

const qtyMap = {};
function changeQty(id, delta) {
  const el = document.getElementById(`qty-${id}`);
  if (el) {
    let newQty = parseInt(el.value) + delta;
    newQty = Math.max(1, Math.min(10000, newQty));
    el.value = newQty;
    qtyMap[id] = newQty;
  }
}

function updateQtyDisplay(id, value) {
  const el = document.getElementById(`qty-${id}`);
  if (el) {
    let newQty = parseInt(value);
    if (isNaN(newQty) || newQty < 1) newQty = 1;
    if (newQty > 10000) newQty = 10000;
    el.value = newQty;
    qtyMap[id] = newQty;
  }
}

function addToCartFromCard(id) {
  addToCart(id, qtyMap[id] || 1);
  qtyMap[id] = 1;
  const el = document.getElementById(`qty-${id}`);
  if (el) el.value = 1;
}

// ---- INIT ON DOM READY ----
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileQuickNav();
  initPagePolish();
  initScrollAnimations();
  renderGallery();
  // Register service worker for PWA
  const isLocalDev = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  if ('serviceWorker' in navigator && !isLocalDev) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`${getPathPrefix()}sw.js`)
        .then(registration => {
          console.log('Service Worker registered successfully:', registration.scope);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    });
  } else if ('serviceWorker' in navigator && isLocalDev) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
  }
  // Attach gallery filter listeners
  document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterGallery(this.dataset.filter);
    });
  });
  
  // Attach gallery navigation listeners
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  if (prevBtn) prevBtn.addEventListener('click', prevGalleryPage);
  if (nextBtn) nextBtn.addEventListener('click', nextGalleryPage);
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox(e);
    });
  }
  if (lightboxImg) {
    lightboxImg.addEventListener('click', (e) => e.stopPropagation());
  }
  if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => closeLightbox(e));
  }
  // Close lightbox on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
  loadProducts().then(() => {
    renderFeaturedProducts();
    renderPickupCard();
    // Initialize search and weather if on shop page
    if (document.getElementById('search-input')) {
      document.getElementById('search-input').addEventListener('input', filterProducts);
      filterProducts(); // Initial render
    }
    if (document.getElementById('weather-temp')) {
      loadWeatherData();
    }
  });

  if (window.location.search.includes('indexnow=1')) {
    notifyIndexNow();
  }
});

// Export for use in page scripts
window.PRODUCTS = PRODUCTS;
window.GALLERY = GALLERY;
window.cart = cart;
window.addToCart = addToCart;
window.addToCartFromCard = addToCartFromCard;
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.updateCartQty = updateCartQty;
window.getCartTotal = getCartTotal;
window.orderViaWhatsApp = orderViaWhatsApp;
window.renderProductCard = renderProductCard;
window.renderGallery = renderGallery;
window.filterGallery = filterGallery;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.handleGalleryKeydown = handleGalleryKeydown;
window.updateGalleryNavigation = updateGalleryNavigation;
window.showGalleryPage = showGalleryPage;
window.nextGalleryPage = nextGalleryPage;
window.prevGalleryPage = prevGalleryPage;
window.openModal = openModal;
window.closeModal = closeModal;
window.modalChangeQty = modalChangeQty;
window.modalUpdateQty = modalUpdateQty;
window.modalAddToCart = modalAddToCart;
window.changeQty = changeQty;
window.updateQtyDisplay = updateQtyDisplay;
window.addToCartFromCard = addToCartFromCard;
  window.showToast = showToast;
  window.saveCart = saveCart;
  window.renderFeaturedProducts = renderFeaturedProducts;
  window.renderPickupCard = renderPickupCard;
  window.filterProducts = filterProducts;
  window.loadWeatherData = loadWeatherData;
  window.notifyIndexNow = notifyIndexNow;

// ---- SEARCH AND FILTER FUNCTIONS ----
function filterProducts() {
  const searchQuery = document.getElementById('search-input')?.value.toLowerCase() || '';
  const activeCategory = document.querySelector('.filter-btn.active')?.dataset.cat || 'all';
  const activePrice = document.querySelector('.filter-btn.active-price')?.dataset.price || 'all';

  let filtered = PRODUCTS.filter(product => {
    // Search filter
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery);

    // Category filter
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;

    // Price filter
    let matchesPrice = true;
    if (activePrice !== 'all') {
      const price = product.price;
      switch (activePrice) {
        case 'low': matchesPrice = price < 3; break;
        case 'mid': matchesPrice = price >= 3 && price <= 5; break;
        case 'high': matchesPrice = price > 5; break;
      }
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  renderFilteredProducts(filtered);
  updateProductCount(filtered.length);
}

function renderFilteredProducts(products) {
  const container = document.getElementById('products-grid') || document.getElementById('shop-products');
  if (!container) return;

  container.innerHTML = products.map(product => renderProductCard(product, true)).join('');
  initScrollAnimations();
}

function updateProductCount(count) {
  const counter = document.querySelector('.product-count') || document.getElementById('product-count');
  if (counter) {
    counter.textContent = `${count} product${count !== 1 ? 's' : ''} found`;
  }
}

// ---- CROP CALCULATOR ----
function calculateSeedlings() {
  const areaInput = document.getElementById('calc-area');
  const cropInput = document.getElementById('calc-crop');
  const densityInput = document.getElementById('calc-density');
  const useFertilizer = document.getElementById('fertilizer-pack')?.checked;
  const showAcres = document.getElementById('calc-area-unit')?.checked;

  const area = parseFloat(areaInput?.value || 0);
  const crop = cropInput?.value;
  const densityPct = parseFloat(densityInput?.value || 100);
  if (!area || area <= 0 || !crop) {
    document.getElementById('calc-result').textContent = 'Enter valid area and select a crop.';
    return;
  }

  const baseDensity = {
    spinach: 40,
    broccoli: 10,
    capsicum: 8,
    cauliflower: 12,
    eggplant: 7
  };

  const plantsPerM2 = baseDensity[crop] || 10;
  const effectiveDensity = plantsPerM2 * (densityPct / 100);
  const totalPlants = Math.round(area * effectiveDensity);
  const baseFertilizer = Math.max(1, (area / 10) * (densityPct / 100));
  const fertilizerKg = (useFertilizer ? baseFertilizer * 1.15 : baseFertilizer).toFixed(1);
  const areaAcres = (area * 0.000247105).toFixed(3);
  const result = [];
  result.push(`Seedlings: ${totalPlants.toLocaleString()}`);
  result.push(`Fertilizer: ${fertilizerKg} kg`);
  if (showAcres) result.push(`Area: ${areaAcres} acres`);

  document.getElementById('calc-result').innerHTML = result.join(' | ');
  localStorage.setItem('toreeCalc', JSON.stringify({ area, crop, densityPct, useFertilizer, showAcres }));
}

function initCropCalculator() {
  const calculateBtn = document.getElementById('calculate-btn');
  if (!calculateBtn) return;
  calculateBtn.addEventListener('click', calculateSeedlings);

  const quick100 = document.getElementById('quick-100');
  const quick250 = document.getElementById('quick-250');
  const quick500 = document.getElementById('quick-500');

  const setQuick = (v) => {
    document.getElementById('calc-area').value = v;
    calculateSeedlings();
  };

  quick100?.addEventListener('click', () => setQuick(25));
  quick250?.addEventListener('click', () => setQuick(60));
  quick500?.addEventListener('click', () => setQuick(110));

  const stored = localStorage.getItem('toreeCalc');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.area) document.getElementById('calc-area').value = parsed.area;
      if (parsed.crop) document.getElementById('calc-crop').value = parsed.crop;
      if (parsed.densityPct) document.getElementById('calc-density').value = parsed.densityPct;
      if (typeof parsed.useFertilizer === 'boolean') document.getElementById('fertilizer-pack').checked = parsed.useFertilizer;
      if (typeof parsed.showAcres === 'boolean') document.getElementById('calc-area-unit').checked = parsed.showAcres;
      calculateSeedlings();
    } catch (e) {
      console.warn('Invalid saved calculator state');
    }
  }
}

// ---- WEATHER INTEGRATION ----
async function loadWeatherData() {
  try {
    // Using a free weather API (you'd need to sign up for a real API key)
    // For demo purposes, we'll simulate weather data
    const weatherData = await getMockWeatherData();

    document.getElementById('weather-temp').textContent = `${weatherData.temp}°C`;
    document.getElementById('weather-condition').textContent = weatherData.condition;
    document.getElementById('weather-humidity').textContent = `${weatherData.humidity}% Humidity`;
    document.getElementById('weather-wind').textContent = `${weatherData.wind} km/h Wind`;

    const adviceElement = document.getElementById('planting-advice');
    if (adviceElement) {
      adviceElement.innerHTML = `<p>${getPlantingAdvice(weatherData)}</p>`;
    }
  } catch (error) {
    console.log('Weather data unavailable:', error);
  }
}

function getMockWeatherData() {
  // Simulate weather data for Kericho, Kenya
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
  const temps = [22, 24, 26, 20, 28];

  return {
    temp: temps[Math.floor(Math.random() * temps.length)],
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
    wind: Math.floor(Math.random() * 15) + 5 // 5-20 km/h
  };
}

function getPlantingAdvice(weather) {
  if (weather.temp >= 25 && weather.humidity >= 60) {
    return '🌱 Perfect conditions for transplanting! High humidity helps seedlings establish roots.';
  } else if (weather.temp >= 20 && weather.condition === 'Sunny') {
    return '☀️ Good weather for outdoor planting. Remember to water seedlings regularly.';
  } else if (weather.condition.includes('Rain')) {
    return '🌧️ Light rain is ideal for planting. Wait for heavy rain to pass.';
  } else {
    return '🌤️ Moderate conditions. Good time for greenhouse work and seedling care.';
  }
}
