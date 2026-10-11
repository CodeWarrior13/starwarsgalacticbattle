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
  function start() {
    if (loading) return loading;
    // Tester sessions use their own save slot and their own area of the database.
    root.__hnBeta = true;
    root.__hnEnv = 'beta';
    loading = (async () => {
      try {
        for (const f of ['firebase-app-compat.js', 'firebase-auth-compat.js', 'firebase-firestore-compat.js']) await load(FB + f);
        await load('js/hn-firebase.js');
      } catch (e) { /* no connection: the HoloNet shows its offline screen */ }
      try { await load('js/holonet.js'); } catch (e) { if (root.UI && root.UI.toast) root.UI.toast('Couldn\'t load the HoloNet. Check your connection and try again.'); loading = null; }
    })();
    return loading;
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
        if (root.UI.toast) root.UI.toast(loading ? 'HoloNet tester access is already on.' : 'HoloNet tester access on for this session. Close the tab to end it.');
        start();
        return true;
      };
    }
    if (has()) start();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
  else setTimeout(init, 0);
})(window);
