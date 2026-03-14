// ==============================================
// Ermiş Hukuk Bürosu — Site JavaScript
// ==============================================

(function () {
  'use strict';

  // --- Sticky Header ---
  const header = document.getElementById('header');
  const sentinel = document.getElementById('headerSentinel');

  if (header && sentinel) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        header.classList.toggle('is-scrolled', !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
  }

  // --- Mobile Nav Toggle ---
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-active');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="/#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href').replace('/', '');
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', hash);
      }
    });
  });

  // Also handle # links on the same page
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', link.getAttribute('href'));
      }
    });
  });

  // --- Back to Top ---
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Active Nav Highlight ---
  const navLinks = document.querySelectorAll('.header__nav-link[data-section]');
  if (navLinks.length > 0) {
    const sections = [];
    navLinks.forEach(link => {
      const section = document.getElementById(link.dataset.section);
      if (section) sections.push({ el: section, link });
    });

    if (sections.length > 0) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const link = sections.find(s => s.el === entry.target)?.link;
            if (link) {
              link.classList.toggle('is-active', entry.isIntersecting);
            }
          });
        },
        { rootMargin: '-20% 0px -60% 0px' }
      );

      sections.forEach(({ el }) => sectionObserver.observe(el));
    }
  }

  // --- Article Filter Tabs (max 8 gösterim) ---
  const MAX_ARTICLES = 8;
  const filterBtns = document.querySelectorAll('[data-filter]');
  const filterItems = document.querySelectorAll('[data-category]');
  const moreLink = document.getElementById('articlesMoreLink');

  const filterLinks = {
    'all': '/aile-hukuku/',
    'aile-hukuku': '/aile-hukuku/',
    'ceza-hukuku': '/ceza-hukuku/',
    'icra-hukuku': '/icra-hukuku/',
    'tuketici-hukuku': '/tuketici-hukuku/',
    'dava-turleri': '/dava-turleri/'
  };

  function applyFilter(filter) {
    let visibleCount = 0;
    filterItems.forEach(item => {
      const matches = filter === 'all' || item.dataset.category === filter;
      if (matches && visibleCount < MAX_ARTICLES) {
        item.classList.remove('is-hidden');
        visibleCount++;
      } else {
        item.classList.add('is-hidden');
      }
    });
    if (moreLink && filterLinks[filter]) {
      moreLink.href = filterLinks[filter];
    }
  }

  if (filterBtns.length > 0 && filterItems.length > 0) {
    // İlk yüklemede max 8 göster
    applyFilter('all');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        applyFilter(btn.dataset.filter);
      });
    });
  }

  // --- Lazy Load Google Map ---
  const mapContainer = document.getElementById('mapContainer');
  if (mapContainer) {
    const mapObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const iframe = document.createElement('iframe');
          iframe.src = mapContainer.dataset.src;
          iframe.setAttribute('loading', 'lazy');
          iframe.setAttribute('allowfullscreen', '');
          iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
          iframe.setAttribute('title', 'Ermiş Hukuk Bürosu Konum');
          mapContainer.appendChild(iframe);
          mapObserver.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    mapObserver.observe(mapContainer);
  }

  // --- Current Year in Footer ---
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- Scroll Animations ---
  const animEls = document.querySelectorAll('[data-animate]');
  if (animEls.length > 0) {
    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            animObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    animEls.forEach(el => animObserver.observe(el));
  }

  // --- Hero Parallax ---
  const heroBgImg = document.querySelector('.hero__bg img');
  if (heroBgImg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroBgImg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
      }
    }, { passive: true });
  }

  // --- Category Page Pagination ---
  const ITEMS_PER_PAGE = 6;
  const articlesContainer = document.getElementById('articles-container');

  if (articlesContainer) {
    const articles = Array.from(articlesContainer.querySelectorAll('[data-article-index]'));
    const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
    let currentPage = 1;

    const paginationContainer = document.getElementById('pagination-container');
    const paginationNumbers = document.getElementById('pagination-numbers');
    const prevBtn = document.getElementById('pagination-prev');
    const nextBtn = document.getElementById('pagination-next');

    if (paginationContainer && totalPages > 1) {
      // Create page number buttons
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'pagination__number';
        pageBtn.textContent = i;
        pageBtn.setAttribute('data-page', i);
        if (i === 1) pageBtn.classList.add('active');

        pageBtn.addEventListener('click', () => {
          currentPage = i;
          updatePagination();
          articlesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        paginationNumbers.appendChild(pageBtn);
      }

      function updatePagination() {
        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIdx = startIdx + ITEMS_PER_PAGE;

        // Show/hide articles
        articles.forEach((article, idx) => {
          article.style.display = idx >= startIdx && idx < endIdx ? '' : 'none';
        });

        // Update button states
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        // Update active page number
        paginationNumbers.querySelectorAll('.pagination__number').forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-page') == currentPage);
        });
      }

      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          updatePagination();
          articlesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          updatePagination();
          articlesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      updatePagination();
    }
  }

})();
