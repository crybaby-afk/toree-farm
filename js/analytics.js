// Toree Farm Analytics
class ToreeAnalytics {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.init();
  }

  init() {
    // Track page views
    this.trackPageView();

    // Track user interactions
    this.trackInteractions();

    // Track performance metrics
    this.trackPerformance();

    // Track cart events
    this.trackCartEvents();

    // Send data periodically
    setInterval(() => this.sendAnalyticsData(), 30000); // Every 30 seconds

    // Send data on page unload
    window.addEventListener('beforeunload', () => this.sendAnalyticsData());
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  trackPageView() {
    this.trackEvent('page_view', {
      page: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      timestamp: Date.now()
    });
  }

  trackInteractions() {
    // Track button clicks
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, a, [role="button"]');
      if (target) {
        const elementInfo = {
          tagName: target.tagName,
          className: target.className,
          text: target.textContent?.trim().substring(0, 50),
          href: target.href,
          id: target.id
        };

        this.trackEvent('interaction', {
          type: 'click',
          element: elementInfo,
          page: window.location.pathname
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      this.trackEvent('form_submit', {
        formId: e.target.id,
        formClass: e.target.className,
        page: window.location.pathname
      });
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (scrollPercent % 25 === 0) { // Track every 25% milestone
          this.trackEvent('scroll_depth', {
            percentage: scrollPercent,
            page: window.location.pathname
          });
        }
      }
    });
  }

  trackPerformance() {
    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = Date.now() - this.startTime;
      this.trackEvent('performance', {
        metric: 'page_load_time',
        value: loadTime,
        page: window.location.pathname
      });
    });

    // Track largest contentful paint (if supported)
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              this.trackEvent('performance', {
                metric: 'lcp',
                value: entry.startTime,
                page: window.location.pathname
              });
            }
          }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.log('LCP tracking not supported');
      }
    }
  }

  trackCartEvents() {
    // Track add to cart
    const originalAddToCart = window.addToCart;
    if (originalAddToCart) {
      window.addToCart = (product, quantity = 1) => {
        originalAddToCart(product, quantity);
        this.trackEvent('cart', {
          action: 'add',
          productId: product.id,
          productName: product.name,
          quantity: quantity,
          price: product.price,
          page: window.location.pathname
        });
      };
    }

    // Track cart updates
    const originalUpdateCartQty = window.updateCartQty;
    if (originalUpdateCartQty) {
      window.updateCartQty = (productId, newQty) => {
        originalUpdateCartQty(productId, newQty);
        this.trackEvent('cart', {
          action: 'update_quantity',
          productId: productId,
          newQuantity: newQty,
          page: window.location.pathname
        });
      };
    }

    // Track orders
    const originalOrderViaWhatsApp = window.orderViaWhatsApp;
    if (originalOrderViaWhatsApp) {
      window.orderViaWhatsApp = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        this.trackEvent('purchase', {
          action: 'order_initiated',
          totalValue: total,
          itemCount: cart.length,
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          page: window.location.pathname
        });

        originalOrderViaWhatsApp();
      };
    }
  }

  trackEvent(eventType, data) {
    const event = {
      type: eventType,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      data: data
    };

    this.events.push(event);

    // Store locally for persistence
    this.saveEventsLocally();

    // Send immediately for important events
    if (['purchase', 'form_submit'].includes(eventType)) {
      this.sendAnalyticsData();
    }
  }

  saveEventsLocally() {
    try {
      const existingEvents = JSON.parse(localStorage.getItem('toree_analytics') || '[]');
      const allEvents = [...existingEvents, ...this.events].slice(-100); // Keep last 100 events
      localStorage.setItem('toree_analytics', JSON.stringify(allEvents));
    } catch (e) {
      console.log('Failed to save analytics data locally');
    }
  }

  async sendAnalyticsData() {
    if (this.events.length === 0) return;

    try {
      // In a real implementation, this would send to your analytics server
      // For now, we'll just log to console and store locally
      console.log('Analytics Data:', this.events);

      // Simulate sending to server
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          events: this.events,
          userInfo: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled
          }
        })
      }).catch(() => {
        // Ignore fetch errors for demo
        console.log('Analytics endpoint not available - storing locally');
      });

      if (response && response.ok) {
        // Clear sent events
        this.events = [];
        localStorage.removeItem('toree_analytics');
      }
    } catch (error) {
      console.log('Analytics send failed:', error);
    }
  }

  // Public method to get analytics data (for debugging)
  getAnalyticsData() {
    return {
      sessionId: this.sessionId,
      events: this.events,
      storedEvents: JSON.parse(localStorage.getItem('toree_analytics') || '[]')
    };
  }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.toreeAnalytics = new ToreeAnalytics();
});