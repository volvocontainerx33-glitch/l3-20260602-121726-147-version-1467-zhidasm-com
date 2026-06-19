(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === current);
        });
    }

    function restartHero() {
        if (!slides.length) {
            return;
        }
        window.clearInterval(timer);
        timer = window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            restartHero();
        });
    });

    if (prev) {
        prev.addEventListener('click', function () {
            showSlide(current - 1);
            restartHero();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            showSlide(current + 1);
            restartHero();
        });
    }

    restartHero();

    var grids = Array.prototype.slice.call(document.querySelectorAll('[data-card-grid]'));

    grids.forEach(function (grid) {
        var cards = Array.prototype.slice.call(grid.children);
        var section = grid.closest('section') || document;
        var searchInput = section.querySelector('[data-movie-search]');
        var sortSelect = section.querySelector('[data-sort-select]');

        function applyFilter() {
            var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
            cards.forEach(function (card) {
                var content = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-tags'),
                    card.textContent
                ].join(' ').toLowerCase();
                card.style.display = content.indexOf(query) >= 0 ? '' : 'none';
            });
        }

        function applySort() {
            if (!sortSelect) {
                return;
            }
            var value = sortSelect.value;
            var ordered = cards.slice();
            ordered.sort(function (a, b) {
                var ay = Number(a.getAttribute('data-year')) || 0;
                var by = Number(b.getAttribute('data-year')) || 0;
                var at = a.getAttribute('data-title') || '';
                var bt = b.getAttribute('data-title') || '';
                if (value === 'year-desc') {
                    return by - ay;
                }
                if (value === 'year-asc') {
                    return ay - by;
                }
                if (value === 'title-asc') {
                    return at.localeCompare(bt, 'zh-Hans-CN');
                }
                return 0;
            });
            ordered.forEach(function (card) {
                grid.appendChild(card);
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', applyFilter);
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                applySort();
                applyFilter();
            });
        }
    });
})();
