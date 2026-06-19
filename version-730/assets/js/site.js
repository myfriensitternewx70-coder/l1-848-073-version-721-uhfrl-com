(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var next = parseInt(dot.getAttribute("data-hero-dot"), 10);
        show(next);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupFilters() {
    var scopes = document.querySelectorAll("[data-filter-scope]");
    scopes.forEach(function (scope) {
      var input = scope.querySelector("[data-filter-input]");
      var yearSelect = scope.querySelector("[data-year-filter]");
      var categorySelect = scope.querySelector("[data-category-filter]");
      var grid = document.querySelector("[data-filter-grid]");
      var empty = document.querySelector("[data-empty-state]");
      if (!grid) {
        return;
      }
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
      if (input && input.hasAttribute("data-query-from-url")) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        if (query) {
          input.value = query;
        }
      }
      function apply() {
        var term = normalize(input ? input.value : "");
        var year = yearSelect ? yearSelect.value : "";
        var category = categorySelect ? categorySelect.value : "";
        var visible = 0;
        cards.forEach(function (card) {
          var title = normalize(card.getAttribute("data-title"));
          var keywords = normalize(card.getAttribute("data-keywords"));
          var cardYear = card.getAttribute("data-year") || "";
          var cardCategory = card.getAttribute("data-category") || "";
          var matchTerm = !term || title.indexOf(term) !== -1 || keywords.indexOf(term) !== -1 || cardYear.indexOf(term) !== -1;
          var matchYear = !year || cardYear === year;
          var matchCategory = !category || cardCategory === category;
          var shouldShow = matchTerm && matchYear && matchCategory;
          card.style.display = shouldShow ? "" : "none";
          if (shouldShow) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("show", visible === 0);
        }
      }
      if (input) {
        input.addEventListener("input", apply);
      }
      if (yearSelect) {
        yearSelect.addEventListener("change", apply);
      }
      if (categorySelect) {
        categorySelect.addEventListener("change", apply);
      }
      apply();
    });
  }

  window.initMoviePlayer = function (source) {
    var holder = document.querySelector("[data-player]");
    if (!holder) {
      return;
    }
    var video = holder.querySelector("video");
    var cover = holder.querySelector(".player-cover");
    var loaded = false;
    function load() {
      if (!video || loaded) {
        return;
      }
      loaded = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }
    function play() {
      load();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      video.controls = true;
      var action = video.play();
      if (action && typeof action.catch === "function") {
        action.catch(function () {});
      }
    }
    if (cover) {
      cover.addEventListener("click", play);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
  };

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
