// Update 2.5: attack colours and the 29 badges' progress.
// Your colour paints your own cards' basic attacks (blasters, ship lasers,
// Force lightning, saber strikes and their sparks), the shield ultimate and
// your selection outline. Other ultimates keep their own look. It is only a
// different colour on the same effects, so it costs nothing extra to draw.
// Colours come free, from Luthen's Gallery (Beskar), from badges, or from
// the holiday events. The badges' progress lives here too, so a colour and
// the badge that unlocks it always agree. Off until 2.5 ships.
(function (root) {
  'use strict';
  if (!(root.Update25 && root.Update25.on())) return;
  const UI = root.UI; const Player = root.Player; const D = root.GameData;
  if (!UI || !Player || !D) return;
  const HN = () => root.HN;
  const H = () => { try { return HN() && HN().S ? HN().S() : {}; } catch (e) { return {}; } };
  const save = () => { try { Player.save(); } catch (e) { /* storage blocked */ } };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => Number(n || 0).toLocaleString('en-US');
  // Everything this file remembers: Player.state.b25.
  const B = () => { const s = Player.state; if (!s) return { ev: {}, flaw: {}, own: {} }; if (!s.b25 || typeof s.b25 !== 'object') s.b25 = {}; const b = s.b25; b.ev = b.ev || {}; b.flaw = b.flaw || {}; b.own = b.own || {}; return b; };

  // ---------- Holiday events (Central dates) ----------
  const EVENTS = {
    lifeday: [[2026, 11, 15, 2027, 0, 2], [2027, 11, 15, 2028, 0, 2]],
    harvest: [[2026, 10, 23, 2026, 11, 2], [2027, 10, 22, 2027, 11, 1]],
    easter: [[2027, 2, 22, 2027, 2, 29]],
    endor: [[2027, 4, 1, 2027, 4, 8]],
  };
  const TEST = (() => { try { return { tg: 'harvest', ld: 'lifeday', ea: 'easter', en: 'endor' }[localStorage.getItem('swcg-hol-test')] || null; } catch (e) { return null; } })();
  const eventNow = () => { if (TEST) return TEST; const t = Date.now(); for (const [k, W] of Object.entries(EVENTS)) for (const a of W) if (t >= Date.UTC(a[0], a[1], a[2], 6) && t < Date.UTC(a[3], a[4], a[5], 6)) return k; return null; };
  // Playing during a holiday earns its colour and its three pictures.
  const markEvent = () => { const k = eventNow(); if (k && !B().ev[k]) { B().ev[k] = 1; save(); } };

  // ---------- Counters the badges need that nothing else keeps ----------
  const Hk = UI.hooks || {};
  if (Hk.battleEnd && !Hk.__col25) {
    Hk.__col25 = true;
    Hk.battleEnd.push((battle, params, won) => {
      try {
        const b = B(); params = params || {};
        if (params.type === 'hn' && params.hn === 'raid') b.rf = (b.rf | 0) + 1;
        if (!won || !battle || !battle.units) return;
        const mine = battle.units.filter((u) => u.side === 'player');
        if (params.type === 'boss' && params.boss && mine.length && mine.every((u) => u.alive)) b.flaw[params.boss] = 1;
        if (params.type === 'hn' && params.hn === 'arena') { const sk = seasonKey(); if (!b.as || b.as.s !== sk) b.as = { s: sk, n: 0 }; b.as.n += 1; b.asBest = Math.max(b.asBest | 0, b.as.n); }
        save();
      } catch (e) { /* counting only */ }
    });
  }
  const seasonKey = () => { const h = H(); return ((h.soc || {}).seasonsDone | 0); };
  // Sabacc hands played at Watto's.
  if (typeof Player.sabacc === 'function' && !Player.__col25) {
    Player.__col25 = true;
    const base = Player.sabacc;
    Player.sabacc = function (...a) { const r = base.apply(this, a); try { const b = B(); b.sab = (b.sab | 0) + 1; } catch (e) { /* ignore */ } return r; };
  }
  // The longest live-duel win streak (the HoloNet only keeps the current one).
  const duelMax = () => { const h = H(); const d = h.duels || {}; const b = B(); if ((d.s | 0) > (b.dmax | 0)) { b.dmax = d.s | 0; save(); } return Math.max(b.dmax | 0, d.s | 0); };

  // ---------- Badge progress ----------
  const C25 = () => root.Cos25 || null;
  const cos = () => { try { return C25() && C25().C ? C25().C() : {}; } catch (e) { return {}; } };
  const frames = () => { try { return HN() && HN().cos25 ? HN().cos25.owned() : []; } catch (e) { return []; } };
  const has = (f) => frames().includes(f);
  const c25 = () => Player.state.c25 || {};
  const cz = () => Player.state.czw || {};
  const forged = () => Object.values(H().forge || {}).reduce((a, x) => a + (x | 0), 0);
  const units = () => Object.keys(Player.state.units || {}).length;
  const poses = () => { try { const c = C25(); return c ? c.POSES.filter((p) => c.ownsItem('po', p)).length : 0; } catch (e) { return 0; } };
  const bosses = () => D.BOSS_ENCOUNTERS || [];
  const beat = () => { const b = Player.state.bosses || {}; return bosses().filter((x) => b[x.id]).length; };
  const flawAll = (pred) => { const L = bosses().filter(pred); return L.length > 0 && L.every((x) => B().flaw[x.id]); };
  const allPlanets = () => (D.PLANETS || []).every((p) => Player.planetComplete && Player.planetComplete(p.id));
  const role = () => { try { const r = HN().cos25.role(); return r && r.r; } catch (e) { return null; } };
  const n = (have, need) => [have | 0, need];
  // [id, name, icon, tiers: [requirement, progress(), rewards]]
  // Rewards: ti title, fr frame, wi win screen, cb card back, pa pack theme, co attack colour, po poses, ky Kyber, pf picture.
  const BADGES = [
    ['sith', 'Sith Lord', [['Win 100 battles with an all Dark Side squad', () => n(c25().dark, 100), [['ti', 'Sith Lord']]], ['Win 200 with an all Dark Side squad', () => n(c25().dark, 200), [['fr', 'Sith Lord'], ['wi', 'Death Star Bridge']]], ['Win 300 with an all Dark Side squad', () => n(c25().dark, 300), [['cb', 'Sith Holocron']]], ['Win 500 with an all Dark Side squad', () => n(c25().dark, 500), [['pa', 'Sith Vault']]]]],
    ['jedi', 'Jedi Order', [['Win 100 battles with an all Light Side squad', () => n(c25().light, 100), [['ti', 'Jedi Knight']]], ['Win 150 with an all Light Side squad', () => n(c25().light, 150), [['fr', 'Jedi Order']]], ['Win 200 with an all Light Side squad', () => n(c25().light, 200), [['co', 'emerald'], ['wi', 'Jedi Temple']]], ['Win 300 with an all Light Side squad', () => n(c25().light, 300), [['cb', 'Jedi Archives']]]]],
    ['fleet', 'Fleet Admiral', [['Win 50 all-ship battles', () => n(c25().fleet, 50), [['ti', 'Kessel Runner'], ['fr', 'Kessel Runner']]], ['Win 100 all-ship battles', () => n(c25().fleet, 100), [['wi', 'Jump to Lightspeed']]], ['Win 150 all-ship battles', () => n(c25().fleet, 150), [['ti', 'Fleet Admiral']]], ['Win 200 all-ship battles', () => n(c25().fleet, 200), [['pa', 'Hyperspace Drop']]]]],
    ['ranked', 'Ranked Climber', [['Reach Gold III', () => (H().divs || []).includes('gold3'), [['fr', 'Gilded Third']]], ['Reach Kyber III', () => (H().divs || []).includes('kyber3'), [['fr', 'Kyber Heart'], ['co', 'amethyst']]], ['Reach the Legend league', () => (H().leagues || []).includes('legend'), [['ti', 'Legend'], ['co', 'darksaber']]], ['End a season in Legend', () => has('legendhalo'), [['fr', "Legend's Halo"]]]]],
    ['forge', 'Beskar Smith', [['Forge 10 times', () => n(forged(), 10), [['ti', 'Beskar Smith']]], ['Forge 20 times', () => n(forged(), 20), [['wi', 'Forge Strike']]], ['Forge 30 times', () => n(forged(), 30), [['cb', 'Beskar Forge']]], ['Forge 40 times', () => n(forged(), 40), [['pa', 'Beskar Crate']]]]],
    ['mvp', 'Star Player', [['Be MVP with 1 card type', () => n(poses(), 1), [['po', 'Its victory pose']]], ['MVP with 5 card types', () => n(poses(), 5), [['po', '5 poses']]], ['MVP with 10 card types', () => n(poses(), 10), [['po', '10 poses']]], ['MVP with all 14 card types', () => n(poses(), 14), [['po', 'All 14 poses']]]]],
    ['holo', 'Holo Hunter', [['Own 5 holo cards', () => n(Player.state.stats.holos, 5), [['ti', 'Holo Hunter']]], ['Own 10 holo cards', () => n(Player.state.stats.holos, 10), [['ky', 50]]], ['Own 25 holo cards', () => n(Player.state.stats.holos, 25), [['co', 'prism'], ['ky', 100]]], ['Own 50 holo cards', () => n(Player.state.stats.holos, 50), [['ky', 200]]]]],
    ['duel', 'Duelist', [['Win 10 duels in a row', () => n(duelMax(), 10), [['ti', 'Duelist']]], ['Win 25 live duels', () => n((H().duels || {}).w, 25), [['co', 'carbonite']]], ['Win 100 live duels', () => n((H().duels || {}).w, 100), [['fr', 'Twin Sabers']]]]],
    ['streak', 'Streak Master', [['Win 15 ranked battles in a row', () => n(H().wsMax, 15), [['ti', 'Streak Master']]], ['Win 25 in a row', () => n(H().wsMax, 25), [['fr', 'Hot Streak']]], ['Win 50 in a row', () => n(H().wsMax, 50), [['fr', 'Unstoppable']]]]],
    ['season', 'Season Veteran', [['Win 50 arena battles in one season', () => n(B().asBest, 50), [['fr', 'Season Wreath']]], ['Finish a season in the top 25', () => !!H().top25, [['co', 'hoth']]], ['Finish 5 seasons', () => n((H().soc || {}).seasonsDone, 5), [['ti', 'Season Veteran']]]]],
    ['guild', 'Guild Founder', [['Lead a guild', () => role() === 'leader', [['ti', 'Guild Founder']]], ['Be in a guild that reaches level 5', () => has('citadel'), [['fr', 'Citadel']]], ['Stay in one guild for 3 seasons', () => !!(cos().t || {}).loyal, [['ti', 'Loyal']]]]],
    ['raid', 'Raid Breaker', [['Fight 10 guild raid bosses', () => n(B().rf, 10), [['ti', 'Raid Breaker']]], ['Top damage in your guild on a raid boss that falls', () => has('raidbreaker'), [['fr', 'Raid Breaker']]], ['Top 10 damage in a raid week', () => !!B().top10, [['co', 'nebula']]]]],
    ['holocron', 'Holocron Keeper', [['Own 50 different cards', () => n(units(), 50), [['ti', 'Holocron Keeper']]], ['Own 75 different cards', () => n(units(), 75), [['fr', 'Holocron Keeper']]], ['Own 100 different cards', () => n(units(), 100), [['pa', 'Holocron']]]]],
    ['liberator', 'Liberator', [['Clear the Hoth world', () => !!(Player.planetComplete && Player.planetComplete('hoth')), [['wi', 'Hoth Hangar']]], ['Beat every Mustafar boss without losing a card', () => flawAll((x) => x.planet === 'mustafar'), [['co', 'lava']]], ['Clear every world', () => allPlanets(), [['ti', 'Liberator']]]]],
    ['crates', 'Quartermaster', [['Open 150 crates', () => n(Player.state.stats.packsOpened, 150), [['cb', 'Battle Station Plans']]], ['Open 400 crates', () => n(Player.state.stats.packsOpened, 400), [['pa', 'Droid Delivery']]]]],
    ['monster', 'Monster Hunter', [['Beat every boss', () => n(beat(), bosses().length || 1), [['ti', 'Monster Hunter']]], ['Beat Mother Talzin without losing a card', () => flawAll((x) => /talzin/.test(x.id) || (x.enemies || []).includes('talzin') || x.boss === 'talzin'), [['co', 'mist']]]]],
    ['casino', 'High Roller', [["Play 25 Sabacc hands at Watto's", () => n(B().sab, 25), [['ti', 'High Roller']]], ['Win 25 games in the casino', () => n(cz().w, 25), [['co', 'dusk']]]]],
    ['podrace', 'Podrace Prophet', [['Win 10 long-shot podrace bets', () => n(cz().long, 10), [['ti', 'Podrace Prophet']]], ['Bet on 50 podraces', () => n(cz().bets, 50), [['co', 'dune']]]]],
    ['pazaak', 'Pazaak Champion', [['Win 50 Pazaak matches', () => n(cz().pz, 50), [['ti', 'Pazaak Champion']]]]],
    ['dejarik', 'Dejarik Master', [['Win 25 Holo-Chess wagers', () => n(cz().hc, 25), [['ti', 'Dejarik Master']]]]],
    ['kessel', 'Kessel Run', [['Make the Kessel Run', () => !!(Player.owns && Player.owns('falcon_kessel')), [['co', 'spice']]]]],
    ['guardian', 'Guardian', [['Heal 1,000,000 health in battles', () => n(Math.round(cos().heal || 0), 1000000), [['ti', 'Guardian']]]]],
    ['collector', 'Collector', [['Own 25 frames', () => n(frames().length, 25), [['ti', 'Collector']]]]],
    ['recruiter', 'Recruiter', [['Invite 10 friends who reach level 5', () => !!(Player.state.invites || {}).squad, [['ti', 'Recruiter']]]]],
    ['rookie', 'Rookie', [["Open Captain Rex's welcome kit", () => !!cos().kit, [['ti', 'Rookie']]]]],
    ['lifeday', 'Life Day', [['Play during Life Day', () => !!B().ev.lifeday, [['co', 'lifeday'], ['pf', 'pf25_ld_elder'], ['pf', 'pf25_ld_cub'], ['pf', 'pf25_ld_tree']]]]],
    ['harvest', 'Harvest Hunt', [['Play during the Harvest Hunt (Thanksgiving)', () => !!B().ev.harvest, [['co', 'harvest'], ['pf', 'pf25_tg_nuna'], ['pf', 'pf25_tg_farmer'], ['pf', 'pf25_tg_milk']]]]],
    ['easter', 'Egg Hunt', [['Play during the Egg Hunt (Easter)', () => !!B().ev.easter, [['co', 'egg'], ['pf', 'pf25_ea_hatch'], ['pf', 'pf25_ea_cat'], ['pf', 'pf25_ea_droid']]]]],
    ['endor', 'Endor Fireworks', [['Play during May the 4th week', () => !!B().ev.endor, [['co', 'endor'], ['pf', 'pf25_en_drum'], ['pf', 'pf25_en_ds'], ['pf', 'pf25_en_helm']]]]],
  ];
  const done = (p) => (Array.isArray(p) ? p[0] >= p[1] : !!p);
  const prog = (fn) => { try { return fn(); } catch (e) { return false; } };
  // How many tiers of a badge are done (they count in order).
  const tierOf = (b) => { let t = 0; for (const s of b[2]) { if (done(prog(s[1]))) t++; else break; } return t; };
  const tierDone = (b, i) => done(prog(b[2][i][1]));

  // ---------- Attack colours ----------
  // [id, name, glow, core, spark, how it's earned, special effect]
  const COLOURS = [
    ['default', 'Card default', null, null, null, { free: 1 }],
    ['kyber', 'Kyber Blue', '#3aa8ff', '#e8f8ff', '#9fe0ff', { free: 1 }],
    ['sith', 'Sith Red', '#ff2a2a', '#ffe0d8', '#ff8a6a', { free: 1 }],
    ['gold', 'Beskar Gold', '#e8a020', '#fff4c8', '#ffd27a', { beskar: 2500 }],
    ['teal', 'Mando Teal', '#1ad0c0', '#e8fffb', '#8afff0', { beskar: 6000 }],
    ['emerald', 'Emerald', '#2ad84a', '#e8ffe8', '#9affb0', { badge: ['jedi', 2] }],
    ['amethyst', 'Amethyst', '#9a4aff', '#f4e8ff', '#d0a8ff', { badge: ['ranked', 1] }],
    ['darksaber', 'Darksaber', '#e8ecf4', '#0a0a10', '#ffffff', { badge: ['ranked', 2] }],
    ['prism', 'Prism', '#ff4a9a', '#ffffff', '#ffffff', { badge: ['holo', 2] }, 'prism'],
    ['lava', 'Mustafar Lava', '#ff5a10', '#fff0c8', '#ffb04a', { badge: ['liberator', 1] }],
    ['hoth', 'Hoth Frost', '#d8f4ff', '#ffffff', '#ffffff', { badge: ['season', 1] }],
    ['dusk', 'Bespin Dusk', '#ffa07a', '#fff0e8', '#ff7ab0', { badge: ['casino', 1] }],
    ['mist', 'Nightsister Mist', '#3aff7a', '#b0ffc8', '#4a1a6a', { badge: ['monster', 1] }],
    ['nebula', 'Nebula Pink', '#ff2ad0', '#ffe8f8', '#ffa8e8', { badge: ['raid', 2] }],
    ['spice', 'Kessel Spice', '#ffe81a', '#fffbe0', '#ff8a1a', { badge: ['kessel', 0] }],
    ['carbonite', 'Carbonite', '#7a94b8', '#eef4ff', '#c8d8f0', { badge: ['duel', 1] }],
    ['dune', 'Dune Sea', '#d8a860', '#fff4dc', '#ffcf7a', { badge: ['podrace', 1] }, 'dune'],
    ['lifeday', 'Life Day', '#ff2a2a', '#ffffff', '#2ad84a', { badge: ['lifeday', 0] }, 'lifeday'],
    ['harvest', 'Harvest', '#e8742a', '#fff0c8', '#ffc04a', { badge: ['harvest', 0] }, 'harvest'],
    ['egg', 'Egg Hunt', '#ff9ad8', '#ffffff', '#9ae8ff', { badge: ['easter', 0] }, 'egg'],
    ['endor', 'Endor Fireworks', '#ffd23f', '#fff4c8', '#ff5ad0', { badge: ['endor', 0] }, 'endor'],
    ['galactic', 'Galactic', '#7a5cff', '#ffffff', '#5ae8ff', { max: 1 }, 'galactic'],
  ].map(([id, n, glow, core, spark, get, fx]) => ({ id, n, glow, core, spark, get, fx: fx || null }));
  const COL = Object.fromEntries(COLOURS.map((c) => [c.id, c]));
  const badge = (id) => BADGES.find((b) => b[0] === id);
  const howOf = (c) => {
    if (c.get.free) return 'Everyone has it';
    if (c.get.beskar) return `Luthen's Gallery · ${fmt(c.get.beskar)} Beskar`;
    if (c.get.max) return 'MAX OUT';
    const b = badge(c.get.badge[0]); return `${b[1]} badge · ${b[2][c.get.badge[1]][0]}`;
  };
  const owns = (c) => !!c && (c.get.free || !!B().own[c.id] || (c.get.badge && tierDone(badge(c.get.badge[0]), c.get.badge[1])) || (c.get.max && !!(root.Max25 && root.Max25.done())));
  const equipped = () => { const c = COL[B().col]; return c && owns(c) ? c : COL.default; };
  const buy = (c) => {
    const h = H();
    if (!c.get.beskar || owns(c)) return false;
    if ((h.beskar | 0) < c.get.beskar) { UI.toast(`You need ${fmt(c.get.beskar)} Beskar.`); return false; }
    h.beskar -= c.get.beskar; try { HN().save(); } catch (e) { /* ignore */ } B().own[c.id] = 1; save(); return true;
  };
  // A little sample of the colour: a bolt with its glow, for the picker.
  const swatch = (c, big) => {
    if (!c.glow) return `<svg viewBox="0 0 120 40" class="col25-sw${big ? ' big' : ''}" aria-hidden="true"><path d="M12 20 H82" stroke="#ff8a3a" stroke-width="7" stroke-linecap="round" opacity=".5"/><path d="M12 20 H82" stroke="#fff4c8" stroke-width="2.6" stroke-linecap="round"/><path d="M12 30 H66" stroke="#3bff6a" stroke-width="5" stroke-linecap="round" opacity=".45"/><path d="M12 30 H66" stroke="#e8ffe8" stroke-width="2" stroke-linecap="round"/><circle cx="96" cy="20" r="6" fill="#ff8a3a" opacity=".8"/><circle cx="106" cy="26" r="5" fill="#3bff6a" opacity=".7"/></svg>`;
    const g = c.fx === 'prism' ? 'url(#col25pr)' : c.fx === 'galactic' ? 'url(#col25ga)' : c.glow;
    const deco = { lifeday: '<path d="M100 10 l2.4 5 5.4.6-4 3.8 1 5.4-4.8-2.6-4.8 2.6 1-5.4-4-3.8 5.4-.6z" fill="#fff6c8"/>', harvest: '<path d="M100 12 l2 4 4.4-1-1.6 4 3.4 2.4-4.4 .6-.6 4.4-3.2-3-3.2 3-.6-4.4-4.4-.6 3.4-2.4-1.6-4 4.4 1z" fill="#e8742a"/>', egg: '<ellipse cx="100" cy="20" rx="6" ry="8" fill="#ff9ad8"/><path d="M94 20 q6 -3 12 0" stroke="#9ae8ff" stroke-width="2" fill="none"/>', endor: '<g stroke="#ffd23f" stroke-width="1.6">' + [0, 45, 90, 135].map((a) => `<path d="M100 20 l${(Math.cos(a * Math.PI / 180) * 8).toFixed(1)} ${(Math.sin(a * Math.PI / 180) * 8).toFixed(1)} M100 20 l${(-Math.cos(a * Math.PI / 180) * 8).toFixed(1)} ${(-Math.sin(a * Math.PI / 180) * 8).toFixed(1)}"/>`).join('') + '</g>', dune: '<circle cx="96" cy="16" r="4" fill="#ffd27a"/><circle cx="106" cy="20" r="3" fill="#ffb04a"/>' }[c.fx] || `<circle cx="100" cy="20" r="7" fill="${c.spark}" opacity=".9"/><circle cx="100" cy="20" r="3" fill="${c.core}"/>`;
    return `<svg viewBox="0 0 120 40" class="col25-sw${big ? ' big' : ''}" aria-hidden="true"><defs><linearGradient id="col25pr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff4a9a"/><stop offset=".33" stop-color="#ffd23f"/><stop offset=".66" stop-color="#3ac8ff"/><stop offset="1" stop-color="#b06aff"/></linearGradient><linearGradient id="col25ga" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a1470"/><stop offset=".35" stop-color="#7a5cff"/><stop offset=".7" stop-color="#ff5ad0"/><stop offset="1" stop-color="#5ae8ff"/></linearGradient></defs><path d="M10 20 H88" stroke="${g}" stroke-width="9" stroke-linecap="round" opacity=".55"/><path d="M10 20 H88" stroke="${g}" stroke-width="5" stroke-linecap="round"/><path d="M12 20 H86" stroke="${c.core}" stroke-width="2" stroke-linecap="round"/>${deco}</svg>`;
  };
  // For the Cosmetics tab (js/cosm25.js).
  const items = () => { const eq = equipped().id; return COLOURS.filter((c) => !c.get.max || owns(c)).map((c) => { const p = c.get.badge ? prog(badge(c.get.badge[0])[2][c.get.badge[1]][1]) : null; return { id: c.id, n: c.n, how: howOf(c), own: owns(c), eq: eq === c.id, c: c.glow || '#ffd27a', cost: c.get.beskar ? { beskar: c.get.beskar } : null, p: Array.isArray(p) && !done(p) ? { have: p[0], need: p[1] } : null }; }); };
  const wear = (id) => { if (!owns(COL[id])) return false; B().col = id; save(); return true; };

  // ---------- In battle ----------
  const BU = root.BattleUI;
  const perf = () => !!(root.Perf && root.Perf.on);
  let cur = null; let prismI = 0;
  const PRISM = ['#ff4a9a', '#ffd23f', '#5aff9a', '#3ac8ff', '#b06aff'];
  const GAL = ['#7a5cff', '#5ae8ff', '#ff5ad0', '#b8a8ff'];
  const paint = () => (cur.fx === 'prism' ? PRISM[prismI++ % PRISM.length] : cur.fx === 'galactic' ? GAL[prismI++ % GAL.length] : cur.glow);
  // Holiday colours leave a few little shapes where they hit: Life Day stars, Harvest leaves, eggs, fireworks, sand.
  const GLYPH = {
    lifeday: (i) => (i % 2 ? '<path d="M0 -6 l1.8 3.8 4.2.4-3.2 2.8.9 4.2-3.7-2.2-3.7 2.2.9-4.2-3.2-2.8 4.2-.4z" fill="#fff6c8"/>' : `<circle r="2.4" fill="${i % 4 ? '#2ad84a' : '#ff2a2a'}"/>`),
    harvest: (i) => `<path d="M0 -6 L1.8 -2.6 L5.4 -3.4 L3.8 0 L6 1.8 L1.4 2 L0 6 L-1.4 2 L-6 1.8 L-3.8 0 L-5.4 -3.4 L-1.8 -2.6Z" fill="${['#e8742a', '#c8402a', '#ffc04a'][i % 3]}"/>`,
    egg: (i) => `<ellipse rx="3.2" ry="4.2" fill="${['#ff9ad8', '#9ae8ff', '#ffe07a', '#b8ff9a'][i % 4]}"/><path d="M-3 0 q3 -1.6 6 0" stroke="#fff" stroke-width="1" fill="none"/>`,
    endor: (i) => `<g stroke="${['#ffd23f', '#ff5ad0', '#5ad0ff'][i % 3]}" stroke-width="1.4"><path d="M-5 0 H5 M0 -5 V5 M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5"/></g>`,
    dune: () => `<circle r="${(1 + Math.random() * 1.6).toFixed(1)}" fill="#e8c890"/>`,
    galactic: (i) => `<path d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2Z" fill="${['#ffffff', '#5ae8ff', '#ff5ad0', '#b8a8ff'][i % 4]}"/>`,
  };
  const burst = (ui, pos) => {
    if (!cur || !cur.fx || !GLYPH[cur.fx] || perf() || !ui.fx || !pos) return;
    const k = 5;
    for (let i = 0; i < k; i++) {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('viewBox', '-8 -8 16 16'); s.setAttribute('class', 'col25-g');
      s.innerHTML = GLYPH[cur.fx](i);
      s.style.cssText = `position:absolute;left:${pos.x}px;top:${pos.y}px;width:16px;height:16px;pointer-events:none;z-index:7`;
      ui.fx.appendChild(s);
      const a = (i / k) * Math.PI * 2 + Math.random() * 0.6; const d = 26 + Math.random() * 22;
      s.animate([{ transform: 'translate(-50%,-50%) scale(.4) rotate(0deg)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d + 10}px)) scale(1) rotate(${(Math.random() * 360) | 0}deg)`, opacity: 0 }], { duration: 650, easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = () => s.remove();
    }
  };
  if (BU && !BU.__col25) {
    BU.__col25 = true;
    // Swap the colour argument of each basic effect while one of your attacks plays.
    const wrap = (name, idx, after) => { const f = BU[name]; if (typeof f !== 'function') return; BU[name] = function (...a) { if (cur) { a[idx] = paint(); if (after) after(this, a); } return f.apply(this, a); }; };
    wrap('laser', 2, (ui, a) => setTimeout(() => burst(ui, a[1]), 120 + (a[3] | 0)));
    wrap('flashAt', 1); wrap('sparks', 1); wrap('boom', 1); wrap('wave', 1); wrap('torpedo', 2, (ui, a) => burst(ui, a[1]));
    wrap('slash', 1, (ui, a) => burst(ui, a[0]));
    wrap('lightning', 3, (ui, a) => { const t = a[1] && a[1][0]; if (t) setTimeout(() => burst(ui, ui.center(t.uid)), 260); });
    const env = BU.env;
    if (env && typeof env.impact === 'function') { const imp = env.impact.bind(env); env.impact = (x, y, o = {}) => imp(x, y, cur ? { ...o, color: paint() } : o); }
    // Which attacks count: your own cards' basic attacks and the shield ultimate.
    const baseUse = BU.animateUse;
    BU.animateUse = async function (ev) {
      const actor = this.battle && this.battle.get(ev.uid);
      const c = equipped();
      const shield = ev.ultimate && actor && (D.ULT_ANIM[actor.id] || this.defaultAnim(actor)) === 'shield';
      const mine = actor && actor.side === 'player' && c.glow && (shield || (!ev.ultimate && ev.offensive !== false));
      if (!mine) return baseUse.call(this, ev);
      cur = c; prismI = 0;
      if (shield) document.body.classList.add('col25-dome');
      try { return await baseUse.call(this, ev); } finally { cur = null; document.body.classList.remove('col25-dome'); }
    };
  }
  // Your selection outline (your turn card, your targets, the ULT button) wears your colour in battle.
  const outline = () => {
    const c = equipped(); const bd = document.body; if (!bd) return;
    bd.classList.toggle('col25-on', !!c.glow);
    if (c.glow) { bd.style.setProperty('--col25', c.fx === 'prism' ? '#ff6ad5' : c.glow); bd.style.setProperty('--col25c', c.core); } else { bd.style.removeProperty('--col25'); bd.style.removeProperty('--col25c'); }
  };

  // ---------- Holiday pictures ----------
  // Twelve profile pictures (three per holiday) for everyone who plays during it.
  // Their art is in js/pf25.js, which loads once the game is up; until then a plain disc stands in.
  const PF = [['pf25_ld_elder', 'Life Day Elder', 'lifeday', '#c84a3a'], ['pf25_ld_cub', 'Wookiee Cub', 'lifeday', '#8a5a2a'], ['pf25_ld_tree', 'Tree of Life', 'lifeday', '#2a8a4a'],
    ['pf25_tg_nuna', 'The Grand Nuna', 'harvest', '#e8742a'], ['pf25_tg_farmer', 'Moisture Farmer', 'harvest', '#d8a860'], ['pf25_tg_milk', 'Blue Milk Toast', 'harvest', '#5ab0f0'],
    ['pf25_ea_hatch', 'Kyber Hatchling', 'easter', '#5ad0ff'], ['pf25_ea_cat', 'Loth-cat Basket', 'easter', '#ff9ad8'], ['pf25_ea_droid', 'Egg-Painter Droid', 'easter', '#ffd23f'],
    ['pf25_en_drum', 'Ewok Drummer', 'endor', '#8a5a2a'], ['pf25_en_ds', 'Death Star Falls', 'endor', '#ffd23f'], ['pf25_en_helm', 'Helmet Drums', 'endor', '#c8d4e0'],
    ['pf25_galaxy', 'The Galaxy Holocron', 'max', '#7a5cff']];
  for (const [id, name, ev, c] of PF) {
    if (D.UNIT_MAP[id]) continue;
    D.UNIT_MAP[id] = { id, name, kind: 'character', faction: 'none', rarity: 'common', role: 'support', traits: [], spd: 0, pf25: ev, bio: 'A holiday profile picture.' };
    if (root.Art && root.Art.addArt && !(root.PF25ART && root.PF25ART[id])) root.Art.addArt('char', id, () => `<rect width="100" height="100" fill="#0b1020"/><circle cx="50" cy="50" r="34" fill="${c}" opacity=".85"/><text x="50" y="58" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="22" fill="#fff">${name[0]}</text>`);
  }
  const pfOwned = () => PF.filter(([, , ev]) => (ev === 'max' ? !!(root.Max25 && root.Max25.done()) : B().ev[ev])).map(([id]) => id);

  // ---------- Styles ----------
  const st = document.createElement('style');
  st.textContent = `.col25-sw{width:100%;height:auto;display:block}.col25-sw.big{max-width:320px;margin:0 auto}
body.col25-on .player-row .bcard.active{border-color:var(--col25);box-shadow:0 0 0 2px color-mix(in srgb,var(--col25) 30%,transparent),0 0 26px color-mix(in srgb,var(--col25) 45%,transparent)}
body.col25-on .bcard.targetable:not(.friendly)::after{box-shadow:0 0 20px color-mix(in srgb,var(--col25) 65%,transparent)}
body.col25-on .bcard.targetable:not(.friendly){border-color:var(--col25)}
body.col25-on .abtn.ult{border-color:color-mix(in srgb,var(--col25) 45%,transparent)}body.col25-on .abtn.ult .ult-fill{background:var(--col25)}body.col25-on .abtn.ult .an{color:var(--col25)}
body.col25-dome .dome{border-color:var(--col25);background:radial-gradient(ellipse at 50% 30%,color-mix(in srgb,var(--col25) 28%,transparent),color-mix(in srgb,var(--col25) 8%,transparent) 70%);box-shadow:0 0 40px color-mix(in srgb,var(--col25) 50%,transparent),inset 0 0 40px color-mix(in srgb,var(--col25) 25%,transparent)}
.c25-it .col25-sw{border-radius:8px;background:#05070d;height:40px;width:100%;flex:0 0 auto}\n.col25-demo{padding:18px 10px;background:radial-gradient(ellipse at 50% 50%,#121a2e,#05070d);border-radius:12px;overflow:hidden}.col25-demo.go .col25-sw{animation:col25Shot .7s cubic-bezier(.2,.8,.3,1)}@keyframes col25Shot{from{transform:translateX(-70%);opacity:0}60%{opacity:1}}`;
  document.head.appendChild(st);

  // ---------- Start ----------
  // The save loads after this file, so wait for it.
  const boot = () => { if (!Player.state) return setTimeout(boot, 300); markEvent(); outline(); };
  boot();
  setInterval(() => { try { if (Player.state) { markEvent(); duelMax(); outline(); } } catch (e) { /* ignore */ } }, 15000);
  root.Col25 = { PF, pfOwned, COLOURS, COL, BADGES, items, swatch, wear, buy, owns, equipped, howOf, tierOf, tierDone, prog, done, eventNow, outline, B };
})(window);
