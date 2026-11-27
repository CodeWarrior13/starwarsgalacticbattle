// Snow Day at Echo Base (Christmas 2026): a 27-door advent calendar (Nov 29 – Dec 25, Central),
// Rex's missions, Luthen's pop-up stall (with a secret), the Wampa King's cave for every level,
// the Frostline holiday campaign on Hoth, a Christmas wish list and the Christmas Day tree.
// Testers only until approved: localStorage swcg-sd-test = a day number (0 = Nov 29 … 26 = Dec 25, 27 = after).
(function (root) {
  'use strict';
  const UI = root.UI; const Player = root.Player; const D = root.GameData; const SD = root.SnowDayData;
  if (!UI || !Player || !D || !SD) return;
  const APPROVED = false; // flips to true when Brayden approves; until then only testers see Snow Day
  const DAY = 864e5;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ls = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const testDay = () => { const v = ls('swcg-sd-test'); return v != null && /^\d+$/.test(v) ? +v : null; };
  const on = () => testDay() != null || (APPROVED && Date.now() >= SD.START - DAY);
  const now = () => { const t = testDay(); return t == null ? Date.now() : SD.START + t * DAY + 13 * 3600e3; };
  const dayNo = () => Math.floor((now() - SD.START) / DAY);
  const live = () => on() && dayNo() >= 0 && dayNo() < SD.DOORS;
  const N = SD.DAYS.length;
  const S = () => { const s = Player.state || {}; if (!s.sd26 || typeof s.sd26 !== 'object') s.sd26 = {}; const h = s.sd26; if (!Array.isArray(h.d)) h.d = new Array(N).fill(0); if (!h.p || typeof h.p !== 'object') h.p = {}; if (!h.own || typeof h.own !== 'object') h.own = {}; if (!Array.isArray(h.cs)) h.cs = [0, 0, 0, 0, 0, 0]; return h; };
  const save = () => { try { Player.save(); } catch (e) { /* storage blocked */ } };
  const toast = (m) => (UI.toast ? UI.toast(m) : null);
  const hnLevel = () => ((Player.state.account || {}).level | 0) >= 25;
  const state = (i) => (S().d[i] ? 'done' : !live() || dayNo() < i ? 'lock' : dayNo() === i ? 'today' : 'catch');
  const opened = () => S().d.filter(Boolean).length;
  const ART = () => root.SNOWDAY_ART || {};
  const centralHour = () => { try { return +new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hour: 'numeric', hour12: false }).format(new Date(now())) % 24; } catch (e) { return new Date().getHours(); } };

  // ---------- Pictures (loaded the first time Snow Day opens) ----------
  let artP = null;
  const loadArt = () => artP || (artP = new Promise((res) => { if (root.SNOWDAY_ART) return res(); const sc = document.createElement('script'); sc.src = root.__ver ? root.__ver('js/snowday-art.js') : 'js/snowday-art.js'; sc.onload = res; sc.onerror = res; document.head.appendChild(sc); }));
  let uqn = 0;
  const uq = (svg) => { const p = 'q' + (++uqn).toString(36) + '_'; return String(svg || '').replace(/id="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`).replace(/href="#([^"]+)"/g, `href="#${p}$1"`); };
  const CUR = {
    beskar: ['Beskar', '<svg viewBox="0 0 40 40"><path d="M6 26 L11 12 H29 L34 26Z" fill="#9aa4b4"/><path d="M11 12 H29 L26 18 H14Z" fill="#d8dee8"/><path d="M6 26 L11 12 H29 L34 26Z" fill="none" stroke="#5a6474" stroke-width="1.4"/></svg>'],
    kyber: ['Kyber', '<svg viewBox="0 0 40 40"><path d="M20 4 L29 16 L20 36 L11 16Z" fill="#5ab4ff"/><path d="M20 4 L29 16 L20 36Z" fill="#2a7ad0"/><path d="M11 16 H29" stroke="#cfe8ff" stroke-width="1"/></svg>'],
    credits: ['credits', '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="#e8c14a"/><circle cx="20" cy="20" r="10" fill="none" stroke="#8a6a12" stroke-width="1.6"/><rect x="16" y="16" width="8" height="8" rx="1" fill="#8a6a12"/></svg>'],
    holocron: ['Jedi Holocron', '<svg viewBox="0 0 40 40"><path d="M20 6 L33 14 V27 L20 35 L7 27 V14Z" fill="#2a62c8"/><path d="M20 6 L33 14 L20 21 L7 14Z" fill="#7ab4ff"/><path d="M20 21 V35" stroke="#cfe8ff" stroke-width="1"/><circle cx="20" cy="20" r="3" fill="#cfe8ff" opacity=".8"/></svg>'],
  };
  const SKIN_N = { vader: 'Gingerbread Vader', din_djarin: 'Santa Mando', commander_cody: 'Festive Cody', tie_advanced: 'Gingerbread TIE', r2d2: 'Festive R2-D2', stormtrooper: 'Christmas Trooper', yoda: 'Santa Yoda', c3po: 'Sweater C-3PO', darth_maul: 'Festive Maul', x_wing: 'Gift-wing', falcon: 'Holiday Falcon' };
  const TYPE_N = { banner: 'banner', frame: 'frame', pfp: 'profile picture', shot: 'blaster shot', back: 'card back', win: '', crate: '' };
  const info = (ref) => {
    const [t, a] = ref;
    if (CUR[t]) return { key: t, art: CUR[t][1], label: `${(+a).toLocaleString('en-US')} ${CUR[t][0]}`, cur: 1 };
    if (t === 'skin') return { key: 'skin:' + a, art: uq(ART()['skin:' + a]), label: `${SKIN_N[a] || a} skin`, kind: 'sq' };
    const lbl = TYPE_N[t] ? `${a} ${TYPE_N[t]}` : a;
    return { key: t + ':' + a, art: uq(ART()[t + ':' + a]), label: lbl, kind: t === 'banner' || t === 'shot' ? 'wide' : t === 'back' ? 'tall' : t === 'win' || t === 'crate' ? 'mid' : 'sq' };
  };
  const itemArt = (key) => { const [t, ...rest] = key.split(':'); return info([t, rest.join(':')]); };

  // ---------- Rewards ----------
  function addBeskar(n) {
    try { if (root.HN && root.HN.S) { root.HN.S().beskar = (root.HN.S().beskar || 0) + n; if (root.HN.save) root.HN.save(); return; } } catch (e) { /* HoloNet not ready */ }
    const h = S(); h.pendB = (h.pendB || 0) + n; save();
  }
  const beskar = () => { try { return (root.HN && root.HN.S && root.HN.S().beskar) || 0; } catch (e) { return 0; } };
  const spendBeskar = (n) => { try { if (beskar() < n) return false; root.HN.S().beskar -= n; if (root.HN.save) root.HN.save(); return true; } catch (e) { return false; } };
  function grant(ref) {
    const [t, a] = ref; const h = S();
    if (t === 'credits') Player.state.credits = (Player.state.credits || 0) + a;
    else if (t === 'kyber') Player.state.crystals = (Player.state.crystals || 0) + a;
    else if (t === 'beskar') addBeskar(a);
    else if (t === 'holocron') { h.holo = (h.holo || 0) + 1; }
    else h.own[t + ':' + a] = 1;
    save(); if (UI.updateWallet) UI.updateWallet();
  }

  // ---------- Missions ----------
  const need = (i) => { const m = SD.DAYS[i].m; if (m.k === 'upgrade') return allMaxStars() ? 10 : 6; if (m.k === 'login' || m.k === 'equip' || m.k === 'visit') return 1; if (m.k === 'duel') return hnLevel() ? m.n : m.low; return m.n; };
  const allMaxStars = () => { const u = Object.values(Player.state.units || {}); return u.length > 0 && u.every((x) => (x.stars | 0) >= (D.MAX_STARS || 7)); };
  const prog = (i) => { const h = S(); const m = SD.DAYS[i].m; if (m.k === 'camp') return Math.min(need(i), h.cs.filter(Boolean).length); if (m.k === 'upgrade') { const p = h.p[i] || {}; return allMaxStars() ? Math.min(10, p.l | 0) : Math.min(1, p.s | 0) + Math.min(5, p.l | 0); } return Math.min(need(i), h.p[i] | 0); };
  const ready = (i) => prog(i) >= need(i);
  const missionText = (i) => { const m = SD.DAYS[i].m; const n = need(i);
    switch (m.k) {
      case 'login': return i === N - 1 ? 'Log in on Christmas Day.' : 'Log in today.';
      case 'wins': return m.planet ? `Win ${n} battles on ${D.PLANET_MAP[m.planet] ? D.PLANET_MAP[m.planet].name : m.planet}.` : m.ship ? `Win ${n} fleet battles.` : m.squad ? `Win ${n} battles with C-3PO or Cody in your squad (or any ${m.alt} wins).` : m.wookiee ? `Win a battle with a Wookiee in your squad (or any ${m.alt} wins).` : `Win ${n} battles anywhere.`;
      case 'crates': return `Open ${n} crates (any kind).`;
      case 'duel': return hnLevel() ? (m.arena ? `Win ${n} Live Duels or arena battles.` : 'Win a friendly battle or a Live Duel.') : `Win ${n} battles${m.arena ? ' in the campaign' : ''}.`;
      case 'ults': return `Use ${n} ultimates.`;
      case 'help': return `Use ${n} abilities that help an ally (heal, shield or buff).`;
      case 'upgrade': return allMaxStars() ? 'Level up your cards 10 times (all your cards are fully promoted).' : 'Promote any card by 1 star, and level up your cards 5 times.';
      case 'boss': return n > 1 ? `Fight ${n} full battles against the Wampa King.` : 'Fight one full battle against the Wampa King.';
      case 'streak': return `Win ${n} battles in a row without a loss.`;
      case 'camp': return n >= 6 ? 'Clear all 6 stages of the Frostline.' : `Clear the first ${n} stages of the Frostline.`;
      case 'night': return `Win ${n} battles after 6 PM Central.`;
      case 'equip': return 'Equip any holiday item you have earned.';
      case 'visit': return 'Visit Luthen\'s pop-up stall.';
      default: return '';
    } };
  // One event can count for every open door (today's and any being caught up).
  function bump(fn) {
    if (!live()) return; const h = S(); let changed = false;
    for (let i = 0; i <= Math.min(dayNo(), N - 1); i++) { if (h.d[i]) continue; const m = SD.DAYS[i].m; const before = prog(i); fn(i, m, h); if (prog(i) !== before) changed = true; }
    if (changed) { save(); paint(); }
  }
  const add = (h, i, n = 1) => { h.p[i] = (h.p[i] | 0) + n; };
  const isWookiee = (id) => /chewbacca|wookiee|tarfful|krrsantan|zaalbar|lowbacca/.test(id);
  function onBattle(battle, params, won) {
    if (!params || params.type === 'tutorial' || params.type === 'preview') return;
    const h = S();
    const ids = battle && battle.side ? battle.side('player').map((u) => u.id || (u.def && u.def.id)) : [];
    const kind = (root.BattleUI && root.BattleUI.kind) || params.kind || 'character';
    if (params.sd === 'boss' || (params.sd === 'camp' && SD.FROST[params.st] && SD.FROST[params.st].boss)) bump((i, m) => { if (m.k === 'boss') add(h, i); });
    if (params.sd === 'camp' && won) campWin(params.st, battle);
    if (!won) { h.str = 0; save(); return; }
    h.str = (h.str | 0) + 1;
    const hn = params.hn;
    bump((i, m) => {
      if (m.k === 'wins') {
        if (m.planet && params.planet === m.planet && params.type === 'stage' && !params.sd) add(h, i);
        else if (m.ship && kind === 'ship') add(h, i);
        else if (m.squad) { if (ids.some((x) => m.squad.includes(x))) add(h, i); else { h.p[i + 'a'] = (h.p[i + 'a'] | 0) + 1; if (h.p[i + 'a'] >= m.alt) h.p[i] = m.n; } }
        else if (m.wookiee) { if (ids.some(isWookiee)) add(h, i); else { h.p[i + 'a'] = (h.p[i + 'a'] | 0) + 1; if (h.p[i + 'a'] >= m.alt) h.p[i] = m.n; } }
        else if (!m.planet && !m.ship) add(h, i);
      }
      if (m.k === 'duel') { if (hnLevel()) { if (hn === 'duel' || hn === 'friend' || hn === 'friendly' || (m.arena && hn === 'arena') || params.type === 'friendly') add(h, i); } else if (!m.arena || params.type === 'stage') add(h, i); }
      if (m.k === 'streak') h.p[i] = Math.max(h.p[i] | 0, h.str);
      if (m.k === 'night' && centralHour() >= 18) add(h, i);
    });
    save();
  }
  // Abilities: count the player's ultimates and ally-helping abilities as they're used.
  if (root.Battle && !root.Battle.prototype.__sd26) {
    const act0 = root.Battle.prototype.act; root.Battle.prototype.__sd26 = true;
    root.Battle.prototype.act = function (unit, idx, t) {
      const r = act0.call(this, unit, idx, t);
      try { if (unit && unit.side === 'player' && live()) { const ab = unit.abilities[idx]; const helps = ab && (/^(ally|allAllies|self)$/.test(ab.target) || (ab.effects || []).some((e) => e && (e.type === 'heal' || e.type === 'shield' || (e.type === 'status' && /Up$|taunt|shield/.test(e.status || ''))))); bump((i, m, h) => { if (m.k === 'ults' && ab.ultimate) add(h, i); if (m.k === 'help' && helps) add(h, i); }); } } catch (e) { /* counting only */ }
      return r;
    };
  }
  if (!Player.__sd26) {
    Player.__sd26 = true;
    const op = Player.openPack.bind(Player); Player.openPack = function (...a) { const r = op(...a); try { if (r) bump((i, m, h) => { if (m.k === 'crates') add(h, i); }); } catch (e) { /* */ } return r; };
    const lu = Player.levelUp.bind(Player); Player.levelUp = function (...a) { const r = lu(...a); try { if (r) bump((i, m, h) => { if (m.k === 'upgrade') { const p = h.p[i] || (h.p[i] = {}); p.l = (p.l | 0) + 1; } }); } catch (e) { /* */ } return r; };
    const su = Player.starUp.bind(Player); Player.starUp = function (...a) { const r = su(...a); try { if (r) bump((i, m, h) => { if (m.k === 'upgrade') { const p = h.p[i] || (h.p[i] = {}); p.s = (p.s | 0) + 1; } }); } catch (e) { /* */ } return r; };
  }
  UI.hooks.battleEnd.push((b, p, w) => { try { onBattle(b, p, w); if (p && p.sd) back = true; } catch (e) { /* bookkeeping only */ } });

  // ---------- Battles: the Wampa King and the Frostline ----------
  const UNITS = () => {
    const dmg = (mult) => ({ type: 'damage', mult, hits: 1 });
    const st = (status, turns, chance) => ({ type: 'status', status, turns, chance: chance == null ? 1 : chance });
    const ab = (name, cd, target, effects, desc) => ({ name, cd, target, effects, desc });
    const ult = (name, target, effects, desc, quote) => ({ name, cd: 0, target, effects, desc, quote, ultimate: true });
    return [
      { id: 'sd_wampa', name: 'The Wampa King', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'tank', spd: 96, traits: [], home: 'hoth', portrait: 'wampa', exclusive: true, boss: { hp: 2.6, atk: 0.8, def: 1.1 },
        bio: 'The biggest wampa on Hoth. He stole the presents and the tree topper.',
        abilities: [ab('Icy Swipe', 0, 'enemy', [dmg(1.15)], 'Rakes one card with frozen claws.'), ab('Avalanche Roar', 3, 'allEnemies', [dmg(0.7), st('stun', 1, 0.25)], 'A roar that brings the ceiling down; a chance to Stun.')],
        ultimate: ult('Snow Cave', 'self', [{ type: 'heal', pct: 0.2 }, st('defUp', 2)], 'He drags his loot into the dark and recovers.', 'RAAWR!') },
      { id: 'sd_beast', name: 'Snow Wampa', kind: 'character', faction: 'dark', rarity: 'rare', role: 'attacker', spd: 110, traits: [], home: 'hoth', portrait: 'wampa', exclusive: true,
        bio: 'Hungry, furry and wearing stolen tinsel.', abilities: [ab('Claw', 0, 'enemy', [dmg(0.9)], 'A heavy claw swipe.')], ultimate: ult('Pounce', 'enemy', [dmg(1.4)], 'Leaps out of the snow.', '') },
      { id: 'sd_probe', name: 'Probe Droid', kind: 'character', faction: 'dark', rarity: 'common', role: 'support', spd: 130, traits: ['droid'], home: 'hoth', exclusive: true,
        bio: 'An Imperial probe droid scanning for the gift tent.', abilities: [ab('Scan Bolt', 0, 'enemy', [dmg(0.75), st('defDown', 2, 0.4)], 'Marks a target with a sensor bolt.')], ultimate: ult('Signal Burst', 'allEnemies', [dmg(0.6)], 'Calls in a strike.', '') },
      { id: 'sd_atst', name: 'Holiday AT-ST', kind: 'character', faction: 'dark', rarity: 'epic', role: 'tank', spd: 84, traits: [], home: 'hoth', exclusive: true,
        bio: 'Parked on top of the gift tent. Somebody hung lights on it.', abilities: [ab('Chin Guns', 0, 'enemy', [dmg(1.0)], 'Twin blaster fire.'), ab('Stomp', 3, 'allEnemies', [dmg(0.6), st('offDown', 2, 0.4)], 'Shakes the snow loose.')], ultimate: ult('Grenade Volley', 'allEnemies', [dmg(0.9)], 'Concussion grenades all along the line.', '') },
    ];
  };
  function unitsReady() {
    for (const u of UNITS()) if (!D.UNIT_MAP[u.id]) { D.UNIT_MAP[u.id] = u; if (D.BIOS) D.BIOS[u.id] = u.bio; }
    const A = root.Art; if (!A || !A.addArt || !A.kit || A.__sd26) return; A.__sd26 = true;
    const { P, R, C, E } = A.kit;
    A.addArt('char', 'sd_probe', () => `${R(0, 0, 100, 100, '#22406e')}${P('M0 74 L30 62 L60 72 L100 60 V100 H0Z', '#cfe0f5')}${E(50, 40, 18, 16, '#2a2e36')}${E(50, 36, 14, 10, '#3a3e48')}${C(50, 40, 4, '#ff3a3a')}${C(42, 34, 2, '#ff3a3a', 'opacity=".7"')}${C(58, 34, 2, '#ff3a3a', 'opacity=".7"')}${[[-1, 1], [1, 1], [0, 1]].map(([s], i) => P(`M${50 + s * 10} 54 L${50 + s * 16 + (i - 1) * 6} 90 L${50 + s * 14 + (i - 1) * 6} 90 L${50 + s * 8} 54Z`, '#3a3e48')).join('')}${P('M44 22 L42 6 M56 22 L58 6', 'none', 'stroke="#5a6070" stroke-width="2"')}`);
    A.addArt('char', 'sd_atst', () => `${R(0, 0, 100, 100, '#22406e')}${P('M0 80 L40 70 L100 78 V100 H0Z', '#cfe0f5')}${P('M30 24 L70 24 L76 40 L70 52 L30 52 L24 40Z', '#8a94a4')}${P('M30 24 L70 24 L66 30 L34 30Z', '#a8b2c0')}${R(34, 36, 32, 5, '#2a2e36')}${R(20, 42, 8, 4, '#5a6070')}${R(72, 42, 8, 4, '#5a6070')}${P('M40 52 L36 70 L44 88 L36 92 M60 52 L64 70 L56 88 L64 92', 'none', 'stroke="#6a7484" stroke-width="5" stroke-linecap="round"')}${[0, 1, 2, 3, 4, 5].map((i) => C(30 + i * 8, 24 - Math.sin(i / 5 * Math.PI) * 4, 1.6, ['#ff4a5a', '#ffd23f', '#4ad46a', '#4aa8ff', '#ff7ad9'][i % 5])).join('')}`);
  }
  if (!Player.__sd26enc) {
    Player.__sd26enc = true; const enc0 = Player.encounter.bind(Player);
    Player.encounter = function (params) {
      if (!params || !params.sd) return enc0(params);
      unitsReady();
      const e = enc0({ type: 'stage', planet: 'hoth', stage: 0 });
      const sq = Player.squadEntries('character');
      const lvl = Math.max(1, Math.round(sq.reduce((a, x) => a + (x.level || 1), 0) / Math.max(1, sq.length)));
      if (params.sd === 'boss') return { ...e, kind: 'character', name: 'The Wampa King', enemies: ['sd_beast', 'sd_wampa', 'sd_beast'], level: lvl, stars: 3, enemyScale: 1, boss: 'sd_wampa', label: 'Snow Day · The Wampa King' };
      const st = SD.FROST[params.st] || SD.FROST[0];
      return { ...e, kind: 'character', name: st.n, enemies: st.en.slice(), level: Math.max(1, lvl - 2 + params.st), stars: 2 + (params.st >= 3 ? 1 : 0), enemyScale: 1, boss: st.boss ? 'sd_wampa' : null, label: `Frostline · Stage ${params.st + 1} of 6` };
    };
  }
  let back = false;
  function fight(params) {
    unitsReady();
    if (!Player.squadEntries('character').length) { toast('Pick a ground squad first.'); return; }
    close();
    root.BattleUI.start({ type: 'stage', planet: 'hoth', stage: 0, ...params });
  }
  function campWin(st, battle) {
    const h = S(); const mine = battle && battle.side ? battle.side('player') : [];
    const alive = mine.filter((u) => u.hp > 0).length; const stars = alive === mine.length ? 3 : alive * 2 >= mine.length ? 2 : 1;
    const first = !h.cs[st]; h.cs[st] = Math.max(h.cs[st] | 0, stars);
    if (first) grant(SD.FROST[st].pay);
    if (h.cs.every((x) => x >= 3) && !h.own['pfp:Snowtrooper Scarf']) { h.own['pfp:Snowtrooper Scarf'] = 1; h.secretPop = 1; }
    save(); bump(() => {});
  }

  // ---------- Opening a door ----------
  function openDoor(i) {
    const h = S(); if (h.d[i] || !ready(i)) return;
    if (i === N - 1) { h.d[i] = 1; save(); christmas(true); return; }
    h.d[i] = 1; SD.DAYS[i].r.forEach(grant); save();
    if (opened() === N && !h.adv) { h.adv = 1; Player.state.crystals = (Player.state.crystals || 0) + 100; save(); setTimeout(() => { if (UI.celebrateFeat) UI.celebrateFeat('sd26_adv'); }, 2400); }
    reveal(i);
  }
  function reveal(i) {
    const x = SD.DAYS[i];
    const m = UI.openModal(`<div class="sd-rev"><div class="sd-rev-door"><div class="sd-swing">${SD.DOOR(i)}</div><div class="sd-rev-in">${x.r.map((r) => { const f = info(r); return `<span class="sd-ri ${f.cur ? 'cur' : f.kind}">${f.art}</span>`; }).join('')}</div></div>
      <p class="eyebrow">Door ${i + 1} · ${esc(x.d)}</p><h2>${esc(x.t)}</h2><ul class="sd-rlist">${x.r.map((r) => `<li>${esc(info(r).label)}</li>`).join('')}</ul><p class="muted small">Added to your collection. Skins and items stay yours after Christmas.</p>
      <div class="modal-actions"><button type="button" class="btn btn-primary" data-x>Merry Christmas!</button></div></div>`, { small: true, cls: 'sd-modal' });
    m.root.querySelector('[data-x]').onclick = () => m.close();
    if (root.Sound) try { root.Sound.play('reveal_epic'); } catch (e) { /* */ }
  }
  function doorSheet(i, after) {
    const x = SD.DAYS[i]; const st = state(i); const h = S();
    const rewards = `<ul class="sd-rw">${x.r.map((r) => { const f = info(r); return `<li class="${f.cur ? 'cur' : f.kind}"><span class="sd-rw-a">${f.art}</span><span>${esc(f.label)}</span></li>`; }).join('')}</ul>`;
    let body;
    if (st === 'lock') body = `<p class="muted">This door opens on ${esc(x.d)} at midnight Central.</p>`;
    else if (st === 'done') body = `<p>You opened this door.</p>${rewards}${x.r.some((r) => !['credits', 'kyber', 'beskar', 'holocron'].includes(r[0])) ? '<button type="button" class="btn" data-equip>Equip</button>' : ''}`;
    else {
      const p = prog(i), n = need(i);
      body = `<div class="sd-rexline">${uq(SD.REX('rxs'))}<div><b>Captain Rex</b>${x.rex.map((l) => `<p>${esc(l)}</p>`).join('')}</div></div>
        <p class="sd-task"><b>Mission:</b> ${esc(missionText(i))}</p><div class="sd-bar"><i style="width:${Math.round(p / n * 100)}%"></i></div><p class="muted small">${p} / ${n}${st === 'catch' ? ' · catching up' : ''}</p>
        <p class="eyebrow" style="margin-top:8px">Behind this door</p>${rewards}
        <div class="modal-actions">${x.m.k === 'boss' ? '<button type="button" class="btn" data-cave>Go to the cave</button>' : ''}${x.m.k === 'camp' ? '<button type="button" class="btn" data-frost>Go to the Frostline</button>' : ''}${x.m.k === 'visit' ? '<button type="button" class="btn" data-stall>Visit Luthen</button>' : ''}<button type="button" class="btn btn-primary" data-open ${ready(i) ? '' : 'disabled'}>${ready(i) ? 'Open the door' : 'Not yet'}</button></div>
        ${testDay() != null ? '<p class="sd-test"><button type="button" class="btn btn-small" data-cheat>Tester: complete this mission</button></p>' : ''}`;
    }
    const m = UI.openModal(`<div class="sd-sheet"><div class="sd-sheet-door ${st}">${SD.DOOR(i)}</div><p class="eyebrow">Door ${i + 1} · ${esc(x.d)}${st === 'catch' ? ' · catch up' : ''}</p><h2>${esc(x.t)}</h2>${body}<div class="modal-actions"><button type="button" class="btn" data-x>Back</button></div></div>`, { small: true, cls: 'sd-modal', onClose: after });
    const r = m.root;
    r.addEventListener('click', (e) => {
      if (e.target.closest('[data-x]')) return m.close();
      if (e.target.closest('[data-open]')) { m.close(); openDoor(i); return; }
      if (e.target.closest('[data-cave]')) { m.close(); panel('cave'); return; }
      if (e.target.closest('[data-frost]')) { m.close(); panel('frost'); return; }
      if (e.target.closest('[data-stall]')) { m.close(); panel('stall'); return; }
      if (e.target.closest('[data-equip]')) { h.eq = 1; save(); bump((j, mm, hh) => { if (mm.k === 'equip') add(hh, j); }); toast('Equipped. (In the full build this puts it on in Cosmetics.)'); return; }
      if (e.target.closest('[data-cheat]')) { const mm = x.m; if (mm.k === 'camp') { for (let k = 0; k < need(i); k++) h.cs[k] = Math.max(h.cs[k] | 0, 1); } else if (mm.k === 'upgrade') h.p[i] = { s: 1, l: 10 }; else h.p[i] = need(i); save(); m.close(); doorSheet(i, after); }
    });
    return m;
  }

  // ---------- The place itself ----------
  let el = null;
  const HOT = [['cal', 'Advent calendar', 3, 30, 78, 98], ['tree', 'The tree', 84, 60, 152, 150], ['wish', 'Wish box', 150, 170, 172, 206], ['rex', 'Rex: missions', 44, 182, 100, 216], ['frost', 'Frostline', 176, 168, 224, 210], ['stall', 'Luthen\'s stall', 256, 94, 344, 198], ['cave', 'Wampa cave', 346, 94, 400, 162]];
  function hub() {
    const i = Math.min(dayNo(), N - 1); const today = live() && i >= 0 ? i : -1;
    const tday = today >= 0 ? `<div class="sd-today"><div class="sd-today-rex">${uq(SD.REX('rxt'))}</div><div><p class="eyebrow">Door ${today + 1} · ${esc(SD.DAYS[today].d)}</p><b>${esc(SD.DAYS[today].t)}</b><p>${esc(missionText(today))}</p><div class="sd-bar"><i style="width:${S().d[today] ? 100 : Math.round(prog(today) / need(today) * 100)}%"></i></div></div><button type="button" class="btn btn-primary" data-door="${today}">${S().d[today] ? 'Opened ✓' : ready(today) ? 'Open it!' : 'View'}</button></div>` : '';
    return `<div class="sd-stage">${SD.HUB()}${HOT.map(([k, n, x1, y1, x2, y2]) => `<button type="button" class="sd-hot" data-go="${k}" style="left:${x1 / 4}%;top:${y1 / 2.4}%;width:${(x2 - x1) / 4}%;height:${(y2 - y1) / 2.4}%" aria-label="${esc(n)}"><span>${esc(n)}</span></button>`).join('')}</div>
      <p class="sd-catch">Missed a door? Claim it any day until Christmas Day, 11:59 PM Central.</p>${tday}
      <nav class="sd-nav">${HOT.map(([k, n]) => `<button type="button" class="sd-chip" data-go="${k}">${esc(n)}</button>`).join('')}</nav>`;
  }
  function calendar() {
    const h = S();
    return `<div class="sd-p-head"><h2>The advent calendar</h2><p class="muted">27 doors · ${opened()} opened · Missed a door? Claim it any day until Christmas Day, 11:59 PM Central.</p></div>
      <div class="sd-wd">${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => `<span>${d}</span>`).join('')}</div>
      <div class="sd-cal">${SD.DAYS.map((x, i) => { const st = state(i); const f = st === 'done' ? info(x.r[0]) : null; return `<button type="button" class="sd-door ${st} ${x.m.k === 'boss' ? 'boss' : ''} ${x.m.k === 'camp' ? 'camp' : ''} ${i === N - 1 ? 'xmas' : ''}" data-door="${i}" aria-label="Door ${i + 1}, ${esc(x.d)}, ${st}">${st === 'done' ? `<span class="sd-door-in">${f.art}</span><span class="sd-door-n">${i + 1}</span>` : SD.DOOR(i)}${st === 'catch' ? '<em>catch up</em>' : ''}${st === 'today' && ready(i) ? '<em class="go">open!</em>' : ''}<small>${esc(x.d)}</small></button>`; }).join('')}<span class="sd-door-blank"></span></div>`;
  }
  function stall() {
    const h = S(); h.vis = 1; bump((i, m, hh) => { if (m.k === 'visit') add(hh, i); }); save();
    const line = SD.LUTHEN.hello[(dayNo() + 27) % SD.LUTHEN.hello.length];
    return `<div class="sd-p-head"><h2>Luthen's pop-up stall</h2><p class="muted">Christmas-week pieces, for Beskar. You have <b>${beskar().toLocaleString('en-US')}</b> Beskar. Calendar gifts can't be bought.</p></div>
      <div class="sd-npc"><button type="button" class="sd-npc-pic" data-talk aria-label="Talk to Luthen">${uq(SD.LUTH('lus'))}</button><div class="sd-bub">"${esc(line)}"<br><button type="button" class="sd-link" data-talk>Talk to Luthen</button></div></div>
      <div class="sd-shop">${SD.STALL.map((x) => { const f = itemArt(x.key); const own = h.own[x.key]; return `<div class="sd-shop-i"><span class="sd-rw-a ${f.kind}">${f.art}</span><b>${esc(x.n)}</b><button type="button" class="btn ${own ? '' : 'btn-primary'}" data-buy="${esc(x.key)}" ${own ? 'disabled' : ''}>${own ? 'Owned' : `${x.cost.toLocaleString('en-US')} Beskar`}</button></div>`; }).join('')}</div>`;
  }
  function talk() {
    const h = S();
    const m = UI.openModal(`<div class="sd-talk"><div class="sd-talk-pic">${uq(SD.LUTH('lut'))}</div><div class="sd-talk-c"><p class="eyebrow">Luthen</p><p class="sd-say">"${esc(SD.LUTHEN.hello[2])}"</p><div class="sd-opts"><button type="button" class="btn" data-o="sale">What's for sale?</button><button type="button" class="btn" data-o="merry">Wish Luthen a Merry Christmas</button><button type="button" class="btn" data-o="bye">Goodbye</button></div></div></div>`, { small: true, cls: 'sd-modal' });
    const say = (t) => { m.root.querySelector('.sd-say').textContent = `"${t}"`; };
    const opts = (html) => { m.root.querySelector('.sd-opts').innerHTML = html; };
    m.root.addEventListener('click', (e) => {
      const o = e.target.closest('[data-o]'); if (!o) return; const k = o.dataset.o;
      if (k === 'bye') return m.close();
      if (k === 'sale') { say(SD.LUTHEN.hello[0] + ' ' + SD.LUTHEN.hello[1]); return; }
      if (k === 'merry') { say(SD.LUTHEN.merry); opts(h.gen ? '<button type="button" class="btn" data-o="bye">Merry Christmas, Luthen</button>' : '<button type="button" class="btn" data-o="just">Just wanted to say it. Merry Christmas.</button><button type="button" class="btn btn-primary" data-o="give">Give him a gift (1,000 credits)</button>'); return; }
      if (k === 'just') { say(SD.LUTHEN.noGift); opts('<button type="button" class="btn" data-o="bye">Goodbye</button>'); return; }
      if (k === 'give') {
        if ((Player.state.credits || 0) < 1000) { say('Kind of you. But keep your credits; you need them more than I do.'); opts('<button type="button" class="btn" data-o="bye">Goodbye</button>'); return; }
        Player.state.credits -= 1000; h.gen = { t: Date.now() }; save(); if (UI.updateWallet) UI.updateWallet();
        say(SD.LUTHEN.gift);
        opts(`<div class="sd-pick">${SD.STALL.map((x) => { const f = itemArt(x.key); return `<button type="button" class="sd-pick-i" data-o="pick" data-k="${esc(x.key)}" ${h.own[x.key] ? 'disabled' : ''}><span class="sd-rw-a ${f.kind}">${f.art}</span><span>${esc(x.n)}${h.own[x.key] ? ' (owned)' : ''}</span></button>`; }).join('')}</div>`);
        return;
      }
      if (k === 'pick') { const key = o.dataset.k; const it = SD.STALL.find((x) => x.key === key); h.own[key] = 1; h.gen.pick = it ? it.n : key; save(); m.close(); genScene(); }
    });
  }
  function genScene() {
    const n = document.createElement('div'); n.className = 'sd-gen'; n.setAttribute('role', 'dialog');
    n.innerHTML = `<div class="sd-gen-c">${SD.GEN()}<p class="eyebrow">Secret badge</p><h2>Generosity</h2><p class="sd-gen-q">"${esc(SD.LUTHEN.thanks)}"</p><p class="muted">You chose: <b>${esc(S().gen.pick)}</b></p><button type="button" class="btn btn-primary" data-x>Merry Christmas</button></div>`;
    document.body.appendChild(n); requestAnimationFrame(() => n.classList.add('in'));
    n.querySelector('[data-x]').onclick = () => { n.classList.remove('in'); setTimeout(() => { n.remove(); if (UI.celebrateFeat) UI.celebrateFeat('sd26_gen'); render(); }, 350); };
  }
  function cave() {
    return `<div class="sd-p-head"><h2>The Wampa King's cave</h2><p class="muted">Boss doors (Dec 6, 12, 19 and 24) need full battles against him. Win or lose, a finished battle counts.</p></div>
      <div class="sd-cave"><div class="sd-cave-art">${uq(SD.HUB()).replace('class="sd-hub-svg"', 'class="sd-hub-svg sd-cave-crop" viewBox="330 80 70 90"')}</div>
      <div class="sd-cave-c">${hnLevel() ? '<p><b>Level 25 and up:</b> he is also the HoloNet community raid during Advent, with the Snow Globe frames for the top damage. (Raid hookup comes with the full build.)</p>' : ''}<p><b>Every level:</b> fight him here in your own battle on Hoth, sized to your squad: the Wampa King and two Snow Wampas.</p><p class="muted small">Moves: Icy Swipe, Avalanche Roar (a chance to Stun), Snow Cave (he heals and digs in).</p><button type="button" class="btn btn-primary" data-boss>Fight the Wampa King</button></div></div>`;
  }
  function frost() {
    const h = S(); const pts = [[40, 190], [110, 150], [70, 100], [150, 70], [230, 100], [300, 50]];
    const open = (i) => i === 0 || h.cs[i - 1] > 0;
    return `<div class="sd-p-head"><h2>Frostline</h2><p class="muted">A holiday campaign on Hoth for every level, sized to your squad. First clears pay out; doors on Dec 9 and Dec 16 ask for it.</p></div>
      <div class="sd-fmap"><svg viewBox="0 0 340 220" aria-hidden="true"><defs><linearGradient id="sdfm" x2="0" y2="1"><stop offset="0" stop-color="#22406e"/><stop offset="1" stop-color="#8aa8d0"/></linearGradient></defs><rect width="340" height="220" fill="url(#sdfm)"/><path d="M0 120 L40 90 L80 110 L130 70 L180 100 L230 60 L280 90 L340 60 V220 H0Z" fill="#c8d8ec"/><path d="M0 170 Q100 150 200 170 T340 160 V220 H0Z" fill="#eef4ff"/>
        <path d="M${pts.map((p) => p.join(' ')).join(' L')}" stroke="#c8102e" stroke-width="3" fill="none" stroke-dasharray="6 5"/></svg>
        ${pts.map(([x, y], i) => `<button type="button" class="sd-fn ${h.cs[i] ? 'done' : ''} ${open(i) ? '' : 'lock'} ${SD.FROST[i].boss ? 'boss' : ''}" style="left:${x / 3.4}%;top:${y / 2.2}%" data-st="${i}" ${open(i) ? '' : 'disabled'}><b>${SD.FROST[i].boss ? '☠' : i + 1}</b><small>${'★'.repeat(h.cs[i] | 0)}${'☆'.repeat(3 - (h.cs[i] | 0))}</small></button>`).join('')}</div>
      <ol class="sd-flist">${SD.FROST.map((s, i) => `<li class="${h.cs[i] ? 'done' : ''}"><b>${i + 1}. ${esc(s.n)}</b> <span class="muted">${esc(s.d)}</span></li>`).join('')}</ol>`;
  }
  function stage(i) {
    const s = SD.FROST[i]; const h = S(); const pay = info(s.pay);
    const m = UI.openModal(`<div class="sd-sheet"><p class="eyebrow">Frostline · Stage ${i + 1} of 6</p><h2>${esc(s.n)}</h2><p>${esc(s.d)}</p><p class="muted small">Enemies: ${s.en.map((id) => esc(id === 'snowtrooper' ? 'Snowtrooper' : (UNITS().find((u) => u.id === id) || {}).name || id)).join(', ')}</p><p>Best: ${'★'.repeat(h.cs[i] | 0)}${'☆'.repeat(3 - (h.cs[i] | 0))}${h.cs[i] ? '' : ` · first clear pays <b>${esc(pay.label)}</b>`}</p><p class="muted small">Stars: 3 if your whole squad survives, 2 if half does, 1 for a win.</p><div class="modal-actions"><button type="button" class="btn" data-x>Back</button><button type="button" class="btn btn-primary" data-f>Fight</button></div></div>`, { small: true, cls: 'sd-modal' });
    m.root.addEventListener('click', (e) => { if (e.target.closest('[data-x]')) m.close(); if (e.target.closest('[data-f]')) { m.close(); fight({ sd: 'camp', st: i }); } });
  }
  function wish() {
    const ok = live() || testDay() != null; const sent = (S().wish || []).length;
    return `<div class="sd-p-head"><h2>Christmas wish list</h2><p class="muted">Wish for something you'd love to see in the game. Every wish is read. Wishes close on Christmas Day.</p></div>
      ${ok ? `<div class="sd-wsteps" data-step="1"><p class="eyebrow">Step 1 of 3 · What are you wishing for?</p><div class="sd-wtypes">${SD.WISH_TYPES.map(([k, n, ic]) => `<button type="button" class="sd-wt" data-wt="${k}"><i>${ic}</i>${esc(n)}</button>`).join('')}</div></div>` : '<p>Wishes are closed for this year.</p>'}
      ${sent ? `<p class="muted small">You've sent ${sent} wish${sent > 1 ? 'es' : ''} this Christmas.</p>` : ''}`;
  }
  function wishStep(box, type) {
    const t = SD.WISH_TYPES.find((x) => x[0] === type) || SD.WISH_TYPES[11];
    box.innerHTML = `<p class="eyebrow">Step 2 of 3 · ${esc(t[1])}</p>${type === 'skin' ? '<label class="sd-lab">Which card?<input class="sd-in" data-card maxlength="40" placeholder="For example: Ahsoka"></label>' : ''}<label class="sd-lab">Describe it<textarea class="sd-in" data-txt maxlength="420" rows="4" placeholder="${type === 'custom' ? 'Anything you\'d like to see' : 'Colours, theme, how it moves…'}"></textarea></label><div class="modal-actions"><button type="button" class="btn" data-wback>Back</button><button type="button" class="btn btn-primary" data-wnext>Next</button></div>`;
    box.dataset.type = type;
  }
  async function wishSend(text) {
    const F = root.__hnFb; if (!F || !F.signedIn) throw new Error('offline');
    const u = await F.signedIn(); if (!u) throw new Error('offline');
    await F.fs.collection('hn/live/suggestions').add({ text: text.slice(0, 600), t: F.firebase.firestore.FieldValue.serverTimestamp(), lvl: (Player.state.account.level | 0) || 1 });
  }
  function panel(k) {
    if (!el) open(); const body = el.querySelector('.sd-body');
    if (k === 'tree') { if (dayNo() >= N - 1 && live()) { christmas(false); return; } toast('Come back on Christmas Day. Something will be under the tree.'); return; }
    if (k === 'rex') { const i = Math.min(Math.max(dayNo(), 0), N - 1); doorSheet(i, render); return; }
    body.innerHTML = `<button type="button" class="sd-back" data-home>← Echo Base</button>${k === 'cal' ? calendar() : k === 'stall' ? stall() : k === 'cave' ? cave() : k === 'frost' ? frost() : k === 'wish' ? wish() : ''}`;
    body.dataset.p = k; el.querySelector('.sd-scroll').scrollTop = 0;
  }
  function render() { if (!el) return; const p = el.querySelector('.sd-body').dataset.p; if (p && p !== 'hub') panel(p); else home(); head(); }
  function home() { const b = el.querySelector('.sd-body'); b.innerHTML = hub(); b.dataset.p = 'hub'; }
  function head() {
    const t = testDay();
    el.querySelector('.sd-top-s').textContent = live() ? `Door ${Math.min(dayNo(), N - 1) + 1} of 27 · ${opened()} opened` : dayNo() < 0 ? 'Opens Sunday, November 29' : 'Merry Christmas';
    const tb = el.querySelector('.sd-tester'); tb.hidden = t == null;
    if (t != null) tb.querySelector('b').textContent = t < N ? `Day ${t + 1} · ${SD.DAYS[t].d}` : 'After Christmas';
  }
  function paint() { if (el) render(); const g = document.querySelector('.sd-globe b'); if (g) g.textContent = String(Math.min(Math.max(dayNo(), 0), N - 1) + 1); }
  function open() {
    if (!on()) return;
    loadArt().then(() => {
      if (!el) {
        el = document.createElement('div'); el.className = 'sd-root'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Snow Day at Echo Base');
        el.innerHTML = `<div class="sd-scroll"><header class="sd-top"><button type="button" class="sd-x" data-close aria-label="Back to the galaxy">✕</button><div><b>Snow Day at Echo Base</b><small class="sd-top-s"></small></div></header>
          <div class="sd-tester" hidden>Tester <button type="button" class="btn btn-small" data-td="-1">‹</button><b></b><button type="button" class="btn btn-small" data-td="1">›</button><button type="button" class="btn btn-small" data-treset>Reset Snow Day</button></div>
          <div class="sd-body"></div></div>`;
        document.body.appendChild(el);
        el.addEventListener('click', onClick);
      }
      document.body.classList.add('sd-open'); home(); head();
      requestAnimationFrame(() => el.classList.add('in'));
      if (S().secretPop) { S().secretPop = 0; save(); setTimeout(() => { const m = UI.openModal(`<div class="sd-rev"><div class="sd-ri sq big">${uq(ART()['pfp:Snowtrooper Scarf'])}</div><p class="eyebrow">Secret found</p><h2>Snowtrooper Scarf</h2><p class="muted">Three stars on every Frostline stage. Not many pilots will find this one.</p><div class="modal-actions"><button type="button" class="btn btn-primary" data-x>Nice</button></div></div>`, { small: true, cls: 'sd-modal' }); m.root.querySelector('[data-x]').onclick = () => m.close(); }, 500); }
    });
  }
  function close() { if (!el) return; el.classList.remove('in'); document.body.classList.remove('sd-open'); const n = el; el = null; setTimeout(() => n.remove(), 300); }
  function onClick(e) {
    const t = e.target;
    if (t.closest('[data-close]')) return close();
    if (t.closest('[data-home]')) { home(); return; }
    const g = t.closest('[data-go]'); if (g) return panel(g.dataset.go);
    const d = t.closest('[data-door]'); if (d) return doorSheet(+d.dataset.door, render);
    const td = t.closest('[data-td]'); if (td) { const v = Math.max(0, Math.min(N, (testDay() || 0) + +td.dataset.td)); try { localStorage.setItem('swcg-sd-test', String(v)); } catch (x) { /* */ } render(); return; }
    if (t.closest('[data-treset]')) { delete Player.state.sd26; save(); toast('Snow Day reset for this account.'); render(); return; }
    if (t.closest('[data-talk]')) return talk();
    const b = t.closest('[data-buy]'); if (b) { const it = SD.STALL.find((x) => x.key === b.dataset.buy); if (!it) return; if (!spendBeskar(it.cost)) { toast(`You need ${it.cost.toLocaleString('en-US')} Beskar.`); return; } S().own[it.key] = 1; save(); toast(`${it.n} is yours.`); render(); return; }
    if (t.closest('[data-boss]')) return fight({ sd: 'boss' });
    const st = t.closest('[data-st]'); if (st) return stage(+st.dataset.st);
    const wt = t.closest('[data-wt]'); if (wt) return wishStep(el.querySelector('.sd-wsteps'), wt.dataset.wt);
    if (t.closest('[data-wback]')) return panel('wish');
    if (t.closest('[data-wnext]')) { const box = el.querySelector('.sd-wsteps'); const txt = (box.querySelector('[data-txt]').value || '').trim(); const card = box.querySelector('[data-card]') ? box.querySelector('[data-card]').value.trim() : ''; if (txt.length < 4) { toast('Tell us a little more about your wish.'); return; } const ty = SD.WISH_TYPES.find((x) => x[0] === box.dataset.type); box.dataset.txt = txt; box.dataset.card = card; box.innerHTML = `<p class="eyebrow">Step 3 of 3 · Check your wish</p><div class="sd-wcard"><i>${ty ? ty[2] : '✏'}</i><div><b>${esc(ty ? ty[1] : 'Wish')}${card ? ` · ${esc(card)}` : ''}</b><p>${esc(txt)}</p></div></div><div class="modal-actions"><button type="button" class="btn" data-wt="${esc(box.dataset.type)}">Edit</button><button type="button" class="btn btn-primary" data-wsend>Send my wish</button></div>`; return; }
    if (t.closest('[data-wsend]')) { const box = el.querySelector('.sd-wsteps'); const h = S(); const day = new Date(now()).toDateString(); const todayN = (h.wish || []).filter((w) => w.day === day).length; if (todayN >= 3) { toast('That\'s plenty of wishes for today. Try again tomorrow.'); return; } const ty = SD.WISH_TYPES.find((x) => x[0] === box.dataset.type); const text = `[Christmas wish · ${ty ? ty[1] : 'Wish'}${box.dataset.card ? ' · ' + box.dataset.card : ''}] ${box.dataset.txt}`; (h.wish = h.wish || []).push({ day, type: box.dataset.type }); save(); box.innerHTML = '<div class="sd-wdone"><b>Wish sent</b><p>Thanks, pilot. It went straight into Santa Yoda\'s sack.</p></div>'; wishSend(text).catch(() => { (h.wishQ = h.wishQ || []).push(text); save(); }); return; }
  }

  // ---------- Christmas Day: the tree ----------
  function christmas(fromDoor) {
    const h = S(); if (document.querySelector('.sd-xt')) return;
    const gifts = SD.DAYS[N - 1].r;
    const n = document.createElement('div'); n.className = 'sd-xt'; n.setAttribute('role', 'dialog'); n.setAttribute('aria-label', 'Christmas morning');
    n.innerHTML = `<div class="sd-xt-title"><p class="eyebrow">December 25</p><h1>Merry Christmas</h1></div><div class="sd-xt-tree-w">${SD.TREE()}</div>
      <div class="sd-xt-gifts">${gifts.map((g, i) => `<button type="button" class="sd-gift ${h.xg && h.xg[i] ? 'open' : ''}" data-g="${i}" style="--d:${(2.6 + i * .35).toFixed(2)}s" aria-label="Present ${i + 1}" disabled>${SD.PRESENT(i)}</button>`).join('')}</div>
      <p class="sd-xt-hint">Tap the presents to open them</p><button type="button" class="btn btn-primary sd-xt-done" data-done hidden>Back to Echo Base</button>`;
    document.body.appendChild(n); requestAnimationFrame(() => n.classList.add('in'));
    // Unskippable intro: the tree lights up and the presents drop in, then they can be opened.
    setTimeout(() => { n.classList.add('ready'); n.querySelectorAll('.sd-gift').forEach((b) => { b.disabled = false; }); check(); }, 5200);
    const check = () => { const all = gifts.every((_, i) => h.xg && h.xg[i]); n.querySelector('[data-done]').hidden = !all; if (all) n.querySelector('.sd-xt-hint').textContent = 'Merry Christmas from Rex, Luthen and the whole galaxy.'; };
    n.addEventListener('click', (e) => {
      const b = e.target.closest('[data-g]');
      if (b && !b.disabled && !b.classList.contains('open')) {
        const i = +b.dataset.g; h.xg = h.xg || {}; h.xg[i] = 1; grant(gifts[i]); save(); b.classList.add('open');
        const f = info(gifts[i]);
        const pop = document.createElement('div'); pop.className = 'sd-xt-pop'; pop.innerHTML = `<span class="sd-ri ${f.cur ? 'cur' : f.kind}">${f.art}</span><b>${esc(f.label)}</b>`; document.body.appendChild(pop); setTimeout(() => pop.remove(), 2600); const cap = document.createElement('span'); cap.className = 'sd-gl'; cap.textContent = f.label; b.appendChild(cap);
        if (gifts[i][0] === 'holocron') setTimeout(() => { try { const r = Player.openPack('holocron', null, { free: true }); if (r && UI.packReveal) UI.packReveal(r, 'holocron'); } catch (x) { /* */ } }, 900);
        check(); return;
      }
      if (e.target.closest('[data-done]')) { h.xmas = 1; save(); n.classList.remove('in'); setTimeout(() => n.remove(), 400); if (!fromDoor) open(); else render(); }
    });
  }

  // ---------- Ways in: the snow globe over the galaxy, and a sign in Luthen's Gallery ----------
  function globe() {
    if (!on()) return; const map = document.querySelector('#screen .home-galaxy'); if (!map || map.querySelector('.sd-globe')) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'sd-globe'; b.setAttribute('aria-label', 'Snow Day at Echo Base');
    b.innerHTML = `<svg viewBox="0 0 80 90" aria-hidden="true"><defs><radialGradient id="sdgg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".45" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#bfe0ff" stop-opacity=".35"/></radialGradient><clipPath id="sdgc"><circle cx="40" cy="38" r="30"/></clipPath></defs><g clip-path="url(#sdgc)"><rect x="10" y="8" width="60" height="60" fill="#22406e"/><path d="M10 52 Q40 44 70 52 V68 H10Z" fill="#eef4ff"/><path d="M26 52 Q40 32 54 52Z" fill="#cfe0f5"/><rect x="35" y="44" width="10" height="8" fill="#ffcf7a"/><path d="M58 52 L64 40 L70 52Z" fill="#1f7a3e"/><g class="sd-gsnow">${[[20, 20], [32, 30], [50, 18], [60, 32], [28, 42], [46, 28]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#fff"/>`).join('')}</g></g><circle cx="40" cy="38" r="30" fill="url(#sdgg)"/><circle cx="40" cy="38" r="30" fill="none" stroke="#dceeff" stroke-width="2"/><path d="M16 62 Q40 72 64 62 L70 80 Q40 90 10 80Z" fill="#c8a050"/><text x="40" y="80" text-anchor="middle" font-family="Fredoka,Arial" font-weight="700" font-size="8" fill="#2a1c00">SNOW DAY</text></svg><b>${Math.min(Math.max(dayNo(), 0), N - 1) + 1}</b>`;
    b.onclick = open; map.appendChild(b);
  }
  function gallerySign() {
    if (!on()) return; const hero = document.querySelector('.lu25-hero'); if (!hero || hero.querySelector('.sd-sign')) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'sd-sign'; b.innerHTML = '<span>❄</span> Snow Day at Echo Base <span>→</span>'; b.onclick = open; hero.appendChild(b);
  }
  const A = UI.App;
  if (A && !A.__sd26) {
    A.__sd26 = true; const go = A.go.bind(A);
    A.go = function (screen, params, opts) { const r = go(screen, params, opts); try { if (screen === 'home') setTimeout(globe, 60); if (back && screen !== 'battle' && !A.battleActive) { back = false; setTimeout(open, 250); } } catch (e) { /* decoration only */ } return r; };
  }
  setInterval(() => { try { if (!on()) return; globe(); gallerySign(); flush(); } catch (e) { /* */ } }, 1500);
  const flush = () => { const h = S(); if (h.pendB && root.HN && root.HN.S) { const n = h.pendB; h.pendB = 0; addBeskar(n); save(); } if (h.wishQ && h.wishQ.length) { const q = h.wishQ.splice(0); save(); q.forEach((t) => wishSend(t).catch(() => { (h.wishQ = h.wishQ || []).push(t); save(); })); } };
  // Login doors open their mission automatically; Christmas morning plays instead of the galaxy.
  const busy = () => !!document.querySelector('.app-splash, .hv-ann, .modal-backdrop, .tut-intro, .tut-coach, .walkout, .feat-show, .feat-cine, .rank-up') || (A && A.battleActive);
  const morning = () => { try { if (!live()) return; bump((i, m, h) => { if (m.k === 'login') h.p[i] = 1; }); if (dayNo() === N - 1 && !S().xmas) { if (busy()) { setTimeout(morning, 1500); return; } christmas(false); } } catch (e) { /* */ } };
  setTimeout(morning, 3000);

  // ---------- Badges ----------
  if (UI.hooks.feats) UI.hooks.feats.push((s) => { const h = (s && s.sd26) || {}; const out = [];
    if (h.gen && h.gen.pick) out.push({ id: 'sd26_gen', secret: true, tier: 5, icon: 'trophy', name: 'Generosity', desc: `Wished Luthen a Merry Christmas and gave him a gift. You chose: ${h.gen.pick}`, have: 1, need: 1 });
    if (h.adv) out.push({ id: 'sd26_adv', tier: 4, icon: 'trophy', name: 'Advent at Echo Base', desc: 'Opened all 27 doors of the Snow Day calendar', have: 1, need: 1 });
    return out; });

  // ---------- Styles ----------
  const css = `
  body.sd-open{overflow:hidden}
  .sd-root{position:fixed;inset:0;z-index:48;background:#060c1c;color:#eef4ff;opacity:0;transition:opacity .3s}
  .sd-root.in{opacity:1}.sd-scroll{position:absolute;inset:0;overflow:auto;-webkit-overflow-scrolling:touch;padding:0 max(12px,env(safe-area-inset-left)) 40px max(12px,env(safe-area-inset-right))}
  .sd-top{position:sticky;top:0;z-index:3;display:flex;gap:10px;align-items:center;padding:10px 0;background:linear-gradient(180deg,#060c1c 70%,rgba(6,12,28,0))}
  .sd-top b{display:block;font:800 18px var(--font-display,system-ui)}.sd-top small{display:block;font-size:12px;color:#ffd23f}
  .sd-x{width:38px;height:38px;border-radius:50%;border:1px solid #2a3c62;background:#13213f;color:#fff;font-size:16px;cursor:pointer;flex:none}
  .sd-tester{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:0 0 10px;padding:6px 10px;border-radius:10px;background:#3a2a00;border:1px dashed #ffd23f;font-size:12px}
  .sd-body{max-width:980px;margin:0 auto;display:grid;gap:12px}
  .sd-stage{position:relative;border-radius:16px;overflow:hidden;border:1px solid #2a3c62;box-shadow:0 12px 30px rgba(0,0,0,.45)}
  .sd-hub-svg{display:block;width:100%;height:auto}
  .sd-hot{position:absolute;border:0;background:transparent;cursor:pointer;border-radius:12px;padding:0}
  .sd-hot span{position:absolute;left:50%;bottom:-2px;transform:translate(-50%,100%);white-space:nowrap;font:700 10px var(--font-display,system-ui);padding:3px 8px;border-radius:999px;background:rgba(6,12,28,.85);color:#ffd23f;opacity:0;transition:opacity .2s;pointer-events:none}
  .sd-hot:hover,.sd-hot:focus-visible{box-shadow:0 0 0 2px #ffd23f,0 0 18px rgba(255,210,63,.45)}.sd-hot:hover span,.sd-hot:focus-visible span{opacity:1}
  .sd-catch{margin:0;text-align:center;font-size:13px;padding:8px 12px;border-radius:10px;background:#123a24;border:1px solid #2f9a55;color:#bff5d0}
  .sd-today{display:grid;grid-template-columns:64px 1fr auto;gap:12px;align-items:center;padding:12px;border-radius:14px;background:linear-gradient(135deg,#1a2c52,#13213f);border:1px solid #2a3c62}
  .sd-today-rex svg{width:64px;height:64px;border-radius:50%;display:block}.sd-today p{margin:2px 0;font-size:13px}.sd-today b{font:700 16px var(--font-display,system-ui)}
  .sd-bar{height:8px;border-radius:4px;background:#0b1630;overflow:hidden;margin-top:6px}.sd-bar i{display:block;height:100%;background:linear-gradient(90deg,#3bd16f,#9af0b4);border-radius:4px;transition:width .4s}
  .sd-nav{display:flex;flex-wrap:wrap;gap:6px}.sd-chip{font:600 13px var(--font-display,system-ui);padding:8px 14px;border-radius:999px;border:1px solid #2a3c62;background:#13213f;color:#eef4ff;cursor:pointer}.sd-chip:hover{border-color:#ffd23f}
  .sd-back{justify-self:start;font:600 13px var(--font-display,system-ui);padding:6px 12px;border-radius:999px;border:1px solid #2a3c62;background:#13213f;color:#eef4ff;cursor:pointer}
  .sd-p-head h2{margin:0;font:800 22px var(--font-display,system-ui)}.sd-p-head p{margin:4px 0 0}
  .sd-wd,.sd-cal{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px}.sd-wd span{text-align:center;font:700 11px var(--font-display,system-ui);letter-spacing:.1em;color:#a9bbd8;text-transform:uppercase}
  .sd-door{position:relative;display:grid;place-items:center;aspect-ratio:3/4;padding:0;border:0;border-radius:8px;background:none;cursor:pointer;transition:transform .2s}.sd-door svg{width:100%;height:100%;display:block;border-radius:8px}
  .sd-door small{position:absolute;bottom:3px;left:0;right:0;text-align:center;font:700 9px var(--font-display,system-ui);color:#fff;text-shadow:0 1px 2px #000}
  .sd-door.lock{filter:grayscale(.75) brightness(.55);cursor:default}.sd-door.lock:hover{transform:none}
  .sd-door.today{animation:sdw 1.8s ease-in-out infinite;box-shadow:0 0 0 2px #ffd23f,0 0 22px rgba(255,210,63,.55);border-radius:8px}@keyframes sdw{0%,100%{transform:rotate(0)}25%{transform:rotate(-2.5deg)}75%{transform:rotate(2.5deg)}}
  .sd-door.catch{box-shadow:0 0 0 2px #ff8a3a}.sd-door.boss:not(.done){box-shadow:0 0 0 2px #c8102e}.sd-door.camp:not(.done){box-shadow:0 0 0 2px #9ad0ff}.sd-door.xmas{box-shadow:0 0 0 2px #ffd23f}
  .sd-door.done{background:#0b1630;border:2px solid #3bd16f}.sd-door-in{display:grid;place-items:center;width:100%;height:100%;padding:6px;overflow:hidden}.sd-door-in svg{width:100%;height:auto;max-height:100%}
  .sd-door-n{position:absolute;top:3px;left:4px;width:18px;height:18px;border-radius:50%;background:#3bd16f;color:#062010;font:800 10px/18px var(--font-display,system-ui)}
  .sd-door em{position:absolute;top:-6px;right:-6px;font:700 9px var(--font-display,system-ui);font-style:normal;padding:2px 6px;border-radius:999px;background:#ff8a3a;color:#2a1000}.sd-door em.go{background:#3bd16f;color:#062010}
  .sd-door:not(.lock):hover{transform:translateY(-3px)}
  .sd-modal .modal{max-width:520px}
  .sd-sheet{display:grid;gap:8px}.sd-sheet h2{margin:0}.sd-sheet-door{width:84px;margin:0 auto}.sd-sheet-door svg{width:100%;display:block;border-radius:8px}.sd-sheet-door.lock{filter:grayscale(.7) brightness(.6)}
  .sd-rexline{display:grid;grid-template-columns:72px 1fr;gap:10px;align-items:start;padding:10px;border-radius:12px;background:#13213f}.sd-rexline svg{width:72px;height:72px;border-radius:50%}.sd-rexline p{margin:4px 0 0;font-size:14px}
  .sd-task{margin:6px 0 0}.sd-test{margin:4px 0 0;text-align:center}
  .sd-rw{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}.sd-rw li{display:grid;gap:4px;justify-items:center;text-align:center;font-size:12px;padding:6px;border-radius:10px;background:#0b1630}
  .sd-rw-a{display:grid;place-items:center;width:100%;overflow:hidden;border-radius:6px}.sd-rw-a svg{display:block;width:100%;height:auto}.sd-rw li.sq .sd-rw-a svg,.sd-rw-a.sq svg{max-width:84px}.sd-rw li.tall .sd-rw-a svg,.sd-rw-a.tall svg{max-width:54px}.sd-rw li.cur .sd-rw-a svg{max-width:34px}
  .sd-rev{display:grid;gap:8px;justify-items:center;text-align:center}.sd-rev h2{margin:0}.sd-rlist{margin:0;padding:0;list-style:none;font-weight:700}
  .sd-rev-door{position:relative;width:180px;height:210px;perspective:600px}.sd-swing{position:absolute;inset:0;z-index:2;transform-origin:left center;animation:sdsw 1.1s .2s ease-in forwards}.sd-swing svg{width:100%;height:100%}
  @keyframes sdsw{to{transform:rotateY(-105deg);opacity:.2}}
  .sd-rev-in{position:absolute;inset:0;display:grid;gap:6px;align-content:center;justify-items:center;padding:10px;border-radius:10px;background:radial-gradient(circle,#2a4a7e,#0b1630);box-shadow:inset 0 0 30px rgba(255,210,63,.35)}
  .sd-ri{display:grid;place-items:center}.sd-ri svg{display:block;width:100%;height:auto}.sd-ri.sq svg{max-width:110px}.sd-ri.wide svg{max-width:170px}.sd-ri.tall svg{max-width:70px}.sd-ri.mid svg{max-width:160px}.sd-ri.cur svg{max-width:42px}.sd-ri.big svg{max-width:160px}
  .sd-npc{display:grid;grid-template-columns:120px 1fr;gap:12px;align-items:center}.sd-npc-pic{padding:0;border:2px solid #c8a050;border-radius:50%;overflow:hidden;width:120px;height:120px;cursor:pointer;background:none}.sd-npc-pic svg{width:100%;height:100%;display:block}
  .sd-bub{position:relative;padding:12px 14px;border-radius:14px;background:#eef4ff;color:#0b1630;font-size:14px}.sd-link{margin-top:6px;border:0;background:none;color:#c8102e;font-weight:700;cursor:pointer;padding:0;text-decoration:underline}
  .sd-shop{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}.sd-shop-i{display:grid;gap:8px;align-content:start;padding:10px;border-radius:12px;background:#13213f;border:1px solid #2a3c62}.sd-shop-i .sd-rw-a{background:#0b1630;padding:6px;min-height:90px}.sd-shop-i .sd-rw-a.sq svg{max-width:90px}
  .sd-talk{display:grid;grid-template-columns:110px 1fr;gap:12px;align-items:start}.sd-talk-pic svg{width:110px;height:110px;border-radius:50%}.sd-say{font-size:15px;margin:4px 0 10px}.sd-opts{display:grid;gap:6px}
  .sd-pick{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.sd-pick-i{display:grid;gap:4px;justify-items:center;padding:8px;border-radius:10px;border:1px solid #2a3c62;background:#13213f;color:#eef4ff;cursor:pointer;font-size:12px}.sd-pick-i:hover{border-color:#ffd23f}.sd-pick-i .sd-rw-a svg{max-width:80px}
  .sd-gen{position:fixed;inset:0;z-index:49;display:grid;place-items:center;background:rgba(10,4,2,.97);opacity:0;transition:opacity .35s;padding:16px}.sd-gen.in{opacity:1}
  .sd-gen-c{max-width:440px;display:grid;gap:8px;text-align:center}.sd-gen-c h2{margin:0;font:800 28px var(--font-display,system-ui);color:#ffd23f}.sd-gen-svg{width:100%;border-radius:14px;box-shadow:0 0 40px rgba(255,207,122,.35)}.sd-gen-q{font-size:16px;font-style:italic}
  .sd-cave{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:14px;align-items:center}.sd-cave-art{border-radius:14px;overflow:hidden;border:1px solid #2a3c62}.sd-cave-c p{margin:0 0 8px}
  .sd-fmap{position:relative;border-radius:14px;overflow:hidden;border:1px solid #2a3c62}.sd-fmap svg{display:block;width:100%;height:auto}
  .sd-fn{position:absolute;transform:translate(-50%,-50%);display:grid;justify-items:center;gap:2px;padding:0;border:0;background:none;cursor:pointer;color:#fff}.sd-fn b{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:#eef4ff;color:#0b1630;font:800 16px var(--font-display,system-ui);box-shadow:0 0 0 3px #2a62c8}.sd-fn small{font-size:10px;color:#ffd23f;text-shadow:0 1px 2px #000}
  .sd-fn.done b{background:#3bd16f;color:#062010}.sd-fn.boss b{background:#c8102e;color:#fff;width:46px;height:46px}.sd-fn.lock{opacity:.45;cursor:default}
  .sd-flist{margin:0;padding:0;list-style:none;display:grid;gap:6px}.sd-flist li{padding:8px 10px;border-radius:10px;background:#13213f;font-size:13px}.sd-flist li.done{border-left:3px solid #3bd16f}
  .sd-wtypes{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}.sd-wt{display:grid;gap:4px;justify-items:center;padding:12px 8px;border-radius:12px;border:1px solid #2a3c62;background:#13213f;color:#eef4ff;font:600 13px var(--font-display,system-ui);cursor:pointer}.sd-wt i{font-style:normal;font-size:24px}.sd-wt:hover{border-color:#ffd23f}
  .sd-wsteps{display:grid;gap:10px;padding:14px;border-radius:14px;background:#0e1a34;border:1px solid #2a3c62}.sd-lab{display:grid;gap:4px;font-size:13px;font-weight:600}.sd-in{font:14px var(--font-body,system-ui);padding:10px;border-radius:10px;border:1px solid #2a3c62;background:#0b1630;color:#eef4ff;width:100%;box-sizing:border-box}
  .sd-wcard{display:grid;grid-template-columns:40px 1fr;gap:10px;padding:12px;border-radius:12px;background:#13213f}.sd-wcard i{font-style:normal;font-size:28px}.sd-wcard p{margin:4px 0 0}.sd-wdone{text-align:center;padding:16px}.sd-wdone b{font:800 20px var(--font-display,system-ui);color:#3bd16f}
  .sd-globe{position:absolute;left:50%;top:6px;transform:translateX(-50%);z-index:5;width:86px;padding:0;border:0;background:none;cursor:pointer;filter:drop-shadow(0 6px 14px rgba(0,0,0,.5));animation:sdgf 3.4s ease-in-out infinite}.sd-globe svg{width:100%;display:block}
  .sd-globe b{position:absolute;top:2px;right:2px;min-width:22px;height:22px;border-radius:11px;background:#e8252f;color:#fff;font:800 12px/22px var(--font-display,system-ui);text-align:center}
  @keyframes sdgf{50%{transform:translate(-50%,-4px)}}.sd-gsnow{animation:sdgs 4s ease-in-out infinite alternate}@keyframes sdgs{to{transform:translateY(8px)}}
  .sd-sign{display:inline-flex;gap:8px;align-items:center;margin-top:10px;font:700 14px var(--font-display,system-ui);padding:10px 16px;border-radius:12px;border:2px solid #eef4ff;background:linear-gradient(90deg,#b3121f,#1a6a35);color:#fff;cursor:pointer;box-shadow:0 0 18px rgba(255,255,255,.2)}
  .sd-xt{position:fixed;inset:0;z-index:49;display:grid;grid-template-rows:auto minmax(0,1fr) auto auto auto;justify-items:center;padding:16px 12px;background:radial-gradient(ellipse at 50% 40%,#1a2c52,#03060f);opacity:0;transition:opacity .5s;overflow:hidden}.sd-xt.in{opacity:1}
  .sd-xt-title{text-align:center;opacity:0;animation:sdfade 1s 4.2s forwards}.sd-xt-title h1{margin:0;font:800 clamp(28px,7vw,48px) var(--font-display,system-ui);color:#ffd23f;text-shadow:0 0 18px rgba(255,210,63,.5)}
  .sd-xt-tree-w{width:min(92vw,520px);max-height:100%;align-self:end;display:grid;align-items:end}.sd-xt-tree-w svg{max-height:58vh}.sd-xt-svg{width:100%;display:block;overflow:visible}
  .sd-xt-tree{opacity:0;animation:sdfade 1.2s .2s forwards}.sd-xt-lights{opacity:0;animation:sdfade .6s 1.6s forwards,sdtw 1.8s 2.2s ease-in-out infinite}.sd-xt-garland{opacity:0;animation:sdfade .6s 1.2s forwards}
  .sd-xt-star{transform-origin:200px -10px;transform:scale(0);animation:sdstar .7s 2.2s cubic-bezier(.3,1.6,.5,1) forwards}.sd-xt-glow{opacity:0;animation:sdfade 1.4s 2.4s forwards}
  @keyframes sdfade{to{opacity:1}}@keyframes sdstar{to{transform:scale(1)}}@keyframes sdtw{50%{opacity:.55}}
  .sd-xt-gifts{display:flex;flex-wrap:wrap;justify-content:center;gap:4px;margin-top:-30px;max-width:560px}
  .sd-gift{position:relative;width:clamp(64px,15vw,90px);padding:0;border:0;background:none;cursor:pointer;opacity:0;transform:translateY(-60px);animation:sddrop .6s var(--d) cubic-bezier(.3,1.5,.5,1) forwards}.sd-gift svg{width:100%;display:block}
  @keyframes sddrop{to{opacity:1;transform:none}}.sd-xt.ready .sd-gift:not(.open){animation:sddrop .6s var(--d) forwards,sdjig 2.4s 6s ease-in-out infinite}@keyframes sdjig{0%,80%,100%{transform:none}85%{transform:rotate(-5deg)}90%{transform:rotate(5deg)}}
  .sd-gift.open .sd-pl{transform:translate(10px,-34px) rotate(25deg);opacity:0;transition:all .6s}.sd-gift .sd-pl{transition:all .6s}
  .sd-xt-pop{position:fixed;left:50%;top:38%;z-index:60;transform:translate(-50%,-50%);width:min(220px,70vw);display:grid;gap:6px;justify-items:center;text-align:center;padding:12px;border-radius:14px;background:rgba(11,22,48,.97);border:2px solid #ffd23f;box-shadow:0 0 40px rgba(255,210,63,.35);font-size:14px;pointer-events:none;animation:sdpop .5s cubic-bezier(.3,1.6,.5,1),sdpopout .4s 2.2s forwards}@keyframes sdpop{from{transform:translate(-50%,-50%) scale(.3);opacity:0}}@keyframes sdpopout{to{opacity:0;transform:translate(-50%,-60%) scale(.9)}}
  .sd-gl{display:block;margin-top:2px;font:600 10px/1.2 var(--font-body,system-ui);color:#ffd23f;text-align:center}.sd-gift.open svg{opacity:.55}
  .sd-xt-hint{margin:6px 0 0;text-align:center;opacity:0;animation:sdfade .6s 5.2s forwards}.sd-xt-done{margin-top:8px}
  .sd-fl{animation:sdfall linear infinite}@keyframes sdfall{from{transform:translateY(-10px)}to{transform:translateY(120px);opacity:0}}
  .sd-tw{animation:sdtw 1.6s ease-in-out infinite}.sd-glow{animation:sdtw 2.6s ease-in-out infinite}.sd-holo{animation:sdtw 2s ease-in-out infinite}.sd-eyes{animation:sdtw 3s ease-in-out infinite}
  .sd-root .fl,.sd-modal .fl,.sd-xt .fl{animation:sdfall linear infinite}.sd-root .tw,.sd-modal .tw,.sd-xt .tw{animation:sdtw 1.6s ease-in-out infinite}.sd-root .xs,.sd-modal .xs{animation:sdfall 6s linear infinite}.sd-root .glow,.sd-modal .glow{animation:sdtw 3s ease-in-out infinite}
  .sd-root .globesnow,.sd-modal .globesnow{animation:sdgs 4s ease-in-out infinite alternate}.sd-root .spin,.sd-modal .spin{transform-origin:60px 60px;animation:sdspin 14s linear infinite}@keyframes sdspin{to{transform:rotate(360deg)}}
  .sd-root .hs,.sd-modal .hs{transform-origin:150px 45px;animation:sdhs 1.4s linear infinite}@keyframes sdhs{from{transform:scale(.6);opacity:.4}to{transform:scale(1.35);opacity:1}}
  .sd-root .bolt,.sd-modal .bolt{animation:sdbolt 1.8s linear infinite}@keyframes sdbolt{0%{transform:translateX(-60px)}55%{transform:translateX(200px);opacity:1}56%,100%{transform:translateX(200px);opacity:0}}
  .sd-root .burst,.sd-modal .burst{transform:translate(262px,40px) scale(0);animation:sdburst 1.8s ease-out infinite}@keyframes sdburst{0%,54%{transform:translate(262px,40px) scale(0);opacity:0}58%{opacity:1}80%{transform:translate(262px,40px) scale(1.3);opacity:1}100%{transform:translate(262px,40px) scale(1.6);opacity:0}}
  @media (max-width:640px){.sd-cal,.sd-wd{grid-template-columns:repeat(4,minmax(0,1fr))}.sd-wd,.sd-door-blank{display:none}.sd-today{grid-template-columns:48px 1fr}.sd-today .btn{grid-column:1/-1}.sd-today-rex svg{width:48px;height:48px}.sd-npc{grid-template-columns:84px 1fr}.sd-npc-pic{width:84px;height:84px}.sd-cave{grid-template-columns:1fr}.sd-talk{grid-template-columns:1fr;justify-items:center;text-align:center}.sd-hot span{display:none}}
  @media (orientation:landscape) and (max-height:500px){.sd-stage{max-width:620px;margin:0 auto}.sd-xt-tree-w{width:min(60vw,360px)}.sd-xt{grid-template-rows:auto minmax(0,1fr) auto auto auto}.sd-xt-tree-w svg{max-height:46vh}.sd-gift{width:clamp(52px,9vw,70px)}}
  @media (prefers-reduced-motion:reduce){.sd-root *,.sd-xt *,.sd-globe,.sd-globe *{animation-duration:.01s!important;animation-iteration-count:1!important}}
  body.perf-lite .sd-root .sd-fl,body.perf-lite .sd-root .tw,body.perf-lite .sd-root .fl,body.perf-lite .sd-door.today,body.perf-lite .sd-globe{animation:none}`;
  const stEl = document.createElement('style'); stEl.id = 'sd26-css'; stEl.textContent = css; document.head.appendChild(stEl);
  // Tester code (Settings > Enter a code): switches the Snow Day preview on or off on this device.
  const codeSD = () => String.fromCharCode(83, 78, 79, 87, 68, 65, 89, 84, 69, 83, 84);
  const beforeSD = UI.hooks.redeem;
  UI.hooks.redeem = (c) => {
    if (c !== codeSD()) return beforeSD ? beforeSD(c) : false;
    const was = testDay() != null;
    try { if (was) localStorage.removeItem('swcg-sd-test'); else localStorage.setItem('swcg-sd-test', '0'); } catch (e) { /* */ }
    toast(was ? 'Snow Day preview OFF on this device. Reloading…' : 'Snow Day preview ON: look for the snow globe above the galaxy. Use the tester bar to change days. Reloading…');
    setTimeout(() => location.reload(), 1600);
    return true;
  };
  root.SnowDay = { open, live, on, dayNo, state: S, christmas };
})(window);
