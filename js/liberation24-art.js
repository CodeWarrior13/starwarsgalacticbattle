// Update 2.4 "Liberation": card art for the new bosses and opponents.
// Concept stage: drawn and reviewed first, then wired into the game with
// their stats, abilities and ultimates. viewBox 0 0 100 100, same kit as art.js.
(function (root) {
  'use strict';
  const K = root.ArtX;
  if (!K || !root.Art) return;
  const { P, E, C, R, L, shade, shoulders, saber, glowEyes, SCENES } = K;
  const add = (id, fn) => root.Art.addArt('char', id, fn);

  // ---------- Scenes ----------
  // Cloud City's carbon-freeze chamber: a grated pit glowing orange, steam rising.
  const carbonChamber = () => R(0, 0, 100, 100, '#140a08')
    + C(50, 112, 70, '#ff6a1a', 'opacity=".28"') + C(50, 108, 46, '#ff8a2a', 'opacity=".3"')
    + [12, 28, 72, 88].map((x) => R(x - 3, 0, 6, 62, '#1f1410') + R(x - 3, 0, 1.4, 62, '#3a2a20')).join('')
    + P('M0 22 L100 18 L100 24 L0 28Z', '#241812') + P('M0 40 L100 38 L100 42 L0 44Z', '#1c120e')
    + E(50, 92, 46, 12, '#2a1a12') + E(50, 92, 38, 9, '#ff7a1a', 'opacity=".5"') + E(50, 92, 30, 6.5, '#ffb04a', 'opacity=".55"')
    + [-30, -18, -6, 6, 18, 30].map((dx) => L(50 + dx, 84, 50 + dx * 1.2, 100, '#3a2418', 1.2)).join('')
    + [[18, 70, 10], [80, 66, 12], [30, 56, 8], [70, 52, 9]].map(([x, y, r]) => E(x, y, r, r * 0.55, '#e8dcd0', 'opacity=".12"')).join('');

  // The Senate rotunda: rings of pods in red light, the chancellor's podium beam.
  const senate = () => R(0, 0, 100, 100, '#1a0608')
    + C(50, 60, 70, '#5a0e14', 'opacity=".55"') + C(50, 60, 46, '#8a1a1a', 'opacity=".35"')
    + [0, 1, 2, 3].map((row) => {
      const r = 26 + row * 12;
      return Array.from({ length: 12 + row * 4 }, (_, k) => {
        const a = Math.PI + (k / (11 + row * 4)) * Math.PI;
        const x = 50 + Math.cos(a) * r * 1.3;
        const y = 64 + Math.sin(a) * r * 0.55;
        return R(x - 2.4, y - 1.2, 4.8, 2.4, row % 2 ? '#3a1216' : '#4a161a', `opacity="${0.9 - row * 0.15}"`);
      }).join('');
    }).join('')
    + P('M44 100 L47 60 L53 60 L56 100Z', '#ffd0a0', 'opacity=".12"');

  // The Jedi Temple during Order 66: spires against a burning sky.
  const templeFire = () => R(0, 0, 100, 100, '#2a0c0a')
    + R(0, 0, 100, 50, '#5a1a10', 'opacity=".6"') + C(20, 30, 30, '#ff5a1a', 'opacity=".22"') + C(80, 36, 24, '#ff7a2a', 'opacity=".2"')
    + P('M30 70 L38 70 L40 34 L42 70 L58 70 L60 22 L62 70 L70 70 L72 40 L74 70 L80 70 L80 100 L20 100 L20 70Z', '#160808')
    + P('M58 36 Q50 20 62 10 Q60 22 68 26 Q64 32 58 36Z', '#ff6a2a', 'opacity=".5"')
    + [[24, 16], [72, 10], [88, 24]].map(([x, y]) => E(x, y, 14, 3.5, '#3a1410', 'opacity=".35"')).join('');

  // ---------- Bespin boss: Carbonite Chamber Vader ----------
  add('carbon_vader', () => carbonChamber()
    // the carbonite slab waiting behind him (Han, frozen)
    + R(4, 30, 20, 34, '#4a4a52', 'rx="1.5"') + R(6, 32, 16, 30, '#5e5e68', 'rx="1"') + P('M10 40 Q14 36 18 40 L18 52 Q14 58 10 52Z', '#3a3a42') + E(14, 38, 3, 3.4, '#3a3a42')
    + shoulders('#0c0c0e') + P('M4 100 C8 84 20 76 34 74 L30 100Z', '#050506') + P('M96 100 C92 84 80 76 66 74 L70 100Z', '#050506')
    // orange rim light from the pit
    + `<path d="M6 99 C9 86 20 78 33 75" stroke="#ff8a3a" stroke-width="1.6" fill="none" opacity=".75"/><path d="M94 99 C91 86 80 78 67 75" stroke="#ff8a3a" stroke-width="1.6" fill="none" opacity=".75"/>`
    + R(41, 80, 18, 12, '#2a2c33', 'rx="1.5"') + R(43, 82, 3, 2, '#ff3b3b') + R(47, 82, 3, 2, '#3bff6a') + R(51, 82, 3, 2, '#3b8bff') + R(43, 86, 14, 1.5, '#8a9099')
    + P('M29.5 46 C29.5 24 40 15.5 50 15.5 C60 15.5 70.5 24 70.5 46 L77 67 L62 60.5 L60 69 L40 69 L38 60.5 L23 67Z', '#0e0e11')
    + P('M34 30 C38 20 46 17.5 50 17.5 L50 22 C44 22 38 25 35 32Z', '#5a3a2a', 'opacity=".75"')
    + `<path d="M70.5 46 L77 67" stroke="#ff8a3a" stroke-width="1.2" opacity=".7"/><path d="M29.5 46 L23 67" stroke="#ff8a3a" stroke-width="1.2" opacity=".7"/>`
    + P('M37.5 37.5 L47 37.5 L46 45.5 L38.5 45.5Z', '#2a0c0c') + P('M62.5 37.5 L53 37.5 L54 45.5 L61.5 45.5Z', '#2a0c0c') + L(39.5, 39, 44, 39, '#ff8a4a', 0.7) + L(56, 39, 60.5, 39, '#ff8a4a', 0.7)
    + P('M46 47 L54 47 L57.5 61 L42.5 61Z', '#23252c') + [45.5, 48.5, 51.5, 54.5].map((x) => L(x, 51, x + (x - 50) * 0.18, 60, '#9aa1ab', 0.6)).join('')
    + P('M42.5 61 L57.5 61 L55 66 L45 66Z', '#16171b')
    // steam curling across the front
    + E(84, 96, 14, 4, '#f2e6da', 'opacity=".14"') + E(14, 97, 12, 4, '#f2e6da', 'opacity=".12"')
    + saber(80, 97, 92, 24, '#ff2a2a'));

  // ---------- Coruscant boss: Darth Sidious, the mask slipping ----------
  add('darth_sidious', () => senate()
    // hood and robe
    + P('M14 100 L20 58 C22 28 36 14 50 14 C64 14 78 28 80 58 L86 100Z', '#120e16') + shade('M50 14 C36 14 22 28 20 58 L14 100 L38 100 L34 60Z', 0.3)
    // the face as it twists: grey, furrowed, the hood pushed back off the brow
    + E(50, 50, 12, 14.5, '#b8b2aa') + P('M38 44 C38 32 62 32 62 44 C58 40 42 40 38 44Z', '#a8a29a')
    + P('M37 40 C38 28 62 28 63 40 C60 33 40 33 37 40Z', '#120e16')
    + `<path d="M41 44 Q44 42 47 44 M53 44 Q56 42 59 44 M40 52 Q42 56 41 60 M60 52 Q58 56 59 60 M44 39 Q50 37 56 39 M45 63 Q50 66 55 63 M42 47 L40 49 M58 47 L60 49" stroke="#6a625a" stroke-width=".8" fill="none"/>`
    + P('M41 45.5 Q45.5 43.5 49 46 Q45.5 48.5 41 46.5Z', '#2a1408') + P('M59 45.5 Q54.5 43.5 51 46 Q54.5 48.5 59 46.5Z', '#2a1408')
    + glowEyes(45.2, 54.8, 46, '#ffd23a', 1.6) + C(45.2, 46, 0.5, '#c00') + C(54.8, 46, 0.5, '#c00')
    + P('M44 57 Q50 61 56 57 Q50 59 44 57Z', '#3a0c0c') + R(46, 57.2, 8, 0.9, '#d8cfa8')
    // Force lightning from both hands
    + `<g style="filter:drop-shadow(0 0 2px #b58cff) drop-shadow(0 0 6px #7a4dff)"><path d="M28 84 L18 76 L23 72 L10 64 L15 60 L2 52" stroke="#f0e8ff" stroke-width="1.6" fill="none"/><path d="M72 84 L82 76 L77 72 L90 64 L85 60 L98 52" stroke="#f0e8ff" stroke-width="1.6" fill="none"/><path d="M28 84 L20 86 L14 80 L6 84" stroke="#c8b0ff" stroke-width="1" fill="none"/><path d="M72 84 L80 86 L86 80 L94 84" stroke="#c8b0ff" stroke-width="1" fill="none"/></g>`
    + E(28, 86, 4.4, 3.2, '#b8b2aa') + E(72, 86, 4.4, 3.2, '#b8b2aa'));

  // ---------- Coruscant opponent: Clone Force 66 trooper ----------
  add('cf66_trooper', () => templeFire()
    + shoulders('#2a2c30') + R(44, 80, 12, 20, '#1e2024') + P('M8 88 L22 78 L26 84 L12 94Z', '#b01a1a') + P('M92 88 L78 78 L74 84 L88 94Z', '#b01a1a')
    + P('M33.5 44 C33.5 27 41 21 50 21 C59 21 66.5 27 66.5 44 L66.5 58 C62 65 38 65 33.5 58Z', '#34363c') + shade('M33.5 44 C33.5 27 41 21 50 21 L50 64 C42 64 36 62 33.5 58Z', 0.18)
    + R(47.5, 21, 5, 16, '#b01a1a') + P('M38.5 39 L61.5 39 L61.5 44 L54 44 L54 56 L46 56 L46 44 L38.5 44Z', '#0a0b0e')
    + `<g style="filter:drop-shadow(0 0 1.5px #ff2a2a)">${R(39.5, 40.2, 21, 2.2, '#ff3a3a', 'opacity=".85"')}</g>`
    + L(40, 57, 40, 61, '#6a6e76', 1) + L(60, 57, 60, 61, '#6a6e76', 1) + R(46, 58, 8, 3, '#55585e', 'rx="1"')
    + `<g transform="translate(64 84) rotate(-28)">${R(-2, -2.5, 26, 5, '#1a1b1f', 'rx="1.5"')}${R(20, -1.4, 10, 2.8, '#1a1b1f')}${R(4, -5.4, 10, 2.8, '#3a3d45', 'rx="1"')}</g>`);

  // ---------- Coruscant optional boss: Commander Cody, Order 66 ----------
  add('commander_cody', () => templeFire()
    + shoulders('#eceae6') + P('M4 100 C8 88 18 80 30 77 L28 100Z', '#e08a2a') + P('M96 100 C92 88 82 80 70 77 L72 100Z', '#e08a2a')
    + R(44, 80, 12, 20, '#d6d3cd') + R(30, 84, 40, 3, '#e08a2a')
    + P('M33.5 44 C33.5 27 41 21 50 21 C59 21 66.5 27 66.5 44 L66.5 58 C62 65 38 65 33.5 58Z', '#f2f0ec') + shade('M33.5 44 C33.5 27 41 21 50 21 L50 64 C42 64 36 62 33.5 58Z', 0.12)
    + P('M50 21 C58 21 66.5 27 66.5 40 L60 40 C60 30 56 25 50 25Z', '#e08a2a')
    + P('M38.5 39 L61.5 39 L61.5 44 L54 44 L54 56 L46 56 L46 44 L38.5 44Z', '#101114')
    // the rangefinder stalk
    + L(66, 30, 72, 14, '#7a7e86', 1.4) + R(70, 10, 5, 6, '#3a3d45', 'rx="1"') + C(72.5, 13, 1, '#ff3a3a')
    + L(40, 57, 40, 61, '#9aa3ad', 1) + L(60, 57, 60, 61, '#9aa3ad', 1) + R(46, 58, 8, 3, '#b8bfc7', 'rx="1"')
    + `<g transform="translate(62 82) rotate(-22)">${R(-2, -2.5, 22, 5, '#23252b', 'rx="1.5"')}${R(17, -1.4, 9, 2.8, '#23252b')}</g>`
    // the holo-order flickering by his hand
    + `<g style="filter:drop-shadow(0 0 3px #5fd8ff)" opacity=".85">${E(22, 82, 7, 2, '#5fd8ff', 'opacity=".35"')}${P('M19 80 L22 70 L25 80Z', '#9fe8ff', 'opacity=".7"')}${C(22, 69, 2, '#9fe8ff', 'opacity=".8"')}</g>`);
})(typeof window !== 'undefined' ? window : globalThis);
