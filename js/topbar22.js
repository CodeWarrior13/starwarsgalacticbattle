// The 2.2 top bar: your profile chip shows your picture, your level and the
// red number for friend requests and messages (the Friends button stays too,
// just before Settings, for quick chats), and on phones
// all three currencies stay on show, shortened (5.4M); tap one to see
// its full amount. Switches on with 2.2 (testers: the HOLOSAVE21 code).
(function (root) {
  'use strict';
  const D = root.GameData;
  const U = () => root.UI;
  const on = () => !!(root.Update22 && (root.Update22.friends || root.Update22.on)());
  const $ = (s) => document.querySelector(s);
  let count = 0;
  let drop = null;

  function chip() {
    const acct = $('.topbar .account');
    if (!acct || !root.Player || !root.Player.state || !D) return;
    let pic = acct.querySelector('.tb-pic');
    if (!pic) {
      pic = document.createElement('span');
      pic.className = 'tb-pic';
      acct.insertBefore(pic, acct.firstChild);
      const n = document.createElement('i');
      n.className = 'tb-badge';
      n.hidden = true;
      acct.appendChild(n);
    }
    const prof = (root.Player.state.hn && root.Player.state.hn.prof) || {};
    const av = D.UNIT_MAP[prof.av] ? prof.av : 'luke';
    if (pic.dataset.av !== av && root.Art) { pic.dataset.av = av; pic.innerHTML = root.Art.unitArt(D.UNIT_MAP[av]); }
    const b = acct.querySelector('.tb-badge');
    b.hidden = !count;
    b.textContent = count > 9 ? '9+' : String(count || '');
    acct.setAttribute('aria-label', `Commander profile, level ${root.Player.state.account.level}${count ? `, ${count} new` : ''}`);
  }

  // Tap a currency to see its full amount in a small bubble under it.
  const NAMES = { credits: 'Credits', crystals: 'Kyber', aurodium: 'Aurodium Ingots' };
  function tip(cur, e) {
    if (e) e.stopPropagation();
    const k = Object.keys(NAMES).find((n) => cur.classList.contains(n));
    const was = drop && drop.dataset.k;
    close();
    if (!k || was === k || !root.Player || !root.Player.state) return;
    drop = document.createElement('div');
    drop.className = `tb-tip ${k}`;
    drop.dataset.k = k;
    drop.innerHTML = `<span>${NAMES[k]}</span><b>${Number(root.Player.state[k] || 0).toLocaleString('en-US')}</b>`;
    document.body.appendChild(drop);
    const r = cur.getBoundingClientRect();
    const w = drop.offsetWidth;
    drop.style.top = `${Math.round(r.bottom + 8)}px`;
    drop.style.left = `${Math.max(8, Math.min(window.innerWidth - w - 8, Math.round(r.left + r.width / 2 - w / 2)))}px`;
    drop.style.setProperty('--ax', `${Math.round(r.left + r.width / 2 - parseFloat(drop.style.left))}px`);
    setTimeout(() => document.addEventListener('click', close, { once: true }), 0);
  }
  function close() { if (drop) { drop.remove(); drop = null; } }

  function apply() {
    if (!on() || document.body.classList.contains('tb22')) return;
    document.body.classList.add('tb22');
    const w = $('.topbar .wallet');
    if (w && !w.__tb22) {
      w.__tb22 = true;
      w.addEventListener('click', (e) => { const c = e.target.closest('.currency'); if (c) tip(c, e); });
    }
    chip();
  }

  // The red number follows the Friends badge; the chip follows wallet updates.
  function hook() {
    const F = root.Friends;
    if (F && !F.__tb22) {
      F.__tb22 = true;
      const badge = F.badge;
      F.badge = function (n) { count = n || 0; if (on()) chip(); return badge.apply(this, arguments); };
    }
    const ui = U();
    if (ui && !ui.__tb22) {
      ui.__tb22 = true;
      const uw = ui.updateWallet;
      ui.updateWallet = function () { const r = uw.apply(this, arguments); if (on()) { apply(); chip(); } return r; };
    }
  }
  hook();
  apply();
  setInterval(() => { hook(); if (on()) { apply(); chip(); } }, 3000);

  const st = document.createElement('style');
  st.textContent = `.tb22 .topbar .account { position: relative; gap: 6px; padding: 3px 10px 3px 3px; }
.tb22 .topbar .account .acct-bar, .tb22 .topbar .account .acct-who { display: none !important; }
.tb22 .topbar .account .acct-lv { font-size: 0; letter-spacing: 0; } .tb22 .topbar .account .acct-lv b { font-size: 15px; }
.tb-pic { width: 30px; height: 30px; border-radius: 50%; overflow: hidden; border: 2px solid #ffd23f; flex: none; display: block; background: #0b1422; }
.tb-pic svg, .tb-pic img { width: 100%; height: 100%; display: block; }
.tb-badge { position: absolute; top: -5px; right: -6px; min-width: 18px; height: 18px; padding: 0 5px; box-sizing: border-box; border-radius: 9px; background: #ff3b30; color: #fff; font: 800 11px/18px var(--font-display, system-ui); font-style: normal; text-align: center; box-shadow: 0 0 0 2px #0a1220; animation: fr-pop .3s ease-out; }
.tb-badge[hidden] { display: none; }
.tb22 .topbar .wallet .currency { cursor: pointer; }
.tb-tip { position: fixed; z-index: 120; display: grid; gap: 1px; padding: 7px 12px; border-radius: 12px; background: rgba(6, 14, 24, 0.97); border: 1px solid rgba(95, 216, 255, 0.45); box-shadow: 0 10px 24px rgba(0, 0, 0, 0.55); text-align: center; white-space: nowrap; animation: frSug .16s ease-out; }
.tb-tip::before { content: ''; position: absolute; top: -6px; left: calc(var(--ax, 50%) - 5px); width: 10px; height: 10px; background: inherit; border-left: 1px solid rgba(95, 216, 255, 0.45); border-top: 1px solid rgba(95, 216, 255, 0.45); transform: rotate(45deg); }
.tb-tip span { font: 600 11px var(--font-body, system-ui); color: #8fb4c8; letter-spacing: .04em; text-transform: uppercase; }
.tb-tip b { font: 800 16px var(--font-display, system-ui); color: #e8f6ff; font-variant-numeric: tabular-nums; }
.tb-tip.crystals span { color: #8fe8ff; } .tb-tip.aurodium span { color: #ffd23f; }`;
  document.head.appendChild(st);
})(window);
