// Friend profiles and guild invites (update 2.2; testers early with HOLOSAVE21).
//
// Every pilot with Friends publishes a small profile card, cards/{uid}: their
// picture, level, stats, worlds, collection and badges. Only their friends can
// read it (Firebase rule). Tapping a friend opens it in the same look as your
// own profile, minus their friends list. Their HoloNet tab (rating, league,
// guild) only appears once they've unlocked the HoloNet at level 25.
//
// Guild leaders and officers can invite a friend (level 25+, no guild yet)
// from that profile; the invite lands in your chat as a card with the guild's
// emblem, name and member count, and your friend joins with one tap.
(function (root) {
  'use strict';
  const UI = root.UI;
  const D = root.GameData;
  if (!UI || !D) return;
  const { esc, fmt, openModal, toast } = UI;
  const P = () => root.Player;
  const on = () => !!(root.Update22 && (root.Update22.friends || root.Update22.on)());
  const RCOL = { common: '#9aa4b4', rare: '#4aa8ff', epic: '#b070ff', legendary: '#ffb020', mythic: '#ff4a6a', secret: '#3dffc8' };
  const title = (lv) => (lv >= D.MAX_ACCOUNT_LEVEL ? 'Grand Master' : lv >= 30 ? 'Fleet Admiral' : lv >= 15 ? 'General' : lv >= 6 ? 'Commander' : 'Captain');
  const HN_LEVEL = 25;
  const KEY = 'swcg-fcard';
  const CARD_TTL = 3 * 60000;
  let HN = null;
  const cache = new Map(); // uid -> { at, card, arena }
  const okTxt = (t, n) => { const v = String(t || '').replace(/[^A-Za-z0-9_ .'!?-]/g, '').trim().slice(0, n); return HN && HN.safe && !HN.safe.ok(v) ? '' : v; };

  // ---------- my card ----------
  // The frame I wear on my HoloNet profile (only frames I've earned).
  function myFrame() {
    try {
      const SO = HN && HN.social;
      const f = SO && SO.P2 ? SO.P2().prof.frame : '';
      return f && SO.ownedFrames().includes(f) ? String(f).slice(0, 20) : 'recruit';
    } catch (e) { return 'recruit'; }
  }
  function myCard() {
    const s = P().state;
    const prof = (s.hn && s.hn.prof) || {};
    const PC = root.PlayerCollections;
    const W = root.ProfileV2 && root.ProfileV2.worlds ? root.ProfileV2.worlds() : [];
    const cur = W.find((w) => !w.free);
    let ach = [];
    try { ach = UI.achievements().filter((x) => x.have >= x.need); } catch (e) { ach = []; }
    const hs = HN && HN.S ? HN.S() : {};
    return {
      v: 1,
      tag: okTxt(prof.tag, 16),
      av: prof.av && D.UNIT_MAP[prof.av] ? prof.av : '',
      lv: s.account.level | 0,
      st: { w: s.stats.battlesWon | 0, l: s.stats.battlesLost | 0, pk: s.stats.packsOpened | 0, my: s.stats.mythics | 0, tw: (s.tower && s.tower.best) | 0, bs: Object.keys(s.bosses || {}).length, fr: myFrame() },
      wd: W.map((w) => [w.p.id, w.cleared, w.stages, w.beat, w.bosses].join('.')).join(','),
      cur: cur ? cur.p.id : '',
      col: PC ? PC.encode() : '',
      use: PC ? PC.encodeUse() : '',
      bd: ach.map((x) => ({ i: String(x.id || '').slice(0, 40), n: String(x.name || '').slice(0, 40), c: String(x.icon || 'badge').slice(0, 24), t: x.tier | 0 || 1, s: x.secret ? 1 : 0, l: x.level | 0 })).slice(0, 100),
      hn: s.account.level >= HN_LEVEL ? 1 : 0,
      g: s.account.level >= HN_LEVEL && hs.guild ? String(hs.guild).slice(0, 128) : '',
    };
  }
  let busy = false;
  async function publish(force) {
    if (!HN || busy || !on() || !root.Friends || !root.Friends.unlocked()) return;
    const Net = HN.Net;
    if (!Net.ready || !HN.hasProfile || !HN.hasProfile()) return;
    const body = myCard();
    const key = JSON.stringify(body);
    let last = null;
    try { last = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { last = null; }
    if (!force && last && last.k === key && last.u === Net.me && Date.now() - last.at < 6 * 3600000) return;
    busy = true;
    try {
      await Net.db.doc(`cards/${Net.me}`).set({ ...body, t: Date.now() });
      try { localStorage.setItem(KEY, JSON.stringify({ k: key, u: Net.me, at: Date.now() })); } catch (e) { /* ignore */ }
    } catch (e) { /* try again next round */ }
    busy = false;
  }

  // ---------- reading friends' cards ----------
  async function load(uid, fresh) {
    const c = cache.get(uid);
    if (c && !fresh && Date.now() - c.at < CARD_TTL) return c.card;
    try {
      const d = await HN.Net.db.doc(`cards/${uid}`).get();
      const card = d.exists ? d.data() : null;
      cache.set(uid, { at: Date.now(), card, arena: c && c.arena });
      return card;
    } catch (e) { return c ? c.card : null; }
  }
  async function arenaOf(uid) {
    const c = cache.get(uid) || {};
    if (c.arena && Date.now() - (c.arenaAt || 0) < CARD_TTL) return c.arena;
    try {
      const d = await HN.Net.db.doc(`arena/${uid}`).get();
      const a = d.exists ? d.data() : null;
      cache.set(uid, { ...(cache.get(uid) || { at: 0, card: null }), arena: a, arenaAt: Date.now() });
      return a;
    } catch (e) { return null; }
  }
  // Friends' pictures for the friends list, read once and refreshed now and then.
  let prefetching = null;
  function prefetch(after) {
    if (!HN || !HN.friends || !HN.friends.F) return Promise.resolve();
    if (prefetching) return prefetching.then(() => after && after());
    const F = HN.friends.F;
    // Only friends whose card isn't loaded yet (or has gone stale).
    const ids = F.friends().map((r) => F.other(r)).slice(0, 50).filter((uid) => { const c = cache.get(uid); return !c || Date.now() - c.at > CARD_TTL; });
    if (!ids.length) { if (after) after(); return Promise.resolve(); }
    prefetching = Promise.all(ids.map((uid) => load(uid))).then(() => {
      prefetching = null;
      if (F.view && !F.chatWith) F.view();
      if (after) after();
    });
    return prefetching;
  }
  const art = (av) => (root.Art && av && D.UNIT_MAP[av] ? root.Art.unitArt(D.UNIT_MAP[av]) : '');
  const initials = (nm) => esc(String(nm || '?').slice(0, 2).toUpperCase());
  // A friend's picture in the frame they wear. No picture picked yet: their initials
  // (rather than a stand-in card, which made everyone look alike).
  function face(card, nm, size) {
    const av = card && card.av && D.UNIT_MAP[card.av] ? card.av : '';
    const fr = card && card.st && typeof card.st.fr === 'string' ? card.st.fr : 'recruit';
    const frame = HN && HN.social && HN.social.frameSvg ? HN.social.frameSvg(fr) : '';
    return `<span class="pf-av ${size || 'md'} fp-face">${av ? `<span class="pic">${art(av)}</span>` : `<span class="pic ini">${initials(nm || (card && card.tag))}</span>`}${frame}</span>`;
  }
  function pic(uid, nm, size) { const c = cache.get(uid); return c && c.card ? face(c.card, nm, size) : ''; }
  const cardOf = (uid) => { const c = cache.get(uid); return c ? c.card : null; };

  // ---------- the friend profile ----------
  function worldsOf(card) {
    const map = {};
    for (const part of String(card.wd || '').split(',')) {
      const [id, c, s, b, B] = part.split('.');
      if (id) map[id] = { cleared: +c || 0, stages: +s || 0, beat: +b || 0, bosses: +B || 0 };
    }
    return D.PLANETS.map((p) => {
      const w = map[p.id] || { cleared: 0, stages: (p.stages || []).length, beat: 0, bosses: D.BOSS_ENCOUNTERS.filter((x) => x.planet === p.id).length };
      const free = w.stages > 0 && w.cleared >= w.stages;
      return { p, ...w, free, full: free && w.beat >= w.bosses };
    });
  }
  async function open(uid, name) {
    if (!HN) return;
    const F = HN.friends && HN.friends.F;
    if (!F || !F.isFriend(uid)) return toast('You can see a pilot\'s profile once you\'re friends.');
    const nm = okTxt(name, 16) || 'Pilot';
    const m = openModal(`<div class="pf-card pc-card p2-card fp-card"><button type="button" class="pf-x p2-x" data-fp="close" aria-label="Close">✕</button><p class="pc-empty" style="padding:40px 0"><span class="ho-spin"></span> Loading ${esc(nm)}'s profile…</p></div>`, { small: true, cls: 'pf-modal p2-modal' });
    const [card] = await Promise.all([load(uid, true), (async () => {
      // Online right now? The same lobby heartbeat the Friends panel reads.
      try {
        const d = await HN.Net.db.doc(`lobby/${uid}`).get();
        const v = d.exists ? d.data() : null;
        const t = v ? (v.ts && v.ts.toMillis ? v.ts.toMillis() : v.t || 0) : 0;
        F.online[uid] = { at: t, busy: !!(v && v.p && v.p.busy), a: (v && v.p && typeof v.p.a === 'string' && v.p.a.slice(0, 8)) || '' };
      } catch (e) { /* keep what we had */ }
    })()]);
    const box = m.root.querySelector('.fp-card');
    if (!box || !box.isConnected) return;
    if (!card) {
      box.innerHTML = `<button type="button" class="pf-x p2-x" data-fp="close" aria-label="Close">✕</button><div class="p2-lock"><b>${esc(nm)}'s profile isn't ready yet</b><p class="muted small">It appears once they open the game with the latest update.</p></div>`;
      m.root.addEventListener('click', (e) => { if (e.target.closest('[data-fp="close"]')) m.close(); });
      return;
    }
    const PC = root.PlayerCollections;
    const col = PC ? PC.decode(card.col) : {};
    const use = PC ? PC.decodeUse(card.use) : {};
    const st = card.st || {};
    const lv = Math.max(1, card.lv | 0);
    const hnOn = !!card.hn && lv >= HN_LEVEL;
    const W = worldsOf(card);
    const cur = card.cur && D.PLANET_MAP[card.cur] ? W.find((w) => w.p.id === card.cur) : null;
    const power = (id) => { const u = col[id]; return u ? D.power(D.UNIT_MAP[id], u.level, u.stars) : 0; };
    const owned = Object.keys(col).filter((id) => D.UNIT_MAP[id] && !D.UNIT_MAP[id].hn);
    const all = D.UNITS.filter((u) => !u.boss && (!u.exclusive || u.rarity === 'secret') && !u.raid && D.UNIT_MAP[u.id] === u && !u.hn);
    const fav = owned.filter((id) => use[id] && use[id].b > 0).sort((x, y) => use[y].b - use[x].b)[0];
    const strong = owned.slice().sort((x, y) => power(y) - power(x)).slice(0, 5);
    // Badges: names and icons from their card; descriptions from the game's own list (never for secret ones).
    let defs = [];
    try { defs = UI.achievements(); } catch (e) { defs = []; }
    const bd = (Array.isArray(card.bd) ? card.bd : []).slice(0, 100).map((b) => {
      const def = defs.find((x) => (x.id || '') === b.i && b.i);
      return { id: String(b.i || ''), name: okTxt(b.n, 40) || 'Badge', icon: String(b.c || 'badge'), tier: Math.min(7, Math.max(1, b.t | 0)), secret: !!b.s, level: b.l | 0, desc: b.s ? '' : (def ? def.desc : '') };
    });
    const online = F.online[uid] && Date.now() - F.online[uid].at < 150000;
    const doing = online && F.online[uid].a && root.FriendActivity ? root.FriendActivity.label(F.online[uid].a) : '';
    const fr = F.rows.get(HN.friends.pairId(HN.Net.me, uid));
    const since = fr && fr.t ? new Date(fr.t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
    let tab = 'overview';
    let chip = 'character';
    const mini = (id) => { const u = col[id]; return UI.unitCard(D.UNIT_MAP[id], { tag: 'div', owned: true, level: u.level, stars: u.stars, hideShards: true }).replace('class="ucard', `data-fpc="${id}" class="ucard`); };
    const still = UI.stillSvg || String;
    const badge = (x, i) => `<button type="button" class="p2-bdg got ${x.secret ? 'sec' : ''}" data-fpb="${i}"><span class="p2-bico">${still(UI.featBadge(x))}</span><span class="p2-bn">${esc(x.name)}</span></button>`;

    const head = () => `<button type="button" class="pf-x p2-x" data-fp="close" aria-label="Close">✕</button>
      <div class="p2-top">
        <div class="p2-av fp-av">${face(card, nm, 'lg')}<span class="acct-ring p2-ring" style="--p:100"><b>${lv}</b></span></div>
        <div class="p2-id"><p class="eyebrow">Friend</p><h2>${esc(okTxt(card.tag, 16) || nm)}</h2>
          <p class="muted small">${title(lv)} · Level ${lv}</p>
          <p class="small fp-cur">${cur ? `Currently on <b>${esc(cur.p.name)}</b> · stage ${Math.min(cur.cleared + 1, cur.stages)}/${cur.stages}` : '<b>Every world liberated</b>'}</p>
          <div class="fp-chips"><span class="${online ? 'on' : ''}">${online ? `● Online${doing ? ` · ${esc(doing)}` : ''}` : esc(F.online[uid] && F.online[uid].at && root.FriendActivity ? root.FriendActivity.lastSeen(F.online[uid].at, F.online[uid].a) : 'Offline')}</span>${since ? `<span>Friends since ${esc(since)}</span>` : ''}</div></div>
      </div>`;
    const tabsList = [['overview', 'Overview'], ['collection', 'Collection'], ['worlds', 'Worlds'], ['badges', 'Badges'], ['stats', 'Stats'], ...(hnOn ? [['holonet', 'HoloNet']] : [])];
    const tabs = () => `<div class="pc-tabs p2-tabs fp-tabs" style="--n:${tabsList.length}" role="tablist">${tabsList.map(([k, n]) => `<button type="button" role="tab" aria-selected="${tab === k}" class="${tab === k ? 'on' : ''}" data-fpt="${k}">${n}</button>`).join('')}</div>`;
    const won = st.w | 0, lost = st.l | 0;
    const overview = () => {
      const f = fav && col[fav];
      return `<div class="pc-tiles"><div><b>${lv}</b><span>Level</span></div><div><b>${fmt(won)}</b><span>Battles won</span></div><div><b>${won + lost ? Math.round((won / (won + lost)) * 100) : 0}%</b><span>Win rate</span></div><div><b>${W.filter((w) => w.full).length}/${W.length}</b><span>Worlds freed</span></div></div>
        <h3 class="pc-h">Favorite card <small>most used</small></h3>
        ${f ? `<div class="pc-fav"><div class="pt">${UI.portrait(D.UNIT_MAP[fav])}</div><div><h4>${esc(D.UNIT_MAP[fav].name)}</h4><div class="sub">${esc(D.RARITIES[D.UNIT_MAP[fav].rarity].label)} · Lv ${f.level}</div>
          <div class="nums"><div><b>${fmt(use[fav].b)}</b><span>battles</span></div><div><b>${use[fav].b ? Math.round((use[fav].w / use[fav].b) * 100) : 0}%</b><span>win rate</span></div><div><b>${fmt(power(fav))}</b><span>power</span></div></div></div></div>` : '<p class="pc-empty">No favorite yet.</p>'}
        <h3 class="pc-h">Strongest cards <small>by power</small></h3>
        ${strong.length ? `<div class="pc-strong pc-grid">${strong.map(mini).join('')}</div>` : '<p class="pc-empty">No cards to show yet.</p>'}
        <h3 class="pc-h">Top badges <small>${bd.length} earned</small></h3>
        <div class="p2-bdgs">${bd.map((x, i) => [x, i]).sort((a, b) => b[0].tier - a[0].tier).slice(0, 6).map(([x, i]) => badge(x, i)).join('') || '<p class="pc-empty">No badges yet.</p>'}</div>`;
    };
    const collection = () => {
      const inAll = all.filter((u) => col[u.id]).length;
      const bars = ['secret', 'mythic', 'legendary', 'epic', 'rare', 'common'].map((r) => {
        const tot = all.filter((u) => u.rarity === r).length;
        const have = all.filter((u) => u.rarity === r && col[u.id]).length;
        return tot ? `<div class="pc-bar" style="--c:${RCOL[r]}"><span style="color:${RCOL[r]}">${D.RARITIES[r].label}</span><i><b style="width:${(have / tot) * 100}%"></b></i><span>${have}/${tot}</span></div>` : '';
      }).join('');
      const ids = owned.filter((id) => D.UNIT_MAP[id].kind === chip).sort((x, y) => power(y) - power(x));
      return `<div class="pc-bars"><div class="pc-total">${fmt(inAll)} <small>/ ${fmt(all.length)} cards</small></div>${bars}</div>
        <div class="pc-chips">${[['character', 'Ground'], ['ship', 'Fleet']].map(([k, n]) => `<button type="button" class="${chip === k ? 'on' : ''}" data-fpk="${k}">${n}</button>`).join('')}</div>
        ${ids.length ? `<div class="pc-grid">${ids.map(mini).join('')}</div>` : '<p class="pc-empty">No cards here yet.</p>'}`;
    };
    const worldsTab = () => `<p class="pc-empty">${W.filter((w) => w.full).length} of ${W.length} worlds fully liberated.</p>
      <div class="p2-worlds">${W.map((w) => `<div class="p2-world ${w.full ? 'full' : w.free ? 'half' : ''} ${cur && cur.p.id === w.p.id ? 'fp-now' : ''}" style="--pc:${w.p.color || '#ffd23f'}">
        <canvas data-fpw="${w.p.id}" width="96" height="96"></canvas>
        <b>${esc(w.p.name)}</b>
        <small>${w.full ? 'Liberated' : cur && cur.p.id === w.p.id ? 'Here now' : `Stages ${w.cleared}/${w.stages}${w.bosses ? ` · Bosses ${w.beat}/${w.bosses}` : ''}`}</small>
        <i><b style="width:${Math.round(((w.cleared + w.beat) / Math.max(1, w.stages + w.bosses)) * 100)}%"></b></i></div>`).join('')}</div>`;
    const badgesTab = () => {
      const open = bd.map((x, i) => [x, i]).filter(([x]) => !x.secret);
      const sec = bd.map((x, i) => [x, i]).filter(([x]) => x.secret);
      return `<p class="pc-empty">${bd.length} badges earned · tap one to see it</p>
        <div class="p2-bdgs">${open.map(([x, i]) => badge(x, i)).join('') || '<p class="pc-empty">None yet.</p>'}</div>
        ${sec.length ? `<h3 class="pc-h">Secret badges <small>${sec.length} found</small></h3><div class="p2-bdgs">${sec.map(([x, i]) => badge(x, i)).join('')}</div>` : ''}`;
    };
    const stats = () => {
      const cell = (n, v) => `<div><span>${n}</span><b>${v}</b></div>`;
      return `<div class="pc-stats">${cell('Battles won', fmt(won))}${cell('Battles lost', fmt(lost))}${cell('Cards collected', `${all.filter((u) => col[u.id]).length}/${all.length}`)}${cell('Bosses defeated', `${st.bs | 0}/${D.BOSS_ENCOUNTERS.length}`)}${cell('Best tower floor', st.tw | 0)}${cell('Crates opened', fmt(st.pk | 0))}${cell('Mythics pulled', st.my | 0)}${cell('Worlds freed', `${W.filter((w) => w.full).length}/${W.length}`)}</div>`;
    };
    let arena = null;
    const holonet = () => {
      if (!arena) return '<p class="pc-empty"><span class="ho-spin"></span> Loading HoloNet record…</p>';
      if (arena === 'none') return '<p class="pc-empty">They\'ve unlocked the HoloNet but haven\'t played there yet.</p>';
      const d = HN.divOf(arena.rating || 800);
      const s2 = arena.st || {};
      const SO = HN.social;
      const g = arena.guild && SO && SO.guildOf ? SO.guildOf(arena.guild) : null;
      const cell = (n, v) => `<div><span>${n}</span><b>${v}</b></div>`;
      return `<div class="fp-league">${root.HNArt ? root.HNArt.badge(d.league, d.div) : ''}<div><b>${esc(d.name)}</b><span>${fmt(arena.rating || 0)} rating</span></div></div>
        <div class="pc-stats">${cell('Best rating', fmt(s2.best || arena.rating || 0))}${cell('Arena W–L', `${fmt(s2.w || 0)}–${fmt(s2.l || 0)}`)}${cell('Duels won', fmt(s2.dw || arena.dw || 0))}${cell('Guild', g ? esc(okTxt(g.name, 24) || 'Guild') : arena.guild ? 'In a guild' : 'None yet')}</div>
        <div class="fp-acts one"><button type="button" class="btn" data-fp="hnfull">Full HoloNet profile</button></div>`;
    };
    // Invites: from leaders and officers, to friends on the HoloNet with no guild.
    const SO = HN.social;
    const myGid = SO && SO.myGuildId ? SO.myGuildId() : null;
    const canInv = !!(myGid && SO.canReview && SO.canReview(myGid));
    const inviteNote = () => {
      if (!myGid) return '';
      if (!canInv) return 'Only your guild\'s leader and officers can send invites.';
      if (!hnOn) return `Guild invites need level ${HN_LEVEL}. ${esc(okTxt(card.tag, 16) || nm)} is level ${lv}.`;
      if (card.g) return card.g === myGid ? 'Already in your guild.' : 'Already in a guild.';
      return '';
    };
    const acts = () => {
      const note = inviteNote();
      const invOk = myGid && canInv && hnOn && !card.g;
      return `<div class="fp-acts ${myGid ? '' : 'one'}"><button type="button" class="btn fp-chat" data-fp="chat">Chat</button>${myGid ? `<button type="button" class="btn btn-primary" data-fp="invite" ${invOk ? '' : 'disabled'}>Invite to guild</button>` : ''}</div>${note ? `<p class="fp-note">${note}</p>` : ''}`;
    };
    const body = () => `${head()}${acts()}${tabs()}<div>${({ overview, collection, worlds: worldsTab, badges: badgesTab, stats, holonet })[tab]()}</div>`;
    const draw = () => {
      box.innerHTML = body();
      box.querySelectorAll('[data-fpw]').forEach((c) => { if (root.drawPlanetSphere) root.drawPlanetSphere(c.getContext('2d'), 48, 48, 34, c.dataset.fpw, 1.2, { halo: 0.4 }); });
    };
    draw();
    m.root.addEventListener('click', async (e) => {
      const t = e.target.closest('[data-fpt]');
      if (t) {
        tab = t.dataset.fpt;
        draw();
        if (tab === 'holonet' && !arena) { const a = await arenaOf(uid); arena = a || 'none'; if (tab === 'holonet' && box.isConnected) draw(); }
        return;
      }
      const k = e.target.closest('[data-fpk]');
      if (k) { chip = k.dataset.fpk; return draw(); }
      const c = e.target.closest('[data-fpc]');
      if (c) return UI.inspect(c.dataset.fpc);
      const b = e.target.closest('[data-fpb]');
      if (b) { const x = bd[+b.dataset.fpb]; if (x) UI.badgePeek(x.secret ? { ...x, desc: '' } : x); return; }
      const x = e.target.closest('[data-fp]');
      if (!x || x.disabled) return;
      const a = x.dataset.fp;
      if (a === 'close') return m.close();
      if (a === 'chat') { m.close(); HN.friends.chatWith(uid); return; }
      if (a === 'invite') { x.disabled = true; const okd = await invite(uid, okTxt(card.tag, 16) || nm); x.textContent = okd ? 'Invite sent ✓' : 'Invite to guild'; x.disabled = !!okd; return; }
      if (a === 'hnfull' && arena && arena !== 'none') { HN.Net.rows.set(uid, { ...(HN.Net.rows.get(uid) || {}), ...arena, uid }); m.close(); HN.openProfile(uid); }
    });
    return m;
  }

  // ---------- guild invites ----------
  async function invite(uid, nm) {
    const SO = HN.social;
    const gid = SO && SO.myGuildId ? SO.myGuildId() : null;
    if (!gid) { toast('Join or create a guild first.'); return false; }
    if (!SO.canReview(gid)) { toast('Only your guild\'s leader and officers can send invites.'); return false; }
    const card = await load(uid, true);
    if (!card || !card.hn || (card.lv | 0) < HN_LEVEL) { toast(`${nm} needs level ${HN_LEVEL} for the HoloNet before they can join a guild.`); return false; }
    if (card.g) { toast(`${nm} is already in a guild.`); return false; }
    const F = HN.friends.F;
    const r = F.rows.get(HN.friends.pairId(HN.Net.me, uid));
    if (!r || !r.ok) return false;
    if (HN.Net.names && nm) HN.Net.names[uid] = nm;
    await SO.inviteTo(uid);
    const g = SO.guildOf(gid) || {};
    const lv = SO.guildLevel ? SO.guildLevel(gid).lv : 1;
    return HN.friends.sendCard(r, { k: 'gi', g: { id: gid, n: String(g.name || '').slice(0, 24), tg: String(g.tag || '').slice(0, 5), c: g.color || '#5fd8ff', p: g.pic || '', e: g.emblem || '', m: SO.membersOf(gid).length || 1, l: lv } });
  }
  async function join(gid, done) {
    const SO = HN.social;
    if (!SO) return;
    if (!HN.ui.unlocked()) return toast(`Guilds open with the HoloNet at level ${HN_LEVEL}.`);
    if (HN.S().guild === gid) return toast('You\'re already in this guild.');
    if (HN.S().guild) return toast('Leave your current guild first (HoloNet, Guild, then Leave).');
    let g = SO.gmap.get(gid);
    try {
      const d = await HN.Net.db.doc(`guilds/${gid}`).get();
      if (!d.exists) return toast('That guild doesn\'t exist anymore.');
      g = { id: gid, ...d.data() };
      SO.gmap.set(gid, g);
      if (SO.setGuilds) SO.setGuilds();
    } catch (e) { if (!g) return toast('Couldn\'t reach the guild. Try again.'); }
    if (done) done();
    const go = () => SO.joinGuild(gid);
    // Joining opens the guild in the HoloNet.
    if (root.UI && root.UI.App && root.UI.App.go) { root.UI.App.go('holonet'); setTimeout(go, 350); } else go();
  }

  function init() {
    if (HN || !root.HN || !root.HN.friends) return;
    HN = root.HN;
    HN.fcard = { open, pic, card: cardOf, load, prefetch, publish, invite, join };
    // Keep my card fresh: soon after start, then every few minutes (only writes when something changed).
    setTimeout(() => publish(), 8000);
    setInterval(() => { if (!document.hidden) publish(); }, 5 * 60000);
    setTimeout(() => prefetch(), 9000);
  }
  if (root.HN && root.HN.friends) init(); else root.addEventListener('hn-ready', init);

  const st = document.createElement('style');
  st.textContent = `.fp-card .p2-top { margin-bottom: 0; }
.fp-av { display: grid; place-items: center; }
.fp-face .pic.ini { display: grid; place-items: center; background: radial-gradient(circle at 50% 35%, #1d3550, #081422); color: #bfefff; font: 800 1em var(--font-display, inherit); }
.pf-av.lg .pic.ini { font-size: 30px; } .pf-av.md .pic.ini { font-size: 18px; } .pf-av.sm .pic.ini { font-size: 11px; }
.fp-av .pf-av.lg { width: 76px; height: 76px; }
.fp-card .p2-ring { display: grid; place-items: center; }
.fp-cur { margin: 4px 0 0; color: #cfe6f5; } .fp-cur b { color: #ffd23f; }
.fp-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; } .fp-chips span { font-size: 11.5px; padding: 3px 9px; border-radius: 999px; background: #13213a; border: 1px solid rgba(95, 216, 255, 0.25); color: #8fb4c8; } .fp-chips span.on { color: #7af0a0; border-color: rgba(122, 240, 160, 0.45); }
.fp-acts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: min(100%, 440px); margin: 12px auto 4px; } .fp-acts.one { grid-template-columns: minmax(0, 260px); justify-content: center; }
.fp-acts .btn { padding: 11px 8px; font-size: 14px; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fp-acts .btn[disabled] { opacity: .45; cursor: not-allowed; }
.fp-chips span { white-space: nowrap; }
@media (max-width: 440px) {
  .fp-acts .btn { font-size: 12.5px; letter-spacing: .02em; padding: 11px 4px; }
  .fp-card .p2-top { grid-template-columns: 64px minmax(0, 1fr); gap: 10px; padding: 12px 44px 12px 12px; }
  .fp-card .p2-av { width: 64px; height: 64px; } .fp-av .pf-av.lg { width: 58px; height: 58px; } .pf-av.lg .pic.ini { font-size: 22px; }
  .fp-card .p2-ring { width: 30px; height: 30px; right: -6px; bottom: -4px; } .fp-card .p2-ring b { font-size: 12px; }
  .fp-card .p2-id h2 { font-size: 20px; } .fp-card .p2-id .small, .fp-cur { font-size: 12px; }
}
.fp-note { margin: 2px 0 6px; text-align: center; font-size: 12.5px; color: #ffb36b; }
.fp-tabs { grid-template-columns: repeat(var(--n, 5), minmax(0, 1fr)); }
@media (max-width: 480px) { .fp-tabs { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.p2-world.fp-now { outline: 2px solid #ffd23f; outline-offset: -2px; }
.fp-league { display: grid; grid-template-columns: 72px 1fr; gap: 12px; align-items: center; padding: 12px; margin-bottom: 10px; border-radius: 14px; border: 1px solid rgba(95, 216, 255, 0.25); background: rgba(8, 20, 32, 0.8); } .fp-league > div:first-child { width: 72px; } .fp-league b { display: block; font: 700 18px var(--font-display, inherit); } .fp-league span { color: #8fb4c8; font-size: 13px; }
.p2-frs.pics { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 8px; }
.p2-fr { display: grid; justify-items: center; gap: 4px; padding: 10px 6px; border-radius: 14px; border: 1px solid rgba(95, 216, 255, 0.2); background: rgba(8, 20, 32, 0.8); color: #e8f6ff; cursor: pointer; font: inherit; position: relative; }
.p2-fr:hover { border-color: rgba(255, 210, 63, 0.6); }
.p2-fr .fa:has(.pf-av) { border: 0; overflow: visible; background: none; } .p2-fr .fa .pf-av .pf-frame, .fr-av .pf-av .pf-frame { position: absolute; inset: -22%; width: 144%; height: 144%; } .p2-fr .fa .pf-av .pic svg, .fr-av .pf-av .pic svg { width: 100%; height: 100%; transform: scale(1.45) translateY(5%); } .p2-fr .fa .pf-av.md { width: 46px; height: 46px; }
.fr-av.pic { border: 0 !important; overflow: visible; background: none; } .fr-av .pf-av.sm { width: 30px; height: 30px; }
.p2-fr .fa { width: 56px; height: 56px; border-radius: 50%; overflow: hidden; border: 2px solid #ffd23f; background: #0b1422; display: grid; place-items: center; font: 800 16px var(--font-display, inherit); color: #bfefff; }
.p2-fr .fa svg, .p2-fr .fa img { width: 100%; height: 100%; display: block; }
.p2-fr b { font-size: 13px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.p2-fr small { font-size: 11px; color: #8fb4c8; } .p2-fr small.on { color: #7af0a0; }
.p2-fr i { position: absolute; top: 6px; right: 6px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: #ff3b30; color: #fff; font: 800 11px/18px var(--font-display, inherit); font-style: normal; }`;
  document.head.appendChild(st);
})(window);
