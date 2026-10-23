// Update 2.2: friends can see what you're playing ("Online · Playing the
// Campaign", "In a Friendly Battle", "It's a secret…"). It rides along on the
// lobby heartbeat the Friends panel already reads, as one short code, so it
// needs no new Firebase rules and no extra reads. Secret areas only ever say
// "It's a secret". Settings has a switch to hide it (friends then just see Online).
(function (root) {
  'use strict';
  const UI = root.UI;
  const KEY = 'swcg-hide-activity';
  const on = () => !!(root.Update22 && (root.Update22.content || root.Update22.on)());
  const hidden = () => { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } };
  const LABELS = {
    home: 'In the hangar', camp: 'Playing the Campaign', fleet: 'Flying Fleet battles', boss: 'Fighting a world boss',
    tower: 'Climbing the Tower', secret: "It's a secret…", holo: 'On the HoloNet', raid: 'In a guild raid', arena: 'In the HoloNet Arena',
    duel: 'In a Live Duel', fduel: 'In a Friendly Battle', wager: 'In a Wager Duel', coll: 'Looking at their collection', market: 'At the Black Market',
    tut: 'In training',
  };
  let last = null; // the battle being played

  function code() {
    if (!on() || hidden()) return '';
    const HN = root.HN;
    const D = HN && HN.Duel;
    const m = D && (D.match || D.prep);
    if (m) return m.fr ? 'fduel' : (m.wg || m.wager) ? 'wager' : 'duel';
    const App = UI && UI.App;
    if (App && App.battleActive && last) {
      const t = last.type;
      if (t === 'secret') return 'secret';
      if (t === 'tower') return 'tower';
      if (t === 'tutorial') return 'tut';
      if (t === 'hn') return last.hn === 'raid' ? 'raid' : 'arena';
      if (t === 'boss') return 'boss';
      return last.kind === 'ship' ? 'fleet' : 'camp';
    }
    const cur = App && App.current;
    if (cur === 'holonet') return 'holo';
    if (cur === 'secret' || (App && App.params && App.params.type === 'secret')) return 'secret';
    if (cur === 'squad' || cur === 'campaign') {
      const t = App.params && App.params.type;
      if (t === 'tower') return 'tower';
      if (t === 'boss') return 'boss';
      return App.ui && App.ui.campaignKind === 'ship' ? 'fleet' : 'camp';
    }
    if (cur === 'collection') return 'coll';
    if (cur === 'market') return 'market';
    return 'home';
  }
  const label = (c) => LABELS[c] || '';

  // Tell friends soon after something changes (the heartbeat only writes when
  // the status is different, so this costs one write per change at most).
  let soon = 0;
  function nudge() {
    clearTimeout(soon);
    soon = setTimeout(() => { const D = root.HN && root.HN.Duel; if (D && D.setPresence && D.room) D.setPresence(); }, 3000);
  }
  if (root.BattleUI && root.BattleUI.start) {
    const start = root.BattleUI.start.bind(root.BattleUI);
    root.BattleUI.start = function (params) { last = params || null; nudge(); return start(params); };
  }
  if (UI && UI.App) {
    const go = UI.App.go.bind(UI.App);
    UI.App.go = (screen, params, opts) => { const out = go(screen, params, opts); nudge(); return out; };
  }

  function settingsHtml() {
    if (!on()) return '';
    return `<section class="set-sec"><h3>${root.Icons ? root.Icons.svg('holocron') : ''} Friends</h3>
      <label class="switch"><input type="checkbox" data-act-show ${hidden() ? '' : 'checked'}><i></i> Show friends what I'm playing</label>
      <p class="muted small">Friends see things like "Playing the Campaign" or "In a Friendly Battle" next to your name. Turn it off and they just see Online.</p></section>`;
  }
  function bind(el) {
    el.addEventListener('change', (e) => {
      if (!e.target.matches('[data-act-show]')) return;
      try { if (e.target.checked) localStorage.removeItem(KEY); else localStorage.setItem(KEY, '1'); } catch (err) { /* ignore */ }
      nudge();
    });
  }

  root.FriendActivity = { code, label, hidden, settingsHtml, bind, nudge };
})(window);
