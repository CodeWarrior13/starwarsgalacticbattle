// Update log. The newest entry shows once as "What's new" the next time a
// player opens the game after an update; Settings > Update log lists them all.
// Keep CHANGELOG.md in step with this list.
(function (root) {
  'use strict';

  const SEEN_KEY = 'swcg-seen-update';

  const UPDATES = [
    {
      v: '1.6', date: 'October 3, 2026', title: 'Smoother start',
      items: [
        'Early worlds are easier: Tatooine and Hoth enemies hit softer, and Jabba\'s Palace is no longer a wall.',
        'Enemy squads never outnumber yours: they grow only as your squad slots do.',
        'The tutorial is longer: a ground fight and then a dogfight, with lessons on squad bonuses, planet terrain and hazards.',
        'Tutorial tips are bigger, easier to read and tuck away so you can see the cards.',
        'Your starter squad now arrives card by card, with your starting credits and Kyber counting up.',
        'New: this update log, in Settings.',
      ],
    },
    {
      v: '1.5', date: 'October 3, 2026', title: 'Events and celebrations',
      items: [
        'May the 4th: a Jedi-blue galaxy and a free Jedi Holocron plus 25 Kyber, once a year.',
        'Revenge of the Fifth: a Sith-red galaxy where your Dark side cards fight 20% stronger.',
        'Both events have their own legendary badge with a cutscene.',
        'Liberating every world now ends in a Hero of the Galaxy ceremony for your three best cards.',
        'New Survivor achievement: win with a unit on its last 1% of health for a free Sith Holocron.',
      ],
    },
    {
      v: '1.4', date: 'October 2, 2026', title: 'Training day',
      items: [
        'New players start with a tutorial led by Captain Rex. Hold the button in the first 10 seconds to skip it.',
        'Replay the tutorial any time from Settings.',
        'Achievement medals got an upgrade: Bronze, Silver, Credit and Kyber, each with its own showcase.',
        'Captain Rex has a new look.',
      ],
    },
    {
      v: '1.3', date: 'October 2, 2026', title: 'Kyber rebalance',
      items: [
        'Kyber is rarer and worth more: 1 to 2 per first clear, with Night Market prices lowered to match.',
        'Daily rewards pay 130 Kyber over a full week.',
        'Your credits and Kyber now stay visible at the top while you scroll the shop.',
        'Reward cards on the results screen can be tapped to view them.',
      ],
    },
  ];

  const Changelog = {
    UPDATES,
    latest: UPDATES[0].v,

    entryHtml(u, open) {
      const esc = root.UI.esc;
      return `<details class="ul-entry" ${open ? 'open' : ''}>
        <summary><b>v${esc(u.v)} · ${esc(u.title)}</b><span>${esc(u.date)}</span></summary>
        <ul>${u.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </details>`;
    },

    // Settings > Update log: every update, newest first.
    showAll() {
      const UI = root.UI;
      const m = UI.openModal(`<div class="ul-head"><p class="eyebrow">Command Console</p><h2>Update log</h2></div>
        <div class="ul-list">${UPDATES.map((u, i) => this.entryHtml(u, i === 0)).join('')}</div>
        <div class="modal-actions"><button class="btn btn-primary" type="button" data-close>Done</button></div>`, { small: true, cls: 'update-modal' });
      m.root.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) m.close(); });
      this.markSeen();
    },

    // After an update: show what's new once, the next time the game opens.
    showWhatsNew() {
      const UI = root.UI;
      const u = UPDATES[0];
      const m = UI.openModal(`<div class="ul-head"><p class="eyebrow">What's new · v${UI.esc(u.v)}</p><h2>${UI.esc(u.title)}</h2></div>
        <ul class="ul-new">${u.items.map((t) => `<li>${UI.esc(t)}</li>`).join('')}</ul>
        <p class="muted small">Your progress is safe: updates never reset your save.</p>
        <div class="modal-actions"><button class="btn" type="button" data-all>Full update log</button><button class="btn btn-primary" type="button" data-close>Let's go</button></div>`, { small: true, cls: 'update-modal' });
      m.root.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) m.close();
        if (e.target.closest('[data-all]')) { m.close(); this.showAll(); }
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
