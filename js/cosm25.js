// Update 2.5 "Cosmetic": the Cosmetics tab, profile titles and Luthen's Gallery.
//  - Cosmetics tab (in your profile): Frames, Titles, Poses, Win screens and
//    Pack themes. Filter All / Owned / Locked, tap to preview on your card,
//    Equip what you own. New items carry a small red dot until you look.
//  - Titles show only on profile cards. 40 titles (20 earned, 20 sold by
//    Luthen), each in colour tiers: Silver, Gold, Kyber, Crimson, Aurora, Holo.
//  - Luthen's Gallery: the cosmetics shop and the only shop that shows Beskar.
// Everything cosmetic is kept with your HoloNet save (h.cos), next to Beskar.
// Off until 2.5 ships (Update25.on()).
(function (root) {
  'use strict';
  const UI = root.UI;
  const Player = root.Player;
  const D = root.GameData;
  if (!UI || !Player || !D) return;
  const on = () => !!(root.Update25 && root.Update25.on());
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => Math.round(n).toLocaleString('en-US');
  const HN = () => root.HN;
  const ready = () => on() && !!(HN() && HN().S && HN().cos25);
  const H = () => HN().S();
  const C = () => { const h = H(); if (!h.cos || typeof h.cos !== 'object') h.cos = {}; const c = h.cos; c.t = c.t || {}; c.own = c.own || {}; c.seen = c.seen || {}; c.eq = c.eq || {}; c.pk = c.pk || {}; return c; };
  const save = () => { try { HN().save(); } catch (e) { /* storage blocked */ } };
  const toast = (m) => (UI.toast ? UI.toast(m) : null);
  const ask = (q, ok, fn) => { if (!UI.confirmBox) return fn(); UI.confirmBox(q, '', ok).then((y) => { if (y) fn(); }); };
  // ---------- Titles ----------
  const TIERS = [
    ['silver', 'Silver', 'Clean silver', { beskar: 0 }],
    ['gold', 'Gold', 'Warm gold', { beskar: 1500 }],
    ['kyber', 'Kyber', 'Blue crystal shimmer', { beskar: 2500 }],
    ['crimson', 'Crimson', 'Deep red glow', { beskar: 3500 }],
    ['aurora', 'Aurora', 'Moving violet, teal and gold', { kyber: 200 }],
    ['holo', 'Holo', 'Flickering hologram', { kyber: 300 }],
  ];
  const TIER = Object.fromEntries(TIERS.map((t) => [t[0], t]));
  const TCOL = { silver: '#c8d4e0', gold: '#ffd23f', kyber: '#5ad0ff', crimson: '#ff4a5a', aurora: '#b07aff', holo: '#7affe0' };
  const st = () => { const h = H(); const P = Player.state; const c = P.c25 || {}; const cz = P.czw || {}; return { h, P, c, cz, duels: (h.duels || {}).w || 0, ws: h.wsMax || 0, units: Object.keys(P.units || {}).length, soc: h.soc || {} }; };
  const forged = (h) => Object.values(h.forge || {}).reduce((a, b) => a + (b | 0), 0);
  const frames = () => { try { return HN().cos25.owned(); } catch (e) { return []; } };
  const allPlanets = () => (D.PLANETS || []).every((p) => Player.planetComplete && Player.planetComplete(p.id));
  const bossesBeat = () => { const b = Player.state.bosses || {}; return (D.BOSS_ENCOUNTERS || []).filter((x) => b[x.id]).length; };
  const EARNED = [
    ['rookie', 'Rookie', 'Captain Rex\'s welcome kit', () => !!C().kit],
    ['raid_breaker', 'Raid Breaker', 'Top raid damage in your guild', () => frames().includes('raidbreaker')],
    ['kessel_runner', 'Kessel Runner', 'Win 50 all-ship battles', (s) => [s.c.fleet || 0, 50]],
    ['duelist', 'Duelist', 'Win 25 live duels', (s) => [s.duels, 25]],
    ['beskar_smith', 'Beskar Smith', 'Forge 20 times', (s) => [forged(s.h), 20]],
    ['holocron_keeper', 'Holocron Keeper', 'Own 100 cards', (s) => [s.units, 100]],
    ['streak_master', 'Streak Master', 'Reach a 25-win streak', (s) => [s.ws, 25]],
    ['legend', 'Legend', 'Reach the Legend league', (s) => (s.h.leagues || []).includes('legend')],
    ['guild_founder', 'Guild Founder', 'Lead a guild', () => { const r = HN().cos25.role(); return !!(r && r.r === 'leader'); }],
    ['jedi_knight', 'Jedi Knight', 'Win 200 battles with an all Light Side squad', (s) => [s.c.light || 0, 200]],
    ['sith_lord', 'Sith Lord', 'Win 200 battles with an all Dark Side squad', (s) => [s.c.dark || 0, 200]],
    ['season_veteran', 'Season Veteran', 'Finish 5 seasons', (s) => [s.soc.seasonsDone || 0, 5]],
    ['loyal', 'Loyal', 'Stay in one guild for 3 seasons', (s) => { const l = C().lg; return [l && s.h.guild === l.g ? (s.soc.seasonsDone || 0) - l.s : 0, 3]; }],
    ['liberator', 'Liberator', 'Clear every world', () => allPlanets()],
    ['monster_hunter', 'Monster Hunter', 'Beat every boss', () => [bossesBeat(), (D.BOSS_ENCOUNTERS || []).length || 1]],
    ['fleet_admiral', 'Fleet Admiral', 'Win 200 all-ship battles', (s) => [s.c.fleet || 0, 200]],
    ['pazaak_champion', 'Pazaak Champion', 'Win 50 Pazaak matches', (s) => [s.cz.pz || 0, 50]],
    ['podrace_prophet', 'Podrace Prophet', 'Win 10 long-shot podrace bets', (s) => [s.cz.long || 0, 10]],
    ['dejarik_master', 'Dejarik Master', 'Win 25 Holo-Chess wagers', (s) => [s.cz.hc || 0, 25]],
    ['recruiter', 'Recruiter', 'Invite 10 friends who reach level 5', (s) => !!(s.P.invites || {}).squad],
    ['collector', 'Collector', 'Own 25 frames', () => [frames().length, 25]],
    ['high_roller', 'High Roller', 'Win 25 games in the casino', (s) => [s.cz.w || 0, 25]],
    ['guardian', 'Guardian', 'Heal 1,000,000 health in battles', () => [Math.round(C().heal || 0), 1000000]],
  ];
  const SHOP_T = ['Smuggler', 'Scoundrel', 'Bounty Hunter', 'Rebel Ace', 'Imperial Officer', 'Mandalorian', 'Sith Apprentice', 'Jedi Master', 'Clone Commander', 'Droid Whisperer', 'Cantina Regular', 'Sabacc Shark', 'Spice Runner', 'Moisture Farmer', 'Holo Star', 'Kyber Seeker', 'Outer Rim Legend', 'Nerf Herder', 'Lucky Star', 'The Chosen One'];
  const TITLES = [
    ...EARNED.map(([id, n, how, chk]) => ({ id, n, how, chk, earn: true })),
    ...SHOP_T.map((n) => ({ id: n.toLowerCase().replace(/[^a-z]+/g, '_'), n, how: "Luthen's Gallery · 800 Beskar", cost: { beskar: 800 } })),
  ];
  // Rare and exclusive titles come in one fixed colour; the rest start Silver and can be upgraded.
  const FIXED = { rookie: 'silver', legend: 'aurora', raid_breaker: 'crimson', streak_master: 'gold', season_veteran: 'kyber', liberator: 'holo', monster_hunter: 'crimson', collector: 'kyber', high_roller: 'gold', guardian: 'kyber', the_chosen_one: 'holo', outer_rim_legend: 'aurora' };
  for (const t of TITLES) if (FIXED[t.id]) { t.fix = FIXED[t.id]; if (t.cost) { t.cost = { ...TIERS.find((x) => x[0] === t.fix)[3] }; t.how = "Luthen's Gallery · " + (t.cost.kyber ? t.cost.kyber + ' Kyber' : t.cost.beskar.toLocaleString('en-US') + ' Beskar'); } }
  const baseTier = (t) => t.fix || 'silver';
  // Two titles also bring a badge, with their own scene the moment you earn them.
  const BADGED = { high_roller: { icon: 'highroller', line: 'Watto lost count of your winnings. So did the Hutts.' }, guardian: { icon: 'guardian', line: 'A million health restored. Your squad owes you their lives.' } };
  if (root.Icons && root.Icons.SHAPES) {
    root.Icons.SHAPES.highroller = root.Icons.SHAPES.highroller || '<path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" opacity=".35"/><rect x="6.5" y="8" width="7" height="7" rx="1.4"/><rect x="11" y="10.5" width="7" height="7" rx="1.4" opacity=".8"/><circle cx="8.6" cy="10.1" r=".9" fill="#000" fill-opacity=".55"/><circle cx="11.4" cy="12.9" r=".9" fill="#000" fill-opacity=".55"/><circle cx="14.5" cy="14" r=".9" fill="#000" fill-opacity=".55"/>';
    root.Icons.SHAPES.guardian = root.Icons.SHAPES.guardian || '<path d="M12 2.5 20 5.5v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z"/><path d="M12 8v8M8 12h8" stroke="#000" stroke-opacity=".55" stroke-width="2.2" stroke-linecap="round"/>';
  }
  if (UI.hooks && UI.hooks.feats && !UI.hooks.__t25) {
    UI.hooks.__t25 = true;
    UI.hooks.feats.push(() => { if (!ready()) return []; return Object.entries(BADGED).map(([id, b]) => { const t = TMAP[id]; const p = prog(t) || {}; return { id: 'b25_' + id, tier: 4, icon: b.icon, name: t.n, desc: t.how, have: p.need ? Math.min(p.have, p.need) : (p.done ? 1 : 0), need: p.need || 1 }; }); });
  }
  function titleScene(id) {
    const t = TMAP[id]; const b = BADGED[id]; if (!t || !b) return;
    const o = document.createElement('div');
    o.className = 'tb25';
    o.innerHTML = `<div class="tb25-rays"></div><div class="tb25-card"><span class="tb25-badge">${root.Icons ? root.Icons.svg(b.icon) : ''}</span><p class="tb25-k">NEW TITLE &amp; BADGE</p>${titleHtml({ n: t.n, t: baseTier(t) })}<p class="tb25-line">${esc(b.line)}</p><p class="tb25-how">${esc(t.how)}</p><div class="tb25-btns"><button type="button" class="c25-btn" data-tbw>Wear it</button><button type="button" class="lu25-try" data-tbx>Later</button></div></div>`;
    document.body.appendChild(o);
    o.addEventListener('click', (e) => { if (e.target.closest('[data-tbw]')) { wearTitle(id, baseTier(t)); toast(t.n + ' equipped.'); } if (e.target.closest('[data-tbw], [data-tbx]')) { o.classList.add('out'); setTimeout(() => o.remove(), 350); } });
  }
  const TMAP = Object.fromEntries(TITLES.map((t) => [t.id, t]));
  const prog = (t) => { if (!t.chk) return null; try { const r = t.chk(st()); if (Array.isArray(r)) return { have: Math.min(r[0], r[1]), need: r[1], done: r[0] >= r[1] }; return { done: !!r }; } catch (e) { return { done: false }; } };
  // Earned titles unlock in Silver the moment you qualify.
  function sync() {
    if (!ready()) return;
    const c = C(); const h = H(); let n = 0;
    if (h.guild && (!c.lg || c.lg.g !== h.guild)) { c.lg = { g: h.guild, s: (h.soc || {}).seasonsDone || 0 }; n++; }
    for (const t of TITLES) if (t.earn && !c.t[t.id] && (prog(t) || {}).done) { c.t[t.id] = [baseTier(t)]; c.seen['ti:' + t.id] = 0; if (BADGED[t.id]) { c.fxq = (c.fxq || []).concat(t.id); } n++; }
    if (n) save();
  }
  const tiersOf = (id) => (C().t[id] || []);
  const titleHtml = (ti) => { if (!on() || !ti || !ti.n) return ''; const tier = TIER[ti.t] ? ti.t : 'silver'; return '<span class="t25 tt-' + tier + '">' + esc(String(ti.n).toUpperCase().slice(0, 24)) + '</span>'; };
  // ---------- Poses, win screens, pack themes ----------
  const POSES = [
    ['jedi', 'Saber Salute', 'Jedi'], ['sith', 'Dark Loom', 'Sith & Inquisitors'], ['hunter', 'Helmet Tip', 'Bounty Hunters & Mandalorians'], ['trooperl', 'Squad Salute', 'Rebels, Clones & the Bad Batch'],
    ['trooperd', 'Formation Stomp', 'Imperial Troops & Droid Army'], ['scoundrel', 'Lucky Chip', 'Scoundrels'], ['leader', 'Command Point', 'Leaders & Commanders'], ['healer', 'Healing Glow', 'Healers'],
    ['droid', 'Beep Spin', 'Droids'], ['cute', 'Little Hop', 'Small & Cuddly'], ['beast', 'Primal Roar', 'Beasts & Monsters'], ['shipl', 'Victory Roll', 'Light Side Ships'], ['shipd', 'Strafe Pass', 'Dark Side Ships'], ['capital', 'Broadside', 'Capital Ships & Stations'],
  ].map(([id, n, ty], i) => ({ id, n, ty, c: ['#7affc8', '#ff5a6a', '#ffd27a', '#8fe8ff', '#c8d4e0', '#ffd23f', '#ffb43a', '#7aff8a', '#5ad0ff', '#ffb0d0', '#ff9a3a', '#5ab4ff', '#ff6a8a', '#b8c4d0'][i], how: 'Be MVP with a ' + ty + ' card' }));
  const WINS = [
    ['medal', 'Medal Ceremony', '#ffd23f', null, 'Everyone has it'], ['cantina', 'Cantina Cheer', '#ff8ab0', { beskar: 1500 }, "Luthen's Gallery · 1,500 Beskar"],
    ['lightspeed', 'Jump to Lightspeed', '#8fe8ff', (s) => [s.c.fleet || 0, 100], 'Win 100 all-ship battles'], ['hoth', 'Hoth Hangar', '#bfe0ff', () => Player.planetComplete && D.PLANET_MAP && D.PLANET_MAP.hoth ? Player.planetComplete('hoth') : false, 'Clear the Hoth world'],
    ['deathstar', 'Death Star Bridge', '#ff5a6a', (s) => [s.c.dark || 0, 200], 'Win 200 Dark Side battles'], ['temple', 'Jedi Temple', '#7affc8', (s) => [s.c.light || 0, 200], 'Win 200 Light Side battles'],
    ['forge', 'Forge Strike', '#ff9a3a', (s) => [forged(s.h), 20], 'Forge 20 times'], ['hand', 'Invisible Hand', '#c89aff', 'event', "A Luthen's Gallery exclusive"],
    ['boonta', 'Boonta Eve Finish', '#ffb347', { beskar: 1500 }, "Luthen's Gallery · 1,500 Beskar"],
  ].map(([id, n, c, get, how]) => ({ id, n, c, get, how }));
  const PACKS = [
    ['default', 'Default', '#9aa4ae', null, 'Everyone has it'], ['beskar', 'Beskar Crate', '#c8d4e0', (s) => [forged(s.h), 10], 'Forge 10 times'],
    ['holocron', 'Holocron', '#5ad0ff', (s) => [s.units, 100], 'Own 100 cards'], ['carbonite', 'Carbonite Thaw', '#8fe8ff', { kyber: 230 }, "Luthen's Gallery · 230 Kyber"],
    ['sithvault', 'Sith Vault', '#ff5a6a', (s) => [s.c.dark || 0, 200], 'Win 200 Dark Side battles'], ['droid', 'Droid Delivery', '#ffd23f', (s) => [s.P.stats.packsOpened || 0, 50], 'Open 50 crates'],
    ['geode', 'Kyber Geode', '#b07aff', { kyber: 230 }, "Luthen's Gallery · 230 Kyber"],
    ['hyper', 'Hyperspace Drop', '#8fb8ff', (s) => [s.c.fleet || 0, 50], 'Win 50 all-ship battles'],
    ['bacta', 'Bacta Tank', '#5affc8', { beskar: 2000 }, "Luthen's Gallery · 2,000 Beskar"],
    ['sarlacc', 'Sarlacc Pit', '#e8a060', { kyber: 230 }, "Luthen's Gallery · 230 Kyber"],
  ].map(([id, n, c, get, how]) => ({ id, n, c, get, how }));
  // Luthen's library (js/lib25.js): win screens join the list, battle intros get their own tab.
  const LIB = root.Lib25 ? root.Lib25.CAT : [];
  for (const x of LIB) if (x.k === 'wi') WINS.push({ id: 'lib_' + x.id, n: x.n, c: x.c, get: x.cost, how: "Luthen's Gallery · weekly rotation", lib: x.id });
  const INTROS = [{ id: 'vs', n: 'Lightsaber VS', c: '#8fe8ff', get: null, how: 'Everyone has it' }].concat(LIB.filter((x) => x.k === 'in').map((x) => ({ id: x.id, n: x.n, c: x.c, get: x.cost, how: "Luthen's Gallery · weekly rotation", lib: x.id })));
  const CRATES = (D.PACKS || []).map((p) => [p.id, p.name]);
  const getProg = (x) => { if (!x.get || x.get === 'event' || (typeof x.get === 'object' && !Array.isArray(x.get) && typeof x.get !== 'function')) return null; try { const r = x.get(st()); if (Array.isArray(r)) return { have: Math.min(r[0], r[1]), need: r[1], done: r[0] >= r[1] }; return { done: !!r }; } catch (e) { return { done: false }; } };
  const ownsItem = (kind, x) => { if (kind === 'po') return !!(C().mvp || {})[x.id] || !!C().own['po:' + x.id]; if (!x.get) return true; if (C().own[kind + ':' + x.id]) return true; const p = getProg(x); return !!(p && p.done); };
  const posesOwned = () => POSES.filter((p) => ownsItem('po', p));
  // ---------- Buying (Beskar from the HoloNet save, Kyber from the wallet) ----------
  const afford = (cost) => (H().beskar || 0) >= (cost.beskar || 0) && (Player.state.crystals || 0) >= (cost.kyber || 0);
  const priceHtml = (cost) => cost.kyber ? '<span class="c25-k">' + fmt(cost.kyber) + ' Kyber</span>' : '<span class="c25-b">' + fmt(cost.beskar) + ' Beskar</span>';
  function pay(cost) {
    if (!afford(cost)) { toast(cost.kyber ? 'Not enough Kyber.' : 'Not enough Beskar. Win HoloNet battles to earn more.'); return false; }
    if (cost.beskar) H().beskar -= cost.beskar;
    if (cost.kyber) { Player.state.crystals -= cost.kyber; Player.save(); }
    save(); if (UI.updateWallet) UI.updateWallet();
    return true;
  }
  // ---------- Equipping ----------
  const eq = {
    fr: () => HN().cos25.worn(),
    ti: () => (HN().cos25.prof().ti || null),
    po: () => C().eq.po || null,
    wi: () => C().eq.wi || 'medal',
    pa: (crate) => C().pk[crate] || 'default',
    in: () => (INTROS.some((x) => x.id === C().eq.in) ? C().eq.in : 'vs'),
  };
  function wearTitle(id, tier) {
    const t = TMAP[id]; if (!t || !tiersOf(id).includes(tier)) return false;
    HN().cos25.prof().ti = { n: t.n, t: tier, id }; save(); HN().cos25.publish(); return true;
  }
  // ---------- Cosmetics tab ----------
  const KINDS = [['fr', 'Frames'], ['ti', 'Titles'], ['po', 'Poses'], ['wi', 'Win screens'], ['pa', 'Pack themes']].concat(INTROS.length > 1 ? [['in', 'Intros']] : []);
  function items(kind) {
    const c = C();
    if (kind === 'fr') {
      const own = frames(); const F = HN().cos25.FRAMES;
      return HN().cos25.shown().map(([id, f]) => ({ id, n: f.name, how: f.how, own: own.includes(id), eq: eq.fr() === id }));
    }
    if (kind === 'ti') {
      const w = eq.ti();
      return TITLES.filter((t) => t.earn || tiersOf(t.id).length).map((t) => { const tiers = tiersOf(t.id); const p = prog(t); const best = TIERS.map((x) => x[0]).filter((x) => tiers.includes(x)).pop() || 'silver'; return { id: t.id, n: t.n, how: t.how, own: tiers.length > 0, eq: !!(w && w.id === t.id), tier: w && w.id === t.id ? w.t : best, p: p && !p.done && p.need ? p : null, t }; });
    }
    if (kind === 'po') return POSES.map((x) => ({ id: x.id, n: x.n, how: x.how, sub: x.ty, c: x.c, own: ownsItem('po', x), eq: eq.po() === x.id }));
    const shopOnly = (x) => x.get === 'event' || (x.get && typeof x.get === 'object');
    if (kind === 'wi') return WINS.filter((x) => !shopOnly(x) || ownsItem('wi', x)).map((x) => { const p = getProg(x); return { id: x.id, n: x.n, how: x.how, c: x.c, own: ownsItem('wi', x), eq: eq.wi() === x.id, p: p && !p.done && p.need ? p : null }; });
    if (kind === 'in') return INTROS.filter((x) => !shopOnly(x) || ownsItem('in', x)).map((x) => ({ id: x.id, n: x.n, how: x.how, c: x.c, own: ownsItem('in', x), eq: eq.in() === x.id }));
    return PACKS.filter((x) => !shopOnly(x) || ownsItem('pa', x)).map((x) => { const p = getProg(x); return { id: x.id, n: x.n, how: x.how, c: x.c, own: ownsItem('pa', x), p: p && !p.done && p.need ? p : null }; });
  }
  const isNew = (kind, x) => x.own && C().seen[kind + ':' + x.id] === 0;
  function open(back) {
    if (!ready()) { toast('Open the HoloNet once to set up your profile, then come back.'); return; }
    sync();
    const c = C();
    // Anything owned that has never been seen gets a dot; the first visit marks the starting kit as seen.
    if (!c.seenInit) { for (const [k] of KINDS) for (const x of items(k)) if (x.own) c.seen[k + ':' + x.id] = 1; c.seenInit = 1; save(); }
    for (const [k] of KINDS) for (const x of items(k)) if (x.own && c.seen[k + ':' + x.id] == null) c.seen[k + ':' + x.id] = 0;
    let kind = 'fr', filt = 'all', crate = (CRATES[0] || ['recruit'])[0], sel = null;
    const me = HN().cos25.me();
    const m = UI.openModal(`<div class="c25" role="dialog" aria-label="Cosmetics"><div class="c25-head"><h2>Cosmetics</h2><button type="button" class="btn btn-small" data-c25x>Close</button></div>
      <div class="c25-prev"><div class="c25-card" data-card><span class="c25-av" data-av></span><div class="c25-id"><small>YOUR PROFILE CARD</small><b>${esc(me.tag || 'You')}</b><span data-ti></span><span class="c25-sub">Level ${Player.state.account.level}</span></div></div>
      <dl class="c25-eq"><div><dt>Pose</dt><dd data-po></dd></div><div><dt>Win screen</dt><dd data-wi></dd></div><div><dt>Pack themes</dt><dd data-pa></dd></div></dl></div>
      <div class="c25-tabs" role="tablist">${KINDS.map(([k, n]) => `<button type="button" role="tab" data-ck="${k}">${n} <i></i><u class="c25-dot" hidden></u></button>`).join('')}</div>
      <div class="c25-bar"><div class="c25-seg">${['All', 'Owned', 'Locked'].map((n) => `<button type="button" data-cf="${n.toLowerCase()}">${n}</button>`).join('')}</div><div class="c25-seg" data-crates hidden>${CRATES.map(([id, n]) => `<button type="button" data-cc="${id}">${n}</button>`).join('')}</div></div>
      <div class="c25-grid" data-grid></div><div class="c25-det" data-det></div></div>`, { wide: true });
    const R = m.root;
    const $ = (s) => R.querySelector(s);
    const paint = (pv) => {
      const fr = pv && pv.kind === 'fr' ? pv.x.id : eq.fr();
      $('[data-av]').innerHTML = HN().cos25.avatar({ ...me, frame: fr }, 'lg');
      const ti = pv && pv.kind === 'ti' ? { n: pv.x.n, t: pv.tier || pv.x.tier } : eq.ti();
      $('[data-ti]').innerHTML = ti ? titleHtml(ti) : '<span class="muted small">No title</span>';
      const po = POSES.find((x) => x.id === (pv && pv.kind === 'po' ? pv.x.id : eq.po()));
      $('[data-po]').textContent = po ? po.n + (pv && pv.kind === 'po' && !pv.x.own ? ' (preview)' : '') : 'Your MVP\'s own type';
      const wi = WINS.find((x) => x.id === (pv && pv.kind === 'wi' ? pv.x.id : eq.wi()));
      $('[data-wi]').textContent = wi.n + (pv && pv.kind === 'wi' && !pv.x.own ? ' (preview)' : '');
      $('[data-pa]').textContent = CRATES.map(([id, n]) => n + ': ' + (PACKS.find((x) => x.id === (pv && pv.kind === 'pa' && id === crate ? pv.x.id : eq.pa(id))) || PACKS[0]).n).join(' · ');
      const card = $('[data-card]'); card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop');
    };
    const swatch = (k, x) => {
      if (k === 'fr') return '<span class="c25-fr">' + HN().cos25.avatar({ ...me, frame: x.id }, 'md') + '</span>';
      if (k === 'ti') return titleHtml({ n: x.n, t: x.tier });
      if (root.Cos25FX && root.Cos25FX.thumb) { const th = root.Cos25FX.thumb(k, x.id); if (th) return th; }
      return '<span class="c25-sw ' + k + '" style="--c:' + x.c + '"></span>';
    };
    // Tapping an item opens it big: Try it on, Equip (if you own it) and Back to mine.
    const pop = (x) => {
      const k = kind;
      const isEq = k === 'pa' ? eq.pa(crate) === x.id : x.eq;
      let big = '';
      if (k === 'fr') big = `<div class="c25-card pop"><span class="c25-av">${HN().cos25.avatar({ ...me, frame: x.id }, 'lg')}</span><div class="c25-id"><small>FRAME</small><b>${esc(me.tag || 'You')}</b><span class="c25-sub">${esc(x.n)}</span></div></div>`;
      else if (k === 'ti') big = `<div class="c25-card pop"><span class="c25-av">${HN().cos25.avatar(me, 'lg')}</span><div class="c25-id"><small>TITLE</small><b>${esc(me.tag || 'You')}</b>${titleHtml({ n: x.n, t: x.tier })}</div></div>`;
      else big = '<div class="c25-try"></div>';
      let tiers = '';
      if (k === 'ti' && x.own) { const have = tiersOf(x.id); tiers = x.t.fix ? `<div class="c25-tiers"><span class="c25-tier on">${titleHtml({ n: TIERS.find((q) => q[0] === x.t.fix)[1], t: x.t.fix })}<small>Fixed colour</small></span></div>` : '<div class="c25-tiers">' + TIERS.map(([tid, tn]) => have.includes(tid) ? `<button type="button" class="c25-tier" data-ptier="${tid}">${titleHtml({ n: tn, t: tid })}</button>` : `<span class="c25-tier lockd">${titleHtml({ n: tn, t: tid })}<small>Luthen's Gallery</small></span>`).join('') + '</div>'; }
      const pm = UI.openModal(`<div class="c25 c25-pop"><h2>${esc(x.n)}</h2>${big}<p class="c25-pst">${x.own ? (isEq ? 'Equipped' : 'You own this') : 'Locked · ' + esc(x.how) + (x.p ? ' (' + fmt(x.p.have) + ' / ' + fmt(x.p.need) + ')' : '')}</p>${tiers}<div class="c25-pbtns"><button type="button" class="c25-tbtn" data-ptry>Try it on</button>${x.own ? `<button type="button" class="c25-btn" data-peq ${isEq && k !== 'ti' ? 'disabled' : ''}>${isEq && k !== 'ti' ? 'Equipped' : 'Equip'}</button>` : ''}<button type="button" class="c25-ghost" data-pback>Back to mine</button></div></div>`, { wide: true });
      const Rp = pm.root;
      let tier = x.tier;
      const show = () => { if (['po', 'wi', 'pa', 'in'].includes(k) && root.Cos25FX) root.Cos25FX.preview(k, x.id, Rp); };
      show();
      Rp.addEventListener('click', (e) => {
        const pt = e.target.closest('[data-ptier]'); if (pt) { tier = pt.dataset.ptier; Rp.querySelectorAll('[data-ptier]').forEach((b) => b.classList.toggle('on', b === pt)); const ti = Rp.querySelector('.c25-id .t25'); if (ti) ti.outerHTML = titleHtml({ n: x.n, t: tier }); return; }
        if (e.target.closest('[data-ptry]')) { if (['po', 'wi', 'pa', 'in'].includes(k)) { const old = Rp.querySelector('.fx25-prev'); if (old) old.outerHTML = '<div class="c25-try"></div>'; show(); } else { paint({ kind: k, x: { ...x, tier } }); pm.close(); } return; }
        if (e.target.closest('[data-pback]')) { pm.close(); sel = null; paint(); grid(); return; }
        if (e.target.closest('[data-peq]')) {
          if (k === 'fr') HN().cos25.wear(x.id); else if (k === 'ti') wearTitle(x.id, tiersOf(x.id).includes(tier) ? tier : tiersOf(x.id)[0]); else if (k === 'po') C().eq.po = x.id; else if (k === 'wi') C().eq.wi = x.id; else if (k === 'in') C().eq.in = x.id; else if (k === 'pa') C().pk[crate] = x.id;
          if (k === 'wi' && x.id.startsWith('lib_') && root.Lib25) root.Lib25.load(x.id.slice(4)); if (k === 'in' && root.Lib25 && x.id !== 'vs') root.Lib25.load(x.id);
          save(); toast(x.n + ' equipped.'); pm.close(); paint(); grid(); detail(null);
        }
      });
    };
    const counts = () => R.querySelectorAll('[data-ck]').forEach((b) => { const L = items(b.dataset.ck); b.querySelector('i').textContent = L.filter((x) => x.own).length + '/' + L.length; b.querySelector('.c25-dot').hidden = !L.some((x) => isNew(b.dataset.ck, x)); b.classList.toggle('on', b.dataset.ck === kind); b.setAttribute('aria-selected', b.dataset.ck === kind); });
    const grid = () => {
      const L = items(kind).filter((x) => filt === 'all' || (filt === 'owned' ? x.own : !x.own));
      const curPa = kind === 'pa' ? eq.pa(crate) : null;
      $('[data-grid]').innerHTML = L.length ? L.map((x) => { const isEq = kind === 'pa' ? curPa === x.id : x.eq; return `<button type="button" class="c25-it ${x.own ? 'own' : 'lock'}${isEq ? ' eq' : ''}${sel === x.id ? ' sel' : ''}" data-id="${esc(x.id)}">${isNew(kind, x) ? '<u class="c25-dot" aria-label="New"></u>' : ''}${x.own ? '' : '<span class="c25-lk" aria-hidden="true"></span>'}${swatch(kind, x)}${kind !== 'ti' ? `<b>${esc(x.n)}</b>` : ''}<small>${isEq ? 'Equipped' : x.own ? esc(x.sub || 'Owned') : esc(x.how)}</small>${x.p ? `<span class="c25-bar2"><i style="width:${Math.round((x.p.have / x.p.need) * 100)}%"></i></span><small>${fmt(x.p.have)} / ${fmt(x.p.need)}</small>` : ''}</button>`; }).join('') : '<p class="muted">Nothing here yet.</p>';
      R.querySelectorAll('[data-cf]').forEach((b) => b.classList.toggle('on', b.dataset.cf === filt));
      R.querySelectorAll('[data-cc]').forEach((b) => b.classList.toggle('on', b.dataset.cc === crate));
      $('[data-crates]').hidden = kind !== 'pa';
      counts();
    };
    const detail = (x) => {
      const d = $('[data-det]');
      if (!x || true) { d.innerHTML = '<b>Tap any item</b><span>to open it big. Try it on, Equip what you own, or go back to yours.</span>'; return; }
      let act = '';
      if (kind === 'ti' && x.own) {
        const have = tiersOf(x.id);
        act = x.t.fix ? `<div class="c25-tiers"><button type="button" class="c25-tier ${x.eq ? 'on' : ''}" data-wear="${x.t.fix}">${titleHtml({ n: TIERS.find((q) => q[0] === x.t.fix)[1], t: x.t.fix })}<small>Fixed colour</small></button></div>` : '<div class="c25-tiers">' + TIERS.map(([tid, tn, , cost]) => have.includes(tid) ? `<button type="button" class="c25-tier ${x.eq && x.tier === tid ? 'on' : ''}" data-wear="${tid}">${titleHtml({ n: tn, t: tid })}</button>` : `<span class="c25-tier lockd" title="${esc(tn)}">${titleHtml({ n: tn, t: tid })}<small>Luthen's Gallery</small></span>`).join('') + '</div>';
      } else if (x.own) {
        const isEq = kind === 'pa' ? eq.pa(crate) === x.id : x.eq;
        act = `<button type="button" class="c25-btn" data-equip ${isEq ? 'disabled' : ''}>${isEq ? 'Equipped' : 'Equip'}</button>`;
      }
      if (['po', 'wi', 'pa', 'in'].includes(kind) && root.Cos25FX) act = `<button type="button" class="lu25-try" data-tryit>Try it on</button>` + act;
      d.innerHTML = `<b>${esc(x.n)}</b><span>${x.own ? (kind === 'pa' ? 'Owned · applies to the ' + CRATES.find((cc) => cc[0] === crate)[1] : kind === 'ti' ? 'Pick a colour to wear it. More colours are at Luthen\'s Gallery.' : 'Owned') : 'Locked · ' + esc(x.how) + (x.p ? ' (' + fmt(x.p.have) + ' / ' + fmt(x.p.need) + ')' : '')}</span>${act}`;
    };
    R.addEventListener('click', (e) => {
      if (e.target.closest('[data-c25x]')) { m.close(); if (back) back(); return; }
      const k = e.target.closest('[data-ck]'); if (k) { kind = k.dataset.ck; sel = null; paint(); grid(); detail(null); return; }
      const f = e.target.closest('[data-cf]'); if (f) { filt = f.dataset.cf; grid(); return; }
      const cc = e.target.closest('[data-cc]'); if (cc) { crate = cc.dataset.cc; sel = null; grid(); detail(null); return; }
      const it = e.target.closest('.c25-it');
      if (it) { const x = items(kind).find((y) => y.id === it.dataset.id); if (!x) return; sel = x.id; if (C().seen[kind + ':' + x.id] === 0) { C().seen[kind + ':' + x.id] = 1; save(); } grid(); pop(x); return; }
      const x = items(kind).find((y) => y.id === sel); if (!x) return;
      if (e.target.closest('[data-equip]')) {
        if (kind === 'fr') HN().cos25.wear(x.id);
        else if (kind === 'po') C().eq.po = x.id;
        else if (kind === 'wi') C().eq.wi = x.id;
        else if (kind === 'in') C().eq.in = x.id;
        else if (kind === 'pa') C().pk[crate] = x.id;
        save(); toast(x.n + ' equipped.'); paint(); grid(); detail(items(kind).find((y) => y.id === sel)); return;
      }
      if (e.target.closest('[data-tryit]')) { const pm = UI.openModal(`<div class="c25" style="max-width:640px"><h2>${esc(x.n)}</h2><div class="c25-try"></div><button type="button" class="btn" data-x>Close</button></div>`, { wide: true }); root.Cos25FX.preview(kind, x.id, pm.root); pm.root.addEventListener('click', (ev) => { if (ev.target.closest('[data-x]')) pm.close(); }); return; }
      const w = e.target.closest('[data-wear]'); if (w) { wearTitle(x.id, w.dataset.wear); toast('Title equipped.'); paint(); grid(); detail(items(kind).find((y) => y.id === sel)); return; }
      const up = e.target.closest('[data-up]');
      if (up) { const tier = TIER[up.dataset.up]; ask(`Upgrade ${x.n} to ${tier[1]} for ${tier[3].kyber ? fmt(tier[3].kyber) + ' Kyber' : fmt(tier[3].beskar) + ' Beskar'}?`, 'Upgrade', () => { if (!pay(tier[3])) return; C().t[x.id] = [...new Set([...tiersOf(x.id), tier[0]])]; save(); wearTitle(x.id, tier[0]); toast(`${x.n} is now ${tier[1]}.`); paint(); grid(); detail(items(kind).find((y) => y.id === sel)); }); return; }
      if (e.target.closest('[data-goshop]')) { m.close(); UI.App.ui.shop25 = 'luthen'; UI.App.go('market'); }
    });
    paint(); grid(); detail(null);
  }
  // ---------- Luthen's Gallery ----------
  const LUTHEN = "<svg viewBox=\"0 0 480 300\" class=\"lu\" aria-label=\"Luthen Rael in his antiquities gallery\"><defs>\n<radialGradient id=\"lw\" cx=\".5\" cy=\".35\"><stop offset=\"0\" stop-color=\"#6a4a2a\"/><stop offset=\".55\" stop-color=\"#2e1c10\"/><stop offset=\"1\" stop-color=\"#120a06\"/></radialGradient>\n<radialGradient id=\"ll\" cx=\".5\" cy=\".5\"><stop offset=\"0\" stop-color=\"#ffd890\" stop-opacity=\".55\"/><stop offset=\"1\" stop-color=\"#ffd890\" stop-opacity=\"0\"/></radialGradient>\n<linearGradient id=\"lc\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#2c2a3a\"/><stop offset=\".5\" stop-color=\"#1a1824\"/><stop offset=\"1\" stop-color=\"#0c0a12\"/></linearGradient>\n<linearGradient id=\"lr\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#4a1a24\"/><stop offset=\".5\" stop-color=\"#6a2632\"/><stop offset=\"1\" stop-color=\"#3a1420\"/></linearGradient>\n<linearGradient id=\"lf\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#e8c0a0\"/><stop offset=\"1\" stop-color=\"#c8967a\"/></linearGradient>\n<linearGradient id=\"lh\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f0f0f4\"/><stop offset=\".6\" stop-color=\"#bcbcc6\"/><stop offset=\"1\" stop-color=\"#8a8a96\"/></linearGradient>\n<linearGradient id=\"ld\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#6a4426\"/><stop offset=\"1\" stop-color=\"#2e1c0e\"/></linearGradient>\n<pattern id=\"lb\" width=\"10\" height=\"10\" patternUnits=\"userSpaceOnUse\"><path d=\"M5 0 L10 5 L5 10 L0 5Z\" fill=\"none\" stroke=\"#c8a050\" stroke-opacity=\".25\" stroke-width=\".8\"/></pattern></defs>\n<rect width=\"480\" height=\"300\" fill=\"url(#lw)\"/>\n<g opacity=\".55\"><path d=\"M180 30 L300 30 L300 150 L180 150Z\" fill=\"#1e120a\"/><path d=\"M186 150 L186 70 C186 54 214 54 214 70 L214 150Z\" fill=\"#2a1a0e\" stroke=\"#4a3018\"/><path d=\"M226 150 L226 70 C226 54 254 54 254 70 L254 150Z\" fill=\"#2a1a0e\" stroke=\"#4a3018\"/><path d=\"M266 150 L266 70 C266 54 294 54 294 70 L294 150Z\" fill=\"#2a1a0e\" stroke=\"#4a3018\"/><g transform=\"translate(200 140) scale(0.7)\"><path d=\"M-6 0 L-4 -8 C-11 -11 -10 -22 0 -22 C10 -22 11 -11 4 -8 L6 0Z\" fill=\"#c8a050\"/><path d=\"M-5 -15 h10\" stroke=\"#7a5a20\" stroke-width=\"1.6\"/></g><g transform=\"translate(240 140) scale(0.7)\"><path d=\"M-5 0 C-10 -6 -10 -18 0 -22 C10 -18 10 -6 5 0Z\" fill=\"#c8b070\"/><circle cy=\"-12\" r=\"3\" fill=\"#3a2a1a\"/></g><g transform=\"translate(280 140) scale(0.7)\"><path d=\"M-7 0 C-7 -10 -4 -16 0 -16 C4 -16 7 -10 7 0Z\" fill=\"#b8902a\"/><circle cy=\"-18\" r=\"2\" fill=\"none\" stroke=\"#b8902a\" stroke-width=\"1.4\"/><circle cy=\"1\" r=\"1.6\" fill=\"#7a5a10\"/></g></g>\n<path d=\"M0 0 L180 30 L180 150 L0 190Z\" fill=\"#24160c\"/><path d=\"M480 0 L300 30 L300 150 L480 190Z\" fill=\"#24160c\"/>\n<path d=\"M10 56 L170 58 L170 62 L10 62Z\" fill=\"#6a4a2e\"/><path d=\"M470 56 L310 58 L310 62 L470 62Z\" fill=\"#6a4a2e\"/><path d=\"M10 102 L170 94.80000000000001 L170 98.80000000000001 L10 108Z\" fill=\"#6a4a2e\"/><path d=\"M470 102 L310 94.80000000000001 L310 98.80000000000001 L470 108Z\" fill=\"#6a4a2e\"/><path d=\"M10 148 L170 131.60000000000002 L170 135.60000000000002 L10 154Z\" fill=\"#6a4a2e\"/><path d=\"M470 148 L310 131.60000000000002 L310 135.60000000000002 L470 154Z\" fill=\"#6a4a2e\"/>\n<g transform=\"translate(26 56) scale(1)\"><path d=\"M-8 0 L-7 -16 C-7 -22 7 -22 7 -16 L8 0Z\" fill=\"#a8845a\"/><circle cx=\"-3\" cy=\"-12\" r=\"1.4\" fill=\"#2a1a0a\"/><circle cx=\"3\" cy=\"-12\" r=\"1.4\" fill=\"#2a1a0a\"/><path d=\"M-3 -6 h6\" stroke=\"#5a3a1a\"/></g><g transform=\"translate(454 56) scale(1)\"><path d=\"M-7 0 L-6 -10 C-9 -12 -9 -18 -5 -20 L5 -20 C9 -18 9 -12 6 -10 L7 0Z\" fill=\"#d8d0c0\"/><circle cy=\"-23\" r=\"3.4\" fill=\"#d8d0c0\"/><path d=\"M-3 -14 q3 2 6 0\" stroke=\"#a89a80\" fill=\"none\"/></g><g transform=\"translate(61 58) scale(0.8875)\"><path d=\"M-10 0 C-11 -14 -6 -20 0 -20 C6 -20 11 -14 10 0Z\" fill=\"#3a5a6a\"/><path d=\"M-7 -11 L7 -11 L7 -8 L1.6 -8 L1.6 -1 L-1.6 -1 L-1.6 -8 L-7 -8Z\" fill=\"#14100e\"/></g><g transform=\"translate(419 58) scale(0.8875)\"><rect x=\"-8\" y=\"-12\" width=\"16\" height=\"10\" fill=\"#e8dcb0\"/><rect x=\"-10\" y=\"-13\" width=\"3\" height=\"12\" rx=\"1.4\" fill=\"#8a5a2a\"/><rect x=\"7\" y=\"-13\" width=\"3\" height=\"12\" rx=\"1.4\" fill=\"#8a5a2a\"/><path d=\"M-5 -9 h10 M-5 -6 h8\" stroke=\"#6a4a2a\" stroke-width=\".8\"/></g><g transform=\"translate(96 60) scale(0.775)\"><path d=\"M-5 0 C-9 -6 -9 -12 -4 -16 L-4 -20 L4 -20 L4 -16 C9 -12 9 -6 5 0Z\" fill=\"#2a6a7a\"/><path d=\"M-4 -16 C-10 -16 -10 -10 -7 -9 M4 -16 C10 -16 10 -10 7 -9\" fill=\"none\" stroke=\"#2a6a7a\" stroke-width=\"1.4\"/><path d=\"M-6 -8 h12\" stroke=\"#e8c070\" stroke-width=\"1\"/></g><g transform=\"translate(384 60) scale(0.775)\"><rect x=\"-7\" y=\"-20\" width=\"14\" height=\"20\" rx=\"2\" fill=\"#7a7a70\"/><path d=\"M-4 -16 l2 2 l2 -2 M0 -11 h4 M-4 -7 l3 3 M2 -6 v3\" stroke=\"#3a3a30\" stroke-width=\"1\"/></g><g transform=\"translate(131 62) scale(0.6625)\"><path d=\"M-8 0 L-9 -12 L-4 -7 L0 -14 L4 -7 L9 -12 L8 0Z\" fill=\"#e8c070\" stroke=\"#8a6020\"/><circle cy=\"-5\" r=\"1.6\" fill=\"#ff4a6a\"/><circle cx=\"-5\" cy=\"-4\" r=\"1\" fill=\"#5ad0ff\"/><circle cx=\"5\" cy=\"-4\" r=\"1\" fill=\"#5ad0ff\"/></g><g transform=\"translate(349 62) scale(0.6625)\"><path d=\"M0 -24 L2 -8 L-2 -8Z\" fill=\"#c8d0d8\"/><rect x=\"-5\" y=\"-8\" width=\"10\" height=\"2\" fill=\"#c8a050\"/><rect x=\"-1.4\" y=\"-6\" width=\"2.8\" height=\"6\" fill=\"#5a3a20\"/><rect x=\"-6\" y=\"0\" width=\"12\" height=\"2\" fill=\"#3a2616\"/></g><g transform=\"translate(26 102) scale(1)\"><circle cy=\"-9\" r=\"9\" fill=\"#2a6a8a\"/><path d=\"M-9 -9 h18\" stroke=\"#bfe0f4\" stroke-width=\".8\"/><rect x=\"-3\" y=\"-1\" width=\"6\" height=\"1.6\" fill=\"#6a4a2e\"/></g><g transform=\"translate(454 102) scale(1)\"><path d=\"M0 -22 L8 -18 L7 -6 L0 0 L-7 -6 L-8 -18Z\" fill=\"#8a2a1a\" stroke=\"#e8c070\"/><path d=\"M0 -18 v14 M-5 -12 h10\" stroke=\"#e8c070\"/></g><g transform=\"translate(61 101.7) scale(0.8875)\"><path d=\"M-5 0 L-8 -18 L8 -18 L5 0Z\" fill=\"#8a3a2a\"/><path d=\"M-8 -18 C-8 -24 8 -24 8 -18\" fill=\"#a84a3a\"/><path d=\"M-6 -10 h12\" stroke=\"#e8c070\" stroke-width=\"1.2\"/></g><g transform=\"translate(419 101.7) scale(0.8875)\"><circle cy=\"-9\" r=\"8\" fill=\"#3a2a1a\" stroke=\"#c8a050\"/><path d=\"M0 -15 L2 -9 L0 -3 L-2 -9Z\" fill=\"#ff5a3a\"/><circle cy=\"-9\" r=\"1.2\" fill=\"#e8c070\"/></g><g transform=\"translate(96 101.4) scale(0.775)\"><path d=\"M-6 0 L-7 -14 L7 -14 L6 0Z\" fill=\"#5a7a3a\"/><rect x=\"-8\" y=\"-17\" width=\"16\" height=\"3\" rx=\"1\" fill=\"#3a5a2a\"/><circle cy=\"-19\" r=\"2\" fill=\"#c8a050\"/><path d=\"M-6 -8 h12\" stroke=\"#c8e0a0\" stroke-dasharray=\"2 2\"/></g><g transform=\"translate(384 101.4) scale(0.775)\"><path d=\"M-8 -6 C-8 -12 6 -12 8 -8 L12 -10 L8 -4 L-6 -2Z\" fill=\"#c8a050\"/><path d=\"M12 -10 c2 -4 0 -6 -1 -8\" stroke=\"#ffb040\" fill=\"none\"/></g><g transform=\"translate(131 101.10000000000001) scale(0.6625)\"><path d=\"M-7 0 L-6 -6 C-9 -10 -8 -20 0 -20 C8 -20 9 -10 6 -6 L7 0Z\" fill=\"#6a5a4a\"/><path d=\"M-4 -13 h3 M1 -13 h3\" stroke=\"#2a1a0a\" stroke-width=\"1.4\"/><path d=\"M-6 -20 L-8 -26 L-3 -21 M6 -20 L8 -26 L3 -21\" fill=\"#6a5a4a\"/></g><g transform=\"translate(349 101.10000000000001) scale(0.6625)\"><path d=\"M0 -20 L8 -14 L8 -4 L0 2 L-8 -4 L-8 -14Z\" fill=\"#c83a2a\"/><path d=\"M0 -20 L8 -14 L0 -8 L-8 -14Z\" fill=\"#ff6a4a\"/><path d=\"M0 -8 v10\" stroke=\"#3a0a08\"/></g><g transform=\"translate(26 148) scale(1)\"><path d=\"M0 -20 C8 -20 10 -10 8 -5 L5 0 L-5 0 L-8 -5 C-10 -10 -8 -20 0 -20Z\" fill=\"#e8e0d0\"/><circle cx=\"-3\" cy=\"-11\" r=\"1.6\" fill=\"#2a2a2a\"/><circle cx=\"3\" cy=\"-11\" r=\"1.6\" fill=\"#2a2a2a\"/></g><g transform=\"translate(454 148) scale(1)\"><path d=\"M-6 0 L-6 -20 C2 -20 8 -12 8 0Z\" fill=\"none\" stroke=\"#c8a050\" stroke-width=\"2\"/><path d=\"M-4 -16 v16 M-1 -17 v17 M2 -14 v14 M5 -9 v9\" stroke=\"#e8dcb0\" stroke-width=\".6\"/></g><g transform=\"translate(61 145.4) scale(0.8875)\"><rect x=\"-1.4\" y=\"-22\" width=\"2.8\" height=\"16\" rx=\"1\" fill=\"#9aa4ae\"/><rect x=\"-2\" y=\"-8\" width=\"4\" height=\"8\" fill=\"#5a6470\"/><rect x=\"-2.6\" y=\"-14\" width=\"5.2\" height=\"1.4\" fill=\"#2a2e34\"/></g><g transform=\"translate(419 145.4) scale(0.8875)\"><rect x=\"-9\" y=\"-10\" width=\"18\" height=\"10\" fill=\"#4a2a3a\" stroke=\"#c8a050\"/><path d=\"M-9 -10 C-9 -16 9 -16 9 -10\" fill=\"#5a3a4a\" stroke=\"#c8a050\"/><circle cy=\"-6\" r=\"1.6\" fill=\"#e8c070\"/></g><g transform=\"translate(96 142.8) scale(0.775)\"><path d=\"M-6 0 L-8 -12 L-4 -16 L-2 0Z\" fill=\"#7a9aff\"/><path d=\"M-2 0 L-1 -22 L3 -24 L3 0Z\" fill=\"#b07aff\"/><path d=\"M3 0 L5 -14 L9 -12 L7 0Z\" fill=\"#ff7ad8\"/></g><g transform=\"translate(384 142.8) scale(0.775)\"><path d=\"M-7 0 L-7 -10 C-7 -18 7 -18 7 -10 L7 0Z\" fill=\"#c8ccd4\"/><circle cx=\"-2\" cy=\"-11\" r=\"2.4\" fill=\"#2a3440\"/><circle cx=\"-2\" cy=\"-11\" r=\"1\" fill=\"#ff4a4a\"/><rect x=\"2\" y=\"-8\" width=\"4\" height=\"2\" fill=\"#5ad0ff\"/></g><g transform=\"translate(131 140.20000000000002) scale(0.6625)\"><rect x=\"-1\" y=\"-26\" width=\"2\" height=\"26\" fill=\"#6a4a2a\"/><circle cy=\"-27\" r=\"3.4\" fill=\"#7affc8\"/><path d=\"M-4 -24 L4 -24\" stroke=\"#c8a050\" stroke-width=\"1.4\"/></g><g transform=\"translate(349 140.20000000000002) scale(0.6625)\"><path d=\"M-10 -6 L8 -8 L12 -6 L8 -4Z\" fill=\"#9aa4ae\"/><path d=\"M-6 -6 L-10 -14 L-7 -14 L0 -7Z M-6 -6 L-10 2 L-7 2 L0 -5Z\" fill=\"#7a8692\"/><rect x=\"-2\" y=\"-2\" width=\"4\" height=\"2\" fill=\"#3a2616\"/></g>\n<g transform=\"translate(110 0)\"><path d=\"M0 0 L0 14\" stroke=\"#3a2a1a\" stroke-width=\"1.4\"/><path d=\"M-12 14 L12 14 L8 26 L-8 26Z\" fill=\"#8a6a3a\"/><ellipse cy=\"38\" rx=\"70\" ry=\"44\" fill=\"url(#ll)\"><animate attributeName=\"opacity\" values=\".8;1;.85;1;.8\" dur=\"3s\" calcMode=\"discrete\" repeatCount=\"indefinite\"/></ellipse></g><g transform=\"translate(370 0)\"><path d=\"M0 0 L0 14\" stroke=\"#3a2a1a\" stroke-width=\"1.4\"/><path d=\"M-12 14 L12 14 L8 26 L-8 26Z\" fill=\"#8a6a3a\"/><ellipse cy=\"38\" rx=\"70\" ry=\"44\" fill=\"url(#ll)\"><animate attributeName=\"opacity\" values=\".8;1;.85;1;.8\" dur=\"3s\" calcMode=\"discrete\" repeatCount=\"indefinite\"/></ellipse></g>\n<g transform=\"translate(72 200)\"><rect x=\"-16\" y=\"0\" width=\"32\" height=\"40\" fill=\"#3a2616\"/><rect x=\"-20\" y=\"-4\" width=\"40\" height=\"6\" fill=\"#5a3a20\"/><rect x=\"-14\" y=\"-40\" width=\"28\" height=\"36\" fill=\"#bfe0f4\" opacity=\".14\" stroke=\"#e8c070\" stroke-opacity=\".5\"/><g transform=\"translate(0 -8) scale(1.1)\"><path d=\"M0 -22 L6 -11 L0 0 L-6 -11Z\" fill=\"#7affc8\" opacity=\".8\"/><path d=\"M0 -22 L6 -11 L0 -9Z\" fill=\"#fff\" opacity=\".4\"/></g></g><g transform=\"translate(408 200)\"><rect x=\"-16\" y=\"0\" width=\"32\" height=\"40\" fill=\"#3a2616\"/><rect x=\"-20\" y=\"-4\" width=\"40\" height=\"6\" fill=\"#5a3a20\"/><rect x=\"-14\" y=\"-40\" width=\"28\" height=\"36\" fill=\"#bfe0f4\" opacity=\".14\" stroke=\"#e8c070\" stroke-opacity=\".5\"/><g transform=\"translate(0 -8) scale(1.1)\"><ellipse cy=\"-8\" rx=\"10\" ry=\"7\" fill=\"#bfa880\"/><path d=\"M-6 -8 C-6 -12 0 -13 2 -9 C3 -6 -1 -5 -2 -8\" fill=\"none\" stroke=\"#6a5a3a\" stroke-width=\"1.2\"/></g></g>\n<path d=\"M0 248 L480 248 L480 300 L0 300Z\" fill=\"#160c06\"/><path d=\"M0 300 L200 248\" stroke=\"#2a1a0e\" stroke-width=\"1\"/><path d=\"M54 300 L209 248\" stroke=\"#2a1a0e\" stroke-width=\"1\"/><path d=\"M108 300 L218 248\" stroke=\"#2a1a0e\" stroke-width=\"1\"/><path d=\"M162 300 L227 248\" stroke=\"#2a1a0e\" stroke-width=\"1\"/><path d=\"M216 300 L236 248\" stroke=\"#2a1a0e\" stroke-width=\"1\"/><path d=\"M270 300 L245 248\" stroke=\"#2a1a0e\" stroke-width=\"1\"/><path d=\"M324 300 L254 248\" stroke=\"#2a1a0e\" stroke-width=\"1\"/><path d=\"M378 300 L263 248\" stroke=\"#2a1a0e\" stroke-width=\"1\"/><path d=\"M432 300 L272 248\" stroke=\"#2a1a0e\" stroke-width=\"1\"/><path d=\"M486 300 L281 248\" stroke=\"#2a1a0e\" stroke-width=\"1\"/>\n<g transform=\"translate(240 0)\">\n<path d=\"M-80 300 L-70 170 C-66 146 -44 134 -20 130 L20 130 C44 134 66 146 70 170 L80 300Z\" fill=\"url(#lc)\" stroke=\"#05050a\" stroke-width=\"1.4\"/>\n<path d=\"M-70 170 C-66 146 -44 134 -20 130 L-14 200 L-40 300 L-80 300Z\" fill=\"url(#lr)\" opacity=\".55\"/><path d=\"M70 170 C66 146 44 134 20 130 L14 200 L40 300 L80 300Z\" fill=\"url(#lr)\" opacity=\".55\"/>\n<path d=\"M-20 130 L-14 200 L-40 300 M20 130 L14 200 L40 300\" fill=\"none\" stroke=\"#c8a050\" stroke-width=\"2.2\"/>\n<path d=\"M-20 130 L-14 200 L-40 300 L-56 300 L-30 196 L-34 134Z M20 130 L14 200 L40 300 L56 300 L30 196 L34 134Z\" fill=\"url(#lb)\"/>\n<path d=\"M-36 136 C-42 120 -38 104 -28 98 C-24 110 -20 122 -14 130Z M36 136 C42 120 38 104 28 98 C24 110 20 122 14 130Z\" fill=\"url(#lr)\" stroke=\"#c8a050\" stroke-width=\"1.4\"/><path d=\"M-30 104 C-27 114 -23 122 -18 128 M30 104 C27 114 23 122 18 128\" fill=\"none\" stroke=\"url(#lb)\" stroke-width=\"3\"/>\n<path d=\"M-18 130 L0 186 L18 130Z\" fill=\"#2a2632\"/><path d=\"M-10 132 L0 162 L10 132Z\" fill=\"#d8ccb4\"/>\n<circle cx=\"0\" cy=\"186\" r=\"6\" fill=\"#c8a050\" stroke=\"#7a5a20\"/><circle cx=\"0\" cy=\"186\" r=\"2.4\" fill=\"#7affc8\"/>\n<rect x=\"-12\" y=\"112\" width=\"24\" height=\"22\" fill=\"url(#lf)\"/>\n<path d=\"M-30 66 C-32 92 -26 110 -14 120 C-6 126 6 126 14 120 C26 110 32 92 30 66 C28 44 -28 44 -30 66Z\" fill=\"url(#lf)\"/>\n<path d=\"M-31 76 C-34 54 -22 38 0 37 C22 38 34 54 31 76 C30 66 26 58 20 54 C12 50 4 49 -2 49 C-12 49 -22 54 -27 62Z\" fill=\"url(#lh)\"/><path d=\"M-24 60 C-16 48 -2 44 14 46 M-18 54 C-8 46 6 44 22 50 M-28 68 C-24 58 -14 52 -4 50\" fill=\"none\" stroke=\"#8a8a96\" stroke-width=\"1\" stroke-opacity=\".8\"/><path d=\"M-31 76 C-32 82 -31 88 -29 92 M31 76 C32 82 31 88 29 92\" stroke=\"#bcbcc6\" stroke-width=\"3\" fill=\"none\"/>\n<path d=\"M-28 92 C-24 112 -14 122 0 124 C14 122 24 112 28 92 C22 104 12 110 0 110 C-12 110 -22 104 -28 92Z\" fill=\"#c8c8d0\"/>\n<path d=\"M-10 102 C-4 106 4 106 10 102\" stroke=\"#8a8a94\" stroke-width=\"2\" fill=\"none\"/>\n<path d=\"M-21 73 L-8 71 M8 71 L21 73\" stroke=\"#8a8a96\" stroke-width=\"2.6\" stroke-linecap=\"round\"/>\n<ellipse cx=\"-13\" cy=\"80\" rx=\"3.4\" ry=\"2.2\" fill=\"#2a3440\"/><ellipse cx=\"13\" cy=\"80\" rx=\"3.4\" ry=\"2.2\" fill=\"#2a3440\"/><circle cx=\"-12\" cy=\"79.4\" r=\".8\" fill=\"#fff\"/><circle cx=\"14\" cy=\"79.4\" r=\".8\" fill=\"#fff\"/>\n<path d=\"M0 80 L-3 94 L3 94\" fill=\"none\" stroke=\"#a87a5a\" stroke-width=\"1.4\"/><path d=\"M-24 86 L-20 98 M24 86 L20 98\" stroke=\"#a87a5a\" stroke-width=\"1\" opacity=\".6\"/>\n</g>\n<g><path d=\"M110 236 L370 236 L392 262 L88 262Z\" fill=\"#5a3a20\"/><path d=\"M110 236 L370 236 L372 241 L108 241Z\" fill=\"#a8783e\"/><path d=\"M88 262 L392 262 L392 300 L88 300Z\" fill=\"url(#ld)\"/><path d=\"M88 262 L392 262\" stroke=\"#c8a050\" stroke-width=\"2\"/>\n<g transform=\"translate(116 268)\"><rect width=\"44\" height=\"28\" rx=\"2\" fill=\"#3a2414\" stroke=\"#c8a050\" stroke-opacity=\".7\"/><path d=\"M6 6 h32 v16 h-32z\" fill=\"none\" stroke=\"#7a5228\" stroke-width=\"1\"/><path d=\"M22 8 l6 6 l-6 6 l-6 -6z\" fill=\"none\" stroke=\"#c8a050\" stroke-opacity=\".6\"/><circle cx=\"22\" cy=\"14\" r=\"1.6\" fill=\"#c8a050\"/></g><g transform=\"translate(170 268)\"><rect width=\"44\" height=\"28\" rx=\"2\" fill=\"#3a2414\" stroke=\"#c8a050\" stroke-opacity=\".7\"/><path d=\"M6 6 h32 v16 h-32z\" fill=\"none\" stroke=\"#7a5228\" stroke-width=\"1\"/><path d=\"M22 8 l6 6 l-6 6 l-6 -6z\" fill=\"none\" stroke=\"#c8a050\" stroke-opacity=\".6\"/><circle cx=\"22\" cy=\"14\" r=\"1.6\" fill=\"#c8a050\"/></g><g transform=\"translate(224 268)\"><rect width=\"44\" height=\"28\" rx=\"2\" fill=\"#3a2414\" stroke=\"#c8a050\" stroke-opacity=\".7\"/><path d=\"M6 6 h32 v16 h-32z\" fill=\"none\" stroke=\"#7a5228\" stroke-width=\"1\"/><path d=\"M22 8 l6 6 l-6 6 l-6 -6z\" fill=\"none\" stroke=\"#c8a050\" stroke-opacity=\".6\"/><circle cx=\"22\" cy=\"14\" r=\"1.6\" fill=\"#c8a050\"/></g><g transform=\"translate(278 268)\"><rect width=\"44\" height=\"28\" rx=\"2\" fill=\"#3a2414\" stroke=\"#c8a050\" stroke-opacity=\".7\"/><path d=\"M6 6 h32 v16 h-32z\" fill=\"none\" stroke=\"#7a5228\" stroke-width=\"1\"/><path d=\"M22 8 l6 6 l-6 6 l-6 -6z\" fill=\"none\" stroke=\"#c8a050\" stroke-opacity=\".6\"/><circle cx=\"22\" cy=\"14\" r=\"1.6\" fill=\"#c8a050\"/></g><g transform=\"translate(332 268)\"><rect width=\"44\" height=\"28\" rx=\"2\" fill=\"#3a2414\" stroke=\"#c8a050\" stroke-opacity=\".7\"/><path d=\"M6 6 h32 v16 h-32z\" fill=\"none\" stroke=\"#7a5228\" stroke-width=\"1\"/><path d=\"M22 8 l6 6 l-6 6 l-6 -6z\" fill=\"none\" stroke=\"#c8a050\" stroke-opacity=\".6\"/><circle cx=\"22\" cy=\"14\" r=\"1.6\" fill=\"#c8a050\"/></g>\n<g transform=\"translate(140 236)\"><path d=\"M0 0 L0 -18\" stroke=\"#5a4020\" stroke-width=\"2\"/><path d=\"M-10 -18 L10 -18 L6 -28 L-6 -28Z\" fill=\"#c8a050\"/><rect x=\"-6\" y=\"-2\" width=\"12\" height=\"2\" fill=\"#7a5228\"/><ellipse cx=\"0\" cy=\"-12\" rx=\"30\" ry=\"18\" fill=\"url(#ll)\"/></g>\n<g transform=\"translate(186 236)\"><path d=\"M-16 -2 L0 -5 L16 -2 L16 0 L0 -3 L-16 0Z\" fill=\"#e8dcc0\" stroke=\"#8a7a5a\" stroke-width=\".6\"/><path d=\"M-12 -3 h8 M4 -3 h8\" stroke=\"#8a7a5a\" stroke-width=\".5\"/><path d=\"M14 -6 L24 -16\" stroke=\"#e8e0d0\" stroke-width=\"1.4\"/></g>\n<g transform=\"translate(230 236)\"><rect x=\"-1\" y=\"-20\" width=\"2\" height=\"18\" fill=\"#c8a050\"/><path d=\"M-12 -18 h24\" stroke=\"#c8a050\" stroke-width=\"1.4\"/><path d=\"M-12 -18 l-4 8 h8z M12 -18 l-4 8 h8z\" fill=\"#c8a050\" opacity=\".8\"/><rect x=\"-6\" y=\"-2\" width=\"12\" height=\"2\" fill=\"#7a5228\"/></g>\n<g transform=\"translate(264 236)\"><ellipse cx=\"0\" cy=\"-2\" rx=\"5\" ry=\"1.6\" fill=\"#e8c070\" stroke=\"#8a6020\" stroke-width=\".4\"/><ellipse cx=\"0\" cy=\"-4.4\" rx=\"5\" ry=\"1.6\" fill=\"#e8c070\" stroke=\"#8a6020\" stroke-width=\".4\"/><ellipse cx=\"0\" cy=\"-6.8\" rx=\"5\" ry=\"1.6\" fill=\"#e8c070\" stroke=\"#8a6020\" stroke-width=\".4\"/><ellipse cx=\"0\" cy=\"-9.2\" rx=\"5\" ry=\"1.6\" fill=\"#e8c070\" stroke=\"#8a6020\" stroke-width=\".4\"/></g>\n<g transform=\"translate(300 236)\"><rect x=\"-12\" y=\"-10\" width=\"24\" height=\"10\" fill=\"#4a2a1a\" stroke=\"#c8a050\"/><path d=\"M-12 -10 C-12 -16 12 -16 12 -10\" fill=\"#5a3422\" stroke=\"#c8a050\"/><rect x=\"-2\" y=\"-8\" width=\"4\" height=\"4\" fill=\"#e8c070\"/></g>\n<g transform=\"translate(336 236)\"><circle cx=\"0\" cy=\"-10\" r=\"6\" fill=\"none\" stroke=\"#c8a050\" stroke-width=\"1.6\"/><circle cx=\"0\" cy=\"-10\" r=\"5\" fill=\"#bfe0f4\" opacity=\".3\"/><path d=\"M4 -6 L10 0\" stroke=\"#5a3a20\" stroke-width=\"2.4\"/></g>\n<g transform=\"translate(356 236) scale(0.7)\"><path d=\"M0 -22 L6 -11 L0 0 L-6 -11Z\" fill=\"#7affc8\" opacity=\".8\"/><path d=\"M0 -22 L6 -11 L0 -9Z\" fill=\"#fff\" opacity=\".4\"/></g></g>\n<g transform=\"translate(240 270)\"><rect x=\"-80\" y=\"-11\" width=\"160\" height=\"20\" rx=\"3\" fill=\"#2a1a10\" stroke=\"#c8a050\"/><text x=\"0\" y=\"3\" text-anchor=\"middle\" font-size=\"9\" font-weight=\"700\" font-family=\"Oxanium,sans-serif\" fill=\"#e8c070\" letter-spacing=\"1\">GALACTIC ANTIQUITIES</text></g>\n</svg>";
  const week = () => Math.floor((Date.now() - Date.UTC(2026, 0, 5, 18)) / (7 * 864e5));
  function stock() {
    // Six shop titles rotate every week (Monday, noon Central); the featured pieces stay.
    const w = week(); const pool = TITLES.filter((t) => t.cost); const out = [];
    for (let i = 0; out.length < 6 && i < 40; i++) { const t = pool[(w * 7 + i * 5) % pool.length]; if (!out.includes(t)) out.push(t); }
    return out;
  }
  // ---------- The library shelf: this week's banners, win screens and battle intros ----------
  const LKIND = { bn: 'Banner', wi: 'Win screen', in: 'Battle intro' };
  const libKey = (x) => (x.k === 'wi' ? 'wi:lib_' : x.k === 'in' ? 'in:' : 'bn:') + x.id;
  const myTag = () => { try { return HN().cos25.me().tag || 'You'; } catch (e) { return 'You'; } };
  const libArt = (x, big) => root.Lib25.html(x.id, x.k === 'in' ? 'l5-li-stage' : 'l5-' + x.k, { a: myTag(), b: 'Rival', play: x.k === 'in' && !!big });
  function libShelf(c) {
    if (!root.Lib25 || !LIB.length) return '';
    const wk = root.Lib25.week();
    const now = LIB.filter((x) => x.wk === wk);
    const next = LIB.filter((x) => x.wk === root.Lib25.week(1));
    const item = (x) => `<div class="lu25-it lu25-lib ${x.prem ? 'prem' : ''}" style="--c:${x.c}">${x.ex ? '<span class="lu25-rib">EXCLUSIVE</span>' : ''}<div class="lu25-la ${x.k}">${libArt(x, false)}</div><b>${esc(x.n)}</b><small>${LKIND[x.k]}${x.prem ? ' · premium' : ''}</small><div class="lu25-btns"><button type="button" class="lu25-try" data-ltry="${x.id}">Try it on</button>${c.own[libKey(x)] ? '<span class="lu25-own">Owned</span>' : `<button type="button" class="lu25-buy ${x.prem ? 'gold' : ''}" data-lbuy="${x.id}">Buy · ${priceHtml(x.cost)}</button>`}</div></div>`;
    return `<div class="section-head"><h2 class="section-title">This week's collection</h2><span class="muted">New pieces every Monday${next.length ? ` · next week: ${next.map((x) => esc(x.n)).join(', ')}` : ''}</span></div><div class="lu25-grid lu25-lg">${now.map(item).join('')}</div>`;
  }
  function libTry(id) {
    const x = root.Lib25.BY[id]; if (!x) return;
    const m = UI.openModal(`<div class="c25" style="max-width:680px"><h2>${esc(x.n)}</h2><p class="muted" style="margin:0 0 8px">${esc(x.look)}</p><div class="lu25-la big ${x.k}">${libArt(x, true)}</div><div class="c25-pbtns">${x.k === 'in' ? '<button type="button" class="c25-tbtn" data-lrp>Replay</button>' : ''}<button type="button" class="btn" data-x>Close</button></div></div>`, { wide: true });
    root.Lib25.fill(m.root);
    m.root.addEventListener('click', (e) => { if (e.target.closest('[data-x]')) m.close(); const rp = e.target.closest('[data-lrp]'); if (rp) { const st = m.root.querySelector('.l5'); if (st) root.Lib25.play(st); } });
  }
  function libBuy(id, redraw) {
    const x = root.Lib25.BY[id]; if (!x) return;
    ask(`Buy ${x.n} for ${x.cost.kyber ? fmt(x.cost.kyber) + ' Kyber' : fmt(x.cost.beskar) + ' Beskar'}?`, 'Buy', () => {
      if (!pay(x.cost)) return;
      C().own[libKey(x)] = 1; if (x.k !== 'bn') C().seen[libKey(x)] = 0; save();
      toast(x.k === 'bn' ? `${x.n} is yours. Pick it in your HoloNet profile, under Banner.` : `${x.n} is yours. Equip it in Cosmetics.`);
      redraw();
    });
  }
  function gallery(pane) {
    if (!ready()) { pane.innerHTML = '<div class="lu25-hero"><div class="lu25-art">' + LUTHEN + '</div><div class="lu25-copy"><div class="lu25-sign" aria-label="Coruscant gallery"><i></i><span>CORUSCANT</span><i></i></div><h1>Luthen\'s Gallery</h1><p class="market-sub">Luthen only deals with pilots on the HoloNet. Open the HoloNet once, then come back.</p></div></div>'; return; }
    sync();
    const draw = () => {
      const h = H(); const c = C();
      const card = (k, x, cost, prem, sub, feat) => { const owned = k === 'ti' ? tiersOf(x.id).length > 0 : !!c.own[k + ':' + x.id]; return `<div class="lu25-it ${prem ? 'prem' : ''} ${feat ? 'lu25-ft' : ''}" style="--c:${k === 'ti' ? (TCOL[x.fix || baseTier(x)] || '#d8b46a') : x.c}">${feat ? '<span class="lu25-rib">FEATURED</span>' : ''}<div class="lu25-sw">${k === 'ti' ? titleHtml({ n: x.n, t: baseTier(x) }) : `<span class="c25-sw ${k}" style="--c:${x.c}"></span>`}</div><b>${esc(x.n)}</b><small>${esc(sub)}</small><div class="lu25-btns"><button type="button" class="lu25-try" data-try="${k}:${x.id}">Try it on</button>${owned ? '<span class="lu25-own">Owned</span>' : `<button type="button" class="lu25-buy ${prem ? 'gold' : ''}" data-buy25="${k}:${x.id}">Buy · ${priceHtml(cost)}</button>`}</div></div>`; };
      const cheer = WINS.find((x) => x.id === 'cantina'); const thaw = PACKS.find((x) => x.id === 'carbonite'); const boon = WINS.find((x) => x.id === 'boonta'); const geo = PACKS.find((x) => x.id === 'geode'); const bac = PACKS.find((x) => x.id === 'bacta'); const sar = PACKS.find((x) => x.id === 'sarlacc');
      pane.innerHTML = `<div class="lu25-hero"><div class="lu25-art">${LUTHEN}</div><div class="lu25-copy"><div class="lu25-sign" aria-label="Coruscant gallery"><i></i><span>CORUSCANT</span><i></i></div><h1>Luthen's Gallery</h1><p class="market-sub">Antiquities for the discerning collector. Luthen sells looks, not cards: titles, win screens and crate themes.</p></div></div>
      <div class="section-head"><h2 class="section-title">Featured</h2><span class="muted">On the plinth this week</span></div><div class="lu25-grid lu25-fg">${card('wi', cheer, { beskar: 1500 }, false, 'Win screen', true)}${card('pa', thaw, { kyber: 230 }, true, 'Crate theme · premium', true)}${card('wi', boon, { beskar: 1500 }, false, 'Win screen · new', true)}${card('pa', geo, { kyber: 230 }, true, 'Crate theme · premium · new', true)}${card('pa', bac, { beskar: 2000 }, false, 'Crate theme · new', true)}${card('pa', sar, { kyber: 230 }, true, 'Crate theme · premium · new', true)}</div>
      ${libShelf(c)}
      <div class="section-head"><h2 class="section-title">This week's titles</h2><span class="muted">New titles every Monday</span></div><div class="lu25-grid">${stock().map((t) => card('ti', t, t.cost, !!t.fix && !!t.cost.kyber, t.fix ? 'Profile title · fixed ' + TIERS.find((q) => q[0] === t.fix)[1] : 'Profile title · Silver, upgradable')).join('')}</div>
      <div class="lu25-note ex"><b>Exclusives</b><span>Event exclusives appear here during events only, and never come back.</span></div>
      <div class="section-head"><h2 class="section-title">Colour upgrades</h2><span class="muted">For titles you own</span></div>${(() => { const mine = TITLES.filter((t) => tiersOf(t.id).length && !t.fix); return mine.length ? `<div class="lu25-ups">${mine.map((t) => `<div class="lu25-up"><b>${esc(t.n)}</b><div class="c25-tiers">${TIERS.map(([tid, tn, , cost]) => tiersOf(t.id).includes(tid) ? `<span class="c25-tier on">${titleHtml({ n: tn, t: tid })}<small>Owned</small></span>` : `<button type="button" class="c25-tier" data-up25="${t.id}:${tid}">${titleHtml({ n: tn, t: tid })}<small>${priceHtml(cost)}</small></button>`).join('')}</div></div>`).join('')}</div>` : '<div class="lu25-note"><span>Earn or buy a title first, then upgrade its colour here.</span></div>'; })()}
      <div class="lu25-note"><b>Your collection</b><span>Equip what you own in the Cosmetics tab of your profile.</span><button type="button" class="lu25-try" data-opencos>Open Cosmetics</button></div>`;
    };
    draw();
    walletBeskar();
    pane.addEventListener('click', (e) => {
      const tr = e.target.closest('[data-try]');
      if (tr) { const [k, id] = tr.dataset.try.split(':'); return tryOn(k, id); }
      const lt = e.target.closest('[data-ltry]'); if (lt) return libTry(lt.dataset.ltry);
      const lb = e.target.closest('[data-lbuy]'); if (lb) return libBuy(lb.dataset.lbuy, draw);
      const b = e.target.closest('[data-buy25]');
      if (b) {
        const [k, id] = b.dataset.buy25.split(':');
        const x = k === 'ti' ? TMAP[id] : k === 'wi' ? WINS.find((y) => y.id === id) : PACKS.find((y) => y.id === id);
        const cost = k === 'ti' ? x.cost : x.get;
        const go = () => { if (!pay(cost)) return; if (k === 'ti') C().t[id] = [baseTier(x)]; else C().own[k + ':' + id] = 1; C().seen[k + ':' + id] = 0; save(); toast(`${x.n} is yours. Equip it in Cosmetics.`); draw(); };
        ask(`Buy ${x.n} for ${cost.kyber ? fmt(cost.kyber) + ' Kyber' : fmt(cost.beskar) + ' Beskar'}?`, 'Buy', go);
        return;
      }
      const u2 = e.target.closest('[data-up25]');
      if (u2) { const [id, tid] = u2.dataset.up25.split(':'); const t = TMAP[id]; const tier = TIER[tid]; ask(`Upgrade ${t.n} to ${tier[1]} for ${tier[3].kyber ? fmt(tier[3].kyber) + ' Kyber' : fmt(tier[3].beskar) + ' Beskar'}?`, 'Upgrade', () => { if (!pay(tier[3])) return; C().t[id] = [...new Set([...tiersOf(id), tid])]; save(); wearTitle(id, tid); toast(`${t.n} is now ${tier[1]}.`); draw(); }); return; }
      if (e.target.closest('[data-opencos]')) open();
    });
  }
  // In Luthen's Gallery the top bar trades credits (no use here) for Beskar: Beskar, Kyber and Aurodium.
  function walletBeskar() {
    const cr = document.querySelector('.currency.credits');
    if (!cr || !HN() || !HN().S) return;
    let b = document.querySelector('.currency.beskar25');
    if (!b) {
      b = document.createElement('span');
      b.className = 'currency beskar25';
      b.title = 'Beskar';
      const ic = HN().ui && HN().ui.bes ? (HN().ui.bes(0).match(/<svg[\s\S]*<\/svg>/) || [''])[0] : '';
      b.innerHTML = '<i>' + ic + '</i><b>0</b>';
      cr.after(b);
    }
    b.querySelector('b').textContent = fmt(HN().S().beskar || 0);
  }
  if (UI.updateWallet && !UI.__lu25w) { const uw = UI.updateWallet; UI.__lu25w = true; UI.updateWallet = function () { const r = uw.apply(this, arguments); try { if (document.querySelector('.s25-pane[data-p="luthen"]:not([hidden])')) walletBeskar(); } catch (e) { /* ignore */ } return r; }; }
  function tryOn(k, id) {
    const me = HN().cos25.me();
    const x = k === 'ti' ? TMAP[id] : k === 'wi' ? WINS.find((y) => y.id === id) : PACKS.find((y) => y.id === id);
    const body = k === 'ti' ? `<div class="c25-card pop"><span class="c25-av">${HN().cos25.avatar(me, 'lg')}</span><div class="c25-id"><small>TRY IT ON</small><b>You</b>${titleHtml({ n: x.n, t: baseTier(x) })}<span class="c25-sub">${x.fix ? 'This title has a fixed colour.' : 'Upgrade the colour any time after you buy it.'}</span></div></div>`
      : `<div class="c25-try"><span class="c25-sw ${k} big" style="--c:${x.c}"></span><b>${esc(x.n)}</b><span class="muted">${k === 'wi' ? 'Plays when you win a battle.' : 'Plays when you open a crate you set it for.'}</span></div>`;
    const m = UI.openModal(`<div class="c25" style="max-width:520px"><h2>${esc(x.n)}</h2>${body}<button type="button" class="btn" data-x>Close</button></div>`);
    if (root.Cos25FX && root.Cos25FX.preview && k !== 'ti') root.Cos25FX.preview(k, id, m.root);
    m.root.addEventListener('click', (e) => { if (e.target.closest('[data-x]')) m.close(); });
  }

  // ---------- Captain Rex: how cosmetics work ----------
  // Once per account, and it can't be skipped: existing pilots get it the
  // first time they're in the hangar after 2.5, new pilots once the HoloNet
  // (and with it their profile) is set up. Never mid-battle or over a pop-up.
  const T = () => root.Tutorial;
  const qs = (x) => document.querySelector(x);
  const clearScreen = () => !UI.App.battleActive && UI.App.current !== 'battle' && !qs('.modal-backdrop, .modal, .tut-intro, .tut-coach, .tut-skip, .tut-victory, .tut-welcome, .feat-show, .feat-cine, .rank-up, .walkout, .fx25-ov, .wp25, .tc-scene') && !(root.RexGuide && root.RexGuide.active && root.RexGuide.active()) && !(root.Tutorial && root.Tutorial.active);
  let touring = false;
  const waitFor = (test, cb) => { const t = setInterval(() => { if (test()) { clearInterval(t); cb(); } }, 250); };
  function tourStep(text, glow, label, next) { T().coach(text, glow, { tour: true, next, label: label || 'Next' }); }
  // The pose the welcome kit gives: the type of your strongest card.
  function kitPose() {
    try { let best = null, bp = -1; for (const [id, u] of Object.entries(Player.state.units || {})) { const d = D.UNIT_MAP[id]; if (!d) continue; const p = D.power ? D.power(d, u.level, u.stars) : 0; if (p > bp) { bp = p; best = id; } } return best && root.Cos25FX ? root.Cos25FX.typeOf(best) : 'trooperl'; } catch (e) { return 'trooperl'; }
  }
  // Replaying the tutorial (Settings) replays this briefing too, once the tutorial ends.
  // Replaying the tutorial replays the battle tutorial and its badge only; the cosmetics briefing stays done.
  function tour() {
    if (touring || !T() || !T().coach) return;
    touring = true;
    const rex = D.UNIT_MAP.captain_rex;
    const lines = ['Commander! Quick briefing. The galaxy just got a lot more stylish.', 'You can wear frames and titles, strike a victory pose when your card is MVP, and pick your own win screens and crate openings.', 'Here, a welcome kit from me: the Recruit frame, the Rookie title, and the victory pose for your strongest card. Let\'s go try them on.'];
    const node = UI.el(`<div class="tut-intro" role="dialog" aria-label="Captain Rex"><div class="ti-glow"></div><p class="eyebrow ti-eye">Captain Rex · Update 2.5</p><div class="ti-mentor">${rex ? UI.portrait(rex, { plate: false }) : ''}</div><div class="ti-box"><b>${rex ? esc(rex.name) : 'Captain Rex'}</b><p data-line></p><span class="ti-next" data-next>Tap to continue</span></div></div>`);
    document.body.appendChild(node);
    let i = 0;
    const line = node.querySelector('[data-line]');
    const show = () => { line.textContent = lines[i]; line.classList.remove('in'); void line.offsetWidth; line.classList.add('in'); if (i === lines.length - 1) node.querySelector('[data-next]').outerHTML = '<button class="btn btn-primary ti-go" type="button" data-go>Show me</button>'; };
    show();
    node.addEventListener('click', (e) => {
      if (e.target.closest('[data-go]')) { const c = C(); const kitDone = !!c.kit; c.kit = 1; c.kitDone = kitDone; const kp = kitPose(); c.kitPose = kp; if (c.kitDone) { c.kitPose = c.kitPose || kp; } else if (!ownsItem('po', POSES.find((x) => x.id === kp))) { c.own['po:' + kp] = 1; c.seen['po:' + kp] = 0; } save(); sync(); node.classList.add('out'); setTimeout(() => node.remove(), 350); return steps(); }
      if (i < lines.length - 1) { i++; show(); }
    });
  }
  function steps() {
    UI.profile();
    waitFor(() => qs('[data-p2="cos"]'), () => {
      T().coach('This is your profile. Tap <b>Cosmetics</b>.', '[data-p2="cos"]', { tour: true });
      waitFor(() => qs('.c25'), () => {
        tourStep('Each tab holds one kind of cosmetic: <b>frames, titles, poses, win screens</b> and <b>pack themes</b>.', '.c25-tabs', 'Next', () => {
          T().coach('Open the <b>Poses</b> tab.', '[data-ck="po"]', { tour: true });
          waitFor(() => qs('[data-ck="po"].on'), () => {
            const kp = C().kitPose || 'trooperl'; const kn = (POSES.find((x) => x.id === kp) || {}).n || 'pose';
            T().coach(`Your <b>${kn}</b> is here. It\'s the pose your strongest card strikes as MVP. Tap it.`, `.c25-it[data-id="${kp}"]`, { tour: true });
            waitFor(() => qs('.c25-pop'), () => {
              T().coach('Tap <b>Try it on</b> to see the real pose.', '[data-ptry]', { tour: true });
              let tried = false; const tb = qs('[data-ptry]'); if (tb) tb.addEventListener('click', () => { tried = true; }, { once: true });
              waitFor(() => tried || !qs('.c25-pop'), () => {
                T().coach('Looks sharp. Now tap <b>Equip</b>. Locked items can be tried on too; you just can\'t equip them until you earn them.', '[data-peq]', { tour: true });
                waitFor(() => C().eq.po === (C().kitPose || 'trooperl') || !qs('.c25-pop'), () => {
                  tourStep('Equipped! Your MVP will strike it after every win. Titles show only on your profile card, and some have colours you can upgrade.', '.c25-tabs', 'Next', () => {
              document.querySelectorAll('.modal-backdrop').forEach((n) => n.remove());
              UI.App.ui.shop25 = 'luthen'; UI.App.go('market');
              setTimeout(() => tourStep('<b>Luthen\'s Gallery</b> sells titles, win screens and crate themes, and upgrades title colours. It\'s the only shop that takes Beskar.', '[data-s25="luthen"]', 'Next', () => {
                UI.App.ui.shop25 = 'casino'; UI.App.go('market');
                setTimeout(() => tourStep('And this is <b>Watto\'s Wagers</b>: Holo-Chess, podraces and Pazaak. The brass plaque on his counter is his payout board: every 5 minutes he pays one pilot. Keep an eye out for your name!', '.wp25-plq, [data-s25="casino"]', 'Got it', () => {
                  T().clearCoach(); root.Player.state.cos25tour = 1; root.Player.save(); touring = false;
                }), 500);
              }), 500);
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  setInterval(() => { if (!ready()) return; const c = C(); if (c.fxq && c.fxq.length && clearScreen()) { const id = c.fxq.shift(); save(); titleScene(id); } }, 2500);
  // If the tour's window ever vanishes (a reload of the screen, another pop-up), it starts again later.
  let lost = 0;
  setInterval(() => { if (touring && !root.Player.state.cos25tour && !qs('.tut-intro, .tut-coach, .c25, .c25-pop')) { if (++lost > 5) { touring = false; lost = 0; } } else lost = 0; }, 2000);
  setInterval(() => { if (!touring && ready() && !root.Player.state.cos25tour && root.Player.state.tutorial && root.Player.state.tutorial.done && clearScreen() && (UI.App.current === 'home' || UI.App.current === 'campaign')) tour(); }, 2000);
  // The casino file (which owns the shop tabs) can load after this one: queue the pane for it.
  if (root.Shops25) root.Shops25.add('luthen', gallery); else (root.__shops25q = root.__shops25q || []).push(['luthen', gallery]);
  // Casino wins feed the casino titles.
  root.Cos25 = { ready, open, sync, tour, titleScene, titleHtml, TITLES, TIERS, POSES, WINS, PACKS, INTROS, eq, ownsItem, C: () => C(), save };
  if (HN()) HN().titleHtml = titleHtml;
  // The HoloNet loads later on most devices: hook in once it's there.
  let tries = 0;
  const hook = setInterval(() => { if (root.HN) { root.HN.titleHtml = titleHtml; if (root.HN.S) { clearInterval(hook); sync(); } } if (++tries > 120) clearInterval(hook); }, 1000);
  if (typeof document !== 'undefined' && !document.getElementById('c25-css')) {
    const s = document.createElement('style');
    s.id = 'c25-css';
    s.textContent = ".t25{font:800 13px var(--font-display);letter-spacing:.1em;display:inline-block;line-height:1.3}\n.tt-gold{color:#ffd23f;text-shadow:0 0 8px rgba(255,210,63,.5)}.tt-silver{color:#e6eef6}.tt-kyber{background:linear-gradient(90deg,#8fe8ff,#5a8aff,#8fe8ff);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:t25s 3s linear infinite}\n.tt-crimson{color:#ff4a5a;text-shadow:0 0 10px rgba(255,40,60,.7)}.tt-aurora{background:linear-gradient(90deg,#5affc8,#b07aff,#ffd23f,#5affc8);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:t25s 4s linear infinite}\n.tt-holo{color:#9ff8ff;text-shadow:0 0 6px #5ad0ff;animation:t25h 2.6s steps(1) infinite}@keyframes t25s{to{background-position:-200% 0}}@keyframes t25h{0%,100%{opacity:1}48%{opacity:.4}50%{opacity:1}52%{opacity:.6}}\nbody.perf-lite .t25{animation:none!important}\n.pf-id .t25,.p2-id .t25{display:block;margin:2px 0 4px}\n.c25{display:grid;gap:12px;min-width:0}.c25-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.c25-head h2{margin:0}\n.c25-prev{display:grid;gap:10px;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)}\n.c25-card{position:relative;display:flex;gap:14px;align-items:center;padding:14px;border-radius:16px;background:linear-gradient(135deg,#1a2a44,#0e1626 60%,#1a1430);border:1px solid #2a3a56;overflow:hidden;min-width:0}\n.c25-card::after{content:'';position:absolute;inset:0;background:linear-gradient(115deg,transparent 40%,rgba(255,255,255,.08) 50%,transparent 60%);transform:translateX(-100%);pointer-events:none}.c25-card.pop::after{animation:c25sh .7s ease}@keyframes c25sh{to{transform:translateX(100%)}}\n.c25-av{flex:none}.c25-id{display:grid;gap:3px;min-width:0}.c25-id small{font:700 10px var(--font-display);letter-spacing:.12em;color:var(--muted)}.c25-id>b{font:800 19px var(--font-display);overflow-wrap:anywhere}.c25-sub{font-size:12px;color:var(--muted)}\n.c25-eq{margin:0;display:grid;gap:6px;padding:12px;border-radius:16px;background:var(--panel-2);border:1px solid var(--line)}.c25-eq dt{font:700 10px var(--font-display);letter-spacing:.1em;color:var(--muted);text-transform:uppercase}.c25-eq dd{margin:0 0 4px;font:700 14px var(--font-display)}\n.c25-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}.c25-tabs::-webkit-scrollbar{display:none}.c25-tabs button{position:relative;flex:none;font:700 14px var(--font-display);padding:9px 14px;border-radius:12px;border:1px solid var(--line);background:var(--panel-2);color:var(--text);cursor:pointer}.c25-tabs button i{font-style:normal;font-size:11px;color:var(--muted);margin-left:4px}.c25-tabs button.on{border-color:var(--crawl);box-shadow:inset 0 -3px 0 var(--crawl)}\n.c25-dot{position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:#ff4a5a;box-shadow:0 0 0 2px var(--panel)}.c25-dot[hidden]{display:none}\n.c25-bar{display:flex;gap:10px;flex-wrap:wrap;justify-content:space-between}.c25-seg{display:flex;gap:4px;padding:3px;border-radius:999px;background:var(--panel-2);border:1px solid var(--line)}.c25-seg[hidden]{display:none}.c25-seg button{font:700 13px var(--font-display);padding:6px 14px;border-radius:999px;border:0;background:transparent;color:var(--text);cursor:pointer}.c25-seg button.on{background:var(--crawl);color:#2a1c00}\n.c25-grid{display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(128px,1fr));max-height:min(46vh,520px);overflow-y:auto;padding:2px}\n.c25-it{position:relative;display:grid;justify-items:center;align-content:start;gap:5px;padding:12px 8px 10px;border-radius:14px;border:1px solid var(--line);background:var(--panel-2);color:var(--text);cursor:pointer;font:inherit;text-align:center;min-height:120px}\n.c25-it b{font:700 13px var(--font-display)}.c25-it small{font-size:11px;color:var(--muted);line-height:1.3}.c25-it.eq{border-color:var(--crawl);box-shadow:inset 0 0 0 1px var(--crawl)}.c25-it.eq small{color:var(--crawl);font-weight:700}.c25-it.sel{outline:2px solid var(--light);outline-offset:2px}\n.c25-it.lock .c25-th,.c25-it.lock .c25-sw,.c25-it.lock .t25,.c25-it.lock .c25-fr{filter:saturate(.35) brightness(.7)}.c25-it .t25{margin:14px 0 4px}\n.c25-lk{position:absolute;top:8px;left:8px;width:10px;height:8px;border-radius:2px;background:#8a96a8}.c25-lk::before{content:'';position:absolute;left:1.5px;top:-6px;width:7px;height:7px;border:2px solid #8a96a8;border-bottom:0;border-radius:5px 5px 0 0;box-sizing:border-box}\n.c25-bar2{width:80%;height:5px;border-radius:3px;background:#1a2430;overflow:hidden}.c25-bar2 i{display:block;height:100%;background:linear-gradient(90deg,var(--light),var(--heal))}\n.c25-sw{--c:#fff;display:block;width:52px;height:52px;border-radius:12px;background:radial-gradient(circle at 30% 30%,#fff5,transparent 50%),linear-gradient(135deg,var(--c),color-mix(in srgb,var(--c) 35%,#000))}\n.c25-sw.po{clip-path:polygon(50% 0,62% 36%,100% 38%,70% 60%,80% 100%,50% 76%,20% 100%,30% 60%,0 38%,38% 36%)}.c25-sw.wi{width:70px;height:44px;border-radius:8px;box-shadow:inset 0 -14px 0 rgba(0,0,0,.35)}.c25-sw.pa{width:46px;height:46px;border-radius:8px;box-shadow:inset 0 0 0 3px rgba(255,255,255,.25),inset 0 -16px 0 rgba(0,0,0,.25)}.c25-sw.big{width:180px;height:110px}\n.c25-fr{display:block;transform:scale(.9)}\n.c25-det{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:12px 14px;border-radius:14px;background:var(--panel-2);border:1px solid var(--line)}.c25-det>b{font:800 15px var(--font-display)}.c25-det>span{font-size:13px;color:var(--muted);flex:1 1 180px}\n.c25-btn{font:800 14px var(--font-display);padding:10px 22px;border-radius:999px;border:0;background:linear-gradient(180deg,#ffe27a,#d8a028);color:#2a1c00;cursor:pointer}.c25-btn:disabled{opacity:.5;cursor:default}\n.c25-tiers{display:flex;gap:6px;flex-wrap:wrap;width:100%}.c25-tier{display:grid;gap:2px;justify-items:center;padding:7px 10px;border-radius:10px;border:1px solid var(--line);background:var(--panel);cursor:pointer;color:var(--text);font:inherit}.c25-tier.on{border-color:var(--crawl);box-shadow:inset 0 0 0 1px var(--crawl)}.c25-tier.lockd{opacity:.8;border-style:dashed}.c25-tier small{font-size:11px}\n.c25-b{font:700 13px var(--font-display);color:#c8d4e0}.c25-k{font:700 13px var(--font-display);color:#8fe8ff}\n.c25-try{display:grid;gap:8px;justify-items:center;padding:16px}\n.lu25-hero{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:16px;align-items:start;margin-bottom:12px}.lu25-copy{padding-top:clamp(4px,3vw,28px)}.lu25-sign{display:inline-flex;align-items:center;gap:10px;padding:7px 18px;border-radius:4px;background:linear-gradient(180deg,#2a1e0c,#140e06);border:1px solid #d8b46a;box-shadow:inset 0 0 0 3px #140e06,inset 0 0 0 4px rgba(216,180,106,.45),0 4px 14px rgba(0,0,0,.45)}.lu25-sign span{font:700 13px Georgia,'Times New Roman',serif;letter-spacing:.42em;margin-right:-.42em;background:linear-gradient(180deg,#fff2c8,#e8c06a 50%,#a87a28);-webkit-background-clip:text;background-clip:text;color:transparent}.lu25-sign i{width:6px;height:6px;transform:rotate(45deg);background:linear-gradient(135deg,#ffe8a8,#b8862e);flex:none}.lu25-copy h1{margin:2px 0 6px}.lu25-art svg{width:100%;max-width:560px;height:auto;display:block;border-radius:14px}\n.lu25-wallet{display:flex;gap:12px;flex-wrap:wrap}.lu25-wallet span{padding:5px 12px;border-radius:999px;background:var(--panel-2);border:1px solid var(--line)}\n.lu25-grid{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(min(100%,190px),1fr));margin-bottom:14px}\n.lu25-it{--c:#d8b46a;position:relative;overflow:hidden;display:grid;gap:6px;justify-items:center;text-align:center;padding:14px 10px 12px;border-radius:14px;border:1px solid color-mix(in srgb,var(--c) 40%,#3a3020);background:radial-gradient(120% 70% at 50% 0%,color-mix(in srgb,var(--c) 24%,transparent),transparent 62%),linear-gradient(180deg,#1c1710,#0c0a07);box-shadow:inset 0 1px 0 rgba(255,236,190,.08),0 6px 18px rgba(0,0,0,.35)}\n.lu25-it::before{content:\"\";position:absolute;inset:5px;border-radius:10px;border:1px solid rgba(216,180,106,.18);pointer-events:none}\n.lu25-it.prem{border-color:#d8b46a;box-shadow:inset 0 0 0 1px rgba(216,180,106,.35),0 6px 18px rgba(0,0,0,.35)}\n.lu25-it.lu25-ft{padding:0 0 14px;gap:8px}.lu25-it.lu25-ft .lu25-sw{width:100%;min-height:150px;margin-bottom:4px;background:radial-gradient(60% 55% at 50% 42%,color-mix(in srgb,var(--c) 40%,transparent),transparent 70%),repeating-linear-gradient(90deg,rgba(255,236,190,.035) 0 1px,transparent 1px 22px),linear-gradient(180deg,#241c10,#0f0c07);border-bottom:1px solid rgba(216,180,106,.3);position:relative}\n.lu25-it.lu25-ft .lu25-sw::after{content:\"\";position:absolute;left:50%;bottom:14px;width:58%;height:12px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.6),transparent)}\n.lu25-it.lu25-ft .c25-sw{transform:scale(1.7);box-shadow:0 0 26px color-mix(in srgb,var(--c) 60%,transparent)}\n.lu25-it.lu25-ft b{font-size:19px;letter-spacing:.02em}.lu25-grid.lu25-fg{grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr))}\n.lu25-grid.lu25-lg{grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr));align-items:start}.lu25-it.lu25-lib{padding:0 0 12px;gap:6px}.lu25-la{width:100%;aspect-ratio:2/1;background:#0a0806;border-bottom:1px solid rgba(216,180,106,.3);overflow:hidden}.lu25-la.bn{aspect-ratio:9/2}.lu25-la .l5{width:100%;height:100%}.lu25-la.big{border:1px solid rgba(216,180,106,.4);border-radius:12px;margin-bottom:10px}\n.lu25-rib{position:absolute;top:10px;left:10px;z-index:1;font:800 10px var(--font-display);letter-spacing:.18em;color:#2a1c00;background:linear-gradient(180deg,#ffe27a,#d8a028);padding:3px 8px;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.4)}\n.lu25-it small{letter-spacing:.04em}\n.currency.beskar25{display:none}body:has(.s25-pane[data-p=\"luthen\"]:not([hidden])) .currency.beskar25{display:inline-flex}body:has(.s25-pane[data-p=\"luthen\"]:not([hidden])) .currency.credits{display:none}.currency.beskar25 i svg{width:18px;height:18px;display:block}\n.lu25-sw{min-height:56px;display:grid;place-items:center}.lu25-it b{font:800 15px var(--font-display)}.lu25-it small{font-size:12px;color:var(--muted)}\n.lu25-btns{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}.lu25-try{font:700 13px var(--font-display);padding:8px 14px;border-radius:999px;border:1.5px solid #d8b46a;background:transparent;color:#ffe2a0;cursor:pointer}\n.lu25-buy{font:800 13px var(--font-display);padding:8px 14px;border-radius:999px;border:0;background:linear-gradient(180deg,#5ab4ff,#2a6ad8);color:#fff;cursor:pointer}.lu25-buy .c25-b,.lu25-buy .c25-k{color:inherit}.lu25-buy.gold{background:linear-gradient(180deg,#ffe27a,#d8a028);color:#2a1c00}\n.lu25-ups{display:grid;gap:8px;margin-bottom:14px}.lu25-up{display:grid;gap:6px;padding:10px 12px;border-radius:12px;background:var(--panel-2);border:1px solid var(--line)}.lu25-up>b{font:800 14px var(--font-display)}.c25-btn{background:#10384a!important;border:1.5px solid #8fe8ff!important;color:#e8fbff!important;box-shadow:0 0 12px rgba(143,232,255,.25)}.c25-tbtn,.lu25-try{font:800 14px var(--font-display);padding:10px 20px;border-radius:999px;border:0!important;background:linear-gradient(180deg,#ffe27a,#d8a028)!important;color:#2a1c00!important;cursor:pointer}.c25-ghost{font:700 14px var(--font-display);padding:10px 18px;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--text);cursor:pointer}.c25-pop{max-width:640px;justify-items:center;text-align:center}.c25-pop h2{margin:0}.c25-pop .c25-card,.c25-pop .fx25-prev,.c25-pop .c25-try{width:100%}.c25-pst{margin:0;color:var(--muted);font-size:14px}.c25-pbtns{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.c25-tier.on{border-color:var(--crawl)}.lu25-own{font:800 13px var(--font-display);color:var(--heal);padding:8px 6px}\n.lu25-note{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:12px 14px;border-radius:14px;background:var(--panel-2);border:1px solid var(--line);margin-bottom:10px}.lu25-note span{flex:1 1 200px;font-size:13px;color:var(--muted)}.lu25-note.ex{border-style:dashed}\n.tb25{position:fixed;inset:0;z-index:9500;display:grid;place-items:center;padding:16px;background:radial-gradient(circle at 50% 45%,rgba(30,50,80,.94),rgba(2,4,10,.96) 70%);overflow:hidden;animation:tb25in .3s ease}.tb25.out{opacity:0;transition:opacity .35s}@keyframes tb25in{from{opacity:0}}\n.tb25-rays{position:absolute;left:50%;top:42%;width:160vmax;height:160vmax;margin:-80vmax;background:repeating-conic-gradient(rgba(255,210,63,.1) 0 8deg,transparent 8deg 16deg);animation:tb25s 20s linear infinite}@keyframes tb25s{to{transform:rotate(1turn)}}\n.tb25-card{position:relative;display:grid;justify-items:center;gap:8px;width:min(420px,92vw);padding:22px 18px;border-radius:18px;background:linear-gradient(180deg,#14223a,#0a1220);border:2px solid #ffd23f;text-align:center;animation:tb25p .6s cubic-bezier(.2,1.4,.4,1) both}@keyframes tb25p{from{transform:scale(.6);opacity:0}}\n.tb25-badge{width:110px;height:110px;display:grid;place-items:center;border-radius:50%;color:#ffd23f;background:radial-gradient(circle,#2a3a5a,#0a1220 70%);box-shadow:0 0 0 3px #ffd23f,0 0 40px rgba(255,210,63,.5);animation:tb25b 1s .2s cubic-bezier(.2,1.4,.4,1) both}.tb25-badge svg{width:64px;height:64px}@keyframes tb25b{from{transform:rotateY(180deg) scale(.4);opacity:0}}\n.tb25-k{margin:6px 0 0;font:800 12px var(--font-display);letter-spacing:.3em;color:#ffd27a}.tb25-card .t25{font-size:clamp(22px,6vw,30px)}.tb25-line{margin:0;font-size:14px;color:#dfe8f4;font-style:italic}.tb25-how{margin:0;font-size:12px;color:var(--muted)}.tb25-btns{display:flex;gap:8px;margin-top:6px}\nbody.perf-lite .tb25-rays{animation:none}\n@media (max-width:720px){.c25-prev,.lu25-hero{grid-template-columns:1fr}.c25-grid{grid-template-columns:repeat(auto-fill,minmax(100px,1fr));max-height:none}.c25-card{padding:10px}}";
    document.head.appendChild(s);
  }
})(typeof window !== 'undefined' ? window : globalThis);
