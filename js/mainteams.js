// Main teams (preview): one Ground and one Fleet team you pick in the
// Collection, using its filters. Auto-continue (Next and Repeat) and Replay x3
// start every battle with the main team for that kind of fight, unless you
// changed the squad by hand for it; saving a main team again resets that.
//
// Ships with 2.3 (testers: the swcg-main-test key or the master key).
(function (root) {
  'use strict';
  const D = root.GameData;
  const Player = root.Player;
  if (!D || !Player) return;
  const get = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  // Ships with 2.3; testers get it early with its switch (or the master key).
  const on = () => !!(root.Update23 && root.Update23.on && root.Update23.on()) || get('swcg-main-test') === '1';

  const st = () => {
    const s = Player.state;
    if (!s.mainTeams) s.mainTeams = { character: [], ship: [] };
    if (!s.mainEdited) s.mainEdited = {};
    return s;
  };
  const team = (kind) => (st().mainTeams[kind] || []).filter((id) => Player.owns(id)).slice(0, Player.slots());
  const same = (a, b) => a.length === b.length && a.every((id, i) => id === b[i]);

  const MT = {
    on,
    team,
    has: (kind) => team(kind).length > 0,
    set(kind, ids) {
      const s = st();
      s.mainTeams[kind] = D.keepApart(ids).filter((id) => Player.owns(id) && D.UNIT_MAP[id] && D.UNIT_MAP[id].kind === kind).slice(0, Player.slots());
      s.mainEdited[kind] = false;
      Player.save();
    },
    // The squad screen's Fight: a squad that differs from the main team
    // becomes the one auto battles use, until a main team is saved again.
    used(kind, ids) {
      if (!on() || !MT.has(kind)) return;
      st().mainEdited[kind] = !same(ids.slice(0, Player.slots()), team(kind));
    },
    edited: (kind) => !!st().mainEdited[kind],
  };
  root.MainTeams = MT;

  // ---------- Battle Plans (2.4) ----------
  // Saved squads in the Collection: 2 plans at level 15, 4 at 25, 6 at 40.
  // Each plan holds a Ground and a Fleet squad and is named after an Aurebesh
  // letter until renamed. One plan is the Flagship: its squads are the main
  // teams that Auto-continue and Replay x3 use.
  let safeP = null;
  const loadSafe = () => {
    if (root.Safe) return Promise.resolve(root.Safe);
    if (!safeP) safeP = new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = root.__ver ? root.__ver('js/safe.js') : 'js/safe.js'; sc.onload = () => res(root.Safe); sc.onerror = () => { safeP = null; rej(new Error('offline')); }; document.head.appendChild(sc); });
    return safeP;
  };
  const PLAN_NAMES = ['Aurek', 'Besh', 'Cresh', 'Dorn', 'Esk', 'Forn'];
  const PLAN_LEVELS = [15, 15, 25, 25, 40, 40];
  const plansOn = () => on() && !!(root.Update24 && root.Update24.on());
  const planCount = () => PLAN_LEVELS.filter((l) => Player.state.account.level >= l).length;
  const plans = () => {
    const s = st();
    if (!Array.isArray(s.plans)) {
      s.plans = PLAN_NAMES.map((n) => ({ name: '', character: [], ship: [] }));
      // A main team picked before 2.4 becomes the first plan, and the Flagship.
      if (s.mainTeams.character.length || s.mainTeams.ship.length) {
        s.plans[0].character = s.mainTeams.character.slice();
        s.plans[0].ship = s.mainTeams.ship.slice();
        s.planFlag = 0;
      }
    }
    if (typeof s.planFlag !== 'number') s.planFlag = -1;
    return s.plans;
  };
  const planName = (i) => (plans()[i] && plans()[i].name) || `Plan ${PLAN_NAMES[i]}`;
  const planTeam = (i, kind) => ((plans()[i] || {})[kind] || []).filter((id) => Player.owns(id)).slice(0, Player.slots());
  Object.assign(MT, {
    plansOn,
    planCount,
    PLAN_LEVELS,
    plans,
    planName,
    planTeam,
    flag: () => { plans(); return st().planFlag; },
    setPlan(i, kind, ids) {
      const p = plans()[i];
      if (!p) return;
      p[kind] = D.keepApart(ids).filter((id) => Player.owns(id) && D.UNIT_MAP[id] && D.UNIT_MAP[id].kind === kind).slice(0, Player.slots());
      if (st().planFlag === i) MT.set(kind, p[kind]);
      Player.save();
    },
    // Plan names go through the same family-friendly filter as chat and
    // callsigns (js/safe.js). A name it would mask or block is refused.
    // Resolves to true when the name was saved.
    async rename(i, name) {
      const p = plans()[i];
      if (!p) return false;
      const clean = String(name || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 18);
      if (clean) {
        let S = null;
        try { S = await loadSafe(); } catch (e) { /* offline */ }
        if (!S) { if (root.UI) root.UI.toast('Couldn\'t check that name right now. Try again in a moment.'); return false; }
        if (!S.ok(clean)) { if (root.UI) root.UI.toast('That name isn\'t allowed. Try another.'); return false; }
      }
      p.name = clean;
      Player.save();
      return true;
    },
    makeFlag(i) {
      plans();
      st().planFlag = i;
      for (const kind of ['character', 'ship']) if (planTeam(i, kind).length) MT.set(kind, planTeam(i, kind));
      Player.save();
    },
  });
  // The Flagship marker: a Star Destroyer wedge with its bridge tower.
  MT.flagIcon = '<svg class="fs-ico" viewBox="0 0 28 14" aria-hidden="true"><path d="M1 9.5 27 3v10H1z" fill="currentColor" opacity=".55"/><path d="M1 9.5 27 3v4L1 10.5z" fill="currentColor"/><path d="M17 3.2h5V1.4h3v2.4h-8z" fill="currentColor"/></svg>';

  // One look for plan cards, in the Collection panel and in the manager.
  // a: the data attributes each place uses for edit / rename / flag.
  const PEN = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11.3 1.7a1.6 1.6 0 0 1 2.3 0l.7.7a1.6 1.6 0 0 1 0 2.3L5.6 13.4 2 14l.6-3.6z" fill="currentColor"/></svg>';
  const KI = { character: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5" r="3" fill="currentColor"/><path d="M2 15c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5z" fill="currentColor"/></svg>', ship: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1 10 9l5 3v2l-5-1.5L8 15l-2-2.5L1 14v-2l5-3z" fill="currentColor"/></svg>' };
  MT.ui = {
    // Your fleet: the gold Star Destroyer (your Flagship) leads, a lit
    // starfighter for each other unlocked plan, dark outlines for locked ones.
    pips(n, flag) {
      const fighter = (c) => `<svg class="bp-sf ${c}" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1 11 4.5 11 10 17 11.5 17 9 18.6 9 18.6 16 17 16 17 14 11 14.6 10.6 18 9.4 18 9 14.6 3 14 3 16 1.4 16 1.4 9 3 9 3 11.5 9 10 9 4.5z"/></svg>`;
      const lead = flag >= 0 && flag < n;
      const ships = (lead ? [MT.flagIcon.replace('class="fs-ico"', 'class="fs-ico bp-sd"')] : []).concat(Array.from({ length: n - (lead ? 1 : 0) }, () => fighter('on')), Array.from({ length: PLAN_LEVELS.length - n }, () => fighter('lk')));
      return `<span class="bp-pips" role="img" aria-label="${n} of 6 plans unlocked${lead ? ', Flagship set' : ''}">${ships.join('')}</span>`;
    },
    strip(ids, mini) {
      const size = Player.slots();
      return `<span class="bp-slots">${ids.map(mini).join('')}${Array.from({ length: Math.max(0, size - ids.length) }, () => '<i class="bp-empty"></i>').join('')}</span>`;
    },
    card(i, o) {
      const esc = root.UI.esc;
      const flag = MT.flag();
      const nm = planName(i);
      const row = (k) => `<div class="bp-row"><span class="bp-k">${KI[k]}${k === 'ship' ? 'Fleet' : 'Ground'}</span>${MT.ui.strip(planTeam(i, k), o.mini)}${o.extra ? o.extra(i, k) : ''}<button class="btn bp-sb" type="button" ${o.edit}="${i}" data-k="${k}">${planTeam(i, k).length ? 'Edit' : 'Set'}</button></div>`;
      const top = o.naming === i ? o.nameBox(i) : `<b>${esc(nm)}</b><button class="bp-ico" type="button" ${o.name}="${i}" title="Rename" aria-label="Rename ${esc(nm)}">${PEN}</button>`;
      return `<div class="bp-card ${flag === i ? 'flag' : ''}"><div class="bp-top">${top}${flag === i ? `<span class="bp-flag">${MT.flagIcon}Flagship</span>` : ''}</div>
        ${row('character')}${row('ship')}
        ${flag === i ? '' : `<button class="btn bp-make" type="button" ${o.flag}="${i}">${MT.flagIcon}Make Flagship</button>`}</div>`;
    },
    locked: (i) => `<div class="bp-card locked"><span class="bp-lock">🔒</span><b>Plan ${PLAN_NAMES[i]}</b><small>Unlocks at level ${PLAN_LEVELS[i]}</small></div>`,
  };

  // Hide the Battle Plans panel in the Collection (remembered on this save).
  MT.hidden = () => !!st().plansHidden;
  MT.setHidden = (v) => { st().plansHidden = !!v; Player.save(); };

  // The Battle Plans manager: every plan, its squads, renaming, the Flagship,
  // and a card picker to edit a squad, all in one window. Opened from the
  // squad screen (where it can also load a plan) or from the Collection.
  // opts.kind + opts.onLoad(i): show Load buttons for that kind of battle.
  MT.manager = (opts = {}) => {
    const U = root.UI;
    const esc = U.esc;
    const kN = (k) => (k === 'ship' ? 'Fleet' : 'Ground');
    const mini = (id) => `<span class="mini" title="${esc(D.UNIT_MAP[id].name)}">${U.portrait(D.UNIT_MAP[id], { plate: false })}</span>`;
    let edit = null; // { i, kind, draft }
    let naming = -1;
    const m = U.openModal('<div data-bpm></div>', { cls: 'bpm-modal', onClose: opts.onClose });
    const box = m.root.querySelector('[data-bpm]');
    const draw = () => {
      const n = planCount();
      const flag = MT.flag();
      if (edit) {
        const size = Player.slots();
        const owned = D.UNITS.filter((u) => u.kind === edit.kind && Player.owns(u.id)).sort((x, y) => Player.powerOf(y.id) - Player.powerOf(x.id));
        box.innerHTML = `<div class="bpm-top"><h2>${esc(planName(edit.i))} · ${kN(edit.kind)}</h2><span class="muted small">${edit.draft.length}/${size} · tap cards to add or remove</span></div>
          <div class="bpm-sel">${edit.draft.length ? edit.draft.map(mini).join('') : '<span class="muted small">Empty</span>'}</div>
          <div class="bpm-grid">${owned.map((u) => {
            const at = edit.draft.indexOf(u.id);
            const doc = root.Doctrines && root.Doctrines.of(u.id);
            const el = (Player.unit(u.id) || {}).elite;
            return `<button type="button" class="bpm-c ${at >= 0 ? 'on' : ''}" data-pick="${u.id}">${U.portrait(u, { plate: false })}${at >= 0 ? `<i class="bpm-n">${at + 1}</i>` : ''}${doc ? `<i class="bpm-d ${doc.style}" title="${esc(doc.name)}">${doc.icon}</i>` : ''}<b>${esc(u.name)}${el ? ' ✦' : ''}</b><small>⚡ ${U.fmt(Player.powerOf(u.id))}</small></button>`;
          }).join('')}</div>
          <div class="modal-actions"><button class="btn" type="button" data-bx="clear">Clear</button><button class="btn" type="button" data-bx="back">Cancel</button><button class="btn btn-primary" type="button" data-bx="save">Save squad</button></div>`;
        return;
      }
      box.innerHTML = `<div class="bpm-top"><h2>Battle Plans</h2><div class="bp-sub">${MT.ui.pips(n, flag)}<span>${n} of 6 unlocked</span></div><p class="bp-tip">${MT.flagIcon}Auto-continue flies your <b>Flagship</b></p></div>
        <div class="bp-list">${plans().map((p, i) => (i >= n ? MT.ui.locked(i) : MT.ui.card(i, {
          mini, edit: 'data-be', name: 'data-bn', flag: 'data-bf', naming,
          nameBox: (j) => `<input class="bpm-name" data-nm="${j}" maxlength="18" value="${esc(planName(j))}" aria-label="Plan name"><button class="btn bp-sb" type="button" data-bn-ok="${j}">OK</button>`,
          extra: (j, k) => (opts.kind === k && planTeam(j, k).length ? `<button class="btn btn-primary bp-sb" type="button" data-bl="${j}">Load</button>` : ''),
        }))).join('')}</div>
        <div class="modal-actions"><button class="btn" type="button" data-bx="close">Done</button></div>`;
      const inp = box.querySelector('[data-nm]');
      if (inp) { inp.focus(); inp.select(); }
    };
    // Keeps the box open (with what was typed) when the filter refuses a name.
    const finishName = async () => {
      const inp = box.querySelector('[data-nm]');
      if (!inp) { naming = -1; return draw(); }
      const typed = inp.value;
      const okd = await MT.rename(Number(inp.dataset.nm), typed);
      if (okd) { naming = -1; draw(); return; }
      draw();
      const again = box.querySelector('[data-nm]');
      if (again) { again.value = typed; again.select(); }
    };
    box.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('[data-nm]')) finishName(); });
    box.addEventListener('click', (e) => {
      const t = (q) => e.target.closest(q);
      if (edit) {
        const c = t('[data-pick]');
        if (c) {
          const id = c.dataset.pick;
          const d = edit.draft;
          if (d.includes(id)) edit.draft = d.filter((x) => x !== id);
          else if (d.length >= Player.slots()) return U.toast(`Squad is full (${Player.slots()}). Tap a card to take it out first.`);
          else if (D.clashWith(d, id)) return U.toast(D.apartLine(id, D.clashWith(d, id)));
          else edit.draft = [...d, id];
          const keep = box.querySelector('.bpm-grid') ? box.querySelector('.bpm-grid').scrollTop : 0;
          draw();
          const g = box.querySelector('.bpm-grid'); if (g) g.scrollTop = keep;
          return;
        }
        const bx = t('[data-bx]');
        if (!bx) return;
        if (bx.dataset.bx === 'clear') { edit.draft = []; return draw(); }
        if (bx.dataset.bx === 'save') { MT.setPlan(edit.i, edit.kind, edit.draft); U.toast(`${planName(edit.i)}: ${kN(edit.kind)} squad saved.`); }
        edit = null;
        return draw();
      }
      if (t('[data-bn-ok]')) return finishName();
      if (naming >= 0 && !t('[data-nm]') && !t('[data-bn]')) { finishName(); return; }
      const b = t('[data-bl]'); if (b) { m.close(); if (opts.onLoad) opts.onLoad(Number(b.dataset.bl)); return; }
      const be = t('[data-be]'); if (be) { const i = Number(be.dataset.be); edit = { i, kind: be.dataset.k, draft: planTeam(i, be.dataset.k) }; return draw(); }
      const bn = t('[data-bn]'); if (bn) { naming = Number(bn.dataset.bn); return draw(); }
      const bf = t('[data-bf]'); if (bf) { MT.makeFlag(Number(bf.dataset.bf)); U.toast(`${planName(Number(bf.dataset.bf))} is your Flagship plan.`); return draw(); }
      if (t('[data-bx="close"]')) { m.close(); return; }
    });
    draw();
    return m;
  };

  if (!document.getElementById('bp-css')) {
    document.head.appendChild(Object.assign(document.createElement('style'), { id: 'bp-css', textContent: `
.bp-panel { display: grid; gap: 8px; margin: 0 0 12px; }
.bp-head { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 6px 10px; }
.bp-title { display: flex; align-items: center; gap: 6px 12px; flex-wrap: wrap; min-width: 0; }
.bp-title b { font: 800 14px var(--font-display); letter-spacing: .1em; text-transform: uppercase; color: #ffe81f; }
.bp-sub { display: inline-flex; align-items: center; gap: 8px; font: 700 11px var(--font-display); letter-spacing: .08em; text-transform: uppercase; color: #9fb3cc; }
.bp-pips { display: inline-flex; align-items: center; gap: 4px; }
.bp-sf { width: 15px; height: 15px; flex: 0 0 auto; }
.bp-sf.on { fill: #7cd0ff; stroke: #d8f6ff; stroke-width: .8; filter: drop-shadow(0 0 3px rgba(124, 208, 255, .75)); }
.bp-sf.lk { fill: none; stroke: #3a4658; stroke-width: .9; }
.bp-pips .bp-sd { width: 24px; height: 12px; color: #ffd23f; filter: drop-shadow(0 0 3px rgba(255, 210, 63, .8)); }
body.perf-on .bp-sf.on, body.perf-on .bp-pips .bp-sd { filter: none; }
.bp-acts { display: flex; gap: 6px; justify-content: flex-end; flex-wrap: wrap; }
.btn.bp-hb { padding: 6px 12px; font-size: 11px; border-radius: 999px; border-color: rgba(124, 208, 255, .35); background: linear-gradient(180deg, rgba(124, 208, 255, .14), rgba(124, 208, 255, .04)); color: #cfeaff; }
.btn.bp-hb:hover:not(:disabled) { border-color: #7cd0ff; box-shadow: 0 0 12px rgba(124, 208, 255, .35); }
.btn.bp-hb.ghost { background: transparent; border-color: var(--line); color: var(--muted); }
.bp-tip { grid-column: 1 / -1; margin: 0; display: flex; align-items: center; gap: 6px; font-size: 12px; color: #9fb3cc; }
.bp-tip b { color: #ffe81f; }
.bp-tip .fs-ico, .bp-noflag .fs-ico { color: #ffe81f; }
.bp-noflag { margin: 0; display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 10px; border: 1px dashed rgba(255, 232, 31, .5); background: rgba(255, 232, 31, .06); font-size: 12px; color: #ffe9a8; }
.bp-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 8px; }
.bp-closed { display: grid; grid-template-columns: minmax(0, 340px) minmax(0, 1fr); gap: 10px; align-items: start; }
.bp-dock { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
.bp-tab { display: grid; gap: 2px; text-align: left; padding: 8px 10px; border-radius: 10px; border: 1px solid rgba(124, 208, 255, .2); background: rgba(124, 208, 255, .04); color: inherit; font: inherit; cursor: pointer; min-width: 0; transition: transform .12s, border-color .2s, background .2s; }
.bp-tab:hover:not(:disabled) { transform: translateY(-1px); border-color: rgba(124, 208, 255, .5); }
.bp-tab b { display: flex; align-items: center; gap: 4px; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bp-tab small { font-size: 10px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bp-tab.fl { border-color: rgba(255, 232, 31, .45); }
.bp-tab.fl b { color: #ffe81f; }
.bp-tab.sel { background: rgba(124, 208, 255, .14); border-color: #7cd0ff; box-shadow: 0 0 0 1px #7cd0ff inset; }
.bp-tab.fl.sel { background: rgba(255, 232, 31, .12); border-color: #ffe81f; box-shadow: 0 0 0 1px #ffe81f inset; }
.bp-tab.lk { opacity: .5; border-style: dashed; cursor: default; }
.bp-card { position: relative; display: grid; gap: 8px; padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(124, 208, 255, .22); background: rgba(124, 208, 255, .04); min-width: 0; }
.bp-card.flag { border-color: rgba(255, 232, 31, .6); background: linear-gradient(135deg, rgba(255, 232, 31, .11), rgba(255, 232, 31, .02)); overflow: hidden; }
.bp-card.flag::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(105deg, transparent 40%, rgba(255, 232, 31, .14) 50%, transparent 60%); transform: translateX(-100%); animation: bp-glint 6s ease-in-out infinite; }
@keyframes bp-glint { 0%, 70% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
.bp-card.locked { opacity: .55; border-style: dashed; place-items: center; align-content: center; gap: 2px; min-height: 64px; font-size: 13px; text-align: center; }
.bp-card.locked small { color: var(--muted); font-size: 11px; }
.bp-top { display: flex; align-items: center; gap: 6px; min-width: 0; }
.bp-top b { min-width: 0; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bp-ico { flex: 0 0 auto; width: 26px; height: 26px; display: grid; place-items: center; padding: 0; border-radius: 8px; border: 1px solid transparent; background: transparent; color: var(--muted); cursor: pointer; transition: color .2s, border-color .2s, background .2s; }
.bp-ico svg { width: 13px; height: 13px; }
.bp-ico:hover { color: #cfeaff; border-color: rgba(124, 208, 255, .35); background: rgba(124, 208, 255, .08); }
.bp-flag { margin-left: auto; display: inline-flex; align-items: center; gap: 5px; padding: 3px 8px; border-radius: 999px; background: rgba(255, 232, 31, .14); border: 1px solid rgba(255, 232, 31, .5); font: 800 10px var(--font-display); letter-spacing: .14em; text-transform: uppercase; color: #ffe81f; white-space: nowrap; }
.fs-ico { width: 22px; height: 11px; flex: 0 0 auto; vertical-align: middle; }
.bp-row { display: grid; grid-template-columns: 64px minmax(0, 1fr) auto auto; align-items: center; gap: 8px; }
.bp-k { display: inline-flex; align-items: center; gap: 5px; font: 700 10px var(--font-display); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.bp-k svg { width: 12px; height: 12px; flex: 0 0 auto; opacity: .8; }
.bp-slots { display: flex; gap: 4px; min-width: 0; overflow: hidden; }
.bp-slots .mini, .bp-empty { width: 30px; height: 30px; flex: 0 0 30px; }
.bp-row .mt-minis .mini { width: 30px; height: 30px; }
.bp-empty { display: block; border-radius: 8px; border: 1px dashed #3a4658; background: rgba(255, 255, 255, .02); }
.btn.bp-sb { padding: 5px 12px; font-size: 11px; min-width: 56px; }
.btn.bp-make { justify-self: start; padding: 6px 12px; font-size: 11px; gap: 6px; border-color: rgba(255, 232, 31, .45); color: #ffe9a8; background: linear-gradient(180deg, rgba(255, 232, 31, .12), rgba(255, 232, 31, .03)); }
.btn.bp-make:hover:not(:disabled) { border-color: #ffe81f; box-shadow: 0 0 14px rgba(255, 232, 31, .3); }
body.perf-on .bp-card.flag::after { animation: none; display: none; }
@media (max-width: 640px) {
  .bp-head { grid-template-columns: 1fr; }
  .bp-acts { justify-content: flex-start; }
  .bp-closed { grid-template-columns: 1fr; }
  .bp-list { grid-template-columns: 1fr; }
  .bp-row { grid-template-columns: 62px minmax(0, 1fr) auto auto; gap: 6px; }
  .bp-k svg { display: none; }
  .bp-slots { gap: 3px; }
  .bp-slots .mini, .bp-empty { width: 27px; height: 27px; flex-basis: 27px; }
}
@media (max-width: 400px) {
  .bp-row { grid-template-columns: minmax(0, 1fr) auto auto; row-gap: 3px; }
  .bp-k { grid-column: 1 / -1; }
  .bp-slots .mini, .bp-empty { width: 30px; height: 30px; flex-basis: 30px; }
}
@media (max-width: 360px) { .bp-dock { grid-template-columns: repeat(2, minmax(0, 1fr)); } .bp-slots .mini, .bp-empty { width: 27px; height: 27px; flex-basis: 27px; } }
.bp-pick { display: inline-flex; align-items: center; gap: 6px; }
.bpm-modal { width: min(760px, calc(100vw - 20px)); }
.bpm-top { display: grid; gap: 2px; margin-bottom: 10px; }
.bpm-top h2 { margin: 0; }
.bpm-name { font: inherit; font-size: 14px; padding: 5px 8px; border-radius: 8px; border: 1px solid var(--line); background: #050912; color: inherit; flex: 1; min-width: 0; }
.bpm-sel { display: flex; gap: 4px; min-height: 36px; align-items: center; margin-bottom: 8px; }
.bpm-sel .mini { width: 34px; height: 34px; }
.bpm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(92px, 1fr)); gap: 6px; max-height: min(42vh, 400px); overflow-y: auto; padding: 2px; margin-bottom: 10px; }
.bpm-c { position: relative; display: grid; gap: 2px; padding: 4px 4px 6px; border-radius: 10px; border: 1px solid var(--line); background: rgba(255, 255, 255, .03); color: inherit; font: inherit; cursor: pointer; text-align: center; }
.bpm-c .portrait, .bpm-c > :first-child { aspect-ratio: 1; border-radius: 8px; overflow: hidden; }
.bpm-c b { font-size: 11px; line-height: 1.15; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bpm-c small { font-size: 10px; color: var(--muted); }
.bpm-c.on { border-color: #ffe81f; box-shadow: 0 0 0 1px #ffe81f inset; background: rgba(255, 232, 31, .08); }
.bpm-n { position: absolute; top: 6px; left: 6px; width: 20px; height: 20px; border-radius: 50%; background: #ffe81f; color: #111; font: 800 11px/20px var(--font-display); font-style: normal; }
.bpm-d { position: absolute; top: 6px; right: 6px; width: 20px; height: 20px; border-radius: 50%; background: rgba(4, 12, 26, .85); font-style: normal; font-size: 11px; line-height: 20px; }
.bpm-d.G { color: #ffd36b; } .bpm-d.S { color: #7fe3ff; } .bpm-d.D { color: #8ff0a4; } .bpm-d.A { color: #ff8f7a; }
.bp-panel.hid { padding: 0; }
.bp-pick select { font: inherit; font-size: 13px; padding: 7px 8px; border-radius: 10px; border: 1px solid var(--line); background: #0a1120; color: inherit; max-width: 190px; }
` }));
  }

  // Every auto and quick start goes through BattleUI.quickStart: load the
  // main team there first.
  const BUI = root.BattleUI;
  if (BUI && BUI.quickStart) {
    const quick = BUI.quickStart.bind(BUI);
    BUI.quickStart = (params) => {
      try {
        if (on()) {
          const kind = Player.encounter(params).kind;
          if (MT.has(kind) && !MT.edited(kind)) Player.setSquad(kind, team(kind));
        }
      } catch (e) { /* fall back to the saved squad */ }
      return quick(params);
    };
  }
})(window);
