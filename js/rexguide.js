// Captain Rex's walkthroughs for the new Commander profile (update 2.2).
//  - Returning players: Rex shows where everything moved, once.
//  - New players: the same profile walk runs at the end of the first-run
//    tutorial, and Rex promises to come back at level 5.
//  - Level 5: Rex comes back and teaches Friends.
// Each step glows the thing to tap and waits for the tap, like the main
// tutorial. Waiting for the owner's OK: until APPROVED is true only testers
// (the HOLOSAVE21 code) see it, and the code replays the tour every time.
(function (root) {
  'use strict';
  const APPROVED = false;
  const KEY = 'swcg-rex-guide';
  const D = root.GameData;
  const T = () => root.Tutorial;
  const ui = () => root.UI;
  const live = () => !!(root.Update22 && root.Update22.on());
  const on = () => APPROVED && live();
  const seen = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } };
  const mark = (k) => { const s = seen(); s[k] = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignore */ } };
  const $ = (sel) => document.querySelector(sel);
  let running = false;
  let testerRun = false;
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
  // Nothing in the way: not mid-battle, no pop-up, no tutorial or cutscene.
  const clear = () => !ui().App.battleActive && !$('.modal-backdrop') && !$('.tut-intro, .tut-coach, .feat-show, .feat-cine, .rank-up, .walkout, .hc');

  // Rex's full-screen briefing (the same look as the first-run tutorial).
  function brief(lines, button, then) {
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
      if (e.target.closest('[data-go]')) { node.classList.add('out'); setTimeout(() => node.remove(), 350); return then(); }
      if (i < lines.length - 1) { i += 1; show(); if (root.Sound) root.Sound.play('click'); }
    });
  }

  // The profile walk. fresh = a brand-new player at the end of the tutorial.
  function profileTour(fresh) {
    if (running) return;
    running = true;
    const frOn = () => !!(root.Friends && root.Friends.unlocked());
    const tab = (k) => $(`[data-p2t="${k}"].on`);
    const steps = [
      () => { coach(fresh ? 'One last thing, Commander. Tap your <b>level</b> up here to open your <b>Commander profile</b>.' : 'Tap your <b>level</b> up here to open your <b>Commander profile</b>.', '[data-profile]'); waitFor(() => $('.p2-modal'), next); },
      () => coach('This is you. Tap your <b>picture</b> any time to change it.', '.p2-pic', { next, label: 'Got it', bottom: true }),
      () => { coach('Tap your <b>level</b>, the ring or the bar, to see your rank, your next reward and what unlocks next.', '.p2-ring, .p2-lvbtn', { bottom: true }); waitFor(() => $('.p2-lv-modal'), next); },
      () => { coach('Everything you\'ll unlock soon is listed here. Tap <b>Got it</b> when you\'re ready.', '.p2-lv-modal [data-close]', { bottom: true }); waitFor(() => !$('.p2-lv-modal'), next); },
      () => { coach('<b>Collection</b>: every card you own by rarity, and the ones still out there to find. Tap it.', '[data-p2t="collection"]', { bottom: true }); waitFor(() => tab('collection'), next); },
      () => { coach('<b>Worlds</b>: a world lights up in full colour once you clear every stage and beat every boss on it. Tap it.', '[data-p2t="worlds"]', { bottom: true }); waitFor(() => tab('worlds'), next); },
      () => { coach('<b>Badges</b>: the ones you\'ve earned, how close you are to the rest, and a few secret ones. Tap it.', '[data-p2t="badges"]', { bottom: true }); waitFor(() => tab('badges'), next); },
      () => { coach('<b>Stats</b>: all your records. HoloNet stats join them once you reach level 25. Tap it.', '[data-p2t="stats"]', { bottom: true }); waitFor(() => tab('stats'), next); },
      () => { coach('And <b>Friends</b>. Tap it.', '[data-p2t="friends"]', { bottom: true }); waitFor(() => tab('friends'), next); },
      () => coach(frOn()
        ? 'Add pilots by their callsign, chat, and challenge them to friendly battles. A red number on the <b>Friends</b> button means a new request or message.'
        : `Friends unlock at level ${root.Friends ? root.Friends.LEVEL : 5}. Keep fighting, Commander. When you get there, I'll come find you.`, '[data-p2t="friends"]', { next, label: 'Done', bottom: true }),
      () => { end(); mark('tour'); if (testerRun && frOn()) { testerRun = false; setTimeout(friendsLesson, 900); } },
    ];
    let i = 0;
    function next() { if (running && i < steps.length) steps[i++](); }
    next();
  }

  // Returning players: Rex explains, then walks them through.
  function returning() {
    if (running) return;
    brief([
      'Commander! Rex here. While you were out, we put everything about you in one place: your Commander profile.',
      'Your picture, your level, your collection, worlds, badges, friends and stats. Let me walk you through it.',
    ], 'Show me', () => profileTour(false));
  }

  // Level 5: Rex keeps his promise and teaches Friends.
  function friendsLesson() {
    if (running) return;
    const x = $('.p2-modal [data-p2="close"]');
    if (x) x.click();
    brief([
      'Level 5, Commander! Told you I\'d find you.',
      'You\'ve unlocked Friends: add other pilots, chat with them, and challenge them to friendly battles.',
    ], 'Show me', () => {
      running = true;
      const steps = [
        () => { coach('Tap the <b>Friends</b> button up here.', '.friends-btn'); waitFor(() => $('.frp-modal'), next); },
        () => { coach('Tap <b>Add</b>, then type a pilot\'s callsign to send them a friend request.', '[data-tab="add"]'); waitFor(() => $('[data-tab="add"].on'), next); },
        () => coach('Share <b>your</b> callsign too, so friends can add you. Requests you get show up under <b>Requests</b>.', '[data-tab="req"]', { next }),
        () => coach('When a friend is online, tap <b>Ground</b> or <b>Fleet</b> to challenge them, or <b>Chat</b> to talk. A red number on the Friends button means something new. Good luck out there.', '.friends-btn', { next, label: 'Done' }),
        () => { end(); mark('fr5'); },
      ];
      let i = 0;
      function next() { if (running && i < steps.length) steps[i++](); }
      next();
    });
  }

  // When it starts by itself (after approval, from 2.2 on).
  function boot() {
    if (!on() || !root.Player || !root.ProfileV2) return;
    const s = root.Player.state;
    const done = s.tutorial && (s.tutorial.done || s.tutorial.badge || s.tutorial.skipped);
    // Returning players get the tour once, when nothing else is on screen.
    if (done && !seen().tour) { running = true; waitFor(clear, () => { running = false; returning(); }); }
    // Level 5: the Friends lesson, once.
    const P = root.Player;
    if (!P.__rexg) {
      P.__rexg = true;
      const gain = P.gainXp;
      P.gainXp = function () {
        const r = gain.apply(this, arguments);
        if (on() && !seen().fr5 && root.Friends && root.Friends.unlocked()) { running = true; waitFor(clear, () => { running = false; friendsLesson(); }); }
        return r;
      };
    }
    // New players: the profile walk follows the first-run tutorial.
    const Tu = T();
    if (Tu && !Tu.__rexg) {
      Tu.__rexg = true;
      const welcome = Tu.welcome;
      Tu.welcome = function () {
        const r = welcome.apply(this, arguments);
        if (on()) { running = true; waitFor(clear, () => { running = false; mark('tour'); profileTour(true); }); }
        return r;
      };
    }
  }

  // Testers: the code plays the cutscene now (and turns the new profile on for this device).
  function tester() {
    if (root.ProfileV2) root.ProfileV2.preview(true);
    end();
    document.querySelectorAll('.modal-backdrop').forEach((m) => m.remove());
    ui().App.go('home');
    testerRun = true;
    setTimeout(returning, 500);
  }

  root.RexGuide = { returning, friendsLesson, profileTour, tester, boot, end };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 1500));
  else setTimeout(boot, 1500);
})(window);
