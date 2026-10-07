// Installable app: registers the offline helper (sw.js), shows the logo splash
// on launch, and offers "Install app" (Chrome/Edge/Android prompt, or step-by-
// step help on iPhone and iPad, where Apple only allows Share > Add to Home Screen).
(function (root) {
  'use strict';

  const DISMISS_KEY = 'swcg-install-dismissed';
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const standalone = () => (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;

  let deferred = null;

  const SHARE_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const ADD_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  const Install = {
    installed: standalone(),

    // True when this browser can install the game (or show how to).
    available() {
      return !standalone() && (!!deferred || isIOS);
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
      const steps = isIOS
        ? `<ol class="inst-steps">
            <li><span class="inst-ico">${SHARE_ICON}</span><div><b>Tap the Share button</b><span>At the bottom of Safari on iPhone, or at the top on iPad.</span></div></li>
            <li><span class="inst-ico">${ADD_ICON}</span><div><b>Tap "Add to Home Screen"</b><span>Scroll down the list if you don't see it, then tap Add.</span></div></li>
          </ol>
          <p class="muted small">The app opens full screen from your home screen. On iPhone and iPad it keeps its own save, separate from the one in Safari.</p>`
        : `<ol class="inst-steps">
            <li><span class="inst-ico">${ADD_ICON}</span><div><b>Use Chrome or Edge</b><span>Look for the install icon at the right end of the address bar, or open the browser menu and choose "Install app".</span></div></li>
          </ol>
          <p class="muted small">If it isn't offered, your browser doesn't support installing web apps yet. The game still works right here in the browser.</p>`;
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

  // The logo splash fades once the game is ready; tap to skip it sooner.
  const splash = document.querySelector('.app-splash');
  if (splash) {
    const hide = () => {
      if (!splash.isConnected || splash.classList.contains('out')) return;
      splash.classList.add('out');
      setTimeout(() => splash.remove(), 500);
    };
    splash.addEventListener('click', hide);
    const ready = () => setTimeout(hide, standalone() ? 1100 : 700);
    if (document.readyState === 'complete') ready(); else window.addEventListener('load', ready);
  }

  if (isIOS) setTimeout(() => Install.maybeBanner(), 6000);

  root.Install = Install;
})(window);
