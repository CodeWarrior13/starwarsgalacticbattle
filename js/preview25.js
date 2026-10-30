// Ships with 2.3 (testers: the swcg-pv-test key or the master key):
//  - Rex's battle intel: Rex sits at the bottom of every battle in place of the
//    bonus chips. Tap him for both squads side by side (every multiplier, per
//    troop, live buffs and debuffs) and a guide to every battle icon.
//  - Tap any status icon on a battle card to see what it means.
//  - Promote All (level 20): promotes every card whose shard bar is green, then
//    a promotion report crosses out the old stats and writes in the new ones.
//  - Buy Chance Cubes and Loaded Dice several at a time.
(function (root) {
  'use strict';
  const D = root.GameData;
  const Player = root.Player;
  const UI = root.UI;
  const BUI = root.BattleUI;
  if (!D || !Player || !UI) return;
  const { esc, fmt, portrait, toast, openModal } = UI;
  const get = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } };
  // Ships with 2.3; testers get it early with its switch (or the master key).
  const on = () => !!(root.Update23 && root.Update23.on && root.Update23.on()) || get('swcg-pv-test') === '1';
  const motionOK = () => UI.motionOK ? UI.motionOK() : true;
  const pct = (x) => `${x > 0 ? '+' : ''}${Math.round(x * 100)}%`;

  // ---------- Battle icons ----------
  const KIND_LABEL = { buff: 'Buff', debuff: 'Debuff', mech: 'Boss trick', mark: 'Info' };
  const kindOf = (k) => { const i = D.STATUS_INFO[k]; return i ? (i.kind === 'buff' || i.kind === 'debuff' ? i.kind : 'mech') : 'mech'; };
  // Battlefield markers that aren't statuses.
  const MARKS = [
    ['⌖', 'Target', 'A glowing card is one you can hit with the ability you picked. Tap it to attack.'],
    ['❤', 'Health bar', 'Green, then yellow under half, red under a quarter.'],
    ['»', 'Turn meter', 'The blue bar fills with speed. Full means that card moves next.'],
    ['★', 'Ultimate bar', 'The gold bar fills as the card fights. When it glows, the ultimate is ready.'],
    ['☠', 'Enraged', 'A red, pulsing boss is low on health and hits much harder. Finish it fast.'],
  ];
  // What a status does to the numbers, for the intel totals.
  const STATUS_MULT = { offUp: { atk: 0.5 }, offDown: { atk: -0.4 }, defUp: { def: 0.5 }, defDown: { def: -0.5 } };

  function guideHtml() {
    const all = Object.entries(D.STATUS_INFO);
    const group = (kind, title) => {
      const rows = all.filter(([k]) => kindOf(k) === kind);
      return rows.length ? `<div class="rx-grp ${kind}"><h4>${title}</h4>${rows.map(([, i]) => `<div class="rx-row"><span class="rx-ic ${kind}">${esc(i.icon)}</span><p><b>${esc(i.label)}</b> · ${esc(i.desc)}</p></div>`).join('')}</div>` : '';
    };
    return `<div class="rx-groups">
      ${group('buff', 'Helps (buffs)')}${group('debuff', 'Hurts (debuffs)')}${group('mech', 'Boss tricks')}
      <div class="rx-grp mark"><h4>Battlefield info</h4>${MARKS.map(([ic, l, d]) => `<div class="rx-row"><span class="rx-ic mark">${ic}</span><p><b>${l}</b> · ${d}</p></div>`).join('')}</div>
    </div>`;
  }

  function tip(host, anchor, html) {
    host.querySelectorAll('.rx-tip').forEach((n) => n.remove());
    const t = document.createElement('div');
    t.className = 'rx-tip';
    t.setAttribute('role', 'status');
    t.innerHTML = html;
    host.appendChild(t);
    const a = host.getBoundingClientRect();
    const r = anchor.getBoundingClientRect();
    const w = t.offsetWidth;
    const x = Math.max(6, Math.min(r.left - a.left + r.width / 2 - w / 2, a.width - w - 6));
    let y = r.bottom - a.top + 6;
    if (y + t.offsetHeight > a.height - 4) y = r.top - a.top - t.offsetHeight - 6;
    t.style.left = `${x}px`;
    t.style.top = `${Math.max(4, y)}px`;
    return t;
  }

  // ---------- Rex's battle intel ----------
  const REX_SEEN = 'swcg-rex-intel';
  function intelSides(ui) {
    const b = ui.battle;
    const out = {};
    for (const side of ['player', 'enemy']) {
      const units = b.side(side);
      const sb = D.squadBonuses(units.map((u) => u.id), ui.planetId);
      const rows = units.map((u, i) => {
        const m = sb.perUnit[i] || {};
        const live = { atk: 0, def: 0 };
        for (const k of Object.keys(u.statuses || {})) for (const [s, v] of Object.entries(STATUS_MULT[k] || {})) live[s] += v;
        return { u, m, live };
      });
      const alive = rows.filter((r) => r.u.alive);
      const avg = (f) => (alive.length ? alive.reduce((a, r) => a + f(r), 0) / alive.length : 0);
      out[side] = {
        rows,
        bonuses: b.bonuses[side] || [],
        tot: {
          atk: avg((r) => (1 + (r.m.atk || 0)) * (1 + r.live.atk) - 1),
          def: avg((r) => (1 + (r.m.def || 0)) * (1 + r.live.def) - 1),
          hp: avg((r) => r.m.hp || 0),
          spd: avg((r) => r.m.spd || 0),
          crit: avg((r) => r.m.crit || 0),
        },
        hpNow: rows.reduce((a, r) => a + Math.max(0, r.u.hp), 0),
        hpMax: rows.reduce((a, r) => a + r.u.maxHp, 0),
        atkNow: alive.reduce((a, r) => a + r.u.atk * (1 + r.live.atk), 0),
      };
    }
    return out;
  }

  function intelHtml(ui) {
    const s = intelSides(ui);
    const planet = D.PLANET_MAP[ui.planetId];
    const hz = planet && planet.hazard && ui.kind !== 'ship' ? planet.hazard : null;
    const tug = (label, a, bv, show) => {
      const t = a + bv || 1;
      return `<div class="rx-tug"><span class="rx-tl">${label}</span><div class="rx-tb"><i class="you" style="flex:${a / t}"></i><i class="foe" style="flex:${bv / t}"></i></div><span class="rx-tv"><b class="you">${show(a)}</b><b class="foe">${show(bv)}</b></span></div>`;
    };
    const chip = (k, v) => (Math.abs(v) < 0.005 ? '' : `<span class="rx-m ${v > 0 ? 'up' : 'down'}">${{ atk: 'ATK', def: 'DEF', hp: 'HP', spd: 'SPD', crit: 'CRIT', critDmg: 'CRIT DMG', lifesteal: 'LIFESTEAL', regen: 'HEAL/TURN', tmStart: 'START TM' }[k]} ${k === 'tmStart' ? `+${Math.round(v)}` : pct(v)}</span>`);
    const col = (side) => {
      const x = s[side];
      const you = side === 'player';
      return `<div class="rx-col ${you ? 'you' : 'foe'}">
        <h3>${you ? '★ Your squad' : '☠ Enemy squad'}</h3>
        <div class="rx-tot">${[['atk', 'Attack'], ['def', 'Defense'], ['hp', 'Health'], ['spd', 'Speed'], ['crit', 'Crit']].map(([k, l]) => `<span><em>${l}</em>${k === 'crit' ? pct(x.tot[k]) : `×${(1 + x.tot[k]).toFixed(2)}`}</span>`).join('')}</div>
        <div class="rx-bon">${x.bonuses.length ? x.bonuses.map((bn) => `<div><b>${esc(bn.icon)} ${esc(bn.name)}${bn.need ? ` <em>${bn.count}/${bn.need}</em>` : ''}</b><span>${esc(bn.desc)}</span></div>`).join('') : '<p class="muted small">No squad bonuses active.</p>'}</div>
        <div class="rx-troops">${x.rows.map(({ u, m, live }) => `<div class="rx-troop ${u.alive ? '' : 'ko'}">
          <span class="rx-pt">${portrait(u.def, { plate: false })}</span>
          <div class="rx-tb2"><b>${esc(u.def.name)}</b><span class="rx-hp"><i style="width:${Math.max(0, (u.hp / u.maxHp) * 100)}%"></i></span>
            <div class="rx-ms">${u.alive ? '' : '<span class="rx-m down">DEFEATED</span>'}${['atk', 'def', 'hp', 'spd', 'crit', 'critDmg', 'lifesteal', 'regen', 'tmStart'].map((k) => chip(k, m[k] || 0)).join('')}${live.atk ? `<span class="rx-m ${live.atk > 0 ? 'up' : 'down'} live">ATK ${pct(live.atk)} now</span>` : ''}${live.def ? `<span class="rx-m ${live.def > 0 ? 'up' : 'down'} live">DEF ${pct(live.def)} now</span>` : ''}</div>
            ${Object.keys(u.statuses || {}).length ? `<div class="rx-sts">${Object.entries(u.statuses).map(([k, n]) => { const i = D.STATUS_INFO[k]; return i ? `<span class="rx-ic ${kindOf(k)}" title="${esc(i.label)}">${esc(i.icon)}<sub>${n > 50 ? '∞' : n}</sub></span>` : ''; }).join('')}</div>` : ''}
          </div></div>`).join('')}</div>
      </div>`;
    };
    return `<div class="rx-panel" role="dialog" aria-label="Captain Rex's battle intel">
      <div class="rx-head"><span class="rx-face">${portrait(D.UNIT_MAP.captain_rex, { plate: false })}</span>
        <div class="rx-say"><b>Captain Rex</b><p>${s.player.atkNow >= s.enemy.atkNow ? 'We hit harder than they do. Keep the pressure on.' : 'They out-punch us. Use your tanks and debuffs, trooper.'}</p></div>
        <button class="btn btn-small" type="button" data-rx-close aria-label="Close">✕</button></div>
      <div class="rx-tabs" role="tablist"><button type="button" class="on" data-rx-tab="intel">Squads</button><button type="button" data-rx-tab="guide">What the icons mean</button></div>
      <div data-rx-pane="intel">
        <div class="rx-tugs">${tug('Health', s.player.hpNow, s.enemy.hpNow, fmt)}${tug('Attack power', s.player.atkNow, s.enemy.atkNow, (v) => fmt(Math.round(v)))}</div>
        ${hz ? `<div class="rx-hz"><b>⚠ ${esc(hz.name)}</b><span>${esc(hz.desc)}</span></div>` : ''}
        <div class="rx-cols">${col('player')}${col('enemy')}</div>
      </div>
      <div data-rx-pane="guide" hidden>${guideHtml()}</div>
    </div>`;
  }

  function openIntel(ui, tab) {
    // On the battle view, not the field, so it sits above the ability bar.
    const host = ui.view;
    if (!host || host.querySelector('.rx-panel')) return;
    const wrap = document.createElement('div');
    wrap.className = 'rx-wrap';
    wrap.innerHTML = intelHtml(ui);
    host.appendChild(wrap);
    const show = (t) => {
      wrap.querySelectorAll('[data-rx-tab]').forEach((b) => b.classList.toggle('on', b.dataset.rxTab === t));
      wrap.querySelectorAll('[data-rx-pane]').forEach((p) => { p.hidden = p.dataset.rxPane !== t; });
    };
    if (tab) show(tab);
    wrap.addEventListener('click', (e) => {
      e.stopPropagation();
      const t = e.target.closest('[data-rx-tab]');
      if (t) return show(t.dataset.rxTab);
      if (e.target === wrap || e.target.closest('[data-rx-close]')) wrap.remove();
    });
  }

  function rexButton(ui) {
    const b = ui.battle;
    const n = (side) => (b.bonuses[side] || []).length;
    return `<button type="button" class="rx-btn" data-rx-open aria-label="Captain Rex: battle intel">
      <span class="rx-face">${portrait(D.UNIT_MAP.captain_rex, { plate: false })}</span>
      <span class="rx-lbl"><b>Intel</b><small><i class="you">★ ${n('player')}</i><i class="foe">☠ ${n('enemy')}</i></small></span>
    </button>`;
  }

  if (BUI && BUI.renderScreen && !BUI.__pv25) {
    BUI.__pv25 = true;
    const render = BUI.renderScreen;
    BUI.renderScreen = function () {
      const r = render.apply(this, arguments);
      if (!on() || !this.view || !this.field) return r;
      const ui = this;
      this.view.classList.add('rx-on');
      this.field.insertAdjacentHTML('beforeend', rexButton(this));
      // Taps on icons and Rex are handled here, before the battle's own click
      // handler, so tapping a status icon doesn't also pick a target.
      this.view.addEventListener('click', (e) => {
        if (e.target.closest('[data-rx-open]')) { e.stopPropagation(); return openIntel(ui); }
        const s = e.target.closest('.bcard .statuses span[data-s]');
        if (s) {
          e.stopPropagation();
          const k = s.dataset.s;
          const info = D.STATUS_INFO[k];
          const card = s.closest('.bcard');
          const u = ui.battle.units.find((x) => String(x.uid) === card.dataset.uid);
          const n = u && u.statuses[k];
          const kind = kindOf(k);
          if (info) tip(ui.field, s, `<span class="k ${kind}">${KIND_LABEL[kind]}${n ? ` · ${n > 50 ? 'until the battle ends' : `${n} turn${n === 1 ? '' : 's'} left`}` : ''}</span><b>${esc(info.icon)} ${esc(info.label)}</b>${esc(info.desc)}`);
          return;
        }
        if (!e.target.closest('.rx-tip')) ui.field.querySelectorAll('.rx-tip').forEach((t) => t.remove());
      }, true);
      // Rex explains the icons once, before the first battle with him.
      if (!get(REX_SEEN) && !(this.isTutorial && this.isTutorial())) {
        set(REX_SEEN, '1');
        setTimeout(() => { if (ui.view && ui.view.isConnected) openIntel(ui, 'guide'); }, 900);
      }
      return r;
    };
    // Keep an open intel panel current as the fight goes on.
    const upd = BUI.updateAll;
    if (upd) {
      BUI.updateAll = function () {
        const r = upd.apply(this, arguments);
        // Battles update many times a second; the panel redraws at most
        // every 400 ms, and only while it's open on the Squads tab.
        if (on() && this.view && this.view.querySelector('.rx-wrap') && !this.__rxT) {
          this.__rxT = setTimeout(() => {
            this.__rxT = 0;
            const w = this.view && this.view.querySelector('.rx-wrap');
            if (!w || w.querySelector('[data-rx-pane="intel"]').hidden) return;
            const y = w.querySelector('.rx-panel').scrollTop;
            w.innerHTML = intelHtml(this);
            w.querySelector('.rx-panel').scrollTop = y;
          }, 400);
        }
        return r;
      };
    }
  }

  // ---------- Promote All ----------
  const PROMOTE_LEVEL = 20;
  const ready = () => Object.keys(Player.state.units).filter((id) => {
    const u = Player.unit(id);
    return D.UNIT_MAP[id] && u.stars < D.MAX_STARS && u.shards >= D.STAR_COSTS[u.stars - 1];
  });
  function promoteAll() {
    const out = [];
    for (const id of ready()) {
      const u = Player.unit(id);
      const from = { stars: u.stars, level: u.level };
      // A card with shards for several promotions climbs all of them.
      while (u.stars < D.MAX_STARS && u.shards >= D.STAR_COSTS[u.stars - 1]) {
        u.shards -= D.STAR_COSTS[u.stars - 1];
        u.stars += 1;
      }
      out.push({ id, from, to: { stars: u.stars, level: u.level } });
    }
    if (out.length) Player.save();
    return out.sort((a, b) => D.power(D.UNIT_MAP[b.id], b.to.level, b.to.stars) - D.power(D.UNIT_MAP[a.id], a.to.level, a.to.stars));
  }

  const STATS = [['power', 'Power'], ['hp', 'Health'], ['atk', 'Damage'], ['def', 'Defense'], ['spd', 'Speed']];
  const statsOf = (def, lv, st) => ({ ...D.unitStats(def, lv, st), power: D.power(def, lv, st) });

  function report(list) {
    const totalUp = list.reduce((a, r) => { const def = D.UNIT_MAP[r.id]; return a + D.power(def, r.to.level, r.to.stars) - D.power(def, r.from.level, r.from.stars); }, 0);
    const stars = list.reduce((a, r) => a + r.to.stars - r.from.stars, 0);
    const m = openModal(`<div class="pa-report">
      <div class="pa-head"><p class="eyebrow">Promotion report</p><h2>${list.length} card${list.length === 1 ? '' : 's'} promoted</h2>
        <div class="pa-sum"><span><b>+${stars}</b> stars</span><span><b>+${fmt(totalUp)}</b> power</span></div></div>
      <div class="pa-list" data-pa-list>${list.map((r, i) => {
        const def = D.UNIT_MAP[r.id];
        const a = statsOf(def, r.from.level, r.from.stars);
        const b = statsOf(def, r.to.level, r.to.stars);
        // Each stat is a little counter window: the old number rolls up and
        // out as the new one rolls in, then the gain lights up beside it.
        return `<div class="pa-row rarity-${def.rarity}" data-pa-row style="--d:${Math.min(i, 3) * 120}ms">
          <i class="pa-beam" aria-hidden="true"></i>
          <div class="pa-card"><div class="pa-spin" data-pa-art="${r.id}"></div>
            <span class="pa-stars" aria-label="${r.from.stars} to ${r.to.stars} stars">${Array.from({ length: r.to.stars }, (_, k) => `<i class="${k >= r.from.stars ? 'new' : ''}" style="--k:${Math.max(0, k - r.from.stars)}">★</i>`).join('')}</span></div>
          <div class="pa-body"><b class="pa-name">${esc(def.name)}</b><span class="pa-rank">${r.from.stars}★ <em>▶</em> ${r.to.stars}★ · Lv ${r.to.level}</span>
            <div class="pa-stats">${STATS.map(([k, l], j) => `<div class="pa-st" style="--j:${j}"><span class="pa-l">${l}</span><span class="pa-roll"><span class="o">${fmt(a[k])}</span><span class="n">${fmt(b[k])}</span></span><span class="pa-up">▲ ${fmt(b[k] - a[k])}</span></div>`).join('')}</div>
          </div></div>`;
      }).join('')}</div>
      <div class="modal-actions"><button class="btn" type="button" data-pa-skip>Show all</button><button class="btn btn-primary" type="button" data-pa-done>Done</button></div>
    </div>`, { cls: 'pa-modal' });
    const rows = [...m.root.querySelectorAll('[data-pa-row]')];
    // Card pictures are drawn only as their rows come near the screen, so a
    // report with dozens of cards opens instantly.
    const art = (row) => { const a = row.querySelector('[data-pa-art]'); if (a && !a.firstChild) a.innerHTML = portrait(D.UNIT_MAP[a.dataset.paArt], { plate: false }); };
    if ('IntersectionObserver' in root) {
      const ao = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { art(e.target); ao.unobserve(e.target); } }), { root: m.root.querySelector('[data-pa-list]'), rootMargin: '400px 0px' });
      rows.forEach((r) => ao.observe(r));
    } else rows.forEach(art);
    const play = (row) => { row.classList.add('go'); };
    if (!motionOK() || !('IntersectionObserver' in root)) rows.forEach((r) => r.classList.add('go', 'done'));
    else {
      // Rows play as they scroll into view, so a long report stays light.
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { play(e.target); io.unobserve(e.target); } }), { root: m.root.querySelector('[data-pa-list]'), threshold: 0.35 });
      rows.forEach((r) => io.observe(r));
    }
    if (root.Sound) root.Sound.play('rankup');
    m.root.addEventListener('click', (e) => {
      if (e.target.closest('[data-pa-skip]')) rows.forEach((r) => r.classList.add('go', 'done'));
      if (e.target.closest('[data-pa-done]')) { m.close(); UI.App.refresh(); }
    });
  }

  function promoteButton(v) {
    if (!on() || !v || v.querySelector('[data-pa]')) return;
    const head = v.querySelector('.view-head');
    if (!head) return;
    const lvl = Player.state.account.level;
    const n = ready().length;
    const locked = lvl < PROMOTE_LEVEL;
    head.insertAdjacentHTML('beforeend', `<button class="btn pa-btn ${n && !locked ? 'ready' : ''}" type="button" data-pa ${!n || locked ? 'disabled' : ''} title="${locked ? `Unlocks at account level ${PROMOTE_LEVEL}` : n ? `Promote every card with a full shard bar (${n})` : 'No cards have a full shard bar yet'}">${locked ? `🔒 Promote all · Lv ${PROMOTE_LEVEL}` : `★ Promote all${n ? ` <b>${n}</b>` : ''}`}</button>`);
    v.addEventListener('click', (e) => {
      if (!e.target.closest('[data-pa]')) return;
      e.stopPropagation();
      const list = promoteAll();
      if (!list.length) return toast('No cards are ready to promote.');
      report(list);
    }, true);
  }
  const S = UI.Screens;
  if (S && S.collection && !S.__pv25) {
    S.__pv25 = true;
    const col = S.collection;
    S.collection = function () { const v = col.apply(this, arguments); promoteButton(v); return v; };
  }

  // ---------- Buy several Chance Cubes / Loaded Dice ----------
  const QMAX = 999;
  function picker(charm) {
    const costKey = Object.keys(charm.cost)[0];
    const unit = charm.cost[costKey];
    const have = () => (costKey === 'crystals' ? Player.state.crystals : costKey === 'aurodium' ? Player.state.aurodium : Player.state.credits);
    const max = () => Math.max(0, Math.min(QMAX, Math.floor(have() / unit)));
    const per = Object.values(charm.grants)[0];
    let n = Math.min(1, max()) || 1;
    const m = openModal(`<div class="qp no-fx">
      <p class="eyebrow">Black Market</p><h2>${esc(charm.name)}</h2><p class="muted">${esc(charm.desc)}</p>
      <div class="qp-row" role="group" aria-label="How many to buy">
        <button class="btn" type="button" data-q="-10">−10</button><button class="btn" type="button" data-q="-1">−1</button>
        <input class="qp-in" id="qp-n" type="text" inputmode="numeric" maxlength="3" autocomplete="off" aria-label="Amount" data-qn>
        <button class="btn" type="button" data-q="1">+1</button><button class="btn" type="button" data-q="10">+10</button>
        <button class="btn qp-max" type="button" data-q="max">Max</button>
      </div>
      <p class="qp-sum" data-qs></p>
      <div class="modal-actions"><button class="btn" type="button" data-qx>Cancel</button><button class="btn btn-primary" type="button" data-qbuy></button></div>
    </div>`, { small: true, cls: 'qp-modal' });
    const inp = m.root.querySelector('[data-qn]');
    const draw = () => {
      n = Math.max(1, Math.min(QMAX, n));
      inp.value = String(n);
      const can = n <= max();
      const cost = UI.cur ? UI.cur(costKey, n * unit) : fmt(n * unit);
      m.root.querySelector('[data-qs]').innerHTML = `${n} × ${esc(charm.name)} = <b>${n * per}</b> ${charm.grants.charmCrates ? 'boosted crates' : 'lucky spins'} · ${cost}${can ? '' : ' <span class="qp-short">Not enough</span>'}`;
      const b = m.root.querySelector('[data-qbuy]');
      b.disabled = !can;
      b.textContent = `Buy ${n}`;
    };
    m.root.addEventListener('click', (e) => {
      const q = e.target.closest('[data-q]');
      if (q) { n = q.dataset.q === 'max' ? Math.max(1, max()) : n + Number(q.dataset.q); return draw(); }
      if (e.target.closest('[data-qx]')) return m.close();
      if (e.target.closest('[data-qbuy]')) {
        let got = 0;
        while (got < n && Player.buyCharm(charm.id)) got += 1;
        m.close();
        if (got) { toast(`${got} × ${charm.name} active!`); UI.updateWallet && UI.updateWallet(); UI.App.refresh(); }
      }
    });
    inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, ''); });
    inp.addEventListener('change', () => { n = Number(inp.value) || 1; draw(); });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { n = Number(inp.value) || 1; draw(); } });
    draw();
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('click', (e) => {
      const c = on() && e.target.closest && e.target.closest('[data-charm]');
      if (!c || c.disabled) return;
      const charm = D.CHARMS.find((x) => x.id === c.dataset.charm);
      if (!charm) return;
      e.stopPropagation();
      e.preventDefault();
      picker(charm);
    }, true);
  }

  root.Preview25 = { on, promoteAll, ready, report, openIntel, PROMOTE_LEVEL };
})(window);
