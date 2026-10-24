// Update 2.4 "Liberation": card art for the new bosses and opponents.
// Concept stage: drawn and reviewed first, then wired into the game with
// their stats, abilities and ultimates. viewBox 0 0 100 100, same kit as art.js.
(function (root) {
  'use strict';
  const K = root.ArtX;
  if (!K || !root.Art) return;
  const { P, E, C, R, L, shade, shoulders, neck, head, eyes, brows, nose, mouth, saber, blaster, glowEyes, LG, RG, SCENES, stars } = K;
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
      // red velvet robes: wide body, the shoulder mantle, and the embroidered stole down the front
      + P('M18 100 L24 66 C28 58 38 54 50 54 C62 54 72 58 76 66 L82 100Z', robe) + shade('M50 54 C38 54 28 58 24 66 L18 100 L46 100Z', 0.22)
      + '<path d="M26 100 L29 74 M34 100 L35 70 M74 100 L71 74 M66 100 L65 70" stroke="#5a0610" stroke-width="1" fill="none" opacity=".8"/>'
      + P('M42.6 58 L57.4 58 L59.6 100 L40.4 100Z', '#4a0810', 'stroke="#9a1a26" stroke-width=".6"')
      + [66, 78, 90].map((y) => `<g stroke="#c8343e" stroke-width=".75" fill="none" stroke-linecap="round"><path d="M50 ${y - 5} C45 ${y - 5} 43 ${y} 46 ${y + 2.4} C48 ${y + 3.4} 49.2 ${y + 1.4} 48 ${y} M50 ${y - 5} C55 ${y - 5} 57 ${y} 54 ${y + 2.4} C52 ${y + 3.4} 50.8 ${y + 1.4} 52 ${y} M50 ${y - 3} L50 ${y + 4.4} M46.6 ${y + 4.6} Q50 ${y + 6.6} 53.4 ${y + 4.6} M44 ${y - 3} Q42.6 ${y - 0.4} 44.6 ${y + 1} M56 ${y - 3} Q57.4 ${y - 0.4} 55.4 ${y + 1}"/></g>`).join('')
      // wide sleeves down to the hands on the armrests
      + mirror(P('M12 100 C12 88 15 80 22 75 L30 79 C26 85 24 92 24 100Z', '#9a1420') + '<path d="M22 75 L30 79" stroke="#5a0610" stroke-width="1.2"/><path d="M15 96 C16 88 18 83 23 79" stroke="#c8303a" stroke-width=".7" fill="none" opacity=".6"/>')
      // the mantle the hood falls into, over his shoulders
      + P('M21 74 C23 60 34 52 50 52 C66 52 77 60 79 74 C71 67 62 65 50 65 C38 65 29 67 21 74Z', '#8a0e18')
      + '<path d="M24 70 C30 62 40 58 50 58 C60 58 70 62 76 70" stroke="#c8303a" stroke-width=".8" fill="none" opacity=".6"/><path d="M30 68 Q34 62 38 66 M70 68 Q66 62 62 66" stroke="#5a0610" stroke-width=".9" fill="none"/>'
      // the hood: soft red velvet, rounded over the head and draping to the shoulders
      + (() => { const [vel, vd] = LG([[0, '#b01a26'], [0.55, '#8a0e18'], [1, '#5a0610']], 0, 0, 1, 0); return vd + P('M26 64 C23 40 33 17 50 15 C67 17 77 40 74 64 C71 56 67 50 64 44 C62 34 57 29 50 29 C43 29 38 34 36 44 C33 50 29 56 26 64Z', vel); })()
      + '<path d="M28 58 C27 40 35 21 50 18 M72 58 C73 40 65 21 50 18" stroke="#d23a46" stroke-width=".9" fill="none" opacity=".5"/><path d="M33 54 C31 42 36 30 43 23 M67 54 C69 42 64 30 57 23 M30 62 C30 54 32 48 35 44" stroke="#4a0610" stroke-width="1" fill="none" opacity=".85"/>'
      // the face, drawn as one half and mirrored so both sides match
      + mirror(faceHalf)
      // the hood's front edge drawn down over his brow, its shadow across the forehead
      + P('M36.6 44 C36 28 42 20.6 50 20.6 C58 20.6 64 28 63.4 44 C61.4 39.4 56.6 36 50 36 C43.4 36 38.6 39.4 36.6 44Z', '#9a1420')
      + P('M38.4 43.6 C40.8 39.6 45 37.4 50 37.4 C55 37.4 59.2 39.6 61.6 43.6 L61 45.4 C58.6 42 54.6 40.4 50 40.4 C45.4 40.4 41.4 42 39 45.4Z', '#000', 'opacity=".4"')
      + '<path d="M36.6 44 C36 28 42 20.6 50 20.6 C58 20.6 64 28 63.4 44 M37 43 C39 38.6 44 36 50 36 C56 36 61 38.6 63 43" stroke="#d23a42" stroke-width=".9" fill="none" opacity=".7"/><path d="M44 22 Q50 20.4 56 22" stroke="#5a060c" stroke-width=".7" fill="none"/>'
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
  // From the reference: the white helmet with two narrow dark eye slits and
  // the cloth face skirt hanging from it to the chest, padded white suit,
  // chest control box with red and white buttons, shoulder bells, tan belt
  // pouches and the long white kama. Echo Base trench and an AT-AT behind.
  add('snowtrooper', () => {
    const [cloth, cd] = LG([[0, '#f2f4f6'], [1, '#c8d0d8']]);
    const [suit, sud] = LG([[0, '#f6f7f8'], [1, '#d0d6dc']], 0, 0, 1, 0);
    const [helm, hmd] = LG([[0, '#ffffff'], [0.6, '#eef1f4'], [1, '#c4ccd4']], 0, 0, 1, 1);
    return hothField() + cd + sud + hmd
      // Echo Base under attack: the shield generator dome and ion cannon on the ridge,
      // a second AT-AT, a snowspeeder banking overhead, smoke from the trenches
      + E(84, 50, 9, 5, '#9aa8b8') + R(75, 50, 18, 3, '#8a96a4') + R(82, 40, 4, 10, '#7a8694') + C(84, 38, 3.4, '#9aa8b8')
      + C(62, 46, 4, '#8a96a4') + R(58, 46, 8, 4, '#7a8694') + glow('#7ad8ff', C(62, 46, 1.4, '#cff4ff'), 2)
      + `<g transform="translate(40 40) scale(.7)">${R(2, 0, 18, 7, '#6a7484', 'rx="1.5"')}${R(19, 1.4, 6, 4, '#6a7484', 'rx="1"')}${[3, 7, 14, 18].map((x) => R(x, 7, 1.6, 12, '#6a7484')).join('')}</g>`
      + `<g transform="translate(70 18) rotate(-12)">${P('M-8 0 L6 -2 L10 0 L6 2Z', '#d8dee4')}${P('M-6 -1 L-9 -5 L-5 -1Z M-6 1 L-9 5 L-5 1Z', '#c8ced6')}${C(-9, 0, 1, '#ff8a3a')}</g>`
      + puffs('#4a5260', 0.5, [[30, 58, 10, 6], [36, 50, 8, 6], [90, 60, 9, 5]])
      + P('M0 74 L100 70 L100 76 L0 80Z', '#c8d4de') + [6, 18, 30, 82, 94].map((x) => E(x, 74 - x * 0.04, 5, 2.4, '#e8eef4', 'stroke="#a8b4c0" stroke-width=".4"')).join('')
      + R(70, 62, 10, 6, '#7a848e', 'rx="1"') + L(74, 62, 64, 56, '#5a646e', 1.6) + bolt(64, 56, 46, 50, '#ff3a2a') + bolt(20, 30, 4, 26, '#3aff6a') + bolt(96, 40, 80, 46, '#3aff6a')
      // padded suit, shoulder bells and the long kama
      + P('M4 100 C6 86 16 76 32 73 L68 73 C84 76 94 86 96 100Z', suit, 'stroke="#8a96a4" stroke-width=".7"')
      + mirror(P('M6 92 C8 82 16 76 27 74 L32 82 C23 85 17 90 15 97Z', '#fbfcfd', 'stroke="#8a96a4" stroke-width=".7"') + '<path d="M12 88 Q18 82 26 80" stroke="#c8d0d8" stroke-width=".8" fill="none"/>')
      + '<path d="M22 100 Q24 92 24 86 M78 100 Q76 92 76 86 M30 100 Q31 94 31 88 M70 100 Q69 94 69 88" stroke="#c8d0d8" stroke-width=".8" fill="none"/>'
      // chest control box, belt and tan pouches
      + R(40, 80, 20, 9, '#eef1f4', 'rx="1.4" stroke="#8a96a4" stroke-width=".6"') + R(42, 82, 6, 4.4, '#3a3d45', 'rx=".6"') + R(43, 83, 4, 2.4, '#c8ccd2') + [51, 53.4, 55.8].map((x, i) => R(x, 82, 1.6, 4.4, i ? '#e8ecf0' : '#d02a2a', 'stroke="#5a646e" stroke-width=".3"')).join('')
      + R(30, 92, 40, 3, '#e8ecf0', 'stroke="#8a96a4" stroke-width=".5"') + mirror(R(30, 93, 9, 7, '#c8ae80', 'rx="1" stroke="#7a6a4a" stroke-width=".5"'))
      // the cloth face skirt: a wide trapezoid from under the eye slits down over the chest
      + P('M34 47 L66 47 C68 58 70 68 72 76 C62 80 38 80 28 76 C30 68 32 58 34 47Z', cloth, 'stroke="#8a96a4" stroke-width=".8"')
      + '<path d="M38 52 Q37 64 34 76 M44 52 Q43 66 42 79 M50 52 L50 80 M56 52 Q57 66 58 79 M62 52 Q63 64 66 76" stroke="#b8c2cc" stroke-width=".7" fill="none"/>'
      // the helmet: rounded top with a ridge and two narrow dark eye slits
      + P('M33 46 C33 28 41 19 50 19 C59 19 67 28 67 46 L67 49 L33 49Z', helm, 'stroke="#6a7686" stroke-width="1"')
      + shade('M50 19 C59 19 67 28 67 46 L67 49 L50 49Z', 0.06) + E(42, 25, 6, 2.4, '#fff', 'transform="rotate(-24 42 25)"')
      + '<path d="M34 34 Q50 28 66 34" stroke="#b8c2cc" stroke-width="1.1" fill="none"/><path d="M50 20 L50 32" stroke="#d8dee4" stroke-width="1.6"/>'
      + mirror(P('M36.6 39.4 L47.6 41 L47 44.6 L37.4 43Z', '#0a0b0e') + P('M37.6 40.4 L46 41.6 L45.8 42.4 L37.8 41.4Z', '#4a6a9a', 'opacity=".7"'))
      + P('M47.6 40.6 L52.4 40.6 L51.6 47 L48.4 47Z', '#eef1f4', 'stroke="#8a96a4" stroke-width=".5"')
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
  // From your photos: the full scout kit (white helmet with the brim over the
  // black visor and the long snout to the breather, black suit, white chest
  // plate, shoulder bells and arm guards, black gloves on the long rifle) and
  // the rust-brown 74-Z speeder bike with its long forks and steering vanes.
  // Endor's forest behind: giant redwoods in shafts of light, Ewok huts up in
  // the trees, ferns, and another scout racing past.
  add('scout_trooper', () => {
    const [helm, hd] = LG([[0, '#ffffff'], [0.6, '#e6e9ec'], [1, '#b8bec6']], 0, 0, 1, 1);
    const [bike, bd] = LG([[0, '#9a5a32'], [1, '#5a2e16']]);
    const [fog, fd] = LG([[0, '#2a4a30'], [1, '#14281a']]);
    return hd + bd + fd + R(0, 0, 100, 100, fog)
      + [[30, 0, 40, 100], [58, 0, 66, 100]].map(([a, b, c, d]) => P(`M${a} ${b} L${a + 6} ${b} L${c + 8} ${d} L${c - 2} ${d}Z`, '#e8f4c8', 'opacity=".08"')).join('')
      // redwoods, far to near, with bark grooves
      + [[22, 4, '#3a2a1a'], [44, 5, '#3a2a1a'], [70, 4, '#3a2a1a'], [2, 12, '#2a1a0c'], [86, 13, '#2a1a0c']].map(([x, w, c]) => R(x, 0, w, 100, c) + [0.2, 0.45, 0.7].map((k) => L(x + w * k, 0, x + w * k + 0.8, 100, '#160c04', 0.6)).join('') + R(x + w * 0.08, 0, w * 0.18, 100, '#6a4a2a', 'opacity=".45"')).join('')
      // Ewok huts on a platform up in the trees, with a rope bridge
      + R(4, 22, 18, 2, '#4a3018') + `<g>${P('M6 22 L8 14 L14 10 L20 14 L20 22Z', '#6a4a2a')}${P('M6 14 L14 8 L22 14Z', '#8a6a3a')}${C(12, 18, 1, '#ffb04a')}</g>` + P('M22 22 Q34 26 44 22', 'none', 'stroke="#6a4a2a" stroke-width=".8"')
      // another scout racing past in the distance
      + `<g transform="translate(60 54) scale(.45)">${P('M-20 2 L16 0 L20 4 L-16 6Z', '#8a5030')}${L(-20, 2, -34, 0, '#3a2a1a', 1)}${R(-6, -8, 6, 8, '#e8eaee', 'rx="2"')}${C(-3, -10, 2.4, '#f4f6f8')}</g>`
      + R(0, 84, 100, 16, '#1e3a1c') + [[6, 92], [26, 94], [74, 92], [94, 90]].map(([x, y]) => P(`M${x} ${y} q-6 -8 -10 -4 M${x} ${y} q6 -8 10 -4 M${x} ${y} q-2 -10 0 -12`, 'none', 'stroke="#3a6a2a" stroke-width="1.6" stroke-linecap="round"')).join('')
      // the 74-Z speeder bike: rust-brown body, long forks and steering vanes, handlebars, engine
      + L(64, 70, 22, 60, '#2a2420', 1.6) + L(66, 74, 24, 66, '#2a2420', 1.6) + P('M18 56 L26 58 L26 66 L18 64Z', bike, 'stroke="#2a1608" stroke-width=".5"') + P('M20 62 L28 64 L28 72 L20 70Z', bike, 'stroke="#2a1608" stroke-width=".5"')
      + P('M60 66 L92 60 L98 64 L98 72 L94 78 L62 78Z', bike, 'stroke="#2a1608" stroke-width=".8"') + P('M64 66 L90 61 L94 64 L66 70Z', '#b8784a', 'opacity=".6"')
      + R(80, 56, 12, 5, '#1a1612', 'rx="1.6"') + L(70, 60, 66, 54, '#1a1612', 1.4) + L(74, 60, 76, 54, '#1a1612', 1.4) + R(88, 70, 10, 8, '#3a2a1e', 'rx="1"') + glow('#ff8a3a', C(98, 74, 1.4, '#ffb04a'), 2)
      + '<path d="M66 72 L92 68 M70 76 L90 72" stroke="#3a1e0e" stroke-width=".5"/>'
      // black suit, white chest plate, shoulder bells, arm guards, belt box
      + shoulders('#141518', { top: 72 })
      + P('M34 76 C40 72.6 60 72.6 66 76 L64 94 L36 94Z', helm, 'stroke="#2a2c30" stroke-width=".8"') + L(50, 76, 50, 94, '#b8bec6', 0.7) + P('M37 84 Q50 88 63 84', 'none', 'stroke="#b8bec6" stroke-width=".6"')
      + mirror(P('M8 90 C9 82 16 77 26 76 L30 85 C22 87 16 91 14 97Z', helm, 'stroke="#2a2c30" stroke-width=".7"') + P('M10 86 Q16 80 24 79', 'none', 'stroke="#ffffff" stroke-width=".6"'))
      + R(38, 94, 24, 6, '#eceef1', 'rx="1" stroke="#2a2c30" stroke-width=".6"') + R(46, 95, 8, 4, '#2a2c30', 'rx=".6"')
      + P('M41 60 L59 60 L60 76 L40 76Z', '#141518')
      // the helmet: domed top, the brim, the black visor band, the narrow face and long snout
      + P('M37.4 37 C37.4 23 43 17 50 17 C57 17 62.6 23 62.6 37Z', helm, 'stroke="#2a2c30" stroke-width="1"') + E(44, 23, 4.4, 1.8, '#fff', 'transform="rotate(-24 44 23)"') + R(49.2, 17.4, 1.6, 18, '#d0d4da')
      + P('M31 38 C33 35.2 41 34.4 50 34.4 C59 34.4 67 35.2 69 38 L67.6 40.6 C61 39.6 39 39.6 32.4 40.6Z', helm, 'stroke="#2a2c30" stroke-width="1"') + P('M33 40 C40 39.2 60 39.2 67 40', 'none', 'stroke="#8a929c" stroke-width=".6"')
      + P('M35 40.6 C41 39.8 59 39.8 65 40.6 L63.6 46.6 C58 45.8 42 45.8 36.4 46.6Z', '#06070a') + P('M37 41.4 C43 40.8 57 40.8 63 41.4 L62.8 42.6 C57 42 43 42 37.2 42.6Z', '#4a5a72', 'opacity=".8"')
      + mirror(P('M36.6 46.6 L45.6 46.6 L45 58.6 L41.2 61.4 L38 56Z', '#e6e9ec', 'stroke="#2a2c30" stroke-width=".7"') + L(39, 50.6, 44, 50.6, '#9aa3ad', 0.5) + L(39.6, 53.6, 44, 53.6, '#9aa3ad', 0.5))
      + P('M45.6 46.4 L54.4 46.4 L55.6 63.6 C55.6 67.6 44.4 67.6 44.4 63.6Z', helm, 'stroke="#2a2c30" stroke-width=".8"') + L(50, 47.4, 50, 58, '#b8bec6', 0.8)
      + E(50, 63.4, 3.6, 2.6, '#1e2024') + [48.2, 50, 51.8].map((x) => L(x, 61.8, x, 65, '#8a929c', 0.4)).join('') + P('M44 52 L44 60 M56 52 L56 60', 'none', 'stroke="#2a2c30" stroke-width=".7"')
      // the long rifle held across, black gloves, white forearm guards
      + `<g transform="translate(16 90) rotate(-14)">${R(0, -2.4, 58, 4.8, '#141518', 'rx="1"')}${R(54, -1.4, 18, 2.8, '#141518')}${R(14, -5.6, 14, 3, '#2a2c30', 'rx=".6"')}${R(8, 2, 4, 7, '#141518', 'rx="1"')}${R(40, 2, 4, 6, '#141518', 'rx="1"')}</g>`
      + R(18, 84, 9, 4, '#eceef1', 'rx="1.4" transform="rotate(-14 22 86)"') + R(60, 76, 9, 4, '#eceef1', 'rx="1.4" transform="rotate(-14 64 78)"')
      + E(28, 89, 4, 3.2, '#0c0d10') + E(62, 81, 4, 3.2, '#0c0d10');
  });

  // ---------- Endor optional boss: AT-ST Walker ----------
  // Drawn from the reference photos: the boxy armoured head in three-quarter
  // view (sloped front with two viewports, flat side with the round
  // concussion-grenade drum, roof plates and hatch), twin chin blasters, the
  // mechanical waist and hip actuators, long jointed legs with pistons and
  // clawed feet. Endor's redwoods, an Ewok log trap and an Ewok in the ferns.
  add('atst', () => {
    const [front, fd] = LG([[0, '#c8ced6'], [1, '#7a828c']]);
    const [side, sdd] = LG([[0, '#9aa2ac'], [1, '#5a626c']], 0, 0, 1, 0);
    const [leg, ld] = LG([[0, '#9aa2ac'], [1, '#4a525c']], 0, 0, 1, 0);
    const [sun, sund] = RG([[0, '#fff8d8', 0.5], [1, '#fff8d8', 0]], 0.75, 0.05, 0.6);
    const legSeg = (x1, y1, x2, y2, w) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#2a3038" stroke-width="${w + 1.4}" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${leg}" stroke-width="${w}" stroke-linecap="round"/>`;
    const foot = (x, y, c) => P(`M${x - 8} ${y} L${x + 7} ${y} L${x + 9} ${y + 4} L${x + 5} ${y + 3} L${x + 3} ${y + 5} L${x - 1} ${y + 3} L${x - 4} ${y + 5} L${x - 7} ${y + 3} L${x - 10} ${y + 4}Z`, c, 'stroke="#2a3038" stroke-width=".6"') + R(x - 4, y - 3, 8, 3.4, '#4a525c', 'rx="1"');
    return R(0, 0, 100, 100, '#14301a') + fd + sdd + ld + sund
      + R(0, 0, 100, 60, '#4a7a52', 'opacity=".5"') + R(0, 0, 100, 100, sun)
      // redwoods with bark
      + [[2, 9, '#2a1a0c'], [26, 4, '#3a2a1a'], [60, 3, '#3a2a1a'], [88, 11, '#2a1a0c']].map(([x, w, c]) => R(x, 0, w, 100, c) + [0.25, 0.5, 0.75].map((k) => L(x + w * k, 0, x + w * k + 0.6, 100, '#160c04', 0.6)).join('') + R(x + w * 0.1, 0, w * 0.15, 100, '#5a3e24', 'opacity=".5"')).join('')
      + R(0, 86, 100, 14, '#1e3a1c') + [[4, 92], [18, 94], [36, 90], [62, 92], [94, 90]].map(([x, y]) => P(`M${x} ${y} q-6 -8 -10 -4 M${x} ${y} q6 -8 10 -4 M${x} ${y} q-2 -10 0 -12`, 'none', 'stroke="#3a6a2a" stroke-width="1.6" stroke-linecap="round"')).join('')
      + puffs('#d8e8d0', 0.25, [[50, 94, 50, 7]])
      // far leg (left): hip, long thigh down to the reverse knee, shin, clawed foot
      + legSeg(38, 48, 28, 66, 4) + legSeg(28, 66, 34, 88, 3.4) + C(28, 66, 2.6, '#5a626c', 'stroke="#2a3038" stroke-width=".6"') + L(33, 54, 29, 62, '#c8ced6', 0.6) + L(30, 70, 33, 82, '#2a3038', 1) + foot(34, 88, '#4a525c')
      // near leg (right): bigger, with its pistons
      + legSeg(64, 47, 78, 64, 5) + legSeg(78, 64, 68, 88, 4.2) + L(67, 51, 76, 60, '#2a3038', 1.4) + L(76, 69, 70, 84, '#d8dee4', 0.7) + L(74, 68, 69, 82, '#2a3038', 1)
      + C(78, 64, 3.4, '#6a727c', 'stroke="#2a3038" stroke-width=".7"') + C(78, 64, 1.2, '#2a3038') + foot(68, 88, '#5a626c')
      // waist machinery and hip actuators under the head
      + P('M34 40 L66 39 L67 48 L35 49Z', '#3a4048', 'stroke="#1a1e24" stroke-width=".6"') + [40, 46, 52, 58].map((x) => L(x, 40.4, x + 0.4, 48.4, '#5a626c', 0.6)).join('') + '<path d="M42 43 Q50 47 58 42" stroke="#1a1e24" stroke-width="1" fill="none"/>'
      + C(38, 48, 4, '#6a727c', 'stroke="#2a3038" stroke-width=".7"') + C(38, 48, 1.6, '#3a4048') + C(64, 47, 4.6, '#7a828c', 'stroke="#2a3038" stroke-width=".7"') + C(64, 47, 1.8, '#3a4048')
      + `<g transform="translate(17 2) scale(.66)">`
      // chin box and the twin chin blasters, firing
      + P('M24 50 L48 46 L50 56 L28 60Z', '#5a626c', 'stroke="#1a1e24" stroke-width=".6"') + R(30, 52, 14, 4, '#3a4048', 'rx=".6"')
      + `<g transform="rotate(10 28 54)">${R(4, 52, 26, 2.8, '#2a3038')}${R(6, 56, 24, 2.4, '#2a3038')}</g>`
      + glow('#3aff6a', C(4, 52, 2.4, '#d8ffe0') + C(6, 56.4, 2, '#d8ffe0'), 3) + bolt(-6, 50.4, 2, 51.6, '#3aff6a')
      // roof plates and hatch
      + P('M16 20 L24 11 L78 9 L84 19 L46 16Z', '#dfe4ea', 'stroke="#2a3038" stroke-width=".8"') + R(50, 6, 14, 5, '#9aa2ac', 'rx="1" stroke="#2a3038" stroke-width=".6"') + L(30, 14, 72, 11.6, '#9aa2ac', 0.6)
      // the flat side with its grenade drum, vents and panel lines
      + P('M46 16 L84 19 L84 46 L48 48Z', side, 'stroke="#2a3038" stroke-width=".9"')
      + C(66, 32, 8.4, '#8a929c', 'stroke="#2a3038" stroke-width=".8"') + C(66, 32, 5.6, '#6a727c', 'stroke="#2a3038" stroke-width=".6"') + C(66, 32, 2.6, '#3a4048') + R(64, 23, 4, 3, '#4a525c')
      + `<g transform="translate(74 32) rotate(-8)">${R(0, -1.4, 12, 2.8, '#3a4048')}${C(12, 0, 2, '#4a525c')}</g>`
      + [[76, 40], [76, 43]].map(([x, y]) => R(x, y, 6, 1.2, '#4a525c')).join('') + '<path d="M54 18 L54 47 M80 20 L80 46 M48 40 L84 39" stroke="#4a525c" stroke-width=".5" fill="none"/>'
      // the sloped front: two viewports, a small side blaster, weathering
      + P('M16 20 L46 16 L48 48 L22 52Z', front, 'stroke="#2a3038" stroke-width=".9"')
      + P('M20 25 L30 23.6 L30.6 29 L20.8 30.6Z', '#0c1014') + P('M33 23.2 L43 21.8 L43.4 27.6 L33.6 29Z', '#0c1014')
      + glow('#ffb03a', R(22, 27, 7, 1.2, '#ffb03a', 'opacity=".7"') + R(35, 25.4, 7, 1.2, '#ffb03a', 'opacity=".7"'), 1.4)
      + '<path d="M18 36 L46 33 M20 44 L47 41 M31 23 L32 50" stroke="#7a828c" stroke-width=".6" fill="none"/>' + [[24, 39], [40, 37], [26, 47], [42, 45]].map(([x, y]) => C(x, y, 0.6, '#5a626c')).join('')
      + '<path d="M28 33 l3 2 M38 44 l2 -2" stroke="#4a525c" stroke-width=".6" opacity=".7"/>' + E(36, 49, 8, 1.6, '#5a4a2a', 'opacity=".3"')
      + `<g transform="translate(16 36) rotate(4)">${R(-12, -1.4, 13, 2.8, '#3a4048')}${C(1, 0, 2.4, '#5a626c', 'stroke="#2a3038" stroke-width=".5"')}</g>`
      + '</g>'
      // an Ewok in the ferns with his spear: furry body, the leather hood, big dark eyes
      + `<g transform="translate(14 84) scale(1.25)">`
      + L(8, 12, 12, -14, '#6a4a2a', 1) + P('M11.4 -14 L13 -19 L13 -13.4Z', '#c8ccd2') + L(10.6, -9, 13, -8, '#a0602a', 0.8)
      + P('M-8 16 C-8 6 -5 2 0 2 C5 2 8 6 8 16Z', '#6e4a2c') + '<path d="M-6 10 l1.4 2 M-3 7 l1 2 M3 7 l-1 2 M6 10 l-1.4 2 M-1 12 l1 2" stroke="#4a2e18" stroke-width=".6"/>'
      + E(7, 8, 2.4, 2, '#7a5434') + E(-6.6, 8.4, 2.2, 1.8, '#7a5434')
      + E(0, -2, 7, 6.4, '#7a5434') + E(0, 1.4, 4, 3, '#a07a54')
      + P('M-7.4 -1 C-8 -9 -4 -12 0 -12 C4 -12 8 -9 7.4 -1 C6 -5 3 -7 0 -7 C-3 -7 -6 -5 -7.4 -1Z', '#b8692e', 'stroke="#6a3a14" stroke-width=".5"')
      + C(-6.6, -8, 1.8, '#b8692e', 'stroke="#6a3a14" stroke-width=".4"') + C(6.6, -8, 1.8, '#b8692e', 'stroke="#6a3a14" stroke-width=".4"') + L(-6, -4.6, 6, -4.6, '#6a3a14', 0.5)
      + '<path d="M-6.4 -3 l-1.2 1 M-6.6 0 l-1.4 .4 M-6 3 l-1.2 1 M6.4 -3 l1.2 1 M6.6 0 l1.4 .4 M6 3 l1.2 1 M-3 4.4 l-.4 1.4 M3 4.4 l.4 1.4" stroke="#5a3a1e" stroke-width=".5"/>'
      + E(-2.8, 1, 2.6, 2, '#b08a62', 'opacity=".7"') + E(2.8, 1, 2.6, 2, '#b08a62', 'opacity=".7"')
      + '<path d="M-4.6 -4.4 Q-2.6 -5.6 -0.8 -4.4 M0.8 -4.4 Q2.6 -5.6 4.6 -4.4" stroke="#4a2e18" stroke-width=".6" fill="none" stroke-linecap="round"/>'
      + E(-2.6, -2, 1.8, 2, '#0c0806') + E(2.6, -2, 1.8, 2, '#0c0806') + E(-2.6, -2, 1.1, 1.3, '#2a1a10') + E(2.6, -2, 1.1, 1.3, '#2a1a10') + C(-2, -2.7, 0.6, '#fff') + C(3.2, -2.7, 0.6, '#fff') + C(-3, -1.3, 0.25, '#fff', 'opacity=".7"') + C(2.2, -1.3, 0.25, '#fff', 'opacity=".7"')
      + E(0, 1, 1.5, 1, '#1a0f08') + C(-0.5, 0.8, 0.25, '#4a3020') + C(0.5, 0.8, 0.25, '#4a3020')
      + '<path d="M-1.8 3 Q0 4.2 1.8 3" stroke="#3a2210" stroke-width=".55" fill="none"/>' + '<path d="M-5 -9.6 l.6 1.2 M-2 -11 l.4 1.2 M2 -11 l-.4 1.2 M5 -9.6 l-.6 1.2" stroke="#6a3a14" stroke-width=".4"/>'
      + '</g>';
  });

  // ---------- Scarif opponent: Shoretrooper ----------
  // From your photos, shaded for depth: the helmet's round dome, the sharp
  // flat-topped crest band, the angular cheek plates and rounded chin; the
  // dark visor band with the slot and the slotted breather; weathered sand
  // armour, squad-leader blue, red armband, brown fatigues, E-22 rifle.
  // Scarif behind: the Citadel and its dish, the landing pad with an AT-ACT,
  // palms, surf, a U-wing coming in and blaster fire on the beach.
  add('shoretrooper', () => {
    const [sand, sdd] = LG([[0, '#f0e2b6'], [0.55, '#cdb47e'], [1, '#9a8050']], 0, 0, 1, 1);
    const [sandD, sd2] = LG([[0, '#c8b07a'], [1, '#8a7046']], 0, 0, 1, 0);
    const [sky, skd] = LG([[0, '#5ab0e0'], [1, '#c8ecf6']]);
    return skd + sdd + sd2 + R(0, 0, 100, 100, sky)
      // the Citadel tower with its dish, and the shield gate shimmer high up
      + P('M4 64 L8 18 L18 18 L22 64Z', '#dfe3e8', 'stroke="#9aa2ac" stroke-width=".5"') + R(6, 12, 14, 6, '#c8ccd2') + E(13, 10, 8, 2.4, '#b0b6be') + L(13, 10, 13, 2, '#9aa2ac', 0.7)
      + [24, 32, 40, 48].map((y) => L(9, y, 17 + (y - 24) * 0.05, y, '#9aa2ac', 0.5)).join('') + P('M0 6 Q50 -4 100 6', 'none', 'stroke="#bfe8ff" stroke-width="1.2" opacity=".5"')
      // sea and surf, a U-wing coming in
      + R(0, 54, 100, 12, '#2ba3b8') + '<path d="M0 58 Q12 56 24 58 T48 58 T72 58 T100 58 M0 62 Q16 60 32 62 T64 62 T100 62" stroke="#bfeef6" stroke-width=".6" fill="none"/>'
      + `<g transform="translate(70 20) rotate(-8)">${P('M-10 0 L8 -1.6 L12 0 L8 1.6Z', '#c8ccd2')}${R(-4, -6, 2, 12, '#9aa2ac')}${E(12, 0, 1.4, 1, '#ff8a3a')}</g>`
      // the landing pad and an AT-ACT
      + R(62, 52, 38, 4, '#8a929c') + `<g transform="translate(70 30)">${R(0, 0, 22, 9, '#8a929c', 'rx="1.5"')}${R(20, 2, 7, 5, '#8a929c')}${R(1, 9, 16, 5, '#6a727c')}${[3, 7, 13, 17].map((x) => R(x, 14, 1.6, 8, '#7a828c')).join('')}</g>`
      + R(0, 66, 100, 34, '#f2dfa6') + P('M0 70 Q30 66 60 70 T100 68', 'none', 'stroke="#d8c088" stroke-width="1"')
      + [[10, 40], [92, 34], [56, 44]].map(([x, y], i) => L(x, 72, x + 2, y, '#6a4a2a', i === 2 ? 1 : 1.6) + P(`M${x + 2} ${y} q-10 2 -14 8 M${x + 2} ${y} q10 2 14 8 M${x + 2} ${y} q-4 -6 -12 -6 M${x + 2} ${y} q4 -6 12 -6`, 'none', `stroke="#2a7a4a" stroke-width="${i === 2 ? 1.6 : 2.4}" stroke-linecap="round"`)).join('')
      + bolt(84, 64, 66, 60, '#ff3a2a') + bolt(20, 60, 36, 56, '#ff3a2a')
      // brown fatigues under sand armour; squad leader blue; red armband
      + shoulders('#5a4632', { top: 72 })
      + mirror(P('M6 92 C8 82 18 77 28 76 L32 85 C23 87 17 92 15 98Z', '#2a5aa8', 'stroke="#1a2a4a" stroke-width=".7"') + P('M7 90 C9 84 15 80 22 79', 'none', 'stroke="#7a9ad8" stroke-width=".6"'))
      + R(4, 90, 10, 4, '#c82a2a', 'transform="rotate(-24 9 92)"')
      + P('M33 76 C40 72.6 60 72.6 67 76 L65 96 L35 96Z', '#2a5aa8', 'stroke="#1a2a4a" stroke-width=".8"')
      + P('M38 80 L62 80 L60 94 L40 94Z', sand, 'stroke="#4a3a1e" stroke-width=".6"') + [44, 48, 52, 56].map((x) => L(x, 82, x, 92, '#8a7650', 0.6)).join('') + shade('M50 80 L62 80 L60 94 L50 94Z', 0.12)
      + R(34, 94, 32, 4, '#5a4632') + [37, 44, 51, 58].map((x) => R(x, 94.4, 5, 3.4, '#8a6a42', 'rx=".5"')).join('')
      + P('M41 60 L59 60 L60 76 L40 76Z', '#4a3a28')
      // the helmet: round dome, sharp crest band, angular cheeks, rounded chin, all shaded
      + P('M34 42 C34 26 41 19 50 19 C59 19 66 26 66 42Z', sand, 'stroke="#4a3a1e" stroke-width="1"')
      + P('M50 19 C59 19 66 26 66 42 L50 42Z', '#000', 'opacity=".1"') + E(42, 25, 6, 2.4, '#fffaf0', 'opacity=".7" transform="rotate(-24 42 25)"') + C(50, 23.4, 1.6, '#e8642a')
      + P('M32.6 34 L67.4 34 L68 38.6 L32 38.6Z', sandD, 'stroke="#4a3a1e" stroke-width=".8"') + L(33, 34.6, 67, 34.6, '#fff2cc', 0.6)
      + P('M33 38.6 L67 38.6 L66.4 45.4 L52 45.6 L51.4 52 L48.6 52 L48 45.6 L33.6 45.4Z', '#0b0a07') + P('M34.4 39.6 L65.6 39.6 L65.4 41 L34.6 41Z', '#6a8098', 'opacity=".7"')
      + mirror(P('M33.6 45.4 L44.4 45.4 L44.6 54 L40.6 58.6 L36 57 L33.4 52Z', sand, 'stroke="#4a3a1e" stroke-width=".7"') + P('M33.6 45.4 L44.4 45.4 L44.4 47 L33.8 47Z', '#fff2cc', 'opacity=".5"') + L(37, 49, 37.4, 55, '#6a5634', 0.6) + L(39.6, 49, 40, 55.6, '#6a5634', 0.6))
      + shade('M50 45.6 L66.4 45.4 L66.6 52 L59.4 58.6 L55.6 59 L50 63Z', 0.12)
      + P('M40.6 58.6 L44.6 54 L55.4 54 L59.4 58.6 C57 63 43 63 40.6 58.6Z', sandD, 'stroke="#4a3a1e" stroke-width=".7"')
      + R(44.6, 54.6, 10.8, 5, '#3a2e1a', 'rx="1"') + [46.4, 48.4, 50.4, 52.4, 54].map((x) => R(x, 55.4, 0.9, 3.4, '#b49a68')).join('')
      + '<path d="M38 30 l3 1 M61 48 l-2 2 M57 26 l2 -1 M43 56 l2 1" stroke="#8a7650" stroke-width=".6" opacity=".8"/>'
      + `<g transform="translate(24 98) rotate(-18)">${R(0, -3, 50, 6, '#141518', 'rx="1.5"')}${R(8, -6.4, 18, 3.4, '#2a2c30')}${R(44, -1.8, 12, 3.6, '#141518')}${R(18, 3, 5, 7, '#141518', 'rx="1"')}</g>`;
  });

  // ---------- Scarif optional boss: Director Krennic ----------
  // On the Citadel platform in his white cape, two death troopers at his
  // back, the Death Star over Scarif firing on the shield gate.
  add('krennic', () => {
    const [sky, sd] = LG([[0, '#4aa8d8'], [1, '#bfe8f4']]);
    const [ds, dsd] = RG([[0, '#c8ced6'], [0.7, '#8a929c'], [1, '#4a525c']], 0.35, 0.35, 0.75);
    const [dt, dtd] = LG([[0, '#3a3e46'], [0.5, '#1c1e22'], [1, '#0c0d10']], 0, 0, 1, 1);
    // A death trooper (from the reference): glossy black armour, pauldrons, chest plate,
    // a belt of pouches, the E-11D across the chest, and the tall helmet with
    // slanted green lenses, a nose ridge and the long ribbed mouth strip.
    const dtrooper = (x, flip) => `<g transform="translate(${x} 0)${flip ? ' scale(-1 1)' : ''}">`
      + P('M-16 100 L-15 76 C-13 68 -6 64 0 64 C6 64 13 68 15 76 L16 100Z', dt, 'stroke="#3a3e46" stroke-width=".5"')
      + P('M-15.4 77 C-14.6 69.4 -9.6 66.4 -4 66.2 L-5 74.4 L-13 80.6Z', '#24272e', 'stroke="#5a5e66" stroke-width=".5"') + P('M15.4 77 C14.6 69.4 9.6 66.4 4 66.2 L5 74.4 L13 80.6Z', '#24272e', 'stroke="#5a5e66" stroke-width=".5"')
      + P('M-14 74 C-12 70 -9 68 -6 67.6', 'none', 'stroke="#8a929c" stroke-width=".5" opacity=".7"')
      + P('M-6.6 69.4 L6.6 69.4 L5.8 80 L-5.8 80Z', '#1a1d22', 'stroke="#4a4e56" stroke-width=".5"') + L(-5, 71, 5, 71, '#6a707a', 0.4) + L(-4.6, 74, 4.6, 74, '#3a3e46', 0.5)
      + R(-12, 86, 24, 2.6, '#121316') + [-10.6, -5.4, 5.6].map((px) => R(px, 81.4, 4.4, 5.6, '#1c1f24', 'rx=".6" stroke="#4a4e56" stroke-width=".4"')).join('') + R(-1.4, 86.2, 2.8, 2.2, '#8a929c')
      + `<g transform="translate(-15 93) rotate(-30)">${R(0, -2, 30, 4, '#0b0c0f', 'rx="1"')}${R(27, -1.1, 11, 2.2, '#0b0c0f')}${R(6, -4.6, 11, 2.6, '#2a2e36', 'rx=".6"')}${R(4, 2, 3.6, 6.4, '#0b0c0f', 'rx=".6"')}${L(2, -1, 26, -1, '#4a4e56', 0.4)}</g>`
      + '<g transform="translate(0 66) scale(1.12 .8) translate(0 -66)">'
      + P('M-8.4 50 C-8.4 39 -4.6 35 0 35 C4.6 35 8.4 39 8.4 50 L9.4 60 C8 64.4 4 66 0 66 C-4 66 -8 64.4 -9.4 60Z', dt, 'stroke="#5a5e66" stroke-width=".6"')
      + E(-3.6, 39.6, 2.6, 1.1, '#ffffff', 'opacity=".2" transform="rotate(-24 -3.6 39.6)"')
      + '<path d="M-7.4 45.2 Q0 42.2 7.4 45.2" stroke="#4a4e56" stroke-width=".7" fill="none"/>' + R(-0.7, 45.6, 1.4, 6.4, '#34383f')
      + glow('#4ade80', P('M-7 46.6 C-7 44.4 -1.6 44 -1.4 46.2 L-2 51.2 C-4 52.2 -6.2 51.2 -7 46.6Z', '#1e5a3a') + P('M7 46.6 C7 44.4 1.6 44 1.4 46.2 L2 51.2 C4 52.2 6.2 51.2 7 46.6Z', '#1e5a3a'), 1.6)
      + E(-4.8, 46.4, 1, 0.6, '#c8fff0', 'opacity=".85"') + E(4.8, 46.4, 1, 0.6, '#c8fff0', 'opacity=".85"')
      + P('M-2.6 52.6 L2.6 52.6 L3 62.4 L-3 62.4Z', '#08090b') + [54.4, 56.4, 58.4, 60.4].map((y) => L(-2.4, y, 2.4, y, '#4a4e56', 0.45)).join('')
      + L(-5.6, 55.6, -8.4, 61, '#2a2e36', 1.4) + L(5.6, 55.6, 8.4, 61, '#2a2e36', 1.4)
      + '</g></g>';
    return sd + dsd + dtd + R(0, 0, 100, 100, sky)
      // the Death Star: shaded sphere, equatorial trench, the dish, surface plating and lights
      + C(78, 20, 16, ds) + L(62.2, 21.6, 93.8, 18.4, '#5a626c', 1) + L(62.4, 22.6, 93.6, 19.4, '#c8ced6', 0.4)
      + [[66, 12, 8], [70, 28, 10], [82, 9, 9], [86, 29, 8], [74, 33, 6]].map(([x, y, w]) => L(x, y, x + w, y - 0.6, '#6a727c', 0.4)).join('')
      + [[67, 16], [84, 14], [88, 24], [76, 27], [70, 25], [90, 16]].map(([x, y]) => R(x, y, 0.8, 0.5, '#e8ecf0', 'opacity=".7"')).join('')
      + C(71, 12.6, 4.4, '#7a828c', 'stroke="#4a525c" stroke-width=".5"') + C(71, 12.6, 2.8, 'none', 'stroke="#5a626c" stroke-width=".4"') + C(71, 12.6, 1.2, '#4a525c')
      + glow('#5aff4a', [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const r = (a * Math.PI) / 180; return L((71 + Math.cos(r) * 3.8).toFixed(2), (12.6 + Math.sin(r) * 3.8).toFixed(2), 72.4, 16.6, '#b8ff9a', 0.7); }).join('') + C(72.4, 16.6, 1.6, '#f0fff0') + L(72.4, 16.6, 94, 58, '#5aff4a', 3.4, 'opacity=".55"') + L(72.4, 16.6, 94, 58, '#e8ffe0', 1.3), 3) + E(94, 58, 12, 3.4, '#e8ffd8', 'opacity=".9"') + E(94, 58, 22, 6, '#ffffff', 'opacity=".3"') + P('M80 60 Q94 50 108 60', 'none', 'stroke="#ffffff" stroke-width="1" opacity=".5"')
      + R(0, 56, 100, 10, '#2ba3b8') + P('M0 60 Q20 58 40 60 T80 60 T100 60', 'none', 'stroke="#8ad8e8" stroke-width=".6"')
      // the Citadel tower and its dish
      + P('M8 66 L12 20 L22 20 L26 66Z', '#cfd4da', 'stroke="#8a929c" stroke-width=".6"') + R(10, 14, 14, 6, '#b8bec6') + E(17, 12, 9, 2.6, '#9aa2ac') + L(17, 12, 17, 4, '#9aa2ac', 0.8)
      + [28, 36, 44, 52].map((y) => L(13, y, 22 + (y - 28) * 0.06, y, '#8a929c', 0.5)).join('')
      + R(0, 66, 100, 34, '#7a828c') + [70, 78, 88].map((y) => L(0, y, 100, y, '#5a626c', 0.6)).join('')
      + dtrooper(14) + dtrooper(86, true)
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
  // From the reference: olive-brown mottled hide, the long forward-leaning
  // head with two tall horns sweeping up from the back of the skull, small
  // dark eyes, snout and mandibles; veined wings, thin bony limbs, a gold
  // harness set with red stones, and the drum-shaped sonic blaster with its
  // green charge. Hive spires behind.
  add('geonosian_warrior', () => {
    const [sk, sd] = LG([[0, '#8a8a4a'], [0.5, '#6a5a2a'], [1, '#3a2e14']]);
    const [gold, gd] = LG([[0, '#f2d27a'], [1, '#9a6a1a']]);
    return SCENES.geonosis() + sd + gd
      // a Separatist core ship lifting off and droid factory stacks smoking on the horizon
      + C(76, 18, 9, '#6a5a50') + shade('M76 9 A9 9 0 0 1 76 27 A5 9 0 0 0 76 9Z', 0.25) + L(67, 18, 85, 18, '#4a3e36', 0.6) + E(76, 28, 4, 1.4, '#ffb04a', 'opacity=".6"')
      + [[32, 40, 4], [62, 38, 5]].map(([x, y, w]) => R(x, y, w, 40, '#5a3418') + puffs('#4a2e1e', 0.6, [[x + w / 2, y - 6, 6, 5], [x + w / 2 + 3, y - 14, 7, 5]])).join('')
      + [[22, 20], [56, 14], [88, 32]].map(([x, y]) => `<g transform="translate(${x} ${y})">${E(0, 0, 2, 0.8, '#3a2410')}${P('M-1 -0.4 L-5 -3 L-1 0.4Z M1 -0.4 L5 -3 L1 0.4Z', '#e8d8b0', 'opacity=".6"')}</g>`).join('')
      + [[8, 30, 8], [20, 42, 6], [82, 32, 7], [93, 46, 6]].map(([x, y, w]) => P(`M${x - w} 80 Q${x - w / 2} ${y + 10} ${x} ${y} Q${x + w / 2} ${y + 10} ${x + w} 80Z`, '#8a4a22', 'opacity=".9"') + C(x, y + 14, 1, '#ffb04a', 'opacity=".7"')).join('')
      // veined wings behind
      + mirror(P('M40 62 C26 48 10 44 4 52 C8 64 24 72 40 70Z', '#f2e6c8', 'opacity=".45" stroke="#7a5a2a" stroke-width=".6"') + '<path d="M40 66 C28 58 16 54 6 53 M40 68 C30 64 18 64 9 61 M40 64 C30 54 22 50 14 48" stroke="#7a5a2a" stroke-width=".5" fill="none" opacity=".8"/>')
      // thin bony body and arms
      + P('M30 100 C30 84 36 74 44 70 L56 70 C64 74 70 84 70 100Z', sk, 'stroke="#2a2010" stroke-width=".7"')
      + '<path d="M38 80 Q50 76 62 80 M36 88 Q50 84 64 88 M44 72 L42 100 M56 72 L58 100" stroke="#3a2e14" stroke-width=".7" fill="none"/>'
      + mirror(L(32, 76, 22, 90, '#5a4a22', 3) + L(22, 90, 30, 96, '#5a4a22', 2.6) + C(22, 90, 1.8, '#4a3a1a'))
      // gold harness with red stones
      + P('M38 70 L62 70 L58 82 L50 86 L42 82Z', gold, 'stroke="#5a3a0a" stroke-width=".6"') + P('M44 74 L56 74 L52 80 L48 80Z', '#7a4a10', 'opacity=".5"') + C(50, 82, 1.6, '#c42020', 'stroke="#5a0a0a" stroke-width=".4"') + C(42, 74, 1, '#c42020') + C(58, 74, 1, '#c42020')
      + P('M46 60 L54 60 L55 71 L45 71Z', '#5a4a22')
      // the two tall horns sweeping up from the back of the skull
      + mirror('<path d="M42 28 C38 18 36 10 38 2" stroke="#2a2010" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M42 28 C38 18 36 10 38 2" stroke="#7a6a3a" stroke-width="1.8" fill="none" stroke-linecap="round"/>')
      // the long head: ridged skull, small dark eyes, snout and mandibles
      + P('M38 36 C38 26 43 20 50 20 C57 20 62 26 62 36 C62 44 58 50 56 56 C55 60 53 64 50 64 C47 64 45 60 44 56 C42 50 38 44 38 36Z', sk, 'stroke="#2a2010" stroke-width=".9"')
      + shade('M50 20 C57 20 62 26 62 36 C62 44 58 50 56 56 C55 60 53 64 50 64Z', 0.15)
      + '<path d="M43 24 Q50 21 57 24 M41 29 Q50 25.4 59 29 M40 34 Q50 30.6 60 34" stroke="#3a2e14" stroke-width=".7" fill="none"/>'
      + [[44, 27], [56, 31], [47, 40], [54, 44], [49, 50]].map(([x, y]) => E(x, y, 1.2, 0.8, '#9a9a5a', 'opacity=".55"')).join('')
      + mirror(E(43.4, 39, 2.4, 1.8, '#140c04', 'transform="rotate(-18 43.4 39)"') + C(42.8, 38.6, 0.5, '#f0e0b0', 'opacity=".8"') + '<path d="M46 58 C44 61 43.6 64 45 67" stroke="#3a2e14" stroke-width="1.1" fill="none" stroke-linecap="round"/>')
      + '<path d="M47.4 54 Q50 56 52.6 54" stroke="#2a2010" stroke-width=".8" fill="none"/>' + E(50, 58, 2.4, 3, '#4a3a1a')
      // the sonic blaster: a drum with a green glowing lens
      + `<g transform="translate(22 82) rotate(-10) scale(1.7)">${R(0, -6, 20, 12, '#5a3a1a', 'rx="5" stroke="#2a1a0a" stroke-width=".5"')}${R(4, -7, 10, 2, '#7a5226', 'rx=".6"')}${R(16, -3, 10, 6, '#3a2410', 'rx="1"')}${L(4, -6, 4, 6, '#2a1a0a', 0.5)}${L(10, -6, 10, 6, '#2a1a0a', 0.5)}${C(1, 0, 6.6, '#2a1a0a')}${C(1, 0, 5, '#3aaa4a')}${C(1, 0, 5, 'none', 'stroke="#b0ffb8" stroke-width=".6"')}${C(1, 0, 2.2, '#d8ffd8', 'style="filter:drop-shadow(0 0 3px #7aff8a)"')}${L(-3.4, -0.6, 5, 0.6, '#1a3a1a', 0.6)}</g>`
      + mirror(E(30, 84, 3, 2.4, '#5a4a22'));
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
  // Skinny and quick, as in The Clone Wars: a narrow bullet head with two
  // slanted white eye slits and the ribbed vent down the face, a thin neck,
  // narrow shoulders and a tapered chest with the red sensor, rust-orange
  // ball joints, both hands on the blaster rifle, the vibrosword strapped on
  // his back. Night on the Rishi moon: the gas giant, the clone outpost with
  // its dish and lit windows, searchlights in the mist, more commandos
  // climbing the ridge and their landing craft.
  add('commando_droid', () => {
    const [night, nd] = LG([[0, '#070c18'], [0.6, '#16243c'], [1, '#2a3a52']]);
    const [arm, ad] = LG([[0, '#8e7a7e'], [0.5, '#6a585c'], [1, '#3e3034']], 0, 0, 1, 0);
    const [gas, gd] = RG([[0, '#e8c49a'], [0.7, '#b88a5e'], [1, '#6a4a2e']], 0.35, 0.35, 0.8);
    const joint = (x, y, r) => C(x, y, r, '#c8642a', 'stroke="#5a2a10" stroke-width=".4"') + C(x - r * 0.3, y - r * 0.3, r * 0.35, '#f0a060', 'opacity=".7"');
    const limb = (x1, y1, x2, y2, w) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#2a2022" stroke-width="${w + 1}" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${arm}" stroke-width="${w}" stroke-linecap="round"/>`;
    return nd + ad + gd + R(0, 0, 100, 100, night) + stars(17, 34, 60)
      // the gas giant Rishi filling the sky
      + C(76, 20, 22, gas) + P('M54 14 Q76 10 98 16 M54 22 Q76 19 98 25 M56 30 Q76 29 96 33', 'none', 'stroke="#8a5e3a" stroke-width="1.6" opacity=".6"') + shade('M76 -2 A22 22 0 0 1 76 42 A13 22 0 0 0 76 -2Z', 0.4)
      // searchlights sweeping the mist
      + P('M14 30 L4 0 L12 0Z', '#e8f4ff', 'opacity=".08"') + P('M22 30 L40 0 L48 0Z', '#e8f4ff', 'opacity=".07"')
      // rock ridges, near and far
      + P('M0 52 L8 44 L16 48 L26 38 L36 46 L46 40 L58 50 L70 42 L82 50 L92 44 L100 48 L100 100 L0 100Z', '#1a2230')
      + P('M0 66 L12 58 L24 64 L40 56 L56 66 L72 58 L88 66 L100 60 L100 100 L0 100Z', '#121822') + E(30, 72, 6, 1.6, '#0a0e14') + E(80, 76, 8, 2, '#0a0e14')
      // the clone outpost: dome, tower, dish and lit windows
      + E(18, 44, 10, 6, '#c8ccd2') + R(8, 44, 20, 4, '#9aa2ac') + R(16, 22, 4, 22, '#8a929c') + E(18, 20, 6, 2, '#b8bec6') + L(18, 20, 18, 12, '#8a929c', 0.6)
      + glow('#ffd88a', C(18, 12, 0.9, '#ffe8b0') + R(11, 42, 2, 1.4, '#ffd88a') + R(15, 41, 2, 1.4, '#ffd88a') + R(21, 41, 2, 1.4, '#ffd88a'), 2)
      // the commandos' landing craft and more of them on the ridge
      + `<g transform="translate(88 56)">${P('M-8 4 C-8 -4 8 -4 8 4Z', '#4a3e42')}${R(-9, 4, 18, 2, '#3a3034')}${C(-6, 6, 0.8, '#ff4a2a')}${C(6, 6, 0.8, '#ff4a2a')}</g>`
      + [[36, 46, 0.5], [44, 42, 0.45], [62, 50, 0.5]].map(([x, y, sc]) => `<g transform="translate(${x} ${y}) scale(${sc})">${E(0, -12, 2.4, 4, '#3a2e32')}${L(0, -8, 0, -4, '#3a2e32', 1)}${P('M-3 -4 L3 -4 L2 4 L-2 4Z', '#3a2e32')}${L(-2, 4, -4, 12, '#3a2e32', 1.4)}${L(2, 4, 5, 11, '#3a2e32', 1.4)}${L(-3, -3, -6, 3, '#3a2e32', 1)}</g>`).join('')
      + puffs('#8aa0c0', 0.22, [[20, 62, 26, 6], [76, 66, 28, 6]])
      // the vibrosword strapped across his back: hilt over the right shoulder
      + `<g transform="rotate(30 64 50)">${R(61, 24, 5, 48, '#8a6a9a', 'opacity=".85" rx="1"')}${R(62, 26, 1.2, 44, '#e0d0f0', 'opacity=".6"')}${R(60, 18, 7, 6, '#2a2224', 'rx="1"')}${R(61.6, 12, 3.8, 6, '#3a3034', 'rx=".6"')}</g>`
      // legs, hips and the thin waist
      + limb(46, 86, 42, 100, 4) + limb(54, 86, 58, 100, 4) + joint(46, 86, 2.6) + joint(54, 86, 2.6) + R(45.6, 76, 8.8, 10, '#3e3034', 'rx="1.4"')
      // arms: shoulders out to the elbows, forearms in to the rifle
      + limb(34, 58, 28, 74, 3.6) + limb(28, 74, 38, 84, 3.2) + limb(66, 58, 72, 72, 3.6) + limb(72, 72, 60, 80, 3.2)
      + joint(34, 58, 3) + joint(66, 58, 3) + joint(28, 74, 2.4) + joint(72, 72, 2.4)
      // the tapered chest with its red sensor, and the sword strap
      + P('M37 56 L63 56 L60 72 L54 78 L46 78 L40 72Z', arm, 'stroke="#1e1618" stroke-width=".7"') + shade('M50 56 L63 56 L60 72 L54 78 L50 78Z', 0.18)
      + '<path d="M40 60 L60 60 M42 68 L58 68" stroke="#2e2426" stroke-width=".5"/>' + L(42, 76, 62, 56, '#2a2224', 1.6) + glow('#ff3a3a', C(52, 63, 1.6, '#ff4a4a'), 2)
      // thin neck with its collar
      + R(47.6, 46, 4.8, 11, '#3a2e30') + [49, 51.6, 54].map((y) => R(47, y, 6, 1, '#5a4a4e', 'rx=".4"')).join('') + R(45.6, 54.6, 8.8, 2.4, '#c8642a', 'rx="1"')
      // the narrow bullet head: two slanted eye slits, the ribbed vent down the face
      + P('M42.6 30 C42.6 19 46 13 50 13 C54 13 57.4 19 57.4 30 C57.4 40 55 47 50 48 C45 47 42.6 40 42.6 30Z', arm, 'stroke="#1e1618" stroke-width=".9"')
      + shade('M50 13 C54 13 57.4 19 57.4 30 C57.4 40 55 47 50 48Z', 0.2) + E(46.4, 19, 2, 1, '#fff', 'opacity=".22" transform="rotate(-24 46.4 19)"')
      + L(50, 13.6, 50, 26, '#3e3034', 0.5) + mirror(P('M44.6 27.4 L48.6 29.4 L48.4 30.8 L44.4 28.8Z', '#f4f0e8') + P('M44 26.6 L49 29 L49 31.6 L44 29.6Z', '#2a2022', 'opacity=".55"'))
      + P('M48 33 L52 33 L51.4 45 L48.6 45Z', '#2a2224') + [35.4, 37.8, 40.2, 42.6].map((y) => L(48.3, y, 51.7, y, '#6a5a5e', 0.45)).join('')
      // both hands on the blaster rifle held across him
      + `<g transform="translate(24 90) rotate(-14)">${R(0, -2.6, 42, 5.2, '#1e1a1c', 'rx="1.4"')}${R(38, -1.4, 12, 2.8, '#1e1a1c')}${R(8, -6, 14, 3.4, '#3a3436', 'rx=".6"')}${[12, 16, 20, 24, 28].map((x) => R(x, -1.4, 1.2, 2.8, '#3a3436')).join('')}${R(6, 2.4, 4, 6, '#1e1a1c', 'rx=".8"')}</g>`
      + C(38, 84, 2.4, '#4a3a3e', 'stroke="#1e1618" stroke-width=".4"') + C(60, 80, 2.4, '#4a3a3e', 'stroke="#1e1618" stroke-width=".4"');
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
      // the Z-6 jetpack on his back: frame behind his shoulders, thruster cans at each side, flames below
      + mirror(glow('#ffb03a', P('M20 70 C16 80 18 90 24 100 C26 92 30 84 30 70Z', '#ffd27a', 'opacity=".85"') + P('M22 72 C20 80 22 88 25 95 C26 88 28 80 28 72Z', '#fff4d0'), 4))
      + R(26, 46, 48, 26, '#4a5a6a', 'rx="3" stroke="#2a3440" stroke-width=".7"') + L(26, 54, 74, 54, '#2a3440', 0.6)
      + mirror(R(18, 50, 12, 20, '#6a7a8a', 'rx="2.6" stroke="#2a3440" stroke-width=".7"') + R(19, 66, 10, 4, '#3a4450', 'rx="1"') + L(24, 50, 24, 66, '#9aa8b4', 0.6) + R(28, 56, 4, 4, '#3a4450'))
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
      // neck: the bodysuit collar running up into the helmet
      + P('M41 60 L59 60 L61 74 L39 74Z', '#2a3440') + P('M36 70 C42 67 58 67 64 70 L62 75 C56 72.6 44 72.6 38 75Z', '#5a6a7a', 'stroke="#1a2230" stroke-width=".6"')
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
  // From the reference: a hulking, hunched figure. Rocky tan plates (pocked
  // with blisters) cover his shoulders, chest and huge forearms; a crown of
  // flat antler-like plates sits above his face; the face is grey-violet and
  // ape-like with a heavy brow, broad nose and small pale eyes; a long
  // red-orange beard pours down his chest; dark violet-grey arms, knuckles on
  // the ground. Light and dark energy pour into him and gather in his chest:
  // he soaks up what hits him.
  add('bendu', () => {
    const [sky, sd] = LG([[0, '#4a5a6a'], [0.6, '#9aa4a8'], [1, '#d8ccb4']]);
    const [rock, rk] = LG([[0, '#e2cc98'], [0.6, '#bca06a'], [1, '#8a7040']]);
    const [beard, bd] = LG([[0, '#e07a3a'], [1, '#a8401a']]);
    const [core, cd] = RG([[0, '#ffffff'], [0.35, '#c8b0ff', 0.9], [1, '#7a4dff', 0]]);
    const pocks = (list) => list.map(([x, y, r]) => E(x, y, r, r * 0.7, '#f2e2b8', 'opacity=".7"') + E(x + r * 0.2, y + r * 0.2, r * 0.7, r * 0.45, '#9a7e4a', 'opacity=".5"')).join('');
    return sd + rk + bd + cd + R(0, 0, 100, 100, sky)
      // Atollon's spiky rock spires and dusty ground
      + [[6, 36, 5], [16, 50, 3], [84, 40, 4], [94, 32, 6]].map(([x, y, w]) => P(`M${x - w} 84 L${x - 1} ${y} L${x} ${y - 4} L${x + 1} ${y} L${x + w} 84Z`, '#4a525a')).join('')
      + R(0, 82, 100, 18, '#7a7e7a') + P('M0 86 Q30 82 60 86 T100 84 V100 H0Z', '#5e625e')
      // light and dark streaming into him from both sides
      + glow('#5aa8ff', '<path d="M0 22 C14 26 24 44 38 64" stroke="#cfe8ff" stroke-width="2" fill="none"/>', 3) + glow('#ff3a3a', '<path d="M100 22 C86 26 76 44 62 64" stroke="#ffc0c0" stroke-width="2" fill="none"/>', 3)
      // dark arms down to knuckles on the ground, and the huge rocky forearm plates
      + mirror(P('M24 62 C16 66 12 74 12 86 L22 88 C22 78 26 72 30 70Z', '#4a3e4e', 'stroke="#2a2230" stroke-width=".6"') + E(16, 90, 7, 4, '#3a2e3e', 'stroke="#2a2230" stroke-width=".5"') + '<path d="M11 91 l1 2 M15 92 l.6 2 M19 92 l0 2" stroke="#2a2230" stroke-width=".6"/>'
        + P('M6 84 C2 74 4 64 8 56 C10 50 14 46 18 44 C16 50 20 52 22 48 C24 56 22 64 24 70 C22 78 16 84 6 84Z', rock, 'stroke="#6a5430" stroke-width=".7"') + pocks([[12, 60, 1.6], [17, 66, 1.2], [10, 72, 1.4], [19, 56, 1]]))
      // body: rocky chest plates
      + P('M24 100 C24 80 30 64 50 62 C70 64 76 80 76 100Z', '#5a4a5a') + P('M30 100 C30 84 36 72 50 70 C64 72 70 84 70 100Z', rock, 'stroke="#6a5430" stroke-width=".6"') + '<path d="M36 86 Q50 82 64 86 M38 94 Q50 90 62 94" stroke="#8a7040" stroke-width=".8" fill="none"/>'
      + C(50, 88, 11, core) + glow('#c8b0ff', C(50, 88, 2.6, '#ffffff'), 4)
      // shoulder plates
      + mirror(P('M16 56 C18 46 28 40 38 42 C34 46 36 50 40 50 C38 56 32 60 24 62 C20 62 17 60 16 56Z', rock, 'stroke="#6a5430" stroke-width=".7"') + pocks([[24, 50, 1.6], [30, 46, 1.2], [21, 56, 1.1]]))
      // the long red-orange beard pouring down his chest
      + P('M36 52 C34 64 38 76 42 84 C44 80 46 86 50 88 C54 86 56 80 58 84 C62 76 66 64 64 52 C58 58 42 58 36 52Z', beard, 'stroke="#7a2a0a" stroke-width=".6"')
      + '<path d="M40 58 Q40 70 43 80 M44 60 Q44 74 47 84 M50 60 L50 86 M56 60 Q56 74 53 84 M60 58 Q60 70 57 80 M38 56 Q37 64 39 72 M62 56 Q63 64 61 72" stroke="#f0a060" stroke-width=".6" fill="none" opacity=".75"/>'
      // the face: grey-violet, heavy brow, broad nose, small pale eyes
      + P('M39 40 C39 32 44 28 50 28 C56 28 61 32 61 40 C61 48 58 54 50 56 C42 54 39 48 39 40Z', '#6a5a6e', 'stroke="#2a2230" stroke-width=".7"')
      + P('M39.6 38 Q50 33.6 60.4 38 L60 41 Q50 37.4 40 41Z', '#4a3c50')
      + mirror(E(45, 41.6, 1.6, 1, '#e8e4dc') + C(45.2, 41.6, 0.5, '#2a2230'))
      + P('M46.4 44 L53.6 44 L54.4 49.4 C52.4 50.6 47.6 50.6 45.6 49.4Z', '#5a4a5e') + E(48, 49, 1, 0.7, '#2a2230') + E(52, 49, 1, 0.7, '#2a2230')
      + '<path d="M46 53 Q50 54.4 54 53" stroke="#2a2230" stroke-width=".8" fill="none"/>'
      // the crown of flat antler-like plates
      + mirror(P('M42 32 C38 26 30 24 24 26 C26 22 30 18 36 18 C34 14 38 10 42 12 C42 16 46 18 48 20 C46 24 44 28 42 32Z', rock, 'stroke="#6a5430" stroke-width=".7"') + pocks([[33, 21, 1.2], [39, 16, 1], [29, 25, 0.9]]))
      + P('M40 30 C42 24 46 22 50 22 C54 22 58 24 60 30 C56 28 44 28 40 30Z', '#b0905a', 'stroke="#6a5430" stroke-width=".6"');
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
      // seen from below at an angle: the long dagger hull, its stepped superstructure and
      // bridge tower, red running lights, and the axial planet-killer cannon glowing under it
      + P('M2 20 L80 6 L98 10 L96 16 L62 30 L6 26Z', '#16141c', 'stroke="#3a3648" stroke-width=".7"') + P('M2 20 L80 6 L98 10 L60 18Z', '#2a2632')
      + P('M60 8 L84 4 L90 7 L66 11Z', '#24202c', 'stroke="#3a3648" stroke-width=".5"') + R(78, 0, 8, 5, '#24202c') + R(76, 0, 12, 1.6, '#3a3648')
      + [[12, 23], [24, 22], [36, 21], [48, 20], [60, 19]].map(([x, y]) => L(x, y, x + 8, y + 1.2, '#3a3648', 0.5)).join('')
      + [[20, 24], [40, 23.4], [70, 16], [88, 12]].map(([x, y]) => C(x, y, 0.5, '#ff4a4a')).join('')
      + R(46, 26, 10, 4, '#2a2632', 'rx="1"') + glow('#ff2a3a', E(51, 31, 4.4, 2, '#ff4a4a') + E(51, 31, 2, 1, '#ffd0d0'), 4)
      + P('M70 2 L84 0 L80 4Z M8 8 L20 6 L16 10Z', '#16141c', 'opacity=".7"')
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

  // ---------- Hoth main boss (2.4 portrait): Imperial Star Destroyer ----------
  // Over Hoth, nose down the card: the arrowhead hull in full detail, its
  // centre spine and side trenches, rows of turbolaser turrets and plating,
  // the stepped superstructure with the bridge tower and twin shield domes,
  // the glowing ventral hangar, three main engines, and a TIE escort.
  add('star_destroyer_24', () => {
    const [hullL, hl] = LG([[0, '#e8ecf0'], [1, '#9aa2ac']], 0, 0, 1, 0);
    const [hullR, hr] = LG([[0, '#b8bec6'], [1, '#6a727c']], 0, 0, 1, 0);
    const [hoth, hd] = RG([[0, '#f4f8fc'], [0.7, '#b8d0e4'], [1, '#6a8aa8']], 0.35, 0.35, 0.8);
    const rows = [];
    for (let y = 30; y < 86; y += 5) {
      const w = (y - 10) * 0.42;
      for (let k = 1; k < 5; k++) {
        const x1 = 50 - (w * k) / 5;
        const x2 = 50 + (w * k) / 5;
        rows.push(R(x1 - 1.2, y, 2.4, 1.2, '#7a828c', 'opacity=".8"') + R(x2 - 1.2, y, 2.4, 1.2, '#5a626c', 'opacity=".8"'));
      }
    }
    return hd + hl + hr + R(0, 0, 100, 100, '#05070e') + stars(41, 60, 100)
      + C(84, 16, 13, hoth) + P('M74 12 Q84 8 94 13 M73 19 Q84 16 95 20', 'none', 'stroke="#ffffff" stroke-width=".8" opacity=".6"')
      // the arrowhead hull: lit port side, shaded starboard side, centre spine
      + P('M50 6 L14 90 L50 84Z', hullL, 'stroke="#3a3e46" stroke-width=".7"') + P('M50 6 L86 90 L50 84Z', hullR, 'stroke="#3a3e46" stroke-width=".7"')
      + P('M50 6 L46 40 L50 84 L54 40Z', '#c8ced6', 'stroke="#5a626c" stroke-width=".5"') + L(50, 8, 50, 82, '#7a828c', 0.5)
      // side trenches and plating rows
      + L(50, 12, 22, 82, '#6a727c', 0.8) + L(50, 12, 78, 82, '#3a4048', 0.8) + L(50, 20, 30, 80, '#8a929c', 0.5) + L(50, 20, 70, 80, '#4a525c', 0.5)
      + rows.join('')
      // turbolaser batteries along the edges
      + [24, 34, 44, 54, 64, 74].map((y) => { const dx = (y - 6) * 0.43; return C(50 - dx + 1.6, y, 0.9, '#4a525c') + C(50 + dx - 1.6, y, 0.9, '#3a4048'); }).join('')
      // the stepped superstructure, bridge tower and shield domes
      + P('M40 62 L60 62 L58 80 L42 80Z', '#b8bec6', 'stroke="#3a4048" stroke-width=".6"') + P('M43 56 L57 56 L56 64 L44 64Z', '#d0d6dc', 'stroke="#3a4048" stroke-width=".6"')
      + R(45, 50, 10, 7, '#c0c6ce', 'stroke="#3a4048" stroke-width=".6"') + R(41, 48, 18, 3, '#9aa2ac', 'stroke="#3a4048" stroke-width=".5"') + R(42, 49, 16, 0.8, '#ffe8a0', 'opacity=".7"')
      + C(44, 46, 2.2, '#dfe4ea', 'stroke="#3a4048" stroke-width=".5"') + C(56, 46, 2.2, '#9aa2ac', 'stroke="#3a4048" stroke-width=".5"')
      + [66, 70, 74].map((y) => L(43, y, 57, y, '#6a727c', 0.5)).join('')
      // the ventral hangar glow and three main engines
      + R(46, 30, 8, 10, '#1a2030', 'rx="1"') + R(47, 31, 6, 8, '#5fa8ff', 'opacity=".35"')
      + glow('#7ac8ff', C(41, 87, 3.2, '#bfe4ff') + C(50, 88, 4.2, '#e8f6ff') + C(59, 87, 3.2, '#bfe4ff') + C(34, 86, 1.6, '#9fd8ff') + C(66, 86, 1.6, '#9fd8ff'), 4)
      // TIE fighter escort
      + [[18, 30, 0.7], [80, 44, 0.6], [24, 58, 0.5], [86, 70, 0.6]].map(([x, y, sc]) => `<g transform="translate(${x} ${y}) scale(${sc})">${R(-3, -0.4, 6, 0.8, '#8a929c')}${R(-3.6, -2.6, 1, 5.2, '#5a626c')}${R(2.6, -2.6, 1, 5.2, '#5a626c')}${C(0, 0, 1.2, '#9aa2ac')}</g>`).join('');
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
