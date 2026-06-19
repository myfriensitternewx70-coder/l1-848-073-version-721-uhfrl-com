(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-nav-links]');

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showHero(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function restartHero() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showHero(current + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showHero(current - 1);
        restartHero();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showHero(current + 1);
        restartHero();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showHero(Number(dot.getAttribute('data-hero-dot')) || 0);
        restartHero();
      });
    });

    showHero(0);
    restartHero();
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var categoryFilter = document.querySelector('[data-category-filter]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card-filter'));

  if (yearFilter && cards.length) {
    var years = cards
      .map(function (card) {
        return card.getAttribute('data-year') || '';
      })
      .filter(function (year, index, array) {
        return year && array.indexOf(year) === index && /^\d{4}$/.test(year);
      })
      .sort(function (a, b) {
        return Number(b) - Number(a);
      });

    years.forEach(function (year) {
      var option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearFilter.appendChild(option);
    });
  }

  function applyFilter() {
    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var category = categoryFilter ? categoryFilter.value : '';
    var year = yearFilter ? yearFilter.value : '';

    cards.forEach(function (card) {
      var text = [
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-category')
      ].join(' ').toLowerCase();
      var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
      var matchCategory = !category || card.getAttribute('data-category') === category;
      var matchYear = !year || card.getAttribute('data-year') === year;
      card.classList.toggle('is-filter-hidden', !(matchKeyword && matchCategory && matchYear));
    });
  }

  if (filterInput) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');

    if (q) {
      filterInput.value = q;
    }

    filterInput.addEventListener('input', applyFilter);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilter);
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', applyFilter);
  }

  applyFilter();
})();

function initMoviePlayer(source) {
  var video = document.getElementById('movie-player');
  var cover = document.querySelector('[data-player-cover]');
  var started = false;
  var hls = null;

  if (!video || !source) {
    return;
  }

  function bindSource() {
    if (started) {
      return;
    }

    started = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
  }

  function playVideo() {
    bindSource();
    video.controls = true;

    if (cover) {
      cover.classList.add('is-hidden');
    }

    var playTask = video.play();

    if (playTask && typeof playTask.catch === 'function') {
      playTask.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener('click', playVideo);
  }

  video.addEventListener('click', function () {
    if (!started) {
      playVideo();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
