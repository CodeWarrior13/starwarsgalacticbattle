// Update 2.4: the ten Coruscant stage scenes, for approval. Same 160x90
// format as the worlds before, all set around the Jedi Temple on the night
// of Order 66: the march up the processional way, ARC-170s in the skylanes,
// the Temple's great hall, the Archives, the Inquisitors landing, gunships
// over the burning Temple, the training halls, the purge in the corridors,
// the Council chamber, and the Temple ablaze. Drawn in full detail.
(function (root) {
  'use strict';
  const K = root.ArtX;
  const SA = root.StageArt24;
  if (!K || !SA) return;
  const { P, E, C, R, L, LG } = K;
  const kit = SA.kit || {};
  const fill = (stops) => { const [g, d] = LG(stops); return d + R(0, 0, 160, 90, g); };
  const glow = (x, y, r, c, a = 0.18) => C(x, y, r * 2.4, c, `opacity="${a * 0.5}"`) + C(x, y, r * 1.6, c, `opacity="${a}"`);
  const g = (x, y, s, f, inner, a = 0) => `<g transform="translate(${x} ${y})${a ? ` rotate(${a})` : ''} scale(${s * (f || 1)} ${s})">${inner}</g>`;
  const bolt = (x1, y1, x2, y2, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="1.6" stroke-linecap="round" opacity=".35"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffffff" stroke-width=".5" stroke-linecap="round"/>`;
  const starfield = (n, seed) => Array.from({ length: n }, (_, k) => C(((k * 41 + seed * 11) % 160), ((k * 67 + seed * 5) % 90), (0.2 + (k % 3) * 0.12).toFixed(2), '#ffffff', `opacity="${(0.3 + (k % 4) * 0.12).toFixed(2)}"`)).join('');
  const gunsAt = kit.gunsAt || ((x, y, s, a, pts) => { const r = (a * Math.PI) / 180; return pts.map(([lx, ly]) => [x + s * (lx * Math.cos(r) - ly * Math.sin(r)), y + s * (lx * Math.sin(r) + ly * Math.cos(r))]); });
  const shots = kit.shots || ((a, b, ts, len = 0.14, c = '#3aff6a') => ts.map((t) => bolt(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[0] + (b[0] - a[0]) * (t + len), a[1] + (b[1] - a[1]) * (t + len), c)).join(''));
  const smoke = (x, y, h, a = 0.5, c1 = '#2a2428', c2 = '#4a4044') => Array.from({ length: 7 }, (_, k) => { const yy = y - (k * h) / 7; const xx = x + k * 1.8 + (k % 2) * 1.4; const r = 2.6 + k * 1.6; return C(xx, yy, r, k < 3 ? c1 : c2, `opacity="${(a * (1 - k * 0.1)).toFixed(2)}"`); }).join('');
  const fire = (x, y, r) => glow(x, y, r, '#ff8a3a', 0.5) + P(`M${x - r} ${y} Q${x - r * 0.6} ${y - r * 1.6} ${x - r * 0.2} ${y - r * 0.6} Q${x} ${y - r * 2.2} ${x + r * 0.3} ${y - r * 0.7} Q${x + r * 0.7} ${y - r * 1.5} ${x + r} ${y}Z`, '#ff9a3a') + P(`M${x - r * 0.5} ${y} Q${x - r * 0.2} ${y - r} ${x} ${y - r * 0.4} Q${x + r * 0.3} ${y - r * 1.1} ${x + r * 0.5} ${y}Z`, '#ffe08a');

  // ---------- The city ----------
  // The Coruscant skyline: layer on layer of towers with lit window grids,
  // spires and beacons, fading into the haze.
  const skyline = (base, c, win, a = 1, seed = 0, n = 22, hmin = 16, hmax = 50) => `<g opacity="${a}">${Array.from({ length: n }, (_, k) => { const w = 4 + ((k * 7 + seed) % 5) * 1.6; const x = ((k * 23 + seed * 13) % 176) - 8; const h = hmin + ((k * 11 + seed * 5) % 9) / 8 * (hmax - hmin); const top = base - h; return R(x, top, w, h + 2, c) + (k % 3 === 0 ? P(`M${x} ${top} L${x + w / 2} ${top - w * 0.8} L${x + w} ${top}Z`, c) + L(x + w / 2, top - w * 0.8, x + w / 2, top - w * 0.8 - 3, c, 0.3) + C(x + w / 2, top - w * 0.8 - 3, 0.3, '#ff4a3a') : R(x - 0.4, top - 0.8, w + 0.8, 0.8, c)) + Array.from({ length: Math.min(9, Math.floor(h / 3.2)) }, (_, m) => Array.from({ length: Math.min(3, Math.max(1, Math.floor(w / 2))) }, (_, q) => ((m * 3 + q * 5 + k) % 3 ? R(x + 0.6 + q * 2, top + 1.4 + m * 3.2, 0.9, 1, win, 'opacity=".75"') : '')).join('')).join(''); }).join('')}</g>`;
  // Streams of air traffic: little speeders with running lights in lanes.
  const traffic = (lanes, seed = 0) => lanes.map(([y, dir], k) => Array.from({ length: 10 }, (_, m) => { const x = ((m * 17 + k * 29 + seed * 7) % 170) - 5; return R(x - 1, y - 0.35, 2, 0.7, '#4a4e58') + C(x + dir, y, 0.25, dir > 0 ? '#fff4c8' : '#ff4a3a'); }).join('') + L(-5, y, 165, y, '#fff4c8', 0.08)).join('');
  // The Jedi Temple: the great stepped ziggurat with its ribbed flanks, the
  // central spire and four corner spires, the lit doorway and window bands.
  const temple = (x, y, s, burning = false) => g(x, y, s, 1,
    P('M-46 0 L-34 -22 L34 -22 L46 0Z', '#c8b89a', 'stroke="#6a5a42" stroke-width=".4"') + P('M10 -22 L34 -22 L46 0 L14 0Z', '#a8987a', 'opacity=".55"') + Array.from({ length: 13 }, (_, k) => L(-40 + k * 6.6, 0, -30 + k * 5, -22, '#8a7a5e', 0.3)).join('') + [-6, -12, -18].map((yy) => L(-46 + (-yy) * 0.55, yy, 46 - (-yy) * 0.55, yy, '#8a7a5e', 0.3)).join('')
    + P('M-30 -22 L-26 -28 L26 -28 L30 -22Z', '#d8c8aa', 'stroke="#6a5a42" stroke-width=".3"') + Array.from({ length: 14 }, (_, k) => R(-24 + k * 3.6, -26.6, 1.6, 1.6, burning ? '#ffb060' : '#ffe0a0', 'opacity=".85"')).join('')
    + [[-27, 15], [-15, 18], [15, 18], [27, 15], [0, 30]].map(([sx, h], k) => P(`M${sx - 2.4} -28 L${sx - 1.6} ${-28 - h} L${sx} ${-30 - h - (k === 4 ? 4 : 2)} L${sx + 1.6} ${-28 - h} L${sx + 2.4} -28Z`, '#d8c8aa', 'stroke="#6a5a42" stroke-width=".3"') + P(`M${sx} ${-30 - h - (k === 4 ? 4 : 2)} L${sx + 1.6} ${-28 - h} L${sx + 2.4} -28 L${sx + 0.4} -28Z`, '#a8987a', 'opacity=".6"') + Array.from({ length: Math.floor(h / 3) }, (_, m) => L(sx - 1.8 + m * 0.05, -30 - m * 3, sx + 1.8 - m * 0.05, -30 - m * 3, '#8a7a5e', 0.2)).join('') + C(sx, -28 - h, 0.4, '#ffe0a0')).join('')
    + R(-5, -14, 10, 14, burning ? '#ff8a3a' : '#ffe0a0', 'opacity=".8"') + R(-4, -13, 8, 13, burning ? '#3a1a10' : '#c8a060', 'opacity=".6"') + P('M-8 0 L-6 -16 L6 -16 L8 0', 'none', 'stroke="#6a5a42" stroke-width=".5"'));
  // The processional way: the long avenue up to the Temple with its statues.
  const statue = (x, y, s) => g(x, y, s, 1, R(-2.4, -2, 4.8, 2, '#8a7a5e') + P('M-1.4 -2 L-1.8 -10 C-1.8 -12 1.8 -12 1.8 -10 L1.4 -2Z', '#a8987a', 'stroke="#6a5a42" stroke-width=".2"') + C(0, -12.6, 1.2, '#a8987a', 'stroke="#6a5a42" stroke-width=".2"') + P('M-1.6 -11.6 C-2 -13.8 2 -13.8 1.6 -11.6', '#8a7a5e') + L(1.6, -8, 3, -12, '#8a7a5e', 0.4));

  // ---------- People ----------
  // A 501st clone trooper: Phase II white armour with the legion's blue
  // markings, the helmet with its T-visor and blue crest, the black body
  // glove at the joints, belt and pouches, a DC-15 blaster.
  const clone = (x, y, s, f = 1, aim = true, blue = '#3a6ad8') => g(x, y, s, f,
    E(0, 0.2, 3, 0.5, '#000', 'opacity=".25"')
    + P('M-2 -5 L-2.2 0 L-0.4 0 L-0.3 -5Z M0.3 -5 L0.4 0 L2.2 0 L2 -5Z', '#16161a') + R(-2.3, -1.6, 2, 1.7, '#f0f2f4', 'rx=".3" stroke="#3a3a40" stroke-width=".1"') + R(0.3, -1.6, 2, 1.7, '#f0f2f4', 'rx=".3" stroke="#3a3a40" stroke-width=".1"') + R(-2.1, -3.8, 1.6, 2, '#f4f6f8', 'stroke="#3a3a40" stroke-width=".1"') + R(0.5, -3.8, 1.6, 2, '#f4f6f8', 'stroke="#3a3a40" stroke-width=".1"') + R(-2.1, -3.4, 0.5, 1.4, blue) + R(1.6, -3.4, 0.5, 1.4, blue)
    + R(-2.4, -6, 4.8, 0.8, '#2a2a30') + [-1.8, -0.8, 0.4].map((bx) => R(bx, -6.1, 0.8, 0.8, '#4a4a52')).join('') + R(1.6, -5.6, 0.9, 1.8, '#1a1a1e', 'rx=".2"')
    + P('M-2.4 -6 L-2.6 -9.8 L2.6 -9.8 L2.4 -6Z', '#16161a') + P('M-2.1 -6.4 L-2.3 -9.6 L2.3 -9.6 L2.1 -6.4Z', '#f6f8fa', 'stroke="#3a3a40" stroke-width=".12"') + P('M-2.1 -9.6 L-1.2 -7 L-0.4 -9.6Z M2.1 -9.6 L1.2 -7 L0.4 -9.6Z', blue, 'opacity=".9"') + L(0, -9.4, 0, -6.6, '#a8aeb6', 0.12)
    + E(-2.8, -9.4, 1, 0.75, '#f4f6f8', 'stroke="#3a3a40" stroke-width=".1"') + E(2.8, -9.4, 1, 0.75, '#f4f6f8', 'stroke="#3a3a40" stroke-width=".1"') + E(-2.8, -9.6, 0.6, 0.3, blue)
    + R(-0.5, -10.6, 1, 0.8, '#16161a')
    + P('M-1.9 -11.4 C-2 -14 2 -14 1.9 -11.4 L1.9 -10.6 L-1.9 -10.6Z', '#f6f8fa', 'stroke="#3a3a40" stroke-width=".15"') + P('M-0.5 -14 L0.5 -14 L0.4 -11.8 L-0.4 -11.8Z', blue) + P('M-1.5 -12.2 L1.5 -12.2 L1.5 -11.6 L0.35 -11.6 L0.35 -10.6 L-0.35 -10.6 L-0.35 -11.6 L-1.5 -11.6Z', '#141418') + P('M-1.9 -10.8 L-1.4 -10.2 L1.4 -10.2 L1.9 -10.8', 'none', 'stroke="#a8aeb6" stroke-width=".15"')
    + (aim ? P('M2.2 -9.4 L3.5 -8.4 L3.2 -7.9 L2 -8.6Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".1"') + C(3.6, -7.9, 0.42, '#16161a') + R(0.6, -8.5, 5, 0.75, '#1a1a1e') + R(1.4, -9, 1.6, 0.5, '#3a3a40') + R(0.6, -8.1, 0.9, 1.4, '#1a1a1e') + L(5.6, -8.12, 6.6, -8.12, '#3a3a40', 0.4)
      : L(2.4, -8.8, 2.8, -6.2, '#f4f6f8', 0.8) + C(2.8, -6, 0.38, '#16161a') + L(1.4, -9.2, 3.4, -4, '#1a1a1e', 0.65)));
  // A Jedi or dark-sider: robes, face, hair, and a lit saber. The look is set
  // by the options: robe and tunic colours, skin, hair, hood, saber colour.
  const robed = (x, y, s, f, o) => g(x, y, s, f,
    E(0, 0.2, 3.4, 0.5, '#000', 'opacity=".25"')
    + P('M-2.6 -9.6 C-3.6 -6 -4 -3 -4.2 0 L4.2 0 C4 -3 3.6 -6 2.6 -9.6Z', o.robe, 'stroke="#1a1410" stroke-width=".25"') + P('M-1 -9 L-1.4 0 M1 -9 L1.4 0 M-2.4 -5 L-3.2 0 M2.4 -5 L3.2 0', 'none', `stroke="${o.fold || '#1a1410'}" stroke-width=".25" opacity=".6"`)
    + P('M-2 -10.4 L-1.8 -5.6 L1.8 -5.6 L2 -10.4 C1 -11 -1 -11 -2 -10.4Z', o.tunic, 'stroke="#1a1410" stroke-width=".2"') + P('M-1.4 -10.6 L0 -7.6 L1.4 -10.6', 'none', `stroke="${o.trim || '#e8dcc0'}" stroke-width=".35"`) + R(-1.9, -6.2, 3.8, 0.8, o.belt || '#4a3420') + R(-0.4, -6.3, 0.8, 1, '#8a8a90')
    + (o.hood ? P('M-2.4 -10.2 C-3.2 -13 -2.2 -15.4 0 -15.6 C2.2 -15.4 3.2 -13 2.4 -10.2 L1.4 -10.6 C1.6 -12.4 1 -13.6 0 -13.6 C-1 -13.6 -1.6 -12.4 -1.4 -10.6Z', o.robe, 'stroke="#1a1410" stroke-width=".2"') : '')
    + C(0, -12, 1.4, o.skin, 'stroke="#5a3a2a" stroke-width=".15"') + (o.hair ? P(o.hair, o.hairC || '#3a2416') : '') + (o.beard ? P(o.beard, o.hairC || '#3a2416') : '') + (o.marks ? P(o.marks, 'none', 'stroke="#1a1a1a" stroke-width=".18"') : '')
    + E(-0.5, -12.1, 0.26, 0.17, '#f4f0e8') + E(0.5, -12.1, 0.26, 0.17, '#f4f0e8') + C(-0.48, -12.1, 0.12, o.eye || '#1a1008') + C(0.52, -12.1, 0.12, o.eye || '#1a1008') + P('M-0.8 -12.5 L-0.2 -12.4 M0.8 -12.5 L0.2 -12.4', 'none', 'stroke="#2a1a10" stroke-width=".14"') + P('M-0.4 -11.1 Q0 -10.95 0.4 -11.1', 'none', 'stroke="#6a3a2a" stroke-width=".14"')
    + P('M2 -9.8 L3.4 -8.2 L3 -7.8 L1.8 -9Z', o.tunic) + C(3.4, -7.8, 0.45, o.skin) + R(3, -8.4, 0.8, 2.4, '#9a9aa2', 'transform="rotate(-20 3.4 -7.2)"')
    + `<g transform="rotate(${o.ang || -20} 3.4 -8)">${L(3.4, -8.6, 3.4, -20, o.saber, 1.2)}${L(3.4, -8.6, 3.4, -20, '#ffffff', 0.4)}</g>` + glow(3.4 + Math.sin(((o.ang || -20) * Math.PI) / 180) * -6, -14, 0.8, o.saber, 0.14)
    + (o.double ? `<g transform="rotate(${o.ang || -20} 3.4 -8)">${L(3.4, -7.4, 3.4, 3, o.saber, 1.2)}${L(3.4, -7.4, 3.4, 3, '#ffffff', 0.4)}</g>` : ''));
  const barriss = (x, y, s, f = 1) => robed(x, y, s, f, { robe: '#2a2a3a', tunic: '#3a3a52', skin: '#8ab878', hood: true, marks: 'M-0.9 -11.4 L-0.4 -11.4 M0.4 -11.4 L0.9 -11.4 M-1 -11.7 L-0.2 -11.7 M0.2 -11.7 L1 -11.7', saber: '#3a8aff', trim: '#8a8aa8' });
  const cal = (x, y, s, f = 1) => robed(x, y, s, f, { robe: '#8a5a3a', tunic: '#3a4a3a', skin: '#e8c4a0', hair: 'M-1.5 -12.4 C-1.6 -14.2 1.6 -14.4 1.5 -12.4 L1.2 -12.8 C0.4 -13.4 -0.6 -13.2 -1.2 -12.6Z', hairC: '#c85a2a', saber: '#3a9aff', trim: '#c8a070', fold: '#5a3a22' });
  const quigon = (x, y, s, f = 1) => robed(x, y, s, f, { robe: '#6a4a2e', tunic: '#c8b490', skin: '#e0b898', hair: 'M-1.5 -12 C-1.8 -14.4 1.8 -14.4 1.5 -12 L1.6 -10.6 L1.2 -10.6 L1.2 -12.4 L-1.2 -12.4 L-1.2 -10.6 L-1.6 -10.6Z', beard: 'M-1.1 -11.4 C-1 -10 1 -10 1.1 -11.4 C0.6 -10.9 -0.6 -10.9 -1.1 -11.4Z', hairC: '#6a4a2e', saber: '#3aff5a', fold: '#4a2e1a' });
  const mace = (x, y, s, f = 1) => robed(x, y, s, f, { robe: '#4a3a2a', tunic: '#a8906a', skin: '#5a3a26', saber: '#b04aff', ang: -10, fold: '#2a1e14' });
  // The Inquisitors: black armour and robes, grey or masked faces, red
  // spinning sabers.
  const inquisitor = (x, y, s, f, o) => g(x, y, s, f,
    E(0, 0.2, 3.4, 0.5, '#000', 'opacity=".3"')
    + P('M-2.8 -10.4 C-4 -6 -4.6 -3 -4.8 0 L4.8 0 C4.6 -3 4 -6 2.8 -10.4Z', '#14141a', 'stroke="#000" stroke-width=".2"') + P('M-1.4 -10 L-1.8 0 M1.4 -10 L1.8 0', 'none', 'stroke="#2a2a32" stroke-width=".3"')
    + P('M-2.2 -11 L-2 -6 L2 -6 L2.2 -11 C1 -11.6 -1 -11.6 -2.2 -11Z', '#2a2a32', 'stroke="#000" stroke-width=".2"') + P('M-1.6 -10.4 L-1.4 -7.4 L1.4 -7.4 L1.6 -10.4Z', '#3a3a44') + R(-2, -6.6, 4, 0.8, '#5a1a1a') + R(-0.5, -6.8, 1, 1.2, '#8a8a90')
    + E(-2.6, -10.8, 1, 0.8, '#3a3a44', 'stroke="#000" stroke-width=".15"') + E(2.6, -10.8, 1, 0.8, '#3a3a44', 'stroke="#000" stroke-width=".15"')
    + (o.mask ? C(0, -12.6, 1.5, '#2a2a32', 'stroke="#000" stroke-width=".2"') + P('M-1.2 -12.8 L-0.3 -12.6 L-0.4 -12.1 L-1.2 -12.3Z M1.2 -12.8 L0.3 -12.6 L0.4 -12.1 L1.2 -12.3Z', '#c83a2a') + L(0, -12, 0, -11.2, '#5a5a62', 0.2) + P('M-1.5 -13.2 Q0 -14.6 1.5 -13.2', 'none', 'stroke="#5a5a62" stroke-width=".25"')
      : E(0, -12.8, 1.3, 1.7, o.skin || '#a8a8a0', 'stroke="#4a4a44" stroke-width=".15"') + P('M-1.2 -13.6 C-1 -15.4 1 -15.4 1.2 -13.6', 'none', 'stroke="#6a6a62" stroke-width=".3"') + P('M-1 -12.4 L-0.6 -11.4 M1 -12.4 L0.6 -11.4 M-0.5 -11.2 L0.5 -11.2', 'none', 'stroke="#5a5a52" stroke-width=".15"') + C(-0.5, -12.9, 0.22, '#ffcf3a') + C(0.5, -12.9, 0.22, '#ffcf3a') + C(-0.5, -12.9, 0.09, '#1a0a0a') + C(0.5, -12.9, 0.09, '#1a0a0a'))
    + P('M2 -10 L3.6 -8.4 L3.2 -8 L1.8 -9.2Z', '#2a2a32') + `<g transform="translate(3.6 -8) rotate(${o.ang || 30})">${C(0, 0, 1.2, '#5a5a62', 'stroke="#2a2a32" stroke-width=".2"')}${C(0, 0, 0.5, '#2a2a32')}${o.spin ? P('M-6.4 -6.4 A9 9 0 0 1 6.4 -6.4', 'none', 'stroke="#ff2a1a" stroke-width=".5" opacity=".3"') + P('M6.4 6.4 A9 9 0 0 1 -6.4 6.4', 'none', 'stroke="#ff2a1a" stroke-width=".5" opacity=".3"') : ''}${L(0, -1.2, 0, -9, '#ff2a1a', 1.1)}${L(0, -1.2, 0, -9, '#ffe0d8', 0.35)}${L(0, 1.2, 0, 9, '#ff2a1a', 1.1)}${L(0, 1.2, 0, 9, '#ffe0d8', 0.35)}</g>` + glow(3.6, -8, 1.2, '#ff2a1a', 0.14));
  const grandInq = (x, y, s, f = 1) => inquisitor(x, y, s, f, { skin: '#9aa0a0', spin: true, ang: 20 });
  const fifthBro = (x, y, s, f = 1) => inquisitor(x, y, s, f, { skin: '#b8b4a8', ang: -30 });
  const secondSis = (x, y, s, f = 1) => inquisitor(x, y, s, f, { mask: true, spin: true, ang: 50 });

  // ---------- Machines ----------
  // An ARC-170 from above, nose right: the long fuselage with its red
  // Republic markings, the split S-foils, the big wing cannons, the tail
  // gunner's turret and the engines glowing.
  const arc170 = (x, y, s, a = 0) => g(x, y, s, 1,
    [-1, 1].map((sd) => P(`M-6 ${sd * 2} L-4 ${sd * 13} L0 ${sd * 13} L4 ${sd * 2.4}Z`, '#d8d4cc', 'stroke="#5a564e" stroke-width=".3"') + R(-3, sd > 0 ? 9.6 : -12.6, 14, 3, '#c8c4bc', 'stroke="#5a564e" stroke-width=".25"') + R(11, sd > 0 ? 10.6 : -11.6, 6, 1, '#3a3a40') + P(`M-3 ${sd * 6} L1 ${sd * 6} L0 ${sd * 10} L-3 ${sd * 10}Z`, '#a83a2a') + R(-7, sd > 0 ? 9.8 : -12.8, 4, 3.4, '#8a8a90', 'rx=".6"') + glow(-7.6, sd * 11.3, 1, '#ff9a6a', 0.55)).join('')
    + P('M-12 -2 L8 -2.4 L18 -0.8 L19 0 L18 0.8 L8 2.4 L-12 2Z', '#e8e4dc', 'stroke="#5a564e" stroke-width=".35"') + R(4, -1.8, 9, 3.6, '#a83a2a', 'opacity=".85"') + P('M8 -1.4 L13 -0.6 L13 0.6 L8 1.4Z', '#1a2a3a') + L(10.6, -1, 10.6, 1, '#e8e4dc', 0.2) + [-8, -4, 0].map((px) => L(px, -2, px, 2, '#a8a49c', 0.2)).join('') + C(-11, 0, 1.4, '#c8c4bc', 'stroke="#5a564e" stroke-width=".25"') + C(-11, 0, 0.6, '#1a2a3a') + L(-12, 0, -14, 0, '#3a3a40', 0.5) + P('M-12 -2 L-14 -4 L-14 4 L-12 2', 'none', 'stroke="#a8a49c" stroke-width=".6"'), a);
  // A Republic LAAT gunship side-on, nose right: the green-grey hull with its
  // red markings, the open troop door, the bubble turrets, the wings with
  // their missile pods, the rear engines glowing.
  const laat = (x, y, s, f = 1) => g(x, y, s, f,
    P('M-16 -2 L-12 -6 L8 -6 L14 -3 L18 0 L14 3 L-12 3 L-16 1Z', '#7a8a6a', 'stroke="#3a4232" stroke-width=".35"') + P('M-16 -2 L-12 -6 L8 -6 L14 -3 L-14 -1Z', '#9aaa8a', 'opacity=".5"') + R(-6, -4.6, 8, 6, '#2a2e24', 'stroke="#3a4232" stroke-width=".3"') + R(-5.4, -4, 6.8, 4.8, '#5a4a3a') + E(-2, 0, 3, 0.6, '#ffd890', 'opacity=".4"')
    + P('M8 -5 L14 -2.6 L13 -1 L8 -2Z', '#1a2a2a') + P('M-12 -6 L-6 -10 L4 -10 L6 -6Z', '#6a7a5a', 'stroke="#3a4232" stroke-width=".3"') + R(-9, -12, 18, 1.6, '#6a7a5a', 'stroke="#3a4232" stroke-width=".25"') + [-8, 8].map((px) => R(px - 1.2, -13.4, 2.4, 1.6, '#5a6a4a', 'stroke="#3a4232" stroke-width=".2"')).join('')
    + [-10, 12].map((px) => C(px, -6.4, 1.6, '#3a5a6a', 'stroke="#3a4232" stroke-width=".3"') + C(px - 0.4, -6.8, 0.5, '#8ab0c8', 'opacity=".7"')).join('') + P('M10 2 L12 6 L14 6 L14 3Z', '#7a8a6a') + P('M-4 -5.6 L2 -5.6 M14 -1 L17 -0.4', 'none', 'stroke="#a83a2a" stroke-width=".7"') + P('M-6 -9 L-2 -9', 'none', 'stroke="#a83a2a" stroke-width=".6"')
    + R(-18, -4, 3, 6, '#5a6a4a', 'stroke="#3a4232" stroke-width=".25"') + [-2.4, -0.4, 1.4].map((yy) => glow(-18.6, yy, 0.8, '#9fd8ff', 0.5)).join(''));

  const CO = {
    // 1 · Temple Approach: night over Coruscant. The Jedi Temple stands at
    // the end of the processional way, smoke starting to rise from it; the
    // lit skyline and its traffic all around; a column of 501st clone
    // troopers marches up the avenue between the Jedi statues.
    temple_approach: () => fill([[0, '#0a0e1e'], [0.5, '#2a2a4a'], [0.85, '#6a4a5a'], [1, '#c8806a']])
      + starfield(30, 1) + skyline(66, '#1a1e2e', '#ffd890', 0.7, 1, 26, 20, 50) + traffic([[30, 1], [40, -1]], 1) + skyline(70, '#14182a', '#ffcf7a', 0.9, 4, 18, 10, 30)
      + smoke(82, 20, 26, 0.5) + temple(80, 58, 0.95, true) + fire(80, 48, 2)
      + P('M54 58 L106 58 L140 90 L20 90Z', '#8a7a62') + P('M54 58 L106 58 L140 90 L20 90Z', 'none', 'stroke="#5a4a36" stroke-width=".4"') + Array.from({ length: 8 }, (_, k) => L(80 - 26 - k * 4.2, 58 + k * 4, 80 + 26 + k * 4.2, 58 + k * 4, '#6a5a46', 0.25)).join('') + L(80, 58, 80, 90, '#6a5a46', 0.3)
      + [[48, 64, 0.8], [112, 64, 0.8], [36, 74, 1.1], [124, 74, 1.1], [20, 88, 1.5], [140, 88, 1.5]].map(([x, y, sc]) => statue(x, y, sc)).join('')
      + [[72, 64, 1.1], [88, 64, 1.1], [68, 70, 1.4], [92, 70, 1.4], [64, 78, 1.8], [96, 78, 1.8], [58, 88, 2.4], [102, 88, 2.4]].map(([x, y, sc], k) => clone(x, y, sc, k % 2 ? -1 : 1, false)).join(''),

    // 2 · Skylane Patrol (fleet): through Coruscant's canyons of light. Towers
    // rise on every side with their lit windows, lanes of air traffic stream
    // past, and three ARC-170s sweep through in formation, engines blazing.
    skylane_patrol: () => fill([[0, '#1a1e3a'], [0.6, '#4a3a5a'], [1, '#c8806a']])
      + skyline(80, '#2a2e44', '#ffd890', 0.5, 2, 26, 30, 70) + traffic([[24, 1], [32, -1], [44, 1]], 2) + skyline(90, '#1a1e2e', '#ffcf7a', 0.85, 5, 16, 30, 76)
      + arc170(60, 36, 1.3, -8) + arc170(96, 22, 0.95, -8) + arc170(104, 52, 0.85, -8)
      + traffic([[66, -1], [74, 1]], 7)
      + R(0, 0, 14, 90, '#14182a') + Array.from({ length: 30 }, (_, k) => R(2 + (k % 3) * 4, 2 + Math.floor(k / 3) * 9, 2, 3, '#ffd890', 'opacity=".55"')).join('') + R(146, 0, 14, 90, '#14182a') + Array.from({ length: 30 }, (_, k) => R(148 + (k % 3) * 4, 4 + Math.floor(k / 3) * 9, 2, 3, '#ffd890', 'opacity=".55"')).join(''),

    // 3 · Temple Guard: inside the Temple's great hall. Towering ribbed
    // columns march away under the vaulted ceiling, light falling in long
    // shafts across the polished floor; Barriss Offee stands with her blue
    // saber lit, clone troopers advancing on either side.
    temple_guard: () => fill([[0, '#3a2e24'], [0.5, '#6a5442'], [1, '#2a2018']])
      + [-1, 1].map((sd) => Array.from({ length: 6 }, (_, k) => { const x = 80 + sd * (10 + k * 13); const w = 4 + k * 1.4; return R(x - w / 2, 0, w, 64 + k * 4, '#a8906a', 'stroke="#5a4a36" stroke-width=".3"') + Array.from({ length: 4 }, (_, m) => L(x - w / 2 + (m + 0.5) * w / 4, 0, x - w / 2 + (m + 0.5) * w / 4, 64 + k * 4, '#7a6a52', 0.2)).join('') + R(x - w / 2 - 1, 62 + k * 4, w + 2, 3, '#8a7a5e'); }).join('')).join('')
      + P('M0 0 L160 0 L160 6 Q80 -2 0 6Z', '#4a3a2a') + [0.15, 0.35, 0.55].map((t) => P(`M${20 + t * 120} 0 L${30 + t * 120} 0 L${10 + t * 160} 90 L${t * 160} 90Z`, '#fff0c8', 'opacity=".08"')).join('')
      + P('M0 64 L160 64 L160 90 L0 90Z', '#8a7458') + Array.from({ length: 9 }, (_, k) => L(80, 64, -40 + k * 30, 90, '#6a5a44', 0.3)).join('') + E(80, 76, 50, 6, '#fff0c8', 'opacity=".1"')
      + barriss(80, 80, 3, 1) + clone(40, 82, 2.6, 1) + clone(56, 74, 2, 1) + clone(120, 82, 2.6, -1) + clone(104, 74, 2, -1)
      + shots([53, 66.5], [74, 66], [0.4], 0.3, '#ff4a2a'),

    // 4 · The Archives: the Jedi Archives. The long hall of glowing holobook
    // shelves running away in perspective, the bronze busts of the Lost
    // Twenty on their plinths, the blue light of the data; Cal Kestis with
    // his blue saber lit, clones closing in.
    the_archives: () => fill([[0, '#0e1420'], [1, '#06080e']])
      + [-1, 1].map((sd) => Array.from({ length: 8 }, (_, k) => { const x1 = 80 + sd * (6 + k * 9); const x2 = 80 + sd * (9 + k * 11.6); const t1 = 26 - k * 3.4; const b1 = 56 + k * 4; return P(`M${x1} ${t1} L${x2} ${t1 - 3.4} L${x2} ${b1 + 4} L${x1} ${b1}Z`, '#1a2a3a', 'stroke="#3a5a7a" stroke-width=".2"') + Array.from({ length: 9 }, (_, m) => { const y1 = t1 + ((b1 - t1) * (m + 0.5)) / 9; const y2 = t1 - 3.4 + ((b1 + 4 - t1 + 3.4) * (m + 0.5)) / 9; return L(x1, y1, x2, y2, '#5ad8ff', 0.3) + L(x1, y1 + 0.8, x2, y2 + 0.9, '#2a6a9a', 0.5); }).join(''); }).join('')).join('')
      + R(72, 22, 16, 36, '#3a5a7a', 'opacity=".25"') + glow(80, 40, 8, '#5ad8ff', 0.12)
      + [[-1, 0], [1, 0], [-1, 1], [1, 1], [-1, 2], [1, 2]].map(([sd, k]) => { const x = 80 + sd * (12 + k * 16); const y = 60 + k * 6; const sc = 1 + k * 0.4; return R(x - 2 * sc, y - 4 * sc, 4 * sc, 4 * sc, '#4a3a2a') + C(x, y - 6 * sc, 1.6 * sc, '#a87a3a', 'stroke="#5a3a1a" stroke-width=".2"') + R(x - 1.6 * sc, y - 4.8 * sc, 3.2 * sc, 1.2 * sc, '#a87a3a'); }).join('')
      + P('M0 62 L160 62 L160 90 L0 90Z', '#0e1824') + Array.from({ length: 9 }, (_, k) => L(80, 58, -40 + k * 30, 90, '#1e2e40', 0.3)).join('') + E(80, 70, 50, 5, '#5ad8ff', 'opacity=".06"')
      + cal(80, 82, 3, 1) + clone(36, 84, 2.6, 1) + clone(124, 84, 2.6, -1) + clone(110, 76, 2, -1),

    // 5 · The Inquisitors Arrive: a Temple landing platform under the burning
    // night sky; the Inquisitors' black shuttle settling with its ramp down,
    // the Second Sister striding off with her saber spinning, the Fifth
    // Brother beside her, clone troopers standing to attention.
    the_inquisitors_arrive: () => fill([[0, '#0a0a14'], [0.6, '#3a1e24'], [1, '#8a3a2a']])
      + starfield(20, 5) + skyline(60, '#1a1418', '#ffb060', 0.6, 5, 22, 20, 46) + smoke(30, 40, 30, 0.5) + smoke(130, 40, 26, 0.45) + fire(30, 44, 2) + fire(130, 44, 1.6)
      + `<g transform="translate(80 46) scale(1.6)">${P('M-14 4 L-10 -4 L10 -4 L14 4Z', '#2a2a32', 'stroke="#6a6a74" stroke-width=".35"')}${P('M-8 -4 L-4 -12 L4 -12 L8 -4Z', '#32323c', 'stroke="#6a6a74" stroke-width=".35"')}${P('M-10 -4 L10 -4', 'none', 'stroke="#8a8a94" stroke-width=".3"')}${[-8, -4, 0, 4, 8].map((px) => L(px, -4, px * 1.3, 4, '#4a4a54', 0.2)).join('')}${P('M-3 -11 L3 -11 L2.4 -8 L-2.4 -8Z', '#ff3a2a', 'opacity=".55"')}${P('M-14 4 L-22 8 L-20 9 L-12 6Z M14 4 L22 8 L20 9 L12 6Z', '#1a1a20', 'stroke="#3a3a44" stroke-width=".25"')}${P('M-4 4 L4 4 L6 12 L-6 12Z', '#2a2a32')}${glow(0, 6, 2, '#ff8a6a', 0.3)}</g>`
      + P('M0 66 L160 66 L160 90 L0 90Z', '#4a4a52') + E(80, 72, 70, 8, '#5a5a62', 'stroke="#ffcf3a" stroke-width=".5" opacity=".8"') + Array.from({ length: 14 }, (_, k) => { const an = (k / 14) * Math.PI * 2; return C(80 + Math.cos(an) * 66, 72 + Math.sin(an) * 7, 0.5, '#ffe0a0'); }).join('')
      + secondSis(64, 78, 2.7, 1) + fifthBro(100, 78, 2.9, -1)
      + clone(30, 80, 2.4, 1, false) + clone(46, 82, 2.5, 1, false) + clone(114, 82, 2.5, -1, false) + clone(130, 80, 2.4, -1, false),

    // 6 · Gunship Run (fleet): over the burning Temple. Smoke pours from the
    // spires into the night, gunships and ARC-170s sweep low over the
    // processional way, searchlights cutting the dark.
    gunship_run: () => fill([[0, '#0a0e1e'], [0.5, '#3a2a3a'], [1, '#a8584a']])
      + skyline(76, '#1a1e2e', '#ffd890', 0.6, 6, 24, 20, 50) + smoke(70, 30, 40, 0.6) + smoke(92, 34, 36, 0.55) + temple(80, 76, 0.9, true) + fire(70, 50, 2.4) + fire(92, 52, 2) + fire(80, 64, 2.2)
      + [[30, 0, 60, 70], [130, 0, 100, 70]].map(([x1, y1, x2, y2]) => P(`M${x1 - 2} ${y1} L${x1 + 2} ${y1} L${x2 + 10} ${y2} L${x2 - 10} ${y2}Z`, '#fff4c8', 'opacity=".06"')).join('')
      + laat(44, 30, 1.3, 1) + laat(116, 22, 0.9, -1) + arc170(84, 14, 0.8, 10) + arc170(130, 44, 0.7, 170)
      + R(0, 84, 160, 6, '#14182a'),

    // 7 · Training Halls: a Temple training hall. High windows over the city,
    // remote training droids hovering with their beams, the sparring floor
    // with its rings; Qui-Gon Jinn, Barriss and Cal stand ready, sabers lit.
    training_halls: () => fill([[0, '#4a3e30'], [0.5, '#7a6448'], [1, '#3a2e22']])
      + R(0, 0, 160, 40, '#2a3050') + skyline(38, '#3a4060', '#ffd890', 0.9, 7, 24, 8, 26) + traffic([[16, 1], [22, -1]], 3)
      + P(`M0 0 L160 0 L160 38 L0 38Z ${[20, 54, 88, 122].map((x) => `M${x} 8 L${x} 36 L${x + 18} 36 L${x + 18} 8Z`).join(' ')}`, '#6a5440', 'fill-rule="evenodd" stroke="#5a4a36" stroke-width=".4"') + [20, 54, 88, 122].map((x) => R(x, 8, 18, 28, 'none', 'stroke="#4a3a2a" stroke-width="1"') + L(x + 9, 8, x + 9, 36, '#4a3a2a', 0.8) + L(x, 22, x + 18, 22, '#4a3a2a', 0.5)).join('')
      + R(0, 0, 160, 8, '#5a4a36') + R(0, 36, 160, 2, '#8a7458')
      + P('M0 56 L160 56 L160 90 L0 90Z', '#8a7052') + E(80, 72, 60, 10, 'none', 'stroke="#c8a070" stroke-width=".6"') + E(80, 72, 40, 6, 'none', 'stroke="#c8a070" stroke-width=".4"') + C(80, 72, 1.4, '#c8a070') + Array.from({ length: 9 }, (_, k) => L(80, 56, -40 + k * 30, 90, '#6a5640', 0.25)).join('')
      + R(0, 38, 160, 18, '#6a5440') + Array.from({ length: 16 }, (_, k) => R(k * 10 + 2, 40, 6, 14, '#5a4636', 'stroke="#4a3a2a" stroke-width=".2"')).join('')
      + [[50, 30], [104, 26], [80, 40]].map(([x, y]) => C(x, y, 1.6, '#3a3a40', 'stroke="#8a8a90" stroke-width=".3"') + [0, 90, 180, 270].map((a) => C(x + Math.cos((a * Math.PI) / 180) * 1.6, y + Math.sin((a * Math.PI) / 180) * 1.6, 0.35, '#c8c8d0')).join('') + C(x, y, 0.5, '#ff3a2a') + glow(x, y, 0.6, '#ff3a2a', 0.4)).join('') + bolt(50, 31, 58, 44, '#ff4a2a') + bolt(104, 27, 98, 40, '#ff4a2a')
      + quigon(80, 80, 3.2, 1) + barriss(48, 82, 2.8, 1) + cal(116, 82, 2.8, -1),

    // 8 · The Purge: a Temple corridor on fire. Red light and smoke, the
    // carved pillars scorched, embers drifting; the Grand Inquisitor stalks
    // forward with his saber spinning, clone troopers at his back.
    the_purge: () => fill([[0, '#1a0e0a'], [0.5, '#4a2014'], [1, '#14080a']])
      + P('M0 0 L56 28 L104 28 L160 0Z', '#2a1a14') + P('M0 90 L56 62 L104 62 L160 90Z', '#2a1810') + P('M0 0 L56 28 L56 62 L0 90Z', '#4a2e20') + P('M160 0 L104 28 L104 62 L160 90Z', '#422a1e')
      + [0.2, 0.4, 0.6, 0.8].map((k) => R(k * 56 - 2.4 + k * 0.6, k * 28, 4.8 - k * 2, 90 - k * 56, '#6a4a32', 'stroke="#2a1a10" stroke-width=".3"') + R(160 - k * 56 - 2.4 + k * 1.4, k * 28, 4.8 - k * 2, 90 - k * 56, '#6a4a32', 'stroke="#2a1a10" stroke-width=".3"')).join('')
      + R(56, 28, 48, 34, '#2a0e08') + fire(70, 62, 3) + fire(92, 62, 2.6) + fire(20, 82, 3.6) + fire(140, 84, 3) + smoke(80, 40, 20, 0.5, '#1a0e0a', '#3a2018')
      + Array.from({ length: 20 }, (_, k) => C((k * 37) % 160, (k * 23) % 80, 0.35, '#ffb060', 'opacity=".8"')).join('')
      + clone(56, 72, 2, 1) + clone(104, 72, 2, -1) + grandInq(80, 84, 3.4, 1),

    // 9 · Council Chamber: the High Council's round chamber at sunset. The
    // ring of chairs, the tall windows looking out over the spires and
    // traffic of Coruscant, the patterned floor; Mace Windu with his purple
    // saber and Qui-Gon Jinn face a clone trooper in the doorway.
    council_chamber: () => fill([[0, '#3a2a2a'], [1, '#1a1210']])
      + fill([[0, '#3a2a4a'], [0.6, '#c8806a'], [1, '#f0b070']]).replace('<rect', '<rect') + skyline(54, '#4a3448', '#ffd890', 0.85, 9, 26, 10, 40) + traffic([[22, 1], [30, -1], [38, 1]], 9)
      + P(`M0 0 L160 0 L160 54 L0 54Z ${Array.from({ length: 7 }, (_, k) => { const x = 8 + k * 21; return `M${x} 6 L${x} 52 L${x + 18} 52 L${x + 18} 6Z`; }).join(' ')}`, '#3a2a22', 'fill-rule="evenodd"') + Array.from({ length: 7 }, (_, k) => { const x = 8 + k * 21; return R(x, 6, 18, 46, 'none', 'stroke="#5a4030" stroke-width="1.4"') + L(x, 30, x + 18, 30, '#5a4030', 0.6) + L(x + 9, 6, x + 9, 52, '#5a4030', 0.4); }).join('')
      + R(0, 0, 160, 6, '#4a3a2a') + R(0, 52, 160, 3, '#6a5040')
      + P('M0 55 L160 55 L160 90 L0 90Z', '#8a6a4a') + E(80, 72, 70, 14, '#a8885a', 'stroke="#6a4a2a" stroke-width=".5"') + E(80, 72, 40, 8, 'none', 'stroke="#6a4a2a" stroke-width=".5"') + Array.from({ length: 12 }, (_, k) => { const an = (k / 12) * Math.PI * 2; return L(80 + Math.cos(an) * 40, 72 + Math.sin(an) * 8, 80 + Math.cos(an) * 70, 72 + Math.sin(an) * 14, '#6a4a2a', 0.3); }).join('')
      + Array.from({ length: 8 }, (_, k) => { const an = Math.PI + (k / 7) * Math.PI; const cx = 80 + Math.cos(an) * 62; const cy = 66 + Math.sin(an) * 9; return P(`M${cx - 3} ${cy} L${cx - 3} ${cy - 6} C${cx - 3} ${cy - 8} ${cx + 3} ${cy - 8} ${cx + 3} ${cy - 6} L${cx + 3} ${cy}Z`, '#a85a3a', 'stroke="#5a2a1a" stroke-width=".3"') + R(cx - 3.6, cy - 1, 7.2, 1.4, '#7a3a24'); }).join('')
      + mace(70, 82, 3.2, 1) + quigon(96, 82, 3.1, 1) + clone(140, 84, 2.6, -1),

    // 10 · Order 66: the Temple ablaze against the night. Smoke pours from
    // every spire into a red sky, fires burn along the steps, gunships
    // circle; the Grand Inquisitor, the Second Sister and the Fifth Brother
    // stand on the processional way with sabers lit, a line of clones behind.
    order_66: () => fill([[0, '#0a0608'], [0.5, '#3a1210'], [0.8, '#8a2a1a'], [1, '#c8582a']])
      + starfield(14, 10) + skyline(62, '#1a0e0e', '#ffb060', 0.6, 10, 24, 18, 44)
      + smoke(66, 24, 40, 0.65, '#1a0e0e', '#3a1e18') + smoke(92, 22, 44, 0.65, '#1a0e0e', '#3a1e18') + smoke(80, 18, 46, 0.55, '#1a0e0e', '#3a1e18')
      + temple(80, 62, 1, true) + fire(58, 44, 2.6) + fire(102, 44, 2.6) + fire(80, 30, 2.4) + fire(66, 58, 2) + fire(94, 58, 2) + laat(30, 22, 0.8, 1) + laat(132, 16, 0.6, -1)
      + P('M50 62 L110 62 L150 90 L10 90Z', '#6a5040') + Array.from({ length: 6 }, (_, k) => L(80 - 30 - k * 6, 62 + k * 4.6, 80 + 30 + k * 6, 62 + k * 4.6, '#4a3428', 0.3)).join('')
      + [[60, 68], [70, 68], [90, 68], [100, 68]].map(([x, y], k) => clone(x, y, 1.4, k < 2 ? 1 : -1, false)).join('')
      + secondSis(34, 84, 2.7, 1) + grandInq(80, 86, 3.1, 1) + fifthBro(124, 84, 2.8, -1),
  };
  Object.assign(SA.scenes, CO);
  SA.worlds.coruscant = ['temple_approach', 'skylane_patrol', 'temple_guard', 'the_archives', 'the_inquisitors_arrive', 'gunship_run', 'training_halls', 'the_purge', 'council_chamber', 'order_66'];
})(typeof window !== 'undefined' ? window : globalThis);
