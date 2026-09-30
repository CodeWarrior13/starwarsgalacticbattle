// Screens, shared components, modals and toasts.

(function (root) {
  const D = root.GameData;
  const Player = root.Player;

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

  // ---------- Ship silhouettes ----------
  const SHIPS = {
    xwing: '<rect x="46" y="8" width="8" height="72" rx="3"/><path d="M14 58h72l-6 13H20z"/><rect x="10" y="28" width="4" height="46" rx="1"/><rect x="86" y="28" width="4" height="46" rx="1"/><circle cx="36" cy="77" r="5"/><circle cx="64" cy="77" r="5"/><rect x="47.5" y="22" width="5" height="8" rx="2" fill="rgba(0,0,0,.45)"/>',
    ywing: '<ellipse cx="50" cy="22" rx="11" ry="13"/><rect x="46.5" y="30" width="7" height="30"/><rect x="18" y="55" width="64" height="7" rx="2"/><rect x="17" y="38" width="10" height="54" rx="5"/><rect x="73" y="38" width="10" height="54" rx="5"/><circle cx="50" cy="19" r="4" fill="rgba(0,0,0,.45)"/>',
    awing: '<path d="M50 8 86 82 62 74 50 80 38 74 14 82z"/><rect x="10" y="50" width="7" height="34" rx="2"/><rect x="83" y="50" width="7" height="34" rx="2"/><path d="M50 34l6 16H44z" fill="rgba(0,0,0,.45)"/>',
    bwing: '<rect x="46" y="6" width="8" height="88" rx="2"/><circle cx="50" cy="16" r="9"/><path d="M18 58h64l-6 9H24z"/><rect x="14" y="54" width="6" height="18" rx="2"/><rect x="80" y="54" width="6" height="18" rx="2"/><circle cx="50" cy="16" r="4" fill="rgba(0,0,0,.45)"/>',
    falcon: '<circle cx="50" cy="56" r="33"/><rect x="36" y="8" width="10" height="30" rx="2"/><rect x="54" y="8" width="10" height="30" rx="2"/><rect x="46" y="14" width="8" height="24" fill="#070a12"/><rect x="80" y="36" width="14" height="9" rx="4"/><circle cx="50" cy="56" r="9" fill="rgba(0,0,0,.35)"/><rect x="24" y="80" width="52" height="5" rx="2" fill="rgba(90,180,255,.8)"/>',
    tie: '<path d="M14 10 24 28v44L14 90 4 72V28z"/><path d="M86 10 96 28v44L86 90 76 72V28z"/><rect x="22" y="46" width="56" height="8"/><circle cx="50" cy="50" r="17"/><circle cx="50" cy="50" r="8" fill="rgba(0,0,0,.45)"/>',
    tieadv: '<path d="M6 16 28 38v24L6 84l8-34z"/><path d="M94 16 72 38v24L94 84l-8-34z"/><rect x="26" y="46" width="48" height="8"/><circle cx="50" cy="50" r="16"/><rect x="42" y="30" width="16" height="10" rx="3"/><circle cx="50" cy="50" r="7" fill="rgba(0,0,0,.45)"/>',
    tiebomber: '<path d="M12 12 22 28v44L12 88 4 72V28z"/><path d="M88 12 96 28v44L88 88 78 72V28z"/><rect x="20" y="46" width="60" height="8"/><ellipse cx="40" cy="50" rx="11" ry="20"/><ellipse cx="61" cy="52" rx="9" ry="24"/><circle cx="40" cy="42" r="5" fill="rgba(0,0,0,.45)"/>',
    shuttle: '<rect x="46" y="6" width="8" height="54" rx="2"/><path d="M42 58 16 90l9 3 25-28z"/><path d="M58 58 84 90l-9 3-25-28z"/><rect x="36" y="54" width="28" height="18" rx="5"/><rect x="42" y="58" width="16" height="6" rx="2" fill="rgba(0,0,0,.45)"/>',
    slave: '<ellipse cx="50" cy="48" rx="24" ry="38"/><path d="M26 68 10 90l20-6z"/><path d="M74 68 90 90l-20-6z"/><circle cx="50" cy="26" r="7" fill="rgba(0,0,0,.45)"/><rect x="38" y="80" width="24" height="6" rx="2" fill="rgba(90,180,255,.8)"/>',
  };

  function shipSvg(shape) {
    return `<svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">${SHIPS[shape] || SHIPS.xwing}</svg>`;
  }

  function initials(name) {
    const words = name.replace(/[^A-Za-z0-9\- ]/g, '').split(/[\s-]+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  function portrait(def) {
    if (def.kind === 'ship') {
      return `<div class="portrait ship ${def.faction}">${shipSvg(def.shape)}<span class="faction-mark"></span><span class="role-badge" title="${def.role}">${D.ROLE_ICONS[def.role]}</span></div>`;
    }
    const saber = ['#3d7be8', '#46c46a', '#e23b3b', '#8f5de8'].includes(def.accent) ? '<span class="saber"></span>' : '';
    return `<div class="portrait char ${def.faction}" style="--accent:${def.accent}"><span class="initials">${initials(def.name)}</span>${saber}<span class="faction-mark"></span><span class="role-badge" title="${def.role}">${D.ROLE_ICONS[def.role]}</span></div>`;
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
    return `<${tag} class="ucard rarity-${def.rarity} ${owned ? '' : 'locked'} ${opts.selected ? 'selected' : ''}" data-id="${def.id}" ${tag === 'button' ? 'type="button"' : ''}>
      ${opts.badge ? `<span class="sel-badge">${opts.badge}</span>` : ''}
      ${portrait(def)}
      <div class="ucard-body">
        <div class="ucard-name">${esc(def.name)}</div>
        <div class="ucard-meta"><span class="rar">${D.RARITIES[def.rarity].label}</span><span>${owned ? 'Lv ' + level : 'Locked'}</span></div>
        ${owned ? stars(starCount) : ''}
        ${owned ? `<div class="ucard-meta"><span class="power">⚡ ${fmt(D.power(def, level, starCount))}</span><span>${def.kind === 'ship' ? 'Ship' : 'Hero'}</span></div>` : ''}
        ${shard}
      </div>
    </${tag}>`;
  }

  function miniPortrait(def) {
    return `<span class="mini" title="${esc(def.name)}">${portrait(def)}</span>`;
  }

  // ---------- Toasts and modals ----------
  function toast(text) {
    const t = el(`<div class="toast">${esc(text)}</div>`);
    $('#toast-root').appendChild(t);
    setTimeout(() => t.remove(), 2700);
  }

  function openModal(html, opts = {}) {
    const backdrop = el(`<div class="modal-backdrop"><div class="modal ${opts.small ? 'small' : ''}" role="dialog" aria-modal="true">${html}</div></div>`);
    const close = () => {
      backdrop.remove();
      document.removeEventListener('keydown', onKey);
      if (opts.onClose) opts.onClose();
    };
    const onKey = (e) => {
      if (e.key === 'Escape' && opts.dismissable !== false) close();
    };
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop && opts.dismissable !== false) close();
    });
    document.addEventListener('keydown', onKey);
    $('#modal-root').appendChild(backdrop);
    const first = backdrop.querySelector('button');
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
  let lastWallet = { credits: null, crystals: null };
  function updateWallet() {
    const s = Player.state;
    for (const key of ['credits', 'crystals']) {
      const node = $('#' + key);
      node.textContent = fmt(s[key]);
      if (lastWallet[key] !== null && lastWallet[key] !== s[key]) {
        const chip = node.parentElement;
        chip.classList.remove('bump');
        void chip.offsetWidth;
        chip.classList.add('bump');
      }
      lastWallet[key] = s[key];
    }
  }

  function costLabel(cost) {
    if (cost.crystals) return `<span class="cost">◆ ${fmt(cost.crystals)}</span>`;
    return `<span class="cost">¢ ${fmt(cost.credits)}</span>`;
  }

  // ---------- Router ----------
  const App = {
    current: null,
    params: {},
    ui: { collectionKind: 'all', collectionFaction: 'all', campaignKind: 'character' },

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
      const view = Screens[screen](App.params);
      container.appendChild(view);
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
    const topPower = Object.entries(s.units)
      .map(([id, u]) => D.power(D.UNIT_MAP[id], u.level, u.stars))
      .sort((a, b) => b - a).slice(0, 5).reduce((a, b) => a + b, 0);

    const v = el(`<section class="view">
      <div class="hero">
        <div>
          <p class="eyebrow">A long time ago, in a galaxy far, far away…</p>
          <h1>Build your squad.<br><em>Command the galaxy.</em></h1>
          <p>Collect heroes, villains and starfighters. Level them up, earn stars, and lead them into turn-based battles where every ability counts and every ultimate is a showstopper.</p>
          <div class="hero-actions">
            <button class="btn btn-primary" type="button" data-go="campaign" data-kind="character">Ground Battle</button>
            <button class="btn" type="button" data-go="campaign" data-kind="ship">Fleet Battle</button>
            <button class="btn" type="button" data-go="shop">Open Packs</button>
          </div>
        </div>
        <div class="crawl-window" aria-hidden="true">
          <div class="crawl"><div class="crawl-inner">
            <h3>EPISODE ${cleared + 1}</h3>
            <h2>SQUAD COMMANDER</h2>
            <p>The galaxy is at war. Imperial forces tighten their grip on the Outer Rim while Sith Lords gather in the shadows.</p>
            <p>A new commander has risen, recruiting rebels, smugglers, droids and even rogue troopers from across the stars.</p>
            <p>With a handful of credits and a battered starfighter wing, you must build a squad strong enough to face the Emperor himself…</p>
          </div></div>
        </div>
      </div>

      <div class="stat-row">
        <div class="stat"><b>${owned}/${D.UNITS.length}</b><span>Units collected</span></div>
        <div class="stat"><b>${cleared}/${totalStages}</b><span>Stages cleared</span></div>
        <div class="stat"><b>${fmt(topPower)}</b><span>Top-5 squad power</span></div>
        <div class="stat"><b>${s.stats.battlesWon}</b><span>Battles won</span></div>
      </div>

      <div class="mode-grid">
        <button class="mode-card" type="button" data-go="campaign" data-kind="character">
          <p class="eyebrow">Ground Campaign</p>
          <h3>Heroes & Villains</h3>
          <p>Squads of 4. From the dunes of Tatooine to the Emperor's throne room. Stage ${Math.min(s.progress.character + 1, D.CAMPAIGNS.character.stages.length)} of ${D.CAMPAIGNS.character.stages.length}.</p>
          <span class="mode-art">${shipSvg('bwing').replace('viewBox', 'style="transform:rotate(30deg)" viewBox')}</span>
        </button>
        <button class="mode-card" type="button" data-go="campaign" data-kind="ship">
          <p class="eyebrow">Fleet Campaign</p>
          <h3>Starfighter Combat</h3>
          <p>Wings of 3. Dogfight TIEs, bounty hunters and Vader's own TIE Advanced. Stage ${Math.min(s.progress.ship + 1, D.CAMPAIGNS.ship.stages.length)} of ${D.CAMPAIGNS.ship.stages.length}.</p>
          <span class="mode-art">${shipSvg('xwing')}</span>
        </button>
        <button class="mode-card" type="button" data-go="collection">
          <p class="eyebrow">Collection</p>
          <h3>Your Roster</h3>
          <p>Upgrade levels with credits and unlock stars with shards from duplicate cards.</p>
          <span class="mode-art">${shipSvg('falcon')}</span>
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

  Screens.campaign = function () {
    const kind = App.ui.campaignKind;
    const camp = D.CAMPAIGNS[kind];
    const progress = Player.state.progress[kind];
    const stagesHtml = camp.stages.map((st, i) => {
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
            <span>¢ ${fmt(r.credits)}</span>
            ${state !== 'cleared' ? `<span style="color:var(--epic)">◆ ${r.firstClearCrystals} first clear</span>` : ''}
          </span>
        </span>
        <span class="mini-row">${st.enemies.map((id) => miniPortrait(D.UNIT_MAP[id])).join('')}</span>
      </button>`;
    }).join('');

    const v = el(`<section class="view">
      <div class="view-head">
        <div>
          <p class="eyebrow">Choose your battle</p>
          <h1>${camp.name}</h1>
        </div>
        <div class="seg" role="tablist">
          <button type="button" data-kind="character" class="${kind === 'character' ? 'active' : ''}">Ground</button>
          <button type="button" data-kind="ship" class="${kind === 'ship' ? 'active' : ''}">Fleet</button>
        </div>
      </div>
      <div class="stage-list">${stagesHtml}</div>
    </section>`);

    v.addEventListener('click', (e) => {
      const k = e.target.closest('[data-kind]');
      if (k) {
        App.ui.campaignKind = k.dataset.kind;
        App.refresh();
        return;
      }
      const st = e.target.closest('[data-stage]');
      if (st && !st.disabled) App.go('squad', { kind, stage: Number(st.dataset.stage) });
    });
    return v;
  };

  Screens.squad = function ({ kind, stage }) {
    const st = D.CAMPAIGNS[kind].stages[stage];
    const size = D.SQUAD_SIZE[kind];
    let squad = Player.state.squads[kind].filter((id) => Player.owns(id) && D.UNIT_MAP[id].kind === kind).slice(0, size);

    const v = el(`<section class="view squad-layout">
      <div class="view-head">
        <div>
          <p class="eyebrow">Stage ${stage + 1} · ${D.CAMPAIGNS[kind].name}</p>
          <h1>${esc(st.name)}</h1>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn" type="button" data-back>Back</button>
          <button class="btn btn-primary" type="button" data-fight>Engage</button>
        </div>
      </div>
      <div class="versus">
        <div><div class="side-label"><span>Your squad</span><b data-mypower></b></div><div class="slots" data-slots style="--n:${size}"></div></div>
        <div class="vs">VS</div>
        <div><div class="side-label"><span>Enemy · Lv ${st.level}</span><b>⚡ ${fmt(st.enemies.reduce((a, id) => a + D.power(D.UNIT_MAP[id], st.level, 1), 0))}</b></div>
          <div class="slots" style="--n:${size}">${st.enemies.map((id) => `<div class="slot filled">${portrait(D.UNIT_MAP[id])}<span class="slot-name">${esc(D.UNIT_MAP[id].name)}</span></div>`).join('')}</div>
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
          ? `<div class="slot filled" data-remove="${id}" title="Remove">${portrait(D.UNIT_MAP[id])}<span class="slot-name">${esc(D.UNIT_MAP[id].name)}</span></div>`
          : '<div class="slot">Empty</div>');
      }
      const power = squad.reduce((a, id) => a + D.power(D.UNIT_MAP[id], Player.unit(id).level, Player.unit(id).stars), 0);
      $('[data-mypower]', v).textContent = '⚡ ' + fmt(power);
      const roster = D.UNITS.filter((u) => u.kind === kind && Player.owns(u.id))
        .sort((a, b) => D.power(b, Player.unit(b.id).level, Player.unit(b.id).stars) - D.power(a, Player.unit(a.id).level, Player.unit(a.id).stars));
      $('[data-roster]', v).innerHTML = roster.map((def) => {
        const idx = squad.indexOf(def.id);
        return unitCard(def, { selected: idx >= 0, badge: idx >= 0 ? idx + 1 : null, hideShards: true });
      }).join('');
      $('[data-fight]', v).disabled = squad.length === 0;
    }

    v.addEventListener('click', (e) => {
      if (e.target.closest('[data-back]')) return App.go('campaign');
      if (e.target.closest('[data-fight]')) {
        Player.setSquad(kind, squad);
        root.BattleUI.start(kind, stage);
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

  Screens.collection = function () {
    const ui = App.ui;
    const v = el(`<section class="view">
      <div class="view-head">
        <div>
          <p class="eyebrow">${Object.keys(Player.state.units).length} of ${D.UNITS.length} collected</p>
          <h1>Collection</h1>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <div class="seg" data-filter="kind">
            <button type="button" data-v="all">All</button><button type="button" data-v="character">Heroes</button><button type="button" data-v="ship">Ships</button>
          </div>
          <div class="seg" data-filter="faction">
            <button type="button" data-v="all">Both</button><button type="button" data-v="light">Light</button><button type="button" data-v="dark">Dark</button>
          </div>
        </div>
      </div>
      <div class="card-grid" data-grid></div>
    </section>`);

    function render() {
      $$('[data-filter="kind"] button', v).forEach((b) => b.classList.toggle('active', b.dataset.v === ui.collectionKind));
      $$('[data-filter="faction"] button', v).forEach((b) => b.classList.toggle('active', b.dataset.v === ui.collectionFaction));
      const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
      const list = D.UNITS
        .filter((u) => ui.collectionKind === 'all' || u.kind === ui.collectionKind)
        .filter((u) => ui.collectionFaction === 'all' || u.faction === ui.collectionFaction)
        .sort((a, b) => {
          const oa = Player.owns(a.id) ? 0 : 1;
          const ob = Player.owns(b.id) ? 0 : 1;
          if (oa !== ob) return oa - ob;
          if (!oa) return D.power(b, Player.unit(b.id).level, Player.unit(b.id).stars) - D.power(a, Player.unit(a.id).level, Player.unit(a.id).stars);
          return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        });
      $('[data-grid]', v).innerHTML = list.map((def) => unitCard(def)).join('');
    }

    v.addEventListener('click', (e) => {
      const f = e.target.closest('[data-filter] button');
      if (f) {
        const which = f.parentElement.dataset.filter;
        if (which === 'kind') ui.collectionKind = f.dataset.v;
        else ui.collectionFaction = f.dataset.v;
        render();
        return;
      }
      const card = e.target.closest('.ucard');
      if (card) unitDetail(card.dataset.id, render);
    });
    render();
    return v;
  };

  function abilityListHtml(def, level, starCount) {
    const all = D.abilitiesFor(def);
    return all.map((ab, i) => `
      <div class="ability ${ab.ultimate ? 'ult' : ''}">
        <span class="ability-icon">${ab.ultimate ? '★' : i === 0 ? 'B' : 'S' + i}</span>
        <div>
          <h4>${esc(ab.name)} <small>${ab.ultimate ? 'Ultimate · charges in battle' : ab.cd ? `Special · ${ab.cd}-turn cooldown` : 'Basic'}</small></h4>
          <p>${esc(ab.desc)}</p>
          ${ab.ultimate && ab.quote ? `<q>${esc(ab.quote)}</q>` : ''}
        </div>
      </div>`).join('');
  }

  function unitDetail(id, onChange) {
    const def = D.UNIT_MAP[id];
    let m;
    function body() {
      const owned = Player.owns(id);
      const u = Player.unit(id) || { level: 1, stars: 1, shards: 0 };
      const s = D.unitStats(def, u.level, u.stars);
      const maxLevel = u.level >= D.MAX_LEVEL;
      const maxStars = u.stars >= D.MAX_STARS;
      const lvlCost = D.levelCost(u.level);
      const starNeed = maxStars ? 0 : D.STAR_COSTS[u.stars - 1];
      return `
        <div class="detail">
          ${portrait(def)}
          <div style="display:grid;gap:10px;align-content:start;min-width:0">
            <p class="eyebrow" style="color:var(--${def.rarity})">${D.RARITIES[def.rarity].label} · ${def.faction === 'light' ? 'Light Side' : 'Dark Side'} · ${def.kind === 'ship' ? 'Ship' : 'Character'} · ${def.role}</p>
            <h2>${esc(def.name)}</h2>
            ${owned ? `<div>${stars(u.stars)} <span class="muted">Level ${u.level}/${D.MAX_LEVEL} · ⚡ ${fmt(D.power(def, u.level, u.stars))}</span></div>` : '<p class="muted">Not yet recruited. Find this unit in packs or the daily deal.</p>'}
            <div class="statgrid">
              <div><span>Health</span><b>${fmt(s.hp)}</b></div>
              <div><span>Attack</span><b>${fmt(s.atk)}</b></div>
              <div><span>Armor</span><b>${fmt(s.def)}</b></div>
              <div><span>Speed</span><b>${fmt(s.spd)}</b></div>
            </div>
          </div>
        </div>
        <div class="ability-list">${abilityListHtml(def, u.level, u.stars)}</div>
        ${owned ? `<div class="upgrade-row">
          <div class="upgrade">
            <b>Level up</b>
            <span class="muted">${maxLevel ? 'Max level reached.' : `Lv ${u.level} → ${u.level + 1}: +8% health and attack.`}</span>
            <button class="btn btn-primary" type="button" data-level ${maxLevel || Player.state.credits < lvlCost ? 'disabled' : ''}>${maxLevel ? 'Maxed' : `Train · ¢ ${fmt(lvlCost)}`}</button>
          </div>
          <div class="upgrade">
            <b>Promote</b>
            <span class="muted">${maxStars ? 'Max stars reached.' : `Shards ${u.shards}/${starNeed}. Duplicates from packs give shards.`}</span>
            ${maxStars ? '' : `<div class="shardbar ${u.shards >= starNeed ? 'ready' : ''}"><i style="width:${Math.min(100, (u.shards / starNeed) * 100)}%"></i></div>`}
            <button class="btn" type="button" data-star ${maxStars || u.shards < starNeed ? 'disabled' : ''}>${maxStars ? 'Maxed' : `Promote to ${u.stars + 1}★`}</button>
          </div>
        </div>` : ''}
        <div class="modal-actions"><button class="btn" type="button" data-close>Close</button></div>`;
    }
    m = openModal(body(), { onClose: onChange });
    const modal = m.root.querySelector('.modal');
    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) return m.close();
      if (e.target.closest('[data-level]') && Player.levelUp(id)) {
        toast(`${def.name} reached level ${Player.unit(id).level}!`);
      } else if (e.target.closest('[data-star]') && Player.starUp(id)) {
        toast(`${def.name} promoted to ${Player.unit(id).stars}★!`);
      } else {
        return;
      }
      modal.innerHTML = body();
      updateWallet();
    });
  }

  Screens.shop = function () {
    const deal = Player.dailyDeal();
    const packColors = { recruit: 'var(--light)', squadron: 'var(--dark)', holocron: 'var(--legendary)' };
    const packGlyph = { recruit: '⚔', squadron: '✈', holocron: '◆' };
    const oddsHtml = (o) => `<div class="odds">${o.common ? `<span class="c">Common ${o.common}%</span>` : ''}<span class="r">Rare ${o.rare}%</span><span class="e">Epic ${o.epic}%</span><span class="l">Legendary ${o.legendary}%</span></div>`;
    const v = el(`<section class="view">
      <div class="view-head">
        <div><p class="eyebrow">Galactic Market</p><h1>Shop</h1></div>
        <p class="muted" style="margin:0;max-width:44ch">New cards join your roster. Duplicates turn into shards that promote a unit's stars.</p>
      </div>
      <div class="shop-grid">
        ${D.PACKS.map((p) => `
          <div class="pack">
            <div class="pack-art" style="--pc:${packColors[p.id]}"><div class="pack-box">${packGlyph[p.id]}</div></div>
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            ${oddsHtml(p.odds)}
            <button class="btn btn-primary" type="button" data-pack="${p.id}" ${Player.canAfford(p.cost) ? '' : 'disabled'}>Open · ${costLabel(p.cost)}</button>
          </div>`).join('')}
      </div>
      <div class="deal-row">
        <div class="deal">
          ${portrait(deal.def)}
          <div style="display:grid;gap:8px;min-width:0">
            <p class="eyebrow" style="margin:0">Daily deal · resets at midnight UTC</p>
            <h3>${esc(deal.def.name)}</h3>
            <p class="muted" style="margin:0;font-size:13px">${Player.owns(deal.def.id) ? `${deal.shards} shards for ${esc(deal.def.name)}.` : `Recruit ${esc(deal.def.name)} (${D.RARITIES[deal.def.rarity].label}) straight away.`}</p>
            <button class="btn btn-primary" type="button" data-deal ${deal.bought || !Player.canAfford(deal.cost) ? 'disabled' : ''}>${deal.bought ? 'Purchased today' : `Buy · ${costLabel(deal.cost)}`}</button>
          </div>
        </div>
        <div class="deal" style="grid-template-columns:1fr">
          <div style="display:grid;gap:8px">
            <p class="eyebrow" style="margin:0">Exchange</p>
            <h3>Credit Cache</h3>
            <p class="muted" style="margin:0;font-size:13px">Trade 50 crystals for ¢ 1,000 credits.</p>
            <button class="btn" type="button" data-exchange ${Player.state.crystals < 50 ? 'disabled' : ''}>Exchange · ◆ 50</button>
          </div>
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
      if (e.target.closest('[data-deal]')) {
        const r = Player.buyDailyDeal();
        if (r) {
          packReveal([r]);
          updateWallet();
        }
        return;
      }
      if (e.target.closest('[data-exchange]') && Player.exchangeCrystals()) {
        toast('+¢ 1,000 credits');
        App.refresh();
      }
    });
    return v;
  };

  function packReveal(results) {
    const cards = results.map((r) => {
      const def = D.UNIT_MAP[r.id];
      const tag = r.isNew ? '<span class="reveal-tag">NEW!</span>' : `<span class="reveal-tag dup">+${r.shards} shards</span>`;
      return `<div class="flip glow-${def.rarity}" tabindex="0" role="button" aria-label="Reveal card">
        <div class="flip-face flip-back">?</div>
        <div class="flip-face flip-front">${tag}${unitCard(def, { tag: 'div', hideShards: true })}</div>
      </div>`;
    }).join('');
    const m = openModal(`
      <div style="text-align:center"><p class="eyebrow">Pack opened</p><h2>Tap each card to reveal</h2></div>
      <div class="reveal-row">${cards}</div>
      <div class="modal-actions" style="justify-content:center">
        <button class="btn" type="button" data-all>Reveal all</button>
        <button class="btn btn-primary" type="button" data-done>Done</button>
      </div>`, { onClose: () => App.refresh() });
    const flip = (f) => {
      if (f.classList.contains('flipped')) return;
      f.classList.add('flipped');
      if (f.classList.contains('glow-legendary')) toast('LEGENDARY!');
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

  root.UI = { $, $$, el, esc, fmt, portrait, shipSvg, stars, unitCard, toast, openModal, confirmBox, updateWallet, App, Screens };
})(window);
