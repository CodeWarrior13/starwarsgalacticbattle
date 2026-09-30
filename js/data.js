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
    {
      id: 'rancor', name: 'The Rancor', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 120,
      boss: { hp: 7.5, atk: 1.12, def: 1.2 },
      abilities: [
        { name: 'Crushing Claw', cd: 0, target: 'enemy', effects: [dmg(1.3)], desc: 'Deal damage to one enemy.' },
        { name: 'Ground Pound', cd: 3, target: 'allEnemies', effects: [dmg(0.8), debuff('stun', 1, 0.3)], desc: 'Damage all enemies with a 30% chance to Stun.' },
        { name: 'Devour', cd: 4, target: 'enemy', effects: [dmg(2.6), { ...heal(0.08), on: 'self' }], desc: 'Deal massive damage and heal 8%.' },
      ],
      ultimate: U('Feeding Frenzy', 'allEnemies', [dmg(1.8), debuff('defDown', 2)], 'Deal heavy damage to all enemies and inflict Defense Down.', 'GRRRAAAAHHH!'),
    },
    {
      id: 'krayt_dragon', name: 'Krayt Dragon', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 125,
      boss: { hp: 7, atk: 1.05, def: 1.25 },
      abilities: [
        { name: 'Tail Lash', cd: 0, target: 'enemy', effects: [dmg(1.25), debuff('defDown', 2, 0.3)], desc: 'Deal damage with a 30% chance of Defense Down.' },
        { name: 'Acid Spit', cd: 3, target: 'allEnemies', effects: [dmg(0.8), debuff('burn', 2, 0.7)], desc: 'Damage all enemies with a 70% chance to Burn.' },
        { name: 'Burrow', cd: 4, target: 'self', effects: [heal(0.12), buff('defUp', 2)], desc: 'Dig into the sand: heal 12% and gain Defense Up.' },
      ],
      ultimate: U('Dune Sea Rampage', 'allEnemies', [dmg(1.9), debuff('stun', 1, 0.4)], 'Deal heavy damage to all enemies with a 40% chance to Stun.', 'The ground trembles...'),
    },
    {
      id: 'lord_vader', name: 'Lord Vader', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', accent: '#e23b3b', spd: 140,
      boss: { hp: 6.5, atk: 1.1, def: 1.25 },
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
    { id: 'rancor', name: 'The Rancor Pit', kind: 'character', level: 8, minions: [], unlock: { kind: 'character', stage: 3 }, place: 'Jabba\'s Palace, Tatooine' },
    { id: 'star_destroyer', name: 'Star Destroyer Assault', kind: 'ship', level: 9, minions: ['tie_fighter', 'tie_fighter'], unlock: { kind: 'ship', stage: 3 }, place: 'Outer Rim blockade' },
    { id: 'krayt_dragon', name: 'The Dune Sea', kind: 'character', level: 14, minions: ['tusken_raider', 'tusken_raider'], unlock: { kind: 'character', stage: 6 }, place: 'Dune Sea, Tatooine' },
    { id: 'death_star', name: 'That\'s No Moon', kind: 'ship', level: 16, minions: ['tie_interceptor', 'tie_fighter'], unlock: { kind: 'ship', stage: 6 }, place: 'Yavin system' },
    { id: 'lord_vader', name: 'Vader\'s Fortress', kind: 'character', level: 20, minions: ['death_trooper', 'stormtrooper'], unlock: { kind: 'character', stage: 9 }, place: 'Fortress Vader, Mustafar' },
  ];

  function bossRewards(enc, firstClear) {
    return {
      credits: 400 + enc.level * 60,
      aurodium: firstClear ? 5 : 1,
      kyber: firstClear ? 60 : 0,
      card: firstClear ? 'epic+' : null,
    };
  }


  // Flavor text shown on the back of each card.
  const BIOS = {
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
  const DUPLICATE_SHARDS = { common: 5, rare: 8, epic: 12, legendary: 20 };

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

  const CURRENCIES = {
    credits: { name: 'Galactic Credits', short: 'Credits' },
    crystals: { name: 'Kyber Crystals', short: 'Kyber' },
    aurodium: { name: 'Aurodium Ingots', short: 'Aurodium' },
  };

  // Black market crates. `odds` are rarity weights per card.
  const PACKS = [
    {
      id: 'recruit', name: 'Contraband Crate', desc: '3 character cards, smuggled in from the Outer Rim', cost: { credits: 300 },
      kind: 'character', count: 3, odds: { common: 60, rare: 28, epic: 10, legendary: 2 },
    },
    {
      id: 'squadron', name: 'Salvage Crate', desc: '3 ship cards, pulled from a starship graveyard', cost: { credits: 300 },
      kind: 'ship', count: 3, odds: { common: 55, rare: 31, epic: 11, legendary: 3 },
    },
    {
      id: 'holocron', name: 'Kyber Vault', desc: '3 cards, rare or better', cost: { crystals: 80 },
      kind: 'any', count: 3, odds: { common: 0, rare: 55, epic: 35, legendary: 10 },
    },
    {
      id: 'strongbox', name: 'Aurodium Strongbox', desc: '1 guaranteed Legendary and 2 Epic-or-better cards', cost: { aurodium: 12 },
      kind: 'any', count: 3, odds: { common: 0, rare: 0, epic: 70, legendary: 30 }, guarantee: 'legendary',
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
    charmOdds: { legendary: 2.5, epic: 1.6 },
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
    { id: 'chance_cube', name: 'Chance Cubes', desc: 'Next 3 crates: 2.5× Legendary odds, 1.6× Epic odds and more Holo cards.', cost: { crystals: 40 }, grants: { charmCrates: 3 } },
    { id: 'loaded_dice', name: 'Loaded Dice', desc: 'Next 3 victory spins roll from a luckier table (up to 10×).', cost: { credits: 700 }, grants: { dice: 3 } },
  ];

  const MARKET_REFRESH_MS = 4 * 60 * 60 * 1000;

  const STARTER = {
    credits: 600,
    crystals: 100,
    units: ['rebel_soldier', 'clone_trooper', 'ewok_warrior', 'battle_droid', 'a_wing', 'y_wing', 'tie_fighter'],
  };

  root.GameData = {
    RARITIES, ROLE_BASE, ROLE_ICONS, STATUS_INFO, UNITS, UNIT_MAP, MAX_LEVEL, MAX_STARS, STAR_COSTS,
    DUPLICATE_SHARDS, SQUAD_SIZE, CAMPAIGNS, PACKS, STARTER, levelCost, unitStats, power, stageRewards,
    ultimateFor, abilitiesFor, BOSSES, BOSS_ENCOUNTERS, bossRewards, CURRENCIES, LUCK, CHARMS, MARKET_REFRESH_MS, BIOS,
  };
})(typeof window !== 'undefined' ? window : globalThis);
