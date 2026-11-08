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
  // An Elite card leads its doctrine harder: every number in it is 25% bigger.
  const ELITE_BOOST = 1.25;
  const scale = (m, f) => { if (f === 1) return m; const o = {}; for (const [k, v] of Object.entries(m)) o[k] = v * f; return o; };
  const eliteOf = (elites, id) => (elites && elites.includes(id) ? ELITE_BOOST : 1);
  const on = () => !!(root.Update24 && root.Update24.on());

  const DOC = {
    rebel_soldier: ['Spark of Rebellion', 'A', 'Rebel allies +8% attack.', { a: { s: 'rebel', m: { atk: 0.08 } } }],
    clone_trooper: ['Shoulder to Shoulder', 'D', 'Trooper allies +12% armor and +3% health.', { a: { s: 'trooper', m: { def: 0.12, hp: 0.03 } } }],
    ewok_warrior: ['Forest Ambush', 'S', 'The squad starts with +25% Turn Meter.', { a: { s: 'all', m: { tmStart: 25 } } }],
    stormtrooper: ['Imperial Discipline', 'D', 'Allies +10% armor.', { a: { s: 'all', m: { def: 0.1 } } }],
    battle_droid: ['Roger Roger', 'D', 'Droid and Separatist allies +5% attack and +5% armor.', { a: { s: ['droid', 'separatist'], m: { atk: 0.05, def: 0.05 } } }],
    tusken_raider: ["Sand People's Fury", 'A', 'Allies +4% attack and +4% crit chance.', { a: { s: 'all', m: { atk: 0.04, crit: 0.04 } } }],
    a_wing: ['Interceptor Screen', 'S', 'Fleet allies +5% speed.', { a: { s: 'ship', m: { spd: 0.05 } } }],
    y_wing: ['Ion Payload', 'S', 'Enemies start with -35% Turn Meter.', { e: { s: 'all', m: { tm: -35 } } }],
    z95: ['Scrappy Wingmen', 'G', '+10% credits from the battle.', { r: { cr: 0.1 } }],
    tie_fighter: ['Swarm Doctrine', 'A', 'Allies +3% attack for each TIE in the fleet.', { x: 'swarm' }],
    tie_bomber: ['Carpet Bomb', 'A', "Allies' area attacks deal +12% damage.", { x: 'aoe12' }],
    jawa: ['Utinni! Salvage', 'G', '+10% credits from the battle.', { r: { cr: 0.1 } }],
    b2_droid: ['Reinforced Chassis', 'D', 'Droid allies +8% health.', { a: { s: 'droid', m: { hp: 0.08 } } }],
    vulture_droid: ['Endless Production', 'G', '+8% XP from the battle.', { r: { xp: 0.08 } }],
    rebel_medic: ['Field Triage', 'D', 'Allies heal 1.5% of max health each turn.', { a: { s: 'all', m: { regen: 0.015 } } }],

    han_solo: ['Shoots First', 'S', 'Allies +3% speed, and the fastest ally starts with +25% Turn Meter.', { a: { s: 'all', m: { spd: 0.03 } }, x: 'first' }],
    chewbacca: ['Wookiee Roar', 'D', 'Allies +8% health.', { a: { s: 'all', m: { hp: 0.08 } } }],
    leia: ['Hope', 'D', 'Each ally shrugs off the first debuff placed on them.', { x: 'hope' }],
    r2d2: ['Plucky Repairs', 'D', 'The first time each ally drops below 30% health, they get 8% back.', { x: 'r2' }],
    boba_fett: ['Bounty Contract', 'G', '+15% credits from boss battles.', { r: { crBoss: 0.15 } }],
    tarkin: ['Fear Will Keep Them in Line', 'D', 'Enemies -6% attack.', { e: { s: 'all', m: { atk: -0.06 } } }],
    x_wing: ['Lock S-foils', 'A', 'Fleet allies +5% attack and +3% crit chance.', { a: { s: 'ship', m: { atk: 0.05, crit: 0.03 } } }],
    lambda_shuttle: ['Escort Duty', 'D', 'Fleet allies +12% armor and +3% health.', { a: { s: 'ship', m: { def: 0.12, hp: 0.03 } } }],
    grogu: ['Force Healing', 'D', "On each of Grogu's turns, the weakest ally heals 3.5%.", { x: 'grogu' }],
    death_trooper: ['Elite Escort', 'A', 'Empire allies +8% attack.', { a: { s: 'empire', m: { atk: 0.08 } } }],
    tie_interceptor: ['Fast Strike', 'S', 'Fleet allies +7% speed.', { a: { s: 'ship', m: { spd: 0.07 } } }],
    c3po: ['Six Million Forms', 'G', '+10% XP from the battle.', { r: { xp: 0.1 } }],
    chopper: ['Grumpy Fix', 'D', 'Droid allies heal 2.5% each turn.', { a: { s: 'droid', m: { regen: 0.025 } } }],
    droideka: ['Deflector Shield', 'D', 'Allies take 6% less damage from attacks.', { x: 'shield' }],
    magnaguard: ['Bodyguard Protocol', 'D', 'Leader allies +16% armor, and other allies +8% armor.', { a: { s: 'all', m: { def: 0.08 } }, x: 'guard' }],
    two_onebee: ['Bacta Tank', 'D', 'Healing on allies +20%.', { x: 'heal20' }],
    nightsister_acolyte: ['Dathomir Magick', 'A', 'When an ally falls, the others gain +10% ultimate charge.', { x: 'magick' }],
    padme: ['Senate Mandate', 'G', '+10% Kyber from first clears.', { r: { ky: 0.1 } }],
    lando: ["Gambler's Luck", 'G', '1 in 4 victory spins roll one step higher.', { r: { spin: 0.25 } }],
    n1_starfighter: ['Royal Squadron', 'S', 'Fleet allies +5% speed and +2% attack.', { a: { s: 'ship', m: { spd: 0.05, atk: 0.02 } } }],
    sabine: ['Art of War', 'A', "Allies' area attacks deal +10% damage.", { x: 'aoe10' }],
    hondo: ['Business Opportunity', 'G', '+12% credits, and a 1 in 10 chance of 5 bonus shards for a squad card.', { r: { cr: 0.12, shard: 0.1 } }],

    obi_wan: ['High Ground', 'D', 'Allies +8% armor, and the first hit each ally takes is halved.', { a: { s: 'all', m: { def: 0.08 } }, x: 'high' }],
    luke: ['New Hope', 'A', 'Rebel allies +10% attack.', { a: { s: 'rebel', m: { atk: 0.1 } } }],
    darth_maul: ['Duel of the Fates', 'A', 'Allies +7% crit chance.', { a: { s: 'all', m: { crit: 0.07 } } }],
    kylo_ren: ['Unleashed', 'A', 'Allies +2% attack, and +5% more every time an ally falls.', { a: { s: 'all', m: { atk: 0.02 } }, x: 'unleashed' }],
    count_dooku: ['Separatist Command', 'A', 'Separatist allies +4% attack and +3% speed.', { a: { s: 'separatist', m: { atk: 0.04, spd: 0.03 } } }],
    b_wing: ['Heavy Assault', 'D', 'Fleet allies +8% health.', { a: { s: 'ship', m: { hp: 0.08 } } }],
    ahsoka: ['Fulcrum', 'S', 'Allies +5% speed.', { a: { s: 'all', m: { spd: 0.05 } } }],
    din_djarin: ['This Is the Way', 'A', 'Mandalorian and Bounty Hunter allies +7% attack.', { a: { s: ['mandalorian', 'bounty'], m: { atk: 0.07 } } }],
    grievous: ['Droid Army', 'A', 'Droid allies +5% attack and +4% health.', { a: { s: 'droid', m: { atk: 0.05, hp: 0.04 } } }],
    bb8: ['Rolling Recon', 'S', 'The squad starts with +30% Turn Meter.', { a: { s: 'all', m: { tmStart: 30 } } }],
    k2so: ['Brutally Honest', 'A', 'Enemies -12% armor.', { e: { s: 'all', m: { def: -0.12 } } }],
    ig88: ['Assassin Protocol', 'A', 'Allies deal +22% damage to enemies below 35% health.', { x: 'assassin' }],
    ig11: ['Nurse Mode', 'D', 'Once per battle, when an ally drops below 50% health, the weakest ally heals 20%.', { x: 'nurse' }],
    barriss: ['Jedi Healer', 'D', 'Healing on allies +22%.', { x: 'heal22' }],
    // 2.5 (only shows up once Marrok is in the game).
    marrok: ['Pack Hunter', 'A', 'Bounty Hunter allies +6% attack and +4% speed.', { a: { s: 'bounty', m: { atk: 0.06, spd: 0.04 } } }],
    hunter: ['Enhanced Senses', 'A', 'Allies +6% crit chance and +10% crit damage.', { a: { s: 'all', m: { crit: 0.06, critDmg: 0.1 } } }],
    wrecker: ['Lift Heavy', 'D', 'Allies +9% health.', { a: { s: 'all', m: { hp: 0.09 } } }],
    tech: ['Calculated', 'G', '+10% XP from the battle, and allies +4% speed.', { r: { xp: 0.1 }, a: { s: 'all', m: { spd: 0.04 } } }],
    crosshair: ['Marksman', 'A', "Allies' single-target attacks deal +8% damage.", { x: 'marksman' }],
    echo: ['Regs Recall', 'D', 'Trooper allies +4% armor and shrug off the first stun.', { a: { s: 'trooper', m: { def: 0.04 } }, x: 'regs' }],
    grand_inquisitor: ['Purge Order', 'D', 'Jedi enemies -12% attack, other enemies -3%.', { e: { s: 'all', m: { atk: -0.03 } }, x: 'purge' }],
    second_sister: ['Relentless Hunt', 'S', 'Allies +4% speed and +2% attack.', { a: { s: 'all', m: { spd: 0.04, atk: 0.02 } } }],
    fifth_brother: ['Brute Force', 'D', 'Allies +9% armor and +3% health.', { a: { s: 'all', m: { def: 0.09, hp: 0.03 } } }],
    seventh_sister: ['Probe Droids', 'S', 'Enemies start with -40% Turn Meter.', { e: { s: 'all', m: { tm: -40 } } }],
    eighth_brother: ['Spinning Blade', 'A', "Allies' area attacks deal +10% damage.", { x: 'aoe10' }],
    qui_gon: ['Living Force', 'D', 'Allies heal 2% each turn and get +3% armor.', { a: { s: 'all', m: { regen: 0.02, def: 0.03 } } }],
    jango_fett: ['The Template', 'A', 'Trooper, Bounty Hunter and Mandalorian allies +6% attack and armor.', { a: { s: ['trooper', 'bounty', 'mandalorian'], m: { atk: 0.06, def: 0.06 } } }],
    asajj_ventress: ['Nightsister Rage', 'A', 'Allies +4% crit chance and +15% crit damage.', { a: { s: 'all', m: { crit: 0.04, critDmg: 0.15 } } }],
    cad_bane: ['Quick Draw', 'S', 'The squad starts with +20% Turn Meter and +4% crit chance.', { a: { s: 'all', m: { tmStart: 20, crit: 0.04 } } }],
    moff_gideon: ['Remnant Resources', 'G', '+12% credits from the battle.', { r: { cr: 0.12 } }],
    arc_170: ['Clone Gunners', 'A', 'Fleet allies +7% attack.', { a: { s: 'ship', m: { atk: 0.07 } } }],
    delta7: ['Jedi Escort', 'S', 'Jedi allies +9% speed, other allies +4%.', { a: { s: 'all', m: { spd: 0.04 } }, x: 'jescort' }],
    tie_silencer: ['First Order Ace', 'A', 'Fleet allies +8% crit chance and +15% crit damage.', { a: { s: 'ship', m: { crit: 0.08, critDmg: 0.15 } } }],
    cal_kestis: ['Psychometry', 'G', '+8% XP and +6% credits from the battle.', { r: { xp: 0.08, cr: 0.06 } }],
    savage_opress: ["Brother's Rage", 'D', 'Sith and Nightsister allies +12% health and +6% attack.', { a: { s: ['sith', 'nightsister'], m: { hp: 0.12, atk: 0.06 } } }],
    u_wing: ['Rogue Drop', 'S', 'The squad starts with +40% Turn Meter.', { a: { s: 'all', m: { tmStart: 40 } } }],
    upsilon_shuttle: ['Supreme Escort', 'D', 'Fleet allies +12% armor and +3% health.', { a: { s: 'ship', m: { def: 0.12, hp: 0.03 } } }],
    hounds_tooth: ['Trophy Hunt', 'G', '+6% credits, or +18% from boss battles.', { r: { cr: 0.06, crBossX: 0.12 } }],
    cassian_haulcraft: ['Spy Network', 'G', '+10% XP from the battle.', { r: { xp: 0.1 } }],

    // The new 2.4 cards.
    gamorrean_guard: ["Jabba's Muscle", 'D', 'Allies +8% health and +3% armor.', { a: { s: 'all', m: { hp: 0.08, def: 0.03 } } }],
    snowtrooper: ['Cold Assault', 'A', 'Allies +5% attack, and Trooper allies +5% armor.', { a: { s: 'all', m: { atk: 0.05 } }, a2: { s: 'trooper', m: { def: 0.05 } } }],
    wing_guard: ['Cloud City Tariff', 'G', '+8% credits from the battle.', { r: { cr: 0.08 } }],
    scout_trooper: ['Speeder Recon', 'S', 'The squad starts with +20% Turn Meter and +1.5% speed.', { a: { s: 'all', m: { tmStart: 20, spd: 0.015 } } }],
    shoretrooper: ['Coastal Defense', 'D', 'Allies +7% armor, and Trooper allies +8% health.', { a: { s: 'all', m: { def: 0.07 } }, a2: { s: 'trooper', m: { hp: 0.08 } } }],
    cf66_trooper: ['Execute Order 66', 'A', 'Enemies -6% armor, and Jedi enemies -10% more.', { e: { s: 'all', m: { def: -0.06 } }, e2: { s: 'jedi', m: { def: -0.1 } } }],
    geonosian_warrior: ['Hive Swarm', 'S', 'Allies +4% speed, and Separatist allies +4% more.', { a: { s: 'all', m: { spd: 0.04 } }, a2: { s: 'separatist', m: { spd: 0.04 } } }],
    purge_trooper: ['Purge Protocol', 'A', 'Allies +6% crit chance and +10% crit damage.', { a: { s: 'all', m: { crit: 0.06, critDmg: 0.1 } } }],
    knight_of_ren: ['Knights of Ren', 'A', 'Allies +5% attack, and Sith allies +4% more.', { a: { s: 'all', m: { atk: 0.05 } }, a2: { s: 'sith', m: { atk: 0.04 } } }],
    commando_droid: ['Commando Strike', 'S', 'Allies +3% speed, and Droid allies +4% more.', { a: { s: 'all', m: { spd: 0.03 } }, a2: { s: 'droid', m: { spd: 0.04 } } }],
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
  // elites: ids of the Elite cards in this squad (their doctrines are boosted).
  D.squadBonuses = function (ids, planetId, elites) {
    const b = baseBonuses(ids, planetId);
    if (!on()) return b;
    const defs = ids.map((id) => D.UNIT_MAP[id]);
    const tieCount = defs.filter((d) => d && d.kind === 'ship' && /^tie_/.test(d.id)).length;
    for (const doc of listFor(ids)) {
      const { a, x } = doc.spec;
      const f = eliteOf(elites, doc.id);
      if (a) { const m = scale(a.m, f); defs.forEach((d, i) => { if (d && inScope(d, a.s)) addMods(b.perUnit[i], m); }); }
      // a2: a second, trait-only part on top of the squad-wide one.
      const a2 = doc.spec.a2;
      if (a2) { const m = scale(a2.m, f); defs.forEach((d, i) => { if (d && inScope(d, a2.s)) addMods(b.perUnit[i], m); }); }
      if (x === 'guard') defs.forEach((d, i) => { if (d && inScope(d, 'leader')) addMods(b.perUnit[i], { def: 0.08 * f }); });
      if (x === 'jescort') defs.forEach((d, i) => { if (d && inScope(d, 'jedi')) addMods(b.perUnit[i], { spd: 0.05 * f }); });
      // Leia and Echo have no numbers to boost, so as Elites they add +3% armor.
      if (f > 1 && x === 'hope') defs.forEach((d, i) => { if (d) addMods(b.perUnit[i], { def: 0.03 }); });
      if (f > 1 && x === 'regs') defs.forEach((d, i) => { if (d && inScope(d, 'trooper')) addMods(b.perUnit[i], { def: 0.03 }); });
      if (x === 'swarm') defs.forEach((d, i) => { if (d) addMods(b.perUnit[i], { atk: 0.03 * tieCount * f }); });
      b.active.push({ kind: 'doctrine', key: 'doc_' + doc.id, tier: 0, members: [ids.indexOf(doc.id)], name: doc.name + (f > 1 ? ' ✦' : ''), desc: `${D.UNIT_MAP[doc.id].name}${f > 1 ? ' (Elite, 25% stronger)' : ''}: ${doc.text}`, icon: doc.icon, doctrine: doc.style });
    }
    return b;
  };

  // The battle engine asks for everything the side's doctrines do in a fight.
  function battleRules(ids, elites) {
    // x: each special rule, counted; f: its Elite boost (1 or 1.25).
    const out = { foe: [], x: {}, f: {} };
    for (const doc of listFor(ids)) {
      const f = eliteOf(elites, doc.id);
      if (doc.spec.e) out.foe.push({ s: doc.spec.e.s, m: scale(doc.spec.e.m, f) });
      if (doc.spec.e2) out.foe.push({ s: doc.spec.e2.s, m: scale(doc.spec.e2.m, f) });
      if (doc.spec.x) { out.x[doc.spec.x] = (out.x[doc.spec.x] || 0) + f; out.f[doc.spec.x] = Math.max(out.f[doc.spec.x] || 1, f); }
    }
    // aoeN / healN add N% to area damage / healing received (each card once).
    out.x.aoe = 0; out.x.heal = 0;
    for (const k of Object.keys(out.x)) {
      const m = /^(aoe|heal)(\d+)$/.exec(k);
      if (m) out.x[m[1]] += Number(m[2]) / 100 * out.x[k];
    }
    out.foeOk = (def, s) => inScope(def, s);
    return out;
  }

  // Reward boosts from the player's squad, capped at +40% each.
  function rewards(ids, type) {
    const r = { cr: 0, xp: 0, ky: 0, spin: 0, shard: 0, names: [] };
    for (const doc of listFor(ids)) {
      const s0 = doc.spec.r;
      if (!s0) continue;
      const u = root.Player && root.Player.unit && root.Player.unit(doc.id);
      const s = scale(s0, u && u.elite ? ELITE_BOOST : 1);
      let used = false;
      if (s.cr) { r.cr += s.cr; used = true; }
      if (s.crBoss && type === 'boss') { r.cr += s.crBoss; used = true; }
      if (s.crBossX && type === 'boss') r.cr += s.crBossX;
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
  D.DOCTRINE_ELITE = ELITE_BOOST;
  D.DOCTRINE_STYLES = STYLE;
  root.Doctrines = { on, of: doctrineOf, list: listFor, battleRules, rewards, styles: STYLE };

  if (typeof document === 'undefined') return;
  const css = document.createElement('style');
  css.textContent = `.doctrine-box{margin:10px 0 2px;padding:10px 12px;border-radius:10px;border:1px solid rgba(120,170,255,.28);background:linear-gradient(180deg,rgba(40,70,130,.28),rgba(20,30,60,.2))}
.doctrine-box .dh{display:flex;align-items:center;gap:8px;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:#9fc0ff}
.doctrine-box .dn{display:block;margin-top:3px;color:#fff;font-size:1rem;line-height:1.2}
.doctrine-box .dst{margin-left:auto;flex:0 0 auto;padding:1px 8px;border-radius:99px;font-size:.7rem;background:rgba(255,255,255,.08)}
.doctrine-box .dst.G{color:#ffd36b}.doctrine-box .dst.S{color:#7fe3ff}.doctrine-box .dst.D{color:#8ff0a4}.doctrine-box .dst.A{color:#ff8f7a}
.doctrine-box p{margin:6px 0 0;font-size:.9rem;line-height:1.35}
.doctrine-box .d-el{font-size:.78rem;color:#8fa6c4}.doctrine-box .d-el.on{color:#ffd36b;font-weight:700}
.bonus.doctrine .bonus-icon,.syn-chip.doctrine{color:#9fc0ff}`;
  document.head.appendChild(css);
})(typeof window !== 'undefined' ? window : globalThis);
