// Update 2.4 "Liberation": every world grows to 10 stages with its own cast,
// a main boss that liberates it and an optional boss on the side, the new
// cards that go with them, and the Liberator of the Galaxy badge (beat all
// 22 bosses) which brings the Bendu.
//
// Rules: a world's next neighbour opens once its 10 stages are cleared; the
// world counts as liberated when its main boss falls. Players who had
// finished a world before 2.4 keep every stage they beat, keep their squad
// slots and keep the next worlds open; they go back for the new stages and
// the boss to liberate it again.
//
// Off until 2.4 ships (late November, date to be set). Testers switch it on
// early on one device with the LIBERATE24 code (which also switches on 2.2).
(function (root) {
  'use strict';
  const D = root.GameData;
  const UI = root.UI;
  const Player = root.Player;
  if (!D || !Player) return;

  // ---------- Release switch ----------
  const RELEASE24 = root.__v24Test != null ? root.__v24Test : null;
  const TEST_KEY = 'swcg-v24-test';
  const test = (v) => {
    try {
      if (v === undefined) return localStorage.getItem(TEST_KEY) === '1';
      if (v) localStorage.setItem(TEST_KEY, '1'); else localStorage.removeItem(TEST_KEY);
    } catch (e) { return false; }
    return !!v;
  };
  const on = () => (RELEASE24 != null && Date.now() >= RELEASE24) || test();
  root.Update24 = { on, test, at: RELEASE24 };
  const code = () => String.fromCharCode(76, 73, 66, 69, 82, 65, 84, 69, 50, 52);
  const H = UI && UI.hooks;
  if (H) {
    const before = H.redeem;
    H.redeem = (c) => {
      if (c !== code()) return before ? before(c) : false;
      test(true);
      if (root.Update22 && root.Update22.test && !root.Update22.on()) root.Update22.test(true);
      UI.toast('2.4 Liberation test ON for this device: 10-stage worlds, every main and optional boss, the new cards and the Liberator badge. Reloading…');
      setTimeout(() => location.reload(), 1600);
      return true;
    };
  }
  if (!on()) return;

  // ---------- Units ----------
  const dmg = (mult, hits) => ({ type: 'damage', mult, hits: hits || 1 });
  const heal = (pct) => ({ type: 'heal', pct });
  const buff = (status, turns) => ({ type: 'status', status, turns, chance: 1 });
  const debuff = (status, turns, chance) => ({ type: 'status', status, turns, chance: chance == null ? 1 : chance });
  const U = (name, target, effects, desc, quote, hits) => ({ name, cd: 0, target, effects, desc, quote, ultimate: true, ...(hits ? { hits } : {}) });
  // hits: how many random enemies a 'randomEnemies' ability picks.
  const A = (name, cd, target, effects, desc, hits) => ({ name, cd, target, effects, desc, ...(hits ? { hits } : {}) });

  // New opponents (they can also turn up in crates once 2.4 is out).
  const CARDS24 = [
    { id: 'gamorrean_guard', name: 'Gamorrean Guard', kind: 'character', faction: 'dark', rarity: 'rare', role: 'tank', spd: 92, traits: ['scoundrel', 'native'],
      abilities: [A('Axe Chop', 0, 'enemy', [dmg(1.25)], 'Deal damage to one enemy.'), A('Palace Bulwark', 3, 'self', [buff('taunt', 2), buff('defUp', 2)], 'Gain Taunt and Defense Up for 2 turns.'), A('Hungry Roar', 4, 'enemy', [{ type: 'dispel' }, { ...buff('offUp', 2), on: 'self' }], 'Remove an enemy\'s buffs and gain Offense Up.')],
      ultimate: U('Jabba\'s Muscle', 'enemy', [dmg(3.0), debuff('stun', 1)], 'A huge axe swing: massive damage and Stun.', 'Grrraaagh!') },
    { id: 'snowtrooper', name: 'Snowtrooper', kind: 'character', faction: 'dark', rarity: 'common', role: 'attacker', spd: 110, traits: ['trooper', 'empire'],
      abilities: [A('E-11 Burst', 0, 'enemy', [dmg(0.6, 2)], 'Two quick shots at one enemy.'), A('Freeze Grenade', 3, 'enemy', [dmg(1.0), { type: 'tm', amount: -35 }], 'Damage and slow the target down.'), A('Echo Base Assault', 3, 'enemy', [{ ...dmg(1.2), execute: { below: 0.5, bonus: 1.4 } }], 'Heavy damage, +40% against enemies under half health.')],
      ultimate: U('Blizzard Force', 'allEnemies', [dmg(1.2), { type: 'tm', amount: -30 }], 'Fire on every enemy and slow them all down.', 'Blizzard Force, move in.') },
    { id: 'wing_guard', name: 'Cloud City Wing Guard', kind: 'character', faction: 'light', rarity: 'common', role: 'support', spd: 112, traits: ['scoundrel'],
      abilities: [A('Stun Pistol', 0, 'enemy', [dmg(1.15), debuff('stun', 1, 0.35)], 'Damage with a 35% Stun chance.'), A('Cloud City Patrol', 4, 'allAllies', [buff('defUp', 2)], 'Every ally gains Defense Up.'), A('Call Backup', 3, 'weakestAlly', [heal(0.15)], 'Heal the weakest ally 15%.')],
      ultimate: U('Lando\'s Orders', 'allAllies', [buff('offUp', 2), { type: 'tm', amount: 25 }], 'Every ally gains Offense Up and a speed boost.', 'Close all the landing platforms!') },
    { id: 'scout_trooper', name: 'Scout Trooper', kind: 'character', faction: 'dark', rarity: 'common', role: 'attacker', spd: 128, traits: ['trooper', 'empire'],
      abilities: [A('Hold-out Blaster', 0, 'enemy', [dmg(1.0)], 'A fast shot.'), A('Speeder Strafe', 3, 'randomEnemies', [dmg(0.8)], 'Two hits on random enemies.', 2), A('Recon', 3, 'enemy', [dmg(0.7), debuff('defDown', 2)], 'Damage and Defense Down.')],
      ultimate: U('Speeder Chase', 'enemy', [dmg(0.8, 4), { ...buff('offUp', 2), on: 'self' }], 'Four hits and Offense Up.', 'Go for help! Go!') },
    { id: 'shoretrooper', name: 'Shoretrooper', kind: 'character', faction: 'dark', rarity: 'rare', role: 'tank', spd: 100, traits: ['trooper', 'empire'],
      abilities: [A('E-22 Burst', 0, 'enemy', [dmg(0.55, 2)], 'Two shots.'), A('Shield Gate', 3, 'ally', [heal(0.15), buff('defUp', 1)], 'An ally is shielded: heal 15% and Defense Up.'), A('Hold the Beach', 3, 'self', [buff('taunt', 2), buff('defUp', 2)], 'Taunt and Defense Up.')],
      ultimate: U('Citadel Defense', 'allAllies', [heal(0.2), { ...buff('taunt', 2), on: 'self' }], 'Every ally heals 20%; he Taunts.', 'Lock down the beach.') },
    { id: 'cf66_trooper', name: 'Clone Force 66 Trooper', kind: 'character', faction: 'dark', rarity: 'rare', role: 'attacker', spd: 116, traits: ['trooper', 'republic'],
      abilities: [A('Blaster Volley', 0, 'enemy', [dmg(0.7, 2)], 'Two quick shots.'), A('Execute Order', 3, 'enemy', [{ ...dmg(1.5), vsJedi: 1.5 }], 'Heavy damage, +50% against Jedi.'), A('Purge Formation', 4, 'self', [buff('offUp', 2)], 'Gain Offense Up.')],
      ultimate: U('Good Soldiers Follow Orders', 'allEnemies', [{ ...dmg(1.4), vsJedi: 2 }], 'Fire on every enemy; Jedi take double.', 'Good soldiers follow orders.') },
    { id: 'geonosian_warrior', name: 'Geonosian Warrior', kind: 'character', faction: 'dark', rarity: 'common', role: 'attacker', spd: 124, traits: ['separatist', 'native'],
      abilities: [A('Sonic Blast', 0, 'enemy', [dmg(1.1), debuff('offDown', 1, 0.3)], 'Damage with a 30% chance to Daze (Offense Down).'), A('Wing Dive', 2, 'enemy', [dmg(1.45)], 'A fast diving hit.'), A('Hive Swarm', 4, 'self', [buff('offUp', 2), { type: 'tm', amount: 30 }], 'Offense Up and a speed boost.')],
      ultimate: U('Arena Swarm', 'randomEnemies', [dmg(0.8)], 'Five hits on random enemies.', 'Kill them!', 5) },
    { id: 'purge_trooper', name: 'Purge Trooper', kind: 'character', faction: 'dark', rarity: 'rare', role: 'attacker', spd: 118, traits: ['trooper', 'empire'],
      abilities: [A('Electrostaff Strike', 0, 'enemy', [dmg(1.0), debuff('stun', 1, 0.2)], 'Damage with a 20% Stun chance.'), A('Jedi Hunter', 3, 'enemy', [{ ...dmg(1.4), vsJedi: 1.5 }], 'Heavy damage, +50% against Jedi.'), A('Purge Protocol', 4, 'enemy', [{ ...dmg(1.2), execute: { below: 0.3, bonus: 2 } }], 'Double damage on enemies under 30%.')],
      ultimate: U('No Survivors', 'enemy', [{ ...dmg(1.1, 3), execute: { below: 0.25, bonus: 3 } }], 'Three hits; finishes anyone under 25%.', 'No survivors.') },
    { id: 'knight_of_ren', name: 'Knight of Ren', kind: 'character', faction: 'dark', rarity: 'epic', role: 'attacker', spd: 120, traits: ['sith'],
      abilities: [A('War Scythe', 0, 'enemy', [dmg(1.3)], 'Deal damage to one enemy.'), A('Scythe Sweep', 3, 'allEnemies', [dmg(0.9)], 'Hit every enemy.'), A('Terror', 4, 'enemy', [debuff('offDown', 2), debuff('defDown', 2)], 'Fear: Offense Down and Defense Down.')],
      ultimate: U('Knights of Ren', 'allEnemies', [dmg(1.7), { ...buff('offUp', 2), on: 'allies' }], 'Hit every enemy; allies gain Offense Up.', 'We are the Knights of Ren.') },
    { id: 'commando_droid', name: 'BX Commando Droid', kind: 'character', faction: 'dark', rarity: 'rare', role: 'attacker', spd: 130, traits: ['droid', 'separatist'],
      abilities: [A('Vibrosword', 0, 'enemy', [dmg(1.2)], 'Deal damage to one enemy.'), A('Disguise', 4, 'self', [buff('defUp', 2), { type: 'tm', amount: 40 }], 'Slip into cover: Defense Up and a speed boost.'), A('Commando Raid', 3, 'weakestEnemy', [dmg(0.9, 2)], 'Two hits on the weakest enemy.')],
      ultimate: U('Infiltration', 'weakestEnemy', [dmg(3.0), debuff('stun', 1)], 'Massive hit on the weakest enemy and Stun.', 'Roger, roger.') },
    // The Bendu: a secret card, earned only with the Liberator of the Galaxy
    // badge (every main and optional boss beaten).
    { id: 'bendu', name: 'The Bendu', kind: 'character', faction: 'light', rarity: 'secret', role: 'tank', spd: 96, traits: ['jedi', 'native'], exclusive: true,
      store: { cap: 2, ally: 0.25 },
      abilities: [A('Ancient Strike', 0, 'enemy', [dmg(1.15)], 'Deal damage to one enemy.'), A('Absorb', 3, 'self', [buff('absorb', 2), buff('taunt', 2)], 'For 2 turns he draws every attack (Taunt) and takes 50% less damage, but stores the full amount.'), A('Feed the Storm', 4, 'self', [{ type: 'store', pct: 0.2 }, heal(0.12)], 'Add 20% of his max health to his Stored Power and heal 12%.')],
      ultimate: U('The One in the Middle', 'allEnemies', [{ type: 'release', mult: 1.4 }], 'Unleash everything he has stored (plus 40%), split across every enemy, and Stun the strongest. His store empties.', 'I am the one in the middle.') },
  ];

  // Bosses: main (liberates the world) and optional.
  const BOSSES24 = [
    { id: 'carbon_vader', name: 'Carbonite Chamber Vader', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 118,
      boss: { hp: 9.5, atk: 1.3, def: 1.25 }, mech: { freeze: { every: 3, turns: 2 } },
      abilities: [A('Saber Strike', 0, 'enemy', [dmg(1.4)], 'Deal heavy damage to one enemy.'), A('Force Choke', 3, 'enemy', [dmg(1.1), debuff('offDown', 1)], 'Damage and Offense Down.'), A('Steam Vents', 4, 'allAllies', [buff('defUp', 1)], 'All allies gain Defense Up.')],
      ultimate: U('All Too Easy', 'allEnemies', [dmg(1.8), { type: 'freezeTop' }], 'Slashes every enemy, then freezes the toughest in carbonite.', 'All too easy.') },
    { id: 'darth_sidious', name: 'Darth Sidious', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'support', spd: 124, traits: ['sith', 'leader'],
      boss: { hp: 9.5, atk: 1.45, def: 1.2 }, mech: { power: { at: 3, mult: 1.2 } },
      abilities: [A('Sith Lightning', 0, 'enemy', [dmg(1.2), debuff('stun', 1, 0.3)], 'Lightning with a 30% Stun chance.'), A('Dark Deception', 3, 'enemy', [{ type: 'dispel' }, debuff('offDown', 2), debuff('defDown', 2)], 'Strip an enemy\'s buffs: Offense Down and Defense Down.'), A('Senate Decree', 4, 'allAllies', [buff('offUp', 2), { type: 'tm', amount: 25 }], 'All allies gain Offense Up and a speed boost.')],
      ultimate: U('UNLIMITED POWER', 'allEnemies', [dmg(2.4), debuff('stun', 1, 0.3)], 'Lightning on every enemy with a 30% Stun chance.', 'Unlimited power!') },
    { id: 'wampa', name: 'The Wampa', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 116,
      boss: { hp: 6, atk: 1.0, def: 1.15 }, mech: { frenzy: { text: 'Ice Cave Frenzy!' } },
      abilities: [A('Claw Rend', 0, 'enemy', [dmg(0.75, 2), debuff('burn', 2, 0.5)], 'Two slashes with a 50% chance to Bleed.'), A('Drag to the Lair', 3, 'enemy', [dmg(1.0), debuff('stun', 1), debuff('defDown', 2)], 'Hung up in the lair: Stun and Defense Down.'), A('Ice Hide', 4, 'self', [heal(0.08), buff('defUp', 2)], 'Heal 8% and gain Defense Up.')],
      ultimate: U('Lair of the Wampa', 'allEnemies', [dmg(1.6), debuff('burn', 2), { ...heal(0.1), on: 'self' }], 'Every enemy is mauled and Bleeds; the Wampa heals 10%.', 'A roar echoes through the ice.') },
    { id: 'cave_vision', name: 'The Cave\'s Vision', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 120, traits: ['sith'],
      boss: { hp: 9, atk: 1.6, def: 1.2 }, mech: { mirror: true },
      abilities: [A('Phantom Blade', 0, 'enemy', [dmg(1.3)], 'Deal damage to one enemy.'), A('Mirror of Fear', 3, 'enemy', [debuff('offDown', 2), { type: 'drainUlt', amount: 50 }], 'Fear: Offense Down and it drains half the target\'s ultimate.'), A('Fade', 4, 'self', [buff('defUp', 2), heal(0.06)], 'Fade into the mist: Defense Up and heal 6%.')],
      ultimate: U('Your Own Face', 'allEnemies', [{ type: 'mirrorStrike', mult: 1.6 }], 'Strikes each enemy with their OWN attack power.', 'Your weapons... you will not need them.') },
    { id: 'bossk', name: 'Bossk and the Hound\'s Tooth', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 114, traits: ['bounty'],
      boss: { hp: 8, atk: 1.2, def: 1.2 }, mech: { trophy: 0.15 },
      abilities: [A('Relby Mortar', 0, 'enemy', [dmg(1.2), debuff('burn', 2, 0.4)], 'Damage with a 40% chance to Burn.'), A('Trandoshan Regeneration', 4, 'self', [heal(0.1), buff('defUp', 1)], 'Heal 10% and gain Defense Up.'), A('Wookiee Hunter', 3, 'enemy', [{ ...dmg(1.5), vsIds: { chewbacca: 2 } }], 'Heavy damage; double against Chewbacca.')],
      ultimate: U('Bossk\'s Bounty', 'allEnemies', [{ ...dmg(1.5), execute: { below: 0.35, bonus: 2 } }, debuff('burn', 2)], 'The Hound\'s Tooth fires a missile barrage: double damage under 35%, and Burn.', 'The hunt is on.') },
    { id: 'atst', name: 'AT-ST Walker', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'tank', spd: 98, traits: ['empire'],
      boss: { hp: 13.5, atk: 1.55, def: 1.3 }, mech: { armor: 0.7, weak: { ewok_warrior: 2 } },
      abilities: [A('Chin Blasters', 0, 'enemy', [dmg(0.7, 2)], 'Two shots.'), A('Concussion Grenade', 3, 'allEnemies', [dmg(0.85), debuff('offDown', 1, 0.5)], 'Hit every enemy with a 50% chance to Daze.'), A('Stomp', 3, 'enemy', [dmg(1.6), debuff('defDown', 2)], 'Heavy hit and Defense Down.')],
      ultimate: U('Walker Assault', 'allEnemies', [dmg(2.0)], 'Every gun fires: heavy damage to every enemy.', 'Take them down!') },
    { id: 'krennic', name: 'Director Krennic', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'support', spd: 112, traits: ['empire', 'leader'],
      boss: { hp: 10, atk: 1.4, def: 1.15 }, mech: { relaunch: { ids: ['death_trooper'], every: 4, count: 1, text: 'Krennic calls in another death trooper!' } },
      abilities: [A('DT-29 Shot', 0, 'enemy', [dmg(1.2)], 'Deal damage to one enemy.'), A('On the Verge of Greatness', 3, 'allAllies', [buff('offUp', 2)], 'All allies gain Offense Up.'), A('Escort', 4, 'self', [buff('defUp', 2), heal(0.08)], 'His escort closes in: Defense Up and heal 8%.')],
      ultimate: U('Fire at Will', 'allEnemies', [dmg(2.2), debuff('burn', 2)], 'The Death Star fires: heavy damage and Burn to every enemy.', 'We were on the verge of greatness.') },
    { id: 'commander_cody', name: 'Commander Cody', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 120, traits: ['trooper', 'republic', 'leader'],
      boss: { hp: 10.5, atk: 1.55, def: 1.2 }, mech: { order66: { turn: 3 } },
      abilities: [A('DC-15 Burst', 0, 'enemy', [dmg(0.55, 3)], 'Three shots at one enemy.'), A('Rangefinder Mark', 3, 'enemy', [debuff('defDown', 3), debuff('offDown', 1)], 'Mark a target: Defense Down and Offense Down.'), A('Blast Him!', 3, 'enemy', [dmg(1.0), { type: 'teamStrike', mult: 0.6 }], 'He fires and every ally fires on the same target.')],
      ultimate: U('Execute Order 66', 'strongestJedi', [{ type: 'teamStrike', mult: 1.4 }, dmg(1.5)], 'Every ally attacks the strongest Jedi at once.', 'It will be done, my lord.') },
    { id: 'jango_arena', name: 'Jango Fett, Arena', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 128, traits: ['bounty', 'mandalorian'],
      boss: { hp: 12, atk: 1.7, def: 1.15 }, mech: { dodge: true },
      abilities: [A('Twin WESTARs', 0, 'enemy', [dmg(0.7, 2)], 'Two shots.'), A('Wrist Rocket', 3, 'allEnemies', [dmg(0.9)], 'Hit every enemy.'), A('Jetpack Leap', 4, 'enemy', [dmg(1.4), { ...buff('defUp', 1), on: 'self' }], 'A diving hit and Defense Up.')],
      ultimate: U('Bounty of Geonosis', 'randomEnemies', [dmg(0.9)], 'Flies up and rains six shots down on random enemies.', 'I\'m just a simple man trying to make my way in the universe.', 6) },
    { id: 'emperor_reborn', name: 'Emperor Reborn', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'support', spd: 118, traits: ['sith', 'leader'],
      boss: { hp: 11, atk: 1.6, def: 1.25 }, mech: { shield: ['sith_trooper'], regenShield: 0.03 },
      abilities: [A('Lightning Storm', 0, 'enemy', [dmg(1.25)], 'Lightning on one enemy.'), A('The Sith Eternal', 6, 'self', [{ type: 'revive', pct: 0.3 }], 'Bring back a fallen ally at 30%.'), A('Drain', 3, 'enemy', [dmg(1.2), { ...heal(0.08), on: 'self' }], 'Drain one enemy and heal 8%.')],
      ultimate: U('Everything You Hate', 'allEnemies', [dmg(2.6), { ...heal(0.1), on: 'self' }], 'Lightning on every enemy; he drains 10% back.', 'I have been every voice you have ever heard inside your head.') },
    { id: 'grievous_warlord', name: 'General Grievous, Warlord', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 140, traits: ['droid', 'separatist', 'leader'], portrait: 'grievous_warlord',
      boss: { hp: 15, atk: 1.9, def: 1.2 }, mech: { arms: 4 },
      abilities: [A('Saber Whirl', 0, 'enemy', [dmg(0.42, 4)], 'Four blades: four hits on one enemy (one fewer for every arm he loses).'), A('Cape Spin', 3, 'self', [buff('defUp', 2), { type: 'tm', amount: 30 }], 'Defense Up and a speed boost.'), A('Collector', 4, 'enemy', [{ type: 'dispel' }, dmg(1.1)], 'Steal an enemy\'s buffs and strike.')],
      ultimate: U('Warlord\'s Whirlwind', 'randomEnemies', [dmg(0.75)], 'Eight blade hits spread across the enemy squad.', 'Your lightsabers will make a fine addition to my collection.', 8) },
  ];
  const BIOS24 = {
    gamorrean_guard: 'Jabba\'s pig-faced palace muscle: strong, stubborn, and never far from an axe.',
    snowtrooper: 'Cold-assault stormtroopers of Blizzard Force, built for Hoth.',
    wing_guard: 'Cloud City\'s security force, loyal to Baron Administrator Lando Calrissian.',
    scout_trooper: 'Lightly armoured Imperial scouts who ride speeder bikes through Endor\'s forests.',
    shoretrooper: 'Coastal defenders of the Scarif Citadel.',
    cf66_trooper: 'Clone troopers who obeyed Order 66 without a second thought.',
    geonosian_warrior: 'A winged soldier of the Geonosian hives, armed with a sonic blaster.',
    purge_trooper: 'Elite Imperial troopers trained to hunt Jedi alongside the Inquisitors.',
    knight_of_ren: 'One of Kylo Ren\'s masked warriors, each with a brutal weapon of their own.',
    commando_droid: 'BX-series droid commandos: fast, tough and built for infiltration.',
    bendu: 'An ancient Force wielder on Atollon who walks neither the light nor the dark side. He takes in what is thrown at him and gives it back.',
    carbon_vader: 'Darth Vader in Cloud City\'s carbon-freeze chamber, waiting for young Skywalker.',
    darth_sidious: 'The Chancellor\'s mask is gone. Darth Sidious in his office, with all the power he ever wanted.',
    wampa: 'A Hoth ice creature that drags its prey back to its cave.',
    cave_vision: 'What Luke met in the cave on Dagobah: only what he took in with him.',
    bossk: 'The Trandoshan hunter and his ship, the Hound\'s Tooth, after the same bounty you are.',
    atst: 'An All Terrain Scout Transport stalking the forest moon.',
    krennic: 'Director Orson Krennic, who built the Death Star and wants the credit for it.',
    commander_cody: 'Marshal Commander Cody, the moment the order came.',
    jango_arena: 'Jango Fett in the Petranaki arena, the day the Jedi came to Geonosis.',
    emperor_reborn: 'Palpatine on Exegol, kept alive by machines and the Sith Eternal.',
    grievous_warlord: 'General Grievous leading the attack on Coruscant himself.',
  };
  const STATUS24 = {
    frozen: { label: 'Frozen in carbonite', icon: '❄', kind: 'mech', desc: 'Frozen: can\'t act and can\'t be hurt until it thaws.' },
    order66: { label: 'Order 66', icon: '⌖', kind: 'mech', desc: 'Deals double damage to Jedi.' },
    absorb: { label: 'Absorbing', icon: '◉', kind: 'buff', desc: 'Takes 50% less damage but stores the full amount.' },
    stored: { label: 'Stored Power', icon: '✦', kind: 'mech', desc: 'Damage taken is stored and released by the ultimate.' },
  };

  // ---------- Worlds: 10 stages each ----------
  const G = 'character';
  const F = 'ship';
  const st = (name, kind, level, enemies) => ({ name, kind, level, enemies });
  const STAGES24 = {
    tatooine: [
      st('Mos Eisley Outskirts', G, 1, ['jawa', 'jawa', 'tusken_raider']), st('Jundland Wastes', G, 1, ['tusken_raider', 'tusken_raider', 'jawa']),
      st('Beggar\'s Canyon', F, 2, ['tie_fighter', 'z95', 'tie_fighter']), st('Sandcrawler Ambush', G, 2, ['jawa', 'jawa', 'gamorrean_guard']),
      st('Chalmun\'s Cantina', G, 3, ['hondo', 'tusken_raider', 'jawa']), st('Jabba\'s Gate', G, 4, ['gamorrean_guard', 'gamorrean_guard', 'jawa']),
      st('Dune Sea Pursuit', F, 4, ['slave_one', 'tie_fighter', 'tie_fighter']), st('The Mandalorian\'s Bounty', G, 5, ['din_djarin', 'jawa', 'tusken_raider']),
      st('Hunters\' Den', G, 6, ['ig88', 'cad_bane', 'gamorrean_guard']), st('Jabba\'s Palace', G, 7, ['boba_fett', 'cad_bane', 'gamorrean_guard']),
    ],
    hoth: [
      st('Echo Base Perimeter', G, 4, ['snowtrooper', 'snowtrooper', 'snowtrooper']), st('Ion Cannon Cover', F, 4, ['tie_fighter', 'tie_bomber', 'tie_fighter']),
      st('Frozen Trenches', G, 5, ['snowtrooper', 'snowtrooper', 'rebel_soldier']), st('Echo Base Defenders', G, 6, ['rebel_soldier', 'rebel_soldier', 'leia']),
      st('Asteroid Field', F, 6, ['y_wing', 'tie_bomber', 'tie_fighter']), st('Wampa Country', G, 7, ['snowtrooper', 'snowtrooper', 'chewbacca']),
      st('Hangar Breach', G, 8, ['han_solo', 'chewbacca', 'rebel_soldier']), st('Shield Generator', G, 8, ['snowtrooper', 'snowtrooper', 'rebel_soldier', 'snowtrooper']),
      st('Escape from Hoth', F, 9, ['tie_bomber', 'tie_fighter', 'y_wing', 'tie_fighter']), st('Vader Arrives', G, 10, ['vader', 'snowtrooper', 'snowtrooper']),
    ],
    dagobah: [
      st('Swamp Landing', F, 7, ['tie_interceptor', 'x_wing', 'tie_interceptor']), st('Mist Witches', G, 7, ['nightsister_acolyte', 'nightsister_acolyte', 'nightsister_acolyte']),
      st('Gnarltree Hollow', G, 8, ['nightsister_acolyte', 'savage_opress', 'nightsister_acolyte']), st('Yoda\'s Test', G, 9, ['yoda', 'grogu']),
      st('Bog Ambush', G, 9, ['asajj_ventress', 'nightsister_acolyte', 'nightsister_acolyte']), st('Orbital Blockade', F, 10, ['tie_interceptor', 'tie_interceptor', 'x_wing']),
      st('Brothers of Dathomir', G, 11, ['savage_opress', 'asajj_ventress', 'nightsister_acolyte']), st('Cave of Evil', G, 11, ['kylo_ren', 'nightsister_acolyte', 'nightsister_acolyte']),
      st('The Mother\'s Call', G, 12, ['talzin', 'nightsister_acolyte', 'nightsister_acolyte']), st('Trial of the Force', G, 13, ['talzin', 'kylo_ren', 'asajj_ventress']),
    ],
    bespin: [
      st('Cloud City Approach', F, 9, ['slave_one', 'tie_fighter', 'tie_fighter']), st('Wing Guard Patrol', G, 9, ['wing_guard', 'wing_guard', 'wing_guard']),
      st('Tibanna Refinery', G, 10, ['stormtrooper', 'stormtrooper', 'wing_guard']), st('Lando\'s Welcome', G, 11, ['lando', 'wing_guard', 'wing_guard']),
      st('Cloud Car Chase', F, 11, ['hounds_tooth', 'slave_one', 'tie_fighter']), st('Ugnaught Tunnels', G, 12, ['ig88', 'stormtrooper', 'stormtrooper']),
      st('Dinner Guests', G, 13, ['boba_fett', 'stormtrooper', 'stormtrooper']), st('The Bounty Hunters\' Deal', G, 13, ['boba_fett', 'ig88', 'wing_guard']),
      st('Escape the Gas Giant', F, 14, ['hounds_tooth', 'slave_one', 'tie_bomber']), st('The Freezing Chamber', G, 15, ['boba_fett', 'ig88', 'stormtrooper', 'stormtrooper']),
    ],
    endor: [
      st('Forest Moon Landing', F, 11, ['lambda_shuttle', 'tie_interceptor', 'a_wing']), st('Speeder Chase', G, 12, ['scout_trooper', 'scout_trooper', 'scout_trooper']),
      st('Ewok Village', G, 12, ['ewok_warrior', 'ewok_warrior', 'ewok_warrior']), st('Bunker Approach', G, 13, ['scout_trooper', 'scout_trooper', 'death_trooper']),
      st('Droid Rescue', G, 14, ['r2d2', 'c3po', 'ewok_warrior']), st('Imperial Shuttle', F, 14, ['lambda_shuttle', 'tie_interceptor', 'tie_interceptor']),
      st('Log Traps', G, 15, ['ewok_warrior', 'ewok_warrior', 'ewok_warrior', 'r2d2']), st('Bunker Guards', G, 16, ['death_trooper', 'scout_trooper', 'scout_trooper']),
      st('Fleet Engagement', F, 17, ['a_wing', 'tie_interceptor', 'lambda_shuttle', 'tie_interceptor']), st('The Shield Generator', G, 18, ['death_trooper', 'death_trooper', 'scout_trooper', 'scout_trooper']),
    ],
    scarif: [
      st('The Shield Gate', F, 13, ['tie_fighter', 'tie_interceptor', 'u_wing']), st('Beach Landing', G, 14, ['shoretrooper', 'shoretrooper', 'shoretrooper']),
      st('Landing Pad Nine', G, 14, ['shoretrooper', 'shoretrooper', 'death_trooper']), st('K-2\'s Reprogramming', G, 15, ['k2so', 'shoretrooper', 'shoretrooper']),
      st('Rogue One Strike', F, 16, ['u_wing', 'tie_fighter', 'tie_interceptor']), st('Citadel Steps', G, 17, ['death_trooper', 'shoretrooper', 'shoretrooper']),
      st('The Data Vault', G, 17, ['k2so', 'death_trooper', 'shoretrooper']), st('Tarkin\'s Order', G, 18, ['tarkin', 'death_trooper', 'death_trooper']),
      st('Orbital Battle', F, 19, ['tie_interceptor', 'tie_interceptor', 'tie_fighter', 'u_wing']), st('The Hallway', G, 20, ['vader', 'death_trooper', 'death_trooper']),
    ],
    coruscant: [
      st('Temple Approach', G, 15, ['cf66_trooper', 'cf66_trooper', 'cf66_trooper']), st('Skylane Patrol', F, 16, ['arc_170', 'arc_170', 'arc_170']),
      st('Temple Guard', G, 16, ['barriss', 'cf66_trooper', 'cf66_trooper']), st('The Archives', G, 17, ['cal_kestis', 'cf66_trooper', 'cf66_trooper']),
      st('The Inquisitors Arrive', G, 18, ['second_sister', 'fifth_brother', 'cf66_trooper']), st('Gunship Run', F, 18, ['arc_170', 'arc_170', 'arc_170']),
      st('Training Halls', G, 19, ['qui_gon', 'barriss', 'cal_kestis']), st('The Purge', G, 20, ['grand_inquisitor', 'cf66_trooper', 'cf66_trooper']),
      st('Council Chamber', G, 21, ['mace_windu', 'qui_gon', 'cf66_trooper']), st('Order 66', G, 22, ['grand_inquisitor', 'second_sister', 'fifth_brother', 'cf66_trooper']),
    ],
    geonosis: [
      st('Orbital Defense', F, 18, ['vulture_droid', 'vulture_droid', 'vulture_droid']), st('Hive Spires', G, 19, ['geonosian_warrior', 'geonosian_warrior', 'geonosian_warrior']),
      st('Droid Foundry', G, 20, ['battle_droid', 'b2_droid', 'battle_droid', 'geonosian_warrior']), st('Conveyor Belts', G, 21, ['b2_droid', 'b2_droid', 'droideka']),
      st('Jedi Starfighters', F, 22, ['delta7', 'delta7', 'vulture_droid']), st('The Strike Team', G, 22, ['obi_wan', 'anakin', 'padme']),
      st('Droideka Wall', G, 23, ['droideka', 'droideka', 'b2_droid', 'geonosian_warrior']), st('MagnaGuard Hall', G, 24, ['magnaguard', 'magnaguard', 'grievous']),
      st('Battle of Geonosis', F, 25, ['vulture_droid', 'vulture_droid', 'delta7', 'vulture_droid']), st('Dooku\'s Hangar', G, 26, ['count_dooku', 'grievous', 'magnaguard']),
    ],
    mustafar: [
      st('Lava Fields', F, 21, ['tie_interceptor', 'tie_advanced', 'tie_interceptor']), st('Purge Patrol', G, 22, ['purge_trooper', 'purge_trooper', 'purge_trooper']),
      st('Mining Facility', G, 23, ['purge_trooper', 'purge_trooper', 'seventh_sister']), st('The Rescue', G, 24, ['obi_wan', 'ahsoka']),
      st('Lava River', G, 25, ['eighth_brother', 'purge_trooper', 'purge_trooper']), st('Fortress Skies', F, 25, ['tie_advanced', 'tie_interceptor', 'tie_interceptor', 'tie_advanced']),
      st('The Inquisitorius', G, 26, ['seventh_sister', 'eighth_brother', 'purge_trooper']), st('The Old Sith', G, 27, ['darth_maul', 'purge_trooper', 'purge_trooper']),
      st('Fortress Gate', G, 28, ['purge_trooper', 'purge_trooper', 'seventh_sister', 'eighth_brother']), st('Vader\'s Wrath', G, 29, ['vader', 'purge_trooper', 'purge_trooper']),
    ],
    exegol: [
      st('The Storm', F, 25, ['tie_defender', 'tie_defender', 'tie_defender']), st('Citadel Gates', G, 26, ['sith_trooper', 'sith_trooper', 'sith_trooper']),
      st('Knights in the Fog', G, 27, ['knight_of_ren', 'knight_of_ren', 'sith_trooper']), st('The Supreme Leader', G, 27, ['kylo_ren', 'knight_of_ren', 'knight_of_ren']),
      st('Sith Fleet', F, 28, ['tie_defender', 'tie_defender', 'tie_defender', 'tie_defender']), st('The Final Order', G, 29, ['sith_trooper', 'sith_trooper', 'sith_trooper', 'knight_of_ren']),
      st('Rey\'s Trial', G, 30, ['rey', 'kylo_ren']), st('Throne Room Guard', G, 31, ['knight_of_ren', 'knight_of_ren', 'kylo_ren']),
      st('The Xyston Fleet', F, 32, ['tie_defender', 'tie_defender', 'tie_defender', 'tie_defender']), st('The Emperor\'s Throne', G, 33, ['palpatine', 'knight_of_ren', 'sith_trooper', 'sith_trooper']),
    ],
  };
  // Coruscant Under Siege already had 10 stages: new levels and the droid commandos.
  const SIEGE_LEVELS = [28, 28, 29, 29, 30, 31, 32, 33, 34, 35];
  const SIEGE_SWAPS = { 1: ['b2_droid', 'droideka', 'commando_droid', 'magnaguard', 'commando_droid'], 7: ['fifth_brother', 'seventh_sister', 'eighth_brother', 'commando_droid', 'death_trooper'] };

  // Main boss (liberates the world) and optional boss for every world.
  const WORLD_BOSSES = {
    tatooine: ['rancor', 'krayt_dragon'], hoth: ['star_destroyer', 'wampa'], dagobah: ['dragonsnake', 'cave_vision'], bespin: ['carbon_vader', 'bossk'],
    endor: ['death_star_2', 'atst'], scarif: ['death_star', 'krennic'], coruscant: ['darth_sidious', 'commander_cody'], geonosis: ['acklay', 'jango_arena'],
    mustafar: ['lord_vader', 'executor'], exegol: ['sith_legion', 'emperor_reborn'], coruscant_siege: ['zillo_beast', 'grievous_warlord'],
  };
  // Card levels go to 50 in 2.4, so the campaign stretches to match: levels
  // up to 15 (Tatooine, Hoth and Dagobah) stay as they were, and above that
  // they spread out evenly so the old top level, 36, becomes 46.
  const stretch = (l) => (l <= 15 ? l : Math.round(15 + (l - 15) * 31 / 21));
  const BOSS_LEVELS = {
    rancor: 9, krayt_dragon: 11, star_destroyer: 12, wampa: 14, dragonsnake: 15, cave_vision: 17, carbon_vader: 17, bossk: 19, death_star_2: 20, atst: 22,
    death_star: 22, krennic: 24, darth_sidious: 24, commander_cody: 26, acklay: 28, jango_arena: 30, lord_vader: 31, executor: 33, sith_legion: 34,
    emperor_reborn: 35, zillo_beast: 36, grievous_warlord: 36,
  };
  const ENCOUNTERS24 = [
    { id: 'wampa', name: 'The Ice Cave', kind: 'character', minions: [], place: 'Wampa cave, Hoth' },
    { id: 'cave_vision', name: 'The Cave of Evil', kind: 'character', minions: [], place: 'Dark-side cave, Dagobah' },
    { id: 'carbon_vader', name: 'The Carbon-Freeze Chamber', kind: 'character', minions: ['stormtrooper', 'stormtrooper'], place: 'Cloud City, Bespin' },
    { id: 'bossk', name: 'The Hound\'s Tooth', kind: 'character', minions: ['ig88'], place: 'Cloud City landing pad, Bespin' },
    { id: 'atst', name: 'Chicken Walker', kind: 'character', minions: ['scout_trooper', 'scout_trooper'], place: 'Forest moon of Endor' },
    { id: 'krennic', name: 'The Citadel Platform', kind: 'character', minions: ['death_trooper', 'death_trooper'], place: 'Citadel Tower, Scarif' },
    { id: 'darth_sidious', name: 'The Chancellor\'s Office', kind: 'character', minions: [], place: 'Senate Office Building, Coruscant' },
    { id: 'commander_cody', name: 'Order 66', kind: 'character', minions: ['cf66_trooper', 'cf66_trooper', 'cf66_trooper'], place: 'Jedi Temple, Coruscant' },
    { id: 'jango_arena', name: 'The Execution Arena', kind: 'character', minions: ['geonosian_warrior'], place: 'Petranaki Arena, Geonosis' },
    { id: 'emperor_reborn', name: 'The Throne of the Sith', kind: 'character', minions: ['sith_trooper', 'sith_trooper'], place: 'Sith Citadel, Exegol' },
    { id: 'grievous_warlord', name: 'The Siege of Coruscant', kind: 'character', minions: ['magnaguard', 'commando_droid'], place: 'Senate District, Coruscant' },
  ];

  // ---------- Install the data ----------
  for (const u of CARDS24) if (!D.UNIT_MAP[u.id]) { D.UNITS.push(u); D.UNIT_MAP[u.id] = u; }
  // Bosses aren't collectable (boss cards as rewards are still being decided).
  for (const u of BOSSES24) if (!D.UNIT_MAP[u.id]) D.UNIT_MAP[u.id] = u;
  if (D.BOSSES) D.BOSSES.push(...BOSSES24.filter((b) => !D.BOSSES.includes(b)));
  Object.assign(D.BIOS, BIOS24);
  Object.assign(D.STATUS_INFO, STATUS24);
  for (const u of CARDS24) if (u.traits && D.TRAITS && !D.TRAITS[u.id]) D.TRAITS[u.id] = u.traits;

  const OLD_LEN = {};
  for (const [id, list] of Object.entries(STAGES24)) {
    const p = D.PLANET_MAP[id];
    if (!p) continue;
    OLD_LEN[id] = p.stages.length;
    p.stages = list.filter((s) => s.enemies.every((e) => D.UNIT_MAP[e]));
  }
  const siege = D.PLANET_MAP.coruscant_siege;
  if (siege) {
    OLD_LEN.coruscant_siege = siege.stages.length;
    siege.stages.forEach((s, i) => { if (SIEGE_LEVELS[i]) s.level = SIEGE_LEVELS[i]; if (SIEGE_SWAPS[i]) s.enemies = SIEGE_SWAPS[i].slice(); });
  }
  for (const p of D.PLANETS) for (const st of p.stages) st.level = stretch(st.level);
  for (const id of Object.keys(BOSS_LEVELS)) BOSS_LEVELS[id] = stretch(BOSS_LEVELS[id]);
  if (D.PLANET_MAP.exegol) D.PLANET_MAP.exegol.reinforce.character = ['sith_trooper', 'knight_of_ren'];
  if (D.PLANET_MAP.hoth) D.PLANET_MAP.hoth.reinforce.character = ['snowtrooper'];
  if (D.PLANET_MAP.scarif) D.PLANET_MAP.scarif.reinforce.character = ['shoretrooper', 'death_trooper'];
  if (D.PLANET_MAP.endor) D.PLANET_MAP.endor.reinforce.character = ['scout_trooper'];
  if (D.PLANET_MAP.coruscant) D.PLANET_MAP.coruscant.reinforce.character = ['cf66_trooper'];
  if (D.PLANET_MAP.mustafar) D.PLANET_MAP.mustafar.reinforce.character = ['purge_trooper'];
  if (D.PLANET_MAP.geonosis) D.PLANET_MAP.geonosis.reinforce.character = ['geonosian_warrior', 'battle_droid'];
  if (D.PLANET_MAP.bespin) D.PLANET_MAP.bespin.reinforce.character = ['wing_guard', 'stormtrooper'];
  if (D.PLANET_MAP.tatooine) D.PLANET_MAP.tatooine.reinforce.character = ['jawa', 'tusken_raider'];
  if (D.PLANET_MAP.dagobah) D.PLANET_MAP.dagobah.reinforce.character = ['nightsister_acolyte'];

  // Every boss belongs to its own world now: it opens once that world's 10 stages are cleared.
  const MAIN = {};
  const OPTIONAL = {};
  for (const [planet, [main, opt]] of Object.entries(WORLD_BOSSES)) { MAIN[planet] = main; OPTIONAL[opt] = planet; }
  for (const e of ENCOUNTERS24) {
    const planet = Object.keys(WORLD_BOSSES).find((p) => WORLD_BOSSES[p].includes(e.id));
    if (!D.UNIT_MAP[e.id] || D.BOSS_ENCOUNTERS.some((b) => b.id === e.id)) continue;
    D.BOSS_ENCOUNTERS.push({ ...e, planet, unlock: planet, level: BOSS_LEVELS[e.id] });
  }
  for (const b of D.BOSS_ENCOUNTERS) {
    const planet = Object.keys(WORLD_BOSSES).find((p) => WORLD_BOSSES[p].includes(b.id));
    if (!planet) continue;
    b.planet = planet;
    b.unlock = planet;
    b.level = BOSS_LEVELS[b.id] || b.level;
    b.main = MAIN[planet] === b.id;
    b.optional = !b.main;
  }
  D.BOSS_ENCOUNTERS.sort((a, b) => a.level - b.level);
  const ALL_BOSSES = Object.values(WORLD_BOSSES).flat();
  // Optional bosses pay their own way: a Holocron the first time (opened in
  // completeEncounter below), then 1,500 credits and 1 Aurodium a win.
  const baseBossRewards = D.bossRewards;
  D.bossRewards = (enc, firstClear) => (enc && enc.optional
    ? { credits: 1500, aurodium: firstClear ? 0 : 1, aurodiumMax: firstClear ? 0 : 1, kyber: 0, card: null, holocron: firstClear }
    : baseBossRewards(enc, firstClear));

  // The Hoth Star Destroyer gets its detailed 2.4 portrait.
  if (D.UNIT_MAP.star_destroyer && root.Art && root.Art.CHARACTER_IDS.includes('star_destroyer_24')) D.UNIT_MAP.star_destroyer.portrait = 'star_destroyer_24';

  // ---------- Progress rules ----------
  // Worlds finished before 2.4 stay open (next world, squad slots) even
  // though they now have more stages. Snapshotted once per save.
  function lib() {
    const s = Player.state;
    if (!s) return { old: [] };
    if (!s.lib24) {
      s.lib24 = { old: Object.keys(OLD_LEN).filter((id) => (s.planets[id] || 0) >= OLD_LEN[id]) };
      try { Player.save(); } catch (e) { /* first boot */ }
    }
    return s.lib24;
  }
  const wasDone = (id) => lib().old.includes(id);
  const baseUnlocked = Player.planetUnlocked;
  Player.planetUnlocked = function (id) {
    const i = D.PLANETS.findIndex((p) => p.id === id);
    if (i > 0 && wasDone(D.PLANETS[i - 1].id)) return true;
    return baseUnlocked.call(this, id);
  };
  const baseSlot = Player.slotUnlocked;
  Player.slotUnlocked = function (rule) {
    return baseSlot.call(this, rule) || (this.state.account.level >= rule.level && wasDone(rule.planet));
  };
  // Liberated: the world's main boss has fallen.
  Player.liberated = function (id) { const m = MAIN[id]; return !!(m && this.state.bosses[m]) && this.planetComplete(id); };
  Player.bossesBeaten = function () { return ALL_BOSSES.filter((id) => this.state.bosses[id]).length; };
  const baseCurrent = Player.currentPlanet;
  Player.currentPlanet = function () {
    return D.PLANETS.find((p) => this.planetUnlocked(p.id) && !this.planetComplete(p.id)) || baseCurrent.call(this);
  };

  // ---------- Rewards ----------
  // Replaying a stage you've already beaten pays 60%. Optional bosses: the
  // first win opens a Holocron (Jedi for the light side, Sith for the dark);
  // every win after pays 1,500 credits and 1 Aurodium.
  const baseComplete = Player.completeEncounter;
  Player.completeEncounter = function (params, won, rng) {
    if (!won || !params || (params.type !== 'stage' && params.type !== 'boss')) return baseComplete.call(this, params, won, rng);
    const enc = params.type === 'boss' ? D.BOSS_ENCOUNTERS.find((b) => b.id === params.boss) : null;
    const optional = enc && enc.optional;
    const first = optional ? !this.state.bosses[enc.id] : false;
    const out = baseComplete.call(this, params, won, rng);
    if (!out || out.lost) return out;
    if (params.type === 'stage' && !out.firstClear) {
      const cut = out.credits - Math.round(out.credits * 0.6);
      out.credits -= cut;
      out.base = Math.round(out.base * 0.6);
      this.state.credits = Math.max(0, this.state.credits - cut);
      out.replay = true;
    }
    if (optional) {
      const def = D.UNIT_MAP[enc.id];
      // Undo the generic boss payout and pay the optional-boss one instead.
      this.state.credits = Math.max(0, this.state.credits - out.credits);
      this.state.aurodium = Math.max(0, this.state.aurodium - out.aurodium);
      this.state.crystals = Math.max(0, this.state.crystals - (out.crystals || 0));
      if (out.card && out.card.isNew && this.state.units[out.card.id] && !out.__keep) { /* a first-clear card from the old payout stays: never take a card back */ }
      out.base = 1500;
      out.credits = Math.round(1500 * (out.mult || 1));
      out.crystals = 0;
      out.aurodium = first ? 0 : 1;
      if (first) {
        const packId = def.faction === 'light' ? 'holocron' : 'strongbox';
        const res = this.openPack(packId, rng, { free: true });
        if (res && res.length) { out.cards = res; out.card = null; out.holocron = packId === 'holocron' ? 'Jedi Holocron opened' : 'Sith Holocron opened'; }
      }
      this.state.credits += out.credits;
      this.state.aurodium += out.aurodium;
      this.save();
    }
    if (enc && enc.main && !out.__lib && this.planetComplete(enc.planet)) out.liberated = D.PLANET_MAP[enc.planet].name;
    return out;
  };


  // ---------- Quality of life ----------
  // 1. The results screen shows what this play session has earned and the
  //    rate per hour. 2. Cleared stages get a "Replay ×3" button that runs
  //    the battle three times on Auto. 3. Maxed cards (top level and top
  //    stars) can sell spare shards: credits by rarity, Kyber for secret cards.
  const SESSION = { credits: 0, start: 0, battles: 0 };
  const SHARD_PRICE = { common: 100, rare: 125, epic: 150, legendary: 200, mythic: 250 };
  const SECRET_PER_KYBER = 4;
  const qol = {
    on,
    session: SESSION,
    rateLine() {
      if (!on() || !SESSION.start || !SESSION.credits) return '';
      const hrs = Math.max((Date.now() - SESSION.start) / 3600000, 1 / 60);
      const rate = Math.round(SESSION.credits / hrs);
      return `This session: ${UI.fmt(SESSION.credits)} credits over ${SESSION.battles} battle${SESSION.battles === 1 ? '' : 's'} · about ${UI.fmt(rate)} an hour`;
    },
    // What the spare shards of a maxed card sell for, or null.
    sellOffer(id) {
      if (!on() || !Player.owns(id)) return null;
      const u = Player.unit(id);
      const def = D.UNIT_MAP[id];
      if (!u || !def || u.level < D.MAX_LEVEL || u.stars < D.MAX_STARS || !u.shards) return null;
      if (def.rarity === 'secret') {
        const kyber = Math.floor(u.shards / SECRET_PER_KYBER);
        return kyber ? { shards: kyber * SECRET_PER_KYBER, kyber, credits: 0 } : null;
      }
      return { shards: u.shards, kyber: 0, credits: u.shards * (SHARD_PRICE[def.rarity] || 100) };
    },
    sell(id) {
      const o = qol.sellOffer(id);
      if (!o) return null;
      const u = Player.unit(id);
      u.shards -= o.shards;
      Player.state.credits += o.credits;
      Player.state.crystals += o.kyber;
      Player.save();
      return o;
    },
    // Three battles in a row on Auto, with the squad you last used.
    replay3(params) {
      Player.state.autoNext = 'repeat';
      Player.state.repeatN = 2;
      Player.state.repeatLeft = 2;
      Player.save();
      try {
        const k = 'swcg-battle-prefs';
        const pr = JSON.parse(localStorage.getItem(k)) || {};
        pr.auto = true;
        localStorage.setItem(k, JSON.stringify(pr));
      } catch (e) { /* prefs are optional */ }
      if (root.BattleUI && root.BattleUI.quickStart) root.BattleUI.quickStart(params);
      else UI.App.go('squad', params);
    },
  };
  const baseComplete2 = Player.completeEncounter;
  Player.completeEncounter = function (params, won, rng) {
    const before = this.state.credits;
    const out = baseComplete2.call(this, params, won, rng);
    if (on() && params && params.type !== 'tutorial') {
      if (!SESSION.start || Date.now() - SESSION.last > 30 * 60000) { SESSION.start = Date.now() - 60000; SESSION.credits = 0; SESSION.battles = 0; }
      SESSION.last = Date.now();
      SESSION.battles += 1;
      SESSION.credits += Math.max(0, this.state.credits - before);
    }
    return out;
  };
  root.QoL24 = qol;

  // ---------- Card level costs: 31-35 and the new 41-50 ----------
  // A quarter more for each level from 31 to 35, so taking a card from level
  // 1 to 35 costs about 150,000 credits instead of 140,000.
  // Levels 41-50 (new in 2.4) cost half again as much: about 261,000 credits
  // to take a card from 40 to 50.
  const baseLevelCost = D.levelCost;
  D.levelCost = (level) => (level >= 40 ? Math.round(baseLevelCost(level) * 1.5 / 10) * 10 : level >= 31 && level <= 34 ? Math.round(baseLevelCost(level) * 1.25) : baseLevelCost(level));

  // ---------- Liberator of the Galaxy ----------
  if (H) {
    H.feats.push((s) => {
      const have = ALL_BOSSES.filter((id) => s.bosses[id]).length;
      return [{ id: 'liberator', tier: 7, icon: 'planet', name: 'Liberator of the Galaxy', desc: `Beat all ${ALL_BOSSES.length} bosses, main and optional. Reward: ???`, have, need: ALL_BOSSES.length }];
    });
    if (root.Lib24Crest) H.crests.liberator = () => root.Lib24Crest();
    H.battleEnd.push((battle, params, won) => {
      if (!won || !params || params.type !== 'boss') return;
      setTimeout(() => {
        const s = Player.state;
        if (s.lib24 && s.lib24.bendu) return;
        if (ALL_BOSSES.every((id) => s.bosses[id])) {
          lib().bendu = 1;
          Player.grantCard('bendu', false);
          Player.save();
          benduWaiting = true;
          whenFree(() => {
            let seen = [];
            try { seen = JSON.parse(localStorage.getItem('swcg-feats-seen') || '[]'); } catch (e) { seen = []; }
            if (!seen.includes('liberator')) return UI.celebrateFeat('liberator');
            benduWaiting = false;
            UI.walkout(D.UNIT_MAP.bendu, 'secret', false, { exclusive: true, isNew: true });
          });
        }
      }, 2500);
    });
    H.scenes.liberator = (x) => liberatorScene(x);
  }

  // ---------- The Liberator cutscene ----------
  // All 22 bosses ring the screen and fall one by one; the ring collapses
  // into a single point of light, light on one side and dark on the other,
  // and the Bendu rises out of it. The badge lands, and on close the Bendu
  // walks out as a new secret card (only the first time; a replay from the
  // badge shows the scene alone).
  let benduWaiting = false;
  const whenFree = (fn) => {
    const busy = () => (UI.App && UI.App.battleActive) || document.querySelector('.result-modal, .feat-show, .feat-cine, .walkout, .modal-backdrop');
    const tick = () => (busy() ? setTimeout(tick, 600) : fn());
    setTimeout(tick, 800);
  };
  const libCss = () => {
    if (document.getElementById('lib24-cine')) return;
    const st = document.createElement('style');
    st.id = 'lib24-cine';
    st.textContent = `
.feat-cine.lib24 { background: radial-gradient(ellipse at 50% 46%, #0d1430 0%, #04050c 62%, #000 100%); }
.lib24 .lb-stars { position: absolute; inset: 0; background-image: radial-gradient(1px 1px at 12% 18%, #fff, transparent), radial-gradient(1px 1px at 72% 12%, #cfe0ff, transparent), radial-gradient(1.5px 1.5px at 30% 78%, #fff, transparent), radial-gradient(1px 1px at 88% 64%, #ffd9d9, transparent), radial-gradient(1px 1px at 52% 34%, #fff, transparent), radial-gradient(1px 1px at 8% 58%, #cfe0ff, transparent), radial-gradient(1.5px 1.5px at 62% 88%, #fff, transparent), radial-gradient(1px 1px at 92% 30%, #fff, transparent); opacity: .8; }
.lib24 .lb-ring { position: absolute; left: 50%; top: 42%; width: 0; height: 0; }
.lib24 .lb-boss { position: absolute; width: 12vmin; height: 12vmin; margin: -6vmin 0 0 -6vmin; border-radius: 50%; overflow: hidden; border: 2px solid var(--c); box-shadow: 0 0 12px var(--c); transform: rotate(var(--a)) translateY(-30vmin) rotate(calc(-1 * var(--a))) scale(0); animation: lbIn .45s calc(var(--k) * .09s) cubic-bezier(.2, 1.4, .4, 1) forwards, lbFall .5s calc(2.6s + var(--k) * .06s) ease-in forwards; }
.lib24 .lb-boss .portrait, .lib24 .lb-boss svg { width: 100%; height: 100%; display: block; }
.lib24 .lb-boss::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, transparent 46%, #ff3a3a 47%, #ff3a3a 53%, transparent 54%); opacity: 0; animation: lbX .2s calc(2.3s + var(--k) * .06s) forwards; }
@keyframes lbIn { to { transform: rotate(var(--a)) translateY(-30vmin) rotate(calc(-1 * var(--a))) scale(1); } }
@keyframes lbX { to { opacity: .9; } }
@keyframes lbFall { from { transform: rotate(var(--a)) translateY(-30vmin) rotate(calc(-1 * var(--a))) scale(1); filter: none; } to { transform: rotate(var(--a)) translateY(0) rotate(calc(-1 * var(--a))) scale(.1); filter: grayscale(1) brightness(2); opacity: 0; } }
.lib24 .lb-core { position: absolute; left: 50%; top: 44%; width: 4vmin; height: 4vmin; margin: -2vmin 0 0 -2vmin; border-radius: 50%; background: radial-gradient(circle, #fff 0%, #fff 30%, transparent 70%); opacity: 0; animation: lbCore 1.4s 3.6s ease-out forwards; }
@keyframes lbCore { 0% { opacity: 0; transform: scale(.2); } 40% { opacity: 1; transform: scale(3); } 100% { opacity: .0; transform: scale(14); } }
.lib24 .lb-split { position: absolute; left: 50%; top: 44%; width: 90vmin; height: 90vmin; margin: -45vmin 0 0 -45vmin; border-radius: 50%; background: linear-gradient(90deg, rgba(60, 150, 255, .55) 0%, rgba(60, 150, 255, .15) 40%, transparent 50%, rgba(255, 50, 60, .15) 60%, rgba(255, 50, 60, .55) 100%); filter: blur(18px); opacity: 0; animation: lbFade 1.2s 4.2s forwards; }
.lib24 .lb-bendu { position: absolute; left: 50%; top: 44%; width: 34vmin; height: 34vmin; margin: -17vmin 0 0 -17vmin; border-radius: 50%; overflow: hidden; border: 3px solid #fff; box-shadow: -12px 0 30px #3c96ff, 12px 0 30px #ff323c, 0 0 60px rgba(255, 255, 255, .5); opacity: 0; transform: scale(.4); animation: lbRise 1.4s 4.4s cubic-bezier(.2, 1.2, .4, 1) forwards; }
.lib24 .lb-bendu .portrait, .lib24 .lb-bendu svg { width: 100%; height: 100%; display: block; }
@keyframes lbRise { to { opacity: 1; transform: scale(1); } }
@keyframes lbFade { to { opacity: 1; } }
.lib24 .lb-line { position: absolute; left: 0; right: 0; text-align: center; margin: 0; font-size: clamp(15px, 3.6vmin, 26px); font-weight: 700; letter-spacing: .04em; color: #e8f0ff; text-shadow: 0 2px 10px #000; opacity: 0; animation: lbLine 2s var(--t) forwards; }
.lib24 .lb-line.q { color: #ffe9a8; font-style: italic; animation-duration: 2.6s; }
@keyframes lbLine { 0% { opacity: 0; transform: translateY(8px); } 15%, 80% { opacity: 1; transform: none; } 100% { opacity: 0; } }
.lib24 .lb-line.stay { animation-name: lbStay; }
@keyframes lbStay { 0% { opacity: 0; transform: translateY(8px); } 20%, 100% { opacity: 1; transform: none; } }
.lib24.reveal .lb-line, .lib24.reveal .lb-ring { opacity: 0 !important; transition: opacity .3s; }
.lib24.reveal .lb-bendu { opacity: .35 !important; transform: scale(1) !important; animation: none; }
.lib24.skip .lb-split { opacity: 1; animation: none; }
@media (prefers-reduced-motion: reduce) { .lib24 .lb-boss, .lib24 .lb-core { animation: none; opacity: 0; } .lib24 .lb-bendu, .lib24 .lb-split { animation: none; opacity: 1; transform: none; } .lib24 .lb-line { animation: none; opacity: 0; } .lib24 .lb-line.stay { opacity: 1; } }`;
    document.head.appendChild(st);
  };
  function liberatorScene(x) {
    libCss();
    const bosses = ALL_BOSSES.map((id) => D.UNIT_MAP[id]).filter(Boolean);
    const ring = bosses.map((b, k) => `<span class="lb-boss" style="--k:${k};--a:${(k * 360) / bosses.length}deg;--c:${b.faction === 'dark' ? '#ff4a4a' : '#5ab4ff'}">${UI.portrait(b, { plate: false })}</span>`).join('');
    const bendu = D.UNIT_MAP.bendu;
    const node = UI.el(`<div class="feat-cine lib24" role="dialog" aria-label="${UI.esc(x.name)}">
      <div class="lb-stars"></div>
      <div class="lb-ring">${ring}</div>
      <p class="lb-line" style="top:80%;--t:.4s">${bosses.length} bosses. Eleven worlds.</p>
      <p class="lb-line" style="top:80%;--t:2.4s">Every one of them has fallen.</p>
      <i class="lb-split"></i><i class="lb-core"></i>
      <div class="lb-bendu">${bendu ? UI.portrait(bendu, { plate: false }) : ''}</div>
      <p class="lb-line q stay" style="top:76%;--t:5s">"I am the one in the middle."</p>
      <i class="fc-flash"></i>
      ${UI.featBadge(x, 'fc-badge')}
      ${Array.from({ length: 80 }, (_, k) => `<i class="fs-spark" style="--a:${(k * 137.5) % 360}deg;--d:${(k % 9) * 0.05}s;--r:${22 + (k % 6) * 7}vmin;--c:${k % 2 ? '#5ab4ff' : '#ff4a4a'}"></i>`).join('')}
      <div class="fs-text fc-text"><span class="fs-kicker">Legendary achievement</span><b>${UI.esc(x.name)}</b><span>${UI.esc(x.desc)}</span></div>
      <span class="pc-skip">Tap to skip</span>
    </div>`);
    document.body.appendChild(node);
    const S = root.Sound;
    const timers = [];
    const at = (t, fn) => timers.push(setTimeout(() => node.isConnected && fn(), t));
    if (S) {
      S.play('whoosh');
      bosses.forEach((_, k) => { if (k % 4 === 0) at(k * 90, () => S.play('click')); });
      at(2300, () => S.play('crit')); at(3000, () => S.play('ko'));
      at(3600, () => S.play('ult')); at(4400, () => S.play('ignite'));
    }
    node.classList.add('play');
    const REVEAL = 7600;
    let done = false;
    const reveal = (skip) => {
      if (node.classList.contains('reveal')) return;
      node.classList.add('reveal'); if (skip) node.classList.add('skip');
      node.querySelector('.pc-skip').textContent = 'Tap to close';
      if (S) { S.play('burst'); S.play('reveal_mythic'); }
    };
    node.addEventListener('click', () => {
      if (!node.classList.contains('reveal')) return reveal(true);
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      node.classList.add('out');
      setTimeout(() => {
        node.remove();
        if (benduWaiting && bendu && UI.walkout) { benduWaiting = false; UI.walkout(bendu, 'secret', false, { exclusive: true, isNew: true }); }
      }, 450);
    });
    at(REVEAL, () => reveal(false));
  }

  // ---------- Battle rules for the new bosses and the Bendu ----------
  const BP = root.Battle && root.Battle.prototype;
  if (BP && !BP.__l24) {
    BP.__l24 = true;
    const mech = (u) => u && u.def && u.def.mech;
    const say = (events, text, side) => events.push({ type: 'log', text, side: side || 'enemy' });
    const isJedi = (u) => (D.traitsOf ? D.traitsOf(u.id) : []).includes('jedi');
    const hide = (list) => { const up = list.filter((u) => !u.statuses.frozen); return up.length ? up : list; };
    const freeze = (b, boss, target, turns, ev) => {
      target.statuses.frozen = turns;
      target.statuses.stun = Math.max(target.statuses.stun || 0, turns);
      ev.push({ type: 'b22', uid: boss.uid, text: 'Carbon Freeze!' });
      ev.push({ type: 'status', uid: target.uid, status: 'frozen', turns });
      say(ev, `${target.def.name} is frozen in carbonite for ${turns} turns!`);
    };

    const baseBegin = BP.beginTurn;
    BP.beginTurn = function (unit) {
      const out = baseBegin.call(this, unit);
      const m = mech(unit);
      if (!m || !unit.alive) return out;
      const ev = out.events;
      unit.__lt = (unit.__lt || 0) + 1;
      const n = unit.__lt;
      if (m.freeze && n % m.freeze.every === 0) {
        const foes = this.opponents(unit).filter((u) => !u.statuses.frozen);
        if (foes.length) freeze(this, unit, foes.slice().sort((a, b) => b.hp - a.hp)[0], m.freeze.turns, ev);
      }
      if (m.order66 && n === m.order66.turn) {
        for (const a of this.living(unit.side)) { a.statuses.order66 = 99; ev.push({ type: 'status', uid: a.uid, status: 'order66', turns: 99 }); }
        ev.push({ type: 'b22', uid: unit.uid, text: 'Execute Order 66!' });
        say(ev, 'Order 66: every clone now deals double damage to Jedi.');
      }
      if (m.mirror) {
        // The vision copies the strongest buff in your squad.
        const keys = ['offUp', 'defUp'];
        let best = null;
        for (const f of this.opponents(unit)) for (const k of keys) if (f.statuses[k] && (!best || f.statuses[k] > best[1])) best = [k, f.statuses[k]];
        if (best && !unit.statuses[best[0]]) {
          unit.statuses[best[0]] = best[1];
          ev.push({ type: 'status', uid: unit.uid, status: best[0], turns: best[1] });
          say(ev, `The vision mirrors your strength: it gains ${D.STATUS_INFO[best[0]].label}.`);
        }
      }
      // The Emperor's shield comes back whenever a Sith trooper escort stands
      // again (The Sith Eternal brings them back), and life support heals him
      // while it holds.
      if (m.regenShield && m.shield && !unit.statuses.shielded && this.living(unit.side).some((u) => m.shield.includes(u.id))) {
        unit.statuses.shielded = 99;
        ev.push({ type: 'status', uid: unit.uid, status: 'shielded', turns: 99 });
        ev.push({ type: 'b22', uid: unit.uid, text: 'Shield restored!' });
        say(ev, `A Sith trooper stands guard again: ${unit.def.name}'s shield is back up.`);
      }
      if (m.regenShield && unit.statuses.shielded && unit.hp < unit.maxHp) {
        const amount = Math.min(unit.maxHp - unit.hp, Math.round(unit.maxHp * m.regenShield));
        unit.hp += amount;
        ev.push({ type: 'heal', uid: unit.uid, amount, hp: unit.hp, source: 'regen' });
        say(ev, `Life support keeps ${unit.def.name} alive (+${amount}).`);
      }
      if (m.dodge) unit.__dodge = true;
      return out;
    };

    const baseValid = BP.validTargets;
    BP.validTargets = function (unit, i) {
      const list = baseValid.call(this, unit, i);
      return unit.abilities[i].target === 'enemy' ? hide(list) : list;
    };
    const baseResolve = BP.resolveTargets;
    BP.resolveTargets = function (unit, ab, targetUid) {
      if (ab.target === 'strongestJedi') {
        const foes = hide(this.opponents(unit));
        const jedi = foes.filter(isJedi);
        const pool = jedi.length ? jedi : foes;
        return pool.length ? [pool.slice().sort((a, b) => b.atk - a.atk)[0]] : [];
      }
      if (ab.target === 'weakestEnemy') {
        const foes = hide(this.opponents(unit));
        return foes.length ? [foes.slice().sort((a, b) => a.hp - b.hp)[0]] : [];
      }
      if (ab.target === 'weakestAlly') {
        const al = this.living(unit.side);
        return al.length ? [al.slice().sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0]] : [];
      }
      if (ab.target === 'randomEnemies') {
        const foes = hide(this.opponents(unit));
        const n = ab.hits || 2;
        return foes.length ? Array.from({ length: n }, () => foes[Math.floor(this.rng() * foes.length)]) : [];
      }
      const list = baseResolve.call(this, unit, ab, targetUid);
      return ab.target === 'allEnemies' ? hide(list) : list;
    };
    const baseNeeds = BP.needsTarget;
    if (baseNeeds) {
      BP.needsTarget = function (unit, i) {
        const t = unit.abilities[i].target;
        if (t === 'strongestJedi' || t === 'weakestEnemy' || t === 'weakestAlly' || t === 'randomEnemies') return false;
        return baseNeeds.call(this, unit, i);
      };
    }

    const baseAct = BP.act;
    BP.act = function (unit, i, targetUid) {
      const ab = unit.abilities[i];
      const m = mech(unit);
      // Grievous loses a blade for every quarter of his health gone.
      let restore = null;
      if (m && m.arms && i === 0 && !ab.ultimate) {
        const arms = Math.max(1, Math.ceil((unit.hp / unit.maxHp) * m.arms));
        const eff = ab.effects.find((e) => e.type === 'damage');
        if (eff && eff.hits !== arms) { restore = [eff, eff.hits]; eff.hits = arms; }
      }
      const before = m && m.power ? true : false;
      let events;
      try { events = baseAct.call(this, unit, i, targetUid); } finally { if (restore) restore[0].hits = restore[1]; }
      if (before && unit.alive && i > 0 && !ab.ultimate) {
        unit.__power = (unit.__power || 0) + 1;
        if (unit.__power >= m.power.at) {
          unit.__power = 0;
          events.push({ type: 'b22', uid: unit.uid, text: 'Unlimited Power!' });
          say(events, `${unit.def.name}'s power overflows: lightning strikes your whole squad!`);
          for (const f of hide(this.opponents(unit))) {
            const { amount, crit } = this.rollDamage(unit, f, m.power.mult);
            this.applyDamage(f, amount, crit, events);
            if (f.alive && !f.boss && this.rng() < 0.3) { f.statuses.stun = Math.max(f.statuses.stun || 0, 1); events.push({ type: 'status', uid: f.uid, status: 'stun', turns: 1 }); }
          }
        } else say(events, `Sith power gathers: ${unit.__power}/${m.power.at}.`);
      }
      return events;
    };

    const baseEffect = BP.applyEffect;
    BP.applyEffect = function (source, target, eff, events) {
      switch (eff.type) {
        case 'freezeTop': {
          const foes = this.opponents(source).filter((u) => !u.statuses.frozen);
          if (foes.length && target === this.opponents(source)[0]) freeze(this, source, foes.slice().sort((a, b) => b.hp - a.hp)[0], 2, events);
          return;
        }
        case 'teamStrike': {
          for (const a of this.living(source.side)) {
            if (a === source || !target.alive) continue;
            const { amount, crit } = this.rollDamage(a, target, eff.mult);
            this.__src = a;
            this.applyDamage(target, amount, crit, events);
            this.__src = null;
          }
          return;
        }
        case 'mirrorStrike': {
          const { amount, crit } = this.rollDamage(target, target, eff.mult);
          this.applyDamage(target, amount, crit, events);
          return;
        }
        case 'drainUlt':
          target.ult = Math.max(0, target.ult - eff.amount);
          events.push({ type: 'ult', uid: target.uid, value: target.ult });
          return;
        case 'store': {
          if (target !== source) return;
          this.__storeAdd(source, Math.round(source.maxHp * eff.pct), events);
          return;
        }
        case 'release': {
          // The Bendu lets go of everything he's soaked up: split across every
          // enemy (the first target's turn through runs the whole release).
          const foes = this.opponents(source);
          if (target !== foes[0]) return;
          const pool = Math.round((source.__store || 0) * eff.mult);
          source.__store = 0;
          delete source.statuses.stored;
          if (!pool) { say(events, `${source.def.name} has nothing stored yet.`, source.side); return; }
          const share = Math.max(1, Math.round(pool / foes.length));
          events.push({ type: 'b22', uid: source.uid, text: 'Released!' });
          say(events, `${source.def.name} releases ${pool} stored power!`, source.side);
          for (const f of foes) if (f.alive) this.applyDamage(f, share, false, events);
          const strong = foes.filter((f) => f.alive && !f.boss).sort((a, b) => b.atk - a.atk)[0];
          if (strong) { strong.statuses.stun = Math.max(strong.statuses.stun || 0, 1); events.push({ type: 'status', uid: strong.uid, status: 'stun', turns: 1 }); }
          return;
        }
        case 'damage': {
          let mult = eff.mult;
          if (eff.vsJedi && isJedi(target)) mult *= eff.vsJedi;
          if (eff.vsIds && eff.vsIds[target.id]) mult *= eff.vsIds[target.id];
          if (source.statuses.order66 && isJedi(target)) mult *= 2;
          this.__src = source;
          try { return baseEffect.call(this, source, target, mult === eff.mult ? eff : { ...eff, mult }, events); } finally { this.__src = null; }
        }
        default:
          return baseEffect.call(this, source, target, eff, events);
      }
    };

    BP.__storeAdd = function (u, amount, events) {
      const cap = Math.round(u.maxHp * ((u.def.store && u.def.store.cap) || 2));
      const before = u.__store || 0;
      u.__store = Math.min(cap, before + Math.max(0, Math.round(amount)));
      if (u.__store > before) {
        u.statuses.stored = 99;
        if (!before) events.push({ type: 'status', uid: u.uid, status: 'stored', turns: 99 });
      }
    };

    const baseDamage = BP.applyDamage;
    BP.applyDamage = function (target, amount, crit, events, source) {
      const src = this.__src;
      const m = mech(target);
      if (!source) {
        if (target.statuses.frozen) amount = 0;
        if (m && m.armor) amount = Math.round(amount * m.armor * (src && m.weak && m.weak[src.id] ? m.weak[src.id] / m.armor : 1));
        if (m && m.dodge && target.__dodge && amount > 0 && src) {
          target.__dodge = false;
          events.push({ type: 'b22', uid: target.uid, text: 'Rocket pack dodge!' });
          say(events, `${target.def.name} rockets out of the way!`);
          amount = 0;
        }
        // The Bendu stores what hits him (all of it while absorbing), and a
        // share of what hits his allies.
        if (target.def.store && amount > 0) {
          this.__storeAdd(target, amount, events);
          if (target.statuses.absorb) amount = Math.max(1, Math.round(amount * 0.5));
        } else if (amount > 0) {
          for (const b of this.living(target.side)) if (b !== target && b.def.store) this.__storeAdd(b, amount * b.def.store.ally, events);
        }
      }
      const wasAlive = target.alive;
      baseDamage.call(this, target, Math.max(0, amount), crit, events, source);
      // Bossk takes his trophy: heals and gets angrier when one of yours falls.
      if (wasAlive && !target.alive) {
        for (const u of this.living(target.side === 'player' ? 'enemy' : 'player')) {
          const mm = mech(u);
          if (mm && mm.trophy) {
            const h = Math.min(u.maxHp - u.hp, Math.round(u.maxHp * mm.trophy));
            u.hp += h;
            u.statuses.offUp = Math.max(u.statuses.offUp || 0, 2);
            events.push({ type: 'heal', uid: u.uid, amount: h, hp: u.hp });
            events.push({ type: 'b22', uid: u.uid, text: 'Trophy taken!' });
            say(events, `${u.def.name} claims a trophy: +${h} health and Offense Up.`);
          }
        }
      }
    };
  }

  root.Lib24 = { WORLD_BOSSES, MAIN, OPTIONAL, ALL_BOSSES, OLD_LEN, lib };
})(typeof window !== 'undefined' ? window : globalThis);
