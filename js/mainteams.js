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
      s.mainTeams[kind] = ids.filter((id) => Player.owns(id) && D.UNIT_MAP[id] && D.UNIT_MAP[id].kind === kind).slice(0, Player.slots());
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
