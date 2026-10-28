// Update 2.3: the Dark Trooper crosses over. He stays a HoloNet card (a 1%
// drop each time your guild beats the guild raid), now Mythic, and he's the
// first HoloNet card you can also use in the main game: the campaign, bosses,
// the Endless Tower and everything else. Winning him on the HoloNet puts him
// in your main collection too. Never in crates.
(function (root) {
  'use strict';
  const D = root.GameData;
  const K = root.ArtX;
  if (!D || !K || !root.Art || !root.Battle) return;
  if (!(root.Update23 && root.Update23.on())) return;
  const ID = 'hn_dark_trooper';
  const { P, L, shade, SCENES } = K;

  // The same portrait the HoloNet draws: the black battle droid, red eye slits.
  const darkTrooper = () => SCENES.corridor()
    + P('M2 100 C6 82 22 72 50 72 C78 72 94 82 98 100Z', '#15171b') + shade('M2 100 C6 82 22 72 50 72 L46 100Z', 0.25)
    + P('M10 86 C14 76 24 72 34 74 L32 90 C24 88 16 88 10 94Z', '#23262c') + P('M90 86 C86 76 76 72 66 74 L68 90 C76 88 84 88 90 94Z', '#23262c')
    + P('M34 78 L66 78 L62 96 L38 96Z', '#1c1f24') + [82, 86, 90].map((y) => L(40, y, 60, y, '#2e3238', 1.2)).join('')
    + P('M42 66 L58 66 L56 76 L44 76Z', '#202328') + L(46, 68, 46, 75, '#33373e', 1) + L(54, 68, 54, 75, '#33373e', 1)
    + P('M35 44 C35 26 42 19 50 19 C58 19 65 26 65 44 C65 56 60 66 50 68 C40 66 35 56 35 44Z', '#1b1d22')
    + shade('M35 44 C35 26 42 19 50 19 L50 68 C40 66 35 56 35 44Z', 0.18)
    + P('M38 41 L47 44 L47 47 L38 45Z', '#ff2a1a') + P('M62 41 L53 44 L53 47 L62 45Z', '#ff2a1a')
    + `<g style="filter:drop-shadow(0 0 2px #ff3a2a)">${P('M39 42 L46 44.4 L46 45.6 L39 44Z', '#ffd0c0')}${P('M61 42 L54 44.4 L54 45.6 L61 44Z', '#ffd0c0')}</g>`
    + P('M44 52 L56 52 L54 60 L46 60Z', '#121418') + [47, 50, 53].map((x) => L(x, 53.5, x, 58.5, '#2a2d33', 0.8)).join('')
    + P('M40 24 C44 21 56 21 60 24', 'none', 'stroke="#fff" stroke-opacity=".18" stroke-width="1.2" stroke-linecap="round"')
    + L(36, 36, 41, 30, '#2e3238', 1) + L(64, 36, 59, 30, '#2e3238', 1);
  root.Art.addArt('char', ID, darkTrooper);

  const ab = (name, cd, target, effects, desc) => ({ name, cd, target, effects, desc });
  const dmg = (mult, hits) => ({ type: 'damage', mult, hits: hits || 1 });
  const buff = (status, turns) => ({ type: 'status', status, turns, chance: 1 });
  const debuff = (status, turns, chance) => ({ type: 'status', status, turns, chance: chance == null ? 1 : chance });
  const def = {
    id: ID, name: 'Dark Trooper', kind: 'character', faction: 'dark', rarity: 'mythic', role: 'tank', spd: 108, traits: ['droid'], home: 'coruscant',
    hn: true, exclusive: true, crossover: true, sig: { move: 'shockwave', prop: 'roar', impact: 'stamp', color: '#ff3a2a' },
    bio: 'A Phase III battle droid of beskar-alloy plating, built to march through blaster fire. Passive, Beskar Alloy: takes 25% less damage from attacks.',
    abilities: [
      ab('Crushing Grip', 0, 'enemy', [dmg(1.2), debuff('stun', 1, 0.25)], 'Deal damage with a 25% chance to Stun.'),
      ab('March Forward', 3, 'self', [buff('taunt', 2), buff('defUp', 2)], 'Gain Taunt and Defense Up for 2 turns.'),
      ab('Beskar Rush', 4, 'allEnemies', [dmg(0.8), debuff('defDown', 2, 0.6)], 'Charge the enemy line: damage all enemies with a 60% chance of Defense Down.'),
    ],
    ultimate: { name: 'Phase III', cd: 0, target: 'allEnemies', effects: [dmg(1.7), debuff('offDown', 2)], desc: 'A squad of Dark Troopers drops in: heavy damage to all enemies and Offense Down.', quote: '…', ultimate: true },
  };
  if (!D.UNIT_MAP[ID] || !D.UNITS.includes(D.UNIT_MAP[ID])) {
    D.UNIT_MAP[ID] = def;
    D.UNITS.push(def);
  }
  if (D.BIOS) D.BIOS[ID] = def.bio;
  if (D.TRAITS && !D.TRAITS[ID]) D.TRAITS[ID] = def.traits;

  // Passive, Beskar Alloy: 25% less damage from attacks (hazards still hurt).
  const BP = root.Battle.prototype;
  if (!BP.__dt23) {
    BP.__dt23 = true;
    const base = BP.applyDamage;
    BP.applyDamage = function (target, amount, crit, events, source) {
      if (target && target.id === ID && source !== 'hazard' && amount > 0) amount = Math.round(amount * 0.75);
      return base.call(this, target, amount, crit, events, source);
    };
  }

  // Owning him on the HoloNet means owning him in the main game too.
  const sync = () => {
    const HN = root.HN; const Player = root.Player;
    if (!HN || !Player || !Player.state || !HN.owns) return false;
    if (HN.owns(ID) && !Player.owns(ID)) { Player.grantCard(ID, false); Player.save(); }
    if (!HN.__dt23) {
      HN.__dt23 = true;
      const grant = HN.grant;
      HN.grant = function (id) {
        const r = grant.apply(this, arguments);
        if (id === ID && !Player.owns(ID)) { Player.grantCard(ID, false); Player.save(); }
        return r;
      };
    }
    return true;
  };
  // The HoloNet loads later (or not at all below its level), so keep checking quietly.
  const tick = setInterval(() => { if (sync()) clearInterval(tick); }, 3000);
  root.DarkTrooper23 = { id: ID, sync };
})(window);
