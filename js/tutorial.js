// First-run tutorial: Captain Rex briefs a new commander and coaches them
// through two training battles (a ground fight on Tatooine, then a dogfight
// above it), which quietly cannot be lost. Winning brings in the starter squad
// and resources and awards the Tutorial Complete badge. It runs once per save;
// a hold-to-skip button is offered for the first 10 s.
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
    allowAuto: false,
    stage: 1,
    turn: 0,
    shown: new Set(),
    glowSel: null,

    // ---------- Battle setup ----------
    // Stage 1 is a ground fight on Tatooine, stage 2 a dogfight above it.
    encounter(stage) {
      if (stage === 2) {
        return {
          type: 'tutorial', name: 'Training · Skies over Tatooine', kind: 'ship', planet: 'tatooine',
          // A real dogfight: tougher TIEs that take a few rounds to bring down.
          enemies: ['tie_fighter', 'tie_bomber', 'tie_interceptor'], level: 3, stars: 1, enemyScale: 1.05,
        };
      }
      return {
        type: 'tutorial', name: 'Training · Outpost Defense', kind: 'character', planet: 'tatooine',
        enemies: ['jawa', 'battle_droid', 'jawa'], level: 1, stars: 1, enemyScale: 0.6,
      };
    },

    // Three recruits from the starter squad (three starter ships for the dogfight).
    squad(stage) {
      const ids = stage === 2 ? ['a_wing', 'y_wing', 'z95'] : ['rebel_soldier', 'clone_trooper', 'ewok_warrior'];
      return ids.map((id) => ({ id, level: 3, stars: 1 }));
    },

    feat() {
      return { id: 'tutorial', tier: 1, icon: 'badge', name: 'Tutorial Complete', desc: 'Welcome to the galaxy', have: 1, need: 1 };
    },

    // ---------- Entry ----------
    start() {
      if (this.active) return;
      this.active = true;
      this.allowAuto = false;
      this.stage = 1;
      this.turn = 0;
      this.shown = new Set();
      this.intro();
      this.offerSkip();
    },

    intro() {
      const rex = D.UNIT_MAP[MENTOR];
      const lines = [
        'Commander! Captain Rex, 501st. Glad you made it.',
        'Imperial scouts just hit our outpost on Tatooine. I\'ve rounded up a few recruits for you.',
        'They\'re green, and so are you. Get out there and prove yourselves. I\'ll talk you through it.',
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
          root.BattleUI.start({ type: 'tutorial', stage: 1 });
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
      const node = el(`<div class="tut-coach ${opts.tip ? 'tip' : ''} ${opts.tour ? 'tour' : ''} ${opts.bottom ? 'bottom' : ''}" role="status">
        <span class="tc-face">${ui().portrait(rex, { plate: false })}</span>
        <p>${text}</p>
        ${opts.next ? `<button class="btn btn-small btn-primary" type="button" data-tc-next>${opts.label || 'Next'}</button>` : ''}
      </div>`);
      // In battle the bubble sits in the layout under the top bar, so it never
      // covers the turn order or the field; elsewhere it floats.
      const top = document.querySelector('body.in-battle .battle-top');
      if (top) top.after(node); else document.body.appendChild(node);
      this.glowSel = glow || null;
      this.reglow();
      if (opts.next) node.querySelector('[data-tc-next]').addEventListener('click', (e) => { e.stopPropagation(); opts.next(); });
      // In battle, a lesson tucks itself into a slim bar after a few seconds so
      // the cards (and their health) stay easy to see; tap the bar to reread it.
      if (top && !opts.next && !opts.auto) {
        setTimeout(() => node.isConnected && node.classList.add('mini'), opts.tip ? 5000 : 7000);
        node.addEventListener('click', () => node.classList.toggle('mini'));
      }
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
      if (actor.ult >= 100 && this.once(`ult${this.stage}`)) {
        return this.coach('<b>Ultimate ready!</b> The gold button is this unit\'s most powerful move. Unleash it.', '.abtn.ult');
      }
      return this.stage === 2 ? this.shipLesson(n) : this.groundLesson(n);
    },

    groundLesson(n) {
      const pl = D.PLANET_MAP.tatooine;
      if (n === 1) {
        return this.coach('This is your squad. The green bar is health: when it empties, that unit is out of the fight.', '.player-row .bcard', {
          next: () => this.coach('Your glowing unit is up. Pick an ability below, then tap a <b>glowing enemy</b> to attack.', '.ability-buttons .abtn:not([disabled]), .bcard.targetable'),
        });
      }
      if (n === 2 && this.once('abilities')) {
        return this.coach('Each ability does something different, so read the text on the buttons. A number on a button means it is cooling down for that many turns.', '.ability-buttons .abtn');
      }
      if (n === 3 && this.once('bars')) {
        return this.coach('Under each card: blue is the <b>turn meter</b> (full means it acts) and gold is the <b>Ultimate charge</b>, which fills as you deal and take hits.', '.player-row .bar.tm, .player-row .bar.ult');
      }
      if (n === 4 && this.once('synergy')) {
        return this.coach('These chips are <b>squad bonuses</b>. Every card has <b>traits</b> (Trooper, Rebel, Droid…). Field units that share a trait, like two Droids or two Troopers, and the whole squad gets stronger. The enemy gets them too!', '.syn-row .syn-chip', {
          next: () => this.coach('The numbers show progress: <b>2/2</b> means two matching units are fielded and the bonus is active. Some bonuses have higher tiers, so the more units share a trait, the bigger the boost. Tap a chip to read exactly what it gives.', '.syn-row.player .syn-chip'),
        });
      }
      if (n === 5 && this.once('planet')) {
        return this.coach(`Every planet fights differently. Tatooine's terrain is <b>${esc(pl.terrain.name)}</b>: ${esc(pl.terrain.desc)}`, '[data-log]', {
          next: () => this.coach(`Planets also have a <b>hazard</b>. Here a <b>${esc(pl.hazard.name)}</b> rolls in every ${pl.hazard.every} turns and drains everyone's turn meter (Natives shrug it off). Watch the battle log for warnings.`, '[data-log]'),
        });
      }
      if (n === 6 && this.once('focus')) {
        return this.coach('<b>Strategy:</b> focus your attacks. Finishing one enemy off means fewer hits coming back at you.', '.bcard.targetable', { tip: true });
      }
      if (n === 7 && this.once('numbers')) {
        return this.coach('<b>Tip:</b> the numbers on each ability show the damage or healing to expect, so you can plan your next move.', '.ability-buttons .astat', { tip: true });
      }
      return this.clearCoach();
    },

    shipLesson(n) {
      if (n === 1) {
        return this.coach('Fleet battles work just like ground fights, with ships instead of troops. Same buttons, same rules.', '.player-row .bcard', {
          next: () => this.coach('<b>Starfighters</b> strike fast, <b>bombers</b> hit hard and <b>gunships</b> soak up damage. A good fleet mixes them.', '.player-row .bcard'),
        });
      }
      if (n === 2 && this.once('shipbonus')) {
        return this.coach('Ships have <b>squad bonuses</b> too: fly matching types together and they power each other up.', '.syn-row .syn-chip');
      }
      if (n === 3 && this.once('shipfocus')) {
        return this.coach('<b>Tip:</b> the Interceptor is fast and the bomber hits hard. Pick your targets.', '.bcard.targetable', { tip: true });
      }
      if (n === 4 && this.once('auto')) {
        this.allowAuto = true;
        const view = document.querySelector('.battle.tutorial');
        if (view) view.classList.add('tut-auto');
        return this.coach('Meet <b>Auto</b>: tap it and your squad picks its own moves, which is handy for battles you\'ve already mastered. Tap it again to take back control.', '[data-auto]', {
          next: () => this.coach('The <b>speed</b> button (1×, 2×, 3×) plays the animations faster. Try Auto now if you like, or finish the fight yourself.', '[data-auto], [data-speed]'),
        });
      }
      return this.clearCoach();
    },

    onEnemy() {
      if (this.once(`enemy${this.stage}`)) this.coach(this.stage === 2 ? 'TIE fighters are fast. Keep an eye on the turn order at the top.' : 'Enemies take turns too. The strip at the top shows who moves next.', '[data-order]', { auto: 4200, tip: true });
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
      if (this.stage === 1) return this.interlude();
      return this.finale();
    },

    // Between the two fights: the ground is held, fighters are inbound.
    interlude() {
      const rex = D.UNIT_MAP[MENTOR];
      const node = el(`<div class="tut-intro tut-inter" role="dialog">
        <div class="ti-glow"></div>
        <div class="result-title win">GROUND SECURED</div>
        <div class="ti-mentor small">${ui().portrait(rex, { plate: false })}</div>
        <div class="ti-box"><b>${esc(rex.name)}</b><p class="in">Nice work, Commander. But it's not over: TIE fighters are inbound. Get to your ships!</p>
        <button class="btn btn-primary ti-go" type="button" data-go>Scramble fighters</button></div>
      </div>`);
      document.body.appendChild(node);
      if (root.Sound) root.Sound.play('victory');
      node.querySelector('[data-go]').addEventListener('click', () => {
        node.classList.add('out');
        setTimeout(() => node.remove(), 350);
        this.stage = 2;
        this.turn = 0;
        root.BattleUI.start({ type: 'tutorial', stage: 2 });
      });
    },

    // The reward moment, drawn out: Rex's word, the squad arriving card by
    // card, then the starting funds counting up.
    finale() {
      const res = Player.finishTutorial('completed') || { units: [], credits: 0, crystals: 0 };
      this.res = res;
      this.allowAuto = false;
      const B = root.BattleUI;
      if (B.prefs && B.prefs.auto) { B.prefs.auto = false; try { localStorage.setItem('swcg-battle-prefs', JSON.stringify(B.prefs)); } catch (e) { /* ignore */ } }
      ui().updateWallet();
      const fresh = res.units.length > 0;
      const back = root.Art.cardBack ? root.Art.cardBack('light') : '';
      // The six who fought arrive now; the other four come in the Recruit Crate.
      const cards = this.squadIds().map((id, k) => `<div class="tv-card" style="--k:${k}"><div class="tv-flip"><div class="tv-back">${back}</div><div class="tv-front">${ui().unitCard(D.UNIT_MAP[id], { tag: 'div', hideShards: true })}</div></div></div>`).join('');
      const node = el(`<div class="tut-victory staged" role="dialog" aria-label="Training complete">
        <div class="result-title win tv-a">TRAINING COMPLETE</div>
        <p class="tv-rex tv-b">${fresh ? '"Not bad, recruit. These troops have seen what you can do, and they\'re ready to follow you. Don\'t let them down."' : '"Outstanding, Commander. You\'ve clearly done this before."'}</p>
        <p class="eyebrow tv-c">${fresh ? 'Reinforcements arriving' : 'Your squad'}</p>
        <div class="tv-cards">${cards}</div>
        ${res.credits || res.crystals ? `<div class="tv-res"><span class="tv-coin">${ui().cur('credits', 0)}</span><span class="tv-kyber">${ui().cur('crystals', 0)}</span></div>` : ''}
        <div class="tv-stamp">SQUAD READY</div>
        <button class="btn btn-primary tv-go" type="button" data-tv-go>Continue</button>
      </div>`);
      document.body.appendChild(node);
      const S = root.Sound;
      const at = (ms, fn) => setTimeout(() => node.isConnected && fn(), ms);
      if (S) S.play('victory');
      const flips = node.querySelectorAll('.tv-card');
      flips.forEach((c, k) => at(2600 + k * 340, () => { c.classList.add('flipped'); if (S) S.play(k === flips.length - 1 ? 'reveal_rare' : 'click'); }));
      const countFrom = 2600 + flips.length * 340 + 300;
      const count = (sel, key, target, start) => {
        const box = node.querySelector(sel);
        if (!box || !target) return;
        const steps = 24;
        for (let i = 1; i <= steps; i++) at(start + i * 45, () => { box.innerHTML = ui().cur(key, Math.round((target * i) / steps)); box.classList.add('lit'); });
        at(start, () => S && S.play('coins'));
      };
      count('.tv-coin', 'credits', res.credits, countFrom);
      count('.tv-kyber', 'crystals', res.crystals, countFrom + 1300);
      at(countFrom + 2600, () => { node.classList.add('done'); if (S) S.play('rankup'); });
      node.querySelector('[data-tv-go]').addEventListener('click', () => {
        node.classList.add('out');
        setTimeout(() => node.remove(), 350);
        ui().App.go('home');
        // A replay skips the tour and goes straight to the Easter egg.
        if (res.again) {
          this.active = false;
          ui().markFeatSeen('tutorial_again');
          return setTimeout(() => ui().playFeat({ id: 'tutorial_again', secret: true, tier: 5, icon: 'badge', level: Player.state.tutorial.replays, rexUnlock: !!res.rex, name: 'Back for More?', desc: 'Oh, really? You just love the tutorial that much?', have: 1, need: 1 }), 450);
        }
        setTimeout(() => this.tour(), 450);
      });
    },

    squadIds() {
      return [...this.squad(1), ...this.squad(2)].map((u) => u.id);
    },

    crateIds() {
      const used = this.squadIds();
      return D.STARTER.units.filter((id) => !used.includes(id));
    },

    // After the battles: a guided tour of the galaxy, the collection (with a
    // real level-up), the Black Market and a one-time Recruit Crate.
    tour() {
      // First run only: replays never repeat the tour, the level-up or the crate.
      if (this.res && this.res.again) return;
      const App = ui().App;
      const T = { tour: true };
      const go = (fn, ms = 450) => setTimeout(fn, ms);
      const demo = 'rebel_soldier';
      const steps = [
        () => this.coach('<b>Galaxy:</b> liberate worlds stage by stage, fight bosses and climb the Endless Tower. Every world has its own terrain and hazard.', '.main-nav [data-nav="home"]', { ...T, next: step }),
        () => { App.go('collection'); go(() => this.coach('<b>Collection:</b> every card you own. The tags on a card are its <b>traits</b>: they decide which squad bonuses it helps unlock.', '.main-nav [data-nav="collection"]', { ...T, next: step })); },
        () => { ui().inspect(demo); go(() => this.coach('Each card has four pages: <b>Stats</b>, <b>Card</b>, <b>Upgrades</b> and <b>Ultimate</b>. Tap the tabs or swipe.', '.inspect .pager', { ...T, bottom: true, next: step })); },
        () => {
          const pg = document.querySelector('.inspect [data-page="2"]'); if (pg) pg.click();
          const u = Player.unit(demo);
          const startLv = u ? u.level : 1;
          Player.state.credits += D.levelCost(startLv);
          ui().updateWallet();
          go(() => {
            this.coach('<b>Upgrades</b> make cards stronger. <b>Level Up</b> spends credits for more health, attack and defense. This first one\'s on me: tap <b>Level Up</b>!', '[data-level]', { ...T, bottom: true, next: step, label: 'Skip' });
            const wait = setInterval(() => {
              const now = Player.unit(demo);
              if (!this.active || !document.querySelector('.inspect')) return clearInterval(wait);
              if (now && now.level > startLv) { clearInterval(wait); setTimeout(step, 700); }
            }, 300);
          });
        },
        () => this.coach('Nice! Duplicate cards turn into <b>shards</b>. Collect enough and you can add a <b>Star</b>: ranking up gives a big boost to every stat, and rarer cards can climb higher.', '[data-star]', { ...T, bottom: true, next: step }),
        () => { const pg = document.querySelector('.inspect [data-page="3"]'); if (pg) pg.click(); go(() => this.coach('The <b>Ultimate</b> page shows a card\'s most powerful move. Tap anywhere on this page to watch it in action.', '.ult-preview', { ...T, bottom: true, next: step })); },
        () => {
          const c = document.querySelector('.inspect-modal [data-close]'); if (c) c.click();
          App.go('market');
          go(() => this.coach('<b>Black Market:</b> claim a <b>daily reward</b> every day. Keep the streak going and the rewards get better.', '.daily-panel', { ...T, next: step }));
        },
        () => this.coach('<b>Crates</b> hold new cards and shards. Pricier crates have better odds. Below them are <b>Hot Stock</b> deals, <b>Lucky Charms</b> that boost your luck, and a <b>Sabacc</b> table.', '[data-pack]', { ...T, next: step }),
        () => this.coach('Recruitment Command sent you a <b>Recruit Crate</b>, just this once. Open it to meet the rest of your starter squad!', '', { ...T, next: step, label: 'Open crate' }),
        () => { this.clearCoach(); this.openRecruitCrate(); },
      ];
      let i = 0;
      const step = () => { if (i < steps.length) steps[i++](); };
      step();
    },

    openRecruitCrate() {
      const results = this.crateIds().map((id) => ({ id, isNew: true, shards: 0, holo: false }));
      // Wrap up once the crate is closed.
      ui().packReveal(results, 'recruit', { onClose: () => setTimeout(() => this.welcome(), 400) });
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
