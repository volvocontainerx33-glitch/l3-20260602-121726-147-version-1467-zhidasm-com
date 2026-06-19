(function () {
    const header = document.querySelector('[data-header]');
    const toggle = document.querySelector('[data-menu-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    function updateHeader() {
        if (!header) {
            return;
        }
        header.classList.toggle('scrolled', window.scrollY > 18);
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    const hero = document.querySelector('[data-hero]');
    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-slide-dot]'));
        const prev = hero.querySelector('[data-slide-prev]');
        const next = hero.querySelector('[data-slide-next]');
        let index = 0;
        let timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function startTimer() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-slide-dot')) || 0);
                startTimer();
            });
        });

        startTimer();
    }

    const panels = Array.from(document.querySelectorAll('[data-filter-panel]'));
    panels.forEach(function (panel) {
        const area = panel.closest('main') || document;
        const cards = Array.from(area.querySelectorAll('[data-card]'));
        const search = panel.querySelector('[data-search-input]');
        const typeFilter = panel.querySelector('[data-type-filter]');
        const regionFilter = panel.querySelector('[data-region-filter]');
        const yearFilter = panel.querySelector('[data-year-filter]');

        function fillSelect(select, attr) {
            if (!select) {
                return;
            }
            const values = Array.from(new Set(cards.map(function (card) {
                return card.getAttribute(attr) || '';
            }).filter(Boolean))).sort(function (a, b) {
                return String(b).localeCompare(String(a), 'zh-CN');
            });
            values.forEach(function (value) {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        }

        fillSelect(typeFilter, 'data-type');
        fillSelect(regionFilter, 'data-region');
        fillSelect(yearFilter, 'data-year');

        function applyFilters() {
            const keyword = search ? search.value.trim().toLowerCase() : '';
            const typeValue = typeFilter ? typeFilter.value : '';
            const regionValue = regionFilter ? regionFilter.value : '';
            const yearValue = yearFilter ? yearFilter.value : '';

            cards.forEach(function (card) {
                const haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-year')
                ].join(' ').toLowerCase();
                const matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                const matchedType = !typeValue || card.getAttribute('data-type') === typeValue;
                const matchedRegion = !regionValue || card.getAttribute('data-region') === regionValue;
                const matchedYear = !yearValue || card.getAttribute('data-year') === yearValue;
                card.classList.toggle('hidden-card', !(matchedKeyword && matchedType && matchedRegion && matchedYear));
            });
        }

        [search, typeFilter, regionFilter, yearFilter].forEach(function (el) {
            if (el) {
                el.addEventListener('input', applyFilters);
                el.addEventListener('change', applyFilters);
            }
        });
    });
})();
