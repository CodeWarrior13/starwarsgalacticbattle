// Battle screen: renders the field, takes player input and plays engine
// events back as animations (lunges, laser fire, floating numbers, cutscenes).

(function (root) {
  const D = root.GameData;
  const Player = root.Player;
  const { $, $$, el, esc, fmt, portrait, toast, openModal, confirmBox, updateWallet, App } = root.UI;

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

  const BattleUI = {
    battle: null,
    prefs: loadPrefs(),

    get speed() {
      return this.prefs.speed || 1;
    },

    wait(ms) {
      return new Promise((r) => setTimeout(r, ms / this.speed));
    },

    async start(kind, stageIndex) {
      const stage = D.CAMPAIGNS[kind].stages[stageIndex];
      const squad = Player.squadEntries(kind);
      if (!squad.length) return toast('Pick at least one unit for your squad.');
      this.kind = kind;
      this.stageIndex = stageIndex;
      this.stage = stage;
      this.ended = false;
      this.pending = null;
      this.battle = new root.Battle(squad, stage.enemies.map((id) => ({ id, level: stage.level, stars: 1 })));

      App.battleActive = true;
      App.current = 'battle';
      document.body.classList.add('in-battle');
      document.documentElement.style.setProperty('--speed', this.speed);
      this.renderScreen();
      await this.hyperspace();
      this.log(`Battle begins at ${stage.name}!`, 'ult');
      this.loop();
    },

    // ---------- Rendering ----------
    renderScreen() {
      const b = this.battle;
      const view = el(`<section class="battle">
        <div class="battle-top">
          <h2>${esc(this.stage.name)}</h2>
          <div class="turn-order" data-order></div>
          <span class="spacer"></span>
          <button class="btn btn-small toggle" type="button" data-auto title="Let the AI play your turns">Auto</button>
          <button class="btn btn-small" type="button" data-speed title="Animation speed">${this.speed}×</button>
          <button class="btn btn-small btn-danger" type="button" data-retreat>Retreat</button>
        </div>
        <div class="field ${this.kind === 'ship' ? 'ships' : ''}" data-field>
          <div class="row enemy-row" data-row="enemy"></div>
          <div class="midline">${this.kind === 'ship' ? 'Engagement zone' : 'Battlefield'}</div>
          <div class="row player-row" data-row="player"></div>
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
        const card = el(`<div class="bcard" data-uid="${u.uid}">
          <span class="blevel">Lv ${u.level}</span>
          <div class="statuses"></div>
          ${portrait(u.def)}
          <div class="bname">${esc(u.def.name)}</div>
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
      $$('.main-nav button').forEach((btn) => btn.classList.toggle('active', btn.dataset.nav === 'campaign'));
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
          return `<span data-s="${k}" class="${info.kind}" title="${info.label} (${u.statuses[k]}): ${info.desc}">${info.icon}</span>`;
        }).join('');
      }
      card.classList.toggle('ko', !u.alive);
    },

    updateAll() {
      for (const u of this.battle.units) this.updateCard(u);
    },

    updateTurnOrder() {
      const order = this.battle.predictOrder(7);
      $('[data-order]', this.view).innerHTML = '<span class="label">Next</span>' + order.map((uid) => {
        const u = this.battle.get(uid);
        return `<span class="to-chip ${u.side}" title="${esc(u.def.name)}">${portrait(u.def)}</span>`;
      }).join('');
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
      const chip = `<div class="actor-chip">${portrait(actor.def)}</div>`;
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
          <span class="an">${ult ? '★ ' : ''}${esc(ab.name)}</span>
          <span class="ad">${esc(ab.desc)}</span>
          ${!ult && !ready ? `<span class="acd">${cd}</span>` : ''}
          ${ult ? `<span class="ult-fill" style="width:${actor.ult}%"></span>` : ''}
        </button>`;
      }).join('');
      const ab = actor.abilities[this.selected];
      const hint = b.needsTarget(actor, this.selected) ? 'Tap a highlighted enemy to attack.'
        : ab.target === 'allEnemies' ? 'Tap any enemy to hit them all.'
          : ab.target === 'allAllies' ? 'Tap any ally to use it on your whole squad.'
            : 'Tap your unit to use it.';
      box.innerHTML = `${chip}<div class="actions-main">
        <div class="actions-title"><b>${esc(actor.def.name)}</b><span class="muted">Your turn · keys 1–${actor.abilities.length}</span></div>
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
      for (const t of this.targetsFor(actor, this.selected)) {
        const c = this.cards[t.uid];
        c.classList.add('targetable');
        if (t.side === actor.side) c.classList.add('friendly');
      }
    },

    clearTargets() {
      Object.values(this.cards).forEach((c) => c.classList.remove('targetable', 'friendly'));
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
      if (!p || !this.battle.isReady(p.actor, i)) return;
      this.selected = i;
      this.renderActions(p.actor, 'input');
      this.highlightTargets(p.actor);
    },

    onKey: (e) => {
      const self = BattleUI;
      if (!self.pending || e.target.closest('input, textarea')) return;
      const n = Number(e.key);
      if (n >= 1 && n <= self.pending.actor.abilities.length) self.selectAbility(n - 1);
    },

    async onClick(e) {
      const abBtn = e.target.closest('[data-ab]');
      if (abBtn) return this.selectAbility(Number(abBtn.dataset.ab));

      const card = e.target.closest('.bcard.targetable');
      if (card && this.pending) {
        const { actor } = this.pending;
        const targetUid = this.battle.needsTarget(actor, this.selected) ? card.dataset.uid : null;
        return this.resolvePending({ abilityIndex: this.selected, targetUid });
      }

      if (e.target.closest('[data-auto]')) {
        this.prefs.auto = !this.prefs.auto;
        savePrefs(this.prefs);
        e.target.closest('[data-auto]').classList.toggle('on', this.prefs.auto);
        if (this.prefs.auto && this.pending) {
          const actor = this.pending.actor;
          this.renderActions(actor);
          this.resolvePending(this.battle.chooseAction(actor));
        }
        return;
      }

      if (e.target.closest('[data-speed]')) {
        this.prefs.speed = this.speed >= 3 ? 1 : this.speed + 1;
        savePrefs(this.prefs);
        document.documentElement.style.setProperty('--speed', this.speed);
        e.target.closest('[data-speed]').textContent = `${this.speed}×`;
        return;
      }

      if (e.target.closest('[data-retreat]')) {
        if (await confirmBox('Retreat from battle?', 'This counts as a defeat. You keep everything you already own.', 'Retreat')) {
          this.ended = true;
          this.resolvePending(null);
          Player.completeStage(this.kind, this.stageIndex, false);
          this.teardown();
          App.go('campaign');
        }
      }
    },

    // ---------- Main loop ----------
    async loop() {
      const b = this.battle;
      while (!this.ended) {
        const w = b.winner();
        if (w) return this.finish(w);
        const actor = b.advance();
        this.setActive(actor);
        this.updateTurnOrder();
        this.updateAll();
        const { events, skipped } = b.beginTurn(actor);
        await this.play(events);
        if (this.ended) return;
        if (skipped || b.winner()) continue;

        let action;
        if (actor.side === 'player' && !this.prefs.auto) {
          action = await this.awaitPlayer(actor);
        } else {
          this.renderActions(actor);
          await this.wait(actor.side === 'enemy' ? 650 : 380);
          action = b.chooseAction(actor);
        }
        if (this.ended || !action) return;
        this.renderActions(actor);
        const evs = b.act(actor, action.abilityIndex, action.targetUid);
        await this.play(evs);
      }
    },

    // ---------- Event playback ----------
    async play(events) {
      let aoe = false;
      for (const ev of events) {
        if (this.ended) return;
        const u = ev.uid ? this.battle.get(ev.uid) : null;
        switch (ev.type) {
          case 'use':
            aoe = ev.aoe;
            await this.animateUse(ev);
            break;
          case 'damage':
            this.hit(u, ev);
            await this.wait(ev.source === 'burn' ? 420 : aoe ? 110 : 280);
            break;
          case 'heal':
            this.float(u, `+${fmt(ev.amount)}`, 'heal');
            this.flash(u, 'flash-heal');
            this.updateCard(u);
            await this.wait(aoe ? 90 : 240);
            break;
          case 'status':
            this.float(u, D.STATUS_INFO[ev.status].label, D.STATUS_INFO[ev.status].kind === 'buff' ? 'info' : 'bad', 18);
            this.updateCard(u);
            await this.wait(110);
            break;
          case 'resist':
            this.float(u, 'Resisted', 'info', 18);
            await this.wait(80);
            break;
          case 'tm':
            this.updateCard(u);
            break;
          case 'skip':
            this.float(u, 'STUNNED', 'bad');
            await this.wait(650);
            break;
          case 'ko':
            this.updateCard(u);
            this.cards[u.uid].animate([{ transform: 'scale(1)' }, { transform: 'scale(1.1) rotate(-3deg)' }, { transform: 'scale(0.92)' }], { duration: 500 / this.speed });
            await this.wait(450);
            break;
          case 'log':
            this.log(ev.text, ev.side || '');
            break;
          default:
            if (u) this.updateCard(u);
        }
      }
      this.updateAll();
      this.updateTurnOrder();
      await this.wait(260);
    },

    center(uid) {
      const fr = this.field.getBoundingClientRect();
      const r = this.cards[uid].getBoundingClientRect();
      return { x: r.left - fr.left + r.width / 2, y: r.top - fr.top + r.height / 2 };
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
      if (ev.ultimate) {
        this.log(`★ ${actor.def.name} unleashes ${ab.name}!`, 'ult');
        await this.cutscene(actor, ab);
        this.field.classList.remove('shake');
        void this.field.offsetWidth;
        this.field.classList.add('shake');
      } else if (ev.abilityIndex > 0) {
        this.banner(ab.name, actor.side);
      }
      const motion = !reducedMotion();
      const targets = ev.targets.map((uid) => this.battle.get(uid));

      if (!ev.offensive) {
        if (motion) card.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.8) drop-shadow(0 0 16px #52e08a)' }, { filter: 'brightness(1)' }], { duration: 500 / this.speed });
        for (const t of targets) this.wave(this.center(t.uid), actor.side === 'player' ? '#52e08a' : '#ffb46b');
        await this.wait(380);
        return;
      }

      const from = this.center(actor.uid);
      if (actor.def.kind === 'ship') {
        const color = actor.def.faction === 'light' ? '#ff3b3b' : '#3bff6a';
        const bolts = ev.ultimate ? 4 : ab.effects.some((e) => e.hits > 1) ? 3 : 2;
        if (motion) card.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${actor.side === 'player' ? 6 : -6}px)` }, { transform: 'translateY(0)' }], { duration: 300 / this.speed });
        targets.forEach((t) => {
          for (let i = 0; i < bolts; i++) this.laser(from, this.center(t.uid), color, i * 90);
        });
        await this.wait(260 + bolts * 50);
        return;
      }

      // Characters: lunge at single targets, shockwave for area attacks.
      if (ev.aoe) {
        if (motion) card.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 420 / this.speed });
        this.wave(from, actor.def.faction === 'light' ? '#5ab4ff' : '#ff4b4b', 7);
        await this.wait(300);
        return;
      }
      const to = this.center(targets[0].uid);
      if (motion) {
        card.animate([
          { transform: 'translate(0,0) scale(1)' },
          { transform: `translate(${(to.x - from.x) * 0.4}px, ${(to.y - from.y) * 0.4}px) scale(1.1)`, offset: 0.45 },
          { transform: 'translate(0,0) scale(1)' },
        ], { duration: 460 / this.speed, easing: 'cubic-bezier(.3,.7,.3,1)' });
      }
      await this.wait(200);
      this.slash(to, actor.def.accent);
    },

    laser(from, to, color, delay) {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.hypot(dx, dy);
      const ang = Math.atan2(dy, dx);
      const jitter = (Math.random() - 0.5) * 14;
      const bolt = el('<div class="laser"></div>');
      bolt.style.left = from.x + 'px';
      bolt.style.top = from.y + jitter + 'px';
      bolt.style.width = '34px';
      bolt.style.setProperty('--bolt', color);
      bolt.style.opacity = '0';
      this.fx.appendChild(bolt);
      const anim = bolt.animate([
        { transform: `rotate(${ang}rad) translateX(0)`, opacity: 1 },
        { transform: `rotate(${ang}rad) translateX(${Math.max(0, len - 34)}px)`, opacity: 1 },
      ], { duration: 240 / this.speed, delay: delay / this.speed, easing: 'linear' });
      anim.onfinish = () => {
        bolt.remove();
        this.wave(to, color, 1.6);
      };
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

    slash(pos, color) {
      const s = el('<div class="slash"></div>');
      s.style.left = pos.x + 'px';
      s.style.top = pos.y + 'px';
      s.style.setProperty('--wave', color || '#fff');
      this.fx.appendChild(s);
      const rot = -30 + Math.random() * 20;
      s.animate([
        { transform: `rotate(${rot}deg) scaleX(0)`, opacity: 1 },
        { transform: `rotate(${rot}deg) scaleX(1.2)`, opacity: 1, offset: 0.4 },
        { transform: `rotate(${rot}deg) scaleX(1.4)`, opacity: 0 },
      ], { duration: 320 / this.speed }).onfinish = () => s.remove();
    },

    hit(u, ev) {
      this.updateCard(u);
      const card = this.cards[u.uid];
      if (ev.source === 'burn') {
        this.float(u, `🔥 ${fmt(ev.amount)}`, 'dmg');
      } else {
        this.float(u, fmt(ev.amount), ev.crit ? 'crit' : 'dmg');
      }
      this.flash(u, 'flash-hit');
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
      card.classList.remove(cls);
      void card.offsetWidth;
      card.classList.add(cls);
      setTimeout(() => card.classList.remove(cls), 500);
    },

    float(u, text, cls, offset) {
      const card = this.cards[u.uid];
      const f = el(`<span class="float ${cls}">${esc(text)}</span>`);
      const stack = card.querySelectorAll('.float').length;
      f.style.top = `calc(30% + ${(offset || 0) + stack * 16}px)`;
      card.appendChild(f);
      setTimeout(() => f.remove(), 1200 / this.speed);
    },

    // ---------- Cinematics ----------
    cutscene(actor, ab) {
      return new Promise((resolve) => {
        const speed = Math.min(this.speed, 2);
        const who = `${actor.side === 'player' ? 'Ally' : 'Enemy'} ultimate · ${actor.def.name}`;
        const node = el(`<div class="cutscene ${actor.side}" style="--speed:${speed}" role="presentation">
          <div class="cs-rays"></div>
          <div class="cs-stripe"></div>
          <div class="cs-bar top"></div>
          <div class="cs-bar bottom"></div>
          <div class="cs-content">
            <div class="cs-portrait">${portrait(actor.def)}</div>
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
      this.setActive(null);
    },

    async finish(winner) {
      this.ended = true;
      this.setActive(null);
      await this.wait(500);
      const won = winner === 'player';
      const rewards = Player.completeStage(this.kind, this.stageIndex, won);
      this.teardown();
      updateWallet();
      const isLast = this.stageIndex === D.CAMPAIGNS[this.kind].stages.length - 1;
      const nextUnlocked = won && !isLast;
      const m = openModal(`
        <div class="result-title ${won ? 'win' : 'lose'}">${won ? 'VICTORY' : 'DEFEAT'}</div>
        ${won ? `<div class="rewards">
            <span class="reward">¢ ${fmt(rewards.credits)}</span>
            ${rewards.crystals ? `<span class="reward first">◆ ${rewards.crystals} first clear</span>` : ''}
          </div>
          ${rewards.firstClear && isLast ? '<p class="muted">You conquered the whole campaign. The galaxy is yours, Commander.</p>' : ''}`
        : '<p class="muted">Train your units in the Collection, or open packs in the Shop to recruit stronger ones, then try again.</p>'}
        <div class="modal-actions">
          <button class="btn" type="button" data-r="retry">Retry</button>
          ${won ? '' : '<button class="btn" type="button" data-r="collection">Collection</button>'}
          ${nextUnlocked ? '<button class="btn btn-primary" type="button" data-r="next">Next stage</button>' : '<button class="btn btn-primary" type="button" data-r="campaign">Continue</button>'}
        </div>`, { small: true, dismissable: false });
      m.root.addEventListener('click', (e) => {
        const r = e.target.closest('[data-r]');
        if (!r) return;
        m.close();
        if (r.dataset.r === 'retry') App.go('squad', { kind: this.kind, stage: this.stageIndex });
        else if (r.dataset.r === 'next') App.go('squad', { kind: this.kind, stage: this.stageIndex + 1 });
        else App.go(r.dataset.r);
      });
    },
  };

  root.BattleUI = BattleUI;
})(window);
