// Update 2.6: friendly battles v4. Off until 2.6 ships (js/update26.js).
//  Modes: Classic (your squads, with bans), Mirror Match (one random squad on both sides), Draft Duel (take turns
//  picking 5 from a mixed pool of 18), Triple Draft (5 quick rounds, pick 1 of 3 from your own trios) and Level
//  Field (your squads). Mirror, Draft, Triple and Level Field put every card at Level 30 ★5.
//  Every friendly gets a 30-second turn and a 10-minute battle clock (Triple Draft 7), from the battle simulator:
//  an average battle is about 87 turns (about 40 yours), roughly 5 minutes; 9 in 10 finish inside 10.
//  Live with friends through the Live Duel connection (js/holonet.js calls prep/msg), or against bot friends.
(function (root) {
  'use strict';
  if (!(root.Update26 && root.Update26.on())) return;
  const HN = root.HN; const UI = root.UI; const D = root.GameData;
  if (!HN || !UI || !D || HN.fr26) return;
  const { esc, toast } = UI;
  const LV = { level: 30, stars: 5 };
  const MODES = ['classic', 'mirror', 'draft', 'triple', 'level'];
  const NAME = { classic: 'Classic', mirror: 'Mirror Match', draft: 'Draft Duel', triple: 'Triple Draft', level: 'Level Field' };
  const HOW = { classic: 'your squads against each other, after bans.', mirror: 'one random squad, the same on both sides, every card at Level 30 ★5.', draft: 'take turns picking 5 cards from a mixed pool of 18, every card at Level 30 ★5.', triple: '5 quick rounds: pick 1 of 3 from your own cards, every card at Level 30 ★5.', level: 'your squads, every card at Level 30 ★5.' };
  const ICON = { classic: '⚔', mirror: '⧉', draft: '◈', triple: '⚡', level: '⚖' };
  const COL = { classic: '#4aa8ff', mirror: '#b98aff', draft: '#ffc04a', triple: '#ff6a5a', level: '#4ade80' };
  const clocks = (fm) => ({ turnMs: 30000, matchMs: fm === 'triple' ? 420000 : 600000 });
  const mode = () => { try { const m = localStorage.getItem('swcg-fr26-mode'); return MODES.includes(m) ? m : 'classic'; } catch (e) { return 'classic'; } };
  const setMode = (m) => { try { localStorage.setItem('swcg-fr26-mode', m); } catch (e) { /* storage blocked */ } };
  const fmOf = () => (mode() === 'classic' ? '' : mode());

  // ---------- The mode picker in Friends ----------
  function picker(ts) {
    const m = mode();
    const trueOn = HN.Duel && HN.Duel.trueOn && HN.Duel.trueOn();
    return `<div class="f26-modes" role="group" aria-label="Friendly battle mode">${MODES.map((k) => `<button type="button" class="f26-mode ${k === m ? 'on' : ''}" data-fr26m="${k}" style="--mc:${COL[k]}"><i aria-hidden="true">${ICON[k]}</i><span><b>${NAME[k]}${k === 'draft' || k === 'triple' ? ' <em>NEW</em>' : ''}</b><small>${esc(HOW[k][0].toUpperCase() + HOW[k].slice(1))}</small></span></button>`).join('')}</div>
      ${m === 'classic' && trueOn ? `<div class="fr-mode" role="group" aria-label="Card levels"><button type="button" class="${!ts ? 'on' : ''}" data-frmode="even"><b>Even</b><small>Every card at Level ${(HN.Duel && HN.Duel.LEVEL) || 20} ★${(HN.Duel && HN.Duel.STARS) || 3}</small></button><button type="button" class="${ts ? 'on' : ''}" data-frmode="true"><b>True Strength</b><small>Real levels and stars</small></button></div>` : ''}
      <div class="fr-mode f26-bo" role="group" aria-label="How many battles"><button type="button" class="${bo() === 1 ? 'on' : ''}" data-fr26bo="1"><b>One battle</b><small>Mix: one Ground, one Fleet</small></button><button type="button" class="${bo() === 3 ? 'on' : ''}" data-fr26bo="3"><b>Best of 3</b><small>First to two wins</small></button></div>`;
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-fr26bo]'); if (!b) return;
    try { localStorage.setItem('swcg-fr26-bo', b.dataset.fr26bo === '3' ? '3' : '1'); } catch (er) { /* storage blocked */ }
    b.parentElement.querySelectorAll('[data-fr26bo]').forEach((x) => x.classList.toggle('on', x === b));
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-fr26m]'); if (!b) return;
    setMode(b.dataset.fr26m);
    const host = b.closest('.frp, [data-frp]');
    if (HN.friends && HN.friends.F && HN.friends.F.view) HN.friends.F.view();
    else if (host) host.querySelectorAll('[data-fr26m]').forEach((x) => x.classList.toggle('on', x === b));
  });

  // ---------- Card pools ----------
  const HIDE = new Set(['temple_guardian', 'the_daughter', 'the_son']); // secret cards that stay a secret
  const SECRET_OK = ['captain_rex', 'darth_bane'];
  const STRONG = { legendary: 1, mythic: 1 };
  const RW = { common: 1, rare: 2, epic: 3, legendary: 4, mythic: 5, secret: 5 };
  const usable = (kind) => D.UNITS.filter((u) => u.kind === kind && !u.boss && !u.raid && !u.exclusive && !u.enemyOnly && !u.pf25 && D.UNIT_MAP[u.id] === u && u.rarity !== 'secret' && !HIDE.has(u.id));
  const traits = (u) => (D.traitsOf ? D.traitsOf(u.id) : u.traits || []);
  const shuffle = (a, r) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function groups(list) { const g = {}; for (const u of list) for (const t of traits(u)) (g[t] = g[t] || []).push(u); return g; }
  // Draft Duel: 2 or 3 groups mashed together, a secret card or two, a stronger card or two, then wildcards that
  // share a trait with something already in, all shuffled. 18 cards.
  function draftPool(seed, kind) {
    const r = HN.rng(seed); const all = usable(kind); const G = groups(all);
    const big = shuffle(Object.keys(G).filter((t) => G[t].length >= 4), r);
    const pool = new Map(); const add = (u) => { if (u && !pool.has(u.id) && pool.size < 18) pool.set(u.id, u); };
    for (const t of big.slice(0, r() < 0.4 ? 3 : 2)) shuffle(G[t].slice(), r).slice(0, 5).forEach(add);
    if (kind === 'character') shuffle(SECRET_OK.filter((id) => D.UNIT_MAP[id]), r).slice(0, r() < 0.3 ? 2 : 1).forEach((id) => add(D.UNIT_MAP[id]));
    shuffle(all.filter((u) => STRONG[u.rarity]), r).slice(0, r() < 0.5 ? 2 : 1).forEach(add);
    const inPool = () => new Set([...pool.values()].flatMap(traits));
    let guard = 0;
    while (pool.size < 18 && guard++ < 400) { const u = all[Math.floor(r() * all.length)]; const tr = inPool(); if (traits(u).some((t) => tr.has(t)) || guard > 300) add(u); }
    return shuffle([...pool.keys()], r);
  }
  // Triple Draft: 5 trios of cards that go together, heavier hitters first. Each player gets their own 15.
  function trios(seed, side, kind) {
    const r = HN.rng(seed + (side === 'B' ? 7919 : 0)); const all = usable(kind).filter((u) => u.rarity !== 'common' || u.role === 'attacker'); const G = groups(all);
    const used = new Set(); const out = [];
    for (const t of shuffle(Object.keys(G).filter((x) => G[x].length >= 3), r)) {
      if (out.length >= 5) break;
      const pick = shuffle(G[t].filter((u) => !used.has(u.id)), r).sort((a, b) => RW[b.rarity] - RW[a.rarity]).slice(0, 3);
      if (pick.length < 3) continue;
      pick.forEach((u) => used.add(u.id)); out.push(shuffle(pick.map((u) => u.id), r));
    }
    while (out.length < 5) { const left = shuffle(all.filter((u) => !used.has(u.id)), r).slice(0, 3); left.forEach((u) => used.add(u.id)); out.push(left.map((u) => u.id)); }
    return out;
  }
  // Mirror Match: one squad with a tank, a healer, damage and support, from every card in the game.
  function mirrorSquad(seed, kind) {
    const r = HN.rng(seed); const all = shuffle(usable(kind), r); const out = [];
    for (const role of ['tank', 'healer', 'attacker', 'attacker', 'support']) { const u = all.find((x) => x.role === role && !out.includes(x.id)) || all.find((x) => !out.includes(x.id)); out.push(u.id); }
    return out;
  }
  // Out of time: take what the squad is missing (tank, then healer, then damage), like Clash Royale.
  const NEED = ['tank', 'healer', 'attacker', 'support', 'attacker'];
  function smart(ids, have) {
    const roles = have.map((id) => D.UNIT_MAP[id].role);
    const want = NEED.find((role, i) => roles.filter((x) => x === role).length < NEED.slice(0, i + 1).filter((x) => x === role).length) || 'attacker';
    const hit = ids.filter((id) => D.UNIT_MAP[id].role === want).sort((a, b) => RW[D.UNIT_MAP[b].rarity] - RW[D.UNIT_MAP[a].rarity]);
    return hit[0] || ids[0];
  }
  const entries = (ids) => ids.map((id) => ({ id, level: LV.level, stars: LV.stars }));

  // ---------- A draft card: the picture on the front; the back reads like the collection's card back ----------
  function cardBack(def) {
    const d = root.Doctrines && root.Doctrines.of ? root.Doctrines.of(def.id) : null;
    const tr = D.traitsOf ? D.traitsOf(def.id) : [];
    const cls = D.classesOf ? D.classesOf(def) : [];
    const ab = D.abilitiesFor ? D.abilitiesFor(def) : def.abilities || [];
    return `<span class="f26-back"><small class="f26-ey">${def.faction === 'light' ? 'Light Side' : 'Dark Side'} · ${esc(def.role)}</small><b class="f26-bn">${esc(def.name)}</b>
      <span class="f26-tr">${cls.map((c) => `<i>${D.CLASS_INFO[c].icon} ${esc(D.CLASS_INFO[c].label)}</i>`).join('')}${tr.map((t) => `<i>${D.TRAIT_INFO[t].icon} ${esc(D.TRAIT_INFO[t].label)}</i>`).join('')}</span>
      ${d ? `<span class="f26-doc"><b>${d.icon} ${esc(d.name)}</b>${esc(d.text)}</span>` : ''}
      ${ab.map((a) => `<span class="f26-ab${a.ultimate ? ' u' : ''}"><b>${a.ultimate ? '★ ' : ''}${esc(a.name)}</b><em>${a.ultimate ? 'Ultimate' : a.cd ? `${a.cd}-turn cooldown` : 'Basic'}</em><span>${esc(a.desc || '')}</span></span>`).join('')}</span>`;
  }
  const card = (id) => { const def = D.UNIT_MAP[id]; return `<button type="button" class="f26-card" data-fc="${id}"><span class="f26-in"><span class="f26-front"><span class="f26-art">${root.Art.unitArt(def)}</span><b>${esc(def.name)}</b><i class="f26-tag"></i></span>${cardBack(def)}</span></button>`; };

  // ---------- The draft screen (shared by Draft Duel and Triple Draft) ----------
  // o: { title, who, cards (Draft Duel pool) | rounds (Triple), order, secs, onPick(id) (my pick, live), botPick, onDone(mine, theirs), onLeave }
  function screen(o) {
    const el = document.createElement('div'); el.className = 'f26'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', o.title);
    el.innerHTML = `<div class="f26-top"><b class="f26-t">${esc(o.title)}</b><span class="f26-tm" data-tm><span data-who>Your pick</span><b data-sec></b></span><button type="button" class="f26-q" data-q aria-label="How to draft">?</button><button type="button" class="f26-x" data-x>Leave</button></div>
      ${o.rounds ? '' : `<div class="f26-sq them"><span>${esc(o.who)}</span>${'<i></i>'.repeat(5)}</div>`}<div class="f26-pool${o.rounds ? ' tri' : ''}" data-pool></div><div class="f26-sq you"><span>You</span>${'<i></i>'.repeat(5)}</div>
      <div class="f26-help" data-help hidden><b>How to draft</b><dl><div><dt>Tap / <kbd>F</kbd></dt><dd>Flip a card to read it</dd></div><div><dt>Double-tap / <kbd>Enter</kbd></dt><dd>Lock it in</dd></div><div><dt><kbd>←</kbd> <kbd>→</kbd></dt><dd>Move between cards</dd></div><div><dt><kbd>H</kbd></dt><dd>Show or hide this</dd></div></dl><button type="button" data-hx>Got it</button></div>`;
    document.body.appendChild(el); document.body.classList.add('f26-open');
    const pool = el.querySelector('[data-pool]'); const tm = el.querySelector('[data-tm]');
    const S = { k: 0, round: 0, mine: [], theirs: [], turn: null, sec: 0, cur: 0, last: 0, lc: null, done: false, timer: 0, bot: 0 };
    const fill = (who, id) => { const s = el.querySelector(`.f26-sq.${who} i:not(.f)`); if (s) { s.classList.add('f'); s.innerHTML = root.Art.unitArt(D.UNIT_MAP[id]); } };
    const live = () => [...pool.querySelectorAll('[data-fc]:not([disabled])')];
    const paint = () => { const me = S.turn === 'me'; tm.querySelector('[data-who]').textContent = S.done ? 'Squads locked · battle starts' : me ? 'Your pick' : `${o.who} is picking`; tm.querySelector('[data-sec]').textContent = S.done ? '' : `0:${String(S.sec).padStart(2, '0')}`; tm.classList.toggle('them', !me && !S.done); const low = me && S.sec <= 5 && !S.done; tm.classList.toggle('low', low); tm.style.setProperty('--p', low ? ((6 - S.sec) / 5).toFixed(2) : 0); };
    function lock(c, who) {
      const id = c.dataset.fc; c.classList.remove('flip'); c.disabled = true;
      if (who === 'me') { c.classList.add('you'); c.querySelector('.f26-tag').textContent = 'YOURS'; S.mine.push(id); fill('you', id); } else { c.classList.add('them'); S.theirs.push(id); fill('them', id); }
    }
    function next() {
      clearTimeout(S.bot);
      if (o.rounds) {
        if (S.round >= 5) return finish();
        pool.innerHTML = o.rounds[S.round].map(card).join(''); S.turn = 'me'; S.sec = o.secs; paint(); return;
      }
      if (S.k >= o.order.length || !live().length) return finish();
      S.turn = o.order[S.k]; S.sec = S.turn === 'me' ? o.secs : o.secs + 10; paint();
      if (S.turn === 'them' && o.botPick) S.bot = setTimeout(() => { const ids = live().map((x) => x.dataset.fc); if (ids.length && S.turn === 'them') theirPick(o.botPick(ids, S.theirs)); }, 1300 + Math.random() * 1500);
    }
    function myPick(c) {
      if (S.done || S.turn !== 'me' || !c || c.disabled) return;
      const id = c.dataset.fc;
      if (o.rounds) { lock(c, 'me'); [...pool.querySelectorAll('[data-fc]')].forEach((x) => { if (x !== c) { x.disabled = true; x.classList.add('fade'); } }); S.turn = null; S.round++; setTimeout(next, 900); return; }
      lock(c, 'me'); S.k++; if (o.onPick) o.onPick(id, S.k - 1); next();
    }
    function theirPick(id) {
      if (S.done || S.turn !== 'them') return false;
      const c = pool.querySelector(`[data-fc="${id}"]:not([disabled])`); if (!c) return false;
      lock(c, 'them'); S.k++; next(); return true;
    }
    function finish() { if (S.done) return; S.done = true; clearInterval(S.timer); paint(); setTimeout(() => { close(); o.onDone(S.mine.slice(), S.theirs.slice()); }, 1100); }
    function close() { clearInterval(S.timer); clearTimeout(S.bot); document.removeEventListener('keydown', onKey); el.remove(); if (!document.querySelector('.f26')) document.body.classList.remove('f26-open'); }
    S.timer = setInterval(() => {
      if (S.done || !S.turn) return;
      if (S.sec > 0) S.sec--; paint();
      if (S.sec > 0) return;
      if (S.turn === 'me') { const ids = live().map((x) => x.dataset.fc); const id = o.rounds ? ids[Math.floor(Math.random() * ids.length)] : smart(ids, S.mine); myPick(pool.querySelector(`[data-fc="${id}"]`)); }
      else if (!o.botPick && o.onStall) o.onStall();
    }, 1000);
    el.addEventListener('click', (e) => {
      const c = e.target.closest('[data-fc]');
      if (c && !c.disabled) { const now = Date.now(); if (now - S.last < 340 && c === S.lc) myPick(c); else c.classList.toggle('flip'); S.last = now; S.lc = c; S.cur = live().indexOf(c); return; }
      if (e.target.closest('[data-q]')) { const h = el.querySelector('[data-help]'); h.hidden = !h.hidden; return; }
      if (e.target.closest('[data-hx]')) { el.querySelector('[data-help]').hidden = true; return; }
      if (e.target.closest('[data-x]')) { UI.confirmBox('Leave the draft?', 'The friendly battle ends for both of you.', 'Leave').then((y) => { if (y) { close(); if (o.onLeave) o.onLeave(); } }); }
    });
    el.addEventListener('dblclick', (e) => { if (e.target.closest('[data-fc]')) e.preventDefault(); });
    function onKey(e) {
      if (document.querySelector('.modal-backdrop')) return;
      const l = live(); if (!l.length) return; const c = l[Math.min(S.cur, l.length - 1)];
      if (e.key === 'f' || e.key === 'F') { c.classList.toggle('flip'); e.preventDefault(); }
      else if (e.key === 'Enter') { myPick(document.activeElement && document.activeElement.closest && document.activeElement.closest('[data-fc]') ? document.activeElement.closest('[data-fc]') : c); e.preventDefault(); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { S.cur = (S.cur + (e.key === 'ArrowRight' ? 1 : -1) + l.length) % l.length; l[S.cur].focus(); e.preventDefault(); }
      else if (e.key === 'h' || e.key === 'H') { const h = el.querySelector('[data-help]'); h.hidden = !h.hidden; }
    }
    document.addEventListener('keydown', onKey);
    if (!o.rounds) pool.innerHTML = o.cards.map(card).join('');
    next();
    return { theirPick, close, get done() { return S.done; } };
  }

  // ---------- Live with a friend (js/holonet.js calls these from the duel setup) ----------
  const ORDER = (host) => ['A', 'B', 'B', 'A', 'A', 'B', 'B', 'A', 'A', 'B'].map((x) => ((x === 'A') === !!host ? 'me' : 'them'));
  function prep(P, A) {
    Object.assign(P, { lv: LV }, clocks(P.fm));
    if (P.fm === 'level') return A.build(P);
    if (P.fm === 'mirror') { const sq = entries(mirrorSquad(P.seed, P.kind)); P.mine = sq; P.theirs = sq.map((e) => ({ ...e })); return reveal(P, A); }
    if (P.fm === 'draft') {
      P.ui26 = screen({ title: 'Draft Duel', who: P.who, cards: draftPool(P.seed, P.kind), order: ORDER(P.host), secs: 15,
        onPick: (id, k) => A.say(P, { step: 'dpick', card: id, k }),
        onStall: () => { if (A.live(P)) { P.ui26.close(); A.timedOut(P, `${P.who} took too long, so the battle was called off.`); } },
        onLeave: () => A.leave(P, 'You left the friendly battle.'),
        onDone: (mine, theirs) => { if (!A.live(P)) return; P.mine = entries(mine); P.theirs = entries(theirs); A.fight(P); } });
      return;
    }
    if (P.fm === 'triple') {
      P.ui26 = screen({ title: 'Triple Draft', who: P.who, rounds: trios(P.seed, P.host ? 'A' : 'B', P.kind), secs: 8,
        onLeave: () => A.leave(P, 'You left the friendly battle.'),
        onDone: (mine) => { if (!A.live(P)) return; P.mine = entries(mine); A.say(P, { step: 'squad', squad: P.mine }); if (P.theirs) A.fight(P); else A.waitFor(P, `Waiting for <b>${esc(P.who)}</b> to finish their picks…`, 60000); } });
    }
  }
  // Mirror Match: show both players the squad for a moment, then fight.
  function reveal(P, A) {
    const m = UI.openModal(`<div class="f26-rev"><p class="eyebrow">Mirror Match</p><h2>You both get this squad</h2><div class="f26-revs">${P.mine.map((e) => `<span>${root.Art.unitArt(D.UNIT_MAP[e.id])}<b>${esc(D.UNIT_MAP[e.id].name)}</b></span>`).join('')}</div><p class="muted small">Every card at Level 30 ★5. Pure skill.</p></div>`, { small: true, dismissable: false });
    setTimeout(() => { m.close(); if (A.live(P)) A.fight(P); }, 3200);
  }
  function msg(P, step, d, A) {
    if (step === 'dpick' && P.fm === 'draft') { if (P.ui26 && typeof d.card === 'string' && D.UNIT_MAP[d.card]) P.ui26.theirPick(d.card); return true; }
    if ((step === 'cancel' || step === 'no') && P.ui26) { P.ui26.close(); }
    return false;
  }
  const intro = (cfg) => `Friendly · ${NAME[cfg.fm] || 'Friendly'} (unranked, no rewards): every card at Level ${LV.level} ★${LV.stars}. ${clocks(cfg.fm).turnMs / 1000} seconds a turn, ${clocks(cfg.fm).matchMs / 60000} minutes on the clock.`;

  // ---------- Against a bot friend: the same modes, the bot picks for itself ----------
  // Resolves with { mine, theirs } (Level 30 ★5 entries), or null for Classic, or false if you left.
  function local(uid, kind, botSq) {
    const fm = mode(); const seed = 1 + Math.floor(Math.random() * 2e9); const who = (HN.botChatApi && HN.botChatApi.BF()[uid] && HN.botChatApi.BF()[uid].name) || 'Your friend';
    if (fm === 'classic') return Promise.resolve(null);
    if (fm === 'level') return Promise.resolve({ mine: (HN.squadEntries(kind) || []).map((e) => ({ ...e, ...LV })), theirs: botSq.map((e) => ({ ...e, ...LV })), fm });
    if (fm === 'mirror') { const sq = entries(mirrorSquad(seed, kind)); return new Promise((res) => { reveal({ mine: sq }, { live: () => true, fight: () => res({ mine: sq, theirs: sq.map((e) => ({ ...e })), fm }) }); }); }
    return new Promise((res) => {
      if (fm === 'draft') screen({ title: 'Draft Duel', who, cards: draftPool(seed, kind), order: ORDER(true), secs: 15, botPick: (ids, have) => (Math.random() < 0.75 ? smart(ids, have) : ids[Math.floor(Math.random() * ids.length)]), onLeave: () => res(false), onDone: (mine, theirs) => res({ mine: entries(mine), theirs: entries(theirs), fm }) });
      else screen({ title: 'Triple Draft', who, rounds: trios(seed, 'A', kind), secs: 8, onLeave: () => res(false), onDone: (mine) => res({ mine: entries(mine), theirs: entries(trios(seed, 'B', kind).map((t) => t[Math.floor(Math.random() * 3)])), fm }) });
    });
  }

  // ---------- Styles ----------
  const st = document.createElement('style');
  st.textContent = `.f26-modes{display:grid;gap:6px;margin:4px 0 8px}.f26-mode{display:flex;gap:10px;align-items:center;text-align:left;padding:8px 10px;border-radius:12px;background:var(--panel-2);border:1px solid var(--line);color:var(--text);cursor:pointer;font:inherit}.f26-mode.on{border-color:var(--mc);box-shadow:inset 0 0 0 1px var(--mc);background:linear-gradient(90deg,color-mix(in srgb,var(--mc) 16%,var(--panel-2)),var(--panel-2))}.f26-mode>i{font-style:normal;color:var(--mc);font-size:18px;width:22px;text-align:center;flex:none}.f26-mode b{font:800 13.5px var(--font-display);display:block}.f26-mode em{font:800 9.5px var(--font-display);font-style:normal;color:#1a1204;background:var(--mc);padding:1px 6px;border-radius:99px;vertical-align:1px}.f26-mode small{font-size:11.5px;color:var(--muted)}
body.f26-open{overflow:hidden}
.f26{position:fixed;inset:0;z-index:45;display:grid;grid-template-rows:auto auto minmax(0,1fr) auto;gap:8px;padding:max(10px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left));background:radial-gradient(ellipse at 50% 0%,#14233a,#05080f 70%);color:var(--text);container-type:size;overflow:hidden}
.f26-top{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.f26-t{font:800 14px var(--font-display);letter-spacing:.12em;text-transform:uppercase;color:#ffc04a;flex:1;min-width:0}
.f26-tm{--p:0;display:inline-flex;gap:8px;align-items:center;padding:5px 12px;border-radius:10px;border:1px solid #2c4a3a;background:#0e2a1e;font:700 12px var(--font-display);color:#cfeedd;transition:background .3s,border-color .3s,box-shadow .3s}.f26-tm b{font:800 15px var(--font-display);font-variant-numeric:tabular-nums}
.f26-tm.low{border-color:#ff5a4a;background:linear-gradient(90deg,rgba(255,60,40,calc(.18 + var(--p) * .4)),rgba(120,10,10,.5));color:#ffe0da;box-shadow:0 0 calc(6px + var(--p) * 18px) rgba(255,70,50,calc(.25 + var(--p) * .5))}.f26-tm.them{border-color:var(--line);background:#141c26;color:var(--muted)}
.f26-q,.f26-x{font:800 12px var(--font-display);height:30px;padding:0 12px;border-radius:99px;border:1px solid var(--line);background:var(--panel-2);color:var(--text);cursor:pointer}.f26-q{width:30px;padding:0}
.f26-sq{display:grid;grid-template-columns:auto repeat(5,minmax(0,52px));gap:6px;align-items:center;justify-content:center}.f26-sq>span{font:700 10.5px var(--font-display);letter-spacing:.08em;text-transform:uppercase;color:var(--muted);padding-right:4px}.f26-sq i{aspect-ratio:1;border-radius:8px;border:1px dashed var(--line);display:block;overflow:hidden}.f26-sq i svg{width:100%;height:100%;display:block}.f26-sq.you i.f{border:1.5px solid #4ade80;box-shadow:0 0 8px rgba(74,222,128,.5)}.f26-sq.them i.f{border:1.5px solid #5a6676;filter:grayscale(.6)}
.f26-pool{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;align-content:start;overflow-y:auto;min-height:0;padding:2px}
@container (min-width:560px){.f26-pool{grid-template-columns:repeat(6,minmax(0,1fr))}}@container (min-width:900px){.f26-pool{grid-template-columns:repeat(9,minmax(0,1fr));max-width:1200px;width:100%;justify-self:center}}
.f26-pool.tri{grid-template-columns:repeat(3,minmax(0,1fr));max-width:560px;width:100%;justify-self:center;align-content:center}
.f26-card{perspective:800px;padding:0;border:0;background:none;color:inherit;font:inherit;cursor:pointer;aspect-ratio:4/5;text-align:left;transition:transform .2s,opacity .3s,filter .3s}.f26-card[disabled]{cursor:default}.f26-card:focus-visible{outline:2px solid #ffc04a;outline-offset:2px;border-radius:10px}
.f26-in{position:relative;display:block;width:100%;height:100%;transition:transform .45s;transform-style:preserve-3d}.f26-card.flip .f26-in{transform:rotateY(180deg)}
.f26-front,.f26-back{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:10px;border:1.5px solid #2a3a4e;background:#0e1c2a;overflow:hidden}
.f26-front{display:grid;grid-template-rows:minmax(0,1fr) auto}.f26-art{display:block;min-height:0;overflow:hidden}.f26-art svg{width:100%;height:100%;display:block}.f26-front>b{font:800 clamp(9px,2.6cqw,12px) var(--font-display);padding:3px 6px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.f26-tag{position:absolute;top:5px;right:5px;font:800 9px var(--font-display);font-style:normal;padding:2px 6px;border-radius:99px;background:#4ade80;color:#06210f;display:none}
.f26-back{transform:rotateY(180deg);padding:7px;display:grid;gap:4px;align-content:start;overflow:auto;font-size:10px;line-height:1.3}.f26-ey{font:700 8.5px var(--font-display);letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}.f26-bn{font:800 12px var(--font-display)}.f26-tr{display:flex;flex-wrap:wrap;gap:3px}.f26-tr i{font-style:normal;font-size:9px;padding:1px 5px;border-radius:99px;background:#16283a;border:1px solid var(--line)}
.f26-doc{display:grid;gap:1px;padding:4px 6px;border-radius:6px;background:rgba(255,210,63,.08);border:1px solid rgba(255,210,63,.3);color:#e8dcc0}.f26-doc b{font:800 10px var(--font-display);color:#ffd23f}
.f26-ab{display:grid;gap:1px}.f26-ab b{font:800 10.5px var(--font-display);color:#fff}.f26-ab.u b{color:#ffd23f}.f26-ab em{font-style:normal;font-size:9px;color:var(--muted)}.f26-ab span{color:#c8d4e0}
.f26-card.you{transform:translateY(-4px)}.f26-card.you .f26-front{border-color:#4ade80;box-shadow:0 0 0 2px #4ade80 inset,0 0 16px rgba(74,222,128,.55)}.f26-card.you .f26-tag{display:block}
.f26-card.them,.f26-card.fade{opacity:.3;filter:grayscale(1)}
.f26-help{position:absolute;right:12px;top:52px;width:min(300px,calc(100% - 24px));background:#0b1522;border:1px solid #ffc04a;border-radius:12px;padding:12px;display:grid;gap:8px;box-shadow:0 10px 30px #000a;z-index:3}.f26-help[hidden]{display:none}.f26-help dl{margin:0;display:grid;gap:6px}.f26-help dl>div{display:grid;grid-template-columns:auto 1fr;gap:8px;font-size:12.5px}.f26-help dd{margin:0;color:var(--muted)}.f26-help button{justify-self:end;font:700 12px var(--font-display);padding:5px 12px;border-radius:99px;border:1px solid var(--line);background:none;color:var(--text);cursor:pointer}.f26 kbd{font:700 11px var(--font-display);padding:1px 5px;border-radius:4px;border:1px solid var(--line);background:#0b1522}
@media (orientation:landscape) and (max-height:620px){
 .f26{grid-template-columns:62px minmax(0,1fr) 62px;grid-template-rows:auto minmax(0,1fr);grid-template-areas:"top top top" "you pool them"}
 .f26-top{grid-area:top}.f26-pool{grid-area:pool;grid-template-columns:repeat(9,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));height:100%;overflow:hidden;align-content:stretch}
 .f26-pool .f26-card{aspect-ratio:auto;height:100%;min-height:0}.f26-pool.tri{grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:minmax(0,1fr);max-width:none}.f26-pool.tri .f26-card{max-width:220px;justify-self:center;width:100%;aspect-ratio:4/5;height:auto;max-height:100%}
 .f26-sq.you{grid-area:you}.f26-sq.them{grid-area:them}.f26-sq{grid-template-columns:1fr;grid-template-rows:auto repeat(5,minmax(0,1fr));align-content:stretch;gap:5px;min-height:0;height:100%}.f26-sq i{aspect-ratio:auto;width:100%;max-width:62px;max-height:62px;justify-self:center;min-height:0;height:100%}.f26-sq>span{padding:0;text-align:center}
}
.f26-bo{margin-top:6px}.f26-srl{text-align:center;margin:4px 0 0;font-size:13px;color:#bfefff}.f26-sr{display:grid;gap:8px;justify-items:center;margin:8px 0}.f26-srs{display:flex;align-items:center;gap:14px}.f26-srs span{display:grid;justify-items:center}.f26-srs small{font:700 10px var(--font-display);letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}.f26-srs b{font:800 30px/1 var(--font-display)}.f26-srs em{font:700 11px var(--font-display);letter-spacing:.06em;text-transform:uppercase;color:#ffc04a;font-style:normal;text-align:center;max-width:170px}.f26-pips{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}.f26-pip{display:grid;justify-items:center;gap:2px;min-width:64px;padding:5px 8px;border-radius:10px;border:1px solid var(--line);background:rgba(255,255,255,.03)}.f26-pip i{font:700 9.5px var(--font-display);letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-style:normal}.f26-pip b{font:800 12px var(--font-display)}.f26-pip.w{border-color:#4ade80;background:rgba(74,222,128,.1)}.f26-pip.w b{color:#4ade80}.f26-pip.l{border-color:#ff6b6b;background:rgba(255,107,107,.08)}.f26-pip.l b{color:#ff8a8a}.f26-pip.sk{opacity:.45}
.f26-rev{display:grid;gap:10px;justify-items:center;text-align:center}.f26-rev h2{margin:0}.f26-revs{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}.f26-revs span{display:grid;gap:3px;width:60px}.f26-revs svg{width:60px;height:60px;border-radius:10px;display:block}.f26-revs b{font:700 10px var(--font-display)}`;
  document.head.appendChild(st);

  // ---------- Ground, Fleet or Mix, and Best of 3 ----------
  // A series is one friend, one kind (Ground, Fleet or Mix) and one length. Mix plays a
  // Ground battle then a Fleet one (Best of 3: Ground, Fleet, Ground). Wins decide it;
  // if wins are level, the squad with more health left across the series wins.
  // Nothing is ranked: it lives on this device, and the challenger carries the score
  // in each invite so both screens agree.
  const KN = { character: 'Ground', ship: 'Fleet', mix: 'Mix' };
  const SR = {};
  let lastHp = null;
  const bo = () => { try { return localStorage.getItem('swcg-fr26-bo') === '3' ? 3 : 1; } catch (e) { return 1; } };
  const hpPct = (b, side) => { const u = (b && b.side && b.side(side)) || []; const t = u.reduce((a, x) => a + (x.maxHp || 0), 0); return t ? Math.round(100 * u.reduce((a, x) => a + Math.max(0, x.hp || 0), 0) / t) : 0; };
  if (UI.hooks) (UI.hooks.battleEnd = UI.hooks.battleEnd || []).push((b, p) => { if (p && p.type === 'hn' && (p.hn === 'duel' || p.hn === 'botfr')) lastHp = { me: hpPct(b, 'player'), them: hpPct(b, 'enemy'), at: Date.now() }; });
  const kindAt = (k, i) => (k === 'mix' ? (i % 2 ? 'ship' : 'character') : k);
  const plan = (s) => (s.bo === 3 ? 3 : s.k === 'mix' ? 2 : 1);
  const over = (s) => (s.bo === 3 ? s.w[0] >= 2 || s.w[1] >= 2 || s.n >= 3 : s.n >= plan(s));
  const verdict = (s) => (s.w[0] !== s.w[1] ? (s.w[0] > s.w[1] ? 1 : -1) : s.hp[0] !== s.hp[1] ? (s.hp[0] > s.hp[1] ? 1 : -1) : 0);
  const isSeries = (k) => k === 'mix' || bo() === 3;
  // Start a series with a friend (or bot). Returns the first battle's kind.
  function srNew(uid, k, host) { SR[uid] = { k, bo: bo(), n: 0, w: [0, 0], hp: [0, 0], log: [], host: !!host, fm: mode() }; return kindAt(k, 0); }
  const srOf = (uid) => SR[uid] || null;
  const srDrop = (uid) => { delete SR[uid]; };
  // What goes in an invite: the score from the sender's side.
  const srOut = (s) => (s ? { k: s.k, bo: s.bo, n: s.n, w: s.w.slice(), hp: s.hp.slice(), log: s.log.slice() } : null);
  function srClean(x) {
    if (!x || typeof x !== 'object' || !KN[x.k]) return null;
    const n = Math.max(0, Math.min(2, x.n | 0)); const num = (v) => Math.max(0, Math.min(300, v | 0));
    const w = Array.isArray(x.w) ? [num(x.w[0]), num(x.w[1])] : [0, 0]; const hp = Array.isArray(x.hp) ? [num(x.hp[0]), num(x.hp[1])] : [0, 0];
    const log = (Array.isArray(x.log) ? x.log : []).slice(0, n).map((r) => (r === 'w' || r === 'l' || r === 'd' ? r : 'd'));
    return { k: x.k, bo: x.bo === 3 ? 3 : 1, n, w, hp, log };
  }
  // The other side of an invite: their wins are my losses.
  function srAccept(uid, x) {
    const c = srClean(x); if (!c) { srDrop(uid); return null; }
    SR[uid] = { ...c, w: [c.w[1], c.w[0]], hp: [c.hp[1], c.hp[0]], log: c.log.map((r) => (r === 'w' ? 'l' : r === 'l' ? 'w' : 'd')), host: false };
    return SR[uid];
  }
  function srRecord(uid, res) {
    const s = SR[uid]; if (!s) return null;
    const h = lastHp && Date.now() - lastHp.at < 60000 ? lastHp : { me: 0, them: 0 }; lastHp = null;
    s.log.push(res); s.n += 1; if (res === 'w') s.w[0] += 1; else if (res === 'l') s.w[1] += 1;
    s.hp[0] += h.me; s.hp[1] += h.them;
    return s;
  }
  const srTitle = (s) => (s.bo === 3 ? `Best of 3 · ${KN[s.k]}` : 'Mix · Ground + Fleet');
  // "Battle 2 of 3 · Fleet" line for invites and the waiting box.
  const srLine = (x, flip) => { const s = srClean(x); if (!s) return ''; const w = flip ? [s.w[1], s.w[0]] : s.w; return `<p class="f26-srl"><b>${esc(srTitle(s))}</b> · Battle ${s.n + 1}${s.bo === 3 ? ' of up to 3' : ` of ${plan(s)}`}: <b>${KN[kindAt(s.k, s.n)]}</b>${s.n ? ` · ${w[0]}–${w[1]}` : ''}</p>`; };
  // The score strip: one pip per battle, filled as they're played.
  function srStrip(s) {
    const pips = []; for (let i = 0; i < plan(s); i += 1) { const r = s.log[i]; const sk = i >= s.n && over(s); pips.push(`<span class="f26-pip ${r || (sk ? 'sk' : '')}"><i>${KN[kindAt(s.k, i)]}</i><b>${r === 'w' ? 'WIN' : r === 'l' ? 'LOSS' : r === 'd' ? 'DRAW' : sk ? '—' : '·'}</b></span>`); }
    return `<div class="f26-sr"><div class="f26-srs"><span><small>You</small><b>${s.w[0]}</b></span><em>${esc(srTitle(s))}</em><span><small>Them</small><b>${s.w[1]}</b></span></div><div class="f26-pips">${pips.join('')}</div>${s.w[0] === s.w[1] && s.n ? `<p class="muted small" style="margin:0;text-align:center">Squad health left, on average: you ${Math.round(s.hp[0] / s.n)}% · them ${Math.round(s.hp[1] / s.n)}%. It breaks a tie in wins.</p>` : ''}</div>`;
  }
  // After a series battle: the result, the strip, and Next or the series result.
  // o: { uid, name, won, draw, next(kind), back(), rematch(), host }
  function srDone(o) {
    const s = srRecord(o.uid, o.draw ? 'd' : o.won ? 'w' : 'l'); if (!s) return false;
    const end = over(s); const v = end ? verdict(s) : 0; const nk = end ? '' : kindAt(s.k, s.n);
    if (end) srDrop(o.uid);
    const head = end ? (v > 0 ? ['win', 'SERIES WON'] : v < 0 ? ['lose', 'SERIES LOST'] : ['', 'SERIES DRAWN']) : [o.draw ? '' : o.won ? 'win' : 'lose', o.draw ? 'DRAW' : o.won ? 'VICTORY' : 'DEFEAT'];
    const why = end && s.w[0] === s.w[1] && v ? `<p class="muted small" style="text-align:center;margin:0">Level on wins, so health left decided it.</p>` : '';
    const btns = end ? `<button type="button" class="btn" data-s26="back">Back to friends</button><button type="button" class="btn btn-primary" data-s26="again">Play again</button>`
      : o.host ? `<button type="button" class="btn" data-s26="stop">Stop here</button><button type="button" class="btn btn-primary" data-s26="next">Next: ${KN[nk]}</button>`
        : `<button type="button" class="btn" data-s26="stop">Stop here</button><span class="muted small" style="align-self:center">${esc(o.name)} starts battle ${s.n + 1}.</span>`;
    const m = UI.openModal(`<div class="hn-result"><div class="result-title ${head[0]}">${head[1]}</div><p style="text-align:center;margin:0">Friendly series against <b>${esc(o.name)}</b></p>${srStrip(s)}${why}<p class="muted small" style="text-align:center;margin:0">Just for fun: no rating, rewards or records change.</p><div class="modal-actions">${btns}</div></div>`, { small: true, dismissable: false, cls: 'result-modal' });
    m.root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-s26]'); if (!b) return;
      const a = b.dataset.s26; m.close();
      if (a === 'next') return o.next(nk, srOut(SR[o.uid]));
      if (a === 'stop') srDrop(o.uid);
      if (a === 'again') return o.rematch(s.k);
      o.back();
    });
    srDone.modal = m;
    return true;
  }

  HN.fr26 = { NAME, HOW, mode, fmOf, picker, prep, msg, intro, local, draftPool, trios, mirrorSquad, smart, LV, clocks, KN, bo, isSeries, srNew, srOf, srDrop, srOut, srAccept, srLine, srDone, kindAt };
})(window);
