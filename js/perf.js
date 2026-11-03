// Graphics settings. Each device type gets a tuned profile (canvas resolution,
// particle counts, glows), and Performance mode strips effects back further
// for older devices or laggy battles. Chosen in Settings > Performance.
(function (root) {
  'use strict';

  const KEY = 'swcg-perf';
  const ua = navigator.userAgent;

  // Safari's engine (every iOS browser, plus Safari on Mac) draws canvas
  // glows very slowly, so they stay off there whatever the profile says.
  const webkitOnly = /iP(hone|ad|od)/.test(ua) || (/Safari\//.test(ua) && !/Chrom(e|ium)|Android/.test(ua));

  function detect() {
    if (/iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ipad';
    if (/iPhone|iPod/.test(ua)) return 'iphone';
    if (/Android/.test(ua)) return 'android';
    return 'pc';
  }

  // dpr: canvas resolution cap. particles: share of weather and effect
  // particles. fps: frame cap for animated backgrounds.
  const DEVICES = {
    iphone: { label: 'iPhone', dpr: 1, particles: 0.5, fps: 60, glow: false, shake: true },
    ipad: { label: 'iPad', dpr: 1.25, particles: 0.7, fps: 60, glow: false, shake: true },
    android: { label: 'Android', dpr: 1.35, particles: 0.8, fps: 60, glow: true, shake: true },
    pc: { label: 'PC', dpr: /CrOS/.test(ua) ? 1 : 1.5, particles: /CrOS/.test(ua) ? 0.7 : 1, fps: 60, glow: true, shake: true },
  };
  const LITE = { dpr: 0.85, particles: 0.25, fps: 30, glow: false, shake: false, simpleUlts: true };

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && typeof s === 'object') return s;
    } catch (e) { /* storage unavailable */ }
    // Low-power devices start in Performance mode (players can turn it off):
    // Chromebooks, and machines with 4 GB of memory or less, or two cores.
    return { device: 'auto', mode: (navigator.deviceMemory || 8) <= 4 || (navigator.hardwareConcurrency || 8) <= 2 || /CrOS/.test(ua) };
  }

  const Perf = {
    detected: detect(),
    DEVICES,
    prefs: load(),

    device() {
      return DEVICES[this.prefs.device] ? this.prefs.device : this.detected;
    },

    // Recompute the live settings everything else reads.
    apply() {
      const base = DEVICES[this.device()];
      const p = this.prefs.mode ? { ...base, ...LITE } : { ...base, simpleUlts: false };
      if (webkitOnly) p.glow = false;
      Object.assign(this, { dpr: p.dpr, particles: p.particles, fps: p.fps, glow: p.glow, shake: p.shake, simpleUlts: p.simpleUlts, on: !!this.prefs.mode });
      const b = document.body;
      if (b) {
        b.classList.toggle('perf-on', this.on);
        Object.keys(DEVICES).forEach((k) => b.classList.toggle(`dev-${k}`, k === this.device()));
      }
    },

    set(key, value) {
      this.prefs[key] = value;
      try { localStorage.setItem(KEY, JSON.stringify(this.prefs)); } catch (e) { /* storage unavailable */ }
      this.apply();
      // Canvases pick up the new resolution on resize.
      window.dispatchEvent(new Event('resize'));
    },

    // Scale a particle count for this device.
    count(n) {
      return Math.max(1, Math.round(n * this.particles));
    },

    settingsHtml() {
      const cur = this.prefs.device in DEVICES ? this.prefs.device : 'auto';
      const opt = (k, label) => `<button class="perf-dev ${cur === k ? 'on' : ''}" type="button" data-perf-dev="${k}" aria-pressed="${cur === k}">${label}</button>`;
      return `<section class="set-sec">
        <h3>${root.Icons.svg('settings')} Performance</h3>
        <p class="muted small">Optimize the graphics for your device.</p>
        <div class="perf-devs" role="group" aria-label="Device">
          ${opt('auto', `Auto <em>${DEVICES[this.detected].label}</em>`)}
          ${Object.keys(DEVICES).map((k) => opt(k, DEVICES[k].label)).join('')}
        </div>
        <label class="switch"><input type="checkbox" data-perf-mode ${this.prefs.mode ? 'checked' : ''}><i></i> Performance mode</label>
        <p class="muted small">Fewer effects, simpler ultimates and no screen shake. Turn it on if battles lag.</p>
      </section>`;
    },

    bind(scope) {
      scope.addEventListener('click', (e) => {
        const b = e.target.closest('[data-perf-dev]');
        if (!b) return;
        this.set('device', b.dataset.perfDev);
        scope.querySelectorAll('[data-perf-dev]').forEach((x) => {
          const on = x === b;
          x.classList.toggle('on', on);
          x.setAttribute('aria-pressed', on);
        });
      });
      scope.addEventListener('change', (e) => {
        if (e.target.matches('[data-perf-mode]')) this.set('mode', e.target.checked);
      });
    },
  };

  // Looping effects (crate lights, card shines, button sweeps) only run while
  // they're on screen; scrolled away, they pause until they come back.
  const LOOPING = '.pack, .daily-card, .flash-card, .ucard, .btn-primary, .crate-art';
  function watchOffscreen() {
    const screen = document.getElementById('screen');
    if (!screen || !('IntersectionObserver' in root)) return;
    const io = new IntersectionObserver((list) => { for (const e of list) e.target.classList.toggle('anim-off', !e.isIntersecting); }, { rootMargin: '120px 0px' });
    let queued = false;
    const scan = () => {
      queued = false;
      io.disconnect();
      screen.querySelectorAll(LOOPING).forEach((n) => io.observe(n));
    };
    new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(scan); } }).observe(screen, { childList: true, subtree: true });
    scan();
  }
  // Looping glows (box-shadow, blur and drop-shadow, text glow) make the
  // browser repaint their element on every frame. A glow that changes 15
  // times a second looks the same as one that changes 60 times, so any
  // endless glow animation, today's or a future one, is stepped down to
  // that rate as it starts (8 a second in Performance mode). Movement
  // (transforms, sweeps) is left alone so it stays smooth.
  const PAINT = /boxShadow|filter|textShadow/;
  function stepGlows() {
    const seen = new WeakSet();
    document.addEventListener('animationstart', (e) => {
      const t = e.target;
      if (!t || !t.getAnimations) return;
      for (const a of t.getAnimations()) {
        if (seen.has(a) || a.animationName !== e.animationName) continue;
        seen.add(a);
        const tm = a.effect && a.effect.getTiming ? a.effect.getTiming() : null;
        if (!tm || tm.iterations !== Infinity) continue;
        const kf = a.effect.getKeyframes ? a.effect.getKeyframes() : [];
        // Inside an SVG drawing even a fade repaints the drawing, so those count too.
        const svgPart = typeof SVGElement !== 'undefined' && t instanceof SVGElement && t.tagName.toLowerCase() !== 'svg';
        if (!kf.some((k) => Object.keys(k).some((p) => PAINT.test(p) || (svgPart && p === 'opacity')))) continue;
        if (kf.some((k) => Object.keys(k).some((p) => p === 'transform' || p === 'translate' || p === 'left' || p === 'top'))) continue;
        const secs = (Number(tm.duration) || 1000) / 1000;
        const rate = Perf.on ? 8 : 15;
        try { a.effect.updateTiming({ easing: `steps(${Math.max(4, Math.round(secs * rate))}, jump-none)` }); } catch (err) { /* older browsers: leave it smooth */ }
      }
    }, true);
  }
  // A full-screen scene (crate opening, card walkout, badge cutscene) hides
  // the screen behind it, so that screen's looping effects pause meanwhile.
  function watchOverlays() {
    const KEEP = new Set(['screen', 'app-splash', 'starfield', 'topbar']);
    let queued = false;
    const check = () => {
      queued = false;
      const vw = innerWidth, vh = innerHeight;
      let covered = false;
      if (!document.body.classList.contains('in-battle')) {
        for (const n of document.body.children) {
          if (n.id === 'screen' || [...n.classList].some((c) => KEEP.has(c)) || n.tagName === 'SCRIPT' || n.tagName === 'STYLE') continue;
          const r = n.getBoundingClientRect();
          if (r.width >= vw * 0.9 && r.height >= vh * 0.9 && getComputedStyle(n).position === 'fixed') { covered = true; break; }
        }
      }
      if (!covered && !document.body.classList.contains('in-battle') && document.querySelector('#modal-root .modal-backdrop')) covered = true;
      if (document.body.classList.contains('overlay-on') !== covered) {
        // Script-driven fly-bys (the ships crossing the galaxy) ignore the CSS pause, so hold them by hand.
        document.querySelectorAll('#screen .hg-actor').forEach((n) => n.getAnimations().forEach((a) => { try { if (covered) a.pause(); else a.play(); } catch (e) { /* ignore */ } }));
      }
      document.body.classList.toggle('overlay-on', covered);
    };
    const mo = new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(check); } });
    mo.observe(document.body, { childList: true });
    const mr = document.getElementById('modal-root');
    if (mr) mo.observe(mr, { childList: true });
  }
  Perf.apply();
  const boot = () => { watchOffscreen(); watchOverlays(); };
  stepGlows();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  if (!document.body) document.addEventListener('DOMContentLoaded', () => Perf.apply());
  root.Perf = Perf;
})(window);

// Keep the screen on while the game is open (Screen Wake Lock). The lock is
// dropped by the browser whenever the tab is hidden, so it's taken again each
// time the game comes back, and on the first tap for browsers that want one.
// Browsers without it just behave as before.
(function (root) {
  'use strict';
  const nav = root.navigator;
  if (!nav || !nav.wakeLock || !nav.wakeLock.request) return;
  let lock = null;
  let asking = false;
  let lastTry = 0;
  async function hold(e) {
    if (lock || asking || document.visibilityState !== 'visible') return;
    // A refused request isn't retried on every tap, only every few seconds.
    const tap = !!(e && e.type !== 'visibilitychange');
    if (tap && Date.now() - lastTry < 10000) return;
    asking = true;
    try {
      lock = await nav.wakeLock.request('screen');
      lock.addEventListener('release', () => { lock = null; });
    } catch (err) { lock = null; if (tap) lastTry = Date.now(); }
    asking = false;
  }
  document.addEventListener('visibilitychange', (e) => { if (document.visibilityState === 'visible') hold(e); });
  for (const ev of ['pointerdown', 'keydown']) document.addEventListener(ev, hold, { passive: true });
  hold();
})(window);
