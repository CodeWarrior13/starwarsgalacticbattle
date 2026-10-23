// Update 2.4 "Liberation": card art for the new bosses and opponents.
// Concept stage: drawn and reviewed first, then wired into the game with
// their stats, abilities and ultimates. viewBox 0 0 100 100, same kit as art.js.
(function (root) {
  'use strict';
  const K = root.ArtX;
  if (!K || !root.Art) return;
  const { P, E, C, R, L, shade, shoulders, neck, head, eyes, brows, nose, mouth, saber, blaster, glowEyes, LG, RG, SCENES } = K;
  const add = (id, fn) => root.Art.addArt('char', id, fn);
  // Draw the left half of something and mirror it, so faces and helmets stay even.
  const mirror = (svg) => svg + `<g transform="matrix(-1 0 0 1 100 0)">${svg}</g>`;
  const glow = (color, inner, blur = 2) => `<g style="filter:drop-shadow(0 0 ${blur}px ${color})">${inner}</g>`;
  // Soft smoke, steam or mist: radial puffs that fade out at the edges.
  const puffs = (color, alpha, list) => {
    const [g, d] = RG([[0, color, alpha], [0.55, color, alpha * 0.5], [1, color, 0]]);
    return d + list.map(([x, y, rx, ry]) => E(x, y, rx, ry, g)).join('');
  };
  const bolt = (x1, y1, x2, y2, color) => glow(color, L(x1, y1, x2, y2, color, 2.2, 'opacity=".8"') + L(x1, y1, x2, y2, '#fff', 0.8), 1.5);
  const embers = (seed, n, color) => {
    let s = seed;
    const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    let o = '';
    for (let i = 0; i < n; i++) o += C((r() * 100).toFixed(1), (r() * 100).toFixed(1), (r() * 0.6 + 0.3).toFixed(2), color, `opacity="${(r() * 0.6 + 0.3).toFixed(2)}"`);
    return o;
  };

  // ---------- Shared: Phase II clone trooper ----------
  // A proper Phase II bucket: brow ridge, T visor, cheek vents, vocoder,
  // ear caps, chin point. o.rangefinder adds a commander's hinged scope.
  function cloneHelmet(o) {
    const base = o.base;
    const trim = o.trim || '#0c0d10';
    const plate = o.plate || base;
    const shell = 'M50 18.5 C40.5 18.5 32.5 27 33 45 L31.5 57 C31.5 60 33.5 62 36.5 63 L43 66.5 L50 66.5Z';
    const half = P(shell, base, `stroke="${trim}" stroke-width="1.1" stroke-linejoin="round"`)
      // cheek plate and its three vents
      + P('M34.5 46.5 L44 46.5 L44.6 56 L39.5 61.6 L35.5 59.6Z', plate, `stroke="${trim}" stroke-width=".5" opacity=".95"`)
      + [37, 39.2, 41.4].map((x) => L(x, 50, x + 0.4, 56.5, trim, 0.7, 'opacity=".75"')).join('')
      // ear cap
      + C(32, 48.5, 3.6, base, `stroke="${trim}" stroke-width=".9"`) + C(32, 48.5, 1.6, o.cap || '#7a828c');
    return mirror(half)
      + shade(shell, 0.08)
      + E(42, 25.5, 6.5, 2.6, '#fff', 'opacity=".35" transform="rotate(-24 42 25.5)"')
      + (o.top || '')
      + `<path d="M34 36.2 Q50 32.6 66 36.2" stroke="${trim}" stroke-width=".9" fill="none" opacity=".55"/>`
      // the T visor
      + P('M37 38.6 Q50 36.4 63 38.6 L62.2 44.6 L54.6 44.6 L54.1 53.4 L52.2 56.2 L47.8 56.2 L45.9 53.4 L45.4 44.6 L37.8 44.6Z', '#0a0b0e')
      + (o.visorGlow ? glow(o.visorGlow, P('M38.4 39.6 Q50 37.8 61.6 39.6 L61.4 41.2 Q50 39.6 38.6 41.2Z', o.visorGlow, 'opacity=".9"'), 1.4) : P('M38.6 39.4 Q50 37.8 61.4 39.4 L61.2 40.4 Q50 39 38.8 40.4Z', '#4a5a6e', 'opacity=".8"'))
      // vocoder and chin
      + P('M45 57.4 L55 57.4 L54 63.4 L46 63.4Z', o.vocoder || '#8a9099', `stroke="${trim}" stroke-width=".5"`)
      + [59, 60.6, 62.2].map((y) => L(46.2, y, 53.8, y, trim, 0.55, 'opacity=".7"')).join('')
      + P('M47 63.4 L53 63.4 L50 66.2Z', trim)
      + (o.rangefinder ? rangefinder(o.rangefinder) : '');
  }
  // The commander's rangefinder: a hinged arm off the right ear cap and an
  // angled scope housing with a red lens, the way the Phase II one sits.
  function rangefinder(color) {
    return C(68, 48.5, 2.4, '#5a6068', 'stroke="#1a1c20" stroke-width=".6"')
      + `<path d="M68.4 46.6 L71.2 43.6 L71.6 27.5" stroke="#1a1c20" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M68.4 46.6 L71.2 43.6 L71.6 27.5" stroke="#7a828c" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
      + P('M68.2 20.6 L74.6 19.4 L75.2 28.6 L68.8 29.6Z', color, 'stroke="#1a1c20" stroke-width=".7" stroke-linejoin="round"')
      + P('M68.6 21.4 L72.4 20.8 L72.7 25.8 L68.9 26.4Z', '#16181c') + glow('#ff3a3a', C(70.7, 23.6, 1.05, '#ff4a3a'), 1.2)
      + L(73.6, 21, 74, 28, '#fff', 0.5, 'opacity=".5"');
  }
  // Bodyglove neck, collar seal, chest plate and shoulder bells.
  function cloneBody(base, accent, trim = '#0c0d10') {
    return shoulders('#17181c', { top: 72 })
      + P('M39 60 L61 60 L63 76 L37 76Z', '#141518')
      + mirror(P('M5 100 C6 88 14 80 27 77 L33 86 C23 88 17 93 15 100Z', base, `stroke="${trim}" stroke-width=".8"`) + L(10, 92, 26, 81, trim, 0.6, 'opacity=".4"'))
      + P('M33 78.5 C40 74.5 60 74.5 67 78.5 L64.5 97 L50 100 L35.5 97Z', base, `stroke="${trim}" stroke-width=".9"`)
      + shade('M33 78.5 C40 74.5 50 74.5 50 74.5 L50 100 L35.5 97Z', 0.1)
      + P('M37 73.5 C43 71 57 71 63 73.5 L61.5 78 C55 76 45 76 38.5 78Z', '#2a2c30')
      + `<path d="M50 77 L50 99 M38 86 Q50 89 62 86 M39 92 Q50 95 61 92" stroke="${trim}" stroke-width=".6" fill="none" opacity=".45"/>`
      + (accent ? P('M28 80 L33 79 L35.5 92 L30 95Z', accent) + P('M72 80 L67 79 L64.5 92 L70 95Z', accent) : '');
  }

  // ---------- Scenes ----------
  // Cloud City's carbon-freeze chamber: a grated pit glowing orange under
  // hanging hoses and catwalks, steam rolling up out of it.
  const carbonChamber = () => R(0, 0, 100, 100, '#140a08')
    + E(50, 104, 60, 22, '#ff6a1a', 'opacity=".26"') + E(50, 102, 40, 14, '#ff8a2a', 'opacity=".3"')
    + [12, 28, 72, 88].map((x) => R(x - 3, 0, 6, 62, '#1f1410') + R(x - 3, 0, 1.4, 62, '#3a2a20')).join('')
    + P('M0 22 L100 18 L100 24 L0 28Z', '#241812') + P('M0 40 L100 38 L100 42 L0 44Z', '#1c120e')
    + `<path d="M34 0 Q30 14 38 22 M66 0 Q72 12 62 20 M44 0 Q46 8 42 14" stroke="#0a0604" stroke-width="2.2" fill="none"/>`
    + E(50, 92, 46, 12, '#2a1a12') + E(50, 92, 38, 9, '#ff7a1a', 'opacity=".5"') + E(50, 92, 30, 6.5, '#ffb04a', 'opacity=".55"')
    + [-30, -18, -6, 6, 18, 30].map((dx) => L(50 + dx, 84, 50 + dx * 1.2, 100, '#3a2418', 1.2)).join('')
    // haze hanging over the whole chamber
    + puffs('#e8dcd0', 0.22, [[18, 58, 26, 12], [82, 54, 26, 12], [50, 36, 40, 10], [30, 18, 22, 8], [76, 14, 22, 8]]);

  // The Jedi Temple during Order 66: a columned hall, the great doors open
  // onto fire, clones marching in through the smoke.
  const templeHall = () => {
    const [door, dd] = LG([[0, '#ffd27a'], [0.45, '#ff7a2a'], [1, '#7a1a0a']]);
    return dd + R(0, 0, 100, 100, '#1a0806')
      + P('M0 100 L32 70 L68 70 L100 100Z', '#2a120c') + [20, 40, 60, 80].map((x) => L(50 + (x - 50) * 0.36, 70, x * 1.6 - 30, 100, '#3a1a10', 0.6)).join('')
      + P('M33 70 L33 30 Q50 10 67 30 L67 70Z', door)
      + P('M33 30 Q50 10 67 30 L67 34 Q50 16 33 34Z', '#3a1408', 'opacity=".7"')
      // flames licking up inside the doorway
      + P('M33 70 Q36 56 34 48 Q40 56 42 50 Q44 58 48 46 Q52 58 55 50 Q58 58 62 48 Q64 58 67 54 L67 70Z', '#ff4a1a', 'opacity=".55"')
      // clones marching in, silhouetted against the fire
      + [[39, 62, 0.8], [46, 60, 0.9], [54, 61, 0.85], [61, 63, 0.75]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M-4 -6 C-4 -11 4 -11 4 -6 L4.4 -1 L-4.4 -1Z', '#140604')}${R(-5, -1, 10, 12, '#140604', 'rx="2"')}${R(4, 1, 7, 1.6, '#140604')}</g>`).join('')
      + bolt(30, 46, 48, 50, '#ff3a2a') + bolt(64, 40, 80, 36, '#3d8bff')
      // columns, near and far
      + [[0, 13], [18, 8], [74, 8], [87, 13]].map(([x, w]) => R(x, 0, w, 100, '#2a120c') + R(x, 0, w * 0.22, 100, '#4a2416', 'opacity=".8"') + R(x + w * 0.78, 0, w * 0.22, 100, '#100402') + R(x - 1, 6, w + 2, 4, '#3a1a10')).join('')
      + R(0, 0, 100, 6, '#120402')
      + puffs('#2a1210', 0.75, [[50, 14, 30, 10], [30, 8, 20, 8], [72, 10, 22, 8]])
      + embers(7, 18, '#ffb04a');
  };

  // Outside the Jedi Temple at night: the ziggurat burning, the city around
  // it, a gunship overhead and searchlights sweeping the smoke.
  const templeNight = () => {
    const [sky, sd] = LG([[0, '#12060a'], [0.55, '#4a1410'], [1, '#c2481a']]);
    return sd + R(0, 0, 100, 100, sky)
      + [[8, 0, 30, 70], [92, 0, 74, 72]].map(([x1, y1, x2, y2]) => P(`M${x1 - 2} ${y1} L${x1 + 2} ${y1} L${x2 + 6} ${y2} L${x2 - 6} ${y2}Z`, '#ffe8c0', 'opacity=".08"')).join('')
      + [[60, 52, 8, 48], [70, 44, 6, 56], [78, 56, 9, 44], [88, 40, 7, 60], [95, 50, 5, 50], [44, 58, 7, 42]].map(([x, y, w, h]) => R(x, y, w, h, '#14080a')).join('')
      + [[62, 58], [72, 50], [80, 62], [90, 46], [89, 54], [73, 60]].map(([x, y]) => R(x, y, 1, 1, '#ffd88a', 'opacity=".8"')).join('')
      // the Temple: stepped ziggurat with its five spires, fire in the windows
      + P('M-2 76 L6 52 L36 52 L44 76Z', '#1a0a08') + L(3, 62, 41, 62, '#2a120c', 0.8) + L(1, 68, 43, 68, '#2a120c', 0.8)
      + [[9, 40], [15, 34], [21, 22], [27, 34], [33, 40]].map(([x, top]) => P(`M${x - 2.6} 52 L${x - 0.9} ${top} L${x} ${top - 3} L${x + 0.9} ${top} L${x + 2.6} 52Z`, '#1a0a08')).join('')
      + [[8, 56], [14, 56], [20, 56], [26, 56], [32, 56], [11, 64], [23, 64], [35, 64]].map(([x, y]) => R(x, y, 2.4, 1.6, '#ff7a2a', 'opacity=".9"')).join('')
      + P('M14 52 Q10 42 16 34 Q14 42 20 46Z', '#ff6a1a', 'opacity=".55"') + P('M30 52 Q34 44 30 38 Q36 44 34 52Z', '#ffa040', 'opacity=".5"')
      + puffs('#2a1414', 0.7, [[18, 26, 16, 10], [26, 12, 14, 9], [12, 8, 12, 7]])
      // a gunship passing overhead
      + `<g transform="translate(80 16)">${P('M-12 0 L10 -2 L14 1 L10 3 L-12 2Z', '#0c0606')}${P('M-4 -1 L-10 -7 L-6 -7 L2 -1Z', '#0c0606')}${P('M-4 2 L-10 8 L-6 8 L2 2Z', '#0c0606')}${C(12, 1, 0.8, '#ff3a2a')}</g>`
      + R(0, 76, 100, 24, '#0c0406') + L(0, 76, 100, 76, '#3a1a14', 0.8)
      + embers(19, 14, '#ffb04a');
  };

  // The Chancellor's office: crimson walls, a panoramic window onto the
  // Coruscant sunset, air traffic streaming past and the bronze statues.
  const chancellorOffice = () => {
    const [sky, sd] = LG([[0, '#2a3a6a'], [0.45, '#8a5a8a'], [0.8, '#f08a4a'], [1, '#ffc27a']]);
    const [brz, bd] = LG([[0, '#d8a060'], [0.5, '#8a5a2a'], [1, '#3a220e']], 0, 0, 1, 0);
    const towers = [[6, 34, 5], [11, 22, 4], [15, 38, 6], [21, 28, 4], [25, 16, 5], [30, 32, 6], [36, 24, 4], [40, 36, 5], [57, 30, 5], [62, 20, 4], [66, 34, 6], [72, 26, 5], [77, 14, 4], [81, 30, 6], [87, 22, 4], [91, 36, 4]];
    return sd + bd + R(0, 0, 100, 100, '#2a080c')
      + R(4, 4, 92, 58, sky)
      + C(50, 54, 10, '#ffe0a0', 'opacity=".55"')
      + towers.map(([x, y, w]) => R(x, y + 8, w, 62 - y - 8, '#1c1a32', 'opacity=".92"') + R(x + w / 2 - 0.3, y + 2, 0.6, 6, '#1c1a32')).join('')
      + towers.map(([x, y, w], i) => R(x + 1, y + 14 + (i % 4) * 6, 1, 1, '#ffd88a') + R(x + w - 2, y + 20 + (i % 3) * 7, 1, 1, '#ffd88a', 'opacity=".8"')).join('')
      // the Senate dome low on the skyline
      + E(50, 62, 12, 5, '#2a2440') + R(38, 61, 24, 2, '#2a2440')
      // air traffic lanes
      + [[20, 0.5], [30, -0.4], [42, 0.3]].map(([y, k]) => Array.from({ length: 9 }, (_, i) => R(6 + i * 10.4, y + i * k, 2.4, 0.6, i % 3 ? '#ffe8b0' : '#ff8a6a', 'opacity=".85"')).join('')).join('')
      // window frame and mullions
      + [4, 18, 32, 46, 54, 68, 82, 94].map((x) => R(x, 4, 2, 58, '#1a0406')).join('') + R(4, 3, 92, 2.4, '#1a0406') + R(4, 61, 92, 3, '#1a0406')
      // carpet and the raised floor edge
      + R(0, 64, 100, 36, '#4a0a12') + R(0, 64, 100, 2, '#6a1a20') + P('M0 100 L22 70 L78 70 L100 100Z', '#5a0e16')
      // the bronze statues at either side
      + mirror(P('M3 92 L4 60 C4 52 6 48 8.5 48 C11 48 13 52 13 60 L14 92Z', brz) + C(8.5, 45, 3, brz) + P('M5 62 L1.5 74 L3 75 L6.5 66Z', brz) + R(1, 92, 16, 6, '#2a1206'));
  };

  // Jabba's palace: sandstone, a torch-lit arch and the throne room glow.
  const palace = () => R(0, 0, 100, 100, '#3a2416')
    + [0, 12, 24, 36, 48, 60].map((y, i) => [0, 1, 2, 3, 4, 5, 6].map((k) => R(k * 16 - (i % 2) * 8, y, 15.4, 11.4, '#4a3020', 'opacity=".55"')).join('')).join('')
    + P('M28 100 L28 40 Q50 18 72 40 L72 100Z', '#1a0c06') + P('M32 100 L32 42 Q50 24 68 42 L68 100Z', '#ff9a4a', 'opacity=".22"')
    + mirror(R(12, 34, 3, 14, '#2a180c') + glow('#ffb04a', P('M13.5 34 Q10.5 28 13.5 22 Q16.5 28 13.5 34Z', '#ffb04a'), 3))
    + R(0, 78, 100, 22, '#2a180c') + puffs('#ffb04a', 0.18, [[14, 28, 12, 10], [86, 28, 12, 10]]);

  // Hoth: a grey-blue sky over the snowfield, a walker on the horizon.
  const hothField = () => {
    const [sky, sd] = LG([[0, '#7a90a8'], [1, '#d8e4ee']]);
    return sd + R(0, 0, 100, 100, sky)
      + P('M0 58 L18 46 L30 54 L46 42 L62 54 L80 44 L100 56 L100 70 L0 70Z', '#b8c8d8')
      // an AT-AT striding along the ridge
      + `<g transform="translate(6 34)">${R(2, 0, 18, 7, '#5a6474', 'rx="1.5"')}${R(19, 1.4, 6, 4, '#5a6474', 'rx="1"')}${[3, 7, 14, 18].map((x) => R(x, 7, 1.6, 12, '#5a6474')).join('')}</g>`
      + R(0, 66, 100, 34, '#eef4f8') + P('M0 72 Q30 66 60 72 T100 70 V100 H0Z', '#ffffff')
      + embers(31, 26, '#ffffff');
  };

  // Echo Base's ice caves: blue walls, icicles hanging overhead.
  const iceCave = () => {
    const [ice, id] = RG([[0, '#5a8ab8'], [0.6, '#1e3a5a'], [1, '#0a1626']], 0.5, 0.6, 0.7);
    return id + R(0, 0, 100, 100, ice)
      + [[0, 12, 18], [10, 9, 26], [22, 11, 14], [70, 12, 20], [80, 9, 30], [92, 10, 16], [36, 8, 10], [58, 8, 12]].map(([x, w, h]) => P(`M${x} 0 L${x + w} 0 L${x + w / 2} ${h}Z`, '#cfe6f6', 'opacity=".75"') + P(`M${x + w / 2} 0 L${x + w} 0 L${x + w / 2} ${h}Z`, '#8ab0d0', 'opacity=".6"')).join('')
      + P('M0 40 Q10 50 6 70 L0 72Z', '#9ac4e4', 'opacity=".35"') + P('M100 36 Q88 50 94 72 L100 74Z', '#9ac4e4', 'opacity=".35"')
      + R(0, 84, 100, 16, '#cfe6f6', 'opacity=".5"') + embers(43, 12, '#e8f6ff');
  };

  // Dagobah's dark-side cave: twisted roots, a low mist, a cold glow.
  const darkCave = () => R(0, 0, 100, 100, '#08100c')
    + C(50, 46, 38, '#2a6a5a', 'opacity=".22"')
    + `<g stroke="#1a140c" fill="none" stroke-linecap="round"><path d="M0 10 Q20 18 18 40 Q16 60 4 74" stroke-width="5"/><path d="M100 6 Q78 22 84 44 Q90 64 98 80" stroke-width="5"/><path d="M8 0 Q30 8 36 22" stroke-width="3"/><path d="M92 0 Q70 10 64 24" stroke-width="3"/><path d="M18 40 Q28 46 26 60" stroke-width="2.4"/><path d="M84 44 Q74 52 76 64" stroke-width="2.4"/></g>`
    + `<g stroke="#3a3222" fill="none" stroke-width="1" opacity=".8"><path d="M2 12 Q20 20 18 40"/><path d="M98 8 Q80 22 84 44"/></g>`
    + R(0, 86, 100, 14, '#0a140e') + puffs('#9ad8c8', 0.22, [[14, 90, 24, 8], [86, 88, 24, 8], [50, 96, 34, 7]]);

  // Exegol: black stone under a storm, lightning splitting the sky.
  const exegol = (color = '#ff2a2a') => R(0, 0, 100, 100, '#06060a')
    + R(0, 0, 100, 60, '#1a1428', 'opacity=".7"')
    + glow(color, `<path d="M70 0 L64 14 L70 18 L60 34 M64 14 L56 18" stroke="${color}" stroke-width="1" fill="none" opacity=".8"/><path d="M18 0 L22 10 L16 16 L22 28" stroke="${color}" stroke-width=".8" fill="none" opacity=".6"/>`, 2.5)
    + [[4, 30, 8], [16, 40, 6], [80, 34, 8], [90, 26, 7]].map(([x, y, w]) => P(`M${x} 100 L${x + 1} ${y} L${x + w - 1} ${y} L${x + w} 100Z`, '#0e0c14')).join('')
    + R(0, 84, 100, 16, '#0a0910') + puffs('#4a3a6a', 0.3, [[20, 60, 26, 10], [80, 56, 26, 10]]);

  // Coruscant under siege: burning towers, smoke and droid landers.
  const siege = () => {
    const [sky, sd] = LG([[0, '#1a0a10'], [0.6, '#6a1a10'], [1, '#e2541a']]);
    return sd + R(0, 0, 100, 100, sky)
      + [[2, 30, 8], [12, 18, 6], [20, 36, 9], [70, 26, 8], [80, 14, 6], [88, 32, 10]].map(([x, y, w]) => R(x, y, w, 100 - y, '#120608')).join('')
      + [[4, 44], [8, 60], [14, 30], [22, 50], [72, 40], [83, 24], [90, 48], [94, 62]].map(([x, y]) => R(x, y, 1.2, 1.2, '#ffb04a', 'opacity=".8"')).join('')
      + [[15, 19], [82, 15], [24, 37]].map(([x, y]) => glow('#ff7a2a', P(`M${x} ${y} Q${x - 3} ${y - 6} ${x} ${y - 10} Q${x + 3} ${y - 6} ${x} ${y}Z`, '#ffa040'), 3)).join('')
      + puffs('#2a1414', 0.8, [[16, 8, 16, 10], [84, 6, 16, 9], [50, 4, 26, 8]])
      + [[34, 16], [62, 10]].map(([x, y]) => `<g transform="translate(${x} ${y})">${P('M-5 -3 L5 -3 L3 3 L-3 3Z', '#0a0406')}${L(-3, 3, -4, 6, '#0a0406', 0.6)}${L(3, 3, 4, 6, '#0a0406', 0.6)}</g>`).join('')
      + embers(57, 16, '#ffb04a');
  };

  // The Geonosis execution arena: rock walls, the crowd, the pillars.
  const arena = () => {
    const [sky, sd] = LG([[0, '#e8743a'], [1, '#f4b070']]);
    return sd + R(0, 0, 100, 100, sky)
      + P('M0 30 Q50 18 100 30 L100 62 L0 62Z', '#9a4a22') + P('M0 30 Q50 18 100 30 L100 36 Q50 24 0 36Z', '#b85a2a')
      + embers(71, 60, '#5a2410').replace(/cy="(\d+(\.\d+)?)"/g, (m, y) => `cy="${(32 + Number(y) * 0.28).toFixed(1)}"`)
      + [10, 30, 70, 90].map((x) => R(x - 2.5, 40, 5, 44, '#7a3a1a') + R(x - 3.5, 38, 7, 3, '#5a2a10')).join('')
      + R(0, 80, 100, 20, '#c88a52') + P('M0 84 Q50 80 100 84 V100 H0Z', '#b0763e');
  };

  // ---------- Bespin boss: Carbonite Chamber Vader ----------
  add('carbon_vader', () => carbonChamber()
    // the carbonite slab behind him, polished metal catching the pit's glow,
    // with Han's frozen shape raised faintly out of it
    + (() => { const [g, d] = LG([[0, '#a6acb8'], [0.45, '#5e626c'], [1, '#2e3038']], 0, 0, 1, 1); return d + R(2, 24, 25, 44, g, 'rx="1.6"'); })()
    + R(4, 26, 21, 40, '#4a4e58', 'rx="1"', 'opacity=".45"')
    + (() => {
      // Han, frozen: the same relief as the carbonite crate, mouth open in shock
      const [face, fd] = LG([[0, '#9aa6b4'], [1, '#5a6470']]);
      return fd + `<g transform="translate(-14.4 13.6) scale(.58)">`
        + P('M36 52 C40 48 46 47 50 47 C54 47 60 48 64 52 L66 78 L34 78Z', face, 'stroke="#3a424c" stroke-width=".8"')
        + P('M34 54 C30 46 30 38 34 30 L38 32 C35 40 36 46 38 52Z', '#9aa6b4', 'stroke="#3a424c" stroke-width=".8"') + P('M66 54 C70 46 70 38 66 30 L62 32 C65 40 64 46 62 52Z', '#9aa6b4', 'stroke="#3a424c" stroke-width=".8"')
        + E(34, 29, 3, 2.4, '#a8b4c0') + E(66, 29, 3, 2.4, '#a8b4c0')
        + P('M50 24 C57 24 61 30 60 37 C59 42 56 45 50 45 C44 45 41 42 40 37 C39 30 43 24 50 24Z', '#a8b4c0', 'stroke="#3a424c" stroke-width=".8"')
        + P('M42 30 C44 25 56 25 58 30 C54 27 46 27 42 30Z', '#7a8692')
        + '<path d="M43.6 32.4 Q46 30.4 48.4 32.2 M51.6 32.2 Q54 30.4 56.4 32.4" stroke="#3a424c" stroke-width="1" fill="none" stroke-linecap="round"/>'
        + C(46, 35.4, 1.3, '#3a424c') + C(54, 35.4, 1.3, '#3a424c') + E(50, 41, 1.9, 2.4, '#2a3038')
        + '<path d="M50 36 L49.2 38.6 L50.8 38.6" stroke="#5a6470" stroke-width=".7" fill="none"/>'
        + P('M40 34 C38 40 38 46 40 50 M60 34 C62 40 62 46 60 50', 'none', 'stroke="#5a6470" stroke-width="1.4"')
        + '<path d="M44 56 Q50 60 56 56 M42 66 Q50 70 58 66" stroke="#6a7480" stroke-width=".8" fill="none"/>'
        + '</g>';
    })()
    + P('M4 26 L11 26 L4 44Z', '#ffffff', 'opacity=".28"') + P('M17 26 L22 26 L5 64 L4 59Z', '#ffffff', 'opacity=".14"')
    + L(26, 26, 26, 66, '#ffb06a', 0.9, 'opacity=".6"') + R(2, 65, 25, 3, '#ff8a3a', 'opacity=".35"') + C(6, 29, 1.1, '#ffffff', 'opacity=".9"')
    // his cape falling wide from the shoulders
    + P('M24 64 C12 70 4 84 1 100 L99 100 C96 84 88 70 76 64 L62 70 L38 70Z', '#060607')
    + shoulders('#0c0c0e', { top: 70 }) + P('M4 100 C8 84 20 76 34 74 L30 100Z', '#050506') + P('M96 100 C92 84 80 76 66 74 L70 100Z', '#050506')
    + `<path d="M6 99 C9 86 20 78 33 75" stroke="#ff8a3a" stroke-width="1.6" fill="none" opacity=".75"/><path d="M94 99 C91 86 80 78 67 75" stroke="#ff8a3a" stroke-width="1.6" fill="none" opacity=".75"/>`
    + R(41, 80, 18, 12, '#2a2c33', 'rx="1.5"') + R(43, 82, 3, 2, '#ff3b3b') + R(47, 82, 3, 2, '#3bff6a') + R(51, 82, 3, 2, '#3b8bff') + R(43, 86, 14, 1.5, '#8a9099')
    + P('M29.5 46 C29.5 24 40 15.5 50 15.5 C60 15.5 70.5 24 70.5 46 L77 67 L62 60.5 L60 69 L40 69 L38 60.5 L23 67Z', '#0e0e11')
    + P('M34 30 C38 20 46 17.5 50 17.5 L50 22 C44 22 38 25 35 32Z', '#5a3a2a', 'opacity=".75"')
    + `<path d="M70.5 46 L77 67" stroke="#ff8a3a" stroke-width="1.2" opacity=".7"/><path d="M29.5 46 L23 67" stroke="#ff8a3a" stroke-width="1.2" opacity=".7"/>`
    + P('M37.5 37.5 L47 37.5 L46 45.5 L38.5 45.5Z', '#2a0c0c') + P('M62.5 37.5 L53 37.5 L54 45.5 L61.5 45.5Z', '#2a0c0c') + L(39.5, 39, 44, 39, '#ff8a4a', 0.7) + L(56, 39, 60.5, 39, '#ff8a4a', 0.7)
    + P('M46 47 L54 47 L57.5 61 L42.5 61Z', '#23252c') + [45.5, 48.5, 51.5, 54.5].map((x) => L(x, 51, x + (x - 50) * 0.18, 60, '#9aa1ab', 0.6)).join('')
    + P('M42.5 61 L57.5 61 L55 66 L45 66Z', '#16171b')
    // steam: a thick bank rolling out of the pit and climbing up around him
    + puffs('#fffaf4', 0.85, [[14, 96, 24, 12], [86, 94, 24, 12], [34, 100, 22, 9], [66, 100, 22, 9], [50, 102, 30, 8]])
    + puffs('#f4ece4', 0.6, [[6, 82, 16, 11], [94, 78, 15, 12], [20, 70, 14, 10], [82, 64, 14, 10], [10, 56, 12, 9], [90, 48, 12, 9], [28, 86, 14, 8], [72, 84, 14, 8]])
    + puffs('#f4ece4', 0.35, [[16, 40, 12, 9], [86, 32, 12, 9], [62, 76, 12, 6], [38, 76, 12, 6]])
    + `<g fill="none" stroke-linecap="round" stroke="#f4ece4"><path d="M8 100 C14 86 4 78 14 66 C18 58 10 52 16 42" stroke-width="5" opacity=".2"/><path d="M92 100 C86 86 96 76 86 64 C82 56 90 50 84 38" stroke-width="5" opacity=".2"/><path d="M24 100 C28 90 22 84 28 76" stroke-width="3" opacity=".22"/><path d="M76 100 C72 90 78 84 72 76" stroke-width="3" opacity=".22"/></g>`
    + saber(80, 97, 92, 24, '#ff2a2a'));

  // ---------- Coruscant boss: Darth Sidious, unmasked ----------
  // He sits in the great chair in his red Chancellor's robes, the sunset
  // window behind him, his true face showing: both sides alike, ruined and
  // furious, yellow Sith eyes burning, lightning crackling off his hands.
  add('darth_sidious', () => {
    const [skin, sk] = LG([[0, '#d6cfc6'], [0.6, '#aaa29a'], [1, '#7a726c']]);
    const [robe, rd] = LG([[0, '#c22028'], [1, '#6a0a10']]);
    const faceHalf = P('M50 25.5 C44 25.5 38.6 30 38.4 39.5 C38.2 45 39 49 40.6 52.6 C42 56 44 58 46 59.4 L50 60.6Z', skin)
      // deep eye socket, heavy brow, sunken cheek
      + P('M40.8 41.6 Q44.6 38.4 48.4 41.4 Q48 45.6 44.6 46 Q41.4 45.6 40.8 41.6Z', '#4a3a34')
      + '<path d="M40.4 40.2 Q44.4 36.4 49 39.6" stroke="#5a4e46" stroke-width="1.5" fill="none" stroke-linecap="round"/>'
      + P('M40.4 47 Q42.4 52.6 46 56 Q42 53.6 40 48Z', '#6a5e56', 'opacity=".7"')
      // wrinkles and scarring across the forehead, temple, cheek and jaw
      + '<g stroke="#6a5e56" stroke-width=".55" fill="none" stroke-linecap="round" opacity=".6"><path d="M42.6 33.8 Q46.4 32.2 50 32.8"/><path d="M39.6 38 Q40.8 42 40.4 46"/><path d="M41.6 46.6 Q44.6 48.2 47.6 46.8"/><path d="M42.4 48.8 Q43.6 52.6 46.6 55.6"/><path d="M44.4 49.4 Q45.6 52.4 47.6 54.2"/><path d="M45.6 57.4 Q47.6 58.6 50 58.4"/></g>'
      + '<path d="M40.2 33.6 Q42 31 41.2 28.6" stroke="#8a7e78" stroke-width=".5" fill="none" opacity=".7"/>';
    return chancellorOffice() + sk + rd
      // the great chair rising behind him
      + P('M27 100 L27 34 C27 21 38 15 50 15 C62 15 73 21 73 34 L73 100Z', '#4a0a10') + P('M30 100 L30 35 C30 24 39 18.5 50 18.5 C61 18.5 70 24 70 35 L70 100Z', '#7a141c')
      + shade('M30 35 C30 24 39 18.5 50 18.5 L50 100 L30 100Z', 0.2) + L(50, 18.5, 50, 28, '#9a2a30', 1, 'opacity=".6"')
      + mirror(R(16, 74, 14, 26, '#4a0a10', 'rx="3"') + R(16, 72, 14, 5, '#8a1a22', 'rx="2"'))
      // red robes, the cowl drawn back around his face
      + P('M22 100 L27 68 C29 58 38 53 50 53 C62 53 71 58 73 68 L78 100Z', robe) + shade('M50 53 C38 53 29 58 27 68 L22 100 L46 100Z', 0.22)
      + P('M38 57 L50 80 L62 57 C58 61 42 61 38 57Z', '#2a0408') + L(50, 80, 50, 100, '#4a060c', 1.2)
      + '<path d="M30 78 Q36 74 40 80 M70 78 Q64 74 60 80" stroke="#e8b04a" stroke-width=".8" fill="none" opacity=".7"/>'
      + P('M29 60 C28 34 37 22 50 22 C63 22 72 34 71 60 C67 50 62 46 60 40 C58 32 54 29 50 29 C46 29 42 32 40 40 C38 46 33 50 29 60Z', '#8a1018')
      + shade('M29 60 C28 34 37 22 50 22 L50 29 C46 29 42 32 40 40 C38 46 33 50 29 60Z', 0.25)
      + '<path d="M31 56 C31 38 38 26 50 25" stroke="#c23038" stroke-width=".9" fill="none" opacity=".6"/>'
      // the face, drawn as one half and mirrored so both sides match
      + mirror(faceHalf)
      + shade('M50 25.5 C56 25.5 61 30 61 39.5 C61 49 58.4 55.6 54.4 59 L50 60.6Z', 0.1)
      + glowEyes(44.6, 55.4, 43.2, '#ffcf2a', 1.45) + C(44.6, 43.2, 0.55, '#a80000') + C(55.4, 43.2, 0.55, '#a80000')
      + '<path d="M50 42 L48.6 50.4 Q50 51.6 51.4 50.4Z" fill="#6a5e56" opacity=".6"/><path d="M48.4 51 Q50 52.2 51.6 51" stroke="#4a3e38" stroke-width=".6" fill="none"/>'
      // the snarl: bared, rotten teeth
      + P('M44.6 54.2 Q50 58.4 55.4 54.2 Q50 56 44.6 54.2Z', '#2a0a0a') + R(46.4, 54.8, 7.2, 0.9, '#cfc29a') + [47.6, 49.2, 50.8, 52.4].map((x) => L(x, 54.8, x, 55.7, '#7a6a4a', 0.3)).join('')
      // lightning crackling off both hands on the armrests
      + mirror(glow('#7a4dff', '<path d="M22 76 L14 68 L18 64 L6 56 L10 52 L1 44" stroke="#f0e8ff" stroke-width="1.4" fill="none"/><path d="M14 68 L8 70 M10 52 L4 54" stroke="#c8b0ff" stroke-width=".9" fill="none"/>', 3)
        + E(22, 76, 4, 3, '#b0a89e') + '<path d="M19 75 L17.6 73 M21 74 L20.4 71.6 M23 74 L23.4 71.8" stroke="#b0a89e" stroke-width="1.2" stroke-linecap="round"/>');
  });

  // ---------- Coruscant opponent: Clone Force 66 trooper ----------
  add('cf66_trooper', () => templeHall()
    + cloneBody('#2c2e33', '#b01a1a', '#000')
    + cloneHelmet({
      base: '#2e3036', plate: '#24262b', trim: '#000', cap: '#b01a1a', vocoder: '#4a4e56', visorGlow: '#ff3a3a',
      top: R(47.6, 18.8, 4.8, 17, '#b01a1a') + mirror(P('M36 50 L38.2 50 L39 58 L36.8 58Z', '#b01a1a')),
    })
    + `<g transform="translate(62 90) rotate(-28)">${R(-2, -2.6, 28, 5.2, '#141518', 'rx="1.5"')}${R(22, -1.4, 10, 2.8, '#141518')}${R(4, -5.6, 11, 3, '#3a3d45', 'rx="1"')}${R(8, 2.4, 4.5, 7, '#141518', 'rx="1"')}</g>`
    + glow('#ff3a2a', C(95, 77.6, 1.4, '#ffd0c0'), 3));

  // ---------- Coruscant optional boss: Commander Cody, Order 66 ----------
  add('commander_cody', () => templeNight()
    + cloneBody('#eceae6', '#e08a2a', '#2a2620')
    + P('M5 100 C6 88 14 80 27 77 L33 86 C23 88 17 93 15 100Z', '#e08a2a', 'stroke="#2a2620" stroke-width=".8"')
    + R(35, 88, 30, 2.6, '#e08a2a', 'opacity=".9"')
    + cloneHelmet({
      base: '#f2f0ec', plate: '#e4e1db', trim: '#2a2620', cap: '#e08a2a', rangefinder: '#d8d5cf',
      top: mirror(P('M50 18.5 C41 18.5 33.4 26 33 36.6 L37.6 37.4 C38 30 42.6 23 50 23Z', '#e08a2a') + P('M35.6 46.8 L44 46.8 L43.8 49.2 L35.8 49.2Z', '#e08a2a'))
        + R(47.8, 18.8, 4.4, 17.6, '#e08a2a'),
    })
    + `<g transform="translate(60 88) rotate(-22)">${R(-2, -2.6, 24, 5.2, '#23252b', 'rx="1.5"')}${R(19, -1.4, 9, 2.8, '#23252b')}${R(4, 2.4, 4.5, 7, '#23252b', 'rx="1"')}</g>`
    // the order arriving: a flickering hologram of a hooded figure by his hand
    + glow('#5fd8ff', E(84, 92, 8, 2.2, '#5fd8ff', 'opacity=".4"') + P('M78 90 L80.4 78 C80.6 74 82 72 84 72 C86 72 87.4 74 87.6 78 L90 90Z', '#9fe8ff', 'opacity=".55"') + E(84, 75.6, 2.6, 3, '#062030', 'opacity=".55"') + [80, 83, 86].map((y) => L(78.6, y, 89.4, y, '#e0faff', 0.4, 'opacity=".6"')).join(''), 3));

  // ---------- Tatooine opponent: Gamorrean Guard ----------
  // Jabba's palace muscle: green pig face, tusks, a horned leather cap and
  // a heavy vibro-axe, torches burning behind.
  add('gamorrean_guard', () => {
    const [sk, sd] = RG([[0, '#9ab85a'], [1, '#5a7a2a']], 0.45, 0.4, 0.6);
    return palace() + sd
      // the axe haft and blade behind his shoulder
      + L(80, 100, 86, 18, '#4a2e18', 3) + P('M84 18 C96 16 100 30 92 40 L87 34 C92 28 90 22 84 24Z', '#8a9098', 'stroke="#2a2c30" stroke-width=".8"') + P('M86 26 C78 24 74 32 78 38 L84 34Z', '#6a7078')
      + shoulders('#4a3020', { top: 70 }) + mirror(P('M4 100 C6 86 16 76 30 73 L34 82 C24 84 16 90 14 100Z', '#7a5a3a') + [[14, 86], [20, 80], [26, 77]].map(([x, y]) => C(x, y, 1, '#c8b890')).join(''))
      + P('M34 74 C40 71 60 71 66 74 L64 100 L36 100Z', '#3a2416') + R(36, 86, 28, 4, '#2a1a0e') + R(47, 85, 6, 6, '#a8a090', 'rx="1"')
      // the head: heavy jowls, low brow, piggy snout
      + P('M30 54 C28 36 38 26 50 26 C62 26 72 36 70 54 C70 66 62 74 50 74 C38 74 30 66 30 54Z', sk)
      + shade('M30 54 C28 36 38 26 50 26 L50 74 C38 74 30 66 30 54Z', 0.12)
      + mirror(P('M30 46 C24 42 22 36 26 34 C30 38 32 40 33 44Z', '#7a9a44'))
      + E(50, 56, 9, 6.5, '#b0c878') + E(46.6, 56.6, 1.6, 2.2, '#2a3a10') + E(53.4, 56.6, 1.6, 2.2, '#2a3a10')
      + mirror(C(43.4, 47, 1.6, '#1a1408') + C(43.8, 46.6, 0.5, '#fff') + '<path d="M39 43.6 Q43 41.6 47.4 44.6" stroke="#3a4a1a" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
        + P('M43.4 64 L42 58.4 L45.4 63.4Z', '#f0e8d0') + '<path d="M35 60 Q38 66 44 68" stroke="#4a6a20" stroke-width=".8" fill="none"/>')
      + '<path d="M43 66 Q50 69 57 66" stroke="#2a3a10" stroke-width="1" fill="none"/>'
      // the horned leather cap with studs
      + P('M31 42 C32 28 40 22 50 22 C60 22 68 28 69 42 C62 38 38 38 31 42Z', '#5a3a22', 'stroke="#2a1a0e" stroke-width=".8"')
      + mirror(P('M34 34 C28 26 28 18 32 14 C32 22 36 28 39 30Z', '#e8dcc0', 'stroke="#6a5a40" stroke-width=".6"') + [36, 42].map((x) => C(x, 38.6 - (x - 36) * 0.3, 0.9, '#c8b890')).join(''))
      + R(48.4, 22, 3.2, 16, '#3a2414');
  });

  // ---------- Hoth opponent: Snowtrooper ----------
  add('snowtrooper', () => hothField()
    + shoulders('#e6eaee', { top: 72 }) + P('M8 100 C10 86 22 78 34 76 L38 100Z', '#c8cfd8') + P('M92 100 C90 86 78 78 66 76 L62 100Z', '#c8cfd8')
    + R(39, 80, 22, 16, '#d8dde3', 'rx="2"') + [83, 87, 91].map((y) => L(41, y, 59, y, '#9aa3ad', 0.7)).join('') + R(41, 92, 6, 4, '#3a3d45', 'rx="1"')
    // the cloth skirt hanging off the helmet, its folds
    + P('M31 50 C28 60 29 72 34 79 C40 82 60 82 66 79 C71 72 72 60 69 50Z', '#dfe4ea', 'stroke="#8a96a4" stroke-width=".7"')
    + `<path d="M36 56 Q35 68 38 79 M42 60 Q41 70 43 81 M58 60 Q59 70 57 81 M64 56 Q65 68 62 79" stroke="#a8b2be" stroke-width=".8" fill="none"/>`
    + P('M33.5 46 C33.5 28 41 20 50 20 C59 20 66.5 28 66.5 46 L66 52 L34 52Z', '#f4f6f8', 'stroke="#5a6676" stroke-width="1"')
    + shade('M50 20 C59 20 66.5 28 66.5 46 L66 52 L50 52Z', 0.07) + E(42, 26, 6, 2.4, '#fff', 'transform="rotate(-24 42 26)"')
    + `<path d="M34.4 34 Q50 29 65.6 34" stroke="#8a96a4" stroke-width="1" fill="none"/>`
    // the polarised goggle visor and the breather
    + P('M35.6 37.6 Q50 33.6 64.4 37.6 L63 46 Q50 43 37 46Z', '#0a0c12') + P('M38 38.6 Q50 35.6 62 38.6 L61.6 40 Q50 37.2 38.4 40Z', '#5a7ab0', 'opacity=".8"')
    + P('M42.6 46.6 L57.4 46.6 L56 59 L44 59Z', '#eef1f4', 'stroke="#5a6676" stroke-width=".8"') + L(50, 47, 50, 58.6, '#8a96a4', 0.8)
    + mirror(R(43.6, 50, 4.6, 1, '#3a3d45') + R(43.8, 52.4, 4.4, 1, '#3a3d45') + R(44, 54.8, 4.2, 1, '#3a3d45'))
    + `<g transform="translate(26 96) rotate(-18)">${R(0, -3, 44, 6, '#1a1c20', 'rx="1.5"')}${R(8, -6.4, 14, 3.4, '#3a3d45')}${R(38, -1.6, 12, 3.2, '#1a1c20')}</g>`);

  // ---------- Hoth optional boss: The Wampa ----------
  add('wampa', () => {
    const fur = (d, fill) => P(d, fill, 'stroke="#b8c8d8" stroke-width=".6" stroke-linejoin="round"');
    return iceCave()
      // the raised claw coming down
      + fur('M74 100 L72 66 C70 50 74 36 82 26 L86 22 L96 24 L94 34 L98 40 L90 46 C86 58 88 76 92 100Z', '#eef2f6')
      + P('M84 20 L82 12 L87 19Z M89 19 L90 10 L92 20Z M94 22 L98 15 L96 24Z', '#1a1c22')
      + fur('M2 100 C4 78 14 64 30 60 L28 56 L36 58 L50 56 L64 58 L72 56 L70 62 C82 68 90 82 92 100Z', '#f2f5f8')
      + `<path d="M14 84 L18 80 L20 86 L24 80 L26 86 M58 72 L62 68 L64 74 L68 70 M30 76 L34 72 L36 78" stroke="#c8d4e0" stroke-width=".8" fill="none"/>`
      // the shaggy head
      + fur('M26 50 L28 40 L24 36 L32 32 L34 22 L42 24 L50 18 L58 24 L66 22 L68 32 L76 36 L72 40 L74 50 L70 60 L74 64 L62 66 L50 70 L38 66 L26 64 L30 60Z', '#f6f8fa')
      // curling horns
      + mirror('<path d="M34 30 C24 24 16 32 20 40 C22 46 30 46 30 40 C30 36 26 36 26 39" stroke="#8a7a5a" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M34 30 C24 24 16 32 20 40" stroke="#c8b890" stroke-width="1.4" fill="none" stroke-linecap="round"/>')
      // the grey face: sunken eyes, a long snarling mouth with fangs
      + P('M40 38 C40 34 60 34 60 38 L58 56 C56 62 44 62 42 56Z', '#8a909a') + shade('M40 38 C40 34 50 34 50 34 L50 61 C46 61 43 59 42 56Z', 0.12)
      + mirror('<path d="M41 41.6 Q44 39.4 48 41.4" stroke="#3a3e46" stroke-width="1.6" fill="none" stroke-linecap="round"/>')
      + glowEyes(44.6, 55.4, 43.8, '#ffd23a', 1.2)
      + P('M50 46 L48 50 L52 50Z', '#3a3e46')
      + P('M42.4 52 Q50 50 57.6 52 L56 60 Q50 63 44 60Z', '#3a0c10') + mirror(P('M43.6 52.4 L45 57 L46.4 52.2Z', '#f2ead8') + P('M44.6 60 L45.6 56.4 L47 60.4Z', '#f2ead8'))
      + `<path d="M48 61 Q48.6 64 47.6 66" stroke="#9a1a1a" stroke-width=".8" fill="none" opacity=".75"/>`;
  });

  // ---------- Dagobah optional boss: The Cave's Vision ----------
  // The apparition in the dark-side cave: a ghostly Vader whose mask has
  // been blasted open, and the face inside is Luke's own.
  add('cave_vision', () => darkCave()
    + `<g opacity=".92" style="filter:drop-shadow(0 0 3px #6affd8) drop-shadow(0 0 8px #2a8a6a)">`
    + P('M4 100 C6 84 18 74 34 72 L66 72 C82 74 94 84 96 100Z', '#0a1410')
    + P('M29.5 46 C29.5 24 40 15.5 50 15.5 C60 15.5 70.5 24 70.5 46 L77 67 L62 60.5 L60 69 L40 69 L38 60.5 L23 67Z', '#0c1612')
    + `<path d="M29.5 46 C29.5 24 40 15.5 50 15.5 C60 15.5 70.5 24 70.5 46 L77 67" stroke="#6affd8" stroke-width=".8" fill="none" opacity=".6"/>`
    + '</g>'
    // the faceplate blown open, Luke's face inside the hole
    + P('M38 36 L44 33 L48 36 L53 32 L58 35 L62 34 L61 42 L64 48 L60 54 L61 61 L55 60 L51 64 L46 60 L40 61 L41 54 L36 48 L39 42Z', '#e8bc96')
    + P('M38 36 L44 33 L48 36 L53 32 L58 35 L62 34 L61 39 C56 36 44 36 39 40Z', '#e0b45a')
    + mirror(E(45, 45.4, 2, 1.2, '#f4efe6') + C(45.3, 45.4, 0.95, '#3a7ab8') + L(42.6, 42.6, 47.2, 42.8, '#a07a3a', 1))
    + nose({ y: 47 }) + mouth('frown', { y: 55, color: '#8a4a3a' })
    + `<path d="M38 36 L44 33 L48 36 L53 32 L58 35 L62 34 L61 42 L64 48 L60 54 L61 61 L55 60 L51 64 L46 60 L40 61 L41 54 L36 48 L39 42Z" stroke="#6affd8" stroke-width=".8" fill="none" opacity=".9"/>`
    // shards of the mask flying outward
    + [[30, 30, -20], [70, 28, 24], [26, 56, 30], [74, 58, -30], [34, 70, 10], [66, 70, -10]].map(([x, y, a]) => P(`M${x} ${y} l3 -1.6 l1.2 3.4 l-3.6 1Z`, '#0c1612', `stroke="#6affd8" stroke-width=".5" transform="rotate(${a} ${x} ${y})"`)).join('')
    + saber(22, 96, 12, 62, '#ff2a2a'));

  // ---------- Bespin opponent: Cloud City Wing Guard ----------
  add('wing_guard', () => SCENES.cloud()
    + [[8, 30, 8], [86, 26, 10]].map(([x, y, w]) => R(x, y, w, 70, '#e8d0b8', 'opacity=".55"') + E(x + w / 2, y, w * 0.8, 3, '#f0dcc4', 'opacity=".6"')).join('')
    + shoulders('#2a4a8a') + P('M34 76 L50 92 L66 76 C60 73 40 73 34 76Z', '#1a3060') + L(50, 80, 50, 100, '#c8a24a', 1)
    + mirror(P('M8 88 L26 78 L30 82 L12 92Z', '#c8a24a', 'opacity=".9"') + C(40, 86, 1, '#e8c86a') + C(40, 92, 1, '#e8c86a'))
    + neck('#c48a62') + head('#c48a62') + eyes({ iris: '#2a1a10' }) + brows('#2a1a10', { angry: true }) + nose() + mouth('flat', { color: '#5a2a1e' })
    + P('M43 51.6 Q50 49.6 57 51.6 Q50 53.6 43 51.6Z', '#2a1a10')
    // the tall Wing Guard cap with its badge and peak
    + P('M35 38 L37 22 C42 18 58 18 63 22 L65 38Z', '#2a4a8a', 'stroke="#14244a" stroke-width=".8"') + R(35, 34, 30, 4, '#14244a') + P('M34 38 L66 38 L62 42 L38 42Z', '#0e1a36')
    + C(50, 28, 2.6, '#e8c86a') + C(50, 28, 1.2, '#2a4a8a')
    + blaster(64, 94, -36, '#2a2c32'));

  // ---------- Endor opponent: Scout Trooper ----------
  add('scout_trooper', () => SCENES.endor()
    // a speeder bike nose behind his shoulder
    + P('M60 66 L98 58 L100 66 L64 74Z', '#c8ccd2') + R(86, 52, 10, 3, '#2a2c30') + R(88, 56, 3, 8, '#2a2c30')
    + shoulders('#16171a', { top: 72 }) + P('M34 76 C40 72 60 72 66 76 L64 96 L36 96Z', '#eef0f2', 'stroke="#2a2c30" stroke-width=".8"') + L(50, 76, 50, 96, '#9aa3ad', 0.8)
    + mirror(P('M8 88 C10 82 18 78 26 77 L30 84 C22 86 16 90 14 96Z', '#eef0f2', 'stroke="#2a2c30" stroke-width=".7"'))
    + P('M40 62 L60 62 L61 74 L39 74Z', '#16171a')
    // the helmet: domed top with a wide brim, long black visor, nose ridge to the breather
    + P('M35 40 C35 26 42 20 50 20 C58 20 65 26 65 40Z', '#f4f6f8', 'stroke="#2a2c30" stroke-width="1"')
    + P('M28 41 C28 38 34 37 50 37 C66 37 72 38 72 41 C72 44 66 44 50 44 C34 44 28 44 28 41Z', '#eef0f2', 'stroke="#2a2c30" stroke-width="1"')
    + E(43, 27, 5, 2, '#fff', 'transform="rotate(-24 43 27)"') + R(48.6, 20.4, 2.8, 16, '#c8ccd2')
    + P('M37 44 L63 44 L62 50 L38 50Z', '#0a0b0e') + P('M38.6 45 L61.4 45 L61 46.4 L39 46.4Z', '#4a5a6e')
    + P('M46.6 50 L53.4 50 L54.6 60 L50 64 L45.4 60Z', '#eef0f2', 'stroke="#2a2c30" stroke-width=".8"')
    + mirror(P('M38 50 L46.6 50 L45.4 60 L41 62 L38.6 57Z', '#dfe3e7', 'stroke="#2a2c30" stroke-width=".7"'))
    + R(47, 58, 6, 4, '#2a2c30', 'rx="1"') + [48.6, 50, 51.4].map((x) => L(x, 58.6, x, 61.4, '#8a929c', 0.4)).join('')
    + blaster(24, 92, -50, '#1c1d21'));

  // ---------- Endor optional boss: AT-ST Walker ----------
  add('atst', () => {
    const [hull, hd] = LG([[0, '#b8bec6'], [1, '#5a626c']], 0, 0, 1, 1);
    return SCENES.endor() + hd
      + puffs('#d8e0d0', 0.25, [[50, 96, 40, 8]])
      // legs: thigh struts down to the reverse knee and the feet
      + mirror(L(40, 52, 30, 70, '#4a5058', 4) + L(30, 70, 36, 92, '#4a5058', 3.4) + C(30, 70, 3, '#6a7078') + P('M28 92 L44 92 L42 98 L28 98Z', '#3a4048') + L(41, 56, 46, 64, '#2a3038', 1.6))
      + R(40, 50, 20, 6, '#3a4048')
      // the boxy head with its viewports, chin guns and side cannons
      + P('M22 22 L78 22 L86 34 L78 50 L22 50 L14 34Z', hull, 'stroke="#2a3038" stroke-width="1"')
      + P('M30 16 L70 16 L76 22 L24 22Z', '#8a929c', 'stroke="#2a3038" stroke-width=".8"') + R(44, 12, 12, 5, '#6a7078', 'rx="1"')
      + P('M26 28 L74 28 L77 34 L23 34Z', '#0e1216') + glow('#ffb03a', R(32, 30, 8, 1.6, '#ffb03a', 'opacity=".9"') + R(60, 30, 8, 1.6, '#ffb03a', 'opacity=".9"'), 1.5)
      + mirror(L(20, 38, 46, 38, '#4a5058', 0.6) + L(18, 42, 46, 42, '#4a5058', 0.6) + L(42, 50, 40, 60, '#2a3038', 2.4) + L(40, 60, 40, 63, '#1a1e24', 2.8)
        + R(6, 32, 10, 5, '#5a626c', 'rx="1"') + L(6, 34.5, -2, 34.5, '#2a3038', 2.2))
      + mirror(glow('#3aff6a', C(40, 64, 2, '#c8ffd0'), 3) + bolt(-2, 34.5, -12, 34.5, '#3aff6a'))
      + puffs('#2a2a24', 0.45, [[82, 18, 12, 8], [88, 8, 10, 6]]);
  });

  // ---------- Scarif opponent: Shoretrooper ----------
  add('shoretrooper', () => SCENES.scarif()
    + [[12, 40], [86, 36]].map(([x, y]) => L(x, 74, x + 2, y, '#6a4a2a', 1.6) + P(`M${x + 2} ${y} q-10 2 -14 8 M${x + 2} ${y} q10 2 14 8 M${x + 2} ${y} q-4 -6 -12 -6 M${x + 2} ${y} q4 -6 12 -6`, 'none', 'stroke="#2a7a4a" stroke-width="2.4" stroke-linecap="round"')).join('')
    + shoulders('#c2a878', { top: 72 }) + P('M34 76 C40 72 60 72 66 76 L64 96 L36 96Z', '#d8c294', 'stroke="#5a4a2a" stroke-width=".8"')
    + mirror(P('M8 88 C10 82 18 78 26 77 L30 84 C22 86 16 90 14 96Z', '#eceae4', 'stroke="#5a4a2a" stroke-width=".7"'))
    + R(40, 82, 20, 6, '#8a7a5a', 'rx="1"') + P('M40 62 L60 62 L61 74 L39 74Z', '#2a2620')
    // white helmet, sand lower half, the long dark visor band and ridged breather
    + P('M33 44 C33 27 41 20 50 20 C59 20 67 27 67 44 L67 58 C62 66 38 66 33 58Z', '#f4f2ec', 'stroke="#3a3428" stroke-width="1"')
    + P('M33 50 L67 50 L67 58 C62 66 38 66 33 58Z', '#c8b07a', 'stroke="#3a3428" stroke-width=".8"')
    + E(42, 26, 6, 2.4, '#fff', 'transform="rotate(-24 42 26)"') + P('M33.4 34 Q50 30 66.6 34 L66.6 36 Q50 32 33.4 36Z', '#c8b07a')
    + P('M35 39 L65 39 L64 46 L36 46Z', '#0a0b0e') + P('M36.4 40 L63.6 40 L63.3 41.4 L36.7 41.4Z', '#4a6a7e')
    + P('M43 50 L57 50 L55.6 61 L44.4 61Z', '#3a3428') + [45, 47.5, 50, 52.5, 55].map((x) => L(x, 51, x + (x - 50) * 0.08, 60, '#a89a78', 0.6)).join('')
    + `<g transform="translate(28 96) rotate(-18)">${R(0, -3, 48, 6, '#2a2620', 'rx="1.5"')}${R(8, -6.4, 18, 3.4, '#4a4436')}${R(42, -1.6, 12, 3.2, '#2a2620')}</g>`);

  // ---------- Scarif optional boss: Director Krennic ----------
  add('krennic', () => {
    const [sky, sd] = LG([[0, '#5ab8e0'], [1, '#bfe8f4']]);
    return sd + R(0, 0, 100, 100, sky)
      // the Death Star hanging over Scarif, its beam striking the horizon
      + C(80, 18, 12, '#8a929c') + C(80, 18, 12, 'none', 'stroke="#5a626c" stroke-width=".6"') + L(68, 18, 92, 18, '#5a626c', 0.6) + C(75, 13, 3, '#4a525c')
      + glow('#7aff6a', L(75, 13, 96, 66, '#9aff7a', 1.6), 3) + E(96, 66, 8, 3, '#e8ffd8', 'opacity=".8"')
      + R(0, 62, 100, 12, '#2ba3b8') + R(0, 74, 100, 26, '#f2dfa6') + P('M14 62 L18 40 L28 40 L32 62Z', '#c8ccd2', 'opacity=".85"') + R(20, 30, 6, 10, '#c8ccd2', 'opacity=".85"')
      // the white cape billowing behind him
      + P('M2 100 C2 80 12 66 30 62 L70 62 C88 66 98 80 98 100Z', '#e8eaee', 'stroke="#9aa2ac" stroke-width=".8"')
      + `<path d="M12 98 Q16 80 30 66 M88 98 Q84 80 70 66 M22 99 Q24 86 34 72 M78 99 Q76 86 66 72" stroke="#b8c0ca" stroke-width=".8" fill="none"/>`
      + P('M30 74 C38 70 62 70 70 74 L68 100 L32 100Z', '#f6f6f4', 'stroke="#9aa2ac" stroke-width=".8"')
      + R(32, 80, 10, 4, '#1a1a1e') + [0, 1, 2, 3].map((i) => R(32.6 + i * 2.4, 81, 1.6, 2, ['#3b6fd6', '#c43b2e', '#3b6fd6', '#e0b83a'][i])).join('')
      + P('M40 70 L60 70 L58 76 L42 76Z', '#e8e8e4') + L(50, 76, 50, 100, '#c8ccd2', 0.8)
      + neck('#e8c4a4') + head('#e8c4a4', { ry: 14.5 }) + eyes({ iris: '#3a6aa8' }) + brows('#8a7a6a', { angry: true }) + nose() + mouth('smirk', { color: '#8a4a3a' })
      + P('M37 42 C36 30 42 27 46 28 L44 32 C40 33 39 37 38 43Z', '#c8c4be') + P('M63 42 C64 30 58 27 54 28 L56 32 C60 33 61 37 62 43Z', '#c8c4be')
      + `<path d="M43 30 Q50 28 57 30" stroke="#d8b494" stroke-width=".6" fill="none"/>`
      + blaster(70, 92, -40, '#1a1c20');
  });

  // ---------- Geonosis opponent: Geonosian Warrior ----------
  add('geonosian_warrior', () => {
    const [sk, sd] = LG([[0, '#b8783a'], [1, '#6a3a1a']]);
    return SCENES.geonosis() + sd
      // translucent wings fanned out behind
      + mirror(P('M42 60 C26 40 8 34 2 40 C6 52 22 62 40 66Z', '#e8d8b8', 'opacity=".45" stroke="#8a6a3a" stroke-width=".6"') + `<path d="M40 63 C26 50 14 44 4 42 M40 64 C28 58 16 56 8 52" stroke="#8a6a3a" stroke-width=".5" fill="none" opacity=".7"/>`)
      + shoulders('#7a4a22', { top: 74 }) + `<path d="M30 80 Q50 76 70 80 M28 88 Q50 84 72 88" stroke="#4a2a12" stroke-width="1" fill="none"/>`
      + P('M44 60 L56 60 L57 76 L43 76Z', '#6a3a1a')
      // long head, bulbous compound eyes, crest ridge and mandibles
      + P('M36 44 C34 28 42 16 50 14 C58 16 66 28 64 44 C63 54 58 62 50 64 C42 62 37 54 36 44Z', sk, 'stroke="#3a1a08" stroke-width=".9"')
      + P('M50 14 C48 20 48 30 50 36 C52 30 52 20 50 14Z', '#d8985a') + `<path d="M42 22 Q50 18 58 22 M40 28 Q50 24 60 28" stroke="#4a2a12" stroke-width=".7" fill="none"/>`
      + mirror(E(42, 42, 5, 6, '#2a1206', 'transform="rotate(-18 42 42)"') + E(41, 40, 2, 2.4, '#8a5a3a', 'opacity=".6"') + C(40.4, 39.4, 0.8, '#fff', 'opacity=".7"')
        + P('M46 56 C44 60 42 64 44 68 L46.6 62Z', '#4a2a12'))
      + `<path d="M46 52 Q50 54 54 52" stroke="#3a1a08" stroke-width=".8" fill="none"/>`
      // the sonic blaster with its green core
      + `<g transform="translate(66 90) rotate(-30)">${R(0, -4, 22, 8, '#5a3a1a', 'rx="3"')}${C(24, 0, 5, '#3a2410')}${C(24, 0, 2.6, '#7aff8a', 'style="filter:drop-shadow(0 0 2px #7aff8a)"')}</g>`;
  });

  // ---------- Mustafar opponent: Purge Trooper ----------
  add('purge_trooper', () => SCENES.lava()
    + shoulders('#141416', { top: 72 }) + P('M34 76 C40 72 60 72 66 76 L64 96 L36 96Z', '#1e1e22', 'stroke="#3a3a42" stroke-width=".8"')
    + mirror(P('M6 90 C8 82 18 77 28 76 L32 84 C22 86 16 92 14 98Z', '#222226', 'stroke="#4a4a52" stroke-width=".7"'))
    + R(40, 84, 20, 4, '#3a3a42') + P('M40 62 L60 62 L61 74 L39 74Z', '#0a0a0c')
    // the angular helmet: sloped brow, red-rimmed visor, sharp jaw
    + P('M34 42 C34 28 41 20 50 20 C59 20 66 28 66 42 L67 54 L60 64 L40 64 L33 54Z', '#1c1c20', 'stroke="#4a4a52" stroke-width="1"')
    + P('M34.6 40 L50 34 L65.4 40 L64.6 43 L50 37.6 L35.4 43Z', '#3a3a42')
    + P('M37 44 L50 39.6 L63 44 L61 50 L50 47 L39 50Z', '#060608') + glow('#ff3a2a', P('M38.4 44.6 L50 40.8 L61.6 44.6 L61.2 45.8 L50 42.2 L38.8 45.8Z', '#ff4a3a'), 1.6)
    + P('M44 52 L56 52 L58 62 L42 62Z', '#2a2a30') + [46, 48.6, 51.4, 54].map((x) => L(x, 53, x + (x - 50) * 0.15, 61, '#5a5a62', 0.6)).join('')
    + E(42, 26, 5, 2, '#fff', 'opacity=".18" transform="rotate(-24 42 26)"')
    // the electrostaff crackling across him
    + L(10, 96, 92, 50, '#2a2a30', 2.4) + glow('#7ab8ff', `<path d="M10 96 L14 92 L12 90 L17 87 M92 50 L88 52 L90 55 L85 56" stroke="#cfe6ff" stroke-width="1.2" fill="none"/>`, 2.5) + R(16, 88, 6, 3, '#4a4a52', 'transform="rotate(-29 19 89.5)"') + R(80, 54, 6, 3, '#4a4a52', 'transform="rotate(-29 83 55.5)"'));

  // ---------- Exegol opponent: Knight of Ren ----------
  add('knight_of_ren', () => exegol('#ff3a2a')
    // the war scythe over his shoulder
    + L(70, 100, 84, 12, '#2a2620', 2.6) + P('M84 12 C94 14 98 26 92 34 C92 26 88 20 82 18Z', '#7a7e86', 'stroke="#2a2c30" stroke-width=".7"')
    + P('M2 100 L8 76 C16 70 30 68 50 68 C70 68 84 70 92 76 L98 100Z', '#141214') + `<path d="M8 100 L12 82 M20 100 L22 80 M80 100 L78 80 M92 100 L88 82" stroke="#2a2428" stroke-width="1.6" fill="none"/>`
    + mirror(P('M10 84 C14 76 24 72 34 71 L36 80 C28 82 20 86 16 92Z', '#3a3438', 'stroke="#1a1618" stroke-width=".7"') + [[16, 84], [22, 80], [28, 78]].map(([x, y]) => C(x, y, 0.9, '#6a6268')).join(''))
    // the hood, the battered metal mask with its grill and slit
    + P('M28 66 C26 40 36 22 50 20 C64 22 74 40 72 66 C66 60 60 58 50 58 C40 58 34 60 28 66Z', '#1a1618')
    + P('M37 44 C37 32 43 26 50 26 C57 26 63 32 63 44 L62 58 L56 66 L44 66 L38 58Z', '#4a4650', 'stroke="#141214" stroke-width="1"')
    + shade('M50 26 C57 26 63 32 63 44 L62 58 L56 66 L50 66Z', 0.2)
    + P('M39 42 L61 42 L60 46 L40 46Z', '#08060a') + P('M47.6 46 L52.4 46 L52 62 L48 62Z', '#08060a')
    + mirror([50, 53, 56, 59].map((y) => L(40.6 + (y - 50) * 0.2, y, 46.4, y, '#141214', 1)).join(''))
    + `<path d="M42 32 L44 36 M58 30 L55 35 M40 52 L42 50" stroke="#2a262c" stroke-width=".7"/>` + E(44, 31, 4, 1.6, '#9a96a2', 'opacity=".4"'));

  // ---------- Coruscant Under Siege opponent: BX Commando Droid ----------
  add('commando_droid', () => siege()
    + L(18, 100, 6, 40, '#6a6e76', 1.6) + glow('#ffd23a', L(6, 40, 3, 24, '#e8e0a0', 1.2, 'opacity=".8"'), 1.5)
    + P('M14 100 C16 86 28 78 40 76 L60 76 C72 78 84 86 86 100Z', '#7a6e5a') + shade('M14 100 C16 86 28 78 40 76 L50 76 L48 100Z', 0.2)
    + R(46, 60, 8, 18, '#5a5244') + [64, 68, 72].map((y) => L(46, y, 54, y, '#3a342a', 0.8)).join('')
    + mirror(P('M24 86 L36 80 L38 86 L26 92Z', '#e8e0c8', 'opacity=".85"'))
    // the bullet-shaped head with its dark face disc and single photoreceptor
    + P('M37 44 C37 26 43 16 50 16 C57 16 63 26 63 44 C63 54 58 62 50 62 C42 62 37 54 37 44Z', '#a89a7e', 'stroke="#3a342a" stroke-width="1"')
    + shade('M50 16 C57 16 63 26 63 44 C63 54 58 62 50 62Z', 0.15) + E(44, 24, 4, 2, '#fff', 'opacity=".35" transform="rotate(-24 44 24)"')
    + P('M43 38 C43 34 57 34 57 38 L56 52 C54 56 46 56 44 52Z', '#1a1814', 'stroke="#3a342a" stroke-width=".8"') + L(50, 45, 50, 54, '#3a342a', 0.8)
    + glow('#fff4c0', C(50, 41, 1.4, '#fff8e0'), 2) + `<path d="M43 26 L57 26 M41 32 L59 32" stroke="#e8e0c8" stroke-width="1.6" opacity=".85"/>`
    + blaster(66, 92, -36, '#2a2620'));

  // ================= Boss versions of existing cards =================

  // ---------- Bespin optional boss: Bossk with the Hound's Tooth ----------
  add('bossk', () => {
    const [sk, sd] = LG([[0, '#9ab86a'], [1, '#4a6a2a']]);
    return SCENES.hangar() + sd
      // the Hound's Tooth docked behind him
      + P('M58 30 C70 22 92 22 100 30 L100 48 L60 48 C54 44 54 34 58 30Z', '#c8ccd2', 'stroke="#5a626c" stroke-width=".8"') + C(66, 34, 3, '#2a6a8a') + R(76, 38, 22, 2, '#8a929c') + R(70, 26, 12, 3, '#a8b0b8')
      + shoulders('#d8b44a', { top: 72 }) + P('M34 76 C40 72 60 72 66 76 L64 100 L36 100Z', '#c8a43a') + R(36, 86, 28, 4, '#5a4a22') + [40, 46, 54, 60].map((x) => R(x, 80, 3, 6, '#8a7a4a', 'rx="1"')).join('')
      + P('M42 60 L58 60 L60 76 L40 76Z', sk)
      // the Trandoshan head: wide jaw, scaled brow ridge, slit-pupil eyes
      + P('M34 44 C34 28 42 20 50 20 C58 20 66 28 66 44 C66 56 62 64 50 66 C38 64 34 56 34 44Z', sk, 'stroke="#2a3a14" stroke-width=".9"')
      + shade('M50 20 C58 20 66 28 66 44 C66 56 62 64 50 66Z', 0.14)
      + mirror(P('M36 40 Q42 34 48 39 Q42 37 36 40Z', '#3a4a1a') + E(42.6, 42.6, 3, 2.2, '#ff8a1a') + E(42.6, 42.6, 0.6, 1.9, '#1a0a00')
        + [[40, 28], [44, 25], [38, 33], [36, 50], [40, 56], [44, 30]].map(([x, y]) => E(x, y, 1.4, 1, '#6a8a3a')).join(''))
      + P('M40 54 Q50 60 60 54 Q50 57 40 54Z', '#1a2a0a') + mirror(P('M43 55.4 L44 58 L45 55.8Z', '#f0e8d0'))
      + C(47.6, 49, 0.7, '#1a2a0a') + C(52.4, 49, 0.7, '#1a2a0a')
      // his Relby flamethrower rifle
      + `<g transform="translate(22 96) rotate(-30)">${R(0, -3.4, 46, 6.8, '#3a3d44', 'rx="1.5"')}${R(10, -7, 16, 3.6, '#5a5e66')}${C(46, 0, 3.6, '#2a2c30')}${glow('#ff8a2a', C(48, 0, 1.6, '#ffb04a'), 2)}</g>`;
  });

  // ---------- Geonosis optional boss: Jango Fett, arena ----------
  add('jango_arena', () => {
    const [hm, hmd] = LG([[0, '#c8d4dc'], [0.5, '#7a8a98'], [1, '#3a4450']]);
    return arena() + hmd
      // jetpack flames roaring down from behind his shoulders
      + mirror(glow('#ffb03a', P('M22 64 C18 76 20 88 26 100 C28 90 32 82 30 64Z', '#ffd27a', 'opacity=".85"') + P('M24 66 C22 76 24 86 27 94 C28 86 30 78 29 66Z', '#fff4d0'), 4) + R(20, 56, 10, 10, '#6a7a8a', 'rx="2"'))
      + bolt(18, 76, 0, 66, '#ff3a2a') + bolt(82, 76, 100, 70, '#ff3a2a')
      + blaster(16, 80, -160, '#3a3d44') + blaster(84, 80, -20, '#3a3d44')
      + P('M2 100 C4 80 22 70 50 70 C78 70 96 80 98 100Z', '#4a5a6a') + P('M34 72 L66 72 L62 96 L38 96Z', '#8a98a8') + R(36, 88, 28, 4, '#2a2d33')
      + `<path d="M34 72 L30 100 M66 72 L70 100" stroke="#2a3440" stroke-width="1" fill="none"/>`
      + P('M34 46 C34 26 42 18 50 18 C58 18 66 26 66 46 L65 60 C61 66 39 66 35 60Z', hm, 'stroke="#1a2028" stroke-width=".9"')
      + P('M38 36 H62 V42 H54 V58 H46 V42 H38Z', '#0a0c10') + P('M36 26 C42 22 58 22 64 26 L64 30 C58 26 42 26 36 30Z', '#4a6a8a')
      + R(64, 34, 4, 14, '#5a6a7a', 'rx="1"') + E(43, 24, 5, 2, '#fff', 'opacity=".35"')
      + `<path d="M40 52 L44 54 M60 52 L56 54" stroke="#2a3440" stroke-width=".8"/>`;
  });

  // ---------- Exegol optional boss: Emperor Reborn ----------
  // Clamped into the life-support rig on Exegol, eyes gone milky white,
  // lightning pouring from both hands.
  add('emperor_reborn', () => exegol('#b58cff')
    // the hanging rig: claw arms and cables reaching down to him
    + `<g stroke="#2a2830" stroke-linecap="round" fill="none"><path d="M50 0 L50 14" stroke-width="5"/><path d="M50 10 C38 10 28 16 24 30" stroke-width="3"/><path d="M50 10 C62 10 72 16 76 30" stroke-width="3"/><path d="M24 30 L20 38 M76 30 L80 38" stroke-width="2"/></g>`
    + `<path d="M50 10 C38 10 28 16 24 30 M50 10 C62 10 72 16 76 30" stroke="#5a5664" stroke-width="1" fill="none"/>` + C(50, 14, 3.6, '#3a3640') + glow('#b58cff', C(50, 14, 1.4, '#d8c8ff'), 2)
    + P('M16 100 L22 58 C24 30 38 18 50 18 C62 18 76 30 78 58 L84 100Z', '#0e0c12') + shade('M50 18 C38 18 24 30 22 58 L16 100 L40 100 L36 60Z', 0.3)
    // the deep hood framing his face, its rim catching the lightning
    + P('M28 70 C24 44 34 22 50 21 C66 22 76 44 72 70 C68 62 62 58 60 50 C58 40 54 36 50 36 C46 36 42 40 40 50 C38 58 32 62 28 70Z', '#1a1620')
    + '<path d="M29 66 C27 44 36 25 50 24 C64 25 73 44 71 66" stroke="#5a4a7a" stroke-width="1" fill="none" opacity=".8"/><path d="M40 30 Q50 26 60 30" stroke="#2a2434" stroke-width="1.2" fill="none"/>'
    + E(50, 53, 10, 12.5, '#c8beb4') + P('M39.4 47 C41 38 46 36 50 36 C54 36 59 38 60.6 47 C57 42.6 43 42.6 39.4 47Z', '#1a1620') + shade('M40 46 Q50 43 60 46 L60 50 Q50 47 40 50Z', 0.25)
    + mirror(E(45.6, 50.6, 2, 1.3, '#eef2f6') + C(45.6, 50.6, 0.9, '#9aa6b4') + '<path d="M42.4 55.6 Q43.6 58 43 60.4" stroke="#8a7e74" stroke-width=".5" fill="none" opacity=".7"/>')
    + '<path d="M50 50 L49 55.4 Q50 56.2 51 55.4" stroke="#8a7e74" stroke-width=".6" fill="none"/><path d="M46 60 Q50 61.2 54 60" stroke="#6a4a44" stroke-width=".9" fill="none" stroke-linecap="round"/>'
    + mirror(glow('#7a4dff', '<path d="M30 86 L22 78 L26 74 L14 66 L18 62 L4 52 M26 74 L18 74 M18 62 L10 64" stroke="#e8dcff" stroke-width="1.5" fill="none"/><path d="M30 86 L20 88 L16 84 L2 90" stroke="#c8b0ff" stroke-width="1" fill="none"/>', 3) + E(30, 88, 4, 3, '#b8b0aa')));

  // ---------- Coruscant Under Siege optional boss: General Grievous, Warlord ----------
  // Cloaked, all four arms out, the sabers spinning into blurred arcs over
  // the burning city.
  add('grievous_warlord', () => siege()
    + `<g fill="none" stroke-linecap="round" opacity=".5"><path d="M8 50 A42 42 0 0 1 30 14" stroke="#46e070" stroke-width="3"/><path d="M92 50 A42 42 0 0 0 70 14" stroke="#3d8bff" stroke-width="3"/><path d="M10 80 A40 40 0 0 0 26 98" stroke="#3d8bff" stroke-width="2.4"/><path d="M90 80 A40 40 0 0 1 74 98" stroke="#46e070" stroke-width="2.4"/></g>`
    + saber(22, 84, 4, 34, '#3d8bff') + saber(78, 84, 96, 34, '#46e070') + saber(28, 92, 6, 70, '#46e070') + saber(72, 92, 94, 70, '#3d8bff')
    // the cape hanging off his shoulders
    + P('M24 66 C14 74 8 88 6 100 L94 100 C92 88 86 74 76 66 L66 72 L34 72Z', '#3a3a40') + `<path d="M16 98 Q20 84 28 72 M84 98 Q80 84 72 72" stroke="#55555c" stroke-width="1" fill="none"/>`
    + shoulders('#6b7077') + P('M40 76 L60 76 L58 100 L42 100Z', '#4a4e54') + [80, 85, 90, 95].map((y) => L(42, y, 58, y, '#8a9098', 1)).join('')
    + mirror(L(30, 80, 22, 84, '#8a9098', 2.4) + L(32, 86, 28, 92, '#8a9098', 2.4))
    + P('M40 26 C40 18 60 18 60 26 L64 36 L58 30 L42 30 L36 36Z', '#d9d2bf', 'stroke="#5a5444" stroke-width=".6"')
    + P('M37 32 L63 32 L65 50 L58 66 L42 66 L35 50Z', '#e6e0cf', 'stroke="#5a5444" stroke-width=".7"') + shade('M37 32 L50 32 L50 66 L42 66 L35 50Z', 0.1)
    + P('M39 39 L48 42 L47 48 L40 46Z', '#1a1810') + P('M61 39 L52 42 L53 48 L60 46Z', '#1a1810') + glowEyes(43.5, 56.5, 44.2, '#ffd23f', 1.7)
    + P('M44 54 L56 54 L55 64 L45 64Z', '#3a3830') + [47, 50, 53].map((x) => L(x, 55, x, 63, '#6a6858', 0.7)).join('')
    + `<path d="M37 32 L35 50 M63 32 L65 50" stroke="#ff8a3a" stroke-width=".8" opacity=".6"/>`);

  // ================= Legendary badge: Liberator of the Galaxy =================
  // Beat all 22 bosses, main and optional. A spiral galaxy turning inside a
  // gold ring of 22 stars (11 Jedi blue, 11 Sith red), laurels on both sides,
  // a crown star on top and the LIBERATOR ribbon. Same build as the other
  // legendary crests: viewBox -100..100, gold gradient, SMIL motion.
  let crestSeq = 0;
  root.Lib24Crest = () => {
    const u = `lib${++crestSeq}`;
    const motion = !(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const spin = (dur, rev) => (motion ? `<animateTransform attributeName="transform" type="rotate" from="${rev ? 360 : 0} 0 0" to="${rev ? 0 : 360} 0 0" dur="${dur}s" repeatCount="indefinite"/>` : '');
    const fade = (v, dur, b = 0) => (motion ? `<animate attributeName="opacity" values="${v}" dur="${dur}s" begin="${b}s" repeatCount="indefinite"/>` : '');
    const rays = Array.from({ length: 22 }, (_, k) => `<polygon points="0,${k % 2 ? -86 : -99} 4,0 -4,0" transform="rotate(${(k * 360) / 22})"/>`).join('');
    const ring = Array.from({ length: 22 }, (_, k) => {
      const a = ((k * 360) / 22 - 90) * Math.PI / 180;
      const x = (Math.cos(a) * 66).toFixed(1); const y = (Math.sin(a) * 66).toFixed(1);
      const c = k < 11 ? '#7cc8ff' : '#ff5a5a';
      return `<path transform="translate(${x},${y})" d="M0,-4.6 L1.3,-1.3 L4.6,0 L1.3,1.3 L0,4.6 L-1.3,1.3 L-4.6,0 L-1.3,-1.3Z" fill="${c}" filter="url(#${u}f)">${fade('1;.45;1', 2.4, -(k % 6) * 0.4)}</path>`;
    }).join('');
    const leaf = (k) => `<ellipse cx="0" cy="0" rx="9" ry="3.6" transform="translate(${(-70 - Math.sin(k * 0.5) * 6).toFixed(1)},${(40 - k * 14).toFixed(1)}) rotate(${-60 + k * 14})"/>`;
    const laurel = `<g fill="url(#${u}g)" stroke="#3a2400" stroke-width=".7">${[0, 1, 2, 3, 4, 5].map(leaf).join('')}</g>`;
    const arms = [0, 120, 240].map((r) => `<path d="M0,0 C14,-6 26,4 30,18 C22,8 12,4 0,6Z" fill="url(#${u}a)" transform="rotate(${r})"/>`).join('');
    return `<svg class="mc" viewBox="-100 -100 200 200" aria-hidden="true">
      <defs>
        <linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c8"/><stop offset=".35" stop-color="#ffd23f"/><stop offset=".7" stop-color="#a86f08"/><stop offset="1" stop-color="#ffe98a"/></linearGradient>
        <radialGradient id="${u}n" cy=".45"><stop offset="0" stop-color="#2a3a8a"/><stop offset=".6" stop-color="#0e1238"/><stop offset="1" stop-color="#04040e"/></radialGradient>
        <radialGradient id="${u}a"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#c8b4ff" stop-opacity=".8"/><stop offset="1" stop-color="#5a8aff" stop-opacity="0"/></radialGradient>
        <radialGradient id="${u}h"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".45" stop-color="#ffe08a" stop-opacity=".35"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient>
        <filter id="${u}f" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle r="99" fill="url(#${u}h)">${fade('1;.55;1', 3.2)}</circle>
      <g fill="url(#${u}g)" opacity=".45">${spin(50)}${rays}</g>
      ${laurel}<g transform="scale(-1,1)">${laurel}</g>
      <circle r="74" fill="url(#${u}n)" stroke="url(#${u}g)" stroke-width="6"/>
      <g fill="#fff">${Array.from({ length: 18 }, (_, k) => `<circle cx="${(Math.cos(k * 2.3) * (14 + (k * 19) % 42)).toFixed(1)}" cy="${(Math.sin(k * 2.3) * (14 + (k * 19) % 42)).toFixed(1)}" r="${k % 3 ? 0.7 : 1.2}">${fade('1;.3;1', 2.6, -(k % 5) * 0.5)}</circle>`).join('')}</g>
      <g opacity=".95">${spin(30)}${arms}<circle r="8" fill="url(#${u}a)"/><circle r="3.2" fill="#fff" filter="url(#${u}f)"/></g>
      <circle r="66" fill="none" stroke="url(#${u}g)" stroke-width="1" opacity=".5"/>
      <g>${spin(90, true)}${ring}</g>
      <circle r="58" fill="none" stroke="url(#${u}g)" stroke-width="1.4" stroke-dasharray="2 4" opacity=".8"/>
      <g transform="translate(0,-80)"><path d="M0,-16 L4,-4 L16,0 L4,4 L0,16 L-4,4 L-16,0 L-4,-4Z" fill="#fff" stroke="url(#${u}g)" stroke-width="1.6" filter="url(#${u}f)"/></g>
      <path d="M-50,77 H-72 L-63,86 L-72,95 H-50Z M50,77 H72 L63,86 L72,95 H50Z" fill="#7a5200" stroke="#3a2400" stroke-width="1"/>
      <rect x="-58" y="72" width="116" height="20" rx="2" fill="url(#${u}g)" stroke="#3a2400" stroke-width="1.2"/>
      <text y="86.5" text-anchor="middle" font-size="11" font-weight="800" letter-spacing="3" fill="#3a2400" font-family="inherit">LIBERATOR</text>
    </svg>`;
  };
})(typeof window !== 'undefined' ? window : globalThis);
