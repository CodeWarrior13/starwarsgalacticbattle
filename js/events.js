// Calendar events. On May the 4th the galaxy goes Jedi blue and hands out a
// free gift; on Revenge of the Fifth (May 5th) it turns Sith red and your
// Dark side cards fight 20% stronger. Dates use the player's local clock.
(function (root) {
  'use strict';

  const EVENTS = {
    may4: {
      id: 'may4', month: 4, day: 4, theme: 'event-jedi', title: 'May the 4th be with you',
      blurb: 'Jedi Day across the galaxy. Claim a free Jedi Holocron and 25 Kyber.',
      gift: { pack: 'holocron', crystals: 25 },
    },
    may5: {
      id: 'may5', month: 4, day: 5, theme: 'event-sith', title: 'Revenge of the Fifth',
      blurb: 'The Sith strike back: your Dark side cards fight with 20% more attack and health today.',
      boost: { faction: 'dark', pct: 0.2 },
    },
  };

  const Events = {
    // Testing can force an event; null follows the real date.
    override: null,

    active(now) {
      if (this.override) return EVENTS[this.override] || null;
      const d = now ? new Date(now) : new Date();
      return Object.values(EVENTS).find((e) => e.month === d.getMonth() && e.day === d.getDate()) || null;
    },

    // Battle buff for the player's squad while an event is running.
    boost() {
      const e = this.active();
      return e && e.boost ? e.boost : null;
    },

    giftKey(e) {
      return `${e.id}-${new Date().getFullYear()}`;
    },

    giftClaimed(e) {
      const s = Player.state;
      return !!(s.events && s.events[this.giftKey(e)]);
    },

    claimGift() {
      const e = this.active();
      if (!e || !e.gift || this.giftClaimed(e)) return;
      const s = Player.state;
      s.events = s.events || {};
      s.events[this.giftKey(e)] = true;
      s.crystals += e.gift.crystals || 0;
      const results = e.gift.pack ? Player.openPack(e.gift.pack, null, { free: true }) : null;
      Player.save();
      root.UI.updateWallet();
      if (results) root.UI.packReveal(results, e.gift.pack);
      else root.UI.App.refresh();
    },

    // Theme the page and drop the event banner onto the galaxy screen.
    decorate(screen) {
      const e = this.active();
      document.body.classList.remove('event-jedi', 'event-sith');
      if (!e) return;
      document.body.classList.add(e.theme);
      if (screen !== 'home') return;
      const hub = document.querySelector('#screen .hub');
      if (!hub || hub.querySelector('.event-banner')) return;
      const claimed = e.gift && this.giftClaimed(e);
      const banner = root.UI.el(`<div class="event-banner ${e.theme}">
        <div><b>${root.UI.esc(e.title)}</b><span>${root.UI.esc(e.blurb)}</span></div>
        ${e.gift ? `<button class="btn btn-primary btn-small" type="button" data-event-gift ${claimed ? 'disabled' : ''}>${claimed ? 'Claimed' : 'Claim gift'}</button>` : ''}
      </div>`);
      hub.prepend(banner);
      const btn = banner.querySelector('[data-event-gift]');
      if (btn) btn.addEventListener('click', () => this.claimGift());
    },

    install() {
      const App = root.UI.App;
      const go = App.go.bind(App);
      App.go = (screen, params, opts) => {
        const out = go(screen, params, opts);
        this.decorate(screen);
        return out;
      };
    },
  };

  root.Events = Events;
  Events.install();
})(window);
