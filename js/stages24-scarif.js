// Update 2.4: the ten Scarif stage scenes, for approval. Same 160x90 format
// as the worlds before: the shield gate in orbit, the beach landing, landing
// pad nine, K-2SO in the citadel, the U-wing's strike run, the citadel
// steps, the data vault, Tarkin's order from the Death Star, the orbital
// battle, and Vader in the hallway. Drawn in full detail.
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
  const gunsAt = kit.gunsAt || ((x, y, s, a, pts) => { const r = (a * Math.PI) / 180; return pts.map(([lx, ly]) => [x + s * (lx * Math.cos(r) - ly * Math.sin(r)), y + s * (lx * Math.sin(r) + ly * Math.cos(r))]); });
  const shots = kit.shots || ((a, b, ts, len = 0.14, c = '#3aff6a') => ts.map((t) => bolt(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[0] + (b[0] - a[0]) * (t + len), a[1] + (b[1] - a[1]) * (t + len), c)).join(''));
  const TIEGUNS = kit.TIEGUNS || [[8.6, -12.2], [8.6, 12.2], [-8.6, -12.2], [-8.6, 12.2]];
  const deathTrooper = kit.deathTrooper || ((x, y, s) => g(x, y, s, 1, R(-2, -14, 4, 14, '#141418')));
  const vader = kit.vader || ((x, y, s) => g(x, y, s, 1, R(-3, -14, 6, 14, '#0a0a0e')));

  // ---------- Scarif ----------
  // The tropical sky with the planetary shield shimmering high above it.
  const shieldSky = (top = '#3a7ac8', mid = '#8ac8f0', low = '#d8f0f8') => fill([[0, top], [0.55, mid], [1, low]])
    + [0, 1, 2, 3].map((k) => P(`M-10 ${14 + k * 6} Q80 ${-6 + k * 6} 170 ${14 + k * 6}`, 'none', `stroke="#e8f8ff" stroke-width="${0.5 - k * 0.08}" opacity="${0.35 - k * 0.06}"`)).join('')
    + Array.from({ length: 12 }, (_, k) => { const x = k * 14 + 4; return P(`M${x} ${6 + Math.abs(k - 5.5) * 1.6} l3 1.4 l3 -1.4`, 'none', 'stroke="#e8f8ff" stroke-width=".3" opacity=".3"'); }).join('');
  // Turquoise sea from y down: deep and shallow bands, wave lines, foam.
  const sea = (y, seed = 0) => { const [sg, sd] = LG([[0, '#2a8ab8'], [0.5, '#3ab8c8'], [1, '#6ad8d0']]); return sd + R(0, y, 160, 90 - y, sg) + Array.from({ length: 14 }, (_, k) => { const x = (k * 37 + seed * 11) % 160; const yy = y + 2 + ((k * 13 + seed) % Math.max(4, 88 - y)); const l = 4 + (k % 4) * 2.4; return P(`M${x - l} ${yy} Q${x} ${yy - 0.8} ${x + l} ${yy}`, 'none', 'stroke="#e8fbff" stroke-width=".35" opacity=".55"'); }).join(''); };
  // A white beach with its foam line, ripples and scattered shells.
  const beach = (y, c = '#f0e2c0') => P(`M0 ${y} C40 ${y - 3} 80 ${y + 2} 120 ${y - 2} C140 ${y - 3} 150 ${y - 1} 160 ${y} L160 90 L0 90Z`, c) + P(`M0 ${y} C40 ${y - 3} 80 ${y + 2} 120 ${y - 2} C140 ${y - 3} 150 ${y - 1} 160 ${y}`, 'none', 'stroke="#ffffff" stroke-width="1.2" opacity=".85"') + Array.from({ length: 14 }, (_, k) => P(`M${(k * 23) % 160} ${y + 4 + ((k * 7) % 12)} q2 -.6 4 0`, 'none', 'stroke="#d8c8a0" stroke-width=".35"')).join('');
  // A palm tree: a gently curved ringed trunk and a crown of drooping fronds
  // with their leaflets, coconuts at the top.
  const palm = (x, y, h, lean = 4, s = 1) => {
    const tx = x + lean; const ty = y - h;
    let o = P(`M${x - 1.2 * s} ${y} Q${x + lean * 0.2} ${y - h * 0.5} ${tx - 0.6 * s} ${ty} L${tx + 0.6 * s} ${ty} Q${x + lean * 0.3 + 1 * s} ${y - h * 0.5} ${x + 1.2 * s} ${y}Z`, '#8a6a44', 'stroke="#4a3420" stroke-width=".25"');
    for (let k = 1; k < 9; k++) { const t = k / 9; const px = x + (tx - x) * t * t; const py = y - h * t; o += L(px - 1.1 * s, py, px + 1.1 * s, py - 0.4, '#5a4228', 0.3); }
    o += [[-1, 0.9], [-0.6, 1.2], [-0.2, 1], [0.3, 1.1], [0.7, 1.2], [1, 0.9]].map(([dir, len]) => { const ex = tx + dir * 9 * s * len; const ey = ty + 3.4 * s * (1.2 - Math.abs(dir) * 0.2) + Math.abs(dir) * 3 * s; const mx = tx + dir * 4.6 * s * len; const my = ty - 2.4 * s; return P(`M${tx} ${ty} Q${mx} ${my} ${ex} ${ey}`, 'none', 'stroke="#2a7a3a" stroke-width="1" stroke-linecap="round"') + Array.from({ length: 6 }, (_, m) => { const t = 0.25 + m * 0.13; const px = (1 - t) * (1 - t) * tx + 2 * (1 - t) * t * mx + t * t * ex; const py = (1 - t) * (1 - t) * ty + 2 * (1 - t) * t * my + t * t * ey; return L(px, py, px + dir * 0.8 * s, py + 1.6 * s, '#3a9a4a', 0.4) + L(px, py, px - dir * 0.3 * s, py + 1.4 * s, '#2a6a32', 0.3); }).join(''); }).join('');
    return o + C(tx - 0.6 * s, ty + 0.8 * s, 0.6 * s, '#5a4a22') + C(tx + 0.6 * s, ty + 0.9 * s, 0.6 * s, '#5a4a22');
  };
  // The Citadel: the tall dark tower with its stepped sides, window bands
  // and the great communications dish on top, the base complex below.
  const citadel = (x, y, s) => g(x, y, s, 1,
    P('M-22 0 L-22 -8 L-8 -11 L8 -11 L22 -8 L22 0Z', '#5a6068', 'stroke="#2a2e36" stroke-width=".3"') + P('M-22 -8 L-8 -11 L8 -11 L22 -8 L22 -9.4 L8 -12.4 L-8 -12.4 L-22 -9.4Z', '#7a8088', 'stroke="#2a2e36" stroke-width=".2"') + Array.from({ length: 9 }, (_, k) => R(-20 + k * 4.6, -6, 2.6, 1.2, '#ffd890', 'opacity=".75"')).join('') + Array.from({ length: 9 }, (_, k) => R(-20 + k * 4.6, -3.4, 2.6, 1, '#9ad8ff', 'opacity=".5"')).join('') + [-14, 14].map((px) => R(px - 3, -16, 6, 6, '#5a6068', 'stroke="#2a2e36" stroke-width=".2"') + R(px - 2, -15, 4, 1, '#ffd890', 'opacity=".7"')).join('')
    + P('M-5.4 -11 L-4.2 -60 L4.2 -60 L5.4 -11Z', '#4a5058', 'stroke="#2a2e36" stroke-width=".3"') + P('M1 -11 L1.4 -60 L4.2 -60 L5.4 -11Z', '#3a4048') + P('M-5.4 -11 L-4.2 -60', 'none', 'stroke="#8a9098" stroke-width=".3"') + Array.from({ length: 15 }, (_, k) => R(-3.6, -15 - k * 3.1, 4.2, 0.6, '#9ad8ff', 'opacity=".55"') + R(1.2, -15 - k * 3.1, 2, 0.5, '#6a9ab8', 'opacity=".4"')).join('') + [-24, -36, -48].map((yy) => R(-6.8, yy, 13.6, 2.2, '#5a6068', 'stroke="#2a2e36" stroke-width=".2"') + Array.from({ length: 5 }, (_, k) => C(-5.4 + k * 2.7, yy + 1.1, 0.25, '#ffe0a0')).join('')).join('') + [-30, -42].map((yy) => P(`M-5 ${yy} L-10 ${yy - 3} L-10 ${yy - 2} L-5 ${yy + 1}Z M5 ${yy} L10 ${yy - 3} L10 ${yy - 2} L5 ${yy + 1}Z`, '#5a6068')).join('')
    + P('M-3.4 -60 L-2.4 -66 L2.4 -66 L3.4 -60Z', '#5a6068', 'stroke="#2a2e36" stroke-width=".2"') + `<g transform="rotate(-18 0 -70)">${E(0, -70, 10, 3.2, '#9aa0a8', 'stroke="#3a4048" stroke-width=".3"')}${E(0, -70.4, 8, 2.4, '#6a7078')}${Array.from({ length: 10 }, (_, k) => L(0, -70.4, Math.cos((k / 10) * Math.PI * 2) * 8, -70.4 + Math.sin((k / 10) * Math.PI * 2) * 2.4, '#5a6068', 0.15)).join('')}${L(0, -70.4, 0, -76, '#3a4048', 0.4)}${C(0, -76.4, 0.6, '#ff3a2a')}</g>` + glow(0, -76, 0.8, '#ff3a2a', 0.4) + [-2, 2].map((px) => L(px, -66, px * 1.4, -70, '#3a4048', 0.25)).join(''));
  // A hexagonal landing pad on its stilts over the shallows, with its rim
  // lights, landing markings and access walkway.
  const hexPad = (x, y, s) => g(x, y, s, 1,
    [-14, -6, 6, 14].map((px) => L(px, 0, px * 0.9, 12, '#5a6068', 1)).join('') + P('M-20 0 L-12 -5 L12 -5 L20 0 L12 5 L-12 5Z', '#8a9098', 'stroke="#3a4048" stroke-width=".4"') + P('M-20 0 L-12 5 L12 5 L20 0 L20 1.6 L12 6.6 L-12 6.6 L-20 1.6Z', '#5a6068')
    + P('M-14 0 L-9 -3.4 L9 -3.4 L14 0 L9 3.4 L-9 3.4Z', 'none', 'stroke="#ffcf3a" stroke-width=".4"') + Array.from({ length: 12 }, (_, k) => { const an = (k / 12) * Math.PI * 2; return C(Math.cos(an) * 17, Math.sin(an) * 4.4, 0.35, '#ffe0a0'); }).join('') + P('M-2 -1.4 L2 -1.4 L2 1.4 L-2 1.4Z', 'none', 'stroke="#ffcf3a" stroke-width=".3"') + R(18, -1, 16, 1.6, '#6a7078'));
  // A shoretrooper: white armour with the sand-coloured chest and leg plates,
  // the blue-grey kama sash, the low-domed helmet with its dark visor
  // T and sand trim, the E-11 rifle.
  const shoretrooper = (x, y, s, f = 1, aim = true) => g(x, y, s, f,
    E(0, 0.2, 3, 0.5, '#000', 'opacity=".25"')
    + P('M-2 -5 L-2.2 0 L-0.4 0 L-0.3 -5Z M0.3 -5 L0.4 0 L2.2 0 L2 -5Z', '#2a2a30') + R(-2.3, -1.5, 2, 1.6, '#e8e4dc', 'rx=".3" stroke="#3a3a40" stroke-width=".1"') + R(0.3, -1.5, 2, 1.6, '#e8e4dc', 'rx=".3" stroke="#3a3a40" stroke-width=".1"')
    + R(-2.1, -3.8, 1.7, 2.2, '#d8c49a', 'rx=".3" stroke="#3a3a40" stroke-width=".1"') + R(0.4, -3.8, 1.7, 2.2, '#d8c49a', 'rx=".3" stroke="#3a3a40" stroke-width=".1"') + E(-1.3, -4.1, 0.75, 0.5, '#f2f0ea', 'stroke="#3a3a40" stroke-width=".1"') + E(1.3, -4.1, 0.75, 0.5, '#f2f0ea', 'stroke="#3a3a40" stroke-width=".1"')
    + P('M-2.6 -6 L-3 -2.4 L-1 -3 L-0.6 -6Z', '#5a6a7a', 'stroke="#2a3440" stroke-width=".12"') + R(-2.5, -6.1, 5, 0.8, '#3a3a40') + [-1.6, -0.6, 0.4].map((bx) => R(bx, -6.2, 0.8, 0.8, '#d8c49a', 'stroke="#3a3a40" stroke-width=".08"')).join('')
    + P('M-2.4 -6 L-2.6 -9.6 L2.6 -9.6 L2.4 -6Z', '#2a2a30') + P('M-2.1 -6.6 L-2.3 -9.4 L2.3 -9.4 L2.1 -6.6Z', '#d8c49a', 'stroke="#3a3a40" stroke-width=".12"') + P('M-1.6 -9 L1.6 -9 L1.4 -7.6 L-1.4 -7.6Z', '#f2f0ea', 'stroke="#3a3a40" stroke-width=".1"') + R(-0.7, -8.6, 1.4, 0.6, '#3a3a40') + L(-1.8, -7, 1.8, -7, '#a89470', 0.12)
    + E(-2.8, -9.2, 1, 0.75, '#f2f0ea', 'stroke="#3a3a40" stroke-width=".1"') + E(2.8, -9.2, 1, 0.75, '#f2f0ea', 'stroke="#3a3a40" stroke-width=".1"') + R(-3.6, -9.1, 1.4, 0.4, '#5a6a7a')
    + R(-0.5, -10.4, 1, 0.8, '#2a2a30')
    + P('M-2 -11.2 C-2 -13.4 2 -13.4 2 -11.2 L2.1 -10.4 L-2.1 -10.4Z', '#f2f0ea', 'stroke="#3a3a40" stroke-width=".15"') + P('M-2 -12.2 Q0 -12.7 2 -12.2', 'none', 'stroke="#d8c49a" stroke-width=".45"') + P('M-1.5 -11.6 L1.5 -11.6 L1.5 -11.1 L0.3 -11.1 L0.3 -10.4 L-0.3 -10.4 L-0.3 -11.1 L-1.5 -11.1Z', '#141418') + P('M-2.1 -10.4 L-2.4 -9.8 L2.4 -9.8 L2.1 -10.4Z', '#d8c49a')
    + (aim ? P('M2.3 -9.4 L3.5 -8.4 L3.2 -7.9 L2.1 -8.6Z', '#f2f0ea', 'stroke="#3a3a40" stroke-width=".1"') + C(3.6, -7.9, 0.42, '#2a2a30') + R(0.4, -8.4, 5.6, 0.7, '#1a1a1e') + R(1.2, -9, 2, 0.5, '#2a2a30') + R(0.4, -8.1, 0.9, 1.4, '#1a1a1e') + L(6, -8.05, 6.8, -8.05, '#3a3a40', 0.35)
      : L(2.4, -8.8, 2.8, -6.2, '#f2f0ea', 0.8) + C(2.8, -6, 0.38, '#2a2a30') + L(1.4, -9.2, 3.6, -3.6, '#1a1a1e', 0.65)));
  // K-2SO: the tall slim black security droid, round head with two white
  // eye lights, the narrow chest with its Imperial stencils, long arms and
  // spindly legs.
  const k2so = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 3, 0.5, '#000', 'opacity=".3"')
    + [[-1, '#2a2c30'], [1, '#24262a']].map(([sd, c]) => P(`M${sd * 0.8} -7.4 L${sd * 1.3} -4 L${sd * 1.1} -0.8 L${sd * 1.7} -0.8 L${sd * 1.9} -4 L${sd * 1.5} -7.4Z`, c, 'stroke="#14161a" stroke-width=".12"') + C(sd * 1.6, -4, 0.55, '#3a3c42', 'stroke="#14161a" stroke-width=".1"') + C(sd * 1.6, -4, 0.2, '#6a6c72') + P(`M${sd * 0.6} -0.8 L${sd * 2.6} -0.8 L${sd * 2.8} 0 L${sd * 0.4} 0Z`, '#1a1c20')).join('')
    + R(-1.8, -8.4, 3.6, 1.4, '#2a2c30', 'stroke="#14161a" stroke-width=".12"') + R(-0.5, -8.2, 1, 1, '#4a4c52')
    + P('M-2.3 -14.2 L-1.7 -8.4 L1.7 -8.4 L2.3 -14.2 C1.2 -14.8 -1.2 -14.8 -2.3 -14.2Z', '#2e3034', 'stroke="#14161a" stroke-width=".2"') + P('M-1.6 -13.6 L1.6 -13.6 L1.2 -10.2 L-1.2 -10.2Z', '#3a3c42', 'stroke="#14161a" stroke-width=".1"') + [-12.8, -12, -11.2].map((yy) => L(-1.3, yy, 1.3, yy, '#5a5c62', 0.12)).join('') + C(-0.6, -12.8, 0.32, 'none', 'stroke="#c8c8c8" stroke-width=".12"') + R(0.3, -13, 0.9, 0.4, '#d8d8d8', 'opacity=".6"') + R(0.3, -12.4, 0.6, 0.3, '#d8d8d8', 'opacity=".5"') + R(-1.8, -9.6, 3.6, 0.6, '#1a1c20')
    + [[-1, -3.6, '#2a2c30'], [1, 3.8, '#26282c']].map(([sd, hx, c]) => C(sd * 2.4, -13.8, 0.75, '#3a3c42', 'stroke="#14161a" stroke-width=".12"') + P(`M${sd * 2.4} -13.6 L${sd * 2.9} -9.6 L${sd * 2.5} -9.6 L${sd * 2} -13.4Z`, c) + C(sd * 2.7, -9.4, 0.4, '#3a3c42') + P(`M${sd * 2.7} -9.2 L${hx} -5.2 L${hx - sd * 0.5} -5.1 L${sd * 2.3} -9.1Z`, c) + P(`M${hx} -5.2 l${sd * 0.4} 1 M${hx - sd * 0.25} -5.1 l0 1.1 M${hx - sd * 0.5} -5.1 l${-sd * 0.3} 1`, 'none', 'stroke="#1a1c20" stroke-width=".25" stroke-linecap="round"')).join('')
    + R(-0.35, -15.4, 0.7, 1.4, '#1a1c20') + L(-0.6, -15.2, -0.6, -14.2, '#4a4c52', 0.12) + L(0.6, -15.2, 0.6, -14.2, '#4a4c52', 0.12)
    + P('M-1.9 -16.4 C-1.9 -18.4 1.9 -18.4 1.9 -16.4 C1.9 -15.6 1.2 -15.1 0 -15.1 C-1.2 -15.1 -1.9 -15.6 -1.9 -16.4Z', '#2e3034', 'stroke="#14161a" stroke-width=".2"') + P('M-1.9 -16.6 Q0 -17.2 1.9 -16.6 L1.8 -16.1 Q0 -16.6 -1.8 -16.1Z', '#3e4046') + P('M-1.2 -18 Q0 -18.4 1.2 -18', 'none', 'stroke="#5a5c62" stroke-width=".15"')
    + C(-0.75, -16.3, 0.42, '#14161a') + C(0.75, -16.3, 0.42, '#14161a') + C(-0.75, -16.3, 0.3, '#f0f4f8') + C(0.75, -16.3, 0.3, '#f0f4f8') + glow(-0.75, -16.3, 0.35, '#ffffff', 0.3) + glow(0.75, -16.3, 0.35, '#ffffff', 0.3) + L(-0.4, -15.5, 0.4, -15.5, '#1a1c20', 0.12));
  // Grand Moff Tarkin: the olive-grey uniform with its rank plaque and code
  // cylinders, black belt and boots, gaunt face, swept-back grey hair,
  // hands clasped behind his back.
  const tarkin = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 3, 0.5, '#000', 'opacity=".3"') + P('M-1.9 0 L-1.9 -3 L-0.2 -3 L-0.2 0Z M0.2 0 L0.2 -3 L1.9 -3 L1.9 0Z', '#141414') + P('M-1.9 -3 L-0.2 -3 M0.2 -3 L1.9 -3', 'none', 'stroke="#3a3a3a" stroke-width=".15"') + E(-1, -0.2, 1.1, 0.35, '#0a0a0a') + E(1, -0.2, 1.1, 0.35, '#0a0a0a')
    + P('M-1.9 -2.8 L-2.1 -6 L2.1 -6 L1.9 -2.8Z', '#5a6250') + L(0, -5.8, 0, -3, '#4a5240', 0.2)
    + P('M-2.4 -6 L-2.7 -10.6 C-2.7 -11.4 2.7 -11.4 2.7 -10.6 L2.4 -6Z', '#6a7262', 'stroke="#3a4232" stroke-width=".2"') + P('M-2.4 -6 L-2.6 -7.6 L2.6 -7.6 L2.4 -6Z', '#626a5a') + P('M-1.2 -11 L-1 -7.6 M1.2 -11 L1 -7.6', 'none', 'stroke="#5a6250" stroke-width=".15"') + R(-2.5, -6.5, 5, 0.75, '#141414') + R(-0.45, -6.6, 0.9, 0.9, '#c8c8c0', 'stroke="#6a6a62" stroke-width=".08"')
    + R(-2.1, -10.1, 1.9, 1, '#d0d0c8', 'stroke="#6a6a62" stroke-width=".08"') + [-1.9, -1.35, -0.8].map((px, k) => R(px, -10, 0.45, 0.8, ['#c83a2a', '#2a6ac8', '#e8c040'][k])).join('') + [-2, -1.4, -0.8].map((px, k) => R(px, -9, 0.45, 0.5, ['#e8c040', '#c83a2a', '#2a6ac8'][k])).join('') + [0.8, 1.25, 1.7].map((px) => R(px, -10.4, 0.28, 1.2, '#d0d0c8', 'stroke="#6a6a62" stroke-width=".06"')).join('')
    + P('M-2.6 -10.6 L-3.2 -8 L-2.6 -6.6 M2.6 -10.6 L3.2 -8 L2.6 -6.6', 'none', 'stroke="#6a7262" stroke-width=".9" stroke-linecap="round"')
    + P('M-1.1 -11.4 L1.1 -11.4 L0.9 -10.5 L-0.9 -10.5Z', '#6a7262', 'stroke="#3a4232" stroke-width=".12"') + R(-0.5, -12, 1, 0.8, '#d8bca4')
    + P('M-1.35 -13 C-1.4 -14.6 1.4 -14.6 1.35 -13 L1.2 -12.2 C1 -11.5 0.6 -11.2 0 -11.2 C-0.6 -11.2 -1 -11.5 -1.2 -12.2Z', '#e0c8b0', 'stroke="#8a6a5a" stroke-width=".12"') + P('M-1.5 -13.2 C-1.6 -15.2 1.6 -15.2 1.5 -13.2 L1.3 -13.8 C0.8 -14.4 -0.8 -14.4 -1.3 -13.8Z', '#b8b4ac') + P('M-1.3 -13.8 Q-1.1 -14.6 0 -14.7', 'none', 'stroke="#d8d4cc" stroke-width=".15"')
    + P('M-1 -13.1 L-0.25 -12.95 M1 -13.1 L0.25 -12.95', 'none', 'stroke="#6a5a4a" stroke-width=".16"') + E(-0.55, -12.7, 0.24, 0.15, '#f4f0e8') + E(0.55, -12.7, 0.24, 0.15, '#f4f0e8') + C(-0.5, -12.7, 0.11, '#3a4a5a') + C(0.6, -12.7, 0.11, '#3a4a5a') + P('M0 -12.6 L-0.15 -12 L0.12 -12', 'none', 'stroke="#a8806a" stroke-width=".12"') + P('M-0.45 -11.6 L0.45 -11.6', 'none', 'stroke="#8a5a4a" stroke-width=".14"') + P('M-1.1 -12.6 L-0.8 -11.8 M1.1 -12.6 L0.8 -11.8', 'none', 'stroke="#c8a890" stroke-width=".14"'));
  // The first Death Star, complete: shaded grey plating with seams, surface
  // blocks and lights, the equatorial trench, and the superlaser dish in the
  // northern hemisphere, optionally firing its green beam.
  const deathStar1 = (x, y, r, firing = false) => {
    const id = `ds1c${Math.round(x)}${Math.round(y)}${Math.round(r)}`;
    const [dg, dd] = LG([[0, '#d0d8e0'], [0.5, '#8a929c'], [1, '#3a4048']], 0.15, 0.1, 0.95, 1);
    const [sg, sd] = LG([[0, '#000', 0], [0.55, '#000', 0.12], [1, '#000', 0.6]], 0.1, 0.1, 1, 0.95);
    let o = C(x, y, r, dg);
    for (let k = 1; k < 14; k++) { const yy = y - r + (2 * r * k) / 14; const w = Math.sqrt(r * r - (yy - y) * (yy - y)); o += P(`M${(x - w).toFixed(2)} ${yy.toFixed(2)} Q${x} ${(yy + r * 0.07).toFixed(2)} ${(x + w).toFixed(2)} ${yy.toFixed(2)}`, 'none', 'stroke="#5a626c" stroke-width=".22" opacity=".7"'); }
    for (let k = 1; k < 7; k++) o += E(x, y, r * Math.sin((k / 7) * Math.PI), r, 'none', 'stroke="#5a626c" stroke-width=".18" opacity=".5"');
    for (let k = 0; k < 140; k++) { const px = x - r + (((k * 37) % 101) / 101) * 2 * r; const py = y - r + (((k * 61) % 103) / 103) * 2 * r; const q = r * (0.018 + (k % 3) * 0.01); o += R(px.toFixed(2), py.toFixed(2), (q * 1.8).toFixed(2), q.toFixed(2), k % 4 === 0 ? '#3e464e' : k % 4 === 1 ? '#b8c0c8' : '#7a828c', 'opacity=".7"'); if (k % 4 === 2) o += C(px.toFixed(2), py.toFixed(2), (r * 0.009).toFixed(2), '#fff4c8'); }
    o += P(`M${x - r} ${y} Q${x} ${y + r * 0.07} ${x + r} ${y}`, 'none', `stroke="#22282e" stroke-width="${(r * 0.035).toFixed(2)}"`) + P(`M${x - r} ${y - r * 0.025} Q${x} ${y + r * 0.045} ${x + r} ${y - r * 0.025}`, 'none', 'stroke="#c8d0d8" stroke-width=".2" opacity=".7"');
    const dx = x - r * 0.38; const dy = y - r * 0.36; const dr = r * 0.25;
    o += C(dx, dy, dr * 1.08, '#9aa2ac', 'opacity=".6"') + C(dx, dy, dr, '#6a727c', 'stroke="#3a4048" stroke-width=".3"') + C(dx, dy, dr * 0.78, 'none', 'stroke="#4a525c" stroke-width=".25"') + C(dx, dy, dr * 0.55, '#5a626c', 'stroke="#3a4048" stroke-width=".25"') + Array.from({ length: 8 }, (_, k) => { const an = (k / 8) * Math.PI * 2; return C(dx + Math.cos(an) * dr * 0.66, dy + Math.sin(an) * dr * 0.66, dr * 0.07, firing ? '#8aff8a' : '#3a4048'); }).join('') + C(dx, dy, dr * 0.18, firing ? '#c8ffc8' : '#3a4a44');
    o += sd + C(x, y, r, sg);
    return dd + `<clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath><g clip-path="url(#${id})">${o}</g>` + P(`M${x - r * 0.96} ${y - r * 0.28} A${r} ${r} 0 0 1 ${x + r * 0.28} ${y - r * 0.96}`, 'none', 'stroke="#f0f4f8" stroke-width=".5" opacity=".6"') + (firing ? glow(dx, dy, dr * 0.5, '#6aff6a', 0.5) : '');
  };
  // Scarif from orbit: blue ocean, island chains, cloud swirls, the shield
  // as a faint shell, the lit limb.
  const scarifPlanet = (x, y, r) => { const id = `scp${Math.round(x)}${Math.round(y)}`; const [pg, pd] = LG([[0, '#7ad8f0'], [0.5, '#2a8ac8'], [1, '#0a2a5a']], 0.1, 0, 0.9, 1); return pd + C(x, y, r, pg) + `<clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath><g clip-path="url(#${id})">${Array.from({ length: 22 }, (_, k) => { const cx = x - r + ((k * 37) % 100) / 100 * 2 * r; const cy = y - r + ((k * 53) % 100) / 100 * 2 * r; return E(cx, cy, 1.4 + (k % 3), 0.7 + (k % 2) * 0.5, '#e8d8a0', 'opacity=".75"') + E(cx + 0.4, cy, 0.8, 0.4, '#3a9a4a', 'opacity=".7"'); }).join('')}${Array.from({ length: 10 }, (_, k) => { const cx = x - r + ((k * 41) % 100) / 100 * 2 * r; const cy = y - r + ((k * 29) % 100) / 100 * 2 * r; return E(cx, cy, 8 + (k % 3) * 3, 1.6, '#ffffff', `opacity=".5" transform="rotate(${-10 + (k % 4) * 6} ${cx} ${cy})"`); }).join('')}</g>` + C(x, y, r, 'none', 'stroke="#c8f0ff" stroke-width="1" opacity=".6"') + C(x, y, r + 2.4, 'none', 'stroke="#c8f0ff" stroke-width=".4" opacity=".35"'); };
  // Scarif's shield and the gate in it: the planetary shield as a faint
  // shimmering shell over the world with its hex grid, and the great ring
  // station of the shield gate lying in that shell, its armoured segments,
  // docking blocks and lights, the opening clear of shimmer where ships
  // pass through to the planet below.
  const shieldShell = (cx, cy, r) => { const id = `shl${Math.round(cx)}${Math.round(cy)}`; return `<clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>` + C(cx, cy, r, '#8ad8ff', 'opacity=".07"') + `<g clip-path="url(#${id})" opacity=".35">${Array.from({ length: 22 }, (_, k) => { const x = cx - r + k * (2 * r / 22); return P(`M${x} ${cy - r} l2.4 1.4 l0 2.8 l-2.4 1.4 l-2.4 -1.4 l0 -2.8Z`, 'none', 'stroke="#c8f0ff" stroke-width=".18"'); }).join('')}${Array.from({ length: 30 }, (_, k) => { const x = cx - r + ((k * 37) % 100) / 100 * 2 * r; const y = cy - r + 2 + ((k * 23) % 14); return P(`M${x} ${y} l2.4 1.4 l0 2.8 l-2.4 1.4 l-2.4 -1.4 l0 -2.8Z`, 'none', 'stroke="#c8f0ff" stroke-width=".18"'); }).join('')}</g>` + C(cx, cy, r, 'none', 'stroke="#c8f0ff" stroke-width=".8" opacity=".6"') + C(cx, cy, r - 1.2, 'none', 'stroke="#8ad8ff" stroke-width=".4" opacity=".35"'); };
  const shellGate = (x, y, s) => g(x, y, s, 1,
    E(0, 0, 30, 7, '#03060e', 'opacity=".75"') + E(0, 1.6, 26, 5, '#2a8ac8', 'opacity=".25"')
    + E(0, 0, 30, 7, 'none', 'stroke="#3a4048" stroke-width="5"') + E(0, 0, 30, 7, 'none', 'stroke="#7a8088" stroke-width="3.2"') + E(0, -0.8, 30, 7, 'none', 'stroke="#c8ccd2" stroke-width=".6"') + E(0, 0, 27.4, 5.6, 'none', 'stroke="#c8f0ff" stroke-width=".3" opacity=".7"')
    + Array.from({ length: 20 }, (_, k) => { const an = (k / 20) * Math.PI * 2; const px = Math.cos(an) * 30; const py = Math.sin(an) * 7; return R(px - 1.2, py - 1.8, 2.4, 3.2, k % 5 === 0 ? '#5a6068' : '#4a5058', 'stroke="#2a2e36" stroke-width=".15"') + C(px, py - 0.4, 0.3, k % 2 ? '#ffe0a0' : '#ff6a4a'); }).join('')
    + [-1, 1].map((sd) => P(`M${sd * 30 - 4} -2 L${sd * 30 - 4} -8 L${sd * 30 + 4} -8 L${sd * 30 + 4} -2Z`, '#6a7078', 'stroke="#2a2e36" stroke-width=".25"') + R(sd * 30 - 3, -7, 6, 1, '#9ad8ff', 'opacity=".6"') + R(sd * 30 - 3, -5, 6, 0.6, '#ffe0a0', 'opacity=".5"') + L(sd * 30, -8, sd * 30, -12, '#4a5058', 0.4) + C(sd * 30, -12.2, 0.4, '#ff3a2a')).join('')
    + R(-4, -10, 8, 5, '#6a7078', 'stroke="#2a2e36" stroke-width=".25"') + R(-3, -9, 6, 1, '#9ad8ff', 'opacity=".6"') + L(0, -10, 0, -14, '#4a5058', 0.4));
  // A U-wing from above: the long nose, cockpit canopy, the boxy troop cabin,
  // the two big engine pods and the wings swept forward, blue-grey markings.
  const uwing = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M-4 -2.4 L-1 -14 L1.4 -14 L0.4 -2.4Z M-4 2.4 L-1 14 L1.4 14 L0.4 2.4Z', '#c8ccd0', 'stroke="#4a5058" stroke-width=".3"') + [-1, 1].map((sd) => [5, 8, 11].map((t) => L(-2.6 + t * 0.16, sd * t, 0.9 - t * 0.02, sd * t, '#9aa0a6', 0.15)).join('') + P(`M-2.2 ${sd * 8} L0.7 ${sd * 8}`, 'none', 'stroke="#4a6a8a" stroke-width=".9"') + R(-1.4, sd > 0 ? 13.6 : -14.6, 3.6, 1, '#3a3e46') + L(2.2, sd * 14.1, 4.4, sd * 14.1, '#2a2e36', 0.35)).join('')
    + [-1, 1].map((sd) => R(-10.6, sd > 0 ? 1.6 : -5, 8.6, 3.4, '#a8acb2', 'rx="1.5" stroke="#4a5058" stroke-width=".3"') + R(-3, sd > 0 ? 1.8 : -4.8, 1, 3, '#5a6068') + [-8, -6].map((px) => L(px, sd > 0 ? 1.8 : -4.8, px, sd > 0 ? 4.8 : -1.8, '#7a8088', 0.15)).join('') + glow(-11.2, sd * 3.3, 1.3, '#9fd8ff', 0.5) + E(-10.8, sd * 3.3, 0.5, 1.2, '#d8f0ff')).join('')
    + P('M-8 -2.4 L4 -2.6 L12 -1 L13 0 L12 1 L4 2.6 L-8 2.4Z', '#d8dce0', 'stroke="#4a5058" stroke-width=".35"') + P('M-8 -2.4 L4 -2.6 L12 -1 L-8 -0.6Z', '#ffffff', 'opacity=".35"') + R(-6, -2.2, 8, 4.4, '#b8bcc2', 'stroke="#4a5058" stroke-width=".2"') + [-4.4, -2.8, -1.2, 0.4].map((px) => L(px, -2.2, px, 2.2, '#8a9098', 0.15)).join('') + R(-5.6, -1, 7, 2, '#a0a6ac', 'opacity=".6"') + P('M6 -1.6 L11 -0.6 L11 0.6 L6 1.6Z', '#1a2a3a') + L(8.4, -1.1, 8.4, 1.1, '#d8dce0', 0.15) + P('M7 -1 L9 -0.4', 'none', 'stroke="#8ab0d0" stroke-width=".3"') + R(0, -2.6, 3, 0.6, '#4a6a8a') + R(0, 2, 3, 0.6, '#4a6a8a') + C(12.4, 0, 0.3, '#ff6a4a'), a);
  // A U-wing side-on on the pad, nose right: the long white hull with its
  // blue-grey stripes, the cockpit canopy, the troop bay with its big side
  // door open and lit inside, the engine pod and the wing swept forward
  // above, landing legs, vents and panel lines.
  const uwingSide = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 6.6, 22, 1.4, '#000', 'opacity=".25"') + [[-10, 1.6], [8, 1.6]].map(([px]) => L(px, 3.4, px - 1, 6.2, '#4a5058', 0.7) + R(px - 2.2, 6, 2.6, 0.6, '#3a3e46')).join('')
    + P('M-15 -8.6 L12 -14 L13 -13 L-12 -6.6Z', '#c8ccd0', 'stroke="#4a5058" stroke-width=".3"') + [-8, -2, 4].map((px) => L(px, -7.6 - (px + 15) * 0.2, px + 0.8, -6.8 - (px + 15) * 0.2, '#8a9098', 0.15)).join('') + P('M-2 -10.6 L3 -11.6', 'none', 'stroke="#4a6a8a" stroke-width=".9"') + R(12, -14.6, 5, 0.6, '#2a2e36') + R(11, -14.4, 2, 1.4, '#3a3e46')
    + R(-21, -9, 12, 5, '#a8acb2', 'rx="2" stroke="#4a5058" stroke-width=".3"') + R(-21, -9, 12, 1.4, '#c8ccd0', 'rx="1"') + R(-10.4, -8.6, 1.4, 4.2, '#5a6068') + [-18, -15, -12].map((px) => L(px, -8.6, px, -4.4, '#7a8088', 0.15)).join('') + glow(-21.6, -6.5, 1.4, '#9fd8ff', 0.4)
    + P('M20 -0.4 C18 -4 12 -5.4 6 -5.4 L-13 -5.4 L-15.4 -3 L-15.4 3 L-13 4.6 L6 4.6 C12 4.6 18 3 20 0.6Z', '#dcdfe2', 'stroke="#4a5058" stroke-width=".35"') + P('M20 -0.4 C18 -4 12 -5.4 6 -5.4 L-13 -5.4 L-15.4 -3 L18 -2.4Z', '#ffffff', 'opacity=".35"')
    + R(-13, -0.6, 32, 1, '#4a6a8a') + R(-13, 2.6, 30, 0.5, '#7a8a9a') + [-11, -6, 6, 10, 14].map((px) => L(px, -5.2, px, 4.4, '#a8acb2', 0.18)).join('') + [[-14, -2], [-14, 0.6]].map(([px, py]) => R(px, py, 1, 1.2, '#5a6068')).join('')
    + R(-8.4, -4.4, 12, 7.6, '#3a3e46', 'stroke="#2a2e36" stroke-width=".3"') + R(-7.8, -3.8, 10.8, 6.4, '#5a4a3a') + E(-2.4, 2, 5, 1, '#ffd890', 'opacity=".3"') + R(-7.8, -3.8, 10.8, 0.6, '#ffe8b0', 'opacity=".5"') + [-6, -3.6].map((px) => R(px, -2.8, 1.6, 5, '#2a2a2e', 'opacity=".7"')).join('') + R(-9, -4.8, 1, 8.4, '#c8ccd0', 'stroke="#4a5058" stroke-width=".15"')
    + P('M8 -4.8 C11 -4.8 14.4 -4 16.6 -2.4 L16 -1.4 L8 -1.6Z', '#16222e', 'stroke="#4a5058" stroke-width=".25"') + L(11.4, -4.6, 11.6, -1.6, '#dcdfe2', 0.25) + L(14.2, -3.6, 14, -1.5, '#dcdfe2', 0.2) + P('M9 -4 L11 -4.2', 'none', 'stroke="#8ab0d0" stroke-width=".35"') + C(19.4, 0, 0.4, '#ff6a4a'), 0);
  // Battle damage on the sand: a crater with its scorch ring, burning wreck
  // fragments, a rising smoke column.
  const crater = (x, y, r) => E(x, y, r * 1.6, r * 0.5, '#3a3028', 'opacity=".6"') + E(x, y, r, r * 0.32, '#2a2018') + E(x, y - r * 0.08, r * 0.6, r * 0.18, '#1a1410') + Array.from({ length: 6 }, (_, k) => E(x + (k - 2.5) * r * 0.5, y - r * 0.3 - (k % 2) * r * 0.1, r * 0.18, r * 0.1, '#5a4a3a')).join('');
  const smoke = (x, y, h, a = 0.5) => Array.from({ length: 6 }, (_, k) => { const yy = y - (k * h) / 6; const xx = x + k * 1.6 + (k % 2) * 1.2; const r = 2.4 + k * 1.3; return C(xx, yy, r, k < 2 ? '#3a3632' : '#5a5650', `opacity="${(a * (1 - k * 0.12)).toFixed(2)}"`); }).join('');
  const fire = (x, y, r) => glow(x, y, r, '#ff8a3a', 0.5) + P(`M${x - r} ${y} Q${x - r * 0.6} ${y - r * 1.6} ${x - r * 0.2} ${y - r * 0.6} Q${x} ${y - r * 2.2} ${x + r * 0.3} ${y - r * 0.7} Q${x + r * 0.7} ${y - r * 1.5} ${x + r} ${y}Z`, '#ff9a3a') + P(`M${x - r * 0.5} ${y} Q${x - r * 0.2} ${y - r} ${x} ${y - r * 0.4} Q${x + r * 0.3} ${y - r * 1.1} ${x + r * 0.5} ${y}Z`, '#ffe08a');
  const wreck = (x, y, s) => g(x, y, s, 1, P('M-6 0 L-4 -3 L2 -4 L6 -1 L5 0Z', '#4a4e56', 'stroke="#2a2e36" stroke-width=".3"') + P('M-2 -3.4 L-3 -7 L-1 -7.4 L0 -3.6Z', '#3a3e46', 'stroke="#2a2e36" stroke-width=".25"') + L(-4, -2, 4, -2.6, '#2a2e36', 0.3) + fire(1, -1, 1.8));
  // Imperial shore buildings: a bunker block, a comms mast, fuel tanks.
  const shoreBase = (x, y, s) => g(x, y, s, 1,
    R(-14, -6, 18, 6, '#6a7078', 'stroke="#3a4048" stroke-width=".3"') + R(-14, -7, 18, 1, '#8a9098') + Array.from({ length: 5 }, (_, k) => R(-12.6 + k * 3.4, -4.4, 2, 1, '#ffd890', 'opacity=".7"')).join('') + R(-6, -3, 4, 3, '#3a3e46')
    + [8, 12.4].map((px) => C(px, -3, 2.2, '#9aa0a8', 'stroke="#4a5058" stroke-width=".3"') + L(px - 2.2, -3, px + 2.2, -3, '#6a7078', 0.25) + R(px - 0.6, -1, 1.2, 1, '#4a5058')).join('')
    + L(-16, 0, -16, -16, '#5a6068', 0.6) + L(-18, -12, -14, -12, '#5a6068', 0.4) + L(-17.4, -8, -14.6, -8, '#5a6068', 0.3) + C(-16, -16.4, 0.5, '#ff3a2a') + E(-12, -8.4, 2, 0.7, '#9aa0a8', 'stroke="#4a5058" stroke-width=".2"'));
  // An AT-ACT cargo walker: the long body with the cargo pod between its
  // front and rear sections, the small head, the four tall legs.
  const atact = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.4, 16, 1.2, '#000', 'opacity=".25"') + [[-9, '#6a6e76', -1], [-5, '#5a5e66', 1], [6, '#6a6e76', -1], [10, '#5a5e66', 1]].map(([lx, c, ph]) => { const kx = lx + ph * 0.6 - 1.2; return P(`M${lx - 1.1} -18 L${kx - 0.9} -9 L${kx + 0.9} -9 L${lx + 1.1} -18Z`, c, 'stroke="#2a2e36" stroke-width=".2"') + P(`M${kx - 0.8} -9 L${lx - 0.7} -1.4 L${lx + 0.7} -1.4 L${kx + 0.8} -9Z`, c, 'stroke="#2a2e36" stroke-width=".2"') + L(lx - 0.4, -17, kx, -10, '#3e424a', 0.3) + C(kx, -9, 1.1, '#4a4e56', 'stroke="#2a2e36" stroke-width=".2"') + C(kx, -9, 0.45, '#8a8e96') + P(`M${lx - 2} -0.2 L${lx - 1.4} -1.6 L${lx + 1.4} -1.6 L${lx + 2} -0.2Z`, c, 'stroke="#2a2e36" stroke-width=".2"') + [-1.2, 0, 1.2].map((tx) => L(lx + tx, -1.4, lx + tx, -0.2, '#3a3e46', 0.15)).join(''); }).join('')
    + P('M-15 -27 L13 -27 L16 -23 L16 -17 L-15 -17 L-17 -21Z', '#8a8e96', 'stroke="#2a2e36" stroke-width=".3"') + P('M-15 -27 L13 -27 L16 -23 L-16.4 -22Z', '#a8acb4', 'opacity=".5"') + [-12, -9, 9, 12].map((px) => C(px, -21.6, 0.35, '#4a4e56')).join('') + [-14, -11, 10, 13].map((px) => L(px, -26.6, px, -17.4, '#6a6e76', 0.18)).join('')
    + R(-7, -28.6, 14, 12.4, '#c8a040', 'stroke="#5a4a20" stroke-width=".35"') + [-3.6, 0, 3.6].map((px) => L(px, -28.2, px, -16.6, '#8a7020', 0.3)).join('') + L(-7, -22.4, 7, -22.4, '#8a7020', 0.3) + R(-6, -27.6, 4, 1.4, '#3a3020', 'opacity=".6"') + R(2.4, -20.6, 3.6, 1.2, '#3a3020', 'opacity=".5"') + P('M-6.4 -18 L-4.4 -18 L-5.4 -19.6Z', '#1a1a1a')
    + P('M16 -24 L22.4 -25 L25.6 -22.6 L25.6 -19 L20.4 -17.8 L16 -19Z', '#7a7e86', 'stroke="#2a2e36" stroke-width=".3"') + R(20.4, -23.4, 3.6, 1.1, '#1a1e24') + R(20.6, -23.2, 1.4, 0.6, '#5a7aa8', 'opacity=".6"') + R(25.2, -20.8, 2.8, 0.5, '#3a3e46') + R(25.2, -19.8, 2.4, 0.5, '#3a3e46') + [18, 20].map((px) => L(px, -24.4, px, -18.4, '#5a5e66', 0.18)).join('') + R(-18, -22, 1.4, 2.4, '#5a5e66'));
  // A Mon Calamari cruiser: the long organic hull with its bulges and
  // pods, rows of lights, the engines glowing at the back.
  const monCal = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M-26 0 C-26 -5 -14 -7 0 -7 C12 -7 22 -5 26 -2 C27 0 27 1 26 2 C22 4 12 6 0 6 C-14 6 -26 4 -26 0Z', '#7a8aa0', 'stroke="#3a4a5e" stroke-width=".4"') + E(-6, -5.6, 7, 2.4, '#8a9ab0', 'stroke="#3a4a5e" stroke-width=".3"') + E(8, -5, 5, 2, '#8a9ab0', 'stroke="#3a4a5e" stroke-width=".3"') + E(-14, 4.6, 6, 2, '#6a7a90', 'stroke="#3a4a5e" stroke-width=".3"')
    + Array.from({ length: 16 }, (_, k) => C(-22 + k * 3, -1 + Math.sin(k) * 0.6, 0.3, '#fff0c8')).join('') + Array.from({ length: 12 }, (_, k) => C(-18 + k * 3.2, 2.6, 0.25, '#fff0c8')).join('') + [-1, 1].map((sd) => glow(-27, sd * 2, 1.4, '#9fd8ff', 0.5)).join('') + C(24, -0.4, 0.8, '#9ad8ff'), a);
  const S = {
    // 1 · The Shield Gate (fleet): high orbit over Scarif. The ocean world
    // fills the lower view; the planetary shield shimmers as a shell just
    // above it, and the great ring of the shield gate lies in that shell,
    // its opening clear down to the planet. A Star Destroyer guards it; a
    // U-wing dives for the opening as a TIE fighter and a TIE Interceptor
    // chase it, their shots running from their guns.
    shield_gate: () => R(0, 0, 160, 90, '#03060e') + starfield(80, 11)
      + scarifPlanet(80, 178, 116) + shieldShell(80, 178, 122)
      + shellGate(80, 57, 1.25)
      + (kit.isd ? kit.isd(132, 26, 1.3, '#7a828c') : '')
      + uwing(66, 40, 1, 40)
      + (kit.tie ? kit.tie(26, 20, 1.1) : '') + (kit.interceptor ? kit.interceptor(36, 48, 0.75, -6) : '')
      + shots([33, 20], [62, 36], [0.2, 0.55], 0.12) + (() => { const t = gunsAt(36, 48, 0.75, -6, TIEGUNS); return shots(t[0], [62, 42], [0.25, 0.62], 0.12); })(),

    // 2 · Beach Landing: the island beach under the blue sky and the shield's
    // shimmer. Down the shore: Imperial bunkers, fuel tanks and comms masts,
    // a landing pad and the Citadel, an AT-ACT wading in the distance, smoke
    // rising from hits; on the sand, crates and rocks and churned tracks, a
    // broken palm; shoretroopers advance up the beach.
    beach_landing: () => shieldSky()
      + E(30, 22, 30, 4, '#ffffff', 'opacity=".55"') + E(120, 16, 36, 3.4, '#ffffff', 'opacity=".5"')
      + sea(50, 1) + P('M70 50 L160 46 L160 58 L76 58Z', '#d8e8c8', 'opacity=".55"') + citadel(146, 52, 0.42) + shoreBase(118, 54, 0.8) + shoreBase(92, 54, 0.6) + hexPad(128, 50, 0.3) + atact(70, 54, 0.32, -1)
      + smoke(100, 50, 26, 0.45) + smoke(60, 52, 20, 0.35) + fire(100, 52, 1.4)
      + beach(62) + palm(14, 70, 30, 6, 1.2) + palm(36, 66, 24, -4, 1) + palm(150, 72, 28, -6, 1.1) + P('M132 66 L138 60 L146 62', 'none', 'stroke="#8a6a44" stroke-width="1.2"')
      + [[24, 78, 6, 4], [30, 75, 4, 3], [134, 80, 6, 4]].map(([x, y, w, h]) => R(x - w / 2, y - h / 2, w, h, '#7a6a4a', 'stroke="#3a2e1e" stroke-width=".3"') + R(x - w / 2, y - h / 2, w, 0.7, '#ffcf3a', 'opacity=".5"')).join('') + E(44, 84, 4, 1.6, '#9a9488', 'stroke="#5a564e" stroke-width=".2"') + E(120, 86, 3, 1.2, '#9a9488', 'stroke="#5a564e" stroke-width=".2"') + crater(100, 84, 4)
      + Array.from({ length: 10 }, (_, k) => E(52 + k * 7, 82 + (k % 2) * 1.4, 1.2, 0.5, '#d8c8a0')).join('')
      + shoretrooper(60, 78, 2.7, 1) + shoretrooper(86, 80, 2.9, 1) + shoretrooper(114, 78, 2.7, -1, false) + shoretrooper(140, 70, 1.6, -1) + shoretrooper(22, 70, 1.5, 1),

    // 3 · Landing Pad Nine: the hexagonal pad on its stilts over the lagoon,
    // and a U-wing on it at true size, side door open and its bay lit;
    // shoretroopers and a death trooper small beside it as they would be,
    // a fuel line and crates, palms on the shore and the Citadel beyond.
    landing_pad_nine: () => shieldSky()
      + citadel(140, 50, 0.72) + sea(46, 2)
      + [-60, -36, -12, 12, 36, 60].map((dx) => L(80 + dx, 62, 80 + dx * 0.9, 90, '#5a6068', 1.4)).join('') + P('M4 62 L28 52 L132 52 L156 62 L132 72 L28 72Z', '#8a9098', 'stroke="#3a4048" stroke-width=".5"') + P('M4 62 L28 72 L132 72 L156 62 L156 65 L132 75 L28 75 L4 65Z', '#5a6068') + P('M24 62 L38 55 L122 55 L136 62 L122 69 L38 69Z', 'none', 'stroke="#ffcf3a" stroke-width=".5"') + Array.from({ length: 16 }, (_, k) => { const an = (k / 16) * Math.PI * 2; return C(80 + Math.cos(an) * 70, 62 + Math.sin(an) * 9, 0.5, '#ffe0a0') + glow(80 + Math.cos(an) * 70, 62 + Math.sin(an) * 9, 0.4, '#ffe0a0', 0.4); }).join('') + Array.from({ length: 12 }, (_, k) => L(28 + k * 9.4, 52, 28 + k * 9.4, 72, '#7a8088', 0.15)).join('')
      + uwingSide(78, 58, 2.4, 1)
      + P('M30 68 Q40 72 50 66', 'none', 'stroke="#2a2a2e" stroke-width=".6"') + [[30, 66, 4, 3], [34, 64, 3, 2.4], [126, 66, 4, 3]].map(([x, y, w, h]) => R(x - w / 2, y - h / 2, w, h, '#6a6e76', 'stroke="#3a3e46" stroke-width=".2"') + R(x - w / 2, y - h / 2, w, 0.5, '#ffcf3a', 'opacity=".6"')).join('')
      + shoretrooper(46, 68, 1.05, 1) + shoretrooper(56, 70, 1.05, 1, false) + deathTrooper(110, 69, 1.05, -1) + shoretrooper(120, 70, 1.05, -1)
      + beach(82, '#efe0bc') + palm(146, 90, 26, -6, 1) + palm(10, 90, 24, 6, 0.95) + shoretrooper(20, 89, 1.6, 1) + shoretrooper(136, 90, 1.6, -1, false),

    // 4 · K-2's Reprogramming: inside the Citadel's control deck, in full.
    // Ceiling light panels and beams, banks of consoles with readouts and
    // graphs along the walls, a tall window on the turquoise sea and the
    // landing pads, the holotable throwing a blue hologram of the Death Star
    // plans, cable runs and a grated floor; K-2SO at the main terminal with
    // shoretroopers at his back.
    k2s_reprogramming: () => fill([[0, '#2a3038'], [1, '#14181e']])
      + P('M0 0 L160 0 L148 8 L12 8Z', '#3a4048') + [24, 52, 80, 108, 136].map((x) => R(x - 9, 2, 18, 2.4, '#e8f4ff', 'opacity=".8"') + glow(x, 3.2, 3, '#e8f4ff', 0.15)).join('') + [20, 60, 100, 140].map((x) => L(x, 0, x + (x - 80) * -0.08, 8, '#2a2e36', 0.8)).join('')
      + P('M30 10 L130 10 L124 44 L36 44Z', '#7ac8e8') + `<clipPath id="sc-win"><path d="M30 10 L130 10 L124 44 L36 44Z"/></clipPath><g clip-path="url(#sc-win)">${shieldSky()}${sea(32, 3)}${palm(112, 44, 14, -3, 0.55)}${palm(46, 44, 12, 3, 0.5)}${hexPad(64, 36, 0.5)}${hexPad(96, 38, 0.36)}${shoreBase(80, 32, 0.4)}</g>` + [55, 80, 105].map((x) => L(x, 10, x - (x - 80) * 0.06, 44, '#3a4048', 1.4)).join('') + P('M30 10 L130 10 L124 44 L36 44Z', 'none', 'stroke="#4a5058" stroke-width="1.6"') + R(30, 26, 100, 0.8, '#3a4048')
      + P('M0 8 L30 10 L36 44 L0 58Z', '#3a4048') + P('M160 8 L130 10 L124 44 L160 58Z', '#343a42')
      + [[4, 14], [4, 28], [18, 18], [18, 32], [146, 14], [146, 28], [132, 18], [132, 32]].map(([x, y]) => R(x, y, 10, 8, '#1a2028', 'stroke="#5a6068" stroke-width=".3"') + R(x + 1, y + 1, 8, 5, '#0a2a3a') + P(`M${x + 1.4} ${y + 5} L${x + 3} ${y + 3} L${x + 5} ${y + 4} L${x + 7} ${y + 1.6} L${x + 8.6} ${y + 2.4}`, 'none', 'stroke="#5ad8ff" stroke-width=".3"') + [0, 1].map((k) => L(x + 1.4, y + 6.6 + k * 0.6, x + 4 + k * 2, y + 6.6 + k * 0.6, '#3aff6a', 0.15)).join('')).join('')
      + P('M0 58 L36 44 L124 44 L160 58 L160 90 L0 90Z', '#22282e') + Array.from({ length: 9 }, (_, k) => L(36 + k * 11, 44, -20 + k * 25, 90, '#2e343a', 0.3)).join('') + Array.from({ length: 6 }, (_, k) => P(`M${-k * 6} ${60 + k * 5} L${160 + k * 6} ${60 + k * 5}`, 'none', 'stroke="#2e343a" stroke-width=".3"')).join('') + P('M0 70 Q40 66 70 72', 'none', 'stroke="#14181e" stroke-width=".8"')
      + [[16, 66], [144, 66]].map(([x, y]) => P(`M${x - 8} ${y} L${x + 8} ${y} L${x + 9} ${y + 6} L${x - 9} ${y + 6}Z`, '#3a4048', 'stroke="#5a6068" stroke-width=".3"') + Array.from({ length: 5 }, (_, k) => R(x - 7 + k * 3, y + 1.4, 1.8, 1, ['#3aff6a', '#ffcf3a', '#3ad8ff', '#ff3a2a'][k % 4])).join('') + R(x - 6, y - 5, 12, 5, '#1a2028', 'stroke="#5a6068" stroke-width=".3"') + R(x - 5, y - 4, 10, 3, '#0a3a4a')).join('')
      + P('M44 60 L116 60 L120 66 L40 66Z', '#3a4048', 'stroke="#5a6068" stroke-width=".3"') + Array.from({ length: 12 }, (_, k) => R(46 + k * 6, 61.4, 3, 1.4, ['#3aff6a', '#ffcf3a', '#3ad8ff', '#ff3a2a'][k % 4], 'opacity=".8"')).join('') + R(50, 66, 60, 2, '#2a2e36')
      + E(80, 58, 9, 2, '#3ad8ff', 'opacity=".25"') + P('M74 58 L80 46 L86 58Z', '#3ad8ff', 'opacity=".12"') + C(80, 51, 4, 'none', 'stroke="#5ad8ff" stroke-width=".35" opacity=".8"') + E(80, 51, 4, 1.2, 'none', 'stroke="#5ad8ff" stroke-width=".25" opacity=".7"') + E(80, 51, 1.4, 4, 'none', 'stroke="#5ad8ff" stroke-width=".25" opacity=".6"') + C(78.4, 49.6, 0.8, 'none', 'stroke="#5ad8ff" stroke-width=".25"')
      + k2so(68, 80, 3, 1) + shoretrooper(40, 82, 2.5, 1) + shoretrooper(116, 82, 2.5, -1) + shoretrooper(138, 88, 2.7, -1, false),

    // 5 · Rogue One Strike (fleet): skimming a beach torn up by battle. The
    // U-wing tears in low over the surf with a TIE fighter on its tail; a
    // detailed AT-ACT strides through the shallows; craters, burning wrecks
    // and smoke columns scar the sand, palms whip past.
    rogue_one_strike: () => shieldSky()
      + sea(46, 4) + citadel(146, 48, 0.4) + smoke(130, 48, 30, 0.5) + smoke(40, 50, 26, 0.45)
      + atact(118, 64, 1.25, -1)
      + beach(60, '#e8d8b4') + [[30, 70, 5], [84, 78, 6], [136, 84, 4], [60, 66, 3]].map(([x, y, r]) => crater(x, y, r)).join('') + wreck(48, 76, 1.4) + wreck(100, 70, 1) + fire(140, 74, 2) + smoke(48, 72, 22, 0.55) + smoke(100, 66, 18, 0.45)
      + Array.from({ length: 12 }, (_, k) => E((k * 29) % 160, 64 + ((k * 11) % 22), 2.4, 0.5, '#4a3a2a', 'opacity=".4"')).join('')
      + uwing(52, 22, 1.5, 8) + (kit.tie ? kit.tie(112, 14, 1.1) : '') + shots([110, 16], [66, 22], [0.2, 0.55], 0.14) + Array.from({ length: 8 }, (_, k) => L(74 + k * 3, 18 + k * 1.2, 100, 18 + k * 1.2, '#ffffff', 0.25)).join('')
      + palm(12, 88, 34, 8, 1.3) + palm(152, 88, 30, -8, 1.2),

    // 6 · Citadel Steps: the foot of the Citadel, in full. The dark tower
    // rising with its window bands, terraces and dish; the base complex lit;
    // a Lambda shuttle settled on a side pad; broad steps with light strips
    // and railings; supply crates; an AT-ACT on guard; palms; death troopers
    // and shoretroopers hold the steps, more on the terraces.
    citadel_steps: () => shieldSky()
      + sea(58, 5) + citadel(80, 56, 0.72) + atact(136, 60, 0.75, -1) + (kit.lambda ? kit.lambda(26, 46, 0.7, 0, true) : '') + R(12, 52, 28, 2, '#7a8088', 'stroke="#4a5058" stroke-width=".25"')
      + Array.from({ length: 6 }, (_, k) => R(30 - k * 6, 56 + k * 3, 100 + k * 12, 3, k % 2 ? '#7a8088' : '#8a9098', 'stroke="#4a5058" stroke-width=".25"') + Array.from({ length: 10 + k }, (_, m) => C(32 - k * 6 + m * 10, 57.4 + k * 3, 0.3, '#ffe0a0')).join('')).join('') + R(0, 74, 160, 16, '#6a7078') + [24, 136].map((x) => L(x, 56, x - 14, 74, '#4a5058', 0.6)).join('')
      + Array.from({ length: 9 }, (_, k) => L(k * 20, 74, k * 20 - 8, 90, '#5a6068', 0.3)).join('') + [[18, 78, 6, 4], [24, 75, 4, 3], [144, 78, 6, 4]].map(([x, y, w, h]) => R(x - w / 2, y - h / 2, w, h, '#5a5e66', 'stroke="#2a2e36" stroke-width=".3"') + R(x - w / 2, y - h / 2, w, 0.6, '#ffcf3a', 'opacity=".55"')).join('')
      + palm(6, 76, 30, 6, 1.1) + palm(156, 76, 28, -6, 1)
      + shoretrooper(60, 56, 1.1, 1) + shoretrooper(100, 56, 1.1, -1) + deathTrooper(70, 66, 2.2, -1) + deathTrooper(90, 66, 2.2, 1) + shoretrooper(42, 76, 2.5, 1) + shoretrooper(118, 76, 2.5, -1) + shoretrooper(28, 88, 2.7, 1, false) + shoretrooper(134, 88, 2.7, -1, false),

    // 7 · The Data Vault: inside the vault, the long view. Towering racks
    // packed with data-tape cartridges march away into the blue dark, rows
    // of indicator lights down every stack, catwalk bridges crossing high up,
    // the retrieval tower in the centre with its arm on the ceiling rail,
    // light falling from above through the haze, a grated floor; K-2SO, a
    // death trooper and a shoretrooper between the stacks.
    the_data_vault: () => fill([[0, '#0e1a2a'], [1, '#06101a']])
      + P('M70 0 L90 0 L100 90 L60 90Z', '#5ad8ff', 'opacity=".04"') + P('M76 0 L84 0 L90 90 L70 90Z', '#c8f8ff', 'opacity=".04"')
      + [-1, 1].map((sd) => Array.from({ length: 9 }, (_, k) => { const x1 = 80 + sd * (5 + k * 9); const x2 = 80 + sd * (9 + k * 12); const t1 = 30 - k * 3.6; const b1 = 56 + k * 4.4; return P(`M${x1} ${t1} L${x2} ${t1 - 3.6} L${x2} ${b1 + 4.4} L${x1} ${b1}Z`, k % 2 ? '#1a2a3e' : '#22344a', 'stroke="#3a5a7a" stroke-width=".2"') + Array.from({ length: 10 }, (_, m) => { const yy1 = t1 + ((b1 - t1) * (m + 0.5)) / 10; const yy2 = t1 - 3.6 + ((b1 + 4.4 - t1 + 3.6) * (m + 0.5)) / 10; return L(x1, yy1, x2, yy2, '#2e4a66', 0.25) + Array.from({ length: 4 }, (_, q) => { const t = (q + 0.5) / 4; return R(x1 + (x2 - x1) * t - 0.4, yy1 + (yy2 - yy1) * t - 0.9, 0.8, 0.9, '#4a6a8a', 'opacity=".8"'); }).join('') + C(x1 + (x2 - x1) * 0.9, yy1 + (yy2 - yy1) * 0.9, 0.25, m % 3 ? '#5ad8ff' : '#c8f8ff'); }).join(''); }).join('')).join('')
      + [22, 40].map((yy) => P(`M0 ${yy - 6} L160 ${yy - 6} L160 ${yy - 4.6} L0 ${yy - 4.6}Z`, '#1a2a3a', 'stroke="#3a5a7a" stroke-width=".2"') + Array.from({ length: 33 }, (_, k) => L(k * 5, yy - 6, k * 5, yy - 9, '#3a5a7a', 0.2)).join('') + L(0, yy - 9, 160, yy - 9, '#3a5a7a', 0.3)).join('')
      + R(74, 24, 12, 36, '#0a1420', 'stroke="#3a5a7a" stroke-width=".3"') + Array.from({ length: 6 }, (_, k) => R(75.6, 27 + k * 5, 8.8, 3, '#14243a') + C(84, 28.5 + k * 5, 0.3, '#5ad8ff')).join('') + glow(80, 40, 6, '#5ad8ff', 0.12)
      + L(0, 6, 160, 6, '#4a6a8a', 0.9) + P('M58 6 L58 18 L54 22 M58 18 L62 22', 'none', 'stroke="#6a8aaa" stroke-width=".8"') + R(55, 5, 6, 2.4, '#4a6a8a') + R(56.4, 21, 3.2, 2, '#3a5a7a')
      + P('M0 66 L160 66 L160 90 L0 90Z', '#0e1824') + Array.from({ length: 13 }, (_, k) => L(80, 60, -60 + k * 23, 90, '#1e2e40', 0.3)).join('') + Array.from({ length: 5 }, (_, k) => L(0, 68 + k * 4.6, 160, 68 + k * 4.6, '#1e2e40', 0.25)).join('')
      + R(102, 60, 10, 8, '#1a2a3a', 'stroke="#3a5a7a" stroke-width=".3"') + R(103, 61, 8, 3, '#5ad8ff', 'opacity=".6"') + [104, 106, 108].map((px, k) => R(px, 65, 1.2, 0.8, ['#3aff6a', '#ffcf3a', '#ff3a2a'][k])).join('')
      + E(80, 74, 80, 6, '#5ad8ff', 'opacity=".05"')
      + k2so(58, 82, 2.8, 1) + deathTrooper(96, 82, 2.6, -1) + shoretrooper(124, 84, 2.7, -1),

    // 8 · Tarkin's Order: on the Death Star's command deck. The great window
    // looks down on Scarif as the superlaser's green beam strikes the ocean;
    // the blast flares white, the shock wave rings spread and a column of
    // debris and steam climbs. Inside: ceiling beams, banks of consoles in
    // their pits with officers at them, death troopers on guard, and Grand
    // Moff Tarkin watching, hands behind his back.
    tarkins_order: () => fill([[0, '#1a1e24'], [1, '#0a0c10']])
      + P('M0 0 L160 0 L146 6 L14 6Z', '#2a2e36') + [30, 60, 100, 130].map((x) => L(x, 0, x + (x - 80) * -0.1, 6, '#14161a', 1)).join('') + [40, 80, 120].map((x) => R(x - 8, 1.6, 16, 1.6, '#c8d0d8', 'opacity=".7"')).join('')
      + P('M14 8 L146 8 L136 50 L24 50Z', '#03060e') + `<clipPath id="sc-dsw"><path d="M14 8 L146 8 L136 50 L24 50Z"/></clipPath><g clip-path="url(#sc-dsw)">${starfield(40, 12)}${scarifPlanet(90, 112, 72)}${shieldShell(90, 112, 76)}${E(96, 46, 34, 9, '#ffd8a0', 'opacity=".12"')}${E(96, 46, 26, 7, 'none', 'stroke="#ffd8a0" stroke-width=".7" opacity=".45"')}${E(96, 46, 16, 4.4, 'none', 'stroke="#fff0c8" stroke-width="1" opacity=".7"')}${glow(96, 44, 9, '#ffe8c0', 0.5)}${C(96, 44, 4.6, '#fff8e8')}${P('M90 44 C88 36 92 30 90 22 C96 28 100 34 102 44Z', '#c8b8a8', 'opacity=".55"')}${P('M93 44 C92 38 95 32 94 26 C98 32 99 38 99 44Z', '#f0e8e0', 'opacity=".6"')}${Array.from({ length: 10 }, (_, k) => C(84 + k * 2.6, 36 - (k % 3) * 3, 0.5, '#8a7a6a')).join('')}${P('M96 44 L56 2', 'none', 'stroke="#6aff6a" stroke-width="3" opacity=".35"')}${P('M96 44 L56 2', 'none', 'stroke="#c8ffc8" stroke-width="1.2" opacity=".8"')}${P('M96 44 L56 2', 'none', 'stroke="#ffffff" stroke-width=".4"')}</g>` + [56, 80, 104].map((x) => L(x, 8, x - (x - 80) * 0.08, 50, '#2a2e36', 1.6)).join('') + P('M14 8 L146 8 L136 50 L24 50Z', 'none', 'stroke="#3a3e46" stroke-width="2"')
      + P('M0 50 L160 50 L160 90 L0 90Z', '#16181e') + Array.from({ length: 9 }, (_, k) => L(24 + k * 14, 50, -20 + k * 25, 90, '#22262c', 0.3)).join('')
      + [[22, 62], [138, 62], [52, 58], [108, 58]].map(([x, y], k) => P(`M${x - 11} ${y} L${x + 11} ${y} L${x + 12} ${y + 6} L${x - 12} ${y + 6}Z`, '#2a2e36', 'stroke="#4a4e56" stroke-width=".3"') + R(x - 10, y - 4, 20, 4, '#14181e', 'stroke="#4a4e56" stroke-width=".2"') + Array.from({ length: 7 }, (_, m) => R(x - 9 + m * 2.6, y - 3.2, 1.6, 1, ['#3aff6a', '#ff3a2a', '#ffcf3a'][m % 3])).join('') + R(x - 9, y - 1.6, 18, 1, '#3a6a8a', 'opacity=".6"') + (k > 1 ? `<g transform="translate(${x} ${y + 2}) scale(1.4)">${R(-1.6, -6, 3.2, 4, '#5a6250')}${C(0, -7.2, 1.1, '#d8b898')}${P('M-1.2 -7.8 C-1.2 -9 1.2 -9 1.2 -7.8 L1.4 -7.4 L-1.4 -7.4Z', '#5a6250')}</g>` : '')).join('')
      + deathTrooper(16, 86, 2.6, 1) + deathTrooper(140, 86, 2.6, -1) + tarkin(46, 84, 3.6, 1),

    // 9 · Orbital Battle (fleet): the battle above Scarif, spread wide. The
    // ocean world below with its shield shell and the gate ring lying in it;
    // two Star Destroyers in line, one burning; the Mon Calamari flagship
    // trading fire with them; X-wings and a U-wing break through TIE
    // Interceptors, every bolt from its guns.
    orbital_battle: () => R(0, 0, 160, 90, '#03060e') + starfield(80, 13)
      + scarifPlanet(80, 186, 116) + shieldShell(80, 186, 122) + shellGate(96, 66, 0.85)
      + (kit.isd ? kit.isd(118, 20, 1.3, '#7a828c') + kit.isd(146, 42, 0.9, '#6a727c') : '') + glow(110, 22, 3, '#ffb070', 0.5) + smoke(110, 20, 8, 0.4)
      + monCal(32, 18, 0.95, 8) + bolt(54, 20, 98, 20, '#ff4a2a') + bolt(52, 24, 132, 40, '#ff4a2a') + bolt(104, 26, 60, 22, '#3aff6a')
      + (kit.xwing ? kit.xwing(40, 50, 0.6, -10, false, true) + kit.xwing(70, 40, 0.55, -14, false, true) : '') + uwing(22, 64, 0.75, -10)
      + (kit.interceptor ? kit.interceptor(108, 52, 0.6, 6) + kit.interceptor(130, 64, 0.55, 6) : '')
      + shots([50, 49], [106, 52], [0.15, 0.55], 0.1, '#ff4a2a') + shots([79, 38], [128, 62], [0.2, 0.6], 0.1, '#ff4a2a') + (() => { const t = gunsAt(108, 52, 0.6, 6, TIEGUNS); return shots(t[2], [48, 50], [0.2, 0.6], 0.12); })(),

    the_hallway: () => fill([[0, '#1a1418'], [0.5, '#2a2026'], [1, '#100c0e']])
      + P('M0 0 L56 28 L104 28 L160 0Z', '#2a2428') + P('M0 90 L56 62 L104 62 L160 90Z', '#1e181c') + P('M0 0 L56 28 L56 62 L0 90Z', '#3a3236') + P('M160 0 L104 28 L104 62 L160 90Z', '#342c30')
      + [0.2, 0.4, 0.6, 0.8].map((k) => L(k * 56, k * 28, k * 56, 90 - k * 28, '#5a5054', 1.4 - k) + L(160 - k * 56, k * 28, 160 - k * 56, 90 - k * 28, '#5a5054', 1.4 - k)).join('') + [[8, 18, 10, 30], [24, 24, 8, 22], [128, 24, 8, 22], [142, 18, 10, 30]].map(([x, y, w, h]) => R(x, y, w, h, '#4a4246', 'stroke="#6a6266" stroke-width=".3"') + [0.3, 0.55, 0.8].map((t) => L(x + 1, y + h * t, x + w - 1, y + h * t, '#5a5256', 0.3)).join('')).join('')
      + [[14, 12], [146, 12], [40, 24], [120, 24]].map(([x, y]) => R(x - 2.4, y, 4.8, 1.6, '#ff2a1a') + glow(x, y + 0.8, 4, '#ff2a1a', 0.25)).join('')
      + R(56, 28, 48, 34, '#0a0608') + E(80, 50, 24, 16, '#c8b0b8', 'opacity=".08"') + E(80, 40, 30, 10, '#ff2a1a', 'opacity=".06"')
      + deathTrooper(66, 64, 1.8, 1) + deathTrooper(94, 64, 1.8, -1)
      + vader(80, 82, 3.2, 1) + `<g transform="translate(80 82) scale(3.2)">${L(5, -9, 9, -20, '#ff2a1a', 1.2)}${L(5, -9, 9, -20, '#ffe0d8', 0.35)}${R(4.4, -9.6, 1, 1.8, '#8a8a92', 'transform="rotate(20 5 -9)"')}</g>` + glow(104, 30, 4, '#ff2a1a', 0.18)
      + [[30, 70, 10], [130, 72, 12], [80, 60, 16]].map(([x, y, r]) => C(x, y, r, '#8a7a80', 'opacity=".06"')).join('') + R(0, 0, 160, 90, 'none', 'stroke="#000" stroke-width="10" opacity=".35"'),
  };
  Object.assign(SA.scenes, S);
  SA.worlds.scarif = ['shield_gate', 'beach_landing', 'landing_pad_nine', 'k2s_reprogramming', 'rogue_one_strike', 'citadel_steps', 'the_data_vault', 'tarkins_order', 'orbital_battle', 'the_hallway'];
})(typeof window !== 'undefined' ? window : globalThis);
