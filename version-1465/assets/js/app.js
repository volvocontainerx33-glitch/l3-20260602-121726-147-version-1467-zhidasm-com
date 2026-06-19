(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-nav-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var current = 0;
      var timer = null;

      function showSlide(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === current);
        });
      }

      function startHero() {
        stopHero();
        timer = window.setInterval(function () {
          showSlide(current + 1);
        }, 5200);
      }

      function stopHero() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
          startHero();
        });
      });

      hero.addEventListener("mouseenter", stopHero);
      hero.addEventListener("mouseleave", startHero);
      showSlide(0);
      startHero();
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]")).forEach(function (scope) {
      var input = scope.querySelector("[data-filter-input]");
      var year = scope.querySelector("[data-filter-year]");
      var reset = scope.querySelector("[data-filter-reset]");
      var empty = scope.querySelector("[data-empty-state]");
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));

      function applyFilter() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        var yearValue = year ? year.value : "";
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags"),
            card.getAttribute("data-year")
          ].join(" ").toLowerCase();
          var keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
          var yearMatch = !yearValue || card.getAttribute("data-year") === yearValue;
          var show = keywordMatch && yearMatch;
          card.style.display = show ? "" : "none";
          if (show) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("show", visible === 0);
        }
      }

      if (input) {
        input.addEventListener("input", applyFilter);
      }
      if (year) {
        year.addEventListener("change", applyFilter);
      }
      if (reset) {
        reset.addEventListener("click", function () {
          if (input) {
            input.value = "";
          }
          if (year) {
            year.value = "";
          }
          applyFilter();
        });
      }

      if (scope.hasAttribute("data-search-page")) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        if (query && input) {
          input.value = query;
        }
      }

      applyFilter();
    });
  });
})();
