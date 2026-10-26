// Update 2.4: the ten Exegol stage scenes, for approval. Same 160x90 format
// as the worlds before, all set on the hidden Sith world under its endless
// storm: TIE Defenders in the lightning, the Sith Citadel's gates, the
// Knights of Ren in the fog, Kylo Ren's landing, the Sith fleet rising, the
// Final Order's hangar, Rey and Kylo in the ruins, the throne room and its
// guard, the Xyston fleet, and the Emperor on his throne.
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
  const f2 = (v) => +v.toFixed(2);
  const RED = '#ff3a2a';
  const GRN = '#3aff6a';
  const none = () => '';
  const robed = kit.robed || none;
  const falcon = kit.falcon || none;
  const awing = kit.awing || none;
  const xwing = kit.xwing || none;
  const tieBall = kit.tieBall || ((r) => C(0, 0, r, '#7a808a'));
  const AWGUNS = [[1.4, -5.6], [1.4, 5.6]];
  const XWGUNS = [[13, -9.8]];

  // ---------- The world ----------
  const SKY = [[0, '#05060c'], [0.45, '#121624'], [0.8, '#262c3c'], [1, '#3a4254']];
  // Storm clouds rolling over Exegol, their edges lit by the lightning.
  const clouds = (y, seed, a = 0.8) => Array.from({ length: 10 }, (_, k) => { const x = ((k * 21 + seed * 17) % 180) - 10; const r = 7 + ((k * 7 + seed) % 5) * 3; const yy = f2(y + ((k * 5) % 7) - 3); return E(x, yy, f2(r * 1.8), f2(r * 0.6), '#0a0c14', `opacity="${a}"`) + P(`M${f2(x - r * 1.5)} ${f2(yy - r * 0.25)} Q${x} ${f2(yy - r * 0.75)} ${f2(x + r * 1.5)} ${f2(yy - r * 0.25)}`, 'none', `stroke="#6a78a8" stroke-width=".35" opacity="${(a * 0.5).toFixed(2)}"`); }).join('');
  // A lightning bolt: a jagged main stroke with a branch, glowing blue-white.
  const lightning = (x, y, len, seed, a = 0.9) => {
    const pts = [[x, y]]; let cx = x; let cy = y;
    for (let k = 1; k <= 8; k++) { cx += (((k * 37 + seed * 13) % 7) - 3) * 1.2; cy += len / 8; pts.push([f2(cx), f2(cy)]); }
    const d = `M${pts.map((p) => p.join(' ')).join(' L')}`;
    const b0 = pts[3]; const bd = `M${b0.join(' ')} L${f2(b0[0] + 3)} ${f2(b0[1] + len * 0.12)} L${f2(b0[0] + 2)} ${f2(b0[1] + len * 0.2)} L${f2(b0[0] + 5)} ${f2(b0[1] + len * 0.32)}`;
    return `<g opacity="${a}">${P(d, 'none', 'stroke="#8a9cff" stroke-width="1.8" opacity=".25"')}${P(d, 'none', 'stroke="#e8eeff" stroke-width=".45"')}${P(bd, 'none', 'stroke="#c8d4ff" stroke-width=".25"')}</g>` + glow(x, y, len * 0.08, '#8a9cff', 0.15);
  };
  // A jagged spire of black Exegol rock, rim-lit by the storm.
  const spike = (x, base, w, h, c = '#0e1018') => P(`M${f2(x - w)} ${base} L${f2(x - w * 0.6)} ${f2(base - h * 0.4)} L${f2(x - w * 0.75)} ${f2(base - h * 0.55)} L${f2(x - w * 0.3)} ${f2(base - h * 0.85)} L${x} ${base - h} L${f2(x + w * 0.25)} ${f2(base - h * 0.8)} L${f2(x + w * 0.5)} ${f2(base - h * 0.6)} L${f2(x + w * 0.4)} ${f2(base - h * 0.45)} L${f2(x + w)} ${base}Z`, c)
    + P(`M${f2(x - w)} ${base} L${f2(x - w * 0.6)} ${f2(base - h * 0.4)} L${f2(x - w * 0.75)} ${f2(base - h * 0.55)} L${f2(x - w * 0.3)} ${f2(base - h * 0.85)} L${x} ${base - h}`, 'none', 'stroke="#6a78a8" stroke-width=".3" opacity=".6"') + P(`M${x} ${base - h} L${f2(x + w * 0.25)} ${f2(base - h * 0.8)} L${f2(x + w * 0.5)} ${f2(base - h * 0.6)} L${f2(x + w * 0.4)} ${f2(base - h * 0.45)} L${f2(x + w)} ${base} L${f2(x + w * 0.1)} ${base}Z`, '#000', 'opacity=".3"');
  // Banks of fog drifting low across the ground.
  const fog = (y, a, seed) => Array.from({ length: 8 }, (_, k) => E(((k * 23 + seed * 11) % 180) - 10, f2(y + ((k * 3) % 5) - 2), 22 + (k % 3) * 8, 3 + (k % 2) * 1.6, '#8a94a8', `opacity="${a}"`)).join('');
  // The dark ground of Exegol: cracked black rock with a storm sheen.
  const ground = (y) => R(0, y, 160, 90 - y, '#0c0e14') + L(0, y, 160, y, '#4a5478', 0.4, 'opacity=".6"') + P(`M10 ${y + 6} L26 ${y + 10} L24 ${y + 18} M70 ${y + 4} L84 ${y + 9} M118 ${y + 8} L134 ${y + 14} L130 ${y + 22} M144 ${y + 4} L152 ${y + 10}`, 'none', 'stroke="#1e2232" stroke-width=".4"');
  // The Sith Citadel: a vast dark mass of tiers with flanking pillars, red
  // light in its window rows and the great arched gate glowing red.
  const citadel = (x, base, s) => g(x, base, s, 1,
    P('M-40 0 L-30 -30 L-12 -46 L12 -46 L30 -30 L40 0Z', '#14141c', 'stroke="#2a2e3e" stroke-width=".3"') + P('M0 -46 L12 -46 L30 -30 L40 0 L0 0Z', '#000', 'opacity=".3"')
    + [-8, -16, -24, -32, -40].map((yy) => { const hw = yy > -30 ? 40 + yy / 3 : 30 + (yy + 30) * 1.12; return L(f2(-hw), yy, f2(hw), yy, '#22242e', 0.35); }).join('')
    + [-12, -20, -28, -36].map((yy, k) => Array.from({ length: 9 - k * 2 }, (_, m) => R(f2(-24 + k * 5 + m * ((48 - k * 10) / (8 - k * 2 || 1))), yy, 1, 0.5, '#ff3a2a', 'opacity=".75"')).join('')).join('')
    + [-26, -16, 16, 26].map((px) => R(px - 1.6, -40, 3.2, 40, '#101018', 'stroke="#2a2e3e" stroke-width=".2"') + P(`M${px - 2.2} -40 L${px} -44 L${px + 2.2} -40Z`, '#1a1a24') + C(px, -41.4, 0.35, RED)).join('')
    + P('M-10 0 L-10 -22 Q0 -34 10 -22 L10 0Z', '#08080c', 'stroke="#ff3a2a" stroke-width=".5" stroke-opacity=".7"') + P('M-7 0 L-7 -21 Q0 -30 7 -21 L7 0Z', '#3a0a08', 'opacity=".8"') + glow(0, -12, 5, RED, 0.25)
    + R(-1, -60, 2, 14, '#14141c') + C(0, -60.4, 0.5, RED)
    + P('M-40 0 L-30 -30 L-12 -46', 'none', 'stroke="#7a88b8" stroke-width=".35" opacity=".6"'));
  // A colossal Sith statue carved from black stone: a hooded figure on a
  // rune-cut pedestal, the mantle over its shoulders with violet trim, a
  // masked face in the hood's shadow with faintly glowing eye slits, arms
  // bent to grip a great sword resting point-down, deep robe folds catching
  // the storm light, and cracks running through the stone.
  const statue = (x, base, h, f = 1) => g(x, base, f2(h / 40), f,
    R(-11, -3, 22, 3, '#1a1a24', 'stroke="#2a2a36" stroke-width=".3"') + R(-10, -4.6, 20, 1.6, '#20202a', 'stroke="#2a2a36" stroke-width=".2"') + [-7, -3, 1, 5].map((px) => P(`M${px} -1.6 l1 -.6 l1 .6 l-1 .6Z`, '#6a4a9a', 'opacity=".7"')).join('') + L(-11, -3, 11, -3, '#3a3a4a', 0.25)
    + P('M-9 -4.6 L-8 -20 C-9 -27 -7 -34 -4 -37 C-2 -40 2 -40 4 -37 C7 -34 9 -27 8 -20 L9 -4.6Z', '#16161e', 'stroke="#2a2a36" stroke-width=".4"') + P('M1 -38.6 C4 -38 7 -34 8 -27 L8 -20 L9 -4.6 L3 -4.6Z', '#000', 'opacity=".3"')
    + [-6, -3.6, -1.2, 1.2, 3.6, 6].map((px) => P(`M${f2(px * 0.6)} -19 Q${f2(px * 0.9)} -12 ${f2(px * 1.2)} -4.6`, 'none', 'stroke="#0a0a10" stroke-width=".55"') + P(`M${f2(px * 0.6 + 0.4)} -19 Q${f2(px * 0.9 + 0.4)} -12 ${f2(px * 1.2 + 0.4)} -4.6`, 'none', 'stroke="#3a3a4c" stroke-width=".2" opacity=".6"')).join('')
    + P('M-8.4 -24 C-6 -28.4 6 -28.4 8.4 -24 L7.4 -20.6 C4 -22.8 -4 -22.8 -7.4 -20.6Z', '#1e1e28', 'stroke="#2a2a36" stroke-width=".3"') + P('M-7.6 -21.4 C-4 -23.4 4 -23.4 7.6 -21.4', 'none', 'stroke="#6a4a9a" stroke-width=".35" opacity=".7"') + [-5, -2.5, 0, 2.5, 5].map((px) => C(px, f2(-22.6 + Math.abs(px) * 0.12), 0.3, '#3a3a4c')).join('')
    + P('M-4.4 -27 C-5.4 -31 -4.6 -36 -2 -38.4 C-0.6 -39.4 0.6 -39.4 2 -38.4 C4.6 -36 5.4 -31 4.4 -27 L2.8 -27.6 C3.4 -31 2.8 -34.4 0 -35.6 C-2.8 -34.4 -3.4 -31 -2.8 -27.6Z', '#1a1a24', 'stroke="#2a2a36" stroke-width=".3"') + P('M-2.8 -27.6 C-3.4 -31 -2.8 -34.4 0 -35.6 C2.8 -34.4 3.4 -31 2.8 -27.6Z', '#06060a')
    + P('M-2 -33.2 C-1.8 -31 1.8 -31 2 -33.2 L1.4 -29.6 C0.6 -28.8 -0.6 -28.8 -1.4 -29.6Z', '#24242e', 'stroke="#3a3a4a" stroke-width=".15"') + R(-1.5, -32.4, 1.1, 0.35, '#8a5aff', 'opacity=".55"') + R(0.4, -32.4, 1.1, 0.35, '#8a5aff', 'opacity=".55"') + glow(0, -32.2, 0.6, '#8a5aff', 0.2) + L(0, -31.6, 0, -29.4, '#3a3a4a', 0.15)
    + P('M-7 -22.6 L-4.6 -18.4 L-1.2 -19.6', 'none', 'stroke="#1a1a24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"') + P('M7 -22.6 L4.6 -18.4 L1.2 -19.6', 'none', 'stroke="#1a1a24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"') + P('M-7 -22.6 L-4.6 -18.4', 'none', 'stroke="#4a4a5c" stroke-width=".25"')
    + R(-0.7, -17.8, 1.4, 12.6, '#2a2a36', 'stroke="#14141c" stroke-width=".15"') + L(-0.35, -17.4, -0.35, -5.6, '#5a5a6e', 0.15) + P('M-0.7 -5.2 L0 -4.2 L0.7 -5.2Z', '#2a2a36') + R(-3.2, -19.2, 6.4, 1.1, '#2e2e3a', 'stroke="#14141c" stroke-width=".15"') + R(-0.5, -21.2, 1, 2, '#24242e') + C(0, -21.6, 0.7, '#2e2e3a') + C(-1.2, -19.6, 0.75, '#1e1e28') + C(1.2, -19.6, 0.75, '#1e1e28')
    + P('M-6 -14 L-5 -11 L-6.4 -8 M5.4 -30 L4.4 -27 M-3 -36 L-2 -33', 'none', 'stroke="#08080c" stroke-width=".3"')
    + P('M-9 -4.6 L-8 -20 C-9 -27 -7 -34 -4 -37 C-2 -40 0 -39.6 0 -39.6', 'none', 'stroke="#6a78a8" stroke-width=".45" opacity=".55"'));
  // The Sith Eternal crowd packing the tiers: rows of small hooded figures.
  const crowd = (y0, rows, x1, x2) => Array.from({ length: rows }, (_, r) => Array.from({ length: Math.floor((x2 - x1) / 2.4) }, (_, k) => { const x = f2(x1 + k * 2.4 + (r % 2) * 1.2); const y = y0 + r * 3.2; return P(`M${f2(x - 0.8)} ${y} L${x} ${f2(y - 2)} L${f2(x + 0.8)} ${y}Z`, r % 2 ? '#0e0e14' : '#12121a') + C(x, f2(y - 1.5), 0.12, '#8a5aff', 'opacity=".5"'); }).join('') + L(x1, y0 + r * 3.2 + 0.2, x2, y0 + r * 3.2 + 0.2, '#22242e', 0.3)).join('');

  // ---------- Ships ----------
  // A Xyston-class Star Destroyer in three-quarter view, bow left: the dark
  // wedge with its plating and red-lit trenches, the stepped superstructure
  // and command tower, rows of red lights, the axial superlaser running
  // under the keel to its glowing emitter, and the engines at the stern.
  const XYGUN = [-25, 4.8];
  const xyston = (x, y, s, f = 1, firing = false) => g(x, y, s, f,
    P('M-30 1 L16 -7 L24 -5 L24 1Z', '#3a3644', 'stroke="#14121a" stroke-width=".25"') + P('M-30 1 L24 1 L24 5.6 L-26 3.6Z', '#22202a', 'stroke="#14121a" stroke-width=".2"')
    + [-20, -12, -4, 4, 12].map((px) => L(px, f2(1 - (px + 30) * 0.174 + 0.2), px, 1, '#24222c', 0.2)).join('') + P('M-26 0.4 L18 -5.6', 'none', 'stroke="#ff3a2a" stroke-width=".2" opacity=".7"') + P('M-30 1 L16 -7', 'none', 'stroke="#8a90c0" stroke-width=".25" opacity=".6"')
    + [[-8, -2.4, 6, 1.6], [0, -3.8, 6, 1.8], [8, -5.2, 6, 2]].map(([bx, by, bw, bh]) => R(bx, by, bw, bh, '#46404e', 'stroke="#14121a" stroke-width=".15"') + R(bx + 0.6, by + 0.4, bw - 1.2, 0.3, '#ff3a2a', 'opacity=".6"')).join('')
    + R(15, -10.4, 8, 4, '#46404e', 'stroke="#14121a" stroke-width=".15"') + R(16.4, -13.4, 5.2, 3, '#524a5a', 'stroke="#14121a" stroke-width=".15"') + R(15.4, -9.2, 7.2, 0.4, '#ff3a2a', 'opacity=".7"') + C(17, -13.8, 1, '#5a5466') + C(21, -13.8, 1, '#5a5466')
    + Array.from({ length: 14 }, (_, k) => C(f2(-22 + k * 3.2), f2(2.4 + (k % 2) * 0.8), 0.22, k % 4 ? '#ff5a4a' : '#ffd0c0', 'opacity=".85"')).join('')
    + P('M-24 3.6 L18 5.4 L18 7.6 L-24 6Z', '#16141c', 'stroke="#0a080e" stroke-width=".2"') + [-16, -8, 0, 8].map((px) => L(px, f2(3.9 + (px + 24) * 0.043), px, f2(6.1 + (px + 24) * 0.038), '#3a3644', 0.3)).join('') + L(-24, 4.8, 18, 6.5, '#ff3a2a', 0.15, 'opacity=".6"')
    + E(-24.4, 4.8, 0.9, 1.4, firing ? '#ffd0c0' : '#ff3a3a') + glow(-24.6, 4.8, firing ? 1.6 : 1, '#ff2a1a', firing ? 0.6 : 0.4)
    + [0, 2.2, 4.2].map((ey) => E(24.4, ey, 0.5, 0.9, '#9ad8ff') + glow(24.6, ey, 0.6, '#6ab8ff', 0.35)).join(''));
  // A TIE Defender, three-quarter front view: the ball cockpit with its
  // spoked window turned toward its heading, the rear hull and engine glow,
  // and three wings in a Y on their pylons, each with a red-striped edge
  // and a laser cannon pod at its tip.
  const DF = [0.894, 0.447];
  const DB = [-1.1, -0.24];
  const DDIRS = [[0, -1], [-0.87, 0.5], [0.87, 0.5]];
  const DHEAD = 26.57;
  const DGUNS = DDIRS.map(([dx, dy]) => [f2(dx * 12.4 + DF[0] * 2.4), f2(dy * 12.4 + DF[1] * 2.4)]);
  const tieDef = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M0.72 -1.43 L-5.77 -4.11 L-6.75 -2.15 L-0.72 1.43Z', '#4e545e', 'stroke="#22252c" stroke-width=".2"') + L(-1, -0.4, -6, -2.8, '#8a909a', 0.2) + E(-6.5, -3.2, 0.7, 1, '#ff6a4a') + glow(-6.8, -3.3, 0.8, '#ff6a4a', 0.4)
    + DDIRS.map(([dx, dy]) => {
      const A = [f2(dx * 3.6), f2(dy * 3.6)]; const B = [f2(dx * 12.4), f2(dy * 12.4)]; const Cc = [f2(B[0] + DB[0] * 4.6), f2(B[1] + DB[1] * 4.6)]; const D = [f2(A[0] + DB[0] * 4.6), f2(A[1] + DB[1] * 4.6)];
      const lerp = (p, q, t) => `${f2(p[0] + (q[0] - p[0]) * t)} ${f2(p[1] + (q[1] - p[1]) * t)}`;
      return P(`M${A.join(' ')} L${B.join(' ')} L${Cc.join(' ')} L${D.join(' ')}Z`, dy < 0 ? '#464e5c' : '#3a404c', 'stroke="#121418" stroke-width=".4"')
        + [0.25, 0.5, 0.75].map((t) => P(`M${lerp(A, B, t)} L${lerp(D, Cc, t)}`, 'none', 'stroke="#1e2128" stroke-width=".25"')).join('') + P(`M${lerp(A, D, 0.5)} L${lerp(B, Cc, 0.5)}`, 'none', 'stroke="#1e2128" stroke-width=".2"')
        + L(B[0], B[1], Cc[0], Cc[1], '#b8241c', 0.55) + L(A[0], A[1], f2(dx * 1.8), f2(dy * 1.8), '#3a3e46', 0.9)
        + C(B[0], B[1], 0.8, '#2a2e36', 'stroke="#0c0e12" stroke-width=".15"') + L(B[0], B[1], f2(B[0] + DF[0] * 2.4), f2(B[1] + DF[1] * 2.4), '#2a2e36', 0.6);
    }).join('')
    + `<g transform="rotate(${DHEAD})">${tieBall(2.9)}</g>`, a);

  // ---------- People ----------
  // A Sith trooper: blood-red armour over the black bodyglove, the helmet
  // with its angular black visor and mouth grille, and a blaster rifle.
  const sithTrooper = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 3, 0.5, '#000', 'opacity=".3"')
    + P('M-2 -5.2 L-2.2 0 L-0.4 0 L-0.3 -5.2Z M0.3 -5.2 L0.4 0 L2.2 0 L2 -5.2Z', '#0e0e10')
    + R(-2.1, -4.4, 1.7, 3.2, '#b8241c', 'rx=".3" stroke="#4a0a08" stroke-width=".1"') + R(0.4, -4.4, 1.7, 3.2, '#b8241c', 'rx=".3" stroke="#4a0a08" stroke-width=".1"') + L(-1.7, -4, -1.7, -1.6, '#e8584a', 0.15) + L(0.8, -4, 0.8, -1.6, '#e8584a', 0.15)
    + P('M-2.4 0 L-0.2 0 L-0.3 -1 L-2.2 -1Z M0.2 0 L2.6 0 L2.3 -1 L0.3 -1Z', '#8a1a14', 'stroke="#4a0a08" stroke-width=".1"')
    + R(-2.5, -6.1, 5, 0.9, '#141416') + R(-0.5, -6.2, 1, 1, '#8a1a14')
    + P('M-2.5 -6 L-2.7 -10 L2.7 -10 L2.5 -6Z', '#0e0e10') + P('M-2.2 -9.8 L2.2 -9.8 L2 -7.8 L0 -7.2 L-2 -7.8Z', '#c02a20', 'stroke="#4a0a08" stroke-width=".12"') + P('M-1.6 -7.2 L1.6 -7.2 L1.4 -6.3 L-1.4 -6.3Z', '#a8201a', 'stroke="#4a0a08" stroke-width=".1"') + P('M-1.8 -9.6 L-0.4 -9.6 L-0.8 -8.4', 'none', 'stroke="#ff8a7a" stroke-width=".15" opacity=".7"') + L(0, -9.8, 0, -7.4, '#4a0a08', 0.12)
    + E(-2.9, -9.4, 1, 0.75, '#c02a20', 'stroke="#4a0a08" stroke-width=".12"') + E(2.9, -9.4, 1, 0.75, '#c02a20', 'stroke="#4a0a08" stroke-width=".12"') + P('M-3.6 -8.6 L-3.8 -6 L-3.2 -5.6', 'none', 'stroke="#0e0e10" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"') + R(-4, -7.6, 0.9, 1.4, '#b8241c', 'rx=".2"')
    + R(-0.6, -10.8, 1.2, 0.9, '#0a0a0c')
    + P('M-1.9 -11.4 C-2.1 -14.2 2.1 -14.2 1.9 -11.4 L1.7 -10.4 L-1.7 -10.4Z', '#c02a20', 'stroke="#4a0a08" stroke-width=".15"') + P('M-1.2 -13.6 C-0.4 -14 0.6 -14 1.3 -13.5', 'none', 'stroke="#ff8a7a" stroke-width=".25" opacity=".6"')
    + P('M-1.6 -12.6 L-0.2 -12.4 L0 -11.9 L0.2 -12.4 L1.6 -12.6 L1.4 -11.9 L0.4 -11.8 L0 -11.4 L-0.4 -11.8 L-1.4 -11.9Z', '#0a0a0c') + P('M-0.6 -11.3 L0.6 -11.3 L0.4 -10.6 L-0.4 -10.6Z', '#1a1a1e') + [-0.25, 0, 0.25].map((gx) => L(gx, -11.2, gx, -10.7, '#5a5a62', 0.07)).join('') + P('M-1.7 -11.6 L-1.2 -10.8 M1.7 -11.6 L1.2 -10.8', 'none', 'stroke="#4a0a08" stroke-width=".2"')
    + P('M2.2 -9.4 L3.5 -8.4 L3.2 -7.9 L2 -8.6Z', '#0e0e10') + R(2.2, -9.4, 1, 0.8, '#b8241c', 'transform="rotate(38 2.7 -9)"') + C(3.6, -7.9, 0.42, '#0e0e10') + R(0.4, -8.5, 5.6, 0.75, '#1a1a1e') + R(1.2, -9.1, 2, 0.6, '#2a2a30') + R(0.4, -8.1, 0.9, 1.4, '#1a1a1e') + L(6, -8.12, 7, -8.12, '#3a3a40', 0.4));
  // A Knight of Ren: ragged dark cloak over scavenged armour, a hood, and
  // each knight's own mask and weapon. v 0 Vicrul (scythe), 1 Cardo (arm
  // cannon), 2 Ushar (war club), 3 Kuruk (rifle), 4 Trudgen (vibro-cleaver),
  // 5 Ap'lek (axe).
  const MASKS = [
    P('M-1.5 -11 C-1.8 -13.8 1.8 -13.8 1.5 -11 L1 -10.4 L-1 -10.4Z', '#4a4644', 'stroke="#141210" stroke-width=".15"') + R(-1.2, -12.7, 2.4, 0.45, '#0a0a0a') + [-0.6, 0, 0.6].map((px) => L(px, -11.9, px, -10.6, '#0a0a0a', 0.22)).join('') + P('M-1.4 -11.2 L-0.8 -10.5 M1.4 -11.2 L0.8 -10.5', 'none', 'stroke="#6a6664" stroke-width=".15"'),
    P('M-1.6 -11 C-1.9 -14 1.9 -14 1.6 -11 L1.2 -10.4 L-1.2 -10.4Z', '#3a3634', 'stroke="#141210" stroke-width=".15"') + E(-0.6, -12.4, 0.4, 0.3, '#0a0a0a') + E(0.6, -12.4, 0.4, 0.3, '#0a0a0a') + C(0, -11, 0.55, '#2a2624', 'stroke="#5a5654" stroke-width=".12"') + [-0.25, 0.25].map((px) => C(px, -11, 0.12, '#0a0a0a')).join('') + E(-1.5, -11.6, 0.3, 0.5, '#5a5654'),
    P('M-1.5 -11 C-1.8 -13.8 1.8 -13.8 1.5 -11 L0.8 -10.4 L-0.8 -10.4Z', '#5a4a3a', 'stroke="#1a140e" stroke-width=".15"') + P('M-1.2 -12.5 L1.2 -12.5 M0 -12.5 L0 -10.6', 'none', 'stroke="#0a0a0a" stroke-width=".35"') + P('M-1.4 -12 L-1 -11 M1.4 -12 L1 -11', 'none', 'stroke="#8a7a6a" stroke-width=".18"'),
    P('M-1.5 -11 C-1.8 -13.8 1.8 -13.8 1.5 -11 L1 -10.4 L-1 -10.4Z', '#2e2c2a', 'stroke="#141210" stroke-width=".15"') + R(-1.2, -12.9, 2.4, 1.6, '#0e0e0e') + [-0.6, 0, 0.6].map((px) => L(px, -12.9, px, -11.3, '#4a4644', 0.1)).join('') + [-12.4, -11.8].map((py) => L(-1.2, py, 1.2, py, '#4a4644', 0.1)).join(''),
    P('M-1.7 -11 C-2 -14 2 -14 1.7 -11 L1.2 -10.4 L-1.2 -10.4Z', '#3e3a36', 'stroke="#141210" stroke-width=".15"') + P('M-1.5 -12.2 Q0 -11.2 1.5 -12.2 L1.3 -11.4 Q0 -10.6 -1.3 -11.4Z', '#0a0a0a') + C(-0.7, -12.9, 0.22, '#5a5654') + C(0.7, -12.9, 0.22, '#5a5654'),
    P('M-1.5 -11 C-1.8 -13.8 1.8 -13.8 1.5 -11 L1 -10.4 L-1 -10.4Z', '#46423e', 'stroke="#141210" stroke-width=".15"') + P('M-1.5 -13.1 L1.5 -13.1 L1.2 -12.6 L-1.2 -12.6Z', '#5a5654') + R(-1.1, -12.3, 2.2, 0.35, '#0a0a0a') + L(0, -12, 0, -10.7, '#0a0a0a', 0.3),
  ];
  const WEAPONS = [
    L(2.6, 0.6, 4, -17.4, '#3a3028', 0.5) + P('M4 -17.4 C1.4 -18.6 -1.4 -17.8 -2.8 -15.6 C-0.8 -16.6 1.4 -16.8 3.8 -16.2Z', '#8a8a92', 'stroke="#2a2a30" stroke-width=".15"') + L(-2.6, -15.7, 3.6, -16.4, '#d8d8e0', 0.12) + C(3.1, -8.2, 0.42, '#1a1816'),
    R(1.6, -9.4, 5.6, 1.8, '#3a3634', 'rx=".4" stroke="#141210" stroke-width=".15"') + R(6.8, -9.1, 1, 1.2, '#1a1816') + C(7.4, -8.5, 0.4, '#0a0a0a') + [2.6, 3.6, 4.6].map((px) => L(px, -9.4, px, -7.6, '#141210', 0.15)).join('') + P('M2 -7.6 C2.4 -6 3.6 -5.6 4.4 -6.2', 'none', 'stroke="#8a6a3a" stroke-width=".35" stroke-dasharray=".3 .2"'),
    L(2.8, -6.4, 5.6, -13.6, '#5a3a22', 0.7) + P('M4.6 -12.8 L6.8 -13.6 L7.2 -15.6 L5.6 -16 L4.4 -14.6Z', '#4a4440', 'stroke="#141210" stroke-width=".15"') + [[5.4, -15.4], [6.6, -14.4], [5.2, -13.6]].map(([px, py]) => C(px, py, 0.18, '#8a8a92')).join('') + C(2.9, -6.6, 0.42, '#1a1816'),
    P('M2.2 -9.4 L3.5 -8.4 L3.2 -7.9 L2 -8.6Z', '#1a1816') + C(3.6, -7.9, 0.42, '#1a1816') + R(0.4, -8.5, 7, 0.65, '#2a2826') + R(1.2, -9.1, 2.4, 0.6, '#3a3634') + R(0.4, -8.1, 0.9, 1.4, '#2a2826') + L(7.4, -8.2, 8.4, -8.2, '#4a4644', 0.35),
    L(2.8, -6.4, 4.2, -9.6, '#3a3028', 0.55) + P('M3.4 -9 L7.6 -16.6 L9.2 -15.4 L5.6 -8.4Z', '#6a6a72', 'stroke="#1a1a1e" stroke-width=".18"') + L(5.6, -8.6, 9, -15.2, '#c8c8d0', 0.15) + C(2.9, -6.6, 0.42, '#1a1816'),
    L(2.6, 0.2, 4.6, -14.6, '#3a3028', 0.5) + P('M4.4 -13.4 C6.4 -14.6 7.6 -13.6 7.6 -11.8 C6.4 -12.4 5.4 -12.2 4.6 -11.4Z', '#7a7a82', 'stroke="#1a1a1e" stroke-width=".15"') + L(7.4, -13.4, 7.4, -11.9, '#c8c8d0', 0.12) + C(3.3, -6, 0.42, '#1a1816'),
  ];
  const knight = (x, y, s, f = 1, v = 0) => g(x, y, s, f,
    E(0, 0.2, 3.4, 0.5, '#000', 'opacity=".3"')
    + P('M-3 -11 C-4.2 -7 -4.8 -3 -5 -0.4 L-4 0 L-3.4 -1 L-2.6 0 L-1.6 -0.8 L-0.6 0 L0.6 -0.8 L1.6 0 L2.6 -0.9 L3.6 0 L4.6 -0.4 C4.4 -3 4 -7 3 -11Z', '#1a1816', 'stroke="#0a0908" stroke-width=".2"') + P('M-2 -9 L-3 -1 M0 -9 L-0.4 -1 M2 -9 L2.6 -1 M-3.6 -5 L-4.2 -1.4', 'none', 'stroke="#2a2624" stroke-width=".25"')
    + R(-1.8, -2.2, 1.4, 2.2, '#141210') + R(0.4, -2.2, 1.4, 2.2, '#141210')
    + P('M-2.2 -10.4 L2.2 -10.4 L1.8 -6 L-1.8 -6Z', '#2e2a28', 'stroke="#0a0908" stroke-width=".15"') + P('M-1.6 -10 L1.4 -7.4 M1.6 -10 L-1.4 -7.4', 'none', 'stroke="#5a4a3a" stroke-width=".3"') + R(-2, -6.4, 4, 0.8, '#3a2a1e') + [-1.4, 0.2].map((bx) => R(bx, -6.5, 1, 1, '#4a3a2a')).join('')
    + E(-2.4, -10, 1.2, 0.8, '#3a3634', 'stroke="#0a0908" stroke-width=".12"') + E(2.4, -10, 1.2, 0.8, '#3a3634', 'stroke="#0a0908" stroke-width=".12"') + L(-2.8, -10.3, -1.8, -10.6, '#6a6664', 0.15)
    + P('M-2.6 -10 L-3.4 -6.4 L-2.8 -5.4', 'none', 'stroke="#1a1816" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"')
    + P('M-2 -10.6 C-2.6 -13.8 -1.6 -15.4 0 -15.6 C1.6 -15.4 2.6 -13.8 2 -10.6 L1.4 -10.8 C1.6 -12.8 1 -14 0 -14 C-1 -14 -1.6 -12.8 -1.4 -10.8Z', '#141210', 'stroke="#000" stroke-width=".15"')
    + MASKS[v % 6]
    + P('M2.4 -9.8 L3.2 -8 L3 -6.8', 'none', 'stroke="#1a1816" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"') + WEAPONS[v % 6]);
  // Kylo Ren in his rebuilt helmet, the cracks glowing red, his cloak, and
  // the unstable red crossguard saber crackling.
  const kylo = (x, y, s, f = 1) => robed(x, y, s, f, { robe: '#0e0e10', tunic: '#1a1a1e', skin: '#141416', saber: '#ff2a1a', ang: -26, trim: '#2a2a2e', belt: '#2a2a2e', fold: '#000', eye: '#141416' })
    + g(x, y, s, f, P('M-1.7 -10.8 C-2 -14.4 2 -14.4 1.7 -10.8 L1.2 -10.4 L-1.2 -10.4Z', '#141416', 'stroke="#000" stroke-width=".15"') + P('M-1.3 -12.5 L1.3 -12.5 M0 -12.5 L0 -10.7', 'none', 'stroke="#a8a8b2" stroke-width=".22"') + P('M-1.2 -12.3 L-0.2 -12.3 L-0.2 -11.9 L-1.1 -12Z M1.2 -12.3 L0.2 -12.3 L0.2 -11.9 L1.1 -12Z', '#000') + P('M-1.2 -13.6 L-0.6 -13 L-0.9 -12.6 M0.9 -13.8 L0.5 -13.1 L1 -12.7 M-0.5 -11.6 L-0.9 -11 M0.6 -11.4 L1 -10.8', 'none', 'stroke="#ff3a2a" stroke-width=".14"') + P('M-1 -13.8 C-0.4 -14.1 0.4 -14.1 1 -13.8', 'none', 'stroke="#6a6a78" stroke-width=".18" opacity=".7"')
      + `<g transform="rotate(-26 3.4 -8)">${L(2, -9.2, 4.8, -9.2, '#ff2a1a', 0.75)}${L(2, -9.2, 4.8, -9.2, '#ffe0d8', 0.25)}${P('M3 -10 L3.8 -11.4 L3 -12.8 L3.9 -14.2 L3 -15.6 L3.8 -17 L3.1 -18.4 L3.7 -19.6', 'none', 'stroke="#ff5a3a" stroke-width=".3" opacity=".8"')}</g>` + glow(1.4, -12, 0.6, '#ff2a1a', 0.2));
  // Rey with the Skywalker saber, in her pale wraps, hair half up.
  const rey = (x, y, s, f = 1) => robed(x, y, s, f, { robe: '#d8d0c0', tunic: '#efe8da', skin: '#ecc4a0', hair: 'M-1.5 -12.2 C-1.7 -14.2 1.7 -14.2 1.5 -12.2 L1.2 -12.7 C0.4 -13.2 -0.4 -13.2 -1.2 -12.7Z', hairC: '#4a2e1a', saber: '#3a8aff', trim: '#b8ae9a', belt: '#7a5a3a', fold: '#a8a090' }) + g(x, y, s, f, C(0, -14.2, 0.6, '#4a2e1a') + P('M-1.4 -12 C-1.6 -11 -1.5 -10.4 -1.2 -10', 'none', 'stroke="#4a2e1a" stroke-width=".35"'));
  // The Emperor reborn: black hooded robes, gnarled hands raised, and the
  // face from his Emperor Reborn boss card: the deep hood with its lit rim,
  // the ravaged pale face in the hood's shadow, milky eyes, lined cheeks and
  // a thin cruel mouth.
  const palpatine = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 4, 0.6, '#000', 'opacity=".35"')
    + P('M-3 -10.6 C-4.4 -6 -5 -3 -5.4 0 L5.4 0 C5 -3 4.4 -6 3 -10.6Z', '#0a0a0c', 'stroke="#000" stroke-width=".2"') + P('M-1.6 -9 L-2.6 0 M0 -9 L0 0 M1.6 -9 L2.6 0 M-3.4 -4 L-4.4 0 M3.4 -4 L4.4 0', 'none', 'stroke="#1e1e24" stroke-width=".3"') + P('M-3 -10.6 C-4.4 -6 -5 -3 -5.4 0', 'none', 'stroke="#6a78a8" stroke-width=".3" opacity=".5"')
    + P('M-2.6 -10 L-5.6 -11.8 L-6.2 -10.6 L-2.8 -8.4Z M2.6 -10 L5.6 -11.8 L6.2 -10.6 L2.8 -8.4Z', '#0e0e12', 'stroke="#000" stroke-width=".15"')
    + P('M-6 -11.6 L-7.2 -12.6 M-6.1 -11.3 L-7.4 -11.8 M-6.1 -11 L-7.3 -10.9 M-5.8 -10.8 L-6.6 -10.2 M6 -11.6 L7.2 -12.6 M6.1 -11.3 L7.4 -11.8 M6.1 -11 L7.3 -10.9 M5.8 -10.8 L6.6 -10.2', 'none', 'stroke="#b8b8a8" stroke-width=".28" stroke-linecap="round"')
    + `<g transform="translate(-6.5 -19.19) scale(.13)">`
    + P('M28 70 C24 44 34 22 50 21 C66 22 76 44 72 70 C68 62 62 58 60 50 C58 40 54 36 50 36 C46 36 42 40 40 50 C38 58 32 62 28 70Z', '#1a1620')
    + '<path d="M29 66 C27 44 36 25 50 24 C64 25 73 44 71 66" stroke="#5a4a7a" stroke-width="1" fill="none" opacity=".8"/><path d="M40 30 Q50 26 60 30" stroke="#2a2434" stroke-width="1.2" fill="none"/>'
    + E(50, 53, 10, 12.5, '#c8c0b8') + P('M41 60 Q50 66 59 60 L58 63 Q50 67 42 63Z', '#9a928a', 'opacity=".6"') + P('M39.4 47 C41 38 46 36 50 36 C54 36 59 38 60.6 47 C57 42.6 43 42.6 39.4 47Z', '#1a1620') + P('M40 46 Q50 43 60 46 L60 50 Q50 47 40 50Z', '#000', 'opacity=".25"')
    + [1, -1].map((sd) => { const X = (v) => 50 + sd * (v - 50); return E(X(45.6), 50.6, 2, 1.3, '#eef2f6') + C(X(45.6), 50.6, 0.9, '#9aa6b4') + `<path d="M${X(42.4)} 55.6 Q${X(43.6)} 58 ${X(43)} 60.4 M${X(41.4)} 52 Q${X(42.6)} 53.4 ${X(44)} 53.4 M${X(47)} 47.6 L${X(46.4)} 49" stroke="#8a7e74" stroke-width=".5" fill="none" opacity=".75"/>`; }).join('')
    + '<path d="M50 50 L49 55.4 Q50 56.2 51 55.4" stroke="#8a7e74" stroke-width=".6" fill="none"/><path d="M46 60 Q50 61.2 54 60" stroke="#6a4a44" stroke-width=".9" fill="none" stroke-linecap="round"/><path d="M44 63.6 Q50 65.4 56 63.6 M47 44.6 Q50 44 53 44.6" stroke="#8a7e74" stroke-width=".4" fill="none" opacity=".6"/>'
    + '</g>');

  // Force lightning crackling from a hand toward a target.
  const forceLightning = (x1, y1, x2, y2, seed) => [0, 1, 2].map((m) => { const n = 7; let d = `M${x1} ${y1}`; for (let k = 1; k < n; k++) { const t = k / n; const jx = (((k * 31 + m * 17 + seed * 7) % 9) - 4) * 0.7; const jy = (((k * 23 + m * 13 + seed * 5) % 9) - 4) * 0.7; d += ` L${f2(x1 + (x2 - x1) * t + jx)} ${f2(y1 + (y2 - y1) * t + jy)}`; } d += ` L${x2} ${y2}`; return P(d, 'none', 'stroke="#8a9cff" stroke-width="1.4" opacity=".25"') + P(d, 'none', `stroke="#e8eeff" stroke-width="${m ? 0.25 : 0.4}"`); }).join('') + glow(x1, y1, 0.8, '#aabaff', 0.5) + glow(x2, y2, 1.2, '#aabaff', 0.4);
  // Kylo's Upsilon-class shuttle, landed: the narrow black hull on its legs,
  // the towering folded wings with their panel lines, the ramp down and lit.
  const upsilon = (x, base, s) => g(x, base, s, 1,
    E(0, 0, 14, 1.6, '#000', 'opacity=".4"') + L(-5, -4, -6, 0, '#2a2a30', 0.6) + L(5, -4, 6, 0, '#2a2a30', 0.6)
    + P('M-4 -6 L-8 -36 L-5.6 -36.4 L-1.4 -6Z M4 -6 L8 -36 L5.6 -36.4 L1.4 -6Z', '#0c0c10', 'stroke="#2a2e3e" stroke-width=".25"') + [-14, -20, -26, -32].map((yy) => { const t = (-6 - yy) / 30; return L(f2(-4 - t * 4), yy, f2(-1.4 - t * 4.2), yy, '#1e2030', 0.25) + L(f2(4 + t * 4), yy, f2(1.4 + t * 4.2), yy, '#1e2030', 0.25); }).join('') + P('M-8 -36 L-4 -6 M8 -36 L4 -6', 'none', 'stroke="#6a78a8" stroke-width=".25" opacity=".55"')
    + P('M-6 -7 L6 -7 L8 -3.4 L-8 -3.4Z', '#16161c', 'stroke="#2a2e3e" stroke-width=".2"') + P('M-1.6 -9.4 L1.6 -9.4 L2.4 -7 L-2.4 -7Z', '#1e1e26') + R(-1.4, -8.8, 2.8, 0.6, '#5a2a2a', 'opacity=".8"')
    + P('M-2 -3.4 L2 -3.4 L3.4 0 L-3.4 0Z', '#2a2a30') + P('M-1.6 -3.2 L1.6 -3.2 L2.6 -0.2 L-2.6 -0.2Z', '#ffd8a0', 'opacity=".4"'));

  // ---------- The ten scenes ----------
  const EX = {
    // 1 · The Storm (fleet): into Exegol's storm. Lightning splits the
    // churning clouds over a forest of black spires; the Millennium Falcon
    // dives through and three TIE Defenders chase it, every red bolt
    // straight from their wingtip cannons.
    the_storm: () => {
      const fa = [126, 34, 1.2, -14]; const d1 = [62, 38, 1.15, -33]; const d2 = [38, 58, 1, -42]; const d3 = [88, 62, 0.95, -62];
      return fill(SKY) + clouds(10, 1, 0.85) + lightning(30, 0, 48, 1) + lightning(118, 0, 40, 2, 0.8) + lightning(148, 4, 30, 3, 0.6) + clouds(28, 4, 0.6)
        + [[6, 7, 30], [22, 5, 22], [44, 6, 26], [70, 5, 18], [100, 7, 28], [124, 5, 20], [146, 8, 34]].map(([x, w, h]) => spike(x, 92, w, h)).join('') + fog(82, 0.12, 1)
        + falcon(fa[0], fa[1], fa[2], fa[3])
        + [d1, d2, d3].map(([x, y, s, a]) => tieDef(x, y, s, a)).join('')
        + [d1, d2, d3].map(([x, y, s, a]) => gunsAt(x, y, s, a, DGUNS).map((p) => shots(p, fwd(p, DHEAD + a, 44), [0.15, 0.5], 0.12, RED)).join('')).join('');
    },

    // 2 · Citadel Gates: before the Sith Citadel. The vast dark tiers with
    // red window rows, flanking pillars and the great glowing arch; lightning
    // over the spires, fog on the plain; ranks of Sith troopers at the gate
    // and three in front, rifles ready.
    citadel_gates: () => fill(SKY) + clouds(8, 2, 0.85) + lightning(24, 0, 34, 4) + lightning(140, 0, 30, 5, 0.7)
      + spike(12, 66, 10, 40) + spike(150, 66, 12, 46) + citadel(80, 66, 1.2)
      + ground(66) + [[66, 70], [94, 70]].map(([x, y]) => C(x, y, 0.4, RED) + glow(x, y, 0.5, RED, 0.3)).join('') + P('M70 66 L90 66 L104 90 L56 90Z', '#14161e') + [72, 78, 84].map((yy) => L(70 - (yy - 66) * 0.58, yy, 90 + (yy - 66) * 0.58, yy, '#22242e', 0.3)).join('')
      + Array.from({ length: 10 }, (_, k) => sithTrooper(56 + (k % 5) * 12 + (k > 4 ? 6 : 0), 68 + (k > 4 ? 3 : 0), 0.7 + (k > 4 ? 0.1 : 0), 1)).join('') + fog(74, 0.14, 2)
      + sithTrooper(50, 86, 2.7, 1) + sithTrooper(80, 84, 2.6, 1) + sithTrooper(110, 86, 2.7, -1),

    // 3 · Knights in the Fog: the Knights of Ren emerge from the fog among
    // the black spires, more of them shadows behind; Vicrul with his scythe
    // and Ushar with his war club, a Sith trooper between them.
    knights_in_the_fog: () => fill([[0, '#080a10'], [0.5, '#1a1e2a'], [1, '#2a3040']]) + clouds(8, 3, 0.7) + lightning(80, 0, 26, 6, 0.6)
      + [[10, 6, 40], [34, 5, 30], [128, 6, 36], [152, 7, 44]].map(([x, w, h]) => `<g opacity=".7">${spike(x, 74, w, h, '#14182a')}</g>`).join('') + fog(56, 0.2, 3) + fog(64, 0.22, 4)
      + `<g opacity=".35">${knight(34, 70, 1.6, 1, 1)}${knight(128, 70, 1.6, -1, 3)}${knight(98, 66, 1.3, -1, 5)}</g>` + fog(70, 0.25, 5)
      + ground(72) + fog(80, 0.18, 6)
      + sithTrooper(80, 82, 2.5, 1) + knight(50, 86, 3, 1, 0) + knight(110, 86, 3, -1, 2) + fog(88, 0.15, 7),

    // 4 · The Supreme Leader: Kylo Ren's landing on Exegol. His Upsilon
    // shuttle towers behind on its landing pad, wings folded up and ramp
    // lit; lightning cracks over the spires; Kylo strides out with his
    // crossguard saber, Kuruk and Ap'lek at his side.
    the_supreme_leader: () => fill(SKY) + clouds(10, 5, 0.85) + lightning(20, 0, 40, 7) + lightning(146, 0, 34, 8, 0.75)
      + spike(10, 70, 9, 36) + spike(150, 70, 10, 40) + spike(36, 70, 5, 20) + spike(126, 70, 6, 24)
      + ground(70) + E(80, 74, 50, 8, '#141620', 'stroke="#4a5478" stroke-width=".4"') + Array.from({ length: 12 }, (_, k) => { const t = (k / 12) * Math.PI * 2; return C(f2(80 + Math.cos(t) * 48), f2(74 + Math.sin(t) * 7.6), 0.4, '#ff5a3a'); }).join('')
      + upsilon(80, 70, 1.55) + fog(80, 0.12, 8)
      + knight(46, 86, 2.9, 1, 3) + knight(114, 86, 2.9, -1, 5) + kylo(80, 86, 3.2, 1),

    // 5 · Sith Fleet (fleet): the Final Order rising. Xyston Star Destroyers
    // lift out of the storm in rows, their red lights glowing in the
    // clouds; X-wings dive into them and four TIE Defenders tear after them,
    // red bolts straight from their cannons.
    sith_fleet: () => {
      const x1 = [126, 26, 1, -10]; const x2 = [140, 54, 0.85, -4]; const ds = [[56, 28, 0.95, -32], [70, 52, 1, -38], [92, 70, 0.9, -48], [36, 44, 0.85, -36]];
      return fill(SKY) + clouds(16, 6, 0.7) + lightning(10, 0, 30, 9, 0.7)
        + [[30, 60, 0.32], [70, 56, 0.36], [112, 58, 0.34], [150, 62, 0.3], [10, 66, 0.28], [52, 70, 0.4], [92, 72, 0.44], [132, 74, 0.42]].map(([x, y, s]) => `<g opacity=".7">${xyston(x, y, s, 1)}</g>`).join('') + clouds(72, 7, 0.75)
        + xyston(98, 40, 1.35, 1) + clouds(86, 8, 0.6)
        + xwing(x1[0], x1[1], x1[2], x1[3]) + xwing(x2[0], x2[1], x2[2], x2[3])
        + ds.map(([x, y, s, a]) => tieDef(x, y, s, a)).join('')
        + ds.map(([x, y, s, a]) => gunsAt(x, y, s, a, DGUNS).map((p) => shots(p, fwd(p, DHEAD + a, 40), [0.18, 0.52], 0.12, RED)).join('')).join('')
        + [x1, x2].map(([x, y, s, a]) => gunsAt(x, y, s, a, XWGUNS).map((p) => shots(p, fwd(p, a, 24), [0.2, 0.6], 0.14, RED)).join('')).join('');
    },

    // 6 · The Final Order: a hangar deep in a Xyston. Racks of TIEs hang
    // from the ceiling in the red light, the bay opens on the storm and the
    // rising fleet, Xystons climbing at every angle and depth through the
    // clouds with TIEs weaving between them; Sith troopers stand in ranks
    // on the deck, three at the front and Trudgen with his vibro-cleaver.
    the_final_order: () => fill([[0, '#0a0608'], [1, '#1a0c0e']])
      + P('M0 0 L44 22 L116 22 L160 0Z', '#120a0c') + P('M0 0 L44 22 L44 60 L0 90Z', '#180c0e') + P('M160 0 L116 22 L116 60 L160 90Z', '#160a0c') + P('M0 90 L44 60 L116 60 L160 90Z', '#100a0c')
      + R(44, 22, 72, 38, '#14182a') + '<clipPath id="exBay"><rect x="44" y="22" width="72" height="38"/></clipPath><g clip-path="url(#exBay)">' + clouds(34, 9, 0.6) + lightning(70, 22, 18, 10, 0.6) + `<g transform="rotate(-6 70 30)">${xyston(70, 30, 0.22, 1)}</g>` + `<g opacity=".85" transform="rotate(8 104 34)">${xyston(104, 34, 0.32, -1)}</g>` + clouds(46, 12, 0.65) + `<g transform="rotate(-4 64 46)">${xyston(64, 46, 0.5, 1)}</g>` + `<g transform="rotate(10 108 54)">${xyston(108, 54, 0.62, -1)}</g>` + tieDef(86, 36, 0.32, -20) + tieDef(92, 40, 0.26, -30) + tieDef(54, 30, 0.28, 10) + clouds(60, 10, 0.75) + '</g>' + R(44, 22, 72, 38, 'none', 'stroke="#2a1a1e" stroke-width="1.6"') + R(44, 22, 72, 2, '#ff3a2a', 'opacity=".5"')
      + [0.2, 0.45, 0.7].map((k) => L(f2(k * 44), f2(k * 22), f2(160 - k * 44), f2(k * 22), '#2a1a1e', 0.6)).join('') + [[18, 12], [36, 18], [124, 18], [142, 12]].map(([x, y]) => tieDef(x, y + 6, 0.55, 0) + L(x, 0, x, y + 2, '#2a1a1e', 0.4)).join('')
      + [0.15, 0.4, 0.65, 0.9].map((k) => L(f2(k * 44), f2(90 - k * 30), f2(160 - k * 44), f2(90 - k * 30), '#2a1a1e', 0.35)).join('') + [[30, 70], [130, 70], [60, 62], [100, 62]].map(([x, y]) => C(x, y, 0.5, RED) + glow(x, y, 0.6, RED, 0.3)).join('')
      + Array.from({ length: 12 }, (_, k) => sithTrooper(54 + (k % 6) * 10.4, 64 + Math.floor(k / 6) * 3.6, 0.75 + Math.floor(k / 6) * 0.1, 1)).join('')
      + sithTrooper(30, 86, 2.6, 1) + sithTrooper(62, 84, 2.5, 1) + sithTrooper(94, 86, 2.5, 1) + knight(130, 88, 2.8, -1, 4),

    // 7 · Rey's Trial: in the ruins beneath the throne room. Broken stone
    // stairs, carved wall reliefs with violet runes, broken pillars and
    // colossal Sith statues gripping their swords, lightning flaring through a rent in
    // the cavern roof, fog on the floor; Rey with the Skywalker saber and
    // Kylo with his crackling red blade face each other.
    reys_trial: () => fill([[0, '#04050a'], [0.6, '#10141e'], [1, '#1a1e2a']])
      + P('M0 0 L160 0 L160 16 C120 24 100 10 80 12 C60 10 40 24 0 16Z', '#020306') + P('M64 0 L96 0 L90 12 L70 12Z', '#2a3048', 'opacity=".7"') + lightning(78, 0, 14, 11) + P('M70 12 L90 12 L110 70 L50 70Z', '#8a9cff', 'opacity=".06"')
      + [[44, 34], [116, 34]].map(([x, y]) => R(x - 7, y - 10, 14, 24, '#10121a', 'stroke="#2a2e3e" stroke-width=".3"') + P(`M${x - 5} ${y + 10} L${x - 5} ${y - 4} Q${x} ${y - 9} ${x + 5} ${y - 4} L${x + 5} ${y + 10}`, 'none', 'stroke="#2a2e3e" stroke-width=".4"') + [-3, 0, 3].map((dy) => P(`M${x - 3} ${y + dy} l1 -.7 l1 .7 l1 -.7 l1 .7 l1 -.7 l1 .7`, 'none', 'stroke="#6a4a9a" stroke-width=".3" opacity=".6"')).join('') + glow(x, y - 2, 1, '#8a5aff', 0.15)).join('')
      + [[60, 70, 1.4, 30], [100, 70, 1.4, 22]].map(([x, b, w, h]) => R(x - w, b - h, w * 2, h, '#14161e', 'stroke="#2a2e3e" stroke-width=".25"') + P(`M${x - w} ${b - h} L${x - w * 0.4} ${b - h - 2} L${x + w * 0.6} ${b - h - 0.6} L${x + w} ${b - h}`, '#14161e')).join('')
      + statue(24, 70, 52, 1) + statue(136, 70, 52, -1) + P('M100 70 L108 58 L124 60 L130 70Z', '#14141c', 'stroke="#2a2a36" stroke-width=".3"') + P('M40 70 L44 64 L56 66 L60 70Z', '#14141c')
      + Array.from({ length: 6 }, (_, k) => P(`M${50 + k * 4} ${70 - k * 2.4} L${110 - k * 4} ${70 - k * 2.4} L${110 - k * 4} ${71.4 - k * 2.4} L${50 + k * 4} ${71.4 - k * 2.4}Z`, k % 2 ? '#14161e' : '#181a24', 'stroke="#2a2e3e" stroke-width=".15"')).join('') + P('M78 58 L84 55 L86 58Z', '#0c0c10')
      + ground(70) + fog(74, 0.16, 9) + fog(84, 0.14, 10)
      + rey(54, 86, 3.1, 1) + kylo(106, 86, 3.1, -1) + glow(80, 40, 1.4, '#c8b8ff', 0.3),

    // 8 · Throne Room Guard: the vast amphitheatre of the Sith Eternal.
    // Tier on tier of hooded cultists rise into the dark, colossal statues
    // hold up the walls, the throne stands on its dais beneath the hanging
    // machine; Kylo stands with Cardo and Vicrul on guard.
    throne_room_guard: () => fill([[0, '#030308'], [0.6, '#0c0e18'], [1, '#14182a']])
      + crowd(14, 6, 0, 160) + statue(16, 72, 62, 1) + statue(144, 72, 62, -1)
      + P('M66 60 L94 60 L100 66 L60 66Z', '#14141c', 'stroke="#2a2e3e" stroke-width=".3"') + P('M74 60 L74 46 L86 46 L86 60Z', '#0e0e14', 'stroke="#2a2e3e" stroke-width=".3"') + P('M72 46 L80 40 L88 46Z', '#14141c') + L(80, 0, 80, 34, '#1a1a22', 1.2) + P('M74 34 L86 34 L84 40 L76 40Z', '#1e1e28', 'stroke="#2a2e3e" stroke-width=".2"') + glow(80, 37, 1.4, '#8a5aff', 0.3)
      + R(0, 66, 160, 24, '#0c0e16') + Array.from({ length: 9 }, (_, k) => L(80, 66, -40 + k * 30, 90, '#161a26', 0.3)).join('') + E(80, 76, 40, 6, 'none', 'stroke="#2a2e3e" stroke-width=".4"')
      + knight(44, 86, 2.9, 1, 1) + knight(116, 86, 2.9, -1, 0) + kylo(80, 86, 3.2, 1),

    // 9 · The Xyston Fleet (fleet): above the storm. Xyston Star Destroyers
    // stand in ranks over the cloud sea, one firing its axial superlaser
    // down through the clouds; A-wings dive in and TIE Defenders chase them,
    // every bolt straight from their guns.
    the_xyston_fleet: () => {
      const a1 = [118, 60, 1, -18]; const a2 = [138, 40, 0.9, -12]; const ds = [[60, 66, 1, -40], [84, 46, 0.9, -34], [42, 40, 0.85, -26], [96, 76, 0.85, -52]];
      return fill([[0, '#020306'], [0.5, '#0c1020'], [1, '#2a3048']]) + Array.from({ length: 40 }, (_, k) => C((k * 41) % 160, (k * 23) % 40, 0.25, '#ffffff', `opacity="${(0.3 + (k % 3) * 0.15).toFixed(2)}"`)).join('')
        + [[24, 22, 0.42], [64, 14, 0.36], [104, 18, 0.4], [144, 12, 0.32]].map(([x, y, s]) => `<g opacity=".8">${xyston(x, y, s, 1)}</g>`).join('')
        + P(`M${f2(46 + XYGUN[0] * 1.3)} ${f2(34 + XYGUN[1] * 1.3)} L${f2(46 + XYGUN[0] * 1.3 - 22)} 80`, 'none', 'stroke="#ff2a1a" stroke-width="2.4" opacity=".35"') + P(`M${f2(46 + XYGUN[0] * 1.3)} ${f2(34 + XYGUN[1] * 1.3)} L${f2(46 + XYGUN[0] * 1.3 - 22)} 80`, 'none', 'stroke="#ffd8d0" stroke-width=".7"') + glow(f2(46 + XYGUN[0] * 1.3 - 22), 80, 3, '#ff3a2a', 0.5)
        + xyston(46, 34, 1.3, 1, true) + xyston(120, 28, 0.9, 1)
        + clouds(84, 10, 0.9) + clouds(78, 11, 0.6)
        + awing(a1[0], a1[1], a1[2], a1[3]) + awing(a2[0], a2[1], a2[2], a2[3])
        + ds.map(([x, y, s, a]) => tieDef(x, y, s, a)).join('')
        + ds.map(([x, y, s, a]) => gunsAt(x, y, s, a, DGUNS).map((p) => shots(p, fwd(p, DHEAD + a, 40), [0.18, 0.52], 0.12, RED)).join('')).join('');
    },

    // 10 · The Emperor's Throne: Palpatine rises before his throne. The
    // machine hangs above it with its arms gripping his shoulders, the Sith
    // Eternal fill the lit tiers, carved pillars and colossal statues loom
    // on either side, violet braziers burn at the dais with red-robed
    // Sovereign Protectors on guard, lightning flashes through the roof and
    // fog lies on the floor; the
    // Emperor unleashes Force lightning from both hands, a Knight of Ren
    // and two Sith troopers beside him.
    the_emperors_throne: () => fill([[0, '#030308'], [0.6, '#0c0e1a'], [1, '#161a2c']])
      + P('M50 0 L110 0 L102 6 L58 6Z', '#1a2034', 'opacity=".8"') + lightning(70, 0, 8, 12, 0.7) + lightning(94, 0, 6, 13, 0.5)
      + crowd(8, 8, 0, 160) + [12, 20, 28, 36].map((yy) => L(0, yy, 160, yy, '#2a2e40', 0.5) + L(0, yy - 0.5, 160, yy - 0.5, '#8a5aff', 0.15, 'opacity=".35"')).join('')
      + [[38, 66], [122, 66]].map(([x, b]) => R(x - 3, 6, 6, b - 6, '#10121a', 'stroke="#2a2e3e" stroke-width=".3"') + R(x - 4, 6, 8, 2.4, '#1a1c28') + R(x - 4, b - 3, 8, 3, '#1a1c28') + [16, 26, 36, 46, 56].map((yy) => L(x - 3, yy, x + 3, yy, '#22263a', 0.3)).join('') + [20, 40].map((yy) => P(`M${x - 1.6} ${yy} l1.6 -1.2 l1.6 1.2 l-1.6 1.2Z`, '#6a4a9a', 'opacity=".6"')).join('')).join('')
      + [[30, 0, 46, 24], [130, 0, 114, 24]].map(([x1, y1, x2, y2]) => P(`M${x1} ${y1} Q${f2((x1 + x2) / 2)} ${f2(y2 * 0.7)} ${x2} ${y2}`, 'none', 'stroke="#1e2030" stroke-width=".6"')).join('')
      + statue(14, 72, 64, 1) + statue(146, 72, 64, -1)
      + L(80, 0, 80, 24, '#1a1a22', 1.4) + P('M72 24 L88 24 L86 30 L74 30Z', '#1e1e28', 'stroke="#2a2e3e" stroke-width=".25"') + P('M74 30 L70 40 L72 41 L76 32 M86 30 L90 40 L88 41 L84 32', 'none', 'stroke="#2a2e3e" stroke-width="1"') + glow(80, 27, 1.6, '#8a5aff', 0.35)
      + P('M68 64 L68 40 Q80 32 92 40 L92 64Z', '#0e0e14', 'stroke="#2a2e3e" stroke-width=".4"') + P('M72 64 L72 42 Q80 36 88 42 L88 64Z', '#16161e') + P('M60 64 L100 64 L106 70 L54 70Z', '#14141c', 'stroke="#2a2e3e" stroke-width=".3"')
      + [[56, 64], [104, 64]].map(([x, y]) => R(x - 1.6, y - 6, 3.2, 6, '#1a1c28', 'stroke="#2a2e3e" stroke-width=".2"') + E(x, y - 6, 2.2, 0.6, '#2a2e40') + P(`M${x - 1.4} ${y - 6} Q${x - 0.6} ${y - 10} ${x} ${y - 8} Q${x + 0.6} ${y - 11} ${x + 1.4} ${y - 6}Z`, '#a87aff', 'opacity=".85"') + glow(x, y - 8, 1.4, '#8a5aff', 0.35)).join('')
      + [[62, 64, 1.5], [98, 64, 1.5], [50, 68, 1.6], [110, 68, 1.6]].map(([x, y, s2]) => g(x, y, s2, 1, P('M-2 -9 C-2.6 -6 -3 -3 -3.2 0 L3.2 0 C3 -3 2.6 -6 2 -9 C1.4 -10.4 1.4 -12.4 0 -12.8 C-1.4 -12.4 -1.4 -10.4 -2 -9Z', '#7a1a1a', 'stroke="#2a0808" stroke-width=".2"') + E(0, -11, 0.9, 1, '#4a0e0e') + L(2.4, -12, 2.4, 0, '#5a5a62', 0.3) + P('M1.8 -12.6 L2.4 -14.4 L3 -12.6Z', '#a8a8b2'))).join('')
      + R(0, 70, 160, 20, '#0c0e16') + Array.from({ length: 9 }, (_, k) => L(80, 70, -40 + k * 30, 90, '#161a26', 0.3)).join('') + [74, 80, 86].map((yy) => L(0, yy, 160, yy, '#141824', 0.3)).join('') + fog(78, 0.12, 14) + fog(86, 0.1, 15)
      + P('M80 30 C78 36 74 40 72 48 M80 30 C82 36 86 40 88 48', 'none', 'stroke="#2a2830" stroke-width="1.4" stroke-linecap="round"') + P('M80 30 C78 36 74 40 72 48 M80 30 C82 36 86 40 88 48', 'none', 'stroke="#5a5664" stroke-width=".35"') + C(72, 48, 0.8, '#3a3640') + C(88, 48, 0.8, '#3a3640')
      + palpatine(80, 80, 3.2, 1) + forceLightning(f2(80 - 6.8 * 3.2), f2(80 - 11.6 * 3.2), 10, 54, 1) + forceLightning(f2(80 + 6.8 * 3.2), f2(80 - 11.6 * 3.2), 150, 56, 2)
      + knight(40, 86, 2.8, 1, 2) + sithTrooper(118, 86, 2.6, -1) + sithTrooper(138, 88, 2.6, -1),
  };
  Object.assign(SA.kit = SA.kit || {}, { palpatine, forceLightning });
  Object.assign(SA.scenes, EX);
  SA.worlds.exegol = ['the_storm', 'citadel_gates', 'knights_in_the_fog', 'the_supreme_leader', 'sith_fleet', 'the_final_order', 'reys_trial', 'throne_room_guard', 'the_xyston_fleet', 'the_emperors_throne'];
})(typeof window !== 'undefined' ? window : globalThis);
