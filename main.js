/* ═══════════════════════════════════════════════════════════════════
   Manjil Aryal — portfolio behaviour
   No dependencies. Everything degrades to a readable page without JS.
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var root      = document.documentElement;
  var reduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supportsIO = 'IntersectionObserver' in window;

  /* ── 1. Scroll reveals ──────────────────────────────────────────
     Elements are marked and observed in one block. If anything here
     throws, the marks come straight back off, so a broken script can
     never leave the page invisible. */
  var revealables = document.querySelectorAll('.band--rule .band__title, .sheet');

  function unhideAll() {
    for (var k = 0; k < revealables.length; k++) {
      revealables[k].removeAttribute('data-reveal');
    }
  }

  if (reduced || !supportsIO) {
    unhideAll();
  } else {
    try {
      for (var i = 0; i < revealables.length; i++) {
        revealables[i].setAttribute('data-reveal', '');
      }

      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

      for (var j = 0; j < revealables.length; j++) {
        revealObserver.observe(revealables[j]);
      }
    } catch (err) {
      unhideAll();
    }
  }

  /* ── 2. Hero: the one orchestrated moment ───────────────────────
     The name rises into place while the variable font opens from
     condensed to full width. Everything after this stays quiet. */
  var hero  = document.getElementById('hero');
  var words = document.querySelectorAll('[data-word]');

  function playHero() {
    for (var i = 0; i < words.length; i++) words[i].classList.add('is-in');
    if (hero) hero.classList.add('is-ready');
  }

  if (document.fonts && document.fonts.ready) {
    // Wait for Archivo so the width axis animates rather than snapping.
    document.fonts.ready.then(function () {
      requestAnimationFrame(playHero);
    });
    setTimeout(playHero, 1200); // fallback if fonts never resolve
  } else {
    requestAnimationFrame(playHero);
  }

  /* ── 3. Top bar: bare over the hero, surfaced after it ──────────── */
  var topbar = document.getElementById('topbar');

  if (topbar && hero && supportsIO) {
    new IntersectionObserver(function (entries) {
      topbar.classList.toggle('is-visible', !entries[0].isIntersecting);
    }, { rootMargin: '-72px 0px 0px 0px' }).observe(hero);
  } else if (topbar) {
    topbar.classList.add('is-visible');
  }

  /* ── 4. Which section am I in ───────────────────────────────────── */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.topbar__nav a')
  );
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && supportsIO) {
    var seen = new Map();

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        seen.set(entry.target.id, entry.intersectionRatio);
      });

      var bestId = null, bestRatio = 0;
      seen.forEach(function (ratio, id) {
        if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
      });

      navLinks.forEach(function (link) {
        link.classList.toggle(
          'is-current',
          bestRatio > 0 && link.getAttribute('href') === '#' + bestId
        );
      });
    }, { threshold: [0, 0.15, 0.4, 0.75, 1] });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ── 5. Theme toggle ────────────────────────────────────────────── */
  var toggle = document.getElementById('theme');

  function paintToggle() {
    if (!toggle) return;
    var dark = root.getAttribute('data-theme') === 'dark';
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.querySelector('.theme__label').textContent = dark ? 'Light' : 'Dark';
    toggle.setAttribute('aria-label', dark ? 'Switch to the light theme' : 'Switch to the dark theme');
  }

  if (toggle) {
    paintToggle();
    toggle.addEventListener('click', function () {
      var dark = root.getAttribute('data-theme') === 'dark';
      if (dark) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', 'dark');
      try {
        localStorage.setItem('theme', dark ? 'light' : 'dark');
      } catch (e) { /* storage unavailable — the choice just won't persist */ }
      paintToggle();
    });
  }

  /* ── 6. Year in the footer, if one is ever added ────────────────── */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
