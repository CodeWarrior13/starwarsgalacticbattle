// Update 2.4: a background scene for every stage, drawn world by world.
// Tatooine first, for approval. Each scene is a 160x90 SVG laid behind the
// battle, built around the one image that says where you are: the Mos
// Eisley overlook, the krayt skeleton in the Jundland Wastes, Beggar's
// Canyon, a sandcrawler, the cantina bar, Jabba's gate, the Sarlacc pit,
// the Razor Crest's hangar, a bounty hunters' den and Jabba's throne room.
(function (root) {
  'use strict';
  const K = root.ArtX;
  if (!K) return;
  const { P, E, C, R, L, LG } = K;
  const svg = (inner) => `<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${inner}</svg>`;
  const fill = (stops) => { const [g, d] = LG(stops); return d + R(0, 0, 160, 90, g); };
  const glow = (x, y, r, c, a = 0.18) => C(x, y, r * 2.4, c, `opacity="${a * 0.5}"`) + C(x, y, r * 1.6, c, `opacity="${a}"`);
  // Drifting sand haze (soft ellipses).
  const haze = (c, list) => list.map(([x, y, rx, ry]) => E(x, y, rx, ry, c, 'opacity=".35"')).join('');
  // Tatooine's twin suns: the big white-gold one and its smaller orange partner.
  const suns = (x, y, sc = 1) => glow(x, y, 7 * sc, '#fff4d6', 0.22) + C(x, y, 6.4 * sc, '#fffaf0') + glow(x + 13 * sc, y + 6 * sc, 4 * sc, '#ffcf7a', 0.2) + C(x + 13 * sc, y + 6 * sc, 3.8 * sc, '#ffe0a0');
  // Wind ripples across sand.
  const ripples = (y0, y1, c, n = 6, a = 0.35) => Array.from({ length: n }, (_, k) => { const y = y0 + ((y1 - y0) * k) / n; const o = (k * 23) % 40; return P(`M${-10 + o} ${y} q10 -1.4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0`, 'none', `stroke="${c}" stroke-width=".4" opacity="${a}"`); }).join('');
  // A dune band: lit face and shadowed lee sides.
  const dune = (y, h, lit, dark) => P(`M0 ${y} C30 ${y - h} 50 ${y - h} 72 ${y - 2} C96 ${y - h * 1.3} 124 ${y - h * 1.2} 160 ${y - 1} L160 90 L0 90Z`, lit)
    + P(`M50 ${y - h * 0.85} C58 ${y - h * 0.5} 64 ${y - 2} 72 ${y - 2} C66 ${y + 2} 58 ${y + 4} 46 ${y + 4}Z M118 ${y - h * 1.1} C126 ${y - h * 0.6} 140 ${y - 1} 160 ${y - 1} L160 ${y + 5} C144 ${y + 4} 128 ${y + 2} 114 ${y + 2}Z`, dark, 'opacity=".55"');
  // A Tatooine adobe dome: base wall, dome, door arch, band, vent and shadow side.
  const hut = (x, y, w, c, sh = '#8a6a48') => P(`M${x - w} ${y} C${x - w} ${y - w * 1.15} ${x + w} ${y - w * 1.15} ${x + w} ${y}Z`, c)
    + P(`M${x} ${y - w * 0.86} C${x + w * 0.7} ${y - w * 0.8} ${x + w} ${y - w * 0.4} ${x + w} ${y}L${x} ${y}Z`, sh, 'opacity=".35"')
    + R(x - w * 1.08, y - 0.6, w * 2.16, w * 0.32, c) + L(x - w * 0.96, y - w * 0.42, x + w * 0.96, y - w * 0.42, sh, 0.4, 'opacity=".6"')
    + P(`M${x - w * 0.24} ${y} L${x - w * 0.24} ${y - w * 0.36} C${x - w * 0.24} ${y - w * 0.56} ${x + w * 0.24} ${y - w * 0.56} ${x + w * 0.24} ${y - w * 0.36} L${x + w * 0.24} ${y}Z`, '#2a1a0c')
    + R(x + w * 0.4, y - w * 0.98, w * 0.16, w * 0.3, sh);
  const vaporator = (x, y, h) => L(x, y, x - 2.6, y + 1, '#5a5a5e', 0.5) + L(x, y, x + 2.6, y + 1, '#5a5a5e', 0.5) + R(x - 0.7, y - h, 1.4, h, '#9a9aa0')
    + R(x - 1.8, y - h * 0.62, 3.6, 1.2, '#b8b8be') + R(x - 1.4, y - h * 0.36, 2.8, 0.9, '#7a7a80') + R(x - 1.2, y - h - 2.4, 2.4, 2.4, '#c8c8ce', 'rx=".4"') + R(x - 2.2, y - h - 0.6, 4.4, 0.7, '#8a8a90') + L(x - 0.3, y - h, x - 0.3, y, '#d8d8de', 0.3);
  const tusken = (x, y, s, f = 1) => `<g transform="translate(${x} ${y}) scale(${s * f} ${s})">${P('M-2.4 0 L-2.8 -9 C-2.8 -11.6 2.8 -11.6 2.8 -9 L2.4 0Z', '#b8a07a')}${P('M-2.4 0 L-2.6 -6 L2.6 -6 L2.4 0Z', '#8a7050')}${R(-3, -7.6, 6, 1, '#5a4430')}${C(0, -12.4, 2.2, '#d8c49a')}${R(-1.8, -13.2, 3.6, 1.1, '#2a1a10')}${C(-0.8, -12.6, 0.4, '#5a6a7a')}${C(0.8, -12.6, 0.4, '#5a6a7a')}${R(-0.4, -11.2, 0.8, 1.6, '#4a3a2a')}${L(2.6, -8, 6, -15, '#4a3420', 0.7)}${C(6, -15, 0.8, '#7a6a5a')}</g>`;
  const bantha = (x, y, s, f = 1) => `<g transform="translate(${x} ${y}) scale(${s * f} ${s})">${E(0, 0, 9, 5.4, '#4a3020')}${[-6, -2, 3, 7].map((lx) => R(lx - 0.9, 3.4, 1.8, 5, '#3a2416')).join('')}${P('M-9 -3 C-14 -4 -14 2 -11 3 L-8 2Z', '#3a2416')}${P('M-12 -3 C-16 -6 -17 -1 -14 0 C-13 -2 -12 -2 -12 0', 'none', 'stroke="#e8d8b8" stroke-width="1"')}${P('M-6 -4 L6 -5 M-7 -1 L7 -2 M-6 2 L6 1', 'none', 'stroke="#2a1a0e" stroke-width=".4" opacity=".7"')}${C(-12.6, -1, 0.4, '#000')}</g>`;
  const jawa = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M-2.4 0 L-1.8 -6 C-1.6 -9 1.6 -9 1.8 -6 L2.4 0Z', '#6a4628')}${P('M-1.8 -6 C-2 -10 2 -10 1.8 -6Z', '#5a3a20')}${E(0, -6.8, 1.3, 1, '#0a0604')}${C(-0.5, -6.9, 0.32, '#ffd23a')}${C(0.5, -6.9, 0.32, '#ffd23a')}${R(-2, -3.6, 4, 0.6, '#3a2414')}</g>`;
  // Luke's X-34 landspeeder: cream-and-red body, windscreen, three engines.
  const landspeeder = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${E(0, 6, 12, 1.6, '#000', 'opacity=".25"')}${P('M-12 1 C-12 -1 -9 -2 -4 -2 L10 -2 C12 -2 13 0 12 2 L-10 3Z', '#d8b088')}${P('M-12 1 L12 2 L11 3.4 L-11 3Z', '#a8402a')}${P('M-6 -2 L-3 -5 L2 -5 L4 -2Z', '#a8c8e8', 'opacity=".75"')}${R(4, -4.6, 9, 3, '#8a8a90', 'rx="1.4"')}${R(5, -6.8, 8, 2.6, '#9a9aa0', 'rx="1.2"')}${C(13, -3.1, 1, '#3a3a40')}${C(13, -5.5, 0.9, '#3a3a40')}</g>`;
  // A rock mesa with a shadowed side and strata lines.
  const mesa = (pts, c, sh, strata) => P(`M${pts}Z`, c) + (sh ? P(`M${sh}Z`, '#000', 'opacity=".22"') : '') + (strata || '');

  const S = {
    // 1 · Mos Eisley Outskirts: the overlook. "You will never find a more
    // wretched hive of scum and villainy." The spaceport packed into the basin
    // below: the great round docking bays (from the photo), block houses and
    // domes, the control tower, market awnings and red streamers, ships coming
    // and going, the landspeeder on the cliff edge, a vaporator, twin suns.
    mos_eisley: () => fill([[0, '#d89c60'], [0.5, '#f0c890'], [1, '#f8e2b8']]) + suns(128, 14)
      // high wispy cloud and two pale moons
      + [[14, 10, 30], [56, 6, 24], [92, 18, 28], [140, 28, 18], [36, 24, 14]].map(([x, y, w]) => P(`M${x} ${y} q${w / 2} -2 ${w} 0 M${x + 4} ${y + 1.6} q${w / 3} -1.2 ${w * 0.6} 0`, 'none', 'stroke="#fff4e0" stroke-width=".7" opacity=".45"')).join('')
      + C(34, 13, 2.2, '#f6ece0', 'opacity=".55"') + C(40, 17, 1.1, '#f6ece0', 'opacity=".45"')
      // a freighter climbing out on its trail, a shuttle coming in to land
      + P('M80 36 Q92 26 104 12', 'none', 'stroke="#fff4e0" stroke-width=".7" opacity=".5"') + `<g transform="translate(104 12) rotate(-40) scale(.7)">${E(0, 0, 4, 2.4, '#c8c0b4')}${R(-1, -3.6, 2, 7.2, '#a8a098')}${C(-4, 0, 1, '#ffb070')}</g>`
      + `<g transform="translate(26 32) rotate(8) scale(.55)">${P('M-8 0 L6 -2 L10 0 L6 2Z', '#c8ccd2')}${P('M-2 -2 L0 -6 L2 -2Z', '#b8bcc4')}${C(-8, 0, 1, '#ffb070')}</g>`
      // far mesas with strata
      + P('M0 38 L10 32 L22 35 L34 28 L48 33 L60 30 L76 34 L92 29 L110 34 L126 30 L144 35 L160 31 L160 50 L0 50Z', '#c08e5c', 'opacity=".75"') + [34, 37, 40].map((y) => L(0, y, 160, y - 1, '#a8784a', 0.4, 'opacity=".5"')).join('')
      + P('M0 45 Q80 38 160 45 L160 66 L0 66Z', '#e0b47c')
      // the back row: block houses, some domed, with doorways and vents
      + Array.from({ length: 27 }, (_, k) => { const x = 2 + k * 5.9; const h = 4 + ((k * 7) % 5); const y = 47 - (k % 3); return R(x, y - h, 5.4, h, k % 2 ? '#d8b88c' : '#e6c8a0') + R(x + 3.6, y - h, 1.8, h, '#b8946a', 'opacity=".5"') + (k % 3 === 0 ? P(`M${x} ${y - h} C${x} ${y - h - 3.4} ${x + 5.4} ${y - h - 3.4} ${x + 5.4} ${y - h}Z`, '#ead0a8') : '') + R(x + 1.8, y - 2.2, 1.4, 2.2, '#5a3e24') + (k % 4 === 1 ? R(x + 0.8, y - h - 1.6, 0.8, 1.6, '#a8845a') : ''); }).join('')
      // the great round docking bays: curved wall, dark inside, an entrance
      + [[34, 54, 12], [104, 56, 10], [142, 52, 7]].map(([x, y, r]) => P(`M${x - r} ${y} L${x - r} ${y + 3} C${x - r} ${y + r * 0.42} ${x + r} ${y + r * 0.42} ${x + r} ${y + 3} L${x + r} ${y}Z`, '#c89c70', 'stroke="#8a6a48" stroke-width=".4"')
        + E(x, y, r, r * 0.36, '#e0bc90', 'stroke="#8a6a48" stroke-width=".5"') + E(x, y - 0.2, r * 0.84, r * 0.27, '#6a4a2c') + E(x, y + 0.4, r * 0.84, r * 0.2, '#8a6a48', 'opacity=".5"')
        + R(x - 1.6, y + r * 0.33, 3.2, 2.2, '#3a2412') + Array.from({ length: 7 }, (_, k) => L(x - r * 0.9 + k * r * 0.3, y + r * 0.2, x - r * 0.9 + k * r * 0.3, y + r * 0.4, '#a07a52', 0.3)).join('')).join('')
      // huts packed through the town
      + [[12, 58, 3], [18, 60.6, 2.6], [24, 58, 3.4], [48, 58, 3], [54, 56, 2.4], [58, 60.4, 3], [76, 58, 2.6], [82, 60.6, 3.4], [92, 58, 3], [118, 58, 2.8], [124, 61, 3.4], [132, 58, 3], [138, 61.4, 2.6], [152, 58, 3], [156, 61.4, 2.4], [8, 62.4, 2.6], [42, 62.4, 2.4], [90, 63, 2.6], [128, 63.4, 2.4], [112, 62.6, 2.6], [70, 62.4, 2.4]].map(([x, y, w]) => hut(x, y, w, '#e6c69a', '#a07a52')).join('')
      // the control tower: stacked drums and its beacon
      + R(84, 38, 5, 19, '#d4b088') + R(87, 38, 2, 19, '#b8946a', 'opacity=".6"') + R(83, 36, 7, 2.4, '#c4a078') + R(83.6, 32.6, 5.8, 3.4, '#dcbc94') + E(86.5, 32.6, 3, 1, '#c4a078') + R(85, 41, 3, 1, '#3a2412') + R(85, 46, 3, 1, '#3a2412') + C(86.5, 31, 0.5, '#ff6a3a')
      // the cantina with its vent tower
      + hut(64, 57, 6, '#ead0a6', '#a07a52') + R(68.6, 47, 1.6, 6, '#c4a07a') + R(68, 46, 2.8, 1.2, '#b08a64')
      // market awnings and red streamers strung between the roofs
      + [[50, 58.6], [78, 59.4], [114, 58.6], [140, 58]].map(([x, y]) => P(`M${x} ${y} L${x + 6} ${y} L${x + 7} ${y + 1.6} L${x - 1} ${y + 1.6}Z`, '#c86a3a') + L(x, y + 1.6, x, y + 4, '#5a3e24', 0.3) + L(x + 6, y + 1.6, x + 6, y + 4, '#5a3e24', 0.3)).join('')
      + P('M20 51 Q34 58 46 50 M96 53 Q110 60 124 52 M126 50 Q136 56 146 48 M60 50 Q70 55 82 49', 'none', 'stroke="#b8322a" stroke-width=".6"')
      + [[24, 51], [48, 50], [66, 49], [100, 50], [122, 51], [30, 60], [86, 61], [134, 60], [150, 56]].map(([x, y]) => C(x, y, 0.4, '#fff0c0', 'opacity=".8"')).join('')
      + [[40, 64], [62, 65], [98, 64], [108, 66], [146, 64]].map(([x, y]) => L(x, y, x, y - 1.6, '#3a2412', 0.5) + C(x, y - 2, 0.4, '#3a2412')).join('')
      // the cliff edge in the foreground, the speeder and a vaporator
      + P('M0 66 L28 62 L46 66 L66 63 L84 68 L110 64 L132 68 L160 64 L160 90 L0 90Z', '#b8804e') + P('M0 70 L30 66 L50 70 L72 67 L96 72 L120 68 L160 70 L160 90 L0 90Z', '#9a6438')
      + P('M0 66 L28 62 L46 66 L66 63 L84 68 L110 64 L132 68 L160 64', 'none', 'stroke="#e0b07a" stroke-width=".7"') + [[8, 76, 14], [40, 80, 10], [92, 78, 16], [140, 80, 12]].map(([x, y, w]) => L(x, y, x + w, y + 0.6, '#7a4a28', 0.5)).join('')
      + landspeeder(36, 70, 1.3) + vaporator(132, 70, 16) + [[60, 78, 3, 1.6], [110, 84, 4, 2], [18, 86, 3, 1.4]].map(([x, y, rx, ry]) => E(x, y, rx, ry, '#7a4a28')).join(''),

    // 2 · Jundland Wastes: deep canyon walls with strata, a krayt dragon's
    // skeleton half-buried in the sand, Tusken Raiders on the ridge with their
    // banthas, the suns setting behind the rocks.
    jundland: () => fill([[0, '#c86a34'], [0.5, '#e8a058'], [1, '#f6cc8a']]) + suns(36, 22, 0.9)
      + mesa('0 44 L10 34 L22 40 L34 24 L46 32 L58 26 L68 38 L80 30 L96 36 L112 22 L126 34 L140 26 L160 32 L160 60 L0 60', '#9a5228')
      + mesa('0 30 L8 22 L16 26 L20 10 L30 14 L34 50 L0 60', '#7a3e1c', '20 10 L30 14 L34 50 L26 52', [28, 34, 40, 46].map((y) => L(0, y, 32, y + 2, '#5a2a10', 0.5, 'opacity=".7"')).join(''))
      + mesa('160 24 L148 16 L140 20 L134 8 L124 12 L120 52 L160 60', '#7a3e1c', '134 8 L124 12 L120 52 L128 54', [24, 30, 36, 42].map((y) => L(122, y + 2, 160, y, '#5a2a10', 0.5, 'opacity=".7"')).join(''))
      // the ridge with the Tuskens and banthas silhouetted
      + P('M34 48 L56 42 L80 46 L104 41 L124 46 L124 52 L34 54Z', '#6a3418')
      + tusken(60, 42.6, 0.9) + tusken(66, 42.8, 0.85) + tusken(96, 41.8, 0.9, -1) + bantha(80, 41, 0.6, -1) + bantha(110, 40, 0.5)
      // canyon floor, the krayt skeleton: skull, spine, curved ribs
      + P('M0 60 Q40 54 80 58 T160 56 L160 90 L0 90Z', '#d89858') + P('M0 72 Q50 66 100 72 T160 70 L160 90 L0 90Z', '#c48448') + ripples(62, 86, '#a86a36', 6, 0.3)
      + P('M20 74 C40 66 70 64 100 68 C116 70 128 74 140 78', 'none', 'stroke="#efe2c4" stroke-width="2.2" stroke-linecap="round"')
      + [30, 40, 50, 60, 70, 80, 90, 100, 110].map((x, k) => { const y = 72 - Math.sin((k / 8) * Math.PI) * 6; const h = 10 + Math.sin((k / 8) * Math.PI) * 8; return P(`M${x} ${y} C${x - 4} ${y - h * 0.6} ${x - 2} ${y - h} ${x + 3} ${y - h}`, 'none', 'stroke="#e8d8b4" stroke-width="1.3" stroke-linecap="round"') + P(`M${x} ${y} C${x + 2} ${y + 4} ${x + 4} ${y + 6} ${x + 6} ${y + 7}`, 'none', 'stroke="#d8c8a4" stroke-width="1" opacity=".8"'); }).join('')
      + `<g transform="translate(14 76)">${P('M0 0 C-2 -6 4 -10 12 -8 L20 -4 C22 -2 20 2 16 2 L4 3Z', '#efe2c4', 'stroke="#a89a7a" stroke-width=".5"')}${E(8, -5, 2.2, 1.6, '#3a2414')}${P('M14 0 L16 3 L18 0 M10 1 L11 4 L12 1', '#efe2c4')}${P('M2 -6 C-2 -12 0 -16 4 -16', 'none', 'stroke="#efe2c4" stroke-width="1.4"')}</g>`
      + E(80, 78, 30, 2, '#000', 'opacity=".12"') + [[142, 84, 4], [6, 66, 3], [150, 64, 2.4]].map(([x, y, r]) => E(x, y, r, r * 0.5, '#8a4a22')).join(''),

    // 3 · Beggar's Canyon (fleet): racing low through the canyon. Layered rock
    // walls in perspective with overhangs and ledges, far bends in the haze,
    // the Stone Needle rising from rubble, boulders along a dry wash, two
    // T-16 skyhoppers banking through and a TIE fighter on their tail.
    beggars: () => {
      const vx = 80; const vy = 26;
      const wallL = 'M0 0 L36 0 L52 8 L66 16 L76 24 L71 34 L60 50 L44 70 L30 90 L0 90Z';
      const wallR = 'M160 0 L126 0 L108 8 L94 16 L84 24 L89 34 L100 50 L116 70 L132 90 L160 90Z';
      // bedding layers running away to the vanishing point
      const beds = (x0, c) => Array.from({ length: 15 }, (_, k) => L(x0, -4 + k * 6.6, vx, vy, c, 0.5, 'opacity=".5"')).join('');
      const t16 = (x, y, s, a) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">${P('M-7 0 L5 -1.2 L8 0 L5 1.2Z', '#ece8e0', 'stroke="#8a8478" stroke-width=".3"')}${P('M-3 0 L-7 -5 L-5.4 -5.2 L0 -0.6Z M-3 0 L-7 5 L-5.4 5.2 L0 0.6Z', '#dcd6cc', 'stroke="#8a8478" stroke-width=".3"')}${P('M-2 -0.6 L-2.6 -6 L-1.4 -6 L0 -0.6Z', '#d0cac0')}${E(3, 0, 1.6, 0.8, '#3a4a5a')}${C(-7.4, 0, 0.8, '#ffb070')}</g>`;
      return fill([[0, '#d0804a'], [0.55, '#eeb478'], [1, '#f8d8a8']]) + suns(128, 10, 0.75)
        // the far bends of the canyon in the haze
        + P('M64 26 L68 18 L74 20 L80 14 L86 19 L92 17 L96 26Z', '#c8804a', 'opacity=".8"') + P('M70 26 L74 21 L80 23 L86 20 L90 26Z', '#b8703c') + R(60, 24, 40, 4, '#f0c890', 'opacity=".5"')
        // the walls: lit left face, shadowed right face, bedding layers and ledges
        + P(wallL, '#a8582a') + `<g clip-path="url(#bc-l)"><clipPath id="bc-l"><path d="${wallL}"/></clipPath>${beds(0, '#6a3214')}${P('M0 30 L40 20 L52 26 L0 44Z M0 60 L30 52 L40 60 L0 74Z', '#c8723a', 'opacity=".55"')}${P('M36 0 L52 8 L46 14 L28 6Z', '#6a3214')}${P('M14 46 L34 40 L36 46 L18 52Z', '#7a3a18', 'opacity=".7"')}</g>`
        + P(wallR, '#7a3a1a') + `<g clip-path="url(#bc-r)"><clipPath id="bc-r"><path d="${wallR}"/></clipPath>${beds(160, '#4a200a')}${P('M160 28 L120 20 L108 26 L160 42Z M160 58 L130 50 L120 58 L160 72Z', '#8a4622', 'opacity=".6"')}${P('M126 0 L108 8 L114 14 L132 6Z', '#4a200a')}</g>`
        + P('M36 0 L52 8 L66 16 L76 24 L71 34 L60 50 L44 70 L30 90', 'none', 'stroke="#f0b070" stroke-width=".7" opacity=".7"')
        // the canyon floor: a dry wash winding through, boulders shrinking into the distance
        + P('M30 90 L44 70 L60 50 L71 34 L76 24 L84 24 L89 34 L100 50 L116 70 L132 90Z', '#d89858')
        + P('M78 25 Q74 36 82 46 Q90 56 78 68 Q68 78 84 90', 'none', 'stroke="#b8783e" stroke-width="3.4" opacity=".7"') + P('M78 25 Q74 36 82 46 Q90 56 78 68 Q68 78 84 90', 'none', 'stroke="#e8b47a" stroke-width=".6"')
        + ripples(56, 88, '#a86a36', 6, 0.25)
        + [[66, 44, 1.4], [94, 46, 1.6], [58, 60, 2.4], [102, 62, 2.2], [50, 78, 3.6], [112, 80, 4], [70, 84, 2.6], [96, 74, 2]].map(([x, y, r]) => E(x, y + r * 0.5, r * 1.3, r * 0.4, '#000', 'opacity=".22"') + P(`M${x - r} ${y + r * 0.4} C${x - r} ${y - r} ${x + r} ${y - r} ${x + r} ${y + r * 0.4}Z`, '#9a5a2e') + P(`M${x} ${y - r * 0.6} C${x + r * 0.7} ${y - r * 0.5} ${x + r} ${y} ${x + r} ${y + r * 0.4} L${x} ${y + r * 0.4}Z`, '#6a3a1a', 'opacity=".5"')).join('')
        // the Stone Needle with its strata and rubble
        + P('M77 46 L78 32 L79.4 20 L80.6 15 L81.8 20 L83 32 L84 46Z', '#7a3c1a') + P('M80.6 15 L81.8 20 L83 32 L84 46 L81 46Z', '#000', 'opacity=".25"') + [24, 30, 36, 42].map((y) => L(78.4 - (y - 24) * 0.05, y, 83 + (y - 24) * 0.04, y + 0.4, '#5a2a10', 0.4)).join('')
        + E(80.6, 46.4, 6, 1.4, '#9a5a2e') + E(80.6, 47, 7, 1, '#000', 'opacity=".15"')
        // two skyhoppers racing through, and a TIE fighter on their tail
        + t16(88, 38, 1.3, -12) + t16(70, 52, 1.8, 10) + P('M44 46 L62 50 M48 52 L64 53', 'none', 'stroke="#fff2d0" stroke-width=".35" opacity=".5"')
        + `<g transform="translate(112 22) scale(.6)">${R(-3.6, -4, 1.2, 8, '#3a3e46')}${R(2.4, -4, 1.2, 8, '#3a3e46')}${L(-2.4, 0, 2.4, 0, '#5a5e66', 0.8)}${C(0, 0, 1.6, '#6a6e76')}${C(0, 0, 0.7, '#1a1e24')}</g>` + glow(104, 26, 0.6, '#3aff6a', 0.6) + L(108, 23, 96, 30, '#5aff7a', 0.4)
        + E(72, 72, 5, 1, '#000', 'opacity=".2"') + E(90, 48, 3, 0.6, '#000', 'opacity=".2"');
    },

    // 4 · Sandcrawler Ambush: the Jawa sandcrawler, huge and rusted, ramp
    // down, Jawas marching a line of droids up into it across the dunes.
    sandcrawler: () => fill([[0, '#dc9a5a'], [0.55, '#f0c488'], [1, '#f8dcae']]) + suns(136, 14, 0.85)
      + dune(52, 8, '#d49656', '#a86a34') + haze('#e8c08a', [[30, 42, 20, 4], [120, 46, 24, 4]])
      + '<g transform="translate(36 22)">'
        // tracks and treads
        + [0, 22, 44, 62].map((x) => R(x, 34, 18, 8, '#3a2a1c', 'rx="2" stroke="#1a120a" stroke-width=".5"') + Array.from({ length: 6 }, (_, k) => L(x + 2 + k * 3, 34.4, x + 2 + k * 3, 41.6, '#5a4a3a', 0.5)).join('')).join('')
        // the hull: sloped front, rusted panels, the cab windows and the ore scoop
        + P('M2 34 L8 10 L24 2 L64 0 L78 10 L84 34Z', '#8a6648', 'stroke="#3a2618" stroke-width=".8"') + P('M8 10 L24 2 L64 0 L68 6 L12 14Z', '#a8845e')
        + [18, 30, 42, 54, 66].map((x) => L(x, 4, x + 2, 34, '#5a4030', 0.5)).join('') + [16, 24].map((y) => L(6, y, 82, y, '#5a4030', 0.5)).join('')
        + [[14, 18, 6, 4], [46, 22, 10, 6], [64, 14, 8, 5], [28, 26, 7, 4]].map(([x, y, w, h]) => R(x, y, w, h, '#7a4a2a', 'opacity=".55"')).join('')
        + R(26, 3, 8, 3, '#1a120a') + R(38, 2.6, 8, 3, '#1a120a') + R(50, 2.4, 8, 3, '#1a120a') + C(30, 4.4, 0.6, '#ffcf3a', 'opacity=".9"') + C(54, 3.8, 0.6, '#ffcf3a', 'opacity=".9"')
        + R(66, 0, 4, 10, '#5a4030') + R(64, -2, 8, 3, '#4a3424') + P('M2 34 L-2 28 L6 22 L8 34Z', '#6a4a34')
        // the ramp lowered from the belly
        + P('M30 34 L46 34 L52 50 L22 50Z', '#6a4a34', 'stroke="#3a2618" stroke-width=".6"') + [38, 42, 46].map((y) => L(25 + (y - 34) * 0.18, y, 51 - (y - 34) * 0.06, y, '#3a2618', 0.4)).join('') + R(30, 30, 16, 4, '#1a120a')
        + '</g>'
      // Jawas leading R2-D2 and C-3PO
      + jawa(52, 74, 1.1) + jawa(68, 75, 1) + jawa(98, 76, 1.1) + jawa(112, 77, 1)
      // R2-D2: domed head with its blue panels and eye, the barrel body, two legs and feet
      + `<g transform="translate(78 76) scale(1.25)">${R(-3.4, -6.4, 1.4, 6, '#d8dce2', 'rx=".4"')}${R(2, -6.4, 1.4, 6, '#d8dce2', 'rx=".4"')}${P('M-3.8 0 L-1.8 0 L-2 -1 L-3.6 -1Z M1.8 0 L3.8 0 L3.6 -1 L2 -1Z', '#9aa0a8')}${R(-2.2, -7, 4.4, 6.4, '#eef2f6', 'rx=".6" stroke="#8a929c" stroke-width=".25"')}${R(-1.5, -6, 1.2, 2.6, '#3a6ad8')}${R(0.4, -6, 1, 1.4, '#3a6ad8')}${R(-1.7, -3, 3.4, 0.6, '#3a6ad8')}${R(-0.6, -2.2, 1.2, 1.4, '#9aa0a8')}${P('M-2.4 -7 C-2.4 -10.2 2.4 -10.2 2.4 -7Z', '#c8ccd4', 'stroke="#8a929c" stroke-width=".25"')}${R(-2.3, -8, 4.6, 0.5, '#3a6ad8')}${C(0.7, -8.8, 0.6, '#1a1a20')}${C(0.5, -9, 0.2, '#8ab0ff')}${C(-1.2, -8.9, 0.28, '#ff3a3a')}${R(-0.6, -9.8, 1, 0.6, '#3a6ad8')}</g>`
      // C-3PO: gold head with round eyes, neck, chest plate, the wires at his middle, stiff arms and legs
      + `<g transform="translate(89 77) scale(1.25)">${L(-0.9, -6, -1.2, 0, '#d0a038', 1.1)}${L(0.9, -6, 1.3, 0, '#c09030', 1.1)}${R(-1.9, -0.4, 1.6, 0.6, '#b08028')}${R(0.5, -0.4, 1.6, 0.6, '#b08028')}${R(-1.5, -7.4, 3, 1.4, '#5a5a5e')}${[-1, 0, 1].map((x) => L(x * 0.8, -7.4, x * 0.8, -6, '#d04a2a', 0.25)).join('')}${P('M-2 -11.4 L2 -11.4 L1.6 -7.4 L-1.6 -7.4Z', '#e8c050', 'stroke="#9a7020" stroke-width=".25"')}${P('M-1.2 -11 L1.2 -11 L0.9 -9 L-0.9 -9Z', '#f4d870', 'opacity=".6"')}${L(-2, -11, -3, -7.6, '#d8b040', 0.9)}${L(2, -11, 2.8, -7.6, '#c8a038', 0.9)}${R(-0.5, -12.4, 1, 1, '#c8a038')}${C(0, -13.8, 1.7, '#e8c050', 'stroke="#9a7020" stroke-width=".25"')}${C(-0.6, -14, 0.38, '#ffe8a0')}${C(0.6, -14, 0.38, '#ffe8a0')}${R(-0.4, -13.1, 0.8, 0.5, '#9a7020')}</g>`
      + P('M0 78 Q50 72 100 78 T160 76 L160 90 L0 90Z', '#c88a4e') + ripples(80, 88, '#a06a36', 3, 0.3) + E(80, 74, 50, 2, '#000', 'opacity=".1"'),

    // 5 · Chalmun's Cantina, from the photo's angle: standing back in the dark
    // under the cave-like ceiling, looking at the long curved bar. The bar glows
    // behind it with copper and glass dispensers and little hanging lamps, and
    // the patrons stand along it in silhouette.
    cantina: () => {
      // a patron seen from behind, in silhouette with a rim of bar light
      const fig = (x, h, kind, c = '#1a120c') => {
        const top = 90 - h; const sh = top + h * 0.2; const w = h * 0.17;
        let head = C(x, top + h * 0.09, h * 0.085, c);
        if (kind === 'hood') head = P(`M${x - h * 0.1} ${sh} C${x - h * 0.1} ${top + h * 0.02} ${x + h * 0.1} ${top + h * 0.02} ${x + h * 0.1} ${sh}Z`, c);
        if (kind === 'bith') head = E(x, top + h * 0.06, h * 0.11, h * 0.1, c);
        if (kind === 'tall') head = P(`M${x - h * 0.07} ${sh} L${x} ${top - h * 0.12} L${x + h * 0.07} ${sh}Z`, c);
        if (kind === 'bun') head = C(x, top + h * 0.09, h * 0.08, c) + C(x, top + h * 0.01, h * 0.05, c);
        if (kind === 'hat') head = C(x, top + h * 0.1, h * 0.075, c) + E(x, top + h * 0.05, h * 0.13, h * 0.025, c);
        return head + P(`M${x - w} ${sh} C${x - w * 1.3} ${sh + h * 0.1} ${x - w * 1.1} ${top + h * 0.6} ${x - w * 0.9} 90 L${x + w * 0.9} 90 C${x + w * 1.1} ${top + h * 0.6} ${x + w * 1.3} ${sh + h * 0.1} ${x + w} ${sh}Z`, c)
          + P(`M${x - w} ${sh} C${x - w * 1.3} ${sh + h * 0.1} ${x - w * 1.1} ${top + h * 0.5} ${x - w * 0.95} ${top + h * 0.75}`, 'none', 'stroke="#d89848" stroke-width=".35" opacity=".55"');
      };
      return R(0, 0, 160, 90, '#100804')
        // the bright bar back, shelves and dispensers
        + (() => { const [g, d] = LG([[0, '#fff4d0'], [0.5, '#f4cc80'], [1, '#c8883a']]); return d + P('M16 34 Q80 22 144 34 L144 60 L16 60Z', g); })()
        + [36, 42, 48].map((y) => L(18, y + (y === 36 ? 1 : 0), 142, y, '#a86a2a', 0.5, 'opacity=".7"')).join('')
        + [[30, 40, 3.4, 12], [44, 38, 3, 14], [58, 37, 3.6, 15], [74, 36, 3, 16], [90, 36, 3.4, 16], [106, 37, 3, 15], [120, 38, 3.6, 13], [132, 40, 2.6, 11]].map(([x, y, r, h], k) => R(x - r, y, r * 2, h, k % 2 ? '#c8803a' : '#d89a4a', 'rx="1"') + P(`M${x - r} ${y} C${x - r} ${y - r} ${x + r} ${y - r} ${x + r} ${y}Z`, '#e8b468') + R(x - r * 0.6, y + 1, r * 0.4, h - 2, '#fff2c0', 'opacity=".55"') + L(x - r, y + h * 0.4, x + r, y + h * 0.4, '#8a5a24', 0.5)).join('')
        + Array.from({ length: 22 }, (_, k) => { const x = 22 + k * 5.6; return R(x, 45.4, 1, 2.6, ['#6a9a6a', '#9a5a3a', '#5a7aa8', '#c8a050'][k % 4], 'opacity=".8"'); }).join('')
        + [34, 48, 62, 76, 90, 104, 118, 130].map((x) => L(x, 24, x, 29.4, '#3a2410', 0.35) + P(`M${x - 2} 29.4 L${x + 2} 29.4 L${x + 1.2} 31.6 L${x - 1.2} 31.6Z`, '#f0dca8') + C(x, 32.4, 4, '#fff0c0', 'opacity=".2"')).join('')
        // the dark cave-like ceiling sweeping over the top, and the walls closing in at the sides
        + P('M0 0 L160 0 L160 38 Q150 28 128 25 Q80 18 32 25 Q10 28 0 38Z', '#1c120a') + P('M0 38 Q10 28 32 25 Q80 18 128 25 Q150 28 160 38', 'none', 'stroke="#6a4a2a" stroke-width=".8" opacity=".7"')
        + P('M8 6 Q40 2 70 8 M90 6 Q120 2 152 8 M20 14 Q60 10 100 14', 'none', 'stroke="#2e2014" stroke-width="1.2"')
        + P('M0 38 Q8 40 14 60 L14 90 L0 90Z', '#0c0604') + P('M160 38 Q152 40 146 60 L146 90 L160 90Z', '#0c0604')
        // the long curved bar counter, cream-white and lit from behind
        + P('M14 60 Q80 52 146 60 L146 74 Q80 66 14 74Z', '#e8dcc2') + P('M14 60 Q80 52 146 60 L146 62 Q80 54 14 62Z', '#fff8e8') + P('M14 68 Q80 60 146 68 L146 74 Q80 66 14 74Z', '#b8a88a', 'opacity=".6"')
        + [[56, 56.6], [62, 56], [98, 55.6], [104, 56.2], [120, 57]].map(([x, y]) => R(x - 0.8, y - 2.4, 1.6, 2.4, '#bfe0f0', 'opacity=".7"')).join('')
        // the patrons along the bar, in silhouette
        + fig(8, 40, 'hood') + fig(24, 32, 'head', '#24180e') + fig(36, 34, 'bun') + fig(58, 30, 'hat', '#20160c') + fig(70, 33, 'head') + fig(92, 38, 'tall') + fig(106, 30, 'bith', '#22160e') + fig(120, 34, 'head') + fig(134, 31, 'hood', '#20160c') + fig(152, 42, 'head')
        + E(78, 90, 80, 4, '#000', 'opacity=".5"');
    },

    // 6 · Jabba's Gate, from the photo: the palace on its rocky ridge under a
    // grey desert sky. The tall banded tower with its ringed top and lantern,
    // the wide domed drum beside it, the dark gate tunnel cut into the eroded
    // rock below, and C-3PO and R2-D2 walking up the path toward it.
    jabbas_gate: () => {
      const [stone, sd] = LG([[0, '#d8c8aa'], [0.6, '#b8a280'], [1, '#8a7656']], 0, 0, 1, 0);
      const [rock, rd] = LG([[0, '#c8b08a'], [1, '#8a7254']]);
      return fill([[0, '#9a9ca2'], [0.5, '#c4c2bc'], [1, '#dcd2be']]) + sd + rd
        // heavy cloud and far grey mountains
        + [[20, 14, 26, 7], [64, 8, 30, 6], [118, 12, 32, 8], [150, 22, 20, 5], [40, 26, 18, 4]].map(([x, y, rx, ry]) => E(x, y, rx, ry, '#e2e2e4', 'opacity=".55"') + E(x + rx * 0.2, y + ry * 0.5, rx * 0.8, ry * 0.6, '#8a8c94', 'opacity=".35"')).join('')
        + P('M0 46 L14 38 L26 42 L40 34 L52 40 L60 36 L70 42 L90 44 L110 36 L126 42 L142 34 L160 40 L160 56 L0 56Z', '#8a8a90', 'opacity=".75"')
        // the eroded ridge the palace sits on, with its banded rock
        + P('M0 60 L20 54 L36 56 L52 50 L66 52 L124 52 L140 56 L160 54 L160 90 L0 90Z', rock)
        + [56, 60, 64, 68].map((y, k) => P(`M0 ${y + 2} Q20 ${y - 2} 40 ${y + 1} T80 ${y} T120 ${y + 1} T160 ${y}`, 'none', `stroke="#7a6248" stroke-width="${0.6 - k * 0.08}" opacity=".7"`)).join('')
        // the tall tower: banded drum, ringed platform, upper drum, dome and lantern
        + R(58, 22, 16, 34, stone, 'stroke="#6a5a42" stroke-width=".5"') + [28, 34, 40, 46].map((y) => L(58, y, 74, y, '#8a7656', 0.6)).join('') + [[62, 30], [68, 36], [62, 42], [69, 48]].map(([x, y]) => R(x, y, 1.4, 3, '#2a2016')).join('')
        + R(55, 19, 22, 3.4, '#a8946e', 'stroke="#6a5a42" stroke-width=".5"') + E(66, 19, 11, 1.4, '#c8b48e')
        + R(60, 10, 12, 9, stone, 'stroke="#6a5a42" stroke-width=".5"') + L(60, 14, 72, 14, '#8a7656', 0.5) + R(63.6, 12, 1.2, 2.4, '#2a2016') + R(67.4, 12, 1.2, 2.4, '#2a2016')
        + P('M59 10 C59 4 73 4 73 10Z', '#b8a27e', 'stroke="#6a5a42" stroke-width=".5"') + R(64.4, 1.4, 3.2, 3.4, '#a08a66') + E(66, 1.4, 2.4, 0.8, '#8a7656')
        // the wide domed drum beside it
        + R(76, 32, 40, 24, stone, 'stroke="#6a5a42" stroke-width=".5"') + E(96, 32, 20, 2.6, '#c8b48e', 'stroke="#6a5a42" stroke-width=".5"') + P('M80 32 C80 22 112 22 112 32Z', '#b8a27e', 'stroke="#6a5a42" stroke-width=".5"')
        + E(96, 24, 6, 1.2, '#a08a66') + [38, 44, 50].map((y) => L(76, y, 116, y, '#8a7656', 0.6)).join('') + [80, 88, 96, 104, 112].map((x, k) => R(x, 39 + (k % 2) * 6, 1.6, 3, '#2a2016')).join('')
        + P('M76 32 L76 56 L84 56 L84 32Z', '#ffffff', 'opacity=".1"') + P('M108 32 L116 32 L116 56 L108 56Z', '#000', 'opacity=".15"')
        // the rock mass in front with the dark gate tunnel
        + P('M40 62 C46 54 56 52 66 54 L100 54 C108 56 116 60 120 66 L120 76 L40 76Z', '#b49a76') + [60, 64, 68, 72].map((y) => P(`M42 ${y} Q80 ${y - 3} 118 ${y}`, 'none', 'stroke="#7a6248" stroke-width=".5" opacity=".7"')).join('')
        + P('M64 76 L64 68 C64 60 80 60 80 68 L80 76Z', '#120c08') + P('M62.4 76 L62.4 67.6 C62.4 58.4 81.6 58.4 81.6 67.6 L81.6 76', 'none', 'stroke="#6a5642" stroke-width="1.4"') + [[63, 66], [65, 61.6], [70, 59.4], [74, 59.4], [79, 61.6], [81, 66]].map(([x, y]) => C(x, y, 0.9, '#8a7456')).join('')
        // the path up to the gate, with C-3PO and R2-D2 walking up it
        + P('M64 76 L80 76 L118 90 L74 90Z', '#d8c4a0') + ripples(78, 88, '#a89070', 3, 0.3)
        + `<g transform="translate(98 83) scale(.9)">${L(-0.8, -5, -1, 0, '#d0a038', 0.9)}${L(0.8, -5, 1.2, 0, '#c09030', 0.9)}${P('M-1.6 -9.6 L1.6 -9.6 L1.3 -6 L-1.3 -6Z', '#e8c050')}${C(0, -11, 1.3, '#e8c050')}${C(-0.4, -11.2, 0.3, '#fff2b0')}${C(0.4, -11.2, 0.3, '#fff2b0')}${C(-0.5, -10.6, 0.8, '#fffbe0', 'opacity=".7"')}</g>`
        + `<g transform="translate(103 85) scale(.9)">${R(-1.8, -5, 3.6, 5, '#eef2f6', 'rx=".5"')}${R(-1.2, -4.2, 1, 2, '#3a6ad8')}${P('M-2 -5 C-2 -7.6 2 -7.6 2 -5Z', '#c8ccd4')}${C(0.5, -6.2, 0.4, '#1a1a20')}${L(-2.4, -4, -2.6, 0, '#c8ccd4', 0.8)}${L(2.4, -4, 2.6, 0, '#c8ccd4', 0.8)}</g>`
        + E(100, 85.6, 6, 0.8, '#000', 'opacity=".15"')
        // the eroded foreground rocks
        + P('M0 74 C10 70 20 72 30 78 C24 82 12 84 0 84Z', '#9a8264') + P('M130 76 C140 70 152 72 160 74 L160 86 C150 86 138 84 130 80Z', '#9a8264') + P('M0 84 L160 84 L160 90 L0 90Z', '#a89070', 'opacity=".6"');
    },

    // 7 · Dune Sea Pursuit (fleet): Jabba's sail barge, the Khetanna, big and
    // grand in the middle: the long hull with its rows of ports and ribs, the
    // upper deck and rails, a deck cannon, the great sails and banners. Two
    // skiffs ride in front of it over the Great Pit of Carkoon, where the
    // Sarlacc waits (drawn like the raid's Sarlacc: the ring of teeth, the
    // beak and the tentacles).
    dune_sea_orbit: () => {
      const skiff = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${E(0, 9, 11, 1.4, '#000', 'opacity=".18"')}${P('M-11 0 L9 0 L12 -1.6 L10.6 2.6 L-10 2.6Z', '#8a7a62', 'stroke="#4a3e30" stroke-width=".4"')}${L(-10, 1.4, 10, 1.4, '#5a4a3a', 0.4)}${[-9, -5, -1, 3, 7].map((px) => L(px, 0, px, -3, '#5a4a3a', 0.35)).join('')}${L(-9.4, -3, 7.6, -3, '#5a4a3a', 0.4)}${R(9, -2, 4, 0.8, '#6a5a48')}${[[-6, '#3a2a1a'], [-3, '#d8c8a8'], [1, '#4a3a2a'], [4, '#2a2a30']].map(([px, c]) => R(px - 0.6, -3.6, 1.2, 3.4, c) + C(px, -4.4, 0.8, c)).join('')}${E(-4, 4, 2, 0.6, '#ffd8a0', 'opacity=".5"')}${E(5, 4, 2, 0.6, '#ffd8a0', 'opacity=".5"')}</g>`;
      return fill([[0, '#c8783e'], [0.4, '#eab070'], [1, '#f6d8a4']]) + suns(24, 12, 0.8)
        + P('M0 32 Q40 28 80 32 T160 30 L160 90 L0 90Z', '#e0a868') + dune(48, 6, '#d89a5a', '#b07038') + dune(68, 7, '#cc8c4e', '#9a5c2c')
        + ripples(36, 46, '#b07a44', 3, 0.3) + ripples(72, 88, '#9a6232', 5, 0.25) + haze('#f0d0a0', [[40, 26, 26, 3], [130, 24, 24, 3]])
        // the Great Pit of Carkoon and the Sarlacc
        + E(80, 80, 34, 9, '#b0703e') + E(80, 80.6, 27, 7, '#8a5028') + E(80, 81.2, 22, 5.6, '#3a1a10') + E(80, 82, 15, 3.6, '#5a1a14')
        + Array.from({ length: 16 }, (_, k) => { const a = Math.PI * (k / 15); const tx = 80 - Math.cos(a) * 20; const ty = 81 - Math.sin(a) * 4.4; return P(`M${(tx - 1).toFixed(1)} ${ty.toFixed(1)} L${tx.toFixed(1)} ${(ty - 2.6).toFixed(1)} L${(tx + 1).toFixed(1)} ${ty.toFixed(1)}Z`, '#f0e6c8'); }).join('')
        + C(80, 83, 3, '#ff8a5a') + C(80, 83, 1.4, '#ffd0a0') + P('M77 83 L80 80.4 L83 83 L80 84.6Z', '#e8c8a0', 'opacity=".8"')
        + [[-1, 12, 2.2], [1, 14, 2], [-1, 20, 1.6], [1, 18, 1.4]].map(([s, h, w], k) => P(`M${80 + s * (8 + k * 2)} 82 C${80 + s * (12 + k * 2)} ${82 - h} ${80 + s * (18 + k * 2)} ${78 - h} ${80 + s * (22 + k)} ${82 - h * 0.7}`, 'none', `stroke="#7a3a2a" stroke-width="${w}" stroke-linecap="round"`)).join('')
        // the sail barge's shadow on the sand, then the barge itself
        + E(80, 66, 46, 3, '#000', 'opacity=".16"')
        + `<g transform="translate(80 44) scale(1.3)">`
          + P('M-38 4 L32 4 L40 -0.4 L37 8 L-34 10.6 L-40 8Z', '#a08058', 'stroke="#5a4028" stroke-width=".5"') + P('M-34 8.4 L37 7.6 L35 10 L-32 11.4Z', '#6a4e32')
          + Array.from({ length: 19 }, (_, k) => R(-33 + k * 3.6, 5, 1.6, 1.4, '#2a1a0c')).join('') + Array.from({ length: 12 }, (_, k) => L(-30 + k * 5.6, 4.2, -30.6 + k * 5.6, 10.4, '#7a5a3a', 0.35)).join('')
          + L(-38, 4.6, 33, 4.6, '#d0b080', 0.4)
          + P('M-28 4 L-26 -4 L18 -4 L22 4Z', '#8e6e48', 'stroke="#5a4028" stroke-width=".4"') + Array.from({ length: 10 }, (_, k) => R(-24 + k * 4.2, -2.4, 1.6, 1.4, '#2a1a0c')).join('') + L(-26, -4, 18, -4, '#c8a878', 0.4)
          + Array.from({ length: 13 }, (_, k) => L(-27 + k * 4, -4, -27 + k * 4, -6, '#5a4028', 0.3)).join('') + L(-27.4, -6, 21, -6, '#5a4028', 0.4)
          + `<g transform="translate(26 -1)">${R(0, -1.4, 10, 1.4, '#4a4a4e')}${C(0, -0.7, 1.6, '#5a5a5e')}</g>`
          + L(-6, -4, -6, -34, '#5a4028', 0.7) + P('M-6 -34 L18 -6 L-6 -6Z', '#ece0c4', 'stroke="#a89878" stroke-width=".3"') + P('M-6 -34 L18 -6', 'none', 'stroke="#c8b898" stroke-width=".3"') + [-28, -22, -16, -10].map((y) => L(-6, y, -6 + (y + 34) * 0.86, y, '#c8b898', 0.25)).join('')
          + P('M-8 -30 L-26 -6 L-8 -6Z', '#dcd0b4', 'stroke="#a89878" stroke-width=".3"') + L(-8, -30, -8, -4, '#5a4028', 0.5)
          + [[-6, -34], [-8, -30]].map(([x, y]) => P(`M${x} ${y} L${x + 3} ${y - 1} L${x} ${y - 2}Z`, '#b8322a')).join('') + [[-20, -6], [8, -6], [14, -6]].map(([x, y]) => P(`M${x} ${y} L${x + 1.6} ${y + 3} L${x - 0.4} ${y + 3}Z`, '#b8322a', 'opacity=".85"')).join('')
          + [[-18, -7], [-12, -7], [2, -7], [10, -7]].map(([x, y]) => C(x, y, 0.7, '#3a2a1a')).join('')
          + E(-22, 12.4, 4, 0.9, '#ffd8a0', 'opacity=".6"') + E(4, 12, 4, 0.9, '#ffd8a0', 'opacity=".6"') + E(26, 10.6, 3, 0.8, '#ffd8a0', 'opacity=".6"')
        + '</g>'
        // two skiffs in front of the barge, over the pit
        + skiff(52, 62, 1.2) + skiff(108, 60, 1.2);
    },

    // 8 · The Mandalorian's Bounty: inside a round Mos Eisley docking bay (from
    // the photo: the tall curved wall with its thick rim, pilasters, doors,
    // vents and pipes, red streamers hanging from the top). The Razor Crest
    // sits on its landing struts in three-quarter view, as in the photo: the
    // long weathered hull, the rounded nose with its cockpit slits, the twin
    // nose cannons, and the two big engines on their pylons at the back.
    mando_bounty: () => {
      const [hull, hd] = LG([[0, '#d8dce2'], [0.5, '#a8acb4'], [1, '#7a7e86']]);
      const [side, sd] = LG([[0, '#9a9ea6'], [1, '#5e626a']]);
      const [eng, ed] = LG([[0, '#c8ccd2'], [0.5, '#8a8e96'], [1, '#4e525a']]);
      const engine = (x0, y0, x1, y1, r) => P(`M${x0} ${y0 - r} L${x1} ${y1 - r} L${x1} ${y1 + r} L${x0} ${y0 + r}Z`, eng, 'stroke="#3a3e46" stroke-width=".5"')
        + [0.25, 0.5, 0.75].map((k) => { const x = x0 + (x1 - x0) * k; const y = y0 + (y1 - y0) * k; return P(`M${x} ${y - r} Q${x + r * 0.35} ${y} ${x} ${y + r}`, 'none', 'stroke="#4e525a" stroke-width=".5"'); }).join('')
        + L(x0, y0 - r * 0.6, x1, y1 - r * 0.6, '#e8ecf0', 0.5, 'opacity=".6"')
        + E(x0, y0, r * 0.52, r, '#5e626a', 'stroke="#3a3e46" stroke-width=".5"') + E(x0, y0, r * 0.38, r * 0.74, '#1e2228') + [0.55, 0.3].map((k) => E(x0, y0, r * 0.38 * k, r * 0.74 * k, 'none', 'stroke="#4e525a" stroke-width=".4"')).join('') + C(x0, y0, r * 0.12, '#6a6e76');
      return fill([[0, '#e8b070'], [0.5, '#f4d09a'], [1, '#f8e0b4']]) + suns(124, 8, 0.6) + hd + sd + ed
        // the round bay wall: thick rim, curved face, pilasters, a band, doors, vents, pipes, stains
        + P('M0 28 Q80 8 160 28 L160 62 L0 62Z', '#c8a478') + P('M0 24 Q80 4 160 24 L160 30 Q80 10 0 30Z', '#e6c89e', 'stroke="#a8845a" stroke-width=".5"')
        + [6, 22, 40, 60, 100, 120, 138, 154].map((x) => { const t = 30 - Math.sin((x / 160) * Math.PI) * 20; return R(x - 1.6, t, 3.2, 62 - t, '#b8946a') + L(x - 1.6, t, x - 1.6, 62, '#9a7650', 0.4); }).join('')
        + P('M0 44 Q80 30 160 44', 'none', 'stroke="#a8845a" stroke-width="1"') + P('M0 46 Q80 32 160 46', 'none', 'stroke="#e0c098" stroke-width=".4"')
        + [[14, 50, 6, 12], [146, 50, 6, 12], [48, 46, 7, 16], [112, 46, 7, 16]].map(([x, y, w, h]) => R(x - w / 2, y, w, h, '#3a2414', 'stroke="#8a6a48" stroke-width=".6"') + R(x - w / 2 + 0.6, y + 0.6, w - 1.2, 1.6, '#5a3a20')).join('')
        + [[30, 36], [70, 26], [90, 26], [130, 36]].map(([x, y]) => R(x, y, 5, 2.4, '#4a3018', 'rx=".4"') + [1, 2, 3, 4].map((k) => L(x + k, y + 0.4, x + k, y + 2, '#8a6a48', 0.3)).join('')).join('')
        + P('M28 42 L28 60 M30 42 L30 60 M130 42 L130 60', 'none', 'stroke="#8a7458" stroke-width=".9"') + [[24, 34, 8, 10], [84, 30, 10, 14], [140, 38, 8, 10]].map(([x, y, w, h]) => R(x, y, w, h, '#8a6a48', 'opacity=".18"')).join('')
        + P('M0 30 Q12 40 22 28 M56 18 Q66 28 74 16 M96 16 Q106 26 116 18 M140 26 Q150 36 160 30', 'none', 'stroke="#b8322a" stroke-width=".8"')
        // the bay floor with its scorch rings
        + P('M0 62 L160 62 L160 90 L0 90Z', '#d8ae7a') + E(80, 76, 60, 9, '#b88a5a', 'opacity=".45"') + E(80, 76, 36, 5, '#8a6a4a', 'opacity=".3"') + [[20, 82], [140, 84]].map(([x, y]) => L(x - 10, y, x + 10, y, '#b8945e', 0.6)).join('')
        // the ship's shadow, the far engine on its pylon (behind the hull)
        + P('M30 78 L112 60 L134 64 L50 84Z', '#000', 'opacity=".2"')
        + P('M90 37 L94 34 L98 33 L95 37Z', '#6e727a') + engine(80, 32, 102, 26, 6)
        // landing struts
        + [[46, 68, 77], [72, 60, 71], [100, 52, 64], [116, 50, 61]].map(([x, y0, y1]) => L(x, y0, x, y1, '#3e424a', 1.2) + E(x, y1, 2.4, 0.8, '#3e424a')).join('')
        // the hull: top face, near side face, the raised spine and panels
        + P('M31.5 56.2 L111.5 28 L120.5 38 L36.5 61.8Z', hull, 'stroke="#4e525a" stroke-width=".6"')
        + P('M36.5 61.8 L120.5 38 L120.5 53 L36.5 70.8Z', side, 'stroke="#3e424a" stroke-width=".6"')
        + P('M50 51.4 L98 34.6 L104 38 L56 55Z', '#c8ccd2', 'stroke="#6e727a" stroke-width=".4"') + P('M58 52.2 L94 39.6 L96.6 41.2 L60.6 53.8Z', '#9a9ea6')
        + [[44, 55, 46, 59.6], [66, 48, 69, 53], [84, 42, 88, 47], [104, 36, 108, 41]].map(([a, b, c, d]) => L(a, b, c, d, '#6e727a', 0.4)).join('') + L(34, 59, 116, 33, '#eef2f6', 0.4, 'opacity=".7"')
        + [48, 60, 72, 84, 96, 108].map((x) => { const t = 61.8 - (x - 36.5) * 0.283; return L(x, t, x, t + 9 - (x - 36.5) * 0.071, '#4e525a', 0.4); }).join('') + L(36.5, 66.3, 120.5, 45.5, '#4e525a', 0.4) + [[52, 60], [80, 52], [108, 44]].map(([x, y]) => R(x, y, 4, 2.4, '#7a7e86', 'transform="rotate(-16 ' + x + ' ' + y + ')" stroke="#3e424a" stroke-width=".3"')).join('')
        + P('M66 56 L70 55 L64 67 L60 68Z M74 54 L77 53 L72 64 L69 65Z', '#8a4a2a', 'opacity=".55"') + R(86, 50, 10, 3, '#4e525a', 'transform="rotate(-15 91 51)"')
        // the rounded nose with its cockpit slits and twin cannons
        + `<g transform="rotate(-18 34 63)">${E(34, 63.5, 5, 8, hull, 'stroke="#4e525a" stroke-width=".6"')}${[60, 62.4, 64.8].map((y) => P(`M31.6 ${y} Q34 ${y - 0.8} 36.4 ${y}`, 'none', 'stroke="#1e2a36" stroke-width=".7"')).join('')}${E(33, 60, 1.2, 2, '#ffffff', 'opacity=".35"')}</g>`
        + L(32, 59.6, 20, 62.6, '#3e424a', 0.9) + L(35, 66.6, 23, 70, '#3e424a', 0.9) + C(20, 62.6, 0.6, '#5e626a') + C(23, 70, 0.6, '#5e626a')
        // the near engine on its pylon
        + P('M102 48 L108 52 L110 57 L104 54Z', '#6e727a', 'stroke="#3e424a" stroke-width=".4"') + engine(104, 60, 130, 52, 7)
        // pit droids at work: hose, crate, workbench
        + [[30, 84], [138, 82], [126, 86]].map(([x, y]) => `<g transform="translate(${x} ${y}) scale(1.1)">${E(0, -6, 2.4, 1.6, '#c86a2a')}${C(0, -6, 0.8, '#1a1a1a')}${L(-1, -4.6, -1.6, 0, '#5a5a5a', 0.6)}${L(1, -4.6, 1.6, 0, '#5a5a5a', 0.6)}${L(0, -5, 2.6, -3, '#5a5a5a', 0.5)}</g>`).join('')
        + R(144, 74, 12, 2, '#7a5a3a') + L(146, 76, 146, 82, '#5a4028', 0.6) + L(154, 76, 154, 82, '#5a4028', 0.6) + R(147, 71, 3, 3, '#5a5e66')
        + R(8, 78, 7, 5, '#7a5a3a', 'stroke="#4a3420" stroke-width=".4"') + L(8, 80.6, 15, 80.6, '#4a3420', 0.4) + P('M28 86 Q50 92 70 80', 'none', 'stroke="#3a3a40" stroke-width=".7"');
    },

    // 9 · Hunters' Den: a smoky back room where bounty hunters gather. Adobe
    // block walls, a hanging lamp, a bounty board crowded with notices, shelves
    // of trophies (helmets, a droid head), a weapon rack, crates, and the
    // table where a bounty puck throws up a blue hologram of the target. IG-88
    // and Cad Bane wait at the table; the door opens on the bright desert.
    hunters_den: () => {
      const blocks = Array.from({ length: 9 }, (_, r) => Array.from({ length: 12 }, (_, k) => R(((r % 2) * 7 + k * 14 - 7).toFixed(1), (r * 6).toFixed(1), 13.4, 5.4, ['#34241a', '#3a2a1e', '#302016'][(r + k) % 3], 'rx=".6"')).join('')).join('');
      return R(0, 0, 160, 90, '#1a120c') + blocks + R(0, 52, 160, 2, '#4a3424')
        // the bright doorway with the desert beyond, light spilling across the floor
        + P('M128 54 L128 20 C128 12 148 12 148 20 L148 54Z', '#f4c888') + P('M128 42 Q138 38 148 42 L148 54 L128 54Z', '#e0a868') + C(140, 24, 2.6, '#fff4d8', 'opacity=".9"') + C(146, 28, 1.6, '#ffe0a0', 'opacity=".8"')
        + P('M128 54 L148 54 L160 90 L108 90Z', '#f4c888', 'opacity=".14"') + P('M126 54 L126 18 C126 9 150 9 150 18 L150 54', 'none', 'stroke="#5a4028" stroke-width="1.4"')
        // the bounty board crowded with notices
        + R(48, 8, 40, 26, '#4a3020', 'stroke="#6a4a30" stroke-width=".6"')
        + [[50, 10], [58, 9.4], [66, 10.6], [74, 9.6], [80, 11], [52, 21], [60, 22], [68, 20.6], [76, 21.6]].map(([x, y], k) => R(x, y, 7, 10, k % 3 ? '#d8c49a' : '#c8b08a', `transform="rotate(${(k % 3) - 1} ${x + 3.5} ${y + 5})"`) + R(x + 1, y + 1, 5, 4, ['#6a5a4a', '#5a4a3a', '#7a6a58'][k % 3]) + L(x + 1, y + 6.4, x + 6, y + 6.4, '#5a4a3a', 0.35) + L(x + 1, y + 7.8, x + 4.6, y + 7.8, '#5a4a3a', 0.35) + C(x + 3.5, y + 0.4, 0.4, '#8a2a1a')).join('')
        // shelves of trophies: helmets and a droid head
        + R(94, 14, 26, 1.4, '#5a3a24') + R(94, 30, 26, 1.4, '#5a3a24')
        + C(98, 11.4, 2.4, '#c8ccd2') + R(96.4, 10.6, 3.2, 1, '#1a1a1e') + P('M103 14 C103 9 109 9 109 14Z', '#6a7a5a') + R(104.4, 11, 3.2, 1.2, '#1a1a1e') + C(114, 11.6, 2.4, '#9a6a3a') + C(113.2, 11, 0.5, '#ff3a2a')
        + R(96, 25, 6, 5, '#7a5a3a') + C(108, 27.4, 2.6, '#8a8e96') + C(107.2, 26.8, 0.6, '#ff4a2a') + C(108.8, 26.8, 0.6, '#ff4a2a') + R(113, 24, 4, 6, '#3a6a8a', 'opacity=".8"')
        // the weapon rack
        + R(6, 12, 34, 26, '#3a2618', 'stroke="#5a4028" stroke-width=".6"') + R(6, 16, 34, 1.2, '#5a4028') + R(6, 32, 34, 1.2, '#5a4028')
        + [10, 17, 24, 31, 37].map((x, k) => `<g transform="translate(${x} 14) rotate(${k % 2 ? 6 : -5})">${R(-1, 0, 2, 20, '#1a1a1e', 'rx=".6"')}${R(-1.8, 4, 3.6, 3, '#3a3a40')}${R(-0.6, -3, 1.2, 3, '#1a1a1e')}${R(-1.4, 14, 2.8, 5, k % 2 ? '#5a3a24' : '#2a2a30', 'rx=".6"')}</g>`).join('')
        // the hanging lamp and the smoke
        + L(78, 0, 78, 36, '#2a1a10', 0.4) + P('M74 36 L82 36 L80 39 L76 39Z', '#6a5a4a') + C(78, 39.6, 1.6, '#ffd08a') + C(78, 44, 22, '#ffb060', 'opacity=".08"')
        + [[40, 40, 30, 4], [96, 36, 26, 3.4], [70, 30, 20, 3]].map(([x, y, rx, ry]) => E(x, y, rx, ry, '#8a7a6a', 'opacity=".08"')).join('')
        // crates and a barrel
        + R(4, 66, 14, 12, '#6a4a2a', 'stroke="#3a2614" stroke-width=".6"') + L(4, 72, 18, 72, '#3a2614', 0.5) + R(10, 58, 10, 8, '#7a5a34', 'stroke="#3a2614" stroke-width=".5"') + R(144, 66, 10, 14, '#4a4a50', 'rx="2"') + L(144, 70, 154, 70, '#2a2a30', 0.6) + L(144, 76, 154, 76, '#2a2a30', 0.6)
        // the table with the bounty puck and the hologram of the target
        + E(76, 72, 30, 7.4, '#4a3020', 'stroke="#6a4a30" stroke-width=".7"') + E(76, 70.6, 30, 6.8, '#5a3a26') + R(74, 76, 4, 14, '#3a2414')
        + E(76, 69, 3.4, 1.1, '#3a3a40') + E(76, 68.6, 1.6, 0.5, '#8ad8ff') + P('M72.6 69 L64 38 L88 38 L79.4 69Z', '#6ac8ff', 'opacity=".12"')
        + `<g opacity=".85">${C(76, 42.4, 2.6, '#8ad8ff', 'opacity=".7"')}${P('M72.4 46 L79.6 46 L80.6 56 L71.4 56Z', '#8ad8ff', 'opacity=".5"')}${L(72.4, 47, 69.6, 54, '#8ad8ff', 1)}${L(79.6, 47, 82.4, 54, '#8ad8ff', 1)}${L(73.6, 56, 73, 64, '#8ad8ff', 1.2)}${L(78.4, 56, 79, 64, '#8ad8ff', 1.2)}${Array.from({ length: 10 }, (_, k) => L(68, 40 + k * 2.6, 84, 40 + k * 2.6, '#bfeaff', 0.25)).join('')}</g>`
        + [[60, 70, -10], [64, 71.4, 6], [90, 70, 12], [94, 71.4, -4]].map(([x, y, a]) => R(x - 1.4, y - 1, 2.8, 2, '#d8c8a8', `transform="rotate(${a} ${x} ${y})"`)).join('') + [[86, 72.4], [88, 73], [68, 72.6], [70, 73.4]].map(([x, y]) => E(x, y, 1.2, 0.5, '#d8b040')).join('') + R(56, 66.4, 2, 3, '#bfe0f0', 'opacity=".7"')
        // Cad Bane in his wide-brimmed hat, and IG-88 standing tall
        + E(46, 70, 6, 10, '#3a3e48') + P('M40 62 L52 62 L54 80 L38 80Z', '#4a3a2a') + C(46, 56, 3.4, '#3a6a8a') + C(44.8, 55.6, 0.6, '#ff3a2a') + C(47.2, 55.6, 0.6, '#ff3a2a') + E(46, 52.6, 7, 1.4, '#3a2a1e') + P('M42.6 52.6 C42.6 48 49.4 48 49.4 52.6Z', '#4a3424') + L(42, 59, 40, 61, '#b8a888', 0.6) + L(50, 59, 52, 61, '#b8a888', 0.6)
        + R(104, 58, 6, 22, '#4a4e56') + R(103, 62, 8, 1.4, '#6a6e76') + L(104, 64, 100, 74, '#4a4e56', 1.4) + L(110, 64, 114, 72, '#4a4e56', 1.4) + R(105.4, 48, 3.2, 10, '#4a4e56') + R(103.4, 44, 7.2, 4.4, '#5a5e66', 'rx="1"') + C(105.4, 46.2, 0.6, '#ff3a2a') + C(108.6, 46.2, 0.6, '#ff3a2a') + L(114, 72, 118, 56, '#1a1a1e', 0.9)
        + R(0, 80, 160, 10, '#0e0906') + [0, 20, 40, 60, 80, 100, 120, 140].map((x) => L(x, 80, x - 4, 90, '#2a1a10', 0.5)).join('') + P('M0 80 L160 80', 'none', 'stroke="#3a2818" stroke-width=".6"');
    },

    // 10 · Jabba's Palace: the throne room. Jabba in the centre, drawn like
    // the raid's Jabba (the same face: heavy lids, gold slit eyes, the wide
    // mouth) and posed like the figure photo: sprawled on his dais with his
    // arms folded on his belly and his tail curling away to the left. His
    // hookah, cushions and Salacious Crumb; the dais front with its iron
    // rings; stone arches, grated windows throwing light through the smoke,
    // Han in carbonite on the wall, lamps and guards in the gloom.
    jabbas_palace: () => {
      const [skin, skd] = LG([[0, '#9aaa5e'], [0.6, '#7a8a4a'], [1, '#4e5a2e']]);
      const [back, bkd] = LG([[0, '#6a6a40'], [1, '#3e4026']]);
      return fill([[0, '#1e130c'], [0.5, '#2e1e12'], [1, '#160e08']]) + skd + bkd
        // grated windows high up, light shafts through the smoke
        + [[40, 4], [80, 2], [120, 4]].map(([x, y]) => R(x - 8, y, 16, 8, '#c8a878', 'opacity=".75"') + [x - 4, x, x + 4].map((gx) => L(gx, y, gx, y + 8, '#2a1a10', 0.8)).join('') + L(x - 8, y + 4, x + 8, y + 4, '#2a1a10', 0.6) + P(`M${x - 8} ${y + 8} L${x + 8} ${y + 8} L${x + 18} 70 L${x - 14} 70Z`, '#f0d8a8', 'opacity=".07"')).join('')
        + [[30, 30, 34, 6], [120, 24, 30, 5], [80, 18, 40, 4]].map(([x, y, rx, ry]) => E(x, y, rx, ry, '#8a7a6a', 'opacity=".09"')).join('')
        // stone arches and pillars, lamps
        + [8, 152].map((x) => R(x - 6, 0, 12, 64, '#3e2a1a', 'stroke="#22160c" stroke-width=".5"') + [12, 26, 40, 54].map((y) => L(x - 6, y, x + 6, y, '#2a1a10', 0.5)).join('')).join('')
        + [[30, 14], [130, 14]].map(([x, w]) => P(`M${x - w} 64 L${x - w} 28 C${x - w} 12 ${x + w} 12 ${x + w} 28 L${x + w} 64Z`, '#120a06', 'stroke="#5a3a26" stroke-width=".9"') + P(`M${x - w + 2} 64 L${x - w + 2} 29 C${x - w + 2} 15 ${x + w - 2} 15 ${x + w - 2} 29`, 'none', 'stroke="#3a2618" stroke-width=".6"')).join('')
        + [[18, 30], [142, 30], [56, 26], [104, 26]].map(([x, y]) => R(x - 1, y, 2, 4, '#2a180c') + C(x, y - 1.4, 1.6, '#ffc06a') + C(x, y - 1.4, 7, '#ffb04a', 'opacity=".14"')).join('')
        // guards waiting in the arches
        + [[26, 62], [134, 62]].map(([x, y]) => E(x, y - 6, 3.4, 6, '#2a2618') + C(x, y - 13, 2.6, '#3a3a22') + L(x + 3, y - 16, x + 3.4, y, '#4a3a2a', 0.6) + P(`M${x + 3} ${y - 17} L${x + 6} ${y - 15} L${x + 3} ${y - 13}Z`, '#6a6a70')).join('')
        // Han Solo frozen in carbonite on the wall
        + R(44, 30, 10, 20, '#5a6470', 'rx="1" stroke="#2a3038" stroke-width=".6"') + R(45.2, 31.2, 7.6, 17.6, '#7a8694') + P('M47 36 C47 33 51 33 51 36 L50.6 38.6 L47.4 38.6Z', '#9aa6b4') + P('M46 40 L47.4 46 M52 40 L50.6 46 M47.4 38.6 L45.8 40 M50.6 38.6 L52.2 40', 'none', 'stroke="#9aa6b4" stroke-width=".8"') + R(45.4, 48, 7.2, 1.2, '#3a4048') + [['#ff4a4a', 46.6], ['#4ade80', 49], ['#ffcf3a', 51.4]].map(([c, x]) => C(x, 48.6, 0.3, c)).join('')
        // the dais: stone top with cushions, the front with its iron rings
        + P('M6 60 L154 60 L156 64 L4 64Z', '#6a4a30') + R(4, 64, 152, 18, '#4e3420', 'stroke="#2a1a0e" stroke-width=".6"')
        + [4, 34, 64, 94, 124].map((x) => L(x, 64, x, 82, '#2a1a0e', 0.7)).join('') + [19, 49, 79, 109, 139].map((x) => C(x, 73, 3, 'none', 'stroke="#2a2a2e" stroke-width="1.4"') + C(x, 73, 1.4, '#3a3a40') + C(x - 0.6, 72.4, 0.5, '#8a8a90', 'opacity=".6"')).join('')
        + [[26, 59, 8], [44, 58.6, 6], [128, 58.6, 6]].map(([x, y, w]) => E(x, y, w, 2.2, '#7a3424', 'stroke="#4a1a10" stroke-width=".4"')).join('')
        // Jabba: the tail sweeping away to the left, the great body, the folded arms
        + P('M44 60 C34 58 24 60 12 61 C8 61 6 59 10 58 C20 55 32 52 46 52 C50 40 64 32 82 32 L104 32 C120 34 128 46 128 56 L128 60Z', skin, 'stroke="#3a4420" stroke-width=".7"')
        + P('M46 52 C50 40 64 32 82 32 L90 32 C76 36 66 44 62 58 L44 60Z', back, 'opacity=".6"')
        + [[20, 58.6], [30, 57], [40, 55.6]].map(([x, y]) => P(`M${x} ${y - 2} Q${x + 1.6} ${y} ${x} ${y + 2}`, 'none', 'stroke="#4e5a2e" stroke-width=".6"')).join('')
        + E(100, 50, 20, 9, '#a8b46a', 'opacity=".55"') + [44, 48, 52, 56].map((y) => P(`M84 ${y} Q100 ${y + 2.6} 118 ${y}`, 'none', 'stroke="#5e6c38" stroke-width=".6" opacity=".8"')).join('')
        + P('M84 40 C80 44 82 48 90 48 L100 47 C102 45 100 43 96 43 L88 43Z', '#8a9a52', 'stroke="#3a4420" stroke-width=".5"') + P('M118 40 C122 44 120 48 112 48 L102 47 C100 45 102 43 106 43 L114 43Z', '#7a8a4a', 'stroke="#3a4420" stroke-width=".5"')
        + [[98, 46], [100.4, 45.6], [103, 46]].map(([x, y]) => E(x, y, 1.2, 0.8, '#9aaa5e', 'stroke="#3a4420" stroke-width=".3"')).join('')
        // his face, as in the raid art
        + '<g transform="translate(101 26) scale(.36) translate(-50 -47)">'
          + P('M22 62 C18 34 32 18 50 18 C68 18 82 34 78 62 C74 72 62 76 50 76 C38 76 26 72 22 62Z', '#8a9a52', 'stroke="#3a4420" stroke-width="1.4"') + P('M22 62 C18 34 32 18 50 18 L50 76 C38 76 26 72 22 62Z', '#000', 'opacity=".1"')
          + E(39, 40, 5.4, 3.6, '#e8b830') + E(61, 40, 5.4, 3.6, '#e8b830') + E(39, 40, 1.4, 3, '#140c06') + E(61, 40, 1.4, 3, '#140c06') + P('M33 36 Q39 33 45 36', 'none', 'stroke="#5e6c38" stroke-width="2.2"') + P('M55 36 Q61 33 67 36', 'none', 'stroke="#5e6c38" stroke-width="2.2"')
          + P('M32 34 Q39 30 46 34 M54 34 Q61 30 68 34', 'none', 'stroke="#6a7a3e" stroke-width="3" opacity=".7"')
          + C(46, 48, 1.2, '#3a4420') + C(54, 48, 1.2, '#3a4420') + P('M28 56 Q50 66 72 56 Q50 61 28 56Z', '#4a2a2a') + P('M30 56.5 Q50 64 70 56.5', 'none', 'stroke="#2a1414" stroke-width="1.4"')
          + P('M26 26 Q50 16 74 26', 'none', 'stroke="#6a7a3e" stroke-width="1.6" opacity=".6"')
        + '</g>'
        // the hookah beside him, its pipe at his mouth
        + E(136, 56, 4, 5, '#c8a050', 'opacity=".75" stroke="#8a6a2a" stroke-width=".5"') + E(136, 57, 2.6, 3, '#e8c870', 'opacity=".5"') + R(135.2, 44, 1.6, 8, '#8a6a2a') + C(136, 43, 2, '#a8823a') + P('M136 46 Q124 30 112 31', 'none', 'stroke="#5a4028" stroke-width=".6"')
        // Salacious Crumb cackling on the edge of the dais
        + `<g transform="translate(112 62) scale(1.2)">${E(0, 0, 2, 1.6, '#c8a07a')}${C(0, -2.4, 1.6, '#d8b08a')}${E(-2.2, -3.2, 1.3, 0.8, '#d8b08a', 'transform="rotate(-20 -2.2 -3.2)"')}${E(2.2, -3.2, 1.3, 0.8, '#d8b08a', 'transform="rotate(20 2.2 -3.2)"')}${P('M-0.8 -1.8 L0.8 -1.8 L0 -0.8Z', '#2a1a0c')}${C(-0.6, -2.8, 0.3, '#1a0f08')}${C(0.6, -2.8, 0.3, '#1a0f08')}${L(-1.4, 1, -2, 3, '#c8a07a', 0.5)}${L(1.4, 1, 2, 3, '#c8a07a', 0.5)}</g>`
        + R(0, 82, 160, 8, '#1a100a') + [0, 20, 40, 60, 80, 100, 120, 140].map((x) => L(x, 82, x - 4, 90, '#2a1a10', 0.5)).join('');
    },

  };
  const TATOOINE = ['mos_eisley', 'jundland', 'beggars', 'sandcrawler', 'cantina', 'jabbas_gate', 'dune_sea_orbit', 'mando_bounty', 'hunters_den', 'jabbas_palace'];
  root.StageArt24 = { scenes: S, svg, worlds: { tatooine: TATOOINE }, render: (id) => (S[id] ? svg(S[id]()) : '') };
})(typeof window !== 'undefined' ? window : globalThis);
