const FARM_GALLERY_ITEMS = [
  { src: '../images/optimized/7.jpeg', category: 'nursery', title: 'Healthy seedling setup', caption: 'Neat seedling arrangements showing real nursery quality.' },
  { src: '../images/optimized/8.jpeg', category: 'greenhouse', title: 'Greenhouse rows', caption: 'Protected greenhouse rows full of healthy young seedlings.' },
  { src: '../images/optimized/9.jpeg', category: 'showcase', title: 'Customer-ready seedlings', caption: 'Seedlings arranged neatly and ready for buyers.' },
  { src: '../images/optimized/10.jpeg', category: 'nursery', title: 'Nursery growth', caption: 'Dense seedling growth with clean layout and healthy color.' },
  { src: '../images/optimized/11.jpeg', category: 'nursery', title: 'Leafy seedling lines', caption: 'Leafy seedlings raised carefully inside the nursery.' },
  { src: '../images/optimized/12.jpeg', category: 'showcase', title: 'Planning stage', caption: 'Strong seedlings at a stage ideal for farmer planning.' },
  { src: '../images/optimized/13.jpeg', category: 'greenhouse', title: 'Protected production', caption: 'Seedling production inside a protected growing space.' },
  { src: '../images/optimized/14.jpeg', category: 'showcase', title: 'Mixed seedling display', caption: 'Mixed seedling lines prepared for reliable field establishment.' },
  { src: '../images/optimized/15.jpeg', category: 'showcase', title: 'Farm display', caption: 'A real farm display of healthy seedlings ready for sale.' },
  { src: '../images/optimized/16.jpeg', category: 'nursery', title: 'Stocked nursery area', caption: 'A nursery section stocked with strong and even seedlings.' },
  { src: '../images/optimized/17.jpeg', category: 'showcase', title: 'Closer look at quality', caption: 'A closer look at the seedling quality from Toree Farm.' },
  { src: '../images/optimized/18.jpeg', category: 'showcase', title: 'Grouped for collection', caption: 'Seedlings grouped neatly for faster buying and collection.' },
  { src: '../images/optimized/19.jpeg', category: 'nursery', title: 'Daily production', caption: 'An active nursery area showing real daily production.' },
  { src: '../images/optimized/20.jpeg', category: 'showcase', title: 'Clean presentation', caption: 'Seedlings presented cleanly and ready for customers.' },
  { src: '../images/optimized/21.jpeg', category: 'greenhouse', title: 'Farm nursery output', caption: 'A real farm view showing healthy nursery output.' },
  { src: '../images/optimized/22.jpeg', category: 'greenhouse', title: 'Extra nursery scene', caption: 'Another real view from Toree Farm operations.' }
];

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('farm-gallery-grid');
  const filterButtons = Array.from(document.querySelectorAll('.farm-gallery-filter'));
  const lightbox = document.getElementById('farm-lightbox');
  const lightboxImage = document.getElementById('farm-lightbox-image');
  const lightboxCaption = document.getElementById('farm-lightbox-caption');
  const closeButton = document.getElementById('farm-lightbox-close');
  const prevButton = document.getElementById('farm-lightbox-prev');
  const nextButton = document.getElementById('farm-lightbox-next');

  if (!grid || !lightbox || !lightboxImage || !lightboxCaption) return;

  let visibleItems = [...FARM_GALLERY_ITEMS];
  let activeIndex = 0;

  function renderGrid() {
    grid.innerHTML = visibleItems.map((item, index) => `
      <button type="button" class="farm-gallery-card" data-index="${index}" aria-label="${item.title}">
        <img src="${item.src}" alt="${item.title}" loading="lazy" decoding="async">
        <span class="farm-gallery-card-copy">
          <strong>${item.title}</strong>
          <span>${item.caption}</span>
        </span>
      </button>
    `).join('');

    grid.querySelectorAll('.farm-gallery-card').forEach((card) => {
      card.addEventListener('click', () => {
        openLightbox(Number(card.dataset.index));
      });
    });
  }

  function applyFilter(filter) {
    visibleItems = filter === 'all'
      ? [...FARM_GALLERY_ITEMS]
      : FARM_GALLERY_ITEMS.filter((item) => item.category === filter);

    filterButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.filter === filter);
    });

    renderGrid();
  }

  function updateLightbox() {
    const item = visibleItems[activeIndex];
    if (!item) return;
    lightboxImage.src = item.src;
    lightboxImage.alt = item.title;
    lightboxCaption.textContent = item.caption;
  }

  function openLightbox(index) {
    activeIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    window.setTimeout(() => {
      if (!lightbox.classList.contains('open')) {
        lightboxImage.src = '';
        lightboxImage.alt = '';
      }
    }, 160);
  }

  function showPrev() {
    if (!visibleItems.length) return;
    activeIndex = (activeIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightbox();
  }

  function showNext() {
    if (!visibleItems.length) return;
    activeIndex = (activeIndex + 1) % visibleItems.length;
    updateLightbox();
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => applyFilter(button.dataset.filter));
  });

  closeButton?.addEventListener('click', closeLightbox);
  prevButton?.addEventListener('click', showPrev);
  nextButton?.addEventListener('click', showNext);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  lightbox.querySelector('.farm-lightbox-dialog')?.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showPrev();
    if (event.key === 'ArrowRight') showNext();
  });

  applyFilter('all');
});
