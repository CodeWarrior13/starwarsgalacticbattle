// Card usage counter: once a day, each player's squads (card ids only, no
// names) go to hn/<env>/usage/<their account id>, so the owner can see what
// share of players uses each card (scripts/usage.js). Players who already
// have the online services loaded (HoloNet, saved accounts) send it right
// away; others from level 10 load them once a day while idle on a menu.
(function (root) {
  'use strict';
  const KEY = 'swcg-usage-day';
  const day = () => new Date().toISOString().slice(0, 10);
  const get = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } };
  let busy = false;
  async function send() {
    const P = root.Player;
    if (busy || !P || !P.state || get(KEY) === day()) return;
    const lvl = (P.state.account && P.state.account.level) || 1;
    if (lvl < 10 && !root.__hnFb) return;
    if (document.body.classList.contains('in-battle')) return;
    busy = true;
    try {
      if (!root.__hnFb && root.__hnLoadFb) await root.__hnLoadFb();
      const F = root.__hnFb;
      if (!F) return;
      const u = await F.signedIn();
      if (!u) return;
      const ids = (k) => P.squadEntries(k).map((e) => e.id).slice(0, 5);
      const env = root.__hnEnv === 'beta' ? 'beta' : 'live';
      await F.fs.doc(`hn/${env}/usage/${u.uid}`).set({ day: day(), lvl, g: ids('character'), f: ids('ship'), t: F.firebase.firestore.FieldValue.serverTimestamp() });
      set(KEY, day());
    } catch (e) { /* try again later */ } finally { busy = false; }
  }
  // A quiet moment: 45 s after load, then every 30 min while the game is open.
  setTimeout(send, 45000);
  setInterval(send, 30 * 60000);
  root.UsageCounter = { send };
})(window);
