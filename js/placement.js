// Placement battles (2.4, from Season 3): before ranked opens for a pilot,
// five Ground placement battles decide where they start. They open on the
// second day of the season break; anyone late plays them whenever they
// arrive. Finishing early means waiting for the season, then Admiral Ackbar
// reveals the starting league. Fleet ranked opens once they're done.
(function (root) {
  'use strict';

  const GAMES = 5;
  const KIND = 'character';
  const W = [1, 1, 1.2, 1.3, 1.25];
  const TPS = 2.5;
  const DAY = 864e5;

  const HN = () => root.HN;
  const D = root.GameData;
  const UI = () => root.UI;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => Math.round(n).toLocaleString('en-US');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const sound = (k) => { try { if (root.Sound) root.Sound.play(k); } catch (e) { /* quiet */ } };

  const seasonNo = () => { const H = HN(); return H && H.social && H.social.seasonNo ? H.social.seasonNo() : 0; };
  const st = () => HN().S();
  const on24 = () => { const H = HN(); return H && H.rank24 ? H.rank24() : !!(root.Update24 && root.Update24.on()); };
  const newR = (x) => { const H = HN(); return H && H.toNewR ? H.toNewR(x) : x; };
  const oldR = (x) => { const H = HN(); return H && H.toOldR ? H.toOldR(x) : x; };
  const brk = () => { const H = HN(); return (H && H.seasonBreak && H.seasonBreak()) || 0; };

  function rec() {
    const h = st();
    const sn = seasonNo();
    if (!h.place || h.place.s !== sn) h.place = { s: sn, base: oldR(h.rating), games: [], done: false };
    return h.place;
  }
  const forced = () => { const p = st().place; return !!(p && p.force && p.s === seasonNo()); };

  // Placement is owed this season (from Season 3, once 2.4 is out).
  function need() {
    const H = HN();
    if (!H || !H.S || !H.seasonLabel) return false;
    if (forced()) return !st().place.seen;
    if (!on24() || H.seasonLabel(seasonNo()) < 3) return false;
    const p = st().place;
    return !(p && p.s === seasonNo() && p.seen);
  }
  // Battles can be played: the last day of the break, or any time after.
  const openIn = () => (forced() ? 0 : Math.max(0, brk() - DAY));
  const canPlay = () => need() && !rec().done && openIn() <= 0;
  // The league can be revealed once the season itself has started.
  const revealIn = () => (forced() ? 0 : brk());
  const ready = () => need() && rec().done && revealIn() <= 0;

  // Tuning (set by battle simulations: see the notes in the 2.4 balance log).
  // Tuned over 1,000+ simulated placements against pilots of known strength.
  const CFG = { g1: -150, step: 60, adapt: 12, adaptMin: -300, adaptMax: 1100, bossHard: 240, bossMild: 40, perf: 12, mid: 43, lo: -250, hi: 1400, min: 600, max: 1982, bossFloor: 220, upgrade: 0.2 };
  function nextRating(p) {
    const n = p.games.length;
    const sum = p.games.reduce((a, g) => a + (g.score - 50) * CFG.adapt, 0);
    const adapt = clamp(sum, CFG.adaptMin, CFG.adaptMax);
    if (n === 0) return p.base + CFG.g1;
    if (n < GAMES - 1) return p.base + CFG.step * n + adapt;
    return struggling(p) ? p.base + adapt + CFG.bossMild : p.base + adapt + CFG.bossHard;
  }
  function struggling(p) {
    const g = p.games;
    if (!g.length) return false;
    const avg = g.reduce((a, x) => a + x.score, 0) / g.length;
    return avg < 45 || g[g.length - 1].score < 35;
  }

  // Opponents follow their league's usual card mix, and now and then a card
  // steps up a rarity (mythics, and secrets from Kyber up), so every rarity
  // in the game can show up without making the fights a lottery.
  const RK = ['common', 'rare', 'epic', 'legendary', 'mythic', 'secret'];
  function mixSquad(base, r, rating) {
    const pool = D.UNITS.filter((u) => u.kind === KIND && !u.boss && !u.raid && !String(u.id).startsWith('raid_'));
    const used = new Set(base.map((e) => e.id));
    return base.map((e) => {
      if (r() >= CFG.upgrade) return e;
      const cur = RK.indexOf((D.UNIT_MAP[e.id] || {}).rarity);
      const want = RK[Math.min(cur + 1, rating >= 1750 ? 5 : 4)];
      const list = pool.filter((u) => u.rarity === want && !used.has(u.id));
      if (!list.length) return e;
      const id = list[Math.floor(r() * list.length)].id;
      used.add(id);
      return { ...e, id };
    });
  }

  // Elite Boss Trials: pilots who crush the first four games meet a squad
  // built around a full synergy instead. Each one's stars and level were
  // tuned in battle sims so a strong squad wins about 1 time in 5 (excellent)
  // or 1 in 4 (very good): very hard, never impossible.
  const ELITE = [
    { name: 'The Sith Lords', ids: ['palpatine', 'darth_revan', 'kylo_ren', 'vader', 'darth_maul'], ex: [0, 5], good: [-6, 5] },
    { name: 'The Inquisitorius', ids: ['grand_inquisitor', 'second_sister', 'fifth_brother', 'seventh_sister', 'eighth_brother'], ex: [0, 7], good: [-3, 6] },
    { name: 'Clone Force 99', ids: ['hunter', 'wrecker', 'tech', 'crosshair', 'echo'], ex: [-3, 6], good: [-6, 5] },
    { name: 'The Jedi Masters', ids: ['master_luke', 'yoda', 'mace_windu', 'ahsoka', 'obi_wan'], ex: [-6, 4], good: [-10, 4] },
    { name: 'The Witches of Dathomir', ids: ['talzin', 'asajj_ventress', 'savage_opress', 'nightsister_acolyte', 'darth_maul'], ex: [0, 7], good: [0, 6] },
  ];
  function eliteTier(p) {
    const g = p.games.slice(0, GAMES - 1);
    if (g.length < GAMES - 1) return null;
    const avg = g.reduce((a, x) => a + x.score, 0) / g.length;
    const wins = g.filter((x) => x.won).length;
    if (wins < 3 || !g[g.length - 1].won) return null;
    return avg >= 80 ? 'ex' : avg >= 68 ? 'good' : null;
  }

  let cache = null;
  function opponent() {
    const p = rec();
    const n = p.games.length;
    const key = `${p.s}:${n}:${p.base}`;
    if (cache && cache.key === key) return cache.opp;
    const H = HN();
    const seed = [...`place:${key}:${(H.Net && H.Net.me) || 'me'}`].reduce((a, c) => (Math.imul(a, 31) + c.charCodeAt(0)) >>> 0, 7);
    const r = H.rng(seed);
    const rating = Math.max(450, Math.round(nextRating(p)));
    const squad = mixSquad(H.botSquad(KIND, newR(rating), r, true), r, rating);
    const last = n === GAMES - 1;
    let lead = null;
    const tierE = last ? eliteTier(p) : null;
    if (tierE) {
      const th = ELITE.filter((t) => t.ids.every((id) => D.UNIT_MAP[id]));
      const pick = th[Math.floor(r() * th.length)];
      const base = Math.round(squad.reduce((a, e) => a + e.level, 0) / Math.max(1, squad.length));
      const [lv, st] = pick[tierE];
      const elite = pick.ids.map((id) => ({ id, level: Math.max(1, base + lv), stars: st }));
      const RK = ['common', 'rare', 'epic', 'legendary', 'mythic', 'secret'];
      lead = elite.reduce((a, e) => (RK.indexOf(D.UNIT_MAP[e.id].rarity) > RK.indexOf(D.UNIT_MAP[a.id].rarity) ? e : a), elite[0]).id;
      const names = (H.BOT_NAMES || []).concat(H.BOT_NAMES_2 || []);
      const opp = { id: `pl:${n}`, real: false, rating: rating + (tierE === 'ex' ? 300 : 200), squad: elite, boss: lead, elite: tierE, theme: pick.name, name: names[Math.floor(r() * names.length)] || 'Rival', av: lead, frame: tierE === 'ex' ? 'legend' : 'kyber' };
      cache = { key, opp };
      return opp;
    }
    if (last && squad.length) {
      const top = squad.reduce((a, e) => (e.level > a.level ? e : a), squad[0]);
      lead = top.id;
      if (struggling(p)) { top.level += 1; top.stars = Math.min(7, top.stars + 1); } else { squad.forEach((e) => { e.level += 1; e.stars = Math.min(7, e.stars + 1); }); top.level += 3; top.stars = 7; }
    }
    const names = (H.BOT_NAMES || []).concat(H.BOT_NAMES_2 || []);
    const avs = H.BOT_AVS || ['luke'];
    const opp = { id: `pl:${n}`, real: false, rating, squad, boss: lead, name: names[Math.floor(r() * names.length)] || 'Rival', av: avs[Math.floor(r() * avs.length)], frame: H.divOf(newR(rating)).league };
    cache = { key, opp };
    return opp;
  }
  const label = () => (rec().games.length === GAMES - 1 ? 'Boss Trial' : `Placement ${rec().games.length + 1} of ${GAMES}`);

  function score(b, won, quit) {
    const u = (b && b.units) || [];
    const f = u.filter((x) => x.side === 'enemy');
    const m = u.filter((x) => x.side === 'player');
    const fh = f.reduce((a, x) => a + (x.maxHp || 0), 0) || 1;
    const dealt = f.reduce((a, x) => a + Math.max(0, (x.maxHp || 0) - Math.max(0, x.alive ? x.hp : 0)), 0);
    const mh = m.reduce((a, x) => a + (x.maxHp || 0), 0) || 1;
    const left = m.reduce((a, x) => a + (x.alive ? Math.max(0, x.hp) : 0), 0);
    const t = Math.max(1, (b && b.turnCount) || 1);
    const mt = Math.max(1, Math.round(t * (m.length / Math.max(1, u.length))));
    const mins = Math.max(0.25, (t * TPS) / 60);
    const d = clamp(dealt / fh, 0, 1);
    const a1 = clamp(d / mins / 0.8, 0, 1);
    const a2 = won ? clamp(1 - (mins - 1) / 3, 0, 1) : 0;
    const a3 = won ? clamp(left / mh, 0, 1) : 0;
    const a4 = won ? clamp(1 - (mt - 6) / 30, 0, 1) : d * 0.3;
    let s = (won ? 30 : 0) + 20 * d + 15 * a1 + 10 * a2 + 15 * a3 + 10 * a4;
    if (quit) s = Math.min(s, 10);
    return { won: !!won, score: Math.round(clamp(s, 0, 100)) };
  }

  // Best possible placement: the top of Kyber II. Kyber III and Legend are earned by climbing.
  // (Placement works on the 2.3 numbers; the result moves onto the live ladder at the end.)
  const maxPlace = () => CFG.max;
  function placed(p) {
    let sum = 0; let w = 0;
    const perf = p.games.map((g) => g.opp + (g.score - CFG.mid) * CFG.perf);
    // The Boss Trial counts, but a crushing loss can only pull you so far below
    // what your first four games showed.
    if (perf.length === GAMES) { const pre = perf.slice(0, GAMES - 1); const m = pre.reduce((a, x) => a + x, 0) / pre.length; perf[GAMES - 1] = Math.max(perf[GAMES - 1], m - CFG.bossFloor); }
    perf.forEach((x, i) => { const k = W[i] || 1; sum += x * k; w += k; });
    const r = clamp(w ? sum / w : p.base, p.base + CFG.lo, p.base + CFG.hi);
    // Placement can start you in low Legend at best: the rest is earned by climbing.
    return Math.round(clamp(r, CFG.min, maxPlace()));
  }

  function record(params, b, won, quit) {
    const p = rec();
    if (p.done) return null;
    const g = score(b, won, quit);
    g.opp = params.opp.rating;
    g.boss = !!params.opp.boss;
    p.games.push(g);
    cache = null;
    if (p.games.length >= GAMES) { p.done = true; p.to = newR(placed(p)); p.seen = false; }
    HN().save();
    return { won: g.won };
  }

  // The rating lands when Ackbar reveals it.
  function apply() {
    const H = HN();
    const h = st();
    const p = h.place;
    if (!p || !p.done || p.applied) return;
    p.applied = true;
    h.rating = p.to;
    h.best = Math.max(h.best || 0, p.to);
    // The season best starts at the placement (last season's carried rating doesn't count).
    if (h.soc) h.soc.sBest = p.to;
    h.streak = 0;
    if (H.claimDivisions) H.claimDivisions();
    H.save();
    try { H.Net.publish(); } catch (e) { /* offline */ }
  }

  // ----- Ackbar's reveal ------------------------------------------------
  const css = `
.pl .pl-stage { position: relative; z-index: 2; display: grid; justify-items: center; gap: 10px; padding: 8px 12px 0; text-align: center; }
.pl .pl-head small { display: block; font: 700 11px var(--font-display, system-ui); letter-spacing: .22em; color: #9fd8ff; text-transform: uppercase; }
.pl .pl-head b { display: block; font: 800 22px var(--font-display, system-ui); letter-spacing: .06em; color: #fff; }
.pl .pl-games { display: flex; gap: 8px; justify-content: center; }
.pl .pl-g { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; font: 800 13px var(--font-display, system-ui); opacity: 0; transform: scale(.6); transition: opacity .3s, transform .35s cubic-bezier(.2, 1.6, .4, 1); background: rgba(8, 24, 40, .85); border: 2px solid #7af0a0; color: #7af0a0; }
.pl .pl-g.l { border-color: #ff8a8a; color: #ff8a8a; } .pl .pl-g.boss { box-shadow: 0 0 12px rgba(255, 200, 80, .5); }
.pl .pl-g.on { opacity: 1; transform: none; }
.pl .pl-reveal { position: relative; width: 190px; height: 190px; display: grid; place-items: center; margin-top: 6px; opacity: 0; transform: scale(.8); transition: opacity .5s, transform .6s cubic-bezier(.2, 1.4, .4, 1); }
.pl.medal .pl-reveal { opacity: 1; transform: none; }
.pl .pl-ring { position: absolute; inset: 0; transform: rotate(-90deg); }
.pl .pl-ring circle { fill: none; stroke-width: 9; }
.pl .pl-ring .bg { stroke: rgba(255, 255, 255, .1); }
.pl .pl-ring .fg { stroke: var(--pl, #7cd0ff); stroke-linecap: round; filter: drop-shadow(0 0 6px var(--pl, #7cd0ff)); }
.pl .pl-reveal .bdg { width: 112px; }
.pl .pl-reveal .bdg svg, .pl .pl-reveal .bdg img { width: 100%; height: auto; }
.pl .pl-reveal::before { content: ''; position: absolute; inset: -14px; border-radius: 50%; background: radial-gradient(circle, var(--pl, #7cd0ff) 0%, transparent 65%); opacity: 0; transform: scale(.6); transition: opacity .5s, transform .6s; }
.pl.hit .pl-reveal::before { opacity: .5; transform: scale(1.2); }
.pl.hit .pl-reveal .bdg { animation: plHit .7s cubic-bezier(.2, 1.6, .4, 1); }
@keyframes plHit { 0% { transform: scale(1.35); } 100% { transform: scale(1); } }
.pl .pl-num { font: 800 34px var(--font-display, system-ui); color: #fff; font-variant-numeric: tabular-nums; opacity: 0; transition: opacity .3s; }
.pl.medal .pl-num { opacity: 1; }
.pl .pl-name { font: 800 28px var(--font-display, system-ui); letter-spacing: .08em; color: var(--pl, #fff); text-shadow: 0 0 18px var(--pl, #7cd0ff); opacity: 0; transform: scale(.7); transition: opacity .4s, transform .5s cubic-bezier(.2, 1.5, .4, 1); }
.pl.hit .pl-name { opacity: 1; transform: none; }
.pl .pl-go { opacity: 0; pointer-events: none; transition: opacity .4s; margin-top: 6px; }
.pl .pl-go.on { opacity: 1; pointer-events: auto; }
.pl .cp-flash.go { animation: plFlash .9s ease-out; }
@keyframes plFlash { 0% { opacity: .9; } 100% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .pl .pl-reveal, .pl .pl-name, .pl .pl-g { transition: none; } }
`;
  const COLOR = { bronze: '#e0a46a', silver: '#d6e2ee', gold: '#ffd166', kyber: '#7fe3ff', legend: '#ff6bd5' };

  function reveal() {
    return new Promise((resolve) => {
      const H = HN();
      const C = root.Champion && root.Champion.kit;
      const p = st().place;
      if (!C || !H || !p || !p.done) return resolve(false);
      apply();
      C.css();
      if (!document.getElementById('pl-css')) document.head.appendChild(Object.assign(document.createElement('style'), { id: 'pl-css', textContent: css }));
      const A = root.HNArt;
      const name = C.myName();
      const d = H.divOf(p.to);
      const di = H.DIVS.indexOf(d);
      const nx = H.DIVS[di + 1];
      const frac = clamp(nx ? (p.to - d.min) / (nx.min - d.min) : (p.to - d.min) / 400, 0.04, 1);
      const lg = (H.LEAGUES || []).find((l) => l.id === d.league) || { name: d.league };
      const wins = p.games.filter((g) => g.won).length;
      const last = p.games[GAMES - 1];
      const R = 86; const CIRC = 2 * Math.PI * R;
      const games = p.games.map((g, i) => `<div class="pl-g ${g.won ? '' : 'l'} ${i === GAMES - 1 ? 'boss' : ''}">${g.won ? 'W' : 'L'}</div>`).join('');
      const warp = Array.from({ length: 26 }, (_, k) => `<i style="--a:${(k * 360) / 26 + (k % 3) * 4}deg;--d:${(k % 7) * 70}"></i>`).join('');
      const node = UI().el(`<div class="cp pl" role="dialog" aria-modal="true" aria-label="Placement results" style="--pl:${COLOR[d.league] || '#7cd0ff'}">
        <div class="cp-bg"></div>${C.bridgeSvg()}<div class="cp-warp">${warp}</div><div class="cp-flash"></div>
        <div class="cp-scene">
          <div class="cp-holo"><div class="cp-cone"></div><div class="cp-ack">${H.ui.ACKBAR}</div><span class="cp-plate">Home One</span><div class="cp-emit"></div></div>
          <div class="pl-stage">
            <div class="pl-head"><small>Season ${H.seasonLabel(p.s)} · Placement</small><b>${esc(name)}</b></div>
            <div class="pl-games">${games}</div>
            <div class="pl-reveal"><svg class="pl-ring" viewBox="0 0 190 190"><circle class="bg" cx="95" cy="95" r="${R}"/><circle class="fg" cx="95" cy="95" r="${R}" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}"/></svg><div class="bdg">${A && A.badge ? A.badge(d.league, d.div) : ''}</div></div>
            <div class="pl-num">0</div>
            <div class="pl-name">${esc(d.name.toUpperCase())}</div>
            <button type="button" class="btn btn-primary pl-go" data-pl-go>Begin the season</button>
          </div>
        </div>
        <div class="cp-say"><span class="cp-face">${H.ui.ACKBAR}</span><b>Admiral Ackbar</b><p data-line></p><span class="cp-tap">Tap to continue</span></div>
      </div>`);
      node.addEventListener('keydown', (e) => { if (e.key === 'Escape') e.stopPropagation(); });
      document.body.appendChild(node);
      const lock = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      sound('reveal_legendary');
      const fg = node.querySelector('.pl-ring .fg');
      const num = node.querySelector('.pl-num');
      // The ring fills to where you sit in your division while the rating counts up.
      const fill = () => new Promise((done) => {
        const t0 = performance.now();
        const dur = 2600;
        const from = Math.max(0, d.min - 150);
        let tick = 0;
        const step = (now) => {
          const k = Math.min(1, (now - t0) / dur);
          const e = 1 - Math.pow(1 - k, 3);
          fg.setAttribute('stroke-dashoffset', String(CIRC * (1 - frac * e)));
          num.textContent = fmt(from + (p.to - from) * e);
          if (++tick % 6 === 0 && k < 1) sound('click');
          if (k < 1) requestAnimationFrame(step); else done();
        };
        requestAnimationFrame(step);
      });
      (async () => {
        await new Promise((r) => setTimeout(r, 1700));
        await C.talk(node, [`${name}, your placement battles are complete. I've studied every second of them.`]);
        node.querySelectorAll('.pl-g').forEach((g, i) => setTimeout(() => { g.classList.add('on'); sound('click'); }, i * 240));
        await new Promise((r) => setTimeout(r, GAMES * 240 + 200));
        await C.talk(node, [`You won ${wins} of ${GAMES}.`]);
        await C.talk(node, [last && last.won ? 'And the Boss Trial… you broke it. Very few pilots do.' : 'The Boss Trial held you this time. It will still be waiting at the top.']);
        await C.talk(node, ['The data is clear. Commander… you are…']);
        node.classList.add('medal');
        await new Promise((r) => setTimeout(r, 500));
        await fill();
        node.classList.add('hit');
        const fl = node.querySelector('.cp-flash'); fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go');
        sound('reveal_legendary');
        await C.talk(node, [`${d.name}! You start the season in the ${lg.name} league at ${fmt(p.to)} rating. Fleet ranked is open to you now too. Climb, pilot. The galaxy is watching.`]);
        node.querySelector('[data-pl-go]').classList.add('on');
      })();
      node.querySelector('[data-pl-go]').addEventListener('click', () => {
        p.seen = true; p.force = false; H.save();
        node.classList.add('out');
        document.documentElement.style.overflow = lock;
        setTimeout(() => { node.remove(); resolve(true); }, 450);
      });
    });
  }

  // Owner test: a fresh set of placement battles now, skipping the waits.
  function test() {
    const H = HN();
    if (!(H && H.S)) return false;
    const h = st();
    h.place = { s: seasonNo(), base: oldR(h.rating), games: [], done: false, force: true };
    cache = null;
    H.save();
    if (root.UI && root.UI.App) root.UI.App.go('holonet', { view: 'arena', kind: KIND });
    return true;
  }

  root.Placement = { CFG, W, nextRating, placed, score, GAMES, KIND, need, canPlay, openIn, revealIn, ready, rec, opponent, label, record, reveal, test };

  const hook = () => {
    const H = UI() && UI().hooks;
    if (!H || H.__place) return;
    H.__place = true;
    const before = H.redeem;
    const CODE = String.fromCharCode(80, 76, 65, 67, 69, 77, 69, 78, 84);
    H.redeem = (code) => {
      if (code !== CODE) return before ? before(code) : false;
      if (!(root.HN && root.HN.S)) { UI().toast('Open the HoloNet first, then try the code again.'); return true; }
      test();
      return true;
    };
  };
  if (root.UI) hook(); else root.addEventListener('load', hook);
})(window);
