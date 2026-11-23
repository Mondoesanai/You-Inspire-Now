/* You Inspire Now + Go Inspire Now — shared behavior (same file on both sites).
   Site-specific values (email, keys, URLs) live in assets/config.js → window.SITE */
(function () {
  'use strict';
  var SITE = window.SITE || {};
  var KEY = SITE.key || 'site';
  var root = document.documentElement;
  root.classList.remove('no-js');
  var finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function sstore(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  /* ── NAV ── */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 60); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    var burger = document.getElementById('nav-burger');
    var links = document.getElementById('nav-links');
    if (burger && links) {
      var setOpen = function (open) { links.classList.toggle('open', open); burger.setAttribute('aria-expanded', open ? 'true' : 'false'); };
      burger.addEventListener('click', function () { setOpen(!links.classList.contains('open')); });
      links.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    }
  }

  /* ── REVEAL ── */
  var revealEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add('in'); }); }

  /* ── MARQUEE: repeat the phrase set until it is wider than the screen, so the loop never shows a gap ── */
  function buildMarquee(wrap) {
    var track = wrap.querySelector('.marquee-track');
    if (!track) return;
    if (!wrap._set) { var s = track.querySelector('.mq-set'); if (!s) return; wrap._set = s.cloneNode(true); }
    track.innerHTML = '';
    var group = document.createElement('div'); group.className = 'mq-set';
    group.appendChild(wrap._set.cloneNode(true));
    track.appendChild(group);
    var setW = group.scrollWidth || 1, need = window.innerWidth + 200, guard = 0;
    while (group.scrollWidth < need && guard++ < 30) group.appendChild(wrap._set.cloneNode(true));
    var copy = group.cloneNode(true); copy.setAttribute('aria-hidden', 'true');
    track.appendChild(copy);
    var speed = parseFloat(wrap.getAttribute('data-speed')) || 70; // px per second
    track.style.setProperty('--mq-dur', (group.scrollWidth / speed).toFixed(2) + 's');
  }
  var marquees = document.querySelectorAll('[data-marquee]');
  function buildAll() { marquees.forEach(buildMarquee); }
  if (marquees.length) {
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildAll); else buildAll();
    buildAll();
    var lastW = window.innerWidth, rt;
    window.addEventListener('resize', function () { if (window.innerWidth === lastW) return; lastW = window.innerWidth; clearTimeout(rt); rt = setTimeout(buildAll, 200); });
  }

  /* ── MUSIC (persists across pages; one source of truth = the audio element) ── */
  var aud = document.getElementById('bg-music');
  var mBtn = document.getElementById('music-btn');
  var music = { play: function () {}, pause: function () {} };
  if (aud && mBtn) {
    var tKey = KEY + '-time', pKey = KEY + '-playing';
    aud.volume = 0.38;
    var sync = function () {
      var on = !aud.paused;
      mBtn.classList.toggle('playing', on);
      mBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      mBtn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
      if (on) mBtn.classList.remove('resume-needed');
    };
    aud.addEventListener('play', sync); aud.addEventListener('pause', sync); aud.addEventListener('ended', sync);
    var seekSaved = function () { var t = parseFloat(store(tKey) || '0'); if (t > 0 && isFinite(t)) { try { aud.currentTime = t; } catch (e) {} } };
    music.play = function () {
      var go = function () { seekSaved(); var p = aud.play(); if (p && p.catch) p.catch(function () { mBtn.classList.add('resume-needed'); }); };
      if (aud.readyState < 1) { aud.addEventListener('loadedmetadata', go, { once: true }); aud.load(); } else go();
      store(pKey, '1');
    };
    music.pause = function () { aud.pause(); store(pKey, '0'); store(tKey, String(aud.currentTime || 0)); };
    mBtn.addEventListener('click', function () { if (aud.paused) music.play(); else music.pause(); });
    setInterval(function () { if (!aud.paused) store(tKey, String(aud.currentTime)); }, 1000);
    window.addEventListener('pagehide', function () { if (!aud.paused) store(tKey, String(aud.currentTime)); });
    // Was music on when the visitor left the last page? Resume it (browsers may need one tap first).
    if (store(pKey) === '1') {
      music.play();
      var resumeOnce = function (e) {
        if (e && e.target && e.target.closest && e.target.closest('#music-btn')) return;
        if (aud.paused && store(pKey) === '1') music.play();
        document.removeEventListener('pointerdown', resumeOnce, true); document.removeEventListener('keydown', resumeOnce, true);
      };
      document.addEventListener('pointerdown', resumeOnce, true); document.addEventListener('keydown', resumeOnce, true);
    }
    sync();
  }

  /* ── INTRO (home) ── */
  var intro = document.getElementById('intro');
  if (intro) {
    var seenKey = KEY + '-intro-seen';
    var close = function (withMusic) {
      sstore(seenKey, '1');
      if (withMusic) music.play();
      intro.querySelectorAll('.ip-blob').forEach(function (b) { b.classList.add('fire'); });
      setTimeout(function () { intro.classList.add('out'); }, withMusic && !reduceMotion ? 1900 : 50);
      setTimeout(function () { intro.style.display = 'none'; }, withMusic && !reduceMotion ? 2500 : 600);
    };
    if (sstore(seenKey)) intro.style.display = 'none';
    else {
      var go = document.getElementById('take-step-btn'); if (go) go.addEventListener('click', function () { close(true); });
      var skip = document.getElementById('intro-skip'); if (skip) skip.addEventListener('click', function () { close(false); });
      setTimeout(function () { if (!sstore(seenKey) && intro.style.display !== 'none') close(false); }, 20000);
    }
  }

  /* ── COUNTDOWNS: <div data-countdown="2027-04-01T00:00:00-05:00"> with [data-u=d|h|m|s] ── */
  var cds = document.querySelectorAll('[data-countdown]');
  if (cds.length) {
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var tick = function () {
      var now = Date.now();
      cds.forEach(function (el) {
        var end = Date.parse(el.getAttribute('data-countdown'));
        if (isNaN(end)) return;
        var diff = Math.max(0, end - now);
        if (diff === 0 && el.getAttribute('data-done') && !el._done) { el._done = true; el.innerHTML = '<span class="cd-done">' + el.getAttribute('data-done') + '</span>'; return; }
        var d = Math.floor(diff / 864e5), h = Math.floor(diff % 864e5 / 36e5), m = Math.floor(diff % 36e5 / 6e4), s = Math.floor(diff % 6e4 / 1e3);
        var set = function (u, v) { var x = el.querySelector('[data-u="' + u + '"]'); if (x) x.textContent = v; };
        set('d', d > 99 ? d : pad(d)); set('h', pad(h)); set('m', pad(m)); set('s', pad(s));
      });
    };
    tick(); setInterval(tick, 1000);
  }

  /* ── EMAIL BUTTONS: the address is never printed on the page ── */
  document.querySelectorAll('[data-mailto]').forEach(function (a) {
    if (!SITE.email) return;
    a.href = 'mailto:' + SITE.email + '?subject=' + encodeURIComponent(a.getAttribute('data-subject') || ('Hello from ' + (SITE.name || location.hostname)));
  });

  /* ── CASH APP LINKS: <a data-cash="5"> → cash.app/$cashtag/5 (amount pre-filled) ── */
  document.querySelectorAll('[data-cash]').forEach(function (a) {
    if (!SITE.cashtag) return;
    var amt = a.getAttribute('data-cash');
    a.href = 'https://cash.app/$' + SITE.cashtag + (amt ? '/' + amt : '');
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* ── VOICES OF RESILIENCE: the "Watch" link only shows once SITE.voicesUrl is set ── */
  document.querySelectorAll('[data-voices-link]').forEach(function (a) {
    if (SITE.voicesUrl) { a.href = SITE.voicesUrl; a.hidden = false; }
  });

  /* ── PREFILL selects/inputs from the URL (?walk=…&event=…&amount=…) ── */
  var params = new URLSearchParams(location.search);
  document.querySelectorAll('[data-param]').forEach(function (el) {
    var v = params.get(el.getAttribute('data-param'));
    if (v == null) return;
    if (el.tagName === 'SELECT') { for (var i = 0; i < el.options.length; i++) if (el.options[i].value === v) { el.selectedIndex = i; break; } }
    else el.value = v;
  });

  /* ── FORMS → email to SITE.email via FormSubmit; if that fails, offer a pre-filled email instead ── */
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var wrap = form.closest('[data-form-wrap]') || form.parentElement;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var name = form.getAttribute('data-form');
      var fd = new FormData(form), fields = {};
      fd.forEach(function (v, k) { if (k === '_honey') return; v = String(v).trim(); if (!v) return; fields[k] = fields[k] ? fields[k] + ', ' + v : v; });
      var honey = form.querySelector('[name="_honey"]');
      if (honey && honey.value) { wrap.classList.add('is-sent'); return; }
      var btn = form.querySelector('[type="submit"]'), label = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      var payload = Object.assign({ _subject: name + ' — ' + (SITE.name || 'website'), _template: 'table', _captcha: 'false', Form: name }, fields, { 'Sent from': location.href });
      var fallback = function () {
        var body = Object.keys(fields).map(function (k) { return k + ': ' + fields[k]; }).join('\n');
        var link = wrap.querySelector('.f-fallback a');
        if (link) link.href = 'mailto:' + SITE.email + '?subject=' + encodeURIComponent(name + ' — ' + (SITE.name || '')) + '&body=' + encodeURIComponent(body);
        wrap.classList.add('is-fallback');
        if (btn) { btn.disabled = false; btn.innerHTML = label; }
      };
      if (!SITE.email) { fallback(); return; }
      fetch('https://formsubmit.co/ajax/' + SITE.email, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (String(j.success) === 'true') { wrap.classList.remove('is-fallback'); wrap.classList.add('is-sent'); var d = wrap.querySelector('.f-done'); if (d) { d.setAttribute('tabindex', '-1'); d.focus({ preventScroll: true }); } }
          else fallback();
        })
        .catch(fallback);
    });
  });

  /* ── LIGHTBOX: tap anything with [data-zoom] (the family photo) to see it full screen; ×, Esc or a tap closes it ── */
  var zooms = document.querySelectorAll('[data-zoom]');
  if (zooms.length) {
    var lb = null, lbImg, lbCap, lbClose, lbFrom = null;
    var closeLb = function () {
      if (!lb) return;
      lb.classList.remove('open'); document.documentElement.classList.remove('lb-lock');
      setTimeout(function () { lb.hidden = true; }, 320);
      if (lbFrom) lbFrom.focus({ preventScroll: true });
    };
    var buildLb = function () { /* built on first tap, so there's no empty <img> on the page until it's needed */
      lb = document.createElement('div');
      lb.className = 'lightbox'; lb.hidden = true;
      lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Photo');
      lb.innerHTML = '<button class="lb-close" type="button" aria-label="Close photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><figure class="lb-fig"><img alt=""><figcaption></figcaption></figure>';
      document.body.appendChild(lb);
      lbImg = lb.querySelector('img'); lbCap = lb.querySelector('figcaption'); lbClose = lb.querySelector('.lb-close');
      lb.addEventListener('click', function (e) { if (!e.target.closest('figcaption')) closeLb(); });
    };
    var openLb = function (el) {
      if (!lb) buildLb();
      var img = el.tagName === 'IMG' ? el : el.querySelector('img');
      lbImg.src = el.getAttribute('data-zoom') || img.currentSrc || img.src; lbImg.alt = img.alt || '';
      var cap = el.querySelector('figcaption'); lbCap.innerHTML = cap ? cap.innerHTML : ''; lbCap.hidden = !cap;
      lbFrom = el; lb.hidden = false; document.documentElement.classList.add('lb-lock');
      requestAnimationFrame(function () { lb.classList.add('open'); });
      lbClose.focus({ preventScroll: true });
    };
    zooms.forEach(function (el) {
      el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button');
      if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', 'View this photo full screen');
      el.addEventListener('click', function () { openLb(el); });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(el); } });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb && !lb.hidden) closeLb(); });
  }

  /* ── 3D TILT + MAGNETIC (mouse only) ── */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transition = 'transform .08s linear';
        c.style.transform = 'perspective(900px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 7) + 'deg) translateY(-6px)';
      });
      c.addEventListener('mouseleave', function () { c.style.transition = 'transform .6s cubic-bezier(.34,1.56,.64,1)'; c.style.transform = ''; });
    });
    document.querySelectorAll('[data-magnetic]').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transition = 'transform .12s linear';
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.22) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.22) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)'; b.style.transform = ''; });
    });
  }

  /* ── PORTAL: follows the pointer in 3D; drifts on its own on touch screens ── */
  document.querySelectorAll('.portal').forEach(function (p) {
    var stage = p.querySelector('.portal-stage'); if (!stage || reduceMotion) return;
    if (finePointer) {
      var sec = p.closest('section') || p;
      sec.addEventListener('mousemove', function (e) {
        var r = p.getBoundingClientRect(), x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth, y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        stage.style.setProperty('--ry', (x * 34).toFixed(2) + 'deg'); stage.style.setProperty('--rx', (-y * 30).toFixed(2) + 'deg');
      });
      sec.addEventListener('mouseleave', function () { stage.style.setProperty('--ry', '0deg'); stage.style.setProperty('--rx', '0deg'); });
    } else {
      var t0 = performance.now();
      (function loop(t) {
        var k = (t - t0) / 1000;
        stage.style.setProperty('--ry', (Math.sin(k * 0.7) * 12).toFixed(2) + 'deg');
        stage.style.setProperty('--rx', (Math.cos(k * 0.5) * 9).toFixed(2) + 'deg');
        requestAnimationFrame(loop);
      })(t0);
    }
    // particles pulled into the portal
    var colors = (p.getAttribute('data-drops') || '#fff').split(',');
    for (var i = 0; i < 14; i++) {
      var d = document.createElement('span'); d.className = 'portal-drop';
      var ang = Math.random() * Math.PI * 2, dist = 190 + Math.random() * 120;
      d.style.cssText = '--x:' + (Math.cos(ang) * dist).toFixed(0) + 'px;--y:' + (Math.sin(ang) * dist).toFixed(0) + 'px;--s:' + (3 + Math.random() * 6).toFixed(1) + 'px;--d:' + (3.2 + Math.random() * 3).toFixed(2) + 's;--del:-' + (Math.random() * 5).toFixed(2) + 's;--c:' + colors[i % colors.length];
      stage.appendChild(d);
    }
  });

  /* ── HERO PARTICLES ── */
  var hero = document.getElementById('hero');
  if (hero && !reduceMotion) {
    var pc = ['var(--a1)', 'var(--a2)', 'var(--a3)'];
    for (var j = 0; j < 16; j++) {
      var q = document.createElement('div'); q.className = 'ptcl';
      var sz = Math.random() * 4 + 1.5, op = (Math.random() * 0.25 + 0.08).toFixed(2), rnd = function () { return (Math.random() * 70 - 35).toFixed(0); };
      q.style.cssText = 'left:' + (Math.random() * 90 + 5).toFixed(1) + '%;top:' + (Math.random() * 80 + 5).toFixed(1) + '%;width:' + sz.toFixed(1) + 'px;height:' + sz.toFixed(1) + 'px;background:' + pc[j % 3] + ';--op:' + op + ';--d:' + (Math.random() * 10 + 6).toFixed(1) + 's;--del:-' + (Math.random() * 9).toFixed(1) + 's;--x1:' + rnd() + 'px;--y1:-' + (Math.random() * 45 + 10).toFixed(0) + 'px;--x2:' + rnd() + 'px;--y2:-' + (Math.random() * 70 + 15).toFixed(0) + 'px;--x3:' + rnd() + 'px;--y3:-' + (Math.random() * 30 + 5).toFixed(0) + 'px;';
      hero.appendChild(q);
    }
  }

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
