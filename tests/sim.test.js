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
  assert.ok(D.classesOf(D.UNIT_MAP.obi_wan).length >= 3);
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
  assert.ok(Player.openPack('strongbox').some((r) => D.UNIT_MAP[r.id].rarity === 'legendary'));
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

test('every unit and boss has cover art and a bio', () => {
  require('../js/art.js');
  for (const u of [...D.UNITS, ...D.BOSSES]) {
    assert.ok(D.BIOS[u.id], `${u.id} bio`);
    if (u.kind === 'character') assert.ok(globalThis.Art.CHARACTER_IDS.includes(u.id), `${u.id} art`);
    else assert.ok(globalThis.Art.SHIP_SHAPES.includes(u.shape), `${u.id} ship art`);
  }
});

console.log(`\n${passed} tests passed`);
