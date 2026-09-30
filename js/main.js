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

  function boot() {
    root.Player.load();
    starfield();
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
