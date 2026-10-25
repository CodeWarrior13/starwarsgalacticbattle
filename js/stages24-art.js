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

    // 5 · Chalmun's Cantina: the round bar in the middle (the view you liked),
    // now lit like the film: the bar glowing from inside with its chrome
    // dispenser column, copper and glass tanks, bottles and hanging cone lamps,
    // the cream counter with patrons on stools, the bartender behind it, the
    // Bith band on the bandstand, booths in the arched alcoves, smoke and gloom.
    cantina: () => {
      const [glowBar, gb] = LG([[0, '#fff4d0'], [0.6, '#f0c47a'], [1, '#b8782e']]);
      const [counter, cb] = LG([[0, '#fff6e2'], [0.5, '#e4d4b4'], [1, '#a8987a']]);
      // a patron on a stool, seen from behind: clothes, head, a rim of bar light
      const patron = (x, y, body, head, kind) => {
        let h = C(x, y - 10.4, 2.4, head);
        if (kind === 'greedo') h = E(x, y - 10.6, 2.6, 2.8, head) + L(x - 1.4, y - 13, x - 2, y - 14.4, head, 0.6) + L(x + 1.4, y - 13, x + 2, y - 14.4, head, 0.6) + P(`M${x + 2} ${y - 10} l1.8 .6 l-1.8 .8Z`, head);
        if (kind === 'walrus') h = C(x, y - 10.6, 2.6, head) + P(`M${x + 1.6} ${y - 9.6} l2.4 1.4 l-2.2 .6Z`, '#e8e0c8');
        if (kind === 'hair') h = C(x, y - 10.4, 2.4, head) + P(`M${x - 2.4} ${y - 10.6} C${x - 2.4} ${y - 14} ${x + 2.4} ${y - 14} ${x + 2.4} ${y - 10.6} L${x + 2} ${y - 9} L${x - 2} ${y - 9}Z`, '#2a1a10');
        if (kind === 'hood') h = P(`M${x - 2.8} ${y - 8} C${x - 3} ${y - 14} ${x + 3} ${y - 14} ${x + 2.8} ${y - 8}Z`, head);
        return R(x - 0.6, y, 1.2, 6, '#2a1a10') + E(x, y, 2.8, 0.8, '#6a4a30') + P(`M${x - 3.4} ${y} C${x - 3.8} ${y - 4} ${x - 3.2} ${y - 7.4} ${x - 2} ${y - 8.4} L${x + 2} ${y - 8.4} C${x + 3.2} ${y - 7.4} ${x + 3.8} ${y - 4} ${x + 3.4} ${y}Z`, body) + h
          + P(`M${x - 2} ${y - 8.4} C${x - 3.2} ${y - 7.4} ${x - 3.8} ${y - 4} ${x - 3.4} ${y}`, 'none', 'stroke="#ffcf80" stroke-width=".35" opacity=".6"');
      };
      return fill([[0, '#1e130c'], [0.6, '#2c1c12'], [1, '#140c08']]) + gb + cb
        // the curved back wall with its ribs, and the arched alcove booths
        + P('M0 0 L160 0 L160 50 Q80 36 0 50Z', '#3e281a') + [20, 46, 70, 90, 114, 140].map((x) => P(`M${x} 0 Q${x + (x < 80 ? 4 : -4)} 20 ${x + (x < 80 ? 2 : -2)} ${44 - Math.abs(80 - x) * 0.1}`, 'none', 'stroke="#2a1a10" stroke-width="1.6"')).join('')
        + [12, 34, 126, 148].map((x) => P(`M${x - 9} 52 L${x - 9} 33 C${x - 9} 25 ${x + 9} 25 ${x + 9} 33 L${x + 9} 52Z`, '#160c06', 'stroke="#6a4a30" stroke-width=".8"') + E(x, 46, 6.4, 2, '#5a3a24') + R(x - 0.8, 46, 1.6, 6, '#3a2414')
          + C(x, 30, 1.4, '#ffb060', 'opacity=".8"') + C(x, 30, 6, '#ffb060', 'opacity=".12"')
          + C(x - 4, 40, 1.6, ['#5a7a5a', '#6a4a6a', '#4a5a7a', '#7a5a3a'][(x / 2) % 4]) + E(x - 4, 44, 2.2, 2.8, '#3a2e3e') + C(x + 4, 40, 1.6, '#8a6a4a') + E(x + 4, 44, 2.2, 2.8, '#4a3a2a') + R(x - 1, 44.4, 2, 1.4, '#c8a050', 'opacity=".7"')).join('')
        // the bandstand and the Bith band: big domed heads, dark eyes, horns and keys
        + P('M58 36 L102 36 L99 42 L61 42Z', '#5a3a24', 'stroke="#2a1a10" stroke-width=".5"') + R(60, 41.6, 40, 1.2, '#3a2414')
        + [65, 72.5, 80, 87.5, 95].map((x, k) => E(x, 32, 1.8, 3.8, '#4a3a3a') + E(x, 26.4, 2.8, 3, '#d8b8a0') + E(x, 25.4, 2.4, 1.6, '#e8c8b0') + C(x - 1, 27, 0.6, '#0a0606') + C(x + 1, 27, 0.6, '#0a0606') + (k === 2 ? R(x - 3, 30, 6, 2, '#3a3a40') : L(x + 1.2, 29.6, x + 3.4, 33.4, k % 2 ? '#d8b050' : '#a8a8b0', 0.8) + C(x + 3.4, 33.4, 0.8, k % 2 ? '#d8b050' : '#a8a8b0'))).join('')
        + [64, 96].map((x) => C(x, 20, 1.4, '#ffd08a') + P(`M${x} 21 L${x - 6} 36 L${x + 6} 36Z`, '#ffe0a0', 'opacity=".08"')).join('')
        // the bar's lit interior: the glow, dispenser column, copper and glass tanks, bottles
        + E(80, 60, 42, 10, glowBar)
        + R(74, 38, 12, 22, '#8a8e96', 'stroke="#c8ccd2" stroke-width=".5"') + R(75.4, 38, 2.4, 22, '#e8ecf0', 'opacity=".5"') + [42, 46, 50, 54].map((y) => R(74, y, 12, 0.8, '#5a5e66')).join('') + E(80, 38, 6, 1.6, '#c8ccd2') + [76, 80, 84].map((x) => L(x, 56, x, 58.4, '#3a3a40', 0.6)).join('')
        + [[56, 52, 3, 7], [64, 49, 2.6, 9], [96, 49, 2.6, 9], [104, 52, 3, 7]].map(([x, y, r, h], k) => R(x - r, y, r * 2, h, k % 2 ? '#c8803a' : '#d89a4a', 'rx="1"') + P(`M${x - r} ${y} C${x - r} ${y - r} ${x + r} ${y - r} ${x + r} ${y}Z`, '#e8b468') + R(x - r * 0.6, y + 1, r * 0.4, h - 2, '#fff2c0', 'opacity=".6"')).join('')
        + Array.from({ length: 14 }, (_, k) => { const x = 50 + k * 4.6; return R(x, 55, 1, 2.4, ['#6a9a6a', '#9a5a3a', '#5a7aa8', '#c8a050'][k % 4], 'opacity=".85"'); }).join('')
        // the bartender behind the counter
        + E(90, 55, 3.4, 4, '#5a4a3a') + C(90, 49.6, 2.4, '#d8a888') + P('M87.6 49 C87.6 46.4 92.4 46.4 92.4 49Z', '#4a3420') + R(87, 54, 6, 3, '#e8e0d0', 'opacity=".8"')
        // hanging cone lamps over the ring
        + [44, 56, 68, 80, 92, 104, 116].map((x, k) => { const y = 42 + Math.abs(80 - x) * 0.06; return L(x, 0, x, y - 3, '#2a1a10', 0.35) + P(`M${x - 2} ${y - 3} L${x + 2} ${y - 3} L${x + 1.2} ${y - 0.6} L${x - 1.2} ${y - 0.6}Z`, '#f0dca8') + C(x, y + 2, 5, '#fff0c0', 'opacity=".14"'); }).join('')
        // the round cream counter, its top lip and shadowed front
        + P('M34 60 C34 52 126 52 126 60 C126 70 34 70 34 60Z M44 60 C44 56 116 56 116 60 C116 65 44 65 44 60Z', counter, 'fill-rule="evenodd" stroke="#8a7a5e" stroke-width=".6"')
        + P('M34 60 C34 70 126 70 126 60 L126 66 C126 77 34 77 34 66Z', '#cdbd9c', 'stroke="#8a7a5e" stroke-width=".6"') + P('M34 66 C34 77 126 77 126 66 L126 68 C126 79 34 79 34 68Z', '#000', 'opacity=".25"')
        + [[52, 57.4], [60, 56.4], [100, 56.4], [108, 57.4], [70, 56]].map(([x, y]) => R(x - 0.8, y - 2.4, 1.6, 2.4, '#bfe0f0', 'opacity=".75"')).join('')
        // patrons on their stools around the bar, backs to us
        + patron(40, 74, '#4a5a3a', '#5a8a4a', 'greedo') + patron(52, 77, '#e8e0cc', '#d8a888', 'hair') + patron(66, 78.6, '#3a2a2a', '#7a6a5a', 'walrus') + patron(94, 78.6, '#5a3a4a', '#c8a088', 'hair') + patron(108, 77, '#3a3e4a', '#3a3e4a', 'hood') + patron(120, 74, '#6a4a2a', '#b8987a', 'head')
        // smoke and the floor
        + [[50, 30, 40, 4], [120, 24, 30, 3], [80, 14, 50, 3]].map(([x, y, rx, ry]) => E(x, y, rx, ry, '#c8b8a0', 'opacity=".06"')).join('')
        + R(0, 82, 160, 8, '#120a06') + [0, 20, 40, 60, 80, 100, 120, 140].map((x) => L(x, 82, x + 8, 90, '#2a1a10', 0.5)).join('') + R(0, 0, 160, 90, 'none', 'stroke="#000" stroke-width="10" opacity=".35"');
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
        // deep in the tunnel: the round iron door, studded, with the eye droid on its stalk
        + C(72, 70.6, 4.6, '#3a3028', 'stroke="#6a5a4a" stroke-width=".6"') + [-2.4, 0, 2.4].map((dx) => L(72 + dx, 66.4, 72 + dx, 74.8, '#1e1610', 0.5)).join('') + [[69, 68], [75, 68], [69, 73], [75, 73]].map(([x, y]) => C(x, y, 0.4, '#8a7a6a')).join('')
        + P('M76 66 Q79 65 79 68', 'none', 'stroke="#6a6a70" stroke-width=".5"') + C(79, 68.6, 1, '#7a7a80') + C(79.3, 68.6, 0.4, '#ff3a2a')
        // stone courses and weathering on the palace
        + [25, 31, 37, 43, 49].map((y, k) => Array.from({ length: 4 }, (_, i) => L(58 + 4 * i + (k % 2) * 2, y - 3, 58 + 4 * i + (k % 2) * 2, y, '#9a8666', 0.3)).join('')).join('')
        + [35, 41, 47, 53].map((y, k) => Array.from({ length: 9 }, (_, i) => L(78 + 4.4 * i + (k % 2) * 2.2, y - 3, 78 + 4.4 * i + (k % 2) * 2.2, y, '#9a8666', 0.3)).join('')).join('')
        + [[63, 22, 14], [70, 24, 10], [90, 33, 12], [104, 34, 14]].map(([x, y, h]) => P(`M${x} ${y} L${x + 1} ${y} L${x + 0.6} ${y + h} L${x + 0.2} ${y + h}Z`, '#7a6648', 'opacity=".35"')).join('')
        + [[46, 62, 8], [110, 64, 10], [30, 72, 6], [130, 74, 8]].map(([x, y, w]) => P(`M${x} ${y} l${w * 0.4} ${w * 0.3} l${w * 0.3} -${w * 0.2} l${w * 0.3} ${w * 0.4}`, 'none', 'stroke="#6a5240" stroke-width=".4"')).join('')
        // the mountainside in detail: wind-grooved rock folds, ledges, crevices and scree
        + (() => {
          const fold = (id, d, x0, x1, y0, y1, n, c1, c2) => `<g clip-path="url(#${id})"><clipPath id="${id}"><path d="${d}"/></clipPath>${P(d, c1)}${Array.from({ length: n }, (_, k) => { const y = y0 + ((y1 - y0) * k) / n; const w = (k * 13) % 7; return P(`M${x0} ${y} Q${x0 + (x1 - x0) * 0.25} ${y - 2 - w * 0.3} ${x0 + (x1 - x0) * 0.5} ${y} T${x1} ${y}`, 'none', `stroke="${c2}" stroke-width=".7" opacity=".7"`) + P(`M${x0} ${y + 0.9} Q${x0 + (x1 - x0) * 0.25} ${y - 1.1 - w * 0.3} ${x0 + (x1 - x0) * 0.5} ${y + 0.9} T${x1} ${y + 0.9}`, 'none', 'stroke="#e8d8b8" stroke-width=".4" opacity=".55"'); }).join('')}</g>`;
          return fold('jg-l', 'M0 62 C8 56 18 54 30 58 C38 60 44 66 46 76 L0 82Z', 0, 46, 56, 80, 12, '#b49c78', '#7a6248')
            + fold('jg-r', 'M160 60 C150 54 136 54 124 58 C116 62 112 68 112 78 L160 84Z', 112, 160, 54, 82, 12, '#ac9472', '#725a40')
            + fold('jg-f', 'M0 80 C30 74 50 80 64 84 L64 90 L0 90Z', 0, 64, 76, 90, 6, '#9a8264', '#6a5238')
            + fold('jg-g', 'M160 82 C134 76 112 80 98 86 L98 90 L160 90Z', 98, 160, 78, 90, 6, '#9a8264', '#6a5238')
            + P('M18 60 L20 66 L17 72 M34 60 L36 64 M140 58 L137 64 L140 70 M126 62 L128 68', 'none', 'stroke="#4a3626" stroke-width=".7"')
            + P('M2 58 L14 54 L24 55 L22 57 L4 60Z M136 54 L150 52 L158 54 L148 56Z', '#c8b490', 'opacity=".8"')
            + [[50, 84, 1.4], [56, 86, 1], [92, 84, 1.2], [104, 86, 1.6], [70, 88, 0.8], [118, 88, 1.2], [30, 86, 1]].map(([x, y, r]) => E(x, y, r * 1.4, r * 0.7, '#7a6248') + E(x - r * 0.3, y - r * 0.2, r * 0.7, r * 0.3, '#c8b490', 'opacity=".7"')).join('')
            + P('M0 50 L12 46 L20 48 L28 44 L36 47 L44 44 L52 50 L40 52 L20 52Z M110 48 L122 44 L134 46 L146 42 L160 46 L160 52 L120 52Z', '#9a8a74', 'opacity=".55"');
        })()
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
        // the Great Pit of Carkoon: the sand funnel with the Sarlacc's beak and short tentacles
        + E(80, 80, 32, 8.4, '#b0703e') + E(80, 80.8, 25, 6.4, '#9a5a2e') + E(80, 81.6, 17, 4.4, '#7a4220') + E(80, 82.4, 10, 2.6, '#4a2410') + E(80, 83, 5, 1.4, '#2a1008')
        + ripples(74, 86, '#8a5028', 3, 0.25) + P('M76 83 L80 80.6 L84 83 L80 84.4Z', '#d8b08a') + C(80, 83, 0.8, '#ff9a6a')
        + [[-5, -1, -9, -4], [5, -1, 9, -5], [-2.6, 0, -5, -6], [2.6, 0, 4.6, -6]].map(([a, b, c, d]) => P(`M${80 + a} ${83 + b} Q${80 + (a + c) / 2} ${83 + d - 2} ${80 + c} ${83 + d}`, 'none', 'stroke="#7a3a2a" stroke-width="1" stroke-linecap="round"')).join('')
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
          // hull plating, the bow ram, a striped deck awning and crew at the rail
          + [6.6, 9].map((y) => L(-36, y, 35, y - 0.6, '#7a5a3a', 0.35)).join('') + P('M36 -0.4 L44 -1 L38 3Z', '#8a6a46', 'stroke="#5a4028" stroke-width=".4"')
          + P('M-24 -6 L16 -6 L18 -9 L-26 -9Z', '#d8c8a8', 'stroke="#a89878" stroke-width=".3"') + Array.from({ length: 8 }, (_, k) => P(`M${-24 + k * 5} -6 L${-21.6 + k * 5} -6 L${-23.4 + k * 5} -9 L${-25.8 + k * 5} -9Z`, '#b8322a', 'opacity=".7"')).join('')
          + [[-22, -10], [-16, -10], [-4, -10], [6, -10], [12, -10]].map(([x, y]) => C(x, y, 0.6, '#3a2a1a') + R(x - 0.5, y + 0.6, 1, 1.6, '#4a3a2a')).join('')
          + [[-30, 1.6], [-14, 1.6], [6, 1.6], [24, 1.6]].map(([x, y]) => R(x, y, 4, 1, '#c8a878', 'opacity=".6"')).join('')
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
        // wall detail: block courses, a catwalk under the rim, pipes, lamps, stains, a fuel tank and cables
        + [36, 40, 50, 54, 58].map((y) => P(`M0 ${y + 4} Q80 ${y - 12} 160 ${y + 4}`, 'none', 'stroke="#b08c62" stroke-width=".35" opacity=".8"')).join('')
        + Array.from({ length: 30 }, (_, k) => { const x = 3 + k * 5.4; const t = 52 - Math.sin((x / 160) * Math.PI) * 14; return L(x, t, x, t + 4, '#a07a52', 0.3); }).join('')
        + P('M0 34 Q80 14 160 34 L160 35.6 Q80 15.6 0 35.6Z', '#8a6a48') + Array.from({ length: 20 }, (_, k) => { const x = 4 + k * 8; const t = 35 - Math.sin((x / 160) * Math.PI) * 20; return L(x, t, x, t + 2.4, '#6a4a30', 0.4); }).join('')
        + P('M0 40 Q80 24 160 40', 'none', 'stroke="#7a6a5a" stroke-width="1.1"') + P('M0 41.4 Q80 25.4 160 41.4', 'none', 'stroke="#5a4a3a" stroke-width=".6"')
        + [[18, 38], [52, 30], [108, 30], [142, 38]].map(([x, y]) => R(x - 1, y, 2, 1.4, '#3a2a1a') + C(x, y + 2, 0.9, '#ffe0a0') + C(x, y + 2, 4, '#ffd08a', 'opacity=".16"')).join('')
        + [[36, 40, 3, 18], [124, 40, 3, 18], [80, 22, 4, 10]].map(([x, y, w, h]) => P(`M${x} ${y} L${x + w} ${y} L${x + w * 0.8} ${y + h} L${x + w * 0.2} ${y + h}Z`, '#6a4a2a', 'opacity=".2"')).join('')
        + R(64, 50, 10, 12, '#9a9ea6', 'rx="4" stroke="#5e626a" stroke-width=".5"') + R(65, 52, 2, 8, '#d8dce2', 'opacity=".6"') + L(64, 55, 74, 55, '#5e626a', 0.4) + P('M74 58 Q84 64 90 62', 'none', 'stroke="#2a2a30" stroke-width=".8"')
        + P('M8 30 Q14 36 22 30 M138 30 Q146 36 152 31', 'none', 'stroke="#3a3a40" stroke-width=".5"')
        // the bay floor with its scorch rings
        + P('M0 62 L160 62 L160 90 L0 90Z', '#d8ae7a') + E(80, 76, 60, 9, '#b88a5a', 'opacity=".45"') + E(80, 76, 36, 5, '#8a6a4a', 'opacity=".3"') + [[20, 82], [140, 84]].map(([x, y]) => L(x - 10, y, x + 10, y, '#b8945e', 0.6)).join('')
        // the ship's shadow, the far engine on its pylon (behind the hull)
        + P('M22 82 L106 58 L136 66 L44 90Z', '#000', 'opacity=".22"')
        + P('M84 30 L90 26 L94 27 L89 31Z', '#6e727a', 'stroke="#3e424a" stroke-width=".4"') + engine(74, 25, 100, 17, 9)
        // landing struts
        + [[44, 72, 82], [70, 64, 76], [98, 54, 69], [110, 50, 64]].map(([x, y0, y1]) => L(x, y0, x, y1, '#3e424a', 1.5) + L(x - 1.8, y1 - 3, x, y1 - 6.4, '#3e424a', 0.6) + E(x, y1, 3, 1, '#3e424a')).join('')
        // the hull, shorter and taller: top face and near side
        + P('M35.5 50 L102.5 22 L113.5 34 L44.5 58Z', hull, 'stroke="#4e525a" stroke-width=".6"')
        + P('M44.5 58 L113.5 34 L113.5 52 L44.5 72Z', side, 'stroke="#3e424a" stroke-width=".6"')
        // panel grid on top and side, hatches, vents
        + [[48, 44.6, 54, 51.6], [60, 39.6, 66, 46.6], [72, 34.6, 78, 41.6], [84, 29.6, 90, 36.6], [96, 24.6, 102, 31.4]].map(([a1, b1, c1, d1]) => L(a1, b1, c1, d1, '#7e828a', 0.45)).join('') + L(40, 53.8, 108, 28, '#7e828a', 0.45)
        + [54, 64, 74, 84, 94, 104].map((x) => { const t = 58 - (x - 44.5) * 0.3478; return L(x, t, x, t + 14 - (x - 44.5) * 0.058, '#4e525a', 0.45); }).join('') + L(44.5, 65, 113.5, 43, '#4e525a', 0.45) + L(44.5, 68.4, 113.5, 47.6, '#4e525a', 0.3)
        + [[52, 64.4], [80, 55], [104, 46.6]].map(([x, y]) => R(x, y, 5, 3, '#7a7e86', `transform="rotate(-19 ${x} ${y})" stroke="#3e424a" stroke-width=".3"`) + [1, 2, 3, 4].map((k) => L(x + k, y + 0.4, x + k - 0.3, y + 2.6, '#4e525a', 0.25)).join('')).join('')
        + R(60, 63, 10, 7, '#8a8e96', 'transform="rotate(-19 60 63)" stroke="#3e424a" stroke-width=".4"') + L(61.6, 64.6, 69, 62, '#4e525a', 0.3)
        // the rust markings streaked down the silver hull
        + P('M66 58 L70.4 56.6 L62 72.4 L57.6 73.6Z M75 55 L78.6 53.8 L71 68.6 L67.6 69.6Z M83 52.4 L85.8 51.4 L79.6 63.8 L77 64.6Z', '#8a3e22', 'opacity=".6"')
        + P('M92 48 L95 47 L91 55 L88.6 55.8Z M50 62 L53 61 L49 69 L46.6 69.8Z', '#7a4a2a', 'opacity=".45"') + P('M60 46 L72 41 L74 43 L62 48Z', '#7a4a2a', 'opacity=".35"')
        // the crest: the raised dorsal ridge running back along the top
        + P('M46 47.4 L98 25.6 L104 28.6 L52 50.6Z', '#c8ccd2', 'stroke="#5e626a" stroke-width=".5"') + P('M46 47.4 L98 25.6 L98 22.6 L46 44.4Z', '#e2e6ea', 'stroke="#5e626a" stroke-width=".5"') + P('M98 25.6 L104 28.6 L104 25.6 L98 22.6Z', '#8a8e96')
        + [56, 66, 76, 86].map((x) => { const t = 44.4 - (x - 46) * 0.419; return L(x, t, x, t + 3, '#6e727a', 0.4); }).join('') + L(48, 44.6, 97, 24, '#ffffff', 0.4, 'opacity=".7"')
        // the front: the rounded cockpit nose with its window band and the slatted front frame
        + P('M35.5 50 L44.5 58 L44.5 72 L35.5 64Z', '#8a8e96', 'stroke="#3e424a" stroke-width=".5"')
        + P('M36 50 C26 50 19 56 19 63.4 C19 70.4 25.6 74.6 34 74.4 L44.5 72 L44.5 58Z', hull, 'stroke="#3e424a" stroke-width=".7"') + P('M36 50 C26 50 19 56 19 63.4 L30 62Z', '#ffffff', 'opacity=".18"')
        + P('M22 58.4 C26 53.4 32 52 37.6 52.6 L38 55.4 C32.6 55 27.2 56.4 23.6 60.4Z', '#1e2a36', 'stroke="#0e141a" stroke-width=".3"') + [27, 31, 35].map((x) => L(x, 53, x + 0.6, 56, '#5e626a', 0.5)).join('')
        + [22, 25, 28, 31].map((x) => L(x, 62 + (x - 22) * 0.1, x + 0.4, 72 - (x - 22) * 0.2, '#4e525a', 0.6)).join('') + P('M21 66 Q30 64 40 66', 'none', 'stroke="#4e525a" stroke-width=".5"') + C(26.6, 67.6, 1.4, '#5e626a', 'stroke="#3e424a" stroke-width=".3"')
        // twin nose cannons
        + L(30, 56, 12, 59, '#3e424a', 1.2) + L(34, 71, 16, 75, '#3e424a', 1.2) + C(12, 59, 0.8, '#5e626a') + C(16, 75, 0.8, '#5e626a') + R(28, 55, 4, 2.2, '#5e626a', 'transform="rotate(-10 30 56)"') + R(32, 70, 4, 2.2, '#5e626a', 'transform="rotate(-12 34 71)"')
        // the near engine on its pylon
        + P('M94 50 L102 53 L104 59 L96 57Z', '#6e727a', 'stroke="#3e424a" stroke-width=".4"') + engine(98, 61, 128, 52, 11)
        + P('M112 49 L118 47 L117 53 L111 55Z', '#8a3e22', 'opacity=".45"')
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
        // more of the den: a hanging cloth, cracks, a wall map, chains, bottles, dust in the door light, a sleeping hound
        + P('M118 4 L126 4 L125 26 Q122 24 119 27Z', '#6a2a1e', 'opacity=".85"') + L(118, 4, 126, 4, '#3a1a10', 0.8)
        + P('M30 40 l3 3 l-1 3 l3 2 M98 42 l-2 4 l2 2 M140 8 l2 3 l-1 2', 'none', 'stroke="#140c08" stroke-width=".5"')
        + R(4, 42, 18, 12, '#2a3a4a', 'stroke="#5a4028" stroke-width=".6"') + P('M6 50 Q10 44 14 48 T20 46', 'none', 'stroke="#6ac8ff" stroke-width=".5" opacity=".8"') + C(15, 47, 0.8, '#ff4a2a')
        + P('M92 0 Q94 10 92 18 M96 0 Q98 8 96 14', 'none', 'stroke="#4a4a50" stroke-width=".6"') + [[94, 18], [96, 14]].map(([x, y]) => C(x, y + 1, 0.9, 'none', 'stroke="#4a4a50" stroke-width=".5"')).join('')
        + [[96, 22], [99, 22.4], [102, 22]].map(([x, y], k) => R(x, y, 1.4, 3, ['#6a9a6a', '#9a5a3a', '#c8a050'][k], 'opacity=".9"')).join('')
        + [[132, 40], [136, 46], [140, 34], [134, 52], [142, 48]].map(([x, y]) => C(x, y, 0.35, '#fff4d8', 'opacity=".6"')).join('')
        + E(26, 79, 7, 2.4, '#5a4a3a') + C(20.6, 78, 2, '#6a5a4a') + P('M19 76.6 L18 74.6 L20 76Z', '#6a5a4a') + L(32, 79, 35, 78, '#5a4a3a', 0.8)
        + R(0, 80, 160, 10, '#0e0906') + [0, 20, 40, 60, 80, 100, 120, 140].map((x) => L(x, 80, x - 4, 90, '#2a1a10', 0.5)).join('') + P('M0 80 L160 80', 'none', 'stroke="#3a2818" stroke-width=".6"');
    },

    // 10 · Jabba's Palace: the throne room as in the film. A round, smoky
    // chamber of smooth curved sandstone, lit amber from oil lamps and one
    // grated skylight. Jabba sprawls in the centre on his dais (the raid's
    // Jabba face, posed like the figure: arms folded on his belly, tail curled
    // away, mottled skin), Bib Fortuna at his side, Salacious Crumb cackling,
    // the hookah, Han in carbonite on the wall, Max Rebo's band to the left,
    // guards in the alcoves and the rancor trapdoor grate in the floor.
    jabbas_palace: () => {
      const [skin, skd] = LG([[0, '#a0ac62'], [0.55, '#7e8c4a'], [1, '#4a562a']]);
      const [wall, wd] = LG([[0, '#3e2a1a'], [0.6, '#5a3c24'], [1, '#2a1a10']]);
      return fill([[0, '#1a100a'], [0.5, '#2a1a10'], [1, '#120a06']]) + skd + wd
        // the round chamber: curved sandstone walls with soft ribs and alcoves
        + P('M0 8 Q80 -2 160 8 L160 64 L0 64Z', wall) + [12, 30, 50, 110, 130, 148].map((x) => P(`M${x} ${6 - Math.sin((x / 160) * Math.PI) * 6} Q${x + (x < 80 ? 2 : -2)} 34 ${x} 64`, 'none', 'stroke="#2a1a0e" stroke-width="1.4" opacity=".7"')).join('')
        + P('M0 30 Q80 20 160 30', 'none', 'stroke="#6a4a30" stroke-width=".6" opacity=".6"') + P('M0 46 Q80 38 160 46', 'none', 'stroke="#2a1a0e" stroke-width=".8" opacity=".6"')
        + [[22, 12], [138, 12]].map(([x, w]) => P(`M${x - w / 2} 64 L${x - w / 2} 38 C${x - w / 2} 30 ${x + w / 2} 30 ${x + w / 2} 38 L${x + w / 2} 64Z`, '#0e0804', 'stroke="#6a4a30" stroke-width=".8"')).join('')
        // the grated skylight over the throne, its shaft of light through the smoke
        + E(80, 6, 14, 3.4, '#d8b888', 'opacity=".8"') + [-9, -5, -1, 3, 7].map((dx) => L(80 + dx, 3.4, 80 + dx + 1, 8.6, '#2a1a0e', 0.7)).join('')
        + P('M66 7 L94 7 L112 62 L48 62Z', '#ffe8b8', 'opacity=".07"') + P('M70 7 L90 7 L102 62 L58 62Z', '#ffe8b8', 'opacity=".06"')
        + [[40, 24, 30, 5], [120, 20, 30, 4], [80, 30, 50, 4]].map(([x, y, rx, ry]) => E(x, y, rx, ry, '#c8b090', 'opacity=".07"')).join('')
        // oil lamps on the walls
        + [[8, 28], [44, 22], [116, 22], [152, 28]].map(([x, y]) => R(x - 1.2, y, 2.4, 4, '#2a180c') + C(x, y - 1.4, 1.6, '#ffc06a') + C(x, y - 1.4, 8, '#ffb04a', 'opacity=".14"')).join('')
        // guards waiting in the alcoves
        + [[22, 62], [138, 62]].map(([x, y]) => E(x, y - 6, 3.4, 6, '#3a3a22') + C(x, y - 13, 2.6, '#5a6a3a') + E(x - 0.8, y - 12.4, 1.4, 1, '#7a8a4a') + P(`M${x - 2.6} ${y - 14} C${x - 2.6} ${y - 17} ${x + 2.6} ${y - 17} ${x + 2.6} ${y - 14}Z`, '#4a3424') + L(x + 3, y - 18, x + 3.4, y, '#4a3a2a', 0.6) + P(`M${x + 3} ${y - 19} L${x + 6.4} ${y - 16.6} L${x + 3} ${y - 14.4}Z`, '#8a8a90')).join('')
        // Max Rebo's band: the blue organ player at his keys, a singer beside him
        + R(30, 54, 14, 6, '#4a4a52', 'rx="1" stroke="#22222a" stroke-width=".4"') + R(31, 52.4, 12, 1.8, '#c8c8d0') + [33, 36, 39, 42].map((x) => R(x, 46, 1.2, 6.4, '#8a8a92')).join('')
        + E(37, 51, 3.6, 3, '#4a7ab8') + C(37, 47, 2.6, '#5a8ac8') + P('M37 48 C38.4 50 38.6 52 37.6 54', 'none', 'stroke="#4a7ab8" stroke-width="1.2"') + C(36, 46.4, 0.4, '#0a0a10') + C(38, 46.4, 0.4, '#0a0a10')
        + E(50, 56, 1.8, 5, '#c8a8a0') + C(50, 50, 1.8, '#d8b8b0') + E(50, 48.6, 2.4, 1, '#8a4a5a')
        // Han Solo frozen in carbonite on the wall
        + R(120, 30, 10, 20, '#5a6470', 'rx="1" stroke="#2a3038" stroke-width=".6"') + R(121.2, 31.2, 7.6, 17.6, '#7a8694') + P('M123 36 C123 33 127 33 127 36 L126.6 38.6 L123.4 38.6Z', '#9aa6b4') + P('M122 40 L123.4 46 M128 40 L126.6 46 M123.4 38.6 L121.8 40 M126.6 38.6 L128.2 40', 'none', 'stroke="#9aa6b4" stroke-width=".8"') + R(121.4, 48, 7.2, 1.2, '#3a4048') + [['#ff4a4a', 122.6], ['#4ade80', 125], ['#ffcf3a', 127.4]].map(([c, x]) => C(x, 48.6, 0.3, c)).join('')
        // the dais: stone top, cushions, the front with its iron rings
        + P('M22 60 L138 60 L142 64 L18 64Z', '#6a4a30') + R(18, 64, 124, 14, '#4e3420', 'stroke="#2a1a0e" stroke-width=".6"') + [18, 49, 80, 111].map((x) => L(x, 64, x, 78, '#2a1a0e', 0.7)).join('') + [33.5, 64.5, 95.5, 126.5].map((x) => C(x, 71, 2.8, 'none', 'stroke="#2a2a2e" stroke-width="1.3"') + C(x, 71, 1.2, '#3a3a40') + C(x - 0.6, 70.4, 0.5, '#8a8a90', 'opacity=".6"')).join('')
        + [[36, 59, 7], [52, 58.6, 6], [118, 58.6, 6]].map(([x, y, w]) => E(x, y, w, 2.2, '#7a3424', 'stroke="#4a1a10" stroke-width=".4"')).join('')
        // Jabba: the long ringed tail curling away left, the great mottled body
        + P('M66 60 C56 57 44 58 32 60 C26 61 22 60 23 57.6 C26 55 34 53 44 52 C54 51 60 48 64 44 C70 36 80 31 92 30 L110 30 C122 32 128 42 128 54 L128 60Z', skin, 'stroke="#33401c" stroke-width=".7"')
        + P('M64 44 C70 36 80 31 92 30 L96 30 C84 34 76 42 72 56 L66 60 C60 58 56 56 52 55 C58 52 62 48 64 44Z', '#000', 'opacity=".18"')
        + [28, 34, 40, 46, 52, 58].map((x, k) => { const y = 59.6 - k * 0.9; return P(`M${x} ${y - 2.6 + k * 0.1} Q${x + 1.4} ${y} ${x} ${y + 2.4}`, 'none', 'stroke="#4e5a2a" stroke-width=".6"'); }).join('')
        + [[34, 58], [44, 55.4], [56, 52], [68, 44], [78, 38], [120, 40], [124, 50], [116, 56], [72, 52]].map(([x, y], k) => E(x, y, 1.4 + (k % 3) * 0.5, 0.8 + (k % 2) * 0.3, '#5a6632', 'opacity=".55"')).join('')
        // the belly with its folds, the short thick arms folded across it, fat fingers
        + P('M86 46 C86 40 114 40 114 46 L116 58 L84 58Z', '#b2b874', 'opacity=".6"') + [47.6, 50.6, 53.6, 56.6].map((y) => P(`M85 ${y} Q100 ${y + 2.2} 115 ${y}`, 'none', 'stroke="#5e6c38" stroke-width=".55" opacity=".85"')).join('')
        + P('M84 38 C79 42 80 48 88 49 L99 48.4 C101 46.6 99.6 44.4 96 44.4 L89 44.6 C88 42 86 40 84 38Z', '#8e9c56', 'stroke="#33401c" stroke-width=".5"') + P('M116 38 C121 42 120 48 112 49 L101 48.4 C99 46.6 100.4 44.4 104 44.4 L111 44.6 C112 42 114 40 116 38Z', '#7e8c4a', 'stroke="#33401c" stroke-width=".5"')
        + [[97.6, 46.4], [99.6, 45.8], [101.6, 46], [103.4, 46.6]].map(([x, y]) => E(x, y, 1.1, 1.4, '#a0ae64', 'stroke="#33401c" stroke-width=".3"')).join('') + R(98.6, 44.8, 2.6, 0.9, '#d0a840', 'rx=".3"')
        // the head: wide and heavy, sunk straight into the body
        + P('M86 34 C84 23 91 17 100 17 C109 17 116 23 114 34 C113.6 40 108.6 44 100 44.6 C91.4 44 86.4 40 86 34Z', skin, 'stroke="#33401c" stroke-width=".7"')
        + P('M86 34 C84 23 91 17 100 17 L100 44.6 C91.4 44 86.4 40 86 34Z', '#ffffff', 'opacity=".06"') + P('M100 17 C109 17 116 23 114 34 C113.6 40 108.6 44 100 44.6Z', '#000', 'opacity=".12"')
        + [[91, 22], [107, 21], [96, 19.6], [110, 27], [89, 28]].map(([x, y], k) => E(x, y, 1.2 + (k % 2) * 0.6, 0.7, '#5a6632', 'opacity=".55"')).join('')
        + P('M92 20.6 Q100 18.6 108 20.6 M90.6 23.4 Q100 21.4 109.4 23.4', 'none', 'stroke="#4e5a2a" stroke-width=".45" opacity=".8"')
        // heavy brow ridges and half-lidded gold eyes with slit pupils
        + P('M89.6 27.6 Q94.6 24.6 98.6 27.4 M101.4 27.4 Q105.4 24.6 110.4 27.6', 'none', 'stroke="#6e7a40" stroke-width="2.2" stroke-linecap="round"')
        + [94.4, 105.6].map((x) => E(x, 29.4, 2.6, 1.7, '#e8a830', 'stroke="#33401c" stroke-width=".4"') + E(x, 29.6, 1.7, 0.45, '#140c06') + P(`M${x - 2.7} 29.2 Q${x} 26.6 ${x + 2.7} 29.2 L${x + 2.6} 28.4 Q${x} 26.2 ${x - 2.6} 28.4Z`, '#7e8c4a') + C(x - 0.8, 29, 0.3, '#fff6d0', 'opacity=".8"')).join('')
        // nostril slits, the wide mouth, jowls and chins
        + P('M98.4 33.4 l-.8 1.2 M101.6 33.4 l.8 1.2', 'none', 'stroke="#33401c" stroke-width=".6"')
        + P('M89 37.4 Q100 41.6 111 37.4 Q100 40.2 89 37.4Z', '#4a2a2a') + P('M89 37.4 Q100 41.6 111 37.4', 'none', 'stroke="#2a1414" stroke-width=".7"') + P('M91 39 Q100 42.6 109 39', 'none', 'stroke="#a0ae64" stroke-width=".4" opacity=".7"')
        + P('M90 40.6 Q100 45 110 40.6 M92 42.4 Q100 45.8 108 42.4', 'none', 'stroke="#4e5a2a" stroke-width=".45" opacity=".8"')
        // Bib Fortuna at his side: pale Twi'lek, head-tails draped forward, dark robe, sharp teeth
        + P('M73 62 L74 50 C74.6 47.6 77.4 47.6 78 50 L79 62Z', '#2a1a2a', 'stroke="#140a14" stroke-width=".4"') + P('M74 50 L72.6 56 M78 50 L79.6 56', 'none', 'stroke="#4a3a4a" stroke-width=".6"')
        + C(76, 44.6, 2.4, '#e2d4cc', 'stroke="#8a7a72" stroke-width=".3"') + P('M74.2 43.6 C71.4 45 70.4 50 71.4 56 C72 54 72.6 50 74.4 46Z M77.8 43.6 C80.6 45 81.4 49 80.6 53 C80 51 79.4 48 77.6 46Z', '#d8c8c0', 'stroke="#8a7a72" stroke-width=".3"')
        + C(75.2, 44.2, 0.35, '#3a1a1a') + C(76.8, 44.2, 0.35, '#3a1a1a') + P('M75.2 46 L76.8 46 L76.4 46.8 L75.6 46.8Z', '#f0e8e0') + P('M74 42.6 Q76 41.4 78 42.6', 'none', 'stroke="#8a7a72" stroke-width=".4"')
        // the hookah beside him, its pipe at his mouth
        + E(134, 56, 4, 5, '#c8a050', 'opacity=".75" stroke="#8a6a2a" stroke-width=".5"') + E(134, 57, 2.6, 3, '#e8c870', 'opacity=".5"') + R(133.2, 44, 1.6, 8, '#8a6a2a') + C(134, 43, 2, '#a8823a') + P('M134 46 Q124 32 110 38', 'none', 'stroke="#5a4028" stroke-width=".6"')
        // Salacious Crumb cackling on the edge of the dais: big pointed ears, hooked beak, hair tuft, skinny limbs
        + `<g transform="translate(112 62) scale(1.4)">${E(0, 0.4, 1.6, 1.8, '#b89070', 'stroke="#6a4a30" stroke-width=".25"')}${L(-1, 2, -1.8, 3.6, '#b89070', 0.5)}${L(1, 2, 1.8, 3.6, '#b89070', 0.5)}${L(-1.4, -0.2, -2.8, 1.4, '#b89070', 0.45)}${L(1.4, -0.2, 2.8, 1.2, '#b89070', 0.45)}${C(0, -2.6, 1.7, '#c8a07c', 'stroke="#6a4a30" stroke-width=".25"')}${P('M-1.4 -3 L-4.6 -4.6 L-1.6 -2.2Z M1.4 -3 L4.6 -4.6 L1.6 -2.2Z', '#c8a07c', 'stroke="#6a4a30" stroke-width=".25"')}${P('M-0.6 -2.2 L0.6 -2.2 L1.4 -0.8 L0.4 -1.2Z', '#e8c070', 'stroke="#6a4a30" stroke-width=".2"')}${C(-0.7, -3, 0.42, '#fff4d0')}${C(0.7, -3, 0.42, '#fff4d0')}${C(-0.7, -3, 0.2, '#1a0f08')}${C(0.7, -3, 0.2, '#1a0f08')}${P('M-0.6 -4.2 L-0.2 -5.6 L0.2 -4.4 L0.6 -5.4 L0.6 -4.2Z', '#8a6a4a')}</g>`
        // the floor and the rancor trapdoor grate in front of the dais
        + R(0, 78, 160, 12, '#2a1a10') + [0, 20, 40, 60, 80, 100, 120, 140].map((x) => L(x, 78, x - 6, 90, '#1e120a', 0.5)).join('')
        + E(80, 85, 22, 4, '#0e0804', 'stroke="#6a4a30" stroke-width=".9"') + [64, 72, 80, 88, 96].map((x) => L(x, 81.4, x + 0.6, 88.6, '#6a4a30', 0.7)).join('') + L(58, 85, 102, 85, '#6a4a30', 0.7)
        + R(0, 0, 160, 90, 'none', 'stroke="#000" stroke-width="10" opacity=".35"');
    },

  };
  const TATOOINE = ['mos_eisley', 'jundland', 'beggars', 'sandcrawler', 'cantina', 'jabbas_gate', 'dune_sea_orbit', 'mando_bounty', 'hunters_den', 'jabbas_palace'];
  root.StageArt24 = { scenes: S, svg, worlds: { tatooine: TATOOINE }, render: (id) => (S[id] ? svg(S[id]()) : '') };
})(typeof window !== 'undefined' ? window : globalThis);
