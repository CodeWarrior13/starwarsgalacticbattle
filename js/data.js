// Static game data: units, abilities, campaign stages and shop packs.
// Loaded as a plain script so the game runs straight from index.html.

(function (root) {
  const RARITIES = {
    common: { label: 'Common', mult: 1.0, weight: 0 },
    rare: { label: 'Rare', mult: 1.12, weight: 1 },
    epic: { label: 'Epic', mult: 1.25, weight: 2 },
    legendary: { label: 'Legendary', mult: 1.4, weight: 3 },
  };

  // Base stats by role at level 1, 1 star, common rarity.
  const ROLE_BASE = {
    attacker: { hp: 900, atk: 120, def: 40, spd: 130 },
    tank: { hp: 1400, atk: 80, def: 80, spd: 110 },
    support: { hp: 1000, atk: 95, def: 50, spd: 140 },
    healer: { hp: 1000, atk: 80, def: 55, spd: 125 },
  };

  const ROLE_ICONS = { attacker: '⚔', tank: '⛨', support: '✦', healer: '✚' };

  const STATUS_INFO = {
    stun: { label: 'Stunned', icon: '⚡', kind: 'debuff', desc: 'Skips their next turn.' },
    taunt: { label: 'Taunt', icon: '◎', kind: 'buff', desc: 'Enemies must target this unit.' },
    offUp: { label: 'Offense Up', icon: '▲', kind: 'buff', desc: '+50% attack.' },
    defUp: { label: 'Defense Up', icon: '⛨', kind: 'buff', desc: '+50% defense.' },
    offDown: { label: 'Offense Down', icon: '▼', kind: 'debuff', desc: '-40% attack.' },
    defDown: { label: 'Defense Down', icon: '⊘', kind: 'debuff', desc: '-50% defense.' },
    burn: { label: 'Burning', icon: '🔥', kind: 'debuff', desc: 'Takes 8% max HP damage each turn.' },
  };

  // Effect helpers keep the unit table below readable.
  const dmg = (mult, hits) => ({ type: 'damage', mult, hits: hits || 1 });
  const heal = (pct) => ({ type: 'heal', pct });
  const buff = (status, turns) => ({ type: 'status', status, turns, chance: 1 });
  const debuff = (status, turns, chance) => ({ type: 'status', status, turns, chance: chance == null ? 1 : chance });
  const tm = (amount) => ({ type: 'tm', amount });

  // target: enemy | allEnemies | ally | allAllies | self
  // Effects apply to the ability's target(s) unless `on: 'self'` or `on: 'allies'` is set.
  const UNITS = [
    // ---------- Characters: Light Side ----------
    {
      id: 'rebel_soldier', name: 'Rebel Trooper', kind: 'character', faction: 'light', rarity: 'common', role: 'attacker', accent: '#e8a33d',
      abilities: [
        { name: 'Blaster Shot', cd: 0, target: 'enemy', effects: [dmg(1.0)], desc: 'Deal damage to one enemy.' },
        { name: 'Covering Fire', cd: 3, target: 'allEnemies', effects: [dmg(0.5)], desc: 'Deal light damage to all enemies.' },
      ],
    },
    {
      id: 'clone_trooper', name: 'Clone Trooper', kind: 'character', faction: 'light', rarity: 'common', role: 'tank', accent: '#dfe6ee',
      abilities: [
        { name: 'Rifle Burst', cd: 0, target: 'enemy', effects: [dmg(0.9), debuff('defDown', 2, 0.3)], desc: 'Deal damage with a 30% chance to inflict Defense Down.' },
        { name: 'Hold the Line', cd: 3, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2)], desc: 'Gain Taunt and Defense Up for 2 turns.' },
      ],
    },
    {
      id: 'ewok_warrior', name: 'Ewok Warrior', kind: 'character', faction: 'light', rarity: 'common', role: 'healer', accent: '#9a6b3f',
      abilities: [
        { name: 'Spear Jab', cd: 0, target: 'enemy', effects: [dmg(0.8)], desc: 'Deal damage to one enemy.' },
        { name: 'Forest Remedy', cd: 3, target: 'allAllies', effects: [heal(0.15)], desc: 'Heal all allies for 15% of their max HP.' },
      ],
    },
    {
      id: 'han_solo', name: 'Han Solo', kind: 'character', faction: 'light', rarity: 'rare', role: 'attacker', accent: '#e8a33d', spd: 152,
      abilities: [
        { name: 'Quick Draw', cd: 0, target: 'enemy', effects: [dmg(1.1), { ...tm(20), on: 'self' }], desc: 'Deal damage and gain 20% Turn Meter.' },
        { name: 'Shoots First', cd: 4, target: 'enemy', effects: [dmg(2.0), debuff('stun', 1, 0.6)], desc: 'Deal heavy damage with a 60% chance to Stun.' },
      ],
    },
    {
      id: 'chewbacca', name: 'Chewbacca', kind: 'character', faction: 'light', rarity: 'rare', role: 'tank', accent: '#8a5a2b',
      abilities: [
        { name: 'Bowcaster', cd: 0, target: 'enemy', effects: [dmg(1.0), debuff('stun', 1, 0.2)], desc: 'Deal damage with a 20% chance to Stun.' },
        { name: 'Wookiee Rage', cd: 3, target: 'self', effects: [buff('taunt', 2), heal(0.2), buff('offUp', 2)], desc: 'Gain Taunt and Offense Up, and heal 20%.' },
      ],
    },
    {
      id: 'leia', name: 'Leia Organa', kind: 'character', faction: 'light', rarity: 'rare', role: 'support', accent: '#e6e6e6',
      abilities: [
        { name: 'Precise Shot', cd: 0, target: 'enemy', effects: [dmg(1.0)], desc: 'Deal damage to one enemy.' },
        { name: 'Rally the Rebellion', cd: 4, target: 'allAllies', effects: [buff('offUp', 2), tm(20)], desc: 'All allies gain Offense Up and 20% Turn Meter.' },
      ],
    },
    {
      id: 'r2d2', name: 'R2-D2', kind: 'character', faction: 'light', rarity: 'rare', role: 'healer', accent: '#3d7be8',
      abilities: [
        { name: 'Shock Prod', cd: 0, target: 'enemy', effects: [dmg(0.8), debuff('stun', 1, 0.25)], desc: 'Deal damage with a 25% chance to Stun.' },
        { name: 'Patch Up', cd: 3, target: 'allAllies', effects: [heal(0.12), buff('defUp', 2)], desc: 'Heal all allies 12% and grant Defense Up.' },
      ],
    },
    {
      id: 'obi_wan', name: 'Obi-Wan Kenobi', kind: 'character', faction: 'light', rarity: 'epic', role: 'tank', accent: '#3d7be8',
      abilities: [
        { name: 'Soresu Strike', cd: 0, target: 'enemy', effects: [dmg(1.0), debuff('offDown', 2, 0.4)], desc: 'Deal damage with a 40% chance to inflict Offense Down.' },
        { name: 'Elegant Defense', cd: 4, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2), { ...heal(0.1), on: 'allies' }], desc: 'Gain Taunt and Defense Up; heal all allies 10%.' },
      ],
    },
    {
      id: 'luke', name: 'Luke Skywalker', kind: 'character', faction: 'light', rarity: 'epic', role: 'attacker', accent: '#46c46a',
      abilities: [
        { name: 'Saber Slash', cd: 0, target: 'enemy', effects: [dmg(1.2)], desc: 'Deal damage to one enemy.' },
        { name: 'Jedi Resolve', cd: 3, target: 'enemy', effects: [dmg(2.2), { ...buff('offUp', 2), on: 'self' }], desc: 'Deal heavy damage and gain Offense Up.' },
      ],
    },
    {
      id: 'yoda', name: 'Yoda', kind: 'character', faction: 'light', rarity: 'legendary', role: 'support', accent: '#46c46a', spd: 160,
      abilities: [
        { name: 'Masterstroke', cd: 0, target: 'enemy', effects: [dmg(1.2)], desc: 'Deal damage to one enemy.' },
        { name: 'Battle Meditation', cd: 4, target: 'allAllies', effects: [heal(0.2), buff('offUp', 2), buff('defUp', 2), tm(25)], desc: 'All allies heal 20%, gain Offense Up, Defense Up and 25% Turn Meter.' },
        { name: 'Unstoppable Force', cd: 3, target: 'enemy', effects: [dmg(1.9), debuff('stun', 1, 0.5)], desc: 'Deal heavy damage with a 50% chance to Stun.' },
      ],
    },
    {
      id: 'rey', name: 'Rey', kind: 'character', faction: 'light', rarity: 'legendary', role: 'attacker', accent: '#3d7be8', spd: 150,
      abilities: [
        { name: 'Staff Sweep', cd: 0, target: 'enemy', effects: [dmg(1.15), { ...tm(10), on: 'self' }], desc: 'Deal damage and gain 10% Turn Meter.' },
        { name: 'Force Awakens', cd: 3, target: 'enemy', effects: [dmg(2.6), debuff('defDown', 2)], desc: 'Deal massive damage and inflict Defense Down.' },
        { name: 'Resilience', cd: 4, target: 'self', effects: [heal(0.3), buff('defUp', 2)], desc: 'Heal 30% and gain Defense Up.' },
      ],
    },

    // ---------- Characters: Dark Side ----------
    {
      id: 'stormtrooper', name: 'Stormtrooper', kind: 'character', faction: 'dark', rarity: 'common', role: 'tank', accent: '#f2f2f2',
      abilities: [
        { name: 'E-11 Blast', cd: 0, target: 'enemy', effects: [dmg(0.9)], desc: 'Deal damage to one enemy.' },
        { name: 'Imperial Formation', cd: 3, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2)], desc: 'Gain Taunt and Defense Up for 2 turns.' },
      ],
    },
    {
      id: 'battle_droid', name: 'B1 Battle Droid', kind: 'character', faction: 'dark', rarity: 'common', role: 'attacker', accent: '#c9b48a',
      abilities: [
        { name: 'Roger Roger', cd: 0, target: 'enemy', effects: [dmg(1.0)], desc: 'Deal damage to one enemy.' },
        { name: 'Droid Swarm', cd: 3, target: 'allEnemies', effects: [dmg(0.45)], desc: 'Deal light damage to all enemies.' },
      ],
    },
    {
      id: 'tusken_raider', name: 'Tusken Raider', kind: 'character', faction: 'dark', rarity: 'common', role: 'attacker', accent: '#b89a6a',
      abilities: [
        { name: 'Gaffi Strike', cd: 0, target: 'enemy', effects: [dmg(1.05), debuff('burn', 2, 0.25)], desc: 'Deal damage with a 25% chance to Burn.' },
        { name: 'Cycler Rifle', cd: 3, target: 'enemy', effects: [dmg(1.8)], desc: 'Deal heavy damage to one enemy.' },
      ],
    },
    {
      id: 'boba_fett', name: 'Boba Fett', kind: 'character', faction: 'dark', rarity: 'rare', role: 'attacker', accent: '#4f8a5b',
      abilities: [
        { name: 'EE-3 Carbine', cd: 0, target: 'enemy', effects: [dmg(1.1)], desc: 'Deal damage to one enemy.' },
        { name: 'Thermal Detonator', cd: 4, target: 'allEnemies', effects: [dmg(0.8), debuff('burn', 2, 0.6)], desc: 'Damage all enemies with a 60% chance to Burn.' },
      ],
    },
    {
      id: 'tarkin', name: 'Grand Moff Tarkin', kind: 'character', faction: 'dark', rarity: 'rare', role: 'support', accent: '#6b7a6b',
      abilities: [
        { name: 'Tactical Order', cd: 0, target: 'enemy', effects: [dmg(0.9), debuff('offDown', 2, 0.5)], desc: 'Deal damage with a 50% chance to inflict Offense Down.' },
        { name: 'Imperial Command', cd: 4, target: 'allAllies', effects: [buff('offUp', 2), tm(15)], desc: 'All allies gain Offense Up and 15% Turn Meter.' },
      ],
    },
    {
      id: 'darth_maul', name: 'Darth Maul', kind: 'character', faction: 'dark', rarity: 'epic', role: 'attacker', accent: '#e23b3b', spd: 160,
      abilities: [
        { name: 'Double-Bladed Strike', cd: 0, target: 'enemy', effects: [dmg(0.6, 2)], desc: 'Strike one enemy twice.' },
        { name: 'Savage Assault', cd: 4, target: 'allEnemies', effects: [dmg(0.9), debuff('defDown', 2, 0.7)], desc: 'Damage all enemies with a 70% chance of Defense Down.' },
      ],
    },
    {
      id: 'kylo_ren', name: 'Kylo Ren', kind: 'character', faction: 'dark', rarity: 'epic', role: 'attacker', accent: '#e23b3b',
      abilities: [
        { name: 'Unstable Slash', cd: 0, target: 'enemy', effects: [dmg(1.3), debuff('burn', 2, 0.3)], desc: 'Deal damage with a 30% chance to Burn.' },
        { name: 'Force Freeze', cd: 4, target: 'enemy', effects: [dmg(1.5), debuff('stun', 1)], desc: 'Deal damage and Stun the target.' },
      ],
    },
    {
      id: 'count_dooku', name: 'Count Dooku', kind: 'character', faction: 'dark', rarity: 'epic', role: 'support', accent: '#e23b3b',
      abilities: [
        { name: 'Makashi Riposte', cd: 0, target: 'enemy', effects: [dmg(1.0), debuff('offDown', 2, 0.35)], desc: 'Deal damage with a 35% chance of Offense Down.' },
        { name: 'Force Lightning', cd: 5, target: 'allEnemies', effects: [dmg(0.7), debuff('stun', 1, 0.5)], desc: 'Damage all enemies with a 50% chance to Stun.' },
      ],
    },
    {
      id: 'vader', name: 'Darth Vader', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', accent: '#e23b3b',
      abilities: [
        { name: 'Crushing Strike', cd: 0, target: 'enemy', effects: [dmg(1.2), debuff('defDown', 2, 0.4)], desc: 'Deal damage with a 40% chance of Defense Down.' },
        { name: 'Force Choke', cd: 4, target: 'enemy', effects: [dmg(1.6), debuff('stun', 1)], desc: 'Deal damage and Stun the target.' },
        { name: 'Culling Blade', cd: 5, target: 'allEnemies', effects: [dmg(1.0), debuff('burn', 2)], desc: 'Damage all enemies and Burn them.' },
      ],
    },
    {
      id: 'palpatine', name: 'Emperor Palpatine', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'support', accent: '#8f5de8', spd: 150,
      abilities: [
        { name: 'Sith Lightning', cd: 0, target: 'enemy', effects: [dmg(1.0), debuff('burn', 1, 0.6)], desc: 'Deal damage with a 60% chance to Burn.' },
        { name: 'Lightning Storm', cd: 4, target: 'allEnemies', effects: [dmg(1.1), debuff('stun', 1, 0.4)], desc: 'Damage all enemies with a 40% chance to Stun.' },
        { name: 'Dark Side Dominion', cd: 4, target: 'allAllies', effects: [buff('offUp', 2), tm(20)], desc: 'All allies gain Offense Up and 20% Turn Meter.' },
      ],
    },

    // ---------- Ships: Light Side ----------
    {
      id: 'a_wing', name: 'RZ-1 A-wing', kind: 'ship', faction: 'light', rarity: 'common', role: 'attacker', shape: 'awing', spd: 170,
      abilities: [
        { name: 'Rapid Fire', cd: 0, target: 'enemy', effects: [dmg(1.0), { ...tm(10), on: 'self' }], desc: 'Deal damage and gain 10% Turn Meter.' },
        { name: 'Target Lock', cd: 3, target: 'enemy', effects: [dmg(1.8), debuff('defDown', 2)], desc: 'Deal heavy damage and inflict Defense Down.' },
      ],
    },
    {
      id: 'y_wing', name: 'BTL Y-wing', kind: 'ship', faction: 'light', rarity: 'common', role: 'tank', shape: 'ywing',
      abilities: [
        { name: 'Ion Cannon', cd: 0, target: 'enemy', effects: [dmg(0.9), debuff('stun', 1, 0.3)], desc: 'Deal damage with a 30% chance to Stun.' },
        { name: 'Deflector Shields', cd: 3, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2)], desc: 'Gain Taunt and Defense Up.' },
      ],
    },
    {
      id: 'x_wing', name: 'T-65 X-wing', kind: 'ship', faction: 'light', rarity: 'rare', role: 'attacker', shape: 'xwing',
      abilities: [
        { name: 'Laser Cannons', cd: 0, target: 'enemy', effects: [dmg(1.1)], desc: 'Deal damage to one enemy.' },
        { name: 'Proton Torpedoes', cd: 3, target: 'enemy', effects: [dmg(2.1)], desc: 'Deal heavy damage to one enemy.' },
      ],
    },
    {
      id: 'b_wing', name: 'A/SF-01 B-wing', kind: 'ship', faction: 'light', rarity: 'epic', role: 'tank', shape: 'bwing',
      abilities: [
        { name: 'Heavy Ion Burst', cd: 0, target: 'enemy', effects: [dmg(1.0), debuff('offDown', 2, 0.4)], desc: 'Deal damage with a 40% chance of Offense Down.' },
        { name: 'Shield Relay', cd: 4, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2), { ...heal(0.12), on: 'allies' }], desc: 'Gain Taunt and Defense Up; heal all allies 12%.' },
      ],
    },
    {
      id: 'falcon', name: 'Millennium Falcon', kind: 'ship', faction: 'light', rarity: 'legendary', role: 'support', shape: 'falcon', spd: 155,
      abilities: [
        { name: 'Quad Lasers', cd: 0, target: 'enemy', effects: [dmg(1.1, 2)], desc: 'Hit one enemy twice.' },
        { name: 'Evasive Maneuvers', cd: 4, target: 'allAllies', effects: [heal(0.15), buff('defUp', 2), tm(20)], desc: 'All allies heal 15%, gain Defense Up and 20% Turn Meter.' },
        { name: 'Point Blank', cd: 4, target: 'enemy', effects: [dmg(2.4), debuff('stun', 1, 0.5)], desc: 'Deal massive damage with a 50% chance to Stun.' },
      ],
    },

    // ---------- Ships: Dark Side ----------
    {
      id: 'tie_fighter', name: 'TIE Fighter', kind: 'ship', faction: 'dark', rarity: 'common', role: 'attacker', shape: 'tie', spd: 160,
      abilities: [
        { name: 'Twin Lasers', cd: 0, target: 'enemy', effects: [dmg(1.0)], desc: 'Deal damage to one enemy.' },
        { name: 'Swarm Tactics', cd: 3, target: 'allEnemies', effects: [dmg(0.5)], desc: 'Deal light damage to all enemies.' },
      ],
    },
    {
      id: 'tie_bomber', name: 'TIE Bomber', kind: 'ship', faction: 'dark', rarity: 'common', role: 'attacker', shape: 'tiebomber', spd: 115,
      abilities: [
        { name: 'Bomb Run', cd: 0, target: 'enemy', effects: [dmg(0.95), debuff('burn', 2, 0.3)], desc: 'Deal damage with a 30% chance to Burn.' },
        { name: 'Carpet Bombing', cd: 4, target: 'allEnemies', effects: [dmg(0.7), debuff('burn', 2, 0.5)], desc: 'Damage all enemies with a 50% chance to Burn.' },
      ],
    },
    {
      id: 'lambda_shuttle', name: 'Lambda Shuttle', kind: 'ship', faction: 'dark', rarity: 'rare', role: 'tank', shape: 'shuttle',
      abilities: [
        { name: 'Defensive Cannons', cd: 0, target: 'enemy', effects: [dmg(0.9)], desc: 'Deal damage to one enemy.' },
        { name: 'Deflector Array', cd: 3, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2), heal(0.1)], desc: 'Gain Taunt and Defense Up, and heal 10%.' },
      ],
    },
    {
      id: 'slave_one', name: 'Slave I', kind: 'ship', faction: 'dark', rarity: 'epic', role: 'support', shape: 'slave',
      abilities: [
        { name: 'Blaster Cannons', cd: 0, target: 'enemy', effects: [dmg(1.05)], desc: 'Deal damage to one enemy.' },
        { name: 'Seismic Charge', cd: 4, target: 'allEnemies', effects: [dmg(0.8), debuff('stun', 1, 0.35)], desc: 'Damage all enemies with a 35% chance to Stun.' },
      ],
    },
    {
      id: 'tie_advanced', name: 'TIE Advanced x1', kind: 'ship', faction: 'dark', rarity: 'legendary', role: 'attacker', shape: 'tieadv', spd: 158,
      abilities: [
        { name: 'Targeted Fire', cd: 0, target: 'enemy', effects: [dmg(1.2)], desc: 'Deal damage to one enemy.' },
        { name: 'I Have You Now', cd: 3, target: 'enemy', effects: [dmg(2.3), debuff('defDown', 2)], desc: 'Deal massive damage and inflict Defense Down.' },
        { name: 'Squadron Lead', cd: 4, target: 'allAllies', effects: [buff('offUp', 2), tm(15)], desc: 'All allies gain Offense Up and 15% Turn Meter.' },
      ],
    },
  ];

  // Ultimates charge as a unit acts, deals damage and takes damage.
  // When the meter is full the ultimate can be fired, which plays a cutscene.
  const U = (name, target, effects, desc, quote) => ({ name, cd: 0, target, effects, desc, quote, ultimate: true });
  const ULTIMATES = {
    han_solo: U('Never Tell Me the Odds', 'enemy', [dmg(3.4), debuff('stun', 1)], 'Deal massive damage and Stun the target.', 'Never tell me the odds!'),
    chewbacca: U('Wookiee Fury', 'allEnemies', [dmg(1.3), { ...buff('taunt', 2), on: 'self' }, { ...heal(0.2), on: 'self' }], 'Damage all enemies, gain Taunt and heal 20%.', 'RRAAWWRRGH!'),
    leia: U('Rebel Command', 'allAllies', [heal(0.25), buff('offUp', 3), tm(50)], 'All allies heal 25%, gain Offense Up for 3 turns and 50% Turn Meter.', 'Help us. You\'re our only hope.'),
    r2d2: U('Hidden Tricks', 'allAllies', [heal(0.35), buff('defUp', 3), tm(25)], 'All allies heal 35%, gain Defense Up and 25% Turn Meter.', 'Bee-boo-bweep!'),
    obi_wan: U('The High Ground', 'enemy', [dmg(3.0), debuff('stun', 1), { ...buff('defUp', 3), on: 'self' }], 'Deal massive damage, Stun the target and gain Defense Up.', 'It\'s over. I have the high ground.'),
    luke: U('Return of the Jedi', 'allEnemies', [dmg(1.8), debuff('defDown', 2)], 'Deal heavy damage to all enemies and inflict Defense Down.', 'I am a Jedi, like my father before me.'),
    yoda: U('Size Matters Not', 'allEnemies', [dmg(1.6), debuff('stun', 1, 0.6), { ...heal(0.2), on: 'allies' }], 'Damage all enemies with a 60% Stun chance; heal all allies 20%.', 'Judge me by my size, do you?'),
    rey: U('Rise of Skywalker', 'enemy', [dmg(4.0), { ...heal(0.3), on: 'self' }], 'Deal devastating damage and heal 30%.', 'I am all the Jedi.'),
    boba_fett: U('Bounty Claimed', 'enemy', [dmg(3.5), debuff('burn', 3)], 'Deal massive damage and Burn the target for 3 turns.', 'He\'s no good to me dead.'),
    tarkin: U('Station Protocol', 'allEnemies', [dmg(1.5), debuff('offDown', 2)], 'Damage all enemies and inflict Offense Down.', 'You may fire when ready.'),
    darth_maul: U('Sith Fury', 'allEnemies', [dmg(1.1, 2)], 'Strike all enemies twice.', 'At last we will have revenge.'),
    kylo_ren: U('Supreme Leader', 'enemy', [dmg(3.6), debuff('stun', 1)], 'Deal massive damage and Stun the target.', 'Let the past die.'),
    count_dooku: U('Lightning Storm', 'allEnemies', [dmg(1.3), debuff('stun', 1, 0.7)], 'Damage all enemies with a 70% chance to Stun.', 'Twice the pride, double the fall.'),
    vader: U('Wrath of the Sith Lord', 'allEnemies', [dmg(2.0), debuff('stun', 1, 0.5)], 'Deal heavy damage to all enemies with a 50% chance to Stun.', 'I find your lack of faith disturbing.'),
    palpatine: U('Unlimited Power', 'allEnemies', [dmg(2.1), debuff('burn', 2), debuff('stun', 1, 0.5)], 'Damage and Burn all enemies, with a 50% chance to Stun.', 'UNLIMITED POWER!'),
    x_wing: U('Trench Run', 'enemy', [dmg(4.0)], 'Fire a devastating torpedo at one enemy.', 'Use the Force, Luke.'),
    b_wing: U('Heavy Assault Array', 'allEnemies', [dmg(1.2), debuff('offDown', 2), { ...buff('taunt', 2), on: 'self' }], 'Damage all enemies, inflict Offense Down and gain Taunt.', 'Lock S-foils in attack position.'),
    falcon: U('Kessel Run', 'allEnemies', [dmg(1.8), { ...tm(30), on: 'allies' }], 'Deal heavy damage to all enemies; all allies gain 30% Turn Meter.', 'Punch it, Chewie!'),
    slave_one: U('Seismic Barrage', 'allEnemies', [dmg(1.6), debuff('stun', 1, 0.5)], 'Damage all enemies with a 50% chance to Stun.', 'Stay on the leader.'),
    tie_advanced: U('I Have You Now', 'enemy', [dmg(4.2), debuff('stun', 1)], 'Deal devastating damage and Stun the target.', 'The Force is strong with this one.'),
    lambda_shuttle: U('Imperial Escort', 'allAllies', [heal(0.3), buff('defUp', 3)], 'All allies heal 30% and gain Defense Up for 3 turns.', 'Shuttle Tydirium, requesting deactivation of the shield.'),
  };

  const ROLE_ULTIMATES = {
    character: {
      attacker: U('Full Barrage', 'allEnemies', [dmg(1.4)], 'Deal heavy damage to all enemies.', 'Open fire!'),
      tank: U('Last Stand', 'self', [buff('taunt', 3), buff('defUp', 3), heal(0.35)], 'Gain Taunt and Defense Up for 3 turns and heal 35%.', 'Hold the line!'),
      healer: U('Field Triage', 'allAllies', [heal(0.4), buff('defUp', 2)], 'All allies heal 40% and gain Defense Up.', 'Stay with me!'),
      support: U('Tactical Surge', 'allAllies', [buff('offUp', 3), tm(40)], 'All allies gain Offense Up for 3 turns and 40% Turn Meter.', 'Move, move, move!'),
    },
    ship: {
      attacker: U('Strafing Run', 'allEnemies', [dmg(1.4)], 'Deal heavy damage to all enemies.', 'Attack formation!'),
      tank: U('Shield Wall', 'self', [buff('taunt', 3), buff('defUp', 3), heal(0.35)], 'Gain Taunt and Defense Up for 3 turns and repair 35%.', 'Angle the deflector shields!'),
      healer: U('Repair Drones', 'allAllies', [heal(0.4), buff('defUp', 2)], 'All allies repair 40% and gain Defense Up.', 'Deploying repair drones.'),
      support: U('Coordinated Strike', 'allAllies', [buff('offUp', 3), tm(40)], 'All allies gain Offense Up for 3 turns and 40% Turn Meter.', 'All wings report in.'),
    },
  };

  function ultimateFor(def) {
    return ULTIMATES[def.id] || ROLE_ULTIMATES[def.kind][def.role];
  }

  // Every ability a unit can use in battle; the ultimate is always last.
  function abilitiesFor(def) {
    return [...def.abilities, ultimateFor(def)];
  }

  const UNIT_MAP = Object.fromEntries(UNITS.map((u) => [u.id, u]));

  const MAX_LEVEL = 30;
  const MAX_STARS = 7;
  // Shards needed to go from star N to N+1 (index 0 = 1★ -> 2★).
  const STAR_COSTS = [10, 25, 50, 80, 120, 170];
  const DUPLICATE_SHARDS = { common: 5, rare: 8, epic: 12, legendary: 20 };

  function levelCost(level) {
    return 100 * level + 20 * level * level;
  }

  function unitStats(def, level, stars) {
    const base = ROLE_BASE[def.role];
    const rar = RARITIES[def.rarity].mult;
    const grow = (1 + 0.08 * (level - 1)) * (1 + 0.1 * (stars - 1));
    return {
      hp: Math.round(base.hp * rar * grow),
      atk: Math.round(base.atk * rar * grow),
      def: Math.round(base.def * rar * (1 + 0.04 * (level - 1)) * (1 + 0.05 * (stars - 1))),
      spd: (def.spd || base.spd) + Math.floor((stars - 1) * 2),
    };
  }

  function power(def, level, stars) {
    const s = unitStats(def, level, stars);
    return Math.round(s.hp * 0.3 + s.atk * 3 + s.def * 2 + s.spd * 1.5);
  }

  const SQUAD_SIZE = { character: 4, ship: 3 };

  const CAMPAIGNS = {
    character: {
      name: 'Ground Campaign',
      stages: [
        { name: 'Tatooine Outskirts', level: 1, enemies: ['tusken_raider', 'tusken_raider', 'battle_droid'] },
        { name: 'Mos Eisley Cantina', level: 2, enemies: ['stormtrooper', 'battle_droid', 'tusken_raider'] },
        { name: 'Jakku Wreckage', level: 3, enemies: ['stormtrooper', 'stormtrooper', 'battle_droid', 'tusken_raider'] },
        { name: 'Cloud City', level: 5, enemies: ['boba_fett', 'stormtrooper', 'stormtrooper'] },
        { name: 'Death Star Detention', level: 6, enemies: ['tarkin', 'stormtrooper', 'stormtrooper', 'battle_droid'] },
        { name: 'Geonosis Arena', level: 8, enemies: ['count_dooku', 'battle_droid', 'battle_droid', 'battle_droid'] },
        { name: 'Theed Hangar', level: 10, enemies: ['darth_maul', 'battle_droid', 'battle_droid', 'tarkin'] },
        { name: 'Starkiller Base', level: 12, enemies: ['kylo_ren', 'stormtrooper', 'stormtrooper', 'boba_fett'] },
        { name: 'Mustafar', level: 15, enemies: ['vader', 'boba_fett', 'tarkin', 'stormtrooper'] },
        { name: 'Throne Room', level: 18, enemies: ['palpatine', 'vader', 'count_dooku', 'darth_maul'] },
      ],
    },
    ship: {
      name: 'Fleet Campaign',
      stages: [
        { name: 'Tatooine Orbit', level: 1, enemies: ['tie_fighter', 'tie_fighter'] },
        { name: 'Hoth Evacuation', level: 2, enemies: ['tie_fighter', 'tie_fighter', 'tie_fighter'] },
        { name: 'Endor Skirmish', level: 3, enemies: ['tie_bomber', 'tie_fighter', 'tie_fighter'] },
        { name: 'Bespin Pursuit', level: 5, enemies: ['slave_one', 'tie_fighter'] },
        { name: 'Scarif Blockade', level: 7, enemies: ['lambda_shuttle', 'tie_bomber', 'tie_fighter'] },
        { name: 'Death Star Trench', level: 10, enemies: ['tie_advanced', 'tie_fighter', 'tie_fighter'] },
        { name: 'Battle of Endor', level: 14, enemies: ['tie_advanced', 'slave_one', 'lambda_shuttle'] },
      ],
    },
  };

  function stageRewards(kind, index) {
    const stage = CAMPAIGNS[kind].stages[index];
    return {
      credits: 120 + stage.level * 40,
      firstClearCrystals: 40 + index * 10,
    };
  }

  const PACKS = [
    {
      id: 'recruit', name: 'Recruit Pack', desc: '3 character cards', cost: { credits: 300 },
      kind: 'character', count: 3, odds: { common: 60, rare: 28, epic: 10, legendary: 2 },
    },
    {
      id: 'squadron', name: 'Squadron Pack', desc: '3 ship cards', cost: { credits: 300 },
      kind: 'ship', count: 3, odds: { common: 60, rare: 28, epic: 10, legendary: 2 },
    },
    {
      id: 'holocron', name: 'Holocron Pack', desc: '3 cards, rare or better', cost: { crystals: 80 },
      kind: 'any', count: 3, odds: { common: 0, rare: 55, epic: 35, legendary: 10 },
    },
  ];

  const STARTER = {
    credits: 600,
    crystals: 100,
    units: ['rebel_soldier', 'clone_trooper', 'ewok_warrior', 'battle_droid', 'a_wing', 'y_wing', 'tie_fighter'],
  };

  root.GameData = {
    RARITIES, ROLE_BASE, ROLE_ICONS, STATUS_INFO, UNITS, UNIT_MAP, MAX_LEVEL, MAX_STARS, STAR_COSTS,
    DUPLICATE_SHARDS, SQUAD_SIZE, CAMPAIGNS, PACKS, STARTER, levelCost, unitStats, power, stageRewards,
    ultimateFor, abilitiesFor,
  };
})(typeof window !== 'undefined' ? window : globalThis);
