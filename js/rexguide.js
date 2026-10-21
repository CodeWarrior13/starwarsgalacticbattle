// Captain Rex's walkthroughs for the Commander profile (update 2.2).
//  - Everyone who hasn't seen it: Rex shows the profile once (forced, after
//    the update log). From level 5 the same walk carries straight on into
//    making a profile (callsign and picture) and Friends.
//  - New players: the walk follows the first-run tutorial; Friends are still
//    locked, so Rex promises to come back at level 5.
//  - Level 5: Rex comes back, helps make a profile and teaches Friends.
// Replaying the tutorial (for the secret badge) never brings any of it back.
// Each step glows the thing to tap and waits for the tap, like the main
// tutorial. Live with 2.2; testers get it now (the HOLOSAVE21 code also
// replays it every time).
(function (root) {
  'use strict';
  const KEY = 'swcg-rex-guide';
  const D = root.GameData;
  const T = () => root.Tutorial;
  const ui = () => root.UI;
  const U22 = () => root.Update22;
  const on = () => !!(U22() && (U22().on() || (U22().test && U22().test())));
  const seen = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } };
  const mark = (k) => { const s = seen(); s[k] = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignore */ } };
  const $ = (sel) => document.querySelector(sel);
  const frOn = () => !!(root.Friends && root.Friends.unlocked());
  const named = () => !!(root.Player && root.Player.state.hn && root.Player.state.hn.prof && root.Player.state.hn.prof.tag);
  let running = false;
  let waits = [];

  // Run cb once test() is true; every wait is cleared when the guide ends.
  function waitFor(test, cb) {
    const t = setInterval(() => { if (!running) return clearInterval(t); if (test()) { clearInterval(t); cb(); } }, 250);
    waits.push(t);
  }
  const coach = (text, glow, opts) => T().coach(text, glow, { tour: true, ...(opts || {}) });
  function end() {
    running = false;
    waits.forEach(clearInterval);
    waits = [];
    T().clearCoach();
  }
  // Nothing in the way: not mid-battle, no pop-up (the update log included), no tutorial or cutscene.
  const clear = () => !ui().App.battleActive && !$('.modal-backdrop') && !$('.tut-intro, .tut-coach, .tut-skip, .tut-victory, .tut-welcome, .feat-show, .feat-cine, .rank-up, .walkout, .hc');
  // Waits for a clear screen without blocking anything else.
  function whenClear(fn) {
    const t = setInterval(() => { if (!running && !briefing && clear()) { clearInterval(t); fn(); } }, 600);
  }

  // Rex's full-screen briefing (the same look as the first-run tutorial).
  let briefing = false;
  function brief(lines, button, then) {
    if (briefing || $('.tut-intro')) return;
    briefing = true;
    const rex = D.UNIT_MAP.captain_rex;
    const node = ui().el(`<div class="tut-intro" role="dialog" aria-label="Captain Rex">
      <div class="ti-glow"></div>
      <p class="eyebrow ti-eye">Captain Rex</p>
      <div class="ti-mentor">${ui().portrait(rex, { plate: false })}</div>
      <div class="ti-box"><b>${ui().esc(rex.name)}</b><p data-line></p><span class="ti-next" data-next>Tap to continue</span></div>
    </div>`);
    document.body.appendChild(node);
    if (root.Sound) root.Sound.play('whoosh');
    let i = 0;
    const line = node.querySelector('[data-line]');
    const show = () => {
      line.textContent = lines[i];
      line.classList.remove('in'); void line.offsetWidth; line.classList.add('in');
      if (i === lines.length - 1) node.querySelector('[data-next]').outerHTML = `<button class="btn btn-primary ti-go" type="button" data-go>${button}</button>`;
    };
    show();
    node.addEventListener('click', (e) => {
      if (e.target.closest('[data-go]')) { briefing = false; node.classList.add('out'); setTimeout(() => node.remove(), 350); return then(); }
      if (i < lines.length - 1) { i += 1; show(); if (root.Sound) root.Sound.play('click'); }
    });
  }

  // Steps run one after another; each calls next() when it's done.
  function run(steps) {
    running = true;
    let i = 0;
    const next = () => { if (running && i < steps.length) steps[i++](next); };
    next();
  }
  const closeProfile = () => { const x = $('.p2-modal [data-p2="close"]'); if (x) x.click(); };

  // Make a profile (callsign + picture), or carry on as a guest.
  function profileStep(next, done) {
    if (named()) return next();
    const guest = () => coach('No problem. The <b>Add profile</b> button stays on your profile until you make one. Friends need a profile, so make one whenever you want to add friends.', '', { next: done, label: 'Got it' });
    coach('First, let\'s make your <b>profile</b>: pick a callsign and a picture. A profile lets you connect with other pilots, and once you save your game in Settings you can play on any device.', '', { next: () => {
      T().clearCoach();
      closeProfile();
      if (!root.Account || !root.Account.profile) return next();
      root.Account.profile(() => (named() ? next() : guest()), false);
    }, label: 'Make my profile' });
    const box = $('.tut-coach');
    if (box) {
      box.classList.add('two');
      const g = ui().el('<button class="btn btn-small" type="button">Keep playing as guest</button>');
      g.addEventListener('click', (e) => { e.stopPropagation(); guest(); });
      box.appendChild(g);
    }
  }

  // Friends, from the Friends button up top.
  const friendSteps = [
    (next) => { coach('Tap the <b>Friends</b> button up here.', '.friends-btn'); waitFor(() => $('.frp-modal'), next); },
    (next) => { coach('Tap <b>Add</b>, then type a pilot\'s callsign to send them a friend request.', '[data-tab="add"]'); waitFor(() => $('[data-tab="add"].on'), next); },
    (next) => coach('Share <b>your</b> callsign too, so friends can add you. Requests you get show up under <b>Requests</b>.', '[data-tab="req"]', { next }),
    (next) => coach('When a friend is online, tap <b>Ground</b> or <b>Fleet</b> to challenge them, or <b>Chat</b> to talk. A red number on the Friends button means something new. Good luck out there, Commander.', '.friends-btn', { next, label: 'Done' }),
  ];

  // The profile walk. fresh = a brand-new player at the end of the tutorial.
  function profileTour(fresh) {
    if (running) return;
    const tab = (k) => $(`[data-p2t="${k}"].on`);
    const finish = () => { end(); mark('tour'); if (frOn()) mark('fr5'); };
    run([
      (next) => { coach(fresh ? 'One last thing, Commander. Tap your <b>level</b> up here to open your <b>Commander profile</b>.' : 'Tap your <b>level</b> up here to open your <b>Commander profile</b>.', '[data-profile]'); waitFor(() => $('.p2-modal'), next); },
      (next) => coach(named() ? 'This is you. Tap your <b>picture</b> any time to change it.' : 'This is you. Tap your <b>picture</b> any time to change it. Until you make a profile you show up as a <b>Guest</b>.', '.p2-pic', { next, label: 'Got it', bottom: true }),
      (next) => { coach('Tap your <b>level</b>, the ring or the bar, to see your rank, your next reward and what unlocks next.', '.p2-ring, .p2-lvbtn', { bottom: true }); waitFor(() => $('.p2-lv-modal'), next); },
      (next) => { coach('Everything you\'ll unlock soon is listed here. Tap <b>Got it</b> when you\'re ready.', '.p2-lv-modal [data-close]', { bottom: true }); waitFor(() => !$('.p2-lv-modal'), next); },
      (next) => { coach('<b>Collection</b>: every card you own by rarity, and the ones still out there to find. Tap it.', '[data-p2t="collection"]', { bottom: true }); waitFor(() => tab('collection'), next); },
      (next) => { coach('<b>Worlds</b>: a world lights up in full colour once you clear every stage and beat every boss on it. Tap it.', '[data-p2t="worlds"]', { bottom: true }); waitFor(() => tab('worlds'), next); },
      (next) => { coach('<b>Badges</b>: the ones you\'ve earned, how close you are to the rest, and a few secret ones. Tap it.', '[data-p2t="badges"]', { bottom: true }); waitFor(() => tab('badges'), next); },
      (next) => { coach('<b>Stats</b>: all your records. HoloNet stats join them once you reach level 25. Tap it.', '[data-p2t="stats"]', { bottom: true }); waitFor(() => tab('stats'), next); },
      (next) => { coach('And <b>Friends</b>. Tap it.', '[data-p2t="friends"]', { bottom: true }); waitFor(() => tab('friends'), next); },
      (next) => {
        if (!frOn()) return coach(`Friends unlock at level ${root.Friends ? root.Friends.LEVEL : 5}. Keep fighting, Commander. When you get there, I'll come find you.`, '[data-p2t="friends"]', { next: finish, label: 'Done', bottom: true });
        return coach('You\'ve already unlocked Friends: add other pilots, chat with them, and challenge them to friendly battles. Let me show you.', '[data-p2t="friends"]', { next, label: 'Show me', bottom: true });
      },
      (next) => profileStep(() => { closeProfile(); setTimeout(next, 400); }, finish),
      ...friendSteps,
      () => finish(),
    ]);
  }

  // Everyone who hasn't seen it: Rex explains, then walks them through.
  function returning() {
    if (running) return;
    brief([
      'Commander! Rex here. We\'ve put everything about you in one place: your Commander profile.',
      'Your picture, your level, your collection, worlds, badges, friends and stats. Let me walk you through it.',
    ], 'Show me', () => profileTour(false));
  }

  // Level 5 (after the profile walk): Rex keeps his promise.
  function friendsLesson() {
    if (running) return;
    closeProfile();
    brief([
      'Level 5, Commander! Told you I\'d find you.',
      'You\'ve unlocked Friends: add other pilots, chat with them, and challenge them to friendly battles. Let\'s get you set up.',
    ], 'Let\'s go', () => {
      const finish = () => { end(); mark('fr5'); };
      run([(next) => profileStep(next, finish), ...friendSteps, () => finish()]);
    });
  }

  // When it starts by itself (from 2.2; testers now).
  let booted = false;
  function boot() {
    if (booted || !on() || !root.Player || !root.ProfileV2) return;
    booted = true;
    const P = root.Player;
    const tut = P.state.tutorial || {};
    const done = tut.done || tut.badge || tut.skipped;
    // Not seen yet: the walk, forced, once the screen is clear (after the update log).
    if (done && !seen().tour) whenClear(() => returning());
    else if (done && frOn() && !seen().fr5) whenClear(() => friendsLesson());
    // Reaching level 5 later on: the Friends lesson, once.
    if (!P.__rexg) {
      P.__rexg = true;
      const gain = P.gainXp;
      P.gainXp = function () {
        const r = gain.apply(this, arguments);
        if (on() && seen().tour && !seen().fr5 && frOn()) whenClear(() => { if (!seen().fr5) friendsLesson(); });
        return r;
      };
    }
    // New players: the profile walk follows the first-run tutorial (never a replay).
    const Tu = T();
    if (Tu && !Tu.__rexg) {
      Tu.__rexg = true;
      const welcome = Tu.welcome;
      Tu.welcome = function () {
        const r = welcome.apply(this, arguments);
        const again = Tu.res && Tu.res.again;
        if (on() && !again && !seen().tour) { mark('tour'); whenClear(() => profileTour(true)); }
        return r;
      };
    }
  }

  // Testers: the code plays it all now (and turns the new profile on for this device).
  function tester() {
    if (root.ProfileV2) root.ProfileV2.preview(true);
    end();
    briefing = false;
    document.querySelectorAll('.tut-intro').forEach((n) => n.remove());
    document.querySelectorAll('.modal-backdrop').forEach((m) => m.remove());
    ui().App.go('home');
    mark('tour');
    setTimeout(returning, 500);
  }

  root.RexGuide = { returning, friendsLesson, profileTour, tester, boot, end };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 1500));
  else setTimeout(boot, 1500);
  // The tester code switched on mid-session starts it too.
  setInterval(() => { if (!booted) boot(); }, 5000);
})(window);
