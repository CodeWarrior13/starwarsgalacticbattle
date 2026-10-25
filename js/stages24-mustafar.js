// Update 2.4: the ten Mustafar stage scenes, for approval. Same 160x90
// format as the worlds before, all set on the volcano world in the age of the
// Inquisitorius: TIEs over the lava fields, purge troopers on patrol, the
// old mining facility, Obi-Wan and Ahsoka's rescue, the lava river, the skies
// around Vader's fortress, the Inquisitors' hall, Maul in the Sith ruins,
// the fortress gate, and Darth Vader himself.
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
  const gunsAt = kit.gunsAt || ((x, y, s, a, pts) => { const r = (a * Math.PI) / 180; return pts.map(([lx, ly]) => [x + s * (lx * Math.cos(r) - ly * Math.sin(r)), y + s * (lx * Math.sin(r) + ly * Math.cos(r))]); });
  const shots = kit.shots || ((a, b, ts, len = 0.14, c = '#3aff6a') => ts.map((t) => bolt(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[0] + (b[0] - a[0]) * (t + len), a[1] + (b[1] - a[1]) * (t + len), c)).join(''));
  // A point d units on from p along heading a (degrees): where a ship's
  // guns are pointing, so every shot runs straight out of its barrels.
  const fwd = (p, a, d) => [+(p[0] + Math.cos((a * Math.PI) / 180) * d).toFixed(2), +(p[1] + Math.sin((a * Math.PI) / 180) * d).toFixed(2)];
  const smoke = (x, y, h, a = 0.5, c1 = '#1a1012', c2 = '#3a2a28') => Array.from({ length: 7 }, (_, k) => { const yy = y - (k * h) / 7; const xx = x + k * 1.8 + (k % 2) * 1.4; const r = 2.6 + k * 1.6; return C(xx, yy, r, k < 3 ? c1 : c2, `opacity="${(a * (1 - k * 0.1)).toFixed(2)}"`); }).join('');
  const GRN = '#3aff6a';
  const none = () => '';
  const robed = kit.robed || none;
  const inquisitor = kit.inquisitor || none;
  const awing = kit.awing || none;
  const AWGUNS = [[1.4, -5.6], [1.4, 5.6]];
  const f2 = (v) => +v.toFixed(2);

  // ---------- The world ----------
  const SKY = [[0, '#140606'], [0.4, '#4a120a'], [0.75, '#a8301a'], [1, '#f0702a']];
  // Ash drifting down, flecked with embers.
  const ash = (n, seed) => Array.from({ length: n }, (_, k) => C(((k * 53 + seed * 7) % 160), ((k * 29 + seed * 11) % 90), (0.2 + (k % 3) * 0.1).toFixed(2), k % 4 ? '#8a7a74' : '#ff8a3a', `opacity="${(0.35 + (k % 3) * 0.15).toFixed(2)}"`)).join('');
  // Heavy ash clouds rolling across the sky, lit red from below.
  const clouds = (y, seed, a = 0.6) => Array.from({ length: 9 }, (_, k) => { const x = ((k * 23 + seed * 17) % 180) - 10; const r = 8 + ((k * 7 + seed) % 5) * 3; return E(x, f2(y + ((k * 5) % 7) - 3), r * 1.8, r * 0.6, '#1a0e0e', `opacity="${a}"`) + E(x, f2(y + ((k * 5) % 7) - 3 + r * 0.4), r * 1.4, r * 0.2, '#ff5a2a', `opacity="${(a * 0.18).toFixed(2)}"`); }).join('');
  // A jagged line of black volcanic rock across the view, rim-lit by lava.
  const ridge = (base, h, c, seed, rim = '#ff6a2a', n = 16) => {
    const pts = Array.from({ length: n + 1 }, (_, k) => [f2((k / n) * 172 - 6), f2(base - h * (0.35 + (((k * 37 + seed * 13) % 17) / 17) * 0.65) * (k % 2 ? 1 : 0.7))]);
    const top = pts.map(([x, y]) => `${x} ${y}`).join(' L');
    return P(`M-6 ${base + 40} L${top} L166 ${base + 40}Z`, c) + (rim ? P(`M${top}`, 'none', `stroke="${rim}" stroke-width=".35" opacity=".55" stroke-linejoin="round"`) : '');
  };
  // A pool or river of lava filling a path: glowing gradient, dark cooling
  // crust drifting on it, bright seams between.
  let clipN = 0;
  const lava = (d, seed = 0, cx = 80, cy = 70, w = 70, h = 10) => {
    const [gr, dd] = LG([[0, '#ffc84a'], [0.45, '#ff7a1a'], [1, '#c8340a']]);
    const id = `muLava${++clipN}`;
    return dd + `<clipPath id="${id}"><path d="${d}"/></clipPath>` + P(d, gr) + `<g clip-path="url(#${id})">` + Array.from({ length: 14 }, (_, k) => { const x = f2(cx - w + ((k * 37 + seed * 11) % 100) / 100 * w * 2); const y = f2(cy - h + ((k * 53 + seed * 7) % 100) / 100 * h * 2); return E(x, y, f2(1.6 + (k % 3) * 1.2), f2(0.4 + (k % 2) * 0.3), '#5a1a0a', 'opacity=".55"'); }).join('')
      + Array.from({ length: 6 }, (_, k) => { const y = f2(cy - h * 0.7 + k * h * 0.28); return P(`M${cx - w} ${y} Q${cx - w / 2} ${f2(y - 1)} ${cx} ${y} T${cx + w} ${y}`, 'none', 'stroke="#fff0a0" stroke-width=".3" opacity=".45"'); }).join('') + '</g>';
  };
  // A lavafall pouring off a cliff: bright streaks, a glowing splash and
  // steam at its foot.
  const lavafall = (x, top, bot, w) => {
    const [gr, d] = LG([[0, '#ffe08a'], [0.5, '#ff8a2a'], [1, '#e8401a']]);
    const hh = bot - top;
    return d + glow(x, bot, w * 0.8, '#ff6a1a', 0.35) + P(`M${f2(x - w / 2)} ${top} C${f2(x - w / 2 - 0.6)} ${f2(top + hh * 0.4)} ${f2(x - w / 2 + 0.4)} ${f2(top + hh * 0.7)} ${f2(x - w / 2 - 0.3)} ${bot} L${f2(x + w / 2 + 0.3)} ${bot} C${f2(x + w / 2 - 0.4)} ${f2(top + hh * 0.7)} ${f2(x + w / 2 + 0.6)} ${f2(top + hh * 0.4)} ${f2(x + w / 2)} ${top}Z`, gr)
      + [-0.3, -0.05, 0.2, 0.38].map((k) => L(f2(x + w * k), top + 1, f2(x + w * k + 0.3), bot - 1, '#fff4c0', 0.25, 'opacity=".6"')).join('')
      + E(x, bot, f2(w * 0.9), f2(w * 0.25), '#fff0a0', 'opacity=".7"') + C(f2(x - w * 0.6), bot - 1, f2(w * 0.4), '#8a6a60', 'opacity=".25"') + C(f2(x + w * 0.5), bot - 2, f2(w * 0.5), '#8a6a60', 'opacity=".2"');
  };
  // A volcano on the horizon erupting: lava runs down its flanks, a
  // fountain of molten rock and a smoke column.
  const volcano = (x, base, w, h, c = '#1e1416') => P(`M${x - w} ${base} L${f2(x - w * 0.18)} ${base - h} L${f2(x + w * 0.18)} ${base - h} L${x + w} ${base}Z`, c)
    + P(`M${f2(x - w * 0.1)} ${base - h} Q${f2(x - w * 0.2)} ${f2(base - h * 0.5)} ${f2(x - w * 0.34)} ${base}`, 'none', 'stroke="#ff7a2a" stroke-width=".8" opacity=".85"') + P(`M${f2(x + w * 0.08)} ${base - h} Q${f2(x + w * 0.2)} ${f2(base - h * 0.4)} ${f2(x + w * 0.3)} ${base}`, 'none', 'stroke="#ffaa3a" stroke-width=".5" opacity=".8"')
    + smoke(x, base - h - 4, h * 0.9, 0.5) + glow(x, base - h, f2(w * 0.07), '#ff8a2a', 0.45)
    + Array.from({ length: 12 }, (_, k) => { const a = ((-150 + k * 10) * Math.PI) / 180; const r = h * 0.3 + (k % 3) * h * 0.08; return C(f2(x + Math.cos(a) * r * 0.6), f2(base - h + Math.sin(a) * r), f2(0.3 + (k % 3) * 0.15), k % 2 ? '#ffd27a' : '#ff6a2a'); }).join('');
  // A deck of dark metal grating with a hazard-striped edge and a railing.
  const deck = (y, rail = true) => R(0, y, 160, 90 - y, '#18161a') + Array.from({ length: 17 }, (_, k) => L(k * 10, y, (k * 10 - 80) * 1.6 + 80, 90, '#0e0c0e', 0.3)).join('') + Array.from({ length: 4 }, (_, k) => L(0, y + 3 + k * ((90 - y) / 4), 160, y + 3 + k * ((90 - y) / 4), '#0e0c0e', 0.3)).join('')
    + Array.from({ length: 20 }, (_, k) => R(k * 8, y, 4, 1, k % 2 ? '#1a1a1e' : '#c8982a')).join('')
    + (rail ? L(0, y - 4, 160, y - 4, '#3a3a42', 0.5) + L(0, y - 2, 160, y - 2, '#2a2a30', 0.3) + Array.from({ length: 11 }, (_, k) => L(k * 16, y, k * 16, y - 4, '#3a3a42', 0.45)).join('') + L(0, y - 4.2, 160, y - 4.2, '#ff8a3a', 0.15, 'opacity=".5"') : '');

  // ---------- Buildings and machines ----------
  // Darth Vader's fortress: the black tower on its rock above the lava, the
  // wide lower block, the slender shaft with its seams and red lights, a
  // landing platform, and the forked crown with the glow between its
  // prongs. Lava pours from cracks in the rock below.
  const castle = (x, base, s) => g(x, base, s, 1,
    P('M-16 0 L-13 -6 L-11 -9 L-9 -14 L9 -14 L11 -9 L13 -5 L16 0Z', '#1a1214', 'stroke="#ff6a2a" stroke-width=".25" stroke-opacity=".45"')
    + P('M-10 -10 L-6 -8 L-8 -4 L-4 -2 M6 -12 L8 -8 L5 -5 L9 -2 M-2 -13 L0 -9 L-1 -5', 'none', 'stroke="#ff8a3a" stroke-width=".35" opacity=".85"') + glow(-6, -6, 1.6, '#ff6a1a', 0.3) + glow(7, -7, 1.4, '#ff6a1a', 0.3)
    + P('M-9 -14 L-6.6 -26 L6.6 -26 L9 -14Z', '#121216', 'stroke="#2a2a32" stroke-width=".2"') + P('M0 -14 L0 -26 L6.6 -26 L9 -14Z', '#000', 'opacity=".3"')
    + [-16.4, -19.4, -22.4].map((yy, k) => Array.from({ length: 5 - k }, (_, m) => R(f2(-6 + k + m * (12 - 2 * k) / (5 - k)), yy, 1.2, 0.5, '#ff6a3a', 'opacity=".75"')).join('')).join('')
    + P('M-6.6 -26 L-5 -28 L5 -28 L6.6 -26Z', '#1e1e24')
    + P('M-3.4 -28 L-2.4 -58 L2.4 -58 L3.4 -28Z', '#141418', 'stroke="#2a2a32" stroke-width=".2"') + P('M0.4 -28 L0.3 -58 L2.4 -58 L3.4 -28Z', '#000', 'opacity=".35"')
    + [-34, -40, -46, -52].map((yy) => L(-3.2 + (yy + 28) * -0.033, yy, 3.2 - (yy + 28) * -0.033, yy, '#2a2a32', 0.2)).join('') + [-37, -44, -50].map((yy) => C(-1, yy, 0.25, '#ff3a2a') + C(1.2, yy + 2, 0.22, '#ff3a2a')).join('')
    + P('M3 -34 L12 -33.4 L12 -32.4 L3 -31.8Z', '#1e1e24', 'stroke="#2a2a32" stroke-width=".15"') + [5, 8, 11].map((px) => C(px, -33.4, 0.2, '#ffd27a')).join('') + L(12, -33.4, 12, -31, '#2a2a32', 0.3)
    + P('M-2.4 -58 L-4.6 -72 L-3 -72.4 L-0.6 -62 L0.6 -62 L3 -72.4 L4.6 -72 L2.4 -58Z', '#141418', 'stroke="#2a2a32" stroke-width=".2"') + P('M0.6 -62 L3 -72.4 L4.6 -72 L2.4 -58Z', '#000', 'opacity=".3"')
    + P('M-0.6 -62 L0.6 -62 L1.6 -66 L-1.6 -66Z', '#ff5a2a', 'opacity=".8"') + glow(0, -65, 1.6, '#ff5a2a', 0.4)
    + P('M-9 -14 L-6.6 -26 M-3.4 -28 L-2.4 -58 L-4.6 -72', 'none', 'stroke="#ff7a3a" stroke-width=".25" opacity=".55"'));
  // A mining collector rising from the lava: the black mast, the head with
  // its lit band, and the boom dipping its glowing scoop into the flow.
  const collector = (x, base, s) => g(x, base, s, 1,
    E(0, 0, 4, 1, '#ffd27a', 'opacity=".6"') + R(-1, -26, 2, 26, '#16161a', 'stroke="#2a2a32" stroke-width=".2"') + R(0.4, -26, 0.6, 26, '#000', 'opacity=".35"') + [-6, -12, -18].map((yy) => R(-1.6, yy, 3.2, 1, '#22222a')).join('') + L(-1, -24, -1, -2, '#ff7a3a', 0.15, 'opacity=".5"')
    + R(-3, -30, 6, 4, '#1a1a20', 'stroke="#2a2a32" stroke-width=".2"') + R(-2.4, -29, 4.8, 0.6, '#ff8a3a', 'opacity=".7"') + L(0, -30, 0, -33, '#2a2a32', 0.3) + C(0, -33.2, 0.3, '#ff3a2a')
    + P('M2.6 -28 L14 -20 L14.6 -21 L3 -29.6Z', '#1e1e24', 'stroke="#2a2a32" stroke-width=".15"') + L(14.2, -20.4, 14.2, -10, '#2a2a32', 0.5) + P('M12 -10 L16.4 -10 L15.6 -6 L12.8 -6Z', '#22222a', 'stroke="#000" stroke-width=".15"') + E(14.2, -10, 2.2, 0.5, '#ff9a3a') + glow(14.2, -8, 1.2, '#ff8a2a', 0.4) + P('M13 -6 L13.4 -1 M15 -6 L15.2 -2', 'none', 'stroke="#ffb43a" stroke-width=".35"'));
  // The old mining facility: angular black hull built out over the lava,
  // bands of lit windows, cantilevered platforms, a mast and steam vents.
  const facility = (x, base, s) => g(x, base, s, 1,
    P('M0 0 L0 -30 L14 -34 L30 -30 L34 -22 L34 0Z', '#141418', 'stroke="#2a2a32" stroke-width=".25"') + P('M20 -32.4 L30 -30 L34 -22 L34 0 L20 0Z', '#000', 'opacity=".25"')
    + [[-26, 2, 26], [-20, 2, 30], [-13, 4, 28]].map(([yy, x0, w]) => R(x0, yy, w, 1.4, '#ff9a4a', 'opacity=".85"') + Array.from({ length: Math.floor(w / 3) }, (_, k) => L(x0 + 3 + k * 3, yy, x0 + 3 + k * 3, yy + 1.4, '#141418', 0.3)).join('')).join('')
    + R(34, -14, 14, 1.2, '#1e1e24', 'stroke="#2a2a32" stroke-width=".15"') + L(34, -16.4, 48, -16.4, '#3a3a42', 0.25) + [37, 41, 45].map((px) => L(px, -14, px, -16.4, '#3a3a42', 0.2)).join('') + L(46, -12.8, 46, 0, '#1e1e24', 0.8)
    + R(-10, -8, 10, 1, '#1e1e24') + L(-8, -7, -8, 0, '#1e1e24', 0.8)
    + L(14, -34, 14, -44, '#2a2a32', 0.4) + C(14, -44.4, 0.4, '#ff3a2a') + L(10, -38, 18, -38, '#2a2a32', 0.25)
    + [[6, -30], [26, -30]].map(([vx, vy]) => R(vx - 1.2, vy - 1.6, 2.4, 1.6, '#22222a') + C(vx, vy - 3, 1.6, '#6a5a58', 'opacity=".35"') + C(vx + 1, vy - 5.4, 2.2, '#6a5a58', 'opacity=".25"')).join('')
    + P('M0 -30 L14 -34 L20 -32.4', 'none', 'stroke="#ff7a3a" stroke-width=".25" opacity=".5"'));

  // ---------- Ships ----------
  // A TIE Interceptor in profile, nose right: the dagger wing with its frame
  // and panels behind the ball cockpit, the round forward viewport, and the
  // cannons at the wingtips.
  const TIGUNS = [[3.8, -11], [3.8, 11]];
  const tieInt = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M-2.4 -10.8 L1.2 -11.2 L2.4 -5 L4.6 -2.2 L4.6 2.2 L2.4 5 L1.2 11.2 L-2.4 10.8 L-1 4.4 L-3.6 1.8 L-3.6 -1.8 L-1 -4.4Z', '#20232a', 'stroke="#0c0e12" stroke-width=".3"')
    + P('M-1.6 -9.6 L0.6 -9.8 L1.6 -4.8 L3.6 -2 L3.6 2 L1.6 4.8 L0.6 9.8 L-1.6 9.6 L-0.4 4.2 L-2.8 1.6 L-2.8 -1.6 L-0.4 -4.2Z', '#3e4450', 'stroke="#14161a" stroke-width=".15"')
    + P('M0 0 L0.6 -9.4 M0 0 L0.6 9.4 M0 0 L3.4 -1.6 M0 0 L3.4 1.6 M0 0 L-2.6 -1.4 M0 0 L-2.6 1.4 M0 0 L-0.8 -4.6 M0 0 L-0.8 4.6', 'none', 'stroke="#16181e" stroke-width=".22"') + P('M-1.6 -9.6 L0.6 -9.8 L0.4 -6Z', '#5a6270', 'opacity=".5"')
    + L(1.2, -11.2, 3.8, -11, '#2a2e36', 0.5) + L(1.2, 11.2, 3.8, 11, '#2a2e36', 0.5)
    + C(0.4, 0, 3, '#6a707a', 'stroke="#2a2e36" stroke-width=".3"') + P('M2.4 -1.8 A3 3 0 0 1 2.4 1.8 A2 3 0 0 0 2.4 -1.8Z', '#3e434c', 'opacity=".6"') + C(-0.4, -0.6, 1, '#8a909a', 'opacity=".5"')
    + E(2.4, 0, 1, 2, '#0c1016', 'stroke="#4a4e58" stroke-width=".2"') + P('M2.4 -2 L2.4 2 M1.6 -1.4 L3.2 1.4 M3.2 -1.4 L1.6 1.4', 'none', 'stroke="#6a707a" stroke-width=".14"') + C(-2.4, 0, 0.6, '#ff5a3a', 'opacity=".5"'), a);
  // Darth Vader's TIE Advanced x1 in profile, nose right: the long rear
  // hull with its engine glow, the bent wing with solar panel lines, the
  // ball cockpit and the twin cannons under its viewport.
  const TAGUNS = [[5.6, 1.7], [5.6, 2.7]];
  const tieAdv = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M-1 -2.2 L-8 -1.6 L-9 0 L-8 1.6 L-1 2.2Z', '#5a606a', 'stroke="#22252c" stroke-width=".2"') + L(-8, 0, -1, 0, '#3a3e46', 0.2) + R(-9.6, -1, 0.8, 2, '#3a3e46') + E(-9.8, 0, 0.4, 0.8, '#ff6a4a') + glow(-10, 0, 0.6, '#ff6a4a', 0.4)
    + P('M-4.6 -11 L1.6 -11 L2.6 -6 L2.6 6 L1.6 11 L-4.6 11 L-5.6 6 L-5.6 -6Z', '#262a32', 'stroke="#0c0e12" stroke-width=".3"') + P('M-3.8 -10 L0.8 -10 L1.6 -6 L1.6 6 L0.8 10 L-3.8 10 L-4.6 6 L-4.6 -6Z', '#3a404c', 'stroke="#14161a" stroke-width=".15"')
    + [-2.8, -1.6, -0.4, 0.8].map((px) => L(px, -9.6, px, 9.6, '#1e2026', 0.2)).join('') + L(-4.6, -6, 1.6, -6, '#16181e', 0.3) + L(-4.6, 6, 1.6, 6, '#16181e', 0.3) + P('M-3.8 -10 L0.8 -10 L1.6 -6 L-4.6 -6Z', '#5a6270', 'opacity=".45"')
    + C(0.6, 0, 3.3, '#6a707a', 'stroke="#2a2e36" stroke-width=".3"') + P('M2.8 -2 A3.3 3.3 0 0 1 2.8 2 A2 3.3 0 0 0 2.8 -2Z', '#3e434c', 'opacity=".6"') + C(-0.2, -0.8, 1.1, '#8a909a', 'opacity=".5"')
    + E(2.8, -0.4, 1.1, 2, '#0c1016', 'stroke="#4a4e58" stroke-width=".2"') + P('M2.8 -2.4 L2.8 1.6 M2 -1.8 L3.6 1 M3.6 -1.8 L2 1', 'none', 'stroke="#6a707a" stroke-width=".14"')
    + R(2.8, 1.45, 2.8, 0.5, '#2a2e36') + R(2.8, 2.45, 2.8, 0.5, '#2a2e36'), a);
  // Obi-Wan's Eta-2 Jedi interceptor parked, seen from above at an angle:
  // the narrow fuselage, the red wing panels, the cockpit and the astromech.
  const eta2 = (x, y, s, c = '#c83a2a') => `<g transform="translate(${x} ${y}) scale(${s} ${f2(s * 0.5)})">`
    + E(0, 3, 15, 5, '#000', 'opacity=".3"')
    + P('M-3 -1.4 L-7 -10 L4 -10 L1.6 -1.4Z M-3 1.4 L-7 10 L4 10 L1.6 1.4Z', c, 'stroke="#3a1410" stroke-width=".3"') + P('M-5.6 -9 L2.6 -9 L1 -2.4 L-2.6 -2.4Z M-5.6 9 L2.6 9 L1 2.4 L-2.6 2.4Z', '#e8e4dc', 'opacity=".85"') + P('M-4 -9 L-1.8 -2.4 M-1.4 -9 L-0.6 -2.4 M1 -9 L0.4 -2.4 M-4 9 L-1.8 2.4 M-1.4 9 L-0.6 2.4 M1 9 L0.4 2.4', 'none', 'stroke="#8a8478" stroke-width=".2"')
    + R(-8, -10.6, 4, 1.2, '#3a3a40') + R(-8, 9.4, 4, 1.2, '#3a3a40') + E(-8.2, -10, 0.5, 0.7, '#9ad8ff') + E(-8.2, 10, 0.5, 0.7, '#9ad8ff')
    + P('M-8 -1.2 L6 -1.6 L12 0 L6 1.6 L-8 1.2Z', '#d8d4cc', 'stroke="#4a4840" stroke-width=".25"') + P('M12 0 L7 -1.4 L7 1.4Z', c) + E(3, 0, 2.2, 1.1, '#2a3a4a', 'stroke="#1a1410" stroke-width=".2"') + E(3.4, -0.3, 1, 0.4, '#aaccdd', 'opacity=".6"') + C(-2.6, -0.2, 0.9, '#c83a2a', 'stroke="#3a3a40" stroke-width=".15"') + C(-2.6, -0.2, 0.4, '#e8e8ec')
    + '</g>';

  // ---------- People ----------
  // A purge trooper: black armour with segmented chest and knee guards, a
  // red-striped pauldron, the sculpted helmet with its dark visor and a
  // faint red glint, and a blaster rifle, electrobaton or electrostaff.
  const purge = (x, y, s, f = 1, w = 'rifle') => g(x, y, s, f,
    E(0, 0.2, 3, 0.5, '#000', 'opacity=".3"')
    + P('M-2 -5.2 L-2.2 0 L-0.4 0 L-0.3 -5.2Z M0.3 -5.2 L0.4 0 L2.2 0 L2 -5.2Z', '#14141a', 'stroke="#000" stroke-width=".12"')
    + R(-2.3, -3.8, 2.1, 1.6, '#2a2a34', 'rx=".3" stroke="#0a0a0e" stroke-width=".1"') + R(0.3, -3.8, 2.1, 1.6, '#2a2a34', 'rx=".3" stroke="#0a0a0e" stroke-width=".1"') + L(-2, -3.6, -0.6, -3.6, '#5a5a68', 0.12) + L(0.6, -3.6, 2, -3.6, '#5a5a68', 0.12)
    + P('M-2.4 0 L-0.2 0 L-0.3 -0.9 L-2.2 -0.9Z M0.2 0 L2.6 0 L2.3 -0.9 L0.3 -0.9Z', '#22222a')
    + R(-2.5, -6.1, 5, 0.9, '#1e1e26') + [-2, -0.9, 0.5, 1.5].map((bx) => R(bx, -6.2, 0.8, 1, '#2e2e38', 'stroke="#0a0a0e" stroke-width=".08"')).join('')
    + P('M-2.5 -6 L-2.7 -10 L2.7 -10 L2.5 -6Z', '#101016') + P('M-2.2 -9.8 L2.2 -9.8 L2 -8.2 L0 -7.6 L-2 -8.2Z', '#2a2a34', 'stroke="#0a0a0e" stroke-width=".12"') + P('M-1.6 -7.8 L1.6 -7.8 L1.4 -6.4 L-1.4 -6.4Z', '#22222c', 'stroke="#0a0a0e" stroke-width=".1"') + L(-1.4, -7.1, 1.4, -7.1, '#3a3a46', 0.12) + P('M-2 -9.6 L-0.6 -9.6 L-1 -8.6', 'none', 'stroke="#5a5a68" stroke-width=".15" opacity=".8"')
    + P('M-2.6 -10 L-4 -9.6 L-4.1 -8 L-2.8 -8.4Z', '#2a2a34', 'stroke="#0a0a0e" stroke-width=".12"') + L(-3.9, -9.2, -2.8, -9.5, '#b8301e', 0.3) + E(2.9, -9.4, 0.9, 0.7, '#22222a') + P('M-3.6 -8.2 L-3.8 -6 L-3.2 -5.6', 'none', 'stroke="#14141a" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"')
    + R(-0.6, -10.8, 1.2, 0.9, '#0a0a0e')
    + P('M-1.9 -11.2 C-2.1 -14 2.1 -14 1.9 -11.2 L1.6 -10.4 L-1.6 -10.4Z', '#1c1c24', 'stroke="#000" stroke-width=".15"') + P('M-1.5 -13.2 C-0.6 -13.8 0.6 -13.8 1.5 -13.2', 'none', 'stroke="#4a4a58" stroke-width=".2"') + P('M-1 -13.7 C-0.4 -13.95 0.4 -13.95 1 -13.7', 'none', 'stroke="#6a6a78" stroke-width=".15" opacity=".7"')
    + P('M-1.7 -12.4 L1.7 -12.4 L1.4 -11.7 L0.4 -11.6 L0 -11.2 L-0.4 -11.6 L-1.4 -11.7Z', '#06060a') + P('M-1.4 -12.2 L-0.3 -12.15 M0.3 -12.15 L1.4 -12.2', 'none', 'stroke="#ff4a2a" stroke-width=".14" opacity=".65"')
    + R(-0.35, -11.1, 0.7, 0.7, '#2a2a34') + L(-0.15, -11, -0.15, -10.5, '#0a0a0e', 0.08) + L(0.15, -11, 0.15, -10.5, '#0a0a0e', 0.08)
    + (w === 'baton'
      ? P('M2.6 -9.4 L3.2 -7.4 L2.8 -6', 'none', 'stroke="#14141a" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"') + L(2.8, -6, 4.8, -11, '#2a2a30', 0.5) + L(4.2, -9.4, 4.8, -11, '#ff8a2a', 0.55) + glow(4.6, -10.4, 0.6, '#ff8a2a', 0.5) + P('M4.8 -11 L5.6 -11.6 L5.2 -12 L6 -12.6 M4.8 -11 L4.2 -11.8', 'none', 'stroke="#ffd08a" stroke-width=".14"') + C(2.8, -6, 0.42, '#14141a')
      : w === 'staff'
        ? `<g transform="rotate(-28 2.8 -7.6)">${L(2.8, 0.4, 2.8, -16, '#2a2a30', 0.5)}${L(2.8, 0.4, 2.8, -16, '#5a5a62', 0.15)}${C(2.8, -16.4, 0.5, '#ffb46a')}${C(2.8, 0.8, 0.5, '#ffb46a')}${glow(2.8, -16.4, 0.6, '#ff8a2a', 0.45)}${glow(2.8, 0.8, 0.6, '#ff8a2a', 0.45)}${P('M2.8 -16.4 L1.8 -17.4 L2.4 -17.8 L1.6 -18.8 M2.8 -16.4 L3.8 -17 L3.4 -17.8 L4.2 -18.2 M2.8 0.8 L1.8 1.6 L2.4 2 M2.8 0.8 L3.8 1.4', 'none', 'stroke="#ffe0b0" stroke-width=".16"')}</g>` + P('M2.6 -9.4 L3.2 -8 L2.8 -7.4', 'none', 'stroke="#14141a" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"') + C(2.8, -7.6, 0.42, '#14141a')
        : P('M2.2 -9.4 L3.5 -8.4 L3.2 -7.9 L2 -8.6Z', '#14141a') + C(3.6, -7.9, 0.42, '#14141a') + R(0.6, -8.5, 5, 0.75, '#2a2a30') + R(1.4, -9, 1.6, 0.5, '#3a3a40') + R(0.6, -8.1, 0.9, 1.4, '#2a2a30') + L(5.6, -8.12, 6.6, -8.12, '#3a3a40', 0.4)));
  // The Seventh Sister's helmet: domed, with a centre ridge, the dark eye
  // band with its amber lenses, a grilled chin guard and side discs.
  const SEVENTH_HEAD = P('M-1.7 -12 C-1.9 -15 1.9 -15 1.7 -12 L1.4 -10.9 L-1.4 -10.9Z', '#1e1e26', 'stroke="#000" stroke-width=".18"') + P('M0 -14.6 L0 -13.4', 'none', 'stroke="#4a4a58" stroke-width=".3"') + P('M-1.5 -13.6 C-0.6 -14.2 0.6 -14.2 1.5 -13.6', 'none', 'stroke="#5a5a68" stroke-width=".18"') + P('M-1.2 -14.3 C-0.6 -14.7 0.6 -14.7 1.2 -14.3', 'none', 'stroke="#7a7a88" stroke-width=".14" opacity=".7"')
    + P('M-1.6 -12.9 L1.6 -12.9 L1.3 -12.2 L-1.3 -12.2Z', '#0a0a0e') + E(-0.7, -12.55, 0.42, 0.22, '#ff8a2a', 'opacity=".9"') + E(0.7, -12.55, 0.42, 0.22, '#ff8a2a', 'opacity=".9"') + C(0, -12.55, 0.9, '#ff8a2a', 'opacity=".12"')
    + P('M-1 -11.9 L1 -11.9 L0.6 -11 L-0.6 -11Z', '#2a2a34', 'stroke="#000" stroke-width=".1"') + [-0.4, 0, 0.4].map((gx) => L(gx, -11.8, gx, -11.2, '#5a5a68', 0.08)).join('') + E(-1.75, -12.6, 0.35, 0.6, '#3a3a46') + E(1.75, -12.6, 0.35, 0.6, '#3a3a46');
  // The Eighth Brother's mask: the tall grey dome with its crest, the
  // curved dark visor with red eye glints and the pointed silver jaw.
  const EIGHTH_HEAD = P('M-1.6 -11.4 C-2 -13.6 -1.4 -15.2 0 -15.4 C1.4 -15.2 2 -13.6 1.6 -11.4 L0.8 -10.6 L-0.8 -10.6Z', '#3a3a44', 'stroke="#0a0a0e" stroke-width=".18"') + P('M-0.3 -15.4 L0 -16.4 L0.3 -15.4Z', '#5a5a66')
    + P('M-1.3 -13.4 C-0.8 -12.6 0.8 -12.6 1.3 -13.4 L1.2 -12.4 C0.6 -11.9 -0.6 -11.9 -1.2 -12.4Z', '#0a0a0e') + P('M-1.1 -13.1 L-0.3 -12.6 M1.1 -13.1 L0.3 -12.6', 'none', 'stroke="#ff4a2a" stroke-width=".18" opacity=".8"')
    + P('M-0.9 -12 L0 -10.6 L0.9 -12', '#8a8a96', 'stroke="#2a2a32" stroke-width=".1"') + P('M0 -15.2 L0 -13.6', 'none', 'stroke="#8a8a96" stroke-width=".25"') + P('M-1.4 -14 C-0.6 -14.6 0.6 -14.6 1.4 -14', 'none', 'stroke="#6a6a76" stroke-width=".18"') + P('M-1.6 -12.4 L-2 -11.8 M1.6 -12.4 L2 -11.8', 'none', 'stroke="#5a5a66" stroke-width=".3"');
  const seventhSis = (x, y, s, f = 1) => inquisitor(x, y, s, f, { head: SEVENTH_HEAD, spin: true, ang: 40 });
  const eighthBro = (x, y, s, f = 1) => inquisitor(x, y, s, f, { head: EIGHTH_HEAD, spin: true, ang: -12 });
  // Obi-Wan as at the end of the Clone Wars, and Ahsoka with her white
  // sabers: montrals and lekku striped blue, white face markings.
  const obiwan = (x, y, s, f = 1) => robed(x, y, s, f, { robe: '#5a3e28', tunic: '#d8c8a8', skin: '#ecc8a8', hair: 'M-1.5 -12.2 C-1.7 -14.3 1.7 -14.3 1.5 -12.2 L1.3 -12.7 C0.5 -13.3 -0.5 -13.3 -1.3 -12.7Z', hairC: '#a8723e', beard: 'M-1.05 -11.5 C-0.9 -10.3 0.9 -10.3 1.05 -11.5 C0.6 -11 -0.6 -11 -1.05 -11.5Z', saber: '#3a8aff', fold: '#3a2818' });
  const ahsoka = (x, y, s, f = 1) => g(x, y, s, f, P('M-1.4 -12.4 C-2.4 -11.4 -2.4 -9.4 -1.8 -8 L-1.2 -8.2 C-1.4 -9.6 -1.2 -11 -0.8 -11.8Z M1.4 -12.4 C2.4 -11.4 2.4 -9.4 1.8 -8 L1.2 -8.2 C1.4 -9.6 1.2 -11 0.8 -11.8Z', '#f4f4f0', 'stroke="#8a8a88" stroke-width=".12"') + P('M-2 -10.8 L-1.2 -10.6 M-1.95 -9.6 L-1.3 -9.4 M2 -10.8 L1.2 -10.6 M1.95 -9.6 L1.3 -9.4', 'none', 'stroke="#2a4a8a" stroke-width=".3"'))
    + robed(x, y, s, f, { robe: '#5a5450', tunic: '#a8a49a', skin: '#e07a3a', saber: '#eef4ff', trim: '#6a5a4a', belt: '#5a3a24', fold: '#3a3632', eye: '#2a5aa8' })
    + g(x, y, s, f, P('M-1.2 -13 C-1.8 -14.6 -1.4 -16.2 -0.6 -16.6 C-0.8 -15.4 -0.6 -14.2 -0.2 -13.3Z M1.2 -13 C1.8 -14.6 1.4 -16.2 0.6 -16.6 C0.8 -15.4 0.6 -14.2 0.2 -13.3Z', '#f4f4f0', 'stroke="#8a8a88" stroke-width=".12"') + P('M-1.35 -14 L-0.6 -13.9 M-1.3 -15.2 L-0.75 -15.1 M1.35 -14 L0.6 -13.9 M1.3 -15.2 L0.75 -15.1', 'none', 'stroke="#2a4a8a" stroke-width=".28"')
      + P('M-0.95 -12.7 C-0.7 -13.1 -0.3 -13.1 -0.1 -12.8 M0.95 -12.7 C0.7 -13.1 0.3 -13.1 0.1 -12.8 M-0.3 -11.2 C-0.1 -10.7 0.1 -10.7 0.3 -11.2 M0 -13.4 L0 -12.9', 'none', 'stroke="#ffffff" stroke-width=".22"')
      + `<g transform="rotate(150 -3 -7.6)">${L(-3, -7.6, -3, -12.4, '#eef4ff', 0.9)}${L(-3, -7.6, -3, -12.4, '#ffffff', 0.35)}</g>` + C(-2.9, -7.4, 0.4, '#e07a3a') + glow(-1, -5.6, 0.8, '#c8dcff', 0.2));
  // Maul in the years after the war: red-and-black tattooed face, the crown
  // of horns, yellow eyes, black robes, and his double-bladed red saber.
  const maul = (x, y, s, f = 1) => robed(x, y, s, f, { robe: '#141418', tunic: '#26262c', skin: '#c8281e', marks: 'M-1.2 -12.6 L-0.4 -12.3 M1.2 -12.6 L0.4 -12.3 M0 -13.3 L0 -12.6 M-0.8 -11.15 L0.8 -11.15 M-1.3 -11.8 L-0.9 -11.4 M1.3 -11.8 L0.9 -11.4 M-0.6 -13.2 L-0.4 -12.8 M0.6 -13.2 L0.4 -12.8', hair: 'M-1.2 -13.2 L-1.5 -14.1 L-0.9 -13.4Z M-0.5 -13.4 L-0.55 -14.5 L-0.1 -13.5Z M0.5 -13.4 L0.6 -14.5 L0.9 -13.5Z M1.2 -13.2 L1.6 -14.1 L1.4 -13Z M-1.4 -12.4 L-1.9 -13 L-1.3 -12.8Z M1.4 -12.4 L1.9 -13 L1.3 -12.8Z', hairC: '#e8d8b0', eye: '#ffc83a', saber: '#ff2a1a', double: true, ang: -24, trim: '#3a3a42', belt: '#1a1a1e', fold: '#000' });
  // Darth Vader in full: the flowing cape, the glossy helmet with its
  // flared rim, angular lenses and grilled mouthpiece, the shoulder armour
  // and collar, the chest box with its lights, belt boxes, gauntlets and
  // boots, his red saber raised.
  const vaderFull = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 5, 0.7, '#000', 'opacity=".35"')
    + P('M-3.4 -12.6 C-6 -8 -7.6 -3 -8 0 L7.4 0 C6.8 -3 5.6 -8 3.2 -12.6Z', '#060608', 'stroke="#000" stroke-width=".2"') + P('M-2.6 -11 C-4.4 -7 -5.4 -3.4 -5.8 0 M-1 -10 C-2 -6 -2.4 -3 -2.4 0 M2.8 -10 C4 -6 4.8 -3 5 0', 'none', 'stroke="#1e1e24" stroke-width=".35"') + P('M-3.4 -12.6 C-6 -8 -7.6 -3 -8 0', 'none', 'stroke="#ff4a2a" stroke-width=".35" opacity=".5"')
    + P('M-1.9 -6 L-2.2 -0.8 L-0.5 -0.8 L-0.3 -6Z M0.3 -6 L0.5 -0.8 L2.2 -0.8 L1.9 -6Z', '#0c0c10') + P('M-2.4 0 L-0.3 0 L-0.4 -2.6 L-2.3 -2.6Z M0.3 0 L2.4 0 L2.3 -2.6 L0.4 -2.6Z', '#141418', 'stroke="#2a2a32" stroke-width=".1"') + L(-1.9, -2.4, -1.9, -0.4, '#4a4a56', 0.15) + L(1.8, -2.4, 1.8, -0.4, '#4a4a56', 0.15)
    + P('M-2.6 -6.6 L-3 -2.4 L3 -2.4 L2.6 -6.6Z', '#0a0a0e') + P('M-1.4 -6.4 L-1.8 -2.6 M1.4 -6.4 L1.8 -2.6', 'none', 'stroke="#1e1e24" stroke-width=".2"')
    + R(-2.7, -7.3, 5.4, 0.9, '#16161a') + [-2.3, -1.3, 0.7, 1.7].map((bx) => R(bx, -7.4, 0.8, 1.1, '#8a8a94', 'stroke="#2a2a32" stroke-width=".08"')).join('') + R(-0.5, -7.5, 1, 1.3, '#a8a8b2', 'stroke="#2a2a32" stroke-width=".08"') + L(-2.6, -6.5, 2.6, -6.5, '#2a2a32', 0.15)
    + P('M-2.6 -7.3 L-2.8 -11.6 L2.8 -11.6 L2.6 -7.3Z', '#0e0e12') + P('M-1.8 -11.4 L1.8 -11.4 L1.6 -9 L-1.6 -9Z', '#22222a', 'stroke="#000" stroke-width=".1"') + P('M-1.4 -11.2 L1.4 -11.2', 'none', 'stroke="#4a4a56" stroke-width=".15"')
    + R(-1.2, -10.6, 2.4, 1.4, '#3a3a44', 'rx=".2" stroke="#000" stroke-width=".1"') + [-0.85, -0.3, 0.25, 0.8].map((px, k) => R(px - 0.18, -10.3, 0.36, 0.4, ['#ff3a2a', '#3aff6a', '#3a8aff', '#ffcf3a'][k])).join('') + [-0.6, 0, 0.6].map((px) => R(px - 0.2, -9.7, 0.4, 0.3, '#8a8a94')).join('')
    + P('M-2.8 -11.6 C-3.8 -11.6 -4.4 -11 -4.4 -10 L-3 -9.6 L-2.6 -10.8Z M2.8 -11.6 C3.8 -11.6 4.4 -11 4.4 -10 L3 -9.6 L2.6 -10.8Z', '#1a1a20', 'stroke="#000" stroke-width=".12"') + P('M-3.6 -11.2 C-4 -10.9 -4.2 -10.5 -4.2 -10.1', 'none', 'stroke="#6a6a78" stroke-width=".18"')
    + P('M-3.6 -10 L-4 -6.6 L-3.4 -5', 'none', 'stroke="#0e0e12" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"') + R(-4, -6.2, 1.2, 1.4, '#1e1e24', 'rx=".3"')
    + P('M-2.6 -12 C-1.6 -12.8 1.6 -12.8 2.6 -12 L2.2 -11 C1 -11.4 -1 -11.4 -2.2 -11Z', '#2a2a32', 'stroke="#000" stroke-width=".12"') + P('M-2 -11.9 C-1 -12.4 1 -12.4 2 -11.9', 'none', 'stroke="#6a6a78" stroke-width=".15"')
    + P('M-1.9 -13.4 C-2 -16.2 2 -16.2 1.9 -13.4 L2.6 -11.6 L1.4 -11.2 L-1.4 -11.2 L-2.6 -11.6Z', '#0a0a0e', 'stroke="#000" stroke-width=".15"') + P('M-1.4 -15.2 C-0.6 -15.9 0.8 -15.8 1.4 -15.1', 'none', 'stroke="#8a8a98" stroke-width=".3" opacity=".7"') + P('M-1.9 -13.4 L-2.6 -11.6 M1.9 -13.4 L2.6 -11.6', 'none', 'stroke="#3a3a46" stroke-width=".15"')
    + P('M-1.5 -13.6 L-0.15 -13.4 L-0.3 -12.6 L-1.4 -12.9Z M1.5 -13.6 L0.15 -13.4 L0.3 -12.6 L1.4 -12.9Z', '#2a1418', 'stroke="#4a4a56" stroke-width=".1"') + P('M-1.3 -13.4 L-0.6 -13.3', 'none', 'stroke="#ff5a4a" stroke-width=".1" opacity=".6"')
    + P('M-0.15 -13.4 L0.15 -13.4 L0.3 -12.4 L-0.3 -12.4Z', '#3a3a46') + P('M-0.6 -12.3 L0.6 -12.3 L0.3 -11.3 L-0.3 -11.3Z', '#2a2a34', 'stroke="#000" stroke-width=".08"') + [-0.3, 0, 0.3].map((gx) => L(gx, -12.2, gx * 0.6, -11.4, '#8a8a98', 0.07)).join('') + P('M-1.2 -12.4 L-0.7 -11.6 M1.2 -12.4 L0.7 -11.6', 'none', 'stroke="#4a4a56" stroke-width=".12"')
    + P('M2.8 -10.8 L4 -9 L3.6 -8.2', 'none', 'stroke="#0e0e12" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"') + R(3, -8.8, 1.2, 1.4, '#1e1e24', 'rx=".3"')
    + `<g transform="rotate(28 3.6 -8.2)">${R(3.2, -9, 0.8, 2.2, '#8a8a94', 'stroke="#2a2a32" stroke-width=".08"')}${R(3.2, -8.4, 0.8, 0.3, '#1a1a1e')}${L(3.6, -9.2, 3.6, -21, '#ff2a1a', 1.3)}${L(3.6, -9.2, 3.6, -21, '#ffe0d8', 0.42)}</g>` + glow(8.6, -18.6, 1.4, '#ff2a1a', 0.16));

  // ---------- The ten scenes ----------
  const MU = {
    // 1 · Lava Fields (fleet): low over Mustafar's lava plains under an ash
    // sky. A volcano erupts on the horizon, rivers of lava snake between
    // black ridges, and Darth Vader's TIE Advanced leads two TIE
    // Interceptors after a fleeing A-wing, every shot straight from their
    // cannons.
    lava_fields: () => {
      const aw = [124, 22, 1, -14]; const va = [66, 36, 1.25, -13]; const i1 = [38, 52, 1, -19]; const i2 = [96, 54, 0.85, -36];
      return fill(SKY) + clouds(12, 1, 0.7) + clouds(30, 4, 0.45) + volcano(118, 58, 26, 22) + volcano(30, 60, 18, 12, '#24181a')
        + ridge(60, 8, '#1e1416', 2) + lava('M-4 66 C30 62 50 70 80 66 C110 62 130 68 164 64 L164 70 C130 74 110 68 80 72 C50 76 30 68 -4 72Z', 1, 80, 68, 84, 4) + ridge(76, 6, '#160e10', 5)
        + lava('M20 90 C40 82 60 80 72 76 C80 78 70 84 60 90Z', 2, 50, 84, 20, 5) + lava('M110 90 C116 84 128 80 140 80 C150 82 150 86 144 90Z', 3, 130, 85, 18, 4)
        + awing(aw[0], aw[1], aw[2], aw[3])
        + tieInt(i1[0], i1[1], i1[2], i1[3]) + tieInt(i2[0], i2[1], i2[2], i2[3]) + tieAdv(va[0], va[1], va[2], va[3])
        + gunsAt(va[0], va[1], va[2], va[3], TAGUNS).map((p) => shots(p, fwd(p, va[3], 52), [0.12, 0.42, 0.72], 0.12, GRN)).join('')
        + [i1, i2].map(([x, y, s, a]) => gunsAt(x, y, s, a, TIGUNS).map((p) => shots(p, fwd(p, a, 40), [0.15, 0.5], 0.13, GRN)).join('')).join('')
        + glow(130, 26, 1, '#ffd08a', 0.5) + ash(40, 1);
    },

    // 2 · Purge Patrol: a black rock path along a lava river. Cliffs with
    // lavafalls behind, the mining works on the horizon, ash falling and
    // embers rising, rock spires and steaming vents; purge troopers on patrol with rifle, electrostaff and
    // electrobaton, more of them marching in the distance.
    purge_patrol: () => fill(SKY) + clouds(10, 2, 0.6)
      + facility(118, 50, 0.5) + collector(150, 52, 0.5) + ridge(50, 22, '#1a1012', 3) + lavafall(30, 32, 56, 3) + lavafall(126, 30, 57, 4) + lavafall(88, 36, 56, 2)
      + lava('M-4 56 L164 56 L164 66 L-4 66Z', 4, 80, 61, 80, 4)
      + Array.from({ length: 4 }, (_, k) => purge(108 + k * 7, 70, 0.9, 1, 'rifle')).join('')
      + P('M-4 66 L164 66 L164 90 L-4 90Z', '#1a1214') + P('M-4 66 C40 68 80 64 164 67', 'none', 'stroke="#ff6a2a" stroke-width=".5" opacity=".7"') + P('M10 72 L24 76 L20 84 M60 70 L72 74 M120 80 L132 86 M140 72 L150 76', 'none', 'stroke="#ff7a2a" stroke-width=".35" opacity=".6"') + [[8, 82, 3], [146, 86, 2.6], [96, 89, 2]].map(([x, y, r]) => E(x, y, r * 1.4, r, '#0e0a0a') + P(`M${x - r} ${y - r * 0.6} Q${x} ${y - r * 1.1} ${x + r} ${y - r * 0.6}`, 'none', 'stroke="#ff6a2a" stroke-width=".3" opacity=".6"')).join('')
      + [[16, 66, 5, 16], [146, 66, 6, 20], [70, 66, 2.6, 8]].map(([x, b, w, h]) => P(`M${x - w} ${b} L${x - w * 0.5} ${b - h * 0.6} L${x - w * 0.2} ${b - h} L${x + w * 0.3} ${b - h * 0.7} L${x + w} ${b}Z`, '#120c0e', 'stroke="#ff6a2a" stroke-width=".3" stroke-opacity=".55"') + L(x - w * 0.2, b - h + 1, x - w * 0.4, b - 1, '#ff7a2a', 0.3, 'opacity=".6"')).join('')
      + [[34, 74], [128, 76], [92, 80]].map(([x, y]) => E(x, y, 2.4, 0.7, '#ff8a2a', 'opacity=".75"') + glow(x, y, 1, '#ff6a1a', 0.35) + C(x + 1, y - 4, 2, '#8a7a74', 'opacity=".22"') + C(x + 2.4, y - 8, 2.8, '#8a7a74', 'opacity=".15"')).join('')
      + purge(52, 86, 2.7, 1, 'rifle') + purge(80, 84, 2.6, 1, 'staff') + purge(108, 86, 2.7, -1, 'baton') + ash(50, 2),

    // 3 · Mining Facility: the old Separatist mining facility. Its black hull
    // with banks of lit windows stands over the lava river, collectors dip
    // their scoops into the flow, lavafalls pour beyond; on the grated deck
    // the Seventh Sister spins her saber between purge troopers.
    mining_facility: () => fill(SKY) + clouds(8, 3, 0.6) + ridge(44, 18, '#1e1416', 4) + lavafall(70, 26, 50, 5) + lavafall(104, 30, 50, 3)
      + lava('M-4 48 L164 48 L164 66 L-4 66Z', 5, 80, 57, 80, 7) + collector(60, 60, 1.1) + collector(118, 58, 0.9) + collector(146, 62, 1.2)
      + facility(-6, 66, 1.3) + R(0, 64, 160, 2, '#ff6a2a', 'opacity=".25"')
      + deck(70) + R(118, 58, 10, 10, '#22222a', 'stroke="#0a0a0e" stroke-width=".2"') + R(119.4, 59.4, 7.2, 3.6, '#ff8a3a', 'opacity=".55"') + [120, 122, 124].map((px, k) => C(px, 64.6, 0.35, ['#ff3a2a', '#ffd23a', '#3aff6a'][k])).join('')
      + purge(46, 86, 2.7, 1, 'rifle') + purge(114, 86, 2.7, -1, 'rifle') + seventhSis(80, 86, 3.1, 1) + ash(36, 3),

    // 4 · The Rescue: a landing platform on the facility's edge. Obi-Wan's
    // red Jedi interceptor sits on the pad with its astromech, the facility
    // and its lavafalls behind; Obi-Wan and Ahsoka stand with sabers lit.
    the_rescue: () => fill(SKY) + clouds(10, 5, 0.6) + ridge(46, 16, '#1e1416', 6) + lavafall(26, 28, 52, 4) + lavafall(138, 30, 52, 5)
      + lava('M-4 50 L164 50 L164 62 L-4 62Z', 6, 80, 56, 80, 5) + facility(104, 62, 1.1) + collector(40, 62, 0.8)
      + E(80, 74, 72, 13, '#1e1c20', 'stroke="#3a3a42" stroke-width=".5"') + E(80, 74, 58, 10, 'none', 'stroke="#c8982a" stroke-width=".4" stroke-dasharray="3 2" opacity=".7"') + Array.from({ length: 14 }, (_, k) => { const t = (k / 14) * Math.PI * 2; return C(f2(80 + Math.cos(t) * 70), f2(74 + Math.sin(t) * 12.6), 0.4, '#ffd27a'); }).join('') + P('M8 76 Q80 90 152 76 L152 90 L8 90Z', '#121014')
      + eta2(82, 68, 2.4, '#c83a2a')
      + obiwan(56, 86, 3.1, 1) + ahsoka(108, 86, 3, -1) + ash(30, 4),

    // 5 · Lava River: the river of fire. Lavafalls thunder down behind, the
    // flow surges forward with crust and spray, black rocks break the
    // surface; the Eighth Brother rides a collector platform with his saber
    // spinning, purge troopers on repulsor skiffs beside him.
    lava_river: () => fill(SKY) + clouds(8, 6, 0.6) + ridge(34, 16, '#1e1416', 7) + lavafall(20, 18, 46, 6) + lavafall(58, 14, 46, 8) + lavafall(104, 16, 46, 7) + lavafall(144, 20, 46, 6)
      + lava('M-4 44 L164 44 L164 90 L-4 90Z', 7, 80, 66, 84, 22)
      + Array.from({ length: 8 }, (_, k) => P(`M${-4 + k * 22} ${52 + (k % 3) * 8} q6 -2.4 12 0`, 'none', 'stroke="#fff4c0" stroke-width=".5" opacity=".6"')).join('') + [[30, 54, 3], [134, 60, 4], [10, 74, 5]].map(([x, y, r]) => P(`M${x - r} ${y} L${x - r * 0.4} ${y - r * 1.2} L${x + r * 0.5} ${y - r} L${x + r} ${y}Z`, '#140c0c', 'stroke="#ff6a2a" stroke-width=".3" stroke-opacity=".6"')).join('')
      + collector(150, 70, 0.7)
      + [[40, 82, 18], [124, 82, 18]].map(([x, y, w]) => E(x, y + 1.6, w * 0.6, 1.4, '#ffe08a', 'opacity=".55"') + P(`M${x - w / 2} ${y} L${x + w / 2} ${y} L${x + w / 2 - 1.4} ${y + 1.6} L${x - w / 2 + 1.4} ${y + 1.6}Z`, '#26262c', 'stroke="#0a0a0e" stroke-width=".2"') + R(x - 1.6, y + 1.6, 3.2, 0.8, '#ff8a3a')).join('')
      + P('M60 84 L100 84 L97 88 L63 88Z', '#22222a', 'stroke="#0a0a0e" stroke-width=".25"') + L(60, 84, 100, 84, '#5a5a62', 0.3) + R(66, 88, 28, 1.2, '#ff8a3a', 'opacity=".8"') + E(80, 89, 20, 1.4, '#fff0a0', 'opacity=".55"') + L(62, 80, 62, 84, '#3a3a42', 0.4) + L(98, 80, 98, 84, '#3a3a42', 0.4) + L(62, 80, 98, 80, '#3a3a42', 0.35)
      + purge(40, 82, 2.4, 1, 'rifle') + purge(124, 82, 2.4, -1, 'staff') + eighthBro(80, 84, 3, 1) + ash(36, 5),

    // 6 · Fortress Skies (fleet): around Darth Vader's fortress. The black
    // tower with its forked crown rises from its rock, lava pouring from
    // the cracks and lavafalls all around; a TIE Advanced and Interceptors
    // sweep past it after a fleeing A-wing, guns blazing.
    fortress_skies: () => {
      const aw = [140, 30, 0.95, -8]; const v1 = [92, 40, 1.15, -6]; const i1 = [70, 22, 0.9, 4]; const i2 = [66, 62, 0.95, -18]; const v2 = [112, 66, 0.8, -26];
      return fill(SKY) + clouds(14, 7, 0.65) + volcano(140, 70, 18, 14) + ridge(72, 10, '#1e1416', 8)
        + lavafall(14, 66, 90, 5) + lavafall(66, 70, 90, 4) + castle(40, 92, 1.15) + lava('M-4 84 L164 84 L164 90 L-4 90Z', 8, 80, 87, 80, 2)
        + awing(aw[0], aw[1], aw[2], aw[3])
        + tieInt(i1[0], i1[1], i1[2], i1[3]) + tieInt(i2[0], i2[1], i2[2], i2[3]) + tieAdv(v1[0], v1[1], v1[2], v1[3]) + tieAdv(v2[0], v2[1], v2[2], v2[3])
        + [v1, v2].map(([x, y, s, a]) => gunsAt(x, y, s, a, TAGUNS).map((p) => shots(p, fwd(p, a, 40), [0.15, 0.5], 0.13, GRN)).join('')).join('')
        + [i1, i2].map(([x, y, s, a]) => gunsAt(x, y, s, a, TIGUNS).map((p) => shots(p, fwd(p, a, 36), [0.2, 0.55], 0.13, GRN)).join('')).join('')
        + ash(40, 6);
    },

    // 7 · The Inquisitorius: the Inquisitors' hall inside the fortress. Red
    // light strips run up the black walls into the dark, the Imperial crest
    // glows on the back wall, a great window looks out on the lavafalls, and
    // a holotable throws up a blue Jedi target; the Seventh Sister and the
    // Eighth Brother stand ready, purge troopers behind.
    the_inquisitorius: () => fill([[0, '#060406'], [1, '#160a0c']])
      + P('M0 0 L50 24 L110 24 L160 0Z', '#0e0a0c') + P('M0 0 L50 24 L50 62 L0 90Z', '#141014') + P('M160 0 L110 24 L110 62 L160 90Z', '#120e12') + P('M0 90 L50 62 L110 62 L160 90Z', '#100c0e')
      + [0.15, 0.35, 0.55, 0.75].map((k) => L(f2(k * 50), f2(k * 24), f2(k * 50), f2(90 - k * 28), '#ff2a1a', f2(1.4 - k)) + L(f2(160 - k * 50), f2(k * 24), f2(160 - k * 50), f2(90 - k * 28), '#ff2a1a', f2(1.4 - k)) + glow(f2(k * 50), 45, f2(2 - k * 1.4), '#ff2a1a', 0.12) + glow(f2(160 - k * 50), 45, f2(2 - k * 1.4), '#ff2a1a', 0.12)).join('')
      + R(50, 24, 60, 38, '#0a0608') + P('M56 30 L104 30 L104 56 L56 56Z', '#2a0e08') + lavafall(66, 30, 56, 3) + lavafall(92, 30, 56, 4) + R(56, 50, 48, 6, '#ff6a1a', 'opacity=".4"') + L(80, 30, 80, 56, '#0a0608', 1) + L(56, 43, 104, 43, '#0a0608', 0.8) + R(56, 30, 48, 26, 'none', 'stroke="#2a2a32" stroke-width="1.4"')
      + C(80, 18, 4, 'none', 'stroke="#ff3a2a" stroke-width=".6" opacity=".8"') + C(80, 18, 1.4, '#ff3a2a', 'opacity=".8"') + Array.from({ length: 6 }, (_, k) => { const a = (k / 6) * Math.PI * 2; return L(f2(80 + Math.cos(a) * 1.6), f2(18 + Math.sin(a) * 1.6), f2(80 + Math.cos(a) * 3.8), f2(18 + Math.sin(a) * 3.8), '#ff3a2a', 0.5, 'opacity=".8"'); }).join('') + glow(80, 18, 3, '#ff3a2a', 0.15)
      + E(80, 72, 14, 3, '#1a1a20', 'stroke="#3a3a46" stroke-width=".4"') + R(70, 68, 20, 4, '#16161c') + E(80, 68, 10, 2, '#3a8aff', 'opacity=".35"') + P('M72 68 L76 52 L84 52 L88 68Z', '#5ab0ff', 'opacity=".12"') + `<g opacity=".6">${robed(80, 64, 1, 1, { robe: '#3a8aff', tunic: '#7ac0ff', skin: '#9ad8ff', saber: '#9ad8ff', hood: true })}</g>`
      + purge(62, 74, 1.9, 1, 'staff') + purge(98, 74, 1.9, -1, 'staff') + seventhSis(48, 86, 3, 1) + eighthBro(112, 86, 3, -1),

    // 8 · The Old Sith: the ancient Sith ruins in a cave beneath the
    // fortress. A carved archway glows with red runes between hooded Sith
    // statues, a lava pool lights the cave; Maul stands with his
    // double-bladed saber lit, purge troopers closing on either side.
    the_old_sith: () => fill([[0, '#0a0406'], [0.6, '#1e0a0a'], [1, '#3a1208']])
      + P('M0 0 L160 0 L160 14 C130 22 110 10 80 12 C50 10 30 22 0 14Z', '#060304') + P('M0 0 L0 90 L14 90 C20 60 10 30 18 0Z M160 0 L160 90 L146 90 C140 60 150 30 142 0Z', '#0e0608')
      + P('M58 64 L58 30 Q80 8 102 30 L102 64 L94 64 L94 32 Q80 18 66 32 L66 64Z', '#2a1a1c', 'stroke="#0e0608" stroke-width=".4"') + P('M66 64 L66 32 Q80 18 94 32 L94 64Z', '#140608') + glow(80, 46, 6, '#ff2a1a', 0.2)
      + Array.from({ length: 9 }, (_, k) => { const t = (k + 0.5) / 9; const a = Math.PI * (1 - t); return P(`M${f2(80 + Math.cos(a) * 18)} ${f2(30 - Math.sin(a) * 16 + 4)} l.8 -.8 l.8 .8 l-.8 .8Z`, '#ff3a2a', 'opacity=".9"'); }).join('') + [36, 44, 52].map((yy) => P(`M60 ${yy} l1.2 -1 l1.2 1 M97 ${yy} l1.2 -1 l1.2 1`, 'none', 'stroke="#ff3a2a" stroke-width=".4" opacity=".85"')).join('')
      + [[38, 66], [122, 66]].map(([x, y]) => R(x - 4, y - 2, 8, 2, '#1e1214') + P(`M${x - 3} ${y - 2} C${x - 4} ${y - 14} ${x - 3} ${y - 22} ${x} ${y - 26} C${x + 3} ${y - 22} ${x + 4} ${y - 14} ${x + 3} ${y - 2}Z`, '#2a1c1e', 'stroke="#0e0608" stroke-width=".3"') + P(`M${x - 2} ${y - 20} C${x - 1} ${y - 24} ${x + 1} ${y - 24} ${x + 2} ${y - 20} L${x + 1} ${y - 17} L${x - 1} ${y - 17}Z`, '#0a0406') + C(x - 0.6, y - 19.6, 0.25, '#ff3a2a') + C(x + 0.6, y - 19.6, 0.25, '#ff3a2a') + P(`M${x - 2} ${y - 12} L${x - 1} ${y - 4} M${x + 2} ${y - 12} L${x + 1} ${y - 4}`, 'none', 'stroke="#0e0608" stroke-width=".3"')).join('')
      + R(20, 64, 120, 26, '#1a0e0e') + lava('M24 70 C50 66 110 66 136 70 C120 74 40 74 24 70Z', 9, 80, 70, 50, 2) + glow(80, 70, 10, '#ff6a1a', 0.18)
      + Array.from({ length: 10 }, (_, k) => P(`M${10 + k * 15} 90 L${14 + k * 15} ${80 + (k % 3) * 2} L${19 + k * 15} 90Z`, '#0e0608')).join('')
      + purge(44, 86, 2.7, 1, 'rifle') + purge(116, 86, 2.7, -1, 'rifle') + maul(80, 86, 3.2, 1) + ash(20, 8),

    // 9 · Fortress Gate: at the foot of Vader's fortress. The great black
    // gate with its glowing seam and the Imperial crest above, the rock
    // pedestal, lavafalls on both sides and the causeway over the lava;
    // purge troopers, the Seventh Sister and the Eighth Brother hold it.
    fortress_gate: () => fill(SKY) + clouds(8, 9, 0.6)
      + P('M40 0 L120 0 L120 64 L40 64Z', '#121216') + P('M80 0 L120 0 L120 64 L80 64Z', '#000', 'opacity=".25"') + [10, 20, 30, 40, 50].map((yy) => L(40, yy, 120, yy, '#2a2a32', 0.3)).join('') + L(40, 0, 40, 64, '#ff7a3a', 0.4, 'opacity=".5"')
      + P('M62 64 L62 26 L98 26 L98 64Z', '#0a0a0e', 'stroke="#2a2a32" stroke-width=".6"') + L(80, 26, 80, 64, '#ff3a1a', 0.6) + glow(80, 46, 3, '#ff3a1a', 0.25) + [32, 40, 48, 56].map((yy) => L(63, yy, 97, yy, '#1e1e24', 0.4)).join('') + P('M58 26 L80 18 L102 26Z', '#1a1a20', 'stroke="#2a2a32" stroke-width=".4"')
      + C(80, 12, 3.4, 'none', 'stroke="#c8c8d0" stroke-width=".5"') + C(80, 12, 1.2, '#c8c8d0') + Array.from({ length: 6 }, (_, k) => { const a = (k / 6) * Math.PI * 2; return L(f2(80 + Math.cos(a) * 1.4), f2(12 + Math.sin(a) * 1.4), f2(80 + Math.cos(a) * 3.2), f2(12 + Math.sin(a) * 3.2), '#c8c8d0', 0.45); }).join('')
      + [[48, 30], [112, 30]].map(([x, y]) => R(x - 1.4, y, 2.8, 4, '#2a0a08') + R(x - 1, y + 0.4, 2, 3.2, '#ff3a1a', 'opacity=".8"')).join('')
      + P('M0 40 L40 30 L40 64 L0 64Z', '#1a1012') + P('M160 40 L120 30 L120 64 L160 64Z', '#1a1012') + lavafall(20, 38, 64, 7) + lavafall(140, 38, 64, 7)
      + lava('M-4 64 L164 64 L164 90 L-4 90Z', 10, 80, 77, 84, 12) + P('M50 64 L110 64 L126 90 L34 90Z', '#18141a', 'stroke="#ff6a2a" stroke-width=".4" stroke-opacity=".6"') + Array.from({ length: 6 }, (_, k) => L(f2(50 - k * 2.6), 64 + k * 4.4, f2(110 + k * 2.6), 64 + k * 4.4, '#0e0c0e', 0.3)).join('')
      + purge(38, 86, 2.6, 1, 'staff') + purge(122, 86, 2.6, -1, 'rifle') + seventhSis(64, 86, 3, 1) + eighthBro(96, 86, 3, -1) + ash(30, 9),

    // 10 · Vader's Wrath: Darth Vader on the fortress platform above the
    // lava. The black tower rises behind him against the burning sky,
    // lavafalls pour below; Vader stands in full, cape spread and red saber
    // raised, purge troopers with electrostaffs at his flanks.
    vaders_wrath: () => fill([[0, '#0e0404'], [0.4, '#3a0e08'], [0.8, '#a82a14'], [1, '#e85a1a']]) + clouds(10, 10, 0.7) + clouds(26, 11, 0.4)
      + volcano(30, 64, 22, 16) + castle(124, 74, 0.92) + ridge(64, 8, '#1e1416', 11) + lavafall(70, 56, 74, 6) + lava('M-4 70 L164 70 L164 78 L-4 78Z', 11, 80, 74, 80, 3)
      + P('M10 90 L22 74 L138 74 L150 90Z', '#16141a', 'stroke="#3a3a42" stroke-width=".4"') + L(22, 74, 138, 74, '#ff7a3a', 0.4, 'opacity=".6"') + Array.from({ length: 6 }, (_, k) => L(f2(22 - k * 2.4), 74 + k * 3, f2(138 + k * 2.4), 74 + k * 3, '#0e0c0e', 0.3)).join('') + [30, 50, 110, 130].map((px) => C(px, 75, 0.4, '#ff3a2a')).join('')
      + purge(40, 86, 2.6, 1, 'staff') + purge(124, 86, 2.6, -1, 'staff') + vaderFull(80, 88, 3.6, 1) + ash(40, 10),
  };
  Object.assign(SA.scenes, MU);
  SA.worlds.mustafar = ['lava_fields', 'purge_patrol', 'mining_facility', 'the_rescue', 'lava_river', 'fortress_skies', 'the_inquisitorius', 'the_old_sith', 'fortress_gate', 'vaders_wrath'];
})(typeof window !== 'undefined' ? window : globalThis);
