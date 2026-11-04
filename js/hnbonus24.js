// 2.4: HoloNet cards worth building around.
//  - Beskar Forging: every HoloNet card has its own 5-tier upgrade, paid in
//    Beskar. Each tier adds health and armor; tier 5 unlocks a passive.
//  - Pair bonuses with core cards (Kelleran + Grogu, Krrsantan + Boba,
//    Hallway Vader + Vader, the Armorer + any Mandalorian).
//  - Role jobs: IG-11 cleanses, Paz shares his armor, Todo repairs droids,
//    Greef pays more Beskar and credits.
// The Hunters & Clans squad bonus lives with the other synergies (js/data.js).
// All of it is off until 2.4 is out.
(function (root) {
  'use strict';

  const D = root.GameData;
  const on = () => !!(root.Update24 && root.Update24.on()) && !root.__hnbOff;

  // ---------- Beskar Forging ----------
  const TIERS = 5;
  const COST = [400, 800, 1400, 2200, 3200];
  const RARITY_COST = { common: 0.5, rare: 0.6, epic: 0.8, legendary: 1, mythic: 1.3, secret: 1.3 };
  const HP_STEP = 0.04;
  const ARMOR_STEP = 0.05;
  const PASSIVE = {
    attacker: { name: 'Beskar Edge', desc: '+8% crit chance and +15% crit damage.' },
    tank: { name: 'Beskar Wall', desc: '+10% more armor and heals 2% each turn.' },
    support: { name: 'Forged Resolve', desc: 'Every ally starts with +10% Turn Meter.' },
    healer: { name: 'Forged Resolve', desc: 'Every ally starts with +10% Turn Meter.' },
  };
  const ENEMY_ONLY = ['hn_sith_destroyer', 'hn_tie_dagger', 'hn_trifighter'];
  const forgeable = (id) => {
    const H = root.HN;
    if (H && H.HN_IDS) return H.HN_IDS.includes(id);
    return /^hn_/.test(id) && !ENEMY_ONLY.includes(id) && D.UNIT_MAP[id] && !D.UNIT_MAP[id].raid;
  };
  const costOf = (id, tier) => Math.round((COST[tier] || 0) * (RARITY_COST[(D.UNIT_MAP[id] || {}).rarity] || 1) / 10) * 10;
  const passiveOf = (id) => PASSIVE[(D.UNIT_MAP[id] || {}).role] || PASSIVE.attacker;
  // The player's own tiers live in their HoloNet save.
  const myTiers = () => { try { return (root.HN && root.HN.S && root.HN.S().forge) || {}; } catch (e) { return {}; } };
  const tierOf = (id) => Math.max(0, Math.min(TIERS, myTiers()[id] | 0));

  function forge(id) {
    const H = root.HN;
    if (!on() || !H || !H.S || !forgeable(id)) return { ok: false, why: 'Not available.' };
    const h = H.S();
    const t = tierOf(id);
    if (t >= TIERS) return { ok: false, why: 'Fully forged.' };
    if (!H.owns(id)) return { ok: false, why: 'Earn this card first.' };
    const c = costOf(id, t);
    if ((h.beskar || 0) < c) return { ok: false, why: `Needs ${c.toLocaleString('en-US')} Beskar.` };
    h.beskar -= c;
    h.forge = { ...(h.forge || {}), [id]: t + 1 };
    H.save();
    return { ok: true, tier: t + 1, cost: c };
  }

  // ---------- 2.4 calibration ----------
  // HoloNet cards were measured against core cards of the same rarity (battle
  // sims across every card). Each gets the health and attack it needs to be
  // on par before forging; Beskar Forging takes it beyond.
  const CAL = {
    hn_fang: 1.08, hn_ig11: 1.1, hn_outrider: 1.12, hn_nite_owl: 1.22, hn_zuckuss: 1.28, hn_fennec: 1.2,
    hn_krrsantan: 1.25, hn_aurra: 1.38, hn_embo: 1.32, hn_gauntlet: 1.28, hn_bossk: 1.35, hn_greef: 1.35,
    hn_armorer: 1.4, hn_pre_vizsla: 1.3, hn_kelleran: 1.45, hn_cadbane: 1.5, hn_vader_hallway: 1.4, hn_dark_trooper: 1.5,
  };
  // Kits that needed more than stats: harder hits (dmg) and a shorter main cooldown (cd).
  const KIT = {
    hn_dark_trooper: { dmg: 1.4, cd: -1 }, hn_pre_vizsla: { dmg: 1.25, cd: -1 }, hn_armorer: { dmg: 1.3, cd: -1 }, hn_krrsantan: { dmg: 1.2, cd: -1 },
    hn_gauntlet: { dmg: 1.2, cd: -1 }, hn_zuckuss: { dmg: 1.2, cd: 0 }, hn_kelleran: { dmg: 1.15, cd: -1 }, hn_embo: { dmg: 1.2, cd: 0 },
    hn_cadbane: { dmg: 1.25, cd: -1 }, hn_aurra: { dmg: 1.15, cd: 0 }, hn_greef: { dmg: 1.1, cd: -1 }, hn_fennec: { dmg: 1.15, cd: 0 },
  };
  const baseStats = D.unitStats;
  D.unitStats = function (def, level, stars, elite) {
    const s = baseStats(def, level, stars, elite);
    const k = def && CAL[def.id];
    if (!k || !on()) return s;
    return { ...s, hp: Math.round(s.hp * k), atk: Math.round(s.atk * k) };
  };
  const basePower = D.power;
  D.power = function (def, level, stars, elite) {
    if (!def || !CAL[def.id] || !on()) return basePower(def, level, stars, elite);
    const s = D.unitStats(def, level, stars, elite);
    return Math.round(s.hp * 0.3 + s.atk * 3 + s.def * 2 + s.spd * 1.5);
  };

  // ---------- Pair bonuses ----------
  const isMando = (id) => D.traitsOf(id).includes('mandalorian');
  const PAIRS = [
    { a: 'hn_kelleran', b: (id) => id === 'grogu', name: 'Foundling\'s Guard', with: 'Grogu', desc: 'Each time Kelleran Beq takes a turn, the ally lowest on health (below 50%) gains Defense Up and heals 5%.' },
    { a: 'hn_krrsantan', b: (id) => id === 'boba_fett', name: 'Old Partners', with: 'Boba Fett', desc: 'Krrsantan and Boba Fett start with +30% Turn Meter.' },
    { a: 'hn_vader_hallway', b: (id) => id === 'vader', name: 'Dark Lord\'s Shadow', with: 'Darth Vader', desc: 'Enemies start in fear: Offense Down for 1 turn and -15% Turn Meter.' },
    { a: 'hn_armorer', b: (id) => id !== 'hn_armorer' && isMando(id), name: 'Forged Covert', with: 'any Mandalorian', desc: 'Mandalorian allies start with Defense Up for 2 turns.' },
  ];
  const pairsFor = (ids) => PAIRS.filter((p) => ids.includes(p.a) && ids.some(p.b));

  // ---------- Role jobs (ability tweaks) ----------
  const JOBS = {
    hn_ig11: { ab: 'Nurse Protocol', add: [{ type: 'cleanse' }], desc: 'Heal one ally 30%, clear their debuffs and give them Defense Up.' },
    hn_paz: { ab: 'Hold the Covert', add: [{ type: 'status', status: 'defUp', turns: 1, chance: 1, on: 'allies' }], desc: 'Gain Taunt and Defense Up and heal 20%; every ally gains Defense Up for 1 turn.' },
  };
  const BIO = {
    hn_todo: 'Passive, Droid Mechanic: droid allies repair 4% health each turn. Partner: +20 speed with Cad Bane in the squad.',
    hn_greef: 'Passive, Good Business: +10% Beskar from HoloNet battles and +10% credits from campaign battles he fights in.',
  };
  let patched = false;
  function patchDefs() {
    if (patched || !on()) return;
    let any = false;
    for (const [id, j] of Object.entries(JOBS)) {
      const def = D.UNIT_MAP[id];
      const ab = def && (def.abilities || []).find((a) => a.name === j.ab);
      if (!ab) continue;
      ab.effects = [...ab.effects, ...j.add];
      ab.desc = j.desc;
      any = true;
    }
    for (const [id, line] of Object.entries(BIO)) {
      const def = D.UNIT_MAP[id];
      if (def && def.bio && !def.bio.includes(line.split(':')[0])) { def.bio = def.bio.replace(/Passive,[^.]*\.?.*$/, line); any = true; }
    }
    for (const [id, k] of Object.entries(KIT)) {
      const def = D.UNIT_MAP[id];
      if (!def) continue;
      const boost = (a) => { if (!a || !a.effects) return; a.effects = a.effects.map((e) => (e.type === 'damage' ? { ...e, mult: Math.round(e.mult * k.dmg * 100) / 100 } : e)); };
      (def.abilities || []).forEach((a, n) => { boost(a); if (n > 0 && k.cd && a.cd > 1) a.cd = Math.max(1, a.cd + k.cd); });
      boost(def.ultimate);
      any = true;
    }
    patched = any;
  }

  // ---------- In battle ----------
  function sideSetup(b, side, entries, tiers) {
    const squad = b.side(side);
    const ids = squad.map((u) => u.id);
    // Forging (your own cards; opponents' forged tiers come with their entry).
    squad.forEach((u) => {
      const e = entries && entries[u.index];
      const t = Math.max(0, Math.min(TIERS, (e && e.forge != null ? e.forge : tiers ? tiers[u.id] : 0) | 0));
      if (!t || !forgeable(u.id)) return;
      u.maxHp = u.hp = Math.round(u.maxHp * (1 + HP_STEP * t));
      u.armor = Math.round(u.armor * (1 + ARMOR_STEP * t));
      u.forge = t;
      if (t >= TIERS) {
        const role = u.def.role;
        if (role === 'attacker') { u.mods.crit += 0.08; u.mods.critDmg += 0.15; } else if (role === 'tank') { u.armor = Math.round(u.armor * 1.1); u.mods.regen += 0.02; } else squad.forEach((a) => { a.tm = Math.min(99, a.tm + 10); });
      }
    });
    // Pairs.
    const foes = b.side(side === 'player' ? 'enemy' : 'player');
    for (const p of root.__hnPairOff ? [] : pairsFor(ids)) {
      if (p.a === 'hn_krrsantan') squad.filter((u) => u.id === 'hn_krrsantan' || u.id === 'boba_fett').forEach((u) => { u.tm = Math.min(99, u.tm + 30); });
      if (p.a === 'hn_vader_hallway') foes.forEach((u) => { u.statuses.offDown = Math.max(u.statuses.offDown || 0, 1); u.tm = Math.max(0, u.tm - 15); });
      if (p.a === 'hn_armorer') squad.filter((u) => isMando(u.id)).forEach((u) => { u.statuses.defUp = Math.max(u.statuses.defUp || 0, 2); });
      if (p.a === 'hn_kelleran') squad.filter((u) => u.id === 'hn_kelleran').forEach((u) => { u.guard = true; });
    }
    // Todo repairs droids.
    if (ids.includes('hn_todo')) squad.filter((u) => D.traitsOf(u.id).includes('droid')).forEach((u) => { u.mods.regen += 0.04; });
    b.hnPairs = b.hnPairs || {};
    b.hnPairs[side] = pairsFor(ids).map((p) => p.name);
  }

  root.BattleExtras = root.BattleExtras || [];
  root.BattleExtras.push((b, opts, playerSquad, enemySquad) => {
    if (!on()) return;
    patchDefs();
    const f = opts && opts.forge;
    sideSetup(b, 'player', playerSquad, f ? f.player : myTiers());
    sideSetup(b, 'enemy', enemySquad, f ? f.enemy : null);
  });

  // ---------- HoloNet card passives ----------
  // Every HoloNet card's passive, as written on the card. (Hallway Vader's
  // No Escape lives with his art in js/holonet.js.) These are fixes, so they
  // work now, not only from 2.4.
  const pOn = () => !root.__hnpOff;
  const has = (b, side, id) => b.units.some((u) => u.side === side && u.alive && u.id === id);
  const isLeader = (u) => D.traitsOf(u.id).includes('leader');
  root.BattleExtras.push((b) => {
    if (!pOn()) return;
    for (const side of ['player', 'enemy']) {
      const sq = b.side(side);
      const ids = sq.map((u) => u.id);
      sq.forEach((u) => {
        if (u.id === 'hn_cadbane') u.tm = 99.5;
        if (u.id === 'hn_outrider') u.spd += 15;
        if (u.id === 'hn_todo' && ids.includes('hn_cadbane')) u.spd += 20;
        if (u.id === 'hn_fang') u.dodgeReady = true;
        if (ids.includes('hn_gauntlet') && u.id !== 'hn_gauntlet') u.tm = Math.min(99, u.tm + 15);
        if (ids.includes('hn_armorer') && isMando(u.id) && u.id !== 'hn_armorer') u.maxHp = u.hp = Math.round(u.maxHp * 1.1);
      });
    }
  });
  const BP = root.Battle && root.Battle.prototype;
  if (BP && !BP.__hnPass) {
    BP.__hnPass = true;
    const roll = BP.rollDamage;
    BP.rollDamage = function (source, target, mult) {
      if (!pOn() || !source || !target) return roll.call(this, source, target, mult);
      let crit0 = null;
      if (source.id === 'hn_fennec' && !source.fennecFirst) { source.fennecFirst = true; crit0 = source.mods.crit; source.mods.crit += 0.25; }
      const r = roll.call(this, source, target, mult);
      if (crit0 != null) source.mods.crit = crit0;
      let k = 1;
      if (source.id === 'hn_pre_vizsla' && isLeader(target)) k *= 1.3;
      if (source.id === 'hn_bossk' && target.hp / target.maxHp < 0.5) k *= 1.2;
      if (source.id === 'hn_nite_owl' && target.statuses.taunt) k *= 1.2;
      if (target.zuckMark && target.zuckMark === source.side) k *= 1.15;
      if (source.id === 'hn_zuckuss' && !source.zuckDone) { source.zuckDone = true; target.zuckMark = source.side; }
      if (target.id === 'hn_krrsantan' && target.statuses.taunt) k *= 0.8;
      if (target.id === 'hn_cara' && target.statuses.taunt) k *= 0.9;
      if (target.id === 'hn_dark_trooper') k *= 0.75;
      if (target.hp / target.maxHp < 0.3 && has(this, target.side, 'hn_kelleran')) k *= 0.7;
      if (k !== 1) r.amount = Math.max(1, Math.round(r.amount * k));
      return r;
    };
    const eff0 = BP.applyEffect;
    BP.applyEffect = function (source, target, eff, events) {
      if (pOn() && target && eff && source && source.side !== target.side) {
        if (eff.type === 'damage') {
          const dodge = (target.id === 'hn_embo' && this.rng() < 0.2) || (target.id === 'hn_fang' && target.dodgeReady);
          if (dodge) {
            if (target.id === 'hn_fang') target.dodgeReady = false;
            events.push({ type: 'resist', uid: target.uid });
            events.push({ type: 'log', text: `${target.def.name} dodges!`, side: target.side });
            return undefined;
          }
        }
        if (eff.type === 'status' && ((target.id === 'hn_aurra' && eff.status === 'stun') || (target.id === 'hn_paz' && eff.status === 'defDown'))) {
          events.push({ type: 'resist', uid: target.uid, immune: true });
          return undefined;
        }
      }
      const r = eff0.call(this, source, target, eff, events);
      // IG-11's Protocol: Protect: an ally dropping below 30% gets Defense Up (once each).
      if (pOn() && eff && eff.type === 'damage' && target && target.alive && !target.ig11Done && target.hp / target.maxHp < 0.3 && has(this, target.side, 'hn_ig11')) {
        target.ig11Done = true;
        target.statuses.defUp = Math.max(target.statuses.defUp || 0, 2);
        events.push({ type: 'status', uid: target.uid, status: 'defUp', turns: 2 });
      }
      return r;
    };
    const turn0 = BP.beginTurn;
    BP.beginTurn = function (unit) {
      if (unit && unit.id === 'hn_fang') unit.dodgeReady = true;
      return turn0.call(this, unit);
    };
  }

  // Kelleran's Foundling's Guard fires at the start of each of his turns.
  const B = root.Battle;
  if (B && !B.prototype.__hnGuard) {
    B.prototype.__hnGuard = true;
    const base = B.prototype.beginTurn;
    B.prototype.beginTurn = function (unit) {
      const r = base.call(this, unit);
      if (unit && unit.guard && unit.alive && on() && !root.__hnPairOff) {
        const allies = this.side(unit.side).filter((u) => u.alive);
        const low = allies.reduce((a, u) => (u.hp / u.maxHp < a.hp / a.maxHp ? u : a), allies[0]);
        if (low && low.hp / low.maxHp < 0.5) { low.statuses.defUp = Math.max(low.statuses.defUp || 0, 1); low.hp = Math.min(low.maxHp, low.hp + Math.round(low.maxHp * 0.05)); }
      }
      return r;
    };
  }

  if (root.addEventListener) root.addEventListener('hn-ready', () => patchDefs());
  root.HNBonus = { CAL, on, TIERS, COST, HP_STEP, ARMOR_STEP, forgeable, costOf, tierOf, passiveOf, forge, PAIRS, pairsFor, patchDefs, BIO, JOBS };
})(typeof window !== 'undefined' ? window : globalThis);
