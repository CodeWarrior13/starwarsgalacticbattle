// Update 2.5 "Cosmetic": favourite squads, exact friend activity and rank polish.
//  - Favourite squads: save up to 6 squads (Ground or Fleet) with a name, an
//    emblem and a colour, swap to one with a tap, star your favourite to keep
//    it on top. They sit at the top of the squad screen.
//  - Friends see exactly what you're doing: "Raid · Darth Vader", "Fleet raid ·
//    Star Destroyer", "Duel vs Coleman" (with their picture and frame),
//    "Campaign · Hoth, stage 7", "Casino · Pazaak". Each kind has its colour.
//  - Guild ranks: the leader's gold name shimmers and chat bubbles carry a thin
//    edge in the sender's rank colour.
// Off until 2.5 ships (Update25.on()).
(function (root) {
  'use strict';
  const UI = root.UI;
  const Player = root.Player;
  const D = root.GameData;
  if (!UI || !Player || !D) return;
  const on = () => !!(root.Update25 && root.Update25.on());
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- Friend activity, in detail ----------
  const FA = root.FriendActivity;
  if (FA && !FA.__25) {
    FA.__25 = true;
    let last = null;
    if (root.BattleUI && root.BattleUI.start) {
      const start = root.BattleUI.start.bind(root.BattleUI);
      root.BattleUI.start = function (params) { last = params || null; return start(params); };
    }
    const HNs = () => root.HN;
    if (HNs() && HNs().hnStart) wrapHN(); else { let k = 0; const t = setInterval(() => { if ((HNs() && HNs().hnStart && wrapHN()) || ++k > 120) clearInterval(t); }, 1000); }
    function wrapHN() {
      const H = HNs(); if (H.hnStart.__a25) return true;
      const base = H.hnStart;
      const w = function (params) { last = params || null; FA.nudge(); return base.apply(this, arguments); };
      w.__a25 = true; w.__fx25 = base.__fx25; H.hnStart = w; return true;
    }
    const code = FA.code;
    FA.code = function () {
      const c = code();
      if (!on() || !c || FA.hidden()) return c;
      try {
        const App = UI.App;
        const p = last || {};
        if ((c === 'raid') && p.boss) return 'raid~' + String(p.boss).slice(0, 24);
        if (c === 'arena' && p.hn === 'graid' && p.boss) return 'raid~' + String(p.boss).slice(0, 24);
        if (c === 'duel' || c === 'fduel' || c === 'wager') {
          const Dl = HNs() && HNs().Duel; const m = Dl && (Dl.match || Dl.prep);
          const peer = m && Dl.peers && Dl.peers.find((x) => x.presence && x.presence.nm === m.name);
          return c + '~' + (peer && peer.by ? String(peer.by).slice(0, 40) : '') + '~' + String((m && m.name) || '').slice(0, 16);
        }
        if ((c === 'camp' || c === 'fleet') && App.battleActive && p.planet && D.PLANET_MAP[p.planet]) return c + '~' + p.planet + '~' + ((p.stage | 0) + 1);
        if (c === 'market' && App.ui.shop25 === 'casino') { const t = document.querySelector('.cz-tabs .on'); return 'cas~' + (t ? t.dataset.cz : ''); }
      } catch (e) { /* plain code */ }
      return c;
    };
    const baseLabel = FA.label;
    const COL = { raid: '#ff5a6a', duel: '#ffd23f', fduel: '#7affc8', wager: '#ffb43a', camp: '#bfe0ff', fleet: '#8fe8ff', cas: '#7affc8' };
    const nameOf = (id) => { const H = HNs(); const r = H && H.RAIDS && H.RAIDS.find((x) => x.id === id); if (r) return r.name; const u = D.UNIT_MAP[id]; return u ? u.name : 'a boss'; };
    const kindOf = (id) => { const u = D.UNIT_MAP[id]; return u && u.kind === 'ship' ? 'Fleet raid' : 'Raid'; };
    function parse(c) {
      const [k, a, b] = String(c || '').split('~');
      if (!a && k !== 'cas') return null;
      if (k === 'raid') return { k, t: `${kindOf(a)} · ${nameOf(a)}` };
      if (k === 'duel' || k === 'fduel' || k === 'wager') { const H = HNs(); const nm = b || (a && H && H.Net && H.Net.name ? H.Net.name(a) : 'a pilot'); return { k, t: `${k === 'fduel' ? 'Friendly battle' : k === 'wager' ? 'Wager duel' : 'Duel'} vs ${nm}`, uid: a }; }
      if (k === 'camp' || k === 'fleet') { const pl = D.PLANET_MAP[a]; return { k, t: `${k === 'fleet' ? 'Fleet' : 'Campaign'} · ${pl ? pl.name : a}, stage ${b}` }; }
      if (k === 'cas') return { k, t: `Casino · ${{ hc: 'Holo-Chess', pr: 'Podrace Bets', pz: 'Pazaak' }[a] || 'Watto\'s tables'}` };
      return null;
    }
    FA.label = function (c) { const p = on() ? parse(c) : null; return p ? p.t : baseLabel(String(c || '').split('~')[0]); };
    FA.rich = function (c) {
      if (!on()) return '';
      const p = parse(c); if (!p) return '';
      const H = HNs();
      const pic = p.uid && H && H.avatarFor ? `<span class="fa25-op">${H.avatarFor(p.uid)}</span>` : '';
      return `<span class="fa25" style="color:${COL[p.k] || '#bfe0ff'}">● ${esc(p.t)}</span>${pic}`;
    };
  }

  // ---------- Favourite squads ----------
  const ICONS = ['★', '◆', '▲', '●', '✦', '⬢', '♛', '✚', '⚔', '☄', '♜', '✈', '☀', '☾', '❖', '✪'];
  const COLORS = ['#ffd23f', '#ff5a6a', '#8fe8ff', '#7affc8', '#c89aff', '#ff9a3a', '#5ab4ff', '#e6eef6'];
  const SLOTS = 6;
  const favs = () => { const s = Player.state; if (!Array.isArray(s.fav25)) s.fav25 = []; return s.fav25; };
  const power = (ids, kind) => ids.reduce((a, id) => { const u = Player.state.units[id]; const d = D.UNIT_MAP[id]; return a + (u && d && D.power ? D.power(d, u.level, u.stars) : 0); }, 0);
  function panel(kind) {
    const list = favs().map((f, i) => ({ ...f, i })).filter((f) => f.kind === kind).sort((a, b) => (b.star | 0) - (a.star | 0));
    const used = favs().length;
    const row = (f) => { const ok = f.ids.every((id) => Player.owns(id)); return `<div class="fs25 ${f.star ? 'fav' : ''} ${ok ? '' : 'bad'}"><span class="fs25-ic" style="--c:${f.c}">${esc(f.ic)}</span><div class="fs25-t"><b>${esc(f.n)}${f.star ? ' <em>FAVOURITE</em>' : ''}</b><small>${kind === 'ship' ? 'Fleet' : 'Ground'} · Power ${Math.round(power(f.ids, kind)).toLocaleString('en-US')}${ok ? '' : ' · a card is missing'}</small></div><span class="fs25-team">${f.ids.slice(0, 6).map((id) => `<span>${root.Art && D.UNIT_MAP[id] ? root.Art.unitArt(D.UNIT_MAP[id]) : ''}</span>`).join('')}</span><span class="fs25-b"><button type="button" class="btn btn-small btn-primary" data-fs-use="${f.i}" ${ok ? '' : 'disabled'}>Use</button><button type="button" class="btn btn-small" data-fs-edit="${f.i}">Edit</button></span></div>`; };
    return `<section class="fs25-wrap"><div class="fs25-head"><h3>Favourite squads</h3><span class="muted small">${used} / ${SLOTS} saved</span></div>${list.map(row).join('')}${used < SLOTS ? '<button type="button" class="fs25-add" data-fs-save><b>+</b> Save this squad</button>' : ''}</section>`;
  }
  function edit(i, kind, back) {
    const isNew = i == null;
    const f = isNew ? { n: kind === 'ship' ? 'My Fleet' : 'My Squad', ic: ICONS[favs().length % ICONS.length], c: COLORS[favs().length % COLORS.length], kind, ids: Player.state.squads[kind].filter((id) => Player.owns(id)), star: false } : { ...favs()[i] };
    const m = UI.openModal(`<div class="fs25-ed"><h2>${isNew ? 'Save squad' : 'Edit squad'}</h2>
      <label class="fs25-lbl">Name<input class="pf-in" data-n maxlength="20" value="${esc(f.n)}"></label>
      <p class="fs25-lbl">Emblem</p><div class="fs25-pick" data-ics>${ICONS.map((x) => `<button type="button" data-ic="${x}" class="${x === f.ic ? 'on' : ''}">${x}</button>`).join('')}</div>
      <p class="fs25-lbl">Colour</p><div class="fs25-pick" data-cs>${COLORS.map((x) => `<button type="button" data-c="${x}" class="sw ${x === f.c ? 'on' : ''}" style="background:${x}" aria-label="Colour"></button>`).join('')}</div>
      <label class="switch"><input type="checkbox" data-star ${f.star ? 'checked' : ''}><i></i> Favourite (keeps it on top)</label>
      ${isNew ? '' : '<label class="switch"><input type="checkbox" data-resave><i></i> Replace its cards with my current squad</label>'}
      <div class="modal-actions">${isNew ? '' : '<button type="button" class="btn" data-del>Delete</button>'}<button type="button" class="btn" data-x>Cancel</button><button type="button" class="btn btn-primary" data-ok>Save</button></div></div>`);
    const R = m.root;
    R.addEventListener('click', (e) => {
      const ic = e.target.closest('[data-ic]'); if (ic) { f.ic = ic.dataset.ic; R.querySelectorAll('[data-ic]').forEach((b) => b.classList.toggle('on', b === ic)); return; }
      const c = e.target.closest('[data-c]'); if (c) { f.c = c.dataset.c; R.querySelectorAll('[data-c]').forEach((b) => b.classList.toggle('on', b === c)); return; }
      if (e.target.closest('[data-x]')) return m.close();
      if (e.target.closest('[data-del]')) { favs().splice(i, 1); Player.save(); m.close(); back(); return; }
      if (e.target.closest('[data-ok]')) {
        f.n = (R.querySelector('[data-n]').value || '').trim().slice(0, 20) || f.n;
        f.star = R.querySelector('[data-star]').checked;
        if (!isNew && R.querySelector('[data-resave]').checked) f.ids = Player.state.squads[kind].filter((id) => Player.owns(id));
        if (!f.ids.length) { UI.toast('Pick at least one card for this squad first.'); return; }
        if (f.star) favs().forEach((x) => { if (x.kind === kind) x.star = false; });
        if (isNew) favs().push(f); else favs()[i] = f;
        Player.save(); m.close(); UI.toast(`${f.n} saved.`); back();
      }
    });
  }
  const sq = UI.Screens && UI.Screens.squad;
  if (sq && !UI.Screens.__fs25) {
    UI.Screens.__fs25 = true;
    UI.Screens.squad = function (params) {
      const v = sq.apply(this, arguments);
      if (!on() || !v || !v.querySelector) return v;
      try {
        const kind = Player.encounter(params).kind;
        const head = v.querySelector('.view-head');
        const wrap = document.createElement('div');
        wrap.innerHTML = panel(kind);
        const sec = wrap.firstElementChild;
        if (head) head.after(sec); else v.prepend(sec);
        sec.addEventListener('click', (e) => {
          const u = e.target.closest('[data-fs-use]');
          if (u) { const f = favs()[+u.dataset.fsUse]; if (!f) return; Player.setSquad(kind, f.ids.filter((id) => Player.owns(id) && D.UNIT_MAP[id].kind === kind)); UI.toast(`${f.n} is your squad.`); UI.App.refresh(); return; }
          const ed = e.target.closest('[data-fs-edit]'); if (ed) return edit(+ed.dataset.fsEdit, kind, () => UI.App.refresh());
          if (e.target.closest('[data-fs-save]')) return edit(null, kind, () => UI.App.refresh());
        });
      } catch (e) { /* the squad screen works without it */ }
      return v;
    };
  }
  root.FavSquads25 = { favs, panel };

  if (typeof document !== 'undefined' && !document.getElementById('s25s-css')) {
    const s = document.createElement('style');
    s.id = 's25s-css';
    s.textContent = `.fa25{font-weight:700}.fa25-op{display:inline-block;vertical-align:middle;margin-left:6px;transform:scale(.8);transform-origin:left center}
.rk25-leader{background:linear-gradient(90deg,#ffd23f,#fff3b0,#ffd23f);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent!important;animation:rk25 3.2s linear infinite}.rk25-leader .g-rk{color:#ffd23f}@keyframes rk25{to{background-position:-200% 0}}
.g-chat .msg[data-rk]>p{box-shadow:inset 3px 0 0 var(--rk)}.g-chat .msg[data-rk="leader"]>p{box-shadow:inset 3px 0 0 var(--rk),0 0 10px rgba(255,210,63,.12)}
body.perf-lite .rk25-leader{animation:none;background:none;color:#ffd23f!important}
.fs25-wrap{display:grid;gap:8px;margin:10px 0 14px;padding:12px;border-radius:14px;background:var(--panel);border:1px solid var(--line)}.fs25-head{display:flex;justify-content:space-between;align-items:baseline;gap:8px}.fs25-head h3{margin:0;font:800 15px var(--font-display);letter-spacing:.06em}
.fs25{display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;gap:10px;align-items:center;padding:8px 10px;border-radius:12px;background:var(--panel-2);border:1px solid var(--line)}.fs25.fav{border-color:#ffd23f;box-shadow:inset 0 0 0 1px rgba(255,210,63,.4)}.fs25.bad{border-color:#ff5a6a}
.fs25-ic{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-size:20px;color:var(--c);background:color-mix(in srgb,var(--c) 16%,#0a1018);box-shadow:inset 0 0 0 1.5px var(--c)}
.fs25-t{display:grid;min-width:0}.fs25-t b{font:800 14px var(--font-display);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fs25-t em{font-style:normal;font-size:10px;color:#ffd23f;letter-spacing:.1em;margin-left:4px}.fs25-t small{font-size:12px;color:var(--muted)}
.fs25-team{display:flex;gap:3px}.fs25-team span{width:34px;height:34px;border-radius:8px;overflow:hidden;background:#0c2030;display:block}.fs25-team svg{width:100%;height:100%;display:block}.fs25-b{display:flex;gap:6px}
.fs25-add{padding:10px;border-radius:12px;border:1.5px dashed var(--line);background:transparent;color:var(--muted);font:700 14px var(--font-display);cursor:pointer}.fs25-add b{color:var(--crawl)}
.fs25-ed{display:grid;gap:8px;min-width:min(420px,86vw)}.fs25-lbl{display:grid;gap:4px;margin:4px 0 0;font:700 12px var(--font-display);letter-spacing:.08em;color:var(--muted);text-transform:uppercase}.fs25-pick{display:flex;gap:6px;flex-wrap:wrap}.fs25-pick button{width:36px;height:36px;border-radius:10px;border:1px solid var(--line);background:var(--panel-2);color:var(--text);font-size:17px;cursor:pointer}.fs25-pick button.on{outline:2px solid var(--crawl);outline-offset:2px}
@media (max-width:640px){.fs25{grid-template-columns:auto minmax(0,1fr) auto}.fs25-team{grid-column:1/-1;order:3}.fs25-b{grid-column:3;grid-row:1}}`;
    document.head.appendChild(s);
  }
})(typeof window !== 'undefined' ? window : globalThis);
