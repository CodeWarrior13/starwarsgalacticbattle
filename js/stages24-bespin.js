// Update 2.4: the ten Bespin stage scenes, for approval. Same 160x90 format
// as the worlds before: Slave I diving on Cloud City at sunset, Wing Guards
// on the walkways, the Tibanna refinery, Lando's welcome on the landing
// platform, the chase through the clouds, the Ugnaught tunnels, the dinner
// trap, the bounty hunters' deal, the escape from the gas giant, and the
// carbon-freezing chamber. Drawn in full detail.
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
  // A bank of puffy sunset clouds: lit tops, shadowed bellies.
  const clouds = (y, lit, dark, a = 1, seed = 0, n = 9, size = 1) => {
    let o = `<g opacity="${a}">`;
    for (let k = 0; k < n; k++) { const x = ((k * 23 + seed * 17) % 190) - 15; const r = (6 + ((k * 7 + seed) % 5) * 2.2) * size; const yy = y + ((k * 5 + seed * 3) % 6) - 3; o += C(x, yy + r * 0.3, r, dark) + C(x - r * 0.15, yy, r * 0.92, lit) + C(x + r * 0.7, yy + r * 0.25, r * 0.7, lit) + C(x - r * 0.8, yy + r * 0.3, r * 0.6, lit); }
    return o + R(-10, y + 2 * size, 180, 100, dark) + `</g>`;
  };
  // A towering cloud column, built up from stacked billows.
  const cloudTower = (x, base, h, w, lit, dark) => { let o = ''; const n = Math.ceil(h / (w * 0.5)); for (let k = 0; k < n; k++) { const yy = base - k * w * 0.5; const ww = w * (1 - (k / n) * 0.35); const jx = ((k * 7) % 5 - 2) * w * 0.08; o += C(x + jx + ww * 0.15, yy + ww * 0.12, ww * 0.62, dark) + C(x + jx, yy, ww * 0.58, lit) + C(x + jx - ww * 0.42, yy + ww * 0.1, ww * 0.38, lit); } return o; };
  // Soft rising steam: feathered billows with curling wisps.
  const steam = (x, y, h, a = 0.5, c = '#f8e0d0') => Array.from({ length: 6 }, (_, k) => { const yy = y - (k * h) / 6; const xx = x + ((k * 5) % 3 - 1) * 2.4; const r = 3 + k * 1.4; return C(xx, yy, r * 1.6, c, `opacity="${(a * 0.06).toFixed(3)}"`) + C(xx, yy, r * 1.1, c, `opacity="${(a * 0.1).toFixed(3)}"`) + C(xx, yy, r * 0.6, c, `opacity="${(a * 0.14).toFixed(3)}"`); }).join('') + P(`M${x} ${y} C${x - 4} ${y - h * 0.3} ${x + 5} ${y - h * 0.5} ${x - 2} ${y - h * 0.8} M${x + 3} ${y - 2} C${x + 6} ${y - h * 0.3} ${x - 1} ${y - h * 0.6} ${x + 4} ${y - h * 0.9}`, 'none', `stroke="${c}" stroke-width=".6" opacity="${(a * 0.4).toFixed(2)}"`);
  // Cloud City: the great saucer with its rim of lights, the towers rising
  // from the centre, and the long stalk dropping into the clouds with the
  // reactor bulb at the bottom.
  const cloudCity = (x, y, s, c = '#e8e2dc', d = '#a89c96') => g(x, y, s, 1,
    P('M-1.6 2 L-1 16 C-1 18 1 18 1 16 L1.6 2Z', d) + E(0, 18, 2.6, 2, d) + E(0, 18, 1.4, 1, '#ffb070', 'opacity=".7"')
    + E(0, 2.4, 24, 3.6, d) + E(0, 1.6, 24, 3, c, `stroke="${d}" stroke-width=".25"`) + E(0, 1.2, 20, 2.2, '#ffffff', 'opacity=".35"')
    + Array.from({ length: 22 }, (_, k) => C(-21 + k * 2, 2.8 + Math.sin((k / 21) * Math.PI) * 0.8, 0.22, '#ffe0a0')).join('')
    + [[-14, -3, 3, 4], [-8, -6, 3.4, 7], [-3, -10, 3, 11], [1, -13, 2.6, 14], [5, -9, 3, 10], [10, -6, 3.2, 7], [15, -3, 3, 4], [-11, -4, 2, 5], [8, -11, 1.6, 12]].map(([tx, ty, w, h]) => R(tx, ty, w, h + 1, c, `stroke="${d}" stroke-width=".2"`) + R(tx + w * 0.6, ty, w * 0.4, h + 1, d, 'opacity=".5"') + Array.from({ length: Math.floor(h / 1.6) }, (_, m) => R(tx + 0.4, ty + 0.8 + m * 1.6, w * 0.5, 0.35, '#ffd890', 'opacity=".7"')).join('') + E(tx + w / 2, ty, w / 2, 0.6, c)).join('')
    + E(0, -0.4, 12, 1.4, c, `stroke="${d}" stroke-width=".2"`));
  // A Cloud City Wing Guard: the dark trousers and boots, the blue tunic with
  // its high collar, belt and shoulder strap, the blue cap with its visor,
  // and a blaster rifle held ready.
  const wingGuard = (x, y, s, f = 1, aim = false) => g(x, y, s, f,
    E(0, 0.2, 3, 0.5, '#000', 'opacity=".25"') + R(-2, -1.3, 1.7, 1.5, '#1a1a20', 'rx=".3"') + R(0.3, -1.3, 1.7, 1.5, '#1a1a20', 'rx=".3"')
    + P('M-1.9 -1.1 L-2.1 -5 L2.1 -5 L1.9 -1.1Z', '#2a2e44') + L(0, -4.8, 0, -1.2, '#1a1e30', 0.25) + L(-1.5, -4.6, -1.6, -1.4, '#c8a040', 0.18)
    + P('M-2.5 -4.6 L-2.7 -9 C-2.7 -10 2.7 -10 2.7 -9 L2.5 -4.6Z', '#3a5aa8', 'stroke="#1e2e5a" stroke-width=".2"') + P('M-2.5 -4.6 L-2.3 -3.6 L2.3 -3.6 L2.5 -4.6Z', '#2e4a8e')
    + R(-2.6, -5.4, 5.2, 0.6, '#1a1a20') + R(-0.4, -5.5, 0.8, 0.8, '#c8a040') + L(-2, -9.2, 2, -5.6, '#1a1a20', 0.35) + L(-0.4, -9.4, -0.4, -6, '#c8a040', 0.15)
    + P('M-1 -9.6 L1 -9.6 L0.9 -10.4 L-0.9 -10.4Z', '#3a5aa8') + C(0, -11.3, 1.35, '#c89a78')
    + P('M-1.7 -11.6 C-1.8 -13.6 1.8 -13.6 1.7 -11.6 L1.9 -11.2 L-1.9 -11.2Z', '#2e4a8e', 'stroke="#1a2a5a" stroke-width=".18"') + P('M-1.9 -11.3 L2.4 -11.3 L2.6 -10.8 L-1.9 -10.9Z', '#1a2440') + R(-1.4, -12.6, 2.8, 0.35, '#c8a040', 'opacity=".7"')
    + C(0.5, -11, 0.16, '#2a1a10') + P('M-0.2 -10.3 Q0.3 -10.1 0.7 -10.3', 'none', 'stroke="#6a4a3a" stroke-width=".18"')
    + (aim ? L(2.4, -8.8, 3.6, -7.8, '#3a5aa8', 0.9) + C(3.7, -7.8, 0.42, '#1a1a20') + L(1, -7.8, 6.6, -8.8, '#1e1e22', 0.8) + R(1, -8.2, 1.6, 1.2, '#2a2a2e')
      : L(2.4, -8.6, 2.8, -5.8, '#3a5aa8', 0.9) + L(1.4, -9.2, 3.6, -3, '#1e1e22', 0.75)));
  // A stormtrooper: white armour plates with black joins, the belt with its
  // ammo boxes, the helmet with its dark lenses and breathing grille, rifle.
  const trooper = (x, y, s, f = 1, aim = true) => g(x, y, s, f,
    E(0, 0.2, 3, 0.5, '#000', 'opacity=".25"') + R(-2.1, -1.3, 1.8, 1.5, '#e8ecf0', 'rx=".3"') + R(0.3, -1.3, 1.8, 1.5, '#e8ecf0', 'rx=".3"')
    + R(-2, -5, 1.7, 3.8, '#f2f4f6', 'stroke="#2a2a30" stroke-width=".2"') + R(0.3, -5, 1.7, 3.8, '#f2f4f6', 'stroke="#2a2a30" stroke-width=".2"') + L(-1.2, -3.2, -1.2, -2.4, '#2a2a30', 0.3) + L(1.2, -3.2, 1.2, -2.4, '#2a2a30', 0.3)
    + R(-2.4, -5.8, 4.8, 0.9, '#f2f4f6', 'stroke="#2a2a30" stroke-width=".2"') + [-1.6, -0.6, 0.4].map((bx) => R(bx, -5.7, 0.7, 0.7, '#c8ccd2', 'stroke="#2a2a30" stroke-width=".1"')).join('')
    + P('M-2.5 -5.8 L-2.7 -9.6 C-2.7 -10.4 2.7 -10.4 2.7 -9.6 L2.5 -5.8Z', '#1a1a20') + P('M-2.2 -6.2 L-2.4 -9.4 L2.4 -9.4 L2.2 -6.2Z', '#f6f8fa', 'stroke="#2a2a30" stroke-width=".2"') + P('M-1.6 -8.6 L1.6 -8.6 M-1.4 -7.4 L1.4 -7.4 M0 -9.2 L0 -6.4', 'none', 'stroke="#9aa2ac" stroke-width=".2"')
    + E(-2.8, -9.4, 1, 0.8, '#f2f4f6', 'stroke="#2a2a30" stroke-width=".15"') + E(2.8, -9.4, 1, 0.8, '#f2f4f6', 'stroke="#2a2a30" stroke-width=".15"')
    + P('M-1.8 -10.8 C-1.9 -13.6 1.9 -13.6 1.8 -10.8 L1.6 -10 L-1.6 -10Z', '#f6f8fa', 'stroke="#2a2a30" stroke-width=".2"') + P('M-0.3 -11.85 L-1.25 -11.85 L-1.45 -10.85 L-0.55 -11.2Z M0.3 -11.85 L1.25 -11.85 L1.45 -10.85 L0.55 -11.2Z', '#141418') + P('M-0.75 -10.55 Q0 -10.85 0.75 -10.55 L0.55 -10 L-0.55 -10Z', '#3a3a44') + P('M-0.4 -10.5 L-0.4 -10.05 M0 -10.6 L0 -10.05 M0.4 -10.5 L0.4 -10.05', 'none', 'stroke="#8a8a94" stroke-width=".1"') + P('M-1.6 -10.9 L-1.3 -10.2 M1.6 -10.9 L1.3 -10.2', 'none', 'stroke="#7a8290" stroke-width=".18"') + R(-0.12, -13.1, 0.24, 0.9, '#7a8290') + L(-1.4, -12.4, 1.4, -12.4, '#9aa2ac', 0.15)
    + (aim ? L(2.4, -8.8, 3.6, -7.8, '#f2f4f6', 0.9) + C(3.7, -7.8, 0.42, '#1a1a20') + L(1.2, -7.8, 6, -8.6, '#1a1a1e', 0.75) + R(1.2, -8.3, 1.6, 1.1, '#2a2a2e') : L(2.4, -8.6, 2.8, -5.8, '#f2f4f6', 0.9) + L(1.6, -9, 3.4, -4, '#1a1a1e', 0.7)));
  // Lando Calrissian: dark trousers and boots, the blue shirt with its gold
  // trim and belt, the long blue cape with its pale lining over one
  // shoulder, the moustache and smile, one hand out in welcome.
  const lando = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 3.4, 0.5, '#000', 'opacity=".25"') + R(-2, -1.3, 1.7, 1.5, '#1a1410', 'rx=".3"') + R(0.3, -1.3, 1.7, 1.5, '#1a1410', 'rx=".3"')
    + P('M-1.9 -1.1 L-2.1 -5 L2.1 -5 L1.9 -1.1Z', '#2a2430') + L(0, -4.8, 0, -1.2, '#1a141e', 0.25)
    + P('M-3 -9.6 C-4.2 -6 -4.6 -3 -4.4 -0.8 L-2.6 -1.2 L-2 -9Z', '#2e5aa8', 'stroke="#1a2e5a" stroke-width=".2"') + P('M-2.8 -9 C-3.8 -6 -4 -3 -3.8 -1', 'none', 'stroke="#d8d0c0" stroke-width=".4"')
    + P('M-2.4 -4.8 L-2.6 -9.2 C-2.6 -10 2.6 -10 2.6 -9.2 L2.4 -4.8Z', '#4a78c8', 'stroke="#1a2e5a" stroke-width=".2"') + P('M-0.6 -9.6 L0 -7.4 L0.6 -9.6', 'none', 'stroke="#c8a040" stroke-width=".35"') + P('M-2.4 -6.6 L2.4 -6.6', 'none', 'stroke="#c8a040" stroke-width=".25"')
    + R(-2.5, -5.4, 5, 0.6, '#3a2a1a') + R(-0.4, -5.5, 0.8, 0.8, '#d8b860')
    + P('M2.2 -9 L4.6 -7.4 L4.2 -6.8 L2 -8Z', '#4a78c8') + C(4.6, -7, 0.45, '#7a4a2e')
    + C(0, -11, 1.45, '#8a5a3a') + P('M-1.5 -11.4 C-1.6 -13 1.6 -13 1.5 -11.4 L1.2 -11.8 L-1.2 -11.8Z', '#1a120c') + P('M-0.8 -10.4 Q0 -10.8 0.8 -10.4', 'none', 'stroke="#1a120c" stroke-width=".35"') + P('M-0.5 -10 Q0 -9.8 0.5 -10', 'none', 'stroke="#f0e8e0" stroke-width=".2"') + C(-0.5, -11.3, 0.14, '#1a120c') + C(0.5, -11.3, 0.14, '#1a120c'));
  // Boba Fett: the dented green helmet with its T visor and rangefinder, the
  // grey flight suit, green chest armour, the jetpack and cape, the gauntlets,
  // the kama, and his EE-3 carbine.
  const boba = (x, y, s, f = 1, aim = true) => g(x, y, s, f,
    E(0, 0.2, 3.2, 0.5, '#000', 'opacity=".25"') + R(-2, -1.3, 1.7, 1.5, '#3a3428', 'rx=".3"') + R(0.3, -1.3, 1.7, 1.5, '#3a3428', 'rx=".3"')
    + P('M-1.9 -1.1 L-2.1 -5 L2.1 -5 L1.9 -1.1Z', '#8a8a7a') + R(-1.8, -3.6, 1, 1, '#6a5a3a') + P('M-2 -5 L-2.6 -1.4 L-1.2 -1.6Z M2 -5 L2.6 -1.4 L1.2 -1.6Z', '#4a3a2a')
    + R(-3.6, -9.8, 1.6, 4.6, '#7a7a6a', 'rx=".4" stroke="#3a3a30" stroke-width=".15"') + C(-2.8, -10, 0.6, '#c8a040') + P('M-4.2 -10 C-4.4 -6 -3.8 -2 -3.4 -0.6 L-2.4 -1.6 L-2 -9.4Z', '#6a5a3a', 'opacity=".85"')
    + P('M-2.5 -4.8 L-2.7 -9.4 C-2.7 -10.2 2.7 -10.2 2.7 -9.4 L2.5 -4.8Z', '#9a9a88', 'stroke="#4a4a40" stroke-width=".2"') + P('M-2 -9.2 L-0.2 -9.2 L-0.4 -7 L-2 -7.4Z M2 -9.2 L0.2 -9.2 L0.4 -7 L2 -7.4Z', '#3a6a3a', 'stroke="#1a3a1a" stroke-width=".15"') + R(-1.4, -6.6, 2.8, 1.2, '#5a6a4a') + [-0.8, 0, 0.8].map((px) => C(px, -6, 0.2, ['#ff3a2a', '#3a8aff', '#ffcf3a'][Math.round(px + 1)])).join('')
    + R(-2.6, -5.4, 5.2, 0.6, '#4a3a2a') + R(-2.8, -9.6, 1, 2.6, '#c8a040', 'opacity=".0"')
    + C(0, -11.6, 1.7, '#3a6a3a', 'stroke="#1a3a1a" stroke-width=".2"') + P('M-1.7 -11.4 L1.7 -11.4 L1.7 -10 C1.2 -9.6 -1.2 -9.6 -1.7 -10Z', '#3a6a3a') + P('M-1.2 -12 L1.2 -12 L1.2 -11.4 L0.35 -11.4 L0.35 -10 L-0.35 -10 L-0.35 -11.4 L-1.2 -11.4Z', '#141414') + P('M-1.4 -12.8 L-0.6 -12.4 M1.6 -11.8 L1 -12.6', 'none', 'stroke="#8a2a1a" stroke-width=".3"') + L(1.7, -12.4, 2.2, -14, '#2a2a2a', 0.25) + C(-0.9, -12.9, 0.2, '#5a8a5a', 'opacity=".5"')
    + (aim ? L(2.4, -8.8, 3.6, -7.8, '#9a9a88', 0.9) + C(3.7, -7.8, 0.45, '#3a6a3a') + L(1.2, -7.8, 5.4, -8.4, '#1a1a1a', 0.85) + R(1.8, -8.3, 1.2, 1.2, '#2a2a2a') : L(2.4, -8.6, 2.8, -5.8, '#9a9a88', 0.9) + L(1.4, -9.2, 3, -4, '#1a1a1a', 0.75)));
  // IG-88: the tall thin assassin droid, the cylinder head with its ring of
  // red sensors, the spindly gunmetal limbs and joints, the bandolier, rifle.
  const ig88 = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 3, 0.5, '#000', 'opacity=".25"') + L(-1, -5.6, -1.4, -0.4, '#4a4e56', 0.7) + L(1, -5.6, 1.4, -0.4, '#3e424a', 0.7) + C(-1.2, -3, 0.45, '#2a2e36') + C(1.2, -3, 0.45, '#2a2e36') + R(-2.2, -0.6, 1.6, 0.6, '#2a2e36') + R(0.6, -0.6, 1.6, 0.6, '#2a2e36')
    + R(-1.4, -6.4, 2.8, 1, '#3a3e46') + P('M-1.8 -10.6 L-1.4 -6.4 L1.4 -6.4 L1.8 -10.6Z', '#5a5e66', 'stroke="#2a2e36" stroke-width=".2"') + [-9.6, -8.6, -7.6].map((yy) => L(-1.5, yy, 1.5, yy, '#3a3e46', 0.2)).join('') + L(-1.8, -10.4, 1.6, -6.8, '#6a4a2a', 0.5) + [-1, -0.2, 0.6].map((px, k) => R(px, -9.4 + k * 0.9, 0.5, 0.6, '#8a7a5a')).join('')
    + L(-1.8, -10.2, -2.6, -6.4, '#4a4e56', 0.55) + C(-2.6, -6.2, 0.35, '#2a2e36') + L(1.8, -10.2, 3.2, -8.4, '#4a4e56', 0.55) + L(1.6, -8.2, 6.6, -9.2, '#1a1a1e', 0.8) + R(2.4, -8.8, 1.6, 1.1, '#2a2a2e')
    + R(-0.4, -12.2, 0.8, 1.6, '#3a3e46') + R(-1.1, -15.6, 2.2, 3.4, '#6a6e76', 'rx=".4" stroke="#2a2e36" stroke-width=".2"') + E(0, -15.6, 1.1, 0.4, '#7a7e86') + R(-1.1, -14.4, 2.2, 0.6, '#2a2e36') + [-0.7, 0, 0.7].map((px) => C(px, -14.1, 0.2, '#ff2a1a')).join('') + glow(0, -14.1, 0.6, '#ff2a1a', 0.3) + L(-1.1, -13, 1.1, -13, '#3a3e46', 0.2));
  // Darth Vader, standing: cape, chest box with its lights, belt, helmet.
  const vader = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 4, 0.6, '#000', 'opacity=".3"') + P('M-3.6 -10.4 C-5 -6 -5.6 -2 -5.6 0 L5.4 0 C5.4 -2 4.8 -6 3.4 -10.4Z', '#0a0a0e')
    + P('M-2.4 -10.6 L-2.2 -5 L2.2 -5 L2.4 -10.6 C1.2 -11.2 -1.2 -11.2 -2.4 -10.6Z', '#16161a') + R(-1.6, -9.4, 3.2, 1.8, '#2a2a30', 'rx=".3"') + [-1, -0.3, 0.4, 1.1].map((px, k) => R(px - 0.2, -8.8, 0.4, 0.5, ['#ff3a2a', '#3aff6a', '#3a8aff', '#ffcf3a'][k])).join('')
    + R(-2.3, -5.6, 4.6, 0.8, '#3a3a40') + C(0, -5.2, 0.5, '#8a8a90') + P('M-2 -5 L-2.4 0 M2 -5 L2.4 0 M0 -4.8 L0 0', 'none', 'stroke="#16161a" stroke-width=".3"')
    + P('M-1.8 -12.6 C-1.8 -15 1.8 -15 1.8 -12.6 L2.2 -11 L1.2 -10.6 L-1.2 -10.6 L-2.2 -11Z', '#0e0e12') + P('M-1.6 -12.8 C-1.6 -14.6 1.6 -14.6 1.6 -12.8Z', '#2a2a32', 'opacity=".6"') + P('M-1.3 -12.2 L-0.3 -12.2 L-0.4 -11.6 L-1.3 -11.8Z M1.3 -12.2 L0.3 -12.2 L0.4 -11.6 L1.3 -11.8Z', '#3a3a44') + P('M-0.5 -11.4 L0.5 -11.4 L0.3 -10.7 L-0.3 -10.7Z', '#5a5a64'));
  // An Ugnaught: the small, stout worker with his pink snout, white
  // whiskers and beard, blue overalls and a tool.
  const ugnaught = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 2.4, 0.4, '#000', 'opacity=".25"') + R(-1.6, -1, 1.3, 1, '#2a2018') + R(0.3, -1, 1.3, 1, '#2a2018')
    + P('M-2 -0.8 C-2.4 -3 -2.2 -5 -1.6 -5.6 L1.6 -5.6 C2.2 -5 2.4 -3 2 -0.8Z', '#3a5a8a', 'stroke="#1a2a4a" stroke-width=".18"') + L(-1, -5.6, -1, -3.6, '#2a4a7a', 0.4) + L(1, -5.6, 1, -3.6, '#2a4a7a', 0.4) + R(-1.2, -3.8, 2.4, 1.4, '#2e4e7e')
    + C(0, -6.8, 1.5, '#e0a8a0') + P('M-1.5 -6.4 C-1.6 -4.6 1.6 -4.6 1.5 -6.4 C1 -5.6 -1 -5.6 -1.5 -6.4Z', '#f0f0ec') + E(0.3, -6.6, 0.6, 0.45, '#c88a84') + C(0.1, -6.6, 0.1, '#5a2a2a') + C(0.5, -6.6, 0.1, '#5a2a2a') + C(-0.5, -7.4, 0.15, '#1a1010') + C(0.7, -7.4, 0.15, '#1a1010')
    + P('M-1.4 -7.6 C-1.6 -8.8 1.4 -8.8 1.4 -7.6', 'none', 'stroke="#f0f0ec" stroke-width=".35"') + L(1.8, -4.6, 3, -3, '#8a8a90', 0.35) + R(2.6, -3.4, 1, 0.6, '#5a5a62'));
  // Han Solo frozen in carbonite: the dark slab, the raised relief of his
  // body and hands, the control panel with its lights.
  const carbonite = (x, y, s) => g(x, y, s, 1,
    R(-4, -14, 8, 14, '#3a3e44', 'rx=".6" stroke="#1a1e24" stroke-width=".3"') + R(-3.6, -13.6, 7.2, 13.2, '#4a4e56', 'rx=".4"') + P('M-3.6 -13.6 L-1 -13.6 L-3.6 -9Z', '#ffffff', 'opacity=".12"')
    + P('M-1.2 -11.6 C-1.4 -12.8 1.4 -12.8 1.2 -11.6 L1.4 -10.6 L2.4 -10 L2.6 -6 L1.6 -4 L1.4 -1.4 L-1.4 -1.4 L-1.6 -4 L-2.6 -6 L-2.4 -10 L-1.4 -10.6Z', '#5a5e66', 'stroke="#2a2e34" stroke-width=".2"')
    + P('M-2.4 -9.4 L-3 -11.4 L-2.4 -12 M2.4 -9.4 L2.8 -11 L2.2 -11.8', 'none', 'stroke="#5a5e66" stroke-width=".8" stroke-linecap="round"') + C(0, -11.6, 0.9, '#5a5e66') + P('M-0.4 -11.8 L0.4 -11.8 M-0.3 -11.2 Q0 -11 0.3 -11.2', 'none', 'stroke="#2a2e34" stroke-width=".18"')
    + R(-3.2, -2.2, 6.4, 1.6, '#2a2e34') + [-2.4, -1.4, -0.4, 0.6, 1.6, 2.4].map((px, k) => R(px, -1.8, 0.5, 0.6, ['#ff3a2a', '#3aff6a', '#ffcf3a'][k % 3])).join(''));

  // ---------- Ships ----------
  // Slave I in flight, the rounded end leading: the dark green hull with its
  // red-brown trim, the two wing pods, the cockpit on its stalk, the cannons.
  const slave1 = (x, y, s, a = 0) => g(x, y, s, 1,
    glow(0, -10.6, 2.4, '#ffb070', 0.35)
    + P('M-5 4 L-11.4 10.4 L-10.2 11.6 L-3.6 7Z', '#5a6a58', 'stroke="#1a2a1e" stroke-width=".3"') + P('M5 4 L11.4 10.4 L10.2 11.6 L3.6 7Z', '#4e5e4c', 'stroke="#1a2a1e" stroke-width=".3"') + P('M-8 7.4 L-10.6 10.2 M8 7.4 L10.6 10.2', 'none', 'stroke="#8a3a24" stroke-width=".7"') + R(-11.8, 10.2, 2, 1.6, '#3a4a3a', 'rx=".3"') + R(9.8, 10.2, 2, 1.6, '#3a4a3a', 'rx=".3"')
    + P('M0 -10 C4 -10 6.4 -7 7 -2 C7.4 2 6.6 6 5 8.4 L-5 8.4 C-6.6 6 -7.4 2 -7 -2 C-6.4 -7 -4 -10 0 -10Z', '#4e6e52', 'stroke="#1a2a1e" stroke-width=".4"') + P('M0 -10 C4 -10 6.4 -7 7 -2 C7.4 2 6.6 6 5 8.4 L1.4 8.4 C2.6 4 2.8 -4 0 -10Z', '#2e4a34', 'opacity=".55"')
    + P('M-6.8 -1.4 C-3 -0.4 3 -0.4 6.8 -1.4 L6.95 1.2 C3 2.2 -3 2.2 -6.95 1.2Z', '#8a3a24', 'stroke="#4a1a10" stroke-width=".2"') + P('M-6.4 4.4 C-3 5.2 3 5.2 6.4 4.4', 'none', 'stroke="#8a3a24" stroke-width=".6"')
    + [-4.4, -2.2, 2.2, 4.4].map((px) => P(`M${px} -8.6 Q${px * 1.25} -2 ${px * 1.05} 8`, 'none', 'stroke="#2a4a30" stroke-width=".22"')).join('') + [[-5, -4, 2, 1.4], [2.6, -6, 1.8, 1.2], [-3.4, 2.6, 2.2, 1.2], [3, 2.4, 1.6, 1.4]].map(([px, py, w, h]) => R(px, py, w, h, '#7a7a56', 'opacity=".55"')).join('') + [[-1, -3.6], [4, 0.4], [-5, 6]].map(([px, py]) => E(px, py, 1.2, 0.6, '#1a2a1e', 'opacity=".35"')).join('')
    + P('M-2.6 -7.4 C-1.8 -9 1.8 -9 2.6 -7.4 L2.2 -5.2 L-2.2 -5.2Z', '#6a7a64', 'stroke="#1a2a1e" stroke-width=".25"') + P('M-2 -7.2 C-1.2 -8.2 1.2 -8.2 2 -7.2 L1.8 -6.2 L-1.8 -6.2Z', '#1a2a3a') + P('M-1.4 -7.4 L-0.4 -7.8', 'none', 'stroke="#8ab0d0" stroke-width=".3"') + L(0, -8, 0, -6.2, '#6a7a64', 0.2)
    + R(-2.4, 8.2, 1.6, 1.4, '#2a2a2a') + R(0.8, 8.2, 1.6, 1.4, '#2a2a2a') + C(-1.6, 9.8, 0.55, '#141414') + C(1.6, 9.8, 0.55, '#141414'), a);
  // The Hound's Tooth: Bossk's long boxy freighter, nose left, cockpit tower
  // on top at the front, white hull with red stripes, the engine bank.
  const hounds = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M-18 -1 L-14 -4 L14 -4 L18 -2 L18 3 L-14 3 L-18 1Z', '#d8d4cc', 'stroke="#5a564e" stroke-width=".35"') + P('M-18 -1 L-14 -4 L14 -4 L18 -2 L-16 -0.4Z', '#ffffff', 'opacity=".35"')
    + R(-14, -0.8, 28, 1, '#a82a20') + [-10, -6, -2, 2, 6, 10].map((px) => L(px, -4, px, 3, '#a8a49c', 0.25)).join('') + [[-8, 1], [0, 1.2], [8, 1]].map(([px, py]) => R(px, py, 3, 1.2, '#8a867e')).join('')
    + P('M-15 -4 L-14 -8 L-8 -8 L-6 -4Z', '#c8c4bc', 'stroke="#5a564e" stroke-width=".3"') + R(-13.6, -7.4, 4, 1.2, '#2a3a4a') + L(-10, -8, -9, -10, '#5a564e', 0.3)
    + R(18, -2.6, 2, 5.4, '#6a665e') + [-1.4, 0.4, 2].map((yy) => glow(20.4, yy, 0.8, '#ff9a4a', 0.45) + C(20.2, yy, 0.5, '#ffd8a8')).join(''), a);
  // A twin-pod cloud car: two rounded orange pods side by side on a short
  // spar, cockpit glazing, the engine at the back of each pod.
  const cloudCar = (x, y, s, a = 0) => {
    const pod = (ox, oy, c, d) => P(`M${ox - 7} ${oy - 1.4} C${ox - 7} ${oy - 2.6} ${ox - 5} ${oy - 3} ${ox} ${oy - 3} C${ox + 4} ${oy - 3} ${ox + 6.4} ${oy - 2} ${ox + 7} ${oy} C${ox + 6.4} ${oy + 2} ${ox + 4} ${oy + 3} ${ox} ${oy + 3} C${ox - 5} ${oy + 3} ${ox - 7} ${oy + 2.6} ${ox - 7} ${oy + 1.4}Z`, c, `stroke="${d}" stroke-width=".3"`)
      + P(`M${ox + 1.6} ${oy - 2.7} C${ox + 4.4} ${oy - 2.6} ${ox + 6.2} ${oy - 1.4} ${ox + 6.7} ${oy} L${ox + 1.6} ${oy}Z`, '#1a2a3a') + L(ox + 3.6, oy - 2.4, ox + 3.6, oy, '#c8582e', 0.2) + P(`M${ox + 2.4} ${oy - 2.2} Q${ox + 4} ${oy - 2} ${ox + 5} ${oy - 1.2}`, 'none', 'stroke="#8ab0d0" stroke-width=".3"')
      + P(`M${ox - 6} ${oy - 0.4} L${ox + 1} ${oy - 0.4}`, 'none', `stroke="${d}" stroke-width=".5"`) + [-4, -2, 0].map((px) => L(ox + px, oy - 2.9, ox + px, oy + 2.9, d, 0.15)).join('')
      + R(ox - 8.2, oy - 1.2, 1.4, 2.4, '#4a3a30', 'rx=".3"') + glow(ox - 8.6, oy, 0.7, '#ffb070', 0.55) + C(ox - 8.4, oy, 0.4, '#ffe0b0');
    return g(x, y, s, 1, pod(1.8, -2.6, '#a84a28', '#5a2010') + P('M-3 -2 L3 -2 L4 1 L-4 1Z', '#6a3a2a') + P('M-5 -3.6 L-6.4 -7 L-4.8 -7 L-3 -3Z', '#a84a28', 'stroke="#5a2010" stroke-width=".25"') + pod(0, 0, '#d8643a', '#6a2a14') + P('M-6 -2.4 L-7.8 -5.6 L-6 -5.6 L-4.2 -2.6Z', '#d8643a', 'stroke="#6a2a14" stroke-width=".25"'), a);
  };
  // A TIE Bomber side-on: the twin pods between the bent hexagonal wings.
  const tieBomber = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M-5 -9 L-3 -10 L-2 -2 L-3 10 L-5 9 L-4 0Z M5 -9 L3 -10 L2 -2 L3 10 L5 9 L4 0Z', '#3a3e46', 'stroke="#1a1e24" stroke-width=".3"') + L(-3, -6, -4.2, 6, '#5a5e66', 0.2) + L(3, -6, 4.2, 6, '#5a5e66', 0.2)
    + R(-3, -2.6, 6, 1.2, '#4a4e56') + E(0, -3.4, 2.2, 1.8, '#6a6e76', 'stroke="#2a2e36" stroke-width=".25"') + C(0, -3.4, 0.9, '#14181e') + E(0, 1.8, 2.2, 2.6, '#5a5e66', 'stroke="#2a2e36" stroke-width=".25"') + L(-1.6, 1.8, 1.6, 1.8, '#3a3e46', 0.25), a);

  const B = {
    // 1 · Cloud City Approach (fleet): sunset over Bespin. Cloud City hangs
    // in the golden haze above a sea of cloud, and Slave I dives in out of
    // the sun with two TIE fighters on its wings, firing ahead.
    cloud_city_approach: () => fill([[0, '#5a3a6a'], [0.35, '#d86a5a'], [0.65, '#f8b070'], [1, '#ffe0a8']])
      + C(124, 30, 9, '#fff0c8', 'opacity=".9"') + glow(124, 30, 8, '#ffe0a0', 0.3)
      + E(40, 18, 40, 3, '#f8a888', 'opacity=".5"') + E(110, 12, 50, 2.6, '#e88878', 'opacity=".45"')
      + clouds(66, '#ffd8b0', '#e8a080', 0.7, 1, 10, 0.9) + cloudCity(104, 50, 1.25) + clouds(74, '#ffe8c8', '#f0b090', 1, 3, 10, 1.1)
      + slave1(52, 36, 1.6, -14) + (kit.tie ? kit.tie(20, 22, 1.7) + kit.tie(28, 54, 1.4) : '')
      + bolt(28, 24, 46, 30, '#3aff6a') + bolt(35, 53, 50, 50, '#3aff6a') + bolt(57, 51, 84, 46, '#ff4a2a') + bolt(53, 52, 80, 50, '#ff4a2a')
      + clouds(86, '#fff0d8', '#f4c0a0', 1, 5, 10, 1.3),

    // 2 · Wing Guard Patrol: high on Cloud City's walkways. Curved white
    // towers and a railed bridge over the drop, sunset clouds far below,
    // and a patrol of Wing Guards in blue walking the span, rifles ready.
    wing_guard_patrol: () => fill([[0, '#6a4a7a'], [0.4, '#e88a6a'], [0.75, '#ffc890'], [1, '#ffe8c0']])
      + clouds(58, '#ffd8b8', '#e8a888', 0.8, 2, 10, 0.8) + clouds(70, '#ffe8c8', '#f0b898', 1, 4, 10, 1)
      + [[10, 8, 16, 60], [140, 4, 20, 66], [120, 26, 10, 40]].map(([x, y, w, h]) => R(x, y, w, h, '#ece6e0', 'stroke="#a89c96" stroke-width=".4"') + R(x + w * 0.62, y, w * 0.38, h, '#c8beb6', 'opacity=".6"') + E(x + w / 2, y, w / 2, 2, '#f4eee8', 'stroke="#a89c96" stroke-width=".3"') + Array.from({ length: Math.floor(h / 6) }, (_, m) => R(x + 2, y + 4 + m * 6, w * 0.55, 1.4, '#ffd8a0', 'opacity=".75"') + L(x, y + 6.6 + m * 6, x + w, y + 6.6 + m * 6, '#c8beb6', 0.3)).join('')).join('')
      + P('M0 66 Q80 58 160 66 L160 72 Q80 64 0 72Z', '#e4dcd6', 'stroke="#9a8e88" stroke-width=".4"') + P('M0 72 Q80 64 160 72 L160 76 Q80 68 0 76Z', '#a89c96')
      + P('M0 58 Q80 50 160 58', 'none', 'stroke="#c8beb6" stroke-width=".8"') + Array.from({ length: 21 }, (_, k) => { const x = k * 8; const yt = 58 - Math.sin((x / 160) * Math.PI) * 8; return L(x, yt, x, yt + 8, '#c8beb6', 0.5); }).join('')
      + wingGuard(48, 66, 2.7, 1) + wingGuard(78, 63.6, 2.9, 1, true) + wingGuard(110, 64.8, 2.7, -1)
      + P('M0 60 Q80 52 160 60', 'none', 'stroke="#ffffff" stroke-width=".5" opacity=".6"') + P('M0 76 Q80 68 160 76 L160 90 L0 90Z', '#9a8e88') + Array.from({ length: 12 }, (_, k) => { const x = k * 14 + 4; return E(x, 82 - Math.sin((x / 160) * Math.PI) * 6, 3, 1.4, '#ffd8a0', 'opacity=".55"'); }).join('') + cloudCar(128, 30, 1.2, -6) + cloudCar(28, 40, 0.8, -4),

    // 3 · Tibanna Refinery: under the city, the gas works. Great spherical
    // Tibanna tanks, pipes and catwalks, vents glowing with gas, and
    // stormtroopers with a Wing Guard holding the gantry.
    tibanna_refinery: () => fill([[0, '#3a2a30'], [0.5, '#7a4a3a'], [1, '#2a1e1e']])
      + E(80, 40, 80, 30, '#ff8a4a', 'opacity=".12"')
      + [[24, 34, 16], [74, 26, 20], [128, 34, 16]].map(([x, y, r]) => { const [tg, td] = LG([[0, '#d8ccc0'], [0.6, '#8a7e76'], [1, '#4a403c']], 0.2, 0.2, 0.8, 1); return td + C(x, y, r, tg, 'stroke="#3a302c" stroke-width=".5"') + P(`M${x - r} ${y} Q${x} ${y + r * 0.3} ${x + r} ${y}`, 'none', 'stroke="#5a504a" stroke-width=".6"') + P(`M${x} ${y - r} Q${x + r * 0.3} ${y} ${x} ${y + r}`, 'none', 'stroke="#5a504a" stroke-width=".4"') + C(x - r * 0.4, y - r * 0.4, r * 0.18, '#ffffff', 'opacity=".25"') + R(x - 2, y + r - 1, 4, 30, '#3a302c') + [-1, 1].map((sd) => L(x + sd * r * 0.7, y + r * 0.6, x + sd * r * 0.9, y + 40, '#3a302c', 1.2)).join(''); }).join('')
      + [[0, 52], [0, 56]].map(([x, y]) => R(x, y, 160, 1.6, '#5a4a42', 'stroke="#2a201c" stroke-width=".2"')).join('') + [44, 104].map((x) => R(x - 3, 30, 6, 30, '#4a3e38', 'stroke="#2a201c" stroke-width=".3"')).join('')
      + [[44, 30], [104, 30], [20, 52], [140, 52]].map(([x, y]) => glow(x, y, 3, '#ffb060', 0.4) + E(x, y - 4, 4, 2.4, '#ffd0a0', 'opacity=".3"') + E(x + 2, y - 9, 5, 3, '#ffc890', 'opacity=".18"')).join('')
      + P('M0 66 L160 66 L160 70 L0 70Z', '#4a3e38') + Array.from({ length: 33 }, (_, k) => L(k * 5, 66, k * 5, 70, '#2a201c', 0.3)).join('') + P('M0 62 L160 62', 'none', 'stroke="#6a5a52" stroke-width=".6"') + Array.from({ length: 17 }, (_, k) => L(k * 10, 62, k * 10, 66, '#6a5a52', 0.4)).join('')
      + P('M24 40 C34 42 40 44 44 44 M104 44 C110 44 118 42 128 40 M74 46 C74 50 60 50 44 50 M74 46 C74 50 90 50 104 50', 'none', 'stroke="#5a4a42" stroke-width="1.6"') + [[34, 42], [118, 42], [60, 50], [90, 50]].map(([x, y]) => C(x, y, 1.2, '#8a3a2a', 'stroke="#2a1a14" stroke-width=".3"') + L(x, y - 1.2, x, y - 2.4, '#2a1a14', 0.4)).join('')
      + Array.from({ length: 16 }, (_, k) => P(`M${k * 10} 66 l5 0 l-1.6 4 l-5 0Z`, '#ffcf3a', 'opacity=".22"')).join('') + R(6, 56, 10, 6, '#3a302c', 'stroke="#6a5a52" stroke-width=".4"') + R(7, 57, 8, 2.4, '#5ad8ff', 'opacity=".6"') + ugnaught(16, 66, 2, -1)
      + trooper(54, 66, 2.6, 1) + trooper(76, 66, 2.6, 1) + wingGuard(102, 66, 2.6, -1, true) + trooper(124, 66, 2.6, -1)
      + R(0, 70, 160, 20, '#1e1614') + Array.from({ length: 8 }, (_, k) => R(k * 20 + 4, 74, 12, 3, '#ff8a4a', 'opacity=".25"')).join(''),

    // 4 · Lando's Welcome: the landing platform at sunset. The Falcon on the
    // pad, Cloud City's towers all around, and Lando striding out in his cape
    // with Wing Guards at his back.
    landos_welcome: () => fill([[0, '#5a4a7a'], [0.4, '#e8907a'], [0.75, '#ffc898'], [1, '#ffe4c0']])
      + C(30, 26, 7, '#fff0c8', 'opacity=".8"') + clouds(54, '#ffd8b8', '#e8a888', 0.7, 6, 10, 0.8)
      + [[96, 8, 14, 50], [116, 16, 10, 42], [138, 4, 18, 54], [4, 22, 12, 36]].map(([x, y, w, h]) => R(x, y, w, h, '#ece6e0', 'stroke="#a89c96" stroke-width=".4"') + R(x + w * 0.62, y, w * 0.38, h, '#c8beb6', 'opacity=".6"') + E(x + w / 2, y, w / 2, 1.8, '#f4eee8', 'stroke="#a89c96" stroke-width=".3"') + Array.from({ length: Math.floor(h / 5) }, (_, m) => R(x + 1.6, y + 3 + m * 5, w * 0.55, 1.2, '#ffd8a0', 'opacity=".75"')).join('')).join('')
      + E(80, 72, 84, 12, '#d8d0ca', 'stroke="#9a8e88" stroke-width=".5"') + E(80, 72, 70, 9, 'none', 'stroke="#ffcf3a" stroke-width=".5" opacity=".6"') + E(80, 72, 40, 5, 'none', 'stroke="#ffcf3a" stroke-width=".4" opacity=".5"')
      + (kit.falconSide ? `<g transform="translate(104 0) scale(-1 1)">${kit.falconSide(52, 63, 1.15)}</g>` : '')
      + wingGuard(96, 74, 2.5, -1) + wingGuard(128, 76, 2.6, -1) + lando(112, 78, 3, -1)
      + R(0, 84, 160, 6, '#9a8e88'),

    // 5 · Cloud Car Chase (fleet): through the cloud canyons. The Hound's
    // Tooth and Slave I tear between towering cloud banks with a TIE on
    // their tail, and a pair of twin-pod cloud cars swings in to intercept.
    cloud_car_chase: () => fill([[0, '#7a5a8a'], [0.5, '#f0a07a'], [1, '#ffd8a8']])
      + clouds(30, '#ffd8b8', '#e0a088', 0.5, 7, 8, 1.6) + E(80, 50, 60, 18, '#ffe8c8', 'opacity=".5"')
      + cloudTower(14, 90, 96, 30, '#ffe0c0', '#e8a888') + cloudTower(150, 90, 100, 28, '#ffd8b8', '#e0a080') + cloudTower(112, 92, 40, 18, '#ffe8c8', '#f0b090')
      + hounds(66, 40, 1.4, 8) + slave1(104, 30, 1.25, -8) + (kit.tie ? kit.tie(126, 22, 1) : '') + bolt(120, 24, 108, 28, '#3aff6a')
      + cloudCar(46, 58, 1.4, -14) + cloudCar(30, 68, 1.1, -10) + bolt(54, 56, 66, 46, '#ff4a2a') + bolt(36, 66, 58, 48, '#ff4a2a')
      + clouds(84, '#fff0d8', '#f4c0a0', 1, 8, 10, 1.3),

    // 6 · Ugnaught Tunnels: the city's industrial guts. A conveyor carries
    // scrap and droid parts past the furnace glow, Ugnaughts at work, and
    // IG-88 stalking forward with stormtroopers through the steam.
    ugnaught_tunnels: () => fill([[0, '#2a1e1a'], [0.5, '#4a3028'], [1, '#1a1210']])
      + P('M0 0 L160 0 L160 14 Q80 4 0 14Z', '#3a2a24') + Array.from({ length: 9 }, (_, k) => P(`M${k * 20} ${12 - Math.sin((k / 8) * Math.PI) * 6} L${k * 20} 60`, 'none', 'stroke="#2a1c18" stroke-width="2.4"')).join('')
      + [[20, 20], [60, 16], [100, 16], [140, 20]].map(([x, y]) => R(x - 5, y, 10, 2, '#5a4a40') + R(x - 4, y + 1.6, 8, 0.6, '#ffd8a0', 'opacity=".7"')).join('')
      + R(120, 24, 34, 32, '#2a1a14', 'stroke="#5a3a2a" stroke-width=".6"') + R(124, 28, 26, 24, '#ff6a2a', 'opacity=".75"') + glow(137, 40, 10, '#ff8a3a', 0.35) + [128, 134, 140, 146].map((x) => L(x, 28, x, 52, '#3a1a10', 0.6)).join('')
      + R(0, 54, 120, 4, '#4a3a32', 'stroke="#2a1c18" stroke-width=".3"') + Array.from({ length: 24 }, (_, k) => C(k * 5 + 2, 58.4, 0.9, '#2a1c18')).join('')
      + [[12, 54], [34, 54], [58, 54], [86, 54], [104, 54]].map(([x, y], k) => [P(`M${x - 2} ${y} L${x - 1} ${y - 2.6} L${x + 2} ${y - 2} L${x + 2.4} ${y}Z`, '#8a7a6a'), C(x, y - 1.6, 1.6, '#d8b040'), R(x - 2.4, y - 2, 4.8, 2, '#6a6e76')][k % 3]).join('') + C(58, 52.4, 1.6, '#d8b040') + C(57.4, 52, 0.3, '#ffe8a0')
      + P('M0 26 L120 26 M0 29 L120 29', 'none', 'stroke="#5a4038" stroke-width="1.4"') + [20, 50, 80, 110].map((x) => R(x - 1.4, 25, 2.8, 5, '#4a3028')).join('')
      + [146, 150, 154].map((x) => R(x - 3, 48, 6, 14, '#3a3e44', 'stroke="#1a1e24" stroke-width=".3"') + R(x - 2.4, 49, 4.8, 12, '#4a4e56')).join('')
      + ugnaught(24, 54, 2.2, 1) + ugnaught(72, 54, 2.1, -1) + ugnaught(96, 54, 2, 1)
      + glow(79, 50, 1.4, '#fff0a0', 0.6) + [[0.8, -0.4], [1.4, 0.6], [0.4, 1.2], [-0.6, 1], [1.8, -0.2]].map(([dx, dy]) => L(79, 50, 79 + dx * 2, 50 + dy * 2, '#ffe080', 0.25)).join('')
      + R(0, 62, 160, 28, '#2a1e1a') + Array.from({ length: 17 }, (_, k) => L(k * 10, 62, k * 10 - 6, 90, '#3a2a24', 0.4)).join('')
      + E(60, 66, 30, 4, '#c8b8a8', 'opacity=".18"') + E(110, 60, 26, 5, '#c8b8a8', 'opacity=".14"')
      + ig88(66, 80, 2.7, 1) + trooper(40, 82, 2.5, 1) + trooper(92, 82, 2.5, -1) + bolt(110, 70, 126, 66, '#ff4a2a'),

    // 7 · Dinner Guests: the trap in the dining room. A long white table
    // under the curved white walls and the great window full of sunset;
    // Darth Vader standing at the far end, Boba Fett at his side,
    // stormtroopers framing the doorway.
    dinner_guests: () => fill([[0, '#e8e2dc'], [1, '#c8beb6']])
      + P('M20 0 L140 0 L130 50 L30 50Z', '#f4eee8') + P('M44 6 L116 6 L110 38 L50 38Z', '#ffb880') + (() => { const [wg, wd] = LG([[0, '#f8a070'], [0.6, '#ffd0a0'], [1, '#ffe8c8']]); return wd + P('M44 6 L116 6 L110 38 L50 38Z', wg); })() + clouds(32, '#fff0d8', '#f8c8a0', 0.9, 9, 8, 0.6).replace('<g ', '<g clip-path="url(#bs-win)" ') + `<clipPath id="bs-win"><path d="M44 6 L116 6 L110 38 L50 38Z"/></clipPath>` + [62, 80, 98].map((x) => L(x, 6, x - (x - 80) * 0.08, 38, '#c8beb6', 1)).join('') + P('M44 6 L116 6 L110 38 L50 38Z', 'none', 'stroke="#a89c96" stroke-width="1.4"')
      + P('M0 0 L20 0 L30 50 L0 70Z', '#ddd5ce') + P('M160 0 L140 0 L130 50 L160 70Z', '#d4ccc5') + [[6, 10], [6, 26], [148, 10], [148, 26]].map(([x, y]) => E(x, y, 3, 6, '#ffd8a0', 'opacity=".55"')).join('')
      + P('M30 50 L130 50 L160 70 L160 90 L0 90 L0 70Z', '#b8aea6')
      + vader(80, 50, 2.6, 1) + boba(62, 52, 2.3, 1, false)
      + P('M50 56 L110 56 L122 74 L38 74Z', '#f8f4f0', 'stroke="#a89c96" stroke-width=".5"') + P('M38 74 L122 74 L122 76 L38 76Z', '#c8beb6') + [[60, 62], [70, 66], [90, 66], [100, 62], [80, 70], [56, 70], [104, 70]].map(([x, y]) => E(x, y, 2.6, 0.9, '#e8e2dc', 'stroke="#a89c96" stroke-width=".2"') + C(x + 2.8, y - 0.8, 0.5, '#d8ccc0')).join('')
      + [[46, 62], [114, 62], [40, 70], [120, 70]].map(([x, y]) => P(`M${x - 2.4} ${y + 2} L${x - 2} ${y - 7} C${x - 2} ${y - 8.4} ${x + 2} ${y - 8.4} ${x + 2} ${y - 7} L${x + 2.4} ${y + 2}Z`, '#e8e0d8', 'stroke="#a89c96" stroke-width=".3"') + R(x - 2.6, y + 1.4, 5.2, 1, '#c8beb6')).join('')
      + [[63, 60.6], [97, 60.6], [73, 64.6], [87, 64.6]].map(([x, y]) => P(`M${x - 0.6} ${y - 2} L${x + 0.6} ${y - 2} L${x + 0.2} ${y - 0.6} L${x + 0.2} ${y} L${x - 0.2} ${y} L${x - 0.2} ${y - 0.6}Z`, '#e8f0f8', 'stroke="#a8b0b8" stroke-width=".12" opacity=".9"')).join('') + E(80, 62, 4, 1.2, '#c88a5a') + E(80, 61.6, 3, 0.7, '#e8a870')
      + [36, 124].map((x) => P(`M${x} 0 L${x + (x < 80 ? 6 : -6)} 50`, 'none', 'stroke="#c8beb6" stroke-width="1.6"')).join('') + R(40, 0, 80, 3, '#ffe8c8', 'opacity=".7"') + R(40, 3, 80, 1, '#c8beb6')
      + trooper(18, 86, 2.8, 1) + trooper(142, 86, 2.8, -1),

    // 8 · The Bounty Hunters' Deal: down in the hangar corridor, Boba Fett
    // and IG-88 face each other across Han frozen in carbonite, each with a
    // hand on his weapon; a Wing Guard watches, red work lights on the walls.
    bounty_hunters_deal: () => fill([[0, '#2a1e22'], [0.5, '#4a3236'], [1, '#1e1416']])
      + P('M0 0 L56 26 L104 26 L160 0Z', '#3a2a2e') + P('M0 90 L56 64 L104 64 L160 90Z', '#2a1e20') + P('M0 0 L56 26 L56 64 L0 90Z', '#4a363a') + P('M160 0 L104 26 L104 64 L160 90Z', '#40302e')
      + [0.25, 0.5, 0.75].map((k) => L(k * 56, k * 26, k * 56, 90 - k * 26, '#6a5054', 1.4 - k) + L(160 - k * 56, k * 26, 160 - k * 56, 90 - k * 26, '#6a5054', 1.4 - k)).join('')
      + [[14, 20], [146, 20], [36, 32], [124, 32]].map(([x, y]) => R(x - 2, y, 4, 2, '#ff3a2a') + glow(x, y + 1, 3, '#ff3a2a', 0.25)).join('')
      + R(56, 26, 48, 38, '#1a1214') + E(80, 44, 20, 14, '#ffb090', 'opacity=".08"')
      + E(80, 80, 40, 4, '#000', 'opacity=".3"') + R(70, 79, 20, 3, '#3a3438') + carbonite(80, 79, 2.2) + glow(80, 62, 8, '#ff8a6a', 0.08)
      + Array.from({ length: 9 }, (_, k) => L(56 - k * 7, 64 + k * 3.2, 104 + k * 7, 64 + k * 3.2, '#3a2a2e', 0.4)).join('') + Array.from({ length: 7 }, (_, k) => L(62 + k * 6, 64, 30 + k * 16.6, 90, '#3a2a2e', 0.3)).join('')
      + [[22, 76, 10, 8], [30, 70, 7, 6], [132, 70, 9, 7]].map(([x, y, w, h]) => R(x - w / 2, y - h / 2, w, h, '#5a4a3e', 'stroke="#2a1e18" stroke-width=".4"') + L(x - w / 2, y - h / 2, x + w / 2, y + h / 2, '#3a2e26', 0.4) + L(x + w / 2, y - h / 2, x - w / 2, y + h / 2, '#3a2e26', 0.4) + R(x - w / 2, y - h / 2, w, 1, '#ffcf3a', 'opacity=".35"')).join('')
      + P('M0 40 L56 46 M0 44 L56 49 M160 40 L104 46 M160 44 L104 49', 'none', 'stroke="#5a4044" stroke-width=".9"') + steam(144, 88, 20, 0.4, '#e8d8d8')
      + boba(52, 84, 3, 1, false) + ig88(110, 84, 3, -1) + wingGuard(134, 80, 2.4, -1),

    // 9 · Escape the Gas Giant (fleet): racing out of Bespin's atmosphere.
    // The giant's banded orange curve below, Cloud City small on the haze,
    // the Falcon climbing hard with the Hound's Tooth, Slave I and a TIE
    // Bomber hunting it up through the last of the clouds.
    escape_gas_giant: () => fill([[0, '#0a0814'], [0.45, '#3a2034'], [0.7, '#c86a4a'], [1, '#ffc890']])
      + Array.from({ length: 50 }, (_, k) => C((k * 41) % 160, (k * 23) % 40, 0.25, '#ffffff', `opacity="${0.3 + (k % 4) * 0.15}"`)).join('')
      + (() => { const [pg, pd] = LG([[0, '#ffd8a0'], [0.4, '#e8905a'], [1, '#8a4a3a']], 0, 0, 0, 1); return pd + E(80, 150, 150, 90, pg); })() + [66, 72, 78, 84].map((y, k) => P(`M-10 ${y} Q80 ${y - 18 + k * 2} 170 ${y}`, 'none', `stroke="${['#f8c890', '#d8805a', '#f0b080', '#c87050'][k]}" stroke-width="${2.4 - k * 0.3}" opacity=".6"`)).join('')
      + cloudCity(132, 70, 0.5) + clouds(84, '#ffe0c0', '#f0a880', 0.8, 10, 10, 0.9)
      + (kit.falcon ? kit.falcon(54, 30, 1.6, -36) : '') + hounds(100, 52, 1.1, -30) + slave1(120, 40, 1, -18) + tieBomber(138, 58, 0.9, -20)
      + bolt(92, 46, 70, 36, '#ff4a2a') + bolt(112, 34, 74, 28, '#ff4a2a') + bolt(132, 54, 108, 44, '#3aff6a'),

    // 10 · The Freezing Chamber: the carbon-freezing chamber. The round pit
    // with its hydraulic claws and the steam boiling up in red-orange light,
    // Han's slab just raised out of the freeze, Boba Fett and IG-88 on the
    // platform with stormtroopers at the rail.
    freezing_chamber: () => fill([[0, '#1a0e0e'], [0.5, '#3a1a16'], [1, '#140a0a']])
      + Array.from({ length: 9 }, (_, k) => L(k * 20, 0, k * 20 + (k - 4) * 6, 50, '#2a1210', 1.6)).join('') + [[24, 12], [136, 12], [80, 6]].map(([x, y]) => C(x, y, 2, '#ff6a3a') + glow(x, y, 4, '#ff6a3a', 0.3)).join('')
      + E(80, 58, 76, 20, '#3a1e1a', 'stroke="#5a2e26" stroke-width=".6"') + E(80, 58, 60, 15, '#2a1410') + E(80, 58, 30, 8, '#0e0606', 'stroke="#ff6a3a" stroke-width=".8"') + glow(80, 58, 14, '#ff6a3a', 0.25)
      + [[-1, 0], [1, 0], [-1, 1], [1, 1]].map(([sd, k]) => P(`M${80 + sd * (14 + k * 12)} ${50 + k * 2} L${80 + sd * (10 + k * 10)} ${36 - k * 4} L${80 + sd * (6 + k * 8)} ${38 - k * 4}`, 'none', 'stroke="#5a4a48" stroke-width="1.6" stroke-linejoin="round"')).join('')
      + carbonite(80, 56, 2.1)
      + steam(70, 54, 40, 0.9) + steam(90, 54, 44, 0.9) + steam(80, 50, 46, 0.7, '#ffe8d8') + steam(60, 60, 26, 0.6) + steam(100, 60, 26, 0.6) + E(80, 52, 30, 5, '#ffb090', 'opacity=".22"')
      + Array.from({ length: 6 }, (_, k) => P(`M${20 + k * 24} 0 C${22 + k * 24} 10 ${16 + k * 24} 18 ${20 + k * 24} 26`, 'none', 'stroke="#1a0a08" stroke-width=".9"')).join('') + R(138, 62, 14, 8, '#2a1a16', 'stroke="#6a3a2e" stroke-width=".4"') + [140, 143, 146, 149].map((px, k) => R(px, 64, 2, 1.2, ['#ff3a2a', '#3aff6a', '#ffcf3a', '#3a8aff'][k])).join('')
      + P('M0 74 C40 70 120 70 160 74 L160 90 L0 90Z', '#2a1612') + P('M0 72 C40 68 120 68 160 72', 'none', 'stroke="#6a3a2e" stroke-width="1"') + Array.from({ length: 17 }, (_, k) => L(k * 10, 70 - Math.sin((k / 16) * Math.PI) * 2, k * 10, 76, '#5a2e26', 0.5)).join('')
      + boba(36, 84, 2.9, 1, false) + ig88(124, 84, 2.9, -1) + trooper(16, 86, 2.5, 1) + trooper(144, 86, 2.5, -1),
  };
  Object.assign(SA.scenes, B);
  SA.worlds.bespin = ['cloud_city_approach', 'wing_guard_patrol', 'tibanna_refinery', 'landos_welcome', 'cloud_car_chase', 'ugnaught_tunnels', 'dinner_guests', 'bounty_hunters_deal', 'escape_gas_giant', 'freezing_chamber'];
})(typeof window !== 'undefined' ? window : globalThis);
