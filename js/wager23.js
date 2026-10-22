// Wager duels (update 2.3): a ranked live duel with credits on the line.
//
// Unlocks for the rest of a season once you reach Silver III in it (a new
// season locks it again). After both bans, the two players get 45 seconds to
// agree a stake (1,000 to 100,000 credits, never more than either of them
// has): offer, counter, accept, and chat with no slow-down. Both wagers come
// out the moment the deal is struck, so leaving can't save them. The winner
// takes both, minus a 10% house tax that leaves the game; a draw hands each
// wager back. No deal in time and the match is called off. Rating counts like
// any ranked duel. At most 5 wager duels a day against the same pilot.
//
// The challenger's game keeps the clock and announces the deal, so both
// screens always agree on the stake.
(function (root) {
  'use strict';
  const UI = root.UI;
  if (!UI) return;
  const { esc, fmt, openModal, toast } = UI;
  const P = () => root.Player;
  const MIN = 1000;
  const MAX = 100000;
  const TAX = 0.1;
  const DEAL_MS = 45000;
  const DAILY = 5;
  const ESCROW = 'swcg-wager';
  let HN = null;

  const on = () => !!((root.Update23 && root.Update23.on && root.Update23.on()) || root.__wgTest);
  const needDiv = () => (HN && HN.DIVS ? HN.DIVS.find((d) => d.key === 'silver3') : null) || { name: 'Silver III', min: 1350 };
  const seasonNo = () => (HN && HN.seasonInfo ? HN.seasonInfo().no : 0);
  // Reaching Silver III opens wagers for the rest of that season.
  function unlocked() {
    if (!on() || !HN || !HN.ui || !HN.ui.unlocked()) return false;
    const h = HN.S();
    const no = seasonNo();
    if (h.rating >= needDiv().min && h.wgs !== no) { h.wgs = no; HN.save(); }
    return h.wgs === no;
  }
  const credits = () => P().state.credits | 0;
  const ready = () => unlocked() && credits() >= MIN;
  const day = () => Math.floor(Date.now() / 86400000);
  function todayWith(uid) {
    const h = HN.S();
    if (!h.wgd || h.wgd.day !== day()) h.wgd = { day: day(), n: {} };
    return h.wgd.n[uid] || 0;
  }
  function bump(uid) { todayWith(uid); const h = HN.S(); h.wgd.n[uid] = (h.wgd.n[uid] || 0) + 1; HN.save(); }
  function canStart(uid) {
    if (!unlocked()) { toast(`Wager duels open once you reach ${needDiv().name} this season.`); return false; }
    if (credits() < MIN) { toast(`You need at least ${fmt(MIN)} credits to wager.`); return false; }
    if (todayWith(uid) >= DAILY) { toast(`That's ${DAILY} wager duels with this pilot today. Try again tomorrow.`); return false; }
    return true;
  }
  const canAccept = (uid) => ready() && todayWith(uid) < DAILY;

  // ---------- escrow and payout ----------
  function hold(id, amt, who) {
    const s = P().state;
    s.credits = Math.max(0, (s.credits | 0) - amt);
    P().save();
    UI.updateWallet();
    try { localStorage.setItem(ESCROW, JSON.stringify({ id, amt, who, at: Date.now() })); } catch (e) { /* ignore */ }
  }
  function release() { try { localStorage.removeItem(ESCROW); } catch (e) { /* ignore */ } }
  const pay = (n) => { if (n > 0) { P().state.credits = (P().state.credits | 0) + n; P().save(); UI.updateWallet(); if (root.Sound) root.Sound.play('coins'); } };
  // Settles a finished wager: won, lost or draw. Returns the numbers for the result screen.
  function settle(M, how) {
    if (!M || !M.wager || M.wagerDone) return M && M.wagerDone;
    const amt = M.wager | 0;
    const pot = amt * 2;
    const tax = Math.round(pot * TAX);
    const res = { amt, pot, tax, how, win: how === 'won' ? pot - tax : how === 'draw' ? amt : 0 };
    pay(res.win);
    release();
    M.wagerDone = res;
    return res;
  }
  const rows = (r) => `<div class="wg-pot"><div><span>Your wager</span><b>${fmt(r.amt)}</b></div><div><span>Their wager</span><b>${fmt(r.amt)}</b></div>
    ${r.how === 'draw' ? '<div class="tot"><span>Draw: wagers returned</span><b>+' + fmt(r.amt) + '</b></div>' : `<div><span>House tax (10%)</span><b>−${fmt(r.tax)}</b></div><div class="tot ${r.how === 'won' ? '' : 'lost'}"><span>${r.how === 'won' ? 'You win' : 'You lost'}</span><b>${r.how === 'won' ? fmt(r.win) : fmt(r.amt)}</b></div>`}</div>
    ${r.how === 'won' ? `<p class="wg-net">Net gain +${fmt(r.win - r.amt)} credits</p>` : ''}`;
  // The deal was struck but the battle never began: whoever left loses their wager to the other.
  function prepEnded(Pp) {
    if (Pp.iLeft) { release(); return; }
    const amt = Pp.wager | 0;
    const win = amt * 2 - Math.round(amt * 2 * TAX);
    pay(win);
    release();
    setTimeout(() => toast(`${Pp.who} left after the wager was set. You win ${fmt(win)} credits.`), 600);
  }

  // ---------- the deal table ----------
  const cleanLine = (t) => { const c = HN.safe.clean(String(t || '').slice(0, 60)); return c.blocked ? '' : c.text.trim(); };
  const short = (n) => (n >= 1000 ? `${n % 1000 ? (n / 1000).toFixed(1) : n / 1000}K` : String(n));
  function table(Pp, api) {
    api.closeWait(Pp);
    const W = Pp.wgs = { cap: 0, mine: Math.min(credits(), MAX), theirs: 0, offer: null, myLock: 0, theirLock: 0, chat: [], end: Date.now() + DEAL_MS, dealt: false, pick: 0 };
    api.say(Pp, { act: 'hi', bal: W.mine });
    const m = openModal(`<div class="wg"><div class="wg-top"><div class="p"><b>You</b><small>${fmt(credits())} credits</small></div><span class="wg-timer" data-wg="ring"><b data-wg="secs">45</b></span><div class="p"><b>${esc(Pp.who)}</b><small data-wg="their">connecting…</small></div></div>
      <div data-wg="body"></div>
      <div class="wg-chat"><div class="wg-log" data-wg="log"><p class="muted small">Talk it out: chat is filtered for bad language.</p></div>
      <form class="wg-form" data-wg="form"><input type="text" maxlength="60" placeholder="Say something…" autocomplete="off" data-wg="in" aria-label="Chat"><button type="submit" class="btn">Send</button></form></div>
      <div class="wg-foot"><button type="button" class="btn" data-wgx="leave">Leave duel</button></div></div>`, { small: true, dismissable: false, cls: 'wg-modal' });
    Pp.ui = m;
    const $ = (k) => m.root.querySelector(`[data-wg="${k}"]`);
    const cap = () => Math.max(0, Math.floor(Math.min(W.mine, W.theirs || 0, MAX) / 1000) * 1000);
    const drawBody = () => {
      const c = cap();
      if (!W.theirs) { $('body').innerHTML = '<p class="wg-wait"><span class="ho-spin"></span> Waiting for their balance…</p>'; return; }
      if (c < MIN) { $('body').innerHTML = `<p class="wg-wait">One of you has less than ${fmt(MIN)} credits, so this wager can't happen.</p>`; return; }
      if (!W.pick) W.pick = Math.min(c, Math.max(MIN, Math.round(c / 4 / 1000) * 1000));
      W.pick = Math.min(W.pick, c);
      const o = W.offer;
      const theirsOpen = o && o.by === 'them';
      const quick = [5000, 10000, 50000, 100000].filter((n) => n <= c);
      $('body').innerHTML = `<div class="wg-offer ${o ? '' : 'none'}"><small>${o ? (o.by === 'me' ? 'Your offer' : `${esc(Pp.who)} offers`) : 'No offer yet'}</small><b>${o ? fmt(o.amt) : '—'}</b><small>Max this match: ${fmt(c)} · winner takes both, minus 10%</small></div>
        <div class="wg-pick"><input type="range" min="${MIN}" max="${c}" step="1000" value="${W.pick}" data-wg="range" aria-label="Wager amount"><b data-wg="pickv">${fmt(W.pick)}</b></div>
        <div class="wg-quick">${quick.map((n) => `<button type="button" class="${W.pick === n ? 'on' : ''}" data-wgq="${n}">${short(n)}</button>`).join('')}${quick.includes(c) ? '' : `<button type="button" class="${W.pick === c ? 'on' : ''}" data-wgq="${c}">Max</button>`}</div>
        <div class="wg-acts">${theirsOpen ? `<button type="button" class="btn" data-wgx="offer">Counter ${short(W.pick)}</button><button type="button" class="btn btn-primary" data-wgx="accept" ${W.myLock === o.amt ? 'disabled' : ''}>${W.myLock === o.amt ? 'Locked in ✓' : `Accept ${short(o.amt)}`}</button>` : `<button type="button" class="btn btn-primary wide" data-wgx="offer" ${o && o.by === 'me' && o.amt === W.pick ? 'disabled' : ''}>${o && o.by === 'me' ? (o.amt === W.pick ? 'Offer sent · waiting' : `Change offer to ${short(W.pick)}`) : `Offer ${short(W.pick)}`}</button>`}</div>
        <div class="wg-locks"><span class="${W.myLock ? 'ok' : ''}">You: ${W.myLock ? `locked ${short(W.myLock)} ✓` : 'deciding…'}</span><span class="${W.theirLock ? 'ok' : ''}">${esc(Pp.who)}: ${W.theirLock ? `locked ${short(W.theirLock)} ✓` : 'deciding…'}</span></div>`;
    };
    const tick = () => {
      if (W.dealt || !api.live(Pp)) return;
      const left = Math.max(0, W.end - Date.now());
      const secs = Math.ceil(left / 1000);
      const s = $('secs');
      if (s) s.textContent = secs;
      const ring = $('ring');
      if (ring) { ring.style.setProperty('--p', (left / DEAL_MS) * 100); ring.classList.toggle('low', secs <= 10); }
      if (left <= 0) {
        // The challenger's clock decides; the other side waits a moment for the word.
        if (Pp.host) { api.say(Pp, { act: 'nodeal' }); return noDeal(); }
        if (left <= -8000) return noDeal();
      }
      W.timer = setTimeout(tick, 250);
    };
    function noDeal() {
      if (W.dealt) return;
      W.dealt = true;
      clearTimeout(W.timer);
      api.endPrep(Pp, 'No deal in 45 seconds, so the wager duel was called off.');
    }
    function deal(amt) {
      if (W.dealt) return;
      if (credits() < amt) { W.dealt = true; clearTimeout(W.timer); return api.leave(Pp, 'You no longer have enough credits for that wager.'); }
      W.dealt = true;
      clearTimeout(W.timer);
      Pp.wager = amt;
      hold(Pp.id, amt, Pp.by);
      bump(Pp.by);
      if (root.Sound) root.Sound.play('coins');
      toast(`Wager set: ${fmt(amt)} credits each. Build your squad!`);
      m.close();
      Pp.ui = null;
      api.build(Pp);
    }
    // The challenger strikes the deal once both have locked the same amount.
    const check = () => {
      if (Pp.host && W.myLock && W.myLock === W.theirLock && W.myLock <= cap()) { api.say(Pp, { act: 'deal', amt: W.myLock }); deal(W.myLock); }
    };
    const addLine = (who, x) => {
      W.chat.push({ who, x });
      const log = $('log');
      if (!log) return;
      if (W.chat.length === 1) log.innerHTML = '';
      const p = document.createElement('p');
      p.className = who === 'me' ? 'me' : '';
      p.innerHTML = `<span>${esc(x)}</span>`;
      log.appendChild(p);
      while (log.children.length > 30) log.removeChild(log.firstChild);
      log.scrollTop = log.scrollHeight;
    };
    W.recv = (d) => {
      if (W.dealt) return;
      const a = d.act;
      if (a === 'hi') {
        W.theirs = Math.max(0, Math.min(MAX, d.bal | 0));
        const t = $('their');
        if (t) t.textContent = `can wager ${fmt(W.theirs)}`;
        return drawBody();
      }
      if (a === 'offer') {
        const amt = d.amt | 0;
        if (amt < MIN || amt > cap() || amt % 1000) return;
        W.offer = { amt, by: 'them' };
        W.theirLock = amt;
        W.myLock = 0;
        W.pick = amt;
        if (root.Sound) root.Sound.play('click');
        drawBody();
        return check();
      }
      if (a === 'lock') {
        const amt = d.amt | 0;
        if (!W.offer || amt !== W.offer.amt) return;
        W.theirLock = amt;
        drawBody();
        return check();
      }
      if (a === 'deal') { if (!Pp.host) { const amt = d.amt | 0; if (amt >= MIN && amt <= cap()) deal(amt); else api.leave(Pp, 'The wager didn\'t match, so the duel was called off.'); } return; }
      if (a === 'nodeal') { if (!Pp.host) noDeal(); return; }
      if (a === 'chat') { const x = cleanLine(d.x); if (x) addLine('them', x); }
    };
    m.root.addEventListener('input', (e) => {
      if (!e.target.matches('[data-wg="range"]')) return;
      W.pick = +e.target.value;
      const v = $('pickv');
      if (v) v.textContent = fmt(W.pick);
      m.root.querySelectorAll('[data-wgq]').forEach((b) => b.classList.toggle('on', +b.dataset.wgq === W.pick));
      const ob = m.root.querySelector('[data-wgx="offer"]');
      if (ob) { const o = W.offer; ob.disabled = !!(o && o.by === 'me' && o.amt === W.pick); ob.textContent = o && o.by === 'them' ? `Counter ${short(W.pick)}` : o && o.by === 'me' ? (o.amt === W.pick ? 'Offer sent · waiting' : `Change offer to ${short(W.pick)}`) : `Offer ${short(W.pick)}`; }
    });
    m.root.addEventListener('change', (e) => { if (e.target.matches('[data-wg="range"]')) drawBody(); });
    m.root.addEventListener('click', (e) => {
      const q = e.target.closest('[data-wgq]');
      if (q) { W.pick = +q.dataset.wgq; return drawBody(); }
      const b = e.target.closest('[data-wgx]');
      if (!b || b.disabled || W.dealt) return;
      const a = b.dataset.wgx;
      if (a === 'leave') { W.dealt = true; clearTimeout(W.timer); return api.leave(Pp, 'You left the duel.'); }
      if (a === 'offer') {
        const amt = Math.min(cap(), Math.max(MIN, W.pick));
        W.offer = { amt, by: 'me' };
        W.myLock = amt;
        W.theirLock = 0;
        api.say(Pp, { act: 'offer', amt });
        if (root.Sound) root.Sound.play('click');
        return drawBody();
      }
      if (a === 'accept' && W.offer && W.offer.by === 'them') {
        W.myLock = W.offer.amt;
        api.say(Pp, { act: 'lock', amt: W.myLock });
        if (root.Sound) root.Sound.play('click');
        drawBody();
        return check();
      }
    });
    m.root.querySelector('[data-wg="form"]').addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = $('in');
      const x = cleanLine(inp.value);
      if (!x) { if (inp.value.trim()) toast('That message can\'t be sent.'); return; }
      inp.value = '';
      addLine('me', x);
      api.say(Pp, { act: 'chat', x });
    });
    drawBody();
    tick();
    return m;
  }
  // Messages that arrive before my table is open wait for it.
  function msg(Pp, d) {
    if (Pp.wgs && Pp.wgs.recv) return Pp.wgs.recv(d);
    (Pp.wgq = Pp.wgq || []).push(d);
  }
  const tableAndFlush = (Pp, api) => { const m = table(Pp, api); for (const d of Pp.wgq || []) Pp.wgs.recv(d); Pp.wgq = []; return m; };

  // ---------- the lobby tab ----------
  function lobby(list, off, connected, tried) {
    const need = needDiv();
    const h = HN.S();
    if (!unlocked()) {
      const pct = Math.max(0, Math.min(100, Math.round(((h.rating - 800) / Math.max(1, need.min - 800)) * 100)));
      return `<div class="wg-lock"><b>Reach ${esc(need.name)} this season</b><p>Wager duels open for the rest of the season once you get there. A new season locks them again.</p><i><b style="width:${pct}%"></b></i><span>${esc(HN.divOf(h.rating).name)} · ${fmt(h.rating)} / ${fmt(need.min)} rating</span></div>
        <p class="muted small" style="text-align:center">Wager 1,000 to 100,000 credits on a ranked duel. Winner takes both, minus a 10% house tax.</p>`;
    }
    const rules = `<p class="muted" style="margin:0">Challenge a player who's online now. After bans you both have 45 seconds to agree a stake: ${fmt(MIN)} to ${fmt(MAX)} credits, never more than either of you has. The winner takes both wagers minus a 10% house tax. Rating counts like any ranked duel, and leaving counts as a loss. Up to ${DAILY} wager duels a day with the same pilot.</p>`;
    if (credits() < MIN) return `${rules}<div class="hn-free"><span class="grow"><b>You need ${fmt(MIN)} credits to wager.</b> You have ${fmt(credits())}.</span></div>`;
    const body = off ? '<div class="hn-free"><span class="grow"><b>You\'re offline.</b> Wager duels need an internet connection.</span></div>'
      : !connected ? `<div class="hn-free"><span class="grow">${tried ? '<b>Live Duels can\'t connect.</b> Check your internet connection.' : 'Connecting…'}</span></div>`
        : list.length ? `<div class="hn-opps">${list.map((p) => {
          const pr = p.presence || {};
          const d = HN.divOf(pr.rating || 800);
          const ok = pr.wg && !pr.busy && todayWith(p.by) < DAILY;
          const why = pr.busy ? 'IN A DUEL' : !pr.wg ? 'NO WAGERS' : todayWith(p.by) >= DAILY ? 'DONE TODAY' : 'READY';
          return `<div class="hn-opp"><div>${root.HNArt.badge(d.league, d.div)}</div>
          <div class="who">${HN.chip && p.by ? HN.chip(p.by) : `<b>${esc(p.presence && p.presence.nm || 'Pilot')}</b>`}<span class="tag" style="background:${ok ? '#7a5a10' : '#3a4450'}">${why}</span><small>${esc(d.name)} · ${fmt(pr.rating || 0)}</small></div>
          <div class="go"><button type="button" class="hn-btn wg-go" data-hn="duelgo" data-wg="1" data-peer="${esc(p.peer)}" data-kind="character" ${ok ? '' : 'disabled'}>Ground</button><button type="button" class="hn-btn wg-go" data-hn="duelgo" data-wg="1" data-peer="${esc(p.peer)}" data-kind="ship" ${ok ? '' : 'disabled'}>Fleet</button></div></div>`;
        }).join('')}</div>`
          : '<div class="hn-free"><span class="grow"><b>Nobody else is in the HoloNet right now.</b> When another player opens it, they\'ll show up here live.</span></div>';
    return `${rules}<div class="wg-bal">Your credits: <b>${fmt(credits())}</b></div>${body}`;
  }

  function init() {
    if (HN || !root.HN || !root.HN.Duel) return;
    HN = root.HN;
    HN.Wager = { on, unlocked, ready, canStart, canAccept, table: tableAndFlush, msg, settle, rows, prepEnded, lobby, MIN, MAX, TAX, DAILY };
    // A wager left hanging by a closed tab or crash is a loss; clear the note.
    try { const e = JSON.parse(localStorage.getItem(ESCROW) || 'null'); if (e && Date.now() - e.at > 30 * 60000) release(); } catch (e) { /* ignore */ }
  }
  if (root.HN && root.HN.Duel) init(); else root.addEventListener('hn-ready', init);

  const st = document.createElement('style');
  st.textContent = `.modal.wg-modal { width: min(520px, 100%); }
.wg { display: grid; gap: 12px; }
.wg-top { display: grid; grid-template-columns: 1fr auto 1fr; gap: 10px; align-items: center; text-align: center; }
.wg-top .p b { display: block; font: 700 15px var(--font-display, inherit); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .wg-top .p small { color: #8fb4c8; font-size: 12px; }
.wg-timer { --p: 100; width: 66px; height: 66px; border-radius: 50%; display: grid; place-items: center; position: relative; background: conic-gradient(#ffd23f calc(var(--p) * 1%), #1b2436 0); }
.wg-timer::before { content: ''; position: absolute; inset: 5px; border-radius: 50%; background: #0a1220; }
.wg-timer b { position: relative; font: 800 22px var(--font-display, inherit); color: #ffd23f; font-variant-numeric: tabular-nums; }
.wg-timer.low { background: conic-gradient(#ff5a4a calc(var(--p) * 1%), #1b2436 0); } .wg-timer.low b { color: #ff7a6a; }
.wg-offer { display: grid; gap: 4px; text-align: center; padding: 12px; border-radius: 14px; background: rgba(8, 20, 32, 0.85); border: 1px solid rgba(255, 210, 63, 0.4); }
.wg-offer b { font: 800 34px var(--font-display, inherit); color: #ffd23f; font-variant-numeric: tabular-nums; } .wg-offer.none b { color: #5a6a7a; } .wg-offer small { color: #8fb4c8; font-size: 12px; }
.wg-pick { display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: center; } .wg-pick b { font: 700 15px var(--font-display, inherit); min-width: 74px; text-align: right; font-variant-numeric: tabular-nums; }
.wg-pick input[type=range] { width: 100%; accent-color: #ffd23f; height: 28px; }
.wg-quick { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; } .wg-quick button { flex: 1 1 60px; padding: 8px 4px; border-radius: 10px; border: 1px solid rgba(95, 216, 255, 0.25); background: #13213a; color: #e8f6ff; font: 700 12px var(--font-display, inherit); cursor: pointer; } .wg-quick button.on { border-color: #ffd23f; color: #ffd23f; }
.wg-acts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; } .wg-acts .btn { padding: 13px 8px; font-size: 15px; width: 100%; } .wg-acts .btn.wide { grid-column: 1 / -1; }
.wg-locks { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 12px; text-align: center; } .wg-locks span { padding: 6px; border-radius: 9px; background: rgba(8, 20, 32, 0.8); border: 1px solid rgba(95, 216, 255, 0.2); color: #8fb4c8; } .wg-locks span.ok { color: #7af0a0; border-color: rgba(122, 240, 160, 0.45); }
.wg-wait { text-align: center; color: #cfe6f5; margin: 6px 0; }
.wg-chat { display: grid; gap: 6px; } .wg-log { display: grid; gap: 5px; align-content: start; max-height: 120px; min-height: 60px; overflow-y: auto; padding: 8px; border-radius: 12px; background: rgba(4, 12, 20, 0.85); border: 1px solid rgba(95, 216, 255, 0.2); }
.wg-log p { margin: 0; display: flex; } .wg-log p.me { justify-content: flex-end; } .wg-log p span { max-width: 80%; padding: 5px 10px; border-radius: 12px 12px 12px 4px; background: #13263a; font-size: 13px; overflow-wrap: anywhere; } .wg-log p.me span { border-radius: 12px 12px 4px 12px; background: #1d6fa8; }
.wg-form { display: grid; grid-template-columns: 1fr auto; gap: 6px; } .wg-form input { min-width: 0; padding: 9px 10px; border-radius: 10px; border: 1px solid rgba(95, 216, 255, 0.35); background: #06121e; color: #e8f6ff; font: inherit; }
.wg-foot { display: flex; justify-content: center; }
.wg-pot { display: grid; gap: 5px; padding: 12px; border-radius: 12px; background: rgba(8, 20, 32, 0.85); border: 1px solid rgba(255, 210, 63, 0.3); font-size: 14px; margin: 6px 0; }
.wg-pot div { display: flex; justify-content: space-between; font-variant-numeric: tabular-nums; } .wg-pot .tot { border-top: 1px solid rgba(255, 210, 63, 0.3); padding-top: 6px; font: 800 16px var(--font-display, inherit); color: #ffd23f; } .wg-pot .tot.lost { color: #ff7a7a; }
.wg-net { text-align: center; color: #7af0a0; font-weight: 700; margin: 0; }
.dw-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 4px 0 10px; } .dw-tabs button { padding: 10px; border-radius: 12px; border: 1px solid rgba(95, 216, 255, 0.25); background: rgba(8, 20, 32, 0.8); color: #8fb4c8; font: 700 13px var(--font-display, inherit); letter-spacing: .08em; text-transform: uppercase; cursor: pointer; } .dw-tabs button.on { color: #ffd23f; border-color: rgba(255, 210, 63, 0.55); background: linear-gradient(180deg, #3a2a08, #1e1606); }
.wg-lock { display: grid; gap: 8px; justify-items: center; text-align: center; padding: 22px 14px; border-radius: 16px; border: 1px dashed rgba(95, 216, 255, 0.35); } .wg-lock b { font: 700 18px var(--font-display, inherit); color: #ffd23f; } .wg-lock p { margin: 0; color: #cfe6f5; max-width: 40ch; } .wg-lock i { display: block; width: min(320px, 90%); height: 8px; border-radius: 4px; background: #1b2436; overflow: hidden; } .wg-lock i b { display: block; height: 100%; background: linear-gradient(90deg, #5fd8ff, #ffd23f); } .wg-lock span { color: #8fb4c8; font-size: 13px; }
.wg-bal { margin: 8px 0; color: #cfe6f5; } .wg-bal b { color: #ffd23f; }
.hn-btn.wg-go:not([disabled]) { border-color: rgba(255, 210, 63, 0.6); color: #ffd23f; }`;
  document.head.appendChild(st);
})(window);
