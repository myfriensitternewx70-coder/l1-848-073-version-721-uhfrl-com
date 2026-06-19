(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    if (menuButton) {
        menuButton.addEventListener('click', function () {
            document.body.classList.toggle('menu-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function startTimer() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-movie-search]'));
    searchInputs.forEach(function (input) {
        var scope = document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
        var empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = '没有找到匹配影片';
        empty.style.display = 'none';
        var target = cards.length ? cards[cards.length - 1].parentNode : null;
        if (target && target.parentNode) {
            target.parentNode.insertBefore(empty, target.nextSibling);
        }

        input.addEventListener('input', function () {
            var keyword = input.value.trim().toLowerCase();
            var shown = 0;
            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-tags')
                ].join(' ').toLowerCase();
                var matched = !keyword || haystack.indexOf(keyword) !== -1;
                card.classList.toggle('is-hidden', !matched);
                if (matched) {
                    shown += 1;
                }
            });
            empty.style.display = shown === 0 ? 'block' : 'none';
        });
    });
})();
