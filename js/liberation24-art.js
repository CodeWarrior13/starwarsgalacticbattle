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

  // A shaggy fur mass: an ellipse whose edge breaks into tufts.
  const shag = (cx, cy, rx, ry, n, amp, fill, extra) => {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2;
      const k = i % 2 ? 1 : 1 - amp;
      pts.push(`${(cx + Math.cos(a) * rx * k).toFixed(1)} ${(cy + Math.sin(a) * ry * k).toFixed(1)}`);
    }
    return P(`M${pts.join(' L')}Z`, fill, extra || '');
  };
  // Darth Vader's helmet, the shape everyone knows: dome, flared sides, lenses, the triangle grill.
  const vaderHelmet = (o = {}) => {
    const base = o.base || '#0e0e11';
    return P('M29.5 46 C29.5 24 40 15.5 50 15.5 C60 15.5 70.5 24 70.5 46 L77 67 L62 60.5 L60 69 L40 69 L38 60.5 L23 67Z', base, o.stroke ? `stroke="${o.stroke}" stroke-width=".9"` : '')
      + P('M34 30 C38 20 46 17.5 50 17.5 L50 22 C44 22 38 25 35 32Z', o.shine || '#5a5a66', 'opacity=".6"')
      + P('M37.5 37.5 L47 37.5 L46 45.5 L38.5 45.5Z', '#1a1a20') + P('M62.5 37.5 L53 37.5 L54 45.5 L61.5 45.5Z', '#1a1a20')
      + L(39.5, 39, 44, 39, o.lens || '#8a8aa0', 0.7) + L(56, 39, 60.5, 39, o.lens || '#8a8aa0', 0.7)
      + P('M46 47 L54 47 L57.5 61 L42.5 61Z', '#23252c') + [45.5, 48.5, 51.5, 54.5].map((x) => L(x, 51, x + (x - 50) * 0.18, 60, '#9aa1ab', 0.6)).join('')
      + P('M42.5 61 L57.5 61 L55 66 L45 66Z', '#16171b') + L(50, 22, 50, 37, '#2a2a33', 0.8);
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
      // the hood, raised: a peaked cowl rising over his head and falling to the shoulders
      + P('M24 66 C22 38 32 14 50 10 C68 14 78 38 76 66 C71 58 65 52 62 44 L38 44 C35 52 29 58 24 66Z', '#8a1018')
      + shade('M24 66 C22 38 32 14 50 10 L50 44 L38 44 C35 52 29 58 24 66Z', 0.22)
      + '<path d="M27 60 C26 40 34 20 50 13 M73 60 C74 40 66 20 50 13" stroke="#c23038" stroke-width=".9" fill="none" opacity=".55"/><path d="M33 52 C31 42 35 30 42 22 M67 52 C69 42 65 30 58 22" stroke="#5a060c" stroke-width="1" fill="none" opacity=".8"/>'
      // the face, drawn as one half and mirrored so both sides match
      + mirror(faceHalf)
      // the hood's front edge drawn down over his brow, its shadow across the forehead
      + P('M37.6 41 C37 27 42 19.6 50 19.6 C58 19.6 63 27 62.4 41 C60 33.6 56 30.4 50 30.4 C44 30.4 40 33.6 37.6 41Z', '#9a141e')
      + P('M38.6 40 C41 34 45 31.6 50 31.6 C55 31.6 59 34 61.4 40 L61 42.6 C58.4 37 54.6 35 50 35 C45.4 35 41.6 37 39 42.6Z', '#000', 'opacity=".38"')
      + '<path d="M37.6 41 C37 27 42 19.6 50 19.6 C58 19.6 63 27 62.4 41" stroke="#d23a42" stroke-width=".9" fill="none" opacity=".7"/><path d="M44 22 Q50 20.4 56 22" stroke="#5a060c" stroke-width=".7" fill="none"/>'
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
  // a heavy vibro-axe. Behind him the throne room: Han frozen on the wall,
  // chains, torches and Jabba's silhouette on his dais through the arch.
  add('gamorrean_guard', () => {
    const [sk, sd] = RG([[0, '#9ab85a'], [1, '#5a7a2a']], 0.45, 0.4, 0.6);
    return palace() + sd
      // Jabba on his dais through the arch, a band light glowing
      + E(50, 70, 14, 7, '#2a180c') + P('M38 70 C38 58 44 52 50 52 C56 52 60 56 62 62 C66 66 70 68 72 70Z', '#3a2a14') + C(46, 58, 0.7, '#ffb04a') + C(52, 58, 0.7, '#ffb04a')
      // Han in carbonite hanging on the wall, chains and a skull trophy
      + R(4, 30, 10, 20, '#6a7480', 'rx="1" stroke="#2a3038" stroke-width=".6"') + P('M7 36 C7 33 11 33 11 36 L11 40 L7 40Z', '#8a96a4') + L(6, 33, 5, 31, '#8a96a4', 0.8) + L(12, 33, 13, 31, '#8a96a4', 0.8)
      + mirror([0, 1, 2, 3, 4, 5].map((i) => E(24, 4 + i * 2.4, 0.8, 1.2, 'none', 'stroke="#5a4a3a" stroke-width=".5"')).join(''))
      + C(90, 30, 2.4, '#d8ccb0') + C(89.2, 29.6, 0.5, '#2a1a0c') + C(90.8, 29.6, 0.5, '#2a1a0c')
      + R(0, 92, 100, 8, '#2a180c') + [10, 22, 34, 66, 78, 90].map((x) => L(x, 92, x, 100, '#4a3020', 0.6)).join('')
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
  // The Blizzard Force trooper: domed helmet, the wide black polarised visor
  // dipping to a point, the breather and the cloth face skirt hanging to the
  // chest, heater pack straps. Echo Base trenches and an AT-AT behind.
  add('snowtrooper', () => {
    const [cloth, cd] = LG([[0, '#e6eaee'], [1, '#a8b2be']]);
    return hothField() + cd
      // the trench line and a Rebel turret with blaster bolts flying
      + P('M0 74 L100 70 L100 76 L0 80Z', '#c8d4de') + R(70, 62, 10, 6, '#7a848e', 'rx="1"') + L(74, 62, 64, 56, '#5a646e', 1.6) + bolt(64, 56, 46, 50, '#ff3a2a') + bolt(20, 30, 4, 26, '#3aff6a')
      + shoulders('#dfe4ea', { top: 72 }) + P('M4 100 C6 88 14 80 26 77 L30 100Z', '#f2f5f8', 'stroke="#7a8696" stroke-width=".7"') + P('M96 100 C94 88 86 80 74 77 L70 100Z', '#f2f5f8', 'stroke="#7a8696" stroke-width=".7"')
      + mirror(L(30, 78, 40, 100, '#5a646e', 2.2)) + R(40, 86, 20, 10, '#e8ecf0', 'rx="2" stroke="#7a8696" stroke-width=".6"') + [89, 92].map((y) => L(42, y, 58, y, '#9aa3ad', 0.6)).join('') + R(46, 87, 8, 2, '#3a3d45', 'rx=".5"')
      // the cloth face skirt, falling in folds from under the helmet
      + P('M30 50 C28 62 30 74 36 81 C42 84 58 84 64 81 C70 74 72 62 70 50Z', cloth, 'stroke="#7a8696" stroke-width=".8"')
      + '<path d="M34 56 Q33 70 37 80 M39 60 Q38 72 41 82 M44 62 Q44 74 45 83 M56 62 Q56 74 55 83 M61 60 Q62 72 59 82 M66 56 Q67 70 63 80" stroke="#9aa6b4" stroke-width=".8" fill="none"/>'
      // the helmet: dome, brow ridge, ear caps
      + P('M32 47 C32 28 40 19 50 19 C60 19 68 28 68 47 L68 53 L32 53Z', '#f6f8fa', 'stroke="#5a6676" stroke-width="1"')
      + shade('M50 19 C60 19 68 28 68 47 L68 53 L50 53Z', 0.07) + E(42, 25, 6, 2.4, '#fff', 'transform="rotate(-24 42 25)"')
      + '<path d="M33 33 Q50 27 67 33" stroke="#9aa6b4" stroke-width="1.2" fill="none"/><path d="M50 20 L50 30" stroke="#c8d0da" stroke-width="1.4"/>'
      + mirror(C(32, 46, 3.4, '#e8ecf0', 'stroke="#5a6676" stroke-width=".8"') + C(32, 46, 1.4, '#7a8696'))
      // the polarised visor: one wide black lens dipping to a point over the nose
      + P('M35 37 L65 37 L64.6 44 L56 45.4 L50 50.6 L44 45.4 L35.4 44Z', '#08090c')
      + P('M36.6 38.4 L50 38.4 L49 40 L37 40.4Z', '#5a7ab0', 'opacity=".75"') + P('M52 38.4 L63.4 38.4 L63.2 39.6 L54 39.8Z', '#5a7ab0', 'opacity=".5"')
      // the breather mask with its two filters
      + P('M43 47.6 L57 47.6 L56 60 C54 62 46 62 44 60Z', '#eef1f4', 'stroke="#5a6676" stroke-width=".8"') + L(50, 51, 50, 61, '#9aa6b4', 0.7)
      + mirror(C(46.2, 55, 2.4, '#3a3d45') + [53.6, 55, 56.4].map((y) => L(44.6, y, 47.8, y, '#7a828c', 0.4)).join(''))
      + `<g transform="translate(24 98) rotate(-20)">${R(0, -3, 46, 6, '#1a1c20', 'rx="1.5"')}${R(8, -6.4, 14, 3.4, '#3a3d45')}${R(40, -1.6, 12, 3.2, '#1a1c20')}${R(16, 3, 5, 7, '#1a1c20', 'rx="1"')}</g>`;
  });

  // ---------- Hoth optional boss: The Wampa ----------
  // The wampa's ice cave from Empire: Luke hanging upside down from the
  // ceiling, his lightsaber in the snow, the beast rearing up with both
  // clawed arms raised.
  add('wampa', () => iceCave()
    // frozen columns and the cave mouth glowing behind
    + E(50, 70, 30, 22, '#cfe6f6', 'opacity=".25"') + mirror(P('M0 30 Q8 50 4 84 L0 86Z', '#e8f4fc', 'opacity=".35"') + P('M8 26 Q14 52 10 88 L6 88 Q10 52 4 28Z', '#9ac4e4', 'opacity=".5"'))
    // Luke, upside down with his boots frozen into the ceiling
    + '<g transform="translate(-8 0) scale(.9)">' + ''
    + R(10, 0, 13, 7, '#e8f6ff', 'rx="1.5"') + R(13, 5, 2.6, 11, '#e89a3a') + R(17.4, 5, 2.6, 11, '#e89a3a') + R(12, 15, 9, 10, '#e89a3a', 'rx="1.5"') + R(12, 18, 9, 1.4, '#2a2420')
    + L(13, 24, 10.6, 32, '#e89a3a', 2) + L(20, 24, 22.4, 32, '#e89a3a', 2) + C(16.5, 28.6, 3, '#e8c4a0') + E(16.5, 31.4, 3.2, 1.8, '#d8b060') + '</g>'
    // his lightsaber lying in the snow
    + `<g transform="translate(76 95) rotate(-12)">${R(0, -1.2, 9, 2.4, '#9aa1ab', 'rx=".6"')}${R(2, -1.4, 1.6, 2.8, '#2a2d33')}</g>` + glow('#5aa8ff', C(85, 93, 1.2, '#cfe6ff'), 3)
    // raised arms, claws spread
    + mirror(shag(18, 54, 9, 22, 9, 0.22, '#eef2f6', 'stroke="#b8c8d8" stroke-width=".5" transform="rotate(-24 18 54)"')
      + P('M6 32 L4 24 L8 31Z M10 30 L10 21 L12 30Z M14 31 L17 23 L16 32Z', '#22242a'))
    // the body, a mountain of white fur
    + shag(50, 92, 40, 30, 22, 0.08, '#f2f5f8', 'stroke="#b8c8d8" stroke-width=".6"')
    + `<path d="M22 84 L26 80 L28 86 L32 80 L34 86 M60 74 L64 70 L66 76 L70 72 M36 78 L40 74 L42 80 M66 88 L70 84 L72 90 M40 92 L44 88 L46 94" stroke="#c8d4e0" stroke-width=".8" fill="none"/>`
    + shade('M10 100 C12 80 28 66 50 64 L50 100Z', 0.06)
    // the head with its curling horns
    + shag(50, 46, 21, 20, 16, 0.14, '#f6f8fa', 'stroke="#b8c8d8" stroke-width=".6"')
    + mirror('<path d="M34 32 C22 24 13 33 17 42 C20 48 28 47 28 41 C28 37 24 37 24 40" stroke="#7a6a4a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M34 32 C22 24 13 33 17 42" stroke="#d8c8a0" stroke-width="1.4" fill="none" stroke-linecap="round"/>')
    + `<path d="M36 34 L39 31 L41 35 M59 35 L61 31 L64 34 M44 28 L47 25 L49 29 M52 29 L54 25 L57 28" stroke="#c8d4e0" stroke-width=".7" fill="none"/>`
    // grey face: sunken eyes under a heavy brow, long snout, fangs
    + P('M40 38 C40 34 60 34 60 38 L58 56 C56 62 44 62 42 56Z', '#8a909a') + shade('M40 38 C40 34 50 34 50 34 L50 61 C46 61 43 59 42 56Z', 0.12)
    + mirror('<path d="M41 41.6 Q44 39.4 48 41.4" stroke="#3a3e46" stroke-width="1.8" fill="none" stroke-linecap="round"/>')
    + glowEyes(44.6, 55.4, 43.8, '#ffd23a', 1.2) + P('M48 47 L50 50 L52 47Z', '#3a3e46')
    + P('M42.4 52 Q50 50 57.6 52 L56 60 Q50 63 44 60Z', '#3a0c10') + mirror(P('M43.6 52.4 L45 57 L46.4 52.2Z', '#f2ead8') + P('M44.6 60 L45.6 56.4 L47 60.4Z', '#f2ead8'))
    + '<path d="M48 61 Q48.6 64 47.6 66" stroke="#9a1a1a" stroke-width=".8" fill="none" opacity=".75"/>');

  // ---------- Dagobah optional boss: The Cave's Vision ----------
  // Inside the dark-side cave: Vader, plain as day, his red blade locked
  // against Luke's blue one. Part of the mask has been cut away, and the
  // face underneath is Luke's own.
  add('cave_vision', () => darkCave()
    // the gnarled tree and its roots crowding the cave mouth, and a snake on a branch
    + `<path d="M0 0 L100 0 L100 8 Q80 16 74 6 Q60 18 50 8 Q40 18 26 6 Q20 16 0 8Z" fill="#14100a"/>`
    + `<path d="M84 44 Q92 40 98 44" stroke="#3a5a2a" stroke-width="2" fill="none" stroke-linecap="round"/>` + C(97.6, 43.6, 1, '#3a5a2a')
    + puffs('#9ad8c8', 0.25, [[50, 74, 46, 12]])
    + `<g style="filter:drop-shadow(0 0 2px #6affd8) drop-shadow(0 0 6px #1a6a5a)">`
    + P('M4 100 C6 84 18 74 34 72 L66 72 C82 74 94 84 96 100Z', '#0a0c0e') + R(41, 80, 18, 12, '#22242a', 'rx="1.5"') + R(43, 82, 3, 2, '#ff3b3b') + R(47, 82, 3, 2, '#3bff6a') + R(51, 82, 3, 2, '#3b8bff')
    + vaderHelmet({ shine: '#4a6a62' }) + '</g>'
    // the cut-away: a ragged hole across his right lens and cheek, Luke inside
    + P('M53 33 L58 31 L62 34 L64 40 L62 46 L64 52 L60 57 L55 55 L53 50 L54 44 L52 39Z', '#e8bc96')
    + P('M53 33 L58 31 L62 34 L63 37 C60 35 56 35 53.4 37Z', '#e0b45a')
    + E(57.6, 42, 2.1, 1.3, '#f4efe6') + C(57.4, 42, 1, '#3a7ab8') + L(55, 39.2, 60.4, 39.6, '#a07a3a', 1)
    + '<path d="M54 45 L53.4 49 L55 49.6" stroke="#b07a5a" stroke-width=".6" fill="none"/><path d="M55 52.6 Q57.6 53.6 60 52.4" stroke="#8a4a3a" stroke-width=".8" fill="none"/>'
    + '<path d="M53 33 L58 31 L62 34 L64 40 L62 46 L64 52 L60 57 L55 55 L53 50 L54 44 L52 39Z" stroke="#6affd8" stroke-width=".7" fill="none"/>'
    + [[68, 30, 20], [72, 46, -30], [70, 58, 40], [76, 36, 10]].map(([x, y, a]) => P(`M${x} ${y} l3 -1.6 l1.2 3.4 l-3.6 1Z`, '#0e0e11', `stroke="#6affd8" stroke-width=".4" transform="rotate(${a} ${x} ${y})"`)).join('')
    // the blades crossed in front of him
    + saber(82, 98, 30, 62, '#ff2a2a') + saber(16, 98, 70, 60, '#3d8bff'));

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
  // The biker scout: the white helmet with its wide brim, the black visor
  // under it and the long breather snout, black bodysuit and white chest
  // plate, a 74-Z speeder bike parked in the redwoods.
  add('scout_trooper', () => SCENES.endor()
    + [[2, 10], [86, 12]].map(([x, w]) => R(x, 0, w, 100, '#3a2616') + [0.3, 0.65].map((k) => L(x + w * k, 0, x + w * k, 100, '#24160a', 0.7)).join('')).join('')
    // the speeder bike: long nose, steering vanes, seat and engine
    + L(60, 70, 34, 64, '#9aa1ab', 1.2) + L(60, 74, 34, 70, '#9aa1ab', 1.2) + R(30, 62, 5, 10, '#6a7078', 'rx="1"')
    + P('M58 66 L94 62 L98 68 L96 76 L60 78Z', '#c8ccd2', 'stroke="#4a5058" stroke-width=".7"') + R(78, 58, 10, 4, '#2a2c30', 'rx="1"') + R(88, 66, 8, 8, '#4a5058', 'rx="1.5"') + glow('#ff8a3a', C(96, 70, 1.6, '#ffb04a'), 2)
    + shoulders('#141518', { top: 72 })
    + P('M33 77 C40 73 60 73 67 77 L64 96 L36 96Z', '#f4f6f8', 'stroke="#2a2c30" stroke-width=".8"') + L(50, 77, 50, 96, '#9aa3ad', 0.8)
    + R(42, 82, 16, 7, '#2a2c30', 'rx="1"') + [44, 47, 50, 53].map((x) => R(x, 84, 2, 3, ['#ff3b3b', '#3bff6a', '#3b8bff', '#c8ccd2'][(x - 44) / 3], 'rx=".3"')).join('')
    + mirror(P('M6 92 C8 84 16 79 26 78 L30 86 C22 88 16 92 14 98Z', '#f4f6f8', 'stroke="#2a2c30" stroke-width=".7"'))
    + P('M41 60 L59 60 L60 76 L40 76Z', '#141518')
    // helmet: rounded dome over a wide brim that dips at the front
    + P('M37 36 C37 23 43 17 50 17 C57 17 63 23 63 36Z', '#f6f7f8', 'stroke="#2a2c30" stroke-width="1"')
    + shade('M50 17 C57 17 63 23 63 36 L50 36Z', 0.06) + E(44, 23, 4.4, 1.8, '#fff', 'transform="rotate(-24 44 23)"') + R(48.8, 17.4, 2.4, 18, '#d8dce2')
    + P('M28 38.6 C30 34.4 38 33.4 50 33.4 C62 33.4 70 34.4 72 38.6 L67 42 C62 40.4 38 40.4 33 42Z', '#eef0f2', 'stroke="#2a2c30" stroke-width="1"')
    + P('M33 42 C38 40.4 62 40.4 67 42 L64 44 C60 43 40 43 36 44Z', '#5a626c')
    // narrow face with the black visor band
    + P('M37 44 L63 44 L61 50 L39 50Z', '#0a0b0e') + P('M38.6 45 L61.4 45 L61 46.4 L39 46.4Z', '#4a5a70')
    + mirror(P('M37 44 L45.6 50 L44.6 61 L41 63 L38 56Z', '#eceef1', 'stroke="#2a2c30" stroke-width=".7"') + L(39.4, 53, 43.6, 53, '#9aa3ad', 0.5))
    // the long breather snout down to the round vent
    + P('M45.6 50 L54.4 50 L55.6 64.6 C55.6 67.6 44.4 67.6 44.4 64.6Z', '#f4f6f8', 'stroke="#2a2c30" stroke-width=".8"') + L(50, 51, 50, 60, '#b8bec6', 0.8)
    + E(50, 64, 3.4, 2.2, '#2a2c30') + [48.4, 50, 51.6].map((x) => L(x, 62.6, x, 65.4, '#8a929c', 0.4)).join('')
    + blaster(24, 92, -50, '#1c1d21'));

  // ---------- Endor optional boss: AT-ST Walker ----------
  // The scout walker stalking through the forest moon, drawn in full detail:
  // the boxy armoured head with its viewports, top hatch, side grenade drum
  // and twin chin blasters, the bird legs with pistons and clawed feet.
  // Ewoks swing their log trap down from the redwoods.
  add('atst', () => {
    const [hull, hd] = LG([[0, '#d8dee4'], [0.5, '#9aa2ac'], [1, '#5a626c']]);
    const [leg, ld] = LG([[0, '#8a929c'], [1, '#4a525c']], 0, 0, 1, 0);
    const [sun, sund] = RG([[0, '#fff8d8', 0.55], [1, '#fff8d8', 0]], 0.7, 0.1, 0.6);
    return R(0, 0, 100, 100, '#14301a') + hd + ld + sund
      + R(0, 0, 100, 60, '#4a7a52', 'opacity=".5"') + R(0, 0, 100, 100, sun)
      + [[62, 0, 70, 100], [76, 0, 88, 100]].map(([a, b, c, d]) => P(`M${a} ${b} L${a + 4} ${b} L${c + 6} ${d} L${c - 2} ${d}Z`, '#fff8d8', 'opacity=".08"')).join('')
      // redwoods with bark, far and near
      + [[30, 4, '#3a2a1a'], [48, 3, '#3a2a1a'], [4, 11, '#2a1a0c'], [84, 12, '#2a1a0c']].map(([x, w, c]) => R(x, 0, w, 100, c) + [0.25, 0.5, 0.75].map((k) => L(x + w * k, 0, x + w * k + 0.6, 100, '#160c04', 0.6)).join('') + R(x + w * 0.1, 0, w * 0.15, 100, '#5a3e24', 'opacity=".5"')).join('')
      // the Ewok log trap: two logs swinging in on vines
      + L(14, 0, 22, 34, '#3a5a2a', 0.8) + L(20, 0, 26, 34, '#3a5a2a', 0.8) + `<g transform="rotate(-12 24 38)">${R(10, 34, 28, 7, '#6a4426', 'rx="3.5"')}${E(10, 37.5, 2, 3.5, '#8a6440')}${L(14, 36, 34, 36, '#4a2e14', 0.5)}</g>`
      // ground: ferns, fallen branches, mist
      + R(0, 86, 100, 14, '#1e3a1c') + [[4, 92], [18, 94], [32, 90], [66, 92], [92, 90]].map(([x, y]) => P(`M${x} ${y} q-6 -8 -10 -4 M${x} ${y} q6 -8 10 -4 M${x} ${y} q-2 -10 0 -12`, 'none', 'stroke="#3a6a2a" stroke-width="1.6" stroke-linecap="round"')).join('')
      + puffs('#d8e8d0', 0.25, [[50, 92, 50, 8]])
      // far leg, a step forward
      + `<g stroke-linecap="round" fill="none"><path d="M46 60 L36 74 L30 88" stroke="#2a3038" stroke-width="4.6"/><path d="M46 60 L36 74 L30 88" stroke="#5a626c" stroke-width="2.4"/><path d="M42 62 L35 70" stroke="#2a3038" stroke-width="1.2"/></g>`
      + C(36, 74, 3, '#4a525c', 'stroke="#2a3038" stroke-width=".6"') + P('M20 88 L37 88 L39 93 L33 93 L31 91 L26 93 L19 93Z', '#3a4048', 'stroke="#2a3038" stroke-width=".6"')
      // near leg, bent back at the knee, with its piston
      + `<g stroke-linecap="round" fill="none"><path d="M54 60 L66 74 L58 89" stroke="#2a3038" stroke-width="5.4"/><path d="M54 60 L66 74 L58 89" stroke="${leg}" stroke-width="3.4"/><path d="M57 64 L64 72" stroke="#2a3038" stroke-width="1.4"/><path d="M63 79 L60 86" stroke="#c8ced6" stroke-width=".8"/></g>`
      + C(66, 74, 3.6, '#6a727c', 'stroke="#2a3038" stroke-width=".7"') + C(66, 74, 1.4, '#3a4048')
      + P('M46 89 L66 89 L69 95 L62 95 L59 92 L54 95 L45 95Z', '#5a626c', 'stroke="#2a3038" stroke-width=".7"') + L(48, 91, 64, 91, '#8a929c', 0.6)
      // hip joint and gyro
      + R(42, 52, 18, 10, '#4a525c', 'rx="2" stroke="#2a3038" stroke-width=".7"') + C(51, 57, 3.6, '#6a727c', 'stroke="#2a3038" stroke-width=".6"') + C(51, 57, 1.2, '#2a3038')
      // the head
      + P('M14 30 L26 20 L70 18 L80 24 L80 44 L70 52 L28 52 L16 44Z', hull, 'stroke="#2a3038" stroke-width="1.1" stroke-linejoin="round"')
      + P('M14 30 L26 20 L44 19.2 L44 34 L16 38Z', '#e8ecf0', 'opacity=".35"') + shade('M16 44 L28 52 L70 52 L80 44 L80 40 L16 40Z', 0.16)
      // viewports and the hatch
      + P('M18 32 L28 25 L44 24.4 L44 31 L20 36Z', '#0c1014') + glow('#ffb03a', P('M22 32 L29 27.6 L42 27.2 L42 28.8 L23 33.4Z', '#ffb03a', 'opacity=".7"'), 1.5)
      + R(44, 12, 18, 7, '#8a929c', 'rx="1.5" stroke="#2a3038" stroke-width=".8"') + R(50, 8, 6, 4, '#6a727c', 'rx="1"') + L(53, 8, 53, 3, '#4a525c', 0.6)
      // panel lines, rivets and weathering
      + '<path d="M44 19 L44 52 M62 18.6 L62 52 M16 40 L80 40 M70 18 L70 52 M28 52 L26 44" stroke="#4a525c" stroke-width=".6" fill="none"/>'
      + [[47, 22], [59, 22], [47, 49], [59, 49], [66, 22], [66, 49], [76, 27], [76, 41]].map(([x, y]) => C(x, y, 0.6, '#4a525c')).join('')
      + '<path d="M30 44 l3 2 M52 26 l2 3 M72 30 l-1 3" stroke="#3a4048" stroke-width=".6" opacity=".7"/>' + E(58, 46, 6, 1.6, '#6a4a2a', 'opacity=".35"')
      // side grenade drum and light blaster
      + C(56, 33, 6, '#7a828c', 'stroke="#2a3038" stroke-width=".9"') + C(56, 33, 3.4, '#5a626c', 'stroke="#2a3038" stroke-width=".6"') + C(56, 33, 1.4, '#1a1e24')
      + R(80, 30, 12, 3.6, '#4a525c', 'stroke="#2a3038" stroke-width=".6"') + R(90, 31, 6, 1.6, '#2a3038')
      // the twin chin blasters, firing
      + R(4, 46, 24, 3.2, '#3a4048', 'stroke="#1a1e24" stroke-width=".5"') + R(6, 50.6, 22, 2.6, '#3a4048', 'stroke="#1a1e24" stroke-width=".5"') + R(24, 44, 8, 10, '#4a525c', 'rx="1"')
      + glow('#3aff6a', C(4, 47.6, 2.6, '#d8ffe0') + C(6, 51.9, 2, '#d8ffe0'), 3) + bolt(-6, 47.6, 2, 47.6, '#3aff6a')
      // an Ewok with a spear in the ferns
      + E(86, 88, 6, 5.6, '#6a4a2a') + P('M80 88 C80 80 92 80 92 88 C90 84 82 84 80 88Z', '#a0602a') + C(84, 88.4, 1, '#0c0806') + C(88, 88.4, 1, '#0c0806') + E(86, 91, 2.4, 1.6, '#8a6440')
      + L(93, 96, 97, 74, '#6a4a2a', 0.9) + P('M96.4 74 L98 70 L97.8 75Z', '#c8ccd2')
      + puffs('#3a3a30', 0.45, [[14, 26, 9, 6], [10, 16, 7, 5]]);
  });

  // ---------- Scarif opponent: Shoretrooper ----------
  // The coastal defender: white helmet with a wide wrap-around visor and a
  // sand-coloured lower face with breather slots, khaki fatigues under white
  // chest armour with squad leader blue, palms and an AT-ACT in the surf.
  add('shoretrooper', () => SCENES.scarif()
    // an AT-ACT wading in the shallows and the Citadel tower
    + `<g transform="translate(66 40)" fill="#8a929c">${R(0, 0, 22, 9, '#8a929c', 'rx="1.5"')}${R(20, 2, 7, 5, '#8a929c')}${R(1, 9, 16, 5, '#6a727c')}${[3, 7, 13, 17].map((x) => R(x, 14, 1.6, 10, '#7a828c')).join('')}</g>`
    + P('M6 62 L9 22 L17 22 L20 62Z', '#d8dce2', 'opacity=".8"') + E(13, 20, 6, 2, '#b8bec6')
    + [[12, 42], [90, 36]].map(([x, y]) => L(x, 76, x + 2, y, '#6a4a2a', 1.6) + P(`M${x + 2} ${y} q-10 2 -14 8 M${x + 2} ${y} q10 2 14 8 M${x + 2} ${y} q-4 -6 -12 -6 M${x + 2} ${y} q4 -6 12 -6`, 'none', 'stroke="#2a7a4a" stroke-width="2.4" stroke-linecap="round"')).join('')
    // khaki fatigues, white chest and shoulder armour, blue rank markings
    + shoulders('#c8b48a', { top: 72 }) + mirror(L(30, 78, 36, 100, '#8a7a5a', 1.6))
    + P('M33 77 C40 73 60 73 67 77 L64 98 L36 98Z', '#f2f0ea', 'stroke="#5a4a2a" stroke-width=".8"') + L(50, 77, 50, 98, '#c8c0aa', 0.8)
    + mirror(P('M8 90 C10 82 18 78 27 77 L31 85 C23 87 17 91 15 97Z', '#f2f0ea', 'stroke="#5a4a2a" stroke-width=".7"') + R(14, 86, 8, 2.2, '#2a6ac8', 'transform="rotate(-22 18 87)"'))
    + R(40, 84, 20, 5, '#8a7a5a', 'rx="1"') + [43, 48, 53].map((x) => R(x, 85, 4, 3, '#a8986e', 'rx=".5"')).join('')
    + P('M41 60 L59 60 L60 76 L40 76Z', '#a8946a')
    // helmet: white dome, wrap-around black visor, sand lower face, slotted breather
    + P('M32.6 45 C32.6 27 41 19 50 19 C59 19 67.4 27 67.4 45 L67.4 56 C62 65 38 65 32.6 56Z', '#f6f4ee', 'stroke="#3a3428" stroke-width="1"')
    + E(42, 25, 6, 2.4, '#fff', 'transform="rotate(-24 42 25)"') + R(48.8, 19.6, 2.4, 14, '#e0dccf')
    + P('M32.8 47 L67.2 47 L67.4 56 C62 65 38 65 32.6 56Z', '#c8ae7a', 'stroke="#3a3428" stroke-width=".8"')
    + P('M33 37.4 L67 37.4 L66.4 45 L33.6 45Z', '#08090b') + P('M34.4 38.4 L65.6 38.4 L65.4 40 L34.6 40Z', '#5a7a90', 'opacity=".75"')
    + mirror(P('M33.6 45 L41 45 L42 52 L35 54Z', '#e8e4d8', 'stroke="#3a3428" stroke-width=".5"'))
    + P('M42 50 L58 50 L56.4 61 L43.6 61Z', '#3a3428') + [44.4, 46.8, 49.2, 51.6, 54].map((x) => R(x, 51.4, 1.4, 8.4, '#b8a47a', 'rx=".4"')).join('')
    + `<g transform="translate(26 98) rotate(-18)">${R(0, -3, 48, 6, '#2a2620', 'rx="1.5"')}${R(8, -6.4, 18, 3.4, '#4a4436')}${R(42, -1.6, 12, 3.2, '#2a2620')}${R(18, 3, 5, 7, '#2a2620', 'rx="1"')}</g>`);

  // ---------- Scarif optional boss: Director Krennic ----------
  // On the Citadel platform in his white cape, two death troopers at his
  // back, the Death Star over Scarif firing on the shield gate.
  add('krennic', () => {
    const [sky, sd] = LG([[0, '#4aa8d8'], [1, '#bfe8f4']]);
    const [ds, dsd] = RG([[0, '#c8ced6'], [0.7, '#8a929c'], [1, '#4a525c']], 0.35, 0.35, 0.75);
    const [dt, dtd] = LG([[0, '#3a3e46'], [0.5, '#1c1e22'], [1, '#0c0d10']], 0, 0, 1, 1);
    // A death trooper: tall black helmet, bulbous green lenses, ribbed mouth, shoulder armour, rifle.
    const dtrooper = (x) => `<g transform="translate(${x} 0)">`
      + P('M-14 100 L-12 74 C-10 66 -4 62 0 62 C4 62 10 66 12 74 L14 100Z', dt, 'stroke="#4a4e56" stroke-width=".5"')
      + P('M-12 76 C-10 70 -6 68 -2 68 L-3 76Z', '#2a2e36') + P('M12 76 C10 70 6 68 2 68 L3 76Z', '#2a2e36') + R(-6, 78, 12, 5, '#2a2e36', 'rx="1"') + C(-8, 82, 0.8, '#4ade80')
      + P('M-8.6 50 C-8.6 40 -4 36 0 36 C4 36 8.6 40 8.6 50 L9 60 C6 64 -6 64 -9 60Z', dt, 'stroke="#5a5e66" stroke-width=".6"')
      + '<path d="M-7 44 Q0 41.4 7 44" stroke="#4a4e56" stroke-width=".7" fill="none"/>' + L(0, 36.6, 0, 43, '#4a4e56', 0.6)
      + glow('#4ade80', P('M-6.6 46.4 C-6.6 44 -1.6 44 -1.6 46.4 L-2.2 50.6 C-4 51.6 -5.8 50.8 -6.6 46.4Z', '#1a4a2a') + P('M6.6 46.4 C6.6 44 1.6 44 1.6 46.4 L2.2 50.6 C4 51.6 5.8 50.8 6.6 46.4Z', '#1a4a2a'), 1.6)
      + E(-4.6, 46, 0.9, 0.6, '#c8ffd8', 'opacity=".8"') + E(4.6, 46, 0.9, 0.6, '#c8ffd8', 'opacity=".8"')
      + P('M-3 53 L3 53 L3.6 60 L-3.6 60Z', '#0a0b0e') + [-2, -0.7, 0.7, 2].map((d) => L(d, 54, d, 59, '#4a4e56', 0.35)).join('')
      + '</g>';
    return sd + dsd + dtd + R(0, 0, 100, 100, sky)
      // the Death Star: shaded sphere, equatorial trench, the dish, surface plating and lights
      + C(78, 20, 16, ds) + L(62.2, 21.6, 93.8, 18.4, '#5a626c', 1) + L(62.4, 22.6, 93.6, 19.4, '#c8ced6', 0.4)
      + [[66, 12, 8], [70, 28, 10], [82, 9, 9], [86, 29, 8], [74, 33, 6]].map(([x, y, w]) => L(x, y, x + w, y - 0.6, '#6a727c', 0.4)).join('')
      + [[67, 16], [84, 14], [88, 24], [76, 27], [70, 25], [90, 16]].map(([x, y]) => R(x, y, 0.8, 0.5, '#e8ecf0', 'opacity=".7"')).join('')
      + C(71, 12.6, 4.4, '#7a828c', 'stroke="#4a525c" stroke-width=".5"') + C(71, 12.6, 2.8, 'none', 'stroke="#5a626c" stroke-width=".4"') + C(71, 12.6, 1.2, '#4a525c')
      + glow('#7aff6a', C(71, 12.6, 0.9, '#d8ffc8') + L(71, 12.6, 94, 58, '#c8ffb0', 1.4), 3) + E(94, 58, 12, 3.4, '#e8ffd8', 'opacity=".85"') + E(94, 58, 22, 6, '#ffffff', 'opacity=".25"')
      + R(0, 56, 100, 10, '#2ba3b8') + P('M0 60 Q20 58 40 60 T80 60 T100 60', 'none', 'stroke="#8ad8e8" stroke-width=".6"')
      // the Citadel tower and its dish
      + P('M8 66 L12 20 L22 20 L26 66Z', '#cfd4da', 'stroke="#8a929c" stroke-width=".6"') + R(10, 14, 14, 6, '#b8bec6') + E(17, 12, 9, 2.6, '#9aa2ac') + L(17, 12, 17, 4, '#9aa2ac', 0.8)
      + [28, 36, 44, 52].map((y) => L(13, y, 22 + (y - 28) * 0.06, y, '#8a929c', 0.5)).join('')
      + R(0, 66, 100, 34, '#7a828c') + [70, 78, 88].map((y) => L(0, y, 100, y, '#5a626c', 0.6)).join('')
      + dtrooper(14) + dtrooper(86)
      // the white cape and uniform
      + P('M18 100 C18 82 22 70 32 66 L68 66 C78 70 82 82 82 100Z', '#eceef2', 'stroke="#9aa2ac" stroke-width=".8"')
      + '<path d="M24 98 Q26 82 34 70 M76 98 Q74 82 66 70 M30 99 Q32 86 37 74 M70 99 Q68 86 63 74" stroke="#b8c0ca" stroke-width=".8" fill="none"/>'
      + P('M32 74 C38 70 62 70 68 74 L66 100 L34 100Z', '#f8f8f6', 'stroke="#9aa2ac" stroke-width=".8"')
      + R(34, 80, 10, 4, '#1a1a1e') + [0, 1, 2, 3].map((i) => R(34.6 + i * 2.4, 81, 1.6, 2, ['#3b6fd6', '#c43b2e', '#3b6fd6', '#e0b83a'][i])).join('')
      + R(34, 92, 32, 3, '#2a2a2e') + R(47, 91.4, 6, 4, '#c8ccd2', 'rx=".6"')
      + P('M40 70 L60 70 L58 76 L42 76Z', '#e8e8e4') + L(50, 76, 50, 92, '#c8ccd2', 0.8)
      + neck('#e8c4a4') + head('#e8c4a4', { ry: 14.5 }) + eyes({ iris: '#3a6aa8' }) + brows('#8a7a6a', { angry: true }) + nose() + mouth('smirk', { color: '#8a4a3a' })
      + P('M37 42 C36 30 42 27 46 28 L44 32 C40 33 39 37 38 43Z', '#c8c4be') + P('M63 42 C64 30 58 27 54 28 L56 32 C60 33 61 37 62 43Z', '#c8c4be')
      + '<path d="M43 30 Q50 28 57 30" stroke="#d8b494" stroke-width=".6" fill="none"/>'
      + blaster(66, 90, -40, '#1a1c20');
  });

  // ---------- Geonosis opponent: Geonosian Warrior ----------
  // A winged Geonosian soldier over the hive spires: long ridged head,
  // bulging compound eyes, mandibles, thin armoured limbs, veined wings and
  // the sonic blaster with its green charge.
  add('geonosian_warrior', () => {
    const [sk, sd] = LG([[0, '#c8884a'], [0.5, '#9a5a2a'], [1, '#5a2e12']]);
    return SCENES.geonosis() + sd
      // the hive spires and droid factory glow
      + [[8, 28, 8], [20, 40, 6], [80, 30, 7], [92, 44, 6]].map(([x, y, w]) => P(`M${x - w} 80 Q${x - w / 2} ${y + 10} ${x} ${y} Q${x + w / 2} ${y + 10} ${x + w} 80Z`, '#8a4a22', 'opacity=".9"') + C(x, y + 14, 1, '#ffb04a', 'opacity=".7"')).join('')
      + [[30, 16], [70, 12], [58, 20]].map(([x, y]) => `<g transform="translate(${x} ${y})">${E(0, 0, 3, 1, '#3a1a0a')}${L(-3, -1, -6, -4, '#3a1a0a', 0.5)}${L(3, -1, 6, -4, '#3a1a0a', 0.5)}</g>`).join('')
      // veined wings fanned behind
      + mirror(P('M42 64 C28 46 10 38 2 42 C4 54 20 64 40 68Z', '#f4e6c8', 'opacity=".4" stroke="#8a6a3a" stroke-width=".6"') + '<path d="M40 66 C28 54 16 46 4 43 M40 67 C28 61 16 58 6 52 M40 65 C30 50 22 44 12 41" stroke="#8a6a3a" stroke-width=".5" fill="none" opacity=".75"/>')
      // armoured shoulders and thin arms
      + shoulders('#6a3a1a', { top: 76 }) + '<path d="M28 82 Q50 77 72 82 M26 90 Q50 85 74 90" stroke="#3a1a08" stroke-width="1" fill="none"/>'
      + mirror(P('M26 80 L22 92 L25 93 L29 82Z', '#7a4422') + C(23.6, 92.6, 1.6, '#5a2e12'))
      + P('M45 60 L55 60 L56 78 L44 78Z', '#5a2e12') + [64, 68, 72].map((y) => L(45, y, 55, y, '#3a1a08', 0.6)).join('')
      // the long ridged head
      + P('M37 44 C35 30 40 14 50 10 C60 14 65 30 63 44 C62 54 58 62 50 65 C42 62 38 54 37 44Z', sk, 'stroke="#3a1a08" stroke-width=".9"')
      + P('M50 10 C48 18 47.6 30 50 38 C52.4 30 52 18 50 10Z', '#e0a464') + '<path d="M43 17 Q50 13 57 17 M41 22 Q50 18 59 22 M40 28 Q50 24 60 28 M39 34 Q50 30 61 34" stroke="#4a2410" stroke-width=".7" fill="none"/>'
      + mirror(E(42.4, 41, 5, 6.4, '#1e0c04', 'transform="rotate(-20 42.4 41)" stroke="#3a1a08" stroke-width=".6"') + E(41.4, 39, 2.2, 2.6, '#7a4a2a', 'opacity=".55"') + C(40.6, 38.2, 0.9, '#ffe0b0', 'opacity=".8"')
        + P('M46 55 C44 59 42 63 43.6 67.6 L46.6 61Z', '#4a2410') + P('M37.6 46 Q36 50 37.6 54', 'none', 'stroke="#4a2410" stroke-width=".6"'))
      + '<path d="M46 52 Q50 54.6 54 52" stroke="#2a1006" stroke-width=".9" fill="none"/>'
      // the sonic blaster, charge glowing in its emitter ring
      + `<g transform="translate(64 90) rotate(-30)">${R(0, -4, 24, 8, '#6a3e1c', 'rx="3"')}${R(4, -6, 10, 2.4, '#8a5a2a', 'rx="1"')}${C(26, 0, 5.4, '#3a2410')}${C(26, 0, 3.6, 'none', 'stroke="#7aff8a" stroke-width="1"')}${C(26, 0, 2, '#b0ffb8', 'style="filter:drop-shadow(0 0 3px #7aff8a)"')}</g>`;
  });

  // ---------- Mustafar opponent: Purge Trooper ----------
  // The Inquisitorius' Jedi hunter: glossy black armour, the angular helmet
  // with its crest ridge and wide black faceplate, electrostaff crackling,
  // Fortress Vader rising over the lava behind.
  add('purge_trooper', () => SCENES.lava()
    // Fortress Vader: the tower and its two prongs
    + P('M72 70 L76 26 L74 14 L78 22 L80 14 L82 22 L86 14 L84 26 L88 70Z', '#120606') + R(79, 30, 2, 3, '#ff6a2a', 'opacity=".8"')
    + puffs('#3a2018', 0.6, [[20, 20, 18, 8], [60, 10, 20, 7]]) + embers(91, 18, '#ffb04a')
    // armour: glossy black plates with silver edges
    + shoulders('#101012', { top: 72 })
    + P('M33 77 C40 73 60 73 67 77 L64 98 L36 98Z', '#1c1c20', 'stroke="#6a6a74" stroke-width=".7"') + L(50, 77, 50, 98, '#3a3a42', 0.8)
    + [83, 89, 95].map((y) => P(`M38 ${y} Q50 ${y + 2.4} 62 ${y}`, 'none', 'stroke="#4a4a54" stroke-width=".7"')).join('')
    + P('M6 92 C8 82 18 77 29 76 L33 86 C24 88 17 93 15 99Z', '#24242a', 'stroke="#7a7a84" stroke-width=".7"') + P('M8 88 C12 82 20 79 28 78', 'none', 'stroke="#9a9aa4" stroke-width=".6"')
    + P('M94 92 C92 82 82 77 71 76 L67 86 C76 88 83 93 85 99Z', '#1a1a1e', 'stroke="#6a6a74" stroke-width=".7"')
    + P('M41 60 L59 60 L60 76 L40 76Z', '#0a0a0c')
    // the helmet: rounded skull with a centre crest, angled cheeks, wide faceplate
    + P('M33 44 C33 28 41 19 50 19 C59 19 67 28 67 44 L68 55 L61 64 L39 64 L32 55Z', '#18181c', 'stroke="#6a6a74" stroke-width="1"')
    + P('M48.4 19.4 L51.6 19.4 L52.4 38 L47.6 38Z', '#3a3a42') + E(42, 26, 5, 2, '#fff', 'opacity=".22" transform="rotate(-24 42 26)"')
    + mirror(P('M33.4 47 L41 47 L42 58 L37 62 L33.4 55Z', '#26262c', 'stroke="#5a5a64" stroke-width=".5"'))
    + P('M35 38 C42 35.6 58 35.6 65 38 L62.6 47 L55 49 L50 56 L45 49 L37.4 47Z', '#050506', 'stroke="#7a7a84" stroke-width=".7"')
    + P('M37 39.4 C43 37.6 49 37.4 49 37.4 L48 40 C43 40 39.4 40.6 37.4 41.4Z', '#4a5260', 'opacity=".7"')
    + P('M44 56 L56 56 L54.6 62 L45.4 62Z', '#2a2a30') + [46.4, 48.8, 51.2, 53.6].map((x) => L(x, 56.8, x, 61.2, '#6a6a74', 0.5)).join('')
    // the electrostaff, blue arcs at both ends
    + L(8, 98, 92, 52, '#2a2a30', 2.6) + L(8, 98, 92, 52, '#5a5a64', 0.6)
    + glow('#7ab8ff', '<path d="M8 98 L12 93 L9.6 91 L15 88 M92 52 L87.6 54 L90 57 L84.6 58" stroke="#e0f0ff" stroke-width="1.2" fill="none"/>', 3)
    + R(14, 87, 7, 3.4, '#4a4a52', 'rx="1" transform="rotate(-29 17.5 88.7)"') + R(79, 53, 7, 3.4, '#4a4a52', 'rx="1" transform="rotate(-29 82.5 54.7)"'));

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
  // The Separatist droid commando from The Clone Wars: small domed head with
  // a single round photoreceptor, segmented neck, broad armoured shoulders,
  // tan plating with a commander's white markings, vibrosword raised.
  add('commando_droid', () => {
    const [arm, ad] = LG([[0, '#b8a888'], [1, '#6a5e48']]);
    return siege() + ad
      // the vibrosword
      + L(16, 96, 6, 30, '#9aa0a8', 1.8) + L(16, 96, 6, 30, '#e8ecf0', 0.5) + R(14, 92, 6, 3, '#3a342a', 'rx=".8" transform="rotate(-8 17 93.5)"')
      // broad flat shoulders, thin torso, backpack frame
      + P('M8 100 L12 82 C14 76 22 72 34 72 L66 72 C78 72 86 76 88 82 L92 100Z', '#2a2620')
      + mirror(P('M10 84 C12 76 20 72 32 72 L36 80 C26 80 18 84 14 90Z', arm, 'stroke="#2a2620" stroke-width=".8"') + R(16, 78, 10, 2.4, '#ece6d4', 'transform="rotate(-14 21 79)"'))
      + P('M38 76 L62 76 L60 100 L40 100Z', arm, 'stroke="#2a2620" stroke-width=".8"') + [82, 88, 94].map((y) => L(41, y, 59, y, '#4a4234', 0.7)).join('') + R(44, 78, 12, 2.6, '#ece6d4')
      // the segmented neck
      + R(46.4, 56, 7.2, 18, '#4a4234') + [59, 62, 65, 68, 71].map((y) => R(45.6, y, 8.8, 1.6, '#7a6e58', 'rx=".6"')).join('')
      // the domed head with its round photoreceptor
      + P('M38 42 C38 26 44 18 50 18 C56 18 62 26 62 42 C62 52 57 58 50 58 C43 58 38 52 38 42Z', arm, 'stroke="#2a2620" stroke-width="1"')
      + shade('M50 18 C56 18 62 26 62 42 C62 52 57 58 50 58Z', 0.15) + E(44, 25, 3.6, 1.8, '#fff', 'opacity=".4" transform="rotate(-24 44 25)"')
      + P('M44.6 21 C46 19.4 54 19.4 55.4 21 L54.6 32 L45.4 32Z', '#ece6d4', 'opacity=".95"')
      + C(50, 43, 7.4, '#2a2620') + C(50, 43, 5.8, '#0a0908') + C(50, 43, 5.8, 'none', 'stroke="#5a5040" stroke-width=".6"')
      + glow('#fff4c0', C(50, 43, 1.9, '#fff8e0'), 2.5) + C(50, 43, 3.4, 'none', 'stroke="#c8a04a" stroke-width=".5" opacity=".7"')
      + mirror(L(40, 50, 44, 54, '#4a4234', 0.7))
      + blaster(68, 94, -36, '#2a2620');
  });

  // ================= Boss versions of existing cards =================

  // ---------- Bespin optional boss: Bossk with the Hound's Tooth ----------
  // The Trandoshan hunter in his yellow flight suit, mortar rifle up, the
  // Hound's Tooth on the landing pad behind him over Cloud City.
  add('bossk', () => {
    const [sk, sd] = LG([[0, '#9ab86a'], [1, '#4a6a2a']]);
    return SCENES.cloud() + sd
      // the Hound's Tooth: boxy hull, raised bridge, twin engine pods
      + P('M50 40 L54 22 L90 18 L100 22 L100 46 L56 48Z', '#c8ccd2', 'stroke="#5a626c" stroke-width=".8"') + P('M60 22 L66 12 L84 11 L88 18Z', '#a8b0b8', 'stroke="#5a626c" stroke-width=".7"')
      + R(68, 13, 12, 3, '#2a4a6a') + R(56, 40, 44, 4, '#8a929c') + [62, 72, 82, 92].map((x) => L(x, 22, x, 44, '#8a929c', 0.6)).join('') + C(94, 34, 4, '#5a626c') + glow('#5fd8ff', C(94, 34, 2, '#9fe8ff'), 2)
      + R(0, 62, 100, 6, '#d8c0a0', 'opacity=".6"')
      + shoulders('#d8b44a', { top: 72 }) + P('M34 76 C40 72 60 72 66 76 L64 100 L36 100Z', '#c8a43a', 'stroke="#6a5420" stroke-width=".7"')
      + mirror(L(30, 76, 44, 100, '#5a4a22', 2.2)) + R(36, 88, 28, 3.4, '#4a3a1a') + [40, 46, 54, 60].map((x) => R(x, 80, 3, 6, '#8a7a4a', 'rx="1"')).join('')
      + P('M42 60 L58 60 L60 76 L40 76Z', sk)
      // the Trandoshan head: wide flat skull, heavy brow, eyes set to the sides, scaled hide
      + P('M31 46 C29 30 39 20 50 20 C61 20 71 30 69 46 C68 55 64 61 58 65 L42 65 C36 61 32 55 31 46Z', sk, 'stroke="#2a3a14" stroke-width=".9"')
      + shade('M50 20 C61 20 71 30 69 46 C68 55 64 61 58 65 L50 65Z', 0.14)
      + mirror(P('M33 39 Q40 31 47.6 37.6 Q40 35.6 33 39Z', '#3a4a1a') + E(40, 41.6, 3.4, 2.4, '#ff7a1a') + E(40.4, 41.6, 0.8, 2.1, '#1a0a00') + C(39.2, 40.8, 0.6, '#ffe0a0')
        + [[38, 27], [43, 24], [35, 32], [33, 49], [37, 55], [42, 29], [46, 33], [36, 45]].map(([x, y]) => E(x, y, 1.5, 1.1, '#5a7a2a', 'stroke="#3a5a1a" stroke-width=".3"')).join('')
        + P('M44 56.4 L45 59.2 L46 56.6Z', '#f0e8d0') + '<path d="M47.6 49 Q48.6 50 48 51.4" stroke="#1a2a0a" stroke-width=".8" fill="none"/>')
      + '<path d="M38 56 Q50 61.4 62 56" stroke="#1a2a0a" stroke-width="1.2" fill="none"/>' + L(50, 22, 50, 36, '#3a5a1a', 0.6, 'opacity=".6"')
      // clawed hand on the Relby mortar rifle
      + `<g transform="translate(18 96) rotate(-32)">${R(0, -3.6, 50, 7.2, '#3a3d44', 'rx="1.5"')}${R(10, -7.4, 18, 3.8, '#5a5e66')}${R(30, -5, 8, 10, '#2a2c30', 'rx="1"')}${C(50, 0, 4, '#2a2c30')}${glow('#ff8a2a', C(52, 0, 1.8, '#ffb04a'), 2)}</g>`
      + E(30, 84, 4, 3, sk) + '<path d="M28 82 L26 80 M30 81 L29.4 78.6 M32 81.6 L33 79.4" stroke="#1a2a0a" stroke-width=".8" stroke-linecap="round"/>';
  });

  // ---------- Geonosis optional boss: Jango Fett, arena ----------
  // Jango in the Petranaki arena: scuffed blue-silver armour, the helmet's
  // rangefinder, the Z-6 jetpack with its missile, twin WESTARs blazing.
  // Behind him the crowd of Geonosians and the execution pillars with
  // Obi-Wan, Anakin and Padmé chained up.
  add('jango_arena', () => {
    const [hm, hmd] = LG([[0, '#d8e2ea'], [0.5, '#8a9aa8'], [1, '#3a4450']]);
    const [arm, ad] = LG([[0, '#6a7c8e'], [1, '#3a4656']]);
    // A chained prisoner on a pillar: tiny figure, arms up.
    const prisoner = (x, c, hair) => R(x - 3, 40, 6, 44, '#7a3a1a') + R(x - 4, 38, 8, 3, '#5a2a10')
      + L(x - 2, 46, x - 4, 42, c, 1) + L(x + 2, 46, x + 4, 42, c, 1) + R(x - 2, 46, 4, 8, c, 'rx="1"') + C(x, 44.4, 1.6, '#e8c4a0') + E(x, 43.4, 1.7, 1, hair);
    return arena() + hmd + ad
      // the crowd packed into the stands
      + [33, 37, 41].map((y, r) => Array.from({ length: 30 }, (_, i) => E(i * 3.4 + (r % 2) * 1.7, y, 1.1, 1.5, ['#5a2410', '#6a3418', '#4a1e0c'][(i + r) % 3])).join('')).join('')
      + prisoner(10, '#c8b48a', '#a0703a') + prisoner(90, '#2a2a30', '#5a3a1a') + prisoner(30, '#f2f2f2', '#3a2010')
      // jetpack flames roaring down from behind his shoulders
      + mirror(glow('#ffb03a', P('M22 64 C18 76 20 88 26 100 C28 90 32 82 30 64Z', '#ffd27a', 'opacity=".85"') + P('M24 66 C22 76 24 86 27 94 C28 86 30 78 29 66Z', '#fff4d0'), 4) + R(20, 52, 10, 14, '#6a7a8a', 'rx="2" stroke="#2a3440" stroke-width=".6"'))
      // the Z-6's missile rising behind his helmet
      + R(45, 4, 10, 16, '#6a7a8a', 'rx="1.5" stroke="#2a3440" stroke-width=".6"') + P('M45 4 L50 -2 L55 4Z', '#b8c4cc') + R(45, 14, 10, 2, '#c43a2a')
      + bolt(18, 76, 0, 66, '#ff3a2a') + bolt(82, 76, 100, 70, '#ff3a2a') + bolt(14, 70, 0, 54, '#ff3a2a')
      + blaster(16, 80, -160, '#3a3d44') + blaster(84, 80, -20, '#3a3d44')
      // armour: chest plates, shoulder bells, belt with holsters, leather straps
      + P('M2 100 C4 80 22 70 50 70 C78 70 96 80 98 100Z', '#4a5a6a')
      + mirror(P('M8 92 C10 82 18 76 28 75 L32 84 C24 86 18 90 16 96Z', arm, 'stroke="#1a2230" stroke-width=".7"') + '<path d="M12 88 L14 84 M20 82 l2 2" stroke="#9aa8b4" stroke-width=".5"/>')
      + P('M34 72 L66 72 L63 92 L37 92Z', arm, 'stroke="#1a2230" stroke-width=".8"') + L(50, 72, 50, 92, '#2a3440', 0.8) + '<path d="M38 78 l3 1 M58 84 l-2 2 M44 88 l2 -1" stroke="#c8d4dc" stroke-width=".5" opacity=".7"/>'
      + R(34, 92, 32, 4, '#3a2a1a') + mirror(R(34, 93, 6, 7, '#2a1e12', 'rx="1"')) + L(36, 72, 62, 92, '#5a3a20', 1.2)
      // the helmet: T visor, dents, rangefinder stalk
      + P('M34 46 C34 26 42 18 50 18 C58 18 66 26 66 46 L65 60 C61 66 39 66 35 60Z', hm, 'stroke="#1a2028" stroke-width=".9"')
      + P('M38 36 H62 V42 H54 V58 H46 V42 H38Z', '#0a0c10') + P('M36 26 C42 22 58 22 64 26 L64 30 C58 26 42 26 36 30Z', '#4a6a8a')
      + E(43, 24, 5, 2, '#fff', 'opacity=".4"') + '<path d="M58 30 l2 2 M40 50 l2 1 M60 52 l-1.6 1.4" stroke="#3a4450" stroke-width=".6"/>' + C(57, 48, 1, '#5a6a7a')
      + mirror('<path d="M40 52 L44 54" stroke="#2a3440" stroke-width=".8"/>')
      + R(64, 32, 4, 16, '#5a6a7a', 'rx="1" stroke="#1a2028" stroke-width=".5"') + L(66, 32, 68, 18, '#5a6a7a', 1.4) + R(66, 14, 4, 6, '#3a4450', 'rx="1"') + C(68, 16, 0.8, '#ff3a2a');
  });

  // ---------- Exegol optional boss: Emperor Reborn ----------
  // In the Sith Citadel on Exegol: the stadium of hooded cultists rising
  // into the dark, the life-support arm holding him up, lightning in both hands.
  add('emperor_reborn', () => {
    const [face, fd] = LG([[0, '#d8d0c8'], [1, '#a8a098']]);
    return exegol('#b58cff') + fd
      // tiers of the Sith Eternal crowd, each a tiny hooded shape with a light
      + [26, 34, 42, 50].map((y, r) => Array.from({ length: 16 }, (_, i) => { const x = 3 + i * 6.2 + (r % 2) * 3; return P(`M${x - 1.6} ${y + 3} L${x - 1} ${y} Q${x} ${y - 1.4} ${x + 1} ${y} L${x + 1.6} ${y + 3}Z`, '#1a1624') + C(x, y + 0.8, 0.35, '#b58cff', 'opacity=".6"'); }).join('') + L(0, y + 3.4, 100, y + 3.4, '#2a2436', 0.8)).join('')
      // two great stone pillars
      + mirror(P('M2 100 L4 20 L14 20 L16 100Z', '#120f18') + R(1, 18, 16, 3, '#1e1a26'))
      // the life-support arm reaching down from the dark and gripping his shoulders
      + '<g stroke-linecap="round" fill="none"><path d="M70 0 C70 10 62 14 56 18" stroke="#2a2830" stroke-width="5"/><path d="M70 0 C70 10 62 14 56 18" stroke="#5a5664" stroke-width="1.2"/><path d="M56 18 C48 20 40 22 34 30" stroke="#2a2830" stroke-width="3.6"/><path d="M56 18 C62 22 66 26 68 32" stroke="#2a2830" stroke-width="3.6"/></g>'
      + C(56, 18, 3.6, '#3a3640') + glow('#b58cff', C(56, 18, 1.4, '#d8c8ff'), 2)
      + P('M16 100 L22 58 C24 30 38 18 50 18 C62 18 76 30 78 58 L84 100Z', '#0e0c12') + shade('M50 18 C38 18 24 30 22 58 L16 100 L40 100 L36 60Z', 0.3)
      // layered robes: outer cloak, inner robe, folds, embroidered trim and wide sleeves
      + P('M30 100 L34 66 C38 62 62 62 66 66 L70 100Z', '#16121c') + P('M42 64 L50 100 L58 64Z', '#221a2c')
      + '<path d="M22 100 C24 86 26 74 30 64 M78 100 C76 86 74 74 70 64 M27 100 C28 88 30 78 33 68 M73 100 C72 88 70 78 67 68 M38 100 L40 70 M62 100 L60 70" stroke="#2a2434" stroke-width="1" fill="none"/>'
      + '<path d="M34 66 L42 100 M66 66 L58 100" stroke="#6a4a9a" stroke-width=".8" fill="none" opacity=".7"/><path d="M35.6 74 l1.2 1.2 l-1.2 1.2 M37.4 84 l1.2 1.2 l-1.2 1.2 M64.4 74 l-1.2 1.2 l1.2 1.2 M62.6 84 l-1.2 1.2 l1.2 1.2" stroke="#8a6aba" stroke-width=".5" fill="none" opacity=".7"/>'
      + R(28, 64, 44, 4, '#2a2830', 'rx="1.5"') + mirror(C(32, 66, 1.4, '#5a5664'))
      + mirror(P('M8 100 L14 82 C18 74 28 76 34 86 L32 100Z', '#120e18') + P('M24 84 C28 82 33 84 35 88 L31 92 C29 89 26 88 23 89Z', '#2a2236') + '<path d="M12 96 L16 84 M18 98 L21 86" stroke="#2a2434" stroke-width=".9"/>' + '<path d="M24 84 C28 82 33 84 35 88" stroke="#6a4a9a" stroke-width=".7" fill="none"/>')
      // the deep hood framing his face, its rim catching the lightning
      + P('M28 70 C24 44 34 22 50 21 C66 22 76 44 72 70 C68 62 62 58 60 50 C58 40 54 36 50 36 C46 36 42 40 40 50 C38 58 32 62 28 70Z', '#1a1620')
      + '<path d="M29 66 C27 44 36 25 50 24 C64 25 73 44 71 66" stroke="#5a4a7a" stroke-width="1" fill="none" opacity=".8"/><path d="M40 30 Q50 26 60 30" stroke="#2a2434" stroke-width="1.2" fill="none"/>'
      + E(50, 53, 10, 12.5, face) + P('M39.4 47 C41 38 46 36 50 36 C54 36 59 38 60.6 47 C57 42.6 43 42.6 39.4 47Z', '#1a1620') + shade('M40 46 Q50 43 60 46 L60 50 Q50 47 40 50Z', 0.25)
      + mirror(E(45.6, 50.6, 2, 1.3, '#eef2f6') + C(45.6, 50.6, 0.9, '#9aa6b4') + '<path d="M42.4 55.6 Q43.6 58 43 60.4" stroke="#8a7e74" stroke-width=".5" fill="none" opacity=".7"/>')
      + '<path d="M50 50 L49 55.4 Q50 56.2 51 55.4" stroke="#8a7e74" stroke-width=".6" fill="none"/><path d="M46 60 Q50 61.2 54 60" stroke="#6a4a44" stroke-width=".9" fill="none" stroke-linecap="round"/>'
      + mirror(glow('#7a4dff', '<path d="M30 86 L22 78 L26 74 L14 66 L18 62 L4 52 M26 74 L18 74 M18 62 L10 64" stroke="#e8dcff" stroke-width="1.5" fill="none"/><path d="M30 86 L20 88 L16 84 L2 90" stroke="#c8b0ff" stroke-width="1" fill="none"/>', 3) + E(30, 88, 4, 3, '#b8b0aa'));
  });

  // ---------- Coruscant Under Siege optional boss: General Grievous, Warlord ----------
  // The revised Grievous (the 2.2 drawing) brought down to the burning
  // streets of Coruscant: the Invisible Hand overhead, droid landers
  // descending, a Senate dome on fire and B2s marching through the smoke.
  add('grievous_warlord', () => {
    const fig = root.Art22 && root.Art22.grievousFigure ? root.Art22.grievousFigure() : '';
    return siege()
      // the Invisible Hand's long hull and spine of towers, engines glowing
      + P('M2 22 L62 16 L76 20 L62 24 L2 26Z', '#2a1a1a', 'stroke="#4a2a24" stroke-width=".6"') + [10, 20, 30, 40, 50].map((x) => R(x, 10 + (x % 20) / 4, 3, 7, '#2a1a1a')).join('') + glow('#5fd8ff', C(2, 24, 1.4, '#9fe8ff'), 2)
      // a burning Senate dome and marching B2s at street level
      + E(84, 62, 14, 7, '#2a1a1e') + glow('#ff7a2a', P('M80 58 Q82 50 84 56 Q86 48 88 56Z', '#ffa040'), 3)
      + [[6, 64], [14, 66], [88, 66]].map(([x, y]) => `<g transform="translate(${x} ${y})">${R(-2, -6, 4, 6, '#1a1214', 'rx="1"')}${R(-1, -8, 2, 2, '#1a1214')}${L(-1, 0, -1.4, 4, '#1a1214', 1)}${L(1, 0, 1.4, 4, '#1a1214', 1)}</g>`).join('')
      + R(0, 66, 100, 34, '#140a0c', 'opacity=".55"') + fig;
  });

  // ---------- The Bendu (Star Wars Rebels): Mythic, reward for Liberator of the Galaxy ----------
  // The ancient Force wielder of Atollon as he looks in Rebels: a huge
  // grey-blue beast lying on the rocks, stony hide streaked lighter, a
  // ridge of rocky spines down his back, two great horns curving forward
  // and down past his long face, glowing blue eyes. Light and dark energy
  // pour into him and gather in his chest: he soaks up what hits him.
  add('bendu', () => {
    const [sky, sd] = LG([[0, '#5a6a7a'], [0.6, '#9aa8b0'], [1, '#d8d0c0']]);
    const [hide, hd] = LG([[0, '#9aa8b4'], [0.5, '#6a7884'], [1, '#3e4852']]);
    const [core, cd] = RG([[0, '#ffffff'], [0.35, '#c8b0ff', 0.9], [1, '#7a4dff', 0]]);
    return sd + hd + cd + R(0, 0, 100, 100, sky)
      // Atollon: dusty grey ground and the spiky krykna-rock spires
      + [[6, 34, 5], [14, 48, 3], [24, 40, 4], [78, 38, 4], [88, 30, 6], [96, 46, 3]].map(([x, y, w]) => P(`M${x - w} 82 L${x - 1} ${y} L${x} ${y - 4} L${x + 1} ${y} L${x + w} 82Z`, '#4a525a') + L(x, y - 4, x - w * 0.6, 82, '#6a747c', 0.5)).join('')
      + R(0, 78, 100, 22, '#7a7e7a') + P('M0 82 Q30 78 60 82 T100 80 V100 H0Z', '#5e625e')
      // light and dark streaming into him from both sides
      + glow('#5aa8ff', '<path d="M0 26 C16 30 26 48 40 66" stroke="#cfe8ff" stroke-width="2" fill="none"/><path d="M0 44 C14 48 26 58 40 70" stroke="#5aa8ff" stroke-width="1.2" fill="none" opacity=".8"/>', 3)
      + glow('#ff3a3a', '<path d="M100 26 C84 30 74 48 60 66" stroke="#ffc0c0" stroke-width="2" fill="none"/><path d="M100 44 C86 48 74 58 60 70" stroke="#ff4a4a" stroke-width="1.2" fill="none" opacity=".8"/>', 3)
      // the great body lying on the rocks, rocky spines along the back
      + P('M2 100 C2 80 14 66 30 60 C40 56 60 56 70 60 C86 66 98 80 98 100Z', hide, 'stroke="#2a3038" stroke-width=".7"')
      + mirror([[24, 62, 5], [16, 68, 4], [10, 76, 3.6]].map(([x, y, h]) => P(`M${x - 3} ${y + 2} L${x} ${y - h} L${x + 3} ${y + 1}Z`, '#5a646e', 'stroke="#2a3038" stroke-width=".5"')).join(''))
      + '<path d="M14 88 Q22 82 30 86 M20 96 Q28 90 36 94 M70 86 Q78 82 86 88 M64 94 Q72 90 80 96" stroke="#c8d2da" stroke-width="1.2" fill="none" opacity=".5"/>'
      + C(50, 80, 12, core) + glow('#c8b0ff', C(50, 80, 3, '#ffffff'), 4)
      // the long face and heavy brow
      + P('M38 38 C38 26 44 22 50 22 C56 22 62 26 62 38 L60 60 C58 68 54 72 50 72 C46 72 42 68 40 60Z', hide, 'stroke="#2a3038" stroke-width=".8"')
      + shade('M50 22 C56 22 62 26 62 38 L60 60 C58 68 54 72 50 72Z', 0.14)
      + '<path d="M44 26 L46 34 M56 26 L54 34 M50 23 L50 32" stroke="#c8d2da" stroke-width="1" fill="none" opacity=".55"/>'
      + mirror('<path d="M39 41 Q43.6 37.6 48 40.6" stroke="#2a3038" stroke-width="2" fill="none" stroke-linecap="round"/>')
      + glowEyes(44.4, 55.6, 43.4, '#8ad8ff', 1.3)
      + E(50, 63, 7, 6, '#5a646e') + mirror(E(47.4, 63, 1.2, 1.8, '#1a1e24')) + '<path d="M45 69 Q50 71.4 55 69" stroke="#2a3038" stroke-width=".8" fill="none"/>'
      // the two great horns: out from the top of the head, curving forward and down past the face
      + mirror('<path d="M41 28 C32 18 20 18 18 30 C16 42 24 54 34 56" stroke="#2a2a28" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M41 28 C32 18 20 18 18 30 C16 42 24 54 34 56" stroke="#c8c0a8" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M38 25 C30 20 22 21 20.4 30" stroke="#f0ead8" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M22 34 l2 .6 M21 40 l2 .4 M23 46 l2 0" stroke="#8a8270" stroke-width=".6"/>');
  });

  // ---------- Exegol opponent (2.2 card, more detail): Sith Trooper ----------
  // A Sith Eternal trooper in red: the angular helmet with its black visor
  // and side vents, red armour with black joints. Behind him the Citadel's
  // hooded statues, a Xyston Star Destroyer with its planet-killer glowing
  // under the hull, and the Final Order's banners.
  add('sith_trooper_24', () => {
    const [red, rd] = LG([[0, '#e02a36'], [0.5, '#b0161f'], [1, '#6a0a10']]);
    return exegol('#a8b8ff') + rd
      // a Xyston Star Destroyer overhead, its planet-killer cannon glowing red
      + P('M8 14 L92 8 L50 30Z', '#1a1822', 'stroke="#3a3648" stroke-width=".6"') + R(46, 4, 8, 6, '#1a1822') + glow('#ff2a3a', E(50, 26, 4, 1.6, '#ff4a4a'), 3)
      // hooded statues and Sith Eternal banners
      + mirror(P('M2 84 L4 50 C4 42 8 38 12 38 C16 38 20 42 20 50 L22 84Z', '#16141e') + P('M8 46 C8 43 16 43 16 46 L15 50 L9 50Z', '#08060a') + R(24, 30, 6, 30, '#6a0a10') + P('M24 60 L27 56 L30 60Z', '#0a080e') + C(27, 40, 1.6, 'none', 'stroke="#d8c060" stroke-width=".5"'))
      // body: red plates over the black bodysuit
      + P('M18 100 L22 78 C24 70 36 66 50 66 C64 66 76 70 78 78 L82 100Z', '#120c0e')
      + mirror(P('M20 86 C22 76 30 70 40 69 L42 80 L24 84Z', red, 'stroke="#2a0406" stroke-width=".6"') + L(24, 82, 38, 76, '#ff8a8a', 0.5, 'opacity=".5"'))
      + P('M40 72 L60 72 L58 88 L50 92 L42 88Z', red, 'stroke="#2a0406" stroke-width=".6"') + L(50, 72, 50, 92, '#6a0a10', 0.6) + R(44, 94, 12, 4, '#1a1012')
      + P('M44 62 L56 62 L57 70 L43 70Z', '#0c0608')
      // the helmet: angular crown, black visor, ribbed side vents, chin grille
      + P('M33 40 C33 22 67 22 67 40 L68 52 L61 62 L39 62 L32 52Z', red, 'stroke="#2a0406" stroke-width=".9"')
      + shade('M50 22 C59 22 67 30 67 40 L68 52 L61 62 L50 62Z', 0.15) + P('M38 28 C43 24 57 24 62 28', 'none', 'stroke="#ff8a8a" stroke-width="1.1" opacity=".6"')
      + P('M35 38 L65 38 L60 46 L55 48 L55 58 L45 58 L45 48 L40 46Z', '#0c0406') + P('M37 39 L48 39 L44 43Z', '#4a3a5a', 'opacity=".6"')
      + mirror([50, 53, 56].map((y) => L(34.4, y, 40, y + 1, '#5a0a10', 0.8)).join('') + C(34.4, 46, 1.4, '#6a0a10', 'stroke="#2a0406" stroke-width=".4"'))
      + R(45.6, 58.6, 8.8, 3, '#3a0408', 'rx=".6"') + [47, 48.8, 50.6, 52.4].map((x) => L(x, 59, x, 61.2, '#c8303a', 0.4)).join('')
      + `<g transform="translate(60 92) rotate(-28)">${R(-2, -2.6, 30, 5.2, '#1a1214', 'rx="1.5"')}${R(24, -1.4, 10, 2.8, '#1a1214')}${R(4, -5.6, 12, 3, '#3a2a2e', 'rx="1"')}</g>`;
  });

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
