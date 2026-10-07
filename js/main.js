// Boot: load the save, draw the ambient starfield and show the home screen.

(function (root) {
  const { $, App } = root.UI;

  function starfield() {
    const host = $('.starfield');
    const canvas = document.createElement('canvas');
    host.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let stars = [];
    let w = 0;
    let h = 0;

    function resize() {
      const dpr = Math.min(root.Perf ? Math.max(1, root.Perf.dpr) : 2, window.devicePixelRatio || 1);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      stars = Array.from({ length: Math.round((window.innerWidth * window.innerHeight) / 5000) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.2 + 0.3) * dpr,
        p: Math.random() * Math.PI * 2,
        s: Math.random() * 0.02 + 0.005,
        drift: Math.random() * 0.08 * dpr,
      }));
    }

    const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // The stars twinkle slowly, so a modest frame rate looks the same and
    // leaves the GPU free; during battles (where only the edges show) slower.
    let lastDraw = 0;
    function draw(now) {
      if (!still) requestAnimationFrame(draw);
      const gap = document.body.classList.contains('in-battle') ? 80 : 33;
      if (now && now - lastDraw < gap) return;
      const steps = lastDraw && now ? Math.min(4, (now - lastDraw) / 16.7) : 1;
      lastDraw = now || 0;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.p += s.s * steps;
        if (!still) {
          s.x -= s.drift * steps;
          if (s.x < 0) s.x = w;
        }
        ctx.globalAlpha = 0.35 + Math.sin(s.p) * 0.3 + 0.3;
        ctx.fillStyle = '#dfe8ff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    resize();
    window.addEventListener('resize', () => {
      resize();
      if (still) draw();
    });
    draw();
  }

  // Premium micro-interactions: every button and tappable card gets a hover
  // glint, a press squash, a click ripple, and primary actions throw sparks.
  const FX_SEL = 'button, .mode-card, .stage, .boss-card, .ucard, .scard, .map-planet, .currency, .account';
  const SPARK_SEL = '.btn-primary, .mode-card, .abtn.ult, .boss-card, .crate-buy, .map-planet';

  function fxLayer(host) {
    let clip = host.querySelector(':scope > .fx-clip');
    if (!clip) {
      if (getComputedStyle(host).position === 'static') host.classList.add('fx-host');
      clip = document.createElement('span');
      clip.className = 'fx-clip';
      clip.setAttribute('aria-hidden', 'true');
      host.appendChild(clip);
    }
    return clip;
  }

  function fxColor(host) {
    if (host.matches('.btn-danger, .boss-card')) return '255, 90, 90';
    if (host.matches('.btn-primary')) return '255, 255, 255';
    return '255, 210, 63';
  }

  function premiumFx() {
    const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) return;
    document.addEventListener('pointerover', (e) => {
      const host = e.target.closest(FX_SEL);
      if (!host || host.disabled || (e.relatedTarget && host.contains(e.relatedTarget))) return;
      const clip = fxLayer(host);
      const g = document.createElement('i');
      g.className = 'fx-glint';
      g.style.setProperty('--fx', fxColor(host));
      clip.appendChild(g);
      g.addEventListener('animationend', () => g.remove());
    });
    document.addEventListener('pointerdown', (e) => {
      const host = e.target.closest(FX_SEL);
      if (!host || host.disabled) return;
      const clip = fxLayer(host);
      const r = host.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2.2;
      const rp = document.createElement('i');
      rp.className = 'fx-ripple';
      rp.style.cssText = `left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;width:${size}px;height:${size}px;--fx:${fxColor(host)}`;
      clip.appendChild(rp);
      rp.addEventListener('animationend', () => rp.remove());
      if (root.Sound && host.matches('button, .map-planet, .mode-card')) root.Sound.play('click');
      host.animate([{ scale: 1 }, { scale: host.matches('button') ? 0.94 : 0.97, offset: 0.35 }, { scale: 1.02, offset: 0.7 }, { scale: 1 }], { duration: 320, easing: 'ease-out' });
      if (host.matches(SPARK_SEL)) {
        for (let i = 0; i < 10; i++) {
          const s = document.createElement('i');
          s.className = 'fx-spark';
          const a = Math.random() * Math.PI * 2;
          const d = 24 + Math.random() * 40;
          s.style.left = e.clientX + 'px';
          s.style.top = e.clientY + 'px';
          document.body.appendChild(s);
          s.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(0)`, opacity: 0 }], { duration: 420 + Math.random() * 240, easing: 'cubic-bezier(.1,.8,.3,1)' }).onfinish = () => s.remove();
        }
      }
    });
  }

  // ---------- Swipe between tabs (phones) ----------
  // Drag the page sideways to slide to the next tab, like Clash Royale.
  const TABS = ['home', 'collection', 'market'];
  function swipeTabs() {
    const screen = document.getElementById('screen');
    const NO_SWIPE = 'input, select, textarea, .modal-backdrop, .rank-road, .planet-drop, .pd-stages, .showcase, .reel, [data-noswipe]';
    let sx = 0, sy = 0, dx = 0, t0 = 0, mode = null, busy = false;
    const idx = () => TABS.indexOf(App.current === 'campaign' ? 'home' : App.current);
    screen.addEventListener('touchstart', (e) => {
      mode = null;
      if (busy || e.touches.length !== 1 || App.battleActive || idx() < 0 || e.target.closest(NO_SWIPE) || document.querySelector('.modal-backdrop, .walkout, .crate-cine, .secret-load, .planet-cine')) return;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; dx = 0; t0 = performance.now(); mode = 'wait';
    }, { passive: true });
    screen.addEventListener('touchmove', (e) => {
      if (!mode || mode === 'scroll') return;
      const x = e.touches[0].clientX - sx;
      const y = e.touches[0].clientY - sy;
      if (mode === 'wait') {
        if (Math.abs(x) < 10 && Math.abs(y) < 10) return;
        mode = Math.abs(x) > Math.abs(y) * 1.3 ? 'swipe' : 'scroll';
        if (mode === 'scroll') return;
        screen.classList.add('swiping');
        screen.style.transition = 'none';
      }
      const i = idx();
      // Rubber-band at the first and last tab.
      dx = (i === 0 && x > 0) || (i === TABS.length - 1 && x < 0) ? x * 0.25 : x;
      screen.style.transform = `translateX(${dx}px)`;
      screen.style.opacity = String(1 - Math.min(0.5, Math.abs(dx) / innerWidth));
    }, { passive: true });
    const end = () => {
      if (mode !== 'swipe') { mode = null; return; }
      mode = null;
      screen.classList.remove('swiping');
      const i = idx();
      const fast = Math.abs(dx) / Math.max(1, performance.now() - t0) > 0.5;
      const dir = dx < 0 ? 1 : -1;
      const target = TABS[i + dir];
      if (target && (Math.abs(dx) > innerWidth * 0.25 || (fast && Math.abs(dx) > 40))) {
        // Ignore new drags until this slide has fully landed.
        busy = true;
        setTimeout(() => { busy = false; }, 1200);
        screen.style.transition = 'transform .16s ease-in, opacity .16s';
        screen.style.transform = `translateX(${-dir * innerWidth * 0.6}px)`;
        screen.style.opacity = '0';
        setTimeout(() => {
          screen.style.transition = 'none';
          App.go(target);
          screen.style.transform = `translateX(${dir * innerWidth * 0.6}px)`;
          requestAnimationFrame(() => requestAnimationFrame(() => {
            screen.style.transition = 'transform .24s cubic-bezier(.2,.9,.3,1), opacity .24s';
            screen.style.transform = '';
            screen.style.opacity = '';
            setTimeout(() => { screen.style.transition = ''; busy = false; }, 280);
          }));
        }, 160);
      } else {
        screen.style.transition = 'transform .25s cubic-bezier(.2,.9,.3,1.2), opacity .25s';
        screen.style.transform = '';
        screen.style.opacity = '';
        setTimeout(() => { if (!mode) screen.style.transition = ''; }, 260);
      }

    };
    screen.addEventListener('touchend', end);
    screen.addEventListener('touchcancel', end);
  }

  function boot() {
    root.Player.load();
    document.querySelectorAll('[data-icon]').forEach((i) => { i.innerHTML = root.Art.ICONS[i.dataset.icon]; });
    document.querySelector('[data-settings]').innerHTML = root.Icons.svg('settings');
    document.querySelectorAll('[data-nav-ico]').forEach((n) => { n.innerHTML = root.Icons.svg(n.dataset.navIco); });
    swipeTabs();
    root.Icons.watch();
    const bar = document.querySelector('.topbar');
    const setBar = () => document.documentElement.style.setProperty('--topbar-h', bar.offsetHeight + 'px');
    setBar();
    if (window.ResizeObserver) new ResizeObserver(setBar).observe(bar);
    starfield();
    premiumFx();
    document.querySelector('.topbar').addEventListener('click', (e) => {
      if (e.target.closest('[data-settings]')) return root.UI.settings();
      if (e.target.closest('[data-profile]')) return root.UI.profile();
      const nav = e.target.closest('[data-nav]');
      if (!nav) return;
      if (App.battleActive) {
        root.UI.toast('Finish or retreat from the battle first.');
        return;
      }
      App.go(nav.dataset.nav);
    });
    App.go('home');
    // First open (or a save from before the tutorial existed): run it once.
    if (root.Player.tutorialPending() && root.Tutorial) root.Tutorial.start();
    // After an update, show what's new once.
    if (root.Changelog) root.Changelog.check();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
