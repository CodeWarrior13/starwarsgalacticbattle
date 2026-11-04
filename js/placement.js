// Placement battles: once a HoloNet season's two-day break is over, ranked
// opens with five placement battles that decide where each pilot starts.
// Every battle is scored on damage per minute, time to clear, how much of
// the squad survived and how efficiently it fought. The opponents adapt:
// game 1 is a baseline, games 2-4 rise or ease with each score, and game 5
// is the Boss Trial. Afterwards Admiral Ackbar reveals the pilot's league.
(function (root) {
  'use strict';

  const GAMES = 5;
  const WEIGHT = [1, 1, 1.2, 1.3, 1.6];
  // Battle time is counted in turns (about 2.5 seconds each at normal
  // speed), so battle speed and pauses don't change a score.
  const SEC_PER_TURN = 2.5;

  const HN = () => root.HN;
  const D = root.GameData;
  const UI = () => root.UI;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => Math.round(n).toLocaleString('en-US');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const sound = (k) => { try { if (root.Sound) root.Sound.play(k); } catch (e) { /* quiet */ } };

  const seasonNo = () => { const H = HN(); return H && H.social && H.social.seasonNo ? H.social.seasonNo() : 0; };
  const st = () => HN().S();

  // The current season's placement record (made on first use).
  function rec() {
    const h = st();
    const sn = seasonNo();
    if (!h.place || h.place.s !== sn) h.place = { s: sn, base: h.rating, games: [], done: false };
    return h.place;
  }

  function need() {
    const H = HN();
    if (!H || !H.S || !H.seasonLabel) return false;
    const h = st();
    if (h.place && h.place.force && !h.place.done) return true;
    if (H.seasonLabel(seasonNo()) < 3 || (H.seasonBreak && H.seasonBreak())) return false;
    return !(h.place && h.place.s === seasonNo() && h.place.done);
  }

  // How far each result moves the next opponent: crush one and the next
  // spikes hard, struggle and it eases off to find your ceiling.
  function nextRating(p) {
    const adapt = clamp(p.games.reduce((a, g) => a + (g.score - 50) * 9, 0), -300, 800);
    const r = p.base + adapt;
    return p.games.length === GAMES - 1 ? r + 220 : r;
  }

  let cache = null;
  function opponent(kind) {
    const p = rec();
    const n = p.games.length;
    const key = `${p.s}:${n}:${kind}:${p.base}`;
    if (cache && cache.key === key) return cache.opp;
    const H = HN();
    const seed = [...`place:${key}:${(H.Net && H.Net.me) || 'me'}`].reduce((a, c) => (Math.imul(a, 31) + c.charCodeAt(0)) >>> 0, 7);
    const r = H.rng(seed);
    const rating = Math.max(500, Math.round(nextRating(p)));
    const squad = H.botSquad(kind, rating, r).map((e) => ({ ...e }));
    const boss = n === GAMES - 1;
    let bossId = null;
    if (boss && squad.length) {
      // The Boss Trial: its strongest card leads at full power, the rest step up.
      const top = squad.reduce((a, e) => ((D.UNIT_MAP[e.id].rarity === 'legendary' || e.level > a.level) ? e : a), squad[0]);
      squad.forEach((e) => { e.level += 1; e.stars = Math.min(7, e.stars + 1); });
      top.level += 3; top.stars = 7; bossId = top.id;
    }
    const names = (H.BOT_NAMES || []).concat(H.BOT_NAMES_2 || []);
    const avs = H.BOT_AVS || ['luke'];
    const opp = {
      id: `p:${n}`, real: false, rating, squad, boss: bossId,
      name: names[Math.floor(r() * names.length)] || 'Rival',
      av: avs[Math.floor(r() * avs.length)], frame: H.divOf(rating).league,
    };
    cache = { key, opp };
    return opp;
  }

  // What the next fight looks like, in words (the numbers stay hidden).
  function tier() {
    const p = rec();
    const n = p.games.length;
    if (n === 0) return { label: 'Baseline', note: 'An even match to see where you stand.' };
    if (n === GAMES - 1) return { label: 'Boss Trial', note: 'A hyper-strong opponent. Beat it to break into the highest starting leagues.' };
    const last = p.games[n - 1].score;
    if (last >= 70) return { label: 'Spiking hard', note: 'You crushed the last one, so this one hits much harder.' };
    if (last >= 50) return { label: 'Rising', note: 'A tougher opponent than the last.' };
    return { label: 'Easing off', note: 'A little easier, to find your exact level.' };
  }

  // Score one battle out of 100.
  function score(b, won, retreated) {
    const units = (b && b.units) || [];
    const foes = units.filter((u) => u.side === 'enemy');
    const mine = units.filter((u) => u.side === 'player');
    const foeHp = foes.reduce((a, u) => a + (u.maxHp || 0), 0) || 1;
    const dealt = foes.reduce((a, u) => a + Math.max(0, (u.maxHp || 0) - Math.max(0, u.alive ? u.hp : 0)), 0);
    const myHp = mine.reduce((a, u) => a + (u.maxHp || 0), 0) || 1;
    const left = mine.reduce((a, u) => a + (u.alive ? Math.max(0, u.hp) : 0), 0);
    const turns = Math.max(1, (b && b.turnCount) || 1);
    const myTurns = Math.max(1, Math.round(turns * (mine.length / Math.max(1, units.length))));
    const mins = Math.max(0.25, (turns * SEC_PER_TURN) / 60);
    const dmgPct = clamp(dealt / foeHp, 0, 1);
    const dpm = dealt / mins;
    const dpmS = clamp(dmgPct / mins / 0.8, 0, 1);
    const timeS = won ? clamp(1 - (mins - 1) / 3, 0, 1) : 0;
    const survS = won ? clamp(left / myHp, 0, 1) : 0;
    const effS = won ? clamp(1 - (myTurns - 6) / 30, 0, 1) : dmgPct * 0.3;
    let s = (won ? 30 : 0) + 20 * dmgPct + 15 * dpmS + 10 * timeS + 15 * survS + 10 * effS;
    if (retreated) s = Math.min(s, 10);
    return { won: !!won, score: Math.round(clamp(s, 0, 100)), dpm: Math.round(dpm), secs: Math.round(mins * 60), surv: Math.round(survS * 100), eff: Math.round(effS * 100), dmg: Math.round(dmgPct * 100) };
  }

  // Where five games put you: each game is worth the opponent's strength
  // plus how well you did, and later games count for more.
  function placed(p) {
    let sum = 0; let w = 0;
    p.games.forEach((g, i) => { const k = WEIGHT[i] || 1; sum += (g.opp + (g.score - 50) * 9) * k; w += k; });
    const r = w ? sum / w : p.base;
    return Math.round(clamp(r, Math.max(500, p.base - 250), p.base + 1100));
  }

  // Record a finished (or abandoned) placement battle.
  function record(params, b, won, retreated) {
    const p = rec();
    if (p.done) return null;
    const m = score(b, won, retreated);
    m.opp = params.opp.rating;
    m.boss = !!params.opp.boss;
    p.games.push(m);
    cache = null;
    if (p.games.length >= GAMES) finish(p);
    HN().save();
    return m;
  }

  function finish(p) {
    const H = HN();
    const h = st();
    const before = h.rating;
    const r = placed(p);
    p.done = true; p.force = false; p.from = before; p.to = r; p.seen = false;
    h.rating = r;
    h.best = Math.max(h.best || 0, r);
    if (h.soc) h.soc.sBest = Math.max(h.soc.sBest || 0, r);
    h.streak = 0;
    p.rewards = H.claimDivisions ? H.claimDivisions() : [];
    H.save();
    try { H.Net.publish(); } catch (e) { /* offline */ }
  }

  // ----- Ackbar's reveal ------------------------------------------------
  const css = `
.pl .pl-stage { position: relative; display: grid; justify-items: center; gap: 10px; padding: 8px 12px 0; text-align: center; }
.pl .pl-head small { display: block; font: 700 11px var(--font-display, system-ui); letter-spacing: .22em; color: #9fd8ff; text-transform: uppercase; }
.pl .pl-head b { display: block; font: 800 22px var(--font-display, system-ui); letter-spacing: .06em; color: #fff; }
.pl .pl-games { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; width: min(520px, 100%); }
.pl .pl-g { opacity: 0; transform: translateY(10px); transition: opacity .35s, transform .35s; background: rgba(8, 24, 40, .82); border: 1px solid rgba(95, 216, 255, .25); border-radius: 10px; padding: 6px 2px; display: grid; gap: 1px; }
.pl .pl-g.on { opacity: 1; transform: none; }
.pl .pl-g span { font-size: 10px; color: #9fc4d8; } .pl .pl-g b { font: 800 18px var(--font-display, system-ui); color: #fff; } .pl .pl-g i { font-style: normal; font-size: 10px; color: #7af0a0; } .pl .pl-g.l i { color: #ff8a8a; }
.pl .pl-g.boss { border-color: rgba(255, 200, 80, .6); }
.pl .pl-reveal { position: relative; width: 150px; height: 150px; display: grid; place-items: center; margin-top: 4px; opacity: 0; transition: opacity .4s; }
.pl.medal .pl-reveal { opacity: 1; }
.pl .pl-stage { z-index: 2; }
.pl .pl-reveal .bdg { width: 120px; transition: transform .12s; }
.pl .pl-reveal .bdg svg, .pl .pl-reveal .bdg img { width: 100%; height: auto; }
.pl .pl-reveal::before { content: ''; position: absolute; inset: -10px; border-radius: 50%; background: radial-gradient(circle, var(--pl, #7cd0ff) 0%, transparent 65%); opacity: 0; transform: scale(.6); transition: opacity .5s, transform .6s; }
.pl.hit .pl-reveal::before { opacity: .55; transform: scale(1.25); }
.pl.hit .pl-reveal .bdg { animation: plHit .7s cubic-bezier(.2, 1.6, .4, 1); }
@keyframes plHit { 0% { transform: scale(1.6); } 100% { transform: scale(1); } }
.pl .pl-name { font: 800 30px var(--font-display, system-ui); letter-spacing: .08em; color: var(--pl, #fff); text-shadow: 0 0 18px var(--pl, #7cd0ff); opacity: 0; transform: scale(.7); transition: opacity .4s, transform .5s cubic-bezier(.2, 1.5, .4, 1); }
.pl.hit .pl-name { opacity: 1; transform: none; }
.pl .pl-rate { font: 700 14px var(--font-display, system-ui); color: #cfe9ff; opacity: 0; transition: opacity .4s .3s; }
.pl.hit .pl-rate { opacity: 1; }
.pl .pl-go { opacity: 0; pointer-events: none; transition: opacity .4s; margin-top: 6px; }
.pl .pl-go.on { opacity: 1; pointer-events: auto; }
.pl .cp-flash.go { animation: plFlash .9s ease-out; }
@keyframes plFlash { 0% { opacity: .9; } 100% { opacity: 0; } }
`;
  const COLOR = { bronze: '#e0a46a', silver: '#d6e2ee', gold: '#ffd166', kyber: '#7fe3ff', legend: '#ff6bd5' };

  function reveal() {
    return new Promise((resolve) => {
      const H = HN();
      const C = root.Champion && root.Champion.kit;
      const p = st().place;
      if (!C || !H || !p || !p.done) return resolve(false);
      C.css();
      if (!document.getElementById('pl-css')) document.head.appendChild(Object.assign(document.createElement('style'), { id: 'pl-css', textContent: css }));
      const A = root.HNArt;
      const name = C.myName();
      const d = H.divOf(p.to);
      const lg = (H.LEAGUES || []).find((l) => l.id === d.league) || { name: d.league };
      const games = p.games.map((g, i) => `<div class="pl-g ${g.won ? '' : 'l'} ${g.boss ? 'boss' : ''}"><span>${g.boss ? 'Boss' : `Game ${i + 1}`}</span><b>${g.score}</b><i>${g.won ? 'Win' : 'Loss'}</i></div>`).join('');
      const warp = Array.from({ length: 26 }, (_, k) => `<i style="--a:${(k * 360) / 26 + (k % 3) * 4}deg;--d:${(k % 7) * 70}"></i>`).join('');
      const node = UI().el(`<div class="cp pl" role="dialog" aria-modal="true" aria-label="Placement results" style="--pl:${COLOR[d.league] || '#7cd0ff'}">
        <div class="cp-bg"></div>${C.bridgeSvg()}<div class="cp-warp">${warp}</div><div class="cp-flash"></div>
        <div class="cp-scene">
          <div class="cp-holo"><div class="cp-cone"></div><div class="cp-ack">${H.ui.ACKBAR}</div><span class="cp-plate">Home One</span><div class="cp-emit"></div></div>
          <div class="pl-stage">
            <div class="pl-head"><small>Season ${H.seasonLabel(p.s)} · Placement</small><b>${esc(name)}</b></div>
            <div class="pl-games">${games}</div>
            <div class="pl-reveal"><div class="bdg">${A && A.badge ? A.badge('bronze', 1) : ''}</div></div>
            <div class="pl-name">${esc(d.name.toUpperCase())}</div>
            <div class="pl-rate">${lg.name} league · starting at ${fmt(p.to)} rating</div>
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
      const wins = p.games.filter((g) => g.won).length;
      const best = p.games.reduce((a, g) => (g.score > a.score ? g : a), p.games[0]);
      const bossG = p.games[GAMES - 1];
      const bdg = node.querySelector('.pl-reveal .bdg');
      // The drum roll: badges flick through the divisions, slow down, land.
      const spin = () => new Promise((done) => {
        const divs = (H.DIVS || []).filter((x) => x.min <= Math.max(p.to, 1200) + 400);
        const target = divs.findIndex((x) => x.key === d.key);
        const steps = Math.max(10, divs.length + target + 4);
        let k = 0;
        const tick = () => {
          const x = k >= steps ? d : divs[(k + Math.max(0, target - steps + divs.length * 3)) % divs.length];
          if (A && A.badge) bdg.innerHTML = A.badge(x.league, x.div);
          if (k < steps) sound('click');
          if (k >= steps) return done();
          k++;
          setTimeout(tick, 60 + Math.pow(k / steps, 3) * 420);
        };
        tick();
      });
      (async () => {
        await new Promise((r) => setTimeout(r, 1700));
        await C.talk(node, [`${name}, your placement trials are complete. I've studied every second of them.`]);
        node.querySelectorAll('.pl-g').forEach((g, i) => setTimeout(() => { g.classList.add('on'); sound('click'); }, i * 260));
        await new Promise((r) => setTimeout(r, GAMES * 260 + 200));
        await C.talk(node, [`You won ${wins} of ${GAMES}. Your best fight scored ${best.score}, with ${fmt(best.dpm)} damage a minute${best.won ? ` and a clear in ${Math.floor(best.secs / 60)}:${String(best.secs % 60).padStart(2, '0')}` : ''}.`]);
        await C.talk(node, [bossG && bossG.won ? 'And the Boss Trial… you broke it. Very few pilots do.' : 'The Boss Trial held you this time. It will still be waiting at the top.']);
        await C.talk(node, ['The data is clear. Commander… you are…']);
        node.classList.add('medal');
        await new Promise((r) => setTimeout(r, 450));
        await spin();
        node.classList.add('hit');
        const fl = node.querySelector('.cp-flash'); fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go');
        sound('reveal_legendary');
        await C.talk(node, [`${d.name}! You start this season in the ${lg.name} league at ${fmt(p.to)} rating. Now climb, pilot. The galaxy is watching.`]);
        node.querySelector('[data-pl-go]').classList.add('on');
      })();
      node.querySelector('[data-pl-go]').addEventListener('click', () => {
        p.seen = true; H.save();
        node.classList.add('out');
        document.documentElement.style.overflow = lock;
        setTimeout(() => { node.remove(); resolve(true); }, 450);
      });
    });
  }

  // Owner test: start a fresh set of placement battles now.
  function test() {
    const H = HN();
    if (!(H && H.S)) return false;
    const h = st();
    h.place = { s: seasonNo(), base: h.rating, games: [], done: false, force: true };
    cache = null;
    H.save();
    if (root.UI && root.UI.App) root.UI.App.go('holonet', { view: 'arena', kind: 'character' });
    return true;
  }

  root.Placement = { GAMES, need, rec, opponent, tier, score, record, placed, reveal, test };

  const hook = () => {
    const H = UI() && UI().hooks;
    if (!H || H.__place) return;
    H.__place = true;
    // Owner test code (9 letters).
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
