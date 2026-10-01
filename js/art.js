// Hand-drawn SVG cover art for every unit, boss, crate and currency.
// Each character is built from a recognizable silhouette (helmet, hair,
// ears, weapon) over a scene from their world. viewBox is 0 0 100 100.

(function (root) {
  // ---------- Primitives ----------
  const P = (d, fill, extra) => `<path d="${d}" fill="${fill}" ${extra || ''}/>`;
  const E = (cx, cy, rx, ry, fill, extra) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra || ''}/>`;
  const C = (cx, cy, r, fill, extra) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra || ''}/>`;
  const R = (x, y, w, h, fill, extra) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra || ''}/>`;
  const L = (x1, y1, x2, y2, stroke, w, extra) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" ${extra || ''}/>`;
  const shade = (d, o) => P(d, '#000', `opacity="${o || 0.2}"`);
  // Gradients get a fresh id per render so many cards can share a page.
  let gradSeq = 0;
  const stopsOf = (stops) => stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('');
  function LG(stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
    const id = 'ag' + (++gradSeq).toString(36);
    return [`url(#${id})`, `<defs><linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stopsOf(stops)}</linearGradient></defs>`];
  }
  function RG(stops, cx = 0.5, cy = 0.5, r = 0.5) {
    const id = 'ag' + (++gradSeq).toString(36);
    return [`url(#${id})`, `<defs><radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stopsOf(stops)}</radialGradient></defs>`];
  }

  function shoulders(fill, opts = {}) {
    const top = opts.top || 74;
    return P(`M4 100 C6 ${top + 9} 26 ${top} 50 ${top} C74 ${top} 94 ${top + 9} 96 100Z`, fill)
      + shade(`M4 100 C6 ${top + 9} 26 ${top} 50 ${top} L46 100Z`, 0.22);
  }
  function neck(skin) {
    return P('M43.5 55 L56.5 55 L57.5 76 L42.5 76Z', skin) + shade('M43 64 L57 64 L57.5 76 L42.5 76Z', 0.22);
  }
  function head(skin, o = {}) {
    const rx = o.rx || 12.5;
    const ry = o.ry || 15;
    const cy = o.cy || 44;
    return E(36.8, cy + 2, 2.2, 3.6, skin) + E(63.2, cy + 2, 2.2, 3.6, skin)
      + E(50, cy, rx, ry, skin)
      + shade(`M${50 - rx} ${cy} Q${50 - rx} ${cy + ry} 50 ${cy + ry} Q${44 - rx * 0.3} ${cy + ry * 0.7} ${50 - rx * 0.72} ${cy + 1}Z`, 0.16);
  }
  function eyes(o = {}) {
    const y = o.y || 45;
    const s = o.spread || 5.2;
    const iris = o.iris || '#3b2616';
    const w = o.white === false ? '' : E(50 - s, y, 2.2, 1.35, '#f4efe6') + E(50 + s, y, 2.2, 1.35, '#f4efe6');
    return w + C(50 - s + 0.3, y, 1.05, iris) + C(50 + s - 0.3, y, 1.05, iris)
      + C(50 - s + 0.6, y - 0.4, 0.35, '#fff') + C(50 + s, y - 0.4, 0.35, '#fff');
  }
  function brows(color, o = {}) {
    const y = o.y || 41.5;
    const s = o.spread || 5.2;
    const tilt = o.angry ? 1.4 : o.sad ? -1 : 0;
    return L(50 - s - 2.6, y - tilt * 0.3, 50 - s + 2.4, y + tilt, color, o.w || 1.3)
      + L(50 + s - 2.4, y + tilt, 50 + s + 2.6, y - tilt * 0.3, color, o.w || 1.3);
  }
  function nose(o = {}) {
    const y = o.y || 46;
    return `<path d="M50.5 ${y} L48.6 ${y + 5.6} Q50 ${y + 6.6} 51.8 ${y + 5.8}" stroke="#000" stroke-opacity=".28" stroke-width=".8" fill="none" stroke-linecap="round"/>`;
  }
  function mouth(kind, o = {}) {
    const y = o.y || 54.5;
    const c = o.color || '#7a3b2e';
    if (kind === 'smirk') return `<path d="M46 ${y} Q50 ${y + 1.2} 54.5 ${y - 1.2}" stroke="${c}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
    if (kind === 'smile') return `<path d="M45.5 ${y - 0.4} Q50 ${y + 2.4} 54.5 ${y - 0.4}" stroke="${c}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
    if (kind === 'frown') return `<path d="M46 ${y + 0.8} Q50 ${y - 1} 54 ${y + 0.8}" stroke="${c}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
    if (kind === 'snarl') return P(`M44.5 ${y - 1} Q50 ${y + 3.5} 55.5 ${y - 1} Q50 ${y + 1} 44.5 ${y - 1}Z`, '#2a0d0d') + R(46.5, y - 0.6, 7, 1, '#f3ead8');
    return L(46.5, y, 53.5, y, c, 1.1);
  }
  function saber(x1, y1, x2, y2, color, o = {}) {
    const hx = x1 + (x1 - x2) * 0.16;
    const hy = y1 + (y1 - y2) * 0.16;
    const hilt = o.noHilt ? '' : L(x1, y1, hx, hy, o.hilt || '#9aa1ab', 3.2) + L(x1 + (hx - x1) * 0.35, y1 + (hy - y1) * 0.35, x1 + (hx - x1) * 0.5, y1 + (hy - y1) * 0.5, '#2a2d33', 3.4);
    return `<g class="art-saber" style="filter:drop-shadow(0 0 1.6px ${color}) drop-shadow(0 0 3.5px ${color})">`
      + L(x1, y1, x2, y2, color, 4.6, 'opacity=".75"') + L(x1, y1, x2, y2, '#fff', 1.9) + '</g>' + hilt;
  }
  function blaster(x, y, rot, color) {
    return `<g transform="translate(${x} ${y}) rotate(${rot || 0})">`
      + R(-2, -2.5, 18, 5, color || '#23252b', 'rx="1.5"') + R(12, -1.4, 10, 2.8, color || '#23252b') + R(1, 2, 4.5, 9, color || '#23252b', 'rx="1.2" transform="rotate(12)"')
      + R(4, -5, 8, 2.6, '#3a3d45', 'rx="1"') + '</g>';
  }
  function glowEyes(x1, x2, y, color, r) {
    return `<g style="filter:drop-shadow(0 0 2px ${color})">${C(x1, y, r || 2.2, color)}${C(x2, y, r || 2.2, color)}</g>`;
  }
  function stars(seed, count, maxY) {
    let s = seed;
    const rnd = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    let out = '';
    for (let i = 0; i < count; i++) out += C((rnd() * 100).toFixed(1), (rnd() * (maxY || 100)).toFixed(1), (rnd() * 0.55 + 0.2).toFixed(2), '#fff', `opacity="${(rnd() * 0.6 + 0.35).toFixed(2)}"`);
    return out;
  }

  // ---------- Scenes ----------
  const SCENES = {
    desert: () => R(0, 0, 100, 100, '#e7a35a') + R(0, 0, 100, 45, '#f0c07a', 'opacity=".6"') + C(24, 22, 7, '#fff4d6') + C(38, 30, 4.5, '#ffe3a3')
      + P('M0 70 Q25 58 50 66 T100 62 V100 H0Z', '#c98545') + P('M0 82 Q30 72 60 80 T100 76 V100 H0Z', '#b06f36'),
    jakku: () => R(0, 0, 100, 100, '#e9b774') + C(78, 20, 9, '#fff1cf', 'opacity=".9"')
      + P('M58 64 L96 40 L100 44 L70 70Z', '#8d7d6c', 'opacity=".75"') + P('M64 60 L74 52 L78 58 L70 64Z', '#6d6053', 'opacity=".8"')
      + P('M0 72 Q30 62 60 70 T100 68 V100 H0Z', '#c98a4b'),
    space: (seed) => R(0, 0, 100, 100, '#070b16') + stars(seed || 7, 34) + C(82, 18, 10, '#355c8c', 'opacity=".7"') + P('M72 18 A10 10 0 0 0 92 18', 'none', 'stroke="#8fb6e6" stroke-width="1" opacity=".5"'),
    corridor: (tint) => R(0, 0, 100, 100, tint === 'white' ? '#cfd6de' : '#3a3f47')
      + [10, 30, 70, 90].map((x) => R(x - 5, 0, 10, 100, tint === 'white' ? '#e6ebf0' : '#4a5059')).join('')
      + R(0, 12, 100, 3, tint === 'white' ? '#b3bcc6' : '#222')
      + (tint === 'red' ? [18, 82].map((x) => R(x - 2, 20, 4, 30, '#ff3b3b', 'opacity=".8"')).join('') : ''),
    deathstar: () => R(0, 0, 100, 100, '#15171c') + [0, 20, 40, 60, 80].map((y) => R(0, y, 100, 1, '#2a2e36')).join('')
      + [12, 88].map((x) => R(x - 3, 8, 6, 60, '#2b0e0e') + R(x - 1.5, 10, 3, 56, '#ff2d2d', 'opacity=".7"')).join(''),
    lava: () => R(0, 0, 100, 100, '#2a0a06') + R(0, 0, 100, 50, '#5a1508', 'opacity=".8"')
      + P('M0 64 Q20 56 36 66 T70 60 T100 66 V100 H0Z', '#150605') + P('M8 100 Q16 80 12 68 Q22 82 20 100Z', '#ff6a1a', 'opacity=".9"')
      + P('M78 100 Q86 82 84 66 Q92 84 90 100Z', '#ff8c1a', 'opacity=".85"') + C(18, 20, 1, '#ffb14a') + C(70, 12, 0.8, '#ffb14a') + C(88, 30, 1.1, '#ff8c3a'),
    swamp: () => R(0, 0, 100, 100, '#1f2e22') + R(0, 58, 100, 42, '#2b3d2c') + E(50, 62, 60, 6, '#8fa88f', 'opacity=".18"')
      + P('M4 0 Q10 30 6 60 L12 60 Q16 30 14 0Z', '#141e16') + P('M84 0 Q92 26 86 62 L94 62 Q98 30 96 0Z', '#141e16')
      + L(20, 0, 22, 26, '#223226', 1.2) + L(76, 0, 74, 30, '#223226', 1.2),
    endor: () => R(0, 0, 100, 100, '#1d3a24') + R(0, 0, 100, 30, '#335c3a', 'opacity=".7"')
      + [8, 26, 74, 92].map((x, i) => R(x - 4 - i % 2, 0, 8 + (i % 2) * 2, 100, '#3a2a1b')).join('') + R(0, 84, 100, 16, '#243a1f'),
    city: () => R(0, 0, 100, 100, '#2a1f4a') + R(0, 40, 100, 30, '#6a3a6a', 'opacity=".5"') + C(80, 22, 6, '#ffb86b', 'opacity=".8"')
      + [[4, 50, 10], [16, 38, 8], [26, 56, 12], [70, 44, 9], [82, 30, 8], [92, 52, 8]].map(([x, h, w]) => R(x, 100 - h - 20, w, h + 20, '#141026')).join('')
      + [[7, 60], [19, 52], [74, 58], [85, 46]].map(([x, y]) => R(x, y, 2, 2, '#ffd27a', 'opacity=".8"')).join(''),
    cloud: () => R(0, 0, 100, 100, '#f2a45a') + E(20, 70, 34, 12, '#ffc98c', 'opacity=".8"') + E(82, 78, 30, 12, '#ffd6a3', 'opacity=".8"')
      + E(60, 30, 28, 8, '#ffcf96', 'opacity=".5"') + R(78, 30, 10, 50, '#d9d2c8', 'opacity=".55"') + E(83, 30, 9, 3, '#e8e2d8', 'opacity=".6"'),
    bridge: () => R(0, 0, 100, 100, '#262b33') + P('M6 8 H94 L86 58 H14Z', '#060a14') + stars(11, 18, 56).replace(/cy="(\d+)/g, (m, y) => `cy="${Math.min(55, Number(y) + 8)}`)
      + L(50, 8, 50, 58, '#262b33', 2) + L(30, 8, 32, 58, '#262b33', 1.5) + L(70, 8, 68, 58, '#262b33', 1.5) + R(0, 60, 100, 40, '#30363f'),
    throne: () => R(0, 0, 100, 100, '#0c0a10') + C(50, 38, 34, '#1a1622') + C(50, 38, 30, '#050409') + stars(23, 16, 70).replace(/<circle/g, '<circle opacity=".8"')
      + [0, 45, 90, 135].map((a) => `<line x1="50" y1="38" x2="${50 + Math.cos((a * Math.PI) / 180) * 30}" y2="${38 + Math.sin((a * Math.PI) / 180) * 30}" stroke="#1a1622" stroke-width="2"/><line x1="50" y1="38" x2="${50 - Math.cos((a * Math.PI) / 180) * 30}" y2="${38 - Math.sin((a * Math.PI) / 180) * 30}" stroke="#1a1622" stroke-width="2"/>`).join(''),
    temple: () => R(0, 0, 100, 100, '#6e4a2a') + R(0, 0, 100, 60, '#c8894a', 'opacity=".55"')
      + [8, 26, 74, 92].map((x) => R(x - 5, 0, 10, 100, '#8a5e36') + R(x - 5, 0, 2, 100, '#b27d4a', 'opacity=".6"')).join('') + R(0, 88, 100, 12, '#553820'),
    warm: () => R(0, 0, 100, 100, '#3b2a1e') + R(0, 0, 100, 100, '#ff9f4a', 'opacity=".18"') + C(76, 26, 16, '#ffb35a', 'opacity=".25"') + R(6, 10, 22, 14, '#1f160f', 'rx="2"') + R(8, 12, 18, 10, '#58d6ff', 'opacity=".35"'),
    scarif: () => R(0, 0, 100, 100, '#7fd0ec') + R(0, 62, 100, 12, '#2ba3b8') + R(0, 74, 100, 26, '#f2dfa6')
      + L(84, 74, 88, 30, '#7a5a3a', 2) + P('M88 30 Q76 26 70 34 M88 30 Q98 24 100 34 M88 30 Q86 20 80 18 M88 30 Q94 22 98 22', 'none', 'stroke="#2f8a3a" stroke-width="2.4" stroke-linecap="round"'),
    snowred: () => R(0, 0, 100, 100, '#2a0d12') + R(0, 0, 100, 60, '#6a1a22', 'opacity=".5"')
      + [10, 24, 78, 92].map((x) => P(`M${x} 30 L${x - 7} 70 H${x + 7}Z`, '#140709')).join('') + R(0, 74, 100, 26, '#e6d8dc') + R(0, 74, 100, 26, '#ff3b4b', 'opacity=".12"'),
    geonosis: () => R(0, 0, 100, 100, '#d9773a') + R(0, 0, 100, 40, '#f2a060', 'opacity=".6"')
      + P('M0 50 L10 20 L18 50Z', '#a8502a') + P('M80 54 L90 16 L100 54Z', '#a8502a') + P('M0 74 Q40 66 100 72 V100 H0Z', '#b25a2e'),
    generator: () => R(0, 0, 100, 100, '#1a0808') + R(0, 0, 100, 100, '#ff2a2a', 'opacity=".12"')
      + [14, 86].map((x) => R(x - 6, 0, 12, 100, '#2a1010') + R(x - 1, 0, 2, 100, '#ff4a4a', 'opacity=".5"')).join('') + R(0, 80, 100, 3, '#3a1414'),
    hangar: () => R(0, 0, 100, 100, '#2c3440') + R(0, 0, 100, 40, '#11161f') + stars(5, 10, 36) + R(0, 40, 100, 3, '#5b6b80') + [0, 25, 50, 75].map((x) => R(x, 43, 1, 57, '#3a4454')).join(''),
    medbay: () => R(0, 0, 100, 100, '#dfe6ec') + R(0, 0, 100, 12, '#c3ccd6') + R(0, 78, 100, 22, '#b8c2cc')
      + R(66, 14, 26, 70, '#9fb0bf', 'rx="12"') + R(69, 18, 20, 62, '#58d6ff', 'rx="9" opacity=".55"') + C(76, 40, 2, '#ffffff', 'opacity=".7"') + C(82, 56, 1.4, '#ffffff', 'opacity=".7"') + C(74, 64, 1.8, '#ffffff', 'opacity=".6"')
      + R(8, 20, 18, 12, '#9aa6b2', 'rx="2"') + R(10, 22, 14, 8, '#6fe0a8', 'opacity=".5"'),
    dathomir: () => R(0, 0, 100, 100, '#3a0a10') + R(0, 0, 100, 55, '#8a1a22', 'opacity=".55"') + C(74, 22, 12, '#ffb0a0', 'opacity=".35"')
      + P('M0 70 L12 40 L20 64 L30 30 L42 66 L54 44 L64 70 L78 36 L90 62 L100 48 V100 H0Z', '#1c0508') + E(50, 82, 70, 10, '#4ade80', 'opacity=".12"'),
    kamino: () => R(0, 0, 100, 100, '#3a4a5c') + R(0, 0, 100, 60, '#56687c', 'opacity=".7"') + E(24, 66, 20, 7, '#dfe6ec') + R(6, 66, 36, 6, '#c3ccd6') + L(24, 72, 24, 100, '#8a98a8', 3)
      + [8, 20, 32, 44, 56, 68, 80, 92].map((x, i) => L(x, i % 2 ? 4 : 10, x - 6, i % 2 ? 40 : 52, '#c8d6e6', 0.6, 'opacity=".5"')).join('') + R(0, 86, 100, 14, '#26323e'),
    imperial: () => R(0, 0, 100, 100, '#2a2e36') + [0, 88].map((x) => R(x, 0, 12, 100, '#3a3f48')).join('') + R(22, 0, 56, 70, '#8a1616') + R(24, 0, 52, 68, '#a81c1c')
      + `<g transform="translate(50 34)"><circle r="17" fill="none" stroke="#f2f2f2" stroke-width="3"/><circle r="7" fill="none" stroke="#f2f2f2" stroke-width="2.4"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M0 -8 L0 -16" stroke="#f2f2f2" stroke-width="3.4" transform="rotate(${i * 60})"/>`).join('')}</g>`
      + R(0, 70, 100, 30, '#1c1f25'),
    fortress: () => R(0, 0, 100, 100, '#060c16') + R(0, 0, 100, 100, '#1a3a5a', 'opacity=".35"')
      + [18, 42, 70].map((x, i) => P(`M${x} 0 L${x + 10} 0 L${x + 26 - i * 4} 100 L${x - 6} 100Z`, '#5ab4ff', 'opacity=".07"')).join('')
      + P('M36 100 L42 30 L50 18 L58 30 L64 100Z', '#0c1420') + R(47, 34, 6, 30, '#ff2a2a', 'opacity=".45"')
      + [10, 26, 74, 88].map((x, i) => C(x, 20 + i * 14, 1.2, '#9fd8ff', 'opacity=".5"')).join('') + R(0, 88, 100, 12, '#04070c'),
    mortis: () => R(0, 0, 100, 100, '#140a24') + P('M0 0 H50 V100 H0Z', '#1a3a6a', 'opacity=".45"') + P('M50 0 H100 V100 H50Z', '#5a1020', 'opacity=".45"')
      + C(22, 20, 10, '#bfe8ff', 'opacity=".35"') + C(78, 20, 10, '#ff6a5a', 'opacity=".3"')
      + P('M10 100 L16 46 L22 100Z', '#2a2040') + P('M84 100 L90 40 L96 100Z', '#2a2040') + P('M44 100 L50 30 L56 100Z', '#1e1834', 'opacity=".8"')
      + R(0, 88, 100, 12, '#0e0818'),
    pit: () => R(0, 0, 100, 100, '#2a1d14') + R(0, 0, 100, 100, '#ff9a3a', 'opacity=".08"')
      + P('M0 100 L0 20 Q20 30 30 10 L34 100Z', '#1c130d') + P('M100 100 L100 26 Q84 18 70 34 L66 100Z', '#1c130d')
      + E(20, 94, 6, 2, '#e8dcc4', 'opacity=".7"') + E(78, 92, 5, 1.6, '#e8dcc4', 'opacity=".7"'),
  };

  // ---------- Characters ----------
  const CHAR = {};

  CHAR.rebel_soldier = () => SCENES.corridor('white')
    + shoulders('#6f84a6') + P('M4 100 C6 84 20 76 36 75 L42 100Z', '#2a2c30') + P('M96 100 C94 84 80 76 64 75 L58 100Z', '#2a2c30')
    + neck('#d8a47f') + head('#d8a47f') + eyes() + brows('#4a3422') + nose() + mouth()
    + P('M35.5 42 C35.5 27 42 23.5 50 23.5 C58 23.5 64.5 27 64.5 42Z', '#ece8de') + E(50, 42, 17.5, 3, '#d7d1c3') + R(36, 36, 28, 3, '#c9c2b2')
    + blaster(18, 90, -28, '#1e2024');

  CHAR.clone_trooper = () => SCENES.city()
    + shoulders('#f2f2f2') + R(44, 80, 12, 20, '#d9dde2') + P('M8 88 L22 78 L26 84 L12 94Z', '#3d6fd6') + P('M92 88 L78 78 L74 84 L88 94Z', '#3d6fd6')
    + P('M33.5 44 C33.5 27 41 21 50 21 C59 21 66.5 27 66.5 44 L66.5 58 C62 65 38 65 33.5 58Z', '#f3f3f3') + shade('M33.5 44 C33.5 27 41 21 50 21 L50 64 C42 64 36 62 33.5 58Z', 0.1)
    + R(47.5, 21, 5, 16, '#3d6fd6') + P('M38.5 39 L61.5 39 L61.5 44 L54 44 L54 56 L46 56 L46 44 L38.5 44Z', '#101114')
    + L(40, 57, 40, 61, '#9aa3ad', 1) + L(60, 57, 60, 61, '#9aa3ad', 1) + R(46, 58, 8, 3, '#b8bfc7', 'rx="1"');

  CHAR.ewok_warrior = () => SCENES.endor()
    + L(20, 100, 26, 26, '#6b4a2a', 2.5) + P('M26 26 L22.5 18 L29 18Z', '#8c8f94')
    + shoulders('#7b5433', { top: 76 }) + E(50, 50, 17, 16, '#7b5433')
    + P('M32 50 C30 32 40 25 50 25 C60 25 70 32 68 50 C64 40 58 36 50 36 C42 36 36 40 32 50Z', '#b8672e') + C(35, 30, 4, '#b8672e') + C(65, 30, 4, '#b8672e')
    + E(50, 57, 8.5, 6.5, '#a57a50') + C(43, 48, 2.8, '#0c0806') + C(57, 48, 2.8, '#0c0806') + C(44, 47, 0.8, '#fff') + C(58, 47, 0.8, '#fff')
    + P('M47.5 53.5 L52.5 53.5 L50 56.5Z', '#1a0f08') + L(35, 36, 65, 36, '#8a4a20', 1);

  CHAR.han_solo = () => SCENES.space(3)
    + shoulders('#ece6d8') + P('M4 100 C6 84 22 76 38 75 L44 100Z', '#1d1d22') + P('M96 100 C94 84 78 76 62 75 L56 100Z', '#1d1d22')
    + `<path d="M44 75 L50 86 L56 75" stroke="#b8b0a0" stroke-width="1" fill="none"/>`
    + neck('#e2b48f') + head('#e2b48f') + eyes() + brows('#4a2f1c') + nose() + mouth('smirk')
    + P('M36.5 43 C35 29 42 26 51 26.5 C60 27 66 31 63.5 42 C62 36 57 33 50 33.5 C44 34 40 37 38 44Z', '#5a3a22') + P('M44 27 C52 25 60 28 62 34 C56 30 50 30 44 31Z', '#6e4a2c')
    + blaster(64, 92, -32, '#1c1d21');

  CHAR.chewbacca = () => SCENES.space(9)
    + shoulders('#7a5230', { top: 72 }) + P('M4 100 C8 88 16 80 28 76 L24 100Z', '#6a4526')
    + P('M34 50 C32 30 40 21 50 21 C60 21 68 30 66 50 C66 64 58 71 50 71 C42 71 34 64 34 50Z', '#7a5230')
    + [[38, 30, 36, 40], [62, 30, 64, 40], [44, 24, 43, 32], [56, 24, 57, 32], [36, 54, 38, 64], [64, 54, 62, 64]].map(([a, b, c, d]) => L(a, b, c, d, '#553619', 1.2)).join('')
    + E(50, 52, 11, 12, '#8e6540') + eyes({ y: 45, iris: '#2c5a8a', spread: 5 }) + P('M46.5 50 L53.5 50 L50 54Z', '#141010') + P('M44.5 58 Q50 62 55.5 58 Q50 60 44.5 58Z', '#2a1810')
    + P('M18 80 L28 75 L82 100 L68 100Z', '#4a3525') + [0, 1, 2, 3, 4].map((i) => R(30 + i * 10, 81 + i * 4.2, 4.5, 3.6, '#b9bec6', `transform="rotate(24 ${32 + i * 10} ${83 + i * 4.2})"`)).join('');

  CHAR.leia = () => SCENES.corridor('white')
    + shoulders('#f4f3ef') + P('M34 76 C38 70 62 70 66 76 L60 80 C54 77 46 77 40 80Z', '#e3e1da')
    + neck('#f0c9a8') + head('#f0c9a8') + eyes() + brows('#3a2416', { w: 1.1 }) + nose() + mouth('smile', { color: '#b0524a' })
    + P('M37 43 C36 29 44 26.5 50 26.5 C57 26.5 64 29 63 43 C60 35 55 33 50 33 C44 33 40 36 37 43Z', '#4a2e1c')
    + C(30.5, 46, 7.6, '#4a2e1c') + C(69.5, 46, 7.6, '#4a2e1c')
    + `<path d="M30.5 41 A5 5 0 1 1 26 47 A3 3 0 1 1 31 46" stroke="#2e1c10" stroke-width="1" fill="none"/><path d="M69.5 41 A5 5 0 1 0 74 47 A3 3 0 1 0 69 46" stroke="#2e1c10" stroke-width="1" fill="none"/>`
    + blaster(14, 92, -24, '#2a2c31');

  CHAR.r2d2 = () => SCENES.hangar()
    + R(22, 60, 10, 40, '#e8ecf2', 'rx="3"') + R(68, 60, 10, 40, '#e8ecf2', 'rx="3"') + R(24, 66, 6, 20, '#2f5fb0', 'rx="1.5"') + R(70, 66, 6, 20, '#2f5fb0', 'rx="1.5"')
    + R(33, 50, 34, 50, '#eef1f5', 'rx="3"') + shade('M33 50 H42 V100 H33Z', 0.12)
    + R(38, 58, 10, 5, '#2f5fb0') + R(52, 58, 10, 5, '#2f5fb0') + R(40, 67, 20, 12, '#2f5fb0', 'rx="1.5"') + R(43, 70, 14, 2, '#c4cbd6') + R(43, 74, 14, 2, '#c4cbd6') + R(38, 84, 24, 4, '#2f5fb0')
    + P('M33 51 A17 17 0 0 1 67 51Z', '#c9d0da') + shade('M33 51 A17 17 0 0 1 44 35.5 L44 51Z', 0.1) + R(39, 44, 6, 5, '#2f5fb0') + R(55, 44, 5, 5, '#2f5fb0') + R(47, 38, 6, 4, '#2f5fb0')
    + C(50, 46.5, 3.2, '#0c0f16') + C(50, 46.5, 1.1, '#ff3b3b') + C(57.5, 40, 1.2, '#3b8bff') + R(33, 50, 34, 2, '#9aa3b0');

  CHAR.obi_wan = () => SCENES.lava()
    + shoulders('#6b4a2e') + P('M36 75 L50 97 L64 75 C58 73 42 73 36 75Z', '#d8c9a8') + P('M36 75 L50 97 L46 100 L30 78Z', '#c7b791') + P('M64 75 L50 97 L54 100 L70 78Z', '#c7b791')
    + neck('#e6bb98') + head('#e6bb98') + eyes({ iris: '#3a6aa0' }) + brows('#7a4a28') + nose()
    + P('M37.5 49 Q39 62.5 50 63.5 Q61 62.5 62.5 49 Q58 57 50 57.5 Q42 57 37.5 49Z', '#9a5c34') + P('M45 54 Q50 52.5 55 54 Q50 55.5 45 54Z', '#8a4e2a')
    + P('M37 42 C36 30 43 27 50 27 C58 27 64 30 63 42 C61 35 56 34 51 35 C47 33 41 36 37 42Z', '#a0643a')
    + saber(76, 96, 90, 22, '#3d8bff');

  CHAR.luke = () => SCENES.desert()
    + shoulders('#1b1b1f') + R(42, 73, 16, 6, '#131316', 'rx="2"')
    + neck('#eac19c') + head('#eac19c') + eyes({ iris: '#3a74b8' }) + brows('#b48a3a') + nose() + mouth()
    + P('M36.5 43 C35 29 42 25.5 51 26 C60 26.5 66 31 63.5 43 C62 36 58 32.5 52 33.5 C47 31 41 35 38.5 44Z', '#d9b25a') + P('M40 30 C44 26 50 25 54 27 L46 31Z', '#e8c877')
    + saber(74, 96, 92, 20, '#46e070');

  CHAR.yoda = () => SCENES.swamp()
    + shoulders('#bfae8a', { top: 78 }) + P('M38 78 L50 92 L62 78Z', '#a8977a')
    + P('M37 50 L7 39 Q11 49 37 58Z', '#8db25a') + P('M63 50 L93 39 Q89 49 63 58Z', '#8db25a') + P('M34 51 L14 43 Q18 49 35 55Z', '#b37a74', 'opacity=".45"') + P('M66 51 L86 43 Q82 49 65 55Z', '#b37a74', 'opacity=".45"')
    + E(50, 53, 15.5, 13.5, '#8db25a') + shade('M34.5 53 Q35 66 50 66.5 Q40 62 38 52Z', 0.15)
    + E(43.5, 51, 3.4, 2.5, '#e8e0c0') + E(56.5, 51, 3.4, 2.5, '#e8e0c0') + C(43.8, 51, 1.6, '#4a3a1a') + C(56.2, 51, 1.6, '#4a3a1a') + C(44.4, 50.4, 0.5, '#fff') + C(56.8, 50.4, 0.5, '#fff')
    + `<path d="M39 47.5 Q43.5 45.5 47 47.8 M53 47.8 Q56.5 45.5 61 47.5 M41 43 Q50 40.5 59 43 M43 40 Q50 38.4 57 40" stroke="#6d8f40" stroke-width=".9" fill="none"/>`
    + `<path d="M49 53 Q50 56.5 51.5 53.5" stroke="#6d8f40" stroke-width=".9" fill="none"/><path d="M44 60 Q50 62.5 56 60" stroke="#4a6630" stroke-width="1" fill="none"/>`
    + `<path d="M40 42 Q34 36 30 38 M42 41 Q38 34 35 33 M60 42 Q66 36 70 38 M58 41 Q62 34 66 33" stroke="#eeeeee" stroke-width=".7" fill="none" opacity=".85"/>`
    + saber(70, 94, 82, 60, '#46e070', { hilt: '#8a8f96' });

  CHAR.rey = () => SCENES.jakku()
    + L(8, 100, 34, 18, '#7a7f86', 2.6) + L(8, 100, 34, 18, '#3a3d42', 0.8)
    + shoulders('#d9c7a3') + P('M18 82 L28 76 L64 100 L52 100Z', '#9a8360') + P('M60 76 L78 78 L70 100 L58 100Z', '#c7b28a', 'opacity=".7"')
    + neck('#e8bf9a') + head('#e8bf9a') + eyes({ iris: '#5a3c1e' }) + brows('#4a2e1a') + nose() + mouth()
    + P('M37 44 C36 30 43 26.5 50 26.5 C57 26.5 64 30 63 44 C61 36 56 33 50 33.5 C44 33 40 36 37 44Z', '#5a3a22')
    + C(50, 23, 4, '#5a3a22') + C(50, 17.5, 3.3, '#5a3a22') + C(50, 13, 2.6, '#5a3a22')
    + saber(76, 96, 90, 26, '#3d8bff');

  CHAR.stormtrooper = () => SCENES.imperial()
    // Armor: white plates over the black body glove, E-11 held across the chest.
    + shoulders('#0c0d10') + P('M4 100 C6 86 16 78 30 76 L36 100Z', '#f6f7f8') + P('M96 100 C94 86 84 78 70 76 L64 100Z', '#f6f7f8')
    + C(22, 82, 7, '#ffffff') + C(78, 82, 7, '#ffffff') + P('M35 77 L65 77 L62 91 L38 91Z', '#f1f2f4') + L(50, 78, 50, 90, '#9aa1ab', 0.9) + L(38, 84, 62, 84, '#9aa1ab', 0.7)
    + `<g transform="translate(28 94) rotate(-16)">${R(0, -3, 46, 6, '#141518', 'rx="1.5"')}${R(8, -6, 14, 3, '#2a2c31')}${R(40, -1.6, 12, 3.2, '#141518')}${R(18, 3, 5, 8, '#141518', 'rx="1"')}</g>`
    // Helmet with a bold outline so it reads at any size.
    + `<g stroke="#0c0d10" stroke-width="1.4" stroke-linejoin="round">${P('M31.5 43 C30.5 24 39.5 16 50 16 C60.5 16 69.5 24 68.5 43 L72 60 C68 69 59 73 50 73 C41 73 32 69 28 60Z', '#ffffff')}</g>`
    + shade('M50 16 C60.5 16 69.5 24 68.5 43 L72 60 C68 69 59 73 50 73Z', 0.06)
    + P('M33 33 Q50 27 67 33 L67 37 Q50 31 33 37Z', '#9aa6b8') + L(50, 17, 50, 29, '#c8ced6', 1.6)
    // Big angled black lenses.
    + P('M34.5 39 Q41.5 36.5 48 39.5 L47 47 Q41 52.5 35 46Z', '#07080a') + P('M65.5 39 Q58.5 36.5 52 39.5 L53 47 Q59 52.5 65 46Z', '#07080a')
    + P('M37 40.5 Q41 39.3 44.5 40 L43.5 41.6 Q40.5 41.2 37.5 42Z', '#5a6474') + P('M63 40.5 Q59 39.3 55.5 40 L56.5 41.6 Q59.5 41.2 62.5 42Z', '#5a6474')
    + P('M47.8 40 L52.2 40 L53.4 54.5 L46.6 54.5Z', '#f4f5f6', 'stroke="#b8bec6" stroke-width=".6"')
    // Grey "tear" stripes and the famous frowning grill with its teeth.
    + P('M37 50 L39.5 50 L38.5 60 L36 60Z', '#5a6474') + P('M63 50 L60.5 50 L61.5 60 L64 60Z', '#5a6474')
    + P('M40.5 57 Q50 52 59.5 57 L58 64.5 Q50 61 42 64.5Z', '#1c1f24') + [43.5, 46.3, 49.1, 51.9, 54.7, 57.3].map((x) => L(x, 57.2, x, 62.2, '#c8ced6', 0.8)).join('')
    + R(37.4, 62, 3.2, 8, '#2a2d33', 'rx="1.4"') + R(59.4, 62, 3.2, 8, '#2a2d33', 'rx="1.4"') + P('M44 67 L56 67 L54 71 L46 71Z', '#e6e9ec')
    + C(30.6, 51, 3.6, '#f1f2f4', 'stroke="#0c0d10" stroke-width="1"') + C(30.6, 51, 1.8, '#5a6474') + C(69.4, 51, 3.6, '#f1f2f4', 'stroke="#0c0d10" stroke-width="1"') + C(69.4, 51, 1.8, '#5a6474');

  CHAR.battle_droid = () => SCENES.city()
    + P('M32 100 L36 80 L64 80 L68 100Z', '#cdb68a') + R(36, 82, 28, 6, '#b59e72') + R(44, 60, 3, 20, '#a8915f') + R(53, 60, 3, 20, '#a8915f')
    + P('M44.5 22 L55.5 22 L58 35 L54.5 62 L45.5 62 L42 35Z', '#d6bf92') + shade('M44.5 22 L50 22 L50 62 L45.5 62 L42 35Z', 0.12)
    + P('M42 26 C42 18 58 18 58 26 L58 34 H42Z', '#cfb88a') + C(45.2, 30.5, 2.3, '#3a2a14') + C(54.8, 30.5, 2.3, '#3a2a14') + C(45.2, 30.5, 0.9, '#6a5a3a') + C(54.8, 30.5, 0.9, '#6a5a3a')
    + L(50, 36, 50, 60, '#b09a6c', 0.8) + R(47, 50, 6, 2, '#a38c5c')
    + blaster(60, 92, -20, '#3a3226');

  CHAR.tusken_raider = () => SCENES.desert()
    + L(84, 100, 70, 22, '#7a5a3a', 3) + P('M70 22 L64 16 L74 18Z', '#8c8f94')
    + shoulders('#b89a6a') + P('M20 80 L30 76 L78 100 L64 100Z', '#6b5436')
    + P('M34 46 C33 28 41 22 50 22 C59 22 67 28 66 46 C66 62 58 68 50 68 C42 68 34 62 34 46Z', '#cbb38a')
    + `<path d="M35 36 Q50 30 65 36 M34 44 Q50 40 66 44 M36 56 Q50 60 64 56 M38 62 Q50 66 62 62" stroke="#a58f66" stroke-width="1" fill="none"/>`
    + C(43, 44, 5, '#6b6b6b') + C(57, 44, 5, '#6b6b6b') + C(43, 44, 3.3, '#1a1a1a') + C(57, 44, 3.3, '#1a1a1a') + C(42, 43, 0.9, '#8a8a8a') + C(56, 43, 0.9, '#8a8a8a')
    + R(47, 52, 6, 11, '#7a7a7a', 'rx="1.5"') + [54, 56.5, 59].map((y) => L(47, y, 53, y, '#4a4a4a', 0.7)).join('') + L(44, 58, 40, 64, '#7a7a7a', 1.6) + L(56, 58, 60, 64, '#7a7a7a', 1.6);

  CHAR.boba_fett = () => SCENES.cloud()
    + shoulders('#5c6b4a') + P('M4 100 C8 86 16 80 30 76 L28 100Z', '#7a2f2a', 'opacity=".9"') + R(40, 78, 20, 14, '#6f7d55', 'rx="2"') + R(43, 81, 4, 3, '#c43b2e') + R(49, 81, 4, 3, '#e0b83a')
    + P('M34 44 C34 27.5 41 21.5 50 21.5 C59 21.5 66 27.5 66 44 L66 61 L34 61Z', '#4f6b4a') + shade('M34 44 C34 27.5 41 21.5 50 21.5 L50 61 L34 61Z', 0.12)
    + P('M38 32 L62 32 L62 36 L38 36Z', '#8a2a24') + P('M37.5 38 L62.5 38 L62.5 43 L54 43 L54 56 L46 56 L46 43 L37.5 43Z', '#0e0f10')
    + P('M58 24 L62 27 L60 30Z', '#2f3f2c') + L(66, 40, 70, 18, '#3a3d42', 1.4) + R(68, 16, 4, 6, '#3a3d42') + R(35, 56, 30, 5, '#43583f');

  CHAR.tarkin = () => SCENES.bridge()
    + shoulders('#6f7a67') + P('M40 74 L60 74 L58 82 L42 82Z', '#5f6958') + R(22, 84, 12, 5, '#1a1a1a') + [0, 1, 2, 3].map((i) => R(22.5 + i * 3, 84.8, 2, 1.6, ['#c43b2e', '#3b6fd6', '#c43b2e', '#e0b83a'][i]) + R(22.5 + i * 3, 86.8, 2, 1.6, ['#3b6fd6', '#e0b83a', '#3b6fd6', '#c43b2e'][i])).join('')
    + neck('#dcb699') + head('#dcb699', { rx: 11.5, ry: 15.5 }) + shade('M39 46 Q41 54 45 57 L43 47Z', 0.2) + shade('M61 46 Q59 54 55 57 L57 47Z', 0.2)
    + eyes({ iris: '#6a7a8a', spread: 4.8 }) + brows('#8a8a8a', { spread: 4.8, angry: true }) + nose() + mouth('frown', { color: '#8a4a3e' })
    + P('M38.5 39 C38.5 30 44 27.5 50 27.5 C56 27.5 61.5 30 61.5 39 C58 33.5 42 33.5 38.5 39Z', '#a3a3a3');

  CHAR.darth_maul = () => SCENES.generator()
    + shoulders('#121212') + P('M38 74 L50 90 L62 74Z', '#1c1c1c')
    + neck('#b3261e') + head('#b3261e') + P('M40 40 L45 30 L50 38 L55 30 L60 40 L56 36 L50 44 L44 36Z', '#111')
    + P('M38 50 L44 52 L42 60Z', '#111') + P('M62 50 L56 52 L58 60Z', '#111') + P('M47 52 L53 52 L52 62 L48 62Z', '#111')
    + E(44.8, 45, 2.2, 1.4, '#ffd23f') + E(55.2, 45, 2.2, 1.4, '#ffd23f') + C(45, 45, 0.9, '#b30000') + C(55, 45, 0.9, '#b30000')
    + [38, 42, 46, 50, 54, 58, 62].map((x, i) => P(`M${x - 1.3} ${31 + Math.abs(i - 3) * 1.6} L${x} ${26 + Math.abs(i - 3) * 1.6} L${x + 1.3} ${31 + Math.abs(i - 3) * 1.6}Z`, '#e8d9b0')).join('')
    + saber(82, 60, 82, 12, '#ff2a2a', { noHilt: true }) + saber(82, 68, 82, 100, '#ff2a2a', { noHilt: true }) + L(82, 58, 82, 70, '#2a2a2e', 3.2);

  CHAR.kylo_ren = () => SCENES.snowred()
    + P('M22 100 L26 58 C30 34 40 26 50 26 C60 26 70 34 74 58 L78 100Z', '#141416') + shoulders('#18181b')
    + P('M34 44 C34 27.5 41 21.5 50 21.5 C59 21.5 66 27.5 66 44 L65 62 C60 67 40 67 35 62Z', '#1c1c20') + shade('M34 44 C34 27.5 41 21.5 50 21.5 L50 66 C44 66 38 65 35 62Z', 0.2)
    + `<path d="M38 40 L62 40 M50 40 L50 60 M38 40 L38 48 M62 40 L62 48 M44 60 L56 60" stroke="#b8bcc4" stroke-width="1.6" fill="none"/>`
    + `<g style="filter:drop-shadow(0 0 2px #ff2020) drop-shadow(0 0 4px #ff2020)"><path d="M80 96 L82 80 L80 70 L83 58 L81 46 L84 34 L82 22" stroke="#ff3030" stroke-width="4.4" fill="none" stroke-linejoin="round" opacity=".8"/><path d="M80 96 L82 80 L80 70 L83 58 L81 46 L84 34 L82 22" stroke="#fff" stroke-width="1.6" fill="none"/>`
    + L(74, 86, 88, 84, '#ff3030', 3, 'opacity=".85"') + '</g>' + L(79, 88, 80, 100, '#3a3d42', 3.2);

  CHAR.count_dooku = () => SCENES.geonosis()
    + shoulders('#2a1f1a') + P('M30 76 C34 72 66 72 70 76 L64 82 C56 78 44 78 36 82Z', '#3a2b22') + L(38, 80, 62, 80, '#c9ccd2', 1.2) + C(38, 80, 1.8, '#c9ccd2') + C(62, 80, 1.8, '#c9ccd2')
    + neck('#e0bca0') + head('#e0bca0') + eyes({ iris: '#3a2a1a' }) + brows('#d8d8d8', { angry: true }) + nose() + `<path d="M40 50 Q42 53 44 52 M60 50 Q58 53 56 52" stroke="#000" stroke-opacity=".2" stroke-width=".7" fill="none"/>`
    + P('M42.5 53 Q50 67 57.5 53 Q50 57.5 42.5 53Z', '#e6e6e6') + P('M37 42 C36 30 42 27.5 50 27.5 C58 27.5 64 30 63 42 C60 34 40 34 37 42Z', '#ececec')
    + `<path d="M76 96 Q74 92 77 88" stroke="#9aa1ab" stroke-width="3.2" fill="none" stroke-linecap="round"/>` + saber(77, 88, 90, 22, '#ff2a2a', { noHilt: true });

  CHAR.vader = () => SCENES.deathstar()
    + shoulders('#0e0e10') + P('M4 100 C8 84 20 76 34 74 L30 100Z', '#050506') + P('M96 100 C92 84 80 76 66 74 L70 100Z', '#050506')
    + R(41, 80, 18, 12, '#2a2c33', 'rx="1.5"') + R(43, 82, 3, 2, '#ff3b3b') + R(47, 82, 3, 2, '#3bff6a') + R(51, 82, 3, 2, '#3b8bff') + R(43, 86, 14, 1.5, '#8a9099')
    + P('M29.5 46 C29.5 24 40 15.5 50 15.5 C60 15.5 70.5 24 70.5 46 L77 67 L62 60.5 L60 69 L40 69 L38 60.5 L23 67Z', '#0e0e11')
    + P('M34 30 C38 20 46 17.5 50 17.5 L50 22 C44 22 38 25 35 32Z', '#3a3b44', 'opacity=".7"')
    + P('M37.5 37.5 L47 37.5 L46 45.5 L38.5 45.5Z', '#2a0c0c') + P('M62.5 37.5 L53 37.5 L54 45.5 L61.5 45.5Z', '#2a0c0c') + L(39.5, 39, 44, 39, '#8a3a3a', 0.7) + L(56, 39, 60.5, 39, '#8a3a3a', 0.7)
    + P('M46 47 L54 47 L57.5 61 L42.5 61Z', '#23252c') + [45.5, 48.5, 51.5, 54.5].map((x) => L(x, 51, x + (x - 50) * 0.18, 60, '#9aa1ab', 0.6)).join('')
    + P('M42.5 61 L57.5 61 L55 66 L45 66Z', '#16171b') + saber(76, 97, 91, 22, '#ff2a2a');

  CHAR.palpatine = () => SCENES.throne()
    + P('M18 100 L23 57 C25 29 38 17 50 17 C62 17 75 29 77 57 L82 100Z', '#16121a') + shade('M50 17 C38 17 25 29 23 57 L18 100 L40 100 L36 60Z', 0.25)
    + E(50, 54, 10.5, 13, '#c9bda9') + P('M38 44 C40 30 60 30 62 44 C58 38 42 38 38 44Z', '#16121a') + shade('M39.5 44 Q50 40 60.5 44 L60 50 Q50 46 40 50Z', 0.35)
    + E(45.5, 51, 1.9, 1.2, '#f5c542') + E(54.5, 51, 1.9, 1.2, '#f5c542') + C(45.6, 51, 0.6, '#b30000') + C(54.4, 51, 0.6, '#b30000')
    + `<path d="M42 55 Q44 58 43 61 M58 55 Q56 58 57 61 M45 63 Q50 65 55 63 M47 48 L46 50 M53 48 L54 50" stroke="#7a6a58" stroke-width=".7" fill="none"/>`
    + `<g style="filter:drop-shadow(0 0 2px #b58cff) drop-shadow(0 0 5px #7a4dff)"><path d="M30 86 L22 78 L26 74 L14 66 L18 62 L6 54" stroke="#e8dcff" stroke-width="1.4" fill="none"/><path d="M70 86 L78 78 L74 74 L86 66 L82 62 L94 54" stroke="#e8dcff" stroke-width="1.4" fill="none"/><path d="M26 74 L20 72 M82 62 L88 64" stroke="#e8dcff" stroke-width="1" fill="none"/></g>`
    + E(30, 88, 4, 3, '#c9bda9') + E(70, 88, 4, 3, '#c9bda9');

  CHAR.jawa = () => SCENES.desert()
    + P('M66 60 L96 52 L100 70 L70 74Z', '#7a6a58', 'opacity=".55"')
    + P('M24 100 L30 60 C32 36 40 20 50 18 C60 20 68 36 70 60 L76 100Z', '#6b4a2a') + shade('M50 18 C40 20 32 36 30 60 L24 100 L40 100 L38 56Z', 0.2)
    + E(50, 50, 11, 12.5, '#0a0706') + glowEyes(45.5, 54.5, 49, '#ffcf3a', 2.4)
    + P('M26 80 L34 76 L74 98 L66 100Z', '#3e2a18') + [0, 1, 2].map((i) => R(38 + i * 9, 82 + i * 5, 4, 3, '#8a8f94', `transform="rotate(28 ${40 + i * 9} ${83 + i * 5})"`)).join('');

  CHAR.grogu = () => SCENES.warm()
    + shoulders('#c9b48c', { top: 76 }) + P('M28 82 C30 72 44 70 50 70 C56 70 70 72 72 82 C64 78 36 78 28 82Z', '#e0cfa8') + [34, 42, 50, 58, 66].map((x) => L(x, 74, x - 1, 80, '#b39e76', 0.8)).join('')
    + P('M38 52 L4 42 C8 54 22 60 38 62Z', '#9cbf7a') + P('M62 52 L96 42 C92 54 78 60 62 62Z', '#9cbf7a') + P('M36 54 L12 46 C16 53 26 57 37 59Z', '#d49a8a', 'opacity=".5"') + P('M64 54 L88 46 C84 53 74 57 63 59Z', '#d49a8a', 'opacity=".5"')
    + E(50, 54, 14, 15, '#9cbf7a') + shade('M36 54 Q36 69 50 69 Q42 64 40 54Z', 0.12)
    + E(44, 53, 4.4, 4, '#140e08') + E(56, 53, 4.4, 4, '#140e08') + C(45.5, 51.5, 1.3, '#fff') + C(57.5, 51.5, 1.3, '#fff') + C(43, 54.5, 0.6, '#fff', 'opacity=".6"')
    + `<path d="M48.5 59.5 Q50 60.8 51.5 59.5" stroke="#6a8a4a" stroke-width=".9" fill="none"/><path d="M42 44 Q50 41 58 44" stroke="#8aad68" stroke-width=".8" fill="none"/>`
    + `<path d="M44 38 Q45 35 46 38 M50 36 Q51 33 52 36 M55 38 Q56 35 57 38" stroke="#e8e0d0" stroke-width=".5" fill="none"/>`;

  CHAR.death_trooper = () => SCENES.scarif()
    + shoulders('#1c1e22') + R(40, 78, 20, 22, '#0c0d0f') + R(42, 80, 16, 6, '#2a2d33', 'rx="1"') + C(22, 84, 2, '#4ade80', 'style="filter:drop-shadow(0 0 2px #4ade80)"')
    + P('M32.5 42 C32.5 26.5 41 20.5 50 20.5 C59 20.5 67.5 26.5 67.5 42 L68.5 57 C64 65 57.5 67 50 67 C42.5 67 36 65 31.5 57Z', '#1f2126')
    + shade('M32.5 42 C32.5 26.5 41 20.5 50 20.5 L50 67 C42.5 67 36 65 31.5 57Z', 0.25) + `<path d="M34 34 Q50 30 66 34" stroke="#3a3e46" stroke-width="1.2" fill="none"/>`
    + `<g style="filter:drop-shadow(0 0 1.5px #4ade80)">${P('M37.5 40.5 C37.5 36.5 46.5 36.5 46.5 40.5 L45.5 47.5 C42.5 49 39 47.5 37.5 40.5Z', '#1a3a26')}${P('M62.5 40.5 C62.5 36.5 53.5 36.5 53.5 40.5 L54.5 47.5 C57.5 49 61 47.5 62.5 40.5Z', '#1a3a26')}</g>`
    + L(39.5, 41, 44, 41, '#4ade80', 0.8) + L(56, 41, 60.5, 41, '#4ade80', 0.8)
    + P('M41.5 56.5 Q50 51 58.5 56.5 L56 61 Q50 57.5 44 61Z', '#0c0d0f') + [46, 48.7, 51.3, 54].map((x) => L(x, 56, x, 59, '#4a4e56', 0.6)).join('') + C(34.5, 52, 2.6, '#3a3e46') + C(65.5, 52, 2.6, '#3a3e46');

  CHAR.ahsoka = () => SCENES.temple()
    + shoulders('#5a5048') + P('M36 74 L50 86 L64 74Z', '#7a6a5a')
    + P('M36 46 C29 60 31 78 36 90 C40 78 40.5 62 40.5 50Z', '#f2f4f8') + P('M64 46 C71 60 69 78 64 90 C60 78 59.5 62 59.5 50Z', '#f2f4f8')
    + P('M34 62 Q37 64 40 62 L40 66 Q37 68 34 66Z', '#3a5fb8') + P('M66 62 Q63 64 60 62 L60 66 Q63 68 66 66Z', '#3a5fb8') + P('M33 76 Q36 78 38 76 L38 80 Q36 82 34 80Z', '#3a5fb8') + P('M67 76 Q64 78 62 76 L62 80 Q64 82 66 80Z', '#3a5fb8')
    + neck('#d9772f') + head('#d9772f')
    + P('M37 38 C33 26 35 15 40 9 C42.5 18 44.5 28 44.5 34Z', '#f2f4f8') + P('M63 38 C67 26 65 15 60 9 C57.5 18 55.5 28 55.5 34Z', '#f2f4f8')
    + P('M36 28 L43 26 L43.5 30 L36.5 32Z', '#3a5fb8') + P('M64 28 L57 26 L56.5 30 L63.5 32Z', '#3a5fb8') + P('M37.5 18 L41.5 16 L42 19.5 L38 21Z', '#3a5fb8') + P('M62.5 18 L58.5 16 L58 19.5 L62 21Z', '#3a5fb8')
    + P('M46 34 L50 29.5 L54 34 L50 39Z', '#f2f4f8') + P('M40.5 48 L44 49.5 L42.5 53Z', '#f2f4f8') + P('M59.5 48 L56 49.5 L57.5 53Z', '#f2f4f8') + P('M48 58 L52 58 L50 61Z', '#f2f4f8')
    + eyes({ iris: '#2a6ad0' }) + brows('#8a4a1e', { w: 0.9 }) + mouth('smirk', { color: '#6a2a14' })
    + saber(22, 96, 12, 56, '#eef4ff', { hilt: '#c9ccd2' }) + saber(78, 96, 90, 50, '#eef4ff', { hilt: '#c9ccd2' });

  CHAR.din_djarin = () => SCENES.desert()
    + L(12, 100, 30, 30, '#4a3a2a', 2.8) + L(12, 100, 30, 30, '#8a8f96', 1)
    + shoulders('#5a4632') + P('M60 74 C74 74 90 80 94 94 L72 96 C68 86 64 80 58 78Z', '#c3cad2') + shade('M62 76 C72 76 84 80 90 88 L74 90Z', 0.12)
    + P('M20 82 L30 77 L72 100 L60 100Z', '#3a2a1c')
    + P('M34 44 C34 27.5 41 21.5 50 21.5 C59 21.5 66 27.5 66 44 L66 62 L34 62Z', '#bcc4cc') + shade('M34 44 C34 27.5 41 21.5 50 21.5 L50 62 L34 62Z', 0.14)
    + P('M50 22 C58 22 64 27 65.5 36 L50 34Z', '#e2e7ec', 'opacity=".6"')
    + P('M38.5 38.5 L61.5 38.5 L61.5 42.5 L53 42.5 L53 58 L47 58 L47 42.5 L38.5 42.5Z', '#0e0f11') + L(40, 50, 44, 58, '#8a929a', 0.8) + L(60, 50, 56, 58, '#8a929a', 0.8);

  CHAR.grievous = () => SCENES.city()
    + saber(20, 88, 6, 30, '#3d8bff') + saber(80, 88, 94, 30, '#46e070') + saber(26, 94, 10, 60, '#46e070') + saber(74, 94, 92, 64, '#3d8bff')
    + shoulders('#6b7077') + P('M40 76 L60 76 L58 100 L42 100Z', '#4a4e54') + [80, 85, 90, 95].map((y) => L(42, y, 58, y, '#8a9098', 1)).join('')
    + P('M40 26 C40 18 60 18 60 26 L64 36 L58 30 L42 30 L36 36Z', '#d9d2bf')
    + P('M37 32 L63 32 L65 50 L58 66 L42 66 L35 50Z', '#e6e0cf') + shade('M37 32 L50 32 L50 66 L42 66 L35 50Z', 0.1)
    + P('M39 39 L48 42 L47 48 L40 46Z', '#1a1810') + P('M61 39 L52 42 L53 48 L60 46Z', '#1a1810') + glowEyes(43.5, 56.5, 44.2, '#ffd23f', 1.7)
    + P('M44 54 L56 54 L55 64 L45 64Z', '#3a3830') + [47, 50, 53].map((x) => L(x, 55, x, 63, '#6a6858', 0.7)).join('');

  CHAR.mace_windu = () => SCENES.temple()
    + shoulders('#4a3424') + P('M36 75 L50 96 L64 75 C58 73 42 73 36 75Z', '#c9b48c') + P('M36 75 L50 96 L46 100 L30 78Z', '#b39e76') + P('M64 75 L50 96 L54 100 L70 78Z', '#b39e76')
    + neck('#6b4430') + head('#6b4430', { ry: 15.5 }) + P('M38 36 C40 29 60 29 62 36 C56 31 44 31 38 36Z', '#8a5a40', 'opacity=".5"')
    + eyes({ iris: '#2a1a10' }) + brows('#2a1a10', { angry: true, w: 1.5 }) + nose() + mouth('frown', { color: '#3a1a10' })
    + saber(74, 96, 90, 20, '#a86bff');

  CHAR.thrawn = () => SCENES.bridge()
    + shoulders('#eeeeee') + P('M4 90 L22 78 L30 80 L14 94Z', '#e0b83a') + P('M96 90 L78 78 L70 80 L86 94Z', '#e0b83a') + P('M40 74 L60 74 L58 82 L42 82Z', '#dedede')
    + R(24, 86, 12, 5, '#1a1a1a') + [0, 1, 2, 3].map((i) => R(24.5 + i * 3, 86.8, 2, 1.6, ['#c43b2e', '#3b6fd6', '#e0b83a', '#3b6fd6'][i])).join('')
    + neck('#4a79b8') + head('#4a79b8') + shade('M40 46 Q42 54 45 57 L43 47Z', 0.2)
    + `<g style="filter:drop-shadow(0 0 1.8px #ff2020)">${E(44.8, 45, 2.2, 1.4, '#ff2a2a')}${E(55.2, 45, 2.2, 1.4, '#ff2a2a')}</g>`
    + brows('#0e1420', { angry: true }) + nose() + mouth('', { color: '#2a3a5a' })
    + P('M37 43 C36 29 43 26.5 50 26.5 C57 26.5 64 29 63 43 C61 34 55 32 50 32 C45 32 39 34 37 43Z', '#0f0f14');

  // ---------- Droids ----------
  CHAR.c3po = () => SCENES.desert()
    + shoulders('#d4a23a') + shade('M50 74 C74 74 94 83 96 100 L50 100Z', 0.08)
    + R(38, 86, 24, 14, '#6a5020') + [40, 44, 48, 52, 56].map((x, i) => L(x, 87, x + 2, 99, ['#c43b2e', '#3b6fd6', '#e0b040', '#c43b2e', '#3b6fd6'][i], 1)).join('')
    + P('M34 78 L66 78 L62 86 L38 86Z', '#e0b040') + L(50, 78, 50, 86, '#a8801e', 0.8)
    + R(44, 54, 12, 24, '#7a5c20') + [58, 62, 66, 70].map((y) => L(44, y, 56, y, '#a8801e', 0.8)).join('')
    + C(36.5, 44, 3.2, '#b8882a') + C(63.5, 44, 3.2, '#b8882a')
    + P('M37 42 C37 27 43 23 50 23 C57 23 63 27 63 42 L62 52 C60 58 56 61.5 50 61.5 C44 61.5 40 58 38 52Z', '#e3b544')
    + P('M50 23 C57 23 63 27 63 42 L62 52 C60 58 56 61.5 50 61.5Z', '#000', 'opacity=".08"') + P('M41 30 C44 25 50 24.5 50 24.5 L50 28 C46 28 43 30 42 33Z', '#fff2c4', 'opacity=".6"')
    + `<path d="M39 38 Q50 35 61 38" stroke="#a8801e" stroke-width="1" fill="none"/>`
    + `<g style="filter:drop-shadow(0 0 2px #ffcf4a)">${C(44.5, 43.5, 3.4, '#2a2008')}${C(55.5, 43.5, 3.4, '#2a2008')}${C(44.5, 43.5, 2.2, '#ffd96a')}${C(55.5, 43.5, 2.2, '#ffd96a')}</g>`
    + R(47, 54, 6, 1.6, '#3a2a08', 'rx=".8"') + L(50, 46, 50, 51, '#a8801e', 0.8);

  CHAR.bb8 = () => SCENES.jakku()
    + E(50, 97, 24, 3, '#000', 'opacity=".25"')
    + C(50, 70, 26, '#f2efe6') + shade('M50 44 A26 26 0 0 0 50 96 A18 26 0 0 1 50 44Z', 0.1)
    + C(50, 72, 11, 'none', 'stroke="#ff8a2a" stroke-width="3.2"') + C(50, 72, 5, '#b8bec6') + C(50, 72, 2, '#6d7582')
    + P('M26 60 A26 26 0 0 1 34 50 L38 56 A18 18 0 0 0 32 63Z', '#ff8a2a') + P('M74 60 A26 26 0 0 0 66 50 L62 56 A18 18 0 0 1 68 63Z', '#ff8a2a')
    + P('M30 84 A26 26 0 0 0 40 94 L42 88 A18 18 0 0 1 35 81Z', '#ff8a2a') + C(33, 57, 2.4, '#b8bec6') + C(67, 57, 2.4, '#b8bec6')
    + P('M36 45 A14 12 0 0 1 64 45 L62 48 L38 48Z', '#f2efe6') + R(37.5, 40.5, 25, 2.6, '#ff8a2a') + R(39, 46, 22, 2, '#b8bec6')
    + C(46, 38.5, 4.2, '#0e1016') + C(47.2, 37.3, 1.2, '#fff', 'opacity=".8"') + C(56.5, 40, 1.7, '#0e1016') + C(56.5, 40, 0.6, '#ff4a2a')
    + L(54, 34, 55, 24, '#b8bec6', 0.9) + L(57, 35, 59, 28, '#b8bec6', 0.7);

  CHAR.k2so = () => SCENES.scarif()
    + shoulders('#3a3d44', { top: 80 }) + R(40, 82, 20, 18, '#2c2f35', 'rx="2"') + P('M44 86 L56 86 L55 90 L45 90Z', '#50545c')
    + R(46.5, 50, 7, 30, '#2a2d33') + [54, 60, 66, 72].map((y) => L(46.5, y, 53.5, y, '#4a4e56', 0.8)).join('')
    + P('M37.5 34 C37.5 21 44 16.5 50 16.5 C56 16.5 62.5 21 62.5 34 L60.5 50 C57 55.5 43 55.5 39.5 50Z', '#44474f')
    + P('M50 16.5 C56 16.5 62.5 21 62.5 34 L60.5 50 C57 55.5 50 55.5 50 55.5Z', '#000', 'opacity=".15"') + P('M42 22 C45 18 50 17.5 50 17.5 L50 21 C46 21 44 23 43 26Z', '#8a8f98', 'opacity=".5"')
    + `<g style="filter:drop-shadow(0 0 2.2px #cfe0ff) drop-shadow(0 0 4px #9fc0ff)">${C(44, 36, 3.8, '#e8eeff')}${C(56, 36, 3.8, '#e8eeff')}</g>` + C(44, 36, 1.4, '#9fb8ff') + C(56, 36, 1.4, '#9fb8ff')
    + [45.5, 48.5, 51.5, 54.5].map((x) => L(x, 45, x, 50, '#2a2d33', 0.9)).join('') + L(40, 30, 60, 30, '#2a2d33', 0.8);

  CHAR.chopper = () => SCENES.hangar()
    + R(24, 64, 9, 36, '#9aa0a8', 'rx="3"') + R(67, 64, 9, 36, '#9aa0a8', 'rx="3"') + R(26, 70, 5, 16, '#e07b1a', 'rx="1"') + R(69, 70, 5, 16, '#e07b1a', 'rx="1"')
    + R(34, 56, 32, 44, '#a9afb7', 'rx="3"') + shade('M34 56 H42 V100 H34Z', 0.12)
    + R(38, 62, 10, 8, '#e07b1a') + R(52, 62, 10, 8, '#6d7582') + R(40, 74, 20, 10, '#e07b1a', 'rx="1.5"') + R(42, 77, 16, 1.6, '#3a3d42') + R(38, 88, 24, 4, '#6d7582')
    + P('M34 57 A16 15 0 0 1 66 57Z', '#b8bec6') + P('M36 54 A14 12 0 0 1 48 44 L50 54Z', '#e07b1a') + R(52, 46, 8, 5, '#e07b1a')
    + C(45, 51, 2.6, '#0e1016') + C(45, 51, 1, '#ff3b3b')
    + L(58, 44, 62, 30, '#8a8f96', 1.6) + R(59.5, 27, 6, 3.5, '#6d7582', 'rx="1"') + L(40, 44, 36, 36, '#8a8f96', 1.2)
    + L(66, 70, 80, 60, '#8a8f96', 1.6) + L(80, 60, 84, 64, '#8a8f96', 1.2) + L(34, 70, 22, 64, '#8a8f96', 1.6);

  CHAR.ig88 = () => SCENES.corridor('red')
    + L(12, 100, 30, 44, '#2a2c31', 3.2) + R(26, 40, 6, 10, '#2a2c31')
    + shoulders('#5e636c', { top: 78 }) + P('M20 84 L30 79 L78 100 L64 100Z', '#3a2a1c') + [0, 1, 2].map((i) => R(34 + i * 10, 85 + i * 4.5, 4, 3, '#8a8f96', `transform="rotate(26 ${36 + i * 10} ${86 + i * 4.5})"`)).join('')
    + R(46, 54, 3, 24, '#4a4e56') + R(51, 54, 3, 24, '#4a4e56')
    + R(42, 12, 16, 44, '#8a9098', 'rx="3"') + shade('M50 12 H58 V56 H50Z', 0.14) + E(50, 12, 8, 2.4, '#a3aab3')
    + [44, 47, 50, 53, 56].map((x) => `<g style="filter:drop-shadow(0 0 1.5px #ff3030)">${C(x, 22, 1.1, '#ff3a3a')}</g>`).join('')
    + [30, 38, 46].map((y) => L(43, y, 57, y, '#5d6674', 0.7)).join('') + L(50, 26, 50, 54, '#5d6674', 0.6);

  CHAR.ig11 = () => SCENES.desert()
    + shoulders('#6b5a48', { top: 78 }) + P('M24 86 L34 80 L76 100 L62 100Z', '#3a2a1c')
    + L(18, 98, 34, 60, '#26282d', 2.8) + L(82, 98, 66, 60, '#26282d', 2.8)
    + R(46, 54, 3, 24, '#4a4036') + R(51, 54, 3, 24, '#4a4036')
    + P('M42 22 C42 14 58 14 58 22 L58 56 L42 56Z', '#7a6856') + shade('M50 14 C54 14 58 16 58 22 L58 56 L50 56Z', 0.15)
    + R(41.5, 30, 17, 5, '#4a4036', 'rx="1"') + [44, 47, 50, 53, 56].map((x) => `<g style="filter:drop-shadow(0 0 1.5px #5ab4ff)">${C(x, 32.5, 1, '#8fd3ff')}</g>`).join('')
    + [42, 48].map((y) => L(43, y, 57, y, '#4a4036', 0.7)).join('');

  CHAR.droideka = () => SCENES.generator()
    + C(50, 58, 40, '#6ab8ff', 'opacity=".12"') + C(50, 58, 40, 'none', 'stroke="#8fd3ff" stroke-width="1.4" opacity=".7" style="filter:drop-shadow(0 0 3px #6ab8ff)"')
    + L(50, 60, 34, 98, '#6a4e2a', 2.6) + L(50, 60, 66, 98, '#6a4e2a', 2.6) + L(50, 60, 50, 98, '#5a4222', 2.2)
    + P('M50 44 C60 46 62 58 54 66 C48 70 44 64 48 58Z', '#8a6a3a') + P('M30 58 L46 52 L46 56 L30 62Z', '#7a5c30') + P('M70 58 L54 52 L54 56 L70 62Z', '#7a5c30')
    + R(22, 57, 9, 4, '#2a2d33', 'rx="1"') + R(69, 57, 9, 4, '#2a2d33', 'rx="1"') + R(18, 58, 5, 2, '#1a1c20') + R(77, 58, 5, 2, '#1a1c20')
    + P('M40 34 L60 34 L56 47 L44 47Z', '#9a7842') + shade('M50 34 L60 34 L56 47 L50 47Z', 0.15) + P('M42 36 L58 36 L57 39 L43 39Z', '#6a5028')
    + glowEyes(46, 54, 42, '#ff3030', 1.5);

  CHAR.b2_droid = () => SCENES.city()
    + P('M14 100 L20 66 C28 56 72 56 80 66 L86 100Z', '#6a7a90') + shade('M14 100 L20 66 C28 56 50 56 50 56 L50 100Z', 0.14)
    + P('M30 66 C38 62 62 62 70 66 L66 82 C58 86 42 86 34 82Z', '#7d8ca2') + L(50, 64, 50, 84, '#4a5566', 1) + L(34, 74, 66, 74, '#4a5566', 0.8)
    + R(8, 70, 14, 22, '#5a687c', 'rx="4"') + R(78, 70, 14, 22, '#5a687c', 'rx="4"') + R(10, 90, 10, 6, '#2a2d33', 'rx="1"') + R(80, 90, 10, 6, '#2a2d33', 'rx="1"')
    + P('M43 48 L57 48 L58 60 L42 60Z', '#7d8ca2') + R(44, 52, 12, 3, '#1a1c22') + C(47, 53.5, 0.9, '#ff5a3a') + C(53, 53.5, 0.9, '#ff5a3a');

  CHAR.magnaguard = () => SCENES.generator()
    + shoulders('#2a1f1a') + P('M4 100 C8 84 20 76 34 74 L32 100Z', '#1c1410') + P('M96 100 C92 84 80 76 66 74 L68 100Z', '#1c1410')
    + `<g class="art-saber" style="filter:drop-shadow(0 0 2px #a86bff) drop-shadow(0 0 4px #a86bff)">${L(14, 96, 24, 82, '#c8a0ff', 4, 'opacity=".8"')}${L(14, 96, 24, 82, '#fff', 1.6)}${L(76, 26, 86, 12, '#c8a0ff', 4, 'opacity=".8"')}${L(76, 26, 86, 12, '#fff', 1.6)}</g>` + L(24, 82, 76, 26, '#2a2c31', 2.6)
    + R(45, 54, 10, 22, '#2e3036')
    + P('M37 44 C37 28 43 23 50 23 C57 23 63 28 63 44 L61 56 C57 61 43 61 39 56Z', '#3a3b42') + shade('M50 23 C57 23 63 28 63 44 L61 56 C57 61 50 61 50 61Z', 0.18)
    + P('M36 32 C42 26 58 26 64 32 L64 38 C58 34 42 34 36 38Z', '#4a3624') + P('M60 34 L70 46 L64 48 L60 38Z', '#4a3624')
    + glowEyes(44.5, 55.5, 44, '#ff3030', 2) + R(46, 52, 8, 2, '#1a1a1e');

  // ---------- Medics ----------
  CHAR.rebel_medic = () => SCENES.endor()
    + shoulders('#dcd8c8') + P('M4 100 C6 86 18 78 32 76 L36 100Z', '#5a6a44') + R(18, 82, 9, 7, '#ffffff') + P('M20.5 85.5 H24.5 M22.5 83.5 V87.5', 'none', 'stroke="#c43b2e" stroke-width="1.6"')
    + R(60, 80, 22, 14, '#6a5436', 'rx="2"') + R(66, 84, 10, 6, '#ffffff', 'rx="1"') + P('M69 87 H73 M71 85 V89', 'none', 'stroke="#c43b2e" stroke-width="1.4"')
    + neck('#c89a74') + head('#c89a74') + eyes() + brows('#3a2416') + nose() + mouth('smile')
    + P('M35 40 C35 28 42 23.5 50 23.5 C58 23.5 65 28 65 40 C58 36 42 36 35 40Z', '#4a5a3a') + E(50, 40, 16, 2.6, '#3e4c30')
    + `<g transform="translate(78 64) rotate(24)">${R(-2.5, -10, 5, 18, '#d8dde3', 'rx="2"')}${R(-2, -6, 4, 9, '#58d6ff', 'opacity=".8"')}${L(0, 8, 0, 13, '#9aa1ab', 1.2)}</g>`;

  CHAR.two_onebee = () => SCENES.medbay()
    + P('M20 100 L26 70 C32 64 68 64 74 70 L80 100Z', '#3a3f48') + P('M34 70 L66 70 L62 96 L38 96Z', '#8fb8d0', 'opacity=".45"')
    + [74, 80, 86].map((y) => L(38, y, 62, y, '#58d6ff', 1, 'opacity=".8"')).join('') + L(44, 70, 44, 96, '#c43b2e', 1.2) + L(56, 70, 56, 96, '#3b6fd6', 1.2)
    + L(22, 76, 10, 60, '#5d6674', 2.4) + L(10, 60, 12, 50, '#9aa1ab', 1.4) + L(78, 76, 90, 60, '#5d6674', 2.4) + P('M90 60 L96 52 L92 50Z', '#c8ced6')
    + R(46, 52, 8, 14, '#4a4f58')
    + P('M37 40 C37 26 43 21 50 21 C57 21 63 26 63 40 L61 52 C57 56 43 56 39 52Z', '#5d636d') + shade('M50 21 C57 21 63 26 63 40 L61 52 C57 56 50 56 50 56Z', 0.18)
    + C(50, 38, 6, '#1a1c20') + `<g style="filter:drop-shadow(0 0 2px #ff5a3a)">${C(50, 38, 2.6, '#ff6a4a')}</g>` + R(44, 47, 12, 3, '#2a2d33', 'rx="1"') + L(40, 30, 60, 30, '#3a3f48', 0.8);

  CHAR.nightsister_acolyte = () => SCENES.dathomir()
    + P('M18 100 L24 58 C27 34 38 22 50 22 C62 22 73 34 76 58 L82 100Z', '#5a0e18') + shade('M50 22 C38 22 27 34 24 58 L18 100 L38 100 L36 56Z', 0.25)
    + neck('#e8e4e0') + head('#ece8e4', { cy: 46 }) + P('M40 36 C42 26 58 26 60 36 C56 31 44 31 40 36Z', '#5a0e18')
    + eyes({ y: 46, iris: '#6a2a2a' }) + mouth('', { y: 56, color: '#5a1a1a' })
    + `<path d="M50 34 L50 43 M44 38 L46 44 M56 38 L54 44 M42 52 L45 56 M58 52 L55 56" stroke="#8a1a22" stroke-width="1.4" fill="none"/>`
    + `<g style="filter:drop-shadow(0 0 3px #4ade80) drop-shadow(0 0 6px #4ade80)">${C(76, 80, 5, '#9affb8')}${C(76, 80, 2.4, '#e8fff0')}</g>` + E(76, 88, 6, 3, '#ece8e4');

  CHAR.talzin = () => SCENES.dathomir()
    + P('M14 100 L20 60 C24 40 36 32 50 32 C64 32 76 40 80 60 L86 100Z', '#3a0a10')
    + P('M28 30 L34 6 L40 24 L46 2 L50 18 L54 2 L60 24 L66 6 L72 30 C62 26 38 26 28 30Z', '#1a0406', 'stroke="#8a1a22" stroke-width="1"') + C(50, 20, 2.6, '#4ade80', 'style="filter:drop-shadow(0 0 3px #4ade80)"')
    + neck('#e6e0dc') + head('#ece6e2', { cy: 46 }) + eyes({ y: 46, iris: '#2a2a2a' }) + brows('#3a0a10', { y: 42, angry: true }) + mouth('smirk', { y: 56, color: '#3a0a10' })
    + `<path d="M40 38 L60 38 M44 50 L42 58 M56 50 L58 58" stroke="#1a0406" stroke-width="1.5" fill="none"/>`
    + `<g style="filter:drop-shadow(0 0 3px #4ade80) drop-shadow(0 0 7px #4ade80)">${C(22, 82, 5, '#9affb8')}${C(78, 82, 5, '#9affb8')}</g>`;

  CHAR.barriss = () => SCENES.temple()
    + shoulders('#1e2436') + P('M36 76 L50 92 L64 76Z', '#2a3450')
    + neck('#b8c46a') + head('#bcc86e') + eyes({ iris: '#2a4a8a' }) + brows('#2a2a1a', { w: 1 }) + nose() + mouth('', { color: '#5a3a4a' })
    + [41, 44.5, 48, 51.5, 55, 58.5].map((x) => P(`M${x} 47.6 L${x + 1.4} 46.2 L${x + 2.8} 47.6 L${x + 1.4} 49Z`, "#2a2a3a")).join('')
    + P('M34 46 C32 26 42 20 50 20 C58 20 68 26 66 46 C64 34 58 30 50 30 C42 30 36 34 34 46Z', '#161a28') + P('M34 46 L36 60 L38 48Z', '#161a28') + P('M66 46 L64 60 L62 48Z', '#161a28')
    + saber(74, 96, 90, 22, '#46e070');

  // ---------- Clone Force 99 (the Bad Batch) ----------
  const cloneBody = (armor, trim) => shoulders(armor) + P('M36 76 L64 76 L61 90 L39 90Z', trim) + L(50, 77, 50, 89, '#2a2d33', 0.8);
  const skull = (x, y, k, c) => `<g transform="translate(${x} ${y}) scale(${k})">${C(0, 0, 5, c)}${R(-3.2, 3, 6.4, 3, c)}${C(-1.8, -0.4, 1.4, '#1a1c20')}${C(1.8, -0.4, 1.4, '#1a1c20')}</g>`;

  CHAR.hunter = () => SCENES.kamino()
    + cloneBody('#3a3d44', '#4a4e56') + skull(26, 84, 1.1, '#e6e0cf')
    + neck('#b88a64') + head('#bc8e68') + eyes({ iris: '#4a3a2a' }) + brows('#2a1a10', { angry: true }) + nose() + mouth('', { color: '#6a3a2a' })
    + P('M38 44 C38 36 42 34 46 36 L47 44 L45 52 C41 54 38 50 38 44Z', '#f0ece2', 'opacity=".85"') + C(43, 43, 1.6, '#1a1c20') + L(40, 48, 44, 49, '#1a1c20', 0.8)
    + P('M36.5 38 C36 28 43 25 50 25 C57 25 64 28 63.5 38 Z', '#2a2a2e') + R(36.5, 34, 27, 4, '#1a1a1e') + P('M63 35 L72 40 L70 44 L62 38Z', '#1a1a1e')
    + `<g transform="translate(74 90) rotate(-40)">${R(-1.5, -14, 3, 16, '#c8ced6')}${R(-2.5, 2, 5, 7, '#2a2d33', 'rx="1"')}</g>`;

  CHAR.wrecker = () => SCENES.kamino()
    + P('M0 100 C2 78 22 68 50 68 C78 68 98 78 100 100Z', '#4a4e56') + shade('M0 100 C2 78 22 68 50 68 L46 100Z', 0.2) + skull(78, 80, 1.5, '#e6e0cf')
    + R(38, 72, 24, 18, '#5a5e66', 'rx="3"') + P('M42 52 L58 52 L60 70 L40 70Z', '#b08664')
    + head('#b48a66', { rx: 14, ry: 15.5 }) + P('M36 40 C36 30 42 27 50 27 C58 27 64 30 64 40 C58 36 42 36 36 40Z', '#9a7454')
    + E(44.5, 45, 2.4, 1.6, '#e8e4dc') + C(55.3, 45, 1.05, '#3a2616') + E(55.5, 45, 2.2, 1.35, '#f4efe6') + C(55.2, 45, 1, '#3a2616')
    + `<path d="M40 38 L46 56 M42 38 L47 52" stroke="#e6d6c4" stroke-width="1.4" fill="none"/>` + brows('#3a2616', { angry: true, w: 1.8 }) + mouth('snarl', { y: 56 })
    + `<g transform="translate(18 90)">${C(0, 0, 6, '#6a6f78')}${R(-2, -9, 4, 4, '#3a3d42')}${C(0, 0, 2, '#ff5a3a', 'style="filter:drop-shadow(0 0 2px #ff5a3a)"')}</g>`;

  CHAR.tech = () => SCENES.kamino()
    + cloneBody('#5a5e66', '#6a6f78') + R(60, 82, 18, 12, '#2a2d33', 'rx="1.5"') + R(62, 84, 14, 8, '#58d6ff', 'opacity=".6"')
    + neck('#bc8e68') + head('#bc8e68') + nose() + mouth('', { color: '#6a3a2a' })
    + P('M37 40 C36 29 43 25 50 25 C57 25 64 29 63 40 C60 33 55 32 50 32 C45 32 40 33 37 40Z', '#4a3222')
    + R(37, 41, 26, 8, '#2a2d33', 'rx="3"') + `<g style="filter:drop-shadow(0 0 2px #ffd23f)">${E(44, 45, 5, 3, '#e8c14a', 'opacity=".85"')}${E(56, 45, 5, 3, '#e8c14a', 'opacity=".85"')}</g>` + C(42.5, 44, 1, '#fff', 'opacity=".7"');

  CHAR.crosshair = () => SCENES.kamino()
    + L(10, 70, 60, 94, '#2a2d33', 3) + L(4, 67, 14, 72, '#2a2d33', 2) + R(26, 74, 12, 4, '#1a1c20', 'transform="rotate(26 32 76)"')
    + cloneBody('#6a7078', '#7a8088')
    + neck('#d8bc9c') + head('#dcc0a0') + eyes({ iris: '#4a5a6a' }) + brows('#e8e8e8', { angry: true }) + nose() + mouth('smirk', { color: '#6a4a3a' })
    + C(55.5, 45, 5, 'none', 'stroke="#2a2d33" stroke-width="1"') + L(55.5, 38.5, 55.5, 51.5, '#2a2d33', 0.8) + L(49, 45, 62, 45, '#2a2d33', 0.8)
    + P('M37 38 C37 29 43 26.5 50 26.5 C57 26.5 63 29 63 38 C58 33 42 33 37 38Z', '#e6e6e6') + L(53, 56, 61, 58, '#d9b070', 1);

  CHAR.echo = () => SCENES.kamino()
    + cloneBody('#4a6a8a', '#5a7a9a') + P('M72 80 L90 70 L94 76 L78 88Z', '#8a929e') + C(90, 72, 3, '#58d6ff', 'style="filter:drop-shadow(0 0 2px #58d6ff)"')
    + neck('#c8c0bc') + head('#ccc4c0') + eyes({ iris: '#4a5a6a' }) + brows('#8a8a8a', { w: 0.8 }) + nose() + mouth('', { color: '#6a5a5a' })
    + P('M37 38 C37 28 43 25 50 25 C57 25 63 28 63 38 L62 42 C58 34 42 34 38 42Z', '#8a929e') + R(46, 25, 8, 6, '#5d6674', 'rx="1"')
    + `<g style="filter:drop-shadow(0 0 1.5px #58d6ff)">${C(60, 34, 1.4, '#58d6ff')}${C(40, 34, 1.4, '#58d6ff')}</g>` + `<path d="M58 48 L62 48 L62 52" stroke="#8a929e" stroke-width="1" fill="none"/>`;

  // ---------- The Inquisitorius ----------
  // A spinning double-bladed saber ring, the Inquisitors' signature weapon.
  const inqSaber = (cx, cy, r, rot) => `<g transform="translate(${cx} ${cy}) rotate(${rot})" style="filter:drop-shadow(0 0 2px #ff2a2a) drop-shadow(0 0 5px #ff2a2a)">`
    + C(0, 0, r * 0.32, 'none', 'stroke="#8a8f98" stroke-width="2.4"') + L(-r, 0, -r * 0.34, 0, '#ff5a5a', 3.6, 'opacity=".8"') + L(-r, 0, -r * 0.34, 0, '#fff', 1.4)
    + L(r * 0.34, 0, r, 0, '#ff5a5a', 3.6, 'opacity=".8"') + L(r * 0.34, 0, r, 0, '#fff', 1.4) + '</g>';
  const inqArmor = () => shoulders('#16181c') + P('M34 76 L66 76 L62 86 L38 86Z', '#24272d') + R(44, 80, 12, 3, '#8a1a1a') + P('M4 100 C8 86 18 78 30 76 L28 100Z', '#0c0d10');

  // Premium Inquisitor kit: backlit red fortress, lacquered armor, ignited blades.
  const inqScene = () => {
    const [bg, bgd] = RG([[0, '#5a0c10', 0.9], [0.45, '#1a0608', 0.6], [1, '#000', 0]], 0.5, 0.42, 0.62);
    return SCENES.fortress() + bgd + R(0, 0, 100, 100, bg)
      + [20, 50, 80].map((x, i) => P(`M${x - 1} 0 L${x + 1} 0 L${x + 8 - i * 8} 100 L${x - 8 - i * 0} 100Z`, '#ff3a3a', 'opacity=".05"')).join('');
  };
  function blade(x1, y1, x2, y2) {
    return `<g style="filter:drop-shadow(0 0 2px #ff1a1a) drop-shadow(0 0 6px #ff1a1a)">${L(x1, y1, x2, y2, '#ff2a2a', 5, 'opacity=".55"')}${L(x1, y1, x2, y2, '#ff5a5a', 3)}${L(x1, y1, x2, y2, '#fff4f0', 1.2)}</g>`;
  }
  // Ignited double-bladed spinning saber: ring hilt with two blades.
  function inqBlade(cx, cy, len, rot) {
    const a = (rot * Math.PI) / 180;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    const h = len * 0.2;
    const [mg, mgd] = LG([[0, '#d8dde4'], [0.5, '#6a707a'], [1, '#2a2d33']]);
    return blade(cx + dx * h, cy + dy * h, cx + dx * len, cy + dy * len) + blade(cx - dx * h, cy - dy * h, cx - dx * len, cy - dy * len)
      + mgd + C(cx, cy, h, 'none', `stroke="${mg}" stroke-width="2.6"`) + C(cx, cy, h, 'none', 'stroke="#111" stroke-width=".5" opacity=".6"')
      + L(cx - dx * h, cy - dy * h, cx + dx * h, cy + dy * h, '#3a3d44', 2) + C(cx + dy * h * 0.9, cy - dx * h * 0.9, 0.9, '#ff3a3a');
  }
  function inqKit(o = {}) {
    const [ag, agd] = LG([[0, '#3a3e46'], [0.35, '#1a1c21'], [1, '#07080a']]);
    const [pg, pgd] = LG([[0, '#5a5f69'], [0.4, '#23262c'], [1, '#0c0d10']], 0, 0, 1, 1);
    const top = o.top || 74;
    return agd + pgd
      + P(`M2 100 C4 ${top + 8} 24 ${top} 50 ${top} C76 ${top} 96 ${top + 8} 98 100Z`, ag)
      // Pauldrons with a lacquer highlight.
      + P(`M4 100 C4 88 12 ${top + 3} 30 ${top + 1} L33 ${top + 12} C22 ${top + 13} 15 92 14 100Z`, pg) + P(`M70 ${top + 1} C88 ${top + 3} 96 88 96 100 L86 100 C85 92 78 ${top + 13} 67 ${top + 12}Z`, pg)
      + `<path d="M8 96 C9 88 16 ${top + 5} 29 ${top + 3} M92 96 C91 88 84 ${top + 5} 71 ${top + 3}" stroke="#9aa0aa" stroke-width=".7" fill="none" opacity=".7"/>`
      // Chest plate, red piping and the Imperial crest.
      + P(`M33 ${top + 1} L67 ${top + 1} L64 95 L50 100 L36 95Z`, '#15171b') + `<path d="M33 ${top + 1} L36 95 L50 100 L64 95 L67 ${top + 1}" stroke="#b01e1e" stroke-width="1" fill="none"/>`
      + C(50, 88, 5, '#1f2227', 'stroke="#8a909a" stroke-width="1"') + [0, 1, 2, 3, 4, 5].map((i) => { const a = (i * Math.PI) / 3; return L(50 + Math.cos(a) * 2, 88 + Math.sin(a) * 2, 50 + Math.cos(a) * 4.4, 88 + Math.sin(a) * 4.4, '#8a909a', 0.9); }).join('') + C(50, 88, 1.4, '#8a909a')
      + [40, 60].map((x) => R(x - 3, top + 5, 6, 1.4, '#b01e1e', 'rx=".7"')).join('')
      // High collar.
      + P(`M35 ${top - 12} L39 ${top + 2} L61 ${top + 2} L65 ${top - 12} L58 ${top - 5} L42 ${top - 5}Z`, '#0b0c0f') + L(39, top + 2, 61, top + 2, '#b01e1e', 0.8);
  }
  const rim = (d, o) => P(d, '#ff4a4a', `opacity="${o || 0.5}"`);

  CHAR.grand_inquisitor = () => {
    const [sk, skd] = LG([[0, '#dfe3e6'], [0.45, '#b4bbc1'], [1, '#7b838a']], 0, 0, 0.3, 1);
    const [sock, sockd] = RG([[0, '#7a1f22'], [0.6, '#3a1214'], [1, '#2a2226', 0]]);
    // Tall Pau'an cranium, ridged from brow to crown.
    const skull = 'M38 46 C35 30 38 12 50 7 C62 12 65 30 62 46 C61.5 56 57 63.5 50 64.5 C43 63.5 38.5 56 38 46Z';
    const ridges = [-9, -6, -3, 0, 3, 6, 9].map((dx) => {
      const top = 9 + Math.abs(dx) * 0.9;
      return `<path d="M${50 + dx * 0.55} ${top} C${50 + dx * 0.9} ${top + 10} ${50 + dx * 1.15} ${top + 18} ${50 + dx * 1.2} 36" stroke="#6c747b" stroke-width="${dx === 0 ? 1.2 : 1}" fill="none"/><path d="M${50 + dx * 0.55 + 0.7} ${top + 1} C${50 + dx * 0.9 + 0.7} ${top + 10} ${50 + dx * 1.15 + 0.7} ${top + 18} ${50 + dx * 1.2 + 0.7} 35" stroke="#f2f4f6" stroke-width=".5" fill="none" opacity=".75"/>`;
    }).join('');
    return inqScene() + inqKit() + inqBlade(80, 84, 26, -50) + skd + sockd
      + P('M44 58 L56 58 L57.5 72 L42.5 72Z', '#8a9197') + shade('M44 62 L56 62 L57.5 72 L42.5 72Z', 0.32)
      + P(skull, sk) + shade('M50 7 C62 12 65 30 62 46 C61.5 56 57 63.5 50 64.5 C55 54 58 34 50 7Z', 0.14)
      + `<g stroke-linecap="round">${ridges}</g>`
      // Heavy brow, deep red-rimmed sockets, gold eyes with red pupils.
      + P('M39.5 37 C43 34.5 47 35 49.5 37.5 L50.5 37.5 C53 35 57 34.5 60.5 37 L60 39 C57 37.5 53 37.6 50 39.5 C47 37.6 43 37.5 40 39Z', '#8a9298')
      + E(44.2, 41, 4.6, 3.4, sock) + E(55.8, 41, 4.6, 3.4, sock)
      + `<g style="filter:drop-shadow(0 0 1.4px #ffc000)">${E(44.2, 41.2, 2.5, 1.5, '#ffd84a')}${E(55.8, 41.2, 2.5, 1.5, '#ffd84a')}</g>` + C(44.2, 41.2, 0.95, '#b00000') + C(55.8, 41.2, 0.95, '#b00000') + C(43.6, 40.6, 0.4, '#fff') + C(55.2, 40.6, 0.4, '#fff')
      // Gaunt cheeks, slit nostrils, lipless grin full of needle teeth.
      + `<path d="M40.5 45 C41.5 50 43.5 53 46 54.5 M59.5 45 C58.5 50 56.5 53 54 54.5" stroke="#6c747b" stroke-width=".9" fill="none"/>`
      + shade('M40 45 C41 51 43.5 54 46.5 55 L45 47Z', 0.22) + shade('M60 45 C59 51 56.5 54 53.5 55 L55 47Z', 0.22)
      + L(48.7, 47.6, 48.1, 50, '#3a3036', 0.9) + L(51.3, 47.6, 51.9, 50, '#3a3036', 0.9)
      + P('M42 54 Q50 59.5 58 54 Q50 57 42 54Z', '#1a0a0c')
      + [43.5, 45.4, 47.3, 49.2, 50.8, 52.7, 54.6, 56.5].map((x) => P(`M${x - 0.7} ${54.6 + Math.abs(x - 50) * 0.05} L${x} ${56.8 - Math.abs(x - 50) * 0.12} L${x + 0.7} ${54.6 + Math.abs(x - 50) * 0.05}Z`, '#f3ead8')).join('')
      + `<path d="M45 60.5 Q50 62.5 55 60.5" stroke="#6c747b" stroke-width=".7" fill="none"/>`
      + rim('M59 14 C63.5 22 65 34 62 46 C61.5 55 58.5 61 55 64 C59 54 61 40 59.5 28 C59 22 58 18 56 12Z', 0.55);
  };

  CHAR.second_sister = () => SCENES.fortress()
    + inqArmor() + P('M22 100 L26 62 C30 44 40 38 50 38 C60 38 70 44 74 62 L78 100Z', '#101216', 'opacity=".85"')
    + P('M34 46 C34 28 41 21 50 21 C59 21 66 28 66 46 L64 60 C60 66 40 66 36 60Z', '#1c1f24') + shade('M50 21 C59 21 66 28 66 46 L64 60 C60 66 50 66 50 66Z', 0.2)
    + P('M36 40 L64 40 L62 46 L38 46Z', '#0a0a0c') + `<g style="filter:drop-shadow(0 0 2px #ff2a2a)">${R(38, 42, 24, 2, '#ff3a3a')}</g>`
    + `<path d="M40 30 L60 30 M50 21 L50 30 M42 52 L58 52 M44 56 L56 56" stroke="#3a3f46" stroke-width="1" fill="none"/>` + P('M46 60 L54 60 L52 66 L48 66Z', '#8a1a1a')
    + inqSaber(22, 80, 15, -30);

  CHAR.fifth_brother = () => {
    const [sk, skd] = LG([[0, '#cfc4b6'], [0.5, '#a39585'], [1, '#6c6052']], 0, 0, 0.3, 1);
    return inqScene() + inqKit({ top: 70 }) + inqBlade(18, 86, 24, 50) + skd
      // Massive neck and jaw.
      + P('M38 54 L62 54 L64 70 L36 70Z', '#8d8172') + shade('M38 60 L62 60 L64 70 L36 70Z', 0.3)
      + E(30.5, 44, 2.6, 4.2, '#9a8c7c') + E(69.5, 44, 2.6, 4.2, '#9a8c7c')
      + P('M30 42 C29 25 38 14 50 14 C62 14 71 25 70 42 C70 52 67 58 62 62 L57 66 C52 67.5 48 67.5 43 66 L38 62 C33 58 30 52 30 42Z', sk)
      + shade('M50 14 C62 14 71 25 70 42 C70 52 67 58 62 62 L57 66 C53 67 51 67.3 50 67.3 C58 56 61 34 50 14Z', 0.15)
      // Raised Pau'an-style scalp crest: rows of knobs from brow to crown.
      + [[50, 16, 2.2], [44, 18, 1.8], [56, 18, 1.8], [39, 22, 1.6], [61, 22, 1.6], [50, 22, 2], [44.5, 25, 1.6], [55.5, 25, 1.6], [50, 28, 1.7]].map(([x, y, r]) => C(x, y, r, '#8a7d6e') + C(x - r * 0.3, y - r * 0.3, r * 0.45, '#ece2d4', 'opacity=".6"')).join('')
      // Thick brow ridge shadowing small fierce eyes.
      + P('M33.5 37 C40 31.5 60 31.5 66.5 37 L65.5 41.5 C58 36.5 42 36.5 34.5 41.5Z', '#7d7062') + `<path d="M34.5 37.5 C41 32.6 59 32.6 65.5 37.5" stroke="#eadfce" stroke-width=".6" fill="none" opacity=".6"/>`
      + E(43, 43.5, 4, 2.4, '#2a1f1f') + E(57, 43.5, 4, 2.4, '#2a1f1f')
      + `<g style="filter:drop-shadow(0 0 1.4px #ffb000)">${E(43, 43.7, 2.4, 1.3, '#ffd23f')}${E(57, 43.7, 2.4, 1.3, '#ffd23f')}</g>` + C(43, 43.7, 0.85, '#5a0a00') + C(57, 43.7, 0.85, '#5a0a00')
      // Broad flat nose, scowling mouth and deep jowl lines.
      + P('M46.5 46 L53.5 46 L55.5 52.5 Q50 55 44.5 52.5Z', '#94877a') + shade('M50 46 L53.5 46 L55.5 52.5 Q52.5 54 50 54.3Z', 0.22)
      + E(47.6, 52.6, 1.1, 0.6, '#3a2c26') + E(52.4, 52.6, 1.1, 0.6, '#3a2c26')
      + P('M42.5 58 Q50 56 57.5 58 L57 59.4 Q50 58 43 59.4Z', '#2a1414')
      + `<path d="M38 50 Q39.5 57.5 43.5 61.5 M62 50 Q60.5 57.5 56.5 61.5 M45 63.5 Q50 65 55 63.5" stroke="#6c6052" stroke-width=".9" fill="none"/>`
      + rim('M64 22 C69 30 70.5 40 69.5 48 C68.5 56 65 61 60 64 C64.5 57 67 48 66 39 C65.5 31 64 27 62 20Z', 0.5);
  };

  CHAR.seventh_sister = () => {
    const [sk, skd] = LG([[0, '#eef0cf'], [0.55, '#d4d7a8'], [1, '#a7aa7c']], 0, 0, 0.3, 1);
    const [hr, hrd] = LG([[0, '#30303c'], [0.5, '#121218'], [1, '#040406']]);
    const seeker = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${[-55, -25, 25, 55, 155, 205].map((a) => { const r = (a * Math.PI) / 180; return `<path d="M0 0 L${Math.cos(r) * 7} ${Math.sin(r) * 7 - 2.5} L${Math.cos(r) * 10.5} ${Math.sin(r) * 10 + 4}" stroke="#9aa0aa" stroke-width=".9" fill="none"/>`; }).join('')}${E(0, 0, 4.6, 3.8, '#1e2126')}${E(-1.2, -1.4, 2, 1, '#6a707a', 'opacity=".6"')}${C(0, 0.6, 1.7, '#ff2a2a', 'style="filter:drop-shadow(0 0 2px #ff2a2a)"')}</g>`;
    return inqScene() + seeker(15, 28, 1.3) + seeker(86, 20, 1) + seeker(85, 52, 0.8) + inqKit() + inqBlade(84, 88, 20, -30) + skd + hrd
      // Hair behind the head: a sleek, glossy bob.
      + P('M33 56 C30 34 36 20 50 19 C64 20 70 34 67 56 C64 58 61 58 60 56 L60 44 L40 44 L40 56 C39 58 36 58 33 56Z', hr)
      + P('M44.5 56 L55.5 56 L56.5 70 L43.5 70Z', '#c8cb9c') + shade('M44.5 60 L55.5 60 L56.5 70 L43.5 70Z', 0.28)
      // Fine Mirialan face: high cheekbones, narrow chin.
      + P('M38.5 42 C38.5 33 43.5 28.5 50 28.5 C56.5 28.5 61.5 33 61.5 42 C61.5 51 58 58 50 60.5 C42 58 38.5 51 38.5 42Z', sk)
      + shade('M50 28.5 C56.5 28.5 61.5 33 61.5 42 C61.5 51 58 58 50 60.5 C55 53 57 40 50 28.5Z', 0.12)
      + shade('M40 46 Q42 51 45.5 53 L42.5 47Z', 0.12) + shade('M60 46 Q58 51 54.5 53 L57.5 47Z', 0.12)
      // Straight-cut fringe.
      + P('M36.5 38 C36 26 42 21.5 50 21.5 C58 21.5 64 26 63.5 38 C61 35.5 58 34.8 50 34.8 C42 34.8 39 35.5 36.5 38Z', hr)
      + `<path d="M40 25.5 C45 22.8 55 22.8 60 25.5" stroke="#8a8aa8" stroke-width=".8" fill="none" opacity=".6"/>`
      // Golden eyes, dark liner, sharp brows.
      + `<path d="M40.5 42.6 L44 41.2 L47.8 42.8 M52.2 42.8 L56 41.2 L59.5 42.6" stroke="#121014" stroke-width="1.2" fill="none" stroke-linejoin="round"/>`
      + E(44.1, 44, 2.3, 1.25, '#fbf6dc') + E(55.9, 44, 2.3, 1.25, '#fbf6dc')
      + `<g style="filter:drop-shadow(0 0 1px #ffb000)">${C(44.3, 44, 1.1, '#e3a412')}${C(55.7, 44, 1.1, '#e3a412')}</g>` + C(44.3, 44, 0.45, '#1a0a00') + C(55.7, 44, 0.45, '#1a0a00')
      + `<path d="M40.8 39.6 L47 39.2 M53 39.2 L59.2 39.6" stroke="#121014" stroke-width="1" fill="none"/>`
      + `<path d="M50.5 45.5 L49.3 50.8 Q50 51.5 51.2 51" stroke="#000" stroke-opacity=".25" stroke-width=".7" fill="none"/>`
      // Dark lips and the diamond tattoo band across the chin.
      + P('M46.2 54 Q50 52.6 53.8 54 Q50 56.2 46.2 54Z', '#2a1018') + L(46.6, 54, 53.4, 54, '#120408', 0.5)
      + [45.2, 47.6, 50, 52.4, 54.8].map((x, i) => P(`M${x} ${57 + Math.abs(i - 2) * -0.25} l.9 .9 l-.9 .9 l-.9 -.9Z`, '#2a3a2e')).join('')
      + rim('M58 31 C61.5 35 62.5 41 62 46 C61.5 52 59 56.5 55 59.5 C58 54.5 59.5 49 59.5 43 C59.5 38 58.5 34.5 56 30Z', 0.45);
  };

  CHAR.eighth_brother = () => {
    const [hg, hgd] = LG([[0, '#4a4f5a'], [0.4, '#1c1e24'], [1, '#050506']], 0, 0, 0.6, 1);
    const [gr, grd] = LG([[0, '#d0d5dc'], [1, '#6a707a']]);
    return inqScene() + inqKit() + hgd + grd
      // Hovering saber ring overhead with motion arcs.
      + `<g opacity=".5" fill="none" stroke="#ff3a3a" stroke-width=".8"><ellipse cx="50" cy="10" rx="26" ry="5"/><ellipse cx="50" cy="10" rx="20" ry="3.6" opacity=".6"/></g>` + inqBlade(50, 10, 24, 8)
      + P('M34 46 C33 27 41 18 50 18 C59 18 67 27 66 46 L65 60 C61 67 39 67 35 60Z', hg)
      + E(43, 27, 6, 3.4, '#fff', 'opacity=".18" transform="rotate(-25 43 27)"')
      + P('M36 34 L64 34 L62 38.5 L38 38.5Z', '#121317') + L(36, 34, 64, 34, '#b01e1e', 1.2)
      + `<g style="filter:drop-shadow(0 0 2px #ff2a2a)">${P('M39 36 L48 36.4 L47 37.8 L40 37.4Z', '#ff4a4a')}${P('M61 36 L52 36.4 L53 37.8 L60 37.4Z', '#ff4a4a')}</g>`
      // Chromed face grille.
      + P('M39 42 L61 42 L59 60 C55 63 45 63 41 60Z', gr) + [42.5, 45.5, 48.5, 51.5, 54.5, 57.5].map((x) => L(x, 44, x + (x - 50) * 0.04, 59, '#15171b', 1.3)).join('')
      + L(40, 42, 60, 42, '#fff', 0.5, 'opacity=".6"') + P('M46 62 L54 62 L53 66 L47 66Z', '#b01e1e')
      + rim('M60 22 C64.5 28 66.5 36 66 46 L65 60 C64 62 63 63 61.5 64 C63 56 64 46 63 38 C62.5 30 61 26 58 21Z', 0.5);
  };

  // ---------- Wave 6 ----------
  CHAR.anakin = () => {
    const [rb, rbd] = LG([[0, '#3a2a22'], [1, '#120c0a']]);
    return SCENES.lava() + rbd
      + saber(70, 96, 92, 40, '#4aa8ff')
      + P('M2 100 C4 80 22 70 50 70 C78 70 96 80 98 100Z', rb) + P('M38 70 L50 92 L62 70Z', '#1a1210') + P('M40 72 L50 88 L60 72Z', '#6a5040', 'opacity=".5"')
      + R(36, 88, 28, 4, '#2a1c14')
      + neck('#d8b090') + head('#e0b896', { rx: 12.5, ry: 15 })
      // Shoulder-length wavy hair.
      + P('M35 46 C32 28 40 21 50 21 C61 21 68 28 65 46 C66 54 64 60 61 62 L60 46 C58 36 54 32 50 32 C45 33 41 36 40 46 L39 62 C36 60 34 54 35 46Z', '#6a4a2e')
      + `<path d="M40 26 C46 22 56 22 62 28 M37 44 C36 50 37 56 39 60 M63 44 C64 50 63 56 61 60" stroke="#8a6440" stroke-width=".8" fill="none"/>`
      + eyes({ iris: '#3a6aa8' }) + brows('#5a3e26', { angry: true, w: 1.5 }) + nose() + mouth('smirk', { color: '#8a4a3a' })
      // The scar over his right eye.
      + L(55, 39, 57.5, 50, '#a85a4a', 0.9);
  };

  CHAR.qui_gon = () => SCENES.desert()
    + saber(74, 96, 88, 42, '#46e070')
    + P('M2 100 C4 78 22 70 50 70 C78 70 96 78 98 100Z', '#a88a62') + P('M38 70 L50 96 L62 70Z', '#6a5038') + P('M30 74 C34 70 42 70 46 74 L44 100 L32 100Z', '#c8aa80', 'opacity=".5"')
    + neck('#d0a888') + head('#d8b090', { rx: 13, ry: 15.5 })
    // Long hair pulled back, full beard.
    + P('M35 44 C33 26 41 20 50 20 C60 20 67 26 65 44 C66 56 66 66 64 72 L60 70 L61 44 C59 34 55 30 50 30 C45 30 41 34 39 44 L40 70 L36 72 C34 66 34 56 35 44Z', '#7a5a3e')
    + P('M37.5 47 C38 58 43 66 50 68 C57 66 62 58 62.5 47 C59 54 56 56 50 56 C44 56 41 54 37.5 47Z', '#6a4e36')
    + P('M44 54 Q50 52 56 54 Q50 57 44 54Z', '#5a3e2a')
    + eyes({ iris: '#4a6a8a', y: 44.5 }) + brows('#5a4030', { w: 1.6, y: 41 }) + nose({ y: 45.5 });

  CHAR.padme = () => SCENES.geonosis()
    + blaster(64, 86, -30, '#c8ccd2')
    + P('M4 100 C6 80 24 72 50 72 C76 72 94 80 96 100Z', '#f2efe8') + P('M40 72 L50 84 L60 72Z', '#d8d2c6') + P('M22 84 C30 80 40 82 44 90 L36 100 L20 100Z', '#c8302a', 'opacity=".5"')
    + neck('#e6c0a0') + head('#ecc8a8', { rx: 12, ry: 15 })
    // Dark hair swept back into a braided bun.
    + P('M36 44 C35 28 42 22 50 22 C58 22 65 28 64 44 C61 36 57 32 50 32 C43 32 39 36 36 44Z', '#3a2418')
    + C(50, 18, 7, '#3a2418') + `<path d="M44 16 C47 12 53 12 56 16 M43 20 C47 17 53 17 57 20" stroke="#5a3a28" stroke-width=".8" fill="none"/>`
    + eyes({ iris: '#4a2e1a' }) + brows('#3a2418', { w: 1.1 }) + nose() + mouth('', { color: '#b0505a' })
    + P('M46 54 Q50 52.5 54 54 Q50 56 46 54Z', '#c06070');

  CHAR.lando = () => {
    const [cp, cpd] = LG([[0, '#4a7ac8'], [1, '#1e3a6a']]);
    return SCENES.cloud() + cpd
      + P('M2 100 C2 74 20 66 34 66 L50 100Z', cp) + P('M98 100 C98 74 80 66 66 66 L50 100Z', cp) + P('M30 70 C34 68 38 70 40 74 L32 100 L22 100Z', '#e8c14a', 'opacity=".7"')
      + P('M34 68 C38 66 62 66 66 68 L62 100 L38 100Z', '#3a6aa8') + P('M42 68 L50 78 L58 68Z', '#e8d8b4')
      + neck('#8a5a3a') + head('#94643f', { rx: 12.5, ry: 15 })
      + P('M37 40 C36 27 43 22 50 22 C57 22 64 27 63 40 C60 33 55 31 50 31 C45 31 40 33 37 40Z', '#1e140e')
      + `<path d="M40 28 Q44 25 48 27 M52 27 Q56 25 60 28" stroke="#3a2a1e" stroke-width="1.2" fill="none"/>`
      + eyes({ iris: '#2a1a10' }) + brows('#1e140e', { w: 1.4 }) + nose()
      // The famous mustache and grin.
      + P('M43 52 C46 50 54 50 57 52 C55 53.5 52 53 50 52.5 C48 53 45 53.5 43 52Z', '#1e140e')
      + mouth('smile', { y: 55.5, color: '#5a2a1e' });
  };

  CHAR.jango_fett = () => {
    const [hm, hmd] = LG([[0, '#c8d4dc'], [0.5, '#7a8a98'], [1, '#3a4450']]);
    return SCENES.kamino() + hmd
      + blaster(14, 78, -60, '#3a3d44') + blaster(86, 78, -120, '#3a3d44')
      + P('M2 100 C4 80 22 70 50 70 C78 70 96 80 98 100Z', '#4a5a6a') + P('M34 72 L66 72 L62 96 L38 96Z', '#8a98a8') + R(36, 88, 28, 4, '#2a2d33')
      + R(26, 60, 10, 26, '#6a7a8a', 'rx="3"') + R(64, 60, 10, 26, '#6a7a8a', 'rx="3"')
      // Mandalorian helmet in blue-silver with the T visor.
      + P('M34 46 C34 26 42 18 50 18 C58 18 66 26 66 46 L65 60 C61 66 39 66 35 60Z', hm)
      + P('M38 36 H62 V42 H54 V58 H46 V42 H38Z', '#0a0c10') + P('M36 26 C42 22 58 22 64 26 L64 30 C58 26 42 26 36 30Z', '#4a6a8a')
      + R(64, 34, 4, 14, '#5a6a7a', 'rx="1"') + E(43, 24, 5, 2, '#fff', 'opacity=".35"');
  };

  CHAR.asajj_ventress = () => {
    const [sk, skd] = LG([[0, '#eceae6'], [1, '#a8a6a2']]);
    return SCENES.dathomir() + skd
      + saber(20, 96, 6, 54, '#ff2a2a') + saber(80, 96, 94, 54, '#ff2a2a')
      + P('M2 100 C4 80 22 70 50 70 C78 70 96 80 98 100Z', '#1a1418') + P('M36 70 L50 100 L64 70Z', '#2a2026')
      + neck('#d8d6d2') + P('M37 44 C36 27 42 20 50 20 C58 20 64 27 63 44 C63 56 57 63 50 64 C43 63 37 56 37 44Z', sk)
      + shade('M50 20 C58 20 64 27 63 44 C63 56 57 63 50 64 C56 54 58 36 50 20Z', 0.12)
      // Dathomirian head markings.
      + `<path d="M50 20 L50 32 M44 21 L46 30 M56 21 L54 30 M40 26 L43 32 M60 26 L57 32" stroke="#6a6a72" stroke-width="1" fill="none"/>`
      + E(44.5, 44, 2.4, 1.4, '#1a1a20') + E(55.5, 44, 2.4, 1.4, '#1a1a20') + C(44.5, 44, 0.8, '#5a7aa8') + C(55.5, 44, 0.8, '#5a7aa8')
      + brows('#8a8a92', { angry: true, w: 0.8 }) + nose() + P('M46 54 Q50 53 54 54 Q50 55.5 46 54Z', '#5a4a52');
  };

  CHAR.cad_bane = () => SCENES.warm()
    + blaster(70, 82, -40, '#2a2d33')
    + P('M2 100 C4 80 22 70 50 70 C78 70 96 80 98 100Z', '#6a4a2e') + P('M36 72 L64 72 L60 100 L40 100Z', '#4a3a2a') + R(34, 76, 32, 3, '#2a1e14')
    + neck('#4a7a9a') + P('M38 46 C37 33 43 28 50 28 C57 28 63 33 62 46 C62 56 57 63 50 64 C43 63 38 56 38 46Z', '#5a8aa8')
    + shade('M50 28 C57 28 63 33 62 46 C62 56 57 63 50 64 C55 54 57 38 50 28Z', 0.16)
    + glowEyes(44.5, 55.5, 44, '#ff3a2a', 1.8) + P('M45 54 Q50 52 55 54', 'none', 'stroke="#2a3a4a" stroke-width="1"')
    // Breathing tubes on his cheeks.
    + C(39.5, 51, 2.4, '#8a929e') + C(60.5, 51, 2.4, '#8a929e') + L(39.5, 51, 37, 60, '#8a929e', 1.4) + L(60.5, 51, 63, 60, '#8a929e', 1.4)
    // The wide-brimmed hat.
    + E(50, 30, 30, 5, '#3a2a1e') + P('M38 30 C38 18 42 14 50 14 C58 14 62 18 62 30Z', '#4a3624') + R(38, 26, 24, 3, '#2a1c12');

  CHAR.moff_gideon = () => {
    const [ar, ard] = LG([[0, '#2a2d33'], [1, '#08090b']]);
    return SCENES.imperial() + ard
      // The Darksaber: a black blade with a white edge.
      + `<g style="filter:drop-shadow(0 0 2px #fff) drop-shadow(0 0 4px #b8c4d8)">${P('M70 96 L76 44 L80 46 L74 96Z', '#0a0a0c')}${L(76, 46, 72, 94, '#fff', 0.7)}</g>` + R(68, 94, 8, 6, '#6a707a')
      + P('M2 100 C4 78 22 70 50 70 C78 70 96 78 98 100Z', ar) + P('M4 100 C8 84 18 76 30 72 L28 100Z', '#000')
      + P('M36 72 L64 72 L60 96 L40 96Z', '#14161a') + R(40, 78, 8, 4, '#c8302a') + R(52, 78, 8, 4, '#3a6ab8')
      + neck('#a87a5a') + head('#b08460', { rx: 12.5, ry: 15 })
      + P('M37 40 C36 27 43 22 50 22 C57 22 64 27 63 40 C60 32 55 30 50 30 C45 30 40 32 37 40Z', '#1a1412')
      + eyes({ iris: '#2a1a10' }) + brows('#1a1412', { angry: true, w: 1.4 }) + nose()
      + P('M45 54 Q50 56 55 54 L54 58 Q50 59.5 46 58Z', '#2a1a14') + mouth('', { y: 54.4, color: '#5a3020' });
  };

  // ---------- Secret cards ----------
  CHAR.the_daughter = () => {
    const [rb, rbd] = LG([[0, '#f4fbff'], [1, '#9ac8e8']]);
    const [hr, hrd] = LG([[0, '#fff6dc'], [1, '#d8c890']]);
    return SCENES.mortis() + rbd + hrd + C(50, 44, 34, '#bfe8ff', 'opacity=".25"') + C(50, 44, 24, '#e8f8ff', 'opacity=".25"')
      + P('M2 100 C4 78 22 70 50 70 C78 70 96 78 98 100Z', rb) + P('M36 72 L50 100 L64 72Z', '#d8eefa') + `<path d="M30 80 C38 86 46 92 50 100 M70 80 C62 86 54 92 50 100" stroke="#8ac0e0" stroke-width=".8" fill="none"/>`
      + P('M30 52 C28 74 32 88 36 96 L42 70Z', hr) + P('M70 52 C72 74 68 88 64 96 L58 70Z', hr)
      + neck('#f0dccc') + head('#f6e4d6', { rx: 12, ry: 15 })
      + P('M35 46 C33 26 42 20 50 20 C58 20 67 26 65 46 C62 34 57 30 50 30 C43 30 38 34 35 46Z', hr)
      + eyes({ iris: '#5ab4e8' }) + brows('#c8b880', { w: 0.9 }) + nose() + mouth('smile', { color: '#c87a7a' })
      + `<g style="filter:drop-shadow(0 0 3px #bfe8ff)">${C(50, 34, 1.6, '#fff')}</g>`;
  };

  CHAR.temple_guardian = () => {
    const [mk, mkd] = LG([[0, '#f4efe2'], [1, '#bdb6a2']]);
    return SCENES.temple() + mkd
      + saber(30, 80, 46, 8, '#ffd23f') + saber(30, 80, 18, 100, '#ffd23f', { noHilt: true })
      + P('M2 100 C4 78 22 70 50 70 C78 70 96 78 98 100Z', '#c8b490') + P('M36 70 L50 98 L64 70Z', '#8a7458')
      // Deep hood and the porcelain mask with narrow eye slits.
      + P('M26 76 C22 46 32 18 50 16 C68 18 78 46 74 76 C68 64 62 60 50 60 C38 60 32 64 26 76Z', '#a8946e')
      + P('M32 66 C30 44 38 26 50 25 C62 26 70 44 68 66 C62 60 56 58 50 58 C44 58 38 60 32 66Z', '#2a2018')
      + P('M39 34 C39 30 44 28 50 28 C56 28 61 30 61 34 L60 54 C58 60 54 63 50 64 C46 63 42 60 40 54Z', mk)
      + P('M41 41 L48 43 L47 45 L41 43.5Z', '#1a120c') + P('M59 41 L52 43 L53 45 L59 43.5Z', '#1a120c')
      + `<path d="M50 28 L50 64 M44 52 L56 52 M45 56 L55 56" stroke="#a8a090" stroke-width=".7" fill="none"/>` + R(44, 30, 12, 3, '#c8a040', 'opacity=".8"');
  };

  CHAR.the_son = () => {
    const [rb, rbd] = LG([[0, '#2a1418'], [1, '#08040a']]);
    return SCENES.mortis() + rbd + C(50, 44, 32, '#ff2a2a', 'opacity=".18"')
      + P('M2 100 C4 78 22 70 50 70 C78 70 96 78 98 100Z', rb) + P('M38 70 L50 92 L62 70Z', '#5a1018') + P('M20 80 L28 74 M80 80 L72 74', 'none', 'stroke="#c8323a" stroke-width="1.4"')
      + neck('#c8c0c0') + head('#d4ccca', { rx: 12.5, ry: 15 })
      + P('M36 42 C34 26 42 20 50 20 C58 20 66 26 64 42 L62 36 L58 30 L54 34 L50 28 L46 34 L42 30 L38 36Z', '#14080a')
      // Red markings around burning eyes.
      + P('M38 40 L48 42 L46 49 L39 46Z', '#8a1018', 'opacity=".85"') + P('M62 40 L52 42 L54 49 L61 46Z', '#8a1018', 'opacity=".85"')
      + glowEyes(44, 56, 45, '#ff4a3a', 1.6) + brows('#14080a', { angry: true, w: 1.6 }) + nose() + mouth('frown', { color: '#5a1a1a' })
      + L(50, 52, 50, 60, '#8a1018', 0.8, 'opacity=".7"');
  };

  CHAR.darth_bane = () => {
    const orb = (x, y, r) => C(x, y, r, '#3a2a30') + C(x - r * 0.3, y - r * 0.3, r * 0.35, '#8a6a7a', 'opacity=".6"');
    return SCENES.throne() + C(50, 44, 34, '#d84aff', 'opacity=".12"')
      + saber(78, 96, 90, 52, '#ff2a2a')
      + P('M0 100 C2 76 20 66 50 66 C80 66 98 76 100 100Z', '#1a1418') + P('M36 70 L64 70 L60 100 L40 100Z', '#2a2228')
      + [[16, 82, 6], [26, 74, 5], [30, 88, 5], [70, 74, 5], [80, 84, 6], [64, 90, 4], [44, 80, 4], [56, 82, 4]].map(([x, y, r]) => orb(x, y, r)).join('')
      + neck('#c8a088') + head('#ccA48c', { rx: 13, ry: 15.5 })
      + `<path d="M38 30 C44 26 56 26 62 30" stroke="#a88068" stroke-width="1" fill="none"/>`
      + orb(40, 30, 3) + orb(62, 34, 2.4)
      + glowEyes(44.5, 55.5, 45, '#ffb030', 1.6) + brows('#5a3a2a', { angry: true, w: 1.8 }) + nose() + mouth('frown', { color: '#6a3a2a' })
      + `<path d="M40 50 Q42 58 46 61 M60 50 Q58 58 54 61" stroke="#a88068" stroke-width=".8" fill="none"/>`;
  };
  // ---------- Wave 8 ----------
  CHAR.cal_kestis = () => SCENES.endor()
    + saber(28, 98, 18, 52, '#ff8a2a', { hilt: '#b8bec8' }) + saber(28, 98, 38, 142, '#ff8a2a', { noHilt: true })
    + shoulders('#4a5a5e') + P('M20 80 L50 74 L80 80 L72 100 L28 100Z', '#7a5a3a') + P('M30 80 L50 76 L70 80 L64 88 L36 88Z', '#8e6a44')
    + neck('#f0c8a8') + head('#f0c8a8') + eyes({ iris: '#3a7a4a' }) + brows('#b8501e', { w: 1.1 }) + nose() + mouth('smirk', { color: '#8a3a2e' })
    + P('M36.5 42 C35 28 42 25 50 25 C59 25 66 29 63.5 42 C62 36 58 33 50 32.5 C46 33 42 34 40 38 C39 36 37.5 38 36.5 42Z', '#c8602a')
    + P('M42 27 C46 23 54 23 58 26 C54 25 48 26 44 30Z', '#e07a3a') + R(60, 80, 9, 7, '#e8ecf0', 'rx="2"') + C(64.5, 83.5, 1.6, '#3a8aff');

  CHAR.bo_katan = () => SCENES.city()
    + saber(78, 96, 92, 50, '#f4f6ff', { hilt: '#2a2d33' }) + L(78, 96, 92, 50, '#08080a', 1.2)
    + shoulders('#3a5a8a') + P('M30 78 L50 74 L70 78 L66 96 L34 96Z', '#5a7ab0') + P('M36 82 L50 79 L64 82 L62 88 L38 88Z', '#c8ccd2')
    + R(18, 80, 12, 8, '#c8ccd2', 'rx="2"') + R(70, 80, 12, 8, '#c8ccd2', 'rx="2"')
    + neck('#f2d0b6') + head('#f2d0b6') + eyes({ iris: '#3a6a9a' }) + brows('#a8401e', { w: 1.1 }) + nose() + mouth('', { color: '#a04a3e' })
    + P('M36 44 C34 28 42 24 50 24 C58 24 66 28 64 44 C66 56 64 66 60 72 C60 60 60 50 58 38 C54 33 46 33 42 38 C40 50 40 60 40 72 C36 66 34 56 36 44Z', '#c84a1e')
    + P('M42 28 C46 25 54 25 58 28 C54 27 46 27 42 31Z', '#e06a3a');

  CHAR.sabine = () => SCENES.warm()
    + blaster(10, 84, -70, '#3a3d44') + blaster(90, 84, -110, '#3a3d44')
    + shoulders('#e8e4dc') + P('M8 92 L24 78 L30 86 L14 98Z', '#ff8a2a') + P('M92 92 L76 78 L70 86 L86 98Z', '#ff5ac8')
    + P('M34 76 L50 72 L66 76 L62 92 L38 92Z', '#ffd23f') + P('M40 80 L50 78 L60 80 L58 86 L42 86Z', '#ff5ac8') + C(50, 84, 2.4, '#5a3aa8')
    + neck('#e8b896') + head('#e8b896') + eyes({ iris: '#3a2616' }) + brows('#2a2a5a', { w: 1 }) + nose() + mouth('smirk', { color: '#9a4a3e' })
    + P('M36 42 C35 28 42 24 50 24 C58 24 65 28 64 42 L62 50 C61 40 58 34 50 33 C43 33 39 38 38 50Z', '#4a3ab8')
    + P('M40 28 C46 24 56 24 62 30 C56 28 48 28 42 32Z', '#ff5ac8') + P('M56 33 L64 36 L62 46 C61 40 59 36 56 33Z', '#ff8a2a');

  CHAR.captain_rex = () => SCENES.city()
    + blaster(10, 86, -64, '#2a2d33') + blaster(90, 86, -116, '#2a2d33')
    + shoulders('#f2f2f2') + R(44, 80, 12, 20, '#d9dde2') + P('M8 88 L22 78 L26 84 L12 94Z', '#3d6fd6') + P('M92 88 L78 78 L74 84 L88 94Z', '#3d6fd6')
    + P('M36 80 L48 78 L48 84 L36 86Z', '#3d6fd6') + P('M64 80 L52 78 L52 84 L64 86Z', '#3d6fd6')
    + P('M33.5 44 C33.5 27 41 21 50 21 C59 21 66.5 27 66.5 44 L66.5 58 C62 65 38 65 33.5 58Z', '#f3f3f3') + shade('M33.5 44 C33.5 27 41 21 50 21 L50 64 C42 64 36 62 33.5 58Z', 0.1)
    + P('M38 30 C42 25 46 23 50 23 L50 28 C46 28 42 30 39 34Z', '#3d6fd6') + P('M62 30 C58 25 54 23 50 23 L50 28 C54 28 58 30 61 34Z', '#3d6fd6')
    + P('M38.5 39 L61.5 39 L61.5 44 L54 44 L54 56 L46 56 L46 44 L38.5 44Z', '#101114')
    + P('M36 36 L40 30 L44 36Z', '#3d6fd6') + P('M64 36 L60 30 L56 36Z', '#3d6fd6')
    + R(64, 26, 3, 16, '#3a3d44') + L(65.5, 26, 72, 18, '#3a3d44', 1.4) + R(46, 58, 8, 3, '#b8bfc7', 'rx="1"');

  CHAR.hondo = () => SCENES.desert()
    + blaster(80, 94, -40, '#2a2d33')
    + shoulders('#6a3a2a') + P('M30 76 L50 90 L70 76 L66 72 L50 82 L34 72Z', '#c8282a') + P('M4 100 C6 86 18 78 30 76 L34 100Z', '#3a2a22') + P('M96 100 C94 86 82 78 70 76 L66 100Z', '#3a2a22')
    + neck('#a8805a') + head('#b08a62', { rx: 13, ry: 15.5 })
    + [[38, 40, 44, 41], [56, 41, 62, 40], [40, 52, 44, 56], [60, 52, 56, 56], [46, 34, 54, 34]].map(([a, b, c, d]) => L(a, b, c, d, '#7a5a3a', 0.9)).join('')
    + eyes({ iris: '#2a1a10' }) + brows('#5a3a22', { w: 1.2 }) + nose() + mouth('smile', { color: '#5a2a1e' })
    + P('M36 34 C38 24 44 20 50 20 C56 20 62 24 64 34 L60 30 L56 32 L50 28 L44 32 L40 30Z', '#2a1a12')
    + R(36, 28, 28, 5, '#4a3a2a', 'rx="2"') + C(43, 30.5, 3.4, '#c8a040') + C(57, 30.5, 3.4, '#c8a040') + C(43, 30.5, 2, '#3a6a8a') + C(57, 30.5, 2, '#3a6a8a')
    + P('M38 58 L36 66 M62 58 L64 66', 'none', 'stroke="#2a1a12" stroke-width="1.6"');

  CHAR.savage_opress = () => SCENES.dathomir()
    + saber(20, 96, 8, 40, '#ff2a2a') + saber(20, 96, 32, 152, '#ff2a2a', { noHilt: true })
    + P('M0 100 C2 76 20 66 50 66 C80 66 98 76 100 100Z', '#2a2226') + P('M30 70 L70 70 L66 100 L34 100Z', '#3a3036')
    + P('M8 80 L28 72 L30 82 L12 90Z', '#5a5058') + P('M92 80 L72 72 L70 82 L88 90Z', '#5a5058')
    + neck('#d8b048') + head('#dcb44c', { rx: 13.5, ry: 15.5 })
    + `<path d="M50 30 L50 38 M42 32 L44 40 M58 32 L56 40 M38 50 L42 56 M62 50 L58 56 M46 58 L54 58" stroke="#1a1410" stroke-width="1.4" fill="none"/>`
    + [[40, 26], [46, 22], [54, 22], [60, 26], [37, 33], [63, 33]].map(([x, y]) => P(`M${x - 1.6} ${y + 2} L${x} ${y - 4} L${x + 1.6} ${y + 2}Z`, '#e8dcc0')).join('')
    + glowEyes(44.5, 55.5, 45, '#ffb030', 1.5) + brows('#1a1410', { angry: true, w: 1.8 }) + nose() + mouth('snarl');

  CHAR.boss_daughter = CHAR.the_daughter;
  CHAR.boss_guardian = CHAR.temple_guardian;
  CHAR.boss_son = CHAR.the_son;
  CHAR.boss_bane = CHAR.darth_bane;

  // ---------- Mythic ----------
  // Mythic cards get a crimson-gold aura frame baked into the art.
  const mythicAura = (c1, c2) => {
    const [g, gd] = RG([[0, c1, 0.75], [0.55, c2, 0.35], [1, '#000', 0]], 0.5, 0.42, 0.65);
    return gd + R(0, 0, 100, 100, g);
  };

  CHAR.darth_revan = () => {
    const [mk, mkd] = LG([[0, '#d8dce2'], [0.5, '#9aa0aa'], [1, '#4a4f58']], 0, 0, 0.4, 1);
    const [hd, hdd] = LG([[0, '#4a1418'], [0.6, '#24090c'], [1, '#0a0304']]);
    return R(0, 0, 100, 100, '#0a0610') + mythicAura('#8a2aff', '#3a0a40')
      + [12, 30, 70, 88].map((x, i) => `<path d="M${x} 0 L${x + (i % 2 ? -6 : 6)} 30 L${x + (i % 2 ? 4 : -4)} 48 L${x + (i % 2 ? -8 : 8)} 70" stroke="#c88aff" stroke-width=".8" fill="none" opacity=".35"/>`).join('')
      // Crossed red and violet blades behind him.
      + saber(28, 92, 78, 14, '#ff2a2a') + saber(72, 92, 22, 14, '#c23bff')
      + mkd + hdd
      + P('M2 100 C4 80 22 70 50 70 C78 70 96 80 98 100Z', '#1a0a10') + P('M30 72 L50 100 L70 72 L60 72 L50 88 L40 72Z', '#5a1a20')
      + P('M36 86 L64 86 L62 92 L38 92Z', '#3a2a20') + R(46, 86, 8, 6, '#9a7a3a')
      // Deep hood framing the mask.
      + P('M24 74 C20 44 30 18 50 16 C70 18 80 44 76 74 C70 64 64 58 50 58 C36 58 30 64 24 74Z', hd)
      + P('M30 66 C28 44 36 26 50 25 C64 26 72 44 70 66 C64 58 58 56 50 56 C42 56 36 58 30 66Z', '#050204')
      // The iconic mask: silver plates, a dark visor band trimmed in red.
      + P('M38 34 C38 30 44 28 50 28 C56 28 62 30 62 34 L62 52 C62 58 56 63 50 64 C44 63 38 58 38 52Z', mk)
      + P('M38 40 L62 40 L62 46 L38 46Z', '#14090c') + L(38, 40, 62, 40, '#c8323a', 0.8) + L(38, 46, 62, 46, '#c8323a', 0.8)
      + `<g style="filter:drop-shadow(0 0 2px #ff3a3a)">${R(42, 42, 6, 2, '#ff4a4a', 'rx="1"')}${R(52, 42, 6, 2, '#ff4a4a', 'rx="1"')}</g>`
      + L(50, 28, 50, 40, '#5a5f68', 0.8) + L(50, 46, 50, 63, '#5a5f68', 0.8)
      + `<path d="M42 50 L46 54 L54 54 L58 50 M44 58 L56 58" stroke="#4a4f58" stroke-width=".8" fill="none"/>`
      + E(44, 32, 4, 1.4, '#fff', 'opacity=".4" transform="rotate(-12 44 32)"');
  };

  CHAR.starkiller = () => {
    const [sk, skd] = LG([[0, '#e6c0a0'], [1, '#a87a5a']]);
    const bolt = (x1, y1, pts) => `<polyline points="${x1},${y1} ${pts}" stroke="#bfe6ff" stroke-width="1.3" fill="none"/><polyline points="${x1},${y1} ${pts}" stroke="#4aa8ff" stroke-width="3.5" fill="none" opacity=".45"/>`;
    return R(0, 0, 100, 100, '#140a14') + mythicAura('#ff6a2a', '#3a0a10')
      // A Star Destroyer torn out of the sky, burning, behind him.
      + `<g transform="translate(66 22) rotate(28)">${P('M-34 0 L30 -10 L30 10Z', '#9aa0aa')}${P('M-34 0 L30 10 L30 4Z', '#5a5f68')}${R(16, -16, 8, 8, '#8a9098')}</g>`
      + C(80, 30, 9, '#ff8a2a', 'opacity=".5"') + C(86, 36, 5, '#ffd27a', 'opacity=".6"')
      + skd
      + P('M2 100 C4 80 22 72 50 72 C78 72 96 80 98 100Z', '#2a2d33') + P('M36 74 L64 74 L60 100 L40 100Z', '#3a3d44')
      + `<path d="M22 84 L40 76 M78 84 L60 76 M40 88 H60" stroke="#5a5f68" stroke-width="1.6"/>` + R(36, 92, 28, 4, '#1a1c20')
      + neck('#d4ae8e') + head('#dcb898', { rx: 12.5, ry: 15 })
      + P('M37 40 C36 28 42 24 50 24 C58 24 64 28 63 40 C60 33 56 31 50 31 C44 31 40 33 37 40Z', '#1a1412')
      + eyes({ iris: '#4a3a2a' }) + brows('#1a1412', { angry: true, w: 1.6 }) + nose() + mouth('', { color: '#7a4a3a' })
      + `<path d="M56 49 L60 53" stroke="#a05a4a" stroke-width=".8"/>` + shade('M38 48 Q42 56 50 59 Q44 54 40 47Z', 0.2)
      // Crackling Force lightning from his raised hand, red saber in reverse grip.
      + C(20, 70, 5, '#dcb898') + `<g style="filter:drop-shadow(0 0 2px #7ac8ff)">${bolt(20, 66, '14,56 18,48 8,38 12,26 4,14')}${bolt(18, 64, '28,54 24,44 34,34 30,22')}</g>`
      + saber(80, 70, 92, 98, '#ff2a2a');
  };

  CHAR.master_luke = () => {
    const [sky, skyd] = LG([[0, '#3a2a5a'], [0.5, '#e8804a'], [1, '#ffd27a']]);
    const [sk, skd] = LG([[0, '#e2c0a2'], [1, '#a8826a']]);
    const [rb, rbd] = LG([[0, '#8a7a68'], [1, '#4a3e32']]);
    return skyd + R(0, 0, 100, 100, sky) + mythicAura('#ffd27a', '#5a2a10')
      // Binary sunset.
      + C(22, 64, 8, '#fff2c0') + C(36, 70, 5.5, '#ffe0a0') + R(0, 74, 100, 26, '#5a3a2a') + R(0, 74, 100, 2, '#ffb070', 'opacity=".6"')
      + skd + rbd
      + P('M2 100 C4 78 22 70 50 70 C78 70 96 78 98 100Z', rb) + P('M38 70 L50 100 L62 70Z', '#2a2420') + P('M40 72 L50 94 L60 72Z', '#d8cbb4', 'opacity=".25"')
      + neck('#c8a688') + head('#d4b296', { rx: 12.5, ry: 15 })
      // Weathered face, swept grey hair and full beard.
      + P('M36 42 C34 26 42 22 50 22 C59 22 66 27 64 42 C62 34 58 30 50 30 C43 30 38 34 36 42Z', '#c8c4bc')
      + `<path d="M40 26 C46 23 56 23 61 27" stroke="#f0ede6" stroke-width=".8" fill="none"/>`
      + P('M37 47 C37 58 42 66 50 68 C58 66 63 58 63 47 C60 54 56 56 50 56 C44 56 40 54 37 47Z', '#b8b2a8')
      + P('M44 54 Q50 52 56 54 Q50 57 44 54Z', '#9a948a') + `<path d="M42 58 L44 64 M50 60 L50 67 M58 58 L56 64" stroke="#8a847a" stroke-width=".7"/>`
      + eyes({ iris: '#3a6aa8', y: 44.5 }) + brows('#a8a49c', { sad: true, w: 1.6, y: 41 }) + nose({ y: 45.5 })
      + `<path d="M40 39 L44 38.6 M56 38.6 L60 39 M38.5 47 L41 48" stroke="#8a6a52" stroke-width=".6"/>`
      + saber(70, 96, 84, 58, '#3bff6a') + C(70, 96, 3, '#d4b296');
  };

  // ---------- Bosses ----------
  CHAR.rancor = () => SCENES.pit()
    + P('M8 100 C8 70 22 52 50 50 C78 52 92 70 92 100Z', '#6a5c4e')
    + P('M18 56 C16 30 32 16 50 16 C68 16 84 30 82 56 C80 66 70 72 50 72 C30 72 20 66 18 56Z', '#7a6b5b') + shade('M18 56 C16 30 32 16 50 16 L50 72 C30 72 20 66 18 56Z', 0.14)
    + P('M24 34 C30 26 40 24 46 30 L40 34Z', '#5a4d40') + P('M76 34 C70 26 60 24 54 30 L60 34Z', '#5a4d40')
    + glowEyes(38, 62, 34, '#ffb03a', 1.8)
    + P('M26 50 C30 46 70 46 74 50 L70 70 C60 80 40 80 30 70Z', '#2a0e0c')
    + [30, 36, 42, 48, 54, 60, 66].map((x) => P(`M${x} 50 L${x + 3} 60 L${x + 6} 50Z`, '#efe6cf')).join('')
    + [34, 40, 46, 52, 58, 64].map((x) => P(`M${x} 74 L${x + 3} 64 L${x + 6} 74Z`, '#efe6cf')).join('')
    + `<path d="M40 76 Q41 84 39 90" stroke="#b8c8d0" stroke-width="1" fill="none" opacity=".6"/>`;

  CHAR.krayt_dragon = () => SCENES.desert()
    + P('M100 100 L100 60 C84 50 66 46 50 44 C32 42 16 34 8 22 C18 26 26 24 32 20 C40 30 56 30 70 36 C86 42 96 50 100 54Z', '#c9a86b')
    + P('M8 22 C18 26 26 24 32 20 C28 36 16 40 6 32Z', '#b39158') + P('M10 30 L6 44 L14 36 L20 46 L24 36Z', '#efe6cf')
    + P('M34 20 L30 6 L38 16Z', '#8a6e42') + P('M44 26 L42 10 L50 22Z', '#8a6e42') + P('M56 30 L56 14 L62 28Z', '#8a6e42') + P('M68 36 L70 20 L74 36Z', '#8a6e42') + P('M80 42 L84 28 L86 44Z', '#8a6e42')
    + glowEyes(26, 26, 24, '#ffdf3a', 2)
    + `<path d="M40 38 Q60 44 90 56 M44 44 Q66 52 96 66" stroke="#a88a52" stroke-width="1.2" fill="none"/>`
    + P('M100 100 L60 100 C66 86 80 72 100 70Z', '#b39158');

  CHAR.lord_vader = () => {
    const base = CHAR.vader();
    const aura = `<g opacity=".85">${C(50, 46, 40, '#ff1a1a', 'opacity=".22"')}${C(50, 46, 30, '#ff3a1a', 'opacity=".22"')}</g>`;
    return SCENES.lava() + aura + base.replace(SCENES.deathstar(), '');
  };

  // ---------- Ships ----------
  // Top-down, nose pointing up (TIE-family are shown head-on).
  const HULL = '#d7dce4';
  const HULL_D = '#9aa3b0';
  const LINE = 'stroke="#5d6674" stroke-width=".6" fill="none"';
  const eng = (cx, cy, r, color) => `<circle class="eng" cx="${cx}" cy="${cy}" r="${r}" fill="${color || '#9fdcff'}" style="--eng:${color || '#6fc8ff'}"/>`;

  const SHIPS = {
    xwing: () => P('M44 60 L10 64 L10 72 L44 74Z', HULL) + P('M56 60 L90 64 L90 72 L56 74Z', HULL)
      + R(20, 64, 12, 3.2, '#c43b2e') + R(68, 64, 12, 3.2, '#c43b2e')
      + R(8, 30, 3.4, 46, HULL_D, 'rx="1"') + R(88.6, 30, 3.4, 46, HULL_D, 'rx="1"') + R(8.8, 24, 1.8, 8, '#6d7582') + R(89.4, 24, 1.8, 8, '#6d7582')
      + R(33, 56, 8, 26, HULL_D, 'rx="3"') + R(59, 56, 8, 26, HULL_D, 'rx="3"') + eng(37, 83, 3.4) + eng(63, 83, 3.4)
      + P('M50 5 L54.5 20 L57 58 L58 84 L42 84 L43 58 L45.5 20Z', HULL) + shade('M50 5 L45.5 20 L43 58 L42 84 L50 84Z', 0.12)
      + P('M47 40 C47 34 53 34 53 40 L53 50 L47 50Z', '#152235') + P('M48 38 L50 36 L50 44 L48 44Z', '#7fb2e6', 'opacity=".5"')
      + C(50, 58, 3.2, '#e8ecf2') + P('M46.8 58 A3.2 3.2 0 0 1 53.2 58Z', '#3b6fd6') + R(47, 22, 6, 2, '#c43b2e')
      + `<path d="M44 28 L56 28 M43.5 66 L56.5 66 M20 68 L32 68 M68 68 L80 68" ${LINE}/>`,
    ywing: () => R(17, 40, 11, 52, HULL, 'rx="5"') + R(72, 40, 11, 52, HULL, 'rx="5"') + R(18, 46, 9, 5, HULL_D) + R(73, 46, 9, 5, HULL_D)
      + eng(22.5, 93, 4.2) + eng(77.5, 93, 4.2) + R(20, 60, 5, 26, '#8a929e', 'opacity=".5"') + R(75, 60, 5, 26, '#8a929e', 'opacity=".5"')
      + R(18, 54, 64, 8, HULL_D, 'rx="2"') + R(46.5, 30, 7, 30, '#8a929e') + `<path d="M47 34 L53 40 M53 44 L47 50 M47 54 L53 58" stroke="#3a414c" stroke-width=".9" fill="none"/>`
      + P('M40 12 C40 6 60 6 60 12 L60 34 L40 34Z', HULL) + R(40, 18, 20, 4, '#e07b1a') + R(40, 26, 20, 2.4, '#e07b1a')
      + P('M44 10 L56 10 L55 17 L45 17Z', '#152235') + L(50, 2, 50, 8, '#6d7582', 1.4),
    awing: () => P('M50 8 L88 82 L64 74 L50 80 L36 74 L12 82Z', HULL) + shade('M50 8 L36 74 L12 82Z', 0.12)
      + P('M50 8 L56 22 L44 22Z', '#c43b2e') + P('M22 70 L36 66 L38 72 L20 78Z', '#c43b2e') + P('M78 70 L64 66 L62 72 L80 78Z', '#c43b2e')
      + R(8, 50, 9, 36, HULL_D, 'rx="3"') + R(83, 50, 9, 36, HULL_D, 'rx="3"') + eng(12.5, 87, 4.2) + eng(87.5, 87, 4.2)
      + E(50, 48, 5.5, 8, '#152235') + P('M47 44 L50 41 L50 50 L47 50Z', '#7fb2e6', 'opacity=".5"')
      + `<path d="M50 22 L50 38 M40 60 L60 60 M34 68 L66 68" ${LINE}/>`,
    bwing: () => R(46, 4, 8, 90, HULL, 'rx="2"') + shade('M46 4 H50 V94 H46Z', 0.12)
      + P('M16 54 L84 54 L78 64 L22 64Z', HULL) + R(12, 50, 8, 22, HULL_D, 'rx="2"') + R(80, 50, 8, 22, HULL_D, 'rx="2"')
      + R(10, 72, 12, 3, '#6d7582') + R(78, 72, 12, 3, '#6d7582') + C(50, 14, 9, HULL) + C(50, 14, 5, '#152235') + P('M47 12 A4 4 0 0 1 52 10Z', '#7fb2e6', 'opacity=".6"')
      + R(46, 34, 8, 4, '#c43b2e') + R(20, 56, 10, 2.4, '#c43b2e') + R(70, 56, 10, 2.4, '#c43b2e')
      + eng(46, 95, 2.6) + eng(50, 96, 2.6) + eng(54, 95, 2.6) + `<path d="M46 44 H54 M46 76 H54 M30 60 H70" ${LINE}/>`,
    falcon: () => P('M36 26 L36 6 L46 6 L46 30Z', HULL) + P('M64 26 L64 6 L54 6 L54 30Z', HULL) + R(38, 8, 6, 3, HULL_D) + R(56, 8, 6, 3, HULL_D)
      + C(50, 56, 34, HULL) + shade('M50 22 A34 34 0 0 0 50 90Z', 0.1) + C(50, 56, 34, 'none', 'stroke="#8a929e" stroke-width="1"')
      + P('M46 22 L54 22 L54 36 L46 36Z', '#070a12') + C(50, 56, 11, '#aeb6c2') + C(50, 56, 6, '#8a929e') + C(50, 56, 3, '#4a525e')
      + `<path d="M50 34 L50 45 M50 67 L50 88 M28 56 L39 56 M61 56 L84 56 M34 40 L42 48 M66 40 L58 48 M34 72 L42 64 M66 72 L58 64" ${LINE}/>`
      + P('M80 36 L96 34 L97 42 L82 46Z', HULL) + C(94, 38, 4, '#152235') + P('M76 42 L84 38 L84 46Z', HULL_D)
      + E(33, 44, 5, 3, HULL_D) + E(33, 44, 3, 1.8, '#5d6674')
      + `<path class="eng" d="M24 80 A34 34 0 0 0 76 80" stroke="#9fdcff" stroke-width="3.4" fill="none" style="--eng:#6fc8ff"/>`,
    razorcrest: () => P('M44 8 L56 8 L60 30 L60 78 L40 78 L40 30Z', '#b8bec6') + shade('M44 8 L40 30 L40 78 L50 78 L50 8Z', 0.12)
      + R(22, 48, 16, 34, '#a3aab3', 'rx="4"') + R(62, 48, 16, 34, '#a3aab3', 'rx="4"') + R(26, 58, 8, 18, '#6d7582', 'rx="2"') + R(66, 58, 8, 18, '#6d7582', 'rx="2"')
      + R(38, 56, 24, 6, '#8a929e') + eng(30, 84, 5.2, '#9fdcff') + eng(70, 84, 5.2, '#9fdcff')
      + P('M45 12 L55 12 L56 22 L44 22Z', '#152235') + R(42, 30, 16, 3, '#6d7582') + `<path d="M42 40 H58 M42 50 H58 M42 66 H58 M44 70 L56 70" ${LINE}/>`
      + R(46, 44, 8, 4, '#5a4632', 'opacity=".6"'),
    z95: () => P('M44 58 L12 62 L12 70 L44 72Z', HULL) + P('M56 58 L88 62 L88 70 L56 72Z', HULL)
      + R(10, 40, 3.4, 34, HULL_D, 'rx="1"') + R(86.6, 40, 3.4, 34, HULL_D, 'rx="1"') + R(18, 63, 14, 3, '#d0a040') + R(68, 63, 14, 3, '#d0a040')
      + R(36, 58, 7, 22, HULL_D, 'rx="3"') + R(57, 58, 7, 22, HULL_D, 'rx="3"') + eng(39.5, 81, 3) + eng(60.5, 81, 3)
      + P('M50 8 L55 22 L56 60 L57 82 L43 82 L44 60 L45 22Z', '#e6dcc8') + shade('M50 8 L45 22 L44 60 L43 82 L50 82Z', 0.12)
      + P('M46.5 34 C46.5 28 53.5 28 53.5 34 L53.5 46 L46.5 46Z', '#152235') + R(46, 50, 8, 3, '#d0a040'),
    vulture: () => {
      // Flight mode, 3/4 from the front: four segmented wing-legs in an X with
      // wingtip blaster pods, a skeletal spine and the long sensor head.
      const [tan, tand] = LG([[0, '#f0dfb6'], [0.45, '#c9ad7c'], [1, '#7a6440']], 0, 0, 0.4, 1);
      const [far, fard] = LG([[0, '#b49a6c'], [1, '#5a4a30']], 0, 0, 0.4, 1);
      const wing = (x1, y1, x2, y2, w, fill, front) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        const nx = (-dy / len) * w;
        const ny = (dx / len) * w;
        const jx = x1 + dx * 0.55;
        const jy = y1 + dy * 0.55;
        const pod = `<g transform="translate(${x2} ${y2}) rotate(${(Math.atan2(dy, dx) * 180) / Math.PI})">${R(-3, -4.2, 10, 8.4, '#2c241a', 'rx="2"')}${R(6, -3.2, 7, 2, '#3e3428')}${R(6, 1.2, 7, 2, '#3e3428')}${front ? `${C(13.5, -2.2, 1.2, '#ffb03a', 'class="eng" style="--eng:#ff7a1a"')}${C(13.5, 2.2, 1.2, '#ffb03a', 'class="eng" style="--eng:#ff7a1a"')}` : ''}</g>`;
        return P(`M${x1 + nx} ${y1 + ny} L${jx + nx * 1.1} ${jy + ny * 1.1} L${x2 + nx * 0.7} ${y2 + ny * 0.7} L${x2 - nx * 0.7} ${y2 - ny * 0.7} L${jx - nx * 1.1} ${jy - ny * 1.1} L${x1 - nx} ${y1 - ny}Z`, fill)
          + `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#4a3c26" stroke-width=".7"/>`
          + C(jx, jy, w * 0.9, '#3a3024') + C(jx, jy, w * 0.45, '#8a7a5a')
          + [0.2, 0.35, 0.75, 0.88].map((k) => L(x1 + dx * k + nx * 0.9, y1 + dy * k + ny * 0.9, x1 + dx * k - nx * 0.9, y1 + dy * k - ny * 0.9, '#5a4a30', 0.6)).join('')
          + (front ? `<path d="M${x1 + nx} ${y1 + ny} L${jx + nx * 1.1} ${jy + ny * 1.1} L${x2 + nx * 0.7} ${y2 + ny * 0.7}" stroke="#fff6dc" stroke-width=".6" fill="none" opacity=".7"/>` : '')
          + pod;
      };
      return tand + fard
        // Rear wings (smaller, darker: perspective).
        + wing(53, 50, 90, 70, 3, far, false) + wing(47, 50, 10, 70, 3, far, false)
        // Spine with exposed ribs.
        + P('M45 30 L55 30 L57 58 L53 82 L47 82 L43 58Z', tan) + [36, 42, 48, 54].map((y) => L(44, y, 56, y, '#5a4a30', 0.8)).join('')
        + P('M47 60 L53 60 L52 80 L48 80Z', '#2c241a') + eng(50, 84, 2.6, '#ff9a4a')
        // Front wings.
        + wing(55, 40, 94, 14, 3.8, tan, true) + wing(45, 40, 6, 14, 3.8, tan, true)
        // Long sensor head with its eye stripe.
        + P('M44 8 L56 8 L58 16 L56 32 L44 32 L42 16Z', tan) + P('M46 4 L54 4 L56 9 L44 9Z', '#9a845c')
        + shade('M50 8 L56 8 L58 16 L56 32 L50 32Z', 0.15)
        + R(44.5, 14, 11, 4, '#1a120a', 'rx="1.5"') + `<g style="filter:drop-shadow(0 0 2px #ff5a1a)">${C(47.5, 16, 1.3, '#ff7a2a')}${C(52.5, 16, 1.3, '#ff7a2a')}</g>`
        + `<path d="M46 22 H54 M46 26 H54" stroke="#5a4a30" stroke-width=".7"/>`
        + P('M50 36 L53.5 38 L53.5 42 L50 44 L46.5 42 L46.5 38Z', '#2a4a8a', 'stroke="#c8d8ff" stroke-width=".5"') + C(50, 40, 1.3, '#c8d8ff', 'opacity=".8"');
    },
    tie: () => P('M14 8 L25 27 L25 73 L14 92 L3 73 L3 27Z', '#2a2f38') + P('M86 8 L97 27 L97 73 L86 92 L75 73 L75 27Z', '#2a2f38')
      + P('M14 8 L25 27 L25 73 L14 92 L3 73 L3 27Z', 'none', 'stroke="#8a929e" stroke-width="1.6"') + P('M86 8 L97 27 L97 73 L86 92 L75 73 L75 27Z', 'none', 'stroke="#8a929e" stroke-width="1.6"')
      + `<path d="M14 8 L14 92 M3 27 L25 73 M25 27 L3 73 M86 8 L86 92 M75 27 L97 73 M97 27 L75 73" stroke="#5d6674" stroke-width=".7"/>`
      + R(24, 46, 18, 8, '#7a828e') + R(58, 46, 18, 8, '#7a828e') + C(50, 50, 16, '#8a929e') + shade('M50 34 A16 16 0 0 0 50 66Z', 0.15)
      + C(50, 50, 8.5, '#0d1016') + `<path d="M50 41.5 V58.5 M41.5 50 H58.5 M44 44 L56 56 M56 44 L44 56" stroke="#5d6674" stroke-width=".8"/>` + C(50, 50, 3, '#1a1f28')
      + C(45, 62, 1.4, '#3bff6a', 'class="eng" style="--eng:#3bff6a"') + C(55, 62, 1.4, '#3bff6a', 'class="eng" style="--eng:#3bff6a"'),
    tieint: () => P('M4 6 L22 34 L22 66 L4 94 L14 50Z', '#2a2f38', 'stroke="#8a929e" stroke-width="1.4"') + P('M96 6 L78 34 L78 66 L96 94 L86 50Z', '#2a2f38', 'stroke="#8a929e" stroke-width="1.4"')
      + `<path d="M4 6 L22 50 L4 94 M96 6 L78 50 L96 94" stroke="#5d6674" stroke-width=".7" fill="none"/>` + L(4, 6, 4, 14, '#3bff6a', 1.4) + L(96, 6, 96, 14, '#3bff6a', 1.4)
      + R(22, 46, 18, 8, '#7a828e') + R(60, 46, 18, 8, '#7a828e') + C(50, 50, 15, '#8a929e') + C(50, 50, 8, '#0d1016')
      + `<path d="M50 42 V58 M42 50 H58 M44.5 44.5 L55.5 55.5 M55.5 44.5 L44.5 55.5" stroke="#5d6674" stroke-width=".8"/>`,
    tieadv: () => P('M6 12 L28 36 L28 64 L6 88 L16 50Z', '#2a2f38', 'stroke="#8a929e" stroke-width="1.4"') + P('M94 12 L72 36 L72 64 L94 88 L84 50Z', '#2a2f38', 'stroke="#8a929e" stroke-width="1.4"')
      + `<path d="M6 12 L28 50 L6 88 M94 12 L72 50 L94 88 M16 50 H28 M84 50 H72" stroke="#5d6674" stroke-width=".7" fill="none"/>`
      + R(26, 46, 14, 8, '#7a828e') + R(60, 46, 14, 8, '#7a828e') + P('M42 60 L58 60 L56 84 L44 84Z', '#6d7582') + eng(47, 86, 2.4, '#ff8a4a') + eng(53, 86, 2.4, '#ff8a4a')
      + C(50, 50, 15, '#8a929e') + R(43, 30, 14, 10, '#7a828e', 'rx="3"') + C(50, 50, 8, '#0d1016')
      + `<path d="M50 42 V58 M42 50 H58 M44.5 44.5 L55.5 55.5 M55.5 44.5 L44.5 55.5" stroke="#5d6674" stroke-width=".8"/>`,
    tiebomber: () => P('M10 10 L22 28 L22 72 L10 90 L2 72 L2 28Z', '#2a2f38', 'stroke="#8a929e" stroke-width="1.4"') + P('M90 10 L98 28 L98 72 L90 90 L78 72 L78 28Z', '#2a2f38', 'stroke="#8a929e" stroke-width="1.4"')
      + `<path d="M10 10 V90 M90 10 V90" stroke="#5d6674" stroke-width=".7"/>` + R(20, 46, 60, 8, '#7a828e')
      + E(38, 50, 11, 24, '#8a929e') + E(62, 52, 9, 26, '#8a929e') + shade('M38 26 A11 24 0 0 0 38 74Z', 0.15)
      + C(38, 40, 6, '#0d1016') + `<path d="M38 34 V46 M32 40 H44" stroke="#5d6674" stroke-width=".7"/>` + R(58, 60, 8, 12, '#5d6674', 'rx="2"'),
    shuttle: () => R(46, 4, 8, 50, '#e0e3e8', 'rx="1"') + shade('M46 4 H50 V54 H46Z', 0.1) + L(50, 8, 50, 48, '#9aa3b0', 0.7)
      + P('M42 56 L14 92 L24 96 L50 64Z', '#d0d4da') + P('M58 56 L86 92 L76 96 L50 64Z', '#d0d4da') + `<path d="M40 62 L20 90 M60 62 L80 90" stroke="#9aa3b0" stroke-width=".8"/>`
      + R(35, 52, 30, 20, '#e6e9ee', 'rx="6"') + R(40, 56, 20, 6, '#152235', 'rx="2"') + [44, 50, 56].map((x) => L(x, 56, x, 62, '#8a929e', 0.6)).join('') + eng(42, 73, 2.4) + eng(58, 73, 2.4),
    slave: () => {
      // Upright flight pose: narrow cockpit neck rising from the broad, rounded
      // hull, rust-red lower band, swivelling wing stabilizers, twin cannons.
      const [hg, hgd] = LG([[0, '#a9b98a'], [0.4, '#7a8c5e'], [1, '#3e4a32']], 0, 0, 1, 0.3);
      const [rg, rgd] = LG([[0, '#c4583a'], [0.6, '#8a321e'], [1, '#5a1e12']]);
      const [wg, wgd] = LG([[0, '#e6dfc6'], [1, '#8e8872']], 0, 0, 0, 1);
      const [dg, dgd] = LG([[0, '#4a5440'], [1, '#1c2218']]);
      const hull = 'M39 12 C43 7 57 7 61 12 L64 30 C68 37 74 45 79 54 C84 63 86 72 84 79 C80 89 66 93 50 93 C34 93 20 89 16 79 C14 72 16 63 21 54 C26 45 32 37 36 30Z';
      return hgd + rgd + wgd + dgd
        // Stabilizer wings, angled down and out.
        + P('M22 60 L4 66 L2 80 L8 84 L22 74Z', wg) + P('M78 60 L96 66 L98 80 L92 84 L78 74Z', wg)
        + P('M4 72 L2 80 L8 84 L9 76Z', '#b84a30') + P('M96 72 L98 80 L92 84 L91 76Z', '#b84a30')
        + `<path d="M21 63 L6 68 M79 63 L94 68" stroke="#5a5646" stroke-width=".7"/>`
        + P(hull, hg)
        + shade('M39 12 C37 16 37 22 36 30 C32 37 26 45 21 54 C16 63 14 72 16 79 C20 89 34 93 50 93 C38 84 34 64 39 44 C41 30 40 18 39 12Z', 0.18)
        // Rust band hugging the broad rounded hull.
        + P('M18 66 C26 76 74 76 82 66 C84 70 85 75 84 79 C80 89 66 93 50 93 C34 93 20 89 16 79 C15 75 16 70 18 66Z', rg)
        + [[26, 80], [36, 86], [50, 84], [62, 87], [72, 80], [44, 78]].map(([x, y], i) => E(x, y, 2.4 - (i % 2) * 0.6, 1.1, '#2a0e08', 'opacity=".45"')).join('')
        + `<path d="M18 66 C26 76 74 76 82 66" stroke="#f0c8a0" stroke-width=".6" fill="none" opacity=".55"/>`
        // Curved intake shoulders and the dark ventral trench.
        + P('M28 52 C34 46 40 44 44 44 L44 60 C38 60 32 58 28 52Z', dg) + P('M72 52 C66 46 60 44 56 44 L56 60 C62 60 68 58 72 52Z', dg)
        + `<path d="M30 52 C35 48 40 46.5 43 46.5 M70 52 C65 48 60 46.5 57 46.5" stroke="#9aa884" stroke-width=".6" fill="none" opacity=".7"/>`
        + P('M46 44 L54 44 L55 70 L45 70Z', '#2e3626') + [48, 54, 60, 66].map((y) => L(46.5, y, 53.5, y, '#5a6650', 0.6)).join('')
        // Off-centre cockpit: framed canopy on the upper right of the neck.
        + P('M50 12 L58 14 L60 26 L52 28 L49 22Z', '#3a4430') + P('M51.5 14.5 L57 16 L58.5 25 L53 26.5 L50.8 21.5Z', '#10202e')
        + `<path d="M54 15.2 L55.5 26 M51.2 19 L58 20.5" stroke="#3a4430" stroke-width=".8"/>` + P('M52 15.6 L54 16.1 L54.6 19.6 L51.6 19.1Z', '#9fd8ff', 'opacity=".55"')
        // Panel lines and rivets.
        + `<path d="M40 13 L60 13 M37 30 L63 30 M34 40 C42 42 58 42 66 40 M24 56 C30 54 36 54 40 56 M76 56 C70 54 64 54 60 56" stroke="#3a4630" stroke-width=".7" fill="none"/>`
        + [[42, 22], [45, 34], [55, 34], [30, 62], [70, 62], [38, 68], [62, 68]].map(([x, y]) => C(x, y, 0.6, '#d0d8b8', 'opacity=".7"')).join('')
        // Twin blaster cannons and engine glow under the hull.
        + R(39, 88, 4, 9, '#2a2d33', 'rx="1"') + R(57, 88, 4, 9, '#2a2d33', 'rx="1"') + C(41, 97, 1.3, '#ff5a3a', 'opacity=".85"') + C(59, 97, 1.3, '#ff5a3a', 'opacity=".85"')
        + P(hull, 'none', 'stroke="#1e2618" stroke-width="1"') + `<path d="M41 11 C44 8 50 7.4 55 8" stroke="#eef4dc" stroke-width=".7" fill="none" opacity=".7"/>`
        + eng(32, 90, 2.6, '#ffb070') + eng(68, 90, 2.6, '#ffb070') + eng(50, 94, 3, '#ffb070');
    },
    n1: () => {
      // Naboo N-1: chrome-and-gold needle with long trailing engine spikes.
      const [ch, chd] = LG([[0, '#f4f6f8'], [0.5, '#b8c0c8'], [1, '#6a727e']], 0, 0, 1, 0);
      const [gd, gdd] = LG([[0, '#fff2a8'], [0.5, '#e8b830'], [1, '#a87810']], 0, 0, 1, 0);
      return chd + gdd
        + P('M24 44 L36 40 L36 96 L30 98 L26 92Z', ch) + P('M76 44 L64 40 L64 96 L70 98 L74 92Z', ch)
        + P('M36 46 L18 54 L18 60 L36 58Z', gd) + P('M64 46 L82 54 L82 60 L64 58Z', gd)
        + P('M50 4 C56 10 58 22 58 36 L58 70 L42 70 L42 36 C42 22 44 10 50 4Z', gd)
        + P('M42 52 L58 52 L60 72 L40 72Z', ch) + E(50, 30, 4.5, 7, '#12263a') + E(48.8, 28, 1.6, 2.4, '#9fd8ff', 'opacity=".6"')
        + C(50, 46, 3, '#c83a2a') + L(50, 6, 50, 26, '#fff8d0', 0.8, 'opacity=".7"')
        + eng(30, 98, 2.4, '#9fdcff') + eng(70, 98, 2.4, '#9fdcff');
    },
    scimitar: () => {
      // Sith Infiltrator: ball cockpit up front, wide down-swept wings.
      const [hl, hld] = LG([[0, '#5a5f6a'], [0.5, '#2a2d33'], [1, '#0e0f12']], 0, 0, 1, 0.4);
      return hld
        + P('M50 30 C70 32 92 48 96 74 C86 66 72 62 60 64 L50 92 L40 64 C28 62 14 66 4 74 C8 48 30 32 50 30Z', hl)
        + `<path d="M50 34 L50 88 M20 58 C32 50 44 46 50 46 C56 46 68 50 80 58" stroke="#6a707a" stroke-width=".7" fill="none"/>`
        + C(50, 22, 12, '#3a3d44') + C(50, 22, 8, '#14161a') + E(47, 19, 3, 2, '#ff3a3a', 'opacity=".55"')
        + R(46, 30, 8, 10, '#2a2d33')
        + `<g style="filter:drop-shadow(0 0 2px #ff2a2a)">${R(14, 68, 10, 2, '#ff2a2a', 'opacity=".7"')}${R(76, 68, 10, 2, '#ff2a2a', 'opacity=".7"')}</g>`
        + eng(44, 86, 2.4, '#ff8a6a') + eng(56, 86, 2.4, '#ff8a6a');
    },
    arc170: () => {
      const [w, wd] = LG([[0, '#f4f2ee'], [1, '#a8a49c']], 0, 0, 1, 0);
      return wd
        + P('M6 54 L44 46 L44 60 L6 64Z', w) + P('M94 54 L56 46 L56 60 L94 64Z', w)
        + R(8, 55, 30, 3, '#c8582a') + R(62, 55, 30, 3, '#c8582a')
        + R(30, 40, 9, 36, '#d8d4cc', 'rx="3"') + R(61, 40, 9, 36, '#d8d4cc', 'rx="3"') + eng(34.5, 78, 3.4, '#ff8a5a') + eng(65.5, 78, 3.4, '#ff8a5a')
        + P('M50 4 C54 6 56 14 56 24 L57 84 L43 84 L44 24 C44 14 46 6 50 4Z', w) + shade('M50 4 C46 6 44 14 44 24 L43 84 L50 84Z', 0.12)
        + P('M46 18 C46 12 54 12 54 18 L54 30 L46 30Z', '#2a4a3a') + P('M46.5 34 L53.5 34 L53.5 40 L46.5 40Z', '#2a4a3a', 'opacity=".7"')
        + P('M44 80 L36 96 L42 96 L47 84Z', '#c8c4bc') + P('M56 80 L64 96 L58 96 L53 84Z', '#c8c4bc') + R(46, 44, 8, 4, '#c8582a');
    },
    delta7: () => {
      const [h, hd] = LG([[0, '#f0e8e0'], [1, '#a89890']], 0, 0, 1, 0.4);
      return hd
        + P('M50 6 L90 86 L62 80 L50 90 L38 80 L10 86Z', h) + shade('M50 6 L38 80 L10 86Z', 0.12)
        + P('M50 14 L80 78 L64 74 L50 82 L36 74 L20 78Z', '#c8302a') + P('M50 24 L70 70 L50 76 L30 70Z', h)
        + E(50, 44, 5, 9, '#14263a') + E(48.6, 41, 1.6, 3, '#9fd8ff', 'opacity=".6"')
        + C(26, 62, 4, '#d8dce2') + P('M22 62 A4 4 0 0 1 30 62Z', '#3a6ab8') + C(26, 61, 1, '#ff3a3a')
        + eng(42, 86, 2.6, '#9fdcff') + eng(58, 86, 2.6, '#9fdcff');
    },
    tiedefender: () => {
      const wing = (rot) => `<g transform="rotate(${rot} 50 52)">${P('M44 52 L40 10 L60 10 L56 52Z', '#2a2f38', 'stroke="#8a929e" stroke-width="1.2"')}${L(50, 12, 50, 46, '#5d6674', 0.7)}${R(42, 4, 16, 6, '#7a828e', 'rx="1"')}${C(50, 4, 1.6, '#3bff6a', 'class="eng" style="--eng:#3bff6a"')}</g>`;
      return wing(0) + wing(120) + wing(240)
        + C(50, 52, 14, '#8a929e') + C(50, 52, 8, '#0d1016') + `<path d="M50 44 V60 M42 52 H58" stroke="#5d6674" stroke-width=".8"/>`
        + R(44, 62, 12, 12, '#6d7582', 'rx="2"') + eng(47, 76, 2, '#ff8a4a') + eng(53, 76, 2, '#ff8a4a');
    },
    tiesilencer: () => {
      const [h, hd] = LG([[0, '#3a3d44'], [1, '#0c0d10']], 0, 0, 1, 0.3);
      return hd
        + P('M50 4 L60 40 L94 70 L88 78 L58 66 L56 86 L44 86 L42 66 L12 78 L6 70 L40 40Z', h, 'stroke="#5d6674" stroke-width=".8"')
        + `<path d="M50 8 L50 82 M40 44 L14 72 M60 44 L86 72" stroke="#5d6674" stroke-width=".6"/>`
        + E(50, 34, 4, 7, '#2a0a0a') + `<g style="filter:drop-shadow(0 0 2px #ff2a2a)">${E(50, 34, 2.4, 4.4, '#ff3a3a', 'opacity=".7"')}</g>`
        + eng(46, 88, 2.4, '#ff6a4a') + eng(54, 88, 2.4, '#ff6a4a');
    },
    uwing: () => {
      const [h, hd] = LG([[0, '#dcd8cc'], [1, '#8a8678']], 0, 0, 1, 0.3);
      return hd
        + P('M42 52 L8 34 L6 40 L40 62Z', h) + P('M58 52 L92 34 L94 40 L60 62Z', h) + shade('M42 52 L8 34 L6 40 L40 62Z', 0.12)
        + R(4, 32, 6, 14, '#a8a498', 'rx="2"') + R(90, 32, 6, 14, '#a8a498', 'rx="2"') + eng(7, 48, 2.6, '#9fdcff') + eng(93, 48, 2.6, '#9fdcff')
        + R(10, 37, 20, 2.4, '#8a6a3a', 'transform="rotate(28 10 37)"') + R(70, 46, 20, 2.4, '#8a6a3a', 'transform="rotate(-28 90 37)"')
        + P('M40 26 L60 26 L64 80 L36 80Z', h) + shade('M40 26 L50 26 L50 80 L36 80Z', 0.12)
        + P('M42 10 C42 6 58 6 58 10 L60 28 L40 28Z', h) + P('M44 12 L56 12 L57 22 L43 22Z', '#2a3a4a')
        + R(38, 40, 24, 22, '#b8b4a8', 'rx="2"') + L(50, 40, 50, 62, '#6a665a', 1) + R(40, 44, 8, 4, '#8a6a3a') + R(52, 44, 8, 4, '#8a6a3a')
        + eng(42, 82, 3.2, '#9fdcff') + eng(58, 82, 3.2, '#9fdcff');
    },
    upsilon: () => {
      const [w, wd] = LG([[0, '#2a2a30'], [1, '#08080a']], 0, 0, 1, 0);
      return wd
        + P('M46 44 L6 30 L4 36 L46 54Z', w, 'stroke="#3a3a42" stroke-width=".6"') + P('M54 44 L94 30 L96 36 L54 54Z', w, 'stroke="#3a3a42" stroke-width=".6"')
        + P('M46 54 L10 70 L12 74 L46 62Z', '#1a1a1e') + P('M54 54 L90 70 L88 74 L54 62Z', '#1a1a1e')
        + L(8, 33, 44, 47, '#ff3a3a', 0.8, 'opacity=".7"') + L(92, 33, 56, 47, '#ff3a3a', 0.8, 'opacity=".7"')
        + P('M44 14 C44 8 56 8 56 14 L58 84 L42 84Z', '#1e1e24') + shade('M44 14 C44 8 50 8 50 8 L50 84 L42 84Z', 0.2)
        + P('M46 16 L54 16 L54 30 L46 30Z', '#5a1218') + R(46.5, 18, 7, 3, '#ff3a3a', 'opacity=".7"')
        + L(50, 34, 50, 80, '#3a3a42', 1) + eng(46, 86, 3, '#ff8a6a') + eng(54, 86, 3, '#ff8a6a');
    },
    houndstooth: () => {
      const [h, hd] = LG([[0, '#c8c0a8'], [1, '#5a5444']], 0, 0, 1, 0.4);
      return hd
        + P('M50 14 C72 14 88 30 88 50 C88 70 72 84 50 84 C28 84 12 70 12 50 C12 30 28 14 50 14Z', h)
        + shade('M50 14 C28 14 12 30 12 50 C12 70 28 84 50 84Z', 0.15)
        + P('M30 18 L24 4 L34 6 L40 16Z', '#9a9480') + P('M70 18 L76 4 L66 6 L60 16Z', '#9a9480')
        + C(50, 50, 14, '#8a8470') + C(50, 50, 9, '#5a5444') + C(50, 50, 4, '#ff8a3a', 'style="filter:drop-shadow(0 0 3px #ff8a3a)"')
        + E(76, 34, 8, 6, '#6a6452') + E(77, 33, 5, 3.4, '#1a2a2a') + R(18, 46, 12, 3, '#8a3a2a') + R(70, 58, 12, 3, '#8a3a2a')
        + P('M14 52 L4 56 L6 60 L16 58Z', '#6a6452') + P('M86 52 L96 56 L94 60 L84 58Z', '#6a6452')
        + eng(36, 84, 3.2, '#ffb07a') + eng(50, 86, 3.4, '#ffb07a') + eng(64, 84, 3.2, '#ffb07a');
    },
    ebonhawk: () => {
      const [h, hd] = LG([[0, '#d8ccb4'], [1, '#7a6e58']], 0, 0, 1, 0.4);
      return hd
        + P('M50 8 C66 10 86 26 90 46 C92 62 84 76 70 84 L58 88 L42 88 L30 84 C16 76 8 62 10 46 C14 26 34 10 50 8Z', h)
        + shade('M50 8 C34 10 14 26 10 46 C8 62 16 76 30 84 L42 88 L50 88Z', 0.14)
        + P('M30 20 L22 6 L28 4 L38 16Z', '#a89878') + P('M70 20 L78 6 L72 4 L62 16Z', '#a89878')
        + C(50, 50, 12, '#8a7e64') + C(50, 50, 8, '#5a5040') + L(50, 50, 50, 36, '#3a3428', 2)
        + E(50, 22, 7, 5, '#3a3428') + E(50, 22, 5, 3.2, '#12263a') + R(26, 60, 10, 3, '#8a3a2a') + R(64, 60, 10, 3, '#8a3a2a')
        + eng(38, 88, 3.4, '#9fdcff') + eng(62, 88, 3.4, '#9fdcff');
    },
    sithfury: () => {
      const [h, hd] = LG([[0, '#5a4a6a'], [1, '#1a1220']], 0, 0, 1, 0.3);
      return hd
        + P('M44 40 L8 22 L4 30 L30 56 L8 90 L16 92 L44 66Z', h, 'stroke="#c8323a" stroke-width=".8"') + P('M56 40 L92 22 L96 30 L70 56 L92 90 L84 92 L56 66Z', h, 'stroke="#c8323a" stroke-width=".8"')
        + P('M50 6 C58 12 60 24 60 40 L58 78 L42 78 L40 40 C40 24 42 12 50 6Z', '#3a2a44') + shade('M50 6 C42 12 40 24 40 40 L42 78 L50 78Z', 0.18)
        + E(50, 26, 4.6, 8, '#1a0a12') + `<g style="filter:drop-shadow(0 0 2px #ff2a2a)">${E(50, 26, 2.6, 5, '#ff3a3a', 'opacity=".6"')}</g>`
        + eng(46, 80, 2.6, '#ff6a8a') + eng(54, 80, 2.6, '#ff6a8a');
    },
    ghost: () => {
      // VCX-100 freighter, top-down: broad rounded hull, nose cockpit, dorsal
      // turret, twin engines and the Phantom docked at the stern.
      const [hg, hgd] = LG([[0, '#e8e2d2'], [0.5, '#bdb6a4'], [1, '#7a7464']], 0, 0, 1, 0.3);
      return hgd
        + P('M50 6 C60 6 66 14 70 24 L92 70 C94 76 90 80 84 80 L64 80 L60 92 L40 92 L36 80 L16 80 C10 80 6 76 8 70 L30 24 C34 14 40 6 50 6Z', hg)
        + shade('M50 6 C40 6 34 14 30 24 L8 70 C6 76 10 80 16 80 L36 80 L40 92 L50 92Z', 0.14)
        + P('M30 24 L18 52 L26 52 L36 26Z', '#d0582a') + P('M70 24 L82 52 L74 52 L64 26Z', '#d0582a')
        + P('M14 66 L30 66 L30 74 L12 74Z', '#d0582a', 'opacity=".9"') + P('M86 66 L70 66 L70 74 L88 74Z', '#d0582a', 'opacity=".9"')
        + `<path d="M50 14 L50 80 M30 40 H70 M22 60 H78" stroke="#6a6454" stroke-width=".7"/>`
        + E(50, 14, 7, 5, '#3a3628') + E(50, 13.5, 5, 3.4, '#12263a') + E(48.6, 12.6, 1.8, 0.8, '#9fd8ff', 'opacity=".7"')
        + C(50, 46, 7, '#5a5648') + C(50, 46, 4.5, '#2a2a22') + L(50, 46, 50, 34, '#3a3a32', 2) + L(47, 46, 47, 35, '#3a3a32', 1.2)
        + R(14, 76, 18, 8, '#6a6454', 'rx="3"') + R(68, 76, 18, 8, '#6a6454', 'rx="3"')
        + P('M42 74 L58 74 L60 90 L40 90Z', '#a8a290') + P('M44 76 L56 76 L57 86 L43 86Z', '#4a6a8a', 'opacity=".5"')
        + eng(20, 86, 4, '#9fdcff') + eng(28, 86, 3.2, '#9fdcff') + eng(72, 86, 3.2, '#9fdcff') + eng(80, 86, 4, '#9fdcff') + eng(50, 93, 2.4, '#9fdcff');
    },
    isd: () => P('M50 4 L88 92 L12 92Z', '#c9ced6') + shade('M50 4 L12 92 L50 92Z', 0.12)
      + `<path d="M50 10 L50 90 M30 50 L70 50 M22 70 L78 70 M40 30 L60 30" stroke="#8a929e" stroke-width=".8"/>` + P('M46 30 L54 30 L55 44 L45 44Z', '#3a414c')
      + R(38, 70, 24, 12, '#b3b9c2') + R(42, 62, 16, 10, '#a3aab3') + R(40, 58, 20, 4, '#b3b9c2') + C(44, 57, 2.4, '#b3b9c2') + C(56, 57, 2.4, '#b3b9c2')
      + eng(36, 93, 3.2, '#9fdcff') + eng(50, 94, 4, '#9fdcff') + eng(64, 93, 3.2, '#9fdcff'),
    deathstar: () => C(50, 50, 44, '#8a929e') + shade('M50 6 A44 44 0 0 0 50 94 A30 44 0 0 1 50 6Z', 0.22)
      + P('M6 50 L94 50', 'none', 'stroke="#4a525e" stroke-width="2"') + [30, 40, 60, 70].map((y) => `<path d="M${50 - Math.sqrt(44 * 44 - (y - 50) ** 2)} ${y} L${50 + Math.sqrt(44 * 44 - (y - 50) ** 2)} ${y}" stroke="#7a828e" stroke-width=".6"/>`).join('')
      + C(66, 32, 11, '#7a828e') + C(66, 32, 7, '#6a727e') + C(66, 32, 3, '#4ade80', 'class="eng" style="--eng:#4ade80"')
      + [[24, 62], [36, 74], [58, 66], [72, 58], [28, 38], [42, 24]].map(([x, y]) => R(x, y, 3, 2, '#5d6674')).join(''),
  };

  function characterArt(id) {
    return CHAR[id] ? CHAR[id]() : SCENES.space(1);
  }

  function shipArt(def) {
    const bg = SCENES.space(def.id.length * 7) + (def.boss ? C(20, 80, 30, def.id === 'death_star' ? '#3a2a5a' : '#2a3a5a', 'opacity=".5"') : '');
    return `${bg}<g class="ship-body">${(SHIPS[def.shape] || SHIPS.xwing)()}</g>`;
  }

  function unitArt(def) {
    // Player-supplied art in art/ (see art/README.md) wins over the drawings.
    const img = root.ART_IMAGES && root.ART_IMAGES[def.id];
    if (img) return `<svg class="art custom-art" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="100" height="100" fill="#05070d"/><image href="${img}" width="100" height="100" preserveAspectRatio="xMidYMid slice"/></svg>`;
    const inner = def.kind === 'ship' ? shipArt(def) : characterArt(def.id);
    return `<svg class="art" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${inner}</svg>`;
  }

  // ---------- Icons ----------
  const ICONS = {
    credits: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h10l4 4v10H9l-4-4z" fill="#e8c14a"/><path d="M5 5h10l4 4v10H9l-4-4z" fill="none" stroke="#8a6a12" stroke-width="1.2"/><rect x="9" y="9" width="6" height="6" rx="1" fill="#8a6a12" opacity=".55"/><circle cx="12" cy="12" r="1.4" fill="#fff2b8"/></svg>',
    crystals: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l5 7-5 13-5-13z" fill="#5ab4ff"/><path d="M12 2l5 7-5 13z" fill="#2a7ad0"/><path d="M7 9h10" stroke="#cfe8ff" stroke-width=".8"/><path d="M12 2l-2 7 2 13" stroke="#cfe8ff" stroke-width=".6" fill="none" opacity=".8"/></svg>',
    aurodium: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16l3-8h12l3 8z" fill="#f2b632"/><path d="M6 8h12l-2 4H8z" fill="#ffd97a"/><path d="M3 16l3-8h12l3 8z" fill="none" stroke="#8a5a0a" stroke-width="1.1"/><path d="M8 14h8" stroke="#8a5a0a" stroke-width=".9"/></svg>',
  };

  // ---------- Crates ----------
  // Three complete sets. CRATE_STYLE picks which one the game shows:
  //   'relic'   — iconic Star Wars objects instead of boxes: an astromech
  //               droid, a carbonite block, a Jedi holocron and a Sith
  //               holocron.
  //   'faction' — each crate belongs to a side of the galaxy: a Rebel supply
  //               drop, an Imperial cargo crate, a Jedi holocron vault and a
  //               Hutt treasure chest, each with its emblem.
  //   'holo'    — the same four crates as glowing hologram projections over a
  //               projector disc, with scanlines and flicker.
  // Change the line below to 'faction' or 'holo' to switch every crate.
  let CRATE_STYLE = 'relic';

  // Emblems drawn from the shared icon set onto an isometric crate face.
  const glyphPath = (name) => (root.Icons && root.Icons.SHAPES[name]) || '';
  const onLeftFace = (name, cx, cy, color, s = 0.9) => `<g transform="matrix(${s} ${s * 0.39} 0 ${s} ${cx - 12 * s} ${cy - 12 * s - 12 * s * 0.39})" fill="${color}" color="${color}">${glyphPath(name)}</g>`;
  const onRightFace = (name, cx, cy, color, s = 0.9) => `<g transform="matrix(${s} ${-s * 0.39} 0 ${s} ${cx - 12 * s} ${cy - 12 * s + 12 * s * 0.39})" fill="${color}" color="${color}">${glyphPath(name)}</g>`;
  // Isometric box: top, left and right faces.
  const BOX = { top: 'M14 36 L50 22 L86 36 L50 50Z', left: 'M14 36 L50 50 L50 90 L14 74Z', right: 'M86 36 L50 50 L50 90 L86 74Z' };
  const HUTT_CREST = 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M12 6.5c-2.6 0-4.4 1.6-4.4 3.8 0 1.8 1.2 2.6 2.4 3.1-1 .5-1.6 1.3-1.6 2.4h7.2c0-1.1-.6-1.9-1.6-2.4 1.2-.5 2.4-1.3 2.4-3.1 0-2.2-1.8-3.8-4.4-3.8z M5 5.5l2.4 3M19 5.5l-2.4 3';

  function crateFaction(id) {
    const shadow = E(50, 91, 32, 4.5, '#000', 'opacity=".5"');
    if (id === 'squadron') {
      // Imperial cargo crate: white-grey armour plates, the cog, red status lights.
      const [glow, gd] = RG([[0, '#ff6a6a'], [0.5, '#ff3a3a', 0.35], [1, '#ff3a3a', 0]]);
      return `${gd}${shadow}${C(50, 58, 38, glow, 'class="crate-glow" opacity=".45"')}
        ${P(BOX.left, '#b9c0ca')}${P(BOX.right, '#7c8492')}
        <g class="crate-lid">${P(BOX.top, '#e4e8ee')}${P('M22 36 L50 25 L78 36 L50 47Z', 'none', 'stroke="#8a929e" stroke-width=".9"')}${P('M36 30.5 L64 30.5', 'none', 'stroke="#8a929e" stroke-width=".7"')}</g>
        ${P('M14 48 L50 62 M50 62 L86 48', 'none', 'stroke="#2a2f38" stroke-width="1.6"')}
        ${P('M14 58 L50 72 L86 58', 'none', 'stroke="#2a2f38" stroke-width=".8" opacity=".6"')}
        ${onLeftFace('cog', 32, 61, '#1c2028', 1)}
        ${[0, 1, 2].map((i) => P(`M${58 + i * 7} ${55 - i * 2.7} l4.5 -1.8 l0 3 l-4.5 1.8Z`, '#ff3a3a', `class="crate-scan" style="animation-delay:${i * 0.25}s;filter:drop-shadow(0 0 2px #ff3a3a)"`)).join('')}
        ${P('M58 68 L80 59.5 L80 64 L58 72.5Z', '#2a2f38')}${[0, 1, 2, 3].map((i) => P(`M${60 + i * 5} ${69.5 - i * 1.95} l3 -1.2 l0 2 l-3 1.2Z`, '#c9ced6')).join('')}
        ${P('M48 50 L52 50 L52 90 L48 90Z', '#2a2f38', 'opacity=".5"')}`;
    }
    if (id === 'holocron') {
      // Jedi holocron vault: a blue crystal cube in gold corner caps.
      const [glow, gd] = RG([[0, '#e0f6ff'], [0.45, '#5ab4ff', 0.6], [1, '#2a7ad0', 0]]);
      const [lf, lfd] = LG([[0, '#2a6ab8'], [1, '#0c2a58']]);
      const [rf, rfd] = LG([[0, '#1a4a88'], [1, '#081a3a']]);
      const cap = (x, y, r) => P(`M${x} ${y - 4} L${x + 4} ${y - 2} L${x + 4} ${y + 2} L${x} ${y + 4} L${x - 4} ${y + 2} L${x - 4} ${y - 2}Z`, '#f2c14a', `transform="rotate(${r} ${x} ${y})" stroke="#8a5a0a" stroke-width=".6"`);
      return `${gd}${lfd}${rfd}${shadow}${C(50, 54, 40, glow, 'class="crate-glow" opacity=".55"')}
        <g class="crate-float">
        ${P(BOX.left, lf)}${P(BOX.right, rf)}${P(BOX.top, '#5a9ae0')}
        ${P('M20 39 L50 51 L50 84 L20 71Z M80 39 L50 51 L50 84 L80 71Z', 'none', 'stroke="#bfe4ff" stroke-width=".7" opacity=".55"')}
        ${P('M22 36 L50 25 L78 36 L50 47Z', 'none', 'stroke="#bfe4ff" stroke-width=".7" opacity=".6"')}
        <g class="crate-core" style="filter:drop-shadow(0 0 3px #bfe4ff) drop-shadow(0 0 6px #5ab4ff)">${onLeftFace('jedi', 32, 62, '#e8f6ff', 1.05)}${onRightFace('kyber', 68, 62, '#bfe4ff', 0.7)}</g>
        ${C(50, 36, 3, '#e0f6ff', 'class="crate-core" style="filter:drop-shadow(0 0 4px #8fd3ff)"')}
        ${cap(14, 36, 0)}${cap(86, 36, 0)}${cap(50, 22, 0)}${cap(50, 50, 0)}${cap(14, 74, 0)}${cap(86, 74, 0)}${cap(50, 90, 0)}
        </g>`;
    }
    if (id === 'strongbox') {
      // Hutt treasure chest: gold, rounded lid, the cartel crest and a ruby lock.
      const [gold, gld] = LG([[0, '#ffe08a'], [0.5, '#f2b632'], [1, '#8a5a0a']]);
      const [lid, ld] = LG([[0, '#fff0b8'], [0.6, '#e2a52a'], [1, '#a8700f']]);
      const [glow, gd] = RG([[0, '#fff3c4'], [0.5, '#f2b632', 0.5], [1, '#f2b632', 0]]);
      return `${gld}${ld}${gd}${shadow}${C(50, 56, 40, glow, 'class="crate-glow" opacity=".55"')}
        ${P('M14 50 L50 64 L50 90 L14 76Z', gold, 'stroke="#5a3a06" stroke-width="1"')}${P('M86 50 L50 64 L50 90 L86 76Z', '#a8700f', 'stroke="#5a3a06" stroke-width="1"')}
        <g class="crate-lid">${P('M14 50 C14 34 30 26 50 22 C70 26 86 34 86 50 L50 64Z', lid, 'stroke="#5a3a06" stroke-width="1"')}
        ${P('M14 50 C16 40 30 34 50 36 L50 64Z', '#000', 'opacity=".08"')}
        ${P('M30 42 C34 34 44 30 50 30', 'none', 'stroke="#fff6d0" stroke-width="1.4" opacity=".7"')}</g>
        ${P('M22 53 L22 79 M42 61 L42 87 M58 61 L58 87 M78 53 L78 79', 'none', 'stroke="#5a3a06" stroke-width="2" opacity=".55"')}
        <g transform="matrix(.75 .29 0 .75 23 55)" fill="#5a3a06" color="#5a3a06" opacity=".8">${P(HUTT_CREST, '#5a3a06', 'fill-rule="evenodd" stroke="#5a3a06" stroke-width=".8"')}</g>
        ${P('M46 62 L54 62 L54 72 L50 75 L46 72Z', '#5a3a06')}${P('M50 64.5 L52.5 68 L50 71.5 L47.5 68Z', '#ff2a4a', 'class="crate-core" style="filter:drop-shadow(0 0 4px #ff2a4a)"')}
        ${C(66, 66, 2, '#5ab4ff', 'style="filter:drop-shadow(0 0 2px #5ab4ff)"')}${C(74, 63, 1.6, '#52e08a', 'style="filter:drop-shadow(0 0 2px #52e08a)"')}
        ${C(36, 39, 1.2, '#fff', 'class="crate-glow"')}`;
    }
    // Rebel supply drop (Contraband Crate): olive drum-crate, straps, the starbird.
    const [glow, gd] = RG([[0, '#ffc08a'], [0.5, '#ff8a3a', 0.4], [1, '#ff8a3a', 0]]);
    return `${gd}${shadow}${C(50, 58, 38, glow, 'class="crate-glow" opacity=".4"')}
      ${P(BOX.left, '#6e7a4a')}${P(BOX.right, '#4a5432')}
      <g class="crate-lid">${P(BOX.top, '#87945c')}${P('M50 22 L50 50 M14 36 L86 36', 'none', 'stroke="#c8b48a" stroke-width="3" opacity=".9"')}
      ${C(50, 36, 3.4, 'none', 'stroke="#d8dce4" stroke-width="1.4"')}</g>
      ${P('M23 39.5 L23 77.5 M77 39.5 L77 77.5', 'none', 'stroke="#c8b48a" stroke-width="3.2" opacity=".9"')}
      ${P('M14 66 L50 80 L86 66', 'none', 'stroke="#c8b48a" stroke-width="3.2" opacity=".9"')}
      ${onLeftFace('starbird', 34, 59, '#ff7a2a', 1)}
      ${P('M56 52 L80 43 L80 47 L56 56Z', '#1e2414', 'opacity=".7"')}${P('M58 58 L74 52 M58 61 L70 56.5', 'none', 'stroke="#1e2414" stroke-width="1.2" opacity=".6"')}
      ${C(64, 70, 2.4, '#ff8a3a', 'class="crate-core" style="filter:drop-shadow(0 0 4px #ff8a3a)"')}
      ${L(16, 47, 26, 51, '#000', 1.2, 'opacity=".3"')}${L(70, 74, 82, 69, '#000', 1.4, 'opacity=".3"')}`;
  }

  // Hologram versions: the same silhouettes projected in light.
  function crateHolo(id) {
    const hue = { recruit: '#ff9a4a', squadron: '#ff5a5a', holocron: '#7cd8ff', strongbox: '#ffd23f' }[id] || '#7cd8ff';
    const [cone, cd] = LG([[0, hue, 0], [1, hue, 0.45]]);
    const pat = 'hs' + (++gradSeq).toString(36);
    const outline = (d) => P(d, hue, `fill-opacity=".14" stroke="${hue}" stroke-width="1.1" stroke-linejoin="round"`);
    const shape = id === 'strongbox'
      ? outline('M14 50 L50 64 L50 90 L14 76Z') + outline('M86 50 L50 64 L50 90 L86 76Z') + outline('M14 50 C14 34 30 26 50 22 C70 26 86 34 86 50 L50 64Z')
      : outline(BOX.left) + outline(BOX.right) + outline(BOX.top);
    const emblem = { recruit: onLeftFace('starbird', 34, 60, hue, 0.8), squadron: onLeftFace('cog', 32, 61, hue, 0.8), holocron: onLeftFace('jedi', 32, 62, hue, 0.9) + onRightFace('kyber', 68, 62, hue, 0.7), strongbox: `<g transform="matrix(.75 .29 0 .75 23 55)">${P(HUTT_CREST, 'none', `stroke="${hue}" stroke-width="1"`)}</g>` }[id] || '';
    return `${cd}<defs><pattern id="${pat}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1.3" fill="#fff" opacity=".22"/></pattern></defs>
      ${E(50, 92, 26, 5, hue, 'opacity=".35"')}${E(50, 92, 16, 3, '#fff', 'opacity=".55"')}
      ${P('M34 92 L66 92 L90 20 L10 20Z', cone, 'opacity=".5"')}
      <g class="crate-float crate-holo" style="filter:drop-shadow(0 0 3px ${hue}) drop-shadow(0 0 8px ${hue})">${shape}<g class="crate-core">${emblem}</g></g>
      ${P(id === 'strongbox' ? 'M14 50 C14 34 30 26 50 22 C70 26 86 34 86 50 L86 76 L50 90 L14 76Z' : 'M14 36 L50 22 L86 36 L86 74 L50 90 L14 74Z', `url(#${pat})`, 'class="crate-scan"')}`;
  }

  function crateRelic(id) {
    const shadow = E(50, 92, 26, 4, '#000', 'opacity=".5"');
    if (id === 'squadron') {
      // Carbonite block: a frozen slab with a figure's relief and glowing side panels.
      const [slab, sd] = LG([[0, '#6a7480'], [0.5, '#3a424c'], [1, '#1e242c']], 0, 0, 1, 0);
      const [face, fd] = LG([[0, '#8a96a4'], [1, '#4a5560']]);
      const [glow, gd] = RG([[0, '#ffd0a0'], [0.5, '#ff7a2a', 0.35], [1, '#ff7a2a', 0]]);
      return `${sd}${fd}${gd}${shadow}${C(50, 54, 40, glow, 'class="crate-glow" opacity=".4"')}
        <g class="crate-float">
        ${P('M24 12 L76 12 L80 16 L80 86 L76 90 L24 90 L20 86 L20 16Z', slab, 'stroke="#14181e" stroke-width="1.2"')}
        ${P('M28 18 L72 18 L72 84 L28 84Z', face, 'opacity=".9"')}
        ${P('M50 24 C57 24 61 30 60 37 C59 42 56 45 50 45 C44 45 41 42 40 37 C39 30 43 24 50 24Z', '#9aa6b4')}
        ${P('M40 34 C38 40 38 46 40 50 M60 34 C62 40 62 46 60 50', 'none', 'stroke="#5a6470" stroke-width="1.4"')}
        ${P('M36 52 C40 48 46 47 50 47 C54 47 60 48 64 52 L66 78 L34 78Z', '#8a96a4')}
        ${P('M34 54 C30 46 30 38 34 30 L38 32 C35 40 36 46 38 52Z', '#9aa6b4')}${P('M66 54 C70 46 70 38 66 30 L62 32 C65 40 64 46 62 52Z', '#9aa6b4')}
        ${P('M45 36 Q47 34 48 36 M52 36 Q53 34 55 36 M46 41 Q50 43 54 41', 'none', 'stroke="#4a5560" stroke-width="1"')}
        ${P('M28 18 L72 18 L72 84 L28 84Z', 'none', 'stroke="#c8d4e0" stroke-width=".6" opacity=".4"')}
        ${R(13, 30, 7, 40, '#2a3038', 'rx="1.5"')}${R(80, 30, 7, 40, '#2a3038', 'rx="1.5"')}
        ${[0, 1, 2, 3].map((i) => R(14.5, 34 + i * 8, 4, 4, i % 2 ? '#ff3a2a' : '#ff9a3a', `rx=".8" class="crate-scan" style="animation-delay:${i * 0.3}s;filter:drop-shadow(0 0 2px #ff7a2a)"`)).join('')}
        ${[0, 1, 2, 3].map((i) => R(81.5, 34 + i * 8, 4, 4, i % 2 ? '#52e08a' : '#ff9a3a', `rx=".8" class="crate-scan" style="animation-delay:${0.15 + i * 0.3}s;filter:drop-shadow(0 0 2px #52e08a)"`)).join('')}
        ${P('M24 12 L76 12 L74 16 L26 16Z', '#aab4c0', 'opacity=".5"')}
        ${P('M30 70 C36 66 40 72 46 68', 'none', 'stroke="#c8e4ff" stroke-width="1" opacity=".5" class="crate-core"')}
        </g>`;
    }
    if (id === 'holocron') {
      // Jedi holocron: a crystal cube in a silver frame, blue light seeping out.
      const [glow, gd] = RG([[0, '#e8f8ff'], [0.4, '#5ab4ff', 0.65], [1, '#2a7ad0', 0]]);
      const [core, cd] = RG([[0, '#ffffff'], [0.5, '#8fd3ff'], [1, '#2a6ab8']]);
      const frame = (d) => P(d, 'none', 'stroke="#d8e4f0" stroke-width="2.6" stroke-linejoin="round"');
      return `${gd}${cd}${shadow}${C(50, 52, 42, glow, 'class="crate-glow" opacity=".6"')}
        <g class="crate-float relic-spin">
        ${P('M50 18 L80 32 L80 66 L50 80 L20 66 L20 32Z', core, 'opacity=".9" class="crate-core"')}
        ${P('M50 46 L80 32 L80 66 L50 80Z', '#0c2a58', 'opacity=".45"')}${P('M50 46 L20 32 L20 66 L50 80Z', '#2a6ab8', 'opacity=".25"')}
        ${frame('M50 18 L80 32 L80 66 L50 80 L20 66 L20 32Z')}${frame('M20 32 L50 46 L80 32 M50 46 L50 80')}
        ${P('M35 25 L65 39 M65 25 L35 39 M20 49 L50 63 L80 49 M35 39 L35 73 M65 39 L65 73', 'none', 'stroke="#d8e4f0" stroke-width="1" opacity=".55"')}
        ${[[50, 18], [80, 32], [80, 66], [50, 80], [20, 66], [20, 32], [50, 46]].map(([x, y]) => C(x, y, 2.6, '#f0f6ff', 'stroke="#8a9aae" stroke-width=".6"')).join('')}
        <g class="crate-core" style="filter:drop-shadow(0 0 3px #fff) drop-shadow(0 0 8px #5ab4ff)">${onLeftFace('jedi', 35, 60, '#ffffff', 0.85)}</g>
        </g>`;
    }
    if (id === 'strongbox') {
      // Sith holocron: a black pyramid with molten red seams and a floating capstone.
      const [glow, gd] = RG([[0, '#ffb0a0'], [0.4, '#ff2a2a', 0.6], [1, '#8a0010', 0]]);
      const [lf, lfd] = LG([[0, '#3a0a10'], [1, '#0a0204']]);
      const [rf, rfd] = LG([[0, '#1a0408'], [1, '#050102']]);
      const seam = 'stroke="#ff3a2a" stroke-width="1.3" style="filter:drop-shadow(0 0 2px #ff2a2a) drop-shadow(0 0 5px #ff2a2a)"';
      return `${gd}${lfd}${rfd}${shadow}${C(50, 54, 42, glow, 'class="crate-glow" opacity=".55"')}
        <g class="crate-float">
        <g class="crate-lid">${P('M50 15 L59 27 L50 30.5 L41 27Z', lf, `stroke="#ff3a2a" stroke-width="1"`)}${P('M50 15 L59 27 L50 30.5Z', '#000', 'opacity=".4"')}</g>
        ${P('M50 34 L84 82 L50 90Z', rf)}${P('M50 34 L16 82 L50 90Z', lf)}
        ${P('M50 34 L16 82 L50 90 L84 82Z', 'none', seam)}${P('M50 34 L50 90', 'none', seam)}
        ${P('M33 58 L50 64 L67 58 M25 70 L50 77 L75 70', 'none', 'stroke="#ff3a2a" stroke-width=".8" opacity=".7"')}
        ${P('M43 31.5 L57 31.5 L55 33.5 L45 33.5Z', '#ff3a2a', 'class="crate-core" opacity=".9" style="filter:drop-shadow(0 0 4px #ff2a2a)"')}
        <g class="crate-core" style="filter:drop-shadow(0 0 3px #ff2a2a) drop-shadow(0 0 6px #ff2a2a)"><g transform="matrix(.62 .12 0 .62 26 62)" fill="#ff6a5a" color="#ff6a5a">${glyphPath('sith')}</g></g>
        </g>`;
    }
    // Astromech delivery: an R2-series droid with a hero datacard in its slot.
    const [body, bd] = LG([[0, '#ffffff'], [0.6, '#d8dee8'], [1, '#9aa4b2']], 0, 0, 1, 0);
    const [dome, dd] = LG([[0, '#f4f6fa'], [1, '#9aa4b2']], 0, 0, 1, 0);
    const [glow, gd] = RG([[0, '#bfe4ff'], [0.5, '#4a8aff', 0.4], [1, '#4a8aff', 0]]);
    return `${bd}${dd}${gd}${shadow}${C(50, 54, 40, glow, 'class="crate-glow" opacity=".45"')}
      <g class="crate-float relic-wobble">
      ${P('M18 44 L28 44 L30 84 L16 84Z', '#c8d0dc', 'stroke="#5a6472" stroke-width="1"')}${P('M82 44 L72 44 L70 84 L84 84Z', '#9aa4b2', 'stroke="#5a6472" stroke-width="1"')}
      ${R(20, 50, 6, 12, '#2a5ac8', 'rx="1"')}${R(74, 50, 6, 12, '#1a3a8a', 'rx="1"')}
      ${P('M12 84 H34 L32 89 H14Z M66 84 H88 L86 89 H68Z', '#5a6472')}
      ${P('M28 40 H72 V80 C66 84 34 84 28 80Z', body, 'stroke="#5a6472" stroke-width="1.2"')}
      ${P('M42 82 H58 L60 89 H40Z', '#5a6472')}
      ${P('M28 40 C28 22 38 14 50 14 C62 14 72 22 72 40Z', dome, 'stroke="#5a6472" stroke-width="1.2"')}
      ${P('M36 20 C40 16 46 15 50 15 L50 24 L38 26Z', '#2a5ac8')}${R(54, 22, 8, 7, '#2a5ac8', 'rx="1"')}
      ${C(44, 30, 4.4, '#0a0e14')}${C(44, 30, 2, '#ff3a3a', 'class="crate-core" style="filter:drop-shadow(0 0 3px #ff3a3a)"')}
      ${C(60, 33, 1.8, '#4aa8ff', 'class="crate-core" style="filter:drop-shadow(0 0 3px #4aa8ff)"')}
      ${P('M28 38 H72 V41 H28Z', '#2a5ac8')}
      ${R(34, 46, 12, 8, '#2a5ac8', 'rx="1"')}${R(54, 46, 12, 4, '#2a5ac8', 'rx="1"')}${R(54, 52, 12, 2, '#5a6472')}
      ${R(38, 60, 24, 14, '#14181e', 'rx="1.5"')}
      <g class="crate-lid">${R(41, 56, 18, 13, '#ffd23f', 'rx="1.2" stroke="#8a6a12" stroke-width=".6"')}${R(43, 58, 6, 6, '#fff3c4', 'rx=".6"')}${P('M51 59 H57 M51 62 H56 M43 66 H57', 'none', 'stroke="#8a6a12" stroke-width=".8"')}</g>
      ${R(34, 76, 32, 2, '#2a5ac8')}
      </g>`;
  }

  function crateArt(id, style) {
    const use = style || CRATE_STYLE;
    return `<svg class="crate-art crate-${id} crate-style-${use}" viewBox="0 0 100 100" aria-hidden="true">${use === 'holo' ? crateHolo(id) : use === 'faction' ? crateFaction(id) : crateRelic(id)}</svg>`;
  }

  // Shady merchant for the Black Market.
  function merchantArt() {
    return `<svg class="merchant-art" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      ${R(0, 0, 100, 100, '#0d0a14')}${R(0, 0, 100, 100, '#ff2e88', 'opacity=".07"')}
      ${R(8, 10, 26, 8, '#ff2e88', 'rx="2" opacity=".7" style="filter:drop-shadow(0 0 4px #ff2e88)"')}${R(66, 18, 24, 6, '#2ee6ff', 'rx="2" opacity=".6" style="filter:drop-shadow(0 0 4px #2ee6ff)"')}
      ${P('M16 100 L22 58 C24 34 36 22 50 22 C64 22 76 34 78 58 L84 100Z', '#241c2e')}${shade('M50 22 C36 22 24 34 22 58 L16 100 L40 100 L36 58Z', 0.3)}
      ${E(50, 54, 12, 14, '#07050a')}${glowEyes(45, 55, 52, '#ff5a3a', 1.8)}
      ${P('M30 100 L36 76 L64 76 L70 100Z', '#1a1422')}${P('M34 84 L66 84', 'none', 'stroke="#c9a24a" stroke-width="1.4"')}
      ${C(28, 86, 5, '#e8c14a', 'opacity=".9"')}${C(72, 90, 4, '#5ab4ff', 'opacity=".9"')}
    </svg>`;
  }

  // Card backs: an ornate, original design per side of the Force.
  function cardBack(faction) {
    const light = faction !== 'dark';
    const a = light ? '#5ab4ff' : '#ff2a3a';
    const b = light ? '#d8ecff' : '#ffb0a0';
    const [bg, bgd] = RG(light ? [[0, '#16305a'], [0.6, '#0a1428'], [1, '#04070f']] : [[0, '#4a0a12'], [0.6, '#1a0408'], [1, '#060103']], 0.5, 0.45, 0.75);
    const rays = Array.from({ length: 24 }, (_, i) => {
      const ang = (i / 24) * Math.PI * 2;
      return L(50 + Math.cos(ang) * 18, 77 + Math.sin(ang) * 18, 50 + Math.cos(ang) * 46, 77 + Math.sin(ang) * 46, a, i % 2 ? 0.4 : 0.8, 'opacity=".35"');
    }).join('');
    const corner = (x, y, sx, sy) => `<path d="M${x} ${y + sy * 16} L${x} ${y} L${x + sx * 16} ${y} M${x + sx * 4} ${y + sy * 10} L${x + sx * 4} ${y + sy * 4} L${x + sx * 10} ${y + sy * 4}" stroke="${b}" stroke-width="1.2" fill="none"/>${C(x + sx * 4, y + sy * 4, 1.6, a)}`;
    const emblem = light
      // Light: a winged circle around an upright blade.
      ? `<g transform="translate(50 77)">${C(0, 0, 15, 'none', `stroke="${b}" stroke-width="1.4"`)}${C(0, 0, 11, 'none', `stroke="${a}" stroke-width=".8"`)}
          <path d="M-15 -2 C-26 -6 -32 -14 -34 -22 C-26 -18 -20 -14 -14 -12 M15 -2 C26 -6 32 -14 34 -22 C26 -18 20 -14 14 -12 M-15 4 C-24 4 -30 0 -33 -6 M15 4 C24 4 30 0 33 -6" stroke="${b}" stroke-width="1.3" fill="none"/>
          <g style="filter:drop-shadow(0 0 2px ${a}) drop-shadow(0 0 4px ${a})">${L(0, -22, 0, 8, '#fff', 2.2)}</g>${R(-2, 8, 4, 9, '#9aa0aa', 'rx="1"')}${R(-3.5, 8, 7, 2, b)}</g>`
      // Dark: a spiked, angular sigil around crossed blades.
      : `<g transform="translate(50 77)">${Array.from({ length: 8 }, (_, i) => `<path d="M0 -24 L4 -14 L-4 -14Z" fill="${b}" transform="rotate(${i * 45})"/>`).join('')}
          ${C(0, 0, 13, '#14040a', `stroke="${b}" stroke-width="1.4"`)}${C(0, 0, 9, 'none', `stroke="${a}" stroke-width=".8"`)}
          <g style="filter:drop-shadow(0 0 2px ${a}) drop-shadow(0 0 4px ${a})">${L(-9, 9, 9, -9, '#fff', 1.8)}${L(9, 9, -9, -9, '#fff', 1.8)}</g></g>`;
    return `<svg class="card-back" viewBox="0 0 100 154" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${bgd}${R(0, 0, 100, 154, bg)}
      ${Array.from({ length: 30 }, (_, i) => C((i * 37) % 100, (i * 53) % 154, (i % 3) * 0.3 + 0.3, '#fff', `opacity="${0.2 + (i % 4) * 0.12}"`)).join('')}
      <g class="cb-rays">${rays}</g>
      ${R(5, 5, 90, 144, 'none', `rx="6" stroke="${b}" stroke-width="1.2" opacity=".8"`)}${R(9, 9, 82, 136, 'none', `rx="4" stroke="${a}" stroke-width=".6" opacity=".7"`)}
      ${corner(9, 9, 1, 1)}${corner(91, 9, -1, 1)}${corner(9, 145, 1, -1)}${corner(91, 145, -1, -1)}
      <path d="M30 22 H70 M38 26 H62 M30 132 H70 M38 128 H62" stroke="${b}" stroke-width=".6" opacity=".7"/>
      ${C(50, 77, 40, 'none', `stroke="${a}" stroke-width=".5" stroke-dasharray="2 3" opacity=".7"`)}
      ${emblem}
      <text x="50" y="18" text-anchor="middle" font-size="5.2" letter-spacing="1.4" fill="${b}" font-family="Oxanium, sans-serif" font-weight="700">${light ? 'LIGHT SIDE' : 'DARK SIDE'}</text>
      <text x="50" y="140" text-anchor="middle" font-size="3.1" letter-spacing=".5" fill="${b}" opacity=".7" font-family="Oxanium, sans-serif">GALACTIC CARD BATTLES</text>
    </svg>`;
  }

  // Just the ship, no background: used for full-screen flybys.
  function shipOnly(def) {
    return `<svg class="ship-only" viewBox="0 0 100 100" aria-hidden="true">${(SHIPS[def.shape] || SHIPS.xwing)()}</svg>`;
  }

  root.Art = { unitArt, shipOnly, cardBack, ICONS, crateArt, setCrateStyle: (v) => { CRATE_STYLE = ['holo', 'faction'].includes(v) ? v : 'relic'; }, get crateStyle() { return CRATE_STYLE; }, merchantArt, SHIP_SHAPES: Object.keys(SHIPS), CHARACTER_IDS: Object.keys(CHAR) };
})(typeof window !== 'undefined' ? window : globalThis);
