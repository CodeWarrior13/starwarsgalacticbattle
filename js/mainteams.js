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
    rename(i, name) {
      const p = plans()[i];
      if (!p) return;
      p.name = String(name || '').replace(/[<>]/g, '').trim().slice(0, 18);
      Player.save();
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
