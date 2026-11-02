// End-of-season recap. When a HoloNet season ends, the next login opens
// Home One's bridge: Admiral Ackbar congratulates the pilot by callsign and
// walks through their season: where they finished in the world (bots
// included), their league and season best, their all-time high, their record
// and their favorite card. The season's leaderboard rewards are collected at
// the end. Stats are counted from HoloNet battles as they're played.
(function (root) {
  const D = root.GameData;
  const UI = () => root.UI;
  const HN = () => root.HN;
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = (n) => Math.round(n || 0).toLocaleString('en-US');
  const sound = (n) => { if (root.Sound) root.Sound.play(n); };

  // ---------- this season's numbers ----------
  const seasonNow = () => { try { return HN().social.seasonNo(); } catch (e) { return null; } };
  function stats(h) {
    const sn = seasonNow();
    if (sn == null) return null;
    if (!h.rc || h.rc.s !== sn) {
      if (h.rc && h.rc.s != null) h.rcPrev = h.rc;
      h.rc = { s: sn, w: 0, l: 0, dw: 0, dl: 0, raids: 0, run: 0, streak: 0, use: {} };
    }
    return h.rc;
  }
  // Recorded after every HoloNet battle: arena and ranked duels count toward
  // the record, raids toward raids, and every card that fought toward the favorite.
  function record(battle, params, won) {
    if (!params || params.type !== 'hn' || !HN() || !HN().S) return;
    const h = HN().S();
    const rc = stats(h);
    if (!rc) return;
    const mode = params.hn;
    const friendly = mode === 'duel' && battle && battle.duel && battle.duel.fr;
    if (friendly) return;
    if (mode === 'arena' || mode === 'duel') {
      const key = mode === 'duel' ? (won ? 'dw' : 'dl') : (won ? 'w' : 'l');
      rc[key] += 1;
      rc.run = won ? rc.run + 1 : 0;
      rc.streak = Math.max(rc.streak, rc.run);
    } else if (mode === 'raid' || mode === 'graid') rc.raids += 1;
    const mine = battle && battle.side ? battle.side('player') : [];
    for (const u of mine) {
      if (!u.id || !D.UNIT_MAP[u.id] || !(root.Player.owns(u.id) || (HN().owns && HN().owns(u.id)))) continue;
      rc.use[u.id] = (rc.use[u.id] || 0) + 1;
    }
    // Keep only the 40 most-used cards so the save stays small.
    const ids = Object.keys(rc.use);
    if (ids.length > 40) ids.sort((a, b) => rc.use[a] - rc.use[b]).slice(0, ids.length - 40).forEach((id) => delete rc.use[id]);
    try { HN().save(); } catch (e) { /* not ready */ }
  }

  // The numbers for a finished season (if they were counted on this device's save).
  function seasonStats(h, season) {
    const pick = [h.rc, h.rcPrev].find((r) => r && r.s === season);
    return pick || null;
  }

  // ---------- the scene ----------
  const css = `
.rc .cp-scene { display: flex; flex-direction: column; align-items: center; gap: 10px; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; padding: max(12px, env(safe-area-inset-top, 0px)) 14px 10px; }
.rc .cp-holo { position: relative; left: auto; top: auto; transform: none; width: clamp(92px, 22vmin, 138px); flex: 0 0 auto; }
.rc .cp-holo .cp-plate { bottom: 14%; font-size: 9px; }
.rc-head { text-align: center; opacity: 0; animation: cp-up .5s 1.9s forwards; }
.rc-head small { display: block; font: 700 11px var(--font-display); letter-spacing: .26em; text-transform: uppercase; color: #7cd0ff; }
.rc-head b { display: block; font: 800 clamp(20px, 5.4vw, 30px)/1.1 var(--font-display); letter-spacing: .06em; text-transform: uppercase; color: #ffd23f; text-shadow: 0 2px 0 #6a4206, 0 0 22px rgba(255, 210, 63, .45); }
.rc-head em { font-style: normal; font-size: 13px; color: #c9e6ff; }
.rc-board { width: min(620px, 100%); display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.rc-t { position: relative; display: grid; gap: 2px; align-content: center; padding: 10px 12px; border-radius: 14px; background: rgba(8, 20, 40, .9); border: 1px solid rgba(124, 208, 255, .3); opacity: 0; transform: translateY(14px) scale(.96); transition: opacity .45s, transform .55s cubic-bezier(.2, 1.3, .4, 1); min-width: 0; }
.rc-t.on { opacity: 1; transform: none; }
.rc-t > span { font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: #7f9cc0; }
.rc-t > b { font: 800 clamp(18px, 5vw, 24px)/1.15 var(--font-display); font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.rc-t > small { font-size: 12px; color: #a9c1dd; }
.rc-t.rank { grid-column: 1 / -1; grid-template-columns: auto 1fr; align-items: center; gap: 4px 14px; background: linear-gradient(135deg, rgba(255, 210, 63, .14), rgba(8, 20, 40, .92) 60%); border-color: rgba(255, 210, 63, .5); }
.rc-t.rank .rc-n { grid-row: 1 / span 3; font: 900 clamp(40px, 13vw, 64px)/1 var(--font-display); color: #ffd23f; text-shadow: 0 3px 0 #6a4206, 0 0 26px rgba(255, 210, 63, .5); }
.rc-t.league { grid-template-columns: 52px 1fr; align-items: center; column-gap: 10px; }
.rc-t.league .rc-bdg { grid-row: 1 / span 3; width: 52px; }
.rc-t.league .rc-bdg svg { width: 100%; height: auto; display: block; }
.rc-t.rec.new { border-color: rgba(90, 255, 200, .6); background: linear-gradient(135deg, rgba(90, 255, 200, .14), rgba(8, 20, 40, .92) 60%); }
.rc-t.rec.new > b { color: #5affc8; }
.rc-t .rc-flag { position: absolute; top: -8px; right: 10px; font: 800 9px var(--font-display); letter-spacing: .16em; padding: 2px 8px; border-radius: 99px; background: #5affc8; color: #022; }
.rc-t.fav { grid-column: 1 / -1; grid-template-columns: 74px 1fr; align-items: center; column-gap: 12px; }
.rc-t.fav .rc-card { grid-row: 1 / span 3; width: 74px; aspect-ratio: 1; border-radius: 12px; overflow: hidden; border: 2px solid var(--rc, #7cd0ff); box-shadow: 0 0 16px color-mix(in srgb, var(--rc, #7cd0ff) 45%, transparent); }
.rc-t.fav .rc-card > * { width: 100%; height: 100%; display: block; }
.rc-t.fav .rc-card svg, .rc-t.fav .rc-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
.rc-t.prize { grid-column: 1 / -1; border-color: rgba(255, 210, 63, .45); }
.rc-t.prize > b { font-size: 15px; color: #ffd23f; }
.rc-go { width: min(620px, 100%); display: flex; justify-content: center; opacity: 0; pointer-events: none; transition: opacity .4s; }
.rc-go.on { opacity: 1; pointer-events: auto; }
.rc-go .btn { min-width: 180px; }
.rc .cp-say p { min-height: 2.9em; }
.rc.end .cp-say { display: none; }
.rc.end .cp-holo { display: none; }
.rc.end .cp-scene { justify-content: center; padding-bottom: max(14px, env(safe-area-inset-bottom, 0px)); gap: 8px; }
.rc.end .rc-head { animation: none; opacity: 1; }
@media (max-height: 760px) {
  .rc .rc-board { gap: 6px; }
  .rc .rc-t { padding: 7px 10px; }
  .rc .rc-t.rank .rc-n { font-size: clamp(34px, 10vw, 50px); }
  .rc .rc-t.fav .rc-card { width: 58px; }
  .rc .rc-t.fav { grid-template-columns: 58px 1fr; }
}
`;

  // data: { season, rank, total, best, div, record, allBest, bestRank, prize, stats, test }
  function show(data) {
    return new Promise((resolve) => {
      const C = root.Champion && root.Champion.kit;
      const H = HN();
      if (!C || !H || !H.ui) return resolve(false);
      C.css();
      if (!document.getElementById('rc-css')) document.head.appendChild(Object.assign(document.createElement('style'), { id: 'rc-css', textContent: css }));
      const name = C.myName();
      const st = data.stats;
      const favId = st && Object.keys(st.use || {}).sort((a, b) => st.use[b] - st.use[a])[0];
      const fav = favId && D.UNIT_MAP[favId];
      const games = st ? st.w + st.l + st.dw + st.dl : 0;
      const wins = st ? st.w + st.dw : 0;
      const A = root.HNArt;
      const tile = (cls, inner) => `<div class="rc-t ${cls}">${inner}</div>`;
      const tiles = [
        tile('rank', `<span class="rc-n">#${fmt(data.rank)}</span><span>Final standing</span><b>${data.rank === 1 ? 'Number one in the galaxy' : `${fmt(data.rank)} of ${fmt(data.total)}`}</b><small>Every pilot counted, bots included</small>`),
        tile('league', `<span class="rc-bdg">${A && A.badge ? A.badge(data.div.league, data.div.div) : ''}</span><span>League</span><b>${esc(data.div.name)}</b><small>Season best ${fmt(data.best)}</small>`),
        tile(`rec ${data.record ? 'new' : ''}`, `${data.record ? '<i class="rc-flag">NEW</i>' : ''}<span>All-time high</span><b>${fmt(data.allBest)}</b><small>${data.record ? 'Set this season!' : `This season: ${fmt(data.best)}`}</small>`),
        tile('wl', `<span>Record</span><b>${games ? `${wins}–${games - wins}` : '—'}</b><small>${games ? `${Math.round((wins / games) * 100)}% wins · best streak ${st.streak}${st.dw + st.dl ? ` · duels ${st.dw}–${st.dl}` : ''}` : 'No ranked battles counted'}</small>`),
        tile('raids', `<span>Raids</span><b>${st ? fmt(st.raids) : '—'}</b><small>Raid battles fought</small>`),
        fav ? tile('fav', `<span class="rc-card" style="--rc:${(D.RARITIES[fav.rarity] || {}).color || '#7cd0ff'}">${UI().portrait(fav, { plate: false })}</span><span>Favorite card</span><b>${esc(fav.name)}</b><small>Fought in ${fmt(st.use[favId])} battle${st.use[favId] === 1 ? '' : 's'}</small>`) : '',
        tile('prize', `<span>Season reward</span><b>${data.prize ? esc(data.prize) : 'The top 25 earn rewards'}</b>`),
      ];
      const warp = Array.from({ length: 26 }, (_, k) => `<i style="--a:${(k * 360) / 26 + (k % 3) * 4}deg;--d:${(k % 7) * 70}"></i>`).join('');
      const node = UI().el(`<div class="cp rc" role="dialog" aria-modal="true" aria-label="Season ${data.season} recap">
        <div class="cp-bg"></div>${C.bridgeSvg()}<div class="cp-warp">${warp}</div><div class="cp-flash"></div>
        <div class="cp-scene">
          <div class="cp-holo"><div class="cp-cone"></div><div class="cp-ack">${H.ui.ACKBAR}</div><span class="cp-plate">Home One</span><div class="cp-emit"></div></div>
          <div class="rc-head"><small>Season ${data.season} · Final report</small><b>${esc(name)}</b><em>HoloNet season recap</em></div>
          <div class="rc-board">${tiles.join('')}</div>
          <div class="rc-go"><button type="button" class="btn btn-primary" data-rc-go>${data.prize ? 'Collect' : 'Onward'}</button></div>
        </div>
        <div class="cp-say"><span class="cp-face">${H.ui.ACKBAR}</span><b>Admiral Ackbar</b><p data-line></p><span class="cp-tap">Tap to continue</span></div>
      </div>`);
      node.addEventListener('keydown', (e) => { if (e.key === 'Escape') e.stopPropagation(); });
      document.body.appendChild(node);
      const lock = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      sound('reveal_legendary');
      const scene = node.querySelector('.cp-scene');
      const reveal = (cls) => {
        const t = node.querySelector(`.rc-t.${cls}`);
        if (!t) return;
        t.classList.add('on');
        sound('click');
        setTimeout(() => { const top = t.offsetTop - scene.clientHeight / 2 + t.offsetHeight / 2; scene.scrollTo({ top: Math.max(0, top), behavior: 'smooth' }); }, 120);
      };
      const lines = [
        [null, `Congratulations, ${name}! Season ${data.season} is over, and I have your final report.`],
        ['rank', data.rank === 1 ? `You finished number one in the galaxy, out of ${fmt(data.total)} pilots. Bots included, nobody flew better.` : `You finished number ${fmt(data.rank)} in the galaxy, out of ${fmt(data.total)} pilots. That counts every pilot, bots included.`],
        ['league', `You fought in ${data.div.name}, with a season best of ${fmt(data.best)}.`],
        ['rec', data.record ? `That's a new all-time high for you: ${fmt(data.allBest)}. The fleet is impressed!` : `Your all-time high is still ${fmt(data.allBest)}. Something to aim for next season.`],
        ['wl', games ? `In the arena and live duels you won ${wins} and lost ${games - wins}, with a best streak of ${st.streak}.` : `I don't have your battle record for this season. Fight in the arena and I'll count every one next time.`],
        ['raids', st && st.raids ? `You flew ${fmt(st.raids)} raid battle${st.raids === 1 ? '' : 's'} with your allies.` : 'No raids this season. Your allies could use you next time.'],
        ['fav', fav ? `And your favorite card this season: ${fav.name}, in ${fmt(st.use[favId])} battle${st.use[favId] === 1 ? '' : 's'}.` : null],
        ['prize', data.prize ? `For your finish, the fleet sends ${data.prize}.` : 'The top 25 pilots earn rewards. There\'s always next season, Commander.'],
      ];
      const C2 = C;
      (async () => {
        await new Promise((r) => setTimeout(r, 1900));
        for (const [cls, line] of lines) {
          if (cls) reveal(cls);
          if (line) await C2.talk(node, [line]);
        }
        // The report is done: Ackbar steps back so the whole board fits on screen.
        node.classList.add('end');
        node.querySelector('.rc-go').classList.add('on');
        setTimeout(() => scene.scrollTo({ top: 0, behavior: 'smooth' }), 60);
      })();
      node.querySelector('[data-rc-go]').addEventListener('click', () => {
        node.classList.add('out');
        document.documentElement.style.overflow = lock;
        setTimeout(() => { node.remove(); resolve(true); }, 450);
      });
    });
  }

  // A sample recap for testing (owner code): nothing is paid out or saved.
  function test() {
    if (!(HN() && HN().S)) return false;
    const h = HN().S();
    const best = Math.max(h.best || 0, h.rating || 0, 1200);
    const use = {};
    const ids = Object.keys(root.Player.state.units).slice(0, 5);
    ids.forEach((id, i) => { use[id] = 30 - i * 5; });
    show({ season: HN().seasonLabel ? HN().seasonLabel((seasonNow() || 741) - 1) : 1, rank: 7, total: 112, best, div: HN().divOf(best), record: true, allBest: best, prize: 'a sample reward (this is a test)', stats: { w: 41, l: 17, dw: 6, dl: 3, raids: 12, streak: 9, use } });
    return true;
  }

  root.Recap = { show, record, seasonStats, test };

  const hook = () => {
    const H = UI() && UI().hooks;
    if (!H || H.__recap) return;
    H.__recap = true;
    if (H.battleEnd) H.battleEnd.push((b, p, won) => { try { record(b, p, won); } catch (e) { /* never block a battle */ } });
    // Owner test code (9 letters): SEASONEND plays a sample recap.
    const before = H.redeem;
    const CODE = String.fromCharCode(83, 69, 65, 83, 79, 78, 69, 78, 68);
    H.redeem = (code) => {
      if (code !== CODE) return before ? before(code) : false;
      if (!(root.HN && root.HN.S)) { UI().toast('Open the HoloNet first, then try the code again.'); return true; }
      test();
      return true;
    };
  };
  if (root.UI) hook(); else root.addEventListener('load', hook);
})(window);
