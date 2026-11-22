/* ==========================================================================
   Manjil Aryal — Portfolio interactions
   Vanilla JS. No dependencies.
   ========================================================================== */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------- sticky header */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --------------------------------------------------------- mobile menu */
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');

  if (menu) {
    Array.prototype.forEach.call(menu.querySelectorAll('a'), (a, i) => {
      a.style.setProperty('--i', i);
    });
  }

  const setMenu = (open) => {
    if (!menu || !toggle) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('is-locked', open);
  };

  if (toggle) {
    toggle.addEventListener('click', () => {
      setMenu(!menu.classList.contains('is-open'));
    });
  }
  if (menu) {
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ------------------------------------------------- reveal on scroll in */
  const revealables = document.querySelectorAll('.reveal');
  const showAll = () =>
    Array.prototype.forEach.call(revealables, (el) => el.classList.add('is-in'));

  // anything already in the first screen shows straight away
  Array.prototype.forEach.call(revealables, (el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      el.classList.add('is-in');
    }
  });

  // safety net: never leave content hidden
  setTimeout(showAll, 3000);

  if (reduceMotion || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    Array.prototype.forEach.call(revealables, (el) => io.observe(el));
  }

  /* --------------------------------------------- active nav link on scroll */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          Array.prototype.forEach.call(navLinks, (link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    Array.prototype.forEach.call(sections, (s) => spy.observe(s));
  }

  /* ----------------------------------- smooth scroll with header offset */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 10;
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
  });

  /* ------------------------------------------------- hero starfield canvas
     A quiet nod to the Delta Cephei research: slow-drifting stars with one
     marked variable star pulsing on a ~5.37 "day" loop.
  ------------------------------------------------------------------------ */
  const canvas = document.getElementById('starfield');

  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = null;
    let running = true;

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.min(150, Math.max(50, Math.round((w * h) / 11000)));
      stars = [];
      for (let i = 0; i < density; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.1 + 0.25,
          a: Math.random() * 0.5 + 0.12,
          tw: Math.random() * 0.012 + 0.002,
          ph: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.03,
          vy: (Math.random() - 0.5) * 0.03
        });
      }
    };

    // the marked variable star, positioned proportionally
    const cepheid = { fx: 0.82, fy: 0.26 };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -2) s.x = w + 2;
        if (s.x > w + 2) s.x = -2;
        if (s.y < -2) s.y = h + 2;
        if (s.y > h + 2) s.y = -2;

        const alpha = s.a + Math.sin(t * s.tw + s.ph) * 0.14;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(233,233,236,' + Math.max(0.04, alpha).toFixed(3) + ')';
        ctx.fill();
      }

      // Delta Cephei: ~5.3664 day period, mapped to a slow visual cycle
      const cx = cepheid.fx * w;
      const cy = cepheid.fy * h;
      const period = 5366.4; // ms per cycle
      const phase = (t % period) / period;
      // asymmetric light curve: fast rise, slow decline
      const curve = phase < 0.25
        ? phase / 0.25
        : 1 - (phase - 0.25) / 0.75;
      const mag = 0.35 + curve * 0.65;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26 * mag + 6);
      grad.addColorStop(0, 'rgba(216,166,87,' + (0.5 * mag).toFixed(3) + ')');
      grad.addColorStop(1, 'rgba(216,166,87,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, 26 * mag + 6, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 1.5 + mag * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(231,196,141,' + (0.55 + mag * 0.4).toFixed(3) + ')';
      ctx.fill();

      if (running) raf = requestAnimationFrame(draw);
    };

    let resizeTimer = null;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 180);
    };

    build();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', onResize);

    // pause the loop when the hero is off-screen or the tab is hidden
    const pause = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    };
    const resume = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };

    document.addEventListener('visibilitychange', () => {
      document.hidden ? pause() : resume();
    });

    if ('IntersectionObserver' in window) {
      const heroObs = new IntersectionObserver((entries) => {
        entries.forEach((en) => (en.isIntersecting ? resume() : pause()));
      }, { threshold: 0 });
      heroObs.observe(canvas);
    }
  }

  /* ------------------------------------------- warn about unreplaced links
     Logs a tidy list of placeholder links to the console so they're easy to
     find and swap. Remove this block once your real URLs are in.
  ------------------------------------------------------------------------ */
  const placeholders = document.querySelectorAll('[data-replace]');
  if (placeholders.length) {
    const pending = [];
    Array.prototype.forEach.call(placeholders, (el) => {
      const href = el.getAttribute('href') || '';
      if (href === '#' || href.indexOf('example.com') > -1) {
        pending.push(el.getAttribute('data-replace'));
      }
    });
    if (pending.length && window.console && console.info) {
      console.info(
        '[portfolio] Placeholder links still to replace: ' +
          Array.from(new Set(pending)).join(', ') +
          '  — search index.html for data-replace'
      );
    }
  }
})();
