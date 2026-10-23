// Update 2.4 "Liberation": card art for the new bosses and opponents.
// Concept stage: drawn and reviewed first, then wired into the game with
// their stats, abilities and ultimates. viewBox 0 0 100 100, same kit as art.js.
(function (root) {
  'use strict';
  const K = root.ArtX;
  if (!K || !root.Art) return;
  const { P, E, C, R, L, shade, shoulders, saber, glowEyes, LG, RG } = K;
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

  // The Jedi Temple during Order 66: spires against a burning sky.
  const templeFire = () => R(0, 0, 100, 100, '#2a0c0a')
    + R(0, 0, 100, 50, '#5a1a10', 'opacity=".6"') + C(20, 30, 30, '#ff5a1a', 'opacity=".22"') + C(80, 36, 24, '#ff7a2a', 'opacity=".2"')
    + P('M30 70 L38 70 L40 34 L42 70 L58 70 L60 22 L62 70 L70 70 L72 40 L74 70 L80 70 L80 100 L20 100 L20 70Z', '#160808')
    + P('M58 36 Q50 20 62 10 Q60 22 68 26 Q64 32 58 36Z', '#ff6a2a', 'opacity=".5"')
    + [[24, 16], [72, 10], [88, 24]].map(([x, y]) => E(x, y, 14, 3.5, '#3a1410', 'opacity=".35"')).join('');

  // The Chancellor's office: deep red, a tall window onto Coruscant's skyline.
  const chancellorOffice = () => R(0, 0, 100, 100, '#2a080c')
    + R(30, 0, 40, 70, '#3a6a9a') + R(30, 0, 40, 40, '#6a9ac8', 'opacity=".55"') + R(30, 40, 40, 30, '#e89a5a', 'opacity=".35"')
    + [[32, 44, 4, 26], [37, 36, 5, 34], [43, 48, 3, 22], [47, 30, 6, 40], [54, 42, 4, 28], [59, 34, 5, 36], [65, 46, 4, 24]].map(([x, y, w, h]) => R(x, y, w, h, '#1a2a3e', 'opacity=".85"')).join('')
    + [[38, 40], [49, 34], [61, 38], [56, 46]].map(([x, y]) => R(x, y, 1, 1, '#ffd88a', 'opacity=".9"')).join('')
    + R(28, 0, 3, 72, '#1a0406') + R(69, 0, 3, 72, '#1a0406') + R(28, 70, 44, 3, '#1a0406') + R(49, 0, 2, 72, '#1a0406', 'opacity=".7"')
    + R(0, 0, 28, 100, '#3a0a10') + R(72, 0, 28, 100, '#3a0a10') + [6, 16, 80, 90].map((x) => R(x, 0, 2, 100, '#2a060a')).join('')
    + R(0, 84, 100, 16, '#1a0406');

  // ---------- Bespin boss: Carbonite Chamber Vader ----------
  add('carbon_vader', () => carbonChamber()
    // the carbonite slab waiting behind him (Han, frozen): polished metal catching the pit's glow
    + (() => { const [g, d] = LG([[0, '#9ea4b0'], [0.45, '#5a5e68'], [1, '#2e3038']], 0, 0, 1, 1); return d + R(3, 28, 22, 38, g, 'rx="1.6"'); })()
    + R(5, 30, 18, 34, '#4a4e58', 'rx="1"', 'opacity=".55"') + P('M10 40 Q14 35.5 18 40 L18.5 52 Q14 59 9.5 52Z', '#6a6e7a') + E(14, 38, 3.2, 3.6, '#6a6e7a')
    + P('M11 42 Q14 39 17 42', '#9aa0ac', 'opacity=".8"') + P('M9 50 L12 47 L12 55Z', '#8a909c', 'opacity=".6"')
    + P('M5 30 L11 30 L5 46Z', '#ffffff', 'opacity=".32"') + P('M16 30 L20 30 L6 62 L5 58Z', '#ffffff', 'opacity=".16"')
    + L(23, 30, 23, 64, '#ffb06a', 0.9, 'opacity=".6"') + R(3, 63, 22, 3, '#ff8a3a', 'opacity=".35"')
    + C(7, 33, 1.1, '#ffffff', 'opacity=".9"')
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
    // steam pouring up out of the freezing pit: soft puffs that fade at the edges
    + (() => {
      const [g, d] = RG([[0, '#fffaf4', 0.75], [0.55, '#f4ece4', 0.35], [1, '#f4ece4', 0]]);
      return d + [[16, 94, 20, 10], [84, 92, 22, 11], [34, 99, 20, 8], [66, 99, 18, 8], [8, 80, 13, 9], [93, 76, 12, 10], [22, 66, 11, 8], [80, 60, 12, 8], [50, 100, 26, 7]]
        .map(([x, y, rx, ry]) => E(x, y, rx, ry, g)).join('');
    })()
    + `<path d="M8 100 C12 86 6 78 14 68 C16 62 12 58 16 52" stroke="#f4ece4" stroke-width="4" fill="none" opacity=".16" stroke-linecap="round"/><path d="M92 100 C88 86 94 76 86 66 C84 60 88 56 84 48" stroke="#f4ece4" stroke-width="4" fill="none" opacity=".16" stroke-linecap="round"/>`
    + saber(80, 97, 92, 24, '#ff2a2a'));

  // ---------- Coruscant boss: Darth Sidious, the mask slipping ----------
  // The Chancellor's office: crimson walls, the tall window over Coruscant, and
  // the great red chair. He sits in his red robes as his face twists half into Sidious.
  add('darth_sidious', () => chancellorOffice()
    // the great chair rising behind him
    + P('M18 100 L18 30 C18 12 34 6 50 6 C66 6 82 12 82 30 L82 100Z', '#5a0c12') + P('M22 100 L22 32 C22 16 36 10 50 10 C64 10 78 16 78 32 L78 100Z', '#7a141c')
    + shade('M22 32 C22 16 36 10 50 10 L50 100 L22 100Z', 0.22) + L(50, 10, 50, 26, '#9a2a30', 1, 'opacity=".6"')
    + R(10, 74, 14, 26, '#5a0c12', 'rx="3"') + R(76, 74, 14, 26, '#5a0c12', 'rx="3"') + R(10, 72, 14, 5, '#8a1a22', 'rx="2"') + R(76, 72, 14, 5, '#8a1a22', 'rx="2"')
    // red Chancellor's robes with the dark cowl
    + P('M24 100 L28 66 C30 56 38 52 50 52 C62 52 70 56 72 66 L76 100Z', '#a01820') + shade('M50 52 C38 52 30 56 28 66 L24 100 L46 100Z', 0.25)
    + P('M38 56 L50 78 L62 56 C58 60 42 60 38 56Z', '#3a060a') + L(50, 78, 50, 100, '#6a0e14', 1.2)
    + P('M30 58 C30 34 38 24 50 24 C62 24 70 34 70 58 C66 50 34 50 30 58Z', '#3a060a', 'opacity=".9"')
    // the face: the kindly Chancellor on his left, Sidious tearing through on his right
    + E(50, 44, 11, 13.5, '#e2c6ac') + P('M50 30.5 C57 30.5 61 37 61 44 C61 52 56 57.5 50 57.5Z', '#b4ada4')
    + P('M39 36 C40 29 46 27 50 27 L50 31 C45 31 41 33 39 38Z', '#d8d4ce') + P('M61 36 C60 29 54 27 50 27 L50 31 C55 31 59 33 61 38Z', '#9a948c')
    + `<path d="M50 30 L51.5 36 L49 41 L52 47 L49.5 52 L51 57.5" stroke="#5a2a20" stroke-width=".7" fill="none" opacity=".7"/>`
    + E(45, 43, 2, 1.2, '#f4efe6') + C(45.2, 43, 0.9, '#4a6a9a')
    + glowEyes(55, 55, 43, '#ffd23a', 1.5) + C(55, 43, 0.5, '#c00') + P('M52.5 41 Q55 39.5 58 41.5', 'none', 'stroke="#5a524a" stroke-width=".8"')
    + `<path d="M53 48 Q56 50 55 54 M57 46 Q59 50 58 53 M52 39 Q56 37 59 39" stroke="#6a625a" stroke-width=".7" fill="none"/>`
    + `<path d="M43 52 Q46 53.5 50 53" stroke="#9a6a58" stroke-width=".9" fill="none"/>` + P('M50 52 Q54 55.5 57 52 Q53.5 54 50 53Z', '#3a0c0c') + R(51, 52.6, 5, 0.7, '#d8cfa8')
    // lightning crackling off the hand on the armrest
    + `<g style="filter:drop-shadow(0 0 2px #b58cff) drop-shadow(0 0 6px #7a4dff)"><path d="M78 74 L86 66 L82 62 L94 54 L90 50 L99 42" stroke="#f0e8ff" stroke-width="1.5" fill="none"/><path d="M78 74 L88 76 L92 70 L99 72" stroke="#c8b0ff" stroke-width="1" fill="none"/></g>`
    + E(78, 74, 4, 3, '#b4ada4') + E(22, 74, 4, 3, '#e2c6ac'));

  // ---------- Coruscant opponent: Clone Force 66 trooper ----------
  add('cf66_trooper', () => templeFire()
    + shoulders('#2a2c30', { top: 72 }) + R(44, 80, 12, 20, '#1e2024') + P('M8 88 L22 78 L26 84 L12 94Z', '#b01a1a') + P('M92 88 L78 78 L74 84 L88 94Z', '#b01a1a')
    // bodyglove neck and collar armour, so the helmet sits on the shoulders
    + P('M38 58 L62 58 L64 77 L36 77Z', '#141518') + P('M32 74 C38 70 62 70 68 74 L66 80 C58 77 42 77 34 80Z', '#3a3d44')
    + P('M33.5 44 C33.5 27 41 21 50 21 C59 21 66.5 27 66.5 44 L66.5 58 C62 65 38 65 33.5 58Z', '#34363c') + shade('M33.5 44 C33.5 27 41 21 50 21 L50 64 C42 64 36 62 33.5 58Z', 0.18)
    + R(47.5, 21, 5, 16, '#b01a1a') + P('M38.5 39 L61.5 39 L61.5 44 L54 44 L54 56 L46 56 L46 44 L38.5 44Z', '#0a0b0e')
    + `<g style="filter:drop-shadow(0 0 1.5px #ff2a2a)">${R(39.5, 40.2, 21, 2.2, '#ff3a3a', 'opacity=".85"')}</g>`
    + L(40, 57, 40, 61, '#6a6e76', 1) + L(60, 57, 60, 61, '#6a6e76', 1) + R(46, 58, 8, 3, '#55585e', 'rx="1"')
    + `<g transform="translate(64 84) rotate(-28)">${R(-2, -2.5, 26, 5, '#1a1b1f', 'rx="1.5"')}${R(20, -1.4, 10, 2.8, '#1a1b1f')}${R(4, -5.4, 10, 2.8, '#3a3d45', 'rx="1"')}</g>`);

  // ---------- Coruscant optional boss: Commander Cody, Order 66 ----------
  add('commander_cody', () => templeFire()
    + shoulders('#eceae6', { top: 72 }) + P('M4 100 C8 88 18 80 30 77 L28 100Z', '#e08a2a') + P('M96 100 C92 88 82 80 70 77 L72 100Z', '#e08a2a')
    // bodyglove neck and collar armour, so the helmet sits on the shoulders
    + P('M38 58 L62 58 L64 77 L36 77Z', '#141518') + P('M32 74 C38 70 62 70 68 74 L66 80 C58 77 42 77 34 80Z', '#dedbd5')
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
