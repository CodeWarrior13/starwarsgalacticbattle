// Headless checks for the battle engine and player state.
// Run with: node tests/sim.test.js

const assert = require('assert');
require('../js/data.js');
require('../js/battle.js');
require('../js/state.js');

const D = globalThis.GameData;
const { Battle, Player } = globalThis;

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function runAuto(battle, maxTurns = 1000) {
  let turns = 0;
  while (!battle.winner() && turns < maxTurns) {
    battle.tickHazard();
    if (battle.winner()) break;
    const actor = battle.advance();
    const { skipped } = battle.beginTurn(actor);
    if (!skipped && !battle.winner()) {
      const { abilityIndex, targetUid } = battle.chooseAction(actor);
      battle.act(actor, abilityIndex, targetUid);
    }
    turns++;
  }
  return { winner: battle.winner(), turns };
}

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`ok - ${name}`);
}

test('every unit has valid abilities', () => {
  for (const u of D.UNITS) {
    assert.ok(u.abilities.length >= 2, u.id);
    assert.strictEqual(u.abilities[0].cd, 0, `${u.id} basic must have no cooldown`);
    for (const ab of u.abilities) {
      for (const e of ab.effects) {
        if (e.type === 'status') assert.ok(D.STATUS_INFO[e.status], `${u.id} unknown status ${e.status}`);
      }
    }
  }
});

test('planet stages reference real units and pad to the planet squad size', () => {
  let total = 0;
  for (const planet of D.PLANETS) {
    assert.ok(planet.terrain && planet.hazard && planet.reinforce, planet.id);
    planet.stages.forEach((stg, i) => {
      total++;
      for (const id of stg.enemies) assert.strictEqual(D.UNIT_MAP[id].kind, stg.kind, `${planet.id} ${stg.name}: ${id}`);
      const enc = Player.encounter({ type: 'stage', planet: planet.id, stage: i });
      assert.strictEqual(enc.enemies.length, D.planetSquadSize(planet.id), `${planet.id} ${stg.name} squad size`);
      for (const id of enc.enemies) assert.strictEqual(D.UNIT_MAP[id].kind, stg.kind);
    });
  }
  assert.ok(total >= 60);
});

test('every planet battle finishes, hazards included', () => {
  for (const planet of D.PLANETS) {
    planet.stages.forEach((stg, i) => {
      const enc = Player.encounter({ type: 'stage', planet: planet.id, stage: i });
      const player = D.UNITS.filter((u) => u.kind === stg.kind).slice(0, 5).map((u) => ({ id: u.id, level: stg.level, stars: 2 }));
      for (let seed = 1; seed <= 4; seed++) {
        const b = new Battle(player, enc.enemies.map((id) => ({ id, level: stg.level, stars: enc.stars })), seeded(seed * 31 + i), { planet: planet.id, enemyScale: enc.enemyScale });
        assert.ok(runAuto(b).winner, `${planet.id} stage ${i} did not finish`);
      }
    });
  }
});

test('starter squad wins the first stage but not the final planet', () => {
  const starter = (kind) => D.STARTER.units.filter((id) => D.UNIT_MAP[id].kind === kind).map((id) => ({ id, level: 1, stars: 1 }));
  const rate = (planetId, stage) => {
    const enc = Player.encounter({ type: 'stage', planet: planetId, stage });
    let wins = 0;
    for (let seed = 1; seed <= 60; seed++) {
      const b = new Battle(starter(enc.kind), enc.enemies.map((id) => ({ id, level: enc.level, stars: enc.stars })), seeded(seed), { planet: planetId, enemyScale: enc.enemyScale });
      if (runAuto(b).winner === 'player') wins++;
    }
    return wins / 60;
  };
  const first = rate('tatooine', 0);
  const last = rate('exegol', 5);
  console.log(`   Tatooine 1: ${(first * 100).toFixed(0)}%, Exegol finale: ${(last * 100).toFixed(0)}%`);
  assert.ok(first > 0.8);
  assert.ok(last < 0.05);
});

test('synergies, terrain and faction unity stack correctly', () => {
  const b = D.squadBonuses(['luke', 'obi_wan', 'yoda', 'r2d2', 'ewok_warrior'], 'dagobah');
  const names = b.active.map((a) => a.name);
  for (const n of ['Jedi Order', 'Light Side Unity', 'Strong with the Force', 'Battle Formation']) assert.ok(names.includes(n), n);
  const lukeMods = b.perUnit[0];
  assert.ok(lukeMods.crit >= 0.2 && lukeMods.regen >= 0.09 - 1e-9);
  const sith = D.squadBonuses(['vader', 'darth_maul'], 'mustafar');
  assert.ok(sith.perUnit[0].double > D.BASE_DOUBLE && sith.perUnit[0].lifesteal > 0);
  const hint = D.squadBonuses(['han_solo'], null).hints.find((h) => h.trait === 'scoundrel');
  assert.ok(hint && hint.need === 2);
});

test('double hits, lifesteal and regen fire in battle', () => {
  const b = new Battle([{ id: 'darth_maul', level: 10, stars: 3 }, { id: 'vader', level: 10, stars: 3 }], [{ id: 'stormtrooper', level: 1, stars: 1 }], () => 0.001, { planet: 'mustafar' });
  const maul = b.units[0];
  maul.hp = maul.maxHp - 500;
  const evs = b.act(maul, 0, b.units[2].uid);
  assert.ok(evs.some((e) => e.type === 'double'), 'expected a double hit');
  assert.ok(evs.some((e) => e.type === 'heal' && e.source === 'lifesteal'), 'expected lifesteal');
  const jedi = new Battle([{ id: 'yoda', level: 5, stars: 1 }, { id: 'luke', level: 5, stars: 1 }], [{ id: 'stormtrooper', level: 1, stars: 1 }], seeded(1), { planet: 'dagobah' });
  jedi.units[0].hp = 10;
  assert.ok(jedi.beginTurn(jedi.units[0]).events.some((e) => e.type === 'heal' && e.source === 'regen'));
});

test('planet hazards trigger on schedule', () => {
  const b = new Battle([{ id: 'luke', level: 5, stars: 1 }], [{ id: 'stormtrooper', level: 5, stars: 1 }], seeded(2), { planet: 'mustafar' });
  b.turnCount = 7;
  assert.strictEqual(b.tickHazard(), null);
  b.turnCount = 8;
  const evs = b.tickHazard();
  assert.ok(evs && evs[0].type === 'hazard' && evs[0].id === 'eruption');
  assert.ok(evs.some((e) => e.type === 'damage' && e.source === 'hazard'));
  assert.strictEqual(b.tickHazard(), null, 'fires once per turn count');
});

test('classes: every unit has at least one and units can have several', () => {
  for (const u of D.UNITS) assert.ok(D.classesOf(u).length >= 1, u.id);
  assert.ok(D.classesOf(D.UNIT_MAP.obi_wan).length >= 2);
  // The first tag is always what the card does: tanks, healers and supports
  // lead with their role, attackers with Fighter or Ranged.
  for (const u of D.UNITS) {
    const first = D.classesOf(u)[0];
    const want = { tank: 'tank', healer: 'healer', support: 'support' }[u.role];
    if (want) assert.strictEqual(first, want, `${u.id} leads with ${want}`);
    else assert.ok(['fighter', 'ranged', 'starfighter', 'bomber', 'gunship'].includes(first), `${u.id} leads with an attack class (${first})`);
  }
  assert.deepStrictEqual(D.classesOf(D.UNIT_MAP.clone_trooper), ['tank']);
});

test('flash sale and shell game', () => {
  Player.reset();
  Player.state.credits = 1e6;
  Player.state.crystals = 1e6;
  const f = Player.flashSale(Date.now());
  assert.strictEqual(f.items.length, 2);
  const before = Player.state.credits;
  assert.ok(Player.buyFlash(0) && f.items[0].sold);
  assert.strictEqual(before - Player.state.credits, f.items[0].cost.credits);
  const key = Object.keys(f.items[1].cost)[0];
  const had = Player.state[key];
  assert.ok(Player.buyFlash(1));
  assert.strictEqual(had - Player.state[key], f.items[1].cost[key], 'crate flash price should be the sale price');
  const g = Player.shellGame(100, 1, () => 0.5);
  assert.strictEqual(g.ball, 1);
  assert.strictEqual(g.won, Math.round(100 * D.SHELL_PAYOUT));
});

test('taunt forces single-target attacks', () => {
  const b = new Battle(
    [{ id: 'rebel_soldier', level: 1, stars: 1 }],
    [{ id: 'stormtrooper', level: 1, stars: 1 }, { id: 'battle_droid', level: 1, stars: 1 }],
    seeded(3),
  );
  const [attacker, tank] = [b.units[0], b.units[1]];
  tank.statuses.taunt = 2;
  assert.deepStrictEqual(b.validTargets(attacker, 0).map((u) => u.uid), [tank.uid]);
  assert.throws(() => b.act(attacker, 0, b.units[2].uid));
});

test('stun skips the turn and cooldowns tick down', () => {
  const b = new Battle([{ id: 'han_solo', level: 1, stars: 1 }], [{ id: 'stormtrooper', level: 1, stars: 1 }], seeded(9));
  const han = b.units[0];
  han.statuses.stun = 1;
  han.cooldowns[1] = 2;
  const { skipped } = b.beginTurn(han);
  assert.ok(skipped);
  assert.strictEqual(han.statuses.stun, undefined);
  assert.strictEqual(han.cooldowns[1], 1);
});

test('ultimate charges, fires once full, then resets', () => {
  const b = new Battle([{ id: 'vader', level: 1, stars: 1 }], [{ id: 'stormtrooper', level: 1, stars: 1 }], seeded(4));
  const vader = b.units[0];
  const ultIndex = vader.abilities.length - 1;
  assert.ok(vader.abilities[ultIndex].ultimate);
  assert.ok(!b.isReady(vader, ultIndex));
  b.act(vader, 0, b.units[1].uid);
  assert.ok(vader.ult > 0 && vader.ult < 100);
  vader.ult = 100;
  assert.strictEqual(b.chooseAction(vader).abilityIndex, ultIndex);
  b.act(vader, ultIndex, null);
  assert.strictEqual(vader.ult, 0);
});

test('packs, duplicates, leveling and stars', () => {
  Player.reset();
  const before = Player.state.credits;
  const res = Player.openPack('recruit', seeded(5));
  assert.strictEqual(res.length, 3);
  assert.strictEqual(Player.state.credits, before - 300);
  const dup = Player.grantCard('rebel_soldier');
  assert.strictEqual(dup.isNew, false);
  Player.state.units.rebel_soldier.shards = 10;
  assert.ok(Player.starUp('rebel_soldier'));
  assert.strictEqual(Player.unit('rebel_soldier').stars, 2);
  Player.state.credits = 10000;
  assert.ok(Player.levelUp('rebel_soldier'));
  assert.strictEqual(Player.unit('rebel_soldier').level, 2);
  Player.state.crystals = 0;
  assert.strictEqual(Player.openPack('holocron'), null);
});

test('stage rewards: crystals only on first clear, spin multiplies credits', () => {
  Player.reset();
  const first = Player.completeEncounter({ type: 'stage', planet: 'tatooine', stage: 0 }, true, seeded(2));
  const again = Player.completeEncounter({ type: 'stage', planet: 'tatooine', stage: 0 }, true, seeded(3));
  assert.ok(first.firstClear && first.crystals > 0);
  assert.ok(!again.firstClear && again.crystals === 0);
  assert.strictEqual(first.credits, Math.round(first.base * first.mult));
  assert.strictEqual(Player.planetCleared('tatooine'), 1);
});

test('bosses: stun immunity, enrage below half HP, rewards and unlocks', () => {
  const b = new Battle([{ id: 'kylo_ren', level: 20, stars: 3 }], [{ id: 'rancor', level: 8, stars: 1 }], seeded(8));
  const [kylo, rancor] = b.units;
  assert.ok(rancor.boss && rancor.maxHp > 5000);
  b.act(kylo, 1, rancor.uid);
  assert.ok(!rancor.statuses.stun, 'boss must be immune to stun');
  const events = [];
  b.applyDamage(rancor, rancor.hp - Math.floor(rancor.maxHp * 0.4), false, events);
  assert.ok(rancor.enraged && rancor.statuses.offUp > 50 && rancor.ult === 100);
  assert.ok(events.some((e) => e.type === 'enrage'));

  Player.reset();
  const enc = D.BOSS_ENCOUNTERS[0];
  assert.ok(!Player.bossUnlocked(enc));
  Player.state.planets[enc.unlock] = D.PLANET_MAP[enc.unlock].stages.length;
  assert.ok(Player.bossUnlocked(enc));
  assert.ok(Player.encounter({ type: 'boss', boss: enc.id }).enemies.includes(enc.id));
  const r = Player.completeEncounter({ type: 'boss', boss: enc.id }, true, seeded(4));
  assert.ok(r.firstClear && r.aurodium > 0 && r.card);
  assert.ok(['epic', 'legendary'].includes(D.UNIT_MAP[r.card.id].rarity));
});

test('every boss fight finishes', () => {
  for (const enc of D.BOSS_ENCOUNTERS) {
    const e = Player.encounter({ type: 'boss', boss: enc.id });
    const squad = D.UNITS.filter((u) => u.kind === enc.kind && u.rarity !== 'common').slice(0, D.SQUAD_SIZE[enc.kind])
      .map((u) => ({ id: u.id, level: enc.level + 3, stars: 3 }));
    const res = runAuto(new Battle(squad, e.enemies.map((id) => ({ id, level: enc.level, stars: 1 })), seeded(5), { planet: enc.planet }), 3000);
    assert.ok(res.winner, enc.id);
  }
});

test('luck: pity guarantees a legendary, strongbox always has one, charms boost odds', () => {
  Player.reset();
  Player.state.credits = 1e6;
  Player.state.luck.pity = D.LUCK.pityCrates - 1;
  const res = Player.openPack('recruit', () => 0.01);
  assert.ok(res.some((r) => D.UNIT_MAP[r.id].rarity === 'legendary'));
  assert.strictEqual(Player.state.luck.pity, 0);
  Player.state.aurodium = 12;
  assert.ok(Player.openPack('strongbox').some((r) => ['legendary', 'mythic'].includes(D.UNIT_MAP[r.id].rarity)));
  const pack = D.PACKS[0];
  const base = Player.effectiveOdds(pack).legendary;
  Player.state.crystals = 100;
  assert.ok(Player.buyCharm('chance_cube'));
  assert.ok(Player.effectiveOdds(pack).legendary > base);
});

test('sabacc pays the picked card and market stock can be bought', () => {
  Player.reset();
  Player.state.credits = 5000;
  const r = Player.sabacc(100, 1, seeded(12));
  assert.strictEqual(r.won, Math.round(100 * r.cards[1].mult));
  assert.strictEqual(Player.state.credits, 5000 - 100 + r.won);
  const stock = Player.marketStock(Date.now());
  assert.strictEqual(stock.items.length, 5);
  Player.state.credits = 1e6;
  Player.state.crystals = 1e6;
  const bought = Player.buyMarket(0);
  assert.ok(bought && stock.items[0].sold);
  assert.strictEqual(Player.buyMarket(0), null);
});

test('auto-build picks a full squad with a tank and healer when owned', () => {
  Player.reset();
  const squad = Player.autoSquad('character');
  assert.strictEqual(squad.length, Player.slots());
  assert.ok(squad.some((id) => D.UNIT_MAP[id].role === 'tank'));
  assert.ok(squad.some((id) => D.UNIT_MAP[id].role === 'healer'));
});

test('squad slots unlock with both account level and campaign progress', () => {
  Player.reset();
  assert.strictEqual(Player.slots(), 3);
  assert.strictEqual(Player.encounter({ type: 'stage', planet: 'tatooine', stage: 0 }).enemies.length, 3);
  assert.strictEqual(Player.encounter({ type: 'stage', planet: 'hoth', stage: 0 }).enemies.length, 4);
  assert.strictEqual(Player.encounter({ type: 'stage', planet: 'dagobah', stage: 0 }).enemies.length, 5);
  Player.gainXp(5000);
  assert.ok(Player.state.account.level >= 6);
  assert.strictEqual(Player.slots(), 3, 'level alone is not enough');
  Player.state.planets.tatooine = 6;
  assert.strictEqual(Player.slots(), 4);
  Player.state.planets.hoth = 6;
  assert.strictEqual(Player.slots(), 5);
  Player.reset();
  Player.state.planets.tatooine = 6;
  Player.state.planets.hoth = 6;
  assert.strictEqual(Player.slots(), 3, 'campaign alone is not enough');
  Player.setSquad('character', ['rebel_soldier', 'clone_trooper', 'ewok_warrior', 'battle_droid', 'jawa']);
  assert.strictEqual(Player.squadEntries('character').length, 3);
});

test('battles award XP and level-ups pay out', () => {
  Player.reset();
  const credits = Player.state.credits;
  const r = Player.completeEncounter({ type: 'stage', planet: 'tatooine', stage: 0 }, true, seeded(1));
  assert.ok(r.xp > 0);
  const ups = Player.gainXp(D.xpToNext(Player.state.account.level));
  assert.strictEqual(ups.length, 1);
  assert.ok(Player.state.credits > credits + r.credits);
  const loss = Player.completeEncounter({ type: 'stage', planet: 'tatooine', stage: 1 }, false);
  assert.ok(loss.lost && loss.xp === D.XP.loss);
});

test('droid roster: new droids have traits, classes and a signature ultimate', () => {
  for (const id of ['c3po', 'bb8', 'k2so', 'chopper', 'ig88', 'ig11', 'droideka', 'b2_droid', 'magnaguard', 'vulture_droid']) {
    const u = D.UNIT_MAP[id];
    assert.ok(u, id);
    assert.ok(D.traitsOf(id).includes('droid'), id);
    assert.ok(D.classesOf(u).includes('droid'), id);
    assert.ok(D.ULT_ANIM[id], id);
  }
  const b = D.squadBonuses(['c3po', 'bb8', 'k2so', 'chopper', 'r2d2'], null);
  const net = b.active.find((a) => a.trait === 'droid');
  assert.ok(net && net.need === 4);
});

test('group and role synergies: full Bad Batch, Nightsisters, Medical Corps', () => {
  const bb = D.squadBonuses(['hunter', 'wrecker', 'tech', 'crosshair', 'echo'], null);
  const cf = bb.active.find((a) => a.key === 'badbatch');
  assert.ok(cf && cf.count === 5 && cf.tier === 2 && cf.members.length === 5);
  assert.ok(bb.perUnit[0].double >= 0.2 && bb.perUnit[0].regen >= 0.03);
  const four = D.squadBonuses(['hunter', 'wrecker', 'tech', 'crosshair'], null).active.find((a) => a.key === 'badbatch');
  assert.strictEqual(four.tier, 1, 'four members reach tier 2, not full Bad Batch');
  const ns = D.squadBonuses(['talzin', 'nightsister_acolyte'], null);
  assert.ok(ns.active.some((a) => a.key === 'nightsister'));
  const med = D.squadBonuses(['rebel_medic', 'two_onebee', 'luke'], null);
  const corps = med.active.find((a) => a.key === 'healer');
  assert.ok(corps && corps.members.length === 2 && med.perUnit[2].regen >= 0.03);
  for (const a of bb.active) assert.ok(a.key && Array.isArray(a.members), a.name);
});

test('the Inquisitorius: five dark side hunters with a full-squad bonus', () => {
  const ids = ['grand_inquisitor', 'second_sister', 'fifth_brother', 'seventh_sister', 'eighth_brother'];
  for (const id of ids) {
    const u = D.UNIT_MAP[id];
    assert.ok(u && u.faction === 'dark' && D.TRAITS[id].includes('inquisitor'), id);
    assert.ok(D.ULT_ANIM[id], `${id} has a signature ultimate animation`);
  }
  const full = D.squadBonuses(ids, null);
  const inq = full.active.find((a) => a.key === 'inquisitor');
  assert.ok(inq && inq.count === 5 && inq.tier === 2 && inq.members.length === 5);
  assert.ok(full.perUnit[0].lifesteal >= 0.18 && full.perUnit[0].double >= 0.2);
  const pair = D.squadBonuses(ids.slice(0, 2), null).active.find((a) => a.key === 'inquisitor');
  assert.strictEqual(pair.tier, 0);
});

test('Battle of Coruscant: ten stages after Exegol with a wreckage hazard', () => {
  const p = D.PLANET_MAP.coruscant_siege;
  assert.ok(p && p.stages.length === 10 && p.env === 'siege');
  assert.strictEqual(D.PLANETS[D.PLANETS.length - 1].id, 'coruscant_siege');
  assert.ok(p.stages.some((s) => s.kind === 'ship') && p.stages.some((s) => s.kind === 'character'));
  assert.strictEqual(p.hazard.id, 'debris');
});

test('daily login: streak climbs on consecutive days, resets after a gap, cycles through 7 days', () => {
  Player.reset();
  const day = (n) => new Date(2026, 9, 1 + n, 12).getTime();
  const c0 = Player.state.credits;
  assert.strictEqual(Player.claimDaily(day(0)).streak, 1);
  assert.strictEqual(Player.claimDaily(day(0)), null, 'only once per day');
  assert.strictEqual(Player.state.credits, c0 + D.DAILY[0].credits);
  for (let n = 1; n < 7; n++) assert.strictEqual(Player.claimDaily(day(n)).streak, n + 1);
  assert.ok(Player.state.aurodium >= 1, 'day 7 pays aurodium');
  assert.strictEqual(Player.dailyStatus(day(7)).dayIndex, 0, 'cycle repeats');
  assert.strictEqual(Player.claimDaily(day(9)).streak, 1, 'a missed day resets the streak');
  assert.strictEqual(Player.state.daily.best, 7);
});

test('endless tower: deterministic floors, bosses every 10, climbing, checkpoints and scaling', () => {
  const a = D.towerFloor(7, 42, 5);
  const b = D.towerFloor(7, 42, 5);
  assert.deepStrictEqual(a, b, 'same seed, same floor');
  assert.ok(D.towerFloor(10, 42, 5).boss && D.towerFloor(20, 42, 5).boss);
  assert.ok(D.towerFloor(30, 1, 5).enemies.includes(D.towerFloor(30, 1, 5).boss));
  for (let f = 1; f <= 60; f++) {
    const fl = D.towerFloor(f, 9, 4);
    assert.strictEqual(fl.enemies.length, 4, `floor ${f} squad size`);
    for (const id of fl.enemies) assert.ok(D.UNIT_MAP[id], `${id} exists`);
    assert.ok(D.PLANET_MAP[fl.planet]);
  }
  assert.ok(D.towerFloor(40, 3, 5).enemyScale > D.towerFloor(5, 3, 5).enemyScale);
  assert.ok(D.towerRewards(30).credits > D.towerRewards(3).credits);
  assert.strictEqual(D.towerCheckpoint(17), 11);
  Player.reset();
  const won = Player.completeEncounter({ type: 'tower', floor: 1 }, true, seeded(1));
  assert.strictEqual(won.towerFloor, 2);
  Player.state.tower.floor = 14;
  const lost = Player.completeEncounter({ type: 'tower', floor: 14 }, false);
  assert.strictEqual(lost.towerFloor, 11);
  assert.strictEqual(Player.state.tower.best, 1);
  const enc = Player.encounter({ type: 'tower' });
  const battle = new Battle(Player.squadEntries(enc.kind), enc.enemies.map((id) => ({ id, level: enc.level, stars: enc.stars })), seeded(3), { planet: enc.planet, enemyScale: enc.enemyScale });
  assert.ok(runAuto(battle).winner, 'tower battles finish');
});

test('every unit has a full-screen signature ultimate', () => {
  const src = require('fs').readFileSync(require('path').join(__dirname, '../js/ults.js'), 'utf8');
  const body = src.slice(src.indexOf('const SIG = {'), src.indexOf('// ---------- Props'));
  const keys = [...body.matchAll(/^\s+([a-z0-9_]+): \{/gm)].map((m) => m[1]);
  for (const u of D.UNITS) assert.ok(keys.includes(u.id), `${u.id} has a signature ultimate`);
  // No two units share the same move + prop + impact combination.
  const seen = {};
  for (const [, id, o] of body.matchAll(/^\s+([a-z0-9_]+): (\{.*\}),?$/gm)) {
    if (o.includes('legacy')) continue;
    const k = ['move', 'prop', 'impact'].map((f) => (o.match(new RegExp(`${f}: '(\\w+)'`)) || [])[1]).join('/');
    assert.ok(!seen[k], `${id} duplicates ${seen[k]}'s ultimate (${k})`);
    seen[k] = id;
  }
});

test('every unit and boss has cover art and a bio', () => {
  require('../js/art.js');
  for (const u of [...D.UNITS, ...D.BOSSES]) {
    assert.ok(D.BIOS[u.id], `${u.id} bio`);
    if (u.kind === 'character') assert.ok(globalThis.Art.CHARACTER_IDS.includes(u.id), `${u.id} art`);
    else assert.ok(globalThis.Art.SHIP_SHAPES.includes(u.shape), `${u.id} ship art`);
  }
});

test('secret trials: entry cost climbs on defeat, wins pay cards only', () => {
  Player.reset();
  const id = 'boss_daughter';
  assert.strictEqual(Player.secretCost(id), 0, 'first attempt is free');
  const ladder = [];
  for (let i = 0; i < 8; i++) {
    Player.completeSecret({ type: 'secret', boss: id }, false, seeded(i), 3);
    ladder.push(Player.secretCost(id));
  }
  assert.deepStrictEqual(ladder, [3, 5, 8, 10, 15, 25, 25, 25]);
  Player.state.crystals = 10;
  assert.ok(!Player.paySecretEntry(id), 'cannot enter without enough Kyber');
  Player.state.crystals = 35;
  assert.ok(Player.paySecretEntry(id) && Player.state.crystals === 10, 'entry fee is charged');
  const before = { credits: Player.state.credits, crystals: Player.state.crystals, aurodium: Player.state.aurodium };
  const win = Player.completeSecret({ type: 'secret', boss: id }, true, seeded(1), 3);
  assert.ok(win.firstClear && win.cards.length && win.cards[0].isNew, 'first win grants the exclusive card');
  assert.ok(Player.owns('the_daughter'));
  assert.strictEqual(Player.secretCost(id), 0, 'a win resets the price');
  // Only account level-ups (from XP) can pay credits; the trial itself pays none.
  const lvl = win.levelUps.reduce((a, u) => a + u.reward.credits, 0);
  assert.strictEqual(Player.state.credits - before.credits, lvl, 'no credits from trials');
  assert.strictEqual(Player.state.aurodium, before.aurodium, 'no aurodium from trials');
  const again = Player.completeSecret({ type: 'secret', boss: id }, true, seeded(2), 3);
  assert.ok(!again.cards[0].isNew && again.cards[0].shards > 0, 'repeat wins pay shards');
});

test('secret trials unlock with level, campaign progress and the earlier trial', () => {
  Player.reset();
  for (const b of D.SECRET_BOSSES) assert.ok(!Player.secretOpen(b.id), `${b.id} starts sealed`);
  Player.state.account.level = 5;
  const clear = (id) => { Player.state.planets[id] = D.PLANET_MAP[id].stages.length; };
  clear('tatooine');
  assert.ok(Player.planetComplete('tatooine'), 'progress helper clears a planet');
  assert.ok(Player.secretOpen('boss_daughter'), 'Trial of Light: Lv 5 + Tatooine');
  assert.ok(!Player.secretOpen('boss_son'));
  Player.state.account.level = 14;
  ['hoth', 'dagobah', 'bespin', 'endor'].forEach(clear);
  assert.ok(Player.secretOpen('boss_son'), 'Trial of Shadow: Lv 9 + Dagobah');
  assert.ok(!Player.secretOpen('boss_guardian'), 'Sealed Temple needs the Trial of Light won');
  Player.state.secret.beaten.boss_daughter = 1;
  assert.ok(Player.secretOpen('boss_guardian'));
  const levels = D.SECRET_BOSSES.map((b) => b.level);
  assert.ok(levels.every((l) => l >= 9 && l <= 30), 'trial enemy levels stay in range');
});

test('secret cards have their own rarity and never come from crates, shops or bosses', () => {
  const secret = D.UNITS.filter((u) => u.exclusive);
  assert.strictEqual(secret.length, 6);
  for (const u of secret) assert.strictEqual(u.rarity, 'secret', `${u.id} is Secret rarity`);
  assert.ok(D.RARITIES.secret.weight > D.RARITIES.mythic.weight, 'Secret ranks above Mythic');
  for (const pack of D.PACKS) assert.ok(!('secret' in pack.odds), `${pack.id} has no Secret odds`);
  Player.reset();
  Object.assign(Player.state, { credits: 1e9, crystals: 1e9, aurodium: 1e9 });
  const seen = new Set();
  for (const pack of D.PACKS) for (let i = 0; i < 300; i++) (Player.openPack(pack.id, seeded(i * 7 + pack.id.length)) || []).forEach((r) => seen.add(r.id));
  for (let i = 0; i < 200; i++) {
    Player.restock(Date.now() + i * 1e7, seeded(i));
    (Player.state.market.items || []).forEach((it) => seen.add(it.id));
  }
  for (const u of secret) assert.ok(!seen.has(u.id), `${u.id} never drops outside the Monolith`);
});

test('a new recruit starts empty and the tutorial hands out the starter squad once', () => {
  globalThis.localStorage = { store: {}, getItem(k) { return this.store[k] || null; }, setItem(k, v) { this.store[k] = String(v); }, removeItem(k) { delete this.store[k]; } };
  Player.load();
  assert.ok(Player.tutorialPending(), 'tutorial pending on first open');
  assert.strictEqual(Object.keys(Player.state.units).length, 0, 'no cards before the tutorial');
  assert.strictEqual(Player.state.credits, 0);
  const res = Player.finishTutorial('completed');
  assert.strictEqual(res.units.length, D.STARTER.units.length, 'all ten starter cards unlock');
  assert.strictEqual(Player.state.credits, D.STARTER.credits);
  assert.strictEqual(Player.state.crystals, D.STARTER.crystals);
  assert.ok(Player.state.squads.character.length > 0 && Player.state.squads.ship.length > 0, 'squads are filled');
  assert.strictEqual(Player.finishTutorial('completed'), null, 'it only pays out once');
  Player.load();
  assert.ok(!Player.tutorialPending(), 'never shown again once done');
  delete globalThis.localStorage;
});

test('existing players get the tutorial once but no second starter payout', () => {
  globalThis.localStorage = { store: {}, getItem(k) { return this.store[k] || null; }, setItem(k, v) { this.store[k] = String(v); }, removeItem(k) { delete this.store[k]; } };
  Player.reset();
  delete Player.state.tutorial;
  Player.state.credits = 1234;
  Player.save();
  Player.load();
  assert.ok(Player.tutorialPending(), 'saves from before the tutorial get it');
  assert.strictEqual(Object.keys(Player.state.units).length, D.STARTER.units.length, 'they keep their cards');
  const res = Player.finishTutorial('skipped');
  assert.strictEqual(res.credits, 0);
  assert.strictEqual(Player.state.credits, 1234, 'no extra starter credits');
  assert.strictEqual(Player.state.tutorial.how, 'skipped');
  delete globalThis.localStorage;
});

test('beating a replayed tutorial earns the secret badge, skipping a replay does not', () => {
  Player.reset();
  assert.ok(!Player.finishTutorial('completed').again, 'the first clear is not a replay');
  Player.replayTutorial();
  assert.ok(Player.tutorialPending() && Player.state.tutorial.badge, 'replay keeps the badge');
  const before = Player.state.credits;
  const r = Player.finishTutorial('completed');
  assert.ok(r.again && Player.state.tutorial.replays === 1, 'replay clear counts');
  assert.strictEqual(Player.state.credits, before, 'replays pay nothing');
  Player.replayTutorial();
  assert.ok(!Player.finishTutorial('skipped').again, 'skipping a replay is not a clear');
  assert.strictEqual(Player.state.tutorial.replays, 1);
  for (let i = 0; i < 20; i++) { Player.replayTutorial(); Player.finishTutorial('completed'); }
  assert.strictEqual(Player.state.tutorial.replays, 9, 'counter caps so the tape reads TAKE 10 at most');
});

test('the training battle cannot be lost', () => {
  const squad = ['rebel_soldier', 'jawa'].map((id) => ({ id, level: 1, stars: 1 }));
  const foes = ['darth_vader', 'darth_vader', 'darth_vader'].filter((id) => D.UNIT_MAP[id]).map((id) => ({ id, level: 40, stars: 7 }));
  const b = new Battle(squad, foes.length ? foes : [{ id: 'stormtrooper', level: 60, stars: 7 }], seeded(3), { tutorial: true });
  for (let i = 0; i < 400; i++) {
    const actor = b.advance();
    const { skipped } = b.beginTurn(actor);
    if (!skipped && actor.side === 'enemy') { const a = b.chooseAction(actor); b.act(actor, a.abilityIndex, a.targetUid); }
  }
  assert.ok(b.side('player').every((u) => u.alive && u.hp > 0), 'nobody on the player side falls');
});

console.log(`\n${passed} tests passed`);
