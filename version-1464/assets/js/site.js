(function () {
    const toggle = document.querySelector(".menu-toggle");
    const panel = document.querySelector(".mobile-panel");

    if (toggle && panel) {
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    const slides = Array.from(document.querySelectorAll(".feature-slide"));
    const dots = Array.from(document.querySelectorAll(".slide-dot"));
    let activeSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, itemIndex) {
            slide.classList.toggle("is-active", itemIndex === activeSlide);
        });
        dots.forEach(function (dot, itemIndex) {
            dot.classList.toggle("is-active", itemIndex === activeSlide);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(activeSlide + 1);
        }, 5200);
    }

    const searchInput = document.querySelector("[data-filter-input]");
    const yearSelect = document.querySelector("[data-filter-year]");
    const typeSelect = document.querySelector("[data-filter-type]");
    const cards = Array.from(document.querySelectorAll("[data-card]"));
    const noResults = document.querySelector(".no-results");

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function runFilter() {
        if (!cards.length) {
            return;
        }

        const query = normalize(searchInput ? searchInput.value : "");
        const year = normalize(yearSelect ? yearSelect.value : "");
        const type = normalize(typeSelect ? typeSelect.value : "");
        let visible = 0;

        cards.forEach(function (card) {
            const text = normalize(card.getAttribute("data-search-text"));
            const matchedQuery = !query || text.indexOf(query) !== -1;
            const matchedYear = !year || text.indexOf(year) !== -1;
            const matchedType = !type || text.indexOf(type) !== -1;
            const matched = matchedQuery && matchedYear && matchedType;
            card.style.display = matched ? "" : "none";

            if (matched) {
                visible += 1;
            }
        });

        if (noResults) {
            noResults.classList.toggle("is-visible", visible === 0);
        }
    }

    if (searchInput || yearSelect || typeSelect) {
        const params = new URLSearchParams(window.location.search);
        const q = params.get("q");

        if (q && searchInput) {
            searchInput.value = q;
        }

        [searchInput, yearSelect, typeSelect].forEach(function (control) {
            if (control) {
                control.addEventListener("input", runFilter);
                control.addEventListener("change", runFilter);
            }
        });

        runFilter();
    }
})();
