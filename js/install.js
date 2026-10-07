// Installable app: registers the offline helper (sw.js), shows the loading
// screen on launch, and offers "Install app" (Chrome/Edge/Android prompt, or step-by-
// step help on iPhone and iPad, where Apple only allows Share > Add to Home Screen).
(function (root) {
  'use strict';

  const DISMISS_KEY = 'swcg-install-dismissed';
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const mobile = isIOS || isAndroid || (navigator.maxTouchPoints > 1 && Math.min(screen.width, screen.height) < 900);
  // Which browser, for the right step-by-step help.
  const browser = /CriOS/.test(ua) ? 'chrome-ios' : /FxiOS/.test(ua) ? 'firefox-ios' : /EdgiOS/.test(ua) ? 'edge-ios'
    : isIOS ? 'safari' : /SamsungBrowser/.test(ua) ? 'samsung' : /Firefox/.test(ua) ? 'firefox' : /EdgA?\//.test(ua) ? 'edge' : 'chrome';
  const standalone = () => (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;

  let deferred = null;

  const SHARE_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const ADD_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  const Install = {
    installed: standalone(),

    // True when this browser can install the game (or show how to). Phones
    // and tablets always get the offer: Chrome only fires its own prompt
    // when it decides to, so the help steps cover the rest.
    available() {
      return !standalone() && (!!deferred || mobile);
    },

    async prompt() {
      if (standalone()) return root.UI.toast('You\'re already playing the app.');
      if (deferred) {
        const p = deferred;
        deferred = null;
        p.prompt();
        const choice = await p.userChoice.catch(() => null);
        if (choice && choice.outcome === 'accepted') this.hideBanner();
        return;
      }
      this.help();
    },

    // Step-by-step help: Apple devices, or browsers without an install prompt.
    help() {
      const UI = root.UI;
      const step = (icon, title, text) => `<li><span class="inst-ico">${icon}</span><div><b>${title}</b><span>${text}</span></div></li>`;
      const MENU = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="5" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="19" r="2" fill="currentColor"/></svg>';
      const BURGER = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      const HELP = {
        safari: [step(SHARE_ICON, 'Tap the Share button', 'At the bottom of Safari on iPhone, or at the top on iPad.'), step(ADD_ICON, 'Tap "Add to Home Screen"', 'Scroll down the list if you don\'t see it, then tap Add.')],
        'chrome-ios': [step(SHARE_ICON, 'Tap the Share button', 'In Chrome it\'s at the right end of the address bar (on iPad, at the top right).'), step(ADD_ICON, 'Tap "Add to Home Screen"', 'Scroll down if you don\'t see it, then tap Add. Needs iOS 16.4 or newer; on older iPhones use Safari instead.')],
        'edge-ios': [step(SHARE_ICON, 'Tap the Share button', 'Open the menu at the bottom of Edge and tap Share.'), step(ADD_ICON, 'Tap "Add to Home Screen"', 'Then tap Add. On older iPhones use Safari instead.')],
        'firefox-ios': [step(BURGER, 'Open the menu', 'Tap the menu button, then Share.'), step(ADD_ICON, 'Tap "Add to Home Screen"', 'Then tap Add. On older iPhones use Safari instead.')],
        chrome: isAndroid
          ? [step(MENU, 'Tap the ⋮ menu', 'At the top right of Chrome.'), step(ADD_ICON, 'Tap "Install app" or "Add to Home screen"', 'Then tap Install. The icon appears on your home screen.')]
          : [step(ADD_ICON, 'Click the install icon', 'At the right end of the address bar. Or open the ⋮ menu and choose "Cast, save and share" → "Install page as app".')],
        edge: isAndroid
          ? [step(BURGER, 'Tap the menu', 'At the bottom of Edge.'), step(ADD_ICON, 'Tap "Add to phone"', 'Then tap Install.')]
          : [step(ADD_ICON, 'Click the install icon', 'At the right end of the address bar, or open the … menu → Apps → "Install this site as an app".')],
        samsung: [step(BURGER, 'Tap the ≡ menu', 'At the bottom of Samsung Internet.'), step(ADD_ICON, 'Tap "Add page to" → "Home screen"', 'Then tap Add.')],
        firefox: isAndroid
          ? [step(MENU, 'Tap the ⋮ menu', 'In Firefox.'), step(ADD_ICON, 'Tap "Add to Home screen"', 'Then tap Add.')]
          : [step(ADD_ICON, 'Use Chrome or Edge', 'Firefox on computers can\'t install web apps. Open the game in Chrome or Edge and click the install icon in the address bar.')],
      };
      const steps = `<ol class="inst-steps">${(HELP[browser] || HELP.chrome).join('')}</ol>
        <p class="muted small">${isIOS ? 'The app opens full screen from your home screen. On iPhone and iPad it keeps its own save, separate from the one in the browser.' : 'The app opens full screen with its own icon and keeps your progress.'}</p>`;
      const m = UI.openModal(`<div class="inst-head"><img src="icons/icon-192.png" alt="" class="inst-logo"><div><p class="eyebrow">Get the app</p><h2>Install Galactic Card Battles</h2></div></div>
        ${steps}
        <div class="modal-actions"><button class="btn btn-primary" type="button" data-close>Got it</button></div>`, { small: true, cls: 'install-modal' });
      m.root.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) m.close(); });
    },

    // Settings > App.
    settingsHtml() {
      const icon = root.Icons.svg('cubes');
      if (standalone()) return `<section class="set-sec"><h3>${icon} App</h3><p class="muted small">You're playing the installed app. Updates arrive automatically.</p></section>`;
      return `<section class="set-sec"><h3>${icon} App</h3>
        <p class="muted small">Put the game on your home screen or desktop with its own icon. It opens full screen and works offline.</p>
        <button class="btn" type="button" data-install>Install app</button></section>`;
    },

    // One-time "Get the app" banner, once the player is past the tutorial.
    maybeBanner() {
      let dismissed = false;
      try { dismissed = !!localStorage.getItem(DISMISS_KEY); } catch (e) { /* storage unavailable */ }
      if (dismissed || !this.available() || document.querySelector('.inst-banner')) return;
      if (root.Player && root.Player.tutorialPending && root.Player.tutorialPending()) return;
      if (document.body.classList.contains('in-battle') || document.querySelector('.modal-backdrop, .feat-cine, .feat-show, .tut-intro')) {
        setTimeout(() => this.maybeBanner(), 4000);
        return;
      }
      const b = root.UI.el(`<div class="inst-banner" role="dialog" aria-label="Install the app">
        <img src="icons/icon-192.png" alt="">
        <div><b>Get the app</b><span>Play from your home screen, full screen.</span></div>
        <button class="btn btn-primary btn-small" type="button" data-install>Install</button>
        <button class="inst-x" type="button" aria-label="Not now">✕</button>
      </div>`);
      document.body.appendChild(b);
      b.querySelector('.inst-x').addEventListener('click', () => {
        try { localStorage.setItem(DISMISS_KEY, '1'); } catch (e) { /* storage unavailable */ }
        this.hideBanner();
      });
    },

    hideBanner() {
      const b = document.querySelector('.inst-banner');
      if (!b) return;
      b.classList.add('out');
      setTimeout(() => b.remove(), 300);
    },
  };

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
    setTimeout(() => Install.maybeBanner(), 2500);
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    Install.hideBanner();
    if (root.UI) root.UI.toast('Installed! Find Galactic Card Battles on your home screen.');
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-install]')) Install.prompt();
  });

  // Offline helper. Only on a real web address (not opened as a file).
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }

  // Loading screen: warms fonts, card art and the galaxy map behind a
  // progress bar with tips, so the first taps afterwards are smooth.
  const TIPS = [
    'Tip: tap a squad bonus chip in battle to see exactly what it does.',
    'Tip: matching traits unlock squad bonuses. Two Jedi, two Rebels, three Droids…',
    'Tip: every world has its own terrain and hazard. Check the datapad before you fight.',
    'Tip: duplicate cards become shards. Collect enough to add a Star.',
    'Tip: the gold bar under a card is its Ultimate. It fills as you deal and take hits.',
    'Tip: claim the daily reward in the Black Market. The streak keeps getting better.',
    'Tip: tap any card in your collection, then its Ultimate page, to watch the move.',
    'Tip: the Endless Tower gets harder every floor, and pays more too.',
    'Tip: speed decides who moves first. Watch the turn order strip at the top.',
  ];
  const splash = document.querySelector('.app-splash');
  if (splash) {
    const fill = splash.querySelector('[data-ls-fill]');
    const pct = splash.querySelector('[data-ls-pct]');
    const what = splash.querySelector('[data-ls-what]');
    const tip = splash.querySelector('[data-ls-tip]');
    let shown = 0;
    let target = 0;
    let done = false;
    const t0 = performance.now();
    tip.textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
    const tipTimer = setInterval(() => {
      tip.classList.add('swap');
      setTimeout(() => { tip.textContent = TIPS[Math.floor(Math.random() * TIPS.length)]; tip.classList.remove('swap'); }, 300);
    }, 2600);
    // The bar eases toward the real progress instead of jumping.
    const tick = () => {
      if (done) return;
      shown += (target - shown) * 0.18 + 0.2;
      shown = Math.min(shown, target);
      fill.style.width = `${shown}%`;
      pct.textContent = `${Math.round(shown)}%`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    const hide = () => {
      if (done) return;
      done = true;
      clearInterval(tipTimer);
      fill.style.width = '100%';
      pct.textContent = '100%';
      setTimeout(() => {
        splash.classList.add('out');
        setTimeout(() => splash.remove(), 500);
      }, 180);
    };
    splash.addEventListener('click', () => { if (performance.now() - t0 > 600) hide(); });
    const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
    const timeout = (ms) => new Promise((r) => setTimeout(r, ms));
    const steps = [
      ['Charging hyperdrive…', 20, () => Promise.race([
        Promise.all([document.fonts.load('800 20px Oxanium'), document.fonts.load('600 16px "Chakra Petch"')]).catch(() => {}),
        timeout(2500),
      ])],
      ['Assembling your squads…', 60, async () => {
        const D = root.GameData;
        const Art = root.Art;
        if (!D || !Art) return;
        const list = D.UNITS;
        for (let i = 0; i < list.length; i += 10) {
          for (const def of list.slice(i, i + 10)) Art.unitArt(def);
          target = 20 + Math.round((40 * Math.min(list.length, i + 10)) / list.length);
          await frame();
        }
      }],
      ['Plotting hyperspace routes…', 85, async () => { await frame(); await frame(); }],
      ['Opening comms…', 100, () => Promise.all([...document.images].filter((im) => im.decode && !im.complete).map((im) => im.decode().catch(() => {})))],
    ];
    const run = async () => {
      for (const [label, end, job] of steps) {
        what.textContent = label;
        try { await job(); } catch (e) { /* a warm-up step must never block the game */ }
        target = end;
      }
      // Long enough to read a tip, short enough not to be a wait.
      const minMs = standalone() ? 1600 : 1200;
      const left = minMs - (performance.now() - t0);
      setTimeout(hide, Math.max(250, left));
    };
    if (document.readyState === 'complete') run(); else window.addEventListener('load', run);
    setTimeout(hide, 7000);
  }

  // Phones and tablets get the banner even if Chrome never fires its prompt.
  if (mobile) setTimeout(() => Install.maybeBanner(), 6000);

  root.Install = Install;
})(window);
