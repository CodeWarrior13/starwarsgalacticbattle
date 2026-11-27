// Card art with proper necks and shoulders (Darth Vader, the Mandalorian, the
// Stormtrooper, Yoda): heads sit on real necks instead of floating over the body.
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
    s += P('M10 100 C14 84 24 74 36 70 L64 70 C76 74 86 84 90 100Z', bg);
    // gorget / shoulder armour with trim
    s += P('M27 70 C33 63.5 42 61.5 50 61.5 C58 61.5 67 63.5 73 70 L77 78 C68 72.5 59 71 50 71 C41 71 32 72.5 23 78Z', x ? '#6e3812' : '#1a1b20') + hl('M27 70 C33 63.5 42 61.5 50 61.5 L50 64 C42 64 34 66 29 71Z', .12)
      + `<path d="M25.5 75.5 C33 70 41 68.8 50 68.8 C59 68.8 67 70 74.5 75.5" stroke="${G.trim}" stroke-width="${x ? 1.1 : .8}" fill="none" ${x ? 'stroke-dasharray="1.6 1"' : ''}/>`;
    // chest plate + chest box
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
        + [[40, 22], [60, 22], [34, 52], [66, 52]].map(([a, b]) => C(a, b, .9, '#fffaf0')).join('');
      // cookie in his left hand
      s += E(22, 88, 6, 4.5, '#3a2a1e') + C(20, 84, 7.5, '#d9a15a') + C(20, 84, 6.3, '#fbf3e6') + [[-3, -2, '#ff3b5c', 20], [1, -3.5, '#3bd16f', -30], [3.5, .5, '#4aa8ff', 60], [-1, 2.8, '#ffd23f', 10], [-4, 1.5, '#b06bff', -50], [2, 3, '#ff3b5c', 80], [0, -.4, '#3bd16f', 40]].map(([dx, dy, c, a]) => `<rect x="${20 + dx - .9}" y="${84 + dy - .3}" width="1.8" height=".6" rx=".2" fill="${c}" transform="rotate(${a} ${20 + dx} ${84 + dy})"/>`).join('') + P('M15 92 Q14 87 18 86.5 L27 86 Q30 86.5 29.5 90 L28 97 L17 97Z', '#6e3812') + `<path d="M18 87 v-2.6 M21 86.6 v-3 M24 86.5 v-2.8 M27 86.6 v-2.2" stroke="#6e3812" stroke-width="2.2" stroke-linecap="round"/>` + `<path d="M16 92 Q22 90 29 91" stroke="#fffaf0" stroke-width=".7" fill="none"/>`;
    }
    s += E(76.5, 94, 3.4, 3, x ? '#6e3812' : '#0c0c0e') + saber(77, 95, 90, 20, '#ff2a2a', x) + E(77.5, 92.5, 3, 2.4, x ? '#7a4216' : '#141417');
    return s;
  };

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
    if (x) { s += P('M34 63 Q50 72 66 63 L68 70 Q50 79 32 70Z', 'url(#xsc)') + P('M57 71 L61 91 L68 89 L63.5 69.5Z', 'url(#xsc)') + [0, 1, 2, 3].map((i) => R(61 + i * 1.7, 90.4 + (i % 2), 1, 3.6, '#f6f3ee')).join('')
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
    if (x) s += `<g>${gift(6, 60, 20, 15, '#1f8a45', '#e8252f')}</g>` + E(16, 76, 5.5, 2.8, '#0c0d10') + C(50, 50, 46, '#fff3c8', 'opacity=".06"');
    return s;
  };

  // ===================== YODA =====================
  const yoda = (x) => {
    let s = '';
    const skin = '#8db25a', skinD = '#6d8f40';
    const [hg, hgd] = RG([[0, '#a6c872'], [.7, skin], [1, '#7a9c4c']], .42, .38, .6);
    if (x) { const [sky, skd] = LG([[0, '#081430'], [1, '#22406e']]); s += skd + R(0, 0, 100, 100, sky)
      + [[8, 64, 14, 12], [26, 60, 12, 16], [74, 62, 12, 14], [88, 58, 14, 18]].map(([hx, hy, w, h]) => R(hx - w / 2, hy, w, h, '#2a2440') + P(`M${hx - w / 2 - 1} ${hy} L${hx} ${hy - w * .45} L${hx + w / 2 + 1} ${hy}Z`, '#e8f0fa') + R(hx - 2, hy + 4, 4, 4, '#ffcf5a', 'class="nz-win"') + R(hx + w / 4, hy - w * .4, 2.4, 5, '#3a3350')).join('')
      + `<path d="M28.5 46 q-2 -5 1 -9 t0 -9" stroke="#cfd8e6" stroke-width="1.6" fill="none" opacity=".5"/><path d="M90.5 42 q-2 -5 1 -9 t0 -9" stroke="#cfd8e6" stroke-width="1.6" fill="none" opacity=".5"/>` + P('M0 76 Q30 70 60 74 T100 72 V100 H0Z', '#dfeaf6') + snow(40, 19); }
    else s += Art.kit.SCENES.swamp();
    s += hgd;
    // robe body and collar
    const robe = x ? '#c8202c' : '#bfae8a', robeD = x ? '#8e0e18' : '#9a8a68';
    s += P('M8 100 C10 82 24 70 38 67 L62 67 C76 70 90 82 92 100Z', robe) + shade('M50 67 L62 67 C76 70 90 82 92 100 L56 100Z', .18)
      + P('M36 68 L50 86 L64 68 L59 67.5 L50 79 L41 67.5Z', robeD) + (x ? P('M30 70 Q40 66.5 50 66.5 Q60 66.5 70 70 L71 74.5 Q60 71 50 71 Q40 71 29 74.5Z', '#f6f3ee') + P('M47.5 72 L50 99 L52.5 72Z', '#f6f3ee') : P('M30 71 Q50 64 70 71 L68 74 Q50 68 32 74Z', '#a8977a'));
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
    if (!x) s += P('M66 92 Q64 86 69 85 L76 86 Q79 88 77 92Z', skin) + saber(71, 90, 83, 58, '#46e070');
    else {
      s += santaHat(50, 39.5, 31, -8);
      // sack over his shoulder, presents spilling from the top
      s += gift(9, 44, 9, 8, '#4aa8ff', '#ffd23f') + gift(17, 41, 8, 8, '#e8252f', '#f6f3ee') + gift(11, 49, 10, 7, '#1f8a45', '#ffd23f')
        + P('M3 86 C-1 70 5 54 14 54.5 C18 56 23 56 27 54.5 C34 56 37 72 32 86Z', '#b5824a') + P('M8 56 C14 58.5 22 58.5 28 56', 'none', 'stroke="#7a5428" stroke-width="1.8" stroke-linecap="round"') + shade('M20 57 C30 60 34 72 32 86 L22 86Z', .15) + P('M9 66 Q14 74 12 84', 'none', 'stroke="#93652f" stroke-width=".8" opacity=".7"')
        + P('M24 59 Q30 63 33 70 L37 69 Q35 61 27 57Z', robe) + E(25, 58, 3.4, 2.8, skin);
      // chimney he's climbing out of, hands on the rim
      const br = Array.from({ length: 4 }, (_, r) => `<path d="M10 ${88 + r * 3.2} H90" stroke="#6e2416" stroke-width=".5"/>` + Array.from({ length: 9 }, (_, k) => `<path d="M${12 + k * 10 + (r % 2) * 5} ${84.8 + r * 3.2} v3.2" stroke="#6e2416" stroke-width=".5"/>`).join('')).join('');
      s += R(10, 82, 80, 18, '#a8432f') + shade('M60 82 H90 V100 H60Z', .15) + br + R(7, 79.5, 86, 4.5, '#8e3424', 'rx="1"') + P('M6 81 Q20 76 34 79 Q50 76 66 79 Q80 76 94 81 L94 82.5 H6Z', '#f4f8fd')
        + E(36, 79, 4, 2.8, skin) + E(64, 79, 4, 2.8, skin) + `<path d="M34 78 v-1.2 M36 77.6 v-1.4 M38 78 v-1.2 M62 78 v-1.2 M64 77.6 v-1.4 M66 78 v-1.2" stroke="${skinD}" stroke-width=".6"/>`;
    }
    return s;
  };

  const reg = { vader: () => vader(false), din_djarin: () => mando(false), stormtrooper: () => trooper(false), yoda: () => yoda(false) };
  for (const id in reg) Art.addArt('char', id, reg[id]);
})(window);
