// Update 2.4: the ten Hoth stage scenes, for approval. Same 160x90 format as
// Tatooine, one image per stage that says exactly where you are: Echo Base's
// entrance in the ice, the ion cannon firing on a Star Destroyer, the trench
// under an AT-AT, the command centre, the asteroid field, wampa country, the
// hangar breach, the shield generator, the transports' escape, and Vader
// striding into the base. Drawn in full detail: troopers, officers, Leia,
// C-3PO, the Falcon, Star Destroyers, transports, snowspeeders, walkers.
(function (root) {
  'use strict';
  const K = root.ArtX;
  const SA = root.StageArt24;
  if (!K || !SA) return;
  const { P, E, C, R, L, LG } = K;
  const fill = (stops) => { const [g, d] = LG(stops); return d + R(0, 0, 160, 90, g); };
  const glow = (x, y, r, c, a = 0.18) => C(x, y, r * 2.4, c, `opacity="${a * 0.5}"`) + C(x, y, r * 1.6, c, `opacity="${a}"`);
  const g = (x, y, s, f, inner, a = 0) => `<g transform="translate(${x} ${y})${a ? ` rotate(${a})` : ''} scale(${s * (f || 1)} ${s})">${inner}</g>`;
  // Falling snow and stars, placed the same way every time.
  const flakes = (n, seed, c = '#ffffff', a = 0.85) => Array.from({ length: n }, (_, k) => C(((k * 37 + seed * 13) % 160), ((k * 53 + seed * 7) % 90), (0.25 + (k % 3) * 0.18).toFixed(2), c, `opacity="${(a - (k % 4) * 0.15).toFixed(2)}"`)).join('');
  const starfield = (n, seed) => Array.from({ length: n }, (_, k) => C(((k * 41 + seed * 11) % 160), ((k * 67 + seed * 5) % 90), (0.2 + (k % 3) * 0.15).toFixed(2), '#ffffff', `opacity="${(0.4 + (k % 4) * 0.15).toFixed(2)}"`)).join('');
  // Snowdrifts: a wavy snow surface with blue shadow ridges and sparkle.
  const drifts = (y, c1 = '#eef4fa', c2 = '#cddbe8') => P(`M0 ${y} C24 ${y - 4} 44 ${y - 3} 64 ${y} C88 ${y - 5} 112 ${y - 4} 136 ${y - 1} C146 ${y - 2} 154 ${y - 2} 160 ${y} L160 90 L0 90Z`, c1)
    + P(`M36 ${y + 1} C46 ${y + 4} 56 ${y + 4} 64 ${y} M108 ${y - 3} C118 ${y + 1} 128 ${y + 2} 136 ${y - 1} M4 ${y + 6} C20 ${y + 9} 34 ${y + 9} 46 ${y + 6} M90 ${y + 8} C104 ${y + 11} 120 ${y + 11} 134 ${y + 8}`, 'none', `stroke="${c2}" stroke-width="1.4" opacity=".8"`)
    + Array.from({ length: 14 }, (_, k) => C(((k * 29) % 160), y + 3 + ((k * 11) % 16), 0.3, '#ffffff', 'opacity=".9"')).join('');
  // A faceted ice mountain range: lit and shadow faces, snow streaks, crevasses.
  const range = (pts, base, lit, dark, cap) => {
    let out = P(`M${pts.map((p) => p.join(' ')).join(' L')} L${pts[pts.length - 1][0]} ${base} L${pts[0][0]} ${base}Z`, lit);
    for (let i = 1; i < pts.length - 1; i++) {
      const [x, y] = pts[i]; const [nx, ny] = pts[i + 1];
      if (y < pts[i - 1][1] && y < ny) out += P(`M${x} ${y} L${nx} ${ny} L${nx} ${base} L${x + (nx - x) * 0.3} ${base}Z`, dark, 'opacity=".55"') + P(`M${x} ${y} L${x + (nx - x) * 0.28} ${y + (ny - y) * 0.5 + 2} L${x - 1.6} ${y + 4} Z`, cap) + P(`M${x} ${y + 3} L${x - 2} ${y + 9} M${x + 2} ${y + 5} L${x + 1} ${y + 12}`, 'none', 'stroke="#ffffff" stroke-width=".5" opacity=".7"');
    }
    return out;
  };

  // ---------- People ----------
  // A Rebel trooper in Hoth gear: boots, grey trousers, long beige coat with
  // belt and chest strap, pack, gloves, the round cap helmet with goggles,
  // and a rifle aimed (or held low).
  const rebel = (x, y, s, f = 1, aim = true) => g(x, y, s, f,
    R(-2.1, -1.3, 1.7, 1.5, '#3a3028', 'rx=".3"') + R(0.4, -1.3, 1.7, 1.5, '#3a3028', 'rx=".3"')
    + P('M-2 -1.1 L-2.3 -4.4 L2.3 -4.4 L2 -1.1Z', '#8a8270') + L(0, -4.2, 0, -1.2, '#6a6250', 0.25)
    + P('M-2.7 -4 L-3 -8.6 C-3 -9.8 3 -9.8 3 -8.6 L2.7 -4Z', '#cfbf9a', 'stroke="#7a6a4a" stroke-width=".2"') + P('M-2.7 -4 L-2.4 -2.8 L2.4 -2.8 L2.7 -4Z', '#bfae88')
    + R(-2.9, -5.8, 5.8, 0.7, '#5a4a30') + R(-0.5, -5.9, 1, 0.9, '#a89060') + L(-2, -9.2, 2, -6, '#6a5a3a', 0.4) + R(-3.7, -8.8, 1.3, 3.2, '#8a7a5a', 'rx=".4"')
    + C(0, -10.6, 1.55, '#d8b896') + P('M-1.8 -10.8 C-1.8 -13.2 1.8 -13.2 1.8 -10.8Z', '#e6dcc8', 'stroke="#8a7a5a" stroke-width=".2"') + R(-1.6, -11.3, 3.2, 0.75, '#2a3448') + C(-0.7, -11, 0.2, '#8ab0d8')
    + (aim ? L(2.6, -8.8, 3.8, -7.8, '#cfbf9a', 0.9) + C(3.9, -7.8, 0.45, '#5a4a30') + L(1, -7.8, 6.4, -8.8, '#1e1e22', 0.85) + R(1, -8.2, 1.8, 1.3, '#2a2a2e') + L(6.4, -8.8, 7.2, -8.9, '#3a3a40', 0.4)
      : L(2.6, -8.6, 3, -5.6, '#cfbf9a', 0.9) + L(2.6, -5, 4.2, -2, '#1e1e22', 0.8)));
  // A snowtrooper: padded white armour plates, chest box, backpack, the long
  // kama, the helmet with its cloth hood and dark goggles, rifle aimed.
  const snowt = (x, y, s, f = 1) => g(x, y, s, f,
    R(-2.2, -1.3, 1.8, 1.5, '#d8dee4', 'rx=".3"') + R(0.4, -1.3, 1.8, 1.5, '#d8dee4', 'rx=".3"')
    + P('M-2.6 -6.6 L-3.8 -1.2 L3.8 -1.2 L2.6 -6.6Z', '#e2e8ee', 'stroke="#9aa6b2" stroke-width=".2"') + L(-1.2, -6, -1.8, -1.4, '#b8c2cc', 0.25) + L(1.2, -6, 1.8, -1.4, '#b8c2cc', 0.25)
    + P('M-2.6 -6.6 L-2.8 -9.6 C-2.8 -10.6 2.8 -10.6 2.8 -9.6 L2.6 -6.6Z', '#f4f6f8', 'stroke="#8a96a4" stroke-width=".25"') + R(-1.4, -9.2, 2.8, 1.4, '#e8ecf0', 'stroke="#8a96a4" stroke-width=".15"') + R(-1, -8.9, 0.6, 0.6, '#3a3e46') + R(0.2, -8.9, 0.4, 0.6, '#d03a2a')
    + R(-3.8, -9.6, 1.4, 3.4, '#d8dee4', 'rx=".4" stroke="#9aa6b2" stroke-width=".15"') + R(-2.8, -7, 5.6, 0.7, '#c8d0d8')
    + P('M-2.4 -10.4 L-3 -8.6 L3 -8.6 L2.4 -10.4Z', '#e4e9ee', 'stroke="#aab4be" stroke-width=".15"') + C(0, -11.8, 2, '#f6f8fa', 'stroke="#8a96a4" stroke-width=".25"') + R(-1.6, -12.3, 3.2, 0.9, '#141820') + R(-1.4, -12.2, 1.2, 0.4, '#5a7aa8', 'opacity=".6"') + P('M-0.6 -11.2 L0.6 -11.2 L0.4 -10.2 L-0.4 -10.2Z', '#c8d0d8')
    + L(2.6, -9.4, 3.8, -8.4, '#f0f2f4', 0.9) + L(1.2, -8.4, 6.8, -9.8, '#1a1c20', 0.85) + R(1.2, -8.8, 1.8, 1.2, '#2a2c30'));
  // A command officer: grey uniform with a quilted vest, no helmet, holding a datapad.
  const officer = (x, y, s, f = 1, vest = '#6a7280', hair = '#3a2a1a') => g(x, y, s, f,
    R(-2, -1.3, 1.6, 1.5, '#2a2a2e') + R(0.4, -1.3, 1.6, 1.5, '#2a2a2e') + P('M-2 -1.1 L-2.2 -4.6 L2.2 -4.6 L2 -1.1Z', '#4a4e58')
    + P('M-2.6 -4.4 L-2.8 -8.8 C-2.8 -9.8 2.8 -9.8 2.8 -8.8 L2.6 -4.4Z', '#8a8e98', 'stroke="#4a4e58" stroke-width=".2"') + P('M-2.2 -4.6 L-2.4 -8.8 L-0.6 -9.4 L-0.4 -4.6Z M2.2 -4.6 L2.4 -8.8 L0.6 -9.4 L0.4 -4.6Z', vest) + [-7.6, -6.4, -5.2].map((yy) => L(-2.2, yy, -0.5, yy, '#4a4e58', 0.2) + L(0.5, yy, 2.2, yy, '#4a4e58', 0.2)).join('')
    + R(-2.7, -4.8, 5.4, 0.6, '#2a2a2e') + C(0, -10.6, 1.6, '#d8b090') + P('M-1.6 -10.8 C-1.6 -12.6 1.6 -12.6 1.6 -10.8 L1.4 -11.4 L-1.4 -11.4Z', hair)
    + L(2.4, -8.4, 3.2, -6.6, '#8a8e98', 0.8) + R(2.6, -7.2, 1.8, 1.2, '#1a2a3a', 'stroke="#4a5a6a" stroke-width=".2"') + R(2.8, -7, 1.2, 0.5, '#5ad8ff', 'opacity=".8"'));
  // Leia on Hoth: the white padded jumpsuit and vest, grey belt, the braids
  // looped round her head, a blaster at her hip.
  const leia = (x, y, s, f = 1) => g(x, y, s, f,
    R(-2, -1.3, 1.6, 1.5, '#d8d8d4') + R(0.4, -1.3, 1.6, 1.5, '#d8d8d4') + P('M-2 -1.1 L-2.2 -4.6 L2.2 -4.6 L2 -1.1Z', '#f2f2ee', 'stroke="#b8b8b4" stroke-width=".2"') + L(0, -4.4, 0, -1.2, '#c8c8c4', 0.25)
    + P('M-2.6 -4.4 L-2.8 -8.8 C-2.8 -9.8 2.8 -9.8 2.8 -8.8 L2.6 -4.4Z', '#fafaf6', 'stroke="#b8b8b4" stroke-width=".25"') + P('M-1.8 -4.6 L-2 -8.8 L-0.4 -9.2 L-0.2 -4.6Z M1.8 -4.6 L2 -8.8 L0.4 -9.2 L0.2 -4.6Z', '#ecece6', 'stroke="#c8c8c4" stroke-width=".15"') + [-7.8, -6.6, -5.4].map((yy) => L(-1.8, yy, -0.4, yy, '#d0d0cc', 0.2) + L(0.4, yy, 1.8, yy, '#d0d0cc', 0.2)).join('')
    + R(-2.7, -4.9, 5.4, 0.7, '#8a8a90') + R(1.6, -4.6, 1, 2, '#2a2a2e', 'rx=".3"')
    + C(0, -10.6, 1.6, '#e8c4a8') + P('M-1.7 -10.6 C-1.8 -12.6 1.8 -12.6 1.7 -10.6 C1.2 -11.6 -1.2 -11.6 -1.7 -10.6Z', '#4a2a16') + P('M-1.9 -11.4 C-2.6 -10.4 -2.4 -9 -1.4 -8.8 M1.9 -11.4 C2.6 -10.4 2.4 -9 1.4 -8.8', 'none', 'stroke="#4a2a16" stroke-width=".8" stroke-linecap="round"') + E(0, -12.4, 1.6, 0.5, '#5a3420')
    + C(-0.55, -10.7, 0.2, '#2a1a10') + C(0.55, -10.7, 0.2, '#2a1a10') + L(-2.4, -8.4, -3.2, -6, '#fafaf6', 0.8) + L(2.4, -8.4, 3, -6, '#fafaf6', 0.8));
  // C-3PO: gold head with round eyes, chest plate, the wires at his middle, stiff limbs.
  const threepio = (x, y, s, f = 1) => g(x, y, s, f,
    L(-0.9, -5.6, -1.2, 0, '#d0a038', 1.1) + L(0.9, -5.6, 1.3, 0, '#c09030', 1.1) + R(-1.9, -0.4, 1.6, 0.6, '#b08028') + R(0.5, -0.4, 1.6, 0.6, '#b08028')
    + R(-1.5, -7, 3, 1.4, '#5a5a5e') + [-1, 0, 1].map((xx) => L(xx * 0.8, -7, xx * 0.8, -5.6, '#d04a2a', 0.25)).join('')
    + P('M-2 -11 L2 -11 L1.6 -7 L-1.6 -7Z', '#e8c050', 'stroke="#9a7020" stroke-width=".25"') + P('M-1.2 -10.6 L1.2 -10.6 L0.9 -8.6 L-0.9 -8.6Z', '#f4d870', 'opacity=".6"')
    + L(-2, -10.6, -3, -7.2, '#d8b040', 0.9) + L(2, -10.6, 2.8, -7.2, '#c8a038', 0.9) + R(-0.5, -12, 1, 1, '#c8a038') + C(0, -13.4, 1.7, '#e8c050', 'stroke="#9a7020" stroke-width=".25"') + C(-0.6, -13.6, 0.38, '#ffe8a0') + C(0.6, -13.6, 0.38, '#ffe8a0') + R(-0.4, -12.7, 0.8, 0.5, '#9a7020'));

  // ---------- Machines ----------
  // An AT-AT walking left: armoured body with panels and rivets, segmented
  // neck, the wedge head with its viewports and chin and cheek guns, four
  // jointed legs with knee armour and round ribbed feet. (x, y) = feet.
  const atat = (x, y, sc, stride, far) => {
    const c = far ? '#a6b0bc' : '#8a94a2'; const d = far ? '#6e7884' : '#4a5462'; const lit = '#ccd4de';
    const leg = (lx, ph) => {
      const kx = lx + (ph ? 1.4 : -1.4); const fx = lx + (ph ? -0.6 : 0.6);
      return P(`M${lx - 1.7} -20 L${lx + 1.7} -20 L${kx + 1.6} -11 L${kx - 1.6} -11Z`, c, `stroke="${d}" stroke-width=".3"`) + L(lx - 0.6, -19, kx - 0.6, -12, lit, 0.3, 'opacity=".6"')
        + P(`M${kx - 2.2} -12.8 L${kx + 2.2} -12.8 L${kx + 1.6} -9.4 L${kx - 1.6} -9.4Z`, d) + C(kx, -11, 1.1, c)
        + P(`M${kx - 1.3} -10 L${kx + 1.3} -10 L${fx + 1.2} -1.6 L${fx - 1.2} -1.6Z`, c, `stroke="${d}" stroke-width=".3"`) + L(kx - 0.5, -9, fx - 0.5, -2.4, lit, 0.3, 'opacity=".6"')
        + P(`M${fx - 3} 0 L${fx - 2.6} -1.8 L${fx + 2.6} -1.8 L${fx + 3} 0Z`, d) + [-1.6, 0, 1.6].map((o) => L(fx + o, -1.7, fx + o, -0.1, c, 0.3)).join('');
    };
    return `<g transform="translate(${x} ${y}) scale(${sc})">`
      + E(0, 0.4, 22, 1.4, '#000', 'opacity=".14"') + leg(-10, stride) + leg(9, !stride)
      + P('M-14 -30 L12 -31 L16 -27 L15 -19 L-14 -18 L-17 -24Z', c, `stroke="${d}" stroke-width=".5"`) + P('M-14 -30 L12 -31 L16 -27 L-17 -24Z', lit, 'opacity=".5"')
      + L(-16, -22.6, 15.6, -23.4, d, 0.5) + [-8, -2, 4, 10].map((px) => L(px, -30.6, px, -18.4, d, 0.35)).join('') + R(-6, -21.6, 9, 2.2, d, 'opacity=".55"') + R(4, -29, 5, 1.4, d, 'opacity=".5"')
      + Array.from({ length: 10 }, (_, k) => C(-13 + k * 3, -19.6, 0.25, d)).join('') + R(-12, -28.4, 4, 2, '#5a6470', 'opacity=".5"') + P('M-14 -18 L15 -19 L14 -17.6 L-13 -16.8Z', d)
      + [-18.4, -20, -21.6].map((nx, k) => R(nx - 0.8, -27 + k * 0.2, 1.6, 4.4, d, 'rx=".3"') + L(nx - 0.6, -26.4, nx + 0.6, -26.4, lit, 0.2)).join('')
      + P('M-34 -28 L-22 -29.6 L-20 -24 L-24 -19.6 L-34 -21Z', c, `stroke="${d}" stroke-width=".5"`) + P('M-34 -28 L-22 -29.6 L-21.4 -27.4 L-33.6 -26.2Z', lit, 'opacity=".6"')
      + R(-32, -26.2, 2, 1.2, '#1a1e24') + R(-29.4, -26.4, 2, 1.2, '#1a1e24') + L(-33.6, -23.4, -22, -24.4, d, 0.4) + L(-28, -24, -27, -20.4, d, 0.3)
      + R(-40, -22.6, 7, 1, d) + R(-39, -20.8, 6, 0.9, d) + R(-37, -25, 4, 0.8, d) + R(-36, -26.6, 3, 0.6, d)
      + leg(-6, !stride) + leg(13, stride) + '</g>';
  };
  // A T-47 snowspeeder flying right: wedge hull, split rear airbrakes, twin
  // wingtip cannons, the canopy, orange stripes and the harpoon at the back.
  const speeder = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M-8.4 2 L-7 -1.4 L-1 -2.4 L7 -2 L10.6 0 L7 2.2 L-1 2.6Z', '#e8ecf0', 'stroke="#6a727c" stroke-width=".35"') + P('M-8.4 2 L-7 -1.4 L-1 -2.4 L7 -2 L10.6 0Z', '#ffffff', 'opacity=".4"')
    + P('M-8.4 2 L-11 -0.2 L-9.4 -2.6 L-7 -1.4Z M-8.4 2 L-11 3.4 L-9.6 4 L-7.4 2.4Z', '#d4dae0', 'stroke="#6a727c" stroke-width=".3"') + L(-7, -1.4, -1, -2.4, '#6a727c', 0.25)
    + P('M0.4 -2.2 L4 -2.2 L5.6 -0.6 L1 -0.6Z', '#2a3a4a', 'stroke="#6a727c" stroke-width=".25"') + L(1.2, -2, 1.6, -0.6, '#8ab0d8', 0.2)
    + R(-5, -0.6, 6, 0.8, '#d8662a') + R(-5, 0.6, 6, 0.6, '#d8662a') + R(7, -2.8, 4.6, 0.6, '#5a626c') + R(7, 2.2, 4.6, 0.6, '#5a626c') + L(-11, 1, -13, 1.4, '#3a3e46', 0.4)
    + E(-11.2, -0.4, 0.9, 1.3, '#ffb070', 'opacity=".9"'), a);
  const tie = (x, y, s) => g(x, y, s, 1,
    P('M-4.6 -4.6 L-3.4 -4.6 L-3.4 4.6 L-4.6 4.6Z M3.4 -4.6 L4.6 -4.6 L4.6 4.6 L3.4 4.6Z', '#3a3e46', 'stroke="#1a1e24" stroke-width=".25"') + [-2.4, -0.8, 0.8, 2.4].map((yy) => L(-4.6, yy, -3.4, yy, '#5a5e66', 0.2) + L(3.4, yy, 4.6, yy, '#5a5e66', 0.2)).join('')
    + L(-3.4, 0, 3.4, 0, '#5a5e66', 1) + C(0, 0, 1.9, '#6a6e76', 'stroke="#2a2e36" stroke-width=".25"') + C(0, 0, 1, '#1a1e24') + C(-0.3, -0.3, 0.3, '#5a7aa8', 'opacity=".7"'));
  // An Imperial Star Destroyer side-on, nose left: the wedge with its trench,
  // stepped superstructure, the bridge tower and its two shield domes, gun
  // batteries along the edge, running lights and the engine glow.
  const isd = (x, y, s, c = '#8a929c') => g(x, y, s, 1,
    P('M-30 3 L18 -4 L26 0.4 L22 4.4 L-28 4.6Z', c, 'stroke="#3e464e" stroke-width=".35"') + P('M-30 3 L18 -4 L26 0.4Z', '#d4dae0', 'opacity=".42"') + P('M-28 4.6 L22 4.4 L20 5.6 L-24 5.6Z', '#4a525c')
    + L(-28, 3.6, 24, 2, '#3e464e', 0.4) + Array.from({ length: 12 }, (_, k) => L(-24 + k * 4, 3.2 - k * 0.34, -23 + k * 4, 4.4, '#5a626c', 0.2)).join('') + Array.from({ length: 10 }, (_, k) => C(-22 + k * 4.4, 4, 0.25, '#e8f0f8', 'opacity=".8"')).join('')
    + P('M-6 -0.8 L14 -4.4 L17 -2.6 L-2 0.6Z', c, 'stroke="#3e464e" stroke-width=".3"') + P('M2 -3 L14 -5.6 L16.4 -4 L4 -1.6Z', '#a4acb6', 'stroke="#3e464e" stroke-width=".25"')
    + R(10, -9.6, 5.4, 4.4, c, 'stroke="#3e464e" stroke-width=".3"') + R(9, -8.2, 7.4, 1.4, '#6e767e') + R(9.4, -7.8, 6.6, 0.4, '#ffe8a0', 'opacity=".6"') + C(10.4, -10.2, 1, '#b8c0ca', 'stroke="#3e464e" stroke-width=".2"') + C(15, -10.2, 1, '#b8c0ca', 'stroke="#3e464e" stroke-width=".2"') + L(12.7, -10.6, 12.7, -13, '#3e464e', 0.3)
    + [[-16, 0.4], [-8, -0.8], [0, -2], [8, -3]].map(([px, py]) => C(px, py, 0.5, '#5a626c')).join('')
    + glow(25, 1.2, 1, '#9fd8ff', 0.5) + C(25.4, 0.2, 0.9, '#cfeaff') + C(25.4, 2.4, 0.9, '#cfeaff') + C(24.8, 1.3, 1.1, '#e8f6ff'));
  // A GR-75 transport: the open clamshell hull with its cargo pods, the
  // command pod on top at the front, ribs, and the engine bank glowing.
  const transport = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M-15 0 C-15 -4 -8 -5.6 0 -5.6 L11 -3.6 C15 -2.6 15.4 2.6 11 3.6 L0 5.6 C-8 5.6 -15 4 -15 0Z', '#bcc0c4', 'stroke="#545a62" stroke-width=".4"')
    + P('M-12 -2.4 L8 -2.4 L8 2.4 L-12 2.4Z', '#6a6e74') + [-11, -7, -3, 1, 5].map((px, k) => R(px, -2.2, 3.4, 4.4, ['#9a8a6a', '#8a7a5a', '#a89a78'][k % 3], 'rx=".5" stroke="#4a4030" stroke-width=".2"')).join('')
    + [-10, -5, 0, 5].map((px) => L(px, -5.4, px + 0.4, -2.4, '#7a7e84', 0.3) + L(px, 5.4, px + 0.4, 2.4, '#7a7e84', 0.3)).join('')
    + P('M6 -3.8 L11 -6.4 L14 -5.6 L12 -3.4Z', '#c8ccd0', 'stroke="#545a62" stroke-width=".3"') + R(11, -6.2, 2, 0.8, '#2a3a4a')
    + P('M11 -3.6 C15 -2.6 15.4 2.6 11 3.6 L12 0Z', '#a8acb0') + R(-16.4, -3, 1.6, 6, '#4a4e54', 'rx=".4"') + glow(-16.8, 0, 1.4, '#9fd8ff', 0.55) + [-2, 0, 2].map((yy) => C(-16.8, yy, 0.6, '#d8f0ff')).join(''), a);
  // The Millennium Falcon from above, nose to the right: the hull disc with
  // its plating rings and radial panels, the twin forward mandibles with the
  // gap between, the cockpit tube offset to the right side, the top turret,
  // the radar dish, the airlock bumps, and the blue engine band at the back.
  const falcon = (x, y, s, a = 0) => g(x, y, s, 1,
    P('M8.4 -5.6 L18.6 -4.8 C19.6 -4.6 19.8 -3.6 19 -3.2 L9.6 -1.4Z M8.4 5.6 L18.6 4.8 C19.6 4.6 19.8 3.6 19 3.2 L9.6 1.4Z', '#c8c4ba', 'stroke="#5e5a52" stroke-width=".35"')
    + L(10, -3.6, 18, -3.8, '#8a867c', 0.3) + L(10, 3.6, 18, 3.8, '#8a867c', 0.3) + R(16, -4.6, 2, 1, '#8a867c', 'opacity=".6"') + R(16, 3.6, 2, 1, '#8a867c', 'opacity=".6"')
    + C(0, 0, 10.4, '#d2cec4', 'stroke="#5e5a52" stroke-width=".45"') + C(0, 0, 10.4, 'none', 'stroke="#ffffff" stroke-width=".4" opacity=".5"')
    + C(0, 0, 7.6, 'none', 'stroke="#9a968c" stroke-width=".35"') + C(0, 0, 4.2, 'none', 'stroke="#9a968c" stroke-width=".35"')
    + Array.from({ length: 16 }, (_, k) => { const an = (k / 16) * Math.PI * 2; return L((Math.cos(an) * 4.2).toFixed(2), (Math.sin(an) * 4.2).toFixed(2), (Math.cos(an) * 10.2).toFixed(2), (Math.sin(an) * 10.2).toFixed(2), '#a8a49a', 0.25); }).join('')
    + [[-6, -4, 3, 1.6], [-7.4, 2.4, 2.4, 1.6], [2, -8, 2.6, 1.2], [3.6, 6.4, 2.2, 1.2], [-3, 6.4, 2, 1.4], [5, -3.4, 2.2, 1.2]].map(([px, py, w, h]) => R(px, py, w, h, '#8a867c', 'opacity=".65" stroke="#5e5a52" stroke-width=".15"')).join('')
    + P('M5.6 7.4 L11 10.6 L12 9.6 L7.2 6.2Z', '#c4c0b6', 'stroke="#5e5a52" stroke-width=".3"') + C(11.8, 10.6, 1.8, '#bab6ac', 'stroke="#5e5a52" stroke-width=".3"') + P('M10.6 9.6 Q11.8 8.6 13 9.6', 'none', 'stroke="#2a3a4a" stroke-width=".6"')
    + C(0, 0, 2.4, '#bcb8ae', 'stroke="#5e5a52" stroke-width=".3"') + C(0, 0, 1.2, '#4a5a6a') + L(-0.6, 0, 0.6, 0, '#2a2a30', 0.3)
    + E(-2.8, -6.4, 1.8, 1.2, '#e2ded4', 'stroke="#5e5a52" stroke-width=".25"') + L(-2.8, -6.4, -2.8, -7.8, '#5e5a52', 0.25)
    + R(-1, -10.8, 2, 1, '#9a968c') + R(-1, 9.8, 2, 1, '#9a968c')
    + P('M-6.6 -8 A10.4 10.4 0 0 0 -6.6 8', 'none', 'stroke="#8ad8ff" stroke-width="1.4"') + P('M-6.6 -8 A10.4 10.4 0 0 0 -6.6 8', 'none', 'stroke="#e8f8ff" stroke-width=".5"') + glow(-10.4, 0, 2, '#8ad8ff', 0.35), a);
  // The Falcon side-on (for the hangar): the flat saucer, the mandibles, the
  // cockpit tube jutting out front-right, the dish and turret on top,
  // landing legs, the ramp down and the engine glow at the back.
  const falconSide = (x, y, s) => g(x, y, s, 1,
    E(0, 8.6, 30, 2, '#000', 'opacity=".25"') + [-14, -2, 12].map((px) => L(px, 2, px, 8, '#5a5a60', 1) + E(px, 8.2, 2.2, 0.7, '#4a4a50')).join('')
    + P('M-6 2.6 L4 2.6 L10 8.4 L-2 8.4Z', '#a8a49a', 'stroke="#5e5a52" stroke-width=".3"') + L(-1, 4, 6, 7.6, '#8a867c', 0.3)
    + P('M-26 0.6 C-26 -2.6 -16 -5.6 0 -6 C14 -5.8 22 -4 26 -1.2 L26 1.4 C16 3.4 -16 3.6 -26 1.8Z', '#d2cec4', 'stroke="#5e5a52" stroke-width=".45"') + P('M-26 0.6 C-26 -2.6 -16 -5.6 0 -6 C14 -5.8 22 -4 26 -1.2 L-24 -0.6Z', '#ffffff', 'opacity=".25"')
    + L(-24, 0.4, 25, 0, '#8a867c', 0.4) + Array.from({ length: 12 }, (_, k) => L(-20 + k * 3.8, -4.4 + Math.abs(k - 5) * 0.3, -20.4 + k * 3.8, 1.6, '#a8a49a', 0.25)).join('')
    + P('M22 -2.4 L38 -2 L38.6 0.6 L24 1Z', '#c8c4ba', 'stroke="#5e5a52" stroke-width=".35"') + L(26, -0.6, 37, -0.4, '#8a867c', 0.3)
    + R(12, -7.4, 12, 3.6, '#c4c0b6', 'rx="1" stroke="#5e5a52" stroke-width=".3"') + C(25, -5.6, 2.6, '#bab6ac', 'stroke="#5e5a52" stroke-width=".3"') + P('M23.4 -6.4 L26.6 -6.4 M23.4 -5 L26.6 -5', 'none', 'stroke="#2a3a4a" stroke-width=".6"')
    + P('M-8 -6 C-8 -8 -2 -8 -2 -6Z', '#bab6ac', 'stroke="#5e5a52" stroke-width=".3"') + L(-5, -7.6, -6, -10, '#5e5a52', 0.4) + E(-6.4, -10.4, 2.6, 0.8, '#e2ded4', 'stroke="#5e5a52" stroke-width=".25" transform="rotate(-20 -6.4 -10.4)"')
    + [[-18, -3.4], [-10, -4.2], [4, -4.4], [14, -3.4]].map(([px, py]) => R(px, py, 3, 1.4, '#8a867c', 'opacity=".6"')).join('')
    + glow(-26.4, 0.6, 1.4, '#8ad8ff', 0.5) + E(-26.4, 0.6, 0.8, 2.2, '#e8f8ff'));
  // An X-wing side-on (parked): fuselage, the nose, the S-foils, the astromech, red stripes.
  const xwingSide = (x, y, s, f = 1) => g(x, y, s, f,
    E(0, 6.4, 16, 1.2, '#000', 'opacity=".2"') + L(-6, 2, -7, 6, '#5a5a60', 0.6) + L(6, 2, 6.6, 6, '#5a5a60', 0.6)
    + P('M-12 0 L10 -1 L18 0.4 L10 1.8 L-12 2Z', '#e4e2dc', 'stroke="#6a686e" stroke-width=".35"') + R(-2, -0.6, 6, 1.4, '#c8402a') + P('M2 -1 L6 -3 L8 -1Z', '#3a4a5a')
    + P('M-10 0 L-6 -6 L0 -6 L-2 0Z', '#d8d6ce', 'stroke="#6a686e" stroke-width=".3"') + R(-8, -6.6, 10, 0.8, '#6a686e') + C(-5, -2.2, 1.2, '#e8eef4', 'stroke="#3a6ad8" stroke-width=".4"')
    + C(-11.4, 1, 1.4, '#6a686e') + R(-13, 0.2, 1.6, 1.6, '#8a888e'));
  // A DF.9 anti-infantry turret: armoured base, the gun housing and its long barrel.
  const turret = (x, y, s, f = 1) => g(x, y, s, f,
    P('M-7 0 L-6 -5 L6 -5 L7 0Z', '#7a848e', 'stroke="#4a545e" stroke-width=".4"') + [-4, 0, 4].map((px) => L(px, -4.6, px, -0.4, '#5a646e', 0.3)).join('')
    + P('M-5 -5 L-4 -11 L5 -11 L6 -5Z', '#8a949e', 'stroke="#4a545e" stroke-width=".4"') + R(-3, -9.6, 4, 1.6, '#2a3440') + L(-3.6, -7, 3.6, -7, '#5a646e', 0.3)
    + R(5, -9.4, 12, 1.6, '#4a545e', 'rx=".4"') + R(15, -9.8, 3, 2.4, '#3a444e') + R(-6, -12, 4, 1.4, '#6a747e'));
  // The v-150 ion cannon: armoured base ring, the domed ball with its plate
  // seams and vents, the barrel aimed into the sky.
  const ionCannon = (x, y, s) => g(x, y, s, 1,
    P('M-14 0 L-10 -6 L10 -6 L14 0Z', '#7a8694', 'stroke="#4a5664" stroke-width=".4"') + [-8, -4, 0, 4, 8].map((px) => L(px, -5.6, px * 1.3, -0.4, '#5a6674', 0.3)).join('')
    + R(-8, -9.6, 16, 3.8, '#8a96a4', 'stroke="#4a5664" stroke-width=".4"') + [-6, -2, 2, 6].map((px) => R(px - 0.8, -9, 1.6, 2.6, '#5a6674')).join('')
    + C(0, -19, 10.6, '#c8d0da', 'stroke="#5a6674" stroke-width=".5"') + P('M-10.6 -19 A10.6 10.6 0 0 0 10.6 -19Z', '#8e9aa8') + [-14, -19, -24].map((yy) => P(`M${-Math.sqrt(Math.max(0, 112 - (yy + 19) * (yy + 19))).toFixed(1)} ${yy} L${Math.sqrt(Math.max(0, 112 - (yy + 19) * (yy + 19))).toFixed(1)} ${yy}`, 'none', 'stroke="#6a7684" stroke-width=".4"')).join('')
    + L(0, -29.4, 0, -8.6, '#6a7684', 0.35) + E(-3.6, -24.4, 3.4, 1.6, '#ffffff', 'opacity=".45"') + [[5, -16], [6, -21], [-6, -14]].map(([px, py]) => R(px - 1, py, 2, 1.2, '#5a6674')).join('')
    + P('M-3 -28 L-11 -38.4 L-8.4 -40.4 L-0.4 -30Z', '#5a6674', 'stroke="#3a4654" stroke-width=".3"') + L(-5, -31.6, -9.2, -37, '#8a96a4', 0.3) + C(-9.8, -39.6, 2, '#3a4654') + C(-9.8, -39.6, 1, '#9fd8ff', 'opacity=".7"'));
  // Fire: an explosion with licking flames, a hot core, sparks and smoke.
  const blast = (x, y, r) => glow(x, y, r, '#ff9a3a', 0.35) + E(x, y - r * 2.2, r * 2, r * 1.3, '#3a404c', 'opacity=".5"') + E(x + r * 0.8, y - r * 3.4, r * 1.6, r * 1.1, '#4a505c', 'opacity=".35"')
    + P(`M${x - r} ${y + r * 0.4} Q${x - r * 1.2} ${y - r * 0.8} ${x - r * 0.4} ${y - r * 1.6} Q${x - r * 0.2} ${y - r * 0.6} ${x} ${y - r * 2} Q${x + r * 0.5} ${y - r * 0.8} ${x + r * 0.6} ${y - r * 1.4} Q${x + r * 1.3} ${y - r * 0.4} ${x + r} ${y + r * 0.4}Z`, '#ff7a1a', 'opacity=".9"')
    + P(`M${x - r * 0.6} ${y + r * 0.3} Q${x - r * 0.6} ${y - r * 0.6} ${x - r * 0.1} ${y - r} Q${x + r * 0.2} ${y - r * 0.3} ${x + r * 0.5} ${y - r * 0.7} Q${x + r * 0.8} ${y} ${x + r * 0.6} ${y + r * 0.3}Z`, '#ffcf4a') + C(x, y, r * 0.4, '#fff4c8')
    + [[-1.4, -1.6], [1.6, -1.2], [-0.8, -2.6], [2, -2.4], [-2, -0.6]].map(([dx, dy]) => C(x + dx * r, y + dy * r, 0.3, '#ffd88a')).join('');
  const bolt = (x1, y1, x2, y2, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="1.6" stroke-linecap="round" opacity=".35"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffffff" stroke-width=".5" stroke-linecap="round"/>`;
  // The trench line: packed snow wall, ice blocks and sandbags, cables and ammo crates.
  const trench = (y) => P(`M0 ${y} C40 ${y - 4} 80 ${y - 2} 120 ${y - 4} C140 ${y - 5} 150 ${y - 4} 160 ${y - 4} L160 ${y + 8} L0 ${y + 10}Z`, '#dbe5ef', 'stroke="#a8b8c8" stroke-width=".6"')
    + Array.from({ length: 16 }, (_, k) => { const bx = 4 + k * 10; const by = y - 1 - (k % 3) * 0.6 - (bx > 60 ? 1 : 0); return E(bx, by, 5, 2.2, k % 4 === 2 ? '#c8d4e0' : '#e8eef4', 'stroke="#a0aebc" stroke-width=".4"') + P(`M${bx - 4} ${by + 0.4} Q${bx} ${by - 1.4} ${bx + 4} ${by + 0.4}`, 'none', 'stroke="#bccad8" stroke-width=".3"'); }).join('')
    + [[22, y + 3], [104, y + 2]].map(([cx, cy]) => R(cx, cy, 6, 3.6, '#5a6a4a', 'stroke="#3a4a2a" stroke-width=".3"') + L(cx, cy + 1.2, cx + 6, cy + 1.2, '#3a4a2a', 0.3) + R(cx + 2, cy - 0.6, 2, 0.6, '#c8a040')).join('')
    + P(`M0 ${y + 6} Q30 ${y + 9} 60 ${y + 6} T120 ${y + 6} T160 ${y + 5}`, 'none', 'stroke="#2a2e36" stroke-width=".5" opacity=".7"');

  const H = {
    // 1 · Echo Base Perimeter: the base's hangar doors cut into the faceted
    // ice mountain, the trench line with its turrets, sandbags and crates,
    // Rebel troopers firing, explosions, AT-ATs on the horizon and
    // snowspeeders streaking out to meet them.
    echo_perimeter: () => fill([[0, '#7890aa'], [0.55, '#b8c8d8'], [1, '#e4ecf4']])
      + range([[86, 44], [100, 30], [114, 38], [128, 24], [142, 34], [160, 26]], 64, '#a8b8ca', '#7a90a8', '#f2f6fa')
      + range([[0, 22], [14, 10], [28, 18], [46, 4], [62, 16], [78, 24], [92, 44]], 66, '#c8d6e4', '#94a8c0', '#f6f9fc')
      + P('M6 30 L30 24 M4 40 L36 34 M14 52 L44 46 M60 26 L74 32 M62 40 L82 46', 'none', 'stroke="#8aa0b8" stroke-width=".6" opacity=".7"')
      // the hangar doors: frame, the open bay with lights inside, door panels, warning lights
      + P('M22 66 L22 42 L60 37 L60 66Z', '#2a3440', 'stroke="#6a7a8c" stroke-width="1.4"') + P('M24 66 L24 44 L58 39.4 L58 66Z', '#3a4858')
      + [30, 36, 42, 48, 54].map((px) => L(px, 66, px, 43.6 - (px - 24) * 0.135, '#2a3440', 0.6)).join('') + [50, 56, 62].map((yy) => L(24, yy, 58, yy - 0.6, '#2a3440', 0.4)).join('')
      + R(24, 58, 34, 8, '#ffe8a0', 'opacity=".18"') + glow(41, 61, 5, '#ffe8a0', 0.25) + speeder(41, 60, 0.6) + R(20, 39, 42, 2.4, '#7a8a9c', 'stroke="#4a5a6c" stroke-width=".3"') + [26, 56].map((px) => C(px, 40.2, 0.7, '#ff6a3a')).join('')
      // AT-ATs coming over the horizon, snowspeeders flying out, laser fire
      + atat(126, 62, 0.44, true, true) + atat(152, 63, 0.36, false, true) + atat(106, 63, 0.3, false, true)
      + speeder(72, 22, 1.4, -6) + speeder(98, 32, 1, -4) + speeder(56, 32, 0.8, -8)
      + bolt(110, 52, 96, 48, '#ff4a2a') + bolt(130, 50, 118, 46, '#ff4a2a') + bolt(82, 22, 96, 26, '#ff4a2a')
      // the snowfield and the trench line: turrets, troopers, crates, explosions
      + drifts(66) + trench(74)
      + turret(118, 72, 1.3, -1) + turret(18, 74, 1.1) + bolt(100, 59, 86, 56, '#ff4a2a')
      + rebel(40, 72, 1.4) + rebel(54, 71.6, 1.3) + rebel(70, 71, 1.4, 1) + rebel(86, 71.4, 1.3) + rebel(136, 71, 1.3)
      + bolt(46, 61, 64, 56, '#ff4a2a') + bolt(132, 58, 148, 54, '#3aff6a') + blast(142, 64, 3.4) + blast(96, 62, 2.4)
      + P('M0 82 C40 79 80 81 120 79 C140 78 150 80 160 79 L160 90 L0 90Z', '#f4f8fc') + flakes(60, 1),

    // 2 · Ion Cannon Cover (fleet): from the ground looking up. The v-150 ion
    // cannon on its ridge firing a crackling bolt into orbit, striking a Star
    // Destroyer; a GR-75 transport climbing away under X-wing escort, TIE
    // fighters diving in, a second destroyer high above, crew at the cannon.
    ion_cannon: () => fill([[0, '#08121f'], [0.45, '#243856'], [0.8, '#8aa0bc'], [1, '#c8d6e4']]) + starfield(50, 2)
      + C(136, 14, 9, '#c8d4e2', 'opacity=".25"') + C(136, 14, 6, '#e4ecf4', 'opacity=".45"') + C(134, 12, 1.2, '#b8c4d2', 'opacity=".5"')
      + isd(118, 24, 1.8, '#7a828c') + isd(48, 12, 0.9, '#6a727c') + blast(106, 24.6, 4.6)
      + glow(106, 24, 4, '#9fd8ff', 0.55) + [0, 1, 2].map((k) => P(`M${36 + k * 2} 58 Q${66 + k * 4} ${42 - k * 6} 106 24`, 'none', `stroke="${['#9fd8ff', '#e8f6ff', '#5aa8ff'][k]}" stroke-width="${[3.4, 1.3, 0.6][k]}" opacity="${[0.4, 0.95, 0.8][k]}"`)).join('')
      + P('M58 42 l3 -4 l-2 -1 l4 -5 M78 32 l2 -4 l-2 0 l3 -5 M92 28 l2 -3 l-1 0 l2 -3', 'none', 'stroke="#e8f6ff" stroke-width=".5"')
      + transport(80, 42, 1.1, -14) + speeder(96, 36, 0.7, -16)
      + tie(130, 42, 0.9) + tie(146, 34, 0.7) + tie(104, 50, 0.6) + tie(20, 28, 0.6) + bolt(128, 42, 112, 46, '#3aff6a') + bolt(22, 28, 36, 30, '#3aff6a')
      // the ridge, the cannon and its emplacement, the crew
      + range([[0, 66], [20, 56], [44, 60], [64, 52], [90, 62], [120, 54], [146, 62], [160, 58]], 90, '#a8b8ca', '#7e94ac', '#eef4fa')
      + ionCannon(40, 68, 1.3) + glow(27, 16, 2.4, '#e8f6ff', 0.6)
      + drifts(72) + rebel(62, 78, 1.5) + rebel(72, 77.6, 1.4, -1, false) + officer(84, 78, 1.4, -1) + R(94, 72, 12, 6, '#7a848e', 'rx="1" stroke="#4a545e" stroke-width=".3"') + R(96, 73, 8, 2, '#2a3a4a') + R(97, 73.4, 5, 0.6, '#5ad8ff', 'opacity=".8"') + flakes(30, 2),

    // 3 · Frozen Trenches: down in the trench, Rebels firing over the snow wall
    // while a huge AT-AT strides past behind the smoke and a second walker
    // looms further back; two heavy turrets blazing, fire throwing up snow.
    frozen_trenches: () => fill([[0, '#8a9cb0'], [0.6, '#c4d0dc'], [1, '#e4ecf2']])
      + range([[0, 34], [24, 24], [48, 30], [76, 20], [104, 30], [130, 22], [160, 30]], 60, '#b4c2d2', '#8a9cb4', '#f2f6fa')
      + atat(132, 52, 0.7, false, true) + atat(78, 58, 1.5, true, false)
      + P('M0 34 C30 26 60 34 90 28 C120 22 140 30 160 26 L160 52 L0 52Z', '#d4dce6', 'opacity=".45"') + blast(54, 48, 4.4) + blast(140, 54, 3.4)
      + bolt(28, 30, 50, 42, '#ff4a2a') + bolt(150, 26, 128, 36, '#ff4a2a') + bolt(84, 56, 70, 30, '#3aff6a') + bolt(36, 38, 22, 40, '#ff4a2a')
      // the trench: snow wall, heavy turrets, troopers firing, crates
      + drifts(58, '#e8eef4') + trench(66)
      + turret(22, 66, 2) + turret(146, 66, 1.8, -1) + glow(57, 47, 1, '#ff6a3a', 0.5)
      + rebel(46, 66, 2.4) + rebel(66, 65.6, 2.3) + rebel(88, 65, 2.5, -1) + rebel(108, 65.4, 2.3) + rebel(126, 66, 2.4, -1)
      + bolt(62, 46, 76, 40, '#ff4a2a') + bolt(108, 46, 96, 40, '#ff4a2a')
      + P('M0 78 L160 76 L160 90 L0 90Z', '#c8d4e0') + [10, 40, 80, 120, 150].map((x) => E(x, 84, 8, 1.6, '#e4ecf2')).join('') + flakes(70, 3),

    // 4 · Echo Base Defenders: the command centre carved out of the ice. The
    // ribbed ceiling and conduits, the big tactical display tracking the
    // walkers, banks of consoles and screens, the holotable, officers in grey
    // uniform and quilted vests at their posts, technicians, Leia in white
    // giving orders with C-3PO at her side.
    echo_command: () => fill([[0, '#c8d4e2'], [0.5, '#e2eaf2'], [1, '#aab8c8']])
      + P('M0 0 L160 0 L160 18 Q80 8 0 18Z', '#9aaabc') + [12, 30, 48, 66, 94, 112, 130, 148].map((x) => P(`M${x} ${12 - Math.sin((x / 160) * Math.PI) * 6} Q${x + (x < 80 ? 3 : -3)} 40 ${x} 70`, 'none', 'stroke="#a8b8c8" stroke-width="1.8"')).join('')
      + P('M0 22 Q80 14 160 22 M0 25 Q80 17 160 25', 'none', 'stroke="#6a7a8c" stroke-width=".9"') + P('M0 28 Q80 20 160 28', 'none', 'stroke="#c8a040" stroke-width=".5" opacity=".7"') + [20, 56, 104, 140].map((x) => R(x - 3, 15, 6, 1.6, '#fff6d8') + C(x, 18, 9, '#fff6d8', 'opacity=".14"')).join('')
      + [[4, 30, 8, 10], [148, 30, 8, 10]].map(([x, y, w, h]) => R(x, y, w, h, '#8a98a8', 'stroke="#5a6878" stroke-width=".4"') + [0, 1, 2].map((k) => R(x + 1, y + 1 + k * 3, w - 2, 2, '#0e2a3e')).join('')).join('')
      // the tactical display: grid, terrain, the walkers' markers and the shield line
      + R(44, 26, 72, 28, '#1a2a3a', 'rx="1.4" stroke="#5a6a7c" stroke-width="1"') + R(46, 28, 68, 24, '#0e2a3e')
      + [32, 36, 40, 44, 48].map((y) => L(46, y, 114, y, '#2a5a7a', 0.3)).join('') + [54, 62, 70, 78, 86, 94, 102, 110].map((x) => L(x, 28, x, 52, '#2a5a7a', 0.3)).join('')
      + P('M48 46 Q64 40 80 44 T112 38', 'none', 'stroke="#5ad8ff" stroke-width=".7"') + P('M48 50 Q60 46 70 48 T96 46 T112 44', 'none', 'stroke="#3a8aaa" stroke-width=".5"') + [[96, 38], [104, 36], [88, 40], [108, 41]].map(([x, y]) => P(`M${x} ${y - 1.4} L${x + 1.4} ${y + 1} L${x - 1.4} ${y + 1}Z`, '#ff4a3a')).join('')
      + C(58, 46, 2.6, 'none', 'stroke="#5aff8a" stroke-width=".5"') + C(58, 46, 0.7, '#5aff8a') + P('M58 43.4 Q72 38 84 40', 'none', 'stroke="#5aff8a" stroke-width=".3" stroke-dasharray="1 1"')
      + R(48, 29.4, 22, 2, '#5ad8ff', 'opacity=".6"') + R(98, 49, 14, 1.4, '#ffcf3a', 'opacity=".7"') + R(72, 29.4, 10, 1.4, '#ff6a5a', 'opacity=".7"')
      // banks of consoles, screens and chairs
      + [[6, 38], [124, 38]].map(([x]) => R(x, 40, 30, 16, '#8a98a8', 'stroke="#5a6878" stroke-width=".5"') + [0, 1, 2].map((k) => R(x + 2 + k * 9.4, 42, 8, 6, '#0e2a3e', 'stroke="#5a6878" stroke-width=".3"') + R(x + 3 + k * 9.4, 43, 5, 1, ['#5ad8ff', '#5aff8a', '#ffcf3a'][k], 'opacity=".8"') + L(x + 3 + k * 9.4, 45.4, x + 8 + k * 9.4, 45.4, '#2a6a8a', 0.4)).join('') + R(x, 50, 30, 6, '#a8b6c4') + Array.from({ length: 12 }, (_, k) => R(x + 2 + k * 2.3, 51.4, 1.2, 0.8, ['#ff6a5a', '#5aff8a', '#ffcf3a', '#5ad8ff'][k % 4], 'opacity=".8"')).join('')).join('')
      + E(80, 66, 16, 4, '#5a6878') + E(80, 65, 14, 3.2, '#2a4a62') + P('M70 65 L76 54 L84 54 L90 65Z', '#5ad8ff', 'opacity=".14"') + E(80, 58, 5, 3, '#5ad8ff', 'opacity=".35"') + C(80, 58, 1.4, '#c8f4ff', 'opacity=".7"') + P('M76 59 L80 55 L84 59', 'none', 'stroke="#c8f4ff" stroke-width=".3"')
      // officers at the consoles, technicians, Leia with C-3PO at her side
      + officer(18, 72, 2.4, -1) + officer(34, 72.4, 2.3, 1, '#5a6270', '#6a4a2a') + officer(126, 72.4, 2.3, -1, '#7a6a5a') + officer(142, 72, 2.4, 1, '#5a6270', '#2a1a10')
      + rebel(58, 76, 2.3, 1, false) + officer(100, 76.4, 2.4, -1, '#6a7280', '#8a6a3a')
      + leia(72, 78, 2.6, 1) + threepio(88, 78, 2.5, -1)
      + R(0, 76, 160, 14, '#8a9aac') + [0, 20, 40, 60, 80, 100, 120, 140].map((x) => L(x, 76, x + 6, 90, '#7a8a9c', 0.5)).join('') + R(0, 76, 160, 0.6, '#c8a040', 'opacity=".6"'),

    // 5 · Asteroid Field (fleet): the Falcon diving into the tumbling rocks
    // with TIE fighters on its tail, Hoth glowing white behind and a Star
    // Destroyer looming at the edge of the field.
    asteroid_field: () => R(0, 0, 160, 90, '#04060c') + starfield(70, 5)
      + (() => { const [gr, d] = LG([[0, '#f0f6fc'], [0.6, '#b8c8d8'], [1, '#5a6a80']], 0, 0, 1, 1); return d + C(14, 96, 44, gr); })() + P('M-20 70 Q14 60 50 74', 'none', 'stroke="#ffffff" stroke-width=".8" opacity=".5"')
      + isd(136, 18, 1.5, '#6a727c')
      + [[40, 18, 9], [96, 12, 6], [124, 50, 11], [70, 72, 7], [148, 76, 8], [30, 50, 4], [104, 34, 3.4], [58, 32, 3], [136, 32, 2.6], [86, 58, 2.4], [16, 30, 2.2]].map(([x, y, r], k) => {
        const pts = Array.from({ length: 9 }, (_, i) => { const an = (i / 9) * Math.PI * 2; const rr = r * (0.78 + ((i * 7 + k * 3) % 5) * 0.08); return `${(x + Math.cos(an) * rr).toFixed(1)} ${(y + Math.sin(an) * rr * 0.86).toFixed(1)}`; });
        return P(`M${pts.join(' L')}Z`, ['#5a5450', '#4a4642', '#6a625a'][k % 3], 'stroke="#2a2622" stroke-width=".4"') + P(`M${pts.slice(0, 4).join(' L')} L${x} ${y}Z`, '#8a8078', 'opacity=".5"') + C(x - r * 0.3, y + r * 0.2, r * 0.2, '#2a2622', 'opacity=".6"') + C(x + r * 0.3, y - r * 0.3, r * 0.12, '#2a2622', 'opacity=".5"');
      }).join('')
      + falcon(80, 44, 1.7, -18) + P('M60 52 L44 57 M60 48 L44 50', 'none', 'stroke="#9fd8ff" stroke-width=".5" opacity=".6"')
      + tie(40, 60, 1) + tie(26, 42, 0.8) + tie(50, 72, 0.7) + bolt(42, 58, 66, 50, '#3aff6a') + bolt(28, 42, 62, 42, '#3aff6a'),

    // 6 · Wampa Country: Hoth at dusk. Layered glacier ridges and ice spires
    // under the twin moons and a faint aurora, wind tearing snow off the
    // crests; Luke on his tauntaun, tracks in the snow, and the wampa's ice
    // cave with its fringe of icicles and the great beast half-hidden in the
    // gloom, eyes glinting, one huge clawed arm reaching out.
    wampa_country: () => fill([[0, '#1a2440'], [0.45, '#4a5a86'], [0.8, '#9aa8c8'], [1, '#d4dcec']]) + starfield(30, 6)
      + P('M0 18 Q40 6 80 16 T160 12', 'none', 'stroke="#7affc8" stroke-width="3" opacity=".12"') + P('M0 22 Q50 10 100 20 T160 16', 'none', 'stroke="#9ad8ff" stroke-width="2" opacity=".1"')
      + C(36, 16, 6.4, '#e8eef6', 'opacity=".9"') + C(34, 15, 1.4, '#c8d0dc', 'opacity=".6"') + C(38.4, 18, 1, '#c8d0dc', 'opacity=".6"') + C(50, 11, 3, '#dfe6f0', 'opacity=".75"')
      + range([[0, 44], [12, 34], [26, 40], [40, 26], [56, 36], [72, 28], [88, 38], [104, 24], [120, 34], [138, 26], [160, 36]], 66, '#8a9ab8', '#5a6a90', '#e8eef8')
      + range([[0, 52], [18, 44], [34, 50], [52, 40], [70, 50], [86, 44], [100, 52]], 70, '#a8b8d0', '#7a8aac', '#f0f4fa')
      + [[30, 52, 3, 12], [44, 50, 2.4, 10], [88, 50, 2.6, 11]].map(([x, y, w, h]) => P(`M${x - w} ${y} L${x - w * 0.3} ${y - h} L${x} ${y - h - 2} L${x + w * 0.4} ${y - h} L${x + w} ${y}Z`, '#c4d4ec', 'stroke="#8a9cbc" stroke-width=".3"') + P(`M${x} ${y - h - 2} L${x + w * 0.4} ${y - h} L${x + w} ${y} L${x + w * 0.2} ${y}Z`, '#8a9cbc', 'opacity=".5"')).join('')
      + P('M40 26 Q50 22 62 24 M104 24 Q114 20 126 22', 'none', 'stroke="#ffffff" stroke-width=".8" opacity=".5"')
      // the cliff and the wampa's cave: layered ice walls, crystals, a fringe of icicles
      + P('M106 30 L160 22 L160 80 L102 80 C100 64 102 44 106 30Z', '#9ab0cc') + P('M106 30 L120 34 L116 60 L104 66Z', '#7a92b4', 'opacity=".7"') + P('M110 36 L124 40 M108 48 L120 50 M150 30 L156 46', 'none', 'stroke="#e8f2ff" stroke-width=".6"')
      + (() => { const [cv, cd] = LG([[0, '#0e1424'], [0.6, '#1e2a44'], [1, '#2a3a5a']]); return cd + P('M118 74 C116 54 128 42 140 42 C152 42 160 54 160 60 L160 74Z', cv); })()
      + P('M122 70 C121 58 130 48 140 48 C150 48 158 56 160 62', 'none', 'stroke="#5a7aa8" stroke-width=".8" opacity=".6"') + [[128, 60], [150, 56], [136, 66], [154, 66]].map(([x, y]) => P(`M${x} ${y} l1 -3 l1 3Z`, '#6a9ad8', 'opacity=".5"')).join('')
      // the wampa, huge, half in shadow: the white shaggy bulk, horns, glinting eyes, a clawed arm reaching out
      + `<g transform="translate(144 74) scale(2.4)" opacity=".7">${E(0, -7, 6, 7.4, '#cfd6e0', 'opacity=".55"')}${E(2, -8, 4, 5, '#0e1424', 'opacity=".4"')}${C(-0.4, -15.6, 3.4, '#dfe4ec', 'opacity=".7"')}${P('M-2.6 -17.6 C-4.4 -19 -5 -16.6 -3.4 -15.6 M2 -17.8 C3.8 -19.2 4.4 -16.8 2.8 -15.8', 'none', 'stroke="#b8a888" stroke-width=".8"')}${E(-1.6, -15.6, 0.6, 0.35, '#ffd23a')}${E(0.8, -15.6, 0.6, 0.35, '#ffd23a')}${glow(-0.4, -15.6, 0.6, '#ffd23a', 0.4)}${P('M-2 -13.6 Q-0.4 -12.6 1.2 -13.6', 'none', 'stroke="#5a1a1a" stroke-width=".5"')}${P('M-4.6 -10 C-8 -9 -11 -6 -12 -3 L-10.6 -2.4 C-9.6 -5 -7 -7.4 -4.4 -8Z', '#d8dee6', 'opacity=".85"')}${P('M-12 -3 l-1 1.6 M-11.2 -2.6 l-.4 1.8 M-10.4 -2.4 l.2 1.8', 'none', 'stroke="#3a3a40" stroke-width=".4"')}${[-6, -4, -2].map((yy) => P(`M-5 ${yy} l-.6 1 M-3 ${yy - 1} l-.4 1`, 'none', 'stroke="#aab4c2" stroke-width=".3"')).join('')}</g>`
      + (() => { const [sh, sd] = LG([[0, '#0a0e1a', 0.8], [0.6, '#0a0e1a', 0.6], [1, '#0a0e1a', 0.45]], 0, 0, 1, 0); return sd + P('M120 74 C118 54 128 44 140 44 C152 44 160 54 160 60 L160 74Z', sh); })()
      + Array.from({ length: 14 }, (_, k) => { const x = 119 + k * 2.9; const y = 52 - Math.sin((k / 13) * Math.PI) * 9.6 + (k > 9 ? (k - 9) * 1.2 : 0); const h = 3 + ((k * 7) % 5) * 1.3; return P(`M${(x - 0.9).toFixed(1)} ${y.toFixed(1)} L${x.toFixed(1)} ${(y + h).toFixed(1)} L${(x + 0.9).toFixed(1)} ${y.toFixed(1)}Z`, '#e4f2ff', 'opacity=".92" stroke="#9ac0e8" stroke-width=".2"') + L(x - 0.3, y + 0.4, x - 0.1, y + h * 0.7, '#ffffff', 0.25); }).join('')
      // the snow, the tracks, and Luke on his tauntaun
      + drifts(72, '#e8eef6', '#b8c8dc') + P('M0 70 Q30 64 60 70', 'none', 'stroke="#ffffff" stroke-width="4" opacity=".35"')
      + `<g transform="translate(66 76) scale(1.7)">${E(0, 0.6, 7, 1, '#000', 'opacity=".15"')}${P('M-6 -4 C-6 -8 2 -9 4 -7 L7 -10 C8.4 -11 9.6 -10 9 -8.6 L6 -5 C6 -2 3 0 0 0 L-4 0 C-7 0 -8 -2 -6 -4Z', '#d8ccb8', 'stroke="#8a7a62" stroke-width=".3"')}${P('M-5 -3 Q-2 -1 2 -2', 'none', 'stroke="#b8a890" stroke-width=".3"')}${P('M8.6 -10.4 L10 -12.6 M7.6 -10.6 L8.4 -13', 'none', 'stroke="#c8b8a0" stroke-width=".6"')}${C(8.4, -9.4, 0.25, '#1a1008')}${L(-3, 0, -4, 4, '#b8a890', 0.9)}${L(2, 0, 3, 4, '#b8a890', 0.9)}${P('M-7 -2 Q-10 0 -11 3', 'none', 'stroke="#c8b8a0" stroke-width=".7"')}${P('M-3.4 -7.4 L-5.4 -8 L-6.6 -12 L-4 -12Z', '#5a6a8a')}${P('M-2.4 -9 L0 -12 L-1 -16 L-3.6 -14Z', '#c8b896', 'stroke="#7a6a4a" stroke-width=".2"')}${L(-0.4, -12, 1.6, -9.4, '#c8b896', 0.7)}${C(-2, -16.6, 1.4, '#d8b896')}${P('M-3.4 -17 C-3.4 -18.6 -0.6 -18.6 -0.6 -17Z', '#e6dcc8')}${R(-3, -17.2, 2, 0.6, '#2a3040')}</g>`
      + Array.from({ length: 10 }, (_, k) => E(16 + k * 5.4, 84 - k * 0.6, 1, 0.5, '#aabcd0') + E(18.4 + k * 5.4, 85 - k * 0.6, 1, 0.5, '#aabcd0')).join('') + flakes(80, 6),

    // 7 · Hangar Breach: Echo Base's main hangar, clear and wide. The ribbed
    // ice vault with its light rigs, the Millennium Falcon side-on on its pad
    // with the ramp down, a row of parked X-wings and snowspeeders, crates
    // and fuel lines, Rebels running for their ships and firing back, and on
    // the right the blast wall torn open, snowtroopers storming through.
    hangar_breach: () => fill([[0, '#4a5a70'], [0.4, '#8a9ab0'], [1, '#c4d0dc']])
      + P('M0 0 L160 0 L160 30 Q80 6 0 30Z', '#6a7a90') + [8, 24, 40, 56, 72, 88, 104, 120, 136, 152].map((x) => P(`M${x} ${28 - Math.sin((x / 160) * Math.PI) * 20} Q${x} 36 ${x + (x < 80 ? -2 : 2)} 56`, 'none', 'stroke="#aabace" stroke-width="2.6" opacity=".7"')).join('')
      + P('M0 30 Q80 6 160 30', 'none', 'stroke="#3a4a5e" stroke-width="1"') + P('M10 26 Q80 8 150 26', 'none', 'stroke="#5a6a7e" stroke-width=".6"')
      + [24, 56, 88, 120].map((x) => R(x - 6, 13 - Math.sin((x / 160) * Math.PI) * 2, 12, 1.8, '#3a4656') + R(x - 5, 14.4 - Math.sin((x / 160) * Math.PI) * 2, 10, 0.8, '#fff6d8') + P(`M${x - 5} 15 L${x + 5} 15 L${x + 12} 62 L${x - 12} 62Z`, '#fff6d8', 'opacity=".06"')).join('')
      // the far wall: hangar bays, pipes, a gantry
      + R(0, 40, 160, 22, '#7a8aa0') + [10, 34, 58, 82].map((x) => R(x, 44, 18, 14, '#4a5a70', 'stroke="#3a4a5e" stroke-width=".4"')).join('') + R(0, 40, 160, 1.4, '#5a6a80') + P('M0 48 L100 48 M0 51 L100 51', 'none', 'stroke="#5a6070" stroke-width=".5"')
      // the blast wall on the right, torn open; snowtroopers storming through the smoke
      + R(108, 34, 52, 30, '#8a9ab0', 'stroke="#4a5a70" stroke-width=".5"') + [116, 126, 136, 146, 156].map((x) => L(x, 34, x, 64, '#6a7a90', 0.6)).join('')
      + P('M118 64 L118 50 C120 42 130 38 138 40 C148 42 154 50 152 58 L150 64Z', '#141a24') + P('M118 50 L114 46 L120 44Z M138 40 L140 34 L144 41Z M152 58 L158 56 L154 62Z M130 39 L128 35 L133 38Z', '#9aaabe') + E(136, 52, 16, 10, '#5a6270', 'opacity=".35"') + blast(124, 46, 4.4) + blast(150, 50, 3)
      + snowt(130, 64, 1.9, -1) + snowt(142, 64, 1.8, -1) + snowt(120, 70, 2.2, -1) + snowt(150, 68, 2, -1)
      // the Falcon on its pad, ramp down; X-wings and snowspeeders parked; crates and fuel lines
      + E(52, 70, 34, 4, '#3a4656', 'opacity=".45"') + R(18, 68, 68, 2, '#ffcf3a', 'opacity=".35"') + falconSide(50, 60, 1.25)
      + xwingSide(16, 50, 0.9) + xwingSide(40, 50, 0.9) + xwingSide(100, 66, 1.2, -1) + speeder(84, 50, 1.3, 0)
      + R(88, 68, 7, 6, '#7a6a4a', 'stroke="#4a3a2a" stroke-width=".4"') + R(94, 70, 6, 4, '#6a5a3a', 'stroke="#4a3a2a" stroke-width=".4"') + P('M20 72 Q34 78 48 74 M76 70 Q86 78 98 76', 'none', 'stroke="#2a3240" stroke-width=".9"')
      // Rebels running for the ships and firing back across the hangar
      + bolt(118, 58, 98, 68, '#ff4a2a') + bolt(130, 56, 110, 60, '#ff4a2a') + bolt(102, 74, 122, 64, '#ff4a2a') + bolt(84, 72, 116, 62, '#ff4a2a')
      + P('M0 76 L160 74 L160 90 L0 90Z', '#a8b6c6') + [0, 20, 40, 60, 80, 100, 120, 140].map((x) => L(x, 76, x - 8, 90, '#8a98a8', 0.5)).join('') + R(0, 86, 160, 1, '#ffcf3a', 'opacity=".5"')
      + rebel(14, 88, 1.6, 1) + rebel(30, 89, 1.7, 1) + rebel(104, 88, 1.6, 1) + rebel(118, 89, 1.7, 1) + leia(86, 88, 1.6, -1) + threepio(96, 88, 1.5, -1)
      + flakes(26, 7),

    // 8 · Shield Generator: the great shield generator on the snowfield: the
    // armoured base with its doors and vents, two latticed pylons and the big
    // dish array with its blue glow; AT-ATs closing in and firing on it,
    // snowspeeders making a run, Rebels falling back through the fire.
    shield_generator: () => fill([[0, '#7a8ea8'], [0.55, '#b4c4d6'], [1, '#e0e8f0']])
      + range([[0, 44], [20, 32], [38, 38], [58, 28], [76, 36], [96, 26], [118, 34], [140, 26], [160, 32]], 62, '#a4b4c8', '#7e92aa', '#eef4fa')
      // the generator: base, doors, vents; two lattice pylons; the dish array and its glow
      + E(54, 64, 30, 6, '#8a96a6') + P('M26 64 C26 50 82 50 82 64Z', '#b8c4d2', 'stroke="#5a6676" stroke-width=".6"') + [34, 42, 50, 58, 66, 74].map((x) => L(x, 54 + Math.abs(54 - x) * 0.1, x, 64, '#7a8696', 0.4)).join('')
      + R(48, 58, 12, 6, '#3a4656', 'stroke="#5a6676" stroke-width=".4"') + R(49, 59, 10, 1.2, '#ffe8a0', 'opacity=".5"') + [[32, 59], [72, 59]].map(([x, y]) => R(x, y, 5, 2.4, '#5a6676') + [1, 2, 3, 4].map((k) => L(x + k, y + 0.3, x + k, y + 2.1, '#8a96a4', 0.3)).join('')).join('')
      + [44, 60].map((px) => R(px, 22, 4, 32, '#9aa6b6', 'stroke="#5a6676" stroke-width=".4"') + Array.from({ length: 8 }, (_, k) => L(px, 24 + k * 4, px + 4, 28 + k * 4, '#6a7686', 0.35) + L(px + 4, 24 + k * 4, px, 28 + k * 4, '#6a7686', 0.35)).join('')).join('')
      + [28, 36, 44, 52].map((y) => L(48, y, 60, y, '#7a8696', 0.6)).join('') + R(46, 52, 16, 2, '#7a8696')
      + `<g transform="rotate(-10 54 18)">${E(54, 18, 24, 7, '#d0d8e2', 'stroke="#5a6676" stroke-width=".6"')}${E(54, 17, 20, 5, '#a8b4c2')}${Array.from({ length: 9 }, (_, k) => L(54, 17, 54 + Math.cos((k / 9) * Math.PI * 2) * 20, 17 + Math.sin((k / 9) * Math.PI * 2) * 5, '#8a96a4', 0.3)).join('')}${L(54, 17, 54, 6, '#5a6676', 0.9)}${glow(54, 6, 1.6, '#9fd8ff', 0.6)}</g>`
      + P('M26 16 Q54 -2 82 16', 'none', 'stroke="#9fd8ff" stroke-width="1" opacity=".55"') + P('M22 20 Q54 0 86 20', 'none', 'stroke="#9fd8ff" stroke-width=".5" opacity=".35"')
      // AT-ATs closing in and firing; snowspeeders making a run
      + atat(122, 64, 0.66, true, false) + atat(150, 62, 0.48, false, true) + bolt(96, 48.6, 68, 30, '#ff4a2a') + bolt(132, 50, 72, 40, '#ff4a2a') + blast(68, 32, 4)
      + speeder(100, 16, 1.4, -10) + speeder(120, 26, 1, -8) + bolt(112, 18, 118, 24, '#ff4a2a') + tie(140, 12, 0.7)
      // the snowfield, Rebels falling back through the fire
      + drifts(68) + trench(78) + rebel(30, 78, 1.8, -1) + rebel(44, 79, 1.9, -1) + rebel(86, 78, 1.8, 1) + rebel(100, 77, 1.7, 1) + officer(60, 80, 1.8, -1) + blast(112, 74, 3.4) + flakes(60, 8),

    // 9 · Escape from Hoth (fleet): from orbit, Hoth below. The transports
    // climb steeply off the planet on a diagonal with their X-wing escort,
    // ion bolts arcing up past the blockading Star Destroyers, the Falcon
    // racing clear, TIEs closing.
    escape_hoth: () => R(0, 0, 160, 90, '#03050c') + starfield(80, 9)
      + (() => { const [gr, d] = LG([[0, '#f6fafe'], [0.55, '#c4d4e4'], [1, '#6a7e98']], 0, 0, 1, 1); return d + C(40, 150, 96, gr); })() + P('M-40 80 Q40 50 130 82', 'none', 'stroke="#ffffff" stroke-width="1.4" opacity=".4"') + P('M-10 84 Q30 70 70 76 M60 72 Q90 66 120 80', 'none', 'stroke="#aabcd0" stroke-width="1" opacity=".6"')
      + isd(118, 18, 2, '#7a828c') + isd(52, 12, 1.1, '#6a727c') + isd(150, 40, 1, '#5a626c')
      + [0, 1].map((k) => P(`M${30 + k * 8} 70 Q${70 + k * 6} ${44 - k * 4} ${108 - k * 2} ${20 + k * 2}`, 'none', `stroke="${k ? '#e8f6ff' : '#9fd8ff'}" stroke-width="${k ? 1 : 2.8}" opacity="${k ? 0.95 : 0.4}"`)).join('') + blast(108, 20, 3.4) + glow(108, 20, 3, '#9fd8ff', 0.5)
      + transport(52, 62, 1.5, -32) + transport(78, 46, 1.2, -32) + transport(100, 30, 0.9, -32)
      + P('M36 72 L46 66 M62 56 L72 50 M86 40 L94 35', 'none', 'stroke="#9fd8ff" stroke-width=".6" opacity=".6"')
      + [[66, 60], [88, 44], [110, 28], [46, 50]].map(([x, y]) => `<g transform="translate(${x} ${y}) rotate(-32) scale(1.1)">${P('M-7 0 L6 -0.8 L9 0 L6 0.8Z', '#e4e2dc', 'stroke="#7a786e" stroke-width=".3"')}${P('M-3 0 L-6 -5 L-4.6 -5 L0 -0.4Z M-3 0 L-6 5 L-4.6 5 L0 0.4Z', '#d8d6ce')}${L(-6, -5, 2, -5, '#7a786e', 0.4)}${L(-6, 5, 2, 5, '#7a786e', 0.4)}${R(-1, -0.6, 2, 1.2, '#c8402a')}${C(-7.4, 0, 0.7, '#ff8a6a')}</g>`).join('')
      + falcon(132, 64, 1.5, -24) + tie(30, 30, 0.8) + tie(40, 22, 0.6) + tie(140, 30, 0.7) + bolt(32, 30, 50, 40, '#3aff6a') + bolt(118, 52, 132, 44, '#ff4a2a'),

    // 10 · Vader Arrives: a wrecked Echo Base corridor lit red by the emergency
    // lights: ribbed ice walls with panels, pipes and frost, ice and debris on
    // the floor, sparking cables, and Darth Vader striding through the smoke
    // with snowtroopers at his back.
    vader_arrives: () => fill([[0, '#2a1e26'], [0.5, '#4a3644'], [1, '#1a141a']])
      + P('M0 0 L56 30 L104 30 L160 0Z', '#3a2e3a') + P('M0 90 L56 62 L104 62 L160 90Z', '#2a2026') + P('M0 0 L56 30 L56 62 L0 90Z', '#4a3a48') + P('M160 0 L104 30 L104 62 L160 90Z', '#3e3240')
      + [0.2, 0.4, 0.6, 0.8].map((k) => { const x = k * 56; const y0 = k * 30; const y1 = 90 - k * 28; return L(x, y0, x, y1, '#6a5a6a', 1.6 - k) + L(160 - x, y0, 160 - x, y1, '#6a5a6a', 1.6 - k); }).join('')
      + [[4, 18, 8, 16], [20, 22, 7, 12], [126, 22, 8, 12], [146, 18, 8, 16]].map(([x, y, w, h]) => R(x, y, w, h, '#2a2028', 'stroke="#6a5a6a" stroke-width=".4"') + R(x + 1, y + 1.4, w - 2, 1.4, '#ff3a2a', 'opacity=".35"') + L(x + 1, y + h * 0.6, x + w - 1, y + h * 0.6, '#5a4a5a', 0.4)).join('')
      + P('M0 54 L56 46 M0 58 L56 49 M160 54 L104 46 M160 58 L104 49', 'none', 'stroke="#5a4a58" stroke-width=".9"') + [[10, 8], [30, 16], [130, 16], [150, 8]].map(([x, y]) => P(`M${x} ${y} l2 4 l-1 2 l2 3`, 'none', 'stroke="#e8e0f0" stroke-width=".4" opacity=".5"')).join('')
      + R(56, 30, 48, 32, '#1a1418') + E(80, 46, 22, 16, '#c8b8c8', 'opacity=".12"')
      + [[16, 14], [144, 14], [40, 26], [120, 26]].map(([x, y]) => C(x, y, 1.4, '#ff3a2a') + C(x, y, 9, '#ff3a2a', 'opacity=".14"')).join('')
      + P('M30 4 Q34 20 28 30 M132 6 Q128 18 134 28', 'none', 'stroke="#1a1418" stroke-width=".9"') + glow(28, 30, 0.8, '#ffe8a0', 0.6) + glow(134, 28, 0.6, '#ffe8a0', 0.5)
      + [[20, 82, 6], [44, 76, 4], [118, 78, 5], [140, 84, 7], [70, 72, 3]].map(([x, y, w]) => P(`M${x - w} ${y} L${x - w * 0.4} ${y - w * 0.6} L${x + w * 0.5} ${y - w * 0.4} L${x + w} ${y}Z`, '#c8d0dc', 'opacity=".85"')).join('')
      + [[30, 70], [130, 72], [60, 84]].map(([x, y]) => R(x, y, 6, 2, '#5a4a52', `transform="rotate(20 ${x} ${y})"`)).join('')
      // snowtroopers at his back, then Vader striding forward, cape swirling
      + snowt(62, 68, 2, 1) + snowt(98, 68, 2, -1) + snowt(72, 64, 1.5, 1) + snowt(88, 64, 1.5, -1) + E(80, 52, 30, 10, '#d8d0d8', 'opacity=".08"')
      + `<g transform="translate(80 84)">${E(0, 1, 14, 2, '#000', 'opacity=".4"')}${P('M-12 0 C-14 -10 -12 -22 -6 -30 L6 -30 C12 -22 15 -10 13 0Z', '#0a0a0e')}${P('M-6 -30 C-10 -18 -11 -8 -10 0 L-4 0 C-5 -10 -4 -20 -2 -30Z', '#16161c')}${P('M-5 -30 L5 -30 L6 -14 L-6 -14Z', '#1a1a20')}${R(-4, -24, 8, 4, '#2a2a30', 'rx=".6"')}${[-2.4, -0.8, 0.8, 2.4].map((px, k) => R(px - 0.4, -23, 0.8, 1, ['#ff3a2a', '#3aff6a', '#3a8aff', '#ffcf3a'][k])).join('')}${R(-5, -14, 10, 1.6, '#3a3a40')}${C(0, -13.2, 1, '#8a8a90')}${P('M-4 -36 C-4 -42 4 -42 4 -36 L5 -32 L2 -30 L-2 -30 L-5 -32Z', '#0e0e12')}${P('M-4 -36 C-4 -41 4 -41 4 -36Z', '#2a2a32', 'opacity=".6"')}${P('M-3 -35 L-0.6 -35 L-0.8 -33.6 L-3 -34Z M3 -35 L0.6 -35 L0.8 -33.6 L3 -34Z', '#3a3a44')}${P('M-1.2 -32.6 L1.2 -32.6 L0.8 -30.6 L-0.8 -30.6Z', '#5a5a64')}${L(6, -16, 9, -10, '#0a0a0e', 2)}${E(-1, -39.6, 2, 0.8, '#ffffff', 'opacity=".25"')}</g>`
      + flakes(24, 10, '#e8e0e8', 0.5) + R(0, 0, 160, 90, 'none', 'stroke="#000" stroke-width="10" opacity=".35"'),
  };
  Object.assign(SA.scenes, H);
  SA.worlds.hoth = ['echo_perimeter', 'ion_cannon', 'frozen_trenches', 'echo_command', 'asteroid_field', 'wampa_country', 'hangar_breach', 'shield_generator', 'escape_hoth', 'vader_arrives'];
})(typeof window !== 'undefined' ? window : globalThis);
