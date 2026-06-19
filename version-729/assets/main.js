const normalizeText = (value) => String(value || '').toLowerCase().trim();

function setupMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-mobile-nav]');
  if (!toggle || !nav) {
    return;
  }
  toggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
  });
}

function setupHeroCarousel() {
  const root = document.querySelector('[data-hero-carousel]');
  if (!root) {
    return;
  }
  const slides = Array.from(root.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(root.querySelectorAll('[data-hero-dot]'));
  if (slides.length <= 1) {
    return;
  }

  let current = 0;
  let timer = null;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  };

  const start = () => {
    stop();
    timer = window.setInterval(() => showSlide(current + 1), 5200);
  };

  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.heroDot || 0));
      start();
    });
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  start();
}

function setupFilters() {
  document.querySelectorAll('[data-filter-form]').forEach((form) => {
    const container = form.closest('main') || document;
    const cards = Array.from(container.querySelectorAll('[data-card]'));
    const count = form.querySelector('[data-filter-count]');
    const keyword = form.elements.keyword;
    const year = form.elements.year;
    const region = form.elements.region;

    const update = () => {
      const keywordValue = normalizeText(keyword ? keyword.value : '');
      const yearValue = year ? year.value : '';
      const regionValue = region ? region.value : '';
      let visible = 0;

      cards.forEach((card) => {
        const haystack = normalizeText([
          card.dataset.title,
          card.dataset.year,
          card.dataset.region,
          card.dataset.type,
          card.dataset.tags
        ].join(' '));
        const cardYear = card.dataset.year || '';
        const cardRegion = card.dataset.region || '';
        const matchesKeyword = !keywordValue || haystack.includes(keywordValue);
        const matchesYear = !yearValue || (yearValue === '2021' ? Number(cardYear) <= 2021 : cardYear === yearValue);
        const matchesRegion = !regionValue || cardRegion.includes(regionValue) || haystack.includes(normalizeText(regionValue));
        const show = matchesKeyword && matchesYear && matchesRegion;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = `显示 ${visible} / ${cards.length} 部影片`;
      }
    };

    ['input', 'change'].forEach((eventName) => {
      form.addEventListener(eventName, update);
    });
    update();
  });
}

setupMobileMenu();
setupHeroCarousel();
setupFilters();
