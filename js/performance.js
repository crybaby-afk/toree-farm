// Toree Farm Performance Optimizations
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.optimizeFonts();
    this.preloadCriticalResources();
    this.optimizeAnimations();
    this.addPerformanceMonitoring();
  }

  lazyLoadImages() {
    // Use Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without Intersection Observer
      this.loadAllImages();
    }
  }

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    }
  }

  loadAllImages() {
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.loadImage(img);
    });
  }

  optimizeFonts() {
    // Preload critical fonts
    const fontLinks = [
      // Add font preloads here if using custom fonts
    ];

    fontLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = 'font';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  preloadCriticalResources() {
    // Preload critical images and resources
    const criticalResources = [
      'images/optimized/logo-640.webp',
      'images/optimized/hero-bg-640.webp'
    ];

    criticalResources.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }

  optimizeAnimations() {
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.disableAnimations();
    }

    // Use will-change for animated elements
    document.querySelectorAll('.leaf, .floating-element').forEach(el => {
      el.style.willChange = 'transform';
    });
  }

  disableAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }

  addPerformanceMonitoring() {
    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memInfo = performance.memory;
        console.log('Memory Usage:', {
          used: Math.round(memInfo.usedJSHeapSize / 1048576) + ' MB',
          total: Math.round(memInfo.totalJSHeapSize / 1048576) + ' MB',
          limit: Math.round(memInfo.jsHeapSizeLimit / 1048576) + ' MB'
        });
      }, 10000);
    }
  }

  monitorCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime + 'ms');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.log('LCP monitoring not supported');
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log('FID:', entry.processingStart - entry.startTime + 'ms');
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.log('FID monitoring not supported');
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          console.log('CLS:', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.log('CLS monitoring not supported');
      }
    }
  }

  // Image optimization utilities
  static optimizeImage(src, options = {}) {
    const {
      width = 'auto',
      height = 'auto',
      quality = 80,
      format = 'webp'
    } = options;

    // In a real implementation, this would call an image optimization service
    // For now, return the original src
    return src;
  }

  // Cache management
  static clearCache() {
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
  }

  // Preload pages for faster navigation
  preloadPage(url) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }
}

// Resource hints for better performance
function addResourceHints() {
  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'preconnect', href: '//fonts.gstatic.com', crossorigin: '' },
    { rel: 'dns-prefetch', href: '//www.google-analytics.com' }
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
    document.head.appendChild(link);
  });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
  addResourceHints();
  window.performanceOptimizer = new PerformanceOptimizer();

  // Preload important pages
  setTimeout(() => {
    window.performanceOptimizer.preloadPage('shop.html');
    window.performanceOptimizer.preloadPage('about.html');
    window.performanceOptimizer.preloadPage('contact.html');
  }, 2000);
});