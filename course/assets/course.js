(function () {
  function safeStorage(fn) {
    try {
      return fn();
    } catch (_) {
      return null;
    }
  }

  function weekKey(slug) {
    return 'productise-course:' + slug;
  }

  function taskKey(slug, id) {
    return 'productise-course-task:' + slug + ':' + id;
  }

  function markWeekComplete(slug, done) {
    safeStorage(function () {
      if (done) localStorage.setItem(weekKey(slug), '1');
      else localStorage.removeItem(weekKey(slug));
    });
    updateProgress();
  }

  function isWeekComplete(slug) {
    return safeStorage(function () {
      return localStorage.getItem(weekKey(slug)) === '1';
    }) === true;
  }

  function updateProgress() {
    var el = document.querySelector('[data-progress]');
    if (!el) return;
    var total = Number(el.getAttribute('data-total') || '26');
    var count = 0;
    for (var i = 1; i <= total; i++) {
      var slug = 'week-' + String(i).padStart(2, '0');
      if (isWeekComplete(slug)) count += 1;
    }
    el.textContent = 'Weeks completed: ' + count + '/' + total;

    document.querySelectorAll('[data-week-slug]').forEach(function (card) {
      var slug = card.getAttribute('data-week-slug');
      var badge = card.querySelector('[data-done-badge]');
      if (!badge) return;
      if (isWeekComplete(slug)) badge.hidden = false;
      else badge.hidden = true;
    });
  }

  function setupCopyButtons() {
    document.querySelectorAll('.code-block').forEach(function (block) {
      if (block.querySelector('.copy-btn')) return;
      var pre = block.querySelector('pre');
      if (!pre) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', function () {
        var text = pre.innerText;
        var done = function () {
          btn.textContent = 'Copied';
          setTimeout(function () { btn.textContent = 'Copy'; }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(function () {
            fallbackCopy(text);
            done();
          });
        } else {
          fallbackCopy(text);
          done();
        }
      });
      block.appendChild(btn);
    });
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(ta);
  }

  function setupTaskLists() {
    var slug = document.body.getAttribute('data-week-slug');
    if (!slug) return;
    var boxes = document.querySelectorAll('.prose input[type="checkbox"]');
    boxes.forEach(function (box, index) {
      var id = String(index);
      var saved = safeStorage(function () {
        return localStorage.getItem(taskKey(slug, id));
      });
      if (saved === '1') box.checked = true;
      box.addEventListener('change', function () {
        safeStorage(function () {
          if (box.checked) localStorage.setItem(taskKey(slug, id), '1');
          else localStorage.removeItem(taskKey(slug, id));
        });
        var all = Array.prototype.slice.call(boxes);
        var allDone = all.length > 0 && all.every(function (b) { return b.checked; });
        if (allDone) markWeekComplete(slug, true);
      });
    });

    var toggle = document.querySelector('[data-mark-complete]');
    if (toggle) {
      toggle.checked = isWeekComplete(slug);
      toggle.addEventListener('change', function () {
        markWeekComplete(slug, toggle.checked);
      });
    }
  }

  function setupToc() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.toc nav a[href^="#"]'));
    if (!links.length) return;
    var map = links.map(function (a) {
      var id = decodeURIComponent(a.getAttribute('href').slice(1));
      return { a: a, el: document.getElementById(id) };
    }).filter(function (x) { return x.el; });

    function onScroll() {
      var active = map[0];
      var y = window.scrollY + 100;
      for (var i = 0; i < map.length; i++) {
        if (map[i].el.offsetTop <= y) active = map[i];
      }
      links.forEach(function (a) { a.classList.remove('active'); });
      if (active) active.a.classList.add('active');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function externalizeLinks() {
    document.querySelectorAll('.prose a[href^="http"]').forEach(function (a) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupCopyButtons();
    setupTaskLists();
    setupToc();
    externalizeLinks();
    updateProgress();
  });
})();
