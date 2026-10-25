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
    // wretched hive of scum and villainy." The spaceport spread across the
    // basin below (domes, the cantina's dome and vent tower, the round docking
    // bays), the landspeeder parked on the cliff edge, a vaporator, twin suns.
    mos_eisley: () => fill([[0, '#e2a868'], [0.55, '#f2cc94'], [1, '#f8e2b8']]) + suns(124, 16)
      + P('M0 36 L14 30 L26 34 L44 28 L60 33 L78 29 L98 34 L116 30 L140 35 L160 31 L160 50 L0 50Z', '#c89a68', 'opacity=".7"')
      + P('M0 46 Q80 38 160 46 L160 64 L0 64Z', '#e0b47c') + ripples(48, 60, '#b88a5a', 4, 0.25)
      // the spaceport: round docking bays, domes, the cantina
      + [[30, 52, 7], [96, 53, 8], [132, 51, 6]].map(([x, y, r]) => E(x, y, r, r * 0.34, '#c4966a', 'stroke="#8a6a48" stroke-width=".5"') + E(x, y - 0.4, r * 0.8, r * 0.24, '#7a5a3a') + L(x - r, y, x - r, y - 2.4, '#b88a5e', 0.6) + L(x + r, y, x + r, y - 2.4, '#b88a5e', 0.6)).join('')
      + [[16, 52, 3.2], [22, 54, 2.4], [44, 52, 3.6], [52, 50, 2.4], [58, 53, 3], [70, 51, 2.6], [80, 54, 3.4], [110, 52, 2.8], [118, 54, 3.4], [146, 53, 3]].map(([x, y, w]) => hut(x, y, w, '#e6c69a', '#a07a52')).join('')
      + hut(66, 54, 6, '#ead0a6', '#a07a52') + R(70.6, 44, 1.6, 6, '#c4a07a') + R(70, 43, 2.8, 1.2, '#b08a64') + P('M60 54 L72 54 L72 51 L60 51Z', '#dcbc90')
      + R(84, 44, 3, 9, '#c8a478') + R(83.4, 43, 4.2, 1.4, '#a8845a') + C(85.5, 41.6, 1.2, '#b8956a')
      + [[24, 51], [48, 50], [66, 49], [100, 50], [122, 51]].map(([x, y]) => C(x, y, 0.4, '#fff0c0', 'opacity=".8"')).join('')
      + `<g transform="translate(104 40) rotate(-6) scale(.5)">${P('M-8 0 L6 -2 L10 0 L6 2Z', '#c8ccd2')}${C(-8, 0, 1, '#ffb070')}</g>`
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

    // 3 · Beggar's Canyon (fleet): racing low between the winding canyon
    // walls, a T-16 skyhopper ahead, the Stone Needle rising in the middle.
    beggars: () => fill([[0, '#d8884a'], [0.6, '#f0b878'], [1, '#f8d8a8']]) + suns(130, 12, 0.8)
      + P('M0 20 L160 20 L160 30 L0 30Z', '#e8b07a', 'opacity=".5"')
      // the canyon in perspective: walls closing toward the vanishing point
      + P('M0 0 L0 90 L40 90 L62 50 L70 30 L76 22 L60 18 L40 10 L20 0Z', '#8a4a22') + P('M160 0 L160 90 L120 90 L98 50 L90 30 L84 22 L100 18 L120 10 L140 0Z', '#7a3e1c')
      + P('M40 90 L62 50 L70 30 L76 22 L84 22 L90 30 L98 50 L120 90Z', '#d89858')
      + [[14, 4, 40, 90], [26, 2, 52, 80], [34, 6, 58, 66], [44, 10, 64, 52]].map(([a, b, c, d]) => P(`M${a} ${b} Q${(a + c) / 2 - 6} ${(b + d) / 2} ${c} ${d}`, 'none', 'stroke="#5a2a10" stroke-width=".6" opacity=".7"')).join('')
      + [[146, 4, 120, 90], [134, 2, 108, 80], [126, 6, 102, 66], [116, 10, 96, 52]].map(([a, b, c, d]) => P(`M${a} ${b} Q${(a + c) / 2 + 6} ${(b + d) / 2} ${c} ${d}`, 'none', 'stroke="#4a220c" stroke-width=".6" opacity=".7"')).join('')
      + P('M0 0 L20 0 L40 10 L60 18 L76 22 L62 50 L40 90 L0 90Z', '#fff2d0', 'opacity=".08"')
      // the Stone Needle splitting the canyon
      + P('M78 40 L79 26 L80.6 18 L82 26 L83 40Z', '#6a3418') + P('M80.6 18 L82 26 L83 40 L81 40Z', '#000', 'opacity=".25"')
      + ripples(56, 86, '#a86a36', 6, 0.3)
      // a T-16 skyhopper banking through ahead, and its shadow on the canyon floor
      + `<g transform="translate(86 40) rotate(-14)">${P('M-6 0 L4 -1 L6 0 L4 1Z', '#e8e4dc')}${P('M-3 0 L-6 -4.6 L-4.6 -4.6 L0 0Z M-3 0 L-6 4.6 L-4.6 4.6 L0 0Z M-3 0 L-3 -5.4 L-2 -5.4 L0 0Z', '#d8d2c8')}${C(-6, 0, 0.7, '#ffb070')}</g>`
      + E(84, 60, 4, 1, '#000', 'opacity=".2"') + P('M20 30 L60 46', 'none', 'stroke="#fff2d0" stroke-width=".3" opacity=".4"'),

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
      // Jawas leading droids: an R2 unit and a protocol droid
      + jawa(52, 74, 1.1) + jawa(68, 75, 1) + jawa(98, 76, 1.1) + jawa(112, 77, 1)
      + `<g transform="translate(78 76)">${R(-2, -6, 4, 6, '#e8eef4', 'rx="1"')}${E(0, -6, 2, 1.6, '#c8ccd2')}${R(-0.6, -5, 1.2, 1.4, '#3a6ad8')}${C(0, -6.6, 0.5, '#1a1a20')}${L(-2.6, -4, -3, 0, '#c8ccd2', 0.9)}${L(2.6, -4, 3, 0, '#c8ccd2', 0.9)}</g>`
      + `<g transform="translate(88 77)">${R(-1.6, -11, 3.2, 5, '#e0b040', 'rx="1"')}${C(0, -12.4, 1.6, '#e8c050')}${C(-0.6, -12.6, 0.3, '#ffe080')}${C(0.6, -12.6, 0.3, '#ffe080')}${L(-1, -6, -1.4, 0, '#d0a038', 1)}${L(1, -6, 1.4, 0, '#d0a038', 1)}${L(-1.6, -10, -3, -6, '#d0a038', 0.8)}</g>`
      + P('M0 78 Q50 72 100 78 T160 76 L160 90 L0 90Z', '#c88a4e') + ripples(80, 88, '#a06a36', 3, 0.3) + E(80, 74, 50, 2, '#000', 'opacity=".1"'),

    // 5 · Chalmun's Cantina: the round bar in the middle with its dispensers,
    // arched alcove booths around the walls, the band on the bandstand,
    // patrons in the gloom under the hanging lamps.
    cantina: () => fill([[0, '#2a1a12'], [0.6, '#3e281a'], [1, '#1e140c']])
      // the curved walls and alcoves
      + P('M0 0 L160 0 L160 46 Q80 34 0 46Z', '#4a3020') + [12, 36, 124, 148].map((x) => P(`M${x - 9} 50 L${x - 9} 32 C${x - 9} 24 ${x + 9} 24 ${x + 9} 32 L${x + 9} 50Z`, '#1e120a', 'stroke="#6a4a30" stroke-width=".7"') + E(x, 44, 6, 2, '#5a3a24') + C(x, 30, 1.6, '#ffb060', 'opacity=".7"') + C(x, 30, 5, '#ffb060', 'opacity=".12"')).join('')
      + [12, 36, 124, 148].map((x) => C(x - 3, 40, 1.4, '#3a2a1e') + C(x + 3, 40, 1.4, '#4a3a2a') + E(x - 3, 43, 1.8, 2.4, '#2a1e14') + E(x + 3, 43, 1.8, 2.4, '#3a2a1e')).join('')
      // the bandstand and the Modal Nodes
      + P('M58 36 L102 36 L98 42 L62 42Z', '#5a3a24') + [66, 74, 82, 90, 96].map((x, k) => E(x, 31, 1.6, 4, '#6a5a4a') + E(x, 26, 2.4, 2.8, '#8a7a68') + C(x - 0.8, 25.6, 0.5, '#1a1008') + C(x + 0.8, 25.6, 0.5, '#1a1008') + L(x + 1.4, 30, x + 3, 33, k % 2 ? '#c8a050' : '#8a8a90', 0.7)).join('')
      + [[58, 20], [80, 18], [102, 20]].map(([x, y]) => L(x, 0, x, y - 3, '#2a1a10', 0.4) + C(x, y, 2, '#ffd08a') + C(x, y, 9, '#ffb060', 'opacity=".1"')).join('')
      // the round bar with its central dispenser column and stools
      + E(80, 66, 46, 12, '#5a3a24', 'stroke="#8a6040" stroke-width=".8"') + E(80, 63, 46, 11, '#6a4a2e') + E(80, 63, 34, 7, '#2a1a10')
      + R(74, 44, 12, 19, '#4a4a50', 'stroke="#7a7a80" stroke-width=".6"') + [48, 52, 56].map((y) => R(74.6, y, 10.8, 1, '#8a8a90')).join('') + E(80, 44, 6, 1.6, '#7a7a80')
      + [[66, 58], [94, 58], [80, 59]].map(([x, y]) => R(x - 1, y - 2.6, 2, 2.6, '#9ac8e8', 'opacity=".6"')).join('')
      + [[40, 74], [56, 78], [104, 78], [120, 74]].map(([x, y]) => R(x - 0.6, y, 1.2, 5, '#2a1a10') + E(x, y, 2.6, 0.9, '#7a5030')).join('')
      // patrons: silhouettes at the bar
      + [[44, 68, '#3a4a3a'], [60, 70, '#4a3a4a'], [100, 70, '#4a3a2a'], [116, 68, '#3a3a4a']].map(([x, y, c]) => E(x, y - 4, 3, 5, c) + C(x, y - 10, 2.4, c)).join('')
      + E(60, 59.4, 1.6, 0.9, '#c8a050') + P('M114 58 C112 54 116 52 118 55', 'none', 'stroke="#5a6a5a" stroke-width="1"')
      + R(0, 80, 160, 10, '#1a100a') + [0, 20, 40, 60, 80, 100, 120, 140].map((x) => L(x, 80, x + 10, 90, '#2a1a10', 0.5)).join(''),

    // 6 · Jabba's Gate: the palace in the dusk, its great domed tower and the
    // round iron gate with the eye droid on its stalk, Gamorrean guards, the
    // desert road and a speeder.
    jabbas_gate: () => fill([[0, '#6a3a3a'], [0.45, '#d06a3a'], [1, '#f2b06a']]) + suns(28, 30, 0.75)
      + dune(60, 6, '#c8844a', '#8a5028')
      // the palace: main domed tower, smaller turret, walls and slit windows
      + P('M60 62 L60 24 C60 14 100 14 100 24 L100 62Z', '#b8885a', 'stroke="#6a4a2a" stroke-width=".7"') + P('M80 16 C92 16 100 19 100 24 L100 62 L84 62Z', '#000', 'opacity=".15"')
      + E(80, 24, 20, 4, '#a07448') + E(80, 18, 14, 3, '#c8986a') + C(80, 15, 4, '#c8986a')
      + P('M102 62 L102 34 C102 28 120 28 120 34 L120 62Z', '#a87a4e', 'stroke="#6a4a2a" stroke-width=".6"') + E(111, 34, 9, 2, '#946a40')
      + P('M36 62 L36 40 L60 40 L60 62Z', '#a87a4e') + P('M120 62 L120 44 L140 44 L140 62Z', '#9a6e44')
      + [[66, 30], [76, 28], [88, 28], [94, 30], [108, 40], [114, 40], [42, 46], [128, 50]].map(([x, y]) => R(x, y, 1.4, 4, '#2a1a0c')).join('') + [[70, 40], [90, 38]].map(([x, y]) => C(x, y, 0.6, '#ffcf6a', 'opacity=".8"')).join('')
      // the round gate with its bars and the eye droid
      + C(80, 54, 9, '#3a2a1e', 'stroke="#6a5a4a" stroke-width="1"') + C(80, 54, 7, '#4a3a2c') + [-4, -2, 0, 2, 4].map((dx) => L(80 + dx, 47.4, 80 + dx, 60.6, '#2a1a10', 0.7)).join('') + L(73, 54, 87, 54, '#2a1a10', 0.7)
      + P('M86 46 Q92 44 92 50', 'none', 'stroke="#5a5a60" stroke-width=".8"') + C(92, 51, 1.6, '#6a6a70') + C(92, 51, 0.7, '#ff3a2a')
      + R(70, 62, 20, 4, '#9a6a40')
      // Gamorrean guards at the gate, with their axes
      + [[66, 66, 1], [94, 66, -1]].map(([x, y, f]) => `<g transform="translate(${x} ${y}) scale(${f} 1)">${E(0, -4, 3.4, 4.4, '#5a6a3a')}${C(0, -9.6, 2.6, '#6a7a44')}${E(-0.6, -9, 1.4, 1, '#8a9a5a')}${C(-1.6, -10.4, 0.4, '#1a1008')}${P('M-3 -2 L3 -2 L3 1 L-3 1Z', '#4a3420')}${L(3, -10, 3.4, 2, '#5a4030', 0.6)}${P('M3 -11 L6 -9 L3 -7Z', '#9a9aa0')}</g>`).join('')
      // the road and a speeder
      + P('M64 66 L96 66 L130 90 L30 90Z', '#d89a5e', 'opacity=".5"') + ripples(70, 88, '#a86a36', 4, 0.3)
      + `<g transform="translate(130 80)">${E(0, 3, 9, 1.4, '#000', 'opacity=".25"')}${P('M-9 0 L6 -2 L9 0 L6 1.6Z', '#6a5a4a')}${R(-4, -3, 6, 2, '#3a3a40', 'rx=".6"')}</g>`,

    // 7 · Dune Sea Pursuit (fleet): high over the Dune Sea, the Great Pit of
    // Carkoon below with the Sarlacc's beak and tentacles, Jabba's sail barge
    // and two skiffs hovering at its edge.
    dune_sea_orbit: () => fill([[0, '#c8783e'], [0.4, '#eab070'], [1, '#f6d8a4']]) + suns(26, 12, 0.8)
      + P('M0 30 Q40 26 80 30 T160 28 L160 90 L0 90Z', '#e0a868') + dune(46, 6, '#d89a5a', '#b07038') + dune(66, 8, '#cc8c4e', '#9a5c2c')
      + ripples(34, 44, '#b07a44', 3, 0.3) + ripples(70, 88, '#9a6232', 5, 0.3)
      // the Great Pit of Carkoon: a sand funnel with the Sarlacc's beak and tentacles
      + E(84, 74, 26, 7, '#a8683a') + E(84, 75, 20, 5.4, '#8a5028') + E(84, 76, 13, 3.6, '#6a3a1c') + E(84, 77, 7, 2, '#3a1a0c')
      + P('M80 77 L84 74.6 L88 77 L84 78.4Z', '#c8a07a') + [[-6, -1, -10, -4], [6, -1, 10, -5], [-3, 0, -6, -6], [3, 0, 5, -6]].map(([a, b, c, d]) => P(`M${84 + a} ${77 + b} Q${84 + (a + c) / 2} ${77 + d - 2} ${84 + c} ${77 + d}`, 'none', 'stroke="#7a4a2a" stroke-width=".9" stroke-linecap="round"')).join('')
      // Jabba's sail barge: the long hull, the sail and deck rails
      + `<g transform="translate(118 58)">${E(0, 8, 16, 1.6, '#000', 'opacity=".2"')}${P('M-16 0 L14 0 L18 -2 L16 3 L-14 3Z', '#9a7a52', 'stroke="#5a4028" stroke-width=".5"')}${R(-10, -4, 20, 4, '#8a6a46', 'stroke="#5a4028" stroke-width=".4"')}${[-8, -4, 0, 4, 8].map((x) => R(x, -3, 1.6, 1.4, '#2a1a0c')).join('')}${L(-2, -4, -2, -16, '#5a4028', 0.6)}${P('M-2 -16 L8 -6 L-2 -6Z', '#d8c4a0', 'opacity=".9"')}${L(-14, -0.4, 14, -0.4, '#c8a878', 0.4)}</g>`
      // two skiffs over the pit edge
      + [[70, 64], [96, 62]].map(([x, y]) => `<g transform="translate(${x} ${y})">${E(0, 5, 5, 0.8, '#000', 'opacity=".2"')}${P('M-5 0 L5 0 L6 -1 L5 1.4 L-5 1.4Z', '#8a7a62')}${L(-4, 0, -4, -2, '#5a4a3a', 0.3)}${L(4, 0, 4, -2, '#5a4a3a', 0.3)}${L(-4, -2, 4, -2, '#5a4a3a', 0.3)}${C(-1, -1.4, 0.7, '#3a2a1a')}${C(1.6, -1.4, 0.7, '#4a3a2a')}</g>`).join('')
      + haze('#f0d0a0', [[40, 24, 26, 3], [130, 22, 24, 3]]),

    // 8 · The Mandalorian's Bounty: Peli Motto's round docking bay in Mos
    // Eisley, the Razor Crest settled on its landing struts, pit droids at
    // work, the sky through the open roof.
    mando_bounty: () => fill([[0, '#e8b070'], [0.5, '#f4d09a'], [1, '#f8e0b4']]) + suns(120, 10, 0.7)
      // the round bay walls with their ribs and doorways
      + P('M0 26 Q80 10 160 26 L160 70 L0 70Z', '#c49668') + P('M0 26 Q80 10 160 26 L160 32 Q80 16 0 32Z', '#dcb284')
      + [8, 26, 46, 66, 94, 114, 134, 152].map((x) => L(x, 30 - Math.sin((x / 160) * Math.PI) * 14, x, 70, '#a07448', 0.8)).join('')
      + [[20, 48, 8, 18], [140, 48, 8, 18]].map(([x, y, w, h]) => P(`M${x - w / 2} ${y + h} L${x - w / 2} ${y + 4} C${x - w / 2} ${y} ${x + w / 2} ${y} ${x + w / 2} ${y + 4} L${x + w / 2} ${y + h}Z`, '#3a2414')).join('')
      + [[36, 40], [56, 34], [104, 34], [124, 40]].map(([x, y]) => R(x, y, 4, 3, '#4a3018', 'rx=".6"')).join('') + R(0, 62, 160, 2, '#a07448')
      // floor with its scorch circle
      + P('M0 70 L160 70 L160 90 L0 90Z', '#d8ae7a') + E(80, 80, 50, 8, '#b88a5a', 'opacity=".6"') + E(80, 80, 30, 4, '#8a6a4a', 'opacity=".4"')
      // the Razor Crest: long silver hull, the cockpit nose, twin engines, landing struts
      + `<g transform="translate(80 66)">${E(0, 12, 40, 2.4, '#000', 'opacity=".25"')}${[[-24, 10], [-6, 11], [18, 11], [30, 10]].map(([x, y]) => L(x, 4, x, y, '#4a4e56', 1)).join('')}${P('M-36 -2 L-30 -8 L22 -8 L36 -4 L38 2 L22 6 L-30 6Z', '#b8bcc4', 'stroke="#5a5e66" stroke-width=".7"')}${P('M-30 -8 L22 -8 L36 -4 L-34 -4Z', '#d8dce2')}${[-20, -8, 4, 16].map((x) => L(x, -8, x, 6, '#7a7e86', 0.4)).join('')}${R(-18, -2, 14, 4, '#9a9ea6', 'opacity=".6"')}${P('M-36 -2 L-44 0 L-36 3Z', '#9a9ea6')}${P('M22 -8 L30 -12 L38 -10 L36 -4Z', '#a8acb4', 'stroke="#5a5e66" stroke-width=".5"')}${P('M28 -10 L35 -10 L34 -6 L28 -7Z', '#3a4a5a')}${R(-40, -10, 12, 5, '#8a8e96', 'rx="2" stroke="#5a5e66" stroke-width=".5"')}${R(-40, 4, 12, 5, '#8a8e96', 'rx="2" stroke="#5a5e66" stroke-width=".5"')}${C(-40, -7.5, 1.6, '#4a4e56')}${C(-40, 6.5, 1.6, '#4a4e56')}${[[-10, -6], [8, 0], [-26, 2]].map(([x, y]) => R(x, y, 3, 1.4, '#7a6a5a', 'opacity=".6"')).join('')}</g>`
      // pit droids busy with a hose and a crate
      + [[34, 82], [128, 82], [118, 84]].map(([x, y]) => `<g transform="translate(${x} ${y})">${E(0, -6, 2.4, 1.6, '#c86a2a')}${C(0, -6, 0.8, '#1a1a1a')}${L(-1, -4.6, -1.6, 0, '#5a5a5a', 0.6)}${L(1, -4.6, 1.6, 0, '#5a5a5a', 0.6)}${L(0, -5, 2.6, -3, '#5a5a5a', 0.5)}</g>`).join('')
      + R(40, 80, 6, 4, '#7a5a3a', 'stroke="#4a3420" stroke-width=".4"') + P('M30 84 Q50 90 64 80', 'none', 'stroke="#3a3a40" stroke-width=".6"'),

    // 9 · Hunters' Den: a back-room hideout for bounty hunters: a blue
    // hologram of a bounty puck's target over the table, weapons on the
    // rack, a sabacc game, and the door open on the bright desert.
    hunters_den: () => fill([[0, '#1a120e'], [0.6, '#2a1c14'], [1, '#120c08']])
      + P('M0 0 L160 0 L160 52 L0 52Z', '#2e2018') + [0, 32, 64, 96, 128].map((x) => R(x, 0, 1.4, 52, '#3e2c20')).join('') + R(0, 50, 160, 2, '#4a3424')
      // the bright doorway with the desert beyond and a silhouette in it
      + P('M126 52 L126 18 C126 10 146 10 146 18 L146 52Z', '#f4c888') + P('M126 40 Q136 36 146 40 L146 52 L126 52Z', '#e0a868') + C(136, 22, 3, '#fff4d8', 'opacity=".9"')
      + E(136, 42, 2.6, 5, '#120c08') + C(136, 35, 2, '#120c08') + P('M133 36 L139 36 L140 38 L132 38Z', '#120c08') + P('M126 52 L146 52 L160 90 L110 90Z', '#f4c888', 'opacity=".12"')
      // the weapon rack and wanted notices
      + R(8, 14, 34, 22, '#3a2618', 'stroke="#5a4028" stroke-width=".6"') + [12, 20, 28, 36].map((x, k) => `<g transform="translate(${x} 16) rotate(${k % 2 ? 8 : -6})">${R(-1, 0, 2, 18, '#1a1a1e', 'rx=".6"')}${R(-1.6, 4, 3.2, 3, '#3a3a40')}</g>`).join('')
      + [[50, 14], [62, 18], [104, 14], [114, 20]].map(([x, y]) => R(x, y, 9, 12, '#c8b48a', 'opacity=".85"') + R(x + 1.6, y + 1.6, 5.8, 5, '#6a5a4a') + L(x + 1.4, y + 8.4, x + 7.6, y + 8.4, '#5a4a3a', 0.4) + L(x + 1.4, y + 10, x + 6, y + 10, '#5a4a3a', 0.4)).join('')
      // the table with the bounty puck projecting a blue hologram
      + E(76, 70, 28, 7, '#4a3020', 'stroke="#6a4a30" stroke-width=".7"') + E(76, 68.6, 28, 6.4, '#5a3a26') + R(74, 74, 4, 14, '#3a2414')
      + E(76, 67, 3, 1, '#3a3a40') + P('M73 67 L66 40 L86 40 L79 67Z', '#6ac8ff', 'opacity=".12"')
      + `<g opacity=".8">${E(76, 50, 4, 6, '#8ad8ff', 'opacity=".55"')}${C(76, 42, 3, '#8ad8ff', 'opacity=".6"')}${[38, 41, 44, 47, 50, 53, 56].map((y) => L(70, y, 82, y, '#bfeaff', 0.25)).join('')}</g>`
      // sabacc cards and credit chips, and two hunters leaning in
      + [[62, 68, -10], [66, 69, 6], [88, 68, 12], [92, 69, -4]].map(([x, y, a]) => R(x - 1.4, y - 1, 2.8, 2, '#d8c8a8', `transform="rotate(${a} ${x} ${y})"`)).join('') + [[84, 70], [86, 70.6], [70, 70.4]].map(([x, y]) => E(x, y, 1.2, 0.5, '#d8b040')).join('')
      + E(50, 66, 5, 8, '#3a4048') + C(50, 55, 3.4, '#5a6068') + R(47, 54.4, 6, 1.4, '#1a1a1e') + E(104, 66, 5, 8, '#4a3a2a') + C(104, 55, 3.2, '#6a4a3a') + E(104, 52.4, 5, 1.4, '#3a2a1a')
      + R(0, 80, 160, 10, '#0e0906') + P('M0 80 L160 80', 'none', 'stroke="#3a2818" stroke-width=".6"'),

    // 10 · Jabba's Palace: the throne room. Jabba on his dais with his hookah,
    // Salacious Crumb at his tail, Han in carbonite on the wall, the rancor
    // pit's trapdoor grate in the floor, stone arches and oil lamps.
    jabbas_palace: () => fill([[0, '#24160e'], [0.5, '#3a2416'], [1, '#1a100a']])
      // stone arches and pillars
      + [10, 42, 118, 150].map((x) => R(x - 4, 8, 8, 52, '#4a3020', 'stroke="#2a1a0e" stroke-width=".5"') + R(x - 5, 6, 10, 3, '#5a3a26')).join('')
      + [[26, 16], [134, 16]].map(([x, w]) => P(`M${x - w} 60 L${x - w} 24 C${x - w} 8 ${x + w} 8 ${x + w} 24 L${x + w} 60Z`, '#160c06', 'stroke="#5a3a26" stroke-width=".8"')).join('')
      + [10, 42, 118, 150].map((x) => R(x - 1, 24, 2, 4, '#2a180c') + C(x, 22.6, 1.6, '#ffc06a') + C(x, 22.6, 6, '#ffb04a', 'opacity=".14"')).join('')
      // Han Solo frozen in carbonite on the wall
      + R(58, 12, 12, 22, '#5a6470', 'rx="1" stroke="#2a3038" stroke-width=".6"') + R(59.4, 13.4, 9.2, 19.2, '#7a8694') + P('M61.6 19 C61.6 15.6 66.4 15.6 66.4 19 L66 22 L62 22Z', '#9aa6b4') + P('M60.4 24 L62 30 M67.6 24 L66 30 M62 22 L60 24 M66 22 L68 24', 'none', 'stroke="#9aa6b4" stroke-width=".9"') + R(60, 31, 8, 1.4, '#3a4048') + [['#ff4a4a', 61], ['#4ade80', 63], ['#ffcf3a', 65]].map(([c, x]) => C(x, 31.7, 0.3, c)).join('')
      // the dais and Jabba with his hookah and Salacious Crumb
      + P('M72 60 C72 46 128 46 128 60Z', '#4a2e1a', 'stroke="#2a1a0e" stroke-width=".6"') + R(70, 58, 60, 4, '#3a2414')
      + P('M84 56 C82 46 90 40 98 40 C108 40 116 46 120 56 C124 54 128 56 126 58 L84 58Z', '#6a7a3a', 'stroke="#3a4a1e" stroke-width=".6"') + E(98, 50, 8, 4, '#8a9a5a', 'opacity=".5"')
      + C(92, 40, 5.6, '#7a8a4a', 'stroke="#3a4a1e" stroke-width=".5"') + E(92, 43.4, 4, 1.4, '#5a6a2a') + C(89.6, 38.6, 1, '#ffb030') + C(94.4, 38.6, 1, '#ffb030') + C(89.6, 38.6, 0.4, '#1a1008') + C(94.4, 38.6, 0.4, '#1a1008')
      + P('M86 48 C84 50 84 52 86 53 M102 48 C104 50 104 52 102 53', 'none', 'stroke="#5a6a2a" stroke-width="1.2" stroke-linecap="round"')
      + R(76, 46, 3, 10, '#8a6a3a', 'rx="1"') + C(77.5, 45, 2.4, '#c89a4a') + P('M79 50 Q84 48 88 46', 'none', 'stroke="#5a4028" stroke-width=".6"')
      + `<g transform="translate(118 54)">${E(0, 0, 2, 1.6, '#c8a07a')}${C(0, -2.4, 1.6, '#d8b08a')}${E(-2, -3, 1.2, 0.8, '#d8b08a')}${E(2, -3, 1.2, 0.8, '#d8b08a')}${P('M-0.8 -1.8 L0.8 -1.8 L0 -1Z', '#2a1a0c')}</g>`
      // the rancor pit's trapdoor grate in the floor
      + R(0, 60, 160, 30, '#2e1c10') + [0, 20, 40, 60, 80, 100, 120, 140].map((x) => L(x, 60, x - 6, 90, '#24160c', 0.5)).join('')
      + E(80, 76, 26, 6, '#120a06', 'stroke="#6a4a30" stroke-width="1"') + [62, 70, 78, 86, 94].map((x) => L(x, 71, x + 1, 81, '#6a4a30', 0.8)).join('') + L(56, 76, 104, 76, '#6a4a30', 0.8),
  };
  const TATOOINE = ['mos_eisley', 'jundland', 'beggars', 'sandcrawler', 'cantina', 'jabbas_gate', 'dune_sea_orbit', 'mando_bounty', 'hunters_den', 'jabbas_palace'];
  root.StageArt24 = { scenes: S, svg, worlds: { tatooine: TATOOINE }, render: (id) => (S[id] ? svg(S[id]()) : '') };
})(typeof window !== 'undefined' ? window : globalThis);
