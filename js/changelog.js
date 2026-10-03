// Update log. The newest entry shows once as "What's new" the next time a
// player opens the game after an update; Settings > Update log lists them all.
// Keep CHANGELOG.md in step with this list.
(function (root) {
  'use strict';

  const SEEN_KEY = 'swcg-seen-update';

  const UPDATES = [
    {
      v: '1.7', date: 'October 3, 2026', title: 'Boot camp',
      items: [
        'IMPROVED|The tutorial dogfight is tougher: three TIEs, including an Interceptor, now fly against you.',
        'NEW|The tutorial now teaches Auto battle and the speed settings once you\'ve learned to fight by hand.',
        'IMPROVED|Deeper lessons on squad bonuses, traits and Ultimates.',
        'NEW|A guided tour after training: your collection, a real card level-up, stars and shards, Ultimates and the Black Market.',
        'NEW|New players get a one-time Recruit Crate with the rest of their starter squad. Skipping the tutorial still gives you those cards.',
      ],
    },
    {
      v: '1.6', date: 'October 3, 2026', title: 'Smoother start',
      items: [
        'BALANCE|Early worlds are easier: Tatooine and Hoth enemies hit softer, and Jabba\'s Palace is no longer a wall.',
        'BALANCE|Enemy squads never outnumber yours: they grow only as your squad slots do.',
        'IMPROVED|The tutorial is longer: a ground fight and then a dogfight, with lessons on squad bonuses, planet terrain and hazards.',
        'IMPROVED|Tutorial tips are bigger, easier to read and tuck away so you can see the cards.',
        'IMPROVED|Your starter squad now arrives card by card, with your starting credits and Kyber counting up.',
        'NEW|This update log, in Settings.',
        'IMPROVED|Opening a version in the update log gives it the whole panel; scroll for the others.',
        'NEW|A reminder to reload if the game was open when an update came out.',
      ],
    },
    {
      v: '1.5', date: 'October 3, 2026', title: 'Events and celebrations',
      items: [
        'NEW|May the 4th: a Jedi-blue galaxy and a free Jedi Holocron plus 25 Kyber, once a year.',
        'NEW|Revenge of the Fifth: a Sith-red galaxy where your Dark side cards fight 20% stronger.',
        'NEW|Both events have their own legendary badge with a cutscene.',
        'NEW|Liberating every world now ends in a Hero of the Galaxy ceremony for your three best cards.',
        'NEW|Survivor achievement: win with a unit on its last 1% of health for a free Sith Holocron.',
      ],
    },
    {
      v: '1.4', date: 'October 2, 2026', title: 'Training day',
      items: [
        'NEW|New players start with a tutorial led by Captain Rex. Hold the button in the first 10 seconds to skip it.',
        'NEW|Replay the tutorial any time from Settings.',
        'IMPROVED|Achievement medals got an upgrade: Bronze, Silver, Credit and Kyber, each with its own showcase.',
        'IMPROVED|Captain Rex has a new look.',
      ],
    },
    {
      v: '1.3', date: 'October 2, 2026', title: 'Kyber rebalance',
      items: [
        'BALANCE|Kyber is rarer and worth more: 1 to 2 per first clear, with Night Market prices lowered to match.',
        'BALANCE|Daily rewards pay 130 Kyber over a full week.',
        'FIXED|Your credits and Kyber now stay visible at the top while you scroll the shop.',
        'FIXED|Reward cards on the results screen can be tapped to view them.',
      ],
    },
  ];

  // Reminder that a page left open keeps running the old version.
  const RELOAD_NOTE = `<div class="ul-reload"><div><b>Not seeing the latest fixes?</b><span>If the game was open when an update came out, reload to get it. Your progress is kept.</span></div><button class="btn btn-small" type="button" data-reload>Reload now</button></div>`;

  const Changelog = {
    UPDATES,
    latest: UPDATES[0].v,

    // Each line is "TAG|text"; the tag becomes a coloured label.
    itemsHtml(items) {
      const esc = root.UI.esc;
      const LABEL = { NEW: 'New', IMPROVED: 'Improved', BALANCE: 'Balance', FIXED: 'Fixed' };
      return `<ul class="ul-items">${items.map((line) => {
        const [tag, text] = line.includes('|') ? line.split('|') : ['NEW', line];
        return `<li class="ul-item t-${tag.toLowerCase()}"><span class="ul-tag">${LABEL[tag] || tag}</span><span class="ul-text">${esc(text)}</span></li>`;
      }).join('')}</ul>`;
    },

    entryHtml(u, open) {
      const esc = root.UI.esc;
      return `<details class="ul-entry" ${open ? 'open' : ''}>
        <summary><span class="ul-ver">v${esc(u.v)}</span><b>${esc(u.title)}</b><span class="ul-date">${esc(u.date)}</span><span class="ul-chev">▾</span></summary>
        ${this.itemsHtml(u.items)}
      </details>`;
    },

    // Settings > Update log: every update, newest first.
    showAll() {
      const UI = root.UI;
      const m = UI.openModal(`<div class="ul-head"><span class="ul-badge">Command Console</span><h2>Update log</h2><p class="ul-sub">Every update, newest first. Tap one to open it.</p></div>
        <div class="ul-list">${UPDATES.map((u, i) => this.entryHtml(u, i === 0)).join('')}</div>
        ${RELOAD_NOTE}
        <div class="modal-actions"><button class="btn btn-primary" type="button" data-close>Done</button></div>`, { small: true, cls: 'update-modal full' });
      // One version open at a time; the opened one scrolls to the top so it
      // fills the panel, and the others are a scroll away.
      const list = m.root.querySelector('.ul-list');
      m.root.querySelectorAll('.ul-entry').forEach((d) => d.addEventListener('toggle', () => {
        if (!d.open) return;
        m.root.querySelectorAll('.ul-entry[open]').forEach((o) => { if (o !== d) o.open = false; });
        requestAnimationFrame(() => list.scrollTo({ top: d.offsetTop - list.offsetTop, behavior: 'smooth' }));
      }));
      m.root.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) m.close();
        if (e.target.closest('[data-reload]')) location.reload();
      });
      this.markSeen();
    },

    // After an update: show what's new once, the next time the game opens.
    showWhatsNew() {
      const UI = root.UI;
      const u = UPDATES[0];
      const m = UI.openModal(`<div class="ul-head"><span class="ul-badge">What's new</span><span class="ul-ver big">v${UI.esc(u.v)}</span><h2>${UI.esc(u.title)}</h2></div>
        <p class="ul-date-line">${UI.esc(u.date)}</p>
        ${this.itemsHtml(u.items)}
        <p class="ul-safe">Your progress is safe: updates never reset your save.</p>
        ${RELOAD_NOTE}
        <div class="modal-actions"><button class="btn" type="button" data-all>Full update log</button><button class="btn btn-primary" type="button" data-close>Let's go</button></div>`, { small: true, cls: 'update-modal' });
      m.root.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) m.close();
        if (e.target.closest('[data-all]')) { m.close(); this.showAll(); }
        if (e.target.closest('[data-reload]')) location.reload();
      });
      this.markSeen();
    },

    seen() {
      try { return localStorage.getItem(SEEN_KEY); } catch (e) { return this.latest; }
    },

    markSeen() {
      try { localStorage.setItem(SEEN_KEY, this.latest); } catch (e) { /* storage unavailable */ }
    },

    // Called at startup. Brand-new players (tutorial still pending) are not
    // shown old news; they simply start on the current version.
    check() {
      if (root.Player.tutorialPending()) { if (!this.seen()) this.markSeen(); return; }
      if (this.seen() === this.latest) return;
      setTimeout(() => {
        if (document.querySelector('.modal-backdrop, .feat-cine, .feat-show, .tut-intro')) return setTimeout(() => this.check(), 1500);
        this.showWhatsNew();
      }, 1200);
    },
  };

  root.Changelog = Changelog;
})(window);
