(function () {
  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    var activate = function (index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    };

    var nextSlide = function () {
      activate(current + 1);
    };

    var start = function () {
      stop();
      timer = window.setInterval(nextSlide, 5600);
    };

    var stop = function () {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        activate(index);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        activate(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        activate(current + 1);
        start();
      });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    activate(0);
    start();
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));

  panels.forEach(function (panel) {
    var root = panel.parentElement;
    var cards = Array.prototype.slice.call(root.querySelectorAll("[data-card-list] .movie-card, [data-card-list] .rank-item"));

    if (!cards.length) {
      cards = Array.prototype.slice.call(document.querySelectorAll("[data-card-list] .movie-card, [data-card-list] .rank-item"));
    }
    var input = panel.querySelector("[data-search-input]");
    var yearFilter = panel.querySelector("[data-year-filter]");
    var clear = panel.querySelector("[data-clear-filter]");
    var empty = root.querySelector("[data-empty-state]");

    var apply = function () {
      var query = input ? input.value.trim().toLowerCase() : "";
      var minYear = yearFilter && yearFilter.value ? Number(yearFilter.value) : 0;
      var visible = 0;

      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || "").toLowerCase();
        var year = Number(card.getAttribute("data-year") || 0);
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchYear = !minYear || year >= minYear || year === 0;
        var show = matchQuery && matchYear;
        card.style.display = show ? "" : "none";
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    };

    if (input) {
      input.addEventListener("input", apply);
    }

    if (yearFilter) {
      yearFilter.addEventListener("change", apply);
    }

    if (clear) {
      clear.addEventListener("click", function () {
        if (input) {
          input.value = "";
        }
        if (yearFilter) {
          yearFilter.value = "";
        }
        apply();
      });
    }

    apply();
  });

  if (header) {
    var lastY = window.scrollY;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 8);
      lastY = y;
    }, { passive: true });
  }
})();
