// Update 2.4: Battle Doctrines. Every common, rare and epic card brings one
// passive to its squad, themed to the character: Grind (more credits, XP or
// Kyber), Speed (Turn Meter and speed), Defense (armor, health, healing) or
// Attack. A doctrine works once per squad and in every mode. Credit and XP
// boosts from doctrines cap at +40% each.
//
// Each entry: [name, style, text, spec]
//   spec.a  ally mods: { s: scope, m: mods } (scope 'all', 'ship' or a trait)
//   spec.e  enemy mods: { s: scope, m: { atk, def, tm } } (negative numbers)
//   spec.r  rewards: { cr, crBoss, xp, ky, spin, shard }
//   spec.x  special rule handled in the battle engine (see SPECIAL below)
(function (root) {
  const D = root.GameData;
  if (!D) return;
  const on = () => !!(root.Update24 && root.Update24.on());

  const DOC = {
    rebel_soldier: ['Spark of Rebellion', 'A', 'Rebel allies +6% attack.', { a: { s: 'rebel', m: { atk: 0.06 } } }],
    clone_trooper: ['Shoulder to Shoulder', 'D', 'Trooper allies +8% armor.', { a: { s: 'trooper', m: { def: 0.08 } } }],
    ewok_warrior: ['Forest Ambush', 'S', 'The squad starts with +10% Turn Meter.', { a: { s: 'all', m: { tmStart: 10 } } }],
    stormtrooper: ['Imperial Discipline', 'D', 'Allies +6% armor.', { a: { s: 'all', m: { def: 0.06 } } }],
    battle_droid: ['Roger Roger', 'D', 'This droid starts with Taunt for its first 2 turns, drawing fire from weaker allies.', { x: 'taunt' }],
    tusken_raider: ["Sand People's Fury", 'A', 'Allies +5% crit chance.', { a: { s: 'all', m: { crit: 0.05 } } }],
    a_wing: ['Interceptor Screen', 'S', 'Fleet allies +8% speed.', { a: { s: 'ship', m: { spd: 0.08 } } }],
    y_wing: ['Ion Payload', 'S', 'Enemies start with -8% Turn Meter.', { e: { s: 'all', m: { tm: -8 } } }],
    z95: ['Scrappy Wingmen', 'G', '+10% credits from the battle.', { r: { cr: 0.1 } }],
    tie_fighter: ['Swarm Doctrine', 'A', 'Allies +3% attack for each TIE in the fleet.', { x: 'swarm' }],
    tie_bomber: ['Carpet Bomb', 'A', "Allies' area attacks deal +8% damage.", { x: 'aoe8' }],
    jawa: ['Utinni! Salvage', 'G', '+10% credits from the battle.', { r: { cr: 0.1 } }],
    b2_droid: ['Reinforced Chassis', 'D', 'Droid allies +10% health.', { a: { s: 'droid', m: { hp: 0.1 } } }],
    vulture_droid: ['Endless Production', 'G', '+8% XP from the battle.', { r: { xp: 0.08 } }],
    rebel_medic: ['Field Triage', 'D', 'Allies heal 2% of max health each turn.', { a: { s: 'all', m: { regen: 0.02 } } }],

    han_solo: ['Shoots First', 'S', 'The fastest ally starts with +20% Turn Meter.', { x: 'first' }],
    chewbacca: ['Wookiee Roar', 'D', 'Allies +8% health.', { a: { s: 'all', m: { hp: 0.08 } } }],
    leia: ['Hope', 'D', 'Each ally shrugs off the first debuff placed on them.', { x: 'hope' }],
    r2d2: ['Plucky Repairs', 'D', 'The first time each ally drops below 30% health, they get 10% back.', { x: 'r2' }],
    boba_fett: ['Bounty Contract', 'G', '+15% credits from boss battles.', { r: { crBoss: 0.15 } }],
    tarkin: ['Fear Will Keep Them in Line', 'D', 'Enemies -6% attack.', { e: { s: 'all', m: { atk: -0.06 } } }],
    x_wing: ['Lock S-foils', 'A', 'Fleet allies +6% attack and +4% crit chance.', { a: { s: 'ship', m: { atk: 0.06, crit: 0.04 } } }],
    lambda_shuttle: ['Escort Duty', 'D', 'Fleet allies +10% armor.', { a: { s: 'ship', m: { def: 0.1 } } }],
    grogu: ['Force Healing', 'D', "On each of Grogu's turns, the weakest ally heals 4%.", { x: 'grogu' }],
    death_trooper: ['Elite Escort', 'A', 'Empire allies +8% attack.', { a: { s: 'empire', m: { atk: 0.08 } } }],
    tie_interceptor: ['Fast Strike', 'S', 'Fleet allies +10% speed.', { a: { s: 'ship', m: { spd: 0.1 } } }],
    c3po: ['Six Million Forms', 'G', '+10% XP from the battle.', { r: { xp: 0.1 } }],
    chopper: ['Grumpy Fix', 'D', 'Droid allies heal 3% each turn.', { a: { s: 'droid', m: { regen: 0.03 } } }],
    droideka: ['Deflector Shield', 'D', 'Allies take 5% less damage from attacks.', { x: 'shield' }],
    magnaguard: ['Bodyguard Protocol', 'D', 'Leader allies +12% armor.', { a: { s: 'leader', m: { def: 0.12 } } }],
    two_onebee: ['Bacta Tank', 'D', 'Healing on allies +10%.', { x: 'bacta10' }],
    nightsister_acolyte: ['Dathomir Magick', 'A', 'When an ally falls, the others gain +10% ultimate charge.', { x: 'magick' }],
    padme: ['Senate Mandate', 'G', '+10% Kyber from first clears.', { r: { ky: 0.1 } }],
    lando: ["Gambler's Luck", 'G', '1 in 3 victory spins roll one step higher.', { r: { spin: 1 / 3 } }],
    n1_starfighter: ['Royal Squadron', 'S', 'Fleet allies +6% speed and +4% attack.', { a: { s: 'ship', m: { spd: 0.06, atk: 0.04 } } }],
    sabine: ['Art of War', 'A', "Allies' area attacks deal +8% damage.", { x: 'aoe8' }],
    hondo: ['Business Opportunity', 'G', '+12% credits, and a 1 in 10 chance of 5 bonus shards for a squad card.', { r: { cr: 0.12, shard: 0.1 } }],

    obi_wan: ['High Ground', 'D', 'Allies +8% armor, and the first hit each ally takes is halved.', { a: { s: 'all', m: { def: 0.08 } }, x: 'high' }],
    luke: ['New Hope', 'A', 'Rebel allies +8% attack.', { a: { s: 'rebel', m: { atk: 0.08 } } }],
    darth_maul: ['Duel of the Fates', 'A', 'Allies +6% crit chance.', { a: { s: 'all', m: { crit: 0.06 } } }],
    kylo_ren: ['Unleashed', 'A', 'Allies +2% attack every time an ally falls.', { x: 'unleashed' }],
    count_dooku: ['Separatist Command', 'A', 'Separatist allies +8% attack and speed.', { a: { s: 'separatist', m: { atk: 0.08, spd: 0.08 } } }],
    b_wing: ['Heavy Assault', 'D', 'Fleet allies +8% health.', { a: { s: 'ship', m: { hp: 0.08 } } }],
    ahsoka: ['Fulcrum', 'S', 'Allies +6% speed.', { a: { s: 'all', m: { spd: 0.06 } } }],
    din_djarin: ['This Is the Way', 'A', 'Mandalorian and Bounty Hunter allies +8% attack.', { a: { s: ['mandalorian', 'bounty'], m: { atk: 0.08 } } }],
    grievous: ['Droid Army', 'A', 'Droid allies +6% attack and +6% health.', { a: { s: 'droid', m: { atk: 0.06, hp: 0.06 } } }],
    bb8: ['Rolling Recon', 'S', 'The squad starts with +15% Turn Meter.', { a: { s: 'all', m: { tmStart: 15 } } }],
    k2so: ['Brutally Honest', 'A', 'Enemies -6% armor.', { e: { s: 'all', m: { def: -0.06 } } }],
    ig88: ['Assassin Protocol', 'A', 'Allies deal +12% damage to enemies below 30% health.', { x: 'assassin' }],
    ig11: ['Nurse Mode', 'D', 'Once per battle, when an ally drops below 40% health, the weakest ally heals 15%.', { x: 'nurse' }],
    barriss: ['Jedi Healer', 'D', 'Healing on allies +12%.', { x: 'bacta12' }],
    hunter: ['Enhanced Senses', 'A', 'Allies +6% crit chance.', { a: { s: 'all', m: { crit: 0.06 } } }],
    wrecker: ['Lift Heavy', 'D', 'Allies +10% health.', { a: { s: 'all', m: { hp: 0.1 } } }],
    tech: ['Calculated', 'G', '+10% XP from the battle, and allies +4% speed.', { r: { xp: 0.1 }, a: { s: 'all', m: { spd: 0.04 } } }],
    crosshair: ['Marksman', 'A', "Allies' single-target attacks deal +6% damage.", { x: 'marksman' }],
    echo: ['Regs Recall', 'D', 'Trooper allies shrug off the first stun.', { x: 'regs' }],
    grand_inquisitor: ['Purge Order', 'D', 'Jedi enemies -10% attack.', { e: { s: 'jedi', m: { atk: -0.1 } } }],
    second_sister: ['Relentless Hunt', 'S', 'Allies +5% speed and +3% attack.', { a: { s: 'all', m: { spd: 0.05, atk: 0.03 } } }],
    fifth_brother: ['Brute Force', 'D', 'Allies +6% armor.', { a: { s: 'all', m: { def: 0.06 } } }],
    seventh_sister: ['Probe Droids', 'S', 'Enemies start with -10% Turn Meter.', { e: { s: 'all', m: { tm: -10 } } }],
    eighth_brother: ['Spinning Blade', 'A', "Allies' area attacks deal +6% damage.", { x: 'aoe6' }],
    qui_gon: ['Living Force', 'D', 'Allies heal 2% each turn and get +4% armor.', { a: { s: 'all', m: { regen: 0.02, def: 0.04 } } }],
    jango_fett: ['The Template', 'A', 'Trooper allies +6% attack and armor.', { a: { s: 'trooper', m: { atk: 0.06, def: 0.06 } } }],
    asajj_ventress: ['Nightsister Rage', 'A', 'Allies +8% crit damage.', { a: { s: 'all', m: { critDmg: 0.08 } } }],
    cad_bane: ['Quick Draw', 'S', 'The squad starts with +12% Turn Meter and +4% crit chance.', { a: { s: 'all', m: { tmStart: 12, crit: 0.04 } } }],
    moff_gideon: ['Remnant Resources', 'G', '+12% credits from the battle.', { r: { cr: 0.12 } }],
    arc_170: ['Clone Gunners', 'A', 'Fleet allies +6% attack.', { a: { s: 'ship', m: { atk: 0.06 } } }],
    delta7: ['Jedi Escort', 'S', 'Jedi allies +8% speed.', { a: { s: 'jedi', m: { spd: 0.08 } } }],
    tie_silencer: ['First Order Ace', 'A', 'Fleet allies +6% crit chance.', { a: { s: 'ship', m: { crit: 0.06 } } }],
    cal_kestis: ['Psychometry', 'G', '+10% XP and +5% credits from the battle.', { r: { xp: 0.1, cr: 0.05 } }],
    savage_opress: ["Brother's Rage", 'D', 'Sith allies +8% health.', { a: { s: 'sith', m: { hp: 0.08 } } }],
    u_wing: ['Rogue Drop', 'S', 'The squad starts with +12% Turn Meter.', { a: { s: 'all', m: { tmStart: 12 } } }],
    upsilon_shuttle: ['Supreme Escort', 'D', 'Fleet allies +8% armor.', { a: { s: 'ship', m: { def: 0.08 } } }],
    hounds_tooth: ['Trophy Hunt', 'G', '+12% credits from boss battles.', { r: { crBoss: 0.12 } }],
    cassian_haulcraft: ['Spy Network', 'G', '+10% XP from the battle.', { r: { xp: 0.1 } }],

    // The new 2.4 cards.
    gamorrean_guard: ["Jabba's Muscle", 'D', 'Allies +6% health.', { a: { s: 'all', m: { hp: 0.06 } } }],
    snowtrooper: ['Cold Assault', 'A', 'Empire allies +5% attack.', { a: { s: 'empire', m: { atk: 0.05 } } }],
    wing_guard: ['Cloud City Tariff', 'G', '+8% credits from the battle.', { r: { cr: 0.08 } }],
    scout_trooper: ['Speeder Recon', 'S', 'The squad starts with +8% Turn Meter.', { a: { s: 'all', m: { tmStart: 8 } } }],
    shoretrooper: ['Coastal Defense', 'D', 'Trooper allies +8% health.', { a: { s: 'trooper', m: { hp: 0.08 } } }],
    cf66_trooper: ['Execute Order 66', 'A', 'Jedi enemies -6% armor.', { e: { s: 'jedi', m: { def: -0.06 } } }],
    geonosian_warrior: ['Hive Swarm', 'S', 'Separatist allies +6% speed.', { a: { s: 'separatist', m: { spd: 0.06 } } }],
    purge_trooper: ['Purge Protocol', 'A', 'Allies +4% crit chance and +4% crit damage.', { a: { s: 'all', m: { crit: 0.04, critDmg: 0.04 } } }],
    knight_of_ren: ['Knights of Ren', 'A', 'Sith allies +6% attack.', { a: { s: 'sith', m: { atk: 0.06 } } }],
    commando_droid: ['Commando Strike', 'S', 'Droid allies +6% speed.', { a: { s: 'droid', m: { spd: 0.06 } } }],
  };

  const STYLE = {
    G: { label: 'Grind', icon: '◈' },
    S: { label: 'Speed', icon: '➤' },
    D: { label: 'Defense', icon: '⛨' },
    A: { label: 'Attack', icon: '✦' },
  };
  const CAP = 0.4;

  const doctrineOf = (id) => {
    const d = on() && DOC[id];
    return d ? { id, name: d[0], style: d[1], text: d[2], spec: d[3], icon: STYLE[d[1]].icon, styleLabel: STYLE[d[1]].label } : null;
  };
  // One doctrine per card id, so two copies (or the same card twice) don't stack.
  const listFor = (ids) => [...new Set(ids || [])].map(doctrineOf).filter(Boolean);
  const inScope = (def, s) => {
    if (s === 'all') return true;
    if (s === 'ship') return def.kind === 'ship';
    const tr = D.traitsOf(def.id);
    return (Array.isArray(s) ? s : [s]).some((t) => tr.includes(t));
  };
  const addMods = (into, mods) => { for (const [k, v] of Object.entries(mods)) into[k] = (into[k] || 0) + v; };

  // Squad bonuses gain each card's doctrine (ally stat mods + an entry in the list).
  const baseBonuses = D.squadBonuses;
  D.squadBonuses = function (ids, planetId) {
    const b = baseBonuses(ids, planetId);
    if (!on()) return b;
    const defs = ids.map((id) => D.UNIT_MAP[id]);
    const tieCount = defs.filter((d) => d && d.kind === 'ship' && /^tie_/.test(d.id)).length;
    for (const doc of listFor(ids)) {
      const { a, x } = doc.spec;
      if (a) defs.forEach((d, i) => { if (d && inScope(d, a.s)) addMods(b.perUnit[i], a.m); });
      if (x === 'swarm') defs.forEach((d, i) => { if (d) addMods(b.perUnit[i], { atk: 0.03 * tieCount }); });
      b.active.push({ kind: 'doctrine', key: 'doc_' + doc.id, tier: 0, members: [ids.indexOf(doc.id)], name: doc.name, desc: `${D.UNIT_MAP[doc.id].name}: ${doc.text}`, icon: doc.icon, doctrine: doc.style });
    }
    return b;
  };

  // The battle engine asks for everything the side's doctrines do in a fight.
  function battleRules(ids) {
    const out = { foe: [], x: {} };
    for (const doc of listFor(ids)) {
      if (doc.spec.e) out.foe.push(doc.spec.e);
      if (doc.spec.x) out.x[doc.spec.x] = (out.x[doc.spec.x] || 0) + 1;
    }
    out.x.aoe = (out.x.aoe8 ? 0.08 * out.x.aoe8 : 0) + (out.x.aoe6 ? 0.06 : 0);
    out.x.heal = (out.x.bacta10 ? 0.1 : 0) + (out.x.bacta12 ? 0.12 : 0);
    out.foeOk = (def, s) => inScope(def, s);
    return out;
  }

  // Reward boosts from the player's squad, capped at +40% each.
  function rewards(ids, type) {
    const r = { cr: 0, xp: 0, ky: 0, spin: 0, shard: 0, names: [] };
    for (const doc of listFor(ids)) {
      const s = doc.spec.r;
      if (!s) continue;
      let used = false;
      if (s.cr) { r.cr += s.cr; used = true; }
      if (s.crBoss && type === 'boss') { r.cr += s.crBoss; used = true; }
      if (s.xp) { r.xp += s.xp; used = true; }
      if (s.ky) { r.ky += s.ky; used = true; }
      if (s.spin) { r.spin = Math.max(r.spin, s.spin); used = true; }
      if (s.shard) { r.shard = Math.max(r.shard, s.shard); used = true; }
      if (used) r.names.push(doc.name);
    }
    r.cr = Math.min(CAP, r.cr);
    r.xp = Math.min(CAP, r.xp);
    r.ky = Math.min(CAP, r.ky);
    return r;
  }

  D.DOCTRINES = DOC;
  D.DOCTRINE_STYLES = STYLE;
  root.Doctrines = { on, of: doctrineOf, list: listFor, battleRules, rewards, styles: STYLE };

  if (typeof document === 'undefined') return;
  const css = document.createElement('style');
  css.textContent = `.doctrine-box{margin:10px 0 2px;padding:10px 12px;border-radius:10px;border:1px solid rgba(120,170,255,.28);background:linear-gradient(180deg,rgba(40,70,130,.28),rgba(20,30,60,.2))}
.doctrine-box .dh{display:flex;align-items:center;gap:8px;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:#9fc0ff}
.doctrine-box .dh b{color:#fff;letter-spacing:.02em;text-transform:none;font-size:.95rem}
.doctrine-box .dst{margin-left:auto;padding:1px 8px;border-radius:99px;font-size:.7rem;background:rgba(255,255,255,.08)}
.doctrine-box .dst.G{color:#ffd36b}.doctrine-box .dst.S{color:#7fe3ff}.doctrine-box .dst.D{color:#8ff0a4}.doctrine-box .dst.A{color:#ff8f7a}
.doctrine-box p{margin:6px 0 0;font-size:.9rem;line-height:1.35}
.bonus.doctrine .bonus-icon,.syn-chip.doctrine{color:#9fc0ff}`;
  document.head.appendChild(css);
})(typeof window !== 'undefined' ? window : globalThis);
