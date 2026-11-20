// Update 2.5: the 29 badges. Each one climbs Silver → Gold → Beskar → Kyber
// (shorter badges skip steps; holiday badges have their own medal). The badge
// sheet shows them all; tap one for its steps and rewards, and Pin it to keep
// it in the corner: a small medal that spins once and slides out its progress
// when tapped, at the bottom left at home and the top left in battle. When a
// step is reached the corner medal spins up to the new tier and pays out.
// Progress and rewards live in js/col25.js; the medal drawings load only when
// first needed (js/badges25-art.js). Off until 2.5 ships.
(function (root) {
  'use strict';
  if (!(root.Update25 && root.Update25.on())) return;
  const UI = root.UI; const Player = root.Player; const D = root.GameData;
  const C = () => root.Col25;
  if (!UI || !Player || !D || !C()) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => Number(n || 0).toLocaleString('en-US');
  const save = () => { try { Player.save(); } catch (e) { /* storage blocked */ } };
  const B = () => C().B();
  const BADGES = () => C().BADGES;
  const byId = (id) => BADGES().find((b) => b[0] === id);
  const TNAME = { 1: 'Silver', 2: 'Gold', 3: 'Beskar', 4: 'Kyber' };
  const TCOL = { 1: '#dfe6ee', 2: '#ffd23f', 3: '#a8bcd4', 4: '#7cd0ff' };
  const tiersFor = (n) => ({ 1: [2], 2: [2, 4], 3: [1, 2, 4], 4: [1, 2, 3, 4] }[n]);
  const holiday = (b) => ['lifeday', 'harvest', 'easter', 'endor'].includes(b[0]);
  const stepName = (b, i) => (holiday(b) ? 'Holiday' : TNAME[tiersFor(b[2].length)[i]]);

  // ---------- The drawings (loaded once, when first needed) ----------
  let art = root.BD25ART || null; let loading = null;
  const loadArt = () => {
    if (art) return Promise.resolve(art);
    if (loading) return loading;
    loading = new Promise((res) => {
      const s = document.createElement('script');
      s.src = root.__ver ? root.__ver('js/badges25-art.js') : 'js/badges25-art.js';
      s.onload = () => { art = root.BD25ART || null; res(art); };
      s.onerror = () => { loading = null; res(null); };
      document.head.appendChild(s);
    });
    return loading;
  };
  const medal = (id, i, locked) => { const m = art && art.MED[id] && art.MED[id][Math.max(0, i)]; return m ? `<span class="bd-med${locked ? ' lock' : ''}">${m}</span>` : '<span class="bd-med blank"></span>'; };
  const chips = (id, i) => {
    const h = art && art.RW[id] ? art.RW[id][i] || '' : '';
    return h.replace(/@PF:(\w+)@/g, (m, pid) => (D.UNIT_MAP[pid] && root.Art ? root.Art.unitArt(D.UNIT_MAP[pid]) : ''));
  };

  // ---------- Progress ----------
  const stepProg = (b, i) => { const p = C().prog(b[2][i][1]); return Array.isArray(p) ? { have: Math.min(p[0], p[1]), need: p[1], done: p[0] >= p[1] } : { have: p ? 1 : 0, need: 1, done: !!p, flag: true }; };
  const tier = (b) => C().tierOf(b);
  const next = (b) => { const t = tier(b); return t >= b[2].length ? null : { i: t, ...stepProg(b, t) }; };
  // The badge in the corner: the one you pinned, or else the one closest to its next step.
  const pinned = () => {
    const id = B().pin; const b = id && byId(id);
    if (b) return b;
    let best = null; let bp = -1;
    for (const x of BADGES()) { if (holiday(x)) continue; const n = next(x); if (!n || n.flag) continue; const r = n.have / n.need; if (r > bp && r < 1) { bp = r; best = x; } }
    return best || byId('rookie');
  };

  // ---------- The badge sheet ----------
  async function sheet(focus) {
    await loadArt();
    const L = BADGES();
    const done = L.reduce((a, b) => a + tier(b), 0); const all = L.reduce((a, b) => a + b[2].length, 0);
    const m = UI.openModal(`<div class="bd" role="dialog" aria-label="Badges"><div class="bd-head"><div><h2>Badges</h2><p class="muted small">${fmt(done)} / ${fmt(all)} steps · tap a badge for its steps and rewards</p></div><button type="button" class="btn btn-small" data-bdx>Close</button></div>
      <div class="bd-wall">${L.map((b) => { const t = tier(b); const n = next(b); return `<button type="button" class="bd-cell${t ? '' : ' none'}${B().pin === b[0] ? ' pin' : ''}" data-bd="${b[0]}">${medal(b[0], t ? t - 1 : 0, !t)}<b>${esc(b[1])}</b><small>${t ? stepName(b, t - 1) + (b[2].length > 1 ? ` · ${t}/${b[2].length}` : '') : holiday(b) ? 'Holiday' : 'Not started'}</small>${n && !n.flag ? `<i class="bd-bar"><u style="width:${Math.round((n.have / n.need) * 100)}%"></u></i>` : ''}</button>`; }).join('')}${root.Max25 ? root.Max25.cell() : ''}</div></div>`, { wide: true });
    m.root.addEventListener('click', (e) => {
      if (e.target.closest('[data-bdx]')) { m.close(); return; }
      if (e.target.closest('[data-mx]') && root.Max25) { root.Max25.detail(); return; }
      const c = e.target.closest('[data-bd]'); if (c) detail(c.dataset.bd, () => { m.close(); sheet(); });
    });
    if (focus) detail(focus, () => { m.close(); sheet(); });
  }
  // One badge: the medal with a ring for the next step, every step with its rewards, Pin and Close.
  async function detail(id, onChange) {
    await loadArt();
    const b = byId(id); if (!b) return;
    const t = tier(b); const n = next(b);
    const pct = n ? (n.flag ? 0 : n.have / n.need) : 1;
    const R0 = 64; const CIRC = 2 * Math.PI * R0;
    const ring = `<svg class="bd-ring" viewBox="0 0 140 140" aria-hidden="true"><circle cx="70" cy="70" r="${R0}" fill="none" stroke="#1a2438" stroke-width="5"/><circle cx="70" cy="70" r="${R0}" fill="none" stroke="${n ? '#2ad84a' : '#ffd23f'}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(CIRC * pct).toFixed(1)} ${CIRC.toFixed(1)}" transform="rotate(-90 70 70)"/></svg>`;
    const isPin = B().pin === id;
    const steps = b[2].map(([req], i) => { const p = stepProg(b, i); const ok = i < t; return `<div class="bd-step${ok ? ' ok' : i === t ? ' now' : ''}"><span class="bd-st">${medal(id, i, !ok)}<em>${stepName(b, i)}</em></span><div><p>${esc(req)}${ok ? ' <b class="bd-tick">✓</b>' : !p.flag && i === t ? ` <span class="bd-pg">${fmt(p.have)} / ${fmt(p.need)}</span>` : ''}</p><div class="bd-rws">${chips(id, i)}</div></div></div>`; }).join('');
    const m = UI.openModal(`<div class="bd bd-one"><div class="bd-top"><div class="bd-big">${ring}${medal(id, t ? t - 1 : 0, !t)}</div><div class="bd-info"><h2>${esc(b[1])}</h2>
      ${n ? `<p class="bd-req">${esc(b[2][n.i][0])}</p>${n.flag ? '' : `<div class="bd-prog"><u style="width:${Math.round(pct * 100)}%"></u><span>${fmt(n.have)} / ${fmt(n.need)}</span></div>`}<p class="muted small">Next: ${stepName(b, n.i)}</p>` : '<p class="bd-req">Complete. Every step earned.</p>'}
      <div class="bd-btns"><button type="button" class="bd-pinb${isPin ? ' on' : ''}" data-pin>${isPin ? '📌 Pinned' : '📌 Pin'}</button><button type="button" class="btn btn-small" data-close>Close</button></div></div></div>
      <div class="bd-steps">${steps}</div></div>`, { wide: true });
    m.root.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) { m.close(); return; }
      if (e.target.closest('[data-pin]')) { B().pin = isPin ? null : id; save(); m.close(); tracker(true); UI.toast(isPin ? 'Unpinned.' : `${b[1]} pinned to the corner.`); if (onChange) onChange(); }
    });
  }

  // ---------- The corner tracker ----------
  // Home: bottom left. Battle: top left. Folded it's just the medal; tap it to spin and slide out the box.
  let trk = null;
  const trkHtml = (b) => { const t = tier(b); const n = next(b); return `<button type="button" class="bd-tm" aria-label="${esc(b[1])} badge">${medal(b[0], t ? t - 1 : 0, !t)}${n && !n.flag ? `<i class="bd-cnt">${fmt(n.have)}</i>` : ''}</button><button type="button" class="bd-tbox" tabindex="-1"><b>${esc(b[1])}</b><small>${n ? esc(b[2][n.i][0]) : 'Complete'}</small>${n && !n.flag ? `<i class="bd-bar"><u style="width:${Math.round((n.have / n.need) * 100)}%"></u></i><em>${stepName(b, n.i)} · ${fmt(n.have)} / ${fmt(n.need)}</em>` : ''}</button>`; };
  const where = () => { const A = UI.App; if (A && A.battleActive) return 'battle'; return A && A.current === 'home' ? 'home' : null; };
  async function tracker(force) {
    const w = where();
    if (!w || !Player.state || (Player.tutorialPending && Player.tutorialPending())) { if (trk) { trk.remove(); trk = null; } return; }
    await loadArt();
    const b = pinned(); if (!b) return;
    const key = `${w}|${b[0]}|${tier(b)}|${(next(b) || {}).have}`;
    if (trk && trk.dataset.key === key && !force && document.body.contains(trk)) return;
    // In battle it sits inside the battlefield's top-left corner; at home it floats over the page.
    const map = w === 'home' ? document.querySelector('.home-galaxy') : null;
    const host = w === 'battle' ? document.querySelector('[data-field]') : map || document.body; if (!host) return;
    if (!trk || !document.body.contains(trk) || trk.parentNode !== host) { if (trk) trk.remove(); trk = document.createElement('div'); trk.className = 'bd-trk'; host.appendChild(trk); trk.addEventListener('click', onTrk); }
    const open = trk.classList.contains('open');
    trk.dataset.key = key; trk.dataset.id = b[0];
    trk.className = `bd-trk at-${w}${map ? ' inmap' : ''}${open ? ' open' : ''}`;
    // At home it tucks under the map's title (under the mode buttons on a phone), clear of the planets.
    trk.innerHTML = trkHtml(b);
  }
  function onTrk(e) {
    if (e.target.closest('.bd-tbox')) { trk.classList.remove('open'); if (!(UI.App && UI.App.battleActive)) sheet(trk.dataset.id); return; }
    if (e.target.closest('.bd-tm')) { const m = trk.querySelector('.bd-med'); if (m && !trk.classList.contains('open')) { m.classList.remove('spin'); void m.offsetWidth; m.classList.add('spin'); } trk.classList.toggle('open'); }
  }

  // ---------- Reaching a step ----------
  // Kyber rewards are paid here; everything else unlocks by itself from the same progress.
  const pay = (b, i) => { let ky = 0; for (const [k, v] of b[2][i][2]) if (k === 'ky') ky += v | 0; if (ky) { Player.state.crystals = (Player.state.crystals || 0) + ky; if (UI.updateWallet) UI.updateWallet(); } return ky; };
  let first = true;
  function check() {
    if (!Player.state || (Player.tutorialPending && Player.tutorialPending())) return;
    const seen = B().seen || (B().seen = {});
    const ups = [];
    for (const b of BADGES()) { const t = tier(b); const s = seen[b[0]] | 0; if (t > s) { let ky = 0; for (let i = s; i < t; i++) ky += pay(b, i); seen[b[0]] = t; ups.push([b, t, ky]); } }
    if (!ups.length) { first = false; return; }
    save();
    // The first look after the update catches up quietly; after that each step gets its moment.
    if (first && !B().init) { B().init = 1; save(); first = false; const ky = ups.reduce((a, u) => a + u[2], 0); if (ky) UI.toast(`Badges caught up: +${fmt(ky)} Kyber.`); tracker(true); return; }
    first = false; B().init = 1;
    // One message per badge that went up (at most three), and the corner medal spins if it's one of them.
    ups.slice(-3).forEach(([b, t, ky], i) => setTimeout(() => UI.toast(`Badge up! ${b[1]} · ${stepName(b, t - 1)}${ky ? ` · +${fmt(ky)} Kyber` : ''}`), i * 900));
    const pin = pinned(); const mine = ups.find((u) => pin && u[0][0] === pin[0]);
    if (mine) tierUp(mine[0], mine[1]);
  }
  // The corner medal spins up to its new tier.
  async function tierUp(b, t) {
    B().pin = B().pin || null;
    await tracker(true);
    if (!trk || trk.dataset.id !== b[0]) return;
    const m = trk.querySelector('.bd-med'); if (!m) return;
    m.innerHTML = (art.MED[b[0]][Math.max(0, t - 2)] || '');
    trk.classList.add('up');
    m.classList.remove('spinup'); void m.offsetWidth; m.classList.add('spinup');
    setTimeout(() => { m.innerHTML = art.MED[b[0]][t - 1]; }, 450);
    setTimeout(() => { if (trk) trk.classList.remove('up'); }, 1600);
  }

  // ---------- Hooks ----------
  const A = UI.App;
  if (A && !A.__bd25) { A.__bd25 = true; const go = A.go.bind(A); A.go = function (...a) { const r = go(...a); setTimeout(() => { try { tracker(); } catch (e) { /* ignore */ } }, 60); return r; }; }
  if (UI.hooks && UI.hooks.battleEnd) UI.hooks.battleEnd.push(() => setTimeout(() => { try { check(); tracker(true); } catch (e) { /* ignore */ } }, 1200));
  const boot = () => { if (!Player.state) return setTimeout(boot, 400); try { check(); tracker(); } catch (e) { /* ignore */ } };
  setTimeout(boot, 3000);
  setInterval(() => { try { if (!(A && A.battleActive)) check(); tracker(); } catch (e) { /* ignore */ } }, 5000);

  // ---------- Styles ----------
  const st = document.createElement('style');
  st.textContent = `.bd{display:grid;gap:12px}.bd-head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}.bd-head h2{margin:0}.bd-head p{margin:2px 0 0}
.bd-wall{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px}
.bd-cell{display:grid;justify-items:center;gap:2px;padding:8px 4px 10px;border-radius:12px;border:1px solid #1e2a40;background:#0b1020;color:#fff;cursor:pointer;text-align:center}.bd-cell:hover{border-color:#3a4a6a}.bd-cell.pin{border-color:#ffd23f}
.bd-cell b{font:800 12px var(--font-display,Oxanium,sans-serif);line-height:1.2}.bd-cell small{font-size:11px;color:#9aa4ae}
.bd-med{display:block;width:84px;height:84px}.bd-med svg{width:100%;height:100%;display:block}.bd-med.lock{filter:grayscale(1) brightness(.45)}.bd-med.blank{border-radius:50%;background:#141c2c}.bd-tm .bd-med svg{overflow:hidden;border-radius:50%}
.bd-trk.at-home.inmap{position:absolute;bottom:auto;z-index:4;top:92px;left:28px}@media (max-width:720px){.bd-trk.at-home.inmap{top:56px;left:10px;bottom:auto}}
.bd-bar{display:block;width:80%;height:4px;border-radius:2px;background:#1a2438;overflow:hidden;margin-top:3px}.bd-bar u{display:block;height:100%;background:#ffd23f}
.bd-one{max-width:640px}.bd-top{display:flex;gap:16px;align-items:center}.bd-big{position:relative;flex:0 0 140px;width:140px;height:140px}.bd-big .bd-ring{position:absolute;inset:0;width:100%;height:100%}.bd-big .bd-med{position:absolute;left:18px;top:18px;width:104px;height:104px}
.bd-info{flex:1;min-width:0;display:grid;gap:6px}.bd-info h2{margin:0}.bd-req{margin:0;color:#c8d0dc}.bd-prog{position:relative;height:16px;border-radius:8px;background:#1a2438;overflow:hidden}.bd-prog u{display:block;height:100%;background:linear-gradient(90deg,#1f8a3a,#2ad84a)}.bd-prog span{position:absolute;left:8px;top:0;font:800 10px/16px var(--font-display,Oxanium,sans-serif);color:#fff}
.bd-btns{display:flex;gap:8px}.bd-pinb{font:800 12px var(--font-display,Oxanium,sans-serif);color:#ffd23f;background:#0b1020;border:1px solid #ffd23f;border-radius:10px;padding:6px 12px;cursor:pointer}.bd-pinb.on{background:#ffd23f;color:#1a1200}
.bd-steps{display:grid;gap:0;border-top:1px dashed #2a3550}.bd-step{display:flex;gap:12px;padding:8px 2px;border-bottom:1px dashed #2a3550;align-items:flex-start}.bd-st{display:grid;justify-items:center;flex:0 0 58px}.bd-st .bd-med{width:52px;height:52px}.bd-st em{font:800 10px var(--font-display,Oxanium,sans-serif);font-style:normal;letter-spacing:.06em;color:#9aa4ae}
.bd-step p{margin:2px 0 6px}.bd-step.ok p{color:#9affb0}.bd-tick{color:#2ad84a}.bd-pg{font:800 11px var(--font-display,Oxanium,sans-serif);color:#ffd23f}.bd-rws{display:flex;flex-wrap:wrap;gap:6px}
.bd-rw{display:flex;align-items:center;gap:6px;padding:4px 8px 4px 4px;border:1px solid #2a3550;border-radius:8px;background:#0b1020}.bd-rw i{flex:0 0 46px;width:46px;height:29px;display:block;border-radius:6px;overflow:hidden}.bd-rw i svg{width:100%;height:100%;display:block}.bd-rw b{font:800 11px var(--font-display,Oxanium,sans-serif);display:block}.bd-rw small{font-size:10px;color:#9aa4ae;display:block}.bd-rw span{display:grid}
.bd-trk{position:fixed;z-index:60;display:flex;align-items:center;gap:0;pointer-events:none}.bd-trk>*{pointer-events:auto}
.bd-trk.at-home{left:14px;bottom:calc(14px + env(safe-area-inset-bottom))}.bd-trk.at-battle{position:absolute;left:10px;top:10px;z-index:8}.bd-trk.at-battle .bd-tm{width:44px;height:44px}
@media (max-width:720px){.bd-trk.at-home{bottom:calc(86px + env(safe-area-inset-bottom))}}
.bd-tm{position:relative;width:52px;height:52px;border-radius:50%;border:1px solid #2a3550;background:radial-gradient(circle,#121a2e,#070b16);padding:4px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.5)}.bd-tm .bd-med{width:100%;height:100%}
.bd-cnt{position:absolute;right:-6px;bottom:-2px;font:800 9px var(--font-display,Oxanium,sans-serif);font-style:normal;color:#1a1200;background:#ffd23f;border-radius:999px;padding:1px 5px}
.bd-tbox{display:grid;gap:2px;text-align:left;min-width:0;max-width:0;overflow:hidden;opacity:0;margin-left:-8px;padding:0;border:1px solid transparent;border-radius:0 26px 26px 0;background:#0b1020;color:#fff;cursor:pointer;transition:max-width .35s cubic-bezier(.3,.7,.3,1),opacity .25s,padding .35s;white-space:nowrap}
.bd-trk.open .bd-tbox{max-width:260px;opacity:1;padding:6px 16px 6px 16px;border-color:#2a3550}
.bd-tbox b{font:800 12px var(--font-display,Oxanium,sans-serif)}.bd-tbox small{font-size:10.5px;color:#9aa4ae;overflow:hidden;text-overflow:ellipsis}.bd-tbox em{font:800 10px var(--font-display,Oxanium,sans-serif);font-style:normal;color:#ffd23f}.bd-tbox .bd-bar{width:200px}
.bd-med.spin{animation:bdSpin .6s cubic-bezier(.3,.7,.3,1)}@keyframes bdSpin{to{transform:rotateY(360deg)}}
.bd-med.spinup{animation:bdUp .9s cubic-bezier(.3,.7,.3,1)}@keyframes bdUp{0%{transform:scale(1) rotateY(0)}50%{transform:scale(1.35) rotateY(540deg)}100%{transform:scale(1) rotateY(720deg)}}
.bd-trk.up .bd-tm{box-shadow:0 0 0 2px #ffd23f,0 0 24px #ffd23f}
@media (prefers-reduced-motion:reduce){.bd-med.spin,.bd-med.spinup{animation:none}.bd-tbox{transition:none}}`;
  document.head.appendChild(st);
  root.Badges25 = { sheet, detail, tracker, check, loadArt };
})(window);
