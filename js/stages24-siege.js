// Update 2.4: the ten Coruscant Under Siege stage scenes, for approval. Same
// 160x90 format as the worlds before: the Battle of Coruscant and the fall of
// the Republic. The dogfight over the skyline, the droid landing in the
// Senate District, Grievous on the burning spires, the Invisible Hand, the
// Temple steps and Archives on the night of Order 66, the orbital barrage,
// the Inquisitors in the Works, the Senate Rotunda, and the Empire's rise.
(function (root) {
  'use strict';
  const K = root.ArtX;
  const SA = root.StageArt24;
  if (!K || !SA) return;
  const { P, E, C, R, L, LG, RG } = K;
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
  const smoke = (x, y, h, a = 0.5, c1 = '#1a1416', c2 = '#3a2e2e') => Array.from({ length: 7 }, (_, k) => { const yy = y - (k * h) / 7; const xx = x + k * 1.8 + (k % 2) * 1.4; const r = 2.6 + k * 1.6; return C(xx, yy, r, k < 3 ? c1 : c2, `opacity="${(a * (1 - k * 0.1)).toFixed(2)}"`); }).join('');
  const fire = (x, y, r) => glow(x, y, r, '#ff8a3a', 0.5) + P(`M${x - r} ${y} Q${x - r * 0.6} ${y - r * 1.6} ${x - r * 0.2} ${y - r * 0.6} Q${x} ${y - r * 2.2} ${x + r * 0.3} ${y - r * 0.7} Q${x + r * 0.7} ${y - r * 1.5} ${x + r} ${y}Z`, '#ff9a3a') + P(`M${x - r * 0.5} ${y} Q${x - r * 0.2} ${y - r} ${x} ${y - r * 0.4} Q${x + r * 0.3} ${y - r * 1.1} ${x + r * 0.5} ${y}Z`, '#ffe08a');
  const RED = '#ff4a2a';
  const GRN = '#3aff6a';
  const BLUE = '#5ab8ff';
  const none = () => '';
  const k = (name) => kit[name] || none;
  const [skyline, traffic, temple, clone, robed, arc170, laat, archivesHall] = ['skyline', 'traffic', 'temple', 'clone', 'robed', 'arc170', 'laat', 'archivesHall'].map(k);
  const [b2, droideka, magnaguard, grievousBoss, vulture, dooku, delta7] = ['b2', 'droideka', 'magnaguard', 'grievousBoss', 'vulture', 'dooku', 'delta7'].map(k);
  const [grandInq, fifthBro, secondSis, seventhSis, eighthBro, vaderFull, palpatine, forceLightning] = ['grandInq', 'fifthBro', 'secondSis', 'seventhSis', 'eighthBro', 'vaderFull', 'palpatine', 'forceLightning'].map(k);
  const [tieInt, tieAdv, slave1, lambda, deathTrooper, isd, trooper] = ['tieInt', 'tieAdv', 'slave1', 'lambda', 'deathTrooper', 'isd', 'trooper'].map(k);
  const VGUNS = kit.VGUNS || [];
  const TIGUNS = kit.TIGUNS || [];
  const TAGUNS = kit.TAGUNS || [];
  const D7GUNS = kit.D7GUNS || [];
  const SLGUNS = [[-1.4, 12], [1.9, 11.8]];
  const ARCGUNS = [[11, -11.1], [11, 11.1]];

  // ---------- The city at war ----------
  const SKY = [[0, '#0a0610'], [0.45, '#3a1a24'], [0.8, '#a8402a'], [1, '#e8763a']];
  // Drifting embers and ash over the burning city.
  const embers = (n, seed) => Array.from({ length: n }, (_, i) => C(((i * 53 + seed * 7) % 160), ((i * 29 + seed * 11) % 90), (0.2 + (i % 3) * 0.1).toFixed(2), i % 3 ? '#ff9a4a' : '#ffd27a', `opacity="${(0.4 + (i % 3) * 0.15).toFixed(2)}"`)).join('');
  // Capital-ship fire streaking across the sky: paired turbolaser bolts.
  const flak = (list, c) => list.map(([x1, y1, x2, y2]) => bolt(x1, y1, x2, y2, c) + bolt(x1 + 1.6, y1 + 1, x2 + 1.6, y2 + 1, c)).join('');
  // A Venator-class Star Destroyer in three-quarter view, bow left: the
  // white arrowhead with its red stripes and flight deck seam, the twin
  // bridge towers, turbolaser turrets and the engine glow at the stern.
  const VEN_T = [-16, -8, 0].map((tx) => [tx - 0.4, f2(1 - (tx + 26) * 0.19 - 1.2)]);
  const venator = (x, y, s, f = 1) => g(x, y, s, f,
    P('M-26 2 L16 -6 L22 -4.6 L22 2Z', '#c8ccd2', 'stroke="#4a4e56" stroke-width=".25"') + P('M-26 2 L22 2 L22 5.4 L-22 4Z', '#8a9098', 'stroke="#4a4e56" stroke-width=".2"')
    + P('M-26 2 L-14 -0.3 L-13 1.9Z', '#a83a2a') + P('M-24 2.8 L22 3.6 L22 4.4 L-23 3.6Z', '#a83a2a', 'opacity=".85"') + L(-24, 1.6, 18, -4.6, '#6a7078', 0.3) + [-14, -6, 2, 10].map((px) => L(px, f2(2 - (px + 26) * 0.19 + 0.3), px, 2, '#9aa0a8', 0.15)).join('')
    + [[8, 2.8], [14, 3.2]].map(([tx, tw]) => R(tx, -9.6, tw, 4, '#b8bcc4', 'stroke="#4a4e56" stroke-width=".15"') + R(tx + 0.4, -11.4, tw - 0.8, 1.8, '#a8aeb6', 'stroke="#4a4e56" stroke-width=".15"') + R(tx + 0.6, -10.8, tw - 1.2, 0.4, '#3a4a5a')).join('') + R(8, -5.6, 9.4, 1.6, '#a8aeb6')
    + [-16, -8, 0].map((tx) => R(tx, f2(1 - (tx + 26) * 0.19 - 1.2), 1.6, 0.9, '#6a7078', 'rx=".3"')).join('')
    + [0.6, 2.6, 4.4].map((ey) => E(22.4, ey, 0.5, 0.9, '#9ad8ff') + glow(22.6, ey, 0.6, BLUE, 0.35)).join(''));
  // The Invisible Hand, Grievous's Providence-class flagship, bow left: the
  // long grey hull plated in panels with rust-red sections and weathering,
  // a lit trench down its flank, the hangar mouth glowing at the bow, the
  // row of tall dorsal towers with lit windows and beacons, the forward
  // command tower with its bridge windows, dorsal and flank gun turrets,
  // antenna masts, and the six-nozzle engine bank glowing at the stern.
  const IH_GUNS = [[-20, -2.6], [-6, -3.2], [8, -3.6], [18, -3.8]];
  const invisibleHand = (x, y, s, f = 1) => g(x, y, s, f,
    P('M-30 1 L-22 -2 L20 -3.4 L26 -2 L26 3.6 L20 4.6 L-24 3.6Z', '#5a5654', 'stroke="#2a2422" stroke-width=".25"') + P('M-30 1 L-22 -2 L20 -3.4 L26 -2 L-22 0Z', '#7a7470', 'opacity=".7"') + P('M-24 3.6 L20 4.6 L26 3.6 L26 2.4 L-26 2.2Z', '#3a3432')
    + Array.from({ length: 22 }, (_, i) => { const px = -22 + i * 2; return L(px, f2(-2 + i * 0.065 - 0.1), px, f2(3.6 + i * 0.045), '#3e3836', 0.12); }).join('') + L(-26, 1.4, 25, 1.2, '#2a2422', 0.25) + L(-23, -0.6, 22, -1.8, '#8a8480', 0.15)
    + [-18, -10, -2, 6, 14].map((px) => R(px, -1.6, 5, 1.6, '#8a3a24', 'opacity=".75"') + R(px + 0.4, -1.3, 1.6, 0.5, '#5a2a1a', 'opacity=".7"') + L(px, -2, px, 3.6, '#2a2422', 0.15)).join('')
    + R(-22, 1.6, 44, 0.9, '#1e1a18') + Array.from({ length: 20 }, (_, i) => R(f2(-21.4 + i * 2.2), 1.85, 0.8, 0.35, i % 4 ? '#ffd08a' : '#8ad0ff', 'opacity=".85"')).join('')
    + P('M-30 1 L-26 0.6 L-25 2.6 L-28.6 2.4Z', '#ffb070', 'opacity=".8"') + glow(-27, 1.6, 0.8, '#ffb070', 0.3)
    + [[-14, 8], [-8, 11], [-2, 13], [4, 11], [10, 9]].map(([tx, th]) => P(`M${tx - 1.2} -2.6 L${tx - 0.6} ${-2.6 - th} L${tx + 0.6} ${-2.6 - th} L${tx + 1.2} -2.6Z`, '#4a4442', 'stroke="#2a2422" stroke-width=".15"') + P(`M${tx} -2.6 L${tx + 0.6} ${-2.6 - th} L${tx + 1.2} -2.6Z`, '#000', 'opacity=".25"') + R(tx - 0.8, -2.6 - th, 1.6, 1, '#6a6460') + Array.from({ length: Math.floor(th / 2.2) }, (_, m) => R(tx - 0.4, f2(-4 - m * 2.2), 0.8, 0.35, '#ffd08a', 'opacity=".7"')).join('') + L(tx, -2.6 - th, tx, -3.8 - th, '#4a4442', 0.2) + C(tx, -3.9 - th, 0.28, RED)).join('')
    + P('M16 -3.2 L17 -8 L22 -8 L23 -3Z', '#6a6460', 'stroke="#2a2422" stroke-width=".15"') + R(17.6, -7.4, 3.8, 0.6, '#ffb070', 'opacity=".8"') + R(18, -10, 3, 2, '#5a5654', 'stroke="#2a2422" stroke-width=".15"') + L(19.5, -10, 19.5, -12.6, '#4a4442', 0.2) + L(20.6, -10, 21, -11.6, '#4a4442', 0.15) + C(19.5, -12.8, 0.25, RED)
    + IH_GUNS.map(([gx, gy]) => R(gx - 0.8, gy, 1.6, 0.8, '#3a3432', 'rx=".2"') + L(gx - 0.4, gy + 0.2, gx - 2, gy - 0.3, '#2a2422', 0.25)).join('')
    + Array.from({ length: 12 }, (_, i) => C(f2(-22 + i * 3.6), f2(3.1 + (i % 2) * 0.4), 0.2, '#ffd08a', 'opacity=".8"')).join('') + [-16, 0, 14].map((px) => P(`M${px} 3.8 l-1 2 l2 0Z`, '#3a3432')).join('')
    + R(25.4, -2.4, 1.8, 6.4, '#2a2422') + [-1.6, -0.2, 1.2, 2.6].map((ey) => E(27.4, ey, 0.5, 0.6, '#9ad8ff') + glow(27.6, ey, 0.6, BLUE, 0.3)).join(''));
  // Coruscant from orbit, in detail: the planet-wide city as a mosaic of
  // grey-blue districts cut by canyon grids and skylanes, megastructures and
  // polar towers catching the sun, thin cloud, the night side blazing with
  // a gold web of city lights along its traffic arteries, the terminator
  // glow, and the blue rim of the atmosphere. Only the part in view is
  // tiled, to keep it light.
  const planet = (cx, cy, r, id) => {
    const [gr, d] = RG([[0, '#7a8aa8'], [0.6, '#3a4660'], [1, '#141a28']], 0.35, 0.3, 0.75);
    const cid = `siegeP${id}`;
    const nx = cx + r * 0.95; const ny = cy - r * 0.2; const nr = r * 1.02;
    const inside = (x, y, m = 1) => (x - cx) ** 2 + (y - cy) ** 2 < (r * m) ** 2;
    const night = (x, y) => (x - nx) ** 2 + (y - ny) ** 2 < nr * nr;
    const cells = [];
    for (let y = Math.max(0, cy - r); y < Math.min(92, cy + r); y += 2.6) for (let x = Math.max(-2, cx - r); x < Math.min(162, cx + r); x += 2.6) if (inside(x, y, 0.99)) cells.push([f2(x), f2(y)]);
    const day = cells.filter(([x, y]) => !night(x, y)); const lit = cells.filter(([x, y]) => night(x, y));
    const shades = ['#5a6a88', '#4a5878', '#6a7898', '#3e4c6c', '#56647e'];
    return d + `<clipPath id="${cid}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>` + C(cx, cy, r, gr) + `<g clip-path="url(#${cid})">`
      + day.map(([x, y], i) => R(x, y, 2.1, 2.1, shades[(i * 7 + Math.floor(x)) % 5], 'opacity=".85"') + (i % 5 === 0 ? R(f2(x + 0.5), f2(y + 0.5), 0.9, 0.9, '#8a9ab8') : '')).join('')
      + Array.from({ length: 9 }, (_, i) => { const yy = f2(cy - r + (i + 1) * (r * 2) / 10); return P(`M${cx - r} ${yy} Q${cx} ${f2(yy - r * 0.08)} ${cx + r} ${yy}`, 'none', 'stroke="#202a40" stroke-width=".45"'); }).join('') + Array.from({ length: 11 }, (_, i) => { const xx = f2(cx - r + (i + 1) * (r * 2) / 12); return P(`M${xx} ${cy - r} Q${f2(xx + (xx - cx) * 0.25)} ${cy} ${xx} ${cy + r}`, 'none', 'stroke="#202a40" stroke-width=".4"'); }).join('')
      + day.filter((_, i) => i % 23 === 0).map(([x, y]) => R(f2(x - 0.4), f2(y - 2), 1.4, 3, '#a8b4cc', 'stroke="#2a3448" stroke-width=".1"') + C(f2(x + 0.3), f2(y - 2.2), 0.25, '#ff6a4a')).join('')
      + [[-0.45, -0.6, 0.5], [0.05, -0.75, 0.6], [-0.2, -0.45, 0.4], [0.3, -0.55, 0.45]].map(([dx, dy, w]) => E(f2(cx + dx * r), f2(cy + dy * r), f2(r * w * 0.4), f2(r * 0.03), '#d8e0f0', 'opacity=".35"')).join('')
      + C(f2(nx), f2(ny), f2(nr), '#06080e', 'opacity=".78"') + C(f2(nx), f2(ny), f2(nr + 2.4), 'none', 'stroke="#ffb46a" stroke-width="2" opacity=".12"')
      + lit.map(([x, y], i) => C(f2(x + 1), f2(y + 1), f2(0.22 + (i % 3) * 0.1), i % 4 ? '#ffcf6a' : '#ffe8b0', `opacity="${(0.45 + (i % 4) * 0.13).toFixed(2)}"`) + (i % 3 === 0 ? C(f2(x + 2), f2(y + 0.4), 0.18, '#ffb04a', 'opacity=".6"') : '')).join('')
      + Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI; return P(`M${f2(nx - nr * 0.8)} ${f2(ny - nr * 0.5 + i * 3)} Q${f2(nx + Math.cos(a) * nr * 0.3)} ${f2(ny - nr * 0.6 + Math.sin(a) * nr * 0.3)} ${f2(nx + nr * 0.3)} ${f2(ny - nr * 0.9 + i * 4)}`, 'none', 'stroke="#ffcf6a" stroke-width=".25" opacity=".6"'); }).join('')
      + '</g>' + C(cx, cy, r, 'none', 'stroke="#9ab8ff" stroke-width=".7" opacity=".6"') + C(cx, cy, r + 1.4, 'none', 'stroke="#6a8aff" stroke-width="2" opacity=".15"') + C(cx, cy, r + 3, 'none', 'stroke="#4a6aff" stroke-width="2" opacity=".07"');
  };
  // A turbolaser strike on the city below: a white flash, a fireball and a
  // ring of smoke.
  const impact = (x, y, r = 1) => glow(x, y, r * 1.4, '#ffb46a', 0.55) + C(x, y, r * 0.8, '#ffe8c0') + C(x, y, r * 2.2, 'none', `stroke="#6a5a5a" stroke-width="${f2(r * 0.6)}" opacity=".45"`);
  // The Senate Building: the great flattened dome on its stalk, lit rings
  // round its rim, on a broad plaza with the Senate's pillars of light.
  const senate = (x, base, s) => g(x, base, s, 1,
    P('M-4 0 L-3 -12 L3 -12 L4 0Z', '#5a5a66', 'stroke="#2a2a34" stroke-width=".2"') + E(0, -14, 22, 4, '#7a7a88', 'stroke="#2a2a34" stroke-width=".3"') + P('M-22 -14 Q0 -26 22 -14Z', '#8a8a98', 'stroke="#2a2a34" stroke-width=".3"') + P('M-18 -15.6 Q0 -24.6 18 -15.6', 'none', 'stroke="#aaaabb" stroke-width=".3" opacity=".7"')
    + Array.from({ length: 16 }, (_, i) => C(f2(-20 + i * 2.66), f2(-13.6 + Math.abs(i - 7.5) * 0.12), 0.25, '#ffe8b0')).join('') + E(0, -13, 22, 1.4, '#3a3a46', 'opacity=".6"'));

  // ---------- Droids ----------
  // A BX-series droid commando, in detail: the lean armoured frame in
  // tan-grey with darker plating and weathering, segmented chest and
  // backpack, armoured thighs and shins with knee joints, the round head
  // with its single glowing photoreceptor and side vents, and a blaster
  // with its stock and sight. cap paints the white markings of a captain.
  const commando = (x, y, s, f = 1, cap = false) => g(x, y, s, f,
    E(0, 0.2, 2.6, 0.4, '#000', 'opacity=".25"')
    + P('M-0.7 -6.4 L-1.3 -3.2 L-1.4 0 M0.7 -6.4 L1.4 -3.2 L1.3 0', 'none', 'stroke="#3a3222" stroke-width="1" stroke-linejoin="round"') + R(-1.9, -6, 1.2, 2.6, '#8a7a62', 'rx=".3" stroke="#3a3222" stroke-width=".1"') + R(0.8, -6, 1.2, 2.6, '#8a7a62', 'rx=".3" stroke="#3a3222" stroke-width=".1"') + R(-2, -2.8, 1.3, 2.2, '#7a6a52', 'rx=".3" stroke="#3a3222" stroke-width=".1"') + R(0.8, -2.8, 1.3, 2.2, '#7a6a52', 'rx=".3" stroke="#3a3222" stroke-width=".1"')
    + C(-1.3, -3.2, 0.42, '#4a4232', 'stroke="#2a2214" stroke-width=".08"') + C(1.4, -3.2, 0.42, '#4a4232', 'stroke="#2a2214" stroke-width=".08"') + P('M-2.4 0 L-0.6 0 L-1.2 -0.7Z M0.6 0 L2.4 0 L1.4 -0.7Z', '#5a5242') + L(-1.6, -5.6, -1.6, -3.8, '#b8aa8e', 0.12) + L(1.1, -5.6, 1.1, -3.8, '#b8aa8e', 0.12) + (cap ? R(-1.9, -5.2, 1.2, 0.5, '#e8e4dc') + R(0.8, -5.2, 1.2, 0.5, '#e8e4dc') : '')
    + R(-1.4, -7.4, 2.8, 1.3, '#5a5242', 'rx=".3" stroke="#2a2214" stroke-width=".1"') + R(-0.4, -7.5, 0.8, 1.5, '#3a3222') + L(0, -7.4, -0.1, -9, '#3a3222', 0.6)
    + R(-2.6, -11.6, 1.2, 2.8, '#6a5e4a', 'rx=".3" stroke="#2a2214" stroke-width=".1"') + L(-2.2, -11.6, -2.4, -12.8, '#3a3222', 0.15)
    + P('M-1.9 -11.8 L1.9 -11.6 L1.5 -8.6 L-1.5 -8.6Z', '#8a7a62', 'stroke="#3a3222" stroke-width=".15"') + P('M-1.5 -11.4 L0 -10.4 L1.5 -11.3', 'none', 'stroke="#4a4232" stroke-width=".2"') + P('M-1.3 -10 L1.3 -9.9 M-1.2 -9.2 L1.2 -9.1', 'none', 'stroke="#4a4232" stroke-width=".15"') + (cap ? P('M-1.7 -11.6 L0 -10.6 L1.7 -11.5 L1.6 -11 L0 -10 L-1.6 -11.1Z', '#e8e4dc', 'opacity=".9"') : '') + P('M-1.6 -11 L-0.6 -9 M0.8 -11.2 L1.4 -9.8', 'none', 'stroke="#3a3222" stroke-width=".2" opacity=".55"') + C(1, -9.6, 0.2, '#ff6a3a', 'opacity=".7"')
    + E(-2, -11.4, 0.7, 0.55, '#6a5e4a', 'stroke="#2a2214" stroke-width=".1"') + E(2, -11.3, 0.7, 0.55, '#6a5e4a', 'stroke="#2a2214" stroke-width=".1"')
    + L(0, -11.7, 0.2, -12.4, '#3a3222', 0.6) + C(0.3, -13.4, 1.25, '#8a7a62', 'stroke="#3a3222" stroke-width=".15"') + P('M-0.9 -13.6 Q0.3 -14.7 1.5 -13.8', 'none', 'stroke="#c8baa0" stroke-width=".22" opacity=".7"') + P('M-0.6 -12.6 L-0.2 -12.3 M-0.8 -13.1 L-0.3 -12.8', 'none', 'stroke="#3a3222" stroke-width=".14"') + (cap ? P('M-0.9 -14.2 Q0.3 -14.9 1.5 -14.2', 'none', 'stroke="#e8e4dc" stroke-width=".32"') : '')
    + C(0.95, -13.3, 0.5, '#1a1410', 'stroke="#4a4232" stroke-width=".1"') + C(1, -13.3, 0.26, '#ff3a2a') + C(0.92, -13.4, 0.08, '#ffd0c0') + glow(1, -13.3, 0.35, '#ff3a2a', 0.45)
    + P('M0.4 -11.2 L1.2 -9.6 L2.6 -10', 'none', 'stroke="#5a5242" stroke-width=".6" stroke-linejoin="round" stroke-linecap="round"') + P('M-0.8 -11 L-0.4 -9.2 L1.6 -9.6', 'none', 'stroke="#6a5e4a" stroke-width=".55" stroke-linejoin="round" stroke-linecap="round"')
    + R(0.8, -10.5, 4.8, 0.7, '#2a2a2e', 'stroke="#141416" stroke-width=".08"') + R(0.4, -10.3, 1.2, 1.4, '#2a2a2e') + R(1.8, -11.1, 2, 0.55, '#3a3a40') + R(2.2, -11.3, 0.6, 0.3, '#ff3a2a', 'opacity=".7"') + L(5.6, -10.15, 6.4, -10.15, '#5a5a62', 0.3) + R(3, -9.9, 0.5, 0.9, '#2a2a2e'));

  // ---------- Places ----------
  // A burning rooftop of the city's high towers: plated deck, vents, an
  // antenna mast, a railing at the edge and the drop to the traffic below.
  const rooftop = (y) => R(0, y, 160, 90 - y, '#1e1a1e') + Array.from({ length: 9 }, (_, i) => L(80, y - 12, -40 + i * 30, 90, '#141016', 0.3)).join('') + [y + 6, y + 12].map((yy) => L(0, yy, 160, yy, '#141016', 0.3)).join('')
    + L(0, y, 160, y, '#ff7a3a', 0.4, 'opacity=".55"') + [[14, y + 4], [140, y + 6]].map(([vx, vy]) => R(vx - 3, vy - 3, 6, 3, '#2a2428', 'stroke="#141016" stroke-width=".2"') + [-1.6, 0, 1.6].map((dx) => L(vx + dx, vy - 2.6, vx + dx, vy - 0.4, '#141016', 0.3)).join('')).join('');
  // Shelves of the Temple Archives on fire: glowing blue holobook stacks
  // receding, flames licking up the aisles and smoke under the vaults.
  const archives = () => fill([[0, '#120c10'], [0.6, '#1e1418'], [1, '#2a1a1a']])
    + P('M0 0 Q80 -14 160 0 L160 10 Q80 -4 0 10Z', '#1a1418') + Array.from({ length: 7 }, (_, i) => P(`M${i * 26} 10 Q${i * 26 + 13} 2 ${i * 26 + 26} 10`, 'none', 'stroke="#3a2a2a" stroke-width=".8"')).join('')
    + [-1, 1].map((sd) => Array.from({ length: 6 }, (_, i) => { const x0 = sd < 0 ? 4 + i * 9 : 156 - i * 9; const w = 8 - i * 0.8; const top = 14 + i * 4; const bot = 76 - i * 3; return R(sd < 0 ? x0 : x0 - w, top, w, bot - top, '#18141a', 'stroke="#2a2228" stroke-width=".2"') + Array.from({ length: 9 }, (_, m) => L(sd < 0 ? x0 + 0.6 : x0 - w + 0.6, f2(top + 2 + m * (bot - top - 4) / 8), sd < 0 ? x0 + w - 0.6 : x0 - 0.6, f2(top + 2 + m * (bot - top - 4) / 8), m % 3 === 1 ? '#ff8a3a' : '#3a8aff', 0.5, `opacity="${m % 3 === 1 ? 0.7 : 0.55}"`)).join(''); }).join('')).join('')
    + R(56, 30, 48, 46, '#0e0a0e') + [[30, 76], [130, 76], [60, 70], [100, 70], [20, 66], [140, 64]].map(([x, y]) => fire(x, y, 2.6) + smoke(x, y - 4, 20, 0.35)).join('') + R(0, 76, 160, 14, '#1a1214') + L(0, 76, 160, 76, '#ff7a3a', 0.4, 'opacity=".5"');
  // The Works: Coruscant's abandoned industrial district. Rusted factory
  // blocks and smokestacks, gantry cranes against the red haze, girders,
  // pipes and catwalks, and the old freight crane's hook hanging overhead.
  const works = () => fill([[0, '#140808'], [0.5, '#4a1a12'], [1, '#a8401a']])
    + skyline(56, '#2a1414', '#ff8a4a', 0.5, 3, 20, 14, 36)
    + [[18, 20], [40, 14], [132, 18], [148, 22]].map(([x, h]) => R(x - 2, 56 - h - 20, 4, h + 20, '#1e1012', 'stroke="#3a1a14" stroke-width=".2"') + [0.3, 0.6].map((t) => R(x - 2.6, f2(36 - h + (h + 20) * t), 5.2, 1, '#2a1614')).join('') + smoke(x, 30 - h, 18, 0.45, '#2a1a18', '#4a2e26')).join('')
    + P('M60 56 L60 14 L100 14 L100 18 L66 18 L66 56Z', '#1e1214', 'stroke="#3a1a14" stroke-width=".3"') + Array.from({ length: 8 }, (_, i) => L(66 + i * 4.4, 14, 66 + i * 4.4 + 2.2, 18, '#3a1a14', 0.3)).join('') + L(96, 18, 96, 34, '#3a3a40', 0.3) + P('M94.6 34 Q96 37 97.4 34', 'none', 'stroke="#5a5a62" stroke-width=".6"')
    + R(0, 56, 160, 6, '#1e1214') + [8, 28, 48, 112, 132, 152].map((x) => R(x - 1, 44, 2, 12, '#2a1614') + L(x - 6, 44, x + 6, 44, '#2a1614', 0.8)).join('') + Array.from({ length: 16 }, (_, i) => L(i * 10, 44, i * 10 + 5, 50, '#2a1614', 0.4)).join('')
    + [[70, 22, 20, 30], [90, 26, 14, 26], [104, 30, 16, 22]].map(([x, top, w, h]) => R(x, top, w, h, '#241416', 'stroke="#3a1a14" stroke-width=".25"') + Array.from({ length: Math.floor(h / 4) }, (_, r) => Array.from({ length: Math.floor(w / 3) }, (_, c) => R(f2(x + 1 + c * 3), f2(top + 2 + r * 4), 1.6, 1.4, (r + c) % 3 ? '#ff8a4a' : '#3a1a14', 'opacity=".7"')).join('')).join('') + P(`M${x} ${top} L${x + w / 2} ${top - 3} L${x + w} ${top}Z`, '#2a1614')).join('')
    + P('M0 40 L160 36', 'none', 'stroke="#2a1614" stroke-width="1.4"') + Array.from({ length: 10 }, (_, i) => L(i * 16 + 4, 38.6 - i * 0.25, i * 16 + 4, 56, '#2a1614', 0.5)).join('') + [[24, 40], [56, 39], [120, 37]].map(([x, y]) => L(x, y, x, y + 8, '#4a4a52', 0.25) + R(x - 1.4, y + 8, 2.8, 2, '#3a2a28', 'stroke="#1a1210" stroke-width=".15"')).join('')
    + [[10, 60], [150, 58]].map(([x, y]) => R(x - 4, y - 8, 8, 8, '#2a1a18', 'stroke="#4a2a20" stroke-width=".2"') + R(x - 3, y - 6.6, 6, 1.4, '#ffb04a', 'opacity=".7"') + P(`M${x - 4} ${y - 8} L${x} ${y - 11} L${x + 4} ${y - 8}`, 'none', 'stroke="#4a2a20" stroke-width=".4"')).join('') + [[44, 58], [118, 56], [84, 60]].map(([x, y]) => Array.from({ length: 5 }, (_, i) => L(x, y, f2(x + Math.cos((-150 + i * 30) * Math.PI / 180) * 2.4), f2(y + Math.sin((-150 + i * 30) * Math.PI / 180) * 2.4), '#ffe08a', 0.15)).join('') + glow(x, y, 0.5, '#ffd05a', 0.5)).join('')
    + L(0, 66, 160, 66, '#3a2a28', 1.4) + L(0, 69, 160, 69, '#2a1e1c', 1) + Array.from({ length: 20 }, (_, i) => L(i * 8, 66, i * 8 + 4, 69, '#3a2a28', 0.35)).join('') + [20, 60, 100, 140].map((x) => L(x, 62, x, 66, '#3a2a28', 0.5) + C(x, 62, 0.5, '#ff5a2a')).join('') + R(0, 70, 160, 20, '#1a1214') + Array.from({ length: 12 }, (_, i) => L(80, 70, -60 + i * 26, 90, '#120c0e', 0.3)).join('') + [[30, 76], [124, 78]].map(([x, y]) => E(x, y, 6, 1, '#ff6a2a', 'opacity=".25"')).join('');
  // A senatorial repulsor pod: the curved platform with its lit front panel
  // and delegation crest, the railing, two tiny senators, the docking arm
  // beneath, and its running light.
  const pod = (x, y, s, c = '#6a7488', tone = 0) => g(x, y, s, 1,
    L(0, 1.6, 0, 4, '#2a3040', 0.5) + P('M-2.6 0 L2.6 0 L2 1.8 L-2 1.8Z', c, 'stroke="#1e2432" stroke-width=".15"') + P('M-2.2 0.4 L2.2 0.4 L1.8 1.4 L-1.8 1.4Z', '#3a4458') + C(0, 0.9, 0.35, ['#c8a050', '#8ab0d0', '#c86a5a', '#9ac08a'][tone % 4])
    + L(-2.6, 0, 2.6, 0, '#9aa4b8', 0.2) + L(-2.6, -0.8, 2.6, -0.8, '#5a6478', 0.12) + [-2.4, 0, 2.4].map((px) => L(px, 0, px, -0.8, '#5a6478', 0.1)).join('')
    + [-0.8, 0.8].map((px, i) => R(px - 0.35, -1.6, 0.7, 1.6, ['#b8a0d0', '#d0b878', '#a0b8d0', '#d08a7a'][(tone + i) % 4]) + C(px, -1.9, 0.32, '#d8c0a8')).join('') + C(2.4, 1, 0.18, '#ffe8b0'));
  // The Senate Rotunda: the vast round chamber, ring on ring of senatorial
  // pods docked around its walls and growing larger toward us, the docking
  // slots behind them, shafts of light from the high dome, the central
  // podium column with the Chancellor's platform and its insignia.
  const rotunda = () => fill([[0, '#04060c'], [0.6, '#0c1424'], [1, '#141c30']])
    + E(80, -6, 70, 16, '#1a2440', 'opacity=".6"') + Array.from({ length: 12 }, (_, i) => { const a = Math.PI * (i / 11); return L(f2(80 - Math.cos(a) * 70), f2(-6 + Math.sin(a) * 4), f2(80 - Math.cos(a) * 90), 16, '#22304c', 0.3); }).join('') + C(80, 0, 4, '#c8d8ff', 'opacity=".35"')
    + Array.from({ length: 6 }, (_, r) => { const y = 14 + r * 8.4; const rx = 92 - r * 7; const ry = 10 + r * 1.6; const n = 20 - r * 2; const ps = 0.55 + r * 0.14; return E(80, y + ry, rx, ry, 'none', 'stroke="#2a3450" stroke-width=".5"') + Array.from({ length: n }, (_, i) => { const a = Math.PI * (0.04 + (i / (n - 1)) * 0.92); return R(f2(80 - Math.cos(a) * rx - 2.6 * ps), f2(y + ry - Math.sin(a) * ry - 2.4 * ps), f2(5.2 * ps), f2(2.4 * ps), '#141c2e', 'stroke="#22304c" stroke-width=".12"'); }).join('') + Array.from({ length: n }, (_, i) => { const a = Math.PI * (0.04 + (i / (n - 1)) * 0.92); return pod(f2(80 - Math.cos(a) * rx), f2(y + ry - Math.sin(a) * ry), f2(ps), r % 2 ? '#6a7488' : '#5a6478', i + r); }).join(''); }).join('')
    + [40, 80, 120].map((x) => P(`M${x - 2} 0 L${x + 2} 0 L${x + 8} 90 L${x - 8} 90Z`, '#8aa8ff', 'opacity=".05"')).join('')
    + R(0, 70, 160, 20, '#0c1220') + [74, 80, 86].map((yy) => L(0, yy, 160, yy, '#141c30', 0.3)).join('') + E(80, 72, 30, 5, '#141c30', 'stroke="#3a4a70" stroke-width=".5"') + E(80, 72, 22, 3.6, 'none', 'stroke="#2a3a60" stroke-width=".3"')
    + R(72, 52, 16, 20, '#1a2236', 'stroke="#3a4a70" stroke-width=".3"') + [56, 60, 64, 68].map((yy) => L(72, yy, 88, yy, '#2a3450', 0.3)).join('') + [75, 80, 85].map((px) => L(px, 52, px, 72, '#141c30', 0.3)).join('') + E(80, 52, 10, 2.4, '#2a3450', 'stroke="#4a5a80" stroke-width=".3"') + C(80, 60, 2.2, 'none', 'stroke="#c8a050" stroke-width=".35"') + C(80, 60, 0.9, '#c8a050', 'opacity=".8"');

  // ---------- The ten scenes ----------
  const SG = {
    // 1 · Skyline Dogfight (fleet): the Battle of Coruscant over the city at
    // dusk. Venators and the Separatist fleet trade turbolaser fire high
    // above the burning towers; vulture droids, a TIE Interceptor and
    // Slave I chase ARC-170s through the traffic lanes, every shot straight
    // from their guns.
    skyline_dogfight: () => {
      const a1 = [118, 30, 0.85, -10]; const a2 = [136, 56, 0.75, -4]; const v1 = [56, 36, 1, -8]; const v2 = [40, 58, 0.9, -12]; const v3 = [84, 66, 0.8, -20]; const ti = [80, 22, 0.8, -6]; const sl = [24, 32, 0.9];
      const vg = VEN_T.map(([tx, ty]) => [f2(36 + tx * 0.6), f2(10 + ty * 0.6)]); const ig = IH_GUNS.map(([gx, gy]) => [f2(118 - gx * 0.5 + 0.8), f2(8 + gy * 0.5)]);
      return fill(SKY) + venator(36, 10, 0.6, 1) + invisibleHand(118, 8, 0.5, -1) + vg.map((p, i) => shots(p, [f2(108 - i * 4), 8], [0.2, 0.55], 0.12, BLUE)).join('') + ig.map((p, i) => shots(p, [f2(44 + i * 3), 9], [0.25, 0.6], 0.1, RED)).join('')
        + skyline(80, '#1a1018', '#ffb060', 0.6, 2, 26, 22, 56) + traffic([[50, 1], [58, -1]], 2) + skyline(90, '#120a10', '#ffcf7a', 0.9, 6, 20, 12, 40) + smoke(30, 62, 20, 0.4) + fire(30, 66, 2) + smoke(132, 66, 22, 0.4) + fire(132, 70, 2.4)
        + arc170(a1[0], a1[1], a1[2], a1[3]) + arc170(a2[0], a2[1], a2[2], a2[3])
        + [v1, v2, v3].map(([x, y, s, a]) => vulture(x, y, s, a)).join('') + tieInt(ti[0], ti[1], ti[2], ti[3]) + slave1(sl[0], sl[1], sl[2])
        + [v1, v2, v3].map(([x, y, s, a]) => gunsAt(x, y, s, a, VGUNS).map((p) => shots(p, fwd(p, a, 40), [0.18, 0.52], 0.12, RED)).join('')).join('')
        + gunsAt(ti[0], ti[1], ti[2], ti[3], TIGUNS).map((p) => shots(p, fwd(p, ti[3], 36), [0.2, 0.55], 0.13, GRN)).join('')
        + gunsAt(sl[0], sl[1], sl[2], 0, SLGUNS).map((p) => shots(p, [f2(p[0] + (p[0] - sl[0]) * 1.4), p[1] + 22], [0.15, 0.55], 0.14, RED)).join('')
        + embers(30, 1);
    },

    // 2 · Senate District Landing: the droid invasion reaches the Senate.
    // The great Senate dome stands over its plaza under a burning sky, droid
    // gunships descend with more droids, the skyline smoulders; a super
    // battle droid, a droideka, a MagnaGuard and two BX commando droids (one
    // a captain) hold the plaza.
    senate_district_landing: () => fill(SKY) + skyline(52, '#24141c', '#ff9a5a', 0.45, 11, 26, 14, 40) + skyline(64, '#1a1018', '#ffb060', 0.65, 4, 24, 18, 48) + traffic([[34, 1], [40, -1]], 4)
      + P('M0 46 Q40 42 60 46 M100 44 Q130 40 160 44', 'none', 'stroke="#2a1a22" stroke-width="1.4"') + [[22, 40], [138, 38]].map(([x, y]) => C(x, y, 0.3, '#ffe8b0')).join('') + senate(80, 66, 1.2)
      + [[44, 64], [116, 64]].map(([x, b]) => R(x - 1.6, b - 3, 3.2, 3, '#4a4652') + P(`M${x - 1} ${b - 3} L${x - 1.2} ${b - 12} C${x - 1.2} ${b - 14} ${x + 1.2} ${b - 14} ${x + 1.2} ${b - 12} L${x + 1} ${b - 3}Z`, '#6a6676', 'stroke="#2a2834" stroke-width=".2"') + C(x, b - 14.4, 1, '#6a6676')).join('')
      + [[30, 22, 1], [128, 18, 0.9]].map(([x, y, s]) => g(x, y, s, 1, P('M-9 0 L-6 -3 L-2 -4.4 L3 -4.4 L7 -2.6 L9 0 L7 2.4 L-6 2.6Z', '#6a5a44', 'stroke="#2a2214" stroke-width=".3"') + P('M-6 -3 L-2 -4.4 L3 -4.4 L7 -2.6 L-6 -1Z', '#8a7a5e', 'opacity=".6"') + P('M-4 -1 L-14 0.6 L-15 2.2 L-13 2.6 L-4 1.6Z M4 -1 L14 0.6 L15 2.2 L13 2.6 L4 1.6Z', '#5a4a36', 'stroke="#2a2214" stroke-width=".2"') + [-13, -10, 10, 13].map((px) => R(px - 0.6, 2.2, 1.2, 1.4, '#3a3024') + C(px, 3.8, 0.3, '#2a2214')).join('') + P('M6 -2.4 L9 -0.4 L6.6 0.6Z', '#2a2214') + C(7.4, -0.8, 0.35, '#ff3a2a') + R(-5, 0.2, 9, 0.6, '#3a3024') + [-3, -1, 1, 3].map((px) => C(px, 0.5, 0.18, '#ffd08a')).join('') + L(-8, -1.6, -11, -2.4, '#3a3024', 0.4) + [-4, 4].map((dx) => glow(dx, 3, 0.8, '#ffb070', 0.4)).join(''))).join('') + flak([[36, 26, 56, 52], [122, 22, 104, 50]], RED) + [[56, 52], [104, 50]].map(([x, y]) => glow(x, y, 1, '#ffb070', 0.5)).join('') + smoke(20, 56, 22, 0.4) + fire(20, 60, 2.2) + smoke(146, 54, 24, 0.4) + fire(146, 58, 2.6)
      + R(0, 66, 160, 24, '#2a2228') + Array.from({ length: 9 }, (_, i) => L(80, 60, -40 + i * 30, 90, '#1e181e', 0.3)).join('') + [72, 80].map((yy) => L(0, yy, 160, yy, '#1e181e', 0.3)).join('') + [[30, 64], [130, 64]].map(([x, y]) => R(x - 1.2, y - 18, 2.4, 18, '#3a3442') + E(x, y - 18, 2, 0.6, '#ffe8b0') + glow(x, y - 18, 1.4, '#ffe8b0', 0.3)).join('')
      + commando(22, 86, 2.5, 1, true) + droideka(52, 84, 2.4, 1) + magnaguard(80, 86, 2.8, 1, -24) + b2(108, 86, 2.5, -1) + commando(136, 86, 2.5, -1),

    // 3 · Burning Spires: atop the towers as the city burns. Smoke columns
    // and fires on the spires all around, the Venator overhead, the deck
    // edge falling away to the traffic far below; General Grievous, as on
    // his boss card, with his MagnaGuards, a super battle droid and a
    // droideka.
    burning_spires: () => fill([[0, '#0a0608'], [0.5, '#4a1a14'], [1, '#c8582a']]) + venator(118, 12, 0.7, -1)
      + skyline(70, '#1a0c10', '#ff9a4a', 0.7, 8, 22, 26, 60) + [[20, 30], [64, 24], [100, 34], [146, 28]].map(([x, y]) => smoke(x, y, 26, 0.5) + fire(x, y + 4, 2.4)).join('')
      + rooftop(70) + droideka(20, 84, 2.3, 1, false) + b2(138, 86, 2.5, -1) + magnaguard(42, 86, 2.9, 1, -30) + magnaguard(118, 86, 2.9, -1, -30) + grievousBoss(80, 94, 0.56) + embers(40, 3),

    // 4 · Boarding the Invisible Hand (fleet): over Coruscant, Grievous's
    // flagship looms with its row of towers, Venators trading fire with it;
    // Anakin's and Obi-Wan's Jedi starfighters dive for its hangar while
    // vulture droids, a TIE Advanced, Slave I and a Lambda shuttle close in,
    // every shot from their guns.
    boarding_the_invisible_hand: () => {
      const ak = [60, 56, 0.9, -8]; const ob = [42, 66, 0.85, -8]; const v1 = [104, 70, 0.8, 192]; const ta = [24, 44, 0.9, 8]; const v2 = [130, 52, 0.75, 186]; const sl = [140, 76, 0.7];
      return fill([[0, '#020308'], [1, '#0c1020']]) + Array.from({ length: 50 }, (_, i) => C((i * 41) % 160, (i * 67) % 90, 0.25, '#fff', `opacity="${(0.3 + (i % 3) * 0.15).toFixed(2)}"`)).join('') + planet(30, 128, 70, 'b')
        + invisibleHand(96, 30, 2, 1) + venator(24, 14, 0.7, -1) + flak([[34, 14, 50, 28], [40, 18, 60, 30]], BLUE) + flak([[76, 28, 46, 18]], RED) + fire(70, 32, 1.4) + smoke(72, 28, 10, 0.4)
        + lambda(150, 30, 0.7, 0)
        + delta7(ak[0], ak[1], ak[2], ak[3], '#e8b83a', '#3a6ad8') + delta7(ob[0], ob[1], ob[2], ob[3], '#c83a2a', '#c83a2a')
        + vulture(v1[0], v1[1], v1[2], v1[3]) + vulture(v2[0], v2[1], v2[2], v2[3]) + tieAdv(ta[0], ta[1], ta[2], ta[3]) + slave1(sl[0], sl[1], sl[2])
        + [v1, v2].map(([x, y, s, a]) => gunsAt(x, y, s, a, VGUNS).map((p) => shots(p, fwd(p, a, 40), [0.18, 0.52], 0.12, RED)).join('')).join('')
        + gunsAt(ta[0], ta[1], ta[2], ta[3], TAGUNS).map((p) => shots(p, fwd(p, ta[3], 30), [0.2, 0.55], 0.13, GRN)).join('')
        + [ak, ob].map(([x, y, s, a]) => gunsAt(x, y, s, a, D7GUNS).map((p) => shots(p, fwd(p, a, 34), [0.18, 0.52], 0.12, GRN)).join('')).join('');
    },

    // 5 · Order 66: Temple Steps: the Jedi Temple burning in the night,
    // smoke pouring from its spires, gunships overhead; Darth Vader leads
    // the 501st up the steps, a death trooper at the line's end.
    order_66_temple_steps: () => fill([[0, '#0a0608'], [0.5, '#3a1210'], [0.8, '#8a2a1a'], [1, '#c8582a']]) + skyline(70, '#1a0c0e', '#ff9a4a', 0.6, 10, 24, 20, 50)
      + smoke(82, 12, 22, 0.55) + temple(80, 62, 0.95, true) + fire(80, 46, 1.8) + laat(30, 22, 0.7, 1) + laat(128, 16, 0.6, -1)
      + P('M48 62 L112 62 L148 90 L12 90Z', '#8a7a62') + Array.from({ length: 8 }, (_, i) => L(f2(48 - i * 4.6), 62 + i * 3.6, f2(112 + i * 4.6), 62 + i * 3.6, '#5a4a36', 0.3)).join('') + [[36, 76], [126, 80]].map(([x, y]) => fire(x, y, 2)).join('')
      + clone(36, 86, 2.5, 1) + clone(58, 84, 2.4, 1) + clone(108, 84, 2.4, -1) + deathTrooper(132, 86, 2.5, -1) + vaderFull(82, 88, 3.4, 1) + embers(30, 5),

    // 6 · Temple Archives: the Archives burning. Holobook stacks glow blue
    // between the flames, smoke rolls under the vaults; Vader with the Grand
    // Inquisitor and the Second Sister, clone troopers at their backs.
    temple_archives: () => (kit.archivesHall ? archivesHall() + R(0, 0, 160, 90, '#ff5a1a', 'opacity=".1"') + [[24, 70], [136, 70], [62, 64], [98, 64], [14, 58], [146, 56]].map(([x, y]) => fire(x, y, 2.6) + smoke(x, y - 4, 22, 0.4)).join('') + smoke(80, 30, 18, 0.35) : archives())
      + clone(16, 82, 2.1, 1) + clone(146, 82, 2.1, -1) + grandInq(40, 88, 2.8, 1) + secondSis(120, 88, 2.8, -1) + vaderFull(80, 88, 3.4, 1) + embers(30, 6),

    // 7 · Orbital Barrage (fleet): high over Coruscant, its night side a web
    // of city lights. A Star Destroyer rains turbolaser fire down on the
    // planet; a TIE Advanced, TIE Interceptors, Slave I and a vulture
    // droid chase ARC-170s, every bolt straight from their guns.
    orbital_barrage: () => {
      const a1 = [130, 40, 0.8, -12]; const a2 = [112, 64, 0.75, -20]; const ta = [70, 44, 1, -12]; const i1 = [48, 58, 0.85, -18]; const i2 = [86, 72, 0.8, -28]; const v1 = [42, 28, 0.8, -4]; const sl = [20, 60, 0.75];
      return fill([[0, '#020308'], [1, '#0a0e1c']]) + Array.from({ length: 60 }, (_, i) => C((i * 41) % 160, (i * 67) % 90, 0.25, '#fff', `opacity="${(0.3 + (i % 3) * 0.15).toFixed(2)}"`)).join('') + planet(110, 150, 96, 'o')
        + isd(30, 14, 1.2, '#8a929c') + [[-20, 5.6], [-12, 5.4], [-4, 5.2], [4, 5]].map(([tx, ty]) => g(30, 14, 1.2, 1, R(tx - 0.8, ty, 1.6, 0.8, '#5a626c', 'rx=".3"') + L(tx, ty + 0.6, tx + 0.9, ty + 2, '#3e464e', 0.3))).join('')
        + [[-20, 5.6, 70], [-12, 5.4, 86], [-4, 5.2, 102], [4, 5, 118]].map(([tx, ty, ix]) => { const iy = f2(150 - Math.sqrt(96 * 96 - (ix - 110) ** 2) + 3); return [tx, ty, ix, iy]; }).map(([tx, ty, ix, iy]) => { const p = [f2(30 + (tx + 0.9) * 1.2), f2(14 + (ty + 2) * 1.2)]; return shots(p, [ix, iy], [0.1, 0.4, 0.7], 0.16, GRN) + impact(ix, iy, 1.2); }).join('')
        + arc170(a1[0], a1[1], a1[2], a1[3]) + arc170(a2[0], a2[1], a2[2], a2[3])
        + tieAdv(ta[0], ta[1], ta[2], ta[3]) + tieInt(i1[0], i1[1], i1[2], i1[3]) + tieInt(i2[0], i2[1], i2[2], i2[3]) + vulture(v1[0], v1[1], v1[2], v1[3]) + slave1(sl[0], sl[1], sl[2])
        + gunsAt(ta[0], ta[1], ta[2], ta[3], TAGUNS).map((p) => shots(p, fwd(p, ta[3], 44), [0.15, 0.5], 0.12, GRN)).join('')
        + [i1, i2].map(([x, y, s, a]) => gunsAt(x, y, s, a, TIGUNS).map((p) => shots(p, fwd(p, a, 40), [0.18, 0.52], 0.12, GRN)).join('')).join('')
        + gunsAt(v1[0], v1[1], v1[2], v1[3], VGUNS).map((p) => shots(p, fwd(p, v1[3], 50), [0.2, 0.55], 0.12, RED)).join('')
        + [a1, a2].map(([x, y, s, a]) => gunsAt(x, y, s, a, ARCGUNS).map((p) => shots(p, fwd(p, a + 180, 20), [0.25, 0.6], 0.14, RED)).join('')).join('');
    },

    // 8 · The Works: the rusted industrial district. Smokestacks and gantry
    // cranes against the red haze, girders and pipes overhead, the old
    // freight crane's hook hanging; the Fifth Brother, the Seventh Sister
    // and the Eighth Brother with a BX commando captain and a death trooper.
    the_works: () => works()
      + commando(22, 84, 2.4, 1, true) + deathTrooper(138, 86, 2.5, -1) + seventhSis(52, 86, 2.9, 1) + fifthBro(80, 88, 3, 1) + eighthBro(108, 86, 2.9, -1) + embers(24, 8),

    // 9 · Senate Rotunda: the Senate chamber, ring on ring of floating pods
    // rising into the dark under shafts of light, the central podium; Darth
    // Sidious unleashes lightning beside Count Dooku and the Grand
    // Inquisitor, MagnaGuards on guard.
    senate_rotunda: () => rotunda()
      + magnaguard(20, 86, 2.7, 1, -10) + magnaguard(140, 86, 2.7, -1, -10) + dooku(48, 86, 3, 1) + grandInq(112, 88, 2.9, -1)
      + palpatine(80, 80, 3, 1) + forceLightning(f2(80 - 6.8 * 3), f2(80 - 11.6 * 3), 8, 40, 3) + forceLightning(f2(80 + 6.8 * 3), f2(80 - 11.6 * 3), 152, 42, 4),

    // 10 · Fall of the Republic: the Empire rises. The Senate Rotunda dark
    // and burning, Imperial banners hung from the podium, the city on fire
    // beyond; Darth Sidious stands with Vader, Dooku, the Grand Inquisitor
    // and General Grievous.
    fall_of_the_republic: () => rotunda() + R(0, 0, 160, 90, '#ff3a1a', 'opacity=".1"') + [[30, 30], [124, 22], [96, 40]].map(([x, y]) => C(x, y, 4, '#1a0a0a', 'opacity=".7"') + glow(x, y, 2, '#ff6a2a', 0.35) + fire(x, y + 2, 1.4) + smoke(x, y - 2, 16, 0.4)).join('')
      + Array.from({ length: 10 }, (_, i) => trooper(f2(24 + i * 12.4), 68 + (i % 2) * 1.2, 0.95, i < 5 ? 1 : -1)).join('')
      + [[56, 18], [104, 18]].map(([x, y]) => L(x - 6, y, x + 6, y, '#5a5a62', 0.6) + R(x - 5, y, 10, 30, '#7a1a14', 'stroke="#3a0a08" stroke-width=".3"') + R(x - 5, y, 1.2, 30, '#5a0e0a') + R(x - 4, y + 2, 8, 0.6, '#c8c8d0', 'opacity=".5"') + R(x - 4, y + 25, 8, 0.6, '#c8c8d0', 'opacity=".5"') + C(x, y + 9, 3, 'none', 'stroke="#c8c8d0" stroke-width=".5"') + C(x, y + 9, 1.1, '#c8c8d0') + Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2; return L(f2(x + Math.cos(a) * 1.2), f2(y + 9 + Math.sin(a) * 1.2), f2(x + Math.cos(a) * 2.8), f2(y + 9 + Math.sin(a) * 2.8), '#c8c8d0', 0.4); }).join('') + P(`M${x - 5} ${y + 28} L${x} ${y + 25} L${x + 5} ${y + 28}Z`, '#141c30')).join('')
      + [[30, 62], [130, 62]].map(([x, y]) => smoke(x, y, 24, 0.4) + fire(x, y + 4, 2.4)).join('')
      + grandInq(18, 88, 2.7, 1) + dooku(42, 86, 2.9, 1) + vaderFull(104, 88, 3.3, -1) + palpatine(72, 82, 3.1, 1) + grievousBoss(138, 100, 0.5) + embers(30, 9),
  };
  Object.assign(SA.scenes, SG);
  SA.worlds.coruscant_siege = ['skyline_dogfight', 'senate_district_landing', 'burning_spires', 'boarding_the_invisible_hand', 'order_66_temple_steps', 'temple_archives', 'orbital_barrage', 'the_works', 'senate_rotunda', 'fall_of_the_republic'];
})(typeof window !== 'undefined' ? window : globalThis);
