// First-run tutorial: Captain Rex briefs a new commander, coaches them through
// a training battle on Tatooine (which quietly cannot be lost), then hands
// over the starter squad and resources and awards the Tutorial Complete badge.
// It runs once per save; a hold-to-skip button is offered for the first 10 s.
(function (root) {
  'use strict';

  const D = root.GameData;
  const MENTOR = 'captain_rex';
  const SKIP_WINDOW_MS = 10000;
  const HOLD_MS = 1200;

  const ui = () => root.UI;
  const el = (html) => ui().el(html);
  const esc = (s) => ui().esc(s);

  const Tutorial = {
    active: false,
    turn: 0,
    shown: new Set(),
    glowSel: null,

    // ---------- Battle setup ----------
    encounter() {
      return {
        type: 'tutorial', name: 'Training · Outpost Defense', kind: 'character', planet: 'tatooine',
        enemies: ['jawa', 'battle_droid', 'jawa'], level: 1, stars: 1, enemyScale: 0.6,
      };
    },

    // A loaned squad: three of the starter units with Rex fighting alongside.
    squad() {
      return [MENTOR, 'rebel_soldier', 'clone_trooper', 'ewok_warrior'].map((id) => ({ id, level: 3, stars: 1 }));
    },

    feat() {
      return { id: 'tutorial', tier: 1, icon: 'badge', name: 'Tutorial Complete', desc: 'Welcome to the galaxy', have: 1, need: 1 };
    },

    // ---------- Entry ----------
    start() {
      if (this.active) return;
      this.active = true;
      this.turn = 0;
      this.shown = new Set();
      this.intro();
      this.offerSkip();
    },

    intro() {
      const rex = D.UNIT_MAP[MENTOR];
      const lines = [
        'Commander! Captain Rex, 501st. Glad you made it.',
        'Imperial scouts just hit our outpost on Tatooine. I\'ll lend you a squad and show you how we fight.',
        'Win this one and that squad is yours to keep.',
      ];
      const node = el(`<div class="tut-intro" role="dialog" aria-label="Tutorial">
        <div class="ti-glow"></div>
        <p class="eyebrow ti-eye">Training · Tatooine Outpost</p>
        <div class="ti-mentor">${ui().portrait(rex, { plate: false })}</div>
        <div class="ti-box"><b>${esc(rex.name)}</b><p data-line></p><span class="ti-next" data-next>Tap to continue</span></div>
      </div>`);
      document.body.appendChild(node);
      if (root.Sound) root.Sound.play('whoosh');
      let i = 0;
      const line = node.querySelector('[data-line]');
      const next = node.querySelector('[data-next]');
      const show = () => {
        line.textContent = lines[i];
        line.classList.remove('in'); void line.offsetWidth; line.classList.add('in');
        if (i === lines.length - 1) next.outerHTML = '<button class="btn btn-primary ti-go" type="button" data-go>To battle!</button>';
      };
      show();
      node.addEventListener('click', (e) => {
        if (e.target.closest('[data-go]')) {
          node.classList.add('out');
          setTimeout(() => node.remove(), 350);
          root.BattleUI.start({ type: 'tutorial' });
          return;
        }
        if (i < lines.length - 1) { i += 1; show(); if (root.Sound) root.Sound.play('click'); }
      });
    },

    // ---------- Hold to skip ----------
    offerSkip() {
      const btn = el(`<button class="tut-skip" type="button" aria-label="Hold to skip the tutorial">
        <span class="ts-fill"></span><span class="ts-label">Hold to skip tutorial</span></button>`);
      document.body.appendChild(btn);
      let timer = null;
      const cancel = () => { clearTimeout(timer); timer = null; btn.classList.remove('holding'); };
      const begin = (e) => {
        e.preventDefault();
        if (timer) return;
        btn.classList.add('holding');
        timer = setTimeout(() => { cancel(); this.skip(); }, HOLD_MS);
      };
      btn.addEventListener('pointerdown', begin);
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, cancel));
      btn.addEventListener('contextmenu', (e) => e.preventDefault());
      this.skipBtn = btn;
      setTimeout(() => this.dropSkip(), SKIP_WINDOW_MS);
    },

    dropSkip() {
      const btn = this.skipBtn;
      if (!btn) return;
      this.skipBtn = null;
      btn.classList.add('out');
      setTimeout(() => btn.remove(), 400);
    },

    skip() {
      this.dropSkip();
      document.querySelectorAll('.tut-intro, .tut-coach').forEach((n) => n.remove());
      this.clearGlow();
      const B = root.BattleUI;
      if (ui().App.battleActive && B.params && B.params.type === 'tutorial') {
        B.ended = true;
        B.resolvePending(null);
        B.teardown();
        if (root.Sound) root.Sound.music('menu');
      }
      this.active = false;
      Player.finishTutorial('skipped');
      ui().markFeatSeen('tutorial');
      ui().updateWallet();
      ui().App.go('home');
      ui().toast('Tutorial skipped. Your starter squad is unlocked.');
    },

    // ---------- Coaching during the battle ----------
    coach(text, glow, opts = {}) {
      document.querySelectorAll('.tut-coach').forEach((n) => n.remove());
      this.clearGlow();
      const rex = D.UNIT_MAP[MENTOR];
      const node = el(`<div class="tut-coach ${opts.tip ? 'tip' : ''}" role="status">
        <span class="tc-face">${ui().portrait(rex, { plate: false })}</span>
        <p>${text}</p>
        ${opts.next ? '<button class="btn btn-small btn-primary" type="button" data-tc-next>Next</button>' : ''}
      </div>`);
      // In battle the bubble sits in the layout under the top bar, so it never
      // covers the turn order or the field; elsewhere it floats.
      const top = document.querySelector('body.in-battle .battle-top');
      if (top) top.after(node); else document.body.appendChild(node);
      this.glowSel = glow || null;
      this.reglow();
      if (opts.next) node.querySelector('[data-tc-next]').addEventListener('click', () => opts.next());
      if (opts.auto) setTimeout(() => { if (node.isConnected) { node.classList.add('out'); setTimeout(() => node.remove(), 300); if (this.glowSel === glow) this.clearGlow(); } }, opts.auto);
    },

    reglow() {
      document.querySelectorAll('.tut-glow').forEach((n) => n.classList.remove('tut-glow'));
      if (this.glowSel) document.querySelectorAll(this.glowSel).forEach((n) => n.classList.add('tut-glow'));
    },

    clearGlow() {
      this.glowSel = null;
      document.querySelectorAll('.tut-glow').forEach((n) => n.classList.remove('tut-glow'));
    },

    once(key) {
      if (this.shown.has(key)) return false;
      this.shown.add(key);
      return true;
    },

    // Called by the battle screen whenever it is the player's move.
    onTurn(B, actor) {
      this.turn += 1;
      const n = this.turn;
      if (actor.ult >= 100 && this.once('ult')) {
        return this.coach('<b>Ultimate ready!</b> The gold button is this unit\'s most powerful move. Unleash it.', '.abtn.ult');
      }
      if (n === 1) {
        return this.coach('This is your squad. The green bar is health: when it empties, that unit is out of the fight.', '.player-row .bcard', {
          next: () => this.coach('Your glowing unit is up. Pick an ability below, then tap a <b>glowing enemy</b> to attack.', '.ability-buttons .abtn:not([disabled]), .bcard.targetable'),
        });
      }
      if (n === 2 && this.once('abilities')) {
        return this.coach('Each ability does something different; read the text on the buttons. A number on a button means it is cooling down for that many turns.', '.ability-buttons .abtn');
      }
      if (n === 3 && this.once('bars')) {
        return this.coach('Under each card: blue is the <b>turn meter</b> (full means it acts) and gold is the <b>Ultimate charge</b>, which fills as you deal and take hits.', '.player-row .bar.tm, .player-row .bar.ult');
      }
      if (n === 4 && this.once('synergy') && document.querySelector('.syn-row.player .syn-chip')) {
        return this.coach('<b>Squad bonuses:</b> units that share a trait power each other up. Tap a bonus to see what it does, and build squads that match.', '.syn-row.player .syn-chip');
      }
      if (n === 5 && this.once('focus')) {
        return this.coach('<b>Strategy:</b> focus your attacks. Finishing one enemy off means fewer hits coming back at you.', '.bcard.targetable', { tip: true });
      }
      if (n === 6 && this.once('numbers')) {
        return this.coach('<b>Tip:</b> the numbers on each ability show the damage or healing to expect, so you can plan your next move.', '.ability-buttons .astat', { tip: true });
      }
      return this.clearCoach();
    },

    onEnemy() {
      if (this.once('enemy')) this.coach('Enemies take turns too. The strip at the top shows who moves next.', '[data-order]', { auto: 4200, tip: true });
    },

    // The player committed an action: drop the pointer glow (the text stays a beat).
    onAction() {
      this.clearGlow();
      const c = document.querySelector('.tut-coach:not(.tip)');
      if (c) { c.classList.add('out'); setTimeout(() => c.remove(), 300); }
    },

    clearCoach() {
      this.clearGlow();
      document.querySelectorAll('.tut-coach').forEach((n) => n.remove());
    },

    // ---------- Victory, rewards, tour and badge ----------
    victory() {
      this.clearCoach();
      this.dropSkip();
      const res = Player.finishTutorial('completed') || { units: [], credits: 0, crystals: 0 };
      ui().updateWallet();
      const cards = D.STARTER.units.map((id, k) => `<div class="tv-card" style="--k:${k}">${ui().unitCard(D.UNIT_MAP[id], { tag: 'div', hideShards: true })}</div>`).join('');
      const fresh = res.units.length > 0;
      const node = el(`<div class="tut-victory" role="dialog" aria-label="Training complete">
        <div class="result-title win">VICTORY</div>
        <p class="tv-rex">"Outstanding, Commander. ${fresh ? 'That squad is yours now.' : 'You\'ve clearly done this before.'}"</p>
        <p class="eyebrow">${fresh ? 'Starter squad unlocked' : 'Your starter squad'}</p>
        <div class="tv-cards">${cards}</div>
        ${res.credits || res.crystals ? `<div class="tv-res"><span>${ui().cur('credits', res.credits)}</span><span>${ui().cur('crystals', res.crystals)}</span></div>` : ''}
        <button class="btn btn-primary" type="button" data-tv-go>Continue</button>
      </div>`);
      document.body.appendChild(node);
      if (root.Sound) { root.Sound.play('victory'); setTimeout(() => root.Sound.play('coins'), 900); }
      node.querySelector('[data-tv-go]').addEventListener('click', () => {
        node.classList.add('out');
        setTimeout(() => node.remove(), 350);
        ui().App.go('home');
        setTimeout(() => this.tour(), 450);
      });
    },

    tour() {
      const steps = [
        ['home', '<b>Galaxy:</b> liberate worlds, fight bosses and climb the Endless Tower.'],
        ['collection', '<b>Collection:</b> upgrade your cards and build your squads.'],
        ['market', '<b>Black Market:</b> crates, deals and your daily rewards.'],
      ];
      let i = 0;
      const step = () => {
        if (i >= steps.length) { this.clearCoach(); return this.welcome(); }
        const [nav, text] = steps[i];
        i += 1;
        this.coach(text, `.main-nav [data-nav="${nav}"]`, { next: step });
      };
      step();
    },

    welcome() {
      this.active = false;
      const node = el(`<div class="tut-welcome" role="dialog"><p>Welcome to the galaxy,<br><b>Commander.</b></p></div>`);
      document.body.appendChild(node);
      if (root.Sound) root.Sound.play('rankup');
      setTimeout(() => {
        node.classList.add('out');
        setTimeout(() => node.remove(), 500);
        ui().markFeatSeen('tutorial');
        ui().playFeat(this.feat());
      }, 2300);
    },
  };

  root.Tutorial = Tutorial;
})(window);
