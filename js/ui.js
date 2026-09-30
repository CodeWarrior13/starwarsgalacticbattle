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
  function updateWallet() {
    const s = Player.state;
    for (const key of ['credits', 'crystals', 'aurodium']) {
      const node = $('#' + key);
      if (!node) continue;
      node.textContent = fmt(s[key]);
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
    const totalStages = D.CAMPAIGNS.character.stages.length + D.CAMPAIGNS.ship.stages.length;
    const cleared = s.progress.character + s.progress.ship;
    const bossesBeaten = Object.keys(s.bosses).length;
    const showcase = ['vader', 'yoda', 'falcon', 'boba_fett', 'tie_advanced']
      .map((id, i) => `<div class="showcase-card sc-${i}">${portrait(D.UNIT_MAP[id])}</div>`).join('');

    const v = el(`<section class="view">
      <div class="hero">
        <div class="hero-copy">
          <p class="eyebrow">A long time ago, in a galaxy far, far away…</p>
          <h1>Build your squad.<br><em>Command the galaxy.</em></h1>
          <p>Collect heroes, villains and starfighters. Level them up, earn stars, and lead them into turn-based battles where every ability counts and every ultimate is a showstopper.</p>
          <div class="hero-actions">
            <button class="btn btn-primary" type="button" data-go="campaign" data-kind="character">Ground Battle</button>
            <button class="btn" type="button" data-go="campaign" data-kind="ship">Fleet Battle</button>
            <button class="btn" type="button" data-go="campaign" data-kind="boss">Boss Battles</button>
          </div>
        </div>
        <div class="showcase" aria-hidden="true">${showcase}</div>
      </div>

      <div class="stat-row">
        <div class="stat"><b>${owned}/${D.UNITS.length}</b><span>Units collected</span></div>
        <div class="stat"><b>${cleared}/${totalStages}</b><span>Stages cleared</span></div>
        <div class="stat"><b>${bossesBeaten}/${D.BOSS_ENCOUNTERS.length}</b><span>Bosses defeated</span></div>
        <div class="stat"><b>${s.stats.bestSpin}×</b><span>Luckiest spin</span></div>
      </div>

      <div class="mode-grid">
        ${modeCard('character', 'Ground Campaign', 'Heroes & Villains', `Squads of 4. Stage ${Math.min(s.progress.character + 1, D.CAMPAIGNS.character.stages.length)} of ${D.CAMPAIGNS.character.stages.length}.`, 'luke')}
        ${modeCard('ship', 'Fleet Campaign', 'Starfighter Combat', `Wings of 3. Stage ${Math.min(s.progress.ship + 1, D.CAMPAIGNS.ship.stages.length)} of ${D.CAMPAIGNS.ship.stages.length}.`, 'x_wing')}
        ${modeCard('boss', 'Boss Battles', 'Giant Threats', `Rancors, dragons, Star Destroyers. ${bossesBeaten} of ${D.BOSS_ENCOUNTERS.length} defeated.`, 'rancor')}
        <button class="mode-card market-card" type="button" data-go="market">
          <span class="mode-art">${Art.merchantArt()}</span>
          <span class="mode-text"><span class="eyebrow">Black Market</span><h3>No Questions Asked</h3><span class="muted">Crates, hot stock, lucky charms and a Sabacc table.</span></span>
        </button>
      </div>

      <p class="muted" style="font-size:13px">Progress saves automatically in this browser. <button class="linkish" type="button" data-reset>Reset progress</button></p>
    </section>`);

    v.addEventListener('click', async (e) => {
      const go = e.target.closest('[data-go]');
      if (go) {
        if (go.dataset.kind) App.ui.campaignKind = go.dataset.kind;
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

  function modeCard(kind, eyebrow, title, text, artId) {
    return `<button class="mode-card" type="button" data-go="campaign" data-kind="${kind}">
      <span class="mode-art">${Art.unitArt(D.UNIT_MAP[artId])}</span>
      <span class="mode-text"><span class="eyebrow">${eyebrow}</span><h3>${title}</h3><span class="muted">${text}</span></span>
    </button>`;
  }

  Screens.campaign = function () {
    const kind = App.ui.campaignKind;
    const isBoss = kind === 'boss';
    let listHtml;
    if (isBoss) {
      listHtml = `<div class="boss-grid">${D.BOSS_ENCOUNTERS.map((enc) => {
        const def = D.UNIT_MAP[enc.id];
        const unlocked = Player.bossUnlocked(enc);
        const wins = Player.state.bosses[enc.id] || 0;
        const r = D.bossRewards(enc, !wins);
        const need = `Clear ${D.CAMPAIGNS[enc.unlock.kind].name} stage ${enc.unlock.stage}`;
        return `<button class="boss-card ${unlocked ? '' : 'locked'}" type="button" data-boss="${enc.id}" ${unlocked ? '' : 'disabled'}>
          <span class="boss-art">${Art.unitArt(def)}</span>
          <span class="boss-info">
            <span class="eyebrow">${enc.kind === 'ship' ? 'Fleet boss' : 'Ground boss'} · Lv ${enc.level}</span>
            <h3>${esc(enc.name)}</h3>
            <span class="muted">${esc(def.name)} · ${esc(enc.place)}</span>
            <span class="boss-rewards">${cur('credits', r.credits)}${cur('aurodium', r.aurodium)}${r.kyber ? cur('crystals', r.kyber) : ''}${r.card ? '<span class="tag">+ Epic/Legendary card</span>' : ''}</span>
            <span class="boss-status">${unlocked ? (wins ? `Defeated ${wins}×` : 'Not yet defeated') : `🔒 ${need}`}</span>
          </span>
        </button>`;
      }).join('')}</div>`;
    } else {
      const camp = D.CAMPAIGNS[kind];
      const progress = Player.state.progress[kind];
      listHtml = `<div class="stage-list">${camp.stages.map((st, i) => {
        const state = i < progress ? 'cleared' : i === progress ? 'current' : 'locked';
        const r = D.stageRewards(kind, i);
        const enemyPower = st.enemies.reduce((a, id) => a + D.power(D.UNIT_MAP[id], st.level, 1), 0);
        return `<button class="stage ${state}" type="button" data-stage="${i}" ${state === 'locked' ? 'disabled' : ''}>
          <span class="stage-num">${state === 'cleared' ? '✓' : i + 1}</span>
          <span>
            <h3>${esc(st.name)}</h3>
            <span class="stage-info">
              <span>Enemy Lv ${st.level}</span>
              <span>⚡ ${fmt(enemyPower)}</span>
              ${cur('credits', r.credits)}
              ${state !== 'cleared' ? `<span class="first-clear">${cur('crystals', r.firstClearCrystals)} first clear</span>` : ''}
            </span>
          </span>
          <span class="mini-row">${st.enemies.map((id) => miniPortrait(D.UNIT_MAP[id])).join('')}</span>
        </button>`;
      }).join('')}</div>`;
    }

    const title = isBoss ? 'Boss Battles' : D.CAMPAIGNS[kind].name;
    const v = el(`<section class="view">
      <div class="view-head">
        <div>
          <p class="eyebrow">${isBoss ? 'Enrage below 50% HP · immune to Stun' : 'Choose your battle'}</p>
          <h1>${title}</h1>
        </div>
        <div class="seg" role="tablist">
          <button type="button" data-kind="character" class="${kind === 'character' ? 'active' : ''}">Ground</button>
          <button type="button" data-kind="ship" class="${kind === 'ship' ? 'active' : ''}">Fleet</button>
          <button type="button" data-kind="boss" class="${isBoss ? 'active' : ''}">Bosses</button>
        </div>
      </div>
      ${listHtml}
    </section>`);

    v.addEventListener('click', (e) => {
      const k = e.target.closest('[data-kind]');
      if (k) {
        App.ui.campaignKind = k.dataset.kind;
        App.refresh();
        return;
      }
      const st = e.target.closest('[data-stage]');
      if (st && !st.disabled) return App.go('squad', { type: 'stage', kind, stage: Number(st.dataset.stage) });
      const b = e.target.closest('[data-boss]');
      if (b && !b.disabled) App.go('squad', { type: 'boss', boss: b.dataset.boss });
    });
    return v;
  };

  Screens.squad = function (params) {
    const enc = Player.encounter(params);
    const kind = enc.kind;
    const size = D.SQUAD_SIZE[kind];
    let squad = Player.state.squads[kind].filter((id) => Player.owns(id) && D.UNIT_MAP[id].kind === kind).slice(0, size);
    const enemyPower = enc.enemies.reduce((a, id) => a + D.power(D.UNIT_MAP[id], enc.level, 1), 0);

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
        <div><div class="side-label"><span>Your squad</span><b data-mypower></b></div><div class="slots" data-slots style="--n:${size}"></div></div>
        <div class="vs">VS</div>
        <div><div class="side-label"><span>Enemy · Lv ${enc.level}</span><b>⚡ ${fmt(enemyPower)}</b></div>
          <div class="slots" style="--n:${Math.max(enc.enemies.length, 1)}">${enc.enemies.map((id) => `<div class="slot filled ${D.UNIT_MAP[id].boss ? 'boss-slot' : ''}">${portrait(D.UNIT_MAP[id])}</div>`).join('')}</div>
        </div>
      </div>
      <div>
        <div class="side-label"><span>Tap to add or remove (up to ${size})</span></div>
        <div class="card-grid" data-roster></div>
      </div>
    </section>`);

    function render() {
      const slots = $('[data-slots]', v);
      slots.innerHTML = '';
      for (let i = 0; i < size; i++) {
        const id = squad[i];
        slots.insertAdjacentHTML('beforeend', id
          ? `<div class="slot filled" data-remove="${id}" title="Remove">${portrait(D.UNIT_MAP[id])}</div>`
          : '<div class="slot">Empty</div>');
      }
      const power = squad.reduce((a, id) => a + Player.powerOf(id), 0);
      const mp = $('[data-mypower]', v);
      mp.textContent = '⚡ ' + fmt(power);
      mp.className = power >= enemyPower ? 'good' : power >= enemyPower * 0.8 ? 'close' : 'bad';
      const roster = D.UNITS.filter((u) => u.kind === kind && Player.owns(u.id)).sort((a, b) => Player.powerOf(b.id) - Player.powerOf(a.id));
      $('[data-roster]', v).innerHTML = roster.map((def) => {
        const idx = squad.indexOf(def.id);
        return unitCard(def, { selected: idx >= 0, badge: idx >= 0 ? idx + 1 : null, hideShards: true });
      }).join('');
      $('[data-fight]', v).disabled = squad.length === 0;
    }

    v.addEventListener('click', (e) => {
      if (e.target.closest('[data-back]')) return App.go('campaign');
      if (e.target.closest('[data-auto-build]')) {
        squad = Player.autoSquad(kind);
        toast('Auto-built your strongest squad.');
        return render();
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
      if (squad.includes(id)) squad = squad.filter((x) => x !== id);
      else if (squad.length < size) squad.push(id);
      else toast(`Squad is full. Remove someone first (max ${size}).`);
      render();
    });
    render();
    return v;
  };

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
            ${Object.entries(SORTS).map(([k, s]) => `<button type="button" data-v="${k}">${k === 'strong' ? '▼ ' : k === 'weak' ? '▲ ' : ''}${s.label}</button>`).join('')}
          </div>
        </div>
      </div>
      <div class="card-grid" data-grid></div>
    </section>`);

    function render() {
      $$('[data-filter="kind"] button', v).forEach((b) => b.classList.toggle('active', b.dataset.v === ui.collectionKind));
      $$('[data-filter="faction"] button', v).forEach((b) => b.classList.toggle('active', b.dataset.v === ui.collectionFaction));
      $$('[data-filter="sort"] button', v).forEach((b) => b.classList.toggle('active', b.dataset.v === ui.collectionSort));
      const list = D.UNITS
        .filter((u) => ui.collectionKind === 'all' || u.kind === ui.collectionKind)
        .filter((u) => ui.collectionFaction === 'all' || u.faction === ui.collectionFaction)
        .sort((a, b) => {
          const oa = Player.owns(a.id) ? 0 : 1;
          const ob = Player.owns(b.id) ? 0 : 1;
          return oa - ob || SORTS[ui.collectionSort].fn(a, b);
        });
      $('[data-grid]', v).innerHTML = list.map((def) => unitCard(def)).join('');
    }

    v.addEventListener('click', (e) => {
      const f = e.target.closest('[data-filter] button');
      if (f) {
        const which = f.parentElement.dataset.filter;
        if (which === 'kind') ui.collectionKind = f.dataset.v;
        else if (which === 'faction') ui.collectionFaction = f.dataset.v;
        else ui.collectionSort = f.dataset.v;
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

    const v = el(`<section class="view market">
      <div class="market-hero">
        <div class="market-merchant">${Art.merchantArt()}</div>
        <div class="market-copy">
          <p class="neon">BLACK MARKET</p>
          <h1>Vekko's Back Room</h1>
          <p class="muted">“${esc(line)}”</p>
          <div class="luck-row">
            <span class="luck-chip" title="Crates opened since your last Legendary">🎯 Legendary pity <b>${luck.pity}/${D.LUCK.pityCrates}</b></span>
            <span class="luck-chip ${luck.charmCrates ? 'on' : ''}" title="Boosted crates remaining">🎲 Chance Cubes <b>${luck.charmCrates}</b></span>
            <span class="luck-chip ${luck.dice ? 'on' : ''}" title="Boosted victory spins remaining">🎰 Loaded Dice <b>${luck.dice}</b></span>
          </div>
        </div>
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
      </div>
    </section>`);

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
      if (pick && !pick.disabled) playSabacc(v, bet, Number(pick.dataset.pick));
    });
    return v;
  };

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

  root.UI = { $, $$, el, esc, fmt, cur, portrait, stars, unitCard, toast, openModal, confirmBox, updateWallet, inspect, App, Screens };
})(window);
