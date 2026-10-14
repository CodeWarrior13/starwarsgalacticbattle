// HoloNet loader for the live site.
// Before launch: nothing loads unless this browser tab has tester access, and
// then Firebase and the HoloNet are fetched on demand.
// From launch (7:00 a.m. Central, Wednesday October 14, 2026): the HoloNet is
// live for every player at account level 25+, on the real online area; tester
// access and tester data are gone. Players below 25 download nothing extra
// until they reach it.
(function (root) {
  'use strict';
  const KEY = 'hn-tester';
  const LAUNCH = root.__hnLaunchTest != null ? root.__hnLaunchTest : Date.UTC(2026, 9, 14, 12, 0, 0);
  const launched = () => Date.now() >= LAUNCH;
  const UNLOCK_LEVEL = 25;
  const FB = 'https://www.gstatic.com/firebasejs/10.12.2/';
  const code = () => String.fromCharCode(72, 79, 76, 79, 84, 69, 83, 84, 69, 82);
  let loading = null;
  const has = () => { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } };
  const load = (src) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.onload = resolve;
    s.onerror = () => reject(new Error(src));
    document.head.appendChild(s);
  });
  // Firebase and the connector; loaded again by Try again if the page opened offline.
  async function loadFb() {
    if (root.claude && root.claude.use && root.firebase) return;
    if (!root.firebase) await load(FB + 'firebase-app-compat.js');
    if (!root.firebase.auth) await load(FB + 'firebase-auth-compat.js');
    if (!root.firebase.firestore) await load(FB + 'firebase-firestore-compat.js');
    if (!(root.claude && root.claude.use)) await load('js/hn-firebase.js');
  }
  root.__hnLoadFb = () => loadFb().catch(() => {});
  function start() {
    if (loading) return loading;
    // Tester sessions use their own save slot and their own area of the database.
    root.__hnBeta = true;
    root.__hnEnv = 'beta';
    loading = (async () => {
      try {
        await loadFb();
      } catch (e) { /* no connection: the HoloNet shows its offline screen */ }
      try { await load('js/holonet.js'); } catch (e) { if (root.UI && root.UI.toast) root.UI.toast('Couldn\'t load the HoloNet. Check your connection and try again.'); loading = null; }
    })();
    return loading;
  }
  // Testers also borrow every card for this visit: they're never saved, so a
  // reload puts the collection back exactly as it was.
  function lendCards() {
    const P = root.Player;
    const D = root.GameData;
    if (!P || !D || P.__lent) return 0;
    const lent = new Set();
    for (const u of D.UNITS) {
      if (u.exclusive || u.rarity === 'secret' || P.state.units[u.id]) continue;
      P.state.units[u.id] = { level: 20, stars: 3, shards: 0 };
      lent.add(u.id);
    }
    P.__lent = lent;
    const save = P.save;
    P.save = function () {
      const units = this.state.units;
      const squads = this.state.squads;
      const keep = {};
      for (const id of lent) if (units[id]) { keep[id] = units[id]; delete units[id]; }
      this.state.squads = Object.fromEntries(Object.entries(squads || {}).map(([k, v]) => [k, Array.isArray(v) ? v.filter((id) => !lent.has(id)) : v]));
      try { return save.apply(this, arguments); } finally { Object.assign(units, keep); this.state.squads = squads; }
    };
    // Earning one for real makes it yours for good.
    const grant = P.grantCard;
    P.grantCard = function (id) { if (lent.has(id)) { lent.delete(id); delete this.state.units[id]; } return grant.apply(this, arguments); };
    // No spending on borrowed cards: they're gone after a reload.
    for (const fn of ['levelUp', 'starUp', 'starUpAurodium']) {
      const base = P[fn];
      if (typeof base !== 'function') continue;
      P[fn] = function (id) { if (lent.has(id)) { if (root.UI && root.UI.toast) root.UI.toast('This card is borrowed for testing, so it can\'t be upgraded.'); return false; } return base.apply(this, arguments); };
    }
    return lent.size;
  }
  // Launched: the real HoloNet for level 25+ players.
  function startLive() {
    if (loading) return loading;
    root.__hnBeta = false;
    root.__hnEnv = 'live';
    loading = (async () => {
      try { await loadFb(); } catch (e) { /* no connection: the HoloNet shows its offline screen */ }
      try { await load('js/holonet.js'); } catch (e) { if (root.UI && root.UI.toast) root.UI.toast('Couldn\'t load the HoloNet. Check your connection and reload.'); loading = null; }
    })();
    return loading;
  }
  // Saved accounts (js/account.js) load it early, at any level, to set up the
  // callsign and picture; nothing goes online until level 25 all the same.
  root.__hnStartLive = () => (launched() ? startLive() : Promise.resolve());
  function initLive() {
    const P = root.Player;
    // Tester leftovers: the tester flag and the tester save slot.
    try { sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    if (P && P.state && P.state.hnBeta) { delete P.state.hnBeta; P.save(); }
    if (!P || !P.state) return;
    const level = () => (P.state.account && P.state.account.level) || 1;
    if (level() >= UNLOCK_LEVEL) { startLive(); return; }
    // Reaching level 25 loads it right then (Ackbar's welcome follows).
    const gain = P.gainXp;
    P.gainXp = function () { const r = gain.apply(this, arguments); if (!loading && level() >= UNLOCK_LEVEL) startLive(); return r; };
  }
  function init() {
    // The private tester build carries its own copy of the HoloNet.
    if (root.HNBoot || typeof root.__hnBoot === 'function') return;
    if (launched()) return initLive();
    // A page left open over the launch: tell them to reload.
    const wait = LAUNCH - Date.now();
    if (wait < 4 * 86400000) setTimeout(() => { if (root.UI && root.UI.toast) root.UI.toast('Update 2.0 is live: the HoloNet is here! Reload the game to get it.'); }, wait + 2000);
    const H = root.UI && root.UI.hooks;
    if (H) {
      const before = H.redeem;
      H.redeem = (c) => {
        if (c !== code()) return before ? before(c) : false;
        try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* ignore */ }
        const n = lendCards();
        if (root.UI.toast) root.UI.toast(loading ? `HoloNet tester access is already on.${n ? ' All cards unlocked until you reload.' : ''}` : 'HoloNet tester access on for this session, and every card is unlocked until you reload.');
        start();
        return true;
      };
    }
    if (has()) start();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
  else setTimeout(init, 0);
})(window);
