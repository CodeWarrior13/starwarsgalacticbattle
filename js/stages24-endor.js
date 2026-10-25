// Update 2.4: the ten Endor stage scenes, for approval. Same 160x90 format
// as the worlds before: the shuttle coming down over the forest moon, the
// speeder bike chase through the giant trees, the Ewok village high in the
// canopy, the bunker approach, the droids carried to the village, the
// Imperial shuttle over the treetops, the log traps springing on a walker,
// the bunker guards, the space battle above the moon and the shield
// generator in its clearing. Drawn in full detail.
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
  const starfield = (n, seed) => Array.from({ length: n }, (_, k) => C(((k * 41 + seed * 11) % 160), ((k * 67 + seed * 5) % 90), (0.2 + (k % 3) * 0.15).toFixed(2), '#ffffff', `opacity="${(0.4 + (k % 4) * 0.15).toFixed(2)}"`)).join('');

  // ---------- The forest ----------
  // A giant Endor redwood: the tall trunk with deep vertical bark grooves, a
  // lit edge and a shadow edge, moss patches, and buttress roots at the foot.
  const redwood = (x, w, bottom = 90, c = '#6a3a24', d = '#3a1e12', lit = '#9a5a38', top = -4) => {
    let o = P(`M${x - w / 2} ${top} L${x + w / 2} ${top} L${x + w * 0.56} ${bottom - w * 0.6} C${x + w * 0.7} ${bottom - w * 0.2} ${x + w * 1.1} ${bottom - 1} ${x + w * 1.3} ${bottom} L${x - w * 1.3} ${bottom} C${x - w * 1.1} ${bottom - 1} ${x - w * 0.7} ${bottom - w * 0.2} ${x - w * 0.56} ${bottom - w * 0.6}Z`, c);
    o += P(`M${x + w * 0.12} ${top} L${x + w / 2} ${top} L${x + w * 0.56} ${bottom - w * 0.6} C${x + w * 0.7} ${bottom - w * 0.2} ${x + w * 1.1} ${bottom - 1} ${x + w * 1.3} ${bottom} L${x + w * 0.2} ${bottom}Z`, d, 'opacity=".6"');
    o += P(`M${x - w / 2 + 0.4} ${top} L${x - w * 0.56 + 0.4} ${bottom - w * 0.6}`, 'none', `stroke="${lit}" stroke-width="${(w * 0.08).toFixed(2)}" opacity=".7"`);
    const n = Math.max(3, Math.round(w / 1.6));
    for (let k = 1; k < n; k++) { const t = k / n; const gx = x - w / 2 + w * t; o += P(`M${gx.toFixed(1)} ${top} C${(gx + ((k % 3) - 1) * 0.6).toFixed(1)} ${(bottom * 0.35).toFixed(1)} ${(gx - ((k % 2) - 0.5) * 0.8).toFixed(1)} ${(bottom * 0.7).toFixed(1)} ${(gx + (t - 0.5) * w * 0.15).toFixed(1)} ${bottom - w * 0.4}`, 'none', `stroke="${d}" stroke-width="${(0.25 + (k % 2) * 0.2).toFixed(2)}" opacity=".75"`); }
    o += [0.3, 0.55, 0.78].map((t, k) => E(x - w * 0.2 + (k % 2) * w * 0.3, bottom * t, w * 0.14, w * 0.3, '#4a5a2a', 'opacity=".55"')).join('');
    return o;
  };
  // Ferns and undergrowth along the forest floor.
  const ferns = (y, n, seed = 0, c = '#3a5a2a', d = '#24401c') => Array.from({ length: n }, (_, k) => {
    const x = ((k * 29 + seed * 13) % 176) - 8; const h = 4 + ((k * 7 + seed) % 4) * 1.6; const lean = ((k % 3) - 1) * 1.6;
    return [-1, -0.4, 0.3, 1].map((sd, j) => { const tx = x + sd * h * 0.8 + lean; const ty = y - h * (0.6 + (j % 2) * 0.4); return P(`M${x} ${y} Q${x + sd * h * 0.3} ${ty + h * 0.2} ${tx} ${ty}`, 'none', `stroke="${j % 2 ? c : d}" stroke-width=".7" stroke-linecap="round"`) + Array.from({ length: 4 }, (_, m) => { const t = 0.3 + m * 0.18; const px = x + (tx - x) * t; const py = y + (ty - y) * t - Math.sin(t * Math.PI) * 1; return L(px, py, px + sd * 0.8, py - 0.7, c, 0.35); }).join(''); }).join('');
  }).join('');
  // Shafts of sunlight slanting down through the canopy.
  const shafts = (xs, a = 0.1) => xs.map((x, k) => P(`M${x} -2 L${x + 6 + (k % 2) * 3} -2 L${x + 26} 92 L${x + 14} 92Z`, '#fff4c8', `opacity="${a}"`)).join('');
  // Dense leafy canopy: dark clumps hanging from the top of the view.
  const canopy = (y = 10, c = '#1e3a1e', d = '#122812', seed = 0) => Array.from({ length: 14 }, (_, k) => { const x = ((k * 13 + seed * 7) % 172) - 6; const r = 6 + ((k * 5 + seed) % 4) * 2; return C(x, y - 4 + ((k * 3) % 5), r + 1, d) + C(x - 1, y - 5 + ((k * 3) % 5), r, c); }).join('') + R(-4, -4, 168, y - 2, '#122812');
  // Distant tree trunks in the blue haze.
  const hazeTrees = (c = '#4a5a54', a = 0.5, seed = 0) => `<g opacity="${a}">${Array.from({ length: 9 }, (_, k) => { const x = ((k * 19 + seed * 11) % 170) - 4; const w = 2 + (k % 3) * 1.2; return R(x - w / 2, 0, w, 90, c) + L(x - w / 4, 0, x - w / 4, 90, '#6a7a72', 0.3); }).join('')}</g>`;

  // Mid-distance trunks, half in the haze, with their own grooves.
  const midTrees = (xs, c = '#5a4a3e', a = 0.75) => `<g opacity="${a}">${xs.map(([x, w]) => redwood(x, w, 92, c, '#3a2e26', '#7a6a5a')).join('')}</g>`;
  // Forest-floor clutter: a mossy fallen log, rocks, mushrooms.
  const fallenLog = (x, y, len, a = 0) => `<g transform="translate(${x} ${y}) rotate(${a})">${R(-len / 2, -2.4, len, 4.8, '#5a3a24', 'rx="2.4" stroke="#2a160c" stroke-width=".3"')}${E(len / 2, 0, 1.6, 2.4, '#8a6040', 'stroke="#2a160c" stroke-width=".3"')}${E(len / 2, 0, 0.8, 1.2, '#6a4428')}${Array.from({ length: Math.floor(len / 3) }, (_, k) => L(-len / 2 + 2 + k * 3, -2.2, -len / 2 + 3 + k * 3, 2.2, '#3a2416', 0.25)).join('')}${E(-len * 0.1, -2.2, len * 0.25, 0.9, '#4a6a2a', 'opacity=".8"')}</g>`;
  const rocks = (pts) => pts.map(([x, y, r]) => E(x, y, r, r * 0.6, '#6a6e66', 'stroke="#3a3e36" stroke-width=".25"') + E(x - r * 0.3, y - r * 0.2, r * 0.4, r * 0.2, '#8a8e86', 'opacity=".6"') + E(x + r * 0.2, y - r * 0.45, r * 0.5, r * 0.15, '#4a6a2a', 'opacity=".7"')).join('');
  const shrooms = (pts) => pts.map(([x, y, s]) => L(x, y, x, y - 1.6 * s, '#e8dcc0', 0.5 * s) + E(x, y - 1.6 * s, 1.2 * s, 0.6 * s, '#c86a3a', 'stroke="#6a2a14" stroke-width=".15"') + C(x - 0.4 * s, y - 1.8 * s, 0.18 * s, '#f8f0e0')).join('');
  const vines = (xs) => xs.map((x, k) => P(`M${x} -2 q${(k % 2 ? 1 : -1) * 2} ${10 + (k % 3) * 4} 0 ${20 + (k % 3) * 8}`, 'none', 'stroke="#3a5a2a" stroke-width=".6" opacity=".8"') + Array.from({ length: 4 }, (_, m) => E(x + (m % 2 ? 0.8 : -0.8), 4 + m * 5, 0.9, 0.5, '#4a7a34', 'opacity=".8"')).join('')).join('');
  // Where a ship's guns are once it is placed, scaled and turned.
  const gunsAt = (x, y, s, a, pts) => { const r = (a * Math.PI) / 180; return pts.map(([lx, ly]) => [+(x + s * (lx * Math.cos(r) - ly * Math.sin(r))).toFixed(1), +(y + s * (lx * Math.sin(r) + ly * Math.cos(r))).toFixed(1)]); };
  const TIEGUNS = [[8.6, -12.2], [8.6, 12.2], [-8.6, -12.2], [-8.6, 12.2]];
  const AWGUNS = [[1.4, -5.6], [1.4, 5.6]];
  // Short laser bolts in flight from a gun toward a target, at fractions ts of the way.
  const shots = ([x1, y1], [x2, y2], ts, len = 0.14, c = '#3aff6a') => ts.map((t) => { const ax = x1 + (x2 - x1) * t; const ay = y1 + (y2 - y1) * t; return bolt(+ax.toFixed(1), +ay.toFixed(1), +(ax + (x2 - x1) * len).toFixed(1), +(ay + (y2 - y1) * len).toFixed(1), c); }).join('');

  // ---------- People ----------
  // A scout trooper: black under-suit, white chest and back armour, belt
  // with pouches, knee and shin plates, the helmet with its wide flat brim,
  // black visor lenses and snout, and a blaster pistol.
  const scout = (x, y, s, f = 1, aim = true) => g(x, y, s, f,
    E(0, 0.2, 3, 0.5, '#000', 'opacity=".25"')
    + P('M-2 -5 L-2.2 0 L-0.4 0 L-0.3 -5Z M0.3 -5 L0.4 0 L2.2 0 L2 -5Z', '#16161a') + R(-2.4, -1.5, 2.1, 1.6, '#e8eaec', 'rx=".4" stroke="#3a3a40" stroke-width=".1"') + R(0.3, -1.5, 2.1, 1.6, '#e8eaec', 'rx=".4" stroke="#3a3a40" stroke-width=".1"') + L(-2.2, -0.6, -0.4, -0.6, '#a8aeb6', 0.1) + L(0.4, -0.6, 2.2, -0.6, '#a8aeb6', 0.1)
    + R(-2.1, -3.8, 1.6, 2.2, '#f2f4f6', 'rx=".3" stroke="#3a3a40" stroke-width=".1"') + R(0.5, -3.8, 1.6, 2.2, '#f2f4f6', 'rx=".3" stroke="#3a3a40" stroke-width=".1"') + E(-1.3, -4.2, 0.75, 0.5, '#f2f4f6', 'stroke="#3a3a40" stroke-width=".1"') + E(1.3, -4.2, 0.75, 0.5, '#f2f4f6', 'stroke="#3a3a40" stroke-width=".1"') + L(-1.3, -4.6, -1.3, -3.8, '#a8aeb6', 0.1) + L(1.3, -4.6, 1.3, -3.8, '#a8aeb6', 0.1)
    + R(-2.5, -6, 5, 0.8, '#2a2a30') + [-2, -1, 0].map((bx) => R(bx, -6.1, 0.85, 0.85, '#4a4a52', 'stroke="#1a1a1e" stroke-width=".08"')).join('') + R(1.5, -5.6, 1, 2, '#1a1a1e', 'rx=".2"') + R(1.7, -5.2, 0.6, 1.2, '#3a3a40')
    + P('M-2.4 -6 L-2.6 -9.6 L2.6 -9.6 L2.4 -6Z', '#16161a') + P('M-2 -6.6 L-2.2 -9.4 L2.2 -9.4 L2 -6.6Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".12"') + P('M-1.4 -8.6 L1.4 -8.6 M0 -9.3 L0 -6.8 M-1.6 -7.4 L1.6 -7.4', 'none', 'stroke="#a8aeb6" stroke-width=".1"') + R(-0.8, -8.3, 1.6, 0.8, '#2a2a30', 'rx=".15"') + [-0.4, 0, 0.4].map((px, k) => R(px - 0.1, -8.15, 0.2, 0.4, ['#ff3a2a', '#3aff6a', '#ffcf3a'][k])).join('')
    + E(-2.7, -9.2, 0.95, 0.75, '#f2f4f6', 'stroke="#3a3a40" stroke-width=".1"') + E(2.7, -9.2, 0.95, 0.75, '#f2f4f6', 'stroke="#3a3a40" stroke-width=".1"')
    + R(-0.5, -10.4, 1, 0.8, '#16161a')
    + P('M-1.7 -11.6 C-1.8 -13.6 1.8 -13.6 1.7 -11.6 L1.8 -11 L-1.8 -11Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".15"') + P('M-1.6 -12.4 Q0 -12.9 1.6 -12.4', 'none', 'stroke="#a8aeb6" stroke-width=".1"') + E(-1.75, -11.6, 0.35, 0.5, '#d8dce0', 'stroke="#3a3a40" stroke-width=".08"') + E(1.75, -11.6, 0.35, 0.5, '#d8dce0', 'stroke="#3a3a40" stroke-width=".08"')
    + P('M-2.5 -11.25 L2.5 -11.25 L2.3 -10.7 L-2.3 -10.7Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".12"') + [-1.6, -1, 1, 1.6].map((px) => L(px, -11.2, px, -10.75, '#5a5a62', 0.08)).join('') + P('M-0.25 -10.7 L-1.25 -10.7 L-1.35 -10.05 L-0.4 -10.2Z M0.25 -10.7 L1.25 -10.7 L1.35 -10.05 L0.4 -10.2Z', '#101014') + P('M-0.3 -10.7 L0.3 -10.7 L0.22 -9.7 L-0.22 -9.7Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".06"') + L(-0.15, -10.05, 0.15, -10.05, '#3a3a40', 0.08) + R(-0.12, -13.4, 0.24, 1.6, '#3a3a40')
    + (aim ? P('M2.2 -9.2 L3.6 -8.2 L3.3 -7.7 L2 -8.4Z', '#16161a') + C(3.7, -7.8, 0.42, '#16161a') + R(3.4, -8.4, 2.8, 0.7, '#1a1a1e') + R(3.4, -8, 0.7, 1.1, '#1a1a1e') + R(4.2, -8.8, 1.2, 0.4, '#3a3a40')
      : L(2.4, -8.8, 2.8, -6.2, '#16161a', 0.8) + C(2.8, -6, 0.38, '#16161a')));
  // A scout trooper seated on a speeder bike, leaning into the ride: thighs
  // forward, boots on the foot pegs, arms out to the handlebars, head low.
  const scoutRider = () =>
    P('M-1.4 -0.4 L2.4 -0.6 L3.6 2.6 L2.8 3 L1.8 0.8 L-1.4 0.8Z', '#16161a') + R(2.6, 2.4, 1.8, 1.2, '#e8eaec', 'rx=".3" stroke="#3a3a40" stroke-width=".1"') + E(1.8, -0.1, 1.1, 0.8, '#f2f4f6', 'stroke="#3a3a40" stroke-width=".1"')
    + `<g transform="rotate(28 -1 0)">${R(-2.2, -5.6, 4, 5, '#16161a')}${P('M-1.8 -5.2 L-2 -1.8 L1.6 -1.8 L1.4 -5.2Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".12"')}${R(-0.6, -4.4, 1.2, 0.7, '#2a2a30')}${R(-2.4, -1, 4.4, 0.7, '#2a2a30')}${E(-2.1, -5.4, 0.8, 0.6, '#f2f4f6', 'stroke="#3a3a40" stroke-width=".1"')}${R(-0.45, -6.4, 0.9, 0.8, '#16161a')}${P('M-1.6 -7.4 C-1.7 -9.2 1.6 -9.2 1.6 -7.4 L1.7 -6.9 L-1.7 -6.9Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".12"')}${P('M-2.3 -7.1 L2.3 -7.1 L2.1 -6.6 L-2.1 -6.6Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".1"')}${P('M0.2 -6.6 L1.2 -6.6 L1.3 -6 L0.4 -6.1Z', '#101014')}${P('M1.2 -6.6 L1.9 -6.6 L1.8 -5.8 L1.4 -5.8Z', '#f4f6f8')}</g>`
    + P('M0.6 -3.6 L4.6 -1.6 L5.2 -2.2 L1.4 -4.4Z', '#16161a') + C(5.2, -1.9, 0.45, '#16161a');
  // A 74-Z speeder bike, side-on facing right, in Imperial light grey: the
  // long twin steering rods with their vanes out front, the slim body with
  // its saddle and control panel, the engine block with exhaust fins at the
  // back, foot pegs, the blaster cannon underneath, and its rider.
  const speederBike = (x, y, s, f = 1, rider = true) => g(x, y, s, f,
    E(1, 5, 9, 0.8, '#000', 'opacity=".2"')
    + R(4.6, -2.2, 9.4, 0.55, '#8a9098', 'stroke="#3a3e46" stroke-width=".1"') + R(4.6, -0.4, 9.4, 0.55, '#7a8088', 'stroke="#3a3e46" stroke-width=".1"') + P('M12.6 -3.4 L15.4 -3.9 L15.4 -2 L12.6 -1.6Z M12.6 -1 L15.4 -1.5 L15.4 0.4 L12.6 0.6Z', '#a8aeb6', 'stroke="#3a3e46" stroke-width=".15"') + L(13.2, -3.2, 13.2, 0.4, '#5a6068', 0.2)
    + P('M-7 -2 L4.6 -2.8 L7 -1.6 L4.6 0.6 L-6.6 1 L-8.4 -0.4Z', '#b8bec6', 'stroke="#3a3e46" stroke-width=".3"') + P('M-7 -2 L4.6 -2.8 L7 -1.6 L-6.8 -0.8Z', '#e0e4e8', 'opacity=".6"') + L(-6, 0.2, 5, -0.2, '#7a8088', 0.2) + [-4, -1, 2].map((px) => L(px, -2.4, px, 0.8, '#8a9098', 0.15)).join('')
    + R(-8.6, -2.2, 2.6, 3.6, '#7a8088', 'rx=".5" stroke="#3a3e46" stroke-width=".2"') + [-1.4, -0.2, 1].map((yy) => R(-9.8, yy - 0.3, 1.4, 0.5, '#5a6068')).join('') + glow(-9.6, -0.4, 0.9, '#ffb070', 0.5)
    + R(-1.6, -3.6, 4.2, 1.1, '#2a2a2e', 'rx=".5"') + R(3, -3.4, 1.4, 0.9, '#3a3e46') + R(3.2, -3.2, 0.9, 0.4, '#5ad8ff', 'opacity=".8"') + L(4, -3, 5.6, -4.2, '#2a2a2e', 0.4) + L(5.6, -4.2, 5.6, -3.4, '#2a2a2e', 0.3)
    + R(0.4, 0.8, 4.4, 0.7, '#3a3e46') + L(4.8, 1.15, 6.4, 1.15, '#2a2a2e', 0.35) + L(2.4, 0.8, 3.4, 2.8, '#5a6068', 0.3) + R(2.8, 2.6, 1.6, 0.4, '#5a6068')
    + (rider ? `<g transform="translate(0.2 -3.4)">${scoutRider()}</g>` : ''));
  // A death trooper: tall, all in black with a glossy sheen, the helmet with
  // its pale-green lens strip and the vertical grille, armour plates and a
  // heavy rifle.
  const deathTrooper = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 3.2, 0.5, '#000', 'opacity=".3"') + R(-2.1, -5.4, 1.8, 5.4, '#0e0e12', 'rx=".3"') + R(0.3, -5.4, 1.8, 5.4, '#0e0e12', 'rx=".3"') + R(-2.2, -3.6, 1.9, 1.6, '#1e1e24', 'rx=".3"') + R(0.3, -3.6, 1.9, 1.6, '#1e1e24', 'rx=".3"') + L(-1.4, -5.2, -1.4, -0.4, '#3a3a44', 0.15) + L(1.4, -5.2, 1.4, -0.4, '#3a3a44', 0.15)
    + R(-2.6, -6.4, 5.2, 1, '#1a1a20') + R(-0.6, -6.5, 1.2, 1.2, '#3a3a44')
    + P('M-2.8 -6.4 L-3 -10.6 C-2 -11.2 2 -11.2 3 -10.6 L2.8 -6.4Z', '#16161c', 'stroke="#000" stroke-width=".15"') + P('M-2.2 -10.4 L-2 -7.4 L0 -6.8 L2 -7.4 L2.2 -10.4', 'none', 'stroke="#3a3a46" stroke-width=".2"') + P('M-2.2 -10.4 L-1.6 -8', 'none', 'stroke="#5a5a6a" stroke-width=".3" opacity=".6"')
    + E(-3, -10.2, 1.1, 0.8, '#1e1e24') + E(3, -10.2, 1.1, 0.8, '#1e1e24')
    + P('M-1.8 -12 C-1.9 -14.6 1.9 -14.6 1.8 -12 L1.6 -11 L-1.6 -11Z', '#141418', 'stroke="#000" stroke-width=".15"') + P('M-1.5 -12.6 L1.5 -12.6 L1.4 -12.1 L-1.4 -12.1Z', '#8affc8', 'opacity=".55"') + glow(0, -12.35, 0.6, '#8affc8', 0.2) + [-0.4, 0, 0.4].map((px) => L(px, -11.9, px, -11.1, '#3a3a44', 0.12)).join('') + P('M-1.2 -13.8 Q0 -14.2 1.2 -13.8', 'none', 'stroke="#4a4a58" stroke-width=".25"')
    + L(2.6, -9.8, 3.8, -8.4, '#16161c', 0.9) + C(3.9, -8.3, 0.45, '#0e0e12') + R(0.6, -8.8, 6.6, 0.9, '#0a0a0e') + R(1.2, -9.4, 2.2, 0.6, '#2a2a30') + R(0.6, -8.4, 1, 1.6, '#0a0a0e') + L(7.2, -8.35, 8, -8.35, '#2a2a30', 0.4));
  // An Ewok: round and furry, the leather hood (in its own colour) with ear
  // bumps, big shiny black eyes, a snout, a little spear, bow or stone.
  const ewok = (x, y, s, f = 1, hood = '#c88a4a', fur = '#6a4428', weapon = 'spear') => g(x, y, s, f,
    E(0, 0.2, 2.6, 0.4, '#000', 'opacity=".25"') + E(-1, -0.4, 0.9, 0.5, '#3a2416') + E(1, -0.4, 0.9, 0.5, '#3a2416')
    + E(0, -2.8, 2.3, 2.6, fur, 'stroke="#3a2416" stroke-width=".18"') + E(0, -2.6, 1.4, 1.8, '#8a6040', 'opacity=".6"') + [[-1.8, -2], [1.8, -2], [-1, -4.4], [1.2, -4.2]].map(([px, py]) => P(`M${px} ${py} l.3 .5 l.3 -.5`, 'none', 'stroke="#3a2416" stroke-width=".18"')).join('')
    + E(0, -6, 2, 1.9, fur, 'stroke="#3a2416" stroke-width=".18"') + P('M-2.1 -5.6 C-2.4 -8.4 2.4 -8.4 2.1 -5.6 C1.6 -7 -1.6 -7 -2.1 -5.6Z', hood, 'stroke="#5a3a1a" stroke-width=".18"') + C(-1.5, -7.4, 0.55, hood) + C(1.5, -7.4, 0.55, hood) + P('M-2.1 -5.6 L-2.3 -4.6 M2.1 -5.6 L2.3 -4.6', 'none', `stroke="${hood}" stroke-width=".5"`)
    + E(-0.7, -6, 0.42, 0.48, '#0a0806') + E(0.7, -6, 0.42, 0.48, '#0a0806') + C(-0.6, -6.15, 0.12, '#ffffff') + C(0.8, -6.15, 0.12, '#ffffff') + E(0, -5.2, 0.7, 0.5, '#8a6040') + E(0, -5.35, 0.35, 0.22, '#1a1008') + P('M-0.3 -4.8 Q0 -4.65 0.3 -4.8', 'none', 'stroke="#2a1a10" stroke-width=".12"')
    + (weapon === 'spear' ? L(2, -3, 2.6, -10, '#8a6a3a', 0.35) + P('M2.4 -10 L2.9 -11.6 L3 -9.9Z', '#c8c8c0') + E(1.9, -3.4, 0.5, 0.45, fur)
      : weapon === 'bow' ? P('M2.6 -7 Q4.2 -4.4 2.6 -1.8', 'none', 'stroke="#8a6a3a" stroke-width=".35"') + L(2.6, -7, 2.6, -1.8, '#d8d0c0', 0.1) + L(1.4, -4.4, 4.4, -4.4, '#8a6a3a', 0.2) + E(1.6, -4.4, 0.5, 0.45, fur)
      : weapon === 'rock' ? E(1.8, -6.6, 0.5, 0.45, fur) + C(2.2, -7.4, 0.8, '#7a7a72', 'stroke="#4a4a44" stroke-width=".15"')
      : E(1.8, -3.4, 0.5, 0.45, fur)));
  // An AT-ST: the boxy head with its viewports, chin guns and side
  // launcher, the hip joint, and the two backward-kneed legs with toed feet.
  const atst = (x, y, s, f = 1, stride = 0) => g(x, y, s, f,
    E(0, 0.3, 7, 0.9, '#000', 'opacity=".25"')
    + [[-2, -1, '#5a5e66', '#3e424a'], [2, 1, '#6e727a', '#4a4e56']].map(([hx, ph, c, d]) => { const kx = hx - 3.4 + ph * stride; const fx = hx + ph * stride * 1.4; return P(`M${hx - 0.8} -14 L${kx - 0.8} -8 L${kx + 0.8} -8 L${hx + 0.8} -14Z`, c, 'stroke="#2a2e36" stroke-width=".2"') + P(`M${kx - 0.7} -8 L${fx - 0.6} -2.2 L${fx + 0.6} -2.2 L${kx + 0.7} -8Z`, c, 'stroke="#2a2e36" stroke-width=".2"') + L(hx - 0.2, -13, kx + 0.2, -9, d, 0.35) + L(kx, -7, fx, -3, d, 0.3) + C(kx, -8, 1, d, 'stroke="#2a2e36" stroke-width=".2"') + C(kx, -8, 0.4, '#8a8e96') + R(fx - 0.8, -3, 1.6, 2, d, 'stroke="#2a2e36" stroke-width=".15"') + P(`M${fx - 2.8} 0 L${fx - 1.4} -1.2 L${fx + 1.4} -1.2 L${fx + 3} 0 L${fx + 1.6} -0.1 L${fx + 0.4} -0.6 L${fx - 0.4} -0.6 L${fx - 1.4} -0.1Z`, c, 'stroke="#2a2e36" stroke-width=".2"'); }).join('')
    + R(-2.6, -15.8, 5.2, 2.6, '#5a5e66', 'stroke="#2a2e36" stroke-width=".25"') + C(0, -14.6, 1.3, '#4a4e56', 'stroke="#2a2e36" stroke-width=".2"') + [-1.6, 1.6].map((px) => L(px, -15.6, px * 0.6, -13.4, '#3a3e46', 0.3)).join('')
    + P('M-5.6 -16 L-5 -21.8 L4.4 -21.8 L6.4 -19.6 L6.6 -17.2 L5 -16Z', '#7a7e86', 'stroke="#2a2e36" stroke-width=".3"') + P('M-5 -21.8 L4.4 -21.8 L6.4 -19.6 L-5.2 -19.8Z', '#9a9ea6', 'opacity=".6"') + P('M-4 -21.8 L-3.4 -23 L2.8 -23 L3.4 -21.8Z', '#8a8e96', 'stroke="#2a2e36" stroke-width=".25"') + C(-0.2, -23.2, 0.7, '#7a7e86', 'stroke="#2a2e36" stroke-width=".15"')
    + [[-4, -20.8, 2.6], [-0.8, -20.8, 2.6], [2.4, -20.6, 2.4]].map(([px, py, w]) => R(px, py, w, 1.1, '#3a3e46') + R(px + 0.2, py + 0.2, w - 0.4, 0.7, '#14181e') + L(px + 0.4, py + 0.3, px + 1, py + 0.3, '#5a7aa8', 0.15)).join('') + P('M-4.8 -18.2 L5.8 -18.2', 'none', 'stroke="#5a5e66" stroke-width=".3"') + [-3.6, -2, -0.4, 1.2, 2.8, 4.4].map((px) => C(px, -17.2, 0.2, '#4a4e56')).join('') + P('M-5.4 -17 L-3 -16.4 M5.4 -17 L3 -16.4', 'none', 'stroke="#4a4e56" stroke-width=".25"')
    + R(5.4, -17.8, 3.6, 0.7, '#3a3e46') + R(5.4, -16.9, 3, 0.6, '#3a3e46') + C(9, -17.45, 0.3, '#2a2e36') + R(-1.6, -15.9, 3.2, 0.6, '#3a3e46') + R(-1.4, -15.4, 0.6, 1.6, '#2a2e36') + R(0.8, -15.4, 0.6, 1.6, '#2a2e36')
    + R(-7.6, -20.4, 2.4, 2.8, '#5a5e66', 'stroke="#2a2e36" stroke-width=".2"') + [[-6.9, -19.6], [-5.9, -19.6], [-6.9, -18.6], [-5.9, -18.6]].map(([px, py]) => C(px, py, 0.3, '#2a2e36')).join(''));
  // R2-D2 (shared) or a simple stand-in.
  const r2 = kit.r2 || ((x, y, s) => g(x, y, s, 1, R(-1.6, -5, 3.2, 4.6, '#f2f4f6') + P('M-1.7 -5 C-1.7 -7.2 1.7 -7.2 1.7 -5Z', '#d8dce2')));
  const threepio = kit.threepio || ((x, y, s) => g(x, y, s, 1, R(-1.6, -11, 3.2, 11, '#e8c050')));

  // C-3PO seated on the Ewoks' carved throne: gold head with glowing eyes,
  // the chest plate and the wires at his waist, one silver shin, hands on
  // the armrests; the throne's tall carved back with its horns and feathers.
  const throne3po = (x, y, s) => g(x, y, s, 1,
    P('M-4.4 0 L-4.4 -14 C-4.4 -16 -2.6 -17 0 -17 C2.6 -17 4.4 -16 4.4 -14 L4.4 0Z', '#7a5432', 'stroke="#3a2412" stroke-width=".3"') + P('M-3.6 -1 L-3.6 -13.4 C-3.6 -15.2 -2 -16 0 -16 C2 -16 3.6 -15.2 3.6 -13.4 L3.6 -1Z', '#8a6440') + [-2.4, 0, 2.4].map((px) => L(px, -15.4, px, -1, '#6a4428', 0.25)).join('') + [-4.4, 4.4].map((px) => P(`M${px} -15.6 C${px * 1.3} -18 ${px * 1.6} -19 ${px * 1.4} -21`, 'none', 'stroke="#d8c8a0" stroke-width=".7" stroke-linecap="round"')).join('') + P('M-1.4 -17 L-1 -20 M0 -17 L0 -20.6 M1.4 -17 L1 -20', 'none', 'stroke="#c84a3a" stroke-width=".5"') + C(0, -17.4, 0.7, '#e8c050')
    + P('M-5.4 -6 L5.4 -6 L5.4 -4.6 L-5.4 -4.6Z', '#6a4428', 'stroke="#3a2412" stroke-width=".25"')
    + P('M-1.4 -5.2 L-1.6 -1.2 L-0.2 -1.2 L-0.2 -5.2Z', '#e0b040', 'stroke="#8a6a20" stroke-width=".15"') + P('M0.4 -5.2 L0.4 -1.2 L1.8 -1.2 L1.6 -5.2Z', '#c8ccd2', 'stroke="#6a6e76" stroke-width=".15"') + R(-1.9, -1.4, 1.9, 0.8, '#c89a30') + R(0.2, -1.4, 1.9, 0.8, '#a8acb4')
    + P('M-1.8 -6 L-2 -4.6 L2 -4.6 L1.8 -6Z', '#e0b040') + R(-1.5, -7.6, 3, 1.6, '#4a4a4e') + [-0.8, 0, 0.8].map((px) => L(px, -7.6, px, -6, '#d04a2a', 0.22)).join('')
    + P('M-2 -11.2 L2 -11.2 L1.6 -7.6 L-1.6 -7.6Z', '#e8c050', 'stroke="#9a7020" stroke-width=".2"') + P('M-1.2 -10.8 L1.2 -10.8 L0.9 -8.8 L-0.9 -8.8Z', '#f4d870') + C(0, -9.8, 0.35, '#c89a30')
    + P('M-2 -10.6 L-3.2 -8 L-3.4 -6.2', 'none', 'stroke="#d8b040" stroke-width=".9" stroke-linecap="round"') + P('M2 -10.6 L3.2 -8 L3.4 -6.2', 'none', 'stroke="#d8b040" stroke-width=".9" stroke-linecap="round"') + C(-3.4, -6, 0.45, '#c89a30') + C(3.4, -6, 0.45, '#c89a30')
    + R(-0.5, -12.2, 1, 1, '#c8a038') + C(0, -13.6, 1.8, '#e8c050', 'stroke="#9a7020" stroke-width=".2"') + P('M-1.6 -13 L1.6 -13', 'none', 'stroke="#b88a28" stroke-width=".2"') + C(-0.65, -13.8, 0.4, '#fff0a0') + C(0.65, -13.8, 0.4, '#fff0a0') + glow(0, -13.8, 0.7, '#fff0a0', 0.3) + R(-0.5, -12.8, 1, 0.5, '#9a7020') + C(-0.9, -14.6, 0.35, '#ffffff', 'opacity=".4"'));

  // ---------- Machines ----------
  // A Lambda-class shuttle seen from the front: the tall dorsal wing, the two
  // lower wings angled down in flight, the cockpit nose with its windows,
  // the engine glow behind, panel lines and the Imperial grey.
  const lambda = (x, y, s, a = 0, landing = false) => g(x, y, s, 1,
    (landing ? [-3, 3].map((px) => L(px, 3, px * 1.3, 7, '#4a4e56', 0.6) + E(px * 1.3, 7, 1, 0.3, '#3a3e46')).join('') : '')
    + glow(-2.6, -0.6, 1.4, '#9fd8ff', 0.35) + glow(2.6, -0.6, 1.4, '#9fd8ff', 0.35)
    + P('M-1.5 -1.6 L-1.1 -18.4 L1.1 -18.4 L1.5 -1.6Z', '#c8ccd2', 'stroke="#4a4e56" stroke-width=".3"') + P('M0.2 -18.4 L1.1 -18.4 L1.5 -1.6 L0.4 -1.6Z', '#9aa0a8', 'opacity=".6"') + [-15, -12, -9, -6, -3.6].map((yy) => L(-1.3, yy, 1.3, yy, '#8a9098', 0.18)).join('') + P('M-1.1 -18.4 L1.1 -18.4 L0.9 -16.4 L-0.9 -16.4Z', '#e8ecf0') + R(-0.8, -11, 1.6, 1.2, '#7a8088')
    + [-1, 1].map((sd) => { const tx = sd * 14; const ty = landing ? -3 : 9; return P(`M${sd * 1.7} -0.4 L${tx} ${ty} L${tx - sd * 0.8} ${ty + 1.5} L${sd * 1.5} 2.6Z`, sd < 0 ? '#bcc0c8' : '#a8acb4', 'stroke="#4a4e56" stroke-width=".3"') + [0.25, 0.45, 0.65, 0.85].map((t) => L(sd * 1.6 + (tx - sd * 1.6) * t, -0.4 + (ty + 0.4) * t, sd * 1.5 + (tx - sd * 0.8 - sd * 1.5) * t, 2.6 + (ty + 1.5 - 2.6) * t, '#8a9098', 0.18)).join('') + L(sd * 2, 1, tx - sd * 0.6, ty + 0.6, '#8a9098', 0.2) + R(tx - 0.5, ty + 0.4, 1, 1.8, '#3a3e46') + C(tx, ty + 2.4, 0.3, '#1a1e24'); }).join('')
    + P('M-3.2 -2.2 L3.2 -2.2 L3.6 2 L2.2 4.8 L-2.2 4.8 L-3.6 2Z', '#d8dce2', 'stroke="#4a4e56" stroke-width=".3"') + P('M-3.2 -2.2 L3.2 -2.2 L3.4 0 L-3.4 0Z', '#e8ecf0', 'opacity=".7"') + P('M-2.1 1.2 L2.1 1.2 L1.7 3.5 L-1.7 3.5Z', '#14202e') + L(0, 1.2, 0, 3.5, '#d8dce2', 0.22) + L(-1.9, 2.3, 1.9, 2.3, '#d8dce2', 0.12) + P('M-1.7 1.6 L-0.6 1.4', 'none', 'stroke="#8ab0d0" stroke-width=".25"') + R(-2.5, -1.6, 5, 1, '#9aa0a8') + [-2, 2].map((px) => C(px, 4.6, 0.35, '#2a2e36') + L(px, 4.9, px, 5.6, '#2a2e36', 0.25)).join('') + [-3.2, 3.2].map((px) => R(px - 0.4, -1, 0.8, 2, '#7a8088')).join(''), a);
  // An A-wing from above: the red-and-white wedge, cockpit bubble, the two
  // big engines at the back with their glow, the wingtip cannons.
  const awing = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M9 0 L1 -2.4 L-3 -5.2 L-5.4 -5.2 L-4.6 -2 L-5 0 L-4.6 2 L-5.4 5.2 L-3 5.2 L1 2.4Z', '#ecebe6', 'stroke="#4a4840" stroke-width=".3"') + P('M9 0 L4 -1.4 L4 1.4Z', '#c8382a') + P('M1 -2.4 L-1.4 -3.8 L-1 -2 Z M1 2.4 L-1.4 3.8 L-1 2Z', '#c8382a') + P('M-3 -5.2 L-5.4 -5.2 L-5 -4 L-2.4 -4.2Z M-3 5.2 L-5.4 5.2 L-5 4 L-2.4 4.2Z', '#c8382a')
    + E(1.4, 0, 1.6, 0.9, '#1a2a3a', 'stroke="#4a4840" stroke-width=".2"') + P('M0.4 -0.4 L1.6 -0.6', 'none', 'stroke="#8ab0d0" stroke-width=".2"') + L(-2, -1.2, 6, -0.4, '#a8a69e', 0.15) + L(-2, 1.2, 6, 0.4, '#a8a69e', 0.15)
    + R(-7.4, -4.4, 3.4, 2.6, '#9a9a98', 'rx=".6" stroke="#4a4840" stroke-width=".2"') + R(-7.4, 1.8, 3.4, 2.6, '#9a9a98', 'rx=".6" stroke="#4a4840" stroke-width=".2"') + glow(-8, -3.1, 1, '#ff9a6a', 0.6) + glow(-8, 3.1, 1, '#ff9a6a', 0.6) + C(-7.6, -3.1, 0.6, '#ffd0a8') + C(-7.6, 3.1, 0.6, '#ffd0a8') + L(-3.6, -5.6, 1, -5.6, '#3a3a40', 0.35) + L(-3.6, 5.6, 1, 5.6, '#3a3a40', 0.35), a);
  // The second Death Star, half built and super detailed: the finished half
  // in shaded grey plating with latitude and longitude seams, city-like
  // surface blocks and lights, the equatorial trench and the superlaser dish
  // with its focus ring and eight emitters; the unfinished half a dark
  // skeleton of curved ribs and crossbeams behind a jagged edge of plating,
  // work lights scattered through it; the terminator shadow and a lit rim.
  const deathStar2 = (x, y, r) => {
    const id = `ds2c${Math.round(x)}${Math.round(y)}${Math.round(r)}`;
    const [dg, dd] = LG([[0, '#d0d8e0'], [0.5, '#8a929c'], [1, '#3a4048']], 0.15, 0.1, 0.95, 1);
    const [sg, sd] = LG([[0, '#000', 0], [0.55, '#000', 0.12], [1, '#000', 0.6]], 0.1, 0.1, 1, 0.95);
    const n = 16; const edge = Array.from({ length: n + 1 }, (_, k) => { const yy = y - r + (2 * r * k) / n; const w = Math.sqrt(Math.max(0, r * r - (yy - y) * (yy - y))); return [x + w * (0.02 + 0.2 * Math.sin(k * 1.9 + 0.6) + (k % 2) * 0.14), yy]; });
    const open = `M${edge.map((q) => q.map((v) => v.toFixed(2)).join(' ')).join(' L')} L${x + r * 1.2} ${y + r} L${x + r * 1.2} ${y - r}Z`;
    let o = C(x, y, r, dg);
    for (let k = 1; k < 14; k++) { const yy = y - r + (2 * r * k) / 14; const w = Math.sqrt(r * r - (yy - y) * (yy - y)); o += P(`M${(x - w).toFixed(2)} ${yy.toFixed(2)} Q${x} ${(yy + r * 0.07).toFixed(2)} ${(x + w).toFixed(2)} ${yy.toFixed(2)}`, 'none', 'stroke="#5a626c" stroke-width=".22" opacity=".7"'); }
    for (let k = 1; k < 7; k++) o += E(x, y, r * Math.sin((k / 7) * Math.PI), r, 'none', 'stroke="#5a626c" stroke-width=".18" opacity=".5"');
    for (let k = 0; k < 120; k++) { const px = x - r + (((k * 37) % 101) / 101) * 2 * r; const py = y - r + (((k * 61) % 103) / 103) * 2 * r; const q = r * (0.018 + (k % 3) * 0.01); o += R(px.toFixed(2), py.toFixed(2), (q * 1.8).toFixed(2), q.toFixed(2), k % 4 === 0 ? '#3e464e' : k % 4 === 1 ? '#b8c0c8' : '#7a828c', 'opacity=".7"'); if (k % 4 === 2) o += C(px.toFixed(2), py.toFixed(2), (r * 0.009).toFixed(2), '#fff4c8'); }
    o += P(`M${x - r} ${y} Q${x} ${y + r * 0.07} ${x + r} ${y}`, 'none', `stroke="#22282e" stroke-width="${(r * 0.035).toFixed(2)}"`) + P(`M${x - r} ${y - r * 0.025} Q${x} ${y + r * 0.045} ${x + r} ${y - r * 0.025}`, 'none', 'stroke="#c8d0d8" stroke-width=".2" opacity=".7"') + Array.from({ length: 16 }, (_, k) => C(x - r * 0.9 + k * r * 0.12, y + Math.sin(((k + 0.5) / 16) * Math.PI) * r * 0.035, (r * 0.008).toFixed(2), '#fff4c8')).join('');
    const dx = x - r * 0.38; const dy = y - r * 0.36; const dr = r * 0.25;
    o += C(dx, dy, dr * 1.08, '#9aa2ac', 'opacity=".6"') + C(dx, dy, dr, '#6a727c', 'stroke="#3a4048" stroke-width=".3"') + C(dx, dy, dr * 0.78, 'none', 'stroke="#4a525c" stroke-width=".25"') + C(dx, dy, dr * 0.55, '#5a626c', 'stroke="#3a4048" stroke-width=".25"') + Array.from({ length: 8 }, (_, k) => { const an = (k / 8) * Math.PI * 2; return C(dx + Math.cos(an) * dr * 0.66, dy + Math.sin(an) * dr * 0.66, dr * 0.07, '#3a4048') + L(dx + Math.cos(an) * dr * 0.55, dy + Math.sin(an) * dr * 0.55, dx + Math.cos(an) * dr * 0.2, dy + Math.sin(an) * dr * 0.2, '#4a525c', 0.15); }).join('') + C(dx, dy, dr * 0.18, '#3a4a44', 'stroke="#2a3038" stroke-width=".2"') + C(dx - dr * 0.05, dy - dr * 0.05, dr * 0.07, '#8affa8', 'opacity=".45"') + P(`M${dx - dr} ${dy} A${dr} ${dr} 0 0 1 ${dx} ${dy - dr}`, 'none', 'stroke="#e8eef4" stroke-width=".3" opacity=".7"');
    o += P(open, '#05070c');
    for (let k = 0; k < 7; k++) { const bx = x + r * (0.05 + k * 0.15); o += P(`M${bx} ${y - r} C${bx + r * 0.35} ${y - r * 0.4} ${bx + r * 0.35} ${y + r * 0.4} ${bx} ${y + r}`, 'none', `stroke="#5a626c" stroke-width="${k % 2 ? 0.22 : 0.35}"`); }
    for (let k = 1; k < 10; k++) { const yy = y - r + (2 * r * k) / 10; o += P(`M${x} ${yy} Q${x + r * 0.5} ${yy + r * 0.05} ${x + r} ${yy}`, 'none', 'stroke="#4a525c" stroke-width=".2"'); }
    for (let k = 0; k < 14; k++) { const ex = x + r * (0.15 + ((k * 31) % 70) / 100); const ey = y - r * 0.85 + ((k * 47) % 170) / 100 * r; o += C(ex, ey, (r * 0.012).toFixed(2), k % 3 ? '#ffb070' : '#fff4c8', 'opacity=".9"'); }
    o += C(x + r * 0.35, y, r * 0.18, '#ff8a4a', 'opacity=".07"') + edge.map(([ex, ey], k) => k % 2 ? R(ex - r * 0.04, ey - r * 0.04, r * 0.08, r * 0.08, '#7a828c') : '').join('') + P(`M${edge.map((q) => q.map((v) => v.toFixed(2)).join(' ')).join(' L')}`, 'none', 'stroke="#9aa2ac" stroke-width=".3"');
    o += sd + C(x, y, r, sg);
    return dd + `<clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath><g clip-path="url(#${id})">${o}</g>` + P(`M${x - r * 0.96} ${y - r * 0.28} A${r} ${r} 0 0 1 ${x + r * 0.28} ${y - r * 0.96}`, 'none', 'stroke="#f0f4f8" stroke-width=".5" opacity=".6"');
  };
  // The bunker entrance: the grey concrete block set into the hillside, the
  // armoured door with its lit frame, the vents, the antenna.
  const bunker = (x, y, s) => g(x, y, s, 1,
    P('M-34 0 C-28 -11 -16 -16 0 -16 C16 -16 28 -11 34 0Z', '#3a4a2a') + P('M-34 0 C-28 -11 -16 -16 0 -16 C-14 -14 -24 -8 -28 0Z', '#4a5a34', 'opacity=".7"')
    + P('M-14 0 L-14 -13 L14 -13 L14 0Z', '#7a8088', 'stroke="#3a4048" stroke-width=".4"') + P('M-14 -13 L14 -13 L12 -15.4 L-12 -15.4Z', '#9aa0a8', 'stroke="#3a4048" stroke-width=".3"') + P('M10 -13 L14 -13 L14 0 L10 0Z', '#5a6068', 'opacity=".5"') + [-10, -4, 4].map((px) => L(px, -13, px, 0, '#6a7078', 0.2)).join('') + [-9, -5].map((py) => L(-14, py, 14, py, '#6a7078', 0.15)).join('') + Array.from({ length: 12 }, (_, k) => C(-13 + k * 2.4, -12.4, 0.18, '#4a5058')).join('')
    + R(-7, -10, 14, 10, '#2a2e34', 'stroke="#5a6068" stroke-width=".5"') + R(-6.2, -9.2, 12.4, 9.2, '#3a3e46') + [-6.2, -3.1, 0, 3.1].map((px) => L(px, -9.2, px + 3.1, 0, '#2e3238', 0.15)).join('') + L(0, -9.2, 0, 0, '#22262c', 0.5) + Array.from({ length: 7 }, (_, k) => P(`M${-7 + k * 2} -10.6 l1 0 l-1 1.2 l-1 0Z`, '#ffcf3a')).join('') + R(-7, -10.8, 14, 0.4, '#1a1a1a') + [-2.6, 2.6].map((px) => R(px - 0.6, -6, 1.2, 0.6, '#ff3a2a') + glow(px, -5.7, 0.5, '#ff3a2a', 0.4)).join('')
    + [-12, 9].map((px) => R(px, -11, 2.4, 7, '#5a6068', 'stroke="#3a4048" stroke-width=".2"') + [-10, -8.6, -7.2, -5.8].map((py) => L(px + 0.3, py, px + 2.1, py, '#3a4048', 0.25)).join('')).join('')
    + [[11, -15.4, 9], [-11, -15.4, 6]].map(([ax, ay, h]) => L(ax, ay, ax, ay - h, '#5a6068', 0.5) + L(ax - 2, ay - h * 0.75, ax + 2, ay - h * 0.75, '#5a6068', 0.4) + L(ax - 1.4, ay - h * 0.5, ax + 1.4, ay - h * 0.5, '#5a6068', 0.3) + C(ax, ay - h - 0.4, 0.5, '#ff3a2a') + glow(ax, ay - h - 0.4, 0.6, '#ff3a2a', 0.4)).join('') + E(-5, -15.6, 2.4, 0.8, '#8a9098', 'stroke="#3a4048" stroke-width=".2"') + L(-5, -15.6, -4.4, -17.4, '#5a6068', 0.3)
    + [-17, -21, -25, 17, 21, 25].map((px) => P(`M${px} 0 q1 -4 0 -7 q-1 2 -2 0`, 'none', 'stroke="#2a3a1a" stroke-width=".7"')).join('') + [[-18, -4], [20, -3]].map(([px, py]) => E(px, py, 2.4, 1.2, '#6a6e66', 'stroke="#3a3e36" stroke-width=".2"')).join(''));
  // The shield generator: the big dish on its lattice tower above the trees,
  // with its support struts and the glowing core, the base buildings below.
  const shieldGen = (x, y, s) => g(x, y, s, 1,
    P('M-6 0 L-3 -40 L3 -40 L6 0Z', 'none', 'stroke="#5a6068" stroke-width=".8"') + Array.from({ length: 10 }, (_, k) => L(-6 + k * 0.3, -k * 4, 6 - k * 0.3, -(k + 1) * 4, '#5a6068', 0.4) + L(6 - k * 0.3, -k * 4, -6 + k * 0.3, -(k + 1) * 4, '#5a6068', 0.4)).join('')
    + `<g transform="rotate(-14 0 -46)">${E(0, -46, 20, 6, '#c8ccd2', 'stroke="#4a5058" stroke-width=".5"')}${E(0, -46.6, 16, 4.4, '#9aa0a8')}${Array.from({ length: 12 }, (_, k) => L(0, -46.6, Math.cos((k / 12) * Math.PI * 2) * 16, -46.6 + Math.sin((k / 12) * Math.PI * 2) * 4.4, '#7a8088', 0.3)).join('')}${L(0, -46.6, 0, -54, '#4a5058', 0.8)}${glow(0, -54, 1.4, '#9fd8ff', 0.6)}${L(-12, -44, 0, -54, '#5a6068', 0.3)}${L(12, -44, 0, -54, '#5a6068', 0.3)}</g>`
    + P('M-20 0 L-20 -6 L-8 -8 L8 -8 L20 -6 L20 0Z', '#7a8088', 'stroke="#3a4048" stroke-width=".4"') + [-16, -10, 10, 16].map((px) => R(px - 1.2, -5, 2.4, 1.6, '#ffd890', 'opacity=".7"')).join(''));

  const N = {
    // 1 · Forest Moon Landing (fleet): the shuttle comes down over Endor.
    // The endless green canopy under a hazy sky, the half-built Death Star
    // hanging huge above it; a detailed Lambda shuttle descends with its
    // wings folding, two TIE Interceptors escort it, and an A-wing far off
    // on the right fires on the nearer Interceptor.
    forest_moon_landing: () => fill([[0, '#3a5a7a'], [0.5, '#8ab0c8'], [0.8, '#c8dce0'], [1, '#e8f0e8']])
      + starfield(14, 1) + deathStar2(124, 24, 19)
      + [56, 64, 70, 76].map((y, k) => Array.from({ length: 18 }, (_, m) => { const x = ((m * 11 + k * 7) % 176) - 8; const r = 4 + ((m * 3 + k) % 4) * 1.4; return C(x, y + ((m * 5) % 4), r, ['#5a7a5a', '#4a6a44', '#3a5a34', '#2a4a26'][k]); }).join('')).join('') + E(80, 56, 90, 4, '#c8dce0', 'opacity=".4"')
      + lambda(64, 36, 1.6, 0, false)
      + (kit.interceptor ? kit.interceptor(30, 24, 0.8, -10) + kit.interceptor(96, 50, 0.7, 8) : '')
      + awing(146, 64, 0.9, 200) + (() => { const gA = gunsAt(146, 64, 0.9, 200, AWGUNS); return shots(gA[0], [100, 50], [0.18, 0.5], 0.12, '#ff4a2a') + shots(gA[1], [102, 54], [0.3, 0.62], 0.12, '#ff4a2a'); })()
      + Array.from({ length: 20 }, (_, m) => { const x = m * 9 - 4; const r = 5 + (m % 3) * 1.6; return C(x, 86 + (m % 2) * 2, r, '#1e3a1e'); }).join(''),

    // 2 · Speeder Chase: tearing through the forest. Giant redwoods flash by,
    // a second layer of trunks in the haze, shafts of sunlight, ferns,
    // mushrooms and a fallen log below; scout troopers ride their light-grey
    // speeder bikes low and fast between the trunks, one firing back.
    speeder_chase: () => fill([[0, '#5a7a6a'], [0.5, '#8aa890'], [1, '#3a5a3a']])
      + hazeTrees('#7a9a8a', 0.5, 1) + shafts([20, 70, 120], 0.12) + midTrees([[30, 6], [92, 7], [140, 5]], '#6a5a4e', 0.6)
      + redwood(50, 11, 90, '#5a3020', '#2a160c', '#8a5030') + redwood(120, 12, 90, '#5a3020', '#2a160c', '#8a5030') + vines([54, 116, 124])
      + P('M0 76 C40 72 120 72 160 76 L160 90 L0 90Z', '#2a3a1e') + fallenLog(84, 80, 26, -4) + rocks([[30, 82, 2.4], [140, 84, 3]]) + shrooms([[96, 80, 1], [100, 81, 0.8], [26, 84, 0.9]]) + ferns(80, 22, 2)
      + Array.from({ length: 10 }, (_, k) => L(128 + k * 2, 46 + k * 2.6, 160, 46 + k * 2.6, '#e8f0e0', 0.25)).join('')
      + speederBike(80, 50, 2.1, -1) + speederBike(112, 64, 2.5, -1) + speederBike(42, 64, 1.7, -1)
      + bolt(62, 42, 46, 40, '#ff4a2a') + bolt(84, 56, 56, 52, '#ff4a2a')
      + redwood(6, 16, 90, '#4a2818', '#22120a', '#7a4428') + redwood(156, 14, 90, '#4a2818', '#22120a', '#7a4428') + ferns(90, 16, 5, '#2a4a20', '#1a3214'),

    ewok_village: () => fill([[0, '#2a3a5a'], [0.5, '#7a6a7a'], [1, '#c8986a']])
      + hazeTrees('#3a4a4a', 0.6, 2) + redwood(28, 18, 90, '#5a3020', '#2a160c', '#8a5030') + redwood(124, 20, 90, '#5a3020', '#2a160c', '#8a5030') + redwood(78, 10, 90, '#4a2a1a', '#22120a', '#6a3a24')
      + [[28, 40, 20], [124, 34, 22], [78, 52, 14]].map(([x, y, w]) => P(`M${x - w} ${y} L${x + w} ${y} L${x + w - 2} ${y + 2.4} L${x - w + 2} ${y + 2.4}Z`, '#7a5a3a', 'stroke="#3a2416" stroke-width=".4"') + Array.from({ length: Math.round(w) }, (_, k) => L(x - w + k * 2, y, x - w + k * 2 + 1, y + 2.4, '#5a3a22', 0.2)).join('') + [-1, 1].map((sd) => L(x + sd * (w - 2), y + 2.4, x + sd * w * 0.3, y + 10, '#4a2a1a', 0.6)).join('')).join('')
      + [[14, 40, 7], [42, 40, 6], [110, 34, 7], [140, 34, 6], [70, 52, 5], [88, 52, 5]].map(([x, y, w]) => P(`M${x - w} ${y} L${x - w + 0.6} ${y - w * 0.9} L${x + w - 0.6} ${y - w * 0.9} L${x + w} ${y}Z`, '#8a6a42', 'stroke="#4a2e18" stroke-width=".3"') + P(`M${x - w - 1} ${y - w * 0.9} L${x} ${y - w * 2} L${x + w + 1} ${y - w * 0.9}Z`, '#a8885a', 'stroke="#5a3e22" stroke-width=".3"') + Array.from({ length: 5 }, (_, k) => L(x - w + k * w * 0.5, y - w * 0.9, x, y - w * 2, '#7a5a34', 0.2)).join('') + R(x - 1.2, y - w * 0.7, 2.4, w * 0.7, '#2a1a0e') + glow(x, y - w * 0.4, 1, '#ffb050', 0.4)).join('')
      + [[48, 40, 100, 34], [36, 40, 66, 52], [92, 52, 110, 36]].map(([x1, y1, x2, y2]) => P(`M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.max(y1, y2) + 6} ${x2} ${y2}`, 'none', 'stroke="#5a3a22" stroke-width=".6"') + P(`M${x1} ${y1 - 3} Q${(x1 + x2) / 2} ${Math.max(y1, y2) + 3} ${x2} ${y2 - 3}`, 'none', 'stroke="#5a3a22" stroke-width=".3"') + Array.from({ length: 10 }, (_, k) => { const t = k / 9; const bx = x1 + (x2 - x1) * t; const by = y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * 6; return L(bx, by, bx, by - 3, '#5a3a22', 0.2); }).join('')).join('')
      + [[20, 48], [134, 42], [60, 60], [100, 60]].map(([x, y]) => L(x, y - 6, x, y, '#3a2416', 0.2) + C(x, y, 1, '#ffb050') + glow(x, y, 1, '#ffb050', 0.5)).join('')
      + P('M0 74 L160 74 L160 80 L0 80Z', '#7a5a3a', 'stroke="#3a2416" stroke-width=".4"') + Array.from({ length: 40 }, (_, k) => L(k * 4, 74, k * 4 + 1, 80, '#5a3a22', 0.25)).join('') + R(0, 80, 160, 10, '#1e1410')
      + ewok(40, 74, 3, 1, '#c88a4a') + ewok(64, 74, 3.2, 1, '#8a4a3a', '#5a3a24', 'bow') + ewok(96, 74, 3, -1, '#d8c890', '#7a5434', 'spear') + ewok(120, 74, 2.8, -1, '#6a7a4a', '#4a3020', 'rock'),

    // 4 · Bunker Approach: the back door of the shield bunker in a
    // sun-dappled clearing, half buried in the hill under the giant trees;

    // 4 · Bunker Approach: the back door of the shield bunker, half buried
    // in the hill in a sun-dappled clearing under the giant trees: concrete
    // front with seams and rivets, the armoured door with warning stripes
    // and red lamps, vents and antennas. A death trooper guards the door,
    // scout troopers patrol, a speeder bike is parked; logs, rocks, ferns.
    bunker_approach: () => fill([[0, '#6a8a7a'], [0.5, '#9ab8a0'], [1, '#4a6a3a']])
      + hazeTrees('#8aa898', 0.5, 3) + shafts([30, 90], 0.14) + midTrees([[44, 6], [120, 7]], '#6a5a4e', 0.6) + redwood(16, 14, 90, '#5a3020', '#2a160c', '#8a5030') + redwood(146, 16, 90, '#5a3020', '#2a160c', '#8a5030') + vines([20, 150])
      + bunker(84, 64, 2.1)
      + P('M0 64 C40 60 120 60 160 64 L160 90 L0 90Z', '#3a5a2a') + E(84, 68, 34, 3, '#6a5a3a', 'opacity=".5"') + rocks([[126, 70, 2.6], [20, 74, 3]]) + fallenLog(140, 80, 22, 6) + shrooms([[132, 79, 1]]) + ferns(70, 20, 3)
      + speederBike(30, 72, 1.6, 1, false)
      + scout(58, 72, 2.5, 1) + deathTrooper(84, 64, 2.3, 1) + scout(112, 74, 2.6, -1) + scout(132, 78, 2.7, -1, false)
      + redwood(-2, 10, 90, '#4a2818', '#22120a', '#7a4428') + ferns(90, 18, 6, '#2a4a20', '#1a3214'),

    // 5 · Droid Rescue: C-3PO seated on the carved throne, carried
    // shoulder-high through the forest by a procession of Ewoks, R2-D2
    // rolling behind; the tree village glows in the haze beyond, lanterns
    // hang in the dusk.
    droid_rescue: () => fill([[0, '#4a5a6a'], [0.5, '#8a8a7a'], [1, '#3a4a2a']])
      + hazeTrees('#6a7a72', 0.5, 5) + shafts([50, 110], 0.1)
      + `<g opacity=".55">${[[64, 26, 10], [100, 20, 12]].map(([x, y, w]) => R(x - 2, y, 4, 70, '#5a4a3e') + P(`M${x - w} ${y} L${x + w} ${y} L${x + w - 1} ${y + 1.4} L${x - w + 1} ${y + 1.4}Z`, '#7a6a52') + [-w * 0.5, w * 0.5].map((dx) => P(`M${x + dx - 3} ${y} L${x + dx - 2.6} ${y - 3} L${x + dx + 2.6} ${y - 3} L${x + dx + 3} ${y}Z`, '#8a7a5a') + P(`M${x + dx - 3.6} ${y - 3} L${x + dx} ${y - 6.6} L${x + dx + 3.6} ${y - 3}Z`, '#a8987a') + glow(x + dx, y - 1.4, 0.8, '#ffb050', 0.6)).join('')).join('')}${P('M74 26 Q82 30 88 20', 'none', 'stroke="#5a4a3e" stroke-width=".5"')}</g>`
      + midTrees([[20, 6], [146, 7]], '#6a5a4e', 0.6) + redwood(28, 14, 90, '#5a3020', '#2a160c', '#8a5030') + redwood(136, 16, 90, '#5a3020', '#2a160c', '#8a5030') + vines([32, 140])
      + P('M0 72 C40 68 120 68 160 72 L160 90 L0 90Z', '#2e4a24') + rocks([[18, 80, 2.6]]) + shrooms([[150, 82, 1], [154, 83, 0.8]]) + ferns(76, 18, 4)
      + L(38, 56, 122, 56, '#5a3a22', 1) + L(38, 57.4, 122, 57.4, '#4a2a16', 0.4) + P('M64 55 L96 55 L95 57 L65 57Z', '#7a5a3a', 'stroke="#3a2416" stroke-width=".3"')
      + throne3po(80, 55, 1.7)
      + [[48, 70, '#c88a4a'], [62, 71, '#8a4a3a'], [98, 71, '#d8c890'], [112, 70, '#6a7a4a']].map(([x, y, h], k) => ewok(x, y, 2.4, k < 2 ? 1 : -1, h, '#6a4428', 'none') + L(x + (k < 2 ? 1.2 : -1.2), y - 11, x + (k < 2 ? 1.2 : -1.2), y - 14.4, '#6a4428', 0.9)).join('')
      + ewok(28, 76, 2.6, 1, '#a86a3a', '#5a3a24', 'spear') + ewok(134, 78, 2.6, -1, '#7a8a5a', '#6a4428', 'spear') + r2(148, 80, 2.4, -1)
      + [[40, 46], [120, 46]].map(([x, y]) => L(x, y - 8, x, y, '#5a3a22', 0.4) + C(x, y, 1.2, '#ffb050') + glow(x, y, 1.2, '#ffb050', 0.5)).join('')
      + redwood(-2, 10, 90, '#4a2818', '#22120a', '#7a4428') + ferns(90, 16, 7, '#2a4a20', '#1a3214'),

    // 6 · Imperial Shuttle (fleet): above the treetops at sunset, a detailed
    // Lambda shuttle with its wings spread cruises over the canopy, its TIE
    // Interceptor escort spread out around it in open sky, the Death Star in
    // the sky beyond; an A-wing climbs in, its shots running at an escort.
    imperial_shuttle: () => fill([[0, '#2a3a5a'], [0.5, '#c87a5a'], [0.8, '#f0b070'], [1, '#e8c890']])
      + deathStar2(30, 22, 15) + C(134, 62, 10, '#ffe0a0', 'opacity=".7"')
      + [62, 70, 78].map((y, k) => Array.from({ length: 18 }, (_, m) => { const x = ((m * 11 + k * 5) % 176) - 8; const r = 4 + ((m * 3 + k) % 4) * 1.4; return C(x, y + ((m * 5) % 4), r, ['#3a4a3a', '#2a3a2a', '#1e2e1e'][k]); }).join('')).join('')
      + lambda(84, 36, 1.9, 0, false) + (kit.interceptor ? kit.interceptor(58, 14, 0.75, -8) + kit.interceptor(130, 22, 0.8, 8) + kit.interceptor(122, 50, 0.65, 6) : '')
      + awing(16, 60, 1, -24) + (() => { const gA = gunsAt(16, 60, 1, -24, AWGUNS); return shots(gA[0], [56, 16], [0.15, 0.45, 0.72], 0.1, '#ff4a2a'); })()
      + Array.from({ length: 20 }, (_, m) => C(m * 9 - 4, 88 + (m % 2) * 2, 5 + (m % 3) * 1.6, '#121e12')).join(''),

    // 7 · Log Traps: the Ewoks spring their traps. Twin logs swing down on
    // their ropes and smash an AT-ST's head between them, sparks flying; a
    // stack of logs waits to roll; an Ewok glider swoops overhead dropping
    // rocks. Two layers of forest behind, vines, a fallen log, ferns, and
    // Ewoks cheering with R2-D2.
    log_traps: () => fill([[0, '#5a7a6a'], [0.5, '#9ab090'], [1, '#3a5a2a']])
      + hazeTrees('#7a9a8a', 0.5, 6) + shafts([40, 100], 0.12) + midTrees([[56, 6], [104, 6], [148, 5]], '#6a5a4e', 0.55) + redwood(26, 14, 90, '#5a3020', '#2a160c', '#8a5030') + redwood(136, 14, 90, '#5a3020', '#2a160c', '#8a5030') + vines([30, 132, 142])
      + P('M0 70 C40 66 120 66 160 70 L160 90 L0 90Z', '#3a5a2a') + rocks([[52, 76, 2.4], [150, 78, 2.8]]) + ferns(74, 18, 5)
      + atst(80, 72, 1.7, 1, 0.6)
      + [[-1, 26], [1, 136]].map(([sd, tx]) => P(`M${tx} 6 L${80 + sd * 9.6} 36`, 'none', 'stroke="#8a7a5a" stroke-width=".5"') + P(`M${tx} 10 L${80 + sd * 9.6} 42`, 'none', 'stroke="#8a7a5a" stroke-width=".5"') + `<g transform="rotate(${sd * -10} ${80 + sd * 9.6} 39)">${R(80 + sd * 9.6 - 2.2, 28, 4.4, 24, '#7a5a3a', 'rx="1.8" stroke="#3a2416" stroke-width=".4"')}${E(80 + sd * 9.6, 28, 2.2, 0.9, '#a8885a', 'stroke="#5a3a22" stroke-width=".2"')}${E(80 + sd * 9.6, 28, 1, 0.4, '#8a6a40')}${Array.from({ length: 5 }, (_, k) => L(80 + sd * 9.6 - 1.8, 32 + k * 4, 80 + sd * 9.6 + 1.8, 32.6 + k * 4, '#5a3a22', 0.25)).join('')}${[34, 46].map((yy) => R(80 + sd * 9.6 - 2.3, yy, 4.6, 0.8, '#8a7a5a')).join('')}</g>`).join('') + P('M73 36 l-3 -2 M87 36 l3 -2 M80 34 l0 -3 M75 33 l-1.4 -2.6 M85 33 l1.4 -2.6', 'none', 'stroke="#ffe8a0" stroke-width=".6"') + glow(80, 37, 3, '#ffe8a0', 0.3)
      + [[118, 66], [124, 70], [112, 72]].map(([x, y]) => R(x - 8, y - 1.8, 16, 3.6, '#6a4a2e', 'rx="1.8" stroke="#3a2416" stroke-width=".3"') + E(x + 8, y, 1.4, 1.8, '#a8885a', 'stroke="#5a3a22" stroke-width=".2"') + E(x + 8, y, 0.6, 0.8, '#8a6a40')).join('') + L(108, 60, 108, 74, '#5a3a22', 0.8) + L(130, 62, 130, 74, '#5a3a22', 0.8)
      + `<g transform="translate(44 18) rotate(-8)">${P('M-8 0 L8 0 L4 -2 L-4 -2Z', '#c8b08a', 'stroke="#5a3e22" stroke-width=".3"')}${L(-8, 0, 0, -1, '#5a3e22', 0.2)}${L(8, 0, 0, -1, '#5a3e22', 0.2)}</g>` + ewok(44, 24, 1.4, 1, '#c88a4a', '#6a4428', 'rock') + C(48, 30, 0.7, '#7a7a72') + C(50, 36, 0.6, '#7a7a72')
      + ewok(20, 80, 2.6, 1, '#c88a4a', '#6a4428', 'spear') + ewok(44, 82, 2.4, 1, '#8a4a3a', '#5a3a24', 'bow') + ewok(140, 82, 2.5, -1, '#d8c890', '#7a5434', 'spear') + r2(104, 84, 2.2, -1)
      + fallenLog(70, 86, 30, 2) + ferns(90, 14, 11, '#2a4a20', '#1a3214'),

    // 8 · Bunker Guards: right at the bunker door, close in. The big
    // armoured entrance in its concrete face with seams, rivets, vents,
    // warning stripes, red lamps and antennas; two death troopers hold the
    // door, scout troopers crouch behind striped barricades and more stand
    // guard at the flanks; the forest crowds in.
    bunker_guards: () => fill([[0, '#4a6a5a'], [0.5, '#7a9a84'], [1, '#3a5a2a']])
      + hazeTrees('#6a8a7a', 0.6, 7) + midTrees([[36, 6], [124, 7]], '#5a4a3e', 0.6) + redwood(12, 16, 90, '#4a2a1a', '#22120a', '#7a4428') + redwood(150, 18, 90, '#4a2a1a', '#22120a', '#7a4428') + vines([16, 146])
      + bunker(80, 68, 3.2)
      + P('M0 68 C40 65 120 65 160 68 L160 90 L0 90Z', '#3a4a2a') + Array.from({ length: 10 }, (_, k) => P(`M${48 + k * 7} 68 l3 0 l-2 -3 l-3 0Z`, '#ffcf3a', 'opacity=".55"')).join('') + rocks([[28, 74, 2.6], [136, 76, 2.4]]) + ferns(72, 14, 8)
      + [[40, 78], [120, 78]].map(([x, y]) => R(x - 8, y - 4.4, 16, 4.4, '#6a6e76', 'stroke="#3a3e46" stroke-width=".3"') + Array.from({ length: 5 }, (_, k) => L(x - 7 + k * 3.6, y - 4.4, x - 5.2 + k * 3.6, y, '#ffcf3a', 0.5)).join('') + R(x - 8, y - 4.8, 16, 0.6, '#4a4e56')).join('')
      + deathTrooper(70, 68, 2.4, -1) + deathTrooper(90, 68, 2.4, 1) + scout(36, 78, 2.5, 1) + scout(124, 78, 2.5, -1) + scout(18, 84, 2.7, 1, false) + scout(144, 84, 2.7, -1, false)
      + ferns(90, 16, 9, '#2a4a20', '#1a3214'),

    // 9 · Fleet Engagement (fleet): the space battle over Endor, spread wide.
    // The forest moon low on the left, the half-built Death Star beyond,
    // Star Destroyers in line; A-wings break through the TIE Interceptors,
    // a Lambda shuttle runs for the moon, every bolt running straight from a
    // gun to its target.
    fleet_engagement: () => R(0, 0, 160, 90, '#03050c') + starfield(70, 9)
      + (() => { const [mg, md] = LG([[0, '#8ab878'], [0.5, '#4a7a4a'], [1, '#1a3a2a']], 0, 0, 1, 1); return md + C(14, 112, 46, mg) + C(14, 112, 46, 'none', 'stroke="#c8e8c0" stroke-width="1" opacity=".4"'); })()
      + deathStar2(126, 26, 21)
      + (kit.isd ? kit.isd(54, 12, 1.1, '#7a828c') + kit.isd(150, 64, 0.9, '#6a727c') : '')
      + lambda(32, 52, 0.9, 30, false)
      + awing(70, 46, 0.9, -12) + awing(86, 70, 0.8, -20) + awing(50, 28, 0.7, -6)
      + (kit.interceptor ? kit.interceptor(120, 58, 0.8, 6) + kit.interceptor(142, 82, 0.6, 6) + kit.interceptor(104, 38, 0.6, 6) + kit.interceptor(100, 78, 0.55, 6) : '')
      + (() => { const a1 = gunsAt(70, 46, 0.9, -12, AWGUNS); const a2 = gunsAt(86, 70, 0.8, -20, AWGUNS); const t1 = gunsAt(120, 58, 0.8, 6, TIEGUNS); const t2 = gunsAt(104, 38, 0.6, 6, TIEGUNS); return shots(a1[0], [104, 38], [0.15, 0.55], 0.12, '#ff4a2a') + shots(a2[1], [120, 58], [0.2, 0.6], 0.12, '#ff4a2a') + shots(t1[2], [72, 46], [0.2, 0.6], 0.1) + shots(t2[3], [52, 28], [0.25, 0.65], 0.1); })()
      + [[100, 76], [62, 18]].map(([x, y]) => glow(x, y, 2, '#ffb070', 0.6) + C(x, y, 1, '#fff0c8')).join(''),

    // 10 · The Shield Generator: the clearing at the foot of the shield
    // generator, its huge dish on the lattice tower above the trees, the base
    // buildings lit; the landing pad ringed with lights, death troopers and
    // scout troopers holding it in the last of the light, crates stacked.
    the_shield_generator: () => fill([[0, '#3a4a6a'], [0.5, '#8a9aa8'], [1, '#c8b890']])
      + deathStar2(132, 16, 11) + hazeTrees('#5a6a6a', 0.5, 8)
      + Array.from({ length: 18 }, (_, m) => { const x = ((m * 11) % 176) - 8; const r = 6 + (m % 4) * 1.8; return C(x, 58 + (m % 3) * 2, r, '#2a3a2a'); }).join('')
      + shieldGen(80, 66, 1) + Array.from({ length: 6 }, (_, k) => C(62 + k * 7, 60, 0.4, '#ffe0a0')).join('')
      + redwood(10, 14, 90, '#4a2a1a', '#22120a', '#7a4428') + redwood(150, 14, 90, '#4a2a1a', '#22120a', '#7a4428') + vines([14, 146])
      + P('M0 66 L160 66 L160 90 L0 90Z', '#5a6068') + Array.from({ length: 9 }, (_, k) => L(k * 20, 66, k * 20 - 10, 90, '#4a5058', 0.3)).join('') + E(80, 76, 50, 8, '#6a7078', 'stroke="#ffcf3a" stroke-width=".5" opacity=".9"') + Array.from({ length: 12 }, (_, k) => { const an = (k / 12) * Math.PI * 2; return C(80 + Math.cos(an) * 46, 76 + Math.sin(an) * 7, 0.5, '#ffe0a0') + glow(80 + Math.cos(an) * 46, 76 + Math.sin(an) * 7, 0.4, '#ffe0a0', 0.4); }).join('') + ferns(68, 12, 10)
      + [[22, 72, 7, 5], [28, 68, 5, 4], [140, 72, 7, 5]].map(([x, y, w, h]) => R(x - w / 2, y - h / 2, w, h, '#5a5e66', 'stroke="#2a2e36" stroke-width=".3"') + R(x - w / 2, y - h / 2, w, 0.8, '#ffcf3a', 'opacity=".5"') + L(x - w / 2, y, x + w / 2, y, '#3a3e46', 0.2)).join('')
      + deathTrooper(62, 78, 2.6, -1) + deathTrooper(98, 78, 2.6, 1) + scout(36, 84, 2.6, 1) + scout(124, 84, 2.6, -1) + scout(144, 88, 2.7, -1, false) + scout(16, 88, 2.7, 1, false),
  };
  Object.assign(SA.scenes, N);
  SA.worlds.endor = ['forest_moon_landing', 'speeder_chase', 'ewok_village', 'bunker_approach', 'droid_rescue', 'imperial_shuttle', 'log_traps', 'bunker_guards', 'fleet_engagement', 'the_shield_generator'];
})(typeof window !== 'undefined' ? window : globalThis);
