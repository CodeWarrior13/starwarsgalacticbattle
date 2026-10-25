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
      + '<g transform="translate(0 1.8)">'
      + P('M36.6 44 C36 28 42 20.6 50 20.6 C58 20.6 64 28 63.4 44 C61.4 39.4 56.6 36 50 36 C43.4 36 38.6 39.4 36.6 44Z', '#9a1420')
      + P('M38.4 43.6 C40.8 39.6 45 37.4 50 37.4 C55 37.4 59.2 39.6 61.6 43.6 L61 45.4 C58.6 42 54.6 40.4 50 40.4 C45.4 40.4 41.4 42 39 45.4Z', '#000', 'opacity=".4"')
      + '<path d="M36.6 44 C36 28 42 20.6 50 20.6 C58 20.6 64 28 63.4 44 M37 43 C39 38.6 44 36 50 36 C56 36 61 38.6 63 43" stroke="#d23a42" stroke-width=".9" fill="none" opacity=".7"/><path d="M44 22 Q50 20.4 56 22" stroke="#5a060c" stroke-width=".7" fill="none"/>'
      + '</g>'
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
  // From the reference: the white helmet with its ridge, dark polarised
  // goggles set into the faceplate, the angular breath mask below them, and
  // the cloth hood falling from the back and sides of the helmet over the
  // shoulders. Padded white suit, chest control box, shoulder bells, tan belt
  // pouches. Behind him the Battle of Hoth: AT-ATs striding over the snow,
  // the Rebel trench line with its turrets, the ion cannon and the shield
  // generator, snowspeeders and blaster fire.
  add('snowtrooper', () => {
    const [cloth, cd] = LG([[0, '#f2f4f6'], [1, '#c4ccd4']], 0, 0, 1, 0);
    const [suit, sud] = LG([[0, '#f6f7f8'], [1, '#d0d6dc']], 0, 0, 1, 0);
    const [helm, hmd] = LG([[0, '#ffffff'], [0.6, '#eef1f4'], [1, '#c4ccd4']], 0, 0, 1, 1);
    const [sky, skd] = LG([[0, '#6a809a'], [0.6, '#aabccc'], [1, '#dce6ee']]);
    // An AT-AT facing left: boxy body with panel lines, segmented neck, the
    // wedge head with its chin cannons, and four jointed legs on round feet.
    const atat = (x, y, sc, c, dk, stride) => {
      const leg = (lx, k) => { const kx = lx + (k ? 1.2 : -1.2); return L(lx, 12, kx, 22, dk, 2.6) + L(kx, 22, lx + (k ? -0.6 : 0.6), 32, dk, 2.2) + C(kx, 22, 1.5, c) + E(lx + (k ? -0.6 : 0.6), 33, 2.6, 1.1, dk); };
      return `<g transform="translate(${x} ${y}) scale(${sc})">`
        + leg(8, stride) + leg(27, !stride)
        + P('M4 2 L30 0 L34 4 L33 12 L3 13 L0 7Z', c, `stroke="${dk}" stroke-width=".5"`) + P('M4 2 L30 0 L34 4 L2 5Z', '#ffffff', 'opacity=".12"')
        + L(1, 8, 33.4, 7, dk, 0.4) + [10, 16, 22].map((px) => L(px, 1.4, px, 12.6, dk, 0.35)).join('') + R(12, 9, 6, 2, dk, 'opacity=".5"')
        + [0, 1, 2].map((k) => R(-2.6 + k * 1.2, 5 - k * 0.2, 1.4, 4.4, dk, 'rx=".3"')).join('')
        + P('M-14 4 L-3 2.6 L-1.4 8 L-5 12.4 L-14 11Z', c, `stroke="${dk}" stroke-width=".5"`) + L(-13, 7, -3, 6.4, dk, 0.4) + R(-11, 4.6, 3, 1, '#1a1e24')
        + R(-19, 9, 6, 1, dk) + R(-18, 11, 5, 0.8, dk) + R(-16, 6, 4, 0.7, dk)
        + leg(4, !stride) + leg(23, stride) + '</g>';
    };
    return skd + cd + sud + hmd + R(0, 0, 100, 100, sky)
      // mountains with snow on their flanks
      + P('M0 46 L12 34 L20 40 L34 26 L46 38 L58 30 L72 40 L86 28 L100 38 L100 60 L0 60Z', '#64788e') + P('M12 34 L16 37.6 L13 37 L10 36Z M34 26 L39 31 L35 30 L31 29Z M58 30 L62 33.4 L57 32.6Z M86 28 L91 33 L86 32 L82 31Z', '#eef4f8')
      + P('M0 54 L18 46 L30 52 L46 44 L62 52 L80 46 L100 54 L100 64 L0 64Z', '#c4d2de')
      // the shield generator and the ion cannon on the far ridge
      + E(84, 50, 7, 4, '#8a96a4') + R(77, 50, 14, 2.4, '#7a8694') + `<g transform="rotate(-14 84 48)">${E(84, 44, 8, 2, '#9aa8b8', 'stroke="#6a7686" stroke-width=".4"')}${L(84, 44, 84, 40, '#6a7686', 0.6)}</g>`
      + C(68, 50, 3.4, '#8a96a4') + R(64.6, 50, 6.8, 3, '#7a8694') + glow('#7ad8ff', C(68, 50, 1.2, '#cff4ff'), 2)
      // three AT-ATs striding in, the nearest one firing
      + atat(4, 36, 0.62, '#7a8494', '#4a5464', true) + atat(40, 42, 0.42, '#8a94a4', '#5a6474', false) + atat(70, 44, 0.32, '#98a2b0', '#6a7484', true)
      + glow('#ff4a2a', L(-7, 41, 0, 47, '#ff6a4a', 0.5))
      // snowspeeders banking, one trailing a tow cable round a walker's legs
      + `<g transform="translate(62 20) rotate(-12)">${P('M-8 0 L6 -2 L10 0 L6 2Z', '#e8ecf0')}${P('M-6 -1 L-9 -5 L-5 -1Z M-6 1 L-9 5 L-5 1Z', '#d8dee4')}${R(-1, -1, 4, 2, '#d0662a')}${C(-9, 0, 1, '#ff8a3a')}</g>`
      + `<g transform="translate(30 30) rotate(8) scale(.7)">${P('M-8 0 L6 -2 L10 0 L6 2Z', '#e8ecf0')}${P('M-6 -1 L-9 -5 L-5 -1Z M-6 1 L-9 5 L-5 1Z', '#d8dee4')}${C(-9, 0, 1, '#ff8a3a')}</g>`
      + P('M26 31 C20 40 12 52 8 54 C10 50 14 48 16 52', 'none', 'stroke="#3a4048" stroke-width=".3" opacity=".7"')
      + bolt(90, 52, 80, 56, '#3aff6a') + bolt(20, 60, 4, 50, '#3aff6a')
      // explosions and smoke over the battlefield
      + [[52, 56, 5], [16, 60, 4], [88, 62, 3]].map(([x, y, r]) => glow('#ff8a2a', C(x, y, r, '#ffb04a', 'opacity=".75"') + C(x, y, r * 0.5, '#fff0b0'), 3) + puffs('#3a4250', 0.55, [[x - 1, y - r * 1.6, r * 1.8, r * 1.2]])).join('')
      // the Rebel trench line: sandbagged snow wall, a turret and soldiers
      + R(0, 64, 100, 36, '#eef4f8') + P('M0 68 L100 64 L100 72 L0 76Z', '#c8d4de') + [4, 14, 24, 34, 70, 80, 90].map((x) => E(x, 68.6 - x * 0.04, 5, 2.4, '#e8eef4', 'stroke="#a8b4c0" stroke-width=".4"')).join('')
      + `<g transform="translate(76 62)">${R(-4, -2, 8, 5, '#7a848e', 'rx="1"')}${C(0, -2, 3, '#8a929c')}${L(-1, -3, -12, -7, '#5a646e', 1.4)}${L(-1, -2, -12, -5.6, '#5a646e', 1.2)}</g>` + bolt(64, 55, 46, 48, '#ff3a2a')
      + [[12, 65], [22, 64.6], [86, 62.6]].map(([x, y]) => `<g transform="translate(${x} ${y}) scale(.5)">${C(0, -4, 1.6, '#c8b490')}${P('M-2 -2.6 L2 -2.6 L2.4 3 L-2.4 3Z', '#d8ccb0')}${L(1.6, -1.6, 6, -3, '#2a2a2e', 0.8)}</g>`).join('')
      + P('M0 76 Q30 70 60 76 T100 74 V100 H0Z', '#ffffff') + embers(31, 26, '#ffffff')
      // padded suit, shoulder bells and the long kama
      + P('M4 100 C6 86 16 76 32 73 L68 73 C84 76 94 86 96 100Z', suit, 'stroke="#8a96a4" stroke-width=".7"')
      + mirror(P('M6 92 C8 82 16 76 27 74 L32 82 C23 85 17 90 15 97Z', '#fbfcfd', 'stroke="#8a96a4" stroke-width=".7"') + '<path d="M12 88 Q18 82 26 80" stroke="#c8d0d8" stroke-width=".8" fill="none"/>')
      + '<path d="M22 100 Q24 92 24 86 M78 100 Q76 92 76 86 M30 100 Q31 94 31 88 M70 100 Q69 94 69 88" stroke="#c8d0d8" stroke-width=".8" fill="none"/>'
      // chest control box, belt and tan pouches
      + R(40, 80, 20, 9, '#eef1f4', 'rx="1.4" stroke="#8a96a4" stroke-width=".6"') + R(42, 82, 6, 4.4, '#3a3d45', 'rx=".6"') + R(43, 83, 4, 2.4, '#c8ccd2') + [51, 53.4, 55.8].map((x, i) => R(x, 82, 1.6, 4.4, i ? '#e8ecf0' : '#d02a2a', 'stroke="#5a646e" stroke-width=".3"')).join('')
      + R(30, 92, 40, 3, '#e8ecf0', 'stroke="#8a96a4" stroke-width=".5"') + mirror(R(30, 93, 9, 7, '#c8ae80', 'rx="1" stroke="#7a6a4a" stroke-width=".5"'))
      // the cloth hood: falls from the back and sides of the helmet and spreads over the shoulders
      + P('M33 40 C31 52 28 64 22 76 C32 80 42 78 46 74 L54 74 C58 78 68 80 78 76 C72 64 69 52 67 40Z', cloth, 'stroke="#8a96a4" stroke-width=".8"')
      + '<path d="M34 50 Q31 62 26 74 M38 56 Q36 66 33 77 M62 56 Q64 66 67 77 M66 50 Q69 62 74 74" stroke="#aab4be" stroke-width=".7" fill="none"/>'
      + P('M40 58 C42 66 44 70 46 74 L54 74 C56 70 58 66 60 58Z', '#dfe4ea', 'stroke="#a8b2bc" stroke-width=".5"') + '<path d="M44 64 Q50 66 56 64 M45 69 Q50 71 55 69" stroke="#b8c2cc" stroke-width=".5" fill="none"/>'
      // the helmet: rounded top with its ridge, brow and side panels
      + P('M34 44 C33 27 41 19 50 19 C59 19 67 27 66 44 L64 50 L36 50Z', helm, 'stroke="#6a7686" stroke-width="1"')
      + shade('M50 19 C59 19 67 27 66 44 L64 50 L50 50Z', 0.07) + E(42, 25, 6, 2.4, '#fff', 'transform="rotate(-24 42 25)"')
      + '<path d="M50 20 L50 34" stroke="#d8dee4" stroke-width="2"/><path d="M50 20 L50 34" stroke="#8a96a4" stroke-width=".4"/>'
      + '<path d="M35 34 Q50 30 65 34" stroke="#aab4be" stroke-width="1" fill="none"/>' + mirror(P('M34.6 42 L38 41 L38.6 49 L36 50Z', '#dde2e8', 'stroke="#8a96a4" stroke-width=".4"'))
      // the dark goggles set into the faceplate
      + P('M37.6 37.4 C42 35.6 58 35.6 62.4 37.4 L61.4 44 C56 45.6 44 45.6 38.6 44Z', '#c8d0d8', 'stroke="#6a7686" stroke-width=".6"')
      + mirror(P('M39.4 38.6 C42 37.6 46 37.6 48.4 38.4 L48 43.4 C45.4 44.2 42 44 40 43Z', '#0a0b0e') + P('M40.4 39.4 C42.4 38.8 45 38.8 47 39.2 L46.8 40.2 C44.6 39.8 42.4 40 40.6 40.6Z', '#5a7aaa', 'opacity=".7"'))
      // the breath mask: a raised snout running down from between the goggles,
      // its dark recessed grille with vertical slits, and the rounded chin
      + P('M43.4 45 L56.6 45 L55.4 52 C54.6 55.6 52.6 57.4 50 57.6 C47.4 57.4 45.4 55.6 44.6 52Z', helm, 'stroke="#6a7686" stroke-width=".7"')
      + P('M48.4 44 L51.6 44 L51.2 50 L48.8 50Z', '#e2e7ec', 'stroke="#9aa6b2" stroke-width=".4"') + shade('M50 44 L56.6 45 L55.4 52 C54.6 55.6 52.6 57.4 50 57.6Z', 0.08)
      + P('M45.8 50.4 L54.2 50.4 L53.4 54.6 C52 55.8 48 55.8 46.6 54.6Z', '#2e323a', 'stroke="#6a7686" stroke-width=".4"') + [47.4, 48.6, 49.8, 51, 52.2].map((x) => L(x + 0.2, 51, x + 0.2, 54.8, '#9aa6b2', 0.35)).join('')
      + mirror(P('M44.2 46.4 L46.6 46.8 L46.2 49.2 L44.6 48.6Z', '#3a3e46'))
      // the cloth hood wrapping in around the face: it tucks under the helmet's sides,
      // closes in round the mask and falls away from under the mouth slit
      + mirror(P('M35.4 44 C38.6 47 42.4 50.6 44.8 53.4 C46.4 56.2 48.2 57.8 50 58.4 L50 63.4 C43.4 62.6 37.6 58 34.4 50.6Z', cloth, 'stroke="#8a96a4" stroke-width=".6"')
        + P('M36.4 48 C39 52 42.6 56 47 59.4 M35.4 51.4 C38 55.6 42 59.6 47.6 61.8', 'none', 'stroke="#aab4be" stroke-width=".5"') + P('M44.8 53.4 C46.4 56.2 48.2 57.8 50 58.4', 'none', 'stroke="#000" stroke-width=".8" opacity=".12"'))
      + P('M47 58.6 C47.8 63 47.2 67 45.4 71 M53 58.6 C52.2 63 52.8 67 54.6 71 M50 59 L50 72', 'none', 'stroke="#aab4be" stroke-width=".6"')
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
    const fern = (x, y, sc, c) => `<g transform="translate(${x} ${y}) scale(${sc})">` + [-60, -30, 0, 30, 60].map((a) => `<g transform="rotate(${a})"><path d="M0 0 Q1 -6 0 -12" stroke="${c}" stroke-width=".8" fill="none"/>${[2, 4, 6, 8, 10].map((k) => `<path d="M0 ${-k} l-2.4 -1.2 M0 ${-k} l2.4 -1.2" stroke="${c}" stroke-width=".6"/>`).join('')}</g>`).join('') + '</g>';
    const tree = (x, w, c, lit, fogA) => R(x, 0, w, 100, c) + [0.2, 0.45, 0.7].map((k) => L(x + w * k, 0, x + w * k + 0.8, 100, '#160c04', 0.6)).join('') + R(x + w * 0.08, 0, w * 0.18, 100, lit, 'opacity=".45"') + (fogA ? R(x, 0, w, 100, '#9ab8a0', `opacity="${fogA}"`) : '');
    return hd + bd + fd + R(0, 0, 100, 100, fog)
      // misty depth: pale far trunks, then the middle row
      + [[14, 2], [36, 1.6], [52, 2.4], [62, 1.4], [78, 2]].map(([x, w]) => R(x, 0, w, 84, '#4a6a50', 'opacity=".6"')).join('') + R(0, 0, 100, 84, '#a8c8a8', 'opacity=".1"')
      + [[30, 0, 40, 100], [58, 0, 66, 100], [76, 0, 80, 100]].map(([a, b, c, d]) => P(`M${a} ${b} L${a + 6} ${b} L${c + 8} ${d} L${c - 2} ${d}Z`, '#e8f4c8', 'opacity=".09"')).join('')
      + tree(22, 4, '#3a2a1a', '#6a4a2a', 0.18) + tree(44, 5, '#3a2a1a', '#6a4a2a', 0.18) + tree(70, 4, '#3a2a1a', '#6a4a2a', 0.18)
      // the Ewok village: walkways between the trunks, a second hut and lanterns, hanging vines
      + R(44, 30, 30, 1.4, '#4a3018') + P('M44 31.4 Q59 35 74 31.4', 'none', 'stroke="#6a4a2a" stroke-width=".5"') + [48, 54, 60, 66].map((x) => L(x, 31.4, x, 33, '#6a4a2a', 0.4)).join('')
      + `<g transform="translate(66 18) scale(.7)">${R(-2, 16, 20, 2, '#4a3018')}${P('M0 16 L2 8 L8 4 L14 8 L14 16Z', '#6a4a2a')}${P('M0 8 L8 2 L16 8Z', '#8a6a3a')}${C(7, 12, 1, '#ffb04a')}</g>`
      + [[47, 33], [71, 33], [26, 40]].map(([x, y]) => L(x, y - 2, x, y + 1, '#3a2a1a', 0.3) + glow('#ffb04a', C(x, y + 1.6, 0.8, '#ffd08a'), 1.6)).join('')
      + [[30, 0, 18], [52, 0, 12], [80, 0, 22], [12, 0, 10]].map(([x, y, l]) => P(`M${x} ${y} Q${x + 1} ${y + l / 2} ${x - 0.6} ${y + l}`, 'none', 'stroke="#4a7a3a" stroke-width=".6" opacity=".8"')).join('')
      + tree(2, 12, '#2a1a0c', '#6a4a2a', 0) + tree(86, 13, '#2a1a0c', '#6a4a2a', 0)
      // Ewok huts on a platform up in the trees, with a rope bridge
      + R(4, 22, 18, 2, '#4a3018') + `<g>${P('M6 22 L8 14 L14 10 L20 14 L20 22Z', '#6a4a2a')}${P('M6 14 L14 8 L22 14Z', '#8a6a3a')}${C(12, 18, 1, '#ffb04a')}</g>` + P('M22 22 Q34 26 44 22', 'none', 'stroke="#6a4a2a" stroke-width=".8"')
      // another scout racing past in the distance
      + `<g transform="translate(60 52) scale(.45)">${P('M-20 2 L16 0 L20 4 L-16 6Z', '#8a5030')}${L(-20, 2, -34, 0, '#3a2a1a', 1)}${R(-38, -2, 4, 4, '#8a5030')}${R(-6, -8, 6, 8, '#e8eaee', 'rx="2"')}${C(-3, -10, 2.4, '#f4f6f8')}${R(-5, -11, 4, 1.2, '#14161a')}</g>` + P('M66 54 L80 53', 'none', 'stroke="#d8f0c8" stroke-width=".4" opacity=".4"')
      + R(0, 84, 100, 16, '#1e3a1c') + E(20, 86, 10, 2, '#2a4a24') + E(80, 86, 12, 2, '#2a4a24')
      + [[6, 96, 1.1, '#3a7a2a'], [26, 99, 1, '#4a8a3a'], [74, 99, 1, '#4a8a3a'], [94, 94, 1.2, '#3a7a2a']].map(([x, y, sc, c]) => fern(x, y, sc, c)).join('')
      // the 74-Z speeder bike, rust brown as in the photo: the long thin forks
      // out front with the steering vanes, the slim body with the seat, the
      // handlebars and the dark rear engine with its exhaust
      + L(64, 66, 20, 60, '#2a2420', 1.2) + L(64, 70, 20, 64.4, '#2a2420', 1.2) + L(40, 63, 40, 67, '#2a2420', 0.6)
      + P('M14 55 L24 56.4 L24 63 L14 61.6Z', bike, 'stroke="#2a1608" stroke-width=".5"') + P('M15 61.6 L25 63 L25 69 L15 67.6Z', bike, 'stroke="#2a1608" stroke-width=".5"') + L(16, 58, 22, 58.8, '#3a1e0e', 0.4) + L(17, 64.6, 23, 65.4, '#3a1e0e', 0.4)
      + P('M60 64 L84 58 L96 60 L100 64 L100 74 L92 78 L62 76Z', bike, 'stroke="#2a1608" stroke-width=".8"') + P('M64 64.4 L84 59.4 L94 61 L66 68Z', '#c0804e', 'opacity=".55"')
      + P('M72 61 L86 57.6 L90 58.4 L76 62.6Z', '#2a1a12') + R(70, 66, 18, 4, '#5a2e16', 'rx="1"') + [74, 78, 82].map((x) => L(x, 66.4, x, 69.6, '#2a1608', 0.4)).join('')
      + L(66, 62, 62, 55, '#1a1612', 1.3) + L(66, 62, 70, 55.6, '#1a1612', 1.3) + L(60, 55, 72, 55.6, '#1a1612', 1.2)
      + R(88, 64, 12, 12, '#2a2420', 'rx="1.4"') + [67, 70, 73].map((y) => L(89, y, 99, y, '#4a3e36', 0.5)).join('') + glow('#ff8a3a', C(99.4, 70, 1.4, '#ffb04a'), 2)
      + '<path d="M64 72 L90 69 M66 75 L88 72.6" stroke="#3a1e0e" stroke-width=".5"/>'
      // From the photos: black undersuit, the white chest plate over the boxy
      // belly plate, rounded shoulder bells, white bicep plates on black
      // sleeves, the belt with its box, and a hold-out blaster in his glove
      + P('M8 100 C10 84 22 74 38 70 L62 70 C78 74 90 84 92 100Z', '#141518', 'stroke="#000" stroke-width=".5"')
      + mirror(P('M18 84 C19 77 25 72.6 33 72 L37 79 C31 80 27 83 25 88 C22 88 19 87 18 84Z', helm, 'stroke="#2a2c30" stroke-width=".7"') + P('M20 81 C22 77 26 75 31 74.4', 'none', 'stroke="#ffffff" stroke-width=".6"')
        + P('M16 92 C16 89 18 88 22 88 L26 89 L25 97 L17 97Z', helm, 'stroke="#2a2c30" stroke-width=".6"') + L(17.6, 92, 25, 92.4, '#9aa3ad', 0.4))
      + P('M36 70.4 C42 68.6 58 68.6 64 70.4 L63 80.6 L37 80.6Z', helm, 'stroke="#2a2c30" stroke-width=".7"') + L(50, 70, 50, 80.6, '#9aa3ad', 0.6) + mirror(P('M38.6 72 L46 71.2 L46.4 78.6 L39 79Z', 'none', 'stroke="#c8ccd2" stroke-width=".5"'))
      + R(35, 81.4, 30, 12.4, helm, 'rx="1.6" stroke="#2a2c30" stroke-width=".7"') + L(36, 85.6, 64, 85.6, '#9aa3ad', 0.5) + L(36, 89.6, 64, 89.6, '#9aa3ad', 0.5) + R(46, 82.6, 8, 2.2, '#c8ccd2', 'rx=".4"') + shade('M50 81.4 L65 81.4 L65 93.8 L50 93.8Z', 0.1)
      + R(30, 94.4, 40, 3.6, '#eceef1', 'stroke="#2a2c30" stroke-width=".5"') + R(45, 94, 10, 4.6, '#d8dce0', 'rx=".6" stroke="#2a2c30" stroke-width=".5"') + R(47, 95.2, 6, 2.2, '#3a3e44', 'rx=".4"')
      + P('M44 62 L56 62 L58 70 L42 70Z', '#141518')
      // the helmet: domed top flaring down behind the cheeks
      + P('M35.4 37 L34.4 52 C34.4 58.6 38.4 62.6 43 63.4 L57 63.4 C61.6 62.6 65.6 58.6 65.6 52 L64.6 37Z', helm, 'stroke="#2a2c30" stroke-width=".9"')
      + P('M36 38 L36 25 C36 18.6 42.4 15.4 50 15.4 C57.6 15.4 64 18.6 64 25 L64 38Z', helm, 'stroke="#2a2c30" stroke-width="1"') + E(43.6, 21.4, 4.4, 1.6, '#fff', 'transform="rotate(-18 43.6 21.4)"') + L(50, 16, 50, 34, '#d0d4da', 1.2)
      + shade('M50 15.4 C57.6 15.4 64 18.6 64 25 L64 38 L65.6 52 C65.6 58.6 61.6 62.6 57 63.4 L50 63.4Z', 0.1)
      // the brim: a squared peak jutting out over the visor, with its top, front edge and shadow
      + P('M34.4 35.4 L65.6 35.4 L63.8 39.6 L36.2 39.6Z', '#f4f6f8', 'stroke="#2a2c30" stroke-width=".8"') + P('M36.2 39.6 L63.8 39.6 L63.4 41.2 L36.6 41.2Z', '#aab0b8', 'stroke="#2a2c30" stroke-width=".5"')
      + L(36, 36.4, 64, 36.4, '#ffffff', 0.5) + shade('M50 35.4 L65.6 35.4 L63.8 39.6 L50 39.6Z', 0.08)
      // the black visor like a pair of sunglasses, glossy, in the brim's shadow
      + (() => { const [gl, gd] = LG([[0, '#000000'], [0.45, '#141a26'], [0.55, '#2a3a52'], [1, '#05070a']], 0, 0, 1, 0.4); return gd + P('M37 41.2 L63 41.2 L62.2 47 L56.4 48.2 L54.6 58 L45.4 58 L43.6 48.2 L37.8 47Z', gl, 'stroke="#000" stroke-width=".5"'); })()
      + P('M37.2 41.2 L62.8 41.2 L62.6 42.8 L37.4 42.8Z', '#000', 'opacity=".55"')
      + mirror(P('M39.4 44.6 L44.6 43.6 L45 44.6 L39.8 45.8Z', '#8ab0d8', 'opacity=".55"') + P('M40.4 46.6 L42.8 46.2', 'none', 'stroke="#c8e0ff" stroke-width=".4" opacity=".5"'))
      + P('M48.2 41.2 L51.8 41.2 L52.8 54.6 L47.2 54.6Z', helm, 'stroke="#2a2c30" stroke-width=".5"') + L(50, 38.8, 50, 53, '#b8bec6', 0.5)
      // the long snout ending in the breather
      + P('M45.6 53.6 L54.4 53.6 L55.6 60.6 C55 64.4 45 64.4 44.4 60.6Z', helm, 'stroke="#2a2c30" stroke-width=".7"') + E(50, 60.4, 3.4, 2.2, '#1e2024') + [48.4, 50, 51.6].map((x) => L(x, 58.8, x, 62, '#8a929c', 0.4)).join('')
      + mirror(R(36.6, 49.6, 3.4, 6, '#2a2c30', 'rx=".6"') + [51.4, 53.2].map((y) => L(37, y, 39.6, y, '#6a727c', 0.35)).join(''))
      // hold-out blaster in his black glove
      + `<g transform="translate(80 92) rotate(-30)">${R(-2, -2, 14, 4, '#141518', 'rx="1"')}${R(10, -1.2, 5, 2.4, '#141518')}${R(0, 1.6, 3.4, 5, '#141518', 'rx=".8"')}</g>` + E(80, 94, 3.6, 3, '#0c0d10');
  });

  // ---------- Endor optional boss: AT-ST Walker ----------
  // Drawn from the reference photos: the boxy armoured head in three-quarter
  // view (sloped front with two viewports, flat side with the round
  // concussion-grenade drum, roof plates and hatch), twin chin blasters, the
  // neck joint and waist gearbox, long jointed legs with pistons, and clawed
  // feet planted in the forest floor. Endor's redwoods in layers of mist
  // with light shafts, and an Ewok in the ferns.
  add('atst', () => {
    const [front, fd] = LG([[0, '#c8ced6'], [1, '#7a828c']]);
    const [side, sdd] = LG([[0, '#9aa2ac'], [1, '#5a626c']], 0, 0, 1, 0);
    const [leg, ld] = LG([[0, '#aab2bc'], [0.5, '#7a828c'], [1, '#4a525c']], 0, 0, 1, 0);
    const [sky, skd] = LG([[0, '#9ab8a0'], [0.5, '#4e7a58'], [1, '#1e3a22']]);
    const [floor, fld] = LG([[0, '#2a4a24'], [1, '#14260f']]);
    // a leg segment as an armoured plate with an outline
    const plate = (x1, y1, x2, y2, w1, w2, c) => {
      const dx = x2 - x1; const dy = y2 - y1; const l = Math.hypot(dx, dy); const nx = -dy / l; const ny = dx / l;
      const q = (x, y, w, k) => `${(x + nx * w * k).toFixed(1)} ${(y + ny * w * k).toFixed(1)}`;
      return P(`M${q(x1, y1, w1, 0.5)} L${q(x2, y2, w2, 0.5)} L${q(x2, y2, w2, -0.5)} L${q(x1, y1, w1, -0.5)}Z`, c, 'stroke="#22282e" stroke-width=".8" stroke-linejoin="round"')
        + L(x1 + nx * w1 * 0.3, y1 + ny * w1 * 0.3, x2 + nx * w2 * 0.3, y2 + ny * w2 * 0.3, '#d8dee4', 0.5, 'opacity=".6"');
    };
    const joint = (x, y, r) => C(x, y, r, '#6a727c', 'stroke="#22282e" stroke-width=".8"') + C(x, y, r * 0.55, '#4a525c') + C(x, y, r * 0.22, '#22282e');
    const foot = (x, y, c) => E(x, y + 3.6, 13, 2.2, '#000', 'opacity=".5"')
      + P(`M${x - 9} ${y + 3.4} L${x - 7} ${y - 1} L${x + 7} ${y - 1} L${x + 10} ${y + 3.4} L${x + 6} ${y + 2.4} L${x + 4} ${y + 4} L${x} ${y + 2.6} L${x - 4} ${y + 4} L${x - 6} ${y + 2.4}Z`, c, 'stroke="#22282e" stroke-width=".7" stroke-linejoin="round"')
      + R(x - 4.4, y - 4.4, 8.8, 4, '#5a626c', 'rx="1" stroke="#22282e" stroke-width=".6"') + L(x - 6, y + 0.6, x + 7, y + 0.6, '#9aa2ac', 0.5)
      + P(`M${x - 11} ${y + 4} q2 -2 4 0 M${x + 8} ${y + 4} q2 -2 4 0`, 'none', 'stroke="#3a6a2a" stroke-width="1"');
    // a redwood: bark ridges, a lit edge and flared roots
    const tree = (x, w, c, lit, fog) => {
      let t = R(x, 0, w, 100, c) + [0.2, 0.42, 0.63, 0.82].map((k) => P(`M${x + w * k} 0 C${x + w * k + 0.8} 30 ${x + w * k - 0.8} 60 ${x + w * k + 0.4} 100`, 'none', `stroke="#120a04" stroke-width="${(w * 0.05).toFixed(2)}" opacity=".7"`)).join('')
        + R(x + w * 0.08, 0, w * 0.14, 100, lit, 'opacity=".45"');
      t += P(`M${x - w * 0.4} 92 C${x - w * 0.1} 88 ${x} 80 ${x} 72 L${x + w} 72 C${x + w} 80 ${x + w * 1.1} 88 ${x + w * 1.4} 92Z`, c);
      return fog ? t + R(x - w * 0.4, 0, w * 1.8, 100, '#a8c8b0', `opacity="${fog}"`) : t;
    };
    const fern = (x, y, sc, c) => `<g transform="translate(${x} ${y}) scale(${sc})">` + [-60, -30, 0, 30, 60].map((a) => `<g transform="rotate(${a})"><path d="M0 0 Q1 -6 0 -12" stroke="${c}" stroke-width=".8" fill="none"/>${[2, 4, 6, 8, 10].map((k) => `<path d="M0 ${-k} l-2.4 -1.2 M0 ${-k} l2.4 -1.2" stroke="${c}" stroke-width=".6"/>`).join('')}</g>`).join('') + '</g>';
    return skd + fd + sdd + ld + fld + R(0, 0, 100, 100, sky)
      // far trees fading into the mist, then the middle row
      + [[8, 2.4], [16, 1.6], [34, 2], [44, 1.4], [52, 2.2], [70, 1.6], [78, 2.6], [96, 1.8]].map(([x, w]) => R(x, 0, w, 90, '#5a7a62', 'opacity=".55"')).join('')
      + R(0, 0, 100, 100, '#c8dccc', 'opacity=".18"')
      + tree(20, 4.4, '#3e2c1c', '#8a6a48', 0.28) + tree(48, 3.6, '#3e2c1c', '#8a6a48', 0.3) + tree(82, 4, '#3e2c1c', '#8a6a48', 0.26)
      // light shafts through the canopy
      + [[58, 0, 24], [70, 0, 18], [30, 0, 14]].map(([x, y, w]) => P(`M${x} ${y} L${x + w * 0.4} ${y} L${x - w * 0.4} 100 L${x - w * 1.1} 100Z`, '#fff8d8', 'opacity=".1"')).join('')
      // the near giants framing the walker
      + tree(-2, 11, '#2a1a0c', '#6a4a2a', 0) + tree(90, 13, '#2a1a0c', '#6a4a2a', 0)
      // canopy branches and hanging moss
      + P('M0 6 C14 10 24 4 36 9 L36 0 L0 0Z M64 0 C70 7 84 3 100 8 L100 0Z', '#1e3a1c', 'opacity=".9"')
      + [[12, 9, 8], [26, 6, 6], [74, 5, 7], [90, 8, 9]].map(([x, y, l]) => L(x, y, x + 0.4, y + l, '#4a7a3a', 0.6, 'opacity=".7"')).join('')
      // forest floor: mossy ground, a fallen log, ferns and roots
      + P('M0 80 C20 78 40 82 60 80 C80 78 92 81 100 80 L100 100 L0 100Z', floor)
      + P('M70 84 L100 80 L100 86 L72 89Z', '#3e2a18', 'stroke="#1a0f06" stroke-width=".5"') + E(71, 86.4, 1.6, 2.6, '#7a5a3a') + L(78, 85, 98, 82, '#5a3e24', 0.5)
      + [[4, 90, 1, '#4a8a3a'], [50, 99, 1, '#4a8a3a'], [90, 99, 1.2, '#3a7a2a'], [96, 88, 0.8, '#4a8a3a'], [52, 86, 0.6, '#3a6a2a']].map(([x, y, sc, c]) => fern(x, y, sc, c)).join('')
      + [[16, 84], [40, 86], [56, 83]].map(([x, y]) => E(x, y, 3, 0.8, '#5a8a4a', 'opacity=".6"')).join('')
      + puffs('#d8e8d0', 0.22, [[50, 88, 60, 8]])
      // far leg (left): thigh plate, reverse knee, shin, foot planted in the moss
      + plate(38, 52, 27, 69, 7, 5.6, leg) + plate(27, 69, 33, 86, 5.6, 4.8, leg) + L(34, 57, 29, 65, '#22282e', 1.2) + L(29, 73, 32, 82, '#22282e', 1)
      + joint(27, 69, 3.6) + foot(33, 87, '#4a525c')
      // near leg (right): bigger, with its pistons
      + plate(63, 51, 77, 67, 8.2, 6.6, leg) + plate(77, 67, 68, 86, 6.6, 5.6, leg) + L(66, 55, 74, 63, '#22282e', 1.6) + L(75, 72, 70, 82, '#22282e', 1.2) + L(73, 71, 68.6, 81, '#d8dee4', 0.6)
      + joint(77, 67, 4.4) + foot(68, 87, '#5a626c')
      // waist gearbox and hip actuators, the neck joint up into the head
      + P('M35 44 L65 43 L66 54 L36 55Z', '#3a4048', 'stroke="#1a1e24" stroke-width=".7"') + [40, 46, 52, 58].map((x) => L(x, 44.6, x + 0.3, 54.2, '#5a626c', 0.6)).join('') + P('M42 48 Q50 52 58 47', 'none', 'stroke="#1a1e24" stroke-width="1.2"')
      + R(44, 36, 12, 9, '#4a525c', 'stroke="#1a1e24" stroke-width=".7"') + R(46, 37, 2, 7, '#2a3038') + R(52, 37, 2, 7, '#2a3038') + L(41, 40, 44, 44, '#22282e', 1.2) + L(59, 40, 56, 44, '#22282e', 1.2)
      + joint(38, 52, 4.4) + joint(63, 51, 5)
      // the rear support: an armoured strut from the back of the head down into the waist
      + P('M60 30 L73 30 L68 45 L57 45Z', '#3a4048', 'stroke="#1a1e24" stroke-width=".7"') + L(62, 32, 59, 44, '#5a626c', 0.6) + L(70, 32, 65.6, 44, '#1a1e24', 0.8) + R(61, 37, 6, 2.2, '#5a626c', 'transform="rotate(-18 64 38)"')
      + `<g transform="translate(13 -1) scale(.74)">`
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
      + E(-2.6, -2, 1.7, 1.9, '#0c0806') + E(2.6, -2, 1.7, 1.9, '#0c0806') + C(-2.1, -2.6, 0.55, '#fff') + C(3.1, -2.6, 0.55, '#fff')
      + P('M-1.2 0.6 L1.2 0.6 L0 2Z', '#1a0f08') + '<path d="M-1.4 3 Q0 3.8 1.4 3" stroke="#3a2210" stroke-width=".5" fill="none"/>'
      + '</g>';
  });

  // ---------- Scarif opponent: Shoretrooper ----------
  // From your photos, shaded for depth: the smooth round dome, the sharp
  // flat-topped crest band, the jagged faceted cheek plates and rounded chin,
  // the dark visor band with its slot and the slotted breather. A slim
  // build in weathered sand armour over brown fatigues, just a stripe of
  // squad-leader blue, red armband, a compact E-22. Behind him the Battle of
  // Scarif: the Citadel, the landing pad with an AT-ACT, palms and bunkers,
  // rebels pinned down on the beach, a U-wing and X-wings under the shield gate.
  add('shoretrooper', () => {
    const [sand, sdd] = LG([[0, '#f0e2b6'], [0.55, '#cdb47e'], [1, '#9a8050']], 0, 0, 1, 1);
    const [sandD, sd2] = LG([[0, '#c8b07a'], [1, '#8a7046']], 0, 0, 1, 0);
    const [sky, skd] = LG([[0, '#4aa4d8'], [1, '#c8ecf6']]);
    const [tw, twd] = LG([[0, '#eef2f6'], [0.5, '#cfd5dc'], [1, '#8a929c']], 0, 0, 1, 0);
    const palm = (x, y, h, w) => P(`M${x} ${y} Q${x + 1.6} ${y - h * 0.5} ${x + 2} ${y - h}`, 'none', `stroke="#6a4a2a" stroke-width="${w}"`) + [...Array(5)].map((_, k) => { const a = -150 + k * 30; const r = (a * Math.PI) / 180; const ex = x + 2 + Math.cos(r) * h * 0.5; const ey = y - h + Math.sin(r) * h * 0.24 + h * 0.12; return P(`M${x + 2} ${y - h} Q${((x + 2 + ex) / 2).toFixed(1)} ${(y - h - h * 0.12).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`, 'none', `stroke="#2a7a4a" stroke-width="${w * 1.3}" stroke-linecap="round"`); }).join('') + C(x + 2, y - h + 0.6, w * 0.6, '#5a3a1a');
    const rebel = (x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})">${C(0, -5, 1.6, '#7a5a3a')}${P('M-2 -3.4 L2 -3.4 L2.4 2 L-2.4 2Z', '#6a6a4a')}${L(-1.4, 2, -2.4, 6, '#4a4a3a', 1)}${L(1.4, 2, 2.6, 6, '#4a4a3a', 1)}${L(1.6, -2.4, 6, -3.4, '#1a1a1e', 0.8)}</g>`;
    return skd + sdd + sd2 + twd + R(0, 0, 100, 100, sky)
      // the shield gate shimmering overhead, X-wings and a U-wing diving through
      + P('M0 6 Q50 -4 100 6', 'none', 'stroke="#bfe8ff" stroke-width="1.2" opacity=".55"') + P('M0 9 Q50 -1 100 9', 'none', 'stroke="#bfe8ff" stroke-width=".5" opacity=".35"')
      + `<g transform="translate(64 18) rotate(-10)">${P('M-10 0 L8 -1.6 L12 0 L8 1.6Z', '#c8ccd2')}${R(-4, -6, 2, 12, '#9aa2ac')}${R(-5, -6.4, 4, 1, '#9aa2ac')}${R(-5, 5.4, 4, 1, '#9aa2ac')}${E(-10.6, 0, 1.4, 1, '#ff8a3a')}</g>`
      + [[36, 12, 0.6], [84, 26, 0.5]].map(([x, y, sc]) => `<g transform="translate(${x} ${y}) scale(${sc})">${P('M-8 0 L8 -1 L10 0 L8 1Z', '#dfe4ea')}${L(-4, -1, -8, -6, '#c8ccd2', 1)}${L(-4, 1, -8, 6, '#c8ccd2', 1)}${L(-4, -1, -8, 5, '#c8ccd2', 0.6)}${L(-4, 1, -8, -5, '#c8ccd2', 0.6)}${C(-9, 0, 1, '#ff8a3a')}</g>`).join('')
      + glow('#ff3a2a', L(40, 13, 50, 15, '#ff6a4a', 0.4))
      // the Citadel: tapered tower with window bands, top deck and the big dish
      + P('M2 66 L7 22 L19 22 L24 66Z', tw, 'stroke="#6a727c" stroke-width=".5"')
      + [26, 32, 38, 44, 50, 56, 62].map((y) => { const w = 12 + (y - 22) * 0.23; const x0 = 13 - w / 2; return L(x0, y, x0 + w, y, '#7a828c', 0.4) + Array.from({ length: 5 }, (_, k) => R((x0 + 1 + k * (w - 2) / 5).toFixed(1), y + 1.2, 0.9, 0.7, k % 2 ? '#2a3a4a' : '#ffe8a0')).join(''); }).join('')
      + R(5, 18, 16, 4, '#b8bec6', 'stroke="#6a727c" stroke-width=".4"') + R(8, 14, 10, 4, '#cfd4da', 'stroke="#6a727c" stroke-width=".4"')
      + `<g transform="rotate(-18 13 9)">${E(13, 9, 8, 2.4, '#dfe4ea', 'stroke="#6a727c" stroke-width=".4"')}${E(13, 8.4, 6.4, 1.6, '#aab2bc')}${L(13, 8.4, 13, 3, '#6a727c', 0.5)}${C(13, 3, 0.5, '#ff4a4a')}</g>`
      // sea and surf
      + R(0, 54, 100, 12, '#2ba3b8') + '<path d="M0 58 Q12 56 24 58 T48 58 T72 58 T100 58 M0 62 Q16 60 32 62 T64 62 T100 62" stroke="#bfeef6" stroke-width=".6" fill="none"/>'
      // the landing pad and an AT-ACT: cargo box, cockpit head, long legs
      + R(60, 52, 40, 4, '#8a929c', 'stroke="#5a626c" stroke-width=".4"') + [64, 72, 80, 88, 96].map((x) => C(x, 54, 0.5, '#ffd88a')).join('')
      + `<g transform="translate(68 24)">${R(0, 0, 24, 10, '#8a929c', 'rx="1.5" stroke="#4a525c" stroke-width=".4"')}${L(1, 5, 23, 5, '#5a626c', 0.4)}${[6, 12, 18].map((x) => L(x, 0.6, x, 9.4, '#5a626c', 0.3)).join('')}${R(-6, 2, 7, 5, '#9aa2ac', 'stroke="#4a525c" stroke-width=".4"')}${R(-5, 3.4, 3, 1, '#1a1e24')}${R(2, 10, 18, 4, '#6a727c')}${[[3, 0], [8, 1], [15, 1], [20, 0]].map(([x, k]) => L(x, 14, x + (k ? 1 : -1), 21, '#5a626c', 1.4) + L(x + (k ? 1 : -1), 21, x, 28, '#5a626c', 1.2) + E(x, 28.4, 1.6, 0.6, '#4a525c')).join('')}</g>`
      // beach: bunkers, palms, rebels pinned down, explosions
      + R(0, 66, 100, 34, '#f2dfa6') + P('M0 70 Q30 66 60 70 T100 68', 'none', 'stroke="#d8c088" stroke-width="1"')
      + P('M26 66 L40 66 L38 61 L28 61Z', '#9aa2ac', 'stroke="#5a626c" stroke-width=".4"') + R(30, 63, 6, 1, '#1a1e24') + P('M74 68 L90 68 L88 63 L76 63Z', '#9aa2ac', 'stroke="#5a626c" stroke-width=".4"') + R(78, 65, 8, 1, '#1a1e24')
      + palm(8, 72, 32, 1.4) + palm(90, 70, 36, 1.4) + palm(54, 66, 20, 0.9) + palm(44, 64, 14, 0.7)
      + rebel(22, 68, 0.6) + rebel(62, 66, 0.5) + rebel(70, 67, 0.55)
      + [[34, 64, 3], [84, 60, 2.4]].map(([x, y, r]) => glow('#ff8a2a', C(x, y, r, '#ffb04a', 'opacity=".8"') + C(x, y, r * 0.5, '#fff0b0'), 3) + puffs('#4a3a2a', 0.5, [[x, y - r * 1.8, r * 1.8, r * 1.2]])).join('')
      + bolt(84, 64, 72, 62, '#ff3a2a') + bolt(18, 66, 26, 63, '#ff3a2a')
      // From the photo: brown fatigues, tan shoulder plates (the white armband
      // stripe on his right arm), brown sleeves, the sculpted tan chest plate
      // with its centre channel and vent slits, a tan belt with brown pouches,
      // and the E-22 held upright at his shoulder
      + P('M20 100 C21 86 28 77 38 74 L62 74 C72 77 79 86 80 100Z', '#4a3826', 'stroke="#241a10" stroke-width=".6"')
      + mirror(P('M21 89 C22 81 28 76.6 36 76 L39 84 C32 85.6 27.6 89 26.4 94Z', sand, 'stroke="#4a3a1e" stroke-width=".7"') + P('M22.6 86 C25 81.4 29.6 78.6 34.6 78.2', 'none', 'stroke="#fff2cc" stroke-width=".6"') + L(25.4, 85, 30.6, 82.4, '#6a5634', 0.5) + P('M24 94 L27 94 L27.6 100 L23.4 100Z', '#3e2e1e'))
      + P('M22.4 88.6 L33.6 82.6 L35 85.4 L23.8 91.4Z', '#e8ecef', 'stroke="#8a8f94" stroke-width=".4"')
      + P('M37 77 C42 75.2 58 75.2 63 77 L61.6 93 L38.4 93Z', sand, 'stroke="#4a3a1e" stroke-width=".7"') + shade('M50 75.4 C56 75.4 60 76 63 77 L61.6 93 L50 93Z', 0.14)
      + R(48.4, 77, 3.2, 15, '#a08656', 'stroke="#6a5634" stroke-width=".4"') + mirror(P('M39.4 79 L46.6 78.4 L46.4 85 L40 86Z', 'none', 'stroke="#6a5634" stroke-width=".5"') + L(40.6, 88.4, 46.4, 87.6, '#6a5634', 0.5))
      + [46.4, 48, 52, 53.6].map((x) => L(x, 88.4, x, 92, '#4a3a1e', 0.5)).join('')
      + R(36, 93, 28, 4.4, sandD, 'stroke="#4a3a1e" stroke-width=".5"') + [37.6, 44.4, 51.2, 58].map((x) => R(x, 93.6, 4.6, 3.4, '#5a4028', 'rx=".5"')).join('') + R(46.6, 97.4, 6.8, 2.6, '#3e2e1e')
      // the E-22 held upright beside his head: twin barrels, stock and grip, his glove on it
      + `<g transform="translate(15 34) rotate(-4)">${R(-2.4, 0, 4.8, 44, '#141518', 'rx="1"')}${R(-1.6, -12, 1.4, 12, '#141518')}${R(0.4, -12, 1.4, 12, '#141518')}${R(-3.4, 10, 2, 10, '#2a2c30', 'rx=".6"')}${R(2.4, 26, 4, 6, '#141518', 'rx="1"')}${R(-2.6, 44, 5.2, 9, '#2a2c30', 'rx="1"')}${L(0, 2, 0, 42, '#3a3c42', 0.5)}</g>`
      + E(19, 64, 3.6, 3, '#3a2a1a') + P('M19 67 L24 78 L28 76 L23 66Z', '#3e2e1e')
      // collar: the fabric neck seal the helmet sits on
      + P('M43 68 L57 68 L59 76 C55 78 45 78 41 76Z', '#4a3a28', 'stroke="#2a2014" stroke-width=".5"') + '<path d="M43 71.6 Q50 73.4 57 71.6" stroke="#6a5438" stroke-width=".6" fill="none"/>'
      + '<g transform="translate(0 5)">'
      // the helmet: smooth round dome with its highlight and rank dot
      + P('M34 42 C34 26 41 19 50 19 C59 19 66 26 66 42Z', sand, 'stroke="#4a3a1e" stroke-width="1"')
      + P('M50 19 C59 19 66 26 66 42 L50 42Z', '#000', 'opacity=".1"') + E(42, 25, 6, 2.4, '#fffaf0', 'opacity=".7" transform="rotate(-24 42 25)"') + C(50, 23.4, 1.4, '#e8642a')
      + P('M37 30 Q50 26 63 30', 'none', 'stroke="#fff2cc" stroke-width=".5" opacity=".6"')
      // the sharp flat-topped crest band
      + P('M32.6 34 L67.4 34 L68 38.6 L32 38.6Z', sandD, 'stroke="#4a3a1e" stroke-width=".8"') + L(33, 34.6, 67, 34.6, '#fff2cc', 0.6) + mirror(P('M32 38.6 L34.6 34 L36 38.6Z', '#8a7046'))
      // the dark visor band with its centre slot
      + P('M33 38.6 L67 38.6 L66.4 45.4 L52 45.6 L51.4 52 L48.6 52 L48 45.6 L33.6 45.4Z', '#0b0a07') + P('M34.4 39.6 L65.6 39.6 L65.4 41 L34.6 41Z', '#6a8098', 'opacity=".7"')
      // jagged faceted cheek plates: stepped edges, a lit facet and a shadowed facet each
      + mirror(P('M33.6 45.4 L44.4 45.4 L44.8 50 L43 51.4 L44.6 54 L40.6 59 L37.6 58 L36 55.6 L34 55 L33.4 50.6Z', sand, 'stroke="#4a3a1e" stroke-width=".7" stroke-linejoin="miter"')
        + P('M33.6 45.4 L44.4 45.4 L41 50 L34.6 49Z', '#fff2cc', 'opacity=".45"') + P('M34 55 L36 55.6 L37.6 58 L40.6 59 L39 54.4 L35.6 52.6Z', '#6a5634', 'opacity=".5"')
        + L(36.4, 49.6, 38.6, 56, '#6a5634', 0.5) + L(41, 50, 42.6, 54.8, '#6a5634', 0.5) + C(35.2, 47, 0.45, '#6a5634'))
      + shade('M50 45.6 L66.4 45.4 L66.6 52 L59.4 59 L55.6 59 L50 63Z', 0.1)
      // the rounded chin and slotted breather
      + P('M40.6 59 L44.6 54 L55.4 54 L59.4 59 C57 63.6 43 63.6 40.6 59Z', sandD, 'stroke="#4a3a1e" stroke-width=".7"')
      + R(44.6, 54.6, 10.8, 5, '#3a2e1a', 'rx="1"') + [46.4, 48.4, 50.4, 52.4, 54].map((x) => R(x, 55.4, 0.9, 3.4, '#b49a68')).join('') + P('M44 61 Q50 63 56 61', 'none', 'stroke="#fff2cc" stroke-width=".4" opacity=".6"')
      + '<path d="M38 30 l3 1 M61 48 l-2 2 M57 26 l2 -1 M43 57 l2 1" stroke="#8a7650" stroke-width=".6" opacity=".8"/>'
      + '</g>';
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
      // arm and glove bracing the rifle, armour seams and shine
      + P('M-15 77 C-17 84 -16 90 -12 94 L-8 92 C-10 88 -11 83 -10 78Z', '#16181c', 'stroke="#4a4e56" stroke-width=".5"') + E(-8, 92.6, 3, 2.2, '#0b0c0f', 'stroke="#3a3e46" stroke-width=".4"')
      + L(-13.6, 82, -10.6, 82.6, '#4a4e56', 0.5) + E(-11, 70.6, 2.6, 1, '#ffffff', 'opacity=".18" transform="rotate(-30 -11 70.6)"') + E(10, 71, 2, 0.8, '#ffffff', 'opacity=".12" transform="rotate(30 10 71)"')
      + '<path d="M-5.8 76.6 L5.8 76.6 M0 69.4 L0 80" stroke="#30343b" stroke-width=".5"/>' + [-3, 0, 3].map((px) => C(px, 72.6, 0.45, ['#4ade80', '#ff4a4a', '#4ade80'][px / 3 + 1])).join('')
      + P('M-5 64.6 L5 64.6 L5.6 68 L-5.6 68Z', '#0e0f12', 'stroke="#3a3e46" stroke-width=".4"') + [-3, -1, 1, 3].map((px) => L(px, 64.8, px, 67.8, '#30343b', 0.4)).join('')
      // the helmet at its real proportions: a tall dome, the brow, slanted green
      // lenses, nose ridge, ribbed mouth strip and the cheek tubes
      + P('M-7.6 54 C-8 47.4 -4.4 44 0 44 C4.4 44 8 47.4 7.6 54 L8.4 60.4 C7.4 64 3.8 65.8 0 66.2 C-3.8 65.8 -7.4 64 -8.4 60.4Z', dt, 'stroke="#5a5e66" stroke-width=".6"')
      + E(-3.4, 47.4, 2.4, 1, '#ffffff', 'opacity=".22" transform="rotate(-28 -3.4 47.4)"') + P('M5.6 48 C7 50 7.4 53 7.2 56', 'none', 'stroke="#6a707a" stroke-width=".5" opacity=".6"')
      + '<path d="M-7.4 52.4 Q0 50.2 7.4 52.4" stroke="#4a4e56" stroke-width=".6" fill="none"/>' + R(-0.6, 52.6, 1.2, 5, '#34383f')
      + glow('#4ade80', P('M-6.6 53.8 C-6.6 52.4 -1.8 52 -1.4 53.6 L-1.8 57 C-3.6 57.8 -5.8 57 -6.6 53.8Z', '#1e5a3a') + P('M6.6 53.8 C6.6 52.4 1.8 52 1.4 53.6 L1.8 57 C3.6 57.8 5.8 57 6.6 53.8Z', '#1e5a3a'), 1.4)
      + E(-4.4, 53.8, 0.9, 0.5, '#c8fff0', 'opacity=".85"') + E(4.4, 53.8, 0.9, 0.5, '#c8fff0', 'opacity=".85"')
      + P('M-2.2 58.2 L2.2 58.2 L2.5 64.6 L-2.5 64.6Z', '#08090b') + [59.4, 60.8, 62.2, 63.6].map((y) => L(-2, y, 2, y, '#4a4e56', 0.4)).join('')
      + L(-4.4, 59.2, -7, 63, '#2a2e36', 1.2) + L(4.4, 59.2, 7, 63, '#2a2e36', 1.2)
      + '</g>';
    return sd + dsd + dtd + R(0, 0, 100, 100, sky)
      // the Death Star: shaded sphere, equatorial trench, the dish, surface plating and lights
      + C(78, 20, 16, ds) + L(62.2, 21.6, 93.8, 18.4, '#5a626c', 1) + L(62.4, 22.6, 93.6, 19.4, '#c8ced6', 0.4)
      + [[66, 12, 8], [70, 28, 10], [82, 9, 9], [86, 29, 8], [74, 33, 6], [64, 18, 6], [80, 25, 12], [84, 6, 6]].map(([x, y, w]) => L(x, y, x + w, y - 0.6, '#6a727c', 0.4)).join('')
      // city lights scattered over the surface, thickest along the trench
      + Array.from({ length: 70 }, (_, k) => { const a = k * 2.399; const r = 15 * Math.sqrt((k + 0.5) / 70); const x = 78 + Math.cos(a) * r; const y = 20 + Math.sin(a) * r * 0.96; return Math.hypot(x - 71, y - 12.6) < 5 ? '' : R(x.toFixed(1), y.toFixed(1), 0.5, 0.32, '#fff6d8', `opacity="${(0.5 + (k % 5) * 0.1).toFixed(1)}"`); }).join('')
      + Array.from({ length: 22 }, (_, k) => R((63.4 + k * 1.4).toFixed(1), (21.4 - k * 0.14 + (k % 2) * 0.5).toFixed(1), 0.5, 0.3, '#ffe8a0', 'opacity=".9"')).join('')
      // the superlaser dish: eight tributary beams leave the rim and meet in front of it
      + C(71, 12.6, 4.4, '#7a828c', 'stroke="#4a525c" stroke-width=".5"') + C(71, 12.6, 2.8, 'none', 'stroke="#5a626c" stroke-width=".4"') + C(71, 12.6, 1.2, '#4a525c')
      + glow('#5aff4a', [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const r = (a * Math.PI) / 180; const x = 71 + Math.cos(r) * 3.8; const y = 12.6 + Math.sin(r) * 3.8; return C(x.toFixed(2), y.toFixed(2), 0.5, '#e8ffe0') + L(x.toFixed(2), y.toFixed(2), 75.2, 20.4, '#b8ff9a', 0.5); }).join('') + C(75.2, 20.4, 1.5, '#f0fff0') + L(75.2, 20.4, 94, 58, '#5aff4a', 3.4, 'opacity=".55"') + L(75.2, 20.4, 94, 58, '#e8ffe0', 1.3), 3) + E(94, 58, 12, 3.4, '#e8ffd8', 'opacity=".9"') + E(94, 58, 22, 6, '#ffffff', 'opacity=".3"') + P('M80 60 Q94 50 108 60', 'none', 'stroke="#ffffff" stroke-width="1" opacity=".5"')
      + R(0, 56, 100, 10, '#2ba3b8') + P('M0 60 Q20 58 40 60 T80 60 T100 60', 'none', 'stroke="#8ad8e8" stroke-width=".6"')
      // islands and palms along the shore
      + P('M28 62 Q36 57 46 62Z', '#3a7a4a') + P('M54 63 Q60 59 68 63Z', '#3a7a4a') + [[34, 60], [40, 60.4], [60, 61]].map(([x, y]) => L(x, y, x + 0.6, y - 4, '#5a4a2a', 0.5) + P(`M${x + 0.6} ${y - 4} q-2 0 -3 1.4 M${x + 0.6} ${y - 4} q2 0 3 1.4 M${x + 0.6} ${y - 4} q-1 -1.6 -2.4 -1.6 M${x + 0.6} ${y - 4} q1 -1.6 2.4 -1.6`, 'none', 'stroke="#2a6a3a" stroke-width=".6"')).join('')
      // the Citadel: tapered ribbed tower, window bands, a landing platform with
      // a shuttle, the top deck and the big communications dish
      + (() => { const [tw, twd] = LG([[0, '#e8ecf0'], [0.5, '#c8ced6'], [1, '#8a929c']], 0, 0, 1, 0); return twd
        + P('M4 66 L10 22 L24 22 L30 66Z', tw, 'stroke="#6a727c" stroke-width=".6"')
        + [12.4, 15, 17, 19, 21.6].map((x, k) => L(x, 22, 4 + (x - 4) * 0 + [7, 11.6, 17, 22.4, 27][k], 66, '#9aa2ac', 0.4)).join('')
        + [26, 32, 38, 44, 50, 56, 62].map((y) => { const w = 14 + (y - 22) * 0.27; const x0 = 17 - w / 2; return L(x0, y, x0 + w, y, '#7a828c', 0.5) + Array.from({ length: 7 }, (_, k) => R((x0 + 1 + k * (w - 2) / 7).toFixed(1), y + 1.2, 1, 0.8, '#2a3a4a')).join('') + Array.from({ length: 3 }, (_, k) => R((x0 + 2 + k * (w - 4) / 3).toFixed(1), y + 1.2, 1, 0.8, '#ffe8a0', 'opacity=".8"')).join(''); }).join('')
        + P('M26 40 L38 40 L38 42 L27 43Z', '#b8bec6', 'stroke="#6a727c" stroke-width=".4"') + `<g transform="translate(34 38.6) scale(.5)">${P('M-4 2 L4 2 L2 -2 L-2 -2Z', '#e8ecf0')}${P('M0 -2 L-1 -8 L1 -8Z', '#dfe4ea')}${L(-3, 2, -6, -2, '#dfe4ea', 0.8)}${L(3, 2, 6, -2, '#dfe4ea', 0.8)}</g>`
        + R(8, 18, 18, 4, '#b8bec6', 'stroke="#6a727c" stroke-width=".5"') + R(9, 19.2, 16, 1, '#ffe8a0', 'opacity=".8"') + R(11, 14, 12, 4, '#cfd4da', 'stroke="#6a727c" stroke-width=".5"')
        + L(17, 14, 17, 9, '#6a727c', 0.8) + L(17, 12, 11, 9.4, '#6a727c', 0.5) + L(17, 12, 23, 9.4, '#6a727c', 0.5)
        + `<g transform="rotate(-18 17 8)">${E(17, 8, 9, 2.8, '#dfe4ea', 'stroke="#6a727c" stroke-width=".5"')}${E(17, 7.4, 7.4, 1.8, '#aab2bc')}${L(17, 7.4, 17, 2, '#6a727c', 0.5)}${C(17, 2, 0.6, '#ff4a4a')}</g>`
        + L(27, 22, 27, 12, '#8a929c', 0.4) + C(27, 12, 0.4, '#ff4a4a'); })()
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
  // A winged Geonosian soldier over the hive spires: bronze hide, long ridged
  // head, bulging compound eyes, mandibles, thin armoured limbs, veined wings
  // and the big drum-shaped sonic blaster with its green charge. A Separatist
  // core ship and the droid factories behind.
  add('geonosian_warrior', () => {
    const [sk, sd] = LG([[0, '#c8884a'], [0.5, '#9a5a2a'], [1, '#5a2e12']]);
    return SCENES.geonosis() + sd
      // a Separatist core ship lifting off and droid factory stacks smoking on the horizon
      + C(76, 18, 9, '#6a5a50') + shade('M76 9 A9 9 0 0 1 76 27 A5 9 0 0 0 76 9Z', 0.25) + L(67, 18, 85, 18, '#4a3e36', 0.6) + E(76, 28, 4, 1.4, '#ffb04a', 'opacity=".6"')
      + [[32, 40, 4], [62, 38, 5]].map(([x, y, w]) => R(x, y, w, 40, '#5a3418') + puffs('#4a2e1e', 0.6, [[x + w / 2, y - 6, 6, 5], [x + w / 2 + 3, y - 14, 7, 5]])).join('')
      + [[22, 20], [56, 14], [88, 32]].map(([x, y]) => `<g transform="translate(${x} ${y})">${E(0, 0, 2, 0.8, '#3a2410')}${P('M-1 -0.4 L-5 -3 L-1 0.4Z M1 -0.4 L5 -3 L1 0.4Z', '#e8d8b0', 'opacity=".6"')}</g>`).join('')
      // the hive spires and droid factory glow
      + [[8, 28, 8], [20, 40, 6], [80, 30, 7], [92, 44, 6]].map(([x, y, w]) => P(`M${x - w} 80 Q${x - w / 2} ${y + 10} ${x} ${y} Q${x + w / 2} ${y + 10} ${x + w} 80Z`, '#8a4a22', 'opacity=".9"') + C(x, y + 14, 1, '#ffb04a', 'opacity=".7"')).join('')
      // veined wings fanned behind
      + mirror(P('M42 64 C28 46 10 38 2 42 C4 54 20 64 40 68Z', '#f4e6c8', 'opacity=".4" stroke="#8a6a3a" stroke-width=".6"') + '<path d="M40 66 C28 54 16 46 4 43 M40 67 C28 61 16 58 6 52 M40 65 C30 50 22 44 12 41" stroke="#8a6a3a" stroke-width=".5" fill="none" opacity=".75"/>')
      // armoured shoulders and thin arms
      + shoulders('#6a3a1a', { top: 76 }) + '<path d="M28 82 Q50 77 72 82 M26 90 Q50 85 74 90" stroke="#3a1a08" stroke-width="1" fill="none"/>'
      + P('M45 60 L55 60 L56 78 L44 78Z', '#5a2e12') + [64, 68, 72].map((y) => L(45, y, 55, y, '#3a1a08', 0.6)).join('')
      // the long ridged head
      + P('M37 44 C35 30 40 14 50 10 C60 14 65 30 63 44 C62 54 58 62 50 65 C42 62 38 54 37 44Z', sk, 'stroke="#3a1a08" stroke-width=".9"')
      + P('M50 10 C48 18 47.6 30 50 38 C52.4 30 52 18 50 10Z', '#e0a464') + '<path d="M43 17 Q50 13 57 17 M41 22 Q50 18 59 22 M40 28 Q50 24 60 28 M39 34 Q50 30 61 34" stroke="#4a2410" stroke-width=".7" fill="none"/>'
      + mirror(E(42.4, 41, 5, 6.4, '#1e0c04', 'transform="rotate(-20 42.4 41)" stroke="#3a1a08" stroke-width=".6"') + E(41.4, 39, 2.2, 2.6, '#7a4a2a', 'opacity=".55"') + C(40.6, 38.2, 0.9, '#ffe0b0', 'opacity=".8"')
        + P('M46 55 C44 59 42 63 43.6 67.6 L46.6 61Z', '#4a2410') + P('M37.6 46 Q36 50 37.6 54', 'none', 'stroke="#4a2410" stroke-width=".6"'))
      + '<path d="M46 52 Q50 54.6 54 52" stroke="#2a1006" stroke-width=".9" fill="none"/>'
      // the big sonic blaster held across the body in both claws
      + `<g transform="translate(22 82) rotate(-10) scale(1.7)">${R(0, -6, 20, 12, '#5a3a1a', 'rx="5" stroke="#2a1a0a" stroke-width=".5"')}${R(4, -7, 10, 2, '#7a5226', 'rx=".6"')}${R(16, -3, 10, 6, '#3a2410', 'rx="1"')}${L(4, -6, 4, 6, '#2a1a0a', 0.5)}${L(10, -6, 10, 6, '#2a1a0a', 0.5)}${C(1, 0, 6.6, '#2a1a0a')}${C(1, 0, 5, '#3aaa4a')}${C(1, 0, 5, 'none', 'stroke="#b0ffb8" stroke-width=".6"')}${C(1, 0, 2.2, '#d8ffd8', 'style="filter:drop-shadow(0 0 3px #7aff8a)"')}${L(-3.4, -0.6, 5, 0.6, '#1a3a1a', 0.6)}</g>`
      + P('M26 80 L24 84 L27 86 L30 82Z', '#7a4422') + E(26, 85, 2.6, 2, '#5a2e12') + P('M66 80 L58 84 L60 87 L68 83Z', '#7a4422') + E(59, 85.4, 2.6, 2, '#5a2e12');
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
  // Skinny and quick, as in The Clone Wars: a bullet head with two slanted
  // white eye slits and the ribbed vent down the face, a thin neck, narrow
  // shoulders and a tapered chest with the red sensor, rust-orange ball
  // joints, mid-stride with both hands gripping a big blaster rifle and the
  // vibrosword across his back. Behind him, Coruscant under siege: burning
  // towers, smoke columns, a Venator and a Separatist cruiser trading fire
  // over the city, gunships and vulture droids in the traffic lanes.
  add('commando_droid', () => {
    const [sky, skd] = LG([[0, '#1a0c14'], [0.45, '#5a1c18'], [0.8, '#c8481c'], [1, '#f08a3a']]);
    const [arm, ad] = LG([[0, '#8e7a7e'], [0.5, '#6a585c'], [1, '#3e3034']], 0, 0, 1, 0);
    const joint = (x, y, r) => C(x, y, r, '#c8642a', 'stroke="#5a2a10" stroke-width=".4"') + C(x - r * 0.3, y - r * 0.3, r * 0.35, '#f0a060', 'opacity=".7"');
    const limb = (x1, y1, x2, y2, w) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#2a2022" stroke-width="${w + 1}" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${arm}" stroke-width="${w}" stroke-linecap="round"/>`;
    // a city tower with rows of lit windows
    const tower = (x, y, w, c, lit, seed) => R(x, y, w, 100 - y, c) + Array.from({ length: Math.floor((100 - y) / 3.2) }, (_, r) => Array.from({ length: Math.max(1, Math.floor(w / 2.2)) }, (_, k) => ((r * 7 + k * 3 + seed) % 5 < 2 ? R((x + 0.6 + k * 2.2).toFixed(1), (y + 1.6 + r * 3.2).toFixed(1), 1, 1.2, lit, 'opacity=".75"') : '')).join('')).join('');
    const fire = (x, y, sc) => glow('#ff7a2a', `<g transform="translate(${x} ${y}) scale(${sc})">${P('M0 0 Q-4 -6 -1 -12 Q0 -7 2 -9 Q4 -5 3 -2 Q5 -4 5 0Z', '#ff9a3a')}${P('M0.6 0 Q-1.4 -4 0.4 -7 Q1.4 -4 2.6 -3 Q3 -1 2.6 0Z', '#fff0a0')}</g>`, 2.4);
    const smoke = (x, y, h) => P(`M${x - 2} ${y} C${x - 6} ${y - h * 0.4} ${x + 2} ${y - h * 0.6} ${x - 4} ${y - h} L${x + 8} ${y - h} C${x + 4} ${y - h * 0.6} ${x + 6} ${y - h * 0.3} ${x + 2} ${y}Z`, '#1a0c0c', 'opacity=".6"');
    const laat = (x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})">${P('M-8 0 L6 -1.6 L9 0 L6 1.6Z', '#5a6a5a')}${R(-3, -4, 1.6, 8, '#4a5a4a')}${C(7, 0, 0.6, '#ffd88a')}${R(-9, -0.6, 2, 1.2, '#ff4a2a', 'opacity=".8"')}</g>`;
    const vulture = (x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})">${P('M-6 -2 L0 0 L6 -2 L4 0 L6 2 L0 0.6 L-6 2 L-4 0Z', '#2a1a14')}${C(0, 0, 0.8, '#ff6a2a')}</g>`;
    return skd + ad + R(0, 0, 100, 100, sky)
      // capital ships trading fire high over the city
      + `<g transform="translate(22 12) rotate(6)">${P('M-16 0 L14 -3 L16 0 L14 3Z', '#6a6870')}${P('M-4 -3 L2 -6 L4 -3Z', '#5a5860')}${L(-14, 0, 14, 0, '#8a8890', 0.4)}${[-10, -6, -2, 2, 6].map((x) => C(x, 1.4, 0.3, '#ffd88a')).join('')}${glow('#7ac8ff', C(-16.4, 0, 1.2, '#bfe4ff'), 2)}</g>`
      + `<g transform="translate(80 9)">${P('M-14 0 L12 -1.4 L16 0 L12 1.4Z', '#3a3034')}${R(-12, -4, 8, 3, '#2e2628')}${R(-8, -7, 2, 3, '#2e2628')}${glow('#ff6a2a', C(-14, 0, 1, '#ffb070'), 2)}</g>`
      + glow('#ff4a2a', L(66, 10, 36, 13, '#ff6a4a', 0.5)) + glow('#5aa8ff', L(32, 11, 70, 8, '#8ac8ff', 0.5) + L(30, 14, 68, 11.4, '#8ac8ff', 0.4))
      + [[48, 10, 2], [58, 14, 1.6], [40, 6, 1.2]].map(([x, y, r]) => C(x, y, r, '#ffd070', 'opacity=".55"') + C(x, y, r * 0.5, '#fff4c0')).join('')
      // far towers in the haze, the Senate dome among them
      + [[2, 34, 5], [9, 26, 4], [15, 38, 6], [30, 30, 5], [40, 36, 4], [62, 28, 5], [70, 34, 6], [84, 24, 4], [92, 32, 6]].map(([x, y, w], k) => tower(x, y, w, '#4a1c1c', '#ffb070', k)).join('')
      + E(52, 44, 9, 4, '#4a1c1c') + R(43, 44, 18, 4, '#4a1c1c') + R(0, 0, 100, 100, '#f08a3a', 'opacity=".12"')
      // smoke columns rising from the burning blocks
      + smoke(12, 40, 34) + smoke(74, 36, 30) + smoke(40, 46, 26)
      + puffs('#1a0c0c', 0.55, [[14, 8, 14, 7], [76, 6, 14, 6], [42, 20, 12, 6]])
      // near towers, dark, with fires breaking out of them
      + [[-2, 46, 10], [10, 56, 8], [26, 50, 7], [68, 48, 8], [80, 42, 9], [92, 54, 9]].map(([x, y, w], k) => tower(x, y, w, '#1e0a0c', '#ffc870', k + 3)).join('')
      + fire(12, 41, 1) + fire(75, 37, 0.9) + fire(28, 51, 0.7) + fire(95, 55, 0.8) + fire(41, 47, 0.6)
      // gunships and vulture droids in the traffic lanes, blaster fire between them
      + laat(34, 26, 0.9) + laat(18, 32, 0.6) + vulture(60, 24, 0.9) + vulture(70, 30, 0.7) + vulture(88, 20, 0.6)
      + glow('#3aff6a', L(58, 25, 44, 27, '#7aff8a', 0.4)) + glow('#5aa8ff', L(36, 25.4, 54, 22, '#8ac8ff', 0.4))
      + embers(37, 30, '#ffb04a')
      // the landing platform he's fighting on: deck, railing and warning lights
      + P('M0 84 L100 80 L100 100 L0 100Z', '#2a2226') + P('M0 84 L100 80 L100 82 L0 86Z', '#4a3e42')
      + [[6, 84], [24, 83.2], [42, 82.4], [76, 81], [94, 80.2]].map(([x, y]) => L(x, y, x, y - 6, '#4a3e42', 0.7)).join('') + L(0, 78, 100, 74, '#5a4e52', 0.7)
      + [12, 88].map((x) => C(x, 83.4 - x * 0.04, 0.8, '#ff4a2a')).join('') + [[18, 92], [70, 90]].map(([x, y]) => R(x, y, 10, 0.8, '#ffb04a', 'opacity=".5"')).join('')
      // the vibrosword across his back, hilt over the left shoulder
      + `<g transform="rotate(-36 50 58)">${R(48.4, 34, 3.4, 34, '#8a6a9a', 'opacity=".9" rx="1"')}${R(49.4, 35, 0.9, 32, '#e0d0f0', 'opacity=".6"')}${R(47.6, 30, 5, 4.4, '#2a2224', 'rx="1"')}${R(48.6, 24.6, 3, 5.4, '#3a3034', 'rx=".6"')}</g>`
      // legs mid-stride: thin thighs and shins, ball joints, flat feet on the deck
      + limb(46.6, 78, 40, 89, 3) + limb(40, 89, 36, 99, 2.6) + limb(53.4, 78, 60, 88, 3) + limb(60, 88, 65, 98, 2.6)
      + joint(40, 89, 2.2) + joint(60, 88, 2.2) + joint(46.6, 78, 2.4) + joint(53.4, 78, 2.4)
      + P('M31 98 L39 97 L40 100 L30 100Z', '#3e3034') + P('M61 97 L69 96 L71 99 L61 99.6Z', '#3e3034')
      + R(46.4, 70, 7.2, 8, '#3e3034', 'rx="1.2"')
      // the narrow tapered chest with its red sensor and the sword strap
      + P('M39.4 54 L60.6 54 L58 67 L53.6 72 L46.4 72 L42 67Z', arm, 'stroke="#1e1618" stroke-width=".7"') + shade('M50 54 L60.6 54 L58 67 L53.6 72 L50 72Z', 0.18)
      + '<path d="M42 58 L58 58 M43.6 64 L56.4 64" stroke="#2e2426" stroke-width=".5"/>' + L(43, 70, 58, 55, '#2a2224', 1.4) + glow('#ff3a3a', C(52, 60.6, 1.4, '#ff4a4a'), 2)
      // thin neck with its collar
      + R(47.8, 45, 4.4, 10, '#3a2e30') + [47.6, 50, 52.4].map((y) => R(47.2, y, 5.6, 0.9, '#5a4a4e', 'rx=".4"')).join('') + R(45.8, 52.6, 8.4, 2.2, '#c8642a', 'rx="1"')
      // the bullet head, a touch wider: two slanted eye slits, the ribbed vent down the face
      + P('M41.4 29.4 C41.4 18.6 45.4 12.6 50 12.6 C54.6 12.6 58.6 18.6 58.6 29.4 C58.6 39.6 55.6 46.6 50 47.6 C44.4 46.6 41.4 39.6 41.4 29.4Z', arm, 'stroke="#1e1618" stroke-width=".9"')
      + shade('M50 12.6 C54.6 12.6 58.6 18.6 58.6 29.4 C58.6 39.6 55.6 46.6 50 47.6Z', 0.2) + E(45.8, 18.6, 2.2, 1, '#fff', 'opacity=".22" transform="rotate(-24 45.8 18.6)"')
      + L(50, 13.2, 50, 25.6, '#3e3034', 0.5) + mirror(P('M43.6 27 L48.4 29.2 L48.2 30.6 L43.4 28.4Z', '#f4f0e8') + P('M43 26.2 L48.8 28.8 L48.8 31.4 L43 29.2Z', '#2a2022', 'opacity=".55"'))
      + P('M47.8 32.6 L52.2 32.6 L51.6 44.6 L48.4 44.6Z', '#2a2224') + [35, 37.4, 39.8, 42.2].map((y) => L(48.1, y, 51.9, y, '#6a5a5e', 0.45)).join('')
      // arms: shoulders out to the elbows, forearms in to the rifle
      + limb(40, 56, 32, 71, 2.8) + limb(32, 71, 34.5, 85.6, 2.4) + limb(60, 56, 66, 69, 2.8) + limb(66, 69, 54.2, 75.6, 2.4)
      + joint(40, 56, 2.6) + joint(60, 56, 2.6) + joint(32, 71, 2) + joint(66, 69, 2)
      // the big blaster rifle, gripped at the pistol grip and the foregrip
      + `<g transform="translate(26 86) rotate(-20)">${R(-6, -2.2, 10, 4.4, '#2a2426', 'rx="1"')}${R(2, -3, 44, 6, '#1e1a1c', 'rx="1.4" stroke="#3a3436" stroke-width=".4"')}${R(44, -1.6, 14, 3.2, '#1e1a1c')}${R(56, -2.2, 3, 4.4, '#2a2426')}${R(12, -7, 18, 4, '#3a3436', 'rx=".8"')}${C(28, -5, 1.4, '#5a8ac8', 'opacity=".8"')}${[16, 20, 24, 28, 32, 36, 40].map((x) => R(x, -1.6, 1.2, 3.2, '#3a3436')).join('')}${R(6, 2.6, 4, 7, '#1e1a1c', 'rx=".8"')}${R(28, 2.6, 3.4, 5, '#1e1a1c', 'rx=".6"')}${glow('#ff4a2a', C(59.6, 0, 0.8, '#ff8a6a'), 1.4)}</g>`
      // the hands wrapped around grip and foregrip
      + P('M32 84 L37 83.4 L37.4 88 L32.6 88.6Z', '#4a3a3e', 'stroke="#1e1618" stroke-width=".4"') + '<path d="M33.4 84 L33.6 88.4 M35 83.8 L35.2 88.2" stroke="#1e1618" stroke-width=".35"/>'
      + P('M52 73.6 L56.6 72.6 L57.4 77.2 L52.8 78Z', '#4a3a3e', 'stroke="#1e1618" stroke-width=".4"') + '<path d="M53.4 73.4 L54 77.8 M55 73 L55.6 77.4" stroke="#1e1618" stroke-width=".35"/>';
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
      // Geonosis' sun burning through the dusty haze
      + puffs('#ffd890', 0.5, [[80, 10, 16, 16]]) + glow('#ffc86a', C(80, 10, 6, '#fff2c8'), 3) + C(80, 10, 4.6, '#fffbe8')
      // the crowd packed into the stands
      + [33, 37, 41].map((y, r) => Array.from({ length: 30 }, (_, i) => E(i * 3.4 + (r % 2) * 1.7, y, 1.1, 1.5, ['#5a2410', '#6a3418', '#4a1e0c'][(i + r) % 3])).join('')).join('')
      + prisoner(10, '#c8b48a', '#a0703a') + prisoner(90, '#2a2a30', '#5a3a1a') + prisoner(30, '#f2f2f2', '#3a2010')
      // the Z-6 jetpack strapped to his back: a compact frame just behind his
      // shoulders, two small thruster cans tucked against it, short flames below
      + mirror(glow('#ffb03a', P('M28.6 66 C27 72 27.6 77 30.4 82 C31.6 77 33 72 33 66Z', '#ffd27a', 'opacity=".85"') + P('M29.6 67 C29 71 29.4 75 30.8 78 C31.4 75 32 71 32 67Z', '#fff4d0'), 3))
      + R(36, 48, 28, 22, '#4a5a6a', 'rx="2.4" stroke="#2a3440" stroke-width=".7"') + L(36, 55, 64, 55, '#2a3440', 0.5)
      + mirror(R(28, 52, 7, 14, '#6a7a8a', 'rx="2" stroke="#2a3440" stroke-width=".6"') + R(28.6, 63, 5.8, 3, '#3a4450', 'rx=".8"') + L(31.5, 52.6, 31.5, 62, '#9aa8b4', 0.5) + R(34.6, 56, 2, 3, '#3a4450'))
      // the Z-6's missile peeking up behind his helmet
      + R(46.6, 11, 6.8, 10, '#6a7a8a', 'rx="1.2" stroke="#2a3440" stroke-width=".5"') + P('M46.6 11 L50 6.6 L53.4 11Z', '#b8c4cc') + R(46.6, 17, 6.8, 1.4, '#c43a2a')
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
  // From your reference: a huge, ancient Force being crouched low and wide.
  // A crown of flat, branching antler plates spreads like weathered tree
  // limbs over a long, heavy grey-violet face (heavy brow, small pale eyes,
  // a broad bovine muzzle, a stern downturned mouth). A great rust-red beard
  // pours down over a tan plated belly; rocky tan mantles cover his
  // shoulders, and giant flame-shaped plates flare up from his forearms to
  // dark fists planted on the ground. Thick dark legs, splayed toes. Calm,
  // stern, rooted like a living mountain, with light and dark in balance
  // glowing faintly behind him on Atollon.
  add('bendu', () => {
    const [sky, sd] = LG([[0, '#2e3a48'], [0.55, '#6a7684'], [1, '#b8ae98']]);
    const [rock, rk] = LG([[0, '#ead49c'], [0.55, '#c8ac72'], [1, '#8e7444']], 0, 0, 1, 1);
    const [rockS, rs] = LG([[0, '#d8c088'], [1, '#7a6236']], 0, 0, 1, 0);
    const [beard, bd] = LG([[0, '#c8602a'], [0.6, '#a8441a'], [1, '#6a2a0c']]);
    const [skin, skd] = LG([[0, '#7a6878'], [1, '#3e3242']], 0, 0, 1, 1);
    const [aura, ad] = RG([[0, '#f4ecd8', 0.45], [0.6, '#c8b8e8', 0.18], [1, '#7a6a9a', 0]]);
    // blister ovals on the rocky plates
    const ovals = (list) => list.map(([x, y, rx, ry, a]) => `<g transform="rotate(${a || 0} ${x} ${y})">${E(x, y, rx, ry, '#f4e4b8', 'opacity=".75"')}${E(x + rx * 0.15, y + ry * 0.3, rx * 0.8, ry * 0.6, '#9a7e4a', 'opacity=".35"')}</g>`).join('');
    return sd + rk + rs + bd + skd + ad + R(0, 0, 100, 100, sky)
      // Atollon: jagged spires, dust and a faint balance of light and dark behind him
      + [[4, 40, 5], [14, 52, 3], [86, 44, 4], [96, 34, 6], [30, 58, 3], [70, 56, 3]].map(([x, y, w]) => P(`M${x - w} 86 L${x - 1} ${y} L${x} ${y - 5} L${x + 1} ${y} L${x + w} 86Z`, '#3e4650')).join('')
      + C(50, 46, 46, aura) + glow('#6aa8ff', C(14, 30, 6, '#9ac8ff', 'opacity=".25"'), 6) + glow('#ff5a4a', C(86, 30, 6, '#ff9a8a', 'opacity=".22"'), 6)
      + R(0, 84, 100, 16, '#6a6a62') + P('M0 88 Q30 84 60 88 T100 86 V100 H0Z', '#54544e') + puffs('#a8a294', 0.35, [[50, 92, 50, 6]])
      // his whole bulk behind the plates, so nothing of the sky shows through him: shaggy dark fur
      + P('M8 54 C8 34 26 22 50 22 C74 22 92 34 92 54 L94 86 L6 86Z', '#4a3428') + P('M14 50 C16 38 30 30 50 30 C70 30 84 38 86 50', 'none', 'stroke="#6a4a36" stroke-width="1.4" opacity=".7"')
      + [[16, 60], [24, 52], [76, 52], [84, 60], [20, 72], [80, 72]].map(([x, y]) => P(`M${x} ${y} l-1.4 4 M${x + 2} ${y} l-.6 4.4 M${x + 4} ${y} l.4 4`, 'none', 'stroke="#2e2018" stroke-width=".6"')).join('')
      // thick dark legs crouched wide, with splayed clawed toes on the ground
      + mirror(P('M24 70 C20 76 20 86 26 92 L42 92 C46 86 46 76 42 70Z', skin, 'stroke="#241c28" stroke-width=".7"') + '<path d="M26 76 Q32 72 38 76 M24 84 Q28 82 32 84" stroke="#2a2230" stroke-width=".5" fill="none" opacity=".7"/>' + E(30, 80, 4, 6, '#9a8898', 'opacity=".18"')
        + P('M22 92 C22 89 26 87 34 87 C42 87 46 89 46 92 L46 96 L22 96Z', '#4a3e4e', 'stroke="#241c28" stroke-width=".6"') + [25, 30, 35, 40].map((x) => E(x + 1.6, 96, 2.2, 1.4, '#5a4e5e', 'stroke="#241c28" stroke-width=".5"') + P(`M${x + 0.8} 96.6 L${x + 1.6} 98.4 L${x + 2.4} 96.6Z`, '#d8ccc0')).join(''))
      // the tan plated belly, like a living shell
      + P('M36 58 C34 68 36 80 42 88 L58 88 C64 80 66 68 64 58Z', rock, 'stroke="#6a5430" stroke-width=".7"')
      + '<path d="M37 66 Q50 64 63 66 M37 74 Q50 72 63 74 M39 81 Q50 80 61 81 M44 60 L43 88 M56 60 L57 88 M50 60 L50 88" stroke="#8a7040" stroke-width=".6" fill="none"/>'
      + shade('M50 58 L64 58 C66 68 64 80 58 88 L50 88Z', 0.12)
      // arms: armoured upper arms reaching out, dark elbows, then the giant flame plates and fists
      + mirror(P('M24 40 C18 46 14 54 14 62 L22 66 C24 58 28 52 34 48Z', rockS, 'stroke="#6a5430" stroke-width=".7"') + ovals([[20, 52, 1.6, 1, -40], [24, 46, 1.2, 0.8, -40]])
        + E(16, 64, 4, 3, skin, 'stroke="#241c28" stroke-width=".6"')
        + P('M10 88 L20 88 C22 84 22 80 20 76 L12 76 C10 80 9 84 10 88Z', skin, 'stroke="#241c28" stroke-width=".6"') + E(14.6, 89, 6, 3.6, '#4a3e4e', 'stroke="#241c28" stroke-width=".6"') + '<path d="M10.6 89.6 l.6 2 M13.6 90.4 l.4 2 M16.6 90.4 l0 2 M19.4 89.6 l-.4 2" stroke="#241c28" stroke-width=".5"/>' + C(12, 88, 0.6, '#8a7a88') + C(17, 88.4, 0.6, '#8a7a88')
        + `<g transform="rotate(-4 14 84)">` + P('M8 82 C2 74 1 62 3 50 C4 42 6 34 10 26 C10 34 12 38 14 36 C14 30 16 24 18 20 C18 28 20 34 22 34 C22 42 24 50 24 58 C26 66 24 74 20 80 C16 84 12 84 8 82Z', rock, 'stroke="#6a5430" stroke-width=".8"')
        + '<path d="M6 76 C4 66 5 54 8 42 M12 78 C10 66 11 52 14 38 M18 78 C17 66 18 52 20 40" stroke="#9a804a" stroke-width=".6" fill="none" opacity=".8"/>'
        + ovals([[7, 64, 1.6, 3.4, -8], [12, 56, 1.4, 3, -6], [9, 46, 1.2, 2.6, -10], [16, 64, 1.4, 3, -4], [17, 48, 1.1, 2.4, -6], [13, 72, 1.2, 2, 0], [6, 36, 0.9, 1.8, -14]])
        + shade('M14 38 C18 46 22 54 24 58 C26 66 24 74 20 80 C16 84 12 84 8 82 C12 76 14 60 14 38Z', 0.12) + '</g>')
      // rocky tan mantles over the shoulders
      + mirror(P('M18 40 C20 32 28 28 38 30 C36 34 38 38 42 38 C40 44 36 50 30 52 C24 52 19 48 18 40Z', rock, 'stroke="#6a5430" stroke-width=".8"') + ovals([[26, 38, 2, 1.2, -20], [32, 34, 1.6, 1, -10], [23, 45, 1.4, 0.9, -30], [34, 44, 1.2, 0.8, -40]]) + shade('M30 52 C36 50 40 44 42 38 C38 38 36 34 38 30 C36 40 34 46 30 52Z', 0.15))
      + '<g transform="translate(0 6)">'
      // the long heavy face, set low and compact between the mantles
      + '<g transform="translate(50 30) scale(1.14) translate(-50 -30)">'
      + P('M42 25 C42 19.6 46 17 50 17 C54 17 58 19.6 58 25 L58.2 33 C58.2 38.6 55 42.4 50 43 C45 42.4 41.8 38.6 41.8 33Z', skin, 'stroke="#241c28" stroke-width=".7"')
      + '<path d="M44 21 Q47 19.6 50 21 Q53 19.6 56 21" stroke="#2a2230" stroke-width=".5" fill="none" opacity=".7"/><path d="M45.6 23.2 Q50 21.8 54.4 23.2" stroke="#2a2230" stroke-width=".4" fill="none" opacity=".6"/>'
      + P('M42.4 26 Q46 23.8 49.4 25.8 L49 27.4 Q46 26 42.6 27.8Z M57.6 26 Q54 23.8 50.6 25.8 L51 27.4 Q54 26 57.4 27.8Z', '#2e2434')
      + mirror(E(45.6, 28.2, 1.4, 0.8, '#e8e4dc') + C(45.8, 28.3, 0.45, '#3a3040') + P('M43.6 30 Q45.6 31 47.6 30 M43 31.6 Q45 32.6 47 31.8', 'none', 'stroke="#2a2230" stroke-width=".4"') + P('M42.4 33 Q43.6 35 45 35.6', 'none', 'stroke="#2a2230" stroke-width=".4" opacity=".7"'))
      // the broad bovine muzzle
      + P('M45.4 31.4 C44.8 34.4 45.2 37.4 46.8 39 L53.2 39 C54.8 37.4 55.2 34.4 54.6 31.4 C53 30.4 47 30.4 45.4 31.4Z', '#8a7484', 'stroke="#2e2434" stroke-width=".5"') + E(47.8, 37, 1, 0.8, '#241c28') + E(52.2, 37, 1, 0.8, '#241c28') + L(50, 31.8, 50, 35.8, '#6a5a6a', 0.4) + E(50, 33, 2.6, 1, '#a08ea0', 'opacity=".4"')
      // the great beard, like Santa's: from the cheeks, a mustache over the mouth, pouring down the belly
      + P('M41.6 30 C38 38 35 50 36 62 C37 70 39 66 41 72 C42 68 44 76 46 78 C47 74 49 80 50 82 C51 80 53 74 54 78 C56 76 58 68 59 72 C61 66 63 70 64 62 C65 50 62 38 58.4 30 C58 34 56.6 38 55.4 39.6 C53 41.4 47 41.4 44.6 39.6 C43.4 38 42 34 41.6 30Z', beard, 'stroke="#5a1e06" stroke-width=".6"')
      + '<path d="M40 38 Q38 52 40 66 M43 41 Q41.6 56 44 72 M46.6 43 Q46 60 47.6 76 M50 43 L50 80 M53.4 43 Q54 60 52.4 76 M57 41 Q58.4 56 56 72 M60 38 Q62 52 60 66" stroke="#e88a4a" stroke-width=".55" fill="none" opacity=".75"/>'
      + '<path d="M41.6 48 l-1 3 M45 54 l-.8 3 M48.6 60 l-.6 3 M52 56 l.6 3 M55.6 50 l.8 3 M58.6 46 l1 3 M44 64 l-.6 3 M56 64 l.6 3" stroke="#5a1e06" stroke-width=".5" opacity=".7"/>'
      // a broad drooping mustache over the mouth, blending into the beard
      + P('M42.6 39.4 C45 37.8 48.4 38.4 50 39.8 C51.6 38.4 55 37.8 57.4 39.4 C58.6 42 58.4 45.6 57 48 C55.6 45.6 53.6 43.8 50 43.4 C46.4 43.8 44.4 45.6 43 48 C41.6 45.6 41.4 42 42.6 39.4Z', beard)
      + '<path d="M44 40.6 Q46 43 44.4 46.4 M47 40.2 Q48.4 42 47.6 44 M53 40.2 Q51.6 42 52.4 44 M56 40.6 Q54 43 55.6 46.4" stroke="#e88a4a" stroke-width=".5" fill="none" opacity=".8"/>'
      + '</g>'
      // the red-brown brow band under the antler crown
      + P('M41 20.4 C44 16.8 56 16.8 59 20.4 L58.4 22.8 C55 20.2 45 20.2 41.6 22.8Z', '#8a4a2a', 'stroke="#4a2410" stroke-width=".5"')
      // one connected crown: a broad base band joining the branching antler plates
      + P('M20 22 C30 14 70 14 80 22 L77 28 C66 21 34 21 23 28Z', rock, 'stroke="#6a5430" stroke-width=".8"') + ovals([[30, 20, 1.6, 0.9, -8], [70, 20, 1.6, 0.9, 8], [40, 17.6, 1.2, 0.7, 0], [60, 17.6, 1.2, 0.7, 0]])
      + mirror(P('M42 20 C36 20 30 21 24 20 C20 19 18 16 20 13 C22 16 26 16 28 14 C26 10 28 6 32 6 C32 10 34 12 36 11 C36 7 38 4 41 4 C40 8 42 12 44 14 C44 16 43 18 42 20Z', rock, 'stroke="#6a5430" stroke-width=".8"')
        + ovals([[30, 16, 2, 1.1, -10], [35, 13, 1.4, 0.9, -20], [24, 17.4, 1.2, 0.7, 0], [39, 8, 1, 0.7, -40], [31, 9.6, 0.9, 0.6, -30]])
        + P('M24 28 C17 28 12 25 11 21 C15 23 19 23 23 22 C28 23 32 23 36 24 C33 27 29 28 24 28Z', rockS, 'stroke="#6a5430" stroke-width=".7"') + ovals([[17, 24.6, 1.4, 0.8, 0], [25, 25.4, 1.2, 0.7, 0]]))
      + P('M44 16 C42 10 44 4 50 0 C56 4 58 10 56 16 C54 14 46 14 44 16Z', rock, 'stroke="#6a5430" stroke-width=".8"') + ovals([[50, 7, 1.6, 2.4, 0], [47, 12, 1, 1, 0], [53, 12, 1, 1, 0]])
      + '</g>';
  });

  // ---------- Exegol opponent (2.2 card, more detail): Sith Trooper ----------
  // A Sith Eternal trooper in red: the angular helmet with its black visor
  // and side vents, red armour with black joints. Behind him the Citadel's
  // hooded statues, a Xyston Star Destroyer with its planet-killer glowing
  // under the hull, and the Final Order's banners.
  add('sith_trooper_24', () => {
    const [red, rd] = LG([[0, '#e02a36'], [0.5, '#b0161f'], [1, '#6a0a10']]);
    return exegol('#a8b8ff') + rd
      // a Xyston Star Destroyer overhead, seen from below at an angle: the long
      // dagger hull with its plating and trench, turbolaser rows, the stepped
      // superstructure and bridge tower, red running lights, and the axial
      // planet-killer cannon glowing in its ring under the hull
      + (() => { const [hull, hd] = LG([[0, '#2e2a38'], [1, '#100e16']]); return hd
        + P('M2 20 L80 6 L98 10 L96 16 L62 30 L6 26Z', hull, 'stroke="#4a4458" stroke-width=".7"') + P('M2 20 L80 6 L98 10 L60 18Z', '#34303e', 'stroke="#4a4458" stroke-width=".4"')
        + L(4, 21.4, 96, 12.6, '#0a080e', 0.9) + L(5, 22.4, 95, 13.8, '#5a5468', 0.3)
        + Array.from({ length: 14 }, (_, k) => { const x = 8 + k * 6.4; const y = 19.4 - k * 0.98; return R(x.toFixed(1), y.toFixed(1), 3.6, 0.9, '#4a4458', 'opacity=".8"') + C((x + 1.8).toFixed(1), (y + 3).toFixed(1), 0.35, '#5a5468'); }).join('')
        + Array.from({ length: 10 }, (_, k) => L(10 + k * 8, 23.4 - k * 0.6, 12 + k * 8, 28 - k * 1.3, '#0e0c14', 0.4)).join('')
        + Array.from({ length: 24 }, (_, k) => C((8 + k * 3.8).toFixed(1), (24.6 - k * 0.5 + (k % 3) * 0.6).toFixed(1), 0.28, '#ff6a6a', `opacity="${0.5 + (k % 3) * 0.2}"`)).join('')
        + P('M52 10 L82 5 L90 7.4 L58 13Z', '#262230', 'stroke="#4a4458" stroke-width=".5"') + P('M60 8 L84 4 L88 6 L64 10Z', '#2e2a38', 'stroke="#4a4458" stroke-width=".4"')
        + R(76, 0, 10, 4.6, '#24202c', 'stroke="#4a4458" stroke-width=".4"') + R(74, 0, 14, 1.4, '#3a3648') + [77, 80, 83].map((x) => R(x, 2.4, 1.6, 0.5, '#ff4a4a', 'opacity=".9"')).join('') + C(78, 0.6, 0.9, '#3a3648') + C(84, 0.6, 0.9, '#3a3648')
        + [[66, 8.6], [72, 7.6], [58, 10]].map(([x, y]) => R(x, y, 2.4, 0.5, '#ffd0d0', 'opacity=".6"')).join('')
        + glow('#ff2a3a', L(10, 25.6, 60, 29.4, '#ff3a3a', 0.4, 'opacity=".7"'), 1.6)
        + E(51, 29.6, 7, 3, '#1a1620', 'stroke="#4a4458" stroke-width=".5"') + E(51, 30.2, 5.4, 2.2, '#2a0a10') + E(51, 30.2, 5.4, 2.2, 'none', 'stroke="#ff4a4a" stroke-width=".4"')
        + glow('#ff2a3a', E(51, 30.6, 3.8, 1.6, '#ff3a3a') + E(51, 30.6, 1.8, 0.8, '#ffe0e0') + P('M47 31 L51 36 L55 31', 'none', 'stroke="#ff6a6a" stroke-width=".4" opacity=".6"'), 4)
        + P('M70 2 L84 0 L80 4Z M8 8 L20 6 L16 10Z', '#16141c', 'opacity=".7"'); })()
      // the Citadel's colossal hooded statues: faceless, robed, hands folded on
      // downturned blades, lit red from below with Sith banners between them
      + mirror((() => { const [st, sd2] = LG([[0, '#04030a'], [0.7, '#14101e'], [1, '#3a0a14']]); return sd2
        + P('M0 86 L2 50 C2 40 4 30 8 22 L11 12 L14 22 C18 30 20 40 20 50 L23 86Z', st, 'stroke="#2a1a2e" stroke-width=".5"')
        + P('M5.6 30 C6 24 9 20 11 19 C13 20 16 24 16.4 30 L15 36 C13 38 9 38 7 36Z', '#000')
        + C(9.2, 30.4, 0.45, '#ff2a2a', 'opacity=".8"') + C(12.8, 30.4, 0.45, '#ff2a2a', 'opacity=".8"')
        + '<path d="M4 54 C6 46 9 42 11 42 C13 42 16 46 18 54" stroke="#2a1a2e" stroke-width=".7" fill="none"/><path d="M6 86 L8 60 M16 86 L14 60 M11 44 L11 86" stroke="#1e1424" stroke-width=".6" fill="none"/>'
        + P('M7 52 C9 50 13 50 15 52 L14 56 L8 56Z', '#1a1222') + L(11, 56, 11, 82, '#5a5868', 0.9) + R(9, 54.6, 4, 1.4, '#3a3448')
        + P('M1 86 C4 70 8 62 11 60 C14 62 18 70 21 86Z', '#ff2a2a', 'opacity=".1"')
        + R(25, 26, 5, 34, '#5a0a10') + P('M25 60 L27.5 56 L30 60Z', '#0a080e') + C(27.5, 36, 1.5, 'none', 'stroke="#d8c060" stroke-width=".5"') + L(27.5, 34.5, 27.5, 46, '#d8c060', 0.3) + R(24.4, 25, 6.2, 1.4, '#2a1a1e'); })())
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
      // three main engines
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
