// HoloNet loader for the live site. The HoloNet isn't released yet: nothing
// here loads unless this browser tab has tester access, and then Firebase and
// the HoloNet are fetched on demand. Players without it download nothing extra.
(function (root) {
  'use strict';
  const KEY = 'hn-tester';
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
  function init() {
    // The private tester build carries its own copy of the HoloNet.
    if (root.HNBoot || typeof root.__hnBoot === 'function') return;
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
