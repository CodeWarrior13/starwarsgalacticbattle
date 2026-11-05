// 2.4 Champion's Card. The pilot who ends a HoloNet season in the Legend
// league and first on the world leaderboard gets a private, unskippable scene
// with Admiral Ackbar, then designs a card: rarity, hero or ship, the Star Wars
// reference and name, its job (or a new class), its abilities, its look and how
// players unlock it. The answers save as they go and are sent to the owner as
// hn/<env>/champion/<uid>, marked pending approval.
//
// When the owner has built the card, BUILDS below names it for that pilot. The
// next time they open the game, Ackbar brings it back: the card, its stats and
// ultimate, and a 1x battle preview. They approve it or send changes, which go
// back to the owner the same way. Only that pilot ever sees any of this.
(function (root) {
  'use strict';
  // Finished champion cards waiting for their designer's review:
  // { '<designer uid>': { card: '<unit id>', rev: 1 } }. Bump rev after changes.
  const BUILDS = {};

  const live = () => !!(root.Update24 && root.Update24.on && root.Update24.on());
  const D = root.GameData;
  const label = (n) => (root.HN && root.HN.seasonLabel ? root.HN.seasonLabel(n) : n);
  const UI = () => root.UI;
  const HN = () => root.HN;
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const sound = (n) => { if (root.Sound) root.Sound.play(n); };
  const motion = () => !(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const state = () => { const h = HN() && HN().S && HN().S(); if (!h) return null; return h; };
  const save = () => { try { HN().save(); } catch (e) { /* not ready */ } };
  const me = () => (HN() && HN().Net && HN().Net.me) || null;
  // Ackbar uses your callsign as-is: no "(you)" tag on it.
  const myName = () => { try { const n = String(HN().Net.name(me() || 'me')).replace(/\s*\(you\)\s*$/i, ''); return !n || n === 'You' ? 'Commander' : n; } catch (e) { return 'Commander'; } };
  let open = false;
  let testMode = false;

  const RAR = [['common', 'Common', 'Cheap to field, a strong squad aura'], ['rare', 'Rare', 'A solid specialist'], ['epic', 'Epic', 'A strong all-rounder'], ['legendary', 'Legendary', 'A squad cornerstone'], ['mythic', 'Mythic', 'Rare and powerful'], ['secret', 'Secret', 'Hidden, the hardest to get']];
  const RC = { common: '#9aa7b8', rare: '#46c2ff', epic: '#b77bff', legendary: '#ffb938', mythic: '#ff2a5a', secret: '#5affc8' };
  const ROLES = [['Attacker', 'Deals the damage'], ['Tank', 'Takes the hits'], ['Healer', 'Keeps the squad alive'], ['Support', 'Buffs and debuffs'], ['Something new', 'Invent a new class']];
  const HOW = [['Crates', 'Which crates, and how rare'], ['Boss drop', 'A boss or raid gives it'], ['Event or league', 'Earned in an event or season'], ['Secret', 'Hidden: a code, a puzzle, a feat']];

  // ---------- look ----------
  const css = `
.cp { position: fixed; inset: 0; z-index: 430; height: 100%; height: 100dvh; overflow: hidden; overflow: clip; display: flex; flex-direction: column; background: #02050c; color: #eef3fa; animation: fade-in .4s; }
.cp.out { opacity: 0; transition: opacity .45s; }
/* The bridge of Home One: dark curved viewports onto the stars. */
.cp-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 34%, #123f72 0, #07203f 36%, #030a16 70%, #010308 100%); }
.cp-bridge { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0; animation: fade-in 1s 1.2s forwards; }
.cp-warp { position: absolute; left: 50%; top: 38%; width: 0; height: 0; }
.cp-warp i { position: absolute; left: 0; top: 0; width: 2px; height: 46vmax; margin-left: -1px; transform-origin: 50% 0; background: linear-gradient(180deg, rgba(190, 230, 255, 0), rgba(190, 230, 255, .85)); opacity: 0; animation: cp-warp 1.3s calc(var(--d) * 1ms) cubic-bezier(.5, 0, 1, .5) both; }
@keyframes cp-warp { 0% { opacity: 0; transform: rotate(var(--a)) translateY(4vmax) scaleY(.05); } 30% { opacity: 1; } 100% { opacity: 0; transform: rotate(var(--a)) translateY(30vmax) scaleY(1); } }
.cp-flash { position: absolute; inset: 0; background: #bfe8ff; opacity: 0; animation: cp-flash .5s 1.15s ease-out; pointer-events: none; }
@keyframes cp-flash { 0% { opacity: 0; } 20% { opacity: .5; } 100% { opacity: 0; } }
@keyframes cp-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
/* Everything above Ackbar's words lives here, so his words always have room. */
.cp-scene { position: relative; flex: 1 1 auto; min-height: 0; }
/* Ackbar: in full colour, projected from the holotable. */
.cp-holo { position: absolute; left: 50%; top: 50%; width: clamp(150px, 36vmin, 240px); transform: translate(-50%, -54%); display: grid; justify-items: center; opacity: 0; animation: cp-holo 1s 1.45s steps(1) forwards; }
@keyframes cp-holo { 0% { opacity: 0; } 15% { opacity: .7; } 25% { opacity: .15; } 40% { opacity: 1; } 50% { opacity: .4; } 65%, 100% { opacity: 1; } }
.cp-holo .cp-cone { position: absolute; left: 50%; bottom: -8%; width: 150%; height: 120%; transform: translateX(-50%); background: linear-gradient(0deg, rgba(110, 200, 255, .45), rgba(110, 200, 255, 0) 85%); clip-path: polygon(46% 100%, 54% 100%, 100% 0, 0 0); pointer-events: none; }
.cp-holo .cp-ack { position: relative; width: 100%; aspect-ratio: 100 / 110; border-radius: 48% 48% 14px 14px; overflow: hidden; box-shadow: 0 0 0 2px rgba(124, 208, 255, .75), 0 0 34px rgba(74, 168, 255, .55); animation: cp-flick 5s 2.6s infinite; }
.cp-holo .cp-ack svg { display: block; width: 100%; height: 100%; }
/* A light blue sheen and moving scanlines over his true colours. */
.cp-holo .cp-ack::before { content: ''; position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(120, 210, 255, .16), rgba(120, 210, 255, .04) 60%, rgba(120, 210, 255, .2)); pointer-events: none; }
.cp-holo .cp-ack::after { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 200%; z-index: 2; background: repeating-linear-gradient(180deg, rgba(190, 235, 255, .13) 0 2px, transparent 2px 6px); animation: cp-scan 3s linear infinite; pointer-events: none; }
@keyframes cp-scan { to { transform: translateY(-50%); } }
@keyframes cp-flick { 0%, 93%, 100% { opacity: 1; } 95% { opacity: .7; } 97% { opacity: .95; } }
.cp-holo .cp-emit { position: relative; margin-top: 12%; width: 70%; height: 12px; border-radius: 50%; background: radial-gradient(ellipse, #bfe8ff 0, #3a9ad8 45%, rgba(20, 60, 110, 0) 72%); box-shadow: 0 0 24px rgba(110, 200, 255, .8); }
.cp-holo .cp-plate { position: absolute; left: 50%; bottom: 18%; transform: translateX(-50%); z-index: 3; font: 700 10px var(--font-display); letter-spacing: .22em; text-transform: uppercase; white-space: nowrap; padding: 3px 10px; border-radius: 999px; background: rgba(4, 16, 32, .85); border: 1px solid rgba(124, 208, 255, .55); color: #bfe8ff; }
.cp.medal .cp-holo { animation: cp-out .45s forwards; }
@keyframes cp-out { to { opacity: 0; transform: translate(-50%, -54%) scale(.92); } }
/* The champion's medal. */
.cp-medal { position: absolute; left: 50%; top: 50%; width: min(520px, 94%); transform: translate(-50%, -50%); display: grid; justify-items: center; gap: 6px; text-align: center; opacity: 0; pointer-events: none; }
.cp.medal .cp-medal { opacity: 1; }
.cp-medal .cp-mwrap { position: relative; width: clamp(130px, 32vmin, 190px); aspect-ratio: 120 / 150; perspective: 700px; }
.cp.medal .cp-mwrap svg { animation: cp-drop 1.2s cubic-bezier(.2, 1.1, .3, 1) both; }
@keyframes cp-drop { 0% { opacity: 0; transform: translateY(-60px) rotateY(540deg) scale(.4); } 70% { opacity: 1; transform: translateY(6px) rotateY(-10deg) scale(1.05); } 100% { opacity: 1; transform: none; } }
.cp-mwrap svg { width: 100%; height: 100%; display: block; overflow: visible; filter: drop-shadow(0 10px 22px rgba(0, 0, 0, .55)) drop-shadow(0 0 18px rgba(255, 200, 60, .45)); }
.cp-mwrap .cp-shine { animation: cp-shine 3.6s 2s ease-in-out infinite; }
@keyframes cp-shine { 0% { transform: translateX(-90px) skewX(-20deg); } 45%, 100% { transform: translateX(110px) skewX(-20deg); } }
.cp-rays { position: absolute; left: 50%; top: 58%; width: min(360px, 92vw); aspect-ratio: 1; transform: translate(-50%, -50%); background: repeating-conic-gradient(rgba(255, 210, 63, .2) 0 5deg, transparent 5deg 15deg); border-radius: 50%; mask-image: radial-gradient(circle, #000 18%, transparent 68%); -webkit-mask-image: radial-gradient(circle, #000 18%, transparent 68%); z-index: -1; opacity: 0; }
.cp.medal .cp-rays { animation: fade-in .8s .6s forwards, cp-spin 40s linear infinite; }
@keyframes cp-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
.cp-ring { position: absolute; left: 50%; top: 58%; width: 40px; height: 40px; margin: -20px 0 0 -20px; border-radius: 50%; border: 2px solid #ffd23f; opacity: 0; }
.cp.medal .cp-ring { animation: cp-ring 1.2s .8s ease-out forwards; }
.cp.medal .cp-ring.r2 { animation-delay: 1s; border-color: #fff3c4; }
@keyframes cp-ring { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(9); } }
.cp-medal .cp-ttl { font: 800 clamp(20px, 5.6vw, 34px)/1.05 var(--font-display); letter-spacing: .1em; text-transform: uppercase; color: #ffd23f; text-shadow: 0 2px 0 #6a4206, 0 0 26px rgba(255, 210, 63, .55); opacity: 0; }
.cp-medal .cp-rank { font-size: 12px; letter-spacing: .22em; text-transform: uppercase; color: #bfe8ff; opacity: 0; }
.cp-medal .cp-nm { font: 700 15px var(--font-display); letter-spacing: .06em; padding: 4px 14px; border-radius: 999px; border: 1px solid rgba(255, 210, 63, .55); background: rgba(255, 210, 63, .1); opacity: 0; }
.cp.medal .cp-ttl { animation: cp-up .5s 1s forwards; }
.cp.medal .cp-rank { animation: cp-up .5s 1.2s forwards; }
.cp.medal .cp-nm { animation: cp-up .5s 1.35s forwards; }
/* Ackbar's words: in the flow at the bottom, always fully on screen. */
.cp-say { position: relative; z-index: 3; flex: 0 0 auto; width: min(620px, calc(100% - 28px)); box-sizing: border-box; margin: 0 auto calc(14px + env(safe-area-inset-bottom, 0px)); background: rgba(6, 16, 32, .94); border: 1px solid rgba(124, 208, 255, .45); border-radius: 16px; padding: 12px 14px 10px; display: grid; grid-template-columns: 44px 1fr; gap: 2px 12px; align-items: start; opacity: 0; cursor: pointer; box-shadow: 0 10px 40px rgba(0, 0, 0, .5); }
.cp.talk .cp-say { animation: cp-up .45s ease-out forwards; }
.cp-say .cp-face { grid-row: 1 / span 3; width: 44px; height: 48px; border-radius: 50% 50% 8px 8px; overflow: hidden; border: 1px solid rgba(124, 208, 255, .6); }
.cp-say .cp-face svg { display: block; width: 100%; height: 100%; }
.cp-say > b { font: 800 11px var(--font-display); letter-spacing: .18em; text-transform: uppercase; color: #7cd0ff; }
.cp-say p { margin: 0; font-size: clamp(14px, 3.8vw, 17px); line-height: 1.45; min-height: 2.9em; }
.cp-say .cp-tap { justify-self: end; font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: #6a8ab0; opacity: 0; transition: opacity .3s; }
.cp-say.done .cp-tap { opacity: 1; }
/* The form and the review sit on their own panel, above the scene. */
.cp-form { position: absolute; inset: 0; z-index: 5; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; display: grid; align-content: start; justify-items: center; gap: 12px; padding: max(16px, env(safe-area-inset-top, 0px)) 14px max(20px, calc(14px + env(safe-area-inset-bottom, 0px))); background: radial-gradient(ellipse at 50% 0, #0d2c52 0, #061428 45%, #020610 100%); animation: cp-up .45s ease-out; }
.cp-form::before { content: ''; position: fixed; inset: 0; z-index: -1; background: repeating-linear-gradient(180deg, rgba(124, 208, 255, .035) 0 1px, transparent 1px 4px); pointer-events: none; }
.cp-form { position: absolute; inset: 0; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; display: grid; align-content: start; justify-items: center; gap: 12px; padding: max(16px, env(safe-area-inset-top, 0px)) 16px max(20px, env(safe-area-inset-bottom, 0px)); animation: cp-up .45s ease-out; }
.cp-fhead { display: flex; align-items: center; gap: 10px; width: min(620px, 100%); }
.cp-fhead .cp-mini { width: 54px; height: 60px; flex: 0 0 auto; border-radius: 50% 50% 10px 10px; overflow: hidden; border: 1px solid rgba(124, 208, 255, .6); box-shadow: 0 0 14px rgba(74, 168, 255, .4); }
.cp-fhead .cp-mini svg { display: block; width: 100%; height: auto; }
.cp-fhead p { margin: 0; flex: 1; font-size: 14px; color: #c9e6ff; background: rgba(6, 16, 32, .9); border: 1px solid rgba(124, 208, 255, .35); border-radius: 12px; padding: 8px 12px; }
.cp-steps { display: flex; gap: 4px; justify-content: center; }
.cp-steps i { width: 24px; height: 4px; border-radius: 2px; background: rgba(255, 255, 255, .15); }
.cp-steps i.on { background: #ffd23f; }
.cp-q { width: min(620px, 100%); display: grid; gap: 10px; background: rgba(8, 18, 36, .92); border: 1px solid rgba(124, 208, 255, .3); border-radius: 18px; padding: 16px; }
.cp-q h3 { margin: 0; text-align: center; font: 800 clamp(18px, 4.6vw, 22px) var(--font-display); }
.cp-q .cp-hint { margin: -4px 0 0; text-align: center; font-size: 13px; color: var(--muted); }
.cp-opts { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; }
.cp-opt { display: grid; gap: 2px; padding: 10px 12px; border-radius: 12px; border: 1px solid var(--line); background: rgba(255, 255, 255, .04); color: #eef3fa; cursor: pointer; text-align: left; font: inherit; }
.cp-opt b { font-family: var(--font-display); letter-spacing: .04em; }
.cp-opt small { color: var(--muted); font-size: 12px; }
.cp-opt.on { border-color: var(--c, #ffd23f); box-shadow: 0 0 0 1px var(--c, #ffd23f) inset, 0 0 16px color-mix(in srgb, var(--c, #ffd23f) 30%, transparent); background: rgba(255, 255, 255, .08); }
.cp-q label { display: grid; gap: 4px; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.cp-q input, .cp-q textarea { font: 16px var(--font-body, inherit); padding: 10px; border-radius: 10px; border: 1px solid var(--line); background: #050912; color: #eef3fa; text-transform: none; letter-spacing: 0; }
.cp-q textarea { resize: vertical; min-height: 72px; }
.cp-nav { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.cp-sum { display: grid; gap: 6px; font-size: 14px; }
.cp-sum div { display: grid; grid-template-columns: 110px 1fr; gap: 8px; border-top: 1px solid var(--line); padding-top: 6px; }
.cp-sum span { color: var(--muted); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; }
.cp-review { width: min(620px, 100%); display: grid; gap: 12px; justify-items: center; }
.cp-review .cp-card { width: min(240px, 70vw); animation: cp-card .9s cubic-bezier(.2, 1.2, .4, 1) both; }
@keyframes cp-card { from { opacity: 0; transform: rotateY(90deg) scale(.7); } to { opacity: 1; transform: none; } }
.cp-stats { width: 100%; display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 6px; }
.cp-stats div { background: rgba(255, 255, 255, .05); border: 1px solid var(--line); border-radius: 10px; padding: 6px 10px; display: grid; }
.cp-stats span { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.cp-stats b { font: 800 18px var(--font-display); font-variant-numeric: tabular-nums; }
.cp-ult { width: 100%; background: rgba(255, 210, 63, .07); border: 1px solid rgba(255, 210, 63, .35); border-radius: 12px; padding: 10px 12px; font-size: 14px; }
.cp-ult b { color: #ffd23f; font-family: var(--font-display); }
@media (prefers-reduced-motion: reduce) { .cp *, .cp { animation-duration: .01s !important; animation-delay: 0s !important; } }
`;
  // The champion's medal: ribbon, laurel wreath, enamel centre with the
  // number one, and a ring of engraved text naming the season.
  const medalSvg = (season) => {
    const leaves = (side) => Array.from({ length: 9 }, (_, k) => {
      const a = (side < 0 ? 200 : -20) + side * k * 16;
      const r = (a * Math.PI) / 180;
      const x = 60 + Math.cos(r) * 47; const y = 96 + Math.sin(r) * 47;
      return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="7" ry="3.2" fill="#e6b13a" stroke="#7a4a04" stroke-width=".6" transform="rotate(${(a + 90 * side).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }).join('');
    return `<svg viewBox="0 0 120 150" aria-hidden="true"><defs>
      <linearGradient id="cpG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff4c0"/><stop offset=".35" stop-color="#ffd04a"/><stop offset=".7" stop-color="#d08a12"/><stop offset="1" stop-color="#7a4a04"/></linearGradient>
      <radialGradient id="cpE" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#2a5aa8"/><stop offset=".7" stop-color="#0c2a5a"/><stop offset="1" stop-color="#06163a"/></radialGradient>
      <clipPath id="cpC"><circle cx="60" cy="96" r="38"/></clipPath>
      <path id="cpT" d="M60 96 m-31 0 a31 31 0 1 1 62 0 a31 31 0 1 1 -62 0"/></defs>
      <path d="M36 0 L52 52 L60 47 L68 52 L84 0Z" fill="#a80e26"/><path d="M42 0 L55 46 M78 0 L65 46" stroke="#f6f0e0" stroke-width="3"/><path d="M48 0 L57 38 M72 0 L63 38" stroke="#ffd23f" stroke-width="1.6"/>
      <rect x="44" y="44" width="32" height="10" rx="3" fill="url(#cpG)" stroke="#7a4a04" stroke-width=".8"/>
      ${leaves(-1)}${leaves(1)}
      <circle cx="60" cy="96" r="40" fill="url(#cpG)" stroke="#6a3e04" stroke-width="1.4"/>
      ${Array.from({ length: 40 }, (_, k) => `<line x1="60" y1="57" x2="60" y2="60" stroke="#8a5a0a" stroke-width=".8" transform="rotate(${k * 9} 60 96)"/>`).join('')}
      <circle cx="60" cy="96" r="34" fill="url(#cpE)" stroke="#fff0b0" stroke-width="1.6"/>
      <text font-size="5.6" font-weight="800" fill="#ffe08a" letter-spacing="1.2" font-family="Oxanium, sans-serif"><textPath href="#cpT" startOffset="2%">CHAMPION OF THE GALAXY · SEASON ${label(season)} · LEGEND ·</textPath></text>
      <path d="M60 72 L64.6 86 L79 86 L67.4 94.6 L71.8 108.6 L60 100 L48.2 108.6 L52.6 94.6 L41 86 L55.4 86Z" fill="url(#cpG)" stroke="#6a3e04" stroke-width=".8" opacity=".95"/>
      <text x="60" y="101" text-anchor="middle" font-size="20" font-weight="800" fill="#4a2a00" font-family="Oxanium, sans-serif">1</text>
      <g clip-path="url(#cpC)"><rect class="cp-shine" x="40" y="50" width="16" height="100" fill="#fff" opacity=".35"/></g>
    </svg>`;
  };
  // Home One's bridge: curved viewport frames and a scatter of stars.
  const bridgeSvg = () => `<svg class="cp-bridge" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    ${Array.from({ length: 46 }, (_, k) => `<circle cx="${(k * 97) % 400}" cy="${(k * 53) % 190}" r="${k % 5 ? 0.6 : 1.1}" fill="#dff0ff" opacity="${0.3 + (k % 4) * 0.15}"/>`).join('')}
    <circle cx="330" cy="70" r="26" fill="#1a4a7a" opacity=".55"/><circle cx="322" cy="64" r="26" fill="#030a16" opacity=".5"/>
    <path d="M-20 300 L-20 40 C60 -10 340 -10 420 40 L420 300" fill="none" stroke="#0a1a2e" stroke-width="16"/>
    <path d="M70 300 L90 10 M200 300 L200 0 M330 300 L310 10" stroke="#0a1a2e" stroke-width="7"/>
    <path d="M-20 240 C80 200 320 200 420 240 L420 300 L-20 300Z" fill="#041020"/>
    <path d="M-20 240 C80 200 320 200 420 240" fill="none" stroke="#2a6aa8" stroke-width="1" opacity=".6"/>
    ${Array.from({ length: 12 }, (_, k) => `<rect x="${20 + k * 32}" y="${252 + (k % 3) * 6}" width="${10 + (k % 4) * 3}" height="2" rx="1" fill="${['#5fd8ff', '#ffd23f', '#ff6a4a'][k % 3]}" opacity=".7"/>`).join('')}
  </svg>`;

  function stage(season) {
    if (!document.getElementById('cp-css')) document.head.appendChild(Object.assign(document.createElement('style'), { id: 'cp-css', textContent: css }));
    const warp = Array.from({ length: 26 }, (_, k) => `<i style="--a:${(k * 360) / 26 + (k % 3) * 4}deg;--d:${(k % 7) * 70}"></i>`).join('');
    const node = UI().el(`<div class="cp" role="dialog" aria-modal="true" aria-label="Admiral Ackbar">
      <div class="cp-bg"></div>${bridgeSvg()}<div class="cp-warp">${warp}</div><div class="cp-flash"></div>
      <div class="cp-scene">
        <div class="cp-holo"><div class="cp-cone"></div><div class="cp-ack">${HN().ui.ACKBAR}</div><span class="cp-plate">Fleet Admiral · Home One</span><div class="cp-emit"></div></div>
        <div class="cp-medal"><div class="cp-rays"></div><i class="cp-ring"></i><i class="cp-ring r2"></i><div class="cp-mwrap">${medalSvg(season || 0)}</div>
          <div class="cp-ttl">Champion of the Galaxy</div><div class="cp-rank" data-sub></div><span class="cp-nm">${esc(myName())}</span></div>
      </div>
      <div class="cp-say"><span class="cp-face">${HN().ui.ACKBAR}</span><b>Admiral Ackbar</b><p data-line></p><span class="cp-tap">Tap to continue</span></div>
    </div>`);
    // Nothing closes it: no Escape, no tapping outside.
    node.addEventListener('keydown', (e) => { if (e.key === 'Escape') e.stopPropagation(); });
    node.addEventListener('scroll', () => { if (node.scrollLeft || node.scrollTop) { node.scrollLeft = 0; node.scrollTop = 0; } });
    document.body.appendChild(node);
    return node;
  }
  // Ackbar speaks, one line at a time. A tap finishes the line; the next tap moves on.
  function talk(node, lines) {
    return new Promise((resolve) => {
      const box = node.querySelector('.cp-say');
      const p = node.querySelector('[data-line]');
      node.classList.add('talk');
      let i = 0; let typing = null; let full = '';
      const show = () => {
        full = lines[i]; p.textContent = ''; box.classList.remove('done');
        if (!motion()) { p.textContent = full; box.classList.add('done'); return; }
        let k = 0;
        typing = setInterval(() => { k += 2; p.textContent = full.slice(0, k); if (k >= full.length) { clearInterval(typing); typing = null; box.classList.add('done'); } }, 28);
        sound('click');
      };
      const tap = () => {
        if (typing) { clearInterval(typing); typing = null; p.textContent = full; box.classList.add('done'); return; }
        i += 1;
        if (i >= lines.length) { box.removeEventListener('click', tap); return resolve(); }
        show();
      };
      box.addEventListener('click', tap);
      show();
    });
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, motion() ? ms : 0));
  const whenFree = () => new Promise((resolve) => {
    const busy = () => document.body.classList.contains('in-battle') || document.querySelector('.modal-backdrop, .walkout, .feat-show, .feat-cine, .xc, .cp');
    const tick = () => (busy() ? setTimeout(tick, 1500) : resolve());
    setTimeout(tick, 1200);
  });

  // ---------- the design form ----------
  const STEPS = 8;
  function form(node, done) {
    const h = state();
    const c = h.champ;
    const a = c.answers || (c.answers = { rarity: 'legendary', kind: '', ref: '', name: '', role: '', roleNew: '', basic: '', special: '', ult: '', art: '', how: '', howMore: '' });
    let host = node.querySelector('.cp-form');
    if (!host) { host = UI().el('<div class="cp-form no-fx"></div>'); node.appendChild(host); }
    const put = () => { save(); };
    const field = (k, label, ph, area) => `<label>${label}${area ? `<textarea id="cp-${k}" data-f="${k}" maxlength="400" placeholder="${ph}">${esc(a[k])}</textarea>` : `<input id="cp-${k}" data-f="${k}" maxlength="40" autocomplete="off" placeholder="${ph}" value="${esc(a[k])}">`}</label>`;
    const opts = (key, list, colors) => `<div class="cp-opts">${list.map(([k, l, d]) => { const v = colors ? k : k; return `<button type="button" class="cp-opt ${a[key] === v ? 'on' : ''}" data-pick="${key}" data-v="${esc(v)}" ${colors ? `style="--c:${RC[k]}"` : ''}><b ${colors ? `style="color:${RC[k]}"` : ''}>${esc(colors ? l : k)}</b><small>${esc(colors ? d : l)}</small></button>`; }).join('')}</div>`;
    const ok = () => [
      true,
      !!(a.kind && a.ref.trim() && a.name.trim()),
      !!(a.role && (a.role !== 'Something new' || a.roleNew.trim())),
      !!(a.basic.trim() && a.special.trim() && a.ult.trim()),
      !!a.art.trim(),
      !!(a.how && a.howMore.trim()),
      true,
    ][c.step] !== false;
    const lines = ['How rare should it be? Rarer cards are stronger, and harder for others to find.', 'Who is it? Pick hero or ship, then tell me the Star Wars character or legend it is based on.', 'Every soldier has a job. What is this one\'s? Or invent a new kind of fighter.', 'Describe its abilities in your own words. The engineers will set the numbers.', 'Paint me a picture. How does it look?', 'And how will other pilots find it?', 'Read it over, Commander. Once it is sent, it goes to the shipyards.'];
    const bodies = [
      () => `<h3>How rare is your card?</h3>${opts('rarity', RAR, true)}`,
      () => `<h3>Who is it?</h3>${opts('kind', [['Hero', 'Fights in Ground battles'], ['Ship', 'Flies in Fleet battles']])}${field('ref', 'Star Wars reference', 'e.g. a Kessel spice runner from the Clone Wars era')}${field('name', 'Card name', 'e.g. Kessel Run Ace')}`,
      () => `<h3>What's its job?</h3>${opts('role', ROLES)}${a.role === 'Something new' ? field('roleNew', 'Explain the new class', 'e.g. Saboteur: steals buffs and plants mines', true) : ''}`,
      () => `<h3>Its abilities</h3><p class="cp-hint">In your own words. Numbers get balanced when it's built.</p>${field('basic', 'Basic attack', 'e.g. A quick blaster shot that sometimes hits twice')}${field('special', 'Special ability', 'e.g. A smoke grenade: allies are harder to hit for 2 turns', true)}${field('ult', 'Ultimate', 'e.g. Calls in an orbital strike on every enemy', true)}`,
      () => `<h3>What does it look like?</h3>${field('art', 'Art description', 'Look, colours, armour, where it stands', true)}`,
      () => `<h3>How do players unlock it?</h3>${opts('how', HOW)}${a.how ? field('howMore', a.how === 'Crates' ? 'Which crates, and how rare in them?' : 'Tell us more', a.how === 'Crates' ? 'e.g. only Jedi and Sith Holocrons, very rare' : 'e.g. beat the Zillo Beast on its hardest stage', true) : ''}`,
      () => `<h3>Your design</h3><div class="cp-sum">${[['Name', a.name], ['Rarity', (RAR.find((r) => r[0] === a.rarity) || [])[1]], ['Type', a.kind], ['Based on', a.ref], ['Role', a.role === 'Something new' ? `New class: ${a.roleNew}` : a.role], ['Basic', a.basic], ['Special', a.special], ['Ultimate', a.ult], ['Look', a.art], ['Unlock', `${a.how}: ${a.howMore}`], ['Designer', myName()]].map(([k, v]) => `<div><span>${k}</span><b>${esc(v)}</b></div>`).join('')}</div>`,
    ];
    const draw = () => {
      const s = c.step;
      host.innerHTML = `<div class="cp-fhead"><div class="cp-mini">${HN().ui.ACKBAR}</div><p>${esc(lines[s])}</p></div>
        <div class="cp-steps">${Array.from({ length: STEPS - 1 }, (_, i) => `<i class="${i <= s ? 'on' : ''}"></i>`).join('')}</div>
        <div class="cp-q">${bodies[s]()}<div class="cp-nav">${s ? '<button class="btn" type="button" data-go="-1">Back</button>' : ''}<button class="btn btn-primary" type="button" data-go="1" ${ok() ? '' : 'disabled'}>${s === STEPS - 2 ? 'Send to the shipyards' : 'Next'}</button></div></div>`;
    };
    host.addEventListener('click', (e) => {
      const p = e.target.closest('[data-pick]');
      if (p) { a[p.dataset.pick] = p.dataset.v; put(); sound('click'); return draw(); }
      const g = e.target.closest('[data-go]');
      if (!g || g.disabled) return;
      if (g.dataset.go === '1' && c.step === STEPS - 2) { host.remove(); return done(); }
      c.step = Math.max(0, Math.min(STEPS - 2, c.step + Number(g.dataset.go)));
      put(); draw(); host.scrollTop = 0;
    });
    host.addEventListener('input', (e) => {
      const f = e.target.closest('[data-f]');
      if (!f) return;
      a[f.dataset.f] = f.value.slice(0, f.tagName === 'TEXTAREA' ? 400 : 40);
      put();
      const b = host.querySelector('[data-go="1"]');
      if (b) b.disabled = !ok();
    });
    draw();
  }

  // ---------- sending ----------
  async function send(extra) {
    const h = state();
    const c = h && h.champ;
    if (!c || testMode || c.test) return true;
    const Net = HN().Net;
    if (!Net || !Net.ready || !Net.db) return false;
    try {
      // Free text goes through the chat filter before it leaves the device.
      const S = HN().safe;
      const tidy = (v) => { if (typeof v !== 'string' || !S) return v; const r = S.clean(v); return r.blocked ? '[removed by the filter]' : r.text; };
      const answers = c.answers ? Object.fromEntries(Object.entries(c.answers).map(([k, v]) => [k, tidy(v)])) : c.answers;
      await Net.db.doc(`champion/${Net.me}`).set({ season: c.season, name: myName(), answers, status: c.status, note: tidy(c.note || ''), rev: c.reviewed || 0, t: Date.now(), ...(extra || {}) });
      c.sent = c.status;
      save();
      return true;
    } catch (e) { return false; }
  }
  // Anything not yet delivered (offline when it was finished) goes when online.
  function resend() {
    const c = state() && state().champ;
    if (c && !c.test && c.status && c.status !== 'design' && c.sent !== c.status) send();
  }

  // ---------- the scene ----------
  async function play() {
    const h = state();
    if (!h || !h.champ || open) return;
    open = true;
    await whenFree();
    const c = h.champ;
    const node = stage(c.season);
    node.querySelector('[data-sub]').textContent = `No. 1 in the world · Legend league · Season ${label(c.season)}`;
    sound('whoosh');
    await wait(1500);
    if (c.status === 'design' && !c.step && !c.met) {
      sound('heal');
      await wait(1100);
      await talk(node, [`Commander${myName() === 'Commander' ? '' : ` ${myName()}`}! The whole galaxy saw it.`, `You finished Season ${label(c.season)} in the Legend league, ranked first of every pilot alive.`, 'The fleet owes you a debt, and I have a reward no one else will ever receive.']);
      node.classList.add('medal');
      sound('reveal_legendary');
      await wait(1300);
      await talk(node, ['You will design a card. Your card. It will join the galaxy with your callsign on it, and you will be the first to hold it.', 'Answer my questions carefully. Every answer is saved as you go, so nothing is lost if you must leave.']);
      c.met = 1; save();
    } else {
      node.classList.add('medal');
      await wait(700);
      await talk(node, ['Welcome back, Commander. Let us finish your design.']);
    }
    node.classList.remove('talk');
    node.querySelector('.cp-say').style.display = 'none';
    await new Promise((res) => form(node, res));
    c.status = 'pending';
    save();
    const okSent = await send();
    node.querySelector('.cp-say').style.display = '';
    sound('reveal_rare');
    await talk(node, [`It is done. Your design is on its way to the shipyards, pending approval.${okSent ? '' : ' (The HoloNet is offline: it will be sent the moment you are back online.)'}`, 'When the engineers have built it, I will bring it back to you: the card, its art, its stats and its ultimate. Then you approve it, or ask for changes. Thank you, Commander. We will let you know when it is ready.']);
    node.classList.add('out');
    setTimeout(() => node.remove(), 450);
    if (c.test) { delete h.champ; save(); }
    open = false;
    testMode = false;
  }

  // ---------- review of the finished card ----------
  async function review(build) {
    const h = state();
    const def = build && D.UNIT_MAP[build.card];
    if (!h || !def || open) return;
    open = true;
    await whenFree();
    const keep = h.champ ? JSON.parse(JSON.stringify(h.champ)) : null;
    const c = testMode ? { season: 0, status: 'pending', test: 1 } : (h.champ || (h.champ = { season: 0, status: 'pending' }));
    const node = stage(c.season);
    node.classList.add('medal');
    node.querySelector('[data-sub]').textContent = 'Your card is ready';
    await wait(1500);
    await talk(node, [c.status === 'tweaks' ? 'The engineers made the changes you asked for, Commander. Take another look.' : 'Commander! The shipyards have finished your card.', 'Look it over, watch it fight, then tell me: is it ready for the galaxy?']);
    node.querySelector('.cp-say').style.display = 'none';
    const st = D.unitStats(def, D.MAX_LEVEL, D.MAX_STARS);
    const ult = D.ultimateFor ? D.ultimateFor(def) : null;
    const host = UI().el('<div class="cp-form no-fx"></div>');
    const draw = (asking) => {
      host.innerHTML = `<div class="cp-review"><div class="cp-fhead"><div class="cp-mini">${HN().ui.ACKBAR}</div><p>${asking ? 'Tell the engineers what to change. Be as specific as you like.' : `${esc(def.name)} · designed by ${esc(myName())}`}</p></div>
        <div class="cp-card">${UI().unitCard(def, { tag: 'div', owned: true, level: D.MAX_LEVEL, stars: D.MAX_STARS, hideShards: true, traits: true })}</div>
        <div class="cp-stats">${[['Health', st.hp], ['Attack', st.atk], ['Armor', st.def], ['Speed', st.spd], ['Power', D.power(def, D.MAX_LEVEL, D.MAX_STARS)]].map(([k, v]) => `<div><span>${k}</span><b>${UI().fmt(v)}</b></div>`).join('')}</div>
        ${ult ? `<div class="cp-ult"><b>★ ${esc(ult.name)}</b> · ${esc(ult.desc)}</div>` : ''}
        ${asking ? `<div class="cp-q" style="width:100%"><label>Changes<textarea id="cp-note" data-note maxlength="600" placeholder="e.g. a bit more speed, and make the cape red"></textarea></label><div class="cp-nav"><button class="btn" type="button" data-r="back">Back</button><button class="btn btn-primary" type="button" data-r="send" disabled>Send changes</button></div></div>`
          : '<div class="cp-nav"><button class="btn" type="button" data-r="watch">Watch it in battle</button><button class="btn" type="button" data-r="tweak">Ask for changes</button><button class="btn btn-primary" type="button" data-r="ok">Approve</button></div>'}
      </div>`;
    };
    node.appendChild(host);
    draw(false);
    const finish = async (status, note) => {
      c.status = status; c.note = note || ''; c.reviewed = build.rev || 1;
      if (!c.test) save();
      const sent = c.test ? true : await send();
      if (c.test) { h.champ = keep; save(); }
      host.remove();
      node.querySelector('.cp-say').style.display = '';
      await talk(node, [status === 'approved' ? `Approved! ${def.name} joins the galaxy in a coming update, and it will be yours first.` : 'Your changes are on their way to the engineers. I will bring the card back when they are done.', sent ? 'Thank you, Commander.' : 'The HoloNet is offline: your answer will be sent the moment you are back online.']);
      node.classList.add('out');
      setTimeout(() => node.remove(), 450);
      open = false;
      testMode = false;
    };
    host.addEventListener('click', (e) => {
      const r = e.target.closest('[data-r]');
      if (!r || r.disabled) return;
      const k = r.dataset.r;
      if (k === 'watch' && root.BattleUI && root.BattleUI.preview) {
        // The 1x ultimate preview; the review comes back right after.
        node.style.display = 'none';
        root.BattleUI.preview(def.id, () => { node.style.display = ''; UI().App.go('home'); });
        return;
      }
      if (k === 'tweak') return draw(true);
      if (k === 'back') return draw(false);
      if (k === 'ok') return finish('approved');
      if (k === 'send') return finish('tweaks', (host.querySelector('[data-note]') || {}).value || '');
    });
    host.addEventListener('input', (e) => { if (e.target.matches('[data-note]')) host.querySelector('[data-r="send"]').disabled = !e.target.value.trim(); });
  }

  // ---------- when to show what ----------
  function check() {
    if (!live() || open) return;
    const h = state();
    if (!h) return;
    resend();
    const c = h.champ;
    const b = BUILDS[me()];
    // A built (or rebuilt) card this pilot hasn't reviewed yet.
    if (b && (!c || (c.reviewed || 0) < (b.rev || 1))) return review(b);
    if (c && c.status === 'design') play();
  }
  const Champion = {
    // Called by the season leaderboard when this pilot finished first in Legend.
    earned(season) {
      if (!live()) return;
      const h = state();
      if (!h || (h.champ && h.champ.season === season)) return;
      h.champ = { season, status: 'design', step: 0, answers: null };
      save();
      setTimeout(check, 1500);
    },
    check,
    BUILDS,
  };
  root.Champion = Champion;
  // The bridge, Ackbar and his speech box, shared with the season recap (js/recap.js).
  Champion.kit = {
    css: () => { if (!document.getElementById('cp-css')) document.head.appendChild(Object.assign(document.createElement('style'), { id: 'cp-css', textContent: css })); },
    bridgeSvg, talk, myName, esc,
  };
  // Test runs (owner codes): play the scenes without sending anything.
  Champion.testDesign = () => { const h = state(); if (!h) return false; testMode = true; h.champ = { season: (HN().social && HN().social.seasonNo ? HN().social.seasonNo() - 1 : 1), status: 'design', step: 0, answers: null, test: 1 }; save(); setTimeout(() => play(), 300); return true; };
  Champion.testReview = (id) => { if (!state()) return false; testMode = true; setTimeout(() => review({ card: id || 'luke', rev: 999 }), 300); return true; };

  const start = () => { setTimeout(check, 4000); setInterval(check, 60000); };
  if (root.HN && root.HN.S) start(); else root.addEventListener('hn-ready', start, { once: true });

  // Owner test codes (10 letters): CHAMPION24 plays the design scene,
  // CHAMPCARD1 plays the review with a sample card. Nothing is sent.
  const hook = () => {
    const H = UI() && UI().hooks;
    if (!H || H.__champ) return;
    H.__champ = true;
    const before = H.redeem;
    const A = String.fromCharCode(67, 72, 65, 77, 80, 73, 79, 78, 50, 52);
    const B = String.fromCharCode(67, 72, 65, 77, 80, 67, 65, 82, 68, 49);
    H.redeem = (code) => {
      if (code !== A && code !== B) return before ? before(code) : false;
      if (!(root.HN && root.HN.S)) { UI().toast('Open the HoloNet first, then try the code again.'); return true; }
      if (code === A) Champion.testDesign(); else Champion.testReview();
      return true;
    };
  };
  if (root.UI) hook(); else root.addEventListener('load', hook);
})(window);
