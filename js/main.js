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
      const dpr = Math.min(2, window.devicePixelRatio || 1);
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
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.p += s.s;
        if (!still) {
          s.x -= s.drift;
          if (s.x < 0) s.x = w;
        }
        ctx.globalAlpha = 0.35 + Math.sin(s.p) * 0.3 + 0.3;
        ctx.fillStyle = '#dfe8ff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!still) requestAnimationFrame(draw);
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

  function boot() {
    root.Player.load();
    document.querySelectorAll('[data-icon]').forEach((i) => { i.innerHTML = root.Art.ICONS[i.dataset.icon]; });
    starfield();
    premiumFx();
    document.querySelector('.topbar').addEventListener('click', (e) => {
      const nav = e.target.closest('[data-nav]');
      if (!nav) return;
      if (App.battleActive) {
        root.UI.toast('Finish or retreat from the battle first.');
        return;
      }
      App.go(nav.dataset.nav);
    });
    App.go('home');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
