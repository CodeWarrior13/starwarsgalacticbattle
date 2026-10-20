// Player collections: open someone's HoloNet profile to see Overview,
// Collection, Badges and Stats tabs (their favorite card, strongest cards,
// everything they own, every badge, the full stat sheet).
// Part of update 2.1 (switches on with Update21; __pcTest turns it on for testing).
// Card use is counted from now on, so "favorite card" is ready when it ships.
(function (root) {
  'use strict';
  const on = () => root.__pcTest != null || !!(root.Update21 && root.Update21.on());
  const D = root.GameData;
  const P = () => root.Player;

  // Battles and wins per card, counted after every battle you play.
  const H = root.UI && root.UI.hooks;
  if (H && H.battleEnd && !H.__pc) {
    H.__pc = true;
    H.battleEnd.push((battle, params, won) => {
      if (!battle || !battle.units || (params && params.type === 'tutorial')) return;
      const s = P().state;
      s.use = s.use || {};
      for (const u of battle.units) {
        if (u.side !== 'player' || !u.id) continue;
        const r = s.use[u.id] || (s.use[u.id] = [0, 0]);
        r[0] += 1;
        if (won) r[1] += 1;
      }
      P().save();
    });
  }

  // Compact text for the arena row: "id.level.stars" per card, comma separated.
  function encode() {
    const s = P().state;
    const out = Object.entries(s.units || {}).filter(([id]) => D.UNIT_MAP[id]).map(([id, u]) => `${id}.${u.level}.${u.stars}`);
    const HN = root.HN;
    if (HN && HN.HN_IDS) for (const id of HN.HN_IDS) { const c = HN.card && HN.card(id); if (c && D.UNIT_MAP[id]) out.push(`${id}.${c.level}.${c.stars}`); }
    return out.join(',');
  }
  // The 30 most-used cards: "id.battles.wins".
  function encodeUse() {
    const u = P().state.use || {};
    return Object.entries(u).sort((a, b) => b[1][0] - a[1][0]).slice(0, 30).map(([id, r]) => `${id}.${r[0]}.${r[1]}`).join(',');
  }
  const decode = (str) => {
    const map = {};
    for (const part of String(str || '').split(',')) {
      const [id, a, b] = part.split('.');
      if (id && D.UNIT_MAP[id]) map[id] = { level: +a || 1, stars: +b || 1 };
    }
    return map;
  };
  const decodeUse = (str) => {
    const map = {};
    for (const part of String(str || '').split(',')) {
      const [id, a, b] = part.split('.');
      if (id && D.UNIT_MAP[id]) map[id] = { b: +a || 0, w: +b || 0 };
    }
    return map;
  };
  const mine = () => decode(encode());
  const myUse = () => decodeUse(encodeUse());

  if (typeof document !== 'undefined' && !document.getElementById('pc-css')) {
    const st = document.createElement('style');
    st.id = 'pc-css';
    st.textContent = `.pc-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:4px;border-radius:12px;background:rgba(0,0,0,.25);border:1px solid var(--line);margin:10px 0}
.pc-tabs button{border:0;border-radius:9px;padding:8px 4px;background:transparent;color:var(--muted);font:700 13px/1 var(--font-display,system-ui);cursor:pointer}.pc-tabs button.on{background:#5fd8ff;color:#04121c}
.pc-tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.pc-tiles div{background:rgba(255,255,255,.04);border:1px solid var(--line);border-radius:10px;padding:8px 4px;text-align:center}.pc-tiles b{display:block;font:800 16px/1.1 var(--font-display,system-ui);font-variant-numeric:tabular-nums}.pc-tiles span{font-size:10.5px;color:var(--muted)}
.pc-h{margin:14px 0 6px;font:800 14px/1 var(--font-display,system-ui);letter-spacing:.04em}.pc-h small{font-weight:500;color:var(--muted);margin-left:6px;letter-spacing:0}
.pc-fav{display:grid;grid-template-columns:96px minmax(0,1fr);gap:10px;align-items:center;padding:10px;border-radius:14px;border:1px solid #b070ff;background:linear-gradient(135deg,rgba(176,112,255,.16),rgba(0,0,0,.2))}.pc-fav .pt{border-radius:10px;overflow:hidden}.pc-fav .pt svg{width:100%;display:block}
.pc-fav h4{margin:0;font:800 17px/1.15 var(--font-display,system-ui)}.pc-fav .sub{font-size:12px;color:var(--muted)}.pc-fav .nums{display:flex;gap:6px;margin-top:6px}.pc-fav .nums div{flex:1;text-align:center;border:1px solid var(--line);border-radius:8px;padding:5px 2px}.pc-fav .nums b{display:block;font:800 14px/1 var(--font-display,system-ui)}.pc-fav .nums span{font-size:10px;color:var(--muted)}
.pc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:6px}.pc-grid .ucard{cursor:pointer}.pc-grid .ucard .ucard-body .muted{display:none}
.pc-strong{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px}
.pc-bars{display:grid;gap:5px;padding:10px;border-radius:12px;border:1px solid var(--line);background:rgba(0,0,0,.2)}.pc-bar{display:grid;grid-template-columns:76px 1fr 46px;gap:8px;align-items:center;font-size:12px}.pc-bar i{display:block;height:7px;border-radius:4px;background:#1b2436;overflow:hidden}.pc-bar i b{display:block;height:100%;background:var(--c)}.pc-bar span:last-child{text-align:right;color:var(--muted);font-variant-numeric:tabular-nums}
.pc-total{font:800 20px/1 var(--font-display,system-ui)}.pc-total small{font-size:13px;color:var(--muted);font-weight:500}
.pc-chips{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.pc-chips button{border:1px solid var(--line);background:transparent;color:var(--muted);border-radius:999px;padding:6px 11px;font:700 12px/1 var(--font-display,system-ui);cursor:pointer}.pc-chips button.on{background:#5fd8ff;border-color:#5fd8ff;color:#04121c}
.pc-badges{display:grid;grid-template-columns:repeat(auto-fill,minmax(74px,1fr));gap:8px}.pc-badges button{background:none;border:0;color:inherit;display:grid;justify-items:center;gap:3px;cursor:pointer;font-size:10.5px;text-align:center}.pc-badges svg{width:48px;height:48px}
.pc-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.pc-stats div{border:1px solid var(--line);border-radius:10px;padding:8px 10px;background:rgba(255,255,255,.03)}.pc-stats span{display:block;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}.pc-stats b{font:800 16px/1.2 var(--font-display,system-ui);font-variant-numeric:tabular-nums}
.pc-cmp{margin-top:10px;padding:10px;border-radius:12px;border:1px solid #5fd8ff;background:rgba(95,216,255,.07)}.pc-cmp h4{margin:0 0 6px;font:800 15px/1.1 var(--font-display,system-ui)}.pc-cmp table{width:100%;border-collapse:collapse;font-size:12.5px;font-variant-numeric:tabular-nums}.pc-cmp th,.pc-cmp td{padding:4px;text-align:center;border-top:1px solid var(--line)}.pc-cmp th:first-child,.pc-cmp td:first-child{text-align:left;color:var(--muted)}
.pc-empty{color:var(--muted);font-size:13px;margin:4px 0}
@media (max-width:420px){.pc-tiles{grid-template-columns:repeat(2,minmax(0,1fr))}.pc-strong{grid-template-columns:repeat(3,minmax(0,1fr))}}`;
    document.head.appendChild(st);
  }

  root.PlayerCollections = { on, encode, encodeUse, decode, decodeUse, mine, myUse };
})(typeof window !== 'undefined' ? window : globalThis);
