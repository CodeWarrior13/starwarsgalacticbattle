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

  // ---------- People ----------
  // A scout trooper: black under-suit, white chest and back armour, belt
  // with pouches, knee and shin plates, the helmet with its wide flat brim,
  // black visor lenses and snout, and a blaster pistol.
  const scout = (x, y, s, f = 1, aim = true) => g(x, y, s, f,
    E(0, 0.2, 3, 0.5, '#000', 'opacity=".25"')
    + P('M-2 -5 L-2.2 0 L-0.4 0 L-0.3 -5Z M0.3 -5 L0.4 0 L2.2 0 L2 -5Z', '#16161a') + R(-2.3, -1.4, 2, 1.5, '#e8eaec', 'rx=".3" stroke="#3a3a40" stroke-width=".1"') + R(0.3, -1.4, 2, 1.5, '#e8eaec', 'rx=".3" stroke="#3a3a40" stroke-width=".1"')
    + R(-2.1, -3.8, 1.6, 2.2, '#f2f4f6', 'rx=".3" stroke="#3a3a40" stroke-width=".1"') + R(0.5, -3.8, 1.6, 2.2, '#f2f4f6', 'rx=".3" stroke="#3a3a40" stroke-width=".1"') + E(-1.3, -4.2, 0.7, 0.45, '#f2f4f6', 'stroke="#3a3a40" stroke-width=".1"') + E(1.3, -4.2, 0.7, 0.45, '#f2f4f6', 'stroke="#3a3a40" stroke-width=".1"')
    + R(-2.4, -6, 4.8, 0.8, '#2a2a30') + [-1.8, -0.8, 0.4].map((bx) => R(bx, -6.1, 0.8, 0.8, '#4a4a52')).join('') + R(1.6, -5.4, 0.9, 1.8, '#1a1a1e', 'rx=".2"')
    + P('M-2.4 -6 L-2.6 -9.6 L2.6 -9.6 L2.4 -6Z', '#16161a') + P('M-2 -6.6 L-2.2 -9.4 L2.2 -9.4 L2 -6.6Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".12"') + P('M-1.4 -8.6 L1.4 -8.6 M0 -9.3 L0 -6.8', 'none', 'stroke="#a8aeb6" stroke-width=".12"') + R(-0.8, -8.2, 1.6, 0.8, '#2a2a30', 'rx=".15"')
    + E(-2.7, -9.2, 0.9, 0.7, '#f2f4f6', 'stroke="#3a3a40" stroke-width=".1"') + E(2.7, -9.2, 0.9, 0.7, '#f2f4f6', 'stroke="#3a3a40" stroke-width=".1"')
    + R(-0.5, -10.4, 1, 0.8, '#16161a')
    + P('M-1.7 -11.6 C-1.8 -13.6 1.8 -13.6 1.7 -11.6 L1.8 -11 L-1.8 -11Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".15"') + P('M-2.4 -11.2 L2.4 -11.2 L2.2 -10.7 L-2.2 -10.7Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".12"') + P('M-0.25 -10.7 L-1.2 -10.7 L-1.3 -10.1 L-0.4 -10.25Z M0.25 -10.7 L1.2 -10.7 L1.3 -10.1 L0.4 -10.25Z', '#101014') + P('M-0.3 -10.7 L0.3 -10.7 L0.2 -9.8 L-0.2 -9.8Z', '#f4f6f8') + L(-0.15, -10.1, 0.15, -10.1, '#3a3a40', 0.08) + R(-0.12, -13.4, 0.24, 1.6, '#3a3a40')
    + (aim ? P('M2.2 -9.2 L3.6 -8.2 L3.3 -7.7 L2 -8.4Z', '#16161a') + C(3.7, -7.8, 0.42, '#16161a') + R(3.4, -8.4, 2.8, 0.7, '#1a1a1e') + R(3.4, -8, 0.7, 1.1, '#1a1a1e')
      : L(2.4, -8.8, 2.8, -6.2, '#16161a', 0.8) + C(2.8, -6, 0.38, '#16161a')));
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
    + [[-2, -1, '#5a5e66'], [2, 1, '#6a6e76']].map(([hx, ph, c]) => { const kx = hx - 3 + ph * stride; const fx = hx + ph * stride * 1.4; return P(`M${hx} -14 L${kx} -8 L${fx} -2`, 'none', `stroke="${c}" stroke-width="1.4" stroke-linejoin="round"`) + C(kx, -8, 0.8, '#4a4e56') + R(fx - 0.6, -2.4, 1.2, 1.6, c) + P(`M${fx - 2.4} 0 L${fx - 1.2} -1 L${fx + 1.2} -1 L${fx + 2.6} 0 L${fx + 1.4} -0.2 L${fx} -0.6 L${fx - 1.2} -0.2Z`, c, 'stroke="#2a2e36" stroke-width=".2"'); }).join('')
    + R(-2.4, -15.6, 4.8, 2.4, '#5a5e66', 'stroke="#2a2e36" stroke-width=".25"') + C(0, -14.6, 1.2, '#4a4e56')
    + P('M-5.4 -16 L-4.8 -21.6 L4.4 -21.6 L6.2 -19.4 L6.4 -17 L4.8 -16Z', '#7a7e86', 'stroke="#2a2e36" stroke-width=".3"') + P('M-4.8 -21.6 L4.4 -21.6 L6.2 -19.4 L-5 -19.6Z', '#9a9ea6', 'opacity=".6"') + R(-3.6, -20.6, 2.4, 1, '#1a1e24') + R(-0.6, -20.6, 2.4, 1, '#1a1e24') + R(2.6, -20.4, 2.2, 0.9, '#1a1e24') + P('M-4.6 -18 L5.6 -18', 'none', 'stroke="#5a5e66" stroke-width=".25"') + [-3, -1, 1, 3].map((px) => C(px, -17, 0.2, '#4a4e56')).join('')
    + R(5.6, -17.6, 3.2, 0.7, '#3a3e46') + R(5.6, -16.8, 2.6, 0.6, '#3a3e46') + R(-7.2, -20.2, 2.2, 2.4, '#5a5e66', 'stroke="#2a2e36" stroke-width=".2"') + [-6.6, -5.8].map((px) => C(px, -19, 0.3, '#2a2e36')).join(''));
  // A 74-Z speeder bike with a scout trooper riding low: the long nose
  // with its steering vanes, the saddle and engine block, the rider.
  const speederBike = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 3.2, 8, 0.8, '#000', 'opacity=".18"')
    + R(4, -2.4, 9, 0.5, '#3a3e46') + R(4, -0.6, 9, 0.5, '#3a3e46') + P('M12 -3.2 L14.4 -3.6 L14.4 -2.2 L12 -2Z M12 -1.4 L14.4 -1.8 L14.4 -0.4 L12 -0.2Z', '#5a5e66')
    + P('M-6 -2.4 L4 -3 L6 -1.6 L4 0.4 L-6 0.6 L-7.6 -0.8Z', '#6a6e76', 'stroke="#2a2e36" stroke-width=".25"') + R(-7.6, -1.6, 2, 2, '#3a3e46') + glow(-8, -0.6, 0.8, '#ffb070', 0.5) + R(-1, -3.6, 4, 1.2, '#2a2a2e', 'rx=".4"') + L(3.4, -3, 5.4, -4.2, '#2a2a2e', 0.4)
    + `<g transform="translate(0.4 -2.6) rotate(18) scale(.62)">${scout(0, 0, 1, 1, false)}</g>`);
  // R2-D2 (shared) or a simple stand-in.
  const r2 = kit.r2 || ((x, y, s) => g(x, y, s, 1, R(-1.6, -5, 3.2, 4.6, '#f2f4f6') + P('M-1.7 -5 C-1.7 -7.2 1.7 -7.2 1.7 -5Z', '#d8dce2')));
  const threepio = kit.threepio || ((x, y, s) => g(x, y, s, 1, R(-1.6, -11, 3.2, 11, '#e8c050')));

  // ---------- Machines ----------
  // A Lambda-class shuttle seen from the front: the tall dorsal wing, the two
  // lower wings angled down in flight, the cockpit nose with its windows,
  // the engine glow behind, panel lines and the Imperial grey.
  const lambda = (x, y, s, a = 0, landing = false) => g(x, y, s, 1,
    (landing ? [-3, 3].map((px) => L(px, 3, px * 1.3, 7, '#4a4e56', 0.6) + E(px * 1.3, 7, 1, 0.3, '#3a3e46')).join('') : '')
    + P('M-1.4 -2 L-1 -18 L1 -18 L1.4 -2Z', '#c8ccd2', 'stroke="#4a4e56" stroke-width=".3"') + L(0, -17.6, 0, -2.4, '#9aa0a8', 0.25) + P('M-1 -18 L1 -18 L0.8 -16 L-0.8 -16Z', '#e8ecf0')
    + P(`M-1.6 0 L-14 ${landing ? -3 : 9} L-13.2 ${landing ? -1.4 : 10.4} L-1.4 2.4Z`, '#b8bcc4', 'stroke="#4a4e56" stroke-width=".3"') + P(`M1.6 0 L14 ${landing ? -3 : 9} L13.2 ${landing ? -1.4 : 10.4} L1.4 2.4Z`, '#a8acb4', 'stroke="#4a4e56" stroke-width=".3"') + L(-2, 1, -13, landing ? -2 : 9.4, '#8a9098', 0.25) + L(2, 1, 13, landing ? -2 : 9.4, '#8a9098', 0.25)
    + glow(0, 0, 2.6, '#9fd8ff', 0.25) + P('M-3 -2 L3 -2 L3.4 2 L2 4.6 L-2 4.6 L-3.4 2Z', '#d8dce2', 'stroke="#4a4e56" stroke-width=".3"') + P('M-2 1.4 L2 1.4 L1.6 3.4 L-1.6 3.4Z', '#1a2a3a') + L(0, 1.4, 0, 3.4, '#d8dce2', 0.2) + P('M-1.6 1.8 L-0.6 1.6', 'none', 'stroke="#8ab0d0" stroke-width=".25"') + R(-2.4, -1.4, 4.8, 1, '#9aa0a8'), a);
  // An A-wing from above: the red-and-white wedge, cockpit bubble, the two
  // big engines at the back with their glow, the wingtip cannons.
  const awing = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M9 0 L1 -2.4 L-3 -5.2 L-5.4 -5.2 L-4.6 -2 L-5 0 L-4.6 2 L-5.4 5.2 L-3 5.2 L1 2.4Z', '#ecebe6', 'stroke="#4a4840" stroke-width=".3"') + P('M9 0 L4 -1.4 L4 1.4Z', '#c8382a') + P('M1 -2.4 L-1.4 -3.8 L-1 -2 Z M1 2.4 L-1.4 3.8 L-1 2Z', '#c8382a') + P('M-3 -5.2 L-5.4 -5.2 L-5 -4 L-2.4 -4.2Z M-3 5.2 L-5.4 5.2 L-5 4 L-2.4 4.2Z', '#c8382a')
    + E(1.4, 0, 1.6, 0.9, '#1a2a3a', 'stroke="#4a4840" stroke-width=".2"') + P('M0.4 -0.4 L1.6 -0.6', 'none', 'stroke="#8ab0d0" stroke-width=".2"') + L(-2, -1.2, 6, -0.4, '#a8a69e', 0.15) + L(-2, 1.2, 6, 0.4, '#a8a69e', 0.15)
    + R(-7.4, -4.4, 3.4, 2.6, '#9a9a98', 'rx=".6" stroke="#4a4840" stroke-width=".2"') + R(-7.4, 1.8, 3.4, 2.6, '#9a9a98', 'rx=".6" stroke="#4a4840" stroke-width=".2"') + glow(-8, -3.1, 1, '#ff9a6a', 0.6) + glow(-8, 3.1, 1, '#ff9a6a', 0.6) + C(-7.6, -3.1, 0.6, '#ffd0a8') + C(-7.6, 3.1, 0.6, '#ffd0a8') + L(-3.6, -5.6, 1, -5.6, '#3a3a40', 0.35) + L(-3.6, 5.6, 1, 5.6, '#3a3a40', 0.35), a);
  // The second Death Star, half built: the finished half shaded grey with
  // its trench and the superlaser dish, the open half a lattice of beams.
  const deathStar2 = (x, y, r) => {
    const [dg, dd] = LG([[0, '#a8b0b8'], [0.6, '#6a727a'], [1, '#2a3038']], 0.2, 0.1, 0.9, 1);
    return dd + `<clipPath id="ds2c${Math.round(x)}${Math.round(y)}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath>`
      + `<g clip-path="url(#ds2c${Math.round(x)}${Math.round(y)})">${C(x, y, r, dg)}${Array.from({ length: 8 }, (_, k) => L(x - r, y - r + k * r / 4, x + r, y - r + k * r / 4, '#5a626a', 0.15)).join('')}${R(x - r, y - 0.4, r * 2, 0.8, '#3a4048')}${P(`M${x + r * 0.15} ${y - r} C${x + r * 0.5} ${y - r * 0.4} ${x + r * 0.5} ${y + r * 0.4} ${x + r * 0.2} ${y + r} L${x + r * 1.2} ${y + r} L${x + r * 1.2} ${y - r}Z`, '#0a0c14')}${Array.from({ length: 6 }, (_, k) => P(`M${x + r * (0.25 + k * 0.13)} ${y - r} C${x + r * (0.55 + k * 0.1)} ${y - r * 0.3} ${x + r * (0.55 + k * 0.1)} ${y + r * 0.3} ${x + r * (0.25 + k * 0.13)} ${y + r}`, 'none', 'stroke="#6a727a" stroke-width=".35"')).join('')}${Array.from({ length: 7 }, (_, k) => L(x + r * 0.2, y - r * 0.9 + k * r * 0.3, x + r, y - r * 0.9 + k * r * 0.3, '#5a626a', 0.25)).join('')}</g>`
      + C(x - r * 0.38, y - r * 0.4, r * 0.22, '#5a626a', 'stroke="#3a4048" stroke-width=".4"') + C(x - r * 0.38, y - r * 0.4, r * 0.1, '#3a4048') + C(x, y, r, 'none', 'stroke="#c8d0d8" stroke-width=".3" opacity=".5"');
  };
  // The bunker entrance: the grey concrete block set into the hillside, the
  // armoured door with its lit frame, the vents, the antenna.
  const bunker = (x, y, s) => g(x, y, s, 1,
    P('M-30 0 C-24 -10 -14 -14 0 -14 C14 -14 24 -10 30 0Z', '#3a4a2a') + P('M-12 0 L-12 -12 L12 -12 L12 0Z', '#7a8088', 'stroke="#3a4048" stroke-width=".4"') + P('M-12 -12 L12 -12 L10 -14 L-10 -14Z', '#9aa0a8', 'stroke="#3a4048" stroke-width=".3"') + R(-6, -9, 12, 9, '#2a2e34', 'stroke="#5a6068" stroke-width=".5"') + R(-5, -8, 10, 8, '#3a3e46') + L(0, -8, 0, 0, '#2a2e34', 0.4) + R(-6, -9.6, 12, 0.6, '#ffcf3a', 'opacity=".6"')
    + [-10, 8].map((px) => R(px, -10, 2, 6, '#5a6068')).join('') + [-9.4, 8.6].map((px) => [-9, -7.4, -5.8].map((py) => L(px, py, px + 0.8, py, '#3a4048', 0.25)).join('')).join('') + L(10, -14, 10, -22, '#5a6068', 0.5) + L(8, -20, 12, -20, '#5a6068', 0.4) + C(10, -22.4, 0.5, '#ff3a2a')
    + [-14, -18, 14, 18].map((px) => P(`M${px} 0 q1 -4 0 -7 q-1 2 -2 0`, 'none', 'stroke="#2a3a1a" stroke-width=".7"')).join(''));
  // The shield generator: the big dish on its lattice tower above the trees,
  // with its support struts and the glowing core, the base buildings below.
  const shieldGen = (x, y, s) => g(x, y, s, 1,
    P('M-6 0 L-3 -40 L3 -40 L6 0Z', 'none', 'stroke="#5a6068" stroke-width=".8"') + Array.from({ length: 10 }, (_, k) => L(-6 + k * 0.3, -k * 4, 6 - k * 0.3, -(k + 1) * 4, '#5a6068', 0.4) + L(6 - k * 0.3, -k * 4, -6 + k * 0.3, -(k + 1) * 4, '#5a6068', 0.4)).join('')
    + `<g transform="rotate(-14 0 -46)">${E(0, -46, 20, 6, '#c8ccd2', 'stroke="#4a5058" stroke-width=".5"')}${E(0, -46.6, 16, 4.4, '#9aa0a8')}${Array.from({ length: 12 }, (_, k) => L(0, -46.6, Math.cos((k / 12) * Math.PI * 2) * 16, -46.6 + Math.sin((k / 12) * Math.PI * 2) * 4.4, '#7a8088', 0.3)).join('')}${L(0, -46.6, 0, -54, '#4a5058', 0.8)}${glow(0, -54, 1.4, '#9fd8ff', 0.6)}${L(-12, -44, 0, -54, '#5a6068', 0.3)}${L(12, -44, 0, -54, '#5a6068', 0.3)}</g>`
    + P('M-20 0 L-20 -6 L-8 -8 L8 -8 L20 -6 L20 0Z', '#7a8088', 'stroke="#3a4048" stroke-width=".4"') + [-16, -10, 10, 16].map((px) => R(px - 1.2, -5, 2.4, 1.6, '#ffd890', 'opacity=".7"')).join(''));

  const N = {
    // 1 · Forest Moon Landing (fleet): the shuttle comes down over Endor.
    // The forest moon's endless green canopy under a hazy sky, the half-built
    // Death Star hanging huge above it; a Lambda shuttle descending with its
    // wings folding, TIE Interceptors circling, an A-wing diving through.
    forest_moon_landing: () => fill([[0, '#3a5a7a'], [0.5, '#8ab0c8'], [0.8, '#c8dce0'], [1, '#e8f0e8']])
      + deathStar2(122, 24, 18) + starfield(14, 1)
      + [56, 64, 70, 76].map((y, k) => Array.from({ length: 18 }, (_, m) => { const x = ((m * 11 + k * 7) % 176) - 8; const r = 4 + ((m * 3 + k) % 4) * 1.4; return C(x, y + ((m * 5) % 4), r, ['#5a7a5a', '#4a6a44', '#3a5a34', '#2a4a26'][k]); }).join('')).join('') + E(80, 56, 90, 4, '#c8dce0', 'opacity=".4"')
      + lambda(64, 36, 1.5, 0, false) + glow(64, 36, 4, '#9fd8ff', 0.08)
      + (kit.interceptor ? kit.interceptor(30, 22, 0.8, -10) + kit.interceptor(100, 46, 0.7, 8) : '') + awing(120, 52, 1.1, 200) + bolt(116, 50, 104, 47, '#ff4a2a') + bolt(36, 24, 52, 30, '#3aff6a')
      + Array.from({ length: 20 }, (_, m) => { const x = m * 9 - 4; const r = 5 + (m % 3) * 1.6; return C(x, 86 + (m % 2) * 2, r, '#1e3a1e'); }).join(''),

    // 2 · Speeder Chase: tearing through the forest. Giant redwoods flash by,
    // shafts of sunlight cut the haze, ferns blur below; scout troopers on
    // speeder bikes weave between the trunks, one firing back.
    speeder_chase: () => fill([[0, '#5a7a6a'], [0.5, '#8aa890'], [1, '#3a5a3a']])
      + hazeTrees('#7a9a8a', 0.5, 1) + shafts([20, 70, 120], 0.12) + hazeTrees('#5a6a5a', 0.6, 4)
      + redwood(46, 10, 90, '#5a3020', '#2a160c', '#8a5030') + redwood(118, 12, 90, '#5a3020', '#2a160c', '#8a5030')
      + P('M0 76 C40 72 120 72 160 76 L160 90 L0 90Z', '#2a3a1e') + ferns(80, 22, 2)
      + Array.from({ length: 10 }, (_, k) => L(0, 50 + k * 3, 30 - k * 2, 50 + k * 3, '#c8d8c0', 0.25)).join('')
      + speederBike(70, 54, 2, -1) + speederBike(102, 66, 2.4, -1) + speederBike(38, 66, 1.6, -1) + bolt(80, 50, 64, 48, '#ff4a2a') + bolt(92, 62, 56, 58, '#ff4a2a')
      + redwood(6, 16, 90, '#4a2818', '#22120a', '#7a4428') + redwood(156, 14, 90, '#4a2818', '#22120a', '#7a4428') + ferns(90, 16, 5, '#2a4a20', '#1a3214'),

    // 3 · Ewok Village: high in the canopy at dusk. Thatched huts ring the
    // great trunks on their platforms, rope bridges sway between the trees,
    // ladders and lanterns everywhere, and Ewok warriors stand on the
    // walkway with spears and bows.
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
    // scout troopers patrol outside, a death trooper on the door, a speeder
    // bike parked.
    bunker_approach: () => fill([[0, '#6a8a7a'], [0.5, '#9ab8a0'], [1, '#4a6a3a']])
      + hazeTrees('#8aa898', 0.5, 3) + shafts([30, 90], 0.14) + redwood(18, 14, 90, '#5a3020', '#2a160c', '#8a5030') + redwood(142, 16, 90, '#5a3020', '#2a160c', '#8a5030')
      + bunker(84, 64, 1.6)
      + P('M0 64 C40 60 120 60 160 64 L160 90 L0 90Z', '#3a5a2a') + ferns(70, 20, 3) + E(84, 68, 30, 3, '#6a5a3a', 'opacity=".5"')
      + `<g transform="translate(34 70) scale(1.4)">${E(0, 1.6, 8, 0.7, '#000', 'opacity=".2"')}${R(4, -2.4, 9, 0.5, '#3a3e46')}${R(4, -0.6, 9, 0.5, '#3a3e46')}${P('M12 -3.2 L14.4 -3.6 L14.4 -2.2 L12 -2Z M12 -1.4 L14.4 -1.8 L14.4 -0.4 L12 -0.2Z', '#5a5e66')}${P('M-6 -2.4 L4 -3 L6 -1.6 L4 0.4 L-6 0.6 L-7.6 -0.8Z', '#6a6e76', 'stroke="#2a2e36" stroke-width=".25"')}${R(-7.6, -1.6, 2, 2, '#3a3e46')}${R(-1, -3.6, 4, 1.2, '#2a2a2e', 'rx=".4"')}${L(3.4, -3, 5.4, -4.2, '#2a2a2e', 0.4)}</g>`
      + scout(58, 72, 2.4, 1) + deathTrooper(84, 64, 2.2, 1) + scout(112, 74, 2.5, -1) + scout(134, 78, 2.6, -1, false)
      + redwood(-2, 10, 90, '#4a2818', '#22120a', '#7a4428') + ferns(90, 18, 6, '#2a4a20', '#1a3214'),

    // 5 · Droid Rescue: C-3PO carried shoulder-high on his litter through the
    // forest by a procession of Ewoks, R2-D2 rolling along behind, lanterns
    // in the dusk light between the giant trunks.
    droid_rescue: () => fill([[0, '#4a5a6a'], [0.5, '#8a8a7a'], [1, '#3a4a2a']])
      + hazeTrees('#6a7a72', 0.5, 5) + shafts([50, 110], 0.1) + redwood(30, 14, 90, '#5a3020', '#2a160c', '#8a5030') + redwood(134, 16, 90, '#5a3020', '#2a160c', '#8a5030')
      + P('M0 72 C40 68 120 68 160 72 L160 90 L0 90Z', '#2e4a24') + ferns(76, 18, 4)
      + P('M44 54 L116 54 L114 57 L46 57Z', '#7a5a3a', 'stroke="#3a2416" stroke-width=".4"') + L(40, 55.4, 120, 55.4, '#5a3a22', 0.8) + [52, 68, 84, 100].map((x) => L(x, 57, x - 1, 60, '#5a3a22', 0.4)).join('') + P('M70 54 L72 46 L88 46 L90 54Z', '#a8885a', 'stroke="#5a3e22" stroke-width=".3"')
      + threepio(80, 54, 2.2, 1)
      + [[50, 70, '#c88a4a'], [62, 71, '#8a4a3a'], [98, 71, '#d8c890'], [110, 70, '#6a7a4a']].map(([x, y, h], k) => ewok(x, y, 2.4, k < 2 ? 1 : -1, h, '#6a4428', 'none')).join('')
      + ewok(30, 76, 2.6, 1, '#a86a3a', '#5a3a24', 'spear') + ewok(132, 78, 2.6, -1, '#7a8a5a', '#6a4428', 'spear') + r2(146, 80, 2.4, -1)
      + [[40, 48], [120, 48]].map(([x, y]) => L(x, y - 8, x, y, '#5a3a22', 0.4) + C(x, y, 1.2, '#ffb050') + glow(x, y, 1.2, '#ffb050', 0.5)).join('')
      + redwood(-2, 10, 90, '#4a2818', '#22120a', '#7a4428') + ferns(90, 16, 7, '#2a4a20', '#1a3214'),

    // 6 · Imperial Shuttle (fleet): above the treetops at sunset, a Lambda
    // shuttle with its wings spread cruises over the canopy flanked by TIE
    // Interceptors, the Death Star in the sky beyond.
    imperial_shuttle: () => fill([[0, '#2a3a5a'], [0.5, '#c87a5a'], [0.8, '#f0b070'], [1, '#e8c890']])
      + deathStar2(30, 22, 12) + C(130, 60, 10, '#ffe0a0', 'opacity=".7"')
      + [62, 70, 78].map((y, k) => Array.from({ length: 18 }, (_, m) => { const x = ((m * 11 + k * 5) % 176) - 8; const r = 4 + ((m * 3 + k) % 4) * 1.4; return C(x, y + ((m * 5) % 4), r, ['#3a4a3a', '#2a3a2a', '#1e2e1e'][k]); }).join('')).join('')
      + lambda(84, 36, 1.9, 0, false) + (kit.interceptor ? kit.interceptor(46, 30, 1, -8) + kit.interceptor(122, 30, 1, 8) + kit.interceptor(108, 52, 0.7, 6) : '')
      + awing(18, 58, 1.1, -20) + bolt(26, 54, 40, 46, '#ff4a2a')
      + Array.from({ length: 20 }, (_, m) => C(m * 9 - 4, 88 + (m % 2) * 2, 5 + (m % 3) * 1.6, '#121e12')).join(''),

    // 7 · Log Traps: the Ewoks spring their traps. Twin logs swing down on
    // ropes to crush an AT-ST between them, a stack of logs rolls down the
    // slope, an Ewok glider swoops overhead dropping stones; Ewoks cheer
    // from the ferns, R2-D2 among them.
    log_traps: () => fill([[0, '#5a7a6a'], [0.5, '#9ab090'], [1, '#3a5a2a']])
      + hazeTrees('#7a9a8a', 0.5, 6) + shafts([40, 100], 0.12) + redwood(30, 14, 90, '#5a3020', '#2a160c', '#8a5030') + redwood(132, 14, 90, '#5a3020', '#2a160c', '#8a5030')
      + P('M0 70 C40 66 120 66 160 70 L160 90 L0 90Z', '#3a5a2a') + ferns(74, 18, 5)
      + atst(80, 72, 1.6, 1, 0.6)
      + [[-1, 30], [1, 132]].map(([sd, tx]) => P(`M${tx} 6 L${80 + sd * 9} 38`, 'none', 'stroke="#8a7a5a" stroke-width=".5"') + P(`M${tx} 10 L${80 + sd * 9} 44`, 'none', 'stroke="#8a7a5a" stroke-width=".5"') + `<g transform="rotate(${sd * -10} ${80 + sd * 9} 41)">${R(80 + sd * 9 - 2, 30, 4, 22, '#7a5a3a', 'rx="1.6" stroke="#3a2416" stroke-width=".4"')}${E(80 + sd * 9, 30, 2, 0.8, '#a8885a')}${Array.from({ length: 4 }, (_, k) => L(80 + sd * 9 - 1.6, 34 + k * 4, 80 + sd * 9 + 1.6, 34.6 + k * 4, '#5a3a22', 0.25)).join('')}</g>`).join('') + P('M74 38 l-3 -2 M86 38 l3 -2 M80 36 l0 -3', 'none', 'stroke="#ffe8a0" stroke-width=".6"') + glow(80, 40, 3, '#ffe8a0', 0.3)
      + [[118, 66], [124, 70], [112, 72]].map(([x, y]) => R(x - 8, y - 1.8, 16, 3.6, '#6a4a2e', 'rx="1.8" stroke="#3a2416" stroke-width=".3"') + E(x + 8, y, 1.4, 1.8, '#a8885a')).join('')
      + `<g transform="translate(40 18) rotate(-8)">${P('M-8 0 L8 0 L4 -2 L-4 -2Z', '#c8b08a', 'stroke="#5a3e22" stroke-width=".3"')}${L(-8, 0, 0, -1, '#5a3e22', 0.2)}${L(8, 0, 0, -1, '#5a3e22', 0.2)}</g>` + ewok(40, 24, 1.4, 1, '#c88a4a', '#6a4428', 'rock') + C(44, 30, 0.7, '#7a7a72') + C(46, 36, 0.6, '#7a7a72')
      + ewok(22, 80, 2.6, 1, '#c88a4a', '#6a4428', 'spear') + ewok(46, 82, 2.4, 1, '#8a4a3a', '#5a3a24', 'bow') + ewok(138, 82, 2.5, -1, '#d8c890', '#7a5434', 'spear') + r2(104, 84, 2.2, -1),

    // 8 · Bunker Guards: right at the bunker door. The armoured entrance in
    // its concrete face with warning stripes and the antenna, death troopers
    // and scout troopers on guard behind barricades, the forest close round.
    bunker_guards: () => fill([[0, '#4a6a5a'], [0.5, '#7a9a84'], [1, '#3a5a2a']])
      + hazeTrees('#6a8a7a', 0.6, 7) + redwood(16, 16, 90, '#4a2a1a', '#22120a', '#7a4428') + redwood(146, 18, 90, '#4a2a1a', '#22120a', '#7a4428')
      + bunker(80, 66, 2.6) + Array.from({ length: 8 }, (_, k) => P(`M${54 + k * 7} 66 l3 0 l-2 -3 l-3 0Z`, '#ffcf3a', 'opacity=".55"')).join('')
      + P('M0 66 C40 63 120 63 160 66 L160 90 L0 90Z', '#3a4a2a') + ferns(70, 14, 8)
      + [[44, 76], [116, 76]].map(([x, y]) => R(x - 7, y - 4, 14, 4, '#6a6e76', 'stroke="#3a3e46" stroke-width=".3"') + Array.from({ length: 4 }, (_, k) => L(x - 6 + k * 4, y - 4, x - 4 + k * 4, y, '#ffcf3a', 0.5)).join('')).join('')
      + deathTrooper(70, 66, 2.4, -1) + deathTrooper(90, 66, 2.4, 1) + scout(40, 74, 2.5, 1) + scout(120, 74, 2.5, -1) + scout(140, 82, 2.6, -1, false)
      + ferns(90, 16, 9, '#2a4a20', '#1a3214'),

    // 9 · Fleet Engagement (fleet): the space battle over Endor. The forest
    // moon below, the half-built Death Star beyond, Star Destroyers in a
    // line; A-wings tear through a swarm of TIE Interceptors, a Lambda
    // shuttle running for the moon, laser fire everywhere.
    fleet_engagement: () => R(0, 0, 160, 90, '#03050c') + starfield(70, 9)
      + (() => { const [mg, md] = LG([[0, '#8ab878'], [0.5, '#4a7a4a'], [1, '#1a3a2a']], 0, 0, 1, 1); return md + C(20, 110, 50, mg) + C(20, 110, 50, 'none', 'stroke="#c8e8c0" stroke-width="1" opacity=".4"'); })()
      + deathStar2(118, 28, 22)
      + (kit.isd ? kit.isd(56, 18, 1.2, '#7a828c') + kit.isd(150, 60, 1, '#6a727c') : '')
      + lambda(44, 58, 1, 30, false)
      + awing(84, 54, 1.1, -20) + awing(100, 68, 0.9, -30) + awing(60, 40, 0.8, -10)
      + (kit.interceptor ? kit.interceptor(126, 58, 0.9, 6) + kit.interceptor(142, 74, 0.7, 6) + kit.interceptor(110, 44, 0.7, 6) + kit.interceptor(76, 78, 0.6, 6) : '')
      + bolt(92, 51, 118, 56, '#ff4a2a') + bolt(106, 65, 134, 70, '#ff4a2a') + bolt(121, 58, 92, 57, '#3aff6a') + bolt(105, 45, 68, 41, '#3aff6a') + bolt(71, 77, 50, 62, '#3aff6a')
      + [[132, 66], [70, 30]].map(([x, y]) => glow(x, y, 2, '#ffb070', 0.6) + C(x, y, 1, '#fff0c8')).join(''),

    // 10 · The Shield Generator: the clearing at the foot of the shield
    // generator, its huge dish on the lattice tower above the trees, the
    // base buildings lit; death troopers and scout troopers holding the
    // landing pad in the last of the light.
    the_shield_generator: () => fill([[0, '#3a4a6a'], [0.5, '#8a9aa8'], [1, '#c8b890']])
      + deathStar2(130, 16, 10) + hazeTrees('#5a6a6a', 0.5, 8)
      + Array.from({ length: 18 }, (_, m) => { const x = ((m * 11) % 176) - 8; const r = 6 + (m % 4) * 1.8; return C(x, 58 + (m % 3) * 2, r, '#2a3a2a'); }).join('')
      + shieldGen(80, 66, 1)
      + redwood(10, 14, 90, '#4a2a1a', '#22120a', '#7a4428') + redwood(150, 14, 90, '#4a2a1a', '#22120a', '#7a4428')
      + P('M0 66 L160 66 L160 90 L0 90Z', '#5a6068') + E(80, 76, 50, 8, '#6a7078', 'stroke="#ffcf3a" stroke-width=".5" opacity=".9"') + Array.from({ length: 12 }, (_, k) => { const an = (k / 12) * Math.PI * 2; return C(80 + Math.cos(an) * 46, 76 + Math.sin(an) * 7, 0.5, '#ffe0a0'); }).join('') + ferns(68, 12, 10)
      + deathTrooper(62, 78, 2.6, -1) + deathTrooper(98, 78, 2.6, 1) + scout(36, 84, 2.6, 1) + scout(124, 84, 2.6, -1) + scout(140, 88, 2.7, -1, false),
  };
  Object.assign(SA.scenes, N);
  SA.worlds.endor = ['forest_moon_landing', 'speeder_chase', 'ewok_village', 'bunker_approach', 'droid_rescue', 'imperial_shuttle', 'log_traps', 'bunker_guards', 'fleet_engagement', 'the_shield_generator'];
})(typeof window !== 'undefined' ? window : globalThis);
