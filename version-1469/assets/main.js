document.addEventListener("DOMContentLoaded", function () {
    initializeNavigation();
    initializeHero();
    initializeFilters();
    initializeImages();
});

function initializeNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-site-nav]");

    if (!toggle || !nav) {
        return;
    }

    toggle.addEventListener("click", function () {
        nav.classList.toggle("open");
    });
}

function initializeHero() {
    var root = document.querySelector("[data-hero]");

    if (!root) {
        return;
    }

    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("active", slideIndex === index);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("active", dotIndex === index);
        });
    }

    function start() {
        stop();
        timer = window.setInterval(function () {
            show(index + 1);
        }, 5200);
    }

    function stop() {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    }

    dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
            show(dotIndex);
            start();
        });
    });

    if (prev) {
        prev.addEventListener("click", function () {
            show(index - 1);
            start();
        });
    }

    if (next) {
        next.addEventListener("click", function () {
            show(index + 1);
            start();
        });
    }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
}

function initializeFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));

    panels.forEach(function (panel) {
        var scope = panel.closest("section") || document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
        var input = panel.querySelector("[data-filter-input]");
        var year = panel.querySelector("[data-filter-year]");
        var type = panel.querySelector("[data-filter-type]");
        var category = panel.querySelector("[data-filter-category]");
        var empty = scope.querySelector("[data-empty-state]");

        function apply() {
            var query = input ? input.value.trim().toLowerCase() : "";
            var selectedYear = year ? year.value : "";
            var selectedType = type ? type.value : "";
            var selectedCategory = category ? category.value : "";
            var shown = 0;

            cards.forEach(function (card) {
                var text = [
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.genre
                ].join(" ").toLowerCase();
                var cardYear = parseInt(card.dataset.year || "0", 10);
                var matchQuery = !query || text.indexOf(query) !== -1;
                var matchYear = true;
                var matchType = !selectedType || (card.dataset.type || "").indexOf(selectedType) !== -1;
                var matchCategory = !selectedCategory || card.dataset.category === selectedCategory;

                if (selectedYear === "2020") {
                    matchYear = cardYear <= 2020;
                } else if (selectedYear) {
                    matchYear = String(cardYear) === selectedYear;
                }

                var visible = matchQuery && matchYear && matchType && matchCategory;
                card.style.display = visible ? "" : "none";

                if (visible) {
                    shown += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("show", shown === 0);
            }
        }

        [input, year, type, category].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });

        apply();
    });
}

function initializeImages() {
    Array.prototype.slice.call(document.querySelectorAll("img")).forEach(function (image) {
        image.addEventListener("error", function () {
            image.classList.add("image-missing");
        });
    });
}
