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
  const temple = (x, y, s, burning = false) => {
    const lit = burning ? '#ffb060' : '#ffe0a0';
    const tier = (y0, y1, w0, w1, c, d) => P(`M${-w0} ${y0} L${-w1} ${y1} L${w1} ${y1} L${w0} ${y0}Z`, c, 'stroke="#6a5a42" stroke-width=".35"') + P(`M${w0 * 0.25} ${y0} L${w1 * 0.25} ${y1} L${w1} ${y1} L${w0} ${y0}Z`, d, 'opacity=".5"') + Array.from({ length: 17 }, (_, k) => { const t = k / 16; return L(-w0 + 2 * w0 * t, y0, -w1 + 2 * w1 * t, y1, '#8a7a5e', 0.28); }).join('') + R(-w1, y1 - 0.6, 2 * w1, 0.8, '#e8dcc0');
    const spire = (sx, h, w) => P(`M${sx - w} -30 L${sx - w * 0.8} ${-30 - h * 0.7} C${sx - w * 0.9} ${-30 - h * 0.86} ${sx - w * 0.5} ${-30 - h} ${sx} ${-32 - h} C${sx + w * 0.5} ${-30 - h} ${sx + w * 0.9} ${-30 - h * 0.86} ${sx + w * 0.8} ${-30 - h * 0.7} L${sx + w} -30Z`, '#dccdb0', 'stroke="#6a5a42" stroke-width=".3"') + P(`M${sx} ${-32 - h} C${sx + w * 0.5} ${-30 - h} ${sx + w * 0.9} ${-30 - h * 0.86} ${sx + w * 0.8} ${-30 - h * 0.7} L${sx + w} -30 L${sx + w * 0.2} -30Z`, '#a8987a', 'opacity=".55"') + [-0.6, -0.2, 0.2, 0.6].map((t) => P(`M${sx + w * t} -30 L${sx + w * t * 0.8} ${-30 - h * 0.7} Q${sx + w * t * 0.6} ${-30 - h * 0.92} ${sx} ${-32 - h}`, 'none', 'stroke="#8a7a5e" stroke-width=".22"')).join('') + [0.25, 0.5, 0.72].map((t) => L(sx - w * (1 - t * 0.25), -30 - h * t, sx + w * (1 - t * 0.25), -30 - h * t, '#8a7a5e', 0.25)).join('') + E(sx, -30 - h * 0.86, w * 0.75, 0.6, '#c8b89a', 'stroke="#6a5a42" stroke-width=".2"') + L(sx, -32 - h, sx, -35 - h, '#8a7a5e', 0.3) + C(sx, -30 - h * 0.5, 0.35, lit) + C(sx, -30 - h * 0.3, 0.3, lit);
    return g(x, y, s, 1,
      tier(0, -8, 48, 42, '#c0b092', '#a0906e') + tier(-8, -16, 41, 36, '#c8b89a', '#a8987a') + tier(-16, -24, 35, 31, '#d0c0a2', '#b0a082')
      + Array.from({ length: 3 }, (_, t) => Array.from({ length: 16 }, (_, k) => R(-38 + t * 3 + k * (4.6 - t * 0.4), -6.4 - t * 8, 1.2, 1.4, lit, `opacity="${burning && k % 5 === 0 ? 1 : 0.65}"`)).join('')).join('')
      + P('M-30 -24 L-27 -30 L27 -30 L30 -24Z', '#e0d0b2', 'stroke="#6a5a42" stroke-width=".3"') + Array.from({ length: 14 }, (_, k) => R(-25 + k * 3.6, -28.4, 1.6, 2, lit, 'opacity=".85"')).join('')
      + spire(-24, 14, 3) + spire(24, 14, 3) + spire(-13, 18, 3.2) + spire(13, 18, 3.2) + spire(0, 30, 4)
      + P('M-7 0 L-6 -20 L6 -20 L7 0Z', '#b0a082', 'stroke="#6a5a42" stroke-width=".4"') + R(-4.4, -16, 8.8, 16, burning ? '#ff8a3a' : '#ffe0a0', 'opacity=".85"') + R(-3.6, -15, 7.2, 15, burning ? '#4a1a10' : '#c8a060', 'opacity=".6"') + L(0, -15, 0, 0, '#6a5a42', 0.4) + Array.from({ length: 8 }, (_, k) => R(-9 - k * 0.8, -1 - k * 0.9, 18 + k * 1.6, 0.9, '#d8c8aa', 'stroke="#8a7a5e" stroke-width=".1"')).join('').replace(/./, (m) => m));
  };
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
  // A Jedi Temple Guard: long cream robes under a brown tabard and sash, the
  // tall hood over a smooth brass mask with its eye slit, gloved hands on a
  // yellow double-bladed saber pike held upright.
  const templeGuard = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 3.6, 0.5, '#000', 'opacity=".25"')
    + P('M-2.8 -10 C-3.8 -6 -4.4 -3 -4.6 0 L4.6 0 C4.4 -3 3.8 -6 2.8 -10Z', '#e0d0a8', 'stroke="#5a4a30" stroke-width=".25"') + P('M-1.2 -9 L-1.8 0 M1.2 -9 L1.8 0 M-2.6 -5 L-3.4 0 M2.6 -5 L3.4 0', 'none', 'stroke="#a8946a" stroke-width=".25" opacity=".8"')
    + P('M-1.3 -10.2 L-1.6 0 L1.6 0 L1.3 -10.2Z', '#5a3e24', 'stroke="#2a1c10" stroke-width=".15"') + P('M-1.1 -2.4 L1.1 -2.4 M-1.2 -4.8 L1.2 -4.8', 'none', 'stroke="#c8a060" stroke-width=".18"') + R(-2.6, -6.4, 5.2, 0.9, '#3a2816') + R(-0.5, -6.5, 1, 1.1, '#c8a060', 'stroke="#6a5030" stroke-width=".1"')
    + P('M-3.2 -10 C-3 -11.4 3 -11.4 3.2 -10 L2.6 -8.4 L-2.6 -8.4Z', '#c8b48a', 'stroke="#5a4a30" stroke-width=".2"') + P('M-3.6 -10 L-4 -6 L-2.8 -6.4 L-2.6 -9.6Z M3.6 -10 L4 -6 L2.8 -6.4 L2.6 -9.6Z', '#d8c8a0', 'stroke="#5a4a30" stroke-width=".18"')
    + P('M-2.4 -10.4 C-3.4 -13 -2.6 -16.4 0 -17.4 C2.6 -16.4 3.4 -13 2.4 -10.4Z', '#d8c8a0', 'stroke="#5a4a30" stroke-width=".22"') + P('M-1.6 -10.6 C-2 -12.6 -1.4 -14.6 0 -15 C1.4 -14.6 2 -12.6 1.6 -10.6Z', '#1a140e')
    + P('M-1.3 -10.8 C-1.6 -12.4 -1.1 -14 0 -14.3 C1.1 -14 1.6 -12.4 1.3 -10.8 C0.8 -10.4 -0.8 -10.4 -1.3 -10.8Z', '#c8a85a', 'stroke="#6a5028" stroke-width=".14"') + R(-1.1, -12.9, 2.2, 0.38, '#140e08', 'rx=".15"') + L(0, -14.1, 0, -11, '#8a6a34', 0.14) + P('M-0.9 -13.6 L0.9 -13.6', 'none', 'stroke="#f0d890" stroke-width=".14" opacity=".7"') + L(-0.6, -11.6, 0.6, -11.6, '#8a6a34', 0.12)
    + `<g>${L(2.4, -21.6, 2.4, -14, '#ffd23a', 1.2)}${L(2.4, -21.6, 2.4, -14, '#ffffff', 0.4)}${L(2.4, -4.6, 2.4, 0.6, '#ffd23a', 1.1)}${L(2.4, -4.6, 2.4, 0.6, '#ffffff', 0.36)}</g>` + glow(2.4, -18, 0.8, '#ffd23a', 0.12)
    + R(1.95, -14.2, 0.9, 9.8, '#6a6a72', 'stroke="#2a2a30" stroke-width=".12"') + [-13.4, -11.6, -7.4, -5.4].map((hy) => R(1.85, hy, 1.1, 0.5, '#2a2a30')).join('') + R(1.9, -10, 1, 1.6, '#c8a060', 'stroke="#6a5030" stroke-width=".1"')
    + P('M2.6 -9.8 L3.2 -8.6 L2.4 -8.2 L1.8 -9.2Z M-2.4 -9.4 L0.8 -7.6 L1.4 -8.2 L-1.8 -9.8Z', '#d8c8a0', 'stroke="#5a4a30" stroke-width=".15"') + C(2.4, -11.8, 0.55, '#3a2816') + C(2.4, -7.6, 0.55, '#3a2816'));
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
  const mace = (x, y, s, f = 1) => robed(x, y, s, f, { robe: '#4a3a2a', tunic: '#a8906a', skin: '#5a3a26', saber: '#b04aff', ang: -10, fold: '#2a1e14', beard: 'M-0.7 -11.35 Q0 -10.85 0.7 -11.35 Q0.55 -10.75 0 -10.7 Q-0.55 -10.75 -0.7 -11.35Z', hairC: '#c89a80' });
  // The Inquisitors: black armour and robes, grey or masked faces, red
  // spinning sabers.
  const inquisitor = (x, y, s, f, o) => g(x, y, s, f,
    E(0, 0.2, 3.4, 0.5, '#000', 'opacity=".3"')
    + P('M-2.8 -10.4 C-4 -6 -4.6 -3 -4.8 0 L4.8 0 C4.6 -3 4 -6 2.8 -10.4Z', '#14141a', 'stroke="#000" stroke-width=".2"') + P('M-1.4 -10 L-1.8 0 M1.4 -10 L1.8 0 M-3 -5 L-3.8 0 M3 -5 L3.8 0', 'none', 'stroke="#2a2a32" stroke-width=".3"') + R(-1.6, -5.6, 3.2, 5.6, '#1e1e26')
    + P('M-2.2 -11 L-2 -6 L2 -6 L2.2 -11 C1 -11.6 -1 -11.6 -2.2 -11Z', '#2a2a32', 'stroke="#000" stroke-width=".2"') + P('M-1.6 -10.4 L-1.4 -7.4 L1.4 -7.4 L1.6 -10.4Z', '#3a3a44', 'stroke="#14141a" stroke-width=".12"') + [-9.6, -8.8, -8].map((yy) => L(-1.3, yy, 1.3, yy, '#5a5a66', 0.15)).join('') + R(-2, -6.6, 4, 0.8, '#5a1a1a') + R(-0.6, -6.8, 1.2, 1.2, '#8a8a90', 'stroke="#3a3a40" stroke-width=".1"') + C(0, -6.2, 0.3, '#c83a2a')
    + P('M-3.6 -10.4 L-2 -11.4 L-1.8 -9.8 L-3.4 -9.2Z M3.6 -10.4 L2 -11.4 L1.8 -9.8 L3.4 -9.2Z', '#3a3a44', 'stroke="#000" stroke-width=".15"') + P('M-3.6 -10.4 L-4.4 -11.2 M3.6 -10.4 L4.4 -11.2', 'none', 'stroke="#5a5a66" stroke-width=".35"')
    + P('M-2.2 -10 C-2.8 -8 -3 -6.6 -3.2 -5', 'none', 'stroke="#14141a" stroke-width=".8"') + R(-3.6, -5.6, 0.9, 1, '#3a3a44')
    + (o.head ? o.head : o.mask ? C(0, -12.6, 1.55, '#2a2a32', 'stroke="#000" stroke-width=".2"') + P('M-1.55 -12.4 L-1.2 -11 L1.2 -11 L1.55 -12.4', '#1e1e26') + P('M-1.2 -12.9 L-0.3 -12.6 L-0.4 -12.1 L-1.2 -12.3Z M1.2 -12.9 L0.3 -12.6 L0.4 -12.1 L1.2 -12.3Z', '#c83a2a') + [-0.6, 0, 0.6].map((px) => L(px, -11.8, px, -11.1, '#5a5a62', 0.12)).join('') + P('M-1.5 -13.2 Q0 -14.6 1.5 -13.2', 'none', 'stroke="#5a5a62" stroke-width=".25"') + P('M-0.2 -14.1 L0.2 -14.1 L0.1 -12.9 L-0.1 -12.9Z', '#5a5a62')
      : E(0, -12.8, 1.35, 1.75, o.skin || '#a8a8a0', 'stroke="#4a4a44" stroke-width=".15"') + P('M-0.9 -14.4 C-0.6 -14.9 0.6 -14.9 0.9 -14.4 M-1.1 -13.9 C-0.5 -14.4 0.5 -14.4 1.1 -13.9', 'none', 'stroke="#6a6a62" stroke-width=".2"') + P('M-1.2 -13.4 L-0.8 -11.2 M1.2 -13.4 L0.8 -11.2 M-0.7 -14.2 L-0.7 -13.4 M0.7 -14.2 L0.7 -13.4', 'none', 'stroke="#5a5a52" stroke-width=".16"')
        + P('M-1 -13.4 L-0.25 -13.2 M1 -13.4 L0.25 -13.2', 'none', 'stroke="#2a2a26" stroke-width=".22"') + E(-0.55, -12.9, 0.3, 0.22, '#2a1a10') + E(0.55, -12.9, 0.3, 0.22, '#2a1a10') + C(-0.55, -12.9, 0.17, '#ffb02a') + C(0.55, -12.9, 0.17, '#ffb02a') + C(-0.55, -12.9, 0.07, '#1a0a0a') + C(0.55, -12.9, 0.07, '#1a0a0a') + P('M0 -12.6 L-0.15 -12 L0.15 -12', 'none', 'stroke="#6a6a62" stroke-width=".12"')
        + P('M-0.6 -11.6 Q0 -11.2 0.6 -11.6 L0.5 -11.4 Q0 -11 -0.5 -11.4Z', '#2a1414') + P('M-0.45 -11.55 l.1 .2 l.1 -.2 l.1 .2 l.1 -.2 l.1 .2 l.1 -.2 l.1 .2', 'none', 'stroke="#f0ece0" stroke-width=".08"') + (o.tattoo ? P('M-1 -12.2 L-1.3 -11.4 M1 -12.2 L1.3 -11.4 M-0.3 -14 L0.3 -14', 'none', 'stroke="#8a3a2a" stroke-width=".18"') : ''))
    + P('M2 -10 L3.6 -8.4 L3.2 -8 L1.8 -9.2Z', '#2a2a32') + C(3.6, -8.2, 0.5, '#2a2a32') + `<g transform="translate(3.6 -8) rotate(${o.ang || 30})">${C(0, 0, 1.2, '#5a5a62', 'stroke="#2a2a32" stroke-width=".2"')}${C(0, 0, 0.5, '#2a2a32')}${[0, 120, 240].map((a) => L(0, 0, Math.cos((a * Math.PI) / 180) * 1.1, Math.sin((a * Math.PI) / 180) * 1.1, '#8a8a92', 0.15)).join('')}${o.spin ? P('M-6.4 -6.4 A9 9 0 0 1 6.4 -6.4', 'none', 'stroke="#ff2a1a" stroke-width=".5" opacity=".3"') + P('M6.4 6.4 A9 9 0 0 1 -6.4 6.4', 'none', 'stroke="#ff2a1a" stroke-width=".5" opacity=".3"') : ''}${L(0, -1.2, 0, -9, '#ff2a1a', 1.1)}${L(0, -1.2, 0, -9, '#ffe0d8', 0.35)}${L(0, 1.2, 0, 9, '#ff2a1a', 1.1)}${L(0, 1.2, 0, 9, '#ffe0d8', 0.35)}</g>` + glow(3.6, -8, 1.2, '#ff2a1a', 0.14));
  const grandInq = (x, y, s, f = 1) => inquisitor(x, y, s, f, { skin: '#9aa0a0', spin: true, ang: 20, tattoo: true });
  const fifthBro = (x, y, s, f = 1) => inquisitor(x, y, s, f, { skin: '#b8b4a8', ang: -30 });
  const secondSis = (x, y, s, f = 1) => inquisitor(x, y, s, f, { mask: true, spin: true, ang: 50 });

  // ---------- Machines ----------
  // An ARC-170 from above, nose right: the long fuselage with its red
  // Republic markings, the split S-foils, the big wing cannons, the tail
  // gunner's turret and the engines glowing.
  const arc170 = (x, y, s, a = 0) => g(x, y, s, 1,
    [-1, 1].map((sd) => P(`M-6 ${sd * 2} L-4 ${sd * 13} L0 ${sd * 13} L4 ${sd * 2.4}Z`, '#dcd8d0', 'stroke="#5a564e" stroke-width=".3"') + [5, 8, 11].map((t) => L(-5 + t * 0.15, sd * t, -0.6 + t * 0.2, sd * t, '#a8a49c', 0.15)).join('') + R(-3, sd > 0 ? 9.6 : -12.6, 14, 3, '#cac6be', 'stroke="#5a564e" stroke-width=".25"') + [0, 3, 6, 9].map((px) => L(px, sd > 0 ? 9.6 : -12.6, px, sd > 0 ? 12.6 : -9.6, '#9a968e', 0.15)).join('') + R(11, sd > 0 ? 10.6 : -11.6, 6.4, 1, '#3a3a40') + R(15, sd > 0 ? 10.4 : -11.8, 1.2, 1.4, '#2a2a30') + P(`M-3 ${sd * 6} L1 ${sd * 6} L0 ${sd * 10} L-3 ${sd * 10}Z`, '#a83a2a') + R(-8, sd > 0 ? 9.6 : -13, 5, 3.4, '#8a8a90', 'rx=".8" stroke="#4a4a50" stroke-width=".2"') + glow(-8.6, sd * 11.3, 1, '#ff9a6a', 0.55) + C(-8.2, sd * 11.3, 0.6, '#ffd0a8') + L(-4, sd * 4, -4, sd * 12, '#a8a49c', 0.15)).join('')
    + P('M-12 -2 L8 -2.4 L18 -0.8 L19 0 L18 0.8 L8 2.4 L-12 2Z', '#ece8e0', 'stroke="#5a564e" stroke-width=".35"') + P('M-12 -2 L8 -2.4 L18 -0.8 L-12 -0.4Z', '#ffffff', 'opacity=".4"') + R(4, -1.8, 9, 3.6, '#a83a2a', 'opacity=".85"') + P('M8 -1.4 L13 -0.6 L13 0.6 L8 1.4Z', '#1a2a3a') + L(10.6, -1, 10.6, 1, '#ece8e0', 0.2) + P('M8.6 -1 L10 -0.6', 'none', 'stroke="#8ab0d0" stroke-width=".25"') + [-8, -4, 0, 2].map((px) => L(px, -2, px, 2, '#a8a49c', 0.2)).join('') + C(-2, 0, 0.9, '#e8ecf0', 'stroke="#4a5a7a" stroke-width=".15"') + C(-2, 0, 0.4, '#3a6ab8') + R(15, -0.4, 4, 0.8, '#3a3a40')
    + C(-11, 0, 1.6, '#c8c4bc', 'stroke="#5a564e" stroke-width=".25"') + C(-11, 0, 0.7, '#1a2a3a') + L(-12.4, 0, -15, 0, '#3a3a40', 0.6) + P('M-12 -2 L-14.4 -4.4 L-14.4 4.4 L-12 2', 'none', 'stroke="#a8a49c" stroke-width=".7"') + P('M-14.4 -4.4 L-15.4 -4.4 M-14.4 4.4 L-15.4 4.4', 'none', 'stroke="#a83a2a" stroke-width=".6"'), a);
  // A Republic LAAT gunship side-on, nose right: the green-grey hull with its
  // red markings, the open troop door, the bubble turrets, the wings with
  // their missile pods, the rear engines glowing.
  const laat = (x, y, s, f = 1) => g(x, y, s, f,
    P('M-18 -2.4 L-13 -6.6 L6 -6.6 L12 -4.4 L17 -1.4 L19 0.6 L16 3 L-13 3 L-18 0.8Z', '#7a8a6a', 'stroke="#3a4232" stroke-width=".35"') + P('M-18 -2.4 L-13 -6.6 L6 -6.6 L12 -4.4 L17 -1.4 L-16 -0.6Z', '#9aaa8a', 'opacity=".5"') + [-14, -10, 4, 8, 12].map((px) => L(px, -6.4, px, 2.8, '#5a6a4a', 0.2)).join('') + L(-17, 1.6, 17, 1.6, '#5a6a4a', 0.25)
    + R(-7, -5.4, 10, 7.4, '#2a2e24', 'stroke="#3a4232" stroke-width=".3"') + R(-6.4, -4.8, 8.8, 6.2, '#4a3a2c') + E(-2, 0.8, 4, 0.7, '#ffd890', 'opacity=".4"') + [-5, -2.4, 0.2].map((px) => `<g transform="translate(${px} 1.2) scale(.42)">${clone(0, 0, 1, 1, false)}</g>`).join('')
    + P('M9 -5.6 L15 -2.8 L14 -1.2 L9 -2.6Z', '#1a2a2a') + L(11.4, -4.6, 11.4, -2, '#7a8a6a', 0.2) + C(16.4, 2, 1.6, '#3a4a3a', 'stroke="#2a3226" stroke-width=".2"') + C(16.4, 2, 0.7, '#5a7a8a') + L(17.4, 2.4, 20, 2.8, '#2a2e2a', 0.4)
    + P('M-13 -6.6 L-7 -11 L5 -11 L7 -6.6Z', '#6a7a5a', 'stroke="#3a4232" stroke-width=".3"') + R(-10, -13, 20, 2, '#6a7a5a', 'stroke="#3a4232" stroke-width=".25"') + [-9, 9].map((px) => R(px - 1.4, -14.8, 2.8, 2, '#5a6a4a', 'stroke="#3a4232" stroke-width=".2"') + [-0.7, 0, 0.7].map((dx) => C(px + dx, -13.8, 0.25, '#2a2e24')).join('')).join('')
    + [-11, 13].map((px) => C(px, -7, 1.8, '#3a5a6a', 'stroke="#3a4232" stroke-width=".3"') + C(px - 0.5, -7.5, 0.6, '#8ab0c8', 'opacity=".7"') + L(px, -7, px + 3, -8, '#2a2e24', 0.4)).join('') + P('M10 2.6 L12 6.4 L14.6 6.4 L14 3Z', '#7a8a6a', 'stroke="#3a4232" stroke-width=".2"')
    + P('M-5 -6.2 L2 -6.2 M14 -1.4 L17.4 -0.6 M-4 -10.4 L2 -10.4', 'none', 'stroke="#a83a2a" stroke-width=".7"') + P('M-17 -1 L-13 -1', 'none', 'stroke="#3a6ad8" stroke-width=".7"')
    + R(-20, -4.6, 3, 7, '#5a6a4a', 'stroke="#3a4232" stroke-width=".25"') + [-3, -0.8, 1.4].map((yy) => glow(-20.6, yy, 0.8, '#9fd8ff', 0.5) + C(-20.2, yy, 0.45, '#d8f0ff')).join(''));
  // A training remote: the hovering sphere with its gridded shell, emitter
  // ports and antenna, firing a stinging red bolt.
  const remote = (x, y, r, fx, fy) => C(x, y, r, '#4a4a52', 'stroke="#2a2a30" stroke-width=".2"') + P(`M${x - r} ${y} Q${x} ${y + r * 0.5} ${x + r} ${y}`, 'none', 'stroke="#8a8a92" stroke-width=".2"') + P(`M${x} ${y - r} Q${x + r * 0.5} ${y} ${x} ${y + r}`, 'none', 'stroke="#8a8a92" stroke-width=".2"') + [0, 72, 144, 216, 288].map((a) => C(x + Math.cos((a * Math.PI) / 180) * r * 0.7, y + Math.sin((a * Math.PI) / 180) * r * 0.7, r * 0.18, '#c8c8d0')).join('') + C(x - r * 0.3, y - r * 0.35, r * 0.25, '#ffffff', 'opacity=".35"') + L(x, y - r, x + r * 0.3, y - r * 1.6, '#8a8a92', 0.2) + C(x + r * 0.3, y - r * 1.6, 0.2, '#ff3a2a') + C(x + (fx - x) * 0.08, y + (fy - y) * 0.08, r * 0.22, '#ff3a2a') + glow(x + (fx - x) * 0.08, y + (fy - y) * 0.08, r * 0.3, '#ff3a2a', 0.5) + bolt(x + (fx - x) * 0.25, y + (fy - y) * 0.25, x + (fx - x) * 0.5, y + (fy - y) * 0.5, '#ff4a2a') + glow(x + (fx - x) * 0.5, y + (fy - y) * 0.5, 0.5, '#ff4a2a', 0.5);
  // A bronze bust of one of the Lost Twenty on its plinth with its plaque.
  const bust = (x, y, s) => g(x, y, s, 1, R(-2.4, -7, 4.8, 7, '#3a2e24', 'stroke="#1a140e" stroke-width=".2"') + R(-2.8, -7.6, 5.6, 0.8, '#5a4636') + R(-2.8, -0.6, 5.6, 0.6, '#5a4636') + R(-1.2, -4.6, 2.4, 1, '#c8a060', 'opacity=".7"')
    + P('M-2.6 -7.6 C-2.6 -9.6 -1.6 -10.4 0 -10.4 C1.6 -10.4 2.6 -9.6 2.6 -7.6Z', '#a87a3a', 'stroke="#5a3a1a" stroke-width=".2"') + R(-0.5, -11.2, 1, 1, '#a87a3a') + E(0, -12.6, 1.3, 1.6, '#b88a46', 'stroke="#5a3a1a" stroke-width=".2"') + P('M0.2 -14.2 C1.2 -14 1.4 -12 1 -11.2 C0.6 -11.6 0.4 -12.8 0.2 -14.2Z', '#7a5420', 'opacity=".6"') + P('M-0.8 -12.8 L-0.3 -12.7 M0.3 -12.7 L0.8 -12.8 M-0.3 -11.6 L0.3 -11.6', 'none', 'stroke="#5a3a1a" stroke-width=".15"') + C(-0.6, -13.4, 0.3, '#e8c890', 'opacity=".5"') + P('M-2 -8.6 Q0 -9.4 2 -8.6', 'none', 'stroke="#d8b070" stroke-width=".2" opacity=".6"'));
  // The Inquisitors' black transport, the Scythe: its curved crescent wings,
  // the central hull, red-lit cockpit, the ramp down.
  const scythe = (x, y, s) => g(x, y, s, 1,
    E(0, 10, 26, 2, '#000', 'opacity=".3"') + P('M-30 6 C-26 -6 -12 -14 0 -14 C12 -14 26 -6 30 6 L26 7 C22 -2 12 -9 0 -9 C-12 -9 -22 -2 -26 7Z', '#2a2a32', 'stroke="#6a6a74" stroke-width=".35"') + P('M-28 4 C-24 -5 -12 -12 0 -12', 'none', 'stroke="#8a8a94" stroke-width=".25"') + Array.from({ length: 9 }, (_, k) => { const t = (k + 1) / 10; const an = Math.PI * (1 - t); return L(Math.cos(an) * 28, 5 - Math.sin(an) * 18, Math.cos(an) * 24, 6 - Math.sin(an) * 14, '#4a4a54', 0.2); }).join('')
    + P('M-8 6 L-6 -6 L6 -6 L8 6Z', '#32323c', 'stroke="#6a6a74" stroke-width=".3"') + P('M-3.4 -5 L3.4 -5 L2.6 -1.6 L-2.6 -1.6Z', '#ff3a2a', 'opacity=".6"') + glow(0, -3.4, 2, '#ff3a2a', 0.3) + [-5, 5].map((px) => L(px, -5, px * 1.2, 5, '#4a4a54', 0.25)).join('') + P('M-4 6 L4 6 L6 14 L-6 14Z', '#22222a', 'stroke="#4a4a54" stroke-width=".2"') + glow(0, 9, 2.4, '#ff8a6a', 0.3) + [-26, 26].map((px) => glow(px, 6, 1.2, '#ff3a2a', 0.5)).join(''));
  // Ornate stone wall panels with carved reliefs and lamp sconces.
  const reliefWall = (x, y, w, h, c = '#8a7458', d = '#5a4a36') => R(x, y, w, h, c, `stroke="${d}" stroke-width=".3"`) + R(x + w * 0.1, y + h * 0.1, w * 0.8, h * 0.5, 'none', `stroke="${d}" stroke-width=".3"`) + P(`M${x + w * 0.2} ${y + h * 0.55} L${x + w * 0.35} ${y + h * 0.25} L${x + w * 0.5} ${y + h * 0.45} L${x + w * 0.65} ${y + h * 0.2} L${x + w * 0.8} ${y + h * 0.55}`, 'none', `stroke="${d}" stroke-width=".3"`) + C(x + w * 0.5, y + h * 0.28, w * 0.06, 'none', `stroke="${d}" stroke-width=".25"`) + R(x + w * 0.1, y + h * 0.7, w * 0.8, h * 0.18, 'none', `stroke="${d}" stroke-width=".25"`);
  const sconce = (x, y, c = '#ffd890') => R(x - 0.8, y, 1.6, 2.4, '#5a4a36') + C(x, y - 0.4, 0.8, c) + glow(x, y - 0.4, 1.4, c, 0.35);

  const CO = {
    // 1 · Temple Approach: night over Coruscant. The Jedi Temple stands at
    // the end of the processional way: three ribbed terraces lit with
    // windows, the great doors, and five fluted spires with their crowns,
    // smoke beginning to rise. Landing pads, beacons and the lit skyline with
    // its traffic surround it; lamp posts line the avenue and a column of
    // 501st clones marches up between the Jedi statues.
    temple_approach: () => fill([[0, '#0a0e1e'], [0.5, '#2a2a4a'], [0.85, '#6a4a5a'], [1, '#c8806a']])
      + starfield(30, 1) + skyline(66, '#1a1e2e', '#ffd890', 0.6, 1, 26, 20, 50) + traffic([[24, 1], [32, -1], [42, 1]], 1) + skyline(70, '#14182a', '#ffcf7a', 0.85, 4, 18, 10, 30)
      + [[20, 54], [140, 52]].map(([x, y]) => E(x, y, 8, 1.4, '#4a4e5a', 'stroke="#6a6e7a" stroke-width=".2"') + R(x - 0.6, y, 1.2, 12, '#3a3e4a') + Array.from({ length: 6 }, (_, k) => C(x - 7 + k * 2.8, y, 0.3, '#ff4a3a')).join('')).join('')
      + smoke(82, 14, 24, 0.5) + temple(80, 60, 0.95, true) + fire(80, 44, 1.8)
      + P('M52 60 L108 60 L144 90 L16 90Z', '#8a7a62') + P('M52 60 L108 60 L144 90 L16 90Z', 'none', 'stroke="#5a4a36" stroke-width=".4"') + Array.from({ length: 8 }, (_, k) => L(80 - 28 - k * 4.6, 60 + k * 3.8, 80 + 28 + k * 4.6, 60 + k * 3.8, '#6a5a46', 0.25)).join('') + L(80, 60, 80, 90, '#6a5a46', 0.3) + Array.from({ length: 6 }, (_, k) => L(80 - 14 - k * 3, 60, 80 - 40 - k * 6, 90, '#6a5a46', 0.15) + L(80 + 14 + k * 3, 60, 80 + 40 + k * 6, 90, '#6a5a46', 0.15)).join('')
      + templeGuard(72.5, 60.4, 0.8, 1) + templeGuard(87.5, 60.4, 0.8, -1)
      + [[56, 62, 0.6], [104, 62, 0.6], [44, 70, 0.9], [116, 70, 0.9], [26, 84, 1.3], [134, 84, 1.3]].map(([x, y, sc]) => L(x, y, x, y - 12 * sc, '#3a3a40', 0.5 * sc) + E(x, y - 12 * sc, 1.2 * sc, 0.8 * sc, '#ffe8b0') + glow(x, y - 12 * sc, 1.2 * sc, '#ffe8b0', 0.4)).join('')
      + [[48, 64, 0.8], [112, 64, 0.8], [36, 74, 1.1], [124, 74, 1.1], [18, 88, 1.5], [142, 88, 1.5]].map(([x, y, sc]) => statue(x, y, sc)).join('')
      + [[72, 64, 1.1], [88, 64, 1.1], [68, 70, 1.4], [92, 70, 1.4], [64, 78, 1.8], [96, 78, 1.8], [58, 88, 2.4], [102, 88, 2.4]].map(([x, y, sc], k) => clone(x, y, sc, k % 2 ? -1 : 1, false)).join(''),

    // 2 · Skylane Patrol (fleet): through Coruscant's canyons of light at
    // dusk. Towers with balconies, landing pads and glowing signs rise on
    // every side, layer after layer into the haze, lanes of air traffic stream
    // past, and three detailed ARC-170s sweep through in formation.
    skylane_patrol: () => fill([[0, '#1a1e3a'], [0.5, '#5a3a5a'], [0.8, '#c8706a'], [1, '#f0a070']])
      + skyline(76, '#3a3450', '#ffd890', 0.4, 2, 26, 30, 64) + traffic([[20, 1], [26, -1]], 4) + skyline(82, '#2a2e44', '#ffd890', 0.6, 3, 22, 34, 70) + traffic([[34, 1], [42, -1], [50, 1]], 2) + skyline(92, '#1a1e2e', '#ffcf7a', 0.9, 5, 14, 30, 80)
      + [[30, 40], [128, 34], [40, 64], [120, 60]].map(([x, y]) => E(x, y, 6, 1.2, '#4a4e5e', 'stroke="#6a6e7e" stroke-width=".2"') + Array.from({ length: 5 }, (_, k) => C(x - 5 + k * 2.5, y, 0.25, '#ffcf3a')).join('')).join('') + [[24, 54, '#ff5aa8'], [134, 46, '#5ad8ff'], [118, 70, '#ffcf3a']].map(([x, y, c]) => R(x - 3, y - 1.4, 6, 2.8, c, 'opacity=".55"') + glow(x, y, 2.4, c, 0.2)).join('')
      + arc170(64, 36, 1.35, -8) + arc170(100, 22, 1, -8) + arc170(106, 54, 0.9, -8)
      + traffic([[66, -1], [74, 1]], 7)
      + R(0, 0, 14, 90, '#14182a') + Array.from({ length: 30 }, (_, k) => R(2 + (k % 3) * 4, 2 + Math.floor(k / 3) * 9, 2, 3, '#ffd890', 'opacity=".55"')).join('') + R(146, 0, 14, 90, '#14182a') + Array.from({ length: 30 }, (_, k) => R(148 + (k % 3) * 4, 4 + Math.floor(k / 3) * 9, 2, 3, '#ffd890', 'opacity=".55"')).join('') + [0, 146].map((x) => [20, 50].map((y) => R(x, y, 14, 1.6, '#2a2e40')).join('')).join(''),

    // 3 · Temple Guard: inside the Temple's great hall. Fluted columns with
    // carved capitals march away under a coffered ceiling, carved relief
    // panels and lamp sconces line the walls, banners hang between the
    // columns, a glowing doorway at the end, light falling in long shafts
    // across the patterned floor; Barriss stands with her blue saber lit,
    // clones advancing on either side.
    temple_guard: () => fill([[0, '#3a2e24'], [0.5, '#6a5442'], [1, '#2a2018']])
      + Array.from({ length: 8 }, (_, k) => R(4 + k * 20, 0, 18, 6, '#4a3a2a', 'stroke="#2a2018" stroke-width=".3"') + R(7 + k * 20, 1.4, 12, 3.2, '#3a2c20')).join('') + R(70, 30, 20, 34, '#ffe0a0', 'opacity=".6"') + glow(80, 48, 10, '#ffe0a0', 0.12) + reliefWall(72, 30, 16, 34, '#e8d0a0', '#a88a5a').replace(/^/, '')
      + [-1, 1].map((sd) => Array.from({ length: 6 }, (_, k) => { const x = 80 + sd * (12 + k * 13); const w = 4 + k * 1.4; const h = 64 + k * 4; return reliefWall(x + sd * w * 0.5 + (sd < 0 ? -9 : 0), 18 + k * 2, 9, 20, '#7a6448', '#5a4a36') + R(x - w / 2, 6, w, h - 6, '#a8906a', 'stroke="#5a4a36" stroke-width=".3"') + Array.from({ length: 4 }, (_, m) => L(x - w / 2 + (m + 0.5) * w / 4, 8, x - w / 2 + (m + 0.5) * w / 4, h - 2, '#7a6a52', 0.2)).join('') + R(x - w / 2 - 1, 6, w + 2, 2.4, '#c8b088', 'stroke="#5a4a36" stroke-width=".2"') + R(x - w / 2 - 1, h - 2, w + 2, 3, '#8a7a5e') + (k % 2 ? R(x + sd * (w / 2 + 2) - 2, 10, 4, 14, '#7a2a1e', 'stroke="#4a1a10" stroke-width=".2"') + C(x + sd * (w / 2 + 2), 16, 1, '#c8a040') : sconce(x + sd * (w / 2 + 2.4), 24)); }).join('')).join('')
      + [0.15, 0.35, 0.55].map((t) => P(`M${20 + t * 120} 0 L${30 + t * 120} 0 L${10 + t * 160} 90 L${t * 160} 90Z`, '#fff0c8', 'opacity=".08"')).join('')
      + P('M0 64 L160 64 L160 90 L0 90Z', '#8a7458') + Array.from({ length: 9 }, (_, k) => L(80, 64, -40 + k * 30, 90, '#6a5a44', 0.3)).join('') + Array.from({ length: 5 }, (_, k) => L(0, 67 + k * 5, 160, 67 + k * 5, '#6a5a44', 0.2)).join('') + E(80, 78, 30, 4, 'none', 'stroke="#c8a070" stroke-width=".5"') + E(80, 76, 50, 6, '#fff0c8', 'opacity=".1"')
      + templeGuard(66, 66, 1.7, 1) + templeGuard(94, 66, 1.7, -1) + barriss(80, 80, 3, 1) + clone(40, 82, 2.6, 1) + clone(56, 74, 2, 1) + clone(120, 82, 2.6, -1) + clone(104, 74, 2, -1)
      + shots([53, 66.5], [74, 66], [0.4], 0.3, '#ff4a2a'),

    // 4 · The Archives: the Jedi Archives as they are. The long hall under its
    // tall vaulted ceiling with ribbed arches and a row of skylight panels;
    // two tiers of glowing blue holobook shelves on each side, the upper
    // gallery with its railing; bronze busts of the Lost Twenty on their
    // plinths lining the central aisle; reading tables with lamps; Cal Kestis
    // with his blue saber lit as clones close in.
    the_archives: () => fill([[0, '#1a1e28'], [0.5, '#141820'], [1, '#08090e']])
      + Array.from({ length: 7 }, (_, k) => { const w = 60 - k * 7; const yy = 2 + k * 2.6; return P(`M${80 - w} ${yy + 10} Q${80} ${yy - 8 + k} ${80 + w} ${yy + 10}`, 'none', `stroke="#4a5060" stroke-width="${1.6 - k * 0.15}"`); }).join('') + Array.from({ length: 6 }, (_, k) => R(80 - 4 + k * 0.1, 2 + k * 3, 8 - k * 0.2, 2, '#c8e0f0', `opacity="${0.6 - k * 0.07}"`)).join('') + P('M74 0 L86 0 L96 90 L64 90Z', '#c8e8ff', 'opacity=".05"')
      + [-1, 1].map((sd) => Array.from({ length: 8 }, (_, k) => { const x1 = 80 + sd * (7 + k * 9); const x2 = 80 + sd * (10 + k * 11.4); const top = 22 - k * 2.6; const mid = 40 + k * 1.2; const bot = 58 + k * 4; const shelf = (t1, b1) => P(`M${x1} ${t1} L${x2} ${t1 - 2.6} L${x2} ${b1 + 3} L${x1} ${b1}Z`, '#14243a', 'stroke="#3a5a7a" stroke-width=".2"') + Array.from({ length: 6 }, (_, m) => { const y1 = t1 + ((b1 - t1) * (m + 0.5)) / 6; const y2 = t1 - 2.6 + ((b1 + 3 - t1 + 2.6) * (m + 0.5)) / 6; return L(x1, y1, x2, y2, '#5ad8ff', 0.35) + L(x1, y1 + 0.7, x2, y2 + 0.8, '#2a6a9a', 0.45); }).join(''); return shelf(top, mid - 2) + shelf(mid + 1, bot) + L(x1, mid - 1, x2, mid - 2, '#8a7a5e', 0.6) + L(x1, mid - 3.4, x2, mid - 4.4, '#8a7a5e', 0.25) + L(x1, mid - 3.4, x1, mid - 1, '#8a7a5e', 0.2); }).join('')).join('')
      + R(73, 22, 14, 36, '#3a5a7a', 'opacity=".2"') + glow(80, 40, 8, '#5ad8ff', 0.1)
      + P('M74 58 L86 58 L110 90 L50 90Z', '#3a2a2a') + P('M76 58 L84 58 L100 90 L60 90Z', '#5a2a2a', 'opacity=".7"')
      + [[-1, 0], [1, 0], [-1, 1], [1, 1], [-1, 2], [1, 2]].map(([sd, k]) => bust(80 + sd * (10 + k * 14), 62 + k * 7, 0.7 + k * 0.38)).join('')
      + [[-1, 30, 74], [1, 130, 74]].map(([sd, x, y]) => R(x - 7, y - 1, 14, 1.4, '#5a4636', 'stroke="#2a1e14" stroke-width=".2"') + L(x - 6, y, x - 6, y + 6, '#3a2a1e', 0.6) + L(x + 6, y, x + 6, y + 6, '#3a2a1e', 0.6) + L(x + sd * 3, y - 1, x + sd * 3, y - 4, '#8a7a5e', 0.3) + C(x + sd * 3, y - 4.4, 0.8, '#5ad8ff') + glow(x + sd * 3, y - 4.4, 1, '#5ad8ff', 0.4)).join('')
      + P('M0 62 L160 62 L160 90 L0 90Z', '#0e1824', 'opacity=".6"') + Array.from({ length: 9 }, (_, k) => L(80, 58, -40 + k * 30, 90, '#1e2e40', 0.3)).join('')
      + templeGuard(58, 77, 2.1, 1) + cal(80, 84, 3, 1) + clone(40, 84, 2.6, 1) + clone(122, 84, 2.6, -1) + clone(108, 76, 2, -1),

    // 5 · The Inquisitors Arrive: a Temple landing platform under the burning
    // night sky. The Scythe, the Inquisitors' black transport, settles with
    // its crescent wings and red-lit cockpit, ramp down; the Second Sister in
    // her helmet with her saber spinning and the tall Fifth Brother stride
    // off past clone troopers at attention; railings, landing lights,
    // markings, the city burning beyond.
    the_inquisitors_arrive: () => fill([[0, '#0a0a14'], [0.6, '#3a1e24'], [1, '#8a3a2a']])
      + starfield(20, 5) + skyline(60, '#1a1418', '#ffb060', 0.6, 5, 22, 20, 46) + traffic([[30, 1]], 5) + smoke(30, 40, 30, 0.5) + smoke(130, 40, 26, 0.45) + fire(30, 44, 2) + fire(130, 44, 1.6) + temple(140, 60, 0.32, true)
      + scythe(80, 46, 1.25)
      + P('M0 64 L160 64 L160 90 L0 90Z', '#4a4a52') + E(80, 72, 72, 9, '#5a5a62', 'stroke="#ffcf3a" stroke-width=".5" opacity=".85"') + E(80, 72, 46, 6, 'none', 'stroke="#ffcf3a" stroke-width=".35" opacity=".6"') + Array.from({ length: 16 }, (_, k) => { const an = (k / 16) * Math.PI * 2; return C(80 + Math.cos(an) * 68, 72 + Math.sin(an) * 8, 0.5, '#ffe0a0') + glow(80 + Math.cos(an) * 68, 72 + Math.sin(an) * 8, 0.4, '#ffe0a0', 0.4); }).join('') + P('M0 64 L160 64', 'none', 'stroke="#8a8a92" stroke-width=".5"') + Array.from({ length: 17 }, (_, k) => L(k * 10, 60, k * 10, 64, '#6a6a72', 0.4)).join('') + L(0, 60, 160, 60, '#8a8a92', 0.5)
      + secondSis(64, 80, 2.8, 1) + fifthBro(100, 80, 3, -1)
      + clone(24, 82, 2.4, 1, false) + clone(40, 84, 2.5, 1, false) + clone(120, 84, 2.5, -1, false) + clone(136, 82, 2.4, -1, false),

    // 6 · Gunship Run (fleet): over the burning Temple. Smoke pours from the
    // fluted spires into the night, fires burn along the terraces;
    // Republic gunships with their troop doors open and clones inside sweep
    // low with ARC-170s, searchlights cutting the dark over the skyline.
    gunship_run: () => fill([[0, '#0a0e1e'], [0.5, '#3a2a3a'], [1, '#a8584a']])
      + skyline(76, '#1a1e2e', '#ffd890', 0.55, 6, 24, 20, 50) + traffic([[34, -1]], 6) + smoke(70, 26, 40, 0.6) + smoke(92, 30, 36, 0.55) + temple(80, 78, 0.9, true) + fire(68, 48, 2.4) + fire(92, 50, 2) + fire(80, 60, 2.2) + fire(56, 70, 1.6) + fire(104, 70, 1.6)
      + [[30, 0, 60, 76], [130, 0, 100, 76]].map(([x1, y1, x2, y2]) => P(`M${x1 - 2} ${y1} L${x1 + 2} ${y1} L${x2 + 10} ${y2} L${x2 - 10} ${y2}Z`, '#fff4c8', 'opacity=".06"')).join('')
      + laat(40, 30, 1.35, 1) + laat(118, 20, 0.95, -1) + arc170(84, 12, 0.85, 10) + arc170(136, 44, 0.75, 170)
      + R(0, 84, 160, 6, '#14182a'),

    // 7 · Training Halls: a Temple training hall in full. Tall framed windows
    // over the night city, carved wall panels and lamps between them, a
    // balcony rail; training remotes hovering with their gridded shells
    // firing stinging red bolts; a rack of training sabers and helmets; mats
    // and the sparring rings on the floor; Qui-Gon, Barriss and Cal ready.
    training_halls: () => fill([[0, '#4a3e30'], [0.5, '#7a6448'], [1, '#3a2e22']])
      + R(0, 0, 160, 40, '#2a3050') + skyline(38, '#3a4060', '#ffd890', 0.9, 7, 24, 8, 26) + traffic([[16, 1], [22, -1]], 3)
      + P(`M0 0 L160 0 L160 38 L0 38Z ${[20, 54, 88, 122].map((x) => `M${x} 8 L${x} 36 L${x + 18} 36 L${x + 18} 8Z`).join(' ')}`, '#6a5440', 'fill-rule="evenodd" stroke="#5a4a36" stroke-width=".4"') + [20, 54, 88, 122].map((x) => R(x, 8, 18, 28, 'none', 'stroke="#4a3a2a" stroke-width="1.2"') + L(x + 9, 8, x + 9, 36, '#4a3a2a', 0.8) + L(x, 22, x + 18, 22, '#4a3a2a', 0.5) + P(`M${x} 8 Q${x + 9} 2 ${x + 18} 8`, 'none', 'stroke="#8a7458" stroke-width=".8"')).join('') + [6, 44, 78, 112, 148].map((x) => reliefWall(x - 4, 10, 8, 20, '#7a6448', '#4a3a2a') + sconce(x, 32)).join('')
      + R(0, 0, 160, 6, '#5a4a36') + Array.from({ length: 16 }, (_, k) => R(k * 10 + 1, 1, 8, 3, '#4a3a2a')).join('') + R(0, 36, 160, 2, '#8a7458')
      + R(0, 38, 160, 18, '#6a5440') + Array.from({ length: 16 }, (_, k) => R(k * 10 + 2, 40, 6, 14, '#5a4636', 'stroke="#4a3a2a" stroke-width=".2"')).join('') + L(0, 38, 160, 38, '#a8906a', 0.6)
      + R(130, 42, 22, 12, '#4a3a2a', 'stroke="#2a1e14" stroke-width=".3"') + Array.from({ length: 6 }, (_, k) => L(133 + k * 3.2, 43, 133 + k * 3.2, 52, '#8a8a92', 0.5) + C(133 + k * 3.2, 43, 0.4, '#5a5a62')).join('') + [136, 144].map((x) => E(x, 41, 2, 1.4, '#c8b890', 'stroke="#6a5a42" stroke-width=".2"') + R(x - 1.4, 40.6, 2.8, 0.6, '#3a3a40')).join('')
      + P('M0 56 L160 56 L160 90 L0 90Z', '#8a7052') + [[30, 76, 22, 6], [130, 76, 22, 6]].map(([x, y, w, h]) => R(x - w / 2, y - h / 2, w, h, '#4a6a8a', 'opacity=".5"')).join('') + E(80, 72, 60, 10, 'none', 'stroke="#c8a070" stroke-width=".6"') + E(80, 72, 40, 6, 'none', 'stroke="#c8a070" stroke-width=".4"') + C(80, 72, 1.4, '#c8a070') + Array.from({ length: 9 }, (_, k) => L(80, 56, -40 + k * 30, 90, '#6a5640', 0.25)).join('')
      + remote(50, 30, 2.2, 66, 64) + remote(108, 26, 2, 92, 62) + remote(80, 44, 1.8, 76, 66) + remote(30, 46, 1.4, 44, 70)
      + templeGuard(22, 76, 2.2, 1) + templeGuard(140, 76, 2.2, -1) + quigon(80, 80, 3.2, 1) + barriss(48, 82, 2.8, 1) + cal(116, 82, 2.8, -1),

    // 8 · The Purge: a Temple corridor on fire. Carved relief panels and
    // fluted pilasters line the walls, sconces and red light, a coffered
    // ceiling, scorch marks and fallen debris, smoke and drifting embers;
    // the Grand Inquisitor stalks forward with his saber spinning, his
    // Pau'an face lit by the fire, clone troopers at his back.
    the_purge: () => fill([[0, '#1a0e0a'], [0.5, '#4a2014'], [1, '#14080a']])
      + P('M0 0 L56 28 L104 28 L160 0Z', '#2a1a14') + Array.from({ length: 5 }, (_, k) => { const t = (k + 1) / 6; return L(t * 56, t * 28, 160 - t * 56, t * 28, '#4a2e20', 0.4); }).join('') + Array.from({ length: 7 }, (_, k) => L(k * 26.6, 0, 56 + k * 8, 28, '#4a2e20', 0.3)).join('')
      + P('M0 90 L56 62 L104 62 L160 90Z', '#2a1810') + Array.from({ length: 6 }, (_, k) => { const t = (k + 1) / 7; return L(t * 56, 90 - t * 28, 160 - t * 56, 90 - t * 28, '#3a2418', 0.3); }).join('')
      + P('M0 0 L56 28 L56 62 L0 90Z', '#4a2e20') + P('M160 0 L104 28 L104 62 L160 90Z', '#422a1e')
      + [0.1, 0.3, 0.5, 0.7].map((k) => { const x1 = k * 56; const x2 = (k + 0.18) * 56; const y1t = k * 28; const y2t = (k + 0.18) * 28; return P(`M${x1 + 2} ${y1t + 8} L${x2 - 1} ${y2t + 8} L${x2 - 1} ${90 - y2t - 8} L${x1 + 2} ${90 - y1t - 8}Z`, '#5a3a28', 'stroke="#2a1a10" stroke-width=".3"') + P(`M${160 - x1 - 2} ${y1t + 8} L${160 - x2 + 1} ${y2t + 8} L${160 - x2 + 1} ${90 - y2t - 8} L${160 - x1 - 2} ${90 - y1t - 8}Z`, '#523424', 'stroke="#2a1a10" stroke-width=".3"') + P(`M${x1 + 4} ${y1t + 30} L${(x1 + x2) / 2} ${y1t + 20} L${x2 - 3} ${y2t + 30}`, 'none', 'stroke="#2a1a10" stroke-width=".3"') + P(`M${160 - x1 - 4} ${y1t + 30} L${160 - (x1 + x2) / 2} ${y1t + 20} L${160 - x2 + 3} ${y2t + 30}`, 'none', 'stroke="#2a1a10" stroke-width=".3"'); }).join('')
      + [0.2, 0.4, 0.6, 0.8].map((k) => R(k * 56 - 2.4 + k * 0.6, k * 28, 4.8 - k * 2, 90 - k * 56, '#6a4a32', 'stroke="#2a1a10" stroke-width=".3"') + R(160 - k * 56 - 2.4 + k * 1.4, k * 28, 4.8 - k * 2, 90 - k * 56, '#6a4a32', 'stroke="#2a1a10" stroke-width=".3"') + sconce(k * 56 + 1, 30 + k * 6, '#ff9a4a') + sconce(160 - k * 56 - 1, 30 + k * 6, '#ff9a4a')).join('')
      + [[16, 30], [140, 34], [30, 60]].map(([x, y]) => E(x, y, 6, 8, '#140806', 'opacity=".5"')).join('')
      + R(56, 28, 48, 34, '#2a0e08') + fire(70, 62, 3) + fire(92, 62, 2.6) + fire(20, 82, 3.6) + fire(140, 84, 3) + smoke(80, 40, 20, 0.5, '#1a0e0a', '#3a2018')
      + [[30, 84, 6, 2, 20], [126, 86, 5, 2, -14], [60, 78, 4, 1.4, 10]].map(([x, y, w, h, a]) => R(x - w / 2, y - h / 2, w, h, '#6a4a32', `stroke="#2a1a10" stroke-width=".2" transform="rotate(${a} ${x} ${y})"`)).join('')
      + Array.from({ length: 24 }, (_, k) => C((k * 37) % 160, (k * 23) % 80, 0.35, '#ffb060', 'opacity=".8"')).join('')
      + clone(56, 72, 2, 1) + clone(104, 72, 2, -1) + grandInq(80, 84, 3.6, 1),

    council_chamber: () => fill([[0, '#3a2a2a'], [1, '#1a1210']])
      + fill([[0, '#3a2a4a'], [0.6, '#c8806a'], [1, '#f0b070']]).replace('<rect', '<rect') + skyline(54, '#4a3448', '#ffd890', 0.85, 9, 26, 10, 40) + traffic([[22, 1], [30, -1], [38, 1]], 9)
      + P(`M0 0 L160 0 L160 54 L0 54Z ${Array.from({ length: 7 }, (_, k) => { const x = 8 + k * 21; return `M${x} 6 L${x} 52 L${x + 18} 52 L${x + 18} 6Z`; }).join(' ')}`, '#3a2a22', 'fill-rule="evenodd"') + Array.from({ length: 7 }, (_, k) => { const x = 8 + k * 21; return R(x, 6, 18, 46, 'none', 'stroke="#5a4030" stroke-width="1.4"') + L(x, 30, x + 18, 30, '#5a4030', 0.6) + L(x + 9, 6, x + 9, 52, '#5a4030', 0.4); }).join('')
      + R(0, 0, 160, 6, '#4a3a2a') + R(0, 52, 160, 3, '#6a5040')
      + P('M0 55 L160 55 L160 90 L0 90Z', '#8a6a4a') + E(80, 72, 70, 14, '#a8885a', 'stroke="#6a4a2a" stroke-width=".5"') + E(80, 72, 40, 8, 'none', 'stroke="#6a4a2a" stroke-width=".5"') + Array.from({ length: 12 }, (_, k) => { const an = (k / 12) * Math.PI * 2; return L(80 + Math.cos(an) * 40, 72 + Math.sin(an) * 8, 80 + Math.cos(an) * 70, 72 + Math.sin(an) * 14, '#6a4a2a', 0.3); }).join('')
      + Array.from({ length: 8 }, (_, k) => { const an = Math.PI + (k / 7) * Math.PI; const cx = 80 + Math.cos(an) * 62; const cy = 66 + Math.sin(an) * 9; return P(`M${cx - 3} ${cy} L${cx - 3} ${cy - 6} C${cx - 3} ${cy - 8} ${cx + 3} ${cy - 8} ${cx + 3} ${cy - 6} L${cx + 3} ${cy}Z`, '#a85a3a', 'stroke="#5a2a1a" stroke-width=".3"') + R(cx - 3.6, cy - 1, 7.2, 1.4, '#7a3a24'); }).join('')
      + mace(70, 82, 3.2, 1) + quigon(96, 82, 3.1, 1) + clone(140, 84, 2.6, -1),

    // 10 · Order 66: the Temple ablaze against the night. Smoke pours from
    // every fluted spire into a red sky, fires burn along the terraces and
    // the doors, gunships circle with searchlights; the Second Sister, the
    // Grand Inquisitor and the Fifth Brother stand on the processional way
    // with sabers lit, a line of clones and the Jedi statues behind them,
    // embers drifting.
    order_66: () => fill([[0, '#0a0608'], [0.5, '#3a1210'], [0.8, '#8a2a1a'], [1, '#c8582a']])
      + starfield(14, 10) + skyline(62, '#1a0e0e', '#ffb060', 0.55, 10, 24, 18, 44) + traffic([[30, -1]], 10)
      + smoke(66, 16, 40, 0.65, '#1a0e0e', '#3a1e18') + smoke(92, 14, 44, 0.65, '#1a0e0e', '#3a1e18') + smoke(80, 10, 46, 0.55, '#1a0e0e', '#3a1e18')
      + temple(80, 64, 1, true) + fire(56, 44, 2.6) + fire(104, 44, 2.6) + fire(80, 28, 2.4) + fire(66, 56, 2) + fire(94, 56, 2) + fire(80, 62, 2.4) + fire(48, 60, 1.6) + fire(112, 60, 1.6)
      + [[30, 0, 50, 64], [130, 0, 110, 64]].map(([x1, y1, x2, y2]) => P(`M${x1 - 2} ${y1} L${x1 + 2} ${y1} L${x2 + 8} ${y2} L${x2 - 8} ${y2}Z`, '#fff4c8', 'opacity=".05"')).join('') + laat(30, 20, 0.8, 1) + laat(132, 14, 0.6, -1)
      + P('M50 64 L110 64 L150 90 L10 90Z', '#6a5040') + Array.from({ length: 6 }, (_, k) => L(80 - 30 - k * 6, 64 + k * 4.4, 80 + 30 + k * 6, 64 + k * 4.4, '#4a3428', 0.3)).join('') + [[40, 72, 1], [120, 72, 1], [22, 86, 1.4], [138, 86, 1.4]].map(([x, y, sc]) => statue(x, y, sc)).join('')
      + [[58, 70], [66, 70], [74, 70], [86, 70], [94, 70], [102, 70]].map(([x, y], k) => clone(x, y, 1.4, k < 3 ? 1 : -1, false)).join('')
      + Array.from({ length: 22 }, (_, k) => C((k * 37) % 160, 20 + (k * 23) % 60, 0.35, '#ffb060', 'opacity=".8"')).join('')
      + templeGuard(56, 77, 1.75, 1) + templeGuard(104, 77, 1.75, -1) + secondSis(34, 86, 2.7, 1) + grandInq(80, 88, 3.1, 1) + fifthBro(126, 86, 2.8, -1),
  };
  Object.assign(SA.kit = SA.kit || {}, { clone, robed, laat, arc170, inquisitor, skyline, traffic, temple, grandInq, fifthBro, secondSis });
  Object.assign(SA.scenes, CO);
  SA.worlds.coruscant = ['temple_approach', 'skylane_patrol', 'temple_guard', 'the_archives', 'the_inquisitors_arrive', 'gunship_run', 'training_halls', 'the_purge', 'council_chamber', 'order_66'];
})(typeof window !== 'undefined' ? window : globalThis);
