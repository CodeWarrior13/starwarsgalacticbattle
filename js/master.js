// Master tester key: one code switches on every update still waiting for its
// date on this device (2.2 Friends and Foes, 2.3 The Hutt's Vault, wager duels
// and 2.4 Liberation), and the same code switches them back off.
//
// Switching off only undoes what the master key itself turned on: a switch
// that was already on from its own code stays on, and HOLOSAVE21's 2.2 test
// (Friends and the new profile) is never turned off by it.
(function (root) {
  'use strict';
  const UI = root.UI;
  if (!UI || !UI.hooks) return;
  const KEY = 'swcg-master';
  const SWITCHES = ['swcg-fr-test', 'swcg-pf2', 'swcg-v23-test', 'swcg-wg-test', 'swcg-v24-test', 'swcg-main-test'];
  const KEEP = ['swcg-fr-test', 'swcg-pf2']; // HOLOSAVE21's: always left on
  const code = () => String.fromCharCode(77, 65, 83, 84, 69, 82, 75, 69, 89, 83);
  const get = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const set = (k, v) => { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } };
  const state = () => { try { return JSON.parse(get(KEY) || 'null'); } catch (e) { return null; } };
  root.MasterKey = { on: () => !!state() };
  // A switch added after the master key was turned on joins it on the next load.
  const st0 = state();
  if (st0) {
    const late = SWITCHES.filter((k) => get(k) !== '1' && !(st0.mine || []).includes(k));
    if (late.length) {
      late.forEach((k) => set(k, '1'));
      set(KEY, JSON.stringify({ ...st0, mine: [...(st0.mine || []), ...late] }));
    }
  }

  const before = UI.hooks.redeem;
  UI.hooks.redeem = (c) => {
    if (c !== code()) return before ? before(c) : false;
    const st = state();
    if (!st) {
      // Remember which switches this turned on, so off undoes only those.
      const mine = SWITCHES.filter((k) => get(k) !== '1');
      mine.forEach((k) => set(k, '1'));
      set(KEY, JSON.stringify({ mine, at: Date.now() }));
      UI.toast('Master key ON for this device: 2.2, 2.3, 2.4 and the main teams preview are all switched on. Reloading…');
    } else {
      (st.mine || []).filter((k) => !KEEP.includes(k)).forEach((k) => set(k, null));
      set(KEY, null);
      UI.toast('Master key OFF: 2.3 and 2.4 go back to waiting for their dates. HOLOSAVE21 stays on. Reloading…');
    }
    setTimeout(() => location.reload(), 1600);
    return true;
  };
})(window);
