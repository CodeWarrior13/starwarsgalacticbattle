// Static game data: units, abilities, campaign stages and shop packs.
// Loaded as a plain script so the game runs straight from index.html.

(function (root) {
  const RARITIES = {
    common: { label: 'Common', mult: 1.0, weight: 0 },
    rare: { label: 'Rare', mult: 1.12, weight: 1 },
    epic: { label: 'Epic', mult: 1.25, weight: 2 },
    legendary: { label: 'Legendary', mult: 1.4, weight: 3 },
    mythic: { label: 'Mythic', mult: 1.55, weight: 4 },
    // Secret cards never drop from crates: only the Monolith's trials grant them.
    secret: { label: 'Secret', mult: 1.65, weight: 5 },
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
  const revive = (pct) => ({ type: 'revive', pct });
  const cleanse = () => ({ type: 'cleanse' });
  const dispel = () => ({ type: 'dispel' });
  // Damage that hits harder against targets below a health threshold.
  const execute = (mult, below, bonus) => ({ type: 'damage', mult, hits: 1, execute: { below, bonus } });

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
      id: 'z95', name: 'Z-95 Headhunter', kind: 'ship', faction: 'light', rarity: 'common', role: 'attacker', shape: 'z95', spd: 150,
      abilities: [
        { name: 'Twin Blasters', cd: 0, target: 'enemy', effects: [dmg(1.0)], desc: 'Deal damage to one enemy.' },
        { name: 'Concussion Missile', cd: 3, target: 'enemy', effects: [dmg(1.7), debuff('stun', 1, 0.2)], desc: 'Deal heavy damage with a 20% chance to Stun.' },
      ],
    },
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

    // ---------- Wave 2 ----------
    {
      id: 'jawa', name: 'Jawa Scavenger', kind: 'character', faction: 'dark', rarity: 'common', role: 'support', accent: '#8a5a2b', spd: 150,
      abilities: [
        { name: 'Ion Blaster', cd: 0, target: 'enemy', effects: [dmg(0.85), debuff('stun', 1, 0.15)], desc: 'Deal damage with a 15% chance to Stun.' },
        { name: 'Utinni!', cd: 3, target: 'allAllies', effects: [tm(25), buff('offUp', 1)], desc: 'All allies gain 25% Turn Meter and Offense Up for 1 turn.' },
      ],
    },
    {
      id: 'grogu', name: 'Grogu', kind: 'character', faction: 'light', rarity: 'rare', role: 'healer', accent: '#46c46a', spd: 135,
      abilities: [
        { name: 'Tiny Push', cd: 0, target: 'enemy', effects: [dmg(0.8), debuff('offDown', 1, 0.4)], desc: 'Deal damage with a 40% chance of Offense Down.' },
        { name: 'Force Healing', cd: 3, target: 'allAllies', effects: [heal(0.18), buff('defUp', 1)], desc: 'Heal all allies 18% and grant Defense Up.' },
      ],
    },
    {
      id: 'death_trooper', name: 'Death Trooper', kind: 'character', faction: 'dark', rarity: 'rare', role: 'tank',
      abilities: [
        { name: 'E-11D Burst', cd: 0, target: 'enemy', effects: [dmg(1.0), debuff('defDown', 2, 0.35)], desc: 'Deal damage with a 35% chance of Defense Down.' },
        { name: 'Shock Squad', cd: 3, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2), buff('offUp', 2)], desc: 'Gain Taunt, Defense Up and Offense Up.' },
      ],
    },
    {
      id: 'ahsoka', name: 'Ahsoka Tano', kind: 'character', faction: 'light', rarity: 'epic', role: 'attacker', accent: '#f0f0f0', spd: 158,
      abilities: [
        { name: 'Twin Shoto Strike', cd: 0, target: 'enemy', effects: [dmg(0.65, 2)], desc: 'Strike one enemy twice.' },
        { name: 'Fulcrum Flurry', cd: 3, target: 'allEnemies', effects: [dmg(0.85), { ...tm(20), on: 'self' }], desc: 'Damage all enemies and gain 20% Turn Meter.' },
      ],
    },
    {
      id: 'din_djarin', name: 'The Mandalorian', kind: 'character', faction: 'light', rarity: 'epic', role: 'attacker', accent: '#b8c2cc',
      abilities: [
        { name: 'Amban Rifle', cd: 0, target: 'enemy', effects: [dmg(1.25)], desc: 'Deal damage to one enemy.' },
        { name: 'Whistling Birds', cd: 4, target: 'allEnemies', effects: [dmg(0.9), debuff('defDown', 2, 0.5)], desc: 'Damage all enemies with a 50% chance of Defense Down.' },
      ],
    },
    {
      id: 'grievous', name: 'General Grievous', kind: 'character', faction: 'dark', rarity: 'epic', role: 'attacker', accent: '#3d7be8', spd: 150,
      abilities: [
        { name: 'Four-Blade Frenzy', cd: 0, target: 'enemy', effects: [dmg(0.4, 4)], desc: 'Strike one enemy four times.' },
        { name: 'Jedi Hunter', cd: 3, target: 'enemy', effects: [dmg(2.3), debuff('burn', 2, 0.5)], desc: 'Deal heavy damage with a 50% chance to Burn.' },
      ],
    },
    {
      id: 'mace_windu', name: 'Mace Windu', kind: 'character', faction: 'light', rarity: 'legendary', role: 'tank', accent: '#8f5de8',
      abilities: [
        { name: 'Vaapad Strike', cd: 0, target: 'enemy', effects: [dmg(1.15), debuff('offDown', 2, 0.4)], desc: 'Deal damage with a 40% chance of Offense Down.' },
        { name: 'Shatterpoint', cd: 3, target: 'enemy', effects: [dmg(2.0), debuff('defDown', 2), debuff('stun', 1, 0.5)], desc: 'Deal heavy damage, inflict Defense Down with a 50% chance to Stun.' },
        { name: 'Jedi Master\'s Guard', cd: 4, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2), { ...heal(0.15), on: 'allies' }], desc: 'Gain Taunt and Defense Up; heal all allies 15%.' },
      ],
    },
    {
      id: 'thrawn', name: 'Grand Admiral Thrawn', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'support', accent: '#3d7be8', spd: 155,
      abilities: [
        { name: 'Calculated Shot', cd: 0, target: 'enemy', effects: [dmg(1.1), debuff('offDown', 2, 0.5)], desc: 'Deal damage with a 50% chance of Offense Down.' },
        { name: 'Know Your Enemy', cd: 3, target: 'allEnemies', effects: [dmg(0.8), debuff('defDown', 2), debuff('stun', 1, 0.3)], desc: 'Damage all enemies, inflict Defense Down and a 30% Stun chance.' },
        { name: 'Art of War', cd: 4, target: 'allAllies', effects: [buff('offUp', 2), buff('defUp', 2), tm(25)], desc: 'All allies gain Offense Up, Defense Up and 25% Turn Meter.' },
      ],
    },
    {
      id: 'razor_crest', name: 'Razor Crest', kind: 'ship', faction: 'light', rarity: 'rare', role: 'tank', shape: 'razorcrest',
      abilities: [
        { name: 'Blaster Cannons', cd: 0, target: 'enemy', effects: [dmg(0.95)], desc: 'Deal damage to one enemy.' },
        { name: 'Carbonite Hold', cd: 3, target: 'enemy', effects: [dmg(1.2), debuff('stun', 1), { ...buff('taunt', 2), on: 'self' }], desc: 'Damage and Stun one enemy, then gain Taunt.' },
      ],
    },
    {
      id: 'tie_interceptor', name: 'TIE Interceptor', kind: 'ship', faction: 'dark', rarity: 'rare', role: 'attacker', shape: 'tieint', spd: 172,
      abilities: [
        { name: 'Quad Lasers', cd: 0, target: 'enemy', effects: [dmg(0.55, 2)], desc: 'Hit one enemy twice.' },
        { name: 'Attack Run', cd: 3, target: 'enemy', effects: [dmg(1.9), debuff('defDown', 2, 0.5)], desc: 'Deal heavy damage with a 50% chance of Defense Down.' },
      ],
    },

    // ---------- Wave 3: Droids ----------
    {
      id: 'b2_droid', name: 'B2 Super Battle Droid', kind: 'character', faction: 'dark', rarity: 'common', role: 'tank', accent: '#6a7a90', spd: 100,
      abilities: [
        { name: 'Wrist Blaster', cd: 0, target: 'enemy', effects: [dmg(0.95)], desc: 'Deal damage to one enemy.' },
        { name: 'Heavy Plating', cd: 3, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2)], desc: 'Gain Taunt and Defense Up for 2 turns.' },
      ],
    },
    {
      id: 'c3po', name: 'C-3PO', kind: 'character', faction: 'light', rarity: 'rare', role: 'support', accent: '#e0b040', spd: 120,
      abilities: [
        { name: 'Pardon Me', cd: 0, target: 'enemy', effects: [dmg(0.6), debuff('offDown', 2, 0.5)], desc: 'Deal light damage with a 50% chance of Offense Down.' },
        { name: 'Six Million Forms', cd: 4, target: 'allAllies', effects: [tm(30), buff('defUp', 2)], desc: 'All allies gain 30% Turn Meter and Defense Up.' },
      ],
    },
    {
      id: 'chopper', name: 'Chopper', kind: 'character', faction: 'light', rarity: 'rare', role: 'healer', accent: '#e07b1a', spd: 140,
      abilities: [
        { name: 'Electro-Prod', cd: 0, target: 'enemy', effects: [dmg(0.9), debuff('stun', 1, 0.2)], desc: 'Deal damage with a 20% chance to Stun.' },
        { name: 'Grumpy Repairs', cd: 3, target: 'allAllies', effects: [heal(0.15), tm(10)], desc: 'Heal all allies 15% and grant 10% Turn Meter.' },
      ],
    },
    {
      id: 'droideka', name: 'Droideka', kind: 'character', faction: 'dark', rarity: 'rare', role: 'tank', accent: '#8a6a3a', spd: 105,
      abilities: [
        { name: 'Twin Repeaters', cd: 0, target: 'enemy', effects: [dmg(0.5, 2)], desc: 'Hit one enemy twice.' },
        { name: 'Deflector Shield', cd: 3, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2), heal(0.1)], desc: 'Gain Taunt and Defense Up, and heal 10%.' },
      ],
    },
    {
      id: 'magnaguard', name: 'IG-100 MagnaGuard', kind: 'character', faction: 'dark', rarity: 'rare', role: 'attacker', accent: '#a86bff', spd: 145,
      abilities: [
        { name: 'Electrostaff Strike', cd: 0, target: 'enemy', effects: [dmg(1.1), debuff('stun', 1, 0.2)], desc: 'Deal damage with a 20% chance to Stun.' },
        { name: 'Staff Whirl', cd: 3, target: 'allEnemies', effects: [dmg(0.7), debuff('defDown', 2, 0.4)], desc: 'Damage all enemies with a 40% chance of Defense Down.' },
      ],
    },
    {
      id: 'bb8', name: 'BB-8', kind: 'character', faction: 'light', rarity: 'epic', role: 'support', accent: '#ff8a2a', spd: 168,
      abilities: [
        { name: 'Rolling Zap', cd: 0, target: 'enemy', effects: [dmg(1.0), debuff('stun', 1, 0.2)], desc: 'Deal damage with a 20% chance to Stun.' },
        { name: 'Thumbs Up', cd: 3, target: 'allAllies', effects: [buff('offUp', 2), tm(20)], desc: 'All allies gain Offense Up and 20% Turn Meter.' },
      ],
    },
    {
      id: 'k2so', name: 'K-2SO', kind: 'character', faction: 'light', rarity: 'epic', role: 'tank', accent: '#3a3d44',
      abilities: [
        { name: 'Reprogrammed Punch', cd: 0, target: 'enemy', effects: [dmg(1.1), debuff('stun', 1, 0.25)], desc: 'Deal damage with a 25% chance to Stun.' },
        { name: 'Blunt Honesty', cd: 3, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2), buff('offUp', 2)], desc: 'Gain Taunt, Defense Up and Offense Up.' },
      ],
    },
    {
      id: 'ig88', name: 'IG-88', kind: 'character', faction: 'dark', rarity: 'epic', role: 'attacker', accent: '#c43b2e',
      abilities: [
        { name: 'Heavy Rifle', cd: 0, target: 'enemy', effects: [dmg(1.25)], desc: 'Deal damage to one enemy.' },
        { name: 'Assassin Protocol', cd: 3, target: 'enemy', effects: [dmg(2.2), debuff('defDown', 2)], desc: 'Deal heavy damage and inflict Defense Down.' },
      ],
    },
    {
      id: 'ig11', name: 'IG-11', kind: 'character', faction: 'light', rarity: 'epic', role: 'attacker', accent: '#3d8bff', spd: 140,
      abilities: [
        { name: 'Twin Blasters', cd: 0, target: 'enemy', effects: [dmg(0.62, 2)], desc: 'Hit one enemy twice.' },
        { name: 'Tactical Scan', cd: 3, target: 'enemy', effects: [dmg(1.8), debuff('defDown', 2)], desc: 'Deal heavy damage and inflict Defense Down.' },
      ],
    },
    {
      id: 'vulture_droid', name: 'Vulture Droid', kind: 'ship', faction: 'dark', rarity: 'common', role: 'attacker', shape: 'vulture', spd: 165,
      abilities: [
        { name: 'Blaster Cannons', cd: 0, target: 'enemy', effects: [dmg(1.0)], desc: 'Deal damage to one enemy.' },
        { name: 'Energy Torpedo', cd: 3, target: 'enemy', effects: [dmg(1.6)], desc: 'Deal heavy damage to one enemy.' },
      ],
    },

    // ---------- Wave 4: Medics & the Bad Batch ----------
    {
      id: 'rebel_medic', name: 'Rebel Field Medic', kind: 'character', faction: 'light', rarity: 'common', role: 'healer', accent: '#52e08a', spd: 128,
      abilities: [
        { name: 'Sidearm', cd: 0, target: 'enemy', effects: [dmg(0.8)], desc: 'Deal damage to one enemy.' },
        { name: 'Bacta Spray', cd: 3, target: 'allAllies', effects: [heal(0.16)], desc: 'Heal all allies for 16% of their max HP.' },
      ],
    },
    {
      id: 'two_onebee', name: '2-1B Surgical Droid', kind: 'character', faction: 'light', rarity: 'rare', role: 'healer', accent: '#8fd3ff', spd: 118,
      abilities: [
        { name: 'Scalpel Laser', cd: 0, target: 'enemy', effects: [dmg(0.75), debuff('defDown', 2, 0.3)], desc: 'Deal damage with a 30% chance of Defense Down.' },
        { name: 'Bacta Tank', cd: 3, target: 'allAllies', effects: [heal(0.2), buff('defUp', 1)], desc: 'Heal all allies 20% and grant Defense Up.' },
      ],
    },
    {
      id: 'nightsister_acolyte', name: 'Nightsister Acolyte', kind: 'character', faction: 'dark', rarity: 'rare', role: 'healer', accent: '#4ade80', spd: 138,
      abilities: [
        { name: 'Ichor Bolt', cd: 0, target: 'enemy', effects: [dmg(0.9), debuff('burn', 2, 0.3)], desc: 'Deal damage with a 30% chance to Burn.' },
        { name: 'Dathomir Rite', cd: 3, target: 'allAllies', effects: [heal(0.16), buff('offUp', 1)], desc: 'Heal all allies 16% and grant Offense Up.' },
      ],
    },
    {
      id: 'barriss', name: 'Barriss Offee', kind: 'character', faction: 'light', rarity: 'epic', role: 'healer', accent: '#46c46a', spd: 135,
      abilities: [
        { name: 'Lightsaber Parry', cd: 0, target: 'enemy', effects: [dmg(1.0), { ...heal(0.05), on: 'self' }], desc: 'Deal damage and heal 5%.' },
        { name: 'Force Healing', cd: 3, target: 'allAllies', effects: [heal(0.22), buff('defUp', 2)], desc: 'Heal all allies 22% and grant Defense Up.' },
      ],
    },
    {
      id: 'talzin', name: 'Mother Talzin', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'healer', accent: '#4ade80', spd: 140,
      abilities: [
        { name: 'Magick Bolt', cd: 0, target: 'enemy', effects: [dmg(1.1), debuff('offDown', 2, 0.4)], desc: 'Deal damage with a 40% chance of Offense Down.' },
        { name: 'Plague', cd: 3, target: 'allEnemies', effects: [dmg(0.7), debuff('burn', 2, 0.6)], desc: 'Damage all enemies with a 60% chance to Burn.' },
        { name: 'Ichor Resurgence', cd: 4, target: 'allAllies', effects: [heal(0.25), buff('offUp', 2)], desc: 'Heal all allies 25% and grant Offense Up.' },
      ],
    },
    {
      id: 'hunter', name: 'Hunter', kind: 'character', faction: 'light', rarity: 'epic', role: 'attacker', accent: '#9fe07a', spd: 150,
      abilities: [
        { name: 'Vibro-Knife', cd: 0, target: 'enemy', effects: [dmg(1.15), debuff('defDown', 2, 0.3)], desc: 'Deal damage with a 30% chance of Defense Down.' },
        { name: 'Tracker\'s Instinct', cd: 3, target: 'allAllies', effects: [buff('offUp', 2), tm(20)], desc: 'All allies gain Offense Up and 20% Turn Meter.' },
      ],
    },
    {
      id: 'wrecker', name: 'Wrecker', kind: 'character', faction: 'light', rarity: 'epic', role: 'tank', accent: '#d9773a', spd: 108,
      abilities: [
        { name: 'Brute Force', cd: 0, target: 'enemy', effects: [dmg(1.1), debuff('stun', 1, 0.25)], desc: 'Deal damage with a 25% chance to Stun.' },
        { name: 'Wrecker Smash', cd: 3, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2), buff('offUp', 2)], desc: 'Gain Taunt, Defense Up and Offense Up.' },
      ],
    },
    {
      id: 'tech', name: 'Tech', kind: 'character', faction: 'light', rarity: 'epic', role: 'support', accent: '#e8c14a', spd: 140,
      abilities: [
        { name: 'Precision Pistols', cd: 0, target: 'enemy', effects: [dmg(0.55, 2)], desc: 'Hit one enemy twice.' },
        { name: 'Tactical Analysis', cd: 3, target: 'allEnemies', effects: [debuff('defDown', 2), debuff('offDown', 2, 0.5)], desc: 'All enemies suffer Defense Down, with a 50% chance of Offense Down.' },
      ],
    },
    {
      id: 'crosshair', name: 'Crosshair', kind: 'character', faction: 'light', rarity: 'epic', role: 'attacker', accent: '#e8e8e8', spd: 132,
      abilities: [
        { name: 'Long Shot', cd: 0, target: 'enemy', effects: [dmg(1.3)], desc: 'Deal heavy damage to one enemy.' },
        { name: 'Headshot', cd: 3, target: 'enemy', effects: [dmg(2.4), debuff('defDown', 2)], desc: 'Deal massive damage and inflict Defense Down.' },
      ],
    },
    {
      id: 'echo', name: 'Echo', kind: 'character', faction: 'light', rarity: 'epic', role: 'support', accent: '#8fd3ff', spd: 142,
      abilities: [
        { name: 'Scomp Link Shot', cd: 0, target: 'enemy', effects: [dmg(1.0), { ...tm(10), on: 'self' }], desc: 'Deal damage and gain 10% Turn Meter.' },
        { name: 'System Override', cd: 3, target: 'enemy', effects: [dmg(1.2), debuff('stun', 1, 0.6)], desc: 'Deal damage with a 60% chance to Stun.' },
      ],
    },

    // ---------- Wave 5: The Inquisitorius ----------
    {
      id: 'grand_inquisitor', name: 'Grand Inquisitor', kind: 'character', faction: 'dark', rarity: 'epic', role: 'support', accent: '#ff2a2a', spd: 150,
      abilities: [
        { name: 'Spinning Blade', cd: 0, target: 'enemy', effects: [dmg(1.1), debuff('defDown', 2, 0.35)], desc: 'Deal damage with a 35% chance of Defense Down.' },
        { name: 'Hunt the Jedi', cd: 3, target: 'allAllies', effects: [buff('offUp', 2), tm(25)], desc: 'All allies gain Offense Up and 25% Turn Meter.' },
      ],
    },
    {
      id: 'second_sister', name: 'Second Sister', kind: 'character', faction: 'dark', rarity: 'epic', role: 'attacker', accent: '#ff2a2a', spd: 152,
      abilities: [
        { name: 'Saber Flurry', cd: 0, target: 'enemy', effects: [dmg(0.6, 2)], desc: 'Strike one enemy twice.' },
        { name: 'Relentless Pursuit', cd: 3, target: 'enemy', effects: [dmg(2.2), { ...tm(25), on: 'self' }], desc: 'Deal heavy damage and gain 25% Turn Meter.' },
      ],
    },
    {
      id: 'fifth_brother', name: 'Fifth Brother', kind: 'character', faction: 'dark', rarity: 'epic', role: 'tank', accent: '#ff2a2a', spd: 112,
      abilities: [
        { name: 'Crushing Blow', cd: 0, target: 'enemy', effects: [dmg(1.1), debuff('stun', 1, 0.25)], desc: 'Deal damage with a 25% chance to Stun.' },
        { name: 'Brute Presence', cd: 3, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2), heal(0.12)], desc: 'Gain Taunt and Defense Up, and heal 12%.' },
      ],
    },
    {
      id: 'seventh_sister', name: 'Seventh Sister', kind: 'character', faction: 'dark', rarity: 'epic', role: 'support', accent: '#ff2a2a', spd: 146,
      abilities: [
        { name: 'Probe Droid Strike', cd: 0, target: 'enemy', effects: [dmg(1.0), debuff('offDown', 2, 0.4)], desc: 'Deal damage with a 40% chance of Offense Down.' },
        { name: 'Seeker Swarm', cd: 3, target: 'allEnemies', effects: [dmg(0.7), debuff('defDown', 2, 0.5)], desc: 'Probe droids hit all enemies with a 50% chance of Defense Down.' },
      ],
    },
    {
      id: 'eighth_brother', name: 'Eighth Brother', kind: 'character', faction: 'dark', rarity: 'epic', role: 'attacker', accent: '#ff2a2a', spd: 148,
      abilities: [
        { name: 'Rotor Strike', cd: 0, target: 'enemy', effects: [dmg(1.2)], desc: 'Deal damage to one enemy.' },
        { name: 'Blade Copter', cd: 3, target: 'allEnemies', effects: [dmg(0.8), debuff('burn', 2, 0.4)], desc: 'Spin through all enemies with a 40% chance to Burn.' },
      ],
    },

    // ---------- Wave 6: heroes and hunters of every era ----------
    {
      id: 'anakin', name: 'Anakin Skywalker', kind: 'character', faction: 'light', rarity: 'legendary', role: 'attacker', accent: '#4aa8ff', spd: 156,
      abilities: [
        { name: 'Aggressive Strike', cd: 0, target: 'enemy', effects: [dmg(1.25), debuff('burn', 2, 0.25)], desc: 'Deal damage with a 25% chance to Burn.' },
        { name: 'Djem So Fury', cd: 3, target: 'enemy', effects: [dmg(0.85, 3)], desc: 'Hit one enemy three times.' },
        { name: 'Chosen One', cd: 4, target: 'allEnemies', effects: [dmg(1.0), { ...buff('offUp', 2), on: 'self' }], desc: 'Damage all enemies and gain Offense Up.' },
      ],
    },
    {
      id: 'qui_gon', name: 'Qui-Gon Jinn', kind: 'character', faction: 'light', rarity: 'epic', role: 'tank', accent: '#46e070', spd: 128,
      abilities: [
        { name: 'Patient Strike', cd: 0, target: 'enemy', effects: [dmg(1.0), { ...heal(0.06), on: 'self' }], desc: 'Deal damage and heal 6%.' },
        { name: 'Living Force', cd: 3, target: 'allAllies', effects: [heal(0.15), buff('defUp', 2)], desc: 'All allies heal 15% and gain Defense Up.' },
        { name: 'Stand Firm', cd: 4, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2)], desc: 'Gain Taunt and Defense Up.' },
      ],
    },
    {
      id: 'padme', name: 'Padmé Amidala', kind: 'character', faction: 'light', rarity: 'rare', role: 'support', accent: '#ff8ad0', spd: 146,
      abilities: [
        { name: 'Senator\'s Aim', cd: 0, target: 'enemy', effects: [dmg(1.0), debuff('offDown', 2, 0.3)], desc: 'Deal damage with a 30% chance of Offense Down.' },
        { name: 'Diplomatic Immunity', cd: 3, target: 'allAllies', effects: [buff('defUp', 2), tm(20)], desc: 'All allies gain Defense Up and 20% Turn Meter.' },
      ],
    },
    {
      id: 'lando', name: 'Lando Calrissian', kind: 'character', faction: 'light', rarity: 'rare', role: 'support', accent: '#5ab4ff', spd: 150,
      abilities: [
        { name: 'Smooth Shot', cd: 0, target: 'enemy', effects: [dmg(1.05)], desc: 'Deal damage to one enemy.' },
        { name: 'Sabacc Gambit', cd: 3, target: 'allEnemies', effects: [dmg(0.7), debuff('stun', 1, 0.3)], desc: 'Damage all enemies with a 30% chance to Stun.' },
      ],
    },
    {
      id: 'jango_fett', name: 'Jango Fett', kind: 'character', faction: 'dark', rarity: 'epic', role: 'attacker', accent: '#7ab8d8', spd: 150,
      abilities: [
        { name: 'Twin Westars', cd: 0, target: 'enemy', effects: [dmg(0.6, 2)], desc: 'Shoot one enemy twice.' },
        { name: 'Jetpack Rocket', cd: 3, target: 'enemy', effects: [dmg(2.0), debuff('burn', 2)], desc: 'Deal heavy damage and Burn.' },
      ],
    },
    {
      id: 'asajj_ventress', name: 'Asajj Ventress', kind: 'character', faction: 'dark', rarity: 'epic', role: 'attacker', accent: '#ff2a2a', spd: 154,
      abilities: [
        { name: 'Curved Blades', cd: 0, target: 'enemy', effects: [dmg(0.65, 2)], desc: 'Strike one enemy twice.' },
        { name: 'Nightsister Ambush', cd: 3, target: 'allEnemies', effects: [dmg(0.8), { ...heal(0.1), on: 'self' }], desc: 'Damage all enemies and heal 10%.' },
      ],
    },
    {
      id: 'cad_bane', name: 'Cad Bane', kind: 'character', faction: 'dark', rarity: 'epic', role: 'attacker', accent: '#ff7a3a', spd: 152,
      abilities: [
        { name: 'Quickdraw', cd: 0, target: 'enemy', effects: [dmg(1.2)], desc: 'Deal damage to one enemy.' },
        { name: 'Dead or Alive', cd: 3, target: 'enemy', effects: [dmg(2.2), debuff('defDown', 2)], desc: 'Deal heavy damage and inflict Defense Down.' },
      ],
    },
    {
      id: 'moff_gideon', name: 'Moff Gideon', kind: 'character', faction: 'dark', rarity: 'epic', role: 'support', accent: '#e8eef8', spd: 144,
      abilities: [
        { name: 'Darksaber Slash', cd: 0, target: 'enemy', effects: [dmg(1.1), debuff('defDown', 2, 0.3)], desc: 'Deal damage with a 30% chance of Defense Down.' },
        { name: 'Dark Trooper Protocol', cd: 3, target: 'allAllies', effects: [buff('offUp', 2), buff('defUp', 2)], desc: 'All allies gain Offense Up and Defense Up.' },
      ],
    },
    {
      id: 'n1_starfighter', name: 'Naboo N-1 Starfighter', kind: 'ship', faction: 'light', rarity: 'rare', role: 'attacker', shape: 'n1', spd: 158,
      abilities: [
        { name: 'Twin Blasters', cd: 0, target: 'enemy', effects: [dmg(0.6, 2)], desc: 'Hit one enemy twice.' },
        { name: 'Proton Torpedo', cd: 3, target: 'enemy', effects: [dmg(2.0)], desc: 'Deal heavy damage.' },
      ],
    },
    {
      id: 'sith_infiltrator', name: 'Sith Infiltrator', kind: 'ship', faction: 'dark', rarity: 'epic', role: 'attacker', shape: 'scimitar', spd: 152,
      abilities: [
        { name: 'Laser Cannons', cd: 0, target: 'enemy', effects: [dmg(1.15)], desc: 'Deal damage to one enemy.' },
        { name: 'Cloaked Strike', cd: 3, target: 'allEnemies', effects: [dmg(0.85), debuff('offDown', 2, 0.4)], desc: 'Damage all enemies with a 40% chance of Offense Down.' },
      ],
    },

    // ---------- Wave 7: new starfighter classes ----------
    {
      id: 'arc_170', name: 'ARC-170 Starfighter', kind: 'ship', faction: 'light', rarity: 'epic', role: 'attacker', shape: 'arc170', spd: 146,
      abilities: [
        { name: 'Twin Laser Cannons', cd: 0, target: 'enemy', effects: [dmg(1.1)], desc: 'Deal damage to one enemy.' },
        { name: 'Tail Gunner', cd: 3, target: 'allEnemies', effects: [dmg(0.7), dispel()], desc: 'Damage all enemies and strip their buffs.' },
      ],
    },
    {
      id: 'delta7', name: 'Jedi Starfighter', kind: 'ship', faction: 'light', rarity: 'epic', role: 'support', shape: 'delta7', spd: 160,
      abilities: [
        { name: 'Laser Burst', cd: 0, target: 'enemy', effects: [dmg(1.0)], desc: 'Deal damage to one enemy.' },
        { name: 'Astromech Repair', cd: 3, target: 'allAllies', effects: [heal(0.15), cleanse()], desc: 'All allies heal 15% and lose their debuffs.' },
      ],
    },
    {
      id: 'tie_defender', name: 'TIE Defender', kind: 'ship', faction: 'dark', rarity: 'legendary', role: 'attacker', shape: 'tiedefender', spd: 158,
      abilities: [
        { name: 'Ion Cannons', cd: 0, target: 'enemy', effects: [dmg(1.15), debuff('offDown', 2, 0.3)], desc: 'Deal damage with a 30% chance of Offense Down.' },
        { name: 'Tractor Lock', cd: 3, target: 'enemy', effects: [dmg(1.4), debuff('stun', 1, 0.5)], desc: 'Deal damage with a 50% chance to Stun.' },
      ],
    },
    {
      id: 'tie_silencer', name: 'TIE Silencer', kind: 'ship', faction: 'dark', rarity: 'epic', role: 'attacker', shape: 'tiesilencer', spd: 154,
      abilities: [
        { name: 'Heavy Laser', cd: 0, target: 'enemy', effects: [dmg(1.25)], desc: 'Deal damage to one enemy.' },
        { name: 'Hunt the Wounded', cd: 3, target: 'enemy', effects: [execute(1.3, 0.4, 2)], desc: 'Deal damage; double damage against targets under 40% HP.' },
      ],
    },

    // ---------- Wave 8: heroes of the Clone Wars and beyond ----------
    {
      id: 'cal_kestis', name: 'Cal Kestis', kind: 'character', faction: 'light', rarity: 'epic', role: 'attacker', accent: '#ff8a2a', spd: 150,
      abilities: [
        { name: 'Double-Bladed Flurry', cd: 0, target: 'enemy', effects: [dmg(0.6, 2)], desc: 'Strike one enemy twice.' },
        { name: 'Force Slow', cd: 3, target: 'enemy', effects: [dmg(1.2), debuff('offDown', 2), tm(-30)], desc: 'Deal damage, inflict Offense Down and drain 30% Turn Meter.' },
      ],
    },
    {
      id: 'bo_katan', name: 'Bo-Katan Kryze', kind: 'character', faction: 'light', rarity: 'legendary', role: 'attacker', accent: '#5ab4ff', spd: 152,
      abilities: [
        { name: 'Wrist Blasters', cd: 0, target: 'enemy', effects: [dmg(0.65, 2)], desc: 'Hit one enemy twice.' },
        { name: 'Jetpack Assault', cd: 3, target: 'allEnemies', effects: [dmg(0.85), debuff('defDown', 2, 0.6)], desc: 'Damage all enemies with a 60% chance of Defense Down.' },
      ],
    },
    {
      id: 'sabine', name: 'Sabine Wren', kind: 'character', faction: 'light', rarity: 'rare', role: 'attacker', accent: '#ff5ac8', spd: 148,
      abilities: [
        { name: 'Twin Blasters', cd: 0, target: 'enemy', effects: [dmg(0.55, 2)], desc: 'Hit one enemy twice.' },
        { name: 'Paint Bomb', cd: 3, target: 'allEnemies', effects: [dmg(0.7), debuff('burn', 2, 0.5)], desc: 'Damage all enemies with a 50% chance to Burn.' },
      ],
    },
    {
      id: 'captain_rex', name: 'Captain Rex', kind: 'character', faction: 'light', rarity: 'secret', role: 'tank', exclusive: true, accent: '#3d6fd6', spd: 128,
      abilities: [
        { name: 'Dual DC-17s', cd: 0, target: 'enemy', effects: [dmg(0.55, 2)], desc: 'Hit one enemy twice.' },
        { name: 'Hold the Line', cd: 3, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2), { ...buff('offUp', 1), on: 'allies' }], desc: 'Gain Taunt and Defense Up; all allies gain Offense Up.' },
      ],
    },
    {
      id: 'hondo', name: 'Hondo Ohnaka', kind: 'character', faction: 'dark', rarity: 'rare', role: 'support', accent: '#ffd23f', spd: 140,
      abilities: [
        { name: 'Pirate\'s Pistol', cd: 0, target: 'enemy', effects: [dmg(1.0)], desc: 'Deal damage to one enemy.' },
        { name: 'A Better Deal', cd: 3, target: 'allAllies', effects: [buff('offUp', 2), tm(20)], desc: 'All allies gain Offense Up and 20% Turn Meter.' },
      ],
    },
    {
      id: 'savage_opress', name: 'Savage Opress', kind: 'character', faction: 'dark', rarity: 'epic', role: 'tank', accent: '#c8a040', spd: 124,
      abilities: [
        { name: 'Brute Strike', cd: 0, target: 'enemy', effects: [dmg(1.1), debuff('stun', 1, 0.25)], desc: 'Deal damage with a 25% chance to Stun.' },
        { name: 'Nightbrother Rage', cd: 3, target: 'self', effects: [buff('taunt', 2), buff('offUp', 2), heal(0.12)], desc: 'Gain Taunt and Offense Up, heal 12%.' },
      ],
    },
    {
      id: 'u_wing', name: 'U-Wing', kind: 'ship', faction: 'light', rarity: 'rare', role: 'support', shape: 'uwing', spd: 140,
      abilities: [
        { name: 'Ion Cannons', cd: 0, target: 'enemy', effects: [dmg(1.0), debuff('offDown', 2, 0.3)], desc: 'Deal damage with a 30% chance of Offense Down.' },
        { name: 'Drop Commandos', cd: 3, target: 'allAllies', effects: [buff('offUp', 2), tm(15)], desc: 'All allies gain Offense Up and 15% Turn Meter.' },
      ],
    },
    {
      id: 'upsilon_shuttle', name: 'Upsilon Command Shuttle', kind: 'ship', faction: 'dark', rarity: 'epic', role: 'tank', shape: 'upsilon', spd: 118,
      abilities: [
        { name: 'Laser Cannons', cd: 0, target: 'enemy', effects: [dmg(0.9)], desc: 'Deal damage to one enemy.' },
        { name: 'Wing Shields', cd: 3, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2)], desc: 'Gain Taunt and Defense Up.' },
      ],
    },
    {
      id: 'hounds_tooth', name: 'Hound\'s Tooth', kind: 'ship', faction: 'dark', rarity: 'epic', role: 'attacker', shape: 'houndstooth', spd: 144,
      abilities: [
        { name: 'Concussion Missile', cd: 0, target: 'enemy', effects: [dmg(1.15), debuff('burn', 2, 0.3)], desc: 'Deal damage with a 30% chance to Burn.' },
        { name: 'Trandoshan Hunt', cd: 3, target: 'enemy', effects: [execute(1.3, 0.4, 2)], desc: 'Deal damage; double damage against targets under 40% HP.' },
      ],
    },

    // ---------- Secret: earned only in the hidden zone ----------
    {
      id: 'the_daughter', name: 'The Daughter', kind: 'character', faction: 'light', rarity: 'secret', role: 'healer', exclusive: true, accent: '#9fe0ff', spd: 150,
      abilities: [
        { name: 'Radiant Touch', cd: 0, target: 'enemy', effects: [dmg(1.0), { ...heal(0.08), on: 'allies' }], desc: 'Deal damage; all allies heal 8%.' },
        { name: 'Light of Mortis', cd: 3, target: 'allAllies', effects: [heal(0.3), cleanse()], desc: 'All allies heal 30% and lose their debuffs.' },
      ],
    },
    {
      id: 'temple_guardian', name: 'Temple Guardian Prime', kind: 'character', faction: 'light', rarity: 'secret', role: 'tank', exclusive: true, accent: '#ffd23f', spd: 126,
      abilities: [
        { name: 'Pike Sweep', cd: 0, target: 'enemy', effects: [dmg(1.05), { ...buff('defUp', 1), on: 'self' }], desc: 'Deal damage and gain Defense Up.' },
        { name: 'Sworn Vigil', cd: 3, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2), heal(0.15)], desc: 'Gain Taunt and Defense Up, heal 15%.' },
      ],
    },
    {
      id: 'the_son', name: 'The Son', kind: 'character', faction: 'dark', rarity: 'secret', role: 'attacker', exclusive: true, accent: '#ff3a3a', spd: 156,
      abilities: [
        { name: 'Shadow Talon', cd: 0, target: 'enemy', effects: [dmg(1.2), dispel()], desc: 'Deal damage and strip the target\'s buffs.' },
        { name: 'Corruption', cd: 3, target: 'allEnemies', effects: [dmg(0.85), debuff('offDown', 2), debuff('burn', 2, 0.5)], desc: 'Damage all enemies, inflict Offense Down and a 50% chance to Burn.' },
      ],
    },
    {
      id: 'darth_bane', name: 'Darth Bane', kind: 'character', faction: 'dark', rarity: 'secret', role: 'attacker', exclusive: true, accent: '#c8323a', spd: 140,
      abilities: [
        { name: 'Orbalisk Strike', cd: 0, target: 'enemy', effects: [dmg(1.3), { ...heal(0.05), on: 'self' }], desc: 'Deal damage and heal 5%.' },
        { name: 'Thought Bomb', cd: 4, target: 'allEnemies', effects: [execute(1.0, 0.35, 2.2)], desc: 'Damage all enemies; heavy bonus damage to targets under 35% HP.' },
      ],
    },
    {
      id: 'ebon_hawk', name: 'The Ebon Hawk', kind: 'ship', faction: 'light', rarity: 'secret', role: 'support', exclusive: true, shape: 'ebonhawk', spd: 156,
      abilities: [
        { name: 'Dorsal Turrets', cd: 0, target: 'enemy', effects: [dmg(0.6, 2)], desc: 'Hit one enemy twice.' },
        { name: 'Evasive Jump', cd: 3, target: 'allAllies', effects: [cleanse(), buff('defUp', 2), tm(20)], desc: 'All allies lose debuffs, gain Defense Up and 20% Turn Meter.' },
      ],
    },
    {
      id: 'sith_fury', name: 'Sith Fury Interceptor', kind: 'ship', faction: 'dark', rarity: 'secret', role: 'attacker', exclusive: true, shape: 'sithfury', spd: 158,
      abilities: [
        { name: 'Fury Cannons', cd: 0, target: 'enemy', effects: [dmg(1.2)], desc: 'Deal damage to one enemy.' },
        { name: 'Wing Blades', cd: 3, target: 'allEnemies', effects: [dmg(0.8), dispel()], desc: 'Damage all enemies and strip their buffs.' },
      ],
    },

    // ---------- Mythic: crate-only, almost never drop ----------
    {
      id: 'darth_revan', name: 'Darth Revan', kind: 'character', faction: 'dark', rarity: 'mythic', role: 'attacker', accent: '#c23bff', spd: 158,
      abilities: [
        { name: 'Twin Blades', cd: 0, target: 'enemy', effects: [dmg(0.75, 2), debuff('defDown', 2, 0.4)], desc: 'Strike twice with a 40% chance of Defense Down.' },
        { name: 'Conqueror\'s Will', cd: 3, target: 'allEnemies', effects: [dmg(1.0), debuff('offDown', 2)], desc: 'Damage all enemies and inflict Offense Down.' },
        { name: 'Mask of Malachor', cd: 4, target: 'enemy', effects: [dmg(2.2), { ...heal(0.25), on: 'self' }], desc: 'Deal heavy damage and heal 25%.' },
      ],
    },
    {
      id: 'starkiller', name: 'Starkiller', kind: 'character', faction: 'dark', rarity: 'mythic', role: 'attacker', accent: '#7ac8ff', spd: 160,
      abilities: [
        { name: 'Lightning Lunge', cd: 0, target: 'enemy', effects: [dmg(1.25), debuff('stun', 1, 0.2)], desc: 'Deal damage with a 20% chance to Stun.' },
        { name: 'Force Repulse', cd: 3, target: 'allEnemies', effects: [dmg(1.1), tm(-20)], desc: 'Damage all enemies and blast 20% of their Turn Meter away.' },
        { name: 'Saber Throw Barrage', cd: 4, target: 'enemy', effects: [dmg(0.8, 3)], desc: 'Hit one enemy three times.' },
      ],
    },
    {
      id: 'master_luke', name: 'Jedi Master Luke', kind: 'character', faction: 'light', rarity: 'mythic', role: 'support', accent: '#3bff6a', spd: 154,
      abilities: [
        { name: 'Master\'s Strike', cd: 0, target: 'enemy', effects: [dmg(1.15), { ...tm(15), on: 'self' }], desc: 'Deal damage and gain 15% Turn Meter.' },
        { name: 'See You Around', cd: 3, target: 'allAllies', effects: [heal(0.2), buff('defUp', 2)], desc: 'All allies heal 20% and gain Defense Up.' },
        { name: 'Legend of the Jedi', cd: 4, target: 'allEnemies', effects: [dmg(1.2), debuff('stun', 1, 0.4)], desc: 'Damage all enemies with a 40% chance to Stun.' },
      ],
    },
    {
      id: 'ghost', name: 'The Ghost', kind: 'ship', faction: 'light', rarity: 'mythic', role: 'support', shape: 'ghost', spd: 156,
      abilities: [
        { name: 'Dorsal Turret', cd: 0, target: 'enemy', effects: [dmg(1.0, 2)], desc: 'Hit one enemy twice.' },
        { name: 'Phantom Launch', cd: 3, target: 'allEnemies', effects: [dmg(0.9), debuff('offDown', 2, 0.5)], desc: 'Damage all enemies with a 50% chance of Offense Down.' },
        { name: 'Spectre Formation', cd: 4, target: 'allAllies', effects: [heal(0.2), buff('offUp', 2), tm(25)], desc: 'All allies heal 20%, gain Offense Up and 25% Turn Meter.' },
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

    ahsoka: U('I Am No Jedi', 'allEnemies', [dmg(1.6, 2)], 'Strike all enemies twice with twin white blades.', 'I am no Jedi.'),
    din_djarin: U('This Is the Way', 'enemy', [dmg(3.6), debuff('burn', 2)], 'Deal massive damage and Burn the target.', 'This is the way.'),
    grievous: U('Blade Whirlwind', 'allEnemies', [dmg(0.6, 3)], 'Strike all enemies three times.', 'Your lightsabers will make a fine addition to my collection.'),
    mace_windu: U('Purple Reign', 'enemy', [dmg(3.4), debuff('stun', 1), { ...buff('taunt', 2), on: 'self' }], 'Deal massive damage, Stun the target and gain Taunt.', 'This party\'s over.'),
    thrawn: U('Checkmate', 'allEnemies', [dmg(1.5), debuff('stun', 1, 0.6), debuff('offDown', 2)], 'Damage all enemies with a 60% Stun chance and Offense Down.', 'To defeat an enemy you must know them.'),
    grogu: U('The Child\'s Power', 'allAllies', [heal(0.45), buff('defUp', 2)], 'All allies heal 45% and gain Defense Up.', 'Patu!'),
    death_trooper: U('Deathmark', 'allEnemies', [dmg(1.2), debuff('defDown', 2), { ...buff('taunt', 2), on: 'self' }], 'Damage all enemies, inflict Defense Down and gain Taunt.', 'Target acquired.'),
    razor_crest: U('Bounty Run', 'allEnemies', [dmg(1.3), { ...heal(0.2), on: 'allies' }], 'Damage all enemies and repair all allies 20%.', 'I have spoken.'),
    tie_interceptor: U('Saber Squadron', 'allEnemies', [dmg(0.8, 2)], 'Hit all enemies twice.', 'Stay in formation.'),
    c3po: U('We\'re Doomed!', 'allEnemies', [debuff('offDown', 2), debuff('defDown', 2), { ...heal(0.15), on: 'allies' }], 'Panic spreads: all enemies get Offense Down and Defense Down; all allies heal 15%.', 'We\'re doomed!'),
    bb8: U('Rolling Thunder', 'allEnemies', [dmg(1.2), debuff('stun', 1, 0.4)], 'Roll through all enemies with a 40% chance to Stun.', 'Bweep-bweep!'),
    k2so: U('You Are Being Rescued', 'enemy', [dmg(3.2), debuff('stun', 1), { ...buff('taunt', 2), on: 'self' }], 'Deal massive damage, Stun the target and gain Taunt.', 'Congratulations. You are being rescued.'),
    chopper: U('Ghost Crew Chaos', 'allAllies', [heal(0.3), buff('offUp', 2)], 'All allies heal 30% and gain Offense Up.', 'Wa-wa-wa!'),
    ig88: U('Termination Sequence', 'allEnemies', [dmg(1.5), debuff('burn', 2)], 'Rockets hammer all enemies and Burn them.', 'Target acquired. Terminate.'),
    droideka: U('Roll and Unfurl', 'allEnemies', [dmg(1.1), { ...buff('taunt', 3), on: 'self' }, { ...buff('defUp', 3), on: 'self' }], 'Damage all enemies, then gain Taunt and Defense Up for 3 turns.', 'Shields up.'),
    b2_droid: U('Blast Them!', 'allEnemies', [dmg(1.0), { ...buff('taunt', 2), on: 'self' }], 'Wrist rockets hit all enemies; gain Taunt.', 'Blast them!'),
    magnaguard: U('Bodyguard Protocol', 'allEnemies', [dmg(1.35), { ...buff('defUp', 2), on: 'self' }], 'Electrostaff strikes hit all enemies; gain Defense Up.', 'Kill. Kill.'),
    ig11: U('360 Sweep', 'allEnemies', [dmg(0.75, 2)], 'Spin and hit all enemies twice.', 'I am not a nurse droid. I am a lethal weapon.'),
    rebel_medic: U('Evac Protocol', 'allAllies', [heal(0.35), buff('defUp', 2)], 'All allies heal 35% and gain Defense Up.', 'Medic! Hold still!'),
    two_onebee: U('Full Recovery', 'allAllies', [heal(0.45), tm(15)], 'All allies heal 45% and gain 15% Turn Meter.', 'Treatment complete.'),
    nightsister_acolyte: U('Witches of Dathomir', 'allAllies', [heal(0.35), buff('offUp', 2)], 'All allies heal 35% and gain Offense Up.', 'The ichor flows.'),
    barriss: U('Healing Trance', 'allAllies', [heal(0.5), buff('defUp', 2), tm(20)], 'All allies heal 50%, gain Defense Up and 20% Turn Meter.', 'The Force will guide my hands.'),
    talzin: U('Magicks of Dathomir', 'allEnemies', [dmg(1.6), debuff('burn', 2), { ...heal(0.3), on: 'allies' }], 'Blast all enemies with ichor and Burn them; all allies heal 30%.', 'The Nightsisters are eternal.'),
    hunter: U('Clone Force 99', 'allEnemies', [dmg(1.4), { ...buff('offUp', 2), on: 'allies' }], 'Lead a strike on all enemies; all allies gain Offense Up.', 'Bad Batch, move out.'),
    wrecker: U('Wrecker Wrecks It', 'allEnemies', [dmg(1.5), debuff('stun', 1, 0.4), { ...buff('taunt', 2), on: 'self' }], 'Explosives hit all enemies with a 40% Stun chance; gain Taunt.', 'Wrecker wreck it!'),
    tech: U('Calculated Probability', 'allAllies', [buff('offUp', 2), buff('defUp', 2), tm(35)], 'All allies gain Offense Up, Defense Up and 35% Turn Meter.', 'Statistically, we should all be dead.'),
    crosshair: U('No Miss', 'enemy', [dmg(4.2), debuff('defDown', 2)], 'A single devastating shot that never misses.', 'I never miss.'),
    echo: U('Scomp Surge', 'allEnemies', [dmg(1.1), debuff('stun', 1, 0.5)], 'Overload enemy systems: damage all enemies with a 50% Stun chance.', 'Interfacing now.'),
    grand_inquisitor: U('The Inquisitorius', 'allEnemies', [dmg(1.4), debuff('defDown', 2), { ...buff('offUp', 2), on: 'allies' }], 'Unleash the spinning blade on all enemies; all allies gain Offense Up.', 'The Jedi are extinct. Their fire has gone out of the universe.'),
    second_sister: U('Hunt Them Down', 'enemy', [dmg(3.6), debuff('stun', 1)], 'A spinning blade strike that deals massive damage and Stuns.', 'I will find you.'),
    fifth_brother: U('Brutal Charge', 'allEnemies', [dmg(1.2), debuff('stun', 1, 0.35), { ...buff('taunt', 2), on: 'self' }], 'Crash into all enemies with a 35% Stun chance; gain Taunt.', 'There is nowhere to run.'),
    seventh_sister: U('Seeker Protocol', 'allEnemies', [dmg(1.3), debuff('offDown', 2), debuff('defDown', 2)], 'A swarm of probe droids hits all enemies with Offense Down and Defense Down.', 'My seekers will find you.'),
    anakin: U('The Chosen One', 'allEnemies', [dmg(2.1), debuff('burn', 2), debuff('stun', 1, 0.4)], 'Leap through every enemy: heavy damage, Burn and a 40% chance to Stun.', 'This is where the fun begins.'),
    qui_gon: U('Will of the Force', 'allEnemies', [dmg(1.3), debuff('offDown', 2), { ...buff('taunt', 2), on: 'self' }], 'A Force wave damages all enemies and inflicts Offense Down; gain Taunt.', 'Your focus determines your reality.'),
    padme: U('Aggressive Negotiations', 'enemy', [dmg(3.0), debuff('stun', 1)], 'Bank shots off the walls: massive damage and Stun.', 'So this is how liberty dies.'),
    lando: U('Cloud City Rally', 'allAllies', [heal(0.25), buff('offUp', 2), tm(40)], 'All allies heal 25%, gain Offense Up and 40% Turn Meter.', 'Hello, what have we here?'),
    jango_fett: U('Bounty of Kamino', 'allEnemies', [dmg(1.5), debuff('defDown', 2)], 'Ricocheting twin-blaster fire hits all enemies and inflicts Defense Down.', 'I\'m just a simple man trying to make my way in the universe.'),
    asajj_ventress: U('Shadow of Dathomir', 'allEnemies', [dmg(1.6), debuff('burn', 2)], 'Twin curved blades carve all enemies and Burn them.', 'I am fear. I am the queen of a blood-soaked planet.'),
    cad_bane: U('Hired Gun', 'enemy', [dmg(3.6), debuff('burn', 3)], 'A charged shot from the shadows: massive damage and Burn for 3 turns.', 'You\'ll find I\'m a very patient man.'),
    moff_gideon: U('The Darksaber', 'allEnemies', [dmg(1.7), debuff('defDown', 2), debuff('stun', 1, 0.3)], 'His cruiser fires on the enemy line: heavy damage, Defense Down, 30% Stun chance.', 'You have something I want.'),
    n1_starfighter: U('Shields Up, Spin Away', 'allEnemies', [dmg(1.5), { ...tm(25), on: 'self' }], 'A golden strafing run hits every enemy; gain 25% Turn Meter.', 'Now this is podracing!'),
    sith_infiltrator: U('Scimitar Strike', 'allEnemies', [dmg(1.6), debuff('stun', 1, 0.4)], 'Seeker droids pour from the cloaked hull: damage all enemies, 40% Stun chance.', 'At last we will reveal ourselves to the Jedi.'),
    arc_170: U('Clone Squadron Sweep', 'allEnemies', [dmg(1.5), dispel(), debuff('offDown', 2)], 'A squadron sweep strips every enemy buff and inflicts Offense Down.', 'Fox Squadron, form up!'),
    delta7: U('Force-Guided Run', 'allAllies', [cleanse(), heal(0.25), buff('defUp', 2), tm(40)], 'All allies are cleansed, heal 25%, gain Defense Up and 40% Turn Meter.', 'Let the Force guide you.'),
    tie_defender: U('Elite Squadron', 'allEnemies', [execute(1.5, 0.35, 2.2), debuff('defDown', 2)], 'Damage all enemies with massive bonus damage to anyone under 35% HP; Defense Down.', 'The Empire\'s finest.'),
    tie_silencer: U('First Order Hunt', 'enemy', [execute(2.6, 0.5, 1.8), dispel()], 'Devastating strike that hits far harder below 50% HP, and strips buffs.', 'Show me the boy.'),
    the_daughter: U('Dawn of Mortis', 'allAllies', [revive(0.5), heal(0.35), cleanse(), tm(30)], 'Bring a fallen ally back at 50% HP; all allies heal 35%, are cleansed and gain 30% Turn Meter.', 'There is still light in you.'),
    temple_guardian: U('Eternal Watch', 'allEnemies', [dmg(1.4), debuff('stun', 1, 0.5), { ...buff('taunt', 3), on: 'self' }, { ...buff('defUp', 3), on: 'allies' }], 'Damage all enemies with a 50% Stun chance; gain Taunt; allies gain Defense Up.', 'None shall pass the temple doors.'),
    the_son: U('Nightfall', 'allEnemies', [dmg(2.0), dispel(), debuff('defDown', 2), debuff('stun', 1, 0.4)], 'Strips every enemy buff, deals heavy damage, Defense Down and a 40% Stun chance.', 'The dark side is the only path.'),
    darth_bane: U('Rule of Two', 'allEnemies', [execute(1.8, 0.4, 2), debuff('burn', 2)], 'Heavy damage to all enemies, doubled under 40% HP, and Burn.', 'One to embody the power, the other to crave it.'),
    ebon_hawk: U('Hawk\'s Escape', 'allAllies', [revive(0.4), heal(0.3), buff('offUp', 2), tm(30)], 'Pull a fallen ally back at 40% HP; all allies heal 30%, gain Offense Up and 30% Turn Meter.', 'Fastest hunk of junk in the Old Republic.'),
    sith_fury: U('Imperial Talon', 'allEnemies', [execute(1.6, 0.35, 2), dispel(), debuff('offDown', 2)], 'Strip every enemy buff and strike hard, doubled under 35% HP; Offense Down.', 'For the Sith Empire.'),
    cal_kestis: U('Echoes of the Order', 'allEnemies', [dmg(1.6), debuff('stun', 1, 0.35), { ...tm(30), on: 'self' }], 'Spin the split saber through every enemy: heavy damage, 35% Stun chance; gain 30% Turn Meter.', 'The Order lives on in me.'),
    bo_katan: U('Darksaber\'s Claim', 'enemy', [execute(2.8, 0.5, 1.6), { ...buff('offUp', 2), on: 'allies' }], 'A Darksaber strike that hits far harder below 50% HP; all allies gain Offense Up.', 'Mandalore will rise again.'),
    sabine: U('Masterpiece', 'allEnemies', [dmg(1.45), debuff('burn', 2), debuff('offDown', 2, 0.5)], 'Paint bombs blanket every enemy: Burn and a 50% chance of Offense Down.', 'Art is a weapon too.'),
    captain_rex: U('501st, With Me', 'allAllies', [heal(0.25), buff('defUp', 3), tm(25), { ...buff('taunt', 3), on: 'self' }], 'All allies heal 25%, gain Defense Up and 25% Turn Meter; Rex gains Taunt.', 'Experience outranks everything.'),
    hondo: U('Ohnaka Gang', 'allEnemies', [dmg(1.1), dispel(), { ...tm(35), on: 'allies' }], 'The pirates raid every enemy and strip their buffs; all allies gain 35% Turn Meter.', 'Business is business, my friend.'),
    savage_opress: U('Unstoppable Brother', 'allEnemies', [dmg(1.5), debuff('stun', 1, 0.4), { ...buff('taunt', 2), on: 'self' }, { ...buff('defUp', 2), on: 'self' }], 'A brutal charge through every enemy with a 40% Stun chance; gain Taunt and Defense Up.', 'I will crush you.'),
    u_wing: U('Rogue Insertion', 'allAllies', [buff('offUp', 3), buff('defUp', 2), tm(45)], 'Commandos hit the ground: all allies gain Offense Up, Defense Up and 45% Turn Meter.', 'Rebellions are built on hope.'),
    upsilon_shuttle: U('Supreme Escort', 'self', [buff('taunt', 3), buff('defUp', 3), heal(0.3), { ...buff('defUp', 2), on: 'allies' }], 'Wings unfold into a shield: Taunt, Defense Up and 30% repair; all allies gain Defense Up.', 'Prepare my shuttle.'),
    hounds_tooth: U('Bossk\'s Bounty', 'allEnemies', [execute(1.5, 0.35, 2), debuff('burn', 2)], 'A missile barrage on every enemy, doubled under 35% HP, and Burn.', 'The hunt is on.'),
    darth_revan: U('Mandalorian Wars', 'allEnemies', [dmg(2.3), debuff('defDown', 2), debuff('stun', 1, 0.5)], 'Twin blades carve every enemy: heavy damage, Defense Down and a 50% chance to Stun.', 'I am Revan. I have conquered death itself.'),
    starkiller: U('Unleashed', 'allEnemies', [dmg(2.4), debuff('stun', 1, 0.6)], 'Pull a Star Destroyer out of the sky onto every enemy: devastating damage, 60% Stun chance.', 'I will be your enemy no longer.'),
    master_luke: U('Binary Sunset', 'allAllies', [heal(0.45), buff('offUp', 3), buff('defUp', 3), tm(60)], 'All allies heal 45%, gain Offense Up, Defense Up and 60% Turn Meter.', 'No one\'s ever really gone.'),
    ghost: U('Specters, Attack', 'allEnemies', [dmg(2.0), debuff('offDown', 2), { ...tm(30), on: 'allies' }], 'The Ghost decloaks and rakes every enemy; all allies gain 30% Turn Meter.', 'Spectre One, standing by.'),
    eighth_brother: U('Rotor Descent', 'allEnemies', [dmg(1.5), debuff('burn', 2)], 'Drop in on a spinning blade: heavy damage and Burn to all enemies.', 'Surrender, Jedi.'),
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
    return def.ultimate || ULTIMATES[def.id] || ROLE_ULTIMATES[def.kind][def.role];
  }

  // Every ability a unit can use in battle; the ultimate is always last.
  function abilitiesFor(def) {
    return [...def.abilities, ultimateFor(def)];
  }


  // Bosses are not collectable. They get big stat multipliers, are immune to
  // Stun, and become Enraged (permanent Offense Up + full ultimate) below 50% HP.
  const BOSSES = [
    // ---------- The hidden zone ----------
    {
      id: 'boss_daughter', name: 'The Daughter', kind: 'character', faction: 'light', rarity: 'legendary', role: 'healer', spd: 150,
      boss: { hp: 9, atk: 1.15, def: 1.3 },
      abilities: [
        { name: 'Radiant Lance', cd: 0, target: 'enemy', effects: [dmg(1.3)], desc: 'Deal damage to one enemy.' },
        { name: 'Light of Mortis', cd: 3, target: 'allAllies', effects: [heal(0.18), cleanse()], desc: 'All allies heal 18% and are cleansed.' },
        { name: 'Blinding Dawn', cd: 4, target: 'allEnemies', effects: [dmg(0.9), debuff('offDown', 2)], desc: 'Damage all enemies and inflict Offense Down.' },
      ],
      ultimate: U('Dawn of Mortis', 'allEnemies', [dmg(1.7), debuff('stun', 1, 0.4), { ...heal(0.2), on: 'allies' }], 'A blinding dawn damages every enemy; her allies heal 20%.', 'There is still light in you.'),
    },
    {
      id: 'boss_guardian', name: 'Temple Guardian Prime', kind: 'character', faction: 'light', rarity: 'legendary', role: 'tank', spd: 128,
      boss: { hp: 12, atk: 1.15, def: 1.6 },
      abilities: [
        { name: 'Pike Sweep', cd: 0, target: 'enemy', effects: [dmg(1.35)], desc: 'Deal damage to one enemy.' },
        { name: 'Sworn Vigil', cd: 3, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2), heal(0.08)], desc: 'Gain Taunt, Defense Up and heal 8%.' },
        { name: 'Spinning Pike', cd: 4, target: 'allEnemies', effects: [dmg(1.0), debuff('stun', 1, 0.35)], desc: 'Damage all enemies with a 35% Stun chance.' },
      ],
      ultimate: U('Eternal Watch', 'allEnemies', [dmg(1.9), debuff('defDown', 2)], 'Heavy damage to every enemy and Defense Down.', 'None shall pass the temple doors.'),
    },
    {
      id: 'boss_son', name: 'The Son', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 158,
      boss: { hp: 9, atk: 1.3, def: 1.2 },
      abilities: [
        { name: 'Shadow Talon', cd: 0, target: 'enemy', effects: [dmg(1.4), dispel()], desc: 'Deal damage and strip buffs.' },
        { name: 'Corruption', cd: 3, target: 'allEnemies', effects: [dmg(0.9), debuff('burn', 2)], desc: 'Damage and Burn all enemies.' },
        { name: 'Feast on Fear', cd: 4, target: 'enemy', effects: [execute(1.8, 0.4, 2), { ...heal(0.1), on: 'self' }], desc: 'Heavy damage, doubled under 40% HP; heal 10%.' },
      ],
      ultimate: U('Nightfall', 'allEnemies', [dmg(1.9), dispel(), debuff('stun', 1, 0.4)], 'Strips every buff and deals heavy damage with a 40% Stun chance.', 'The dark side is the only path.'),
    },
    {
      id: 'boss_bane', name: 'Darth Bane', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 140,
      boss: { hp: 11, atk: 1.35, def: 1.4 },
      abilities: [
        { name: 'Orbalisk Strike', cd: 0, target: 'enemy', effects: [dmg(1.45), { ...heal(0.05), on: 'self' }], desc: 'Deal damage and heal 5%.' },
        { name: 'Sith Lightning', cd: 3, target: 'allEnemies', effects: [dmg(0.95), debuff('defDown', 2)], desc: 'Damage all enemies and inflict Defense Down.' },
        { name: 'Thought Bomb', cd: 5, target: 'allEnemies', effects: [execute(1.1, 0.35, 2.2)], desc: 'Damage all enemies; massive bonus under 35% HP.' },
      ],
      ultimate: U('Rule of Two', 'allEnemies', [execute(1.8, 0.4, 2), debuff('burn', 2)], 'Heavy damage to all enemies, doubled under 40% HP, and Burn.', 'One to embody the power, the other to crave it.'),
    },
    {
      id: 'rancor', name: 'The Rancor', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 120,
      boss: { hp: 7, atk: 1.12, def: 1.2 },
      abilities: [
        { name: 'Crushing Claw', cd: 0, target: 'enemy', effects: [dmg(1.3)], desc: 'Deal damage to one enemy.' },
        { name: 'Ground Pound', cd: 3, target: 'allEnemies', effects: [dmg(0.8), debuff('stun', 1, 0.3)], desc: 'Damage all enemies with a 30% chance to Stun.' },
        { name: 'Devour', cd: 4, target: 'enemy', effects: [dmg(2.6), { ...heal(0.08), on: 'self' }], desc: 'Deal massive damage and heal 8%.' },
      ],
      ultimate: U('Feeding Frenzy', 'allEnemies', [dmg(1.8), debuff('defDown', 2)], 'Deal heavy damage to all enemies and inflict Defense Down.', 'GRRRAAAAHHH!'),
    },
    {
      id: 'krayt_dragon', name: 'Krayt Dragon', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 125,
      boss: { hp: 10, atk: 1.25, def: 1.25 },
      abilities: [
        { name: 'Tail Lash', cd: 0, target: 'enemy', effects: [dmg(1.25), debuff('defDown', 2, 0.3)], desc: 'Deal damage with a 30% chance of Defense Down.' },
        { name: 'Acid Spit', cd: 3, target: 'allEnemies', effects: [dmg(0.8), debuff('burn', 2, 0.7)], desc: 'Damage all enemies with a 70% chance to Burn.' },
        { name: 'Burrow', cd: 4, target: 'self', effects: [heal(0.12), buff('defUp', 2)], desc: 'Dig into the sand: heal 12% and gain Defense Up.' },
      ],
      ultimate: U('Dune Sea Rampage', 'allEnemies', [dmg(1.9), debuff('stun', 1, 0.4)], 'Deal heavy damage to all enemies with a 40% chance to Stun.', 'The ground trembles...'),
    },
    {
      id: 'lord_vader', name: 'Lord Vader', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', accent: '#e23b3b', spd: 140,
      boss: { hp: 5.5, atk: 0.95, def: 1.2 },
      abilities: [
        { name: 'Merciless Strike', cd: 0, target: 'enemy', effects: [dmg(1.3), debuff('defDown', 2, 0.5)], desc: 'Deal damage with a 50% chance of Defense Down.' },
        { name: 'Saber Throw', cd: 3, target: 'allEnemies', effects: [dmg(1.0)], desc: 'Damage all enemies.' },
        { name: 'Force Crush', cd: 3, target: 'enemy', effects: [dmg(2.4), debuff('stun', 1)], desc: 'Deal massive damage and Stun the target.' },
      ],
      ultimate: U('Hallway Massacre', 'allEnemies', [dmg(2.2), debuff('stun', 1, 0.5)], 'Deal devastating damage to all enemies with a 50% chance to Stun.', 'There is no escape.'),
    },
    {
      id: 'star_destroyer', name: 'Imperial Star Destroyer', kind: 'ship', faction: 'dark', rarity: 'legendary', role: 'tank', shape: 'isd', spd: 105,
      boss: { hp: 4.8, atk: 0.9, def: 1.1 },
      abilities: [
        { name: 'Turbolaser Battery', cd: 0, target: 'enemy', effects: [dmg(1.2)], desc: 'Deal damage to one enemy.' },
        { name: 'Broadside', cd: 3, target: 'allEnemies', effects: [dmg(0.8)], desc: 'Damage all enemies.' },
        { name: 'Tractor Beam', cd: 4, target: 'enemy', effects: [dmg(1.0), debuff('stun', 1), debuff('defDown', 2)], desc: 'Damage, Stun and inflict Defense Down.' },
      ],
      ultimate: U('Full Broadside', 'allEnemies', [dmg(2.0), debuff('burn', 2)], 'Unload every battery: heavy damage and Burn to all enemies.', 'All batteries, fire!'),
    },
    {
      id: 'death_star', name: 'The Death Star', kind: 'ship', faction: 'dark', rarity: 'legendary', role: 'support', shape: 'deathstar', spd: 95,
      boss: { hp: 6.5, atk: 0.95, def: 1.2 },
      abilities: [
        { name: 'Turbolaser Grid', cd: 0, target: 'enemy', effects: [dmg(1.2)], desc: 'Deal damage to one enemy.' },
        { name: 'Defense Network', cd: 4, target: 'allEnemies', effects: [dmg(0.9), debuff('offDown', 2, 0.6)], desc: 'Damage all enemies with a 60% chance of Offense Down.' },
        { name: 'Deflector Shield', cd: 4, target: 'self', effects: [heal(0.08), buff('defUp', 2)], desc: 'Heal 8% and gain Defense Up.' },
      ],
      ultimate: U('Fire the Superlaser', 'enemy', [dmg(6.5)], 'Obliterate one target with the superlaser.', 'That\'s no moon...'),
    },
  ];

  const BOSS_ENCOUNTERS = [
    { id: 'rancor', name: 'The Rancor Pit', kind: 'character', level: 8, minions: [], unlock: 'tatooine', planet: 'tatooine', place: 'Jabba\'s Palace, Tatooine' },
    { id: 'star_destroyer', name: 'Star Destroyer Assault', kind: 'ship', level: 9, minions: ['tie_fighter', 'tie_fighter'], unlock: 'hoth', planet: 'hoth', place: 'Hoth system' },
    { id: 'krayt_dragon', name: 'The Dune Sea', kind: 'character', level: 14, minions: ['tusken_raider', 'tusken_raider'], unlock: 'bespin', planet: 'tatooine', place: 'Dune Sea, Tatooine' },
    { id: 'death_star', name: 'That\'s No Moon', kind: 'ship', level: 16, minions: ['tie_interceptor', 'tie_fighter'], unlock: 'scarif', planet: 'scarif', place: 'Scarif system' },
    { id: 'lord_vader', name: 'Vader\'s Fortress', kind: 'character', level: 20, minions: ['stormtrooper', 'battle_droid', 'stormtrooper', 'battle_droid'], unlock: 'coruscant', planet: 'mustafar', place: 'Fortress Vader, Mustafar' },
  ];

  function bossRewards(enc, firstClear) {
    return {
      credits: 400 + enc.level * 60,
      aurodium: firstClear ? 5 : 1,
      kyber: firstClear ? 3 : 0,
      card: firstClear ? 'epic+' : null,
    };
  }


  // Flavor text shown on the back of each card.
  const BIOS = {
    grand_inquisitor: 'Leader of the Empire\'s Jedi hunters. A cold, precise duelist who wields a spinning double-bladed saber.',
    second_sister: 'A fallen Jedi turned Inquisitor, relentless in her hunt for any Jedi who survived Order 66.',
    fifth_brother: 'A hulking Inquisitor who prefers overwhelming force to finesse.',
    seventh_sister: 'A cunning Inquisitor who hunts with a swarm of ID9 seeker probe droids.',
    eighth_brother: 'An Inquisitor who spins his blade like a rotor to glide down on his prey.',
    anakin: 'The Chosen One at the height of the Clone Wars: reckless, brilliant and the most powerful Jedi of his age.',
    qui_gon: 'A maverick Jedi Master who followed the living Force and found the Chosen One on Tatooine.',
    padme: 'Queen, then Senator of Naboo. A crack shot who never waited for others to fight her battles.',
    lando: 'Gambler, smuggler, Baron Administrator of Cloud City and a general of the Rebellion.',
    jango_fett: 'The bounty hunter whose DNA became the clone army. Twin blasters, jetpack, no mercy.',
    asajj_ventress: 'Dooku\'s Nightsister assassin, wielding twin curved red sabers.',
    cad_bane: 'The deadliest bounty hunter of the Clone Wars, hat low and blasters fast.',
    moff_gideon: 'An Imperial warlord who survived the Empire\'s fall and claimed the ancient Darksaber.',
    n1_starfighter: 'Royal Naboo starfighter: chrome, gold and faster than it looks.',
    sith_infiltrator: 'Darth Maul\'s cloaking ship, carrying a swarm of seeker droids.',
    boss_daughter: 'The guardian of the light on a world outside time. She heals her allies as fast as you can wound them.',
    boss_guardian: 'An armored sentinel who has never once stepped aside from the door he guards.',
    boss_son: 'Pure darkness wearing a face. He strips away every protection before he strikes.',
    boss_bane: 'The ancient Sith Lord who forged the Rule of Two, still waiting for a worthy apprentice.',
    cal_kestis: 'A Padawan who survived Order 66 hiding as a scrapper, now rebuilding the Jedi way with BD-1 at his side.',
    bo_katan: 'Heir to the clans of Mandalore. A born commander who has fought on every side to win her world back.',
    sabine: 'Mandalorian demolitions artist of the Ghost crew. Her armor is her canvas and her bombs are her signature.',
    captain_rex: 'Captain of the 501st Legion. Loyal to his brothers first, and one of the finest soldiers the clones ever produced.',
    hondo: 'Pirate captain of the Ohnaka Gang. Always smiling, always scheming, always one step from his next deal.',
    savage_opress: 'A Nightbrother transformed by Nightsister magic into a towering, brutal apprentice of the dark side.',
    u_wing: 'A Rebel troop carrier that drops commandos into the hottest zones, wings swept forward for the run in.',
    upsilon_shuttle: 'A command shuttle whose towering wings fold down into a black shield around its passengers.',
    hounds_tooth: 'Bossk\'s heavily armed transport, rigged to hunt down and hold the galaxy\'s most valuable bounties.',
    arc_170: 'A heavy clone fighter with a rear tail gunner. It tears enemy shields and buffs apart.',
    delta7: 'A sleek Jedi interceptor flown with an astromech wired into its wing.',
    tie_defender: 'The Empire\'s elite fighter: shields, hyperdrive and six cannons that finish off the wounded.',
    tie_silencer: 'Kylo Ren\'s personal fighter, built to hunt down anything already bleeding.',
    the_daughter: 'A being of pure light from a world outside time. Few have seen her; fewer have earned her trust.',
    temple_guardian: 'A masked sentinel who has guarded a forgotten temple for a thousand years.',
    the_son: 'A being of pure darkness from a world outside time, hungry to escape it.',
    darth_bane: 'The Sith Lord who forged the Rule of Two, armored in living orbalisks.',
    ebon_hawk: 'A battered Old Republic freighter that has carried legends out of impossible places.',
    sith_fury: 'An ancient Sith interceptor with folding blade wings.',
    darth_revan: 'A Jedi hero turned Sith conqueror from the Old Republic era, masked and wielding twin blades. A legend most players never see.',
    starkiller: 'Vader\'s secret apprentice, raw Force power unleashed. He once pulled a Star Destroyer out of orbit.',
    master_luke: 'The last Jedi Master, years after the war: a weathered legend whose Force projection held off an entire army.',
    ghost: 'A modified freighter that hides a smaller shuttle, the Phantom. Home of a small rebel cell called the Spectres.',
    rebel_medic: 'A combat medic of the Rebel Alliance who runs toward the blaster fire so others can walk away from it.',
    two_onebee: 'A surgical droid who has patched up everyone from Luke Skywalker to half the Rebel fleet.',
    nightsister_acolyte: 'A young witch of Dathomir who draws on green ichor magick to mend her sisters.',
    barriss: 'A Mirialan Jedi healer, famous for her Force healing and her quiet, fierce focus.',
    talzin: 'Leader of the Nightsisters of Dathomir, a master of dark magicks who can heal or curse with a gesture.',
    hunter: 'Leader of Clone Force 99, with enhanced senses that let him track anything.',
    wrecker: 'The Bad Batch\'s demolitions expert. Huge, loud, and happiest when things explode.',
    tech: 'The Bad Batch\'s genius. Hacks, calculates and talks through the odds while everyone else fights.',
    crosshair: 'A clone sharpshooter with enhanced eyesight. He does not miss.',
    echo: 'A former ARC trooper rebuilt with cybernetics who can interface directly with enemy systems.',
    c3po: 'A protocol droid fluent in over six million forms of communication, and in constant fear of the odds.',
    bb8: 'A plucky astromech who rolls into danger, zaps enemies and gives a mean thumbs up with a lighter.',
    k2so: 'A reprogrammed Imperial security droid with enormous strength and absolutely no filter.',
    chopper: 'The Ghost crew\'s grumpy, cantankerous astromech. He fixes things, zaps people and mostly complains.',
    ig88: 'An assassin droid bounty hunter with a head full of sensors and a body full of weapons.',
    droideka: 'A Separatist destroyer droid that rolls into battle, unfurls and hides behind a deflector shield.',
    b2_droid: 'A hulking super battle droid built to soak up blaster fire and shrug it off.',
    magnaguard: 'General Grievous\'s elite bodyguard, trained in combat with an electrostaff that can block lightsabers.',
    ig11: 'A bounty hunter droid, later reprogrammed as a protector. Spins its head a full circle while shooting.',
    vulture_droid: 'A Separatist droid starfighter that can fold its wings and walk. Cheap, fast and built in swarms.',
    rebel_soldier: 'A fleet trooper of the Rebel Alliance. Poorly equipped, badly outnumbered, and still first through the door.',
    clone_trooper: 'Bred on Kamino for one purpose: war. Disciplined, loyal and tough enough to anchor any line.',
    ewok_warrior: 'Small, fierce and fiercely loyal. The forest moon of Endor has humbled bigger armies than yours.',
    han_solo: 'Smuggler, scoundrel and captain of the Millennium Falcon. He shoots first and asks questions never.',
    chewbacca: 'A Wookiee warrior over two hundred years old. Loyal to the end, and not someone you want to lose to.',
    leia: 'Senator, general and Rebel leader. Her command inspires every soldier who fights beside her.',
    r2d2: 'An astromech with a stubborn streak and a hidden tool for every problem. The galaxy owes this droid a lot.',
    obi_wan: 'Jedi Master and legendary duelist. His Soresu defense can outlast almost any opponent.',
    luke: 'A farm boy from Tatooine who became a Jedi Knight and brought balance back to the Force.',
    yoda: 'Grand Master of the Jedi Order for eight centuries. Small in size, unmatched in the Force.',
    rey: 'A scavenger from Jakku with a staggering connection to the Force and the grit to match it.',
    stormtrooper: 'The faceless backbone of the Galactic Empire. What they lack in aim they make up for in numbers.',
    battle_droid: 'Mass-produced for the Separatist army. Cheap, fragile and endlessly replaceable. Roger, roger.',
    tusken_raider: 'Fierce nomads of the Dune Sea. They strike fast, hit hard and vanish into the sand.',
    boba_fett: 'The most feared bounty hunter in the galaxy. Every weapon on his armor has a job to do.',
    tarkin: 'Grand Moff of the Outer Rim and commander of the Death Star. Rules through fear, and it works.',
    darth_maul: 'A Zabrak Sith assassin with a double-bladed saber and a hunger for revenge.',
    kylo_ren: 'Master of the Knights of Ren. His raw, unstable power is matched only by his temper.',
    count_dooku: 'A former Jedi Master turned Sith Lord. An elegant duelist with a lethal command of lightning.',
    vader: 'Dark Lord of the Sith and the Emperor\'s enforcer. His presence alone can break an army.',
    palpatine: 'The Emperor. A master manipulator whose Force lightning can overwhelm entire squads.',
    jawa: 'A hooded scavenger of Tatooine. Trades junk, steals droids and hypes up the whole crew.',
    grogu: 'A tiny Force-sensitive foundling with remarkable healing powers and a big appetite.',
    death_trooper: 'Elite Imperial special forces in black armor. Silent, relentless and nearly impossible to stop.',
    ahsoka: 'Anakin Skywalker\'s former Padawan, now a rogue warrior who fights with twin white blades.',
    din_djarin: 'A Mandalorian bounty hunter clad in beskar. Follows the Creed and never takes off the helmet.',
    grievous: 'Supreme commander of the droid army and a collector of Jedi lightsabers. Four arms, four blades.',
    mace_windu: 'Master of the Jedi Council and creator of the Vaapad style. Only he wields a purple blade.',
    thrawn: 'A Chiss tactical genius who studies an enemy\'s art to find the weakness in their soul.',
    z95: 'A tough old fighter from the Clone Wars era, still flown by Rebel cells and freelancers across the Outer Rim.',
    a_wing: 'The fastest starfighter in the Rebel fleet. Built for interception and hit-and-run strikes.',
    y_wing: 'A rugged Rebel bomber. Slow, heavily armored, and packing an ion cannon that shuts ships down.',
    x_wing: 'The legendary T-65 starfighter that destroyed the first Death Star. Balanced, deadly and iconic.',
    b_wing: 'A heavy assault fighter with a rotating cockpit and enough firepower to cripple capital ships.',
    falcon: 'The fastest hunk of junk in the galaxy. Made the Kessel Run in less than twelve parsecs.',
    razor_crest: 'The Mandalorian\'s armored gunship. Old, patched up, and always somehow still flying.',
    tie_fighter: 'The screaming symbol of Imperial power. Fragile but fast, and never flying alone.',
    tie_bomber: 'A double-hulled Imperial bomber built to level ground targets and punish capital ships.',
    tie_interceptor: 'An upgraded TIE with dagger wings and quad lasers. Only the Empire\'s best pilots fly it.',
    lambda_shuttle: 'A heavily shielded Imperial transport. Wings fold up, shields stay on, VIPs stay safe.',
    slave_one: 'Boba Fett\'s modified patrol ship, loaded with hidden weapons and seismic charges.',
    tie_advanced: 'Darth Vader\'s personal starfighter. Shielded, hyperdrive equipped and flown by the best.',
    rancor: 'A towering predator kept beneath Jabba\'s palace. It eats whatever falls through the trapdoor.',
    krayt_dragon: 'The apex predator of Tatooine\'s Dune Sea, large enough to swallow a bantha whole.',
    lord_vader: 'Vader at the height of his power, hunting Rebels through the halls of his Mustafar fortress.',
    star_destroyer: 'A mile-long wedge of Imperial might, bristling with turbolasers and packed with TIE fighters.',
    death_star: 'A moon-sized battle station with enough firepower to destroy an entire planet.',
  };

  const UNIT_MAP = Object.fromEntries([...UNITS, ...BOSSES].map((u) => [u.id, u]));

  const MAX_LEVEL = 30;
  const MAX_STARS = 7;
  // Shards needed to go from star N to N+1 (index 0 = 1★ -> 2★).
  const STAR_COSTS = [10, 25, 50, 80, 120, 170];
  const DUPLICATE_SHARDS = { common: 5, rare: 8, epic: 12, legendary: 20, mythic: 30, secret: 40 };

  function levelCost(level) {
    return 100 * level + 20 * level * level;
  }

  function unitStats(def, level, stars) {
    const base = ROLE_BASE[def.role];
    const rar = RARITIES[def.rarity].mult;
    const grow = (1 + 0.08 * (level - 1)) * (1 + 0.1 * (stars - 1));
    const b = def.boss || { hp: 1, atk: 1, def: 1 };
    return {
      hp: Math.round(base.hp * rar * grow * b.hp),
      atk: Math.round(base.atk * rar * grow * b.atk),
      def: Math.round(base.def * rar * (1 + 0.04 * (level - 1)) * (1 + 0.05 * (stars - 1)) * b.def),
      spd: (def.spd || base.spd) + Math.floor((stars - 1) * 2),
    };
  }

  function power(def, level, stars) {
    const s = unitStats(def, level, stars);
    return Math.round(s.hp * 0.3 + s.atk * 3 + s.def * 2 + s.spd * 1.5);
  }

  const SQUAD_SIZE = { character: 5, ship: 5 };

  // ---------- Account level & squad slots ----------
  // Squads start with 3 slots. Slots 4 and 5 need BOTH an account level and
  // a liberated planet, for ground and fleet squads alike.
  const BASE_SLOTS = 3;
  const SLOT_UNLOCKS = [
    { slot: 4, level: 4, planet: 'tatooine' },
    { slot: 5, level: 6, planet: 'hoth' },
  ];
  const MAX_ACCOUNT_LEVEL = 50;
  const xpToNext = (level) => Math.round(60 + level * 35 + level * level * 5);
  // Kyber is the premium currency: a trickle from play, a little more on milestones.
  const levelReward = (level) => ({ credits: 150 + level * 50, crystals: level % 5 === 0 ? 10 : 2 });
  const XP = { stage: (lvl) => 50 + lvl * 8, boss: (lvl) => 150 + lvl * 10, loss: 15 };
  // Enemy squads grow with you: 3 on the first planet, 4 on the second, then 5.
  const planetSquadSize = (planetId) => ({ tatooine: 3, hoth: 4 }[planetId] || 5);

  // ---------- Traits & synergies ----------
  const TRAITS = {
    rebel_soldier: ['rebel', 'trooper'], clone_trooper: ['trooper', 'republic'], ewok_warrior: ['native', 'rebel'],
    han_solo: ['rebel', 'scoundrel'], chewbacca: ['rebel', 'scoundrel', 'native'], leia: ['rebel', 'leader'],
    r2d2: ['droid', 'rebel'], obi_wan: ['jedi', 'republic'], luke: ['jedi', 'rebel'], yoda: ['jedi', 'republic'],
    rey: ['jedi', 'scoundrel'], stormtrooper: ['empire', 'trooper'], battle_droid: ['droid', 'separatist'],
    tusken_raider: ['native'], boba_fett: ['bounty', 'scoundrel'], tarkin: ['empire', 'leader'], darth_maul: ['sith'],
    kylo_ren: ['sith', 'empire'], count_dooku: ['sith', 'separatist', 'leader'], vader: ['sith', 'empire'],
    palpatine: ['sith', 'empire', 'leader'], jawa: ['native', 'scoundrel'], grogu: ['jedi', 'native'],
    death_trooper: ['empire', 'trooper'], ahsoka: ['jedi', 'republic'], din_djarin: ['bounty', 'mandalorian'],
    grievous: ['separatist', 'droid', 'leader'], mace_windu: ['jedi', 'republic', 'leader'], thrawn: ['empire', 'leader'],
    z95: ['fighter', 'rebel', 'scoundrel'], a_wing: ['fighter', 'rebel'], y_wing: ['bomber', 'rebel'], x_wing: ['fighter', 'rebel'], b_wing: ['bomber', 'rebel'],
    falcon: ['gunship', 'scoundrel', 'rebel'], razor_crest: ['gunship', 'bounty'], tie_fighter: ['fighter', 'empire'],
    tie_bomber: ['bomber', 'empire'], tie_interceptor: ['fighter', 'empire'], lambda_shuttle: ['gunship', 'empire'],
    slave_one: ['gunship', 'bounty'], vulture_droid: ['fighter', 'droid', 'separatist'],
    grand_inquisitor: ['inquisitor', 'empire', 'leader'], second_sister: ['inquisitor', 'empire'], fifth_brother: ['inquisitor', 'empire'], seventh_sister: ['inquisitor', 'empire'], eighth_brother: ['inquisitor', 'empire'],
    anakin: ['jedi', 'republic'], qui_gon: ['jedi', 'republic'], padme: ['republic', 'leader'], lando: ['scoundrel', 'rebel', 'leader'],
    jango_fett: ['bounty', 'mandalorian'], asajj_ventress: ['sith', 'nightsister'], cad_bane: ['bounty', 'scoundrel'], moff_gideon: ['empire', 'leader'],
    n1_starfighter: ['fighter', 'republic'], sith_infiltrator: ['fighter', 'sith'],
    cal_kestis: ['jedi', 'scoundrel'], bo_katan: ['mandalorian', 'leader'], sabine: ['mandalorian', 'rebel'], captain_rex: ['trooper', 'republic', 'leader'],
    hondo: ['scoundrel', 'leader'], savage_opress: ['sith', 'nightsister'], u_wing: ['gunship', 'rebel'], upsilon_shuttle: ['gunship', 'empire'], hounds_tooth: ['gunship', 'bounty'],
    arc_170: ['fighter', 'republic'], delta7: ['fighter', 'jedi', 'republic'], tie_defender: ['fighter', 'empire'], tie_silencer: ['fighter', 'sith'],
    the_daughter: ['jedi', 'leader'], temple_guardian: ['jedi', 'republic'], the_son: ['sith'], darth_bane: ['sith', 'leader'], ebon_hawk: ['gunship', 'jedi', 'scoundrel'], sith_fury: ['fighter', 'sith'],
    darth_revan: ['sith', 'leader'], starkiller: ['sith'], master_luke: ['jedi', 'rebel', 'leader'], ghost: ['rebel', 'fighter'],
    c3po: ['droid', 'rebel'], rebel_medic: ['rebel', 'trooper'], two_onebee: ['droid', 'rebel'], nightsister_acolyte: ['nightsister'], barriss: ['jedi', 'republic'], talzin: ['nightsister', 'leader'],
    hunter: ['badbatch', 'trooper', 'leader'], wrecker: ['badbatch', 'trooper'], tech: ['badbatch', 'trooper'], crosshair: ['badbatch', 'trooper'], echo: ['badbatch', 'trooper', 'droid'], bb8: ['droid', 'rebel'], k2so: ['droid', 'rebel'], chopper: ['droid', 'rebel', 'scoundrel'],
    ig88: ['droid', 'bounty'], droideka: ['droid', 'separatist'], b2_droid: ['droid', 'separatist'], magnaguard: ['droid', 'separatist'], ig11: ['droid', 'bounty'], tie_advanced: ['fighter', 'empire', 'sith'],
    rancor: ['creature'], krayt_dragon: ['creature'], lord_vader: ['sith', 'empire'], star_destroyer: ['capital', 'empire'], death_star: ['capital', 'empire'],
  };

  const TRAIT_INFO = {
    jedi: { label: 'Jedi', icon: '✧' }, sith: { label: 'Sith', icon: '⛧' }, rebel: { label: 'Rebel', icon: '✺' },
    empire: { label: 'Empire', icon: '⬢' }, republic: { label: 'Republic', icon: '⌬' }, separatist: { label: 'Separatist', icon: '⎔' },
    scoundrel: { label: 'Scoundrel', icon: '☄' }, bounty: { label: 'Bounty Hunter', icon: '⌖' }, droid: { label: 'Droid', icon: '⚙' },
    trooper: { label: 'Trooper', icon: '⛉' }, native: { label: 'Native', icon: '❦' }, leader: { label: 'Leader', icon: '♛' },
    mandalorian: { label: 'Mandalorian', icon: '⟁' }, badbatch: { label: 'Bad Batch', icon: '⚑' }, inquisitor: { label: 'Inquisitor', icon: '⊗' }, nightsister: { label: 'Nightsister', icon: '☽' }, fighter: { label: 'Fighter', icon: '➶' }, bomber: { label: 'Bomber', icon: '✹' },
    gunship: { label: 'Gunship', icon: '⛭' }, creature: { label: 'Creature', icon: '⚘' }, capital: { label: 'Capital Ship', icon: '▲' },
  };

  // ---------- Classes (Collection filters). A unit can be in several. ----------
  const CLASS_INFO = {
    healer: { label: 'Healer', icon: '✚' }, tank: { label: 'Tank', icon: '⛨' }, fighter: { label: 'Fighter', icon: '⚔' },
    ranged: { label: 'Ranged', icon: '➹' }, support: { label: 'Support', icon: '✦' }, force: { label: 'Force User', icon: '✧' },
    droid: { label: 'Droid', icon: '⚙' }, starfighter: { label: 'Starfighter', icon: '➶' }, bomber: { label: 'Bomber', icon: '✹' }, gunship: { label: 'Gunship', icon: '⛭' },
  };
  const MELEE = ['cal_kestis', 'bo_katan', 'savage_opress', 'ewok_warrior', 'tusken_raider', 'obi_wan', 'luke', 'yoda', 'rey', 'darth_maul', 'kylo_ren', 'count_dooku', 'vader', 'ahsoka', 'grievous', 'mace_windu', 'magnaguard', 'k2so', 'hunter', 'grand_inquisitor', 'second_sister', 'fifth_brother', 'seventh_sister', 'eighth_brother', 'darth_revan', 'starkiller', 'master_luke', 'the_daughter', 'temple_guardian', 'the_son', 'darth_bane', 'boss_daughter', 'boss_guardian', 'boss_son', 'boss_bane', 'anakin', 'qui_gon', 'asajj_ventress', 'moff_gideon', 'rancor', 'krayt_dragon', 'lord_vader'];

  // Classes lead with what the card actually does in a squad: Tank, Healer or
  // Support, and Fighter (melee) or Ranged only for damage dealers. Ships add
  // their hull type; Force users and droids get their own tag on top.
  function classesOf(def) {
    const tr = TRAITS[def.id] || [];
    const out = [];
    const role = { tank: 'tank', healer: 'healer', support: 'support' }[def.role];
    if (role) out.push(role);
    if (def.kind === 'ship') {
      if (tr.includes('fighter')) out.push('starfighter');
      if (tr.includes('bomber')) out.push('bomber');
      if (tr.includes('gunship') || tr.includes('capital')) out.push('gunship');
    } else {
      if (!role) out.push(attackStyle(def));
      if (tr.includes('jedi') || tr.includes('sith') || tr.includes('inquisitor') || tr.includes('nightsister') || def.id === 'grogu') out.push('force');
    }
    if (tr.includes('droid')) out.push('droid');
    return out;
  }

  // How a character attacks on the battlefield, whatever its role.
  function attackStyle(def) {
    return MELEE.includes(def.id) ? 'fighter' : 'ranged';
  }

  // Signature animation for each unit's ultimate (see battle-ui superMove).
  const ULT_ANIM = {
    rebel_soldier: 'barrage', stormtrooper: 'barrage', battle_droid: 'barrage', tusken_raider: 'barrage', death_trooper: 'barrage', clone_trooper: 'bulwark',
    han_solo: 'snipe', din_djarin: 'snipe', chewbacca: 'roar', leia: 'rally', jawa: 'rally', r2d2: 'heal', ewok_warrior: 'heal', grogu: 'heal',
    obi_wan: 'leap', rey: 'leap', mace_windu: 'leap', luke: 'saberthrow', yoda: 'forcepush', boba_fett: 'rockets', tarkin: 'orbital', thrawn: 'orbital',
    darth_maul: 'dash', ahsoka: 'dash', grievous: 'whirl', kylo_ren: 'choke', vader: 'choke', lord_vader: 'choke', count_dooku: 'lightning', palpatine: 'lightning',
    a_wing: 'strafe', x_wing: 'torpedo', z95: 'strafe', tie_fighter: 'strafe', tie_interceptor: 'strafe', tie_advanced: 'strafe', falcon: 'strafe',
    y_wing: 'shield', lambda_shuttle: 'shield', b_wing: 'broadside', razor_crest: 'broadside', tie_bomber: 'bombrun', slave_one: 'bombrun',
    c3po: 'rally', bb8: 'dash', k2so: 'leap', chopper: 'heal', ig88: 'rockets', droideka: 'bulwark', b2_droid: 'barrage', magnaguard: 'dash', ig11: 'barrage', vulture_droid: 'strafe',
    rebel_medic: 'heal', two_onebee: 'heal', nightsister_acolyte: 'heal', barriss: 'heal', talzin: 'lightning', hunter: 'dash', wrecker: 'rockets', tech: 'rally', crosshair: 'snipe', echo: 'lightning',
    grand_inquisitor: 'saberstorm', second_sister: 'spinsaber', fifth_brother: 'leap', seventh_sister: 'rockets', eighth_brother: 'spinsaber',
    cal_kestis: 'spinsaber', bo_katan: 'dash', sabine: 'rockets', captain_rex: 'bulwark', hondo: 'rally', savage_opress: 'whirl', u_wing: 'rally', upsilon_shuttle: 'shield', hounds_tooth: 'torpedo',
    arc_170: 'strafe', delta7: 'shield', tie_defender: 'strafe', tie_silencer: 'strafe', the_daughter: 'heal', temple_guardian: 'bulwark', the_son: 'lightning', darth_bane: 'lightning', ebon_hawk: 'shield', sith_fury: 'strafe', boss_daughter: 'heal', boss_guardian: 'bulwark', boss_son: 'lightning', boss_bane: 'lightning',
    anakin: 'leap', qui_gon: 'forcepush', padme: 'snipe', lando: 'rally', jango_fett: 'rockets', asajj_ventress: 'dash', cad_bane: 'snipe', moff_gideon: 'orbital', n1_starfighter: 'strafe', sith_infiltrator: 'bombrun',
    darth_revan: 'dash', starkiller: 'lightning', master_luke: 'heal', ghost: 'strafe',
    rancor: 'claws', krayt_dragon: 'claws', star_destroyer: 'turbolaser', death_star: 'superlaser',
  };

  // Every unit has a rare 4% chance to strike twice; synergies raise it.
  const BASE_DOUBLE = 0.04;

  // `scope: 'trait'` buffs only the units with the trait, `'all'` buffs the whole squad.
  const SYNERGIES = [
    { trait: 'inquisitor', name: 'The Inquisitorius', scope: 'trait', tiers: [
      { n: 2, mods: { atk: 0.1, lifesteal: 0.08 }, desc: 'Inquisitors gain +10% attack and 8% lifesteal.' },
      { n: 3, mods: { atk: 0.15, lifesteal: 0.12, crit: 0.1 }, desc: 'Inquisitors gain +15% attack, 12% lifesteal and +10% crit chance.' },
      { n: 5, mods: { atk: 0.25, lifesteal: 0.18, crit: 0.15, double: 0.2, tmStart: 30 }, desc: 'The full Inquisitorius: +25% attack, 18% lifesteal, +15% crit, +20% double hit and a 30% Turn Meter head start.' }] },
    { trait: 'badbatch', name: 'Clone Force 99', scope: 'trait', tiers: [
      { n: 2, mods: { atk: 0.1 }, desc: 'Bad Batch members gain +10% attack.' },
      { n: 3, mods: { atk: 0.15, crit: 0.1 }, desc: 'Bad Batch members gain +15% attack and +10% crit chance.' },
      { n: 5, mods: { atk: 0.25, crit: 0.15, double: 0.2, spd: 0.15, regen: 0.03 }, desc: 'The full Bad Batch: +25% attack, +15% crit, +20% double hit, +15% speed and 3% healing each turn.' }] },
    { trait: 'nightsister', name: 'Witches of Dathomir', scope: 'all', tiers: [
      { n: 2, mods: { lifesteal: 0.1, regen: 0.03 }, desc: 'Whole squad gains 10% lifesteal and heals 3% each turn.' }] },
    { trait: 'jedi', name: 'Jedi Order', scope: 'trait', tiers: [
      { n: 2, mods: { crit: 0.1 }, desc: 'Jedi gain +10% crit chance.' },
      { n: 3, mods: { crit: 0.2, regen: 0.03 }, desc: 'Jedi gain +20% crit chance and heal 3% each turn.' }] },
    { trait: 'sith', name: 'Rule of Two', scope: 'trait', tiers: [
      { n: 2, mods: { double: 0.14, lifesteal: 0.12 }, desc: 'Sith gain +14% double-hit chance and 12% lifesteal.' },
      { n: 3, mods: { double: 0.2, lifesteal: 0.18, atk: 0.1 }, desc: 'Sith gain +20% double hit, 18% lifesteal and +10% attack.' }] },
    { trait: 'rebel', name: 'Rebellion', scope: 'trait', tiers: [
      { n: 2, mods: { spd: 0.08 }, desc: 'Rebels gain +8% speed.' },
      { n: 3, mods: { spd: 0.15, atk: 0.06 }, desc: 'Rebels gain +15% speed and +6% attack.' }] },
    { trait: 'empire', name: 'Imperial Might', scope: 'trait', tiers: [
      { n: 2, mods: { def: 0.15 }, desc: 'Imperials gain +15% armor.' },
      { n: 3, mods: { def: 0.3, hp: 0.06 }, desc: 'Imperials gain +30% armor and +6% health.' }] },
    { trait: 'republic', name: 'Grand Army', scope: 'all', tiers: [
      { n: 2, mods: { hp: 0.06, def: 0.06 }, desc: 'Whole squad gains +6% health and armor.' }] },
    { trait: 'separatist', name: 'Separatist Alliance', scope: 'all', tiers: [
      { n: 2, mods: { atk: 0.08 }, desc: 'Whole squad gains +8% attack.' },
      { n: 3, mods: { atk: 0.15 }, desc: 'Whole squad gains +15% attack.' }] },
    { trait: 'scoundrel', name: 'Lucky Shots', scope: 'trait', tiers: [
      { n: 2, mods: { double: 0.16, crit: 0.05 }, desc: 'Scoundrels gain +16% double-hit and +5% crit chance.' }] },
    { trait: 'bounty', name: 'Bounty Hunters', scope: 'trait', tiers: [
      { n: 2, mods: { critDmg: 0.35, crit: 0.08 }, desc: 'Bounty Hunters gain +8% crit chance and +35% crit damage. +20% credits on victory.' }] },
    { trait: 'droid', name: 'Droid Network', scope: 'trait', tiers: [
      { n: 2, mods: { tmStart: 35, def: 0.1 }, desc: 'Droids start with +35% Turn Meter and +10% armor.' },
      { n: 3, mods: { tmStart: 45, def: 0.15, double: 0.08 }, desc: 'Droids start with +45% Turn Meter, +15% armor and +8% double-hit chance.' },
      { n: 4, mods: { tmStart: 55, def: 0.2, double: 0.12, atk: 0.12 }, desc: 'Droid uprising: +55% Turn Meter, +20% armor, +12% double hit and +12% attack.' }] },
    { trait: 'trooper', name: 'Squad Tactics', scope: 'trait', tiers: [
      { n: 2, mods: { hp: 0.12 }, desc: 'Troopers gain +12% health.' },
      { n: 3, mods: { hp: 0.25, def: 0.1 }, desc: 'Troopers gain +25% health and +10% armor.' }] },
    { trait: 'native', name: 'Home Turf', scope: 'trait', tiers: [
      { n: 2, mods: { spd: 0.12, atk: 0.1 }, desc: 'Natives gain +12% speed and +10% attack.' }] },
    { trait: 'leader', name: 'Chain of Command', scope: 'all', tiers: [
      { n: 1, mods: { atk: 0.05, def: 0.05 }, desc: 'A leader gives the whole squad +5% attack and armor.' },
      { n: 2, mods: { atk: 0.1, def: 0.1 }, desc: 'Two leaders give the whole squad +10% attack and armor.' }] },
    { trait: 'fighter', name: 'Fighter Wing', scope: 'trait', tiers: [
      { n: 2, mods: { spd: 0.1, double: 0.08 }, desc: 'Fighters gain +10% speed and +8% double-hit chance.' },
      { n: 3, mods: { spd: 0.18, double: 0.14 }, desc: 'Fighters gain +18% speed and +14% double-hit chance.' }] },
    { trait: 'bomber', name: 'Bombing Run', scope: 'trait', tiers: [
      { n: 2, mods: { atk: 0.2 }, desc: 'Bombers gain +20% attack.' }] },
    { trait: 'gunship', name: 'Heavy Hulls', scope: 'trait', tiers: [
      { n: 2, mods: { hp: 0.2, def: 0.1 }, desc: 'Gunships gain +20% health and +10% armor.' }] },
  ];

  // Role-based synergies (not traits): healers, tanks and damage dealers.
  const ROLE_SYNERGIES = [
    { role: 'healer', name: 'Medical Corps', icon: '✚', scope: 'all', tiers: [
      { n: 2, mods: { regen: 0.03 }, desc: 'Two healers: the whole squad heals 3% each turn.' },
      { n: 3, mods: { regen: 0.05, def: 0.08 }, desc: 'Three healers: the whole squad heals 5% each turn and gains +8% armor.' }] },
    { role: 'tank', name: 'Iron Wall', icon: '⛨', scope: 'role', tiers: [
      { n: 2, mods: { def: 0.15, hp: 0.08 }, desc: 'Two tanks: tanks gain +15% armor and +8% health.' }] },
    { role: 'attacker', name: 'Strike Team', icon: '⚔', scope: 'role', tiers: [
      { n: 3, mods: { crit: 0.1, atk: 0.06 }, desc: 'Three damage dealers: they gain +10% crit chance and +6% attack.' }] },
  ];

  // Colors used by the synergy activation banners.
  const SYN_THEME = {
    droid: '#ffb03a', sith: '#ff2a2a', jedi: '#5ab4ff', rebel: '#ff8a4a', empire: '#b8c2cc', republic: '#8fd3ff', separatist: '#6a8aff',
    scoundrel: '#ffd23f', bounty: '#9fe07a', trooper: '#e6ecf5', native: '#8aa04a', leader: '#ffd23f', fighter: '#8fd3ff', bomber: '#ff9a3a',
    gunship: '#b8c2cc', badbatch: '#3b8bff', inquisitor: '#ff2a2a', nightsister: '#4ade80', healer: '#52e08a', tank: '#8fd3ff', attacker: '#ff6b6b', unity_light: '#ffe08a', unity_dark: '#ff3a3a', formation: '#8fd3ff', terrain: '#52e08a',
  };

  // ---------- Planets ----------
  // Each planet is its own campaign with a living battlefield, a terrain
  // bonus that favors certain traits (for both sides) and a periodic hazard.
  const G = 'character';
  const F = 'ship';
  const st = (name, kind, level, enemies) => ({ name, kind, level, enemies });
  const PLANETS = [
    {
      id: 'tatooine', name: 'Tatooine', region: 'Outer Rim', enemyScale: 0.8, env: 'desert', reinforce: { character: ['jawa'], ship: ['tie_fighter'] }, map: { x: 8, y: 64 }, color: '#e0a060',
      blurb: 'A harsh desert world under twin suns, run by Hutts and haunted by Tusken Raiders.',
      terrain: { name: 'Twin Suns', desc: 'Natives, Scoundrels and Bounty Hunters gain +15% attack.', rules: [{ traits: ['native', 'scoundrel', 'bounty'], mods: { atk: 0.15 } }] },
      hazard: { id: 'sandstorm', name: 'Sandstorm', every: 9, desc: 'Every 9 turns a sandstorm drains 20% Turn Meter from everyone except Natives.', effect: { type: 'tm', amount: -20, except: ['native'] } },
      stages: [
        st('Jundland Wastes', G, 1, ['jawa', 'jawa', 'battle_droid']),
        st('Tatooine Orbit', F, 1, ['tie_fighter', 'tie_fighter']),
        st('Mos Eisley Streets', G, 2, ['stormtrooper', 'battle_droid', 'jawa']),
        st('Docking Bay 94', F, 3, ['tie_fighter', 'tie_fighter', 'tie_bomber']),
        st('Dune Sea Ambush', G, 4, ['tusken_raider', 'stormtrooper', 'battle_droid']),
        st('Jabba\'s Palace', G, 5, ['boba_fett', 'battle_droid', 'jawa']),
      ],
    },
    {
      id: 'hoth', name: 'Hoth', region: 'Anoat Sector', enemyScale: 0.88, env: 'snow', reinforce: { character: ['stormtrooper'], ship: ['tie_fighter'] }, map: { x: 18, y: 30 }, color: '#cfe4f5',
      blurb: 'A frozen wasteland hiding the Rebel Echo Base, where AT-ATs march through the snow.',
      terrain: { name: 'Frozen Wastes', desc: 'Everyone is 8% slower. Rebels gain +15% armor.', rules: [{ mods: { spd: -0.08 } }, { traits: ['rebel'], mods: { def: 0.15 } }] },
      hazard: { id: 'blizzard', name: 'Blizzard', every: 8, desc: 'Every 8 turns a blizzard deals 5% max HP to everyone except Rebels.', effect: { type: 'damage', pct: 0.05, except: ['rebel'] } },
      stages: [
        st('Echo Base Perimeter', G, 4, ['stormtrooper', 'stormtrooper', 'stormtrooper']),
        st('Ion Cannon Cover', F, 5, ['tie_fighter', 'tie_bomber', 'tie_fighter']),
        st('Frozen Trenches', G, 5, ['death_trooper', 'stormtrooper', 'stormtrooper']),
        st('Hangar Breach', G, 6, ['death_trooper', 'stormtrooper', 'tarkin']),
        st('Asteroid Field', F, 7, ['tie_interceptor', 'tie_fighter', 'tie_fighter']),
        st('Imperial Assault', G, 8, ['death_trooper', 'death_trooper', 'tarkin', 'stormtrooper']),
      ],
    },
    {
      id: 'dagobah', name: 'Dagobah', region: 'Sluis Sector', env: 'swamp', reinforce: { character: ['battle_droid', 'jawa'], ship: ['vulture_droid'] }, map: { x: 30, y: 70 }, color: '#6f9a5a',
      blurb: 'A misty swamp world strong with the Force, where a Jedi Master hides in exile.',
      terrain: { name: 'Strong with the Force', desc: 'Jedi heal 4% each turn and Sith gain +15% attack.', rules: [{ traits: ['jedi'], mods: { regen: 0.04 } }, { traits: ['sith'], mods: { atk: 0.15 } }] },
      hazard: { id: 'vision', name: 'Force Vision', every: 9, desc: 'Every 9 turns a Force vision heals every Light Side unit 10%.', effect: { type: 'heal', pct: 0.1, faction: 'light' } },
      stages: [
        st('Swamp Landing', F, 6, ['tie_fighter', 'tie_fighter', 'tie_fighter']),
        st('Separatist Scouts', G, 7, ['battle_droid', 'b2_droid', 'battle_droid', 'battle_droid']),
        st('Cave of Evil', G, 8, ['kylo_ren', 'battle_droid', 'battle_droid']),
        st('Mist Hunters', G, 9, ['boba_fett', 'ig88', 'battle_droid', 'battle_droid']),
        st('Orbital Blockade', F, 9, ['tie_bomber', 'tie_interceptor', 'tie_fighter']),
        st('Trial of the Jedi', G, 10, ['count_dooku', 'darth_maul']),
      ],
    },
    {
      id: 'bespin', name: 'Bespin', region: 'Anoat Sector', env: 'clouds', reinforce: { character: ['stormtrooper', 'jawa'], ship: ['tie_fighter', 'tie_bomber'] }, map: { x: 40, y: 22 }, color: '#f0a070',
      blurb: 'A gas giant with Cloud City floating in its sunset sky, a haven for smugglers and bounty hunters.',
      terrain: { name: 'Cloud City', desc: 'Bounty Hunters and Imperials gain +12% crit chance.', rules: [{ traits: ['bounty', 'empire'], mods: { crit: 0.12 } }] },
      hazard: { id: 'carbonite', name: 'Carbonite Leak', every: 10, desc: 'Every 10 turns a carbonite leak freezes (Stuns) one random unit.', effect: { type: 'stun', count: 1 } },
      stages: [
        st('Cloud Car Patrol', F, 8, ['tie_fighter', 'tie_interceptor']),
        st('Landing Platform', G, 9, ['stormtrooper', 'stormtrooper', 'boba_fett']),
        st('Carbon-Freezing Chamber', G, 10, ['boba_fett', 'stormtrooper', 'stormtrooper', 'tarkin']),
        st('Tibanna Refinery', G, 11, ['death_trooper', 'jawa', 'boba_fett', 'battle_droid']),
        st('Slave I Pursuit', F, 11, ['slave_one', 'tie_fighter', 'tie_fighter']),
        st('Reactor Shaft Duel', G, 12, ['vader', 'stormtrooper', 'boba_fett']),
      ],
    },
    {
      id: 'endor', name: 'Endor', region: 'Moddell Sector', env: 'forest', reinforce: { character: ['stormtrooper'], ship: ['tie_fighter'] }, map: { x: 52, y: 60 }, color: '#4f8a4a',
      blurb: 'A forest moon of towering trees, guarded by an Imperial shield generator and very angry Ewoks.',
      terrain: { name: 'Forest Moon', desc: 'Natives gain +25% attack and speed. Rebels gain +10% armor.', rules: [{ traits: ['native'], mods: { atk: 0.25, spd: 0.25 } }, { traits: ['rebel'], mods: { def: 0.1 } }] },
      hazard: { id: 'traps', name: 'Ewok Traps', every: 8, desc: 'Every 8 turns Ewok traps deal 8% max HP to two random non-Native units.', effect: { type: 'damage', pct: 0.08, count: 2, except: ['native'] } },
      stages: [
        st('Speeder Chase', G, 10, ['stormtrooper', 'stormtrooper', 'stormtrooper', 'stormtrooper']),
        st('Shield Bunker', G, 11, ['death_trooper', 'stormtrooper', 'stormtrooper', 'tarkin']),
        st('Forest Ambush', G, 12, ['stormtrooper', 'death_trooper', 'death_trooper']),
        st('Death Star II Approach', F, 12, ['tie_interceptor', 'tie_fighter', 'tie_fighter']),
        st('Battle of Endor', F, 13, ['tie_interceptor', 'tie_fighter', 'lambda_shuttle']),
        st('Imperial Garrison', G, 14, ['thrawn', 'death_trooper', 'stormtrooper', 'stormtrooper']),
      ],
    },
    {
      id: 'scarif', name: 'Scarif', region: 'Abrion Sector', env: 'beach', reinforce: { character: ['stormtrooper', 'death_trooper'], ship: ['tie_fighter', 'tie_bomber'] }, map: { x: 62, y: 32 }, color: '#46b8d8',
      blurb: 'A tropical fortress world behind a planetary shield gate, where the Death Star plans are kept.',
      terrain: { name: 'Shield Gate', desc: 'Imperials gain +15% armor. Every ship gains +10% attack.', rules: [{ traits: ['empire'], mods: { def: 0.15 } }, { kind: 'ship', mods: { atk: 0.1 } }] },
      hazard: { id: 'orbital', name: 'Orbital Strike', every: 8, desc: 'Every 8 turns an orbital strike deals 10% max HP to one random unit.', effect: { type: 'damage', pct: 0.1, count: 1 } },
      stages: [
        st('Shield Gate', F, 12, ['tie_interceptor', 'tie_fighter', 'tie_bomber']),
        st('Beach Landing', G, 13, ['death_trooper', 'death_trooper', 'stormtrooper', 'stormtrooper']),
        st('Citadel Tower', G, 14, ['tarkin', 'death_trooper', 'death_trooper', 'stormtrooper']),
        st('Data Vault', G, 15, ['thrawn', 'death_trooper', 'boba_fett']),
        st('Hammerhead Push', F, 15, ['tie_bomber', 'tie_interceptor', 'tie_fighter']),
        st('The Last Transmission', G, 16, ['vader', 'death_trooper', 'death_trooper', 'tarkin']),
      ],
    },
    {
      id: 'coruscant', name: 'Coruscant', region: 'Core Worlds', env: 'city', reinforce: { character: ['battle_droid', 'stormtrooper'], ship: ['tie_fighter', 'tie_interceptor'] }, map: { x: 72, y: 16 }, color: '#b07ad8',
      blurb: 'A planet-wide city and the seat of galactic power, glittering with endless traffic.',
      terrain: { name: 'Galactic Capital', desc: 'Republic units, Troopers and Leaders gain +10% attack and health.', rules: [{ traits: ['republic', 'trooper', 'leader'], mods: { atk: 0.1, hp: 0.1 } }] },
      hazard: { id: 'traffic', name: 'Speeder Rush', every: 7, desc: 'Every 7 turns a rush of traffic gives everyone +15% Turn Meter.', effect: { type: 'tm', amount: 15 } },
      stages: [
        st('Senate Landing', F, 14, ['tie_interceptor', 'tie_interceptor', 'slave_one']),
        st('Lower Levels', G, 15, ['grievous', 'droideka', 'battle_droid', 'b2_droid']),
        st('Jedi Temple Siege', G, 16, ['vader', 'stormtrooper', 'stormtrooper', 'death_trooper']),
        st('Senate Chamber', G, 17, ['palpatine', 'count_dooku']),
        st('Orbital Battle', F, 17, ['tie_advanced', 'slave_one', 'tie_interceptor']),
        st('Chancellor\'s Office', G, 18, ['palpatine', 'grievous', 'count_dooku', 'darth_maul']),
      ],
    },
    {
      id: 'geonosis', name: 'Geonosis', region: 'Arkanis Sector', env: 'canyon', reinforce: { character: ['b2_droid', 'battle_droid'], ship: ['vulture_droid'] }, map: { x: 80, y: 54 }, color: '#d9773a',
      blurb: 'A rust-red world of rock spires and droid foundries, home of the infamous execution arena.',
      terrain: { name: 'Droid Foundries', desc: 'Droids and Separatists gain +15% health and armor.', rules: [{ traits: ['droid', 'separatist'], mods: { hp: 0.15, def: 0.15 } }] },
      hazard: { id: 'swarm', name: 'Geonosian Swarm', every: 8, desc: 'Every 8 turns a winged swarm deals 7% max HP to two random non-Droid units.', effect: { type: 'damage', pct: 0.07, count: 2, except: ['droid'] } },
      stages: [
        st('Foundry Skies', F, 17, ['vulture_droid', 'vulture_droid', 'tie_interceptor', 'vulture_droid']),
        st('Droid Foundry', G, 18, ['b2_droid', 'droideka', 'grievous', 'battle_droid', 'magnaguard']),
        st('Execution Arena', G, 19, ['count_dooku', 'battle_droid', 'battle_droid', 'tusken_raider', 'jawa']),
        st('Canyon Run', F, 19, ['slave_one', 'tie_interceptor', 'tie_fighter', 'tie_bomber']),
        st('Hive Spires', G, 20, ['grievous', 'count_dooku', 'magnaguard', 'magnaguard', 'droideka']),
        st('The Separatist War Room', G, 21, ['grievous', 'count_dooku', 'darth_maul', 'battle_droid', 'battle_droid']),
      ],
    },
    {
      id: 'mustafar', name: 'Mustafar', region: 'Outer Rim', env: 'lava', reinforce: { character: ['battle_droid', 'death_trooper'], ship: ['tie_interceptor', 'tie_fighter'] }, map: { x: 90, y: 70 }, color: '#e04a2a',
      blurb: 'A volcanic hellscape of lava rivers and ash, where the dark side is at its strongest.',
      terrain: { name: 'Lava Fields', desc: 'Sith gain +25% attack. Everyone else loses 8% health.', rules: [{ traits: ['sith'], mods: { atk: 0.25 } }, { notTraits: ['sith'], mods: { hp: -0.08 } }] },
      hazard: { id: 'eruption', name: 'Eruption', every: 8, desc: 'Every 8 turns a volcano erupts: 6% max HP to all non-Sith units, with a 30% chance to Burn.', effect: { type: 'damage', pct: 0.06, except: ['sith'], burn: 0.3 } },
      stages: [
        st('Lava Approach', F, 20, ['tie_advanced', 'tie_interceptor', 'tie_interceptor']),
        st('Mining Facility', G, 21, ['grievous', 'count_dooku', 'magnaguard', 'droideka']),
        st('Separatist Council', G, 22, ['grievous', 'count_dooku', 'battle_droid', 'death_trooper']),
        st('River of Fire', G, 23, ['kylo_ren', 'darth_maul', 'death_trooper']),
        st('Fortress Skies', F, 24, ['tie_advanced', 'slave_one', 'lambda_shuttle']),
        st('Heart of the Dark Side', G, 25, ['palpatine', 'vader', 'kylo_ren', 'darth_maul']),
      ],
    },
    {
      id: 'exegol', name: 'Exegol', region: 'Unknown Regions', env: 'storm', reinforce: { character: ['death_trooper', 'stormtrooper'], ship: ['tie_interceptor', 'tie_advanced'] }, map: { x: 94, y: 28 }, color: '#7a6aff',
      blurb: 'A hidden Sith world wrapped in endless lightning storms, where the Sith Eternal build their final fleet.',
      terrain: { name: 'Sith Eternal', desc: 'Sith gain +20% attack and +10% crit chance. Light Side units are 8% slower.', rules: [{ traits: ['sith'], mods: { atk: 0.2, crit: 0.1 } }, { faction: 'light', mods: { spd: -0.08 } }] },
      hazard: { id: 'lightning', name: 'Sith Lightning Storm', every: 7, desc: 'Every 7 turns lightning strikes: 7% max HP to all non-Sith units, with a 20% chance to Stun.', effect: { type: 'damage', pct: 0.07, except: ['sith'], stun: 0.2 } },
      stages: [
        st('Navigator Beacon', F, 25, ['tie_advanced', 'tie_interceptor', 'tie_interceptor', 'tie_bomber', 'lambda_shuttle']),
        st('Sith Citadel Gates', G, 26, ['death_trooper', 'death_trooper', 'kylo_ren', 'stormtrooper', 'thrawn']),
        st('Hall of the Sith', G, 27, ['vader', 'darth_maul', 'count_dooku', 'death_trooper', 'death_trooper']),
        st('Final Order Fleet', F, 28, ['tie_advanced', 'slave_one', 'tie_interceptor', 'tie_interceptor', 'lambda_shuttle']),
        st('Throne of the Sith', G, 29, ['palpatine', 'thrawn', 'grievous', 'kylo_ren', 'death_trooper']),
        st('Duel of the Fates', G, 30, ['palpatine', 'vader', 'darth_maul', 'kylo_ren', 'count_dooku']),
      ],
    },
    {
      id: 'coruscant_siege', name: 'Battle of Coruscant', region: 'Core Worlds', env: 'siege', enemyScale: 1.25, reinforce: { character: ['b2_droid', 'battle_droid'], ship: ['vulture_droid'] }, map: { x: 62, y: 80 }, color: '#ff7a3a',
      blurb: 'The capital burns. Warships fill the skies above the city-world as the Separatists strike, and the Republic falls into Order 66.',
      terrain: { name: 'Battle-Scarred Skies', desc: 'Separatists, Troopers and Inquisitors gain +12% attack. Everyone gains +8% crit chance.', rules: [{ traits: ['separatist', 'trooper', 'inquisitor'], mods: { atk: 0.12 } }, { mods: { crit: 0.08 } }] },
      hazard: { id: 'debris', name: 'Falling Wreckage', every: 7, desc: 'Every 7 turns burning starship wreckage falls: 8% max HP to two random units, with a 40% chance to Burn.', effect: { type: 'damage', pct: 0.08, count: 2, burn: 0.4 } },
      stages: [
        st('Skyline Dogfight', F, 25, ['vulture_droid', 'vulture_droid', 'tie_interceptor', 'vulture_droid', 'slave_one']),
        st('Senate District Landing', G, 25, ['b2_droid', 'droideka', 'battle_droid', 'magnaguard', 'battle_droid']),
        st('Burning Spires', G, 26, ['grievous', 'magnaguard', 'magnaguard', 'b2_droid', 'droideka']),
        st('Boarding the Invisible Hand', F, 26, ['vulture_droid', 'tie_advanced', 'slave_one', 'vulture_droid', 'lambda_shuttle']),
        st('Order 66: Temple Steps', G, 27, ['vader', 'clone_trooper', 'clone_trooper', 'clone_trooper', 'death_trooper']),
        st('Temple Archives', G, 27, ['vader', 'grand_inquisitor', 'second_sister', 'clone_trooper', 'clone_trooper']),
        st('Orbital Barrage', F, 28, ['tie_advanced', 'tie_interceptor', 'tie_interceptor', 'slave_one', 'vulture_droid']),
        st('The Works', G, 28, ['fifth_brother', 'seventh_sister', 'eighth_brother', 'death_trooper', 'death_trooper']),
        st('Senate Rotunda', G, 29, ['palpatine', 'count_dooku', 'grand_inquisitor', 'magnaguard', 'magnaguard']),
        st('Fall of the Republic', G, 30, ['palpatine', 'vader', 'grievous', 'count_dooku', 'grand_inquisitor']),
      ],
    },
  ];
  const PLANET_MAP = Object.fromEntries(PLANETS.map((p) => [p.id, p]));

  // ---------- The hidden zone ----------
  // Not on the Galaxy Map: reached only through a secret. Four bosses, each
  // guarding exclusive cards that cannot be found anywhere else.
  const SECRET_PLANET = {
    id: 'mortis', name: 'The Monolith', region: 'Beyond the Map', env: 'mortis', enemyScale: 1.1, color: '#c8a8ff', hidden: true,
    reinforce: { character: ['clone_trooper'], ship: ['tie_fighter'] }, map: { x: 50, y: 50 }, stages: [],
    blurb: 'A world outside time where light and dark are kept in balance.',
    terrain: { name: 'The Balance', desc: 'Jedi and Sith gain +12% attack; everyone gains +8% health.', rules: [{ traits: ['jedi', 'sith'], mods: { atk: 0.12 } }, { all: true, mods: { hp: 0.08 } }] },
    hazard: { id: 'mortis', name: 'Shifting Balance', every: 6, desc: 'Every 6 turns the balance shifts, dealing 6% max HP to everyone.', effect: { type: 'damage', pct: 0.06 } },
  };
  PLANET_MAP.mortis = SECRET_PLANET;
  // Each trial unlocks with account level and campaign progress (and the
  // later two need the earlier trial on their side), so the exclusive cards
  // arrive as the player grows instead of all at once.
  const SECRET_BOSSES = [
    { id: 'boss_daughter', name: 'Trial of Light', side: 'light', kind: 'character', level: 9, req: { level: 5, planet: 'tatooine' }, minions: ['barriss', 'rebel_medic', 'ewok_warrior', 'grogu'], rewards: ['the_daughter'], hint: 'A radiance that heals what it touches waits where no star chart reaches.' },
    { id: 'boss_guardian', name: 'The Sealed Temple', side: 'light', kind: 'character', level: 20, req: { level: 14, planet: 'endor', trial: 'boss_daughter' }, minions: ['clone_trooper', 'qui_gon', 'obi_wan', 'clone_trooper'], rewards: ['temple_guardian', 'ebon_hawk'], hint: 'A masked sentinel has kept one door shut for a thousand years.' },
    { id: 'boss_son', name: 'Trial of Shadow', side: 'dark', kind: 'character', level: 14, req: { level: 9, planet: 'dagobah' }, minions: ['nightsister_acolyte', 'talzin', 'asajj_ventress', 'darth_maul'], rewards: ['the_son'], hint: 'A darkness that feeds on fear is waiting for someone to open the way.' },
    { id: 'boss_bane', name: 'The Rule of Two', side: 'dark', kind: 'character', level: 27, req: { level: 20, planet: 'geonosis', trial: 'boss_son' }, minions: ['count_dooku', 'death_trooper', 'vader', 'death_trooper'], rewards: ['darth_bane', 'sith_fury'], hint: 'An armored master of an ancient order hoards a ship with folded wings.' },
  ];
  // The trials pay in cards only. The first attempt is free; every loss makes
  // the next entry cost more Kyber: 5, 10, 15, 20, 25, then 50 for good.
  const SECRET_COSTS = [0, 3, 5, 8, 10, 15, 25];
  const secretCost = (fails) => SECRET_COSTS[Math.min(fails || 0, SECRET_COSTS.length - 1)];
  // Enemies earn stars as you travel further across the galaxy.
  const enemyStars = (planetId) => 1 + Math.floor(PLANETS.indexOf(PLANET_MAP[planetId]) / 2);
  const PLANET_CLEAR_KYBER = 5;

  function stageRewards(planetId, index) {
    const planet = PLANET_MAP[planetId];
    const stage = planet.stages[index];
    return {
      credits: 120 + stage.level * 40,
      // 1 Kyber for a first clear, 2 for a world's final stage.
      firstClearCrystals: index === planet.stages.length - 1 ? 2 : 1,
    };
  }

  const traitsOf = (id) => TRAITS[id] || [];

  function addMods(into, mods) {
    for (const [k, v] of Object.entries(mods)) into[k] = (into[k] || 0) + v;
  }

  // Works out every bonus a squad gets from traits, faction unity, role
  // balance and the planet's terrain. Returns per-unit mods plus a list of
  // active bonuses (and near-misses) for the UI.
  function squadBonuses(ids, planetId) {
    const defs = ids.map((id) => UNIT_MAP[id]);
    const perUnit = defs.map(() => ({ double: BASE_DOUBLE }));
    const active = [];
    const hints = [];
    const counts = {};
    defs.forEach((d) => traitsOf(d.id).forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));

    for (const syn of SYNERGIES) {
      const n = counts[syn.trait] || 0;
      const tier = [...syn.tiers].reverse().find((t) => n >= t.n);
      const next = syn.tiers.find((t) => n < t.n);
      if (tier) {
        defs.forEach((d, i) => {
          if (syn.scope === 'all' || traitsOf(d.id).includes(syn.trait)) addMods(perUnit[i], tier.mods);
        });
        const members = defs.map((d, i) => (traitsOf(d.id).includes(syn.trait) ? i : -1)).filter((i) => i >= 0);
        active.push({ kind: 'synergy', key: syn.trait, trait: syn.trait, name: syn.name, count: n, need: tier.n, tier: syn.tiers.indexOf(tier), desc: tier.desc, icon: TRAIT_INFO[syn.trait].icon, members });
      }
      if (next && n > 0 && next.n - n === 1) {
        hints.push({ trait: syn.trait, name: syn.name, count: n, need: next.n, desc: next.desc, icon: TRAIT_INFO[syn.trait].icon });
      }
    }

    for (const rs of ROLE_SYNERGIES) {
      const members = defs.map((d, i) => (d.role === rs.role ? i : -1)).filter((i) => i >= 0);
      const n = members.length;
      const tier = [...rs.tiers].reverse().find((t) => n >= t.n);
      const next = rs.tiers.find((t) => n < t.n);
      if (tier) {
        defs.forEach((d, i) => {
          if (rs.scope === 'all' || d.role === rs.role) addMods(perUnit[i], tier.mods);
        });
        active.push({ kind: 'synergy', key: rs.role, name: rs.name, count: n, need: tier.n, tier: rs.tiers.indexOf(tier), desc: tier.desc, icon: rs.icon, members });
      }
      if (next && n > 0 && next.n - n === 1) hints.push({ role: rs.role, trait: rs.role, name: rs.name, count: n, need: next.n, desc: next.desc, icon: rs.icon });
    }

    if (defs.length >= 3) {
      const light = defs.filter((d) => d.faction === 'light').length;
      if (light === defs.length) {
        defs.forEach((d, i) => addMods(perUnit[i], { hp: 0.1, regen: 0.02 }));
        active.push({ kind: 'unity', key: 'unity_light', tier: 0, members: defs.map((d, i) => i), name: 'Light Side Unity', desc: 'All Light Side squad: +10% health and 2% healing each turn.', icon: '☀' });
      } else if (light === 0) {
        defs.forEach((d, i) => addMods(perUnit[i], { atk: 0.1, crit: 0.05 }));
        active.push({ kind: 'unity', key: 'unity_dark', tier: 0, members: defs.map((d, i) => i), name: 'Dark Side Fury', desc: 'All Dark Side squad: +10% attack and +5% crit chance.', icon: '☾' });
      }
    }

    const roles = new Set(defs.map((d) => d.role));
    if (defs[0] && defs[0].kind === 'character' && roles.has('tank') && roles.has('healer') && (roles.has('attacker') || roles.has('support'))) {
      defs.forEach((d, i) => addMods(perUnit[i], { def: 0.08 }));
      active.push({ kind: 'formation', key: 'formation', tier: 0, members: defs.map((d, i) => i), name: 'Battle Formation', desc: 'Tank, healer and damage dealer together: +8% armor for the squad.', icon: '⛨' });
    }

    const planet = PLANET_MAP[planetId];
    if (planet) {
      let touched = false;
      for (const rule of planet.terrain.rules) {
        defs.forEach((d, i) => {
          const tr = traitsOf(d.id);
          if (rule.traits && !rule.traits.some((t) => tr.includes(t))) return;
          if (rule.notTraits && rule.notTraits.some((t) => tr.includes(t))) return;
          if (rule.kind && d.kind !== rule.kind) return;
          if (rule.faction && d.faction !== rule.faction) return;
          addMods(perUnit[i], rule.mods);
          touched = true;
        });
      }
      if (touched) active.push({ kind: 'terrain', key: 'terrain', tier: 0, members: [], name: planet.terrain.name, desc: planet.terrain.desc, icon: '◉' });
    }

    return { perUnit, active, hints, counts };
  }

  const CURRENCIES = {
    credits: { name: 'Galactic Credits', short: 'Credits' },
    crystals: { name: 'Kyber Crystals', short: 'Kyber' },
    aurodium: { name: 'Aurodium Ingots', short: 'Aurodium' },
  };

  // Black market crates. `odds` are rarity weights per card.
  const PACKS = [
    {
      id: 'recruit', name: 'Astromech Delivery', desc: 'An R2 unit rolls in with 3 hero datacards', cost: { credits: 300 },
      kind: 'character', count: 3, odds: { common: 60, rare: 28, epic: 9.6, legendary: 2, mythic: 0.4 },
    },
    {
      id: 'squadron', name: 'Carbonite Block', desc: '3 ship cards frozen in carbonite for safekeeping', cost: { credits: 300 },
      kind: 'ship', count: 3, odds: { common: 55, rare: 31, epic: 10.6, legendary: 3, mythic: 0.4 },
    },
    {
      id: 'holocron', name: 'Jedi Holocron', desc: '3 cards, rare or better, kept by the Jedi Order', cost: { crystals: 50 },
      kind: 'any', count: 3, odds: { common: 0, rare: 55, epic: 33.5, legendary: 10, mythic: 1.5 },
    },
    {
      id: 'strongbox', name: 'Sith Holocron', desc: '1 guaranteed Legendary and 2 Epic-or-better cards', cost: { aurodium: 12 },
      kind: 'any', count: 3, odds: { common: 0, rare: 0, epic: 67, legendary: 30, mythic: 3 }, guarantee: 'legendary',
    },
  ];

  // Luck: every victory spins a credit multiplier; crates can drop Holo cards;
  // a pity counter guarantees a Legendary card.
  const LUCK = {
    rewardSpin: [
      { mult: 1, weight: 50 },
      { mult: 1.5, weight: 27 },
      { mult: 2, weight: 14 },
      { mult: 3, weight: 6.5 },
      { mult: 5, weight: 2.5 },
    ],
    // Loaded Dice shift weight toward the big multipliers.
    rewardSpinLoaded: [
      { mult: 1.5, weight: 40 },
      { mult: 2, weight: 32 },
      { mult: 3, weight: 18 },
      { mult: 5, weight: 8 },
      { mult: 10, weight: 2 },
    ],
    holoChance: 0.08,
    holoChanceCharmed: 0.22,
    charmOdds: { legendary: 2.5, epic: 1.6, mythic: 2 },
    pityCrates: 20,
    sabacc: [
      { mult: 0, weight: 38, label: 'Bust' },
      { mult: 0.5, weight: 20, label: 'Half' },
      { mult: 1, weight: 15, label: 'Push' },
      { mult: 2, weight: 17, label: 'Win' },
      { mult: 3, weight: 7.5, label: 'Big win' },
      { mult: 5, weight: 2, label: 'Pure Sabacc' },
      { mult: 10, weight: 0.5, label: 'Idiot\'s Array' },
    ],
    sabaccBets: [100, 500, 2000],
  };

  const CHARMS = [
    { id: 'chance_cube', name: 'Chance Cubes', desc: 'Next 3 crates: 2.5× Legendary odds, 1.6× Epic odds and more Holo cards.', cost: { crystals: 25 }, grants: { charmCrates: 3 } },
    { id: 'loaded_dice', name: 'Loaded Dice', desc: 'Next 3 victory spins roll from a luckier table (up to 10×).', cost: { credits: 700 }, grants: { dice: 3 } },
  ];

  const MARKET_REFRESH_MS = 4 * 60 * 60 * 1000;
  const FLASH_MS = 60 * 60 * 1000;

  // ---------- Endless Tower ----------
  // Infinite floors on random worlds. Every 10th floor is a boss; losing drops
  // you back to the last checkpoint (floors 1, 11, 21...) with a fresh roll.
  const TOWER = { checkpoint: 10, bossEvery: 10 };
  const TOWER_GROUPS = [
    ['grand_inquisitor', 'second_sister', 'fifth_brother', 'seventh_sister', 'eighth_brother'],
    ['hunter', 'wrecker', 'tech', 'crosshair', 'echo'],
    ['vader', 'palpatine', 'darth_maul', 'count_dooku', 'kylo_ren'],
    ['b2_droid', 'droideka', 'magnaguard', 'grievous', 'battle_droid'],
    ['boba_fett', 'din_djarin', 'ig88', 'jango_fett', 'cad_bane'],
    ['stormtrooper', 'death_trooper', 'thrawn', 'stormtrooper', 'death_trooper'],
    ['talzin', 'nightsister_acolyte', 'asajj_ventress', 'nightsister_acolyte', 'talzin'],
    ['luke', 'leia', 'han_solo', 'chewbacca', 'r2d2'],
    ['tie_advanced', 'tie_interceptor', 'tie_interceptor', 'tie_bomber', 'tie_fighter'],
    ['vulture_droid', 'vulture_droid', 'slave_one', 'vulture_droid', 'tie_advanced'],
  ];
  function seededRng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function towerFloor(floor, seed, size) {
    const r = seededRng((seed || 1) * 7919 + floor * 104729);
    const pickOf = (list) => list[Math.floor(r() * list.length)];
    const level = Math.min(MAX_LEVEL, 2 + floor);
    const stars = Math.min(MAX_STARS, 1 + Math.floor(floor / 5));
    const enemyScale = +(0.82 + floor * 0.012 + Math.max(0, floor - 28) * 0.03).toFixed(3);
    const n = Math.max(3, Math.min(5, size || 5));
    const planet = pickOf(PLANETS);
    if (floor % TOWER.bossEvery === 0) {
      const enc = pickOf(BOSS_ENCOUNTERS);
      const pool = UNITS.filter((u) => u.kind === enc.kind && !u.boss && !u.exclusive && u.faction === 'dark');
      const minions = Array.from({ length: n - 1 }, () => pickOf(pool).id);
      const half = Math.ceil(minions.length / 2);
      return { floor, kind: enc.kind, boss: enc.id, planet: enc.planet, level, stars, enemyScale, name: `${enc.name}`, enemies: [...minions.slice(0, half), enc.id, ...minions.slice(half)] };
    }
    const kind = r() < 0.3 ? 'ship' : 'character';
    const exists = (id) => UNIT_MAP[id] && UNIT_MAP[id].kind === kind;
    const groups = TOWER_GROUPS.map((g) => g.filter(exists)).filter((g) => g.length >= 3);
    let enemies;
    if (r() < 0.45 && groups.length) enemies = pickOf(groups).slice(0, n);
    else {
      const pool = UNITS.filter((u) => u.kind === kind && !u.boss && !u.exclusive);
      enemies = Array.from({ length: n }, () => pickOf(pool).id);
    }
    while (enemies.length < n) enemies.push(UNITS.filter((u) => u.kind === kind && !u.boss && !u.exclusive)[Math.floor(r() * 10)].id);
    const titles = kind === 'ship' ? ['Ambush in the Void', 'Hyperspace Interdiction', 'Blockade Run', 'Dogfight Over ' + planet.name] : ['Gauntlet on ' + planet.name, 'Hunters in the Dark', 'Last Stand', 'Skirmish on ' + planet.name, 'Kill Squad'];
    return { floor, kind, planet: planet.id, level, stars, enemyScale, name: pickOf(titles), enemies };
  }
  function towerRewards(floor) {
    const boss = floor % TOWER.bossEvery === 0;
    return {
      credits: 220 + floor * 35 + (boss ? 600 : 0),
      crystals: boss ? 2 : floor % 5 === 0 ? 1 : 0,
    };
  }
  const towerCheckpoint = (floor) => floor - ((floor - 1) % TOWER.checkpoint);

  // Daily login: a 7-day cycle that escalates, then repeats while the streak holds.
  const DAILY = [
    { day: 1, credits: 600, label: 'Credit stash' },
    { day: 2, credits: 1000, label: 'Smuggler\'s cut' },
    { day: 3, crystals: 20, label: 'Kyber shard' },
    { day: 4, credits: 1800, label: 'Spice run' },
    { day: 5, crystals: 30, dice: 1, label: 'Loaded Dice' },
    { day: 6, credits: 2500, charm: 1, label: 'Chance Cube' },
    { day: 7, crystals: 80, aurodium: 1, label: 'Hutt\'s Hoard', big: true },
  ];
  // Kyber sinks in the Night Market, priced against 1-2 Kyber per win.
  const RESTOCK_KYBER = 10;
  const EXCHANGE = { crystals: 20, credits: 1000 };
  const SHELL_PAYOUT = 2.7;
  const SHELL_BETS = [50, 150, 400];

  const STARTER = {
    credits: 600,
    crystals: 100,
    units: ['rebel_soldier', 'clone_trooper', 'ewok_warrior', 'battle_droid', 'jawa', 'a_wing', 'y_wing', 'tie_fighter', 'tie_bomber', 'z95'],
  };

  root.GameData = {
    RARITIES, ROLE_BASE, ROLE_ICONS, STATUS_INFO, UNITS, UNIT_MAP, MAX_LEVEL, MAX_STARS, STAR_COSTS,
    DUPLICATE_SHARDS, SQUAD_SIZE, PACKS, STARTER, levelCost, unitStats, power, stageRewards,
    ultimateFor, abilitiesFor, BOSSES, BOSS_ENCOUNTERS, bossRewards, CURRENCIES, LUCK, CHARMS, MARKET_REFRESH_MS, FLASH_MS, DAILY, SECRET_PLANET, SECRET_BOSSES, SECRET_COSTS, secretCost, RESTOCK_KYBER, EXCHANGE, TOWER, towerFloor, towerRewards, towerCheckpoint, SHELL_PAYOUT, SHELL_BETS, BIOS,
    BASE_SLOTS, SLOT_UNLOCKS, MAX_ACCOUNT_LEVEL, xpToNext, levelReward, XP, planetSquadSize,
    TRAITS, TRAIT_INFO, ROLE_SYNERGIES, SYN_THEME, CLASS_INFO, classesOf, attackStyle, ULT_ANIM, SYNERGIES, PLANETS, PLANET_MAP, enemyStars, PLANET_CLEAR_KYBER, BASE_DOUBLE, traitsOf, squadBonuses,
  };
})(typeof window !== 'undefined' ? window : globalThis);
