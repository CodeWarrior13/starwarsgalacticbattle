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

  // Exclusive cards stay a mystery until their guardian falls.
  function mysteryCard(def, opts = {}) {
    const tag = opts.tag || 'button';
    return `<${tag} class="ucard mystery ${def.faction === 'dark' ? 'dark' : 'light'}" data-id="${def.id}" ${tag === 'button' ? 'type="button" aria-label="Undiscovered card"' : ''}>
      <div class="portrait mystery-art"><svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#06040e"/><circle cx="50" cy="46" r="30" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 4"/><text x="50" y="60" text-anchor="middle" font-size="44" font-weight="800" fill="currentColor" font-family="Oxanium, sans-serif">?</text></svg><span class="nameplate">???</span></div>
      <div class="ucard-body">
        <div class="ucard-meta"><span class="rar">Undiscovered</span><span>${def.kind === 'ship' ? 'Ship' : 'Hero'}</span></div>
      </div>
    </${tag}>`;
  }

  function unitCard(def, opts = {}) {
    if (def.exclusive && !Player.owns(def.id)) return mysteryCard(def, opts);
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
  // Never let toasts pile up: the same message refreshes in place and at
  // most two are on screen at once.
  function toast(text) {
    const rootEl = $('#toast-root');
    const same = [...rootEl.children].find((n) => n.dataset.text === text);
    if (same) same.remove();
    while (rootEl.children.length >= 2) rootEl.firstElementChild.remove();
    const t = el(`<div class="toast">${esc(text)}</div>`);
    t.dataset.text = text;
    rootEl.appendChild(t);
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
      if (a.level >= D.MAX_ACCOUNT_LEVEL && !document.body.classList.contains('in-battle')) celebrateFeat('grinder');
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

    go(screen, params, opts = {}) {
      if (App.battleActive && screen !== 'battle') return;
      App.current = screen;
      App.params = params || {};
      $$('.main-nav button').forEach((b) => {
        const active = b.dataset.nav === screen || (b.dataset.nav === 'home' && ['squad', 'campaign', 'battle'].includes(screen));
        b.classList.toggle('active', active);
      });
      const container = $('#screen');
      container.innerHTML = '';
      container.appendChild(Screens[screen](App.params));
      updateWallet();
      // Slide the console's saber under the active tab.
      const navEl = $('.main-nav');
      const ti = ['home', 'collection', 'market'].indexOf(['squad', 'campaign', 'battle', 'secret'].includes(screen) ? 'home' : screen);
      if (navEl && ti >= 0) { navEl.style.setProperty('--ti', ti); navEl.dataset.tab = ti; }
      const mk = $('.main-nav [data-nav="market"]');
      if (mk) mk.classList.toggle('has-dot', !Player.dailyStatus().claimed);
      if (!opts.keepScroll) window.scrollTo({ top: 0 });
      if (root.Sound && screen !== 'battle') root.Sound.music('menu');
    },

    // Re-render in place: shop buys, gambling and toggles keep your scroll position.
    refresh() {
      const y = window.scrollY;
      App.go(App.current, App.params, { keepScroll: true });
      window.scrollTo({ top: y });
    },
  };

  // ---------- Screens ----------
  const Screens = {};

  // ---------- The Galaxy hub ----------
  // One screen for every fight: Ground, Fleet, Bosses and the Endless Tower
  // live on the same animated map. Tapping a world plays its arrival
  // cinematic, then drops down a datapad of stages.
  const HUB_MODES = [
    { id: 'character', icon: '⚔', label: 'Ground' },
    { id: 'ship', icon: '✈', label: 'Fleet' },
    { id: 'boss', icon: '☠', label: 'Bosses' },
    { id: 'tower', icon: '♜', label: 'Tower' },
  ];

  function planetCounts(p, mode) {
    const cleared = Player.planetCleared(p.id);
    if (mode === 'character' || mode === 'ship') {
      const idx = p.stages.map((s, i) => (s.kind === mode ? i : -1)).filter((i) => i >= 0);
      return { done: idx.filter((i) => i < cleared).length, total: idx.length };
    }
    return { done: cleared, total: p.stages.length };
  }

  function planetBosses(p) {
    return D.BOSS_ENCOUNTERS.filter((b) => b.unlock === p.id);
  }

  function mapLabel(p, mode) {
    const unlocked = Player.planetUnlocked(p.id);
    if (!unlocked) return '🔒';
    if (mode === 'boss') {
      const bs = planetBosses(p);
      if (!bs.length) return 'Finale boss';
      const beaten = bs.filter((b) => Player.state.bosses[b.id]).length;
      return `☠ ${bs.map((b) => D.UNIT_MAP[b.id].name).join(', ')}${beaten ? ' ✓' : ''}`;
    }
    const c = planetCounts(p, 'all');
    const k = mode === 'character' || mode === 'ship' ? planetCounts(p, mode) : null;
    return `${c.done}/${c.total} stages${k ? ` · ${mode === 'ship' ? '✈' : '⚔'} ${k.done}/${k.total}` : ''}`;
  }

  Screens.home = function () {
    const s = Player.state;
    const owned = Object.keys(s.units).length;
    const liberated = D.PLANETS.filter((p) => Player.planetComplete(p.id)).length;
    const bossesBeaten = Object.keys(s.bosses).length;
    const current = Player.currentPlanet();
    const mode = App.ui.hubMode || 'character';
    const totalStages = D.PLANETS.reduce((a, p) => a + p.stages.length, 0);
    const t = s.tower;

    const towerPanel = () => {
      const enc = Player.encounter({ type: 'tower' });
      const r = D.towerRewards(enc.floor);
      const cp = D.towerCheckpoint(enc.floor);
      const tiers = Array.from({ length: 7 }, (_, i) => enc.floor + 3 - i).filter((f) => f >= 1);
      return `<div class="tower-panel">
        <div class="tower-shaft">${tiers.map((f) => `<span class="tower-tier ${f === enc.floor ? 'now' : f < enc.floor ? 'below' : ''} ${f % D.TOWER.bossEvery === 0 ? 'boss' : ''}">${f % D.TOWER.bossEvery === 0 ? '☠ ' : ''}${f}</span>`).join('')}</div>
        <div class="tower-info">
          <p class="eyebrow">Endless Tower · Checkpoint ${cp}</p>
          <h2>Floor ${enc.floor}</h2>
          <p class="tower-name">${esc(enc.name)} · ${enc.kind === 'ship' ? '✈ Fleet' : '⚔ Ground'} · ${esc(D.PLANET_MAP[enc.planet].name)}</p>
          <div class="mini-row">${enc.enemies.map((id) => miniPortrait(D.UNIT_MAP[id])).join('')}</div>
          <p class="muted small">Enemy Lv ${enc.level} · ${enc.stars}★ · Best floor ${t.best || 0}</p>
          <div class="tower-rewards">${cur('credits', r.credits)}${r.crystals ? cur('crystals', r.crystals) : ''}<span class="muted small">+ luck spin & XP</span></div>
          <button class="btn btn-primary" type="button" data-tower-go>Enter floor ${enc.floor}</button>
          <p class="muted small">Random worlds, random squads, a boss every ${D.TOWER.bossEvery} floors. Lose and you drop back to the last checkpoint.</p>
        </div>
      </div>`;
    };

    const v = el(`<section class="view hub">
      <div class="home-galaxy galaxy-map mode-${mode}" data-home-map>
        <canvas data-map-canvas></canvas>
        <div class="hg-actors" data-actors data-mode="${mode}" aria-hidden="true"></div>
        ${D.PLANETS.map((p) => {
          const unlocked = Player.planetUnlocked(p.id);
          const dim = mode === 'boss' && !planetBosses(p).length && !Player.planetComplete(p.id);
          return `<button class="map-planet ${unlocked ? '' : 'locked'} ${dim ? 'dim' : ''} ${p.id === current.id ? 'selected' : ''} ${Player.planetComplete(p.id) ? 'done' : ''}" type="button" data-planet="${p.id}" style="left:calc(var(--map-inset, 0%) + (100% - 2 * var(--map-inset, 0%)) * ${p.map.x / 100});top:${p.map.y}%;--pc:${p.color || '#ffd23f'}" ${unlocked ? '' : 'disabled'} aria-label="${esc(p.name)}">
            <span class="map-label">${esc(p.name)}<small>${esc(mapLabel(p, mode))}</small></span>
          </button>`;
        }).join('')}
        <div class="hg-title">
          <p class="eyebrow">A long time ago, in a galaxy far, far away…</p>
          <h1>Command <em>the galaxy.</em></h1>
        </div>
        <div class="hub-modes seg" role="tablist" aria-label="Battle mode">
          ${HUB_MODES.map((m) => `<button type="button" role="tab" data-mode="${m.id}" class="${mode === m.id ? 'active' : ''}" aria-selected="${mode === m.id}"><span>${m.icon}</span> ${m.label}</button>`).join('')}
        </div>
        ${mode === 'tower' ? towerPanel() : ''}
        <div class="hg-progress"><b>${liberated}/${D.PLANETS.length}</b> worlds liberated<i style="--p:${(Player.totalCleared() / totalStages) * 100}%"></i><small>${Player.totalCleared()}/${totalStages} stages · ${bossesBeaten}/${D.BOSS_ENCOUNTERS.length} bosses</small></div>
        <div class="hg-actions">
          ${mode === 'tower' ? '' : `<button class="btn btn-primary" type="button" data-planet="${current.id}">Continue on ${esc(current.name)}</button>`}
        </div>
      </div>
    </section>`);

    requestAnimationFrame(() => {
      const mc = $('[data-map-canvas]', v);
      // The newest world you have reached sets the map's backdrop.
      const frontier = [...D.PLANETS].reverse().find((p) => Player.planetUnlocked(p.id)) || D.PLANETS[0];
      if (mc) new root.GalaxyMap(mc, D.PLANETS, () => ({
        unlocked: (id) => Player.planetUnlocked(id),
        cleared: (id) => Player.planetCleared(id),
        current: current.id,
        frontier: frontier.id,
      }));
      // First time a new backdrop shows: a short "new sector" banner.
      let seen = null;
      try { seen = localStorage.getItem('swcg-map-sector'); } catch (e) { seen = null; }
      if (seen !== frontier.id) {
        try { localStorage.setItem('swcg-map-sector', frontier.id); } catch (e) { /* storage unavailable */ }
        if (seen && motionOK()) {
          const host = $('[data-home-map]', v);
          const ban = el(`<div class="sector-banner" style="--pc:${frontier.color || '#ffd23f'}"><span>New sector reached</span><b>${esc(frontier.name)}</b></div>`);
          host.appendChild(ban);
          if (root.Sound) root.Sound.play('whoosh');
          setTimeout(() => ban.remove(), 3600);
        }
      }
      homeActors($('[data-actors]', v));
      // Arriving from a result screen ("Travel to…"): open that world straight away.
      if (App.ui.openPlanet) {
        const id = App.ui.openPlanet;
        App.ui.openPlanet = null;
        const btn = $(`.map-planet[data-planet="${id}"]`, v);
        if (btn && !btn.disabled) openPlanet(id, btn, mode);
      }
    });
    v.addEventListener('click', async (e) => {
      const m = e.target.closest('[data-mode]');
      if (m) {
        App.ui.hubMode = m.dataset.mode;
        return App.refresh();
      }
      if (e.target.closest('[data-tower-go]')) return App.go('squad', { type: 'tower' });
      const pl = e.target.closest('[data-planet]');
      if (pl && !pl.disabled) {
        const btn = $(`.map-planet[data-planet="${pl.dataset.planet}"]`, v);
        return openPlanet(pl.dataset.planet, btn, mode === 'tower' ? 'character' : mode);
      }
    });
    return v;
  };

  // Old routes land on the hub.
  Screens.campaign = function (params) {
    App.current = 'home';
    if (App.ui.planet && params && params.open) App.ui.openPlanet = App.ui.planet;
    return Screens.home(params);
  };

  // ---------- Planet arrival cinematic ----------
  const PLANET_FX = { desert: 'embers', snow: 'warp', swamp: 'mist', clouds: 'rays', forest: 'leaves', beach: 'orbs', city: 'scan', canyon: 'embers', lava: 'embers', storm: 'lightning', siege: 'blasts' };

  function openPlanet(id, btn, mode) {
    const p = D.PLANET_MAP[id];
    if (btn) {
      btn.classList.remove('lit');
      void btn.offsetWidth;
      btn.classList.add('lit');
    }
    if (!motionOK()) return planetDropdown(p, mode);
    const from = btn ? btn.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const c = planetCounts(p, 'all');
    const color = p.color || '#ffd23f';
    const node = el(`<div class="planet-cine" style="--pc:${color}" role="status">
      <canvas class="pc-env"></canvas>
      <canvas class="pc-fx"></canvas>
      <div class="pc-vignette"></div>
      <canvas class="pc-planet"></canvas>
      <div class="pc-band"><div class="syn-sheen"></div></div>
      <div class="pc-sabers"><i></i><i></i><b></b></div>
      <div class="pc-text">
        <span class="pc-kicker">${esc(p.region)} · Planet ${D.PLANETS.indexOf(p) + 1} of ${D.PLANETS.length}</span>
        <b class="pc-name">${esc(p.name)}</b>
        <span class="pc-sub">${c.done}/${c.total} stages complete · ${esc(p.terrain.name)}</span>
      </div>
      <span class="pc-skip">Tap to skip</span>
    </div>`);
    document.body.appendChild(node);
    // Living backdrop: the planet's own battlefield, plus a themed overlay.
    let env = null;
    try { env = new root.Env($('.pc-env', node), p.id, 'ground'); } catch (err) { env = null; }
    bannerFx($('.pc-fx', node), PLANET_FX[p.env] || 'rays', color);
    // The planet flies from the map to centre stage and keeps spinning.
    const pc = $('.pc-planet', node);
    const size = Math.min(innerWidth, innerHeight) * 0.5;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    pc.width = pc.height = size * dpr;
    pc.style.width = pc.style.height = size + 'px';
    const ctx = pc.getContext('2d');
    ctx.scale(dpr, dpr);
    let tt = 0;
    const spin = () => {
      if (!node.isConnected) return;
      tt += 0.016;
      ctx.clearRect(0, 0, size, size);
      root.drawPlanetSphere(ctx, size / 2, size / 2, size * 0.36, p.id, tt * 3, { halo: 0.55 });
      requestAnimationFrame(spin);
    };
    spin();
    const fx0 = from.left + from.width / 2 - innerWidth / 2;
    const fy0 = from.top + from.height / 2 - innerHeight / 2;
    pc.animate([
      { transform: `translate(calc(-50% + ${fx0}px), calc(-50% + ${fy0}px)) scale(.12)`, opacity: 0.8 },
      { transform: 'translate(-50%, -50%) scale(1.1)', opacity: 1, offset: 0.35 },
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1, offset: 0.8 },
      { transform: 'translate(-50%, -62%) scale(.55)', opacity: 0 },
    ], { duration: 2500, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      node.classList.add('out');
      if (env) env.stop();
      setTimeout(() => node.remove(), 380);
      planetDropdown(p, mode);
    };
    node.addEventListener('click', finish);
    setTimeout(finish, 2500);
  }

  // ---------- Stage datapad (drop-down) ----------
  function planetDropdown(p, mode) {
    $$('.planet-drop-wrap').forEach((n) => n.remove());
    let filter = mode === 'character' || mode === 'ship' || mode === 'boss' ? mode : 'all';
    const cleared = Player.planetCleared(p.id);
    const c = planetCounts(p, 'all');
    const bosses = planetBosses(p);
    const wrap = el(`<div class="planet-drop-wrap" style="--pc:${p.color || '#ffd23f'}">
      <div class="planet-drop" role="dialog" aria-label="${esc(p.name)} stages">
        <span class="pd-corner tl"></span><span class="pd-corner tr"></span><span class="pd-corner bl"></span><span class="pd-corner br"></span>
        <div class="pd-head">
          <canvas class="pd-sphere"></canvas>
          <div class="pd-title">
            <p class="eyebrow">${esc(p.region)} · ${c.done}/${c.total} complete</p>
            <h2>${esc(p.name)}</h2>
            <div class="banner-progress"><i style="width:${(c.done / c.total) * 100}%"></i></div>
          </div>
          <button class="icon-btn pd-close" type="button" data-close aria-label="Close">×</button>
        </div>
        <p class="pd-blurb muted">${esc(p.blurb)}</p>
        <div class="pd-rules">
          <span class="pd-rule">◉ <b>${esc(p.terrain.name)}</b> ${esc(p.terrain.desc)}</span>
          <span class="pd-rule hazard">⚠ <b>${esc(p.hazard.name)}</b> ${esc(p.hazard.desc)}</span>
        </div>
        <div class="seg pd-filter" role="tablist">
          ${[['all', 'All'], ['character', '⚔ Ground'], ['ship', '✈ Fleet'], ['boss', '☠ Boss']].map(([k, l]) => `<button type="button" data-filter="${k}">${l}</button>`).join('')}
        </div>
        <div class="pd-list" data-list></div>
      </div>
    </div>`);
    const renderList = () => {
      $$('[data-filter]', wrap).forEach((b) => b.classList.toggle('active', b.dataset.filter === filter));
      const rows = p.stages.map((stg, i) => ({ stg, i })).filter(({ stg, i }) => {
        if (filter === 'boss') return i === p.stages.length - 1;
        // The stage you're up to always shows, whatever the filter.
        return filter === 'all' || stg.kind === filter || i === cleared;
      }).map(({ stg, i }, k) => {
        const state = i < cleared ? 'cleared' : i === cleared ? 'current' : 'locked';
        const r = D.stageRewards(p.id, i);
        const enc = Player.encounter({ type: 'stage', planet: p.id, stage: i });
        const enemyPower = enc.enemies.reduce((a, id) => a + D.power(D.UNIT_MAP[id], stg.level, enc.stars), 0);
        const finale = i === p.stages.length - 1;
        return `<button class="pd-stage ${state} ${finale ? 'finale' : ''}" type="button" data-stage="${i}" ${state === 'locked' ? 'disabled' : ''} style="--k:${k}">
          <span class="stage-num">${state === 'cleared' ? '✓' : finale ? '☠' : i + 1}</span>
          <span class="pd-stage-body">
            <b><span class="kind-badge ${stg.kind}">${stg.kind === 'ship' ? '✈ Fleet' : '⚔ Ground'}</span> ${esc(stg.name)}${finale ? ' <span class="tag">Finale boss</span>' : ''}</b>
            <span class="stage-info"><span>Lv ${stg.level} · ${enc.stars}★</span><span>⚡ ${fmt(enemyPower)}</span>${cur('credits', r.credits)}${state !== 'cleared' ? `<span class="first-clear">${cur('crystals', r.firstClearCrystals + (finale ? D.PLANET_CLEAR_KYBER : 0))}</span>` : ''}</span>
          </span>
          <span class="mini-row">${enc.enemies.map((id) => miniPortrait(D.UNIT_MAP[id])).join('')}</span>
        </button>`;
      });
      const bossRows = (filter === 'all' || filter === 'boss') ? bosses.map((enc, k) => {
        const def = D.UNIT_MAP[enc.id];
        const unlocked = Player.bossUnlocked(enc);
        const wins = Player.state.bosses[enc.id] || 0;
        const r = D.bossRewards(enc, !wins);
        return `<button class="pd-stage boss-row ${unlocked ? '' : 'locked'}" type="button" data-boss="${enc.id}" ${unlocked ? '' : 'disabled'} style="--k:${rows.length + k}">
          <span class="boss-thumb">${Art.unitArt(def)}</span>
          <span class="pd-stage-body">
            <b><span class="kind-badge boss">☠ Boss</span> ${esc(enc.name)}</b>
            <span class="stage-info"><span>${esc(def.name)} · Lv ${enc.level}</span>${cur('credits', r.credits)}${cur('aurodium', r.aurodium)}${r.kyber ? cur('crystals', r.kyber) : ''}<span>${unlocked ? (wins ? `Defeated ${wins}×` : 'Not yet defeated') : `🔒 Liberate ${esc(p.name)}`}</span></span>
          </span>
        </button>`;
      }) : [];
      const all = rows.concat(bossRows);
      $('[data-list]', wrap).innerHTML = all.length ? all.join('') : '<p class="muted">No battles of this type on this world.</p>';
    };
    renderList();
    document.body.appendChild(wrap);
    spinSphere($('.pd-sphere', wrap), p.id);
    const close = () => {
      wrap.classList.add('out');
      setTimeout(() => wrap.remove(), 300);
      document.removeEventListener('keydown', onKey);
    };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap || e.target.closest('[data-close]')) return close();
      const f = e.target.closest('[data-filter]');
      if (f) { filter = f.dataset.filter; return renderList(); }
      const st = e.target.closest('[data-stage]');
      if (st && !st.disabled) { close(); return App.go('squad', { type: 'stage', planet: p.id, stage: Number(st.dataset.stage) }); }
      const b = e.target.closest('[data-boss]');
      if (b && !b.disabled) { close(); App.go('squad', { type: 'boss', boss: b.dataset.boss }); }
    });
  }

  // Ambient scenes drifting across the home galaxy, like a title-screen diorama:
  // dogfights, Star Destroyers, the Falcon jumping to lightspeed, Mando on his
  // jetpack, Grogu's pram, R2's escape pod and a probe droid.
  const ACTOR_ART = {
    mando: `<svg viewBox="0 0 100 100"><path d="M40 60 L36 96 L44 62Z" fill="#ffb03a"/><path d="M41 60 L39 84 L43 61Z" fill="#fff4c0"/><rect x="36" y="38" width="10" height="24" rx="3" fill="#9aa0a8"/><path d="M50 40 L34 74 L52 68Z" fill="#6a5440"/><rect x="47" y="38" width="20" height="28" rx="5" fill="#8a8f84"/><rect x="49" y="40" width="16" height="10" rx="3" fill="#c8ced4"/><rect x="50" y="64" width="7" height="20" rx="2" fill="#5a5a50"/><rect x="59" y="64" width="7" height="18" rx="2" fill="#5a5a50" transform="rotate(-20 62 64)"/><circle cx="58" cy="28" r="11" fill="#c8ced4"/><path d="M50 26 H66 V30 H60 V39 H56 V30 H50Z" fill="#111"/><ellipse cx="54" cy="22" rx="4" ry="2" fill="#fff" opacity=".6"/></svg>`,
    grogu: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="84" rx="22" ry="5" fill="#8fd3ff" opacity=".35"/><path d="M18 56 L82 56 Q80 74 50 76 Q20 74 18 56Z" fill="#9aa0a8"/><path d="M41 48 L20 40 L40 53Z" fill="#8ab870"/><path d="M59 48 L80 40 L60 53Z" fill="#8ab870"/><ellipse cx="50" cy="48" rx="10" ry="9" fill="#9ac880"/><circle cx="46" cy="47" r="2.4" fill="#111"/><circle cx="54" cy="47" r="2.4" fill="#111"/><circle cx="46.6" cy="46.3" r=".8" fill="#fff"/><circle cx="54.6" cy="46.3" r=".8" fill="#fff"/><path d="M36 56 Q50 50 64 56Z" fill="#b89a70"/><path d="M16 56 A34 26 0 0 1 36 34" stroke="#c8ccd0" stroke-width="4" fill="none"/><rect x="16" y="54" width="68" height="4" rx="2" fill="#c8ccd0"/></svg>`,
    pod: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="24" fill="#d8dce0"/><path d="M26 50 A24 24 0 0 0 74 50Z" fill="#aab0b8"/><circle cx="44" cy="44" r="8" fill="#1a2433"/><path d="M38 44 A6 6 0 0 1 50 44Z" fill="#5a8ad8"/><circle cx="44" cy="41" r="1.4" fill="#ff3a3a"/><rect x="70" y="46" width="12" height="8" rx="2" fill="#8a929e"/><circle cx="84" cy="50" r="3" fill="#9fdcff" opacity=".8"/></svg>`,
    purrgil: `<svg viewBox="0 0 100 100"><path d="M8 50 C20 30 60 26 84 40 C92 44 96 50 92 56 C70 70 26 70 8 50Z" fill="#6a8ab8"/><path d="M8 50 C26 62 64 64 92 56" stroke="#3a5a88" stroke-width="3" fill="none"/><path d="M20 58 L10 80 M34 62 L28 86 M50 63 L48 88" stroke="#5a7aa8" stroke-width="4" stroke-linecap="round"/><circle cx="80" cy="44" r="3" fill="#fff"/><path d="M30 42 C40 38 56 38 66 42" stroke="#9fc4ff" stroke-width="2" fill="none" opacity=".6"/></svg>`,
    rock: `<svg viewBox="0 0 100 100"><path d="M20 30 L46 12 L78 22 L90 52 L72 84 L36 88 L12 62Z" fill="#6a6560"/><path d="M46 12 L78 22 L90 52 L60 46Z" fill="#8a847c"/><circle cx="40" cy="56" r="8" fill="#4a4540"/><circle cx="66" cy="68" r="5" fill="#4a4540"/></svg>`,
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
    // More diorama moments: a squadron in formation, a chase, space whales,
    // a tumbling asteroid and a Star Destroyer with its TIE escort.
    scenes.push(
      () => { const dir = Math.random() < 0.5 ? 1 : -1; const y = 0.15 + Math.random() * 0.6; [0, 1, 2, 3].forEach((i) => fly(shipSvg('x_wing'), { dir, y: y + (i % 2 ? 0.05 : -0.05) * Math.ceil(i / 2), dy: 0.05, size: 34, dur: 6400, delay: i * 180 })); },
      () => { const dir = Math.random() < 0.5 ? 1 : -1; const y = 0.2 + Math.random() * 0.5; fly(shipSvg('falcon'), { dir, y, dy: -0.1, size: 50, dur: 4600 }); const s1 = fly(shipSvg('slave_one') + '<i class="hg-bolt"></i>', { dir, y: y + 0.04, dy: -0.1, size: 42, dur: 4600, delay: 600 }); s1.classList.add('gunner'); },
      () => { const dir = Math.random() < 0.5 ? 1 : -1; const y = 0.25 + Math.random() * 0.45; [0, 1, 2].forEach((i) => fly(ACTOR_ART.purrgil, { dir, y: y + i * 0.06, dy: -0.04, size: 70 - i * 14, nose: false, dur: 15000, delay: i * 900, cls: 'bob far2' })); },
      () => fly(ACTOR_ART.rock, { size: 30 + Math.random() * 30, nose: false, spin: true, dur: 12000 }),
      () => { const dir = Math.random() < 0.5 ? 1 : -1; const y = 0.1 + Math.random() * 0.2; fly(Art.shipOnly({ shape: 'isd' }), { dir, y, dy: 0.03, size: 110, dur: 20000, cls: 'far' }); [0, 1, 2].forEach((i) => fly(shipSvg('tie_fighter'), { dir, y: y + 0.08 + i * 0.03, dy: 0.03, size: 20, dur: 20000, delay: 400 + i * 300, cls: 'far' })); },
    );
    const weights = [3, 1, 2, 2, 1, 2, 1.5, 1, 1, 1.5, 1.5, 1, 1.2, 0.8];
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
          <button class="btn btn-primary" type="button" data-fight>${params.type === 'secret' && Player.secretCost(params.boss) ? `Engage · ${cur('crystals', Player.secretCost(params.boss))}` : 'Engage'}</button>
        </div>
      </div>
      <div class="versus ${enc.boss ? 'boss-versus' : ''}">
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
        <div class="roster-head"><span class="eyebrow">Your roster</span><span class="muted small">Tap to add or remove · up to ${size}</span></div>
        <div class="roster-filters" data-roster-filters></div>
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
      const owned = D.UNITS.filter((u) => u.kind === kind && Player.owns(u.id)).sort((a, b) => Player.powerOf(b.id) - Player.powerOf(a.id));
      // Filters: one role and one trait at a time. Trait chips show how many
      // you own and how many are already in the squad, to plan synergies.
      const rf = App.ui.squadRole || 'all';
      const tf = App.ui.squadTrait || 'all';
      const ROLES = [['attacker', 'Attacker', '⚔'], ['tank', 'Tank', '⛨'], ['healer', 'Healer', '✚'], ['support', 'Support', '✦']];
      const traitCount = {};
      owned.forEach((u) => (D.TRAITS[u.id] || []).forEach((t) => { traitCount[t] = (traitCount[t] || 0) + 1; }));
      const inSquad = {};
      squad.forEach((id) => (D.TRAITS[id] || []).forEach((t) => { inSquad[t] = (inSquad[t] || 0) + 1; }));
      const traits = Object.keys(traitCount).filter((t) => D.TRAIT_INFO[t]).sort((a, b) => (inSquad[b] || 0) - (inSquad[a] || 0) || traitCount[b] - traitCount[a]);
      $('[data-roster-filters]', v).innerHTML = `
        <div class="rf-bar">
          <div class="rf-roles" role="group" aria-label="Filter by role"><button type="button" class="${rf === 'all' ? 'on' : ''}" data-rf="all" title="All roles">All</button>${ROLES.filter(([k]) => owned.some((u) => u.role === k)).map(([k, l, ic]) => `<button type="button" class="${rf === k ? 'on' : ''}" data-rf="${k}" title="${l} · ${owned.filter((u) => u.role === k).length} owned">${ic}<span class="rf-l">${l}</span><sup>${owned.filter((u) => u.role === k).length}</sup></button>`).join('')}</div>
          <i class="rf-div"></i>
          <div class="rf-traits" aria-label="Filter by trait"><button type="button" class="rf-chip ${tf === 'all' ? 'on' : ''}" data-tf="all">All</button>${traits.map((t) => `<button type="button" class="rf-chip ${tf === t ? 'on' : ''} ${inSquad[t] ? 'in-squad' : ''}" data-tf="${t}" title="${D.TRAIT_INFO[t].label}: ${inSquad[t] ? `${inSquad[t]} in your squad, ` : ''}${traitCount[t]} owned">${D.TRAIT_INFO[t].icon} ${D.TRAIT_INFO[t].label}<em>${inSquad[t] ? `${inSquad[t]}/` : ''}${traitCount[t]}</em></button>`).join('')}</div>
        </div>`;
      const roster = owned.filter((u) => (rf === 'all' || u.role === rf) && (tf === 'all' || (D.TRAITS[u.id] || []).includes(tf)));
      $('[data-roster]', v).innerHTML = (roster.length ? '' : '<p class="muted">No units match these filters.</p>') + roster.map((def) => {
        const idx = squad.indexOf(def.id);
        return unitCard(def, { selected: idx >= 0, badge: idx >= 0 ? idx + 1 : null, hideShards: true, traits: true });
      }).join('');
      $('[data-fight]', v).disabled = squad.length === 0;
    }

    v.addEventListener('click', (e) => {
      if (e.target.closest('[data-back]')) return App.go(params.type === 'secret' ? 'secret' : 'home');
      const rfb = e.target.closest('[data-rf]');
      if (rfb) { App.ui.squadRole = rfb.dataset.rf; return render(); }
      const tfb = e.target.closest('[data-tf]');
      if (tfb) { App.ui.squadTrait = tfb.dataset.tf; return render(); }
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
        <button class="btn filter-toggle ${ui.collectionFiltersOpen ? 'open' : ''}" type="button" data-filters-toggle aria-expanded="${!!ui.collectionFiltersOpen}">
          ${root.Icons.svg('reticle')}<span>Filter & sort</span><b class="ft-count" data-ft-count></b><i class="ft-chev">▾</i>
        </button>
      </div>
      <div class="ft-summary" data-ft-summary></div>
      <div class="filter-drawer ${ui.collectionFiltersOpen ? 'open' : ''}" data-drawer>
        <div class="fd-inner">
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
          <button class="linkish" type="button" data-filters-reset>Reset</button>
        </div>
        <div class="class-bar" data-classes></div>
        </div>
      </div>
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
      // Closed drawer: a one-line summary of what is filtered.
      const parts = [];
      if (ui.collectionKind !== 'all') parts.push(ui.collectionKind === 'ship' ? 'Ships' : 'Heroes');
      if (ui.collectionFaction !== 'all') parts.push(ui.collectionFaction === 'light' ? 'Light Side' : 'Dark Side');
      if (ui.collectionClass !== 'all') parts.push(D.CLASS_INFO[ui.collectionClass].label);
      const n = parts.length;
      parts.push(SORTS[ui.collectionSort].label);
      $('[data-ft-count]', v).textContent = n ? String(n) : '';
      $('[data-ft-summary]', v).innerHTML = parts.map((x) => `<span>${esc(x)}</span>`).join('');
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
      if (e.target.closest('[data-filters-toggle]')) {
        ui.collectionFiltersOpen = !ui.collectionFiltersOpen;
        const t = $('[data-filters-toggle]', v);
        t.classList.toggle('open', ui.collectionFiltersOpen);
        t.setAttribute('aria-expanded', ui.collectionFiltersOpen);
        $('[data-drawer]', v).classList.toggle('open', ui.collectionFiltersOpen);
        return;
      }
      if (e.target.closest('[data-filters-reset]')) {
        Object.assign(ui, { collectionKind: 'all', collectionFaction: 'all', collectionClass: 'all', collectionSort: 'strong' });
        render();
        return;
      }
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
      if (card) inspect(card.dataset.id, render, $$('[data-grid] .ucard', v).map((c) => c.dataset.id));
    });
    render();
    return v;
  };

  // ---------- Card inspector ----------
  // Center: the card (tap to flip to its description). Swipe or use the
  // arrows: left page shows stats, right page shows upgrades.
  // list: the card ids to page through, so swiping past the last page moves
  // on to the next card (and back past the first page to the previous one).
  function inspect(id, onChange, list) {
    let def = D.UNIT_MAP[id];
    if (def.exclusive && !Player.owns(id)) {
      const m = openModal(`<div class="mystery-modal ${def.faction === 'dark' ? 'dark' : 'light'}">
        <p class="eyebrow">Undiscovered ${def.kind === 'ship' ? 'ship' : 'hero'} · ${def.faction === 'dark' ? 'Dark Side' : 'Light Side'}</p>
        <h2>???</h2>
        <div class="mystery-big">?</div>
        <p class="muted">Not yet discovered.</p>
        <div class="modal-actions"><button class="btn" type="button" data-close>Close</button></div>
      </div>`, { small: true });
      m.root.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) m.close(); });
      return;
    }
    let page = 1;
    let flipped = false;
    // Upgrade feedback lives inside the inspector instead of stacking toasts.
    let msg = null;
    const cards = (list || []).filter((x) => { const u = D.UNIT_MAP[x]; return u && !(u.exclusive && !Player.owns(x)); });
    const pos = () => cards.indexOf(id);

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

    function ultPage() {
      const ult = D.abilitiesFor(def).find((ab) => ab.ultimate);
      return `<div class="ipage-inner ult-page">
        <p class="eyebrow">Ultimate</p>
        <h2>★ ${esc(ult ? ult.name : 'Ultimate')}</h2>
        ${ult ? `<p>${esc(ult.desc)}</p>${ult.quote ? `<q class="ult-quote">${esc(ult.quote)}</q>` : ''}` : ''}
        <button class="ult-preview" type="button" data-watch aria-label="Watch ${esc(ult ? ult.name : 'the ultimate')} in action">${portrait(def)}<span class="ult-play">▶</span><span class="ult-tap">Tap to watch</span></button>
        <p class="muted small">Tap the card to play its full cutscene and ultimate in a training simulation. Nothing is spent or earned.</p>
      </div>`;
    }

    const labels = ['Stats', 'Card', 'Upgrades', 'Ultimate'];
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
            <div class="ipage">${ultPage()}</div>
          </div>
        </div>
        <div class="insp-foot">
          <div class="insp-status">${msg ? `<span class="insp-msg" style="--k:${msg.n}">${esc(msg.text)}${msg.n > 1 ? ` <b>×${msg.n}</b>` : ''}</span>` : cards.length > 1 && pos() >= 0 ? `<span class="muted small">Card ${pos() + 1} of ${cards.length} · ${page === 3 ? 'swipe again for the next card' : 'swipe past Ultimate for the next card'}</span>` : ''}</div>
          <button class="btn insp-close" type="button" data-close>Close</button>
        </div>
      </div>`;
    }

    // Swiping off either end moves to the neighbouring card in the list.
    const switchCard = (nid, pg, dir) => {
      id = nid;
      def = D.UNIT_MAP[id];
      page = pg;
      flipped = false;
      msg = null;
      render();
      // The new cover deals in from the side with a little spin and a glint.
      const big = $('.ipage:nth-child(2) .bigcard', modal);
      if (big && motionOK()) {
        big.animate([
          { transform: `translateX(${dir * 70}%) rotateY(${dir * -55}deg) scale(.82)`, opacity: 0, filter: 'brightness(1.8)' },
          { transform: `translateX(${dir * -4}%) rotateY(${dir * 6}deg) scale(1.02)`, opacity: 1, filter: 'brightness(1.15)', offset: 0.7 },
          { transform: 'none', opacity: 1, filter: 'none' },
        ], { duration: 520, easing: 'cubic-bezier(.2,.9,.3,1)' });
        big.classList.remove('deal-glint');
        void big.offsetWidth;
        big.classList.add('deal-glint');
      }
      if (root.Sound) root.Sound.play('whoosh');
    };
    const go = (p) => {
      const i = pos();
      if (cards.length > 1 && i >= 0) {
        // Either way, land on the next card's cover art.
        if (p > 3) return switchCard(cards[(i + 1) % cards.length], 1, 1);
        if (p < 0) return switchCard(cards[(i - 1 + cards.length) % cards.length], 1, -1);
      }
      page = Math.max(0, Math.min(3, p));
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
      if (e.target.closest('[data-watch]')) {
        const from = App.current;
        const params = App.params;
        m.close();
        return root.BattleUI.preview(id, () => { App.go(from, params, { keepScroll: true }); inspect(id, onChange, list); });
      }
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
      const say = (kind, text) => {
        const now = performance.now();
        msg = msg && msg.kind === kind && now - msg.at < 1800 ? { kind, text, n: msg.n + 1, at: now } : { kind, text, n: 1, at: now };
      };
      if (e.target.closest('[data-level]') && Player.levelUp(id)) say('level', `Level ${Player.unit(id).level}!`);
      else if (e.target.closest('[data-star]') && Player.starUp(id)) say('star', `Promoted to ${Player.unit(id).stars}★!`);
      else return;
      if (root.Sound) root.Sound.play('rankup');
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
  const PACK_COLOR = { recruit: '#4a8aff', squadron: '#9ab4d0', holocron: '#5ab4ff', strongbox: '#ff2a3a' };
  const PACK_ORIGIN = { recruit: 'Droid courier', squadron: 'Cloud City freezer', holocron: 'Jedi Archives', strongbox: 'Sith vault' };
  const oddsHtml = (o) => {
    const total = Object.values(o).reduce((a, b) => a + b, 0);
    const pct = (k) => `${((o[k] / total) * 100).toFixed(o[k] / total < 0.1 ? 1 : 0)}%`;
    return `<div class="odds">${o.common ? `<span class="c">C ${pct('common')}</span>` : ''}${o.rare ? `<span class="r">R ${pct('rare')}</span>` : ''}<span class="e">E ${pct('epic')}</span><span class="l">L ${pct('legendary')}</span>${o.mythic ? `<span class="m">M ${pct('mythic')}</span>` : ''}</div>`;
  };

  function timeLeft(ms) {
    const m = Math.max(0, Math.round(ms / 60000));
    return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
  }

  // Daily login streak: seven flip cards at the top of the Night Market.
  // The front only says which day it is, and each day looks rarer than the
  // last; tap a card to flip it and see exactly what it pays.
  const DAILY_EMBLEM = ['rank', 'blaster', 'kyber', 'sabacc', 'cubes', 'holocron', 'kybercrown'];
  function dailyRewardHtml(r) {
    const item = (html) => `<span class="dr-item">${html}</span>`;
    return [r.credits ? item(cur('credits', r.credits)) : '', r.crystals ? item(cur('crystals', r.crystals)) : '', r.aurodium ? item(cur('aurodium', r.aurodium)) : '',
      r.dice ? item(`${root.Icons.svg('sabacc')}<b>×${r.dice}</b>`) : '', r.charm ? item(`${root.Icons.svg('cubes')}<b>×${r.charm * 3}</b>`) : ''].join('');
  }

  function dailyPanel() {
    const st = Player.dailyStatus();
    const pos = st.claimed ? (st.streak - 1) % D.DAILY.length : st.dayIndex;
    const cells = D.DAILY.map((r, i) => {
      const state = i < pos ? 'done' : i === pos ? (st.claimed ? 'done today' : 'today') : 'future';
      return `<button class="daily-card tier-${i} ${state}" type="button" data-daily-card style="--i:${i}" aria-label="Day ${r.day} reward, tap to flip">
        <span class="dc-inner">
          <span class="dc-face dc-front">
            <span class="dc-rays"></span>
            <span class="dc-emblem">${root.Icons.svg(DAILY_EMBLEM[i])}</span>
            <span class="dc-day"><small>Day</small><b>${r.day}</b></span>
            ${state.includes('done') ? '<span class="dc-check">✓</span>' : ''}
          </span>
          <span class="dc-face dc-back">${dailyRewardHtml(r)}</span>
        </span>
      </button>`;
    }).join('');
    return `<div class="daily-panel ${st.claimed ? 'claimed' : 'ready'}" data-daily>
      <div class="daily-head">
        <div>
          <p class="eyebrow">Vekko's loyalty ledger</p>
          <h2 class="section-title">${root.Icons.svg('flame')} Daily Streak</h2>
        </div>
        <div class="daily-streak"><b>${st.streak}</b><span>days</span></div>
        <button class="btn btn-primary daily-claim" type="button" data-claim-daily ${st.claimed ? 'disabled' : ''}>${st.claimed ? 'Back tomorrow' : `Claim day ${pos + 1}`}</button>
      </div>
      <div class="daily-track">${cells}</div>
    </div>`;
  }

  function claimDailyFx(v) {
    const res = Player.claimDaily();
    if (!res) return;
    if (root.Sound) root.Sound.play('coins');
    const cell = $('.daily-card.today', v);
    updateWallet();
    if (cell && motionOK()) {
      cell.classList.add('claiming', 'flipped');
      const r = cell.getBoundingClientRect();
      for (let i = 0; i < 24; i++) {
        const c = document.createElement('i');
        c.className = 'daily-coin';
        c.style.left = r.left + r.width / 2 + 'px';
        c.style.top = r.top + r.height / 2 + 'px';
        document.body.appendChild(c);
        const a = Math.random() * Math.PI * 2;
        const d = 60 + Math.random() * 120;
        c.animate([{ transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d - 40}px)) scale(1)`, opacity: 1, offset: 0.6 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d + 60}px)) scale(.6)`, opacity: 0 }], { duration: 900 + Math.random() * 300, easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = () => c.remove();
      }
    }
    toast(`Day ${res.streak} claimed! ${res.reward.label}.`);
    setTimeout(() => {
      const panel = $('[data-daily]', v);
      if (panel) panel.outerHTML = dailyPanel();
    }, motionOK() ? 1800 : 0);
  }

  // Five knocks on the merchant in quick succession open the way to the Monolith.
  const knocks = { n: 0, last: 0 };
  function knock(node) {
    const now = performance.now();
    if (now - knocks.last > 2200) knocks.n = 0;
    knocks.n += 1;
    knocks.last = now;
    node.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-2px)' }, { transform: 'translateX(2px)' }, { transform: 'translateX(0)' }], { duration: 160 });
    if (knocks.n === 5) {
      knocks.n = 0;
      enterSecret();
    }
  }

  function enterSecret() {
    Player.state.secret.found = true;
    Player.save();
    if (root.Sound) { root.Sound.play('glitch'); root.Sound.play('ult'); }
    if (!motionOK()) return App.go('secret');
    const lines = ['› Unknown signal intercepted', '› Coordinates match no star chart', '› Plotting a course beyond the map…', '› Arriving: The Monolith'];
    const node = el(`<div class="secret-load" role="status" aria-live="polite">
      <canvas class="sl-warp"></canvas>
      <div class="sl-box">
        <div class="sl-sigil"><i></i><i></i></div>
        <div class="sl-lines">${lines.map((l, i) => `<p style="--i:${i}">${esc(l)}</p>`).join('')}</div>
        <div class="sl-bar"><i></i></div>
      </div>
    </div>`);
    document.body.appendChild(node);
    hyperspace($('.sl-warp', node), '#c8a8ff');
    setTimeout(() => {
      node.classList.add('out');
      App.go('secret');
      setTimeout(() => node.remove(), 600);
    }, 3600);
  }

  Screens.secret = function () {
    const sec = Player.state.secret;
    const bossCard = (b) => {
      const def = D.UNIT_MAP[b.id];
      const wins = sec.beaten[b.id] || 0;
      const rewards = b.rewards.map((id) => D.UNIT_MAP[id]);
      const open = Player.secretOpen(b.id);
      const reqs = Player.secretReqs(b.id);
      return `<button class="secret-boss ${b.side} ${open ? '' : 'sealed'}" type="button" data-secret="${b.id}" ${open ? '' : 'aria-disabled="true"'}>
        <span class="sb-art">${Art.unitArt(def)}${open ? '' : `<span class="sb-seal">${root.Icons.svg('lock')}</span>`}</span>
        <span class="sb-body">
          <span class="eyebrow">${b.side === 'light' ? 'Trial of Light' : 'Trial of Shadow'} · Lv ${b.level} · 7★</span>
          <h3>${esc(b.name)}</h3>
          <span class="muted">${esc(def.name)}</span>
          <span class="sb-rewards">${rewards.map((r) => (wins ? `<span class="sb-reward got">${miniPortrait(r)} ${esc(r.name)}</span>` : `<span class="sb-reward">??? ${r.kind === 'ship' ? 'ship' : 'hero'}</span>`)).join('')}</span>
          <span class="sb-status">${wins ? `Defeated ${wins}× · win again for more shards` : esc(b.hint)}</span>
          ${open ? '' : `<span class="sb-reqs"><b>Sealed until</b>${reqs.map((r) => `<span class="sb-req ${r.ok ? 'ok' : ''}">${r.ok ? '✓' : root.Icons.svg('lock')} ${esc(r.label)}</span>`).join('')}</span>`}
          ${open ? `<span class="sb-cost ${Player.secretCost(b.id) ? '' : 'free'}">${Player.secretCost(b.id) ? `Entry ${cur('crystals', Player.secretCost(b.id))} · ${sec.fails[b.id]} defeat${sec.fails[b.id] === 1 ? '' : 's'}` : 'Entry free'}</span>` : ''}
        </span>
      </button>`;
    };
    const light = D.SECRET_BOSSES.filter((b) => b.side === 'light');
    const dark = D.SECRET_BOSSES.filter((b) => b.side === 'dark');
    const v = el(`<section class="view secret-zone">
      <div class="secret-hero"><canvas data-secret-env></canvas>
        <div class="secret-title"><p class="eyebrow">Beyond the map</p><h1>The Monolith</h1><p>${esc(D.SECRET_PLANET.blurb)} Four guardians keep what cannot be found anywhere else.</p></div>
        <button class="btn" type="button" data-leave>Leave</button>
      </div>
      <div class="secret-grid">
        <div class="secret-side light"><h2>${root.Icons.svg('jedi')} The Light</h2>${light.map(bossCard).join('')}</div>
        <div class="secret-side dark"><h2>${root.Icons.svg('sith')} The Dark</h2>${dark.map(bossCard).join('')}</div>
      </div>
      <p class="muted small">Terrain: ${esc(D.SECRET_PLANET.terrain.name)}. ${esc(D.SECRET_PLANET.terrain.desc)} Hazard: ${esc(D.SECRET_PLANET.hazard.desc)}</p>
    </section>`);
    requestAnimationFrame(() => { const c = $('[data-secret-env]', v); if (c) new root.Env(c, 'mortis', 'ground'); });
    celebrateFeat('secret_found');
    celebrateFeat('secret_all');
    v.addEventListener('click', (e) => {
      if (e.target.closest('[data-leave]')) return App.go('market');
      const b = e.target.closest('[data-secret]');
      if (b && !Player.secretOpen(b.dataset.secret)) {
        b.classList.remove('shake');
        void b.offsetWidth;
        b.classList.add('shake');
        if (root.Sound) root.Sound.play('glitch');
        return toast(`The way is sealed. ${Player.secretReqs(b.dataset.secret).filter((r) => !r.ok).map((r) => r.label).join(' · ')}.`);
      }
      if (b) App.go('squad', { type: 'secret', boss: b.dataset.secret });
    });
    return v;
  };

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
        <div class="market-merchant" data-merchant>${Art.merchantArt()}</div>
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

      ${dailyPanel()}

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

      <h2 class="section-title">Relics</h2>
      <div class="shop-grid">
        ${D.PACKS.map((p) => {
          const odds = Player.effectiveOdds(p);
          const total = Object.values(odds).reduce((a, b) => a + b, 0);
          const kicker = `${PACK_ORIGIN[p.id] || ''} · ${p.kind === 'character' ? 'Heroes' : p.kind === 'ship' ? 'Ships' : 'All'}`;
          return `
          <div class="pack pack-${p.id}" style="--pc:${PACK_COLOR[p.id] || '#5ab4ff'}">
            <div class="pack-stage">
              <i class="pack-beam"></i><i class="pack-ring"></i>
              ${Array.from({ length: 8 }, (_, k) => `<i class="pack-mote" style="--x:${10 + k * 11}%;--d:${(k * 0.37).toFixed(2)}s"></i>`).join('')}
              <div class="pack-art">${Art.crateArt(p.id)}</div>
              <i class="pack-floor"></i>
              ${p.guarantee ? `<span class="pack-badge">Guaranteed ${esc(D.RARITIES[p.guarantee].label)}</span>` : ''}
            </div>
            <div class="pack-info">
              <span class="pack-kicker">${kicker}</span>
              <h3>${p.name}</h3>
              <p>${p.desc}</p>
              <div class="odds-bar" aria-hidden="true">${Object.entries(odds).filter(([, v]) => v > 0).map(([k, v]) => `<i class="ob-${k}" style="flex:${v}" title="${D.RARITIES[k].label} ${((v / total) * 100).toFixed(1)}%"></i>`).join('')}</div>
              ${oddsHtml(odds)}
              ${luck.charmCrates && p.id !== 'strongbox' ? '<span class="tag glow">Chance Cubes active</span>' : ''}
              <button class="btn btn-primary pack-open" type="button" data-pack="${p.id}" ${Player.canAfford(p.cost) ? '' : 'disabled'}>Open · ${costLabel(p.cost)}</button>
            </div>
          </div>`;
        }).join('')}
      </div>

      <div class="section-head">
        <h2 class="section-title">Hot Stock</h2>
        <span class="muted">Restocks in ${timeLeft(stock.refreshAt - Date.now())} <button class="btn btn-small" type="button" data-reroll ${s.crystals < D.RESTOCK_KYBER ? 'disabled' : ''}>Restock now · ${cur('crystals', D.RESTOCK_KYBER)}</button></span>
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
            <div><b>Kyber Exchange</b><p class="muted">Trade ${cur('crystals', D.EXCHANGE.crystals)} for ${cur('credits', D.EXCHANGE.credits)}.</p></div>
            <button class="btn btn-small" type="button" data-exchange ${s.crystals < D.EXCHANGE.crystals ? 'disabled' : ''}>Trade</button>
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
      if (e.target.closest('[data-merchant]')) return knock(e.target.closest('[data-merchant]'));
      if (e.target.closest('[data-claim-daily]')) return claimDailyFx(v);
      const dc = e.target.closest('[data-daily-card]');
      if (dc) { dc.classList.toggle('flipped'); if (root.Sound) root.Sound.play('whoosh'); return; }
      const p = e.target.closest('[data-pack]');
      if (p) {
        const results = Player.openPack(p.dataset.pack);
        if (!results) return toast('Not enough currency. Win battles to earn more.');
        updateWallet();
        packReveal(results, p.dataset.pack);
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

  // ---------- Settings: sound, music and save data ----------
  function settings() {
    const S = root.Sound;
    const p = S ? S.prefs : {};
    const track = (key, label) => `<div class="snd-track"><div><b>${label}</b><span class="muted small" data-status="${key}">${S.hasCustom(key) ? 'Using your file' : 'Original theme'}</span></div>
      <label class="btn btn-small">Choose file<input type="file" accept="audio/*" data-file="${key}" hidden></label>
      <button class="btn btn-small" type="button" data-clear="${key}" ${S.hasCustom(key) ? '' : 'disabled'}>Reset</button></div>`;
    const a = Player.state.account;
    const m = openModal(`
      <div class="set-head">${root.Icons.svg('settings')}<div><p class="eyebrow">Command console</p><h2>Settings</h2></div></div>
      ${S ? `<section class="set-sec">
        <h3>${root.Icons.svg('speaker')} Sound</h3>
        <div class="snd-row"><label class="switch"><input type="checkbox" data-pref="sfx" ${p.sfx ? 'checked' : ''}><i></i> Effects</label><input type="range" min="0" max="1" step="0.05" value="${p.sfxVol}" data-vol="sfxVol" aria-label="Effects volume"></div>
        <div class="snd-row"><label class="switch"><input type="checkbox" data-pref="music" ${p.music ? 'checked' : ''}><i></i> Music</label><input type="range" min="0" max="1" step="0.05" value="${p.musicVol}" data-vol="musicVol" aria-label="Music volume"></div>
        <button class="btn btn-small" type="button" data-test-sfx>Test sound</button>
      </section>
      <section class="set-sec">
        <h3>${root.Icons.svg('sabacc')} Your own music</h3>
        <p class="muted small">Pick any audio file on this device to replace the built-in themes. It stays in this browser.</p>
        ${track('menu', 'Galaxy & menus')}
        ${track('battle', 'Battles')}
      </section>` : ''}
      <section class="set-sec">
        <h3>${root.Icons.svg('holocron')} Account</h3>
        <dl class="set-info">
          <div><dt>Commander level</dt><dd>${a.level}</dd></div>
          <div><dt>Cards collected</dt><dd>${Object.keys(Player.state.units).length}/${D.UNITS.length}</dd></div>
          <div><dt>Save data</dt><dd>Saved automatically in this browser</dd></div>
        </dl>
        <button class="btn btn-danger" type="button" data-reset>Reset all progress</button>
      </section>
      <div class="modal-actions"><button class="btn btn-primary" type="button" data-close>Done</button></div>`, { small: true, cls: 'settings-modal' });
    m.root.addEventListener('change', async (e) => {
      const pref = e.target.dataset.pref;
      if (pref) S.set(pref, e.target.checked);
      const key = e.target.dataset.file;
      if (key && e.target.files[0]) {
        await S.saveCustom(key, e.target.files[0]);
        $(`[data-status="${key}"]`, m.root).textContent = `Using ${e.target.files[0].name}`;
        $(`[data-clear="${key}"]`, m.root).disabled = false;
      }
    });
    m.root.addEventListener('input', (e) => { if (e.target.dataset.vol) S.set(e.target.dataset.vol, Number(e.target.value)); });
    m.root.addEventListener('click', async (e) => {
      if (e.target.closest('[data-close]')) return m.close();
      if (e.target.closest('[data-test-sfx]')) { S.play('saber'); setTimeout(() => S.play('blaster'), 400); setTimeout(() => S.play('explosion'), 750); }
      const c = e.target.closest('[data-clear]');
      if (c) { await S.saveCustom(c.dataset.clear, null); $(`[data-status="${c.dataset.clear}"]`, m.root).textContent = 'Original theme'; c.disabled = true; }
      if (e.target.closest('[data-reset]')) {
        m.close();
        if (await confirmBox('Reset all progress?', 'Your roster, currencies and campaign progress will be wiped and you will start over with the starter squad.', 'Reset')) {
          Player.reset();
          toast('Progress reset. Welcome back, Commander.');
          App.battleActive = false;
          App.go('home');
        }
      }
    });
  }

  // ---------- Commander profile ----------
  // Tap the level chip: rank road, world badges, records, luck and feats.
  function achievements() {
    const s = Player.state;
    const st = s.stats;
    const owned = Object.keys(s.units).length;
    const worlds = D.PLANETS.filter((p) => Player.planetComplete(p.id)).length;
    const list = [
      { icon: 'sabers', tier: 1, name: 'First Blood', desc: 'Win your first battle', have: st.battlesWon, need: 1 },
      { icon: 'trooper', tier: 3, name: 'Veteran', desc: 'Win 100 battles', have: st.battlesWon, need: 100 },
      { icon: 'planet', tier: 2, name: 'Liberator', desc: 'Liberate 5 worlds', have: worlds, need: 5 },
      { icon: 'starbird', tier: 4, name: 'Hero of the Galaxy', desc: 'Liberate every world', have: worlds, need: D.PLANETS.length },
      { icon: 'deathstar', tier: 3, name: 'Big Game', desc: 'Defeat 5 bosses', have: Object.keys(s.bosses).length, need: 5 },
      { icon: 'holocron', tier: 3, name: 'Archivist', desc: 'Collect 50 cards', have: owned, need: 50 },
      { icon: 'sabacc', tier: 2, name: 'Crate Cracker', desc: 'Open 25 crates', have: st.packsOpened, need: 25 },
      { icon: 'kybercrown', tier: 4, name: 'Chosen One', desc: 'Pull a Mythic card', have: st.mythics || 0, need: 1 },
      { icon: 'cubes', tier: 3, name: 'Never Tell Me the Odds', desc: 'Hit a 5× luck spin', have: st.bestSpin >= 5 ? 1 : 0, need: 1 },
      { icon: 'spire', tier: 3, name: 'Climber', desc: 'Reach tower floor 20', have: s.tower.best || 0, need: 20 },
    ];
    // Secret feats stay off the list entirely until they are earned.
    if (s.secret.found) list.push({ id: 'secret_found', secret: true, tier: 5, icon: 'crescent', name: 'Into the Unknown', desc: 'Found the hidden way to the Monolith', have: 1, need: 1 });
    if (D.SECRET_BOSSES.every((b) => s.secret.beaten[b.id])) list.push({ id: 'secret_all', secret: true, tier: 6, icon: 'spark', name: 'Master of the Monolith', desc: 'Defeated all four trials beyond the map', have: 1, need: 1 });
    if (s.account.level >= D.MAX_ACCOUNT_LEVEL) list.push({ id: 'grinder', secret: true, tier: 7, icon: 'spire', name: 'Galactic Grinder', desc: 'New features coming soon', have: 1, need: 1 });
    return list;
  }

  // ---------- Achievement showcases ----------
  // Tapping an earned feat replays its badge moment. The harder it was to
  // earn, the bigger the show; the two secret feats get a full cutscene.
  const FEAT_TIER = [null, ['Bronze', '#d08a4a', '#5a2e10'], ['Silver', '#dfe6ee', '#5a6676'], ['Gold', '#ffd23f', '#7a5200'], ['Kyber', '#7cd0ff', '#123a6a'], ['Secret', '#ffffff', '#3a1060'], ['Secret', '#ffffff', '#3a1060'], ['Legendary', '#ffb347', '#6a2a00']];
  // Master of the Monolith gets a hand-built crest rather than a stock medal:
  // wings of light and dark, crossed sabers, a split Monolith and one gem per trial.
  let crestSeq = 0;
  const monolithCrest = () => {
    const u = `mc${++crestSeq}`;
    const rays = Array.from({ length: 16 }, (_, k) => `<polygon points="0,${k % 2 ? -84 : -99} 4.5,0 -4.5,0" transform="rotate(${k * 22.5})"/>`).join('');
    const wing = `<g class="mc-wing">${[-34, -14, 6, 26].map((a, k) => `<g transform="translate(-58,${k * 4 - 6}) rotate(${a})"><ellipse cx="-24" rx="${30 - k * 3}" ry="7.5"/></g>`).join('')}</g>`;
    const gems = [['#4aa8ff', -135], ['#ff2a3a', -45], ['#c77dff', 45], ['#7cffb0', 135]].map(([c, a], k) => {
      const r = (a * Math.PI) / 180;
      return `<g transform="translate(${(Math.cos(r) * 74).toFixed(1)},${(Math.sin(r) * 74).toFixed(1)})"><path class="mc-gem" style="--d:${k * 0.35}s;color:${c}" d="M0,-10 L7.5,0 L0,10 L-7.5,0Z" fill="${c}" stroke="url(#${u}g)" stroke-width="2"/></g>`;
    }).join('');
    return `<svg class="mc" viewBox="-100 -100 200 200" aria-hidden="true">
      <defs>
        <linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c8"/><stop offset=".35" stop-color="#ffd23f"/><stop offset=".7" stop-color="#a86f08"/><stop offset="1" stop-color="#ffe98a"/></linearGradient>
        <linearGradient id="${u}o" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2e2650"/><stop offset="1" stop-color="#07060d"/></linearGradient>
        <linearGradient id="${u}m" x1="0" x2="1"><stop offset="0" stop-color="#9ad4ff"/><stop offset=".5" stop-color="#1e5cc8"/><stop offset=".5" stop-color="#b01a26"/><stop offset="1" stop-color="#ff7a7a"/></linearGradient>
        <linearGradient id="${u}b" x1="1" x2="0"><stop offset="0" stop-color="#bfe4ff"/><stop offset="1" stop-color="#2a6ad0"/></linearGradient>
        <linearGradient id="${u}r" x1="1" x2="0"><stop offset="0" stop-color="#ffc4c4"/><stop offset="1" stop-color="#c8202a"/></linearGradient>
        <linearGradient id="${u}s" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <radialGradient id="${u}n" cy=".42"><stop offset="0" stop-color="#4a2a8a"/><stop offset=".55" stop-color="#170f30"/><stop offset="1" stop-color="#05040a"/></radialGradient>
        <radialGradient id="${u}h"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".45" stop-color="#c8a8ff" stop-opacity=".35"/><stop offset="1" stop-color="#c8a8ff" stop-opacity="0"/></radialGradient>
        <clipPath id="${u}c"><circle r="66"/></clipPath>
      </defs>
      <circle class="mc-halo" r="99" fill="url(#${u}h)"/>
      <g class="mc-rays" fill="url(#${u}g)" opacity=".45">${rays}</g>
      <g fill="url(#${u}b)" stroke="#0a1a3a" stroke-width=".8">${wing}</g>
      <g transform="scale(-1,1)" fill="url(#${u}r)" stroke="#3a0a10" stroke-width=".8">${wing}</g>
      <g class="mc-sabers" stroke-linecap="round">
        <line class="mc-blade b" x1="-56" y1="56" x2="74" y2="-74" stroke="#eaf6ff" stroke-width="5"/>
        <line class="mc-blade r" x1="56" y1="56" x2="-74" y2="-74" stroke="#fff0f0" stroke-width="5"/>
        <line x1="-72" y1="72" x2="-56" y2="56" stroke="#9aa4b4" stroke-width="7"/><line x1="72" y1="72" x2="56" y2="56" stroke="#9aa4b4" stroke-width="7"/>
      </g>
      <circle r="74" fill="url(#${u}n)" stroke="url(#${u}g)" stroke-width="6"/>
      <g fill="#fff">${Array.from({ length: 14 }, (_, k) => `<circle class="mc-dot" style="--d:${(k % 5) * 0.5}s" cx="${(Math.cos(k * 2.4) * (20 + (k * 17) % 40)).toFixed(1)}" cy="${(Math.sin(k * 2.4) * (20 + (k * 17) % 40)).toFixed(1)}" r="${k % 3 ? 0.8 : 1.4}"/>`).join('')}</g>
      <circle class="mc-runes" r="69" fill="none" stroke="url(#${u}g)" stroke-width="3" stroke-dasharray="1.5 5.5" opacity=".85"/>
      <circle r="63" fill="none" stroke="url(#${u}g)" stroke-width="1.2" opacity=".7"/>
      <ellipse class="mc-beam" cy="-6" rx="22" ry="60" fill="url(#${u}h)"/>
      <path d="M0,-63 L13,-47 L11,44 L-11,44 L-13,-47Z" fill="url(#${u}m)"/>
      <path d="M0,-63 L0,44 L11,44 L13,-47Z" fill="#000" opacity=".22"/>
      <path d="M0,-63 L13,-47 L-13,-47Z" fill="url(#${u}g)" stroke="#3a2400" stroke-width=".8"/>
      <path d="M-13,-47 H13" stroke="#3a2400" stroke-width="1.2"/>
      <path d="M0,-63 L13,-47 L11,44 L-11,44 L-13,-47Z" fill="none" stroke="url(#${u}g)" stroke-width="2" stroke-linejoin="round"/>
      <line class="mc-core" x1="0" y1="-44" x2="0" y2="42" stroke="#fff" stroke-width="1.6"/>
      <g class="mc-glyphs" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none">
        <path d="M-6,-32 H6 M-4,-27 L4,-27"/><path d="M-5,-12 L0,-17 L5,-12"/><circle cy="4" r="4"/><path d="M-5,20 L5,26 M5,20 L-5,26"/>
      </g>
      <path d="M-18,44 H18 V50 H-18Z M-25,50 H25 V56 H-25Z" fill="url(#${u}g)" stroke="#3a2400" stroke-width=".8"/>
      <g clip-path="url(#${u}c)"><g transform="skewX(-20)"><rect class="mc-shine" x="-150" y="-100" width="46" height="200" fill="url(#${u}s)"/></g></g>
      ${gems}
      <g transform="translate(0,-76)"><path class="mc-star" d="M0,-15 L3.5,-3.5 L15,0 L3.5,3.5 L0,15 L-3.5,3.5 L-15,0 L-3.5,-3.5Z" fill="#fff" stroke="url(#${u}g)" stroke-width="1.5"/></g>
      <path d="M-50,77 H-72 L-63,86 L-72,95 H-50Z M50,77 H72 L63,86 L72,95 H50Z" fill="#7a5200" stroke="#3a2400" stroke-width="1"/>
      <rect x="-52" y="72" width="104" height="20" rx="2" fill="url(#${u}g)" stroke="#3a2400" stroke-width="1.2"/>
      <text y="86.5" text-anchor="middle" font-size="12" font-weight="800" letter-spacing="5" fill="#2a1a00" font-family="inherit">MASTER</text>
    </svg>`;
  };
  // Galactic Grinder (account level 50): a turning beskar cog around a
  // hyperspace core, the rank number, three chevrons and a Kyber shard on top.
  const grinderCrest = () => {
    const u = `gr${++crestSeq}`;
    const teeth = 22;
    const cog = Array.from({ length: teeth }, (_, k) => {
      const a = (k / teeth) * Math.PI * 2;
      const w = (Math.PI / teeth) * 0.55;
      const pt = (r, t) => `${(Math.cos(t) * r).toFixed(1)},${(Math.sin(t) * r).toFixed(1)}`;
      return `${k ? 'L' : 'M'}${pt(82, a - w * 1.6)} L${pt(94, a - w)} L${pt(94, a + w)} L${pt(82, a + w * 1.6)}`;
    }).join(' ') + 'Z';
    const rays = Array.from({ length: 24 }, (_, k) => `<polygon points="0,${k % 2 ? -88 : -100} 3.5,0 -3.5,0" transform="rotate(${k * 15})"/>`).join('');
    const warp = Array.from({ length: 20 }, (_, k) => {
      const a = (k / 20) * Math.PI * 2 + (k % 2) * 0.12;
      return `<line style="--d:${((k * 7) % 10) * -0.12}s" x1="${(Math.cos(a) * 12).toFixed(1)}" y1="${(Math.sin(a) * 12).toFixed(1)}" x2="${(Math.cos(a) * 70).toFixed(1)}" y2="${(Math.sin(a) * 70).toFixed(1)}"/>`;
    }).join('');
    return `<svg class="mc gr" viewBox="-100 -100 200 200" aria-hidden="true">
      <defs>
        <linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c8"/><stop offset=".35" stop-color="#ffd23f"/><stop offset=".7" stop-color="#b06a08"/><stop offset="1" stop-color="#ffe08a"/></linearGradient>
        <linearGradient id="${u}t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f7fb"/><stop offset=".5" stop-color="#8a96a8"/><stop offset="1" stop-color="#3a4252"/></linearGradient>
        <radialGradient id="${u}c"><stop offset="0" stop-color="#5a2208"/><stop offset=".6" stop-color="#1e0a04"/><stop offset="1" stop-color="#060302"/></radialGradient>
        <radialGradient id="${u}e"><stop offset="0" stop-color="#fff4d0" stop-opacity=".9"/><stop offset=".35" stop-color="#ff9a2a" stop-opacity=".7"/><stop offset=".8" stop-color="#a8200a" stop-opacity=".25"/><stop offset="1" stop-color="#a8200a" stop-opacity="0"/></radialGradient>
        <radialGradient id="${u}h"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".7"/><stop offset=".5" stop-color="#ff7a1a" stop-opacity=".3"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient>
        <clipPath id="${u}k"><circle r="70"/></clipPath>
      </defs>
      <circle class="mc-halo" r="99" fill="url(#${u}h)"/>
      <g class="gr-rays" fill="url(#${u}g)" opacity=".4">${rays}</g>
      <path class="gr-cog" d="${cog}" fill="url(#${u}t)" stroke="url(#${u}g)" stroke-width="2" stroke-linejoin="round"/>
      <circle class="gr-orbit" r="86" fill="none" stroke="#ffb347" stroke-width="3" stroke-linecap="round" stroke-dasharray="46 494"/>
      <circle class="gr-orbit b" r="86" fill="none" stroke="#fff1c8" stroke-width="2" stroke-linecap="round" stroke-dasharray="22 518"/>
      <circle r="76" fill="url(#${u}c)" stroke="url(#${u}g)" stroke-width="6"/>
      <g clip-path="url(#${u}k)"><g class="gr-warp" stroke="#ffd9a0" stroke-width="1.6" stroke-linecap="round">${warp}</g></g>
      <circle class="gr-ember" r="46" fill="url(#${u}e)"/>
      <circle r="69" fill="none" stroke="url(#${u}g)" stroke-width="1.2" opacity=".7"/>
      <text class="gr-num" y="16" text-anchor="middle" font-size="62" font-weight="900" fill="url(#${u}g)" stroke="#3a1a00" stroke-width="2" paint-order="stroke" font-family="inherit" letter-spacing="-2">50</text>
      ${[0, 1, 2].map((k) => `<path class="gr-chev" style="--d:${k * 0.25}s" d="M-17,0 L0,8 L17,0" transform="translate(0,${30 + k * 8})" fill="none" stroke="url(#${u}g)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}
      <g transform="translate(0,-82)"><path class="gr-kyber" d="M0,-15 L7,-5 L5,13 L-5,13 L-7,-5Z" fill="#7cd0ff" stroke="#eaf8ff" stroke-width="1.5" stroke-linejoin="round"/></g>
      <path d="M-50,77 H-72 L-63,86 L-72,95 H-50Z M50,77 H72 L63,86 L72,95 H50Z" fill="#7a3a00" stroke="#3a1a00" stroke-width="1"/>
      <rect x="-54" y="72" width="108" height="20" rx="2" fill="url(#${u}g)" stroke="#3a1a00" stroke-width="1.2"/>
      <text y="86.5" text-anchor="middle" font-size="11" font-weight="800" letter-spacing="4" fill="#2a1200" font-family="inherit">GRINDER</text>
    </svg>`;
  };
  const CRESTS = { secret_all: () => monolithCrest(), grinder: () => grinderCrest() };
  const featBadge = (x, cls = '') => CRESTS[x.id] ? `<div class="fs-badge master-crest ${cls}">${CRESTS[x.id]()}</div>` : `<div class="fs-badge ${cls} ${x.secret ? 'secret' : ''}" style="--m1:${FEAT_TIER[x.tier || 1][1]};--m2:${FEAT_TIER[x.tier || 1][2]}"><span class="fs-medal"><span class="fs-ico">${root.Icons.svg(x.icon)}</span></span></div>`;

  function playFeat(x) {
    if (x.secret) return featCutscene(x);
    const tier = x.tier || 1;
    if (root.Sound) { root.Sound.play(tier >= 4 ? 'reveal_legendary' : tier >= 3 ? 'reveal_epic' : 'reveal_rare'); if (tier >= 3) setTimeout(() => root.Sound.play('coins'), 350); }
    const node = el(`<div class="feat-show t-${tier}" role="dialog" aria-label="${esc(x.name)}" style="--m1:${FEAT_TIER[tier][1]}">
      ${tier >= 3 ? '<i class="fs-rays"></i>' : ''}
      ${Array.from({ length: tier }, (_, k) => `<i class="fs-ring" style="--k:${k}"></i>`).join('')}
      ${featBadge(x, 'pop')}
      ${Array.from({ length: tier * 10 }, (_, k) => `<i class="fs-spark" style="--a:${(k * 137.5) % 360}deg;--d:${(k % 7) * 0.06}s;--r:${18 + (k % 5) * 6}vmin"></i>`).join('')}
      <div class="fs-text"><span class="fs-kicker">${FEAT_TIER[tier][0]} achievement</span><b>${esc(x.name)}</b><span>${esc(x.desc)}</span></div>
      <span class="pc-skip">Tap to close</span>
    </div>`);
    document.body.appendChild(node);
    const close = () => { node.classList.add('out'); setTimeout(() => node.remove(), 400); };
    setTimeout(() => node.addEventListener('click', close), 600);
  }

  function featCutscene(x) {
    if (x.id === 'grinder') return grinderCutscene(x);
    const master = x.id === 'secret_all';
    const bosses = D.SECRET_BOSSES.map((b) => D.UNIT_MAP[b.id]);
    const node = el(`<div class="feat-cine ${master ? 'master' : ''}" role="dialog" aria-label="${esc(x.name)}">
      <canvas class="fc-env"></canvas>
      <div class="fc-veil"></div>
      <div class="fc-lines"><p style="--i:0">${master ? 'Four trials. Four guardians.' : 'Some paths appear on no star chart…'}</p><p style="--i:1">${master ? 'Light and dark, both bowed to you.' : '…and only the persistent find them.'}</p></div>
      <i class="fc-saber blue"></i><i class="fc-saber red"></i>
      ${master ? `<div class="fc-orbit">${bosses.map((b, k) => `<span class="fc-boss" style="--k:${k}">${portrait(b, { plate: false })}</span>`).join('')}</div>` : ''}
      <div class="fc-halves"><span class="fc-half l">${root.Icons.svg('jedi')}</span><span class="fc-half r">${root.Icons.svg('sith')}</span></div>
      <i class="fc-flash"></i>
      ${featBadge(x, 'fc-badge')}
      ${Array.from({ length: master ? 90 : 60 }, (_, k) => `<i class="fs-spark" style="--a:${(k * 137.5) % 360}deg;--d:${(k % 9) * 0.05}s;--r:${22 + (k % 6) * 7}vmin;--c:${k % 2 ? '#5ab4ff' : '#ff3a4a'}"></i>`).join('')}
      <div class="fs-text fc-text"><span class="fs-kicker">Secret achievement</span><b data-text="${esc(x.name)}">${esc(x.name)}</b><span>${esc(x.desc)}</span></div>
      <span class="pc-skip">Tap to skip</span>
    </div>`);
    document.body.appendChild(node);
    let env = null;
    if (motionOK()) { try { env = new root.Env($('.fc-env', node), 'mortis', 'ground'); } catch (e) { env = null; } }
    const S = root.Sound;
    const at = (ms, fn) => setTimeout(() => node.isConnected && fn(), ms);
    const base = master ? 1800 : 0;
    if (S) { S.play('glitch'); at(1600, () => S.play('ignite')); if (master) at(2200, () => S.play('ult')); at(3300 + base, () => { S.play('burst'); S.play('reveal_mythic'); }); }
    node.classList.add('play');
    let done = false;
    const close = () => { if (done) return; done = true; node.classList.add('out'); if (env) env.stop(); setTimeout(() => node.remove(), 500); };
    const reveal = (skip) => { node.classList.add('reveal'); if (skip) node.classList.add('skip'); node.querySelector('.pc-skip').textContent = 'Tap to close'; };
    node.addEventListener('click', () => (node.classList.contains('reveal') ? close() : reveal(true)));
    at(3300 + base, () => reveal(false));
  }

  // Galactic Grinder: a hyperspace jump while the rank counter races to 50.
  function grinderCutscene(x) {
    const top = D.MAX_ACCOUNT_LEVEL;
    const node = el(`<div class="feat-cine grinder" role="dialog" aria-label="${esc(x.name)}">
      <div class="fc-warp">${Array.from({ length: 64 }, (_, k) => `<i style="--a:${(k * 137.5) % 360}deg;--d:${((k * 13) % 20) * -0.05}s;--w:${1 + (k % 3)}px"></i>`).join('')}</div>
      <div class="fc-veil"></div>
      <div class="fc-lines"><p style="--i:0">Every battle. Every rank.</p><p style="--i:1">The grind becomes legend.</p></div>
      <div class="fc-count"><b>1</b><span>Account level</span></div>
      <i class="fc-flash"></i>
      ${featBadge(x, 'fc-badge')}
      ${Array.from({ length: 100 }, (_, k) => `<i class="fs-spark" style="--a:${(k * 137.5) % 360}deg;--d:${(k % 9) * 0.05}s;--r:${22 + (k % 6) * 7}vmin;--c:${k % 3 ? '#ffb347' : '#fff1c8'}"></i>`).join('')}
      <div class="fs-text fc-text"><span class="fs-kicker">Legendary achievement</span><b data-text="${esc(x.name)}">${esc(x.name)}</b><span>${esc(x.desc)}</span></div>
      <span class="pc-skip">Tap to skip</span>
    </div>`);
    document.body.appendChild(node);
    const S = root.Sound;
    const at = (ms, fn) => setTimeout(() => node.isConnected && fn(), ms);
    const count = $('.fc-count b', node);
    const REVEAL = 4600;
    if (S) { S.play('ult'); at(900, () => S.play('whoosh')); }
    // The counter eases in: slow first ranks, a blur through the middle, a heavy final hit.
    for (let n = 2; n <= top; n++) {
      const t = 1000 + 2600 * Math.pow((n - 1) / (top - 1), 0.7);
      at(t, () => { count.textContent = n; if (n % 10 === 0 && S) S.play(n === top ? 'rankup' : 'click'); if (n === top) count.parentNode.classList.add('hit'); });
    }
    node.classList.add('play');
    let done = false;
    const close = () => { if (done) return; done = true; node.classList.add('out'); setTimeout(() => node.remove(), 500); };
    const reveal = (skip) => {
      if (node.classList.contains('reveal')) return;
      node.classList.add('reveal'); if (skip) node.classList.add('skip');
      node.querySelector('.pc-skip').textContent = 'Tap to close';
      if (S) { S.play('burst'); S.play('reveal_legendary'); setTimeout(() => S.play('jackpot'), 400); }
    };
    node.addEventListener('click', () => (node.classList.contains('reveal') ? close() : reveal(true)));
    at(REVEAL, () => reveal(false));
  }

  // The first time a secret feat is earned it plays by itself.
  function celebrateFeat(id) {
    let seen = [];
    try { seen = JSON.parse(localStorage.getItem('swcg-feats-seen') || '[]'); } catch (e) { seen = []; }
    if (seen.includes(id)) return;
    const x = achievements().find((a) => a.id === id);
    if (!x) return;
    seen.push(id);
    try { localStorage.setItem('swcg-feats-seen', JSON.stringify(seen)); } catch (e) { /* storage unavailable */ }
    setTimeout(() => playFeat(x), 700);
  }

  function badgeHtml(p, earned) {
    return `<div class="world-badge ${earned ? 'earned' : ''}" style="--pc:${p.color || '#ffd23f'}" title="${esc(p.name)}${earned ? ' liberated' : ''}">
      <div class="wb-medal"><canvas data-badge="${p.id}" width="64" height="64"></canvas>${earned ? '' : `<span class="wb-lock">${root.Icons.svg('lock')}</span>`}</div>
      <b>${esc(p.name)}</b>
    </div>`;
  }

  function profile() {
    const s = Player.state;
    const a = s.account;
    const st = s.stats;
    const need = D.xpToNext(a.level);
    const pct = a.level >= D.MAX_ACCOUNT_LEVEL ? 100 : Math.round((a.xp / need) * 100);
    const slotAt = {};
    D.SLOT_UNLOCKS.forEach((r) => { slotAt[r.level] = r; });
    const road = Array.from({ length: D.MAX_ACCOUNT_LEVEL }, (_, i) => i + 1).map((lv) => {
      const r = D.levelReward(lv);
      const big = lv % 5 === 0;
      const slot = slotAt[lv];
      const state = lv < a.level ? 'done' : lv === a.level ? 'now' : 'todo';
      return `<div class="rr-node ${state} ${big ? 'big' : ''} ${slot ? 'slot' : ''}">
        <span class="rr-lv">${lv}</span>
        <span class="rr-gem">${root.Icons.svg(slot ? 'sabers' : big ? 'kybercrown' : 'kyber')}</span>
        <span class="rr-rew">${lv === 1 ? 'Start' : slot ? `Squad slot ${slot.slot}` : `${fmt(r.credits)}¢${r.crystals ? ` · ${r.crystals} Kyber` : ''}`}</span>
      </div>`;
    }).join('');
    const ach = achievements();
    const achDone = ach.filter((x) => x.have >= x.need).length;
    const luck = s.luck;
    const won = st.battlesWon;
    const lost = st.battlesLost;
    const m = openModal(`
      <div class="pf-head">
        <div class="acct-ring big" style="--p:${pct}"><b>${a.level}</b><span>Level</span></div>
        <div class="pf-title">
          <p class="eyebrow">Commander profile</p>
          <h2>${a.level >= D.MAX_ACCOUNT_LEVEL ? 'Grand Master' : a.level >= 30 ? 'Fleet Admiral' : a.level >= 15 ? 'General' : a.level >= 6 ? 'Commander' : 'Captain'}</h2>
          <div class="pf-xp"><i style="width:${pct}%"></i></div>
          <p class="muted small">${a.level >= D.MAX_ACCOUNT_LEVEL ? 'Maximum rank reached.' : `${fmt(a.xp)} / ${fmt(need)} XP to level ${a.level + 1}`}</p>
        </div>
      </div>
      <div class="pf-tabs seg" role="tablist">
        <button type="button" class="active" data-pf="road">${root.Icons.svg('rank')} Rank road</button>
        <button type="button" data-pf="worlds">${root.Icons.svg('planet')} Worlds</button>
        <button type="button" data-pf="records">${root.Icons.svg('chart')} Records</button>
        <button type="button" data-pf="feats">${root.Icons.svg('trophy')} Feats <em>${achDone}/${ach.length}</em></button>
      </div>
      <div class="pf-pane active" data-pane="road">
        <p class="muted small">Every level pays out credits and Kyber. Every fifth level is a milestone.</p>
        <div class="rank-road" data-road>${road}</div>
      </div>
      <div class="pf-pane" data-pane="worlds">
        <p class="muted small">Liberate every stage on a world to earn its badge.</p>
        <div class="badge-grid">${D.PLANETS.map((p) => badgeHtml(p, Player.planetComplete(p.id))).join('')}</div>
      </div>
      <div class="pf-pane" data-pane="records">
        <div class="rec-grid">
          <div><b>${fmt(won)}</b><span>Battles won</span></div>
          <div><b>${won + lost ? Math.round((won / (won + lost)) * 100) : 0}%</b><span>Win rate</span></div>
          <div><b>${Object.keys(s.units).length}/${D.UNITS.length}</b><span>Cards collected</span></div>
          <div><b>${Object.keys(s.bosses).length}/${D.BOSS_ENCOUNTERS.length}</b><span>Bosses defeated</span></div>
          <div><b>${s.tower.best || 0}</b><span>Best tower floor</span></div>
          <div><b>${fmt(st.packsOpened)}</b><span>Crates opened</span></div>
          <div><b>${st.mythics || 0}</b><span>Mythics pulled</span></div>
          <div><b>${st.holos || 0}</b><span>Holo cards</span></div>
        </div>
        <h3 class="pf-sub">${root.Icons.svg('cubes')} Luck</h3>
        <div class="rec-grid">
          <div><b>${st.bestSpin}×</b><span>Best luck spin</span></div>
          <div><b>${luck.pity}/${D.LUCK.pityCrates}</b><span>Legendary pity</span></div>
          <div><b>${luck.charmCrates}</b><span>Chance Cube crates</span></div>
          <div><b>${luck.dice}</b><span>Loaded Dice spins</span></div>
        </div>
      </div>
      <div class="pf-pane" data-pane="feats">
        <div class="feat-list">${ach.map((x) => {
          const done = x.have >= x.need;
          return `<button type="button" class="feat ${done ? 'done' : ''} ${x.secret ? 'secret' : ''} t-${x.tier || 1}" data-feat="${ach.indexOf(x)}"><span class="feat-ico ${CRESTS[x.id] ? 'crest' : ''}">${CRESTS[x.id] ? CRESTS[x.id]() : root.Icons.svg(x.icon)}</span><div><b>${esc(x.name)}${x.secret ? ` <span class="feat-secret ${x.tier === 7 ? 'legend' : ''}">${x.tier === 7 ? 'Legendary' : 'Secret'}</span>` : ''}</b><span class="muted small">${esc(x.desc)}</span><i class="feat-bar"><i style="width:${Math.min(100, (x.have / x.need) * 100)}%"></i></i></div><em>${done ? '✓' : `${fmt(Math.min(x.have, x.need))}/${fmt(x.need)}`}</em></button>`;
        }).join('')}</div>
      </div>
      <div class="modal-actions"><button class="btn btn-primary" type="button" data-close>Close</button></div>`, { cls: 'profile-modal' });
    const roadEl = $('[data-road]', m.root);
    requestAnimationFrame(() => {
      const now = $('.rr-node.now', roadEl);
      if (now) roadEl.scrollLeft = now.offsetLeft - roadEl.clientWidth / 2 + now.offsetWidth / 2;
    });
    const drawBadges = () => $$('[data-badge]', m.root).forEach((c) => {
      if (c.dataset.drawn) return;
      c.dataset.drawn = 1;
      const ctx = c.getContext('2d');
      root.drawPlanetSphere(ctx, 32, 32, 22, c.dataset.badge, 1.2, { halo: 0.4 });
    });
    m.root.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) return m.close();
      const fb = e.target.closest('[data-feat]');
      if (fb) {
        const x = ach[Number(fb.dataset.feat)];
        if (x.have >= x.need) return playFeat(x);
        fb.classList.remove('shake');
        void fb.offsetWidth;
        fb.classList.add('shake');
        return toast(`${x.name}: ${fmt(Math.min(x.have, x.need))}/${fmt(x.need)}`);
      }
      const t = e.target.closest('[data-pf]');
      if (t) {
        $$('[data-pf]', m.root).forEach((b) => b.classList.toggle('active', b === t));
        $$('[data-pane]', m.root).forEach((pn) => pn.classList.toggle('active', pn.dataset.pane === t.dataset.pf));
        if (t.dataset.pf === 'worlds') drawBadges();
      }
    });
  }

  // ---------- Crate opening & card reveals ----------
  // The crate's build-up scales with the best card inside, and every card's
  // reveal scales with its own rarity, up to full-screen moments for
  // Legendary and Mythic pulls.
  const R_ORDER = { common: 0, rare: 1, epic: 2, legendary: 3, mythic: 4, secret: 4 };
  const R_COLOR = { common: '#9aa8bc', rare: '#4fa3ff', epic: '#b77bff', legendary: '#ffb938', mythic: '#ff2a5a', secret: '#e8f0ff' };

  function crateCinematic(packId, best) {
    return new Promise((resolve) => {
      if (!motionOK()) return resolve();
      const tier = R_ORDER[best];
      const mythic = best === 'mythic';
      // Mythic crates pretend to be rare until the very end.
      const shown = mythic ? 'rare' : best;
      const dur = [1300, 1500, 2000, 2800, 4200][tier];
      const node = el(`<div class="crate-cine tier-${tier}" style="--rc:${R_COLOR[shown]};--dur:${dur}ms" role="status" aria-label="Opening crate">
        <div class="cc-rays"></div>
        <div class="cc-glow"></div>
        <div class="cc-crate">${Art.crateArt(packId)}<i class="cc-crack c1"></i><i class="cc-crack c2"></i><i class="cc-crack c3"></i></div>
        <i class="cc-ring"></i>
        <div class="cc-label">${['Cracking the seal…', 'Something shines…', 'Rare energy detected…', 'LEGENDARY SIGNAL', 'Cracking the seal…'][tier]}</div>
        <span class="pc-skip">Tap to skip</span>
      </div>`);
      document.body.appendChild(node);
      if (root.Sound) {
        root.Sound.play('rumble', dur / 1000);
        [0.3, 0.5, 0.65].slice(0, tier + 1).forEach((k) => setTimeout(() => root.Sound.play('crack'), dur * k));
      }
      const crate = $('.cc-crate', node);
      const shake = Math.min(14, 2 + tier * 3);
      crate.animate(Array.from({ length: 12 }, (_, i) => ({ transform: `translate(${(i % 2 ? 1 : -1) * shake * (i / 12)}px, ${(i % 3 - 1) * shake * 0.4 * (i / 12)}px) rotate(${(i % 2 ? 1 : -1) * (i / 12) * (2 + tier)}deg) scale(${1 + i * 0.012})` })), { duration: dur * 0.85, easing: 'ease-in', fill: 'forwards' });
      let glitchTimer = null;
      if (mythic) {
        glitchTimer = setTimeout(() => {
          node.classList.add('glitch');
          if (root.Sound) root.Sound.play('glitch');
          node.style.setProperty('--rc', R_COLOR.mythic);
          $('.cc-label', node).innerHTML = '<b data-text="⚠ ANOMALY DETECTED">⚠ ANOMALY DETECTED</b>';
          node.insertAdjacentHTML('beforeend', `<svg class="cc-shatter" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 50 L12 4 M50 50 L88 10 M50 50 L96 62 M50 50 L70 98 M50 50 L22 94 M50 50 L2 46 M30 26 L40 20 M74 30 L84 40 M76 78 L62 84 M26 70 L16 62"/></svg>`);
        }, dur * 0.5);
      }
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(glitchTimer);
        node.classList.add('burst');
        if (root.Sound) root.Sound.play('burst');
        const flash = el(`<div class="cc-flash" style="--rc:${R_COLOR[best]}"></div>`);
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 700);
        setTimeout(() => { node.remove(); resolve(); }, 320);
      };
      node.addEventListener('click', finish);
      setTimeout(finish, dur);
    });
  }

  // FIFA-style walkout for Epic, Legendary and Mythic pulls: allegiance,
  // class, homeworld (or hyperspace for ships), then the card itself.
  const HOMEWORLD = {
    luke: 'tatooine', master_luke: 'tatooine', obi_wan: 'tatooine', r2d2: 'tatooine', c3po: 'tatooine', jawa: 'tatooine', tusken_raider: 'tatooine', boba_fett: 'tatooine', din_djarin: 'tatooine', grogu: 'tatooine',
    yoda: 'dagobah', han_solo: 'bespin', chewbacca: 'endor', ewok_warrior: 'endor', leia: 'hoth', rebel_soldier: 'hoth', rebel_medic: 'hoth', two_onebee: 'hoth',
    vader: 'mustafar', lord_vader: 'mustafar', darth_revan: 'exegol', starkiller: 'coruscant_siege', palpatine: 'exegol', kylo_ren: 'exegol', rey: 'exegol',
    k2so: 'scarif', death_trooper: 'scarif', tarkin: 'scarif', thrawn: 'scarif', grievous: 'geonosis', count_dooku: 'geonosis', b2_droid: 'geonosis', droideka: 'geonosis', battle_droid: 'geonosis', magnaguard: 'geonosis',
    mace_windu: 'coruscant', ahsoka: 'coruscant', clone_trooper: 'coruscant', hunter: 'coruscant', wrecker: 'coruscant', tech: 'coruscant', crosshair: 'coruscant', echo: 'coruscant', barriss: 'coruscant',
    cal_kestis: 'endor', bo_katan: 'coruscant_siege', sabine: 'tatooine', captain_rex: 'geonosis', hondo: 'bespin', savage_opress: 'mustafar', u_wing: 'scarif', upsilon_shuttle: 'exegol', hounds_tooth: 'tatooine',
    the_daughter: 'mortis', temple_guardian: 'mortis', the_son: 'mortis', darth_bane: 'mortis', ebon_hawk: 'mortis', sith_fury: 'mortis', arc_170: 'coruscant', delta7: 'coruscant', tie_defender: 'scarif', tie_silencer: 'exegol',
    anakin: 'mustafar', qui_gon: 'tatooine', padme: 'geonosis', lando: 'bespin', jango_fett: 'geonosis', asajj_ventress: 'mustafar', cad_bane: 'tatooine', moff_gideon: 'tatooine', n1_starfighter: 'coruscant', sith_infiltrator: 'tatooine',
    talzin: 'mustafar', nightsister_acolyte: 'mustafar', grand_inquisitor: 'coruscant_siege', second_sister: 'coruscant_siege', fifth_brother: 'coruscant_siege', seventh_sister: 'coruscant_siege', eighth_brother: 'coruscant_siege',
  };
  function homeworldOf(def) {
    if (HOMEWORLD[def.id] && D.PLANET_MAP[HOMEWORLD[def.id]]) return D.PLANET_MAP[HOMEWORLD[def.id]];
    const found = D.PLANETS.find((p) => p.stages.some((s) => s.enemies.includes(def.id)));
    return found || D.PLANET_MAP[def.faction === 'light' ? 'hoth' : 'mustafar'];
  }
  const ROLE_NAMES = { attacker: 'Damage Dealer', tank: 'Tank', support: 'Support', healer: 'Healer' };

  function hyperspace(canvas, color) {
    const W = (canvas.width = innerWidth);
    const H = (canvas.height = innerHeight);
    const ctx = canvas.getContext('2d');
    const stars = Array.from({ length: 260 }, () => ({ a: Math.random() * Math.PI * 2, d: Math.random() * 0.2, v: 0.004 + Math.random() * 0.01 }));
    let speed = 0.3;
    const step = () => {
      if (!canvas.isConnected) return;
      ctx.fillStyle = 'rgba(2,3,10,0.35)';
      ctx.fillRect(0, 0, W, H);
      speed = Math.min(4, speed * 1.02);
      const R = Math.hypot(W, H) / 2;
      ctx.lineCap = 'round';
      for (const s of stars) {
        const d0 = s.d;
        s.d += s.v * speed;
        if (s.d > 1.1) { s.d = Math.random() * 0.05; s.a = Math.random() * Math.PI * 2; }
        const x0 = W / 2 + Math.cos(s.a) * d0 * R;
        const y0 = H / 2 + Math.sin(s.a) * d0 * R;
        const x1 = W / 2 + Math.cos(s.a) * s.d * R;
        const y1 = H / 2 + Math.sin(s.a) * s.d * R;
        ctx.strokeStyle = Math.random() < 0.15 ? color : 'rgba(210,230,255,0.9)';
        ctx.lineWidth = 0.6 + s.d * 2.4;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      }
      requestAnimationFrame(step);
    };
    step();
  }

  function walkout(def, rarity, holo, opts = {}) {
    return new Promise((resolve) => {
      if (!motionOK()) return resolve();
      const tier = R_ORDER[rarity];
      const mythic = rarity === 'mythic';
      // Exclusive cards from the Monolith get the longest show of all.
      const ex = !!opts.exclusive || rarity === 'secret';
      const storm = mythic || ex;
      const ship = def.kind === 'ship';
      const planet = homeworldOf(def);
      const side = def.faction === 'light';
      // ~8.5s total (9s for Mythic): three readable beats, then the card and its stats.
      const stepMs = ex ? 1700 : 1400;
      const steps = [
        ...(ex ? [{ kicker: 'From beyond the map', big: 'Exclusive', icon: `<span class="wo-role wo-holocron">${root.Icons.svg('holocron')}</span>`, tone: '#ffffff' }] : []),
        { kicker: 'Allegiance', big: side ? 'Light Side' : 'Dark Side', icon: `<span class="wo-saber" style="--sc:${side ? '#4aa8ff' : '#ff2a2a'}"></span>`, tone: side ? '#4aa8ff' : '#ff2a2a' },
        { kicker: ship ? 'Starship class' : 'Class', big: ROLE_NAMES[def.role] || def.role, icon: `<span class="wo-role">${D.ROLE_ICONS[def.role] || '✦'}</span>`, tone: R_COLOR[rarity] },
        { kicker: ship ? 'Jumping from' : 'Homeworld', big: ship ? 'Hyperspace' : planet.name, icon: ship ? '<span class="wo-role">✈</span>' : '<canvas class="wo-sphere"></canvas>', tone: planet.color || R_COLOR[rarity] },
      ];
      const node = el(`<div class="walkout ${rarity} ${ship ? 'is-ship' : ''} ${ex ? `exclusive side-${def.faction}` : ''}" style="--rc:${ex ? (def.faction === 'light' ? '#7cc8ff' : '#ff3a4a') : R_COLOR[rarity]}" role="status" aria-label="New card">
        <canvas class="wo-bg"></canvas>
        <div class="wo-vignette"></div>
        <div class="wo-step" aria-live="polite"></div>
        <div class="wo-final">
          <div class="br-rays"></div>
          ${storm ? '<canvas class="br-bolts"></canvas>' : ''}
          ${ex ? '<div class="ex-split"></div><div class="ex-shock"></div>' : ''}
          ${ship ? `<div class="wo-ship">${Art.shipOnly(def)}</div>` : ''}
          <div class="br-card">${unitCard(def, { tag: 'div', hideShards: true, holo })}</div>
          <div class="wo-stats">${(() => {
            const own = Player.unit(def.id) || { level: 1, stars: 1 };
            const st = D.unitStats(def, own.level, own.stars);
            return [['Health', st.hp, '#52e08a'], ['Attack', st.atk, '#ff6b6b'], ['Armor', st.def, '#5ab4ff'], ['Speed', st.spd, '#ffd23f']]
              .map(([l, v, c], k) => `<div class="wo-stat" style="--k:${k};--c:${c}"><span>${l}</span><b data-count="${Math.round(v)}">0</b></div>`).join('')
              + `<div class="wo-stat power" style="--k:4;--c:var(--rc)"><span>Power</span><b data-count="${D.power(def, own.level, own.stars)}">0</b></div>`;
          })()}</div>
          <div class="br-text"><span class="br-kicker">${ex ? (opts.isNew === false ? `+${opts.shards} shards · the Monolith grants more` : 'Found nowhere else in the galaxy') : mythic ? 'You found something that should not exist' : ['New recruit', 'Rare recruit', 'Epic recruit', 'A legend joins your cause'][tier]}</span><b class="br-rarity" data-text="${ex ? 'EXCLUSIVE' : D.RARITIES[rarity].label.toUpperCase()}">${ex ? 'EXCLUSIVE' : D.RARITIES[rarity].label.toUpperCase()}</b><span class="br-name">${esc(def.name)}</span></div>
          ${Array.from({ length: ex ? 64 : 10 + tier * 8 }, (_, i) => `<i class="br-spark" style="--a:${(i * 137.5) % 360}deg;--d:${(Math.random() * 0.5).toFixed(2)}s;--r:${30 + Math.random() * 30}vmax"></i>`).join('')}
        </div>
        <span class="pc-skip">Tap to skip</span>
      </div>`);
      document.body.appendChild(node);
      const bg = $('.wo-bg', node);
      let env = null;
      if (ship) hyperspace(bg, R_COLOR[rarity]);
      else { try { env = new root.Env(bg, planet.id, 'ground'); } catch (e) { env = null; } }
      const box = $('.wo-step', node);
      let i = 0;
      let timer = null;
      let finished = false;
      const showFinal = () => {
        clearTimeout(timer);
        box.innerHTML = '';
        node.classList.add('final');
        if (root.Sound) root.Sound.play(ex ? 'reveal_mythic' : `reveal_${rarity}`);
        if (ex && root.Sound) setTimeout(() => { root.Sound.play('burst'); root.Sound.play('reveal_legendary'); }, 500);
        // Stats pop up one by one and count up so they can be read.
        $$('.wo-stat b', node).forEach((b, k) => setTimeout(() => {
          if (!node.isConnected) return;
          const to = Number(b.dataset.count);
          const t0 = performance.now();
          const tick = (now) => { const q = Math.min(1, (now - t0) / 700); b.textContent = fmt(Math.round(to * (1 - Math.pow(1 - q, 3)))); if (q < 1) requestAnimationFrame(tick); };
          requestAnimationFrame(tick);
          if (root.Sound) root.Sound.play('click');
        }, 1100 + k * 380));
        if (storm) {
          const cv = $('.br-bolts', node);
          const W = (cv.width = innerWidth);
          const H = (cv.height = innerHeight);
          const ctx = cv.getContext('2d');
          const t0 = performance.now();
          const step = (now) => {
            if (!node.isConnected) return;
            ctx.clearRect(0, 0, W, H);
            if (now - t0 < (ex ? 3200 : 1800) && Math.random() < 0.5) {
              const blue = ex && (def.faction === 'light' ? Math.random() < 0.65 : Math.random() < 0.35);
              let x = Math.random() * W;
              let y = 0;
              ctx.beginPath();
              ctx.moveTo(x, y);
              while (y < H) { x += (Math.random() - 0.5) * 80; y += H / 10; ctx.lineTo(x, y); }
              ctx.strokeStyle = blue ? 'rgba(110,190,255,0.9)' : 'rgba(255,60,100,0.9)';
              ctx.lineWidth = 2.5;
              ctx.shadowColor = blue ? '#4aa8ff' : '#ff2a5a';
              ctx.shadowBlur = 18;
              ctx.stroke();
            }
            requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
        timer = setTimeout(close, ex ? 7000 : mythic ? 5000 : 4400);
      };
      const next = () => {
        if (i >= steps.length) return showFinal();
        const s = steps[i++];
        if (root.Sound) root.Sound.play(i === 1 ? 'ignite' : 'whoosh');
        box.innerHTML = `<div class="wo-chip" style="--tone:${s.tone}"><div class="wo-icon">${s.icon}</div><div class="wo-words"><span>${esc(s.kicker)}</span><b>${esc(s.big)}</b></div></div>`;
        const sc = $('.wo-sphere', box);
        if (sc) {
          const size = 120;
          const dpr = Math.min(1.5, window.devicePixelRatio || 1);
          sc.width = sc.height = size * dpr;
          sc.style.width = sc.style.height = size + 'px';
          const ctx = sc.getContext('2d');
          ctx.scale(dpr, dpr);
          let t = 0;
          const spin = () => { if (!sc.isConnected) return; t += 0.03; ctx.clearRect(0, 0, size, size); root.drawPlanetSphere(ctx, size / 2, size / 2, size * 0.4, planet.id, t * 3, { halo: 0.6 }); requestAnimationFrame(spin); };
          spin();
        }
        if (mythic && i === steps.length) node.classList.add('glitch');
        if (ex) { node.classList.remove('ex-beat'); void node.offsetWidth; node.classList.add('ex-beat'); if (root.Sound) root.Sound.play('burst'); }
        timer = setTimeout(next, stepMs);
      };
      const close = () => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        node.classList.add('out');
        if (env) env.stop();
        setTimeout(() => { node.remove(); resolve(); }, 380);
      };
      node.addEventListener('click', () => (node.classList.contains('final') ? close() : showFinal()));
      timer = setTimeout(next, 300);
    });
  }

  async function packReveal(results, packId) {
    const best = results.reduce((b, r) => (R_ORDER[D.UNIT_MAP[r.id].rarity] > R_ORDER[b] ? D.UNIT_MAP[r.id].rarity : b), 'common');
    if (packId) await crateCinematic(packId, best);
    const cards = results.map((r, i) => {
      const def = D.UNIT_MAP[r.id];
      const tag = r.isNew ? '<span class="reveal-tag">NEW!</span>' : `<span class="reveal-tag dup">+${r.shards} shards</span>`;
      return `<div class="flip glow-${def.rarity} r-${def.rarity} side-${def.faction} ${r.holo ? 'is-holo' : ''} ${i > 0 ? 'stack-hidden' : ''}" style="--rc:${R_COLOR[def.rarity]};--i:${i};--fc:${def.faction === 'dark' ? '#ff2a3a' : '#5ab4ff'}" data-i="${i}" tabindex="0" role="button" aria-label="Reveal card">
        <div class="flip-face flip-back">${Art.cardBack(def.faction)}</div>
        <div class="flip-face flip-front">${tag}${r.holo ? '<span class="holo-tag">HOLO</span>' : ''}${r.pity ? '<span class="holo-tag pity">PITY</span>' : ''}${unitCard(def, { tag: 'div', hideShards: true, holo: r.holo })}</div>
      </div>`;
    }).join('');
    const m = openModal(`
      <div style="text-align:center"><p class="eyebrow">${packId ? 'Relic unsealed' : 'Delivery from Vekko'}</p><h2 data-reveal-title>Tap to reveal</h2></div>
      <div class="reveal-stack" data-stack>${cards}</div>
      <p class="reveal-hint" data-reveal-hint hidden>Tap the card for the next one</p>
      <div class="reveal-summary" data-summary hidden></div>
      <div class="modal-actions" style="justify-content:center">
        <button class="btn btn-primary" type="button" data-next-card hidden>Next card</button>
        <button class="btn btn-primary" type="button" data-done hidden>Done</button>
      </div>`, { onClose: () => App.refresh(), cls: `reveal-modal best-${best}` });
    // One card at a time: the next one stays hidden under the deck until the
    // current reveal finishes and the player asks for it.
    let current = 0;
    const title = $('[data-reveal-title]', m.root);
    const nextBtn = $('[data-next-card]', m.root);
    const doneBtn = $('[data-done]', m.root);
    const afterReveal = (i) => {
      const def = D.UNIT_MAP[results[i].id];
      if (i < results.length - 1) {
        // Tap the revealed card itself to deal and open the next one.
        title.textContent = def.name;
        const cur = $(`.flip[data-i="${i}"]`, m.root);
        cur.classList.add('tap-next');
        cur.setAttribute('aria-label', 'Next card');
        $('[data-reveal-hint]', m.root).hidden = false;
        cur.focus({ preventScroll: true });
      } else if (results.length > 1) {
        // Crate finished: lay out everything you pulled.
        const sum = $('[data-summary]', m.root);
        sum.innerHTML = results.map((r, k) => `<div class="rs-card" style="--k:${k}">${unitCard(D.UNIT_MAP[r.id], { tag: 'div', hideShards: true, holo: r.holo })}<span class="rs-tag ${r.isNew ? 'new' : ''}">${r.isNew ? 'New!' : `+${r.shards} shards`}</span></div>`).join('');
        $('[data-stack]', m.root).hidden = true;
        sum.hidden = false;
        doneBtn.hidden = false;
        title.textContent = 'Crate complete';
        doneBtn.focus();
      } else {
        doneBtn.hidden = false;
        title.textContent = def.name;
        doneBtn.focus();
      }
    };
    let busy = Promise.resolve();
    const flip = (f) => {
      if (f.classList.contains('flipped') || f.classList.contains('charging') || f.classList.contains('stack-hidden') || Number(f.dataset.i) !== current) return busy;
      const r = results[Number(f.dataset.i)];
      const def = D.UNIT_MAP[r.id];
      const tier = R_ORDER[def.rarity];
      busy = busy.then(async () => {
        // Rarer cards hold their breath before turning over.
        if (tier >= 1 && motionOK()) {
          f.classList.add('charging');
          await new Promise((res) => setTimeout(res, [0, 250, 450, 750, 1100][tier]));
          f.classList.remove('charging');
        }
        f.classList.add('flipped');
        if (root.Sound) root.Sound.play(`reveal_${def.rarity}`);
        if (!motionOK()) return;
        const rect = f.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        if (tier >= 1) {
          const ring = el(`<div class="reveal-ring" style="left:${cx}px;top:${cy}px;--rc:${R_COLOR[def.rarity]}"></div>`);
          document.body.appendChild(ring);
          setTimeout(() => ring.remove(), 900);
        }
        if (tier >= 2) {
          for (let k = 0; k < 8 + tier * 6; k++) {
            const s = el(`<i class="reveal-spark" style="left:${cx}px;top:${cy}px;--rc:${R_COLOR[def.rarity]}"></i>`);
            document.body.appendChild(s);
            const a = Math.random() * Math.PI * 2;
            const d = 60 + Math.random() * (60 + tier * 40);
            s.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(0)`, opacity: 0 }], { duration: 700 + Math.random() * 400, easing: 'cubic-bezier(.1,.8,.3,1)' }).onfinish = () => s.remove();
          }
        }
        // Every card gets a walkout; rarer cards get a longer, louder one.
        await new Promise((res) => setTimeout(res, tier >= 2 ? 300 : 150));
        await walkout(def, def.rarity, r.holo);
        if (r.holo) toast('HOLO card! Double value.');
        await new Promise((res) => setTimeout(res, 120));
        afterReveal(Number(f.dataset.i));
      });
      return busy;
    };
    m.root.addEventListener('click', (e) => {
      const f = e.target.closest('.flip');
      const tapNext = f && f.classList.contains('tap-next');
      if (f && !tapNext) flip(f);
      if (tapNext || e.target.closest('[data-next-card]')) {
        if (tapNext) f.classList.remove('tap-next');
        $('[data-reveal-hint]', m.root).hidden = true;
        nextBtn.hidden = true;
        const old = $(`.flip[data-i="${current}"]`, m.root);
        current += 1;
        const nf = $(`.flip[data-i="${current}"]`, m.root);
        title.textContent = 'Opening…';
        const deal = () => {
          old.classList.add('stack-hidden');
          nf.classList.remove('stack-hidden');
          if (motionOK()) nf.animate([{ transform: 'translateY(40px) scale(.85) rotate(-4deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.2,.9,.3,1.2)' });
          if (root.Sound) root.Sound.play('click');
          nf.focus({ preventScroll: true });
          // The next card opens by itself once it lands.
          setTimeout(() => flip(nf), motionOK() ? 450 : 0);
        };
        if (motionOK()) old.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateX(-130%) rotate(-18deg)', opacity: 0 }], { duration: 320, easing: 'ease-in', fill: 'forwards' }).onfinish = deal;
        else deal();
      }
      if (e.target.closest('[data-done]')) m.close();
      const rs = e.target.closest('.rs-card .ucard');
      if (rs) inspect(rs.dataset.id);
    });
    m.root.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('flip')) {
        e.preventDefault();
        if (e.target.classList.contains('tap-next')) e.target.click();
        else flip(e.target);
      }
    });
  }

  root.UI = { walkout, settings, profile, playFeat, celebrateFeat, soundSettings: settings, homeworldOf, $, $$, el, esc, fmt, cur, portrait, stars, unitCard, toast, openModal, confirmBox, updateWallet, inspect, synergyBanner, App, Screens };
})(window);
