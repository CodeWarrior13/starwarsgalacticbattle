// Update 2.3: the Legendary Exchange. Once a week, at a random time, a Hutt
// broker opens his vault at the very bottom of the Black Market (under the
// gambling tables) for 30 minutes: 5 Aurodium Ingots for 15,000 credits, one
// trade per window. When it shuts (traded, not enough Ingots, or time's up) the
// shut vault stays for a silent 5 minutes, then it's gone until next week.
// Switched off until 2.3 (Update23).
(function (root) {
  'use strict';
  const D = root.GameData;
  const P = () => root.Player;
  const UI = () => root.UI;
  const live = () => !!(root.Update23 && root.Update23.on && root.Update23.on());
  const fmt = (n) => Number(n).toLocaleString('en-US');

  const WEEK = 7 * 864e5;
  const OPEN = 30 * 60e3;
  const LINGER = 5 * 60e3;
  const COST = 5;
  const PAYOUT = 15000;
  // Weeks run Monday to Sunday, Central time. Everyone gets the same window.
  const EPOCH = Date.UTC(2026, 0, 5, 6, 0, 0);
  const hash = (n) => {
    let x = Math.imul(n ^ 0x2c1b3c6d, 0x297a2d39) >>> 0;
    x = (x ^ (x >>> 15)) >>> 0; x = Math.imul(x, 0x85ebca6b) >>> 0; x = (x ^ (x >>> 13)) >>> 0;
    return x / 4294967296;
  };
  function windowFor(t) {
    // Tester switch: root.__lxForce = start time opens a window right then.
    if (root.__lxForce != null && t >= root.__lxForce && t < root.__lxForce + OPEN + LINGER) {
      const s = root.__lxForce;
      return { week: -1 - Math.floor(s / 1000), start: s, end: s + OPEN, gone: s + OPEN + LINGER };
    }
    const week = Math.floor((t - EPOCH) / WEEK);
    const start = EPOCH + week * WEEK + Math.floor(hash(week) * (WEEK - OPEN - LINGER));
    return { week, start, end: start + OPEN, gone: start + OPEN + LINGER };
  }

  function mine(w) {
    const s = P().state;
    if (!s.lx || s.lx.week !== w.week) s.lx = { week: w.week, traded: 0, at: 0, seen: 0 };
    return s.lx;
  }

  // hidden | open | broke | sold | timeup
  function status(now) {
    const t = now || Date.now();
    const w = windowFor(t);
    if (t < w.start || t >= w.gone) return { state: 'hidden', w };
    const me = mine(w);
    if (me.traded) return { state: t < me.at + LINGER ? 'sold' : 'hidden', w };
    if (t >= w.end) return { state: 'timeup', w };
    if ((P().state.aurodium || 0) < COST) return { state: 'broke', w };
    return { state: 'open', w };
  }

  function trade(now) {
    const t = now || Date.now();
    const st = status(t);
    if (st.state !== 'open') return { ok: false, why: st.state };
    const s = P().state;
    const cap = root.Update23 && root.Update23.CAPS ? root.Update23.CAPS.credits : Infinity;
    if (s.credits + PAYOUT > cap) return { ok: false, why: 'cap' };
    s.aurodium -= COST;
    s.credits += PAYOUT;
    const me = mine(st.w);
    me.traded = 1;
    me.at = t;
    P().save();
    return { ok: true };
  }

  // Oruba-style Hutt broker, drawn once and reused (viewBox 0 0 160 190).
  const HUTT = (() => {
  const spots = [[34, 150, 2.4], [42, 166, 1.8], [118, 160, 2.2], [126, 146, 1.6], [58, 176, 1.6], [104, 178, 2], [80, 164, 1.4], [70, 74, 1.2], [96, 70, 1.4], [62, 60, 1]];
  const veins = [
    'M40 130 q6 8 2 18 q-3 8 3 14', 'M120 128 q-5 10 0 18 q4 8 -2 16', 'M92 150 q4 6 1 12',
    'M60 66 q-4 4 -2 9', 'M100 62 q4 5 1 10', 'M70 156 q-3 6 1 12',
  ];
  const swirl = (x, y, s) => `<path d="M${x} ${y} c${3 * s} -6 ${9 * s} -6 ${10 * s} 0 c${1 * s} 5 ${-4 * s} 7 ${-6 * s} 3 c${-1 * s} -3 ${2 * s} -4 ${3 * s} -2" fill="none" stroke="#9a5cc0" stroke-width="1.6" stroke-linecap="round"/>`;

    return `<svg viewBox="0 0 160 190" aria-hidden="true">
  <defs>
   <radialGradient id="lxSk" cx=".36" cy=".3" r=".85"><stop offset="0" stop-color="#f2efe6"/><stop offset=".5" stop-color="#cfcabc"/><stop offset=".85" stop-color="#9c978b"/><stop offset="1" stop-color="#6e6a62"/></radialGradient>
   <radialGradient id="lxHd" cx=".4" cy=".28" r=".8"><stop offset="0" stop-color="#f4f1e9"/><stop offset=".55" stop-color="#cfcabd"/><stop offset="1" stop-color="#8e897e"/></radialGradient>
   <linearGradient id="lxBl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ece8dd"/><stop offset="1" stop-color="#bdb7a8"/></linearGradient>
   <linearGradient id="lxCp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3c3f7a"/><stop offset=".6" stop-color="#262857"/><stop offset="1" stop-color="#16173a"/></linearGradient>
   <linearGradient id="lxCap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3d6e"/><stop offset="1" stop-color="#1b1c3c"/></linearGradient>
   <linearGradient id="lxGd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0a0"/><stop offset=".5" stop-color="#d9a52a"/><stop offset="1" stop-color="#7a5200"/></linearGradient>
   <linearGradient id="lxSl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9b6c4"/><stop offset="1" stop-color="#7e7b8c"/></linearGradient>
  </defs>
  <!-- body: huge pear-shaped mass, wide base -->
  <path d="M12 186 C0 172 4 144 24 128 C28 112 42 102 56 98 L106 98 C120 102 134 112 138 128 C158 144 162 172 150 186Z" fill="url(#lxSk)"/>
  <path d="M14 186 C10 176 10 164 14 156" fill="none" stroke="#f6f3ea" stroke-width="2" opacity=".6"/>
  <path d="M14 186 Q80 194 148 186" fill="none" stroke="#5e5a52" stroke-width="2" opacity=".5"/>
  <g transform="translate(0 10)">
  <!-- belly rolls -->
  ${[100, 110, 121, 133].map((y, i) => `<path d="M${50 - i * 4} ${y} Q80 ${y + 8} ${112 + i * 4} ${y}" fill="none" stroke="#8e897e" stroke-width="2.2"/><path d="M${52 - i * 4} ${y + 2.4} Q80 ${y + 10} ${110 + i * 4} ${y + 2.4}" fill="none" stroke="#f8f5ee" stroke-width="1" opacity=".7"/>`).join('')}
  <!-- mottling, spots and faint red veins -->
  <ellipse cx="44" cy="170" rx="14" ry="7" fill="#a49e90" opacity=".35"/>
  <ellipse cx="120" cy="172" rx="12" ry="6" fill="#a49e90" opacity=".3"/>
  ${spots.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.75}" fill="#8f97a8" opacity=".55"/>`).join('')}
  ${veins.map((d) => `<path d="${d}" fill="none" stroke="#b5525a" stroke-width=".8" opacity=".55"/>`).join('')}
  <!-- cape: navy shawl over both shoulders, big drape across the front-left -->
  <path d="M30 112 C34 96 48 86 62 84 L66 98 C54 104 46 116 44 132 C40 146 30 150 24 142 C22 132 24 120 30 112Z" fill="url(#lxCp)"/>
  <path d="M98 84 C114 86 132 96 140 116 C146 130 142 144 134 150 C128 146 124 136 122 124 C118 108 108 98 96 96Z" fill="url(#lxCp)"/>
  <path d="M64 88 C84 82 112 84 132 100 C142 110 144 122 140 132 C120 142 92 146 70 140 C60 128 58 108 64 88Z" fill="url(#lxCp)"/>
  <path d="M64 88 C84 82 112 84 132 100" fill="none" stroke="#5a5ea6" stroke-width="1.6" opacity=".7"/>
  <path d="M72 96 C90 92 112 96 126 108" fill="none" stroke="#14152f" stroke-width="2" opacity=".6"/>
  <path d="M78 112 C94 110 114 114 128 122" fill="none" stroke="#14152f" stroke-width="1.6" opacity=".5"/>
  <!-- purple swirl embroidery along the hem -->
  <path d="M70 140 C92 146 120 142 140 132 L141 125 C120 135 92 139 69 133Z" fill="#2c1f4e"/>
  ${[[74, 137, 1], [86, 139, 1], [98, 139, 1.1], [110, 137, 1], [122, 134, 1], [132, 129, 0.9]].map(([x, y, s]) => swirl(x, y, s)).join('')}
  <path d="M24 142 C30 150 40 146 44 132 L40 130 C37 140 30 144 26 138Z" fill="#2c1f4e"/>
  ${swirl(28, 140, 0.8)}
  <!-- gold strap with ring fittings across the chest -->
  <path d="M36 108 Q74 96 124 94" fill="none" stroke="#5a3c00" stroke-width="5.4" stroke-linecap="round"/>
  <path d="M36 108 Q74 96 124 94" fill="none" stroke="url(#lxGd)" stroke-width="4" stroke-linecap="round"/>
  <path d="M44 112 Q76 106 104 106" fill="none" stroke="#c9a238" stroke-width="1.4" stroke-dasharray="2.2 1.4"/>
  ${[[48, 104], [58, 101.4], [68, 99.2]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#2a2a32" stroke="url(#lxGd)" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="1.2" fill="#d9a52a"/>`).join('')}
  ${[[84, 97], [96, 95.6], [108, 94.8]].map(([x, y]) => `<rect x="${x - 3}" y="${y - 2.6}" width="6" height="5.2" rx="1" fill="url(#lxGd)" stroke="#6a4600" stroke-width=".8"/>`).join('')}
  <!-- thin sleeved arm from under the cape, hand on the belly -->
  <path d="M120 124 C126 136 124 150 112 158" fill="none" stroke="url(#lxSl)" stroke-width="8" stroke-linecap="round"/>
  <path d="M120 124 C126 136 124 150 112 158" fill="none" stroke="#5e5b6c" stroke-width="1" opacity=".6"/>
  ${[0, 1, 2].map((i) => `<path d="M${121 - i * 1.5} ${132 + i * 7} q4 1 6 -1" fill="none" stroke="#5e5b6c" stroke-width=".8" opacity=".7"/>`).join('')}
  <path d="M106 154 C112 150 120 152 120 158 C120 162 117 164 113 164 C109 164 105 160 106 154Z" fill="#d6d1c4" stroke="#6e6a62" stroke-width="1"/>
  ${[[106, 160, 101, 172], [109, 163, 106, 175], [113, 164, 112, 176], [117, 163, 118, 174]].map(([x1, y1, x2, y2]) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2 - 1} ${(y1 + y2) / 2} ${x2} ${y2}" stroke="#d6d1c4" stroke-width="3.4" stroke-linecap="round" fill="none"/><path d="M${x1} ${y1} Q${(x1 + x2) / 2 - 1} ${(y1 + y2) / 2} ${x2} ${y2}" stroke="#6e6a62" stroke-width=".7" fill="none" opacity=".7"/>`).join('')}
  <path d="M118 156 q5 2 6 7" stroke="#d6d1c4" stroke-width="3" stroke-linecap="round" fill="none"/>
  </g>
  <!-- stacked chins / neck: three thick folds -->
  <path d="M44 100 C46 86 114 86 116 100 C108 110 52 110 44 100Z" fill="url(#lxBl)"/>
  <path d="M46 99 Q80 112 114 99" fill="none" stroke="#8e897e" stroke-width="2"/>
  <path d="M48 92 C50 80 110 80 112 92 C104 100 56 100 48 92Z" fill="url(#lxBl)"/>
  <path d="M50 91 Q80 102 110 91" fill="none" stroke="#8e897e" stroke-width="1.8"/>
  <path d="M52 85 Q80 95 108 85" fill="none" stroke="#f8f5ee" stroke-width="1" opacity=".7"/>
  <!-- tall narrow head: flat-ish top, widening into heavy jowls -->
  <path d="M60 22 C60 12 66 8 80 8 C94 8 100 12 100 22 L101 52 C108 60 112 72 108 82 C100 90 60 90 52 82 C48 72 52 60 59 52Z" fill="url(#lxHd)"/>
  <path d="M100 26 L101 52 C108 60 112 72 108 82 C104 86 96 88 90 88 C100 80 102 62 96 50Z" fill="#000" opacity=".1"/>
  <path d="M62 16 C66 12 94 12 98 16" fill="none" stroke="#fffdf6" stroke-width="2" opacity=".7"/>
  <!-- head ridges / wrinkles -->
  <path d="M64 20 Q80 17 96 20 M63 24 Q80 21 97 24" fill="none" stroke="#9c978b" stroke-width="1" opacity=".8"/>
  <!-- pillbox cap -->
  <path d="M60 14 C60 6 66 3 80 3 C94 3 100 6 100 14 L100 17 C94 19 66 19 60 17Z" fill="url(#lxCap)"/>
  <path d="M60 15 C66 17.4 94 17.4 100 15 L100 18 C94 20 66 20 60 18Z" fill="#11122a"/>
  <path d="M64 7 C70 5 90 5 96 7" fill="none" stroke="#6a6ea8" stroke-width="1.2" opacity=".7"/>
  <!-- heavy brow over sunken, red-rimmed, half-closed eyes -->
  <path d="M60 31 Q69 25 78 30 M82 30 Q91 25 100 31" fill="none" stroke="#8a857a" stroke-width="3.2" stroke-linecap="round"/>
  ${[[69, 34.5], [91, 34.5]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6.4" ry="4" fill="#b85a68"/><ellipse cx="${x}" cy="${y + 0.4}" rx="4.6" ry="2.6" fill="#f1d7c8"/><circle cx="${x + (x < 80 ? 1 : -1)}" cy="${y + 0.8}" r="2.2" fill="#3a1a12"/><circle cx="${x + (x < 80 ? 0.4 : -1.6)}" cy="${y}" r=".7" fill="#fff" opacity=".9"/><path d="M${x - 7.4} ${y - 0.6} Q${x} ${y - 6.4} ${x + 7.4} ${y - 0.6} L${x + 7.4} ${y + 1.2} Q${x} ${y - 1.4} ${x - 7.4} ${y + 1.2}Z" fill="#c4bfb2"/><path d="M${x - 6.6} ${y + 1.1} Q${x} ${y - 1.3} ${x + 6.6} ${y + 1.1}" fill="none" stroke="#7e796e" stroke-width=".9"/><path d="M${x - 7} ${y + 3.6} Q${x} ${y + 7.6} ${x + 7} ${y + 3.6}" fill="none" stroke="#a35a62" stroke-width="1.2"/>`).join('')}
  <!-- long nose ridge down the face -->
  <path d="M80 31 C77 40 76 48 77 53 C78 57 82 57 83 53 C84 48 83 40 80 31Z" fill="#bdb7a8"/>
  <path d="M76 55 q2 -2 4 0 M80 55 q2 -2 4 0" fill="none" stroke="#6e6a62" stroke-width="1.2" stroke-linecap="round"/>
  <!-- wide down-turned mouth with a thick lower lip -->
  <path d="M65 67 Q80 64 95 67 Q94 73 80 74 Q66 73 65 67Z" fill="#b9b3a5"/>
  <path d="M65 67 Q80 64.5 95 67" fill="none" stroke="#55504a" stroke-width="1.5" stroke-linecap="round"/><path d="M65 67 q-1.6 1.6 -1.2 4 M95 67 q1.6 1.6 1.2 4" fill="none" stroke="#6e6a62" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M67 71 Q80 77 93 71" fill="none" stroke="#8e897e" stroke-width="1"/><ellipse cx="62" cy="60" rx="6" ry="4" fill="#b5525a" opacity=".12"/><ellipse cx="98" cy="60" rx="6" ry="4" fill="#b5525a" opacity=".12"/>
  <path d="M70 58 q-4 3 -6 7 M90 58 q4 3 6 7" fill="none" stroke="#9c978b" stroke-width="1.2"/>
  <!-- jowl folds -->
  <path d="M55 66 Q58 78 68 82 M105 66 Q102 78 92 82" fill="none" stroke="#9c978b" stroke-width="1.4"/><path d="M62 78 Q80 84 98 78" fill="none" stroke="#9c978b" stroke-width="1.2"/>
  </svg>`;
  })();

  const LINES = {
    sold: [['Ho ho ho!', 'A fine deal. Now the vault closes!'], ['Bo shuda!', 'Come back next week.']],
    broke: [['Hah!', 'No Ingots? No deal.']],
    timeup: [['Time is up!', 'The vault is closed.']],
  };
  const PLATES = {
    sold: ['SOLD OUT', 'The vault is shut. Come back next week.'],
    broke: ['NO INGOTS, NO DEAL', `Bring ${COST} Aurodium Ingots.`],
    timeup: ['TIME\'S UP', 'The vault opens again next week.'],
  };
  const mmss = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
  const calm = () => root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function gateHtml(st) {
    const A = root.Art.ICONS;
    const au = P().state.aurodium || 0;
    const shut = st.state !== 'open';
    const plate = PLATES[st.state] || PLATES.timeup;
    return `<div class="lx-gate${shut ? ' is-shut' : ''}" data-lx>
      <div class="lx-glyphs" aria-hidden="true">ᚹ ᛃ ᛞ ᛉ ◈ ᛉ ᛞ ᛃ ᚹ</div>
      <div class="lx-key"><span data-lx-time>${shut && st.state !== 'broke' ? 'CLOSED' : `<i></i>${mmss(st.w.end - Date.now())}`}</span></div>
      <i class="lx-lamp l"></i><i class="lx-lamp r"></i>
      <div class="lx-open">
        <div class="lx-card">
          <span class="lx-tag">LEGENDARY OFFER</span>
          <h3>The Legendary Exchange</h3>
          <p>You found it. The Hutt's vault is open for 30 minutes.</p>
          <div class="lx-trade"><div class="lx-side">${A.aurodium}<b>${COST}</b><small>Ingots</small></div><span class="lx-arrow" aria-hidden="true">→</span><div class="lx-side">${A.credits}<b>${fmt(PAYOUT)}</b><small>Credits</small></div></div>
          <div class="lx-meta"><span>You have <b>${fmt(au)}</b> Ingots</span><span><b>1</b> trade this week</span></div>
          <button class="lx-btn" type="button" data-lx-trade>Trade ${COST} Ingots</button>
          <p class="lx-foot">3,000 credits per Ingot. Normally 2,500.</p>
        </div>
        <div class="lx-shutter" aria-hidden="${shut ? 'false' : 'true'}"><span class="lx-seam"></span><div class="lx-plate"><b data-lx-p1>${plate[0]}</b><span data-lx-p2>${plate[1]}</span></div><i class="lx-handle"></i></div>
      </div>
      <div class="lx-dust" aria-hidden="true"></div>
      <div class="lx-say" role="status"><i data-lx-s1></i><span data-lx-s2></span></div>
      <div class="lx-hutt" aria-hidden="true">${HUTT}</div>
    </div>`;
  }

  // The Hutt slides in, says his piece, and the shutter slams down.
  function shut(g, kind, animate) {
    const plate = PLATES[kind];
    g.querySelector('[data-lx-p1]').textContent = plate[0];
    g.querySelector('[data-lx-p2]').textContent = plate[1];
    const time = g.querySelector('[data-lx-time]');
    if (kind !== 'broke') time.textContent = 'CLOSED';
    const lines = LINES[kind];
    const say = (l) => { g.querySelector('[data-lx-s1]').textContent = l[0]; g.querySelector('[data-lx-s2]').textContent = l[1]; };
    if (!animate || calm()) {
      say(lines[lines.length - 1]);
      g.classList.add('is-shut', 'hutt-in', 'talk', 'still');
      return;
    }
    say(lines[0]);
    g.classList.add('hutt-in');
    setTimeout(() => g.classList.add('talk'), 380);
    setTimeout(() => {
      g.classList.add('is-shut');
      if (root.Sound) root.Sound.play('crack');
    }, 900);
    if (lines[1]) setTimeout(() => say(lines[1]), 2300);
  }

  function mount(v) {
    const st = status();
    if (st.state === 'hidden') {
      // Not open yet: if it opens while you're on this screen, it appears.
      const wait = st.w.start - Date.now();
      if (wait > 0 && wait < 30 * 60e3) setTimeout(() => { if (v.isConnected && UI() && UI().App.current === 'market') UI().App.refresh(); }, wait + 200);
      return;
    }
    const shell = v.querySelector('.panel.shell');
    const anchor = shell ? shell.parentElement : v.lastElementChild;
    if (!anchor) return;
    anchor.insertAdjacentHTML('afterend', gateHtml(st));
    const g = v.querySelector('[data-lx]');
    const me = mine(st.w);
    if (st.state !== 'open') {
      // First time you see it shut this week, the Hutt does his act.
      const first = !(me.seen & 1);
      me.seen |= 1;
      P().save();
      setTimeout(() => shut(g, st.state, first), first ? 400 : 0);
    }
    g.addEventListener('click', (e) => {
      if (!e.target.closest('[data-lx-trade]')) return;
      const r = trade();
      if (!r.ok) {
        if (r.why === 'cap' && UI()) UI().toast('Your credit vault is too full for this trade.');
        else if (r.why !== 'open') shut(g, r.why === 'hidden' ? 'timeup' : r.why, true);
        return;
      }
      if (root.Sound) root.Sound.play('coins');
      if (UI()) { UI().updateWallet(); UI().toast(`+${fmt(PAYOUT)} credits from the Hutt's vault`); }
      me.seen |= 1;
      shut(g, 'sold', true);
    });
    // One light timer while the vault is on screen: the countdown, the
    // time's-up close, and removing it (no empty space) when the 5 minutes end.
    let last = st.state;
    const tick = setInterval(() => {
      if (!g.isConnected) { clearInterval(tick); return; }
      const s = status();
      if (s.state === 'hidden') { clearInterval(tick); g.remove(); return; }
      if (s.state === 'open' || s.state === 'broke') {
        const tm = g.querySelector('[data-lx-time]');
        tm.innerHTML = `<i></i>${mmss(s.w.end - Date.now())}`;
      }
      if (s.state !== last && s.state !== 'open') shut(g, s.state, last === 'open' || last === 'broke');
      last = s.state;
    }, 1000);
  }

  const Screens = UI() && UI().Screens;
  if (Screens && Screens.market && !Screens.__lx) {
    Screens.__lx = true;
    const base = Screens.market;
    Screens.market = function () {
      const v = base.apply(this, arguments);
      if (live() && v && v.querySelector) mount(v);
      return v;
    };
  }

  if (typeof document !== 'undefined' && !document.getElementById('lx-css')) {
    const st = document.createElement('style');
    st.id = 'lx-css';
    // Light on phones: the arch and metal are CSS gradients drawn once; the
    // Hutt and the shutter each move as one layer with transform only, and
    // nothing animates once the shutter is down.
    st.textContent = `.lx-gate{position:relative;margin:26px 0 12px;padding:46px 18px 18px;border-radius:200px 200px 16px 16px/110px 110px 16px 16px;background:repeating-linear-gradient(0deg,transparent 0 33px,rgba(70,44,18,.55) 33px 35px),repeating-linear-gradient(90deg,transparent 0 58px,rgba(70,44,18,.35) 58px 60px),radial-gradient(ellipse at 30% 20%,#e3c48e,#b98c52 55%,#7c5528);box-shadow:inset 0 0 0 3px #5a3a18,inset 0 -18px 30px rgba(40,20,4,.45),0 10px 30px rgba(0,0,0,.6);max-width:640px;margin-left:auto;margin-right:auto}
.lx-gate::before{content:"";position:absolute;left:10px;right:10px;top:10px;height:60px;border-radius:190px 190px 0 0/100px 100px 0 0;border-top:3px dashed rgba(70,40,14,.55)}
.lx-glyphs{position:absolute;left:0;right:0;top:20px;text-align:center;font:700 10px/1 ui-monospace,Menlo,monospace;letter-spacing:.5em;color:rgba(60,34,10,.75)}
.lx-lamp{position:absolute;bottom:26px;width:12px;height:22px;border-radius:6px 6px 3px 3px;background:radial-gradient(circle at 50% 35%,#fff3b0,#ffb020 45%,#7a4a00);box-shadow:0 0 14px 4px rgba(255,170,40,.55)}.lx-lamp.l{left:4px}.lx-lamp.r{right:4px}
.lx-key{position:absolute;left:50%;top:-14px;transform:translateX(-50%);width:110px;height:44px;clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);background:linear-gradient(#d9b67a,#9a6e38);display:grid;place-items:center;font:900 16px/1 ui-monospace,Menlo,monospace;color:#2a1604;box-shadow:inset 0 -3px 0 #6a4418;font-variant-numeric:tabular-nums}
.lx-key i{display:inline-block;width:7px;height:7px;border-radius:50%;background:#e8241a;box-shadow:0 0 8px #ff3a2a;margin-right:6px;vertical-align:middle}
.lx-open{position:relative;overflow:hidden;border-radius:170px 170px 12px 12px/80px 80px 12px 12px;box-shadow:inset 0 0 0 3px #3a2410,inset 0 8px 18px rgba(0,0,0,.7)}
.lx-card{padding:30px 16px 16px;display:grid;gap:9px;justify-items:center;text-align:center;background:radial-gradient(ellipse at 50% 0%,#4a3508 0%,#1c1405 55%,#0d0a04 100%);color:#fff3c4}
.lx-tag{font:900 11px/1 var(--font-display,system-ui);letter-spacing:.2em;color:#1a1000;background:linear-gradient(180deg,#fff1a0,#ffc21a 55%,#e89a00);padding:5px 9px;border-radius:999px}
.lx-card h3{margin:0;font:800 19px/1.15 var(--font-display,system-ui);color:#fff}.lx-card p{margin:0;font-size:13px;color:#e9d9a6}
.lx-trade{width:100%;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px;background:rgba(0,0,0,.35);border:1px solid rgba(255,210,63,.35);border-radius:12px;padding:12px}
.lx-side{display:grid;justify-items:center;gap:3px}.lx-side svg{width:38px;height:38px}.lx-side b{font:900 22px/1 var(--font-display,system-ui);color:#fff}.lx-side small{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#cdb877}
.lx-arrow{font:900 22px/1 system-ui;color:#ffd23f}
.lx-meta{width:100%;display:flex;justify-content:space-between;gap:8px;font-size:12px;color:#cdb877}.lx-meta b{color:#fff}
.lx-btn{width:100%;border:0;border-radius:12px;padding:13px;font:900 14px/1 var(--font-display,system-ui);letter-spacing:.14em;text-transform:uppercase;color:#1a1000;background:linear-gradient(180deg,#fff1a0,#ffc21a 55%,#e89a00);box-shadow:0 4px 0 #9a6500;cursor:pointer}
.lx-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}.lx-foot{font-size:11.5px!important;color:#a8996a!important}
.lx-shutter{position:absolute;inset:0;z-index:5;transform:translateY(-102%);transition:transform .45s cubic-bezier(.5,0,.6,1.35);will-change:transform;background:radial-gradient(ellipse 26% 14% at 24% 72%,rgba(130,62,18,.6),transparent 70%),radial-gradient(ellipse 18% 26% at 80% 36%,rgba(120,58,16,.5),transparent 70%),repeating-linear-gradient(180deg,#958d7f 0 9px,#6e675c 9px 12px,#b0a796 12px 14px,#7f776a 14px 21px);box-shadow:inset 0 -16px 0 #3a352e,inset 0 -18px 0 #a49b8a,inset 6px 0 10px rgba(0,0,0,.45),inset -6px 0 10px rgba(0,0,0,.45)}
.lx-gate.is-shut .lx-shutter{transform:none}.lx-gate.still .lx-shutter,.lx-gate.still .lx-hutt,.lx-gate.still .lx-say{transition:none}
.lx-seam{position:absolute;left:50%;top:0;bottom:16px;width:2px;background:rgba(40,34,26,.5)}
.lx-plate{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%) rotate(-2deg);background:#ddd3bb;color:#2a2018;border:3px solid #3a2e22;border-radius:6px;padding:10px 14px;text-align:center;box-shadow:0 3px 0 #2a2018;width:70%}
.lx-plate b{display:block;font:900 20px/1 var(--font-display,system-ui);letter-spacing:.14em}.lx-plate span{display:block;margin-top:6px;font:700 12px/1.3 system-ui}
.lx-handle{position:absolute;left:50%;bottom:3px;transform:translateX(-50%);width:76px;height:9px;border-radius:4px;background:#2a2620;box-shadow:inset 0 2px 0 #7a7364}
.lx-dust{position:absolute;left:18px;right:18px;bottom:6px;height:30px;z-index:6;pointer-events:none;opacity:0;background:radial-gradient(ellipse 50% 60% at 50% 100%,rgba(220,190,140,.75),transparent 70%)}
.lx-gate.is-shut:not(.still) .lx-dust{animation:lx-dust .9s .4s ease-out}@keyframes lx-dust{30%{opacity:1}100%{opacity:0;transform:scaleX(1.3)}}
.lx-hutt{position:absolute;right:-14px;bottom:-10px;width:118px;z-index:7;transform:translateX(140%);transition:transform .45s cubic-bezier(.2,.9,.3,1.1);pointer-events:none}.lx-hutt svg{width:100%;height:auto;display:block;filter:drop-shadow(0 6px 8px rgba(0,0,0,.6))}
.lx-gate.hutt-in .lx-hutt{transform:none}
.lx-say{position:absolute;right:96px;bottom:118px;z-index:8;max-width:210px;background:#fff7e0;color:#2a1a08;border:2px solid #3a2410;border-radius:12px;padding:8px 10px;font:700 12.5px/1.35 system-ui;opacity:0;transform:translateY(6px);transition:opacity .25s,transform .25s;pointer-events:none}
.lx-say::after{content:"";position:absolute;right:-10px;bottom:10px;border:8px solid transparent;border-left-color:#3a2410}.lx-say i{display:block;font-style:italic;font-weight:800;color:#7a3a10;margin-bottom:2px}
.lx-gate.talk .lx-say{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.lx-shutter,.lx-hutt,.lx-say{transition:none}.lx-dust{display:none}}`;
    document.head.appendChild(st);
  }

  root.LegendaryExchange = { windowFor, status, trade, COST, PAYOUT, OPEN, LINGER,
    // Tester: open the vault now, or shut it a given way.
    openNow: () => { root.__lxForce = Date.now(); const s = P().state; delete s.lx; P().save(); },
    previewShut: (kind) => { const g = typeof document !== 'undefined' && document.querySelector('[data-lx]'); if (g) shut(g, kind, true); } };
})(typeof window !== 'undefined' ? window : globalThis);
