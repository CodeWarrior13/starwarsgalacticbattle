// Update 2.5: MAX OUT. Everything, everywhere: every world liberated (hidden
// ones too), every card collected (Secret cards too), every card at level 50
// and 7★ (Elite on every common, rare and epic) and every card holo. Earn it
// and a cutscene plays, the MAXED OUT medal joins your badges and the whole
// Galactic set unlocks: title, frame, picture, banner, win screen, battle
// intro, card back, crate theme, attack colour, holo frame and victory pose.
// None of it is shown anywhere until you've earned it. When an update adds new
// cards or worlds, the medal and its rewards are put away until you max those
// too. Art loads only once you've earned it (js/max25-art.js). Off until 2.5.
(function (root) {
  'use strict';
  if (!(root.Update25 && root.Update25.on())) return;
  const UI = root.UI; const Player = root.Player; const D = root.GameData;
  if (!UI || !Player || !D) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => Number(n || 0).toLocaleString('en-US');
  const save = () => { try { Player.save(); } catch (e) { /* storage blocked */ } };
  const B = () => (root.Col25 ? root.Col25.B() : {});

  // ---------- The requirements ----------
  const cards = () => D.UNITS.filter((u) => !u.boss && (!u.exclusive || u.rarity === 'secret') && !u.raid && !u.pf25 && D.UNIT_MAP[u.id] === u);
  const worlds = () => (D.PLANETS || []).map((p) => p.id).concat(D.PLANET_MAP && D.PLANET_MAP.mortis ? ['mortis'] : []);
  const holo = (id) => !!(root.Holo25 && root.Holo25.isHolo && root.Holo25.isHolo(id));
  const needsElite = (u) => ['common', 'rare', 'epic'].includes(u.rarity);
  let cache = null; let cacheAt = 0;
  function reqs() {
    if (cache && Date.now() - cacheAt < 2000) return cache;
    const st = Player.state || {}; const own = st.units || {};
    const L = cards(); const W = worlds();
    const done = (id) => !!(Player.planetComplete && Player.planetComplete(id));
    const maxed = (u) => { const x = own[u.id]; return !!x && x.level >= 50 && x.stars >= (D.MAX_STARS || 7) && (!needsElite(u) || !!x.elite); };
    cache = [
      ['Every world liberated, hidden worlds included', W.filter(done).length, W.length],
      ['Every card collected, Secret cards included', L.filter((u) => own[u.id]).length, L.length],
      ['Every card at level 50 and 7★ (Elite on every common, rare and epic)', L.filter(maxed).length, L.length],
      ['Every card holo', L.filter((u) => own[u.id] && holo(u.id)).length, L.length],
    ];
    cacheAt = Date.now();
    return cache;
  }
  const done = () => { try { return reqs().every(([, h, n]) => h >= n && n > 0); } catch (e) { return false; } };

  // ---------- The art (only for players who've earned it) ----------
  let art = root.MX25ART || null; let loading = null;
  const loadArt = () => {
    if (art) return Promise.resolve(art);
    if (loading) return loading;
    loading = new Promise((res) => { const s = document.createElement('script'); s.src = root.__ver ? root.__ver('js/max25-art.js') : 'js/max25-art.js'; s.onload = () => { art = root.MX25ART || null; res(art); }; s.onerror = () => { loading = null; res(null); }; document.head.appendChild(s); });
    return loading;
  };
  let styled = false;
  const style = () => { if (styled || !art) return; styled = true; const s = document.createElement('style'); s.textContent = art.css + MXCSS; document.head.appendChild(s); };
  // The frame drawing for js/holonet.js: the proposal's ring, nudged from radius 42 to the game's 44.
  root.MX25 = { frame: () => (art ? `<g transform="scale(1.048)">${art.frame.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '').replace(/<g clip-path="url\(#[^)]+\)">[\s\S]*?<\/g>/, '')}</g>` : '') };

  // ---------- Hooking the rewards into the other 2.5 systems ----------
  let hooked = false;
  function hookLists() {
    const C = root.Cos25; if (!C || hooked) return;
    hooked = true;
    const get = () => done();
    C.TITLES.push({ id: 'maxed_out', n: 'Maxed Out', how: 'MAX OUT', chk: () => done(), earn: true, fix: 'galactic', max: true });
    C.WINS.push({ id: 'galaxy', n: 'Galaxy Conquered', c: '#b8a8ff', get, how: 'MAX OUT', max: true });
    C.PACKS.push({ id: 'vault', n: 'Holocron Vault', c: '#b8a8ff', get, how: 'MAX OUT', max: true });
    if (C.CBACKS) C.CBACKS.push({ id: 'galactic', n: 'Galaxy Holocron', c: '#b8a8ff', get, how: 'MAX OUT', max: true });
    C.POSES.push({ id: 'galaxy', n: 'Galaxy Salute', ty: 'Any MVP', c: '#b8a8ff', how: 'MAX OUT', max: true });
  }
  // Art into the scenes, the card backs, the colours and the pictures.
  let arted = false;
  async function hookArt() {
    if (arted) return; const a = await loadArt(); if (!a) return; arted = true; style();
    const FX = root.Cos25FX;
    if (FX && FX.add) { FX.add('wi', 'galaxy', a.win); FX.add('pa', 'vault', a.crate); FX.add('po', 'galaxy', a.pose); }
    const cbAdd = () => { if (root.CB25 && root.CB25.add) { root.CB25.add('galactic', a.back); return true; } return false; };
    if (!cbAdd()) { let k = 0; const t = setInterval(() => { if (cbAdd() || ++k > 60) clearInterval(t); }, 1000); }
    if (root.Art && root.Art.addArt) root.Art.addArt('char', 'pf25_galaxy', () => a.pfp.replace(/^<svg[^>]*>/, '<g transform="translate(50 50)">').replace(/<\/svg>$/, '</g>'));
  }
  // Rewards that live as owned flags elsewhere (the banner, the intro, the pose) follow the medal:
  // set while you're maxed, put away if an update adds something new, back when you max it.
  function syncOwn() {
    const C = root.Cos25; const c = C && C.ready && C.ready() ? C.C() : null;
    const on = done();
    if (c) {
      const keys = ['bn:whole_galaxy', 'in:holocron_opens', 'po:galaxy'];
      let ch = false;
      for (const k of keys) { if (on && !c.own[k]) { c.own[k] = 1; ch = true; } if (!on && c.own[k]) { delete c.own[k]; ch = true; } }
      if (!on) {
        if (c.eq.in === 'holocron_opens') { c.eq.in = 'vs'; ch = true; }
        if (c.eq.po === 'galaxy') { delete c.eq.po; ch = true; }
        if (c.mvp && c.mvp.galaxy) { delete c.mvp.galaxy; ch = true; }
        if (c.t && c.t.maxed_out) { delete c.t.maxed_out; ch = true; }
      } else if (!(c.mvp && c.mvp.galaxy)) { c.mvp = c.mvp || {}; c.mvp.galaxy = 1; ch = true; }
      if (ch) C.save();
    }
    if (on && !B().max) { B().max = 1; save(); }
  }

  // ---------- The cutscene ----------
  async function cutscene() {
    const a = await loadArt(); if (!a) return; style();
    const o = document.createElement('div'); o.className = 'mx-cut'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'MAX OUT');
    // The handwriting font is only fetched for this moment.
    if (!document.getElementById('mx-font')) { const l = document.createElement('link'); l.id = 'mx-font'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap'; document.head.appendChild(l); }
    o.innerHTML = `<div class="mx-stage">${a.cut}</div><button type="button" class="mx-skip">Tap to continue</button>`;
    document.body.appendChild(o);
    requestAnimationFrame(() => o.classList.add('in'));
    const close = () => { o.classList.remove('in'); setTimeout(() => o.remove(), 400); };
    setTimeout(() => o.querySelector('.mx-skip').classList.add('show'), 6500);
    // The scene is drawn as a loop; it stops on its last frame (medal and title) instead of starting over.
    setTimeout(() => o.classList.add('hold'), 8400);
    o.addEventListener('click', close);
  }
  function check() {
    if (!Player.state || (Player.tutorialPending && Player.tutorialPending())) return;
    hookLists();
    const on = done();
    syncOwn();
    if (!on) return;
    hookArt();
    if (!B().maxCut && !(UI.App && UI.App.battleActive) && !document.querySelector('.modal-backdrop, .feat-show, .tut-intro')) { B().maxCut = 1; save(); cutscene(); }
  }

  // ---------- In the badge sheet ----------
  // Before it's earned: a locked medal with ??? and the four requirements. After: the medal and the full set.
  const LOCKED = '<svg viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid meet"><circle r="76" fill="#141824" stroke="#3a4252" stroke-width="6"/><path d="M0 -36 L32 -18 L32 18 L0 36 L-32 18 L-32 -18Z" fill="#1a2030" stroke="#3a4252" stroke-width="3"/><text y="14" text-anchor="middle" font-family="Oxanium,sans-serif" font-size="40" font-weight="900" fill="#5a6478">?</text><rect x="-56" y="71" width="112" height="22" rx="3" fill="#0a0e18" stroke="#3a4252"/><text y="86.5" text-anchor="middle" font-family="Oxanium,sans-serif" font-size="11" font-weight="900" letter-spacing="3" fill="#5a6478">???</text></svg>';
  const cell = () => { const on = done(); return `<button type="button" class="bd-cell mx-cell${on ? '' : ' none'}" data-mx><span class="bd-med">${on && art ? art.medal : LOCKED}</span><b>${on ? 'MAXED OUT' : '???'}</b><small>${on ? 'Everything, everywhere' : 'The final badge'}</small></button>`; };
  async function detail() {
    const on = done(); if (on) await hookArt();
    const R = reqs();
    const SET = [['Title', 'Maxed Out · Galactic colour'], ['Frame', 'Galactic Holocron'], ['Picture', 'The Galaxy Holocron'], ['Banner', 'The Whole Galaxy'], ['Win screen', 'Galaxy Conquered'], ['Battle intro', 'Holocron Opens'], ['Card back', 'Galaxy Holocron'], ['Crate theme', 'Holocron Vault'], ['Attack colour', 'Galactic'], ['Holo frame', 'Galactic'], ['Victory pose', 'Galaxy Salute']];
    const m = UI.openModal(`<div class="bd bd-one mx-one"><div class="bd-top"><div class="bd-big"><span class="bd-med">${on && art ? art.medal : LOCKED}</span></div><div class="bd-info"><h2>${on ? 'MAXED OUT' : '???'}</h2><p class="bd-req">${on ? 'You maxed out the galaxy.' : 'The last badge of all. Max out everything to reveal it.'}</p><div class="bd-btns"><button type="button" class="btn btn-small" data-close>Close</button>${on ? '<button type="button" class="btn btn-small" data-replay>Watch again</button>' : ''}</div></div></div>
      <div class="mx-reqs">${R.map(([t, h, n]) => `<div class="mx-req${h >= n ? ' ok' : ''}"><b>${h >= n ? '✓' : ''}</b><span>${esc(t)}</span><em>${fmt(h)} / ${fmt(n)}</em><i class="bd-bar"><u style="width:${n ? Math.round((h / n) * 100) : 0}%"></u></i></div>`).join('')}</div>
      ${on ? `<div class="mx-set">${SET.map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join('')}</div>` : ''}</div>`, { wide: true });
    m.root.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) m.close(); if (e.target.closest('[data-replay]')) { m.close(); cutscene(); } });
  }

  // ---------- Hooks ----------
  if (UI.hooks && UI.hooks.battleEnd) UI.hooks.battleEnd.push(() => setTimeout(() => { cache = null; try { check(); } catch (e) { /* ignore */ } }, 2500));
  const boot = () => { if (!Player.state) return setTimeout(boot, 500); try { check(); } catch (e) { /* ignore */ } };
  setTimeout(boot, 3500);
  setInterval(() => { try { cache = null; check(); } catch (e) { /* ignore */ } }, 20000);

  const MXCSS = `.mx-cut{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;background:#05030f;opacity:0;transition:opacity .4s}.mx-cut.in{opacity:1}
.mx-stage{width:min(96vw,900px);margin:0 auto}.mx-stage .r42-cut{width:100%;max-width:none;height:auto;display:block;margin:0 auto;overflow:visible;border-radius:0}.mx-cut.hold *{animation-play-state:paused!important}
.mx-skip{position:absolute;bottom:calc(20px + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);opacity:0;transition:opacity .5s;font:800 12px var(--font-display,Oxanium,sans-serif);letter-spacing:.1em;color:#c8b8ff;background:none;border:1px solid #5a4aa0;border-radius:999px;padding:8px 16px}.mx-skip.show{opacity:1}
.tt-galactic{background:radial-gradient(circle at 30% 50%,#ffd8f4,#7a5cff 25%,#2a1470 50%,#5ae8ff 70%,#ff5ad0 90%);background-size:220% 220%;-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:.4px rgba(255,255,255,.6);animation:mxTt 8s linear infinite}@keyframes mxTt{to{background-position:220% 0}}
body.perf-on .tt-galactic{animation:none}`;
  const BASE = `.mx-reqs{display:grid;gap:8px}.mx-req{display:grid;grid-template-columns:20px 1fr auto;gap:2px 8px;align-items:center;padding:8px 10px;border:1px solid #1e2a40;border-radius:10px;background:#0b1020}.mx-req b{color:#2ad84a}.mx-req em{font:800 11px var(--font-display,Oxanium,sans-serif);font-style:normal;color:#ffd23f}.mx-req .bd-bar{grid-column:2 / 4;width:100%}.mx-req.ok span{color:#9affb0}
.mx-set{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px}.mx-set div{padding:6px 10px;border:1px solid #3a2a80;border-radius:8px;background:#100a28}.mx-set small{display:block;font-size:10px;color:#9a8ad0}.mx-set b{font:800 12px var(--font-display,Oxanium,sans-serif)}
.mx-cell b{letter-spacing:.06em}`;
  const st = document.createElement('style'); st.textContent = BASE; document.head.appendChild(st);
  root.Max25 = { done, reqs, cell, detail, cutscene, check };
})(window);
