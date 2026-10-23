// The new Commander profile (preview, waiting for the owner's OK): the same
// card-and-tabs look as HoloNet profiles. Overview, Collection, Worlds,
// Badges, Friends and Stats. HoloNet things (league, rating) only show once
// the HoloNet is unlocked. Not switched on for players yet: ProfileV2.open()
// opens it, and ProfileV2.preview(true) makes the level chip open it on this
// device.
(function (root) {
  'use strict';
  const UI = root.UI;
  const D = root.GameData;
  if (!UI || !D) return;
  const { esc, fmt, openModal, toast } = UI;
  const P = () => root.Player;
  const PREVIEW = 'swcg-pf2';
  const RANK = { common: 0, rare: 1, epic: 2, legendary: 3, mythic: 4, secret: 5 };
  const RCOL = { common: '#9aa4b4', rare: '#4aa8ff', epic: '#b070ff', legendary: '#ffb020', mythic: '#ff4a6a', secret: '#3dffc8' };
  const title = (lv) => (lv >= D.MAX_ACCOUNT_LEVEL ? 'Grand Master' : lv >= 30 ? 'Fleet Admiral' : lv >= 15 ? 'General' : lv >= 6 ? 'Commander' : 'Captain');
  const hnOn = () => !!(root.HN && root.HN.ui && root.HN.ui.unlocked && root.HN.ui.unlocked());

  // Worlds: a world is fully liberated (shown in full colour) once every stage
  // is cleared and every boss on it is beaten.
  function worlds() {
    const s = P().state;
    return D.PLANETS.map((p) => {
      const stages = (p.stages || []).length;
      const cleared = P().planetCleared ? P().planetCleared(p.id) : 0;
      const bosses = D.BOSS_ENCOUNTERS.filter((b) => b.planet === p.id);
      const beat = bosses.filter((b) => s.bosses && s.bosses[b.id]).length;
      const free = P().planetComplete(p.id);
      return { p, stages, cleared: free ? stages : Math.min(stages, cleared || 0), bosses: bosses.length, beat, free, full: free && beat === bosses.length };
    });
  }

  function open() {
    const s = P().state;
    const a = s.account;
    const st = s.stats;
    const need = D.xpToNext(a.level);
    const pct = a.level >= D.MAX_ACCOUNT_LEVEL ? 100 : Math.round((a.xp / need) * 100);
    const PC = root.PlayerCollections;
    const col = s.units || {};
    const use = PC ? PC.myUse() : {};
    const power = (id) => { const u = col[id]; return u ? D.power(D.UNIT_MAP[id], u.level, u.stars) : 0; };
    const owned = Object.keys(col).filter((id) => D.UNIT_MAP[id]);
    const all = D.UNITS.filter((u) => !u.boss && (!u.exclusive || u.rarity === 'secret') && !u.raid && D.UNIT_MAP[u.id] === u && !u.hn);
    const fav = owned.filter((id) => use[id] && use[id].b > 0).sort((x, y) => use[y].b - use[x].b)[0];
    const strong = owned.slice().sort((x, y) => power(y) - power(x)).slice(0, 5);
    const ach = UI.achievements();
    const done = ach.filter((x) => x.have >= x.need);
    const W = worlds();
    const prof = (s.hn && s.hn.prof) || {};
    const name = prof.tag || 'Guest';
    const pic = root.Art ? root.Art.unitArt(D.UNIT_MAP[prof.av] || D.UNIT_MAP[fav] || D.UNIT_MAP[strong[0]] || D.UNIT_MAP.luke) : '';
    const mini = (id) => { const u = col[id]; return UI.unitCard(D.UNIT_MAP[id], { tag: 'div', owned: true, level: u.level, stars: u.stars, hideShards: true }).replace('class="ucard', `data-p2c="${id}" class="ucard`); };
    // What each coming level unlocks (from the battle screen's list).
    const unlockAt = {};
    for (const t of (root.BattleUI && root.BattleUI.levelUnlocks ? root.BattleUI.levelUnlocks() : [])) (unlockAt[t.level] = unlockAt[t.level] || []).push(t);
    const next = Object.keys(unlockAt).map(Number).filter((lv) => lv > a.level).sort((x, y) => x - y).slice(0, 3);
    let tab = 'overview';
    let chip = 'character';
    let fetched = false;

    const head = () => {
      const hn = hnOn() && root.HN.S ? root.HN.S() : null;
      const lg = hn && root.HN.divOf ? root.HN.divOf(hn.rating) : null;
      return `<button type="button" class="pf-x p2-x" data-p2="close" aria-label="Close">✕</button>
      <div class="p2-top">
        <div class="p2-av"><button type="button" class="p2-pic" data-p2="pic" aria-label="Change your picture"><span class="p2-face">${pic}</span><span class="p2-edit" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16v4z" fill="currentColor"/></svg></span></button><button type="button" class="acct-ring p2-ring" data-p2="level" style="--p:${pct}" aria-label="Level ${a.level}: what's coming up"><b>${a.level}</b></button></div>
        <div class="p2-id"><p class="eyebrow">Commander profile</p><h2>${esc(name)}</h2>${prof.tag ? '' : '<button type="button" class="btn btn-small btn-primary p2-addprof" data-p2="addprof">Add profile</button>'}
          <p class="muted small">${title(a.level)} · Level ${a.level}${lg ? ` · ${esc(lg.name)}` : ''}</p>
          <button type="button" class="p2-lvbtn" data-p2="level" aria-label="Level ${a.level}: what's coming up"><span class="p2-xp"><i style="width:${pct}%"></i></span>
          <span class="muted small">${a.level >= D.MAX_ACCOUNT_LEVEL ? 'Maximum rank reached.' : `${fmt(a.xp)} / ${fmt(need)} XP to level ${a.level + 1}`} · <b class="p2-more">Coming up ›</b></span></button></div>
      </div>`;
    };
    const tabs = () => `<div class="pc-tabs p2-tabs" role="tablist">${[['overview', 'Overview'], ['collection', 'Collection'], ['worlds', 'Worlds'], ['badges', 'Badges'], ['friends', 'Friends'], ['stats', 'Stats']].map(([k, n]) => `<button type="button" role="tab" aria-selected="${tab === k}" class="${tab === k ? 'on' : ''}" data-p2t="${k}">${n}</button>`).join('')}</div>`;

    const overview = () => {
      const won = st.battlesWon, lost = st.battlesLost;
      const f = fav && use[fav];
      return `<div class="pc-tiles"><div><b>${a.level}</b><span>Level</span></div><div><b>${fmt(won)}</b><span>Battles won</span></div><div><b>${won + lost ? Math.round((won / (won + lost)) * 100) : 0}%</b><span>Win rate</span></div><div><b>${W.filter((w) => w.full).length}/${W.length}</b><span>Worlds freed</span></div></div>
        <h3 class="pc-h">Favorite card <small>most used</small></h3>
        ${fav ? `<div class="pc-fav"><div class="pt">${UI.portrait(D.UNIT_MAP[fav])}</div><div><h4>${esc(D.UNIT_MAP[fav].name)}</h4><div class="sub">${esc(D.RARITIES[D.UNIT_MAP[fav].rarity].label)} · Lv ${col[fav].level} · ${'★'.repeat(col[fav].stars)}</div>
          <div class="nums"><div><b>${fmt(f.b)}</b><span>battles</span></div><div><b>${f.b ? Math.round((f.w / f.b) * 100) : 0}%</b><span>win rate</span></div><div><b>${fmt(power(fav))}</b><span>power</span></div></div></div></div>` : '<p class="pc-empty">Play a few battles and your most-used card shows here.</p>'}
        <h3 class="pc-h">Strongest cards <small>by power</small></h3>
        <div class="pc-strong pc-grid">${strong.map(mini).join('')}</div>
        <h3 class="pc-h">Top badges <small>${done.length} of ${ach.length} earned</small></h3>
        <div class="p2-bdgs">${done.sort((x, y) => (y.tier || 1) - (x.tier || 1)).slice(0, 6).map(badge).join('') || '<p class="pc-empty">No badges yet.</p>'}</div>`;
    };

    const collection = () => {
      const inAll = all.filter((u) => col[u.id]).length;
      const bars = ['secret', 'mythic', 'legendary', 'epic', 'rare', 'common'].map((r) => {
        const tot = all.filter((u) => u.rarity === r).length;
        const have = all.filter((u) => u.rarity === r && col[u.id]).length;
        return tot ? `<div class="pc-bar" style="--c:${RCOL[r]}"><span style="color:${RCOL[r]}">${D.RARITIES[r].label}</span><i><b style="width:${(have / tot) * 100}%"></b></i><span>${have}/${tot}</span></div>` : '';
      }).join('');
      const ids = owned.filter((id) => !D.UNIT_MAP[id].hn && D.UNIT_MAP[id].kind === chip).sort((x, y) => power(y) - power(x));
      const missing = all.filter((u) => !col[u.id] && u.kind === chip && u.rarity !== 'secret');
      return `<div class="pc-bars"><div class="pc-total">${fmt(inAll)} <small>/ ${fmt(all.length)} cards · ${fmt(all.length - inAll)} still to find</small></div>${bars}</div>
        <div class="pc-chips">${[['character', 'Ground'], ['ship', 'Fleet']].map(([k, n]) => `<button type="button" class="${chip === k ? 'on' : ''}" data-p2k="${k}">${n}</button>`).join('')}</div>
        <div class="pc-grid">${ids.map(mini).join('')}</div>
        ${missing.length ? `<h3 class="pc-h">Still to find <small>${missing.length} ${chip === 'ship' ? 'ships' : 'characters'}</small></h3><div class="p2-miss">${missing.slice(0, 24).map((u) => `<span style="--c:${RCOL[u.rarity]}">${esc(u.name)}</span>`).join('')}${missing.length > 24 ? `<span>+${missing.length - 24} more</span>` : ''}</div>` : ''}`;
    };

    const worldsTab = () => `<p class="pc-empty">Clear every stage and beat every boss on a world to see it in full colour.</p>
      <div class="p2-worlds">${W.map((w) => `<div class="p2-world ${w.full ? 'full' : w.free ? 'half' : ''}" style="--pc:${w.p.color || '#ffd23f'}">
        <canvas data-p2w="${w.p.id}" width="96" height="96"></canvas>
        <b>${esc(w.p.name)}</b>
        <small>${w.full ? 'Liberated' : `Stages ${w.cleared}/${w.stages}${w.bosses ? ` · Bosses ${w.beat}/${w.bosses}` : ''}`}</small>
        <i><b style="width:${Math.round(((w.cleared + w.beat) / Math.max(1, w.stages + w.bosses)) * 100)}%"></b></i></div>`).join('')}</div>`;

    function badge(x) {
      const got = x.have >= x.need;
      const hidden = x.secret && !got;
      return `<button type="button" class="p2-bdg ${got ? 'got' : ''} ${x.secret ? 'sec' : ''}" data-p2b="${ach.indexOf(x)}">
        <span class="p2-bico">${hidden ? '<span class="p2-q">?</span>' : (UI.stillSvg || String)(UI.featBadge(x))}</span>
        <span class="p2-bn">${hidden ? 'Secret badge' : esc(x.name)}</span>
        ${got || hidden ? '' : `<i><b style="width:${Math.round((Math.min(x.have, x.need) / x.need) * 100)}%"></b></i>`}</button>`;
    }
    const badgesTab = () => {
      const open = ach.filter((x) => !x.secret), sec = ach.filter((x) => x.secret);
      return `<p class="pc-empty">${done.length} of ${ach.length} earned · tap one to see it, or how far along you are</p>
        <div class="p2-bdgs">${open.sort((x, y) => Number(y.have >= y.need) - Number(x.have >= x.need)).map(badge).join('')}</div>
        <h3 class="pc-h">Secret badges <small>${sec.filter((x) => x.have >= x.need).length}/${sec.length} found</small></h3>
        <div class="p2-bdgs">${sec.map(badge).join('')}</div>`;
    };

    const friendsTab = () => {
      const FR = root.Friends;
      if (!FR || !FR.unlocked()) return `<div class="p2-lock"><b>Friends unlock at level ${FR ? FR.LEVEL : 5}</b><p class="muted small">Add pilots by callsign, chat, and play friendly battles.</p></div>`;
      const F = root.HN && root.HN.friends && root.HN.friends.F;
      if (!F) return '<div class="p2-lock"><b>Friends</b><p class="muted small">Connecting to the HoloNet…</p><button type="button" class="btn btn-primary" data-p2="friends">Open Friends</button></div>';
      const list = F.friends();
      const inc = F.incoming().length;
      const FC = root.HN.fcard;
      // Friends' pictures load once, then the tab redraws with them.
      if (FC && !fetched) { fetched = true; FC.prefetch(() => { if (tab === 'friends' && card.isConnected) draw(); }); }
      const online = (uid) => F.online[uid] && Date.now() - F.online[uid].at < 150000;
      const sorted = list.slice().sort((x, y) => Number(online(F.other(y))) - Number(online(F.other(x))) || F.otherName(x).localeCompare(F.otherName(y)));
      const tile = (r) => {
        const uid = F.other(r);
        const c = FC && FC.card(uid);
        const n = F.unread(r.id);
        return `<button type="button" class="p2-fr" data-p2f="${esc(uid)}" data-p2fn="${esc(F.otherName(r))}"><span class="fa">${(FC && FC.pic(uid, F.otherName(r), 'md')) || esc(F.otherName(r).slice(0, 2).toUpperCase())}</span><b>${esc(F.otherName(r))}</b><small class="${online(uid) ? 'on' : ''}">${online(uid) ? 'Online' : c ? `Level ${c.lv | 0}` : 'Friend'}</small>${n ? `<i>${n > 9 ? '9+' : n}</i>` : ''}</button>`;
      };
      return `<div class="pc-tiles" style="grid-template-columns:repeat(3,minmax(0,1fr))"><div><b>${list.length}</b><span>Friends</span></div><div><b>${inc}</b><span>Requests</span></div><div><b>${list.reduce((n, r) => n + F.unread(r.id), 0)}</b><span>Unread</span></div></div>
        <p class="pc-empty">Tap a friend to see their profile.</p>
        <div class="p2-frs pics">${sorted.map(tile).join('') || '<p class="pc-empty">No friends yet. Add pilots by their callsign.</p>'}</div>
        <div class="modal-actions" style="justify-content:center"><button type="button" class="btn btn-primary" data-p2="friends">Open Friends${inc ? ` (${inc})` : ''}</button></div>`;
    };

    const stats = () => {
      const cell = (n, v) => `<div><span>${n}</span><b>${v}</b></div>`;
      const luck = s.luck;
      const hn = hnOn() && root.HN.S ? root.HN.S() : null;
      return `<div class="pc-stats">${cell('Battles won', fmt(st.battlesWon))}${cell('Battles lost', fmt(st.battlesLost))}${cell('Cards collected', `${owned.length}/${D.UNITS.length}`)}${cell('Bosses defeated', `${Object.keys(s.bosses).length}/${D.BOSS_ENCOUNTERS.length}`)}${cell('Best tower floor', s.tower.best || 0)}${cell('Crates opened', fmt(st.packsOpened))}${cell('Mythics pulled', st.mythics || 0)}${cell('Holo cards', st.holos || 0)}${cell('Best luck spin', `${st.bestSpin}×`)}${cell('Legendary pity', `${luck.pity}/${D.LUCK.pityCrates}`)}
        ${hn ? `${cell('HoloNet rating', fmt(hn.rating))}${cell('Arena W–L', `${fmt(hn.wins || 0)}–${fmt(hn.losses || 0)}`)}` : ''}</div>
        ${hn ? '' : '<p class="pc-empty" style="margin-top:8px">HoloNet stats (rating, league, arena) appear here once you unlock the HoloNet at level 25.</p>'}`;
    };

    // Tapping the level ring or XP bar: your level, the next rewards and what's coming up.
    const levelInfo = () => {
      const r = D.levelReward(a.level + 1);
      const ranks = [[6, 'Commander'], [15, 'General'], [30, 'Fleet Admiral'], [D.MAX_ACCOUNT_LEVEL, 'Grand Master']].filter(([lv]) => lv > a.level);
      const lm = openModal(`<div class="p2-lv"><div class="acct-ring big" style="--p:${pct}"><b>${a.level}</b><span>Level</span></div>
        <h3>${title(a.level)} · Level ${a.level}</h3>
        <p class="muted small">${a.level >= D.MAX_ACCOUNT_LEVEL ? 'Maximum rank reached.' : `${fmt(a.xp)} / ${fmt(need)} XP to level ${a.level + 1}. Level ${a.level + 1} pays ${fmt(r.credits)} credits${r.crystals ? ` and ${r.crystals} Kyber` : ''}.`}</p>
        ${ranks.length ? `<p class="small">Next rank: <b>${ranks[0][1]}</b> at level ${ranks[0][0]}</p>` : ''}
        <h4>Coming up</h4>
        ${next.length ? `<div class="p2-next">${next.map((lv) => unlockAt[lv].map((t) => `<div><b>Level ${lv}</b><span><em>${esc(t.name)}</em> ${esc(t.desc)}</span></div>`).join('')).join('')}</div>` : '<p class="muted small">You\'ve unlocked everything. Keep climbing for rewards.</p>'}
        <div class="modal-actions"><button type="button" class="btn btn-primary" data-close>Got it</button></div></div>`, { small: true, cls: 'p2-lv-modal' });
      lm.root.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) lm.close(); });
    };
    const body = () => `${head()}${tabs()}<div data-p2body>${({ overview, collection, worlds: worldsTab, badges: badgesTab, friends: friendsTab, stats })[tab]()}</div>`;
    const m = openModal(`<div class="pf-card pc-card p2-card">${body()}</div>`, { small: true, cls: 'pf-modal p2-modal' });
    const card = m.root.querySelector('.p2-card');
    const draw = () => {
      card.innerHTML = body();
      card.querySelectorAll('[data-p2w]').forEach((c) => { if (root.drawPlanetSphere) root.drawPlanetSphere(c.getContext('2d'), 48, 48, 34, c.dataset.p2w, 1.2, { halo: 0.4 }); });
    };
    draw();
    m.root.addEventListener('click', (e) => {
      const t = e.target.closest('[data-p2t]');
      if (t) { tab = t.dataset.p2t; return draw(); }
      const k = e.target.closest('[data-p2k]');
      if (k) { chip = k.dataset.p2k; return draw(); }
      const c = e.target.closest('[data-p2c]');
      if (c) return UI.inspect(c.dataset.p2c);
      const b = e.target.closest('[data-p2b]');
      if (b) {
        const x = ach[+b.dataset.p2b];
        if (x.secret && x.have < x.need) return toast('A secret badge. How to earn it stays a secret.');
        return UI.badgePeek(x);
      }
      const fp = e.target.closest('[data-p2f]');
      if (fp && root.HN && root.HN.fcard) return root.HN.fcard.open(fp.dataset.p2f, fp.dataset.p2fn);
      const x = e.target.closest('[data-p2]');
      if (!x) return;
      if (x.dataset.p2 === 'close') return m.close();
      if (x.dataset.p2 === 'level') return levelInfo();
      // No profile yet: make one (callsign and picture). The button stays until you do.
      if (x.dataset.p2 === 'addprof') { m.close(); if (root.Account && root.Account.profile) root.Account.profile(() => open(), false); return; }
      if (x.dataset.p2 === 'pic' && root.RexGuide && root.RexGuide.active && root.RexGuide.active()) return toast('Finish Captain Rex\'s tour first, then tap your picture to change it.');
      if (x.dataset.p2 === 'pic') { m.close(); if (root.Account && root.Account.profile) root.Account.profile(() => open(), true); return; }
      if (x.dataset.p2 === 'friends') { m.close(); if (root.Friends) root.Friends.open(); }
    });
    return m;
  }

  const preview = (v) => { try { if (v === undefined) return localStorage.getItem(PREVIEW) === '1'; if (v) localStorage.setItem(PREVIEW, '1'); else localStorage.removeItem(PREVIEW); } catch (e) { /* ignore */ } return !!v; };
  root.ProfileV2 = { open, preview, worlds };
  // Preview switch: the level chip opens the new profile on this device.
  const base = UI.profile;
  if (base && !UI.__p2) {
    UI.__p2 = true;
    // Switches on for everyone with 2.2 (testers earlier with the HOLOSAVE21 code).
    UI.profile = function () { return preview() || (root.Update22 && (root.Update22.friends || root.Update22.on)()) ? open() : base.apply(this, arguments); };
  }

  const st = document.createElement('style');
  st.textContent = `.modal.p2-modal { width: min(720px, 100%); }
.p2-top { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 14px; align-items: center; padding: 14px; border-radius: 16px; border: 1px solid rgba(95, 216, 255, 0.35); background: linear-gradient(135deg, rgba(95, 216, 255, 0.12), rgba(176, 112, 255, 0.08)); }
.p2-av { position: relative; width: 84px; height: 84px; }
.p2-pic { position: relative; width: 84px; height: 84px; padding: 0; border-radius: 50%; overflow: hidden; border: 3px solid #ffd23f; box-shadow: 0 0 16px rgba(255, 210, 63, 0.35); background: #0b1422; cursor: pointer; }
.p2-pic { overflow: visible; }
.p2-face { position: absolute; inset: 0; border-radius: 50%; overflow: hidden; display: block; }
.p2-edit { position: absolute; left: -4px; top: -4px; width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; background: #5fd8ff; color: #04121c; box-shadow: 0 0 0 2px #0a1220; }
.p2-edit svg { width: 14px !important; height: 14px !important; }
.p2-card { position: relative; }
.p2-card > .p2-x { position: absolute; top: 8px; right: 8px; float: none; margin: 0; z-index: 4; }
.p2-top { padding-right: 46px; }
.p2-card .ucard { width: 100%; min-width: 0; font-size: 11px; }
.p2-card .ucard:hover { transform: none; }
.p2-card .ucard-body { padding: 7px 8px 9px; gap: 3px; min-width: 0; }
.p2-card .ucard-name { font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.p2-card .ucard-meta { min-width: 0; font-size: 10.5px; flex-wrap: nowrap; } .p2-card .ucard-meta > * { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.p2-card .ucard-meta { gap: 4px; } .p2-card .ucard-meta > :last-child { flex: none; overflow: visible; }
.p2-card .ucard-meta .rar { font-size: 8.5px; letter-spacing: 0; }
.p2-ring { border: 0; padding: 0; cursor: pointer; }
.p2-lvbtn { display: grid; gap: 3px; width: 100%; padding: 0; margin-top: 4px; border: 0; background: none; color: inherit; text-align: left; cursor: pointer; }
.p2-more { color: #ffd23f; }
.p2-addprof { margin: 4px 0 2px; }
.p2-lv { display: grid; justify-items: center; gap: 6px; text-align: center; } .p2-lv h3 { margin: 4px 0 0; } .p2-lv h4 { margin: 8px 0 0; letter-spacing: .08em; text-transform: uppercase; font-size: 12px; color: #8fb4c8; } .p2-lv .p2-next { width: 100%; text-align: left; }
.p2-pic svg, .p2-pic img { width: 100%; height: 100%; display: block; object-fit: cover; }
.p2-ring { position: absolute; right: -8px; bottom: -6px; width: 38px; height: 38px; }
.p2-ring b { font-size: 14px; }
.p2-id { min-width: 0; text-align: left; } .p2-id h2 { margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: clamp(20px, 5vw, 28px); } .p2-id .eyebrow { margin: 0; } .p2-id .small { margin: 2px 0 0; }
.p2-xp { height: 7px; border-radius: 4px; background: #1b2436; overflow: hidden; margin-top: 6px; } .p2-xp i { display: block; height: 100%; background: linear-gradient(90deg, #ffd23f, #ff9a3a); }
.p2-tabs { grid-template-columns: repeat(6, minmax(0, 1fr)); } .p2-tabs button { font-size: 12px; padding: 8px 2px; }
@media (max-width: 480px) { .p2-tabs { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.p2-next { display: grid; gap: 6px; } .p2-next div { display: grid; grid-template-columns: 70px 1fr; gap: 8px; padding: 8px 10px; border-radius: 10px; border: 1px solid var(--line); background: rgba(255, 255, 255, 0.03); font-size: 12.5px; } .p2-next b { color: #ffd23f; } .p2-next em { font-style: normal; font-weight: 700; }
.p2-bico *, .p2-bico *::before, .p2-bico *::after { animation: none !important; transition: none !important; }
.p2-bdg { content-visibility: auto; contain-intrinsic-size: auto 96px; }
.p2-bdgs { display: grid; grid-template-columns: repeat(auto-fill, minmax(92px, 1fr)); gap: 6px; }
.p2-bdg { display: grid; justify-items: center; gap: 4px; padding: 8px 4px; border-radius: 12px; border: 1px solid rgba(95, 216, 255, 0.15); background: rgba(8, 20, 32, 0.8); color: #dff8ff; cursor: pointer; font: 600 11px var(--font-body, system-ui); text-align: center; }
.p2-bdg:not(.got) .p2-bico { filter: grayscale(1) brightness(0.55); }
.p2-bdg.sec { border-color: rgba(61, 255, 200, 0.4); }
.p2-bico { width: 52px; height: 52px; display: grid; place-items: center; overflow: hidden; } .p2-bico > *, .p2-bico .fs-badge { width: 52px !important; height: 52px !important; max-width: 52px; } .p2-bico svg { width: 100%; height: 100%; }
.p2-q { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; border: 2px dashed rgba(61, 255, 200, 0.6); color: #3dffc8; font: 800 22px var(--font-display, system-ui); }
.p2-bn { font-size: 10px; line-height: 1.15; }
.p2-bdg i, .p2-world i { display: block; width: 80%; height: 4px; border-radius: 2px; background: #1b2436; overflow: hidden; } .p2-bdg i b, .p2-world i b { display: block; height: 100%; background: #5fd8ff; }
.p2-worlds { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 8px; }
.p2-world { display: grid; justify-items: center; gap: 3px; padding: 10px 6px; border-radius: 14px; border: 1px solid var(--line); background: rgba(255, 255, 255, 0.03); text-align: center; }
.p2-world canvas { width: 72px; height: 72px; filter: grayscale(1) brightness(0.6); transition: filter .4s; }
.p2-world.half canvas { filter: grayscale(0.55) brightness(0.85); }
.p2-world.full { border-color: var(--pc); background: radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--pc) 22%, transparent), rgba(255, 255, 255, 0.02) 70%); }
.p2-world.full canvas { filter: none; } .p2-world.full small { color: var(--pc); font-weight: 700; }
.p2-world b { font-size: 13px; } .p2-world small { font-size: 11px; color: var(--muted); }
.p2-miss { display: flex; flex-wrap: wrap; gap: 5px; } .p2-miss span { padding: 4px 9px; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--c, #8fb4c8) 55%, transparent); color: var(--muted); font-size: 11.5px; }
.p2-lock { display: grid; justify-items: center; gap: 6px; padding: 22px 10px; text-align: center; border: 1px dashed var(--line); border-radius: 14px; }
.p2-frs { display: grid; gap: 6px; margin-top: 10px; }`;
  document.head.appendChild(st);
})(window);
