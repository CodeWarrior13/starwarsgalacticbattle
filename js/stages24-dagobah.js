// Update 2.4: the ten Dagobah stage scenes, for approval. Same 160x90 format
// as Tatooine and Hoth: the X-wing coming down into the swamp, the
// Nightsisters in the mist, the great gnarltree, Yoda's hut and the X-wing
// rising from the bog, Ventress's ambush, the blockade in orbit, Savage and
// Ventress among the Dathomiri ruins, the cave of evil, Mother Talzin's
// ritual, and the final trial under the storm. Drawn in full detail.
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
  const starfield = (n, seed) => Array.from({ length: n }, (_, k) => C(((k * 41 + seed * 11) % 160), ((k * 67 + seed * 5) % 90), (0.2 + (k % 3) * 0.15).toFixed(2), '#ffffff', `opacity="${(0.4 + (k % 4) * 0.15).toFixed(2)}"`)).join('');
  // Fireflies and floating spores, placed the same way every time.
  const motes = (n, seed, c = '#d8ff8a', a = 0.8, y0 = 20, y1 = 80) => Array.from({ length: n }, (_, k) => { const x = (k * 37 + seed * 13) % 160; const y = y0 + ((k * 53 + seed * 7) % (y1 - y0)); return glow(x, y, 0.3, c, a * 0.4) + C(x, y, 0.3, c, `opacity="${a}"`); }).join('');
  // Rolling mist: wide soft bands.
  const fog = (y, a = 0.3, c = '#c8d8c4', seed = 0) => Array.from({ length: 6 }, (_, k) => E(((k * 31 + seed * 17) % 180) - 10, y + ((k * 7 + seed) % 5) - 2, 22 + (k % 3) * 8, 3 + (k % 2) * 1.4, c, `opacity="${(a * (0.6 + (k % 3) * 0.2)).toFixed(2)}"`)).join('');
  // Murky bog water from y down: a dark gradient, ripples, lily pads, reeds.
  const bog = (y, c1 = '#2a3a2a', c2 = '#0e160e', seed = 0) => {
    const [w, d] = LG([[0, c1], [1, c2]]);
    return d + R(0, y, 160, 90 - y, w)
      + Array.from({ length: 10 }, (_, k) => { const x = (k * 43 + seed * 19) % 160; const yy = y + 3 + ((k * 13 + seed * 5) % (88 - y)); const l = 6 + (k % 4) * 3; return P(`M${x - l} ${yy} Q${x} ${yy - 0.6} ${x + l} ${yy}`, 'none', 'stroke="#8aa88a" stroke-width=".3" opacity=".35"'); }).join('');
  };
  const pads = (pts) => pts.map(([x, y, r]) => E(x, y, r, r * 0.36, '#3a5a2a', 'stroke="#1e3018" stroke-width=".2"') + P(`M${x} ${y} L${x + r * 0.9} ${y - r * 0.12}`, 'none', 'stroke="#1e3018" stroke-width=".25"') + E(x - r * 0.3, y - r * 0.08, r * 0.3, r * 0.08, '#6a8a4a', 'opacity=".6"')).join('');
  const reeds = (x, y, n, h, c = '#3a4a26') => Array.from({ length: n }, (_, k) => { const rx = x + k * 1.1 - n * 0.5; const rh = h * (0.6 + ((k * 7) % 5) * 0.1); const bend = ((k % 3) - 1) * 1.4; return P(`M${rx} ${y} Q${rx + bend * 0.4} ${y - rh * 0.6} ${rx + bend} ${y - rh}`, 'none', `stroke="${c}" stroke-width=".45"`) + (k % 3 === 0 ? E(rx + bend * 0.9, y - rh + 1, 0.4, 1.2, '#5a3a22') : ''); }).join('');
  // A mirrored, faded copy of a group in the water.
  const refl = (y, inner, a = 0.22) => `<g opacity="${a}" transform="matrix(1 0 0 -1 0 ${2 * y})">${inner}</g>`;
  // A gnarled swamp tree: flaring roots into the water, a twisting trunk with
  // bark lines and a shadow side, crooked branches and hanging moss.
  const tree = (x, y, h, lean = 0, c = '#3a3a2c', d = '#1a1c14', moss = '#5a6e3a', seed = 0) => {
    const w = h * 0.12; const tx = x + lean; const ty = y - h;
    let o = '';
    [-1, -0.55, 0.5, 1].forEach((k, i) => { const rx = x + k * w * 3; const ry = y + 1 + (i % 2); o += P(`M${x + k * w * 0.4} ${y - w * 1.6} C${x + k * w * 1.6} ${y - w} ${rx - k * w * 0.6} ${ry - 3} ${rx} ${ry} L${rx - k * w * 0.7} ${ry} C${x + k * w * 1.1} ${y - w * 0.2} ${x + k * w * 0.4} ${y - w * 0.4} ${x} ${y - w * 0.3}Z`, c); });
    o += P(`M${x - w} ${y} C${x - w * 0.6} ${y - h * 0.4} ${tx - w * 1.1} ${ty + h * 0.3} ${tx - w * 0.45} ${ty} L${tx + w * 0.45} ${ty} C${tx + w * 0.9} ${ty + h * 0.35} ${x + w * 0.5} ${y - h * 0.4} ${x + w} ${y}Z`, c);
    o += P(`M${x + w * 0.2} ${y} C${x + w * 0.1} ${y - h * 0.4} ${tx} ${ty + h * 0.3} ${tx + w * 0.1} ${ty} L${tx + w * 0.45} ${ty} C${tx + w * 0.9} ${ty + h * 0.35} ${x + w * 0.5} ${y - h * 0.4} ${x + w} ${y}Z`, d, 'opacity=".6"');
    for (let k = 0; k < 4; k++) { const ox = (k - 1.5) * w * 0.4; o += P(`M${x + ox} ${y - 1} C${x + ox + w * 0.3} ${y - h * 0.3} ${tx + ox * 0.5 - w * 0.2} ${ty + h * 0.4} ${tx + ox * 0.4} ${ty + 1}`, 'none', `stroke="${d}" stroke-width="${(w * 0.08).toFixed(2)}" opacity=".7"`); }
    o += E(x - w * 0.1, y - h * 0.42, w * 0.3, w * 0.5, d, 'opacity=".8"');
    [[0.5, -1], [0.66, 1], [0.82, -1], [0.95, 1], [0.74, -1]].forEach(([fr, side], i) => {
      const bx = x + lean * fr; const by = y - h * fr; const len = h * (0.3 + ((i + seed) % 3) * 0.06); const ex = bx + side * len; const ey = by - h * (0.06 + (i % 2) * 0.08); const mx = bx + side * len * 0.5; const my = by - h * (0.16 + (i % 3) * 0.04);
      o += P(`M${bx} ${by - w * 0.35} Q${mx} ${my - w * 0.3} ${ex} ${ey} Q${mx} ${my + w * 0.3} ${bx} ${by + w * 0.35}Z`, c);
      for (let m = 0; m < 5; m++) { const t = 0.3 + m * 0.15; const sx = bx + (ex - bx) * t; const sy = by + (ey - by) * t - h * 0.04; const ml = 3 + ((m * 7 + i * 3 + seed) % 5) * 1.6; o += P(`M${sx.toFixed(1)} ${sy.toFixed(1)} q${(0.6 - (m % 2) * 1.2).toFixed(1)} ${(ml * 0.5).toFixed(1)} ${(0.2).toFixed(1)} ${ml.toFixed(1)}`, 'none', `stroke="${moss}" stroke-width=".5" opacity=".85"`); }
    });
    return o;
  };
  // A far tree line: layered misty silhouettes.
  const treeline = (y, c, a, seed = 0) => Array.from({ length: 9 }, (_, k) => { const x = ((k * 23 + seed * 11) % 176) - 8; const h = 22 + ((k * 13 + seed * 3) % 5) * 5; return `<g opacity="${a}">${tree(x, y, h, ((k % 3) - 1) * 3, c, c, c, k + seed)}</g>`; }).join('');

  // ---------- People ----------
  // A Nightsister acolyte: the long red hooded robe with dark folds and sash,
  // pale white face with the chin markings, and an energy bow drawn with a
  // green magick arrow.
  const sister = (x, y, s, f = 1, bow = true) => g(x, y, s, f,
    E(0, 0.2, 4, 0.6, '#000', 'opacity=".3"')
    + P('M-2.6 -9 C-3.2 -6 -3.8 -3 -4.4 0 L-3.2 -0.5 L-2 0.2 L-0.6 -0.4 L0.8 0.2 L2.2 -0.4 L3.4 0.2 L4.4 0 C3.8 -3 3.2 -6 2.6 -9Z', '#8a1a24', 'stroke="#3a0a10" stroke-width=".25"')
    + P('M-4.4 0 L-3.2 -0.5 L-2 0.2 L-0.6 -0.4 L0.8 0.2 L2.2 -0.4 L3.4 0.2 L4.4 0', 'none', 'stroke="#c8a040" stroke-width=".22"')
    + P('M-0.9 -8.6 L-1.4 0 L1.4 0 L0.9 -8.6Z', '#4a0a12') + P('M-0.2 -6 L-0.3 -0.2 M0.4 -6 L0.5 -0.2', 'none', 'stroke="#c8a040" stroke-width=".12" opacity=".7"') + P('M-2.2 -6 L-3.2 0 M2.2 -6 L3.2 0 M-1.6 -4 L-2.2 0 M1.4 -3.6 L1.9 0', 'none', 'stroke="#5a0e16" stroke-width=".3"')
    + P('M-2.8 -9.4 C-4 -7.4 -4.4 -5.6 -4.4 -4 L-3 -4.6 L-2.2 -8.4Z M2.8 -9.4 C4 -7.4 4.4 -5.6 4.4 -4 L3 -4.6 L2.2 -8.4Z', '#6a1018', 'stroke="#3a0a10" stroke-width=".2"')
    + R(-2.8, -6.4, 5.6, 0.7, '#2a0a0e') + P('M0.6 -5.7 L1.2 -3.4 L1.8 -5.7Z', '#2a0a0e') + C(-1.6, -6.05, 0.3, '#c8a040')
    + P('M-2.6 -9 C-3.6 -12 -2.6 -14.8 0 -15 C2.6 -14.8 3.6 -12 2.6 -9 L1.6 -9.4 C1.8 -11.4 1.2 -12.8 0 -12.8 C-1.2 -12.8 -1.8 -11.4 -1.6 -9.4Z', '#7a141e', 'stroke="#3a0a10" stroke-width=".25"') + P('M0 -15 L0.6 -16.4 L1 -14.8Z', '#7a141e') + P('M1.6 -9.4 C1.8 -11.4 1.2 -12.8 0 -12.8 C-1.2 -12.8 -1.8 -11.4 -1.6 -9.4', 'none', 'stroke="#c8a040" stroke-width=".18"')
    + P('M-1.7 -9.6 C-1.8 -11.4 -1.2 -12.6 0 -12.6 C1.2 -12.6 1.8 -11.4 1.7 -9.6Z', '#2a0a10', 'opacity=".55"')
    + E(0, -10.8, 1.2, 1.5, '#ece6ee') + P('M-1.2 -11.2 C-0.8 -11.8 0.8 -11.8 1.2 -11.2', 'none', 'stroke="#3a0a14" stroke-width=".3" opacity=".5"') + P('M-0.75 -11.2 L-0.2 -11 M0.75 -11.2 L0.2 -11', 'none', 'stroke="#1a0a10" stroke-width=".32"') + P('M-0.4 -9.8 Q0 -9.6 0.4 -9.8', 'none', 'stroke="#5a0a14" stroke-width=".3"') + P('M-0.5 -9.5 L-0.4 -9 M0 -9.4 L0 -8.9 M0.5 -9.5 L0.4 -9 M0 -12 L0 -11.6', 'none', 'stroke="#3a2a3a" stroke-width=".16"')
    + (bow ? P('M3.8 -13.6 Q6.6 -9.2 3.8 -4.8', 'none', 'stroke="#4a2a22" stroke-width=".6"') + P('M3.8 -13.6 Q6.6 -9.2 3.8 -4.8', 'none', 'stroke="#c8a040" stroke-width=".15"') + L(3.8, -13.6, 2.2, -9.2, '#9aff8a', 0.18) + L(2.2, -9.2, 3.8, -4.8, '#9aff8a', 0.18)
      + L(2.2, -9.2, 8.4, -9.2, '#7aff6a', 0.7) + L(2.2, -9.2, 8.4, -9.2, '#e8ffe0', 0.25) + glow(8.4, -9.2, 0.6, '#7aff6a', 0.6)
      + P('M1.4 -9.6 L5.2 -9.8 L5.2 -8.8 L1.6 -8.2Z', '#7a141e', 'stroke="#3a0a10" stroke-width=".15"') + C(5.3, -9.2, 0.45, '#ece6ee') + P('M-1.6 -9.4 L2.2 -9.8 L2.2 -8.8 L-1.4 -8Z', '#6a1018', 'stroke="#3a0a10" stroke-width=".15"') + C(2.2, -9.2, 0.42, '#ece6ee')
      : P('M1.6 -9 L4 -11.6 L4.6 -11 L2.2 -8Z', '#7a141e', 'stroke="#3a0a10" stroke-width=".15"') + C(4.3, -11.5, 0.42, '#ece6ee') + glow(4.4, -12.4, 0.8, '#7aff6a', 0.55) + C(4.4, -12.4, 0.5, '#c8ffb8')
        + P('M-1.6 -9 L-4 -11.6 L-4.6 -11 L-2.2 -8Z', '#6a1018', 'stroke="#3a0a10" stroke-width=".15"') + C(-4.3, -11.5, 0.42, '#ece6ee') + glow(-4.4, -12.4, 0.6, '#7aff6a', 0.45)));
  // Savage Opress: the huge Zabrak, yellow-orange skin with black tattoos, the
  // crown of horns, armour and pauldrons, bare tattooed arms, and his red
  // double-bladed lightsaber pike.
  const savage = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 4.4, 0.7, '#000', 'opacity=".3"')
    + R(-2.4, -5.4, 1.9, 5, '#2a2a30', 'rx=".4"') + R(0.5, -5.4, 1.9, 5, '#24242a', 'rx=".4"') + R(-2.6, -0.8, 2.3, 0.9, '#1a1a1e') + R(0.3, -0.8, 2.3, 0.9, '#1a1a1e') + L(-1.45, -3.6, -1.45, -1.4, '#3a3a42', 0.25) + L(1.45, -3.6, 1.45, -1.4, '#3a3a42', 0.25)
    + P('M-3 -6.4 L-3.5 -2 L3.5 -2 L3 -6.4Z', '#3a2a22', 'stroke="#1a1410" stroke-width=".2"') + L(0, -6.2, 0, -2.2, '#1a1410', 0.3) + P('M-2.2 -6 L-2.6 -2.2 M2.2 -6 L2.6 -2.2', 'none', 'stroke="#2a201a" stroke-width=".2"')
    + P('M-3.6 -12.6 L-2.8 -6.2 L2.8 -6.2 L3.6 -12.6 C2.2 -13.4 -2.2 -13.4 -3.6 -12.6Z', '#4a3a32', 'stroke="#1a1410" stroke-width=".25"') + P('M-2 -12.4 L-1.7 -7 M2 -12.4 L1.7 -7 M-2.9 -10 L2.9 -10 M-2.7 -8.6 L2.7 -8.6', 'none', 'stroke="#2a201a" stroke-width=".25"') + R(-3, -7, 6, 0.9, '#2a201a') + R(-0.6, -7.1, 1.2, 1.1, '#8a7a5a') + P('M-1.2 -12.6 L0 -11.4 L1.2 -12.6', 'none', 'stroke="#c8902e" stroke-width=".3"')
    + E(-3.7, -12.3, 1.4, 1, '#5a5a62', 'stroke="#2a2a30" stroke-width=".2"') + E(3.7, -12.3, 1.4, 1, '#4e4e56', 'stroke="#2a2a30" stroke-width=".2"') + P('M-4.6 -12.4 L-2.8 -12.4 M3 -12.4 L4.6 -12.4', 'none', 'stroke="#7a7a84" stroke-width=".2"')
    // his left arm hanging: muscled upper arm with tattoo bands, the elbow, a leather bracer, the hand
    + P('M-4.2 -12 C-5.2 -11.2 -5.5 -10 -5.3 -8.8 L-4.2 -8.7 C-4.2 -9.8 -3.9 -10.8 -3.3 -11.4Z', '#d8a03a', 'stroke="#8a6020" stroke-width=".15"') + P('M-5.1 -11 L-3.8 -10.6 M-5.4 -9.8 L-4.1 -9.5', 'none', 'stroke="#1a1010" stroke-width=".3"') + P('M-4.8 -10.6 Q-4.6 -10 -4.7 -9.4', 'none', 'stroke="#f0c060" stroke-width=".2"')
    + P('M-5.3 -8.8 L-5.5 -6.2 L-4.3 -6.1 L-4.2 -8.7Z', '#3a2a22', 'stroke="#1a1410" stroke-width=".15"') + P('M-5.4 -8 L-4.2 -7.9 M-5.45 -7.1 L-4.25 -7', 'none', 'stroke="#5a4a3a" stroke-width=".18"') + P('M-5.5 -6.2 C-5.8 -5.4 -5.2 -4.8 -4.6 -5 C-4.1 -5.2 -4.1 -5.8 -4.3 -6.1Z', '#d8a03a', 'stroke="#8a6020" stroke-width=".12"')
    // his right arm reaching to the pike: upper arm, bracer, the hand on the hilt
    + P('M3.4 -12.4 C4.6 -12 5.4 -11.2 5.6 -10.2 L4.6 -9.8 C4.4 -10.6 3.8 -11.2 3 -11.4Z', '#d8a03a', 'stroke="#8a6020" stroke-width=".15"') + P('M4.2 -12 L4 -11 M5 -11.4 L4.6 -10.4', 'none', 'stroke="#1a1010" stroke-width=".3"')
    + P('M5.6 -10.2 L6.6 -9 L5.8 -8.4 L4.6 -9.8Z', '#3a2a22', 'stroke="#1a1410" stroke-width=".15"')
    + P('M1.4 -13.2 L-1.4 -13.2 L-1.1 -12.4 L1.1 -12.4Z', '#c8902e')
    + E(0, -14.8, 1.6, 1.95, '#e0aa3e', 'stroke="#8a6020" stroke-width=".2"') + P('M-1 -16.2 L-0.4 -14 M1 -16.2 L0.4 -14 M-1.4 -14.6 L-0.7 -13.4 M1.4 -14.6 L0.7 -13.4 M0 -16.6 L0 -15.4 M-0.6 -13.2 L0.6 -13.2', 'none', 'stroke="#1a1010" stroke-width=".35"')
    + E(-0.62, -15, 0.34, 0.22, '#ffe85a') + E(0.62, -15, 0.34, 0.22, '#ffe85a') + C(-0.62, -15, 0.12, '#1a0a0a') + C(0.62, -15, 0.12, '#1a0a0a')
    + [-1.25, -0.82, -0.4, 0.04, 0.48, 0.9, 1.3].map((hx) => { const by = -16.25 + hx * hx * 0.5; return P(`M${hx - 0.17} ${by} L${hx * 1.1} ${by - 0.85} L${hx + 0.17} ${by}Z`, '#ece2c8', 'stroke="#8a7a5a" stroke-width=".1"'); }).join('')
    + P('M0 -15 L-0.15 -14.1 L0.15 -14.1Z', '#c8902e') + P('M-0.5 -13.5 Q0 -13.3 0.5 -13.5', 'none', 'stroke="#5a2a10" stroke-width=".22"')
    + L(5.4, -11, 8.2, -5, '#8a8a92', 0.7) + [0.25, 0.5, 0.75].map((t) => C(5.4 + 2.8 * t, -11 + 6 * t, 0.42, '#5a5a62')).join('') + L(8.2, -5, 11.6, 2.2, '#ff2a1a', 1.2) + L(8.2, -5, 11.6, 2.2, '#ffd8d0', 0.4) + L(5.4, -11, 2.2, -17.8, '#ff2a1a', 1.2) + L(5.4, -11, 2.2, -17.8, '#ffd8d0', 0.4) + glow(5.4, -11, 1.2, '#ff2a1a', 0.3)
    + P('M6 -9.4 C6.6 -9.6 7 -9 6.8 -8.4 C6.6 -8 6 -8 5.8 -8.4Z', '#d8a03a', 'stroke="#8a6020" stroke-width=".12"'));
  // Asajj Ventress: bald and pale with faint markings, the dark layered
  // outfit with its sash and skirt panels, and the two curved-hilt red sabers.
  const ventress = (x, y, s, f = 1, pose = 0) => g(x, y, s, f,
    E(0, 0.2, 3.6, 0.6, '#000', 'opacity=".3"')
    + L(-1, -5, -1.6, 0, '#1e1e24', 1.1) + L(1, -5, 1.8, 0, '#18181e', 1.1)
    + P('M-2.2 -6.2 L-3.4 -2.2 L-0.2 -3 L0 -6.2Z M2.2 -6.2 L3.4 -2.6 L0.2 -3 L0 -6.2Z', '#3a3a44', 'stroke="#18181e" stroke-width=".2"')
    + P('M-2 -11 L-1.8 -6 L1.8 -6 L2 -11 C1 -11.6 -1 -11.6 -2 -11Z', '#2a2a32', 'stroke="#121218" stroke-width=".2"') + P('M-1.2 -10.8 L0 -7.6 L1.2 -10.8', 'none', 'stroke="#5a5a64" stroke-width=".3"') + R(-2, -6.6, 4, 0.7, '#5a4a5a')
    + P('M-2.6 -11.2 L-1.2 -11.6 L-1.4 -10 L-2.8 -9.6Z M2.6 -11.2 L1.2 -11.6 L1.4 -10 L2.8 -9.6Z', '#4a4a54')
    + R(-0.5, -12.4, 1, 0.9, '#d8d2dc') + C(0, -13.6, 1.45, '#e4dee8', 'stroke="#9a92a0" stroke-width=".2"') + P('M-0.8 -14.8 C-0.4 -15.2 0.4 -15.2 0.8 -14.8 M-1 -14.2 L-0.6 -13.8 M1 -14.2 L0.6 -13.8', 'none', 'stroke="#9a92a8" stroke-width=".2"')
    + E(-0.55, -13.6, 0.3, 0.18, '#3a4a6a') + E(0.55, -13.6, 0.3, 0.18, '#3a4a6a') + P('M-0.35 -12.6 Q0 -12.45 0.35 -12.6', 'none', 'stroke="#6a4a5a" stroke-width=".2"')
    + (pose === 0
      ? L(1.8, -10.4, 3.4, -8.8, '#d8d2dc', 0.7) + P('M3 -8.6 Q3.6 -8 3.4 -7.4', 'none', 'stroke="#b8b8c0" stroke-width=".5"') + L(3.6, -8.8, 9.6, -15.6, '#ff2a1a', 0.9) + L(3.6, -8.8, 9.6, -15.6, '#ffd8d0', 0.3)
        + L(-1.8, -10.4, -3.2, -7.6, '#d8d2dc', 0.7) + P('M-3 -7.4 Q-3.6 -6.8 -3.4 -6.2', 'none', 'stroke="#b8b8c0" stroke-width=".5"') + L(-3.4, -7.2, -8.6, -2, '#ff2a1a', 0.9) + L(-3.4, -7.2, -8.6, -2, '#ffd8d0', 0.3)
      : L(1.8, -10.4, 2.6, -13.4, '#d8d2dc', 0.7) + L(-1.8, -10.4, -2.6, -13.4, '#d8d2dc', 0.7) + L(2.6, -13.6, -5, -20, '#ff2a1a', 0.9) + L(2.6, -13.6, -5, -20, '#ffd8d0', 0.3) + L(-2.6, -13.6, 5, -20, '#ff2a1a', 0.9) + L(-2.6, -13.6, 5, -20, '#ffd8d0', 0.3)));
  // Yoda: the green head and long ears with their pink insides, wisps of
  // white hair, deep eyes, the tan robe and brown over-robe, the gimer stick,
  // one hand raised to the Force.
  const yoda = (x, y, s, f = 1, lift = true) => g(x, y, s, f,
    E(0, 0.2, 2.6, 0.4, '#000', 'opacity=".3"')
    + P('M-1.7 -4 C-2 -2.4 -2.3 -1 -2.4 0 L2.4 0 C2.3 -1 2 -2.4 1.7 -4Z', '#cbb68c', 'stroke="#7a6a4a" stroke-width=".18"') + P('M-1.7 -4 L-1.4 -1.6 L-0.2 -0.4 L0.2 -4Z', '#8a6a42', 'opacity=".85"') + P('M-1.2 -3 L-1.8 0 M0.8 -3 L1.2 0', 'none', 'stroke="#a8946a" stroke-width=".15"')
    + L(1.8, -3.2, 2.6, 0, '#6a5034', 0.35) + C(1.8, -3.2, 0.3, '#8aa860')
    + (lift ? P('M1.4 -3.6 C2.2 -4.2 2.8 -4.8 3.4 -5.8', 'none', 'stroke="#cbb68c" stroke-width=".6" stroke-linecap="round"') + C(3.5, -6, 0.35, '#8aa860') + glow(3.6, -6.2, 0.6, '#cfe8ff', 0.35) : '')
    + P('M-1.4 -5.4 C-2.6 -5.6 -3.6 -6 -4.4 -6.4 C-3.8 -5.4 -2.6 -4.8 -1.4 -4.6Z', '#8aa860', 'stroke="#5a7a3a" stroke-width=".15"') + P('M-1.6 -5.3 C-2.6 -5.4 -3.4 -5.7 -3.9 -6 C-3.2 -5.4 -2.4 -5.1 -1.6 -5Z', '#d8a8a0', 'opacity=".7"')
    + P('M1.4 -5.4 C2.6 -5.6 3.6 -6 4.4 -6.4 C3.8 -5.4 2.6 -4.8 1.4 -4.6Z', '#8aa860', 'stroke="#5a7a3a" stroke-width=".15"') + P('M1.6 -5.3 C2.6 -5.4 3.4 -5.7 3.9 -6 C3.2 -5.4 2.4 -5.1 1.6 -5Z', '#d8a8a0', 'opacity=".7"')
    + E(0, -5.2, 1.55, 1.3, '#90ae64', 'stroke="#5a7a3a" stroke-width=".18"') + P('M-0.9 -6 Q0 -6.3 0.9 -6 M-0.7 -6.3 Q0 -6.6 0.7 -6.3', 'none', 'stroke="#6a8a48" stroke-width=".15"')
    + P('M-1 -6.3 q-.6 -.5 -1 -.2 M1 -6.3 q.6 -.5 1 -.2 M0 -6.5 q.2 -.5 .5 -.6', 'none', 'stroke="#f0f0f0" stroke-width=".15" opacity=".8"')
    + E(-0.55, -5.3, 0.32, 0.24, '#2a2a1a') + E(0.55, -5.3, 0.32, 0.24, '#2a2a1a') + C(-0.5, -5.36, 0.08, '#ffffff') + C(0.6, -5.36, 0.08, '#ffffff')
    + P('M-0.15 -5 Q0 -4.7 0.15 -5', 'none', 'stroke="#5a7a3a" stroke-width=".14"') + P('M-0.5 -4.4 Q0 -4.2 0.5 -4.4', 'none', 'stroke="#4a6a2a" stroke-width=".16"'));
  // Grogu: the little brown robe with its wide collar, green head, huge ears
  // and big dark eyes, a tiny hand raised.
  const grogu = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 1.8, 0.3, '#000', 'opacity=".3"')
    + P('M-1.2 -2.6 C-1.5 -1.4 -1.7 -0.6 -1.7 0 L1.7 0 C1.7 -0.6 1.5 -1.4 1.2 -2.6Z', '#b0905e', 'stroke="#6a5030" stroke-width=".15"') + P('M-1.5 -2.7 C-0.6 -2.2 0.6 -2.2 1.5 -2.7 L1.2 -2.2 C0.4 -1.8 -0.4 -1.8 -1.2 -2.2Z', '#c8a878') + L(0, -2, 0, 0, '#8a6a40', 0.12)
    + P('M1.2 -2.2 Q2 -2.8 2.4 -3.4', 'none', 'stroke="#b0905e" stroke-width=".45" stroke-linecap="round"') + C(2.5, -3.5, 0.25, '#9ab872')
    + P('M-0.9 -3.9 C-2 -4.1 -3.2 -4.6 -3.8 -4.6 C-3.4 -3.8 -2.2 -3.2 -0.9 -3.2Z', '#9ab872', 'stroke="#6a8a4a" stroke-width=".12"') + P('M-1 -3.8 C-2 -3.9 -3 -4.3 -3.3 -4.3 C-2.8 -3.8 -2 -3.5 -1 -3.4Z', '#e0a8a0', 'opacity=".7"')
    + P('M0.9 -3.9 C2 -4.1 3.2 -4.6 3.8 -4.6 C3.4 -3.8 2.2 -3.2 0.9 -3.2Z', '#9ab872', 'stroke="#6a8a4a" stroke-width=".12"') + P('M1 -3.8 C2 -3.9 3 -4.3 3.3 -4.3 C2.8 -3.8 2 -3.5 1 -3.4Z', '#e0a8a0', 'opacity=".7"')
    + E(0, -3.7, 1.05, 0.95, '#a2c07a', 'stroke="#6a8a4a" stroke-width=".12"') + E(-0.42, -3.75, 0.32, 0.3, '#14100c') + E(0.42, -3.75, 0.32, 0.3, '#14100c') + C(-0.34, -3.86, 0.09, '#ffffff') + C(0.5, -3.86, 0.09, '#ffffff') + P('M-0.12 -3.3 Q0 -3.2 0.12 -3.3', 'none', 'stroke="#6a8a4a" stroke-width=".1"'));
  // Kylo Ren: the black layered robes and cape, hood and cowl, the black
  // helmet with its silver-trimmed visor, and the crackling crossguard saber.
  // Kylo's crossguard saber: the hilt with its vents, the two short quillon
  // blades out to the sides, and the long unstable blade with ragged,
  // crackling edges and a hot core. (hx, hy) = the emitter; ang = tilt.
  const crossSaber = (hx, hy, len, ang = 0) => {
    const n = 12; const pts = [];
    for (let k = 0; k <= n; k++) { const yy = -0.5 - (len * k) / n; const j = 0.5 + ((k * 7) % 4) * 0.12; pts.push([j * (k === n ? 0.4 : 1), yy]); }
    const right = pts.map(([px, py]) => `${px.toFixed(2)} ${py.toFixed(2)}`); const left = pts.slice().reverse().map(([px, py], k) => `${(-px - ((k * 5) % 3) * 0.08).toFixed(2)} ${py.toFixed(2)}`);
    const quill = (sd) => `<line x1="${sd * 0.6}" y1="-0.3" x2="${sd * 2.4}" y2="-0.3" stroke="#ff2a10" stroke-width="2" opacity=".25" stroke-linecap="round"/>` + P(`M${sd * 0.6} -0.65 L${sd * 2.2} -0.75 L${sd * 2.5} -0.3 L${sd * 2.2} 0.15 L${sd * 0.6} 0.05Z`, '#ff2a10') + L(sd * 0.7, -0.3, sd * 2.2, -0.3, '#fff0e8', 0.22);
    return `<g transform="translate(${hx} ${hy}) rotate(${ang})">`
      + `<line x1="0" y1="-0.5" x2="0" y2="${-len}" stroke="#ff2a10" stroke-width="3.4" opacity=".18" stroke-linecap="round"/><line x1="0" y1="-0.5" x2="0" y2="${-len}" stroke="#ff2a10" stroke-width="2" opacity=".3" stroke-linecap="round"/>`
      + P(`M${right.join(' L')} L${left.join(' L')}Z`, '#ff2a10') + P(`M0.18 -0.6 L0.28 ${(-len * 0.5).toFixed(1)} L0.1 ${(-len + 0.4).toFixed(1)} L-0.12 ${(-len * 0.5).toFixed(1)} L-0.2 -0.6Z`, '#fff0e8')
      + quill(-1) + quill(1)
      + [[0.7, -2.6, 1], [-0.7, -5.2, -1], [0.8, -7.6, 1], [-0.7, -9.6, -1]].map(([px, py, sd]) => P(`M${px} ${py} l${sd * 0.7} -.3 l${-sd * 0.2} .7`, 'none', 'stroke="#ffb08a" stroke-width=".18"')).join('')
      + R(-0.5, -0.6, 1, 0.9, '#5a5a62') + R(-0.45, 0.3, 0.9, 2.4, '#2a2a30') + [0.8, 1.4, 2].map((yy) => L(-0.45, yy, 0.45, yy, '#6a6a72', 0.15)).join('') + R(-0.55, 2.6, 1.1, 0.4, '#4a4a52')
      + `</g>`;
  };
  // Kylo Ren: the long black cape, the ribbed tunic with its belt and silver
  // buckle, gloved hands, the hood and cowl round the black helmet with its
  // silver-trimmed brow, visor and cheek lines, and the crossguard saber.
  const kylo = (x, y, s, f = 1, ang = 6) => g(x, y, s, f,
    E(0, 0.2, 4.6, 0.6, '#000', 'opacity=".35"')
    + P('M-3.4 -11.6 C-5.4 -7 -6.2 -3 -6.4 0 L6 0 C5.8 -3 5 -7 3.4 -11.6Z', '#0a0a0e', 'stroke="#000" stroke-width=".2"') + P('M-4.6 -6 L-5.4 0 M4.4 -6 L5 0', 'none', 'stroke="#1c1c22" stroke-width=".3"')
    + P('M-2.4 -11.2 C-3 -7 -3.5 -3 -3.8 0 L3.8 0 C3.5 -3 3 -7 2.4 -11.2Z', '#18181e', 'stroke="#050508" stroke-width=".2"') + [-10.6, -10, -9.4, -8.8, -8.2, -7.6].map((yy) => L(-2.3, yy, 2.3, yy, '#26262e', 0.15)).join('')
    + P('M-0.6 -6.2 L-1.2 0 M0.7 -6.2 L1.3 0 M-2.2 -5 L-3 0 M2.2 -5 L3 0', 'none', 'stroke="#26262e" stroke-width=".3"')
    + R(-2.4, -7.1, 4.8, 0.9, '#2a2a30') + R(-0.7, -7.25, 1.4, 1.2, '#a8acb4', 'stroke="#5a5a62" stroke-width=".1"') + L(-0.3, -7.1, -0.3, -6.2, '#5a5a62', 0.12) + L(0.3, -7.1, 0.3, -6.2, '#5a5a62', 0.12)
    + P('M-2.4 -10.8 L-3.6 -6.6 L-2.8 -6.3 L-1.8 -10Z', '#141418') + C(-3.25, -6.1, 0.55, '#08080a')
    + P('M-3 -11.2 C-3.8 -12.8 -3.2 -14.8 -2.1 -15.5 C-0.8 -16.2 0.8 -16.2 2.1 -15.5 C3.2 -14.8 3.8 -12.8 3 -11.2 C1.4 -12 -1.4 -12 -3 -11.2Z', '#0e0e12') + P('M-2.6 -11.6 C-1.4 -10.6 1.4 -10.6 2.6 -11.6', 'none', 'stroke="#1c1c22" stroke-width=".4"')
    + P('M-1.45 -14.2 C-1.6 -16.5 1.6 -16.5 1.45 -14.2 L1.6 -12.5 C0.8 -12.1 -0.8 -12.1 -1.6 -12.5Z', '#17171c', 'stroke="#3a3a42" stroke-width=".12"') + P('M-1 -15.8 Q0 -16.3 1 -15.8', 'none', 'stroke="#4a4a54" stroke-width=".2"')
    + R(-1.25, -14.55, 2.5, 0.4, '#000') + P('M-1.45 -14.6 Q0 -14.85 1.45 -14.6', 'none', 'stroke="#c8ccd4" stroke-width=".22"') + L(0, -14.2, 0, -12.9, '#c8ccd4', 0.2) + P('M-1.3 -14.3 L-1.15 -12.7 M1.3 -14.3 L1.15 -12.7', 'none', 'stroke="#a8acb4" stroke-width=".16"') + P('M-0.5 -12.7 L0.5 -12.7 M-0.4 -12.45 L0.4 -12.45', 'none', 'stroke="#5a5a62" stroke-width=".1"')
    + P('M2.2 -10.8 L3.9 -9.3 L3.4 -8.5 L1.8 -9.8Z', '#141418') + C(3.9, -8.7, 0.6, '#08080a')
    + crossSaber(3.9, -9.4, 13, ang));
  // Mother Talzin: the tall red-and-black robes flaring to the ground, the
  // ruff collar, pale face with her markings, the great spiked headdress
  // fanning up behind her head, and green magick blazing in both hands.
  const talzin = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 5.4, 0.7, '#000', 'opacity=".35"')
    + P('M-2.6 -11 C-4 -7 -5.8 -3 -6.6 0 L6.6 0 C5.8 -3 4 -7 2.6 -11Z', '#6a0e18', 'stroke="#2a0408" stroke-width=".25"') + P('M-1.2 -10.6 L-2 0 L2 0 L1.2 -10.6Z', '#1a0a0e') + P('M-3 -6 L-4.6 0 M3 -6 L4.6 0 M-2 -3 L-3 0', 'none', 'stroke="#4a0810" stroke-width=".3"') + P('M-6.6 0 L-5.4 -0.8 L-4.4 0 L-3.2 -0.8 L-2 0', 'none', 'stroke="#c8a040" stroke-width=".25"')
    + P('M-2.4 -11.6 L-2.2 -8 L2.2 -8 L2.4 -11.6 C1.2 -12.2 -1.2 -12.2 -2.4 -11.6Z', '#2a0a10') + R(-2.3, -8.6, 4.6, 0.7, '#c8a040', 'opacity=".85"')
    + P('M-3.4 -12 C-2.4 -13.2 2.4 -13.2 3.4 -12 L2.6 -11 C1.4 -11.8 -1.4 -11.8 -2.6 -11Z', '#3a0a10', 'stroke="#c8a040" stroke-width=".18"')
    + P('M-2.2 -11.2 C-3.4 -12.4 -4.6 -13.6 -5.4 -15', 'none', 'stroke="#6a0e18" stroke-width="1" stroke-linecap="round"') + P('M2.2 -11.2 C3.4 -12.4 4.6 -13.6 5.4 -15', 'none', 'stroke="#6a0e18" stroke-width="1" stroke-linecap="round"')
    + C(-5.6, -15.4, 0.4, '#e8e0e8') + C(5.6, -15.4, 0.4, '#e8e0e8') + glow(-5.8, -16.4, 1.4, '#6aff5a', 0.5) + C(-5.8, -16.4, 0.9, '#c8ffb8') + glow(5.8, -16.4, 1.4, '#6aff5a', 0.5) + C(5.8, -16.4, 0.9, '#c8ffb8')
    + [[-1.6, -15.6, -4, -20.4], [-0.8, -16, -2, -22], [0, -16.2, 0, -23], [0.8, -16, 2, -22], [1.6, -15.6, 4, -20.4]].map(([a, b, c, d], k) => P(`M${a - 0.4} ${b} L${c} ${d} L${a + 0.4} ${b}Z`, k % 2 ? '#2a0a10' : '#8a1420', 'stroke="#c8a040" stroke-width=".15"')).join('')
    + P('M-2 -14.4 C-2.2 -16.6 2.2 -16.6 2 -14.4 L1.2 -15.2 L-1.2 -15.2Z', '#3a0a10', 'stroke="#c8a040" stroke-width=".15"')
    + E(0, -13.8, 1.25, 1.55, '#e8dee6') + P('M-0.8 -14.2 L-0.3 -14 M0.8 -14.2 L0.3 -14', 'none', 'stroke="#1a0a10" stroke-width=".3"') + P('M-0.6 -14.6 L-0.2 -15.2 M0.6 -14.6 L0.2 -15.2 M0 -13.4 L0 -12.6', 'none', 'stroke="#5a2a3a" stroke-width=".18"') + P('M-0.35 -12.8 Q0 -12.6 0.35 -12.8', 'none', 'stroke="#6a0a14" stroke-width=".25"')
    + E(-0.55, -14, 0.22, 0.14, '#9aff8a', 'opacity=".9"') + E(0.55, -14, 0.22, 0.14, '#9aff8a', 'opacity=".9"'));
  // R2-D2: the blue-and-white dome, the barrel body and the two side legs.
  const r2 = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 2.6, 0.4, '#000', 'opacity=".3"') + P('M-2.2 -1 L-2.6 0 L-1.4 0 L-1.4 -1Z M2.2 -1 L2.6 0 L1.4 0 L1.4 -1Z', '#8a8e96')
    + R(-2.4, -5.2, 0.8, 4.4, '#e8ecf0', 'stroke="#6a7280" stroke-width=".15"') + R(1.6, -5.2, 0.8, 4.4, '#e8ecf0', 'stroke="#6a7280" stroke-width=".15"')
    + R(-1.6, -5, 3.2, 4.6, '#f2f4f6', 'stroke="#6a7280" stroke-width=".2"') + R(-1.2, -4.4, 1, 1.4, '#3a6ab8') + R(0.3, -4.4, 0.9, 0.6, '#3a6ab8') + R(0.3, -3.4, 0.9, 0.4, '#3a6ab8') + R(-1.2, -2.6, 2.4, 0.4, '#8a92a0') + R(-0.6, -1.8, 1.2, 0.8, '#3a6ab8')
    + P('M-1.7 -5 C-1.7 -7.2 1.7 -7.2 1.7 -5Z', '#d8dce2', 'stroke="#6a7280" stroke-width=".2"') + R(-0.8, -6.4, 1, 0.7, '#3a6ab8') + C(-0.3, -6.1, 0.3, '#1a1a22') + C(0.8, -5.8, 0.18, '#ff3a2a') + R(-1.4, -5.6, 0.6, 0.4, '#3a6ab8') + R(0.7, -6.6, 0.6, 0.4, '#3a6ab8'));

  // ---------- Machines ----------
  // An X-wing side-on, nose right, landing gear optional: the long nose with
  // its red bands, the canopy, R2 behind it, the S-foils spread with their
  // cannons, the four engines glowing.
  const xwing = (x, y, s, a = 0, gear = false, glowOn = true) => g(x, y, s, 1,
    (gear ? L(-6, 1.6, -6.6, 5, '#5a5a62', 0.6) + L(6, 1.4, 6.4, 5, '#5a5a62', 0.6) + E(-6.6, 5, 1, 0.3, '#3a3a42') + E(6.4, 5, 1, 0.3, '#3a3a42') : '')
    + P('M-12 -2.2 L-4 -2.2 L2 -9.6 L-1.2 -10 Z', '#d8d6ce', 'stroke="#6a685e" stroke-width=".3"') + R(-6, -10.2, 16, 0.8, '#b8b6ae', 'stroke="#5a584e" stroke-width=".2"') + R(10, -10, 3, 0.4, '#5a584e') + P('M-6 -6.6 L-2.4 -6.6 L-1.4 -7.8 L-5 -7.8Z', '#c8402a')
    + R(-15.6, -3.4, 4.6, 2, '#b8b6ae', 'stroke="#5a584e" stroke-width=".25"') + R(-15.6, 1.2, 4.6, 2, '#a8a69e', 'stroke="#5a584e" stroke-width=".25"')
    + P('M-14 -1.8 L4 -2.2 L16 -0.7 L16.4 0 L16 0.7 L4 1.8 L-14 1.8Z', '#e6e4dc', 'stroke="#6a685e" stroke-width=".35"') + P('M-14 -1.8 L4 -2.2 L16 -0.7 L-14 -0.6Z', '#ffffff', 'opacity=".35"')
    + [8, 10.6, 13].map((px) => R(px, -1.4 + (px - 8) * 0.08, 0.8, 2.8 - (px - 8) * 0.16, '#c8402a')).join('') + L(-12, 0.4, 15, 0.2, '#9a988e', 0.25) + [-10, -6, -2, 2].map((px) => L(px, -1.8, px, 1.8, '#b8b6ae', 0.2)).join('')
    + P('M-2.4 -2.1 L1.4 -4 L5.6 -3.4 L6.8 -1.9Z', '#2e3e4e', 'stroke="#6a685e" stroke-width=".25"') + L(1.4, -4, 2, -2, '#8a988e', 0.25) + L(4, -3.6, 4.4, -1.9, '#8a988e', 0.25) + P('M0 -2.6 L1.6 -3.6 L3 -3.4', 'none', 'stroke="#8ab0d0" stroke-width=".3" opacity=".7"')
    + P('M-6.4 -2.1 C-6.4 -3.8 -3.6 -3.8 -3.6 -2.1Z', '#e8ecf0', 'stroke="#6a7280" stroke-width=".2"') + R(-5.6, -3.2, 0.8, 0.5, '#3a6ab8') + C(-4.6, -2.8, 0.25, '#1a1a22')
    + P('M-12 2 L-4 2 L1 8.4 L-1.8 8.8Z', '#c8c6be', 'stroke="#6a685e" stroke-width=".3"') + R(-6, 8.4, 15, 0.7, '#a8a69e', 'stroke="#5a584e" stroke-width=".2"') + R(9, 8.5, 2.6, 0.4, '#5a584e') + P('M-5 5.6 L-1.8 5.6 L-1 6.8 L-4.2 6.8Z', '#c8402a')
    + (glowOn ? [-2.4, 2.2].map((yy) => glow(-16.2, yy, 1, '#ff7a4a', 0.45) + E(-15.8, yy, 0.4, 0.9, '#ffd0a8')).join('') : ''), a);
  // A TIE Interceptor, front-on: the ball cockpit with its spoked window, the
  // pylons and the dagger-tipped wings with cannons at the tips.
  // A TIE Interceptor, front-on: the ball cockpit with its spoked window and
  // shading, the pylons with their joints, and the bent dagger wings with
  // frames, solar panels and the four wingtip cannons. fire lights the guns.
  const interceptor = (x, y, s, a = 0, fire = false) => g(x, y, s, 1,
    [-1, 1].map((sd) => {
      const o = `M${sd * 4.6} -0.9 L${sd * 6.6} -10.4 L${sd * 8.6} -10.8 L${sd * 7.4} -4.4 L${sd * 9.2} -2 L${sd * 9.2} 2 L${sd * 7.4} 4.4 L${sd * 8.6} 10.8 L${sd * 6.6} 10.4 L${sd * 4.6} 0.9Z`;
      const i = `M${sd * 5.3} -1 L${sd * 6.9} -9.2 L${sd * 7.8} -9.4 L${sd * 6.8} -4.2 L${sd * 8.5} -1.8 L${sd * 8.5} 1.8 L${sd * 6.8} 4.2 L${sd * 7.8} 9.4 L${sd * 6.9} 9.2 L${sd * 5.3} 1Z`;
      return P(o, '#20232a', 'stroke="#0c0e12" stroke-width=".3"') + P(i, '#3e4450', 'stroke="#14161a" stroke-width=".15"')
        + P(`M${sd * 5.6} 0 L${sd * 7.2} -8 M${sd * 5.6} 0 L${sd * 7.2} 8 M${sd * 5.6} 0 L${sd * 8.4} -1.4 M${sd * 5.6} 0 L${sd * 8.4} 1.4 M${sd * 6.2} -3 L${sd * 6.9} -4.4 M${sd * 6.2} 3 L${sd * 6.9} 4.4`, 'none', 'stroke="#16181e" stroke-width=".22"')
        + P(`M${sd * 6.9} -9.2 L${sd * 7.8} -9.4 L${sd * 6.8} -4.2Z`, '#5a6270', 'opacity=".6"') + R(sd * 5.6 - 0.5, -0.6, 1, 1.2, '#2a2e36')
        + [[8.6, -10.8], [8.6, 10.8]].map(([cx, cy]) => L(sd * cx, cy, sd * cx, cy + (cy < 0 ? -1.2 : 1.2), '#2a2e36', 0.45) + (fire ? glow(sd * cx, cy + (cy < 0 ? -1.4 : 1.4), 0.6, '#5aff6a', 0.7) + C(sd * cx, cy + (cy < 0 ? -1.4 : 1.4), 0.4, '#d8ffd0') : C(sd * cx, cy + (cy < 0 ? -1.3 : 1.3), 0.25, '#ff5a3a'))).join('');
    }).join('')
    + R(-4.6, -0.7, 9.2, 1.4, '#4a505a', 'stroke="#1a1c22" stroke-width=".2"') + [-3.6, 3.6].map((px) => R(px - 0.5, -0.9, 1, 1.8, '#2e323a')).join('')
    + C(0, 0, 2.4, '#7a808a', 'stroke="#2a2e36" stroke-width=".25"') + P('M1.7 -1.7 A2.4 2.4 0 0 1 -1.7 1.7 A2.6 2.6 0 0 0 1.7 -1.7Z', '#4a505a', 'opacity=".7"') + C(0, 0, 1.75, '#3a3e46')
    + C(0, 0, 1.35, '#0c1016') + Array.from({ length: 8 }, (_, k) => { const an = (k / 8) * Math.PI * 2; return L((Math.cos(an) * 0.35).toFixed(2), (Math.sin(an) * 0.35).toFixed(2), (Math.cos(an) * 1.35).toFixed(2), (Math.sin(an) * 1.35).toFixed(2), '#8a909a', 0.16); }).join('') + C(0, 0, 0.35, '#8a909a') + C(-0.5, -0.5, 0.35, '#7aa0d0', 'opacity=".6"') + P('M-1.6 -0.8 A1.8 1.8 0 0 1 -0.6 -1.7', 'none', 'stroke="#c8ccd4" stroke-width=".25" opacity=".7"'), a);
  const bolt = (x1, y1, x2, y2, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="1.6" stroke-linecap="round" opacity=".35"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffffff" stroke-width=".5" stroke-linecap="round"/>`;
  // Where an Interceptor's wingtip guns are once it is placed, scaled and
  // tilted, so its shots can start right at the barrels.
  const tieGuns = (x, y, s, a) => { const r = (a * Math.PI) / 180; return [[8.6, -12.2], [8.6, 12.2], [-8.6, -12.2], [-8.6, 12.2]].map(([lx, ly]) => [x + s * (lx * Math.cos(r) - ly * Math.sin(r)), y + s * (lx * Math.sin(r) + ly * Math.cos(r))]); };
  // Short laser bolts in flight from (x1, y1) toward (x2, y2), at fractions ts of the way.
  const shots = ([x1, y1], [x2, y2], ts, len = 0.12, c = '#3aff6a') => ts.map((t) => { const ax = x1 + (x2 - x1) * t; const ay = y1 + (y2 - y1) * t; return bolt(+ax.toFixed(1), +ay.toFixed(1), +(ax + (x2 - x1) * len).toFixed(1), +(ay + (y2 - y1) * len).toFixed(1), c); }).join('');
  // Yoda's hut: the mud dome and its smaller annex, round windows glowing
  // warm, the door, the chimney pipe with smoke, roots wrapped around it.
  const hut = (x, y, s) => g(x, y, s, 1,
    E(0, 0.4, 16, 1.6, '#000', 'opacity=".3"')
    + P('M6 0 C6 -7 16 -7 16 0Z', '#6a5a40', 'stroke="#3a3020" stroke-width=".3"') + C(11.4, -3, 1.4, '#ffb04a') + C(11.4, -3, 1.4, 'none', 'stroke="#3a3020" stroke-width=".4"') + glow(11.4, -3, 1.4, '#ffb04a', 0.3)
    + P('M-12 0 C-12 -15 10 -15 10 0Z', '#7a6a4a', 'stroke="#3a3020" stroke-width=".35"') + P('M-12 0 C-12 -15 -1 -15 -1 -14 C-6 -12 -9 -6 -8 0Z', '#8a7a58', 'opacity=".6"')
    + [[-8, -4], [-4, -9], [3, -8], [6, -3], [-1, -3]].map(([px, py]) => E(px, py, 1.6, 0.8, '#5a4a32', 'opacity=".5"')).join('')
    + C(-3, -6.4, 2.2, '#ffc060') + C(-3, -6.4, 2.2, 'none', 'stroke="#3a3020" stroke-width=".6"') + L(-3, -8.6, -3, -4.2, '#5a4020', 0.35) + L(-5.2, -6.4, -0.8, -6.4, '#5a4020', 0.35) + glow(-3, -6.4, 2, '#ffb04a', 0.35)
    + C(5, -6, 1.3, '#ffb04a') + C(5, -6, 1.3, 'none', 'stroke="#3a3020" stroke-width=".4"')
    + P('M-10 0 C-10 -4 -6 -4 -6 0Z', '#2a2014') + glow(-8, -1.6, 1.4, '#ff9a3a', 0.25)
    + R(1, -17, 1.4, 5, '#5a5a52') + R(0.6, -17.4, 2.2, 0.8, '#4a4a42') + E(2.8, -20, 2.6, 1.8, '#a8a898', 'opacity=".35"') + E(5, -24, 3.6, 2.4, '#a8a898', 'opacity=".22"') + E(8, -29, 4.6, 3, '#a8a898', 'opacity=".12"')
    + P('M-13 0 C-12 -6 -14 -10 -18 -12 M10 0 C12 -4 16 -6 20 -6 M-6 -12 C-2 -16 4 -16 8 -12', 'none', 'stroke="#3a3424" stroke-width="1.2" stroke-linecap="round"') + P('M-13 0 C-12 -6 -14 -10 -18 -12', 'none', 'stroke="#5a5040" stroke-width=".4"'));

  const D = {
    // 1 · Swamp Landing (fleet): dusk over the swamp. Luke's X-wing comes
    // down through the mist with its gear out and engines burning, R2 behind
    // the canopy, two TIE Interceptors diving after it firing; the treeline
    // in layers of fog, the bog below catching the light, great gnarled trees
    // framing the view with moss hanging from every branch.
    swamp_landing: () => fill([[0, '#3a4a4a'], [0.45, '#6a7a6a'], [0.75, '#9aa48a'], [1, '#5a6a50']])
      + E(118, 22, 30, 10, '#d8d8b8', 'opacity=".25"') + C(118, 22, 6, '#f0ecd0', 'opacity=".45"')
      + E(30, 14, 30, 4, '#5a6a64', 'opacity=".5"') + E(90, 10, 40, 4, '#5a6a64', 'opacity=".4"') + E(140, 34, 30, 3, '#7a8a78', 'opacity=".4"')
      + treeline(64, '#4a5a4a', 0.55, 1) + fog(58, 0.35, '#c8d4bc', 1) + treeline(70, '#33402e', 0.8, 4) + fog(66, 0.4, '#b8c8ac', 2)
      + bog(70, '#4a5a44', '#18221a', 1) + E(118, 74, 26, 2.4, '#e8e4c8', 'opacity=".22"') + P('M96 76 L140 76 M104 79 L132 79', 'none', 'stroke="#f0ecd0" stroke-width=".4" opacity=".4"')
      + refl(70, xwing(70, 54, 1.6, 10, true, false), 0.18)
      + (() => { const a = tieGuns(30, 56, 1, -12); const b = tieGuns(48, 18, 0.75, -8); return shots(a[0], [64, 46], [0, 0.55], 0.22) + shots(a[1], [62, 54], [0.05, 0.6], 0.2) + shots(b[0], [70, 38], [0, 0.5], 0.25) + shots(b[1], [68, 44], [0.06, 0.56], 0.22); })() + interceptor(30, 56, 1, -12, true) + interceptor(48, 18, 0.75, -8, true)
      + xwing(72, 46, 1.6, 10, true) + E(70, 60, 16, 3, '#c8d4bc', 'opacity=".3"') + P('M88 70 Q96 66 104 70 M60 71 Q66 68 72 71', 'none', 'stroke="#c8d8c0" stroke-width=".8" opacity=".5"')
      + tree(10, 88, 80, 6, '#2a2c20', '#121410', '#4a5e30', 2) + tree(152, 90, 70, -8, '#2e3022', '#121410', '#4a5e30', 5)
      + pads([[40, 82, 2.4], [52, 86, 3], [100, 84, 2.2], [118, 88, 3.2]]) + reeds(28, 90, 9, 12) + reeds(132, 90, 8, 10) + fog(84, 0.25, '#c8d4bc', 3) + motes(14, 1, '#e8ff9a', 0.7, 40, 86),

    // 2 · Mist Witches: deep in the fog. Three Nightsister acolytes rise out
    // of the mist on the roots, energy bows drawn with green magick arrows,
    // ghostly green magick curling through the air and glowing in the water;
    // dark trees close in on every side, lily pads and reeds at the front.
    mist_witches: () => fill([[0, '#1e2a26'], [0.5, '#3a4a40'], [1, '#2a3a30']])
      + treeline(62, '#4a5a50', 0.45, 2) + fog(50, 0.3, '#a8bca8', 4) + treeline(66, '#2a3628', 0.85, 6) + fog(58, 0.45, '#9ab49a', 5)
      + P('M10 60 C30 40 50 70 70 46 S110 30 140 50', 'none', 'stroke="#6aff7a" stroke-width="3" opacity=".08"') + P('M20 66 C40 50 60 72 80 56 S120 44 150 60', 'none', 'stroke="#6aff7a" stroke-width="1.6" opacity=".12"') + P('M40 30 C60 20 70 40 90 28', 'none', 'stroke="#9aff9a" stroke-width=".8" opacity=".2"')
      + bog(70, '#2a3a30', '#0a120c', 2)
      + P('M30 72 C40 68 52 68 62 72 L60 74 C52 71 40 71 32 74Z M84 70 C96 66 110 66 122 70 L120 72 C110 69 96 69 86 72Z', '#2a2a20')
      + refl(71, sister(42, 71, 2.2, 1) + sister(80, 69, 2.5, 1) + sister(118, 70, 2.2, -1), 0.2)
      + E(78, 74, 30, 3, '#6aff7a', 'opacity=".1"')
      + sister(42, 71, 2.2, 1) + sister(80, 69, 2.5, 1) + sister(118, 70, 2.2, -1)
      + fog(72, 0.4, '#a8c4a8', 6)
      + tree(8, 90, 76, 8, '#22261c', '#0e100c', '#3a4e28', 3) + tree(150, 90, 82, -6, '#262a1e', '#0e100c', '#3a4e28', 7)
      + pads([[24, 84, 2.6], [36, 88, 2.2], [126, 84, 3], [140, 88, 2.4], [92, 88, 2]]) + reeds(20, 90, 8, 11, '#2a3a1e') + reeds(136, 90, 9, 12, '#2a3a1e')
      + motes(18, 2, '#9aff8a', 0.75, 24, 84) + fog(86, 0.3, '#a8c4a8', 7),

    // 3 · Gnarltree Hollow: the great gnarltree, its trunk wide as a house
    // and split by a glowing hollow, roots arching over the water. Savage
    // Opress stands on the roots with his saber pike lit, two acolytes at his
    // side; fireflies, moss curtains, and mist on the water.
    gnarltree_hollow: () => fill([[0, '#2a3a34'], [0.5, '#4a5a48'], [1, '#2a3a2c']])
      + treeline(60, '#5a6a58', 0.4, 3) + fog(52, 0.3, '#b8c8b0', 8)
      + P('M50 72 C48 50 52 30 46 0 L114 0 C108 30 112 50 110 72Z', '#3a3a2a') + P('M84 72 C84 50 90 30 86 0 L114 0 C108 30 112 50 110 72Z', '#22241a', 'opacity=".7"')
      + [0, 1, 2, 3, 4, 5, 6].map((k) => P(`M${54 + k * 8} 70 C${55 + k * 8} 50 ${51 + k * 8} 30 ${54 + k * 8} 0`, 'none', 'stroke="#22241a" stroke-width=".6" opacity=".7"')).join('')
      + [[60, 20, 3, 4.4], [100, 14, 2.6, 3.8], [98, 44, 2.2, 3], [58, 50, 2.6, 3.4]].map(([kx, ky, rx, ry]) => E(kx, ky, rx, ry, '#1a1c12') + E(kx, ky, rx, ry, 'none', 'stroke="#4a4a36" stroke-width=".6"')).join('') + P('M50 40 C54 36 56 30 54 24 M108 30 C104 26 104 20 106 14', 'none', 'stroke="#4a4a36" stroke-width=".8"')
      + P('M70 66 C66 52 72 36 80 32 C88 36 94 52 90 66Z', '#0e140e') + (() => { const [hg, hd] = LG([[0, '#6aff9a', 0.25], [1, '#0e140e', 0]], 0, 1, 0, 0); return hd + P('M70 66 C66 52 72 36 80 32 C88 36 94 52 90 66Z', hg); })() + P('M70 66 C66 52 72 36 80 32 C88 36 94 52 90 66', 'none', 'stroke="#5a5a40" stroke-width="1.4"')
      + [[-1, 30], [-1, 18], [1, 20], [1, 34], [-1, 44], [1, 46]].map(([sd, dy], k) => P(`M${80 + sd * 26} ${72 - dy * 0.4} C${80 + sd * (34 + k)} ${70 - dy * 0.2} ${80 + sd * (40 + k * 3)} ${74} ${80 + sd * (44 + k * 4)} ${76 + (k % 2) * 2}`, 'none', 'stroke="#3a3a2a" stroke-width="3.4" stroke-linecap="round"')).join('')
      + [[46, 6, -1], [114, 4, 1], [50, 18, -1], [112, 16, 1]].map(([bx, by, sd]) => P(`M${bx} ${by} Q${bx + sd * 20} ${by - 6} ${bx + sd * 40} ${by + 4}`, 'none', 'stroke="#3a3a2a" stroke-width="4"') + Array.from({ length: 7 }, (_, m) => P(`M${bx + sd * (6 + m * 5)} ${by - 2 + m * 0.3} q.4 6 0 ${10 + (m % 3) * 5}`, 'none', 'stroke="#5a6e3a" stroke-width=".6" opacity=".85"')).join('')).join('')
      + bog(74, '#3a4a38', '#0e160e', 3)
      + refl(74, savage(80, 72, 2.4, 1) + sister(50, 73, 2.1, 1, false) + sister(112, 73, 2.1, -1, false), 0.2)
      + savage(80, 72, 2.4, 1) + sister(50, 73, 2.1, 1, false) + sister(112, 73, 2.1, -1, false)
      + fog(76, 0.35, '#b8c8b0', 9) + tree(6, 92, 70, 6, '#262a1e', '#0e100c', '#4a5e30', 8) + tree(156, 92, 66, -6, '#262a1e', '#0e100c', '#4a5e30', 9)
      + pads([[30, 84, 2.4], [130, 86, 2.8], [44, 88, 2]]) + reeds(18, 90, 8, 11) + reeds(144, 90, 8, 11) + motes(22, 3, '#e8ff9a', 0.8, 16, 80),

    // 4 · Yoda's Test: Yoda's hut by the water at dusk, windows glowing warm
    // and smoke curling from the chimney; the X-wing rising out of the bog
    // streaming water as Yoda raises his hand, Grogu at his side lifting a
    // stone of his own, R2-D2 watching. Roots, lanterns, fireflies.
    yodas_test: () => fill([[0, '#3a4448'], [0.5, '#6a7464'], [1, '#4a5a44']])
      + E(40, 20, 34, 12, '#e8d8a8', 'opacity=".18"')
      + treeline(58, '#4a5a4a', 0.5, 4) + fog(54, 0.3, '#c8d0b8', 10) + treeline(64, '#2e3a2a', 0.8, 9)
      + bog(66, '#4a5a44', '#141c14', 4)
      + E(112, 70, 24, 3, '#c8d8c8', 'opacity=".25"') + [0, 1, 2, 3, 4, 5, 6, 7].map((k) => P(`M${100 + k * 3.2} ${54 + (k % 3)} q${(k % 2) * 0.6 - 0.3} 6 0 ${12 + (k % 3) * 3}`, 'none', 'stroke="#b8d0d8" stroke-width=".4" opacity=".7"')).join('')
      + xwing(112, 46, 1.55, -8, false, false) + E(110, 69, 18, 2, '#e8f0f0', 'opacity=".3"') + [[98, 68], [122, 68], [110, 66]].map(([px, py]) => P(`M${px - 3} ${py} Q${px} ${py - 2} ${px + 3} ${py}`, 'none', 'stroke="#e8f0f0" stroke-width=".5" opacity=".6"')).join('')
      + glow(112, 46, 10, '#cfe8ff', 0.08)
      + hut(30, 70, 1.6) + C(60, 62, 0.9, '#ffb04a') + glow(60, 62, 0.9, '#ffb04a', 0.4) + L(60, 61, 60, 58, '#3a3020', 0.3)
      + P('M0 74 C24 70 60 70 90 74 C96 76 100 80 104 90 L0 90Z', '#3a3826') + P('M0 74 C24 70 60 70 90 74 C96 76 100 80 104 90', 'none', 'stroke="#5a5a3a" stroke-width=".6"') + P('M30 74 C40 76 56 76 70 80 L72 82', 'none', 'stroke="#2a2a1a" stroke-width="2.2" stroke-linecap="round"')
      + yoda(64, 80, 2.8, 1) + grogu(88, 82, 2.6, 1) + glow(95.5, 69.6, 0.8, '#cfe8ff', 0.5) + P('M94.6 70 L95.6 69.2 L96.6 69.8 L96.2 70.8 L95 70.8Z', '#6a6a5a', 'stroke="#3a3a2a" stroke-width=".2"') + r2(46, 80, 2.2, 1)
      + tree(150, 92, 74, -6, '#2a2c20', '#121410', '#4a5e30', 10) + pads([[96, 84, 2.6], [130, 86, 2.2], [112, 88, 3]]) + reeds(140, 90, 8, 10) + motes(16, 4, '#ffe8a0', 0.8, 30, 80),

    // 5 · Bog Ambush: night in the bog. Asajj Ventress drops from a
    // branch, both red sabers crossed overhead, water bursting up below
    // her; acolytes rise from the reeds with bows drawn, the red light
    // catching the water and the tree trunks.
    bog_ambush: () => fill([[0, '#141c1c'], [0.5, '#24302a'], [1, '#18221c']])
      + C(130, 14, 5, '#d8e0c8', 'opacity=".5"') + E(130, 14, 14, 5, '#d8e0c8', 'opacity=".1"')
      + treeline(60, '#34423a', 0.6, 5) + fog(56, 0.25, '#8aa494', 11) + treeline(66, '#1e2820', 0.9, 11)
      + bog(68, '#22302a', '#060a08', 5) + E(80, 74, 26, 4, '#ff3a2a', 'opacity=".08"')
      + P('M60 20 Q90 12 130 22', 'none', 'stroke="#262a1e" stroke-width="3.4"') + Array.from({ length: 8 }, (_, m) => P(`M${66 + m * 8} ${18 - (m % 3) * 0.4} q.4 5 0 ${8 + (m % 3) * 4}`, 'none', 'stroke="#3a4e28" stroke-width=".5" opacity=".8"')).join('')
      + refl(68, ventress(80, 52, 2.8, 1, 1) + sister(40, 70, 2.3, 1) + sister(122, 70, 2.3, -1), 0.2)
      + glow(80, 30, 8, '#ff3a2a', 0.12) + ventress(80, 52, 2.8, 1, 1)
      + P('M70 68 L72 60 L74 66 L77 56 L80 66 L83 57 L86 66 L88 61 L90 68Z', '#a8c8c0', 'opacity=".5"') + [[72, 58], [78, 54], [86, 55], [90, 60], [68, 62]].map(([px, py]) => C(px, py, 0.5, '#c8e0d8', 'opacity=".7"')).join('') + E(80, 68, 12, 1.6, '#c8e0d8', 'opacity=".35"')
      + sister(40, 70, 2.3, 1) + sister(122, 70, 2.3, -1) + reeds(40, 72, 10, 9, '#22301a') + reeds(122, 72, 10, 9, '#22301a')
      + tree(8, 90, 84, 6, '#1e2218', '#0a0c08', '#34482a', 11) + tree(154, 92, 76, -6, '#1e2218', '#0a0c08', '#34482a', 12) + P('M14 30 L18 70 M146 34 L142 70', 'none', 'stroke="#ff3a2a" stroke-width=".5" opacity=".25"')
      + pads([[24, 84, 2.4], [60, 86, 2.6], [104, 86, 2.4], [136, 84, 2.2]]) + fog(84, 0.25, '#8aa494', 12) + motes(10, 5, '#c8ff8a', 0.6, 20, 84),

    // 6 · Orbital Blockade (fleet): Dagobah from space, green and wrapped in
    // swirling cloud; a Star Destroyer holds the blockade while TIE
    // Interceptors dive in formation on an X-wing breaking for the planet.
    orbital_blockade: () => R(0, 0, 160, 90, '#03060a') + starfield(80, 6)
      + (() => { const [gr, d] = LG([[0, '#8aa870'], [0.5, '#4a6a40'], [1, '#14241a']], 0, 0, 1, 1); return d + C(30, 104, 64, gr); })()
      + `<clipPath id="dg-pl"><circle cx="30" cy="104" r="64"/></clipPath><g clip-path="url(#dg-pl)">${Array.from({ length: 16 }, (_, k) => { const cx = -24 + ((k * 37) % 110); const cy = 44 + ((k * 23) % 50); return E(cx, cy, 6 + (k % 4) * 3, 1.6 + (k % 3), k % 3 === 0 ? '#2a4a2a' : '#e0ecd8', `opacity="${k % 3 === 0 ? 0.5 : 0.35}" transform="rotate(${-12 + (k % 5) * 5} ${cx} ${cy})"`); }).join('')}${Array.from({ length: 6 }, (_, k) => P(`M${-20 + k * 16} ${50 + k * 6} q6 -3 12 0 t12 0`, 'none', 'stroke="#f0f6e8" stroke-width=".8" opacity=".35"')).join('')}</g>`
      + (() => { const [sh, sd] = LG([[0, '#000', 0], [1, '#000', 0.6]], 0, 0, 1, 1); return sd + C(30, 104, 64, sh); })() + C(30, 104, 64, 'none', 'stroke="#b8e0a8" stroke-width="1.6" opacity=".35"') + C(30, 104, 66, 'none', 'stroke="#8ad0a8" stroke-width="1" opacity=".15"')
      + (kit.isd ? kit.isd(122, 22, 2.1, '#7a828c') + kit.isd(152, 48, 0.9, '#5a626c') : '')
      + (() => { const t1 = tieGuns(108, 52, 1.2, -6); const t2 = tieGuns(124, 64, 1, -6); const t3 = tieGuns(96, 68, 0.9, -6); return shots(t1[2], [38, 66], [0.08, 0.38, 0.66]) + shots(t1[3], [44, 74], [0.2, 0.52, 0.8]) + shots(t2[2], [42, 60], [0.14, 0.46, 0.74]) + shots(t3[2], [36, 70], [0.1, 0.44, 0.72]) + shots(t3[3], [40, 80], [0.24, 0.58]); })()
      + interceptor(108, 52, 1.2, -6, true) + interceptor(124, 64, 1, -6, true) + interceptor(96, 68, 0.9, -6, true)
      + `<g transform="translate(116 0) scale(-1 1)">${xwing(78, 70, 1.3, 16, false, true)}</g>`,

    // 7 · Brothers of Dathomir: the swamp turns crimson. Ancient Nightsister
    // ruins rise from the water, stone arches and standing stones carved
    // with green-glowing sigils; Savage and Ventress stand together ready to
    // fight, an acolyte behind; red mist and blood-red sky through the trees.
    brothers_of_dathomir: () => fill([[0, '#3a1418'], [0.5, '#7a2a24'], [0.8, '#a8483a'], [1, '#4a1e1a']])
      + C(120, 30, 10, '#ffb08a', 'opacity=".35"') + C(120, 30, 6, '#ffd8b8', 'opacity=".5"')
      + treeline(58, '#4a1e1e', 0.6, 7) + fog(54, 0.3, '#d88a7a', 13)
      + [[26, 66, 13, 36], [134, 66, 14, 40]].map(([x, y, w, h]) => P(`M${x - w} ${y} L${x - w} ${y - h * 0.6} C${x - w} ${y - h} ${x + w} ${y - h} ${x + w} ${y - h * 0.6} L${x + w} ${y} L${x + w * 0.6} ${y} L${x + w * 0.6} ${y - h * 0.6} C${x + w * 0.6} ${y - h * 0.84} ${x - w * 0.6} ${y - h * 0.84} ${x - w * 0.6} ${y - h * 0.6} L${x - w * 0.6} ${y}Z`, '#4a3a38', 'stroke="#2a1a1a" stroke-width=".4"') + P(`M${x - w * 0.8} ${y - h * 0.4} l2 1 M${x + w * 0.8} ${y - h * 0.5} l-2 1`, 'none', 'stroke="#7aff6a" stroke-width=".6" opacity=".8"') + C(x, y - h * 0.86, 1, '#7aff6a', 'opacity=".8"') + glow(x, y - h * 0.86, 1, '#7aff6a', 0.4)).join('')
      + [[54, 64, 4, 20], [104, 64, 3.6, 16], [70, 62, 2.6, 10]].map(([x, y, w, h]) => P(`M${x - w} ${y} L${x - w * 0.8} ${y - h} L${x} ${y - h - 2} L${x + w * 0.8} ${y - h} L${x + w} ${y}Z`, '#54403c', 'stroke="#2a1a1a" stroke-width=".4"') + P(`M${x - 1} ${y - h * 0.7} L${x} ${y - h * 0.5} L${x + 1} ${y - h * 0.7} M${x} ${y - h * 0.5} L${x} ${y - h * 0.3}`, 'none', 'stroke="#7aff6a" stroke-width=".5"') + glow(x, y - h * 0.5, 1.2, '#7aff6a', 0.25)).join('')
      + bog(66, '#4a2420', '#140808', 7) + E(80, 72, 40, 3, '#ff6a4a', 'opacity=".1"')
      + refl(68, savage(60, 70, 2.7, 1) + ventress(102, 70, 2.6, 1, 0), 0.22)
      + sister(82, 62, 1.5, 1, false) + savage(60, 70, 2.7, 1) + ventress(102, 70, 2.6, 1, 0)
      + fog(72, 0.35, '#c87060', 14) + tree(6, 92, 80, 6, '#2a1414', '#120808', '#5a2a1e', 13) + tree(156, 92, 76, -6, '#2a1414', '#120808', '#5a2a1e', 14)
      + reeds(22, 90, 9, 11, '#3a1a14') + reeds(140, 90, 9, 11, '#3a1a14') + motes(14, 7, '#ffb08a', 0.6, 20, 84),

    // 8 · Cave of Evil: the dark tree at the heart of the swamp, its black
    // roots knotted into the mouth of the cave. A snake winds along a branch,
    // vines and moss hang over the entrance, and inside, in the dark, Kylo
    // Ren waits with his crossguard saber crackling red; mist pools on the ground.
    cave_of_evil: () => fill([[0, '#101618'], [0.6, '#1e2a26'], [1, '#121a16']])
      + C(28, 14, 4, '#c8d0c0', 'opacity=".35"') + treeline(58, '#26322c', 0.7, 8) + fog(52, 0.25, '#7a8a80', 15)
      + [[54, 10, -1], [106, 12, 1], [60, 2, -1], [100, 4, 1]].map(([bx, by, sd], i) => P(`M${bx} ${by - 2} Q${bx + sd * 24} ${by - 10} ${bx + sd * 50} ${by - 4 + i * 2} Q${bx + sd * 24} ${by - 4} ${bx} ${by + 3}Z`, '#16140e') + Array.from({ length: 8 }, (_, m) => P(`M${bx + sd * (6 + m * 5.4)} ${by - 4 + (m % 3) * 0.6} q.4 6 0 ${8 + (m * 5 % 4) * 4}`, 'none', 'stroke="#2e3e22" stroke-width=".55" opacity=".85"')).join('')).join('')
      + P('M2 90 C16 84 28 78 36 68 C44 56 48 40 54 26 C58 14 56 4 50 -2 L70 -2 C70 6 74 12 80 12 C86 12 90 6 90 -2 L112 -2 C104 6 102 14 106 26 C112 40 116 56 124 68 C132 78 144 84 158 90Z', '#16140e') + P('M80 12 C86 12 90 6 90 -2 L112 -2 C104 6 102 14 106 26 C112 40 116 56 124 68 C132 78 144 84 158 90 L112 90 C110 60 100 30 80 12Z', '#0a0a06', 'opacity=".7"')
      + [0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => P(`M${36 + k * 11} 90 C${40 + k * 10} 64 ${48 + k * 8} 36 ${56 + k * 6} 8`, 'none', 'stroke="#2a281e" stroke-width=".7" opacity=".7"')).join('')
      + [[60, 30, 3, 4], [98, 24, 2.6, 3.6], [42, 66, 3.4, 2.4], [120, 64, 3, 2.2], [104, 40, 2, 3]].map(([kx, ky, rx, ry]) => E(kx, ky, rx, ry, '#0a0a06') + E(kx, ky, rx, ry, 'none', 'stroke="#2a281e" stroke-width=".6"')).join('')
      + P('M50 84 C48 64 60 44 80 42 C100 44 112 64 110 84Z', '#000000')
      + `<clipPath id="dg-cave"><path d="M50 84 C48 64 60 44 80 42 C100 44 112 64 110 84Z"/></clipPath><g clip-path="url(#dg-cave)">`
      + (() => { const [cg, cd] = LG([[0, '#3a0604', 0.9], [0.55, '#140202', 0.6], [1, '#000', 0]], 0.5, 1, 0.5, 0); return cd + R(48, 40, 64, 46, cg); })()
      + P('M56 84 C58 70 62 60 70 54 M104 84 C102 70 98 60 90 54 M62 50 C70 46 90 46 98 50', 'none', 'stroke="#2a0806" stroke-width="2.4" opacity=".8"') + P('M58 80 C60 68 66 58 74 52 M102 80 C100 68 94 58 86 52', 'none', 'stroke="#5a1008" stroke-width=".5" opacity=".7"')
      + [[60, 60], [100, 58], [66, 72], [96, 74], [72, 50], [90, 50]].map(([px, py], k) => E(px, py, 6 + (k % 3) * 2, 1.6, '#2a0a10', 'opacity=".55"')).join('')
      + glow(88, 62, 10, '#ff2a10', 0.2) + kylo(76, 84, 1.95, 1, 48)
      + P('M70 80 L68.6 52 L72 46 L80 44 L88 46 L91.4 52 L90 80', 'none', 'stroke="#ff4a2a" stroke-width=".35" opacity=".0"')
      + E(80, 82, 18, 2.2, '#ff2a10', 'opacity=".22"') + P('M66 82 L74 82 M86 82 L96 82', 'none', 'stroke="#ff6a4a" stroke-width=".4" opacity=".5"')
      + Array.from({ length: 7 }, (_, k) => P(`M${48 + k * 10} 86 C${52 + k * 10} ${80 - (k % 3) * 2} ${58 + k * 10} ${84} ${62 + k * 10} ${78 - (k % 2) * 3}`, 'none', 'stroke="#0a0408" stroke-width="2.6" opacity=".7"')).join('')
      + `</g>`
      + [[-1, 0], [1, 0], [-1, 1], [1, 1], [-1, 2], [1, 2]].map(([sd, k]) => P(`M${80 + sd * (14 + k * 6)} ${44 + k * 4} q${sd * -1} ${4 + k} ${sd * 0.8} ${6 + k * 2} q${sd * -0.6} 2 ${sd * -1.6} 3`, 'none', 'stroke="#16140e" stroke-width="1.4" stroke-linecap="round"')).join('')
      + [[60, 86], [96, 88], [130, 84], [30, 86]].map(([px, py], k) => P(`M${px - 14} ${py} C${px - 6} ${py - 4 - k} ${px + 6} ${py - 4} ${px + 16} ${py - 1}`, 'none', 'stroke="#2a1a2a" stroke-width="2.4" opacity=".45"')).join('')
      + [[-1, 0], [1, 0], [-1, 1], [1, 1]].map(([sd, k]) => P(`M${80 + sd * (28 + k * 6)} ${84 - k * 20} C${80 + sd * (36 + k * 8)} ${86} ${80 + sd * (48 + k * 10)} ${82} ${80 + sd * (60 + k * 8)} ${88}`, 'none', 'stroke="#16140e" stroke-width="5" stroke-linecap="round"')).join('')
      + P('M50 84 C48 64 60 44 80 42 C100 44 112 64 110 84', 'none', 'stroke="#2a2a1e" stroke-width="2"')
      + Array.from({ length: 12 }, (_, m) => P(`M${54 + m * 4.6} ${44 + Math.abs(m - 5.5) * 2.4} q${(m % 2) * 0.8 - 0.4} 6 0 ${8 + (m * 7 % 5) * 2.6}`, 'none', 'stroke="#2e3e22" stroke-width=".6" opacity=".9"')).join('')
      + P('M96 30 C104 28 112 32 120 30', 'none', 'stroke="#16140e" stroke-width="2.6"') + P('M98 28.6 C102 26.6 106 30.6 110 28.6 C114 26.6 116 30 120 28', 'none', 'stroke="#4a5a2a" stroke-width="1.2" stroke-linecap="round"') + P('M98 28.6 C102 26.6 106 30.6 110 28.6 C114 26.6 116 30 120 28', 'none', 'stroke="#8a9a4a" stroke-width=".3" stroke-dasharray=".6 .6"') + E(97.4, 28.8, 1.2, 0.7, '#4a5a2a') + C(97, 28.6, 0.2, '#ffd23a') + P('M96.2 29 L95 29.4 M95 29.4 L94.6 29 M95 29.4 L94.6 29.8', 'none', 'stroke="#c83a2a" stroke-width=".15"')
      + E(80, 86, 70, 5, '#7a8a80', 'opacity=".25"') + fog(84, 0.4, '#8a9a90', 16) + motes(8, 8, '#c8ffaa', 0.5, 20, 70),

    // 9 · The Mother's Call: Mother Talzin's ritual in a ring of roots.
    // She stands raised above a cauldron of glowing green ichor with both
    // hands blazing, acolytes around her chanting with hands lifted, carved
    // totems at the edge, orbs of magick rising, green light through the mist.
    mothers_call: () => fill([[0, '#0e1a14'], [0.5, '#1e3426'], [1, '#0e1a12']])
      + treeline(60, '#22382a', 0.7, 9) + fog(52, 0.25, '#6aaa7a', 17)
      + P('M60 0 L70 70 L90 70 L100 0Z', '#6aff7a', 'opacity=".05"') + P('M70 0 L76 70 L84 70 L90 0Z', '#9aff9a', 'opacity=".06"')
      + [[22, 70, 3.4, 22], [138, 70, 3.4, 22], [40, 68, 2.4, 14], [120, 68, 2.4, 14]].map(([x, y, w, h]) => R(x - w, y - h, w * 2, h, '#3a2a22', 'stroke="#1a120e" stroke-width=".3"') + E(x, y - h, w * 1.2, w * 0.8, '#3a2a22', 'stroke="#1a120e" stroke-width=".3"') + C(x - w * 0.4, y - h, w * 0.25, '#7aff6a') + C(x + w * 0.4, y - h, w * 0.25, '#7aff6a') + P(`M${x - w * 0.6} ${y - h * 0.6} L${x + w * 0.6} ${y - h * 0.6} M${x - w * 0.6} ${y - h * 0.4} L${x + w * 0.6} ${y - h * 0.4} M${x} ${y - h * 0.7} L${x} ${y - h * 0.2}`, 'none', 'stroke="#7aff6a" stroke-width=".35" opacity=".7"')).join('')
      + P('M0 70 C40 66 120 66 160 70 L160 90 L0 90Z', '#1a2218') + P('M30 80 C50 72 110 72 130 80', 'none', 'stroke="#3a3a28" stroke-width="3" stroke-linecap="round"') + P('M20 86 C50 78 110 78 140 86', 'none', 'stroke="#2e2e20" stroke-width="3.6" stroke-linecap="round"')
      + P('M68 64 L92 64 L96 68 L64 68Z', '#3a3426', 'stroke="#1a1810" stroke-width=".3"') + talzin(80, 64, 2.4, 1)
      + E(80, 76, 10, 2.6, '#2a2620', 'stroke="#5a5a40" stroke-width=".5"') + P('M70 76 C70 84 90 84 90 76Z', '#2a2620', 'stroke="#5a5a40" stroke-width=".5"') + E(80, 76, 8.6, 1.8, '#6aff7a') + E(80, 75.8, 6, 1.1, '#d8ffd0', 'opacity=".8"') + glow(80, 74, 6, '#6aff7a', 0.3)
      + [[76, 70], [83, 66], [79, 60], [86, 56], [74, 54]].map(([px, py], k) => glow(px, py, 0.8 + (k % 2) * 0.3, '#6aff7a', 0.45) + C(px, py, 0.6, '#c8ffc0')).join('')
      + sister(54, 78, 1.8, 1, false) + sister(106, 78, 1.8, -1, false) + sister(34, 86, 2.1, 1, false) + sister(126, 86, 2.1, -1, false)
      + tree(4, 92, 80, 6, '#1e2618', '#0a0e08', '#2e4a26', 15) + tree(156, 92, 82, -6, '#1e2618', '#0a0e08', '#2e4a26', 16)
      + motes(22, 9, '#9aff8a', 0.8, 10, 80) + fog(86, 0.3, '#6aaa7a', 18),

    // 10 · Trial of the Force: the last battle under a storm. Lightning cuts
    // the sky and a vortex of green magick spirals above the great dark tree;
    // Mother Talzin stands on its roots, Kylo Ren and Ventress flanking her
    // with red sabers lit, acolytes in the water; everything reflected below.
    trial_of_the_force: () => fill([[0, '#0e1218'], [0.5, '#24302e'], [1, '#141c18']])
      + E(80, 14, 40, 10, '#3a4a44', 'opacity=".6"') + [0, 1, 2, 3].map((k) => E(80, 14, 30 - k * 7, 7 - k * 1.6, 'none', `stroke="#6aff7a" stroke-width="${1.4 - k * 0.25}" opacity="${0.25 + k * 0.1}"`)).join('') + C(80, 14, 2.4, '#c8ffc0', 'opacity=".7"') + glow(80, 14, 3, '#6aff7a', 0.4)
      + P('M80 16 C76 26 84 34 80 46', 'none', 'stroke="#6aff7a" stroke-width="2.6" opacity=".2"') + P('M80 16 C76 26 84 34 80 46', 'none', 'stroke="#d8ffd0" stroke-width=".6" opacity=".7"')
      + P('M24 0 L28 10 L24 14 L30 26 L27 30 L32 40', 'none', 'stroke="#d8e8ff" stroke-width=".9"') + P('M24 0 L28 10 L24 14 L30 26 L27 30 L32 40', 'none', 'stroke="#8ab0ff" stroke-width="2.4" opacity=".3"') + P('M136 0 L132 8 L136 12 L130 22', 'none', 'stroke="#d8e8ff" stroke-width=".7"') + P('M136 0 L132 8 L136 12 L130 22', 'none', 'stroke="#8ab0ff" stroke-width="2" opacity=".3"')
      + treeline(58, '#26322c', 0.7, 10) + fog(52, 0.25, '#7a9a8a', 19)
      + P('M54 68 C52 54 58 46 62 30 C64 20 70 14 80 14 C90 14 96 20 98 30 C102 46 108 54 106 68Z', '#16140e') + [0, 1, 2, 3].map((k) => P(`M${60 + k * 12} 68 C${62 + k * 12} 54 ${66 + k * 8} 40 ${70 + k * 6} 20`, 'none', 'stroke="#2a281e" stroke-width=".6" opacity=".7"')).join('')
      + [[-1, 0], [1, 0], [-1, 1], [1, 1]].map(([sd, k]) => P(`M${80 + sd * (20 + k * 4)} ${68 - k * 6} C${80 + sd * (30 + k * 6)} ${68} ${80 + sd * (40 + k * 8)} ${70} ${80 + sd * (50 + k * 6)} ${74}`, 'none', 'stroke="#16140e" stroke-width="4" stroke-linecap="round"')).join('')
      + bog(70, '#22302a', '#060a08', 10)
      + refl(70, talzin(80, 62, 2.2, 1) + kylo(50, 70, 2.3, 1, -14) + ventress(112, 70, 2.3, 1, 0), 0.22)
      + P('M66 62 L94 62 L98 66 L62 66Z', '#2a281e') + talzin(80, 62, 2.2, 1) + kylo(50, 70, 2.3, 1, -14) + ventress(112, 70, 2.3, 1, 0)
      + sister(24, 80, 2, 1) + sister(138, 80, 2, -1) + reeds(24, 82, 8, 8, '#22301a') + reeds(138, 82, 8, 8, '#22301a')
      + tree(4, 92, 84, 6, '#1a1e16', '#080a06', '#2e4226', 17) + tree(156, 92, 84, -6, '#1a1e16', '#080a06', '#2e4226', 18)
      + fog(82, 0.3, '#7a9a8a', 20) + motes(16, 10, '#9aff8a', 0.7, 16, 84),
  };
  Object.assign(SA.scenes, D);
  SA.worlds.dagobah = ['swamp_landing', 'mist_witches', 'gnarltree_hollow', 'yodas_test', 'bog_ambush', 'orbital_blockade', 'brothers_of_dathomir', 'cave_of_evil', 'mothers_call', 'trial_of_the_force'];
})(typeof window !== 'undefined' ? window : globalThis);
