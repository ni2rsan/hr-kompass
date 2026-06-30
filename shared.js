/* =========================================================
   HR Kompass – Shared JavaScript
   ========================================================= */
(function () {
  'use strict';

  // ---------- Lucide Icons ----------
  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // ---------- Mobile burger menu ----------
  function initMobileMenu() {
    const toggle = document.querySelector('[data-mobile-toggle]');
    const menu = document.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      const icon = toggle.querySelector('[data-icon]');
      if (icon) {
        icon.setAttribute('data-lucide', open ? 'x' : 'menu');
        initIcons();
      }
    });
    // Close on link click
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Active nav link ----------
  function initActiveNav() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('[data-nav-link]').forEach(function (link) {
      const href = (link.getAttribute('href') || '').toLowerCase();
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('is-active');
      }
    });
  }

  // ---------- Scroll reveal ----------
  function initReveal() {
    const elements = document.querySelectorAll('.hk-reveal');
    if (!elements.length || !('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    elements.forEach(function (el) { observer.observe(el); });
  }

  // ---------- Counter animation ----------
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-counter-target'));
    const duration = parseInt(el.getAttribute('data-counter-duration') || '1600', 10);
    const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = target * eased;
      el.textContent = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString('de-DE');
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString('de-DE');
    }
    requestAnimationFrame(tick);
  }
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter-target]');
    if (!counters.length) return;
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { observer.observe(el); });
  }

  // ---------- Tabs ----------
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (group) {
      const buttons = group.querySelectorAll('[data-tab-target]');
      const panels = group.querySelectorAll('[data-tab-panel]');
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const target = btn.getAttribute('data-tab-target');
          buttons.forEach(function (b) {
            b.classList.toggle('is-active', b === btn);
            b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
          });
          panels.forEach(function (p) {
            p.classList.toggle('is-active', p.getAttribute('data-tab-panel') === target);
          });
        });
      });
    });
  }

  // ---------- Accordion ----------
  function initAccordion() {
    document.querySelectorAll('[data-accordion]').forEach(function (group) {
      group.querySelectorAll('.hk-accordion-item').forEach(function (item) {
        const trigger = item.querySelector('.hk-accordion-trigger');
        if (!trigger) return;
        trigger.addEventListener('click', function () {
          const isOpen = item.classList.contains('is-open');
          group.querySelectorAll('.hk-accordion-item').forEach(function (i) {
            i.classList.remove('is-open');
            const t = i.querySelector('.hk-accordion-trigger');
            if (t) t.setAttribute('aria-expanded', 'false');
          });
          if (!isOpen) {
            item.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
      });
    });
  }

  // ---------- Testimonial slider ----------
  function initTestimonials() {
    const slider = document.querySelector('[data-testimonial-slider]');
    if (!slider) return;
    const slides = slider.querySelectorAll('.hk-testimonial');
    const dots = slider.querySelectorAll('.hk-testimonial-dot');
    let current = 0;
    let timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
    }
    function autoplay() {
      stop();
      timer = setInterval(function () { show(current + 1); }, 6000);
    }
    function stop() { if (timer) clearInterval(timer); }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); autoplay(); });
    });
    const prev = slider.querySelector('[data-slider-prev]');
    const next = slider.querySelector('[data-slider-next]');
    if (prev) prev.addEventListener('click', function () { show(current - 1); autoplay(); });
    if (next) next.addEventListener('click', function () { show(current + 1); autoplay(); });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', autoplay);
    show(0);
    autoplay();
  }

  // ---------- Resource filter ----------
  function initResourceFilter() {
    const wrap = document.querySelector('[data-resource-filter]');
    if (!wrap) return;
    const buttons = wrap.querySelectorAll('[data-filter]');
    const cards = document.querySelectorAll('[data-resource-card]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = btn.getAttribute('data-filter');
        buttons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        cards.forEach(function (card) {
          const type = card.getAttribute('data-type');
          const show = filter === 'all' || filter === type;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // ---------- Smooth-scroll for in-page anchors ----------
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      link.addEventListener('click', function (e) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ---------- Year in footer ----------
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', function () {
    initIcons();
    initMobileMenu();
    initActiveNav();
    initReveal();
    initCounters();
    initTabs();
    initAccordion();
    initTestimonials();
    initResourceFilter();
    initSmoothAnchors();
    initYear();
  });
})();
