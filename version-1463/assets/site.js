(function () {
  var toggle = document.querySelector('.menu-toggle');
  var panel = document.querySelector('.mobile-panel');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var isOpen = panel.hasAttribute('hidden') === false;
      if (isOpen) {
        panel.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        panel.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  document.querySelectorAll('[data-card-filter]').forEach(function (wrap) {
    var input = wrap.querySelector('[data-filter-input]');
    var cards = Array.prototype.slice.call(wrap.querySelectorAll('.movie-card, .rank-list-row'));
    var yearButtons = Array.prototype.slice.call(wrap.querySelectorAll('[data-filter-year]'));
    var activeYear = 'all';

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function applyFilter() {
      var keyword = normalize(input ? input.value : '');
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-category'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.textContent
        ].join(' '));
        var yearMatch = activeYear === 'all' || card.getAttribute('data-year') === activeYear;
        var keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
        card.classList.toggle('hidden-by-filter', !(yearMatch && keywordMatch));
      });
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    yearButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeYear = button.getAttribute('data-filter-year') || 'all';
        yearButtons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        applyFilter();
      });
    });
  });

  var searchInput = document.querySelector('[data-search-page-input]');
  var searchResults = document.querySelector('[data-search-results]');
  var searchTitle = document.querySelector('[data-search-title]');

  if (searchInput && searchResults && window.MOVIE_SEARCH_DATA) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    searchInput.value = initial;

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function render(items, keyword) {
      if (searchTitle) {
        searchTitle.textContent = keyword ? '搜索结果' : '热门推荐';
      }
      searchResults.innerHTML = items.slice(0, 120).map(function (item) {
        var tags = (item.tags || []).slice(0, 4).map(function (tag) {
          return '<span class="tag">' + escapeHtml(tag) + '</span>';
        }).join('');
        return [
          '<article class="movie-card">',
          '  <a class="poster-link" href="' + escapeHtml(item.url) + '">',
          '    <img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
          '    <span class="poster-mask"><span class="play-icon">▶</span></span>',
          '  </a>',
          '  <div class="card-body">',
          '    <div class="card-meta"><a href="category-' + escapeHtml(slugByCategory(item.category)) + '.html">' + escapeHtml(item.category) + '</a><span>' + escapeHtml(item.year) + '</span></div>',
          '    <h2><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h2>',
          '    <p>' + escapeHtml(item.desc) + '</p>',
          '    <div class="mini-tags">' + tags + '</div>',
          '  </div>',
          '</article>'
        ].join('');
      }).join('');
    }

    var categorySlugMap = {
      '热播剧集': 'hot-series',
      '经典电影': 'classic-movies',
      '悬疑犯罪': 'suspense-crime',
      '喜剧爱情': 'comedy-love',
      '动作冒险': 'action-adventure',
      '动画奇幻': 'animation-fantasy',
      '纪录历史': 'documentary-history',
      '青春校园': 'youth-campus',
      '恐怖惊悚': 'horror-thriller',
      '海外精选': 'global-picks'
    };

    function slugByCategory(name) {
      return categorySlugMap[name] || 'hot-series';
    }

    function doSearch() {
      var keyword = searchInput.value.toLowerCase().trim();
      if (!keyword) {
        render(window.MOVIE_SEARCH_DATA.slice(0, 18), '');
        return;
      }
      var parts = keyword.split(/\s+/).filter(Boolean);
      var matched = window.MOVIE_SEARCH_DATA.filter(function (item) {
        var haystack = [
          item.title,
          item.category,
          item.year,
          item.region,
          item.type,
          item.genre,
          item.desc,
          (item.tags || []).join(' ')
        ].join(' ').toLowerCase();
        return parts.every(function (part) {
          return haystack.indexOf(part) !== -1;
        });
      });
      render(matched, keyword);
    }

    searchInput.addEventListener('input', doSearch);
    doSearch();
  }
})();
