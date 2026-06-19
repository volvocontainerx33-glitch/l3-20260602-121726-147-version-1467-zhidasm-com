(function () {
    var header = document.querySelector('[data-header]');
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    function syncHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 16) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    window.addEventListener('scroll', syncHeader, { passive: true });
    syncHeader();

    if (menuButton && mobileMenu && header) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
            header.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function startHero() {
            clearInterval(timer);
            timer = setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(index - 1);
                startHero();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(index + 1);
                startHero();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                startHero();
            });
        });

        showSlide(0);
        startHero();
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-search-input]');
        var select = scope.querySelector('[data-sort-select]');
        var grid = scope.parentElement ? scope.parentElement.querySelector('[data-card-grid]') : document.querySelector('[data-card-grid]');

        if (!grid) {
            grid = document.querySelector('[data-card-grid]');
        }

        function cards() {
            return Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));
        }

        function applyFilter() {
            if (!grid) {
                return;
            }
            var query = input ? normalize(input.value) : '';
            cards().forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-genre')
                ].join(' '));
                card.classList.toggle('is-hidden', query && haystack.indexOf(query) === -1);
            });
        }

        function applySort() {
            if (!grid || !select) {
                return;
            }
            var value = select.value;
            var sorted = cards();
            if (value === 'year-desc') {
                sorted.sort(function (a, b) {
                    return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
                });
            } else if (value === 'year-asc') {
                sorted.sort(function (a, b) {
                    return Number(a.getAttribute('data-year')) - Number(b.getAttribute('data-year'));
                });
            } else if (value === 'title-asc') {
                sorted.sort(function (a, b) {
                    return normalize(a.getAttribute('data-title')).localeCompare(normalize(b.getAttribute('data-title')), 'zh-CN');
                });
            }
            sorted.forEach(function (card) {
                grid.appendChild(card);
            });
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        if (select) {
            select.addEventListener('change', function () {
                applySort();
                applyFilter();
            });
        }
    });

    var video = document.querySelector('video[data-stream]');
    var playButton = document.querySelector('[data-play-button]');
    var activeHls = null;

    function preparePlayer() {
        if (!video || video.getAttribute('data-ready') === 'true') {
            return;
        }
        var streamUrl = video.getAttribute('data-stream');
        if (!streamUrl) {
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            activeHls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            activeHls.loadSource(streamUrl);
            activeHls.attachMedia(video);
            activeHls.on(window.Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }
                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                    activeHls.startLoad();
                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                    activeHls.recoverMediaError();
                } else {
                    activeHls.destroy();
                }
            });
        } else {
            video.src = streamUrl;
        }
        video.setAttribute('data-ready', 'true');
    }

    function startPlayer() {
        if (!video) {
            return;
        }
        preparePlayer();
        if (playButton) {
            playButton.classList.add('is-hidden');
        }
        video.play().catch(function () {});
    }

    if (playButton) {
        playButton.addEventListener('click', startPlayer);
    }

    if (video) {
        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayer();
            }
        });
        video.addEventListener('play', function () {
            if (playButton) {
                playButton.classList.add('is-hidden');
            }
        });
    }

    window.addEventListener('beforeunload', function () {
        if (activeHls) {
            activeHls.destroy();
        }
    });
})();
