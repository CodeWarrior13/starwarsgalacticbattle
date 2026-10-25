// Update 2.4: the ten Hoth stage scenes, for approval. Same 160x90 format as
// Tatooine, built on the same idea: one image per stage that says exactly
// where you are. Echo Base's entrance in the ice, the ion cannon firing on a
// Star Destroyer, the trench line under an AT-AT, the command centre, the
// asteroid field, wampa country, the hangar breach, the shield generator,
// the transports' escape, and Vader striding into the base.
(function (root) {
  'use strict';
  const K = root.ArtX;
  const SA = root.StageArt24;
  if (!K || !SA) return;
  const { P, E, C, R, L, LG } = K;
  const fill = (stops) => { const [g, d] = LG(stops); return d + R(0, 0, 160, 90, g); };
  const glow = (x, y, r, c, a = 0.18) => C(x, y, r * 2.4, c, `opacity="${a * 0.5}"`) + C(x, y, r * 1.6, c, `opacity="${a}"`);
  // Falling snow and stars, placed the same way every time.
  const flakes = (n, seed, c = '#ffffff', a = 0.85) => Array.from({ length: n }, (_, k) => C(((k * 37 + seed * 13) % 160), ((k * 53 + seed * 7) % 90), (0.25 + (k % 3) * 0.18).toFixed(2), c, `opacity="${(a - (k % 4) * 0.15).toFixed(2)}"`)).join('');
  const starfield = (n, seed) => Array.from({ length: n }, (_, k) => C(((k * 41 + seed * 11) % 160), ((k * 67 + seed * 5) % 90), (0.2 + (k % 3) * 0.15).toFixed(2), '#ffffff', `opacity="${(0.4 + (k % 4) * 0.15).toFixed(2)}"`)).join('');
  // Snowdrifts: a wavy snow surface with blue shadow ridges.
  const drifts = (y, c1 = '#eef4fa', c2 = '#cddbe8') => P(`M0 ${y} C24 ${y - 4} 44 ${y - 3} 64 ${y} C88 ${y - 5} 112 ${y - 4} 136 ${y - 1} C146 ${y - 2} 154 ${y - 2} 160 ${y} L160 90 L0 90Z`, c1)
    + P(`M36 ${y + 1} C46 ${y + 4} 56 ${y + 4} 64 ${y} M108 ${y - 3} C118 ${y + 1} 128 ${y + 2} 136 ${y - 1} M4 ${y + 6} C20 ${y + 9} 34 ${y + 9} 46 ${y + 6} M90 ${y + 8} C104 ${y + 11} 120 ${y + 11} 134 ${y + 8}`, 'none', `stroke="${c2}" stroke-width="1.4" opacity=".8"`);
  // An AT-AT walking left: body with panels, segmented neck, the wedge head and
  // chin guns, four jointed legs on round feet. (x, y) is where the feet stand.
  const atat = (x, y, sc, stride, far) => {
    const c = far ? '#a6b0bc' : '#8a94a2'; const d = far ? '#6e7884' : '#4e5866'; const lit = '#c8d0da';
    const leg = (lx, ph) => {
      const kx = lx + (ph ? 1.4 : -1.4); const fx = lx + (ph ? -0.6 : 0.6);
      return P(`M${lx - 1.6} -20 L${lx + 1.6} -20 L${kx + 1.5} -11 L${kx - 1.5} -11Z`, c, `stroke="${d}" stroke-width=".3"`) + C(kx, -11, 1.8, d)
        + P(`M${kx - 1.3} -11 L${kx + 1.3} -11 L${fx + 1.2} -1.4 L${fx - 1.2} -1.4Z`, c, `stroke="${d}" stroke-width=".3"`) + E(fx, -0.7, 2.9, 1, d) + R(fx - 2.4, -1.8, 4.8, 1.2, c);
    };
    return `<g transform="translate(${x} ${y}) scale(${sc})">`
      + E(0, 0.4, 22, 1.4, '#000', 'opacity=".14"') + leg(-10, stride) + leg(9, !stride)
      + P('M-14 -30 L12 -31 L16 -27 L15 -19 L-14 -18 L-17 -24Z', c, `stroke="${d}" stroke-width=".5"`) + P('M-14 -30 L12 -31 L16 -27 L-17 -24Z', lit, 'opacity=".5"')
      + L(-16, -22.6, 15.6, -23.4, d, 0.5) + [-8, -2, 4, 10].map((px) => L(px, -30.6, px, -18.4, d, 0.35)).join('') + R(-6, -21.6, 9, 2.2, d, 'opacity=".55"') + R(4, -29, 5, 1.4, d, 'opacity=".5"')
      + [-18.4, -20, -21.6].map((nx, k) => R(nx - 0.8, -27 + k * 0.2, 1.6, 4.4, d, 'rx=".3"')).join('')
      + P('M-34 -28 L-22 -29.6 L-20 -24 L-24 -19.6 L-34 -21Z', c, `stroke="${d}" stroke-width=".5"`) + P('M-34 -28 L-22 -29.6 L-21.4 -27.4 L-33.6 -26.2Z', lit, 'opacity=".6"')
      + R(-31.6, -26, 4.4, 1.2, '#1a1e24') + L(-33.6, -23.4, -22, -24.4, d, 0.4)
      + R(-40, -22.6, 7, 1, d) + R(-39, -20.8, 6, 0.9, d) + R(-37, -25, 4, 0.8, d)
      + leg(-6, !stride) + leg(13, stride) + '</g>';
  };
  // A T-47 snowspeeder flying right, with its orange stripe.
  const speeder = (x, y, s, a = 0) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">${P('M-8 1.6 L-6 -1.6 L6 -2 L10 0 L6 2Z', '#e4e8ec', 'stroke="#7a828c" stroke-width=".3"')}${P('M-8 1.6 L-10.4 -1 L-8.4 -1.8 L-6 -1.6Z', '#c8ced6')}${P('M1 -1.8 L4 -1.8 L5.4 -0.4 L1.6 -0.4Z', '#3a4a5a')}${R(-4, -0.6, 5, 1.2, '#d0662a')}${E(-10, -0.2, 0.8, 1.2, '#ffb070')}</g>`;
  // A Rebel soldier in Hoth gear: beige coat, belt, helmet with goggles, rifle.
  const rebel = (x, y, s, f = 1) => `<g transform="translate(${x} ${y}) scale(${s * f} ${s})">${P('M-2.2 0 L-2.6 -7 C-2.6 -9 2.6 -9 2.6 -7 L2.2 0Z', '#c8b896', 'stroke="#7a6a4a" stroke-width=".25"')}${R(-2.5, -4.6, 5, 1, '#6a5a3a')}${C(0, -10, 1.9, '#e0d0b0', 'stroke="#7a6a4a" stroke-width=".25"')}${R(-1.6, -10.4, 3.2, 0.9, '#2a3040')}${L(1.8, -7, 6.4, -8.4, '#2a2a2e', 0.8)}</g>`;
  // A snowtrooper: white padded suit, the hood skirt, dark goggles, rifle.
  const snowt = (x, y, s, f = 1) => `<g transform="translate(${x} ${y}) scale(${s * f} ${s})">${P('M-2.4 0 L-2.8 -7.4 C-2.8 -9.4 2.8 -9.4 2.8 -7.4 L2.4 0Z', '#eef2f6', 'stroke="#8a96a4" stroke-width=".3"')}${P('M-2.8 -6.4 L-3.8 -1.4 L3.8 -1.4 L2.8 -6.4Z', '#dfe5ec', 'stroke="#aab4be" stroke-width=".25"')}${P('M-2.2 -9 L-2.8 -6.4 L2.8 -6.4 L2.2 -9Z', '#e8edf2')}${C(0, -10.6, 2, '#f6f8fa', 'stroke="#8a96a4" stroke-width=".3"')}${R(-1.6, -11, 3.2, 0.8, '#1a1e24')}${L(2, -7.4, 6.6, -8.8, '#1a1c20', 0.8)}</g>`;
  const tie = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${R(-4.4, -4.4, 1.2, 8.8, '#3a3e46')}${R(3.2, -4.4, 1.2, 8.8, '#3a3e46')}${L(-3.2, 0, 3.2, 0, '#5a5e66', 0.9)}${C(0, 0, 1.8, '#6a6e76')}${C(0, 0, 0.8, '#1a1e24')}</g>`;
  // An Imperial Star Destroyer, side-on, nose to the left.
  const isd = (x, y, s, c = '#8a929c') => `<g transform="translate(${x} ${y}) scale(${s})">${P('M-24 2 L18 -3 L22 1 L18 4Z', c, 'stroke="#4a525c" stroke-width=".3"')}${P('M-24 2 L18 -3 L22 1Z', '#d0d6dc', 'opacity=".4"')}${L(-20, 2.2, 20, 1.6, '#5a626c', 0.3)}${R(8, -6, 6, 3, c)}${R(10, -8.4, 2.4, 2.4, c)}${C(9.4, -8.8, 0.7, c)}${C(12.6, -8.8, 0.7, c)}${glow(22, 1, 1, '#9fd8ff', 0.45)}</g>`;
  // The v-150 ion cannon: domed ball on its base, the barrel aimed at the sky.
  const ionCannon = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M-12 0 L-8 -6 L8 -6 L12 0Z', '#7a8694', 'stroke="#4a5664" stroke-width=".4"')}${R(-7, -9, 14, 3.4, '#8a96a4', 'stroke="#4a5664" stroke-width=".4"')}${C(0, -17, 9.6, '#c4ccd6', 'stroke="#5a6674" stroke-width=".5"')}${P('M-9.6 -17 A9.6 9.6 0 0 0 9.6 -17Z', '#8e9aa8')}${[-12.4, -17, -21.6].map((yy) => L(-8.8, yy, 8.8, yy, '#6a7684', 0.4)).join('')}${E(-3, -22, 3, 1.4, '#ffffff', 'opacity=".4"')}${P('M-3 -25 L-9.6 -33.4 L-7.2 -35 L-0.6 -26.6Z', '#5a6674', 'stroke="#3a4654" stroke-width=".3"')}${C(-8.4, -34.2, 1.8, '#3a4654')}</g>`;
  // A GR-75 transport: the clamshell hull with its cargo pods, nose to the right.
  const transport = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M-14 0 C-14 -3.6 -8 -5 0 -5 L12 -3 C15 -2 15 2 12 3 L0 5 C-8 5 -14 3.6 -14 0Z', '#b8bcc0', 'stroke="#5a6068" stroke-width=".4"')}${[-9, -5, -1, 3].map((px) => R(px, -2, 3.2, 4, '#8a7a5a', 'rx=".4"')).join('')}${P('M8 -3.6 L14 -1 L14 1 L8 3.6Z', '#a8acb0')}${glow(-14.6, 0, 1.4, '#9fd8ff', 0.5)}</g>`;
  // The Millennium Falcon from above-ish: the disc, the twin mandibles, the cockpit tube, the dish.
  const falcon = (x, y, s, a = 0) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">${E(0, 0, 9, 7.4, '#c8c4bc', 'stroke="#6a665e" stroke-width=".4"')}${P('M6 -2.6 L13 -2.2 L13 -0.6 L7.4 -0.8Z M6 2.6 L13 2.2 L13 0.6 L7.4 0.8Z', '#c0bcb4', 'stroke="#6a665e" stroke-width=".3"')}${P('M2 4.4 L6 8.6 L8 7.8 L5 4Z', '#b8b4ac', 'stroke="#6a665e" stroke-width=".3"')}${C(7.4, 8.2, 1.1, '#a8a49c', 'stroke="#6a665e" stroke-width=".3"')}${C(0, 0, 2.8, '#b0aca4', 'stroke="#6a665e" stroke-width=".3"')}${C(-2.4, -3.6, 1.4, '#d0ccc4')}${E(-8.4, 0, 0.9, 4.6, '#9fd8ff', 'opacity=".85"')}${[[-4, 2], [3, -4], [-5, -3]].map(([px, py]) => R(px, py, 2, 1.2, '#8a867e', 'opacity=".7"')).join('')}</g>`;
  const xwing = (x, y, s, a = 0) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">${P('M-7 0 L6 -0.8 L9 0 L6 0.8Z', '#e4e2dc', 'stroke="#7a786e" stroke-width=".3"')}${P('M-3 0 L-6 -5 L-4.6 -5 L0 -0.4Z M-3 0 L-6 5 L-4.6 5 L0 0.4Z', '#d8d6ce')}${L(-6, -5, 2, -5, '#7a786e', 0.4)}${L(-6, 5, 2, 5, '#7a786e', 0.4)}${R(-1, -0.6, 2, 1.2, '#c8402a')}${C(-7.4, 0, 0.7, '#ff8a6a')}</g>`;
  const blast = (x, y, r) => glow(x, y, r, '#ff9a3a', 0.35) + C(x, y, r, '#ffb04a', 'opacity=".85"') + C(x, y, r * 0.55, '#fff0b0') + E(x, y - r * 1.6, r * 1.8, r * 1.2, '#4a5260', 'opacity=".45"') + E(x + r * 0.6, y - r * 2.8, r * 1.4, r, '#5a626e', 'opacity=".3"');
  const bolt = (x1, y1, x2, y2, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="1.6" stroke-linecap="round" opacity=".35"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffffff" stroke-width=".5" stroke-linecap="round"/>`;

  const H = {
    // 1 · Echo Base Perimeter: the base's hangar doors cut into the ice
    // mountain, the snow trench with its turret and Rebel troopers, AT-ATs
    // on the horizon and snowspeeders heading out to meet them.
    echo_perimeter: () => fill([[0, '#7890aa'], [0.55, '#b8c8d8'], [1, '#e4ecf4']])
      + P('M86 40 L100 30 L114 36 L128 26 L144 34 L160 28 L160 62 L86 62Z', '#a8b8ca') + P('M100 30 L104 34 L99 35Z M128 26 L133 31 L126 32Z M160 28 L156 33 L151 32Z', '#eef4fa')
      // the ice mountain with the hangar entrance
      + P('M0 18 L16 8 L30 15 L48 4 L64 18 L80 26 L92 44 L92 64 L0 64Z', '#c4d2e2') + P('M48 4 L64 18 L80 26 L92 44 L92 64 L70 64 L66 30Z', '#9aaec4', 'opacity=".7"') + P('M16 8 L22 13 L14 15Z M48 4 L54 11 L44 12Z', '#f4f8fc')
      + P('M10 30 L30 24 M8 40 L36 34 M20 50 L44 44 M60 26 L74 32 M62 40 L82 44', 'none', 'stroke="#8aa0b8" stroke-width=".6" opacity=".8"')
      + P('M26 64 L26 46 L56 42 L56 64Z', '#2a3440', 'stroke="#6a7a8c" stroke-width="1.2"') + P('M28 64 L28 48 L54 44.4 L54 64Z', '#3a4858') + [33, 40, 47].map((px) => L(px, 64, px, 47 - (px - 28) * 0.13, '#2a3440', 0.6)).join('') + R(28, 58, 26, 6, '#ffe8a0', 'opacity=".2"') + glow(41, 60, 4, '#ffe8a0', 0.25)
      + R(24, 44, 34, 2, '#7a8a9c') + [30, 52].map((px) => C(px, 45, 0.6, '#ff6a3a')).join('')
      // AT-ATs coming over the horizon, snowspeeders flying out
      + atat(126, 60, 0.42, true, true) + atat(150, 61, 0.34, false, true) + atat(108, 61, 0.3, false, true)
      + speeder(72, 22, 1.1, -6) + speeder(96, 30, 0.8, -4) + speeder(58, 34, 0.7, -8)
      + bolt(112, 52, 98, 48, '#ff4a2a') + bolt(130, 50, 118, 46, '#ff4a2a')
      // the snowfield and the trench: snow wall, sandbags, a DF.9 turret, troopers
      + drifts(64) + P('M0 72 C40 68 80 70 120 68 C140 67 150 68 160 68 L160 76 L0 78Z', '#dfe8f2', 'stroke="#aabbcc" stroke-width=".5"')
      + Array.from({ length: 16 }, (_, k) => E(6 + k * 10, 71 - (k % 3) * 0.6, 5, 2.2, '#e8eef4', 'stroke="#a8b4c0" stroke-width=".4"')).join('')
      + `<g transform="translate(118 68)">${R(-6, -4, 12, 6, '#7a848e', 'rx="1" stroke="#4a545e" stroke-width=".4"')}${R(-3, -9, 6, 5, '#8a949e', 'stroke="#4a545e" stroke-width=".4"')}${L(-3, -7, -12, -9, '#4a545e', 1.4)}${C(-12, -9, 0.8, '#ff6a3a')}${R(-1.6, -8, 3.2, 1.4, '#2a3440')}</g>`
      + rebel(40, 70, 1.2) + rebel(54, 69.6, 1.1) + rebel(78, 69, 1.2) + rebel(92, 69.4, 1.05)
      + bolt(46, 62, 60, 58, '#ff4a2a') + bolt(130, 60, 146, 56, '#3aff6a') + blast(138, 62, 3)
      + P('M0 80 C40 77 80 79 120 77 C140 76 150 78 160 77 L160 90 L0 90Z', '#f4f8fc') + flakes(60, 1),

    // 2 · Ion Cannon Cover (fleet): the v-150 ion cannon on its ridge firing a
    // crackling blue-white bolt into the sky, where it strikes a Star
    // Destroyer in orbit; a transport climbs away, TIEs swarm.
    ion_cannon: () => fill([[0, '#0a1424'], [0.45, '#2a3e5c'], [0.8, '#8aa0bc'], [1, '#c8d6e4']]) + starfield(40, 2)
      + C(132, 16, 9, '#c8d4e2', 'opacity=".25"') + C(132, 16, 6, '#e4ecf4', 'opacity=".4"')
      + isd(118, 22, 1.5, '#7a828c') + isd(52, 14, 0.8, '#6a727c') + blast(108, 22.6, 4)
      + glow(108, 22, 4, '#9fd8ff', 0.5) + [0, 1, 2].map((k) => P(`M${36 + k * 2} 62 Q${70 + k * 4} ${44 - k * 6} 108 22`, 'none', `stroke="${['#9fd8ff', '#e8f6ff', '#5aa8ff'][k]}" stroke-width="${[3, 1.2, 0.6][k]}" opacity="${[0.4, 0.95, 0.8][k]}"`)).join('')
      + P('M60 44 l3 -4 l-2 -1 l4 -5 M80 34 l2 -4 l-2 0 l3 -5', 'none', 'stroke="#e8f6ff" stroke-width=".5"')
      + transport(84, 40, 0.9) + tie(130, 40, 0.7) + tie(144, 32, 0.6) + tie(100, 46, 0.5) + bolt(128, 40, 116, 44, '#3aff6a')
      // the ridge, the cannon, its emplacement and crew
      + P('M0 66 L20 58 L44 60 L64 54 L90 62 L120 56 L146 62 L160 60 L160 90 L0 90Z', '#a8b8ca') + P('M20 58 L26 62 L18 63Z M64 54 L70 58 L62 59Z M120 56 L126 60 L118 61Z', '#eef4fa')
      + ionCannon(40, 68, 1.2) + glow(30, 28, 2, '#e8f6ff', 0.5)
      + drifts(72) + rebel(62, 76, 1.1) + rebel(70, 75.6, 1, -1) + R(84, 70, 10, 5, '#7a848e', 'rx="1"') + flakes(30, 2),

    // 3 · Frozen Trenches: down in the trench, Rebels firing over the snow wall
    // while an AT-AT's huge legs stride past behind the smoke, a turret
    // blazing and explosions throwing up snow.
    frozen_trenches: () => fill([[0, '#8a9cb0'], [0.6, '#c4d0dc'], [1, '#e4ecf2']])
      // the AT-AT looming close behind: legs and belly through the smoke
      + `<g transform="translate(96 66) scale(1.8)">${P('M-20 -36 L22 -38 L24 -30 L-20 -28Z', '#7a8492', 'stroke="#4e5866" stroke-width=".4"')}${L(-18, -31, 22, -32.6, '#4e5866', 0.5)}${[-12, -2, 8, 16].map((px) => R(px - 1.8, -29, 3.6, 18, '#8a94a2', 'stroke="#4e5866" stroke-width=".3"') + C(px, -18, 2, '#4e5866') + R(px - 1.6, -18, 3.2, 16, '#7a8492', 'stroke="#4e5866" stroke-width=".3"') + E(px, -1.4, 3.4, 1.2, '#4e5866')).join('')}</g>`
      + P('M0 30 C30 22 60 30 90 24 C120 18 140 26 160 22 L160 50 L0 50Z', '#d4dce6', 'opacity=".5"') + blast(60, 46, 4) + blast(132, 52, 3)
      + bolt(30, 28, 50, 40, '#ff4a2a') + bolt(150, 24, 128, 34, '#ff4a2a') + bolt(84, 54, 70, 30, '#3aff6a')
      // the trench: snow wall in front, sandbags, a DF.9 turret, troopers firing
      + drifts(58, '#e8eef4') + P('M0 66 C40 62 80 64 120 62 C140 61 150 62 160 62 L160 74 L0 76Z', '#d8e2ec', 'stroke="#a8b8c8" stroke-width=".6"')
      + Array.from({ length: 12 }, (_, k) => E(8 + k * 13.4, 64.6 - (k % 2) * 0.8, 7, 3, '#e4ecf2', 'stroke="#a0aebc" stroke-width=".5"') + P(`M${2 + k * 13.4} ${65 - (k % 2) * 0.8} Q${8 + k * 13.4} ${63 - (k % 2) * 0.8} ${14 + k * 13.4} ${65 - (k % 2) * 0.8}`, 'none', 'stroke="#b8c6d4" stroke-width=".4"')).join('')
      + `<g transform="translate(22 62) scale(1.4)">${R(-6, -4, 12, 6, '#7a848e', 'rx="1" stroke="#4a545e" stroke-width=".4"')}${R(-3, -9, 6, 5, '#8a949e', 'stroke="#4a545e" stroke-width=".4"')}${L(3, -7, 12, -10, '#4a545e', 1.4)}${glow(12.4, -10, 0.8, '#ff6a3a', 0.6)}${R(-1.6, -8, 3.2, 1.4, '#2a3440')}</g>`
      + rebel(50, 64, 2, 1) + rebel(70, 63.6, 1.9, 1) + rebel(96, 63, 2.1, -1) + rebel(120, 63.4, 1.9, 1) + rebel(142, 64, 2, -1)
      + bolt(62, 46, 76, 40, '#ff4a2a') + bolt(108, 46, 96, 40, '#ff4a2a')
      + P('M0 76 L160 74 L160 90 L0 90Z', '#c8d4e0') + [10, 40, 80, 120, 150].map((x) => E(x, 82, 8, 1.6, '#e4ecf2')).join('') + flakes(70, 3),

    // 4 · Echo Base Defenders: the command centre carved out of the ice: ribbed
    // white walls and pipes, the big tactical display tracking the walkers,
    // consoles with their screens, officers and troopers at their posts.
    echo_command: () => fill([[0, '#c8d4e2'], [0.5, '#e2eaf2'], [1, '#aab8c8']])
      // the ice ceiling and ribbed walls, conduits and lights
      + P('M0 0 L160 0 L160 18 Q80 8 0 18Z', '#9aaabc') + [12, 30, 48, 66, 94, 112, 130, 148].map((x) => P(`M${x} ${12 - Math.sin((x / 160) * Math.PI) * 6} Q${x + (x < 80 ? 3 : -3)} 40 ${x} 70`, 'none', 'stroke="#a8b8c8" stroke-width="1.6"')).join('')
      + P('M0 22 Q80 14 160 22 M0 25 Q80 17 160 25', 'none', 'stroke="#6a7a8c" stroke-width=".9"') + [20, 56, 104, 140].map((x) => R(x - 3, 15, 6, 1.6, '#fff6d8') + C(x, 18, 8, '#fff6d8', 'opacity=".14"')).join('')
      // the big tactical display: the battlefield map with walker markers
      + R(44, 26, 72, 28, '#1a2a3a', 'rx="1.4" stroke="#5a6a7c" stroke-width="1"') + R(46, 28, 68, 24, '#0e2a3e')
      + [32, 36, 40, 44, 48].map((y) => L(46, y, 114, y, '#2a5a7a', 0.3)).join('') + [54, 62, 70, 78, 86, 94, 102, 110].map((x) => L(x, 28, x, 52, '#2a5a7a', 0.3)).join('')
      + P('M48 46 Q64 40 80 44 T112 38', 'none', 'stroke="#5ad8ff" stroke-width=".7"') + [[96, 38], [104, 36], [88, 40]].map(([x, y]) => P(`M${x} ${y - 1.4} L${x + 1.4} ${y + 1} L${x - 1.4} ${y + 1}Z`, '#ff4a3a')).join('') + C(56, 46, 1.6, 'none', 'stroke="#5aff8a" stroke-width=".5"') + C(56, 46, 0.6, '#5aff8a')
      + R(48, 29.4, 22, 2, '#5ad8ff', 'opacity=".6"') + R(98, 49, 14, 1.4, '#ffcf3a', 'opacity=".7"')
      // consoles and their screens, a holotable glowing
      + [[8, 30], [124, 30]].map(([x, w]) => R(x, 40, w === 30 ? 30 : 30, 16, '#8a98a8', 'stroke="#5a6878" stroke-width=".5"') + [0, 1, 2].map((k) => R(x + 2 + k * 9.4, 42, 8, 6, '#0e2a3e', 'stroke="#5a6878" stroke-width=".3"') + R(x + 3 + k * 9.4, 43, 5, 1, ['#5ad8ff', '#5aff8a', '#ffcf3a'][k], 'opacity=".8"')).join('') + R(x, 50, 30, 6, '#a8b6c4')).join('')
      + E(80, 66, 16, 4, '#5a6878') + E(80, 65, 14, 3.2, '#2a4a62') + P('M70 65 L76 54 L84 54 L90 65Z', '#5ad8ff', 'opacity=".14"') + E(80, 58, 5, 3, '#5ad8ff', 'opacity=".35"') + C(80, 58, 1.4, '#c8f4ff', 'opacity=".7"')
      // officers and troopers at their posts
      + rebel(20, 70, 2.2, -1) + rebel(36, 70.4, 2) + rebel(64, 74, 2.2) + rebel(98, 74.4, 2.1, -1) + rebel(124, 70.4, 2) + rebel(142, 70, 2.2, -1)
      + `<g transform="translate(110 74) scale(2.1)">${P('M-2.2 0 L-2.8 -7 C-2.8 -9 2.8 -9 2.8 -7 L2.2 0Z', '#f2f2f0', 'stroke="#9a9a98" stroke-width=".25"')}${C(0, -10, 1.8, '#d8b8a0')}${C(-1.6, -10.4, 1.1, '#4a2a1a')}${C(1.6, -10.4, 1.1, '#4a2a1a')}</g>`
      + R(0, 74, 160, 16, '#8a9aac') + [0, 20, 40, 60, 80, 100, 120, 140].map((x) => L(x, 74, x + 6, 90, '#7a8a9c', 0.5)).join(''),

    // 5 · Asteroid Field (fleet): the Falcon diving into the tumbling rocks
    // with TIE fighters on its tail, Hoth glowing white behind and a Star
    // Destroyer looming at the edge of the field.
    asteroid_field: () => R(0, 0, 160, 90, '#04060c') + starfield(70, 5)
      + (() => { const [g, d] = LG([[0, '#f0f6fc'], [0.6, '#b8c8d8'], [1, '#5a6a80']], 0, 0, 1, 1); return d + C(14, 96, 44, g); })() + P('M-20 70 Q14 60 50 74', 'none', 'stroke="#ffffff" stroke-width=".8" opacity=".5"')
      + isd(136, 18, 1.4, '#6a727c')
      + [[40, 18, 9], [96, 12, 6], [122, 48, 11], [70, 70, 7], [148, 74, 8], [30, 50, 4], [104, 34, 3.4], [58, 32, 3], [136, 32, 2.6], [86, 56, 2.4], [16, 30, 2.2]].map(([x, y, r], k) => {
        const pts = Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2; const rr = r * (0.78 + ((i * 7 + k * 3) % 5) * 0.08); return `${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr * 0.86).toFixed(1)}`; });
        return P(`M${pts.join(' L')}Z`, ['#5a5450', '#4a4642', '#6a625a'][k % 3], 'stroke="#2a2622" stroke-width=".4"') + P(`M${pts.slice(0, 4).join(' L')} L${x} ${y}Z`, '#8a8078', 'opacity=".5"') + C(x - r * 0.3, y + r * 0.2, r * 0.2, '#2a2622', 'opacity=".6"') + C(x + r * 0.3, y - r * 0.3, r * 0.12, '#2a2622', 'opacity=".5"');
      }).join('')
      + falcon(78, 44, 1.6, -18) + P('M60 50 L46 54 M62 46 L48 48', 'none', 'stroke="#9fd8ff" stroke-width=".5" opacity=".6"')
      + tie(44, 58, 0.9) + tie(30, 40, 0.7) + tie(52, 70, 0.6) + bolt(46, 56, 66, 48, '#3aff6a') + bolt(32, 40, 60, 40, '#3aff6a'),

    // 6 · Wampa Country: an ice canyon at dusk under Hoth's moons, wind-carved
    // drifts, a fallen tauntaun's tracks, and the mouth of the wampa's cave
    // glittering with icicles, the beast's shape in the gloom inside.
    wampa_country: () => fill([[0, '#2a3a5a'], [0.5, '#6a7ea0'], [1, '#c8d4e4']]) + starfield(20, 6)
      + C(36, 16, 6, '#e8eef6', 'opacity=".85"') + C(48, 12, 3, '#dfe6f0', 'opacity=".7"')
      + P('M0 38 L14 28 L30 34 L46 22 L62 32 L80 24 L98 34 L116 20 L134 30 L160 22 L160 60 L0 60Z', '#8a9ab8') + P('M46 22 L52 28 L42 29Z M116 20 L122 26 L112 27Z', '#eef4fa')
      // the canyon walls: ice cliffs with blue facets
      + P('M0 20 L22 26 L30 50 L24 74 L0 80Z', '#b4c6dc') + P('M22 26 L30 50 L24 74 L18 70 L22 44Z', '#7a92b0', 'opacity=".8"') + P('M4 30 L16 34 M2 46 L20 50 M4 62 L18 64', 'none', 'stroke="#eef4fa" stroke-width=".6"')
      + P('M160 16 L132 24 L120 46 L124 72 L160 80Z', '#a8bcd4') + P('M132 24 L120 46 L124 72 L132 70 L128 46Z', '#7088a6', 'opacity=".8"')
      // the wampa's cave mouth with icicles, the beast's shape inside
      + P('M126 64 C126 48 150 44 156 60 L156 72 L126 72Z', '#1a2234') + E(141, 60, 6, 9, '#2a3448', 'opacity=".6"')
      + `<g transform="translate(142 70) scale(1.4)">${E(0, -6, 4, 6, '#d8dce4', 'opacity=".55"')}${C(0, -13, 2.6, '#e2e6ec', 'opacity=".55"')}${P('M-2 -15 L-3.4 -17.6 L-1 -15.6Z M2 -15 L3.4 -17.6 L1 -15.6Z', '#c8ccd2', 'opacity=".6"')}${C(-0.8, -13, 0.4, '#ffcf3a', 'opacity=".8"')}${C(0.8, -13, 0.4, '#ffcf3a', 'opacity=".8"')}</g>`
      + Array.from({ length: 9 }, (_, k) => { const x = 128 + k * 3.2; const y = 50 - Math.sin((k / 8) * Math.PI) * 4; return P(`M${x - 0.8} ${y} L${x} ${y + 4 + (k % 3) * 1.6} L${x + 0.8} ${y}Z`, '#dff0ff', 'opacity=".9"'); }).join('')
      // drifts, a tauntaun with its rider, and footprints
      + drifts(70, '#e8eef6', '#b8c8dc')
      + `<g transform="translate(70 72) scale(1.5)">${P('M-6 -4 C-6 -8 2 -9 4 -7 L7 -10 C8.4 -11 9.6 -10 9 -8.6 L6 -5 C6 -2 3 0 0 0 L-4 0 C-7 0 -8 -2 -6 -4Z', '#d8ccb8', 'stroke="#8a7a62" stroke-width=".3"')}${P('M8.6 -10.4 L10 -12.6 M7.6 -10.6 L8.4 -13', 'none', 'stroke="#c8b8a0" stroke-width=".6"')}${L(-3, 0, -4, 4, '#b8a890', 0.9)}${L(2, 0, 3, 4, '#b8a890', 0.9)}${P('M-3 -7.4 L-5 -8 L-6.6 -12 L-4 -12Z', '#5a6a8a')}${P('M-2.4 -9 L0 -12 L-1 -16 L-3.6 -14Z', '#a89878')}${C(-2, -16.6, 1.4, '#c8b896')}${R(-3, -17, 2, 0.6, '#2a3040')}</g>`
      + Array.from({ length: 8 }, (_, k) => E(20 + k * 6, 82 - k * 0.6, 1, 0.5, '#aabcd0')).join('') + flakes(80, 6),

    // 7 · Hangar Breach: Echo Base's main hangar under its ribbed ice ceiling:
    // the Falcon on its pad, X-wings and snowspeeders, Rebels running for
    // their ships as snowtroopers blast through the shattered wall.
    hangar_breach: () => fill([[0, '#5a6a80'], [0.4, '#9aaabe'], [1, '#c4d0dc']])
      + P('M0 0 L160 0 L160 26 Q80 6 0 26Z', '#7a8aa0') + [10, 28, 46, 64, 96, 114, 132, 150].map((x) => P(`M${x} ${22 - Math.sin((x / 160) * Math.PI) * 16} Q${x} 34 ${x + (x < 80 ? -2 : 2)} 60`, 'none', 'stroke="#aabace" stroke-width="2.4" opacity=".7"')).join('')
      + [24, 56, 104, 136].map((x) => R(x - 4, 12, 8, 1.6, '#fff6d8') + P(`M${x - 4} 13.6 L${x + 4} 13.6 L${x + 10} 60 L${x - 10} 60Z`, '#fff6d8', 'opacity=".07"')).join('')
      // the blasted wall on the right, snowtroopers pouring through the smoke
      + P('M126 30 C132 26 146 28 152 36 C156 46 152 58 146 62 L128 62 C122 54 120 40 126 30Z', '#1e2634') + P('M126 30 L130 34 L124 38Z M152 36 L148 40 L154 42Z M146 62 L142 58 L148 56Z', '#c8d4e0') + E(140, 44, 14, 12, '#5a6270', 'opacity=".35"') + blast(130, 40, 4)
      + snowt(134, 62, 1.8, -1) + snowt(146, 62, 1.7, -1) + snowt(122, 66, 2, -1)
      // the Falcon on its pad, an X-wing, snowspeeders, fuel lines
      + E(70, 66, 30, 4, '#5a6474', 'opacity=".5"') + falcon(70, 54, 3, 0)
      + xwing(30, 50, 2, 10) + speeder(108, 50, 1.8, 0) + speeder(24, 66, 1.6, 0)
      + P('M40 66 Q50 72 60 70 M86 62 Q96 70 110 68', 'none', 'stroke="#3a4250" stroke-width=".8"') + R(92, 64, 6, 6, '#7a6a4a', 'stroke="#4a3a2a" stroke-width=".4"')
      // Rebels running for the ships, blaster fire across the hangar
      + rebel(44, 76, 1.9) + rebel(58, 78, 2) + rebel(94, 78, 1.9, -1) + rebel(110, 76, 1.8, -1)
      + bolt(120, 58, 98, 66, '#ff4a2a') + bolt(132, 54, 112, 58, '#ff4a2a') + bolt(96, 70, 118, 62, '#ff4a2a')
      + P('M0 72 L160 70 L160 90 L0 90Z', '#a8b6c6') + [0, 20, 40, 60, 80, 100, 120, 140].map((x) => L(x, 72, x - 8, 90, '#8a98a8', 0.5)).join('') + R(0, 80, 160, 1, '#ffcf3a', 'opacity=".5"') + flakes(26, 7),

    // 8 · Shield Generator: the great shield generator on the snowfield, its
    // tall pylons and dish array, the AT-ATs closing in and firing on it, the
    // Rebels' last line falling back through the smoke.
    shield_generator: () => fill([[0, '#7a8ea8'], [0.55, '#b4c4d6'], [1, '#e0e8f0']])
      + P('M0 42 L20 32 L38 38 L58 28 L76 36 L96 26 L118 34 L140 26 L160 32 L160 60 L0 60Z', '#a4b4c8') + P('M58 28 L62 32 L56 33Z M96 26 L100 30 L94 31Z M140 26 L144 30 L138 31Z', '#eef4fa')
      // the generator: a domed base, the twin pylons and the big dish array, its blue glow
      + E(54, 62, 26, 6, '#8a96a6') + P('M30 62 C30 50 78 50 78 62Z', '#b8c4d2', 'stroke="#5a6676" stroke-width=".6"') + [38, 46, 54, 62, 70].map((x) => L(x, 54 + Math.abs(54 - x) * 0.08, x, 62, '#7a8696', 0.4)).join('')
      + R(44, 26, 4, 28, '#9aa6b6', 'stroke="#5a6676" stroke-width=".4"') + R(60, 26, 4, 28, '#9aa6b6', 'stroke="#5a6676" stroke-width=".4"') + [30, 36, 42, 48].map((y) => L(44, y, 64, y, '#7a8696', 0.6)).join('')
      + `<g transform="rotate(-10 54 22)">${E(54, 22, 20, 6, '#d0d8e2', 'stroke="#5a6676" stroke-width=".6"')}${E(54, 21, 16, 4, '#a8b4c2')}${L(54, 21, 54, 12, '#5a6676', 0.8)}${glow(54, 12, 1.4, '#9fd8ff', 0.6)}</g>`
      + P('M30 20 Q54 4 78 20', 'none', 'stroke="#9fd8ff" stroke-width=".8" opacity=".5"')
      // AT-ATs closing in and firing on it
      + atat(118, 62, 0.62, true, false) + atat(146, 60, 0.46, false, true) + bolt(94, 47.6, 66, 32, '#ff4a2a') + bolt(130, 49, 70, 40, '#ff4a2a') + blast(66, 34, 3.6)
      + speeder(100, 18, 1, -10) + bolt(108, 20, 116, 26, '#ff4a2a')
      // the snowfield, the Rebels falling back
      + drifts(66) + rebel(30, 74, 1.4, -1) + rebel(44, 76, 1.5, -1) + rebel(86, 76, 1.4, 1) + rebel(100, 74, 1.3, 1) + blast(110, 72, 3) + flakes(60, 8),

    // 9 · Escape from Hoth (fleet): from orbit, Hoth below; the transports
    // break out with their X-wing escort as the ion cannon's bolts arc up past
    // the blockading Star Destroyers, the Falcon racing clear.
    escape_hoth: () => R(0, 0, 160, 90, '#03050c') + starfield(80, 9)
      + (() => { const [g, d] = LG([[0, '#f6fafe'], [0.55, '#c4d4e4'], [1, '#6a7e98']], 0, 0, 1, 1); return d + C(80, 150, 92, g); })() + P('M0 76 Q80 50 160 76', 'none', 'stroke="#ffffff" stroke-width="1.4" opacity=".4"') + P('M10 80 Q40 70 70 74 M90 70 Q120 66 150 76', 'none', 'stroke="#aabcd0" stroke-width="1" opacity=".6"')
      + isd(40, 22, 1.6, '#7a828c') + isd(120, 16, 1.2, '#6a727c') + isd(150, 34, 0.8, '#5a626c')
      + [0, 1].map((k) => P(`M${70 + k * 8} 64 Q${60 + k * 6} ${40 - k * 4} ${40 - k * 2} ${24 + k * 2}`, 'none', `stroke="${k ? '#e8f6ff' : '#9fd8ff'}" stroke-width="${k ? 1 : 2.6}" opacity="${k ? 0.95 : 0.4}"`)).join('') + blast(40, 23, 3) + glow(40, 23, 3, '#9fd8ff', 0.5)
      + transport(88, 46, 1.4) + transport(110, 54, 1) + xwing(74, 40, 1.2, -6) + xwing(100, 40, 1, -6) + xwing(124, 48, 1, -4)
      + falcon(130, 62, 1.4, -14) + tie(56, 34, 0.7) + tie(66, 28, 0.6) + bolt(58, 34, 80, 42, '#3aff6a') + bolt(102, 40, 118, 34, '#ff4a2a'),

    // 10 · Vader Arrives: a wrecked Echo Base corridor lit red by the emergency
    // lights: ice and debris on the floor, sparking cables, and Darth Vader
    // striding through the smoke with snowtroopers at his back.
    vader_arrives: () => fill([[0, '#2a1e26'], [0.5, '#4a3644'], [1, '#1a141a']])
      // the ribbed ice corridor running back in perspective
      + P('M0 0 L56 30 L104 30 L160 0Z', '#3a2e3a') + P('M0 90 L56 62 L104 62 L160 90Z', '#2a2026') + P('M0 0 L56 30 L56 62 L0 90Z', '#4a3a48') + P('M160 0 L104 30 L104 62 L160 90Z', '#3e3240')
      + [0.2, 0.4, 0.6, 0.8].map((k) => { const x = k * 56; const y0 = k * 30; const y1 = 90 - k * 28; return L(x, y0, x, y1, '#6a5a6a', 1.6 - k) + L(160 - x, y0, 160 - x, y1, '#6a5a6a', 1.6 - k); }).join('')
      + R(56, 30, 48, 32, '#1a1418') + E(80, 46, 22, 16, '#c8b8c8', 'opacity=".12"')
      // red emergency lights, sparking cables, ice and debris
      + [[16, 14], [144, 14], [40, 26], [120, 26]].map(([x, y]) => C(x, y, 1.4, '#ff3a2a') + C(x, y, 9, '#ff3a2a', 'opacity=".14"')).join('')
      + P('M30 4 Q34 20 28 30 M132 6 Q128 18 134 28', 'none', 'stroke="#1a1418" stroke-width=".9"') + glow(28, 30, 0.8, '#ffe8a0', 0.6) + glow(134, 28, 0.6, '#ffe8a0', 0.5)
      + [[20, 82, 6], [44, 76, 4], [118, 78, 5], [140, 84, 7], [70, 72, 3]].map(([x, y, w]) => P(`M${x - w} ${y} L${x - w * 0.4} ${y - w * 0.6} L${x + w * 0.5} ${y - w * 0.4} L${x + w} ${y}Z`, '#c8d0dc', 'opacity=".85"')).join('')
      + [[30, 70], [130, 72], [60, 84]].map(([x, y]) => R(x, y, 6, 2, '#5a4a52', 'transform="rotate(20 ' + x + ' ' + y + ')"')).join('')
      // snowtroopers at his back, then Vader striding forward, cape swirling
      + snowt(64, 66, 1.8, 1) + snowt(96, 66, 1.8, -1) + E(80, 52, 30, 10, '#d8d0d8', 'opacity=".08"')
      + `<g transform="translate(80 84)">${E(0, 1, 14, 2, '#000', 'opacity=".4"')}${P('M-12 0 C-14 -10 -12 -22 -6 -30 L6 -30 C12 -22 15 -10 13 0Z', '#0a0a0e')}${P('M-6 -30 C-10 -18 -11 -8 -10 0 L-4 0 C-5 -10 -4 -20 -2 -30Z', '#16161c')}${P('M-5 -30 L5 -30 L6 -14 L-6 -14Z', '#1a1a20')}${R(-4, -24, 8, 4, '#2a2a30', 'rx=".6"')}${[-2.4, -0.8, 0.8, 2.4].map((px, k) => R(px - 0.4, -23, 0.8, 1, ['#ff3a2a', '#3aff6a', '#3a8aff', '#ffcf3a'][k])).join('')}${R(-5, -14, 10, 1.6, '#3a3a40')}${C(0, -13.2, 1, '#8a8a90')}${P('M-4 -36 C-4 -42 4 -42 4 -36 L5 -32 L2 -30 L-2 -30 L-5 -32Z', '#0e0e12')}${P('M-4 -36 C-4 -41 4 -41 4 -36Z', '#2a2a32', 'opacity=".6"')}${P('M-3 -35 L-0.6 -35 L-0.8 -33.6 L-3 -34Z M3 -35 L0.6 -35 L0.8 -33.6 L3 -34Z', '#3a3a44')}${P('M-1.2 -32.6 L1.2 -32.6 L0.8 -30.6 L-0.8 -30.6Z', '#5a5a64')}${L(6, -16, 9, -10, '#0a0a0e', 2)}${E(-1, -39.6, 2, 0.8, '#ffffff', 'opacity=".25"')}</g>`
      + flakes(24, 10, '#e8e0e8', 0.5) + R(0, 0, 160, 90, 'none', 'stroke="#000" stroke-width="10" opacity=".35"'),
  };
  Object.assign(SA.scenes, H);
  SA.worlds.hoth = ['echo_perimeter', 'ion_cannon', 'frozen_trenches', 'echo_command', 'asteroid_field', 'wampa_country', 'hangar_breach', 'shield_generator', 'escape_hoth', 'vader_arrives'];
})(typeof window !== 'undefined' ? window : globalThis);
