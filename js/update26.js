// Update 2.6 "Squadron Commander": release switch. No date yet, so it stays off for players.
// Testers switch it on with localStorage 'swcg-v26-test' = '1'.
(function (root) {
  'use strict';
  const RELEASE26 = root.__v26Test != null ? root.__v26Test : null;
  const KEY = 'swcg-v26-test';
  const test = (v) => {
    try {
      if (v === undefined) return localStorage.getItem(KEY) === '1';
      if (v) localStorage.setItem(KEY, '1'); else localStorage.removeItem(KEY);
    } catch (e) { return false; }
    return !!v;
  };
  const released = () => RELEASE26 != null && Date.now() >= RELEASE26;
  const on = () => released() || test();
  root.Update26 = { on, test, released, at: RELEASE26, name: 'Squadron Commander' };
})(window);
