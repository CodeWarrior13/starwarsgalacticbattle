// Screens, shared components, modals and toasts.

(function (root) {
  const D = root.GameData;
  const Player = root.Player;
  const Art = root.Art;

  // ---------- Small helpers ----------
  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => Math.round(n).toLocaleString('en-US');

  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function initials(name) {
    const words = name.replace(/^(The|Darth|Count|General|Grand Moff|Grand Admiral|Emperor|Lord) /, '').replace(/[^A-Za-z0-9\- ]/g, '').split(/[\s-]+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  // Currency chip: icon + amount.
  function cur(key, amount, cls) {
    return `<span class="cur cur-${key} ${cls || ''}" title="${D.CURRENCIES[key].name}">${Art.ICONS[key]}<b>${fmt(amount)}</b></span>`;
  }
  function costLabel(cost) {
    const key = cost.aurodium ? 'aurodium' : cost.crystals ? 'crystals' : 'credits';
    return cur(key, cost[key]);
  }

  // Cover art with the name plate along the bottom and initials in the corner.
  function portrait(def, opts = {}) {
    return `<div class="portrait ${def.kind} ${def.faction} ${def.boss ? 'is-boss' : ''}">
      ${Art.unitArt(def)}
      <span class="monogram" title="${def.faction === 'light' ? 'Light Side' : 'Dark Side'}">${initials(def.name)}</span>
      ${opts.plate === false ? '' : `<span class="nameplate"><i title="${def.role}">${D.ROLE_ICONS[def.role]}</i>${esc(def.name)}</span>`}
    </div>`;
  }

  function stars(n) {
    let s = '';
    for (let i = 1; i <= D.MAX_STARS; i++) s += i <= n ? '★' : '<span class="off">★</span>';
    return `<span class="stars" aria-label="${n} stars">${s}</span>`;
  }

  function unitCard(def, opts = {}) {
    const owned = opts.owned != null ? opts.owned : Player.owns(def.id);
    const u = owned ? Player.unit(def.id) : null;
    const level = opts.level || (u ? u.level : 1);
    const starCount = opts.stars || (u ? u.stars : 1);
    let shard = '';
    if (u && !opts.hideShards && u.stars < D.MAX_STARS) {
      const need = D.STAR_COSTS[u.stars - 1];
      const pct = Math.min(100, (u.shards / need) * 100);
      shard = `<div class="shardbar ${u.shards >= need ? 'ready' : ''}" title="${u.shards}/${need} shards"><i style="width:${pct}%"></i></div>`;
    }
    const tag = opts.tag || 'button';
    return `<${tag} class="ucard rarity-${def.rarity} ${owned ? '' : 'locked'} ${opts.selected ? 'selected' : ''} ${opts.holo ? 'holo' : ''}" data-id="${def.id}" ${tag === 'button' ? `type="button" aria-label="${esc(def.name)}"` : ''}>
      ${opts.badge ? `<span class="sel-badge">${opts.badge}</span>` : ''}
      ${portrait(def)}
      <div class="ucard-body">
        <div class="ucard-meta"><span class="rar">${D.RARITIES[def.rarity].label}</span><span>${owned ? 'Lv ' + level : 'Locked'}</span></div>
        ${owned ? stars(starCount) : '<span class="muted" style="font-size:12px">Find in the Black Market</span>'}
        ${owned ? `<div class="ucard-meta"><span class="power">⚡ ${fmt(D.power(def, level, starCount))}</span><span>${def.kind === 'ship' ? 'Ship' : 'Hero'}</span></div>` : ''}
        ${opts.traits ? `<div class="trait-icons">${D.traitsOf(def.id).map((t) => `<span title="${D.TRAIT_INFO[t].label}">${D.TRAIT_INFO[t].icon}</span>`).join('')}</div>` : ''}
        ${shard}
      </div>
    </${tag}>`;
  }

  function miniPortrait(def) {
    return `<span class="mini ${def.boss ? 'boss-mini' : ''}" title="${esc(def.name)}">${portrait(def, { plate: false })}</span>`;
  }

  // ---------- Toasts and modals ----------
  function toast(text) {
    const t = el(`<div class="toast">${esc(text)}</div>`);
    $('#toast-root').appendChild(t);
    setTimeout(() => t.remove(), 2700);
  }

  function openModal(html, opts = {}) {
    const backdrop = el(`<div class="modal-backdrop"><div class="modal ${opts.cls || ''} ${opts.small ? 'small' : ''}" role="dialog" aria-modal="true">${html}</div></div>`);
    const close = () => {
      backdrop.remove();
      document.removeEventListener('keydown', onKey);
      if (opts.onClose) opts.onClose();
    };
    const onKey = (e) => {
      if (e.key === 'Escape' && opts.dismissable !== false) close();
      if (opts.onKey) opts.onKey(e);
    };
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop && opts.dismissable !== false) close();
    });
    document.addEventListener('keydown', onKey);
    $('#modal-root').appendChild(backdrop);
    const first = backdrop.querySelector('[data-autofocus]') || backdrop.querySelector('button');
    if (first) first.focus({ preventScroll: true });
    return { root: backdrop, close };
  }

  // In-page confirm: the artifact viewer blocks window.confirm.
  function confirmBox(title, body, okLabel) {
    return new Promise((resolve) => {
      let answered = false;
      const m = openModal(`
        <h2>${esc(title)}</h2>
        <p class="muted">${esc(body)}</p>
        <div class="modal-actions">
          <button class="btn" type="button" data-a="no">Cancel</button>
          <button class="btn btn-primary" type="button" data-a="yes">${esc(okLabel || 'Confirm')}</button>
        </div>`, { small: true, onClose: () => { if (!answered) resolve(false); } });
      m.root.addEventListener('click', (e) => {
        const a = e.target.closest('[data-a]');
        if (!a) return;
        answered = true;
        m.close();
        resolve(a.dataset.a === 'yes');
      });
    });
  }

  // ---------- Wallet ----------
  const lastWallet = {};
  // Currency chips roll up (or down) to the new amount.
  function countUp(node, from, to) {
    const t0 = performance.now();
    const dur = Math.min(900, 300 + Math.abs(to - from) * 0.4);
    const id = String(t0);
    node.dataset.counting = id;
    const step = (now) => {
      if (node.dataset.counting !== id) return;
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      node.textContent = fmt(Math.round(from + (to - from) * e));
      if (k < 1) requestAnimationFrame(step);
      else delete node.dataset.counting;
    };
    requestAnimationFrame(step);
  }

  function updateWallet() {
    const s = Player.state;
    const lv = $('#acct-level');
    if (lv) {
      const a = s.account;
      lv.textContent = a.level;
      const need = D.xpToNext(a.level);
      $('#acct-bar').style.width = a.level >= D.MAX_ACCOUNT_LEVEL ? '100%' : `${Math.min(100, (a.xp / need) * 100)}%`;
      lv.closest('.account').title = `Account level ${a.level} · ${a.xp}/${need} XP · ${Player.slots()} squad slots`;
    }
    for (const key of ['credits', 'crystals', 'aurodium']) {
      const node = $('#' + key);
      if (!node) continue;
      if (lastWallet[key] != null && lastWallet[key] !== s[key]) countUp(node, lastWallet[key], s[key]);
      else if (!node.dataset.counting) node.textContent = fmt(s[key]);
      if (lastWallet[key] != null && lastWallet[key] !== s[key]) {
        const chip = node.closest('.currency');
        chip.classList.remove('bump');
        void chip.offsetWidth;
        chip.classList.add('bump');
      }
      lastWallet[key] = s[key];
    }
  }

  // ---------- Router ----------
  const App = {
    current: null,
    params: {},
    ui: { collectionKind: 'all', collectionFaction: 'all', collectionSort: 'strong', campaignKind: 'character', betIndex: 0 },

    go(screen, params) {
      if (App.battleActive && screen !== 'battle') return;
      App.current = screen;
      App.params = params || {};
      $$('.main-nav button').forEach((b) => {
        const active = b.dataset.nav === screen || (b.dataset.nav === 'campaign' && screen === 'squad');
        b.classList.toggle('active', active);
      });
      const container = $('#screen');
      container.innerHTML = '';
      container.appendChild(Screens[screen](App.params));
      updateWallet();
      window.scrollTo({ top: 0 });
    },

    refresh() {
      App.go(App.current, App.params);
    },
  };

  // ---------- Screens ----------
  const Screens = {};

  Screens.home = function () {
    const s = Player.state;
    const owned = Object.keys(s.units).length;
    const liberated = D.PLANETS.filter((p) => Player.planetComplete(p.id)).length;
    const bossesBeaten = Object.keys(s.bosses).length;
    const current = Player.currentPlanet();

    const v = el(`<section class="view">
      <div class="home-galaxy galaxy-map" data-home-map>
        <canvas data-map-canvas></canvas>
        <div class="hg-actors" data-actors aria-hidden="true"></div>
        ${D.PLANETS.map((p) => {
          const unlocked = Player.planetUnlocked(p.id);
          const cleared = Player.planetCleared(p.id);
          return `<button class="map-planet ${unlocked ? '' : 'locked'} ${p.id === current.id ? 'selected' : ''} ${Player.planetComplete(p.id) ? 'done' : ''}" type="button" data-go="campaign" data-planet="${p.id}" style="left:${p.map.x}%;top:${p.map.y}%" ${unlocked ? '' : 'disabled'} aria-label="${esc(p.name)}">
            <span class="map-label">${esc(p.name)}<small>${unlocked ? `${cleared}/${p.stages.length}` : '🔒'}</small></span>
          </button>`;
        }).join('')}
        <div class="hg-title">
          <p class="eyebrow">A long time ago, in a galaxy far, far away…</p>
          <h1>Command <em>the galaxy.</em></h1>
        </div>
        <div class="hg-progress"><b>${liberated}/${D.PLANETS.length}</b> worlds liberated<i style="--p:${(Player.totalCleared() / D.PLANETS.reduce((a, p) => a + p.stages.length, 0)) * 100}%"></i></div>
        <div class="hg-actions">
          <button class="btn btn-primary" type="button" data-go="campaign" data-planet="${current.id}">Continue on ${esc(current.name)}</button>
          <button class="btn" type="button" data-go="campaign" data-kind="boss">Boss Battles</button>
        </div>
      </div>
      <p class="hg-blurb muted">Collect heroes, villains and starfighters, combine their traits for powerful synergies, and liberate ${D.PLANETS.length} worlds in turn-based battles on living battlefields. Tap a world to jump straight to it.</p>

      ${accountPanel()}

      <div class="stat-row">
        <div class="stat"><b>${owned}/${D.UNITS.length}</b><span>Units collected</span></div>
        <div class="stat"><b>${liberated}/${D.PLANETS.length}</b><span>Planets liberated</span></div>
        <div class="stat"><b>${bossesBeaten}/${D.BOSS_ENCOUNTERS.length}</b><span>Bosses defeated</span></div>
        <div class="stat"><b>${s.stats.bestSpin}×</b><span>Luckiest spin</span></div>
      </div>

      <div class="mode-grid">
        <button class="mode-card" type="button" data-go="campaign" data-kind="map">
          <span class="mode-art planet-art" data-sphere="${current.id}"><canvas></canvas></span>
          <span class="mode-text"><span class="eyebrow">Galaxy Map</span><h3>${D.PLANETS.length} Worlds</h3><span class="muted">${Player.totalCleared()} of ${D.PLANETS.reduce((a, p) => a + p.stages.length, 0)} stages cleared. Next: ${esc(current.name)}.</span></span>
        </button>
        ${modeCard('boss', 'Boss Battles', 'Giant Threats', `Rancors, dragons, Star Destroyers. ${bossesBeaten} of ${D.BOSS_ENCOUNTERS.length} defeated.`, 'rancor')}
        <button class="mode-card" type="button" data-go="collection">
          <span class="mode-art">${Art.unitArt(D.UNIT_MAP.luke)}</span>
          <span class="mode-text"><span class="eyebrow">Collection</span><h3>Classes & Traits</h3><span class="muted">${owned} units. Filter by class, plan synergies, upgrade your squad.</span></span>
        </button>
        <button class="mode-card market-card" type="button" data-go="market">
          <span class="mode-art">${Art.merchantArt()}</span>
          <span class="mode-text"><span class="eyebrow">Night Market</span><h3>Nar Shaddaa</h3><span class="muted">Crates, flash sales, lucky charms, Sabacc and the shell game.</span></span>
        </button>
      </div>

      <p class="muted" style="font-size:13px">Progress saves automatically in this browser. <button class="linkish" type="button" data-reset>Reset progress</button></p>
    </section>`);

    $$('[data-sphere]', v).forEach((n) => spinSphere($('canvas', n), n.dataset.sphere));
    requestAnimationFrame(() => {
      const mc = $('[data-map-canvas]', v);
      if (mc) new root.GalaxyMap(mc, D.PLANETS, () => ({
        unlocked: (id) => Player.planetUnlocked(id),
        cleared: (id) => Player.planetCleared(id),
        current: current.id,
      }));
      homeActors($('[data-actors]', v));
    });
    v.addEventListener('click', async (e) => {
      const go = e.target.closest('[data-go]');
      if (go) {
        if (go.dataset.kind) App.ui.campaignKind = go.dataset.kind;
        if (go.dataset.planet) {
          App.ui.campaignKind = 'map';
          App.ui.planet = go.dataset.planet;
        }
        App.go(go.dataset.go);
      }
      if (e.target.closest('[data-reset]')) {
        if (await confirmBox('Reset all progress?', 'Your roster, currencies and campaign progress will be wiped and you will start over with the starter squad.', 'Reset')) {
          Player.reset();
          toast('Progress reset. Welcome back, Commander.');
          App.go('home');
        }
      }
    });
    return v;
  };

  // Ambient scenes drifting across the home galaxy, like a title-screen diorama:
  // dogfights, Star Destroyers, the Falcon jumping to lightspeed, Mando on his
  // jetpack, Grogu's pram, R2's escape pod and a probe droid.
  const ACTOR_ART = {
    mando: `<svg viewBox="0 0 100 100"><path d="M40 60 L36 96 L44 62Z" fill="#ffb03a"/><path d="M41 60 L39 84 L43 61Z" fill="#fff4c0"/><rect x="36" y="38" width="10" height="24" rx="3" fill="#9aa0a8"/><path d="M50 40 L34 74 L52 68Z" fill="#6a5440"/><rect x="47" y="38" width="20" height="28" rx="5" fill="#8a8f84"/><rect x="49" y="40" width="16" height="10" rx="3" fill="#c8ced4"/><rect x="50" y="64" width="7" height="20" rx="2" fill="#5a5a50"/><rect x="59" y="64" width="7" height="18" rx="2" fill="#5a5a50" transform="rotate(-20 62 64)"/><circle cx="58" cy="28" r="11" fill="#c8ced4"/><path d="M50 26 H66 V30 H60 V39 H56 V30 H50Z" fill="#111"/><ellipse cx="54" cy="22" rx="4" ry="2" fill="#fff" opacity=".6"/></svg>`,
    grogu: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="84" rx="22" ry="5" fill="#8fd3ff" opacity=".35"/><path d="M18 56 L82 56 Q80 74 50 76 Q20 74 18 56Z" fill="#9aa0a8"/><path d="M41 48 L20 40 L40 53Z" fill="#8ab870"/><path d="M59 48 L80 40 L60 53Z" fill="#8ab870"/><ellipse cx="50" cy="48" rx="10" ry="9" fill="#9ac880"/><circle cx="46" cy="47" r="2.4" fill="#111"/><circle cx="54" cy="47" r="2.4" fill="#111"/><circle cx="46.6" cy="46.3" r=".8" fill="#fff"/><circle cx="54.6" cy="46.3" r=".8" fill="#fff"/><path d="M36 56 Q50 50 64 56Z" fill="#b89a70"/><path d="M16 56 A34 26 0 0 1 36 34" stroke="#c8ccd0" stroke-width="4" fill="none"/><rect x="16" y="54" width="68" height="4" rx="2" fill="#c8ccd0"/></svg>`,
    pod: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="24" fill="#d8dce0"/><path d="M26 50 A24 24 0 0 0 74 50Z" fill="#aab0b8"/><circle cx="44" cy="44" r="8" fill="#1a2433"/><path d="M38 44 A6 6 0 0 1 50 44Z" fill="#5a8ad8"/><circle cx="44" cy="41" r="1.4" fill="#ff3a3a"/><rect x="70" y="46" width="12" height="8" rx="2" fill="#8a929e"/><circle cx="84" cy="50" r="3" fill="#9fdcff" opacity=".8"/></svg>`,
    probe: `<svg viewBox="0 0 100 100"><g stroke="#3a3d44" stroke-width="2" fill="none"><path d="M44 58 L38 84 L34 92"/><path d="M50 60 L50 90"/><path d="M56 58 L62 84 L66 92"/><path d="M40 52 L24 70"/></g><circle cx="50" cy="44" r="16" fill="#2a2d33"/><ellipse cx="45" cy="38" rx="6" ry="3" fill="#6a707a" opacity=".6"/><circle cx="44" cy="46" r="2.4" fill="#ff3a3a"/><circle cx="52" cy="48" r="2" fill="#ff3a3a"/><circle cx="57" cy="44" r="1.6" fill="#ff3a3a"/><path d="M50 28 L50 12 M56 30 L62 16" stroke="#6a707a" stroke-width="1.4"/></svg>`,
  };

  function homeActors(host) {
    if (!host || !motionOK()) return;
    const shipSvg = (id) => Art.shipOnly(D.UNIT_MAP[id]);
    const fly = (html, o) => {
      const W = host.clientWidth;
      const H = host.clientHeight;
      const dir = o.dir || (Math.random() < 0.5 ? 1 : -1);
      const y0 = (o.y != null ? o.y : 0.1 + Math.random() * 0.8) * H;
      const y1 = y0 + (o.dy != null ? o.dy : (Math.random() - 0.5) * 0.4) * H;
      const size = o.size || 44;
      const a = el(`<div class="hg-actor ${o.cls || ''}" style="width:${size}px;height:${size}px">${html}</div>`);
      host.appendChild(a);
      const x0 = dir > 0 ? -size * 1.5 : W + size * 1.5;
      const x1 = dir > 0 ? W + size * 1.5 : -size * 1.5;
      const heading = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI + (o.nose === false ? 0 : 90);
      const flip = o.nose === false && dir < 0 ? ' scaleX(-1)' : '';
      const rot = o.nose === false ? (o.spin ? 'rotate(0deg)' : '') : `rotate(${heading}deg)`;
      const rot2 = o.nose === false ? (o.spin ? 'rotate(360deg)' : '') : `rotate(${heading}deg)`;
      const midY = (y0 + y1) / 2 + (o.arc || 0) * H;
      const anim = a.animate([
        { transform: `translate(${x0}px, ${y0}px) ${rot}${flip}` },
        { transform: `translate(${(x0 + x1) / 2}px, ${midY}px) ${o.spin ? 'rotate(180deg)' : rot}${flip}`, offset: 0.5 },
        { transform: `translate(${x1}px, ${y1}px) ${rot2}${flip}` },
      ], { duration: o.dur || 7000, delay: o.delay || 0, easing: o.ease || 'linear', fill: 'both' });
      anim.onfinish = () => a.remove();
      return a;
    };
    const scenes = [
      () => { // Dogfight: an X-wing chased by two TIEs firing.
        const dir = Math.random() < 0.5 ? 1 : -1;
        const y = 0.15 + Math.random() * 0.6;
        const dy = (Math.random() - 0.5) * 0.3;
        const lead = Math.random() < 0.5 ? ['x_wing', 'tie_fighter'] : ['a_wing', 'tie_interceptor'];
        fly(shipSvg(lead[0]), { dir, y, dy, size: 46, dur: 5200 });
        [0, 1].forEach((i) => {
          const t = fly(shipSvg(lead[1]) + '<i class="hg-bolt"></i><i class="hg-bolt b2"></i>', { dir, y: y + (i ? 0.06 : -0.05), dy, size: 38, dur: 5200, delay: 500 + i * 260 });
          t.classList.add('gunner');
        });
      },
      () => fly(shipSvg('tie_bomber'), { size: 40, dur: 9000 }),
      () => { const a = fly(shipSvg('falcon') + '<i class="hg-streak"></i>', { size: 56, dur: 2600, ease: 'cubic-bezier(.6,0,.9,.4)', dy: 0 }); a.classList.add('jump'); },
      () => fly(shipSvg(['slave_one', 'razor_crest', 'b_wing', 'y_wing', 'vulture_droid', 'tie_advanced', 'lambda_shuttle'][Math.floor(Math.random() * 7)]), { size: 50, dur: 8000 }),
      () => fly(Art.shipOnly({ shape: 'isd' }), { size: 120, dur: 26000, y: 0.3 + Math.random() * 0.4, dy: 0.04, cls: 'far' }),
      () => fly(ACTOR_ART.mando, { size: 54, nose: false, dur: 7000, arc: -0.15 }),
      () => fly(ACTOR_ART.grogu, { size: 50, nose: false, dur: 11000, dy: 0.05, cls: 'bob' }),
      () => fly(ACTOR_ART.pod, { size: 40, nose: false, spin: true, dur: 14000 }),
      () => fly(ACTOR_ART.probe, { size: 46, nose: false, dur: 16000, dy: 0.1, cls: 'bob' }),
    ];
    const weights = [3, 1, 2, 2, 1, 2, 1.5, 1, 1];
    const pickScene = () => {
      let r = Math.random() * weights.reduce((a, b) => a + b, 0);
      for (let i = 0; i < scenes.length; i++) { r -= weights[i]; if (r <= 0) return scenes[i]; }
      return scenes[0];
    };
    scenes[4]();
    scenes[0]();
    const tick = () => {
      if (!host.isConnected) return;
      if (!document.hidden && host.childElementCount < 10) pickScene()();
      setTimeout(tick, 2200 + Math.random() * 2600);
    };
    setTimeout(tick, 1500);
  }

  function accountPanel() {
    const a = Player.state.account;
    const need = D.xpToNext(a.level);
    const next = Player.nextSlotRule();
    const slots = Player.slots();
    return `<div class="account-panel">
      <div class="acct-ring" style="--p:${a.level >= D.MAX_ACCOUNT_LEVEL ? 100 : Math.round((a.xp / need) * 100)}"><b>${a.level}</b><span>Account</span></div>
      <div class="acct-info">
        <p class="eyebrow">Commander rank</p>
        <h3>Account level ${a.level}${a.level >= D.MAX_ACCOUNT_LEVEL ? ' · Max' : ''}</h3>
        <p class="muted small">${a.level >= D.MAX_ACCOUNT_LEVEL ? 'Maximum rank reached.' : `${fmt(a.xp)} / ${fmt(need)} XP to level ${a.level + 1}. Every battle earns XP, and each level pays out credits and Kyber.`}</p>
      </div>
      <div class="acct-slots">
        <p class="eyebrow">Squad slots · ground & fleet</p>
        <div class="slot-pips">${[1, 2, 3, 4, 5].map((n) => `<span class="${n <= slots ? 'on' : ''}">${n <= slots ? n : '🔒'}</span>`).join('')}</div>
        <p class="muted small">${next ? `Slot ${next.slot}: ${slotRequirement(next)}` : 'All 5 slots unlocked.'}</p>
      </div>
    </div>`;
  }

  // Small rotating planet drawn on a canvas.
  function spinSphere(canvas, id) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;
    const draw = () => {
      if (!canvas.isConnected) return;
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      if (canvas.width !== Math.round(r.width * dpr)) {
        canvas.width = Math.round(r.width * dpr);
        canvas.height = Math.round(r.height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#04060d';
      ctx.fillRect(0, 0, r.width, r.height);
      root.drawPlanetSphere(ctx, r.width / 2, r.height / 2, Math.min(r.width, r.height) * 0.34, id, t += 0.03);
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }

  function modeCard(kind, eyebrow, title, text, artId) {
    return `<button class="mode-card" type="button" data-go="campaign" data-kind="${kind}">
      <span class="mode-art">${Art.unitArt(D.UNIT_MAP[artId])}</span>
      <span class="mode-text"><span class="eyebrow">${eyebrow}</span><h3>${title}</h3><span class="muted">${text}</span></span>
    </button>`;
  }

  function bossListHtml() {
    return `<div class="boss-grid">${D.BOSS_ENCOUNTERS.map((enc) => {
      const def = D.UNIT_MAP[enc.id];
      const unlocked = Player.bossUnlocked(enc);
      const wins = Player.state.bosses[enc.id] || 0;
      const r = D.bossRewards(enc, !wins);
      return `<button class="boss-card ${unlocked ? '' : 'locked'}" type="button" data-boss="${enc.id}" ${unlocked ? '' : 'disabled'}>
        <span class="boss-art">${Art.unitArt(def)}</span>
        <span class="boss-info">
          <span class="eyebrow">${enc.kind === 'ship' ? 'Fleet boss' : 'Ground boss'} · Lv ${enc.level}</span>
          <h3>${esc(enc.name)}</h3>
          <span class="muted">${esc(def.name)} · ${esc(enc.place)}</span>
          <span class="boss-rewards">${cur('credits', r.credits)}${cur('aurodium', r.aurodium)}${r.kyber ? cur('crystals', r.kyber) : ''}${r.card ? '<span class="tag">+ Epic/Legendary card</span>' : ''}</span>
          <span class="boss-status">${unlocked ? (wins ? `Defeated ${wins}×` : 'Not yet defeated') : `🔒 Liberate ${esc(D.PLANET_MAP[enc.unlock].name)}`}</span>
        </span>
      </button>`;
    }).join('')}</div>`;
  }

  function bonusList(items, empty) {
    if (!items.length) return `<p class="muted small">${empty}</p>`;
    return `<ul class="bonus-list">${items.map((b) => `<li class="bonus ${b.kind || ''}"><span class="bonus-icon">${b.icon}</span><span><b>${esc(b.name)}</b>${b.need ? ` <em>${b.count}/${b.need}</em>` : ''}<small>${esc(b.desc)}</small></span></li>`).join('')}</ul>`;
  }

  function hintList(items) {
    if (!items.length) return '';
    return `<ul class="bonus-list hints">${items.map((b) => `<li class="bonus hint-row"><span class="bonus-icon">${b.icon}</span><span><b>${esc(b.name)}</b> <em>${b.count}/${b.need}</em><small>Add 1 more ${esc(D.TRAIT_INFO[b.trait] ? D.TRAIT_INFO[b.trait].label : { healer: 'healer', tank: 'tank', attacker: 'damage dealer' }[b.trait] || b.trait)}: ${esc(b.desc)}</small></span></li>`).join('')}</ul>`;
  }

  function slotRequirement(rule) {
    const lvOk = Player.state.account.level >= rule.level;
    const plOk = Player.planetComplete(rule.planet);
    return `<span class="${lvOk ? 'ok' : ''}">${lvOk ? '✓' : '🔒'} Account Lv ${rule.level}</span><span class="${plOk ? 'ok' : ''}">${plOk ? '✓' : '🔒'} Liberate ${esc(D.PLANET_MAP[rule.planet].name)}</span>`;
  }

  function traitChips(id) {
    return D.traitsOf(id).map((t) => `<span class="trait" title="${D.TRAIT_INFO[t].label}">${D.TRAIT_INFO[t].icon} ${D.TRAIT_INFO[t].label}</span>`).join('');
  }

  Screens.campaign = function () {
    const tab = App.ui.campaignKind === 'boss' ? 'boss' : 'map';
    const planetId = App.ui.planet && Player.planetUnlocked(App.ui.planet) ? App.ui.planet : Player.currentPlanet().id;
    App.ui.planet = planetId;
    const planet = D.PLANET_MAP[planetId];
    const totalStages = D.PLANETS.reduce((a, p) => a + p.stages.length, 0);

    const mapHtml = `<div class="galaxy-map" data-map>
      <canvas data-map-canvas></canvas>
      ${D.PLANETS.map((p) => {
        const unlocked = Player.planetUnlocked(p.id);
        const cleared = Player.planetCleared(p.id);
        return `<button class="map-planet ${unlocked ? '' : 'locked'} ${p.id === planetId ? 'selected' : ''} ${Player.planetComplete(p.id) ? 'done' : ''}" type="button" data-planet="${p.id}" style="left:${p.map.x}%;top:${p.map.y}%" ${unlocked ? '' : 'disabled'} aria-label="${esc(p.name)}">
          <span class="map-label">${esc(p.name)}<small>${unlocked ? `${cleared}/${p.stages.length}` : '🔒'}</small></span>
        </button>`;
      }).join('')}
    </div>`;

    const cleared = Player.planetCleared(planet.id);
    const stagesHtml = planet.stages.map((stg, i) => {
      const state = i < cleared ? 'cleared' : i === cleared ? 'current' : 'locked';
      const r = D.stageRewards(planet.id, i);
      const enc = Player.encounter({ type: 'stage', planet: planet.id, stage: i });
      const enemyPower = enc.enemies.reduce((a, id) => a + D.power(D.UNIT_MAP[id], stg.level, enc.stars), 0);
      const finale = i === planet.stages.length - 1;
      return `<button class="stage ${state} ${finale ? 'finale' : ''}" type="button" data-stage="${i}" ${state === 'locked' ? 'disabled' : ''}>
        <span class="stage-num">${state === 'cleared' ? '✓' : i + 1}</span>
        <span>
          <h3><span class="kind-badge ${stg.kind}">${stg.kind === 'ship' ? '✈ Fleet' : '⚔ Ground'}</span> ${esc(stg.name)}${finale ? ' <span class="tag">Finale</span>' : ''}</h3>
          <span class="stage-info">
            <span>Enemy Lv ${stg.level} · ${enc.stars}★</span>
            <span>⚡ ${fmt(enemyPower)}</span>
            ${cur('credits', r.credits)}
            ${state !== 'cleared' ? `<span class="first-clear">${cur('crystals', r.firstClearCrystals + (finale ? D.PLANET_CLEAR_KYBER : 0))} first clear</span>` : ''}
          </span>
        </span>
        <span class="mini-row">${enc.enemies.map((id) => miniPortrait(D.UNIT_MAP[id])).join('')}</span>
      </button>`;
    }).join('');

    const planetBosses = D.BOSS_ENCOUNTERS.filter((b) => b.unlock === planet.id);
    const panelHtml = `<div class="planet-panel">
      <div class="planet-banner"><canvas class="env-canvas" data-banner></canvas>
        <div class="banner-text">
          <p class="eyebrow">${esc(planet.region)} · Planet ${D.PLANETS.indexOf(planet) + 1} of ${D.PLANETS.length}</p>
          <h2>${esc(planet.name)}</h2>
          <p>${esc(planet.blurb)}</p>
          <div class="banner-progress"><i style="width:${(cleared / planet.stages.length) * 100}%"></i></div>
        </div>
        <div class="banner-toggle seg"><button type="button" data-view="ground" class="active">Surface</button><button type="button" data-view="space">Orbit</button></div>
      </div>
      <div class="planet-rules">
        <div class="rule terrain"><span class="rule-icon">◉</span><div><b>Terrain: ${esc(planet.terrain.name)}</b><p>${esc(planet.terrain.desc)} Applies to both sides.</p></div></div>
        <div class="rule hazard"><span class="rule-icon">⚠</span><div><b>Hazard: ${esc(planet.hazard.name)}</b><p>${esc(planet.hazard.desc)}</p></div></div>
      </div>
      <div class="stage-list">${stagesHtml}</div>
      ${planetBosses.length ? `<p class="muted small">Liberate ${esc(planet.name)} to unlock: ${planetBosses.map((b) => `<b>${esc(b.name)}</b>`).join(', ')}.</p>` : ''}
    </div>`;

    const v = el(`<section class="view">
      <div class="view-head">
        <div>
          <p class="eyebrow">${tab === 'boss' ? 'Enrage below 50% HP · immune to Stun' : `${D.PLANETS.length} planets · ${Player.totalCleared()}/${totalStages} stages cleared`}</p>
          <h1>${tab === 'boss' ? 'Boss Battles' : 'Galaxy Map'}</h1>
        </div>
        <div class="seg" role="tablist">
          <button type="button" data-tab="map" class="${tab === 'map' ? 'active' : ''}">Galaxy Map</button>
          <button type="button" data-tab="boss" class="${tab === 'boss' ? 'active' : ''}">Bosses</button>
        </div>
      </div>
      ${tab === 'boss' ? bossListHtml() : mapHtml + panelHtml}
    </section>`);

    if (tab === 'map') {
      requestAnimationFrame(() => {
        const mc = $('[data-map-canvas]', v);
        if (mc) new root.GalaxyMap(mc, D.PLANETS, () => ({
          unlocked: (id) => Player.planetUnlocked(id),
          cleared: (id) => Player.planetCleared(id),
          current: Player.currentPlanet().id,
        }));
        const bc = $('[data-banner]', v);
        if (bc) App.bannerEnv = new root.Env(bc, planet.id, 'ground');
      });
    }

    v.addEventListener('click', (e) => {
      const t = e.target.closest('[data-tab]');
      if (t) {
        App.ui.campaignKind = t.dataset.tab;
        return App.refresh();
      }
      const pl = e.target.closest('[data-planet]');
      if (pl && !pl.disabled) {
        App.ui.planet = pl.dataset.planet;
        return App.refresh();
      }
      const vw = e.target.closest('[data-view]');
      if (vw) {
        $$('[data-view]', v).forEach((b) => b.classList.toggle('active', b === vw));
        if (App.bannerEnv) App.bannerEnv.stop();
        const old = $('[data-banner]', v);
        const fresh = el('<canvas class="env-canvas" data-banner></canvas>');
        old.replaceWith(fresh);
        App.bannerEnv = new root.Env(fresh, planet.id, vw.dataset.view);
        return;
      }
      const st = e.target.closest('[data-stage]');
      if (st && !st.disabled) return App.go('squad', { type: 'stage', planet: planet.id, stage: Number(st.dataset.stage) });
      const b = e.target.closest('[data-boss]');
      if (b && !b.disabled) App.go('squad', { type: 'boss', boss: b.dataset.boss });
    });
    return v;
  };

  Screens.squad = function (params) {
    const enc = Player.encounter(params);
    const kind = enc.kind;
    const size = Player.slots();
    const maxSize = D.SQUAD_SIZE[kind];
    const planetId = enc.planet;
    const planet = D.PLANET_MAP[planetId];
    let squad = Player.state.squads[kind].filter((id) => Player.owns(id) && D.UNIT_MAP[id].kind === kind).slice(0, size);
    const enemyPower = enc.enemies.reduce((a, id) => a + D.power(D.UNIT_MAP[id], enc.level, enc.stars), 0);
    const enemyBonus = D.squadBonuses(enc.enemies, planetId);

    const v = el(`<section class="view squad-layout">
      <div class="view-head">
        <div>
          <p class="eyebrow">${esc(enc.label)}</p>
          <h1>${esc(enc.name)}</h1>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn" type="button" data-back>Back</button>
          <button class="btn" type="button" data-auto-build title="Pick your strongest balanced squad">⚙ Auto-build</button>
          <button class="btn btn-primary" type="button" data-fight>Engage</button>
        </div>
      </div>
      <div class="versus ${enc.type === 'boss' ? 'boss-versus' : ''}">
        <div><div class="side-label"><span>Your squad · ${size}/${maxSize} slots</span><b data-mypower></b></div><div class="slots" data-slots style="--n:${maxSize}"></div></div>
        <div class="vs">VS</div>
        <div><div class="side-label"><span>Enemy · Lv ${enc.level} · ${enc.stars}★</span><b>⚡ ${fmt(enemyPower)}</b></div>
          <div class="slots" style="--n:${enc.enemies.length}">${enc.enemies.map((id) => `<div class="slot filled ${D.UNIT_MAP[id].boss ? 'boss-slot' : ''}">${portrait(D.UNIT_MAP[id])}</div>`).join('')}</div>
        </div>
      </div>
      <div class="bonus-panel">
        <div class="bonus-col"><h3>Your synergies</h3><div data-my-bonus></div></div>
        <div class="bonus-col"><h3>Enemy synergies</h3>${bonusList(enemyBonus.active, 'No enemy synergies.')}</div>
        <div class="bonus-col planet-col"><h3>${esc(planet.name)}</h3>
          <div class="rule terrain"><span class="rule-icon">◉</span><div><b>${esc(planet.terrain.name)}</b><p>${esc(planet.terrain.desc)}</p></div></div>
          <div class="rule hazard"><span class="rule-icon">⚠</span><div><b>${esc(planet.hazard.name)}</b><p>${esc(planet.hazard.desc)}</p></div></div>
        </div>
      </div>
      <div>
        <div class="side-label"><span>Tap to add or remove (up to ${size}) · trait icons show synergies</span></div>
        <div class="card-grid" data-roster></div>
      </div>
    </section>`);

    let prevSyn = null;
    // anim: { initial } | { added, from } | { auto }
    function render(anim = {}) {
      const slots = $('[data-slots]', v);
      slots.innerHTML = '';
      for (let i = 0; i < maxSize; i++) {
        const id = squad[i];
        const rule = D.SLOT_UNLOCKS.find((r) => r.slot === i + 1);
        if (i >= size && rule) {
          slots.insertAdjacentHTML('beforeend', `<div class="slot locked-slot" title="Slot ${i + 1} is locked"><span class="lock">🔒</span><small>Slot ${i + 1}</small><span class="req">${slotRequirement(rule)}</span></div>`);
          continue;
        }
        slots.insertAdjacentHTML('beforeend', id
          ? `<div class="slot filled" data-remove="${id}" title="Remove">${portrait(D.UNIT_MAP[id])}</div>`
          : '<div class="slot">Empty</div>');
      }
      const power = squad.reduce((a, id) => a + Player.powerOf(id), 0);
      const mp = $('[data-mypower]', v);
      mp.textContent = '⚡ ' + fmt(power);
      mp.className = power >= enemyPower ? 'good' : power >= enemyPower * 0.8 ? 'close' : 'bad';
      const bonus = D.squadBonuses(squad, planetId);
      $('[data-my-bonus]', v).innerHTML = bonusList(bonus.active, 'Combine units that share a trait to unlock synergies.') + hintList(bonus.hints);

      // Slot load-in animations.
      const slotEls = $$('.slot', slots);
      if (anim.initial || anim.auto) {
        squad.forEach((id, i) => loadSlot(slotEls[i], null, i * 140 + (anim.auto ? 60 : 200)));
      } else if (anim.added) {
        const i = squad.indexOf(anim.added);
        if (i >= 0) loadSlot(slotEls[i], anim.from, 0);
      }

      // Synergy activation banners for anything new (or a tier up).
      const now = {};
      bonus.active.filter((b) => b.kind !== 'terrain').forEach((b) => { now[b.key] = b.tier || 0; });
      if (prevSyn && !anim.initial) {
        const fresh = bonus.active.filter((b) => b.kind !== 'terrain' && (prevSyn[b.key] == null || prevSyn[b.key] < (b.tier || 0)))
          .sort((a, b) => (b.need || 0) - (a.need || 0));
        const delay = anim.auto ? squad.length * 140 + 300 : 420;
        fresh.forEach((b) => synergyBanner(b, b.members.map((m) => D.UNIT_MAP[squad[m]]).filter(Boolean), delay));
      }
      prevSyn = now;
      $$('.bonus', v).forEach((row, k) => { row.style.animationDelay = `${k * 40}ms`; });
      const roster = D.UNITS.filter((u) => u.kind === kind && Player.owns(u.id)).sort((a, b) => Player.powerOf(b.id) - Player.powerOf(a.id));
      $('[data-roster]', v).innerHTML = roster.map((def) => {
        const idx = squad.indexOf(def.id);
        return unitCard(def, { selected: idx >= 0, badge: idx >= 0 ? idx + 1 : null, hideShards: true, traits: true });
      }).join('');
      $('[data-fight]', v).disabled = squad.length === 0;
    }

    v.addEventListener('click', (e) => {
      if (e.target.closest('[data-back]')) return App.go('campaign');
      if (e.target.closest('[data-auto-build]')) {
        squad = Player.autoSquad(kind);
        toast('Auto-built your strongest squad.');
        return render({ auto: true });
      }
      if (e.target.closest('[data-fight]')) {
        Player.setSquad(kind, squad);
        root.BattleUI.start(params);
        return;
      }
      const rem = e.target.closest('[data-remove]');
      const card = e.target.closest('.ucard');
      const id = rem ? rem.dataset.remove : card ? card.dataset.id : null;
      if (!id) return;
      if (squad.includes(id)) {
        const slotEl = rem || $$('.slot.filled', v).find((x) => x.dataset.remove === id);
        ejectSlot(slotEl);
        squad = squad.filter((x) => x !== id);
        return render();
      }
      if (squad.length >= size) return toast(`Squad is full. Remove someone first (max ${size}).`);
      const from = card ? $('.portrait', card).getBoundingClientRect() : null;
      squad.push(id);
      render({ added: id, from });
    });
    render({ initial: true });
    return v;
  };

  // ---------- Squad loading & synergy cinematics ----------
  const motionOK = () => !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // A card flies from the roster into its slot, which scans and locks in.
  function loadSlot(slotEl, fromRect, delay) {
    if (!slotEl || !slotEl.classList.contains('filled')) return;
    slotEl.classList.add('slot-pending');
    setTimeout(() => {
      if (!slotEl.isConnected) return;
      const to = slotEl.getBoundingClientRect();
      const finish = () => {
        slotEl.classList.remove('slot-pending');
        slotEl.classList.add('slot-load');
        setTimeout(() => slotEl.classList.remove('slot-load'), 900);
      };
      if (!fromRect || !motionOK()) return finish();
      const ghost = el(`<div class="slot-ghost">${slotEl.innerHTML}</div>`);
      Object.assign(ghost.style, { left: fromRect.left + 'px', top: fromRect.top + 'px', width: fromRect.width + 'px', height: fromRect.height + 'px' });
      document.body.appendChild(ghost);
      const dx = to.left - fromRect.left;
      const dy = to.top - fromRect.top;
      const sx = to.width / fromRect.width;
      const sy = to.height / fromRect.height;
      ghost.animate([
        { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1 },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) scale(${(sx + 1) / 2}, ${(sy + 1) / 2}) rotate(-6deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy}) rotate(0)`, opacity: 1 },
      ], { duration: 460, easing: 'cubic-bezier(.3,.7,.3,1)' }).onfinish = () => {
        ghost.remove();
        finish();
      };
    }, delay || 0);
  }

  function ejectSlot(slotEl) {
    if (!slotEl || !motionOK()) return;
    const r = slotEl.getBoundingClientRect();
    const ghost = el(`<div class="slot-ghost">${slotEl.innerHTML}</div>`);
    Object.assign(ghost.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
    document.body.appendChild(ghost);
    ghost.animate([{ transform: 'translateY(0) rotate(0)', opacity: 1 }, { transform: 'translateY(80px) rotate(14deg) scale(.7)', opacity: 0 }], { duration: 380, easing: 'ease-in' }).onfinish = () => ghost.remove();
  }

  // Each synergy gets its own animated backdrop behind the banner.
  const BANNER_FX = {
    badbatch: 'lightning', sith: 'lightning', jedi: 'orbs', droid: 'circuit', separatist: 'circuit', empire: 'scan', republic: 'rays',
    rebel: 'embers', scoundrel: 'coins', bounty: 'reticles', mandalorian: 'coins', trooper: 'bolts', native: 'leaves', leader: 'rays',
    fighter: 'warp', gunship: 'warp', bomber: 'blasts', nightsister: 'mist', healer: 'plus', tank: 'hex', formation: 'hex',
    attacker: 'slashes', unity_light: 'rays', unity_dark: 'vortex', inquisitor: 'spinrings',
  };

  function bannerFx(canvas, type, color) {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const cy = H / 2;
    const rnd = (a, b) => a + Math.random() * (b - a);
    const parts = Array.from({ length: 70 }, () => ({ x: rnd(0, W), y: rnd(0, H), v: rnd(0.4, 1.4), r: rnd(1, 4), a: rnd(0, Math.PI * 2), t: rnd(0, 1) }));
    let bolts = [];
    const t0 = performance.now();
    const hex = (x, y, r) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        ctx[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r);
      }
      ctx.closePath();
    };
    const frame = (now) => {
      if (!canvas.isConnected) return;
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      if (type === 'lightning') {
        if (Math.random() < 0.18) {
          const pts = [];
          let x = rnd(0, W);
          let y = rnd(-20, H * 0.2);
          const down = Math.random() > 0.4;
          for (let i = 0; i < 14; i++) {
            pts.push([x, y]);
            x += rnd(-50, 50) + (down ? 0 : rnd(20, 60));
            y += down ? H / 12 : rnd(-30, 30) + H / 30;
          }
          bolts.push({ pts, life: 0 });
        }
        bolts = bolts.filter((b) => (b.life += 0.06) < 1);
        for (const b of bolts) {
          ctx.globalAlpha = 1 - b.life;
          for (const [w, a] of [[5, 0.35], [1.6, 1]]) {
            ctx.lineWidth = w;
            ctx.globalAlpha = (1 - b.life) * a;
            ctx.beginPath();
            b.pts.forEach(([x, y], i) => ctx[i ? 'lineTo' : 'moveTo'](x, y));
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 0.06 + Math.random() * 0.05 * (bolts.length ? 1 : 0);
        ctx.fillRect(0, 0, W, H);
      } else if (type === 'orbs' || type === 'plus' || type === 'embers' || type === 'coins' || type === 'leaves') {
        for (const p of parts) {
          const rising = type !== 'coins' && type !== 'leaves';
          p.y += (rising ? -1 : 1) * p.v * (type === 'orbs' ? 0.6 : 1.8);
          p.x += Math.sin(t * 2 + p.a) * (type === 'leaves' ? 1.5 : 0.4);
          if (p.y < -10) p.y = H + 10;
          if (p.y > H + 10) p.y = -10;
          ctx.globalAlpha = 0.5 + Math.sin(t * 3 + p.a) * 0.3;
          if (type === 'plus') {
            ctx.font = `${8 + p.r * 4}px sans-serif`;
            ctx.fillText('✚', p.x, p.y);
          } else if (type === 'coins') {
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.r * 2.2 * Math.abs(Math.cos(t * 4 + p.a)) + 0.5, p.r * 2.2, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (type === 'leaves') {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(t * 2 + p.a);
            ctx.fillRect(-p.r * 2, -p.r * 0.6, p.r * 4, p.r * 1.2);
            ctx.restore();
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, type === 'orbs' ? p.r * 2.4 : p.r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (type === 'spinrings') {
        // Inquisitor sabers: spinning double-bladed rings wheel across the screen.
        if (!bolts.length) bolts = Array.from({ length: 5 }, (_, i) => ({ x: -120 - i * rnd(160, 260), y: rnd(H * 0.15, H * 0.85), r: rnd(40, 90), v: rnd(6, 11), spin: rnd(8, 14) * (i % 2 ? -1 : 1) }));
        // A giant ring wheels slowly behind the title.
        const gr = Math.min(W, H) * 0.42;
        const ga = t * 2.2;
        ctx.globalAlpha = 0.22;
        ctx.lineWidth = 10;
        ctx.beginPath(); ctx.arc(W / 2, cy, gr * 0.72, 0, Math.PI * 2); ctx.stroke();
        for (const k of [0, Math.PI]) {
          ctx.globalAlpha = 0.28;
          ctx.lineWidth = 14;
          ctx.beginPath(); ctx.arc(W / 2, cy, gr, ga + k, ga + k + 1.1); ctx.stroke();
          ctx.globalAlpha = 0.5;
          ctx.lineWidth = 5;
          ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(ga + k) * gr * 0.2, cy + Math.sin(ga + k) * gr * 0.2); ctx.lineTo(W / 2 + Math.cos(ga + k) * gr * 1.05, cy + Math.sin(ga + k) * gr * 1.05); ctx.stroke();
        }
        for (const b of bolts) {
          b.x += b.v;
          if (b.x - b.r > W) { b.x = -b.r - rnd(40, 200); b.y = rnd(H * 0.15, H * 0.85); }
          const a = t * b.spin;
          ctx.globalAlpha = 0.18;
          ctx.lineWidth = b.r * 0.3;
          ctx.beginPath(); ctx.arc(b.x - b.v * 6, b.y, b.r, 0, Math.PI * 2); ctx.stroke();
          ctx.globalAlpha = 0.7;
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.72, 0, Math.PI * 2); ctx.stroke();
          ctx.lineCap = 'round';
          for (const k of [0, Math.PI]) {
            ctx.globalAlpha = 0.9;
            ctx.lineWidth = 6;
            ctx.beginPath(); ctx.moveTo(b.x + Math.cos(a + k) * b.r * 0.15, b.y + Math.sin(a + k) * b.r * 0.15); ctx.lineTo(b.x + Math.cos(a + k) * b.r, b.y + Math.sin(a + k) * b.r); ctx.stroke();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.strokeStyle = color;
            // Blade trail arc.
            ctx.globalAlpha = 0.35;
            ctx.lineWidth = 4;
            ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.9, a + k - 0.9 * Math.sign(b.spin), a + k, b.spin < 0); ctx.stroke();
          }
        }
        ctx.globalAlpha = 0.05 + Math.sin(t * 6) * 0.03;
        ctx.fillRect(0, 0, W, H);
      } else if (type === 'circuit') {
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 16; i++) {
          const y = (i / 16) * H + 10;
          const len = ((t * 400 + i * 97) % (W + 300)) - 150;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(len, y);
          ctx.lineTo(len + 20, y + 20);
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.fillRect(len + 17, y + 17, 6, 6);
        }
        ctx.globalAlpha = 0.25;
        ctx.fillRect(0, (t * 300) % H, W, 2);
      } else if (type === 'scan') {
        for (let i = 0; i < 3; i++) {
          const x = ((t * 500 + i * W / 3) % (W + 200)) - 100;
          const g = ctx.createLinearGradient(x - 80, 0, x + 80, 0);
          g.addColorStop(0, 'transparent');
          g.addColorStop(0.5, color);
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.globalAlpha = 0.25;
          ctx.fillRect(x - 80, 0, 160, H);
        }
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = color;
        for (let y = 0; y < H; y += 6) ctx.fillRect(0, y, W, 1);
      } else if (type === 'rays' || type === 'vortex') {
        const n = 24;
        ctx.save();
        ctx.translate(W / 2, cy);
        ctx.rotate(t * (type === 'vortex' ? -0.8 : 0.25));
        for (let i = 0; i < n; i++) {
          ctx.globalAlpha = type === 'vortex' ? 0.14 : 0.1;
          ctx.rotate((Math.PI * 2) / n);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          if (type === 'vortex') ctx.quadraticCurveTo(W * 0.3, W * 0.1, W * 0.7, 0);
          else ctx.lineTo(W, -40);
          ctx.lineTo(W, 40);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      } else if (type === 'reticles') {
        ctx.lineWidth = 2;
        parts.slice(0, 7).forEach((p, i) => {
          const k = (t * 0.8 + p.t) % 1;
          const r = 60 - k * 40;
          ctx.globalAlpha = Math.sin(k * Math.PI);
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.moveTo(p.x - r - 10, p.y);
          ctx.lineTo(p.x + r + 10, p.y);
          ctx.moveTo(p.x, p.y - r - 10);
          ctx.lineTo(p.x, p.y + r + 10);
          ctx.stroke();
          if (k > 0.97) { p.x = rnd(0, W); p.y = rnd(0, H); }
        });
      } else if (type === 'bolts' || type === 'warp') {
        ctx.lineCap = 'round';
        for (const p of parts) {
          if (type === 'warp') {
            const a = p.a;
            p.t = (p.t + 0.02 * p.v) % 1;
            const d0 = p.t * W * 0.7;
            ctx.globalAlpha = p.t;
            ctx.lineWidth = 1 + p.t * 2;
            ctx.beginPath();
            ctx.moveTo(W / 2 + Math.cos(a) * d0, cy + Math.sin(a) * d0);
            ctx.lineTo(W / 2 + Math.cos(a) * (d0 + 40 * p.t + 5), cy + Math.sin(a) * (d0 + 40 * p.t + 5));
            ctx.stroke();
          } else {
            p.x += (p.a > Math.PI ? 1 : -1) * p.v * 14;
            if (p.x > W + 40) p.x = -40;
            if (p.x < -40) p.x = W + 40;
            ctx.globalAlpha = 0.8;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + 34, p.y);
            ctx.stroke();
          }
        }
      } else if (type === 'mist') {
        for (let i = 0; i < 7; i++) {
          const x = W / 2 + Math.cos(t * 0.6 + i) * W * 0.35;
          const y = cy + Math.sin(t * 0.8 + i * 2) * H * 0.3;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 220);
          g.addColorStop(0, color);
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.globalAlpha = 0.18;
          ctx.fillRect(x - 220, y - 220, 440, 440);
        }
      } else if (type === 'hex') {
        ctx.lineWidth = 1.5;
        const r = 34;
        for (let y = 0; y < H + r; y += r * 1.5) {
          for (let x = 0; x < W + r; x += r * 1.73) {
            const ox = (Math.round(y / (r * 1.5)) % 2) * r * 0.866;
            const d = Math.hypot(x + ox - W / 2, y - cy);
            ctx.globalAlpha = Math.max(0, Math.sin(d / 60 - t * 5)) * 0.5;
            hex(x + ox, y, r * 0.9);
            ctx.stroke();
          }
        }
      } else if (type === 'slashes' || type === 'blasts') {
        if (Math.random() < 0.12) bolts.push({ x: rnd(0, W), y: rnd(0, H), a: rnd(-0.6, 0.6), life: 0 });
        bolts = bolts.filter((b) => (b.life += 0.04) < 1);
        for (const b of bolts) {
          ctx.globalAlpha = 1 - b.life;
          if (type === 'blasts') {
            ctx.beginPath();
            ctx.arc(b.x, b.y, 10 + b.life * 90, 0, Math.PI * 2);
            ctx.lineWidth = 4 * (1 - b.life);
            ctx.stroke();
          } else {
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.rotate(b.a);
            ctx.fillRect(-180 * Math.min(1, b.life * 3), -2, 360 * Math.min(1, b.life * 3), 4);
            ctx.restore();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  // Full-width banner sweeps across the screen with the member cards.
  let bannerChain = Promise.resolve();
  function synergyBanner(entry, defs, delay) {
    const color = D.SYN_THEME[entry.key] || '#ffd23f';
    bannerChain = bannerChain.then(() => new Promise((resolve) => {
      setTimeout(() => {
        // Left the squad screen (e.g. started the battle): drop queued banners.
        if (!document.querySelector('.squad-layout')) return resolve();
        if (!motionOK()) {
          toast(`${entry.name} activated!`);
          return resolve();
        }
        const epic = entry.need >= 4;
        const title = entry.key === 'badbatch' && entry.count >= 5 ? 'The Bad Batch' : entry.name;
        const cards = defs.slice(0, 5).map((d, i) => `<div class="syn-card" style="--i:${i}">${portrait(d, { plate: false })}</div>`).join('');
        const tierText = entry.need ? `${entry.count}/${entry.need} · ${entry.tier > 0 ? 'Tier ' + (entry.tier + 1) : 'Activated'}` : 'Activated';
        const node = el(`<div class="syn-banner ${epic ? 'epic' : ''}" style="--sc:${color}" role="status">
          <div class="syn-backdrop" aria-hidden="true"></div>
          <div class="syn-band"><div class="syn-sheen"></div></div>
          <canvas class="syn-fx" aria-hidden="true"></canvas>
          <div class="syn-sparks">${Array.from({ length: 18 }, (_, i) => `<i style="--k:${i}"></i>`).join('')}</div>
          <div class="syn-content">
            <div class="syn-icon">${entry.icon || '✦'}</div>
            <div class="syn-text">
              <span class="syn-kicker">${epic ? 'Full squad bonus' : 'Synergy unlocked'} · ${esc(tierText)}</span>
              <b class="syn-name ${Math.max(...title.split(' ').map((w) => w.length)) > 9 ? 'long' : ''}">${esc(title)}</b>
              <span class="syn-desc">${esc(entry.desc)}</span>
            </div>
            <div class="syn-cards">${cards}</div>
          </div>
        </div>`);
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          node.classList.add('out');
          setTimeout(() => {
            node.remove();
            resolve();
          }, 260);
        };
        node.addEventListener('click', finish);
        document.body.appendChild(node);
        bannerFx($('.syn-fx', node), BANNER_FX[entry.key] || 'rays', color);
        setTimeout(finish, epic ? 3200 : 2300);
      }, delay || 0);
    }));
    return bannerChain;
  }

  const SORTS = {
    strong: { label: 'Strongest', fn: (a, b) => sortPower(b) - sortPower(a) },
    weak: { label: 'Weakest', fn: (a, b) => sortPower(a) - sortPower(b) },
    rarity: { label: 'Rarity', fn: (a, b) => D.RARITIES[b.rarity].weight - D.RARITIES[a.rarity].weight || sortPower(b) - sortPower(a) },
    name: { label: 'A–Z', fn: (a, b) => a.name.localeCompare(b.name) },
  };
  // Unowned units sort by their level-1 power so locked cards still order sensibly.
  function sortPower(def) {
    return Player.owns(def.id) ? Player.powerOf(def.id) : D.power(def, 1, 1);
  }

  Screens.collection = function () {
    const ui = App.ui;
    if (!ui.collectionClass) ui.collectionClass = 'all';
    const v = el(`<section class="view">
      <div class="view-head">
        <div>
          <p class="eyebrow">${Object.keys(Player.state.units).length} of ${D.UNITS.length} collected</p>
          <h1>Collection</h1>
        </div>
        <div class="filters-row">
          <div class="seg" data-filter="kind">
            <button type="button" data-v="all">All</button><button type="button" data-v="character">Heroes</button><button type="button" data-v="ship">Ships</button>
          </div>
          <div class="seg" data-filter="faction">
            <button type="button" data-v="all">Both</button><button type="button" data-v="light">Light</button><button type="button" data-v="dark">Dark</button>
          </div>
          <div class="seg" data-filter="sort" aria-label="Sort">
            ${Object.entries(SORTS).map(([k, so]) => `<button type="button" data-v="${k}">${k === 'strong' ? '▼ ' : k === 'weak' ? '▲ ' : ''}${so.label}</button>`).join('')}
          </div>
        </div>
      </div>
      <div class="class-bar" data-classes></div>
      <div class="card-grid" data-grid></div>
    </section>`);

    // Class buttons with a Light/Dark breakdown of how many you own.
    function renderClasses() {
      const inKind = D.UNITS.filter((u) => ui.collectionKind === 'all' || u.kind === ui.collectionKind);
      const entries = [['all', { label: 'All classes', icon: '◈' }], ...Object.entries(D.CLASS_INFO)];
      $('[data-classes]', v).innerHTML = entries.map(([key, info]) => {
        const list = key === 'all' ? inKind : inKind.filter((u) => D.classesOf(u).includes(key));
        if (!list.length) return '';
        const light = list.filter((u) => u.faction === 'light');
        const dark = list.filter((u) => u.faction === 'dark');
        const ownL = light.filter((u) => Player.owns(u.id)).length;
        const ownD = dark.filter((u) => Player.owns(u.id)).length;
        return `<button class="class-chip ${ui.collectionClass === key ? 'active' : ''}" type="button" data-class="${key}">
          <span class="class-top"><i>${info.icon}</i>${info.label}<b>${ownL + ownD}/${list.length}</b></span>
          <span class="class-split" title="Light ${ownL}/${light.length} · Dark ${ownD}/${dark.length}">
            <span class="light" style="flex:${Math.max(light.length, 0.001)}"><em style="width:${light.length ? (ownL / light.length) * 100 : 0}%"></em></span>
            <span class="dark" style="flex:${Math.max(dark.length, 0.001)}"><em style="width:${dark.length ? (ownD / dark.length) * 100 : 0}%"></em></span>
          </span>
          <span class="class-sub"><span>☀ ${ownL}/${light.length}</span><span>☾ ${ownD}/${dark.length}</span></span>
        </button>`;
      }).join('');
    }

    function render() {
      $$('[data-filter="kind"] button', v).forEach((b) => b.classList.toggle('active', b.dataset.v === ui.collectionKind));
      $$('[data-filter="faction"] button', v).forEach((b) => b.classList.toggle('active', b.dataset.v === ui.collectionFaction));
      $$('[data-filter="sort"] button', v).forEach((b) => b.classList.toggle('active', b.dataset.v === ui.collectionSort));
      renderClasses();
      const list = D.UNITS
        .filter((u) => ui.collectionKind === 'all' || u.kind === ui.collectionKind)
        .filter((u) => ui.collectionFaction === 'all' || u.faction === ui.collectionFaction)
        .filter((u) => ui.collectionClass === 'all' || D.classesOf(u).includes(ui.collectionClass))
        .sort((a, b) => {
          const oa = Player.owns(a.id) ? 0 : 1;
          const ob = Player.owns(b.id) ? 0 : 1;
          return oa - ob || SORTS[ui.collectionSort].fn(a, b);
        });
      $('[data-grid]', v).innerHTML = list.length ? list.map((def) => unitCard(def, { traits: true })).join('') : '<p class="muted">No units match these filters.</p>';
    }

    v.addEventListener('click', (e) => {
      const f = e.target.closest('[data-filter] button');
      if (f) {
        const which = f.parentElement.dataset.filter;
        if (which === 'kind') {
          ui.collectionKind = f.dataset.v;
          ui.collectionClass = 'all';
        } else if (which === 'faction') ui.collectionFaction = f.dataset.v;
        else ui.collectionSort = f.dataset.v;
        render();
        return;
      }
      const c = e.target.closest('[data-class]');
      if (c) {
        ui.collectionClass = c.dataset.class;
        render();
        return;
      }
      const card = e.target.closest('.ucard');
      if (card) inspect(card.dataset.id, render);
    });
    render();
    return v;
  };

  // ---------- Card inspector ----------
  // Center: the card (tap to flip to its description). Swipe or use the
  // arrows: left page shows stats, right page shows upgrades.
  function inspect(id, onChange) {
    const def = D.UNIT_MAP[id];
    let page = 1;
    let flipped = false;

    function statsPage() {
      const owned = Player.owns(id);
      const u = Player.unit(id) || { level: 1, stars: 1, shards: 0 };
      const s = D.unitStats(def, u.level, u.stars);
      const max = D.unitStats(def, D.MAX_LEVEL, D.MAX_STARS);
      const bar = (label, val, cap, color) => `<div class="statbar"><span>${label}</span><b>${fmt(val)}</b><i><em style="width:${Math.min(100, (val / cap) * 100)}%;background:${color}"></em></i></div>`;
      return `<div class="ipage-inner">
        <p class="eyebrow">Stats · ${owned ? `Level ${u.level} · ${u.stars}★` : 'Level 1 preview'}</p>
        <h2>${esc(def.name)}</h2>
        <div class="power-big">⚡ ${fmt(D.power(def, u.level, u.stars))}<span>power</span></div>
        ${bar('Health', s.hp, max.hp, '#52e08a')}
        ${bar('Attack', s.atk, max.atk, '#ff6b6b')}
        ${bar('Armor', s.def, max.def, '#5ab4ff')}
        ${bar('Speed', s.spd, 200, '#ffd23f')}
        <dl class="facts">
          <div><dt>Role</dt><dd>${D.ROLE_ICONS[def.role]} ${def.role}</dd></div>
          <div><dt>Side</dt><dd>${def.faction === 'light' ? 'Light Side' : 'Dark Side'}</dd></div>
          <div><dt>Type</dt><dd>${def.kind === 'ship' ? 'Ship' : 'Character'}</dd></div>
          <div><dt>Rarity</dt><dd style="color:var(--${def.rarity})">${D.RARITIES[def.rarity].label}</dd></div>
        </dl>
        <div class="trait-block"><p class="eyebrow">Classes</p><div class="trait-row">${D.classesOf(def).map((c) => `<span class="trait cls">${D.CLASS_INFO[c].icon} ${D.CLASS_INFO[c].label}</span>`).join('')}</div></div>
        <div class="trait-block"><p class="eyebrow">Traits (synergies)</p><div class="trait-row">${traitChips(def.id) || '<span class="muted">None</span>'}</div></div>
      </div>`;
    }

    function cardPage() {
      const owned = Player.owns(id);
      const u = Player.unit(id) || { level: 1, stars: 1 };
      const abilities = D.abilitiesFor(def);
      return `<div class="bigcard-wrap">
        <div class="bigcard rarity-${def.rarity} ${flipped ? 'flipped' : ''} ${owned ? '' : 'locked'}" data-flip tabindex="0" role="button" aria-label="Flip card">
          <div class="bigface front">
            ${portrait(def)}
            <div class="bigcard-foot"><span class="rar">${D.RARITIES[def.rarity].label}</span>${owned ? stars(u.stars) : '<span class="muted">Not recruited</span>'}</div>
          </div>
          <div class="bigface back">
            <p class="eyebrow">${def.faction === 'light' ? 'Light Side' : 'Dark Side'} · ${def.role}</p>
            <h3>${esc(def.name)}</h3>
            <p class="bio">${esc(D.BIOS[def.id] || '')}</p>
            <div class="trait-row">${D.classesOf(def).map((c) => `<span class="trait cls">${D.CLASS_INFO[c].icon} ${D.CLASS_INFO[c].label}</span>`).join('')}${traitChips(def.id)}</div>
            <ul class="mini-abilities">${abilities.map((ab, i) => `<li class="${ab.ultimate ? 'ult' : ''}"><b>${ab.ultimate ? '★ ' : ''}${esc(ab.name)}</b><span>${ab.ultimate ? 'Ultimate' : ab.cd ? `${ab.cd}-turn cooldown` : 'Basic'}</span><p>${esc(ab.desc)}</p>${ab.quote ? `<q>${esc(ab.quote)}</q>` : ''}</li>`).join('')}</ul>
          </div>
        </div>
        <p class="hint">Tap the card to flip it · swipe or use ‹ › for stats</p>
      </div>`;
    }

    function upgradePage() {
      const owned = Player.owns(id);
      if (!owned) {
        return `<div class="ipage-inner"><p class="eyebrow">Upgrades</p><h2>Not recruited</h2><p class="muted">Open crates in the Black Market or watch its Hot Stock to recruit ${esc(def.name)}.</p></div>`;
      }
      const u = Player.unit(id);
      const maxLevel = u.level >= D.MAX_LEVEL;
      const maxStars = u.stars >= D.MAX_STARS;
      const lvlCost = D.levelCost(u.level);
      const starNeed = maxStars ? 0 : D.STAR_COSTS[u.stars - 1];
      const next = D.unitStats(def, Math.min(D.MAX_LEVEL, u.level + 1), u.stars);
      const nowS = D.unitStats(def, u.level, u.stars);
      return `<div class="ipage-inner">
        <p class="eyebrow">Upgrades</p>
        <h2>${esc(def.name)}</h2>
        <div class="upgrade">
          <b>Level ${u.level} / ${D.MAX_LEVEL}</b>
          <span class="muted">${maxLevel ? 'Max level reached.' : `Next level: Health ${fmt(nowS.hp)} → ${fmt(next.hp)}, Attack ${fmt(nowS.atk)} → ${fmt(next.atk)}`}</span>
          <button class="btn btn-primary" type="button" data-level ${maxLevel || Player.state.credits < lvlCost ? 'disabled' : ''}>${maxLevel ? 'Maxed' : `Train · ${cur('credits', lvlCost)}`}</button>
        </div>
        <div class="upgrade">
          <b>${stars(u.stars)}</b>
          <span class="muted">${maxStars ? 'Max stars reached.' : `Shards ${u.shards}/${starNeed}. Duplicates and Hot Stock give shards.`}</span>
          ${maxStars ? '' : `<div class="shardbar ${u.shards >= starNeed ? 'ready' : ''}"><i style="width:${Math.min(100, (u.shards / starNeed) * 100)}%"></i></div>`}
          <button class="btn" type="button" data-star ${maxStars || u.shards < starNeed ? 'disabled' : ''}>${maxStars ? 'Maxed' : `Promote to ${u.stars + 1}★`}</button>
        </div>
      </div>`;
    }

    const labels = ['Stats', 'Card', 'Upgrades'];
    function body() {
      return `<div class="inspect">
        <div class="inspect-top">
          <button class="icon-btn" type="button" data-prev aria-label="Previous page">‹</button>
          <div class="pager">${labels.map((l, i) => `<button type="button" data-page="${i}" class="${i === page ? 'active' : ''}">${l}</button>`).join('')}</div>
          <button class="icon-btn" type="button" data-next aria-label="Next page">›</button>
        </div>
        <div class="inspect-stage" data-stage>
          <div class="inspect-track" style="transform:translateX(${-page * 100}%)">
            <div class="ipage">${statsPage()}</div>
            <div class="ipage">${cardPage()}</div>
            <div class="ipage">${upgradePage()}</div>
          </div>
        </div>
        <div class="modal-actions"><button class="btn" type="button" data-close>Close</button></div>
      </div>`;
    }

    const go = (p) => {
      page = Math.max(0, Math.min(2, p));
      render();
    };
    const m = openModal(body(), {
      cls: 'inspect-modal',
      onClose: onChange,
      onKey: (e) => {
        if (e.key === 'ArrowLeft') go(page - 1);
        if (e.key === 'ArrowRight') go(page + 1);
      },
    });
    const modal = m.root.querySelector('.modal');
    function render() {
      modal.innerHTML = body();
      bindSwipe();
    }

    function bindSwipe() {
      const stage = $('[data-stage]', modal);
      let x0 = null;
      let moved = false;
      stage.addEventListener('pointerdown', (e) => {
        x0 = e.clientX;
        moved = false;
      });
      stage.addEventListener('pointerup', (e) => {
        if (x0 == null) return;
        const dx = e.clientX - x0;
        x0 = null;
        if (Math.abs(dx) > 45) {
          moved = true;
          go(page + (dx < 0 ? 1 : -1));
        }
      });
      stage.addEventListener('click', (e) => {
        if (moved) {
          e.stopPropagation();
          moved = false;
        }
      }, true);
    }

    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) return m.close();
      if (e.target.closest('[data-prev]')) return go(page - 1);
      if (e.target.closest('[data-next]')) return go(page + 1);
      const pg = e.target.closest('[data-page]');
      if (pg) return go(Number(pg.dataset.page));
      const card = e.target.closest('[data-flip]');
      if (card && !e.target.closest('.back ul')) {
        flipped = !flipped;
        card.classList.toggle('flipped', flipped);
        return;
      }
      if (e.target.closest('[data-level]') && Player.levelUp(id)) toast(`${def.name} reached level ${Player.unit(id).level}!`);
      else if (e.target.closest('[data-star]') && Player.starUp(id)) toast(`${def.name} promoted to ${Player.unit(id).stars}★!`);
      else return;
      render();
      updateWallet();
    });
    modal.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-flip]')) {
        e.preventDefault();
        flipped = !flipped;
        e.target.classList.toggle('flipped', flipped);
      }
    });
    bindSwipe();
  }

  // ---------- Black Market ----------
  const MERCHANT_LINES = [
    'No questions asked, no refunds given.',
    'Fresh off an Imperial freighter. Don\'t ask which one.',
    'The Hutts take a cut. Everyone takes a cut.',
    'Feeling lucky? The Sabacc table is always open.',
  ];
  const oddsHtml = (o) => {
    const total = Object.values(o).reduce((a, b) => a + b, 0);
    const pct = (k) => `${((o[k] / total) * 100).toFixed(o[k] / total < 0.1 ? 1 : 0)}%`;
    return `<div class="odds">${o.common ? `<span class="c">C ${pct('common')}</span>` : ''}${o.rare ? `<span class="r">R ${pct('rare')}</span>` : ''}<span class="e">E ${pct('epic')}</span><span class="l">L ${pct('legendary')}</span></div>`;
  };

  function timeLeft(ms) {
    const m = Math.max(0, Math.round(ms / 60000));
    return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
  }

  Screens.market = function () {
    const s = Player.state;
    const luck = s.luck;
    const stock = Player.marketStock();
    const line = MERCHANT_LINES[Math.floor(Math.random() * MERCHANT_LINES.length)];
    const bets = D.LUCK.sabaccBets;
    const bet = bets[App.ui.betIndex] || bets[0];
    const shellBet = D.SHELL_BETS[App.ui.shellIndex || 0];
    const flash = Player.flashSale();

    const v = el(`<section class="view market">
      <div class="market-hero">
        <div class="market-merchant">${Art.merchantArt()}</div>
        <div class="market-copy">
          <p class="neon">SMUGGLER'S MOON</p>
          <h1>Nar Shaddaa Night Market</h1>
          <p class="market-sub">Vekko the Fence runs the back rooms of the Hutt Cartel's Red Sector. Everything is stolen, nothing is refundable.</p>
          <p class="muted">“${esc(line)}”</p>
          <div class="luck-row">
            <span class="luck-chip" title="Crates opened since your last Legendary">🎯 Legendary pity <b>${luck.pity}/${D.LUCK.pityCrates}</b></span>
            <span class="luck-chip ${luck.charmCrates ? 'on' : ''}" title="Boosted crates remaining">🎲 Chance Cubes <b>${luck.charmCrates}</b></span>
            <span class="luck-chip ${luck.dice ? 'on' : ''}" title="Boosted victory spins remaining">🎰 Loaded Dice <b>${luck.dice}</b></span>
          </div>
        </div>
      </div>

      <div class="section-head">
        <h2 class="section-title flash-title">⚡ Flash Sales</h2>
        <span class="countdown" data-countdown="${flash.endsAt}">--:--</span>
      </div>
      <div class="flash-grid">
        ${flash.items.map((it, i) => {
          const isPack = it.type === 'pack';
          const pack = isPack ? D.PACKS.find((pk) => pk.id === it.id) : null;
          const def = isPack ? null : D.UNIT_MAP[it.id];
          const key = Object.keys(it.cost)[0];
          return `<div class="flash-card ${it.sold ? 'sold' : ''}">
            <span class="flash-badge">-${it.discount}%</span>
            <div class="flash-art">${isPack ? Art.crateArt(pack.id) : portrait(def)}</div>
            <div class="flash-body">
              <p class="eyebrow">${isPack ? 'Crate deal' : `${D.RARITIES[def.rarity].label} shards`}</p>
              <h3>${isPack ? pack.name : esc(def.name)}</h3>
              <p class="muted small">${isPack ? pack.desc : Player.owns(def.id) ? `${it.shards} shards toward the next star.` : `Recruit ${esc(def.name)} right now.`}</p>
              <p class="flash-price"><s>${cur(key, it.full)}</s> ${cur(key, it.cost[key])}</p>
              <button class="btn btn-primary" type="button" data-flash="${i}" ${it.sold || !Player.canAfford(it.cost) ? 'disabled' : ''}>${it.sold ? 'Sold out' : 'Grab it'}</button>
            </div>
          </div>`;
        }).join('')}
      </div>

      <h2 class="section-title">Crates</h2>
      <div class="shop-grid">
        ${D.PACKS.map((p) => `
          <div class="pack">
            <div class="pack-art">${Art.crateArt(p.id)}</div>
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            ${oddsHtml(Player.effectiveOdds(p))}
            ${luck.charmCrates && p.id !== 'strongbox' ? '<span class="tag glow">Chance Cubes active</span>' : ''}
            <button class="btn btn-primary" type="button" data-pack="${p.id}" ${Player.canAfford(p.cost) ? '' : 'disabled'}>Open · ${costLabel(p.cost)}</button>
          </div>`).join('')}
      </div>

      <div class="section-head">
        <h2 class="section-title">Hot Stock</h2>
        <span class="muted">Restocks in ${timeLeft(stock.refreshAt - Date.now())} <button class="btn btn-small" type="button" data-reroll ${s.crystals < 20 ? 'disabled' : ''}>Restock now · ${cur('crystals', 20)}</button></span>
      </div>
      <div class="stock-grid">
        ${stock.items.map((it, i) => {
          const def = D.UNIT_MAP[it.id];
          const owned = Player.owns(it.id);
          return `<div class="stock ${it.sold ? 'sold' : ''} rarity-${def.rarity}">
            ${it.hot ? '<span class="hot">HOT</span>' : ''}
            ${it.discount ? `<span class="discount">-${it.discount}%</span>` : ''}
            <button class="stock-art" type="button" data-inspect="${def.id}" aria-label="Inspect ${esc(def.name)}">${portrait(def)}</button>
            <div class="stock-body">
              <span class="muted">${owned ? `${it.shards} shards` : 'Recruit unit'}</span>
              ${it.discount ? `<s class="muted">${fmt(it.full)}</s>` : ''}
              <button class="btn btn-small ${it.sold ? '' : 'btn-primary'}" type="button" data-buy="${i}" ${it.sold || !Player.canAfford(it.cost) ? 'disabled' : ''}>${it.sold ? 'Sold' : costLabel(it.cost)}</button>
            </div>
          </div>`;
        }).join('')}
      </div>

      <div class="market-lower">
        <div class="panel">
          <h2 class="section-title">Lucky Charms</h2>
          ${D.CHARMS.map((c) => `<div class="charm">
            <span class="charm-icon">${c.id === 'chance_cube' ? '🎲' : '🎰'}</span>
            <div><b>${c.name}</b><p class="muted">${c.desc}</p></div>
            <button class="btn btn-small" type="button" data-charm="${c.id}" ${Player.canAfford(c.cost) ? '' : 'disabled'}>${costLabel(c.cost)}</button>
          </div>`).join('')}
          <div class="charm">
            <span class="charm-icon">${Art.ICONS.crystals}</span>
            <div><b>Kyber Exchange</b><p class="muted">Trade ${cur('crystals', 50)} for ${cur('credits', 1000)}.</p></div>
            <button class="btn btn-small" type="button" data-exchange ${s.crystals < 50 ? 'disabled' : ''}>Trade</button>
          </div>
        </div>
        <div class="panel sabacc">
          <h2 class="section-title">Sabacc Table</h2>
          <p class="muted">Place a bet, then pick one of three cards. Its multiplier decides your payout, from Bust to Idiot's Array (10×).</p>
          <div class="seg" data-bets>${bets.map((b, i) => `<button type="button" data-bet="${i}" class="${b === bet ? 'active' : ''}">${cur('credits', b)}</button>`).join('')}</div>
          <div class="sabacc-cards" data-sabacc>${[0, 1, 2].map((i) => `<button class="scard" type="button" data-pick="${i}" ${s.credits < bet ? 'disabled' : ''}><span>◈</span></button>`).join('')}</div>
          <p class="hint" data-sabacc-msg>${s.credits < bet ? 'Not enough credits for this bet.' : 'Pick a card.'}</p>
        </div>
        <div class="panel shell">
          <h2 class="section-title">Droid Shell Game</h2>
          <p class="muted">R2 hides a credit chip under one of three cups and shuffles. Guess the right cup to win ${D.SHELL_PAYOUT}× your bet.</p>
          <div class="seg">${D.SHELL_BETS.map((b, i) => `<button type="button" data-shell-bet="${i}" class="${b === shellBet ? 'active' : ''}">${cur('credits', b)}</button>`).join('')}</div>
          <div class="cups" data-cups>${[0, 1, 2].map((i) => `<button class="cup" type="button" data-cup="${i}" disabled><svg viewBox="0 0 60 60" aria-hidden="true"><path d="M12 52 L18 10 Q30 4 42 10 L48 52Z" fill="#8a929e"/><path d="M12 52 L18 10 Q24 7 30 7 L30 52Z" fill="#aab2be"/><rect x="8" y="50" width="44" height="6" rx="2" fill="#5d6674"/><rect x="18" y="22" width="24" height="4" fill="#2f5fb0"/><rect x="18" y="32" width="24" height="3" fill="#2f5fb0"/></svg></button>`).join('')}<span class="chip" data-chip>${Art.ICONS.credits}</span></div>
          <button class="btn btn-primary" type="button" data-shell-play ${s.credits < shellBet ? 'disabled' : ''}>Shuffle · ${cur('credits', shellBet)}</button>
          <p class="hint" data-shell-msg>Press shuffle, then pick a cup.</p>
        </div>
      </div>
    </section>`);

    startCountdowns(v);
    v.addEventListener('click', (e) => {
      const p = e.target.closest('[data-pack]');
      if (p) {
        const results = Player.openPack(p.dataset.pack);
        if (!results) return toast('Not enough currency. Win battles to earn more.');
        updateWallet();
        packReveal(results);
        return;
      }
      const ins = e.target.closest('[data-inspect]');
      if (ins) return inspect(ins.dataset.inspect);
      const buy = e.target.closest('[data-buy]');
      if (buy) {
        const r = Player.buyMarket(Number(buy.dataset.buy));
        if (r) packReveal([r]);
        return;
      }
      if (e.target.closest('[data-reroll]')) {
        if (Player.rerollMarket()) {
          toast('Fresh stock just arrived.');
          App.refresh();
        }
        return;
      }
      const charm = e.target.closest('[data-charm]');
      if (charm) {
        if (Player.buyCharm(charm.dataset.charm)) {
          toast(`${D.CHARMS.find((c) => c.id === charm.dataset.charm).name} active!`);
          App.refresh();
        }
        return;
      }
      if (e.target.closest('[data-exchange]') && Player.exchangeCrystals()) {
        toast('+1,000 credits');
        App.refresh();
        return;
      }
      const b = e.target.closest('[data-bet]');
      if (b) {
        App.ui.betIndex = Number(b.dataset.bet);
        App.refresh();
        return;
      }
      const pick = e.target.closest('[data-pick]');
      if (pick && !pick.disabled) return playSabacc(v, bet, Number(pick.dataset.pick));
      const fl = e.target.closest('[data-flash]');
      if (fl) {
        const r = Player.buyFlash(Number(fl.dataset.flash));
        if (r) {
          updateWallet();
          packReveal(r);
        }
        return;
      }
      const sb = e.target.closest('[data-shell-bet]');
      if (sb) {
        App.ui.shellIndex = Number(sb.dataset.shellBet);
        return App.refresh();
      }
      if (e.target.closest('[data-shell-play]')) return shellShuffle(v, shellBet);
      const cup = e.target.closest('[data-cup]');
      if (cup && !cup.disabled) shellPick(v, shellBet, Number(cup.dataset.cup));
    });
    return v;
  };

  // Live countdown for flash sales; stops when the view is gone.
  function startCountdowns(v) {
    let seen = false;
    const tick = () => {
      if (!v.isConnected) {
        if (seen) clearInterval(timer);
        return;
      }
      seen = true;
      $$('[data-countdown]', v).forEach((n) => {
        const ms = Number(n.dataset.countdown) - Date.now();
        if (ms <= 0) {
          clearInterval(timer);
          App.refresh();
          return;
        }
        const m = Math.floor(ms / 60000);
        const sec = Math.floor((ms % 60000) / 1000);
        n.textContent = `Ends in ${m}:${String(sec).padStart(2, '0')}`;
        n.classList.toggle('urgent', ms < 120000);
      });
    };
    const timer = setInterval(tick, 1000);
    tick();
  }

  // Cosmetic shuffle: the chip is hidden, cups swap places, then you guess.
  function shellShuffle(v, bet) {
    if (Player.state.credits < bet) return toast('Not enough credits.');
    const cups = $$('.cup', v);
    const chip = $('[data-chip]', v);
    const btn = $('[data-shell-play]', v);
    btn.disabled = true;
    chip.classList.remove('show', 'win');
    cups.forEach((c) => c.classList.remove('lift', 'right', 'wrong'));
    $('[data-shell-msg]', v).textContent = 'Watch closely…';
    const order = [0, 1, 2];
    let step = 0;
    const swap = () => {
      const a = Math.floor(Math.random() * 3);
      let b = Math.floor(Math.random() * 3);
      if (b === a) b = (a + 1) % 3;
      [order[a], order[b]] = [order[b], order[a]];
      cups.forEach((c, i) => {
        const slot = order.indexOf(i);
        c.style.transform = `translateX(${(slot - i) * 100}%) translateY(${step % 2 ? -8 : 0}px)`;
      });
      step += 1;
      if (step < 9) setTimeout(swap, 170);
      else {
        cups.forEach((c) => { c.disabled = false; });
        $('[data-shell-msg]', v).textContent = 'Pick a cup!';
      }
    };
    setTimeout(swap, 150);
  }

  function shellPick(v, bet, cupIndex) {
    const cups = $$('.cup', v);
    const res = Player.shellGame(bet, cupIndex);
    if (!res) return toast('Not enough credits.');
    updateWallet();
    cups.forEach((c) => { c.disabled = true; });
    // Place the chip under whichever cup the house decided, then lift.
    const winner = res.won ? cupIndex : [0, 1, 2].filter((i) => i !== cupIndex)[Math.floor(Math.random() * 2)];
    const chip = $('[data-chip]', v);
    const cupRect = cups[winner].getBoundingClientRect();
    const boxRect = $('[data-cups]', v).getBoundingClientRect();
    chip.style.left = `${cupRect.left - boxRect.left + cupRect.width / 2}px`;
    chip.classList.add('show');
    cups[cupIndex].classList.add('lift', res.won ? 'right' : 'wrong');
    setTimeout(() => cups[winner].classList.add('lift'), 350);
    if (res.won) chip.classList.add('win');
    const msg = $('[data-shell-msg]', v);
    msg.innerHTML = res.won ? `Found it! You win ${cur('credits', res.won)}.` : 'Empty! R2 beeps smugly.';
    msg.className = `hint ${res.won ? 'good' : 'bad'}`;
    if (res.won) toast(`Shell game win! +${fmt(res.won)} credits`);
    setTimeout(() => {
      const b = $('[data-shell-play]', v);
      if (b) b.disabled = Player.state.credits < bet;
    }, 700);
  }

  function playSabacc(v, bet, pick) {
    const res = Player.sabacc(bet, pick);
    if (!res) return toast('Not enough credits.');
    updateWallet();
    const cards = $$('.scard', v);
    cards.forEach((c) => { c.disabled = true; });
    res.cards.forEach((card, i) => {
      setTimeout(() => {
        const c = cards[i];
        c.classList.add('revealed', i === pick ? 'picked' : 'other', card.mult >= 2 ? 'win' : card.mult === 0 ? 'bust' : 'meh');
        c.innerHTML = `<b>${card.mult}×</b><small>${esc(card.label)}</small>`;
      }, i === pick ? 0 : 450 + i * 150);
    });
    const msg = $('[data-sabacc-msg]', v);
    msg.innerHTML = res.net > 0 ? `You won ${cur('credits', res.won)}! (+${fmt(res.net)})` : res.net === 0 ? 'Push. You get your bet back.' : `The house wins. ${res.won ? `You keep ${cur('credits', res.won)}.` : 'Bust!'}`;
    msg.className = `hint ${res.net > 0 ? 'good' : res.net < 0 ? 'bad' : ''}`;
    if (res.cards[pick].mult >= 5) toast(`${res.cards[pick].label}! ${res.cards[pick].mult}× payout!`);
    setTimeout(() => {
      const again = el('<button class="btn btn-small" type="button">Deal again</button>');
      again.addEventListener('click', () => App.refresh());
      msg.appendChild(document.createTextNode(' '));
      msg.appendChild(again);
    }, 1000);
  }

  function packReveal(results) {
    const cards = results.map((r) => {
      const def = D.UNIT_MAP[r.id];
      const tag = r.isNew ? '<span class="reveal-tag">NEW!</span>' : `<span class="reveal-tag dup">+${r.shards} shards</span>`;
      return `<div class="flip glow-${def.rarity} ${r.holo ? 'is-holo' : ''}" tabindex="0" role="button" aria-label="Reveal card">
        <div class="flip-face flip-back">${Art.ICONS.crystals}</div>
        <div class="flip-face flip-front">${tag}${r.holo ? '<span class="holo-tag">HOLO</span>' : ''}${r.pity ? '<span class="holo-tag pity">PITY</span>' : ''}${unitCard(def, { tag: 'div', hideShards: true, holo: r.holo })}</div>
      </div>`;
    }).join('');
    const m = openModal(`
      <div style="text-align:center"><p class="eyebrow">Crate cracked open</p><h2>Tap each card to reveal</h2></div>
      <div class="reveal-row">${cards}</div>
      <div class="modal-actions" style="justify-content:center">
        <button class="btn" type="button" data-all>Reveal all</button>
        <button class="btn btn-primary" type="button" data-done>Done</button>
      </div>`, { onClose: () => App.refresh() });
    const flip = (f) => {
      if (f.classList.contains('flipped')) return;
      f.classList.add('flipped');
      if (f.classList.contains('glow-legendary')) toast('LEGENDARY!');
      else if (f.classList.contains('is-holo')) toast('HOLO card! Double value.');
    };
    m.root.addEventListener('click', (e) => {
      const f = e.target.closest('.flip');
      if (f) flip(f);
      if (e.target.closest('[data-all]')) $$('.flip', m.root).forEach((x, i) => setTimeout(() => flip(x), i * 180));
      if (e.target.closest('[data-done]')) m.close();
    });
    m.root.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('flip')) {
        e.preventDefault();
        flip(e.target);
      }
    });
  }

  root.UI = { $, $$, el, esc, fmt, cur, portrait, stars, unitCard, toast, openModal, confirmBox, updateWallet, inspect, synergyBanner, App, Screens };
})(window);
