// Battle screen: renders the field over a living planet backdrop, takes
// player input (mouse, touch or keyboard) and plays engine events back as
// animations. Every ultimate has a signature cinematic ("super move").

(function (root) {
  const D = root.GameData;
  const Player = root.Player;
  const { $, $$, el, esc, fmt, cur, portrait, toast, openModal, confirmBox, updateWallet, App } = root.UI;

  const PREF_KEY = 'swcg-battle-prefs';
  function loadPrefs() {
    try {
      return JSON.parse(localStorage.getItem(PREF_KEY)) || {};
    } catch (e) {
      return {};
    }
  }
  function savePrefs(p) {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(p));
    } catch (e) {
      // Preferences are a convenience only.
    }
  }

  const reducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BOLT = { light: '#ff3b3b', dark: '#3bff6a' };
  const SABER = { light: '#5ab4ff', dark: '#ff2a2a' };
  const rand = (a, b) => a + Math.random() * (b - a);

  const BattleUI = {
    battle: null,
    prefs: loadPrefs(),

    get speed() {
      return this.prefs.speed || 1;
    },

    wait(ms) {
      return new Promise((r) => setTimeout(r, ms / this.speed));
    },

    async start(params) {
      const enc = Player.encounter(params);
      const squad = Player.squadEntries(enc.kind);
      if (!squad.length) return toast('Pick at least one unit for your squad.');
      this.params = params;
      this.enc = enc;
      this.kind = enc.kind;
      this.ended = false;
      this.pending = null;
      this.planetId = enc.planet;
      this.battle = new root.Battle(
        squad,
        enc.enemies.map((id) => ({ id, level: enc.level, stars: enc.stars || 1 })),
        null,
        { planet: enc.planet, enemyScale: enc.enemyScale },
      );

      App.battleActive = true;
      App.current = 'battle';
      document.body.classList.add('in-battle');
      document.documentElement.style.setProperty('--speed', this.speed);
      this.renderScreen();
      await this.hyperspace();
      if (enc.boss) await this.bossIntro(D.UNIT_MAP[enc.boss]);
      this.log(`Battle begins: ${enc.name}!`, 'ult');
      const planet = D.PLANET_MAP[this.planetId];
      if (planet) this.log(`${planet.name}: ${planet.terrain.name}. ${planet.hazard.name} every ${planet.hazard.every} turns.`, 'hazard');
      if (!this.prefs.seenKeys && window.matchMedia('(hover: hover)').matches) {
        this.prefs.seenKeys = true;
        savePrefs(this.prefs);
        toast('PC controls: 1–5 abilities, ←/→ target, Enter to attack, ? for help');
      }
      this.loop();
    },

    // ---------- Rendering ----------
    renderScreen() {
      const b = this.battle;
      const ships = this.kind === 'ship';
      // Squad bonuses sit at the edge of the field; tap one to drop down what it does.
      const chips = (list, side) => (list.length ? `<span class="syn-label">${side === 'enemy' ? '☠ Enemy bonuses' : '★ Your bonuses'}</span>` : '')
        + list.map((x, i) => `<button type="button" class="syn-chip ${x.kind}" data-chip="${side}:${i}" aria-expanded="false">${x.icon} ${esc(x.name)}${x.need ? ` <em>${x.count}/${x.need}</em>` : ''} <span class="chev">▾</span></button>`).join('');
      const view = el(`<section class="battle ${this.enc.boss ? 'boss-fight' : ''} env-${ships ? 'space' : (D.PLANET_MAP[this.planetId] || {}).env}">
        <div class="battle-top">
          <h2>${esc(this.enc.name)}</h2>
          <div class="turn-order" data-order></div>
          <span class="spacer"></span>
          <button class="btn btn-small" type="button" data-help title="Keyboard controls (?)">⌨</button>
          <button class="btn btn-small toggle" type="button" data-auto title="Let the AI play your turns (A)">Auto</button>
          <button class="btn btn-small" type="button" data-speed title="Animation speed (F)">${this.speed}×</button>
          <button class="btn btn-small btn-danger" type="button" data-retreat>Retreat</button>
        </div>
        <div class="field ${ships ? 'ships' : 'ground'}" data-field>
          <canvas class="env-canvas" data-env></canvas>
          <div class="syn-row enemy">${chips(b.bonuses.enemy, 'enemy')}</div>
          <div class="row enemy-row" data-row="enemy"></div>
          <div class="midline">${ships ? 'Engagement zone' : 'Battlefield'}</div>
          <div class="row player-row" data-row="player"></div>
          <div class="syn-row player">${chips(b.bonuses.player, 'player')}</div>
          <div class="fx-layer" data-fx></div>
        </div>
        <div class="action-bar">
          <div class="actions" data-actions></div>
          <div class="battle-log" data-log></div>
        </div>
      </section>`);
      this.view = view;
      this.field = $('[data-field]', view);
      this.fx = $('[data-fx]', view);
      this.cards = {};
      for (const u of b.units) {
        const card = el(`<div class="bcard ${u.side} ${u.def.kind} ${u.boss ? 'boss' : ''}" data-uid="${u.uid}" style="--bob:${(u.index * 0.37).toFixed(2)}s">
          <span class="blevel">${u.boss ? 'BOSS' : 'Lv ' + u.level}</span>
          <div class="statuses"></div>
          ${portrait(u.def)}
          <div class="bars">
            <div class="bar hp"><i class="lag"></i><i class="fill"></i></div>
            <div class="hp-num"><span data-hp></span><span>${fmt(u.maxHp)}</span></div>
            <div class="bar tm" title="Turn meter"><i></i></div>
            <div class="bar ult" title="Ultimate charge"><i></i></div>
          </div>
        </div>`);
        this.cards[u.uid] = card;
        $(`[data-row="${u.side}"]`, view).appendChild(card);
      }
      $('[data-auto]', view).classList.toggle('on', !!this.prefs.auto);

      view.addEventListener('click', (e) => this.onClick(e));
      document.addEventListener('keydown', this.onKey);

      const screen = $('#screen');
      screen.innerHTML = '';
      screen.appendChild(view);
      $$('.main-nav button').forEach((btn) => btn.classList.toggle('active', btn.dataset.nav === 'home'));
      this.env = new root.Env($('[data-env]', view), this.planetId || 'tatooine', ships ? 'space' : 'ground');
      this.updateAll();
      this.renderActions(null);
    },

    updateCard(u) {
      const card = this.cards[u.uid];
      if (!card) return;
      const pct = (u.hp / u.maxHp) * 100;
      const hpBar = $('.bar.hp', card);
      $('.fill', hpBar).style.width = pct + '%';
      $('.lag', hpBar).style.width = pct + '%';
      hpBar.classList.toggle('mid', pct <= 50 && pct > 25);
      hpBar.classList.toggle('low', pct <= 25);
      $('[data-hp]', card).textContent = fmt(u.hp);
      $('.bar.tm i', card).style.width = Math.min(100, u.tm) + '%';
      $('.bar.ult i', card).style.width = u.ult + '%';
      $('.bar.ult', card).classList.toggle('full', u.ult >= 100);
      const st = $('.statuses', card);
      const want = Object.keys(u.statuses);
      const have = $$('span', st).map((s) => s.dataset.s);
      if (want.join() !== have.join()) {
        st.innerHTML = want.map((k) => {
          const info = D.STATUS_INFO[k];
          const turns = u.statuses[k] > 50 ? '∞' : u.statuses[k];
          return `<span data-s="${k}" class="${info.kind}" title="${info.label} (${turns}): ${info.desc}">${info.icon}</span>`;
        }).join('');
      }
      card.classList.toggle('ko', !u.alive);
      card.classList.toggle('enraged', !!u.enraged && u.alive);
      card.classList.toggle('shielded', !!u.statuses.defUp && u.def.kind === 'ship');
    },

    updateAll() {
      for (const u of this.battle.units) this.updateCard(u);
    },

    updateTurnOrder() {
      const order = this.battle.predictOrder(7);
      $('[data-order]', this.view).innerHTML = '<span class="label">Next</span>' + order.map((uid) => {
        const u = this.battle.get(uid);
        return `<span class="to-chip ${u.side}" title="${esc(u.def.name)}">${portrait(u.def, { plate: false })}</span>`;
      }).join('');
    },

    // Small class-flavored pop when a unit's turn comes up (never covers the screen).
    turnFlourish(u) {
      const card = this.cards[u.uid];
      if (!card || reducedMotion()) return;
      const cls = D.classesOf(u.def);
      let type = 'default';
      let color = u.side === 'player' ? '#ffd23f' : '#ff5a5a';
      if (u.boss) { type = 'boss'; color = '#ff2a2a'; }
      else if ((D.TRAITS[u.def.id] || []).includes('inquisitor')) { type = 'inquisitor'; color = '#ff2a2a'; }
      else if (u.def.kind === 'ship') { type = 'ship'; color = u.def.faction === 'light' ? '#8fd3ff' : '#8affb0'; }
      else if (cls.includes('force')) { type = 'force'; color = u.def.accent || SABER[u.def.faction]; }
      else if (cls.includes('droid')) { type = 'droid'; color = '#ffb03a'; }
      else if (cls.includes('healer')) { type = 'healer'; color = '#52e08a'; }
      else if (cls.includes('tank')) { type = 'tank'; color = '#8fd3ff'; }
      const fx = el(`<span class="turn-fx ${type}" style="--tc:${color}" aria-hidden="true"></span>`);
      card.appendChild(fx);
      setTimeout(() => fx.remove(), 1000);
      card.animate([{ scale: '1' }, { scale: '1.08', offset: 0.35 }, { scale: '1' }], { duration: 420, easing: 'cubic-bezier(.3,1.6,.5,1)' });
      const c = this.center(u.uid);
      this.env.light(c.x, c.y, color, 90, 0.5);
    },

    setActive(actor) {
      Object.values(this.cards).forEach((c) => c.classList.remove('active'));
      if (actor) this.cards[actor.uid].classList.add('active');
    },

    log(text, cls) {
      const logEl = $('[data-log]', this.view);
      if (!logEl) return;
      logEl.insertAdjacentHTML('afterbegin', `<p class="${cls || ''}">${esc(text)}</p>`);
      while (logEl.children.length > 60) logEl.lastElementChild.remove();
    },

    renderActions(actor, mode) {
      const box = $('[data-actions]', this.view);
      if (!actor) {
        box.innerHTML = '<div class="waiting" style="grid-column:1/-1">Preparing for battle…</div>';
        return;
      }
      const chip = `<div class="actor-chip">${portrait(actor.def, { plate: false })}</div>`;
      if (mode !== 'input') {
        const who = actor.side === 'enemy' ? 'Enemy turn' : 'Auto battle';
        box.innerHTML = `${chip}<div class="actions-main"><div class="actions-title"><b>${esc(actor.def.name)}</b><span class="muted">${who}</span></div><div class="waiting"><span class="dot"></span>${actor.side === 'enemy' ? 'The enemy is choosing an action…' : 'Your squad is fighting on its own.'}</div></div>`;
        return;
      }
      const b = this.battle;
      const buttons = actor.abilities.map((ab, i) => {
        const ready = b.isReady(actor, i);
        const cd = actor.cooldowns[i];
        const ult = ab.ultimate;
        return `<button class="abtn ${ult ? 'ult' : ''} ${ult && ready ? 'ready' : ''} ${i === this.selected ? 'selected' : ''}" type="button" data-ab="${i}" ${ready ? '' : 'disabled'} title="${esc(ab.desc)}">
          <kbd>${ult ? 'R' : i + 1}</kbd>
          <span class="an">${ult ? '★ ' : ''}${esc(ab.name)}</span>
          <span class="ad">${esc(ab.desc)}</span>
          ${!ult && !ready ? `<span class="acd">${cd}</span>` : ''}
          ${ult ? `<span class="ult-fill" style="width:${actor.ult}%"></span>` : ''}
        </button>`;
      }).join('');
      const ab = actor.abilities[this.selected];
      const hint = b.needsTarget(actor, this.selected) ? 'Tap a highlighted enemy, or ←/→ then Enter.'
        : ab.target === 'allEnemies' ? 'Tap any enemy (or Enter) to hit them all.'
          : ab.target === 'allAllies' ? 'Tap any ally (or Enter) to use it on your whole squad.'
            : 'Tap your unit (or Enter) to use it.';
      box.innerHTML = `${chip}<div class="actions-main">
        <div class="actions-title"><b>${esc(actor.def.name)}</b><span class="muted">Your turn</span></div>
        <div class="ability-buttons">${buttons}</div>
        <div class="hint">${hint}</div>
      </div>`;
    },

    targetsFor(actor, index) {
      const b = this.battle;
      const ab = actor.abilities[index];
      if (b.needsTarget(actor, index)) return b.validTargets(actor, index);
      if (ab.target === 'allEnemies') return b.opponents(actor);
      if (ab.target === 'allAllies') return b.allies(actor);
      return [actor];
    },

    highlightTargets(actor) {
      this.clearTargets();
      const list = this.targetsFor(actor, this.selected);
      for (const t of list) {
        const c = this.cards[t.uid];
        c.classList.add('targetable');
        if (t.side === actor.side) c.classList.add('friendly');
      }
      if (!list.some((t) => t.uid === this.focusUid)) {
        const sorted = [...list].sort((a, b2) => a.hp / a.maxHp - b2.hp / b2.maxHp);
        this.focusUid = sorted[0] && sorted[0].uid;
      }
      this.showFocus();
    },

    showFocus() {
      Object.values(this.cards).forEach((c) => c.classList.remove('kbd-focus'));
      if (this.pending && this.focusUid && this.cards[this.focusUid]) this.cards[this.focusUid].classList.add('kbd-focus');
    },

    clearTargets() {
      Object.values(this.cards).forEach((c) => c.classList.remove('targetable', 'friendly', 'kbd-focus'));
    },

    // ---------- Input ----------
    awaitPlayer(actor) {
      return new Promise((resolve) => {
        this.pending = { actor, resolve };
        const ult = actor.abilities.length - 1;
        this.selected = this.battle.isReady(actor, ult) ? ult : 0;
        this.renderActions(actor, 'input');
        this.highlightTargets(actor);
      });
    },

    resolvePending(action) {
      if (!this.pending) return;
      const { resolve } = this.pending;
      this.pending = null;
      this.clearTargets();
      resolve(action);
    },

    selectAbility(i) {
      const p = this.pending;
      if (!p || !this.battle.isReady(p.actor, i)) return false;
      this.selected = i;
      this.renderActions(p.actor, 'input');
      this.highlightTargets(p.actor);
      return true;
    },

    fireAt(uid) {
      if (!this.pending) return;
      const { actor } = this.pending;
      const valid = this.targetsFor(actor, this.selected).map((t) => t.uid);
      const target = valid.includes(uid) ? uid : valid[0];
      if (!target) return;
      this.resolvePending({ abilityIndex: this.selected, targetUid: this.battle.needsTarget(actor, this.selected) ? target : null });
    },

    cycleFocus(dir) {
      if (!this.pending) return;
      const list = this.targetsFor(this.pending.actor, this.selected)
        .sort((a, b) => this.cards[a.uid].getBoundingClientRect().left - this.cards[b.uid].getBoundingClientRect().left);
      if (!list.length) return;
      const i = Math.max(0, list.findIndex((t) => t.uid === this.focusUid));
      this.focusUid = list[(i + dir + list.length) % list.length].uid;
      this.showFocus();
    },

    toggleHelp() {
      const open = $('.keys-help');
      if (open) return open.remove();
      const h = el(`<div class="keys-help" role="dialog" aria-label="Keyboard controls">
        <h3>Keyboard controls</h3>
        <dl>
          <div><dt><kbd>1</kbd>–<kbd>5</kbd></dt><dd>Pick an ability (press again to fire)</dd></div>
          <div><dt><kbd>R</kbd></dt><dd>Pick the ultimate</dd></div>
          <div><dt><kbd>←</kbd><kbd>→</kbd> / <kbd>Q</kbd><kbd>E</kbd> / <kbd>Tab</kbd></dt><dd>Move between targets</dd></div>
          <div><dt><kbd>Enter</kbd> / <kbd>Space</kbd></dt><dd>Attack the focused target</dd></div>
          <div><dt><kbd>A</kbd></dt><dd>Toggle auto battle</dd></div>
          <div><dt><kbd>F</kbd></dt><dd>Change speed</dd></div>
          <div><dt><kbd>?</kbd> / <kbd>H</kbd></dt><dd>Show or hide this help</dd></div>
        </dl>
        <button class="btn btn-small" type="button">Close</button>
      </div>`);
      h.querySelector('button').addEventListener('click', () => h.remove());
      document.body.appendChild(h);
    },

    onKey: (e) => {
      const self = BattleUI;
      if (!App.battleActive || e.target.closest('input, textarea') || $('.modal-backdrop')) return;
      const k = e.key;
      if (k === '?' || k === 'h' || k === 'H') return self.toggleHelp();
      if (k === 'Escape' && $('.keys-help')) return $('.keys-help').remove();
      if (k === 'a' || k === 'A') return self.toggleAuto();
      if (k === 'f' || k === 'F') return self.cycleSpeed();
      if (!self.pending) return;
      const n = Number(k);
      const abilities = self.pending.actor.abilities;
      if (n >= 1 && n <= abilities.length) {
        e.preventDefault();
        if (self.selected === n - 1 && self.battle.isReady(self.pending.actor, n - 1)) return self.fireAt(self.focusUid);
        return self.selectAbility(n - 1);
      }
      if (k === 'r' || k === 'R') {
        const u = abilities.length - 1;
        if (self.selected === u && self.battle.isReady(self.pending.actor, u)) return self.fireAt(self.focusUid);
        return self.selectAbility(u);
      }
      if (k === 'ArrowRight' || k === 'e' || k === 'E' || (k === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        return self.cycleFocus(1);
      }
      if (k === 'ArrowLeft' || k === 'q' || k === 'Q' || (k === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        return self.cycleFocus(-1);
      }
      if (k === 'Enter' || k === ' ') {
        e.preventDefault();
        return self.fireAt(self.focusUid);
      }
    },

    toggleAuto() {
      this.prefs.auto = !this.prefs.auto;
      savePrefs(this.prefs);
      const btn = $('[data-auto]', this.view);
      if (btn) btn.classList.toggle('on', this.prefs.auto);
      if (this.prefs.auto && this.pending) {
        const actor = this.pending.actor;
        this.renderActions(actor);
        this.resolvePending(this.battle.chooseAction(actor));
      }
    },

    cycleSpeed() {
      this.prefs.speed = this.speed >= 3 ? 1 : this.speed + 1;
      savePrefs(this.prefs);
      document.documentElement.style.setProperty('--speed', this.speed);
      const btn = $('[data-speed]', this.view);
      if (btn) btn.textContent = `${this.speed}×`;
    },

    toggleChip(btn) {
      const open = btn.getAttribute('aria-expanded') === 'true';
      $$('.chip-pop', this.view).forEach((n) => n.remove());
      $$('[data-chip]', this.view).forEach((c) => c.setAttribute('aria-expanded', 'false'));
      if (open) return;
      const [side, i] = btn.dataset.chip.split(':');
      const x = this.battle.bonuses[side][Number(i)];
      if (!x) return;
      const units = (x.members || []).map((m) => this.battle.units.filter((u) => u.side === side)[m]).filter(Boolean);
      const pop = el(`<div class="chip-pop ${side}" role="tooltip">
        <b>${x.icon} ${esc(x.name)}</b>${x.need ? `<span class="chip-tier">${x.count}/${x.need}${x.tier != null ? ` · Tier ${x.tier + 1}` : ''}</span>` : ''}
        <p>${esc(x.desc)}</p>
        ${units.length ? `<div class="chip-units">${units.map((u) => `<span>${esc(u.def.name)}</span>`).join('')}</div>` : ''}
      </div>`);
      btn.setAttribute('aria-expanded', 'true');
      const fr = this.field.getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      pop.style.left = Math.max(8, Math.min(fr.width - 268, br.left - fr.left + br.width / 2 - 130)) + 'px';
      if (side === 'enemy') pop.style.top = (br.bottom - fr.top + 6) + 'px';
      else pop.style.bottom = (fr.bottom - br.top + 6) + 'px';
      this.field.appendChild(pop);
    },

    async onClick(e) {
      const chip = e.target.closest('[data-chip]');
      if (chip) return this.toggleChip(chip);
      if (!e.target.closest('.chip-pop')) $$('.chip-pop', this.view).forEach((n) => { n.remove(); $$('[data-chip]', this.view).forEach((c) => c.setAttribute('aria-expanded', 'false')); });
      const abBtn = e.target.closest('[data-ab]');
      if (abBtn) return this.selectAbility(Number(abBtn.dataset.ab));
      const card = e.target.closest('.bcard.targetable');
      if (card && this.pending) return this.fireAt(card.dataset.uid);
      if (e.target.closest('[data-auto]')) return this.toggleAuto();
      if (e.target.closest('[data-speed]')) return this.cycleSpeed();
      if (e.target.closest('[data-help]')) return this.toggleHelp();
      if (e.target.closest('[data-retreat]')) {
        if (await confirmBox('Retreat from battle?', 'This counts as a defeat. You keep everything you already own.', 'Retreat')) {
          this.ended = true;
          this.resolvePending(null);
          Player.completeEncounter(this.params, false);
          this.teardown();
          App.go('campaign');
        }
      }
    },

    // ---------- Main loop ----------
    async loop() {
      const b = this.battle;
      // Bail out if a newer battle replaced this one while we were awaiting.
      const stale = () => this.ended || this.battle !== b;
      while (!stale()) {
        let w = b.winner();
        if (w) return this.finish(w);
        const hz = b.tickHazard();
        if (hz) {
          await this.play(hz);
          if (stale()) return;
          w = b.winner();
          if (w) return this.finish(w);
        }
        const actor = b.advance();
        if (!actor) return this.finish(b.winner() || 'enemy');
        this.setActive(actor);
        this.turnFlourish(actor);
        this.updateTurnOrder();
        this.updateAll();
        const { events, skipped } = b.beginTurn(actor);
        await this.play(events);
        if (stale()) return;
        if (skipped || b.winner()) continue;

        let action;
        if (actor.side === 'player' && !this.prefs.auto) {
          action = await this.awaitPlayer(actor);
        } else {
          this.renderActions(actor);
          await this.wait(actor.side === 'enemy' ? 650 : 380);
          action = b.chooseAction(actor);
        }
        if (stale() || !action) return;
        this.renderActions(actor);
        const evs = b.act(actor, action.abilityIndex, action.targetUid);
        await this.play(evs);
      }
    },

    // ---------- Event playback ----------
    async play(events) {
      let aoe = false;
      const battle = this.battle;
      for (const ev of events) {
        if (this.ended || this.battle !== battle) return;
        const u = ev.uid ? this.battle.get(ev.uid) : null;
        if (ev.uid && !u) continue;
        switch (ev.type) {
          case 'use':
            aoe = ev.aoe;
            await this.animateUse(ev);
            break;
          case 'damage':
            this.hit(u, ev);
            await this.wait(ev.source === 'burn' || ev.source === 'hazard' ? 300 : aoe ? 90 : 260);
            break;
          case 'heal':
            this.float(u, `+${fmt(ev.amount)}`, 'heal', ev.source ? 20 : 0);
            this.flash(u, 'flash-heal');
            this.updateCard(u);
            if (!ev.source) this.env.light(this.center(u.uid).x, this.center(u.uid).y, '#52e08a', 70, 0.5);
            await this.wait(ev.source ? 60 : aoe ? 90 : 220);
            break;
          case 'status':
            this.float(u, D.STATUS_INFO[ev.status].label, D.STATUS_INFO[ev.status].kind === 'buff' ? 'info' : 'bad', 18);
            this.updateCard(u);
            await this.wait(100);
            break;
          case 'resist':
            this.float(u, ev.immune ? 'IMMUNE' : 'Resisted', 'info', 18);
            await this.wait(80);
            break;
          case 'double':
            this.float(u, 'DOUBLE HIT!', 'double');
            this.banner('Double hit!', u.side);
            await this.echoAttack(u, ev.targets.map((id) => this.battle.get(id)));
            break;
          case 'hazard':
            await this.hazard(ev);
            break;
          case 'tm':
            this.updateCard(u);
            break;
          case 'skip':
            this.float(u, 'STUNNED', 'bad');
            await this.wait(650);
            break;
          case 'enrage':
            this.updateCard(u);
            this.float(u, 'ENRAGED!', 'crit');
            this.shake();
            this.env.setMood('#ff2020');
            this.env.blast(this.center(u.uid).x, this.center(u.uid).y, '#ff2a2a', 2);
            await this.wait(700);
            break;
          case 'ko':
            this.updateCard(u);
            this.explode(u);
            this.cards[u.uid].animate([{ transform: 'scale(1)' }, { transform: 'scale(1.1) rotate(-3deg)' }, { transform: 'scale(0.92)' }], { duration: 500 / this.speed });
            await this.wait(u.def.kind === 'ship' ? 650 : 450);
            break;
          case 'log':
            this.log(ev.text, ev.side || '');
            break;
          default:
            if (u) this.updateCard(u);
        }
      }
      if (this.battle !== battle) return;
      this.updateAll();
      this.updateTurnOrder();
      await this.wait(240);
    },

    async hazard(ev) {
      const planet = D.PLANET_MAP[this.planetId];
      const node = el(`<div class="hazard-banner"><span>⚠ ${esc(planet ? planet.name : '')}</span><b>${esc(ev.name)}</b></div>`);
      this.field.appendChild(node);
      this.env.hazard(ev.id);
      this.shake();
      await this.wait(1400);
      node.remove();
    },

    // Field-relative center of a card (for fx layer and the environment canvas).
    center(uid) {
      const fr = this.field.getBoundingClientRect();
      if (!this.cards[uid]) return { x: fr.width / 2, y: fr.height / 2 };
      const r = this.cards[uid].getBoundingClientRect();
      return { x: r.left - fr.left + r.width / 2, y: r.top - fr.top + r.height / 2 };
    },

    // Viewport center of a card (for full-screen cinematics).
    vp(uid) {
      if (!this.cards[uid]) return { x: window.innerWidth / 2, y: window.innerHeight / 2, w: 0, h: 0 };
      const r = this.cards[uid].getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
    },

    toField(p) {
      const fr = this.field.getBoundingClientRect();
      return { x: p.x - fr.left, y: p.y - fr.top };
    },

    shake() {
      this.field.classList.remove('shake');
      void this.field.offsetWidth;
      this.field.classList.add('shake');
    },

    banner(text, side) {
      const b = el(`<div class="ability-banner ${side}">${esc(text)}</div>`);
      this.fx.appendChild(b);
      setTimeout(() => b.remove(), 1000 / this.speed);
    },

    async animateUse(ev) {
      const actor = this.battle.get(ev.uid);
      const ab = actor.abilities[ev.abilityIndex];
      const card = this.cards[actor.uid];
      const targets = ev.targets.map((uid) => this.battle.get(uid));
      if (ev.ultimate) {
        this.log(`★ ${actor.def.name} unleashes ${ab.name}!`, 'ult');
        const color = actor.def.faction === 'light' ? '#5ab4ff' : '#ff3a3a';
        this.env.charge(color);
        await this.cutscene(actor, ab);
        const anim = D.ULT_ANIM[actor.id] || this.defaultAnim(actor);
        await this.superMove(anim, actor, targets, ev);
        this.env.release();
        this.shake();
        return;
      }
      if (ev.abilityIndex > 0) this.banner(ab.name, actor.side);
      const motion = !reducedMotion();

      if (!ev.offensive) {
        if (motion) card.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.8) drop-shadow(0 0 16px #52e08a)' }, { filter: 'brightness(1)' }], { duration: 500 / this.speed });
        for (const t of targets) {
          const c = this.center(t.uid);
          this.wave(c, actor.side === 'player' ? '#52e08a' : '#ffb46b');
          this.env.light(c.x, c.y, '#52e08a', 90, 0.5);
        }
        await this.wait(380);
        return;
      }

      // Force users throw a quick lightning / choke on specials.
      const sig = D.ULT_ANIM[actor.id];
      if (ev.abilityIndex > 0 && sig === 'lightning') return this.lightning(actor, targets, 650);
      if (ev.abilityIndex > 0 && sig === 'choke' && !ev.aoe) return this.choke(actor, targets, 700);

      if (actor.def.kind === 'ship') return this.shipAttack(actor, ab, ev, targets, motion);

      const from = this.center(actor.uid);
      if (ev.aoe) {
        if (motion) card.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 420 / this.speed });
        this.wave(from, actor.def.faction === 'light' ? '#5ab4ff' : '#ff4b4b', actor.boss ? 10 : 7);
        this.env.push(from.x, from.y, 2);
        await this.wait(300);
        return;
      }
      const to = this.center(targets[0].uid);
      const ranged = D.classesOf(actor.def).includes('ranged');
      if (ranged) {
        if (motion) card.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${actor.side === 'player' ? 5 : -5}px)` }, { transform: 'translateY(0)' }], { duration: 220 / this.speed });
        const color = BOLT[actor.def.faction];
        this.flashAt(from, color);
        this.laser(from, to, color, 0);
        if (ev.abilityIndex > 0) this.laser(from, to, color, 90);
        await this.wait(300);
        return;
      }
      if (motion) {
        card.animate([
          { transform: 'translate(0,0) scale(1)' },
          { transform: `translate(${(to.x - from.x) * 0.4}px, ${(to.y - from.y) * 0.4}px) scale(1.1)`, offset: 0.45 },
          { transform: 'translate(0,0) scale(1)' },
        ], { duration: 460 / this.speed, easing: 'cubic-bezier(.3,.7,.3,1)' });
      }
      await this.wait(200);
      this.slash(to, actor.def.accent);
      this.env.impact(to.x, to.y, { power: 0.6, color: actor.def.accent || '#ffffff' });
    },

    // A double hit replays a quick follow-up strike.
    async echoAttack(actor, targets) {
      if (!targets.length) return;
      const from = this.center(actor.uid);
      for (const t of targets) {
        const to = this.center(t.uid);
        if (actor.def.kind === 'ship' || D.classesOf(actor.def).includes('ranged')) this.laser(from, to, BOLT[actor.def.faction], 0);
        else this.slash(to, actor.def.accent || '#fff');
      }
      await this.wait(220);
    },

    defaultAnim(actor) {
      if (actor.def.kind === 'ship') return actor.def.role === 'tank' ? 'shield' : 'strafe';
      if (actor.def.role === 'healer') return 'heal';
      if (actor.def.role === 'tank') return 'bulwark';
      if (actor.def.role === 'support') return 'rally';
      return D.classesOf(actor.def).includes('fighter') ? 'dash' : 'barrage';
    },

    // Space combat: the ship strafes forward, fires with muzzle flashes, and
    // heavy single-target specials launch a torpedo.
    async shipAttack(actor, ab, ev, targets, motion) {
      const card = this.cards[actor.uid];
      const from = this.center(actor.uid);
      const dir = actor.side === 'player' ? -1 : 1;
      const color = BOLT[actor.def.faction];
      const heavy = !ev.aoe && ab.effects.some((e) => e.type === 'damage' && e.mult * (e.hits || 1) >= 1.8);
      const bolts = ab.effects.some((e) => e.hits > 1) ? 4 : 3;
      if (motion) {
        const tx = targets.length === 1 ? (this.center(targets[0].uid).x - from.x) * 0.18 : 0;
        card.animate([
          { transform: 'translate(0,0) rotate(0)' },
          { transform: `translate(${tx}px, ${dir * 26}px) rotate(${tx > 0 ? 6 : tx < 0 ? -6 : 0}deg) scale(1.06)`, offset: 0.35 },
          { transform: `translate(${tx * 0.6}px, ${dir * 18}px) rotate(0)`, offset: 0.7 },
          { transform: 'translate(0,0) rotate(0)' },
        ], { duration: 720 / this.speed, easing: 'cubic-bezier(.3,.7,.3,1)' });
      }
      await this.wait(160);
      const muzzle = { x: from.x, y: from.y + dir * 30 };
      if (heavy) {
        this.flashAt(muzzle, color);
        await this.torpedo(muzzle, this.center(targets[0].uid), actor.def.faction === 'light' ? '#ffb24a' : '#8affb0');
        return;
      }
      targets.forEach((t) => {
        for (let i = 0; i < bolts; i++) {
          const m = { x: muzzle.x + (i % 2 ? 12 : -12), y: muzzle.y };
          setTimeout(() => this.flashAt(m, color), (i * 85) / this.speed);
          this.laser(m, this.center(t.uid), color, i * 85);
        }
      });
      await this.wait(260 + bolts * 60);
    },

    // ---------- Basic effects (field coordinates) ----------
    laser(from, to, color, delay, opts = {}) {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.hypot(dx, dy);
      const ang = Math.atan2(dy, dx);
      const jitter = opts.jitter != null ? opts.jitter : (Math.random() - 0.5) * 14;
      const bolt = el(`<div class="laser ${opts.big ? 'big' : ''}"></div>`);
      const bw = opts.big ? 60 : 38;
      bolt.style.left = from.x + 'px';
      bolt.style.top = from.y + jitter + 'px';
      bolt.style.width = bw + 'px';
      bolt.style.setProperty('--bolt', color);
      bolt.style.opacity = '0';
      this.fx.appendChild(bolt);
      const anim = bolt.animate([
        { transform: `rotate(${ang}rad) translateX(0)`, opacity: 1 },
        { transform: `rotate(${ang}rad) translateX(${Math.max(0, len - bw)}px)`, opacity: 1 },
      ], { duration: (opts.dur || 220) / this.speed, delay: delay / this.speed, easing: 'linear' });
      anim.onfinish = () => {
        bolt.remove();
        const at = { x: to.x, y: to.y + jitter * 0.5 };
        this.sparks(at, color, opts.big ? 10 : 5);
        this.env.impact(at.x, at.y, { power: opts.big ? 1.2 : 0.35, color });
      };
    },

    torpedo(from, to, color, opts = {}) {
      return new Promise((resolve) => {
        const t = el(`<div class="torpedo ${opts.big ? 'big' : ''}"></div>`);
        t.style.setProperty('--glow', color);
        t.style.left = from.x + 'px';
        t.style.top = from.y + 'px';
        this.fx.appendChild(t);
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const bend = opts.bend != null ? opts.bend : (Math.random() - 0.5) * 60;
        const trail = setInterval(() => {
          const r = t.getBoundingClientRect();
          const fr = this.field.getBoundingClientRect();
          const puff = el('<div class="trail"></div>');
          puff.style.left = r.left - fr.left + r.width / 2 + 'px';
          puff.style.top = r.top - fr.top + r.height / 2 + 'px';
          puff.style.setProperty('--glow', color);
          this.fx.appendChild(puff);
          puff.animate([{ transform: 'scale(1)', opacity: 0.8 }, { transform: 'scale(0.2)', opacity: 0 }], { duration: 360 }).onfinish = () => puff.remove();
        }, 30);
        t.animate([
          { transform: 'translate(0,0) scale(.6)' },
          { transform: `translate(${dx * 0.5 + bend}px, ${dy * 0.5 - (opts.arc || 0)}px) scale(1)`, offset: 0.5 },
          { transform: `translate(${dx}px, ${dy}px) scale(1.2)` },
        ], { duration: (opts.dur || 520) / this.speed, easing: opts.easing || 'ease-in' }).onfinish = () => {
          clearInterval(trail);
          t.remove();
          this.boom(to, color, opts.big ? 2 : 1.2);
          resolve();
        };
      });
    },

    flashAt(pos, color) {
      const f = el('<div class="muzzle"></div>');
      f.style.left = pos.x + 'px';
      f.style.top = pos.y + 'px';
      f.style.setProperty('--glow', color);
      this.fx.appendChild(f);
      f.animate([{ transform: 'scale(.3)', opacity: 1 }, { transform: 'scale(1.4)', opacity: 0 }], { duration: 180 / this.speed }).onfinish = () => f.remove();
      this.env.light(pos.x, pos.y, color, 50, 0.15);
    },

    sparks(pos, color, count) {
      if (reducedMotion()) return;
      for (let i = 0; i < count; i++) {
        const s = el('<div class="spark"></div>');
        s.style.left = pos.x + 'px';
        s.style.top = pos.y + 'px';
        s.style.setProperty('--glow', i % 2 ? '#ffd27a' : color);
        this.fx.appendChild(s);
        const a = Math.random() * Math.PI * 2;
        const d = 12 + Math.random() * 26;
        s.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px) scale(.2)`, opacity: 0 }], { duration: (320 + Math.random() * 200) / this.speed, easing: 'ease-out' }).onfinish = () => s.remove();
      }
    },

    boom(pos, color, size) {
      const k = size || 1;
      const ball = el('<div class="fireball"></div>');
      ball.style.left = pos.x + 'px';
      ball.style.top = pos.y + 'px';
      this.fx.appendChild(ball);
      ball.animate([{ transform: 'scale(.2)', opacity: 1 }, { transform: `scale(${1.6 * k})`, opacity: 0.9, offset: 0.4 }, { transform: `scale(${2.2 * k})`, opacity: 0 }], { duration: 620 / this.speed, easing: 'ease-out' }).onfinish = () => ball.remove();
      this.wave(pos, color || '#ffb24a', 2.6 * k);
      this.sparks(pos, '#ff8a3a', Math.round(10 * k));
      this.env.blast(pos.x, pos.y, color || '#ffb24a', 0.8 * k);
    },

    explode(u) {
      const pos = this.center(u.uid);
      if (u.def.kind === 'ship') {
        this.boom(pos, '#ffb24a', u.boss ? 2.4 : 1.4);
        setTimeout(() => this.boom({ x: pos.x + 18, y: pos.y - 12 }, '#ff6a2a', 0.8), 160 / this.speed);
        setTimeout(() => this.boom({ x: pos.x - 16, y: pos.y + 10 }, '#ffd27a', 0.7), 300 / this.speed);
        this.shake();
      } else {
        this.wave(pos, '#8a7a6a', 2);
        this.sparks(pos, '#c9b48a', 6);
        this.env.blast(pos.x, pos.y + 20, '#c9a070', 0.9);
      }
    },

    wave(pos, color, scale) {
      const w = el('<div class="shockwave"></div>');
      w.style.left = pos.x + 'px';
      w.style.top = pos.y + 'px';
      w.style.setProperty('--wave', color);
      this.fx.appendChild(w);
      const s = scale || 3;
      w.animate([{ transform: 'scale(0.2)', opacity: 1 }, { transform: `scale(${s})`, opacity: 0 }], { duration: 520 / this.speed, easing: 'ease-out' }).onfinish = () => w.remove();
    },

    slash(pos, color, rot) {
      const s = el('<div class="slash"></div>');
      s.style.left = pos.x + 'px';
      s.style.top = pos.y + 'px';
      s.style.setProperty('--wave', color || '#fff');
      this.fx.appendChild(s);
      const r = rot != null ? rot : -30 + Math.random() * 20;
      s.animate([
        { transform: `rotate(${r}deg) scaleX(0)`, opacity: 1 },
        { transform: `rotate(${r}deg) scaleX(1.2)`, opacity: 1, offset: 0.4 },
        { transform: `rotate(${r}deg) scaleX(1.4)`, opacity: 0 },
      ], { duration: 320 / this.speed }).onfinish = () => s.remove();
    },

    hit(u, ev) {
      const card = this.cards[u.uid];
      if (!card) return;
      this.updateCard(u);
      if (ev.source === 'burn') this.float(u, `🔥 ${fmt(ev.amount)}`, 'dmg');
      else if (ev.source === 'hazard') this.float(u, `⚠ ${fmt(ev.amount)}`, 'dmg');
      else this.float(u, fmt(ev.amount), ev.crit ? 'crit' : 'dmg');
      this.flash(u, 'flash-hit');
      if (ev.crit) {
        const c = this.center(u.uid);
        this.env.impact(c.x, c.y, { power: 1, color: '#ffd23f' });
      }
      if (u.def.kind === 'ship' && !ev.source) {
        if (u.statuses.defUp) this.flash(u, 'shield-hit');
        this.sparks(this.center(u.uid), '#ffb24a', ev.crit ? 8 : 4);
      }
      if (!reducedMotion()) {
        const k = ev.crit ? 1.8 : 1;
        card.animate([
          { transform: 'translateX(0)' }, { transform: `translateX(${-7 * k}px)` }, { transform: `translateX(${6 * k}px)` },
          { transform: `translateX(${-3 * k}px)` }, { transform: 'translateX(0)' },
        ], { duration: 280 / this.speed });
      }
    },

    flash(u, cls) {
      const card = this.cards[u.uid];
      if (!card) return;
      card.classList.remove(cls);
      void card.offsetWidth;
      card.classList.add(cls);
      setTimeout(() => card.classList.remove(cls), 500);
    },

    float(u, text, cls, offset) {
      const card = this.cards[u.uid];
      if (!card) return;
      const f = el(`<span class="float ${cls}">${esc(text)}</span>`);
      const stack = card.querySelectorAll('.float').length;
      f.style.top = `calc(30% + ${(offset || 0) + stack * 16}px)`;
      card.appendChild(f);
      setTimeout(() => f.remove(), 1200 / this.speed);
    },

    // ---------- Super moves (ultimate cinematics) ----------
    cineLayer() {
      const layer = el('<div class="cine" aria-hidden="true"></div>');
      document.body.appendChild(layer);
      return layer;
    },

    async superMove(anim, actor, targets, ev) {
      if (reducedMotion()) {
        for (const t of targets) this.boom(this.center(t.uid), '#ffd23f', 0.8);
        return this.wait(300);
      }
      const fn = this['sm_' + anim] || this.sm_barrage;
      try {
        await fn.call(this, actor, targets, ev);
      } catch (err) {
        // A missing card mid-animation should never stall the battle.
      }
    },

    // Starfighter swoops across the whole screen spraying laser fire.
    async sm_strafe(actor, targets) {
      const layer = this.cineLayer();
      const W = window.innerWidth;
      const H = window.innerHeight;
      const size = Math.min(W, H) * 0.7;
      const ship = el(`<div class="cine-ship">${root.Art.shipOnly(actor.def)}</div>`);
      ship.style.width = ship.style.height = size + 'px';
      layer.appendChild(ship);
      const player = actor.side === 'player';
      const p0 = player ? { x: W * 0.1, y: H + size } : { x: W * 0.9, y: -size };
      const p1 = player ? { x: W * 0.55, y: H * 0.35 } : { x: W * 0.45, y: H * 0.6 };
      const p2 = player ? { x: W + size, y: -size * 0.6 } : { x: -size, y: H + size * 0.6 };
      const ang = (a, b) => (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90;
      const dur = 1900 / Math.min(this.speed, 2);
      const anim = ship.animate([
        { transform: `translate(${p0.x - size / 2}px, ${p0.y - size / 2}px) rotate(${ang(p0, p1)}deg) scale(.6)` },
        { transform: `translate(${p1.x - size / 2}px, ${p1.y - size / 2}px) rotate(${ang(p0, p2)}deg) scale(1.15)`, offset: 0.5 },
        { transform: `translate(${p2.x - size / 2}px, ${p2.y - size / 2}px) rotate(${ang(p1, p2)}deg) scale(1.5)` },
      ], { duration: dur, easing: 'cubic-bezier(.35,.1,.55,1)' });
      layer.classList.add('speedlines');
      const color = BOLT[actor.def.faction];
      const shots = setInterval(() => {
        const r = ship.getBoundingClientRect();
        const from = this.toField({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
        const t = targets[Math.floor(Math.random() * targets.length)];
        if (!t || !this.cards[t.uid]) return;
        const to = this.center(t.uid);
        this.laser({ x: from.x + rand(-40, 40), y: from.y }, { x: to.x + rand(-20, 20), y: to.y + rand(-20, 20) }, color, 0, { dur: 160 });
      }, 55);
      await new Promise((r) => { anim.onfinish = r; });
      clearInterval(shots);
      layer.remove();
      await this.wait(200);
    },

    // Bomber runs the length of the enemy line, bombs chain-exploding below.
    async sm_bombrun(actor, targets) {
      const layer = this.cineLayer();
      const W = window.innerWidth;
      const size = Math.min(W, window.innerHeight) * 0.42;
      const rowY = targets.length ? this.vp(targets[0].uid).y : window.innerHeight * 0.3;
      const ship = el(`<div class="cine-ship">${root.Art.shipOnly(actor.def)}</div>`);
      ship.style.width = ship.style.height = size + 'px';
      layer.appendChild(ship);
      const seismic = actor.id === 'slave_one';
      const y = rowY - size * 0.9;
      const dur = 1700 / Math.min(this.speed, 2);
      const anim = ship.animate([
        { transform: `translate(${-size}px, ${y}px) rotate(90deg)` },
        { transform: `translate(${W + size}px, ${y - 40}px) rotate(90deg)` },
      ], { duration: dur, easing: 'linear' });
      const ordered = [...targets].sort((a, b) => this.vp(a.uid).x - this.vp(b.uid).x);
      ordered.forEach((t) => {
        const tx = this.vp(t.uid).x;
        const at = ((tx + size) / (W + size * 2)) * dur;
        setTimeout(() => {
          if (!this.cards[t.uid]) return;
          const to = this.center(t.uid);
          const bomb = el(`<div class="bomb ${seismic ? 'seismic' : ''}"></div>`);
          bomb.style.left = to.x + 'px';
          bomb.style.top = to.y + 'px';
          this.fx.appendChild(bomb);
          bomb.animate([{ transform: 'translateY(-160px) scale(.6)' }, { transform: 'translateY(0) scale(1)' }], { duration: 320, easing: 'ease-in' }).onfinish = () => {
            bomb.remove();
            if (seismic) {
              this.wave(to, '#8fd3ff', 9);
              setTimeout(() => this.boom(to, '#8fd3ff', 1.6), 160);
            } else this.boom(to, '#ff9a3a', 1.5);
            this.shake();
          };
        }, at);
      });
      await new Promise((r) => { anim.onfinish = r; });
      layer.remove();
      await this.wait(450);
    },

    // Slow-motion trench-run torpedo with a massive detonation.
    async sm_torpedo(actor, targets) {
      const t = targets[0];
      this.field.classList.add('slowmo');
      const from = this.center(actor.uid);
      const to = this.center(t.uid);
      this.field.style.transformOrigin = `${to.x}px ${to.y}px`;
      this.field.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }], { duration: 1300, fill: 'forwards' });
      await this.torpedo(from, to, '#ffb24a', { big: true, dur: 1300, bend: 0, easing: 'cubic-bezier(.5,0,.8,.6)' });
      this.env.flash('#ffffff', 0.9);
      this.boom(to, '#ffffff', 2.8);
      this.field.getAnimations().forEach((a) => a.cancel());
      this.field.classList.remove('slowmo');
      await this.wait(500);
    },

    // Capital-class ship slides in and unloads a sweeping broadside.
    async sm_broadside(actor, targets) {
      const layer = this.cineLayer();
      const W = window.innerWidth;
      const H = window.innerHeight;
      const size = Math.min(W, H) * 0.55;
      const ship = el(`<div class="cine-ship">${root.Art.shipOnly(actor.def)}</div>`);
      ship.style.width = ship.style.height = size + 'px';
      layer.appendChild(ship);
      const player = actor.side === 'player';
      const y = player ? H * 0.62 - size / 2 : H * 0.2 - size / 2;
      const inX = player ? W * 0.05 : W * 0.95 - size;
      const outX = player ? -size : W;
      await new Promise((r) => {
        ship.animate([{ transform: `translate(${outX}px, ${y}px) rotate(${player ? 30 : 210}deg)` }, { transform: `translate(${inX}px, ${y}px) rotate(${player ? 20 : 200}deg)` }], { duration: 450, easing: 'ease-out', fill: 'forwards' }).onfinish = r;
      });
      const color = BOLT[actor.def.faction];
      for (let i = 0; i < 16; i++) {
        const r = ship.getBoundingClientRect();
        const from = this.toField({ x: r.left + r.width / 2 + rand(-30, 30), y: r.top + r.height / 2 + rand(-30, 30) });
        const t = targets[i % targets.length];
        if (this.cards[t.uid]) this.laser(from, this.center(t.uid), color, 0, { big: i % 4 === 3, dur: 200 });
        await this.wait(80);
      }
      await new Promise((r) => {
        ship.animate([{ transform: `translate(${inX}px, ${y}px) rotate(${player ? 20 : 200}deg)` }, { transform: `translate(${outX}px, ${y - 80}px) rotate(${player ? 0 : 180}deg)` }], { duration: 450, easing: 'ease-in', fill: 'forwards' }).onfinish = r;
      });
      layer.remove();
    },

    // Waves of heavy green turbolaser fire rain from above.
    async sm_turbolaser(actor, targets) {
      for (let wave = 0; wave < 3; wave++) {
        for (const t of targets) {
          if (!this.cards[t.uid]) continue;
          const to = this.center(t.uid);
          this.laser({ x: to.x + rand(-120, 120), y: -40 }, { x: to.x + rand(-15, 15), y: to.y }, '#3bff6a', rand(0, 200), { big: true, dur: 260, jitter: 0 });
        }
        await this.wait(420);
      }
      this.shake();
      await this.wait(300);
    },

    async sm_superlaser(actor, targets) {
      const from = this.center(actor.uid);
      await this.superlaser(from, this.center(targets[0].uid));
    },

    superlaser(from, to) {
      return new Promise((resolve) => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const beam = el('<div class="superlaser"></div>');
        beam.style.left = from.x + 'px';
        beam.style.top = from.y + 'px';
        beam.style.width = Math.hypot(dx, dy) + 'px';
        beam.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
        this.fx.appendChild(beam);
        beam.animate([{ opacity: 0, height: '2px' }, { opacity: 1, height: '22px', offset: 0.3 }, { opacity: 1, height: '16px', offset: 0.8 }, { opacity: 0, height: '2px' }], { duration: 1100 / this.speed }).onfinish = () => {
          beam.remove();
          resolve();
        };
        setTimeout(() => {
          this.boom(to, '#4ade80', 2.6);
          this.env.flash('#4ade80', 0.6);
          this.shake();
        }, 350 / this.speed);
      });
    },

    // Blue energy dome over the whole squad.
    async sm_shield(actor) {
      const allies = this.battle.side(actor.side).filter((u) => u.alive);
      const rects = allies.map((u) => this.cards[u.uid].getBoundingClientRect());
      const layer = this.cineLayer();
      const left = Math.min(...rects.map((r) => r.left)) - 30;
      const right = Math.max(...rects.map((r) => r.right)) + 30;
      const top = Math.min(...rects.map((r) => r.top)) - 40;
      const bottom = Math.max(...rects.map((r) => r.bottom)) + 20;
      const dome = el('<div class="dome"></div>');
      Object.assign(dome.style, { left: left + 'px', top: top + 'px', width: right - left + 'px', height: bottom - top + 'px' });
      layer.appendChild(dome);
      dome.animate([{ transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(1.05)', opacity: 1, offset: 0.4 }, { transform: 'scale(1)', opacity: 0.9, offset: 0.8 }, { transform: 'scale(1)', opacity: 0 }], { duration: 1500 });
      this.env.flash('#8fd3ff', 0.3);
      await this.wait(1500);
      layer.remove();
    },

    // Rapid-fire blaster barrage from the caster.
    async sm_barrage(actor, targets) {
      const from = this.center(actor.uid);
      const card = this.cards[actor.uid];
      const color = BOLT[actor.def.faction];
      const dir = actor.side === 'player' ? 1 : -1;
      for (let i = 0; i < 20; i++) {
        const t = targets[i % targets.length];
        if (!this.cards[t.uid]) continue;
        const m = { x: from.x + rand(-18, 18), y: from.y - dir * 30 };
        this.flashAt(m, color);
        this.laser(m, this.center(t.uid), color, 0, { dur: 170 });
        card.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${dir * 4}px)` }, { transform: 'translateY(0)' }], { duration: 60 });
        await this.wait(55);
      }
      await this.wait(250);
    },

    // Laser sight, a held breath, then one devastating shot.
    async sm_snipe(actor, targets) {
      const t = targets[0];
      const from = this.center(actor.uid);
      const to = this.center(t.uid);
      const sight = el('<div class="sight"></div>');
      sight.style.left = from.x + 'px';
      sight.style.top = from.y + 'px';
      sight.style.width = Math.hypot(to.x - from.x, to.y - from.y) + 'px';
      sight.style.transform = `rotate(${Math.atan2(to.y - from.y, to.x - from.x)}rad)`;
      this.fx.appendChild(sight);
      const reticle = el('<div class="reticle"></div>');
      reticle.style.left = to.x + 'px';
      reticle.style.top = to.y + 'px';
      this.fx.appendChild(reticle);
      this.field.classList.add('slowmo');
      await this.wait(900);
      sight.remove();
      reticle.remove();
      this.laser(from, to, '#ffffff', 0, { big: true, dur: 90, jitter: 0 });
      await this.wait(100);
      this.env.flash('#ffffff', 0.7);
      this.boom(to, '#ffd23f', 2);
      this.field.classList.remove('slowmo');
      await this.wait(400);
    },

    // Swarm of rockets arcing in on every target.
    async sm_rockets(actor, targets) {
      const from = this.center(actor.uid);
      const dir = actor.side === 'player' ? 1 : -1;
      const all = [];
      for (let i = 0; i < 10; i++) {
        const t = targets[i % targets.length];
        if (!this.cards[t.uid]) continue;
        all.push(new Promise((res) => setTimeout(() => {
          if (!this.cards[t.uid]) return res();
          this.torpedo(from, this.center(t.uid), '#ffb24a', { arc: dir * rand(80, 160), bend: rand(-120, 120), dur: 700 }).then(res);
        }, (i * 90) / this.speed)));
      }
      await Promise.all(all);
      await this.wait(200);
    },

    // Targeting reticles lock on, then beams fall from orbit.
    async sm_orbital(actor, targets) {
      const marks = targets.map((t) => {
        const c = this.center(t.uid);
        const r = el('<div class="reticle spin"></div>');
        r.style.left = c.x + 'px';
        r.style.top = c.y + 'px';
        this.fx.appendChild(r);
        return r;
      });
      await this.wait(800);
      marks.forEach((m) => m.remove());
      const layer = this.cineLayer();
      for (const t of targets) {
        if (!this.cards[t.uid]) continue;
        const v = this.vp(t.uid);
        const beam = el('<div class="orbital-beam"></div>');
        beam.style.left = v.x + 'px';
        beam.style.height = v.y + 'px';
        layer.appendChild(beam);
        beam.animate([{ opacity: 0, transform: 'translateX(-50%) scaleX(.2)' }, { opacity: 1, transform: 'translateX(-50%) scaleX(1)', offset: 0.3 }, { opacity: 0, transform: 'translateX(-50%) scaleX(.1)' }], { duration: 700 });
        setTimeout(() => this.boom(this.center(t.uid), '#9fe0ff', 1.6), 200);
        await this.wait(160);
      }
      await this.wait(600);
      layer.remove();
    },

    // Gold command banner sweeps the screen; allies surge.
    async sm_rally(actor) {
      const layer = this.cineLayer();
      const bannerEl = el(`<div class="rally-banner ${actor.def.faction}"><span>${esc(actor.def.name)}</span><b>RALLY</b></div>`);
      layer.appendChild(bannerEl);
      bannerEl.animate([{ transform: 'translateX(-110%) skewX(-12deg)' }, { transform: 'translateX(0) skewX(-12deg)', offset: 0.3 }, { transform: 'translateX(0) skewX(-12deg)', offset: 0.7 }, { transform: 'translateX(110%) skewX(-12deg)' }], { duration: 1400 });
      for (const u of this.battle.side(actor.side).filter((x) => x.alive)) {
        this.cards[u.uid].animate([{ filter: 'none' }, { filter: 'brightness(1.6) drop-shadow(0 0 18px #ffd23f)' }, { filter: 'none' }], { duration: 1100 });
        const c = this.center(u.uid);
        for (let i = 0; i < 3; i++) setTimeout(() => this.chevron(c), i * 180);
      }
      await this.wait(1400);
      layer.remove();
    },

    chevron(c) {
      const ch = el('<div class="chevron">︽</div>');
      ch.style.left = c.x + 'px';
      ch.style.top = c.y + 'px';
      this.fx.appendChild(ch);
      ch.animate([{ transform: 'translate(-50%, 0)', opacity: 1 }, { transform: 'translate(-50%, -60px)', opacity: 0 }], { duration: 700 }).onfinish = () => ch.remove();
    },

    // Pillars of light descend on every ally.
    async sm_heal(actor) {
      const layer = this.cineLayer();
      for (const u of this.battle.side(actor.side).filter((x) => x.alive)) {
        const v = this.vp(u.uid);
        const p = el('<div class="heal-pillar"></div>');
        p.style.left = v.x + 'px';
        p.style.height = v.y + v.h / 2 + 'px';
        layer.appendChild(p);
        p.animate([{ opacity: 0, transform: 'translateX(-50%) scaleY(0)' }, { opacity: 1, transform: 'translateX(-50%) scaleY(1)', offset: 0.4 }, { opacity: 0, transform: 'translateX(-50%) scaleY(1)' }], { duration: 1400, easing: 'ease-out' });
        const c = this.center(u.uid);
        this.env.light(c.x, c.y, '#b8ffcf', 140, 1.2);
        for (let i = 0; i < 6; i++) setTimeout(() => this.sparks(c, '#b8ffcf', 3), i * 120);
      }
      await this.wait(1400);
      layer.remove();
    },

    // A giant shield emblem slams down on the tank.
    async sm_bulwark(actor) {
      const c = this.center(actor.uid);
      const s = el('<div class="emblem">⛨</div>');
      s.style.left = c.x + 'px';
      s.style.top = c.y + 'px';
      this.fx.appendChild(s);
      s.animate([{ transform: 'translate(-50%,-50%) scale(4)', opacity: 0 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 1, offset: 0.35 }, { transform: 'translate(-50%,-50%) scale(1.1)', opacity: 1, offset: 0.7 }, { transform: 'translate(-50%,-50%) scale(1.4)', opacity: 0 }], { duration: 1300 });
      await this.wait(450);
      this.wave(c, '#8fd3ff', 8);
      this.env.push(c.x, c.y, 3);
      this.shake();
      for (const u of this.battle.side(actor.side).filter((x) => x.alive)) this.flash(u, 'flash-heal');
      await this.wait(850);
    },

    // Wookiee roar: huge shockwaves and a violent shake.
    async sm_roar(actor) {
      const c = this.center(actor.uid);
      for (let i = 0; i < 3; i++) {
        this.wave(c, '#c9a070', 10 + i * 3);
        this.env.push(c.x, c.y, 3);
        this.env.jolt(6);
        this.shake();
        await this.wait(280);
      }
      await this.wait(300);
    },

    // A ghost of the caster dashes through every enemy, blade trails behind.
    async sm_dash(actor, targets) {
      const color = actor.def.id === 'ahsoka' ? '#eef4ff' : actor.def.accent || SABER[actor.def.faction];
      const card = this.cards[actor.uid];
      const r0 = card.getBoundingClientRect();
      const layer = this.cineLayer();
      const ghost = card.cloneNode(true);
      ghost.classList.add('ghost');
      Object.assign(ghost.style, { position: 'fixed', left: r0.left + 'px', top: r0.top + 'px', width: r0.width + 'px', margin: 0 });
      layer.appendChild(ghost);
      card.style.opacity = '0.25';
      let prev = { x: r0.left, y: r0.top };
      for (const t of targets) {
        if (!this.cards[t.uid]) continue;
        const r = this.cards[t.uid].getBoundingClientRect();
        const next = { x: r.left + (Math.random() - 0.5) * 20, y: r.top };
        this.afterimage(layer, ghost, prev);
        await new Promise((res) => {
          ghost.animate([{ transform: `translate(${prev.x - r0.left}px, ${prev.y - r0.top}px)` }, { transform: `translate(${next.x - r0.left}px, ${next.y - r0.top}px)` }], { duration: 160 / Math.min(this.speed, 2), fill: 'forwards', easing: 'ease-in' }).onfinish = res;
        });
        const c = this.center(t.uid);
        this.slash(c, color, -35);
        this.slash(c, color, 35);
        this.env.impact(c.x, c.y, { power: 1, color });
        prev = next;
      }
      await new Promise((res) => {
        ghost.animate([{ transform: `translate(${prev.x - r0.left}px, ${prev.y - r0.top}px)` }, { transform: 'translate(0,0)' }], { duration: 220, fill: 'forwards' }).onfinish = res;
      });
      card.style.opacity = '';
      layer.remove();
    },

    afterimage(layer, ghost, pos) {
      const a = ghost.cloneNode(true);
      a.classList.add('after');
      a.style.transform = `translate(${pos.x - parseFloat(ghost.style.left)}px, ${pos.y - parseFloat(ghost.style.top)}px)`;
      layer.appendChild(a);
      a.animate([{ opacity: 0.5 }, { opacity: 0 }], { duration: 400 }).onfinish = () => a.remove();
    },

    // Leap into the air and slam down on the target.
    async sm_leap(actor, targets) {
      const t = targets[0];
      const card = this.cards[actor.uid];
      const r0 = card.getBoundingClientRect();
      const r1 = this.cards[t.uid].getBoundingClientRect();
      const layer = this.cineLayer();
      const ghost = card.cloneNode(true);
      ghost.classList.add('ghost');
      Object.assign(ghost.style, { position: 'fixed', left: r0.left + 'px', top: r0.top + 'px', width: r0.width + 'px', margin: 0 });
      layer.appendChild(ghost);
      card.style.opacity = '0.25';
      const dx = r1.left - r0.left;
      const dy = r1.top - r0.top;
      await new Promise((res) => {
        ghost.animate([
          { transform: 'translate(0,0) scale(1) rotate(0)' },
          { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 180}px) scale(1.7) rotate(${actor.side === 'player' ? -12 : 12}deg)`, offset: 0.55 },
          { transform: `translate(${dx}px, ${dy}px) scale(1) rotate(0)` },
        ], { duration: 900 / Math.min(this.speed, 2), easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' }).onfinish = res;
      });
      const c = this.center(t.uid);
      this.env.flash('#ffffff', 0.5);
      this.wave(c, actor.def.accent || '#ffffff', 10);
      this.env.blast(c.x, c.y + 20, actor.def.accent || '#ffffff', 2.4);
      this.slash(c, actor.def.accent || '#ffffff', 0);
      this.shake();
      await this.wait(350);
      await new Promise((res) => {
        ghost.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0,0)' }], { duration: 300, fill: 'forwards' }).onfinish = res;
      });
      card.style.opacity = '';
      layer.remove();
    },

    // A spinning lightsaber boomerangs through every enemy.
    async sm_saberthrow(actor, targets) {
      const color = actor.def.accent || SABER[actor.def.faction];
      const from = this.center(actor.uid);
      const saber = el('<div class="thrown-saber"></div>');
      saber.style.setProperty('--glow', color);
      saber.style.left = from.x + 'px';
      saber.style.top = from.y + 'px';
      this.fx.appendChild(saber);
      const pts = [from, ...targets.map((t) => this.center(t.uid)), from];
      const frames = pts.map((p, i) => ({ transform: `translate(${p.x - from.x}px, ${p.y - from.y}px) rotate(${i * 540}deg)` }));
      const dur = (380 * (pts.length - 1)) / Math.min(this.speed, 2);
      const anim = saber.animate(frames, { duration: dur, easing: 'linear' });
      targets.forEach((t, i) => setTimeout(() => {
        if (!this.cards[t.uid]) return;
        const c = this.center(t.uid);
        this.slash(c, color);
        this.env.impact(c.x, c.y, { power: 0.9, color });
      }, ((i + 1) / (pts.length - 1)) * dur));
      await new Promise((r) => { anim.onfinish = r; });
      saber.remove();
    },

    // A wall of Force energy sweeps the enemy line back.
    async sm_forcepush(actor, targets) {
      const from = this.center(actor.uid);
      const wave = el('<div class="force-wave"></div>');
      wave.style.left = from.x + 'px';
      wave.style.top = from.y + 'px';
      this.fx.appendChild(wave);
      wave.animate([{ transform: 'translate(-50%,-50%) scale(.1)', opacity: 0.9 }, { transform: 'translate(-50%,-50%) scale(6)', opacity: 0 }], { duration: 1000, easing: 'ease-out' }).onfinish = () => wave.remove();
      this.env.push(from.x, from.y, 5);
      await this.wait(250);
      const dir = actor.side === 'player' ? -1 : 1;
      for (const t of targets) {
        if (!this.cards[t.uid]) continue;
        this.cards[t.uid].animate([{ transform: 'translateY(0) rotate(0)' }, { transform: `translateY(${dir * 34}px) rotate(${rand(-8, 8)}deg)`, offset: 0.35 }, { transform: 'translateY(0) rotate(0)' }], { duration: 800, easing: 'cubic-bezier(.2,.8,.3,1)' });
        const c = this.center(t.uid);
        this.env.impact(c.x, c.y, { power: 1, color: '#8fd3ff' });
      }
      this.shake();
      await this.wait(700);
    },

    // Jagged Force lightning arcs to every target.
    async lightning(actor, targets, ms) {
      const layer = this.cineLayer();
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('class', 'bolt-svg');
      svg.setAttribute('width', window.innerWidth);
      svg.setAttribute('height', window.innerHeight);
      layer.appendChild(svg);
      const from = this.vp(actor.uid);
      const end = performance.now() + ms / Math.min(this.speed, 2);
      await new Promise((resolve) => {
        const draw = () => {
          svg.innerHTML = '';
          for (const t of targets) {
            if (!this.cards[t.uid]) continue;
            const to = this.vp(t.uid);
            for (let k = 0; k < 2; k++) {
              let d = `M${from.x} ${from.y}`;
              const n = 9;
              for (let i = 1; i < n; i++) {
                const x = from.x + ((to.x - from.x) * i) / n + rand(-26, 26);
                const y = from.y + ((to.y - from.y) * i) / n + rand(-26, 26);
                d += ` L${x} ${y}`;
              }
              d += ` L${to.x} ${to.y}`;
              const path = document.createElementNS(svgNS, 'path');
              path.setAttribute('d', d);
              path.setAttribute('class', k ? 'core' : 'glow');
              svg.appendChild(path);
            }
            if (Math.random() < 0.3) {
              const c = this.center(t.uid);
              this.env.light(c.x, c.y, '#b58cff', 120, 0.2);
              this.sparks(c, '#d8c8ff', 3);
            }
          }
          if (performance.now() < end) requestAnimationFrame(draw);
          else resolve();
        };
        draw();
      });
      this.env.flash('#b58cff', 0.35);
      layer.remove();
    },

    sm_lightning(actor, targets) {
      return this.lightning(actor, targets, 1500);
    },

    // Targets are lifted and crushed by an invisible grip.
    async choke(actor, targets, ms) {
      const caster = this.cards[actor.uid];
      caster.classList.add('force-glow');
      const lifted = targets.filter((t) => this.cards[t.uid]);
      lifted.forEach((t) => this.cards[t.uid].classList.add('choked'));
      const anims = lifted.map((t) => this.cards[t.uid].animate([
        { transform: 'translateY(0)' }, { transform: 'translateY(-26px) rotate(-2deg)', offset: 0.3 },
        { transform: 'translateY(-28px) rotate(2deg)', offset: 0.5 }, { transform: 'translateY(-26px) rotate(-2deg)', offset: 0.7 },
        { transform: 'translateY(4px)', offset: 0.92 }, { transform: 'translateY(0)' },
      ], { duration: ms / Math.min(this.speed, 2) }));
      await Promise.all(anims.map((a) => new Promise((r) => { a.onfinish = r; })));
      lifted.forEach((t) => {
        this.cards[t.uid].classList.remove('choked');
        const c = this.center(t.uid);
        this.env.impact(c.x, c.y + 30, { power: 1.2, color: '#ff2a2a' });
      });
      caster.classList.remove('force-glow');
      this.shake();
    },

    sm_choke(actor, targets) {
      return this.choke(actor, targets, 1600);
    },

    // Giant claw marks tear across the screen.
    async sm_claws(actor, targets) {
      const layer = this.cineLayer();
      for (let i = 0; i < 3; i++) {
        const c = el('<div class="claw"></div>');
        c.style.top = `${22 + i * 12}%`;
        layer.appendChild(c);
        c.animate([{ clipPath: 'inset(0 100% 0 0)', opacity: 1 }, { clipPath: 'inset(0 0 0 0)', opacity: 1, offset: 0.35 }, { clipPath: 'inset(0 0 0 0)', opacity: 0 }], { duration: 900, delay: i * 90 });
      }
      await this.wait(300);
      for (const t of targets) {
        if (!this.cards[t.uid]) continue;
        const c = this.center(t.uid);
        this.env.impact(c.x, c.y, { power: 1.4, color: '#ff5a3a' });
      }
      this.shake();
      await this.wait(700);
      layer.remove();
    },

    // Four blades whirl around each target in turn.
    // Inquisitor signature: the spinning double-bladed saber ignites, rings the
    // battlefield in red, then carves a curving path through every target.
    async sm_spinsaber(actor, targets) {
      const color = '#ff2a2a';
      const from = this.center(actor.uid);
      const speed = Math.min(this.speed, 2);
      const spin = el('<div class="spin-saber"><div class="ss-ring"><i></i><i></i><b></b></div></div>');
      spin.style.left = from.x + 'px';
      spin.style.top = from.y + 'px';
      this.fx.appendChild(spin);
      // Ignition: the ring snaps open with a red flare.
      spin.animate([{ transform: 'translate(-50%,-50%) scale(.1)', opacity: 0 }, { transform: 'translate(-50%,-50%) scale(1.4)', opacity: 1, offset: 0.6 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }], { duration: 380 / speed, easing: 'ease-out', fill: 'forwards' });
      this.wave(from, color, 3.4);
      this.env.flash('#ff2a2a', 0.25);
      this.env.light(from.x, from.y, color, 200, 0.6);
      await this.wait(380);
      const pts = [from, ...targets.map((t) => this.center(t.uid)), from];
      const legMs = 300 / speed;
      const hitAt = new Set();
      const t0 = performance.now();
      const total = legMs * (pts.length - 1);
      let lastTrail = 0;
      await new Promise((resolve) => {
        const step = (now) => {
          const el2 = Math.max(0, Math.min(total, now - t0));
          const leg = Math.min(pts.length - 2, Math.floor(el2 / legMs));
          const k = (el2 - leg * legMs) / legMs;
          const a = pts[leg];
          const b = pts[leg + 1];
          // Curve each leg sideways so the saber sweeps rather than slides.
          const bend = Math.sin(k * Math.PI) * 60 * (leg % 2 ? 1 : -1);
          const nx = -(b.y - a.y);
          const ny = b.x - a.x;
          const nl = Math.hypot(nx, ny) || 1;
          const x = a.x + (b.x - a.x) * k + (nx / nl) * bend;
          const y = a.y + (b.y - a.y) * k + (ny / nl) * bend;
          spin.style.left = x + 'px';
          spin.style.top = y + 'px';
          if (now - lastTrail > 40 && !reducedMotion()) {
            lastTrail = now;
            const tr = el('<div class="ss-trail"></div>');
            tr.style.left = x + 'px';
            tr.style.top = y + 'px';
            this.fx.appendChild(tr);
            tr.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 0.6 }, { transform: 'translate(-50%,-50%) scale(.3)', opacity: 0 }], { duration: 360 }).onfinish = () => tr.remove();
          }
          if (k > 0.92 && leg < targets.length && !hitAt.has(leg)) {
            hitAt.add(leg);
            const t = targets[leg];
            if (this.cards[t.uid]) {
              const c = this.center(t.uid);
              this.slash(c, color, -35);
              this.slash(c, color, 35);
              this.sparks(c, color, 12);
              this.env.impact(c.x, c.y, { power: 1.1, color });
              this.cards[t.uid].animate([{ transform: 'rotate(0)' }, { transform: `rotate(${rand(-10, 10)}deg) scale(.94)`, offset: 0.3 }, { transform: 'rotate(0)' }], { duration: 360 });
            }
          }
          if (el2 >= total) return resolve();
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
      this.shake();
      spin.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: 'translate(-50%,-50%) scale(.2)', opacity: 0 }], { duration: 260, fill: 'forwards' }).onfinish = () => spin.remove();
      await this.wait(260);
    },

    // Grand Inquisitor: the saber leaves the battlefield entirely, carves a loop
    // around the whole screen, slices each target card in half, and returns.
    async sm_saberstorm(actor, targets) {
      if (reducedMotion()) return this.sm_saberthrow(actor, targets);
      const speed = Math.min(this.speed, 2);
      const W = window.innerWidth;
      const H = window.innerHeight;
      const layer = el('<div class="storm-layer" aria-hidden="true"><div class="storm-vignette"></div><canvas></canvas></div>');
      document.body.appendChild(layer);
      const cv = $('canvas', layer);
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      cv.width = W * dpr;
      cv.height = H * dpr;
      const ctx = cv.getContext('2d');
      ctx.scale(dpr, dpr);
      const saber = el('<div class="spin-saber storm"><div class="ss-ring"><i></i><i></i><b></b></div></div>');
      layer.appendChild(saber);
      const from = this.vp(actor.uid);
      saber.style.left = from.x + 'px';
      saber.style.top = from.y + 'px';
      saber.animate([{ transform: 'translate(-50%,-50%) scale(.1)', opacity: 0 }, { transform: 'translate(-50%,-50%) scale(1.5)', opacity: 1, offset: 0.6 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }], { duration: 360, fill: 'forwards' });
      this.env.flash('#ff2a2a', 0.3);
      await this.wait(360);
      const loop = [[0.86, 0.1], [0.95, 0.5], [0.66, 0.92], [0.12, 0.84], [0.06, 0.3], [0.4, 0.06]].map(([x, y]) => ({ x: x * W, y: y * H }));
      const route = [from, ...loop, ...targets.map((t) => ({ ...this.vp(t.uid), uid: t.uid })), { ...from, home: true }];
      const cum = [0];
      for (let i = 1; i < route.length; i++) cum.push(cum[i - 1] + Math.hypot(route[i].x - route[i - 1].x, route[i].y - route[i - 1].y));
      const total = cum[cum.length - 1];
      const pxPerMs = 2.1 * speed;
      const cr = (p0, p1, p2, p3, u) => {
        const u2 = u * u;
        const u3 = u2 * u;
        return 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3);
      };
      const at = (d) => {
        let i = 1;
        while (i < cum.length - 1 && cum[i] < d) i++;
        const u = (d - cum[i - 1]) / Math.max(1, cum[i] - cum[i - 1]);
        const p0 = route[Math.max(0, i - 2)];
        const p1 = route[i - 1];
        const p2 = route[i];
        const p3 = route[Math.min(route.length - 1, i + 1)];
        return { x: cr(p0.x, p1.x, p2.x, p3.x, u), y: cr(p0.y, p1.y, p2.y, p3.y, u) };
      };
      const done = new Set();
      let prev = from;
      const t0 = performance.now();
      await new Promise((resolve) => {
        const step = (now) => {
          const d = Math.min(total, Math.max(0, now - t0) * pxPerMs);
          const p = at(d);
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = 'rgba(0,0,0,0.16)';
          ctx.fillRect(0, 0, W, H);
          ctx.globalCompositeOperation = 'lighter';
          ctx.lineCap = 'round';
          for (const [w, c] of [[26, 'rgba(255,30,30,0.18)'], [10, 'rgba(255,60,60,0.6)'], [3, 'rgba(255,240,235,0.95)']]) {
            ctx.strokeStyle = c;
            ctx.lineWidth = w;
            ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(p.x, p.y); ctx.stroke();
          }
          prev = p;
          saber.style.left = p.x + 'px';
          saber.style.top = p.y + 'px';
          route.forEach((r, i) => {
            if (!r.uid || done.has(i) || d < cum[i] - 4) return;
            done.add(i);
            this.cutCard(r.uid, layer);
          });
          if (d >= total) return resolve();
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
      // Caught.
      const home = this.center(actor.uid);
      this.wave(home, '#ff2a2a', 3);
      this.env.flash('#ff2a2a', 0.25);
      saber.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: 'translate(-50%,-50%) scale(.2)', opacity: 0 }], { duration: 240, fill: 'forwards' });
      layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: 200, fill: 'forwards' }).onfinish = () => layer.remove();
      await this.wait(420);
    },

    // Slice a card along a diagonal: the halves split apart in a puff of smoke, then snap back.
    cutCard(uid, layer, color, flip) {
      const card = this.cards[uid];
      if (!card || !card.isConnected) return;
      const r = card.getBoundingClientRect();
      const tone = color || '#ff2a2a';
      const lo = rand(22, 38);
      const a = flip ? 100 - lo : lo;
      const b = 100 - a;
      const halves = [[`polygon(0 0, 100% 0, 100% ${b}%, 0 ${a}%)`, -1], [`polygon(0 ${a}%, 100% ${b}%, 100% 100%, 0 100%)`, 1]];
      card.style.visibility = 'hidden';
      halves.forEach(([clip, dir]) => {
        const c = card.cloneNode(true);
        c.classList.add('cut-half');
        c.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;margin:0;clip-path:${clip};visibility:visible;z-index:1`;
        layer.insertBefore(c, layer.querySelector('canvas'));
        const off = `translate(${dir * 10}px, ${dir * 16}px) rotate(${dir * 6}deg)`;
        c.animate([{ transform: 'none' }, { transform: off, offset: 0.35 }, { transform: off, offset: 0.7 }, { transform: 'none' }], { duration: 950, easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = () => c.remove();
      });
      setTimeout(() => { if (card.isConnected) card.style.visibility = ''; }, 940);
      // The cut line and the poof.
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * ((a + b) / 200);
      const ang = (Math.atan2(((b - a) / 100) * r.height, r.width) * 180) / Math.PI;
      const line = el(`<div class="cut-line" style="left:${r.left - 20}px;top:${cy}px;width:${r.width + 40}px;transform:rotate(${ang}deg);--c:${tone}"></div>`);
      layer.appendChild(line);
      line.animate([{ opacity: 1, transform: `rotate(${ang}deg) scaleX(0)` }, { opacity: 1, transform: `rotate(${ang}deg) scaleX(1)`, offset: 0.3 }, { opacity: 0, transform: `rotate(${ang}deg) scaleX(1.1)` }], { duration: 500 }).onfinish = () => line.remove();
      for (let i = 0; i < 14; i++) {
        const p = el('<i class="poof"></i>');
        const t = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 50;
        p.style.left = cx + 'px';
        p.style.top = cy + 'px';
        layer.appendChild(p);
        p.animate([{ transform: 'translate(-50%,-50%) scale(.3)', opacity: 0.9 }, { transform: `translate(calc(-50% + ${Math.cos(t) * dist}px), calc(-50% + ${Math.sin(t) * dist}px)) scale(${1.4 + Math.random()})`, opacity: 0 }], { duration: 700 + Math.random() * 300, easing: 'ease-out' }).onfinish = () => p.remove();
      }
      const fc = this.center(uid);
      this.sparks(fc, tone, 14);
      this.env.impact(fc.x, fc.y, { power: 1.3, color: tone });
      this.shake();
    },

    async sm_whirl(actor, targets) {
      const colors = ['#3d8bff', '#46e070', '#3d8bff', '#46e070'];
      for (const t of targets) {
        if (!this.cards[t.uid]) continue;
        const c = this.center(t.uid);
        const w = el(`<div class="whirl">${colors.map((col, i) => `<i style="--glow:${col};transform:rotate(${i * 90}deg)"></i>`).join('')}</div>`);
        w.style.left = c.x + 'px';
        w.style.top = c.y + 'px';
        this.fx.appendChild(w);
        w.animate([{ transform: 'translate(-50%,-50%) rotate(0) scale(.6)' }, { transform: 'translate(-50%,-50%) rotate(720deg) scale(1)' }], { duration: 420 }).onfinish = () => w.remove();
        this.env.impact(c.x, c.y, { power: 0.8, color: '#3d8bff' });
        await this.wait(200);
      }
      await this.wait(250);
    },

    // ---------- Cinematics ----------
    cutscene(actor, ab, opts = {}) {
      return new Promise((resolve) => {
        const speed = Math.min(this.speed, 2);
        const who = opts.who || `${actor.side === 'player' ? 'Ally' : 'Enemy'} ultimate · ${actor.def.name}`;
        const node = el(`<div class="cutscene ${actor.side || 'enemy'} ${opts.cls || ''}" style="--speed:${speed}" role="presentation">
          <div class="cs-rays"></div>
          <div class="cs-stripe"></div>
          <div class="cs-bar top"></div>
          <div class="cs-bar bottom"></div>
          <div class="cs-content">
            <div class="cs-portrait">${portrait(actor.def, { plate: false })}</div>
            <div class="cs-text">
              <div class="cs-who">${esc(who)}</div>
              <div class="cs-name">${esc(ab.name)}</div>
              ${ab.quote ? `<div class="cs-quote">“${esc(ab.quote)}”</div>` : ''}
            </div>
          </div>
          <div class="cs-flash"></div>
          <div class="cs-skip">Tap to skip</div>
        </div>`);
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          node.remove();
          resolve();
        };
        node.addEventListener('click', finish);
        document.body.appendChild(node);
        setTimeout(finish, reducedMotion() ? 900 : 2600 / speed);
      });
    },

    bossIntro(def) {
      return this.cutscene({ def, side: 'enemy' }, { name: def.name, quote: D.BIOS[def.id] }, { who: '⚠ Warning · Boss approaching', cls: 'boss-intro' });
    },

    hyperspace() {
      return new Promise((resolve) => {
        if (reducedMotion()) return resolve();
        const wrap = el('<div class="hyperspace"><canvas></canvas></div>');
        document.body.appendChild(wrap);
        const canvas = wrap.firstElementChild;
        const ctx = canvas.getContext('2d');
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const w = (canvas.width = window.innerWidth * dpr);
        const h = (canvas.height = window.innerHeight * dpr);
        const stars = Array.from({ length: 260 }, () => ({ a: Math.random() * Math.PI * 2, r: Math.random() * 40 + 2, v: Math.random() * 0.6 + 0.4 }));
        const start = performance.now();
        const total = 1100;
        const frame = (now) => {
          const t = Math.min(1, (now - start) / total);
          ctx.fillStyle = 'rgba(0,0,0,0.35)';
          ctx.fillRect(0, 0, w, h);
          const cx = w / 2;
          const cy = h / 2;
          const accel = t * t * 60 + 2;
          ctx.lineCap = 'round';
          for (const s of stars) {
            const r0 = s.r;
            s.r += s.v * accel * dpr;
            ctx.strokeStyle = `rgba(${200 + Math.random() * 55},${220 + Math.random() * 35},255,${0.4 + t * 0.6})`;
            ctx.lineWidth = (1 + t * 2) * dpr;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(s.a) * r0, cy + Math.sin(s.a) * r0);
            ctx.lineTo(cx + Math.cos(s.a) * s.r, cy + Math.sin(s.a) * s.r);
            ctx.stroke();
            if (s.r > Math.max(w, h)) s.r = Math.random() * 30;
          }
          if (t < 1) {
            requestAnimationFrame(frame);
          } else {
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillRect(0, 0, w, h);
            wrap.classList.add('out');
            setTimeout(() => wrap.remove(), 400);
            resolve();
          }
        };
        requestAnimationFrame(frame);
      });
    },

    // ---------- End of battle ----------
    teardown() {
      App.battleActive = false;
      document.body.classList.remove('in-battle');
      document.removeEventListener('keydown', this.onKey);
      $$('.cine, .keys-help').forEach((n) => n.remove());
      if (this.env) this.env.stop();
      this.setActive(null);
    },

    async finish(winner) {
      this.ended = true;
      this.setActive(null);
      await this.wait(500);
      const won = winner === 'player';
      const rewards = Player.completeEncounter(this.params, won);
      this.teardown();
      const p = this.params;
      const isTower = p.type === 'tower';
      const isStage = p.type === 'stage';
      const planet = isStage ? D.PLANET_MAP[p.planet] : null;
      const nextInPlanet = won && isStage && p.stage < planet.stages.length - 1;
      const nextPlanet = won && isStage && rewards.planetComplete ? D.PLANETS[D.PLANETS.indexOf(planet) + 1] : null;
      const reel = won ? rewards.table.map((t) => `<span class="reel-item" data-mult="${t.mult}">${t.mult}×</span>`).join('') : '';
      const acct = Player.state.account;
      const xpHtml = rewards ? `<div class="xp-box">
          <span class="xp-gain">+${rewards.xp} XP</span>
          <span class="xp-bar"><i style="width:${acct.level >= D.MAX_ACCOUNT_LEVEL ? 100 : Math.min(100, (acct.xp / D.xpToNext(acct.level)) * 100)}%"></i></span>
          <span class="muted small">Account Lv ${acct.level}</span>
        </div>
        ${rewards.levelUps.map((u) => `<div class="level-up"><b>LEVEL UP!</b> Account level ${u.level} · ${cur('credits', u.reward.credits)} ${cur('crystals', u.reward.crystals)}</div>`).join('')}
        ${rewards.newSlot ? `<div class="level-up slot-up"><b>NEW SQUAD SLOT!</b> You can now field ${Player.slots()} units in ground and fleet battles.</div>` : ''}` : '';
      const m = openModal(`
        <div class="result-title ${won ? 'win' : 'lose'}">${won ? 'VICTORY' : 'DEFEAT'}</div>
        ${isTower ? `<div class="liberated tower-result"><p class="eyebrow">Endless Tower</p><h3>${won ? `Floor ${p.floor || rewards.towerFloor - 1} cleared${rewards.newBest ? ' · New best!' : ''}` : rewards.fell ? `Fell back to floor ${rewards.towerFloor}` : `Checkpoint holds at floor ${rewards.towerFloor}`}</h3><p class="muted">${won ? 'Deeper floors hit harder and pay more.' : 'Checkpoints every 10 floors. The floors above have been re-rolled.'}</p></div>` : ''}
        ${won && rewards.planetComplete ? `<div class="liberated"><p class="eyebrow">Planet liberated</p><h3>${esc(planet.name)} is free!</h3><p class="muted">${nextPlanet ? `Hyperspace lane to ${esc(nextPlanet.name)} unlocked.` : 'You have liberated the entire galaxy.'}</p></div>` : ''}
        ${won ? `
          <div class="spin-box ${rewards.loaded ? 'loaded' : ''}">
            <p class="eyebrow">${rewards.loaded ? 'Loaded Dice · luck spin' : 'Luck spin'}${rewards.bounty ? ' · Bounty Hunters +20%' : ''}</p>
            <div class="reel"><div class="reel-track" data-reel>${reel}${reel}${reel}${reel}</div></div>
            <p class="spin-math" data-spin-math>${cur('credits', rewards.base)} × ?</p>
          </div>
          <div class="rewards" data-rewards hidden>
            <span class="reward">${cur('credits', rewards.credits)}</span>
            ${rewards.crystals ? `<span class="reward first">${cur('crystals', rewards.crystals)} ${rewards.firstClear ? 'first clear' : ''}</span>` : ''}
            ${rewards.aurodium ? `<span class="reward gold">${cur('aurodium', rewards.aurodium)}</span>` : ''}
          </div>
          ${rewards.card ? `<div class="reward-card" data-rewards hidden><p class="eyebrow">Boss trophy</p>${root.UI.unitCard(D.UNIT_MAP[rewards.card.id], { tag: 'div', hideShards: true })}<p class="muted">${rewards.card.isNew ? 'New recruit!' : `+${rewards.card.shards} shards`}</p></div>` : ''}`
        : '<p class="muted">Train your units in the Collection, build a squad with matching traits for synergies, or grab crates in the Night Market, then try again.</p>'}
        ${xpHtml}
        <div class="modal-actions">
          ${isTower ? '' : '<button class="btn" type="button" data-r="retry">Retry</button>'}
          ${won ? '' : '<button class="btn" type="button" data-r="collection">Collection</button>'}
          ${isTower ? `<button class="btn" type="button" data-r="tower-exit">Leave tower</button><button class="btn btn-primary" type="button" data-r="tower">${won ? `Climb to floor ${rewards.towerFloor}` : `Restart from floor ${rewards.towerFloor}`}</button>` : nextInPlanet ? '<button class="btn btn-primary" type="button" data-r="next">Next stage</button>' : nextPlanet ? `<button class="btn btn-primary" type="button" data-r="planet">Travel to ${esc(nextPlanet.name)}</button>` : '<button class="btn btn-primary" type="button" data-r="campaign">Continue</button>'}
        </div>`, { small: true, dismissable: false, cls: 'result-modal' });
      if (won) this.spinReel(m.root, rewards);
      m.root.addEventListener('click', (e) => {
        const r = e.target.closest('[data-r]');
        if (!r) return;
        m.close();
        if (r.dataset.r === 'tower') App.go('squad', { type: 'tower', floor: rewards.towerFloor });
        else if (r.dataset.r === 'tower-exit') { App.ui.hubMode = 'tower'; App.go('home'); }
        else if (r.dataset.r === 'retry') App.go('squad', p);
        else if (r.dataset.r === 'next') App.go('squad', { ...p, stage: p.stage + 1 });
        else if (r.dataset.r === 'planet') {
          App.ui.hubMode = 'character';
          App.ui.openPlanet = nextPlanet.id;
          App.go('home');
        } else App.go(r.dataset.r);
      });
    },

    // Hitting the top multiplier gets a full-screen Star Wars pun instead of a toast.
    jackpot(mult, credits) {
      const puns = mult >= 10
        ? [['Unlimited credits!', 'The Loaded Dice are strong with this one'], ['I have the high roll!', "Don't try it. It's a max multiplier"]]
        : [['Never tell me the odds!', 'You beat them anyway'], ['These are the credits you\'re looking for', 'Move along… to the bank'], ['The odds are strong with this one', 'A max roll, as the Force wills it']];
      const [line, sub] = puns[Math.floor(Math.random() * puns.length)];
      const coins = reducedMotion() ? '' : Array.from({ length: 36 }, (_, i) => `<i style="--x:${Math.random() * 100}%;--d:${(Math.random() * 0.9).toFixed(2)}s;--s:${(0.7 + Math.random() * 0.7).toFixed(2)};--r:${Math.round(rand(-540, 540))}deg"></i>`).join('');
      const streaks = reducedMotion() ? '' : Array.from({ length: 22 }, (_, i) => `<b style="--y:${Math.random() * 100}%;--d:${(Math.random() * 0.5).toFixed(2)}s;--w:${Math.round(rand(80, 320))}px"></b>`).join('');
      const node = el(`<div class="jackpot" role="status" aria-live="assertive">
        <div class="jp-rays"></div>
        <div class="jp-streaks">${streaks}</div>
        <div class="jp-coins">${coins}</div>
        <div class="jp-text">
          <span class="jp-kicker">Max multiplier · ${mult}×</span>
          <b class="jp-line">${esc(line)}</b>
          <span class="jp-sub">${esc(sub)}</span>
          <span class="jp-amount">${cur('credits', credits)}</span>
        </div>
      </div>`);
      document.body.appendChild(node);
      const close = () => {
        if (!node.isConnected) return;
        node.classList.add('out');
        setTimeout(() => node.remove(), 450);
      };
      node.addEventListener('click', close);
      setTimeout(close, 3400);
    },

    spinReel(scope, rewards) {
      const track = $('[data-reel]', scope);
      const items = $$('.reel-item', track);
      const per = rewards.table.length;
      const targetIdx = per * 3 + rewards.table.findIndex((t) => t.mult === rewards.mult);
      const target = items[targetIdx];
      const reveal = () => {
        target.classList.add('hit');
        $('[data-spin-math]', scope).innerHTML = `${cur('credits', rewards.base)} × <b class="mult">${rewards.mult}×</b>${rewards.bounty ? ' × 1.2' : ''} = ${cur('credits', rewards.credits)}`;
        $$('[data-rewards]', scope).forEach((n) => { n.hidden = false; });
        updateWallet();
        const max = Math.max(...rewards.table.map((t) => t.mult));
        if (rewards.mult >= max) this.jackpot(rewards.mult, rewards.credits);
        else if (rewards.mult >= 3) toast(`Jackpot! ${rewards.mult}× credits!`);
      };
      // Measure after layout settles; divide out the modal's scale-in transform.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const reel = track.parentElement;
        const rr = reel.getBoundingClientRect();
        const tr = target.getBoundingClientRect();
        const scale = rr.width / (reel.offsetWidth || rr.width) || 1;
        const offset = (tr.left + tr.width / 2 - (rr.left + rr.width / 2)) / scale;
        if (reducedMotion()) {
          track.style.transform = `translateX(${-offset}px)`;
          return reveal();
        }
        track.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${-offset}px)` }], { duration: 1600, easing: 'cubic-bezier(.12,.8,.2,1)', fill: 'forwards' }).onfinish = reveal;
      }));
    },
  };

  root.BattleUI = BattleUI;
})(window);
