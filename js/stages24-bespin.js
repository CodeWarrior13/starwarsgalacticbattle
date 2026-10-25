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
  const cloudCity = (x, y, s, c = '#ece6e0', d = '#a89c96') => g(x, y, s, 1,
    P('M-2.2 3 L-1.2 18 C-1.2 20 1.2 20 1.2 18 L2.2 3Z', d) + [6, 9, 12, 15].map((yy) => L(-1.8 + yy * 0.04, yy, 1.8 - yy * 0.04, yy, '#8a7e78', 0.25)).join('') + E(0, 19.4, 3.2, 2.2, d) + E(0, 19.4, 1.8, 1.1, '#ffb070', 'opacity=".8"') + glow(0, 20, 1.6, '#ffb070', 0.35) + [-1, 1].map((sd) => P(`M${sd * 1.4} 4 L${sd * 6} 10 L${sd * 5.4} 10.6 L${sd * 1.2} 6Z`, d)).join('')
    + E(0, 2.6, 26, 4, '#8a7e78') + E(0, 1.8, 26, 3.4, c, `stroke="${d}" stroke-width=".25"`) + E(0, 1.2, 22, 2.4, '#ffffff', 'opacity=".4"') + E(0, 2.4, 25, 2.6, 'none', `stroke="${d}" stroke-width=".2"`)
    + Array.from({ length: 30 }, (_, k) => { const t = k / 29; const px = -24 + t * 48; return C(px, 3 + Math.sin(t * Math.PI) * 1, 0.22, '#ffe0a0', 'opacity=".95"'); }).join('')
    + Array.from({ length: 14 }, (_, k) => { const an = (k / 14) * Math.PI; const px = Math.cos(an) * 25; return R(px - 1, 1.6 + Math.sin(an) * 2.6, 2, 0.8, d, 'opacity=".7"'); }).join('')
    + [[-20, -1.5, 2.4, 3], [-16, -3, 2.6, 4.5], [-11.5, -5, 3, 7], [-7, -8, 3, 10], [-3, -12, 3, 14], [1, -15, 2.6, 17], [4.6, -11, 3, 13], [8.4, -7, 3, 9], [12, -4.6, 3, 6.6], [16, -2.6, 2.6, 4.6], [20, -1, 2.2, 3], [-9, -4, 2, 6], [6.6, -13, 1.6, 15]].map(([tx, ty, w, h]) => R(tx, ty, w, h + 1.4, c, `stroke="${d}" stroke-width=".2"`) + R(tx + w * 0.6, ty, w * 0.4, h + 1.4, d, 'opacity=".45"') + Array.from({ length: Math.max(1, Math.floor(h / 1.4)) }, (_, m) => R(tx + 0.35, ty + 0.7 + m * 1.4, w * 0.5, 0.32, '#ffd890', 'opacity=".8"')).join('') + E(tx + w / 2, ty, w / 2, 0.6, '#f8f4ee', `stroke="${d}" stroke-width=".15"`) + (h > 9 ? L(tx + w / 2, ty, tx + w / 2, ty - 2.4, d, 0.2) + C(tx + w / 2, ty - 2.4, 0.25, '#ff6a4a') : '')).join('')
    + E(0, -0.2, 13, 1.6, c, `stroke="${d}" stroke-width=".2"`) + [-22, 22].map((px) => E(px, 1.4, 3, 0.9, '#d8d0ca', `stroke="${d}" stroke-width=".15"`)).join(''));
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
    E(0, 0.2, 3, 0.5, '#000', 'opacity=".25"')
    + P('M-2.2 -5 L-2.4 0 L-0.4 0 L-0.3 -5Z M0.3 -5 L0.4 0 L2.4 0 L2.2 -5Z', '#16161a')
    + P('M-2.3 -1.6 L-2.5 0 L-0.3 0 L-0.4 -1.6Z M0.4 -1.6 L0.3 0 L2.5 0 L2.3 -1.6Z', '#eef0f2', 'stroke="#3a3a40" stroke-width=".12"')
    + P('M-2.2 -2.6 L-2.2 -1.7 L-0.4 -1.7 L-0.4 -2.6Z M0.4 -2.6 L0.4 -1.7 L2.2 -1.7 L2.2 -2.6Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".12"') + E(-1.3, -3.1, 0.7, 0.45, '#e8eaee', 'stroke="#3a3a40" stroke-width=".1"') + E(1.3, -3.1, 0.7, 0.45, '#e8eaee', 'stroke="#3a3a40" stroke-width=".1"')
    + P('M-2.3 -5.4 L-2.4 -3.6 L-0.4 -3.6 L-0.3 -5.4Z M0.3 -5.4 L0.4 -3.6 L2.4 -3.6 L2.3 -5.4Z', '#f6f8fa', 'stroke="#3a3a40" stroke-width=".12"') + P('M2.4 -5 L2.9 -4.8 L2.8 -3.6 L2.3 -3.8Z', '#2a2a30')
    + R(-2.5, -6.1, 5, 0.75, '#f2f4f6', 'stroke="#3a3a40" stroke-width=".12"') + [-1.9, -1.1, -0.3, 0.5, 1.3].map((bx) => R(bx, -6, 0.6, 0.55, '#c8ccd2', 'stroke="#3a3a40" stroke-width=".08"')).join('')
    + P('M-2.4 -6.1 L-2.6 -9.8 L2.6 -9.8 L2.4 -6.1Z', '#16161a')
    + P('M-1.9 -6.4 L-2 -7.6 L2 -7.6 L1.9 -6.4Z', '#f2f4f6', 'stroke="#3a3a40" stroke-width=".1"') + L(-1.9, -7, 1.9, -7, '#a8aeb6', 0.1)
    + P('M-2.2 -7.8 L-2.4 -9.8 C-1.4 -10.3 1.4 -10.3 2.4 -9.8 L2.2 -7.8 C1 -7.5 -1 -7.5 -2.2 -7.8Z', '#f8fafc', 'stroke="#3a3a40" stroke-width=".15"') + P('M-1.6 -9.4 L-0.4 -9 M1.6 -9.4 L0.4 -9 M0 -9.9 L0 -7.7', 'none', 'stroke="#a8aeb6" stroke-width=".12"') + R(-0.7, -8.9, 1.4, 0.7, '#3a3a40', 'rx=".15"') + [-0.4, 0, 0.4].map((px, k) => R(px - 0.12, -8.75, 0.24, 0.35, ['#ff3a2a', '#3a8aff', '#ffcf3a'][k])).join('')
    + P('M-2.6 -9.8 C-3.6 -9.8 -3.8 -8.6 -3.4 -8 L-2.4 -8.4Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".12"') + P('M2.6 -9.8 C3.6 -9.8 3.8 -8.6 3.4 -8 L2.4 -8.4Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".12"')
    + R(-0.5, -10.6, 1, 0.8, '#16161a')
    + P('M-1.9 -11.2 C-2 -14 2 -14 1.9 -11.2 L2 -10.6 C1.4 -10.2 -1.4 -10.2 -2 -10.6Z', '#f8fafc', 'stroke="#3a3a40" stroke-width=".15"') + P('M-1.9 -12 Q0 -12.5 1.9 -12', 'none', 'stroke="#a8aeb6" stroke-width=".12"') + R(-0.14, -13.6, 0.28, 1.5, '#8a929c')
    + P('M-0.25 -11.95 L-1.2 -11.95 L-1.45 -10.95 L-0.55 -11.3Z M0.25 -11.95 L1.2 -11.95 L1.45 -10.95 L0.55 -11.3Z', '#101014') + P('M-0.9 -11.75 L-0.6 -11.75', 'none', 'stroke="#5a6a8a" stroke-width=".12"')
    + P('M-0.8 -10.75 Q0 -11.05 0.8 -10.75 L0.6 -10.25 L-0.6 -10.25Z', '#3a3a44') + P('M-0.45 -10.7 L-0.45 -10.3 M0 -10.8 L0 -10.3 M0.45 -10.7 L0.45 -10.3', 'none', 'stroke="#9a9aa4" stroke-width=".08"') + P('M-1.6 -11 L-1.25 -10.35 M1.6 -11 L1.25 -10.35', 'none', 'stroke="#7a8290" stroke-width=".16"') + C(-1.85, -11.1, 0.18, '#7a8290') + C(1.85, -11.1, 0.18, '#7a8290')
    + (aim ? P('M2.3 -9.4 L3.4 -8.4 L3.1 -7.9 L2.1 -8.6Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".1"') + C(3.5, -7.9, 0.42, '#16161a') + P('M-2.3 -9.2 L-1.4 -7.6 L0.6 -7.8 L0.9 -7.4 L-1.6 -7 L-2.6 -8.6Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".1"') + C(0.8, -7.6, 0.38, '#16161a')
        + R(0.4, -8.4, 5.6, 0.7, '#1a1a1e') + R(1.2, -9, 2, 0.5, '#2a2a30') + R(0.4, -8.1, 0.9, 1.4, '#1a1a1e') + L(6, -8.05, 6.8, -8.05, '#3a3a40', 0.35) + [2, 3, 4, 5].map((px) => C(px, -8.05, 0.12, '#4a4a52')).join('')
      : P('M2.3 -9.4 L2.8 -6.6 L2.3 -6.4 L2 -9Z', '#f4f6f8', 'stroke="#3a3a40" stroke-width=".1"') + C(2.6, -6.2, 0.38, '#16161a') + L(1.2, -9.4, 3.6, -3.4, '#1a1a1e', 0.65)));
  // Lando Calrissian: dark trousers and boots, the blue shirt with its gold
  // trim and belt, the long blue cape with its pale lining over one
  // shoulder, the moustache and smile, one hand out in welcome.
  const lando = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 0.2, 4, 0.5, '#000', 'opacity=".25"')
    + P('M-2.6 -10 C-4.4 -8 -5.8 -4 -6.2 -0.4 L-4 -0.8 L-3.2 0 L-1.8 -0.6 L-1.4 -9.6Z', '#1e3c7a', 'stroke="#0e1e4a" stroke-width=".2"') + P('M-2.4 -9.6 C-3.8 -7.6 -4.8 -4 -5 -1', 'none', 'stroke="#8ab0e0" stroke-width=".5" opacity=".7"') + P('M-6.2 -0.4 L-4 -0.8 L-3.2 0 L-1.8 -0.6', 'none', 'stroke="#d8c890" stroke-width=".25"')
    + R(-2, -1.4, 1.7, 1.6, '#2a1a10', 'rx=".3"') + R(0.3, -1.4, 1.7, 1.6, '#2a1a10', 'rx=".3"') + P('M-1.9 -1.2 L-2.1 -5 L2.1 -5 L1.9 -1.2Z', '#2a2638') + L(-1.6, -4.8, -1.7, -1.4, '#c8a040', 0.18) + L(1.6, -4.8, 1.7, -1.4, '#c8a040', 0.18) + L(0, -4.8, 0, -1.4, '#1a1628', 0.25)
    + P('M-2.3 -4.8 L-2.6 -9.4 C-2.6 -10.2 2.6 -10.2 2.6 -9.4 L2.3 -4.8Z', '#4a7ac8', 'stroke="#1a2e5a" stroke-width=".2"') + P('M-0.9 -9.9 L0 -8.2 L0.9 -9.9', 'none', 'stroke="#d8b860" stroke-width=".3"') + P('M-0.9 -9.9 L-0.4 -6 M0.9 -9.9 L0.4 -6', 'none', 'stroke="#d8b860" stroke-width=".22"') + P('M-2.3 -7.4 L2.3 -7.4', 'none', 'stroke="#d8b860" stroke-width=".18"') + P('M-1.8 -8.6 L-1 -8.6 M1 -8.6 L1.8 -8.6', 'none', 'stroke="#2a4a8a" stroke-width=".25"')
    + R(-2.4, -5.4, 4.8, 0.65, '#3a2a1a') + R(-0.45, -5.5, 0.9, 0.85, '#e8c870', 'stroke="#8a6a20" stroke-width=".08"') + R(1.6, -5, 0.8, 1.6, '#2a2a2e', 'rx=".2"')
    + P('M-2.6 -9.6 C-1.6 -11 1.8 -11 3 -9.6 L2.2 -9 C1 -9.8 -1.2 -9.8 -2 -9Z', '#1e3c7a', 'stroke="#0e1e4a" stroke-width=".15"') + P('M2.4 -9.2 C3.6 -8.6 4 -7.4 3.8 -6 L3 -6.4 C3 -7.4 2.6 -8.2 2 -8.6Z', '#2a4a8a')
    + P('M2.2 -9 L4.2 -7.8 L4.8 -7 L4.4 -6.6 L3.8 -7.2 L2 -8Z', '#4a7ac8') + C(4.9, -6.8, 0.5, '#7a4a2e') + P('M5.2 -7.2 L5.6 -7.6 M5.3 -6.8 L5.8 -7', 'none', 'stroke="#7a4a2e" stroke-width=".25"')
    + R(-0.5, -10.7, 1, 0.9, '#7a4a2e') + E(0, -11.6, 1.45, 1.6, '#8a5a3a') + P('M-1.5 -12 C-1.7 -13.8 1.7 -13.8 1.5 -12 L1.3 -12.5 C0.6 -12.9 -0.6 -12.9 -1.3 -12.5Z', '#1a120c') + E(-1.45, -11.6, 0.25, 0.45, '#7a4a2e') + E(1.45, -11.6, 0.25, 0.45, '#7a4a2e')
    + P('M-0.7 -12.3 L-0.25 -12.2 M0.7 -12.3 L0.25 -12.2', 'none', 'stroke="#1a120c" stroke-width=".2"') + C(-0.48, -11.9, 0.14, '#1a120c') + C(0.48, -11.9, 0.14, '#1a120c') + C(-0.44, -11.94, 0.04, '#ffffff') + P('M-0.12 -11.6 L-0.16 -11.15 L0.14 -11.15', 'none', 'stroke="#6a3a22" stroke-width=".12"')
    + P('M-0.85 -10.85 Q0 -11.25 0.85 -10.85 Q0.5 -10.7 0 -10.75 Q-0.5 -10.7 -0.85 -10.85Z', '#1a120c') + P('M-0.55 -10.55 Q0 -10.3 0.55 -10.55', 'none', 'stroke="#f4ece4" stroke-width=".22"'));
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
  const carbonite = (x, y, s) => {
    const [cg, cd] = LG([[0, '#6a707a'], [0.5, '#4a4e58'], [1, '#2e323a']], 0, 0, 1, 1);
    return g(x, y, s, 1, cd
      + R(-4.4, -15, 8.8, 15, '#2a2e34', 'rx=".7" stroke="#14161a" stroke-width=".3"') + R(-4, -14.6, 8, 14.2, cg, 'rx=".5"') + P('M-4 -14.6 L-1.4 -14.6 L-4 -9.6Z', '#ffffff', 'opacity=".12"') + R(-4.4, -15, 0.6, 15, '#1e2228') + R(3.8, -15, 0.6, 15, '#1e2228')
      + Array.from({ length: 7 }, (_, k) => P(`M${-3.6 + k * 1.2} -14.4 q.3 ${3 + (k % 3)} 0 ${6 + (k % 2) * 3}`, 'none', 'stroke="#5a606a" stroke-width=".1" opacity=".6"')).join('')
      // his body in relief: shoulders, jacket and vest edges, the belt, legs fading into the slab
      + P('M-2.6 -10.2 C-2.6 -10.8 -1.8 -11 -1.2 -10.9 L1.2 -10.9 C1.8 -11 2.6 -10.8 2.6 -10.2 L2.4 -6.2 L1.8 -4.4 L1.6 -1.6 L-1.6 -1.6 L-1.8 -4.4 L-2.4 -6.2Z', '#5e646e', 'stroke="#2a2e34" stroke-width=".2"')
      + P('M-1.2 -10.8 L-0.6 -8 L-0.8 -5.6 M1.2 -10.8 L0.6 -8 L0.8 -5.6', 'none', 'stroke="#3a3e46" stroke-width=".2"') + R(-2.3, -6.3, 4.6, 0.5, '#3e424a') + R(-2.6, -6.2, 0.8, 2, '#3e424a', 'rx=".2"') + P('M0 -4.4 L0 -1.8', 'none', 'stroke="#3e424a" stroke-width=".2"') + P('M-2.4 -6.2 L-2.6 -9.8 M2.4 -6.2 L2.6 -9.8', 'none', 'stroke="#7a808a" stroke-width=".15"')
      // both hands raised in front of him, palms out
      + P('M-2.4 -9.6 C-3.2 -10.4 -3.4 -11.6 -3 -12.4', 'none', 'stroke="#5e646e" stroke-width=".9" stroke-linecap="round"') + P('M2.4 -9.6 C3.1 -10.6 3.2 -11.8 2.8 -12.6', 'none', 'stroke="#5e646e" stroke-width=".9" stroke-linecap="round"')
      + P('M-3.6 -12.4 L-3.5 -13.6 M-3.1 -12.6 L-3.1 -13.9 M-2.7 -12.6 L-2.6 -13.7 M-2.4 -12.3 L-2.1 -13.1', 'none', 'stroke="#646a74" stroke-width=".28" stroke-linecap="round"') + E(-3, -12.3, 0.7, 0.55, '#646a74')
      + P('M2.2 -12.6 L2.1 -13.8 M2.6 -12.8 L2.6 -14.1 M3 -12.8 L3.1 -13.9 M3.3 -12.5 L3.6 -13.3', 'none', 'stroke="#646a74" stroke-width=".28" stroke-linecap="round"') + E(2.8, -12.5, 0.7, 0.55, '#646a74')
      // the face: head thrown back, eyes squeezed shut, mouth open in a shout
      + E(0, -12, 1.25, 1.5, '#666c76', 'stroke="#2a2e34" stroke-width=".18"') + P('M-1.2 -12.6 C-1 -13.8 1 -13.8 1.2 -12.6', 'none', 'stroke="#4a4e58" stroke-width=".35"')
      + P('M-0.75 -12.35 Q-0.45 -12.15 -0.2 -12.35 M0.2 -12.35 Q0.45 -12.15 0.75 -12.35', 'none', 'stroke="#2a2e34" stroke-width=".18"') + P('M-0.8 -12.65 L-0.25 -12.5 M0.8 -12.65 L0.25 -12.5', 'none', 'stroke="#2a2e34" stroke-width=".14"') + L(0, -12.3, 0, -11.7, '#4a4e58', 0.16)
      + E(0, -11.15, 0.42, 0.34, '#1e2228') + P('M-0.6 -11.5 Q-0.75 -11 -0.5 -10.7 M0.6 -11.5 Q0.75 -11 0.5 -10.7', 'none', 'stroke="#4a4e58" stroke-width=".12"') + P('M-1.2 -11.6 Q-1.1 -10.8 -0.4 -10.55 M1.2 -11.6 Q1.1 -10.8 0.4 -10.55', 'none', 'stroke="#7a808a" stroke-width=".1"')
      + P('M-1 -12.5 L-1.2 -11.2 L-0.9 -10.6 M1 -12.5 L1.2 -11.2 L0.9 -10.6', 'none', 'stroke="#7a808a" stroke-width=".12" opacity=".7"')
      // the control panel and its lights
      + R(-3.6, -1.4, 7.2, 1.6, '#2a2e34', 'stroke="#14161a" stroke-width=".15"') + [-3, -2, -1, 0, 1, 2, 3].map((px, k) => R(px - 0.3, -1, 0.6, 0.7, ['#ff3a2a', '#3aff6a', '#ffcf3a', '#3a8aff'][k % 4])).join('') + R(-4.4, -15.6, 8.8, 0.8, '#3a3e46', 'rx=".3"'));
  };
  // ---------- Ships ----------
  // Slave I in flight, the rounded end leading: the dark green hull with its
  // red-brown trim, the two wing pods, the cockpit on its stalk, the cannons.
  // Slave I, flying straight at you the way it flies, upright: the rounded
  // top with the cockpit hood and its framed window, the broad face with its
  // pale centre panel, the dark red lower hull with its vents and stripes,
  // the two great swept fins out of the lower corners with red tips, the
  // twin cannon turrets underneath, weathering streaks, the engine glow.
  const slave1 = (x, y, s, a = 0) => g(x, y, s, 1,
    glow(-9.6, 10.4, 1.6, '#ffb070', 0.4) + glow(9.6, 10.4, 1.6, '#ffb070', 0.4)
    + P('M-5.6 4 C-8.6 6 -11.6 9.6 -13.4 13 L-11.8 13.8 C-10.4 11.6 -8 9.4 -4.6 8.2Z', '#5a6a56', 'stroke="#1a2418" stroke-width=".35"') + P('M5.6 4 C8.6 6 11.6 9.6 13.4 13 L11.8 13.8 C10.4 11.6 8 9.4 4.6 8.2Z', '#4a5a48', 'stroke="#1a2418" stroke-width=".35"')
    + P('M-12.2 11.6 L-13.4 13 L-11.8 13.8 L-10.9 12.4Z M12.2 11.6 L13.4 13 L11.8 13.8 L10.9 12.4Z', '#8a3420') + P('M-6.4 5.4 C-8.6 7.2 -10.6 9.6 -12 12 M6.4 5.4 C8.6 7.2 10.6 9.6 12 12', 'none', 'stroke="#8a9a84" stroke-width=".3"') + P('M-6 6.8 L-9 9.8 M6 6.8 L9 9.8', 'none', 'stroke="#2a3428" stroke-width=".25"')
    + P('M0 -11.4 C5.2 -11.4 8.4 -7.6 9 -1.6 C9.4 2.6 8.8 6 7.2 8.6 L-7.2 8.6 C-8.8 6 -9.4 2.6 -9 -1.6 C-8.4 -7.6 -5.2 -11.4 0 -11.4Z', '#4e6650', 'stroke="#1a2418" stroke-width=".45"')
    + P('M0 -10.4 C3.4 -10.4 5.6 -7.2 6 -2.4 L5.4 1.6 L-5.4 1.6 L-6 -2.4 C-5.6 -7.2 -3.4 -10.4 0 -10.4Z', '#7a8a72', 'stroke="#3a4836" stroke-width=".2"') + P('M-4.4 -6 L4.4 -6 M-5.4 -2 L5.4 -2 M0 -10.4 L0 1.6', 'none', 'stroke="#5a6a54" stroke-width=".15"')
    + P('M-8.9 1.6 C-9 4 -8.6 6.4 -7.2 8.6 L7.2 8.6 C8.6 6.4 9 4 8.9 1.6Z', '#7a3020', 'stroke="#3a1408" stroke-width=".25"') + Array.from({ length: 9 }, (_, k) => R(-5.4 + k * 1.2, 3, 0.7, 3.4, '#4a1a10', 'rx=".2"')).join('') + P('M-8.6 2.4 L8.6 2.4', 'none', 'stroke="#a84a30" stroke-width=".35"')
    + P('M4 -10 C7 -8 8.6 -4 8.8 0 L8.9 1.6 L5.4 1.6 L6 -2.4 C5.6 -7.2 4.6 -9 4 -10Z', '#2e4430', 'opacity=".6"')
    + [[-7.6, -2, 1.4, 2.6], [6.4, -4, 1.4, 2], [-6.6, -6.4, 1.2, 1.6], [3, 3.4, 2, 1.2]].map(([px, py, w, h]) => R(px, py, w, h, '#9a9a6a', 'opacity=".5"')).join('') + [[-3, -5, 4.6], [2.6, -3, 4], [-1, 3, 3.4], [5, 0, 3]].map(([px, py, l]) => P(`M${px} ${py} q.3 ${l * 0.5} -.1 ${l}`, 'none', 'stroke="#2a3428" stroke-width=".3" opacity=".55"')).join('')
    + P('M-3.4 -9.4 C-2.4 -11.6 2.4 -11.6 3.4 -9.4 L3 -6.8 C1.6 -6.2 -1.6 -6.2 -3 -6.8Z', '#6a7a64', 'stroke="#1a2418" stroke-width=".3"') + P('M-2.6 -9.2 C-1.6 -10.6 1.6 -10.6 2.6 -9.2 L2.4 -7.6 C1.2 -7.2 -1.2 -7.2 -2.4 -7.6Z', '#16202a') + L(-0.9, -10.2, -1, -7.4, '#6a7a64', 0.25) + L(0.9, -10.2, 1, -7.4, '#6a7a64', 0.25) + P('M-2 -9 L-1.2 -9.8', 'none', 'stroke="#8ab0d0" stroke-width=".3"')
    + C(-7.6, -5.6, 0.35, '#ff5a3a') + C(7.6, -5.6, 0.35, '#3aff6a')
    + R(-4, 8.4, 3, 1.6, '#2a2a2a', 'rx=".4"') + R(1, 8.4, 3, 1.6, '#2a2a2a', 'rx=".4"') + [-3.2, -1.8, 1.8, 3.2].map((px) => R(px - 0.25, 9.8, 0.5, 1.8, '#141414')).join(''), a);
  // The Hound's Tooth: Bossk's long boxy freighter, nose left, cockpit tower
  // on top at the front, white hull with red stripes, the engine bank.
  // The Hound's Tooth: Bossk's YV-666 freighter side-on, nose left. The long
  // boxy hull in white and grey with rust-red trim, the raised bridge deck
  // on top at the front with its window row, the stubby chin, the dorsal
  // fin and sensor mast, cargo hatches and plating, and the four big
  // engines glowing at the back.
  const hounds = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M-20 0 L-17 -4.4 L-6 -5.2 L16 -5.2 L19 -3.4 L19 4 L16 5 L-14 5 L-19 3Z', '#d4d0c6', 'stroke="#4a463e" stroke-width=".4"') + P('M-20 0 L-17 -4.4 L-6 -5.2 L16 -5.2 L19 -3.4 L-18 -0.6Z', '#f0ece4', 'opacity=".6"') + P('M-19 3 L-14 5 L16 5 L19 4 L19 2.6 L-18.6 1.6Z', '#a8a49a')
    + R(-16, -0.4, 34, 1.2, '#9a2a1c') + R(-16, 0.8, 34, 0.4, '#5a1a10') + [-12, -6, 0, 6, 12].map((px) => L(px, -5.2, px, 5, '#a8a49a', 0.25)).join('') + [[-10, 1.8, 4, 2], [-3, 1.8, 5, 2], [5, 1.8, 4, 2], [11, 1.8, 3, 2]].map(([px, py, w, h]) => R(px, py, w, h, '#8a867c', 'stroke="#4a463e" stroke-width=".15"')).join('') + [-14, -8, -2, 4, 10].map((px) => R(px, -3.6, 2, 1, '#2a3a4a', 'opacity=".7"')).join('')
    + P('M-17 -4.4 L-15 -9 L-4 -9.6 L-2 -5.2Z', '#c4c0b6', 'stroke="#4a463e" stroke-width=".35"') + R(-15.4, -8.4, 11, 1.6, '#1a2a3a', 'rx=".3"') + [-13, -10.4, -7.8].map((px) => L(px, -8.4, px - 0.2, -6.8, '#c4c0b6', 0.3)).join('') + P('M-15.4 -8.4 L-14.6 -8.4', 'none', 'stroke="#8ab0d0" stroke-width=".3"') + R(-12, -10.4, 5, 0.8, '#9a2a1c')
    + L(-6, -9.6, -5, -12.6, '#4a463e', 0.35) + C(-5, -12.8, 0.4, '#ff5a3a') + P('M8 -5.2 L12 -9 L14 -9 L13 -5.2Z', '#c4c0b6', 'stroke="#4a463e" stroke-width=".3"') + P('M-20 0 L-22 0.8 L-20 1.6', 'none', 'stroke="#4a463e" stroke-width=".4"') + R(-22.6, 0.4, 1.4, 0.8, '#2a2a2a')
    + R(18.6, -4.6, 2.4, 9.6, '#6a665e', 'stroke="#3a362e" stroke-width=".2"') + [-3, -0.6, 1.8, 4].map((yy) => glow(21.6, yy, 1, '#ff9a4a', 0.5) + E(21.4, yy, 0.6, 0.9, '#ffd8a8')).join(''), a);
  // A twin-pod cloud car: two rounded orange pods side by side on a short
  // spar, cockpit glazing, the engine at the back of each pod.
  const cloudCar = (x, y, s, a = 0) => {
    const pod = (ox, oy, c, d) => P(`M${ox - 7} ${oy - 1.4} C${ox - 7} ${oy - 2.6} ${ox - 5} ${oy - 3} ${ox} ${oy - 3} C${ox + 4} ${oy - 3} ${ox + 6.4} ${oy - 2} ${ox + 7} ${oy} C${ox + 6.4} ${oy + 2} ${ox + 4} ${oy + 3} ${ox} ${oy + 3} C${ox - 5} ${oy + 3} ${ox - 7} ${oy + 2.6} ${ox - 7} ${oy + 1.4}Z`, c, `stroke="${d}" stroke-width=".3"`)
      + P(`M${ox + 1.6} ${oy - 2.7} C${ox + 4.4} ${oy - 2.6} ${ox + 6.2} ${oy - 1.4} ${ox + 6.7} ${oy} L${ox + 1.6} ${oy}Z`, '#1a2a3a') + L(ox + 3.6, oy - 2.4, ox + 3.6, oy, '#c8582e', 0.2) + P(`M${ox + 2.4} ${oy - 2.2} Q${ox + 4} ${oy - 2} ${ox + 5} ${oy - 1.2}`, 'none', 'stroke="#8ab0d0" stroke-width=".3"')
      + P(`M${ox - 6} ${oy - 0.4} L${ox + 1} ${oy - 0.4}`, 'none', `stroke="${d}" stroke-width=".5"`) + [-4, -2, 0].map((px) => L(ox + px, oy - 2.9, ox + px, oy + 2.9, d, 0.15)).join('')
      + R(ox - 8.2, oy - 1.2, 1.4, 2.4, '#4a3a30', 'rx=".3"') + glow(ox - 8.6, oy, 0.7, '#ffb070', 0.55) + C(ox - 8.4, oy, 0.4, '#ffe0b0');
    return g(x, y, s, 1, pod(1.8, -2.6, '#a84a28', '#5a2010') + P('M-3 -2 L3 -2 L4 1 L-4 1Z', '#6a3a2a') + P('M-5 -3.6 L-6.4 -7 L-4.8 -7 L-3 -3Z', '#a84a28', 'stroke="#5a2010" stroke-width=".25"') + pod(0, 0, '#d8643a', '#6a2a14') + P('M-6 -2.4 L-7.8 -5.6 L-6 -5.6 L-4.2 -2.6Z', '#d8643a', 'stroke="#6a2a14" stroke-width=".25"'), a);
  };
  // A TIE fighter, three-quarter view: the two big hexagonal wings seen at an
  // angle with their frames, spokes and dark solar panels, the pylons, and
  // the ball cockpit with its spoked window and twin cannons below it.
  const tie = (x, y, s, a = 0, fire = false) => {
    const wing = (cx, sx) => { const pts = Array.from({ length: 6 }, (_, k) => { const an = (k / 6) * Math.PI * 2 + Math.PI / 6; return [cx + Math.cos(an) * 6 * sx, Math.sin(an) * 9.4]; }); const path = `M${pts.map((q) => q.join(' ')).join(' L')}Z`; const inner = pts.map(([px, py]) => [cx + (px - cx) * 0.86, py * 0.88]); return P(path, '#1e2026', 'stroke="#0a0a0e" stroke-width=".4"') + P(`M${inner.map((q) => q.join(' ')).join(' L')}Z`, '#2c3038') + pts.map(([px, py]) => L(cx, 0, px, py, '#4a4e58', 0.3)).join('') + Array.from({ length: 6 }, (_, k) => { const [p1, p2] = [inner[k], inner[(k + 1) % 6]]; return P(`M${cx} 0 L${p1.join(' ')} L${p2.join(' ')}Z`, k % 2 ? '#262a32' : '#30343c', 'opacity=".9"'); }).join('') + C(cx, 0, 1.4 * Math.abs(sx), '#3a3e46', 'stroke="#14161a" stroke-width=".2"'); };
    return g(x, y, s, 1,
      wing(-8, 0.55) + R(-8, -0.8, 5, 1.6, '#4a4e58', 'stroke="#1a1c22" stroke-width=".2"') + R(-5.4, -1.1, 1.2, 2.2, '#3a3e46')
      + C(0, 0, 3.4, '#6a707a', 'stroke="#2a2e36" stroke-width=".3"') + P('M2.4 -2.4 A3.4 3.4 0 0 1 -2.4 2.4 A3.6 3.6 0 0 0 2.4 -2.4Z', '#3e434c', 'opacity=".7"') + C(0, 0, 2.4, '#3a3e46')
      + C(0, 0, 1.9, '#0c1016') + Array.from({ length: 8 }, (_, k) => { const an = (k / 8) * Math.PI * 2; return L((Math.cos(an) * 0.5).toFixed(2), (Math.sin(an) * 0.5).toFixed(2), (Math.cos(an) * 1.9).toFixed(2), (Math.sin(an) * 1.9).toFixed(2), '#8a909a', 0.2); }).join('') + C(0, 0, 0.5, '#8a909a') + P('M-2.6 -1 A2.8 2.8 0 0 1 -1 -2.6', 'none', 'stroke="#c8ccd4" stroke-width=".35" opacity=".7"')
      + R(-1.4, 2.8, 0.8, 1, '#2a2e36') + R(0.6, 2.8, 0.8, 1, '#2a2e36') + (fire ? glow(-1, 4.2, 0.6, '#5aff6a', 0.7) + glow(1, 4.2, 0.6, '#5aff6a', 0.7) : '')
      + R(3, -0.8, 5, 1.6, '#4a4e58', 'stroke="#1a1c22" stroke-width=".2"') + R(4.2, -1.1, 1.2, 2.2, '#3a3e46') + wing(8, 0.55), a);
  };
  // A TIE Bomber side-on: the twin pods between the bent hexagonal wings.
  const tieBomber = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M-5 -9 L-3 -10 L-2 -2 L-3 10 L-5 9 L-4 0Z M5 -9 L3 -10 L2 -2 L3 10 L5 9 L4 0Z', '#2c3038', 'stroke="#0e1014" stroke-width=".3"') + [-1, 1].map((sd) => P(`M${sd * 3} -10 L${sd * 2} -2 L${sd * 3} 10 M${sd * 4.6} -8 L${sd * 3.4} 0 L${sd * 4.6} 8`, 'none', 'stroke="#4a4e58" stroke-width=".22"')).join('')
    + R(-3, -2.6, 6, 1.2, '#4a4e56') + E(0, -3.6, 2.4, 1.9, '#6a6e76', 'stroke="#2a2e36" stroke-width=".25"') + C(0, -3.6, 1, '#0c1016') + L(-0.8, -3.6, 0.8, -3.6, '#6a6e76', 0.15) + E(0, 2, 2.4, 2.8, '#5a5e66', 'stroke="#2a2e36" stroke-width=".25"') + [1, 2.2, 3.4].map((yy) => L(-1.8, yy, 1.8, yy, '#3a3e46', 0.2)).join(''), a);
  // The Millennium Falcon on the landing pad, seen from the front and above:
  // the saucer with its plating rings and panels, the mandibles pointing at
  // you, the cockpit tube on the near side, the dish and turret, landing legs,
  // the ramp down with its light, the blue engine glow at the back.
  const falcon34 = (x, y, s) => g(x, y, s, 1,
    E(0, 9.4, 28, 3.4, '#000', 'opacity=".3"') + [[-14, 5], [-4, 7.4], [10, 6.4], [18, 3.6], [-20, 2]].map(([px, py]) => L(px, py, px, py + 3, '#4a4a50', 0.9) + E(px, py + 3, 1.6, 0.5, '#3a3a40')).join('')
    + P('M-6 6 L2 6 L4 10 L-8 10Z', '#a8a49a', 'stroke="#5e5a52" stroke-width=".3"') + glow(-2, 8, 2, '#ffe8b0', 0.35)
    + E(0, 1.6, 26, 8.4, '#8a867c', 'stroke="#4e4a42" stroke-width=".4"') + E(0, 0, 26, 8, '#d2cec4', 'stroke="#5e5a52" stroke-width=".4"') + E(0, -0.6, 24, 6.8, '#e6e2d8', 'opacity=".5"')
    + E(0, 0, 18, 5.6, 'none', 'stroke="#9a968c" stroke-width=".3"') + E(0, 0, 10, 3.2, 'none', 'stroke="#9a968c" stroke-width=".3"') + Array.from({ length: 18 }, (_, k) => { const an = (k / 18) * Math.PI * 2; return L((Math.cos(an) * 10).toFixed(2), (Math.sin(an) * 3.2).toFixed(2), (Math.cos(an) * 25).toFixed(2), (Math.sin(an) * 7.7).toFixed(2), '#a8a49a', 0.22); }).join('')
    + [[-14, -2, 6, 1.6], [8, -3.6, 5, 1.4], [-4, 3.4, 5, 1.2], [12, 1.6, 6, 1.4], [-18, 2, 4, 1.2]].map(([px, py, w, h]) => R(px, py, w, h, '#8a867c', 'opacity=".7"')).join('')
    + P('M-22 -2.4 L-36 0.4 L-36 2.6 L-23 1.2Z M-22 3 L-35 5.6 L-34 7.4 L-21 5Z', '#cdc9bf', 'stroke="#5e5a52" stroke-width=".35"') + P('M-24 1.6 L-34 3.6 L-34 5 L-23 2.8Z', '#4a4a4a', 'opacity=".6"') + L(-24, 0, -34, 1.6, '#8a867c', 0.25) + L(-24, 4.4, -33, 6.4, '#8a867c', 0.25)
    + P('M-6 5.6 L-20 8 L-20.6 10 L-6 7.6Z', '#c8c4ba', 'stroke="#5e5a52" stroke-width=".3"') + C(-21.4, 9, 1.8, '#bab6ac', 'stroke="#5e5a52" stroke-width=".3"') + P('M-22.8 8.2 Q-21.6 7.2 -20.2 8.2', 'none', 'stroke="#1a2a3a" stroke-width=".7"') + [-10, -14, -18].map((px) => L(px, 6.2, px, 8, '#8a867c', 0.2)).join('')
    + E(0, -0.6, 3.4, 1.2, '#bab6ac', 'stroke="#5e5a52" stroke-width=".25"') + E(0, -1, 1.6, 0.6, '#3a4a5a') + P('M1 -1.2 L4 -2.6 M1.2 -0.8 L4.2 -2', 'none', 'stroke="#3a3a40" stroke-width=".3"')
    + L(9, -2, 9.6, -5, '#5e5a52', 0.35) + E(10, -5.4, 2.6, 1, '#e2ded4', 'stroke="#5e5a52" stroke-width=".25"')
    + P('M20 -4.6 A26 8 0 0 1 25.6 1.4', 'none', 'stroke="#8ad8ff" stroke-width="1.2"') + glow(24, -1.4, 2.2, '#8ad8ff', 0.35));
  // A slim white Cloud City tower with lit window bands and a dome cap.
  const tower = (x, y, w, h, c = '#ece6e0', d = '#a89c96') => R(x, y, w, h, c, `stroke="${d}" stroke-width=".35"`) + R(x + w * 0.62, y, w * 0.38, h, d, 'opacity=".5"') + Array.from({ length: Math.floor(h / 4.6) }, (_, m) => R(x + w * 0.1, y + 3 + m * 4.6, w * 0.52, 1.1, '#ffd8a0', 'opacity=".8"') + L(x, y + 5.2 + m * 4.6, x + w, y + 5.2 + m * 4.6, d, 0.25)).join('') + E(x + w / 2, y, w / 2, 1.8, '#f6f2ec', `stroke="${d}" stroke-width=".3"`) + E(x + w / 2, y - 1, w * 0.3, 1.2, '#f6f2ec', `stroke="${d}" stroke-width=".25"`) + L(x + w / 2, y - 2, x + w / 2, y - 5, d, 0.3) + C(x + w / 2, y - 5, 0.4, '#ff6a4a');
  const sunsetSky = (s1 = '#5a3a6a') => fill([[0, s1], [0.35, '#d86a5a'], [0.65, '#f8b070'], [1, '#ffe0a8']]);

  const B = {
    // 1 · Cloud City Approach (fleet): sunset over Bespin, close in on Cloud
    // City: the great saucer filling the right of the view with its rim of
    // lights, the forest of towers with lit windows and beacons, the stalk
    // dropping into the cloud. Slave I dives in out of the haze with two TIE
    // fighters on its wings, its cannons raking the city; city cloud cars
    // climb to meet it.
    cloud_city_approach: () => sunsetSky()
      + C(30, 22, 8, '#fff0c8', 'opacity=".9"') + glow(30, 22, 7, '#ffe0a0', 0.3)
      + E(60, 14, 50, 3, '#f8a888', 'opacity=".5"') + E(130, 10, 40, 2.4, '#e88878', 'opacity=".45"') + E(20, 40, 30, 2, '#ffc8a0', 'opacity=".4"')
      + clouds(70, '#ffd8b0', '#e8a080', 0.6, 1, 10, 0.8) + cloudCity(116, 46, 2.2)
      + cloudCar(84, 66, 0.9, -24) + cloudCar(96, 72, 0.7, -20) + bolt(89, 63, 70, 48, '#ff4a2a')
      + clouds(78, '#ffe8c8', '#f0b090', 1, 3, 10, 1.1)
      + (kit.tie ? kit.tie(16, 20, 1.6) + kit.tie(26, 54, 1.3) : '') + bolt(24, 21, 40, 24, '#3aff6a') + bolt(33, 53, 46, 48, '#3aff6a')
      + slave1(54, 30, 1.05, -4) + bolt(52.6, 42.6, 84, 44, '#ff4a2a') + bolt(56, 42.4, 90, 40, '#ff4a2a') + glow(90, 40, 2, '#ffb070', 0.5) + glow(84, 44, 1.6, '#ffb070', 0.4)
      + clouds(88, '#fff0d8', '#f4c0a0', 1, 5, 10, 1.3),

    // 2 · Wing Guard Patrol: high on Cloud City's walkways at sunset. Domed
    // white towers and arches all around, a second bridge crossing behind,
    // lamp posts along the railing, cloud cars on patrol, the cloud sea far
    // below; three Wing Guards walk the span with their rifles.
    wing_guard_patrol: () => sunsetSky('#6a4a7a')
      + C(130, 30, 7, '#fff0c8', 'opacity=".85"') + glow(130, 30, 6, '#ffe0a0', 0.3)
      + clouds(58, '#ffd8b8', '#e8a888', 0.8, 2, 10, 0.8) + clouds(70, '#ffe8c8', '#f0b898', 1, 4, 10, 1)
      + tower(32, 18, 8, 50) + tower(100, 22, 9, 46) + tower(116, 30, 6, 38) + tower(60, 30, 5, 36)
      + P('M20 40 Q80 34 150 40 L150 42 Q80 36 20 42Z', '#d8d0ca', 'stroke="#9a8e88" stroke-width=".3"') + Array.from({ length: 13 }, (_, k) => L(20 + k * 10.8, 40 - Math.sin((k / 12) * Math.PI) * 3, 20 + k * 10.8, 37 - Math.sin((k / 12) * Math.PI) * 3, '#c8beb6', 0.3)).join('')
      + [[46, 44, 10], [86, 44, 12]].map(([x, y, w]) => P(`M${x - w} ${y + 14} L${x - w} ${y + 4} C${x - w} ${y - 4} ${x + w} ${y - 4} ${x + w} ${y + 4} L${x + w} ${y + 14} L${x + w * 0.7} ${y + 14} L${x + w * 0.7} ${y + 4} C${x + w * 0.7} ${y - 1.6} ${x - w * 0.7} ${y - 1.6} ${x - w * 0.7} ${y + 4} L${x - w * 0.7} ${y + 14}Z`, '#e8e2dc', 'stroke="#a89c96" stroke-width=".3"')).join('')
      + tower(4, 8, 16, 62) + tower(140, 4, 20, 66) + cloudCar(124, 26, 1.1, -6) + cloudCar(70, 22, 0.7, -4)
      + P('M0 66 Q80 58 160 66 L160 72 Q80 64 0 72Z', '#e4dcd6', 'stroke="#9a8e88" stroke-width=".4"') + P('M0 72 Q80 64 160 72 L160 76 Q80 68 0 76Z', '#a89c96')
      + P('M0 58 Q80 50 160 58', 'none', 'stroke="#c8beb6" stroke-width=".8"') + Array.from({ length: 21 }, (_, k) => { const x = k * 8; const yt = 58 - Math.sin((x / 160) * Math.PI) * 8; return L(x, yt, x, yt + 8, '#c8beb6', 0.5); }).join('')
      + [16, 64, 96, 144].map((x) => { const yt = 58 - Math.sin((x / 160) * Math.PI) * 8; return L(x, yt + 8, x, yt - 6, '#8a7e78', 0.6) + E(x, yt - 6.6, 1.2, 0.8, '#fff0c8') + glow(x, yt - 6.6, 1.2, '#ffe0a0', 0.4); }).join('')
      + wingGuard(46, 66, 2.8, 1) + wingGuard(78, 63.6, 3, 1, true) + wingGuard(112, 64.8, 2.8, -1)
      + P('M0 60 Q80 52 160 60', 'none', 'stroke="#ffffff" stroke-width=".5" opacity=".6"') + P('M0 76 Q80 68 160 76 L160 90 L0 90Z', '#9a8e88') + Array.from({ length: 12 }, (_, k) => { const x = k * 14 + 4; return E(x, 82 - Math.sin((x / 160) * Math.PI) * 6, 3, 1.4, '#ffd8a0', 'opacity=".55"'); }).join(''),

    // 3 · Tibanna Refinery: deep under the city. Rows of spherical Tibanna
    // tanks fading into the haze, gantry cranes and scaffolding, pipe runs
    // with red valves, glowing gas vents and warning lights; stormtroopers
    // and a Wing Guard holding the catwalk while an Ugnaught works the console.
    tibanna_refinery: () => fill([[0, '#3a2a30'], [0.5, '#7a4a3a'], [1, '#2a1e1e']])
      + E(80, 40, 80, 30, '#ff8a4a', 'opacity=".12"')
      + [[10, 24, 7], [40, 20, 8], [120, 20, 8], [150, 24, 7]].map(([x, y, r]) => C(x, y, r, '#5a4a48', 'opacity=".6"') + R(x - 1, y + r, 2, 20, '#4a3a38', 'opacity=".6"')).join('')
      + P('M0 12 L160 12 M0 14 L160 14', 'none', 'stroke="#4a3a34" stroke-width="1"') + [20, 60, 100, 140].map((x) => P(`M${x} 12 L${x} 40 M${x - 4} 12 L${x + 4} 20 M${x + 4} 12 L${x - 4} 20`, 'none', 'stroke="#4a3a34" stroke-width=".6"')).join('') + P('M50 12 L50 18 L56 18', 'none', 'stroke="#5a4a42" stroke-width=".8"') + R(54, 18, 4, 3, '#5a4a42')
      + [[26, 36, 14], [80, 30, 18], [134, 36, 14]].map(([x, y, r]) => { const [tg, td] = LG([[0, '#d8ccc0'], [0.6, '#8a7e76'], [1, '#4a403c']], 0.2, 0.2, 0.8, 1); return td + C(x, y, r, tg, 'stroke="#3a302c" stroke-width=".5"') + P(`M${x - r} ${y} Q${x} ${y + r * 0.3} ${x + r} ${y}`, 'none', 'stroke="#5a504a" stroke-width=".6"') + P(`M${x} ${y - r} Q${x + r * 0.3} ${y} ${x} ${y + r}`, 'none', 'stroke="#5a504a" stroke-width=".4"') + Array.from({ length: 8 }, (_, k) => { const an = (k / 8) * Math.PI * 2; return C(x + Math.cos(an) * r * 0.98, y + Math.sin(an) * r * 0.98, 0.3, '#3a302c'); }).join('') + C(x - r * 0.4, y - r * 0.4, r * 0.18, '#ffffff', 'opacity=".25"') + R(x - 2, y + r - 1, 4, 30, '#3a302c') + [-1, 1].map((sd) => L(x + sd * r * 0.7, y + r * 0.6, x + sd * r * 0.9, y + 40, '#3a302c', 1.2)).join('') + R(x - 3, y - r - 2, 6, 2.4, '#4a3e38') + C(x, y - r - 2.6, 0.6, '#ff3a2a'); }).join('')
      + P('M26 50 C36 52 50 52 62 48 M98 48 C110 52 124 52 134 50 M44 56 L116 56', 'none', 'stroke="#5a4a42" stroke-width="1.6"') + [[36, 51.6], [124, 51.6], [62, 56], [98, 56]].map(([x, y]) => C(x, y, 1.2, '#8a3a2a', 'stroke="#2a1a14" stroke-width=".3"') + L(x, y - 1.2, x, y - 2.4, '#2a1a14', 0.4)).join('')
      + [[52, 44], [108, 44], [12, 56], [148, 56]].map(([x, y]) => glow(x, y, 3, '#ffb060', 0.4) + steam(x, y, 18, 0.5, '#ffd0a0')).join('')
      + P('M0 62 L160 62', 'none', 'stroke="#6a5a52" stroke-width=".7"') + Array.from({ length: 17 }, (_, k) => L(k * 10, 62, k * 10, 66, '#6a5a52', 0.45)).join('') + P('M0 66 L160 66 L160 70 L0 70Z', '#4a3e38') + Array.from({ length: 16 }, (_, k) => P(`M${k * 10} 66 l5 0 l-1.6 4 l-5 0Z`, '#ffcf3a', 'opacity=".25"')).join('')
      + R(6, 54, 11, 8, '#3a302c', 'stroke="#6a5a52" stroke-width=".4"') + R(7, 55, 9, 3, '#5ad8ff', 'opacity=".6"') + [8, 10, 12, 14].map((px, k) => R(px, 59, 1, 0.8, ['#ff3a2a', '#3aff6a', '#ffcf3a', '#3a8aff'][k])).join('') + ugnaught(20, 66, 2, -1)
      + trooper(42, 66, 2.5, 1) + trooper(70, 67, 2.6, 1) + wingGuard(98, 66, 2.6, -1, true) + trooper(128, 67, 2.6, -1)
      + R(0, 70, 160, 20, '#1e1614') + Array.from({ length: 8 }, (_, k) => R(k * 20 + 4, 74, 12, 3, '#ff8a4a', 'opacity=".25"')).join(''),

    // 4 · Lando's Welcome: the landing platform at sunset. The Millennium
    // Falcon sits on the pad, ramp down; Cloud City's domed towers all
    // around; Lando strides out in his blue cape and gold-trimmed shirt with
    // a hand out in welcome, Wing Guards at his back.
    landos_welcome: () => sunsetSky('#5a4a7a')
      + C(30, 22, 7, '#fff0c8', 'opacity=".85"') + glow(30, 22, 6, '#ffe0a0', 0.3) + clouds(52, '#ffd8b8', '#e8a888', 0.7, 6, 10, 0.8)
      + tower(96, 10, 12, 48) + tower(118, 18, 9, 40) + tower(138, 6, 16, 52) + tower(6, 20, 10, 38) + tower(70, 26, 6, 30)
      + E(80, 74, 86, 13, '#d8d0ca', 'stroke="#9a8e88" stroke-width=".5"') + E(80, 74, 72, 10, 'none', 'stroke="#ffcf3a" stroke-width=".5" opacity=".6"') + E(80, 74, 42, 6, 'none', 'stroke="#ffcf3a" stroke-width=".4" opacity=".5"') + Array.from({ length: 16 }, (_, k) => { const an = (k / 16) * Math.PI * 2; return C(80 + Math.cos(an) * 80, 74 + Math.sin(an) * 12, 0.5, '#ffe0a0'); }).join('')
      + falcon34(52, 64, 1.05)
      + wingGuard(98, 76, 2.6, -1) + wingGuard(138, 78, 2.7, -1) + lando(118, 82, 3.4, -1)
      + R(0, 86, 160, 4, '#9a8e88'),

    // 5 · Cloud Car Chase (fleet): through the cloud canyons. The Hound's
    // Tooth roars through between towering clouds with Slave I behind it and
    // a TIE on their tail; two cloud cars climb in from below, guns firing
    // into the Hound's Tooth.
    cloud_car_chase: () => fill([[0, '#7a5a8a'], [0.5, '#f0a07a'], [1, '#ffd8a8']])
      + clouds(30, '#ffd8b8', '#e0a088', 0.5, 7, 8, 1.6) + E(80, 50, 60, 18, '#ffe8c8', 'opacity=".5"')
      + cloudTower(10, 92, 96, 30, '#ffe0c0', '#e8a888') + cloudTower(152, 92, 100, 28, '#ffd8b8', '#e0a080')
      + tie(136, 20, 1.05, 0, true) + bolt(131, 23, 112, 27, '#3aff6a')
      + hounds(68, 32, 1.2, 4)
      + slave1(118, 50, 0.95, 4) + bolt(116, 61, 96, 64, '#ff4a2a') + bolt(120, 61, 100, 68, '#ff4a2a')
      + cloudCar(32, 58, 1.3, -24) + cloudCar(14, 70, 1, -20) + bolt(40, 54.5, 56, 40, '#ff4a2a') + bolt(20, 67.7, 50, 44, '#ff4a2a') + glow(56, 39.6, 1.6, '#ffb070', 0.5)
      + cloudTower(110, 96, 30, 18, '#ffe8c8', '#f0b090') + clouds(86, '#fff0d8', '#f4c0a0', 1, 8, 10, 1.3),

    // 6 · Ugnaught Tunnels: the city's industrial guts. Ribbed arches, a
    // catwalk overhead, pipe runs and big gears, hanging work lights and
    // warning panels; a conveyor carrying scrap and droid parts past the
    // blazing furnace, Ugnaughts at work, carbonite slabs stacked up, and
    // IG-88 stalking in with stormtroopers through the steam.
    ugnaught_tunnels: () => fill([[0, '#2a1e1a'], [0.5, '#4a3028'], [1, '#1a1210']])
      + P('M0 0 L160 0 L160 14 Q80 4 0 14Z', '#3a2a24') + Array.from({ length: 9 }, (_, k) => P(`M${k * 20} ${12 - Math.sin((k / 8) * Math.PI) * 6} L${k * 20} 60`, 'none', 'stroke="#2a1c18" stroke-width="2.4"')).join('')
      + R(0, 30, 120, 2, '#4a3830') + Array.from({ length: 25 }, (_, k) => L(k * 5, 26, k * 5, 30, '#4a3830', 0.4)).join('') + P('M0 26 L120 26', 'none', 'stroke="#5a4840" stroke-width=".6"')
      + P('M0 18 L160 18 M0 21 L160 21', 'none', 'stroke="#5a4038" stroke-width="1.4"') + [20, 50, 80, 110, 140].map((x) => R(x - 1.4, 17, 2.8, 5, '#4a3028')).join('')
      + [[30, 42, 6], [96, 40, 5]].map(([x, y, r]) => C(x, y, r, '#3a2a24', 'stroke="#5a4038" stroke-width=".5"') + Array.from({ length: 10 }, (_, k) => { const an = (k / 10) * Math.PI * 2; return R(x + Math.cos(an) * r - 0.6, y + Math.sin(an) * r - 0.6, 1.2, 1.2, '#3a2a24', `transform="rotate(${(k / 10) * 360} ${x + Math.cos(an) * r} ${y + Math.sin(an) * r})"`); }).join('') + C(x, y, r * 0.3, '#5a4038')).join('')
      + [[14, 36], [64, 36], [112, 36]].map(([x, y]) => R(x - 3, y, 6, 4, '#2a1c18', 'stroke="#ffcf3a" stroke-width=".3"') + P(`M${x - 2} ${y + 3} L${x} ${y + 0.8} L${x + 2} ${y + 3}Z`, '#ffcf3a', 'opacity=".7"')).join('')
      + [[20, 20], [60, 16], [100, 16], [140, 20]].map(([x, y]) => L(x, y, x, y + 6, '#2a1c18', 0.3) + R(x - 3, y + 6, 6, 1.6, '#5a4a40') + glow(x, y + 8, 2.4, '#ffd8a0', 0.25)).join('')
      + R(120, 24, 34, 32, '#2a1a14', 'stroke="#5a3a2a" stroke-width=".6"') + R(124, 28, 26, 24, '#ff6a2a', 'opacity=".75"') + glow(137, 40, 10, '#ff8a3a', 0.35) + [128, 134, 140, 146].map((x) => L(x, 28, x, 52, '#3a1a10', 0.6)).join('')
      + R(0, 54, 120, 4, '#4a3a32', 'stroke="#2a1c18" stroke-width=".3"') + Array.from({ length: 24 }, (_, k) => C(k * 5 + 2, 58.4, 0.9, '#2a1c18')).join('')
      + [[12, 54], [34, 54], [86, 54], [104, 54]].map(([x, y], k) => [P(`M${x - 2} ${y} L${x - 1} ${y - 2.6} L${x + 2} ${y - 2} L${x + 2.4} ${y}Z`, '#8a7a6a'), R(x - 2.4, y - 2, 4.8, 2, '#6a6e76'), P(`M${x - 1.6} ${y} L${x - 1.2} ${y - 3} L${x + 1.2} ${y - 3} L${x + 1.6} ${y}Z`, '#d8b040')][k % 3]).join('') + C(58, 52.2, 1.7, '#d8b040', 'stroke="#8a6a20" stroke-width=".2"') + C(57.4, 52, 0.35, '#ffe8a0') + C(58.7, 52, 0.35, '#ffe8a0')
      + [140, 145, 150].map((x) => R(x - 2.6, 56, 5.2, 14, '#3a3e44', 'stroke="#1a1e24" stroke-width=".3"') + R(x - 2, 57, 4, 12, '#4a4e56') + R(x - 1.6, 67, 3.2, 1, '#ff3a2a', 'opacity=".7"')).join('')
      + ugnaught(24, 54, 2.2, 1) + ugnaught(72, 54, 2.1, -1) + ugnaught(96, 54, 2, 1)
      + glow(79, 50, 1.4, '#fff0a0', 0.6) + [[0.8, -0.4], [1.4, 0.6], [0.4, 1.2], [-0.6, 1], [1.8, -0.2]].map(([dx, dy]) => L(79, 50, 79 + dx * 2, 50 + dy * 2, '#ffe080', 0.25)).join('')
      + R(0, 62, 160, 28, '#2a1e1a') + Array.from({ length: 17 }, (_, k) => L(k * 10, 62, k * 10 - 6, 90, '#3a2a24', 0.4)).join('')
      + steam(110, 68, 22, 0.5, '#d8c8b8') + steam(14, 70, 18, 0.4, '#d8c8b8')
      + trooper(34, 84, 2.6, 1) + ig88(64, 82, 2.8, 1) + trooper(94, 84, 2.6, -1) + bolt(100, 74, 124, 68, '#ff4a2a'),

    // 7 · Dinner Guests: the trap in the dining room. A long table dressed in
    // white linen with plates of food, goblets and a centrepiece, white chairs
    // all round; curved white walls with lit alcoves, the great window full of
    // sunset; Darth Vader standing at the far end with Boba Fett at his side,
    // stormtroopers framing the room.
    dinner_guests: () => fill([[0, '#e8e2dc'], [1, '#c8beb6']])
      + P('M20 0 L140 0 L130 50 L30 50Z', '#f4eee8') + (() => { const [wg, wd] = LG([[0, '#f8a070'], [0.6, '#ffd0a0'], [1, '#ffe8c8']]); return wd + P('M44 6 L116 6 L110 38 L50 38Z', wg); })() + `<clipPath id="bs-win"><path d="M44 6 L116 6 L110 38 L50 38Z"/></clipPath><g clip-path="url(#bs-win)">${C(80, 30, 6, '#fff0c8', 'opacity=".8"')}${clouds(32, '#fff0d8', '#f8c8a0', 0.9, 9, 8, 0.6)}${tower(56, 18, 4, 20)}${tower(98, 14, 5, 24)}</g>` + [62, 80, 98].map((x) => L(x, 6, x - (x - 80) * 0.08, 38, '#c8beb6', 1)).join('') + P('M44 6 L116 6 L110 38 L50 38Z', 'none', 'stroke="#a89c96" stroke-width="1.4"')
      + P('M0 0 L20 0 L30 50 L0 70Z', '#ddd5ce') + P('M160 0 L140 0 L130 50 L160 70Z', '#d4ccc5') + [6, 14].map((x) => P(`M${x} ${x * 0.6} L${x + 1} ${50 + x}`, 'none', 'stroke="#c8beb6" stroke-width="1"')).join('') + [146, 154].map((x) => P(`M${x} ${(160 - x) * 0.6} L${x - 1} ${50 + 160 - x}`, 'none', 'stroke="#c8beb6" stroke-width="1"')).join('')
      + [[9, 14], [9, 32], [151, 14], [151, 32]].map(([x, y]) => E(x, y, 3, 6, '#ffd8a0', 'opacity=".6"') + E(x, y, 1.6, 4, '#fff0c8', 'opacity=".7"')).join('') + R(40, 0, 80, 3, '#ffe8c8', 'opacity=".7"') + R(40, 3, 80, 1, '#c8beb6') + [36, 124].map((x) => P(`M${x} 0 L${x + (x < 80 ? 6 : -6)} 50`, 'none', 'stroke="#c8beb6" stroke-width="1.6"')).join('')
      + P('M30 50 L130 50 L160 70 L160 90 L0 90 L0 70Z', '#b8aea6') + Array.from({ length: 9 }, (_, k) => L(30 + k * 12.5, 50, -20 + k * 25, 90, '#a89e96', 0.3)).join('')
      + vader(80, 50, 2.6, 1) + boba(62, 52, 2.3, 1, false)
      + [[46, 62], [114, 62], [40, 70], [120, 70]].map(([x, y]) => P(`M${x - 2.4} ${y + 2} L${x - 2} ${y - 7} C${x - 2} ${y - 8.4} ${x + 2} ${y - 8.4} ${x + 2} ${y - 7} L${x + 2.4} ${y + 2}Z`, '#ece4dc', 'stroke="#a89c96" stroke-width=".3"') + R(x - 2.6, y + 1.4, 5.2, 1, '#c8beb6')).join('')
      + P('M50 56 L110 56 L122 74 L38 74Z', '#fbf8f4', 'stroke="#b8aea6" stroke-width=".4"') + P('M38 74 L122 74 L123 78 C110 79 100 77 90 79 C80 77 70 79 60 77 C50 79 44 78 37 78Z', '#efe8e0', 'stroke="#b8aea6" stroke-width=".3"') + [46, 62, 80, 98, 114].map((x) => L(x, 74.4, x + (x - 80) * 0.02, 78.4, '#d8d0c8', 0.3)).join('')
      + [[58, 60], [70, 64.6], [90, 64.6], [102, 60], [52, 69], [66, 70.4], [94, 70.4], [108, 69]].map(([x, y], k) => E(x, y, 3, 1, '#ffffff', 'stroke="#c8beb6" stroke-width=".2"') + E(x, y - 0.2, 1.8, 0.55, ['#c8804a', '#8aa860', '#d8a050', '#a8604a'][k % 4]) + P(`M${x + 3.2} ${y - 2.6} L${x + 4} ${y - 2.6} L${x + 3.8} ${y - 1.4} L${x + 3.7} ${y - 0.4} L${x + 3.5} ${y - 0.4} L${x + 3.4} ${y - 1.4}Z`, '#e8f0f8', 'stroke="#a8b0b8" stroke-width=".1"') + E(x + 3.6, y - 0.4, 0.5, 0.15, '#a8b0b8')).join('')
      + E(80, 64, 6, 1.6, '#d8c8a8', 'stroke="#a89060" stroke-width=".25"') + [[77, 62.6, '#c84a3a'], [80, 62, '#e8a040'], [83, 62.6, '#8aa040'], [78.6, 61.2, '#a8406a'], [81.6, 61.2, '#e8c050']].map(([x, y, c]) => C(x, y, 1, c)).join('') + [72, 88].map((x) => R(x - 0.3, 58, 0.6, 4, '#e8d8a0') + E(x, 57.6, 0.4, 0.8, '#ffd23a') + glow(x, 57.4, 0.6, '#ffd23a', 0.5)).join('')
      + trooper(16, 88, 3, 1) + trooper(144, 88, 3, -1),

    // 8 · The Bounty Hunters' Deal: a hangar corridor lit by red work lights.
    // At the far end the bay door stands open on Slave I docked in the gloom.
    // Pipes and wall panels line the walls, crates are stacked, steam leaks
    // from a vent; Boba Fett and IG-88 face each other across Han frozen in
    // carbonite, his hands up and his face caught mid-shout; a Wing Guard
    // watches.
    bounty_hunters_deal: () => fill([[0, '#2a1e22'], [0.5, '#4a3236'], [1, '#1e1416']])
      + P('M0 0 L56 26 L104 26 L160 0Z', '#3a2a2e') + P('M0 90 L56 64 L104 64 L160 90Z', '#2a1e20') + P('M0 0 L56 26 L56 64 L0 90Z', '#4a363a') + P('M160 0 L104 26 L104 64 L160 90Z', '#40302e')
      + [0.25, 0.5, 0.75].map((k) => L(k * 56, k * 26, k * 56, 90 - k * 26, '#6a5054', 1.4 - k) + L(160 - k * 56, k * 26, 160 - k * 56, 90 - k * 26, '#6a5054', 1.4 - k)).join('')
      + [[4, 30, 10, 16], [20, 34, 9, 13], [142, 30, 10, 16], [126, 34, 9, 13]].map(([x, y, w, h]) => R(x, y, w, h, '#3a2a2e', 'stroke="#6a5054" stroke-width=".4"') + R(x + 1, y + 2, w - 2, 1.2, '#ff8a5a', 'opacity=".35"') + [0.4, 0.6, 0.8].map((t) => L(x + 1, y + h * t, x + w - 1, y + h * t, '#5a4448', 0.3)).join('')).join('')
      + P('M0 46 L56 50 M0 50 L56 53 M160 46 L104 50 M160 50 L104 53', 'none', 'stroke="#5a4044" stroke-width="1.2"') + P('M0 14 L56 34 M160 14 L104 34', 'none', 'stroke="#5a4044" stroke-width="1.6"')
      + [[14, 20], [146, 20], [36, 32], [124, 32]].map(([x, y]) => R(x - 2, y, 4, 2, '#ff3a2a') + glow(x, y + 1, 3, '#ff3a2a', 0.25)).join('')
      + R(56, 26, 48, 38, '#1a1214') + (() => { const [hg, hd] = LG([[0, '#ff9a5a', 0.4], [1, '#1a1214', 0]], 0.5, 1, 0.5, 0); return hd + R(60, 30, 40, 32, hg); })() + `<g opacity=".7">${slave1(80, 44, 1.1, 0)}</g>` + R(56, 26, 48, 4, '#3a2a2e') + R(56, 26, 4, 38, '#3a2a2e') + R(100, 26, 4, 38, '#3a2a2e') + [0, 1, 2, 3, 4, 5].map((k) => P(`M${60 + k * 8} 26 l4 4 l4 -4`, 'none', 'stroke="#ffcf3a" stroke-width=".4" opacity=".6"')).join('')
      + Array.from({ length: 9 }, (_, k) => L(56 - k * 7, 64 + k * 3.2, 104 + k * 7, 64 + k * 3.2, '#3a2a2e', 0.4)).join('') + Array.from({ length: 7 }, (_, k) => L(62 + k * 6, 64, 30 + k * 16.6, 90, '#3a2a2e', 0.3)).join('')
      + [[20, 78, 12, 9], [30, 71, 8, 6], [138, 76, 11, 8]].map(([x, y, w, h]) => R(x - w / 2, y - h / 2, w, h, '#5a4a3e', 'stroke="#2a1e18" stroke-width=".4"') + L(x - w / 2, y - h / 2, x + w / 2, y + h / 2, '#3a2e26', 0.4) + L(x + w / 2, y - h / 2, x - w / 2, y + h / 2, '#3a2e26', 0.4) + R(x - w / 2, y - h / 2, w, 1, '#ffcf3a', 'opacity=".35"')).join('')
      + steam(146, 86, 22, 0.45, '#e8d8d8')
      + E(80, 82, 40, 4, '#000', 'opacity=".3"') + R(68, 80.6, 24, 3, '#3a3438') + carbonite(80, 81, 2.6) + glow(80, 60, 8, '#ff8a6a', 0.08)
      + boba(50, 86, 3, 1, false) + ig88(112, 86, 3, -1) + wingGuard(134, 82, 2.4, -1),

    // 9 · Escape the Gas Giant (fleet): racing out of Bespin's atmosphere.
    // The banded orange curve of the giant, Cloud City small in the haze; the
    // Falcon climbs hard toward space, firing back from its turret, while the
    // Hound's Tooth, Slave I and a TIE Bomber chase it up out of the clouds,
    // every gun on the Falcon.
    escape_gas_giant: () => fill([[0, '#0a0814'], [0.45, '#3a2034'], [0.7, '#c86a4a'], [1, '#ffc890']])
      + Array.from({ length: 50 }, (_, k) => C((k * 41) % 160, (k * 23) % 40, 0.25, '#ffffff', `opacity="${0.3 + (k % 4) * 0.15}"`)).join('')
      + (() => { const [pg, pd] = LG([[0, '#ffd8a0'], [0.4, '#e8905a'], [1, '#8a4a3a']], 0, 0, 0, 1); return pd + E(80, 150, 150, 90, pg); })() + [66, 72, 78, 84].map((y, k) => P(`M-10 ${y} Q80 ${y - 18 + k * 2} 170 ${y}`, 'none', `stroke="${['#f8c890', '#d8805a', '#f0b080', '#c87050'][k]}" stroke-width="${2.4 - k * 0.3}" opacity=".6"`)).join('')
      + cloudCity(140, 74, 0.5) + clouds(86, '#ffe0c0', '#f0a880', 0.8, 10, 10, 0.9)
      + bolt(47, 60, 92, 26, '#ff4a2a') + bolt(44, 61, 88, 30, '#ff4a2a') + bolt(76, 64, 104, 34, '#ff4a2a') + bolt(30, 48, 90, 32, '#3aff6a') + bolt(100, 22, 70, 46, '#ff4a2a')
      + (kit.falcon ? kit.falcon(106, 22, 1.6, -28) : '')
      + `<g transform="translate(104 0) scale(-1 1)">${hounds(52, 58, 1.15, 26)}</g>` + slave1(80, 60, 0.95, 16) + tieBomber(26, 50, 1, 60)
      + glow(92, 26, 2, '#ffb070', 0.5),

    // 10 · The Freezing Chamber: the carbon-freezing chamber. The ring of red
    // vents round the walls, catwalks and pipes, cables hanging from the
    // dark, hydraulic claws over the glowing pit, steam boiling up around
    // Han's slab just raised from the freeze, his hands up and his mouth open
    // in a shout; Boba Fett and IG-88 on the platform with stormtroopers at
    // the rail, the control console blinking.
    freezing_chamber: () => fill([[0, '#1a0e0e'], [0.5, '#3a1a16'], [1, '#140a0a']])
      + Array.from({ length: 9 }, (_, k) => L(k * 20, 0, k * 20 + (k - 4) * 6, 50, '#2a1210', 1.6)).join('') + [[24, 12], [136, 12], [80, 6], [52, 20], [108, 20]].map(([x, y]) => C(x, y, 1.8, '#ff6a3a') + glow(x, y, 3.6, '#ff6a3a', 0.3)).join('')
      + P('M0 34 Q80 24 160 34', 'none', 'stroke="#4a2420" stroke-width="2"') + Array.from({ length: 17 }, (_, k) => { const x = k * 10; return L(x, 34 - Math.sin((k / 16) * Math.PI) * 6, x, 30 - Math.sin((k / 16) * Math.PI) * 6, '#4a2420', 0.5); }).join('') + P('M0 30 Q80 20 160 30', 'none', 'stroke="#5a2e26" stroke-width=".6"')
      + P('M4 0 L4 60 M10 0 L10 58 M150 0 L150 60 M156 0 L156 58', 'none', 'stroke="#3a1a16" stroke-width="1.6"')
      + Array.from({ length: 6 }, (_, k) => P(`M${20 + k * 24} 0 C${22 + k * 24} 10 ${16 + k * 24} 18 ${20 + k * 24} 26`, 'none', 'stroke="#1a0a08" stroke-width=".9"')).join('')
      + E(80, 58, 76, 20, '#3a1e1a', 'stroke="#5a2e26" stroke-width=".6"') + Array.from({ length: 16 }, (_, k) => { const an = (k / 16) * Math.PI * 2; return R(80 + Math.cos(an) * 68 - 1.4, 58 + Math.sin(an) * 17.6 - 0.6, 2.8, 1.2, '#ff6a3a', 'opacity=".55"'); }).join('') + E(80, 58, 60, 15, '#2a1410') + E(80, 58, 30, 8, '#0e0606', 'stroke="#ff6a3a" stroke-width=".8"') + glow(80, 58, 14, '#ff6a3a', 0.25)
      + [[-1, 0], [1, 0], [-1, 1], [1, 1]].map(([sd, k]) => P(`M${80 + sd * (14 + k * 12)} ${50 + k * 2} L${80 + sd * (10 + k * 10)} ${36 - k * 4} L${80 + sd * (6 + k * 8)} ${38 - k * 4}`, 'none', 'stroke="#5a4a48" stroke-width="1.6" stroke-linejoin="round"') + C(80 + sd * (10 + k * 10), 36 - k * 4, 0.9, '#6a5a58')).join('')
      + carbonite(80, 56, 2.4)
      + steam(62, 58, 40, 0.6) + steam(98, 58, 44, 0.6) + steam(80, 30, 22, 0.35, '#ffe8d8') + steam(50, 64, 26, 0.5) + steam(110, 64, 26, 0.5) + E(80, 54, 30, 5, '#ffb090', 'opacity=".22"')
      + P('M0 74 C40 70 120 70 160 74 L160 90 L0 90Z', '#2a1612') + P('M0 72 C40 68 120 68 160 72', 'none', 'stroke="#6a3a2e" stroke-width="1"') + Array.from({ length: 17 }, (_, k) => L(k * 10, 70 - Math.sin((k / 16) * Math.PI) * 2, k * 10, 76, '#5a2e26', 0.5)).join('') + Array.from({ length: 12 }, (_, k) => L(k * 14, 78, k * 14 - 8, 90, '#3a1e18', 0.4)).join('')
      + R(140, 62, 16, 9, '#2a1a16', 'stroke="#6a3a2e" stroke-width=".4"') + [142, 145, 148, 151].map((px, k) => R(px, 64, 2, 1.2, ['#ff3a2a', '#3aff6a', '#ffcf3a', '#3a8aff'][k])).join('') + R(142, 67, 12, 2.4, '#5ad8ff', 'opacity=".45"')
      + boba(38, 86, 2.9, 1, false) + ig88(122, 86, 2.9, -1) + trooper(16, 88, 2.7, 1) + trooper(146, 88, 2.7, -1),
  };
  // Shared with the later worlds' scene files.
  Object.assign(SA.kit = SA.kit || {}, { trooper, tie34: tie, vader, cloudCar });
  Object.assign(SA.scenes, B);
  SA.worlds.bespin = ['cloud_city_approach', 'wing_guard_patrol', 'tibanna_refinery', 'landos_welcome', 'cloud_car_chase', 'ugnaught_tunnels', 'dinner_guests', 'bounty_hunters_deal', 'escape_gas_giant', 'freezing_chamber'];
})(typeof window !== 'undefined' ? window : globalThis);
