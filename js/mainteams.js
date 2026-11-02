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
    if (!safeP) safeP = new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = 'js/safe.js'; sc.onload = () => res(root.Safe); sc.onerror = () => { safeP = null; rej(new Error('offline')); }; document.head.appendChild(sc); });
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
      box.innerHTML = `<div class="bpm-top"><h2>Battle Plans</h2><span class="muted small">${n} of 6 unlocked · Auto-continue flies your Flagship</span></div>
        <div class="bp-list">${plans().map((p, i) => {
          if (i >= n) return `<div class="bp-card locked">🔒 Unlocks at level ${PLAN_LEVELS[i]}</div>`;
          const row = (k) => `<div class="bp-row"><span>${kN(k)}</span><span class="mt-minis">${planTeam(i, k).map(mini).join('') || '<span class="muted small">Not set</span>'}</span>${opts.kind === k && planTeam(i, k).length ? `<button class="btn btn-primary" type="button" data-bl="${i}">Load</button>` : ''}<button class="btn" type="button" data-be="${i}" data-k="${k}">${planTeam(i, k).length ? 'Edit' : 'Set'}</button></div>`;
          return `<div class="bp-card ${flag === i ? 'flag' : ''}"><div class="bp-top">${naming === i ? `<input class="bpm-name" data-nm="${i}" maxlength="18" value="${esc(planName(i))}" aria-label="Plan name"><button class="btn" type="button" data-bn-ok="${i}">OK</button>` : `<b>${esc(planName(i))}</b><button class="linkish" type="button" data-bn="${i}">Rename</button>`}${flag === i ? `<span class="bp-flag">${MT.flagIcon} Flagship</span>` : ''}</div>
            ${row('character')}${row('ship')}
            ${flag === i ? '' : `<button class="btn bp-make" type="button" data-bf="${i}">${MT.flagIcon} Make Flagship</button>`}</div>`;
        }).join('')}</div>
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
.bp-head { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.bp-head b { font: 800 14px var(--font-display); letter-spacing: .06em; text-transform: uppercase; color: #ffe81f; }
.bp-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 8px; }
.bp-card { display: grid; gap: 6px; padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(124, 208, 255, .22); background: rgba(124, 208, 255, .04); }
.bp-card.flag { border-color: rgba(255, 232, 31, .55); background: linear-gradient(135deg, rgba(255, 232, 31, .1), rgba(255, 232, 31, .02)); }
.bp-card.locked { opacity: .55; border-style: dashed; place-items: center; min-height: 64px; font-size: 13px; }
.bp-top { display: flex; align-items: center; gap: 8px; }
.bp-top b { flex: 1; min-width: 0; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bp-top .linkish { font-size: 12px; }
.bp-flag { display: inline-flex; align-items: center; gap: 4px; font: 800 10px var(--font-display); letter-spacing: .14em; text-transform: uppercase; color: #ffe81f; }
.fs-ico { width: 22px; height: 11px; flex: 0 0 auto; vertical-align: middle; }
.bp-row { display: flex; align-items: center; gap: 8px; }
.bp-row > span:first-child { width: 44px; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.bp-row .mt-minis .mini { width: 30px; height: 30px; }
.bp-row .btn { padding: 4px 10px; font-size: 12px; }
.bp-make { justify-self: start; padding: 4px 10px; font-size: 12px; }
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
