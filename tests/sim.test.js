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

test('campaign stages reference real units of the right kind', () => {
  for (const [kind, camp] of Object.entries(D.CAMPAIGNS)) {
    for (const st of camp.stages) {
      for (const id of st.enemies) assert.strictEqual(D.UNIT_MAP[id].kind, kind, `${st.name}: ${id}`);
      assert.ok(st.enemies.length <= D.SQUAD_SIZE[kind]);
    }
  }
});

test('every campaign battle finishes', () => {
  for (const [kind, camp] of Object.entries(D.CAMPAIGNS)) {
    camp.stages.forEach((st, i) => {
      for (let seed = 1; seed <= 20; seed++) {
        const player = D.UNITS.filter((u) => u.kind === kind).slice(0, D.SQUAD_SIZE[kind])
          .map((u) => ({ id: u.id, level: st.level, stars: 2 }));
        const enemies = st.enemies.map((id) => ({ id, level: st.level, stars: 1 }));
        const res = runAuto(new Battle(player, enemies, seeded(seed * 100 + i)));
        assert.ok(res.winner, `${kind} stage ${i} did not finish`);
      }
    });
  }
});

test('starter squad can win the first stages but not the last', () => {
  const winRate = (kind, stageIdx, level) => {
    const st = D.CAMPAIGNS[kind].stages[stageIdx];
    const squad = freshSquad(kind, level);
    let wins = 0;
    for (let seed = 1; seed <= 200; seed++) {
      const enemies = st.enemies.map((id) => ({ id, level: st.level, stars: 1 }));
      if (runAuto(new Battle(squad, enemies, seeded(seed))).winner === 'player') wins++;
    }
    return wins / 200;
  };
  const freshSquad = (kind, level) => D.STARTER.units.filter((id) => D.UNIT_MAP[id].kind === kind)
    .map((id) => ({ id, level, stars: 1 }));
  const first = winRate('character', 0, 1);
  const last = winRate('character', D.CAMPAIGNS.character.stages.length - 1, 1);
  const shipFirst = winRate('ship', 0, 1);
  console.log(`   ground stage 1: ${(first * 100).toFixed(0)}%, final stage: ${(last * 100).toFixed(0)}%, fleet stage 1: ${(shipFirst * 100).toFixed(0)}%`);
  assert.ok(first > 0.7, 'first ground stage should be easy');
  assert.ok(shipFirst > 0.7, 'first fleet stage should be easy');
  assert.ok(last < 0.05, 'final stage should need progression');
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
  const first = Player.completeEncounter({ type: 'stage', kind: 'character', stage: 0 }, true, seeded(2));
  const again = Player.completeEncounter({ type: 'stage', kind: 'character', stage: 0 }, true, seeded(3));
  assert.ok(first.firstClear && first.crystals > 0);
  assert.ok(!again.firstClear && again.crystals === 0);
  assert.strictEqual(first.credits, Math.round(first.base * first.mult));
  assert.strictEqual(Player.state.progress.character, 1);
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
  Player.state.progress[enc.unlock.kind] = enc.unlock.stage;
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
    const res = runAuto(new Battle(squad, e.enemies.map((id) => ({ id, level: enc.level, stars: 1 })), seeded(5)), 3000);
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
  assert.strictEqual(squad.length, 4);
  assert.ok(squad.some((id) => D.UNIT_MAP[id].role === 'tank'));
  assert.ok(squad.some((id) => D.UNIT_MAP[id].role === 'healer'));
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
