// Card art with proper necks and shoulders (Darth Vader, the Mandalorian, the
// Stormtrooper, Yoda, C-3PO and Darth Maul): heads sit on real necks, bodies in proportion.
// Drawn on the same shapes the holiday skins use. Generated from the art sheet.
(function (root) {
  if (!root.Art || !root.Art.addArt || !root.Art.kit) return;
  const Art = root.Art;
  const { P, E, C, R, L, shade, SCENES } = Art.kit;
  let gid = 0; const pre = 'nk' + Math.floor(Math.random() * 1e4).toString(36);
  const LG = (stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => { const id = pre + (++gid); return [`url(#${id})`, `<defs><linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('')}</linearGradient></defs>`]; };
  const RG = (stops, cx = .5, cy = .5, r = .5) => { const id = pre + (++gid); return [`url(#${id})`, `<defs><radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('')}</radialGradient></defs>`]; };
  const hl = (d, o = 0.18) => P(d, '#fff', `opacity="${o}"`);
  const saber = (x1, y1, x2, y2, col, cane) => {
    const core = cane ? `${L(x1, y1, x2, y2, '#fff8ef', 4.2)}${L(x1, y1, x2, y2, '#e8252f', 4.2, 'stroke-dasharray="2.4 2.4" stroke-linecap="butt"')}` : `${L(x1, y1, x2, y2, col, 4.6, 'opacity=".75"')}${L(x1, y1, x2, y2, '#fff', 1.9)}`;
    const hx = x1 + (x1 - x2) * 0.17, hy = y1 + (y1 - y2) * 0.17;
    return `<g class="art-saber" style="filter:drop-shadow(0 0 1.6px ${col}) drop-shadow(0 0 3.5px ${col})">${core}</g>${L(x1, y1, hx, hy, '#9aa1ab', 3.4)}${L(x1 + (hx - x1) * .3, y1 + (hy - y1) * .3, x1 + (hx - x1) * .55, y1 + (hy - y1) * .55, '#23252b', 3.6)}`;
  };
  const santaHat = (cx, y, w, tilt = -10) => { const [g, gd] = LG([[0, '#ff4a4a'], [1, '#b3121f']], 0, 0, 1, 1); return `${gd}<g transform="rotate(${tilt} ${cx} ${y})">${P(`M${cx - w / 2} ${y} Q${cx - w * .1} ${y - w * .9} ${cx + w * .55} ${y - w * .55} Q${cx + w * .25} ${y - w * .3} ${cx + w / 2} ${y}Z`, g)}${shade(`M${cx} ${y} Q${cx + w * .15} ${y - w * .45} ${cx + w * .55} ${y - w * .55} Q${cx + w * .25} ${y - w * .3} ${cx + w / 2} ${y}Z`, .18)}<rect x="${cx - w / 2 - 1.5}" y="${y - 3}" width="${w + 3}" height="6" rx="3" fill="#f6f3ee"/>${hl(`M${cx - w / 2} ${y - 2.5} H${cx + w / 2} V${y - 1.2} H${cx - w / 2}Z`, .5)}${C(cx + w * .56, y - w * .56, w * .11, '#f6f3ee')}</g>`; };
  const BULB = ['#ff4a5a', '#ffd23f', '#4ad46a', '#4aa8ff', '#ff7ad9'];
  const bulbs = (pts, r = 1.4, wire = '#1f3a1f') => `<path d="M${pts.map((p) => p.join(' ')).join(' L')}" stroke="${wire}" stroke-width=".55" fill="none"/>` + pts.map(([x, y], i) => `${C(x, y + r * .5, r * 2, BULB[i % 5], 'opacity=".25"')}<ellipse cx="${x}" cy="${y + r * .5}" rx="${r * .75}" ry="${r}" fill="${BULB[i % 5]}"/>${R(x - r * .4, y - r * .7, r * .8, r * .55, '#3a3d42')}${C(x - r * .25, y + r * .1, r * .25, '#fff', 'opacity=".7"')}`).join('');
  const along = (d, n) => { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.appendChild(p); document.body.appendChild(s); const len = p.getTotalLength(); const out = Array.from({ length: n }, (_, i) => { const q = p.getPointAtLength((i + .5) / n * len); return [+q.x.toFixed(1), +q.y.toFixed(1)]; }); s.remove(); return out; };
  const snow = (n, seed = 7) => { let s = seed; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280); return Array.from({ length: n }, () => C((r() * 100).toFixed(1), (r() * 100).toFixed(1), (.3 + r() * .8).toFixed(2), '#fff', `opacity="${(.5 + r() * .5).toFixed(2)}"`)).join(''); };
  const gift = (x, y, w, h, c, rib = '#ffd23f') => { const [g, gd] = LG([[0, c], [1, '#000']], 0, 0, 1, 1); return `${gd}${R(x, y, w, h, c, 'rx=".8"')}${R(x, y, w, h, g, 'rx=".8" opacity=".25"')}${R(x + w * .42, y, w * .16, h, rib)}${R(x - .6, y - 2, w + 1.2, 3, c, 'rx=".6"')}${R(x + w * .42, y - 2, w * .16, 3, rib)}${P(`M${x + w / 2} ${y - 2} q-${w * .35} -${w * .3} -${w * .4} -${w * .05} q.5 ${w * .2} ${w * .4} ${w * .05} q${w * .35} -${w * .3} ${w * .4} -${w * .05} q-.5 ${w * .2} -${w * .4} ${w * .05}z`, rib)}`; };
  // ===================== DARTH VADER =====================
  const out = {};
  // ===================== DARTH VADER =====================
  const vader = (x) => {
    const G = x ? { h1: '#d9934a', h2: '#7a3f16', mask: '#b8722f', lens: '#3a1a08', body: '#8a4a1c', bodyD: '#5e2f10', cape: '#9aa0a8', capeD: '#6a7078', trim: '#fffaf0', box: '#7a4216' }
      : { h1: '#4a4d57', h2: '#08080a', mask: '#23252c', lens: '#2a0b0b', body: '#121317', bodyD: '#060607', cape: '#0b0b0d', capeD: '#030304', trim: '#9aa1ab', box: '#2a2c33' };
    const [hg, hgd] = LG([[0, G.h1], [.55, G.h2], [1, G.h2]], 0, 0, 1, .6);
    const [cg, cgd] = LG([[0, G.cape], [1, G.capeD]], 0, 0, 1, 0);
    const [bg, bgd] = LG([[0, G.body], [1, G.bodyD]], 0, 0, 0, 1);
    const [lg, lgd] = LG([[0, x ? '#5a2a0c' : '#5a1414'], [.5, G.lens], [1, '#000']], 0, 0, 1, 1);
    const helm = 'M29.5 44 C29.5 22 39 12.5 50 12.5 C61 12.5 70.5 22 70.5 44 L75.5 62.5 L62 57.5 L60.5 67 L39.5 67 L38 57.5 L24.5 62.5Z';
    let s = (x ? '' : SCENES.deathstar()) + hgd + cgd + bgd + lgd;
    if (x) { const [sk, skd] = LG([[0, '#2a1a12'], [1, '#5a3420']], 0, 0, 0, 1); s += skd + R(0, 0, 100, 100, sk) + [10, 30, 50, 70, 90].map((xx) => R(xx - 1.5, 8, 3, 58, '#fff8ef') + R(xx - 1.5, 8, 3, 58, 'url(#cv)')).join('') + `<defs><pattern id="cv" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="2" height="4" fill="#e8252f"/></pattern></defs>` + R(0, 66, 100, 34, '#3a2418') + snow(30, 3); }
    // cape behind, then shoulders
    s += P('M0 100 C2 80 12 68 30 64 L70 64 C88 68 98 80 100 100Z', cg) + shade('M50 64 L70 64 C88 68 98 80 100 100 L56 100Z', .25);
    if (x) s += `<path d="M6 100 Q10 86 16 76 M14 100 Q17 88 22 78 M94 100 Q90 86 84 76 M86 100 Q83 88 78 78" stroke="#5a6068" stroke-width="1" fill="none" opacity=".7"/><path d="M4 99 Q8 84 18 74" stroke="#c8ced6" stroke-width=".8" fill="none" opacity=".6"/>` + [[5, 96], [9, 87], [15, 79], [95, 96], [91, 87], [85, 79]].map(([a, b]) => C(a, b, .7, '#fffaf0')).join('');
    s += P('M10 100 C14 84 24 74 36 70 L64 70 C76 74 86 84 90 100Z', bg);
    // gorget / shoulder armour with trim
    s += P('M27 70 C33 63.5 42 61.5 50 61.5 C58 61.5 67 63.5 73 70 L77 78 C68 72.5 59 71 50 71 C41 71 32 72.5 23 78Z', x ? '#6e3812' : '#1a1b20') + hl('M27 70 C33 63.5 42 61.5 50 61.5 L50 64 C42 64 34 66 29 71Z', .12)
      + `<path d="M25.5 75.5 C33 70 41 68.8 50 68.8 C59 68.8 67 70 74.5 75.5" stroke="${G.trim}" stroke-width="${x ? 1.1 : .8}" fill="none" ${x ? 'stroke-dasharray="1.6 1"' : ''}/>`;
    // chest plate + chest box
    if (x) s += [[30, 76], [70, 76], [26, 84], [74, 84]].map(([a, b], i) => P(`M${a - 4} ${b} q4 -3 8 0`, 'none', 'stroke="#fffaf0" stroke-width=".9"')).join('') + C(33, 82, 1.6, '#e8252f') + C(67, 82, 1.6, '#3bd16f') + C(32.4, 81.4, .5, '#fff', 'opacity=".6"') + C(66.4, 81.4, .5, '#fff', 'opacity=".6"');
    s += P('M37 74 L63 74 L61 100 L39 100Z', x ? '#7a4216' : '#17181c') + shade('M50 74 L63 74 L61 100 L50 100Z', .18)
      + R(40.5, 78, 19, 13, G.box, 'rx="1.6"') + hl('M40.5 78 H59.5 V79.2 H40.5Z', .15)
      + (x ? C(44, 83, 1.9, '#ff3b5c') + C(50, 83, 1.9, '#3bd16f') + C(56, 83, 1.9, '#4aa8ff') + C(43.4, 82.4, .6, '#fff', 'opacity=".6"') + C(49.4, 82.4, .6, '#fff', 'opacity=".6"') + C(55.4, 82.4, .6, '#fff', 'opacity=".6"') + `<path d="M42 87.5 q2 -1.4 4 0 t4 0 t4 0 t4 0" stroke="#fffaf0" stroke-width=".9" fill="none"/>`
        : R(42.5, 80, 3, 2, '#ff3b3b') + R(46.5, 80, 3, 2, '#3bff6a') + R(50.5, 80, 3, 2, '#3b8bff') + R(54.5, 80, 3, 2, '#aab2bc') + R(42.5, 84, 15, 1.4, '#8a9099') + R(42.5, 86.6, 6, 2.4, '#3a3d45') + R(50, 86.6, 7.5, 2.4, '#3a3d45') + C(44, 87.8, .7, '#ff3b3b') + C(52, 87.8, .7, '#3bff6a'))
      + (x ? '' : C(39, 96, 2.2, '#9aa1ab') + C(61, 96, 2.2, '#9aa1ab') + C(39, 96, 1, '#3a3d45') + C(61, 96, 1, '#3a3d45'));
    // neck seal (ties helmet to body)
    s += R(41, 56, 18, 12, x ? '#5e2f10' : '#0c0c0f') + [58.5, 61, 63.5, 66].map((y) => L(42, y, 58, y, x ? '#8a4a1c' : '#2a2b31', .7)).join('');
    // helmet
    s += P(helm, hg) + hl('M33 30 C36 20 44 15 50 14.5 L50 18 C44 18.5 38 23 35.5 32Z', x ? .3 : .22)
      + `<path d="M31 36 Q50 29 69 36" stroke="${x ? '#5e2f10' : '#000'}" stroke-width="1.2" fill="none" opacity=".6"/>` + L(50, 13, 50, 29, x ? '#e8a868' : '#5a5d68', 1, 'opacity=".7"');
    // mask
    s += P('M35.5 35.5 Q50 31.5 64.5 35.5 L63 49.5 L57 52.5 L56.5 59.5 L43.5 59.5 L43 52.5 L37 49.5Z', G.mask) + shade('M50 33 Q57 33.5 64.5 35.5 L63 49.5 L57 52.5 L56.5 59.5 L50 59.5Z', .15)
      + P('M37.2 37.8 Q42 35.9 47.2 38.2 L46.4 45.6 Q41.2 47 38.4 44.2Z', lg) + P('M62.8 37.8 Q58 35.9 52.8 38.2 L53.6 45.6 Q58.8 47 61.6 44.2Z', lg)
      + P('M38.6 38.6 Q41.6 37.6 44.6 38.4 L44 39.6 Q41.4 39 38.9 39.8Z', x ? '#c98a4a' : '#a04040', 'opacity=".7"') + P('M61.4 38.6 Q58.4 37.6 55.4 38.4 L56 39.6 Q58.6 39 61.1 39.8Z', x ? '#c98a4a' : '#a04040', 'opacity=".7"')
      + P('M47.8 38.6 L52.2 38.6 L53.2 50.5 L46.8 50.5Z', x ? '#9a5a24' : '#2c2e36') + hl('M48.2 39 L49.4 39 L48.9 50 L47.4 50Z', .12)
      + `<path d="M38 48.5 L43 52 M62 48.5 L57 52" stroke="${x ? '#5e2f10' : '#0a0a0c'}" stroke-width=".9" fill="none"/>`
      + P('M44.6 51.5 L55.4 51.5 L58 62.5 L42 62.5Z', x ? '#8a4a1c' : '#202228') + [45.2, 47.5, 49.8, 52.1, 54.4].map((xx) => L(xx + .3, 52.6, xx + (xx - 50) * .2 + .3, 61.6, x ? '#fffaf0' : '#9aa1ab', x ? .8 : .6)).join('')
      + P('M42 62.5 L58 62.5 L55.5 66.5 L44.5 66.5Z', x ? '#6e3812' : '#141519');
    if (x) { const ice = 'stroke="#fffaf0" stroke-width="1.15" fill="none" stroke-linecap="round" stroke-linejoin="round"';
      s += `<path d="${helm}" ${ice}/><path d="M37.2 37.8 Q42 35.9 47.2 38.2 L46.4 45.6 Q41.2 47 38.4 44.2Z M62.8 37.8 Q58 35.9 52.8 38.2 L53.6 45.6 Q58.8 47 61.6 44.2Z" ${ice} stroke-width=".8"/><path d="M31 36 Q36 33 41 34 Q46 31 50 32 Q54 31 59 34 Q64 33 69 36" ${ice} stroke-width=".9"/>`
        + [[40, 22], [60, 22], [34, 52], [66, 52]].map(([a, b]) => C(a, b, .9, '#fffaf0')).join('')
        + [36.6, 39.6, 42.6, 45.6].map((a, i) => C(a, 47.3 + (i % 2) * .5, .45, '#fffaf0')).join('') + [54.4, 57.4, 60.4, 63.4].map((a, i) => C(a, 47.3 + (i % 2) * .5, .45, '#fffaf0')).join('')
        + `<path d="M44 63.5 Q50 65.5 56 63.5" stroke="#fffaf0" stroke-width=".8" fill="none"/><path d="M48.4 40.5 v8.5 M51.6 40.5 v8.5" stroke="#fffaf0" stroke-width=".45" opacity=".8"/>` + C(50, 26, 1.4, '#e8252f') + C(49.6, 25.6, .45, '#fff', 'opacity=".7"') + P('M46.5 26 q-2 -2.4 -4.2 -.6 q1.6 1.8 4.2 .6z M53.5 26 q2 -2.4 4.2 -.6 q-1.6 1.8 -4.2 .6z', '#3bd16f');
      // cookie in his left hand
      s += `<defs><mask id="vbite"><rect width="100" height="100" fill="#fff"/>${C(25.5, 78.5, 2.6, '#000')}${C(27.2, 81.4, 2.2, '#000')}${C(24.4, 76.2, 1.8, '#000')}</mask></defs>` + `<g mask="url(#vbite)">` + C(20, 84, 7.5, '#d9a15a') + C(20, 84, 6.3, '#fbf3e6') + [[-3, -2, '#ff3b5c', 20], [1, -3.5, '#3bd16f', -30], [3.5, .5, '#4aa8ff', 60], [-1, 2.8, '#ffd23f', 10], [-4, 1.5, '#b06bff', -50], [2, 3, '#ff3b5c', 80], [0, -.4, '#3bd16f', 40]].map(([dx, dy, c, a]) => `<rect x="${20 + dx - .9}" y="${84 + dy - .3}" width="1.8" height=".6" rx=".2" fill="${c}" transform="rotate(${a} ${20 + dx} ${84 + dy})"/>`).join('') + '</g>' + C(25.6, 78.6, .5, '#e0b070') + C(26.9, 81.2, .45, '#e0b070') + P('M15 92 Q14 87 18 86.5 L27 86 Q30 86.5 29.5 90 L28 97 L17 97Z', '#6e3812') + `<path d="M18 87 v-2.6 M21 86.6 v-3 M24 86.5 v-2.8 M27 86.6 v-2.2" stroke="#6e3812" stroke-width="2.2" stroke-linecap="round"/>` + `<path d="M16 92 Q22 90 29 91" stroke="#fffaf0" stroke-width=".7" fill="none"/>`;
    }
    s += E(76.5, 94, 3.4, 3, x ? '#6e3812' : '#0c0c0e') + saber(77, 95, 90, 20, '#ff2a2a', x) + E(77.5, 92.5, 3, 2.4, x ? '#7a4216' : '#141417');
    return s;
  };
  out.vader = vader(false); out.vader_x = vader(true);

  // ===================== MANDALORIAN =====================
  const mando = (x) => {
    const G = x ? { h1: '#ff5a5a', h2: '#9a0f1c', cloak: '#b3121f', cloakD: '#6e0a12', plate1: '#4ad46a', plate2: '#16692f', under: '#1f4a2a', visor: '#0e0f11' }
      : { h1: '#eef2f6', h2: '#8a939e', cloak: '#6b5034', cloakD: '#3a2a1c', plate1: '#e8edf2', plate2: '#8a939e', under: '#3a332c', visor: '#0e0f11' };
    const [hg, hgd] = LG([[0, G.h1], [.6, G.h2], [1, G.h2]], 0, 0, 1, .5);
    const [pg, pgd] = LG([[0, G.plate1], [1, G.plate2]], 0, 0, 1, 1);
    const [cg, cgd] = LG([[0, G.cloak], [1, G.cloakD]], 0, 0, 1, 0);
    let s = hgd + pgd + cgd;
    if (x) {
      const [sky, skd] = LG([[0, '#0b1636'], [1, '#2a4a7e']]);
      s += skd + R(0, 0, 100, 100, sky) + C(20, 18, 7, '#f4f8ff', 'opacity=".9"') + C(17.5, 16.5, 7, '#0b1636', 'opacity=".25"');
      // a proper tree on the right with lights on its branches
      const tr = (cx, top, h) => { const t = [[0, .38, .26], [.22, .66, .38], [.46, .95, .5]]; return t.map(([a, b, w]) => P(`M${cx} ${top + a * h} L${cx + w * h} ${top + b * h} L${cx - w * h} ${top + b * h}Z`, ['#1f7a3e', '#1a6a35', '#155a2c'][t.indexOf(t.find((q) => q[0] === a))])).join('') + R(cx - 2, top + .95 * h, 4, h * .08, '#5b3418') + P(`M${cx} ${top - 4} l1.3 2.6 2.8 .3 -2.1 1.8 .7 2.8 -2.7 -1.5 -2.7 1.5 .7 -2.8 -2.1 -1.8 2.8 -.3z`, '#ffd23f'); };
      s += tr(86, 26, 40) + bulbs([[80, 41], [86, 43], [92, 41]], 1) + bulbs([[77, 53], [83, 55.5], [89, 55.5], [95, 53]], 1) + bulbs([[73, 64], [80, 66.5], [87, 66.8], [94, 66.5], [100, 64]], 1);
      s += P('M0 78 Q25 70 50 76 T100 74 V100 H0Z', '#dfeaf6') + snow(36, 11);
    } else s += SCENES.desert();
    // rifle (kept on both)
    s += L(10, 100, 28, 28, '#4a3a2a', 3) + L(10, 100, 28, 28, '#8a8f96', 1.1) + R(25.5, 26, 5, 3, '#3a3d42', 'transform="rotate(-76 28 28)"');
    // body: cloak, chest plate, pauldron, strap
    s += P('M0 100 C2 82 14 70 32 66 L68 66 C86 70 98 82 100 100Z', cg) + shade('M50 66 L68 66 C86 70 98 82 100 100 L58 100Z', .2)
      + P('M35 68 L65 68 L63 98 L37 98Z', G.under) + P('M37 70 L49 70 L48.5 84 L38 86Z', pg) + P('M63 70 L51 70 L51.5 84 L62 86Z', pg) + hl('M37 70 L49 70 L48.8 72 L37.2 72Z', .3)
      + P('M62 66 C76 65 90 72 95 86 L76 90 C72 80 68 74 60 71Z', pg) + shade('M68 72 C76 72 86 78 90 86 L77 89Z', .18) + hl('M64 66.6 C74 66 84 70 90 76 L86 76 C80 72 72 69 64 69Z', .3)
      + P('M30 72 L36 69 L70 100 L62 100Z', x ? '#f6f3ee' : '#4a3626') + (x ? '' : [0, 1, 2, 3].map((i) => R(40 + i * 6, 76 + i * 6, 3, 2, '#c8a86a', `transform="rotate(42 ${41 + i * 6} ${77 + i * 6})"`)).join(''));
    if (x) s += P('M2 92 C6 78 18 70 32 67.5 L68 67.5 C82 70 94 78 98 92 L98 97 C94 82 82 74 68 72.5 L32 72.5 C18 74 6 82 2 97Z', '#f6f3ee') + hl('M10 84 C16 76 24 72 32 70 L34 71 C26 73 18 77 12 85Z', .5);
    // neck + cowl
    s += R(42, 56, 16, 14, G.under) + shade('M50 56 H58 V70 H50Z', .2) + P('M38 64 Q50 70 62 64 L64 70 Q50 75 36 70Z', x ? '#1f7a3e' : '#4a3828');
    if (x) s += P('M56 70 L60 90 L66.5 88 L62.5 69Z', '#18692f') + [0, 1, 2].map((i) => R(58 + i * 1.2, 75 + i * 4.6, 5.4, 1.1, '#e8252f', `transform="rotate(-12 ${58 + i * 1.2} ${75 + i * 4.6})"`)).join('');
    // helmet
    const helm = 'M33.5 44 C33.5 26 41 18.5 50 18.5 C59 18.5 66.5 26 66.5 44 L66.5 58 C66.5 61 64 63 61 63 L39 63 C36 63 33.5 61 33.5 58Z';
    s += P(helm, hg) + hl('M37 30 C39.5 23 45 20 50 19.8 L50 23 C46 23.5 41.5 26 39.5 32Z', .45) + shade('M58 22 C63 25 66.5 32 66.5 44 L66.5 58 C66.5 61 64 63 61 63 L56 63 L58 40Z', .12)
      + P('M37.2 38 L62.8 38 L62.8 42.8 L53.4 42.8 L53.4 58.5 L46.6 58.5 L46.6 42.8 L37.2 42.8Z', G.visor)
      + (x ? `<path d="M36.2 37 L63.8 37 L63.8 43.8 L54.4 43.8 L54.4 59.5 L45.6 59.5 L45.6 43.8 L36.2 43.8Z" stroke="#4ad46a" stroke-width="1" fill="none"/>` : '')
      + hl('M38 38.6 H61 V39.4 H38Z', .2) + L(39.5, 50, 44, 59, x ? '#ffb0b0' : '#6a727a', .8) + L(60.5, 50, 56, 59, x ? '#ffb0b0' : '#6a727a', .8)
      + P('M34 49 L37 47 L37 58 L34 58Z', x ? '#16692f' : '#9aa3ad') + P('M66 49 L63 47 L63 58 L66 58Z', x ? '#16692f' : '#9aa3ad') + C(64.5, 34, 1.4, x ? '#16692f' : '#7a838d');
    if (x) s += santaHat(50, 24, 30, -8);
    return s;
  };
  out.din_djarin = mando(false); out.din_djarin_x = mando(true);

  // ===================== STORMTROOPER =====================
  const trooper = (x) => {
    let s = '';
    if (x) { s += R(0, 0, 100, 100, '#23262d') + R(0, 0, 14, 100, '#2e323a') + R(86, 0, 14, 100, '#2e323a') + R(17, 0, 28, 64, '#b3121f') + R(55, 0, 28, 64, '#1a7a3c') + P('M17 64 L31 58 L45 64Z', '#23262d') + P('M55 64 L69 58 L83 64Z', '#23262d')
      + C(31, 22, 7, '#fff', 'opacity=".15"') + C(69, 22, 7, '#fff', 'opacity=".15"') + `<path d="M0 6 Q25 16 50 6 T100 6" stroke="#1a6a35" stroke-width="3.5" fill="none"/>` + bulbs(along('M0 7 Q25 17 50 7 T100 7', 11), 1.1, '#0e3a1c') + snow(26, 17); }
    else s += Art.kit.SCENES.imperial();
    const W = '#f6f7f8', WS = '#d4d9df';
    // body glove + armour
    s += P('M0 100 C2 82 14 70 32 66 L68 66 C86 70 98 82 100 100Z', '#0c0d10')
      + P('M2 100 C4 86 12 77 26 73.5 L34 100Z', W) + P('M98 100 C96 86 88 77 74 73.5 L66 100Z', W) + shade('M98 100 C96 86 88 77 74 73.5 L70 86Z', .08)
      + C(20, 80, 7.5, W) + C(80, 80, 7.5, W) + hl('M14 76 Q18 72.5 23 73 L22 75 Q18 75 15.5 78Z', .6) + shade('M80 72.5 A7.5 7.5 0 0 1 80 87.5Z', .08)
      + P('M34.5 70.5 L65.5 70.5 L63 88 L37 88Z', W) + shade('M50 70.5 L65.5 70.5 L63 88 L50 88Z', .07) + L(50, 71.5, 50, 87, '#9aa1ab', .9) + L(37.5, 79, 62.5, 79, '#9aa1ab', .7)
      + R(41, 74, 7, 3, '#5a6474', 'rx=".6"') + R(52, 74, 7, 3, '#5a6474', 'rx=".6"') + R(36, 90, 28, 10, W) + L(36, 93, 64, 93, '#9aa1ab', .7) + [42, 48, 54].map((xx) => R(xx, 95, 4, 3, '#2a2d33', 'rx=".5"')).join('');
    // neck (black body glove with ribs)
    s += R(42.5, 60, 15, 12, '#0c0d10') + [63, 65.5, 68].map((y) => L(43.5, y, 56.5, y, '#2c2f36', .7)).join('');
    if (x) { s += P('M41 62.5 Q50 66 59 62.5 L60 70.5 Q50 74.5 40 70.5Z', 'url(#xsc)') + shade('M41 66.5 Q50 70 59 66.5 L60 70.5 Q50 74.5 40 70.5Z', .12) + E(56.5, 71, 3, 2.4, 'url(#xsc)') + P('M55 72 L58 88 L63.5 86.5 L59 71Z', 'url(#xsc)') + P('M57.5 72 L64 84 L68.5 81 L60 71Z', 'url(#xsc)') + [0, 1, 2].map((i) => R(58.4 + i * 1.6, 87.6 + (i % 2) * .5, .9, 3, '#f6f3ee')).join('')
        + `<path d="M35 88.5 H65" stroke="#c8102e" stroke-width="1.6"/><path d="M35 90.2 H65" stroke="#1f8a45" stroke-width="1"/>` + P('M40 75 q-3 -3.2 -5.5 -.8 q2.4 2.2 5.5 .8z', '#1f7a3e') + P('M40 75 q-.6 -4 2.6 -5 q.6 3 -2.6 5z', '#1a6a35') + C(40.6, 75.6, 1, '#e8252f') + C(39.3, 76.4, .9, '#e8252f')
      + `<defs><pattern id="xsc" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)"><rect width="5" height="5" fill="#f6f3ee"/><rect width="2.5" height="5" fill="#d8232f"/></pattern></defs>`; }
    // helmet (classic shape, sits on the neck)
    s += `<g transform="translate(5 -3.5) scale(.9)"><g stroke="#0c0d10" stroke-width="1.5" stroke-linejoin="round">${P('M31.5 43 C30.5 24 39.5 16 50 16 C60.5 16 69.5 24 68.5 43 L72 60 C68 69 59 73 50 73 C41 73 32 69 28 60Z', '#ffffff')}</g>`
      + shade('M50 16 C60.5 16 69.5 24 68.5 43 L72 60 C68 69 59 73 50 73Z', .07) + hl('M36 28 C39 21 45 18 50 17.5 L50 21 C45 21.5 40 24 38 30Z', .9)
      + P('M33 33 Q50 27 67 33 L67 37 Q50 31 33 37Z', '#9aa6b8') + L(50, 17, 50, 29, '#c8ced6', 1.6)
      + P('M34.5 39 Q41.5 36.5 48 39.5 L47 47 Q41 52.5 35 46Z', '#07080a') + P('M65.5 39 Q58.5 36.5 52 39.5 L53 47 Q59 52.5 65 46Z', '#07080a')
      + P('M37 40.5 Q41 39.3 44.5 40 L43.5 41.6 Q40.5 41.2 37.5 42Z', '#5a6474') + P('M63 40.5 Q59 39.3 55.5 40 L56.5 41.6 Q59.5 41.2 62.5 42Z', '#5a6474')
      + P('M47.8 40 L52.2 40 L53.4 54.5 L46.6 54.5Z', '#f4f5f6', 'stroke="#b8bec6" stroke-width=".6"')
      + P('M37 50 L39.5 50 L38.5 60 L36 60Z', '#5a6474') + P('M63 50 L60.5 50 L61.5 60 L64 60Z', '#5a6474')
      + P('M40.5 57 Q50 52 59.5 57 L58 64.5 Q50 61 42 64.5Z', '#1c1f24') + [43.5, 46.3, 49.1, 51.9, 54.7, 57.3].map((xx) => L(xx, 57.2, xx, 62.2, '#c8ced6', .8)).join('')
      + R(37.4, 62, 3.2, 8, '#2a2d33', 'rx="1.4"') + R(59.4, 62, 3.2, 8, '#2a2d33', 'rx="1.4"') + P('M44 67 L56 67 L54 71 L46 71Z', '#e6e9ec')
      + C(30.6, 51, 3.6, '#f1f2f4', 'stroke="#0c0d10" stroke-width="1"') + C(30.6, 51, 1.8, '#5a6474') + C(69.4, 51, 3.6, '#f1f2f4', 'stroke="#0c0d10" stroke-width="1"') + C(69.4, 51, 1.8, '#5a6474') + '</g>';
    // E-11 held across the body by both hands
    s += `<g transform="translate(30 92) rotate(-14)">${R(0, -3, 44, 6, '#141518', 'rx="1.5"')}${R(6, -6.2, 16, 3.2, '#2a2c31', 'rx=".8"')}${R(9, -7.4, 8, 1.4, '#3a3d44')}${R(40, -1.6, 13, 3.2, '#141518')}${R(20, 3, 5, 8, '#141518', 'rx="1"')}${[30, 33, 36].map((xx) => C(xx, 0, .9, '#3a3d44')).join('')}${hl('M0 -3 H44 V-2 H0Z', .15)}</g>`
      + E(51.5, 84.2, 3.4, 2.8, '#0c0d10') + E(33.2, 90.6, 3.2, 2.6, '#0c0d10');
    if (x) s += santaHat(50, 18.5, 37, -7) + C(50, 50, 46, '#fff3c8', 'opacity=".06"');
    return s;
  };
  out.stormtrooper = trooper(false); out.stormtrooper_x = trooper(true);

  // ===================== YODA =====================
  const yoda = (x) => {
    let s = '';
    const skin = '#8db25a', skinD = '#6d8f40';
    const [hg, hgd] = RG([[0, '#a6c872'], [.7, skin], [1, '#7a9c4c']], .42, .38, .6);
    if (x) { const [sky, skd] = LG([[0, '#081430'], [1, '#22406e']]); s += skd + R(0, 0, 100, 100, sky) + C(86, 14, 5.5, '#f4f8ff', 'opacity=".9"')
      + [[9, 66, 15, 12, '#3a2a48'], [91, 64, 15, 14, '#2a3448']].map(([hx, hy, w, h, wall]) => R(hx - w / 2, hy, w, h, wall) + shade(`M${hx} ${hy} H${hx + w / 2} V${hy + h} H${hx}Z`, .18)
        + P(`M${hx - w / 2 - 1.6} ${hy + .5} L${hx} ${hy - w * .42} L${hx + w / 2 + 1.6} ${hy + .5}Z`, '#5a3a3a') + P(`M${hx - w / 2 - 2} ${hy + 1} L${hx} ${hy - w * .42 - 1} L${hx + w / 2 + 2} ${hy + 1} L${hx + w / 2 + 1} ${hy + 2.2} Q${hx} ${hy - w * .3} ${hx - w / 2 - 1} ${hy + 2.2}Z`, '#eef4fb')
        + R(hx - w * .32, hy + 3.5, 4, 4, '#ffcf5a', 'class="nz-win"') + `<path d="M${hx - w * .32 + 2} ${hy + 3.5} v4 M${hx - w * .32} ${hy + 5.5} h4" stroke="${wall}" stroke-width=".6"/>`
        + R(hx + w * .08, hy + h - 6.5, 3.6, 6.5, '#5a3418', 'rx=".6"') + C(hx + w * .08 + 2.8, hy + h - 3.2, .35, '#ffd23f') + `<circle cx="${hx + w * .08 + 1.8}" cy="${hy + h - 8.2}" r="1.6" fill="none" stroke="#1f7a3e" stroke-width=".9"/>`
        + R(hx + w * .2, hy - w * .42, 2.6, 5, '#4a3a5a') + `<path d="M${hx + w * .2 + 1.3} ${hy - w * .42} q-1.4 -2.4 .6 -4.4 t0 -4" stroke="#cfd8e6" stroke-width="1.2" fill="none" opacity=".45" class="nz-smoke"/>`).join('')
      + P('M0 76 Q30 70 60 74 T100 72 V100 H0Z', '#dfeaf6') + snow(40, 19); }
    else { const [ds, dsd] = LG([[0, '#16281c'], [.6, '#2a4030'], [1, '#3a5040']]); s += dsd + R(0, 0, 100, 100, ds)
      + [[8, 6, '#1a2a1c'], [24, 4, '#223426'], [78, 5, '#1a2a1c'], [93, 7, '#223426']].map(([tx, tw, tc]) => P(`M${tx - tw} 100 C${tx - tw} 70 ${tx - tw * 1.6} 40 ${tx - tw * .4} 0 L${tx + tw * .6} 0 C${tx + tw * 1.4} 40 ${tx + tw} 70 ${tx + tw} 100Z`, tc)).join('')
      + `<path d="M2 20 Q8 30 6 42 M14 14 Q18 26 15 38 M84 18 Q80 30 83 40 M96 12 Q92 26 95 36" stroke="#4a6a3a" stroke-width="1.2" fill="none" opacity=".7"/>`
      // Yoda's hut on the left with a warm window and smoke
      + E(18, 66, 13, 9, '#5a5a3a') + E(18, 63, 11, 7.5, '#6a6a48') + C(14, 64, 2.4, '#ffcf5a', 'opacity=".9"') + C(14, 64, 4, '#ffcf5a', 'opacity=".2"') + R(21, 54, 3, 5, '#4a4a30') + `<path d="M22.5 54 q-2 -4 1 -7 t0 -7" stroke="#c8d8c0" stroke-width="1.1" fill="none" opacity=".35"/>`
      // roots, water, mist and fireflies
      + P('M0 74 Q30 68 60 72 T100 70 V100 H0Z', '#1e3428') + P('M0 82 Q50 76 100 82 V100 H0Z', '#2a4a3a', 'opacity=".8"') + `<path d="M70 72 q6 -6 12 0 M84 74 q5 -4 10 1 M4 76 q6 -5 12 0" stroke="#3a2a1a" stroke-width="2" fill="none"/>`
      + E(50, 74, 60, 5, '#c8dcc8', 'opacity=".12"') + E(30, 58, 40, 4, '#c8dcc8', 'opacity=".08"')
      + [[34, 30], [66, 24], [80, 50], [12, 44], [58, 56], [90, 30]].map(([fx, fy]) => C(fx, fy, 1.6, '#d8ff8a', 'opacity=".25"') + C(fx, fy, .6, '#eaffb0')).join(''); }
    s += hgd;
    // robe body and collar
    const robe = x ? '#c8202c' : '#bfae8a', robeD = x ? '#8e0e18' : '#9a8a68';
    if (x) s += P('M12 79 L88 79 L84 83 L16 83Z', '#1a0a06');
    s += P('M18 100 C20 84 30 71 40 67.5 L60 67.5 C70 71 80 84 82 100Z', robe) + shade('M50 67.5 L60 67.5 C70 71 80 84 82 100 L56 100Z', .2) + (x ? '' : `<path d="M26 82 Q30 92 28 100 M74 82 Q70 92 72 100" stroke="#9a8a68" stroke-width=".9" fill="none"/>`)
      + P('M36 68 L50 86 L64 68 L59 67.5 L50 79 L41 67.5Z', robeD) + (x ? P('M33 70 Q42 66.8 50 66.8 Q58 66.8 67 70 L68 74.2 Q58 71.2 50 71.2 Q42 71.2 32 74.2Z', '#f6f3ee') + P('M47.5 72 L50 99 L52.5 72Z', '#f6f3ee') : P('M33 71 Q50 64.5 67 71 L66 74 Q50 68.5 34 74Z', '#a8977a'));
    // neck
    s += P('M44 58 L56 58 L57 70 L43 70Z', skin) + shade('M44 62 L56 62 L57 70 L43 70Z', .25);
    // ears + head
    s += P('M37 47 L6 36 Q10 47 37 56Z', skin) + P('M63 47 L94 36 Q90 47 63 56Z', skin) + P('M33 48 L13 40.5 Q17 47 34 52.5Z', '#b37a74', 'opacity=".45"') + P('M67 48 L87 40.5 Q83 47 66 52.5Z', '#b37a74', 'opacity=".45"')
      + shade('M6 36 Q10 47 37 56 L37 52Z', .12) + shade('M94 36 Q90 47 63 56 L63 52Z', .12)
      + E(50, 50, 15.5, 13.5, hg) + shade('M34.5 50 Q35 63 50 63.5 Q40 59 38 49Z', .16)
      + E(43.5, 48, 3.5, 2.6, '#ece4c4') + E(56.5, 48, 3.5, 2.6, '#ece4c4') + C(43.8, 48, 1.7, '#5a3f1a') + C(56.2, 48, 1.7, '#5a3f1a') + C(43.9, 48, .8, '#1a1008') + C(56.3, 48, .8, '#1a1008') + C(44.5, 47.3, .5, '#fff') + C(56.9, 47.3, .5, '#fff')
      + `<path d="M39 44.5 Q43.5 42.4 47 44.8 M53 44.8 Q56.5 42.4 61 44.5 M41 40 Q50 37.5 59 40 M44 37.5 Q50 36 56 37.5 M38.5 51.5 Q41 53.5 44 53 M61.5 51.5 Q59 53.5 56 53" stroke="${skinD}" stroke-width=".85" fill="none"/>`
      + `<path d="M48.8 50 Q50 53.5 51.6 50.6" stroke="${skinD}" stroke-width=".9" fill="none"/><path d="M44 57 Q50 59.5 56 57" stroke="#4a6630" stroke-width="1.05" fill="none"/>`
      + (x ? '' : `<path d="M40 39 Q34 33 30 35 M42 38 Q38 31 35 30 M60 39 Q66 33 70 35 M58 38 Q62 31 65 30" stroke="#eeeeee" stroke-width=".7" fill="none" opacity=".85"/>`);
    if (!x) s += P('M63 90 Q61 84 66 83 L72 84 Q75 86 73 90Z', skin) + saber(68, 88, 80, 56, '#46e070');
    else {
      s += santaHat(50, 39.5, 31, -8);
      // sack over his shoulder, presents spilling from the top
      s += `<g transform="translate(-3 4)">` + gift(9, 44, 9, 8, '#4aa8ff', '#ffd23f') + gift(17, 41, 8, 8, '#e8252f', '#f6f3ee') + gift(11, 49, 10, 7, '#1f8a45', '#ffd23f')
        + P('M3 86 C-1 70 5 54 14 54.5 C18 56 23 56 27 54.5 C34 56 37 72 32 86Z', '#b5824a') + P('M8 56 C14 58.5 22 58.5 28 56', 'none', 'stroke="#7a5428" stroke-width="1.8" stroke-linecap="round"') + shade('M20 57 C30 60 34 72 32 86 L22 86Z', .15) + P('M9 66 Q14 74 12 84', 'none', 'stroke="#93652f" stroke-width=".8" opacity=".7"')
        + `<path d="M7 68 l2 1.6 M8.6 72 l2 1.6 M10 76 l2 1.6 M26 66 l-1.8 1.8 M28 71 l-1.8 1.8" stroke="#7a5428" stroke-width=".6"/>` + R(13, 70, 6, 6, '#9a6a34', 'rx=".6" transform="rotate(-8 16 73)"') + `<path d="M13.4 70.6 l5 5 M18.6 70.4 l-5 5.2" stroke="#7a5428" stroke-width=".5" opacity=".7"/>`
        + P('M12 56 Q17 59 24 56', 'none', 'stroke="#e8d8a8" stroke-width=".9" stroke-dasharray="1 .8"') + '</g>';
      // chimney he's climbing out of, hands on the rim
      const br = Array.from({ length: 4 }, (_, r) => `<path d="M10 ${88 + r * 3.2} H90" stroke="#6e2416" stroke-width=".5"/>` + Array.from({ length: 9 }, (_, k) => `<path d="M${12 + k * 10 + (r % 2) * 5} ${84.8 + r * 3.2} v3.2" stroke="#6e2416" stroke-width=".5"/>`).join('')).join('');
      s += P('M90 82 L97 77.5 L97 100 L90 100Z', '#7a2c1e') + `<path d="M90 87 L97 82.5 M90 92 L97 87.5 M90 97 L97 92.5" stroke="#5a1e14" stroke-width=".5"/>` + P('M88 80 L95 75.5 L99 77 L93 81.5Z', '#eef4fb') + R(10, 82, 80, 18, '#a8432f') + shade('M60 82 H90 V100 H60Z', .15) + br + [[16, 86], [34, 92.5], [58, 89], [76, 95.6], [26, 95.6], [68, 86]].map(([a, b]) => R(a, b, 7, 2.6, '#c25a40', 'opacity=".6"')).join('') + R(10, 82, 80, 3, '#000', 'opacity=".18"') + R(7, 79.5, 86, 4.5, '#8e3424', 'rx="1"') + [14, 30, 46, 62, 78].map((a) => R(a, 79.5, 14, 4.5, '#7a2c1e', 'rx=".6" opacity=".55"')).join('') + P('M6 81 Q20 76 34 79 Q50 76 66 79 Q80 76 94 81 L94 82.5 H6Z', '#f4f8fd')
        + E(64, 79, 4, 2.8, skin) + `<path d="M62 78 v-1.2 M64 77.6 v-1.4 M66 78 v-1.2" stroke="${skinD}" stroke-width=".6"/>`
        + E(27, 78.6, 3.4, 2.8, skin) + `<path d="M25.4 77.6 v-1.2 M27.2 77.2 v-1.4 M29 77.6 v-1.2" stroke="${skinD}" stroke-width=".6"/>` + P('M27 76 Q25 70 21 66', 'none', 'stroke="#7a5428" stroke-width="1.2" stroke-linecap="round"');
    }
    return s;
  };
  out.yoda = yoda(false); out.yoda_x = yoda(true);

  const knit = (id, base, dot, accent) => `<defs><pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${base}"/><path d="M0 2 L2 0 L4 2 L6 0 L8 2" stroke="${dot}" stroke-width=".7" fill="none" opacity=".8"/><path d="M4 5.2 l.9 .9 -.9 .9 -.9 -.9z" fill="${accent || dot}"/><path d="M0 8 V0" stroke="#000" stroke-opacity=".06"/></pattern></defs>`;
  const flake = (x0, y0, r, c = '#f6f3ee') => `<g transform="translate(${x0} ${y0})">${[0, 60, 120].map((a) => `<line x1="${-r}" y1="0" x2="${r}" y2="0" stroke="${c}" stroke-width=".6" transform="rotate(${a})"/>`).join('')}${C(0, 0, r * .25, c)}</g>`;
  const zig = (x1, x2, y, c = '#e8252f', amp = 1.4) => { let d = `M${x1} ${y}`; for (let xx = x1 + 2.5, i = 0; xx <= x2; xx += 2.5, i++) d += ` L${xx} ${y + (i % 2 ? 0 : -amp)}`; return `<path d="${d}" stroke="${c}" stroke-width="1.1" fill="none"/>`; };
  const village = (seed, edges) => { const [sky, skd] = LG([[0, '#081430'], [1, '#22406e']]); return skd + R(0, 0, 100, 100, sky) + C(84, 16, 6, '#f4f8ff', 'opacity=".9"')
    + (edges ? [[6, 60, 11, 12], [94, 58, 11, 14]] : [[8, 62, 14, 12], [24, 58, 12, 16], [76, 60, 12, 14], [92, 57, 14, 18]]).map(([hx, hy, w, h]) => R(hx - w / 2, hy, w, h, '#2a2440') + P(`M${hx - w / 2 - 1} ${hy} L${hx} ${hy - w * .45} L${hx + w / 2 + 1} ${hy}Z`, '#e8f0fa') + R(hx - 2, hy + 4, 4, 4, '#ffcf5a', 'class="nz-win"') + R(hx + w / 4, hy - w * .4, 2.4, 5, '#3a3350') + `<path d="M${hx + w / 4 + 1.2} ${hy - w * .4} q-2 -4 1 -7 t0 -7" stroke="#cfd8e6" stroke-width="1.4" fill="none" opacity=".45" class="nz-smoke"/>`).join('')
    + P('M0 74 Q30 68 60 72 T100 70 V100 H0Z', '#dfeaf6') + snow(40, seed); };

  // ===================== C-3PO =====================
  const c3po = (x) => {
    const [gg, ggd] = LG([[0, '#fff0b0'], [.35, '#e8b84a'], [.75, '#c48a26'], [1, '#8a5a14']], 0, 0, 1, .6);
    const [hg, hgd] = RG([[0, '#fff4c8'], [.4, '#ecbf50'], [1, '#a8741c']], .38, .3, .7);
    let s;
    if (x) { const [wl, wld] = LG([[0, '#5a2228'], [1, '#341216']]);
      s = wld + R(0, 0, 100, 100, wl)
        // wallpaper: soft diamond pattern + wainscot
        + `<defs><pattern id="c3wp" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M4 0 L8 4 L4 8 L0 4Z" fill="#6a2a30" opacity=".55"/><circle cx="4" cy="4" r=".7" fill="#d8b070" opacity=".5"/></pattern></defs>` + R(0, 0, 100, 66, 'url(#c3wp)') + R(0, 62, 100, 14, '#3a1a14') + R(0, 62, 100, 1.4, '#c8a050') + [8, 24, 76, 92].map((a) => R(a - 6, 64.5, 12, 9, 'none', 'stroke="#5a2a20" stroke-width=".6"')).join('')
        // window: moonlit snowy hills and a pine, falling snow
        + R(66, 10, 26, 28, '#0c1a3a', 'rx="1"') + `<g clip-path="url(#c3w)">${C(85, 17, 3.2, '#f4f8ff')}${P('M66 32 Q74 27 82 31 T92 29 V38 H66Z', '#dfeaf6')}${P('M73 33 L76 24 L79 33Z', '#1a4a2e')}${P('M73.8 29 L76 22 L78.2 29Z', '#1f5a36')}${snow(18, 23)}</g><defs><clipPath id="c3w"><rect x="66" y="10" width="26" height="28"/></clipPath></defs>` + `<path d="M66 10 h26 v28 h-26z M79 10 v28 M66 24 h26" stroke="#d8c08a" stroke-width="1.3" fill="none"/>` + P('M64 38 H94 V40.5 H64Z', '#d8c08a') + P('M64 10 Q62 24 64 38 L61 38 Q59 24 61 9Z', '#8e1a22') + P('M94 10 Q96 24 94 38 L97 38 Q99 24 97 9Z', '#8e1a22')
        // fireplace: brick, mantel, wreath above, stockings, layered fire with logs and glow
        + R(2, 46, 32, 30, '#8e3424') + [50, 56, 62, 68, 74].map((y, r) => `<path d="M2 ${y} H34" stroke="#6e2416" stroke-width=".5"/>` + [0, 1, 2, 3].map((k) => `<path d="M${4 + k * 8 + (r % 2) * 4} ${y - 6} v6" stroke="#6e2416" stroke-width=".5"/>`).join('')).join('') + R(0, 43, 36, 4, '#5a3418') + R(0, 43, 36, 1, '#7a4a24')
        + R(9, 55, 18, 21, '#120604') + E(18, 74, 9, 3, '#ff8a2a', 'opacity=".25"') + R(11, 72, 14, 2.4, '#5a3418', 'rx="1" transform="rotate(-6 18 73)"') + R(11, 72.6, 14, 2.2, '#4a2a14', 'rx="1" transform="rotate(8 18 73)"')
        + `<g class="nz-fire">${P('M11 74 Q11.5 64 15 66 Q16 58 19 63 Q21 57 23 64 Q25.5 62 25 74Z', '#e8401a')}${P('M13 74 Q13.5 66 16 67.5 Q17.5 61 19.6 66 Q21.6 62 22.6 67.5 Q24 66 23.4 74Z', '#ff8a2a')}${P('M15.5 74 Q15.8 68.5 17.8 69.6 Q19 65 20.6 69.4 Q22 68.4 21.4 74Z', '#ffd24a')}</g>` + E(18, 60, 13, 12, '#ffb040', 'opacity=".08"')
        + `<g transform="translate(24 22)">${Array.from({ length: 16 }, (_, i2) => { const a2 = i2 / 16 * Math.PI * 2; const x2 = 10 * Math.cos(a2), y2 = 10 * Math.sin(a2); return `<ellipse cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" rx="3.6" ry="1.8" fill="${i2 % 2 ? '#1f7a3e' : '#2a9a4e'}" transform="rotate(${(a2 * 180 / Math.PI + 60).toFixed(0)} ${x2.toFixed(1)} ${y2.toFixed(1)})"/>`; }).join('')}${[0, 60, 120, 180, 240, 300].map((a2, i2) => C((10 * Math.cos(a2 * Math.PI / 180)).toFixed(1), (10 * Math.sin(a2 * Math.PI / 180)).toFixed(1), 1.3, i2 % 2 ? '#ffd23f' : '#e8252f')).join('')}${P('M-4 9 L0 6.4 L4 9 L2 15.6 L0 11 L-2 15.6Z', '#c8102e')}${P('M0 7.6 C-5 3 -9 6 -6 9 C-4 10.6 0 9 0 9 C0 9 4 10.6 6 9 C9 6 5 3 0 7.6Z', '#e8252f')}${C(0, 8.2, 1.4, '#a8101c')}</g>`
        + [[8, '#e8252f', '#f6f3ee'], [18, '#1f8a45', '#ffd23f'], [28, '#e8252f', '#f6f3ee']].map(([a2, c, t2]) => `<g transform="translate(${a2} 47)">${P('M-2.4 0 h4.8 v6.4 q0 2.4 2.6 2.4 h1 v3.2 h-5.6 q-2.8 0 -2.8 -2.8z', c)}${R(-2.8, -.6, 5.6, 2.4, t2, 'rx=".6"')}${P('M1.4 8.8 h2.6 v3 h-2.6z', t2)}${P('M-2.4 4 h4.8', 'none', `stroke="${t2}" stroke-width=".6" stroke-dasharray="1 .8"`)}</g>`).join('')
        // upright tree with lights, ornaments and a star
        + P('M89 34 L82 46 L96 46Z', '#1f7a3e') + P('M89 40 L80 54 L98 54Z', '#1a6a35') + P('M89 47 L78 63 L100 63Z', '#155a2c') + R(87.6, 63, 2.8, 4, '#5a3418') + gift(80, 66, 7, 6, '#e8252f', '#ffd23f') + gift(91, 67, 6, 5, '#4aa8ff', '#f6f3ee')
        + bulbs([[84, 45], [89, 46.4], [94, 45]], .75) + bulbs([[82.5, 53], [89, 54.6], [95.5, 53]], .75) + bulbs([[80.5, 61.5], [89, 63], [97.5, 61.5]], .75) + P('M89 30 l1 2 2.2 .2 -1.6 1.4 .5 2.1 -2.1 -1.2 -2.1 1.2 .5 -2.1 -1.6 -1.4 2.2 -.2z', '#ffd23f')
        + R(0, 76, 100, 24, '#4a2a1a') + [82, 88, 94].map((a2) => L(0, a2, 100, a2, '#3a1e12', .6)).join('') + E(50, 94, 34, 6, '#7a1a22', 'opacity=".55"'); }
    else s = Art.kit.SCENES.desert();
    s += ggd + hgd;
    const torso = 'M2 100 C4 84 16 74 32 70 L40 68 L60 68 L68 70 C84 74 96 84 98 100Z';
    if (!x) {
      const slim = 'M12 100 C14 86 22 76 34 72 L41 70 L59 70 L66 72 C78 76 86 86 88 100Z';
      s += P(slim, gg) + shade('M50 70 L59 70 L66 72 C78 76 86 86 88 100 L55 100Z', .15)
        + P('M24 77 C29 73 36 71.5 41 71.5 L39.5 80.5 C34 80.5 29 82.5 24.5 86Z', '#f0c45a') + P('M76 77 C71 73 64 71.5 59 71.5 L60.5 80.5 C66 80.5 71 82.5 75.5 86Z', '#d8a23a')
        + P('M38 71 L62 71 L60 84 L40 84Z', '#e8b84a') + hl('M37 70.5 L50 70.5 L50 72 L37.3 72Z', .4) + L(50, 70.5, 50, 84, '#a8801e', .8) + `<path d="M38 77 Q50 80 62 77" stroke="#a8801e" stroke-width=".7" fill="none"/>`
        + R(38, 85, 24, 15, '#5a4018') + [40, 43.5, 47, 50.5, 54, 57.5].map((xx, i) => `<path d="M${xx} 86 q2 6 0 14" stroke="${['#c43b2e', '#3b6fd6', '#e0b040', '#c43b2e', '#3b6fd6', '#7ad06a'][i]}" stroke-width="1" fill="none"/>`).join('') + R(38, 85, 24, 2, '#3a2a10');
    } else {
      s += knit('k3', '#2350a8', '#cfe0ff', '#f6f3ee');
      const torso2 = 'M12 100 C14 86 22 76 34 72 L41 70 L59 70 L66 72 C78 76 86 86 88 100Z';
      s += `<defs><clipPath id="c3t"><path d="${torso2}"/></clipPath></defs>` + P(torso2, 'url(#k3)') + shade('M50 70 L59 70 L66 72 C78 76 86 86 88 100 L55 100Z', .2)
        + P('M39.5 70.6 C44.5 68.2 55.5 68.2 60.5 70.6 L59.6 74.4 C54.6 72.4 45.4 72.4 40.4 74.4Z', '#f6f3ee') + [42, 45, 48, 51, 54, 57].map((xx) => L(xx, 70, xx, 73.6, '#d0d8e8', .45)).join('')
        + `<g clip-path="url(#c3t)">${zig(0, 100, 78, '#e8252f', 1.2)}${zig(0, 100, 98.6, '#e8252f', 1.2)}${[18, 82].map((xx) => flake(xx, 92, 2.2)).join('')}</g>`
        + R(21, 79.6, 58, 15.8, '#f6f3ee', 'rx="1.8"') + R(22.2, 80.8, 55.6, 13.4, '#c8102e', 'rx="1.3"')
        + `<text x="50" y="86.3" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="4.1" fill="#ffffff" textLength="44" lengthAdjust="spacingAndGlyphs">R2, I'M DOING YOU</text><text x="50" y="91.8" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="4.1" fill="#ffffff" textLength="44" lengthAdjust="spacingAndGlyphs">A HUGE FAVOR</text>`;
    }
    // neck with cables
    s += R(43.5, 56, 13, 14, '#7a5c20') + [59, 62, 65, 68].map((y) => L(43.5, y, 56.5, y, '#a8801e', .8)).join('') + L(46, 56, 46, 70, '#3a2a10', .9) + L(54, 56, 54, 70, '#3a2a10', .9);
    // head
    s += C(36.5, 42, 3.4, '#b8882a') + C(63.5, 42, 3.4, '#b8882a') + C(36.5, 42, 1.6, '#8a5a14') + C(63.5, 42, 1.6, '#8a5a14')
      + P('M37 40 C37 25 43 21 50 21 C57 21 63 25 63 40 L62 50 C60 56 56 59.5 50 59.5 C44 59.5 40 56 38 50Z', hg)
      + hl('M41 28 C44 23 50 22.5 50 22.5 L50 26 C46 26 43 28 42 31Z', .6) + `<path d="M38.6 36 Q50 33 61.4 36" stroke="#a8801e" stroke-width=".9" fill="none"/>`
      + `<g style="filter:drop-shadow(0 0 1px #ffcf4a)">${C(44.5, 42, 3.3, '#6a4a14')}${C(55.5, 42, 3.3, '#6a4a14')}${C(44.5, 42, 2.4, '#ffe9a0')}${C(55.5, 42, 2.4, '#ffe9a0')}${C(44.5, 42, 1.1, '#3a2a10')}${C(55.5, 42, 1.1, '#3a2a10')}${C(45, 41.4, .45, '#fff')}${C(56, 41.4, .45, '#fff')}</g>`
      + P('M49 45 L51 45 L51.4 50 L48.6 50Z', '#c48a26') + E(50, 52.8, 3, 1.1, '#3a2a10') + L(50, 22, 50, 33, '#c48a26', .7, 'opacity=".6"');
    return s;
  };
  out.c3po = c3po(false); out.c3po_x = c3po(true);

  // ===================== DARTH MAUL =====================
  // Classic pattern: black crown with a point down the brow, red brow bands, black masks round the
  // yellow eyes, red cheeks with one black stripe each, black mouth and chin with three red lines.
  const maul = (x) => {
    const [sk, skd] = RG([[0, '#e2483a'], [.6, '#b8281e'], [1, '#7a140e']], .42, .35, .65);
    let s = Art.kit.SCENES.generator() + skd + (x ? R(0, 0, 100, 100, '#2a1a10', 'opacity=".35"') : '');
    if (x) s += `<path d="M0 8 Q25 20 50 8 T100 8" stroke="#1a6a35" stroke-width="4" fill="none"/>${along('M0 9 Q25 21 50 9 T100 9', 9).map(([a2, b2], i) => `<line x1="${a2}" y1="${b2}" x2="${a2}" y2="${b2 + 5}" stroke="#d8c08a" stroke-width=".4"/>${C(a2, b2 + 7, 2.2, ['#e8252f', '#ffd23f', '#3bd16f', '#4aa8ff'][i % 4])}${C(a2 - .7, b2 + 6.3, .6, '#fff', 'opacity=".6"')}`).join('')}`
      + `<g transform="translate(14 40)">${C(0, 0, 8, 'none', 'stroke="#1f7a3e" stroke-width="4"')}${[0, 45, 90, 135, 180, 225, 270, 315].map((a2) => C((8 * Math.cos(a2 * Math.PI / 180)).toFixed(1), (8 * Math.sin(a2 * Math.PI / 180)).toFixed(1), 1, '#e8252f')).join('')}${P('M-3 7 L0 4 L3 7 L1 12 L0 8 L-1 12Z', '#c8102e')}</g>` + snow(26, 29)
      + `<defs><radialGradient id="mwl" cx=".5" cy=".1" r=".7"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".35"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient></defs>` + R(0, 0, 100, 60, 'url(#mwl)');
    // body: slimmer black robes, hood fallen behind the shoulders, tunic layers
    s += P('M30 69 Q50 60 70 69 L68 74 Q50 67 32 74Z', '#0c0c0e')
      + P('M12 100 C14 85 25 74 38 70.5 L62 70.5 C75 74 86 85 88 100Z', '#151517') + shade('M50 70.5 L62 70.5 C75 74 86 85 88 100 L56 100Z', .3)
      + P('M36 71 L50 92 L64 71 L59.5 70.5 L50 84 L40.5 70.5Z', '#0a0a0b') + P('M40.5 70.6 L50 84 L47 88 L37 72.5Z', '#222226') + P('M59.5 70.6 L50 84 L53 88 L63 72.5Z', '#222226')
      + `<path d="M26 80 Q28 92 25 100 M74 80 Q72 92 75 100" stroke="#000" stroke-width="1" opacity=".5" fill="none"/>` + R(34, 94, 32, 4, '#0a0a0b') + R(47, 93.4, 6, 5.2, '#3a3a40', 'rx=".8"');
    if (x) s += `<g transform="translate(57 75)">${P('M0 0 C-4 -3 -7 0 -4 2 C-2 3 0 1 0 0Z M0 0 C4 -3 7 0 4 2 C2 3 0 1 0 0Z', '#1f7a3e')}${C(-.8, 1.4, 1, '#e8252f')}${C(1, 1.8, 1, '#e8252f')}${C(-.6, 1, .3, '#fff', 'opacity=".6"')}</g>`;
    // neck: short, red with dark shading under the jaw
    s += P('M44.5 59 L55.5 59 L56.5 68.5 L43.5 68.5Z', '#b8281e') + shade('M44.5 59 L55.5 59 L56 64 Q50 66 44 64Z', .35) + P('M43.5 66 L46 59.6 L45 68.5Z M56.5 66 L54 59.6 L55 68.5Z', '#111', 'opacity=".7"');
    // head: broad brow, strong cheekbones, square chin (from the databank reference)
    const head = 'M37.6 41 C37.6 30.6 43 26.4 50 26.4 C57 26.4 62.4 30.6 62.4 41 L62 47.8 C61.6 52.8 59.4 56.4 56.6 59 L55 62.6 C53.4 64.2 46.6 64.2 45 62.6 L43.4 59 C40.6 56.4 38.4 52.8 38 47.8Z';
    const mid = x ? 'x' : '';
    s += P('M38 43.2 L35.6 40.6 L35.9 45.4 L37.9 47.2Z', '#a8241a') + P('M62 43.2 L64.4 40.6 L64.1 45.4 L62.1 47.2Z', '#a8241a') + P('M37.6 44 L36.4 42.6 L36.6 45.2Z M62.4 44 L63.6 42.6 L63.4 45.2Z', '#6a1410')
      + P(head, sk) + shade('M50 26.4 C57 26.4 62.4 30.6 62.4 41 L62 47.8 C61.6 52.8 59.4 56.4 56.6 59 L55 62.6 C53.4 64.2 50 64.4 50 64.4Z', .14)
      + `<defs><clipPath id="mh${mid}"><path d="${head}"/></clipPath></defs><g clip-path="url(#mh${mid})">`
      // forehead: zig-zag line across, a line down the middle to the nose
      + `<path d="M38 35.6 L41.6 31.6 L44 35 L47 30.4 L50 34.6 L53 30.4 L56 35 L58.4 31.6 L62 35.6" stroke="#111" stroke-width="1.7" fill="none" stroke-linejoin="miter"/>`
      + P('M49.1 34 L50.9 34 L51.2 41.6 L48.8 41.6Z', '#111')
      // thick black brows and eye band, angled down toward the nose
      + P('M37.8 40.4 Q43 38.2 48.4 41.6 L48.6 44 Q46.6 46.8 43.4 47 Q40.2 46.8 38.2 45Z', '#111') + P('M62.2 40.4 Q57 38.2 51.6 41.6 L51.4 44 Q53.4 46.8 56.6 47 Q59.8 46.8 61.8 45Z', '#111')
      // nose: black bridge tip and nostrils
      + P('M48.6 47 L51.4 47 L52.6 51.4 Q50 53 47.4 51.4Z', '#111')
      // cheek V lines from the eyes down to the mouth corners
      + `<path d="M39.6 47.6 L43.2 51.4 L41.8 54.6 M60.4 47.6 L56.8 51.4 L58.2 54.6 M44.8 49.6 L46.4 54.6 M55.2 49.6 L53.6 54.6" stroke="#111" stroke-width="1.15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
      // jaw sides fade to black, mouth, chin arch
      + P('M37.6 50 C38.6 54.6 41 58 43.4 59.4 L44.6 64 L37.6 64Z', '#111', 'opacity=".85"') + P('M62.4 50 C61.4 54.6 59 58 56.6 59.4 L55.4 64 L62.4 64Z', '#111', 'opacity=".85"')
      + P('M45.4 55.2 Q50 54 54.6 55.2 Q50 56.8 45.4 55.2Z', '#7a140e') + `<path d="M45.6 55.4 Q50 56.4 54.4 55.4" stroke="#3a0a08" stroke-width=".5" fill="none"/>`
      + `<path d="M46.2 63.6 L46.4 59.8 Q50 56.8 53.6 59.8 L53.8 63.6" stroke="#111" stroke-width="1.3" fill="none" stroke-linejoin="round"/>` + `<path d="M48.6 57.2 V58.6 M51.4 57.2 V58.6" stroke="#111" stroke-width=".9"/>`
      + '</g>'
      // eyes: yellow, red rim, small dark pupil, set in the black band
      + E(43.4, 43.6, 2.3, 1.35, '#ffd23f') + E(56.6, 43.6, 2.3, 1.35, '#ffd23f') + E(43.4, 43.6, 2.3, 1.35, 'none', 'stroke="#d8401e" stroke-width=".4"') + E(56.6, 43.6, 2.3, 1.35, 'none', 'stroke="#d8401e" stroke-width=".4"')
      + C(43.6, 43.6, .7, '#1a0000') + C(56.4, 43.6, .7, '#1a0000') + C(44, 43.2, .28, '#fff') + C(56.8, 43.2, .28, '#fff')
      + hl('M41 33 C43 29.4 46.6 28 50 28 L50 30.2 C47 30.2 44.4 31.4 42.6 33.8Z', .14);
    // horns: crown of horns, longer at the front
    s += [[40.4, 32.6, 4], [43, 29.8, 5.4], [46.4, 28, 6], [50, 27.4, 6.4], [53.6, 28, 6], [57, 29.8, 5.4], [59.6, 32.6, 4], [44.8, 32.4, 3.2], [55.2, 32.4, 3.2]].map(([hx, hy, h]) => P(`M${hx - 1.25} ${hy} L${hx} ${hy - h} L${hx + 1.25} ${hy}Z`, '#ece0bc') + P(`M${hx} ${hy - h} L${hx + 1.25} ${hy} L${hx} ${hy}Z`, '#c8b88e')).join('');
    // double saber
    const cane = (d) => `<path d="${d}" stroke="#fff" stroke-width="6.4" fill="none" stroke-linecap="round" opacity=".35" style="filter:blur(1.2px)"/><path d="${d}" stroke="#c8ccd4" stroke-width="5" fill="none" stroke-linecap="round"/><path d="${d}" stroke="url(#mcp)" stroke-width="4.2" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#fff" stroke-width=".8" fill="none" opacity=".55" transform="translate(-1 0)"/>`;
    s += x ? '<defs><pattern id="mcp" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="5" height="5" fill="#fff8ef"/><rect width="2.2" height="5" fill="#e8252f"/><rect x="2.2" width=".5" height="5" fill="#3bd16f"/></pattern></defs>' + cane('M82 60 V17 Q82 9.6 75.6 9.6 Q69.4 9.6 69.4 15.6') + cane('M82 72 V97') : saber(82, 62, 82, 10, '#ff2a2a') + saber(82, 70, 82, 100, '#ff2a2a');
    s += R(80.4, 58, 3.2, 14, '#2a2a2e', 'rx="1"') + [61, 64, 67].map((y) => L(80.4, y, 83.6, y, '#6a6d74', .5)).join('') + E(82, 66, 3.2, 2.4, '#0c0c0e');
    return s;
  };
  out.darth_maul = maul(false); out.darth_maul_x = maul(true);

  const reg = { vader: () => vader(false), din_djarin: () => mando(false), stormtrooper: () => trooper(false), yoda: () => yoda(false), c3po: () => c3po(false), darth_maul: () => maul(false) };
  for (const id in reg) Art.addArt('char', id, reg[id]);
})(window);
