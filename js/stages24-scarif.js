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
    P('M-16 0 L-16 -8 L-6 -10 L6 -10 L16 -8 L16 0Z', '#5a6068', 'stroke="#2a2e36" stroke-width=".3"') + Array.from({ length: 6 }, (_, k) => R(-14 + k * 5, -6, 3, 1.2, '#ffd890', 'opacity=".7"')).join('')
    + P('M-5 -10 L-4 -58 L4 -58 L5 -10Z', '#4a5058', 'stroke="#2a2e36" stroke-width=".3"') + P('M1 -10 L1.4 -58 L4 -58 L5 -10Z', '#3a4048') + Array.from({ length: 14 }, (_, k) => R(-3.4, -14 - k * 3.2, 4, 0.6, '#9ad8ff', 'opacity=".5"')).join('') + [-30, -44].map((yy) => R(-6.4, yy, 12.8, 2, '#5a6068', 'stroke="#2a2e36" stroke-width=".2"')).join('')
    + P('M-3 -58 L-2 -64 L2 -64 L3 -58Z', '#5a6068') + `<g transform="rotate(-18 0 -68)">${E(0, -68, 9, 3, '#8a9098', 'stroke="#3a4048" stroke-width=".3"')}${E(0, -68.4, 7, 2.2, '#6a7078')}${L(0, -68.4, 0, -73, '#3a4048', 0.4)}${C(0, -73.4, 0.6, '#ff3a2a')}</g>` + glow(0, -73, 0.8, '#ff3a2a', 0.4));
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
    E(0, 0.2, 3, 0.5, '#000', 'opacity=".3"') + L(-1, -7, -1.4, -0.6, '#2a2c30', 0.8) + L(1, -7, 1.4, -0.6, '#24262a', 0.8) + C(-1.2, -4, 0.5, '#1a1c20') + C(1.2, -4, 0.5, '#1a1c20') + R(-2.2, -0.8, 1.8, 0.7, '#1a1c20') + R(0.4, -0.8, 1.8, 0.7, '#1a1c20')
    + R(-1.6, -8, 3.2, 1.2, '#2a2c30') + P('M-2.2 -14 L-1.6 -8 L1.6 -8 L2.2 -14Z', '#2e3034', 'stroke="#14161a" stroke-width=".2"') + P('M-1.4 -13.4 L1.4 -13.4 L1.1 -10 L-1.1 -10Z', '#3a3c42') + [-12.4, -11.4].map((yy) => L(-1.2, yy, 1.2, yy, '#5a5c62', 0.15)).join('') + R(0.4, -12.8, 0.8, 0.5, '#e8e8e8', 'opacity=".6"')
    + P('M-2.2 -13.6 C-3 -11 -3.4 -8 -3.4 -4.6', 'none', 'stroke="#2a2c30" stroke-width=".7" stroke-linecap="round"') + C(-3.4, -4.4, 0.45, '#1a1c20') + P('M2.2 -13.6 C3 -11 3.4 -8 3.6 -4.8', 'none', 'stroke="#2a2c30" stroke-width=".7" stroke-linecap="round"') + C(3.6, -4.6, 0.45, '#1a1c20')
    + R(-0.4, -15.2, 0.8, 1.3, '#1a1c20') + E(0, -16.6, 1.8, 1.5, '#2e3034', 'stroke="#14161a" stroke-width=".2"') + P('M-1.8 -16.4 Q0 -15.4 1.8 -16.4', 'none', 'stroke="#14161a" stroke-width=".2"') + C(-0.75, -16.8, 0.38, '#f0f4f8') + C(0.75, -16.8, 0.38, '#f0f4f8') + glow(0, -16.8, 0.6, '#ffffff', 0.25) + P('M-1.2 -17.8 Q0 -18.2 1.2 -17.8', 'none', 'stroke="#4a4c52" stroke-width=".2"'));
  // Grand Moff Tarkin: the olive-grey uniform with its rank plaque and code
  // cylinders, black belt and boots, gaunt face, swept-back grey hair,
  // hands clasped behind his back.
  const tarkin = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 3, 0.5, '#000', 'opacity=".3"') + R(-1.9, -2.6, 1.6, 2.8, '#141414', 'rx=".3"') + R(0.3, -2.6, 1.6, 2.8, '#141414', 'rx=".3"') + P('M-1.9 -2.4 L-2.1 -6 L2.1 -6 L1.9 -2.4Z', '#5a6250')
    + P('M-2.4 -6 L-2.6 -10.6 C-2.6 -11.4 2.6 -11.4 2.6 -10.6 L2.4 -6Z', '#6a7262', 'stroke="#3a4232" stroke-width=".2"') + P('M-2.4 -6 L-2.6 -7.6 L2.6 -7.6 L2.4 -6Z', '#626a5a') + R(-2.5, -6.4, 5, 0.7, '#141414') + R(-0.4, -6.5, 0.8, 0.8, '#c8c8c0')
    + R(-2, -10, 1.8, 0.9, '#c8c8c0') + [-1.8, -1.2, -0.6].map((px, k) => R(px, -10, 0.4, 0.9, ['#ff3a2a', '#3a8aff', '#ffcf3a'][k])).join('') + [0.8, 1.3].map((px) => R(px, -10.2, 0.25, 1, '#c8c8c0')).join('')
    + P('M-1 -11.2 L1 -11.2 L0.8 -10.4 L-0.8 -10.4Z', '#6a7262') + C(0, -12.6, 1.4, '#e0c8b0') + P('M-1.4 -12.6 C-1.6 -14.6 1.6 -14.6 1.4 -12.6 L1.2 -13.4 C0.6 -14 -0.6 -14 -1.2 -13.4Z', '#b8b4ac') + P('M-1 -12.9 L-0.2 -12.7 M1 -12.9 L0.2 -12.7', 'none', 'stroke="#6a5a4a" stroke-width=".18"') + E(-0.55, -12.4, 0.26, 0.17, '#f4f0e8') + E(0.55, -12.4, 0.26, 0.17, '#f4f0e8') + C(-0.5, -12.4, 0.12, '#3a4a5a') + C(0.6, -12.4, 0.12, '#3a4a5a') + P('M-0.4 -11.6 L0.4 -11.6', 'none', 'stroke="#8a5a4a" stroke-width=".15"') + P('M-1 -12.8 L-1 -11.8 M1 -12.8 L1 -11.8', 'none', 'stroke="#c8a890" stroke-width=".18"'));
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
  // The shield gate: the great ring station seen at an angle, its armoured
  // segments and lights, the shimmer across the opening.
  const shieldGate = (x, y, s) => g(x, y, s, 1,
    E(0, 0, 24, 8, 'none', 'stroke="#4a5058" stroke-width="5"') + E(0, 0, 24, 8, 'none', 'stroke="#8a9098" stroke-width="3"') + E(0, -0.6, 24, 8, 'none', 'stroke="#c8ccd2" stroke-width=".6"') + E(0, 0, 20.6, 6.2, '#9ad8ff', 'opacity=".12"') + E(0, 0, 20.6, 6.2, 'none', 'stroke="#c8f0ff" stroke-width=".3" opacity=".6"')
    + Array.from({ length: 16 }, (_, k) => { const an = (k / 16) * Math.PI * 2; return R(Math.cos(an) * 24 - 1, Math.sin(an) * 8 - 1.4, 2, 2.8, '#5a6068', 'stroke="#2a2e36" stroke-width=".15"') + C(Math.cos(an) * 24, Math.sin(an) * 8, 0.3, '#ffe0a0'); }).join('') + R(-3, -12, 6, 5, '#6a7078', 'stroke="#2a2e36" stroke-width=".25"') + R(-2, -11, 4, 1, '#9ad8ff', 'opacity=".6"'));
  // A U-wing from above: the long nose, cockpit canopy, the boxy troop cabin,
  // the two big engine pods and the wings swept forward, blue-grey markings.
  const uwing = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M-4 -2.4 L-1 -14 L1.4 -14 L0.4 -2.4Z M-4 2.4 L-1 14 L1.4 14 L0.4 2.4Z', '#c8ccd0', 'stroke="#4a5058" stroke-width=".3"') + P('M-2 -8 L0.6 -8 M-2 8 L0.6 8', 'none', 'stroke="#4a6a8a" stroke-width=".8"') + R(-1.4, -14.6, 3.4, 1, '#3a3e46') + R(-1.4, 13.6, 3.4, 1, '#3a3e46')
    + R(-10, -5, 8, 3.2, '#a8acb2', 'rx="1.4" stroke="#4a5058" stroke-width=".3"') + R(-10, 1.8, 8, 3.2, '#a8acb2', 'rx="1.4" stroke="#4a5058" stroke-width=".3"') + glow(-10.6, -3.4, 1.2, '#9fd8ff', 0.5) + glow(-10.6, 3.4, 1.2, '#9fd8ff', 0.5)
    + P('M-8 -2.4 L4 -2.6 L12 -1 L13 0 L12 1 L4 2.6 L-8 2.4Z', '#d8dce0', 'stroke="#4a5058" stroke-width=".35"') + R(-6, -2.2, 8, 4.4, '#b8bcc2', 'stroke="#4a5058" stroke-width=".2"') + L(-2, -2.2, -2, 2.2, '#8a9098', 0.2) + L(-4, -2.2, -4, 2.2, '#8a9098', 0.2) + P('M6 -1.6 L11 -0.6 L11 0.6 L6 1.6Z', '#1a2a3a') + P('M7 -1 L9 -0.4', 'none', 'stroke="#8ab0d0" stroke-width=".3"') + R(0, -2.6, 3, 0.6, '#4a6a8a'), a);
  // An AT-ACT cargo walker: the long body with the cargo pod between its
  // front and rear sections, the small head, the four tall legs.
  const atact = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.4, 16, 1.2, '#000', 'opacity=".25"') + [[-9, '#6a6e76'], [-5, '#5a5e66'], [6, '#6a6e76'], [10, '#5a5e66']].map(([lx, c], k) => P(`M${lx - 0.9} -18 L${lx + (k % 2 ? 1 : -1)} -9 L${lx + 0.8} -1 L${lx - 0.8} -1 L${lx + (k % 2 ? -0.4 : -2.4)} -9 L${lx - 2.2} -18Z`, c, 'stroke="#2a2e36" stroke-width=".2"') + C(lx + (k % 2 ? 0.3 : -1.7), -9, 0.9, '#4a4e56') + E(lx, -0.6, 1.8, 0.8, c, 'stroke="#2a2e36" stroke-width=".2"')).join('')
    + P('M-14 -26 L14 -26 L16 -22 L16 -17 L-14 -17 L-16 -20Z', '#8a8e96', 'stroke="#2a2e36" stroke-width=".3"') + R(-6, -27.4, 12, 11, '#c8a040', 'stroke="#5a4a20" stroke-width=".3"') + [-3, 0, 3].map((px) => L(px, -27, px, -16.6, '#8a7020', 0.3)).join('') + L(-6, -22, 6, -22, '#8a7020', 0.3)
    + P('M16 -23 L22 -24 L25 -22 L25 -19 L20 -18 L16 -19Z', '#7a7e86', 'stroke="#2a2e36" stroke-width=".3"') + R(20, -22.6, 3, 1, '#1a1e24') + R(24.6, -20.4, 2.4, 0.5, '#3a3e46') + [-12, -9, 9, 12].map((px) => C(px, -21.6, 0.3, '#4a4e56')).join(''));
  // A Mon Calamari cruiser: the long organic hull with its bulges and
  // pods, rows of lights, the engines glowing at the back.
  const monCal = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M-26 0 C-26 -5 -14 -7 0 -7 C12 -7 22 -5 26 -2 C27 0 27 1 26 2 C22 4 12 6 0 6 C-14 6 -26 4 -26 0Z', '#7a8aa0', 'stroke="#3a4a5e" stroke-width=".4"') + E(-6, -5.6, 7, 2.4, '#8a9ab0', 'stroke="#3a4a5e" stroke-width=".3"') + E(8, -5, 5, 2, '#8a9ab0', 'stroke="#3a4a5e" stroke-width=".3"') + E(-14, 4.6, 6, 2, '#6a7a90', 'stroke="#3a4a5e" stroke-width=".3"')
    + Array.from({ length: 16 }, (_, k) => C(-22 + k * 3, -1 + Math.sin(k) * 0.6, 0.3, '#fff0c8')).join('') + Array.from({ length: 12 }, (_, k) => C(-18 + k * 3.2, 2.6, 0.25, '#fff0c8')).join('') + [-1, 1].map((sd) => glow(-27, sd * 2, 1.4, '#9fd8ff', 0.5)).join('') + C(24, -0.4, 0.8, '#9ad8ff'), a);
  // A Hammerhead corvette: the long body with its hammer-shaped bow and
  // engine block, red stripes.
  const hammerhead = (x, y, s, a = 0) => g(x, y, s, 1,
    R(-14, -1.4, 24, 2.8, '#c8b8a8', 'stroke="#5a4a3e" stroke-width=".3"') + P('M10 -5 L14 -5 L14 5 L10 5Z', '#d8c8b8', 'stroke="#5a4a3e" stroke-width=".3"') + R(10.6, -4.4, 1, 8.8, '#a83a2a') + R(-18, -3, 4.4, 6, '#a8988a', 'stroke="#5a4a3e" stroke-width=".3"') + [-1.6, 0, 1.6].map((yy) => glow(-18.6, yy, 0.8, '#ffb070', 0.5)).join('') + R(-10, -1.4, 16, 0.6, '#a83a2a'), a);

  const S = {
    // 1 · The Shield Gate (fleet): high orbit over Scarif. The blue ocean
    // world with its island chains under the faint shell of the planetary
    // shield; the great ring of the shield gate with a Star Destroyer on
    // guard; a U-wing slips for the gate while a TIE fighter and a TIE
    // Interceptor dive after it, their shots streaking from their guns.
    shield_gate: () => R(0, 0, 160, 90, '#03060e') + starfield(80, 11)
      + scarifPlanet(70, 150, 90) + P('M-30 90 Q70 30 170 90', 'none', 'stroke="#c8f0ff" stroke-width=".6" opacity=".35"')
      + shieldGate(96, 44, 1.4) + (kit.isd ? kit.isd(132, 22, 1.4, '#7a828c') : '')
      + uwing(60, 52, 1.1, -14)
      + (kit.tie ? kit.tie(24, 26, 1.2) : '') + (kit.interceptor ? kit.interceptor(30, 62, 0.8, -6) : '')
      + shots([31, 26], [58, 50], [0.2, 0.55], 0.12) + (() => { const t = gunsAt(30, 62, 0.8, -6, TIEGUNS); return shots(t[0], [56, 54], [0.25, 0.62], 0.12); })(),

    // 2 · Beach Landing: the island beach under the blue sky and the shield's
    // shimmer. Turquoise shallows, white sand, palms leaning over the
    // water, Imperial pads and towers down the shore, smoke rising from a
    // hit; shoretroopers advance up the beach, rifles ready.
    beach_landing: () => shieldSky()
      + E(30, 22, 30, 4, '#ffffff', 'opacity=".55"') + E(120, 16, 36, 3.4, '#ffffff', 'opacity=".5"')
      + sea(50, 1) + P('M90 50 L160 46 L160 58 L96 58Z', '#d8e8c8', 'opacity=".6"') + citadel(140, 52, 0.5) + hexPad(112, 52, 0.4)
      + E(66, 34, 6, 10, '#5a5a5a', 'opacity=".35"') + E(70, 26, 8, 6, '#6a6a6a', 'opacity=".25"') + glow(64, 50, 2, '#ff9a3a', 0.5)
      + beach(62) + palm(14, 70, 30, 6, 1.2) + palm(36, 66, 24, -4, 1) + palm(150, 72, 28, -6, 1.1)
      + shoretrooper(60, 78, 2.7, 1) + shoretrooper(86, 80, 2.9, 1) + shoretrooper(114, 78, 2.7, -1, false)
      + Array.from({ length: 8 }, (_, k) => E(50 + k * 9, 84 + (k % 2), 1.2, 0.5, '#d8c8a0')).join(''),

    // 3 · Landing Pad Nine: the hexagonal pad on its stilts over the lagoon,
    // a U-wing settled on it with its wings folded back, the walkway running
    // to shore; shoretroopers and a death trooper on the pad, palms on the
    // sand, the Citadel tower beyond.
    landing_pad_nine: () => shieldSky()
      + citadel(132, 56, 0.9) + sea(54, 2) + hexPad(70, 62, 2.4)
      + uwing(64, 58, 1.4, 180)
      + beach(80, '#efe0bc') + palm(140, 86, 34, -6, 1.2) + palm(12, 86, 30, 6, 1.1)
      + shoretrooper(40, 64, 2.4, 1) + deathTrooper(94, 64, 2.3, -1) + shoretrooper(110, 64, 2.4, -1, false) + shoretrooper(22, 88, 2.8, 1),

    // 4 · K-2's Reprogramming: inside the Citadel's control deck. Banks of
    // consoles with screens and holograms, a tall window on the turquoise
    // sea and the shield's shimmer; K-2SO working a terminal with
    // shoretroopers at his back.
    k2s_reprogramming: () => fill([[0, '#2a3038'], [1, '#14181e']])
      + P('M30 6 L130 6 L124 46 L36 46Z', '#7ac8e8') + `<clipPath id="sc-win"><path d="M30 6 L130 6 L124 46 L36 46Z"/></clipPath><g clip-path="url(#sc-win)">${shieldSky()}${sea(34, 3)}${palm(110, 46, 16, -3, 0.6)}${hexPad(60, 38, 0.5)}</g>` + [56, 80, 104].map((x) => L(x, 6, x - (x - 80) * 0.06, 46, '#3a4048', 1.4)).join('') + P('M30 6 L130 6 L124 46 L36 46Z', 'none', 'stroke="#4a5058" stroke-width="1.6"')
      + P('M0 0 L30 6 L36 46 L0 60Z', '#3a4048') + P('M160 0 L130 6 L124 46 L160 60Z', '#343a42') + [[6, 16], [6, 32], [146, 16], [146, 32]].map(([x, y]) => R(x, y, 10, 8, '#1a2028', 'stroke="#5a6068" stroke-width=".3"') + R(x + 1, y + 1, 8, 4, '#3ad8ff', 'opacity=".45"') + [0, 1, 2].map((k) => L(x + 1.4, y + 2 + k * 1.2, x + 6 + k, y + 2 + k * 1.2, '#c8f8ff', 0.15)).join('')).join('')
      + P('M0 60 L36 46 L124 46 L160 60 L160 90 L0 90Z', '#22282e') + Array.from({ length: 9 }, (_, k) => L(36 + k * 11, 46, -20 + k * 25, 90, '#2e343a', 0.3)).join('')
      + P('M44 60 L116 60 L120 66 L40 66Z', '#3a4048', 'stroke="#5a6068" stroke-width=".3"') + Array.from({ length: 12 }, (_, k) => R(46 + k * 6, 61.4, 3, 1.4, ['#3aff6a', '#ffcf3a', '#3ad8ff', '#ff3a2a'][k % 4], 'opacity=".8"')).join('') + E(80, 56, 8, 2, '#3ad8ff', 'opacity=".25"') + P('M76 56 L80 46 L84 56Z', '#3ad8ff', 'opacity=".2"') + C(80, 50, 3, 'none', 'stroke="#3ad8ff" stroke-width=".4" opacity=".7"')
      + k2so(80, 76, 2.6, 1) + shoretrooper(44, 80, 2.6, 1) + shoretrooper(118, 80, 2.6, -1) + shoretrooper(140, 86, 2.8, -1, false),

    // 5 · Rogue One Strike (fleet): skimming the beach. The U-wing tears in
    // low over the surf with a TIE fighter on its tail; an AT-ACT walker
    // strides through the shallows, palms whip past and explosions bloom
    // along the shore.
    rogue_one_strike: () => shieldSky()
      + sea(46, 4) + citadel(146, 48, 0.45) + atact(118, 62, 1.25, -1)
      + beach(60) + [[40, 56, 4], [128, 62, 5]].map(([x, y, r]) => glow(x, y, r, '#ff9a3a', 0.5) + C(x, y, r * 0.6, '#ffd890') + E(x + 1, y - r * 2, r * 1.6, r, '#5a5a5a', 'opacity=".4"')).join('')
      + uwing(52, 22, 1.4, 8) + (kit.tie ? kit.tie(112, 14, 1.1) : '') + shots([110, 16], [66, 22], [0.2, 0.55], 0.14)
      + palm(12, 88, 34, 8, 1.3) + palm(152, 88, 30, -8, 1.2) + Array.from({ length: 8 }, (_, k) => L(74 + k * 3, 18 + k * 1.2, 100, 18 + k * 1.2, '#ffffff', 0.25)).join(''),

    // 6 · Citadel Steps: the foot of the Citadel tower. The great dark tower
    // rising with its dish, broad grey steps and landing platforms, an
    // AT-ACT standing guard, palms at the edges; death troopers and
    // shoretroopers hold the steps.
    citadel_steps: () => shieldSky()
      + sea(58, 5) + citadel(80, 56, 0.7) + atact(130, 60, 0.9, -1)
      + Array.from({ length: 6 }, (_, k) => R(30 - k * 6, 54 + k * 3, 100 + k * 12, 3, k % 2 ? '#7a8088' : '#8a9098', 'stroke="#4a5058" stroke-width=".25"')).join('') + R(0, 72, 160, 18, '#6a7078')
      + palm(10, 76, 30, 6, 1.1) + palm(150, 76, 28, -6, 1)
      + deathTrooper(70, 64, 2.3, -1) + deathTrooper(92, 64, 2.3, 1) + shoretrooper(42, 74, 2.6, 1) + shoretrooper(118, 74, 2.6, -1) + shoretrooper(24, 86, 2.8, 1, false),

    // 7 · The Data Vault: inside the vault. Towering racks of data-tape
    // cartridges marching away into the blue dark, a retrieval arm on its
    // rail, the access console glowing; K-2SO, a death trooper and a
    // shoretrooper between the stacks.
    the_data_vault: () => fill([[0, '#0e1a2a'], [1, '#06101a']])
      + [-1, 1].map((sd) => Array.from({ length: 8 }, (_, k) => { const x1 = 80 + sd * (6 + k * 10); const x2 = 80 + sd * (10 + k * 13); const t1 = 30 - k * 3.6; const b1 = 56 + k * 4.4; return P(`M${x1} ${t1} L${x2} ${t1 - 3.6} L${x2} ${b1 + 4.4} L${x1} ${b1}Z`, k % 2 ? '#1a2a3e' : '#22344a', 'stroke="#3a5a7a" stroke-width=".2"') + Array.from({ length: 6 }, (_, m) => { const yy1 = t1 + ((b1 - t1) * (m + 0.5)) / 6; const yy2 = t1 - 3.6 + ((b1 + 4.4 - t1 + 3.6) * (m + 0.5)) / 6; return L(x1, yy1, x2, yy2, '#5ad8ff', 0.18) + C((x1 + x2) / 2, (yy1 + yy2) / 2, 0.3, m % 2 ? '#5ad8ff' : '#c8f8ff'); }).join(''); }).join('')).join('')
      + R(74, 26, 12, 34, '#0a1420') + glow(80, 40, 6, '#5ad8ff', 0.15) + L(10, 10, 150, 10, '#4a6a8a', 0.8) + P('M60 10 L60 22 L56 26 M60 22 L64 26', 'none', 'stroke="#6a8aaa" stroke-width=".8"') + R(57, 9, 6, 2, '#4a6a8a')
      + P('M0 66 L160 66 L160 90 L0 90Z', '#0e1824') + Array.from({ length: 9 }, (_, k) => L(80, 60, -40 + k * 30, 90, '#1e2e40', 0.3)).join('')
      + R(102, 60, 10, 8, '#1a2a3a', 'stroke="#3a5a7a" stroke-width=".3"') + R(103, 61, 8, 3, '#5ad8ff', 'opacity=".6"')
      + k2so(58, 80, 2.6, 1) + deathTrooper(94, 80, 2.5, -1) + shoretrooper(122, 82, 2.6, -1),

    // 8 · Tarkin's Order: on the Death Star's command deck. The great window
    // looks down on Scarif as the superlaser's strike blooms on the ocean,
    // the shock wave spreading; Grand Moff Tarkin watches with his hands
    // behind his back, death troopers at the consoles.
    tarkins_order: () => fill([[0, '#1a1e24'], [1, '#0a0c10']])
      + P('M14 8 L146 8 L136 52 L24 52Z', '#03060e') + `<clipPath id="sc-dsw"><path d="M14 8 L146 8 L136 52 L24 52Z"/></clipPath><g clip-path="url(#sc-dsw)">${starfield(40, 12)}${scarifPlanet(90, 110, 70)}${glow(96, 48, 8, '#ffd8a0', 0.5)}${C(96, 48, 4, '#fff8e0')}${E(96, 48, 18, 5, 'none', 'stroke="#fff0c8" stroke-width="1" opacity=".6"')}${E(96, 48, 28, 8, 'none', 'stroke="#ffd8a0" stroke-width=".6" opacity=".35"')}${P('M96 48 L60 4', 'none', 'stroke="#6aff6a" stroke-width="2.4" opacity=".4"')}${P('M96 48 L60 4', 'none', 'stroke="#e8ffe8" stroke-width=".6"')}</g>` + [56, 80, 104].map((x) => L(x, 8, x - (x - 80) * 0.08, 52, '#2a2e36', 1.6)).join('') + P('M14 8 L146 8 L136 52 L24 52Z', 'none', 'stroke="#3a3e46" stroke-width="2"')
      + P('M0 52 L24 52 L136 52 L160 52 L160 90 L0 90Z', '#16181e') + Array.from({ length: 9 }, (_, k) => L(24 + k * 14, 52, -20 + k * 25, 90, '#22262c', 0.3)).join('')
      + [[20, 64], [140, 64]].map(([x, y]) => R(x - 10, y - 4, 20, 8, '#2a2e36', 'stroke="#4a4e56" stroke-width=".3"') + Array.from({ length: 6 }, (_, k) => R(x - 8 + k * 2.8, y - 2.4, 1.6, 1, ['#3aff6a', '#ff3a2a', '#ffcf3a'][k % 3])).join('')).join('')
      + deathTrooper(26, 84, 2.6, 1) + deathTrooper(136, 84, 2.6, -1) + tarkin(80, 82, 3.2, 1),

    // 9 · Orbital Battle (fleet): the battle above Scarif. The planet below
    // and the shield gate; a Hammerhead corvette rams a crippled Star
    // Destroyer into another; the Mon Calamari flagship fires, X-wings and a
    // U-wing dogfight TIE Interceptors, every bolt from its guns.
    orbital_battle: () => R(0, 0, 160, 90, '#03060e') + starfield(80, 13)
      + scarifPlanet(110, 150, 84) + shieldGate(40, 66, 0.9)
      + (kit.isd ? `<g transform="rotate(-18 104 30)">${kit.isd(104, 30, 1.4, '#7a828c')}</g>` + kit.isd(132, 50, 1.1, '#6a727c') : '') + hammerhead(76, 34, 1, -14) + glow(120, 46, 3, '#ffb070', 0.5)
      + monCal(36, 20, 1, 8) + bolt(58, 22, 92, 28, '#ff4a2a') + bolt(54, 24, 96, 34, '#ff4a2a')
      + (kit.xwing ? kit.xwing(70, 64, 0.7, -10, false, true) + kit.xwing(98, 74, 0.6, -14, false, true) : '') + uwing(52, 44, 0.8, -10)
      + (kit.interceptor ? kit.interceptor(130, 72, 0.7, 6) + kit.interceptor(114, 62, 0.6, 6) : '')
      + shots([81, 63], [128, 70], [0.15, 0.55], 0.1, '#ff4a2a') + (() => { const t = gunsAt(114, 62, 0.6, 6, TIEGUNS); return shots(t[2], [78, 64], [0.2, 0.6], 0.12); })(),

    // 10 · The Hallway: aboard the rebel flagship, the corridor in the dark.
    // Emergency lights pulse red along the white-grey panels, smoke hangs in
    // the air, and Darth Vader stands in the gloom with his saber blazing,
    // death troopers behind him.
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
