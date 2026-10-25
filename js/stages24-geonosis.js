// Update 2.4: the ten Geonosis stage scenes, for approval. Same 160x90
// format as the worlds before, all set on Geonosis at the start of the Clone
// Wars: the droid control ship launching vulture droids in orbit, the hive
// spires, the droid foundry and its conveyor belts, Jedi starfighters in the
// asteroid ring, the strike team in the Petranaki arena, the droideka wall,
// the MagnaGuards' hall, the battle on the plains, and Dooku's hangar.
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
  const starfield = (n, seed) => Array.from({ length: n }, (_, k) => C(((k * 41 + seed * 11) % 160), ((k * 67 + seed * 5) % 90), (0.2 + (k % 3) * 0.12).toFixed(2), '#ffffff', `opacity="${(0.3 + (k % 4) * 0.12).toFixed(2)}"`)).join('');
  const gunsAt = kit.gunsAt || ((x, y, s, a, pts) => { const r = (a * Math.PI) / 180; return pts.map(([lx, ly]) => [x + s * (lx * Math.cos(r) - ly * Math.sin(r)), y + s * (lx * Math.sin(r) + ly * Math.cos(r))]); });
  const shots = kit.shots || ((a, b, ts, len = 0.14, c = '#3aff6a') => ts.map((t) => bolt(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[0] + (b[0] - a[0]) * (t + len), a[1] + (b[1] - a[1]) * (t + len), c)).join(''));
  // A point d units on from p along heading a (degrees): where a ship's
  // guns are pointing, so every shot runs straight out of its barrels.
  const fwd = (p, a, d) => [+(p[0] + Math.cos((a * Math.PI) / 180) * d).toFixed(2), +(p[1] + Math.sin((a * Math.PI) / 180) * d).toFixed(2)];
  const smoke = (x, y, h, a = 0.5, c1 = '#3a2418', c2 = '#6a4430') => Array.from({ length: 7 }, (_, k) => { const yy = y - (k * h) / 7; const xx = x + k * 1.8 + (k % 2) * 1.4; const r = 2.6 + k * 1.6; return C(xx, yy, r, k < 3 ? c1 : c2, `opacity="${(a * (1 - k * 0.1)).toFixed(2)}"`); }).join('');
  const fire = (x, y, r) => glow(x, y, r, '#ff8a3a', 0.5) + P(`M${x - r} ${y} Q${x - r * 0.6} ${y - r * 1.6} ${x - r * 0.2} ${y - r * 0.6} Q${x} ${y - r * 2.2} ${x + r * 0.3} ${y - r * 0.7} Q${x + r * 0.7} ${y - r * 1.5} ${x + r} ${y}Z`, '#ff9a3a') + P(`M${x - r * 0.5} ${y} Q${x - r * 0.2} ${y - r} ${x} ${y - r * 0.4} Q${x + r * 0.3} ${y - r * 1.1} ${x + r * 0.5} ${y}Z`, '#ffe08a');
  const RED = '#ff4a3a';
  const GRN = '#3aff6a';
  const none = () => '';
  const robed = kit.robed || none;
  const clone = kit.clone || none;
  const laat = kit.laat || none;

  // ---------- The world ----------
  const SKY = [[0, '#3a1610'], [0.45, '#a8482a'], [0.8, '#e8884a'], [1, '#f4b070']];
  // Geonosis from orbit: the rust-red world with its dust bands and craters,
  // the night side in shadow and a thin glowing rim.
  const planet = (cx, cy, r, id) => {
    const [gr, d] = RG([[0, '#f4a868'], [0.55, '#c8602e'], [1, '#6a2412']], 0.38, 0.35, 0.7);
    const cid = `geoP${id}`;
    return d + `<clipPath id="${cid}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>` + glow(cx, cy, r * 0.44, '#ff8a4a', 0.12) + C(cx, cy, r, gr)
      + `<g clip-path="url(#${cid})">`
      + [[-0.62, 0.9], [-0.35, 1.3], [-0.05, 0.8], [0.25, 1.1], [0.52, 0.7]].map(([dy, k]) => P(`M${cx - r * 1.2} ${(cy + r * dy).toFixed(2)} Q${cx} ${(cy + r * (dy - 0.14 * k)).toFixed(2)} ${cx + r * 1.2} ${(cy + r * dy).toFixed(2)}`, 'none', `stroke="#8a3418" stroke-width="${(r * 0.05 * k).toFixed(2)}" opacity=".32"`)).join('')
      + [[-0.35, -0.1, 0.12], [0.2, -0.35, 0.08], [0.05, 0.3, 0.14], [-0.5, 0.35, 0.07], [0.45, 0.1, 0.1], [-0.1, -0.6, 0.06], [-0.6, -0.4, 0.05], [0.32, -0.62, 0.05]].map(([dx, dy, k]) => { const x = +(cx + dx * r).toFixed(2); const y = +(cy + dy * r).toFixed(2); const rr = +(r * k).toFixed(2); return E(x, y, rr, +(rr * 0.8).toFixed(2), '#8a3a1c', 'opacity=".55"') + P(`M${x - rr} ${y} A${rr} ${+(rr * 0.8).toFixed(2)} 0 0 1 ${x + rr} ${y}`, 'none', 'stroke="#f4a868" stroke-width=".3" opacity=".55"'); }).join('')
      + C(cx + r * 0.7, cy + r * 0.62, r * 1.02, '#140604', 'opacity=".6"') + `</g>` + C(cx, cy, r, 'none', 'stroke="#ffb878" stroke-width=".5" opacity=".5"');
  };
  // The asteroid ring that circles Geonosis. half 1 draws only the far side,
  // half 2 only the near side, so the planet can sit between them.
  const ring = (cx, cy, rx, ry, n, seed, half) => Array.from({ length: n }, (_, k) => {
    const t = (((k * 137.5) + seed * 29) % 360) * Math.PI / 180; const sn = Math.sin(t);
    if ((half === 1 && sn > 0) || (half === 2 && sn <= 0)) return '';
    const jr = 0.9 + ((k * 7 + seed) % 11) / 50; const x = cx + Math.cos(t) * rx * jr; const y = cy + sn * ry * jr + (((k * 5) % 7) - 3) * 0.25;
    const r = (0.25 + ((k * 13 + seed) % 7) * 0.12) * (half === 2 ? 1.4 : 1);
    return E(x.toFixed(2), y.toFixed(2), (r * 1.3).toFixed(2), r.toFixed(2), k % 3 ? '#6a3a24' : '#9a5a38', 'opacity=".95"');
  }).join('') + (half === 1 ? E(cx, cy, rx, ry, 'none', 'stroke="#c8885a" stroke-width="1.4" opacity=".1"') : '');
  // A tumbling asteroid: pitted, lit on one side.
  const rock = (x, y, r, a = 0) => g(x, y, r, 1, P('M-1 -0.2 C-1.1 -0.8 -0.4 -1.1 0.2 -1 C0.9 -0.9 1.2 -0.3 1 0.3 C0.8 0.9 0 1.1 -0.5 0.9 C-1 0.7 -1.05 0.3 -1 -0.2Z', '#7a4428', 'stroke="#3a1a0e" stroke-width=".06"') + P('M-0.2 0.9 C0.6 0.8 1.1 0.3 1 -0.2 C0.7 0.4 0.2 0.7 -0.2 0.9Z', '#3a1a0e', 'opacity=".6"') + E(-0.3, -0.3, 0.22, 0.16, '#4a2414') + E(0.35, 0.2, 0.15, 0.11, '#4a2414') + E(-0.5, 0.35, 0.1, 0.08, '#4a2414') + P('M-0.8 -0.4 C-0.6 -0.8 -0.1 -0.95 0.3 -0.9', 'none', 'stroke="#d8986a" stroke-width=".08" opacity=".7"'), a);
  // A Geonosian hive spire: the tall termite-mound towers of packed rock,
  // ringed with ridges and studded with doorways, some of them lit.
  const spire = (x, base, w, h, c = '#a85a34', dk = '#5a2a16', lit = 0.5, seed = 0) => {
    const top = base - h;
    const f = (v) => +v.toFixed(2);
    const outline = `M${f(x - w)} ${base} C${f(x - w * 0.95)} ${f(base - h * 0.35)} ${f(x - w * 0.55)} ${f(base - h * 0.65)} ${f(x - w * 0.3)} ${f(top + h * 0.1)} C${f(x - w * 0.25)} ${f(top)} ${f(x + w * 0.25)} ${f(top)} ${f(x + w * 0.3)} ${f(top + h * 0.1)} C${f(x + w * 0.55)} ${f(base - h * 0.65)} ${f(x + w * 0.95)} ${f(base - h * 0.35)} ${f(x + w)} ${base}Z`;
    const shade = `M${f(x + w * 0.12)} ${base} C${f(x + w * 0.2)} ${f(base - h * 0.4)} ${f(x + w * 0.15)} ${f(base - h * 0.7)} ${f(x + w * 0.05)} ${f(top + h * 0.04)} C${f(x + w * 0.22)} ${f(top + h * 0.04)} ${f(x + w * 0.28)} ${f(top + h * 0.07)} ${f(x + w * 0.3)} ${f(top + h * 0.1)} C${f(x + w * 0.55)} ${f(base - h * 0.65)} ${f(x + w * 0.95)} ${f(base - h * 0.35)} ${f(x + w)} ${base}Z`;
    const wAt = (t) => w * (1 - t * 0.72);
    const nr = Math.max(3, Math.round(h / 5));
    const ridges = Array.from({ length: nr }, (_, k) => { const t = (k + 0.6) / (nr + 1); const yy = f(base - h * t); const ww = wAt(t); return P(`M${f(x - ww)} ${yy} Q${x} ${f(yy + ww * 0.25)} ${f(x + ww)} ${yy}`, 'none', `stroke="${dk}" stroke-width="${f(0.25 + w * 0.03)}" opacity=".7"`) + P(`M${f(x - ww)} ${f(yy - 0.45)} Q${x} ${f(yy + ww * 0.25 - 0.45)} ${f(x + ww)} ${f(yy - 0.45)}`, 'none', 'stroke="#e8a874" stroke-width=".2" opacity=".35"'); }).join('');
    const holes = Array.from({ length: Math.round(h / 3) }, (_, k) => { const t = ((k * 0.37 + seed * 0.13) % 0.85) + 0.05; const yy = f(base - h * t); const ww = wAt(t); const xx = f(x + (((k * 53 + seed * 17) % 100) / 100 - 0.5) * ww * 1.3); const on = ((k * 7 + seed) % 10) / 10 < lit; const hw = f(Math.max(0.3, w * 0.07)); return E(xx, yy, hw, f(hw * 1.4), on ? '#ffc85a' : '#2a1008', on ? '' : 'opacity=".85"') + (on ? C(xx, yy, f(hw * 2.4), '#ffb84a', 'opacity=".2"') : ''); }).join('');
    const bumps = Array.from({ length: Math.round(h / 6) }, (_, k) => { const t = (k + 0.3) / Math.round(h / 6 + 0.5); const sd = k % 2 ? 1 : -1; const ww = wAt(t); return E(f(x + sd * ww * 0.92), f(base - h * t), f(Math.max(0.4, w * 0.12)), f(Math.max(0.6, w * 0.2)), sd > 0 ? dk : c, `stroke="${dk}" stroke-width=".15"`); }).join('');
    return P(outline, c, `stroke="${dk}" stroke-width=".25"`) + bumps + P(shade, dk, 'opacity=".35"') + ridges + holes + E(x, f(top + h * 0.03), f(w * 0.3), f(w * 0.12), dk, 'opacity=".6"') + L(x, top, x, f(top - h * 0.07), dk, f(Math.max(0.3, w * 0.08)));
  };
  // Flat-topped buttes along the horizon, with their rock strata.
  const mesas = (base, c, a, seed) => `<g opacity="${a}">` + Array.from({ length: 7 }, (_, k) => { const x = ((k * 31 + seed * 17) % 180) - 10; const w = 10 + ((k * 7 + seed) % 5) * 4; const h = 6 + ((k * 11 + seed) % 6) * 2.4; return P(`M${x} ${base} L${x + w * 0.12} ${base - h} L${x + w * 0.3} ${base - h - 1} L${x + w * 0.75} ${base - h - 0.6} L${x + w * 0.88} ${base - h} L${x + w} ${base}Z`, c) + L(x + w * 0.15, base - h * 0.6, x + w * 0.85, base - h * 0.6, '#000', 0.25, 'opacity=".14"') + L(x + w * 0.1, base - h * 0.3, x + w * 0.9, base - h * 0.3, '#000', 0.25, 'opacity=".12"') + P(`M${x + w * 0.62} ${base - h - 0.7} L${x + w * 0.88} ${base - h} L${x + w} ${base} L${x + w * 0.7} ${base}Z`, '#000', 'opacity=".14"'); }).join('') + R(-1, base, 162, 1, c) + '</g>';
  // A sonic blast from a Geonosian blaster: rippling rings.
  const sonic = (x1, y1, x2, y2) => { const a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI; return [0.25, 0.45, 0.65, 0.85].map((t, k) => { const x = +(x1 + (x2 - x1) * t).toFixed(2); const y = +(y1 + (y2 - y1) * t).toFixed(2); return E(x, y, 0.5 + k * 0.15, 1 + k * 0.5, 'none', `stroke="#d8ff9a" stroke-width=".35" opacity="${0.9 - k * 0.15}" transform="rotate(${a.toFixed(1)} ${x} ${y})"`); }).join('') + glow(x2, y2, 0.6, '#c8ff8a', 0.4); };

  // ---------- People and droids ----------
  // A Geonosian warrior: bronze insect body, long digitigrade legs, the
  // ridged thorax, a long head with big compound eyes and a crest, folded
  // translucent wings, holding a sonic blaster with its glowing orb.
  const geonosian = (x, y, s, f = 1, fly = false) => g(x, y, s, f,
    (fly ? '' : E(0, 0.2, 2.6, 0.4, '#000', 'opacity=".25"'))
    + (fly
      ? P('M-0.4 -9.4 C-4 -14 -8 -14.6 -9 -12.6 C-8 -11 -4 -10 -0.4 -8.6Z M0.2 -9.4 C2 -14.6 5.4 -16 6.4 -14.4 C5.6 -12.6 2.6 -10.4 0.4 -8.6Z', '#e8dcc0', 'opacity=".5" stroke="#8a7a5a" stroke-width=".12"') + P('M-0.4 -9 C-3.6 -12 -6.6 -12.8 -8.4 -12.6 M-0.4 -9 C-3 -11 -5 -11.2 -7 -11.4 M0.3 -9 C2 -12.4 4 -14 6 -14.4 M0.3 -9 C1.8 -11.4 3.4 -12.6 5 -13', 'none', 'stroke="#8a7a5a" stroke-width=".1" opacity=".7"')
      : P('M-0.6 -9.6 C-2.4 -11 -3.4 -7 -2.6 -3.4 C-2 -5.4 -1.4 -7.4 -0.4 -8.6Z', '#e8dcc0', 'opacity=".45" stroke="#8a7a5a" stroke-width=".12"') + P('M-0.6 -9.4 C-1.6 -8 -2.2 -6 -2.3 -4.4 M-0.6 -9.2 C-1.2 -8 -1.6 -7 -1.8 -6', 'none', 'stroke="#8a7a5a" stroke-width=".1" opacity=".7"'))
    + (fly
      ? P('M-0.4 -6.4 L-1.4 -4 L-2.6 -3 M0.4 -6.4 L0.4 -3.6 L-0.6 -2.4', 'none', 'stroke="#6a4220" stroke-width=".6" stroke-linecap="round" stroke-linejoin="round"')
      : P('M-0.5 -6.4 L-1.6 -3.4 L-1 0 M0.5 -6.4 L1.8 -3.4 L1.4 0', 'none', 'stroke="#5a3418" stroke-width=".75" stroke-linecap="round" stroke-linejoin="round"') + P('M-0.5 -6.4 L-1.6 -3.4 L-1 0 M0.5 -6.4 L1.8 -3.4 L1.4 0', 'none', 'stroke="#a8743a" stroke-width=".35" stroke-linecap="round" stroke-linejoin="round"') + C(-1.6, -3.4, 0.4, '#6a4220') + C(1.8, -3.4, 0.4, '#6a4220') + P('M-1.9 0 L-0.4 0 L-1 -0.5Z M0.6 0 L2.3 0 L1.4 -0.5Z', '#5a3418'))
    + E(-0.3, -6.8, 1.3, 1.1, '#8a5a2c', 'stroke="#4a2a12" stroke-width=".15"') + P('M-1.4 -7 Q-0.3 -6.4 0.9 -7 M-1.3 -6.4 Q-0.3 -5.9 0.8 -6.4', 'none', 'stroke="#4a2a12" stroke-width=".12"')
    + P('M-1.2 -7.6 C-1.6 -9.4 -0.8 -10.4 0.2 -10.4 C1.2 -10.4 1.6 -9.4 1.2 -7.6 C0.6 -7.2 -0.6 -7.2 -1.2 -7.6Z', '#a8743a', 'stroke="#4a2a12" stroke-width=".15"') + P('M-0.9 -9.6 Q0.1 -9.2 1 -9.6 M-1.1 -8.8 Q0.1 -8.4 1.2 -8.8 M-1.1 -8 Q0.1 -7.6 1.2 -8', 'none', 'stroke="#6a4220" stroke-width=".12"') + P('M0.4 -10.2 C1 -9.6 1.2 -8.6 1 -7.8', 'none', 'stroke="#e0b070" stroke-width=".15" opacity=".6"')
    + L(0.2, -10.2, 0.8, -11, '#8a5a2c', 0.5)
    + P('M-0.4 -11.8 C-1.2 -12.4 -1.6 -13.4 -1.2 -14 C-0.6 -13.6 -0.2 -13 0 -12.6Z', '#8a5a2c', 'stroke="#4a2a12" stroke-width=".12"')
    + P('M-0.4 -11.6 C-0.6 -12.8 0.4 -13.6 1.6 -13.2 C2.6 -12.8 3.2 -11.8 3 -11.2 C2.4 -10.6 1.2 -10.4 0.4 -10.6 C-0.1 -10.8 -0.4 -11.2 -0.4 -11.6Z', '#a8743a', 'stroke="#4a2a12" stroke-width=".15"') + P('M0 -12.4 Q0.8 -12.9 1.8 -12.8', 'none', 'stroke="#e0b070" stroke-width=".14" opacity=".6"')
    + E(1.7, -12.1, 0.75, 0.6, '#3a1608', 'stroke="#1a0804" stroke-width=".1"') + E(1.5, -12.3, 0.25, 0.18, '#ffd88a', 'opacity=".8"')
    + P('M2.8 -11.2 L3.4 -10.6 L2.8 -10.6 M2.4 -10.8 L2.8 -10.2', 'none', 'stroke="#4a2a12" stroke-width=".15"')
    + P('M0.4 -9.6 L1.6 -8.4 L2.6 -8.8', 'none', 'stroke="#8a5a2c" stroke-width=".45" stroke-linecap="round" stroke-linejoin="round"') + P('M-0.4 -9.4 L0.6 -7.6 L2.2 -8', 'none', 'stroke="#6a4220" stroke-width=".4" stroke-linecap="round" stroke-linejoin="round"')
    + R(1.6, -9.2, 3.4, 0.7, '#4a4038', 'rx=".2"') + R(2, -8.6, 0.6, 1, '#3a3028') + C(5.1, -8.85, 0.55, '#3a3a3e', 'stroke="#8adc6a" stroke-width=".2"') + C(5.1, -8.85, 0.25, '#b8ff8a'));
  // A B1 battle droid: thin tan frame, long snouted head with its round
  // photoreceptors, backpack, E-5 blaster. mark paints a unit colour.
  const b1 = (x, y, s, f = 1, mark) => g(x, y, s, f,
    E(0, 0.2, 2.4, 0.4, '#000', 'opacity=".25"')
    + P('M-0.6 -6.4 L-1.2 -3.2 L-1.4 0 M0.6 -6.4 L1.3 -3.2 L1.2 0', 'none', 'stroke="#7a6a4a" stroke-width=".7" stroke-linejoin="round"') + P('M-0.6 -6.4 L-1.2 -3.2 L-1.4 0 M0.6 -6.4 L1.3 -3.2 L1.2 0', 'none', 'stroke="#d8c49a" stroke-width=".32" stroke-linejoin="round"')
    + C(-1.2, -3.2, 0.36, '#8a7a5a') + C(1.3, -3.2, 0.36, '#8a7a5a') + P('M-2.2 0 L-0.8 0 L-1.2 -0.6Z M0.6 0 L2.2 0 L1.4 -0.6Z', '#b8a47a', 'stroke="#6a5a3e" stroke-width=".1"')
    + R(-1.1, -7.2, 2.2, 1, '#b8a47a', 'rx=".3" stroke="#6a5a3e" stroke-width=".12"') + L(0, -7.2, -0.2, -9, '#8a7a5a', 0.5)
    + R(-2.4, -11.4, 1.3, 2.4, '#a8946a', 'rx=".3" stroke="#6a5a3e" stroke-width=".12"') + L(-2, -11.4, -2.2, -12.6, '#6a5a3e', 0.15)
    + P('M-1.4 -11.8 L1.4 -11.6 L1 -9 L-0.9 -8.8Z', '#d8c49a', 'stroke="#6a5a3e" stroke-width=".14"') + P('M-0.9 -11 L0.9 -10.9 M-0.8 -10.2 L0.8 -10.1', 'none', 'stroke="#8a7a5a" stroke-width=".12"') + (mark ? R(-1.1, -11.5, 2.2, 0.7, mark, 'opacity=".9"') : '')
    + L(-0.1, -11.7, 0.4, -12.6, '#8a7a5a', 0.35)
    + P('M-0.4 -12.4 C-0.8 -13.4 -0.4 -14.4 0.4 -14.4 L2.6 -13.6 L2.8 -13.1 L0.4 -12.3Z', '#d8c49a', 'stroke="#6a5a3e" stroke-width=".14"') + C(0.2, -13.5, 0.4, '#b8a47a', 'stroke="#6a5a3e" stroke-width=".1"') + C(0.2, -13.5, 0.2, '#2a2418') + L(0.9, -13.1, 2.6, -13.4, '#8a7a5a', 0.12) + (mark ? P('M-0.4 -13.6 C-0.5 -14.2 -0.1 -14.4 0.4 -14.4 L1.4 -14.1 L1 -13.8Z', mark) : '')
    + P('M0.3 -11.2 L1 -9.6 L2.4 -10', 'none', 'stroke="#8a7a5a" stroke-width=".5" stroke-linejoin="round" stroke-linecap="round"') + P('M-0.6 -11.2 L-0.4 -9.4 L1.4 -9.6', 'none', 'stroke="#a8946a" stroke-width=".45" stroke-linejoin="round" stroke-linecap="round"')
    + R(0.8, -10.5, 4.2, 0.6, '#3a3a3e') + R(0.6, -10.3, 1, 1.2, '#2a2a2e') + R(1.8, -10.9, 1.4, 0.45, '#4a4a52') + L(5, -10.2, 5.8, -10.2, '#5a5a62', 0.3));
  // A B2 super battle droid: the hunched armoured chest, tiny head, heavy
  // legs and the wrist blasters built into its forearms.
  const b2 = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 3.2, 0.5, '#000', 'opacity=".25"')
    + P('M-1.6 -6.4 L-2 -3.4 L-1.8 -0.6 L-0.6 -0.6 L-0.6 -3.4 L-0.4 -6.4Z M0.4 -6.4 L0.8 -3.4 L0.8 -0.6 L2 -0.6 L2.2 -3.4 L1.6 -6.4Z', '#4a5262', 'stroke="#22262e" stroke-width=".15"')
    + E(-1.3, -3.4, 0.7, 0.5, '#2a2e38') + E(1.5, -3.4, 0.7, 0.5, '#2a2e38') + L(-1.6, -5.6, -1.4, -4.2, '#6a7488', 0.15) + L(1, -5.6, 1.2, -4.2, '#6a7488', 0.15)
    + P('M-2.6 0 L-0.2 0 L-0.4 -0.8 L-2.2 -0.8Z M0.4 0 L2.8 0 L2.4 -0.8 L0.6 -0.8Z', '#3a4050', 'stroke="#22262e" stroke-width=".12"')
    + R(-1.8, -7.4, 3.6, 1.2, '#2a2e38', 'rx=".3"')
    + P('M-3.2 -12.4 C-3.6 -10 -2.8 -8 -1.6 -7.2 L1.6 -7.2 C2.8 -8 3.6 -10 3.2 -12.4 C1.6 -13.2 -1.6 -13.2 -3.2 -12.4Z', '#4a5262', 'stroke="#22262e" stroke-width=".2"')
    + P('M-2.4 -11.6 C-2.6 -10 -2 -8.6 -1.2 -8 M2.4 -11.6 C2.6 -10 2 -8.6 1.2 -8 M-1.4 -12.2 L1.4 -12.2 M-0.9 -10.6 L0.9 -10.6 M-0.7 -9.4 L0.7 -9.4', 'none', 'stroke="#2a2e38" stroke-width=".2"') + P('M-2.6 -12.2 C-1.4 -12.8 0 -12.9 1 -12.8', 'none', 'stroke="#7a86a0" stroke-width=".25" opacity=".7"')
    + P('M-0.8 -12.8 C-0.8 -13.8 0.8 -13.8 0.8 -12.8Z', '#3a4050', 'stroke="#22262e" stroke-width=".12"') + R(-0.5, -13.3, 1, 0.25, '#ff4a3a', 'opacity=".75"')
    + E(-3.4, -11.6, 1.1, 1, '#3a4050', 'stroke="#22262e" stroke-width=".15"') + E(3.4, -11.6, 1.1, 1, '#3a4050', 'stroke="#22262e" stroke-width=".15"')
    + P('M-3.8 -11 L-4.2 -8.4 L-3.6 -6.6', 'none', 'stroke="#4a5262" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"') + R(-4.4, -7.6, 1.6, 2, '#2a2e38', 'rx=".3"')
    + P('M3.6 -11 L4 -9.4', 'none', 'stroke="#4a5262" stroke-width="1.1" stroke-linecap="round"') + R(3.2, -10.2, 3.6, 1.7, '#3a4050', 'rx=".4" stroke="#22262e" stroke-width=".15"') + R(6.6, -9.9, 0.9, 0.4, '#1a1a1e') + R(6.6, -9.1, 0.9, 0.4, '#1a1a1e') + L(4, -9.4, 6.2, -9.4, '#5a6478', 0.15));
  // A droideka, deployed: the bronze curved shell and head, tripod legs, twin
  // blaster arms, and the shimmering bubble of its deflector shield.
  const droideka = (x, y, s, f = 1, shield = true) => g(x, y, s, f,
    E(0, 0.2, 3.6, 0.5, '#000', 'opacity=".25"')
    + P('M-0.8 -5.6 L-3 -2.8 L-3.8 0 M0.4 -5.6 L2 -3 L2.2 0 M0 -5.4 L1 -2.6 L0.6 0', 'none', 'stroke="#4a2e16" stroke-width=".7" stroke-linejoin="round" stroke-linecap="round"') + P('M-0.8 -5.6 L-3 -2.8 L-3.8 0 M0.4 -5.6 L2 -3 L2.2 0', 'none', 'stroke="#b8844a" stroke-width=".3" stroke-linejoin="round"')
    + C(-3, -2.8, 0.4, '#5a3a1e') + C(2, -3, 0.4, '#5a3a1e') + P('M-4.6 0 L-3 0 L-3.8 -0.6Z M1.4 0 L3 0 L2.2 -0.6Z M0 0 L1.2 0 L0.6 -0.5Z', '#5a3a1e')
    + P('M-1.6 -5 C-3.2 -6.4 -3.4 -9.4 -1.8 -10.8 C-0.4 -11.8 1.6 -11.4 2.4 -10 C2.8 -9 2.4 -8 1.6 -7.6 L0.4 -5Z', '#9a6a3a', 'stroke="#3a2412" stroke-width=".18"')
    + P('M-2.4 -6.4 C-3 -8 -2.6 -9.8 -1.4 -10.6 M-1.6 -5.8 C-2.2 -7.4 -2 -9 -1 -9.8 M-0.6 -5.4 C-1.2 -7 -1 -8.4 0 -9.2', 'none', 'stroke="#5a3a1e" stroke-width=".2"') + P('M-1.6 -10.8 C-0.4 -11.6 1.4 -11.2 2.2 -10.2', 'none', 'stroke="#d8a868" stroke-width=".25" opacity=".7"')
    + P('M0.6 -10.2 C1.6 -10.6 2.8 -10 3 -9.2 L1.6 -8.6Z', '#7a522c', 'stroke="#3a2412" stroke-width=".12"') + C(2.1, -9.5, 0.28, '#1a0e06') + C(1.4, -9.7, 0.22, '#1a0e06') + C(2.05, -9.6, 0.09, '#ff6a3a')
    + R(0.8, -8.4, 4.4, 0.55, '#5a3a1e') + R(0.8, -7.5, 4.4, 0.55, '#5a3a1e') + R(4.8, -8.5, 0.8, 0.35, '#2a1a0e') + R(4.8, -7.6, 0.8, 0.35, '#2a1a0e') + R(1, -8.7, 1.4, 1.8, '#7a522c', 'rx=".2"')
    + (shield ? E(0, -5.4, 6.4, 6.8, '#5ac8ff', 'opacity=".14" stroke="#aaeaff" stroke-width=".25"') + P('M-5.2 -9 Q0 -11.4 5.2 -9 M-6.2 -5 Q0 -7.4 6.2 -5 M-5.6 -1.4 Q0 -3.6 5.6 -1.4', 'none', 'stroke="#aaeaff" stroke-width=".12" opacity=".35"') + P('M-3.6 -10.4 C-2.4 -11.6 -1 -12 0.4 -12.1', 'none', 'stroke="#ffffff" stroke-width=".3" opacity=".45"') : ''));
  // A droideka rolled up into its wheel, bowling across the ground.
  const wheel = (x, y, r) => C(x, y - r, r, '#9a6a3a', 'stroke="#3a2412" stroke-width=".2"') + P(`M${x - r * 0.8} ${y - r * 1.5} Q${x} ${y - r * 0.6} ${x + r * 0.8} ${y - r * 1.5} M${x - r * 0.9} ${y - r * 0.6} Q${x} ${y - r * 1.4} ${x + r * 0.9} ${y - r * 0.6}`, 'none', 'stroke="#5a3a1e" stroke-width=".3"') + P(`M${x - r * 0.6} ${y - r * 1.7} Q${x} ${y - r * 2} ${x + r * 0.6} ${y - r * 1.7}`, 'none', 'stroke="#d8a868" stroke-width=".25" opacity=".7"') + E(x - r * 1.4, y - 0.2, r * 0.8, r * 0.2, '#c8946a', 'opacity=".5"');
  // An IG-100 MagnaGuard: the tall dark droid bodyguard with its cloth head
  // wrap and red eyes, the long cape, and an electrostaff crackling purple
  // at both ends. a sets the staff's angle.
  const magnaguard = (x, y, s, f = 1, a = -30) => g(x, y, s, f,
    E(0, 0.2, 3, 0.5, '#000', 'opacity=".25"')
    + P('M-2.4 -12 C-3.6 -8 -3.8 -4 -3.4 -1.6 L3 -1.6 C3.2 -4 2.8 -8 2 -12Z', '#3a2228', 'stroke="#1a0e10" stroke-width=".2"') + P('M-1.6 -11 L-2.6 -2 M0 -11 L-0.4 -2 M1.4 -11 L1.8 -2', 'none', 'stroke="#1a0e10" stroke-width=".2" opacity=".6"') + P('M-3.4 -1.6 L-3 -0.8 L-2.2 -1.6 L-1.4 -0.9 L-0.6 -1.6 L0.4 -0.9 L1.2 -1.6 L2.2 -0.9 L3 -1.6', 'none', 'stroke="#3a2228" stroke-width=".3"')
    + P('M-0.9 -6.4 L-1.2 -3.2 L-1.2 0 M0.9 -6.4 L1.2 -3.2 L1.4 0', 'none', 'stroke="#2a2a2e" stroke-width=".9" stroke-linejoin="round"') + L(-0.9, -6, -1.1, -3.6, '#5a5a62', 0.15) + L(0.9, -6, 1.1, -3.6, '#5a5a62', 0.15) + C(-1.2, -3.2, 0.45, '#4a4a52') + C(1.2, -3.2, 0.45, '#4a4a52') + P('M-2.2 0 L-0.4 0 L-1.2 -0.7Z M0.6 0 L2.4 0 L1.4 -0.7Z', '#2a2a2e')
    + R(-1.2, -7.2, 2.4, 1, '#3a3a40') + P('M-1.8 -11.6 L1.8 -11.6 L1.2 -7.2 L-1.2 -7.2Z', '#2a2a30', 'stroke="#0e0e10" stroke-width=".15"') + P('M-1.2 -10.8 L1.2 -10.8 M-1 -9.6 L1 -9.6 M-0.8 -8.4 L0.8 -8.4 M0 -11.4 L0 -7.4', 'none', 'stroke="#5a5a62" stroke-width=".15"')
    + E(-2, -11.4, 0.9, 0.6, '#3a3a40', 'stroke="#141416" stroke-width=".12"') + E(2, -11.4, 0.9, 0.6, '#3a3a40', 'stroke="#141416" stroke-width=".12"')
    + L(0, -11.6, 0, -12.6, '#2a2a2e', 0.5)
    + P('M-1.3 -12.4 C-1.6 -14.4 -0.8 -15.4 0.2 -15.4 C1.2 -15.4 1.8 -14.4 1.4 -12.4 C0.6 -12 -0.6 -12 -1.3 -12.4Z', '#2a1e1c', 'stroke="#0e0808" stroke-width=".15"') + P('M-1.2 -14.4 Q0 -14 1.4 -14.4 M-1.3 -13.4 Q0 -13 1.4 -13.4', 'none', 'stroke="#4a3430" stroke-width=".18"') + P('M-1.2 -12.6 L-2.2 -11 L-1.6 -10.6 L-0.8 -12.2Z', '#2a1e1c')
    + R(-0.4, -14.3, 1.6, 1.1, '#141416', 'rx=".2"') + C(0.1, -13.75, 0.22, '#ff3a2a') + C(0.8, -13.75, 0.22, '#ff3a2a') + C(0.45, -13.75, 0.9, '#ff3a2a', 'opacity=".15"')
    + `<g transform="rotate(${a} 1.4 -8.6)">${L(1.4, -0.6, 1.4, -17, '#4a4a52', 0.55)}${L(1.4, -0.6, 1.4, -17, '#8a8a92', 0.18)}${R(1, -1.6, 0.8, 1.4, '#2a2a2e')}${R(1, -16.8, 0.8, 1.4, '#2a2a2e')}${C(1.4, -17.4, 0.55, '#d8a8ff')}${C(1.4, -0.2, 0.55, '#d8a8ff')}${glow(1.4, -17.4, 0.7, '#b06aff', 0.4)}${glow(1.4, -0.2, 0.7, '#b06aff', 0.4)}${P('M1.4 -17.4 L0.4 -18.4 L1 -18.8 L0 -19.8 M1.4 -17.4 L2.4 -18 L2 -18.8 L3 -19.2 M1.4 -0.2 L0.4 0.6 L1 1 L0.2 1.8 M1.4 -0.2 L2.4 0.4 L2 1 L2.8 1.4', 'none', 'stroke="#e8c8ff" stroke-width=".18"')}</g>`
    + P('M1.4 -11 L2.2 -9.2 L1.6 -8.4', 'none', 'stroke="#3a3a40" stroke-width=".55" stroke-linejoin="round" stroke-linecap="round"') + C(1.5, -8.6, 0.4, '#2a2a2e') + P('M-1.6 -11 L-1.2 -8.8 L0.8 -8.6', 'none', 'stroke="#3a3a40" stroke-width=".55" stroke-linejoin="round" stroke-linecap="round"'));
  // General Grievous: bone-white armour over a hunched droid frame, the gut
  // sack, digitigrade clawed legs, the cape, the skull mask with its
  // yellow eyes, and four arms spread with four lit sabers.
  const saber4 = (px, py, a, c, len, w) => `<g transform="rotate(${a} ${px} ${py})">${L(px, py, px, py - len, c, w)}${L(px, py, px, py - len, '#ffffff', w * 0.32)}${R(px - 0.4, py - 0.4, 0.8, 1.8, '#9a9aa2')}</g>`;
  const grievous = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 3.6, 0.5, '#000', 'opacity=".25"')
    + P('M-2.6 -13.6 C-4.4 -9 -4.6 -4 -4 -1 L3.6 -1 C4 -4 3.6 -9 2.2 -13.6Z', '#4a4038', 'stroke="#1a1410" stroke-width=".2"') + P('M-2 -12 L-3.2 -1.4 M0 -12 L-0.4 -1.4 M1.6 -12 L2.2 -1.4', 'none', 'stroke="#2a2420" stroke-width=".2" opacity=".6"')
    + P('M-0.9 -7 L-1.8 -4.4 L-0.9 -2.4 L-1.4 0 M0.9 -7 L1.8 -4.4 L1 -2.4 L1.6 0', 'none', 'stroke="#3a342c" stroke-width="1" stroke-linejoin="round"') + P('M-0.9 -7 L-1.8 -4.4 L-0.9 -2.4 L-1.4 0 M0.9 -7 L1.8 -4.4 L1 -2.4 L1.6 0', 'none', 'stroke="#e8e0cc" stroke-width=".45" stroke-linejoin="round"') + C(-1.8, -4.4, 0.4, '#d8d0bc') + C(1.8, -4.4, 0.4, '#d8d0bc')
    + P('M-2.6 0 L-0.2 0 L-0.8 -0.6 L-1.8 -0.6Z M0.4 0 L2.8 0 L2.2 -0.6 L1 -0.6Z', '#d8d0bc', 'stroke="#3a342c" stroke-width=".12"') + P('M-2.6 0 L-3 0.3 M-1.6 0 L-1.8 0.3 M0.4 0 L0 0.3 M2.8 0 L3.2 0.3', 'none', 'stroke="#d8d0bc" stroke-width=".2"')
    + E(0, -7.2, 1.3, 0.7, '#3a342c')
    + E(0, -8.4, 1.3, 1, '#4a5244', 'stroke="#1a1a14" stroke-width=".15"') + P('M-0.8 -8.6 Q0 -8.2 0.8 -8.6 M-0.6 -8 Q0 -7.7 0.6 -8', 'none', 'stroke="#6a7460" stroke-width=".12"')
    + P('M-1.8 -13.2 L1.8 -13.2 L1.4 -9.4 L-1.4 -9.4Z', '#e8e0cc', 'stroke="#3a342c" stroke-width=".18"') + P('M-1.4 -12.4 L1.4 -12.4 M-1.3 -11.6 L1.3 -11.6 M-1.2 -10.8 L1.2 -10.8 M-1.1 -10.1 L1.1 -10.1 M0 -13.2 L0 -9.4', 'none', 'stroke="#8a8270" stroke-width=".15"')
    + E(-2, -12.8, 1, 0.7, '#e8e0cc', 'stroke="#3a342c" stroke-width=".15"') + E(2, -12.8, 1, 0.7, '#e8e0cc', 'stroke="#3a342c" stroke-width=".15"')
    + P('M-2.2 -12.4 L-4.2 -11 L-5.4 -12.6', 'none', 'stroke="#c8c0ac" stroke-width=".5" stroke-linejoin="round" stroke-linecap="round"') + saber4(-5.4, -12.6, -62, '#3aff5a', 8, 1)
    + P('M2.2 -12.4 L4.2 -11.2 L5.6 -12.8', 'none', 'stroke="#c8c0ac" stroke-width=".5" stroke-linejoin="round" stroke-linecap="round"') + saber4(5.6, -12.8, 58, '#3a8aff', 8, 1)
    + P('M-2.4 -12.6 L-3.6 -9.6 L-4.8 -8.2', 'none', 'stroke="#e8e0cc" stroke-width=".6" stroke-linejoin="round" stroke-linecap="round"') + saber4(-4.8, -8.2, -24, '#3a8aff', 9.4, 1.1)
    + P('M2.4 -12.6 L3.6 -9.6 L4.8 -8.4', 'none', 'stroke="#e8e0cc" stroke-width=".6" stroke-linejoin="round" stroke-linecap="round"') + saber4(4.8, -8.4, 20, '#3aff5a', 9.4, 1.1)
    + L(0, -13.2, 0.2, -14.2, '#3a342c', 0.7)
    + P('M-1.2 -14 C-1.6 -16 -1 -17.8 0.4 -18 C1.8 -18 2.2 -16.2 1.8 -14.6 C1.4 -13.6 0.8 -13.2 0.2 -13.2 C-0.4 -13.2 -1 -13.4 -1.2 -14Z', '#ece4d0', 'stroke="#3a342c" stroke-width=".18"')
    + P('M-0.6 -17.6 C-0.2 -18.2 1.2 -18.2 1.6 -17.4 L1.4 -16.6 L-0.4 -16.6Z', '#d8d0bc') + P('M-0.6 -16 C-0.4 -16.6 0.4 -16.6 0.4 -15.8 C0.2 -15.4 -0.4 -15.4 -0.6 -16Z M0.8 -15.8 C0.8 -16.6 1.6 -16.6 1.7 -16 C1.6 -15.4 1 -15.4 0.8 -15.8Z', '#2a241c') + E(-0.1, -15.95, 0.24, 0.2, '#e8d83a') + E(1.25, -15.95, 0.24, 0.2, '#e8d83a') + C(-0.1, -15.95, 0.08, '#1a1408') + C(1.25, -15.95, 0.08, '#1a1408')
    + P('M0.6 -15.4 L0.5 -14.4 M-0.2 -14.2 L1.4 -14.2 M0 -13.8 L0 -14.4 M0.4 -13.6 L0.4 -14.4 M0.8 -13.6 L0.8 -14.4 M1.2 -13.8 L1.2 -14.4', 'none', 'stroke="#5a5244" stroke-width=".12"'));
  // Padmé in the arena: white jumpsuit torn at the midriff, hair up in a
  // bun, blaster pistol raised.
  const padme = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 2.4, 0.4, '#000', 'opacity=".25"')
    + P('M-1.2 -6.6 L-1.4 -0.4 L-0.3 -0.4 L-0.1 -6.4Z M0.1 -6.4 L0.4 -0.4 L1.5 -0.4 L1.2 -6.6Z', '#f2f0ea', 'stroke="#8a8478" stroke-width=".14"') + P('M-0.8 -5 L-0.8 -1 M0.8 -5 L0.9 -1', 'none', 'stroke="#c8c4b8" stroke-width=".15"')
    + P('M-1.6 0 L-0.2 0 L-0.3 -0.8 L-1.4 -0.8Z M0.3 0 L1.8 0 L1.5 -0.8 L0.4 -0.8Z', '#e0dcd2', 'stroke="#8a8478" stroke-width=".1"')
    + R(-1.3, -7.2, 2.6, 0.8, '#d8d2c4') + R(-0.3, -7.1, 0.6, 0.6, '#a8a294')
    + P('M-1.2 -8.2 L1.2 -8.2 L1.3 -7.2 L-1.3 -7.2Z', '#e8c4a0') + P('M-0.4 -8 L0.2 -7.4 L-0.2 -7.3Z', '#c8584a', 'opacity=".6"')
    + P('M-1.5 -11 L1.5 -11 L1.3 -8.2 L0.6 -8.6 L0 -8.1 L-0.6 -8.5 L-1.3 -8.2Z', '#f6f4ee', 'stroke="#8a8478" stroke-width=".14"') + P('M-0.6 -10.8 L0 -10.2 L0.6 -10.8 M-1 -9.4 L-0.6 -9.2', 'none', 'stroke="#c8c4b8" stroke-width=".14"')
    + P('M-1.5 -10.8 L-2.2 -8.6 L-1.8 -7', 'none', 'stroke="#e8c4a0" stroke-width=".5" stroke-linejoin="round" stroke-linecap="round"') + P('M1.4 -10.6 L2.6 -9.6 L3.8 -10', 'none', 'stroke="#e8c4a0" stroke-width=".5" stroke-linejoin="round" stroke-linecap="round"')
    + R(3.2, -10.6, 2.2, 0.55, '#2a2a2e') + R(3.4, -10.2, 0.5, 0.9, '#2a2a2e') + R(4.8, -10.7, 0.5, 0.3, '#5a5a62')
    + L(0, -11, 0, -11.5, '#e8c4a0', 0.5)
    + E(-0.9, -12.6, 1, 1.1, '#3a2014')
    + C(0.1, -12.4, 1.2, '#e8c4a0', 'stroke="#8a5a3a" stroke-width=".12"') + P('M-1.1 -12.2 C-1.4 -13.8 0.2 -14.2 1.2 -13.2 C0.6 -13.4 -0.2 -13.2 -0.6 -12.6 L-0.9 -11.8Z', '#3a2014')
    + E(0.5, -12.5, 0.2, 0.14, '#f4f0e8') + C(0.55, -12.5, 0.1, '#2a1a10') + E(-0.3, -12.5, 0.2, 0.14, '#f4f0e8') + C(-0.25, -12.5, 0.1, '#2a1a10') + P('M-0.1 -11.6 Q0.2 -11.5 0.5 -11.6', 'none', 'stroke="#a8584a" stroke-width=".14"'));
  // The Jedi, drawn with the shared robed figure.
  const obiwan = (x, y, s, f = 1) => robed(x, y, s, f, { robe: '#7a5434', tunic: '#d8c8a8', skin: '#ecc8a8', hair: 'M-1.5 -12.2 C-1.7 -14.3 1.7 -14.3 1.5 -12.2 L1.3 -12.7 C0.5 -13.3 -0.5 -13.3 -1.3 -12.7Z', hairC: '#9a5a2e', beard: 'M-1.05 -11.5 C-0.9 -10.3 0.9 -10.3 1.05 -11.5 C0.6 -11 -0.6 -11 -1.05 -11.5Z', saber: '#3a8aff', fold: '#4a3220' });
  const anakin = (x, y, s, f = 1) => robed(x, y, s, f, { robe: '#3a2a1e', tunic: '#4a3624', skin: '#ecc4a0', hair: 'M-1.5 -12 C-1.8 -14.4 1.8 -14.4 1.5 -12 L1.5 -11.4 L1.2 -12.6 C0.4 -13.2 -0.4 -13.2 -1.2 -12.6 L-1.5 -11.4Z', hairC: '#7a5a30', saber: '#3a8aff', trim: '#2a1e14', fold: '#1a120c' });
  const dooku = (x, y, s, f = 1) => robed(x, y, s, f, { robe: '#2a1a14', tunic: '#3a2a20', skin: '#ecccb0', hair: 'M-1.4 -12.4 C-1.6 -13.9 1.6 -13.9 1.4 -12.4 L1.4 -11.6 L1.1 -12.6 C0.4 -13.1 -0.4 -13.1 -1.1 -12.6 L-1.4 -11.6Z', hairC: '#e8e8e8', beard: 'M-1 -11.4 C-0.9 -10.1 0.9 -10.1 1 -11.4 C0.6 -10.9 -0.6 -10.9 -1 -11.4Z', saber: '#ff2a1a', trim: '#8a7a6a', belt: '#1a1210', fold: '#120a08', ang: -32 });

  // ---------- Ships and machines ----------
  // A vulture droid in flight, seen from above: the long head and spine,
  // two pairs of wings and the blasters at the wingtips.
  const VGUNS = [[3.6, -7.75], [3.6, 7.75]];
  const vulture = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M-3 -1 L-1.6 -1.2 L-0.6 -7.6 L0.8 -8 L1.2 -7.6 L0.4 -1.2 L1.2 -1 L1.2 1 L0.4 1.2 L1.2 7.6 L0.8 8 L-0.6 7.6 L-1.6 1.2 L-3 1Z', '#a89878', 'stroke="#4a3e2c" stroke-width=".15"')
    + P('M-0.4 -2 L0 -7 M-0.4 2 L0 7', 'none', 'stroke="#6a5a44" stroke-width=".3"') + P('M-1 -3 L0.6 -3 M-1.2 -5 L0.4 -5 M-1 3 L0.6 3 M-1.2 5 L0.4 5', 'none', 'stroke="#4a3e2c" stroke-width=".15"') + P('M-1.4 -1.4 L-0.4 -7.2 M-1.4 1.4 L-0.4 7.2', 'none', 'stroke="#d8c8a8" stroke-width=".12" opacity=".6"')
    + R(0.6, -8, 3, 0.5, '#3a3228') + R(0.6, -6.9, 2.6, 0.45, '#3a3228') + R(0.6, 7.5, 3, 0.5, '#3a3228') + R(0.6, 6.45, 2.6, 0.45, '#3a3228')
    + P('M-4 -0.9 L2 -1 L5.4 -0.4 L6 0 L5.4 0.4 L2 1 L-4 0.9Z', '#c8b898', 'stroke="#4a3e2c" stroke-width=".15"')
    + P('M2.6 -0.7 L5 -0.3 M2.6 0.7 L5 0.3 M-3 0 L1.6 0', 'none', 'stroke="#6a5a44" stroke-width=".15"') + E(4.2, -0.35, 0.35, 0.18, '#ff5a2a') + E(4.2, 0.35, 0.35, 0.18, '#ff5a2a') + E(4.2, 0, 1, 0.6, '#ff5a2a', 'opacity=".15"')
    + R(-4.6, -0.8, 1, 1.6, '#4a3e2c') + E(-4.8, 0, 0.5, 0.7, '#ffb85a') + glow(-5, 0, 0.6, '#ff9a3a', 0.4), a);
  // A Delta-7 Jedi starfighter from above: the white wedge with its
  // coloured nose and wing panels, the cockpit set to one side, the
  // astromech socket in the wing, twin engines and cannons.
  const DGUNS = [[5.2, -2], [5.2, 2]];
  const delta7 = (x, y, s, a = 0, c = '#c83a2a', dome = '#c83a2a') => g(x, y, s, 1,
    P('M9 0 L-6 -5.6 L-5 0 L-6 5.6Z', '#e8e4dc', 'stroke="#6a6458" stroke-width=".18"')
    + P('M9 0 L2.4 -2.4 L3 0 L2.4 2.4Z', c, 'opacity=".92"') + P('M-6 -5.6 L-4.2 -4.9 L-4.6 4.9 L-6 5.6 L-5 0Z', c, 'opacity=".85"') + P('M-3 -4.5 L-2.4 -4.3 L-2.4 4.3 L-3 4.5Z', c, 'opacity=".7"')
    + P('M8 0 L-4 -4.4 M8 0 L-4 4.4 M0 -3 L0 3 M-1.6 -3.6 L-1.6 3.6', 'none', 'stroke="#a8a294" stroke-width=".12"')
    + P('M6 -0.9 L-3.6 -4.6 M6 0.9 L-3.6 4.6 M3.4 -1.6 L3.4 1.6 M-4 -3.4 L-1 -3.4 M-4 3.4 L-1 3.4', 'none', 'stroke="#8a8478" stroke-width=".1"') + R(-4.6, -1.2, 2.6, 2.4, '#c8c4bc', 'stroke="#6a6458" stroke-width=".1"') + R(-4.2, -0.8, 1.8, 0.4, '#5a5a62') + R(-4.2, 0.4, 1.8, 0.4, '#5a5a62') + P('M-6 -5.6 L-5 0 L-6 5.6', 'none', 'stroke="#4a463e" stroke-width=".35"')
    + E(1.2, 1.2, 1.5, 0.9, '#3a4a5a', 'stroke="#1a2228" stroke-width=".12"') + E(1.2, 1.2, 1.5, 0.9, 'none', 'stroke="#d8d4cc" stroke-width=".25"') + L(1.2, 0.3, 1.2, 2.1, '#d8d4cc', 0.15) + E(1.5, 1, 0.6, 0.3, '#aaccdd', 'opacity=".6"')
    + C(-1.4, -2.4, 0.8, dome, 'stroke="#3a3a40" stroke-width=".12"') + C(-1.4, -2.4, 0.35, '#e8e8ec') + C(-1.6, -2.6, 0.12, '#3a8aff')
    + R(-6.6, -2.4, 1.4, 1.4, '#3a3a40') + R(-6.6, 1, 1.4, 1.4, '#3a3a40') + E(-6.8, -1.7, 0.5, 0.6, '#9ad8ff') + E(-6.8, 1.7, 0.5, 0.6, '#9ad8ff') + glow(-7, -1.7, 0.6, '#5ab8ff', 0.4) + glow(-7, 1.7, 0.6, '#5ab8ff', 0.4)
    + L(2, -2, 5.2, -2, '#3a3a40', 0.4) + L(2, 2, 5.2, 2, '#3a3a40', 0.4), a);
  // The Lucrehulk droid control ship: the great ring with its gap and
  // docking claws, hangar lights along the inner rim, and the central
  // sphere with its reactor and antenna towers. Drawn in perspective.
  const arcD = (r, a0, a1) => { const p = (t) => `${(Math.cos((t * Math.PI) / 180) * r).toFixed(2)} ${(Math.sin((t * Math.PI) / 180) * r).toFixed(2)}`; return `M${p(a0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p(a1)}`; };
  const lucrehulk = (x, y, s) => {
    const band = (r, a0, a1, dy, c, w, extra = '') => `<g transform="translate(0 ${dy}) scale(1 0.3)">${P(arcD(r, a0, a1), 'none', `stroke="${c}" stroke-width="${w}" ${extra}`)}</g>`;
    const half = (a0, a1) => band(26, a0, a1, 2, '#3a3226', 9) + band(26, a0, a1, 0, '#a89a7c', 9) + band(26, a0, a1, 0, '#c8ba98', 1.6, 'stroke-dasharray="2.4 1.6" opacity=".55"') + band(30.4, a0, a1, 0, '#5a4e3c', 0.5) + band(21.6, a0, a1, 0, '#5a4e3c', 0.5) + band(28.4, a0, a1, 0, '#8a7c60', 0.4, 'stroke-dasharray="1 3"') + band(30.4, a0, a1, 2, '#2a241a', 0.6);
    const lights = Array.from({ length: 18 }, (_, k) => { const t = ((70 + k * 6) * Math.PI) / 180; return R((Math.cos(t) * 22.6).toFixed(2), (Math.sin(t) * 22.6 * 0.3 + 0.2).toFixed(2), 0.9, 0.4, '#ffe8a0', 'opacity=".85"'); }).join('');
    const claw = (t) => { const r = (t * Math.PI) / 180; const cx = (Math.cos(r) * 26).toFixed(2); const cy = (Math.sin(r) * 26 * 0.3).toFixed(2); return R(+cx - 2.4, +cy - 1.6, 4.8, 4.2, '#8a7c60', 'stroke="#3a3226" stroke-width=".2"') + R(+cx - 1.6, +cy - 0.6, 3.2, 0.6, '#ffd88a', 'opacity=".8"'); };
    const [gr, d] = RG([[0, '#d8ccb0'], [0.6, '#a89878'], [1, '#4a4030']], 0.35, 0.3, 0.75);
    return g(x, y, s, 1, d + half(180, 360) + C(0, -2.4, 8.4, gr, 'stroke="#3a3226" stroke-width=".25"') + [-5.6, -2.4, 0.8, 3.4].map((yy) => { const w = Math.sqrt(Math.max(0, 70 - (yy + 2.4) ** 2)); return P(`M${(-w).toFixed(2)} ${yy} Q0 ${(yy + 1.4).toFixed(2)} ${w.toFixed(2)} ${yy}`, 'none', 'stroke="#6a5e48" stroke-width=".3"'); }).join('') + R(-1.4, -12.6, 2.8, 2.6, '#8a7c60', 'stroke="#3a3226" stroke-width=".2"') + L(-0.6, -12.6, -0.6, -15, '#5a4e3c', 0.3) + L(0.8, -12.6, 0.8, -14, '#5a4e3c', 0.3) + C(-0.6, -15.2, 0.3, '#ff6a3a') + Array.from({ length: 7 }, (_, k) => C(-5.4 + k * 1.8, -0.9, 0.25, '#ffe8a0', 'opacity=".8"')).join('') + half(0, 35) + half(65, 180) + claw(35) + claw(65) + lights);
  };
  // A Republic Acclamator assault ship, side on: the long grey wedge with
  // its red nose band, bridge tower, turbolaser turrets and engines.
  const ACC_TOP = (tx) => 1 - 0.115 * (tx + 24);
  const ACC_T = [-6, -1, 4];
  const acclamator = (x, y, s, f = 1) => g(x, y, s, f,
    P('M-24 1 L16 -3.6 L22 -3.2 L23 1.6 L20 3.4 L-18 3.2Z', '#c8ccd2', 'stroke="#4a4e56" stroke-width=".2"')
    + P('M-18 3.2 L20 3.4 L23 1.6 L-24 1Z', '#8a9098') + P('M-24 1 L-14 -0.15 L-13 2.2 L-19 2.6Z', '#b03a2a') + P('M-12 -0.38 L-11 -0.5 L-10 2 L-11 2.1Z', '#b03a2a')
    + P('M-10 -0.6 L16 -3.6 L16 -2.6 L-10 0.4Z', '#a8aeb6') + Array.from({ length: 9 }, (_, k) => L(-12 + k * 3.4, +(ACC_TOP(-12 + k * 3.4) + 0.3).toFixed(2), -12 + k * 3.4, 2.6, '#6a7078', 0.12)).join('') + L(-22, 1.8, 22, 1.2, '#6a7078', 0.15)
    + P('M8 -2.6 L9 -6 L15 -6.4 L16 -3.6Z', '#b8bcc4', 'stroke="#4a4e56" stroke-width=".18"') + R(9.4, -7.4, 4.6, 1.4, '#a8aeb6', 'stroke="#4a4e56" stroke-width=".15"') + R(10, -7, 3.4, 0.4, '#3a4a5a') + L(12, -7.4, 12, -9, '#6a7078', 0.2) + L(13, -7.4, 13, -8.4, '#6a7078', 0.2)
    + ACC_T.map((tx) => { const yt = +ACC_TOP(tx).toFixed(2); return R(tx - 0.8, +(yt - 0.9).toFixed(2), 1.6, 0.9, '#6a7078', 'rx=".3"') + L(tx - 0.4, +(yt - 0.55).toFixed(2), tx - 2, +(yt - 0.7).toFixed(2), '#4a4e56', 0.25); }).join('')
    + [0.4, 2].map((ey) => E(23.2, ey, 0.6, 0.7, '#9ad8ff') + glow(23.4, ey, 0.7, '#5ab8ff', 0.35)).join('')
    + Array.from({ length: 8 }, (_, k) => R(-8 + k * 3.6, 2.6, 1.6, 0.4, '#ffe8a0', 'opacity=".6"')).join(''));
  // Where an Acclamator's turret barrels end, in the scene's coordinates.
  const accGuns = (x, y, s, f = 1) => ACC_T.map((tx) => [+(x + (tx - 2) * s * f).toFixed(2), +(y + (ACC_TOP(tx) - 0.7) * s).toFixed(2)]);
  // A Trade Federation core ship: the great sphere lifting off on its
  // thrusters, banded hull with rows of lights.
  const coreShip = (x, y, r) => {
    const [gr, d] = RG([[0, '#e0d4b8'], [0.6, '#a89878'], [1, '#4a4030']], 0.35, 0.3, 0.75);
    return d + glow(x, y + r * 1.05, r * 0.45, '#ffb85a', 0.4) + P(`M${x - r * 0.5} ${y + r * 0.86} L${x - r * 0.3} ${y + r * 1.4} L${x + r * 0.3} ${y + r * 1.4} L${x + r * 0.5} ${y + r * 0.86}Z`, '#ffd08a', 'opacity=".45"')
      + C(x, y, r, gr, 'stroke="#3a3226" stroke-width=".25"')
      + [-0.6, -0.3, 0.3, 0.6].map((k) => { const w = r * Math.sqrt(1 - k * k); return P(`M${(x - w).toFixed(2)} ${(y + r * k).toFixed(2)} Q${x} ${(y + r * k + w * 0.18).toFixed(2)} ${(x + w).toFixed(2)} ${(y + r * k).toFixed(2)}`, 'none', 'stroke="#5a4e3c" stroke-width=".3"'); }).join('')
      + P(`M${x - r} ${y} Q${x} ${y + r * 0.2} ${x + r} ${y} L${x + r} ${y + r * 0.1} Q${x} ${y + r * 0.3} ${x - r} ${y + r * 0.1}Z`, '#6a5e48')
      + Array.from({ length: 11 }, (_, k) => { const t = -0.8 + k * 0.16; return C((x + r * t).toFixed(2), (y + r * 0.12 + r * 0.16 * (1 - t * t)).toFixed(2), (r * 0.03).toFixed(2), '#ffe8a0', 'opacity=".85"'); }).join('')
      + E(x, y - r * 0.92, r * 0.28, r * 0.08, '#8a7c60') + R(x - r * 0.06, y - r * 1.12, r * 0.12, r * 0.2, '#6a5e48');
  };
  // A Republic AT-TE walker, side on: six legs, the armoured body with its
  // markings and viewports, and the mass-driver cannon on top.
  const ATTE_GUN = [9.2, -15.2];
  const atte = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 10, 0.8, '#000', 'opacity=".25"')
    + [-6.5, 0, 6.5].map((xb) => P(`M${xb + 1} -5 L${xb + 2.6} -8.2 L${xb + 3.6} 0`, 'none', 'stroke="#6a6e76" stroke-width=".9" stroke-linejoin="round"') + E(xb + 3.6, -0.3, 1, 0.45, '#6a6e76')).join('')
    + P('M-9 -9 L6 -9 L9.6 -7.6 L10.4 -5 L9 -3.6 L-9 -3.6 L-9.8 -6.4Z', '#c8ccd2', 'stroke="#4a4e56" stroke-width=".2"') + P('M-9 -9 L-1 -9 L-1 -3.6 L-9 -3.6 L-9.8 -6.4Z', '#b8bcc4') + L(-1, -9, -1, -3.6, '#4a4e56', 0.2)
    + P('M6 -9 L9.6 -7.6 L10.4 -5 L8 -5.4 L6.6 -7.8Z', '#9a2a1e', 'opacity=".9"') + P('M-9 -6.4 L-1 -6.4 L-1 -5.6 L-9 -5.6Z', '#9a2a1e', 'opacity=".85"') + R(7.6, -6.6, 1.8, 0.5, '#1a1e24') + R(7.2, -7.6, 1.4, 0.4, '#1a1e24')
    + [-7, -4.6, -2.2, 1, 3.4].map((px) => L(px, -8.8, px, -3.8, '#8a9098', 0.12)).join('') + L(-9.4, -4.6, 9.4, -4.6, '#8a9098', 0.12)
    + R(9.6, -4.6, 1.4, 0.4, '#3a3e46') + R(9.2, -3.9, 1.6, 0.4, '#3a3e46')
    + R(-2.4, -10.6, 4.8, 1.6, '#a8aeb6', 'stroke="#4a4e56" stroke-width=".15"') + P('M0.6 -10.2 L9.4 -15.6 L9.8 -14.9 L1.4 -9.6Z', '#8a9098', 'stroke="#4a4e56" stroke-width=".15"') + C(0.4, -10, 0.9, '#6a7078')
    + [-6.5, 0, 6.5].map((xb) => P(`M${xb} -4.6 L${xb + 1.8} -8.6 L${xb + 2.8} 0`, 'none', 'stroke="#9aa0a8" stroke-width="1" stroke-linejoin="round"') + C(xb + 1.8, -8.6, 0.55, '#6a7078') + E(xb + 2.8, -0.3, 1.1, 0.5, '#8a9098', 'stroke="#4a4e56" stroke-width=".12"')).join(''));
  // Count Dooku's solar sailer, side on: the bronze Geonosian hull with its
  // pierced patterning and forked prow, the sail furled on top.
  const sailer = (x, y, s) => g(x, y, s, 1,
    L(-10, 3, -11, 7.6, '#3a2a1a', 0.6) + L(8, 3, 9, 7.6, '#3a2a1a', 0.6) + E(-11, 7.6, 1, 0.3, '#2a1a10') + E(9, 7.6, 1, 0.3, '#2a1a10')
    + P('M-12 -4.8 C-9 -11 6 -11.4 10 -4.8Z', '#3a3438', 'stroke="#1a1418" stroke-width=".2"') + P('M-8 -5 C-6 -9 -2 -10.2 0 -10.2 M-3 -5 C-2 -8.6 1 -10 3 -10 M2 -5 C3 -8 5 -9 6 -8.8', 'none', 'stroke="#5a5058" stroke-width=".25"')
    + P('M-18 0 C-18 -3.6 -10 -5.4 0 -5.4 C8 -5.4 12 -4 14 -2.6 L20 -3.6 L21 -3 L15 -1.4 L15 0.4 L21 2 L20 2.6 L14 1.6 C12 3 8 4 0 4 C-10 4 -18 3.6 -18 0Z', '#a8743a', 'stroke="#3a2412" stroke-width=".25"')
    + P('M-16 -0.6 C-12 -3.4 -4 -4 4 -3.6 M-16 1.2 C-12 3 -4 3.2 6 2.8', 'none', 'stroke="#6a4220" stroke-width=".3"') + Array.from({ length: 9 }, (_, k) => E(-13 + k * 3, -0.2, 0.9, 1.4, '#5a3418', 'stroke="#d8a868" stroke-width=".15"')).join('') + P('M-17 -1.4 C-12 -4.8 4 -5.2 12 -3.2', 'none', 'stroke="#e8b878" stroke-width=".3" opacity=".7"')
    + P('M8 -3.6 C10 -3.8 12 -3 13 -2 L10 -1.6 C9 -2.2 8.4 -2.8 8 -3.6Z', '#2a3a4a', 'stroke="#1a1410" stroke-width=".15"') + P('M9 -3.2 L11 -2.4', 'none', 'stroke="#aaccdd" stroke-width=".2" opacity=".6"')
    + E(-18.4, 0, 0.8, 1.6, '#ffb85a', 'opacity=".5"'));

  // ---------- Places ----------
  // The Petranaki arena: the far curve of the stands packed with
  // Geonosians, support pillars, the Archduke's box, arched gates in the
  // wall and the sand floor.
  const qy = (x, yEnd, yMid) => { const t = x / 160; return +(yEnd - 4 * (yEnd - yMid) * t * (1 - t)).toFixed(2); };
  const arena = () => fill([[0, '#c8603a'], [0.12, '#e8904a'], [0.2, '#f0b070'], [1, '#c8804a']])
    + [[14, 3, 14], [34, 2.4, 10], [128, 3, 13], [150, 2.6, 11]].map(([x, w, h], k) => spire(x, 12, w, h, '#a85a34', '#6a3420', 0.3, k)).join('')
    + Array.from({ length: 7 }, (_, k) => { const y0 = 10 + k * 5.4; return P(`M0 ${y0 + 4} Q80 ${y0 - 4} 160 ${y0 + 4} L160 ${y0 + 9.6} Q80 ${y0 + 1.6} 0 ${y0 + 9.6}Z`, k % 2 ? '#7a3e22' : '#8a4a2a') + P(`M0 ${y0 + 4} Q80 ${y0 - 4} 160 ${y0 + 4}`, 'none', 'stroke="#b8704a" stroke-width=".3" opacity=".6"') + Array.from({ length: 40 }, (_, i) => { const x = i * 4 + (k % 2) * 2 + 1; const yy = qy(x, y0 + 4, y0) + 2.6; const c = ['#3a1a0e', '#5a2e18', '#4a2414', '#6a3a1e'][(i + k) % 4]; return E(x, yy, 0.7, 0.75, c) + E(x - 0.6, yy + 0.4, 0.35, 0.6, '#d8c8a8', 'opacity=".35"'); }).join(''); }).join('')
    + [18, 58, 102, 142].map((x) => { const top = qy(x, 14, 10) - 2; const bot = qy(x, 52, 46); return R(x - 1.6, top, 3.2, bot - top, '#6a3420', 'stroke="#3a1a0e" stroke-width=".2"') + Array.from({ length: 6 }, (_, k) => L(x - 1.6, top + 3 + k * 6, x + 1.6, top + 3 + k * 6, '#3a1a0e', 0.3)).join('') + E(x, top, 2.6, 1, '#8a4a2a', 'stroke="#3a1a0e" stroke-width=".2"'); }).join('')
    + P('M28 22 L52 21 L52 30 L28 31Z', '#5a2a16', 'stroke="#2a1008" stroke-width=".25"') + P('M26 22 Q40 15 54 21', '#7a3e22', 'stroke="#2a1008" stroke-width=".25"') + R(30, 24, 20, 4, '#2a1008') + [33, 37, 41, 45].map((x) => E(x, 25.6, 0.8, 1, '#8a5a2c')).join('')
    + P('M0 50 Q80 40 160 50 L160 60 Q80 52 0 60Z', '#6a3420', 'stroke="#3a1a0e" stroke-width=".3"') + P('M0 50 Q80 40 160 50', 'none', 'stroke="#b8704a" stroke-width=".4"')
    + Array.from({ length: 8 }, (_, k) => { const x = 10 + k * 20; const yb = qy(x, 60, 56); return P(`M${x - 3} ${yb} L${x - 3} ${yb - 4} Q${x} ${yb - 8} ${x + 3} ${yb - 4} L${x + 3} ${yb}Z`, '#2a1008') + P(`M${x - 3} ${yb - 4} Q${x} ${yb - 8} ${x + 3} ${yb - 4}`, 'none', 'stroke="#a8603a" stroke-width=".3"'); }).join('')
    + (() => { const [gr, d] = LG([[0, '#e0a46c'], [1, '#b8784a']]); return d + P('M0 60 Q80 52 160 60 L160 90 L0 90Z', gr); })()
    + P('M10 72 Q50 66 90 74 M60 84 Q100 78 150 82 M0 80 Q20 78 40 82', 'none', 'stroke="#a8683e" stroke-width=".5" opacity=".5"') + [[24, 76], [132, 70], [70, 66], [148, 86], [8, 86]].map(([x, y]) => E(x, y, 1.2, 0.6, '#8a5432') + E(x - 0.3, y - 0.2, 0.6, 0.25, '#f0c08a', 'opacity=".5"')).join('');
  // A Geonosian column: organic and ribbed, flaring at foot and crown.
  const gcol = (x, base, h, w, c = '#8a4428', dk = '#4a2010') => {
    const f = (v) => +v.toFixed(2);
    return P(`M${f(x - w)} ${base} C${f(x - w * 0.5)} ${base - 3} ${f(x - w * 0.4)} ${f(base - h * 0.2)} ${f(x - w * 0.4)} ${f(base - h * 0.5)} C${f(x - w * 0.4)} ${f(base - h * 0.8)} ${f(x - w * 0.6)} ${f(base - h * 0.92)} ${f(x - w * 1.1)} ${f(base - h)} L${f(x + w * 1.1)} ${f(base - h)} C${f(x + w * 0.6)} ${f(base - h * 0.92)} ${f(x + w * 0.4)} ${f(base - h * 0.8)} ${f(x + w * 0.4)} ${f(base - h * 0.5)} C${f(x + w * 0.4)} ${f(base - h * 0.2)} ${f(x + w * 0.5)} ${base - 3} ${f(x + w)} ${base}Z`, c, `stroke="${dk}" stroke-width=".3"`)
      + P(`M${f(x + w * 0.1)} ${f(base - h * 0.95)} C${f(x + w * 0.2)} ${f(base - h * 0.6)} ${f(x + w * 0.2)} ${f(base - h * 0.3)} ${f(x + w * 0.4)} ${base} L${f(x + w)} ${base} C${f(x + w * 0.5)} ${base - 3} ${f(x + w * 0.4)} ${f(base - h * 0.2)} ${f(x + w * 0.4)} ${f(base - h * 0.5)} C${f(x + w * 0.4)} ${f(base - h * 0.8)} ${f(x + w * 0.6)} ${f(base - h * 0.92)} ${f(x + w * 1.1)} ${f(base - h)}Z`, dk, 'opacity=".35"')
      + [0.18, 0.3, 0.42, 0.54, 0.66, 0.78].map((t) => E(x, f(base - h * t), f(w * 0.46), f(w * 0.12), 'none', `stroke="${dk}" stroke-width="${f(w * 0.06)}"`)).join('') + L(f(x - w * 0.2), f(base - h * 0.85), f(x - w * 0.22), f(base - h * 0.15), '#e8a070', f(w * 0.06), 'opacity=".4"');
  };
  // A smelting ladle on the overhead rail; poured molten metal runs from its
  // lip down to pourTo (in the ladle's own units below its hook).
  const ladle = (x, y, s, tilt, pourTo = 0) => {
    const r = (tilt * Math.PI) / 180; const lx = +(4 * Math.cos(r) + 2 * Math.sin(r)).toFixed(2); const ly = +(7 + 4 * Math.sin(r) - 2 * Math.cos(r)).toFixed(2);
    return g(x, y, s, 1, L(-3, 0, -2.4, 6, '#2a2a2e', 0.5) + L(3, 0, 2.4, 6, '#2a2a2e', 0.5) + R(-4, -1, 8, 1.4, '#3a3a40', 'stroke="#1a1a1e" stroke-width=".15"') + C(-2.6, -0.3, 0.6, '#5a5a62') + C(2.6, -0.3, 0.6, '#5a5a62')
      + `<g transform="rotate(${tilt} 0 7)">${P('M-4 5 L4 5 L3 11 L-3 11Z', '#3a3438', 'stroke="#1a1418" stroke-width=".25"')}${P('M-3.8 5.6 L3.8 5.6', 'none', 'stroke="#5a5058" stroke-width=".4"')}${E(0, 5, 4, 0.8, '#ff8a2a')}${E(0, 5, 3, 0.5, '#ffe08a')}${R(-3.4, 7.4, 6.8, 0.4, '#2a2428')}${R(-3.2, 9, 6.4, 0.4, '#2a2428')}${C(-4, 7, 0.6, '#5a5a62')}${C(4, 7, 0.6, '#5a5a62')}${glow(0, 5, 2.2, '#ff8a2a', 0.3)}</g>`
      + (pourTo ? P(`M${lx - 0.3} ${ly} C${lx + 1} ${ly + 0.6} ${lx + 1.2} ${ly + 2.4} ${lx + 0.9} ${ly + 4} L${lx + 0.7} ${pourTo} L${lx - 0.1} ${pourTo} L${lx + 0.1} ${ly + 4} C${lx + 0.3} ${ly + 2.4} ${lx} ${ly + 1} ${lx - 0.3} ${ly}Z`, '#ffb43a') + L(lx + 0.4, ly + 2, lx + 0.3, pourTo, '#fff0a0', 0.3) + glow(lx + 0.3, pourTo, 1.4, '#ffb43a', 0.5) + E(lx + 0.3, pourTo, 1.8, 0.5, '#fff0a0', 'opacity=".8"') : ''));
  };
  // A river of molten metal along a channel in the floor.
  const molten = (y, h) => { const [gr, d] = LG([[0, '#fff0a0'], [0.35, '#ffa03a'], [1, '#b8340a']]); return d + E(80, y + h / 2, 90, h * 2.2, '#ff7a2a', 'opacity=".14"') + R(0, y, 160, h, gr) + P(`M0 ${y + h * 0.4} Q20 ${y + h * 0.2} 40 ${y + h * 0.45} T80 ${y + h * 0.4} T120 ${y + h * 0.45} T160 ${y + h * 0.4}`, 'none', 'stroke="#fff8c8" stroke-width=".4" opacity=".7"') + Array.from({ length: 12 }, (_, k) => E(8 + k * 13, y + h * (0.55 + (k % 3) * 0.1), 2, 0.3, '#c8480e', 'opacity=".6"')).join('') + R(0, y - 1.2, 160, 1.2, '#2a1a14') + R(0, y + h, 160, 1.2, '#2a1a14') + L(0, y - 1.2, 160, y - 1.2, '#ff9a4a', 0.3, 'opacity=".6"'); };
  // An assembly arm: base, two jointed segments and a welding claw, sparks
  // flying where it works.
  const arm = (x, y, s, f = 1) => g(x, y, s, f,
    R(-3, -2, 6, 2, '#2a2a30', 'stroke="#141418" stroke-width=".15"') + C(0, -2.4, 1.6, '#3a3a42', 'stroke="#141418" stroke-width=".15"')
    + L(0, -2.4, 4, -12, '#4a4a52', 1.6) + L(0, -2.4, 4, -12, '#7a7a84', 0.4) + L(0.6, -4, 3, -10, '#1a1a1e', 0.2) + C(4, -12, 1.1, '#3a3a42', 'stroke="#141418" stroke-width=".15"')
    + L(4, -12, 11, -9, '#4a4a52', 1.2) + L(4, -12, 11, -9, '#7a7a84', 0.3) + C(11, -9, 0.8, '#3a3a42')
    + P('M11 -9 L13 -10.4 L13.6 -9.4 M11 -9 L13 -7.6 L13.6 -8.6', 'none', 'stroke="#5a5a62" stroke-width=".45" stroke-linejoin="round"')
    + C(13.4, -9, 0.4, '#ffe08a') + glow(13.4, -9, 0.6, '#ffd05a', 0.5) + P('M13.4 -9 L15 -10.6 M13.4 -9 L15.4 -8.6 M13.4 -9 L14.6 -7.2 M13.4 -9 L14 -11.2 M13.4 -9 L15.8 -9.8', 'none', 'stroke="#ffe08a" stroke-width=".15"'));
  // A half-built B1 on the line: torso and head, no limbs yet.
  const b1part = (x, y, s, f = 1) => g(x, y, s, f, P('M-1.4 -2.8 L1.4 -2.6 L1 0 L-0.9 0.2Z', '#c8b48a', 'stroke="#6a5a3e" stroke-width=".14"') + L(-0.1, -2.7, 0.4, -3.6, '#8a7a5a', 0.35) + P('M-0.4 -3.4 C-0.8 -4.4 -0.4 -5.4 0.4 -5.4 L2.6 -4.6 L2.8 -4.1 L0.4 -3.3Z', '#c8b48a', 'stroke="#6a5a3e" stroke-width=".14"') + C(0.2, -4.5, 0.35, '#2a2418'));
  // A conveyor belt: slatted top, the frame and its rollers.
  const belt = (x1, x2, y, d) => R(x1, y, x2 - x1, d, '#2a2a30', 'stroke="#141418" stroke-width=".2"') + Array.from({ length: Math.round((x2 - x1) / 2.4) }, (_, k) => L(x1 + 1 + k * 2.4, y + 0.2, x1 + 1 + k * 2.4, y + d - 0.2, '#3e3e46', 0.3)).join('') + R(x1, y + d, x2 - x1, 2.6, '#1a1a1e') + Array.from({ length: Math.round((x2 - x1) / 6) }, (_, k) => C(x1 + 3 + k * 6, y + d + 1.3, 1, '#3a3a42', 'stroke="#141418" stroke-width=".15"') + C(x1 + 3 + k * 6, y + d + 1.3, 0.3, '#7a7a84')).join('') + L(x1, y, x2, y, '#7a7a84', 0.3);
  // A stamping press: frame, pistons and the glowing heated die.
  const press = (x, top, bot, w) => R(x - w / 2 - 2, top, 2, bot - top + 2, '#3a3a42', 'stroke="#141418" stroke-width=".15"') + R(x + w / 2, top, 2, bot - top + 2, '#3a3a42', 'stroke="#141418" stroke-width=".15"') + R(x - w / 2 - 3, top - 3, w + 6, 4, '#2a2a30', 'stroke="#141418" stroke-width=".2"')
    + L(x - w / 4, top + 1, x - w / 4, bot - 6, '#9a9aa2', 1) + L(x + w / 4, top + 1, x + w / 4, bot - 6, '#9a9aa2', 1) + L(x - w / 4 - 0.3, top + 1, x - w / 4 - 0.3, bot - 6, '#ffffff', 0.2, 'opacity=".4"')
    + R(x - w / 2, bot - 6, w, 5, '#3a3a42', 'stroke="#141418" stroke-width=".2"') + Array.from({ length: Math.floor(w / 2) }, (_, k) => R(x - w / 2 + k * 2, bot - 6, 1, 1, k % 2 ? '#1a1a1e' : '#e8b83a')).join('')
    + R(x - w / 2 + 0.6, bot - 1.4, w - 1.2, 0.8, '#ff8a2a') + glow(x, bot - 1, w / 4, '#ff8a2a', 0.25);
  // A cog in the machinery behind.
  const gear = (x, y, r, c = '#2a2a30') => C(x, y, r, 'none', `stroke="${c}" stroke-width="${(r * 0.3).toFixed(2)}" stroke-dasharray="${(r * 0.35).toFixed(2)} ${(r * 0.3).toFixed(2)}"`) + C(x, y, r * 0.82, c) + C(x, y, r * 0.3, '#4a4a52') + [0, 60, 120].map((a) => L(x, y, x + Math.cos((a * Math.PI) / 180) * r * 0.7, y + Math.sin((a * Math.PI) / 180) * r * 0.7, '#3a3a42', r * 0.12)).join('');
  const sparks = (x, y, n = 6) => Array.from({ length: n }, (_, k) => { const a = (-150 + k * (120 / n)) * Math.PI / 180; const l = 1.4 + (k % 3); return L(x, y, +(x + Math.cos(a) * l).toFixed(2), +(y + Math.sin(a) * l).toFixed(2), '#ffe08a', 0.18); }).join('') + glow(x, y, 0.5, '#ffd05a', 0.5);

  // ---------- The ten scenes ----------
  const GE = {
    // 1 · Orbital Defense (fleet): high over Geonosis. The rust-red planet and
    // its asteroid ring below; the Lucrehulk droid control ship with its
    // ring, docking claws and hangar lights launching a swarm of vulture
    // droids; the nearest vultures dive at a Republic Acclamator, every
    // shot running straight from their wingtip guns, and the Acclamator's
    // turrets fire back.
    orbital_defense: () => {
      const vs = [[56, 50, 1.15, 8], [82, 60, 1.3, 4], [42, 68, 0.95, 6], [96, 46, 0.85, 12], [70, 36, 0.7, 14]];
      const ag = accGuns(136, 66, 0.95, 1);
      return fill([[0, '#04030a'], [0.6, '#0e0810'], [1, '#2a1210']]) + starfield(60, 3)
        + `<g transform="rotate(-12 34 100)">${ring(34, 100, 80, 13, 80, 1, 1)}</g>` + planet(34, 100, 44, 'o') + `<g transform="rotate(-12 34 100)">${ring(34, 100, 80, 13, 80, 1, 2)}</g>`
        + lucrehulk(110, 24, 1.15)
        + [[80, 32], [88, 38], [98, 35], [106, 41], [74, 41], [90, 45], [114, 38]].map(([x, y], k) => vulture(x, y, 0.32, 14 + k * 3)).join('')
        + acclamator(136, 66, 0.95, 1)
        + vs.map(([x, y, s, a]) => vulture(x, y, s, a)).join('')
        + vs.slice(0, 4).map(([x, y, s, a]) => gunsAt(x, y, s, a, VGUNS).map((p) => shots(p, fwd(p, a, 36), [0.18, 0.52], 0.16, RED)).join('')).join('')
        + shots(ag[0], [vs[1][0] + 4, vs[1][1] - 2], [0.2, 0.55], 0.14, GRN) + shots(ag[1], [vs[1][0] + 4, vs[1][1] - 2], [0.3, 0.65], 0.14, GRN) + shots(ag[2], [vs[3][0] + 3, vs[3][1]], [0.25, 0.6], 0.14, GRN)
        + glow(119, 64, 1, '#ffb85a', 0.6) + C(119, 64, 0.8, '#fff0c0');
    },

    // 2 · Hive Spires: the Geonosian badlands at sunset. The great hive
    // spires rise in ranks, ringed with ridges and lit doorways; buttes and
    // more spires fade into the dust; the planet's ring arcs across the
    // sky past two moons. Geonosians fly between the towers, and three
    // warriors with sonic blasters hold the rock ledge.
    hive_spires: () => fill(SKY) + glow(118, 50, 10, '#ffd08a', 0.35) + C(118, 50, 5, '#ffe0a0', 'opacity=".9"')
      + C(30, 14, 3.2, '#d8a888', 'opacity=".75"') + C(31, 13.4, 2.8, '#b88a70', 'opacity=".5"') + C(46, 9, 1.4, '#c89880', 'opacity=".7"')
      + `<g transform="rotate(-8 80 30)">${E(80, 30, 110, 6, 'none', 'stroke="#f0c090" stroke-width="1.8" opacity=".18"')}${E(80, 30, 110, 6, 'none', 'stroke="#f8d8b0" stroke-width=".5" opacity=".35" stroke-dasharray=".6 1.2"')}</g>`
      + mesas(62, '#b0603e', 0.55, 1)
      + [[8, 3, 22], [26, 2.2, 14], [62, 3, 26], [90, 2.6, 20], [150, 3.4, 30], [122, 2.2, 15]].map(([x, w, h], k) => spire(x, 63, w, h, '#b8704a', '#8a4a30', 0.25, k)).join('')
      + R(0, 58, 160, 8, '#d88050', 'opacity=".3"')
      + mesas(68, '#8a4428', 0.85, 4)
      + spire(46, 70, 6, 38, '#a05430', '#5a2a16', 0.4, 2) + spire(108, 70, 7, 44, '#a05430', '#5a2a16', 0.4, 3) + spire(78, 68, 4.4, 30, '#a05430', '#5a2a16', 0.5, 6)
      + spire(18, 76, 11, 66, '#94482a', '#4a2010', 0.45, 5) + spire(142, 78, 13, 72, '#94482a', '#4a2010', 0.45, 7)
      + [[60, 22, 0.9, 1], [86, 14, 0.65, -1], [96, 32, 0.8, 1], [34, 40, 0.6, -1], [124, 26, 0.55, 1], [68, 44, 0.5, 1], [114, 12, 0.45, -1]].map(([x, y, s, f]) => geonosian(x, y, s, f, true)).join('')
      + P('M0 72 C30 70 60 74 90 72 C120 70 140 73 160 72 L160 90 L0 90Z', '#7a3a20') + P('M0 72 C30 70 60 74 90 72 C120 70 140 73 160 72', 'none', 'stroke="#c8784a" stroke-width=".5"')
      + P('M12 76 L22 80 L20 86 M64 76 L70 82 L84 84 M120 78 L112 84 L118 90 M142 80 L150 86', 'none', 'stroke="#4a2010" stroke-width=".4"')
      + [[8, 80, 3], [30, 88, 2.2], [132, 86, 2.6], [152, 78, 1.8], [96, 89, 1.6]].map(([x, y, r]) => E(x, y, r * 1.4, r, '#6a3018', 'stroke="#3a1a0e" stroke-width=".2"') + E(x - r * 0.3, y - r * 0.4, r * 0.7, r * 0.3, '#c8784a', 'opacity=".45"')).join('')
      + geonosian(52, 86, 2.5, 1) + geonosian(80, 88, 2.8, 1) + geonosian(110, 86, 2.5, -1)
      + R(0, 84, 160, 6, '#c87048', 'opacity=".15"'),

    // 3 · Droid Foundry: deep in the foundry. Pointed Geonosian arches carved
    // into the rock with the glow of the works behind; smelting ladles on
    // the overhead rail pouring molten metal into the glowing channel;
    // finished battle droids marching out along the far ledge; assembly arms
    // welding new droids in showers of sparks; on the catwalk, battle
    // droids, a super battle droid and a Geonosian overseer.
    droid_foundry: () => fill([[0, '#140806'], [0.6, '#3a1408'], [1, '#6a2a0e']])
      + R(0, 0, 160, 60, '#2a1008')
      + Array.from({ length: 5 }, (_, k) => { const x0 = 6 + k * 31; return P(`M${x0} 58 L${x0} 28 Q${x0 + 12.5} 8 ${x0 + 25} 28 L${x0 + 25} 58Z`, '#5a1e0a') + P(`M${x0 + 3} 58 L${x0 + 3} 30 Q${x0 + 12.5} 14 ${x0 + 22} 30 L${x0 + 22} 58Z`, '#8a3410', 'opacity=".55"') + glow(x0 + 12.5, 50, 5, '#ff7a2a', 0.18) + R(x0 + 6, 34, 2, 22, '#2a1008', 'opacity=".7"') + R(x0 + 17, 38, 2, 18, '#2a1008', 'opacity=".7"') + Array.from({ length: 3 }, (_, m) => b1part(x0 + 8 + m * 4, 46 - m * 0.4, 0.9, 1)).join('') + P(`M${x0} 28 Q${x0 + 12.5} 8 ${x0 + 25} 28`, 'none', 'stroke="#a8502a" stroke-width=".5"'); }).join('')
      + Array.from({ length: 6 }, (_, k) => gcol(4 + k * 31, 60, 50, 3, '#4a1c0c', '#1a0804')).join('')
      + R(0, 3, 160, 2.4, '#1a1a1e') + L(0, 3, 160, 3, '#4a4a52', 0.3) + Array.from({ length: 9 }, (_, k) => R(k * 20, 0, 1.4, 3.4, '#2a2a30')).join('')
      + ladle(30, 5, 1.6, 38, 36) + ladle(126, 5, 1.4, -34, 41) + ladle(80, 5, 1.1, 0)
      + Array.from({ length: 10 }, (_, k) => b1(8 + k * 15, 61, 0.85, 1)).join('')
      + molten(62, 6)
      + R(0, 69, 160, 21, '#2a201c') + Array.from({ length: 16 }, (_, k) => L(k * 10, 69, k * 10 - 4, 90, '#1a1410', 0.3)).join('') + Array.from({ length: 4 }, (_, k) => L(0, 73 + k * 4.4, 160, 73 + k * 4.4, '#1a1410', 0.3)).join('')
      + L(0, 70, 160, 70, '#5a5058', 0.6) + Array.from({ length: 11 }, (_, k) => L(k * 16, 70, k * 16, 66, '#4a4048', 0.4)).join('') + L(0, 66, 160, 66, '#6a6068', 0.35)
      + arm(10, 78, 1.4, 1) + b1part(31, 66, 1.4, -1) + sparks(29, 66.4) + arm(150, 78, 1.4, -1) + b1part(129, 66, 1.4, 1) + sparks(131, 66.4)
      + b1(50, 86, 2.3, 1) + b2(76, 88, 2.4, 1) + b1(100, 86, 2.3, -1, '#d8a83a') + geonosian(126, 87, 2.4, -1),

    // 4 · Conveyor Belts: the droid assembly line. Gears and pipes in the
    // dark behind; droid frames hanging from the overhead track; stamping
    // presses slamming down on the back belt loaded with droid parts; the
    // glow of molten metal underneath; super battle droids and a deployed
    // droideka riding the main belt through the sparks.
    conveyor_belts: () => fill([[0, '#120a08'], [0.5, '#2a140c'], [1, '#4a1e0c']])
      + gear(20, 22, 10) + gear(36, 34, 6) + gear(140, 20, 12) + gear(118, 34, 5) + gear(80, 14, 7)
      + [[0, 30, 160, 30], [0, 36, 60, 36], [100, 26, 160, 26]].map(([x1, y1, x2, y2]) => L(x1, y1, x2, y2, '#3a2a24', 1.6) + L(x1, y1 - 0.4, x2, y2 - 0.4, '#6a4a3a', 0.3)).join('') + [24, 52, 112, 140].map((x) => R(x - 1, 28.6, 2, 3, '#4a3a32')).join('')
      + R(0, 6, 160, 2, '#1a1a1e') + L(0, 6, 160, 6, '#4a4a52', 0.3)
      + [14, 46, 98, 130].map((x) => L(x, 8, x, 13, '#4a4a52', 0.3) + P(`M${x - 0.6} 13 Q${x} 14.4 ${x + 0.6} 13`, 'none', 'stroke="#6a6a74" stroke-width=".3"') + `<g opacity=".85">${b1(x, 28.6, 1, 1)}</g>`).join('')
      + press(42, 12, 44, 16) + press(118, 12, 44, 14)
      + belt(0, 160, 44, 3)
      + [[8, 'p'], [20, 'h'], [30, 'p'], [56, 'h'], [66, 'p'], [78, 'p'], [92, 'h'], [104, 'p'], [134, 'p'], [146, 'h']].map(([x, t]) => t === 'p' ? b1part(x, 44, 1.2, 1) : R(x - 1.6, 42.4, 3.2, 1.6, '#4a5262', 'rx=".4"') + R(x + 1.6, 42.8, 1.2, 0.5, '#1a1a1e')).join('')
      + sparks(42, 44, 8) + sparks(118, 44, 8)
      + R(0, 49.6, 160, 22, '#140a08') + E(80, 64, 70, 6, '#ff7a2a', 'opacity=".25"') + Array.from({ length: 7 }, (_, k) => E(12 + k * 23, 62 + (k % 2) * 2, 6, 1.2, '#ffa03a', 'opacity=".5"')).join('') + Array.from({ length: 8 }, (_, k) => R(4 + k * 20, 50, 2.4, 22, '#2a2a30')).join('')
      + belt(0, 160, 72, 5)
      + [[18, 'h'], [140, 'p']].map(([x, t]) => t === 'p' ? b1part(x, 73, 1.6, -1) : R(x - 2.4, 71, 4.8, 2, '#4a5262', 'rx=".5"')).join('')
      + b2(48, 74, 2.3, 1) + droideka(82, 74, 2.3, -1) + b2(116, 74, 2.3, -1)
      + R(0, 80, 160, 10, '#1a1210') + Array.from({ length: 20 }, (_, k) => R(k * 8, 80, 4, 1.4, k % 2 ? '#1a1a1e' : '#c8982a')).join('') + L(0, 84, 160, 84, '#3a3a42', 1.2) + L(0, 87, 160, 87, '#3a2a24', 1.4),

    // 5 · Jedi Starfighters (fleet): in the asteroid ring above Geonosis.
    // Obi-Wan's red Delta-7 and Anakin's yellow one weave between tumbling
    // rocks after a fleeing vulture droid, guns blazing straight ahead;
    // another vulture comes head-on firing back; a seismic charge rings out
    // blue among the rocks behind them.
    jedi_starfighters: () => {
      const ob = [70, 50, 1.25, -22]; const an = [46, 66, 1.1, -22]; const v1 = [114, 30, 1.1, -22]; const v2 = [134, 62, 1, 176];
      return fill([[0, '#05030a'], [0.7, '#120a10'], [1, '#2a1410']]) + starfield(60, 7) + planet(132, 132, 66, 'j')
        + Array.from({ length: 70 }, (_, k) => { const x = ((k * 29) % 172) - 6; const y = 8 + x * 0.42 + (((k * 17) % 26) - 13); return E(x, y.toFixed(2), (0.4 + (k % 4) * 0.25).toFixed(2), (0.3 + (k % 4) * 0.18).toFixed(2), k % 3 ? '#5a3220' : '#7a4a2e', 'opacity=".8"'); }).join('')
        + glow(34, 34, 3, '#7ae8ff', 0.4) + [3, 5.4, 8].map((r, k) => E(34, 34, r, r * 0.5, 'none', `stroke="#aaf0ff" stroke-width="${0.8 - k * 0.2}" opacity="${0.9 - k * 0.25}"`)).join('') + C(34, 34, 1.4, '#ffffff') + [[28, 30], [41, 31], [38, 39], [27, 38]].map(([x, y], k) => rock(x, y, 0.6, k * 40)).join('')
        + rock(98, 54, 4, 20) + rock(20, 54, 3, -30) + rock(150, 40, 5, 60) + rock(88, 18, 2.2, 10) + rock(124, 82, 3.4, -20)
        + vulture(v1[0], v1[1], v1[2], v1[3]) + vulture(v2[0], v2[1], v2[2], v2[3])
        + delta7(ob[0], ob[1], ob[2], ob[3], '#c83a2a', '#c83a2a') + delta7(an[0], an[1], an[2], an[3], '#e8b83a', '#3a6ad8')
        + [ob, an].map(([x, y, s, a]) => gunsAt(x, y, s, a, DGUNS).map((p) => shots(p, fwd(p, a, 44), [0.15, 0.5], 0.14, GRN)).join('')).join('')
        + gunsAt(v2[0], v2[1], v2[2], v2[3], VGUNS).map((p) => shots(p, fwd(p, v2[3], 60), [0.2, 0.55], 0.12, RED)).join('')
        + rock(6, 82, 7, 30) + rock(156, 8, 6, -10);
    },

    // 6 · The Strike Team: the Petranaki arena. The stands packed with
    // Geonosians under the hot sky, the Archduke's box, the three execution
    // pillars with their chains; droidekas bowl in and battle droids pour
    // from the gates; Obi-Wan and Anakin stand with sabers lit, Padmé
    // between them with her blaster.
    the_strike_team: () => arena()
      + [64, 80, 96].map((x) => R(x - 1.6, 30, 3.2, 28, '#7a4428', 'stroke="#3a1a0e" stroke-width=".25"') + E(x, 30, 2.6, 1.2, '#9a5a34', 'stroke="#3a1a0e" stroke-width=".25"') + E(x, 34, 2, 0.6, '#5a2a16') + Array.from({ length: 4 }, (_, k) => L(x - 1.6, 38 + k * 5, x + 1.6, 38 + k * 5, '#4a2010', 0.3)).join('') + P(`M${x + 1.6} 36 Q${x + 3} 40 ${x + 2.4} 44 M${x - 1.6} 36 Q${x - 3} 40 ${x - 2.4} 44`, 'none', 'stroke="#4a4a52" stroke-width=".35" stroke-dasharray=".5 .3"') + R(x + 1.8, 44, 1.2, 0.8, '#4a4a52') + R(x - 3, 44, 1.2, 0.8, '#4a4a52') + E(x, 58, 3.4, 0.8, '#000', 'opacity=".2"')).join('')
      + wheel(30, 64, 2) + wheel(132, 66, 2.2) + b1(16, 63, 0.9, 1) + b1(22, 63.4, 0.9, 1) + b1(140, 63, 0.9, -1) + b1(146, 63.4, 0.9, -1)
      + padme(80, 82, 2.9, 1) + obiwan(52, 86, 3.1, 1) + anakin(108, 86, 3.1, -1),

    // 7 · Droideka Wall: the arena battle. Smoke rolls across the stands; a
    // line of droidekas with their shields up holds the sand, a super
    // battle droid and a Geonosian warrior with them, and every bolt from
    // their twin blasters flies at the Jedi fighting on the far side.
    droideka_wall: () => {
      const front = [[68, 84, 2.6], [100, 80, 2.3]];
      const jedi = [[14, 70], [26, 72]];
      return arena() + smoke(36, 46, 30, 0.35, '#5a4034', '#8a6a58') + smoke(118, 48, 26, 0.3, '#5a4034', '#8a6a58')
        + robed(jedi[0][0], jedi[0][1], 1.2, 1, { robe: '#6a4a2e', tunic: '#c8b490', skin: '#e0b898', saber: '#3aff5a', hood: true }) + robed(jedi[1][0], jedi[1][1], 1.2, 1, { robe: '#8a6a4a', tunic: '#d8c8a8', skin: '#8a5a3a', saber: '#3a8aff', ang: 20 })
        + [[44, 68], [54, 66.5], [64, 65.5], [74, 65], [84, 65.5]].map(([x, y]) => droideka(x, y, 1.15, -1)).join('') + b1(94, 65.6, 1, -1) + b1(100, 66, 1, -1)
        + front.map(([x, y, s]) => droideka(x, y, s, -1)).join('') + b2(124, 84, 2.6, -1) + geonosian(146, 86, 2.4, -1)
        + front.map(([x, y, s], k) => [[5.6, -8.2], [5.6, -7.3]].map(([lx, ly]) => shots([x - lx * s, y + ly * s], [jedi[k][0] + 3, jedi[k][1] - 12], [0.2, 0.55], 0.12, RED)).join('')).join('')
        + glow(17, 58, 0.8, '#3aff5a', 0.5) + glow(29.6, 59.6, 0.8, '#3a8aff', 0.5)
        + sonic(146 - 5.1 * 2.4, 86 - 8.85 * 2.4, 34, 60);
    },

    // 8 · MagnaGuard Hall: a great hall in the Geonosian citadel. Organic
    // ribbed columns march away in the warm gloom, tall pointed windows
    // glow with the sunset and the spires beyond, light falls in shafts
    // across the patterned floor, and MagnaGuards guard the far door;
    // General Grievous stands with all four sabers lit between two
    // MagnaGuards with their electrostaffs crackling.
    magnaguard_hall: () => fill([[0, '#1a0a06'], [0.5, '#3a1a0c'], [1, '#2a1208']])
      + [[44, 16], [80, 14], [116, 16]].map(([x, top]) => P(`M${x - 7} 58 L${x - 7} ${top + 12} Q${x} ${top - 4} ${x + 7} ${top + 12} L${x + 7} 58Z`, '#e8904a') + spire(x - 3, 58, 2.4, 22, '#a85a34', '#6a3420', 0.4, x) + spire(x + 4, 58, 1.8, 15, '#a85a34', '#6a3420', 0.4, x + 1) + R(x - 7, 54, 14, 4, '#8a4428') + P(`M${x - 7} 58 L${x - 7} ${top + 12} Q${x} ${top - 4} ${x + 7} ${top + 12} L${x + 7} 58`, 'none', 'stroke="#4a2010" stroke-width="1.4"') + L(x, top + 2, x, 58, '#4a2010', 0.6) + L(x - 7, 40, x + 7, 40, '#4a2010', 0.5) + P(`M${x - 7} 58 L${x - 22} 90 L${x + 6} 90 L${x + 7} 58Z`, '#ffb070', 'opacity=".08"')).join('')
      + Array.from({ length: 5 }, (_, k) => P(`M${k * 40} 0 Q${80} ${18} ${160 - k * 40} 0`, 'none', 'stroke="#4a2010" stroke-width="1.2" opacity=".7"')).join('') + P('M0 6 Q80 22 160 6', 'none', 'stroke="#6a3018" stroke-width=".8"')
      + P('M73 60 L73 46 Q80 38 87 46 L87 60Z', '#ff9a4a', 'opacity=".75"') + P('M73 60 L73 46 Q80 38 87 46 L87 60', 'none', 'stroke="#4a2010" stroke-width=".8"') + magnaguard(76, 60, 1.1, 1, -4) + magnaguard(84, 60, 1.1, -1, -4)
      + (() => { const [gr, d] = LG([[0, '#5a2a14'], [1, '#2a1208']]); return d + R(0, 58, 160, 32, gr); })() + Array.from({ length: 9 }, (_, k) => L(80, 58, -40 + k * 30, 90, '#1a0804', 0.3)).join('') + [6, 12, 20].map((r) => E(80, 76, r * 2.4, r * 0.5, 'none', 'stroke="#8a4428" stroke-width=".4" opacity=".6"')).join('') + L(0, 58, 160, 58, '#6a3018', 0.5)
      + gcol(58, 64, 44, 2.2) + gcol(102, 64, 44, 2.2) + gcol(34, 72, 62, 3.4) + gcol(126, 72, 62, 3.4) + gcol(8, 84, 84, 5) + gcol(152, 84, 84, 5)
      + [[34, 22], [126, 22]].map(([x, y]) => L(x, 0, x, y - 2, '#2a1a10', 0.3) + E(x, y, 1.6, 2, '#5a3018', 'stroke="#2a1008" stroke-width=".2"') + glow(x, y + 1, 1.4, '#ffb85a', 0.4) + C(x, y + 1, 0.8, '#ffe0a0')).join('')
      + magnaguard(44, 86, 3, 1, -34) + grievous(80, 86, 3.1) + magnaguard(116, 86, 3, -1, -34),

    // 9 · Battle of Geonosis (fleet): the Clone Wars begin on the plains.
    // Acclamators hang in the dusty sky; a Trade Federation core ship
    // lifts off on its thrusters with more beyond; Republic gunships sweep
    // in while vulture droids dive at them, a Jedi starfighter on one
    // vulture's tail; AT-TEs stride across the plain firing their mass
    // drivers, clone troopers advancing, explosions and smoke all around.
    battle_of_geonosis: () => {
      const v1 = [106, 22, 0.9, 168]; const v2 = [62, 50, 0.8, -12]; const v3 = [140, 30, 0.7, 172]; const dl = [32, 56, 0.9, -12];
      const t1 = [26, 82, 1.1]; const t2 = [62, 86, 1.3];
      return fill([[0, '#5a2a1a'], [0.5, '#c8683a'], [1, '#e8a060']]) + glow(140, 50, 8, '#ffd08a', 0.3)
        + mesas(58, '#a85a3a', 0.6, 2) + [[12, 2.4, 16], [34, 2, 12], [150, 2.6, 18]].map(([x, w, h], k) => spire(x, 60, w, h, '#b8704a', '#8a4a30', 0.2, k)).join('') + R(0, 54, 160, 8, '#e08a54', 'opacity=".35"')
        + acclamator(38, 12, 0.75, 1) + acclamator(92, 6, 0.42, 1)
        + coreShip(150, 50, 5) + coreShip(98, 54, 3.4) + smoke(118, 56, 16, 0.45, '#8a5a3a', '#b88a64') + coreShip(122, 40, 13)
        + (() => { const [gr, d] = LG([[0, '#b8643a'], [1, '#7a3a1e']]); return d + P('M0 62 Q80 58 160 62 L160 90 L0 90Z', gr); })() + P('M0 62 Q80 58 160 62', 'none', 'stroke="#d88a5a" stroke-width=".5"')
        + [[48, 66, 2], [138, 72, 2.4], [96, 76, 1.8]].map(([x, y, r]) => smoke(x, y, 18, 0.45) + fire(x, y, r)).join('') + [[20, 70], [112, 68], [150, 82]].map(([x, y]) => E(x, y, 3, 0.8, '#5a2a14', 'opacity=".7"')).join('')
        + atte(t1[0], t1[1], t1[2], 1) + atte(t2[0], t2[1], t2[2], 1)
        + [t1, t2].map(([x, y, s]) => { const p = [x + ATTE_GUN[0] * s, y + ATTE_GUN[1] * s]; return L(p[0], p[1], p[0] + 10, p[1] - 6, '#ffb85a', 0.5, 'opacity=".5"') + C(p[0] + 11, p[1] - 6.6, 0.8, '#fff0c0') + glow(p[0] + 11, p[1] - 6.6, 0.8, '#ffb85a', 0.5) + glow(p[0], p[1], 0.7, '#ffd08a', 0.5); }).join('')
        + Array.from({ length: 6 }, (_, k) => clone(88 + k * 9, 88 - (k % 2), 1.1, 1, true, '#c8ccd4')).join('')
        + laat(36, 36, 1, 1) + laat(78, 26, 0.72, 1)
        + vulture(v1[0], v1[1], v1[2], v1[3]) + vulture(v3[0], v3[1], v3[2], v3[3]) + vulture(v2[0], v2[1], v2[2], v2[3]) + delta7(dl[0], dl[1], dl[2], dl[3], '#c83a2a', '#c83a2a')
        + gunsAt(v1[0], v1[1], v1[2], v1[3], VGUNS).map((p) => shots(p, fwd(p, v1[3], 30), [0.2, 0.55], 0.14, RED)).join('')
        + gunsAt(dl[0], dl[1], dl[2], dl[3], DGUNS).map((p) => shots(p, fwd(p, dl[3], 30), [0.15, 0.5], 0.14, GRN)).join('');
    },

    // 10 · Dooku's Hangar: the secret hangar at the edge of the citadel. Rock
    // walls carved with organic ribs and lamps, the great arched opening on
    // the sunset and the spires, the landing pad's lit ring; Count Dooku's
    // solar sailer sits with its sail furled, Geonosian crew at work; Dooku
    // with his curved red saber between a MagnaGuard and General Grievous.
    dookus_hangar: () => fill([[0, '#1a0c08'], [0.6, '#3a1a0e'], [1, '#5a2a14']])
      + (() => { const [gr, d] = LG([[0, '#c8603a'], [0.6, '#f0a060'], [1, '#f8c888']]); return d + P('M112 64 L112 22 Q136 2 160 14 L160 64Z', gr); })() + glow(140, 44, 5, '#ffe0a0', 0.4) + spire(124, 64, 3.4, 30, '#a85a34', '#6a3420', 0.4, 1) + spire(148, 64, 4.4, 38, '#a85a34', '#6a3420', 0.4, 2) + spire(136, 64, 2.2, 18, '#b8704a', '#8a4a30', 0.3, 3) + mesas(64, '#8a4428', 0.7, 3)
      + P('M108 66 L108 20 Q134 -2 160 10 L160 14 Q136 2 112 22 L112 66Z', '#4a2010', 'stroke="#1a0804" stroke-width=".3"') + Array.from({ length: 6 }, (_, k) => L(108, 24 + k * 7, 112, 24 + k * 7, '#1a0804', 0.4)).join('')
      + R(0, 0, 108, 64, '#3a1a0e', 'opacity=".55"') + Array.from({ length: 6 }, (_, k) => P(`M${k * 20} 64 C${k * 20 - 3} 40 ${k * 20 + 4} 16 ${k * 20 + 14} 0`, 'none', 'stroke="#5a2a14" stroke-width="1.4" opacity=".8"') + P(`M${k * 20 + 1} 64 C${k * 20 - 2} 40 ${k * 20 + 5} 16 ${k * 20 + 15} 0`, 'none', 'stroke="#a8603a" stroke-width=".3" opacity=".5"')).join('')
      + [[18, 30], [58, 26], [96, 30]].map(([x, y]) => E(x, y, 1.4, 1.8, '#5a3018', 'stroke="#2a1008" stroke-width=".2"') + glow(x, y, 1.2, '#ffb85a', 0.4) + C(x, y, 0.7, '#ffe0a0')).join('')
      + (() => { const [gr, d] = LG([[0, '#5a2a14'], [1, '#2a1208']]); return d + R(0, 64, 160, 26, gr); })() + L(0, 64, 160, 64, '#7a3a1e', 0.5)
      + E(62, 74, 46, 7, 'none', 'stroke="#e8a050" stroke-width=".5" stroke-dasharray="2 1.4" opacity=".7"') + Array.from({ length: 16 }, (_, k) => { const t = (k / 16) * Math.PI * 2; return C(+(62 + Math.cos(t) * 46).toFixed(2), +(74 + Math.sin(t) * 7).toFixed(2), 0.4, '#ffd08a', 'opacity=".85"'); }).join('')
      + sailer(56, 55, 1.5)
      + P('M0 60 C8 62 14 66 30 64', 'none', 'stroke="#2a2a2e" stroke-width=".9"') + [[2, 60], [10, 62], [2, 66]].map(([x, y]) => R(x, y, 6, 4, '#5a4a3a', 'stroke="#2a1e14" stroke-width=".2"') + L(x, y + 2, x + 6, y + 2, '#2a1e14', 0.2)).join('')
      + geonosian(22, 68, 1.2, 1) + geonosian(98, 67, 1.1, -1)
      + magnaguard(40, 86, 3, 1, -30) + dooku(80, 86, 3.2, 1) + grievous(116, 86, 3, -1),
  };
  Object.assign(SA.scenes, GE);
  SA.worlds.geonosis = ['orbital_defense', 'hive_spires', 'droid_foundry', 'conveyor_belts', 'jedi_starfighters', 'the_strike_team', 'droideka_wall', 'magnaguard_hall', 'battle_of_geonosis', 'dookus_hangar'];
})(typeof window !== 'undefined' ? window : globalThis);
