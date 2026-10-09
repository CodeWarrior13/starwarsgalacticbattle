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
    pc: { label: 'PC', dpr: 1.5, particles: 1, fps: 60, glow: true, shake: true },
  };
  const LITE = { dpr: 0.85, particles: 0.25, fps: 30, glow: false, shake: false, simpleUlts: true };

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && typeof s === 'object') return s;
    } catch (e) { /* storage unavailable */ }
    // Very low-memory devices start in Performance mode.
    return { device: 'auto', mode: (navigator.deviceMemory || 8) <= 2 };
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
  const LOOPING = '.pack, .daily-card, .flash-card, .ucard.rarity-legendary, .ucard.rarity-secret, .btn-primary, .crate-art';
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
      document.body.classList.toggle('overlay-on', covered);
    };
    const mo = new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(check); } });
    mo.observe(document.body, { childList: true });
    const mr = document.getElementById('modal-root');
    if (mr) mo.observe(mr, { childList: true });
  }
  Perf.apply();
  const boot = () => { watchOffscreen(); watchOverlays(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  if (!document.body) document.addEventListener('DOMContentLoaded', () => Perf.apply());
  root.Perf = Perf;
})(window);
