// The HoloNet (built from its sources; loaded on demand by js/holonet-boot.js).
// Concept cards for the HoloNet Arena, drawn with the game's own art kit and
// rendered through the real card frame. Design preview only.
(function (root) {
  const D = root.GameData;
  const K = root.ArtX;
  const { P, E, C, R, L, shade, shoulders, neck, head, eyes, brows, nose, mouth, glowEyes, blaster, SCENES } = K;
  const add = (kind, id, fn) => root.Art.addArt(kind, id, fn);

  // ---------- shared pieces ----------
  const mandoHelmet = (base, dark, o = {}) => P('M34 44 C34 27.5 41 21.5 50 21.5 C59 21.5 66 27.5 66 44 L66 61 L34 61Z', base)
    + shade('M34 44 C34 27.5 41 21.5 50 21.5 L50 61 L34 61Z', 0.14)
    + P('M37.5 37 L62.5 37 L62.5 42.5 L54 42.5 L54 57 L46 57 L46 42.5 L37.5 42.5Z', o.visor || '#0e0f10')
    + P('M39 24.5 C44 22.5 56 22.5 61 24.5', 'none', 'stroke="#fff" stroke-opacity=".35" stroke-width="1.2" stroke-linecap="round"')
    + R(35, 56, 30, 5, dark) + L(37, 47, 37, 55, dark, 1.2) + L(63, 47, 63, 55, dark, 1.2) + (o.extra || '');
  const armorChest = (plate, under, trim) => shoulders(under) + P('M30 78 C36 74 64 74 70 78 L68 96 L32 96Z', plate)
    + shade('M30 78 C36 74 50 74 50 74 L50 96 L32 96Z', 0.16) + P('M50 76 L50 96', 'none', `stroke="${trim}" stroke-width="1"`)
    + P('M14 84 C18 78 26 76 32 78 L30 90 C24 88 18 88 14 92Z', plate) + P('M86 84 C82 78 74 76 68 78 L70 90 C76 88 82 88 86 92Z', plate);

  // ---------- characters ----------
  add('char', 'hn_krrsantan', () => SCENES.pit()
    + shoulders('#4a3020', { top: 72 }) + P('M4 100 C8 88 16 80 28 76 L24 100Z', '#3a2618')
    + P('M18 80 L28 75 L82 100 L68 100Z', '#3a2a1c') + [0, 1, 2, 3, 4].map((i) => R(30 + i * 10, 81 + i * 4.2, 4.5, 3.6, '#c9a85a', `transform="rotate(24 ${32 + i * 10} ${83 + i * 4.2})"`)).join('')
    + P('M33 50 C31 29 40 20 50 20 C60 20 69 29 67 50 C67 65 59 72 50 72 C41 72 33 65 33 50Z', '#4a3020')
    + [[37, 30, 35, 41], [63, 30, 65, 41], [43, 23, 42, 31], [57, 23, 58, 31], [35, 54, 37, 65], [65, 54, 63, 65], [40, 64, 42, 70], [60, 64, 58, 70]].map(([a, b, c, d]) => L(a, b, c, d, '#140c08', 1.2)).join('')
    + E(50, 52, 11, 12.5, '#6a4a32') + eyes({ y: 45, iris: '#c8a040', spread: 5 }) + brows('#140c08', { y: 41.5, spread: 5, angry: true, w: 1.8 })
    + P('M46.5 50 L53.5 50 L50 54Z', '#0c0806') + P('M43.5 58 Q50 63 56.5 58 Q50 60.5 43.5 58Z', '#140806') + R(46, 58.4, 2, 2, '#efe4c8') + R(52, 58.4, 2, 2, '#efe4c8')
    + L(56, 31, 61, 41, '#7a4a32', 1.4) + L(59.5, 30, 63.5, 38, '#7a4a32', 1.2) + L(41, 60, 44, 67, '#7a4a32', 1));

  add('char', 'hn_pre_vizsla', () => SCENES.city()
    + armorChest('#5f7f9f', '#22303e', '#33475c') + P('M42 80 L58 80 L56 88 L44 88Z', '#2b3c4e')
    + mandoHelmet('#6f8faf', '#3a536d', { extra: P('M36 30 L41 25 L43 33Z', '#2b3c4e') + P('M64 30 L59 25 L57 33Z', '#2b3c4e') + P('M56 44 L64 47 L58 51Z', '#2b3c4e') + L(66, 40, 70, 20, '#3a3d42', 1.3) + R(68, 18, 4, 5, '#3a3d42') })
    + `<g style="filter:drop-shadow(0 0 1.4px #ffffff) drop-shadow(0 0 3px #9ab4d8)">${L(84, 6, 66, 76, '#f4f8ff', 4.4)}${L(84, 6, 66, 76, '#08090c', 2.6)}</g>`
    + L(66, 76, 63.5, 86, '#9aa1ab', 3.4) + L(65.2, 79, 64.6, 81.5, '#2a2d33', 3.6));

  add('char', 'hn_armorer', () => SCENES.warm() + C(50, 104, 34, '#ff7a1a', 'opacity=".45"') + C(50, 104, 18, '#ffd06a', 'opacity=".5"')
    + shoulders('#3a2a1e') + P('M22 76 C34 68 66 68 78 76 L74 84 C62 78 38 78 26 84Z', '#8a6a4a') + [26, 34, 42, 50, 58, 66, 74].map((x) => L(x, 77, x + 1, 83, '#5e4630', 1)).join('')
    + P('M30 84 C36 80 64 80 70 84 L68 98 L32 98Z', '#5a4634')
    + mandoHelmet('#c8a060', '#7a5a2a', { visor: '#140a04', extra: P('M50 21.5 L46.5 9 L50 13 L53.5 9Z', '#c8a060') + P('M35 34 L27 22 L39 30Z', '#b08a4a') + P('M65 34 L73 22 L61 30Z', '#b08a4a') + shade('M35 34 L27 22 L39 30Z', 0.15) })
    + L(70, 92, 88, 56, '#5a4a3a', 3) + R(83, 48, 13, 9, '#8f98a6', 'rx="2" transform="rotate(-62 89 52)"') + shade('M84 50 L94 52 L92 57 L84 55Z', 0.2)
    + C(14, 92, 3, '#ffd06a', 'opacity=".9"') + C(20, 88, 1.6, '#ffe8a0'));

  add('char', 'hn_fennec', () => SCENES.desert()
    + shoulders('#1e1c1a') + P('M30 78 C36 74 64 74 70 78 L68 96 L32 96Z', '#2a2724') + R(42, 82, 16, 3, '#9a6a3a')
    + P('M8 90 L92 64', 'none', 'stroke="#2a2b2e" stroke-width="4" stroke-linecap="round"') + R(58, 64, 18, 5.4, '#46484e', 'rx="1" transform="rotate(-17 67 66)"') + R(70, 58, 9, 3.4, '#3a3d45', 'rx="1" transform="rotate(-17 74 60)"')
    + P('M34 44 C34 27.5 41 21.5 50 21.5 C59 21.5 66 27.5 66 44 L66 61 L34 61Z', '#2e2a26') + shade('M34 44 C34 27.5 41 21.5 50 21.5 L50 61 L34 61Z', 0.16)
    + P('M35 33 C41 28 59 28 65 33 L64.5 41 C57 37 43 37 35.5 41Z', '#b0763c') + P('M38 36.5 L62 36.5 L61 41 L39 41Z', '#0c0b0a')
    + P('M44 50 L56 50 L55 56 L45 56Z', '#3a352f') + [46, 49, 52].map((x) => L(x, 51.5, x + 1, 54.5, '#1a1714', 0.8)).join('') + R(35, 56, 30, 5, '#3a352f'));

  add('char', 'hn_aurra', () => SCENES.city()
    + shoulders('#5a1c22') + P('M30 78 C38 72 62 72 70 78 L66 92 L34 92Z', '#7a262c') + R(40, 84, 20, 3, '#2a0e10')
    + blaster(10, 84, -22) + `<g transform="scale(-1 1) translate(-100 0)">${blaster(10, 84, -22)}</g>`
    + neck('#efe8e0') + head('#efe8e0', { rx: 12, ry: 15.5 }) + shade('M38 46 Q40 55 45 58 L43 47Z', 0.12)
    + E(44.6, 44.5, 3.4, 2.2, '#140808') + E(55.4, 44.5, 3.4, 2.2, '#140808') + C(44.2, 44.2, 1, '#ff3a3a') + C(55.8, 44.2, 1, '#ff3a3a')
    + brows('#b8a8a0', { spread: 5.4, angry: true, w: 1 }) + nose() + mouth('frown', { color: '#8a3a3e' })
    + L(50, 29, 50, 8, '#d8ccc2', 1.4) + C(50, 8, 1.4, '#ff6a5a') + P('M50 29 C62 28 72 36 70 56 C68 66 64 74 66 82', 'none', 'stroke="#c8b8a8" stroke-width="4" stroke-linecap="round"'));

  add('char', 'hn_paz', () => SCENES.fortress()
    + P('M2 100 C4 80 24 70 50 70 C76 70 96 80 98 100Z', '#2a4a7a') + shade('M2 100 C4 80 24 70 50 70 L46 100Z', 0.2)
    + P('M20 78 C34 70 66 70 80 78 L78 88 C64 80 36 80 22 88Z', '#1e3a64') + R(44, 82, 12, 10, '#16294a', 'rx="1"')
    + mandoHelmet('#3f72b4', '#22457a', { extra: P('M38 30 L44 24 L45 31Z', '#22457a') })
    + R(60, 76, 36, 11, '#4a505c', 'rx="3"') + [0, 1, 2].map((k) => R(94, 77 + k * 3.4, 6, 2.4, '#262a32')).join('') + R(64, 86, 10, 8, '#3a3e48', 'rx="2"'));

  add('char', 'hn_embo', () => SCENES.jakku()
    + shoulders('#4a3a26') + P('M4 100 C8 86 18 78 30 76 L28 100Z', '#6a5236', 'opacity=".9"') + R(40, 80, 20, 12, '#5a4630', 'rx="2"')
    + P('M37 48 C36 37 43 32 50 32 C57 32 64 37 63 48 C63 59 57 64 50 64 C43 64 37 59 37 48Z', '#6a5a46') + shade('M37 48 C36 37 43 32 50 32 L50 64 C43 64 37 59 37 48Z', 0.14)
    + R(38.5, 44, 23, 8, '#2a2016', 'rx="2"') + L(41.5, 48, 47.5, 48, '#8ad8ff', 1.6) + L(52.5, 48, 58.5, 48, '#8ad8ff', 1.6)
    + E(50, 31, 41, 7.5, '#8a7050') + P('M9 31 Q50 18 91 31 Q50 26 9 31Z', '#a88a62') + E(50, 28, 12, 5, '#6a5438') + L(14, 33, 86, 33, '#5a4630', 0.8));

  // ---------- ships ----------
  const LINE = 'stroke="#000" stroke-opacity=".25" stroke-width=".7" fill="none"';
  const eng = (cx, cy, r, color) => `<circle class="eng" cx="${cx}" cy="${cy}" r="${r}" fill="${color || '#9fdcff'}" style="--eng:${color || '#6fc8ff'}"/>`;
  add('ship', 'hn_fang', () => P('M50 10 L55 30 L56 74 L50 84 L44 74 L45 30Z', '#c8ccd4') + shade('M50 10 L45 30 L44 74 L50 84Z', 0.12)
    + P('M50 10 L53 28 H47Z', '#e07a2a') + P('M46 40 L18 24 L16 30 L44 56Z', '#9aa0ac') + P('M54 40 L82 24 L84 30 L56 56Z', '#9aa0ac')
    + P('M18 24 L12 72 L16 74 L21 32Z', '#c8ccd4') + P('M82 24 L88 72 L84 74 L79 32Z', '#c8ccd4') + R(13, 44, 4, 10, '#e07a2a') + R(83, 44, 4, 10, '#e07a2a')
    + E(50, 36, 2.6, 6, '#152235') + `<path d="M46 50 H54 M46 62 H54" ${LINE}/>` + eng(50, 86, 3.6, '#9fdcff'));
  add('ship', 'hn_gauntlet', () => P('M50 22 L60 46 L58 80 L42 80 L40 46Z', '#8a90a0') + shade('M50 22 L40 46 L42 80 L50 80Z', 0.14)
    + P('M50 22 L55 40 H45Z', '#c8ccd4') + R(45, 34, 10, 6, '#152235', 'rx="1"')
    + P('M41 52 L8 48 L6 56 L41 62Z', '#6a7080') + P('M59 52 L92 48 L94 56 L59 62Z', '#6a7080')
    + R(2, 40, 8, 22, '#9aa0ac', 'rx="2"') + R(90, 40, 8, 22, '#9aa0ac', 'rx="2"') + R(3, 44, 6, 3, '#c8402a') + R(91, 44, 6, 3, '#c8402a')
    + `<path d="M42 56 H58 M43 66 H57" ${LINE}/>` + eng(45, 82, 3.2, '#ffb36a') + eng(55, 82, 3.2, '#ffb36a'));
  // hn_outrider is a 3D model in js/ships3d.js.

  // ---------- raid bosses ----------
  add('char', 'raid_jabba', () => R(0, 0, 100, 100, '#2a1c10') + R(0, 0, 100, 100, '#ff9a3a', 'opacity=".12"') + R(0, 70, 100, 30, '#3a2614')
    + C(18, 16, 10, '#ffcf8a', 'opacity=".25"') + C(84, 22, 8, '#ffcf8a', 'opacity=".2"') + R(6, 60, 88, 16, '#4a3018', 'rx="4"')
    + P('M8 100 C6 78 20 60 50 58 C80 60 94 78 92 100Z', '#7a8a4a') + shade('M8 100 C6 78 20 60 50 58 L46 100Z', 0.16)
    + [[20, 84], [32, 90], [68, 90], [80, 84]].map(([x, y]) => E(x, y, 9, 2.4, '#5e6c38', 'opacity=".8"')).join('')
    + P('M22 62 C18 34 32 18 50 18 C68 18 82 34 78 62 C74 72 62 76 50 76 C38 76 26 72 22 62Z', '#8a9a52') + shade('M22 62 C18 34 32 18 50 18 L50 76 C38 76 26 72 22 62Z', 0.12)
    + E(39, 40, 5.4, 3.6, '#e8b830') + E(61, 40, 5.4, 3.6, '#e8b830') + E(39, 40, 1.4, 3, '#140c06') + E(61, 40, 1.4, 3, '#140c06') + P('M33 36 Q39 33 45 36', 'none', 'stroke="#5e6c38" stroke-width="1.6"') + P('M55 36 Q61 33 67 36', 'none', 'stroke="#5e6c38" stroke-width="1.6"')
    + C(46, 48, 1, '#3a4420') + C(54, 48, 1, '#3a4420') + P('M28 56 Q50 66 72 56 Q50 61 28 56Z', '#4a2a2a') + P('M30 56.5 Q50 64 70 56.5', 'none', 'stroke="#2a1414" stroke-width="1.2"')
    + R(68, 66, 18, 4, '#8a5a2a', 'rx="2" transform="rotate(-14 77 68)"') + C(86, 63, 2, '#c8402a', 'opacity=".8"'));

  add('char', 'raid_nihilus', () => R(0, 0, 100, 100, '#06030a') + C(50, 46, 46, '#3a1a6a', 'opacity=".45"') + C(50, 46, 28, '#6a2aaa', 'opacity=".3"')
    + [0, 1, 2, 3, 4, 5, 6, 7].map((k) => { const a = (k / 8) * Math.PI * 2; return P(`M50 46 Q${50 + Math.cos(a + 0.6) * 30} ${46 + Math.sin(a + 0.6) * 30} ${50 + Math.cos(a) * 60} ${46 + Math.sin(a) * 60}`, 'none', 'stroke="#b47aff" stroke-width="1.2" opacity=".55"'); }).join('')
    + P('M8 100 C12 80 30 70 50 68 C70 70 88 80 92 100Z', '#120a18') + P('M30 74 C38 66 62 66 70 74 L66 86 C58 78 42 78 34 86Z', '#24142e')
    + P('M28 54 C24 24 38 10 50 10 C62 10 76 24 72 54 C70 70 60 78 50 78 C40 78 30 70 28 54Z', '#0a0610') + shade('M28 54 C24 24 38 10 50 10 L50 78 C40 78 30 70 28 54Z', 0.25)
    + P('M38 34 C40 27 60 27 62 34 L60 58 C56 66 44 66 40 58Z', '#e4dcef') + shade('M38 34 C40 27 50 27 50 27 L50 66 C44 66 40 58 40 58Z', 0.12)
    + R(41, 40, 7.5, 3.2, '#0a0610') + R(51.5, 40, 7.5, 3.2, '#0a0610') + L(50, 30, 50, 38, '#3a2a4a', 1.4)
    + P('M42 52 L45 57 L48 52 L50.5 57 L53 52 L56 57 L58 52', 'none', 'stroke="#0a0610" stroke-width="1.6" stroke-linejoin="round"') + glowEyes(44.6, 55.2, 41.6, '#c8a0ff', 0.9));

  add('char', 'raid_sarlacc', () => R(0, 0, 100, 100, '#e8b878') + R(0, 0, 100, 40, '#f4d098') + C(80, 16, 7, '#fff4d0') + C(91, 22, 4.6, '#fff4d0')
    + R(0, 40, 100, 60, '#c8945a') + E(50, 78, 48, 18, '#8a5a30') + E(50, 78, 34, 11.5, '#3a1a10') + E(50, 80, 22, 6.5, '#5a1a14')
    + Array.from({ length: 14 }, (_, k) => P(`M${24 + k * 3.8} 74 L${25.6 + k * 3.8} ${67 + (k % 2) * 2.4} L${27.2 + k * 3.8} 74Z`, '#f0e6c8')).join('')
    + C(50, 82, 4.4, '#ff8a5a') + C(50, 82, 2, '#ffd0a0')
    + [[-1, 30, 5], [1, 36, 4.4], [-1, 50, 3.6], [1, 46, 3.2]].map(([s, h, w], k) => P(`M${50 + s * (16 + k * 4)} 74 C${50 + s * (24 + k * 4)} ${74 - h} ${50 + s * (36 + k * 3)} ${66 - h} ${50 + s * (42 + k * 2)} ${74 - h}`, 'none', `stroke="#7a3a2a" stroke-width="${w}" stroke-linecap="round"`)).join('')
    + E(16, 92, 7, 2, '#a07a4a', 'opacity=".6"') + E(86, 94, 6, 1.6, '#a07a4a', 'opacity=".6"'));

  add('char', 'raid_snoke', () => SCENES.throne() + R(0, 0, 100, 100, '#ff2a2a', 'opacity=".08"')
    + R(4, 40, 12, 60, '#8a1414') + R(84, 40, 12, 60, '#8a1414') + R(6, 30, 8, 14, '#a01a1a', 'rx="3"') + R(86, 30, 8, 14, '#a01a1a', 'rx="3"') + L(10, 20, 10, 96, '#ffd06a', 1) + L(90, 20, 90, 96, '#ffd06a', 1)
    + P('M14 100 C16 80 30 70 50 68 C70 70 84 80 86 100Z', '#c8a040') + shade('M14 100 C16 80 30 70 50 68 L46 100Z', 0.18) + P('M44 70 L50 86 L56 70', '#a8862a')
    + neck('#d8ccc0') + P('M34 46 C32 24 40 14 50 14 C60 14 68 24 66 46 C66 62 58 70 50 70 C42 70 34 62 34 46Z', '#d8ccc0') + shade('M34 46 C32 24 40 14 50 14 L50 70 C42 70 34 62 34 46Z', 0.14)
    + P('M38 26 C42 22 46 24 47 32 C46 38 42 40 38 38Z', '#b8a898', 'opacity=".7"') + P('M56 18 Q62 26 60 34', 'none', 'stroke="#a89888" stroke-width="1.2"')
    + E(44, 44, 3, 1.6, '#f4efe6') + E(56, 44, 3, 1.6, '#f4efe6') + C(44, 44, 1.2, '#4a7aaa') + C(56, 44, 1.2, '#4a7aaa') + brows('#a89888', { y: 40, spread: 6, angry: true, w: 1.4 })
    + P('M48 46 Q47 53 50 55 Q53 53 52 46', 'none', 'stroke="#000" stroke-opacity=".25" stroke-width=".9"') + mouth('frown', { y: 60, color: '#7a4a3e' }));


  // ---------- Hologram Shop goods (real objects, no crates) ----------
  const plate = (bg) => R(0, 0, 100, 100, bg) + R(0, 0, 100, 100, '#ffffff', 'opacity=".03"') + E(50, 90, 36, 6, '#000', 'opacity=".35"');
  root.HN_SHOP = {
    puck: (glow) => plate('#141820') + C(50, 50, 40, glow, 'opacity=".12"')
      + P('M24 56 L50 70 L76 56 L76 48 L50 34 L24 48Z', '#3a3e48') + P('M24 48 L50 62 L76 48 L50 34Z', '#5a5f6c') + shade('M24 48 L50 62 L50 70 L24 56Z', 0.2)
      + P('M36 48 L50 55 L64 48 L50 41Z', '#22252c') + C(50, 48, 4.5, glow) + C(50, 48, 2, '#fff', 'opacity=".8"')
      + L(30, 52, 44, 59, glow, 1.2, 'opacity=".8"') + L(56, 59, 70, 52, glow, 1.2, 'opacity=".8"')
      + `<g style="filter:drop-shadow(0 0 3px ${glow})">${C(50, 48, 4.5, glow, 'opacity=".7"')}</g>`
      + P('M44 24 L56 24 L54 30 L46 30Z', glow, 'opacity=".25"') + L(50, 30, 50, 40, glow, 0.8, 'opacity=".5"'),
    camtono: () => plate('#1a1410') + C(50, 46, 38, '#ffd06a', 'opacity=".1"')
      + E(50, 74, 20, 6, '#6a7280') + R(30, 34, 40, 40, '#9aa4b2') + E(50, 34, 20, 6, '#c8d0dc') + shade('M30 34 L50 34 L50 74 L30 74Z', 0.14)
      + R(30, 44, 40, 4, '#6a7280') + R(30, 60, 40, 4, '#6a7280') + E(50, 31, 12, 3.4, '#7a8290') + R(47, 22, 6, 9, '#c8d0dc', 'rx="1.5"')
      + P('M44 51 L56 51 L56 54 L52 54 L52 58 L48 58 L48 54 L44 54Z', '#3a4250') + L(34, 38, 34, 70, '#ffffff', 1, 'opacity=".35"'),
    ingots: () => plate('#121620') + C(50, 50, 36, '#c8d6e8', 'opacity=".1"')
      + [[30, 66], [52, 66], [41, 54]].map(([x, y]) => P(`M${x} ${y} L${x + 6} ${y - 8} H${x + 22} L${x + 28} ${y} Z`, '#b9c6d6') + P(`M${x + 6} ${y - 8} L${x + 9} ${y - 12} H${x + 19} L${x + 22} ${y - 8}Z`, '#e6eef8') + shade(`M${x} ${y} L${x + 6} ${y - 8} L${x + 9} ${y} Z`, 0.18)).join('')
      + P('M45 50 H55 V52 H51.6 V55 H48.4 V52 H45Z', '#5a6678'),
    signet: () => plate('#16121c') + C(50, 50, 36, '#b47aff', 'opacity=".12"')
      + C(50, 50, 22, '#8a929e') + C(50, 50, 18, '#c8d0dc') + C(50, 50, 13, '#5a2a8a') + shade('M28 50 A22 22 0 0 1 50 28 L50 50Z', 0.15)
      + P('M50 40 L54 48 L50 60 L46 48Z', '#e8d8ff') + P('M50 40 L54 48 L50 49Z', '#fff') + L(36, 36, 64, 64, '#ffffff', 0.8, 'opacity=".2"'),
    varka: () => SCENES.warm() + C(26, 100, 30, '#ff7a1a', 'opacity=".5"') + C(26, 100, 14, '#ffd06a', 'opacity=".55"')
      + shoulders('#2a2620') + P('M30 78 C36 72 64 72 70 78 L68 98 L32 98Z', '#7a8696') + shade('M30 78 C36 72 50 72 50 72 L50 98 L32 98Z', 0.16)
      + P('M14 84 C18 78 26 76 32 78 L30 90 C24 88 18 88 14 92Z', '#7a8696') + P('M86 84 C82 78 74 76 68 78 L70 90 C76 88 82 88 86 92Z', '#7a8696') + R(44, 84, 12, 6, '#c8402a', 'rx="1"')
      + mandoHelmet('#8a96a6', '#4a5464', { extra: P('M36 32 L42 24 L44 33Z', '#c8402a') + P('M64 32 L58 24 L56 33Z', '#c8402a') + L(64, 38, 70, 16, '#3a3d42', 1.3) + C(70, 15, 1.6, '#ff4a3a') })
      + R(70, 60, 22, 14, '#5a4634', 'rx="2"') + R(73, 63, 16, 4, '#b9c6d6') + R(73, 68, 16, 4, '#b9c6d6'),
  };

  // ---------- definitions ----------
  const dmg = (mult, hits) => ({ type: 'damage', mult, hits: hits || 1 });
  const heal = (pct) => ({ type: 'heal', pct });
  const buff = (status, turns) => ({ type: 'status', status, turns, chance: 1 });
  const debuff = (status, turns, chance) => ({ type: 'status', status, turns, chance: chance == null ? 1 : chance });
  const tm = (amount) => ({ type: 'tm', amount });
  const ult = (name, target, effects, desc, quote) => ({ name, cd: 0, target, effects, desc, quote, ultimate: true });
  const ab = (name, cd, target, effects, desc) => ({ name, cd, target, effects, desc });
  const NEW = [
    { id: 'hn_krrsantan', name: 'Krrsantan', kind: 'character', faction: 'light', rarity: 'legendary', role: 'tank', spd: 118, traits: ['scoundrel'], home: 'tatooine',
      bio: 'A Wookiee pit gladiator who fought his way out of the Hutt arenas. Passive, Arena Born: takes 20% less damage while Taunting.',
      abilities: [ab('Gladiator Blow', 0, 'enemy', [dmg(1.1)], 'Deal damage; +10% for every hit he has taken this battle (max 5).'), ab('Crowd Roar', 3, 'self', [buff('taunt', 2), buff('defUp', 2), heal(0.15)], 'Gain Taunt and Defense Up for 2 turns and heal 15%.')],
      ultimate: ult('Pit Fighter', 'allEnemies', [dmg(1.6), debuff('stun', 1, 0.5)], 'Smash every enemy, then Stun the one with the most health.', 'RRAAAWRGH!') },
    { id: 'hn_pre_vizsla', name: 'Pre Vizsla', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 150, traits: ['mandalorian', 'leader'], home: 'coruscant',
      bio: 'Leader of Death Watch and wielder of the Darksaber. Passive, Darksaber: deals 30% more damage to Leaders.',
      abilities: [ab('Darksaber Strike', 0, 'enemy', [dmg(1.2)], 'Deal damage and steal one buff from the target.'), ab('Death Watch Rally', 4, 'allAllies', [buff('offUp', 2), tm(25)], 'All allies gain Offense Up and 25% Turn Meter.')],
      ultimate: ult('Rule of Mandalore', 'enemy', [dmg(3.6)], 'Duel the strongest enemy: massive damage that ignores Taunt and Defense Up.', 'The Darksaber gives me the right to rule.') },
    { id: 'hn_armorer', name: 'The Armorer', kind: 'character', faction: 'light', rarity: 'epic', role: 'support', spd: 132, traits: ['mandalorian'], home: 'coruscant',
      bio: 'Keeper of the covert\'s forge, who shapes Beskar for those who earn it. Passive, Forgemaster: Mandalorian allies start with 10% more health.',
      abilities: [ab('Forge Hammer', 0, 'enemy', [dmg(1.0), debuff('defDown', 1)], 'Deal damage and inflict Defense Down for 1 turn.'), ab('Temper the Steel', 3, 'ally', [buff('defUp', 2)], 'One ally gains Beskar Plating: the next hit on them is fully blocked.')],
      ultimate: ult('This Is the Way', 'allAllies', [buff('defUp', 2), heal(0.2)], 'All allies gain Beskar Plating and Defense Up for 2 turns.', 'This is the Way.') },
    { id: 'hn_fennec', name: 'Fennec Shand', kind: 'character', faction: 'dark', rarity: 'epic', role: 'attacker', spd: 156, traits: ['bounty'], home: 'tatooine',
      bio: 'An elite mercenary and the deadliest shot in the Outer Rim. Passive, Patient Hunter: +25% critical chance on her first attack.',
      abilities: [ab('Long Shot', 0, 'enemy', [dmg(1.1)], 'Shoot the enemy with the lowest health.'), ab('Ambush', 3, 'enemy', [dmg(2.0)], 'Deal heavy damage; double damage if the target hasn\'t acted yet.')],
      ultimate: ult('Clean Kill', 'enemy', [dmg(3.0)], 'Defeat any enemy below 30% health outright; otherwise deal massive damage.', 'I\'m the best there is.') },
    { id: 'hn_aurra', name: 'Aurra Sing', kind: 'character', faction: 'dark', rarity: 'epic', role: 'attacker', spd: 152, traits: ['bounty'], home: 'coruscant',
      bio: 'A cold-blooded bounty hunter with a sniper\'s eye and a long memory. Passive, Antenna: can\'t be Stunned.',
      abilities: [ab('Twin Blasters', 0, 'enemy', [dmg(0.6, 2)], 'Hit one enemy twice.'), ab('Mark for Death', 3, 'enemy', [debuff('defDown', 2)], 'Mark an enemy: every ally hit on it deals 30% bonus damage for 2 turns.')],
      ultimate: ult('Contract Fulfilled', 'enemy', [dmg(2.8)], 'Heavy damage to the marked enemy and everyone next to it.', 'Nothing personal.') },
    { id: 'hn_paz', name: 'Paz Vizsla', kind: 'character', faction: 'light', rarity: 'epic', role: 'tank', spd: 112, traits: ['mandalorian'], home: 'coruscant',
      bio: 'A towering heavy-infantry Mandalorian who never yields ground. Passive, Heavy Infantry: immune to Defense Down.',
      abilities: [ab('Heavy Repeater', 0, 'allEnemies', [dmg(0.5)], 'Damage all enemies lightly.'), ab('Hold the Covert', 3, 'self', [buff('taunt', 2), buff('defUp', 2), heal(0.2)], 'Gain Taunt and Defense Up; heal 20%.')],
      ultimate: ult('Suppressing Fire', 'allEnemies', [dmg(1.4), debuff('offDown', 2)], 'Damage all enemies and inflict Offense Down for 2 turns.', 'This is the Way.') },
    { id: 'hn_embo', name: 'Embo', kind: 'character', faction: 'dark', rarity: 'rare', role: 'attacker', spd: 148, traits: ['bounty'], home: 'tatooine',
      bio: 'A silent Kyuzo hunter whose hat is a shield, a weapon and a legend. Passive, Hat Throw: 20% chance to dodge any attack.',
      abilities: [ab('Bowcaster', 0, 'enemy', [dmg(1.0), debuff('burn', 2, 0.3)], 'Deal damage with a 30% chance to Burn.'), ab('Shield Hat', 3, 'self', [buff('defUp', 1)], 'Block the next attack on himself and counter for 100% damage.')],
      ultimate: ult('Kyuzo Strike', 'enemy', [dmg(2.6), debuff('stun', 1)], 'Leap at the backline: heavy damage to the weakest enemy and Stun it.', '…') },
    { id: 'hn_fang', name: 'Fang Fighter', kind: 'ship', faction: 'light', rarity: 'epic', role: 'attacker', shape: 'hn_fang', spd: 162, traits: ['fighter', 'mandalorian'], home: 'coruscant',
      bio: 'A Mandalorian starfighter whose wings pivot for impossible turns. Passive, Agile Frame: dodges the first attack every round.',
      abilities: [ab('Twin Cannons', 0, 'enemy', [dmg(0.6, 2)], 'Hit one enemy twice.'), ab('Wing Pivot', 3, 'self', [buff('defUp', 1), tm(30)], 'Dodge the next attack and gain 30% Turn Meter.')],
      ultimate: ult('Mandalorian Strike', 'allEnemies', [dmg(1.5), debuff('defDown', 2)], 'Strafe every enemy ship and inflict Defense Down.', 'Fangs out.') },
    { id: 'hn_gauntlet', name: 'Gauntlet Fighter', kind: 'ship', faction: 'light', rarity: 'legendary', role: 'support', shape: 'hn_gauntlet', spd: 140, traits: ['gunship', 'mandalorian'], home: 'coruscant',
      bio: 'A Mandalorian assault ship that rotates its wings to land a boarding squad anywhere. Passive, Troop Carrier: allies start with 15% Turn Meter.',
      abilities: [ab('Repeating Blasters', 0, 'enemy', [dmg(1.0)], 'Damage one enemy ship.'), ab('Drop the Boarders', 4, 'allAllies', [buff('offUp', 2)], 'Summon a Mandalorian boarding squad as a temporary ally for 2 turns.')],
      ultimate: ult('Rotary Wing Assault', 'allEnemies', [dmg(1.4), { ...tm(30), on: 'allies' }], 'Damage all enemies; allies gain Offense Up and 30% Turn Meter.', 'Boarding party, go!') },
    { id: 'hn_outrider', name: 'Outrider', kind: 'ship', faction: 'light', rarity: 'epic', role: 'attacker', shape: 'hn_outrider', spd: 158, traits: ['gunship', 'scoundrel'], home: 'tatooine',
      bio: 'Dash Rendar\'s heavily modified freighter, built for speed and nothing else. Passive, Overpowered Engines: +15 speed.',
      abilities: [ab('Dorsal Turret', 0, 'enemy', [dmg(1.0)], 'Damage one enemy ship.'), ab('Smuggler\'s Run', 3, 'allAllies', [tm(20)], 'All allies gain Speed Up and 20% Turn Meter.')],
      ultimate: ult('Asteroid Dive', 'allEnemies', [dmg(1.6)], 'Dodge all attacks for 1 turn, then hit every enemy.', 'Hang on back there!') },
    { id: 'raid_jabba', name: 'Jabba the Hutt', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'tank', spd: 90, traits: ['scoundrel', 'leader'], home: 'tatooine', bio: 'Raid boss.' },
    { id: 'raid_nihilus', name: 'Darth Nihilus', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 140, traits: ['sith'], home: 'coruscant', bio: 'Raid boss.' },
    { id: 'raid_sarlacc', name: 'The Sarlacc', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'tank', spd: 70, traits: [], home: 'tatooine', bio: 'Raid boss.' },
    { id: 'raid_snoke', name: 'Supreme Leader Snoke', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'support', spd: 120, traits: ['leader'], home: 'coruscant', bio: 'Raid boss.' },
  ];
  for (const c of NEW) {
    if (D.UNIT_MAP[c.id]) continue;
    if (!c.abilities) { c.abilities = [ab('Crush', 0, 'enemy', [dmg(1.4)], 'Raid boss attack.')]; c.ultimate = ult('Raid Fury', 'allEnemies', [dmg(1.8)], 'Raid boss ultimate.', ''); }

    D.UNIT_MAP[c.id] = c;
    if (D.BIOS) D.BIOS[c.id] = c.bio;
  }

})(window);
// HoloNet Arena art (tester build only): raid minions, bounty pucks with
// their target holograms, and league badges.
(function (root) {
  'use strict';
  const { P, E, C, R, L, shade, LG, RG, stars } = root.ArtX;
  const MARK = '<!--DEFS-->';
  let cur = null;
  const finish = (fn) => (...a) => { cur = { d: '' }; const out = fn(...a); const d = cur.d; cur = null; return out.replace(MARK, d); };
  const lg = (s, a, b, c, e) => { const [u, x] = LG(s, a, b, c, e); cur.d += x; return u; };
  const rg = (s, a, b, c) => { const [u, x] = RG(s, a, b, c); cur.d += x; return u; };
  const glow = (c, b = 3) => `style="filter:drop-shadow(0 0 ${b}px ${c})"`;
  const add = (id, fn) => root.Art.addArt('char', id, finish(fn));

  // ---------- raid minions ----------
  add('hn_chest', () => {
    const wood = lg([[0, '#8a5a2a'], [1, '#4a2c12']], 0, 0, 0, 1);
    return MARK + R(0, 0, 100, 100, rg([[0, '#ffb05a', 0.5], [1, '#1a0c06']], 0.5, 0.5, 0.7))
      + E(50, 86, 34, 6, '#000', 'opacity=".5"')
      + P('M18 46 L82 46 L82 84 L18 84Z', wood) + P('M16 46 C16 28 30 22 50 22 C70 22 84 28 84 46Z', wood) + shade('M16 46 C16 28 30 22 50 22 L50 84 L18 84 L18 46Z', 0.15)
      + [24, 50, 76].map((x) => R(x - 3, 22, 6, 62, '#c9a040')).join('') + R(16, 44, 68, 5, '#c9a040')
      + R(43, 50, 14, 14, '#e8c860', 'rx="2"') + C(50, 57, 2.4, '#2a1a08') + R(49, 57, 2, 4, '#2a1a08')
      + `<g ${glow('#ffd06a', 3)}>${C(32, 40, 1.4, '#fff4c0')}${C(66, 36, 1.2, '#fff4c0')}</g>`
      + [[30, 92], [62, 94], [72, 90]].map(([x, y]) => E(x, y, 4, 1.6, '#ffd23f')).join('');
  });
  add('hn_husk', () => MARK + R(0, 0, 100, 100, rg([[0, '#4a1a6a'], [1, '#08040e']], 0.5, 0.35, 0.8)) + stars(7, 14, 100)
    + P('M14 100 C18 80 32 70 50 70 C68 70 82 80 86 100Z', '#2a2430') + P('M14 100 C18 80 32 70 50 70 L46 100Z', '#000', 'opacity=".25"')
    + P('M34 70 C30 52 36 30 50 28 C64 30 70 52 66 70Z', '#1a161e')
    + P('M40 46 C40 38 44 34 50 34 C56 34 60 38 60 46 C60 56 56 62 50 62 C44 62 40 56 40 46Z', '#8a8090') + shade('M40 46 C40 38 44 34 50 34 L50 62 C44 62 40 56 40 46Z', 0.2)
    + `<g ${glow('#c88aff', 2)}>${E(45.4, 45, 2.4, 1.4, '#e6d0ff')}${E(54.6, 45, 2.4, 1.4, '#e6d0ff')}</g>`
    + P('M44 53 L56 53', 'none', 'stroke="#3a3040" stroke-width="1.4"') + P('M42 40 L46 50 M58 40 L54 50', 'none', 'stroke="#5a5060" stroke-width=".8"')
    + P('M50 28 C52 18 58 12 64 10', 'none', `stroke="#b070ff" stroke-width="1.2" opacity=".7" ${glow('#a060ff', 2)}`));
  add('hn_tentacle', () => {
    const flesh = lg([[0, '#c87a6a'], [1, '#6a2a24']], 0, 0, 1, 0);
    return MARK + R(0, 0, 100, 100, lg([[0, '#e8c08a'], [0.55, '#b08050'], [1, '#5a3a20']], 0, 0, 0, 1))
      + E(50, 92, 40, 12, '#2a1408') + E(50, 92, 30, 8, '#120804')
      + P('M44 94 C40 70 30 56 36 36 C40 22 54 14 62 20 C56 22 50 28 50 38 C50 54 60 70 58 94Z', flesh)
      + shade('M44 94 C40 70 30 56 36 36 C40 22 54 14 62 20 C50 28 46 40 46 52 L46 94Z', 0.18)
      + [[44, 80], [42, 68], [40, 56], [41, 44], [46, 32], [54, 24]].map(([x, y]) => E(x + 4, y, 2.4, 1.6, '#e8b0a0', 'opacity=".9"')).join('')
      + P('M62 20 C66 18 70 20 70 24 C66 22 64 24 62 26Z', flesh);
  });
  add('hn_praetorian', () => {
    const armor = lg([[0, '#ff4a3a'], [0.5, '#b81a14'], [1, '#5a0806']], 0, 0, 1, 1);
    return MARK + R(0, 0, 100, 100, '#1a0404') + R(0, 0, 100, 100, rg([[0, '#ff2a1a', 0.45], [1, '#000', 0]], 0.5, 0.2, 0.7))
      + [10, 30, 70, 90].map((x) => R(x - 4, 0, 8, 100, '#2a0606', 'opacity=".7"')).join('')
      + P('M10 100 C12 82 28 72 50 72 C72 72 88 82 90 100Z', armor) + shade('M10 100 C12 82 28 72 50 72 L46 100Z', 0.25)
      + [80, 86, 92].map((y) => P(`M18 ${y} C34 ${y - 5} 66 ${y - 5} 82 ${y}`, 'none', 'stroke="#5a0806" stroke-width="1.2"')).join('')
      + P('M34 52 C34 34 40 22 50 22 C60 22 66 34 66 52 L64 70 L36 70Z', armor) + shade('M34 52 C34 34 40 22 50 22 L50 70 L36 70Z', 0.2)
      + P('M38 40 L62 40 L60 46 L40 46Z', '#1a0202') + [44, 50, 56].map((x) => L(x, 50, x, 66, '#5a0806', 1.4)).join('')
      + L(78, 6, 70, 98, '#2a2a30', 2.6) + `<g ${glow('#ff6a3a', 3)}>${L(80, 4, 76.6, 34, '#ffd0a0', 2.2)}</g>`;
  });

  // ---------- bounty targets (hologram figures) ----------
  // Each is a small silhouette standing above the puck's emitter.
  const body = (c) => P('M36 50 C37 42 42 38 50 38 C58 38 63 42 64 50Z', c);
  // Hologram busts: a light outline over a translucent fill, dark detail cut
  // into it, so each target reads clearly at puck size.
  const K = '#02141c';
  const ln = (c, w = 0.6, o = 0.9) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${o}"`;
  const H = (d, c) => P(d, c, `stroke="${c}" stroke-width=".7" stroke-opacity="1"`);
  const dk = (d, o = 0.6) => P(d, K, `opacity="${o}"`);
  const shoulders2 = (c, collar) => H('M30 52 C31 44 38 40 44 39 L56 39 C62 40 69 44 70 52Z', c) + (collar || '');
  const TARGETS = {
    rodian: (c) => shoulders2(c, H('M44 39 L50 46 L56 39 L54 37 L46 37Z', c) + P('M44 39 L50 46 L56 39', 'none', ln(K, 0.6, 0.6)))
      + H('M41.5 21 C41.5 13.5 45.5 10 50 10 C54.5 10 58.5 13.5 58.5 21 C58.5 26 56 29.5 53.6 32 L52 37.5 L48 37.5 L46.4 32 C44 29.5 41.5 26 41.5 21Z', c)
      + `<ellipse cx="45.6" cy="21.6" rx="3.3" ry="4.3" transform="rotate(-18 45.6 21.6)" fill="${K}" opacity=".8"/><ellipse cx="54.4" cy="21.6" rx="3.3" ry="4.3" transform="rotate(18 54.4 21.6)" fill="${K}" opacity=".8"/>`
      + C(44.6, 20.2, 0.9, c) + C(53.4, 20.2, 0.9, c)
      + P('M46 11.6 L45 8.6 M50 10 L50 7 M54 11.6 L55 8.6', 'none', ln(c, 0.9, 1)) + C(41.2, 20, 1.2, c) + C(58.8, 20, 1.2, c)
      + P('M48.4 33.4 L51.6 33.4 M49 35.6 L51 35.6', 'none', ln(K, 0.5, 0.7)),
    weequay: (c) => shoulders2(c, H('M42 39 L46 48 L50 40 L54 48 L58 39Z', c))
      + H('M43.4 26 C43 16 46 11.6 50 11.6 C54 11.6 57 16 56.6 26 C56.4 32 54 37 50 38 C46 37 43.6 32 43.4 26Z', c)
      + P('M44.6 20.6 C47 19.4 53 19.4 55.4 20.6', 'none', ln(K, 0.9, 0.7)) + E(47.4, 23, 1.3, 0.7, K) + E(52.6, 23, 1.3, 0.7, K)
      + [27, 30, 33].map((y) => P(`M45 ${y} Q50 ${y + 1.6} 55 ${y}`, 'none', ln(K, 0.45, 0.5))).join('') + P('M47.6 31.6 L52.4 31.6', 'none', ln(K, 0.7, 0.7))
      + P('M50 11.6 C49 8 46 7 44 8 M50 11.6 C51 8 54 7 56 8', 'none', ln(c, 1, 1)) + P('M44 8 L41 16 M56 8 L59 16', 'none', ln(c, 0.8, 0.9)) + C(41, 16.6, 0.9, c) + C(59, 16.6, 0.9, c),
    jawa: (c) => H('M32 52 C34 42 38 34 41 26 C43 15 46 10 50 10 C54 10 57 15 59 26 C62 34 66 42 68 52Z', c)
      + dk('M44 22 C44 17 46.6 15 50 15 C53.4 15 56 17 56 22 C56 27 53.4 30 50 30 C46.6 30 44 27 44 22Z', 0.85)
      + `<g style="filter:drop-shadow(0 0 1.4px #fff8b0)">${C(47.6, 22.6, 1.3, '#fff8b0')}${C(52.4, 22.6, 1.3, '#fff8b0')}</g>`
      + P('M36 42 L64 36', 'none', ln(K, 1.4, 0.55)) + [40, 46, 52, 58].map((x, i) => R(x - 1, 39.6 - i * 1.1, 2, 2.2, K, 'opacity=".55"')).join('') + P('M45 32 C47 33 53 33 55 32', 'none', ln(c, 0.6, 1)),
    gamorrean: (c) => H('M26 52 C27 43 34 39 41 38 L59 38 C66 39 73 43 74 52Z', c) + H('M30 42 L27 36 L33 40Z M70 42 L73 36 L67 40Z', c) + P('M33 46 C38 43 43 43 46 45 M67 46 C62 43 57 43 54 45', 'none', ln(K, 0.6, 0.55))
      + L(68, 52, 74, 18, c, 1.1) + H('M70 14 C76 14 80 18 80 23 L72 24Z', c)
      + H('M40.4 24 C40 16 44.4 11.6 50 11.6 C55.6 11.6 60 16 59.6 24 L59 31 C59 36 56 39 52 39.6 L48 39.6 C44 39 41 36 41 31Z', c)
      + H('M41.6 15.6 L39.4 10.6 L43.6 13.6Z M58.4 15.6 L60.6 10.6 L56.4 13.6Z', c)
      + P('M42 20.4 L48.4 22.6 M58 20.4 L51.6 22.6', 'none', ln(K, 1.6, 0.85)) + E(46.2, 24, 1, 0.8, K) + E(53.8, 24, 1, 0.8, K)
      + H('M46 27.4 C46 26 47.8 25.4 50 25.4 C52.2 25.4 54 26 54 27.4 L53.4 31 C52.4 32 47.6 32 46.6 31Z', c) + E(48.4, 29.2, 0.7, 1.1, K) + E(51.6, 29.2, 0.7, 1.1, K)
      + H('M45 36.6 L44.4 32 L46.6 35.6Z M55 36.6 L55.6 32 L53.4 35.6Z', c) + P('M45.4 35.6 Q50 37.2 54.6 35.6', 'none', ln(K, 0.7, 0.75))
      + P('M41.4 30 C40 33 40.6 36 42.6 38 M58.6 30 C60 33 59.4 36 57.4 38', 'none', ln(K, 0.6, 0.55)) + P('M43 16.6 C46 15 54 15 57 16.6', 'none', ln(K, 0.5, 0.45)),
    trandoshan: (c) => shoulders2(c, H('M41 39 C44 37 56 37 59 39 L58 46 L42 46Z', c) + P('M44 41 L44 45 M50 40 L50 46 M56 41 L56 45', 'none', ln(K, 0.5, 0.55)))
      + H('M39.6 25 C39 16 43.6 10.6 50 10.6 C56.4 10.6 61 16 60.4 25 C60.2 30 58.6 34 55.6 36.6 C53.6 38.2 51.8 38.8 50 38.8 C48.2 38.8 46.4 38.2 44.4 36.6 C41.4 34 39.8 30 39.6 25Z', c)
      + P('M41 20 C44 18.4 47.6 18.6 49 20.4 M59 20 C56 18.4 52.4 18.6 51 20.4', 'none', ln(K, 1.5, 0.85))
      + E(45.4, 23.2, 2, 1.3, '#fff3a0') + E(54.6, 23.2, 2, 1.3, '#fff3a0') + L(45.4, 22.1, 45.4, 24.3, K, 0.7) + L(54.6, 22.1, 54.6, 24.3, K, 0.7)
      + P('M48.6 28.4 L49.2 29.6 M51.4 28.4 L50.8 29.6', 'none', ln(K, 0.6, 0.7))
      + P('M43.4 32 C46 34.4 54 34.4 56.6 32', 'none', ln(K, 0.8, 0.8)) + [45.4, 47.6, 49.8, 52, 54.2].map((x) => P(`M${x} 32.9 L${x + 0.6} 34`, 'none', ln(c, 0.5, 0.9))).join('')
      + [[44, 14.6], [47, 13], [50, 12.4], [53, 13], [56, 14.6], [42, 17.6], [58, 17.6], [42.6, 28], [57.4, 28], [46, 36], [54, 36]].map(([x, y]) => C(x, y, 0.55, K, 'opacity=".4"')).join('')
      + P('M43 11.6 C46 9.6 54 9.6 57 11.6', 'none', ln(c, 0.6, 0.8)),
    deserter: (c) => shoulders2(c, H('M37 41 C41 39 46 39 50 40.4 C54 39 59 39 63 41 L61 47 L39 47Z', c) + P('M44 43 L56 43', 'none', ln(K, 0.6, 0.5)))
      + H('M40 24 C40 14.6 44.4 10 50 10 C55.6 10 60 14.6 60 24 L59.4 30 C61 31 61.4 33.6 60 35.4 C57 38.4 53.6 39.4 50 39.4 C46.4 39.4 43 38.4 40 35.4 C38.6 33.6 39 31 40.6 30Z', c)
      + P('M41 20.6 C45 19 55 19 59 20.6', 'none', ln(K, 0.7, 0.6))
      + P('M41.6 22 C43.6 21.4 47 21.6 48.6 22.6 L47.8 27.6 C46 28.6 43.4 28 42.4 27Z', K, 'opacity=".9"') + P('M58.4 22 C56.4 21.4 53 21.6 51.4 22.6 L52.2 27.6 C54 28.6 56.6 28 57.6 27Z', K, 'opacity=".9"')
      + P('M50 22 L50 29', 'none', ln(K, 0.6, 0.5))
      + P('M44 31.4 C46 29.8 48 29.6 50 31 C52 29.6 54 29.8 56 31.4 L54.6 35.6 C52.6 36.8 47.4 36.8 45.4 35.6Z', K, 'opacity=".55"') + [46.6, 48.4, 50, 51.6, 53.4].map((x) => L(x, 31.6, x, 35.6, c, 0.5)).join('')
      + C(41.4, 31.6, 1.3, K, 'opacity=".6"') + C(58.6, 31.6, 1.3, K, 'opacity=".6"') + P('M40 26 L42 29.6 M60 26 L58 29.6', 'none', ln(K, 0.9, 0.55))
      + P('M45 13.4 C47.6 12 52.4 12 55 13.4', 'none', ln(K, 0.5, 0.4))
      + P('M56.6 11.4 L54.4 16.4 L57 19.6 L55 24.4', 'none', ln('#ffffff', 0.7, 0.9)),
    mythrol: (c) => shoulders2(c, H('M42 39 L50 47 L58 39 L55 37 L50 41 L45 37Z', c))
      + H('M40.6 24 C40.6 14 45 9.6 50 9.6 C55 9.6 59.4 14 59.4 24 C59.4 31 55.6 37 50 37.6 C44.4 37 40.6 31 40.6 24Z', c)
      + H('M40.8 22 L35.6 18 L36.8 24 L35 28 L40.8 27Z M59.2 22 L64.4 18 L63.2 24 L65 28 L59.2 27Z', c)
      + P('M37 20.4 L40 23 M36.6 25.6 L40 25.6 M63 20.4 L60 23 M63.4 25.6 L60 25.6', 'none', ln(K, 0.5, 0.6))
      + E(46.4, 24, 1.5, 1.8, K) + E(53.6, 24, 1.5, 1.8, K) + C(46, 23.4, 0.5, c) + C(53.2, 23.4, 0.5, c) + P('M46.6 31.4 Q50 33.4 53.4 31.4', 'none', ln(K, 0.7, 0.75)) + P('M45 14 C47.6 12.6 52.4 12.6 55 14', 'none', ln(K, 0.5, 0.4)),
    officer: (c) => shoulders2(c, H('M44.6 37 L55.4 37 L56 42 L44 42Z', c) + R(52.4, 43.4, 7, 3, K, 'opacity=".65" rx=".5"') + [53.6, 55.6, 57.6].map((x, i) => R(x, 44.2, 1.2, 1.4, i === 1 ? '#ff6a5a' : '#5ab4ff')).join('') + P('M40.6 42.6 L41.6 47 M43.6 42.6 L44.2 47', 'none', ln(K, 0.8, 0.6)))
      + H('M43.6 25.6 C43.6 21 46.6 18.6 50 18.6 C53.4 18.6 56.4 21 56.4 25.6 C56.4 31 53.6 35 50 35 C46.4 35 43.6 31 43.6 25.6Z', c)
      + H('M40.4 19.6 C41 14.4 45 12 50 12 C55 12 59 14.4 59.6 19.6 L58.6 20.6 L41.4 20.6Z', c) + P('M40.6 20.6 L59.4 20.6 L58.6 22.6 L41.4 22.6Z', K, 'opacity=".8"') + R(48, 14.4, 4, 2.4, K, 'opacity=".55" rx=".4"')
      + E(47.4, 26.2, 1.1, 0.8, K) + E(52.6, 26.2, 1.1, 0.8, K) + P('M46 24.4 L48.8 24.8 M54 24.4 L51.2 24.8', 'none', ln(K, 0.6, 0.7)) + P('M49.6 27.4 L49.2 29.6 L50.6 29.8', 'none', ln(K, 0.5, 0.6)) + P('M47.6 31.6 L52.4 31.6', 'none', ln(K, 0.6, 0.75)),
    deathtrooper: (c) => shoulders2(c, H('M38 41 L62 41 L60 47 L40 47Z', c) + P('M44 43 L56 43', 'none', ln(K, 0.6, 0.6)))
      + H('M41.4 31 C40.4 18 44 9 50 9 C56 9 59.6 18 58.6 31 L57.4 36 C55 38.4 52.6 39 50 39 C47.4 39 45 38.4 42.6 36Z', c)
      + P('M42.6 22 L57.4 22 L56.6 27.2 C54 28.4 46 28.4 43.4 27.2Z', K, 'opacity=".88"') + P('M44 23.4 L49 23.8 M51 23.8 L56 23.4', 'none', ln(c, 0.5, 0.8))
      + L(50, 28.6, 50, 37, K, 0.7) + R(46, 31, 2.2, 3.4, K, 'opacity=".6" rx=".6"') + R(51.8, 31, 2.2, 3.4, K, 'opacity=".6" rx=".6"') + P('M45.4 12.6 C48 11 52 11 54.6 12.6', 'none', ln(K, 0.5, 0.45)),
    gideon: (c) => H('M24 54 C27 42 35 36 42 35 L58 35 C65 36 73 42 76 54Z', c, ) + P('M32 52 C35 44 40 40 44 39 M68 52 C65 44 60 40 56 39', 'none', ln(K, 0.6, 0.55))
      + H('M42 36 L41 30 L45 33 L50 30 L55 33 L59 30 L58 36Z', c) + R(52.6, 41.6, 6, 2.6, K, 'opacity=".6" rx=".5"')
      + H('M44 25.6 C44 21 46.8 18.6 50 18.6 C53.2 18.6 56 21 56 25.6 C56 30.6 53.4 34 50 34 C46.6 34 44 30.6 44 25.6Z', c)
      + H('M41 19.6 C41.6 14.6 45.4 12.4 50 12.4 C54.6 12.4 58.4 14.6 59 19.6 L58 20.6 L42 20.6Z', c) + P('M41.2 20.6 L58.8 20.6 L58 22.4 L42 22.4Z', K, 'opacity=".85"')
      + E(47.6, 26, 1, 0.7, K) + E(52.4, 26, 1, 0.7, K) + P('M46.2 24.2 L48.8 24.8 M53.8 24.2 L51.2 24.8', 'none', ln(K, 0.7, 0.8)) + P('M47.6 30.8 Q50 30 52.4 30.8', 'none', ln(K, 0.6, 0.75)) + C(43.6, 17.2, 0.8, '#ff5a4a'),
    grogu: (c) => P('M42 50 C42 42 45 38 50 38 C55 38 58 42 58 50Z', c) + E(50, 31, 6.6, 6, c) + P('M44 30 C38 27 32 26 28 28 C33 31 38 33 44 33Z M56 30 C62 27 68 26 72 28 C67 31 62 33 56 33Z', c) + E(47.4, 31, 1.6, 1.8, '#02141c') + E(52.6, 31, 1.6, 1.8, '#02141c'),
    han: (c) => R(38, 12, 24, 38, c, 'rx="1.4"') + R(40.4, 14.4, 19.2, 33.2, '#02141c', 'opacity=".25"') + E(50, 24, 5, 6, c) + P('M42 20 L44 30 L41 32Z M58 20 L56 30 L59 32Z', '#02141c', 'opacity=".55"') + P('M46 36 L54 36 L56 46 L44 46Z', '#02141c', 'opacity=".3"') + E(47.6, 23, 1, 0.6, '#02141c') + E(52.4, 23, 1, 0.6, '#02141c') + P('M47 28 Q50 29.6 53 28', 'none', 'stroke="#02141c" stroke-width=".6"'),
    boba: (c) => body(c) + P('M42 33 C42 20 45.4 16 50 16 C54.6 16 58 20 58 33Z', c) + P('M44 23 L56 23 L56 26 L52 26 L52 33 L48 33 L48 26 L44 26Z', '#02141c') + L(57, 22, 59, 12, c, 0.9) + R(57.6, 10, 2.6, 3, c),
  };
  // Target roster: tier, bias, and how much the bounty is worth.
  const ROSTER = {
    rodian: { name: 'Rodian Thug', tier: 'guild', bias: { faction: 'dark', trait: 'scoundrel' }, bounty: 900, line: 'Skipped out on a Hutt debt.' },
    weequay: { name: 'Weequay Pirate', tier: 'guild', bias: { trait: 'scoundrel' }, bounty: 1100, line: 'Raided a spice convoy off Florrum.' },
    jawa: { name: 'Jawa Thief', tier: 'guild', bias: { trait: 'droid' }, bounty: 700, line: 'Stole three astromechs and a landspeeder.' },
    gamorrean: { name: 'Gamorrean Brute', tier: 'guild', bias: { faction: 'dark' }, bounty: 1000, line: 'Broke out of Jabba\'s dungeon.' },
    trandoshan: { name: 'Trandoshan Hunter', tier: 'elite', bias: { trait: 'bounty' }, bounty: 4200, line: 'Hunts Wookiees for sport.' },
    deserter: { name: 'Imperial Deserter', tier: 'elite', bias: { faction: 'dark', trait: 'empire' }, bounty: 4800, line: 'Walked off a Star Destroyer with its codes.' },
    mythrol: { name: 'Mythrol Embezzler', tier: 'elite', bias: { faction: 'light' }, bounty: 3800, line: 'Cooked the books for the Guild.' },
    officer: { name: 'Fugitive Officer', tier: 'high', bias: { faction: 'dark', trait: 'empire' }, bounty: 15000, line: 'Wanted for war crimes on three worlds.' },
    deathtrooper: { name: 'Rogue Death Trooper', tier: 'high', bias: { faction: 'dark' }, bounty: 18000, line: 'Silent, armored, and very much alive.' },
    gideon: { name: 'Remnant Moff', tier: 'high', bias: { faction: 'dark', trait: 'leader' }, bounty: 22000, line: 'Last seen with a Darksaber.' },
    grogu: { name: 'The Asset', tier: 'legend', bias: { faction: 'light', trait: 'jedi' }, bounty: 60000, line: 'Fifty years old. Bring it in alive.' },
    // Most Wanted: rare gold holograms on any puck.
    han: { name: 'Han Solo, in Carbonite', tier: 'gold', bias: { faction: 'light', trait: 'scoundrel' }, bounty: 90000, line: 'Jabba wants him on the wall.' },
    boba: { name: 'Boba Fett', tier: 'gold', bias: { trait: 'bounty' }, bounty: 120000, line: 'The hunter becomes the hunted.' },
    grogu_gold: { name: 'The Asset · Most Wanted', tier: 'gold', bias: { faction: 'light', trait: 'jedi' }, bounty: 150000, line: 'Every guild in the galaxy wants it.', fig: 'grogu' },
  };
  const TIER = {
    guild: { label: 'GUILD', color: '#5ab4ff' },
    elite: { label: 'ELITE', color: '#b47aff' },
    high: { label: 'HIGH VALUE', color: '#ff4a4a' },
    legend: { label: 'LEGENDARY', color: '#ffd23f' },
  };

  // The puck: a rounded metal capsule with an emitter, the target's hologram
  // turning slowly above it. `gold` makes it a Most Wanted hologram.
  const puck = finish((tier, target, opts = {}) => {
    const t = TIER[tier];
    const gold = ROSTER[target] && ROSTER[target].tier === 'gold';
    const hc = gold ? '#ffd86a' : t.color;
    const metal = lg([[0, '#e8ecf2'], [0.5, '#9aa2ae'], [1, '#4a525e']], 0, 0, 0, 1);
    const face = lg([[0, '#2a2e36'], [1, '#121418']]);
    const bg = rg([[0, hc, 0.32], [1, '#0a0c10', 0]], 0.5, 0.42, 0.62);
    const beam = lg([[0, hc, 0], [1, hc, 0.4]], 0, 0, 0, 1);
    const fig = (TARGETS[(ROSTER[target] || {}).fig || target] || TARGETS.rodian)(hc);
    return MARK + (opts.bare ? '' : R(0, 0, 100, 100, '#0c0e14') + R(0, 0, 100, 100, bg)) + E(50, 80, 30, 5, '#000', 'opacity=".5"')
      + P('M38 52 L30 4 L70 4 L62 52Z', beam, 'opacity=".5"')
      + `<g class="hn-holo ${gold ? 'gold' : ''}" ${glow(hc, gold ? 2.6 : 1.8)}><g fill-opacity=".5" opacity=".96" transform="translate(50 29.4) scale(.97) translate(-50 -36)">${fig}</g>`
      + [8, 13, 18, 23, 28, 33, 38, 43].map((y) => L(30, y, 70, y, hc, 0.3, 'opacity=".28"')).join('') + '</g>'
      + E(50, 63, 28, 12, '#3a404a') + R(22, 52, 56, 11, '#3a404a') + E(50, 52, 28, 12, metal) + E(50, 52, 21, 8.4, face)
      + P('M30 52 Q50 44 70 52', 'none', 'stroke="#fff" stroke-width=".9" opacity=".35"') + E(50, 52, 8, 3.4, '#1a1d22')
      + `<g ${glow(hc, 3)}>${E(50, 52, 3.6, 1.7, hc)}</g>` + E(49, 51.4, 1, 0.5, '#fff', 'opacity=".8"')
      + C(30, 57, 1, hc, 'opacity=".9"') + C(70, 57, 1, hc, 'opacity=".9"')
      + (gold ? [[30, 18], [70, 24], [26, 40], [74, 44], [50, 8]].map(([x, y]) => P(`M${x} ${y - 2.4} L${x + 0.7} ${y - 0.7} L${x + 2.4} ${y} L${x + 0.7} ${y + 0.7} L${x} ${y + 2.4} L${x - 0.7} ${y + 0.7} L${x - 2.4} ${y} L${x - 0.7} ${y - 0.7}Z`, '#fff6c0', glow('#ffd23f', 2))).join('') : '')
      + (opts.bare ? '' : `<text x="50" y="92" text-anchor="middle" font-family="Oxanium, sans-serif" font-weight="800" font-size="7" fill="${hc}" letter-spacing="1">${gold ? 'MOST WANTED' : t.label}</text>`);
  });
  const figure = (target, color) => (TARGETS[(ROSTER[target] || {}).fig || target] || TARGETS.rodian)(color);

  // Varka at her forge (from the design pass).
  // Varka: a Mandalorian armorsmith at her forge, hammer in hand, a glowing
  // beskar ingot on the anvil and finished helmets on the wall behind her.
  const varka = finish(() => {
    const wall = lg([[0, '#2a1a12'], [1, '#120a06']], 0, 0, 0, 1);
    const fire = rg([[0, '#fff6c8'], [0.18, '#ffc04a'], [0.45, '#ff6a14', 0.85], [1, '#3a0e02', 0]], 0.5, 0.6, 0.55);
    const steel = lg([[0, '#f2f6fb'], [0.45, '#a9b6c6'], [1, '#4d5868']], 0, 0, 1, 1);
    const steelD = lg([[0, '#b9c5d4'], [1, '#3e4856']], 0, 0, 1, 1);
    const ember = rg([[0, '#ff8a2a', 0.55], [1, '#ff8a2a', 0]], 0.25, 0.85, 0.75);
    const leather = lg([[0, '#6a4024'], [1, '#2e1a0c']], 0, 0, 0, 1);
    const ingot = lg([[0, '#fff2c0'], [0.4, '#ffb04a'], [1, '#c04a10']], 0, 0, 1, 1);
    const visor = lg([[0, '#1a1f28'], [1, '#05070a']], 0, 0, 0, 1);
    let o = MARK + R(0, 0, 100, 100, wall);
    // stone blocks
    o += [[0, 0, 22, 14], [22, 0, 26, 14], [48, 0, 24, 14], [72, 0, 28, 14], [0, 14, 30, 14], [30, 14, 24, 14], [54, 14, 22, 14], [76, 14, 24, 14], [0, 28, 20, 14], [76, 28, 24, 14]].map(([x, y, w, h]) => R(x + 0.6, y + 0.6, w - 1.2, h - 1.2, '#3a2416', 'rx="1.4" opacity=".55"')).join('');
    // the forge mouth, back left, throwing light across the room
    o += P('M2 70 L2 40 C2 30 10 24 18 24 C26 24 34 30 34 40 L34 70Z', '#1a0c06') + P('M6 70 L6 42 C6 34 11 29 18 29 C25 29 30 34 30 42 L30 70Z', fire)
      + `<g ${glow('#ff9a3a', 3)}>${P('M10 70 C9 62 13 58 12 52 C16 56 15 60 18 62 C19 56 22 54 21 48 C26 54 26 62 26 70Z', '#ffd06a', 'opacity=".9"')}</g>`
      + R(0, 0, 100, 100, ember);
    // finished helmets on wall pegs, right
    const helm = (x, y, s, col) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M-6 2 C-6 -5 -3.4 -8 0 -8 C3.4 -8 6 -5 6 2 L6 6 L-6 6Z', col)}${P('M-4.6 -2 L4.6 -2 L4.6 0 L1.4 0 L1.4 5 L-1.4 5 L-1.4 0 L-4.6 0Z', '#0a0c10')}${P('M-4 -6 C-2 -7.4 2 -7.4 4 -6', 'none', 'stroke="#fff" stroke-width=".6" opacity=".5"')}</g>`;
    o += L(68, 21, 98, 21, '#5a3a24', 1.4) + helm(74, 17, 0.9, steelD) + helm(84, 17, 0.9, lg([[0, '#d86a3a'], [1, '#6a2a12']], 0, 0, 1, 1)) + helm(94, 17, 0.9, lg([[0, '#5a8ac0'], [1, '#22406a']], 0, 0, 1, 1));
    // sparks drifting up from the anvil
    o += `<g ${glow('#ffb04a', 1.4)}>` + [[70, 56], [74, 50], [66, 46], [78, 44], [72, 38], [62, 52], [80, 52], [68, 34], [76, 30]].map(([x, y], i) => C(x, y, 0.5 + (i % 3) * 0.25, '#ffe2a0')).join('') + '</g>';
    // anvil with a glowing ingot, front right
    o += P('M58 82 L92 82 L88 74 L64 74Z', '#2a2f38') + P('M54 74 L96 74 L96 70 C88 70 84 67 82 64 L64 64 L60 70 L54 70Z', lg([[0, '#6a7482'], [1, '#2a303a']], 0, 0, 0, 1))
      + P('M64 64 L82 64', 'none', 'stroke="#aeb8c6" stroke-width=".8" opacity=".7"') + P('M66 100 L70 82 L80 82 L84 100Z', '#1e2228')
      + `<g ${glow('#ff9a3a', 3.2)}>${P('M66 63.6 L80 63.6 L78 60 L68 60Z', ingot)}</g>`;
    // more of the workshop: hanging tools, chains and a crucible of molten beskar
    o += L(40, 0, 40, 9, '#4a3a2e', 0.7) + L(44, 0, 44, 7, '#4a3a2e', 0.7) + P('M38.6 9 L41.4 9 L40.8 13 L39.2 13Z', '#5a6270') + P('M42.6 7 L45.4 7 L44.6 12 L43.4 12Z', '#5a6270')
      + [3, 6, 9, 12].map((y) => E(58, y, 0.9, 1.4, 'none', 'stroke="#5a4a3a" stroke-width=".6"')).join('') + P('M56 14 L60 14 L58 18Z', '#6a5a4a')
      + P('M2 92 L14 92 L12 100 L4 100Z', '#2a1c14') + E(8, 92, 6, 1.8, '#ffb04a') + `<g ${glow('#ff8a2a', 2.4)}>${E(8, 92, 4.4, 1.2, '#fff0b0')}</g>`
      + P('M36 6 L37 10 L35 10Z', '#ffcf7a', 'opacity=".6"');
    // Varka: big beskar helmet with crimson markings, pauldrons and a red cape
    const red = lg([[0, '#e04a34'], [1, '#7a1a12']], 0, 0, 1, 1);
    const under = lg([[0, '#2e333c'], [1, '#14171c']], 0, 0, 0, 1);
    o += P('M4 100 C6 86 14 78 24 75 L16 100Z', red) + P('M96 100 C94 86 86 78 76 75 L84 100Z', red)
      + P('M10 100 C12 84 28 74 50 73 C72 74 88 84 90 100Z', under)
      + P('M30 80 C36 76 64 76 70 80 L68 100 L32 100Z', steel) + P('M30 80 C36 76 50 76 50 76 L50 100 L32 100Z', '#000', 'opacity=".1"') + P('M50 77 L50 100', 'none', 'stroke="#4a5666" stroke-width="1"')
      + P('M38 86 L46 84 L46 92 L38 94Z M62 86 L54 84 L54 92 L62 94Z', red, 'opacity=".85"')
      + P('M12 88 C16 80 25 77 32 79 L30 92 C24 90 18 90 12 95Z', steel) + P('M88 88 C84 80 75 77 68 79 L70 92 C76 90 82 90 88 95Z', steelD)
      + P('M15 85 C19 81 25 80 29 81', 'none', 'stroke="#fff" stroke-width=".8" opacity=".55"')
      + `<g transform="translate(22 86) scale(.36)" opacity=".8">${P('M0 -6 C-4 -6 -6 -3 -6 0 C-6 3 -3 5 0 6 C3 5 6 3 6 0 C6 -3 4 -6 0 -6Z M-6 -2 L-12 -6 M6 -2 L12 -6 M-5 2 L-10 4 M5 2 L10 4', 'none', 'stroke="#7a1a12" stroke-width="2.6"')}</g>`;
    // the helmet, filling the frame like the other Mandalorian cards
    o += `<g transform="translate(50 44) scale(1.32) translate(-50 -42)">`
      + P('M34 44 C34 27.5 41 21.5 50 21.5 C59 21.5 66 27.5 66 44 L66 61 L34 61Z', steel)
      + P('M34 44 C34 27.5 41 21.5 50 21.5 L50 61 L34 61Z', '#ffffff', 'opacity=".07"') + P('M58 26 C63 30 66 36 66 44 L66 61 L60 61Z', '#000', 'opacity=".14"')
      + P('M47.4 21.7 L52.6 21.7 L52.2 36.6 L47.8 36.6Z', red) + P('M36.4 32 L44 27 L45 31 L37.4 36Z', red) + P('M63.6 32 L56 27 L55 31 L62.6 36Z', red)
      + P('M37.5 37 L62.5 37 L62.5 42.5 L54 42.5 L54 57 L46 57 L46 42.5 L37.5 42.5Z', visor) + P('M39 38.4 L45 38.4', 'none', 'stroke="#6a8ab0" stroke-width=".7" opacity=".7"')
      + P('M39 24.5 C44 22.5 56 22.5 61 24.5', 'none', 'stroke="#fff" stroke-opacity=".5" stroke-width="1.2" stroke-linecap="round"')
      + R(35, 56, 30, 5, steelD) + L(37, 47, 37, 55, '#3a4452', 1.2) + L(63, 47, 63, 55, '#3a4452', 1.2)
      + L(66, 40, 70, 22, '#3a3d42', 1.2) + R(68, 19, 4, 5, '#3a3d42', 'rx=".8"') + `<g ${glow('#ff4a3a', 2)}>${C(70, 18.4, 1.1, '#ff4a3a')}</g>`
      + P('M34.4 36 C33 40 33 46 34.4 52', 'none', 'stroke="#ffb04a" stroke-width="1" opacity=".75"')
      + '</g>';
    // hammer resting on the shoulder
    o += L(80, 100, 90, 60, '#5a3a20', 2.6) + P('M84.6 52.6 L96.4 56 L94.6 62 L82.8 58.6Z', steel) + P('M85 53.2 L96 56.4', 'none', 'stroke="#fff" stroke-width=".7" opacity=".6"')
      + P('M78 96 C80 92 84 92 85 95 L83 100 L78 100Z', lg([[0, '#6a4024'], [1, '#2e1a0c']], 0, 0, 0, 1));
    return o;
  });

  // ---------- league badges ----------
  let uid = 0;
  const U = (p) => `hnb${p}${++uid}`;
  const METAL = {
    bronze: ['#ffd2a0', '#c0702e', '#5e2e0c', '#2a160a'],
    silver: ['#ffffff', '#b2bfce', '#56627a', '#101722'],
    gold: ['#fff4b8', '#ffd23f', '#9a6406', '#1c1408'],
    kyber: ['#ecffff', '#5fd8ff', '#1a56a8', '#06142a'],
  };
  const EMBLEM = {
    bronze: (g) => `<path d="M-11 11 L11 -11 M11 11 L-11 -11" stroke="url(#${g}m)" stroke-width="4" stroke-linecap="round"/><circle r="3" fill="url(#${g}m)"/>`,
    silver: (g) => `<path d="M0 -14 L4 -4 L14 -4 L6 3 L9 13 L0 7 L-9 13 L-6 3 L-14 -4 L-4 -4Z" fill="url(#${g}m)"/>`,
    gold: (g) => `<g fill="url(#${g}m)">${Array.from({ length: 12 }, (_, k) => `<path d="M0 -16 L2.2 -6 L-2.2 -6Z" transform="rotate(${k * 30})"/>`).join('')}<circle r="7"/></g><circle r="3.4" fill="#fff7d0"/>`,
    kyber: (g) => `<path d="M0 -17 L7 -3 L0 16 L-7 -3Z" fill="url(#${g}m)"/><path d="M0 -17 L7 -3 L0 -2Z" fill="#fff" opacity=".8"/><path d="M-10 -8 L-6 2 L-10 10 L-14 2Z M10 -8 L14 2 L10 10 L6 2Z" fill="url(#${g}m)" opacity=".7"/>`,
  };
  const NUM = ['I', 'II', 'III'];
  function badge(lgName, div) {
    if (lgName === 'legend') return legendBadge();
    const g = U('b');
    const [hi, mid, lo, core] = METAL[lgName];
    const wings = div >= 2 ? `<g fill="url(#${g}m)" stroke="${lo}" stroke-width=".6">${[-1, 1].map((s) => `<path transform="scale(${s} 1)" d="M24 -14 C40 -18 50 -10 54 -2 C46 -4 40 -2 36 2 C42 4 46 10 46 16 C40 12 33 12 28 14Z"/>${div >= 3 ? `<path transform="scale(${s} 1)" d="M26 6 C36 8 42 14 42 22 C36 18 30 18 26 20Z" opacity=".85"/>` : ''}`).join('')}</g>` : '';
    const laurel = div >= 3 ? `<g fill="none" stroke="${mid}" stroke-width="2.2" stroke-linecap="round">${[-1, 1].map((s) => `<g transform="scale(${s} 1)"><path d="M10 38 C22 36 30 28 32 16"/>${[0, 1, 2, 3].map((k) => `<ellipse cx="${14 + k * 5}" cy="${36 - k * 5.4}" rx="3.4" ry="1.6" transform="rotate(${-30 - k * 12} ${14 + k * 5} ${36 - k * 5.4})" fill="${mid}"/>`).join('')}</g>`).join('')}</g>` : '';
    const crown = div >= 3 ? `<g transform="translate(0 -40)"><path d="M-12 6 L-8 -6 L-3 2 L0 -9 L3 2 L8 -6 L12 6Z" fill="url(#${g}m)" stroke="${lo}" stroke-width=".6"/><circle cy="-10" r="2.6" fill="${lgName === 'kyber' ? '#ffffff' : '#ff4a5a'}"/></g>` : div === 2 ? `<circle cy="-36" r="3" fill="url(#${g}m)"/>` : '';
    const ribbon = `<g transform="translate(0 33)"><path d="M-20 -6 H20 L24 0 L20 6 H-20 L-24 0Z" fill="${core}" stroke="url(#${g}m)" stroke-width="1.4"/><text y="3.6" text-anchor="middle" font-family="Oxanium, sans-serif" font-weight="800" font-size="10" fill="${hi}" letter-spacing="1.5">${NUM[div - 1]}</text></g>`;
    return `<svg class="hn-badge" viewBox="-60 -56 120 100" aria-hidden="true"><defs>
      <linearGradient id="${g}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset=".45" stop-color="${mid}"/><stop offset="1" stop-color="${lo}"/></linearGradient>
      <radialGradient id="${g}c" cy=".35"><stop offset="0" stop-color="${mid}" stop-opacity=".35"/><stop offset="1" stop-color="${core}"/></radialGradient>
      <radialGradient id="${g}gl"><stop offset="0" stop-color="${mid}" stop-opacity="${0.12 + div * 0.1}"/><stop offset="1" stop-color="${mid}" stop-opacity="0"/></radialGradient></defs>
      <circle r="52" fill="url(#${g}gl)"/>${wings}${laurel}
      <path d="M0 -32 L26 -22 V2 C26 18 14 28 0 34 C-14 28 -26 18 -26 2 V-22Z" fill="url(#${g}m)"/>
      <path d="M0 -27 L21 -19 V2 C21 15 11 23 0 28 C-11 23 -21 15 -21 2 V-19Z" fill="url(#${g}c)"/>
      <path d="M0 -27 L21 -19 V-12 C10 -16 -10 -16 -21 -12 V-19Z" fill="#fff" opacity=".12"/>
      <g transform="translate(0 -1)">${EMBLEM[lgName](g)}</g>${crown}${ribbon}</svg>`;
  }
  // Legend moves with CSS (no SMIL), so it stays smooth everywhere.
  function legendBadge() {
    const g = U('L');
    return `<svg class="hn-badge legend" viewBox="-70 -64 140 120" aria-hidden="true"><defs>
      <linearGradient id="${g}m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2a0"/><stop offset=".35" stop-color="#ff8a5a"/><stop offset=".7" stop-color="#d84aff"/><stop offset="1" stop-color="#5a7aff"/></linearGradient>
      <radialGradient id="${g}c" cy=".35"><stop offset="0" stop-color="#3a1a5a"/><stop offset="1" stop-color="#0c0614"/></radialGradient>
      <radialGradient id="${g}gl"><stop offset="0" stop-color="#d84aff" stop-opacity=".5"/><stop offset="1" stop-color="#d84aff" stop-opacity="0"/></radialGradient></defs>
      <circle class="lb-pulse" r="60" fill="url(#${g}gl)"/>
      <g class="lb-spin">${Array.from({ length: 16 }, (_, k) => `<path d="M0 -60 L2.4 -48 L-2.4 -48Z" fill="url(#${g}m)" transform="rotate(${k * 22.5})" opacity=".8"/>`).join('')}</g>
      <g fill="url(#${g}m)" stroke="#2a0a3a" stroke-width=".6">${[-1, 1].map((s) => `<path transform="scale(${s} 1)" d="M26 -18 C46 -26 60 -16 64 -4 C54 -6 46 -4 42 0 C50 2 56 10 56 18 C48 12 40 12 34 14 C40 18 44 26 42 34 C36 28 30 26 26 26Z"/>`).join('')}</g>
      <path d="M0 -38 L30 -26 V2 C30 22 16 32 0 40 C-16 32 -30 22 -30 2 V-26Z" fill="url(#${g}m)"/>
      <path d="M0 -32 L25 -22 V2 C25 18 13 27 0 34 C-13 27 -25 18 -25 2 V-22Z" fill="url(#${g}c)"/>
      <path d="M-14 16 L14 -16" stroke="#7cc4ff" stroke-width="3.4" stroke-linecap="round"/><path d="M-14 16 L14 -16" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M14 16 L-14 -16" stroke="#ff4a5a" stroke-width="3.4" stroke-linecap="round"/><path d="M14 16 L-14 -16" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>
      <circle class="lb-core" r="4.4" fill="#fff"/>
      <g transform="translate(0 -48)"><path d="M-16 8 L-11 -8 L-4 3 L0 -12 L4 3 L11 -8 L16 8Z" fill="url(#${g}m)"/><circle cy="-13" r="3.2" fill="#fff"/></g>
      <g transform="translate(0 44)"><path d="M-30 -7 H30 L35 0 L30 7 H-30 L-35 0Z" fill="#0c0614" stroke="url(#${g}m)" stroke-width="1.6"/><text y="3.8" text-anchor="middle" font-family="Oxanium, sans-serif" font-weight="800" font-size="10" fill="#fff2a0" letter-spacing="2.4">LEGEND</text></g></svg>`;
  }

  root.HNArt = { puck, figure, TARGETS, ROSTER, TIER, badge, varka };
})(window);

// Update 2.2: 15 new bounty targets for the Forge and the Captured log, drawn
// in the same hologram bust style as the rest of the roster (hn-art.js).
// They join the roster only once 2.2 is live (root.Update22).
(function (root) {
  const { P, E, C, R, L } = root.ArtX;
  const A = root.HNArt;
  if (!A || !(root.Update22 && root.Update22.on())) return;
  const K = '#02141c';
  const ln = (c, w = 0.6, o = 0.9) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${o}"`;
  const H = (d, c) => P(d, c, `stroke="${c}" stroke-width=".7" stroke-opacity="1"`);
  const dk = (d, o = 0.6) => P(d, K, `opacity="${o}"`);
  const sh = (c, collar) => H('M30 52 C31 44 38 40 44 39 L56 39 C62 40 69 44 70 52Z', c) + (collar || '');
  const T = {
    // Greedo: Rodian with the trumpet snout, spines and his vest
    greedo: (c) => sh(c, H('M41 40 L46 52 L54 52 L59 40 L55 39 L50 46 L45 39Z', c) + P('M46 44 L46 50 M54 44 L54 50', 'none', ln(K, 0.5, 0.5)))
      + H('M41 21 C41 13.4 45 9.6 50 9.6 C55 9.6 59 13.4 59 21 C59 26 56.6 29.2 54.2 31.2 L53 33.6 C52 35.6 48 35.6 47 33.6 L45.8 31.2 C43.4 29.2 41 26 41 21Z', c)
      + H('M47.6 30 L52.4 30 L53.4 36.8 C51.6 38 48.4 38 46.6 36.8Z', c) + E(50, 36.6, 2.2, 0.9, K, 'opacity=".75"')
      + `<ellipse cx="45.4" cy="21" rx="3.6" ry="4.6" transform="rotate(-20 45.4 21)" fill="${K}" opacity=".82"/><ellipse cx="54.6" cy="21" rx="3.6" ry="4.6" transform="rotate(20 54.6 21)" fill="${K}" opacity=".82"/>`
      + C(44.3, 19.6, 0.9, c) + C(53.5, 19.6, 0.9, c)
      + P('M44 12 L42 8.4 M47 10.4 L46.4 6.8 M50 10 L50 6.4 M53 10.4 L53.6 6.8 M56 12 L58 8.4', 'none', ln(c, 0.8, 1))
      + P('M40.6 18 L37.4 15.6 M59.4 18 L62.6 15.6', 'none', ln(c, 0.9, 1)),
    // Ponda Baba: Aqualish, walrus face with downward tusks and small eyes up top
    ponda: (c) => sh(c, H('M40 40 C44 42 56 42 60 40 L58 47 L42 47Z', c))
      + H('M39 26 C38 16 43 10.4 50 10.4 C57 10.4 62 16 61 26 C60.6 32 58 36.6 54 38.4 L46 38.4 C42 36.6 39.4 32 39 26Z', c)
      + E(45.6, 18.4, 1.7, 1.3, K, 'opacity=".85"') + E(54.4, 18.4, 1.7, 1.3, K, 'opacity=".85"') + C(45.2, 18, 0.45, c) + C(54, 18, 0.45, c)
      + P('M42 15.4 C44.6 14 47.4 14.6 48.4 16 M58 15.4 C55.4 14 52.6 14.6 51.6 16', 'none', ln(K, 0.8, 0.7))
      + dk('M43 26 C45 23 55 23 57 26 C57 30 54 33 50 33 C46 33 43 30 43 26Z', 0.55)
      + H('M45.4 29.4 C45 33 45.6 37 46.8 40.4 C47.4 37 47.6 33 47.4 29.6Z M54.6 29.4 C55 33 54.4 37 53.2 40.4 C52.6 37 52.4 33 52.6 29.6Z', c)
      + P('M44 24.6 Q50 22.4 56 24.6', 'none', ln(c, 0.6, 0.9)) + [[42, 21], [58, 21], [41, 30], [59, 30]].map(([x, y]) => C(x, y, 0.6, K, 'opacity=".45"')).join(''),
    // Dr. Evazan: scarred human surgeon with a sneer
    evazan: (c) => sh(c, H('M43 38 L50 44 L57 38 L57 42 L50 48 L43 42Z', c))
      + H('M42 24 C42 15 45.6 11 50 11 C54.4 11 58 15 58 24 C58 31 55 37 50 37.4 C45 37 42 31 42 24Z', c)
      + H('M42 18.6 C42.6 12.4 46 10 50 10 C54 10 57.4 12.4 58 18.6 C55 15.6 52 15 50 15.4 C47 15 44.4 16 42 18.6Z', c)
      + E(46.6, 23.4, 1.2, 0.8, K) + E(53.4, 23.6, 1, 0.6, K) + P('M44.8 21.4 L48.4 22 M55.4 21.6 L52 22.2', 'none', ln(K, 0.8, 0.8))
      + P('M47 32 C48.6 30.8 51.6 31.4 53.6 30.4', 'none', ln(K, 0.8, 0.85))
      + P('M53 17.8 L54.8 22 L53.6 25.6 L56.2 30.6', 'none', ln('#ffffff', 0.8, 0.95)) + P('M53.4 19.6 L55.4 19.4 M54.6 23.4 L56.2 23.6 M54.4 27.6 L56.2 27', 'none', ln('#ffffff', 0.4, 0.8))
      + P('M49.6 25 L49.2 28 L50.8 28.2', 'none', ln(K, 0.5, 0.6)) + C(45, 28.4, 0.5, K, 'opacity=".5"') + C(44.2, 30, 0.4, K, 'opacity=".5"'),
    // Bib Fortuna: pale Twi'lek, lekku over the shoulder, robe collar, red eyes
    bib: (c) => sh(c, H('M38 41 L44 39 L50 47 L56 39 L62 41 L58 48 L42 48Z', c))
      + H('M42.6 26 C42 17 45.4 12 50 12 C54.6 12 58 17 57.4 26 C57 31.4 54.4 35.6 50 36 C45.6 35.6 43 31.4 42.6 26Z', c)
      + H('M44 16 C40 18 36 26 35.4 36 C35 42 36.6 47 38.4 50 L41.6 49 C40 44 40 38 41.6 30 C42.4 25 43.6 20 45.4 17Z', c)
      + H('M56 16 C60 19 62.4 26 62 33 C61.6 37 60 40 58 42 L56 40 C57.6 37 58 33 57.6 28Z', c)
      + `<g style="filter:drop-shadow(0 0 1.2px #ff6a5a)">${E(46.8, 24, 1.3, 0.8, '#ff6a5a')}${E(53.2, 24, 1.3, 0.8, '#ff6a5a')}</g>`
      + P('M45 22 L48.6 22.6 M55 22 L51.4 22.6', 'none', ln(K, 0.7, 0.75)) + P('M47 31 Q50 32.6 53 31', 'none', ln(K, 0.7, 0.8)) + P('M48.2 31.4 L48.6 32.8 M51.8 31.4 L51.4 32.8', 'none', ln(c, 0.4, 0.9))
      + P('M37.6 30 C38.4 34 38.6 40 38.2 46 M40 22 C38.6 24 37.8 27 37.6 30', 'none', ln(K, 0.5, 0.45)),
    // Ziro the Hutt: wide Hutt head, body tattoos and a jewelled headband
    ziro: (c) => H('M24 54 C24 44 30 38 38 37 L62 37 C70 38 76 44 76 54Z', c)
      + H('M33 28 C32 18 40 11.6 50 11.6 C60 11.6 68 18 67 28 C66.6 34 62 39 50 39.6 C38 39 33.4 34 33 28Z', c)
      + R(37, 15.6, 26, 2.6, K, 'opacity=".6" rx="1.2"') + C(50, 16.9, 1.6, c) + C(50, 16.9, 0.8, K, 'opacity=".7"')
      + E(42.6, 23, 2.4, 1.2, K, 'opacity=".85"') + E(57.4, 23, 2.4, 1.2, K, 'opacity=".85"') + L(42.6, 22, 42.6, 24, c, 0.6) + L(57.4, 22, 57.4, 24, c, 0.6)
      + P('M38 31 Q50 36.4 62 31', 'none', ln(K, 1, 0.85)) + E(48.4, 27.4, 0.6, 0.9, K) + E(51.6, 27.4, 0.6, 0.9, K)
      + P('M30 44 C33 42 36 43 37 46 M34 48 C36 47 38 48 38.6 50 M70 44 C67 42 64 43 63 46 M66 48 C64 47 62 48 61.4 50 M36 20 C38 19 39 20.4 38.4 22 M64 20 C62 19 61 20.4 61.6 22', 'none', ln(K, 0.6, 0.6)),
    // Hondo Ohnaka: Weequay pirate, goggles up on the head, braided head-tails, coat collar
    hondo: (c) => sh(c, H('M36 40 L42 38 L45 50 L38 52Z M64 40 L58 38 L55 50 L62 52Z', c) + P('M45 42 L55 42', 'none', ln(K, 0.6, 0.5)))
      + H('M43.4 26 C43 17 46 12.6 50 12.6 C54 12.6 57 17 56.6 26 C56.4 32 54 36.6 50 37.4 C46 36.6 43.6 32 43.4 26Z', c)
      + H('M42.4 17.6 C44 14.4 56 14.4 57.6 17.6 L57 20 L43 20Z', c) + C(46.4, 17.4, 2.2, K, 'opacity=".75"') + C(53.6, 17.4, 2.2, K, 'opacity=".75"') + C(46, 17, 0.7, c) + C(53.2, 17, 0.7, c)
      + E(47.4, 24, 1.2, 0.7, K) + E(52.6, 24, 1.2, 0.7, K) + [28, 30.6, 33.2].map((y) => P(`M45.4 ${y} Q50 ${y + 1.4} 54.6 ${y}`, 'none', ln(K, 0.45, 0.5))).join('')
      + P('M47.4 31.4 Q50 33.2 52.6 31.4', 'none', ln(K, 0.7, 0.8))
      + P('M44 22 C41 24 39.4 30 40 38 M56 22 C59 24 60.6 30 60 38', 'none', ln(c, 1.3, 1)) + [26, 30, 34].map((y) => C(40.2, y, 0.7, K, 'opacity=".5"') + C(59.8, y, 0.7, K, 'opacity=".5"')).join(''),
    // Cad Bane: wide-brimmed hat, breathing tubes, red eyes, tall collar
    cadbane: (c) => sh(c, H('M40 41 L42 33 L46 39 L54 39 L58 33 L60 41 L58 47 L42 47Z', c))
      + H('M43.6 26 C43.6 19.6 46.4 16.6 50 16.6 C53.6 16.6 56.4 19.6 56.4 26 C56.4 31.4 53.6 35.4 50 35.6 C46.4 35.4 43.6 31.4 43.6 26Z', c)
      + `<g style="filter:drop-shadow(0 0 1.3px #ff4a3a)">${E(47.4, 24.6, 1.4, 1, '#ff4a3a')}${E(52.6, 24.6, 1.4, 1, '#ff4a3a')}</g>`
      + P('M47.4 31.6 L52.6 31.6', 'none', ln(K, 0.7, 0.8)) + C(43.4, 28.6, 1.3, c) + C(56.6, 28.6, 1.3, c) + P('M43.4 29.8 C42.4 33 43 36 45 38.4 M56.6 29.8 C57.6 33 57 36 55 38.4', 'none', ln(c, 0.9, 1))
      + H('M30 18.6 C34 16.6 40 16 44 16.2 L44.6 9.6 C46 8 54 8 55.4 9.6 L56 16.2 C60 16 66 16.6 70 18.6 C66 20 60 20.4 50 20.4 C40 20.4 34 20 30 18.6Z', c)
      + P('M44.4 14 L55.6 14', 'none', ln(K, 1, 0.6)),
    // Dr. Pershing: Remnant cloning scientist, receding hair, implant on the temple
    pershing: (c) => sh(c, H('M41 39 L50 41 L59 39 L58 46 L42 46Z', c) + R(52.4, 42, 4.4, 2.4, K, 'opacity=".55" rx=".4"') + C(53.6, 43.2, 0.5, c) + C(55.4, 43.2, 0.5, c))
      + H('M42.4 24.6 C42.4 15.4 45.8 11.6 50 11.6 C54.2 11.6 57.6 15.4 57.6 24.6 C57.6 31.6 54.4 36.4 50 36.6 C45.6 36.4 42.4 31.6 42.4 24.6Z', c)
      + P('M42.6 20 C43 15 45 13.2 47 13 M57.4 20 C57 15 55 13.2 53 13', 'none', ln(K, 1.1, 0.55))
      + R(56.6, 20.4, 3.6, 5.4, c, 'rx=".8"') + R(57.4, 21.4, 2, 1.2, K, 'opacity=".7"') + `<g style="filter:drop-shadow(0 0 1px #8affc8)">${C(58.4, 24, 0.6, '#8affc8')}</g>`
      + E(47.2, 24.2, 1.1, 0.8, K) + E(52.8, 24.2, 1.1, 0.8, K) + P('M45.6 22.4 C46.6 21.8 48 21.8 48.8 22.4 M54.4 22.4 C53.4 21.8 52 21.8 51.2 22.4', 'none', ln(K, 0.6, 0.7))
      + P('M47.6 31.4 Q50 30.6 52.4 31.4', 'none', ln(K, 0.6, 0.75)) + P('M49.6 25.4 L49.2 28.4 L50.8 28.6', 'none', ln(K, 0.5, 0.6)),
    // Pyke Enforcer: long armoured skull with a crest, small high-set eyes, breather mask with hoses, plated shoulders
    pyke: (c) => H('M28 52 C29 45 34 41 40 40 L60 40 C66 41 71 45 72 52Z', c)
      + H('M30 47 C31 42 35 40 40 40 L42 46 C38 46 33 47 30 50Z M70 47 C69 42 65 40 60 40 L58 46 C62 46 67 47 70 50Z', c)
      + H('M41 41 L59 41 L57.6 48 L42.4 48Z', c) + [44.6, 48.2, 51.8, 55.4].map((x) => L(x, 42.4, x, 46.8, K, 0.5, 'opacity=".5"')).join('')
      + `<g transform="translate(0 3.4)">` + H('M43.2 29 C42 17 44.6 7.6 50 7.6 C55.4 7.6 58 17 56.8 29 L56 35.6 C54 38.6 46 38.6 44 35.6Z', c)
      + H('M47.6 8.6 C48.4 5.6 51.6 5.6 52.4 8.6 L51.6 18 L48.4 18Z', c) + P('M50 6 L50 18', 'none', ln(K, 0.5, 0.5))
      + P('M43.6 15 C46 13.4 54 13.4 56.4 15 M43.2 20 C46 18.6 54 18.6 56.8 20', 'none', ln(K, 0.55, 0.45))
      + dk('M44.6 21.6 C46.6 20.4 53.4 20.4 55.4 21.6 L54.8 24.6 C52.6 25.4 47.4 25.4 45.2 24.6Z', 0.85)
      + `<g style="filter:drop-shadow(0 0 1px #fff3a0)">${E(47.6, 22.9, 1, 0.55, '#fff3a0')}${E(52.4, 22.9, 1, 0.55, '#fff3a0')}</g>`
      + H('M45.4 27.4 C47 26.4 53 26.4 54.6 27.4 L54 34.4 C52.4 35.6 47.6 35.6 46 34.4Z', c) + [28.8, 30.6, 32.4].map((y) => L(47, y, 53, y, K, 0.5, 'opacity=".6"')).join('')
      + C(45.2, 31.4, 1.2, c) + C(54.8, 31.4, 1.2, c) + P('M45 32.6 C43.6 35.6 43.4 38.4 44 41.4 M55 32.6 C56.4 35.6 56.6 38.4 56 41.4', 'none', ln(c, 1, 1))
      + P('M45 33.6 C43.8 36 43.8 38.6 44.4 41 M55 33.6 C56.2 36 56.2 38.6 55.6 41', 'none', ln(K, 0.35, 0.4)) + '</g>',
    // Kowakian Monkey-Lizard: huge ears, wide cackling grin, tiny body
    crumb: (c) => H('M40 52 C40 45 44 41 50 41 C56 41 60 45 60 52Z', c)
      + H('M41 30 C40 22 44 17.4 50 17.4 C56 17.4 60 22 59 30 C58.6 36 55 40.4 50 40.6 C45 40.4 41.4 36 41 30Z', c)
      + H('M42 25 C36 21 30.6 21 28.4 23.6 C31 28 36 30 41.4 30Z M58 25 C64 21 69.4 21 71.6 23.6 C69 28 64 30 58.6 30Z', c)
      + P('M31.6 24 C35 25 38.4 27 40.4 28.4 M68.4 24 C65 25 61.6 27 59.6 28.4', 'none', ln(K, 0.5, 0.5))
      + C(46.4, 26.4, 1.6, K, 'opacity=".85"') + C(53.6, 26.4, 1.6, K, 'opacity=".85"') + C(46, 26, 0.5, c) + C(53.2, 26, 0.5, c)
      + P('M44 32.6 Q50 39 56 32.6 Q50 35.4 44 32.6Z', K, 'opacity=".8"') + [46, 48, 50, 52, 54].map((x) => P(`M${x} ${33.4 + Math.abs(x - 50) * -0.12} l.5 1.2 l.5 -1.2`, 'none', ln(c, 0.4, 0.95))).join('')
      + P('M48 18 C48.6 15.6 49.4 14 50 13.6 C50.6 14 51.4 15.6 52 18', 'none', ln(c, 0.7, 1)),
    // Ugnaught Smuggler: pig snout, white side whiskers, coverall collar
    ugnaught: (c) => sh(c, H('M42 39 L46 50 L54 50 L58 39Z', c) + P('M50 41 L50 50 M45 45 L55 45', 'none', ln(K, 0.5, 0.5)))
      + H('M41.6 25 C41.6 17 45 13 50 13 C55 13 58.4 17 58.4 25 C58.4 31.6 55 36.4 50 36.8 C45 36.4 41.6 31.6 41.6 25Z', c)
      + H('M41.6 25 C38 28 37.4 33 39.6 37.4 C41.4 35 43 33 44 30Z M58.4 25 C62 28 62.6 33 60.4 37.4 C58.6 35 57 33 56 30Z', c)
      + P('M39.6 30 L41.6 31.4 M39.4 33.4 L41.6 34 M60.4 30 L58.4 31.4 M60.6 33.4 L58.4 34', 'none', ln(K, 0.4, 0.45))
      + E(50, 26.6, 3.2, 2.4, c) + E(48.8, 26.6, 0.7, 1, K) + E(51.2, 26.6, 0.7, 1, K)
      + E(46.4, 21.8, 1, 0.8, K) + E(53.6, 21.8, 1, 0.8, K) + P('M44.6 19.6 L48 20.4 M55.4 19.6 L52 20.4', 'none', ln(K, 0.6, 0.6))
      + P('M47 31.8 Q50 33 53 31.8', 'none', ln(K, 0.6, 0.75)) + P('M43 14.4 L41.6 11.6 L45 13 M57 14.4 L58.4 11.6 L55 13', 'none', ln(c, 0.7, 1)),
    // Twi'lek Spice Runner: lekku down both sides, headband, flight-jacket collar
    twilek: (c) => sh(c, H('M38 40 L44 39 L47 50 L40 52Z M62 40 L56 39 L53 50 L60 52Z', c) + P('M44 44 L56 44', 'none', ln(K, 0.5, 0.45)))
      + H('M43 26 C42.4 17.4 45.6 12.6 50 12.6 C54.4 12.6 57.6 17.4 57 26 C56.6 31.6 54 35.6 50 36 C46 35.6 43.4 31.6 43 26Z', c)
      + H('M44 18 C40.6 22 39.6 30 40 40 C40.2 44 41 47 42 49 L44.4 48.4 C43.6 44 43.4 38 44.2 30 C44.6 25 45.4 21 46.4 18.6Z', c)
      + H('M56 18 C59.4 22 60.4 30 60 40 C59.8 44 59 47 58 49 L55.6 48.4 C56.4 44 56.6 38 55.8 30 C55.4 25 54.6 21 53.6 18.6Z', c)
      + R(43.4, 17.6, 13.2, 2.2, K, 'opacity=".6" rx="1"') + C(50, 18.7, 0.8, c)
      + E(47.2, 24.4, 1.2, 0.8, K) + E(52.8, 24.4, 1.2, 0.8, K) + C(46.9, 24.1, 0.35, c) + C(52.5, 24.1, 0.35, c)
      + P('M47.6 31 Q50 32.4 52.4 31', 'none', ln(K, 0.6, 0.8)) + P('M41.6 30 L42.6 30.6 M41.6 36 L42.8 36.4 M58.4 30 L57.4 30.6 M58.4 36 L57.2 36.4', 'none', ln(K, 0.5, 0.5)),
    // Duros Spacer: wide hairless cranium tapering to a narrow chin, big angled red eyes, no nose,
    // cheek ridges, a comm headset with mic boom, and a flight vest with harness straps
    duros: (c) => sh(c, H('M38 41 L44 38.6 L47.6 51 L40 52Z M62 41 L56 38.6 L52.4 51 L60 52Z', c)
        + P('M44.6 40 L48.4 52 M55.4 40 L51.6 52', 'none', ln(K, 0.9, 0.55)) + R(46.4, 45, 7.2, 3, K, 'opacity=".55" rx=".6"') + C(50, 46.5, 0.8, c)
        + R(57.6, 43.6, 3.4, 2.4, K, 'opacity=".5" rx=".4"'))
      + `<g transform="translate(0 3)">` + H('M38.4 19 C38.4 10.6 43.6 6.6 50 6.6 C56.4 6.6 61.6 10.6 61.6 19 C61.6 24.6 59.4 28.6 56.4 32 C54.4 34.6 52.6 37 50 37 C47.4 37 45.6 34.6 43.6 32 C40.6 28.6 38.4 24.6 38.4 19Z', c)
      + `<g style="filter:drop-shadow(0 0 1.3px #ff5a4a)"><path d="M40.4 19.4 C41.4 15.8 46.4 15.2 48.8 17.6 C49.4 21 47 24.2 43.4 24.2 C41.4 23.6 40.4 21.6 40.4 19.4Z" fill="#ff5a4a"/><path d="M59.6 19.4 C58.6 15.8 53.6 15.2 51.2 17.6 C50.6 21 53 24.2 56.6 24.2 C58.6 23.6 59.6 21.6 59.6 19.4Z" fill="#ff5a4a"/></g>`
      + E(44.8, 20.2, 1.8, 1.4, K, 'opacity=".55"') + E(55.2, 20.2, 1.8, 1.4, K, 'opacity=".55"') + C(44.4, 19.4, 0.4, '#fff') + C(54.4, 19.4, 0.4, '#fff')
      + P('M40 15 C43 13 47 13 49 15.6 M60 15 C57 13 53 13 51 15.6', 'none', ln(K, 0.9, 0.75))
      + P('M42.6 25.6 C44.4 28 46 29 47.4 29.4 M57.4 25.6 C55.6 28 54 29 52.6 29.4', 'none', ln(K, 0.6, 0.55))
      + P('M48.6 25.4 L49.2 26.2 M51.4 25.4 L50.8 26.2', 'none', ln(K, 0.45, 0.5)) + P('M47.4 31.8 L52.6 31.8', 'none', ln(K, 0.7, 0.85))
      + P('M43 10.6 C46.4 8.8 53.6 8.8 57 10.6 M41.2 13.4 C45 11.6 55 11.6 58.8 13.4', 'none', ln(K, 0.45, 0.35))
      + H('M60.4 16.4 C62.6 16.4 63.6 18 63.6 20.6 C63.6 23 62.6 24.4 60.6 24.4Z', c) + P('M62.4 23.6 C61.6 28 58.6 31 54.6 32', 'none', ln(c, 0.8, 1)) + C(54.2, 32.1, 0.9, c)
      + P('M39.6 15 C44 9 56 9 60.4 15', 'none', ln(c, 0.9, 0.9)) + '</g>',
    // Crimson Dawn Agent: hooded, masked lower face, the three-blade sigil
    crimson: (c) => H('M28 54 C30 44 36 38 42 36 L58 36 C64 38 70 44 72 54Z', c)
      + H('M38.6 32 C37 18 42 8.6 50 8.6 C58 8.6 63 18 61.4 32 L58.6 37 L41.4 37Z', c)
      + dk('M42.6 30 C41.6 20 45 14.4 50 14.4 C55 14.4 58.4 20 57.4 30 L55.6 35 L44.4 35Z', 0.7)
      + H('M44.6 22.4 C45.4 19.6 54.6 19.6 55.4 22.4 L55 25.4 L45 25.4Z', c) + E(47.6, 23, 1.1, 0.6, K) + E(52.4, 23, 1.1, 0.6, K)
      + H('M44.4 26.6 L55.6 26.6 L54.6 33.6 L45.4 33.6Z', c) + [47, 49, 51, 53].map((x) => L(x, 27.6, x, 32.6, K, 0.4, 'opacity=".5"')).join('')
      + `<g style="filter:drop-shadow(0 0 1.2px #ff4a5a)">${P('M50 41 L51 45 L54.4 46.8 L51 47 L50 50.6 L49 47 L45.6 46.8 L49 45Z', '#ff4a5a')}</g>`,
    // Black Sun Vigo: Falleen noble, scaled skin, topknot, high Black Sun collar
    vigo: (c) => H('M26 54 C28 44 35 38.6 42 37.4 L58 37.4 C65 38.6 72 44 74 54Z', c)
      + H('M38.4 40 L42 31 L46 38 L54 38 L58 31 L61.6 40 L58 45 L42 45Z', c)
      + H('M43 25 C43 16.6 46.2 12.6 50 12.6 C53.8 12.6 57 16.6 57 25 C57 31 54.2 35.4 50 35.6 C45.8 35.4 43 31 43 25Z', c)
      + H('M48 13.4 C48 9.6 49 7.6 50 7.6 C51 7.6 52 9.6 52 13.4Z', c) + P('M50 8 C53 9 56 12 57 17', 'none', ln(c, 1.2, 1)) + P('M57 17 C58 22 58 28 56.6 34', 'none', ln(c, 0.9, 0.9))
      + E(47.4, 23.6, 1.2, 0.7, K) + E(52.6, 23.6, 1.2, 0.7, K) + P('M45.8 21.6 L48.8 22.2 M54.2 21.6 L51.2 22.2', 'none', ln(K, 0.7, 0.8))
      + P('M47.6 30.6 Q50 31.6 52.4 30.6', 'none', ln(K, 0.6, 0.8))
      + [[45, 17], [47, 15.4], [53, 15.4], [55, 17], [44.6, 28], [55.4, 28], [46, 32], [54, 32]].map(([x, y]) => C(x, y, 0.5, K, 'opacity=".35"')).join('')
      + C(50, 46.4, 3, K, 'opacity=".7"') + [0, 45, 90, 135].map((a) => { const t = a * Math.PI / 180; return L(50 - 4.4 * Math.cos(t), 46.4 - 4.4 * Math.sin(t), 50 + 4.4 * Math.cos(t), 46.4 + 4.4 * Math.sin(t), c, 0.5); }).join('') + C(50, 46.4, 1.4, c),
  };
  const ROSTER = {
    greedo: { name: 'Greedo', tier: 'guild', bias: { trait: 'scoundrel' }, bounty: 1200, line: 'Owes Jabba, and shot second.' },
    ponda: { name: 'Ponda Baba', tier: 'guild', bias: { faction: 'dark', trait: 'scoundrel' }, bounty: 1000, line: 'Started a fight in the wrong cantina.' },
    crumb: { name: 'Kowakian Monkey-Lizard', tier: 'guild', bias: { trait: 'scoundrel' }, bounty: 600, line: 'Stole a Hutt\'s dinner. Cackled about it.' },
    ugnaught: { name: 'Ugnaught Smuggler', tier: 'guild', bias: { trait: 'droid' }, bounty: 800, line: 'Running Tibanna gas out of Cloud City.' },
    duros: { name: 'Duros Spacer', tier: 'guild', bias: { faction: 'light' }, bounty: 900, line: 'Flew a stolen freighter through a blockade.' },
    evazan: { name: 'Dr. Evazan', tier: 'elite', bias: { faction: 'dark' }, bounty: 4600, line: 'The death sentence on twelve systems.' },
    twilek: { name: 'Twi\'lek Spice Runner', tier: 'elite', bias: { trait: 'scoundrel' }, bounty: 4000, line: 'Dumped a Pyke shipment and ran.' },
    pyke: { name: 'Pyke Enforcer', tier: 'elite', bias: { faction: 'dark' }, bounty: 4400, line: 'Collects spice debts the hard way.' },
    pershing: { name: 'Dr. Pershing', tier: 'elite', bias: { faction: 'dark', trait: 'empire' }, bounty: 5200, line: 'Wanted alive. The client insists.' },
    bib: { name: 'Bib Fortuna', tier: 'elite', bias: { faction: 'dark', trait: 'leader' }, bounty: 5000, line: 'Took Jabba\'s throne while no one was looking.' },
    ziro: { name: 'Ziro the Hutt', tier: 'high', bias: { faction: 'dark', trait: 'leader' }, bounty: 20000, line: 'Broke out of a Republic prison. Again.' },
    hondo: { name: 'Hondo Ohnaka', tier: 'high', bias: { trait: 'scoundrel' }, bounty: 16000, line: 'Says it\'s nothing personal. It\'s always personal.' },
    crimson: { name: 'Crimson Dawn Agent', tier: 'high', bias: { faction: 'dark' }, bounty: 19000, line: 'Nobody has seen the face under the mask.' },
    cadbane: { name: 'Cad Bane', tier: 'legend', bias: { trait: 'bounty' }, bounty: 70000, line: 'The fastest draw in the Outer Rim.' },
    vigo: { name: 'Black Sun Vigo', tier: 'gold', bias: { faction: 'dark', trait: 'leader' }, bounty: 140000, line: 'Runs a third of Black Sun from the shadows.' },
  };
  Object.assign(A.TARGETS, T);
  Object.assign(A.ROSTER, ROSTER);
})(window);

// HoloNet Arena core (tester build only): cards, bosses, saved state, the
// shared tester database, arena maths, raid mechanics and engine hooks.
(function (root) {
  'use strict';
  const D = root.GameData;

  // ---------- cards: HoloNet-only, never in crates or the main Collection ----------
  const HN_IDS = ['hn_krrsantan', 'hn_pre_vizsla', 'hn_armorer', 'hn_fennec', 'hn_aurra', 'hn_paz', 'hn_embo', 'hn_fang', 'hn_gauntlet', 'hn_outrider'];
  const HOW = {
    hn_krrsantan: 'Raid champion: top damage when a raid boss falls',
    hn_pre_vizsla: 'Reach the Legend league',
    hn_armorer: "Varka's Forge · Beskar",
    hn_fennec: 'Reach the Gold league',
    hn_aurra: 'Raid reward (chance when a boss falls)',
    hn_paz: "Varka's Forge · Beskar",
    hn_embo: 'Reach the Silver league',
    hn_fang: 'Raid reward (chance when a boss falls)',
    hn_gauntlet: 'Reach the Legend league',
    hn_outrider: "Varka's Forge · Kyber",
  };
  const SIGS = {
    hn_krrsantan: { move: 'shockwave', prop: 'roar', impact: 'stamp', color: '#c88a4a' },
    hn_pre_vizsla: { move: 'sweep', prop: 'saber', impact: 'xslash', color: '#e8f0ff' },
    hn_armorer: { move: 'aegis', prop: 'deflector', color: '#ffb05a' },
    hn_fennec: { move: 'beam', prop: 'bolt', impact: 'knock', color: '#ff7a3a' },
    hn_aurra: { move: 'ricochet', prop: 'bolt', impact: 'scorch', color: '#ff3a4a', n: 3 },
    hn_paz: { move: 'volley', prop: 'bolt', impact: 'burn', color: '#5a9aff', n: 6 },
    hn_embo: { move: 'dive', prop: 'card', impact: 'spin', color: '#d8b070' },
    hn_fang: { move: 'flyby', prop: 'ship', impact: 'scorch', color: '#ff9a3a' },
    hn_gauntlet: { move: 'carpet', prop: 'bomb', impact: 'crush', color: '#ff5a3a' },
    hn_outrider: { move: 'loop', prop: 'ship', impact: 'knock', color: '#8fd4ff' },
  };
  for (const id of HN_IDS) {
    const def = D.UNIT_MAP[id];
    if (!def) continue;
    def.hn = true;
    def.sig = SIGS[id];
  }

  // ---------- raid bosses and their minions ----------
  const dmg = (mult, hits) => ({ type: 'damage', mult, hits: hits || 1 });
  const heal = (pct) => ({ type: 'heal', pct });
  const buff = (status, turns) => ({ type: 'status', status, turns, chance: 1 });
  const debuff = (status, turns, chance) => ({ type: 'status', status, turns, chance: chance == null ? 1 : chance });
  const ab = (name, cd, target, effects, desc) => ({ name, cd, target, effects, desc });
  const ult = (name, target, effects, desc, quote) => ({ name, cd: 0, target, effects, desc, quote, ultimate: true });

  D.STATUS_INFO.grabbed = { label: 'Grabbed', icon: '⛓', kind: 'debuff', desc: 'Held by the boss. Loses its turns until the minions holding it are beaten.' };
  D.STATUS_INFO.pit = { label: 'In the pit', icon: '▼', kind: 'debuff', desc: 'Dropped through Jabba\'s trapdoor. Out of the fight until the henchmen fall.' };
  D.STATUS_INFO.mind = { label: 'Mind bridged', icon: '☯', kind: 'debuff', desc: 'Snoke controls this card on its next turn: it attacks its own squad.' };

  const MINIONS = [
    { id: 'hn_chest', name: 'Jabba\'s Credit Chest', role: 'tank', spd: 40, abilities: [ab('Gilded Lock', 0, 'self', [buff('defUp', 2)], 'Hardens its lock.')], ultimate: ult('Hoard', 'self', [heal(0.2)], 'Counts its credits.', '') },
    { id: 'hn_husk', name: 'Husk', role: 'attacker', spd: 110, abilities: [ab('Hollow Claw', 0, 'enemy', [dmg(0.9)], 'An empty, hungry strike.')], ultimate: ult('Feed the Master', 'enemy', [dmg(1.6)], 'Tears at one enemy.', '') },
    { id: 'hn_tentacle', name: 'Sarlacc Tentacle', role: 'tank', spd: 90, abilities: [ab('Lash', 0, 'enemy', [dmg(0.8)], 'Whips one enemy.')], ultimate: ult('Constrict', 'enemy', [dmg(1.4), debuff('stun', 1, 0.5)], 'Squeezes one enemy.', '') },
    { id: 'hn_praetorian', name: 'Praetorian Guard', role: 'tank', spd: 128, abilities: [ab('Vibro-Voulge', 0, 'enemy', [dmg(1.0)], 'Precise, crimson strike.'), ab('Guard Stance', 3, 'self', [buff('taunt', 2), buff('defUp', 2)], 'Protects the Supreme Leader.')], ultimate: ult('Bladestorm', 'allEnemies', [dmg(1.0)], 'Spinning blades.', '') },
  ];
  for (const m of MINIONS) {
    if (D.UNIT_MAP[m.id]) continue;
    Object.assign(m, { kind: 'character', faction: 'dark', rarity: 'legendary', traits: [], home: 'tatooine', hn: true, minion: true });
    D.UNIT_MAP[m.id] = m;
  }

  const RAIDS = [
    {
      id: 'raid_jabba', name: 'Jabba the Hutt', sub: 'Crime lord of Tatooine', planet: 'tatooine', pool: 900000, color: '#ffb05a',
      slots: ['tusken_raider', 'jawa', 'raid_jabba', 'hn_chest', 'boba_fett'], start: [0, 2, 3],
      mech: [['Bounty Hunters for Hire', 'Every 2 turns Jabba pays a new henchman to join the fight.'], ['Trapdoor', 'Drops a random card into the pit below the throne. It\'s out until the henchmen are beaten.'], ['Bargain', 'At 50% health Jabba buys back his fallen henchmen, unless you break his credit chest first.']],
    },
    {
      id: 'raid_nihilus', name: 'Darth Nihilus', sub: 'Lord of Hunger', planet: 'exegol', pool: 700000, color: '#b070ff',
      slots: ['hn_husk', 'hn_husk', 'raid_nihilus', 'hn_husk', 'hn_husk'], start: [2],
      mech: [['Destroyer of Worlds', 'Every turn drains 5% health from all your cards and heals himself. The battlefield darkens as he feeds.'], ['Wound in the Force', 'Fallen cards rise on his side as Husks.'], ['Phase 2 at 50%', 'The void spreads: the drain doubles.']],
    },
    {
      id: 'raid_sarlacc', name: 'The Sarlacc', sub: 'Great Pit of Carkoon', planet: 'tatooine', pool: 800000, color: '#e0b070',
      slots: ['hn_tentacle', 'hn_tentacle', 'raid_sarlacc', 'hn_tentacle', 'hn_tentacle'], start: [0, 2, 4],
      mech: [['Tentacle Grab', 'Drags a card into the pit. It\'s out until the tentacles are destroyed.'], ['Spawning Tendrils', 'Grows a new tentacle every 2 turns.'], ['Digest', 'A card held for 3 of its turns is wiped out.']],
    },
    {
      id: 'raid_snoke', name: 'Supreme Leader Snoke', sub: 'Throne room of the Supremacy', planet: 'mustafar', pool: 750000, color: '#ff3a3a',
      slots: ['hn_praetorian', 'hn_praetorian', 'raid_snoke', 'hn_praetorian', 'hn_praetorian'], start: [0, 1, 2, 3, 4],
      mech: [['Praetorian Guard', 'Starts with four Praetorian Guards. A fallen one steps back in every 3 turns.'], ['Bridge the Minds', 'Takes control of a card for a turn and turns it against your squad.'], ['Supreme Will', 'Every 4 turns revives every fallen guard, unless Snoke took an ultimate since his last turn.']],
    },
  ];
  // Update 2.2 (switch in js/friends.js, off until the 2.2 date is set): raid bosses get at
  // least 5,000,000 health and hit much harder; their guards hit a bit harder.
  const v22 = () => !!(root.Update22 && root.Update22.on());
  const RAID_HP_MIN = 5000000;
  const RAID_BOSS_ATK = 1.6;
  const RAID_GUARD_ATK = 1.25;
  const toughPool = (r) => {
    const base = r.pool;
    Object.defineProperty(r, 'pool', { enumerable: true, get: () => (v22() ? Math.max(RAID_HP_MIN, base * 7) : base) });
  };
  for (const r of RAIDS) toughPool(r);
  // Applied in the raid battle setup.
  const raidToughen = (b, bossId) => {
    if (!v22()) return;
    b.side('enemy').forEach((u) => { u.atk = Math.round(u.atk * (u.id === bossId ? RAID_BOSS_ATK : RAID_GUARD_ATK)); });
  };
  const BOSS_KIT = {
    raid_jabba: { role: 'tank', spd: 88, abilities: [ab('Tail Slam', 0, 'enemy', [dmg(1.3)], 'Crushes one enemy.'), ab('Mocking Laughter', 3, 'allEnemies', [debuff('offDown', 2, 0.7)], 'Ho ho ho. Offense Down on every enemy.')], ultimate: ult('Bounty on Your Heads', 'allEnemies', [dmg(1.7), debuff('defDown', 2)], 'Puts a price on everyone: heavy damage and Defense Down.', 'Bo shuda!') },
    raid_nihilus: { role: 'attacker', spd: 136, abilities: [ab('Void Strike', 0, 'enemy', [dmg(1.4)], 'A strike that empties the target.'), ab('Drain Life', 3, 'enemy', [dmg(1.8), { ...heal(0.04), on: 'self' }], 'Drinks one enemy\'s life.')], ultimate: ult('Feast on the World', 'allEnemies', [dmg(2.0), { ...heal(0.06), on: 'self' }], 'Tears the life out of every enemy and feeds on it.', '…') },
    raid_sarlacc: { role: 'tank', spd: 70, abilities: [ab('Acid Spray', 0, 'allEnemies', [dmg(0.8), debuff('burn', 2, 0.4)], 'Digestive acid over everyone.'), ab('Quake', 3, 'allEnemies', [dmg(0.6), debuff('stun', 1, 0.3)], 'The pit heaves.')], ultimate: ult('Swallow', 'allEnemies', [dmg(2.0)], 'The beak opens and the whole pit pulls inward.', '') },
    raid_snoke: { role: 'support', spd: 120, abilities: [ab('Force Lightning', 0, 'enemy', [dmg(1.3), debuff('stun', 1, 0.25)], 'Lightning from the throne.'), ab('Supreme Command', 3, 'allAllies', [buff('offUp', 2)], 'His guards strike harder.')], ultimate: ult('Bow Before Me', 'allEnemies', [dmg(1.8), debuff('offDown', 2)], 'Pulls every enemy to its knees.', 'Pathetic.') },
  };
  for (const r of RAIDS) {
    const def = D.UNIT_MAP[r.id];
    if (!def) continue;
    Object.assign(def, BOSS_KIT[r.id], { hn: true, raid: r.id, boss: { hp: 1, atk: 1.6, def: 1.4 }, hnUlt: true });
  }

  // ---------- saved state ----------
  // Tester sessions (the HOLOTESTER code on the live site) keep their HoloNet
  // progress in a separate save slot, so none of it carries into the real
  // HoloNet at launch. They also spend tester Kyber and never add account XP or
  // cards to the main game.
  const BETA = !!root.__hnBeta;
  const SLOT = BETA ? 'hnBeta' : 'hn';
  const S = () => {
    const s = Player.state;
    const base = { seen: false, beskar: 0, rating: 800, best: 800, streak: 0, wins: 0, losses: 0, cards: {}, squads: {}, divs: ['bronze1'], leagues: [], captured: {}, raids: {}, beaten: {}, seed: 1, board: null, stockDay: null, bought: {}, badges: {}, ...(BETA ? { kyber: 3000, loot: {} } : {}) };
    // Fill in missing fields in place: callers hold on to this object.
    if (!s[SLOT]) s[SLOT] = base;
    else for (const k of Object.keys(base)) if (!(k in s[SLOT])) s[SLOT][k] = base[k];
    return s[SLOT];
  };
  // Account XP from the HoloNet (none in tester sessions).
  const xp = (n) => { if (!BETA) Player.gainXp(n); };
  // A main-game card won in the HoloNet: added for real, or noted on the tester slot.
  const grantBase = (id, holo) => {
    if (!BETA) return Player.grantCard(id, holo);
    const l = S().loot;
    const isNew = !l[id] && !Player.owns(id);
    l[id] = (l[id] || 0) + 1;
    return { id, isNew, shards: isNew ? 0 : 5 };
  };
  const save = () => Player.save();
  const owns = (id) => !!S().cards[id];
  const card = (id) => S().cards[id] || null;
  const grant = (id) => {
    const c = S().cards;
    if (!c[id]) { c[id] = { level: 1, stars: 1, shards: 0 }; return { id, isNew: true, shards: 0 }; }
    const shards = D.DUPLICATE_SHARDS[D.UNIT_MAP[id].rarity];
    c[id].shards += shards;
    return { id, isNew: false, shards };
  };

  // ---------- leagues ----------
  const LEAGUES = [
    { id: 'bronze', name: 'Bronze', min: 800 }, { id: 'silver', name: 'Silver', min: 1150 },
    { id: 'gold', name: 'Gold', min: 1450 }, { id: 'kyber', name: 'Kyber', min: 1750 }, { id: 'legend', name: 'Legend', min: 2100 },
  ];
  const DIVS = [];
  LEAGUES.forEach((l, i) => {
    if (l.id === 'legend') { DIVS.push({ key: 'legend', league: l.id, name: 'Legend', div: 1, min: l.min }); return; }
    const next = LEAGUES[i + 1].min;
    const step = (next - l.min) / 3;
    for (let d = 1; d <= 3; d++) DIVS.push({ key: `${l.id}${d}`, league: l.id, name: `${l.name} ${['I', 'II', 'III'][d - 1]}`, div: d, min: Math.round(l.min + step * (d - 1)) });
  });
  DIVS.forEach((d, i) => { d.beskar = d.league === 'legend' ? 2000 : Math.round(100 + (1100 * i) / 11); });
  const divOf = (rating) => [...DIVS].reverse().find((d) => rating >= d.min) || DIVS[0];
  const LEAGUE_REWARD = { silver: { puck: 'guild', card: 'hn_embo' }, gold: { puck: 'elite', card: 'hn_fennec' }, kyber: { puck: 'high' }, legend: { puck: 'legend', cards: ['hn_pre_vizsla', 'hn_gauntlet'] } };

  // ---------- squads ----------
  const entry = (id) => {
    const u = card(id) || Player.unit(id);
    return u ? { id, level: u.level, stars: u.stars } : null;
  };
  const pool = (kind) => [
    ...D.UNITS.filter((u) => u.kind === kind && Player.owns(u.id)),
    ...HN_IDS.map((id) => D.UNIT_MAP[id]).filter((u) => u && u.kind === kind && owns(u.id)),
  ];
  const powerOf = (id) => { const e = entry(id); return e ? D.power(D.UNIT_MAP[id], e.level, e.stars) : 0; };
  function squad(kind) {
    const saved = (S().squads[kind] || []).filter((id) => D.UNIT_MAP[id] && D.UNIT_MAP[id].kind === kind && entry(id));
    if (saved.length) return saved.slice(0, 5);
    return pool(kind).sort((a, b) => powerOf(b.id) - powerOf(a.id)).slice(0, 5).map((u) => u.id);
  }
  const squadEntries = (kind) => squad(kind).map(entry).filter(Boolean);
  const squadPower = (entries) => entries.reduce((a, e) => a + D.power(D.UNIT_MAP[e.id], e.level, e.stars), 0);
  const avgLevel = (entries) => (entries.length ? entries.reduce((a, e) => a + e.level, 0) / entries.length : 10);

  // ---------- seeded randomness (shared fights replay identically later) ----------
  function rng(seed) {
    let t = seed >>> 0;
    return () => { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; };
  }

  // ---------- the shared online database ----------
  // Nothing loads until a level 25+ player opens the HoloNet. Each screen then
  // asks only for what it shows: the top 25 and the 25 nearest your rating
  // (arena and leaderboards), the top 25 raid damage this week, your own guild's
  // members, and the guild leaderboard. Every row lands in one shared cache
  // (Net.arena / Net.raid) so profiles, guilds and raids read from the same place.
  // With no database (a preview, or signed out) everything runs solo with bots.
  const FRESH = 60000;
  const Net = {
    db: null, user: null, me: null, arena: [], raid: [], names: {}, ready: false, listeners: [], started: false,
    rows: new Map(), raidRows: new Map(), fetched: {}, subs: {},
    // status: idle -> connecting -> online, or offline (no connection, or the
    // HoloNet couldn't be reached). Offline shows the offline screen; the rest
    // of the game never waits on any of this.
    status: 'idle',
    async init() {
      if (this.started) return;
      // After a failed attempt, opening screens doesn't hammer the relay: wait a few seconds.
      if (this.status === 'offline' && Date.now() - (this.failAt || 0) < 8000) return;
      this.started = true;
      this.status = 'connecting';
      this.emit();
      try {
        if (typeof navigator !== 'undefined' && navigator.onLine === false) throw new Error('offline');
        if (!root.claude || !root.claude.use) throw new Error('no db');
        const [db, user] = await Promise.all([root.claude.use('db'), root.claude.use('user')]);
        if (!db || !user) throw new Error('no db');
        const me = await user.id();
        if (!me) throw new Error('signed out');
        this.db = db; this.user = user; this.me = me; this.ready = true;
        this.status = 'online';
        this.publish();
      } catch (e) {
        this.status = 'offline';
        this.failAt = Date.now();
        this.started = false;
      }
      this.emit();
    },
    async retry() { if (this.ready) { this.status = 'online'; this.emit(); return; } this.started = false; this.failAt = 0; if (root.__hnLoadFb && !(root.claude && root.claude.use)) await root.__hnLoadFb(); return this.init(); },
    // Merge fetched arena docs into the cache. `scope` replaces rows that
    // left a live query (a member who left the guild).
    merge(docs, map, scope) {
      if (scope) for (const [uid, r] of map) if (r.__s === scope && !docs.some((d) => d.id === uid)) map.delete(uid);
      for (const d of docs) if (d.data()) map.set(d.id, { ...(map.get(d.id) || {}), ...d.data(), uid: d.id, __s: scope || (map.get(d.id) || {}).__s });
    },
    sync() { this.arena = [...this.rows.values()]; this.raid = [...this.raidRows.values()]; this.resolveNames(); this.emit(); },
    // One-off reads, refreshed at most once a minute per kind.
    async want(kind, force) {
      if (!this.ready) return;
      const now = Date.now();
      if (!force && this.fetched[kind] && now - this.fetched[kind] < FRESH) return;
      this.fetched[kind] = now;
      const col = (c) => this.db.collection(c);
      try {
        if (kind === 'arena') {
          const r = S().rating;
          const [top, near] = await Promise.all([
            col('arena').orderBy('rating', 'desc').limit(25).get(),
            col('arena').where('rating', '<=', r + 150).orderBy('rating', 'desc').limit(25).get(),
          ]);
          this.merge([...top.docs, ...near.docs], this.rows);
        } else if (kind === 'duels') {
          this.merge((await col('arena').orderBy('dw', 'desc').limit(25).get()).docs, this.rows);
        } else if (kind === 'raid') {
          this.merge((await col('raid').orderBy('score', 'desc').limit(25).get()).docs, this.raidRows);
        }
        this.sync();
      } catch (e) { this.fetched[kind] = 0; }
    },
    // A live query kept open while it matters (your guild's members and chat).
    live(key, query, map, onDocs) {
      if (!this.ready) return;
      if (this.subs[key] && this.subs[key].q === query.sig) return;
      if (this.subs[key]) { try { this.subs[key].off(); } catch (e) { /* ignore */ } }
      const off = query.ref.onSnapshot((snap) => { if (map) { this.merge(snap.docs, map, key); this.sync(); } if (onDocs) onDocs(snap.docs); }, () => {});
      this.subs[key] = { q: query.sig, off };
    },
    stop(key) { if (this.subs[key]) { try { this.subs[key].off(); } catch (e) { /* ignore */ } delete this.subs[key]; } },
    // One player's doc, for a profile opened from somewhere we haven't loaded.
    async fetchOne(uid) {
      if (!this.ready || !uid || this.rows.has(uid)) return this.rows.get(uid) || null;
      try { const d = await this.db.doc(`arena/${uid}`).get(); if (d && d.exists !== false && d.data()) { this.merge([d], this.rows); this.sync(); } } catch (e) { /* ignore */ }
      return this.rows.get(uid) || null;
    },
    on(fn) { this.listeners.push(fn); },
    emit() { for (const fn of this.listeners) { try { fn(); } catch (e) { /* ignore */ } } },
    async resolveNames() {
      if (!this.user || !this.user.profiles) return;
      const ids = [...new Set([...this.arena, ...this.raid].map((r) => r.uid))].filter((id) => !(id in this.names));
      if (!ids.length) return;
      ids.forEach((id) => { this.names[id] = this.names[id] || ''; });
      try {
        const ps = await this.user.profiles(ids);
        for (const id of ids) this.names[id] = (ps[id] && ps[id].name) || this.names[id] || '';
        this.emit();
      } catch (e) { /* names are optional */ }
    },
    name(uid) { return uid === this.me ? 'You' : (this.names[uid] || (uid ? `Pilot ${String(uid).replace(/[^A-Za-z0-9]/g, '').slice(-4).toUpperCase()}` : 'Player')); },
    busy: false, again: false,
    // Write my defense squads and rating: one write at a time, only when it changed.
    async publish() {
      // Below level 25 (a saved account setting up its profile early) nothing goes on the board.
      if (!this.ready || (HN.ui && !HN.ui.unlocked())) return;
      if (this.busy) { this.again = true; return; }
      const h = S();
      const body = { rating: h.rating, ground: squadEntries('character'), fleet: squadEntries('ship'), level: Player.state.account.level, updated: Date.now() };
      const key = JSON.stringify([body.rating, body.ground, body.fleet, body.level]);
      if (key === this.lastKey) return;
      this.busy = true;
      try { await this.db.doc(`arena/${this.me}`).set(body); this.lastKey = key; } catch (e) { /* retry next time */ }
      this.busy = false;
      if (this.again) { this.again = false; this.publish(); }
    },
    async addRaid(wk, boss, amount) {
      if (!this.ready || amount <= 0) return;
      const mine = this.raidRows.get(this.me);
      const local = S().raids[`${wk}:${boss}`];
      const same = mine && mine.week === wk && mine.boss === boss;
      const dmg = Math.max(local ? local.dmg : 0, (same ? mine.dmg : 0) + amount);
      // score sorts this week's damage above every older week in one ordered query.
      const body = { week: wk, boss, dmg, best: Math.max(same ? mine.best || 0 : 0, amount), score: wk * 1e9 + dmg, updated: Date.now() };
      this.raidRows.set(this.me, { ...body, uid: this.me });
      this.sync();
      try { await this.db.doc(`raid/${this.me}`).set(body); } catch (e) { /* ignore */ }
    },
  };

  // ---------- arena opponents ----------
  // Gamer tags like real players pick; opponents rotate through them.
  const BOT_NAMES = ['KesselRunner12', 'xXSithLordXx', 'MandoMike', 'wookiee_wendy', 'Lukewarm', 'DarthVapor99', 'jedi_jess', 'TIEfighterTom', 'NerfHerder', 'HanShotFirst', 'BobaFettish', 'rebel_rachel', 'ObiWanKenobae', 'Sabine_Fan', 'GrogusDad', 'ackbar_trapped', 'Tatooine_Tyler', 'kyber_kat', 'StormtrooperAim', 'Hoth_Hannah', 'R2_D2_Dee', 'MaulMadness', 'yoda_best', 'AhsokaNotSorry', 'BeskarBen', 'Endor_Ewoker', 'thrawn_tactics', 'Jango_Jen', 'Chewie_Chris', 'ForceGhostGabe', 'PadmeMe', 'Rancor_Ryan', 'Lando_Lewis', 'DinDjarinDan', 'Starkiller88', 'quigon_quinn', 'Ezra_Elli', 'PoeDameronFan', 'Mustafar_Max', 'Jyn_Erso_Jo'];
  function botSquad(kind, rating, r) {
    const mine = squadEntries(kind);
    const f = Math.pow(rating / Math.max(600, S().rating), 0.8);
    const lvl = Math.max(1, Math.min(D.MAX_LEVEL || 30, Math.round(avgLevel(mine) * f + (r() - 0.5) * 2)));
    const avail = D.UNITS.filter((u) => u.kind === kind && !u.exclusive && !u.boss);
    const picks = [];
    while (picks.length < 5 && avail.length) picks.push(avail.splice(Math.floor(r() * avail.length), 1)[0].id);
    const stars = Math.max(1, Math.min(7, Math.round(2 + (rating - 1000) / 250 + r())));
    return picks.map((id) => ({ id, level: lvl, stars }));
  }
  function opponents(kind) {
    const h = S();
    const key = kind === 'ship' ? 'fleet' : 'ground';
    const out = [];
    const real = Net.arena.filter((a) => a.uid !== Net.me && Array.isArray(a[key]) && a[key].length && a[key].every((e) => D.UNIT_MAP[e.id]))
      .sort((a, b) => Math.abs(a.rating - h.rating) - Math.abs(b.rating - h.rating)).slice(0, 2);
    for (const a of real) out.push({ id: `p:${a.uid}`, name: Net.name(a.uid), real: true, rating: a.rating, squad: a[key] });
    const r = rng(h.seed * 7919 + (kind === 'ship' ? 13 : 0));
    const offsets = [-140, 30, 210, 90];
    for (let i = 0; out.length < 4; i++) {
      const rating = Math.max(400, Math.round(h.rating + offsets[i % offsets.length] + (r() - 0.5) * 60));
      out.push({ id: `b:${i}`, name: BOT_NAMES[Math.floor(r() * BOT_NAMES.length)], real: false, rating, squad: botSquad(kind, rating, r) });
    }
    return out.map((o) => ({ ...o, payout: payout(o.rating), power: squadPower(o.squad) }));
  }
  // payout = 40 × clamp((their ÷ yours)², 0.5, 2.5) × (1 + 0.05 × streak)
  const payout = (their, streak) => {
    const h = S();
    const s = streak == null ? h.streak : streak;
    return Math.round(40 * Math.min(2.5, Math.max(0.5, (their / h.rating) ** 2)) * (1 + 0.05 * Math.min(5, s)));
  };
  const expected = (a, b) => 1 / (1 + 10 ** ((b - a) / 400));

  // Record an arena result: rating, streak, Beskar, and any new division.
  function arenaResult(opp, won) {
    const h = S();
    const before = divOf(h.rating);
    const e = expected(h.rating, opp.rating);
    const delta = won ? Math.max(6, Math.round(36 * (1 - e))) : -Math.max(4, Math.round(28 * e));
    const bes = won ? payout(opp.rating, h.streak) : 0;
    const streakBefore = h.streak;
    h.rating = Math.max(0, h.rating + delta);
    h.best = Math.max(h.best, h.rating);
    if (won) { h.wins += 1; h.streak += 1; } else { h.losses += 1; h.streak = 0; }
    h.beskar += bes;
    h.seed += 1;
    const after = divOf(h.rating);
    const rewards = claimDivisions();
    xp(won ? 60 : 15);
    save();
    Net.publish();
    return { won, delta, beskar: bes, streak: h.streak, streakBefore, before, after, rewards };
  }
  // First time reaching each division (and league) pays out, once.
  function claimDivisions() {
    const h = S();
    const out = [];
    for (const d of DIVS) {
      if (h.best < d.min || h.divs.includes(d.key)) continue;
      h.divs.push(d.key);
      h.beskar += d.beskar;
      out.push({ type: 'div', div: d, beskar: d.beskar });
      const lr = LEAGUE_REWARD[d.league];
      if (lr && !h.leagues.includes(d.league)) {
        h.leagues.push(d.league);
        out.push({ type: 'league', league: d.league, puck: lr.puck, cards: [...(lr.card ? [lr.card] : []), ...(lr.cards || [])].map(grant) });
        h.freePucks = (h.freePucks || []).concat(lr.puck);
      }
    }
    return out;
  }

  // ---------- raid ----------
  const WEEK = 7 * 24 * 3600 * 1000;
  const week = () => Math.floor((Date.now() + (S().weekShift || 0) * WEEK) / WEEK);
  const raidNow = () => RAIDS[week() % RAIDS.length];
  function raidTotals() {
    const w = week();
    const boss = raidNow().id;
    const rows = Net.ready ? Net.raid.filter((r) => r.week === w && r.boss === boss).map((r) => ({ uid: r.uid, name: Net.name(r.uid), dmg: r.dmg || 0 })) : [];
    const local = S().raids[`${w}:${boss}`] || { dmg: 0 };
    if (!rows.some((r) => r.uid === Net.me)) rows.push({ uid: Net.me || 'me', name: 'You', dmg: local.dmg });
    rows.sort((a, b) => b.dmg - a.dmg);
    const dealt = rows.reduce((a, r) => a + r.dmg, 0) + (S().raidBonus || 0);
    const p = raidNow().pool;
    return { rows, dealt: Math.min(p, dealt), left: Math.max(0, p - dealt), pool: p, mine: local.dmg, fallen: dealt >= p };
  }
  function bankRaid(dmgDone) {
    const h = S();
    const w = week();
    const boss = raidNow().id;
    const k = `${w}:${boss}`;
    const rec = h.raids[k] || (h.raids[k] = { dmg: 0, best: 0, runs: 0, claimed: false });
    rec.dmg += dmgDone; rec.best = Math.max(rec.best, dmgDone); rec.runs += 1;
    h.allySeed = (h.allySeed || 0) + 1;
    const bes = Math.min(300, Math.round(dmgDone / 600));
    h.beskar += bes;
    xp(40);
    save();
    Net.addRaid(w, boss, dmgDone);
    return { beskar: bes, rec };
  }
  // A fallen boss pays everyone who hit it; the top hitter gets the champion card.
  function claimRaid() {
    const h = S();
    const w = week();
    const r = raidNow();
    const k = `${w}:${r.id}`;
    const rec = h.raids[k];
    const t = raidTotals();
    if (!rec || rec.claimed || !t.fallen || rec.dmg <= 0) return null;
    rec.claimed = true;
    const out = { beskar: 500, cards: [], puck: 'elite' };
    h.beskar += 500;
    const top = t.rows[0] && (t.rows[0].uid === Net.me || t.rows[0].uid === 'me');
    if (top) out.cards.push(grant('hn_krrsantan'));
    const r2 = Math.random();
    if (r2 < 0.5) out.cards.push(grant(r2 < 0.25 ? 'hn_aurra' : 'hn_fang'));
    h.freePucks = (h.freePucks || []).concat('elite');
    h.beaten[r.id] = (h.beaten[r.id] || 0) + 1;
    out.top = top;
    save();
    return out;
  }

  // ---------- engine hooks: raid mechanics ----------
  const BP = root.Battle.prototype;
  if (!BP.__hn) {
    BP.__hn = true;
    const spawn = (b, u, events, text) => {
      u.alive = true; u.hp = u.maxHp; u.statuses = {}; u.tm = 0; u.ult = 0; u.hnWait = false;
      events.push({ type: 'revive', uid: u.uid, hp: u.hp }, { type: 'hnfx', fx: 'spawn', uid: u.uid });
      if (text) events.push({ type: 'log', text, side: 'enemy' });
    };
    const release = (b, status, events, text) => {
      let n = 0;
      for (const u of b.side('player')) if (u.alive && u.statuses[status]) { delete u.statuses[status]; u.hnHeld = 0; n++; events.push({ type: 'statusEnd', uid: u.uid, status }); }
      if (n) events.push({ type: 'log', text, side: 'player' });
    };
    const pick = (b, list) => list[Math.floor(b.rng() * list.length)];
    const free = (b) => b.living('player').filter((u) => !u.statuses.grabbed && !u.statuses.pit);

    const baseBegin = BP.beginTurn;
    BP.beginTurn = function (unit) {
      const out = baseBegin.call(this, unit);
      const R = this.hnRaid;
      if (!R) return out;
      const ev = out.events;
      // Held cards lose their turn; the Sarlacc digests what it holds too long.
      if (unit.side === 'player' && unit.alive && !out.skipped && (unit.statuses.grabbed || unit.statuses.pit)) {
        out.skipped = true; unit.tm = 0;
        if (unit.statuses.grabbed && R.boss === 'raid_sarlacc') {
          unit.hnHeld = (unit.hnHeld || 0) + 1;
          if (unit.hnHeld >= 3) {
            ev.push({ type: 'log', text: `${unit.def.name} is digested by the Sarlacc!`, side: 'enemy' }, { type: 'hnfx', fx: 'digest', uid: unit.uid });
            this.applyDamage(unit, unit.hp, false, ev, 'hazard');
            return out;
          }
          ev.push({ type: 'log', text: `${unit.def.name} is held by a tentacle (${unit.hnHeld}/3).`, side: 'enemy' });
        } else ev.push({ type: 'log', text: `${unit.def.name} is ${unit.statuses.pit ? 'stuck in the pit' : 'held'} and loses their turn.`, side: 'enemy' });
      }
      // Bridge the Minds: the card lashes out at its own squad.
      if (unit.side === 'player' && unit.alive && !out.skipped && unit.statuses.mind) {
        out.skipped = true; unit.tm = 0;
        const mates = this.living('player').filter((u) => u !== unit);
        if (mates.length) {
          const t = pick(this, mates);
          const { amount, crit } = this.rollDamage(unit, t, 1.2);
          ev.push({ type: 'log', text: `Snoke bridges the minds: ${unit.def.name} turns on ${t.def.name}!`, side: 'enemy' }, { type: 'hnfx', fx: 'mind', uid: unit.uid });
          this.applyDamage(t, amount, crit, ev);
        }
      }
      if (unit.side !== 'enemy' || !unit.def.raid || !unit.alive) return out;
      R.turn += 1;
      const T = R.turn;
      const enemies = this.side('enemy');
      const waiting = enemies.filter((u) => !u.alive && !u.def.raid && u.id !== 'hn_chest');
      if (unit.def.raid === 'raid_jabba') {
        if (T % 2 === 0 && waiting.length) spawn(this, pick(this, waiting), ev, 'Jabba pays a new henchman to join the fight!');
        if (T % 3 === 0) {
          const f = free(this);
          if (f.length > 1) { const t = pick(this, f); t.statuses.pit = 99; ev.push({ type: 'status', uid: t.uid, status: 'pit', turns: 99 }, { type: 'hnfx', fx: 'drop', uid: t.uid }, { type: 'log', text: `Trapdoor! ${t.def.name} drops into the pit.`, side: 'enemy' }); }
        }
        if (unit.enraged && !R.bargain) {
          R.bargain = true;
          const chest = enemies.find((u) => u.id === 'hn_chest');
          if (chest && chest.alive) { for (const u of enemies.filter((x) => !x.alive && !x.def.raid && x.id !== 'hn_chest')) spawn(this, u, ev); ev.push({ type: 'log', text: 'Bargain! Jabba buys back his fallen henchmen.', side: 'enemy' }, { type: 'hnfx', fx: 'credits' }); }
          else ev.push({ type: 'log', text: 'Jabba reaches for his credit chest… it\'s broken. No deal!', side: 'player' });
        }
      } else if (unit.def.raid === 'raid_nihilus') {
        const pct = unit.enraged ? 0.1 : 0.05;
        let sum = 0;
        ev.push({ type: 'hnfx', fx: 'drain', uid: unit.uid }, { type: 'log', text: `Nihilus feeds: every card loses ${pct * 100}% health.`, side: 'enemy' });
        for (const u of this.living('player')) { const a = Math.max(1, Math.round(u.maxHp * pct)); sum += a; this.applyDamage(u, a, false, ev, 'hazard'); }
        const healAmt = Math.min(unit.maxHp - unit.hp, Math.round(sum * 2));
        if (healAmt > 0) { unit.hp += healAmt; ev.push({ type: 'heal', uid: unit.uid, amount: healAmt, hp: unit.hp }); }
        R.dark = Math.min(1, (R.dark || 0) + 0.08);
        ev.push({ type: 'hnfx', fx: 'dark', v: R.dark });
        const fallen = this.side('player').filter((u) => !u.alive).length;
        if (fallen > (R.husks || 0) && waiting.length) { R.husks = (R.husks || 0) + 1; spawn(this, waiting[0], ev, 'A fallen card rises as a Husk.'); }
        else if (T % 3 === 0 && waiting.length) spawn(this, waiting[0], ev, 'A Husk crawls out of the dark.');
      } else if (unit.def.raid === 'raid_sarlacc') {
        if (T % 2 === 0 && waiting.length) spawn(this, waiting[0], ev, 'A new tentacle bursts from the sand!');
        const holding = this.living('player').filter((u) => u.statuses.grabbed).length;
        const tents = enemies.filter((u) => u.alive && u.id === 'hn_tentacle').length;
        const f = free(this);
        if (tents && holding < Math.min(2, tents) && f.length > 1) { const t = pick(this, f); t.statuses.grabbed = 99; t.hnHeld = 0; ev.push({ type: 'status', uid: t.uid, status: 'grabbed', turns: 99 }, { type: 'hnfx', fx: 'grab', uid: t.uid }, { type: 'log', text: `A tentacle drags ${t.def.name} toward the pit!`, side: 'enemy' }); }
      } else if (unit.def.raid === 'raid_snoke') {
        const dead = enemies.filter((u) => !u.alive && u.id === 'hn_praetorian');
        if (T % 4 === 0 && dead.length) {
          if (R.ultHit) ev.push({ type: 'log', text: 'The ultimate broke his focus: Supreme Will fails!', side: 'player' });
          else { for (const u of dead) spawn(this, u, ev); ev.push({ type: 'log', text: 'Supreme Will! Every fallen Praetorian rises.', side: 'enemy' }); }
        } else if (T % 3 === 0 && dead.length) spawn(this, dead[0], ev, 'A Praetorian Guard steps back in.');
        R.ultHit = false;
        if (T % 2 === 0) {
          const f = free(this).filter((u) => !u.statuses.mind);
          if (f.length > 1) { const t = pick(this, f); t.statuses.mind = 2; ev.push({ type: 'status', uid: t.uid, status: 'mind', turns: 1 }, { type: 'log', text: `Snoke reaches into ${t.def.name}'s mind…`, side: 'enemy' }); }
        }
      }
      // Free anyone held once their captors are gone.
      const guards = enemies.filter((u) => u.alive && !u.def.raid && u.id !== 'hn_chest');
      if (R.boss === 'raid_jabba' && !guards.length) release(this, 'pit', ev, 'The henchmen are down: everyone climbs out of the pit!');
      if (R.boss === 'raid_sarlacc' && !guards.length) release(this, 'grabbed', ev, 'The tentacles are gone: every held card breaks free!');
      return out;
    };
    // Snoke's Supreme Will fails if an ultimate lands on him.
    const baseDamage = BP.applyDamage;
    BP.applyDamage = function (target, amount, crit, events, source) {
      if (this.hnRaid && target.def.raid === 'raid_snoke' && this.currentUltimate) this.hnRaid.ultHit = true;
      const r = baseDamage.call(this, target, amount, crit, events, source);
      // Captors falling frees their prisoners straight away.
      if (this.hnRaid && target.side === 'enemy' && !target.alive && !target.def.raid) {
        const guards = this.side('enemy').filter((u) => u.alive && !u.def.raid && u.id !== 'hn_chest');
        if (!guards.length && this.hnRaid.boss === 'raid_jabba') release(this, 'pit', events, 'The henchmen are down: everyone climbs out of the pit!');
        if (!guards.length && this.hnRaid.boss === 'raid_sarlacc') release(this, 'grabbed', events, 'The tentacles are gone: every held card breaks free!');
      }
      return r;
    };
    // Raids end when the boss falls, your squad falls, or time runs out.
    const baseWinner = BP.winner;
    BP.winner = function () {
      if (this.hnRaid) {
        const boss = this.units.find((u) => u.def.raid);
        if (boss && !boss.alive) return 'player';
        if (this.living('player').length === 0) return 'enemy';
        if (this.turnCount >= this.hnRaid.limit) return 'enemy';
        return null;
      }
      return baseWinner.call(this);
    };
  }

  root.HN = { BETA, v22, raidToughen, toughPool, xp, grantBase, HN_IDS, HOW, RAIDS, LEAGUES, DIVS, LEAGUE_REWARD, S, save, owns, card, grant, entry, pool, squad, squadEntries, squadPower, powerOf, avgLevel, divOf, opponents, payout, arenaResult, claimDivisions, week, raidNow, raidTotals, bankRaid, claimRaid, Net, rng, BOT_NAMES };
})(window);

// HoloNet Arena screens (tester build only): the 4th tab, the level-25
// arrival, the hub, Ground/Fleet arenas, the co-op raid, Varka's Forge and
// its bounty pucks, the card vault, leagues and badges.
(function (root) {
  'use strict';
  const D = root.GameData;
  const UI = root.UI;
  const App = UI.App;
  const BUI = root.BattleUI;
  const HN = root.HN;
  const A = root.HNArt;
  const { el, esc, fmt, toast, openModal, portrait } = UI;
  const S = HN.S;
  const motion = () => UI.motionOK();
  const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } return null; };
  const focus = () => ls('dev-hnfocus') === '1';
  const unlocked = () => focus() || !!root.__hnBeta || Player.state.account.level >= 25;
  const sound = (n) => { if (root.Sound) root.Sound.play(n); };
  const BESKAR = '<svg class="hn-bes" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9 L12 4 L20 9 L18 18 L12 21 L6 18Z" fill="#9fb4c8" stroke="#e8f2ff" stroke-width="1.2"/><path d="M12 4 L12 21 M4 9 L20 9" stroke="#5a6a7e" stroke-width="1"/></svg>';
  const KYBER = '<svg class="hn-bes" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 L17 9 L12 22 L7 9Z" fill="#5fd8ff" stroke="#e8faff" stroke-width="1.2"/></svg>';
  const bes = (n) => `<span class="hn-cur">${BESKAR}${fmt(n)}</span>`;
  const kyb = (n) => `<span class="hn-cur">${KYBER}${fmt(n)}</span>`;
  const NAV_ICO = '<svg class="swi" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20 L19 20 M8 20 L12 14 L16 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M6 10 A6 6 0 0 1 18 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8.6 10.6 A3.4 3.4 0 0 1 15.4 10.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="11.6" r="1.6" fill="currentColor"/></svg>';

  // ---------- styles ----------
  const css = `
.main-nav [data-nav="holonet"] { display: none; }
body.hn-on .main-nav [data-nav="holonet"] { display: inline-flex; }
body.hn-on .main-nav [data-nav="holonet"] .nav-lbl { color: #8fe8ff; text-shadow: 0 0 8px rgba(95, 216, 255, 0.7); }
body.hn-on .main-nav [data-nav="holonet"] .nav-ico { color: #8fe8ff; animation: hn-pulse 2.4s ease-in-out infinite; }
@media (min-width: 761px) { body.hn-on .main-nav [data-nav="holonet"].active { background: linear-gradient(180deg, #a8f0ff, #3ab8e8 60%, #1a6a9a) !important; color: #031018; } }
@keyframes hn-pulse { 50% { filter: drop-shadow(0 0 6px #5fd8ff); } }
.main-nav[data-tab="3"] { --sc: #5fd8ff; }
@media (max-width: 760px) and (orientation: portrait) {
  body.hn-on .main-nav { grid-template-columns: repeat(4, 1fr); background: linear-gradient(90deg, transparent calc(25% - 1px), rgba(255,255,255,.06) calc(25% - 1px) 25%, transparent 25% calc(50% - 1px), rgba(255,255,255,.06) calc(50% - 1px) 50%, transparent 50% calc(75% - 1px), rgba(255,255,255,.06) calc(75% - 1px) 75%, transparent 75%), linear-gradient(180deg, #1b2232, #0a0e17 70%); }
  body.hn-on .nav-saber { left: calc(var(--ti, 0) * 25% + 25% * 0.22); width: calc(25% * 0.56); }
}
body.hn-focus .main-nav [data-nav="home"], body.hn-focus .main-nav [data-nav="collection"], body.hn-focus .main-nav [data-nav="market"] { display: none !important; }
@media (max-width: 760px) and (orientation: portrait) { body.hn-focus .main-nav { grid-template-columns: 1fr !important; } body.hn-focus .nav-saber { display: none !important; } }
.hn-cur { display: inline-flex; align-items: center; gap: 4px; font-weight: 700; font-variant-numeric: tabular-nums; }
.hn-bes { width: 15px; height: 15px; flex: none; }

/* ---- shared view shell ---- */
.hn { --holo: #5fd8ff; position: relative; display: grid; gap: 14px; padding-bottom: 20px; }
.hn::before { content: ''; position: fixed; inset: 0; z-index: -1; pointer-events: none; background: radial-gradient(ellipse at 50% -10%, rgba(95, 216, 255, 0.16), transparent 60%), repeating-linear-gradient(0deg, rgba(95, 216, 255, 0.025) 0 1px, transparent 1px 4px); }
.hn-head { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 12px; align-items: center; padding: 12px 14px; border-radius: 16px; background: linear-gradient(135deg, rgba(10, 30, 46, 0.92), rgba(6, 12, 22, 0.92)); border: 1px solid rgba(95, 216, 255, 0.35); box-shadow: 0 0 24px rgba(95, 216, 255, 0.12) inset; }
.hn-head { position: sticky; top: calc(var(--topbar-h, 56px) + 6px); z-index: 6; }
.hn-head .hn-badge-wrap { width: 64px; padding: 0; border: 0; background: none; cursor: pointer; display: grid; justify-items: center; gap: 2px; color: #8fe8ff; font: 700 9px var(--font-body, system-ui); letter-spacing: .04em; }
.hn-head .hn-badge-wrap small { font-size: 9px; white-space: nowrap; }
@media (max-width: 560px) {
  .hn-head { grid-template-columns: 52px minmax(0, 1fr) auto; gap: 10px; padding: 10px 12px; }
  .hn-head .hn-badge-wrap { width: 52px; }
  .hn-head h2 { font-size: 14px; letter-spacing: .02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hn-head p { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .hn .hn-forge-top { grid-template-columns: 1fr; }
  .hn .hn-forge-top .varka { max-width: 260px; justify-self: center; width: 100%; }
  .hn-head p { font-size: 12px; }
  .hn-head .hn-wallet { font-size: 13px; }
}
.hn-head .hn-badge { width: 100%; height: auto; display: block; }
.hn-head h2 { margin: 0; font-family: var(--font-display); letter-spacing: 0.14em; font-size: clamp(18px, 4vw, 26px); color: #dff8ff; text-shadow: 0 0 12px rgba(95, 216, 255, 0.6); }
.hn-head p { margin: 2px 0 0; color: #9fc4d8; font-size: 13px; }
.hn-head .hn-wallet { display: grid; gap: 4px; justify-items: end; font-size: 14px; color: #e8f6ff; }
.hn-back { justify-self: start; background: none; border: 1px solid rgba(95, 216, 255, 0.4); color: #bfeaff; border-radius: 999px; padding: 6px 14px; font: 600 13px var(--font-body, system-ui); cursor: pointer; }
.hn-chip { display: inline-flex; align-items: center; gap: 6px; padding: 3px 9px; border-radius: 999px; background: rgba(95, 216, 255, 0.12); border: 1px solid rgba(95, 216, 255, 0.3); color: #cff2ff; font-size: 12px; }
.hn-chip.hot { background: rgba(255, 154, 42, 0.14); border-color: rgba(255, 154, 42, 0.5); color: #ffd09a; }
.hn-sec { display: grid; gap: 10px; }
.hn-sec > h3 { margin: 4px 0 0; font-family: var(--font-display); letter-spacing: 0.12em; font-size: 14px; color: #8fe8ff; text-transform: uppercase; }

/* ---- hub tiles ---- */
.hn-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr)); gap: 12px; }
.hn-tile { position: relative; overflow: hidden; display: grid; align-content: end; min-height: 150px; padding: 14px; border-radius: 16px; text-align: left; cursor: pointer; color: #fff; border: 1px solid rgba(95, 216, 255, 0.35); background: #071420; isolation: isolate; transition: transform .2s, border-color .2s; }
.hn-tile:hover { transform: translateY(-2px); border-color: #8fe8ff; }
.hn-tile .bg { position: absolute; inset: 0; z-index: -1; opacity: .85; }
.hn-tile .bg svg { width: 100%; height: 100%; display: block; object-fit: cover; }
.hn-tile::after { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(0deg, rgba(3, 8, 14, 0.95) 10%, rgba(3, 8, 14, 0.2) 70%); }
.hn-tile em { font-style: normal; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8fe8ff; }
.hn-tile b { font-family: var(--font-display); font-size: 20px; letter-spacing: 0.08em; }
.hn-tile span { font-size: 13px; color: #c8dcea; }
.hn-tile.soon { cursor: default; opacity: .7; }
.hn-mini-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 150px), 1fr)); gap: 10px; }
.hn-mini { display: grid; gap: 4px; padding: 12px; border-radius: 14px; background: rgba(8, 20, 32, 0.9); border: 1px solid rgba(95, 216, 255, 0.25); color: #e6f6ff; text-align: left; cursor: pointer; font: inherit; }
.hn-mini b { font-family: var(--font-display); letter-spacing: 0.08em; }
.hn-mini small { color: #9fc4d8; }
.hn-mini.dot { box-shadow: 0 0 0 1px #ff9a2a inset, 0 0 16px rgba(255, 154, 42, 0.3); }

/* ---- arena ---- */
.hn-seg { display: inline-flex; padding: 3px; border-radius: 999px; background: rgba(8, 20, 32, 0.9); border: 1px solid rgba(95, 216, 255, 0.3); justify-self: start; }
.hn-seg button { padding: 7px 16px; border: 0; border-radius: 999px; background: none; color: #9fc4d8; font: 700 13px var(--font-body, system-ui); letter-spacing: .06em; cursor: pointer; }
.hn-seg button.on { background: linear-gradient(180deg, #a8f0ff, #3ab8e8); color: #031018; }
.hn-squad-old { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 10px 12px; border-radius: 14px; background: rgba(8, 20, 32, 0.85); border: 1px solid rgba(95, 216, 255, 0.2); }
.hn-sq { display: grid; gap: 10px; padding: 12px; border-radius: 14px; background: rgba(8, 20, 32, 0.85); border: 1px solid rgba(95, 216, 255, 0.2); }
.hn-sq .top { display: flex; align-items: center; gap: 10px; }
.hn-sq .top b { font-family: var(--font-display); letter-spacing: .08em; }
.hn-sq .top .pw { margin-left: auto; color: #9fc4d8; font-variant-numeric: tabular-nums; }
.hn-sq .top .hn-btn { padding: 6px 14px; }
.hn-sq .row { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; }
.hn-sq .row .mini { width: 100%; height: auto; aspect-ratio: 1; display: block; border-radius: 10px; overflow: hidden; }
.hn-sq .row .mini .portrait { width: 100%; height: 100%; }
.hn-sq .row .empty { aspect-ratio: 1; border-radius: 10px; border: 1px dashed rgba(95, 216, 255, 0.3); }
.hn-squad .grow { flex: 1; }
.hn-opps { display: grid; gap: 10px; }
.hn-opp { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 12px; align-items: center; padding: 12px; border-radius: 14px; background: linear-gradient(135deg, rgba(10, 26, 40, 0.94), rgba(6, 12, 22, 0.94)); border: 1px solid rgba(95, 216, 255, 0.22); }
.hn-opp .hn-badge { width: 54px; height: auto; display: block; }
.hn-opp .who b { font-family: var(--font-display); letter-spacing: .06em; font-size: 16px; }
.hn-opp .who small { display: block; color: #9fc4d8; font-size: 12px; }
.hn-opp .minis { display: flex; gap: 4px; margin-top: 6px; flex-wrap: wrap; }
.hn-opp .minis .mini { width: 34px; height: 34px; }
.hn-opp .go { display: grid; gap: 6px; justify-items: end; }
.hn-opp .tag { font-size: 10px; letter-spacing: .14em; padding: 2px 6px; border-radius: 4px; background: #1a6a9a; color: #dff8ff; margin-left: 6px; vertical-align: middle; }
.hn-btn { padding: 9px 16px; border-radius: 10px; border: 1px solid #8fe8ff; background: linear-gradient(180deg, #2ab0e0, #126a9a); color: #fff; font: 800 13px var(--font-body, system-ui); letter-spacing: .08em; cursor: pointer; text-transform: uppercase; }
.hn-btn:disabled { opacity: .45; cursor: default; }
.hn-btn.gold { border-color: #ffe17a; background: linear-gradient(180deg, #ffd23f, #b88400); color: #1a1200; }
.hn-btn.ghost { background: none; color: #bfeaff; }
@media (max-width: 560px) { .hn-opp { grid-template-columns: auto minmax(0, 1fr); } .hn-opp .go { grid-column: span 2; grid-auto-flow: column; justify-content: space-between; align-items: center; } }

/* ---- raid ---- */
.hn-raid-hero { position: relative; overflow: hidden; display: grid; grid-template-columns: minmax(0, 220px) minmax(0, 1fr); gap: 14px; padding: 14px; border-radius: 18px; background: #12060a; border: 1px solid var(--rc, #ff3a3a); box-shadow: 0 0 30px color-mix(in srgb, var(--rc, #ff3a3a) 25%, transparent); }
.hn-raid-hero .art { border-radius: 14px; overflow: hidden; aspect-ratio: 1; }
.hn-raid-hero .art svg { width: 100%; height: 100%; display: block; }
.hn-raid-hero h2 { margin: 0; font-family: var(--font-display); letter-spacing: .1em; }
.hn-raid-hero ul { list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: 6px; }
.hn-raid-hero li { padding: 7px 10px; border-radius: 10px; background: rgba(255, 255, 255, 0.04); font-size: 13px; }
.hn-raid-hero li b { color: var(--rc); display: block; font-size: 13px; }
.hn-hp { position: relative; height: 18px; border-radius: 999px; background: #1a0a0e; border: 1px solid rgba(255, 255, 255, 0.15); overflow: hidden; }
.hn-hp i { position: absolute; inset: 0 auto 0 0; background: linear-gradient(90deg, #ff3a3a, #ff9a3a); box-shadow: 0 0 14px #ff5a3a; transition: width .8s; }
.hn-hp span { position: absolute; inset: 0; display: grid; place-items: center; font-size: 11px; font-weight: 800; letter-spacing: .06em; color: #fff; text-shadow: 0 1px 2px #000; }
.hn-board { display: grid; gap: 4px; }
.hn-board div { display: flex; justify-content: space-between; padding: 6px 10px; border-radius: 8px; background: rgba(8, 20, 32, 0.8); font-size: 13px; }
.hn-board div.me { border: 1px solid rgba(95, 216, 255, 0.5); }
.hn-allies { display: grid; gap: 8px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr)); }
.hn-ally { display: grid; gap: 6px; padding: 10px; border-radius: 12px; background: rgba(8, 20, 32, 0.85); border: 1px solid rgba(95, 216, 255, 0.2); text-align: left; color: #e6f6ff; cursor: pointer; font: inherit; }
.hn-ally.on { border-color: #8fe8ff; box-shadow: 0 0 14px rgba(95, 216, 255, 0.35); }
.hn-ally .minis { display: flex; gap: 3px; flex-wrap: wrap; }
.hn-ally .minis .mini { width: 30px; height: 30px; }
@media (max-width: 620px) { .hn-raid-hero { grid-template-columns: 1fr; } .hn-raid-hero .art { max-width: 260px; } }

/* ---- forge ---- */
.hn-forge-top { display: grid; grid-template-columns: minmax(0, 180px) minmax(0, 1fr); gap: 14px; align-items: center; padding: 12px; border-radius: 16px; background: linear-gradient(135deg, #1a0e08, #0a0606); border: 1px solid #5a3a20; }
.hn-forge-top .varka { border-radius: 12px; overflow: hidden; aspect-ratio: 1; }
.hn-forge-top .varka svg { width: 100%; height: 100%; display: block; }
.hn-forge-top q { color: #ffd9b0; font-style: italic; }
.hn-forge-top b.nm { display: block; color: #ffb36a; letter-spacing: .14em; font-size: 12px; margin-bottom: 4px; }
.hn-pucks { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr)); gap: 12px; }
.hn-puck { display: grid; gap: 6px; padding: 10px; border-radius: 14px; background: linear-gradient(180deg, #11141c, #08090d); border: 1px solid color-mix(in srgb, var(--pc) 50%, #222); text-align: center; color: #e8eef6; }
.hn-puck.gold { border-color: #ffd23f; box-shadow: 0 0 22px rgba(255, 210, 63, 0.35); }
.hn-puck .art svg { width: 100%; height: auto; display: block; border-radius: 10px; }
.hn-puck b { font-family: var(--font-display); letter-spacing: .06em; }
.hn-puck small { color: #a8b4c4; font-size: 12px; }
.hn-puck .wanted { display: flex; justify-content: space-between; font-size: 11px; letter-spacing: .12em; color: #ffcf8a; font-weight: 800; }
.hn-puck .wanted em { font-style: normal; color: #ff9a6a; }
.hn-puck .hn-btn { justify-self: center; }
.hn-puck.done { opacity: .5; }
.hn-holo { transform-origin: 50px 46px; animation: hn-flick 3.6s steps(1) infinite, hn-turn 6s ease-in-out infinite; }
.hn-holo.gold { animation: hn-flick 2.2s steps(1) infinite, hn-turn 4s ease-in-out infinite; }
@keyframes hn-flick { 0%, 100% { opacity: 1; } 31% { opacity: .55; } 32% { opacity: 1; } 71% { opacity: .8; } 72% { opacity: 1; } }
@keyframes hn-turn { 50% { transform: scaleX(.82); } }
.hn-free { display: flex; gap: 10px; align-items: center; padding: 10px 12px; border-radius: 12px; background: rgba(255, 154, 42, 0.12); border: 1px solid rgba(255, 154, 42, 0.5); color: #ffd9b0; }
.hn-free .grow { flex: 1; }

/* ---- captured log ---- */
.hn-caps { display: grid; gap: 12px; }
.hn-cap-row { display: grid; gap: 8px; padding: 10px; border-radius: 14px; background: rgba(8, 20, 32, 0.85); border: 1px solid rgba(95, 216, 255, 0.2); }
.hn-cap-row header { display: flex; justify-content: space-between; align-items: center; font-family: var(--font-display); letter-spacing: .1em; font-size: 13px; }
.hn-cap-row .list { display: grid; grid-template-columns: repeat(auto-fill, minmax(92px, 1fr)); gap: 8px; }
.hn-cap { display: grid; justify-items: center; gap: 2px; padding: 6px; border-radius: 10px; background: #070b12; text-align: center; font-size: 11px; color: #c8dcea; }
.hn-cap svg { width: 70px; height: 70px; }
.hn-cap.no svg { filter: grayscale(1) brightness(.35); }
.hn-cap .stamp { font-size: 9px; letter-spacing: .14em; color: #ff6a5a; font-weight: 800; }

/* ---- card vault ---- */
.hn-vault { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(46%, 150px), 1fr)); gap: 10px; }
.hn-vault .ucard { width: 100%; }
.hn-how { font-size: 11px; color: #8fe8ff; text-align: center; margin-top: 4px; }
.hn-insp { display: grid; grid-template-columns: minmax(0, 200px) minmax(0, 1fr); gap: 14px; }
.hn-insp .pt { border-radius: 14px; overflow: hidden; aspect-ratio: 1; }
.hn-insp .pt .portrait { width: 100%; height: 100%; }
.hn-insp ul { list-style: none; padding: 0; margin: 8px 0; display: grid; gap: 6px; }
.hn-insp li { padding: 7px 10px; border-radius: 10px; background: rgba(255, 255, 255, 0.04); font-size: 13px; }
.hn-insp li.ult b { color: var(--crawl, #ffd23f); }
@media (max-width: 560px) { .hn-insp { grid-template-columns: 1fr; } .hn-insp .pt { max-width: 220px; } }

/* ---- leagues ---- */
.hn-ladder { display: grid; gap: 10px; }
.hn-rung { display: grid; grid-template-columns: 90px minmax(0, 1fr); gap: 10px; align-items: center; padding: 10px; border-radius: 14px; background: rgba(8, 20, 32, 0.85); border: 1px solid rgba(95, 216, 255, 0.15); }
.hn-rung .bdgs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
.hn-rung .bdg { display: grid; justify-items: center; text-align: center; font-size: 11px; color: #9fc4d8; opacity: .55; }
.hn-rung .bdg.got { opacity: 1; color: #e6f6ff; }
.hn-rung .bdg.cur { opacity: 1; }
.hn-rung .bdg.cur .hn-badge { filter: drop-shadow(0 0 10px #5fd8ff); }
.hn-rung .bdg .hn-badge { width: 100%; max-width: 92px; height: auto; }
.hn-rung > b { font-family: var(--font-display); letter-spacing: .14em; font-size: 14px; }
.hn-rung small.r { display: block; font-size: 11px; color: #ffcf8a; font-weight: 400; letter-spacing: 0; margin-top: 4px; }
.hn-badge.legend .lb-spin { animation: hn-spin 12s linear infinite; transform-origin: 0 0; }
.hn-badge.legend .lb-pulse { animation: hn-glow 2.4s ease-in-out infinite; transform-origin: 0 0; }
.hn-badge.legend .lb-core { animation: hn-glow 1.4s ease-in-out infinite; transform-origin: 0 0; }
@keyframes hn-spin { to { transform: rotate(360deg); } }
@keyframes hn-glow { 50% { transform: scale(1.18); } }

/* ---- squad picker ---- */
.hn-pick { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 8px; max-height: 56vh; overflow: auto; padding: 4px; }
.hn-pick .ucard { width: 100%; font-size: 11px; }
.hn-pick .ucard.selected { outline: 2px solid #5fd8ff; outline-offset: 2px; }
.hn-pick-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 8px; }

/* ---- battle: raid layout and boss effects ---- */
.battle.hn-raid .player-row { display: grid; grid-template-columns: repeat(5, auto); justify-content: center; gap: 4px 6px; }
.battle.hn-raid .field .player-row .bcard { width: clamp(52px, min(14.6vw, calc(19cqh - 10px)), 104px) !important; }
.battle.hn-raid .field .enemy-row .bcard:not(.boss) { width: clamp(50px, min(13vw, calc(22cqh - 16px)), 120px) !important; }
.battle.hn-raid .player-row .bcard .portrait { width: 100%; }
.bcard.ko.hn-wait { opacity: .22; filter: grayscale(1); }
.bcard.ko.hn-wait::after { content: 'INCOMING'; position: absolute; inset: auto 0 40% 0; text-align: center; font-size: 9px; letter-spacing: .2em; color: #ff8a8a; }
.battle.hn-raid .field::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at 50% 30%, transparent 20%, rgba(20, 0, 40, 0.92) 90%); opacity: var(--hn-dark, 0); transition: opacity 1.2s; z-index: 1; }
.hn-fxl { position: absolute; inset: 0; pointer-events: none; z-index: 6; overflow: hidden; }
.hn-beam { position: absolute; height: 3px; transform-origin: 0 50%; border-radius: 2px; background: linear-gradient(90deg, #ffcf7a, #c88aff); box-shadow: 0 0 10px #b070ff; animation: hn-beam .9s ease-out forwards; }
@keyframes hn-beam { 0% { opacity: 0; clip-path: inset(0 100% 0 0); } 30% { opacity: 1; clip-path: inset(0 0 0 0); } 100% { opacity: 0; clip-path: inset(0 0 0 100%); } }
.hn-coin { position: absolute; top: -20px; width: 12px; height: 12px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #fff4c0, #ffd23f 50%, #9a6406); animation: hn-coin 1.4s cubic-bezier(.4,.1,.8,1) forwards; }
@keyframes hn-coin { to { transform: translateY(110vh) rotate(720deg); } }
.hn-ring { position: absolute; width: 60px; height: 60px; margin: -30px; border-radius: 50%; border: 3px solid var(--c, #fff); animation: hn-ring .7s ease-out forwards; }
@keyframes hn-ring { from { transform: scale(.2); opacity: 1; } to { transform: scale(2.4); opacity: 0; } }

/* ---- boss ultimates: full-screen, transform/opacity only ---- */
.hn-cine { position: fixed; inset: 0; z-index: 9500; pointer-events: none; overflow: hidden; display: grid; place-items: center; }
.hn-cine .veil { position: absolute; inset: 0; animation: hn-veil var(--d) ease forwards; }
@keyframes hn-veil { 0% { opacity: 0; } 12% { opacity: 1; } 82% { opacity: 1; } 100% { opacity: 0; } }
.hn-cine .boss { position: absolute; width: min(62vmin, 520px); aspect-ratio: 1; border-radius: 50%; overflow: hidden; animation: hn-bossin var(--d) cubic-bezier(.2,.8,.2,1) forwards; box-shadow: 0 0 80px var(--c); }
.hn-cine .boss svg { width: 100%; height: 100%; display: block; }
@keyframes hn-bossin { 0% { opacity: 0; transform: scale(1.5); } 18% { opacity: 1; transform: scale(1); } 75% { opacity: 1; transform: scale(1.06); } 100% { opacity: 0; transform: scale(.9); } }
.hn-cine .title { position: absolute; bottom: 14%; left: 0; right: 0; text-align: center; font-family: var(--font-display); font-weight: 800; letter-spacing: .14em; font-size: clamp(22px, 6vw, 52px); color: #fff; text-shadow: 0 0 20px var(--c), 0 0 40px var(--c); opacity: 0; animation: hn-title var(--d) ease forwards; }
.hn-cine .title small { display: block; font-size: .36em; letter-spacing: .3em; color: var(--c); }
@keyframes hn-title { 0%, 22% { opacity: 0; transform: translateY(20px) scale(.9); } 32% { opacity: 1; transform: none; } 80% { opacity: 1; } 100% { opacity: 0; } }
.hn-cine .bolt { position: absolute; left: 50%; top: 50%; width: 4px; height: 55vmax; margin-left: -2px; transform-origin: 50% 0; background: linear-gradient(180deg, #fff, var(--c) 30%, transparent); box-shadow: 0 0 14px var(--c); opacity: 0; animation: hn-bolt .26s steps(2) var(--t) 3; }
@keyframes hn-bolt { 50% { opacity: 1; } }
.hn-cine .stream { position: absolute; left: 50%; top: 50%; width: 46vmax; height: 6px; margin-top: -3px; transform-origin: 0 50%; border-radius: 3px; background: linear-gradient(270deg, rgba(255, 207, 122, 0), #ffcf7a 30%, #c88aff); box-shadow: 0 0 16px #b070ff; opacity: 0; animation: hn-stream 1.2s ease-in var(--t) forwards; }
@keyframes hn-stream { 0% { opacity: 0; clip-path: inset(0 0 0 100%); } 30% { opacity: 1; } 100% { opacity: 0; clip-path: inset(0 100% 0 0); } }
.hn-cine .teeth { position: absolute; width: 150vmax; aspect-ratio: 1; border-radius: 50%; background: repeating-conic-gradient(from 0deg, #f2e2c0 0 4deg, transparent 4deg 10deg); -webkit-mask: radial-gradient(circle, transparent 47%, #000 48%, #000 52%, transparent 53%); mask: radial-gradient(circle, transparent 47%, #000 48%, #000 52%, transparent 53%); animation: hn-teeth var(--d) cubic-bezier(.6,0,.3,1) forwards; }
@keyframes hn-teeth { 0% { transform: scale(1.4) rotate(0); opacity: 0; } 20% { opacity: 1; } 70% { transform: scale(.35) rotate(60deg); opacity: 1; } 100% { transform: scale(.1) rotate(90deg); opacity: 0; } }
.hn-cine .curtain { position: absolute; top: 0; bottom: 0; width: 52%; background: repeating-linear-gradient(90deg, #5a0606 0 18px, #8a0e0e 18px 30px, #3a0404 30px 40px); animation: hn-curtL var(--d) cubic-bezier(.2,.8,.2,1) forwards; }
.hn-cine .curtain.r { right: 0; animation-name: hn-curtR; }
.hn-cine .curtain.l { left: 0; }
@keyframes hn-curtL { 0% { transform: translateX(-100%); } 20%, 80% { transform: translateX(-40%); } 100% { transform: translateX(-100%); } }
@keyframes hn-curtR { 0% { transform: translateX(100%); } 20%, 80% { transform: translateX(40%); } 100% { transform: translateX(100%); } }
.hn-cine .stamp { position: absolute; padding: 6px 14px; border: 3px solid #ff3a2a; color: #ff3a2a; font: 900 clamp(16px, 4vw, 30px) var(--font-display); letter-spacing: .14em; transform: rotate(-12deg) scale(3); opacity: 0; animation: hn-stamp .4s cubic-bezier(.2,.9,.3,1.4) var(--t) forwards; background: rgba(20, 6, 0, 0.6); }
@keyframes hn-stamp { to { transform: rotate(-12deg) scale(1); opacity: 1; } }
.hn-cine.lite .bolt, .hn-cine.lite .stream { display: none; }


/* ---- level 25 arrival, full screen ---- */
.hc { position: fixed; inset: 0; z-index: 9800; overflow: hidden; color: #fff; transition: opacity .45s; }
.hc.out { opacity: 0; }
.hc-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 40%, #1a0608, #020103 75%); transition: opacity 1s; }
.hc.p3 .hc-bg { opacity: .55; }
.hc.p5 .hc-bg { opacity: .7; }
.hc-alarm { position: absolute; inset: 0; pointer-events: none; box-shadow: inset 0 0 160px 40px rgba(255, 0, 0, 0.55); opacity: 0; }
.hc.p1 .hc-alarm { animation: hc-alarm .9s ease-in-out 5; }
@keyframes hc-alarm { 50% { opacity: 1; } }
.hc-alarm::before { content: ''; position: absolute; left: 50%; top: 50%; width: 220vmax; height: 30vmax; margin: -15vmax 0 0 -110vmax; background: linear-gradient(90deg, transparent, rgba(255, 40, 30, 0.22), transparent); animation: hc-sweep 1.8s linear infinite; }
@keyframes hc-sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.hc.p2 .hc-alarm { display: none; }
.hc-klaxon { position: absolute; top: 9%; left: 0; right: 0; text-align: center; font: 900 clamp(16px, 4.6vw, 34px) var(--font-display, system-ui); letter-spacing: .18em; color: #ff3a3a; text-shadow: 0 0 20px #ff0000; opacity: 0; }
.hc.p1 .hc-klaxon { animation: hc-blink .45s steps(2) 10; }
@keyframes hc-blink { 50% { opacity: 1; } }
.hc-comm { position: absolute; left: 50%; top: 50%; width: min(86vw, 420px); transform: translate(-50%, -40%) scale(.8); opacity: 0; display: grid; justify-items: center; gap: 8px; padding: 14px 14px 18px; border-radius: 16px; background: linear-gradient(180deg, rgba(8, 30, 52, 0.95), rgba(4, 12, 22, 0.95)); border: 1px solid #5fd8ff; box-shadow: 0 0 40px rgba(95, 216, 255, 0.35); transition: transform .5s cubic-bezier(.2,.9,.3,1.2), opacity .4s, top .6s, left .6s, width .6s; }
.hc.p1b .hc-comm { opacity: 1; transform: translate(-50%, -50%) scale(1); }
.hc.p2 .hc-comm, .hc.p3 .hc-comm, .hc.p4 .hc-comm { opacity: 0; transform: translate(-50%, -50%) scale(.6); }
.hc.p5 .hc-comm { opacity: 1; top: auto; bottom: 18%; left: 50%; transform: translate(-50%, 0) scale(.82); }
.hc.p6 .hc-comm { opacity: 0; transform: translate(-50%, 0) scale(.6); }
.hc.p1c:not(.p2) .hc-comm { opacity: .45; }
.hc-comm-head { justify-self: stretch; display: flex; align-items: center; gap: 8px; font: 700 11px var(--font-display, system-ui); letter-spacing: .18em; color: #8fe8ff; }
.hc-comm-head i { width: 8px; height: 8px; border-radius: 50%; background: #ff3a3a; box-shadow: 0 0 8px #ff3a3a; animation: hc-blink .6s steps(2) infinite; }
.hc-face { position: relative; width: min(46vw, 190px); aspect-ratio: 100 / 110; border-radius: 12px; overflow: hidden; border: 1px solid rgba(95, 216, 255, 0.5); }
.hc-face svg { width: 100%; height: 100%; display: block; }
.hc-scan { position: absolute; inset: 0; background: repeating-linear-gradient(0deg, rgba(95, 216, 255, 0.12) 0 1px, transparent 1px 3px); animation: hn-flick 2.4s steps(1) infinite; }
.hc.p1c .hc-face { animation: hc-jolt .08s linear 6; }
@keyframes hc-jolt { 50% { transform: translate(4px, -3px); } }
.hc-who { font: 800 13px var(--font-display, system-ui); letter-spacing: .2em; color: #ffcf8a; }
.hc-line { margin: 0; min-height: 3.6em; text-align: center; font-size: clamp(14px, 3.6vw, 17px); line-height: 1.35; color: #e6f6ff; }
.hc-shout { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%) scale(.4); text-align: center; z-index: 5; font: 900 clamp(34px, 11.5vw, 120px) var(--font-display, system-ui); letter-spacing: .04em; color: #fff; text-shadow: 0 0 30px #ff5a2a, 0 0 70px #ff2a00; opacity: 0; pointer-events: none; }
.hc.p1c .hc-shout { animation: hc-shout 1.3s cubic-bezier(.2,.9,.3,1.3) forwards; }
@keyframes hc-shout { 0% { opacity: 0; transform: translateY(-50%) scale(.4); } 25% { opacity: 1; transform: translateY(-50%) scale(1.15); } 80% { opacity: 1; transform: translateY(-50%) scale(1); } 100% { opacity: 0; transform: translateY(-50%) scale(1.6); } }
.hc-space { position: absolute; inset: 0; opacity: 0; transition: opacity .6s; }
.hc.p2 .hc-space { opacity: 1; }
.hc.p3 .hc-space { opacity: 0; transition: opacity .8s .2s; }
.hc-stars { position: absolute; inset: -10%; background-image: radial-gradient(1.5px 1.5px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 60% 70%, #cfe0ff, transparent), radial-gradient(1.2px 1.2px at 80% 20%, #fff, transparent), radial-gradient(1px 1px at 35% 80%, #fff, transparent), radial-gradient(1.4px 1.4px at 90% 60%, #ffe8c0, transparent); background-size: 180px 180px; animation: hc-drift 8s linear infinite; }
@keyframes hc-drift { to { transform: translateX(-60px); } }
.hc-sd { position: absolute; left: -6%; top: 16%; width: min(70vw, 560px); transform: translateX(-40%); transition: transform 3.2s cubic-bezier(.25,.7,.2,1); filter: drop-shadow(0 0 10px rgba(143, 212, 255, 0.3)); }
.hc.p2 .hc-sd { transform: none; }
.hc-sd svg, .hc-relay svg { width: 100%; height: auto; display: block; }
.hc-relay { position: absolute; left: 62%; top: 22%; width: min(26vw, 180px); animation: hc-bob 3s ease-in-out infinite; }
@keyframes hc-bob { 50% { transform: translateY(-8px) rotate(4deg); } }
.hc.p2b .hc-relay { opacity: 0; transition: opacity .2s .15s; }
.hc-burst { position: absolute; left: calc(62% + min(13vw, 90px)); top: calc(22% + min(13vw, 90px)); width: 20px; height: 20px; margin: -10px; border-radius: 50%; background: radial-gradient(circle, #fff, #ffd06a 30%, #ff6a1a 60%, transparent 70%); opacity: 0; }
.hc.p2b .hc-burst { animation: hc-burst .9s ease-out forwards; }
@keyframes hc-burst { 0% { opacity: 1; transform: scale(.5); } 40% { opacity: 1; transform: scale(14); } 100% { opacity: 0; transform: scale(20); } }
.hc-bolt { position: absolute; left: calc(-6% + min(70vw, 560px) * .97); top: calc(16% + min(70vw, 560px) * .2 + var(--y)); height: 4px; width: 0; border-radius: 2px; background: linear-gradient(90deg, #6aff6a, #eaffea); box-shadow: 0 0 12px #3aff3a; transform-origin: 0 50%; transform: rotate(8deg); animation: hc-bolt .35s ease-out forwards; }
@keyframes hc-bolt { 0% { width: 0; opacity: 1; } 60% { width: 30vw; opacity: 1; } 100% { width: 34vw; opacity: 0; } }
.hc-fx { position: absolute; inset: 0; pointer-events: none; }
.hc-rock { position: absolute; left: 0; top: 0; width: min(24vw, 140px); aspect-ratio: 1; will-change: transform; filter: drop-shadow(0 0 18px #ff7a1a); }
.hc-rock svg { position: relative; z-index: 2; width: 100%; height: 100%; }
.hc-trail { position: absolute; left: 50%; top: 50%; width: 320%; height: 60%; transform-origin: 0 50%; transform: translateY(-50%) rotate(var(--ang)); border-radius: 50%; background: linear-gradient(90deg, rgba(255, 240, 180, 0.95), rgba(255, 140, 30, 0.75) 25%, rgba(200, 40, 10, 0.35) 60%, transparent); filter: blur(6px); z-index: 1; }
.hc-flash { position: absolute; inset: 0; background: #fff; animation: hc-flash .9s ease-out forwards; }
@keyframes hc-flash { 0% { opacity: 0; } 8% { opacity: 1; } 100% { opacity: 0; } }
.hc-ring { position: absolute; width: 60px; height: 60px; margin: -30px; border-radius: 50%; border: 8px solid #ffd09a; box-shadow: 0 0 30px #ff8a2a; opacity: 0; animation: hc-ring 1.1s ease-out forwards; }
@keyframes hc-ring { 0% { opacity: 1; transform: scale(.4); } 100% { opacity: 0; transform: scale(18); } }
.hc-glow { position: absolute; width: 240px; height: 240px; margin: -120px; border-radius: 50%; background: radial-gradient(circle, rgba(255, 220, 140, 0.9), rgba(255, 100, 20, 0.5) 40%, transparent 70%); animation: hc-glow 2.6s ease-out forwards; }
@keyframes hc-glow { 0% { opacity: 1; transform: scale(.3); } 20% { opacity: 1; transform: scale(1.4); } 100% { opacity: 0; transform: scale(1); } }
.hc-deb { position: absolute; background: #4a4a52; border-top: 2px solid #ff8a2a; border-radius: 2px; }
.hc-smoke { position: absolute; width: 70px; height: 70px; border-radius: 50%; background: radial-gradient(circle, rgba(70, 64, 60, 0.9), rgba(40, 36, 34, 0.6) 50%, transparent 70%); }
.hc-crack { position: absolute; width: 70vmin; height: 70vmin; transform: translate(-50%, -100%); }
.hc-crack path { fill: none; stroke: rgba(230, 245, 255, 0.85); stroke-width: 1.4; stroke-dasharray: 600; stroke-dashoffset: 600; animation: hc-crack .5s ease-out forwards, hc-fade 1.4s 2.4s forwards; filter: drop-shadow(0 0 3px #fff); }
@keyframes hc-crack { to { stroke-dashoffset: 0; } }
@keyframes hc-fade { to { opacity: 0; } }
.hc-title { position: absolute; left: 0; right: 0; top: 34%; display: grid; justify-items: center; gap: 6px; text-align: center; opacity: 0; transform: translateY(20px); transition: opacity .6s, transform .6s; pointer-events: none; }
.hc.p6 .hc-title { opacity: 1; transform: none; pointer-events: auto; }
.hc-title small { letter-spacing: .3em; color: #8fe8ff; font-size: 12px; }
.hc-title b { font: 900 clamp(30px, 9vw, 64px) var(--font-display, system-ui); letter-spacing: .12em; color: #dff8ff; text-shadow: 0 0 20px #5fd8ff, 0 0 50px #1a8ac8; }
.hc-title span { color: #bfeaff; }
.hc-title .hn-btn { margin-top: 10px; padding: 12px 26px; }
.hc-skip { position: absolute; right: 14px; bottom: calc(14px + env(safe-area-inset-bottom, 0px)); z-index: 3; padding: 8px 14px; border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.3); background: rgba(0, 0, 0, 0.5); color: #cfd8e6; font: 600 12px var(--font-body, system-ui); letter-spacing: .1em; cursor: pointer; }
.hc.p6 .hc-skip { display: none; }
@media (max-width: 760px) and (orientation: portrait) { .hc-skip { bottom: auto; top: calc(10px + env(safe-area-inset-top, 0px)); } }


.hc-neb { position: absolute; inset: 0; background: radial-gradient(ellipse at 75% 30%, rgba(120, 60, 160, 0.35), transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(40, 90, 160, 0.3), transparent 55%); }
.hc .hc-sd { left: -8%; top: 12%; width: min(96vw, 820px); }
.hc-cv { position: absolute; left: 56%; top: 38%; width: min(38vw, 300px); animation: hc-flee 6s linear forwards; }
@keyframes hc-flee { from { transform: translateX(-6%); } to { transform: translateX(10%); } }
@media (max-width: 600px) { .hc-cv { left: 36%; top: 36%; width: 46vw; } .hc .hc-sd { top: 10%; width: 120vw; left: -30%; } }
.hc-cv-ship svg { width: 100%; height: auto; display: block; filter: drop-shadow(0 0 8px rgba(255, 140, 220, 0.25)); }
.hc.p2b .hc-cv-ship { opacity: 0; transition: opacity .25s .2s; }
.hc-xw { position: absolute; width: 18px; height: 4px; background: #dfe6ee; border-radius: 2px; box-shadow: 0 0 6px #ff9ad8; }
.hc-xw::before { content: ''; position: absolute; left: 4px; top: -5px; width: 2px; height: 14px; background: #c8d0da; }
.hc-xw.a { left: 70%; top: -20%; animation: hc-xw 2.4s ease-in-out infinite alternate; }
.hc-xw.b { left: 40%; top: 110%; animation: hc-xw 2.8s ease-in-out infinite alternate-reverse; }
@keyframes hc-xw { to { transform: translate(14px, 6px); } }
.hc.p2b .hc-xw { animation: none; transform: translate(80px, -60px) scale(.6); opacity: 0; transition: all .8s; }
.hc .hc-bolt { position: absolute; height: 3px; transform-origin: 0 50%; background: linear-gradient(90deg, rgba(120, 255, 120, 0), #7aff7a 20%, #eaffea 80%, #7aff7a); box-shadow: 0 0 10px #3aff3a; border-radius: 2px; animation: hc-bolt2 .5s ease-out forwards; }
@keyframes hc-bolt2 { 0% { clip-path: inset(0 100% 0 0); opacity: 1; } 40% { clip-path: inset(0 0 0 0); opacity: 1; } 100% { clip-path: inset(0 0 0 100%); opacity: 0; } }
.hc-hit { position: absolute; width: 14px; height: 14px; margin: -7px; border-radius: 50%; background: radial-gradient(circle, #fff, #ffd06a 40%, #ff6a1a 70%, transparent); animation: hc-hit .6s ease-out forwards; }
@keyframes hc-hit { 0% { transform: scale(.3); opacity: 1; } 50% { transform: scale(2.6); opacity: 1; } 100% { transform: scale(3.4); opacity: 0; } }
.hc-boom { position: absolute; width: 40px; height: 40px; margin: -20px; border-radius: 50%; background: radial-gradient(circle, #fff, #fff0b0 25%, #ffa030 50%, #e2420e 70%, transparent 72%); animation: hc-boom 1.4s ease-out forwards; }
.hc-boom.b { animation-delay: .15s; opacity: 0; }
@keyframes hc-boom { 0% { transform: scale(.3); opacity: 1; } 30% { transform: scale(6); opacity: 1; } 100% { transform: scale(8); opacity: 0; } }
.hc-ring2 { position: absolute; width: 40px; height: 40px; margin: -20px; border-radius: 50%; border: 4px solid #ffd8a0; animation: hc-ring 1s ease-out forwards; }

/* ---- space battle, second pass ---- */
.hc-stars.far { background-size: 90px 90px; opacity: .5; animation-duration: 16s; }
.hc-planet { position: absolute; right: -18vmin; bottom: -26vmin; width: 70vmin; height: 70vmin; border-radius: 50%; background: radial-gradient(circle at 30% 28%, #8ac8e8, #3a78a8 30%, #1a3a5c 60%, #06121e 82%); box-shadow: 0 0 60px rgba(120, 190, 255, 0.35), inset -30px -40px 80px rgba(0, 0, 0, 0.8); opacity: .85; }
.hc-planet i { position: absolute; inset: 0; border-radius: 50%; background: repeating-linear-gradient(-18deg, transparent 0 18px, rgba(255, 255, 255, 0.08) 18px 26px, transparent 26px 44px); mix-blend-mode: screen; }
.hc-neb { background: radial-gradient(ellipse at 72% 26%, rgba(150, 70, 190, 0.38), transparent 46%), radial-gradient(ellipse at 22% 72%, rgba(40, 100, 180, 0.32), transparent 52%), radial-gradient(ellipse at 50% 50%, rgba(255, 120, 80, 0.08), transparent 60%); }
.hc-shield { position: absolute; left: -6%; right: -6%; top: -45%; bottom: -45%; border-radius: 50%; border: 1.5px solid rgba(140, 220, 255, 0.8); background: radial-gradient(ellipse, rgba(120, 210, 255, 0.05) 55%, rgba(120, 210, 255, 0.28) 72%, transparent 74%); box-shadow: 0 0 22px rgba(120, 210, 255, 0.5); opacity: .25; transition: opacity .2s; }
.hc-shield.broken { opacity: 0 !important; animation: none; }
.hc-half { position: absolute; left: 0; right: 0; top: 0; visibility: hidden; }
.hc-half svg { width: 100%; height: auto; display: block; }
.hc-half.f { clip-path: polygon(52% 0, 100% 0, 100% 100%, 48% 100%); }
.hc-half.r { clip-path: polygon(0 0, 52% 0, 48% 100%, 0 100%); }
.hc-cv.split .hc-cv-ship { visibility: hidden; }
.hc-cv.split .hc-half { visibility: visible; }
.hc-cv.split .hc-shield { display: none; }
.hc-cv.split { animation-play-state: paused; }
.hc-half::after { content: ''; position: absolute; top: 20%; bottom: 20%; width: 10%; border-radius: 40%; background: radial-gradient(ellipse, #fff4c0, #ff9a2a 40%, rgba(220, 60, 10, 0.6) 65%, transparent 72%); filter: blur(3px); animation: hc-flicker .18s steps(2) infinite; }
.hc-half.f::after { left: 44%; }
.hc-half.r::after { left: 44%; }
@keyframes hc-flicker { 50% { opacity: .65; transform: scale(1.12); } }
.hc-muzzle { position: absolute; width: 14px; height: 14px; margin: -7px; border-radius: 50%; background: radial-gradient(circle, #fff, #9aff9a 40%, transparent 70%); animation: hc-hit .3s ease-out forwards; }
.hc-lane { position: absolute; height: 0; transform-origin: 0 0; pointer-events: none; }
.hc-lane b { position: absolute; left: 0; top: -2.5px; width: 70px; height: 5px; border-radius: 3px; background: linear-gradient(90deg, rgba(90, 255, 90, 0), #5aff5a 30%, #f0fff0 70%, #ffffff); box-shadow: 0 0 8px #3aff3a, 0 0 18px #2ad82a; }
.hc-ripple { position: absolute; width: 30px; height: 30px; margin: -15px; border-radius: 50%; border: 2px solid #bfeaff; box-shadow: 0 0 14px #7ad0ff; animation: hc-rip .55s ease-out forwards; }
@keyframes hc-rip { from { transform: scale(.3); opacity: 1; } to { transform: scale(2.6, 1.6); opacity: 0; } }
.hc-shard { position: absolute; width: 10px; height: 4px; background: rgba(170, 230, 255, 0.9); box-shadow: 0 0 6px #7ad0ff; }
.hc-fire { position: absolute; width: 16px; height: 16px; margin: -8px; border-radius: 50%; background: radial-gradient(circle, #fff4c0, #ff9a2a 45%, transparent 70%); filter: blur(1px); animation: hc-flicker .16s steps(2) infinite; }
.hc-pop { position: absolute; width: 30px; height: 30px; margin: -15px; border-radius: 50%; background: radial-gradient(circle, #fff, #ffd06a 30%, #ff6a1a 60%, transparent 72%); animation: hc-boom .9s ease-out forwards; }
.hc-wflash { position: absolute; inset: 0 !important; left: 0; top: 0; background: radial-gradient(circle at var(--x, 60%) 45%, #ffffff, rgba(255, 240, 200, 0.8) 30%, transparent 70%); animation: hc-flash .8s ease-out forwards; }
.hc-flat { position: absolute; width: 60px; height: 8px; margin: -4px -30px; border-radius: 50%; border: 2px solid #eaf6ff; box-shadow: 0 0 20px #9ad8ff, inset 0 0 12px #9ad8ff; animation: hc-flat 1.6s cubic-bezier(.1,.7,.3,1) forwards; }
@keyframes hc-flat { from { transform: scale(.2); opacity: 1; } to { transform: scale(22, 9); opacity: 0; } }
.hc-core { position: absolute; width: 120px; height: 120px; margin: -60px; border-radius: 50%; background: radial-gradient(circle, #ffffff, #fff2b0 30%, #ffb040 55%, rgba(255, 120, 20, 0) 72%); animation: hc-core 1.1s ease-out forwards; }
@keyframes hc-core { 0% { transform: scale(.2); opacity: 1; } 30% { transform: scale(1.8); opacity: 1; } 100% { transform: scale(2.6); opacity: 0; } }
.hc-scorch { position: absolute; width: 180px; height: 46px; margin: -23px -90px; border-radius: 50%; background: radial-gradient(ellipse, rgba(20, 10, 6, 0.85), rgba(60, 24, 8, 0.5) 50%, transparent 72%); opacity: 0; animation: hc-scorch 4s ease-out .2s forwards; }
@keyframes hc-scorch { 10% { opacity: 1; } 75% { opacity: .9; } 100% { opacity: 0; } }
.hc-holo-pillar { position: absolute; width: 70px; height: 70vh; margin-left: -35px; transform-origin: 50% 100%; translate: 0 -100%; background: linear-gradient(0deg, rgba(120, 230, 255, 0.85), rgba(95, 216, 255, 0.35) 40%, transparent); border-radius: 35px 35px 0 0; animation: hc-pillar 2.6s ease-out forwards; }
@keyframes hc-pillar { 0% { transform: scaleY(0); opacity: 0; } 25% { transform: scaleY(1); opacity: 1; } 100% { transform: scaleY(1); opacity: 0; } }
.hc-holo-ring { position: absolute; width: 60px; height: 60px; margin: -30px; border-radius: 50%; border: 3px solid #8fe8ff; box-shadow: 0 0 18px #5fd8ff; opacity: 0; animation: hc-holoring 1.6s ease-out forwards; }
@keyframes hc-holoring { 0% { transform: scale(.4); opacity: 1; } 100% { transform: scale(6); opacity: 0; } }
.hc-fb { position: absolute; left: 0; top: 0; border-radius: 50%; background: radial-gradient(circle, #fffbe6, #ffd36a 25%, #ff8a1a 50%, #c2300a 72%, rgba(80, 20, 8, 0) 74%); will-change: transform, opacity; }
.hc-streak { position: absolute; width: 50px; height: 2px; transform-origin: 0 50%; background: linear-gradient(90deg, #fff, #ffb03a 50%, transparent); }
.hc-smoke2 { position: absolute; width: 26px; height: 26px; margin: -13px; border-radius: 50%; background: radial-gradient(circle, rgba(90, 84, 80, 0.75), rgba(50, 46, 44, 0.4) 55%, transparent 70%); animation: hc-smoke2 2.2s ease-out forwards; }
@keyframes hc-smoke2 { from { transform: scale(.4); opacity: .9; } to { transform: scale(2.6) translate(-10px, -16px); opacity: 0; } }
.hc-ember { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: radial-gradient(circle, #fff6c0, #ff8a1a 60%, transparent); }
.hc-rock { width: min(30vw, 170px); }
.hc-rock .ck-fl { animation: hc-flicker .14s steps(2) infinite; transform-origin: 54% 50%; }
.sd-eng { animation: hc-eng 1.4s ease-in-out infinite alternate; }
@keyframes hc-eng { to { opacity: .7; } }
.sd-run { animation: hc-blink 1.2s steps(2) infinite; }
.sd-run.b { animation-delay: .6s; }
/* ---- level 25 arrival (old) ---- */
.hn-arrive { position: fixed; inset: 0; z-index: 9800; overflow: hidden; background: rgba(0, 0, 0, 0.75); display: grid; place-items: center; cursor: pointer; animation: hn-fadein .4s ease; }
@keyframes hn-fadein { from { opacity: 0; } }
.hn-arrive .warn { position: absolute; top: 18%; left: 0; right: 0; text-align: center; font: 900 clamp(18px, 5vw, 34px) var(--font-display); letter-spacing: .2em; color: #ff3a3a; text-shadow: 0 0 20px #ff0000; animation: hn-warn .5s steps(2) 3, hn-out .3s 1.5s forwards; }
@keyframes hn-warn { 50% { opacity: 0; } }
@keyframes hn-out { to { opacity: 0; visibility: hidden; } }
.hn-arrive .red { position: absolute; inset: 0; box-shadow: inset 0 0 120px rgba(255, 0, 0, 0.6); animation: hn-warn .5s steps(2) 3, hn-out .3s 1.5s forwards; }
.hn-arrive .beacon { position: absolute; left: 50%; top: 50%; width: 84px; height: 84px; margin: -42px; opacity: 0; animation: hn-fall .9s cubic-bezier(.5,0,.9,.6) 1.5s forwards; }
.hn-arrive .beacon svg { width: 100%; height: 100%; display: block; }
.hn-arrive .beacon::before { content: ''; position: absolute; left: 50%; bottom: 60%; width: 40px; height: 220px; margin-left: -20px; border-radius: 20px; background: linear-gradient(0deg, #fff4c0, #ff9a3a 30%, rgba(255, 60, 20, 0.4) 70%, transparent); filter: blur(4px); }
@keyframes hn-fall { 0% { opacity: 1; transform: translate(40vw, -70vh) rotate(-30deg) scale(.5); } 100% { opacity: 1; transform: none; } }
.hn-arrive .flash { position: absolute; inset: 0; background: #fff; opacity: 0; animation: hn-flash .7s ease-out 2.4s forwards; }
@keyframes hn-flash { 0% { opacity: 0; } 10% { opacity: 1; } 100% { opacity: 0; } }
.hn-arrive .shock { position: absolute; left: 50%; top: 50%; width: 40px; height: 40px; margin: -20px; border-radius: 50%; border: 6px solid #ffd09a; opacity: 0; animation: hn-shock .9s ease-out 2.4s forwards; }
@keyframes hn-shock { 0% { opacity: 1; transform: scale(.5); } 100% { opacity: 0; transform: scale(30); } }
.hn-arrive .deb { position: absolute; left: 50%; top: 50%; width: 10px; height: 10px; background: #5a4a3a; border-top: 2px solid #ff8a3a; opacity: 0; animation: hn-deb 1.1s cubic-bezier(.1,.8,.3,1) 2.45s forwards; }
@keyframes hn-deb { 0% { opacity: 1; transform: translate(0, 0) rotate(0); } 100% { opacity: 0; transform: translate(var(--x), var(--y)) rotate(540deg); } }
.hn-arrive .holo { position: absolute; left: 50%; top: 50%; width: min(70vmin, 420px); transform: translate(-50%, -50%); text-align: center; opacity: 0; animation: hn-holoin .6s steps(4) 3.1s forwards, hn-dock .9s cubic-bezier(.6,0,.3,1) 5.4s forwards; }
.hn-arrive .holo .ring { width: 150px; height: 150px; margin: 0 auto 10px; border-radius: 50%; display: grid; place-items: center; color: #8fe8ff; background: radial-gradient(circle, rgba(95, 216, 255, 0.35), transparent 70%); box-shadow: 0 0 40px rgba(95, 216, 255, 0.6); }
.hn-arrive .holo .ring svg { width: 90px; height: 90px; }
.hn-arrive .holo small { display: block; letter-spacing: .3em; color: #8fe8ff; font-size: 12px; }
.hn-arrive .holo b { display: block; font: 900 clamp(26px, 7vw, 48px) var(--font-display); letter-spacing: .14em; color: #dff8ff; text-shadow: 0 0 20px #5fd8ff, 0 0 40px #1a8ac8; }
.hn-arrive .holo span { color: #bfeaff; }
@keyframes hn-holoin { 0% { opacity: 0; } 25% { opacity: .6; } 50% { opacity: .2; } 100% { opacity: 1; } }
@keyframes hn-dock { to { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(.08); } }
.hn-arrive .skip { position: absolute; bottom: 20px; right: 20px; font-size: 12px; color: #9fc4d8; letter-spacing: .1em; }
.hn-arrive.shake { animation: hn-shake .08s linear 8; }
@keyframes hn-shake { 50% { transform: translate(6px, -4px); } }
.main-nav [data-nav="holonet"].hn-lock { animation: hn-lock .8s ease-out; }
@keyframes hn-lock { 0% { transform: scale(1.6); filter: drop-shadow(0 0 20px #5fd8ff); } 100% { transform: none; } }

/* ---- bounty capture ---- */
.hn-capture { position: fixed; inset: 0; z-index: 9700; background: radial-gradient(circle at 50% 45%, rgba(20, 40, 60, 0.95), rgba(2, 4, 8, 0.98)); display: grid; place-items: center; overflow: hidden; }
.hn-capture .stage { position: relative; width: min(80vmin, 420px); aspect-ratio: 1; }
.hn-capture .stage > * { position: absolute; inset: 0; }
.hn-capture .pk svg { width: 100%; height: 100%; }
.hn-capture .acq { top: auto; bottom: -50px; text-align: center; font: 800 clamp(14px, 3.4vw, 20px) var(--font-display); letter-spacing: .2em; color: #8fe8ff; opacity: 0; animation: hn-title 3.6s 1.4s ease forwards; }
.hn-capture .acq small { display: block; font-size: .7em; color: #ffcf8a; letter-spacing: .14em; }
.hn-capture .zap { background: #dff8ff; opacity: 0; mix-blend-mode: screen; animation: hn-flash .5s 2.9s forwards; border-radius: 50%; }
.hn-capture .slab { inset: 8% 24%; border-radius: 8px; background: linear-gradient(135deg, #6a7480, #3a424c 50%, #20262e); box-shadow: inset 0 0 20px #000, 0 0 30px rgba(140, 180, 220, 0.4); opacity: 0; transform: scale(.6); animation: hn-slab .5s cubic-bezier(.2,.9,.3,1.2) 3.05s forwards, hn-burst .45s ease-in 4.3s forwards; display: grid; place-items: center; overflow: hidden; }
.hn-capture .slab svg { width: 86%; height: auto; opacity: .55; filter: grayscale(1) contrast(1.4); }
.hn-capture .slab .crack { position: absolute; inset: 0; }
.hn-capture .slab .crack path { fill: none; stroke: #ffe8b0; stroke-width: 1.4; stroke-dasharray: 200; stroke-dashoffset: 200; animation: hn-crack .6s ease-out 3.7s forwards; filter: drop-shadow(0 0 4px #ffcf7a); }
@keyframes hn-slab { to { opacity: 1; transform: none; } }
@keyframes hn-burst { to { opacity: 0; transform: scale(1.4); filter: brightness(3); } }
@keyframes hn-crack { to { stroke-dashoffset: 0; } }
.hn-capture .pk { animation: hn-pkin .9s cubic-bezier(.2,.9,.3,1.15) both, hn-pkdown .6s ease-in-out 1s forwards, hn-out .2s 3s forwards; }
.hn-capture .pk svg { animation: hn-hover 1.6s ease-in-out .9s infinite; }
@keyframes hn-hover { 50% { transform: translateY(-3%); } }
/* The target's hologram rises out of the puck before it's frozen in carbonite. */
.hn-capture .beam { inset: 30% 30% 22%; background: linear-gradient(0deg, color-mix(in srgb, var(--tc) 55%, transparent), transparent 85%); clip-path: polygon(44% 100%, 56% 100%, 100% 0, 0 0); opacity: 0; filter: blur(2px); animation: hn-beamup .5s ease-out 1.3s forwards, hn-out .2s 3s forwards; }
.hn-capture .holo { inset: 4% 26% 34%; display: grid; place-items: center; opacity: 0; animation: hn-holo .6s ease-out 1.5s forwards, hn-out .2s 3s forwards; }
.hn-capture .holo svg { width: 100%; height: auto; filter: drop-shadow(0 0 6px var(--tc)) drop-shadow(0 0 16px var(--tc)); animation: hn-flick 1.6s 1.5s infinite, hn-turn 2.4s 1.5s ease-in-out infinite; }
.hn-capture .holo::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.12) 0 1px, transparent 1px 4px); mix-blend-mode: overlay; animation: hn-scan 1.2s linear infinite; }
@keyframes hn-pkin { from { opacity: 0; transform: translateY(-40%) scale(.5) rotate(-40deg); } to { opacity: 1; transform: none; } }
@keyframes hn-pkdown { to { transform: translateY(30%) scale(.42); } }
@keyframes hn-beamup { from { opacity: 0; transform: scaleY(.1); transform-origin: 50% 100%; } to { opacity: .9; transform: none; } }
@keyframes hn-holo { from { opacity: 0; transform: translateY(18%) scaleY(.2); } to { opacity: .95; transform: none; } }
@keyframes hn-scan { to { background-position: 0 8px; } }
.hn-capture .tap { position: absolute; bottom: 16px; right: 16px; font-size: 12px; color: #9fc4d8; }
/* Bounty data: the puck projects each card as a hologram, then decrypts it to full colour.
   Every animation here is transform/opacity only, so phones never repaint the card mid-reveal. */
.hn-bounty { position: fixed; inset: 0; z-index: 9700; background: radial-gradient(circle at 50% 45%, #14283c, #020408); display: grid; grid-template-rows: auto 1fr auto auto; justify-items: center; gap: 8px; padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom)); overflow: hidden; color: #dff4ff; }
.hn-bounty::before { content: ''; position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(120, 200, 255, 0.035) 0 1px, transparent 1px 3px); }
.hn-bounty .hb-top { text-align: center; display: grid; gap: 2px; position: relative; }
.hn-bounty .hb-top .eyebrow { color: var(--tc); margin: 0; }
.hn-bounty .hb-top h2 { margin: 0; font-size: clamp(18px, 4.6vw, 26px); min-height: 1.3em; }
.hn-bounty .hb-top small { font: 700 11px var(--font-display); letter-spacing: .2em; color: #8fb4c8; }
.hn-bounty .hb-stage { position: relative; width: min(64vw, 240px, 40vh); display: grid; align-content: center; justify-items: center; cursor: pointer; contain: layout style; }
.hn-bounty .hb-card { position: relative; width: 100%; opacity: 0; transform-origin: 50% 100%; }
.hn-bounty .hb-card .ucard { width: 100%; }
.hn-bounty .hb-card .glow { position: absolute; inset: 0; border-radius: 12px; box-shadow: 0 0 30px 4px var(--rc); opacity: 0; }
.hn-bounty .hb-tint { position: absolute; inset: 0; border-radius: 12px; background: var(--tc); mix-blend-mode: color; pointer-events: none; transform-origin: 50% 100%; }
.hn-bounty .hb-tint::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.16) 0 1px, transparent 1px 4px); }
.hn-bounty .hb-sw { position: absolute; inset: 0; pointer-events: none; opacity: 0; }
.hn-bounty .hb-sw i { position: absolute; left: -6%; right: -6%; top: 0; height: 3px; background: #fff; box-shadow: 0 0 12px 3px var(--tc); }
.hn-bounty .hb-stamp { position: absolute; top: 10%; right: -8%; z-index: 3; padding: 4px 10px; border: 2px solid currentColor; border-radius: 6px; font: 800 clamp(12px, 3.4vw, 16px) var(--font-display); letter-spacing: .12em; color: #ff9a2a; background: rgba(10, 6, 2, 0.75); transform: rotate(12deg) scale(2.4); opacity: 0; }
.hn-bounty .hb-stamp.dup { color: #7fd0ff; }
.hn-bounty .hb-hv { position: absolute; top: -34px; left: 50%; z-index: 3; padding: 3px 10px; border-radius: 6px; font: 800 11px var(--font-display); letter-spacing: .2em; white-space: nowrap; color: #160800; background: var(--rc); box-shadow: 0 0 16px var(--rc); transform: translateX(-50%); opacity: 0; }
.hn-bounty .hb-ring { position: absolute; left: 50%; top: 50%; width: 120%; aspect-ratio: 1; margin: -60% 0 0 -60%; border-radius: 50%; border: 3px solid var(--rc); opacity: 0; pointer-events: none; }
.hn-bounty .hb-beam { width: 76%; height: 46px; margin-top: -4px; background: linear-gradient(0deg, color-mix(in srgb, var(--tc) 60%, transparent), transparent); clip-path: polygon(42% 100%, 58% 100%, 100% 0, 0 0); opacity: 0; transform-origin: 50% 100%; }
.hn-bounty .hb-puck { position: relative; width: 74px; height: 74px; animation: hn-hover 1.6s ease-in-out infinite; }
.hn-bounty .hb-puck svg { width: 100%; height: 100%; }
.hn-bounty .hb-puck::after { content: ''; position: absolute; left: 22%; right: 22%; top: 38%; height: 14%; border-radius: 50%; background: var(--tc); opacity: 0; }
.hn-bounty .hb-tray { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; min-height: 30px; max-width: 700px; }
.hn-bounty .hb-mini { position: relative; width: 46px; animation: hb-tray .35s cubic-bezier(.2,.9,.3,1.3); }
.hn-bounty .hb-mini .thumb { width: 46px; height: 46px; border-radius: 10px; overflow: hidden; border: 2px solid var(--rc); background: #070b12; }
.hn-bounty .hb-mini .thumb .portrait { width: 100%; height: 100%; }
.hn-bounty .hb-mini .full { display: none; }
.hn-bounty .hb-mini .ucard { width: 100%; }
.hn-bounty .hb-mini .t { position: absolute; left: 50%; bottom: -6px; transform: translateX(-50%); padding: 1px 5px; border-radius: 5px; font-size: 9px; font-weight: 800; white-space: nowrap; background: #1a6a9a; color: #fff; }
.hn-bounty .hb-mini .t.new { background: #ff9a2a; color: #1a0e00; }
.hn-bounty .hb-act { display: flex; gap: 10px; min-height: 42px; align-items: center; }
.hn-bounty .hb-hint { font-size: 12px; color: #9fc4d8; }
/* Projection: the puck's lens flares, the beam opens, the card unfolds out of a thin line of light,
   flickers, then a scan line sweeps it into full colour and the stamp lands. */
.hn-bounty .go .hb-card, .hn-bounty .go .hb-tint, .hn-bounty .go .hb-sw { will-change: transform, opacity; }
.hn-bounty .go .hb-puck::after { animation: hb-lens 1.2s ease-out forwards; }
.hn-bounty .go .hb-card { animation: hb-proj .6s cubic-bezier(.2,.8,.3,1) .12s forwards; }
.hn-bounty .go .hb-beam { animation: hb-beam 1.5s ease-out forwards; }
.hn-bounty .go .hb-tint { animation: hb-decrypt .55s ease-in var(--dt) forwards; }
.hn-bounty .go .hb-sw { animation: hb-sweep .55s ease-in var(--dt) forwards; }
.hn-bounty .go .glow { animation: hb-glow .6s ease-out calc(var(--dt) + .5s) forwards; }
.hn-bounty .go .hb-stamp { animation: hb-stamp .3s cubic-bezier(.3,1.4,.5,1) calc(var(--dt) + .65s) forwards; }
.hn-bounty .go .hb-hv { animation: hb-hv .9s steps(1) .55s 2 forwards; }
.hn-bounty .go .hb-ring { animation: hb-ring .7s ease-out calc(var(--dt) + .5s) forwards; }
.hn-bounty .go.shake { animation: hb-shake .4s calc(var(--dt) + .5s); }
.hn-bounty .skip .hb-card, .hn-bounty .skip .glow, .hn-bounty .skip .hb-stamp { animation: none; opacity: 1; transform: none; }
.hn-bounty .skip .hb-stamp { transform: rotate(12deg); }
.hn-bounty .skip .hb-tint, .hn-bounty .skip .hb-sw, .hn-bounty .skip .hb-hv, .hn-bounty .skip .hb-ring { animation: none; opacity: 0; }
@keyframes hb-lens { 0% { opacity: 0; transform: scale(.4); } 25% { opacity: 1; transform: scale(1.3); } 100% { opacity: .35; transform: none; } }
@keyframes hb-proj { 0% { opacity: 0; transform: scale(.25, .015); } 30% { opacity: 1; transform: scale(1, .015); } 62% { opacity: .55; transform: scale(1, 1.02); } 70% { opacity: .95; } 78% { opacity: .65; } 100% { opacity: 1; transform: none; } }
@keyframes hb-beam { 0% { opacity: 0; transform: scaleY(.2); } 20% { opacity: .95; transform: none; } 75% { opacity: .7; } 100% { opacity: 0; } }
@keyframes hb-decrypt { from { transform: none; } to { transform: scaleY(0); } }
@keyframes hb-sweep { 0% { opacity: 1; transform: none; } 90% { opacity: 1; transform: translateY(100%); } 100% { opacity: 0; transform: translateY(100%); } }
@keyframes hb-glow { 0% { opacity: 0; } 40% { opacity: 1; } 100% { opacity: .55; } }
@keyframes hb-stamp { to { opacity: 1; transform: rotate(12deg) scale(1); } }
@keyframes hb-hv { 0% { opacity: 1; } 50% { opacity: .25; } 100% { opacity: 1; } }
@keyframes hb-ring { from { opacity: .9; transform: scale(.5); } to { opacity: 0; transform: scale(1.25); } }
@keyframes hb-shake { 20% { transform: translate(-3px, 1px); } 40% { transform: translate(3px, -1px); } 60% { transform: translate(-2px, 0); } 80% { transform: translate(2px, 1px); } }
@keyframes hb-tray { from { opacity: 0; transform: translateY(-60px) scale(1.8); } }
.hn-bounty.done .hb-stage, .hn-bounty.done .hb-beam { display: none; }
.hn-bounty.done .hb-tray { align-self: center; align-content: center; min-height: 0; gap: 14px 10px; max-height: 100%; overflow-y: auto; padding: 4px 4px 10px; }
.hn-bounty.done { grid-template-rows: auto minmax(0, 1fr) auto; }
.hn-bounty.done .hb-mini { width: min(40vw, 150px); animation: hb-deal .45s cubic-bezier(.2,.9,.3,1.2) calc(var(--k) * 70ms) both; }
.hn-bounty.done .hb-mini .thumb { display: none; }
.hn-bounty.done .hb-mini .full { display: block; }
.hn-bounty.done .hb-mini .t { font-size: 10px; bottom: -8px; }
@keyframes hb-deal { from { opacity: 0; transform: translateY(24px) scale(.85); } }
.hn-reveal { display: grid; gap: 12px; }
.hn-reveal .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(30%, 120px), 1fr)); gap: 10px; }
.hn-reveal .rc { position: relative; opacity: 0; transform: translateY(16px) rotateY(80deg); animation: hn-flip .5s cubic-bezier(.2,.9,.3,1.2) var(--t) forwards; }
.hn-reveal .rc .ucard { width: 100%; }
.hn-reveal .rc .tag { position: absolute; top: -6px; right: -4px; z-index: 2; padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 800; background: #1a6a9a; color: #fff; }
.hn-reveal .rc .tag.new { background: #ff9a2a; color: #1a0e00; }
.hn-reveal .rc.big { animation-name: hn-flip, hn-shine; animation-duration: .5s, 1.6s; animation-delay: var(--t), calc(var(--t) + .5s); animation-iteration-count: 1, infinite; }
@keyframes hn-flip { to { opacity: 1; transform: none; } }
@keyframes hn-shine { 50% { filter: drop-shadow(0 0 12px #ffd23f); } }
.hn-result .big-num { font: 800 clamp(28px, 8vw, 44px) var(--font-display); text-align: center; letter-spacing: .06em; }
.hn-result .rows { display: grid; gap: 6px; }
.hn-result .rows div { display: flex; justify-content: space-between; gap: 10px; padding: 8px 12px; border-radius: 10px; background: rgba(255, 255, 255, 0.04); }
.hn-promos { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.hn-promos .promo { flex: 1 1 120px; }
.hn-result .promo { padding: 10px; border-radius: 12px; text-align: center; background: linear-gradient(135deg, rgba(95, 216, 255, 0.18), rgba(255, 210, 63, 0.12)); border: 1px solid rgba(95, 216, 255, 0.5); }
.hn-result .promo .hn-badge { width: 84px; height: auto; display: block; margin: 0 auto; }
@media (prefers-reduced-motion: reduce) { .hn-holo, .hn-badge.legend * { animation: none !important; } }
`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- the 4th tab ----------
  const nav = document.querySelector('.main-nav');
  if (nav && !nav.querySelector('[data-nav="holonet"]')) {
    const b = el(`<button type="button" data-nav="holonet"><span class="nav-ico">${NAV_ICO}</span><span class="nav-lbl">HoloNet</span></button>`);
    const saber = nav.querySelector('.nav-saber');
    nav.insertBefore(b, saber || null);
  }
  const syncTab = () => {
    const shown = unlocked() && (S().seen || focus());
    document.body.classList.toggle('hn-on', shown);
    document.body.classList.toggle('hn-focus', focus());
  };

  // Router: HoloNet is index 3; focus mode hides the rest of the game.
  const baseGo = App.go;
  App.go = function (screen, params, opts) {
    if (focus() && ['home', 'collection', 'market', 'campaign', 'squad', 'secret'].includes(screen)) { screen = 'holonet'; params = params && params.view ? params : {}; }
    if (screen === 'campaign' && HNB.retreated) { HNB.retreated = false; screen = 'holonet'; params = HNB.back || {}; }
    // Leaving a friendly battle goes back to the game, with Friends open.
    if (screen === 'holonet' && params && params.friends) { screen = 'home'; params = {}; setTimeout(() => { if (HN.friends) HN.friends.open(); }, 300); }
    const r = baseGo.call(this, screen, params, opts);
    // Go online only once a level 25+ player actually opens the HoloNet.
    if (screen === 'holonet' && unlocked()) { HN.Net.init(); if (HN.Duel && HN.Duel.start) HN.Duel.start(); }
    const navEl = document.querySelector('.main-nav');
    if (screen === 'holonet' && navEl) { navEl.style.setProperty('--ti', 3); navEl.dataset.tab = 3; }
    syncTab();
    maybeArrive();
    return r;
  };

  // Tap and swipe into the HoloNet from the Black Market (and back).
  document.querySelector('.topbar').addEventListener('click', (e) => {
    const b = e.target.closest('[data-nav="holonet"]');
    if (!b) return;
    e.stopPropagation();
    if (App.battleActive) return toast('Finish or retreat from the battle first.');
    App.go('holonet', {});
  }, true);
  (function swipe() {
    const screen = document.getElementById('screen');
    let sx = 0, sy = 0, on = false;
    screen.addEventListener('touchstart', (e) => {
      on = false;
      if (e.touches.length !== 1 || App.battleActive || !document.body.classList.contains('hn-on') || focus()) return;
      if (!['market', 'holonet'].includes(App.current) || e.target.closest('input, .modal-backdrop, [data-noswipe], .hn-seg, .hn-pick')) return;
      if (App.current === 'holonet' && (App.params || {}).view) return;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; on = true;
    }, { passive: true });
    screen.addEventListener('touchend', (e) => {
      if (!on) return;
      on = false;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) < innerWidth * 0.25 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      if (App.current === 'market' && dx < 0) setTimeout(() => App.go('holonet', {}), 30);
      if (App.current === 'holonet' && dx > 0) setTimeout(() => App.go('market'), 30);
    });
  })();

  // ---------- badges ----------
  const H = UI.hooks;
  const FEAT_ON = { id: 'hn_online', tier: 5, icon: 'holocron', name: 'HoloNet Online', desc: 'Unlocked the HoloNet Arena at level 25', have: 1, need: 1 };
  const bossFeat = (r) => ({ id: `hn_${r.id}`, tier: 4, icon: 'deathstar', name: `${r.name.replace('Supreme Leader ', '')} Has Fallen`, desc: `Helped bring down ${r.name} in a HoloNet raid`, have: 1, need: 1 });
  const FEAT_LEGEND = { id: 'hn_legend', tier: 6, icon: 'kybercrown', name: 'HoloNet Legend', desc: 'Reached the Legend league in the HoloNet Arena', have: 1, need: 1 };
  H.feats.push((s) => {
    const h = s.hn;
    if (!h) return [];
    const out = [];
    if (h.seen) out.push(FEAT_ON);
    for (const r of HN.RAIDS) if (h.beaten && h.beaten[r.id]) out.push(bossFeat(r));
    if ((h.leagues || []).includes('legend')) out.push(FEAT_LEGEND);
    return out;
  });
  let cseq = 0;
  H.crests.hn_online = () => {
    const u = `hnc${++cseq}`;
    return `<svg viewBox="-100 -100 200 200" aria-hidden="true"><defs><radialGradient id="${u}g"><stop offset="0" stop-color="#5fd8ff" stop-opacity=".6"/><stop offset="1" stop-color="#5fd8ff" stop-opacity="0"/></radialGradient><linearGradient id="${u}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ecffff"/><stop offset=".5" stop-color="#5fd8ff"/><stop offset="1" stop-color="#1a56a8"/></linearGradient></defs>
      <circle r="96" fill="url(#${u}g)"/><g class="hn-crest-spin">${Array.from({ length: 24 }, (_, k) => `<rect x="-1.5" y="-92" width="3" height="${k % 2 ? 10 : 18}" fill="#8fe8ff" opacity=".6" transform="rotate(${k * 15})"/>`).join('')}</g>
      <circle r="64" fill="#06121e" stroke="url(#${u}m)" stroke-width="5"/>
      <g fill="none" stroke="#dff8ff" stroke-width="5" stroke-linecap="round"><path d="M-30 -2 A30 30 0 0 1 30 -2"/><path d="M-16 6 A16 16 0 0 1 16 6"/></g><circle cy="12" r="7" fill="#fff"/><path d="M-26 46 L0 18 L26 46" fill="none" stroke="url(#${u}m)" stroke-width="6" stroke-linecap="round"/>
      <path d="M-58 64 H58 L66 76 L58 88 H-58 L-66 76Z" fill="#06121e" stroke="url(#${u}m)" stroke-width="3"/><text y="82" text-anchor="middle" font-family="Oxanium, sans-serif" font-weight="800" font-size="16" fill="#dff8ff" letter-spacing="3">HOLONET</text></svg>`;
  };
  for (const r of HN.RAIDS) {
    H.crests[`hn_${r.id}`] = () => {
      const u = `hnc${++cseq}`;
      const art = root.Art.unitArt(D.UNIT_MAP[r.id]).replace('<svg ', '<svg x="-62" y="-62" width="124" height="124" ');
      return `<svg viewBox="-100 -100 200 200" aria-hidden="true"><defs><clipPath id="${u}c"><circle r="62"/></clipPath><radialGradient id="${u}g"><stop offset="0" stop-color="${r.color}" stop-opacity=".55"/><stop offset="1" stop-color="${r.color}" stop-opacity="0"/></radialGradient></defs>
        <circle r="96" fill="url(#${u}g)"/>${Array.from({ length: 12 }, (_, k) => `<path d="M0 -94 L6 -70 L-6 -70Z" fill="${r.color}" opacity=".7" transform="rotate(${k * 30})"/>`).join('')}
        <circle r="68" fill="#120608" stroke="${r.color}" stroke-width="5"/><g clip-path="url(#${u}c)">${art}</g>
        <path d="M-50 58 H50 L58 72 L50 86 H-50 L-58 72Z" fill="#120608" stroke="${r.color}" stroke-width="3"/><text y="78" text-anchor="middle" font-family="Oxanium, sans-serif" font-weight="800" font-size="14" fill="#fff" letter-spacing="3">RAID</text></svg>`;
    };
  }
  H.crests.hn_legend = () => A.badge('legend');
  const award = (feat) => { try { UI.markFeatSeen(feat.id); return UI.playFeat(feat); } catch (e) { return null; } };

  // ---------- level 25 arrival cutscene ----------
  let arriving = false;
  function maybeArrive() {
    const h = S();
    if (arriving || h.seen || !unlocked() || App.battleActive || focus()) return;
    if (!['home', 'collection', 'market'].includes(App.current)) return;
    if (document.querySelector('.app-splash, .modal-backdrop, .walkout, .feat-show, .feat-cine, .tut-intro, .tut-coach, .rank-up, .hn-capture, .inst-help')) { setTimeout(maybeArrive, 1500); return; }
    arriving = true;
    setTimeout(() => arrive().then(() => { arriving = false; }, (err) => { arriving = false; console.error('hn arrive', err && err.message); }), 400);
  }
  // The level-25 arrival: a full-screen sequence. Red alert, Admiral Ackbar on
  // the comm, a Star Destroyer blasting the HoloNet relay, and a burning chunk
  // of it smashing into the empty 4th slot of the tab bar.
  const ACKBAR = "<svg viewBox=\"0 0 100 110\" aria-hidden=\"true\"><defs>\n    <linearGradient id=\"akBg\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#0e2a44\"/><stop offset=\".6\" stop-color=\"#071a2c\"/><stop offset=\"1\" stop-color=\"#030a14\"/></linearGradient>\n    <radialGradient id=\"akWin\" cx=\".5\" cy=\".9\" r=\".9\"><stop offset=\"0\" stop-color=\"#1a4a7a\" stop-opacity=\".55\"/><stop offset=\"1\" stop-color=\"#1a4a7a\" stop-opacity=\"0\"/></radialGradient>\n    <radialGradient id=\"akHead\" cx=\".38\" cy=\".24\" r=\".88\"><stop offset=\"0\" stop-color=\"#f6b892\"/><stop offset=\".3\" stop-color=\"#d98058\"/><stop offset=\".65\" stop-color=\"#a9543a\"/><stop offset=\"1\" stop-color=\"#5a2416\"/></radialGradient><radialGradient id=\"akCheek\" cx=\".5\" cy=\".5\" r=\".5\"><stop offset=\"0\" stop-color=\"#f4c8a8\" stop-opacity=\".55\"/><stop offset=\"1\" stop-color=\"#f4c8a8\" stop-opacity=\"0\"/></radialGradient><filter id=\"akSoft\" x=\"-10%\" y=\"-10%\" width=\"120%\" height=\"120%\"><feGaussianBlur stdDeviation=\".7\"/></filter>\n    <radialGradient id=\"akEye\" cx=\".38\" cy=\".34\" r=\".72\"><stop offset=\"0\" stop-color=\"#fff0b0\"/><stop offset=\".28\" stop-color=\"#ffbe3c\"/><stop offset=\".7\" stop-color=\"#c8640e\"/><stop offset=\"1\" stop-color=\"#4a1c04\"/></radialGradient>\n    <radialGradient id=\"akLid\" cx=\".5\" cy=\".5\" r=\".55\"><stop offset=\".7\" stop-color=\"#a24a2a\"/><stop offset=\"1\" stop-color=\"#b85a38\" stop-opacity=\"0\"/></radialGradient>\n    <linearGradient id=\"akBarb\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#d27a50\"/><stop offset=\".7\" stop-color=\"#a24a2a\"/><stop offset=\"1\" stop-color=\"#6e2c18\"/></linearGradient>\n    <linearGradient id=\"akSuit\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#fbf8f1\"/><stop offset=\".55\" stop-color=\"#ddd6c6\"/><stop offset=\"1\" stop-color=\"#9e978a\"/></linearGradient>\n    <linearGradient id=\"akShade\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\".45\" stop-color=\"#3a0e04\" stop-opacity=\"0\"/><stop offset=\"1\" stop-color=\"#3a0e04\" stop-opacity=\".45\"/></linearGradient>\n  </defs>\n  <rect width=\"100\" height=\"110\" fill=\"url(#akBg)\"/>\n  <path d=\"M-4 58 C10 20 40 6 50 6 C60 6 90 20 104 58 L104 66 C88 30 62 16 50 16 C38 16 12 30 -4 66Z\" fill=\"#0a1828\"/>\n  <path d=\"M-4 66 C12 30 38 16 50 16 C62 16 88 30 104 66 L104 78 L-4 78Z\" fill=\"url(#akWin)\"/>\n  <circle cx=\"12\" cy=\"34\" r=\"0.35\" fill=\"#dff0ff\" opacity=\".8\"/><circle cx=\"24\" cy=\"24\" r=\"0.55\" fill=\"#dff0ff\" opacity=\".8\"/><circle cx=\"40\" cy=\"22\" r=\"0.75\" fill=\"#dff0ff\" opacity=\".8\"/><circle cx=\"70\" cy=\"21\" r=\"0.35\" fill=\"#dff0ff\" opacity=\".8\"/><circle cx=\"84\" cy=\"30\" r=\"0.55\" fill=\"#dff0ff\" opacity=\".8\"/><circle cx=\"30\" cy=\"30\" r=\"0.75\" fill=\"#dff0ff\" opacity=\".8\"/><circle cx=\"76\" cy=\"40\" r=\"0.35\" fill=\"#dff0ff\" opacity=\".8\"/><circle cx=\"18\" cy=\"50\" r=\"0.55\" fill=\"#dff0ff\" opacity=\".8\"/><circle cx=\"90\" cy=\"52\" r=\"0.75\" fill=\"#dff0ff\" opacity=\".8\"/>\n  <path d=\"M26 20 L20 78 M50 16 L50 78 M74 20 L80 78\" stroke=\"#0a1828\" stroke-width=\"2.6\"/>\n  <g opacity=\".9\"><rect x=\"2\" y=\"52\" width=\"20\" height=\"14\" rx=\"1.4\" fill=\"#06223a\" stroke=\"#3a9ad8\" stroke-width=\".5\"/>\n  <path d=\"M4 55 L20 55\" stroke=\"#2a7ab8\" stroke-width=\".3\" opacity=\".6\"/><path d=\"M4 58 L20 58\" stroke=\"#2a7ab8\" stroke-width=\".3\" opacity=\".6\"/><path d=\"M4 61 L20 61\" stroke=\"#2a7ab8\" stroke-width=\".3\" opacity=\".6\"/><path d=\"M4 64 L20 64\" stroke=\"#2a7ab8\" stroke-width=\".3\" opacity=\".6\"/><path d=\"M6 53 L6 65\" stroke=\"#2a7ab8\" stroke-width=\".3\" opacity=\".6\"/><path d=\"M10 53 L10 65\" stroke=\"#2a7ab8\" stroke-width=\".3\" opacity=\".6\"/><path d=\"M14 53 L14 65\" stroke=\"#2a7ab8\" stroke-width=\".3\" opacity=\".6\"/><path d=\"M18 53 L18 65\" stroke=\"#2a7ab8\" stroke-width=\".3\" opacity=\".6\"/>\n  <path d=\"M5 62 L9 58 L13 60 L18 55\" fill=\"none\" stroke=\"#7af0ff\" stroke-width=\".6\"/><circle cx=\"13\" cy=\"60\" r=\".8\" fill=\"#ff6a4a\"/>\n  <rect x=\"78\" y=\"52\" width=\"20\" height=\"14\" rx=\"1.4\" fill=\"#06223a\" stroke=\"#3a9ad8\" stroke-width=\".5\"/>\n  <circle cx=\"88\" cy=\"59\" r=\"5\" fill=\"none\" stroke=\"#3ab8e8\" stroke-width=\".4\"/><circle cx=\"88\" cy=\"59\" r=\"2.6\" fill=\"none\" stroke=\"#3ab8e8\" stroke-width=\".3\"/><path d=\"M88 59 L92 56\" stroke=\"#7af0ff\" stroke-width=\".5\"/><circle cx=\"85\" cy=\"57\" r=\".6\" fill=\"#ffd23f\"/><circle cx=\"91\" cy=\"62\" r=\".6\" fill=\"#ff5a4a\"/>\n  <rect x=\"80\" y=\"70\" width=\"2\" height=\"3\" fill=\"#3ab8e8\" opacity=\".6\"/><rect x=\"83.4\" y=\"71\" width=\"2\" height=\"4\" fill=\"#3ab8e8\" opacity=\".6\"/><rect x=\"86.8\" y=\"70\" width=\"2\" height=\"5\" fill=\"#3ab8e8\" opacity=\".6\"/><rect x=\"90.2\" y=\"71\" width=\"2\" height=\"3\" fill=\"#3ab8e8\" opacity=\".6\"/><rect x=\"93.6\" y=\"70\" width=\"2\" height=\"4\" fill=\"#3ab8e8\" opacity=\".6\"/><rect x=\"4\" y=\"70\" width=\"2.4\" height=\"1\" fill=\"#ffd23f\" opacity=\".8\"/><rect x=\"7.4\" y=\"70\" width=\"2.4\" height=\"1\" fill=\"#5fd8ff\" opacity=\".8\"/><rect x=\"10.8\" y=\"70\" width=\"2.4\" height=\"1\" fill=\"#ff6a4a\" opacity=\".8\"/><rect x=\"14.2\" y=\"70\" width=\"2.4\" height=\"1\" fill=\"#ffd23f\" opacity=\".8\"/><rect x=\"17.6\" y=\"70\" width=\"2.4\" height=\"1\" fill=\"#5fd8ff\" opacity=\".8\"/></g>\n  <rect x=\"6\" y=\"30\" width=\"4\" height=\"1.6\" rx=\".4\" fill=\"#5fd8ff\" opacity=\".85\"/><rect x=\"12\" y=\"36\" width=\"4\" height=\"1.6\" rx=\".4\" fill=\"#ff6a4a\" opacity=\".85\"/><rect x=\"84\" y=\"34\" width=\"4\" height=\"1.6\" rx=\".4\" fill=\"#ffd23f\" opacity=\".85\"/><rect x=\"90\" y=\"28\" width=\"4\" height=\"1.6\" rx=\".4\" fill=\"#5fd8ff\" opacity=\".85\"/><rect x=\"4\" y=\"44\" width=\"4\" height=\"1.6\" rx=\".4\" fill=\"#ff6a4a\" opacity=\".85\"/><rect x=\"92\" y=\"42\" width=\"4\" height=\"1.6\" rx=\".4\" fill=\"#ffd23f\" opacity=\".85\"/>\n  <path d=\"M-2 110 L-2 96 C10 90 30 88 50 88 C70 88 90 90 102 96 L102 110Z\" fill=\"#06121e\" opacity=\".6\"/>\n  <!-- uniform -->\n  <path d=\"M4 110 C6 94 20 86 36 83 L64 83 C80 86 94 94 96 110Z\" fill=\"url(#akSuit)\"/>\n  <path d=\"M36 83 C28 86 20 92 16 100\" fill=\"none\" stroke=\"#a69e8e\" stroke-width=\".8\"/><path d=\"M64 83 C72 86 80 92 84 100\" fill=\"none\" stroke=\"#a69e8e\" stroke-width=\".8\"/>\n  <path d=\"M33 84 C40 89 60 89 67 84 L65 77 C58 81 42 81 35 77Z\" fill=\"#f4f0e6\"/><path d=\"M33 84 C40 89 60 89 67 84\" fill=\"none\" stroke=\"#b4ac9c\" stroke-width=\".7\"/>\n  <path d=\"M22 92 C32 88 44 87 50 88 C56 87 68 88 78 92 L80 98 C68 95 58 94 50 95 C42 94 32 95 20 98Z\" fill=\"#cfc8b8\" opacity=\".75\"/><path d=\"M50 88 L50 110\" stroke=\"#b8b0a0\" stroke-width=\".9\"/><circle cx=\"53\" cy=\"95\" r=\".9\" fill=\"#c8c0b0\"/><circle cx=\"53\" cy=\"101\" r=\".9\" fill=\"#c8c0b0\"/>\n  <rect x=\"62\" y=\"93\" width=\"16\" height=\"6\" rx=\"1\" fill=\"#1a3a64\" stroke=\"#8aa8d0\" stroke-width=\".4\"/>\n  <rect x=\"64.4\" y=\"94.8\" width=\"2.4\" height=\"2.4\" rx=\".3\" fill=\"#ffd23f\"/><rect x=\"68\" y=\"94.8\" width=\"2.4\" height=\"2.4\" rx=\".3\" fill=\"#ff5a4a\"/><rect x=\"71.6\" y=\"94.8\" width=\"2.4\" height=\"2.4\" rx=\".3\" fill=\"#5ab4ff\"/><rect x=\"75.2\" y=\"94.8\" width=\"2.4\" height=\"2.4\" rx=\".3\" fill=\"#7ae0a0\"/>\n  <!-- neck -->\n  <path d=\"M38 70 L62 70 L64 80 C58 83 42 83 36 80Z\" fill=\"#a44e30\"/>\n  <!-- head: the tall Mon Calamari dome -->\n  <path d=\"M29 50 C26 34 30 18 42 11 C50 6.6 61 7.4 68.6 13 C77 19.6 79.6 33 77 47 C75.4 57 72 66 65.6 73 C60 78.6 41 78.8 35.6 73 C31 67.6 29.6 59 29 50Z\" fill=\"url(#akHead)\"/>\n  <path d=\"M29 50 C26 34 30 18 42 11 C50 6.6 61 7.4 68.6 13 C77 19.6 79.6 33 77 47 C75.4 57 72 66 65.6 73 C60 78.6 41 78.8 35.6 73 C31 67.6 29.6 59 29 50Z\" fill=\"url(#akShade)\"/>\n  <g filter=\"url(#akSoft)\" opacity=\".55\"><ellipse cx=\"47\" cy=\"16\" rx=\"5\" ry=\"3.4\" transform=\"rotate(20 47 16)\" fill=\"#7a301a\"/><ellipse cx=\"60\" cy=\"21\" rx=\"4.4\" ry=\"3\" transform=\"rotate(-30 60 21)\" fill=\"#7a301a\"/><ellipse cx=\"40\" cy=\"27\" rx=\"3.6\" ry=\"2.6\" transform=\"rotate(40 40 27)\" fill=\"#7a301a\"/><ellipse cx=\"66\" cy=\"33\" rx=\"3.2\" ry=\"4.4\" transform=\"rotate(10 66 33)\" fill=\"#7a301a\"/><ellipse cx=\"53\" cy=\"27\" rx=\"3\" ry=\"2\" transform=\"rotate(0 53 27)\" fill=\"#7a301a\"/><ellipse cx=\"35\" cy=\"37\" rx=\"2.6\" ry=\"3.4\" transform=\"rotate(-20 35 37)\" fill=\"#7a301a\"/><ellipse cx=\"70\" cy=\"52\" rx=\"2.6\" ry=\"3.6\" transform=\"rotate(15 70 52)\" fill=\"#7a301a\"/><ellipse cx=\"33\" cy=\"60\" rx=\"2.4\" ry=\"3\" transform=\"rotate(-10 33 60)\" fill=\"#7a301a\"/><ellipse cx=\"57\" cy=\"13\" rx=\"3\" ry=\"2\" transform=\"rotate(60 57 13)\" fill=\"#7a301a\"/></g>\n  <circle cx=\"55.6\" cy=\"32.0\" r=\"0.25\" fill=\"#ffd8c0\" opacity=\"0.22\"/><circle cx=\"43.0\" cy=\"38.9\" r=\"0.37\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"53.8\" cy=\"14.6\" r=\"0.49\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"55.8\" cy=\"36.1\" r=\"0.61\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"37.4\" cy=\"29.8\" r=\"0.25\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"71.8\" cy=\"21.5\" r=\"0.37\" fill=\"#ffd8c0\" opacity=\"0.22\"/><circle cx=\"49.7\" cy=\"39.0\" r=\"0.49\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"44.0\" cy=\"19.1\" r=\"0.61\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"76.5\" cy=\"39.5\" r=\"0.25\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"41.5\" cy=\"35.6\" r=\"0.37\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"60.5\" cy=\"16.9\" r=\"0.49\" fill=\"#ffd8c0\" opacity=\"0.22\"/><circle cx=\"53.6\" cy=\"36.2\" r=\"0.61\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"40.0\" cy=\"26.2\" r=\"0.25\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"74.0\" cy=\"28.0\" r=\"0.37\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"47.5\" cy=\"37.3\" r=\"0.49\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"49.9\" cy=\"18.4\" r=\"0.61\" fill=\"#ffd8c0\" opacity=\"0.22\"/><circle cx=\"71.2\" cy=\"45.5\" r=\"0.25\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"41.6\" cy=\"32.4\" r=\"0.37\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"65.5\" cy=\"20.8\" r=\"0.49\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"51.8\" cy=\"35.6\" r=\"0.61\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"43.7\" cy=\"23.7\" r=\"0.25\" fill=\"#ffd8c0\" opacity=\"0.22\"/><circle cx=\"73.4\" cy=\"34.4\" r=\"0.37\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"46.4\" cy=\"35.3\" r=\"0.49\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"55.4\" cy=\"19.4\" r=\"0.61\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"64.0\" cy=\"49.5\" r=\"0.25\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"43.0\" cy=\"29.6\" r=\"0.37\" fill=\"#ffd8c0\" opacity=\"0.22\"/><circle cx=\"68.4\" cy=\"25.7\" r=\"0.49\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"41.7\" cy=\"52.6\" r=\"0.61\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"47.9\" cy=\"22.6\" r=\"0.25\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"70.3\" cy=\"40.0\" r=\"0.37\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"46.3\" cy=\"33.3\" r=\"0.49\" fill=\"#ffd8c0\" opacity=\"0.22\"/><circle cx=\"59.9\" cy=\"21.8\" r=\"0.61\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"55.9\" cy=\"51.1\" r=\"0.25\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"45.3\" cy=\"27.7\" r=\"0.37\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"69.1\" cy=\"30.8\" r=\"0.49\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"34.5\" cy=\"47.8\" r=\"0.61\" fill=\"#ffd8c0\" opacity=\"0.22\"/><circle cx=\"52.1\" cy=\"22.8\" r=\"0.25\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"65.3\" cy=\"44.2\" r=\"0.37\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"47.0\" cy=\"31.6\" r=\"0.49\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"62.9\" cy=\"25.1\" r=\"0.61\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"48.0\" cy=\"50.3\" r=\"0.25\" fill=\"#ffd8c0\" opacity=\"0.22\"/><circle cx=\"48.0\" cy=\"26.7\" r=\"0.37\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"67.7\" cy=\"35.6\" r=\"0.49\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"29.9\" cy=\"41.5\" r=\"0.61\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"55.5\" cy=\"24.1\" r=\"0.25\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"59.1\" cy=\"46.5\" r=\"0.37\" fill=\"#ffd8c0\" opacity=\"0.22\"/><circle cx=\"48.3\" cy=\"30.5\" r=\"0.49\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"64.2\" cy=\"28.9\" r=\"0.61\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"41.2\" cy=\"47.4\" r=\"0.25\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"50.6\" cy=\"26.6\" r=\"0.37\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"64.5\" cy=\"39.4\" r=\"0.49\" fill=\"#ffd8c0\" opacity=\"0.22\"/><circle cx=\"28.2\" cy=\"34.5\" r=\"0.61\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"58.0\" cy=\"26.2\" r=\"0.25\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"52.7\" cy=\"46.9\" r=\"0.37\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"33.4\" cy=\"16.3\" r=\"0.49\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"63.8\" cy=\"32.5\" r=\"0.61\" fill=\"#ffd8c0\" opacity=\"0.22\"/><circle cx=\"36.2\" cy=\"42.9\" r=\"0.25\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"52.8\" cy=\"27.3\" r=\"0.37\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"60.1\" cy=\"41.9\" r=\"0.49\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"29.6\" cy=\"27.7\" r=\"0.61\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"59.2\" cy=\"28.6\" r=\"0.25\" fill=\"#ffd8c0\" opacity=\"0.22\"/><circle cx=\"46.8\" cy=\"45.4\" r=\"0.37\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"41.4\" cy=\"12.6\" r=\"0.49\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"62.0\" cy=\"35.5\" r=\"0.61\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"33.6\" cy=\"37.4\" r=\"0.25\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"54.2\" cy=\"28.5\" r=\"0.37\" fill=\"#ffd8c0\" opacity=\"0.22\"/><circle cx=\"55.4\" cy=\"42.8\" r=\"0.49\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"33.5\" cy=\"22.0\" r=\"0.61\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"59.2\" cy=\"31.0\" r=\"0.25\" fill=\"#7a321c\" opacity=\"0.32\"/><circle cx=\"42.1\" cy=\"42.5\" r=\"0.37\" fill=\"#7a321c\" opacity=\"0.32\"/>\n  <ellipse cx=\"50\" cy=\"60\" rx=\"15\" ry=\"9\" fill=\"url(#akCheek)\"/><ellipse cx=\"39\" cy=\"55\" rx=\"6\" ry=\"5\" fill=\"url(#akCheek)\"/><ellipse cx=\"61\" cy=\"55\" rx=\"6\" ry=\"5\" fill=\"url(#akCheek)\"/>\n  <ellipse cx=\"44\" cy=\"18\" rx=\"1.6\" ry=\"1.2800000000000002\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"52\" cy=\"14\" rx=\"1.2\" ry=\"0.96\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"58\" cy=\"17\" rx=\"2\" ry=\"1.6\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"63\" cy=\"23\" rx=\"1.4\" ry=\"1.1199999999999999\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"40\" cy=\"25\" rx=\"1.2\" ry=\"0.96\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"48\" cy=\"23\" rx=\"0.9\" ry=\"0.7200000000000001\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"56\" cy=\"26\" rx=\"1.1\" ry=\"0.8800000000000001\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"66\" cy=\"31\" rx=\"1.6\" ry=\"1.2800000000000002\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"37\" cy=\"33\" rx=\"1.3\" ry=\"1.04\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"61\" cy=\"33\" rx=\"0.8\" ry=\"0.6400000000000001\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"45\" cy=\"31\" rx=\"0.7\" ry=\"0.5599999999999999\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"69\" cy=\"39\" rx=\"1.1\" ry=\"0.8800000000000001\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"35\" cy=\"41\" rx=\"0.9\" ry=\"0.7200000000000001\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"54\" cy=\"20\" rx=\"0.7\" ry=\"0.5599999999999999\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"47\" cy=\"15\" rx=\"0.8\" ry=\"0.6400000000000001\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"62\" cy=\"13\" rx=\"1\" ry=\"0.8\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"41\" cy=\"19\" rx=\"0.7\" ry=\"0.5599999999999999\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"67\" cy=\"25\" rx=\"0.9\" ry=\"0.7200000000000001\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"38\" cy=\"29\" rx=\"0.6\" ry=\"0.48\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"58\" cy=\"36\" rx=\"0.7\" ry=\"0.5599999999999999\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"50\" cy=\"33\" rx=\"0.6\" ry=\"0.48\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"43\" cy=\"37\" rx=\"0.6\" ry=\"0.48\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"65\" cy=\"56\" rx=\"0.9\" ry=\"0.7200000000000001\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"36\" cy=\"58\" rx=\"0.8\" ry=\"0.6400000000000001\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"62\" cy=\"62\" rx=\"0.7\" ry=\"0.5599999999999999\" fill=\"#8a3a20\" opacity=\".38\"/><ellipse cx=\"40\" cy=\"64\" rx=\"0.7\" ry=\"0.5599999999999999\" fill=\"#8a3a20\" opacity=\".38\"/>\n  <circle cx=\"46\" cy=\"20\" r=\".55\" fill=\"#ffd8bc\" opacity=\".55\"/><circle cx=\"55\" cy=\"30\" r=\".55\" fill=\"#ffd8bc\" opacity=\".55\"/><circle cx=\"60\" cy=\"19\" r=\".55\" fill=\"#ffd8bc\" opacity=\".55\"/><circle cx=\"42\" cy=\"30\" r=\".55\" fill=\"#ffd8bc\" opacity=\".55\"/><circle cx=\"65\" cy=\"44\" r=\".55\" fill=\"#ffd8bc\" opacity=\".55\"/>\n  <path d=\"M35 24 C38 16 45 11 53 10\" fill=\"none\" stroke=\"#ffe2cc\" stroke-width=\"1.8\" stroke-linecap=\"round\" opacity=\".55\"/>\n  <path d=\"M29.6 44 C29 36 30 28 33 22\" fill=\"none\" stroke=\"#7fc8ff\" stroke-width=\".9\" stroke-linecap=\"round\" opacity=\".55\"/>\n  <!-- brow ridges and the folds between the eyes -->\n  <path d=\"M44 34 C46.6 37 47.4 41 47 45 M56 34 C53.4 37 52.6 41 53 45\" fill=\"none\" stroke=\"#8e3a20\" stroke-width=\"1\" stroke-linecap=\"round\" opacity=\".55\"/><path d=\"M42 30 C46 28.6 54 28.6 58 30\" fill=\"none\" stroke=\"#8e3a20\" stroke-width=\".9\" opacity=\".4\"/>\n  <path d=\"M46 44 C48 46 52 46 54 44 M45 49 C48 51 52 51 55 49\" fill=\"none\" stroke=\"#8e3a20\" stroke-width=\".8\" opacity=\".55\"/>\n  <!-- the great side eyes -->\n  <ellipse cx=\"31.4\" cy=\"46.6\" rx=\"10\" ry=\"10.8\" transform=\"rotate(-16 31.4 46.6)\" fill=\"url(#akLid)\"/>\n  <ellipse cx=\"72.4\" cy=\"45.6\" rx=\"10\" ry=\"10.8\" transform=\"rotate(16 72.4 45.6)\" fill=\"url(#akLid)\"/>\n  <ellipse cx=\"31.6\" cy=\"47\" rx=\"8.2\" ry=\"9\" transform=\"rotate(-16 31.6 47)\" fill=\"url(#akEye)\"/>\n  <ellipse cx=\"72.2\" cy=\"46\" rx=\"8.2\" ry=\"9\" transform=\"rotate(16 72.2 46)\" fill=\"url(#akEye)\"/>\n  <path d=\"M34.20 47.00 L38.20 47.00\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M74.80 46.00 L78.80 46.00\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M33.94 48.26 L37.55 50.21\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M74.54 47.26 L78.15 49.21\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M33.22 49.27 L35.72 52.79\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M73.82 48.27 L76.32 51.79\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M32.18 49.83 L33.07 54.21\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M72.78 48.83 L73.67 53.21\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M31.02 49.83 L30.13 54.21\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M71.62 48.83 L70.73 53.21\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M29.98 49.27 L27.48 52.79\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M70.58 48.27 L68.08 51.79\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M29.26 48.26 L25.65 50.21\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M69.86 47.26 L66.25 49.21\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M29.00 47.00 L25.00 47.00\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M69.60 46.00 L65.60 46.00\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M29.26 45.74 L25.65 43.79\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M69.86 44.74 L66.25 42.79\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M29.98 44.73 L27.48 41.21\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M70.58 43.73 L68.08 40.21\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M31.02 44.17 L30.13 39.79\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M71.62 43.17 L70.73 38.79\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M32.18 44.17 L33.07 39.79\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M72.78 43.17 L73.67 38.79\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M33.22 44.73 L35.72 41.21\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M73.82 43.73 L76.32 40.21\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M33.94 45.74 L37.55 43.79\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><path d=\"M74.54 44.74 L78.15 42.79\" stroke=\"#a24a08\" stroke-width=\".35\" opacity=\".5\"/><ellipse cx=\"31\" cy=\"48.4\" rx=\"3\" ry=\"1.5\" transform=\"rotate(-10 31 48.4)\" fill=\"#1e0a02\" opacity=\".9\"/>\n  <ellipse cx=\"72.8\" cy=\"47.4\" rx=\"3\" ry=\"1.5\" transform=\"rotate(10 72.8 47.4)\" fill=\"#1e0a02\" opacity=\".9\"/><path d=\"M24 54 C27 58.6 34 59.6 38.6 56\" fill=\"none\" stroke=\"#f0a882\" stroke-width=\".9\" opacity=\".6\"/><path d=\"M80 53 C77 57.6 70 58.6 65.4 55\" fill=\"none\" stroke=\"#f0a882\" stroke-width=\".9\" opacity=\".6\"/>\n  <ellipse cx=\"28.6\" cy=\"42.6\" rx=\"2.6\" ry=\"3.2\" transform=\"rotate(-24 28.6 42.6)\" fill=\"#fffbe8\" opacity=\".92\"/><circle cx=\"34\" cy=\"51.6\" r=\"1\" fill=\"#fffbe8\" opacity=\".55\"/>\n  <ellipse cx=\"69.8\" cy=\"41.8\" rx=\"2.6\" ry=\"3.2\" transform=\"rotate(-24 69.8 41.8)\" fill=\"#fffbe8\" opacity=\".92\"/><circle cx=\"75\" cy=\"50.6\" r=\"1\" fill=\"#fffbe8\" opacity=\".5\"/>\n  <path d=\"M22 42 C24.4 35.6 32 33 38.6 37 C35 36.4 30 37 26 40.6Z\" fill=\"#a24a2a\"/><path d=\"M24 50 C26 55 32 57 37 54\" fill=\"none\" stroke=\"#6e2a14\" stroke-width=\"1\" opacity=\".6\"/>\n  <path d=\"M82 41 C79.6 34.6 72 32 65.4 36 C69 35.4 74 36 78 39.6Z\" fill=\"#8e3e22\"/><path d=\"M80 49 C78 54 72 56 67 53\" fill=\"none\" stroke=\"#5a1e0c\" stroke-width=\"1\" opacity=\".6\"/>\n  <!-- nostril slits -->\n  <path d=\"M46.4 55 L48 56.6 M53.6 55 L52 56.6\" stroke=\"#5a1e0c\" stroke-width=\"1.2\" stroke-linecap=\"round\"/>\n  <!-- the wide, downturned mouth -->\n  <path d=\"M37.4 67 C42 63 58 63 62.6 67 C60 69.6 56 70.6 50 70.6 C44 70.6 40 69.6 37.4 67Z\" fill=\"#6a2410\"/>\n  <path d=\"M36.6 67.6 C42 62.6 58 62.6 63.4 67.6\" fill=\"none\" stroke=\"#3a0e04\" stroke-width=\"1.6\" stroke-linecap=\"round\"/>\n  <path d=\"M41 61.4 C45 59.6 55 59.6 59 61.4\" fill=\"none\" stroke=\"#f0a07a\" stroke-width=\".7\" opacity=\".55\"/><path d=\"M39.6 68.6 C44 71.6 56 71.6 60.4 68.6 C58 71 55 72.4 50 72.4 C45 72.4 42 71 39.6 68.6Z\" fill=\"#c26a48\"/>\n  <!-- barbels hanging from the chin -->\n  <path d=\"M38.4 69.4 C38.199999999999996 74.35000000000001 36.4 78.2 37.8 80.4 C39.199999999999996 78.2 42.6 74.35000000000001 42.4 69.4Z\" fill=\"url(#akBarb)\"/><path d=\"M39.8 70.4 C39.8 73.80000000000001 38.839999999999996 77.10000000000001 38.059999999999995 78.75\" fill=\"none\" stroke=\"#e8946c\" stroke-width=\".6\" opacity=\".6\"/><path d=\"M42.6 70.6 C42.4 76.89999999999999 42 81.8 43.4 84.6 C44.8 81.8 46.800000000000004 76.89999999999999 46.6 70.6Z\" fill=\"url(#akBarb)\"/><path d=\"M44 71.6 C44 76.19999999999999 43.88 80.39999999999999 43.52 82.5\" fill=\"none\" stroke=\"#e8946c\" stroke-width=\".6\" opacity=\".6\"/><path d=\"M48 71 C47.8 77.975 48.6 83.4 50 86.5 C51.4 83.4 52.2 77.975 52 71Z\" fill=\"url(#akBarb)\"/><path d=\"M49.4 72 C49.4 77.2 50 81.85 50 84.175\" fill=\"none\" stroke=\"#e8946c\" stroke-width=\".6\" opacity=\".6\"/><path d=\"M53.4 70.6 C53.199999999999996 76.89999999999999 55.2 81.8 56.6 84.6 C58 81.8 57.6 76.89999999999999 57.4 70.6Z\" fill=\"url(#akBarb)\"/><path d=\"M54.8 71.6 C54.8 76.19999999999999 56.12 80.39999999999999 56.48 82.5\" fill=\"none\" stroke=\"#e8946c\" stroke-width=\".6\" opacity=\".6\"/><path d=\"M57.6 69.4 C57.4 74.35000000000001 60.800000000000004 78.2 62.2 80.4 C63.6 78.2 61.800000000000004 74.35000000000001 61.6 69.4Z\" fill=\"url(#akBarb)\"/><path d=\"M59 70.4 C59 73.80000000000001 61.160000000000004 77.10000000000001 61.940000000000005 78.75\" fill=\"none\" stroke=\"#e8946c\" stroke-width=\".6\" opacity=\".6\"/>\n  <path d=\"M41 70.6 C44 72.6 56 72.6 59 70.6\" fill=\"none\" stroke=\"#5a1e0c\" stroke-width=\".6\" opacity=\".6\"/>\n</svg>";
  const DESTROYER = "<svg viewBox=\"0 0 330 140\" aria-hidden=\"true\"><defs>\n    <linearGradient id=\"sdT\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#c8d0dc\"/><stop offset=\"1\" stop-color=\"#8e98a6\"/></linearGradient>\n    <linearGradient id=\"sdN\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#8a94a2\"/><stop offset=\"1\" stop-color=\"#5e6876\"/></linearGradient>\n    <linearGradient id=\"sdS\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#4a525e\"/><stop offset=\"1\" stop-color=\"#2e343e\"/></linearGradient>\n    <radialGradient id=\"sdE\"><stop offset=\"0\" stop-color=\"#ffffff\"/><stop offset=\".4\" stop-color=\"#9ad8ff\"/><stop offset=\"1\" stop-color=\"#2a7ad8\" stop-opacity=\"0\"/></radialGradient>\n  </defs>\n  <path d=\"M58,106 L318,78 L318 84 L60 118Z\" fill=\"url(#sdS)\"/>\n  <path d=\"M60 112 L318 81\" stroke=\"#1e232a\" stroke-width=\"1.2\"/><path d=\"M60 115.4 L318 82.6\" stroke=\"#262c34\" stroke-width=\"2.4\"/>\n  <rect x=\"73.6\" y=\"106.4\" width=\"5.6\" height=\"2.8\" fill=\"#3a424e\"/><rect x=\"82.4\" y=\"105.5\" width=\"5.4\" height=\"2.7\" fill=\"#3a424e\"/><rect x=\"91.3\" y=\"104.5\" width=\"5.2\" height=\"2.6\" fill=\"#3a424e\"/><rect x=\"100.1\" y=\"103.6\" width=\"5.0\" height=\"2.5\" fill=\"#3a424e\"/><rect x=\"109.0\" y=\"102.7\" width=\"4.8\" height=\"2.4\" fill=\"#3a424e\"/><rect x=\"117.8\" y=\"101.8\" width=\"4.6\" height=\"2.3\" fill=\"#3a424e\"/><rect x=\"126.6\" y=\"100.9\" width=\"4.4\" height=\"2.2\" fill=\"#3a424e\"/><rect x=\"135.5\" y=\"100.0\" width=\"4.2\" height=\"2.1\" fill=\"#3a424e\"/><rect x=\"144.3\" y=\"99.0\" width=\"4.0\" height=\"2.0\" fill=\"#3a424e\"/><rect x=\"153.2\" y=\"98.1\" width=\"3.8\" height=\"1.9\" fill=\"#3a424e\"/><rect x=\"162.0\" y=\"97.2\" width=\"3.6\" height=\"1.8\" fill=\"#3a424e\"/><rect x=\"170.8\" y=\"96.3\" width=\"3.4\" height=\"1.7\" fill=\"#3a424e\"/><rect x=\"179.7\" y=\"95.4\" width=\"3.2\" height=\"1.6\" fill=\"#3a424e\"/><rect x=\"188.5\" y=\"94.4\" width=\"3.0\" height=\"1.5\" fill=\"#3a424e\"/><rect x=\"197.4\" y=\"93.5\" width=\"2.8\" height=\"1.4\" fill=\"#3a424e\"/><rect x=\"206.2\" y=\"92.6\" width=\"2.6\" height=\"1.3\" fill=\"#3a424e\"/><rect x=\"215.0\" y=\"91.7\" width=\"2.4\" height=\"1.2\" fill=\"#3a424e\"/><rect x=\"223.9\" y=\"90.8\" width=\"2.2\" height=\"1.1\" fill=\"#3a424e\"/><rect x=\"232.7\" y=\"89.9\" width=\"2.0\" height=\"1.0\" fill=\"#3a424e\"/><rect x=\"241.6\" y=\"88.9\" width=\"1.8\" height=\"0.9\" fill=\"#3a424e\"/><rect x=\"250.4\" y=\"88.0\" width=\"1.6\" height=\"0.8\" fill=\"#3a424e\"/><rect x=\"259.2\" y=\"87.1\" width=\"1.4\" height=\"0.7\" fill=\"#3a424e\"/><rect x=\"268.1\" y=\"86.2\" width=\"1.2\" height=\"0.6\" fill=\"#3a424e\"/><rect x=\"276.9\" y=\"85.3\" width=\"0.9\" height=\"0.5\" fill=\"#3a424e\"/><rect x=\"285.8\" y=\"84.3\" width=\"0.7\" height=\"0.4\" fill=\"#3a424e\"/><rect x=\"294.6\" y=\"83.4\" width=\"0.5\" height=\"0.3\" fill=\"#3a424e\"/>\n  <path d=\"M120 106 L170 100 L170 103 L120 109Z\" fill=\"#7ac8ff\" opacity=\".55\"/><path d=\"M120 106 L170 100\" stroke=\"#bfe6ff\" stroke-width=\".5\" opacity=\".8\"/>\n  <path d=\"M30,42 L44,70 L318,78Z\" fill=\"url(#sdT)\"/>\n  <path d=\"M44,70 L58,106 L318,78Z\" fill=\"url(#sdN)\"/>\n  <path d=\"M44,70 L318,78\" stroke=\"#e8eef6\" stroke-width=\".8\" opacity=\".7\"/>\n  <path d=\"M30,42 L318,78\" stroke=\"#eef4fa\" stroke-width=\".9\" opacity=\".8\"/>\n  <path d=\"M58,106 L318,78\" stroke=\"#aab4c2\" stroke-width=\".7\" opacity=\".7\"/>\n  <rect x=\"159.0\" y=\"66.2\" width=\"1.5\" height=\"0.7\" fill=\"#6e7886\" opacity=\"0.55\"/><rect x=\"149.2\" y=\"64.9\" width=\"1.4\" height=\"0.6\" fill=\"#6e7886\" opacity=\"0.80\"/><rect x=\"178.3\" y=\"66.2\" width=\"1.7\" height=\"0.8\" fill=\"#6e7886\" opacity=\"0.76\"/><rect x=\"190.6\" y=\"64.5\" width=\"2.0\" height=\"0.9\" fill=\"#6e7886\" opacity=\"0.54\"/><rect x=\"194.0\" y=\"65.5\" width=\"2.1\" height=\"0.9\" fill=\"#6e7886\" opacity=\"0.64\"/><rect x=\"91.6\" y=\"53.6\" width=\"5.3\" height=\"2.4\" fill=\"#6e7886\" opacity=\"0.84\"/><rect x=\"83.5\" y=\"58.8\" width=\"5.6\" height=\"2.5\" fill=\"#6e7886\" opacity=\"0.53\"/><rect x=\"144.6\" y=\"65.0\" width=\"3.3\" height=\"1.5\" fill=\"#6e7886\" opacity=\"0.56\"/><rect x=\"97.7\" y=\"68.0\" width=\"3.4\" height=\"1.5\" fill=\"#6e7886\" opacity=\"0.54\"/><rect x=\"169.3\" y=\"64.7\" width=\"1.5\" height=\"0.7\" fill=\"#6e7886\" opacity=\"0.76\"/><rect x=\"129.7\" y=\"61.4\" width=\"1.6\" height=\"0.7\" fill=\"#6e7886\" opacity=\"0.82\"/><rect x=\"110.6\" y=\"67.2\" width=\"3.3\" height=\"1.5\" fill=\"#6e7886\" opacity=\"0.54\"/><rect x=\"181.0\" y=\"66.4\" width=\"2.8\" height=\"1.3\" fill=\"#6e7886\" opacity=\"0.71\"/><rect x=\"84.8\" y=\"55.5\" width=\"3.5\" height=\"1.6\" fill=\"#6e7886\" opacity=\"0.49\"/><rect x=\"68.4\" y=\"57.0\" width=\"4.8\" height=\"2.2\" fill=\"#6e7886\" opacity=\"0.71\"/><rect x=\"252.3\" y=\"72.1\" width=\"1.0\" height=\"0.4\" fill=\"#6e7886\" opacity=\"0.65\"/><rect x=\"150.3\" y=\"68.7\" width=\"2.6\" height=\"1.2\" fill=\"#6e7886\" opacity=\"0.63\"/><rect x=\"111.0\" y=\"58.2\" width=\"4.2\" height=\"1.9\" fill=\"#6e7886\" opacity=\"0.50\"/><rect x=\"116.1\" y=\"65.8\" width=\"4.6\" height=\"2.1\" fill=\"#6e7886\" opacity=\"0.84\"/><rect x=\"247.9\" y=\"74.2\" width=\"1.4\" height=\"0.7\" fill=\"#6e7886\" opacity=\"0.71\"/><rect x=\"169.2\" y=\"61.7\" width=\"1.9\" height=\"0.8\" fill=\"#6e7886\" opacity=\"0.59\"/><rect x=\"102.2\" y=\"59.6\" width=\"4.2\" height=\"1.9\" fill=\"#6e7886\" opacity=\"0.74\"/><rect x=\"116.7\" y=\"68.5\" width=\"1.5\" height=\"0.7\" fill=\"#6e7886\" opacity=\"0.59\"/><rect x=\"177.7\" y=\"66.5\" width=\"1.2\" height=\"0.5\" fill=\"#6e7886\" opacity=\"0.85\"/><rect x=\"153.9\" y=\"69.3\" width=\"2.9\" height=\"1.3\" fill=\"#6e7886\" opacity=\"0.64\"/><rect x=\"87.2\" y=\"64.5\" width=\"5.4\" height=\"2.4\" fill=\"#6e7886\" opacity=\"0.56\"/><rect x=\"61.4\" y=\"52.0\" width=\"5.0\" height=\"2.2\" fill=\"#6e7886\" opacity=\"0.73\"/><rect x=\"194.7\" y=\"71.4\" width=\"1.4\" height=\"0.6\" fill=\"#6e7886\" opacity=\"0.78\"/><rect x=\"90.0\" y=\"53.2\" width=\"1.9\" height=\"0.9\" fill=\"#6e7886\" opacity=\"0.46\"/><rect x=\"169.9\" y=\"69.7\" width=\"3.3\" height=\"1.5\" fill=\"#6e7886\" opacity=\"0.51\"/><rect x=\"157.0\" y=\"60.6\" width=\"1.9\" height=\"0.9\" fill=\"#6e7886\" opacity=\"0.65\"/><rect x=\"71.2\" y=\"56.3\" width=\"2.8\" height=\"1.2\" fill=\"#6e7886\" opacity=\"0.57\"/><rect x=\"218.2\" y=\"67.8\" width=\"1.0\" height=\"0.4\" fill=\"#6e7886\" opacity=\"0.45\"/><rect x=\"183.8\" y=\"63.8\" width=\"1.9\" height=\"0.9\" fill=\"#6e7886\" opacity=\"0.49\"/><rect x=\"155.7\" y=\"64.4\" width=\"1.2\" height=\"0.5\" fill=\"#6e7886\" opacity=\"0.75\"/><rect x=\"152.2\" y=\"67.7\" width=\"2.2\" height=\"1.0\" fill=\"#6e7886\" opacity=\"0.82\"/><rect x=\"205.1\" y=\"70.2\" width=\"1.3\" height=\"0.6\" fill=\"#6e7886\" opacity=\"0.59\"/><rect x=\"78.3\" y=\"65.4\" width=\"2.1\" height=\"0.9\" fill=\"#6e7886\" opacity=\"0.48\"/><rect x=\"95.7\" y=\"57.7\" width=\"1.7\" height=\"0.8\" fill=\"#6e7886\" opacity=\"0.69\"/><rect x=\"147.7\" y=\"63.3\" width=\"2.8\" height=\"1.3\" fill=\"#6e7886\" opacity=\"0.81\"/><rect x=\"165.9\" y=\"65.3\" width=\"1.4\" height=\"0.6\" fill=\"#6e7886\" opacity=\"0.81\"/><rect x=\"193.4\" y=\"68.2\" width=\"2.9\" height=\"1.3\" fill=\"#6e7886\" opacity=\"0.72\"/><rect x=\"154.9\" y=\"70.4\" width=\"3.8\" height=\"1.7\" fill=\"#6e7886\" opacity=\"0.62\"/><rect x=\"161.3\" y=\"67.9\" width=\"3.3\" height=\"1.5\" fill=\"#6e7886\" opacity=\"0.82\"/><rect x=\"172.3\" y=\"71.5\" width=\"2.7\" height=\"1.2\" fill=\"#6e7886\" opacity=\"0.78\"/><rect x=\"146.0\" y=\"59.7\" width=\"4.1\" height=\"1.9\" fill=\"#6e7886\" opacity=\"0.67\"/><rect x=\"191.0\" y=\"67.1\" width=\"2.6\" height=\"1.2\" fill=\"#6e7886\" opacity=\"0.76\"/><rect x=\"160.8\" y=\"65.1\" width=\"3.6\" height=\"1.6\" fill=\"#6e7886\" opacity=\"0.74\"/><rect x=\"68.8\" y=\"56.3\" width=\"3.8\" height=\"1.7\" fill=\"#6e7886\" opacity=\"0.85\"/><rect x=\"191.3\" y=\"65.2\" width=\"2.4\" height=\"1.1\" fill=\"#6e7886\" opacity=\"0.52\"/><rect x=\"100.2\" y=\"61.4\" width=\"2.8\" height=\"1.2\" fill=\"#6e7886\" opacity=\"0.46\"/><rect x=\"253.6\" y=\"73.0\" width=\"0.5\" height=\"0.2\" fill=\"#6e7886\" opacity=\"0.61\"/><rect x=\"97.9\" y=\"63.1\" width=\"2.5\" height=\"1.1\" fill=\"#6e7886\" opacity=\"0.75\"/><rect x=\"124.1\" y=\"68.2\" width=\"3.5\" height=\"1.6\" fill=\"#6e7886\" opacity=\"0.61\"/><rect x=\"226.4\" y=\"68.9\" width=\"1.2\" height=\"0.5\" fill=\"#6e7886\" opacity=\"0.62\"/><rect x=\"240.6\" y=\"72.3\" width=\"0.7\" height=\"0.3\" fill=\"#6e7886\" opacity=\"0.52\"/><rect x=\"156.2\" y=\"62.6\" width=\"2.3\" height=\"1.0\" fill=\"#6e7886\" opacity=\"0.65\"/><rect x=\"123.2\" y=\"56.7\" width=\"1.6\" height=\"0.7\" fill=\"#6e7886\" opacity=\"0.75\"/><rect x=\"152.1\" y=\"65.6\" width=\"3.8\" height=\"1.7\" fill=\"#6e7886\" opacity=\"0.49\"/><rect x=\"139.7\" y=\"60.8\" width=\"2.5\" height=\"1.1\" fill=\"#6e7886\" opacity=\"0.46\"/><rect x=\"87.1\" y=\"63.5\" width=\"5.2\" height=\"2.3\" fill=\"#6e7886\" opacity=\"0.46\"/><rect x=\"166.9\" y=\"64.0\" width=\"2.0\" height=\"0.9\" fill=\"#6e7886\" opacity=\"0.54\"/><rect x=\"207.6\" y=\"69.3\" width=\"1.2\" height=\"0.6\" fill=\"#6e7886\" opacity=\"0.70\"/><rect x=\"240.1\" y=\"74.3\" width=\"1.1\" height=\"0.5\" fill=\"#6e7886\" opacity=\"0.83\"/><rect x=\"221.6\" y=\"69.9\" width=\"0.8\" height=\"0.4\" fill=\"#6e7886\" opacity=\"0.53\"/><rect x=\"88.4\" y=\"63.5\" width=\"4.1\" height=\"1.8\" fill=\"#6e7886\" opacity=\"0.84\"/><rect x=\"114.3\" y=\"60.1\" width=\"2.6\" height=\"1.2\" fill=\"#6e7886\" opacity=\"0.51\"/><rect x=\"246.0\" y=\"72.9\" width=\"1.5\" height=\"0.7\" fill=\"#6e7886\" opacity=\"0.73\"/><rect x=\"116.0\" y=\"63.3\" width=\"1.9\" height=\"0.9\" fill=\"#6e7886\" opacity=\"0.73\"/><rect x=\"254.3\" y=\"73.5\" width=\"0.8\" height=\"0.4\" fill=\"#6e7886\" opacity=\"0.58\"/><rect x=\"179.7\" y=\"84.1\" width=\"1.4\" height=\"0.6\" fill=\"#4a5260\" opacity=\"0.61\"/><rect x=\"231.9\" y=\"83.2\" width=\"1.5\" height=\"0.7\" fill=\"#4a5260\" opacity=\"0.66\"/><rect x=\"189.1\" y=\"81.4\" width=\"1.2\" height=\"0.5\" fill=\"#4a5260\" opacity=\"0.51\"/><rect x=\"147.7\" y=\"91.4\" width=\"3.7\" height=\"1.7\" fill=\"#4a5260\" opacity=\"0.82\"/><rect x=\"161.0\" y=\"89.4\" width=\"2.5\" height=\"1.1\" fill=\"#4a5260\" opacity=\"0.48\"/><rect x=\"242.7\" y=\"79.7\" width=\"0.9\" height=\"0.4\" fill=\"#4a5260\" opacity=\"0.55\"/><rect x=\"80.9\" y=\"83.5\" width=\"3.3\" height=\"1.5\" fill=\"#4a5260\" opacity=\"0.84\"/><rect x=\"229.3\" y=\"82.3\" width=\"1.6\" height=\"0.7\" fill=\"#4a5260\" opacity=\"0.47\"/><rect x=\"159.3\" y=\"78.8\" width=\"2.6\" height=\"1.2\" fill=\"#4a5260\" opacity=\"0.57\"/><rect x=\"119.2\" y=\"85.9\" width=\"3.6\" height=\"1.6\" fill=\"#4a5260\" opacity=\"0.54\"/><rect x=\"185.9\" y=\"85.0\" width=\"2.2\" height=\"1.0\" fill=\"#4a5260\" opacity=\"0.49\"/><rect x=\"72.3\" y=\"86.9\" width=\"3.9\" height=\"1.8\" fill=\"#4a5260\" opacity=\"0.45\"/><rect x=\"189.6\" y=\"78.0\" width=\"1.2\" height=\"0.5\" fill=\"#4a5260\" opacity=\"0.57\"/><rect x=\"156.5\" y=\"86.7\" width=\"4.1\" height=\"1.9\" fill=\"#4a5260\" opacity=\"0.80\"/><rect x=\"100.6\" y=\"76.0\" width=\"5.0\" height=\"2.2\" fill=\"#4a5260\" opacity=\"0.85\"/><rect x=\"236.2\" y=\"83.0\" width=\"1.5\" height=\"0.7\" fill=\"#4a5260\" opacity=\"0.82\"/><rect x=\"74.4\" y=\"82.7\" width=\"4.6\" height=\"2.1\" fill=\"#4a5260\" opacity=\"0.48\"/><rect x=\"193.0\" y=\"81.1\" width=\"1.6\" height=\"0.7\" fill=\"#4a5260\" opacity=\"0.83\"/><rect x=\"185.1\" y=\"78.5\" width=\"2.7\" height=\"1.2\" fill=\"#4a5260\" opacity=\"0.73\"/><rect x=\"72.7\" y=\"81.3\" width=\"2.4\" height=\"1.1\" fill=\"#4a5260\" opacity=\"0.58\"/><rect x=\"81.2\" y=\"81.4\" width=\"3.9\" height=\"1.8\" fill=\"#4a5260\" opacity=\"0.66\"/><rect x=\"176.2\" y=\"89.4\" width=\"1.3\" height=\"0.6\" fill=\"#4a5260\" opacity=\"0.59\"/><rect x=\"85.1\" y=\"78.9\" width=\"2.4\" height=\"1.1\" fill=\"#4a5260\" opacity=\"0.58\"/><rect x=\"92.6\" y=\"82.8\" width=\"2.1\" height=\"0.9\" fill=\"#4a5260\" opacity=\"0.62\"/><rect x=\"134.6\" y=\"90.5\" width=\"3.0\" height=\"1.3\" fill=\"#4a5260\" opacity=\"0.66\"/><rect x=\"244.1\" y=\"82.0\" width=\"1.1\" height=\"0.5\" fill=\"#4a5260\" opacity=\"0.75\"/><rect x=\"160.3\" y=\"80.2\" width=\"3.5\" height=\"1.6\" fill=\"#4a5260\" opacity=\"0.55\"/><rect x=\"190.3\" y=\"81.9\" width=\"2.1\" height=\"0.9\" fill=\"#4a5260\" opacity=\"0.80\"/><rect x=\"92.9\" y=\"86.4\" width=\"3.5\" height=\"1.6\" fill=\"#4a5260\" opacity=\"0.54\"/><rect x=\"223.0\" y=\"83.3\" width=\"1.1\" height=\"0.5\" fill=\"#4a5260\" opacity=\"0.74\"/><rect x=\"91.8\" y=\"85.5\" width=\"4.9\" height=\"2.2\" fill=\"#4a5260\" opacity=\"0.48\"/><rect x=\"147.5\" y=\"80.9\" width=\"1.3\" height=\"0.6\" fill=\"#4a5260\" opacity=\"0.63\"/><rect x=\"211.0\" y=\"80.2\" width=\"0.9\" height=\"0.4\" fill=\"#4a5260\" opacity=\"0.65\"/><rect x=\"157.8\" y=\"84.8\" width=\"1.3\" height=\"0.6\" fill=\"#4a5260\" opacity=\"0.76\"/><rect x=\"156.0\" y=\"87.2\" width=\"3.6\" height=\"1.6\" fill=\"#4a5260\" opacity=\"0.48\"/><rect x=\"258.7\" y=\"81.9\" width=\"1.5\" height=\"0.7\" fill=\"#4a5260\" opacity=\"0.54\"/><rect x=\"129.5\" y=\"83.0\" width=\"4.6\" height=\"2.1\" fill=\"#4a5260\" opacity=\"0.73\"/><rect x=\"238.9\" y=\"80.3\" width=\"1.2\" height=\"0.5\" fill=\"#4a5260\" opacity=\"0.77\"/><rect x=\"107.4\" y=\"91.9\" width=\"3.9\" height=\"1.7\" fill=\"#4a5260\" opacity=\"0.69\"/><rect x=\"139.6\" y=\"86.9\" width=\"1.7\" height=\"0.7\" fill=\"#4a5260\" opacity=\"0.63\"/><rect x=\"142.8\" y=\"77.8\" width=\"3.0\" height=\"1.3\" fill=\"#4a5260\" opacity=\"0.55\"/><rect x=\"77.4\" y=\"98.2\" width=\"4.7\" height=\"2.1\" fill=\"#4a5260\" opacity=\"0.55\"/><rect x=\"121.9\" y=\"93.9\" width=\"2.4\" height=\"1.1\" fill=\"#4a5260\" opacity=\"0.74\"/><rect x=\"193.7\" y=\"81.4\" width=\"2.9\" height=\"1.3\" fill=\"#4a5260\" opacity=\"0.49\"/><rect x=\"94.1\" y=\"76.1\" width=\"4.7\" height=\"2.1\" fill=\"#4a5260\" opacity=\"0.80\"/><rect x=\"196.0\" y=\"76.9\" width=\"0.9\" height=\"0.4\" fill=\"#4a5260\" opacity=\"0.52\"/><rect x=\"132.4\" y=\"94.0\" width=\"1.5\" height=\"0.7\" fill=\"#4a5260\" opacity=\"0.46\"/><rect x=\"116.4\" y=\"86.8\" width=\"3.8\" height=\"1.7\" fill=\"#4a5260\" opacity=\"0.50\"/><rect x=\"120.9\" y=\"84.9\" width=\"1.8\" height=\"0.8\" fill=\"#4a5260\" opacity=\"0.65\"/><rect x=\"78.6\" y=\"88.4\" width=\"5.0\" height=\"2.2\" fill=\"#4a5260\" opacity=\"0.73\"/><rect x=\"254.4\" y=\"79.2\" width=\"1.5\" height=\"0.7\" fill=\"#4a5260\" opacity=\"0.72\"/><rect x=\"205.8\" y=\"77.1\" width=\"1.1\" height=\"0.5\" fill=\"#4a5260\" opacity=\"0.58\"/><rect x=\"170.9\" y=\"87.2\" width=\"2.7\" height=\"1.2\" fill=\"#4a5260\" opacity=\"0.76\"/><rect x=\"259.3\" y=\"82.4\" width=\"0.7\" height=\"0.3\" fill=\"#4a5260\" opacity=\"0.52\"/><rect x=\"201.1\" y=\"80.1\" width=\"2.6\" height=\"1.2\" fill=\"#4a5260\" opacity=\"0.59\"/><rect x=\"145.4\" y=\"80.4\" width=\"2.3\" height=\"1.0\" fill=\"#4a5260\" opacity=\"0.82\"/><rect x=\"253.8\" y=\"77.4\" width=\"0.8\" height=\"0.4\" fill=\"#4a5260\" opacity=\"0.58\"/><rect x=\"233.2\" y=\"85.2\" width=\"1.9\" height=\"0.8\" fill=\"#4a5260\" opacity=\"0.53\"/><rect x=\"140.1\" y=\"88.2\" width=\"3.2\" height=\"1.4\" fill=\"#4a5260\" opacity=\"0.78\"/><rect x=\"179.3\" y=\"80.5\" width=\"3.1\" height=\"1.4\" fill=\"#4a5260\" opacity=\"0.75\"/>\n  <path d=\"M102,51 L112.5,72 L123,99\" fill=\"none\" stroke=\"#5a6472\" stroke-width=\".7\" opacity=\".7\"/><path d=\"M150.95999999999998,57.12 L159.07999999999998,73.36 L167.2,94.24\" fill=\"none\" stroke=\"#5a6472\" stroke-width=\".7\" opacity=\".7\"/><path d=\"M197.04,62.879999999999995 L202.92,74.64 L208.79999999999998,89.76\" fill=\"none\" stroke=\"#5a6472\" stroke-width=\".7\" opacity=\".7\"/>\n  <path d=\"M67.024,51.248 L74.416,66.032\" stroke=\"#e6ecf4\" stroke-width=\".5\" opacity=\"0.35\"/><path d=\"M89.84,53.68 L96.56,67.12\" stroke=\"#e6ecf4\" stroke-width=\".5\" opacity=\"0.55\"/><path d=\"M124.064,57.327999999999996 L129.776,68.75200000000001\" stroke=\"#e6ecf4\" stroke-width=\".5\" opacity=\"0.35\"/><path d=\"M169.696,62.192 L174.064,70.928\" stroke=\"#e6ecf4\" stroke-width=\".5\" opacity=\"0.55\"/><path d=\"M221.032,67.664 L223.888,73.376\" stroke=\"#e6ecf4\" stroke-width=\".5\" opacity=\"0.35\"/>\n  <!-- stepped superstructure -->\n  <path d=\"M48 52 L132 64 L132 72 L50 66Z\" fill=\"#a8b2c0\"/><path d=\"M50 66 L132 72 L132 76 L50 72Z\" fill=\"#6a7482\"/>\n  <path d=\"M52 44 L104 52 L104 60 L54 56Z\" fill=\"#b8c2ce\"/><path d=\"M54 56 L104 60 L104 64 L54 61Z\" fill=\"#6e7886\"/>\n  <path d=\"M56 36 L86 41 L86 49 L58 46Z\" fill=\"#c4ccd8\"/><path d=\"M58 46 L86 49 L86 52 L58 50Z\" fill=\"#7a8492\"/>\n  <rect x=\"56\" y=\"54.6\" width=\"2\" height=\".9\" fill=\"#ffe8a0\" opacity=\"0.25\"/><rect x=\"60.6\" y=\"55.26\" width=\"2\" height=\".9\" fill=\"#ffe8a0\" opacity=\"0.7\"/><rect x=\"65.2\" y=\"55.92\" width=\"2\" height=\".9\" fill=\"#ffe8a0\" opacity=\"0.7\"/><rect x=\"69.8\" y=\"56.58\" width=\"2\" height=\".9\" fill=\"#ffe8a0\" opacity=\"0.25\"/><rect x=\"74.4\" y=\"57.24\" width=\"2\" height=\".9\" fill=\"#ffe8a0\" opacity=\"0.7\"/><rect x=\"79\" y=\"57.9\" width=\"2\" height=\".9\" fill=\"#ffe8a0\" opacity=\"0.7\"/><rect x=\"83.6\" y=\"58.56\" width=\"2\" height=\".9\" fill=\"#ffe8a0\" opacity=\"0.25\"/><rect x=\"88.19999999999999\" y=\"59.22\" width=\"2\" height=\".9\" fill=\"#ffe8a0\" opacity=\"0.7\"/><rect x=\"92.8\" y=\"59.88\" width=\"2\" height=\".9\" fill=\"#ffe8a0\" opacity=\"0.7\"/><rect x=\"97.4\" y=\"60.54\" width=\"2\" height=\".9\" fill=\"#ffe8a0\" opacity=\"0.25\"/><rect x=\"102\" y=\"61.2\" width=\"2\" height=\".9\" fill=\"#ffe8a0\" opacity=\"0.7\"/><rect x=\"106.6\" y=\"61.86\" width=\"2\" height=\".9\" fill=\"#ffe8a0\" opacity=\"0.7\"/><rect x=\"111.19999999999999\" y=\"62.52\" width=\"2\" height=\".9\" fill=\"#ffe8a0\" opacity=\"0.25\"/><rect x=\"115.8\" y=\"63.18\" width=\"2\" height=\".9\" fill=\"#ffe8a0\" opacity=\"0.7\"/><rect x=\"120.39999999999999\" y=\"63.84\" width=\"2\" height=\".9\" fill=\"#ffe8a0\" opacity=\"0.7\"/><rect x=\"125\" y=\"64.5\" width=\"2\" height=\".9\" fill=\"#ffe8a0\" opacity=\"0.25\"/>\n  <rect x=\"58\" y=\"47.4\" width=\"1.8\" height=\".8\" fill=\"#ffe8a0\" opacity=\"0.3\"/><rect x=\"62.4\" y=\"48\" width=\"1.8\" height=\".8\" fill=\"#ffe8a0\" opacity=\"0.7\"/><rect x=\"66.8\" y=\"48.6\" width=\"1.8\" height=\".8\" fill=\"#ffe8a0\" opacity=\"0.3\"/><rect x=\"71.2\" y=\"49.199999999999996\" width=\"1.8\" height=\".8\" fill=\"#ffe8a0\" opacity=\"0.7\"/><rect x=\"75.6\" y=\"49.8\" width=\"1.8\" height=\".8\" fill=\"#ffe8a0\" opacity=\"0.3\"/><rect x=\"80\" y=\"50.4\" width=\"1.8\" height=\".8\" fill=\"#ffe8a0\" opacity=\"0.7\"/><rect x=\"84.4\" y=\"51\" width=\"1.8\" height=\".8\" fill=\"#ffe8a0\" opacity=\"0.3\"/><rect x=\"88.80000000000001\" y=\"51.6\" width=\"1.8\" height=\".8\" fill=\"#ffe8a0\" opacity=\"0.7\"/><rect x=\"93.2\" y=\"52.199999999999996\" width=\"1.8\" height=\".8\" fill=\"#ffe8a0\" opacity=\"0.3\"/><rect x=\"97.6\" y=\"52.8\" width=\"1.8\" height=\".8\" fill=\"#ffe8a0\" opacity=\"0.7\"/>\n  <!-- bridge tower and shield domes -->\n  <path d=\"M64 22 L76 23 L76 38 L64 37Z\" fill=\"#9aa4b2\"/>\n  <path d=\"M50 16 L92 18 L92 25 L50 23Z\" fill=\"#c8d0dc\"/><path d=\"M50 23 L92 25 L92 28 L50 26Z\" fill=\"#6e7886\"/>\n  <rect x=\"54\" y=\"19.4\" width=\"3.4\" height=\"1.4\" fill=\"#ffe8a0\" opacity=\".85\"/><rect x=\"60\" y=\"19.4\" width=\"3.4\" height=\"1.4\" fill=\"#ffe8a0\" opacity=\".85\"/><rect x=\"66\" y=\"19.4\" width=\"3.4\" height=\"1.4\" fill=\"#ffe8a0\" opacity=\".85\"/><rect x=\"72\" y=\"19.4\" width=\"3.4\" height=\"1.4\" fill=\"#ffe8a0\" opacity=\".85\"/><rect x=\"78\" y=\"19.4\" width=\"3.4\" height=\"1.4\" fill=\"#ffe8a0\" opacity=\".85\"/><rect x=\"84\" y=\"19.4\" width=\"3.4\" height=\"1.4\" fill=\"#ffe8a0\" opacity=\".85\"/>\n  <path d=\"M56 16 L56 10 M86 18 L86 12\" stroke=\"#8a94a2\" stroke-width=\"1.6\"/>\n  <circle cx=\"56\" cy=\"8.6\" r=\"4\" fill=\"#d8dee8\"/><circle cx=\"86\" cy=\"10.6\" r=\"4\" fill=\"#d8dee8\"/><circle cx=\"54.8\" cy=\"7.4\" r=\"1.4\" fill=\"#fff\" opacity=\".7\"/><circle cx=\"84.8\" cy=\"9.4\" r=\"1.4\" fill=\"#fff\" opacity=\".7\"/>\n  <!-- stern and engines -->\n  <path d=\"M30,42 L22 46 L48 112 L58,106Z\" fill=\"#2a3038\"/>\n  <circle class=\"sd-eng\" cx=\"30\" cy=\"64\" r=\"13.299999999999999\" fill=\"url(#sdE)\"/><circle cx=\"30\" cy=\"64\" r=\"4.8999999999999995\" fill=\"#eaf6ff\"/><circle class=\"sd-eng\" cx=\"38\" cy=\"84\" r=\"13.299999999999999\" fill=\"url(#sdE)\"/><circle cx=\"38\" cy=\"84\" r=\"4.8999999999999995\" fill=\"#eaf6ff\"/><circle class=\"sd-eng\" cx=\"46\" cy=\"100\" r=\"10.26\" fill=\"url(#sdE)\"/><circle cx=\"46\" cy=\"100\" r=\"3.78\" fill=\"#eaf6ff\"/><circle class=\"sd-eng\" cx=\"26\" cy=\"52\" r=\"7.6\" fill=\"url(#sdE)\"/><circle cx=\"26\" cy=\"52\" r=\"2.8\" fill=\"#eaf6ff\"/>\n  <circle class=\"sd-run\" cx=\"318\" cy=\"78\" r=\"1.4\" fill=\"#ff4a3a\"/><circle class=\"sd-run b\" cx=\"200\" cy=\"58\" r=\"1\" fill=\"#ffffff\"/><circle class=\"sd-run\" cx=\"140\" cy=\"100\" r=\"1\" fill=\"#ff4a3a\"/>\n  <!-- turbolaser batteries along the edge -->\n  <rect x=\"116.4\" y=\"50.4\" width=\"3.6\" height=\"2.4\" fill=\"#d8dee8\"/><rect x=\"139.4\" y=\"53.3\" width=\"3.6\" height=\"2.4\" fill=\"#d8dee8\"/><rect x=\"162.5\" y=\"56.2\" width=\"3.6\" height=\"2.4\" fill=\"#d8dee8\"/><rect x=\"185.5\" y=\"59.0\" width=\"3.6\" height=\"2.4\" fill=\"#d8dee8\"/><rect x=\"208.6\" y=\"61.9\" width=\"3.6\" height=\"2.4\" fill=\"#d8dee8\"/>\n</svg>";
  const CORVETTE = "<svg viewBox=\"0 0 200 64\" aria-hidden=\"true\"><defs>\n  <linearGradient id=\"cvH\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f2f4f6\"/><stop offset=\".6\" stop-color=\"#c4cad2\"/><stop offset=\"1\" stop-color=\"#7e8692\"/></linearGradient>\n  <radialGradient id=\"cvE\"><stop offset=\"0\" stop-color=\"#fff\"/><stop offset=\".4\" stop-color=\"#ff9ad8\"/><stop offset=\"1\" stop-color=\"#d84aa8\" stop-opacity=\"0\"/></radialGradient>\n</defs>\n  <circle class=\"cv-eng\" cx=\"10\" cy=\"16\" r=\"7\" fill=\"url(#cvE)\"/><circle class=\"cv-eng\" cx=\"10\" cy=\"26\" r=\"7\" fill=\"url(#cvE)\"/><circle class=\"cv-eng\" cx=\"10\" cy=\"36\" r=\"7\" fill=\"url(#cvE)\"/><circle class=\"cv-eng\" cx=\"10\" cy=\"46\" r=\"7\" fill=\"url(#cvE)\"/><circle class=\"cv-eng\" cx=\"4\" cy=\"21\" r=\"7\" fill=\"url(#cvE)\"/><circle class=\"cv-eng\" cx=\"4\" cy=\"31\" r=\"7\" fill=\"url(#cvE)\"/><circle class=\"cv-eng\" cx=\"4\" cy=\"41\" r=\"7\" fill=\"url(#cvE)\"/><circle class=\"cv-eng\" cx=\"16\" cy=\"21\" r=\"7\" fill=\"url(#cvE)\"/><circle class=\"cv-eng\" cx=\"16\" cy=\"31\" r=\"7\" fill=\"url(#cvE)\"/><circle class=\"cv-eng\" cx=\"16\" cy=\"41\" r=\"7\" fill=\"url(#cvE)\"/><circle class=\"cv-eng\" cx=\"10\" cy=\"56\" r=\"7\" fill=\"url(#cvE)\"/>\n  <path d=\"M14 8 L58 12 L62 22 L62 42 L58 52 L14 56 C10 48 10 16 14 8Z\" fill=\"url(#cvH)\"/>\n  <rect x=\"10\" y=\"13\" width=\"6\" height=\"6\" rx=\"1\" fill=\"#5a606a\"/><rect x=\"10\" y=\"23\" width=\"6\" height=\"6\" rx=\"1\" fill=\"#5a606a\"/><rect x=\"10\" y=\"33\" width=\"6\" height=\"6\" rx=\"1\" fill=\"#5a606a\"/><rect x=\"10\" y=\"43\" width=\"6\" height=\"6\" rx=\"1\" fill=\"#5a606a\"/>\n  <path d=\"M18 14 L56 17 M18 50 L56 47\" stroke=\"#8a929c\" stroke-width=\".8\"/>\n  <rect x=\"20\" y=\"24\" width=\"34\" height=\"5\" fill=\"#c83a2a\"/><rect x=\"20\" y=\"35\" width=\"34\" height=\"5\" fill=\"#c83a2a\"/>\n  <path d=\"M60 26 L148 28 L148 38 L60 40Z\" fill=\"url(#cvH)\"/>\n  <path d=\"M60 33 L148 33\" stroke=\"#9aa2ac\" stroke-width=\".7\"/>\n  <rect x=\"72\" y=\"29.4\" width=\"8\" height=\"2\" fill=\"#7a828c\"/><rect x=\"86\" y=\"29.4\" width=\"8\" height=\"2\" fill=\"#7a828c\"/><rect x=\"100\" y=\"29.4\" width=\"8\" height=\"2\" fill=\"#7a828c\"/><rect x=\"114\" y=\"29.4\" width=\"8\" height=\"2\" fill=\"#7a828c\"/><rect x=\"128\" y=\"29.4\" width=\"8\" height=\"2\" fill=\"#7a828c\"/>\n  <path d=\"M146 20 L178 18 L196 26 L196 40 L178 46 L146 44Z\" fill=\"url(#cvH)\"/>\n  <path d=\"M146 20 L178 18 L196 26 L146 28Z\" fill=\"#fafbfc\" opacity=\".7\"/>\n  <rect x=\"150\" y=\"30\" width=\"22\" height=\"4\" fill=\"#c83a2a\"/>\n  <path d=\"M180 26 L192 29 L192 33 L180 33Z\" fill=\"#1a2a3c\"/><path d=\"M181 27 L188 29\" stroke=\"#8ac0f0\" stroke-width=\".6\"/>\n  <rect x=\"156\" y=\"14\" width=\"10\" height=\"4\" fill=\"#aeb6c0\"/><rect x=\"156\" y=\"46\" width=\"10\" height=\"4\" fill=\"#aeb6c0\"/>\n  <circle cx=\"161\" cy=\"14\" r=\"2\" fill=\"#7a828c\"/><circle cx=\"161\" cy=\"50\" r=\"2\" fill=\"#7a828c\"/>\n</svg>";
  const ROCK = "<svg viewBox=\"0 0 130 120\" aria-hidden=\"true\"><defs>\n  <linearGradient id=\"ckH\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f0f2f4\"/><stop offset=\".55\" stop-color=\"#b4bac2\"/><stop offset=\"1\" stop-color=\"#5e666e\"/></linearGradient>\n  <linearGradient id=\"ckS\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#9aa2aa\"/><stop offset=\"1\" stop-color=\"#4a525a\"/></linearGradient>\n  <radialGradient id=\"ckN\" cx=\".5\" cy=\".5\" r=\".5\"><stop offset=\"0\" stop-color=\"#fff2c0\"/><stop offset=\".45\" stop-color=\"#ff9a2a\"/><stop offset=\".85\" stop-color=\"#8a2a06\"/><stop offset=\"1\" stop-color=\"#2a0c02\"/></radialGradient>\n  <radialGradient id=\"ckM\" cx=\".2\" cy=\".5\" r=\".8\"><stop offset=\"0\" stop-color=\"#fff6c8\"/><stop offset=\".3\" stop-color=\"#ffb43a\"/><stop offset=\".7\" stop-color=\"#e2420e\"/><stop offset=\"1\" stop-color=\"#6a1004\" stop-opacity=\"0\"/></radialGradient>\n  <linearGradient id=\"ckF1\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#fff6c0\"/><stop offset=\".4\" stop-color=\"#ffb02a\"/><stop offset=\"1\" stop-color=\"#e2420e\" stop-opacity=\"0\"/></linearGradient>\n</defs>\n  <!-- flames pouring off the torn front, soft-edged and flickering -->\n  <filter id=\"ckBlur\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\"><feGaussianBlur stdDeviation=\"1.6\"/></filter>\n  <g class=\"ck-fl\" filter=\"url(#ckBlur)\">\n    <path d=\"M70 19 C88 11 104 16 112 16.4 C102 24 88 28 70 33Z\" fill=\"#e2420e\" opacity=\"0.75\"/><path d=\"M70 37 C90 39 109 44 122 50.4 C106.5 52 90 56 70 51Z\" fill=\"#ff7a1a\" opacity=\"0.85\"/><path d=\"M70 53 C89.2 48 107 53 118 55.2 C104.7 61 89.2 65 70 67Z\" fill=\"#ff9a2a\" opacity=\"0.9\"/><path d=\"M70 69 C90.4 72 110 77 124 84 C107.4 85 90.4 89 70 83Z\" fill=\"#ff7a1a\" opacity=\"0.85\"/><path d=\"M70 85 C87.6 79 103 84 110 85.6 C101.1 92 87.6 96 70 99Z\" fill=\"#e2420e\" opacity=\"0.7\"/>\n    <path d=\"M70 32 C80 34 86 37 102 39 C86 41 80 44 70 40Z\" fill=\"#ffe08a\" opacity=\".9\"/><path d=\"M70 52 C80 49 86 52 108 54 C86 56 80 59 70 60Z\" fill=\"#ffe08a\" opacity=\".9\"/><path d=\"M70 70 C80 72 86 75 104 77 C86 79 80 82 70 78Z\" fill=\"#ffe08a\" opacity=\".9\"/><path d=\"M70 86 C80 83 86 86 94 88 C86 90 80 93 70 94Z\" fill=\"#ffe08a\" opacity=\".9\"/>\n    <path d=\"M70 43.6 C78 43.4 82 45 90 46 C82 47 78 48.6 70 48.4Z\" fill=\"#fffbe0\"/><path d=\"M70 61.6 C78 61.4 82 63 92 64 C82 65 78 66.6 70 66.4Z\" fill=\"#fffbe0\"/><path d=\"M70 77.6 C78 77.4 82 79 88 80 C82 81 78 82.6 70 82.4Z\" fill=\"#fffbe0\"/>\n  </g>\n  <!-- housing: side face and top -->\n  <path d=\"M14 18 L64 22 L74 30 L74 96 L64 106 L14 102 C8 84 8 36 14 18Z\" fill=\"url(#ckH)\"/>\n  <path d=\"M64 22 L74 30 L74 96 L64 106Z\" fill=\"url(#ckS)\"/>\n  <rect x=\"16\" y=\"46\" width=\"46\" height=\"7\" fill=\"#c83a2a\"/><rect x=\"16\" y=\"66\" width=\"46\" height=\"7\" fill=\"#c83a2a\"/>\n  <path d=\"M16 30 L62 31\" stroke=\"#7e868e\" stroke-width=\".7\"/><path d=\"M16 58 L62 59\" stroke=\"#7e868e\" stroke-width=\".7\"/><path d=\"M16 84 L62 85\" stroke=\"#7e868e\" stroke-width=\".7\"/>\n  <rect x=\"22\" y=\"24\" width=\"6\" height=\"3\" fill=\"#8a929a\"/><rect x=\"22\" y=\"95\" width=\"6\" height=\"3\" fill=\"#8a929a\"/><rect x=\"34\" y=\"24\" width=\"6\" height=\"3\" fill=\"#8a929a\"/><rect x=\"34\" y=\"95\" width=\"6\" height=\"3\" fill=\"#8a929a\"/><rect x=\"48\" y=\"24\" width=\"6\" height=\"3\" fill=\"#8a929a\"/><rect x=\"48\" y=\"95\" width=\"6\" height=\"3\" fill=\"#8a929a\"/><rect x=\"58\" y=\"24\" width=\"6\" height=\"3\" fill=\"#8a929a\"/><rect x=\"58\" y=\"95\" width=\"6\" height=\"3\" fill=\"#8a929a\"/>\n  <!-- the honeycomb of engine nozzles, still white-hot -->\n  <circle cx=\"22\" cy=\"30\" r=\"7.4\" fill=\"#3a4048\"/><circle cx=\"22\" cy=\"30\" r=\"5.6\" fill=\"#1a1e24\"/><circle cx=\"22\" cy=\"30\" r=\"4.2\" fill=\"url(#ckN)\"/><circle cx=\"22\" cy=\"46\" r=\"7.4\" fill=\"#3a4048\"/><circle cx=\"22\" cy=\"46\" r=\"5.6\" fill=\"#1a1e24\"/><circle cx=\"22\" cy=\"46\" r=\"4.2\" fill=\"url(#ckN)\"/><circle cx=\"22\" cy=\"62\" r=\"7.4\" fill=\"#3a4048\"/><circle cx=\"22\" cy=\"62\" r=\"5.6\" fill=\"#1a1e24\"/><circle cx=\"22\" cy=\"62\" r=\"4.2\" fill=\"url(#ckN)\"/><circle cx=\"22\" cy=\"78\" r=\"7.4\" fill=\"#3a4048\"/><circle cx=\"22\" cy=\"78\" r=\"5.6\" fill=\"#1a1e24\"/><circle cx=\"22\" cy=\"78\" r=\"4.2\" fill=\"url(#ckN)\"/><circle cx=\"12\" cy=\"38\" r=\"7.4\" fill=\"#3a4048\"/><circle cx=\"12\" cy=\"38\" r=\"5.6\" fill=\"#1a1e24\"/><circle cx=\"12\" cy=\"38\" r=\"4.2\" fill=\"url(#ckN)\"/><circle cx=\"12\" cy=\"54\" r=\"7.4\" fill=\"#3a4048\"/><circle cx=\"12\" cy=\"54\" r=\"5.6\" fill=\"#1a1e24\"/><circle cx=\"12\" cy=\"54\" r=\"4.2\" fill=\"url(#ckN)\"/><circle cx=\"12\" cy=\"70\" r=\"7.4\" fill=\"#3a4048\"/><circle cx=\"12\" cy=\"70\" r=\"5.6\" fill=\"#1a1e24\"/><circle cx=\"12\" cy=\"70\" r=\"4.2\" fill=\"url(#ckN)\"/><circle cx=\"32\" cy=\"38\" r=\"7.4\" fill=\"#3a4048\"/><circle cx=\"32\" cy=\"38\" r=\"5.6\" fill=\"#1a1e24\"/><circle cx=\"32\" cy=\"38\" r=\"4.2\" fill=\"url(#ckN)\"/><circle cx=\"32\" cy=\"54\" r=\"7.4\" fill=\"#3a4048\"/><circle cx=\"32\" cy=\"54\" r=\"5.6\" fill=\"#1a1e24\"/><circle cx=\"32\" cy=\"54\" r=\"4.2\" fill=\"url(#ckN)\"/><circle cx=\"32\" cy=\"70\" r=\"7.4\" fill=\"#3a4048\"/><circle cx=\"32\" cy=\"70\" r=\"5.6\" fill=\"#1a1e24\"/><circle cx=\"32\" cy=\"70\" r=\"4.2\" fill=\"url(#ckN)\"/><circle cx=\"22\" cy=\"94\" r=\"7.4\" fill=\"#3a4048\"/><circle cx=\"22\" cy=\"94\" r=\"5.6\" fill=\"#1a1e24\"/><circle cx=\"22\" cy=\"94\" r=\"4.2\" fill=\"url(#ckN)\"/>\n  <!-- torn, molten front edge with broken spars -->\n  <path d=\"M64 22 L70 28 L66 34 L74 40 L68 48 L76 56 L68 62 L76 70 L68 78 L74 86 L66 94 L70 100 L64 106 L60 64Z\" fill=\"url(#ckM)\"/>\n  <path d=\"M74 40 L88 34 M76 56 L92 58 M76 70 L90 78\" stroke=\"#6e767e\" stroke-width=\"2.6\" stroke-linecap=\"round\"/>\n  <path d=\"M74 40 L88 34 M76 56 L92 58 M76 70 L90 78\" stroke=\"#ff8a2a\" stroke-width=\".9\" stroke-linecap=\"round\" opacity=\".8\"/>\n  <path d=\"M20 21 L60 24\" stroke=\"#fff\" stroke-width=\"1\" opacity=\".55\"/>\n  <path d=\"M30 40 L36 46 M44 82 L50 88\" stroke=\"#3a2a22\" stroke-width=\"1.4\" opacity=\".7\"/>\n</svg>";
  function arrive() {
    return new Promise((resolve) => {
      const h = S();
      let done = false;
      const timers = [];
      // The whole sequence runs 1.6x slower than it was, so every line can be read.
      const SLOW = 1.6;
      const at = (ms, fn) => timers.push(setTimeout(() => { if (!done) fn(); }, ms * SLOW));
      const finish = () => {
        if (done) return;
        done = true;
        timers.forEach(clearTimeout);
        node.classList.add('out');
        h.seen = true;
        HN.save();
        syncTab();
        setTimeout(() => { node.remove(); award(FEAT_ON); resolve(); }, 450);
      };
      if (!motion()) { h.seen = true; HN.save(); syncTab(); award(FEAT_ON); return resolve(); }
      // Where the 4th tab will sit.
      document.body.classList.add('hn-on');
      const tab = document.querySelector('.main-nav [data-nav="holonet"]');
      const r = tab ? tab.getBoundingClientRect() : { left: innerWidth * 0.8, top: innerHeight - 60, width: 60, height: 50 };
      document.body.classList.remove('hn-on');
      const tx = r.left + r.width / 2;
      const ty = r.top + r.height / 2;
      const node = el(`<div class="hc" role="dialog" aria-label="HoloNet Arena unlocked">
        <div class="hc-bg"></div>
        <div class="hc-space"><div class="hc-stars"></div><div class="hc-stars far"></div><div class="hc-neb"></div><div class="hc-planet"><i></i></div><div class="hc-cv"><i class="hc-shield"></i><div class="hc-cv-ship">${CORVETTE}</div><div class="hc-half f">${CORVETTE}</div><div class="hc-half r">${CORVETTE}</div><i class="hc-xw a"></i><i class="hc-xw b"></i></div><div class="hc-sd">${DESTROYER}</div></div>
        <div class="hc-alarm"></div>
        <div class="hc-klaxon">⚠ INCOMING TRANSMISSION ⚠</div>
        <div class="hc-comm"><div class="hc-comm-head"><i></i>REBEL FLEET · PRIORITY CHANNEL</div><div class="hc-face">${ACKBAR}<span class="hc-scan"></span></div><div class="hc-who">ADMIRAL ACKBAR</div><p class="hc-line" data-line></p></div>
        <div class="hc-shout">INCOMING!</div>
        <div class="hc-fx"></div>
        <div class="hc-title"><small>LEVEL 25 · MULTIPLAYER UNLOCKED</small><b>HOLONET ARENA</b><span>Your squads, against theirs.</span><button type="button" class="hn-btn gold" data-go>Enter the HoloNet</button></div>
        <button type="button" class="hc-skip" data-skip>Skip ›</button>
      </div>`);
      document.body.appendChild(node);
      const fx = node.querySelector('.hc-fx');
      const line = node.querySelector('[data-line]');
      let typing = 0;
      const type = (text, speed = 58) => {
        line.textContent = '';
        let i = 0;
        const my = ++typing;
        const step = () => { if (done || my !== typing || i > text.length) return; line.textContent = text.slice(0, i++); if (i <= text.length) timers.push(setTimeout(step, speed)); };
        step();
      };
      const shake = (el2, mag, ms) => el2 && el2.animate(Array.from({ length: 10 }, (_, k) => ({ transform: k === 9 ? 'none' : `translate(${(Math.random() - 0.5) * mag}px, ${(Math.random() - 0.5) * mag}px)` })), { duration: ms, easing: 'linear' });
      node.querySelector('[data-skip]').addEventListener('click', finish);
      node.querySelector('[data-go]').addEventListener('click', () => { finish(); setTimeout(() => App.go('holonet', {}), 500); });

      // 1. Red alert and Ackbar.
      node.classList.add('p1');
      sound('glitch'); at(450, () => sound('glitch')); at(900, () => sound('glitch'));
      at(900, () => { node.classList.add('p1b'); sound('zap'); });
      at(1500, () => type('Commander! Long-range sensors are tracking something big. It’s coming straight for your console…'));
      at(4700, () => { node.classList.add('p1c'); type('INCOMING!', 40); sound('explosion'); shake(node, 14, 500); });
      // 2. Out in space: the Star Destroyer hunts down a fleeing Rebel corvette.
      at(5900, () => { node.classList.add('p2'); sound('rumble'); });
      const space = node.querySelector('.hc-space');
      const cvBox = node.querySelector('.hc-cv');
      const shield = node.querySelector('.hc-shield');
      const spot = (sel, fx2, fy2) => { const rr = node.querySelector(sel).getBoundingClientRect(); return [rr.left + rr.width * fx2, rr.top + rr.height * fy2]; };
      const put = (cls, x, y, css = '') => { const e2 = el(`<i class="${cls}"></i>`); e2.style.cssText = `left:${x}px;top:${y}px;${css}`; space.appendChild(e2); return e2; };
      const later2 = (ms, fn) => timers.push(setTimeout(() => { if (!done) fn(); }, ms));
      // Turbolaser bolts: short bright bolts that travel, not beams.
      const bolt = (k, kind) => {
        const [bx, by] = spot('.hc-sd svg', (306 - (k % 4) * 30) / 330, (74 - (k % 4) * 3.4 + (k % 2) * 4) / 140);
        const tgtX = kind === 'shield' ? 0.12 + (k % 5) * 0.19 : 0.3 + (k % 3) * 0.2;
        const [cx, cy] = spot('.hc-cv-ship svg', tgtX, kind === 'shield' ? (k % 2 ? -0.35 : 1.3) : 0.5);
        const len = Math.hypot(cx - bx, cy - by);
        put('hc-muzzle', bx, by);
        const lane = put('hc-lane', bx, by, `width:${len}px;transform:rotate(${Math.atan2(cy - by, cx - bx)}rad)`);
        const core = el('<b></b>');
        lane.appendChild(core);
        core.animate([{ transform: 'translateX(-60px)' }, { transform: `translateX(${len - 30}px)` }], { duration: 440, easing: 'linear', fill: 'forwards' });
        setTimeout(() => lane.remove(), 500);
        sound('laser');
        later2(430, () => {
          if (kind === 'shield') {
            shield.animate([{ opacity: 0.95, transform: 'scale(1.04)' }, { opacity: 0.25, transform: 'scale(1)' }], { duration: 420, easing: 'ease-out' });
            const rip = put('hc-ripple', cx, cy);
            setTimeout(() => rip.remove(), 600);
          } else if (kind === 'break') {
            shield.classList.add('broken');
            for (let s = 0; s < 10; s++) { const a = Math.random() * Math.PI * 2; const sh = put('hc-shard', cx, cy); sh.animate([{ transform: 'translate(-50%,-50%) rotate(0)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * 90}px), calc(-50% + ${Math.sin(a) * 50}px)) rotate(${Math.random() * 360}deg)`, opacity: 0 }], { duration: 700, easing: 'ease-out', fill: 'forwards' }); setTimeout(() => sh.remove(), 760); }
            sound('glitch');
          } else {
            const h2 = put('hc-hit', cx, cy);
            setTimeout(() => h2.remove(), 620);
            const fire = el('<i class="hc-fire"></i>');
            const rr = cvBox.getBoundingClientRect();
            fire.style.cssText = `left:${cx - rr.left}px;top:${cy - rr.top}px`;
            cvBox.appendChild(fire);
          }
        });
      };
      const plan = [[6400, 'shield'], [6560, 'shield'], [6700, 'shield'], [6880, 'shield'], [7000, 'shield'], [7160, 'shield'], [7300, 'shield'], [7480, 'break'], [7660, 'hull'], [7800, 'hull'], [7940, 'hull']];
      plan.forEach(([ms, kind], k) => at(ms, () => bolt(k, kind)));
      // Chain reactions inside the hull, then the big one.
      [8250, 8430, 8600].forEach((ms, k) => at(ms, () => {
        const [x, y] = spot('.hc-cv-ship svg', [0.62, 0.3, 0.82][k], 0.5);
        const b2 = put('hc-pop', x, y);
        setTimeout(() => b2.remove(), 900);
        cvBox.animate(Array.from({ length: 6 }, (_, i) => ({ transform: i === 5 ? 'none' : `translate(${(Math.random() - 0.5) * 8}px, ${(Math.random() - 0.5) * 6}px)` })), { duration: 300 });
        sound('explosion');
      }));
      at(8900, () => {
        node.classList.add('p2b');
        sound('explosion'); later2(90, () => sound('explosion')); later2(260, () => sound('rumble'));
        shake(space, 22, 900);
        const [cx, cy] = spot('.hc-cv-ship svg', 0.5, 0.5);
        put('hc-wflash', 0, 0);
        put('hc-flat', cx, cy);
        put('hc-ring2', cx, cy);
        // the fireball: overlapping blooms that swell, cool and turn to smoke
        for (let k = 0; k < 11; k++) {
          const ox = (Math.random() - 0.5) * 90, oy = (Math.random() - 0.5) * 50, size = 40 + Math.random() * 50;
          const f = put('hc-fb', cx + ox, cy + oy, `width:${size}px;height:${size}px`);
          f.animate([
            { transform: 'translate(-50%,-50%) scale(.2)', opacity: 1, filter: 'brightness(2.2)' },
            { transform: `translate(-50%,-50%) scale(${2.4 + Math.random()})`, opacity: 1, filter: 'brightness(1)', offset: 0.25 },
            { transform: `translate(calc(-50% + ${ox * 0.6}px), calc(-50% + ${oy * 0.6 - 20}px)) scale(${3.4 + Math.random()})`, opacity: 0, filter: 'brightness(.4) grayscale(.6)' },
          ], { duration: 1600 + Math.random() * 900, delay: k * 45, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both' });
          setTimeout(() => f.remove(), 3200);
        }
        // sparks streaking out
        for (let k = 0; k < 24; k++) {
          const a = Math.random() * Math.PI * 2, dist = 120 + Math.random() * 260;
          const sp = put('hc-streak', cx, cy, `transform:rotate(${a}rad)`);
          sp.animate([{ transform: `rotate(${a}rad) translateX(0) scaleX(.3)`, opacity: 1 }, { transform: `rotate(${a}rad) translateX(${dist}px) scaleX(1)`, opacity: 0 }], { duration: 700 + Math.random() * 500, easing: 'cubic-bezier(.1,.8,.3,1)', fill: 'forwards' });
          setTimeout(() => sp.remove(), 1300);
        }
        // debris thrown out, then falling away
        for (let k = 0; k < 26; k++) {
          const vx = (Math.random() - 0.5) * 380, up = 40 + Math.random() * 120, fall = innerHeight * (0.5 + Math.random() * 0.5);
          const d2 = put('hc-deb', cx, cy, `width:${3 + Math.random() * 9}px;height:${3 + Math.random() * 6}px`);
          d2.animate([
            { transform: 'translate(-50%,-50%) rotate(0)', opacity: 1 },
            { transform: `translate(calc(-50% + ${vx * 0.5}px), calc(-50% - ${up}px)) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: 0.3 },
            { transform: `translate(calc(-50% + ${vx}px), calc(-50% + ${fall}px)) rotate(${720 + Math.random() * 720}deg)`, opacity: 0.2 },
          ], { duration: 2200 + Math.random() * 1200, easing: 'cubic-bezier(.3,.1,.7,1)', fill: 'forwards' });
          setTimeout(() => d2.remove(), 3600);
        }
        // the hull splits in two and both halves tumble away burning
        cvBox.classList.add('split');
        node.querySelector('.hc-half.f').animate([{ transform: 'none' }, { transform: 'translate(70px, -26px) rotate(-22deg)', opacity: 0.2 }], { duration: 3200, easing: 'ease-out', fill: 'forwards' });
        node.querySelector('.hc-half.r').animate([{ transform: 'none' }, { transform: 'translate(-24px, 22px) rotate(18deg)' }], { duration: 900, easing: 'ease-out', fill: 'forwards' });
        for (let k = 0; k < 6; k++) later2(200 + k * 320, () => { const [sx2, sy2] = spot('.hc-half.f', 0.52, 0.45 + Math.random() * 0.1); const s2 = put('hc-smoke2', sx2, sy2); setTimeout(() => s2.remove(), 2200); });
      });
      // 3. The burning engine block tumbles straight at the tab bar.
      at(9700, () => {
        node.classList.add('p3');
        const half = node.querySelector('.hc-half.r');
        const hr = half.getBoundingClientRect();
        half.style.visibility = 'hidden';
        const rock = el(`<div class="hc-rock">${ROCK}<i class="hc-trail"></i></div>`);
        fx.appendChild(rock);
        const sx = hr.left + hr.width * 0.2, sy = hr.top + hr.height * 0.5;
        const ang = Math.atan2(ty - sy, tx - sx) * 180 / Math.PI;
        rock.style.setProperty('--ang', `${ang + 180}deg`);
        rock.animate([
          { transform: `translate(${sx}px, ${sy}px) translate(-50%, -50%) scale(.28) rotate(18deg)` },
          { transform: `translate(${(sx + tx) / 2 + 30}px, ${(sy + ty) / 2 - 50}px) translate(-50%, -50%) scale(.95) rotate(200deg)`, offset: 0.55 },
          { transform: `translate(${tx}px, ${ty}px) translate(-50%, -50%) scale(1.35) rotate(400deg)` },
        ], { duration: 2400, easing: 'cubic-bezier(.5,0,.85,.5)', fill: 'forwards' });
        sound('whoosh'); later2(900, () => sound('whoosh')); later2(1700, () => sound('rumble'));
        // sparks and smoke shed along the way
        const shed = setInterval(() => {
          if (done || !rock.isConnected) return clearInterval(shed);
          const rr = rock.getBoundingClientRect();
          const x = rr.left + rr.width / 2, y = rr.top + rr.height / 2;
          const s2 = el('<i class="hc-ember"></i>'); s2.style.cssText = `left:${x}px;top:${y}px`; fx.appendChild(s2);
          s2.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${(Math.random() - 0.5) * 50}px), calc(-50% + ${(Math.random() - 0.5) * 50}px)) scale(.2)`, opacity: 0 }], { duration: 600, fill: 'forwards' });
          setTimeout(() => s2.remove(), 640);
          if (Math.random() < 0.5) { const m = el('<i class="hc-smoke2"></i>'); m.style.cssText = `left:${x}px;top:${y}px`; fx.appendChild(m); setTimeout(() => m.remove(), 2200); }
        }, 70);
        timers.push(setTimeout(() => { clearInterval(shed); rock.remove(); }, 2450));
      });
      // 4. Impact.
      at(11300, () => {
        node.classList.add('p4');
        sound('explosion'); at(120, () => sound('explosion')); at(300, () => sound('rumble'));
        shake(node, 26, 900); shake(document.getElementById('screen'), 20, 900); shake(document.querySelector('.main-nav'), 30, 900);
        document.body.classList.add('hn-on');
        const add = (html, css) => { const e2 = el(html); e2.style.cssText = css; fx.appendChild(e2); return e2; };
        add('<i class="hc-flash"></i>', '');
        [0, 1, 2].forEach((k) => add('<i class="hc-ring"></i>', `left:${tx}px;top:${ty}px;animation-delay:${k * 0.14}s`));
        add('<i class="hc-glow"></i>', `left:${tx}px;top:${ty}px`);
        for (let k = 0; k < 26; k++) {
          const a = -Math.PI * (0.05 + Math.random() * 0.9);
          const dist = 120 + Math.random() * Math.min(innerWidth, innerHeight) * 0.6;
          const d = add('<i class="hc-deb"></i>', `left:${tx}px;top:${ty}px;width:${4 + Math.random() * 10}px;height:${4 + Math.random() * 8}px`);
          d.animate([{ transform: 'translate(-50%,-50%) rotate(0)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * dist}px), calc(-50% + ${Math.sin(a) * dist}px)) rotate(${Math.random() * 900}deg)`, opacity: 0 }], { duration: 900 + Math.random() * 700, easing: 'cubic-bezier(.1,.7,.3,1)', fill: 'forwards' });
        }
        for (let k = 0; k < 9; k++) {
          const s = add('<i class="hc-smoke"></i>', `left:${tx + (Math.random() - 0.5) * 80}px;top:${ty - Math.random() * 30}px`);
          s.animate([{ transform: 'translate(-50%,-50%) scale(.3)', opacity: 0.9 }, { transform: `translate(calc(-50% + ${(Math.random() - 0.5) * 120}px), calc(-50% - ${80 + Math.random() * 140}px)) scale(${2 + Math.random() * 2})`, opacity: 0 }], { duration: 2400 + Math.random() * 1400, easing: 'ease-out', fill: 'forwards' });
        }
        // The fireball: hot core, overlapping blooms that swell and roll up into smoke.
        add('<i class="hc-core"></i>', `left:${tx}px;top:${ty}px`);
        for (let k = 0; k < 14; k++) {
          const ox = (Math.random() - 0.5) * 120, oy = -Math.random() * 70, size = 50 + Math.random() * 70;
          const f = add('<i class="hc-fb"></i>', `left:${tx + ox}px;top:${ty + oy * 0.4}px;width:${size}px;height:${size}px`);
          f.animate([
            { transform: 'translate(-50%,-50%) scale(.15)', opacity: 1 },
            { transform: `translate(-50%,-50%) scale(${2 + Math.random()})`, opacity: 1, offset: 0.22 },
            { transform: `translate(calc(-50% + ${ox * 0.5}px), calc(-50% + ${oy - 60}px)) scale(${3 + Math.random() * 1.4})`, opacity: 0 },
          ], { duration: 1700 + Math.random() * 900, delay: k * 40, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both' });
          setTimeout(() => f.remove(), 3400);
        }
        for (let k = 0; k < 30; k++) {
          const a = -Math.PI * (0.03 + Math.random() * 0.94), dist = 140 + Math.random() * Math.min(innerWidth, innerHeight) * 0.55;
          const sp = add('<i class="hc-streak"></i>', `left:${tx}px;top:${ty}px;transform:rotate(${a}rad)`);
          sp.animate([{ transform: `rotate(${a}rad) translateX(0) scaleX(.3)`, opacity: 1 }, { transform: `rotate(${a}rad) translateX(${dist}px) scaleX(1.2)`, opacity: 0 }], { duration: 650 + Math.random() * 600, easing: 'cubic-bezier(.1,.8,.3,1)', fill: 'forwards' });
          setTimeout(() => sp.remove(), 1400);
        }
        for (let k = 0; k < 16; k++) {
          const e3 = add('<i class="hc-ember"></i>', `left:${tx + (Math.random() - 0.5) * 140}px;top:${ty - Math.random() * 20}px`);
          e3.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${(Math.random() - 0.5) * 80}px), calc(-50% - ${120 + Math.random() * 200}px)) scale(.3)`, opacity: 0 }], { duration: 1800 + Math.random() * 1600, delay: 300 + Math.random() * 600, easing: 'ease-out', fill: 'both' });
          setTimeout(() => e3.remove(), 4200);
        }
        add('<i class="hc-scorch"></i>', `left:${tx}px;top:${ty}px`);
        add(`<svg class="hc-crack" viewBox="0 0 200 200" preserveAspectRatio="none"><path d="M100 200 L92 150 L70 128 L40 120 M92 150 L120 120 L150 112 L176 80 M70 128 L60 90 L30 70 M120 120 L118 80 L140 40 M60 90 L80 60" /></svg>`, `left:${tx}px;top:${ty}px`);
        if (tab) { tab.classList.add('hn-lock'); setTimeout(() => tab.classList.remove('hn-lock'), 1200); }
      });
      // 5. The HoloNet comes online out of the smoke.
      at(12500, () => {
        // The relay comes online: a cyan hologram pillar and rings out of the smoke.
        const add2 = (html, css) => { const e2 = el(html); e2.style.cssText = css; fx.appendChild(e2); return e2; };
        add2('<i class="hc-holo-pillar"></i>', `left:${tx}px;top:${ty}px`);
        [0, 1, 2].forEach((k) => add2('<i class="hc-holo-ring"></i>', `left:${tx}px;top:${ty}px;animation-delay:${0.2 + k * 0.35}s`));
      });
      at(12500, () => { node.classList.add('p5'); type('That was the HoloNet relay… and it’s online. Commander, the whole galaxy can challenge you now.', 55); sound('reveal_legendary'); });
      at(16100, () => node.classList.add('p6'));
      at(26000, finish);
    });
  }

  // ---------- small helpers ----------
  const mini = (id) => `<span class="mini" title="${esc(D.UNIT_MAP[id].name)}">${portrait(D.UNIT_MAP[id], { plate: false })}</span>`;
  const hnCard = (def, extra = {}) => {
    const c = HN.card(def.id);
    return UI.unitCard(def, { tag: 'div', hideShards: true, owned: !!c, level: c ? c.level : 1, stars: c ? c.stars : 1, ...extra }).replace('Find in the Black Market', esc(HN.HOW[def.id] || 'HoloNet reward'));
  };
  const head = (title, sub, back) => {
    const h = S();
    const d = HN.divOf(h.rating);
    return `<div class="hn-head">
      <button type="button" class="hn-badge-wrap" data-hn="leagues" title="Your league">${A.badge(d.league, d.div)}<small>${esc(d.name)} ›</small></button>
      <div><h2>${esc(title)}</h2><p>${sub || `${esc(d.name)} · ${fmt(h.rating)} rating${h.streak ? ` · <span class="hn-chip hot">${h.streak}-win streak · +${Math.min(5, h.streak) * 5}% Beskar</span>` : ''}`}</p></div>
      <div class="hn-wallet">${bes(h.beskar)}${kyb(HN.BETA ? h.kyber : Player.state.crystals)}</div>
    </div>${back ? '<button type="button" class="hn-back" data-hn="hub">‹ HoloNet</button>' : ''}`;
  };
  const go = (view, extra) => App.go('holonet', { view, ...(extra || {}) });
  const squadBox = (ids, kind, pow, label) => `<div class="hn-sq"><div class="top"><b>${label || 'Your squad'}</b><span class="pw">⚡ ${fmt(pow)}</span><button type="button" class="hn-btn ghost" data-hn="pick" data-kind="${kind}">Edit</button></div>
    <div class="row">${[0, 1, 2, 3, 4].map((i) => (ids[i] ? mini(ids[i]) : '<span class="empty"></span>')).join('')}</div></div>`;

  // ---------- the HoloNet screen ----------
  UI.Screens.holonet = (params = {}) => {
    const view = params.view || 'hub';
    const node = el(`<section class="view hn hnv-${view}"></section>`);
    const render = () => { node.innerHTML = VIEWS[view] ? VIEWS[view](params) : VIEWS.hub(params); };
    render();
    node.addEventListener('click', (e) => onClick(e, view, params, render));
    // Live updates from other testers while this screen is open.
    node.__live = render;
    return node;
  };
  HN.Net.on(() => { const n = document.querySelector('.view.hn'); if (n && n.__live && !document.querySelector('.modal-backdrop') && App.current === 'holonet' && ['raid', 'arena', 'leaders', 'duels'].includes((App.params || {}).view)) n.__live(); });

  const VIEWS = {};
  HN.VIEWS = VIEWS;
  HN.clicks = HN.clicks || {};
  VIEWS.hub = () => {
    const h = S();
    const t = HN.raidTotals();
    const r = HN.raidNow();
    const free = (h.freePucks || []).length;
    const art = (id) => root.Art.unitArt(D.UNIT_MAP[id]).replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" ');
    return `${head('HOLONET ARENA')}
      <div class="hn-tiles">
        <button type="button" class="hn-tile" data-hn="arena" data-kind="character"><div class="bg">${art('hn_pre_vizsla')}</div><em>Ranked · 5 vs 5</em><b>Ground Arena</b><span>Your ground squad against other players' defense squads.</span></button>
        <button type="button" class="hn-tile" data-hn="arena" data-kind="ship"><div class="bg">${art('hn_fang')}</div><em>Ranked · 5 vs 5</em><b>Fleet Arena</b><span>Fighters against fighters: your fleet against theirs.</span></button>
        <button type="button" class="hn-tile" data-hn="raid" style="border-color:${r.color}"><div class="bg">${art(r.id)}</div><em>Co-op · 10 cards · ${t.fallen ? 'DEFEATED' : `${Math.round((t.left / t.pool) * 100)}% health left`}</em><b>Raid: ${esc(r.name)}</b><span>Team up with another player's squad against this week's boss.</span></button>
        <button type="button" class="hn-tile" data-hn="forge" style="border-color:#7a4a24"><div class="bg"><svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">${A.puck("legend", "grogu")}</svg></div><em>Beskar · Kyber</em><b>Varka's Forge</b><span>Bounty pucks, Beskar ingots and arena-only cards.</span></button>
      </div>
      <div class="hn-mini-tiles">
        <button type="button" class="hn-mini" data-hn="vault"><b>HoloNet Cards</b><small>${HN.HN_IDS.filter(HN.owns).length} of ${HN.HN_IDS.length} earned</small></button>
        <div class="hn-mini" style="cursor:default"><b>Guilds</b><small>Coming soon: your clan, guild raids and guild battles</small></div>
        <button type="button" class="hn-mini" data-hn="captured"><b>Captured</b><small>${Object.keys(h.captured).length} of ${Object.keys(A.ROSTER).length} bounties</small></button>
        <button type="button" class="hn-mini" data-hn="leaders"><b>Leaderboard</b><small>${HN.Net.ready ? `${HN.Net.arena.length} player${HN.Net.arena.length === 1 ? '' : 's'} online` : 'Solo mode'}</small></button>
        <button type="button" class="hn-mini ${free ? 'dot' : ''}" data-hn="forge"><b>Rewards</b><small>${free ? `${free} bounty puck${free > 1 ? 's' : ''} waiting` : 'Nothing waiting'}</small></button>
        <button type="button" class="hn-mini ${HN.Duel && HN.Duel.invites() ? 'dot' : ''}" data-hn="duels"><b>Live Duels</b><small>${HN.Duel ? HN.Duel.status() : 'Loading…'}</small></button>
      </div>`;
  };

  // ---------- arena ----------
  let oppCache = {};
  VIEWS.arena = (p) => {
    const kind = p.kind || 'character';
    const h = S();
    const ids = HN.squad(kind);
    // Rebuild the list once fresh player data arrives (a new fetch stamp).
    if (oppCache.stamp !== HN.Net.fetched.arena) oppCache = { stamp: HN.Net.fetched.arena };
    const opps = oppCache[kind] || (oppCache[kind] = HN.opponents(kind));
    const myPow = HN.squadPower(HN.squadEntries(kind));
    return `${head(kind === 'ship' ? 'FLEET ARENA' : 'GROUND ARENA', null, true)}
      <div class="hn-seg" role="tablist"><button type="button" class="${kind === 'character' ? 'on' : ''}" data-hn="arena" data-kind="character">Ground</button><button type="button" class="${kind === 'ship' ? 'on' : ''}" data-hn="arena" data-kind="ship">Fleet</button></div>
      ${squadBox(ids, kind, myPow)}
      <p class="muted" style="margin:0">This squad is also your defense: other players fight it. Win streak: ${h.streak} (+${Math.min(5, h.streak) * 5}% Beskar, max +25%). Tougher opponents pay more.</p>
      <div class="hn-opps">${opps.map((o, i) => {
        const d = HN.divOf(o.rating);
        return `<div class="hn-opp"><div>${A.badge(d.league, d.div)}</div>
          <div class="who"><b>${esc(o.name)}</b>${o.real ? '<span class="tag">PLAYER</span>' : ''}<small>${esc(d.name)} · ${fmt(o.rating)} · ⚡ ${fmt(o.power)}</small><div class="minis">${o.squad.map((e) => mini(e.id)).join('')}</div></div>
          <div class="go">${bes(o.payout)}<button type="button" class="hn-btn" data-hn="attack" data-i="${i}" data-kind="${kind}" ${ids.length ? '' : 'disabled'}>Attack</button></div></div>`;
      }).join('')}</div>
`;
  };

  // ---------- raid ----------
  let allyPick = null;
  function allies() {
    const out = HN.Net.arena.filter((a) => a.uid !== HN.Net.me && Array.isArray(a.ground) && a.ground.length && a.ground.every((e) => D.UNIT_MAP[e.id])).slice(0, 5)
      .map((a) => ({ id: `p:${a.uid}`, name: HN.Net.name(a.uid), real: true, squad: a.ground }));
    const r = HN.rng(HN.week() * 31 + (S().allySeed || 0) * 7919 + 7);
    const mine = HN.squadEntries('character');
    const lvl = Math.max(1, Math.round(HN.avgLevel(mine)));
    const avail = D.UNITS.filter((u) => u.kind === 'character' && !u.exclusive && !u.boss && !mine.some((e) => e.id === u.id));
    const crews = ['Mandalorian mercenaries', 'Rebel strike team', 'Bounty hunter crew', 'Clone veterans', 'Smuggler\'s gang', 'Jedi survivors', 'Inquisitor cell', 'Hutt enforcers', 'Partisan cell', 'Imperial deserters'];
    const names = crews.slice().sort(() => r() - 0.5);
    for (let k = 0; out.length < 3 && k < 3; k++) {
      const picks = [];
      const pool = avail.slice();
      while (picks.length < 5 && pool.length) picks.push(pool.splice(Math.floor(r() * pool.length), 1)[0].id);
      out.push({ id: `m:${k}`, name: names[k], real: false, squad: picks.map((id) => ({ id, level: lvl, stars: 3 })) });
    }
    return out;
  }
  VIEWS.raid = () => {
    const r = HN.raidNow();
    const t = HN.raidTotals();
    const h = S();
    const rec = h.raids[`${HN.week()}:${r.id}`];
    const al = allies();
    if (!allyPick || !al.some((a) => a.id === allyPick)) allyPick = al[0] && al[0].id;
    const ids = HN.squad('character');
    return `${head('RAID', `Week ${HN.week() % 100} · bosses rotate every week`, true)}
      <div class="hn-raid-hero" style="--rc:${r.color}">
        <div class="art">${root.Art.unitArt(D.UNIT_MAP[r.id])}</div>
        <div><h2>${esc(r.name)}</h2><p class="muted" style="margin:2px 0 8px">${esc(r.sub)} · 10 cards against him</p>
          <div class="hn-hp"><i style="width:${(t.left / t.pool) * 100}%"></i><span>${t.fallen ? 'DEFEATED' : `${fmt(t.left)} / ${fmt(t.pool)}`}</span></div>
          <ul>${r.mech.map(([n, d]) => `<li><b>${esc(n)}</b>${esc(d)}</li>`).join('')}</ul></div>
      </div>
      ${t.fallen ? `<div class="hn-free"><span class="grow"><b>${esc(r.name)} has fallen!</b> ${rec && rec.dmg ? (rec.claimed ? 'Rewards claimed. A new boss arrives next week.' : 'You helped: claim your rewards.') : 'You didn\'t land a hit this week.'}</span>${rec && rec.dmg && !rec.claimed ? '<button type="button" class="hn-btn gold" data-hn="claim">Claim</button>' : ''}</div>` : ''}
      <div class="hn-sec"><h3>Damage this week</h3><div class="hn-board">${t.rows.slice(0, 8).map((x, i) => `<div class="${x.name === 'You' ? 'me' : ''}"><span>${i + 1}. ${esc(x.name)}</span><b>${fmt(x.dmg)}</b></div>`).join('')}</div><p class="muted small" style="margin:0">Top damage when the boss falls earns Krrsantan. Everyone who hit it gets 500 Beskar and an Elite bounty puck, with a chance at Aurra Sing or the Fang Fighter.</p></div>
      ${squadBox(ids, 'character', HN.squadPower(HN.squadEntries('character')), 'Your 5')}
      <div class="hn-sec"><h3>Fight alongside</h3><div class="hn-allies">${al.map((a) => `<button type="button" class="hn-ally ${a.id === allyPick ? 'on' : ''}" data-hn="ally" data-id="${a.id}"><b>${esc(a.name)} ${a.real ? '<span class="hn-chip">player</span>' : ''}</b><div class="minis">${a.squad.map((e) => mini(e.id)).join('')}</div></button>`).join('')}</div></div>
      <button type="button" class="hn-btn gold" data-hn="raidgo" style="justify-self:center;padding:12px 28px" ${t.fallen || !ids.length ? 'disabled' : ''}>${t.fallen ? 'Boss defeated' : 'Start raid'}</button>`;
  };

  // ---------- forge ----------
  const TIER_PRICE = { guild: ['beskar', 600], elite: ['beskar', 1500], high: ['crystals', 300], legend: ['beskar', 3000] };
  const TIER_INFO = { guild: '3 cards, Rare or better', elite: '5 cards, an Epic guaranteed', high: '6 cards, a Legendary guaranteed', legend: 'An arena-only card guaranteed, plus 3 Epic+' };
  const dayKey = () => Player.dayKey();
  function board() {
    const h = S();
    if (h.board && h.board.day === dayKey() && h.board.v === 2) {
      // Today's board from before the price cut: the unbought High-Value puck moves into 260-340.
      h.board.pucks.forEach((pk) => { if (pk.tier === 'high' && !pk.bought && (A.ROSTER[pk.target] || {}).tier !== 'gold') pk.price = Math.min(340, Math.max(260, pk.price)); });
      return h.board;
    }
    const r = HN.rng((h.seed || 1) * 104729 + parseInt(dayKey().replace(/\D/g, ''), 10));
    const pucks = ['guild', 'elite', 'high', 'legend'].map((tier) => {
      const roster = Object.entries(A.ROSTER).filter(([, v]) => v.tier === tier);
      let [target, t] = roster[Math.floor(r() * roster.length)];
      if (r() < 0.02 || (h.forceGold && tier === 'elite')) { const g = Object.entries(A.ROSTER).filter(([, v]) => v.tier === 'gold'); [target, t] = g[Math.floor(r() * g.length)]; }
      const [cur, base] = TIER_PRICE[tier];
      const tierBounties = roster.map(([, v]) => v.bounty);
      const lo = Math.min(...tierBounties), hi = Math.max(...tierBounties);
      const norm = t.tier === 'gold' ? 1 : hi > lo ? (t.bounty - lo) / (hi - lo) : 0.5;
      let price = Math.round((base * (0.85 + 0.3 * norm) * (t.tier === 'gold' ? 1.5 : 1)) / 10) * 10;
      // High-Value pucks cost 260-340 Kyber: a real grind, but weeks, not months.
      if (tier === 'high' && t.tier !== 'gold') price = Math.min(340, Math.max(260, price));
      return { tier, target, cur, price, norm, bought: false };
    });
    h.forceGold = false;
    h.board = { day: dayKey(), v: 2, pucks };
    HN.save();
    return h.board;
  }
  const DIRECT = [{ id: 'hn_armorer', cur: 'beskar', price: 4000 }, { id: 'hn_paz', cur: 'beskar', price: 4000 }, { id: 'hn_outrider', cur: 'crystals', price: 400 }];
  const price = (cur, n) => (cur === 'beskar' ? bes(n) : kyb(n));
  VIEWS.forge = () => {
    const h = S();
    const b = board();
    const free = h.freePucks || [];
    return `${head("VARKA'S FORGE", null, true)}
      <div class="hn-forge-top"><div class="varka"><svg viewBox="0 0 100 100">${A.varka()}</svg></div>
        <div><b class="nm">VARKA · BESKAR BROKER</b><q>Steel from Mandalore, bounties from every corner of the galaxy. Win in the Arena and both are yours.</q>
        <p class="muted small" style="margin:8px 0 0"><b style="color:#ffcf8a">Beskar</b> is the HoloNet's currency: earn it from arena wins, raids and new divisions, and spend it here, on bounty pucks, shards and HoloNet card upgrades. New bounties are posted every day. Each target leans the pull toward its kind of card, and a bigger bounty means a better pull.</p></div></div>
      ${free.length ? `<div class="hn-free"><span class="grow"><b>Rewards waiting:</b> ${free.map((t) => A.TIER[t].label).join(', ')} bounty puck${free.length > 1 ? 's' : ''}</span><button type="button" class="hn-btn gold" data-hn="openfree">Open</button></div>` : ''}
      <div class="hn-sec"><h3>Today's bounties</h3><div class="hn-pucks">${b.pucks.map((pk, i) => {
        const t = A.ROSTER[pk.target];
        const gold = t.tier === 'gold';
        return `<div class="hn-puck ${gold ? 'gold' : ''} ${pk.bought ? 'done' : ''}" style="--pc:${A.TIER[pk.tier].color}">
          <div class="art"><svg viewBox="0 0 100 100">${A.puck(pk.tier, pk.target)}</svg></div>
          <div class="wanted"><span>${gold ? '★ MOST WANTED' : 'DEAD OR ALIVE'}</span><em>${fmt(t.bounty)} cr</em></div>
          <b>${esc(t.name)}</b><small>${esc(t.line)}</small><small>${A.TIER[pk.tier].label} puck · ${TIER_INFO[pk.tier]}${gold ? ' · boosted odds' : ''}</small>
          <button type="button" class="hn-btn ${gold ? 'gold' : ''}" data-hn="buy" data-i="${i}" ${pk.bought ? 'disabled' : ''}>${pk.bought ? 'Captured' : price(pk.cur, pk.price)}</button></div>`;
      }).join('')}</div></div>
      <div class="hn-sec"><h3>Forge goods</h3><div class="hn-pucks">
        <div class="hn-puck" style="--pc:#5fd8ff"><div class="art"><svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#0c0e14"/><radialGradient id="hnsc"><stop offset="0" stop-color="#5fd8ff" stop-opacity=".45"/><stop offset="1" stop-color="#5fd8ff" stop-opacity="0"/></radialGradient><circle cx="50" cy="52" r="40" fill="url(#hnsc)"/><g transform="translate(50 54)" stroke="#e8faff" stroke-width="1" style="filter:drop-shadow(0 0 3px #5fd8ff)"><path d="M0 -30 L9 -4 L0 26 L-9 -4Z" fill="#7fe4ff"/><path d="M0 -30 L9 -4 L0 -2Z" fill="#ffffff" opacity=".7"/><path d="M-20 -12 L-13 4 L-20 22 L-27 4Z" fill="#5fc8f0" opacity=".85"/><path d="M20 -12 L27 4 L20 22 L13 4Z" fill="#5fc8f0" opacity=".85"/><path d="M-34 6 L-30 14 L-34 24 L-38 14Z M34 6 L38 14 L34 24 L30 14Z" fill="#3aa8d8" opacity=".7"/></g></svg></div><b>Shard Cache</b><small>20 shards for any card you choose</small><button type="button" class="hn-btn" data-hn="ingot">${bes(900)}</button></div>
        ${DIRECT.map((x) => { const def = D.UNIT_MAP[x.id]; const own = HN.owns(x.id); return `<div class="hn-puck" style="--pc:#ffb05a"><div class="art">${hnCard(def)}</div><b>${esc(def.name)}</b><small>Arena-only ${D.RARITIES[def.rarity].label}</small><button type="button" class="hn-btn" data-hn="direct" data-id="${x.id}" ${own ? 'disabled' : ''}>${own ? 'Owned' : price(x.cur, x.price)}</button></div>`; }).join('')}
      </div></div>
      <button type="button" class="hn-btn ghost" data-hn="captured" style="justify-self:center">Captured bounties ›</button>`;
  };

  // ---------- captured log ----------
  const CAP_ROWS = [['guild', 'Guild jobs', 300], ['elite', 'Elite contracts', 600], ['high', 'High-value targets', 1000], ['legend', 'Legendary contract', 1500], ['gold', 'Most Wanted', 3000]];
  VIEWS.captured = () => `${head('CAPTURED', 'Every target you bring in is logged here. Finish a row for Beskar.', true)}${VIEWS.capturedBody()}`;
  // Bodies are shared with the Databank tabs.
  VIEWS.capturedBody = () => {
    const h = S();
    h.capRows = h.capRows || {};
    return `<div class="hn-caps">${CAP_ROWS.map(([tier, name, reward]) => {
        const list = Object.entries(A.ROSTER).filter(([, v]) => v.tier === tier);
        const got = list.filter(([k]) => h.captured[k]).length;
        const color = tier === 'gold' ? '#ffd86a' : A.TIER[tier].color;
        return `<div class="hn-cap-row"><header><span style="color:${color}">${name}</span><span>${got}/${list.length} · ${h.capRows[tier] ? '✓ paid' : bes(reward)}</span></header><div class="list">${list.map(([k, v]) => `<div class="hn-cap ${h.captured[k] ? '' : 'no'}"><svg viewBox="30 6 40 48"><g fill-opacity=".6">${A.figure(k, color)}</g></svg><span>${h.captured[k] ? esc(v.name) : '???'}</span>${h.captured[k] ? `<span class="stamp">CAPTURED ×${h.captured[k]}</span>` : ''}</div>`).join('')}</div></div>`;
      }).join('')}</div>`;
  };

  // ---------- card vault ----------
  VIEWS.vault = () => `${head('HOLONET CARDS', 'Arena-only cards. They never appear in crates or the Black Market.', true)}${VIEWS.vaultBody()}`;
  VIEWS.vaultBody = () => `<div class="hn-vault">${HN.HN_IDS.map((id) => `<button type="button" class="hn-vbtn" data-hn="inspect" data-id="${id}" style="background:none;border:0;padding:0;cursor:pointer;color:inherit;font:inherit">${hnCard(D.UNIT_MAP[id])}</button>`).join('')}</div>`;

  // ---------- leagues ----------
  VIEWS.leagues = () => {
    const h = S();
    const cur = HN.divOf(h.rating);
    return `${head('LEAGUES', `Rating ${fmt(h.rating)} · best ${fmt(h.best)}. Each new division pays Beskar once; each new league pays a bounty puck${''}.`, true)}
      <div class="hn-ladder">${HN.LEAGUES.map((l) => {
        const divs = HN.DIVS.filter((d) => d.league === l.id);
        const lr = HN.LEAGUE_REWARD[l.id];
        const rew = lr ? `League reward: ${A.TIER[lr.puck].label} bounty puck${lr.card ? ` + ${D.UNIT_MAP[lr.card].name}` : ''}${lr.cards ? ` + ${lr.cards.map((c) => D.UNIT_MAP[c].name).join(' & ')}` : ''}` : 'Starting league';
        return `<div class="hn-rung"><b class="lg-${l.id}">${l.name.toUpperCase()}<small class="r">${esc(rew)}</small></b><div class="bdgs" style="${divs.length === 1 ? 'grid-template-columns:1fr' : ''}">${divs.map((d) => `<div class="bdg ${h.best >= d.min ? 'got' : ''} ${d.key === cur.key ? 'cur' : ''}">${A.badge(d.league, d.div)}<span>${esc(d.name)}</span><small>${fmt(d.min)}+ · ${h.divs.includes(d.key) ? '✓' : bes(d.beskar)}</small></div>`).join('')}</div></div>`;
      }).join('')}</div>`;
  };

  // ---------- leaderboard ----------
  VIEWS.leaders = () => {
    const h = S();
    const rows = HN.Net.ready ? HN.Net.arena.map((a) => ({ name: HN.Net.name(a.uid), rating: a.uid === HN.Net.me ? h.rating : a.rating, me: a.uid === HN.Net.me })) : [];
    if (!rows.some((r) => r.me)) rows.push({ name: 'You', rating: h.rating, me: true });
    rows.sort((a, b) => b.rating - a.rating);
    return `${head('LEADERBOARD', HN.Net.ready ? 'Everyone playing in the HoloNet.' : 'Offline: the shared board needs an internet connection.', true)}
      <div class="hn-board">${rows.map((r, i) => { const d = HN.divOf(r.rating); return `<div class="${r.me ? 'me' : ''}"><span>${i + 1}. ${esc(r.name)}</span><span>${esc(d.name)} · <b>${fmt(r.rating)}</b></span></div>`; }).join('')}</div>`;
  };

  // ---------- clicks ----------
  function onClick(e, view, params, render) {
    const b = e.target.closest('[data-hn]');
    if (!b || b.disabled) return;
    const a = b.dataset.hn;
    const h = S();
    if (a === 'hub') return go('hub');
    // No callsign yet: pick one before doing anything else here.
    if (a !== 'tour' && HN.gate && HN.gate()) return;
    if (HN.clicks[a]) return HN.clicks[a](b, render);
    if (['vault', 'leagues', 'captured', 'leaders', 'forge', 'raid', 'duels'].includes(a)) return go(a);
    if (a === 'arena') return go('arena', { kind: b.dataset.kind });
    if (a === 'pick') return pickSquad(b.dataset.kind, render);
    if (a === 'attack') return attack(b.dataset.kind, oppCache[b.dataset.kind][+b.dataset.i]);
    if (a === 'ally') { allyPick = b.dataset.id; return render(); }
    if (a === 'raidgo') return startRaid();
    if (a === 'claim') return claim(render);
    if (a === 'inspect') return inspect(b.dataset.id, render);
    if (a === 'buy') return buyPuck(+b.dataset.i, render);
    if (a === 'openfree') return openFree(render);
    if (a === 'ingot') return ingot(render);
    if (a === 'direct') return direct(b.dataset.id, render);
  }

  function pickSquad(kind, after) {
    const list = HN.pool(kind).sort((x, y) => HN.powerOf(y.id) - HN.powerOf(x.id));
    let sel = HN.squad(kind).slice();
    const body = () => `<div class="hn-pick-head"><b>${kind === 'ship' ? 'Fleet' : 'Ground'} squad · ${sel.length}/5</b><span class="muted small">HoloNet cards can join here, and only here.</span></div>
      <div class="hn-pick" data-noswipe>${list.map((u) => (u.hn ? hnCard(u, { selected: sel.includes(u.id) }) : UI.unitCard(u, { tag: 'div', hideShards: true, selected: sel.includes(u.id) })).replace('class="ucard', `data-pick="${u.id}" class="ucard`)).join('')}</div>
      <div class="modal-actions"><button type="button" class="btn" data-x="auto">Auto-pick</button><button type="button" class="btn btn-primary" data-x="save">Save</button></div>`;
    const m = openModal(`<div data-body>${body()}</div>`, {});
    const redraw = () => { m.root.querySelector('[data-body]').innerHTML = body(); };
    m.root.addEventListener('click', (e) => {
      const c = e.target.closest('[data-pick]');
      if (c) { const id = c.dataset.pick; sel = sel.includes(id) ? sel.filter((x) => x !== id) : sel.length < 5 ? [...sel, id] : sel; return redraw(); }
      const x = e.target.closest('[data-x]');
      if (!x) return;
      if (x.dataset.x === 'auto') { sel = list.slice(0, 5).map((u) => u.id); return redraw(); }
      S().squads[kind] = sel;
      HN.save();
      HN.Net.publish();
      oppCache = {};
      m.close();
      after();
    });
  }

  function inspect(id, after) {
    const def = D.UNIT_MAP[id];
    const c = HN.card(id);
    const abil = D.abilitiesFor(def);
    const lvlCost = c ? 60 * c.level : 0;
    const starNeed = c && c.stars < D.MAX_STARS ? D.STAR_COSTS[c.stars - 1] : 0;
    const passive = (def.bio.match(/Passive, ([^:]+): (.+)$/) || []);
    const m = openModal(`<div class="hn-insp"><div class="pt">${portrait(def)}</div><div>
      <p class="eyebrow">${D.RARITIES[def.rarity].label} · ${def.role} · ${def.kind === 'ship' ? 'Fleet' : 'Ground'} · HoloNet only</p><h2 style="margin:2px 0">${esc(def.name)}</h2>
      <p class="muted">${esc(def.bio.replace(/ Passive,.*$/, ''))}</p>
      <ul>${abil.map((x) => `<li class="${x.ultimate ? 'ult' : ''}"><b>${x.ultimate ? '★ ' : ''}${esc(x.name)}</b> <span class="muted small">${x.ultimate ? 'Ultimate' : x.cd ? `${x.cd}-turn cooldown` : 'Basic'}</span><br>${esc(x.desc)}</li>`).join('')}${passive[1] ? `<li><b>Passive · ${esc(passive[1])}</b><br>${esc(passive[2])}</li>` : ''}</ul>
      ${c ? `<p>Lv ${c.level} · ${'★'.repeat(c.stars)} · ${c.shards} shards</p>` : `<p class="hn-how" style="text-align:left">How to get: ${esc(HN.HOW[id])}</p>`}
      <div class="modal-actions">${c ? `<button type="button" class="btn" data-x="lvl" ${c.level >= (D.MAX_LEVEL || 30) || S().beskar < lvlCost ? 'disabled' : ''}>Level up · ${bes(lvlCost)}</button><button type="button" class="btn" data-x="star" ${!starNeed || c.shards < starNeed ? 'disabled' : ''}>Promote · ${starNeed ? `${c.shards}/${starNeed}` : 'max'}</button>` : ''}<button type="button" class="btn btn-primary" data-x="watch">▶ Watch ultimate</button></div>
    </div></div>`, {});
    m.root.addEventListener('click', (e) => {
      const x = e.target.closest('[data-x]');
      if (!x || x.disabled) return;
      if (x.dataset.x === 'lvl') { S().beskar -= lvlCost; c.level += 1; HN.save(); HN.Net.publish(); sound('rankup'); m.close(); after(); inspect(id, after); }
      if (x.dataset.x === 'star') { c.shards -= starNeed; c.stars += 1; HN.save(); HN.Net.publish(); sound('rankup'); m.close(); after(); inspect(id, after); }
      if (x.dataset.x === 'watch') { m.close(); BUI.preview(id, () => go('vault')); }
    });
  }

  // ---------- battles ----------
  const HNB = { retreated: false, back: null };
  HN.B = HNB;
  HN.hnStart = (...a) => hnStart(...a);
  HN.ui = { ACKBAR, unlocked: () => unlocked(), head: (...a) => head(...a), mini: (id) => mini(id), go: (...a) => go(...a), bes: (n) => bes(n), award: (f) => award(f) };
  async function hnStart(params, squad, enemies, opts) {
    const self = BUI;
    self.params = params;
    self.enc = { name: opts.name, kind: opts.kind, planet: opts.planet, type: 'hn', boss: opts.boss || null };
    self.kind = opts.kind;
    self.ended = false;
    self.pending = null;
    self.planetId = opts.planet;
    self.battle = new root.Battle(squad, enemies, opts.rng || null, {});
    if (opts.setup) opts.setup(self.battle);
    App.battleActive = true;
    App.current = 'battle';
    document.body.classList.add('in-battle');
    document.documentElement.style.setProperty('--speed', self.speed);
    self.renderScreen();
    if (opts.raid) self.view.classList.add('hn-raid');
    for (const u of self.battle.units) if (u.hnWait) self.cards[u.uid].classList.add('hn-wait');
    self.fxl = el('<div class="hn-fxl"></div>');
    self.field.appendChild(self.fxl);
    if (root.Sound) root.Sound.music('battle');
    await self.hyperspace();
    if (opts.boss) await self.bossIntro(D.UNIT_MAP[opts.boss]);
    self.log(`${opts.name}: fight!`, 'ult');
    if (opts.intro) self.log(opts.intro, 'hazard');
    self.loop();
  }

  function attack(kind, opp) {
    const squad = HN.squadEntries(kind);
    if (!squad.length) return toast('Pick a squad first.');
    HNB.back = { view: 'arena', kind };
    hnStart({ type: 'hn', hn: 'arena', kind, opp }, squad, opp.squad.map((e) => ({ ...e })), {
      name: `HoloNet Arena · vs ${opp.name}`, kind, planet: kind === 'ship' ? 'coruscant' : 'geonosis',
      intro: `Win to earn ${opp.payout} Beskar.`,
    });
  }

  function startRaid() {
    const r = HN.raidNow();
    const t = HN.raidTotals();
    const mine = HN.squadEntries('character');
    if (!mine.length) return toast('Pick a squad first.');
    const ally = allies().find((a) => a.id === allyPick) || allies()[0];
    const used = new Set(mine.map((e) => e.id));
    const allyEntries = ally.squad.filter((e) => !used.has(e.id)).map((e) => ({ ...e }));
    const lvl = Math.max(1, Math.round(HN.avgLevel(mine)));
    const enemies = r.slots.map((id) => ({ id, level: id === r.id ? lvl + 4 : lvl, stars: id === r.id ? 7 : 3 }));
    HNB.back = { view: 'raid' };
    hnStart({ type: 'hn', hn: 'raid', boss: r.id }, [...mine, ...allyEntries], enemies, {
      name: `Raid · ${r.name}`, kind: 'character', planet: r.planet, raid: true, boss: r.id,
      intro: `${allyEntries.length ? `${ally.name} fights beside you. ` : ''}Deal as much damage as you can: every hit counts toward the shared health bar.`,
      setup(b) {
        b.hnRaid = { boss: r.id, turn: 0, limit: 100 };
        const boss = b.units.find((u) => u.id === r.id);
        boss.maxHp = t.pool; boss.hp = Math.max(1, t.left);
        HN.raidToughen(b, r.id);
        if (boss.hp <= boss.maxHp / 2) { boss.enraged = true; boss.statuses.offUp = 99; }
        b.hnStartHp = boss.hp;
        b.side('enemy').forEach((u, i) => { if (!r.start.includes(i)) { u.alive = false; u.hp = 0; u.hnWait = true; } });
      },
    });
  }

  // Replace the result screen for HoloNet fights.
  const baseFinish = BUI.finish;
  BUI.finish = async function (winner) {
    const p = this.params || {};
    if (p.type !== 'hn') return baseFinish.call(this, winner);
    this.ended = true;
    this.setActive(null);
    await new Promise((r) => setTimeout(r, 900));
    const won = winner === 'player';
    if (root.Sound) { root.Sound.play(won ? 'victory' : 'defeat'); root.Sound.music('menu'); }
    const b = this.battle;
    this.teardown();
    if (p.hn === 'arena') return arenaDone(p, won);
    if (p.hn === 'duel') return HN.duelDone(p, won);
    return raidDone(p, b, won);
  };
  // Retreat counts as a loss (and a raid still banks the damage done).
  const baseComplete = Player.completeEncounter;
  Player.completeEncounter = function (params, won, r) {
    if (params && params.type === 'hn') {
      HNB.retreated = true;
      if (params.hn === 'arena') HN.arenaResult(params.opp, false);
      else if (params.hn === 'duel') { if (HN.Duel) HN.Duel.forfeit(); }
      else if (BUI.battle) { const boss = BUI.battle.units.find((u) => u.def.raid); const dealt = Math.max(0, (BUI.battle.hnStartHp || 0) - (boss ? boss.hp : 0)); if (dealt) HN.bankRaid(dealt); }
      return { lost: true };
    }
    return baseComplete.call(this, params, won, r);
  };

  function arenaDone(p, won) {
    const res = HN.arenaResult(p.opp, won);
    delete oppCache[p.kind];
    const promo = res.rewards.map((x) => (x.type === 'div' ? `<div class="promo">${A.badge(x.div.league, x.div.div)}<b>${esc(x.div.name)} reached!</b><div>${bes(x.beskar)}</div></div>`
      : `<div class="promo"><b>New league: ${esc(x.league.toUpperCase())}</b><div>${A.TIER[x.puck].label} bounty puck added to your rewards${x.cards.length ? ` · ${x.cards.map((c) => `${esc(D.UNIT_MAP[c.id].name)}${c.isNew ? ' (new!)' : ''}`).join(', ')}` : ''}</div></div>`)).join('');
    const m = openModal(`<div class="hn-result"><div class="result-title ${won ? 'win' : 'lose'}">${won ? 'VICTORY' : 'DEFEAT'}</div>
      <div class="big-num" style="color:${res.delta >= 0 ? '#7af0a0' : '#ff7a7a'}">${res.delta >= 0 ? '+' : ''}${res.delta} rating</div>
      <div class="rows"><div><span>Rating</span><b>${fmt(S().rating)} · ${esc(res.after.name)}</b></div>${won ? `<div><span>Beskar${res.streakBefore ? ` (streak +${Math.min(5, res.streakBefore) * 5}%)` : ''}</span><b>${bes(res.beskar)}</b></div>` : ''}<div><span>Win streak</span><b>${res.streak}</b></div></div>
      ${promo ? `<div class="hn-promos">${promo}</div>` : ''}
      <div class="modal-actions"><button type="button" class="btn" data-r="hub">HoloNet</button><button type="button" class="btn btn-primary" data-r="again">Next opponent</button></div></div>`, { small: true, dismissable: false, cls: 'result-modal' });
    m.root.addEventListener('click', (e) => {
      const r = e.target.closest('[data-r]');
      if (!r) return;
      m.close();
      if (r.dataset.r === 'again') go('arena', { kind: p.kind }); else go('hub');
      const cards = res.rewards.flatMap((x) => x.cards || []);
      walk(cards);
      if (res.rewards.some((x) => x.league === 'legend')) setTimeout(() => award(FEAT_LEGEND), 600);
    });
  }
  async function walk(cards) {
    for (const c of cards) if (c.isNew) await UI.walkout(D.UNIT_MAP[c.id], D.UNIT_MAP[c.id].rarity, false, { exclusive: true, isNew: true, shards: 0 });
  }

  function raidDone(p, b, won) {
    const boss = b.units.find((u) => u.def.raid);
    const dealt = Math.max(0, (b.hnStartHp || 0) - (boss ? boss.hp : 0));
    const res = HN.bankRaid(dealt);
    const t = HN.raidTotals();
    const r = HN.raidNow();
    const m = openModal(`<div class="hn-result"><div class="result-title ${won ? 'win' : 'lose'}">${won ? 'BOSS DEFEATED' : 'RAID OVER'}</div>
      <div class="big-num" style="color:#ffb05a">${fmt(dealt)} damage</div>
      <div class="rows"><div><span>Beskar</span><b>${bes(res.beskar)}</b></div><div><span>Your total this week</span><b>${fmt(res.rec.dmg)}</b></div><div><span>${esc(r.name)}</span><b>${t.fallen ? 'Defeated!' : `${fmt(t.left)} health left`}</b></div></div>
      <div class="modal-actions"><button type="button" class="btn" data-r="hub">HoloNet</button><button type="button" class="btn btn-primary" data-r="raid">${t.fallen ? 'Claim rewards' : 'Back to the raid'}</button></div></div>`, { small: true, dismissable: false, cls: 'result-modal' });
    m.root.addEventListener('click', (e) => {
      const x = e.target.closest('[data-r]');
      if (!x) return;
      m.close();
      go(x.dataset.r === 'raid' ? 'raid' : 'hub');
      if (t.fallen && x.dataset.r === 'raid') setTimeout(() => claim(() => go('raid')), 300);
    });
  }

  function claim(after) {
    const r = HN.raidNow();
    const out = HN.claimRaid();
    if (!out) return;
    const m = openModal(`<div class="hn-result"><div class="result-title win">${esc(r.name.toUpperCase())} HAS FALLEN</div>
      <div class="rows"><div><span>Beskar</span><b>${bes(out.beskar)}</b></div><div><span>Reward</span><b>Elite bounty puck</b></div>${out.top ? '<div><span>Top damage!</span><b>Krrsantan</b></div>' : ''}${out.cards.filter((c) => c.id !== 'hn_krrsantan').map((c) => `<div><span>Raid drop</span><b>${esc(D.UNIT_MAP[c.id].name)}${c.isNew ? '' : ` (+${c.shards} shards)`}</b></div>`).join('')}</div>
      <div class="modal-actions"><button type="button" class="btn btn-primary" data-r="ok">Collect</button></div></div>`, { small: true, dismissable: false, cls: 'result-modal' });
    m.root.addEventListener('click', async (e) => {
      if (!e.target.closest('[data-r]')) return;
      m.close();
      after();
      await walk(out.cards);
      award(bossFeat(r));
    });
  }

  // Battle effects for raid mechanics (hnfx events).
  const basePlay = BUI.play;
  BUI.play = async function (events) {
    if (!events || !events.some((e) => e.type === 'hnfx')) return basePlay.call(this, events);
    let chunk = [];
    for (const ev of events) {
      if (ev.type !== 'hnfx') { chunk.push(ev); continue; }
      if (chunk.length) { await basePlay.call(this, chunk); chunk = []; }
      if (this.ended) return;
      await fx.call(this, ev);
    }
    if (chunk.length) await basePlay.call(this, chunk);
  };
  const center = (self, uid) => {
    const c = self.cards[uid];
    if (!c || !self.field) return null;
    const f = self.field.getBoundingClientRect();
    const r = c.getBoundingClientRect();
    return { x: r.left - f.left + r.width / 2, y: r.top - f.top + r.height / 2 };
  };
  const ring = (self, uid, color) => {
    const p = center(self, uid);
    if (!p || !self.fxl) return;
    const n = el(`<i class="hn-ring" style="left:${p.x}px;top:${p.y}px;--c:${color}"></i>`);
    self.fxl.appendChild(n);
    setTimeout(() => n.remove(), 800);
  };
  async function fx(ev) {
    const lite = root.Perf && root.Perf.simpleUlts;
    if (ev.type !== 'hnfx') return;
    if (ev.fx === 'spawn') {
      const c = this.cards[ev.uid];
      if (c) c.classList.remove('hn-wait');
      ring(this, ev.uid, '#ff5a3a');
      return this.wait(200);
    }
    if (ev.fx === 'dark') { if (this.view) this.view.style.setProperty('--hn-dark', String(ev.v)); return null; }
    if (ev.fx === 'drain' && !lite && this.fxl) {
      const to = center(this, ev.uid);
      for (const u of this.battle.living('player')) {
        const from = center(this, u.uid);
        if (!from || !to) continue;
        const dx = to.x - from.x, dy = to.y - from.y;
        const n = el(`<i class="hn-beam" style="left:${from.x}px;top:${from.y}px;width:${Math.hypot(dx, dy)}px;transform:rotate(${Math.atan2(dy, dx)}rad)"></i>`);
        this.fxl.appendChild(n);
        setTimeout(() => n.remove(), 1000);
      }
      sound('whoosh');
      return this.wait(650);
    }
    if (ev.fx === 'credits' && !lite && this.fxl) {
      for (let k = 0; k < 18; k++) { const n = el(`<i class="hn-coin" style="left:${(k * 37) % 100}%;animation-delay:${(k % 6) * 0.08}s"></i>`); this.fxl.appendChild(n); setTimeout(() => n.remove(), 1800); }
      sound('coins');
      return this.wait(600);
    }
    if (['grab', 'drop', 'digest', 'mind'].includes(ev.fx)) {
      const c = this.cards[ev.uid];
      ring(this, ev.uid, ev.fx === 'mind' ? '#ff3a3a' : ev.fx === 'digest' ? '#ffb05a' : '#c88a5a');
      if (c && !lite) c.animate(ev.fx === 'drop' ? [{ transform: 'none' }, { transform: 'translateY(30px) scale(.8)', opacity: 0.4 }, { transform: 'none', opacity: 1 }] : [{ transform: 'none' }, { transform: 'translateX(-6px) rotate(-4deg)' }, { transform: 'translateX(6px) rotate(4deg)' }, { transform: 'none' }], { duration: 600 });
      return this.wait(350);
    }
    return null;
  }

  // ---------- boss ultimates: one full-screen cinematic each ----------
  const CINE = {
    raid_jabba: (c) => ({ d: 2400, veil: 'radial-gradient(circle at 50% 40%, rgba(255,176,90,.5), rgba(40,16,4,.95))', extra: [0, 1, 2].map((k) => `<span class="stamp" style="--t:${0.6 + k * 0.35}s;left:${18 + k * 26}%;top:${22 + (k % 2) * 40}%">WANTED</span>`).join('') + Array.from({ length: 22 }, (_, k) => `<i class="hn-coin" style="left:${(k * 47) % 100}%;animation-delay:${(k % 8) * 0.09}s"></i>`).join(''), title: 'BOUNTY ON YOUR HEADS', sub: 'Jabba puts a price on everyone' }),
    raid_nihilus: (c) => ({ d: 2600, veil: 'radial-gradient(circle at 50% 45%, rgba(60,10,90,.7), rgba(4,0,8,.97))', extra: Array.from({ length: 10 }, (_, k) => `<i class="stream" style="--t:${0.3 + (k % 5) * 0.12}s;transform:rotate(${k * 36 + 18}deg) scaleX(-1)"></i>`).join(''), title: 'FEAST ON THE WORLD', sub: 'Nihilus hungers' }),
    raid_sarlacc: (c) => ({ d: 2400, veil: 'radial-gradient(circle at 50% 60%, rgba(30,12,4,.9), rgba(210,160,90,.85))', extra: '<i class="teeth"></i>', title: 'SWALLOW', sub: 'The pit pulls everything in', shake: true }),
    raid_snoke: (c) => ({ d: 2600, veil: 'radial-gradient(circle at 50% 40%, rgba(90,0,0,.6), rgba(6,0,0,.96))', extra: '<i class="curtain l"></i><i class="curtain r"></i>' + Array.from({ length: 8 }, (_, k) => `<i class="bolt" style="--t:${0.5 + (k % 4) * 0.18}s;transform:rotate(${-70 + k * 20}deg)"></i>`).join(''), title: 'BOW BEFORE ME', sub: 'Supreme Leader Snoke' }),
  };
  const baseSuper = BUI.superMove;
  BUI.superMove = async function (anim, actor, targets, ev) {
    const make = actor && actor.def && CINE[actor.def.raid];
    if (!make) return baseSuper.call(this, anim, actor, targets, ev);
    const r = HN.RAIDS.find((x) => x.id === actor.def.raid);
    const lite = (root.Perf && root.Perf.simpleUlts) || !motion();
    const spec = make(r.color);
    const d = lite ? 1200 : spec.d;
    const node = el(`<div class="hn-cine ${lite ? 'lite' : ''}" style="--d:${d}ms;--c:${r.color}"><div class="veil" style="background:${spec.veil}"></div>${lite ? '' : spec.extra}<div class="boss">${root.Art.unitArt(actor.def)}</div><div class="title"><small>${esc(r.name)}</small>${esc(spec.title)}</div></div>`);
    document.body.appendChild(node);
    sound(actor.def.raid === 'raid_snoke' ? 'lightning' : actor.def.raid === 'raid_sarlacc' ? 'explosion' : 'reveal_legendary');
    if (spec.shake && this.shake) setTimeout(() => this.shake(), d * 0.5);
    await new Promise((res) => setTimeout(res, d / Math.max(1, this.speed > 1 ? this.speed * 0.7 : 1)));
    node.remove();
    return null;
  };

  // ---------- bounty pucks ----------
  const RARS = ['common', 'rare', 'epic', 'legendary', 'mythic'];
  const ODDS = {
    guild: { n: 3, w: { rare: 78, epic: 18, legendary: 4 } },
    elite: { n: 5, w: { rare: 60, epic: 32, legendary: 7, mythic: 1 }, floor: 'epic' },
    high: { n: 6, w: { rare: 40, epic: 45, legendary: 13, mythic: 2 }, floor: 'legendary' },
    legend: { n: 3, w: { epic: 70, legendary: 27, mythic: 3 }, hn: true },
  };
  function rollPuck(tier, target, norm) {
    const t = A.ROSTER[target] || {};
    const gold = t.tier === 'gold';
    const o = ODDS[tier];
    // A bigger bounty tilts the odds toward the rarer cards.
    // ...and the guild's Lucky Pucks upgrade tilts it a little more.
    const boost = (1 + 0.6 * (norm || 0) + (gold ? 0.8 : 0)) * (1 + (HN.guildPerk ? HN.guildPerk('luck') : 0));
    const w = Object.entries(o.w).map(([k, v]) => [k, RARS.indexOf(k) >= 2 ? v * boost : v]);
    const tot = w.reduce((a, [, v]) => a + v, 0);
    const roll = () => { let x = Math.random() * tot; for (const [k, v] of w) { if ((x -= v) < 0) return k; } return w[0][0]; };
    const rars = Array.from({ length: o.n }, roll);
    const floorIdx = (k) => RARS.indexOf(k);
    if (o.floor && !rars.some((k) => floorIdx(k) >= floorIdx(o.floor))) rars[0] = o.floor;
    if (gold && !rars.some((k) => floorIdx(k) >= 3)) rars[rars.length - 1] = 'legendary';
    const bias = t.bias || {};
    const pickOf = (rar) => {
      const base = D.UNITS.filter((u) => !u.exclusive && !u.boss && u.rarity === rar);
      const leaning = base.filter((u) => (!bias.faction || u.faction === bias.faction) && (!bias.trait || D.traitsOf(u.id).includes(bias.trait)));
      const list = leaning.length && Math.random() < 0.45 ? leaning : base;
      return list[Math.floor(Math.random() * list.length)];
    };
    const results = rars.map((rar) => { const u = pickOf(rar) || pickOf('rare'); return { ...HN.grantBase(u.id, Math.random() < 0.04), rarity: u.rarity, hn: false }; });
    // Reward-only cards never come out of pucks.
    const hnPool = HN.HN_IDS.filter((id) => !['hn_pre_vizsla', 'hn_gauntlet', 'hn_krrsantan', 'hn_dark_trooper', 'hn_nite_owl', 'hn_kelleran'].includes(id) && !(D.UNIT_MAP[id] || {}).rewardOnly);
    if (o.hn || (gold && Math.random() < 0.15)) {
      const unowned = hnPool.filter((id) => !HN.owns(id));
      const id = (unowned.length ? unowned : hnPool)[Math.floor(Math.random() * (unowned.length || hnPool.length))];
      results.unshift({ ...HN.grant(id), rarity: D.UNIT_MAP[id].rarity, hn: true });
    }
    // Log the capture; a finished row pays out once.
    const h = S();
    h.captured[target] = (h.captured[target] || 0) + 1;
    h.capRows = h.capRows || {};
    const rowTier = t.tier;
    const row = Object.entries(A.ROSTER).filter(([, v]) => v.tier === rowTier);
    let rowPaid = 0;
    if (!h.capRows[rowTier] && row.every(([k]) => h.captured[k])) { h.capRows[rowTier] = true; rowPaid = CAP_ROWS.find((x) => x[0] === rowTier)[2]; h.beskar += rowPaid; }
    Player.state.stats.packsOpened += 1;
    Player.save();
    return { results, rowPaid, target, first: h.captured[target] === 1 };
  }
  function capture(tier, target, norm) {
    return new Promise((resolve) => {
      const t = A.ROSTER[target];
      const out = rollPuck(tier, target, norm);
      UI.updateWallet();
      const crack = '<svg class="crack" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 0 L46 22 L58 38 L44 56 L56 74 L48 100"/><path d="M46 22 L20 30 M58 38 L84 30 M44 56 L14 64 M56 74 L88 80"/></svg>';
      const tc = { guild: '#5fd8ff', elite: '#c08aff', high: '#ffd23f', legend: '#ff8a4a' }[tier] || '#5fd8ff';
      const node = el(`<div class="hn-capture" role="dialog" aria-label="Bounty capture" style="--tc:${tc}"><div class="stage">
        <div class="pk"><svg viewBox="0 0 100 100">${A.puck(tier, target, { bare: true })}</svg></div>
        <div class="beam"></div>
        <div class="holo"><svg viewBox="30 6 40 48">${A.figure(target, tc)}</svg></div>
        <div class="zap"></div>
        <div class="slab"><svg viewBox="30 6 40 48">${A.figure(target, '#c8d0da')}</svg>${crack}</div>
        <div class="acq">TARGET ACQUIRED<small>${esc(t.name)} · ${fmt(t.bounty)} cr</small></div>
      </div><span class="tap">Tap to skip</span></div>`);
      document.body.appendChild(node);
      sound('zap');
      setTimeout(() => sound('ignite'), 1400);
      setTimeout(() => sound('zap'), 2900);
      setTimeout(() => sound('explosion'), 4300);
      let done = false;
      const end = () => { if (done) return; done = true; node.remove(); reveal(out, t).then(resolve); };
      node.addEventListener('click', end);
      setTimeout(end, motion() ? 4800 : 50);
    });
  }
  // Bounty data: the puck stays on screen and projects each card as a
  // hologram in its tier colour, then a scan line decrypts it to full colour
  // and the result is stamped on. Tap for the next card; collected cards
  // drop into the tray, which becomes the summary at the end.
  const R_COL = { common: '#9aa8bc', rare: '#4fa3ff', epic: '#b77bff', legendary: '#ffb938', mythic: '#ff2a5a', secret: '#e8f0ff' };
  const R_RANK = { common: 0, rare: 1, epic: 2, legendary: 3, mythic: 4, secret: 4 };
  function reveal(out, t) {
    return new Promise((resolve) => {
      const tier = t.tier;
      const tc = { guild: '#5fd8ff', elite: '#c08aff', high: '#ffd23f', legend: '#ff8a4a' }[tier] || '#5fd8ff';
      const res = out.results;
      const node = el(`<div class="hn-bounty" role="dialog" aria-label="Bounty collected" style="--tc:${tc}">
        <div class="hb-top"><p class="eyebrow">${esc(t.name)} · bounty collected${out.first ? ' · new capture' : ''}</p><h2 data-t>Decrypting bounty data…</h2><small data-n></small></div>
        <div class="hb-stage" data-stage></div>
        <div class="hb-tray" data-tray></div>
        <div class="hb-act"><span class="hb-hint" data-hint>Tap the card</span><button type="button" class="btn btn-primary" data-done hidden>Done</button></div>
      </div>`);
      const $ = (q) => node.querySelector(q);
      const puck = `<div class="hb-beam"></div><div class="hb-puck"><svg viewBox="0 0 100 100">${A.puck(tier, out.target || null, { bare: true })}</svg></div>`;
      document.body.appendChild(node);
      let i = -1;
      let ready = false;
      let timer = null;
      const tagOf = (r) => (r.isNew ? 'NEW!' : `+${r.shards || 0} shards`);
      const cardOf = (def, r) => (def.hn ? hnCard(def, { holo: !!r.holo }) : UI.unitCard(def, { tag: 'div', hideShards: true, holo: !!r.holo }));
      const show = () => {
        i += 1;
        const r = res[i];
        const def = D.UNIT_MAP[r.id];
        const rank = R_RANK[def.rarity] || 0;
        const dt = 0.75 + rank * 0.22;
        ready = false;
        $('[data-n]').textContent = res.length > 1 ? `CARD ${i + 1} OF ${res.length}` : '';
        $('[data-t]').textContent = 'Decrypting bounty data…';
        const hv = rank >= 3;
        $('[data-stage]').innerHTML = `<div class="hb-card" style="--rc:${R_COL[def.rarity]};--dt:${dt}s"><span class="glow"></span>${hv ? '<span class="hb-ring"></span>' : ''}${cardOf(def, r)}<span class="hb-tint"></span><span class="hb-sw"><i></i></span><span class="hb-stamp ${r.isNew ? '' : 'dup'}">${tagOf(r)}</span>${hv ? `<span class="hb-hv">${rank >= 4 ? 'MOST WANTED' : 'HIGH-VALUE TARGET'}</span>` : ''}</div>${puck}`;
        const stage = $('[data-stage]');
        stage.className = 'hb-stage';
        stage.style.setProperty('--dt', `${dt}s`);
        stage.style.setProperty('--rc', R_COL[def.rarity]);
        const settle = () => { ready = true; $('[data-t]').textContent = def.name; $('[data-hint]').textContent = i < res.length - 1 ? 'Tap the card for the next one' : 'Tap the card to finish'; };
        if (!motion()) { stage.classList.add('skip'); settle(); return; }
        void stage.offsetWidth;
        stage.classList.add('go');
        if (rank >= 4) stage.classList.add('shake');
        sound('zap');
        $('[data-t]').textContent = 'Signal locked…';
        timer = setTimeout(() => {
          $('[data-t]').textContent = hv ? 'High-value data…' : 'Decrypting bounty data…';
          timer = setTimeout(() => { sound(`reveal_${def.rarity}`); if (hv) sound('ignite'); timer = setTimeout(settle, 700); }, dt * 1000 - 300);
        }, 450);
      };
      const toTray = () => {
        const r = res[i];
        $('[data-tray]').appendChild(el(`<div class="hb-mini" style="--rc:${R_COL[D.UNIT_MAP[r.id].rarity]}"><div class="thumb">${portrait(D.UNIT_MAP[r.id], { plate: false })}</div><div class="full">${cardOf(D.UNIT_MAP[r.id], r)}</div><span class="t ${r.isNew ? 'new' : ''}">${tagOf(r)}</span></div>`));
      };
      const finish = () => {
        node.querySelectorAll('.hb-mini').forEach((n, k) => n.style.setProperty('--k', k));
        node.classList.add('done');
        $('[data-t]').textContent = 'Bounty collected';
        $('[data-n]').textContent = `${res.length} CARD${res.length > 1 ? 'S' : ''}`;
        $('[data-hint]').hidden = true;
        $('[data-done]').hidden = false;
        $('[data-done]').focus();
      };
      node.addEventListener('click', async (e) => {
        if (e.target.closest('[data-done]')) {
          node.remove();
          UI.App.refresh();
          if (out.rowPaid) toast(`Row complete in the Captured log! +${fmt(out.rowPaid)} Beskar`);
          for (const r of res) if (r.isNew && (r.hn || r.rarity === 'mythic')) await UI.walkout(D.UNIT_MAP[r.id], D.UNIT_MAP[r.id].rarity, !!r.holo, { exclusive: r.hn, isNew: true, shards: 0 });
          resolve();
          return;
        }
        if (node.classList.contains('done') || !e.target.closest('[data-stage]')) return;
        // First tap mid-projection finishes it; the next tap moves on.
        if (!ready) { clearTimeout(timer); $('[data-stage]').classList.remove('go'); $('[data-stage]').classList.add('skip'); ready = true; $('[data-t]').textContent = D.UNIT_MAP[res[i].id].name; $('[data-hint]').textContent = i < res.length - 1 ? 'Tap the card for the next one' : 'Tap the card to finish'; return; }
        toTray();
        if (i < res.length - 1) show(); else finish();
      });
      show();
    });
  }
  const pay = (cur, n) => {
    if (cur === 'beskar') { if (S().beskar < n) { toast(`Not enough Beskar: ${fmt(S().beskar)} of ${fmt(n)}. Win arena fights or hit the raid.`); return false; } S().beskar -= n; return true; }
    // Tester sessions spend tester Kyber, never the real balance.
    const k = HN.BETA ? S().kyber : Player.state.crystals;
    if (k < n) { toast(`Not enough Kyber: ${fmt(k)} of ${fmt(n)}.`); return false; }
    if (HN.BETA) S().kyber -= n; else Player.state.crystals -= n;
    return true;
  };
  async function buyPuck(i, render) {
    const b = board();
    const pk = b.pucks[i];
    if (!pk || pk.bought || !pay(pk.cur, pk.price)) return;
    pk.bought = true;
    HN.save();
    await capture(pk.tier, pk.target, pk.norm);
    render();
  }
  async function openFree(render) {
    const h = S();
    const list = (h.freePucks || []).slice();
    h.freePucks = [];
    HN.save();
    for (const tier of list) {
      const roster = Object.entries(A.ROSTER).filter(([, v]) => v.tier === tier);
      const [target] = roster[Math.floor(Math.random() * roster.length)];
      await capture(tier, target, 0.5);
    }
    render();
  }
  function ingot(render) {
    if (S().beskar < 900) return toast(`Not enough Beskar: ${fmt(S().beskar)} of 900.`);
    const list = [...HN.HN_IDS.filter(HN.owns).map((id) => D.UNIT_MAP[id]), ...D.UNITS.filter((u) => Player.owns(u.id))];
    const m = openModal(`<div class="hn-pick-head"><b>Pick a card for 20 shards</b></div><div class="hn-pick" data-noswipe>${list.map((u) => (u.hn ? hnCard(u) : UI.unitCard(u, { tag: 'div' })).replace('class="ucard', `data-pick="${u.id}" class="ucard`)).join('')}</div>`, {});
    m.root.addEventListener('click', (e) => {
      const c = e.target.closest('[data-pick]');
      if (!c) return;
      if (!pay('beskar', 900)) return;
      const id = c.dataset.pick;
      if (HN.card(id)) HN.card(id).shards += 20; else Player.state.units[id].shards += 20;
      HN.save();
      m.close();
      toast(`+20 shards for ${D.UNIT_MAP[id].name}`);
      sound('coins');
      render();
    });
  }
  async function direct(id, render) {
    const x = DIRECT.find((d) => d.id === id);
    if (!x || HN.owns(id) || !pay(x.cur, x.price)) return;
    HN.grant(id);
    HN.save();
    UI.updateWallet();
    render();
    await UI.walkout(D.UNIT_MAP[id], D.UNIT_MAP[id].rarity, false, { exclusive: true, isNew: true, shards: 0 });
  }

  // ---------- tester hooks ----------
  HN.dev = {
    arrive: () => { S().seen = false; HN.save(); arriving = false; if (App.current === 'holonet') App.go('home'); else maybeArrive(); },
    beskar: (n) => { S().beskar += n; HN.save(); },
    rating: (n) => { const h = S(); h.rating = n; h.best = Math.max(h.best, n); const r = HN.claimDivisions(); HN.save(); HN.Net.publish(); return r; },
    raidDmg: (n) => { S().raidBonus = (S().raidBonus || 0) + n; const k = `${HN.week()}:${HN.raidNow().id}`; const h = S(); h.raids[k] = h.raids[k] || { dmg: 0, best: 0, runs: 0, claimed: false }; h.raids[k].dmg += 1; HN.save(); },
    nextBoss: () => { const h = S(); h.weekShift = (h.weekShift || 0) + 1; h.raidBonus = 0; HN.save(); },
    allCards: () => { for (const id of HN.HN_IDS) HN.grant(id); HN.save(); },
    gold: () => { const h = S(); h.forceGold = true; h.board = null; HN.save(); },
    restock: () => { S().board = null; HN.save(); },
    reset: () => { delete Player.state.hn; Player.save(); },
    cine: (id) => BUI.superMove('x', { def: D.UNIT_MAP[id] }, [], {}),
    feat: () => award(FEAT_ON),
    focus,
  };

  // Start once the game has booted (main.js boots on DOMContentLoaded).
  // The HoloNet starts after the game's first screen is up (hn-boot.js), so
  // HoloNet-only mode moves there now.
  const start = () => { syncTab(); if (focus() && ['home', 'collection', 'market', 'campaign', 'squad', 'secret'].includes(App.current) && !App.battleActive) App.go('holonet', {}); setTimeout(maybeArrive, 2500); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(start, 0));
  else start();
})(window);

// Live Duels (tester build only): two testers online at the same time, each
// commanding their own squad, turn by turn.
//
// How it stays in sync: both screens build the exact same battle from the
// same random seed, so every hit, crit and dodge rolls the same way on both.
// Only the moves travel ("card 3 used ability 2 on card 7"); each screen plays
// them out itself. Every move is numbered and re-sent until the other side
// confirms it, so a dropped message never breaks the match.
(function (root) {
  'use strict';
  const D = root.GameData;
  const UI = root.UI;
  const App = UI.App;
  const BUI = root.BattleUI;
  const HN = root.HN;
  const { el, esc, fmt, toast, openModal } = UI;
  const TURN_MS = 45000;
  // Connection drops: both sides ping every few seconds. 13 seconds of silence starts
  // a 45-second reconnect window. The side that's offline sees "Reconnecting",
  // the other sees "Waiting for them"; when the window runs out, whoever went
  // quiet forfeits. Moves are numbered and re-sent until confirmed, so the
  // match picks up exactly where it was once the connection is back.
  const PING_MS = 3000;
  const QUIET_MS = 13000;
  const LINK_MS = 45000;
  // Each duel has a 12-minute clock. When it runs out, the next move ends the
  // match on both screens at the same moment: whoever has dealt more damage
  // wins; dead even is a draw.
  const MATCH_MS = 12 * 60 * 1000;
  const matchMs = () => HN.Duel.matchMs || MATCH_MS; // testers can shorten it

  const Duel = {
    room: null, online: false, peers: [], names: {}, invite: null, pending: null, match: null,
    ready: false,
    status() {
      if (!navigator.onLine) return 'Offline: needs internet';
      if (!this.room) return this.ready ? 'Needs an internet connection' : 'Connecting…';
      const n = this.lobby().length;
      return this.invite ? 'You have a challenge!' : n ? `${n} player${n > 1 ? 's' : ''} online now` : 'Nobody else online';
    },
    invites() { return !!this.invite; },
    myPeer() { const me = this.room && this.room.peers().find((p) => p.sameTab); return me ? me.peer : null; },
    lobby() { const named = HN.Net.db && HN.Net.db.firestore; return this.peers.filter((p) => !p.isMe && p.kind === 'viewer' && p.presence && p.presence.hn && (!named || p.presence.nm)); },
    // Their callsign: sent with every challenge, answer and lobby presence;
    // else whatever the leaderboard knows about them.
    name(p) {
      const id = p && p.by;
      const peer = id && this.peers.find((x) => x.by === id && x.presence && x.presence.nm);
      const sent = cleanNm((p && p.data && p.data.nm) || (p && p.presence && p.presence.nm) || (p && p.nm) || (peer && peer.presence.nm));
      if (sent) return sent;
      if (!id) return 'Player';
      return HN.Net.name(id);
    },
    async lookup(id) {
      this.names[id] = '';
      try { const u = HN.Net.user || (root.claude && await root.claude.use('user')); if (!u || !u.profiles) return; const ps = await u.profiles([id]); this.names[id] = (ps[id] && ps[id].name) || ''; refresh(); } catch (e) { /* names are optional */ }
    },
  };
  HN.Duel = Duel;
  Duel.setPresence = () => setPresence();

  const refresh = () => { const n = document.querySelector('.view.hn'); if (n && n.__live && App.current === 'holonet' && ['duels', 'hub', undefined].includes((App.params || {}).view) && !document.querySelector('.modal-backdrop')) n.__live(); };

  let started = false;
  async function init() {
    if (started) return;
    started = true;
    try {
      if (!root.claude || !root.claude.use) { Duel.ready = true; return; }
      const room = await root.claude.use('room');
      Duel.ready = true;
      if (!room) return refresh();
      Duel.room = room;
      room.onConnection((c) => { Duel.online = c; refresh(); }, () => {});
      room.onPeers((ch) => { Duel.peers = ch.peers.slice(); Duel.peers.forEach((p) => learn(p.by, p.presence && p.presence.nm)); refresh(); if (Duel.match) watchGone(ch); }, () => {});
      room.on('challenge', onChallenge, () => {});
      room.on('answer', onAnswer, () => {});
      setPresence();
      setInterval(setPresence, 15000);
    } catch (e) { Duel.ready = true; }
  }
  function setPresence() {
    if (!Duel.room) return;
    const h = HN.S();
    Duel.room.presence({ hn: HN.ui.unlocked() ? 1 : 0, fr: 1, nm: myNm(), rating: h.rating, g: HN.squadPower(HN.squadEntries('character')), f: HN.squadPower(HN.squadEntries('ship')), busy: Duel.match || Duel.prep ? 1 : 0 }).catch(() => {});
  }
  // My callsign as other players should see it ('' when I haven't picked one).
  const myNm = () => { const n = String(HN.Net.name(HN.Net.me) || ''); return n === 'You' ? '' : n.replace(/ \(you\)$/, ''); };
  function cleanNm(s) { const t = String(s || '').replace(/[^A-Za-z0-9_ .-]/g, '').trim().slice(0, 16); return t && (!HN.safe || HN.safe.ok(t)) ? t : ''; }
  // Callsigns heard in the lobby go into the shared name book, so name chips
  // show them too (not just players already on the leaderboard).
  function learn(id, nm) { const t = cleanNm(nm); if (id && t && HN.Net.names) HN.Net.names[id] = t; }
  const rid = () => Math.random().toString(36).slice(2, 10);

  // ---------- lobby: challenge, bans, squads ----------
  // A duel is set up in steps, all sent as 'answer' messages in the lobby:
  //   challenge → accept ('go') → the challenger bans a card → the other
  //   player bans a different one → both build squads without the banned
  //   cards ('squad') → the fight starts. Either side can back out ('cancel').
  const BAN_MS = 25000;
  const BUILD_MS = 60000;
  const kindName = (k) => (k === 'ship' ? 'Fleet' : 'Ground');
  const poolIds = (kind) => HN.pool(kind).map((u) => u.id);
  const okIds = (a, kind) => (Array.isArray(a) ? a.filter((id) => typeof id === 'string' && D.UNIT_MAP[id] && D.UNIT_MAP[id].kind === kind).slice(0, 300) : []);
  const unitName = (id) => (id && D.UNIT_MAP[id] ? D.UNIT_MAP[id].name : '');
  const say = (to, data) => Duel.room && Duel.room.emit('answer', { to, nm: myNm(), ...data }).catch(() => {});

  function challenge(peer, kind, fr) {
    if (!HN.pool(kind).length) return toast(kind === 'ship' ? 'You need a ship to fly a Fleet duel.' : 'You need a character for a Ground duel.');
    if (!Duel.room) return toast('Lost the HoloNet connection.');
    if (Duel.prep) return toast('Finish setting up your other duel first.');
    const id = rid();
    const seed = 1 + Math.floor(Math.random() * 2e9);
    Duel.pending = { id, peer: peer.peer, by: peer.by, kind, seed, fr: !!fr };
    Duel.room.emit('challenge', { to: peer.peer, id, kind, seed, rating: HN.S().rating, nm: myNm(), pool: poolIds(kind), fr: fr ? 1 : 0 }).catch(() => toast('Could not reach them.'));
    const m = openModal(`<div class="hn-result"><div class="result-title" style="color:#8fe8ff;${fr ? 'font-size:clamp(22px,6vw,34px)' : ''}">${fr ? 'FRIENDLY BATTLE' : 'CHALLENGE SENT'}</div><p style="text-align:center">Waiting for <b>${esc(Duel.name(peer))}</b> to accept a ${kindName(kind)} ${fr ? 'friendly battle' : 'duel'}…</p><div class="modal-actions"><button type="button" class="btn" data-x="cancel">Cancel</button></div></div>`, { small: true, dismissable: false });
    Duel.pending.modal = m;
    Duel.pending.timer = setTimeout(() => { if (Duel.pending && Duel.pending.id === id) { Duel.pending = null; m.close(); toast('No answer. Try again later.'); } }, 30000);
    m.root.addEventListener('click', (e) => {
      if (!e.target.closest('[data-x]')) return;
      const p = Duel.pending;
      if (p && p.id === id) { clearTimeout(p.timer); say(p.peer, { id, step: 'cancel' }); Duel.pending = null; }
      m.close();
    });
  }

  function onChallenge(msg) {
    const d = msg.data || {};
    if (msg.isMe || d.to !== Duel.myPeer() || !d.id || !['character', 'ship'].includes(d.kind)) return;
    // Friendly battles only from friends; ranked duels only once the HoloNet is unlocked.
    if (d.fr ? !(HN.friends && HN.friends.isFriend(msg.by)) : !HN.ui.unlocked()) { say(msg.peer, { id: d.id, step: 'no' }); return; }
    if (Duel.match || App.battleActive || Duel.prep) { say(msg.peer, { id: d.id, step: 'no', busy: true }); return; }
    Duel.invite = { ...d, peer: msg.peer, by: msg.by };
    learn(msg.by, d.nm);
    refresh();
    if (root.Sound) root.Sound.play('reveal_rare');
    const who = Duel.name(msg);
    const m = openModal(`<div class="hn-result" data-invite="${esc(d.id)}">${d.fr ? `<div class="result-title" style="color:#8fe8ff;font-size:clamp(22px,6vw,34px)">FRIENDLY BATTLE</div>
      <p style="text-align:center">Your friend <b>${esc(who)}</b> challenges you to a <b>${kindName(d.kind)}</b> battle.</p>
      <p class="muted small" style="text-align:center;margin:0">You each ban one card, then build your squads. Just for fun: no rating, no rewards.</p>` : `<div class="result-title" style="color:#8fe8ff">LIVE DUEL</div>
      <p style="text-align:center"><b>${esc(who)}</b> (${fmt(d.rating || 0)} rating) challenges you to a <b>${kindName(d.kind)}</b> duel.</p>
      <p class="muted small" style="text-align:center;margin:0">You each ban one card, then build your squads.</p>`}
      <div class="modal-actions"><button type="button" class="btn" data-x="no">Decline</button><button type="button" class="btn btn-primary" data-x="yes">Accept</button></div></div>`, { small: true, dismissable: false });
    Duel.invite.modal = m;
    const timer = setTimeout(() => { m.close(); if (Duel.invite && Duel.invite.id === d.id) Duel.invite = null; refresh(); }, 25000);
    m.root.addEventListener('click', (e) => {
      const x = e.target.closest('[data-x]');
      if (!x) return;
      clearTimeout(timer);
      m.close();
      const inv = Duel.invite;
      Duel.invite = null;
      if (!inv || inv.id !== d.id) return;
      if (x.dataset.x === 'no') { say(inv.peer, { id: inv.id, step: 'no' }); return refresh(); }
      if (!HN.pool(inv.kind).length) { toast(inv.kind === 'ship' ? 'You need a ship for a Fleet duel.' : 'You need a character for a Ground duel.'); say(inv.peer, { id: inv.id, step: 'no' }); return; }
      // Accepting drops any challenge we were still waiting on.
      if (Duel.pending) { const p = Duel.pending; clearTimeout(p.timer); if (p.modal) p.modal.close(); say(p.peer, { id: p.id, step: 'cancel' }); Duel.pending = null; }
      say(inv.peer, { id: inv.id, step: 'go', pool: poolIds(inv.kind), rating: HN.S().rating });
      prep({ id: inv.id, host: false, kind: inv.kind, seed: inv.seed, peer: inv.peer, by: inv.by, who, rating: inv.rating, theirPool: okIds(inv.pool, inv.kind), fr: !!inv.fr });
    });
  }

  function onAnswer(msg) {
    const d = msg.data || {};
    if (msg.isMe || d.to !== Duel.myPeer()) return;
    learn(msg.by, d.nm);
    const step = d.step || (d.cancel ? 'cancel' : d.ok === false ? 'no' : '');
    // They withdrew the challenge before we answered.
    if (step === 'cancel' && Duel.invite && Duel.invite.id === d.id) {
      if (Duel.invite.modal) Duel.invite.modal.close();
      Duel.invite = null; refresh(); toast(`${Duel.name(msg)} cancelled the challenge.`);
      return;
    }
    const P = Duel.prep;
    if (P && P.id === d.id) return prepMsg(P, step, d);
    const p = Duel.pending;
    if (!p || p.id !== d.id) return;
    clearTimeout(p.timer);
    if (p.modal) p.modal.close();
    Duel.pending = null;
    if (step === 'go') {
      // They accepted too late: we're already fighting someone else.
      if (Duel.match || App.battleActive || Duel.prep) { say(msg.peer, { id: p.id, step: 'cancel' }); return; }
      return prep({ id: p.id, host: true, kind: p.kind, seed: p.seed, peer: msg.peer, by: msg.by, who: Duel.name(msg), rating: d.rating, theirPool: okIds(d.pool, p.kind), fr: !!p.fr });
    }
    toast(d.busy ? 'They are busy in another fight.' : 'Challenge declined.');
  }

  // ---------- duel setup: bans, then squads ----------
  // What can be banned: every regular card of this kind (owned by either of
  // you or not), but secret cards only when one of you actually has them;
  // otherwise they don't show up at all.
  const isSecret = (u) => !!(u && (u.exclusive || u.rarity === 'secret'));
  function banList(kind, mine, theirs) {
    const owned = new Set([...mine, ...theirs]);
    const all = [...D.UNITS, ...HN.HN_IDS.map((id) => D.UNIT_MAP[id])].filter((u) => u && u.kind === kind && !u.boss && !u.enemyOnly);
    return [...new Set(all.filter((u) => !isSecret(u) || owned.has(u.id)).map((u) => u.id).concat([...owned].filter((id) => D.UNIT_MAP[id] && D.UNIT_MAP[id].kind === kind)))];
  }
  function prep(cfg) {
    const mine = poolIds(cfg.kind);
    const P = Duel.prep = { ...cfg, bans: [], mine: null, theirs: null, ui: null, wait: null, timer: 0, done: false,
      myCards: new Set(mine), theirCards: new Set(cfg.theirPool),
      list: banList(cfg.kind, mine, cfg.theirPool) };
    setPresence();
    refresh();
    // The challenger bans first.
    if (P.host) myBan(P); else waitFor(P, `<b>${esc(P.who)}</b> is choosing a card to ban…`, BAN_MS + 15000);
  }
  const live = (P) => Duel.prep === P && !P.done;
  function closeWait(P) { clearTimeout(P.timer); if (P.wait) { P.wait.close(); P.wait = null; } }
  function endPrep(P, note) {
    if (P.done) return;
    P.done = true;
    closeWait(P);
    if (P.ui) { const u = P.ui; P.ui = null; u.close(); }
    if (Duel.prep === P) Duel.prep = null;
    if (note) toast(note);
    setPresence();
    refresh();
  }
  const leave = (P, note) => { say(P.peer, { id: P.id, step: 'cancel' }); endPrep(P, note); };
  const banLine = (P) => {
    const b = P.bans.filter(Boolean);
    return b.length ? `<p class="dp-bans">Banned: ${b.map((id) => `<b>${esc(unitName(id))}</b>`).join(' · ')}</p>` : '';
  };
  function waitFor(P, html, ms) {
    closeWait(P);
    P.wait = openModal(`<div class="hn-result dp-wait"><div class="result-title" style="color:#8fe8ff">LIVE DUEL</div>
      <p class="muted small" style="text-align:center;margin:0">${kindName(P.kind)} duel vs <b>${esc(P.who)}</b></p>
      <p style="text-align:center"><span class="ho-spin"></span> ${html}</p>${banLine(P)}
      <div class="modal-actions"><button type="button" class="btn" data-x="leave">Leave duel</button></div></div>`, { small: true, dismissable: false });
    P.wait.root.addEventListener('click', (e) => { if (e.target.closest('[data-x="leave"]')) leave(P, 'You left the duel.'); });
    P.timer = setTimeout(() => { if (live(P)) leave(P, `${P.who} took too long, so the duel was called off.`); }, ms);
  }
  function myBan(P) {
    closeWait(P);
    P.ui = banPick(P, (card) => {
      P.ui = null;
      if (!live(P)) return;
      if (card === false) return leave(P, 'You left the duel.');
      P.bans.push(card || null);
      say(P.peer, { id: P.id, step: 'ban', card: card || '' });
      if (P.bans.length >= 2) return build(P);
      waitFor(P, `<b>${esc(P.who)}</b> is choosing their ban…`, BAN_MS + 15000);
    });
  }
  function prepMsg(P, step, d) {
    if (!live(P)) return;
    if (step === 'cancel' || step === 'no') return endPrep(P, `${P.who} left the duel.`);
    if (step === 'ban') {
      if (P.bans.length >= 2) return;
      const card = typeof d.card === 'string' && D.UNIT_MAP[d.card] && D.UNIT_MAP[d.card].kind === P.kind && !P.bans.includes(d.card) ? d.card : null;
      P.bans.push(card);
      if (card) toast(`${P.who} banned ${unitName(card)}.`);
      // The challenger has both bans now; the other player bans next.
      return P.bans.length >= 2 ? build(P) : myBan(P);
    }
    if (step === 'squad') {
      const sq = Array.isArray(d.squad) ? d.squad.filter((e) => e && D.UNIT_MAP[e.id] && D.UNIT_MAP[e.id].kind === P.kind && !P.bans.includes(e.id)).slice(0, 5) : [];
      if (!sq.length) return leave(P, 'Their squad could not be loaded.');
      P.theirs = sq.map(atDuelLevel);
      if (P.mine) fight(P);
    }
  }
  function build(P) {
    closeWait(P);
    P.ui = buildSquad(P.kind, { who: P.who, role: P.host ? 'challenge' : 'accept', bans: P.bans.filter(Boolean) }, (mine) => {
      P.ui = null;
      if (!live(P)) return;
      if (!mine) return leave(P, 'You left the duel.');
      P.mine = mine;
      say(P.peer, { id: P.id, step: 'squad', squad: mine });
      if (P.theirs) return fight(P);
      waitFor(P, `Waiting for <b>${esc(P.who)}</b> to finish their squad…`, BUILD_MS + 20000);
    });
  }
  function fight(P) {
    const cfg = { id: P.id, host: P.host, kind: P.kind, seed: P.seed, mine: P.mine, theirs: P.theirs, peer: P.peer, by: P.by, name: P.who, oppRating: +P.rating || 800, bans: P.bans.filter(Boolean), fr: !!P.fr };
    endPrep(P);
    start(cfg);
  }

  // The ban: one card neither player can use this duel. The list is every
  // card either of you could bring.
  function banPick(P, done) {
    // Sort and filter, so the card you're after is easy to find.
    const stat = (id) => D.unitStats(D.UNIT_MAP[id], DUEL_LEVEL, DUEL_STARS);
    const rarW = (id) => (D.RARITIES[D.UNIT_MAP[id].rarity] || {}).weight || 0;
    const SORTS = {
      power: ['Strongest', (a, b) => duelPow(b) - duelPow(a)],
      rarity: ['Rarity', (a, b) => rarW(b) - rarW(a) || duelPow(b) - duelPow(a)],
      atk: ['Damage', (a, b) => stat(b).atk - stat(a).atk],
      hp: ['Health', (a, b) => stat(b).hp - stat(a).hp],
      def: ['Defense', (a, b) => stat(b).def - stat(a).def],
      spd: ['Speed', (a, b) => stat(b).spd - stat(a).spd],
      name: ['Name', (a, b) => unitName(a).localeCompare(unitName(b))],
    };
    const ROLES = ['attacker', 'tank', 'support', 'healer'].filter((r) => P.list.some((id) => D.UNIT_MAP[id].role === r));
    const ROLE_NAME = { attacker: 'Attackers', tank: 'Tanks', support: 'Support', healer: 'Healers' };
    const OWNERS = [['all', 'Everyone'], ['you', 'Yours'], ['them', 'Theirs']];
    let sortBy = banPick.sortBy || 'power';
    let role = 'all';
    let owner = 'all';
    const shown = () => P.list
      .filter((id) => role === 'all' || D.UNIT_MAP[id].role === role)
      .filter((id) => owner === 'all' || (owner === 'you' ? P.myCards.has(id) : P.theirCards.has(id)))
      .sort((a, b) => SORTS[sortBy][1](a, b) || unitName(a).localeCompare(unitName(b)));
    const short = (n) => (n >= 10000 ? `${Math.round(n / 1000)}k` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));
    const statLine = (id) => {
      const st = stat(id);
      const bit = (k, icon, v) => `<i class="${sortBy === k ? 'hot' : ''}" title="${SORTS[k][0]}">${icon}${short(v)}</i>`;
      return `<span class="dp-st">${bit('atk', '⚔', st.atk)}${bit('hp', '♥', st.hp)}${bit('def', '⛨', st.def)}${bit('spd', '»', st.spd)}</span>`;
    };
    const first = P.bans.length === 0;
    const taken = P.bans.filter(Boolean);
    let sel = null;
    let left = Math.round(BAN_MS / 1000);
    let finished = false;
    const whose = (id) => (P.myCards.has(id) && P.theirCards.has(id) ? 'Both' : P.myCards.has(id) ? 'You' : P.theirCards.has(id) ? 'Them' : 'Neither');
    const card = (id) => {
      const out = taken.includes(id);
      return `<div class="dp-cell">${UI.unitCard(D.UNIT_MAP[id], { tag: 'div', hideShards: true, owned: true, level: DUEL_LEVEL, stars: DUEL_STARS, badge: out ? 'BANNED' : whose(id) })
        .replace('class="ucard', `data-ban="${id}" class="ucard ${out ? 'is-banned' : ''} ${sel === id ? 'ban-sel' : ''} ${whose(id) === 'Neither' ? 'nobody' : ''}`)}${statLine(id)}</div>`;
    };
    const tools = () => `<div class="dp-tools" data-noswipe>
        <label class="dp-sort">Sort <select data-sort>${Object.entries(SORTS).map(([k, [n]]) => `<option value="${k}" ${k === sortBy ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
        <div class="dp-chips">${[['all', 'All classes'], ...ROLES.map((r) => [r, `${D.ROLE_ICONS[r] || ''} ${ROLE_NAME[r]}`])].map(([k, n]) => `<button type="button" class="${k === role ? 'on' : ''}" data-role="${k}">${n}</button>`).join('')}</div>
        <div class="dp-chips">${OWNERS.map(([k, n]) => `<button type="button" class="${k === owner ? 'on' : ''}" data-owner="${k}">${n}</button>`).join('')}</div>
      </div>`;
    const grid = () => { const ids = shown(); return ids.length ? ids.map(card).join('') : '<p class="muted small">No cards match these filters.</p>'; };
    const m = openModal(`<div class="db dp-ban">
      <div class="db-head"><div><p class="eyebrow">Live duel · vs ${esc(P.who)}</p><h2>Ban a card</h2></div><span class="db-time" data-time>${left}s</span></div>
      <p class="db-note">${first ? `You ban first, then <b>${esc(P.who)}</b> bans a different card.` : `<b>${esc(P.who)}</b> banned <b>${esc(unitName(taken[0]) || 'nothing')}</b>. Now pick yours.`} Banned cards can't be used by either of you this duel. Tags show who owns each card; stats are at duel level.</p>
      ${tools()}
      <div class="hn-pick db-pick dp-grid" data-noswipe data-grid>${grid()}</div>
      <div class="db-foot"><button type="button" class="btn" data-x="leave">Leave duel</button><button type="button" class="btn btn-primary dp-go" data-x="ban" disabled>Pick a card to ban</button></div></div>`, { dismissable: false });
    m.root.querySelector('.modal')?.classList.add('db-modal');
    const $ = (q) => m.root.querySelector(q);
    const finish = (v) => { if (finished) return; finished = true; clearInterval(tick); m.close(); done(v); };
    const tick = setInterval(() => {
      left -= 1;
      const t = $('[data-time]'); if (t) { t.textContent = `${Math.max(0, left)}s`; t.classList.toggle('low', left <= 8); }
      // Out of time: whatever you'd picked is banned (or nothing).
      if (left <= 0) finish(sel);
    }, 1000);
    const regrid = () => { m.root.querySelector('[data-grid]').innerHTML = grid(); m.root.querySelector('.dp-tools').outerHTML = tools(); };
    m.root.addEventListener('change', (e) => { if (e.target.matches('[data-sort]')) { sortBy = banPick.sortBy = e.target.value; regrid(); } });
    m.root.addEventListener('click', (e) => {
      const rb = e.target.closest('[data-role]'); if (rb) { role = rb.dataset.role; return regrid(); }
      const ob = e.target.closest('[data-owner]'); if (ob) { owner = ob.dataset.owner; return regrid(); }
      const c = e.target.closest('[data-ban]');
      if (c) {
        const id = c.dataset.ban;
        if (taken.includes(id)) return toast('That card is already banned.');
        sel = sel === id ? null : id;
        m.root.querySelectorAll('[data-ban]').forEach((n) => n.classList.toggle('ban-sel', n.dataset.ban === sel));
        const b = $('[data-x="ban"]'); b.disabled = !sel; b.textContent = sel ? `Ban ${unitName(sel)}` : 'Pick a card to ban';
        return;
      }
      const x = e.target.closest('[data-x]');
      if (!x) return;
      if (x.dataset.x === 'leave') return finish(false);
      if (x.dataset.x === 'ban' && sel) finish(sel);
    });
    return { close: () => finish(false) };
  }

  // ---------- duel squads ----------
  // Before every duel you build the squad you'll take in, and every card
  // fights at the same level and stars, so the better team wins, not the
  // bigger collection.
  const DUEL_LEVEL = 20;
  const DUEL_STARS = 3;
  const atDuelLevel = (e) => ({ id: e.id, level: DUEL_LEVEL, stars: DUEL_STARS });
  Duel.LEVEL = DUEL_LEVEL; Duel.STARS = DUEL_STARS;
  const duelPow = (id) => D.power(D.UNIT_MAP[id], DUEL_LEVEL, DUEL_STARS);
  function buildSquad(kind, opt, done) {
    const h = HN.S();
    h.duelSquads = h.duelSquads || {};
    const bans = opt.bans || [];
    const list = HN.pool(kind).filter((u) => !bans.includes(u.id)).sort((x, y) => duelPow(y.id) - duelPow(x.id) || x.name.localeCompare(y.name));
    if (!list.length) { toast('Every card you have for this duel is banned.'); setTimeout(() => done(null), 0); return { close() {} }; }
    const need = Math.min(5, list.length);
    const have = (id) => list.some((u) => u.id === id);
    let sel = (h.duelSquads[kind] || HN.squad(kind)).filter(have).slice(0, 5);
    const label = kind === 'ship' ? 'Fleet' : 'Ground';
    let left = Math.round(BUILD_MS / 1000);
    let finished = false;
    const slot = (id) => id ? `<button type="button" class="db-slot on" data-rm="${id}" aria-label="Remove ${esc(D.UNIT_MAP[id].name)}">${HN.ui.mini(id)}<small>${esc(D.UNIT_MAP[id].name)}</small></button>` : '<span class="db-slot"><i></i><small>Empty</small></span>';
    const slots = () => Array.from({ length: 5 }, (_, i) => slot(sel[i])).join('');
    const card = (u) => UI.unitCard(u, { tag: 'div', hideShards: true, owned: true, level: DUEL_LEVEL, stars: DUEL_STARS, selected: sel.includes(u.id) }).replace('class="ucard', `data-pick="${u.id}" class="ucard`);
    const m = openModal(`<div class="db">
      <div class="db-head"><div><p class="eyebrow">${opt.role === 'accept' ? 'Duel accepted' : 'Live duel'} · vs ${esc(opt.who || 'Player')}</p><h2>Build your ${label} squad</h2></div><span class="db-time" data-time>${left}s</span></div>
      <p class="db-note">Every card fights at <b>Level ${DUEL_LEVEL} ★${DUEL_STARS}</b> in duels, so pick your best team, not just your highest levels.</p>
      ${bans.length ? `<p class="dp-bans">Banned this duel: ${bans.map((id) => `<b>${esc(unitName(id))}</b>`).join(' · ')}</p>` : ''}
      <div class="db-slots" data-slots>${slots()}</div>
      <div class="hn-pick db-pick" data-noswipe data-grid>${list.map(card).join('')}</div>
      <div class="db-foot"><button type="button" class="btn" data-x="cancel">${opt.role === 'accept' ? 'Back out' : 'Cancel'}</button><button type="button" class="btn" data-x="best">Best ${need}</button><button type="button" class="btn btn-primary" data-x="go">Confirm squad <span data-n>${sel.length}/${need}</span></button></div></div>`, { dismissable: false });
    m.root.querySelector('.modal')?.classList.add('db-modal');
    const $ = (q) => m.root.querySelector(q);
    const sync = () => {
      $('[data-slots]').innerHTML = slots();
      m.root.querySelectorAll('[data-pick]').forEach((n) => n.classList.toggle('selected', sel.includes(n.dataset.pick)));
      $('[data-n]').textContent = `${sel.length}/${need}`;
      $('[data-x="go"]').disabled = sel.length < need;
    };
    sync();
    const finish = (out) => {
      if (finished) return;
      finished = true; clearInterval(tick); m.close();
      if (out) { h.duelSquads[kind] = out.slice(); HN.save(); }
      done(out ? out.map((id) => ({ id, level: DUEL_LEVEL, stars: DUEL_STARS })) : null);
    };
    // Time's up: fill the empty spots with your best cards and go.
    const fill = () => { for (const u of list) { if (sel.length >= need) break; if (!sel.includes(u.id)) sel.push(u.id); } };
    const tick = setInterval(() => {
      left -= 1;
      const t = $('[data-time]'); if (t) { t.textContent = `${Math.max(0, left)}s`; t.classList.toggle('low', left <= 10); }
      if (left <= 0) { fill(); finish(sel.slice()); }
    }, 1000);
    m.root.addEventListener('click', (e) => {
      const r = e.target.closest('[data-rm]'); if (r) { sel = sel.filter((x) => x !== r.dataset.rm); return sync(); }
      const c = e.target.closest('[data-pick]');
      if (c) { const id = c.dataset.pick; if (sel.includes(id)) sel = sel.filter((x) => x !== id); else if (sel.length < 5) sel = [...sel, id]; else toast('Your squad is full. Tap a card in it to swap it out.'); return sync(); }
      const x = e.target.closest('[data-x]');
      if (!x) return;
      if (x.dataset.x === 'best') { sel = list.slice(0, need).map((u) => u.id); return sync(); }
      if (x.dataset.x === 'cancel') return finish(null);
      if (x.dataset.x === 'go' && sel.length >= need) finish(sel.slice());
    });
    return { close: () => finish(null) };
  }

  // ---------- the match ----------
  async function start(cfg) {
    let room;
    try { room = await Duel.room.join(`duel-${cfg.id}`); } catch (e) { return toast('Could not open the duel room.'); }
    const M = Duel.match = { ...cfg, room, turn: 0, out: {}, inbox: {}, lastIn: 0, waiter: null, ended: false, desync: false, gone: null, timers: [], seenAt: Date.now(), lastTick: Date.now(), away: 0, lost: null, startAt: Date.now(), warned: false };
    try { localStorage.setItem('hn-duel-live', JSON.stringify({ id: cfg.id, name: cfg.name, at: Date.now(), fr: cfg.fr ? 1 : 0 })); } catch (e) { /* ignore */ }
    room.on('ping', (msg) => { if (msg.isMe) return; M.seenAt = Date.now(); room.emit('pong', {}).catch(() => {}); }, () => {});
    room.on('pong', (msg) => { if (!msg.isMe) M.seenAt = Date.now(); }, () => {});
    room.on('move', (msg) => {
      if (msg.isMe) return;
      M.seenAt = Date.now();
      const d = msg.data || {};
      room.emit('ack', { seq: d.seq }).catch(() => {});
      if (!(d.seq > M.lastIn)) return;
      M.inbox[d.seq] = d;
      while (M.inbox[M.lastIn + 1]) M.lastIn += 1;
      if (M.waiter && M.inbox[M.waiter.seq]) { const w = M.waiter; M.waiter = null; w.resolve(M.inbox[w.seq]); }
    }, () => {});
    room.on('ack', (msg) => { if (!msg.isMe) { M.seenAt = Date.now(); delete M.out[(msg.data || {}).seq]; } }, () => {});
    room.on('bye', (msg) => { if (!msg.isMe && !M.ended) { M.byeFrom = true; if (M.waiter) { const w = M.waiter; M.waiter = null; w.resolve(null); } else forfeitWin(); } }, () => {});
    // Re-send anything not yet confirmed.
    M.timers.push(setInterval(() => { for (const d of Object.values(M.out)) room.emit('move', d).catch(() => {}); }, 1500));
    M.timers.push(setInterval(() => { room.emit('ping', {}).catch(() => {}); checkLink(M); }, PING_MS));
    M.timers.push(setInterval(() => clock(M), 1000));
    setPresence();
    // Both screens build the same battle: the challenger's squad is always
    // listed first, so turn order and every roll match.
    const rng = HN.rng(cfg.seed);
    HN.B.back = cfg.fr ? { friends: true } : { view: 'duels' };
    HN.hnStart({ type: 'hn', hn: 'duel', kind: cfg.kind }, cfg.mine.map(atDuelLevel), cfg.theirs.map(atDuelLevel), {
      name: `${cfg.fr ? 'Friendly Battle' : 'Live Duel'} · vs ${cfg.name}`, kind: cfg.kind, planet: cfg.kind === 'ship' ? 'coruscant' : 'geonosis', rng,
      intro: `${cfg.fr ? 'Friendly battle (unranked, no rewards)' : 'Live'}: every card fights at Level ${DUEL_LEVEL} ★${DUEL_STARS}.${(cfg.bans || []).length ? ` Banned: ${cfg.bans.map(unitName).join(' and ')}.` : ''} You play your squad, they play theirs. 45 seconds per move.`,
      setup(b) {
        b.duel = M;
        for (const u of b.units) {
          const hostSide = cfg.host ? u.side === 'player' : u.side === 'enemy';
          u.canon = (hostSide ? 0 : 100) + u.index;
          const stagger = Math.min(40, u.index * 3 + (u.side === 'player' ? 5 : 0));
          const extra = u.tm - stagger;
          u.tm = Math.min(99, Math.min(40, u.index * 3 + (hostSide ? 5 : 0)) + extra);
        }
        // Auto-pick must never touch the shared dice.
        const pick = b.chooseAction.bind(b);
        b.chooseAction = (unit) => { const keep = b.rng; b.rng = Math.random; try { return pick(unit); } finally { b.rng = keep; } };
      },
    });
  }
  // Ties in turn order break the same way on both screens.
  const BP = root.Battle.prototype;
  if (!BP.__duel) {
    BP.__duel = true;
    const baseAdvance = BP.advance;
    BP.advance = function () {
      if (!this.duel) return baseAdvance.call(this);
      const alive = this.units.filter((u) => u.alive).sort((x, y) => x.canon - y.canon);
      if (!alive.length) return null;
      let best = null;
      let bestTime = Infinity;
      for (const u of alive) {
        const t = Math.max(0, 100 - u.tm) / u.spd;
        if (t < bestTime - 1e-9 || (Math.abs(t - bestTime) < 1e-9 && u.spd > best.spd)) { best = u; bestTime = t; }
      }
      for (const u of alive) u.tm += u.spd * bestTime;
      best.tm = 100;
      this.turnCount++;
      return best;
    };
  }
  const byCanon = (b, c) => b.units.find((u) => u.canon === c);
  const hash = (b) => b.units.slice().sort((x, y) => x.canon - y.canon).map((u) => `${u.canon}:${u.hp}:${Math.round(u.tm)}`).join('|');
  function waitMove(M, seq) {
    if (M.inbox[seq]) return Promise.resolve(M.inbox[seq]);
    return new Promise((resolve) => { M.waiter = { seq, resolve }; });
  }
  function send(M, d) { M.out[d.seq] = d; M.room.emit('move', d).catch(() => {}); }
  // The room saw them leave: start the reconnect window right away.
  function watchGone(ch) {
    const M = Duel.match;
    if (!M || M.ended) return;
    if (ch.left.some((p) => p.peer === M.peer)) M.seenAt = Math.min(M.seenAt, Date.now() - QUIET_MS);
  }
  const mmss = (ms) => { const t = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
  // The match clock, top right of the battlefield.
  function clock(M) {
    if (M.ended || !BUI.field || !(BUI.battle && BUI.battle.duel === M)) return;
    let n = BUI.field.querySelector('.hn-clock');
    if (!n) { n = el('<div class="hn-clock" aria-label="Match time left"></div>'); BUI.field.appendChild(n); }
    const left = matchMs() - (Date.now() - M.startAt);
    n.textContent = left > 0 ? mmss(left) : 'Time up';
    n.classList.toggle('low', left < 60000);
    if (left < 60000 && !M.warned) { M.warned = true; BUI.log('One minute left! When time runs out, whoever has dealt more damage wins.', 'hazard'); }
  }
  // Damage dealt by each side, read straight from the battle so both screens agree.
  const dealt = (b, side) => b.units.filter((u) => u.side !== side).reduce((a, u) => a + Math.max(0, u.maxHp - Math.max(0, u.hp)), 0);
  function endByTime(ui, b, M) {
    const mine = dealt(b, 'player');
    const theirs = dealt(b, 'enemy');
    M.result = mine > theirs ? 'win' : mine < theirs ? 'loss' : 'draw';
    M.dealt = { mine, theirs };
    ui.log(`Time's up! You dealt ${fmt(mine)} damage, ${M.name} dealt ${fmt(theirs)}.`, 'ult');
    return ui.finish(M.result === 'win' ? 'player' : 'enemy');
  }
  function checkLink(M) {
    if (M.ended || Duel.match !== M) return;
    const now = Date.now();
    // A long gap between our own ticks means this screen was asleep (phone
    // locked, app switched): that silence was ours, so don't blame them for it.
    const gap = now - M.lastTick;
    M.lastTick = now;
    if (gap > PING_MS * 2) { M.away += gap; M.seenAt = Math.max(M.seenAt, now - PING_MS); if (M.away >= LINK_MS) return loseByDisconnect(M); }
    const meOff = (typeof navigator !== 'undefined' && navigator.onLine === false) || Duel.online === false;
    const quiet = now - M.seenAt;
    if (quiet < QUIET_MS && !meOff) {
      if (M.lost) { M.lost = null; M.away = 0; linkBox(M, ''); if (BUI.battle && BUI.battle.duel === M) BUI.log('Connection restored. The duel continues.', 'heal'); }
      return;
    }
    if (!M.lost) { M.lost = { at: now, me: meOff }; if (BUI.battle && BUI.battle.duel === M) BUI.log(meOff ? 'You lost connection. Reconnecting…' : `${M.name} lost connection.`, 'hazard'); }
    M.lost.me = meOff;
    const left = LINK_MS - (now - M.lost.at);
    linkBox(M, meOff ? `Connection lost · reconnecting ${mmss(left)}` : `${M.name} lost connection · waiting ${mmss(left)}`, meOff ? 'me' : 'them');
    if (left > 0) return;
    if (meOff) loseByDisconnect(M); else forfeitWinNow(M);
  }
  function linkBox(M, text, who) {
    const host = BUI.field;
    if (!host) return;
    let n = host.querySelector('.hn-link');
    if (!text) { if (n) n.remove(); return; }
    if (!n) { n = el('<div class="hn-link" role="status"><span class="sp"></span><b></b><small></small></div>'); host.appendChild(n); }
    n.dataset.who = who || '';
    n.querySelector('b').textContent = text;
    n.querySelector('small').textContent = who === 'me' ? 'Your moves are saved and sent the moment you\'re back.' : 'If they don\'t come back in time, you win.';
  }
  function forfeitWinNow(M) {
    linkBox(M, '');
    if (M.waiter) { const w = M.waiter; M.waiter = null; w.resolve(null); } else forfeitWin();
  }
  function loseByDisconnect(M) {
    if (M.ended) return;
    linkBox(M, '');
    M.room.emit('bye', {}).catch(() => {});
    if (BUI.battle && BUI.battle.duel === M && !BUI.ended) { BUI.log('You were disconnected for too long. The duel is forfeited.', 'hazard'); M.dropped = true; if (M.waiter) { const w = M.waiter; M.waiter = null; w.resolve({ dropped: true }); } else BUI.finish('enemy'); }
  }
  function cleanup(M) {
    M.ended = true;
    try { localStorage.removeItem('hn-duel-live'); } catch (e) { /* ignore */ }
    linkBox(M, '');
    M.timers.forEach(clearInterval);
    if (M.gone) clearTimeout(M.gone);
    setTimeout(() => M.room.leave().catch(() => {}), 2500);
    if (Duel.match === M) Duel.match = null;
    setPresence();
  }
  function forfeitWin() {
    const M = Duel.match;
    if (!M || M.ended) return;
    if (BUI.battle && BUI.battle.duel === M && !BUI.ended) { BUI.log(`${M.name} left the duel. You win!`, 'ult'); BUI.finish('player'); }
  }
  // Ranked: the same rating maths as the arena, against the real player's rating.
  function rate(M, won) {
    const h = HN.S();
    const opp = Math.max(0, Math.min(4000, (M && M.oppRating) || 800));
    const e = 1 / (1 + 10 ** ((opp - h.rating) / 400));
    const delta = won ? Math.max(6, Math.round(36 * (1 - e))) : -Math.max(4, Math.round(28 * e));
    const before = HN.divOf(h.rating);
    h.rating = Math.max(0, h.rating + delta);
    h.best = Math.max(h.best, h.rating);
    const rewards = HN.claimDivisions();
    if (HN.social) { if (won) HN.social.addGP(15); HN.social.trackSeasonBest(); }
    return { delta, before, after: HN.divOf(h.rating), rewards };
  }
  Duel.forfeit = () => {
    const M = Duel.match;
    if (!M) return;
    M.room.emit('bye', {}).catch(() => {});
    // Friendly battles: leaving costs nothing.
    if (M.fr) { cleanup(M); return; }
    const h = HN.S();
    h.duels = h.duels || { w: 0, l: 0 };
    h.duels.l += 1;
    rate(M, false);
    HN.save();
    HN.Net.publish();
    cleanup(M);
  };

  // Duel balance. Reflect (Mace Windu's rebound) could stay up almost all
  // the time against a real player, so in live duels: Reflect lasts 1 turn at
  // most, Vaapad Guard comes every third turn instead of every other, and
  // reflected attacks are split: half bounces back, half still lands.
  const BPD = root.Battle && root.Battle.prototype;
  if (BPD && !BPD.__duelRules) {
    BPD.__duelRules = true;
    const capReflect = (b) => { for (const u of b.units) if (u.statuses && u.statuses.reflect > 1) u.statuses.reflect = 1; };
    const dBegin = BPD.beginTurn;
    BPD.beginTurn = function (unit) {
      if (this.duel && unit && unit.def && unit.def.xqReflect) {
        unit.__dt = (unit.__dt || 0) + 1;
        unit.__xt = unit.__dt % 3 === 0 ? 1 : 0;
      }
      const out = dBegin.apply(this, arguments);
      if (this.duel) capReflect(this);
      return out;
    };
    const dEffect = BPD.applyEffect;
    BPD.applyEffect = function () {
      const r = dEffect.apply(this, arguments);
      if (this.duel) capReflect(this);
      return r;
    };
    const dDamage = BPD.applyDamage;
    BPD.applyDamage = function (target, amount, crit, events, source) {
      const rf = this.__rf;
      if (this.duel && rf && target === rf.from && source !== 'reflect' && rf.to && rf.to.alive) {
        const back = Math.round(amount / 2);
        this.__rf = null;
        try { dDamage.call(this, target, amount - back, crit, events, source); } finally { this.__rf = rf; }
        if (!target.alive) return;
        return dDamage.call(this, target, back, crit, events, source);
      }
      return dDamage.apply(this, arguments);
    };
  }

  const baseAuto = BUI.toggleAuto;
  BUI.toggleAuto = function () { if (this.battle && this.battle.duel) return toast('Auto is off in live duels.'); return baseAuto.call(this); };

  // A live turn loop in place of the usual one.
  const baseLoop = BUI.loop;
  BUI.loop = async function () {
    const b = this.battle;
    if (!b || !b.duel) return baseLoop.call(this);
    const M = b.duel;
    const stale = () => this.ended || this.battle !== b;
    const waitBox = el('<div class="hn-wait-box" role="status"></div>');
    this.field.appendChild(waitBox);
    const say = (t) => { waitBox.textContent = t; waitBox.hidden = !t; };
    say('');
    // No Auto in live duels: you play every move yourself.
    const ab = this.view && this.view.querySelector('[data-auto]'); if (ab) ab.remove();
    while (!stale()) {
      const w = b.winner();
      if (w) { say(''); return this.finish(w); }
      const actor = b.advance();
      if (!actor) return this.finish(b.winner() || 'enemy');
      this.setActive(actor);
      this.turnFlourish(actor);
      this.updateTurnOrder();
      this.updateAll();
      const { events, skipped } = b.beginTurn(actor);
      await this.play(events);
      if (stale()) return;
      if (skipped || b.winner()) continue;
      const seq = ++M.turn;
      let action;
      if (actor.side === 'player') {
        const before = hash(b);
        let left = TURN_MS / 1000;
        say(`Your move · ${left}s`);
        const tick = setInterval(() => {
          left = Math.max(0, left - 1);
          say(`Your move · ${left}s`);
          if (left === 0) { clearInterval(tick); if (this.pending) this.resolvePending(b.chooseAction(actor)); }
        }, 1000);
        action = await this.awaitPlayer(actor);
        clearInterval(tick);
        say('');
        if (stale() || !action) return;
        const tgt = action.targetUid ? b.get(action.targetUid) : null;
        action.tl = Date.now() - M.startAt >= matchMs() ? 1 : 0;
        send(M, { seq, a: actor.canon, i: action.abilityIndex, t: tgt ? tgt.canon : null, h: before, tl: action.tl });
      } else {
        this.renderActions(actor);
        say(`Waiting for ${M.name}…`);
        const before = hash(b);
        const d = await waitMove(M, seq);
        say('');
        if (stale()) return;
        if (d && d.dropped) return this.finish('enemy');
        if (!d) { this.log(`${M.name} left the duel. You win!`, 'ult'); return this.finish('player'); }
        if (d.a !== actor.canon) { M.desync = true; this.log('⚠ Out of sync with your opponent.', 'hazard'); }
        if (d.h && d.h !== before && !M.desync) { M.desync = true; this.log('⚠ Out of sync with your opponent.', 'hazard'); }
        const tgt = d.t != null ? byCanon(b, d.t) : null;
        action = { abilityIndex: d.i, targetUid: tgt ? tgt.uid : null, tl: d.tl ? 1 : 0 };
        if (!b.isReady(actor, action.abilityIndex)) action.abilityIndex = 0;
        if (b.needsTarget(actor, action.abilityIndex) && !b.validTargets(actor, action.abilityIndex).some((u) => u.uid === action.targetUid)) {
          const v = b.validTargets(actor, action.abilityIndex);
          action.targetUid = v.length ? v[0].uid : null;
        }
      }
      this.renderActions(actor);
      const evs = b.act(actor, action.abilityIndex, action.targetUid);
      await this.play(evs);
      if (stale()) return;
      // The move that came after the clock ran out ends the match, on both screens.
      if (action.tl && !b.winner()) return endByTime(this, b, M);
    }
  };

  HN.duelDone = (p, won) => {
    const M = Duel.match;
    if (M && M.fr) return friendlyDone(M, won);
    const h = HN.S();
    h.duels = h.duels || { w: 0, l: 0 };
    const draw = !!(M && M.result === 'draw');
    if (draw) h.duels.d = (h.duels.d || 0) + 1; else if (won) h.duels.w += 1; else h.duels.l += 1;
    const bes = draw ? 30 : won ? 60 : 15;
    h.beskar += bes;
    const rr = draw ? { delta: 0, after: HN.divOf(h.rating), rewards: [] } : rate(M, won);
    const timeNote = M && M.dealt ? `<p style="text-align:center" class="muted">Time ran out · damage dealt ${fmt(M.dealt.mine)} to ${fmt(M.dealt.theirs)}</p>` : '';
    HN.save();
    HN.Net.publish();
    const name = M ? M.name : 'your opponent';
    if (M) cleanup(M);
    const m = openModal(`<div class="hn-result"><div class="result-title ${draw ? '' : won ? 'win' : 'lose'}">${draw ? 'DRAW' : won ? 'VICTORY' : 'DEFEAT'}</div>
      <p style="text-align:center">Live duel against <b>${esc(name)}</b></p>${timeNote}
      <div class="big-num" style="color:${rr.delta >= 0 ? '#7af0a0' : '#ff7a7a'}">${rr.delta >= 0 ? '+' : ''}${rr.delta} rating</div>
      <div class="rows"><div><span>Rating</span><b>${fmt(h.rating)} · ${esc(rr.after.name)}</b></div><div><span>Beskar</span><b>${HN.ui.bes(bes)}</b></div><div><span>Duel record</span><b>${h.duels.w} W · ${h.duels.l} L${h.duels.d ? ` · ${h.duels.d} D` : ''}</b></div>${won && HN.social ? '<div><span>Guild points</span><b>+15</b></div>' : ''}</div>
      ${rr.rewards.filter((x) => x.type === 'div').map((x) => `<p style="text-align:center"><b>${esc(x.div.name)} reached!</b> ${HN.ui.bes(x.beskar)}</p>`).join('')}
      <div class="modal-actions"><button type="button" class="btn btn-primary" data-r="ok">Back to the lobby</button></div></div>`, { small: true, dismissable: false, cls: 'result-modal' });
    m.root.addEventListener('click', (e) => { if (e.target.closest('[data-r]')) { m.close(); HN.ui.go('duels'); } });
  };

  // Friendly battles: the result, and nothing else changes.
  function friendlyDone(M, won) {
    const draw = M.result === 'draw';
    const timeNote = M.dealt ? `<p style="text-align:center" class="muted">Time ran out · damage dealt ${fmt(M.dealt.mine)} to ${fmt(M.dealt.theirs)}</p>` : '';
    const name = M.name;
    cleanup(M);
    const m = openModal(`<div class="hn-result"><div class="result-title ${draw ? '' : won ? 'win' : 'lose'}">${draw ? 'DRAW' : won ? 'VICTORY' : 'DEFEAT'}</div>
      <p style="text-align:center">Friendly battle against <b>${esc(name)}</b></p>${timeNote}
      <p class="muted small" style="text-align:center">Just for fun: no rating, rewards or records change.</p>
      <div class="modal-actions"><button type="button" class="btn" data-r="home">Done</button><button type="button" class="btn btn-primary" data-r="friends">Back to Friends</button></div></div>`, { small: true, dismissable: false, cls: 'result-modal' });
    m.root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-r]');
      if (!b) return;
      m.close();
      App.go('home');
      if (b.dataset.r === 'friends' && HN.friends) setTimeout(() => HN.friends.open(), 250);
    });
  }
  Duel.challengeFriend = (peer, kind) => challenge(peer, kind, true);

  // ---------- the lobby screen ----------
  HN.VIEWS.duels = () => {
    const h = HN.S();
    const rec = h.duels || { w: 0, l: 0 };
    const off = !navigator.onLine;
    const list = Duel.lobby();
    const body = off ? '<div class="hn-free"><span class="grow"><b>You\'re offline.</b> Live Duels need an internet connection. Everything else in the HoloNet still works.</span></div>'
      : !Duel.room ? `<div class="hn-free"><span class="grow">${Duel.ready ? '<b>Live Duels can\'t connect.</b> Check your internet connection.' : 'Connecting…'}</span></div>`
        : list.length ? `<div class="hn-opps">${list.map((p) => { const pr = p.presence || {}; const d = HN.divOf(pr.rating || 800); return `<div class="hn-opp"><div>${root.HNArt.badge(d.league, d.div)}</div>
          <div class="who">${HN.chip && p.by ? HN.chip(p.by) : `<b>${esc(Duel.name(p))}</b>`}${pr.busy ? '<span class="tag" style="background:#7a4a1a">IN A DUEL</span>' : '<span class="tag" style="background:#1a7a4a">ONLINE</span>'}<small>${esc(d.name)} · ${fmt(pr.rating || 0)}</small></div>
          <div class="go"><button type="button" class="hn-btn" data-hn="duelgo" data-peer="${esc(p.peer)}" data-kind="character" ${pr.busy ? 'disabled' : ''}>Ground</button><button type="button" class="hn-btn" data-hn="duelgo" data-peer="${esc(p.peer)}" data-kind="ship" ${pr.busy ? 'disabled' : ''}>Fleet</button></div></div>`; }).join('')}</div>`
          : '<div class="hn-free"><span class="grow"><b>Nobody else is in the HoloNet right now.</b> When another player opens it, they\'ll show up here live.</span></div>';
    return `${HN.ui.head('LIVE DUELS', `Ranked · real players, real time · record ${rec.w} W · ${rec.l} L`, true)}
      <p class="muted" style="margin:0">Challenge a player who's online now. You both build a squad for the duel first, and every card fights at Level ${DUEL_LEVEL} ★${DUEL_STARS}, so it's skill and team-building, not who has the highest levels. You play every move yourself (no Auto). Duels are ranked: win or lose rating just like the arena. 45 seconds per move and 12 minutes per match (then the most damage dealt wins); leaving counts as a loss.</p>
      ${body}`;
  };
  HN.clicks.duelgo = (b) => {
    const p = Duel.lobby().find((x) => x.peer === b.dataset.peer);
    if (!p) return toast('They just left.');
    challenge(p, b.dataset.kind);
  };
  // Closing or reloading mid-duel: warn first; if they go anyway it's a forfeit,
  // recorded now, and explained when the game next opens.
  addEventListener('beforeunload', (e) => { if (Duel.match && !Duel.match.ended) { e.preventDefault(); e.returnValue = ''; } });
  addEventListener('pagehide', (e) => {
    if (e.persisted) return;
    const M = Duel.match;
    if (!M || M.ended) return;
    Duel.forfeit();
    if (M.fr) return;
    try { localStorage.setItem('hn-duel-left', JSON.stringify({ name: M.name, at: Date.now() })); } catch (e) { /* ignore */ }
  });
  setTimeout(() => {
    let left = null;
    let crashed = false;
    try {
      left = JSON.parse(localStorage.getItem('hn-duel-left') || 'null');
      if (!left) { left = JSON.parse(localStorage.getItem('hn-duel-live') || 'null'); crashed = !!left; }
      localStorage.removeItem('hn-duel-left'); localStorage.removeItem('hn-duel-live');
    } catch (e) { /* ignore */ }
    // The page closed without saying goodbye (a crash, a dead battery): book the loss now.
    if (left && left.fr) { left = null; crashed = false; }
    if (crashed) { const h = HN.S(); h.duels = h.duels || { w: 0, l: 0 }; h.duels.l += 1; HN.save(); }
    if (left && Date.now() - left.at < 6 * 3600000) toast(`Your live duel against ${left.name || 'a player'} ended when you left, so it counted as a loss.`);
  }, 4000);
  addEventListener('online', refresh);
  addEventListener('offline', refresh);

  const css = document.createElement('style');
  css.textContent = `.hn-wait-box { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 7; padding: 8px 16px; border-radius: 999px; background: rgba(6, 18, 30, 0.9); border: 1px solid #5fd8ff; color: #dff8ff; font: 700 13px var(--font-display, system-ui); letter-spacing: .1em; pointer-events: none; box-shadow: 0 0 18px rgba(95, 216, 255, 0.4); }
.hn-wait-box[hidden] { display: none; }
.hn-link { position: absolute; left: 50%; top: 18%; transform: translateX(-50%); z-index: 8; display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; align-items: center; max-width: min(92%, 420px); padding: 10px 14px; border-radius: 14px; background: rgba(30, 10, 6, 0.92); border: 1px solid #ff8a5a; color: #ffe8dc; box-shadow: 0 0 22px rgba(255, 120, 60, 0.4); pointer-events: none; }
.hn-link[data-who="them"] { background: rgba(6, 18, 30, 0.92); border-color: #5fd8ff; color: #dff8ff; box-shadow: 0 0 22px rgba(95, 216, 255, 0.4); }
.hn-link .sp { grid-row: span 2; width: 18px; height: 18px; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: hn-link-rot .9s linear infinite; }
.hn-link b { font: 700 13px var(--font-display, system-ui); letter-spacing: .06em; }
.hn-link small { opacity: .8; font-size: 11px; }
@keyframes hn-link-rot { to { transform: rotate(360deg); } }
.hn-clock { position: absolute; right: 10px; top: 8px; z-index: 6; padding: 4px 10px; border-radius: 999px; background: rgba(6, 18, 30, 0.85); border: 1px solid rgba(95, 216, 255, 0.5); color: #dff8ff; font: 700 13px var(--font-display, system-ui); letter-spacing: .08em; pointer-events: none; font-variant-numeric: tabular-nums; }
.hn-clock.low { border-color: #ff7a5a; color: #ffd0c0; }
.modal.db-modal { width: min(820px, 100%); padding-bottom: 0; }
.db { display: grid; gap: 10px; min-width: 0; }
.db-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.db-head h2 { margin: 0; } .db-head .eyebrow { margin: 0 0 2px; }
.db-time { flex: none; min-width: 52px; padding: 6px 10px; border-radius: 999px; text-align: center; font: 700 14px/1 var(--font-display, inherit); background: rgba(95, 216, 255, 0.14); border: 1px solid rgba(95, 216, 255, 0.4); color: #bfefff; }
.db-time.low { background: rgba(255, 90, 58, 0.18); border-color: #ff7a5a; color: #ffb8a0; }
.db-note { margin: 0; font-size: 13px; color: #b8d4e2; }
.db-slots { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; }
.db-slot { display: grid; justify-items: center; gap: 3px; padding: 6px 2px; border-radius: 12px; border: 1px dashed rgba(95, 216, 255, 0.3); background: rgba(6, 18, 30, 0.7); color: #9fc4d8; font: inherit; min-width: 0; }
.db-slot.on { border: 1px solid #5fd8ff; cursor: pointer; color: #e6f6ff; }
.db-slot .mini { width: 48px; height: 48px; display: block; border-radius: 10px; overflow: hidden; }
.db-slot .mini .portrait { width: 100%; height: 100%; }
.db-slot i { width: 48px; height: 48px; border-radius: 10px; background: rgba(95, 216, 255, 0.06); display: block; }
.db-slot small { font-size: 10px; line-height: 1.1; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.db-pick { max-height: none; overflow: visible; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); }
.db-foot { position: sticky; bottom: 0; z-index: 2; display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; margin: 0 -22px; padding: 12px 22px calc(12px + env(safe-area-inset-bottom, 0px)); background: var(--panel, #0b1622); border-top: 1px solid rgba(95, 216, 255, 0.18); }
.db-foot [data-x="go"] { min-width: 170px; }
.db-pick > * { min-width: 0; } .db-pick .ucard { min-width: 0; overflow: hidden; }
@media (max-width: 520px) { .db-head h2 { font-size: 20px; } .db-note { font-size: 12px; } .db-pick { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; } .db-pick .ucard { font-size: 9px; } .db-pick .ucard .ucard-meta span:last-child { display: none; } .db-foot .btn { flex: 1; } .db-foot [data-x="go"] { flex-basis: 100%; } .db-slot .mini, .db-slot i { width: 40px; height: 40px; } }

.dp-bans { margin: 0; padding: 6px 10px; border-radius: 10px; background: rgba(255, 90, 58, 0.12); border: 1px solid rgba(255, 122, 90, 0.45); color: #ffd2c4; font-size: 12px; text-align: center; }
.dp-ban .ucard.ban-sel { outline: 3px solid #ff5a3a; outline-offset: 2px; box-shadow: 0 0 18px rgba(255, 90, 58, 0.55); }
.dp-ban .ucard.is-banned { opacity: .35; filter: grayscale(1); }
.dp-ban .ucard .sel-badge { font-size: 9px; letter-spacing: .08em; }
.dp-ban .ucard.is-banned .sel-badge { background: #ff5a3a; color: #fff; }
.dp-go { min-width: 190px; }
.dp-wait p { margin: 6px 0; }

.dp-tools { display: grid; gap: 6px; }
.dp-sort { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #b8d4e2; }
.dp-sort select { padding: 7px 10px; border-radius: 10px; border: 1px solid rgba(95, 216, 255, 0.35); background: #06121e; color: #e8f6ff; font: inherit; }
.dp-chips { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; }
.dp-chips::-webkit-scrollbar { display: none; }
.dp-chips button { flex: 0 0 auto; padding: 7px 12px; min-height: 34px; border-radius: 999px; border: 1px solid rgba(95, 216, 255, 0.25); background: rgba(8, 20, 32, 0.85); color: #dff8ff; font: 600 12px/1 inherit; cursor: pointer; white-space: nowrap; }
.dp-chips button.on { border-color: #5fd8ff; background: rgba(95, 216, 255, 0.2); }
.dp-cell { display: grid; gap: 4px; min-width: 0; }
.dp-st { display: flex; flex-wrap: wrap; justify-content: center; gap: 2px 6px; font-size: 10px; color: #9fc4d8; }
.dp-st i { font-style: normal; white-space: nowrap; } .dp-st i.hot { color: #ffd23f; font-weight: 700; }
.dp-ban .ucard.nobody .sel-badge { background: #44525e; color: #dfe8ee; }
`;
  document.head.appendChild(css);

  Duel.start = init;
})(window);

// HoloNet text safety: a family-friendly filter for chat, callsigns and guild
// names. Swears are masked (stars); slurs, hate and threats block the whole
// message. It sees through the usual tricks: s p a c e d letters, f.u.c.k,
// symbols for letters (sh1t, $hit, f*ck), and stretched letters (fuuuck),
// without flagging normal words that merely contain a bad one (class, hello,
// assassin, Dickens). Links, emails and phone numbers are masked too.
(function (root) {
  'use strict';
  const HN = root.HN || (root.HN = {});

  // Words that block the whole message.
  const BLOCK = [
    'nigger', 'nigga', 'niggah', 'nigguh', 'niga', 'negro', 'faggot', 'fagot', 'fag', 'fags', 'retard', 'retarded', 'tranny', 'kike', 'spic', 'spick', 'chink', 'gook', 'wetback',
    'coon', 'dyke', 'beaner', 'raghead', 'towelhead', 'paki', 'jap', 'nazi', 'hitler', 'heil', 'kkk', 'rape', 'raped', 'rapist', 'raping', 'molest', 'pedo', 'pedophile', 'porn', 'porno',
    'kys', 'killyourself', 'killurself', 'killyoself', 'hangyourself', 'suicide',
    // More spellings and slurs.
    'nigg', 'nig', 'nigs', 'niggas', 'niggers', 'nigglet', 'nibba', 'nibbas', 'niqqa', 'niqqer', 'nigra', 'negroid', 'snigger', 'sniggers', 'faggots', 'fagg', 'faggy', 'fagboy', 'maricon', 'trannies',
    'retards', 'tard', 'spaz', 'mong', 'kikes', 'chinks', 'gooks', 'spics', 'coons', 'jigaboo', 'porchmonkey', 'junglebunny', 'sandnigger', 'gypo', 'gyppo', 'zipperhead', 'golliwog', 'wog',
    'whitepower', 'heilhitler', 'siegheil', 'nazis', 'swastika', 'rapes', 'rapey', 'molester', 'pedophiles', 'paedo', 'pedos', 'kms', 'killmyself', 'neckyourself', 'killurselfnow',
  ];
  // Words that are masked.
  const MASK = [
    'fuck', 'fucks', 'fucked', 'fucker', 'fuckers', 'fucking', 'fuckin', 'fck', 'fk', 'fuk', 'fuq', 'phuck', 'phuk', 'fvck', 'fvk', 'fcuk', 'fick', 'fyck', 'fvking', 'fvcking', 'motherfucker', 'wtf', 'stfu', 'gtfo',
    'shit', 'shits', 'shitty', 'shitting', 'bullshit', 'sht', 'bitch', 'bitches', 'bitchy', 'btch', 'biatch', 'bastard', 'asshole', 'ass', 'asses', 'arse', 'arsehole', 'jackass', 'dumbass', 'badass',
    'dick', 'dicks', 'dickhead', 'cock', 'cocks', 'pussy', 'cunt', 'cunts', 'twat', 'whore', 'whores', 'slut', 'sluts', 'piss', 'pissed', 'damn', 'dammit', 'goddamn', 'hell',
    'tits', 'titties', 'boobs', 'boob', 'penis', 'vagina', 'sex', 'sexy', 'nude', 'nudes', 'horny', 'wanker', 'bollocks', 'prick', 'douche', 'douchebag', 'thot',
    // More swears, rude words and spellings.
    'fking', 'fkn', 'fcking', 'fucken', 'fuckface', 'fuckwit', 'fux', 'fukc', 'fucc', 'fawk', 'effing', 'shite', 'shithead', 'shithole', 'shitter', 'azz', 'asshat', 'asswipe', 'arsed',
    'dildo', 'cum', 'cumming', 'jizz', 'blowjob', 'handjob', 'anal', 'anus', 'orgasm', 'masturbate', 'fap', 'milf', 'onlyfans', 'hentai', 'boner', 'erection', 'pornhub', 'xxx', 'stripper', 'hooker',
    'puta', 'puto', 'mierda', 'pendejo', 'cabron', 'joder', 'merde', 'scheisse', 'bellend', 'knobhead', 'tosser', 'minge', 'skank', 'cocaine', 'meth', 'heroin',
  ];
  // Squashed spellings caught even with no gaps at all ("shutthefuckup"),
  // limited to strings that don't hide inside ordinary words.
  const INSIDE = ['fuck', 'nigger', 'nigga', 'niqqa', 'nibba', 'faggot', 'motherfuck', 'motherfuk', 'mothafuck', 'mothafuk', 'muthafuck', 'muthafuk', 'bitch', 'asshole', 'dickhead', 'killyourself', 'killurself', 'neckyourself', 'hangyourself', 'whitepower', 'heilhitler', 'siegheil', 'blowjob', 'pornhub', 'onlyfans'];
  // Each squashed word as a pattern that allows stretched letters but keeps
  // doubled ones doubled: n+i+g{2,}e+r+ catches "niiiggger", not "Nigeria".
  const STRETCH = Object.fromEntries(INSIDE.map((x) => [x, new RegExp(x.match(/(.)\1*/g).map((run) => (run.length > 1 ? `${run[0]}{${run.length},}` : `${run}+`)).join(''))]));
  // Real words that contain a bad one; always fine.
  const ALLOW = new Set(['scunthorpe', 'cockpit', 'cockpits', 'cocktail', 'cocktails', 'peacock', 'hancock', 'dickens', 'dickensian', 'shiitake', 'hello', 'shell', 'shells', 'hellfire',
    'assassin', 'assassins', 'assault', 'assemble', 'class', 'classic', 'glass', 'grass', 'pass', 'passed', 'bass', 'mass', 'massive', 'sussex', 'essex', 'title', 'analysis', 'therapist', 'mitsubishi', 'matsushita', 'skyscraper', 'button', 'hitchhiker', 'spicy', 'japan', 'japanese', 'kyshotgun', 'cumulative', 'document', 'documents', 'cucumber', 'circumstance', 'scum', 'analyst', 'analog', 'canal', 'banal', 'knobs', 'knowing',
    'grape', 'drape', 'scrape', 'therapy', 'nightmare', 'night', 'nights', 'knight', 'knights', 'mongoose', 'mongolia', 'crackers', 'wogan', 'bsod', 'massage', 'messages', 'message', 'sextant', 'sextet', 'essex', 'shiite', 'shiites', 'cocky', 'cocked', 'cocking', 'cocker', 'cockers']);
  // Prefix matches only with these endings, so 'cockpit' and 'Dickens' are safe.
  const ENDS = ['', 's', 'es', 'er', 'ers', 'ed', 'ing', 'in', 'y', 'ty', 'ey', 'a', 'ah', 'as', 'az', 'head', 'heads', 'face', 'hole', 'holes', 'tard', 'bag', 'wit', 'off', 'up', 'z'];
  const stem = (f, roots) => roots.some((b) => f.startsWith(b) && ENDS.includes(f.slice(b.length)));
  const blockSet = new Set(BLOCK);
  const maskSet = new Set(MASK);

  const LEET = { 0: 'o', 1: 'i', 2: 'z', 3: 'e', 4: 'a', 5: 's', 6: 'g', 7: 't', 8: 'b', 9: 'g', '@': 'a', $: 's', '!': 'i', '|': 'i', '+': 't', '\u20ac': 'e', '\u00a3': 'l', '\u00a1': 'i', '*': '', '#': '' };
  const LOOK = { '\u0430': 'a', '\u0435': 'e', '\u043e': 'o', '\u0440': 'p', '\u0441': 'c', '\u0443': 'y', '\u0445': 'x', '\u0456': 'i', '\u0458': 'j', '\u0455': 's', '\u0501': 'd', '\u0261': 'g', '\u043a': 'k', '\u043d': 'h', '\u0442': 't', '\u0432': 'b', '\u043c': 'm', '\u0433': 'r',
    '\u03b1': 'a', '\u03bf': 'o', '\u03bd': 'v', '\u03b9': 'i', '\u03ba': 'k', '\u03c4': 't', '\u03c1': 'p', '\u03b5': 'e', '\u03c5': 'u', '\u0391': 'a', '\u0392': 'b', '\u0395': 'e', '\u0397': 'h', '\u0399': 'i', '\u039a': 'k', '\u039c': 'm', '\u039d': 'n', '\u039f': 'o', '\u03a1': 'p', '\u03a4': 't', '\u03a7': 'x', '\u00df': 'ss', '\u00f8': 'o', '\u0131': 'i' };
  const fold = (s) => s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^\x00-\x7f]/g, (c) => LOOK[c] || c);
  // A word as letters only, with symbol stand-ins turned back into letters.
  const letters = (w) => fold(w).split('').map((c) => (c in LEET ? LEET[c] : c)).join('').replace(/[^a-z]/g, '');
  const squeeze = (w) => w.replace(/(.)\1+/g, '$1');
  const f2 = (w) => w.replace(/(.)\1{2,}/g, '$1$1');
  // One word -> 'block' | 'mask' | null. Checks the word as written and with
  // stretched letters squeezed (fuuuuck -> fuck, assss -> as is fine).
  function judge(w) {
    if (!w) return null;
    if (ALLOW.has(w)) return null;
    // Sound-alike swaps: ph -> f, v -> u (fvck), y -> u (look-alike letters), ck/q -> k.
    // Stretched vowels count (fuuuck, shiiit), and 3+ repeats of a consonant
    // (fuckkk), but doubled consonants stay doubled so "rapping" isn't squashed.
    const vnorm = (f) => f.replace(/([aeiou])\1+/g, '$1').replace(/([^aeiou])\1{2,}/g, '$1');
    const base = [w, vnorm(w)];
    const forms = [...new Set(base.flatMap((f) => [f, f.replace(/ph/g, 'f'), f.replace(/v/g, 'u'), f.replace(/y/g, 'u'), (f[0] === 'f' ? f.replace(/ph/g, 'f').replace(/k$/, 'ck') : f)]))];
    for (const f of forms) if (blockSet.has(f) || stem(f, ['nigger', 'nigga', 'faggot', 'retard', 'rapist', 'pedophile'])) return 'block';
    for (const f of forms) if (maskSet.has(f) || stem(f, ['fuck', 'fuk', 'fucc', 'shit', 'bitch', 'cunt', 'whore', 'slut', 'pussy', 'bastard', 'asshole', 'motherfuck'])) return 'mask';
    // Swears glued inside one word ("shutthefuckup").
    if (INSIDE.some((x) => f2(w).includes(x))) return INSIDE.filter((x) => f2(w).includes(x)).some((x) => /^(nigg|niqq|nibb|fagg|kill|neck|hang|whitep|heil|sieg)/.test(x)) ? 'block' : 'mask';
    return null;
  }
  const PII = [
    /\b(?:https?:\/\/|www\.)\S+/gi,
    /\b[\w.-]+\.(?:com|net|org|gg|io|co|xyz|ly|me|tv|app|link|info|biz|us|uk)\b(?:\/\S*)?/gi,
    /\b[\w.+-]+@[\w-]+\.[\w.]+\b/g,
    /(?:\+?1[\s.-]?)?\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
    /\b\d{10,}\b/g,
    /\bdiscord(?:\.gg|app)?\b\S*/gi,
  ];
  const stars = (n) => '\u2605'.repeat(Math.max(3, Math.min(6, n)));

  // Filter a message. Returns { text, blocked, changed }.
  function clean(input) {
    let text = String(input || '').replace(/[\u200b-\u200f\u2060\ufeff]/g, '');
    for (const re of PII) text = text.replace(re, (m) => stars(m.length));
    // Tokens: runs of letters/digits/symbol stand-ins, with the gaps kept.
    const parts = text.split(/(\s+|[.,;:?_~^'"`()[\]{}<>\/\\=-]+)/);
    const toks = parts.map((p, i) => ({ p, i, w: i % 2 ? '' : letters(p) }));
    // Self-censored words (c*nt, a**hole, sh**, f!ck): each * # ! stands for any letter.
    for (const t of toks) {
      if (!t.w || !/[*#!]/.test(t.p) || t.p.length > 16) continue;
      const pat = fold(t.p).split('').map((c) => (/[*#!]/.test(c) ? '[a-z]' : c in LEET ? LEET[c] : /[a-z]/.test(c) ? c : '')).join('');
      if (!/[a-z]/.test(pat.replace(/\[a-z\]/g, ''))) continue;
      const re = new RegExp(`^${pat}$`);
      if (BLOCK.some((x) => re.test(x))) { t.wild = 'block'; } else if (MASK.some((x) => re.test(x))) t.wild = 'mask';
    }
    let blocked = false;
    const hit = new Set();
    for (const t of toks) {
      const j = t.wild || judge(t.w);
      if (j === 'block') blocked = true;
      if (j) hit.add(t.i);
    }
    // s p a c e d / f.u.c.k / f-u-c-k: join runs of tiny pieces and check them.
    const words = toks.filter((t) => t.w);
    for (let a = 0; a < words.length; a++) {
      if (words[a].w.length > 2) continue;
      let joined = '';
      for (let b = a; b < words.length && words[b].w.length <= 2 && b - a < 14; b++) {
        joined += words[b].w;
        if (b === a) continue;
        const j = judge(joined) || (joined.length >= 4 && INSIDE.some((x) => joined.includes(x)) ? 'mask' : null);
        if (j) {
          if (j === 'block' || BLOCK.some((x) => x.length >= 4 && joined.includes(x))) blocked = true;
          for (let k = a; k <= b; k++) hit.add(words[k].i);
        }
      }
    }
    // Whole message squashed together: the worst words can't hide.
    const flatRaw = letters(text.replace(/\s+/g, ''));
    for (const x of INSIDE) {
      const inOne = toks.some((t) => t.w && (ALLOW.has(t.w) ? false : f2(t.w).includes(x)));
      const anyAllowed = toks.some((t) => t.w && ALLOW.has(t.w) && t.w.includes(x));
      if (!inOne && !anyAllowed && STRETCH[x].test(flatRaw)) {
        if (BLOCK.includes(x) || /^(nigg|niqq|nibb|fagg|kill|neck|hang|whitep|heil|sieg)/.test(x)) blocked = true;
        // Mask every token that holds part of it.
        for (const t of toks) if (t.w && (x.includes(t.w) || t.w.includes(x.slice(0, 3))) && t.w.length >= 2) hit.add(t.i);
        if (![...hit].length) return { text: stars(text.length), blocked, changed: true };
      }
    }
    const out = parts.map((p, i) => (hit.has(i) ? stars(p.length) : p)).join('');
    return { text: out, blocked, changed: out !== String(input || '') };
  }
  // A name or motto: true when it's fine to show other players.
  const ok = (s) => { const r = clean(s); return !r.blocked && !r.changed; };

  HN.safe = { clean, ok };
})(window);

// The HoloNet picture pool: everything a player can pick as a profile picture
// or a guild picture. Cards (characters and ships) work for both; planets,
// creatures, vehicles, symbols, famous things and scenes are guild pictures
// for now. Only pictures from this pool can be picked, so every picture is
// family-friendly, and no secret card is ever in it. New art drawn here can
// later become a card.
(function (root) {
  'use strict';
  const D = root.GameData;
  const HN = root.HN;
  let seq = 0;

  // ---------- shared pieces ----------
  const lg = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('')}</linearGradient>`;
  const rg = (id, stops, cx = 0.38, cy = 0.34, r = 0.75) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('')}</radialGradient>`;
  const stars = (n, s) => { let out = ''; let x = s * 9301 + 49297; for (let i = 0; i < n; i++) { x = (x * 9301 + 49297) % 233280; const a = x / 233280; x = (x * 9301 + 49297) % 233280; const b = x / 233280; out += `<circle cx="${(a * 100).toFixed(1)}" cy="${(b * 100).toFixed(1)}" r="${(0.3 + ((a * 7) % 1) * 0.6).toFixed(2)}" fill="#fff" opacity="${(0.35 + ((b * 5) % 1) * 0.6).toFixed(2)}"/>`; } return out; };
  const space = (u, a = '#0b1028', b = '#03040c', n = 34) => `<defs>${rg(`${u}sp`, [[0, a], [1, b]], 0.5, 0.4, 0.8)}</defs><rect width="100" height="100" fill="url(#${u}sp)"/>${stars(n, u.length * 7 + n)}`;
  const sky = (u, top, bot) => `<defs>${lg(`${u}sk`, [[0, top], [1, bot]])}</defs><rect width="100" height="100" fill="url(#${u}sk)"/>`;

  // A planet: lit sphere, bands, features, rim glow.
  function planet(u, o) {
    const r = o.r || 33;
    const cx = o.cx || 50;
    const cy = o.cy || 54;
    return `${space(u, o.space || '#0b1028', '#02030a')}
      <defs>${rg(`${u}pl`, [[0, o.hi], [0.55, o.base], [1, o.dark]], 0.35, 0.3, 0.85)}<clipPath id="${u}cl"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>${rg(`${u}sh`, [[0, '#000', 0], [0.62, '#000', 0], [1, '#000', 0.75]], 0.32, 0.28, 0.9)}</defs>
      ${o.behind || ''}
      <circle cx="${cx}" cy="${cy}" r="${r + 3.5}" fill="${o.atmo}" opacity=".18"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${u}pl)"/>
      <g clip-path="url(#${u}cl)">${o.surface || ''}</g>
      <g clip-path="url(#${u}cl)" opacity="${o.clouds == null ? 0.35 : o.clouds}" fill="#fff">${[[-0.5, -0.45, 0.5, 0.05], [0.1, -0.2, 0.6, 0.06], [-0.3, 0.15, 0.45, 0.05], [0.2, 0.5, 0.5, 0.05]].map(([dx, dy, w, h]) => `<ellipse cx="${(cx + dx * r).toFixed(1)}" cy="${(cy + dy * r).toFixed(1)}" rx="${(w * r).toFixed(1)}" ry="${(h * r * 1.4).toFixed(1)}" transform="rotate(-8 ${cx} ${cy})"/>`).join('')}</g>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${u}sh)"/>
      <path d="M${(cx - r * 0.82).toFixed(1)} ${(cy - r * 0.57).toFixed(1)} A${r} ${r} 0 0 1 ${(cx + r * 0.3).toFixed(1)} ${(cy - r * 0.95).toFixed(1)}" stroke="#fff" stroke-width="1.4" fill="none" opacity=".45" stroke-linecap="round"/>
      <ellipse cx="${(cx - r * 0.38).toFixed(1)}" cy="${(cy - r * 0.42).toFixed(1)}" rx="${(r * 0.22).toFixed(1)}" ry="${(r * 0.12).toFixed(1)}" fill="#fff" opacity=".18" transform="rotate(-35 ${(cx - r * 0.38).toFixed(1)} ${(cy - r * 0.42).toFixed(1)})"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${o.atmo}" stroke-width="1.2" opacity=".55"/>
      ${o.front || ''}`;
  }
  const bands = (list, cy = 54) => list.map(([y, h, c, op]) => `<path d="M0 ${cy + y} Q50 ${cy + y - 4} 100 ${cy + y} L100 ${cy + y + h} Q50 ${cy + y + h - 4} 0 ${cy + y + h}Z" fill="${c}" opacity="${op || 0.55}"/>`).join('');
  const dots = (pts, c, r = 0.7, op = 0.9) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${op}"/>`).join('');

  // ---------- planets ----------
  const PLANETS = {
    p_tatooine: { name: 'Tatooine', draw: (u) => planet(u, { base: '#d49a58', hi: '#f6d49a', dark: '#6a3a18', atmo: '#ffd9a0', surface: bands([[-18, 5, '#b8763e'], [-6, 4, '#e8bc80'], [6, 6, '#a86a34'], [16, 4, '#e0ae6a']]) + dots([[38, 46], [60, 62], [45, 70]], '#8a5428', 2.2, 0.5), behind: `<circle cx="18" cy="20" r="7" fill="#fff6d0"/><circle cx="18" cy="20" r="11" fill="#ffe08a" opacity=".25"/><circle cx="31" cy="13" r="4.5" fill="#ffb060"/><circle cx="31" cy="13" r="7.5" fill="#ff9a40" opacity=".22"/>` }) },
    p_hoth: { name: 'Hoth', draw: (u) => planet(u, { base: '#cfe6f6', hi: '#ffffff', dark: '#4a6a8a', atmo: '#bfe6ff', space: '#0a1630', surface: bands([[-14, 3, '#a8c8e0'], [4, 3, '#b8d8ee'], [14, 4, '#9ab8d4']]) + '<path d="M30 40 L44 48 L40 58 M58 44 L66 52 L62 66 M36 66 L50 62" stroke="#8ab0cc" stroke-width="1" fill="none" opacity=".8"/>' }) },
    p_dagobah: { name: 'Dagobah', draw: (u) => planet(u, { base: '#3e6a3a', hi: '#8ab06a', dark: '#14261a', atmo: '#9ac890', surface: bands([[-16, 6, '#2a4a2a'], [0, 5, '#5a7a4a'], [12, 6, '#2e4e32']]) + `<ellipse cx="44" cy="48" rx="20" ry="4" fill="#cfe6c8" opacity=".25"/><ellipse cx="58" cy="64" rx="16" ry="3.5" fill="#cfe6c8" opacity=".22"/>` }) },
    p_bespin: { name: 'Bespin', draw: (u) => `<defs>${lg(`${u}sk`, [[0, '#3a1a4a'], [0.35, '#a8486a'], [0.62, '#f2905a'], [0.8, '#ffc78a'], [1, '#ffe0b0']])}${rg(`${u}sun`, [[0, '#fff6d8'], [0.25, '#ffd890', 0.9], [1, '#ff9a5a', 0]], 0.5, 0.5, 0.5)}${lg(`${u}cl`, [[0, '#ffd2a8'], [1, '#c8607a']])}${lg(`${u}cd`, [[0, '#f6c8a0'], [1, '#8a3a5a']])}${lg(`${u}m`, [[0, '#ffffff'], [0.5, '#e2e6ee'], [1, '#8a92a6']], 0, 1)}${rg(`${u}gp`, [[0, '#ffb890'], [0.6, '#d8706a'], [1, '#5a2040']], 0.35, 0.3, 0.8)}</defs>
      <rect width="100" height="100" fill="url(#${u}sk)"/>${stars(12, 41).replace(/<circle /g, '<circle opacity=".5" ')}
      <circle cx="80" cy="22" r="17" fill="url(#${u}gp)" opacity=".8"/><path d="M64 20 Q80 17 96 21 M65 26 Q80 23 95 27" stroke="#ffd2b0" stroke-width="1.6" fill="none" opacity=".45"/>
      <circle cx="26" cy="62" r="20" fill="url(#${u}sun)"/>
      ${[[0, 66, '#f6b08a', 0.7], [-10, 72, '#e8907a', 0.85]].map(([dx, y, c, op]) => `<path d="M${dx} ${y} q10 -6 20 -1 q8 -6 18 -1 q10 -7 22 -1 q9 -5 18 0 q8 -5 22 0 V100 H${dx}Z" fill="${c}" opacity="${op}"/>`).join('')}
      <g transform="translate(56 54)">
        <path d="M-1.6 9 L1.6 9 L1 30 L-1 30Z" fill="#7a8296"/><path d="M-1 12 L-6 30 M1 12 L6 30" stroke="#6a7286" stroke-width="1"/>
        <ellipse cy="31" rx="4" ry="1.4" fill="#5a6276"/>
        <path d="M-6 2 Q-4 9 0 10 Q4 9 6 2Z" fill="#9aa2b4"/>
        <ellipse cy="2" rx="27" ry="5" fill="#6a7088"/>
        <ellipse cy="0.6" rx="27" ry="5" fill="url(#${u}m)"/>
        <ellipse cy="-0.6" rx="19" ry="3.4" fill="#f4f6fa"/>
        ${[-16, -11, -6, -1, 4, 9, 14].map((x, k) => `<rect x="${x - 1.4}" y="${-5 - (k % 3) * 1.6 - (Math.abs(x) < 8 ? 3 : 0)}" width="2.8" height="${5 + (k % 3) * 1.6 + (Math.abs(x) < 8 ? 3 : 0)}" rx=".6" fill="#e6eaf2"/><rect x="${x - 1.4}" y="${-5 - (k % 3) * 1.6 - (Math.abs(x) < 8 ? 3 : 0)}" width="1" height="${5 + (k % 3) * 1.6 + (Math.abs(x) < 8 ? 3 : 0)}" fill="#fff"/>`).join('')}
        <path d="M-3 -9 L0 -16 L3 -9Z" fill="#f4f6fa"/><path d="M0 -16 V-20" stroke="#cfd4de" stroke-width=".6"/><circle cy="-20.4" r=".7" fill="#ff5a3a"/>
        ${dots([[-22, 1.4], [-17, 2.6], [-11, 3.4], [-5, 3.8], [1, 3.8], [7, 3.4], [13, 2.6], [19, 1.6], [23, 0.8]], '#ffd27a', 0.55)}
        ${dots([[-14, -2], [-9, -3], [-4, -6], [1, -7], [6, -5], [11, -3], [16, -2]], '#ffe6a8', 0.4, 0.8)}
      </g>
      ${[[18, 40, 0.9], [84, 48, 0.7]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#3a2440"><path d="M-4 0 L4 0 L5 1.2 L-5 1.2Z"/><rect x="-1" y="-1.8" width="2" height="1.8"/><path d="M-4 1.2 L-3 2.2 M4 1.2 L3 2.2" stroke="#3a2440" stroke-width=".5"/></g>`).join('')}
      <path d="M-6 82 q12 -7 24 -2 q10 -8 24 -2 q12 -7 26 -1 q12 -6 22 -1 q8 -4 16 0 V100 H-6Z" fill="url(#${u}cl)"/>
      <path d="M-4 90 q14 -6 26 -1 q12 -6 26 0 q14 -6 28 0 q12 -5 30 0 V100 H-4Z" fill="url(#${u}cd)"/>
      <path d="M6 82 q8 -5 14 -2 M40 80 q10 -6 18 -2 M74 81 q8 -4 14 -1" stroke="#fff2dc" stroke-width="1" fill="none" opacity=".7" stroke-linecap="round"/>` },
    p_endor: { name: 'Endor', draw: (u) => planet(u, { base: '#3a7a44', hi: '#9ad08a', dark: '#12301c', atmo: '#9ae0b0', cx: 44, cy: 58, r: 31, surface: `${[[30, 50, 9], [52, 46, 11], [44, 66, 10], [62, 64, 8], [34, 72, 7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2a5e34" opacity=".7"/>`).join('')}<ellipse cx="40" cy="44" rx="18" ry="3" fill="#ffffff" opacity=".22"/>`, behind: `<g transform="translate(78 22)"><circle r="12" fill="#5a6270"/><path d="M-12 0 A12 12 0 0 1 4 -11.3 L4 11.3 A12 12 0 0 1 -12 0Z" fill="#7a8290"/><circle cx="-4" cy="-4" r="3" fill="#3a4250"/>${[-6, -2, 2, 6].map((y) => `<line x1="2" y1="${y}" x2="12" y2="${y}" stroke="#3a4250" stroke-width=".6"/>`).join('')}<path d="M4 -11.3 L8 -6 L6 0 L9 6 L4 11.3" stroke="#a0a8b4" stroke-width=".6" fill="none" stroke-dasharray="1.4 1"/></g>` }) },
    p_scarif: { name: 'Scarif', draw: (u) => planet(u, { base: '#2a8ac8', hi: '#9ae6ff', dark: '#0a2a5a', atmo: '#9ae8ff', surface: `${[[34, 46, 6, 3], [56, 52, 8, 3.5], [44, 64, 5, 2.5], [64, 66, 6, 2.6], [40, 56, 3, 1.6]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#f2e6b0"/><ellipse cx="${x}" cy="${y}" rx="${rx - 1.6}" ry="${ry - 1}" fill="#4ac08a"/>`).join('')}${bands([[-10, 2, '#ffffff', 0.25], [10, 2, '#ffffff', 0.2]])}`, front: '<ellipse cx="50" cy="54" rx="42" ry="11" fill="none" stroke="#7ad8ff" stroke-width="1.2" opacity=".55" stroke-dasharray="3 2"/>' }) },
    p_coruscant: { name: 'Coruscant', draw: (u) => {
      // One city covering a whole world: grey-brown districts and canyons on
      // the day side, and on the night side the lights follow the districts
      // in clusters and glowing traffic arteries.
      let x = 77; const rnd = () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
      const blobs = [[36, 40, 12, 7, -20], [60, 46, 14, 8, 15], [44, 62, 16, 9, -10], [66, 66, 11, 7, 30], [30, 58, 8, 5, 10], [54, 30, 10, 5, 0], [72, 54, 6, 9, 0]];
      const districts = blobs.map(([bx, by, rx, ry, a], i) => `<ellipse cx="${bx}" cy="${by}" rx="${rx}" ry="${ry}" transform="rotate(${a} ${bx} ${by})" fill="${i % 2 ? '#5a5a62' : '#4a4c58'}" opacity=".35"/><ellipse cx="${bx}" cy="${by}" rx="${rx * 0.55}" ry="${ry * 0.5}" transform="rotate(${a} ${bx} ${by})" fill="#6a6a72" opacity=".25"/>`).join('');
      let lights = '';
      for (let k = 0; k < 620; k++) {
        const b = blobs[k % blobs.length];
        const t = rnd() * Math.PI * 2; const d = Math.sqrt(rnd());
        const free = k % 5 < 2;
        const px = free ? 50 + Math.cos(t) * 33 * d : b[0] + Math.cos(t) * b[2] * d; const py = free ? 54 + Math.sin(t) * 33 * d : b[1] + Math.sin(t) * b[3] * d;
        const night = (px - 50) * 0.7 + (py - 54) * 0.7;
        if (night < -4) continue;
        lights += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(free ? 0.22 + rnd() * 0.2 : 0.28 + rnd() * 0.3).toFixed(2)}" fill="${rnd() < 0.8 ? '#ffc870' : '#fff2d0'}" opacity="${Math.min(1, 0.35 + night / 24).toFixed(2)}"/>`;
      }
      const arteries = ['M30 62 C40 56 52 60 66 52 S80 50 84 46', 'M40 76 C46 68 58 70 70 62', 'M24 48 C34 50 44 46 56 50 S70 58 78 62', 'M50 86 C52 76 60 72 64 64'];
      const surface = `<rect x="0" y="0" width="100" height="100" fill="#3a3e4c" opacity=".4"/>${districts}
        ${arteries.map((d) => `<path d="${d}" stroke="#ffb060" stroke-width="1.2" fill="none" opacity=".12"/><path d="${d}" stroke="#ffe0a0" stroke-width=".3" fill="none" opacity=".45" stroke-dasharray=".6 .9"/>`).join('')}
        ${lights}`;
      return planet(u, { base: '#4a4e5e', hi: '#a8b0c4', dark: '#07080e', atmo: '#9ab8e0', clouds: 0.22, surface,
        front: `<ellipse cx="50" cy="54" rx="44" ry="9" transform="rotate(-14 50 54)" fill="none" stroke="#9ad8ff" stroke-width=".4" opacity=".45" stroke-dasharray="1.6 2.4"/>
          ${[[14, 64], [86, 42], [24, 70], [80, 38]].map(([sx, sy]) => `<circle cx="${sx}" cy="${sy}" r=".8" fill="#e8f6ff"/>`).join('')}` });
    } },
    p_geonosis: { name: 'Geonosis', draw: (u) => planet(u, { base: '#c0603a', hi: '#f2a878', dark: '#4a1a0e', atmo: '#ff9a6a', surface: bands([[-14, 5, '#a04a2a'], [2, 4, '#d8805a'], [12, 5, '#8a3a22']]) + dots([[38, 48], [58, 58], [48, 70], [66, 46]], '#6a2a14', 2.6, 0.55), front: `<g opacity=".85">${Array.from({ length: 26 }, (_, k) => { const a = (k / 26) * Math.PI * 2; const x = 50 + Math.cos(a) * 44; const y = 54 + Math.sin(a) * 9; return (Math.sin(a) < 0 ? '' : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.8 + (k % 3) * 0.5).toFixed(1)}" fill="#c8a080"/>`); }).join('')}</g>` }) },
    p_mustafar: { name: 'Mustafar', draw: (u) => planet(u, { base: '#3a1a1a', hi: '#7a3a2a', dark: '#0a0404', atmo: '#ff6a2a', surface: `<path d="M24 44 Q36 50 44 44 T64 50 T82 46 M28 62 Q42 58 50 66 T76 62 M40 34 L46 40 L44 50 M60 70 L58 80" stroke="#ff8a2a" stroke-width="2" fill="none" opacity=".95"/><path d="M24 44 Q36 50 44 44 T64 50 T82 46 M28 62 Q42 58 50 66 T76 62" stroke="#ffe08a" stroke-width=".7" fill="none"/>` }) },
    p_naboo: { name: 'Naboo', draw: (u) => planet(u, { base: '#3a8a6a', hi: '#aee8c0', dark: '#0e3040', atmo: '#bfeaff', surface: `${[[36, 46, 12, 7], [60, 60, 14, 8], [42, 70, 9, 5]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#2a7ab0" opacity=".75"/>`).join('')}<path d="M22 50 Q40 42 58 48 T86 44 M26 66 Q46 60 62 68" stroke="#fff" stroke-width="2.4" fill="none" opacity=".45" stroke-linecap="round"/>` }) },
    p_kashyyyk: { name: 'Kashyyyk', draw: (u) => planet(u, { base: '#2e6a2a', hi: '#8ac860', dark: '#0e240e', atmo: '#b0e890', surface: `${[[32, 44, 8], [50, 40, 6], [62, 52, 9], [40, 60, 10], [58, 70, 7], [30, 70, 6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#4a8a34" opacity=".75"/>`).join('')}<path d="M24 58 Q34 54 46 56" stroke="#2a5aa0" stroke-width="2" fill="none" opacity=".7"/>` }) },
    p_jakku: { name: 'Jakku', draw: (u) => planet(u, { base: '#d8c08a', hi: '#fff2c8', dark: '#6a5230', atmo: '#ffeab0', surface: bands([[-12, 4, '#c8ac74'], [4, 5, '#e6d2a0'], [14, 4, '#bea068']]) + '<path d="M42 66 L58 60 L64 64 L46 70Z" fill="#7a7468" opacity=".75"/><path d="M50 62 L54 58 L56 61" stroke="#5a5448" stroke-width=".8" fill="none"/>' }) },
  };

  // ---------- symbols: embossed metal medallions ----------
  // Each emblem is cut from metal (gradient fill, dark edge, bright top edge)
  // and set in a bevelled ring over a themed field.
  const medal = (u, o) => `<defs>
      ${rg(`${u}f`, [[0, o.f1], [0.7, o.f2], [1, o.f3 || '#000']], 0.5, 0.42, 0.75)}
      ${lg(`${u}m`, [[0, o.m1], [0.45, o.m2], [1, o.m3]], 0.3, 1)}
      ${lg(`${u}r`, [[0, '#fafcff'], [0.35, o.ring || '#9aa4b2'], [1, '#2a2e36']], 0, 1)}
      ${rg(`${u}g`, [[0, o.glow, 0.55], [1, o.glow, 0]], 0.5, 0.5, 0.5)}
    </defs>
    <rect width="100" height="100" fill="url(#${u}f)"/>${o.field || ''}
    <circle cx="50" cy="50" r="46" fill="url(#${u}g)"/>
    <circle cx="50" cy="50" r="38" fill="#05070c" opacity=".55"/>
    <circle cx="50" cy="50" r="37" fill="none" stroke="url(#${u}r)" stroke-width="3.2"/>
    <circle cx="50" cy="50" r="33.4" fill="none" stroke="#000" stroke-width="1" opacity=".6"/>
    <circle cx="50" cy="50" r="40" fill="none" stroke="${o.glow}" stroke-width=".8" opacity=".5"/>
    <g transform="translate(50 50.6) scale(1.12)">
      <g transform="translate(.9 1.4)" fill="#000" opacity=".55">${o.body}</g>
      <g fill="url(#${u}m)" stroke="${o.edge}" stroke-width=".9" fill-rule="evenodd">${o.body}</g>
      <g fill="none" stroke="#fff" stroke-width=".5" opacity=".55" transform="translate(-.3 -.5)">${o.body}</g>
    </g>`;
  const ray = (n, r1, r2, w, rot = 0) => Array.from({ length: n }, (_, k) => `<path d="M${-w} ${-r1} L0 ${-r2} L${w} ${-r1}Z" transform="rotate(${rot + (k * 360) / n})"/>`).join('');
  const SYMBOLS = {
    s_rebel: { name: 'Rebel Alliance', draw: (u) => medal(u, { f1: '#ff7a3a', f2: '#8a1a0e', f3: '#2a0604', m1: '#ffe2b8', m2: '#ff6a2a', m3: '#8a1a0a', edge: '#3a0a04', glow: '#ff7a3a',
      field: `<g opacity=".18" stroke="#fff" stroke-width="5">${[-20, 0, 20, 40, 60, 80, 100].map((x) => `<path d="M${x} 0 L${x + 40} 100"/>`).join('')}</g>`,
      body: '<path d="M0 -28 C-2.6 -17 -3.6 -7 -2 3 C-7.6 0 -12.6 -8 -14.6 -18.6 C-25 -5 -21 14 -6.4 23 L0 28 L6.4 23 C21 14 25 -5 14.6 -18.6 C12.6 -8 7.6 0 2 3 C3.6 -7 2.6 -17 0 -28Z M-9.4 -4 C-13 4 -11 12 -4 18 C-8.6 10 -9.6 3 -9.4 -4Z M9.4 -4 C13 4 11 12 4 18 C8.6 10 9.6 3 9.4 -4Z"/>' }) },
    s_empire: { name: 'Galactic Empire', draw: (u) => medal(u, { f1: '#4a5462', f2: '#14181e', m1: '#ffffff', m2: '#b8c0cc', m3: '#4a5260', edge: '#14181e', glow: '#9aa8bc',
      field: `<g opacity=".12" fill="#fff">${Array.from({ length: 9 }, (_, k) => `<rect x="${k * 12}" y="0" width="1" height="100"/>`).join('')}</g>`,
      body: `<path d="M0 -26 A26 26 0 1 1 0 26 A26 26 0 1 1 0 -26Z M0 -20 A20 20 0 1 0 0 20 A20 20 0 1 0 0 -20Z"/>${Array.from({ length: 6 }, (_, k) => `<path d="M-3.4 -19.6 L3.4 -19.6 L2.4 -8 L-2.4 -8Z" transform="rotate(${k * 60})"/><path d="M-4 -29 L4 -29 L3 -25.6 L-3 -25.6Z" transform="rotate(${30 + k * 60})"/>`).join('')}<path d="M0 -8.6 A8.6 8.6 0 1 1 0 8.6 A8.6 8.6 0 1 1 0 -8.6Z M0 -4 A4 4 0 1 0 0 4 A4 4 0 1 0 0 -4Z"/>` }) },
    s_jedi: { name: 'Jedi Order', draw: (u) => medal(u, { f1: '#2a6ab0', f2: '#0a1a3a', m1: '#fff6d0', m2: '#e8c060', m3: '#7a5418', edge: '#2a1a04', glow: '#5ab8ff',
      field: `<g opacity=".25">${stars(30, 5)}</g>`,
      body: '<path d="M0 -29 L2.6 -6 L1.4 26 L0 29 L-1.4 26 L-2.6 -6Z"/><path d="M-3.4 -2 C-11 -5 -19 -13 -24 -25 C-21 -10 -13 2 -3.4 6Z M3.4 -2 C11 -5 19 -13 24 -25 C21 -10 13 2 3.4 6Z"/><path d="M-21 6 C-12 16 12 16 21 6 C14 20 -14 20 -21 6Z"/><path d="M-6 -16 L-3 -11 L-6 -9Z M6 -16 L3 -11 L6 -9Z"/>' }) },
    s_mando: { name: 'Mythosaur', draw: (u) => medal(u, { f1: '#7a8698', f2: '#1e242c', m1: '#ffffff', m2: '#c8d0dc', m3: '#5a6472', edge: '#1a1e24', glow: '#c8d8ec',
      field: `<g opacity=".14" fill="none" stroke="#fff" stroke-width="1.4">${[18, 30, 42].map((r) => `<circle cx="50" cy="50" r="${r + 22}"/>`).join('')}</g>`,
      body: '<path d="M0 -9 C-9 -9 -11.6 3 -7.6 12 L-4.6 23 L4.6 23 L7.6 12 C11.6 3 9 -9 0 -9Z M-7.4 1.4 L-3 5.6 L-7.2 8Z M7.4 1.4 L3 5.6 L7.2 8Z M-3 16 L3 16 L2.4 17.6 L-2.4 17.6Z"/><path d="M-6 -5 C-17 -7 -25.6 -15.6 -25.6 -28 C-19 -19 -12.6 -15.6 -3.4 -13Z M6 -5 C17 -7 25.6 -15.6 25.6 -28 C19 -19 12.6 -15.6 3.4 -13Z"/><path d="M-3.2 -10 L0 -27.6 L3.2 -10Z"/><path d="M-10 -6 C-16 -4 -20 2 -20 9 C-17 4 -13 2 -9 1Z M10 -6 C16 -4 20 2 20 9 C17 4 13 2 9 1Z"/>' }) },
    s_republic: { name: 'Galactic Republic', draw: (u) => medal(u, { f1: '#d83a3a', f2: '#4a0a0e', m1: '#ffffff', m2: '#ffd2c8', m3: '#a8302a', edge: '#3a0408', glow: '#ff6a5a',
      field: `<g opacity=".18" fill="#fff">${ray(16, 60, 70, 3)}</g>`,
      body: `<path d="M0 -27 A27 27 0 1 1 0 27 A27 27 0 1 1 0 -27Z M0 -22.6 A22.6 22.6 0 1 0 0 22.6 A22.6 22.6 0 1 0 0 -22.6Z"/>${Array.from({ length: 8 }, (_, k) => `<path d="M-3.8 -22 L3.8 -22 L1.4 -7 L-1.4 -7Z" transform="rotate(${k * 45})"/>`).join('')}<path d="M0 -7 A7 7 0 1 1 0 7 A7 7 0 1 1 0 -7Z M0 -3.2 A3.2 3.2 0 1 0 0 3.2 A3.2 3.2 0 1 0 0 -3.2Z"/>` }) },
    s_firstorder: { name: 'First Order', draw: (u) => medal(u, { f1: '#3a0a0a', f2: '#0a0606', m1: '#ffffff', m2: '#d8dce2', m3: '#6a707a', edge: '#0a0a0e', glow: '#ff2a2a',
      field: `<g opacity=".22" stroke="#ff2a2a" stroke-width=".8" fill="none">${[0, 1, 2, 3].map((k) => `<path d="M0 ${20 + k * 20} L100 ${10 + k * 20}"/>`).join('')}</g>`,
      body: `<path d="M0 -9.6 L8.3 -4.8 L8.3 4.8 L0 9.6 L-8.3 4.8 L-8.3 -4.8Z M0 -5.4 L-4.7 -2.7 L-4.7 2.7 L0 5.4 L4.7 2.7 L4.7 -2.7Z"/>${Array.from({ length: 6 }, (_, k) => `<path d="M-3.6 -12 L0 -29 L3.6 -12Z" transform="rotate(${k * 60})"/><path d="M-11 -21 L-6.4 -24.6 L-5 -14.6 L-8.4 -12.6Z" transform="rotate(${30 + k * 60})"/>`).join('')}` }) },
  };

  // ---------- vehicles ----------
  const metal = (u, id, a = '#c8ced6', b = '#8a929e', c = '#3a4048') => lg(`${u}${id}`, [[0, a], [0.5, b], [1, c]], 0, 1);
  const snowField = (u) => `<defs>${lg(`${u}sk`, [[0, '#6a88a8'], [0.6, '#bcd0e2'], [1, '#e8f2fa']])}</defs><rect width="100" height="100" fill="url(#${u}sk)"/>
      <path d="M0 58 L12 46 L22 52 L36 38 L50 50 L64 40 L80 52 L92 44 L100 50 L100 72 L0 72Z" fill="#a8bed2"/><path d="M12 46 L16 50 M36 38 L42 46 M64 40 L70 46 M92 44 L96 48" stroke="#fff" stroke-width="1" fill="none"/>
      <path d="M0 74 C30 68 60 72 100 68 L100 100 L0 100Z" fill="#f6fbff"/><path d="M0 86 C40 80 70 86 100 80" stroke="#d8e6f2" stroke-width="1.2" fill="none"/>
      ${Array.from({ length: 20 }, (_, k) => `<circle cx="${(k * 37 + 11) % 100}" cy="${(k * 19 + 5) % 64}" r="${0.5 + (k % 3) * 0.35}" fill="#fff" opacity=".85"/>`).join('')}`;
  // ---------- shared vehicle bodies (vehicle pictures and the Hoth battle) ----------
  // AT-AT, side view facing right, feet on y=87 of a 100x100 box.
  const atatBody = (u) => `<defs>${metal(u, 'm', '#dfe4ea', '#9aa2ae', '#4a525e')}</defs>
      <g stroke="#2a3038" stroke-width=".7">
        ${[[30, 0], [64, 1]].map(([x]) => `<path d="M${x} 54 L${x - 2} 66 L${x + 1} 84" stroke="#4a525e" stroke-width="5.4" fill="none"/><path d="M${x} 54 L${x - 2} 66 L${x + 1} 84" stroke="#9aa2ae" stroke-width="3" fill="none"/>`).join('')}
        <path d="M26 30 L72 30 L78 38 L76 54 L24 54 L20 42Z" fill="url(#${u}m)"/>
        <path d="M26 30 L72 30 L74 34 L23 34Z" fill="#f2f4f8" opacity=".6"/>
        ${[32, 42, 52, 62].map((x) => `<path d="M${x} 34 L${x} 54" stroke="#5a626e" stroke-width=".5"/>`).join('')}<path d="M22 44 L76 44" stroke="#5a626e" stroke-width=".5"/>
        ${[[30, 26], [44, 30], [56, 26]].map(([x, w]) => `<rect x="${x}" y="47" width="${w / 4}" height="2.4" fill="#3a424c"/>`).join('')}
        <path d="M76 38 L82 36 L86 40 L84 46 L77 46Z" fill="#8a929e"/>${[0, 1, 2].map((k) => `<path d="M78 ${38.6 + k * 2.6} L84 ${38 + k * 2.6}" stroke="#4a525e" stroke-width=".5"/>`).join('')}
        <path d="M84 37 L96 37 L99 42 L97 48 L86 48 L84 42Z" fill="url(#${u}m)"/><path d="M90 40 L96 40 L97 43 L90 43Z" fill="#1a1e24"/>
        <path d="M97 46 L102 46 M96 48 L101 49" stroke="#3a424c" stroke-width="1.4"/><circle cx="88" cy="46" r="1" fill="#ff5a3a"/>
        ${[40, 58].map((x) => `<path d="M${x} 54 L${x + 2} 66 L${x - 1} 84" stroke="#4a525e" stroke-width="5.4" fill="none"/><path d="M${x} 54 L${x + 2} 66 L${x - 1} 84" stroke="#b8c0ca" stroke-width="3" fill="none"/>`).join('')}
        ${[28, 39, 56, 65].map((x) => `<circle cx="${x + 1}" cy="66" r="3" fill="#8a929e"/><path d="M${x - 4} 84 L${x + 5} 84 L${x + 4} 87 L${x - 3} 87Z" fill="#5a626e"/>`).join('')}
      </g>`;
  // T-47 snowspeeder seen from above and a little to the side, nose right:
  // the wedge hull, orange flashes, the two-seat canopy, twin laser cannons
  // and the split airbrake at the tail.
  const t47Body = (u) => `<defs>${lg(`${u}tp`, [[0, '#f6f8fa'], [0.55, '#dde2e7'], [1, '#aab2ba']])}${lg(`${u}sd`, [[0, '#8a929a'], [1, '#3a4048']])}${lg(`${u}gl`, [[0, '#a8dcff'], [0.5, '#3a6a9a'], [1, '#14243a']], 1, 1)}</defs>
      <g stroke="#2a3038" stroke-width=".6" stroke-linejoin="round">
        <path d="M22 64 L70 68 L95 54 L95 58 L70 73 L23 69Z" fill="url(#${u}sd)"/>
        <path d="M22 37 L10 30 L7 41 L21 47Z" fill="#c8ced6"/><path d="M10 30 L7 41" stroke="#8a929a" stroke-width="1"/>
        <path d="M21 57 L7 61 L10 72 L22 66Z" fill="#b4bcc4"/>
        <path d="M22 36 L68 36 L95 54 L70 68 L22 66 L18 51Z" fill="url(#${u}tp)"/>
        <path d="M24 39 L67 39 L72 42.4 L24 42.4Z" fill="#e8742a" stroke="none"/><path d="M24 60 L70 61.6 L66 64.4 L24 63.4Z" fill="#e8742a" stroke="none"/>
        <path d="M26 44.6 L48 44.6 L48 57.6 L26 57.6Z" fill="#9aa2aa"/>
        ${[0, 1, 2, 3, 4, 5].map((k) => `<path d="M${28 + k * 3.4} 46.4 V56" stroke="#5a626a" stroke-width=".7"/>`).join('')}
        <path d="M50 44 L58 44 M50 58 L60 58 M30 51 L46 51" stroke="#8a929a" stroke-width=".5" fill="none"/>
        <path d="M58 46 L74 46 L82 51.6 L74 57.4 L58 57.4 L54 51.6Z" fill="url(#${u}gl)"/>
        <path d="M66 46 V57.4 M58 51.6 H82" stroke="#c8d0d8" stroke-width=".6"/>
        <circle cx="71" cy="51.6" r="2.2" fill="#f08a2a" stroke="#6a3010" stroke-width=".4"/><circle cx="62" cy="51.6" r="2" fill="#f08a2a" stroke="#6a3010" stroke-width=".4"/>
        <path d="M68 37.4 L92 43" stroke="#3a4048" stroke-width="2.2"/><path d="M68 37 L92 42.6" stroke="#9aa2aa" stroke-width=".7"/>
        <path d="M70 66.4 L94 60.6" stroke="#3a4048" stroke-width="2.2"/><path d="M70 66 L94 60.2" stroke="#9aa2aa" stroke-width=".7"/>
        <rect x="91" y="41.6" width="3" height="2.4" fill="#14161a"/><rect x="93" y="59.4" width="3" height="2.4" fill="#14161a"/>
        <path d="M30 66.4 L36 70 M52 67.4 L56 71" stroke="#2a3038" stroke-width="1"/>
        <path d="M36 40 C40 41 42 43 40 44" stroke="#5a5048" stroke-width=".8" fill="none" opacity=".6"/>
        <path d="M84 50 C86 51 88 51.4 90 51" stroke="#6a6258" stroke-width=".8" fill="none" opacity=".5"/>
      </g>`;
  const VEHICLES = {
    v_atat: { name: 'AT-AT', draw: (u) => `${snowField(u)}
      <g transform="translate(16 58) scale(.32)" fill="#7a8a9e" opacity=".55"><path d="M10 0 L80 0 L84 12 L80 26 L6 26 L2 12Z"/><path d="M84 6 L104 6 L108 16 L100 22 L84 20Z"/>${[12, 30, 54, 70].map((x) => `<rect x="${x}" y="26" width="8" height="40"/>`).join('')}</g>
      <ellipse cx="54" cy="86" rx="38" ry="3" fill="#6a7a8a" opacity=".3"/>${atatBody(u)}` },
    v_atst: { name: 'AT-ST', draw: (u) => {
      // Side view, facing right: boxy cockpit on a hip joint, legs that bend
      // forward at the knee and back at the ankle, wide splayed feet.
      const leg = (hx, hy, kx, ky, ax, ay, dark) => {
        const c1 = dark ? '#4a525c' : '#8a929e'; const c2 = dark ? '#2a3038' : '#c8ced6';
        return `<path d="M${hx} ${hy} L${kx} ${ky}" stroke="${dark ? '#1a1e24' : '#2a3038'}" stroke-width="6.4" stroke-linecap="round"/><path d="M${hx} ${hy} L${kx} ${ky}" stroke="${c1}" stroke-width="4.6" stroke-linecap="round"/><path d="M${hx - 1.2} ${hy} L${kx - 1.2} ${ky}" stroke="${c2}" stroke-width="1.2" opacity=".7"/>
          <path d="M${kx} ${ky} L${ax} ${ay}" stroke="${dark ? '#1a1e24' : '#2a3038'}" stroke-width="5.4" stroke-linecap="round"/><path d="M${kx} ${ky} L${ax} ${ay}" stroke="${c1}" stroke-width="3.8" stroke-linecap="round"/><path d="M${kx + 1} ${ky + 1} L${ax + 1} ${ay}" stroke="${c2}" stroke-width="1" opacity=".6"/>
          <path d="M${(hx + kx) / 2 + 2.4} ${(hy + ky) / 2 - 1} L${(kx + ax) / 2 + 2.4} ${(ky + ay) / 2}" stroke="${dark ? '#3a4048' : '#5a626c'}" stroke-width="1.1"/>
          <circle cx="${kx}" cy="${ky}" r="3.4" fill="${dark ? '#3a4048' : '#6a727c'}" stroke="#1a1e24" stroke-width=".6"/><circle cx="${kx}" cy="${ky}" r="1.2" fill="${dark ? '#1a1e24' : '#3a4048'}"/>
          <circle cx="${ax}" cy="${ay}" r="2.4" fill="${dark ? '#3a4048' : '#6a727c'}" stroke="#1a1e24" stroke-width=".6"/>
          <path d="M${ax - 8} ${ay + 6} L${ax - 3} ${ay + 0.6} L${ax + 4} ${ay + 0.6} L${ax + 11} ${ay + 5} L${ax + 12} ${ay + 7} L${ax - 9} ${ay + 7}Z" fill="${dark ? '#3a4048' : '#7a828c'}" stroke="#1a1e24" stroke-width=".6"/>
          <path d="M${ax + 3} ${ay + 3.4} L${ax + 9} ${ay + 6} M${ax - 4} ${ay + 3.4} L${ax - 7} ${ay + 6}" stroke="#1a1e24" stroke-width=".6"/>`;
      };
      return `<defs>${lg(`${u}sk`, [[0, '#1a3420'], [0.55, '#3e6234'], [1, '#86a464']])}${metal(u, 'm', '#e2e6ea', '#9aa2ac', '#4a525c')}${metal(u, 'h', '#c8ced6', '#7a828c', '#2a3038')}${rg(`${u}lt`, [[0, '#fff2c0', 0.6], [1, '#fff2c0', 0]], 0.5, 0.5, 0.5)}</defs>
      <rect width="100" height="100" fill="url(#${u}sk)"/>
      <circle cx="70" cy="18" r="30" fill="url(#${u}lt)"/>
      ${[[2, 9, '#2a1e14'], [16, 6, '#3a2a1c'], [80, 11, '#2e2016'], [94, 6, '#3a2a1c']].map(([x, w, c]) => `<rect x="${x}" y="0" width="${w}" height="92" fill="${c}"/><path d="M${x + w * 0.25} 0 V92" stroke="#5a4430" stroke-width=".8" opacity=".6"/><path d="M${x + w * 0.7} 10 V80" stroke="#1a120a" stroke-width=".6" opacity=".7"/>`).join('')}
      ${[[30, 3.6], [62, 2.6], [70, 3]].map(([x, w]) => `<rect x="${x}" y="0" width="${w}" height="80" fill="#2a3a24" opacity=".55"/>`).join('')}
      ${Array.from({ length: 14 }, (_, k) => `<ellipse cx="${(k * 29) % 104}" cy="${(k * 11) % 26}" rx="${9 + (k % 3) * 3}" ry="${4 + (k % 2) * 2}" fill="${k % 2 ? '#2a4a24' : '#365a2c'}" opacity=".85"/>`).join('')}
      <path d="M0 88 C24 84 52 88 100 84 L100 100 L0 100Z" fill="#2a3a1c"/>
      ${Array.from({ length: 22 }, (_, k) => `<path d="M${(k * 4.9) % 100} ${92 + (k % 3) * 3} q1.4 -6 3 -8 M${(k * 4.9 + 2) % 100} ${93 + (k % 2) * 3} q-1 -5 -2.6 -6" stroke="${k % 2 ? '#5a7a34' : '#4a6a2a'}" stroke-width=".8" fill="none"/>`).join('')}
      <ellipse cx="48" cy="92" rx="26" ry="2.6" fill="#000" opacity=".35"/>
      ${leg(44, 50, 52, 66, 38, 82, true)}
      <path d="M40 44 L56 44 L57 52 L39 52Z" fill="#4a525c" stroke="#1a1e24" stroke-width=".6"/>
      <circle cx="47" cy="50" r="5.2" fill="#6a727c" stroke="#1a1e24" stroke-width=".7"/><circle cx="47" cy="50" r="2" fill="#3a4048"/>
      ${leg(48, 51, 60, 67, 50, 84, false)}
      <path d="M44 38 L54 38 L55 45 L43 45Z" fill="#5a626c" stroke="#1a1e24" stroke-width=".6"/>
      <path d="M43 40 L55 40" stroke="#2a3038" stroke-width=".6"/>
      <g stroke="#1a1e24" stroke-width=".7" stroke-linejoin="round">
        <path d="M30 20 L64 17 L74 22 L78 30 L72 38 L58 41 L34 41 L27 34 L26 26Z" fill="url(#${u}m)"/>
        <path d="M30 20 L64 17 L74 22 L72 24 L32 25 L27 26Z" fill="#f4f6f8" opacity=".6" stroke="none"/>
        <path d="M26 26 L27 34 L34 41 L36 30Z" fill="url(#${u}h)"/>
        <path d="M64 17 L74 22 L78 30 L74 31 L66 25Z" fill="#c8ced6"/>
        <path d="M67 26 L76 30.6 L74 33 L66 29Z" fill="#0c0e12"/><path d="M68 27.4 L73 29.8" stroke="#6ad8ff" stroke-width=".5"/>
        <path d="M58 26 L64 25.6 L64 29 L58 29.4Z" fill="#0c0e12"/>
        <rect x="40" y="13.4" width="13" height="4.2" rx="1" fill="#8a929e"/><rect x="43" y="11.6" width="7" height="2.2" rx=".8" fill="#6a727c"/>
        <path d="M36 30 L58 30 M38 35 L60 34.4 M48 20 L48 29" stroke="#4a525c" stroke-width=".55" fill="none"/>
        ${[[40, 32.4], [44, 32.4], [52, 32]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7" fill="#3a4048" stroke="none"/>`).join('')}
        <rect x="70" y="35" width="15" height="2" rx=".8" fill="#3a4048"/><rect x="70" y="38" width="13" height="1.8" rx=".8" fill="#3a4048"/>
        <rect x="66" y="34" width="6" height="6" rx="1" fill="#5a626c"/>
        <path d="M24 28 L18 27 L18 33 L24 33Z" fill="#5a626c"/><rect x="10" y="29" width="8" height="1.6" fill="#3a4048"/>
      </g>
      <path d="M86 36 L96 36" stroke="#ff4a3a" stroke-width="1.2" opacity=".85"/><circle cx="85.4" cy="36" r="1.4" fill="#ffb07a"/>` ; } },
    v_speeder: { name: 'Speeder Bike', draw: (u) => `<defs>${lg(`${u}sk`, [[0, '#14301a'], [0.6, '#3e6a32'], [1, '#86a860']])}${metal(u, 'm', '#e2e6ea', '#9aa2ac', '#3a4048')}${lg(`${u}w`, [[0, '#ffffff'], [1, '#c8ced6']])}${rg(`${u}eg`, [[0, '#ffe2b0'], [0.5, '#ff8a3a', 0.5], [1, '#ff6a2a', 0]], 0.5, 0.5, 0.5)}</defs>
      <rect width="100" height="100" fill="url(#${u}sk)"/>
      ${[[6, 8], [24, 5], [44, 10], [74, 7], [90, 9]].map(([x, w], i) => `<rect x="${x}" y="0" width="${w}" height="100" fill="${i % 2 ? '#2a1e14' : '#3a2a1c'}" opacity=".9"/><path d="M${x + w * 0.3} 0 V100" stroke="#5a4430" stroke-width=".7" opacity=".5"/>`).join('')}
      ${Array.from({ length: 12 }, (_, k) => `<ellipse cx="${(k * 31) % 104}" cy="${(k * 7) % 20}" rx="12" ry="5" fill="${k % 2 ? '#1e3a1e' : '#2a4a24'}"/>`).join('')}
      <path d="M0 84 C30 80 60 84 100 80 L100 100 L0 100Z" fill="#2a3e1c"/>
      ${Array.from({ length: 9 }, (_, k) => `<path d="M${-10 + k * 4} ${40 + k * 5} L${26 + k * 3} ${40 + k * 5}" stroke="#e8f2e0" stroke-width="${0.5 + (k % 3) * 0.3}" opacity="${0.18 + (k % 3) * 0.08}" stroke-linecap="round"/>`).join('')}
      <ellipse cx="54" cy="82" rx="30" ry="2.2" fill="#000" opacity=".3"/>
      <g stroke="#1a1e24" stroke-width=".6" stroke-linejoin="round">
        <circle cx="16" cy="60" r="7" fill="url(#${u}eg)" stroke="none"/>
        <path d="M66 54.6 L92 51.4 M66 58.4 L92 56.4" stroke="#5a626c" stroke-width="1.4"/>
        <path d="M66 54.6 L92 51.4 M66 58.4 L92 56.4" stroke="#aab2bc" stroke-width=".5"/>
        <path d="M86 43 L93 44 L94 52 L87 51.6Z" fill="url(#${u}m)"/><path d="M86 53.4 L93 53.6 L94 62 L87 61Z" fill="url(#${u}m)"/>
        <path d="M87 44.6 L92 45.2 M87 55 L92 55.4" stroke="#5a626c" stroke-width=".4"/>
        <path d="M20 56 L32 52 L52 51 L68 53.4 L70 58 L62 62 L30 63 L20 61Z" fill="url(#${u}m)"/>
        <path d="M22 56.6 L32 53 L52 52 L66 54 L50 55.4 L30 56.4Z" fill="#f4f6f8" opacity=".55" stroke="none"/>
        <path d="M28 62.6 L60 62 L56 68 L46 70 L32 68Z" fill="#4a525c"/>
        <path d="M34 68 L28 76 L36 76 L42 69.4Z" fill="#5a626c"/><path d="M48 69.6 L46 77 L54 77 L56 68Z" fill="#5a626c"/>
        <rect x="16.4" y="55" width="6" height="7.6" rx="1" fill="#3a4048"/><path d="M17.6 57 H22 M17.6 59 H22 M17.6 61 H22" stroke="#1a1e24" stroke-width=".5"/>
        <path d="M36 57 L58 56.4 M40 60 L56 59.6" stroke="#4a525c" stroke-width=".5" fill="none"/>
        <rect x="56" y="57" width="6" height="2.2" fill="#2a3038"/><circle cx="64" cy="56" r="1" fill="#ff4a3a" stroke="none"/>
        <path d="M60 52 L66 44 L69 44.6" stroke="#2a3038" stroke-width="1.4" fill="none"/>
        <path d="M40 50 C40 47 50 46 54 48 L54 51 L40 51.6Z" fill="#2a2a2e"/>
        <path d="M46 48 L56 50 L60 56 L58 57.6 L53 53.4 L45 52Z" fill="#1a1a1e"/>
        <path d="M55 50 L60.6 56.4 L58.6 58 L54 53Z" fill="url(#${u}w)"/>
        <path d="M58 56.6 L63 57 L62.6 59.4 L57.6 59Z" fill="#1a1a1e"/>
        <path d="M44 34 C46 32 54 33 56 36 L54 48 L44 49Z" fill="#1a1a1e"/>
        <path d="M45 35 C47 33.4 53 34 55 36.4 L53.4 45 L46 46Z" fill="url(#${u}w)"/>
        <path d="M47 38 L53 38.6 M46.6 42 L52.6 42.4" stroke="#8a929e" stroke-width=".5"/>
        <path d="M54 37 L62 43 L66 44" stroke="#1a1a1e" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        <path d="M54 37 L61.6 42.6" stroke="#f4f6f8" stroke-width="1.6" stroke-linecap="round" fill="none"/>
        <circle cx="66.4" cy="44.4" r="1.4" fill="#1a1a1e"/>
        <path d="M46 26 C46 20 56 19 58 24 L59 30 L56 33 L47 33 C45 31 45.4 28 46 26Z" fill="url(#${u}w)"/>
        <path d="M50 25.6 L59 25.6 L59.6 28.4 L50 28.6Z" fill="#14161a"/>
        <path d="M58 24 C61 24 62 25.6 61 27" stroke="#f4f6f8" stroke-width="1.2" fill="none"/>
        <path d="M54 29.6 L57 32.6 L54 33.4Z" fill="#14161a"/>
        <path d="M47 23 C49 20.6 54 20.4 56 22" stroke="#fff" stroke-width=".8" fill="none" opacity=".9"/>
      </g>` },
    v_sandcrawler: { name: 'Sandcrawler', draw: (u) => {
      // The Jawa fortress on treads: a tall rust-brown hull whose front leans
      // back, a stepped upper deck, a lowered ramp, four track units.
      const tracks = (x, w) => `<rect x="${x}" y="73" width="${w}" height="13" rx="6.4" fill="#2a2420" stroke="#14100c" stroke-width=".6"/>
        ${Array.from({ length: Math.floor(w / 4.4) }, (_, k) => `<circle cx="${x + 4 + k * 4.4}" cy="79.6" r="2.4" fill="#4a423a" stroke="#1a1612" stroke-width=".5"/><circle cx="${x + 4 + k * 4.4}" cy="79.6" r=".8" fill="#2a2420"/>`).join('')}
        <path d="M${x + 3} 73.6 H${x + w - 3}" stroke="#5a5048" stroke-width=".8"/>${Array.from({ length: Math.floor(w / 2) }, (_, k) => `<path d="M${x + 2 + k * 2} 85.4 v-1.4" stroke="#14100c" stroke-width=".6"/>`).join('')}`;
      return `<defs>${lg(`${u}sk`, [[0, '#e8a050'], [0.5, '#f6c888'], [1, '#ffe6b8']])}${lg(`${u}sd`, [[0, '#b8703a'], [0.5, '#9a5a2e'], [1, '#6a3c1e']])}${lg(`${u}fr`, [[0, '#d89a5a'], [1, '#a8683a']], 1, 0)}${lg(`${u}up`, [[0, '#c8844a'], [1, '#8a5028']])}${lg(`${u}du`, [[0, '#e8b070'], [1, '#c88a4a']])}</defs>
      <rect width="100" height="100" fill="url(#${u}sk)"/>${glowAt(u, 'sn', 18, 20, 16, '#fff6d8', 0.8)}<circle cx="18" cy="20" r="5" fill="#fffbe8"/><circle cx="30" cy="26" r="3" fill="#ffe0a0"/>
      <path d="M0 66 L8 58 L16 60 L22 52 L34 56 L40 62 L0 70Z" fill="#c88a5a" opacity=".55"/><path d="M60 64 L72 54 L80 58 L90 50 L100 56 L100 66Z" fill="#c88a5a" opacity=".5"/>
      <path d="M0 76 C30 70 70 78 100 72 L100 100 L0 100Z" fill="url(#${u}du)"/>
      <ellipse cx="52" cy="87" rx="44" ry="3.4" fill="#6a3c1e" opacity=".4"/>
      ${tracks(10, 30)}${tracks(62, 30)}
      <g stroke="#2a1608" stroke-width=".7" stroke-linejoin="round">
        <path d="M8 74 L12 58 L88 58 L96 74Z" fill="#7a4424"/>
        <path d="M12 60 L16 30 L36 24 L64 22 L90 60Z" fill="url(#${u}sd)"/>
        <path d="M64 22 L90 60 L95 57 L70 20Z" fill="url(#${u}fr)"/>
        <path d="M24 28 L28 14 L50 11 L56 22Z" fill="url(#${u}up)"/>
        <path d="M50 11 L56 22 L60 21 L54 10Z" fill="#c8884e"/>
        <path d="M32 13 L33 6 L44 5 L45 12Z" fill="#9a5a2e"/><path d="M38 5 V-2 M42 5 V0" stroke="#3a2010" stroke-width=".8"/>
        ${[30, 34, 38, 42, 46].map((x) => `<rect x="${x}" y="17" width="2.4" height="2" fill="#1a0e06" stroke="none"/>`).join('')}
        ${[[18, 40], [30, 37], [44, 35], [58, 35]].map(([x, y]) => `<rect x="${x}" y="${y}" width="8" height="2.6" fill="#2a160a" stroke="none"/>`).join('')}
        ${[38, 46, 54].map((y) => `<path d="M${14 - (y - 38) * 0.05} ${y} L${70 + (y - 38) * 0.8} ${y}" stroke="#5a3016" stroke-width=".5"/>`).join('')}
        ${[22, 30, 38, 46, 54].map((x) => `<path d="M${x} ${28 - x * 0.08} V58" stroke="#5a3016" stroke-width=".5"/>`).join('')}
        <path d="M74 38 L86 56 L90 54 L78 36Z" fill="#2a160a"/>
        <path d="M80 60 L90 60 L100 82 L92 82Z" fill="#8a5028"/>${[64, 68, 72, 76].map((y) => `<path d="M${80 + (y - 60) * 0.48} ${y} L${90 + (y - 60) * 0.48} ${y}" stroke="#4a2810" stroke-width=".5"/>`).join('')}
        ${[[20, 30, 46], [40, 26, 50], [60, 26, 54], [26, 46, 58]].map(([x, y, y2]) => `<path d="M${x} ${y} C${x + 1} ${(y + y2) / 2} ${x - 1} ${(y + y2) / 2} ${x + 0.6} ${y2}" stroke="#4a2410" stroke-width="1.6" opacity=".45"/>`).join('')}
        <path d="M16 30 L36 24 L64 22" stroke="#e8a868" stroke-width=".8" fill="none"/>
      </g>
      ${[[84, 80], [89, 81], [94, 82]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M-1.6 0 L-1 -4 C-1 -5.6 1 -5.6 1 -4 L1.6 0Z" fill="#6a4a2a"/><circle cx="-.4" cy="-4" r=".35" fill="#ffd23f"/><circle cx=".4" cy="-4" r=".35" fill="#ffd23f"/></g>`).join('')}` ;
    } },
    v_podracer: { name: 'Podracer', draw: (u) => {
      // Anakin's racer: two long engines with split air scoops, an energy
      // binder crackling between them, and the little cockpit towed on cables.
      const engine = (x0, x1, cy, r, id) => `<defs>${lg(`${u}${id}`, [[0, '#f2f4f6'], [0.3, '#c0c8d0'], [0.65, '#6a727e'], [1, '#262a32']])}</defs>
        <circle cx="${x0 - 2}" cy="${cy}" r="${r * 1.4}" fill="url(#${u}ex)"/>
        <path d="M${x0} ${cy - r * 0.78} L${x1} ${cy - r} L${x1} ${cy + r} L${x0} ${cy + r * 0.78}Z" fill="url(#${u}${id})" stroke="#1a1e24" stroke-width=".6"/>
        ${[0.18, 0.36, 0.5, 0.72].map((t) => { const x = x0 + (x1 - x0) * t; const rr = r * (0.78 + 0.22 * t); return `<path d="M${x.toFixed(1)} ${(cy - rr).toFixed(1)} V${(cy + rr).toFixed(1)}" stroke="#2a3038" stroke-width=".8" opacity=".8"/>`; }).join('')}
        <path d="M${x0 + (x1 - x0) * 0.5} ${cy - r * 0.94} L${x0 + (x1 - x0) * 0.72} ${cy - r * 0.96} L${x0 + (x1 - x0) * 0.66} ${cy - r * 1.7} L${x0 + (x1 - x0) * 0.56} ${cy - r * 1.7}Z" fill="#8a929e" stroke="#1a1e24" stroke-width=".5"/>
        <path d="M${x0 + 4} ${cy - r * 0.5} L${x1 - 6} ${cy - r * 0.62}" stroke="#ffffff" stroke-width="${(r * 0.18).toFixed(2)}" opacity=".5"/>
        <rect x="${x0 + (x1 - x0) * 0.22}" y="${cy + r * 0.2}" width="${(x1 - x0) * 0.1}" height="${r * 0.4}" fill="#3a6aa8" stroke="#1a1e24" stroke-width=".4"/>
        <ellipse cx="${x0}" cy="${cy}" rx="${r * 0.3}" ry="${r * 0.78}" fill="#14161a" stroke="#1a1e24" stroke-width=".5"/>
        <ellipse cx="${x0}" cy="${cy}" rx="${r * 0.18}" ry="${r * 0.5}" fill="#ff8a3a"/>
        <ellipse cx="${x1}" cy="${cy}" rx="${r * 0.42}" ry="${r}" fill="#9aa2ac" stroke="#1a1e24" stroke-width=".6"/>
        <ellipse cx="${x1 + 0.4}" cy="${cy}" rx="${r * 0.3}" ry="${r * 0.78}" fill="#14161a"/>
        ${[0.55, 0.3].map((k) => `<ellipse cx="${x1 + 0.6}" cy="${cy}" rx="${r * 0.3 * k}" ry="${r * 0.78 * k}" fill="none" stroke="#5a626e" stroke-width=".5"/>`).join('')}
        <path d="M${x1 - 1} ${cy - r} L${x1 + r * 1.1} ${cy - r * 1.55} L${x1 + r * 1.3} ${cy - r * 0.9} L${x1 + 0.6} ${cy - r * 0.35}Z" fill="#c8ced6" stroke="#1a1e24" stroke-width=".5"/>
        <path d="M${x1 - 1} ${cy + r} L${x1 + r * 1.1} ${cy + r * 1.55} L${x1 + r * 1.3} ${cy + r * 0.9} L${x1 + 0.6} ${cy + r * 0.35}Z" fill="#8a929e" stroke="#1a1e24" stroke-width=".5"/>`;
      return `<defs>${lg(`${u}sk`, [[0, '#f0a050'], [0.6, '#ffc880'], [1, '#ffe2b0']])}${lg(`${u}cw`, [[0, '#c8703a'], [1, '#8a4420']], 1, 0)}${rg(`${u}ex`, [[0, '#ffd08a', 0.8], [0.5, '#ff7a2a', 0.35], [1, '#ff7a2a', 0]], 0.5, 0.5, 0.5)}${lg(`${u}pd`, [[0, '#6a9ad8'], [1, '#1e3e7a']])}</defs>
      <rect width="100" height="100" fill="url(#${u}sk)"/>
      <path d="M0 0 L0 100 L14 100 L22 60 L16 30 L22 0Z" fill="url(#${u}cw)"/><path d="M100 0 L100 100 L88 100 L80 64 L86 34 L80 0Z" fill="url(#${u}cw)"/>
      ${[20, 34, 48, 62, 76].map((y) => `<path d="M0 ${y} L${18 + (y % 3)} ${y + 2} M100 ${y + 4} L${84 - (y % 3)} ${y + 6}" stroke="#6a3418" stroke-width=".8" opacity=".6"/>`).join('')}
      <path d="M14 100 L22 74 L80 74 L88 100Z" fill="#d8945a"/>
      ${Array.from({ length: 10 }, (_, k) => `<path d="M${-6 + k * 3} ${48 + k * 3} L${18 + k * 2} ${48 + k * 3}" stroke="#fff2dc" stroke-width=".6" opacity=".35"/>`).join('')}
      <path d="M2 64 C10 60 20 64 30 60 C24 70 10 72 2 70Z" fill="#e8b888" opacity=".6"/>
      <path d="M20 54 C30 52 36 48 44 46 M20 55 C28 58 34 62 36 62" stroke="#3a3e46" stroke-width=".7" fill="none"/>
      ${engine(44, 84, 46, 5.4, 'e1')}
      ${engine(36, 80, 62, 7, 'e2')}
      <g style="filter:drop-shadow(0 0 2px #6ad8ff)"><path d="M86 47 L82 51 L87 54 L81 58 L84 61" stroke="#e8faff" stroke-width=".9" fill="none"/><path d="M86 47 L84 52 L88 56 L83 61" stroke="#6ad8ff" stroke-width=".6" fill="none" opacity=".8"/></g>
      <g stroke="#14161a" stroke-width=".6">
        <path d="M6 57 C6 51 12 48.6 18 50.4 L23 54.6 L18 59 C12 61 6 61 6 57Z" fill="url(#${u}pd)"/>
        <path d="M8 55 L21 54.6" stroke="#ffd23f" stroke-width="1.2"/>
        <path d="M11 52 C12 50.4 16 50.4 17 52Z" fill="#1a1e24"/><circle cx="14" cy="51" r="1.6" fill="#c8a070"/>
        <path d="M3 57 L6 56 M3 59 L6 58.6" stroke="#ff8a3a" stroke-width="1"/>
      </g>` ;
    } },
    v_snowspeeder: { name: 'Snowspeeder', draw: (u) => `${snowField(u)}
      <path d="M0 50 L14 34 L26 44 L40 28 L56 42 L70 30 L86 40 L100 32 L100 56 L0 56Z" fill="#e8f0f8"/><path d="M14 34 L20 42 L26 44 M40 28 L46 38 L56 42 M70 30 L76 38 L86 40" stroke="#9ab0c8" stroke-width=".8" fill="none"/>
      <path d="M0 58 C30 54 60 60 100 56 L100 100 L0 100Z" fill="#f6fafd"/>
      <ellipse cx="54" cy="84" rx="30" ry="3" fill="#6a8aa8" opacity=".35"/>
      ${Array.from({ length: 8 }, (_, k) => `<path d="M${-8 + k * 2} ${40 + k * 4} L${14 + k * 2} ${40 + k * 4}" stroke="#ffffff" stroke-width=".7" opacity=".55"/>`).join('')}
      <g transform="translate(50 52) rotate(-8) translate(-50 -52)">${t47Body(u)}</g>
      ${Array.from({ length: 20 }, (_, k) => `<circle cx="${(k * 37) % 100}" cy="${(k * 23) % 100}" r="${0.4 + (k % 3) * 0.3}" fill="#fff" opacity=".8"/>`).join('')}` },
  };

  // ---------- creatures ----------
  // Each creature: a lit scene (sky, ground, light source), a shaded body
  // (base, shadow side, highlight), and the details that make it read.
  const shadeG = (u, id, a, b, c) => lg(`${u}${id}`, [[0, a], [0.55, b], [1, c]], 0.4, 1);
  const glowAt = (u, id, x, y, r, col, op = 0.6) => `<defs>${rg(`${u}${id}`, [[0, col, op], [1, col, 0]], 0.5, 0.5, 0.5)}</defs><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${u}${id})"/>`;
  const hair = (x, y, n, len, ang, col, w = 0.6) => Array.from({ length: n }, (_, k) => { const a = ang + (k - n / 2) * 0.18; return `<path d="M${(x + k * 1.6).toFixed(1)} ${y} q${(Math.cos(a) * len * 0.5).toFixed(1)} ${(len * 0.4).toFixed(1)} ${(Math.cos(a) * len).toFixed(1)} ${len}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`; }).join('');
  const CREATURES = {
    c_porg: { name: 'Porg', draw: (u) => `<defs>${lg(`${u}s`, [[0, '#4a6a8a'], [0.6, '#a8c4d8'], [1, '#d8e4ec']])}${shadeG(u, 'b', '#b08a62', '#8a6640', '#4a321c')}${rg(`${u}w`, [[0, '#ffffff'], [0.7, '#efe6d8'], [1, '#b8ab98']], 0.45, 0.35, 0.7)}${rg(`${u}e`, [[0, '#3a2a1e'], [0.7, '#140c08'], [1, '#000']], 0.4, 0.35, 0.7)}</defs>
      <rect width="100" height="100" fill="url(#${u}s)"/><path d="M0 46 L14 30 L26 40 L40 22 L54 38 L68 26 L84 42 L100 30 L100 70 L0 70Z" fill="#5a6e7e" opacity=".55"/>
      <path d="M0 74 C20 66 44 70 60 66 C76 62 90 66 100 64 L100 100 L0 100Z" fill="#4e544e"/><path d="M0 82 C30 76 60 80 100 74 L100 100 L0 100Z" fill="#3a3e3a"/>${[[14, 80], [70, 74], [88, 86]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="2.4" fill="#2a2e2a" opacity=".6"/>`).join('')}
      <ellipse cx="50" cy="88" rx="22" ry="3.6" fill="#000" opacity=".35"/>
      <g transform="translate(50 60)">
        <path d="M-22 -4 C-24 -20 -14 -30 0 -30 C14 -30 24 -20 22 -4 C22 14 14 26 0 27 C-14 26 -22 14 -22 -4Z" fill="url(#${u}b)"/>
        <path d="M-15 0 C-16 16 -8 24 0 24 C8 24 16 16 15 0 C10 6 -10 6 -15 0Z" fill="url(#${u}w)"/>
        <path d="M-22 -2 C-32 2 -36 14 -30 22 C-26 14 -22 10 -18 8Z" fill="#7a5634"/><path d="M22 -2 C32 2 36 14 30 22 C26 14 22 10 18 8Z" fill="#6a4a2c"/>
        ${hair(-30, 10, 5, 6, 1.2, '#5a3e24', 0.7)}${hair(22, 10, 5, 6, 1.9, '#4a3220', 0.7)}
        <path d="M-17 -18 C-12 -28 12 -28 17 -18 C12 -14 -12 -14 -17 -18Z" fill="#e8601a"/><path d="M-12 -24 C-6 -27 6 -27 12 -24" stroke="#ffb070" stroke-width="1.2" fill="none"/>
        <path d="M-15 -14 C-14 -4 -6 2 0 0 C6 2 14 -4 15 -14 C10 -10 -10 -10 -15 -14Z" fill="#f2ece2"/>
        <ellipse cx="-7.4" cy="-8" rx="6.6" ry="7" fill="url(#${u}e)"/><ellipse cx="7.4" cy="-8" rx="6.6" ry="7" fill="url(#${u}e)"/>
        <circle cx="-5.2" cy="-10.4" r="2.2" fill="#fff"/><circle cx="9.6" cy="-10.4" r="2.2" fill="#fff"/><circle cx="-9" cy="-5.6" r=".9" fill="#fff" opacity=".7"/><circle cx="5.8" cy="-5.6" r=".9" fill="#fff" opacity=".7"/>
        <path d="M-3.6 -1 C-2 -3 2 -3 3.6 -1 L0 4Z" fill="#e8a040" stroke="#a8601a" stroke-width=".5"/>
        ${hair(-10, 8, 7, 4, 1.57, '#cfc4b0', 0.5)}
        <path d="M-7 25 L-8 30 M-7 25 L-6 30 M-7 25 L-4 29 M7 25 L8 30 M7 25 L6 30 M7 25 L4 29" stroke="#e89a3a" stroke-width="1.2" stroke-linecap="round"/>
      </g>` },
    c_bantha: { name: 'Bantha', draw: (u) => {
      // A shaggy bantha with spiral horns, a Tusken Raider riding on its back.
      const strands = Array.from({ length: 34 }, (_, k) => { const x = 18 + k * 1.9; const y0 = 36 + Math.abs(k - 17) * 0.5 + (k % 3) * 2; const len = 22 + (k % 4) * 4; return `<path d="M${x.toFixed(1)} ${y0} q${(k % 2 ? 1.6 : -1.2)} ${len * 0.5} ${(k % 3) - 1} ${len}" stroke="${k % 3 ? '#3a2414' : '#8a6040'}" stroke-width="${k % 3 ? 0.8 : 0.6}" fill="none" opacity=".8"/>`; }).join('');
      return `<defs>${lg(`${u}sk`, [[0, '#f0a868'], [0.6, '#fbd8a0'], [1, '#ffeacc']])}${lg(`${u}f`, [[0, '#9a6a40'], [0.5, '#6a4426'], [1, '#3a2414']])}${lg(`${u}d`, [[0, '#e8b070'], [1, '#c08040']])}</defs>
      <rect width="100" height="100" fill="url(#${u}sk)"/>${glowAt(u, 'sn', 20, 22, 14, '#fff6d8', 0.8)}<circle cx="20" cy="22" r="4.6" fill="#fffbe8"/><circle cx="31" cy="27" r="2.8" fill="#ffe2a8"/>
      <path d="M0 62 L10 56 L16 58 L24 50 L34 54 L40 60 L0 66Z" fill="#c88a5a" opacity=".5"/><path d="M62 60 L74 52 L84 56 L94 48 L100 52 L100 64Z" fill="#c88a5a" opacity=".45"/>
      <path d="M0 74 C30 68 70 76 100 70 L100 100 L0 100Z" fill="url(#${u}d)"/>
      <ellipse cx="50" cy="88" rx="36" ry="3" fill="#6a3c1e" opacity=".35"/>
      ${[[30, 1], [62, 1]].map(([x]) => `<path d="M${x} 66 L${x - 1} 86 L${x + 7} 86 L${x + 6} 66Z" fill="#2a1a0e"/>`).join('')}
      ${[[24, 0], [56, 0]].map(([x]) => `<path d="M${x} 66 L${x - 1} 86 L${x + 8} 86 L${x + 7} 66Z" fill="#3a2414"/><path d="M${x - 2} 86 L${x + 9} 86 L${x + 8} 88 L${x - 1} 88Z" fill="#14100a"/>`).join('')}
      <path d="M14 58 C12 40 28 28 50 28 C66 28 78 34 82 44 L84 60 C80 70 68 74 50 74 C32 74 16 72 14 58Z" fill="url(#${u}f)"/>
      <path d="M14 60 ${Array.from({ length: 14 }, (_, k) => `L${16 + k * 5} ${72 + (k % 2 ? 8 : 2)}`).join(' ')} L84 62Z" fill="#4a2e1a"/>
      ${strands}
      <path d="M24 34 C36 28 56 28 70 32" stroke="#b88a5a" stroke-width="1.2" fill="none" opacity=".7"/>
      <path d="M76 42 C80 36 90 38 93 46 L94 60 C93 68 86 72 80 68 L76 56Z" fill="#2e1c10"/>
      <path d="M80 66 C80 74 84 80 86 84 C88 78 90 72 90 66Z" fill="#4a2e1a"/>
      ${[82, 85, 88].map((x) => `<path d="M${x} 66 q1 8 0 14" stroke="#2a1a0e" stroke-width=".7" fill="none"/>`).join('')}
      <circle cx="88.6" cy="52" r="1.3" fill="#0a0604"/><circle cx="89" cy="51.6" r=".4" fill="#fff"/>
      <path d="M92 58 C93 59 93 61 92 62" stroke="#14100a" stroke-width=".7" fill="none"/>
      <path d="M80 44 C72 36 78 26 86 28 C94 30 94 42 87 44 C82 45 81 38 86 37 C88 37 89 39 88 40" stroke="#d8c8a0" stroke-width="3.6" fill="none" stroke-linecap="round"/>
      <path d="M80 44 C72 36 78 26 86 28 C94 30 94 42 87 44 C82 45 81 38 86 37" stroke="#8a7a58" stroke-width="3.6" fill="none" stroke-dasharray=".7 1.6" stroke-linecap="butt"/>
      <g transform="translate(46 30)">
        <path d="M-6 0 L-4 -12 L4 -12 L6 0Z" fill="#c8ae84" stroke="#5a4428" stroke-width=".5"/>
        <path d="M-5 -6 L5 -5 M-5.6 -3 L5.6 -2" stroke="#8a6a44" stroke-width=".7"/>
        <circle cx="0" cy="-15.6" r="4.6" fill="#d8c09a" stroke="#5a4428" stroke-width=".5"/>
        <path d="M-4.4 -17 Q0 -19 4.4 -17 M-4.6 -14.6 Q0 -16 4.6 -14.6" stroke="#9a7a54" stroke-width=".7" fill="none"/>
        <circle cx="-1.8" cy="-15.6" r="1.3" fill="#14100a" stroke="#8a929e" stroke-width=".5"/><circle cx="1.8" cy="-15.6" r="1.3" fill="#14100a" stroke="#8a929e" stroke-width=".5"/>
        <rect x="-1" y="-13.4" width="2" height="2" fill="#5a626c"/>
        <path d="M-10 6 L10 -30" stroke="#a88a5a" stroke-width="1.4"/><path d="M10 -30 C12 -33 14 -32 14 -35 M10 -30 C8 -33 6 -33 6 -36" stroke="#a88a5a" stroke-width="1.1" fill="none"/>
      </g>` ;
    } },
    c_tauntaun: { name: 'Tauntaun', draw: (u) => `<defs>${lg(`${u}sk`, [[0, '#7a96b4'], [0.6, '#c4d4e4'], [1, '#eef4fa']])}${lg(`${u}f`, [[0, '#e6ded2'], [0.6, '#b4aa9a'], [1, '#7a7062']], 1, 1)}${lg(`${u}c`, [[0, '#d8a870'], [1, '#9a6a3a']])}</defs>
      <rect width="100" height="100" fill="url(#${u}sk)"/>
      <path d="M0 58 L14 40 L26 50 L40 32 L54 46 L68 34 L84 46 L100 36 L100 64 L0 64Z" fill="#e2ecf6"/><path d="M14 40 L20 48 M40 32 L46 42 M68 34 L74 42" stroke="#9ab0c8" stroke-width=".8" fill="none"/>
      <path d="M0 66 C30 62 60 68 100 62 L100 100 L0 100Z" fill="#f6fafd"/>
      <ellipse cx="46" cy="88" rx="26" ry="2.6" fill="#7a96b4" opacity=".35"/>
      <g stroke="#3a342c" stroke-width=".6" stroke-linejoin="round">
        <path d="M38 62 C26 66 16 74 8 86 C18 82 28 76 42 70Z" fill="url(#${u}f)"/>
        <path d="M40 66 L36 76 L28 84 L38 86 L40 80 L46 72Z" fill="#8a8070"/>
        <path d="M34 56 C32 44 42 36 54 38 C62 40 66 48 64 58 C62 66 54 70 44 68 C38 67 35 62 34 56Z" fill="url(#${u}f)"/>
        <path d="M56 42 C58 34 62 28 68 26 L74 30 C68 34 64 40 62 48Z" fill="url(#${u}f)"/>
        <path d="M66 24 C70 19 78 19 82 23 L91 29 C92 32 88 34 84 33 L74 34 C69 32 66 28 66 24Z" fill="#d8d0c4"/>
        <path d="M80 31 L90 30.6" stroke="#5a5046" stroke-width=".6"/><circle cx="89.4" cy="29" r=".6" fill="#3a342c"/>
        <circle cx="77" cy="25" r="1.4" fill="#14100c"/><circle cx="77.4" cy="24.6" r=".4" fill="#fff"/>
        <path d="M70 22 C63 19 61 28 65 32 C69 35 74 31 71 28" stroke="#a89878" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M70 22 C63 19 61 28 65 32 C69 35 74 31" stroke="#6a5e48" stroke-width="2.6" fill="none" stroke-dasharray=".6 1.4"/>
        <path d="M60 50 L64 56 L62 60 M64 56 L67 58" stroke="#5a5046" stroke-width="1.6" fill="none"/>
        <path d="M44 58 C50 58 55 64 53 72 L48 75 C44 70 42 64 44 58Z" fill="#c4baaa"/>
        <path d="M50 72 L44 82 L48 82 L54 74Z" fill="#a89e8e"/><path d="M44 82 L56 86 L56 88 L42 88Z" fill="#6a6052"/>
        ${[40, 44, 48, 52, 56, 60].map((x, k) => `<path d="M${x} ${44 + (k % 2) * 4} q1 4 0 8" stroke="#8a8070" stroke-width=".5" fill="none" opacity=".7"/>`).join('')}
        <path d="M42 40 L58 40 L56 44 L44 44Z" fill="#6a4a2a"/>
        <path d="M45 40 L46 28 C47 24 53 24 54 28 L55 40Z" fill="url(#${u}c)"/>
        <path d="M46 34 L54 34" stroke="#5a3a1a" stroke-width="1"/>
        <circle cx="50" cy="21" r="4.2" fill="#e0c49a"/><path d="M46.4 20 L53.6 20 L53.6 22.4 L46.4 22.4Z" fill="#1a1e24"/><path d="M47 24 C49 25 51 25 53 24 L53 26 L47 26Z" fill="#b8a080"/>
        <path d="M54 32 L66 28" stroke="#6a4a2a" stroke-width="1.2"/>
        <path d="M52 44 L58 52 L54 54Z" fill="#c8a070"/>
      </g>
      <path d="M92 28 C95 26 97 27 98 25 M93 31 C96 31 98 32 99 30" stroke="#ffffff" stroke-width="1" fill="none" opacity=".8"/>
      ${Array.from({ length: 18 }, (_, k) => `<circle cx="${(k * 41) % 100}" cy="${(k * 19) % 100}" r="${0.4 + (k % 3) * 0.3}" fill="#fff" opacity=".85"/>`).join('')}` },
    c_wampa: { name: 'Wampa', draw: (u) => {
      const fur = Array.from({ length: 40 }, (_, k) => { const x = 20 + (k * 37) % 60; const y = 48 + (k * 23) % 50; return `<path d="M${x} ${y} q1 3 0 6" stroke="#a8bccd" stroke-width=".6" fill="none" opacity=".8"/>`; }).join('');
      return `<defs>${lg(`${u}c`, [[0, '#0e1e34'], [0.6, '#24486e'], [1, '#5a86b0']])}${lg(`${u}f`, [[0, '#ffffff'], [0.6, '#e2ecf4'], [1, '#a8bccd']], 1, 1)}${rg(`${u}sb`, [[0, '#9ad8ff', 0.6], [1, '#9ad8ff', 0]], 0.5, 0.5, 0.5)}</defs>
      <rect width="100" height="100" fill="url(#${u}c)"/>
      ${Array.from({ length: 13 }, (_, k) => { const x = k * 8 + 2; const h = 10 + (k * 7) % 16; return `<path d="M${x} 0 L${x + 4} 0 L${x + 2} ${h}Z" fill="#cfe6f6" opacity=".85"/>`; }).join('')}
      <path d="M0 16 C20 26 30 10 50 18 C70 26 80 12 100 18 L100 0 L0 0Z" fill="#9ac0e0" opacity=".6"/>
      <path d="M0 84 C30 80 70 86 100 82 L100 100 L0 100Z" fill="#dceaf4"/>
      <g stroke="#5a6e80" stroke-width=".6" stroke-linejoin="round">
        <path d="M22 100 C20 76 26 58 36 50 L64 50 C74 58 80 76 78 100Z" fill="url(#${u}f)"/>
        <path d="M32 56 C22 48 14 34 12 20 L20 17 C22 30 30 42 40 50Z" fill="url(#${u}f)"/>
        <path d="M68 56 C78 48 86 34 88 20 L80 17 C78 30 70 42 60 50Z" fill="url(#${u}f)"/>
        ${[[12, 18, -1], [88, 18, 1]].map(([x, y, s]) => `<path d="M${x - 4} ${y} C${x - 4} ${y - 6} ${x + 4} ${y - 6} ${x + 4} ${y}Z" fill="#e8f0f6"/>${[-3, 0, 3].map((dx) => `<path d="M${x + dx} ${y - 4} q${s * 1} -4 ${s * 3} -5" stroke="#2a1e1e" stroke-width="1.2" fill="none" stroke-linecap="round"/>`).join('')}`).join('')}
        <path d="M36 52 C34 36 40 27 50 27 C60 27 66 36 64 52 C60 58 40 58 36 52Z" fill="url(#${u}f)"/>
        <path d="M40 34 C30 28 24 40 30 46 C34 50 39 46 37 42" stroke="#d8c8a0" stroke-width="3.4" fill="none" stroke-linecap="round"/>
        <path d="M60 34 C70 28 76 40 70 46 C66 50 61 46 63 42" stroke="#d8c8a0" stroke-width="3.4" fill="none" stroke-linecap="round"/>
        <path d="M40 34 C30 28 24 40 30 46 M60 34 C70 28 76 40 70 46" stroke="#8a7a58" stroke-width="3.4" fill="none" stroke-dasharray=".6 1.6"/>
        <path d="M41 38 L48 40 M59 38 L52 40" stroke="#7a8a9a" stroke-width="1.6" stroke-linecap="round"/>
        <ellipse cx="45" cy="42" rx="2" ry="1.4" fill="#ffd23f"/><ellipse cx="55" cy="42" rx="2" ry="1.4" fill="#ffd23f"/><circle cx="45" cy="42" r=".7" fill="#1a0e00"/><circle cx="55" cy="42" r=".7" fill="#1a0e00"/>
        <path d="M44 46 C46 44 54 44 56 46 L56 50 C54 52 46 52 44 50Z" fill="#c8b8b0"/>
        <path d="M43 50 C46 57 54 57 57 50 C54 52 46 52 43 50Z" fill="#6a1a1a"/>
        ${[45, 48, 52, 55].map((x) => `<path d="M${x - 0.8} 50.6 L${x} ${x === 45 || x === 55 ? 54 : 52.6} L${x + 0.8} 50.6Z" fill="#fff"/>`).join('')}
        <path d="M48.4 46 L50 47 L51.6 46" stroke="#3a2a2a" stroke-width=".6" fill="none"/>
      </g>
      ${fur}
      <circle cx="74" cy="92" r="10" fill="url(#${u}sb)"/>
      <g style="filter:drop-shadow(0 0 2px #6ab8ff)"><path d="M62 96 L88 88" stroke="#6ab8ff" stroke-width="2.6" opacity=".8"/><path d="M62 96 L88 88" stroke="#fff" stroke-width="1"/></g>
      <path d="M57 97.6 L62 96" stroke="#9aa2ac" stroke-width="2.4"/>` ;
    } },
    c_dewback: { name: 'Dewback', draw: (u) => `<defs>${lg(`${u}sk`, [[0, '#f0a868'], [0.6, '#fbd8a0'], [1, '#ffeacc']])}${lg(`${u}s`, [[0, '#a0ae78'], [0.5, '#6e7e4c'], [1, '#3e4a2a']])}${lg(`${u}d`, [[0, '#e8b070'], [1, '#c08040']])}${lg(`${u}w`, [[0, '#ffffff'], [1, '#c8ced6']])}</defs>
      <rect width="100" height="100" fill="url(#${u}sk)"/>${glowAt(u, 'sn', 84, 18, 13, '#fff6d8', 0.8)}<circle cx="84" cy="18" r="4.4" fill="#fffbe8"/>
      ${[[8, 60, 7], [20, 62, 5], [30, 60, 6]].map(([x, y, r]) => `<path d="M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y}Z" fill="#d8a878"/>`).join('')}<rect x="0" y="60" width="40" height="6" fill="#d8a878"/>
      <path d="M0 72 C30 66 70 74 100 68 L100 100 L0 100Z" fill="url(#${u}d)"/>
      <ellipse cx="52" cy="87" rx="40" ry="3" fill="#6a3c1e" opacity=".35"/>
      <g stroke="#2a3418" stroke-width=".6" stroke-linejoin="round">
        <path d="M60 70 L64 84 L70 84 L68 70Z M32 70 L28 84 L34 84 L38 70Z" fill="#3e4a2a"/>
        <path d="M24 66 C14 68 6 74 -2 80 L-2 86 C8 82 18 78 30 72Z" fill="url(#${u}s)"/>
        <path d="M22 66 C22 54 34 46 50 46 C66 46 76 52 80 58 L82 66 C78 74 64 76 48 76 C34 76 22 74 22 66Z" fill="url(#${u}s)"/>
        ${Array.from({ length: 9 }, (_, k) => `<path d="M${26 + k * 6} ${50 - Math.sin(k / 8 * Math.PI) * 4} q3 -4 6 0" fill="#5a6a3a"/>`).join('')}
        ${Array.from({ length: 16 }, (_, k) => `<ellipse cx="${28 + (k * 23) % 48}" cy="${56 + (k * 7) % 14}" rx="1.6" ry="1" fill="#4a5a32" stroke="none" opacity=".7"/>`).join('')}
        <path d="M76 54 C82 47 92 49 97 56 C99 62 95 67 88 67 L80 66Z" fill="#7e8e5c"/>
        <path d="M80 50 L84 47 L86 51 M86 49 L90 47 L91 51" fill="#5a6a3a"/>
        <path d="M84 63 L97 61" stroke="#2a3418" stroke-width=".8"/><circle cx="95" cy="57" r=".6" fill="#1a2010"/>
        <circle cx="87" cy="55" r="1.4" fill="#1a1006"/><circle cx="87.4" cy="54.6" r=".4" fill="#fff"/><path d="M84 52.6 L90 53" stroke="#4a5a32" stroke-width="1"/>
        <path d="M68 72 L74 86 L80 86 L76 72Z M38 72 L34 86 L40 86 L44 72Z" fill="#6e7e4c"/>
        ${[[74, 86], [34, 86]].map(([x, y]) => `<path d="M${x} ${y} l-2 2 M${x + 3} ${y} l0 2.4 M${x + 6} ${y} l2 2" stroke="#1a2010" stroke-width="1"/>`).join('')}
        <path d="M42 46 L60 46 L58 52 L44 52Z" fill="#6a4426"/>
        <path d="M45 46 L46 32 C47 28 55 28 56 32 L57 46Z" fill="url(#${u}w)"/>
        <path d="M47 36 L55 36 M46.6 40 L55.4 40" stroke="#8a929e" stroke-width=".5"/>
        <path d="M54 30 C58 28 61 31 59 35 L56 35Z" fill="#e8742a"/>
        <path d="M43 34 L46 33 L46 44 L43 44Z" fill="#c8b48a"/>
        <path d="M47 22 C47 17 55 17 55 22 L55.6 28 L46.4 28Z" fill="url(#${u}w)"/>
        <path d="M47.6 23 L54.4 23 L54.4 25 L52 25.4 L51 28 L49 28 L48 25.4 L47.6 25Z" fill="#14161a"/>
        <path d="M55 33 L72 50" stroke="#4a2e18" stroke-width=".9"/>
      </g>` },
    c_lothcat: { name: 'Loth-cat', draw: (u) => {
      // Lothal's loth-cat, the way the show draws them: cream fur with warm
      // stripes, huge green eyes, big ears with long curly tufts.
      const curl = (x, y, s, d) => `<path d="M${x} ${y} c${-3 * s * d} ${-4 * s} ${-8 * s * d} ${-3 * s} ${-7 * s * d} ${1 * s} c${1 * s * d} ${3 * s} ${5 * s * d} ${2.4 * s} ${4 * s * d} ${-0.4 * s}" stroke="#d8c8ae" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
      return `<defs>${lg(`${u}sk`, [[0, '#6aa8d8'], [0.6, '#b8dcee'], [1, '#f2e8c8']])}${lg(`${u}f`, [[0, '#fbf2e0'], [1, '#e2c8a0']])}${rg(`${u}e`, [[0, '#e8ff9a'], [0.55, '#9ad040'], [1, '#4a8a20']], 0.4, 0.35, 0.7)}${lg(`${u}g`, [[0, '#c8b850'], [1, '#6a8a2a']])}</defs>
      <rect width="100" height="100" fill="url(#${u}sk)"/>
      ${[[8, 30, 6], [86, 26, 8], [70, 40, 5]].map(([x, y, w]) => `<path d="M${x - w} 74 L${x - w * 0.4} ${y} L${x + w * 0.5} ${y + 2} L${x + w} 74Z" fill="#9a8ab8" opacity=".55"/>`).join('')}
      <path d="M0 70 C30 64 70 70 100 66 L100 100 L0 100Z" fill="url(#${u}g)"/>
      ${Array.from({ length: 30 }, (_, k) => `<path d="M${(k * 3.4) % 100} 100 q${(k % 2 ? 2 : -2)} -10 ${(k % 3) - 1} ${-16 - (k % 4) * 3}" stroke="${k % 2 ? '#d8c860' : '#8aa83a'}" stroke-width="1" fill="none"/>`).join('')}
      <g stroke="#7a5a3a" stroke-width=".6" stroke-linejoin="round">
        <path d="M66 88 C80 88 84 78 78 72 C76 78 72 82 64 82Z" fill="url(#${u}f)"/>
        <path d="M70 86 l2 -4 M75 84 l2 -5" stroke="#d8945a" stroke-width="1.4"/>
        <path d="M34 92 C30 76 34 62 50 60 C66 62 70 76 66 92Z" fill="url(#${u}f)"/>
        <path d="M38 70 q3 2 2 6 M62 70 q-3 2 -2 6 M40 80 q3 2 2 5 M60 80 q-3 2 -2 5" stroke="#d8945a" stroke-width="1.4" fill="none"/>
        <ellipse cx="44" cy="91" rx="5" ry="3" fill="#fbf2e0"/><ellipse cx="56" cy="91" rx="5" ry="3" fill="#fbf2e0"/>
        <path d="M42 91 v1.6 M44 91.4 v1.6 M46 91 v1.6 M54 91 v1.6 M56 91.4 v1.6 M58 91 v1.6" stroke="#a8845a" stroke-width=".5"/>
        <path d="M30 34 L12 8 L42 24Z" fill="url(#${u}f)"/><path d="M30 30 L17 13 L38 24Z" fill="#e8b4a4"/>
        <path d="M70 34 L88 8 L58 24Z" fill="url(#${u}f)"/><path d="M70 30 L83 13 L62 24Z" fill="#e8b4a4"/>
        <path d="M24 46 C24 30 36 21 50 21 C64 21 76 30 76 46 C76 58 66 66 50 66 C34 66 24 58 24 46Z" fill="url(#${u}f)"/>
        <path d="M24 46 L18 48 L24 51 L19 55 L27 56 M76 46 L82 48 L76 51 L81 55 L73 56" fill="#fbf2e0"/>
        <path d="M44 24 q1 4 0 7 M50 23 q0 5 0 8 M56 24 q-1 4 0 7" stroke="#d8945a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <path d="M30 40 q4 -1 6 1 M70 40 q-4 -1 -6 1" stroke="#d8945a" stroke-width="1.4" fill="none"/>
        <ellipse cx="39" cy="45" rx="7.4" ry="8.2" fill="url(#${u}e)" stroke="#3a4a1a" stroke-width=".8"/><ellipse cx="61" cy="45" rx="7.4" ry="8.2" fill="url(#${u}e)" stroke="#3a4a1a" stroke-width=".8"/>
        <ellipse cx="40" cy="46" rx="3.6" ry="5.4" fill="#14180a" stroke="none"/><ellipse cx="60" cy="46" rx="3.6" ry="5.4" fill="#14180a" stroke="none"/>
        <circle cx="42" cy="42" r="2" fill="#fff" stroke="none"/><circle cx="62" cy="42" r="2" fill="#fff" stroke="none"/><circle cx="38.6" cy="49" r=".9" fill="#fff" stroke="none"/><circle cx="58.6" cy="49" r=".9" fill="#fff" stroke="none"/>
        <path d="M47.6 54 L52.4 54 L50 56.6Z" fill="#e88a8a"/>
        <path d="M50 56.6 C49 59 46 59 45 57.6 M50 56.6 C51 59 54 59 55 57.6" stroke="#7a5a3a" stroke-width=".8" fill="none"/>
        <ellipse cx="34" cy="55" rx="3.4" ry="1.8" fill="#f2a8a0" opacity=".45" stroke="none"/><ellipse cx="66" cy="55" rx="3.4" ry="1.8" fill="#f2a8a0" opacity=".45" stroke="none"/>
        <path d="M38 56 L24 54 M38 58 L25 59 M62 56 L76 54 M62 58 L75 59" stroke="#a8845a" stroke-width=".4"/>
      </g>
      ${curl(12, 8, 1.1, 1)}${curl(12, 8, 0.7, -1)}${curl(88, 8, 1.1, -1)}${curl(88, 8, 0.7, 1)}
      <path d="M12 8 c-2 -3 -1 -6 2 -6 M88 8 c2 -3 1 -6 -2 -6" stroke="#d8c8ae" stroke-width="1.3" fill="none" stroke-linecap="round"/>` ;
    } },
    c_rathtar: { name: 'Rathtar', draw: (u) => `<defs>${lg(`${u}s`, [[0, '#0e1218'], [1, '#2a323c']])}${rg(`${u}b`, [[0, '#e8a090'], [0.6, '#b8665a'], [1, '#5a2a24']], 0.4, 0.35, 0.75)}${rg(`${u}m`, [[0, '#ff6a4a'], [0.5, '#6a0e0e'], [1, '#1a0404']], 0.5, 0.5, 0.6)}</defs>
      <rect width="100" height="100" fill="url(#${u}s)"/>${[[0, 10], [26, 10], [52, 10], [78, 10]].map(([x]) => `<rect x="${x}" y="6" width="22" height="58" fill="#1e252e" stroke="#0a0e12" stroke-width=".8"/><rect x="${x + 2}" y="8" width="18" height="3" fill="#ffb03a" opacity=".5"/>`).join('')}
      <path d="M0 70 L100 70 L100 100 L0 100Z" fill="#20262e"/>${[0, 20, 40, 60, 80].map((x) => `<rect x="${x + 1}" y="71" width="18" height="28" fill="#2a323c" stroke="#12161c" stroke-width=".6"/>`).join('')}${glowAt(u, 'red', 50, 4, 30, '#ff3a3a', 0.35)}
      <g transform="translate(50 50)">
        ${Array.from({ length: 8 }, (_, k) => { const a = (k / 8) * 6.283 + 0.3; const x2 = Math.cos(a) * 46; const y2 = Math.sin(a) * 40; const mx = Math.cos(a + 0.45) * 30; const my = Math.sin(a + 0.45) * 28; return `<path d="M${(Math.cos(a) * 15).toFixed(1)} ${(Math.sin(a) * 15).toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="#8a4238" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${(Math.cos(a) * 15).toFixed(1)} ${(Math.sin(a) * 15).toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="#c87a6a" stroke-width="3.6" fill="none" stroke-linecap="round"/>${[0.35, 0.6, 0.85].map((t) => { const px = (1 - t) * (1 - t) * Math.cos(a) * 15 + 2 * (1 - t) * t * mx + t * t * x2; const py = (1 - t) * (1 - t) * Math.sin(a) * 15 + 2 * (1 - t) * t * my + t * t * y2; return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="1" fill="#f2c8b8"/>`; }).join('')}`; }).join('')}
        <circle r="21" fill="url(#${u}b)"/>${Array.from({ length: 14 }, (_, k) => `<circle cx="${(Math.cos((k / 14) * 6.283) * 16.5).toFixed(1)}" cy="${(Math.sin((k / 14) * 6.283) * 16.5).toFixed(1)}" r="1.5" fill="#ffd23f" stroke="#7a4a00" stroke-width=".4"/>`).join('')}
        <circle r="12" fill="url(#${u}m)"/>${Array.from({ length: 16 }, (_, k) => { const a = (k / 16) * 6.283; return `<path d="M${(Math.cos(a) * 11.5).toFixed(1)} ${(Math.sin(a) * 11.5).toFixed(1)} L${(Math.cos(a + 0.1) * 6).toFixed(1)} ${(Math.sin(a + 0.1) * 6).toFixed(1)} L${(Math.cos(a + 0.2) * 11.5).toFixed(1)} ${(Math.sin(a + 0.2) * 11.5).toFixed(1)}" fill="#f6eee0"/>`; }).join('')}
        <circle r="4" fill="#120202"/>
      </g>` },
    c_slug: { name: 'Space Slug', draw: (u) => {
      // The asteroid cave that turns out to be a mouth: the Falcon racing out
      // between the closing teeth.
      let s = 5; const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
      const rocks = Array.from({ length: 14 }, () => { const x = rnd() * 100; const y = rnd() * 30; const r = 1.4 + rnd() * 4; return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${r.toFixed(1)}" ry="${(r * 0.8).toFixed(1)}" fill="#4a4250"/><ellipse cx="${(x - r * 0.3).toFixed(1)}" cy="${(y - r * 0.3).toFixed(1)}" rx="${(r * 0.5).toFixed(1)}" ry="${(r * 0.35).toFixed(1)}" fill="#7a7080" opacity=".7"/>`; }).join('');
      const teeth = (y0, dir, n) => Array.from({ length: n }, (_, k) => { const t = (k + 0.5) / n; const x = 20 + t * 60; const yy = y0 + dir * Math.sin(t * Math.PI) * -6; const h = 7 + Math.sin(t * Math.PI) * 6; return `<path d="M${(x - 2.4).toFixed(1)} ${yy.toFixed(1)} L${x.toFixed(1)} ${(yy + dir * h).toFixed(1)} L${(x + 2.4).toFixed(1)} ${yy.toFixed(1)}Z" fill="#f4eee0" stroke="#8a7a68" stroke-width=".4"/>`; }).join('');
      return `<defs>${rg(`${u}sp`, [[0, '#3a2a5a'], [0.6, '#140c24'], [1, '#05030c']], 0.7, 0.2, 0.9)}${rg(`${u}m`, [[0, '#000000'], [0.55, '#2a0a10'], [1, '#8a2a3a']], 0.5, 0.5, 0.5)}${lg(`${u}r`, [[0, '#5a5060'], [1, '#2a2430']])}${lg(`${u}l`, [[0, '#8a5a68'], [1, '#4a2a34']])}</defs>
      <rect width="100" height="100" fill="url(#${u}sp)"/>${stars(30, 9)}${rocks}
      <path d="M0 30 C10 26 18 30 26 26 C40 20 60 20 74 26 C82 30 90 26 100 30 L100 100 L0 100Z" fill="url(#${u}r)"/>
      ${Array.from({ length: 12 }, () => { const x = rnd() * 100; const y = 32 + rnd() * 66; return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(1.4 + rnd() * 3).toFixed(1)}" ry="${(1 + rnd() * 1.6).toFixed(1)}" fill="#1e1a24" opacity=".7"/>`; }).join('')}
      <ellipse cx="50" cy="58" rx="40" ry="30" fill="url(#${u}l)"/>
      ${[0, 1, 2, 3].map((k) => `<ellipse cx="50" cy="58" rx="${40 - k * 1.6}" ry="${30 - k * 1.2}" fill="none" stroke="#3a2028" stroke-width=".5" opacity=".7"/>`).join('')}
      <ellipse cx="50" cy="58" rx="33" ry="24" fill="url(#${u}m)"/>
      <path d="M20 46 C30 38 70 38 80 46" stroke="#c87a88" stroke-width="2" fill="none"/><path d="M20 70 C30 78 70 78 80 70" stroke="#c87a88" stroke-width="2" fill="none"/>
      ${teeth(44, 1, 11)}${teeth(72, -1, 11)}
      <path d="M36 66 C44 62 56 62 64 66 C56 70 44 70 36 66Z" fill="#a83a4a" opacity=".55"/>
      <g transform="translate(51 57) rotate(200) scale(.22) translate(-50 -50)">${root.Ships3 ? root.Ships3.falcon() : ''}</g>
      <circle cx="47" cy="66" r="3" fill="#6ab8ff" opacity=".35"/>
      ${[[30, 50], [70, 52], [44, 74]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="#ffd8e0" opacity=".7"/>`).join('')}` ;
    } },
    c_krayt: { name: 'Krayt Dragon', draw: (u) => `<defs>${lg(`${u}s`, [[0, '#f0a060'], [0.6, '#ffd090'], [1, '#ffe8b8']])}${shadeG(u, 'b', '#e8d2a8', '#b89a6a', '#6a5034')}${lg(`${u}d`, [[0, '#e2ae6a'], [1, '#b87e3e']])}</defs>
      <rect width="100" height="100" fill="url(#${u}s)"/>${glowAt(u, 'sn', 82, 18, 14, '#fff2c0', 0.8)}<circle cx="82" cy="18" r="4.4" fill="#fffbe6"/><circle cx="92" cy="12" r="2.6" fill="#ffc888"/>
      <path d="M0 64 C20 56 36 62 54 54 C70 48 86 56 100 50 L100 100 L0 100Z" fill="#e6b474" opacity=".8"/>
      <path d="M0 78 C30 72 64 80 100 70 L100 100 L0 100Z" fill="url(#${u}d)"/>
      <ellipse cx="48" cy="77" rx="30" ry="2.6" fill="#8a5a2a" opacity=".35"/>${[[42, 58, 74], [68, 62, 75]].map(([x, top, g]) => `<path d="M${x - 3} ${top} C${x - 5} ${top + 5} ${x - 1} ${top + 7} ${x - 2} ${g} L${x + 4} ${g} C${x + 3} ${top + 6} ${x + 5} ${top + 4} ${x + 3} ${top}Z" fill="#8a6a40" stroke="#4a361e" stroke-width=".6"/>`).join('')}
      ${[[34, 56, 76], [60, 58, 77]].map(([x, top, g]) => `<path d="M${x - 4} ${top} C${x - 6} ${top + 4} ${x - 6} ${top + 7} ${x - 2} ${top + 8} C${x - 4} ${g - 3} ${x - 3} ${g - 1} ${x - 2} ${g} L${x + 6} ${g} C${x + 4} ${g - 2} ${x + 2} ${g - 4} ${x + 3} ${top + 7} C${x + 6} ${top + 5} ${x + 6} ${top + 2} ${x + 4} ${top}Z" fill="url(#${u}b)" stroke="#4a361e" stroke-width=".7"/><path d="M${x - 1} ${top + 3} q2 2 4 0 M${x - 1} ${g - 4} q2 1 4 0" stroke="#8a6a40" stroke-width=".5" fill="none"/>${[0, 3, 6].map((d) => `<path d="M${x - 3 + d} ${g} l1.2 1.6 l1.2 -1.6Z" fill="#3a2a16"/>`).join('')}
      <path d="M-4 96 C10 70 30 58 52 60 C62 61 70 66 74 72" stroke="url(#${u}b)" stroke-width="15" fill="none" stroke-linecap="round"/>
      ${Array.from({ length: 9 }, (_, k) => { const t = k / 8; const x = -4 + t * 70; const y = 92 - Math.sin(t * 2.2) * 34; return `<path d="M${x.toFixed(1)} ${(y - 6).toFixed(1)} l2.6 -8 l2.6 8" fill="#8a6a40" stroke="#4a361e" stroke-width=".5"/>`; }).join('')}
      <g transform="translate(70 50) rotate(-18)">
        <path d="M-14 6 C-14 -10 0 -18 16 -16 C28 -14 34 -6 34 2 L26 8 L30 14 L16 14 C4 16 -14 18 -14 6Z" fill="url(#${u}b)" stroke="#4a361e" stroke-width=".8"/>
        <path d="M-6 -12 C-14 -24 -24 -24 -30 -18 C-22 -18 -14 -14 -10 -6Z" fill="#d8c090" stroke="#6a5030" stroke-width=".7"/><path d="M4 -16 C2 -30 -6 -34 -12 -32 C-6 -28 -2 -22 -2 -14Z" fill="#cfb684" stroke="#6a5030" stroke-width=".7"/>
        ${[[-30, -18], [-12, -32]].map(([x, y]) => `<path d="M${x} ${y} l-3 -2" stroke="#6a5030" stroke-width="1"/>`).join('')}
        <path d="M26 8 L34 2 L32 10Z" fill="#3a0a0a"/>${[18, 22, 26, 30].map((x) => `<path d="M${x} 7 l1 3 l1 -3" fill="#f6eee0"/>`).join('')}
        <ellipse cx="14" cy="-6" rx="3.6" ry="2.4" fill="#ffd23f"/><ellipse cx="14" cy="-6" rx="1" ry="2.2" fill="#1a0e00"/><path d="M9 -9 L19 -10" stroke="#6a5030" stroke-width="1.2"/>
        ${[-8, -2, 4].map((x) => `<path d="M${x} -2 C${x + 2} 2 ${x + 2} 6 ${x} 10" stroke="#8a6a40" stroke-width=".7" fill="none"/>`).join('')}
      </g>
<ellipse cx="${x + 1}" cy="${g + 1.2}" rx="7" ry="1.4" fill="#e8c890" opacity=".9"/>`).join('')}
      ${Array.from({ length: 10 }, (_, k) => `<circle cx="${10 + k * 9}" cy="${86 + (k % 3) * 3}" r="${0.6 + (k % 2) * 0.4}" fill="#f2d49a" opacity=".8"/>`).join('')}` },
  };

  // ---------- famous things ----------
  const THINGS = {
    t_sabers: { name: 'Lightsabers', draw: (u) => `${space(u, '#101830', '#02030a', 20)}<defs>${rg(`${u}gb`, [[0, '#5ab8ff', 0.5], [1, '#5ab8ff', 0]])}${rg(`${u}gr`, [[0, '#ff3a3a', 0.5], [1, '#ff3a3a', 0]])}${metal(u, 'h', '#f2f4f6', '#9aa2ac', '#3a4048')}</defs>
      <circle cx="34" cy="34" r="30" fill="url(#${u}gb)"/><circle cx="66" cy="34" r="30" fill="url(#${u}gr)"/><g stroke-linecap="round">
      <g transform="rotate(35 50 52)"><path d="M50 6 L50 58" stroke="#5ab8ff" stroke-width="7" opacity=".4"/><path d="M50 6 L50 58" stroke="#e8f6ff" stroke-width="2.6"/><rect x="46.8" y="58" width="6.4" height="22" rx="1.6" fill="url(#${u}h)" stroke="#3a4048" stroke-width=".6"/>${[62, 66, 70].map((y) => `<rect x="46.8" y="${y}" width="6.4" height="1.4" fill="#2a2e34"/>`).join('')}<rect x="48.6" y="74" width="2.8" height="3" fill="#ff3a3a"/></g>
      <g transform="rotate(-35 50 52)"><path d="M50 6 L50 58" stroke="#ff3a3a" stroke-width="7" opacity=".4"/><path d="M50 6 L50 58" stroke="#ffe6e6" stroke-width="2.6"/><rect x="46.8" y="58" width="6.4" height="22" rx="1.6" fill="#1e2228" stroke="#8a929c" stroke-width=".6"/><path d="M46.8 64 L53.2 64 M46.8 72 L53.2 72" stroke="#c8ced6" stroke-width="1"/><rect x="49" y="58" width="2" height="22" fill="#4a5058"/></g></g>
      <circle cx="50" cy="35" r="5" fill="#fff" opacity=".7"/>` },
    t_holocron: { name: 'Jedi Holocron', draw: (u) => `${space(u, '#0a1a30', '#02040a', 22)}<defs>${rg(`${u}g`, [[0, '#9ae6ff', 0.6], [1, '#5ab8ff', 0]])}${lg(`${u}f`, [[0, '#4ab0f0'], [1, '#123a6a']])}</defs><circle cx="50" cy="52" r="38" fill="url(#${u}g)"/>
      <g transform="translate(50 52)"><path d="M0 -26 L23 -13 L23 13 L0 26 L-23 13 L-23 -13Z" fill="url(#${u}f)" stroke="#bff0ff" stroke-width="1.2"/>
      <path d="M0 -26 L23 -13 L0 0 L-23 -13Z" fill="#6ac8ff" opacity=".9"/><path d="M0 0 L23 -13 L23 13 L0 26Z" fill="#1a4a80" opacity=".9"/>
      <path d="M0 -26 L0 0 L23 13 M0 0 L-23 13" stroke="#bff0ff" stroke-width=".8" fill="none"/>
      ${[[-11.5, -6.5], [11.5, -6.5], [0, -13]].map(([x, y]) => `<path d="M${x - 4} ${y} L${x} ${y - 2.3} L${x + 4} ${y} L${x} ${y + 2.3}Z" fill="none" stroke="#e8faff" stroke-width=".6" opacity=".8"/>`).join('')}
      <circle r="5" fill="#ffffff"/><circle r="9" fill="#bff0ff" opacity=".35"/></g>
      ${Array.from({ length: 10 }, (_, k) => `<circle cx="${50 + Math.cos(k) * 30}" cy="${52 + Math.sin(k * 1.3) * 26}" r=".9" fill="#bff0ff" opacity=".8"/>`).join('')}` },
    t_kyber: { name: 'Kyber Crystal', draw: (u) => `${space(u, '#0e1430', '#02030a', 18)}<circle cx="50" cy="52" r="28" fill="#5ad8ff" opacity=".16"/>
      <g transform="translate(50 54)" stroke="#e8faff" stroke-width=".9"><path d="M0 -32 L10 -6 L0 30 L-10 -6Z" fill="#7fe4ff"/><path d="M0 -32 L10 -6 L0 -2Z" fill="#ffffff" opacity=".7"/><path d="M-20 -12 L-13 4 L-20 22 L-27 4Z" fill="#5fc8f0" opacity=".85"/><path d="M20 -12 L27 4 L20 22 L13 4Z" fill="#5fc8f0" opacity=".85"/></g>` },
    t_helmet: { name: 'Mandalorian Helmet', draw: (u) => `<defs>${lg(`${u}b`, [[0, '#2a1a14'], [1, '#06080c']])}${lg(`${u}m`, [[0, '#ffffff'], [0.25, '#dfe5ec'], [0.55, '#8a94a4'], [0.8, '#4a5262'], [1, '#2a303a']], 1, 0.6)}${rg(`${u}hl`, [[0, '#ffffff', 0.85], [1, '#ffffff', 0]], 0.5, 0.5, 0.5)}${rg(`${u}g`, [[0, '#ff8a3a', 0.45], [1, '#ff8a3a', 0]], 0.5, 0.5, 0.5)}${lg(`${u}v`, [[0, '#14181e'], [1, '#000']])}</defs>
      <rect width="100" height="100" fill="url(#${u}b)"/><circle cx="86" cy="86" r="44" fill="url(#${u}g)"/>
      ${[[14, 84], [22, 90], [80, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="#ffb06a" opacity=".8"/>`).join('')}
      <ellipse cx="50" cy="87" rx="28" ry="3.2" fill="#000" opacity=".6"/>
      <g transform="translate(50 52)" stroke-linejoin="round">
        <path d="M-23 -4 C-23 -27 -12 -33 0 -33 C12 -33 23 -27 23 -4 L23 25 L-23 25Z" fill="url(#${u}m)" stroke="#1a1e24" stroke-width="1"/>
        <path d="M6 -32 C16 -30 23 -22 23 -4 L23 25 L12 25 L12 -4 C12 -18 10 -27 6 -32Z" fill="#000" opacity=".28"/>
        <ellipse cx="-9" cy="-22" rx="8" ry="5" fill="url(#${u}hl)" transform="rotate(-25 -9 -22)"/>
        <path d="M-19 -18 C-18 -26 -12 -30 -6 -31" stroke="#fff" stroke-width="1.6" fill="none" opacity=".75" stroke-linecap="round"/>
        <path d="M-17 -7 L17 -7 L17 1.6 L5.4 1.6 L5.4 19 L-5.4 19 L-5.4 1.6 L-17 1.6Z" fill="url(#${u}v)" stroke="#2a3038" stroke-width=".6"/>
        <path d="M-16 -6 L-3 -6" stroke="#5a6472" stroke-width=".8"/><path d="M4.6 2.6 L4.6 17.4" stroke="#3a4250" stroke-width=".6"/>
        <path d="M-23 -9 L-17 -9 M23 -9 L17 -9" stroke="#3a4250" stroke-width=".7"/>
        <path d="M-21 4 L-8 4 L-8 20 L-21 20Z" fill="#000" opacity=".12"/>
        ${[-16, -12, 12, 16].map((x) => `<path d="M${x} 6 L${x} 18" stroke="#3a4250" stroke-width=".7"/><path d="M${x + 0.6} 6 L${x + 0.6} 18" stroke="#ffffff" stroke-width=".3" opacity=".5"/>`).join('')}
        <rect x="-23" y="21" width="46" height="4" fill="#9aa4b0" stroke="#1a1e24" stroke-width=".5"/><rect x="-23" y="21" width="46" height="1" fill="#e8eef4" opacity=".7"/>
        <path d="M23 -4 L29 -12 L29 7 L23 9Z" fill="#8a949e" stroke="#1a1e24" stroke-width=".6"/><path d="M24 -4 L28 -9 L28 5 L24 7Z" fill="#c8d0d8" opacity=".5"/>
        <path d="M29 -12 L31 -27" stroke="#3a4250" stroke-width="1.4"/><circle cx="31" cy="-27" r="1.4" fill="#ff3a3a"/><circle cx="31" cy="-27" r="3" fill="#ff3a3a" opacity=".25"/>
        <path d="M-14 9 l3 1.4 M-15 13 l2.4 1 M13 11 l2.4 .6 M-4 -26 l3 -1 M8 -24 l2 1.4" stroke="#2a303a" stroke-width=".6"/>
        <path d="M14 18 C18 14 21 10 22 4" stroke="#ff9a5a" stroke-width="1.2" fill="none" opacity=".55"/>
      </g>` },
    t_carbonite: { name: 'Han in Carbonite', draw: (u) => {
      // The Black Market's carbonite block, set in Cloud City's freezing chamber.
      const block = root.Art.crateArt('squadron', 'relic').replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
      return `<defs>${lg(`${u}b`, [[0, '#2a140c'], [0.6, '#140806'], [1, '#060302']])}${rg(`${u}g`, [[0, '#ff9a4a', 0.55], [0.5, '#c8501a', 0.2], [1, '#c8501a', 0]], 0.5, 0.5, 0.5)}${rg(`${u}s`, [[0, '#ffe0c0', 0.45], [1, '#ffe0c0', 0]], 0.5, 0.5, 0.5)}</defs>
        <rect width="100" height="100" fill="url(#${u}b)"/>
        <circle cx="50" cy="58" r="52" fill="url(#${u}g)"/>
        ${[0, 1, 2, 3, 4, 5].map((k) => `<path d="M${-4 + k * 20} 0 L${4 + k * 20} 0 L${10 + k * 18} 40 L${2 + k * 18} 40Z" fill="#000" opacity=".25"/>`).join('')}
        <ellipse cx="50" cy="92" rx="46" ry="9" fill="#1a0c06"/><ellipse cx="50" cy="91" rx="38" ry="6.4" fill="none" stroke="#5a3018" stroke-width="1.2"/>
        ${Array.from({ length: 9 }, (_, k) => `<path d="M${14 + k * 8.6} 86 L${12 + k * 9.4} 98" stroke="#3a1e10" stroke-width=".8"/>`).join('')}
        <ellipse cx="22" cy="72" rx="20" ry="9" fill="url(#${u}s)"/><ellipse cx="80" cy="66" rx="18" ry="8" fill="url(#${u}s)"/><ellipse cx="50" cy="20" rx="30" ry="8" fill="url(#${u}s)" opacity=".7"/>
        <g transform="translate(50 52) scale(1.08) translate(-50 -52)">${block}</g>`;
    } },
    t_detonator: { name: 'Thermal Detonator', draw: (u) => `<defs>${lg(`${u}b`, [[0, '#1e222a'], [1, '#05060a']])}${rg(`${u}t`, [[0, '#f8fafc'], [0.45, '#a8b0ba'], [0.8, '#4a525c'], [1, '#22262c']], 0.34, 0.28, 0.8)}${rg(`${u}g`, [[0, '#ff6a3a', 0.4], [1, '#ff6a3a', 0]])}</defs>
      <rect width="100" height="100" fill="url(#${u}b)"/><circle cx="50" cy="52" r="40" fill="url(#${u}g)"/>
      <ellipse cx="50" cy="80" rx="20" ry="3" fill="#000" opacity=".6"/>
      <circle cx="50" cy="52" r="24" fill="url(#${u}t)" stroke="#14171c" stroke-width=".8"/>
      <path d="M26 52 A24 7 0 0 0 74 52" fill="none" stroke="#1a1e24" stroke-width="4.4"/><path d="M26 51 A24 7 0 0 0 74 51" fill="none" stroke="#6a727c" stroke-width="1"/>
      ${[[34, 55], [42, 57.6], [50, 58.6], [58, 57.6], [66, 55]].map(([x, y], i) => `<rect x="${x - 2.6}" y="${y - 3.6}" width="5.2" height="5" rx="1" fill="${i === 2 ? '#ff2a2a' : i % 2 ? '#e8c040' : '#c8ced6'}" stroke="#1a1e24" stroke-width=".5"/>`).join('')}
      <circle cx="50" cy="58.6" r="5" fill="#ff2a2a" opacity=".35"/>
      <path d="M38 38 C42 34 50 32 56 34" stroke="#fff" stroke-width="1.6" fill="none" opacity=".7"/><circle cx="40" cy="40" r="2.2" fill="#fff" opacity=".8"/>
      <path d="M42 31 L58 31 L57 26.6 L43 26.6Z" fill="#6a727c" stroke="#14171c" stroke-width=".5"/><ellipse cx="50" cy="26.6" rx="7" ry="1.8" fill="#aab2bc" stroke="#14171c" stroke-width=".5"/>
      ${[44, 47, 50, 53, 56].map((x) => `<path d="M${x} 27.4 L${x} 30.6" stroke="#3a4048" stroke-width=".6"/>`).join('')}
      <rect x="47.4" y="20.6" width="5.2" height="6" rx="1" fill="#3a4048" stroke="#14171c" stroke-width=".5"/><rect x="48.2" y="21.4" width="1.2" height="4.4" fill="#8a929e"/>
      <ellipse cx="50" cy="20.6" rx="2.6" ry=".9" fill="#ff3a2a"/><circle cx="50" cy="20.4" r="2.4" fill="#ff3a2a" opacity=".3"/>` },
  };

  // ---------- scenes ----------
  const SCENES2 = {
    sc_sunset: { name: 'Binary Sunset', draw: (u) => `<defs>${lg(`${u}sk`, [[0, '#140c38'], [0.35, '#5a2a6a'], [0.62, '#d85a3a'], [0.8, '#ffa050'], [1, '#ffd890']])}${rg(`${u}s1`, [[0, '#fffbe6'], [0.3, '#ffe8a8', 0.9], [1, '#ff9a4a', 0]], 0.5, 0.5, 0.5)}${lg(`${u}d1`, [[0, '#6a3448'], [1, '#2a1424']])}${lg(`${u}d2`, [[0, '#3a1a2a'], [1, '#140812']])}</defs>
      <rect width="100" height="100" fill="url(#${u}sk)"/>${stars(16, 22).replace(/<circle /g, '<circle opacity=".7" ')}
      ${[[10, 30, 40], [50, 36, 36], [20, 44, 30]].map(([x, y, w]) => `<path d="M${x} ${y} q${w / 2} -2 ${w} 0" stroke="#ff9a7a" stroke-width="1.2" fill="none" opacity=".4" stroke-linecap="round"/>`).join('')}
      <circle cx="40" cy="62" r="22" fill="url(#${u}s1)"/><circle cx="40" cy="62" r="7.6" fill="#fff4d0"/>
      <circle cx="57" cy="64" r="15" fill="url(#${u}s1)"/><circle cx="57" cy="64" r="5" fill="#ffe0a0"/>
      <path d="M0 66 L8 62 L14 63 L20 59 L30 62 L36 60 L46 64 L62 61 L70 63 L78 58 L90 62 L100 60 L100 70 L0 70Z" fill="#7a3a50"/>
      <path d="M0 70 C20 66 40 72 60 68 C76 65 90 70 100 67 L100 100 L0 100Z" fill="url(#${u}d1)"/>
      <path d="M0 70 C20 66 40 72 60 68 C76 65 90 70 100 67" stroke="#ffb070" stroke-width=".8" fill="none" opacity=".7"/>
      <path d="M0 82 C24 76 50 84 74 78 C86 75 94 78 100 77 L100 100 L0 100Z" fill="url(#${u}d2)"/>
      <path d="M0 82 C24 76 50 84 74 78" stroke="#ff9a5a" stroke-width=".6" fill="none" opacity=".55"/>
      <path d="M8 80 A9 6 0 0 1 26 80Z" fill="#1e0e18"/><rect x="14" y="76" width="6" height="4" rx="1" fill="#0a0408"/>
      ${[[80, 64, 14], [90, 66, 11]].map(([x, y, h]) => `<g fill="#1e0e18"><rect x="${x - 0.8}" y="${y - h}" width="1.6" height="${h}"/><rect x="${x - 3}" y="${y - h * 0.62}" width="6" height="1.2"/><rect x="${x - 2.2}" y="${y - h * 0.86}" width="4.4" height="1"/><rect x="${x - 1.6}" y="${y - h - 1.4}" width="3.2" height="1.6"/></g>`).join('')}
      <path d="M64 72 L100 69 L100 71.6 L66 73.4Z" fill="#14080e" opacity=".55"/>
      <g fill="#14080e"><circle cx="64" cy="59.6" r="1.6"/><path d="M62.4 61.4 L65.6 61.4 L66.4 67 L65.4 67 L65 72.6 L64.2 72.6 L64 68 L63.6 72.6 L62.8 72.6 L62.6 67 L61.6 67Z"/><path d="M62.6 61.8 L60.8 66" stroke="#14080e" stroke-width=".9"/></g>` },
    sc_trench: { name: 'Trench Run', draw: (u) => {
      // Down the Death Star trench: lit and shadowed walls packed with
      // machinery, an X-wing with its wings in attack position, TIE fighters
      // diving in after it and lasers everywhere.
      const VX = 50; const VY = 38;
      const pt = (xs, ys, t) => { const k = 1 / (1 + t * 7); return [VX + xs * 52 * k, VY + (62 - ys * 92) * k]; };
      const quad = (pts, fill, op = 1) => `<path d="M${pts.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(' L')}Z" fill="${fill}" opacity="${op}"/>`;
      let s = 3; const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
      let greeb = '';
      for (let k = 0; k < 90; k++) {
        const side = k % 2 ? -1 : 1; const t = rnd() * 1.6; const dt = 0.03 + rnd() * 0.08; const y0 = 0.08 + rnd() * 0.8; const dy = 0.04 + rnd() * 0.12;
        const a = pt(side, y0, t); const b = pt(side, y0, t + dt); const c = pt(side, y0 + dy, t + dt); const d = pt(side, y0 + dy, t);
        const lit = side < 0;
        greeb += quad([a, b, c, d], rnd() < 0.5 ? (lit ? '#c8ced6' : '#4a525c') : (lit ? '#6a727e' : '#262a32'), 0.9);
      }
      for (let k = 0; k < 30; k++) {
        const t = rnd() * 1.6; const xs = -0.9 + rnd() * 1.8; const a = pt(xs, 0, t); const b = pt(xs + 0.12, 0, t); const c = pt(xs + 0.12, 0, t + 0.05); const d = pt(xs, 0, t + 0.05);
        greeb += quad([a, b, c, d], rnd() < 0.5 ? '#2a2e36' : '#5a626c', 0.9);
      }
      const ribs = [0.1, 0.3, 0.55, 0.85, 1.3].map((t) => { const a = pt(-1, 0, t); const b = pt(-1, 1, t); const c = pt(1, 1, t); const d = pt(1, 0, t); return `<path d="M${b[0].toFixed(1)} ${b[1].toFixed(1)} L${a[0].toFixed(1)} ${a[1].toFixed(1)} L${d[0].toFixed(1)} ${d[1].toFixed(1)} L${c[0].toFixed(1)} ${c[1].toFixed(1)}" stroke="#14161a" stroke-width="${(1.4 / (1 + t * 4)).toFixed(2)}" fill="none" opacity=".8"/>`; }).join('');
      const L0 = pt(-1, 0, 0); const L1 = pt(-1, 1, 0); const R0 = pt(1, 0, 0); const R1 = pt(1, 1, 0); const F0 = pt(-1, 0, 9); const F1 = pt(-1, 1, 9); const G0 = pt(1, 0, 9); const G1 = pt(1, 1, 9);
      const bolt = (x1, y1, x2, y2, col, n) => { let m = ''; for (let k = 0; k < n; k++) { const a = (k + 0.15) / n; const b = a + 0.55 / n; const ax = x1 + (x2 - x1) * a; const ay = y1 + (y2 - y1) * a; const bx = x1 + (x2 - x1) * b; const by = y1 + (y2 - y1) * b; const w = 1 - a * 0.5; m += `<path d="M${ax.toFixed(1)} ${ay.toFixed(1)} L${bx.toFixed(1)} ${by.toFixed(1)}" stroke="${col}" stroke-width="${(4.4 * w).toFixed(2)}" opacity=".28" stroke-linecap="round"/><path d="M${ax.toFixed(1)} ${ay.toFixed(1)} L${bx.toFixed(1)} ${by.toFixed(1)}" stroke="${col}" stroke-width="${(2 * w).toFixed(2)}" opacity=".9" stroke-linecap="round"/><path d="M${ax.toFixed(1)} ${ay.toFixed(1)} L${bx.toFixed(1)} ${by.toFixed(1)}" stroke="#ffffff" stroke-width="${(0.8 * w).toFixed(2)}" stroke-linecap="round"/>`; } return `<g style="filter:drop-shadow(0 0 1.6px ${col}) drop-shadow(0 0 3.5px ${col})">${m}</g>`; };
      const glowAt2 = (x, y, r, col, op) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" opacity="${op}" style="filter:blur(${(r * 0.35).toFixed(1)}px)"/>`;
      const tie = (x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-9 -8 L-7 -8 L-7 8 L-9 8Z M9 -8 L7 -8 L7 8 L9 8Z" fill="#3a404a" stroke="#14161a" stroke-width=".4"/><path d="M-7 0 L-3 0 M7 0 L3 0" stroke="#5a626c" stroke-width="1.2"/><circle r="3.4" fill="#6a727e" stroke="#14161a" stroke-width=".4"/><circle r="1.6" fill="#14181e"/></g>`;
      return `<defs>${rg(`${u}sp`, [[0, '#1a2440'], [1, '#03040a']], 0.5, 0.2, 0.8)}${lg(`${u}lw`, [[0, '#9aa2ae'], [1, '#5a626c']], 1, 0)}${lg(`${u}rw`, [[0, '#14161a'], [1, '#2a2e36']], 1, 0)}${lg(`${u}fl`, [[0, '#14161a'], [1, '#3a404a']])}${rg(`${u}en`, [[0, '#ffe0c0'], [0.4, '#ff6a3a', 0.6], [1, '#ff3a1a', 0]], 0.5, 0.5, 0.5)}</defs>
      <rect width="100" height="100" fill="url(#${u}sp)"/>${stars(26, 31)}
      ${quad([L1, L0, F0, F1], `url(#${u}lw)`)}${quad([R1, R0, G0, G1], `url(#${u}rw)`)}${quad([L0, R0, G0, F0], `url(#${u}fl)`)}
      ${greeb}${ribs}
      <path d="M${L1[0]} ${L1[1]} L${F1[0].toFixed(1)} ${F1[1].toFixed(1)}" stroke="#e8eef4" stroke-width=".8" opacity=".8"/>
      <circle cx="${VX}" cy="${VY + 2}" r="2.6" fill="#ff6a3a" opacity=".35"/>
      ${glowAt2(14, 36, 10, '#3aff6a', 0.18)}${glowAt2(86, 30, 10, '#3aff6a', 0.14)}${glowAt2(50, 70, 16, '#ff3a2a', 0.12)}
      ${[[22, 14, 48, 36, 3], [80, 18, 54, 36, 3], [16, 30, 44, 42, 3]].map(([x1, y1, x2, y2, n]) => bolt(x1, y1, x2, y2, '#3aff6a', n)).join('')}
      ${[[22, 14], [80, 18], [16, 30]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#b8ffc8" opacity=".9" style="filter:drop-shadow(0 0 3px #3aff6a)"/>`).join('')}
      <circle cx="46" cy="40" r="3" fill="#fff6c0" opacity=".9" style="filter:drop-shadow(0 0 4px #ffb03a)"/>${[0, 60, 120, 180, 240, 300].map((a) => `<path d="M46 40 l${(Math.cos(a * Math.PI / 180) * 4).toFixed(1)} ${(Math.sin(a * Math.PI / 180) * 4).toFixed(1)}" stroke="#ffd080" stroke-width=".6"/>`).join('')}
      ${tie(22, 12, 0.9)}${tie(82, 16, 0.75)}
      <g transform="translate(18 26) scale(.8)"><path d="M-9 -8 C-12 -2 -12 2 -9 8 L-7 8 L-7 -8Z M9 -8 C12 -2 12 2 9 8 L7 8 L7 -8Z" fill="#3a404a" stroke="#14161a" stroke-width=".4"/><path d="M-7 0 L-3 0 M7 0 L3 0" stroke="#5a626c" stroke-width="1.2"/><circle r="3.6" fill="#7a828e" stroke="#14161a" stroke-width=".4"/><circle r="1.8" fill="#14181e"/></g>
      ${[[30, 82, 48.6, 46, 4], [70, 84, 51.4, 46, 4]].map(([x1, y1, x2, y2, n]) => bolt(x1, y1, x2, y2, '#ff3a2a', n)).join('')}
      <g transform="translate(50 76)" stroke="#14161a" stroke-width=".5" stroke-linejoin="round">
        ${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => `<path d="M${sx * 3} ${sy * 1.4} L${sx * 22} ${sy * 9} L${sx * 22} ${sy * 11} L${sx * 3} ${sy * 3.4}Z" fill="${sy < 0 ? '#e2e6ea' : '#aab2ba'}"/><path d="M${sx * 10} ${sy * 4.6} L${sx * 18} ${sy * 7.8}" stroke="#c43b2e" stroke-width="1.4"/><rect x="${sx * 22 - 1}" y="${sy * 10 - 1}" width="2" height="2" fill="#5a626c"/>${sy < 0 ? `<circle cx="${sx * 22}" cy="${sy * 10}" r="2.4" fill="#ffd0c0" stroke="none" style="filter:drop-shadow(0 0 3px #ff3a2a)"/>` : ''}<circle cx="${sx * 6}" cy="${sy * 3.2}" r="2.6" fill="#8a929e"/><circle cx="${sx * 6}" cy="${sy * 3.2}" r="1.7" fill="url(#${u}en)" stroke="none"/>`).join('')}
        <path d="M-3.6 -3.4 L3.6 -3.4 L4 4 L-4 4Z" fill="#d8dde2"/><path d="M-2.4 -3.4 C-2.4 -6.4 2.4 -6.4 2.4 -3.4Z" fill="#e8ecf0"/><path d="M-1.6 -4.6 L1.6 -4.6" stroke="#3a6ad8" stroke-width=".8"/>
      </g>
      <circle cx="44" cy="72" r="4" fill="#ff8a3a" opacity=".25"/><circle cx="56" cy="80" r="4" fill="#ff8a3a" opacity=".25"/>` ;
    } },
    sc_throne: { name: 'Throne Room', draw: (u) => {
      // The Emperor's throne room on the second Death Star: the great round
      // window onto the battle of Endor, the throne at the top of the stairs,
      // his Royal Guards in red.
      const spokes = Array.from({ length: 12 }, (_, k) => { const a = (k * 30) * Math.PI / 180; return `<path d="M${(50 + Math.cos(a) * 9).toFixed(1)} ${(40 + Math.sin(a) * 9).toFixed(1)} L${(50 + Math.cos(a) * 34).toFixed(1)} ${(40 + Math.sin(a) * 34).toFixed(1)}" stroke="#1a1c22" stroke-width="2.2"/><path d="M${(50 + Math.cos(a) * 9).toFixed(1)} ${(40 + Math.sin(a) * 9).toFixed(1)} L${(50 + Math.cos(a) * 34).toFixed(1)} ${(40 + Math.sin(a) * 34).toFixed(1)}" stroke="#4a4e58" stroke-width=".5"/>`; }).join('');
      const flashes = [[30, 22, '#ff6a3a'], [66, 18, '#3aff6a'], [72, 30, '#ff6a3a'], [36, 50, '#ffd23f'], [62, 52, '#3aff6a'], [24, 36, '#ff9a5a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2" fill="${c}" opacity=".35"/><circle cx="${x}" cy="${y}" r=".7" fill="#fff"/>`).join('');
      const bolts = [[26, 28, 34, 26, '#3aff6a'], [60, 24, 68, 22, '#ff3a2a'], [40, 54, 48, 52, '#ff3a2a'], [54, 30, 60, 34, '#3aff6a']].map(([a, b, c, d, col]) => `<path d="M${a} ${b} L${c} ${d}" stroke="${col}" stroke-width=".6"/>`).join('');
      const guard = (x) => `<g transform="translate(${x} 72)"><path d="M-3.4 18 L-3 4 C-3 -2 3 -2 3 4 L3.4 18Z" fill="#a81a1a"/><path d="M-3 4 C-3 -2 3 -2 3 4" fill="#c82a2a"/><path d="M-1.4 1.4 L1.4 1.4" stroke="#2a0606" stroke-width=".8"/><path d="M-1 -1.6 C-1 -3.4 1 -3.4 1 -1.6" fill="#c82a2a"/><path d="M4.4 -6 L4.4 18" stroke="#6a6a72" stroke-width=".8"/><path d="M-3 8 L3 8" stroke="#6a0a0a" stroke-width=".5"/></g>`;
      return `<defs>${rg(`${u}w`, [[0, '#1a2a48'], [1, '#04060e']], 0.5, 0.5, 0.6)}${lg(`${u}fl`, [[0, '#1a1c22'], [1, '#050608']])}${rg(`${u}ds`, [[0, '#9aa2b0'], [0.6, '#4a5260'], [1, '#14181e']], 0.35, 0.3, 0.8)}${lg(`${u}lt`, [[0, '#7a9ac8', 0.35], [1, '#7a9ac8', 0]])}${lg(`${u}th`, [[0, '#3a3e48'], [1, '#14161a']])}</defs>
      <rect width="100" height="100" fill="#06070a"/>
      <circle cx="50" cy="40" r="36" fill="#14161c"/><circle cx="50" cy="40" r="34" fill="url(#${u}w)"/>
      ${stars(20, 7, 74)}
      <circle cx="70" cy="30" r="12" fill="url(#${u}ds)"/><path d="M58 30 A12 12 0 0 0 70 42 L70 18 A12 12 0 0 0 58 30Z" fill="#000" opacity=".35"/>
      ${[24, 28, 32, 36].map((y) => `<path d="M${70 - Math.sqrt(144 - (y - 30) ** 2)} ${y} H${70 + Math.sqrt(144 - (y - 30) ** 2)}" stroke="#2a2e36" stroke-width=".4"/>`).join('')}<path d="M70 18 C76 24 76 36 70 42" stroke="#2a2e36" stroke-width=".5" fill="none"/><circle cx="66" cy="26" r="2" fill="#2a2e36"/>
      <path d="M74 28 L84 28 L84 36" stroke="#9aa2b0" stroke-width=".3" fill="none" opacity=".6"/>
      ${[[30, 34], [38, 26], [44, 44], [28, 46], [56, 50]].map(([x, y]) => `<path d="M${x} ${y} l2 0 l-1 -1.4Z" fill="#c8ced6"/>`).join('')}
      ${flashes}${bolts}
      <path d="M50 4 L58 6 L50 8Z" fill="#c8ced6" opacity=".6"/>
      ${spokes}
      <circle cx="50" cy="40" r="9" fill="#14161c" stroke="#4a4e58" stroke-width=".6"/><circle cx="50" cy="40" r="22" fill="none" stroke="#1a1c22" stroke-width="1.6"/>
      <circle cx="50" cy="40" r="34" fill="none" stroke="#2a2e36" stroke-width="2.4"/><circle cx="50" cy="40" r="35.6" fill="none" stroke="#4a4e58" stroke-width=".5"/>
      <path d="M0 0 H100 V100 H0Z M50 4 A36 36 0 1 0 50 76 A36 36 0 1 0 50 4Z" fill="#0a0b0e" fill-rule="evenodd"/>
      <path d="M0 0 L16 0 L16 100 L0 100Z M84 0 L100 0 L100 100 L84 100Z" fill="#0e1014"/>
      ${[20, 40, 60, 80].map((y) => `<path d="M0 ${y} H16 M84 ${y} H100" stroke="#1a1c22" stroke-width=".6"/>`).join('')}
      <path d="M20 76 L80 76 L100 100 L0 100Z" fill="url(#${u}fl)"/>
      ${[0, 1, 2, 3, 4].map((k) => `<path d="M${30 + k * 2} ${76 - k * 2.6} L${70 - k * 2} ${76 - k * 2.6} L${70 - k * 2} ${76 - k * 2.6 + 2.6} L${30 + k * 2} ${76 - k * 2.6 + 2.6}Z" fill="${k % 2 ? '#1a1c22' : '#24262e'}"/><path d="M${30 + k * 2} ${76 - k * 2.6} L${70 - k * 2} ${76 - k * 2.6}" stroke="#6a7a9a" stroke-width=".4" opacity=".7"/>`).join('')}
      <path d="M38 63 L36 44 C36 40 42 38 50 38 C58 38 64 40 64 44 L62 63Z" fill="url(#${u}th)" stroke="#4a4e58" stroke-width=".5"/>
      <path d="M38 63 L36 52 L32 52 L33 63Z M62 63 L64 52 L68 52 L67 63Z" fill="#2a2e36" stroke="#4a4e58" stroke-width=".4"/>
      <path d="M44 63 L44 54 C44 49 56 49 56 54 L56 63Z" fill="#0a0a0e"/>
      <path d="M46 54 C46 50 54 50 54 54 L55 63 L45 63Z" fill="#14101a"/>
      <ellipse cx="50" cy="56" rx="2.2" ry="2.6" fill="#a89a88" opacity=".85"/><path d="M48 54.6 C49 53.6 51 53.6 52 54.6" stroke="#14101a" stroke-width="1" fill="none"/>
      <circle cx="49.2" cy="56" r=".35" fill="#ffd23f"/><circle cx="50.8" cy="56" r=".35" fill="#ffd23f"/>
      <path d="M20 76 L50 50 L80 76" fill="url(#${u}lt)" opacity=".4"/>
      ${guard(24)}${guard(76)}` ;
    } },
    sc_cantina: { name: 'Mos Eisley Cantina', draw: (u) => `<defs>${lg(`${u}b`, [[0, '#3a2014'], [1, '#0e0604']])}${rg(`${u}l`, [[0, '#ffc070', 0.55], [1, '#ffb060', 0]])}${lg(`${u}w`, [[0, '#7a5034'], [1, '#3a2414']])}</defs>
      <rect width="100" height="100" fill="url(#${u}b)"/><circle cx="50" cy="18" r="40" fill="url(#${u}l)"/>
      <path d="M6 100 L6 40 C6 18 94 18 94 40 L94 100Z" fill="url(#${u}w)"/><path d="M12 100 L12 42 C12 26 88 26 88 42 L88 100Z" fill="#1a0e08"/>
      ${[24, 50, 76].map((x) => `<circle cx="${x}" cy="34" r="3.4" fill="#ffb060"/><circle cx="${x}" cy="34" r="7" fill="#ffb060" opacity=".25"/><path d="M${x} 24 L${x} 30.6" stroke="#5a3a20" stroke-width=".8"/>`).join('')}
      <rect x="10" y="74" width="80" height="6" fill="#8a5a34"/><rect x="10" y="80" width="80" height="20" fill="#4a2a16"/>${[18, 34, 50, 66, 82].map((x) => `<path d="M${x} 80 L${x} 100" stroke="#2a160a" stroke-width=".8"/>`).join('')}
      ${[[26, 70], [56, 71]].map(([x, y]) => `<path d="M${x} ${y} L${x + 2} ${y - 6} L${x + 4} ${y}Z" fill="#9ad8ff" opacity=".7"/>`).join('')}
      <g fill="#0a0503">
        <path d="M18 74 L18 58 C18 50 30 50 30 58 L30 74Z"/><ellipse cx="24" cy="48" rx="6" ry="6.4"/><path d="M19 44 L16 38 M29 44 L32 38" stroke="#0a0503" stroke-width="1.6"/>
        <path d="M40 74 L40 56 C40 47 54 47 54 56 L54 74Z"/><path d="M43 46 C43 38 51 38 51 46 C51 50 43 50 43 46Z"/><path d="M47 39 L47 34 M44 40 L41 36 M50 40 L53 36" stroke="#0a0503" stroke-width="1.2"/>
        <path d="M64 74 L64 58 C64 50 78 50 78 58 L78 74Z"/><path d="M66 50 C64 42 78 42 76 50Z"/><ellipse cx="71" cy="45" rx="5" ry="4"/><path d="M71 41 C72 36 76 36 78 38" stroke="#0a0503" stroke-width="1.6" fill="none"/>
      </g>
      <path d="M53 58 L62 50" stroke="#c8a040" stroke-width="1.6"/><circle cx="62" cy="50" r="1.4" fill="#c8a040"/>
      <path d="M24 90 l3 -4 l3 4" fill="#c8a040" opacity=".6"/>` },
    sc_hoth: { name: 'Battle of Hoth', draw: (u) => {
      // Walkers advancing on Echo Base: a grey sky, layered ice ridges with the
      // base and its shield generator, three AT-ATs kicking up snow, glowing
      // walker fire, snowspeeders diving in, one wrapping a tow cable round a
      // walker's legs, and the rebel trench in the foreground.
      const bolt = (x1, y1, x2, y2, col) => `<g style="filter:drop-shadow(0 0 1.4px ${col}) drop-shadow(0 0 3px ${col})"><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${col}" stroke-width="1.8" stroke-linecap="round" opacity=".9"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="#fff" stroke-width=".6" stroke-linecap="round"/></g>`;
      const boom = (x, y, r) => `<path d="M${x - r * 0.6} ${y - r * 0.6} C${x - r * 1.6} ${y - r * 4} ${x + r * 1.8} ${y - r * 4.4} ${x + r * 0.6} ${y - r * 8}" stroke="#3a3e46" stroke-width="${r * 1.8}" fill="none" opacity=".5" stroke-linecap="round"/><path d="M${x - r * 0.4} ${y - r} C${x - r} ${y - r * 3} ${x + r} ${y - r * 3.4} ${x + r * 0.4} ${y - r * 5.6}" stroke="#6a6e76" stroke-width="${r}" fill="none" opacity=".45" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="${r * 2.2}" fill="#ff9a4a" opacity=".22" style="filter:blur(${r * 0.5}px)"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ffb060"/><circle cx="${x}" cy="${y}" r="${r * 0.5}" fill="#fff6d0"/>${[0, 50, 110, 160, 220, 290].map((a) => `<path d="M${x} ${y} l${(Math.cos(a * Math.PI / 180) * r * 2).toFixed(1)} ${(Math.sin(a * Math.PI / 180) * r * 2 - r * 0.6).toFixed(1)}" stroke="#ffd080" stroke-width=".5"/>`).join('')}<ellipse cx="${x}" cy="${y + r * 0.6}" rx="${r * 2.4}" ry="${r * 0.6}" fill="#2a2e36" opacity=".35"/>`;
      const kick = (x, y, s) => `<ellipse cx="${x}" cy="${y}" rx="${6 * s}" ry="${1.4 * s}" fill="#ffffff" opacity=".9"/><circle cx="${x - 3 * s}" cy="${y - 1.2 * s}" r="${1.2 * s}" fill="#fff" opacity=".8"/><circle cx="${x + 3 * s}" cy="${y - 1 * s}" r="${1 * s}" fill="#fff" opacity=".8"/>`;
      const walker = (id, x, y, s, op) => `<ellipse cx="${x + 54 * s}" cy="${y + 87 * s}" rx="${38 * s}" ry="${3 * s}" fill="#5a6a7a" opacity="${0.35 * op}"/><g opacity="${op}" transform="translate(${x} ${y}) scale(${s})">${atatBody(`${u}${id}`)}</g>${[28, 39, 56, 65].map((fx) => kick(x + (fx + 1) * s, y + 87 * s, s * 0.9)).join('')}`;
      return `<defs>${lg(`${u}sk`, [[0, '#8a9ab0'], [0.5, '#c4d0de'], [1, '#e8eff6']])}${lg(`${u}m1`, [[0, '#f4f8fb'], [1, '#c8d6e4']])}${lg(`${u}m2`, [[0, '#e6eef6'], [1, '#b0c2d4']])}${lg(`${u}sn`, [[0, '#f6fafd'], [1, '#dfe8f0']])}</defs>
      <rect width="100" height="100" fill="url(#${u}sk)"/>
      <g transform="translate(100 0) scale(-1 1)">
      ${[[10, 12, 30], [56, 8, 40], [30, 20, 26]].map(([x, y, w]) => `<ellipse cx="${x + w / 2}" cy="${y}" rx="${w / 2}" ry="3" fill="#ffffff" opacity=".35"/>`).join('')}
      <path d="M0 40 L8 30 L16 34 L26 22 L36 32 L46 24 L58 34 L70 26 L82 32 L92 24 L100 30 L100 48 L0 48Z" fill="url(#${u}m2)"/>
      <path d="M8 30 L12 38 M26 22 L30 32 M46 24 L50 32 M70 26 L74 34 M92 24 L95 32" stroke="#8aa0b8" stroke-width=".8" fill="none"/>
      <path d="M0 46 L12 38 L22 42 L34 34 L44 42 L60 36 L72 42 L86 36 L100 42 L100 54 L0 54Z" fill="url(#${u}m1)"/>
      <path d="M86 48 C88 43 96 43 98 48Z" fill="#3a4a5a"/><rect x="89" y="45.6" width="6" height="2.4" fill="#ffd27a" opacity=".7"/>
      <g transform="translate(78 34)"><path d="M-1 14 L1 14 L1.4 4 L-1.4 4Z" fill="#6a7a8a"/><path d="M-6 4 C-6 0 6 0 6 4Z" fill="#aab6c2" stroke="#5a6a7a" stroke-width=".4"/><circle cx="0" cy="1.2" r="1" fill="#5a6a7a"/><path d="M0 1 L0 -14" stroke="#9ad8ff" stroke-width=".6" opacity=".6"/></g>
      <path d="M0 52 C30 48 60 54 100 50 L100 100 L0 100Z" fill="url(#${u}sn)"/>
      ${Array.from({ length: 8 }, (_, k) => `<path d="M${(k * 13) % 100} ${58 + (k * 5) % 24} q6 -1.4 12 0" stroke="#c8d6e4" stroke-width=".8" fill="none" opacity=".8"/>`).join('')}
      ${walker('a1', 60, 34, 0.26, 0.55)}${walker('a2', 72, 36, 0.32, 0.72)}
      ${bolt(100, 46.4, 90, 50, '#ff3a2a')}${bolt(88, 48, 76, 54, '#ff3a2a')}
      ${walker('a3', 2, 28, 0.6, 1)}
      ${bolt(62, 54.6, 74, 62, '#ff3a2a')}${bolt(62, 56, 86, 70, '#ff3a2a')}
      ${boom(78, 66, 2.6)}${boom(90, 74, 1.8)}${boom(44, 84, 2.2)}
      <path d="M18 66 C14 64 14 70 20 70 C28 71 34 69 34 66 C34 63 26 62 20 64" stroke="#3a4048" stroke-width=".45" fill="none" stroke-dasharray="1.2 .8"/>
      <path d="M20 64 C28 61 36 56 46 50" stroke="#3a4048" stroke-width=".35" fill="none" stroke-dasharray="1 .8"/>
      <g transform="translate(40 40) rotate(-24) scale(.22)">${t47Body(`${u}s2`)}</g>
      <g transform="translate(58 4) rotate(-12) scale(.4)">${t47Body(`${u}s1`)}</g>
      ${bolt(97, 23, 100, 22.4, '#ff5a3a')}
      <path d="M0 88 C24 84 50 89 76 85 C88 83 96 85 100 84 L100 100 L0 100Z" fill="#b4c4d4"/>
      ${Array.from({ length: 14 }, (_, k) => `<ellipse cx="${3 + k * 7.2}" cy="${87.4 - Math.sin(k * 0.7) * 1.4}" rx="3.6" ry="1.6" fill="#8a7a62" stroke="#5a4e3c" stroke-width=".3"/>`).join('')}
      ${[10, 18, 26, 72, 82, 90].map((x, k) => `<g transform="translate(${x} 86)"><circle r="1.1" cy="-3.4" fill="#e8dcc8"/><path d="M-1.2 -2.2 L1.2 -2.2 L1.4 1 L-1.4 1Z" fill="#c8b8a0"/>${k % 2 ? '<path d="M1 -2 L4 -3" stroke="#2a2e36" stroke-width=".6"/>' : ''}</g>`).join('')}
      <g transform="translate(50 87)"><path d="M-5 2 L5 2 L4 -1.6 L-4 -1.6Z" fill="#6a727e" stroke="#2a3038" stroke-width=".4"/><circle cx="0" cy="-2.6" r="2.6" fill="#8a929e" stroke="#2a3038" stroke-width=".4"/><path d="M1 -3 L9 -7" stroke="#3a4048" stroke-width="1.4"/></g>
      ${bolt(59, -7 + 87, 72, 72, '#ff5a3a')}
      ${Array.from({ length: 24 }, (_, k) => `<circle cx="${(k * 43) % 100}" cy="${(k * 17) % 100}" r="${0.35 + (k % 3) * 0.25}" fill="#fff" opacity=".85"/>`).join('')}</g>` ;
    } },
    sc_hyperspace: { name: 'Hyperspace', draw: (u) => `<defs>${rg(`${u}c`, [[0, '#ffffff', 1], [0.3, '#cfe8ff', 0.7], [1, '#3a7aff', 0]], 0.5, 0.5, 0.5)}${lg(`${u}k`, [[0, '#3a3e48'], [1, '#121418']])}</defs><rect width="100" height="100" fill="#02030a"/>
      ${Array.from({ length: 60 }, (_, k) => { const a = (k / 60) * 6.283 + (k % 3) * 0.04; const r1 = 4 + (k % 7) * 2.4; const r2 = 56 + (k % 9) * 6; return `<path d="M${(50 + Math.cos(a) * r1).toFixed(1)} ${(46 + Math.sin(a) * r1).toFixed(1)} L${(50 + Math.cos(a) * r2).toFixed(1)} ${(46 + Math.sin(a) * r2).toFixed(1)}" stroke="${k % 4 === 0 ? '#7ab8ff' : k % 4 === 1 ? '#e8f4ff' : '#a8d0ff'}" stroke-width="${(0.3 + (k % 5) * 0.22).toFixed(2)}" opacity="${(0.55 + (k % 4) * 0.12).toFixed(2)}"/>`; }).join('')}
      <circle cx="50" cy="46" r="22" fill="url(#${u}c)"/>
      <path d="M0 100 L0 64 L22 76 L78 76 L100 64 L100 100Z" fill="url(#${u}k)"/><path d="M0 64 L22 76 L78 76 L100 64" stroke="#5a5e68" stroke-width="1.6" fill="none"/>
      <path d="M22 76 L18 100 M78 76 L82 100 M50 76 L50 100 M36 76 L34 100 M64 76 L66 100" stroke="#4a4e58" stroke-width="1"/>
      <path d="M0 0 L0 10 L22 6 L50 4 L78 6 L100 10 L100 0Z" fill="url(#${u}k)"/>
      ${[[30, 86, '#ff5a3a'], [36, 90, '#ffd23f'], [64, 86, '#3aff7a'], [70, 90, '#5ab8ff']].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="3" height="2" fill="${c}"/>`).join('')}
      <path d="M44 92 L56 92 L54 98 L46 98Z" fill="#2a2c34"/>` },
  };

  // ---------- the pool ----------
  // Card portraits (no secret cards), then everything else.
  const CARD_PICS = ['vader', 'yoda', 'grogu', 'din_djarin', 'boba_fett', 'ahsoka', 'darth_maul', 'kylo_ren', 'palpatine', 'luke', 'leia', 'han_solo',
    'chewbacca', 'obi_wan', 'rey', 'r2d2', 'bb8', 'stormtrooper', 'death_trooper', 'thrawn', 'grievous', 'mace_windu', 'count_dooku',
    'bo_katan', 'sabine', 'cad_bane', 'jango_fett', 'grand_inquisitor', 'cal_kestis', 'qui_gon', 'ewok_warrior', 'jawa', 'c3po', 'anakin', 'moff_gideon', 'padme',
    'falcon', 'x_wing', 'tie_fighter', 'tie_advanced', 'slave_one', 'razor_crest', 'a_wing', 'b_wing', 'n1_starfighter', 'tie_interceptor', 'hounds_tooth', 'delta7', 'y_wing', 'tie_bomber'];
  // Existing artwork that isn't a collectible card: bosses and HoloNet raid bosses.
  const ART_PICS = { a_rancor: ['rancor', 'Rancor'], a_isd: ['star_destroyer', 'Star Destroyer'], a_deathstar: ['death_star', 'Death Star'], a_jabba: ['raid_jabba', 'Jabba the Hutt'], a_sarlacc: ['raid_sarlacc', 'The Sarlacc'] };
  const DRAWN = { ...PLANETS, ...SYMBOLS, ...VEHICLES, ...CREATURES, ...THINGS, ...SCENES2 };
  const CAT = (id) => (id.startsWith('p_') ? 'planet' : id.startsWith('s_') ? 'symbol' : id.startsWith('v_') ? 'vehicle' : id.startsWith('c_') ? 'creature' : id.startsWith('t_') ? 'thing' : id.startsWith('sc_') ? 'scene' : 'creature');
  const POOL = [];
  for (const id of CARD_PICS) {
    const def = D.UNIT_MAP[id];
    if (!def || def.exclusive || def.rarity === 'secret') continue;
    POOL.push({ id, name: def.name, cat: def.kind === 'ship' ? 'ship' : 'character', use: 'both', card: id });
  }
  for (const [id, [unit, name]] of Object.entries(ART_PICS)) if (D.UNIT_MAP[unit]) POOL.push({ id, name, cat: unit.includes('star') || unit === 'death_star' ? 'thing' : 'creature', use: 'guild', unit });
  for (const [id, p] of Object.entries(DRAWN)) POOL.push({ id, name: p.name, cat: CAT(id), use: 'guild', draw: p.draw });
  const BY_ID = Object.fromEntries(POOL.map((p) => [p.id, p]));
  const CATS = [['character', 'Characters'], ['ship', 'Ships'], ['planet', 'Planets'], ['creature', 'Creatures'], ['vehicle', 'Vehicles'], ['symbol', 'Symbols'], ['thing', 'Famous things'], ['scene', 'Scenes']];

  // Inner SVG for a picture (no outer <svg>), or a full <svg> with `wrap`.
  const cache = new Map();
  function inner(id) {
    const p = BY_ID[id] || (D.UNIT_MAP[id] ? { card: id } : null);
    if (!p) return '';
    if (p.card || p.unit) return root.Art.unitArt(D.UNIT_MAP[p.card || p.unit]).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    if (!cache.has(id)) cache.set(id, p.draw(`px${id.replace(/[^a-z0-9]/g, '')}`));
    // A unique prefix per use keeps gradient ids from clashing when one picture shows twice.
    const u = `q${++seq}`;
    return cache.get(id).replace(/id="px/g, `id="${u}px`).replace(/url\(#px/g, `url(#${u}px`);
  }
  const svg = (id, attrs = '') => `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" ${attrs}>${inner(id)}</svg>`;
  const list = (use) => POOL.filter((p) => p.use === 'both' || p.use === use);

  HN.PICS = { POOL, BY_ID, CATS, inner, svg, list, has: (id) => !!BY_ID[id] };
})(window);

// HoloNet social layer (tester build only): player profiles with frames and
// badges, guilds with chat and a two-front guild raid, guild points and
// rewards, ranked seasons, and the cards those rewards hand out.
//
// Shared data lives in the tester database:
//   arena/<uid>   each player's own doc: squads, rating, profile, guild, points
//   guilds/<uid>  a guild, keyed by its founder
//   gchat/<uid>   each player's recent guild-chat lines
(function (root) {
  'use strict';
  const D = root.GameData;
  const UI = root.UI;
  const App = UI.App;
  const HN = root.HN;
  const A = root.HNArt;
  const K = root.ArtX;
  const Net = HN.Net;
  const { el, esc, fmt, toast, openModal } = UI;
  const S = HN.S;
  const sound = (n) => { if (root.Sound) root.Sound.play(n); };
  const week = () => HN.week();

  // =====================================================================
  // New reward cards
  // =====================================================================
  const { P, E, C, R, L, shade, shoulders, neck, head, eyes, brows, nose, mouth, saber, SCENES } = K;
  const add = (kind, id, fn) => root.Art.addArt(kind, id, fn);

  // Dark Trooper: the black battle droid, red eye slits, armoured shoulders.
  const darkTrooper = () => SCENES.corridor()
    + P('M2 100 C6 82 22 72 50 72 C78 72 94 82 98 100Z', '#15171b') + shade('M2 100 C6 82 22 72 50 72 L46 100Z', 0.25)
    + P('M10 86 C14 76 24 72 34 74 L32 90 C24 88 16 88 10 94Z', '#23262c') + P('M90 86 C86 76 76 72 66 74 L68 90 C76 88 84 88 90 94Z', '#23262c')
    + P('M34 78 L66 78 L62 96 L38 96Z', '#1c1f24') + [82, 86, 90].map((y) => L(40, y, 60, y, '#2e3238', 1.2)).join('')
    + P('M42 66 L58 66 L56 76 L44 76Z', '#202328') + L(46, 68, 46, 75, '#33373e', 1) + L(54, 68, 54, 75, '#33373e', 1)
    + P('M35 44 C35 26 42 19 50 19 C58 19 65 26 65 44 C65 56 60 66 50 68 C40 66 35 56 35 44Z', '#1b1d22')
    + shade('M35 44 C35 26 42 19 50 19 L50 68 C40 66 35 56 35 44Z', 0.18)
    + P('M38 41 L47 44 L47 47 L38 45Z', '#ff2a1a') + P('M62 41 L53 44 L53 47 L62 45Z', '#ff2a1a')
    + `<g style="filter:drop-shadow(0 0 2px #ff3a2a)">${P('M39 42 L46 44.4 L46 45.6 L39 44Z', '#ffd0c0')}${P('M61 42 L54 44.4 L54 45.6 L61 44Z', '#ffd0c0')}</g>`
    + P('M44 52 L56 52 L54 60 L46 60Z', '#121418') + [47, 50, 53].map((x) => L(x, 53.5, x, 58.5, '#2a2d33', 0.8)).join('')
    + P('M40 24 C44 21 56 21 60 24', 'none', 'stroke="#fff" stroke-opacity=".18" stroke-width="1.2" stroke-linecap="round"')
    + L(36, 36, 41, 30, '#2e3238', 1) + L(64, 36, 59, 30, '#2e3238', 1);
  add('char', 'hn_dark_trooper', darkTrooper);
  add('char', 'gr_darktrooper', darkTrooper);

  // Nite Owl: Bo-Katan's elite, blue-grey armour with the owl wing marks, jetpack.
  add('char', 'hn_nite_owl', () => SCENES.city()
    + P('M18 70 L26 50 L32 52 L28 74Z', '#4a5260') + P('M82 70 L74 50 L68 52 L72 74Z', '#4a5260') + C(27, 49, 3, '#ff8a2a', 'opacity=".8"') + C(73, 49, 3, '#ff8a2a', 'opacity=".8"')
    + shoulders('#28303c') + P('M30 78 C36 74 64 74 70 78 L68 96 L32 96Z', '#7c8ea4') + shade('M30 78 C36 74 50 74 50 74 L50 96 L32 96Z', 0.16)
    + P('M14 84 C18 78 26 76 32 78 L30 90 C24 88 18 88 14 92Z', '#7c8ea4') + P('M86 84 C82 78 74 76 68 78 L70 90 C76 88 82 88 86 92Z', '#7c8ea4')
    + P('M38 82 L50 88 L62 82 L60 86 L50 92 L40 86Z', '#2a3a5c')
    + P('M34 44 C34 27.5 41 21.5 50 21.5 C59 21.5 66 27.5 66 44 L66 61 L34 61Z', '#8fa2b8') + shade('M34 44 C34 27.5 41 21.5 50 21.5 L50 61 L34 61Z', 0.14)
    + P('M34 36 L46 31 L50 34 L54 31 L66 36 L66 40 L54 36 L50 40 L46 36 L34 40Z', '#2a3a5c')
    + P('M37.5 38 L62.5 38 L62.5 43 L54 43 L54 57 L46 57 L46 43 L37.5 43Z', '#0e0f10')
    + P('M39 24.5 C44 22.5 56 22.5 61 24.5', 'none', 'stroke="#fff" stroke-opacity=".4" stroke-width="1.2" stroke-linecap="round"')
    + R(35, 56, 30, 5, '#5a6c84') + L(64, 26, 70, 14, '#3a3d42', 1.2) + C(70, 14, 1.4, '#ff6a3a')
    + K.blaster(64, 88, -30, '#2a2d33'));

  // Kelleran Beq: the Jedi Master who carried Grogu out of the Temple.
  add('char', 'hn_kelleran', () => SCENES.temple()
    + shoulders('#6a4a2e') + P('M30 76 C36 72 64 72 70 76 L66 100 L34 100Z', '#c8b08a') + P('M42 74 L50 90 L58 74 L54 74 L50 82 L46 74Z', '#8a6a44')
    + P('M18 82 C24 76 32 74 38 76 L36 100 L18 100Z', '#5a3c22') + P('M82 82 C76 76 68 74 62 76 L64 100 L82 100Z', '#5a3c22')
    + neck('#6a4a32') + head('#6a4a32', { rx: 12.2, ry: 14.6 }) + shade('M38 40 Q40 52 46 58 L42 42Z', 0.14)
    + P('M38 50 C40 62 46 66 50 66 C54 66 60 62 62 50 C58 56 54 58 50 58 C46 58 42 56 38 50Z', '#2a1a10')
    + eyes({ iris: '#2a160c', y: 44 }) + brows('#1a0e08', { y: 40, w: 1.4 }) + nose({ y: 45 }) + mouth('smirk', { y: 54, color: '#3a1a10' })
    + P('M39.5 31 C44 28 56 28 60.5 31', 'none', 'stroke="#fff" stroke-opacity=".25" stroke-width="1.4" stroke-linecap="round"')
    + saber(70, 92, 88, 24, '#4ab8ff'));

  const ab = (name, cd, target, effects, desc) => ({ name, cd, target, effects, desc });
  const ult = (name, target, effects, desc, quote) => ({ name, cd: 0, target, effects, desc, quote, ultimate: true });
  const dmg = (mult, hits) => ({ type: 'damage', mult, hits: hits || 1 });
  const heal = (pct) => ({ type: 'heal', pct });
  const buff = (status, turns) => ({ type: 'status', status, turns, chance: 1 });
  const debuff = (status, turns, chance) => ({ type: 'status', status, turns, chance: chance == null ? 1 : chance });
  const tm = (amount) => ({ type: 'tm', amount });
  const NEW = [
    { id: 'hn_dark_trooper', name: 'Dark Trooper', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'tank', spd: 104, traits: ['droid'], home: 'coruscant',
      bio: 'A Phase III battle droid of beskar-alloy plating, built to march through blaster fire. Passive, Beskar Alloy: takes 25% less damage from attacks.',
      abilities: [ab('Crushing Grip', 0, 'enemy', [dmg(1.1), debuff('stun', 1, 0.2)], 'Deal damage with a 20% chance to Stun.'), ab('March Forward', 3, 'self', [buff('taunt', 2), buff('defUp', 2)], 'Gain Taunt and Defense Up for 2 turns.')],
      ultimate: ult('Phase III', 'allEnemies', [dmg(1.5), debuff('offDown', 2)], 'A squad of Dark Troopers drops in: damage all enemies and inflict Offense Down.', '…'),
      how: 'Guild raid only: a 1% drop each time your guild beats the raid' },
    { id: 'hn_nite_owl', name: 'Nite Owl', kind: 'character', faction: 'light', rarity: 'epic', role: 'attacker', spd: 154, traits: ['mandalorian'], home: 'coruscant',
      bio: 'One of Bo-Katan\'s elite Nite Owls, who strikes from above on a jetpack. Passive, Jetpack Strike: +20% damage against Taunting enemies.',
      abilities: [ab('Twin Blasters', 0, 'enemy', [dmg(0.6, 2)], 'Hit one enemy twice.'), ab('Dive from Above', 3, 'enemy', [dmg(1.8), tm(-30)], 'Heavy damage and remove 30% Turn Meter.')],
      ultimate: ult('Owls Take Flight', 'allEnemies', [dmg(1.5), { ...tm(25), on: 'allies' }], 'The whole squad jets in: damage all enemies and allies gain 25% Turn Meter.', 'For Mandalore!'),
      how: 'Season reward: finish a season in Silver or higher' },
    { id: 'hn_kelleran', name: 'Kelleran Beq', kind: 'character', faction: 'light', rarity: 'legendary', role: 'support', spd: 146, traits: ['jedi'], home: 'coruscant',
      bio: 'The Jedi Master who carried a foundling out of the burning Temple. Passive, Sabered Hand: allies below 30% health take 30% less damage.',
      abilities: [ab('Saber Form', 0, 'enemy', [dmg(1.1)], 'Deal damage and gain Defense Up for 1 turn.'), ab('Shelter the Foundling', 3, 'ally', [buff('defUp', 2), heal(0.25)], 'Heal one ally 25% and give them Defense Up.')],
      ultimate: ult('Out of the Fire', 'allAllies', [heal(0.3), buff('defUp', 2)], 'Heal every ally 30%, cleanse them and grant Defense Up for 2 turns.', 'Hold on, little one.'),
      how: 'Season reward: finish a season in Legend' },
  ];
  const SIG = { hn_dark_trooper: { move: 'shockwave', prop: 'roar', impact: 'stamp', color: '#ff3a2a' }, hn_nite_owl: { move: 'volley', prop: 'bolt', impact: 'burn', color: '#ff8a2a', n: 5 }, hn_kelleran: { move: 'aegis', prop: 'deflector', color: '#4ab8ff' } };
  for (const c of NEW) {
    if (D.UNIT_MAP[c.id]) continue;
    const def = { ...c, hn: true, sig: SIG[c.id] };
    delete def.how;
    D.UNIT_MAP[c.id] = def;
    if (D.BIOS) D.BIOS[c.id] = c.bio;
    if (!HN.HN_IDS.includes(c.id)) HN.HN_IDS.push(c.id);
    HN.HOW[c.id] = c.how;
  }

  // =====================================================================
  // Guild raid bosses: two fronts, one ground and one fleet
  // =====================================================================
  const alias = (from) => () => root.Art.unitArt(D.UNIT_MAP[from]).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  add('char', 'gr_gideon', alias('moff_gideon'));
  add('char', 'gr_thrawn', alias('thrawn'));
  const GBOSS = [
    { id: 'gr_gideon', name: 'Moff Gideon', kind: 'character', role: 'attacker', spd: 128, traits: ['empire', 'leader'],
      abilities: [ab('Darksaber Slash', 0, 'enemy', [dmg(1.4)], 'A cut from the Darksaber.'), ab('Call the Dark Troopers', 3, 'allAllies', [buff('offUp', 2)], 'His troopers strike harder.')],
      ultimate: ult('Beskar Fist', 'allEnemies', [dmg(1.8), debuff('defDown', 2)], 'Sweeps everyone with the Darksaber: heavy damage and Defense Down.', 'I will have the child.') },
    { id: 'gr_cruiser', name: 'Imperial Light Cruiser', kind: 'ship', shape: 'isd', role: 'tank', spd: 80, traits: ['capital'],
      abilities: [ab('Turbolaser Battery', 0, 'enemy', [dmg(1.3)], 'Heavy fire on one ship.'), ab('Launch TIEs', 3, 'allAllies', [buff('defUp', 2)], 'Fresh escorts screen the cruiser.')],
      ultimate: ult('Full Broadside', 'allEnemies', [dmg(1.7)], 'Every battery fires at once.', 'Fire at will.') },
    { id: 'gr_thrawn', name: 'Grand Admiral Thrawn', kind: 'character', role: 'support', spd: 132, traits: ['empire', 'leader'],
      abilities: [ab('Calculated Shot', 0, 'enemy', [dmg(1.3), debuff('offDown', 1, 0.5)], 'He already knew where you would stand.'), ab('Read the Art', 3, 'allEnemies', [debuff('defDown', 2, 0.8)], 'Studies your squad: Defense Down.')],
      ultimate: ult('Checkmate', 'allEnemies', [dmg(1.8), debuff('stun', 1, 0.4)], 'Every move was planned: heavy damage and a chance to Stun.', 'To defeat an enemy you must know them.') },
    { id: 'gr_chimaera', name: 'The Chimaera', kind: 'ship', shape: 'isd', role: 'tank', spd: 76, traits: ['capital'],
      abilities: [ab('Tractor Beam', 0, 'enemy', [dmg(1.1), tm(-25)], 'Holds one ship in place.'), ab('TIE Defender Screen', 3, 'allAllies', [buff('defUp', 2), heal(0.05)], 'Defenders swarm out.')],
      ultimate: ult('Turbolaser Storm', 'allEnemies', [dmg(1.8)], 'Thrawn\'s flagship opens up.', '') },
  ];
  for (const b of GBOSS) {
    if (D.UNIT_MAP[b.id]) continue;
    D.UNIT_MAP[b.id] = { ...b, faction: 'dark', rarity: 'legendary', home: 'coruscant', bio: 'Guild raid boss.', hn: true, raid: b.id, boss: { hp: 1, atk: 1.55, def: 1.4 }, hnUlt: true };
  }
  if (!D.UNIT_MAP.gr_darktrooper) D.UNIT_MAP.gr_darktrooper = { id: 'gr_darktrooper', name: 'Dark Trooper', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'tank', spd: 100, traits: [], home: 'coruscant', bio: 'Raid minion.', hn: true, minion: true,
    abilities: [ab('Crushing Grip', 0, 'enemy', [dmg(1.0)], 'Grabs one enemy.')], ultimate: ult('Phase III', 'allEnemies', [dmg(1.2)], 'They keep coming.', '') };

  const GRAIDS = [
    { id: 'g_gideon', name: "Moff Gideon's Remnant", planet: 'tatooine', color: '#ff3a2a',
      ground: { boss: 'gr_gideon', slots: ['gr_darktrooper', 'gr_darktrooper', 'gr_gideon', 'gr_darktrooper', 'gr_darktrooper'], start: [1, 2, 3], pool: 600000,
        mech: [['Dark Trooper drop', 'A fresh Dark Trooper marches in every 2 turns.'], ['Darksaber', 'Below half health, Gideon strikes twice as hard.']] },
      fleet: { boss: 'gr_cruiser', slots: ['tie_fighter', 'tie_fighter', 'gr_cruiser', 'tie_interceptor', 'tie_interceptor'], start: [0, 1, 2, 3, 4], pool: 450000,
        mech: [['Escort screen', 'The cruiser takes half damage while any TIE escort is still flying.'], ['Hangar bay', 'Relaunches one TIE every 3 turns.']] } },
    { id: 'g_thrawn', name: "Thrawn's Seventh Fleet", planet: 'scarif', color: '#4a8aff',
      ground: { boss: 'gr_thrawn', slots: ['death_trooper', 'death_trooper', 'gr_thrawn', 'death_trooper', 'stormtrooper'], start: [0, 2, 4], pool: 600000,
        mech: [['Tactical analysis', 'Every 3 turns Thrawn Stuns your fastest card.'], ['Death Trooper detail', 'A Death Trooper joins every 2 turns.']] },
      fleet: { boss: 'gr_chimaera', slots: ['tie_defender', 'tie_defender', 'gr_chimaera', 'tie_defender', 'tie_bomber'], start: [1, 2, 3], pool: 450000,
        mech: [['Turbolaser storm', 'Every 3 turns the Chimaera hits your whole fleet.'], ['Defender screen', 'Takes half damage while two or more Defenders fly.']] } },
  ];
  // Unit ids above that may not exist in every build fall back to plain TIEs.
  for (const g of GRAIDS) for (const f of ['ground', 'fleet']) g[f].slots = g[f].slots.map((id) => (D.UNIT_MAP[id] ? id : (f === 'fleet' ? 'tie_fighter' : 'stormtrooper')));
  // Update 2.2: guild raid fronts get the same toughening as weekly raids.
  for (const g of GRAIDS) for (const f of ['ground', 'fleet']) HN.toughPool(g[f]);
  const graidNow = () => GRAIDS[week() % GRAIDS.length];

  // Guild raid mechanics on top of the raid engine hooks.
  const BP = root.Battle.prototype;
  if (!BP.__hnSocial) {
    BP.__hnSocial = true;
    const baseBegin = BP.beginTurn;
    BP.beginTurn = function (unit) {
      const out = baseBegin.call(this, unit);
      const R = this.hnRaid;
      if (!R || !R.guild || unit.side !== 'enemy' || !unit.def.raid || !unit.alive) return out;
      const ev = out.events;
      const T = R.turn;
      const enemies = this.side('enemy');
      const waiting = enemies.filter((u) => !u.alive && !u.def.raid);
      const spawn = (u, text) => { u.alive = true; u.hp = u.maxHp; u.statuses = {}; u.tm = 0; u.ult = 0; ev.push({ type: 'revive', uid: u.uid, hp: u.hp }, { type: 'hnfx', fx: 'spawn', uid: u.uid }, { type: 'log', text, side: 'enemy' }); };
      if (unit.def.raid === 'gr_gideon' && T % 2 === 0 && waiting.length) spawn(waiting[0], 'A Dark Trooper drops in!');
      if (unit.def.raid === 'gr_cruiser' && T % 3 === 0 && waiting.length) spawn(waiting[0], 'The hangar launches a fresh TIE.');
      if (unit.def.raid === 'gr_thrawn') {
        if (T % 2 === 0 && waiting.length) spawn(waiting[0], 'A Death Trooper steps out of the shadows.');
        if (T % 3 === 0) {
          const f = this.living('player').sort((a, b) => b.spd - a.spd)[0];
          if (f) { f.statuses.stun = 1; ev.push({ type: 'status', uid: f.uid, status: 'stun', turns: 1 }, { type: 'log', text: `Thrawn saw it coming: ${f.def.name} is Stunned.`, side: 'enemy' }); }
        }
      }
      if (unit.def.raid === 'gr_chimaera' && T % 3 === 0) {
        ev.push({ type: 'log', text: 'Turbolaser storm!', side: 'enemy' });
        for (const u of this.living('player')) this.applyDamage(u, Math.max(1, Math.round(u.maxHp * 0.08)), false, ev, 'hazard');
      }
      return out;
    };
    const baseAct = BP.act;
    BP.act = function (unit) { this.hnActor = unit; try { return baseAct.apply(this, arguments); } finally { this.hnActor = null; } };
    const baseDamage = BP.applyDamage;
    BP.applyDamage = function (target, amount, crit, events, source) {
      const R = this.hnRaid;
      if (R && R.guild && target.def.raid && source !== 'hazard') {
        const esc2 = this.side('enemy').filter((u) => u.alive && !u.def.raid);
        if (target.def.raid === 'gr_cruiser' && esc2.length) amount = Math.round(amount / 2);
        if (target.def.raid === 'gr_chimaera' && esc2.filter((u) => u.id === 'tie_defender').length >= 2) amount = Math.round(amount / 2);
      }
      if (R && R.guild && this.hnActor && this.hnActor.def && this.hnActor.def.raid === 'gr_gideon' && this.hnActor.enraged && target.side === 'player') amount = Math.round(amount * 1.5);
      return baseDamage.call(this, target, amount, crit, events, source);
    };
  }

  // =====================================================================
  // Saved state for the social layer
  // =====================================================================
  const SEASON_WEEKS = 4;
  const seasonNo = () => Math.floor(week() / SEASON_WEEKS);
  const P2 = () => {
    const h = S();
    if (!h.prof) h.prof = { tag: '', av: '', frame: 'recruit', feat: [] };
    if (!h.soc) h.soc = { gp: 0, gpw: week(), gpl: 0, gr: { w: week(), b: '', d: 0, f: 0, claimed: false }, guildClaims: {}, guildLvl: 0, frames: ['recruit'], season: seasonNo(), sBest: h.rating, seasonsDone: 0 };
    if (h.soc.gpw !== week()) { h.soc.gpw = week(); h.soc.gp = 0; h.soc.guildClaims = {}; }
    if (!h.soc.gr || h.soc.gr.w !== week()) h.soc.gr = { w: week(), b: graidNow().id, d: 0, f: 0, claimed: false };
    return h;
  };
  // Guild points (War Banners upgrade adds a share on top).
  const addGP = (n) => { const h = P2(); const v = Math.round(n * (1 + (HN.guildPerk ? HN.guildPerk('gxp') : 0))); h.soc.gp += v; h.soc.gpl += v; };

  // =====================================================================
  // Frames: cosmetic rings for your profile picture
  // =====================================================================
  const FRAMES = {
    recruit: { name: 'Recruit', how: 'Everyone starts here' },
    bronze: { name: 'Bronze Plate', how: 'Reach Bronze II' },
    silver: { name: 'Silver Wing', how: 'Reach the Silver league' },
    gold: { name: 'Gold Sunburst', how: 'Reach the Gold league' },
    kyber: { name: 'Kyber Shards', how: 'Reach the Kyber league' },
    legend: { name: 'Legend Crown', how: 'Reach the Legend league' },
    guild: { name: 'Guild Banner', how: 'Be in a guild that reaches level 2' },
    victor: { name: 'Season Victor', how: 'Finish a season in Kyber or Legend' },
    podium: { name: 'Podium', how: 'Finish a season in the top 3 of the leaderboard' },
    champion: { name: 'Champion', how: 'Finish a season 1st on the leaderboard' },
    linked: { name: 'Holo Link', how: 'Save your game to an account (Settings)' },
    squadron: { name: 'Squadron Leader', how: 'Invite 10 friends who reach level 5' },
    recruiter: { name: 'Recruiter Legend', how: 'Invite 50 friends who reach level 5 (limited time)' },
  };
  let fseq = 0;
  function frameSvg(id, color) {
    const u = `fr${++fseq}`;
    const ring = (stroke, w, extra = '') => `<circle r="44" fill="none" stroke="${stroke}" stroke-width="${w}" ${extra}/>`;
    const grad = (a, b, c) => `<linearGradient id="${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".5" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
    let body = '';
    if (id === 'bronze') body = `<defs>${grad('#ffcf9a', '#b0682a', '#5a2e10')}</defs>${ring(`url(#${u})`, 7)}${Array.from({ length: 8 }, (_, k) => { const a = (k / 8) * Math.PI * 2; return `<circle cx="${(Math.cos(a) * 44).toFixed(1)}" cy="${(Math.sin(a) * 44).toFixed(1)}" r="2.2" fill="#ffe0b8"/>`; }).join('')}`;
    else if (id === 'silver') body = `<defs>${grad('#ffffff', '#a8b4c4', '#4a5464')}</defs>${ring(`url(#${u})`, 6)}${[-1, 1].map((s) => `<path d="M${s * 44} -6 L${s * 62} -18 L${s * 58} -8 L${s * 66} -4 L${s * 56} 2 L${s * 60} 10 L${s * 46} 6Z" fill="url(#${u})" stroke="#2a3240" stroke-width="1"/>`).join('')}`;
    else if (id === 'gold') body = `<defs>${grad('#fff4b0', '#e8b830', '#8a5c08')}</defs>${Array.from({ length: 16 }, (_, k) => `<path d="M0 -${k % 2 ? 54 : 60} L3 -46 L-3 -46Z" fill="#ffd86a" opacity=".85" transform="rotate(${k * 22.5})"/>`).join('')}${ring(`url(#${u})`, 7)}<path d="M0 -62 L4 -52 L14 -52 L6 -46 L9 -36 L0 -42 L-9 -36 L-6 -46 L-14 -52 L-4 -52Z" fill="#fff4b0" stroke="#8a5c08" stroke-width="1"/>`;
    else if (id === 'kyber') body = `<defs>${grad('#e8faff', '#5fd8ff', '#1a56a8')}</defs>${ring('#5fd8ff', 10, 'opacity=".25"')}${ring(`url(#${u})`, 5)}${Array.from({ length: 6 }, (_, k) => `<path d="M0 -60 L5 -50 L0 -40 L-5 -50Z" fill="#9aeaff" stroke="#e8faff" stroke-width=".8" transform="rotate(${k * 60})"/>`).join('')}`;
    else if (id === 'legend') body = `<defs>${grad('#ffe8a8', '#b070ff', '#3a0a6a')}</defs>${ring('#b070ff', 12, 'opacity=".25"')}${ring(`url(#${u})`, 6)}<circle r="50" fill="none" stroke="#ffe8a8" stroke-width="1.2" stroke-dasharray="3 5" opacity=".8"/><path d="M-16 -46 L-12 -62 L-4 -52 L0 -66 L4 -52 L12 -62 L16 -46Z" fill="#ffd86a" stroke="#6a3a0a" stroke-width="1"/><circle cy="-58" r="2.4" fill="#b070ff"/>`;
    else if (id === 'guild') body = `${ring(color || '#5fd8ff', 6)}<path d="M-22 40 L-22 62 L-14 56 L-6 62 L-6 42Z M22 40 L22 62 L14 56 L6 62 L6 42Z" fill="${color || '#5fd8ff'}" stroke="#06121e" stroke-width="1.2"/>${ring('#06121e', 1.2, 'r="40"')}`;
    else if (id === 'victor') body = `<defs>${grad('#fff0b0', '#ff5a3a', '#7a1a0a')}</defs>${ring(`url(#${u})`, 7)}${[-1, 1].map((s) => Array.from({ length: 6 }, (_, k) => { const a = (Math.PI / 2) + s * (0.5 + k * 0.32); return `<ellipse cx="${(Math.cos(a) * 52).toFixed(1)}" cy="${(Math.sin(a) * 52).toFixed(1)}" rx="7" ry="3" fill="#ffd86a" transform="rotate(${((a * 180) / Math.PI + 90).toFixed(0)} ${(Math.cos(a) * 52).toFixed(1)} ${(Math.sin(a) * 52).toFixed(1)})"/>`; }).join('')).join('')}`;
    // Season leaderboard frames: Champion (1st) and Podium (top 3).
    else if (id === 'champion') body = `<defs>${grad('#ffffff', '#ffd23f', '#a86a08')}</defs>${Array.from({ length: 24 }, (_, k) => `<path d="M0 -${k % 2 ? 56 : 64} L2.6 -47 L-2.6 -47Z" fill="#ffe27a" transform="rotate(${k * 15})"/>`).join('')}${ring(`url(#${u})`, 8)}<path d="M-20 -58 L-12 -46 L0 -60 L12 -46 L20 -58 L18 -42 L-18 -42Z" fill="#ffd23f" stroke="#7a4a08" stroke-width="1.4"/><circle cy="-52" r="2.6" fill="#ff3a5a"/>${ring('#3a2408', 1.2, 'r="40"')}`;
    else if (id === 'podium') body = `<defs>${grad('#f2f6ff', '#9ab0d8', '#3a4a6a')}</defs>${ring(`url(#${u})`, 7)}${[-1, 0, 1].map((k) => `<path d="M${k * 16 - 6} ${k ? 54 : 50} L${k * 16 + 6} ${k ? 54 : 50} L${k * 16 + 6} 64 L${k * 16 - 6} 64Z" fill="${k ? '#9ab0d8' : '#ffd23f'}" stroke="#1a2236" stroke-width="1"/>`).join('')}${Array.from({ length: 3 }, (_, k) => `<path d="M${(k - 1) * 16} -60 l2.4 5 5.4 .6 -4 3.6 1.2 5.4 -5 -2.8 -5 2.8 1.2 -5.4 -4 -3.6 5.4 -.6Z" fill="#ffe27a"/>`).join('')}`;
    // Saved accounts: a holo ring held together by four-colour chain links.
    else if (id === 'linked') body = `<defs>${grad('#e8faff', '#4a8cff', '#123a8a')}</defs>${ring('#5fd8ff', 11, 'opacity=".22"')}${ring(`url(#${u})`, 5)}${['#ea4335', '#fbbc05', '#34a853', '#4285f4'].map((c, k) => `<g transform="rotate(${k * 90 + 45})"><rect x="-9" y="-49" width="11" height="7" rx="3.5" fill="none" stroke="${c}" stroke-width="2.6"/><rect x="-2" y="-49" width="11" height="7" rx="3.5" fill="none" stroke="${c}" stroke-width="2.6"/></g>`).join('')}<g transform="translate(0 52)"><circle r="9" fill="#0b1a33" stroke="#8fd3ff" stroke-width="1.6"/><path d="M-4.2 1.6 L-1.6 -1 M1.6 1 L4.2 -1.6" stroke="#e8faff" stroke-width="1.8" stroke-linecap="round"/><rect x="-6" y="-1" width="6" height="4.4" rx="2.2" transform="rotate(-45 -3 1.2)" fill="none" stroke="#e8faff" stroke-width="1.5"/><rect x="0" y="-3.4" width="6" height="4.4" rx="2.2" transform="rotate(-45 3 -1.2)" fill="none" stroke="#e8faff" stroke-width="1.5"/></g>`;
    // Invites: four starfighters flying escort (10 friends)…
    else if (id === 'squadron') body = `<defs>${grad('#ffffff', '#ff7a5a', '#8a1a0a')}</defs>${ring(`url(#${u})`, 6)}${ring('#ffd9cc', 1.2, 'r="39"')}${[0, 90, 180, 270].map((a) => `<g transform="rotate(${a + 45}) translate(0 -52)"><path d="M0 -8 L2.2 -1 L9 2 L9 4.5 L2.2 3 L1.6 7 L4 9 L-4 9 L-1.6 7 L-2.2 3 L-9 4.5 L-9 2 L-2.2 -1Z" fill="#f2f4f8" stroke="#8a1a0a" stroke-width="1"/><circle cy="-2" r="1.3" fill="#ff5a3a"/></g>`).join('')}<g transform="translate(0 50)"><path d="M-18 -6 L18 -6 L14 0 L18 6 L-18 6 L-14 0Z" fill="#c8301a" stroke="#ffd9cc" stroke-width="1.2"/><path d="M-6 -2 L0 2.5 L6 -2" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    // …and a gold-and-violet crown of rays for 50 (limited time).
    else if (id === 'recruiter') body = `<defs>${grad('#fff6c8', '#ffb938', '#7a3a08')}<linearGradient id="${u}v" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8c8ff"/><stop offset="1" stop-color="#5a1aa8"/></linearGradient></defs>${Array.from({ length: 20 }, (_, k) => `<path d="M0 -${k % 2 ? 58 : 66} L3 -47 L-3 -47Z" fill="${k % 2 ? '#c890ff' : '#ffd86a'}" opacity=".9" transform="rotate(${k * 18})"/>`).join('')}${ring(`url(#${u}v)`, 10, 'opacity=".55"')}${ring(`url(#${u})`, 6)}<circle r="50" fill="none" stroke="#fff2b0" stroke-width="1" stroke-dasharray="2 4"/>${[-1, 1].map((sx) => `<path d="M${sx * 30} 40 Q${sx * 44} 52 ${sx * 50} 62 L${sx * 40} 60 L${sx * 36} 68 Q${sx * 30} 54 ${sx * 20} 46Z" fill="url(#${u}v)" stroke="#2a0a4a" stroke-width="1"/>`).join('')}<g transform="translate(0 -56)"><path d="M-12 6 L-12 -4 L-6 1 L0 -9 L6 1 L12 -4 L12 6Z" fill="url(#${u})" stroke="#7a3a08" stroke-width="1.2"/><circle cy="-9" r="2" fill="#e8c8ff"/></g><g transform="translate(0 50)"><circle r="8" fill="#2a0a4a" stroke="#ffd86a" stroke-width="1.6"/><text y="3.4" text-anchor="middle" font-size="9" font-weight="800" fill="#ffd86a" font-family="Oxanium, sans-serif">50</text></g>`;
    else body = ring('#5a6a7e', 4);
    return still(`<svg class="pf-frame" viewBox="-70 -70 140 140" aria-hidden="true">${body}</svg>`);
  }
  // Frames you own: from your best league, your guild and your seasons.
  function ownedFrames() {
    const h = P2();
    const out = new Set(h.soc.frames || ['recruit']);
    out.add('recruit');
    if ((h.divs || []).includes('bronze2')) out.add('bronze');
    for (const l of ['silver', 'gold', 'kyber', 'legend']) if ((h.leagues || []).includes(l)) out.add(l);
    if (Player.state.linked) out.add('linked');
    const iv = Player.state.invites || {};
    if (iv.squad) out.add('squadron');
    if (iv.recruiter) out.add('recruiter');
    return [...out];
  }
  // The saved-account frame stays out of the list until saved accounts are out (or you have it).
  const v21 = () => !!(root.Update21 && root.Update21.on());
  const shownFrames = () => {
    const own = ownedFrames();
    return Object.entries(FRAMES).filter(([id]) => {
      if (own.includes(id) || !['linked', 'squadron', 'recruiter'].includes(id)) return true;
      if (id === 'recruiter') return v21() && !!(root.Invite && root.Invite.recruiterOpen());
      return v21();
    });
  };

  // =====================================================================
  // Profiles: what other players see when they tap your name
  // =====================================================================
  // Badges and frames sit still in the HoloNet: their SVG animations are
  // stripped so a profile full of them costs nothing to draw.
  const still = (html) => String(html).replace(/<animate(?:Transform|Motion)?\b[^>]*\/>/g, '').replace(/<animate(?:Transform|Motion)?\b[^>]*>[\s\S]*?<\/animate(?:Transform|Motion)?>/g, '');
  HN.still = still;
  const SAFE = HN.safe || { clean: (t) => ({ text: t, blocked: false, changed: false }), ok: () => true };
  const cleanTag = (s) => { const t = String(s || '').replace(/[^A-Za-z0-9_ .-]/g, '').trim().slice(0, 16); return SAFE.ok(t) ? t : ''; };
  // Players you've muted: their chat never shows for you (kept on this device).
  const muted = () => { const h = S(); return (h.muted = h.muted || []); };
  const isMuted = (uid) => muted().includes(uid);
  function myBadges() {
    let list = [];
    try { list = UI.achievements().filter((x) => x.have >= x.need); } catch (e) { list = []; }
    const pick = (P2().prof.feat || []).map((id) => list.find((x) => (x.id || x.name) === id)).filter(Boolean);
    const rest = list.filter((x) => !pick.includes(x)).sort((a, b) => (b.tier || 1) - (a.tier || 1));
    const top = [...pick, ...rest].slice(0, 6).map((x) => ({ id: x.id || '', tier: x.tier || 1, icon: x.icon, name: x.name, desc: x.desc, secret: !!x.secret, level: x.level }));
    return { top, n: list.length, all: list };
  }
  function myStats() {
    const h = S();
    const raidDmg = Object.values(h.raids || {}).reduce((a, r) => a + (r.dmg || 0), 0);
    const d = h.duels || { w: 0, l: 0 };
    return { w: h.wins, l: h.losses, best: h.best, dw: d.w, dl: d.l, raid: raidDmg, bosses: Object.values(h.beaten || {}).reduce((a, n) => a + n, 0), cards: Object.keys(Player.state.units).length, hn: HN.HN_IDS.filter(HN.owns).length, seasons: (h.soc && h.soc.seasonsDone) || 0 };
  }
  const defaultAv = () => (HN.squad('character')[0] || Object.keys(Player.state.units)[0] || 'luke');
  function myProfile() {
    const h = P2();
    const b = myBadges();
    return { tag: cleanTag(h.prof.tag), av: h.prof.av && D.UNIT_MAP[h.prof.av] ? h.prof.av : defaultAv(), frame: ownedFrames().includes(h.prof.frame) ? h.prof.frame : 'recruit', badges: b.top, nb: b.n, st: myStats() };
  }
  // A row from the database, or me, in one shape.
  function prof(uid) {
    const me = !uid || uid === Net.me || uid === 'me';
    if (me) { const h = S(); const p = myProfile(); return { uid: Net.me || 'me', me: true, ...p, rating: h.rating, level: Player.state.account.level, guild: h.guild || null, gpl: P2().soc.gpl }; }
    const a = Net.arena.find((x) => x.uid === uid) || {};
    return { uid, me: false, tag: cleanTag(a.tag), av: a.av && D.UNIT_MAP[a.av] ? a.av : ((a.ground || [])[0] || {}).id || 'luke', frame: FRAMES[a.frame] ? a.frame : 'recruit', badges: Array.isArray(a.badges) ? a.badges.slice(0, 6) : [], nb: a.nb || 0, st: a.st || {}, rating: a.rating || 800, level: a.level || 1, guild: a.guild || null, gpl: a.gpl || 0 };
  }
  // Name shown everywhere: your callsign, else your account name.
  const baseName = Net.name.bind(Net);
  Net.name = function (uid) {
    if (uid === this.me || uid === 'me') { const t = cleanTag(S().prof && S().prof.tag); return t ? `${t} (you)` : 'You'; }
    const a = this.arena.find((x) => x.uid === uid);
    const t = a && cleanTag(a.tag);
    if (t) return t;
    // Someone we haven't loaded (not on the boards we fetched): look up
    // their row once so everyone sees their callsign, not a placeholder.
    if (uid && !a && this.ready && this.db) lookupName(uid);
    return baseName(uid);
  };
  const asked = new Map();
  let nameRedraw = 0;
  async function lookupName(uid) {
    const last = asked.get(uid) || 0;
    if (Date.now() - last < 120000) return;
    asked.set(uid, Date.now());
    try {
      const d = await Net.db.doc(`arena/${uid}`).get();
      const t = d && d.exists && cleanTag((d.data() || {}).tag);
      if (t && Net.names[uid] !== t) { Net.names[uid] = t; clearTimeout(nameRedraw); nameRedraw = setTimeout(() => { if (!document.querySelector('.modal-backdrop')) rerender(); }, 400); }
    } catch (e) { /* names are optional */ }
  }
  const avatar = (p, size = 'sm') => {
    const g = p.guild && guildOf(p.guild);
    return `<span class="pf-av ${size}"><span class="pic">${root.Art.unitArt(D.UNIT_MAP[p.av] || D.UNIT_MAP.luke)}</span>${frameSvg(p.frame, g && g.color)}</span>`;
  };
  // The tappable name chip used in every list.
  function chip(uid, extra = '') {
    const p = prof(uid);
    const g = p.guild && guildOf(p.guild);
    return `<button type="button" class="pf-chip" data-hn="prof" data-uid="${esc(p.uid)}">${avatar(p)}<span class="nm"><b>${esc(Net.name(p.uid))}</b><small>${g ? `[${esc(g.tag)}] ` : ''}${p.nb} badge${p.nb === 1 ? '' : 's'}${extra}</small></span></button>`;
  }
  HN.chip = chip;
  HN.prof = prof;

  // Leaders and co-leaders (and elders, if allowed) can invite players with no guild.
  const canInvite = (p) => { const gid = myGuildId(); return !!gid && !p.me && !p.guild && canReview(gid) && Net.ready; };
  function openProfile(uid) {
    const p = prof(uid);
    const d = HN.divOf(p.rating);
    const g = p.guild && guildOf(p.guild);
    const st = p.st || {};
    const wr = (st.w || 0) + (st.l || 0) ? Math.round(((st.w || 0) / ((st.w || 0) + (st.l || 0))) * 100) : 0;
    const badges = p.badges.length ? p.badges.map((x) => `<button type="button" class="pf-bdg" data-bdg='${esc(JSON.stringify(x))}'>${still(UI.featBadge(x))}<span>${esc(x.name)}</span></button>`).join('') : '<p class="muted small">No badges yet.</p>';
    const m = openModal(`<div class="pf-card" style="--gc:${g ? g.color : '#5fd8ff'}">
      <button type="button" class="pf-x" data-x="ok" aria-label="Close">✕</button>
      <div class="pf-top">${avatar(p, 'lg')}<div class="pf-id"><p class="eyebrow">${p.me ? 'Your HoloNet profile' : 'HoloNet profile'}</p><h2>${esc(Net.name(p.uid).replace(' (you)', ''))}</h2>
        <p class="muted small">Level ${p.level} · ${esc(FRAMES[p.frame].name)} frame${g ? ` · <b style="color:${g.color}">[${esc(g.tag)}] ${esc(g.name)}</b>` : ''}</p></div>
        <div class="pf-lg">${A.badge(d.league, d.div)}<small>${esc(d.name)}</small></div></div>
      <div class="pf-stats">
        <div><b>${fmt(p.rating)}</b><span>Rating</span></div><div><b>${fmt(st.best || p.rating)}</b><span>Best</span></div>
        <div><b>${fmt(st.w || 0)}–${fmt(st.l || 0)}</b><span>Arena W–L · ${wr}%</span></div><div><b>${fmt(st.dw || 0)}–${fmt(st.dl || 0)}</b><span>Live duels</span></div>
        <div><b>${fmt(st.raid || 0)}</b><span>Raid damage</span></div><div><b>${fmt(st.bosses || 0)}</b><span>Bosses beaten</span></div>
        <div><b>${fmt(st.cards || 0)}</b><span>Cards</span></div><div><b>${fmt(st.seasons || 0)}</b><span>Seasons played</span></div>
      </div>
      <h3 class="pf-h">Badges <small>${p.nb} earned${p.badges.length ? ' · showing the top ' + p.badges.length : ''}</small></h3>
      <div class="pf-bdgs">${badges}</div>
      <div class="modal-actions">${p.me ? '<button type="button" class="btn" data-x="edit">Edit profile</button>' : `${canInvite(p) ? `<button type="button" class="btn" data-x="invite">${((gmap.get(myGuildId()) || {}).ok || []).includes(p.uid) ? 'Invited' : 'Invite to guild'}</button>` : ''}<button type="button" class="btn" data-x="mute">${isMuted(p.uid) ? 'Unmute' : 'Mute in chat'}</button>`}<button type="button" class="btn btn-primary" data-x="ok">Close</button></div>
    </div>`, { small: true });
    m.root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-bdg]');
      if (b) { try { const x = JSON.parse(b.dataset.bdg); toast(`${x.name}: ${x.desc || ''}`); } catch (er) { /* ignore */ } return; }
      const x = e.target.closest('[data-x]');
      if (!x) return;
      m.close();
      if (x.dataset.x === 'edit') editProfile();
      if (x.dataset.x === 'invite') inviteTo(p.uid);
      if (x.dataset.x === 'mute') {
        const list = muted();
        if (isMuted(p.uid)) { list.splice(list.indexOf(p.uid), 1); toast(`${Net.name(p.uid)} is unmuted.`); } else { list.push(p.uid); toast(`${Net.name(p.uid)} is muted. You won't see their chat.`); }
        HN.save(); rerender();
      }
    });
  }
  HN.openProfile = openProfile;

  // Callsigns are unique: each one is claimed in names/<key> (lowercase
  // letters and digits only, so "Kessel Runner" and "kesselrunner" are the
  // same name). Claiming fails if someone else holds it; changing your
  // callsign frees the old one, so everyone holds at most one.
  const nameKey = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const fsNames = () => !!(Net.ready && Net.db && Net.db.firestore);
  async function nameFree(key) {
    if (!fsNames()) return true;
    try { const d = await Net.db.doc(`names/${key}`).get(); return !d.exists || d.data().uid === Net.me; } catch (e) { return null; }
  }
  async function claimName(key) {
    if (!fsNames()) return 'ok';
    const ref = Net.db.doc(`names/${key}`);
    try { await ref.set({ uid: Net.me, t: Date.now() }); return 'ok'; } catch (e) {
      try { const d = await ref.get(); return d.exists && d.data().uid === Net.me ? 'ok' : d.exists ? 'taken' : 'error'; } catch (e2) { return 'error'; }
    }
  }
  const releaseName = (key) => { if (key && fsNames()) Net.db.doc(`names/${key}`).delete().catch(() => {}); };
  // A callsign saved before names were unique gets claimed on connect; if
  // someone else already holds it, the player picks a new one.
  let claimChecked = '';
  Net.on(async () => {
    if (!fsNames() || claimChecked === Net.me) return;
    claimChecked = Net.me;
    const h = P2(); const t = cleanTag(h.prof.tag); const key = nameKey(t);
    if (!t || (h.prof.key === key && h.prof.kuid === Net.me)) return;
    const r = key.length >= 3 ? await claimName(key) : 'taken';
    if (r === 'ok') { h.prof.key = key; h.prof.kuid = Net.me; }
    else if (r === 'taken') { h.prof.tag = ''; h.prof.key = ''; toast(`Another player already uses the callsign "${t}". Pick a new one.`); }
    else { claimChecked = ''; return; }
    HN.save(); Net.lastKey = null; Net.publish(); rerender();
  });
  const tagCheck = (typed) => {
    const key = nameKey(typed);
    if (!typed) return { ok: true, msg: 'No callsign: other players see your account name.' };
    if (key.length < 3) return { ok: false, msg: 'Use at least 3 letters or numbers.' };
    if (!SAFE.ok(typed)) return { ok: false, msg: 'Keep it friendly: pick a different callsign.' };
    if (/^pilot[a-z0-9]{4}$/.test(key)) return { ok: false, msg: 'That one is reserved. Pick another.' };
    return { ok: true, key };
  };

  // Every HoloNet pilot needs a callsign. Once the tour is over (finished or
  // skipped), anything you tap in the HoloNet asks for one first; the tour's
  // last step opens the same window.
  const hasName = () => { const h = P2(); const t = cleanTag(h.prof.tag); return !!t && (!fsNames() || (h.prof.key === nameKey(t) && (!h.prof.kuid || h.prof.kuid === Net.me))); };
  const needName = () => HN.ui.unlocked() && !!(S().tour && S().tour.done) && Net.ready && !hasName();
  let askOpen = null;
  function askName(after) {
    if (askOpen) return askOpen;
    const h = P2();
    let tag = '';
    let busy = false;
    const m = openModal(`<div class="nm-req">
      <div class="nm-top"><div class="nm-who">${HN.ui.ACKBAR}</div><div><p class="eyebrow">Admiral Ackbar · last step</p><h2>Choose your callsign</h2>
        <p class="muted small">This is the name every player sees: on leaderboards, in guilds and chat, and when you duel. It's yours alone, so nobody else can use it.</p></div></div>
      <label class="pf-lbl">Callsign <small>3 to 16 letters or numbers</small>
        <input class="pf-in nm-in" data-tag maxlength="16" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="e.g. KesselRunner"></label>
      <p class="pe-st" data-st>You can change it later from your profile.</p>
      <div class="modal-actions"><button type="button" class="btn" data-x="leave">Not now</button><button type="button" class="btn btn-primary" data-x="ok" disabled>Confirm callsign</button></div></div>`, { small: true, dismissable: false });
    askOpen = m;
    const $ = (q) => m.root.querySelector(q);
    const okBtn = $('[data-x="ok"]');
    const status = (msg, cls) => { const n = $('[data-st]'); n.textContent = msg; n.className = `pe-st ${cls || ''}`; };
    let seq = 0; let timer = 0;
    const check = () => {
      clearTimeout(timer);
      const typed = String(tag || '').replace(/[^A-Za-z0-9_ .-]/g, '').trim().slice(0, 16);
      const c = tagCheck(typed);
      okBtn.disabled = true;
      if (!typed) return status('You can change it later from your profile.');
      if (!c.ok) return status(c.msg, 'bad');
      if (!fsNames()) { okBtn.disabled = !Net.ready; return status(Net.ready ? '' : 'Connecting to the HoloNet…'); }
      status('Checking…');
      const my = ++seq;
      timer = setTimeout(async () => { const free = await nameFree(c.key); if (my !== seq) return; if (free) { okBtn.disabled = false; status(`"${typed}" is available.`, 'good'); } else status(free === false ? `"${typed}" is already taken. Try another.` : "Couldn't check that one. Try again.", 'bad'); }, 400);
    };
    setTimeout(() => { const i = $('[data-tag]'); if (i) i.focus(); }, 300);
    m.root.addEventListener('input', (e) => { if (e.target.matches('[data-tag]')) { tag = e.target.value; check(); } });
    m.root.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !okBtn.disabled) okBtn.click(); });
    const close = () => { askOpen = null; m.close(); };
    m.root.addEventListener('click', async (e) => {
      const x = e.target.closest('[data-x]');
      if (!x || busy) return;
      if (x.dataset.x === 'leave') { close(); return App.go('home'); }
      const typed = String(tag || '').replace(/[^A-Za-z0-9_ .-]/g, '').trim().slice(0, 16);
      const c = tagCheck(typed);
      if (!c.ok || !c.key) return status(c.msg || 'Pick a callsign first.', 'bad');
      busy = true; okBtn.disabled = true; okBtn.textContent = 'Saving…';
      const r = await claimName(c.key);
      busy = false; okBtn.textContent = 'Confirm callsign';
      if (r === 'taken') return status(`"${typed}" was just taken. Try another.`, 'bad');
      if (r !== 'ok') { okBtn.disabled = false; return status("Couldn't save it right now. Try again.", 'bad'); }
      const old = h.prof.key || '';
      h.prof = { ...h.prof, tag: typed, key: c.key, kuid: Net.me };
      HN.save(); await Net.publish();
      if (old && old !== c.key) releaseName(old);
      if (HN.Duel && HN.Duel.setPresence) HN.Duel.setPresence();
      close();
      toast(`Welcome to the HoloNet, ${typed}!`);
      rerender();
      if (after) after();
    });
    return m;
  }
  HN.needName = needName;
  HN.askName = askName;
  HN.gate = () => { if (!needName()) return false; askName(); return true; };
  // Arriving in the HoloNet without a callsign asks for one straight away
  // (and again if the connection comes up after you arrive).
  const nudge = () => setTimeout(() => { if (App.current === 'holonet' && !App.battleActive && needName() && !document.querySelector('.modal-backdrop, .hc, .feat-show')) askName(); }, 900);
  const goBase = App.go;
  App.go = function (screen) { const r = goBase.apply(this, arguments); if (screen === 'holonet') nudge(); return r; };
  Net.on(() => { if (Net.ready) nudge(); });

  // The profile editor: a live preview on top, then one section at a time
  // (Picture, Frame, Badges) so each gets the whole window, and Save always
  // in reach at the bottom. Tapping a choice only updates what changed.
  let peTab = 'pic';
  let peCat = 'light';
  let peChose = false;
  function editProfile(opts = {}) {
    const h = P2();
    const frames = ownedFrames();
    const b = myBadges();
    let tag = h.prof.tag || '';
    let av = h.prof.av || defaultAv();
    let frame = frames.includes(h.prof.frame) ? h.prof.frame : 'recruit';
    let feat = (h.prof.feat || []).slice(0, 6);
    let saving = false;
    const cards = [...new Set([...PICS, ...HN.HN_IDS.filter(HN.owns)])].filter((id) => D.UNIT_MAP[id] && D.UNIT_MAP[id].rarity !== 'secret');
    const CATS = [
      ['light', 'Light side', (u) => u.kind !== 'ship' && u.faction === 'light' && !/^hn_/.test(u.id)],
      ['dark', 'Dark side', (u) => u.kind !== 'ship' && u.faction !== 'light' && !/^hn_/.test(u.id)],
      ['ship', 'Ships', (u) => u.kind === 'ship' && !/^hn_/.test(u.id)],
      ['hn', 'HoloNet', (u) => /^hn_/.test(u.id)],
    ].filter(([, , f]) => cards.some((id) => f(D.UNIT_MAP[id])));
    if (!CATS.some(([k]) => k === peCat)) peCat = CATS[0][0];
    if (D.UNIT_MAP[av]) { const c = CATS.find(([, , f]) => f(D.UNIT_MAP[av])); if (c && !peChose) peCat = c[0]; }
    const nm = (id) => esc(D.UNIT_MAP[id] ? D.UNIT_MAP[id].name : '');
    const preview = () => `${avatar({ av, frame, guild: h.guild }, 'lg')}`;
    const summary = () => `${nm(av)} · ${esc(FRAMES[frame].name)} frame · ${feat.length} badge${feat.length === 1 ? '' : 's'}`;
    const pane = () => {
      if (peTab === 'frame') return `<div class="pf-frames pe-frames">${shownFrames().sort(([a], [c]) => frames.includes(c) - frames.includes(a)).map(([id, f]) => { const own = frames.includes(id); return `<button type="button" class="pf-fr ${id === frame ? 'on' : ''} ${own ? '' : 'locked'}" data-fr="${id}" ${own ? '' : 'disabled'}>${avatar({ av, frame: id, guild: h.guild }, 'md')}<b>${esc(f.name)}</b><small>${own ? 'Unlocked' : esc(f.how)}</small></button>`; }).join('')}</div>`;
      if (peTab === 'badge') return `<p class="muted small pe-note">Pick up to 6 to show on your profile · <b data-featn>${feat.length}/6</b></p><div class="pf-bdgs pick">${b.all.map((x) => { const k = x.id || x.name; return `<button type="button" class="pf-bdg ${feat.includes(k) ? 'on' : ''}" data-ft="${esc(k)}">${still(UI.featBadge(x))}<span>${esc(x.name)}</span></button>`; }).join('') || '<p class="muted small">Earn badges around the game and show them off here.</p>'}</div>`;
      const f = (CATS.find(([k]) => k === peCat) || CATS[0])[2];
      return `<div class="pe-cats" data-noswipe>${CATS.map(([k, n, ff]) => `<button type="button" class="${k === peCat ? 'on' : ''}" data-pcat="${k}">${n} <small>${cards.filter((id) => ff(D.UNIT_MAP[id])).length}</small></button>`).join('')}</div>
        <div class="pe-avs">${cards.filter((id) => f(D.UNIT_MAP[id])).map((id) => `<button type="button" class="pe-av ${id === av ? 'on' : ''}" data-av="${id}" aria-label="${nm(id)}"><span class="pic">${root.Art.unitArt(D.UNIT_MAP[id])}</span><small>${nm(id)}</small></button>`).join('')}</div>`;
    };
    const tabs = () => [['pic', 'Picture'], ['frame', 'Frame'], ['badge', `Badges <small data-featn2>${feat.length}/6</small>`]].map(([k, n]) => `<button type="button" class="${k === peTab ? 'on' : ''}" data-ptab="${k}">${n}</button>`).join('');
    const m = openModal(`<div class="pf-edit pe">
      <div class="pe-head"><div class="pe-prev" data-prev>${preview()}</div>
        <div class="pe-id"><h2>${opts.setup ? 'Your pilot profile' : 'Edit profile'}</h2>${opts.setup ? '<p class="muted small pe-setup">Your name and picture for the HoloNet. Everything is saved with your account, ready for when you unlock it at level 25.</p>' : ''}
          <label class="pf-lbl">Callsign <small>3 to 16 letters or numbers · nobody else can have the same one</small>
          <input class="pf-in" data-tag maxlength="16" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(tag)}" placeholder="e.g. KesselRunner"></label>
          <p class="pe-st" data-st></p></div></div>
      <p class="pe-sum muted small" data-sum>${summary()}</p>
      <div class="pe-tabs" data-noswipe>${tabs()}</div>
      <div class="pe-pane" data-pane>${pane()}</div>
      <div class="pe-foot"><button type="button" class="btn" data-x="cancel">${opts.setup ? 'Later' : 'Cancel'}</button><button type="button" class="btn btn-primary" data-x="save">Save</button></div></div>`, opts.setup ? { dismissable: false } : {});
    m.root.querySelector('.modal')?.classList.add('pe-modal');
    const $ = (q) => m.root.querySelector(q);
    const refreshTop = () => { $('[data-prev]').innerHTML = preview(); $('[data-sum]').innerHTML = summary(); };
    const showPane = () => { $('[data-pane]').innerHTML = pane(); $('.pe-tabs').innerHTML = tabs(); };
    // Callsign status as you type: friendly, long enough, and free.
    let checkSeq = 0; let timer = 0;
    const status = (msg, cls) => { const n = $('[data-st]'); n.textContent = msg || ''; n.className = `pe-st ${cls || ''}`; };
    const check = () => {
      clearTimeout(timer);
      const typed = cleanTag(tag) || String(tag || '').trim();
      const c = tagCheck(String(tag || '').replace(/[^A-Za-z0-9_ .-]/g, '').trim());
      if (!c.ok) return status(c.msg, 'bad');
      if (!c.key || c.key === h.prof.key) return status(c.key ? 'This is your callsign.' : c.msg, c.key ? 'good' : '');
      if (!fsNames()) return status(Net.ready ? '' : 'Connect to the HoloNet to change your callsign.', Net.ready ? '' : 'bad');
      status('Checking…');
      const seq = ++checkSeq;
      timer = setTimeout(async () => { const free = await nameFree(c.key); if (seq !== checkSeq) return; status(free === null ? '' : free ? `"${typed}" is available.` : `"${typed}" is already taken.`, free ? 'good' : free === false ? 'bad' : ''); }, 450);
    };
    check();
    m.root.addEventListener('input', (e) => { if (e.target.matches('[data-tag]')) { tag = e.target.value; check(); } });
    m.root.addEventListener('click', async (e) => {
      const tb = e.target.closest('[data-ptab]'); if (tb) { peTab = tb.dataset.ptab; showPane(); $('.pe-tabs').scrollIntoView({ block: 'nearest' }); return; }
      const pc = e.target.closest('[data-pcat]'); if (pc) { peCat = pc.dataset.pcat; peChose = true; return showPane(); }
      const f = e.target.closest('[data-fr]'); if (f && !f.disabled) { frame = f.dataset.fr; m.root.querySelectorAll('[data-fr]').forEach((n) => n.classList.toggle('on', n === f)); return refreshTop(); }
      const a = e.target.closest('[data-av]'); if (a) { av = a.dataset.av; m.root.querySelectorAll('[data-av]').forEach((n) => n.classList.toggle('on', n === a)); return refreshTop(); }
      const t = e.target.closest('[data-ft]');
      if (t) {
        const k = t.dataset.ft;
        if (!feat.includes(k) && feat.length >= 6) return toast('You can show up to 6 badges. Tap one to remove it first.');
        feat = feat.includes(k) ? feat.filter((x) => x !== k) : [...feat, k];
        t.classList.toggle('on', feat.includes(k));
        m.root.querySelectorAll('[data-featn],[data-featn2]').forEach((n) => { n.textContent = `${feat.length}/6`; });
        return refreshTop();
      }
      const x = e.target.closest('[data-x]');
      if (!x || saving) return;
      if (x.dataset.x === 'save') {
        const typed = String(tag || '').replace(/[^A-Za-z0-9_ .-]/g, '').trim().slice(0, 16);
        const c = tagCheck(typed);
        if (!c.ok) { status(c.msg, 'bad'); return toast(c.msg); }
        const key = c.key || '';
        const old = h.prof.key || '';
        if (key && (key !== old || (h.prof.kuid && h.prof.kuid !== Net.me))) {
          if (!fsNames()) return toast('Connect to the HoloNet to change your callsign.');
          saving = true; x.disabled = true; x.textContent = 'Checking…';
          const r = await claimName(key);
          saving = false; x.disabled = false; x.textContent = 'Save';
          if (r === 'taken') { status(`"${typed}" is already taken.`, 'bad'); return toast(`"${typed}" is already taken. Try another callsign.`); }
          if (r !== 'ok') return toast("Couldn't check that callsign right now. Try again.");
        }
        h.prof = { tag: key ? typed : '', key, kuid: key ? Net.me : '', av, frame, feat };
        HN.save(); await Net.publish();
        if (old && old !== key) releaseName(old);
        if (HN.Duel && HN.Duel.setPresence) HN.Duel.setPresence();
        toast('Profile saved.');
      }
      m.close();
      rerender();
      if (opts.after) opts.after(x.dataset.x === 'save');
    });
  }
  // Find a pilot (2.1): look anyone up by their callsign and open their profile.
  function findPilot() {
    const m = openModal(`<div class="fp">
      <h2>Find a pilot</h2>
      <p class="muted small">Type a callsign to see that pilot's profile: picture, frame, badges, rating, record and guild.</p>
      <div class="fp-row"><input class="pf-in" data-q maxlength="16" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Callsign"><button type="button" class="btn btn-primary" data-x="go">Search</button></div>
      <p class="pe-st" data-st></p>
      <div class="modal-actions"><button type="button" class="btn" data-x="close">Close</button></div></div>`, { small: true });
    const $ = (q) => m.root.querySelector(q);
    const st = (msg, cls) => { $('[data-st]').textContent = msg || ''; $('[data-st]').className = `pe-st ${cls || ''}`; };
    setTimeout(() => { const i = $('[data-q]'); if (i) i.focus(); }, 250);
    let busy = false;
    const search = async () => {
      if (busy) return;
      const q = String($('[data-q]').value || '').trim();
      const key = nameKey(q);
      if (key.length < 3) return st('Callsigns have at least 3 letters or numbers.', 'bad');
      if (!Net.ready) { Net.init(); return st('Connecting to the HoloNet… try again in a moment.', 'bad'); }
      busy = true; st('Searching…');
      try {
        let uid = null;
        if (fsNames()) { const d = await Net.db.doc(`names/${key}`).get(); uid = d.exists ? d.data().uid : null; }
        else { const r = Net.arena.find((x) => nameKey(x.tag) === key); uid = r ? r.uid : null; }
        if (!uid) return st(`No pilot is called "${q}". Check the spelling.`, 'bad');
        if (uid === Net.me) { m.close(); return openProfile('me'); }
        const a = await Net.db.doc(`arena/${uid}`).get();
        if (!a.exists || !a.data()) return st(`${q} hasn't entered the HoloNet yet.`, 'bad');
        Net.rows.set(uid, { ...(Net.rows.get(uid) || {}), ...a.data(), uid });
        Net.sync();
        m.close();
        openProfile(uid);
      } catch (e) { st("Couldn't search right now. Try again.", 'bad'); } finally { busy = false; }
    };
    m.root.addEventListener('keydown', (e) => { if (e.key === 'Enter') search(); });
    m.root.addEventListener('click', (e) => {
      const x = e.target.closest('[data-x]');
      if (!x) return;
      if (x.dataset.x === 'close') return m.close();
      search();
    });
  }
  HN.findPilot = findPilot;
  HN.clicks = HN.clicks || {};
  HN.clicks.findpilot = () => findPilot();

  // Saved accounts (js/account.js) set up the callsign and picture early, at any level.
  HN.setupProfile = async (after, edit) => {
    await Net.init();
    if (!Net.ready) { toast("Couldn't reach the HoloNet. Set up your profile later from Settings."); if (after) after(false); return; }
    editProfile({ setup: !edit, after });
  };
  // For the main game's Commander profile: your picture in its frame.
  HN.avatarHtml = (p, size) => avatar({ av: p.av || defaultAv(), frame: FRAMES[p.frame] ? p.frame : 'recruit', guild: P2().guild }, size || 'md');
  HN.frameName = (id) => (FRAMES[id] || FRAMES.recruit).name;
  HN.hasProfile = () => hasName();

  // =====================================================================
  // Publishing: my arena doc carries the profile, guild and points
  // =====================================================================
  Net.publish = async function () {
    if (!this.ready || !HN.ui.unlocked()) return;
    if (this.busy) { this.again = true; return; }
    const h = P2();
    const p = myProfile();
    const body = {
      rating: h.rating, ground: HN.squadEntries('character'), fleet: HN.squadEntries('ship'), level: Player.state.account.level,
      tag: !this.db.firestore || (h.prof.key && h.prof.key === nameKey(p.tag) && (!h.prof.kuid || h.prof.kuid === this.me)) ? p.tag : '', av: p.av, frame: p.frame, badges: p.badges, nb: p.nb, st: p.st, dw: p.st.dw || 0,
      ss: seasonNo() * 1e5 + Math.max(h.soc.sBest || 0, h.rating),
      guild: h.guild || null, apply: (!h.guild && h.apply) || null, gp: h.soc.gp, gpw: h.soc.gpw, gpl: h.soc.gpl, don: h.soc.don && h.soc.don.g ? { g: h.soc.don.g, a: h.soc.don.a | 0 } : null, gr: { w: h.soc.gr.w, b: h.soc.gr.b, d: h.soc.gr.d, f: h.soc.gr.f },
    };
    const key = JSON.stringify(body);
    if (key === this.lastKey) return;
    body.updated = Date.now();
    this.busy = true;
    try { await this.db.doc(`arena/${this.me}`).set(body); this.lastKey = key; } catch (e) { /* retry next time */ }
    this.busy = false;
    if (this.again) { this.again = false; this.publish(); }
  };

  // =====================================================================
  // Guilds
  // =====================================================================
  const G = { guilds: [], chat: [], apps: [], invites: [], subscribed: false };
  const COLORS = ['#5fd8ff', '#ff5a3a', '#ffd23f', '#4ade80', '#b070ff', '#ff8ac0', '#ff9a2a', '#e8eef4'];
  const EMBLEMS = [
    // rebel, empire, mandalorian (mythosaur), jedi, sith, hutt, republic, bounty
    '<path d="M0 -26 C-6 -14 -8 -4 -4 4 C-12 2 -18 -6 -20 -14 C-24 4 -14 20 0 26 C14 20 24 4 20 -14 C18 -6 12 2 4 4 C8 -4 6 -14 0 -26Z"/>',
    '<circle r="22" fill="none" stroke-width="5"/><circle r="8"/>' + Array.from({ length: 6 }, (_, k) => `<rect x="-2.5" y="-24" width="5" height="16" transform="rotate(${k * 60})"/>`).join(''),
    '<path d="M-22 -6 C-22 -20 -10 -26 0 -26 C10 -26 22 -20 22 -6 L14 -10 L8 4 L14 22 L0 14 L-14 22 L-8 4 L-14 -10Z"/>',
    '<path d="M0 -26 L4 -8 L0 26 L-4 -8Z"/><path d="M-20 -4 C-14 8 14 8 20 -4 C14 14 -14 14 -20 -4Z"/>',
    '<path d="M-24 -10 L0 -26 L24 -10 L14 24 L0 14 L-14 24Z" fill="none" stroke-width="5"/><circle r="6"/>',
    '<ellipse rx="22" ry="16"/><circle cx="-8" cy="-4" r="3" fill="#06121e"/><circle cx="8" cy="-4" r="3" fill="#06121e"/>',
    '<circle r="22" fill="none" stroke-width="4"/>' + Array.from({ length: 8 }, (_, k) => `<path d="M0 -20 L4 -6 L-4 -6Z" transform="rotate(${k * 45})"/>`).join(''),
    '<path d="M-24 0 L-8 -6 L0 -24 L8 -6 L24 0 L8 6 L0 24 L-8 6Z"/>',
  ];
  // Pictures come from the HoloNet picture pool (hn-pics.js): the 50 card
  // portraits for profiles, all 100 pictures for guilds. Nothing outside the
  // pool can be picked, so every picture is family-friendly.
  const PICS = HN.PICS.list('profile').map((p) => p.id);
  const GUILD_PICS = HN.PICS.list('guild').map((p) => p.id);
  let embSeq = 0;
  const SHIELD = 'M0 -30 L26 -18 L26 8 C26 20 14 28 0 31 C-14 28 -26 20 -26 8 L-26 -18Z';
  const emblem = (g, size = 40) => {
    if (g.pic && (HN.PICS.has(g.pic) || D.UNIT_MAP[g.pic])) {
      const u = `gpc${++embSeq}`;
      return `<svg class="g-emb" viewBox="-32 -32 64 64" width="${size}" height="${size}" aria-hidden="true"><defs><clipPath id="${u}"><path d="${SHIELD}"/></clipPath></defs><path d="${SHIELD}" fill="#06121e"/><g clip-path="url(#${u})"><svg x="-27" y="-31" width="54" height="63" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">${HN.PICS.inner(g.pic)}</svg></g><path d="${SHIELD}" fill="none" stroke="${g.color}" stroke-width="2.6"/></svg>`;
    }
    return `<svg class="g-emb" viewBox="-32 -32 64 64" width="${size}" height="${size}" aria-hidden="true"><path d="${SHIELD}" fill="#06121e" stroke="${g.color}" stroke-width="2.4"/><g fill="${g.color}" stroke="${g.color}" transform="scale(.8)">${EMBLEMS[(g.emblem | 0) % EMBLEMS.length]}</g></svg>`;
  };
  // The guild picture picker: one category at a time (Characters, Ships,
  // Planets, ... and simple Crests), so it stays quick to draw.
  let pickCat = 'character';
  const pickerHtml = (sel, color, crest) => {
    const cats = HN.PICS.CATS.filter(([k]) => GUILD_PICS.some((id) => HN.PICS.BY_ID[id].cat === k));
    const items = pickCat === 'crest'
      ? EMBLEMS.map((_, i) => `<button type="button" class="g-e ${!sel && (crest | 0) === i ? 'on' : ''}" data-ge="${i}">${emblem({ emblem: i, color }, 44)}</button>`).join('')
      : GUILD_PICS.filter((id) => HN.PICS.BY_ID[id].cat === pickCat).map((id) => `<button type="button" class="g-e ${sel === id ? 'on' : ''}" data-gp="${id}" title="${esc(HN.PICS.BY_ID[id].name)}">${emblem({ pic: id, color }, 44)}<small>${esc(HN.PICS.BY_ID[id].name)}</small></button>`).join('');
    return `<div class="g-cats" data-noswipe>${cats.map(([k, n]) => `<button type="button" class="${k === pickCat ? 'on' : ''}" data-gcat="${k}">${n}</button>`).join('')}<button type="button" class="${pickCat === 'crest' ? 'on' : ''}" data-gcat="crest">Crests</button></div><div class="g-pick g-pics">${items}</div>`;
  };
  const setPickCat = (k) => { pickCat = k; };
  const guildOf = (id) => G.guilds.find((g) => g.id === id) || null;
  const cleanText = (s, n) => String(s || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, n);
  const myGuildId = () => { const id = S().guild; return id && guildOf(id) ? id : null; };
  const membersOf = (gid) => {
    const out = (gmap.get(gid) || {}).kicked || [];
    const rows = Net.arena.filter((a) => a.guild === gid && a.uid !== Net.me && !out.includes(a.uid)).map((a) => a.uid);
    if (S().guild === gid) rows.unshift(Net.me || 'me');
    return rows;
  };
  // 35 members to start, up to 50 with Barracks.
  const MAX_MEMBERS = 35;
  const MAX_ELDERS = 4;
  // Guild upgrades, bought by the leader or co-leader from the Beskar Vault.
  // Each has 3 levels; higher levels need a higher guild level.
  const PERKS = {
    haul: { name: 'Beskar Haul', desc: (v) => `+${v}% Beskar from arena wins`, vals: [0, 5, 10, 15] },
    luck: { name: 'Lucky Pucks', desc: (v) => `+${v}% chance of rarer cards from bounty pucks`, vals: [0, 5, 10, 15] },
    xp: { name: 'Training Grounds', desc: (v) => `+${v}% account XP from HoloNet battles`, vals: [0, 5, 10, 15] },
    gxp: { name: 'War Banners', desc: (v) => `+${v}% guild points`, vals: [0, 5, 10, 15] },
    barracks: { name: 'Barracks', desc: (v) => `+${v} member slots`, vals: [0, 5, 10, 15] },
  };
  const PERK_COST = [2000, 5000, 10000];
  const PERK_NEEDS = [2, 4, 6]; // guild level needed for upgrade levels 1, 2, 3
  // Ranks: leader (the founder), one co-leader, up to four elders.
  // The leader is g.lead; guilds made before hand-overs existed fall back to the founder.
  const leaderOf = (gid) => { const g = gmap.get(gid) || {}; return g.lead || gid; };
  const roleOf = (uid, gid) => { const g = gmap.get(gid) || {}; const id = uid === 'me' ? Net.me : uid; return id === leaderOf(gid) ? 'leader' : g.co === id ? 'co' : (g.elders || []).includes(id) ? 'elder' : 'member'; };
  const ROLE_NAME = { leader: 'Leader', co: 'Co-leader', elder: 'Elder', member: 'Member' };
  const canManage = (gid) => ['leader', 'co'].includes(roleOf(Net.me, gid));
  const canReview = (gid) => canManage(gid) || (roleOf(Net.me, gid) === 'elder' && ((gmap.get(gid) || {}).appPerm || {}).elder === true);
  // How a guild takes new members: open to all, by request, or by invite only.
  const MODES = { open: 'Open to all', request: 'Request to join', invite: 'Invite only' };
  const modeOf = (g) => (g && MODES[g.mode] ? g.mode : 'open');
  const approved = (g) => !!g && (g.ok || []).includes(Net.me);
  const PIC_COST = 1500;
  const perkLevel = (gid, k) => { const g = gid && gmap.get(gid); return Math.max(0, Math.min(3, ((g && g.perks) || {})[k] | 0)); };
  const perkVal = (k) => { const gid = myGuildId(); return gid ? PERKS[k].vals[perkLevel(gid, k)] : 0; };
  HN.guildPerk = (k) => perkVal(k) / 100;
  const maxMembers = (gid) => MAX_MEMBERS + PERKS.barracks.vals[perkLevel(gid, 'barracks')];
  // What each player has given this guild: their own doc, plus what the leader has recorded.
  const donOf = (uid, gid) => {
    if (uid === Net.me || uid === 'me') { const d = P2().soc.don; return d && d.g === gid ? d.a | 0 : 0; }
    const a = Net.arena.find((x) => x.uid === uid);
    return a && a.don && a.don.g === gid ? a.don.a | 0 : 0;
  };
  const donors = (gid) => {
    const g = gmap.get(gid) || {};
    const out = { ...(g.dons || {}) };
    for (const uid of membersOf(gid)) { const id = uid === 'me' ? Net.me : uid; out[id] = Math.max(out[id] | 0, donOf(uid, gid)); }
    return out;
  };
  const bankOf = (gid) => { const g = gmap.get(gid) || {}; return Math.max(0, Object.values(donors(gid)).reduce((a, n) => a + (n | 0), 0) - (g.spent | 0)); };
  // Guild levels 1-10 (guild XP = everyone's guild points, all time).
  const GLVL = [0, 500, 1500, 3000, 5000, 8000, 12000, 17000, 23000, 30000];
  const guildXp = (gid) => membersOf(gid).reduce((a, uid) => a + (prof(uid).gpl || 0), 0);
  const guildLevel = (gid) => { const xp = guildXp(gid); let lv = 1; GLVL.forEach((t, i) => { if (xp >= t) lv = i + 1; }); return { lv, xp, next: GLVL[lv] || null }; };
  const weekPoints = (uid) => { if (uid === Net.me || uid === 'me') return P2().soc.gp; const a = Net.arena.find((x) => x.uid === uid); return a && a.gpw === week() ? a.gp || 0 : 0; };
  const guildWeekPoints = (gid) => membersOf(gid).reduce((a, uid) => a + weekPoints(uid), 0);
  const MILESTONES = [
    { pts: 250, beskar: 300, label: '300 Beskar' },
    { pts: 750, beskar: 600, puck: 'elite', label: '600 Beskar + Elite puck' },
    { pts: 1500, beskar: 1200, puck: 'high', label: '1,200 Beskar + High-value puck' },
  ];

  // Guild data, loaded only as needed: the top 25 guilds (browse list and
  // guild leaderboard), plus live feeds of your own guild's doc, members and chat.
  const gmap = new Map();
  const safeGuild = (g) => ({ ...g, name: SAFE.ok(g.name) ? g.name : 'Guild', tag: SAFE.ok(g.tag) ? g.tag : 'GLD', motto: g.motto ? SAFE.clean(g.motto).text : '' });
  const setGuilds = () => { G.guilds = [...gmap.values()].filter((g) => g && g.name).map(safeGuild); };
  async function loadGuilds(maxAge = 60000) {
    if (!Net.ready) return;
    const now = Date.now();
    if (G.at && now - G.at < maxAge) return;
    G.at = now;
    try {
      const snap = await Net.db.collection('guilds').orderBy('xp', 'desc').limit(25).get();
      for (const d of snap.docs) gmap.set(d.id, { id: d.id, ...d.data() });
      setGuilds(); rerenderLive();
    } catch (e) { G.at = 0; }
  }
  // Your guild's doc and chat are watched live from the moment the HoloNet
  // connects (so the unread markers work on the main menu); the member list
  // and applications only while the guild screens are open. With no guild but
  // an open application, the applied-to guild's doc is watched instead, so
  // you join the moment a leader accepts.
  const DAY = 86400000;
  function watchMyGuild() {
    if (!Net.ready) return;
    const gid = S().guild || null;
    const appGid = !gid && S().apply ? S().apply : null;
    const key = gid || (appGid ? `apply:${appGid}` : '');
    if (G.watching === key) return;
    G.watching = key;
    ['gdoc', 'members', 'chat', 'apps'].forEach((k) => Net.stop(k));
    G.chat = []; G.apps = [];
    marks();
    if (!key) return rerenderLive();
    const docId = gid || appGid;
    const off = Net.db.doc(`guilds/${docId}`).onSnapshot((d) => {
      const data = d && (typeof d.data === 'function' ? d.data() : d);
      if (data && data.name) gmap.set(docId, { id: docId, ...data }); else gmap.delete(docId);
      if (gid) onMyGuild(gid, data && data.name ? data : null); else onApplied(appGid, data && data.name ? data : null);
      setGuilds(); rerenderLive(); marks();
    }, () => {});
    Net.subs.gdoc = { q: key, off };
    if (!gid) return;
    Net.live('chat', { sig: gid, ref: Net.db.collection('gchat').where('g', '==', gid) }, null, (docs) => {
      G.chat = docs.map((d) => ({ uid: d.id, ...(d.data() || {}) }));
      if (App.current === 'holonet' && gtabNow() === 'chat' && document.visibilityState !== 'hidden') markSeen('chat', true);
      noticeAnn(gid);
      rerenderLive(); marks();
    });
    if (App.current === 'holonet') watchMembers();
  }
  function watchMembers() {
    const gid = myGuildId();
    if (!gid || !Net.ready) return;
    Net.live('members', { sig: gid, ref: Net.db.collection('arena').where('guild', '==', gid) }, Net.rows, (docs) => {
      // Accepted or invited players drop off the guest list once they've joined,
      // so leaving later doesn't leave a standing invite behind.
      const g = gmap.get(gid) || {};
      const inGuild = new Set(docs.map((d) => d.id));
      if (canManage(gid) && (g.ok || []).some((x) => inGuild.has(x))) writeGuild(gid, { ok: (g.ok || []).filter((x) => !inGuild.has(x)) });
    });
    if (canReview(gid)) {
      Net.live('apps', { sig: gid, ref: Net.db.collection('arena').where('apply', '==', gid) }, Net.rows, (docs) => {
        const g = gmap.get(gid) || {};
        G.apps = docs.map((d) => d.id).filter((uid) => !(g.no || []).includes(uid) && !(g.ok || []).includes(uid) && !(g.kicked || []).includes(uid));
        rerenderLive(); marks();
      });
    } else Net.stop('apps');
  }
  let leaving = null;
  function onMyGuild(gid, data) {
    if (S().guild !== gid) return;
    if (!data) {
      S().guild = null; HN.save(); Net.publish();
      toast('Your guild was disbanded.');
      setTimeout(() => { watchMyGuild(); rerender(); }, 0);
      return;
    }
    // Removed: wait a few seconds before leaving, so a leader's Undo can still save you.
    if ((data.kicked || []).includes(Net.me)) {
      if (!leaving) leaving = setTimeout(() => {
        leaving = null;
        const g = gmap.get(gid) || {};
        if (S().guild !== gid || !(g.kicked || []).includes(Net.me)) return;
        S().guild = null; HN.save(); Net.publish();
        toast(`You were removed from ${g.name || 'your guild'}.`);
        watchMyGuild(); rerender();
      }, 12000);
      return;
    }
    if (leaving) { clearTimeout(leaving); leaving = null; }
    if (App.current === 'holonet') watchMembers();
    const role = roleOf(Net.me, gid);
    const now = Date.now();
    const seen = data.leadSeen || data.created || 0;
    // The leader checks in at most twice a day, so the guild knows they're active.
    if (role === 'leader' && now - seen > DAY / 2) writeGuild(gid, { leadSeen: now });
    // Leader away for 7 days: the co-leader takes over. No co-leader after 14 days: the senior elder does.
    const away = now - seen;
    if (role === 'co' && away > 7 * DAY + 3600000) {
      writeGuild(gid, { lead: Net.me, co: '', leadSeen: now }).then((ok) => { if (ok) { toast(`The leader was away for over a week. You're now the leader of ${data.name}.`); sayLine('took over as guild leader.', true); } });
    } else if (role === 'elder' && !data.co && (data.elders || [])[0] === Net.me && away > 14 * DAY + 3600000) {
      writeGuild(gid, { lead: Net.me, elders: (data.elders || []).slice(1), leadSeen: now }).then((ok) => { if (ok) { toast(`The guild had no active leader for two weeks. You're now the leader of ${data.name}.`); sayLine('took over as guild leader.', true); } });
    }
  }
  function onApplied(gid, data) {
    if (S().guild || S().apply !== gid) return;
    if (!data) { S().apply = null; HN.save(); Net.publish(); toast('The guild you applied to no longer exists.'); setTimeout(watchMyGuild, 0); return; }
    if ((data.ok || []).includes(Net.me)) { toast(`${data.name} accepted your request!`); setTimeout(() => joinGuild(gid, true), 0); return; }
    if ((data.no || []).includes(Net.me)) { S().apply = null; HN.save(); Net.publish(); toast(`${data.name} declined your request.`); setTimeout(() => { watchMyGuild(); rerender(); }, 0); }
  }
  // Write the guild doc (the database rules decide who may change what).
  async function writeGuild(gid, change) {
    const raw = gmap.get(gid);
    if (!raw || !Net.ready) return false;
    const next = { ...raw, ...change };
    delete next.id;
    try { await Net.db.doc(`guilds/${gid}`).set(next); } catch (e) { return false; }
    gmap.set(gid, { id: gid, ...next }); setGuilds();
    return true;
  }
  // Guild invites addressed to you (checked when you have no guild).
  async function loadInvites() {
    if (!Net.ready || S().guild) { G.invites = []; return marks(); }
    try {
      const snap = await Net.db.collection('guilds').where('ok', 'array-contains', Net.me).limit(10).get();
      G.invites = snap.docs.filter((d) => d.data() && d.data().name).map((d) => { gmap.set(d.id, { id: d.id, ...d.data() }); return d.id; });
      setGuilds(); rerenderLive();
    } catch (e) { /* keep what we had */ }
    marks();
  }
  // The founder keeps the guild's leaderboard numbers on the guild doc.
  let statKey = '';
  function pushGuildStats() {
    const gid = myGuildId();
    if (!gid || !canManage(gid)) return;
    const g = guildOf(gid);
    const lv = guildLevel(gid);
    const dons = donors(gid);
    const stats = { xp: lv.xp, n: membersOf(gid).length, wp: guildWeekPoints(gid), wk: week(), dons, don: Object.values(dons).reduce((a, n) => a + (n | 0), 0) };
    const key = JSON.stringify(stats);
    const raw = gmap.get(gid) || g;
    if (key === statKey || (raw.xp === stats.xp && raw.n === stats.n && raw.wp === stats.wp && raw.wk === stats.wk && JSON.stringify(raw.dons || {}) === JSON.stringify(dons))) return;
    statKey = key;
    const body = { ...raw, ...stats };
    delete body.id;
    Net.db.doc(`guilds/${gid}`).set(body).catch(() => { statKey = ''; });
  }
  function subscribe() {
    if (G.subscribed || !Net.ready) return;
    G.subscribed = true;
    watchMyGuild();
    loadInvites();
    Net.on(() => { watchMyGuild(); pushGuildStats(); rerenderLive(); });
    Net.publish();
    // The screen that opened us still needs its data.
    if (App.current === 'holonet') loadFor((App.params || {}).view || 'hub');
  }
  // Each screen loads only what it shows (each read refreshes at most once a minute).
  function loadFor(v) {
    if (!Net.ready) return;
    if (['hub', 'raid', 'leaders'].includes(v)) Net.want('raid');
    if (['arena', 'leaders', 'raid'].includes(v)) Net.want('arena');
    if (v === 'leaders') Net.want('duels');
    if (['hub', 'leaders'].includes(v)) loadGuilds();
    // Browsing guilds to join wants a fresher list.
    if (['guild', 'guilds'].includes(v)) { loadGuilds(15000); if (!S().guild) loadInvites(); }
    if (['hub', 'guild', 'gchat', 'graid'].includes(v)) watchMembers();
  }
  Net.on(() => { if (Net.ready) subscribe(); });

  async function createGuild(form) {
    if (!Net.ready) return toast('Guilds need an internet connection.');
    const g = { name: cleanText(form.name, 22), tag: cleanText(form.tag, 4).toUpperCase().replace(/[^A-Z0-9]/g, ''), motto: cleanText(form.motto, 70), emblem: form.emblem | 0, pic: GUILD_PICS.includes(form.pic) ? form.pic : '', color: COLORS.includes(form.color) ? form.color : COLORS[0], min: Math.max(0, Math.min(2500, form.min | 0)), mode: MODES[form.mode] ? form.mode : 'open', created: Date.now(), lead: Net.me, leadSeen: Date.now(), ok: [], no: [], xp: 0, n: 1, wp: 0, wk: week() };
    if (S().guild) return toast('Leave your current guild first.');
    if (g.name.length < 3) return toast('Give your guild a name (3+ letters).');
    if (!SAFE.ok(g.name) || !SAFE.ok(g.tag) || !SAFE.ok(g.motto)) return toast('Keep it friendly: pick a different name, tag or motto.');
    if (g.tag.length < 2) return toast('Pick a 2–4 letter tag.');
    if (S().beskar < 500) return toast(`Founding a guild costs 500 Beskar. You have ${fmt(S().beskar)}.`);
    try { await Net.db.doc(`guilds/${Net.me}`).set(g); } catch (e) { return toast('Could not create the guild. Try again.'); }
    S().beskar -= 500;
    S().guild = Net.me; S().apply = null;
    gmap.set(Net.me, { id: Net.me, ...g }); setGuilds();
    HN.save(); Net.publish(); watchMyGuild();
    sound('rankup');
    toast(`[${g.tag}] ${g.name} is founded!`);
    gtab = 'home';
    HN.ui.go('guild');
  }
  const sizeOf = (gid) => Math.max(membersOf(gid).length, (gmap.get(gid) || {}).n || 0);
  function joinGuild(gid, auto) {
    const g = gmap.get(gid) ? safeGuild(gmap.get(gid)) : null;
    if (!g) return;
    if (S().guild) return toast('Leave your current guild first.');
    const ok = approved(g);
    if (sizeOf(gid) >= maxMembers(gid)) return toast('That guild is full.');
    if ((g.kicked || []).includes(Net.me) && !ok) return toast('You were removed from that guild. Ask its leader for an invite.');
    if (!ok && S().rating < (g.min || 0)) return toast(`${g.name} needs ${fmt(g.min)} rating to join.`);
    if (!ok && modeOf(g) === 'request') return applyGuild(gid);
    if (!ok && modeOf(g) === 'invite') return toast(`${g.name} is invite only.`);
    S().guild = gid; S().apply = null;
    G.invites = (G.invites || []).filter((x) => x !== gid);
    HN.save(); Net.publish(); watchMyGuild();
    sound('reveal_rare');
    sayLine(auto ? 'joined the guild (request accepted).' : 'joined the guild.', true);
    gtab = 'home';
    HN.ui.go('guild');
  }
  // Ask to join a request-only guild. Your profile shows on its Members tab
  // for the leader and co-leader (and elders, if allowed) to accept or decline.
  function applyGuild(gid) {
    const g = gmap.get(gid);
    if (!g || S().guild) return;
    S().apply = gid;
    HN.save(); Net.publish(); watchMyGuild();
    sound('click');
    toast(`Request sent to ${safeGuild(g).name}. You'll join automatically when it's accepted.`);
    rerender();
  }
  function cancelApply() {
    S().apply = null;
    HN.save(); Net.publish(); watchMyGuild();
    toast('Request cancelled.');
    rerender();
  }
  // Leaders, co-leaders (and elders if allowed) accept, decline and invite.
  const trim = (list, n) => list.slice(Math.max(0, list.length - n));
  async function answerApp(uid, yes) {
    const gid = myGuildId();
    if (!gid || !canReview(gid)) return;
    if (yes && sizeOf(gid) >= maxMembers(gid)) return toast('Your guild is full. Build Barracks for more room.');
    const g = gmap.get(gid) || {};
    const members = membersOf(gid);
    const ok = (g.ok || []).filter((x) => x !== uid && !members.includes(x));
    const no = (g.no || []).filter((x) => x !== uid);
    const change = yes ? { ok: trim([...ok, uid], 60), no } : { ok, no: trim([...no, uid], 40) };
    if (await writeGuild(gid, change)) {
      G.apps = G.apps.filter((x) => x !== uid);
      toast(yes ? `${Net.name(uid)} is accepted and joins when they're next online.` : `Request from ${Net.name(uid)} declined.`);
      if (yes) sayLine(`accepted ${Net.name(uid)} into the guild.`, true);
      rerender(); marks();
    } else toast('Could not save. Try again.');
  }
  async function inviteTo(uid) {
    const gid = myGuildId();
    if (!gid || !canReview(gid)) return;
    const g = gmap.get(gid) || {};
    if ((g.ok || []).includes(uid)) return toast(`${Net.name(uid)} is already invited.`);
    const members = membersOf(gid);
    if (await writeGuild(gid, { ok: trim([...(g.ok || []).filter((x) => !members.includes(x)), uid], 60), no: (g.no || []).filter((x) => x !== uid), kicked: (g.kicked || []).filter((x) => x !== uid) })) toast(`${Net.name(uid)} is invited to ${safeGuild(g).name}.`);
    else toast('Could not send the invite. Try again.');
  }
  async function leaveGuild() {
    const gid = S().guild;
    const g = guildOf(gid);
    const leader = roleOf(Net.me, gid) === 'leader';
    const alone = membersOf(gid).length <= 1;
    if (leader && !alone) {
      const ok = await UI.confirmBox('You lead this guild', `Hand leadership to someone first (Members, then Manage, then Make leader), or disband the guild. Disbanding removes every member of ${g ? g.name : 'your guild'}.`, 'Disband guild');
      if (!ok) return;
      if (!(await UI.confirmBox('Disband for good?', 'This can\'t be undone. Every member is removed and the guild is deleted.', 'Disband'))) return;
    } else {
      const ok = await UI.confirmBox(leader ? 'Disband the guild?' : 'Leave the guild?', leader ? 'You\'re the only member, so the guild is deleted.' : 'You can join another guild any time.', leader ? 'Disband' : 'Leave');
      if (!ok) return;
    }
    if (!leader) sayLine('left the guild.', true);
    S().guild = null;
    HN.save(); Net.publish(); watchMyGuild();
    if (leader && Net.ready) { gmap.delete(gid); setGuilds(); try { await Net.db.doc(`guilds/${gid}`).delete(); } catch (e) { /* ignore */ } }
    HN.ui.go('guild');
  }

  // ---------- unread markers ----------
  // A cyan dot for new guild chat, a gold megaphone for a new guild-wide
  // announcement, a red count of join requests for those who review them.
  // They're body classes, so updating them never redraws a screen.
  let gtab = 'home';
  const gtabNow = () => { const v = (App.params || {}).view; return v === 'gchat' ? 'chat' : v === 'graid' ? 'raid' : gtab; };
  const lastFrom = (gid, ann) => G.chat.filter((c) => c.uid !== Net.me && !isMuted(c.uid)).reduce((m, c) => Math.max(m, ...(c.msgs || []).filter((x) => x && x.g === gid && !x.s && (ann ? x.a && canAnnounce(c.uid, gid) : !x.a)).map((x) => x.ts || 0), 0), 0);
  function unread() {
    const gid = myGuildId();
    const seen = (P2().soc && P2().soc.seen) || {};
    if (!gid) return { chat: false, ann: false, apps: 0, inv: (G.invites || []).length };
    return { chat: lastFrom(gid, false) > (seen.chat || 0), ann: lastFrom(gid, true) > (seen.ann || 0), apps: canReview(gid) ? (G.apps || []).length : 0, inv: 0 };
  }
  // A new guild-wide announcement pops up once, wherever you are in the game.
  function noticeAnn(gid) {
    const last = lastFrom(gid, true);
    // The first load of the chat only sets the baseline: old announcements don't pop up.
    if (G.annFor !== gid) { G.annFor = gid; G.annAt = last; return; }
    if (!last || last <= (G.annAt || 0)) return;
    G.annAt = last;
    if (last <= ((P2().soc.seen || {}).ann || 0)) return;
    const l = announcements(gid)[0];
    if (l && !(App.current === 'holonet' && gtabNow() === 'home')) annToast(l);
  }
  function annToast(l) {
    const old = document.querySelector('.hv-annpop'); if (old) old.remove();
    const n = document.createElement('button');
    n.type = 'button';
    n.className = 'hv-annpop';
    n.innerHTML = `<span class="ic">${MEGA}</span><span><small>GUILD ANNOUNCEMENT · ${esc(Net.name(l.uid))}</small><b>${esc(l.t)}</b></span>`;
    document.body.appendChild(n);
    sound('click');
    const t = setTimeout(() => n.remove(), 7000);
    n.addEventListener('click', () => { clearTimeout(t); n.remove(); if (App.battleActive) return; gtab = 'home'; HN.ui.go('guild'); });
  }
  function markSeen(k, quiet) {
    const h = P2();
    h.soc.seen = { ...(h.soc.seen || {}), [k]: Date.now() };
    HN.save();
    if (!quiet) marks();
  }
  function marks() {
    const u = unread();
    const b = document.body.classList;
    b.toggle('hn-u-chat', u.chat); b.toggle('hn-u-ann', u.ann); b.toggle('hn-u-apps', u.apps > 0); b.toggle('hn-u-inv', u.inv > 0);
    document.querySelectorAll('.mk-n').forEach((e) => { e.textContent = u.apps > 9 ? '9+' : String(u.apps || ''); });
    const nav = document.querySelector('.main-nav [data-nav="holonet"]');
    if (nav && !nav.querySelector('.hn-mks')) nav.insertAdjacentHTML('beforeend', MKS);
  }
  const MEGA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10v4h3l6 4V6L6 10H3z" fill="#1a1204"/><path d="M15 8.5a4.5 4.5 0 0 1 0 7M17.5 6a8 8 0 0 1 0 12" stroke="#1a1204" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
  const MKS = `<span class="hn-mks" aria-hidden="true"><i class="mk-ann">${MEGA}</i><i class="mk-chat"></i><i class="mk-apps mk-n"></i><i class="mk-inv"></i></span>`;

  // ---------- guild chat ----------
  let lastSay = 0;
  // Announcements: the leader can always post; the leader and co-leader
  // choose whether co-leaders and elders can too (guild doc annPerm).
  const canAnnounce = (uid, gid) => {
    const r = roleOf(uid, gid);
    const perm = (gmap.get(gid) || {}).annPerm || {};
    return r === 'leader' || (r === 'co' && perm.co !== false) || (r === 'elder' && perm.elder === true);
  };
  async function sayLine(text, system, ann) {
    const gid = S().guild;
    if (!gid || !Net.ready) return;
    const raw = cleanText(text, 140);
    if (!raw) return;
    const f = SAFE.clean(raw);
    if (f.blocked && !system) return toast('That message breaks the HoloNet rules and wasn\'t sent.');
    const t = f.text;
    if (!system && Date.now() - lastSay < 1500) return toast('Easy there: one message every couple of seconds.');
    lastSay = Date.now();
    const mine = G.chat.find((c) => c.uid === Net.me);
    const msgs = ((mine && mine.msgs) || []).slice(-29);
    if (ann && !canAnnounce(Net.me, gid)) return toast('Your rank can\'t post announcements right now.');
    msgs.push({ g: gid, t, ts: Date.now(), s: system ? 1 : 0, a: ann ? 1 : 0 });
    try { await Net.db.doc(`gchat/${Net.me}`).set({ g: gid, msgs }); } catch (e) { toast('Message not sent.'); }
  }
  // Everyone's lines for this guild, filtered again on screen (older or
  // tampered messages included), minus anyone you've muted.
  const chatLines = (gid) => G.chat.filter((c) => !isMuted(c.uid)).flatMap((c) => (c.msgs || []).filter((m) => m && m.g === gid && typeof m.t === 'string').map((m) => {
    const f = SAFE.clean(m.t);
    // An announcement only counts if the sender's rank may post them right now.
    return { ...m, uid: c.uid, t: f.blocked ? 'Message hidden' : f.text, hid: f.blocked, a: m.a && !f.blocked && canAnnounce(c.uid, gid) ? 1 : 0 };
  })).sort((a, b) => a.ts - b.ts).slice(-60);
  const announcements = (gid) => chatLines(gid).filter((l) => l.a).slice(-3).reverse();
  const ago = (ts) => { const s = Math.max(0, (Date.now() - ts) / 1000); return s < 60 ? 'now' : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`; };

  // ---------- guild raid ----------
  function graidTotals(gid) {
    const g = graidNow();
    const out = { ground: { dealt: 0, rows: [] }, fleet: { dealt: 0, rows: [] } };
    for (const uid of membersOf(gid)) {
      let gr;
      if (uid === Net.me || uid === 'me') gr = P2().soc.gr;
      else { const a = Net.arena.find((x) => x.uid === uid); gr = a && a.gr; }
      if (!gr || gr.w !== week() || gr.b !== g.id) continue;
      if (gr.d) { out.ground.dealt += gr.d; out.ground.rows.push({ uid, dmg: gr.d }); }
      if (gr.f) { out.fleet.dealt += gr.f; out.fleet.rows.push({ uid, dmg: gr.f }); }
    }
    for (const f of ['ground', 'fleet']) {
      const pool = g[f].pool;
      out[f].pool = pool; out[f].left = Math.max(0, pool - out[f].dealt); out[f].down = out[f].dealt >= pool;
      out[f].rows.sort((a, b) => b.dmg - a.dmg);
    }
    out.fallen = out.ground.down && out.fleet.down;
    return out;
  }
  function allyFor(front, gid) {
    const key = front === 'fleet' ? 'fleet' : 'ground';
    const mates = membersOf(gid).filter((u) => u !== Net.me && u !== 'me').map((uid) => ({ uid, a: Net.arena.find((x) => x.uid === uid) })).filter((x) => x.a && Array.isArray(x.a[key]) && x.a[key].length && x.a[key].every((e) => D.UNIT_MAP[e.id]));
    if (!mates.length) return null;
    const pick = mates[(P2().soc.gr.runs || 0) % mates.length];
    return { uid: pick.uid, name: Net.name(pick.uid), squad: pick.a[key] };
  }
  function startGuildRaid(front) {
    const gid = myGuildId();
    if (!gid) return;
    const g = graidNow();
    const F = g[front];
    const t = graidTotals(gid)[front];
    if (t.down) return toast('That front is already cleared. Hit the other one!');
    const kind = front === 'fleet' ? 'ship' : 'character';
    const mine = HN.squadEntries(kind);
    if (!mine.length) return toast(front === 'fleet' ? 'You need ships for the fleet front.' : 'Pick a squad first.');
    const ally = allyFor(front, gid);
    const used = new Set(mine.map((e) => e.id));
    const allyEntries = ally ? ally.squad.filter((e) => !used.has(e.id)).map((e) => ({ ...e })) : [];
    const lvl = Math.max(1, Math.round(HN.avgLevel(mine)));
    const enemies = F.slots.map((id) => ({ id, level: id === F.boss ? lvl + 4 : lvl, stars: id === F.boss ? 7 : 3 }));
    HN.B.back = { view: 'graid' };
    HN.hnStart({ type: 'hn', hn: 'graid', front, boss: F.boss }, [...mine, ...allyEntries], enemies, {
      name: `Guild Raid · ${D.UNIT_MAP[F.boss].name}`, kind, planet: front === 'fleet' ? 'coruscant' : g.planet, raid: true, boss: F.boss,
      intro: `${ally && allyEntries.length ? `${ally.name} (guildmate) fights beside you. ` : ''}Every hit counts toward your guild's shared health bar.`,
      setup(b) {
        b.hnRaid = { boss: F.boss, turn: 0, limit: 100, guild: true };
        const boss = b.units.find((u) => u.id === F.boss);
        boss.maxHp = F.pool; boss.hp = Math.max(1, t.left);
        HN.raidToughen(b, F.boss);
        if (boss.hp <= boss.maxHp / 2) { boss.enraged = true; boss.statuses.offUp = 99; }
        b.hnStartHp = boss.hp;
        b.side('enemy').forEach((u, i) => { if (!F.start.includes(i)) { u.alive = false; u.hp = 0; u.hnWait = true; } });
      },
    });
  }
  function bankGuildRaid(front, dealt) {
    const h = P2();
    h.soc.gr.b = graidNow().id;
    if (front === 'fleet') h.soc.gr.f += dealt; else h.soc.gr.d += dealt;
    h.soc.gr.runs = (h.soc.gr.runs || 0) + 1;
    const pts = Math.max(5, Math.round(dealt / 2000));
    addGP(pts);
    const bes = Math.min(300, Math.round(dealt / 700));
    h.beskar += bes;
    HN.xp(40);
    HN.save(); Net.publish();
    return { pts, bes };
  }
  // Guild raid finish and retreat.
  const BUI = root.BattleUI;
  const baseFinish = BUI.finish;
  BUI.finish = async function (winner) {
    const p = this.params || {};
    if (p.type !== 'hn' || p.hn !== 'graid') return baseFinish.call(this, winner);
    this.ended = true;
    this.setActive(null);
    await new Promise((r) => setTimeout(r, 900));
    const won = winner === 'player';
    if (root.Sound) { root.Sound.play(won ? 'victory' : 'defeat'); root.Sound.music('menu'); }
    const b = this.battle;
    this.teardown();
    const boss = b.units.find((u) => u.def.raid);
    const dealt = Math.max(0, (b.hnStartHp || 0) - (boss ? boss.hp : 0));
    const res = bankGuildRaid(p.front, dealt);
    const t = graidTotals(myGuildId());
    const m = openModal(`<div class="hn-result"><div class="result-title ${won ? 'win' : 'lose'}">${won ? 'FRONT CLEARED' : 'GUILD RAID'}</div>
      <div class="big-num" style="color:#ffb05a">${fmt(dealt)} damage</div>
      <div class="rows"><div><span>Beskar</span><b>${HN.ui.bes(res.bes)}</b></div><div><span>Guild points</span><b>+${res.pts}</b></div>
      <div><span>Ground front</span><b>${t.ground.down ? 'Cleared' : `${fmt(t.ground.left)} left`}</b></div><div><span>Fleet front</span><b>${t.fleet.down ? 'Cleared' : `${fmt(t.fleet.left)} left`}</b></div></div>
      <div class="modal-actions"><button type="button" class="btn btn-primary" data-r="ok">Back to the guild raid</button></div></div>`, { small: true, dismissable: false, cls: 'result-modal' });
    m.root.addEventListener('click', (e) => { if (e.target.closest('[data-r]')) { m.close(); HN.ui.go('graid'); } });
  };
  const baseComplete = Player.completeEncounter;
  Player.completeEncounter = function (params, won, r) {
    if (params && params.type === 'hn' && params.hn === 'graid') {
      HN.B.retreated = true;
      if (BUI.battle) { const boss = BUI.battle.units.find((u) => u.def.raid); const dealt = Math.max(0, (BUI.battle.hnStartHp || 0) - (boss ? boss.hp : 0)); if (dealt) bankGuildRaid(params.front, dealt); }
      return { lost: true };
    }
    return baseComplete.call(this, params, won, r);
  };

  // ---------- guild rewards ----------
  async function claimGuild(kind, i) {
    const h = P2();
    const gid = myGuildId();
    if (!gid) return;
    if (kind === 'ms') {
      const ms = MILESTONES[i];
      if (!ms || h.soc.guildClaims[`ms${i}`] || guildWeekPoints(gid) < ms.pts) return;
      h.soc.guildClaims[`ms${i}`] = true;
      h.beskar += ms.beskar;
      if (ms.puck) h.freePucks = (h.freePucks || []).concat(ms.puck);
      HN.save();
      sound('coins');
      toast(`Guild reward: ${ms.label}${ms.puck ? ' (open it at Varka\'s Forge)' : ''}`);
    }
    if (kind === 'raid') {
      const t = graidTotals(gid);
      if (!t.fallen || h.soc.gr.claimed || !(h.soc.gr.d + h.soc.gr.f)) return;
      h.soc.gr.claimed = true;
      h.beskar += 800;
      h.freePucks = (h.freePucks || []).concat('high');
      addGP(50);
      // The rarest card in the HoloNet: 1 in 2,000 per beaten guild raid, and no other way to get him.
      const drop = Math.random() < 0.01 ? HN.grant('hn_dark_trooper') : null;
      HN.save(); Net.publish();
      sound('reveal_legendary');
      toast(`${graidNow().name} is beaten! 800 Beskar, a High-value puck and 50 guild points.`);
      if (drop && drop.isNew) await UI.walkout(D.UNIT_MAP.hn_dark_trooper, 'legendary', false, { exclusive: true, isNew: true, shards: 0 });
      else if (drop) toast(`Raid drop: Dark Trooper +${drop.shards} shards`);
    }
    if (kind === 'lvl') {
      const lv = guildLevel(gid).lv;
      if (lv >= 2 && !(h.soc.frames || []).includes('guild')) { h.soc.frames = [...(h.soc.frames || []), 'guild']; toast('Guild Banner frame unlocked!'); }
      if (lv >= 3 && !h.soc.gotTrooper) { h.soc.gotTrooper = true; h.beskar += 2000; h.freePucks = (h.freePucks || []).concat('legend'); sound('reveal_legendary'); toast('Guild level 3: 2,000 Beskar and a Legendary bounty puck!'); }
      HN.save();
    }
    rerender();
  }

  // =====================================================================
  // Points from everything you already do
  // =====================================================================
  const baseArena = HN.arenaResult;
  HN.arenaResult = function (opp, won) {
    const r = baseArena(opp, won);
    if (won) addGP(10);
    trackSeasonBest();
    HN.save(); Net.publish();
    return r;
  };
  const baseBank = HN.bankRaid;
  HN.bankRaid = function (n) { const r = baseBank(n); addGP(5); HN.save(); Net.publish(); return r; };

  // =====================================================================
  // Seasons: four weeks each. Your best division pays out, then ratings
  // settle halfway back toward the start.
  // =====================================================================
  const SEASON_REWARD = {
    bronze: { beskar: 300 },
    silver: { beskar: 800, puck: 'guild', card: 'hn_nite_owl' },
    gold: { beskar: 1500, puck: 'elite', card: 'hn_nite_owl' },
    kyber: { beskar: 2500, puck: 'high', card: 'hn_nite_owl', frame: 'victor' },
    legend: { beskar: 4000, puck: 'legend', card: 'hn_kelleran', frame: 'victor' },
  };
  function trackSeasonBest() { const h = P2(); h.soc.sBest = Math.max(h.soc.sBest || 0, h.rating); }
  function seasonEnds() { const next = (seasonNo() + 1) * SEASON_WEEKS; return (next * 7 * 24 * 3600 * 1000) - ((S().weekShift || 0) * 7 * 24 * 3600 * 1000) - Date.now(); }
  function checkSeason() {
    const h = P2();
    if (h.soc.season === seasonNo() || h.soc.pendingSeason) return;
    const best = HN.divOf(Math.max(h.soc.sBest || 0, h.rating));
    h.soc.pendingSeason = { no: h.soc.season, league: best.league, div: best.div, name: best.name };
    h.soc.season = seasonNo();
    h.soc.seasonsDone = (h.soc.seasonsDone || 0) + 1;
    if (h.rating > 800) h.rating = Math.round(800 + (h.rating - 800) * 0.5);
    h.streak = 0;
    h.soc.sBest = h.rating;
    HN.save(); Net.publish();
  }
  async function claimSeason() {
    const h = P2();
    const ps = h.soc.pendingSeason;
    if (!ps) return;
    h.soc.pendingSeason = null;
    const rw = SEASON_REWARD[ps.league] || SEASON_REWARD.bronze;
    h.beskar += rw.beskar;
    if (rw.puck) h.freePucks = (h.freePucks || []).concat(rw.puck);
    if (rw.frame && !(h.soc.frames || []).includes(rw.frame)) h.soc.frames = [...(h.soc.frames || []), rw.frame];
    const card = rw.card ? HN.grant(rw.card) : null;
    HN.save(); Net.publish();
    sound('reveal_legendary');
    if (card && card.isNew) await UI.walkout(D.UNIT_MAP[rw.card], D.UNIT_MAP[rw.card].rarity, false, { exclusive: true, isNew: true, shards: 0 });
    else if (card) toast(`${D.UNIT_MAP[rw.card].name} +${card.shards} shards`);
    rerender();
  }
  function seasonModal() {
    const ps = P2().soc.pendingSeason;
    if (!ps || document.querySelector('.modal-backdrop')) return;
    const rw = SEASON_REWARD[ps.league] || SEASON_REWARD.bronze;
    const m = openModal(`<div class="hn-result"><div class="result-title win">SEASON ${ps.no % 100} COMPLETE</div>
      <div style="display:grid;justify-items:center;gap:6px"><div style="width:110px">${A.badge(ps.league, ps.div)}</div><b>You finished in ${esc(ps.name)}</b></div>
      <div class="rows"><div><span>Beskar</span><b>${HN.ui.bes(rw.beskar)}</b></div>${rw.puck ? `<div><span>Bounty puck</span><b>${A.TIER[rw.puck].label}</b></div>` : ''}${rw.card ? `<div><span>Card</span><b>${esc(D.UNIT_MAP[rw.card].name)}</b></div>` : ''}${rw.frame ? `<div><span>Frame</span><b>${esc(FRAMES[rw.frame].name)}</b></div>` : ''}</div>
      <p class="muted small" style="text-align:center">A new season starts now. Ratings above 800 settle halfway back, so everyone climbs again.</p>
      <div class="modal-actions"><button type="button" class="btn btn-primary" data-x="ok">Collect</button></div></div>`, { small: true, dismissable: false, cls: 'result-modal' });
    m.root.addEventListener('click', (e) => { if (e.target.closest('[data-x]')) { m.close(); claimSeason(); } });
  }

  // =====================================================================
  // Screens
  // =====================================================================
  const V = HN.VIEWS;
  const rerender = () => { if (App.current === 'holonet') { const n = document.querySelector('.view.hn'); if (n && n.__live) n.__live(); } };
  let liveTimer = null;
  const rerenderLive = () => {
    if (App.current !== 'holonet' || document.querySelector('.modal-backdrop')) return;
    const v = (App.params || {}).view;
    if (!['guild', 'gchat', 'graid', 'guilds'].includes(v)) return;
    if (document.activeElement && document.activeElement.matches('.view.hn input, .view.hn select, .view.hn textarea')) { clearTimeout(liveTimer); liveTimer = setTimeout(rerenderLive, 1500); return; }
    rerender();
  };

  // ---------- guild screen pieces (the tabs are put together in hn-guild.js) ----------
  const GP = {};
  GP.hero = (gid) => {
    const g = guildOf(gid);
    const lv = guildLevel(gid);
    return `<div class="g-hero" style="--gc:${g.color}">${emblem(g, 64)}<div><h2>${esc(g.name)} <small>[${esc(g.tag)}]</small></h2><p class="muted">${esc(g.motto || 'No motto yet.')}</p>
        <div class="g-lv"><b>Level ${lv.lv}</b><div class="hn-hp" style="--rc:${g.color}"><i style="width:${lv.next ? Math.min(100, (lv.xp / lv.next) * 100) : 100}%"></i><span>${fmt(lv.xp)}${lv.next ? ` / ${fmt(lv.next)}` : ''} guild XP</span></div></div>
        <small class="muted">${membersOf(gid).length}/${maxMembers(gid)} members · ${MODES[modeOf(g)]}${g.min ? ` · ${fmt(g.min)}+ rating` : ''}</small></div></div>`;
  };
  GP.week = (gid) => {
    const wp = guildWeekPoints(gid);
    const h = P2();
    return `<div class="hn-sec"><h3>This week · ${fmt(wp)} guild points</h3><div class="g-ms">${MILESTONES.map((ms, i) => { const got = h.soc.guildClaims[`ms${i}`]; const ok = wp >= ms.pts; return `<div class="g-m ${ok ? 'ok' : ''}"><b>${fmt(ms.pts)} pts</b><small>${esc(ms.label)}</small><button type="button" class="hn-btn ${ok && !got ? 'gold' : 'ghost'}" data-hn="gclaim" data-k="ms" data-i="${i}" ${ok && !got ? '' : 'disabled'}>${got ? 'Claimed' : ok ? 'Claim' : `${fmt(Math.max(0, ms.pts - wp))} to go`}</button></div>`; }).join('')}</div>
        <p class="muted small" style="margin:0">Earn points for your guild with arena wins (+10), raid runs (+5), guild raid damage and duel wins (+15). Milestones reset every week; guild XP never does.</p></div>`;
  };
  GP.levels = (gid) => {
    const lv = guildLevel(gid);
    const h = P2();
    return `<div class="hn-sec"><h3>Guild level rewards</h3><div class="g-ms">
        <div class="g-m ${lv.lv >= 2 ? 'ok' : ''}"><b>Level 2</b><small>Guild Banner frame</small><button type="button" class="hn-btn ${lv.lv >= 2 && !(h.soc.frames || []).includes('guild') ? 'gold' : 'ghost'}" data-hn="gclaim" data-k="lvl" ${lv.lv >= 2 && !(h.soc.frames || []).includes('guild') ? '' : 'disabled'}>${(h.soc.frames || []).includes('guild') ? 'Unlocked' : lv.lv >= 2 ? 'Claim' : 'Locked'}</button></div>
        <div class="g-m ${lv.lv >= 3 ? 'ok' : ''}"><b>Level 3</b><small>2,000 Beskar + Legendary puck</small><button type="button" class="hn-btn ${lv.lv >= 3 && !h.soc.gotTrooper ? 'gold' : 'ghost'}" data-hn="gclaim" data-k="lvl" ${lv.lv >= 3 && !h.soc.gotTrooper ? '' : 'disabled'}>${h.soc.gotTrooper ? 'Claimed' : lv.lv >= 3 ? 'Claim' : 'Locked'}</button></div>
      </div></div>`;
  };
  const canManageMember = (gid, uid) => {
    const me = roleOf(Net.me, gid); const them = roleOf(uid, gid);
    return canManage(gid) && uid !== Net.me && uid !== 'me' && them !== 'leader' && !(me === 'co' && them === 'co');
  };
  // Join requests: the applicant's profile at a glance (rating, arena and duel
  // record, cards collected), with Accept / Decline and a full-profile button.
  GP.apps = (gid) => {
    if (!canReview(gid)) return '';
    const g = gmap.get(gid) || {};
    const list = (G.apps || []);
    const rows = list.map((uid) => {
      const p = prof(uid); const st = p.st || {}; const d = HN.divOf(p.rating);
      const wr = (st.w || 0) + (st.l || 0) ? Math.round(((st.w || 0) / ((st.w || 0) + (st.l || 0))) * 100) : 0;
      return `<div class="g-app">${chip(uid)}<div class="g-app-st"><span>${A.badge(d.league, d.div)}<b>${fmt(p.rating)}</b></span><span><b>${fmt(st.w || 0)}–${fmt(st.l || 0)}</b><small>W–L ${wr}%</small></span><span><b>${fmt(st.dw || 0)}</b><small>duel wins</small></span><span><b>${fmt(st.cards || 0)}</b><small>cards</small></span><span><b>${p.level}</b><small>level</small></span></div>
        <div class="g-app-act"><button type="button" class="hn-btn ghost" data-hn="gappno" data-uid="${esc(uid)}">Decline</button><button type="button" class="hn-btn gold" data-hn="gappyes" data-uid="${esc(uid)}">Accept</button></div></div>`;
    }).join('');
    const invited = (g.ok || []).filter((x) => !membersOf(gid).includes(x));
    return `<div class="hn-sec"><h3>Join requests${list.length ? ` · ${list.length}` : ''}</h3>
      ${rows || `<p class="muted small" style="margin:0">${modeOf(g) === 'request' ? 'No requests right now. Players ask to join from the guild list.' : modeOf(g) === 'invite' ? 'Invite only: open a player\'s profile (from the leaderboards, arena or chat) and tap Invite.' : 'Your guild is open to all, so players join straight away.'}</p>`}
      ${invited.length ? `<p class="muted small" style="margin:6px 0 0">Invited, not joined yet: ${invited.slice(0, 8).map((x) => esc(Net.name(x))).join(', ')}${invited.length > 8 ? ` and ${invited.length - 8} more` : ''}</p>` : ''}</div>`;
  };
  GP.members = (gid) => {
    const members = membersOf(gid).map((uid) => ({ uid, pts: weekPoints(uid), p: prof(uid), r: roleOf(uid, gid) })).sort((a, b) => ['leader', 'co', 'elder', 'member'].indexOf(a.r) - ['leader', 'co', 'elder', 'member'].indexOf(b.r) || b.pts - a.pts || b.p.rating - a.p.rating);
    return `<div class="hn-sec"><h3>Members · ${members.length}/${maxMembers(gid)}</h3><div class="g-list">${members.map((x) => `<div class="g-row ${x.p.me ? 'me' : ''}">${chip(x.uid, ` · ${ROLE_NAME[x.r]}`)}<span class="r">${canManageMember(gid, x.uid) ? `<button type="button" class="hn-btn ghost g-mng" data-hn="gmanage" data-uid="${esc(x.uid)}" aria-label="Manage">Manage</button>` : ''}${A.badge(HN.divOf(x.p.rating).league, HN.divOf(x.p.rating).div)}<b>${fmt(x.pts)}</b><small>pts</small></span></div>`).join('')}</div></div>`;
  };
  GP.chat = (gid) => {
    const lines = chatLines(gid);
    return `<div class="g-chat" data-noswipe>${lines.length ? lines.map((l) => l.s ? `<p class="sys"><b>${esc(Net.name(l.uid))}</b> ${esc(l.t)}</p>` : `<div class="msg ${l.uid === Net.me ? 'me' : ''} ${l.a ? 'ann' : ''}">${chip(l.uid)}<p>${l.a ? '<em class="g-annflag">Announcement</em>' : ''}${esc(l.t)}<small>${ago(l.ts)}</small></p></div>`).join('') : '<p class="muted" style="text-align:center">No messages yet. Say hello!</p>'}</div>
      <form class="g-say" data-noswipe><input class="pf-in" data-chat maxlength="140" placeholder="Message your guild…" autocomplete="off"><button type="submit" class="hn-btn">Send</button></form>`;
  };
  GP.raid = (gid) => {
    const g = graidNow();
    const t = graidTotals(gid);
    const h = P2();
    const front = (f, kind) => {
      const F = g[f];
      const T = t[f];
      const def = D.UNIT_MAP[F.boss];
      const ids = HN.squad(kind);
      const ally = allyFor(f, gid);
      return `<div class="g-front" style="--rc:${g.color}">
        <div class="art">${root.Art.unitArt(def)}</div>
        <div><p class="eyebrow">${f === 'fleet' ? 'Fleet front · ships' : 'Ground front · characters'}</p><h3 style="margin:0">${esc(def.name)}</h3>
          <div class="hn-hp"><i style="width:${(T.left / T.pool) * 100}%"></i><span>${T.down ? 'CLEARED' : `${fmt(T.left)} / ${fmt(T.pool)}`}</span></div>
          <ul>${F.mech.map(([n, d]) => `<li><b>${esc(n)}</b>${esc(d)}</li>`).join('')}</ul>
          <div class="minis">${ids.map((id) => HN.ui.mini(id)).join('')}${ally ? `<span class="muted small" style="align-self:center">+ ${esc(ally.name)}'s squad</span>` : ''}</div>
          <button type="button" class="hn-btn ${T.down ? 'ghost' : 'gold'}" data-hn="graidgo" data-front="${f}" ${T.down || !ids.length ? 'disabled' : ''}>${T.down ? 'Cleared' : ids.length ? 'Attack this front' : (kind === 'ship' ? 'No ships yet' : 'Pick a squad')}</button>
          ${T.rows.length ? `<div class="hn-board" style="margin-top:8px">${T.rows.slice(0, 5).map((r, i) => `<div class="${r.uid === Net.me ? 'me' : ''}"><span>${i + 1}. ${esc(Net.name(r.uid))}</span><b>${fmt(r.dmg)}</b></div>`).join('')}</div>` : ''}
        </div></div>`;
    };
    return `<p class="muted" style="margin:0">${esc(g.name)} · new target every week. Your whole guild shares these health bars. Clear <b>both</b> fronts to beat the raid: your ground squad hits the ground front, your fleet hits the fleet front, and a guildmate's squad fights beside you.</p>
      ${t.fallen ? `<div class="hn-free"><span class="grow"><b>Raid beaten!</b> ${h.soc.gr.claimed ? 'Rewards claimed. A new target arrives next week.' : (h.soc.gr.d + h.soc.gr.f) ? 'You helped: 800 Beskar, a High-value puck, 50 guild points and a 1% shot at the Dark Trooper.' : 'You didn\'t land a hit this week.'}</span>${!h.soc.gr.claimed && (h.soc.gr.d + h.soc.gr.f) ? '<button type="button" class="hn-btn gold" data-hn="gclaim" data-k="raid">Claim</button>' : ''}</div>` : ''}
      ${front('ground', 'character')}${front('fleet', 'ship')}
      <div class="hn-sec"><h3>Squads</h3><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="hn-btn ghost" data-hn="pick" data-kind="character">Edit ground squad</button><button type="button" class="hn-btn ghost" data-hn="pick" data-kind="ship">Edit fleet</button></div></div>`;
  };
  const offlineGuild = () => `${HN.ui.head('GUILDS', 'Your clan in the HoloNet', true)}${HN.ui.offline ? HN.ui.offline() : '<div class="hn-free"><span class="grow"><b>Guilds need an internet connection.</b></span></div>'}`;
  // Until hn-guild.js replaces it: the plain guild home.
  V.guild = () => {
    if (!Net.ready) return offlineGuild();
    const gid = myGuildId();
    if (!gid) return V.guilds();
    const g = guildOf(gid);
    return `${HN.ui.head('GUILD', `[${esc(g.tag)}] ${esc(g.name)}`, true)}${GP.hero(gid)}${GP.week(gid)}${GP.levels(gid)}${GP.apps(gid)}${GP.members(gid)}`;
  };

  // Browse and found guilds. Your invites and your open request come first.
  V.guilds = () => {
    if (!Net.ready) return offlineGuild();
    const list = G.guilds.map((g) => ({ g, n: sizeOf(g.id), xp: guildXp(g.id) })).sort((a, b) => b.xp - a.xp);
    const appG = S().apply && gmap.get(S().apply) ? safeGuild(gmap.get(S().apply)) : null;
    const inv = (G.invites || []).map((id) => gmap.get(id)).filter(Boolean).map(safeGuild);
    const btn = (g, n) => {
      const ok = approved(g);
      const mode = modeOf(g);
      const full = n >= maxMembers(g.id);
      if (S().apply === g.id) return '<button type="button" class="hn-btn ghost" data-hn="gapplyx">Cancel request</button>';
      if (full) return '<button type="button" class="hn-btn" disabled>Full</button>';
      if (ok) return `<button type="button" class="hn-btn gold" data-hn="gjoin" data-id="${esc(g.id)}">Accept invite</button>`;
      if (S().rating < (g.min || 0)) return `<button type="button" class="hn-btn" disabled>${fmt(g.min)}+ rating</button>`;
      if (mode === 'invite') return '<button type="button" class="hn-btn" disabled>Invite only</button>';
      if (mode === 'request') return `<button type="button" class="hn-btn" data-hn="gjoin" data-id="${esc(g.id)}" ${S().apply ? 'disabled' : ''}>Request to join</button>`;
      return `<button type="button" class="hn-btn" data-hn="gjoin" data-id="${esc(g.id)}">Join</button>`;
    };
    const row = (g, n) => `<div class="g-row">${emblem(g, 40)}<span class="nm"><b style="color:${g.color}">[${esc(g.tag)}] ${esc(g.name)}</b><small>${esc(g.motto || '')}</small><small>Level ${guildLevel(g.id).lv} · ${n}/${maxMembers(g.id)} members · ${MODES[modeOf(g)]}${g.min ? ` · ${fmt(g.min)}+ rating` : ''}</small></span>${btn(g, n)}</div>`;
    return `${HN.ui.head('GUILDS', 'Join a clan: shared raids, guild chat and weekly rewards', true)}
      ${inv.length ? `<div class="hn-sec g-inv"><h3>Invites for you</h3><div class="g-list">${inv.map((g) => row(g, sizeOf(g.id))).join('')}</div></div>` : ''}
      ${appG ? `<div class="hn-sec"><h3>Your request</h3><div class="g-list">${row(appG, sizeOf(appG.id))}</div><p class="muted small" style="margin:0">Waiting for its leader. You'll join automatically when they accept, even if you're offline.</p></div>` : ''}
      <div class="hn-sec"><h3>Guilds in the HoloNet</h3>${list.length ? `<div class="g-list">${list.filter(({ g }) => g.id !== S().apply && !inv.some((x) => x.id === g.id)).map(({ g, n }) => row(g, n)).join('')}</div>` : '<div class="hn-free"><span class="grow"><b>No guilds yet.</b> Be the first to found one.</span></div>'}</div>
      <div class="hn-sec"><h3>Found a guild · 500 Beskar</h3>
        <div class="g-form" data-noswipe>
          <input class="pf-in" data-gf="name" maxlength="22" placeholder="Guild name">
          <input class="pf-in" data-gf="tag" maxlength="4" placeholder="TAG" style="text-transform:uppercase">
          <input class="pf-in" data-gf="motto" maxlength="70" placeholder="Motto (optional)">
          <label class="muted small">Who can join <select class="pf-in" data-gf="mode" style="width:auto">${Object.entries(MODES).map(([k, n]) => `<option value="${k}">${n}</option>`).join('')}</select></label>
          <label class="muted small">Minimum rating to join <input class="pf-in" data-gf="min" type="number" min="0" max="2500" step="50" value="0" style="width:90px"></label>
          <p class="muted small" style="margin:0">Guild picture · ${GUILD_PICS.length} to choose from</p>
          <div data-gpicker>${pickerHtml(form.pic, '#8fe8ff', form.emblem)}</div>
          <div class="g-pick">${COLORS.map((c, i) => `<button type="button" class="g-c ${i === 0 ? 'on' : ''}" data-gc="${c}" style="background:${c}"></button>`).join('')}</div>
          <button type="button" class="hn-btn gold" data-hn="gcreate">Found guild</button>
        </div></div>`;
  };

  V.gchat = () => {
    const gid = myGuildId();
    if (!gid) return V.guild();
    const g = guildOf(gid);
    return `${HN.ui.head('GUILD CHAT', `[${esc(g.tag)}] ${esc(g.name)}`, true)}${GP.chat(gid)}`;
  };
  V.graid = () => {
    const gid = myGuildId();
    if (!gid) return V.guild();
    return `${HN.ui.head('GUILD RAID', `${esc(graidNow().name)} · new target every week`, true)}${GP.raid(gid)}`;
  };

  // Leagues page: divisions, the current season, rewards and frames.
  const baseLeagues = V.leagues;
  V.leagues = (p) => {
    const h = P2();
    const days = Math.max(0, Math.ceil(seasonEnds() / 86400000));
    const frames = ownedFrames();
    const me = prof();
    return `${baseLeagues(p)}
      <div class="hn-sec"><h3>Season ${seasonNo() % 100} · ends in ${days} day${days === 1 ? '' : 's'}</h3>
        <p class="muted small" style="margin:0">Seasons last four weeks. When one ends you're paid for the best division you reached that season, then ratings above 800 settle halfway back. Best this season: <b>${esc(HN.divOf(h.soc.sBest || h.rating).name)}</b>.</p>
        <div class="g-ms">${Object.entries(SEASON_REWARD).map(([lg, rw]) => `<div class="g-m ${HN.divOf(h.soc.sBest || h.rating).league === lg ? 'ok' : ''}"><div style="width:48px">${A.badge(lg, lg === 'legend' ? 1 : 3)}</div><b>${lg[0].toUpperCase() + lg.slice(1)}</b><small>${fmt(rw.beskar)} Beskar${rw.puck ? ` · ${A.TIER[rw.puck].label} puck` : ''}${rw.card ? ` · ${esc(D.UNIT_MAP[rw.card].name)}` : ''}${rw.frame ? ` · ${esc(FRAMES[rw.frame].name)} frame` : ''}</small></div>`).join('')}</div></div>
      <div class="hn-sec"><h3>Profile frames</h3><div class="pf-frames">${shownFrames().map(([id, f]) => `<div class="pf-fr ${frames.includes(id) ? '' : 'locked'}">${avatar({ ...me, frame: id }, 'md')}<b>${esc(f.name)}</b><small>${frames.includes(id) ? 'Unlocked' : esc(f.how)}</small></div>`).join('')}</div>
        <button type="button" class="hn-btn ghost" data-hn="prof" data-uid="me" style="justify-self:start">Your profile ›</button></div>`;
  };

  // Hub: a real Guilds tile and your profile.
  const baseHub = V.hub;
  V.hub = (p) => {
    const gid = myGuildId();
    const g = gid && guildOf(gid);
    const me = prof();
    let html = baseHub(p);
    const guildTile = `<button type="button" class="hn-mini ${g && graidTotals(gid).fallen && !P2().soc.gr.claimed ? 'dot' : ''}" data-hn="guild"><b>Guilds</b><small>${g ? `[${esc(g.tag)}] ${esc(g.name)} · ${membersOf(gid).length} members` : Net.ready ? `${G.guilds.length} guild${G.guilds.length === 1 ? '' : 's'} · join or found one` : 'Needs an internet connection'}</small></button>`;
    html = html.replace(/<div class="hn-mini" style="cursor:default"><b>Guilds<\/b><small>[^<]*<\/small><\/div>/, guildTile);
    html = html.replace('<div class="hn-tiles">', `<button type="button" class="pf-me" data-hn="prof" data-uid="me">${avatar(me, 'md')}<span><b>${esc(Net.name(me.uid).replace(' (you)', ''))}</b><small>${me.nb} badges · ${esc(FRAMES[me.frame].name)} frame · tap to view or edit</small></span></button><div class="hn-tiles">`);
    return html;
  };

  // Lists elsewhere get tappable name chips.
  const baseRaid = V.raid;
  V.raid = (p) => {
    let html = baseRaid(p);
    const t = HN.raidTotals();
    t.rows.slice(0, 8).forEach((x, i) => {
      const uid = x.uid === 'me' ? 'me' : x.uid;
      html = html.replace(`<span>${i + 1}. ${esc(x.name)}</span>`, `<span class="rk">${i + 1}.</span>${chip(uid)}`);
    });
    return html;
  };
  V.leaders = () => {
    const h = S();
    const rows = Net.ready ? Net.arena.map((a) => ({ uid: a.uid, rating: a.uid === Net.me ? h.rating : a.rating })) : [];
    if (!rows.some((r) => r.uid === Net.me)) rows.push({ uid: Net.me || 'me', rating: h.rating });
    rows.sort((a, b) => b.rating - a.rating);
    return `${HN.ui.head('LEADERBOARD', Net.ready ? 'Everyone playing in the HoloNet. Tap a name to see their profile.' : 'Offline: the shared board needs an internet connection.', true)}
      <div class="g-list">${rows.map((r, i) => { const d = HN.divOf(r.rating); return `<div class="g-row ${r.uid === Net.me || r.uid === 'me' ? 'me' : ''}"><span class="rk">${i + 1}</span>${chip(r.uid)}<span class="r">${A.badge(d.league, d.div)}<b>${fmt(r.rating)}</b><small>${esc(d.name)}</small></span></div>`; }).join('')}</div>`;
  };
  const baseArenaV = V.arena;
  V.arena = (p) => {
    let html = baseArenaV(p);
    // Real players' names become chips.
    for (const a of Net.arena) {
      const nm = esc(Net.name(a.uid));
      html = html.split(`<b>${nm}</b><span class="tag">PLAYER</span>`).join(`${chip(a.uid)}<span class="tag">PLAYER</span>`);
    }
    return html;
  };

  // ---------- clicks ----------
  const CL = HN.clicks;
  CL.prof = (b) => openProfile(b.dataset.uid === 'me' ? 'me' : b.dataset.uid);
  CL.guild = () => HN.ui.go('guild');
  CL.gchat = () => HN.ui.go('gchat');
  CL.graid = () => HN.ui.go('graid');
  CL.graidgo = (b) => startGuildRaid(b.dataset.front);
  CL.gjoin = (b) => joinGuild(b.dataset.id);
  CL.gapplyx = () => cancelApply();
  CL.gappyes = (b) => answerApp(b.dataset.uid, true);
  CL.gappno = async (b) => { if (await UI.confirmBox('Decline this request?', `${Net.name(b.dataset.uid)} won't be able to ask again unless you invite them.`, 'Decline')) answerApp(b.dataset.uid, false); };
  CL.gleave = () => leaveGuild();
  CL.gclaim = (b) => claimGuild(b.dataset.k, +b.dataset.i);
  const form = { emblem: 0, pic: GUILD_PICS[0], color: COLORS[0] };
  CL.gcreate = (b) => {
    const root2 = b.closest('.g-form');
    const v = (k) => (root2.querySelector(`[data-gf="${k}"]`) || {}).value || '';
    createGuild({ name: v('name'), tag: v('tag'), motto: v('motto'), mode: v('mode'), min: parseInt(v('min'), 10) || 0, emblem: form.emblem, pic: form.pic, color: form.color });
  };
  document.addEventListener('click', (e) => {
    const cat = e.target.closest('.g-form [data-gcat]');
    if (cat) { pickCat = cat.dataset.gcat; const box = cat.closest('[data-gpicker]'); if (box) box.innerHTML = pickerHtml(form.pic, '#8fe8ff', form.emblem); return; }
    const ge = e.target.closest('.g-form [data-ge], .g-form [data-gp]');
    if (ge) { if (ge.dataset.gp) { form.pic = ge.dataset.gp; } else { form.emblem = +ge.dataset.ge; form.pic = ''; } ge.parentNode.querySelectorAll('.g-e').forEach((x) => x.classList.toggle('on', x === ge)); }
    const gc = e.target.closest('.g-form [data-gc]');
    if (gc) { form.color = gc.dataset.gc; gc.parentNode.querySelectorAll('.g-c').forEach((x) => x.classList.toggle('on', x === gc)); }
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('.g-say');
    if (!f) return;
    e.preventDefault();
    const inp = f.querySelector('[data-chat]');
    const t = inp.value;
    inp.value = '';
    sayLine(t).then(() => { setTimeout(() => { rerender(); const i2 = document.querySelector('[data-chat]'); if (i2) i2.focus(); const c = document.querySelector('.g-chat'); if (c) c.scrollTop = c.scrollHeight; }, 300); });
  });

  // Season check and chat scroll whenever the HoloNet opens.
  const baseGo = App.go;
  App.go = function (screen, params, opts) {
    const r = baseGo.call(this, screen, params, opts);
    if (App.current === 'holonet') {
      loadFor((App.params || {}).view || 'hub');
      setTimeout(() => {
        checkSeason();
        if (!App.battleActive) seasonModal();
        const c = document.querySelector('.g-chat');
        if (c) c.scrollTop = c.scrollHeight;
      }, 60);
    }
    return r;
  };
  HN.Net.on(() => { const c = document.querySelector('.g-chat'); if (c) c.scrollTop = c.scrollHeight; });

  // Ranked duels report into guild points and the season.
  HN.social = { addGP, trackSeasonBest, guildOf, myGuildId, GRAIDS, graidNow, graidTotals, FRAMES, ownedFrames, frameSvg,
    prof, avatar, chip, nameKey, emblem, GUILD_PICS, PICS, pickerHtml, setPickCat, canAnnounce, announcements, sayLine, ago, roleOf, ROLE_NAME, canManage, MAX_ELDERS, PERK_NEEDS, GLVL, cleanText, PERKS, PERK_COST, PIC_COST, perkLevel, maxMembers, donors, bankOf, pushGuildStats, membersOf, guildLevel, guildWeekPoints, loadGuilds, G, gmap, setGuilds, rerender, SAFE, isMuted, editProfile, P2, seasonNo, seasonEnds, SEASON_REWARD, weekPoints, MAX_MEMBERS, COLORS, EMBLEMS, createGuild, joinGuild, watchMyGuild, GP, MODES, modeOf, approved, canReview, leaderOf, writeGuild, watchMembers, loadInvites, inviteTo, answerApp, applyGuild, cancelApply, unread, marks, markSeen, MKS, MEGA, setGtab: (t) => { gtab = t; }, gtabNow, sizeOf, chatLines, offlineGuild };

  // ---------- tester hooks ----------
  Object.assign(HN.dev, {
    endSeason: () => { const h = P2(); h.soc.season = seasonNo() - 1; HN.save(); checkSeason(); seasonModal(); },
    guildPts: (n) => { addGP(n || 500); HN.save(); Net.publish(); rerender(); },
    graidDmg: (front, n) => { const h = P2(); h.soc.gr.b = graidNow().id; if (front === 'fleet') h.soc.gr.f += n; else h.soc.gr.d += n; HN.save(); Net.publish(); rerender(); },
    frames: () => { const h = P2(); h.soc.frames = Object.keys(FRAMES); HN.save(); rerender(); },
  });

  // ---------- styles ----------
  const css = document.createElement('style');
  css.textContent = `
.pf-av { position: relative; display: inline-grid; grid-template: 100% / 100%; place-items: center; flex: none; }
/* The picture is sized from the frame box, so a smaller box (the editor preview on phones) keeps both centred together. */
.pf-av .pic { display: block; width: 87.5%; height: 87.5%; border-radius: 50%; overflow: hidden; background: #06121e; }
.pf-av .pic svg { width: 100%; height: 100%; display: block; transform: scale(1.45) translateY(5%); }
.pf-av .pf-frame { position: absolute; inset: -22%; width: 144%; height: 144%; pointer-events: none; overflow: visible; }
.pf-av.sm { width: 30px; height: 30px; }
.pf-av.md { width: 56px; height: 56px; }
.pf-av.lg { width: 96px; height: 96px; }
.pf-chip { display: inline-flex; align-items: center; gap: 9px; min-width: 0; padding: 2px 8px 2px 4px; border: 0; border-radius: 999px; background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.pf-chip:hover, .pf-chip:focus-visible { background: rgba(95, 216, 255, 0.1); }
.pf-chip .nm { display: grid; min-width: 0; line-height: 1.15; }
.pf-chip .nm b { font-family: var(--font-display); letter-spacing: .04em; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pf-chip .nm small { color: #9fc4d8; font-size: 11px; white-space: nowrap; }
.hn-board .rk, .g-row .rk { color: #9fc4d8; min-width: 18px; align-self: center; }
.hn-board > div { align-items: center; }
.pf-me { display: flex; align-items: center; gap: 14px; padding: 10px 14px; border-radius: 14px; border: 1px solid rgba(95, 216, 255, 0.3); background: rgba(8, 20, 32, 0.9); color: #e6f6ff; font: inherit; text-align: left; cursor: pointer; }
.pf-me b { display: block; font-family: var(--font-display); letter-spacing: .08em; } .pf-me small { color: #9fc4d8; }
.pf-card { display: grid; gap: 14px; }
.pf-top { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 14px; align-items: center; padding: 14px; border-radius: 16px; background: linear-gradient(135deg, rgba(10, 30, 46, 0.9), rgba(6, 12, 22, 0.9)); border: 1px solid var(--gc); }
.pf-id h2 { margin: 0; font-family: var(--font-display); letter-spacing: .08em; overflow-wrap: anywhere; }
.pf-id p { margin: 2px 0; }
.pf-lg { width: 64px; display: grid; justify-items: center; gap: 2px; color: #8fe8ff; font-size: 10px; } .pf-lg .hn-badge { width: 100%; height: auto; }
.pf-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
.pf-stats div { display: grid; padding: 8px 10px; border-radius: 10px; background: rgba(8, 20, 32, 0.85); border: 1px solid rgba(95, 216, 255, 0.15); }
.pf-stats b { font-family: var(--font-display); font-size: 18px; color: #e8f6ff; } .pf-stats span { color: #9fc4d8; font-size: 11px; }
.pf-h { margin: 4px 0 0; font-family: var(--font-display); letter-spacing: .12em; font-size: 13px; color: #8fe8ff; text-transform: uppercase; }
.pf-h small { color: #9fc4d8; letter-spacing: 0; text-transform: none; font-family: var(--font-body, system-ui); }
.pf-bdgs { display: grid; grid-template-columns: repeat(auto-fill, minmax(66px, 1fr)); gap: 6px; }
.pf-bdg { display: grid; justify-items: center; gap: 4px; padding: 8px 4px; border-radius: 12px; border: 1px solid rgba(95, 216, 255, 0.15); background: rgba(8, 20, 32, 0.8); color: #dff8ff; font: 600 11px var(--font-body, system-ui); text-align: center; cursor: pointer; }
.pf-bdg .fs-badge { width: 40px; height: 40px; margin: 0; position: relative; inset: auto; transform: none; animation: none; filter: none; }
.pf-bdg .fs-badge, .pf-bdg .fs-badge * { animation: none !important; }
.pf-bdg span { font-size: 10px; line-height: 1.15; }
.pf-card { position: relative; }
.pf-x { position: sticky; top: 0; float: right; z-index: 3; width: 34px; height: 34px; margin: -6px -6px 0 0; border-radius: 50%; border: 1px solid rgba(95, 216, 255, 0.5); background: #0a1622; color: #dff8ff; font-size: 16px; line-height: 1; cursor: pointer; }
.pf-bdg .fs-badge svg { width: 100%; height: 100%; }
.pf-bdg.on { border-color: #ffd23f; box-shadow: 0 0 0 1px #ffd23f inset; }
.pf-edit { display: grid; gap: 10px; }
.pf-lbl { display: grid; gap: 4px; font-weight: 700; } .pf-lbl small { color: #9fc4d8; font-weight: 400; }
.pf-in { padding: 9px 12px; border-radius: 10px; border: 1px solid rgba(95, 216, 255, 0.35); background: #06121e; color: #e8f6ff; font: inherit; min-width: 0; }
.pf-frames { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 8px; }
.pf-fr { display: grid; justify-items: center; gap: 6px; padding: 12px 6px 8px; border-radius: 12px; border: 1px solid rgba(95, 216, 255, 0.2); background: rgba(8, 20, 32, 0.8); color: #dff8ff; font: inherit; text-align: center; }
button.pf-fr { cursor: pointer; } .pf-fr.on { border-color: #ffd23f; box-shadow: 0 0 0 1px #ffd23f inset; }
.pf-fr b { font-size: 12px; } .pf-fr small { color: #9fc4d8; font-size: 10px; } .pf-fr.locked { opacity: .45; }
.nm-req { display: grid; gap: 10px; text-align: left; }
.nm-top { display: grid; grid-template-columns: 64px minmax(0, 1fr); gap: 12px; align-items: start; }
.nm-top h2 { margin: 2px 0 4px; } .nm-top .eyebrow { margin: 0; } .nm-top p { margin: 0; }
.nm-who { width: 64px; height: 72px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(95, 216, 255, 0.35); background: #071420; }
.nm-who svg { width: 100%; height: 100%; display: block; }
.nm-in { font-size: 18px; padding: 12px 14px; }
.nm-req .modal-actions { justify-content: flex-end; }
.modal.pe-modal { width: min(720px, 100%); padding-bottom: 0; }
.pe { gap: 10px; }
.pe-head { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 14px; align-items: center; }
.pe-prev .pf-av.lg { width: 92px; height: 92px; }
.pe-id { display: grid; gap: 6px; min-width: 0; } .pe-id h2 { margin: 0; }
.pe-st { margin: 0; min-height: 1.2em; font-size: 12px; color: #9fc4d8; } .pe-st.good { color: #4ade80; } .pe-st.bad { color: #ff7a5a; }
.fp { display: grid; gap: 10px; text-align: left; } .fp h2 { margin: 0; }
.fp-row { display: flex; gap: 8px; } .fp-row .pf-in { flex: 1; min-width: 0; }
.hv-find { justify-self: start; margin: 4px 0 8px; }
.pe-sum { margin: 0; }
.pe-tabs, .pe-cats { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.pe-tabs::-webkit-scrollbar, .pe-cats::-webkit-scrollbar { display: none; }
.pe-tabs button, .pe-cats button { flex: 1 0 auto; padding: 10px 14px; min-height: 42px; border-radius: 10px; border: 1px solid rgba(95, 216, 255, 0.25); background: rgba(8, 20, 32, 0.85); color: #dff8ff; font: 700 13px/1 var(--font-display, inherit); letter-spacing: .04em; cursor: pointer; white-space: nowrap; }
.pe-tabs button.on { background: linear-gradient(180deg, #ffd23f, #e0a820); color: #1a1206; border-color: #ffd23f; }
.pe-cats button { flex: 0 0 auto; min-height: 36px; padding: 8px 12px; font-size: 12px; } .pe-cats button.on { border-color: #5fd8ff; background: rgba(95, 216, 255, 0.18); }
.pe-cats button small, .pe-tabs button small { opacity: .7; font-weight: 400; }
.pe-pane { display: grid; gap: 10px; min-height: 240px; align-content: start; }
.pe-avs { display: grid; grid-template-columns: repeat(auto-fill, minmax(78px, 1fr)); gap: 10px 6px; }
.pe-av { display: grid; justify-items: center; gap: 4px; padding: 6px 2px; border: 0; border-radius: 12px; background: none; color: #cfe6f2; font: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.pe-av .pic { width: 64px; height: 64px; border-radius: 50%; overflow: hidden; display: block; background: #06121e; border: 3px solid rgba(95, 216, 255, 0.18); transition: transform .12s, border-color .12s; }
.pe-av .pic svg { width: 100%; height: 100%; display: block; }
.pe-av small { font-size: 10.5px; line-height: 1.15; text-align: center; max-width: 76px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.pe-av.on .pic { border-color: #ffd23f; box-shadow: 0 0 0 2px rgba(255, 210, 63, 0.35), 0 0 14px rgba(255, 210, 63, 0.4); }
.pe-av.on small { color: #ffd23f; font-weight: 700; }
@media (hover: hover) { .pe-av:hover .pic { transform: scale(1.06); border-color: rgba(95, 216, 255, 0.6); } }
.pe-frames { grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); }
.pe-note { margin: 0; }
.pe-foot { position: sticky; bottom: 0; z-index: 2; display: flex; gap: 10px; justify-content: flex-end; margin: 0 -22px; padding: 12px 22px calc(12px + env(safe-area-inset-bottom, 0px)); background: var(--panel, #0b1622); border-top: 1px solid rgba(95, 216, 255, 0.18); }
.pe-foot .btn { min-width: 110px; }
@media (max-width: 520px) {
  .pe-head { grid-template-columns: 72px minmax(0, 1fr); gap: 10px; }
  .pe-prev .pf-av.lg { width: 72px; height: 72px; }
  .pe-avs { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .pe-av .pic { width: 58px; height: 58px; }
  .pe-foot .btn { flex: 1; }
}
.pf-avs { display: grid; grid-template-columns: repeat(auto-fill, minmax(52px, 1fr)); gap: 6px; max-height: 190px; overflow: auto; }
.pf-avb { aspect-ratio: 1; padding: 0; border-radius: 50%; overflow: hidden; border: 2px solid transparent; background: #06121e; cursor: pointer; }
.pf-avb svg { width: 100%; height: 100%; display: block; } .pf-avb.on { border-color: #ffd23f; }
.g-hero { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 14px; align-items: center; padding: 14px; border-radius: 16px; background: linear-gradient(135deg, rgba(10, 30, 46, 0.92), rgba(6, 12, 22, 0.92)); border: 1px solid var(--gc); }
.g-hero h2 { margin: 0; font-family: var(--font-display); letter-spacing: .08em; } .g-hero h2 small { color: var(--gc); }
.g-hero p { margin: 2px 0 8px; }
.g-lv { display: grid; grid-template-columns: auto 1fr; gap: 10px; align-items: center; margin-bottom: 4px; }
.g-chatbg { background: radial-gradient(circle at 30% 30%, rgba(95, 216, 255, 0.35), transparent 60%), repeating-linear-gradient(0deg, rgba(95, 216, 255, 0.08) 0 1px, transparent 1px 8px); }
.g-ms { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
.g-m { display: grid; gap: 4px; justify-items: start; padding: 10px; border-radius: 12px; background: rgba(8, 20, 32, 0.85); border: 1px solid rgba(95, 216, 255, 0.15); }
.g-m.ok { border-color: rgba(255, 210, 63, 0.6); } .g-m b { font-family: var(--font-display); letter-spacing: .06em; } .g-m small { color: #9fc4d8; }
.g-m .hn-badge { width: 100%; height: auto; }
.g-list { display: grid; gap: 6px; }
.g-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 12px; background: rgba(8, 20, 32, 0.85); border: 1px solid rgba(95, 216, 255, 0.12); }
.g-row.me { border-color: rgba(95, 216, 255, 0.5); }
.g-row .nm { flex: 1; display: grid; min-width: 0; } .g-row .nm small { color: #9fc4d8; }
.g-row .pf-chip { flex: 1; }
.g-row .r { display: grid; grid-template-columns: 34px auto; column-gap: 6px; align-items: center; justify-items: start; text-align: left; }
.g-row .r .hn-badge { width: 34px; height: auto; grid-row: span 2; } .g-row .r small { color: #9fc4d8; font-size: 10px; }
.g-form { display: grid; gap: 8px; padding: 12px; border-radius: 14px; background: rgba(8, 20, 32, 0.85); border: 1px solid rgba(95, 216, 255, 0.2); }
.g-pick { display: flex; gap: 6px; flex-wrap: wrap; }
.g-e, .g-c { padding: 3px; border-radius: 10px; border: 2px solid transparent; background: #06121e; cursor: pointer; }
.g-c { width: 30px; height: 30px; border-radius: 50%; } .g-e.on, .g-c.on { border-color: #ffd23f; }
.g-chat { display: grid; gap: 8px; align-content: start; max-height: min(60vh, 520px); min-height: 200px; overflow: auto; padding: 10px; border-radius: 14px; background: rgba(4, 12, 20, 0.9); border: 1px solid rgba(95, 216, 255, 0.2); }
.g-chat .msg { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 4px 8px; align-items: start; }
.g-chat .msg .pf-chip .nm small { display: none; }
.g-chat .msg p { margin: 0; padding: 7px 10px; border-radius: 4px 12px 12px 12px; background: rgba(20, 50, 74, 0.85); overflow-wrap: anywhere; }
.g-chat .msg.me p { background: rgba(40, 90, 60, 0.75); }
.g-chat .msg small { display: block; color: #9fc4d8; font-size: 10px; margin-top: 2px; }
.g-chat .sys { margin: 0; text-align: center; color: #9fc4d8; font-size: 12px; }
.g-say { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; position: sticky; bottom: calc(var(--nav-h, 64px) + 8px); }
.g-front { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 14px; padding: 12px; border-radius: 16px; background: linear-gradient(135deg, rgba(20, 10, 12, 0.92), rgba(6, 8, 16, 0.92)); border: 1px solid var(--rc); }
.g-front .art { border-radius: 12px; overflow: hidden; aspect-ratio: 1; } .g-front .art svg { width: 100%; height: 100%; display: block; }
.g-front ul { margin: 8px 0; padding-left: 18px; font-size: 13px; color: #cfdde8; } .g-front li b { display: block; color: #fff; }
.g-front .minis { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px; } .g-front .minis .mini { width: 32px; height: 32px; }
@media (max-width: 520px) { .g-front { grid-template-columns: 1fr; } .g-front .art { max-width: 160px; } .pf-top { grid-template-columns: auto minmax(0, 1fr); } .pf-lg { grid-column: 1 / -1; justify-self: start; grid-template-columns: 40px auto; width: auto; align-items: center; } .pf-lg .hn-badge { width: 40px; } }
`;
  document.head.appendChild(css);
})(window);

// Update 2.2 (READY, not in the build yet: add it to live-bundle.sh after
// hn-social once the owner approves): seven new HoloNet-only cards. Bossk, Cad
// Bane, IG-11, Greef Karga, Cara Dune, Zuckuss and Todo 360, with their art,
// kits, signature ultimates and where they come from. Off until 2.2 is live.
(function (root) {
  'use strict';
  if (!(root.Update22 && root.Update22.on())) return;
  const D = root.GameData;
  const HN = root.HN;
  const { P, E, C, R, L, shade, shoulders, neck, head, eyes, brows, nose, mouth, glowEyes, blaster, SCENES } = root.ArtX;
  const add = (id, fn) => root.Art.addArt('char', id, fn);
  const dmg = (mult, hits) => ({ type: 'damage', mult, hits: hits || 1 });
  const heal = (pct) => ({ type: 'heal', pct });
  const buff = (status, turns) => ({ type: 'status', status, turns, chance: 1 });
  const debuff = (status, turns, chance) => ({ type: 'status', status, turns, chance: chance == null ? 1 : chance });
  const tm = (amount) => ({ type: 'tm', amount });
  const cleanse = () => ({ type: 'cleanse' });
  const dispel = () => ({ type: 'dispel' });
  const ab = (name, cd, target, effects, desc) => ({ name, cd, target, effects, desc });
  const ult = (name, target, effects, desc, quote) => ({ name, cd: 0, target, effects, desc, quote, ultimate: true });

  // ---------- shared props ----------
  // A proper blaster rifle: stock, receiver, scope, barrel, muzzle and grip, drawn along +x then rotated.
  const rifle = (x, y, rot, s = 1, o = {}) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">`
    + P('M-15 -2.2 L-4 -3.2 L-2.4 2 L-13.4 4.6 C-15 4 -15.6 2 -15 -2.2Z', o.stock || '#4a3424') + L(-13, 0, -5, -1, '#6a4a34', 0.6)
    + R(-4, -3.6, 23, 6.6, o.body || '#2a2d33', 'rx="1.4"') + R(-2, -2.6, 18, 1.2, '#5a5e66') + [2, 6, 10].map((k) => R(k, 0.2, 2.4, 1.6, '#16181c')).join('')
    + R(19, -1.8, 15, 3.4, '#1e2026') + R(21, -2.6, 2, 5, '#3a3e46') + R(26, -2.6, 2, 5, '#3a3e46') + R(33, -2.6, 3.4, 5.2, '#3a3e46', 'rx=".6"')
    + R(1, -7.6, 14, 3.4, '#3a3e46', 'rx="1.2"') + C(15.4, -5.9, 1.7, '#14202c') + C(15.1, -6.3, 0.6, '#8ad0ff', 'opacity=".8"') + L(4, -4.4, 4, -3.4, '#2a2d33', 1.2) + L(12, -4.4, 12, -3.4, '#2a2d33', 1.2)
    + P('M4 2.6 L8.6 2.6 L10 10 L6 10.4Z', '#22252b') + (o.mag ? R(12, 2.6, 4, 6, '#3a3e46', 'rx=".8"') : '') + '</g>';
  const hand = (x, y, col, r = 3.4) => E(x, y, r, r * 0.8, col) + P(`M${x - r * 0.8} ${y - r * 0.2} Q${x} ${y - r * 0.9} ${x + r * 0.8} ${y - r * 0.2}`, 'none', 'stroke="#000" stroke-opacity=".25" stroke-width=".6"');
  const win = (x, y, w, h, c = '#ffcf7a') => R(x, y, w, h, c, 'opacity=".85"');

  // Bossk: Trandoshan hunter aboard the Hound's Tooth. Heavy brow, deep-set slit eyes,
  // broad squared jaw, thick neck, yellow flight suit with harness, Relby mortar rifle.
  add('hn_bossk', () => R(0, 0, 100, 100, '#1a1310')
    + [0, 20, 40, 60, 80].map((x) => R(x + 1, 0, 18, 100, '#241a14') + L(x + 1, 0, x + 1, 100, '#0e0a08', 1)).join('')
    + C(22, 26, 19, '#0c0a10') + C(22, 26, 16.6, '#0a1020') + C(14, 33, 9, '#c86a2a') + C(12, 31, 9, '#e08a3a', 'opacity=".6"') + [[28, 16], [31, 30], [18, 14], [34, 22], [24, 38]].map(([x, y]) => C(x, y, 0.5, '#fff', 'opacity=".8"')).join('')
    + C(22, 26, 19, 'none', 'stroke="#3a2a20" stroke-width="2.4"') + [0, 60, 120, 180, 240, 300].map((a) => { const t = a * Math.PI / 180; return C(22 + 19 * Math.cos(t), 26 + 19 * Math.sin(t), 1, '#6a4a30'); }).join('')
    + R(60, 10, 40, 3, '#ff9a3a', 'opacity=".55"') + R(60, 10, 40, 1, '#ffd08a', 'opacity=".8"') + R(66, 30, 30, 22, '#2e221a', 'rx="1.5"') + R(68, 32, 26, 3, '#ff6a2a', 'opacity=".5"') + [70, 76, 82, 88].map((x) => R(x, 38, 4, 10, '#18120e')).join('')
    + R(0, 88, 100, 12, '#120c0a')
    + P('M2 100 C4 84 20 74 36 72 L64 72 C80 74 96 84 98 100Z', '#d4ac38') + P('M2 100 C4 84 20 74 36 72 L46 100Z', '#000', 'opacity=".18"')
    + P('M24 82 C30 86 34 94 34 100 M76 82 C70 86 66 94 66 100', 'none', 'stroke="#9a7a1e" stroke-width="1.2" opacity=".8"')
    + P('M30 74 L56 100 L49 100 L26 77Z', '#5a3a1e') + [0, 1, 2, 3, 4].map((k) => R(32 + k * 4.4, 78.6 + k * 4.4, 3.4, 2.6, '#c8a858', `transform="rotate(45 ${33.7 + k * 4.4} ${79.9 + k * 4.4})"`)).join('')
    + P('M36 72 C40 66 60 66 64 72 L62 78 C56 75 44 75 38 78Z', '#b8922a')
    + P('M41 70 L42 56 L58 56 L59 70Z', '#6e7c46') + P('M41 64 L59 64 L59 70 L41 70Z', '#000', 'opacity=".2"')
    + P('M32.6 40 C32.6 27.6 40 21.6 50 21.6 C60 21.6 67.4 27.6 67.4 40 L66.4 51 C64.6 59 58.6 64.4 50 65 C41.4 64.4 35.4 59 33.6 51Z', '#6c7444')
    + P('M32.6 40 C32.6 27.6 40 21.6 50 21.6 L50 65 C41.4 64.4 35.4 59 33.6 51Z', '#000', 'opacity=".14"')
    + P('M36 30 C40 24 46 22.6 50 22.6 C54 22.6 60 24 64 30 C58 27.4 54 27 50 27.4 C46 27 42 27.4 36 30Z', '#848c5a', 'opacity=".6"')
    + P('M33.4 38.6 C37.6 33.4 45.6 33 49 37.4 L50 39.4 L51 37.4 C54.4 33 62.4 33.4 66.6 38.6 L66.2 42 C61.4 39.2 55.4 39.4 51.6 42.2 L48.4 42.2 C44.6 39.4 38.6 39.2 33.8 42Z', '#3e4626')
    + E(43, 43.8, 3.6, 2.2, '#1a1408') + E(57, 43.8, 3.6, 2.2, '#1a1408')
    + `<g style="filter:drop-shadow(0 0 1px #ff8a1a)">${E(43, 44, 2.6, 1.5, '#ff9a2a')}${E(57, 44, 2.6, 1.5, '#ff9a2a')}</g>` + R(42.5, 42.6, 1, 2.8, '#1a0a02', 'rx=".5"') + R(56.5, 42.6, 1, 2.8, '#1a0a02', 'rx=".5"')
    + P('M40.4 50 C43.4 47.4 56.6 47.4 59.6 50 C60 56 56 60.6 50 60.8 C44 60.6 40 56 40.4 50Z', '#767e4e')
    + P('M46.6 50.6 L47.8 52.4 M53.4 50.6 L52.2 52.4', 'none', 'stroke="#232c12" stroke-width="1.1" stroke-linecap="round"')
    + P('M40.6 56 C44.6 58.4 55.4 58.4 59.4 56', 'none', 'stroke="#232c12" stroke-width="1.3" stroke-linecap="round"')
    + P('M43.4 56.9 L44.2 59.2 L45 57.2Z M56.6 56.9 L55.8 59.2 L55 57.2Z', '#efe6c8')
    + [[38, 30], [43, 27.6], [50, 26.4], [57, 27.6], [62, 30], [36, 47], [64, 47], [37.4, 53], [62.6, 53], [42, 62], [58, 62], [46, 31], [54, 31]].map(([x, y]) => E(x, y, 1.3, 0.8, '#4a522c', 'opacity=".45"')).join('') + [[34.4, 40, 37.4, 47], [65.6, 40, 62.6, 47], [38, 56, 42, 61.6], [62, 56, 58, 61.6]].map(([a, b, c2, d]) => L(a, b, c2, d, '#3e4626', 0.8, 'opacity=".6"')).join('')
    + [[40, 34.6], [60, 34.6], [35, 44], [65, 44]].map(([x, y]) => C(x, y, 0.7, '#a8b874', 'opacity=".6"')).join('')
    + rifle(16, 82, -22, 1.4, { stock: '#5a4028' }) + hand(27, 76.6, '#5e6a3c', 3.8) + hand(49, 67.8, '#5e6a3c', 3.6)
    + P('M24 78.4 L23 81.4 M26.6 79.2 L26 82.4 M29.2 79 L29.4 82.4', 'none', 'stroke="#1a1408" stroke-width=".8" stroke-linecap="round"'));

  // Cad Bane: Duros gunslinger at a frontier outpost. Wide hat throwing a shadow, red eyes,
  // breathing tubes, toothpick, flared high collar, twin LL-30 pistols, a wanted poster behind.
  add('hn_cadbane', () => R(0, 0, 100, 100, '#3a1c2a') + R(0, 0, 100, 45, '#6a2a2a') + R(0, 30, 100, 30, '#c8642a', 'opacity=".55"') + C(80, 46, 9, '#ffd89a', 'opacity=".9"') + C(68, 50, 6, '#ffb86a', 'opacity=".8"')
    + P('M0 62 L0 46 L12 46 L12 40 L26 40 L26 50 L40 50 L40 62Z', '#2a1612') + P('M70 62 L70 44 L84 44 L84 36 L100 36 L100 62Z', '#2a1612') + win(16, 44, 3, 3) + win(88, 42, 3, 3) + win(76, 50, 3, 3, '#ffb85a')
    + R(0, 60, 100, 40, '#4a2a1c') + R(0, 60, 100, 2, '#2a160e')
    + R(4, 64, 18, 24, '#d8c08a', 'transform="rotate(-6 13 76)"') + R(6, 66, 14, 3, '#5a2a1a', 'transform="rotate(-6 13 76)"') + C(13, 76, 4, '#8a6a4a', 'transform="rotate(-6 13 76)"') + [80, 83].map((y) => R(7, y, 12, 1.2, '#8a6a4a', 'transform="rotate(-6 13 76)"')).join('')
    + P('M4 100 C6 86 22 78 36 77 L64 77 C78 78 94 86 96 100Z', '#4a3222') + P('M4 100 C6 86 22 78 36 77 L44 100Z', '#000', 'opacity=".2"')
    + P('M28 82 L36 62 L45 74 L41 100 L34 100Z', '#5a3e2a') + P('M72 82 L64 62 L55 74 L59 100 L66 100Z', '#5a3e2a') + P('M36 62 L45 74 L41 77Z M64 62 L55 74 L59 77Z', '#000', 'opacity=".3"')
    + P('M44 76 L56 76 L55 100 L45 100Z', '#2a1c14') + R(44, 88, 12, 3.4, '#6a4a2a') + R(48, 87.6, 4, 4.2, '#c8a24a', 'rx=".8"')
    + R(45.8, 59, 8.4, 18, '#3e6c8c') + P('M45.8 66 H54.2 V77 H45.8Z', '#000', 'opacity=".2"')
    + P('M36 44 C36 32 42 27 50 27 C58 27 64 32 64 44 C64 55 58 62 50 62 C42 62 36 55 36 44Z', '#4f86a8')
    + P('M36 44 C36 32 42 27 50 27 L50 62 C42 62 36 55 36 44Z', '#000', 'opacity=".16"') + P('M38 50 C40 56 44 59 47 60 M62 50 C60 56 56 59 53 60', 'none', 'stroke="#2e5a78" stroke-width=".8"')
    + R(36, 34, 28, 6, '#000', 'opacity=".28"')
    + E(45, 43.4, 3, 2, '#1a2a38') + E(55, 43.4, 3, 2, '#1a2a38') + glowEyes(45, 55, 43.4, '#ff3a2a', 1.5) + C(44.5, 42.8, 0.4, '#ffd0c0') + C(54.5, 42.8, 0.4, '#ffd0c0')
    + P('M41 40 L47.6 41.2 M59 40 L52.4 41.2', 'none', 'stroke="#1e3a4e" stroke-width="1.4" stroke-linecap="round"')
    + P('M46 54.6 Q50 55.6 54 54.4', 'none', 'stroke="#1e3a4e" stroke-width="1.1" stroke-linecap="round"') + L(53.4, 54.6, 59.6, 52.6, '#d8c89a', 0.8)
    + C(36.4, 49, 2.4, '#9aa1ab') + C(36.4, 49, 1.2, '#4a4e56') + C(63.6, 49, 2.4, '#9aa1ab') + C(63.6, 49, 1.2, '#4a4e56')
    + P('M36.4 51.4 C34.6 56 35.4 61 39 64 M63.6 51.4 C65.4 56 64.6 61 61 64', 'none', 'stroke="#7a828c" stroke-width="1.8" stroke-linecap="round"') + P('M36.4 51.4 C34.6 56 35.4 61 39 64', 'none', 'stroke="#c8ccd2" stroke-width=".5" opacity=".7"')
    + P('M6 30 C16 25.4 30 24.4 38 24.8 L39.4 11.6 C42 8 58 8 60.6 11.6 L62 24.8 C70 24.4 84 25.4 94 30 C84 33.6 66 34.6 50 34.6 C34 34.6 16 33.6 6 30Z', '#5a3e2a')
    + P('M6 30 C16 25.4 30 24.4 38 24.8 L39.4 11.6 C42 8 50 8 50 8 L50 34.6 C34 34.6 16 33.6 6 30Z', '#000', 'opacity=".15"') + R(39.2, 20.6, 21.6, 3.4, '#2a1c14') + R(39.2, 21.2, 21.6, 0.8, '#8a6a4a')
    + P('M8 30 C18 27 32 26 50 26.4', 'none', 'stroke="#7a5a3e" stroke-width=".7" opacity=".8"')
    + blaster(68, 74, -62, '#2a2d33') + hand(70, 76, '#4f86a8', 3.2) + R(30, 86, 6, 10, '#2a2d33', 'rx="1.2" transform="rotate(10 33 91)"') + R(29.4, 84.6, 7.2, 3, '#3a2a1c', 'rx="1"'));

  // IG-11: the bounty-droid-turned-nurse on Nevarro. Tall cylinder head with a curved ring of
  // sensor lenses, skeletal ribbed torso, ammo bandolier, twin rifles, lava glow behind.
  add('hn_ig11', () => R(0, 0, 100, 100, '#140c0c') + R(0, 0, 100, 55, '#1e1418') + C(78, 18, 7, '#c8b8a8', 'opacity=".25"')
    + P('M0 60 L0 40 L10 40 L10 32 L22 32 L22 44 L30 44 L30 60Z', '#241a1a') + P('M70 60 L70 36 L80 28 L90 36 L90 30 L100 30 L100 60Z', '#241a1a') + win(14, 36, 2.4, 3, '#ff8a3a') + win(84, 40, 2.4, 3, '#ff8a3a')
    + R(0, 58, 100, 42, '#1a1010') + P('M0 92 Q25 84 50 90 T100 86 V100 H0Z', '#ff5a1a', 'opacity=".5"') + P('M0 96 Q30 90 60 95 T100 92 V100 H0Z', '#ffb03a', 'opacity=".6"')
    + P('M18 100 L26 80 C34 74 66 74 74 80 L82 100Z', '#4a4e56') + P('M18 100 L26 80 C34 74 50 74 50 74 L50 100Z', '#000', 'opacity=".22"')
    + R(46.6, 74, 6.8, 26, '#2e3138') + [80, 85, 90, 95].map((y) => P(`M30 ${y} Q50 ${y - 3} 70 ${y}`, 'none', 'stroke="#2a2d33" stroke-width="1.6"')).join('')
    + P('M24 78 L76 98 L72 100 L22 82Z', '#5a4630') + [0, 1, 2, 3, 4, 5, 6].map((k) => R(27 + k * 6.6, 79.6 + k * 2.6, 3, 4.6, '#c8a858', `transform="rotate(21 ${28.5 + k * 6.6} ${81.9 + k * 2.6})"`)).join('')
    + R(45, 58, 10, 17, '#3a3e46') + L(46.6, 58, 46.6, 75, '#8a8e96', 1) + L(53.4, 58, 53.4, 75, '#8a8e96', 1) + [62, 66, 70].map((y) => L(45, y, 55, y, '#22252b', 0.8)).join('')
    + R(36.4, 16, 27.2, 44, '#6a6e76', 'rx="4"') + R(36.4, 16, 9, 44, '#000', 'opacity=".2" rx="4"') + R(56, 16, 3, 44, '#a8acb4', 'opacity=".35"')
    + E(50, 16.8, 13.6, 3.4, '#8a8e96') + E(50, 16.8, 9, 2, '#5a5e66') + R(48.6, 9, 2.8, 7, '#4a4e56', 'rx="1"') + C(50, 8.6, 1.2, '#ff5a3a')
    + P('M36.4 33 C42 31 58 31 63.6 33 L63.6 43 C58 41 42 41 36.4 43Z', '#1a1c22')
    + `<g style="filter:drop-shadow(0 0 1.4px #ff5a3a)">${E(38.6, 37.2, 1, 2, '#ff5a3a', 'opacity=".7"')}${C(44, 36.6, 2, '#ff5a3a')}${C(50, 36.4, 2.2, '#ffb48a')}${C(56, 36.6, 2, '#ff5a3a')}${E(61.4, 37.2, 1, 2, '#ff5a3a', 'opacity=".7"')}</g>`
    + [22, 26, 48, 52, 56].map((y) => P(`M36.4 ${y} Q50 ${y - 1.4} 63.6 ${y}`, 'none', 'stroke="#4a4e56" stroke-width=".7"')).join('')
    + [[39, 20], [61, 20], [39, 55], [61, 55]].map(([x, y]) => C(x, y, 0.8, '#3a3e46')).join('') + [[42, 46], [57, 28], [45, 53]].map(([x, y]) => C(x, y, 1.2, '#8a5a3a', 'opacity=".55"')).join('')
    + L(30, 80, 24, 70, '#5a5e66', 2.2) + L(70, 80, 76, 70, '#5a5e66', 2.2) + rifle(14, 80, -22, 1.15) + rifle(86, 80, -158, 1.15) + hand(24, 72, '#5a5e66', 3) + hand(76, 72, '#5a5e66', 3));

  // Greef Karga: Guild magistrate under Nevarro's night sky. Cool blue backdrop so his
  // warm skin, maroon coat and pale fur collar stand out; rim light on the head.
  add('hn_greef', () => R(0, 0, 100, 100, '#0e1a30') + R(0, 0, 100, 40, '#16284a') + C(80, 16, 7, '#dfe8ff', 'opacity=".9"') + C(78, 15, 7, '#16284a', 'opacity=".35"')
    + [[12, 8], [30, 14], [48, 6], [62, 20], [90, 30], [8, 26]].map(([x, y]) => C(x, y, 0.5, '#fff', 'opacity=".8"')).join('')
    + P('M0 70 L0 40 L14 40 L14 30 L28 30 L28 46 L36 46 L36 70Z', '#2a3a58') + P('M64 70 L64 44 L74 36 L84 44 L84 34 L100 34 L100 70Z', '#2a3a58')
    + [[4, 44], [8, 52], [18, 34], [22, 40], [30, 52], [68, 48], [76, 42], [88, 40], [94, 50], [70, 58]].map(([x, y]) => win(x, y, 3, 3)).join('')
    + R(0, 68, 100, 32, '#1a2640')
    + P('M4 100 C6 86 22 78 36 77 L64 77 C78 78 94 86 96 100Z', '#7a2a2e') + P('M4 100 C6 86 22 78 36 77 L44 100Z', '#000', 'opacity=".2"')
    + P('M18 84 C26 73 38 71 50 75 C62 71 74 73 82 84 L78 92 C70 84 60 82 50 84 C40 82 30 84 22 92Z', '#d8c8a4')
    + [22, 28, 34, 40, 60, 66, 72, 78].map((x) => L(x, 78 + Math.abs(50 - x) * 0.1, x + 1.4, 85, '#a8987a', 0.9)).join('')
    + P('M44 84 L56 84 L54 100 L46 100Z', '#c8a24a') + [88, 93].map((y) => L(46, y, 54, y, '#7a5a2a', 0.8)).join('')
    + neck('#6a4430') + E(36.8, 47, 2.2, 3.6, '#7a5038') + E(63.2, 47, 2.2, 3.6, '#7a5038') + E(50, 45, 12.5, 15, '#7a5038')
    + P('M37.5 45 Q37.5 60 50 60', 'none', 'stroke="#000" stroke-opacity=".18" stroke-width="4"')
    + E(50, 45, 12.9, 15.4, 'none', 'stroke="#8ab8ff" stroke-width=".7" opacity=".55"')
    + eyes({ y: 45.6, iris: '#1a0e08', spread: 5 }) + brows('#e8e0d0', { y: 41.8, w: 1.4 }) + nose({ y: 47 })
    + P('M42.6 52.6 C43.6 59.6 47 63.6 50 64.4 C53 63.6 56.4 59.6 57.4 52.6 C54 55 46 55 42.6 52.6Z', '#f2ecdf') + P('M45.6 52.2 Q50 54 54.4 52.2', 'none', 'stroke="#f2ecdf" stroke-width="1.8" stroke-linecap="round"') + mouth('smirk', { y: 54.6, color: '#3a1a10' })
    + P('M37 38 C37 27 43 23 50 23 C57 23 63 27 63 38 C58 35 42 35 37 38Z', '#2a1e1a') + P('M36.6 38.6 C42 35.6 58 35.6 63.4 38.6 L63 40.6 C58 37.8 42 37.8 37 40.6Z', '#d8b24a')
    + P('M40 26 C44 24 56 24 60 26', 'none', 'stroke="#4a3a32" stroke-width=".8"'));

  // Cara Dune: Alliance shock trooper. Short dark hair shaved at the sides, rebel tattoo,
  // armoured pauldron, and a heavy blaster rifle held across her body in both hands.
  add('hn_cara', () => R(0, 0, 100, 100, '#c8844a') + R(0, 0, 100, 40, '#e8b07a') + C(24, 18, 7, '#fff2d6') + P('M0 64 L14 50 L26 58 L40 46 L56 60 L70 48 L86 58 L100 50 V100 H0Z', '#8a5030') + P('M0 76 Q30 66 60 74 T100 70 V100 H0Z', '#6a3a22')
    + P('M4 100 C6 86 22 78 36 77 L64 77 C78 78 94 86 96 100Z', '#4e5246') + P('M4 100 C6 86 22 78 36 77 L44 100Z', '#000', 'opacity=".2"')
    + P('M34 80 C40 76 60 76 66 80 L64 100 L36 100Z', '#6e7262') + P('M38 84 L62 84 L60 92 L40 92Z', '#5a5e50') + P('M50 85 L51.4 88 L54.6 88.4 L52.2 90.4 L52.8 93.4 L50 91.8 L47.2 93.4 L47.8 90.4 L45.4 88.4 L48.6 88Z', '#c8402a', 'opacity=".85"')
    + P('M10 86 C12 76 22 72 32 74 L34 86 C26 84 18 86 12 92Z', '#8a8e7e') + P('M12 82 C18 78 26 77 32 78', 'none', 'stroke="#5a5e50" stroke-width="1"') + P('M90 88 C88 80 80 76 70 77 L68 88 C76 86 84 88 88 92Z', '#6e7262')
    + neck('#c89a7a') + head('#d0a282', { cy: 45, rx: 12, ry: 14.6 }) + eyes({ y: 46, iris: '#2a1a10', spread: 5 }) + brows('#1a1210', { y: 42.2, w: 1.5 })
    + nose({ y: 47.4 }) + mouth('', { y: 55.4, color: '#8a4a3a' })
    + P('M38.2 42 C37.4 30 42.6 25.4 50 25.4 C57.4 25.4 62.6 30 61.8 42 C60.4 36.4 57 33.4 50 33.4 C44 33.4 40 36 38.2 42Z', '#1a1210')
    + P('M38.2 42 L38 47 C37.6 44 37.6 42.6 38.2 42Z M61.8 42 L62 47 C62.4 44 62.4 42.6 61.8 42Z', '#3a2a22', 'opacity=".7"')
    + P('M57.6 48.6 L59.6 50 L58.4 52.4 L60.4 53.6', 'none', 'stroke="#2a3a5a" stroke-width=".8" stroke-linecap="round"') + C(59.2, 51.2, 0.5, '#2a3a5a') + C(60.6, 48.4, 0.4, '#2a3a5a')
    + rifle(18, 84, -20, 1.5, { stock: '#3a3e46', mag: true }) + hand(29, 79, '#3a3a32', 3.8) + hand(53, 70.4, '#3a3a32', 3.6));

  // Todo 360 (Clone Wars design), three-quarter side view: a long briefcase-shaped head with a dark
  // top panel and two small yellow eyes on its front face, a ribbed spine column, a round egg body
  // with a big dark port, thin jointed arms with little hands, and rod legs ending in disc thrusters
  // firing blue. Set in the cockpit of Cad Bane's ship, hyperspace through the viewport.
  add('hn_todo', () => R(0, 0, 100, 100, '#100c12')
    + P('M6 6 H94 L86 46 H14Z', '#06101e') + [[10, 16, 46, 26], [20, 9, 50, 24], [30, 30, 52, 28], [62, 10, 52, 24], [80, 18, 56, 26], [74, 36, 54, 29], [16, 38, 47, 30], [88, 30, 58, 27], [40, 8, 51, 22], [58, 40, 52, 30]].map(([x1, y1, x2, y2]) => L(x1, y1, x1 + (x2 - x1) * 0.55, y1 + (y2 - y1) * 0.55, '#bfe8ff', 0.7, 'opacity=".8"')).join('')
    + C(50, 26, 9, '#4ab8ff', 'opacity=".18"') + C(50, 26, 4, '#dff6ff', 'opacity=".5"')
    + P('M6 6 H94 L86 46 H14Z', 'none', 'stroke="#3a2a32" stroke-width="2.4"') + L(50, 6, 50, 46, '#3a2a32', 1.8) + L(10, 26, 90, 26, '#2a1e26', 1)
    + P('M0 0 H100 V6 H0Z', '#1e1418') + P('M0 6 L6 6 L14 46 L0 52Z', '#1e1418') + P('M100 6 L94 6 L86 46 L100 52Z', '#1e1418')
    + P('M0 46 H100 V100 H0Z', '#1a1216') + P('M8 50 H92 L96 62 H4Z', '#2a1e24')
    + [[10, 53, '#ff3a4a'], [16, 53, '#ffb03a'], [22, 53, '#3affb0'], [70, 53, '#3ab8ff'], [76, 53, '#ff3a4a'], [82, 53, '#ffb03a'], [88, 56, '#3affb0'], [12, 57, '#3ab8ff']].map(([x, y, c]) => R(x, y, 4, 2, c, 'opacity=".9" rx=".5"')).join('')
    + R(30, 52, 14, 7, '#0a1a24', 'rx="1"') + P('M31 57 L34 54 L37 56 L40 53 L43 55', 'none', 'stroke="#3affb0" stroke-width=".6"') + R(56, 52, 12, 7, '#0a1a24', 'rx="1"') + C(62, 55.5, 2.4, 'none', 'stroke="#ff8a3a" stroke-width=".6"')
    + R(4, 64, 22, 30, '#22181e', 'rx="3"') + R(7, 68, 16, 6, '#0a1a24', 'rx="1"') + P('M8 72 L11 69.6 L14 71.4 L17 68.6 L21 70.6', 'none', 'stroke="#3ab8ff" stroke-width=".6"') + [78, 83, 88].map((y) => R(8, y, 14, 2, '#3a2a32', 'rx=".6"')).join('') + C(20, 78.8, 0.9, '#ff3a4a')
    + `<g style="filter:drop-shadow(0 0 3px #4ab8ff)">${P('M42.4 76 L45 88 L47.6 76Z', '#8ae0ff')}${P('M55.4 75 L58 86 L60.6 75Z', '#8ae0ff')}</g>` + P('M43.6 76 L45 81.6 L46.4 76Z M56.6 75 L58 80.6 L59.4 75Z', '#e8faff')
    + L(55.5, 63, 59, 68.4, '#8a8e96', 1.5) + L(59, 68.4, 58, 72.6, '#8a8e96', 1.5) + C(59, 68.4, 1.4, '#3a3e46') + E(58, 74, 4, 1.7, '#3a3e46') + E(58, 73, 3.2, 1.2, '#7a7e86')
    + L(41, 52, 37.6, 57.4, '#7a7e86', 1.3) + L(37.6, 57.4, 37, 62, '#7a7e86', 1.3) + C(37.6, 57.4, 1.1, '#3a3e46') + P('M37 62 L35.6 64.4 M37 62 L37.2 64.8 M37 62 L38.6 64', 'none', 'stroke="#7a7e86" stroke-width=".8" stroke-linecap="round"')
    + R(47.8, 30, 6.4, 14, '#5a5e66', 'rx="1"') + R(48.6, 30, 1.6, 14, '#9aa0a8') + [33, 36.4, 39.8].map((y) => R(47.8, y, 6.4, 1, '#2a2d33')).join('') + C(51, 44, 2.2, '#3a3e46')
    + E(51, 54, 11, 12.4, '#b8bcc4') + P('M40 54 C40 47 45 41.6 51 41.6 C47 44 44.6 49 44.6 54 C44.6 60 47 64 51 66.4 C45 66.4 40 61 40 54Z', '#000', 'opacity=".18"') + P('M47 43.4 C52 42 58 44.6 60.6 50', 'none', 'stroke="#fff" stroke-width="1.2" opacity=".55" stroke-linecap="round"')
    + E(47, 53, 5.4, 6.4, '#5a5e66') + E(47, 53, 4.4, 5.4, '#141619') + E(46, 51.4, 1.4, 1.8, '#2e3238') + C(56.4, 60, 2.4, '#8a8e96') + C(56.4, 60, 1.3, '#3a3e46') + R(56, 45.4, 3, 1.6, '#6a6e76', 'rx=".6"')
    + L(48, 64.4, 45, 69.4, '#a8acb4', 1.6) + L(45, 69.4, 45, 73.6, '#a8acb4', 1.6) + C(45, 69.4, 1.5, '#4a4e56') + C(48.6, 64.6, 1.6, '#4a4e56') + E(45, 75, 4.4, 1.8, '#4a4e56') + E(45, 74, 3.4, 1.3, '#a8acb4')
    + C(58.6, 44.6, 1.6, '#4a4e56') + L(58.6, 44.6, 63.6, 53.6, '#c8ccd2', 1.5) + L(63.6, 53.6, 64.4, 61.4, '#c8ccd2', 1.5) + C(63.6, 53.6, 1.3, '#4a4e56')
    + P('M64.4 61.4 L62.8 64.2 M64.4 61.4 L64.6 64.6 M64.4 61.4 L66.4 63.8', 'none', 'stroke="#c8ccd2" stroke-width=".9" stroke-linecap="round"')
    + P('M35.6 12.6 L67.6 9.4 C70.6 9.2 72.4 11 72.4 14 L72.4 25.6 C72.4 28.8 70.6 30.6 67.6 30.8 L35.6 33.4Z', '#a8acb4')
    + P('M35.6 12.6 L67.6 9.4 C70.6 9.2 72.4 11 72.4 14 L72.4 17 L35.6 19.6Z', '#c8ccd2', 'opacity=".7"') + L(36, 26.6, 72, 23.6, '#7a7e86', 0.6) + R(60, 24.6, 8, 3.4, '#6a6e76', 'rx=".8" transform="rotate(-4.8 64 26.3)"') + C(69.6, 27.6, 0.7, '#5a5e66')
    + P('M24.6 15.4 C25.6 11 28.6 8.4 32.6 8 L67 5 C70.4 4.8 72.4 6.6 72.4 9.4 L72.4 14 C72.4 11 70.6 9.2 67.6 9.4 L35.6 12.6 L27.6 13.6 C26 13.8 25 14.4 24.6 15.4Z', '#dfe2e6')
    + P('M30 10.6 L66 7.4 C68 7.2 69.2 8 69.6 9.6 L36.4 12.4 Z', '#1a1c22')
    + P('M25.4 13.4 L35.6 12.6 L35.6 33.4 L25.4 34.6 C23 34.8 21.4 33.4 21.4 31.2 L21.4 17 C21.4 14.8 23 13.6 25.4 13.4Z', '#8e9299')
    + P('M24.6 15.6 L34.2 14.8 L34.2 31.8 L24.6 32.8 C23.6 32.9 23 32.2 23 31.2 L23 17.2 C23 16.3 23.6 15.7 24.6 15.6Z', '#25282e')
    + L(28.6, 15.4, 28.6, 32.4, '#5a5e66', 0.9) + L(28.6, 15.4, 28.6, 32.4, '#0e1013', 0.4)
    + E(25.8, 24.2, 2.6, 2.9, '#0b0c0f') + E(31.6, 23.8, 2.6, 2.9, '#0b0c0f') + E(25.8, 24.2, 2.6, 2.9, 'none', 'stroke="#6a6e76" stroke-width=".5"') + E(31.6, 23.8, 2.6, 2.9, 'none', 'stroke="#6a6e76" stroke-width=".5"')
    + `<g style="filter:drop-shadow(0 0 1.8px #ffd23f) drop-shadow(0 0 3.6px #ffb000)">${C(25.8, 24.2, 1.55, '#ffd23f')}${C(31.6, 23.8, 1.55, '#ffd23f')}</g>` + C(25.3, 23.6, 0.5, '#fffbe0') + C(31.1, 23.2, 0.5, '#fffbe0')
    + L(25.8, 27.6, 25.8, 31.4, '#4a4e56', 0.7) + L(31.6, 27.2, 31.6, 31, '#4a4e56', 0.7)
    + P('M21.4 31.2 C21.4 33.4 23 34.8 25.4 34.6 L35.6 33.4 L35.6 34.6 L25.6 35.8 C22.6 36 21 34.4 21 32Z', '#5a5e66')
    + P('M21.4 17 C21.4 14.8 23 13.6 25.4 13.4 L25.8 14.2 C23.8 14.4 22.6 15.4 22.6 17.2 L22.6 31 C22.6 32.4 23.2 33.4 24.4 33.8 L24 34.6 C22.4 34.4 21.4 33.2 21.4 31.2Z', '#fff', 'opacity=".28"'));

  // Zuckuss: Gand findsman on the Star Destroyer bridge. Big dark compound eyes, ribbed breather
  // snout with hoses to a chest tank, heavy hooded coat and harness, the bridge window behind.
  add('hn_zuckuss', () => R(0, 0, 100, 100, '#1c2026') + P('M4 8 H96 L88 54 H12Z', '#0a0e18') + [[20, 16], [34, 30], [60, 14], [78, 26], [50, 40], [26, 44], [70, 46]].map(([x, y]) => C(x, y, 0.5, '#fff', 'opacity=".8"')).join('')
    + P('M4 8 H96 L88 54 H12Z', 'none', 'stroke="#3a404a" stroke-width="2"') + L(36, 8, 32, 54, '#3a404a', 1.6) + L(64, 8, 68, 54, '#3a404a', 1.6) + L(8, 30, 92, 30, '#3a404a', 1.2)
    + P('M30 28 L44 26 L50 30 L44 32 Z', '#5a606a', 'opacity=".6"') + R(0, 54, 100, 46, '#2a2e36') + [8, 30, 70, 88].map((x) => R(x, 60, 12, 4, '#3a8ae0', 'opacity=".45" rx="1"')).join('')
    + P('M4 100 C6 84 20 75 34 73 L66 73 C80 75 94 84 96 100Z', '#5e5446') + P('M4 100 C6 84 20 75 34 73 L44 100Z', '#000', 'opacity=".2"')
    + P('M24 76 C30 66 38 60 50 60 C62 60 70 66 76 76 C70 72 62 70 50 70 C38 70 30 72 24 76Z', '#4a4236')
    + P('M28 78 L58 100 L52 100 L24 82Z', '#3a2e22') + R(56, 80, 14, 12, '#7a8088', 'rx="3"') + R(58, 82, 10, 3, '#4a5058', 'rx="1"') + C(63, 89, 1.6, '#2a2e36')
    + P('M30 46 C28 30 37 20 50 20 C63 20 72 30 70 46 C69 56 62 64 50 66 C38 64 31 56 30 46Z', '#6a6050') + P('M30 46 C28 30 37 20 50 20 L50 66 C38 64 31 56 30 46Z', '#000', 'opacity=".15"')
    + P('M26 46 C24 26 36 14 50 14 C64 14 76 26 74 46 C72 40 70 34 66 30 C62 26 56 24 50 24 C44 24 38 26 34 30 C30 34 28 40 26 46Z', '#4a4236')
    + E(40, 40, 8, 9.4, '#0e1218') + E(60, 40, 8, 9.4, '#0e1218') + E(40, 40, 8, 9.4, 'none', 'stroke="#2a3038" stroke-width="1.4"') + E(60, 40, 8, 9.4, 'none', 'stroke="#2a3038" stroke-width="1.4"')
    + [[37, 36], [43, 37], [39, 42], [44, 43], [57, 36], [63, 37], [59, 42], [64, 43]].map(([x, y]) => C(x, y, 1.6, '#1a2230')).join('') + C(37.4, 35.6, 1.6, '#8ab0d0', 'opacity=".55"') + C(57.4, 35.6, 1.6, '#8ab0d0', 'opacity=".55"')
    + R(44, 48, 12, 15, '#5a5e66', 'rx="4"') + [51, 54, 57, 60].map((y) => L(44.6, y, 55.4, y, '#2e3238', 0.9)).join('') + E(50, 63.4, 4.4, 2, '#2e3238')
    + P('M46 60 C40 64 36 70 38 78 M54 60 C60 64 64 70 62 80', 'none', 'stroke="#7a8088" stroke-width="2.4" stroke-linecap="round"') + P('M46 60 C40 64 36 70 38 78 M54 60 C60 64 64 70 62 80', 'none', 'stroke="#2e3238" stroke-width=".6" stroke-dasharray="1.2 1.2"')
    + R(30, 22, 6, 4, '#3a3e46', 'rx="1" transform="rotate(-24 33 24)"') + R(64, 22, 6, 4, '#3a3e46', 'rx="1" transform="rotate(24 67 24)"')
    + R(6, 80, 30, 5, '#2a2d33', 'rx="1.5" transform="rotate(-14 21 82)"') + R(30, 74, 10, 3, '#2a2d33', 'transform="rotate(-14 35 75)"') + E(30, 82, 3.6, 2.8, '#4a4236'));


  const NEW = [
    { id: 'hn_bossk', name: 'Bossk', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 142, traits: ['bounty'], home: 'tatooine',
      bio: 'A Trandoshan hunter who has made a career of tracking Wookiees. Passive, Cold-Blooded: +20% damage against enemies below 50% health.',
      abilities: [ab('Relby Scattergun', 0, 'enemy', [dmg(1.1), debuff('defDown', 2, 0.3)], 'Deal damage with a 30% chance of Defense Down.'), ab('Hunt the Wookiee', 3, 'enemy', [dmg(1.8), debuff('defDown', 2)], 'Heavy damage and Defense Down for 2 turns.')],
      ultimate: ult('Trandoshan Rage', 'allEnemies', [dmg(1.7), { ...heal(0.15), on: 'self' }], 'Tear into every enemy, healing for 15% as he goes.', 'Bossk hunts.'),
      how: 'Raid champion: top damage when a raid boss falls (rotates with Krrsantan)' },
    { id: 'hn_cadbane', name: 'Cad Bane', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 160, traits: ['bounty', 'scoundrel'], home: 'tatooine',
      bio: 'The fastest draw in the Outer Rim, and he knows it. Passive, Quickest Draw: always takes the first turn of a battle.',
      abilities: [ab('Quick Draw', 0, 'enemy', [dmg(0.65, 2)], 'Hit one enemy twice.'), ab('Rocket Boots', 3, 'self', [buff('defUp', 1), tm(30)], 'Dodge in the air: Defense Up and 30% Turn Meter.')],
      ultimate: ult('Hostage Play', 'enemy', [dmg(2.4), debuff('stun', 1), dispel()], 'Heavy damage to one enemy, Stun it and strip its buffs.', 'You\'re not as fast as me.'),
      how: 'Capture Cad Bane in a Legendary bounty puck' },
    { id: 'hn_ig11', name: 'IG-11', kind: 'character', faction: 'light', rarity: 'epic', role: 'tank', spd: 118, traits: ['droid', 'bounty'], home: 'tatooine',
      bio: 'A hunter droid reprogrammed to nurse and protect. Passive, Protocol: Protect: allies below 30% health gain Defense Up.',
      abilities: [ab('Spinning Torso', 0, 'enemy', [dmg(0.6, 2)], 'Spin and fire twice at one enemy.'), ab('Nurse Protocol', 4, 'ally', [heal(0.3), buff('defUp', 2)], 'Heal one ally 30% and give them Defense Up.')],
      ultimate: ult('Self-Destruct Protocol', 'allEnemies', [dmg(2.0), { ...buff('taunt', 2), on: 'self' }], 'Draw every enemy in, then blow them all back: heavy damage to all enemies and Taunt.', 'I am not a nurse droid.'),
      how: "Varka's Forge · Beskar" },
    { id: 'hn_greef', name: 'Greef Karga', kind: 'character', faction: 'light', rarity: 'rare', role: 'support', spd: 132, traits: ['leader'], home: 'tatooine',
      bio: 'The Guild agent turned magistrate of Nevarro. Passive, Good Business: +10% Beskar from every HoloNet battle he fights in.',
      abilities: [ab('Hold-out Blaster', 0, 'enemy', [dmg(1.0)], 'Damage one enemy.'), ab('Guild Contract', 3, 'allAllies', [tm(15), buff('offUp', 1)], 'All allies gain 15% Turn Meter and Offense Up.')],
      ultimate: ult('Magistrate of Nevarro', 'allAllies', [buff('offUp', 2), buff('defUp', 2)], 'Every ally gains Offense Up and Defense Up for 2 turns.', 'That\'s good business.'),
      how: 'Guild reward: Beskar Vault, guild level 4' },
    { id: 'hn_cara', name: 'Cara Dune', kind: 'character', faction: 'light', rarity: 'epic', role: 'tank', spd: 120, traits: ['rebel'], home: 'tatooine',
      bio: 'A former Rebel shock trooper who became Marshal of Nevarro. Passive, Shock Trooper: +15% defense while Taunting.',
      abilities: [ab('Heavy Rifle', 0, 'enemy', [dmg(1.0), { ...buff('taunt', 1), on: 'self' }], 'Damage one enemy and Taunt for 1 turn.'), ab('Shock Trooper', 3, 'enemy', [dmg(1.4), debuff('stun', 1, 0.6), { ...buff('defUp', 2), on: 'self' }], 'Charge in: damage, 60% Stun chance, and Defense Up.')],
      ultimate: ult('Marshal of Nevarro', 'allAllies', [heal(0.15), buff('defUp', 2), { ...buff('taunt', 2), on: 'self' }], 'Heal every ally 15%, give them Defense Up, and Taunt to shield the squad.', 'Nobody touches them.'),
      how: 'Raid reward (chance when a boss falls)' },
    { id: 'hn_zuckuss', name: 'Zuckuss', kind: 'character', faction: 'dark', rarity: 'epic', role: 'support', spd: 136, traits: ['bounty'], home: 'tatooine',
      bio: 'A Gand findsman who tracks quarry through meditation and mist. Passive, Findsman: the first enemy he hits each battle takes +15% damage from your squad.',
      abilities: [ab('Findsman Shot', 0, 'enemy', [dmg(1.0), debuff('defDown', 2)], 'Damage one enemy and inflict Defense Down.'), ab('Ammonia Cloud', 3, 'allEnemies', [debuff('offDown', 2)], 'Offense Down on every enemy for 2 turns.')],
      ultimate: ult('Gand Mystic Trance', 'allEnemies', [dmg(1.6), { ...tm(25), on: 'allies' }], 'Foresee the fight: damage every enemy and all allies gain 25% Turn Meter.', 'Zuckuss sees.'),
      how: 'Reach the Gold league' },
    { id: 'hn_todo', name: 'Todo 360', kind: 'character', faction: 'dark', rarity: 'epic', role: 'healer', spd: 140, traits: ['droid'], home: 'tatooine',
      bio: 'Cad Bane\'s chatty techno-service droid, who flies on booster legs. Passive, Partner: +20 speed with Cad Bane in the squad.',
      abilities: [ab('Shock Prod', 0, 'enemy', [dmg(0.9), debuff('stun', 1, 0.3)], 'Damage one enemy with a 30% chance to Stun.'), ab('Repair Protocol', 3, 'ally', [heal(0.25), cleanse()], 'Heal one ally 25% and clear their debuffs.')],
      ultimate: ult('Overclocked Core', 'allAllies', [heal(0.2), tm(20)], 'Heal every ally 20% and give them 20% Turn Meter.', 'Hello! I am Todo!'),
      how: 'Capture Cad Bane (bonus chance), or a rare Legendary puck pull' },
  ];
  const SIG = {
    hn_bossk: { move: 'volley', prop: 'bolt', impact: 'burn', color: '#ffb02a', n: 5 },
    hn_cadbane: { move: 'ricochet', prop: 'bolt', impact: 'scorch', color: '#ff4a3a', n: 2 },
    hn_ig11: { move: 'turret', prop: 'bolt', impact: 'knock', color: '#ff5a3a' },
    hn_greef: { move: 'rally', color: '#ffcf7a' },
    hn_cara: { move: 'aegis', prop: 'deflector', color: '#c8402a' },
    hn_zuckuss: { move: 'shockwave', prop: 'mist', impact: 'freeze', color: '#9ad0a0' },
    hn_todo: { move: 'heal', prop: 'spark', color: '#3affb0' },
  };
  for (const c of NEW) {
    if (D.UNIT_MAP[c.id]) continue;
    const def = { ...c, hn: true, sig: SIG[c.id] };
    delete def.how;
    D.UNIT_MAP[c.id] = def;
    if (D.BIOS) D.BIOS[c.id] = c.bio;
    if (!HN.HN_IDS.includes(c.id)) HN.HN_IDS.push(c.id);
    HN.HOW[c.id] = c.how;
  }
})(window);

// Season leaderboard cards. Darth Vader in the hallway is the prize for
// finishing a season 1st. The other five are designed and ready for later
// seasons; they exist in the game data (so they can be previewed) but no
// reward hands them out yet.
(function (root) {
  'use strict';
  const D = root.GameData;
  const HN = root.HN;
  const B = root.BattleUI;
  const { el } = root.UI;
  const { P, E, C, R, L } = root.ArtX;

  const ab = (name, cd, target, effects, desc) => ({ name, cd, target, effects, desc });
  const ult = (name, target, effects, desc, quote) => ({ name, cd: 0, target, effects, desc, quote, ultimate: true });
  const dmg = (mult, hits, more) => ({ type: 'damage', mult, hits: hits || 1, ...(more || {}) });
  const heal = (pct) => ({ type: 'heal', pct });
  const buff = (status, turns) => ({ type: 'status', status, turns, chance: 1 });
  const debuff = (status, turns, chance) => ({ type: 'status', status, turns, chance: chance == null ? 1 : chance });
  const tm = (amount) => ({ type: 'tm', amount });
  let seq = 0;
  const lg = (id, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('')}</linearGradient>`;
  const rg = (id, stops, cx = 0.5, cy = 0.5, r = 0.5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('')}</radialGradient>`;
  const glowBlade = (x1, y1, x2, y2, col, w = 2.2) => `${L(x1, y1, x2, y2, col, w * 4.5, 'opacity=".18"')}${L(x1, y1, x2, y2, col, w * 2.2, 'opacity=".45"')}${L(x1, y1, x2, y2, col, w * 1.3)}${L(x1, y1, x2, y2, '#fff', w * 0.55)}`;

  // =====================================================================
  // Art: the game's own portraits, with each card's twist added on top
  // =====================================================================
  const SC = root.ArtX.SCENES;
  const base = (id) => root.Art.unitArt({ id, kind: 'character' }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');

  // Vader, the Rogue One hallway: the same Vader, in a blood-red corridor with
  // a jammed blast door burning orange behind him and rebels trapped in it.
  // His blade lights him red from the right, an emergency strip blue from the left.
  const vaderArt = () => {
    const u = `hv${++seq}`;
    const wallRibs = [0.22, 0.48, 0.74].map((t) => L((t * 34).toFixed(1), (t * 26).toFixed(1), (t * 34).toFixed(1), (100 - t * 30).toFixed(1), '#a8203a', 1.4, 'opacity=".75"') + L((100 - t * 34).toFixed(1), (t * 26).toFixed(1), (100 - t * 34).toFixed(1), (100 - t * 30).toFixed(1), '#7a1428', 1.4, 'opacity=".75"')).join('');
    const lights = [0.22, 0.48, 0.74].map((t) => R((t * 34 + 1).toFixed(1), (t * 26 + 8).toFixed(1), (3 * (1 - t * 0.6)).toFixed(1), (6 * (1 - t * 0.6)).toFixed(1), '#ff5a3a') + C((t * 34 + 2).toFixed(1), (t * 26 + 11).toFixed(1), (6 * (1 - t * 0.5)).toFixed(1), '#ff3a2a', 'opacity=".3"') + R((100 - t * 34 - 4).toFixed(1), (t * 26 + 8).toFixed(1), (3 * (1 - t * 0.6)).toFixed(1), (6 * (1 - t * 0.6)).toFixed(1), '#ff5a3a') + C((100 - t * 34 - 3).toFixed(1), (t * 26 + 11).toFixed(1), (6 * (1 - t * 0.5)).toFixed(1), '#ff3a2a', 'opacity=".3"')).join('');
    const rebel = (x) => P(`M${x - 1.6} 58 C${x - 1.6} 55.6 ${x + 1.6} 55.6 ${x + 1.6} 58 L${x + 3} 60 L${x + 2.4} 70 L${x - 2.4} 70 L${x - 3} 60Z`, '#14040a');
    const defs = `<defs>${lg(`${u}lw`, [[0, '#8a1428'], [1, '#2a0610']], 0, 0, 1, 0.4)}${lg(`${u}rw`, [[0, '#2a0610'], [1, '#6a0e20']], 0, 0.4, 1, 0)}${lg(`${u}cl`, [[0, '#3a0816'], [1, '#14030a']])}${lg(`${u}fl`, [[0, '#2a0610'], [1, '#7a1424']])}${rg(`${u}dr`, [[0, '#fff2c0'], [0.35, '#ffa040'], [1, '#c8301a']], 0.5, 0.7, 0.7)}${rg(`${u}gl`, [[0, '#ff2a3a', 0.55], [0.5, '#ff1a2a', 0.22], [1, '#ff1a2a', 0]], 0.5, 0.5, 0.5)}${lg(`${u}bm`, [[0, '#ffb060', 0.35], [1, '#ffb060', 0]])}</defs>`;
    const bg = defs + R(0, 0, 100, 100, '#14030a')
      + P('M0 0 L34 26 L34 70 L0 100Z', `url(#${u}lw)`) + P('M100 0 L66 26 L66 70 L100 100Z', `url(#${u}rw)`)
      + P('M0 0 L100 0 L66 26 L34 26Z', `url(#${u}cl)`) + P('M0 100 L34 70 L66 70 L100 100Z', `url(#${u}fl)`)
      + R(34, 26, 32, 44, `url(#${u}dr)`)
      + P('M36 26 L64 26 L64 36 L36 36Z', '#2a1418') + P('M36 36 L42 34 L48 37 L54 34 L60 37 L64 35 L64 36 L36 36Z', '#fff2c0', 'opacity=".9"')
      + rebel(44) + rebel(56)
      + P('M34 70 L66 70 L84 100 L16 100Z', `url(#${u}bm)`)
      + wallRibs + lights
      + [0.15, 0.4, 0.65].map((t) => R(50 - 30 * (1 - t), 26 * t - 1, 60 * (1 - t), 1.2, '#ff9a7a', `opacity="${(0.55 - t * 0.4).toFixed(2)}"`)).join('')
      + P('M58 100 L80 76 L84 78 L66 100Z', '#ff3a2a', 'opacity=".25"')
      + C(78, 60, 46, `url(#${u}gl)`);
    const rim = P('M50 15.5 C60 15.5 70.5 24 70.5 46 L77 67', 'none', 'stroke="#ff4a3a" stroke-width="1.6"')
      + P('M50 15.5 C40 15.5 29.5 24 29.5 46 L23 67', 'none', 'stroke="#5ac8ff" stroke-width="1.1" opacity=".85"')
      + P('M66 74 C80 76 92 84 96 100', 'none', 'stroke="#ff4a3a" stroke-width="1.2" opacity=".8"')
      + P('M34 74 C20 76 8 84 4 100', 'none', 'stroke="#5ac8ff" stroke-width=".9" opacity=".6"')
      + P('M53 37.5 L62.5 37.5 L61.5 45.5 L54 45.5Z', '#ff3a2a', 'opacity=".55"') + P('M37.5 37.5 L47 37.5 L46 45.5 L38.5 45.5Z', '#5ac8ff', 'opacity=".25"');
    return bg + base('vader').replace(SC.deathstar(), '') + rim;
  };

  // The Imperial Star Destroyer, rebuilt with the same lit-model look: the
  // dagger hull with its dorsal ridge, the stepped superstructure, the bridge
  // tower and shield domes, three main engines and four small ones.
  const isdArt = () => {
    const P3 = root.P3; const f = P3.f;
    const S = P3.scene({ yaw: 90, pitch: 66, light: [0.35, -0.45, 0.8] });
    const quad = (pr, pts, fill, extra) => `<path d="M${pts.map((p) => { const q = pr(p); return `${f(q[0])} ${f(q[1])}`; }).join(' L')}Z" fill="${fill}" ${extra || ''}/>`;
    const NOSE = 50; const AFT = -46; const W = 30; const H = 5;
    const wAt = (x) => 0.6 + ((NOSE - x) / (NOSE - AFT)) * (W - 0.6);
    const hAt = (x) => 0.4 + ((NOSE - x) / (NOSE - AFT)) * (H - 0.4);
    const sec = (w, h) => [[w, 0], [0, h], [-w, 0], [-w * 0.4, -h * 0.6], [w * 0.4, -h * 0.6]];
    S.loft([[NOSE, sec(0.6, 0.4)], [AFT, sec(W, H)], [AFT - 4, sec(W * 0.96, H * 0.95)]], '#c4cad2', { edgeOp: 0.4 });
    S.at([0, 0, 0], (q, sc, pr) => {
      let m = ''; let s = 31;
      const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
      m += `<path d="M${f(pr([NOSE - 2, 0, 0.5])[0])} ${f(pr([NOSE - 2, 0, 0.5])[1])} L${f(pr([AFT + 2, 0, H])[0])} ${f(pr([AFT + 2, 0, H])[1])}" stroke="#4a525c" stroke-width="${f(0.5 * sc)}"/>`;
      for (const t of [0.35, 0.65]) for (const side of [-1, 1]) m += `<path d="M${f(pr([NOSE - 6, side * wAt(NOSE - 6) * t, hAt(NOSE - 6) * (1 - t)])[0])} ${f(pr([NOSE - 6, side * wAt(NOSE - 6) * t, hAt(NOSE - 6) * (1 - t)])[1])} L${f(pr([AFT + 2, side * wAt(AFT + 2) * t, hAt(AFT + 2) * (1 - t)])[0])} ${f(pr([AFT + 2, side * wAt(AFT + 2) * t, hAt(AFT + 2) * (1 - t)])[1])}" stroke="#7a828e" stroke-width="${f(0.25 * sc)}" opacity=".8"/>`;
      for (let k = 0; k < 110; k++) {
        const x = NOSE - 6 - rnd() * (NOSE - AFT - 8); const side = rnd() < 0.5 ? -1 : 1;
        const t = 0.08 + rnd() * 0.85; const w = wAt(x); const y = side * w * t; const z = hAt(x) * (1 - t) + 0.03;
        const lx = 0.8 + rnd() * 2.6; const ly = 0.4 + rnd() * 1.8;
        m += quad(pr, [[x, y, z], [x - lx, y, z], [x - lx, y + side * ly, z - ly * hAt(x) / w], [x, y + side * ly, z - ly * hAt(x) / w]], rnd() < 0.5 ? '#8a929e' : '#e8ecf0', 'opacity=".75"');
      }
      return m;
    }, { z: -1e3 });
    S.box([AFT + 1, AFT + 30, -11, 11, H - 1, H + 2.6], '#b4bcc6', { z: -1e3 - 1 });
    S.box([AFT + 1, AFT + 20, -8, 8, H + 2.6, H + 5.4], '#a8b0ba', { z: -1e3 - 2 });
    S.box([AFT + 1, AFT + 12, -5, 5, H + 5.4, H + 8], '#9aa2ae', { z: -1e3 - 3 });
    S.box([AFT + 4, AFT + 8, -2, 2, H + 8, H + 12], '#8a929e', { z: -1e3 - 4 });
    S.box([AFT + 4.5, AFT + 7.5, -9, 9, H + 12, H + 13.6], '#c8ced6', { z: -1e3 - 5 });
    S.at([AFT + 6, 0, H + 14], (q, sc, pr) => [-7, 7].map((y) => { const c = pr([AFT + 6, y, H + 14.4]); return `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(1.5 * sc)}" fill="#e8ecf0" stroke="#4a525c" stroke-width=".4"/>`; }).join('') + (() => { const a = pr([AFT + 7.6, -8, H + 13]); const b = pr([AFT + 7.6, 8, H + 13]); return `<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="#2a3038" stroke-width="${f(0.5 * sc)}"/>`; })(), { z: -1e3 - 6 });
    S.at([AFT - 4, 0, 0], (q, sc, pr) => [[-12, 1.6], [0, 2.4], [12, 1.6], [-20, 0.9], [-6, 0.9], [6, 0.9], [20, 0.9]].map(([y, r]) => { const c = pr([AFT - 4.4, y, H * 0.3]); return `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r * sc)}" fill="#cfefff" style="filter:drop-shadow(0 0 2.4px #4ab8ff)"/>`; }).join(''), { z: -1e3 - 7 });
    return S.render([6, 4, 94, 96]);
  };

  // =====================================================================
  // Cards
  // =====================================================================
  const CARDS = [
    { id: 'hn_vader_hallway', name: 'Darth Vader \u00b7 The Hallway', kind: 'character', faction: 'dark', rarity: 'mythic', role: 'attacker', spd: 152, traits: ['empire'], home: 'scarif', accent: '#ff2a1a',
      hallway: true, art: vaderArt,
      sig: { move: 'hallway', prop: 'saber', impact: 'slice', color: '#ff2a1a' },
      bio: 'The corridor goes dark, a lightsaber ignites, and there is nowhere left to run. Passive, No Escape: deals 12% more damage for every enemy that has fallen this battle.',
      abilities: [ab('Relentless Advance', 0, 'enemy', [dmg(1.15), tm(-15)], 'Strike one enemy and remove 15% Turn Meter.'), ab('Force Pin', 3, 'enemy', [dmg(1.7), debuff('stun', 1, 0.5), debuff('defDown', 2)], 'Pin one enemy to the wall: heavy damage, Defense Down, 50% chance to Stun.')],
      ultimate: ult('The Hallway', 'allEnemies', [dmg(1.9, 1, { execute: { below: 0.3, bonus: 1.6 } }), debuff('offDown', 2)], 'The lights die and a red blade ignites. Cut through every enemy, with bonus damage against any below 30% health, and inflict Offense Down.', 'There is no escape.'),
      how: 'Season reward: finish a season 1st on the leaderboard', reward: true },
  ];

  for (const c of CARDS) {
    root.Art.addArt(c.kind === 'ship' ? 'ship' : 'char', c.shape || c.id, c.art);
    if (D.UNIT_MAP[c.id]) continue;
    const def = { ...c, hn: true };
    delete def.how; delete def.art; delete def.future; delete def.reward;
    if (c.reward || c.future) def.rewardOnly = true;
    D.UNIT_MAP[c.id] = def;
    if (D.BIOS) D.BIOS[c.id] = c.bio;
    HN.HOW[c.id] = c.how;
    // Only the live reward shows in the Databank; the rest wait for their season.
    if (c.reward && !HN.HN_IDS.includes(c.id)) HN.HN_IDS.push(c.id);
  }
  // The regular Star Destroyer card gets the detailed model too.
  root.Art.addArt('ship', 'isd3', isdArt);
  if (D.UNIT_MAP.star_destroyer) D.UNIT_MAP.star_destroyer.shape = 'isd3';
  HN.SEASON_CARDS = { live: CARDS.filter((c) => c.reward).map((c) => c.id), future: CARDS.filter((c) => c.future).map((c) => c.id) };

  // =====================================================================
  // No Escape: Vader hits harder for every enemy already down.
  // =====================================================================
  const BP = root.Battle && root.Battle.prototype;
  if (BP && !BP.__hw) {
    BP.__hw = true;
    const baseEffect = BP.applyEffect;
    BP.applyEffect = function (source, target, eff, events) {
      if (eff && eff.type === 'damage' && source && source.def && source.def.hallway) {
        const fallen = this.units.filter((x) => x.side !== source.side && !x.alive).length;
        if (fallen) eff = { ...eff, mult: eff.mult * (1 + 0.12 * fallen) };
      }
      return baseEffect.call(this, source, target, eff, events);
    };
  }

  // =====================================================================
  // The Hallway ultimate
  // =====================================================================
  // The screen goes black. A red blade ignites in the middle of the dark and
  // lights Vader's mask. Then he cuts through every enemy in turn, each one
  // lit for an instant by the blade, which burns brighter with every strike.
  // Only opacity and transform animate, so it stays smooth on phones.
  if (B && !B.__hw) {
    B.__hw = true;
    const mask = `<svg viewBox="20 14 60 52" aria-hidden="true"><path d="M33 38 C33 18 67 18 67 38 L69 46 C70 50 74 54 76 58 L61 60 L50 64 L39 60 L24 58 C26 54 30 50 31 46Z" fill="#050508"/>
      <path d="M33 38 C33 18 67 18 67 38" stroke="#ff2a1a" stroke-width=".8" fill="none" opacity=".55"/><path d="M67 38 L69 46 C70 50 74 54 76 58 L61 60 M33 38 L31 46 C30 50 26 54 24 58 L39 60" stroke="#ff2a1a" stroke-width="1.2" fill="none"/><path d="M36 37 C40 35 46 35 49 37 L50 39 L51 37 C54 35 60 35 64 37 L63 39 L37 39Z" fill="#000"/>
      <path d="M39 40.6 L46.6 40.6 L47 42.2 L40 41.8Z M53.4 40.6 L61 40.6 L60 41.8 L53 42.2Z" fill="#ff3a2a"/><path d="M43 48 L57 48 L53 58 L47 58Z" fill="#0a0b10" stroke="#ff3a2a" stroke-width=".5"/></svg>`;
    B.mv_hallway = async function (S, actor, from, T, spec, hit) {
      const Snd = root.Sound;
      const play = (n) => { if (Snd) Snd.play(n); };
      const dark = el('<div class="hw-dark"></div>');
      const stage = el(`<div class="hw-stage"><div class="hw-mask">${mask}</div><div class="hw-blade"><i></i></div></div>`);
      S.layer.classList.add('hw-on');
      S.layer.appendChild(dark);
      S.layer.appendChild(stage);
      void dark.offsetWidth;
      dark.classList.add('on');
      await this.wait(650);
      play('ignite');
      stage.classList.add('lit');
      await this.wait(900);
      stage.classList.add('go');
      const blade = stage.querySelector('.hw-blade');
      let power = 1;
      for (const t of T) {
        const flash = el(`<i class="hw-cut" style="left:${t.x}px;top:${t.y}px"></i>`);
        S.layer.appendChild(flash);
        const a = -0.9 + Math.random() * 0.5;
        const r = 80 + power * 6;
        S.trail({ x: t.x - Math.cos(a) * r, y: t.y - Math.sin(a) * r }, { x: t.x + Math.cos(a) * r, y: t.y + Math.sin(a) * r }, spec.color, 0.9 + power * 0.12);
        play('saber');
        hit(t);
        power += 1;
        blade.style.setProperty('--p', power);
        setTimeout(() => flash.remove(), 520);
        await this.wait(280);
      }
      await this.wait(260);
      dark.classList.add('flicker');
      stage.classList.add('out');
      await this.wait(520);
      dark.classList.remove('on');
      await this.wait(320);
      setTimeout(() => { dark.remove(); stage.remove(); }, 400);
    };
    const css = `
.hw-on .sig-godrays, .hw-on .sig-cracks, .hw-on .sig-mote { display: none; }
.hw-dark { position: absolute; inset: 0; background: #000; opacity: 0; transition: opacity .55s ease-in; }
.hw-dark.on { opacity: .9; }
.hw-dark.flicker { animation: hw-flicker .5s steps(1) 1; }
@keyframes hw-flicker { 0% { opacity: .9; } 20% { opacity: .5; } 35% { opacity: .9; } 55% { opacity: .35; } 70% { opacity: .85; } 100% { opacity: .9; } }
.hw-stage { position: absolute; left: 50%; top: 46%; width: min(46vmin, 300px); height: min(46vmin, 300px); transform: translate(-50%, -50%); pointer-events: none; }
.hw-mask { position: absolute; inset: -6% 4% 18%; opacity: 0; transform: scale(.94); transition: opacity .7s ease-out, transform 1.2s ease-out; }
.hw-mask svg { width: 100%; height: 100%; display: block; }
.hw-stage.lit .hw-mask { opacity: .95; transform: scale(1); }
.hw-stage.go .hw-mask { opacity: .35; transition: opacity .4s; }
.hw-blade { --p: 1; position: absolute; left: 50%; bottom: 4%; width: 6px; height: 92%; transform: translateX(-50%) rotate(-24deg); transform-origin: 50% 100%; }
.hw-blade i { position: absolute; inset: 0; border-radius: 4px; background: #fff; box-shadow: 0 0 6px 3px #ff2a1a, 0 0 22px 8px rgba(255, 42, 26, .7), 0 0 60px 18px rgba(255, 30, 20, .35); transform: scaleY(0); transform-origin: 50% 100%; transition: transform .28s cubic-bezier(.2, .9, .3, 1.2); }
.hw-stage.lit .hw-blade i { transform: scaleY(1); }
.hw-stage.go .hw-blade i { transform: scaleY(1) scaleX(calc(1 + var(--p) * .12)); transition: transform .15s; }
.hw-stage.out { opacity: 0; transition: opacity .45s; }
.hw-cut { position: absolute; width: 180px; height: 180px; margin: -90px 0 0 -90px; border-radius: 50%; background: radial-gradient(circle, rgba(255, 90, 60, .75), rgba(255, 30, 20, .25) 45%, rgba(255, 0, 0, 0) 70%); animation: hw-cut .5s ease-out forwards; }
@keyframes hw-cut { from { opacity: 1; transform: scale(.5); } to { opacity: 0; transform: scale(1.3); } }
@media (prefers-reduced-motion: reduce) { .hw-dark.flicker { animation: none; } }
`;
    const st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  }
})(window);

// HoloNet v2 layout: your profile card heads the hub, every mode is its own
// area (Ground and Fleet Arena, Live Duels, Raid, Guild, Forge, Leaderboards,
// Databank, Leagues), and the leaderboards pay out at the end of each season.
// Until real players fill them, the season ladder is topped up with bots, and
// a bot holding a reward spot simply means nobody gets that reward.
(function (root) {
  'use strict';
  const D = root.GameData;
  const UI = root.UI;
  const App = UI.App;
  const HN = root.HN;
  const A = root.HNArt;
  const SO = HN.social;
  const Net = HN.Net;
  const { esc, fmt, toast, openModal } = UI;
  const S = HN.S;
  const V = HN.VIEWS;
  const CL = HN.clicks;
  const head = (...a) => HN.ui.head(...a);
  const go = (...a) => HN.ui.go(...a);
  const bes = (n) => HN.ui.bes(n);
  const sound = (n) => { if (root.Sound) root.Sound.play(n); };
  const art = (id) => root.Art.unitArt(D.UNIT_MAP[id]).replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" ');
  const myName = () => Net.name(Net.me || 'me').replace(' (you)', '');

  // =====================================================================
  // Season leaderboard: ranks by best rating this season
  // =====================================================================
  const SEASON_MS = 4 * 7 * 24 * 3600 * 1000;
  const seasonFrac = () => Math.max(0, Math.min(1, 1 - SO.seasonEnds() / SEASON_MS));
  const LB_REWARD = [
    { from: 1, to: 1, label: '1st', beskar: 3000, puck: 'legend', frame: 'champion', card: 'hn_vader_hallway' },
    { from: 2, to: 3, label: '2nd–3rd', beskar: 2000, puck: 'legend', frame: 'podium' },
    { from: 4, to: 10, label: '4th–10th', beskar: 1200, puck: 'high' },
    { from: 11, to: 25, label: '11th–25th', beskar: 600, puck: 'elite' },
  ];
  const rewardFor = (rank) => LB_REWARD.find((r) => rank >= r.from && rank <= r.to) || null;
  const rewardText = (r) => `${r.card && D.UNIT_MAP[r.card] ? `${D.UNIT_MAP[r.card].name} · ` : ''}${fmt(r.beskar)} Beskar · ${A.TIER[r.puck].label} puck${r.frame ? ` · ${SO.FRAMES[r.frame].name} frame` : ''}`;
  // 25 bots per season, climbing as the season goes on.
  function bots(season, frac) {
    const r = HN.rng(season * 977 + 31);
    const names = HN.BOT_NAMES.slice().sort(() => r() - 0.5).slice(0, 25);
    return names.map((name, i) => {
      const peak = 2380 - i * 52 + Math.round((r() - 0.5) * 30);
      return { bot: true, name, best: Math.round(900 + (peak - 900) * (0.55 + 0.45 * frac)), dw: Math.max(0, Math.round((58 - i * 2.2) * (0.25 + 0.75 * frac))) };
    });
  }
  const mySeasonBest = () => { const h = SO.P2(); return Math.max(h.soc.sBest || 0, h.rating); };
  function seasonRows() {
    const sn = SO.seasonNo();
    const rows = Net.arena.filter((a) => a.uid !== Net.me && typeof a.ss === 'number' && Math.floor(a.ss / 1e5) === sn).map((a) => ({ uid: a.uid, best: a.ss % 1e5 }));
    rows.push({ uid: Net.me || 'me', me: true, best: mySeasonBest() });
    rows.push(...bots(sn, seasonFrac()));
    return rows.sort((a, b) => b.best - a.best);
  }

  // Pay last season's leaderboard spot once, when the new season starts.
  let paying = false;
  async function checkLeaderboardSeason() {
    const h = SO.P2();
    const sn = SO.seasonNo();
    if (!h.lb) { h.lb = { season: sn, best: mySeasonBest() }; HN.save(); return; }
    if (h.lb.season === sn) { const b = mySeasonBest(); if (b > h.lb.best) { h.lb.best = b; HN.save(); } return; }
    if (paying || document.querySelector('.modal-backdrop') || App.battleActive) return;
    paying = true;
    const prev = h.lb;
    let others = [];
    if (Net.ready) {
      try {
        const snap = await Net.db.collection('arena').orderBy('ss', 'desc').limit(50).get();
        others = snap.docs.map((d) => ({ uid: d.id, ...(d.data() || {}) })).filter((a) => a.uid !== Net.me && typeof a.ss === 'number' && Math.floor(a.ss / 1e5) === prev.season).map((a) => a.ss % 1e5);
      } catch (e) { /* offline: rank against the bots only */ }
    }
    const ladder = [...others, ...bots(prev.season, 1).map((b) => b.best)];
    const rank = 1 + ladder.filter((v) => v > prev.best).length;
    h.lb = { season: sn, best: mySeasonBest() };
    const rw = rewardFor(rank);
    if (rw) {
      h.beskar += rw.beskar;
      h.freePucks = (h.freePucks || []).concat(rw.puck);
      if (rw.frame && !(h.soc.frames || []).includes(rw.frame)) h.soc.frames = [...(h.soc.frames || []), rw.frame];
    }
    const card = rw && rw.card ? HN.grant(rw.card) : null;
    HN.save(); Net.publish();
    paying = false;
    const m = openModal(`<div class="hn-result"><div class="result-title ${rw ? 'win' : ''}">SEASON ${prev.season % 100} LEADERBOARD</div>
      <p style="text-align:center;margin:4px 0">You finished <b>#${rank}</b> with a season best of <b>${fmt(prev.best)}</b>.</p>
      ${rw ? `<p style="text-align:center;margin:0" class="muted">${esc(rewardText(rw))}${rw.puck ? ' (open it in the Forge)' : ''}</p>` : '<p style="text-align:center;margin:0" class="muted">The top 25 earn rewards. There\'s always next season.</p>'}
      <div class="modal-actions"><button type="button" class="btn btn-primary" data-x>${rw ? 'Collect' : 'OK'}</button></div></div>`, { small: true });
    if (rw) sound('reveal_legendary');
    m.root.addEventListener('click', async (e) => {
      if (!e.target.closest('[data-x]')) return;
      m.close();
      if (card && card.isNew) await UI.walkout(D.UNIT_MAP[rw.card], D.UNIT_MAP[rw.card].rarity, false, { exclusive: true, isNew: true, shards: 0 });
      else if (card) toast(`${D.UNIT_MAP[rw.card].name} +${card.shards} shards`);
      SO.rerender();
    });
  }

  // =====================================================================
  // Hub
  // =====================================================================
  const meCard = () => {
    const h = S();
    const me = SO.prof();
    const d = HN.divOf(h.rating);
    const gid = SO.myGuildId();
    const g = gid && SO.guildOf(gid);
    return `<button type="button" class="hv-me" data-hn="prof" data-uid="me" style="--gc:${g ? g.color : '#5fd8ff'}">
      ${SO.avatar(me, 'md')}
      <span class="id"><small>HOLONET PROFILE</small><b>${esc(myName())}</b><em>${g ? `[${esc(g.tag)}] ${esc(g.name)}` : 'No guild yet'} · Level ${Player.state.account.level}</em></span>
      <span class="lg">${A.badge(d.league, d.div)}<span><b>${fmt(h.rating)}</b><small>${esc(d.name)}</small></span></span>
      <span class="wal">${bes(h.beskar)}</span>
    </button>`;
  };
  V.hub = () => {
    const h = S();
    const t = HN.raidTotals();
    const r = HN.raidNow();
    const free = (h.freePucks || []).length;
    const gid = SO.myGuildId();
    const g = gid && SO.guildOf(gid);
    const gt = g && SO.graidTotals(gid);
    const duel = HN.Duel;
    return `${meCard()}
      <h3 class="hv-h">Battle</h3>
      <div class="hn-tiles">
        <button type="button" class="hn-tile" data-hn="arena" data-kind="character"><div class="bg">${art('hn_pre_vizsla')}</div><em>Ranked · 5 vs 5</em><b>Ground Arena</b><span>Your ground squad against other players' defense squads.</span></button>
        <button type="button" class="hn-tile" data-hn="arena" data-kind="ship"><div class="bg">${art('hn_fang')}</div><em>Ranked · 5 vs 5</em><b>Fleet Arena</b><span>Your fleet against theirs, fighter for fighter.</span></button>
        <button type="button" class="hn-tile ${duel && duel.invites() ? 'dot' : ''}" data-hn="duels"><div class="bg">${art('hn_paz')}</div><em>Live · player vs player</em><b>Live Duels</b><span>${duel ? esc(duel.status()) : 'Challenge a player who\'s online right now.'}</span></button>
      </div>
      <h3 class="hv-h">Together</h3>
      <div class="hn-tiles">
        <button type="button" class="hn-tile" data-hn="raid" style="border-color:${r.color}"><div class="bg">${art(r.id)}</div><em>Community raid · ${t.fallen ? 'DEFEATED' : `${Math.round((t.left / t.pool) * 100)}% health left`}</em><b>${esc(r.name)}</b><span>Everyone in the HoloNet chips away at this week's boss.</span></button>
        <button type="button" class="hn-tile hv-guild ${g && gt.fallen && !SO.P2().soc.gr.claimed ? 'dot' : ''}" data-hn="guild" style="--gc:${g ? g.color : '#5fd8ff'}"><div class="bg">${g ? `<div class="hv-gemb">${SO.emblem(g, 120)}</div>` : art('bo_katan')}</div><em>${g ? `Guild · level ${SO.guildLevel(gid).lv} · ${SO.membersOf(gid).length} members` : 'Guilds'}</em><b>${g ? esc(g.name) : 'Join a Guild'}</b><span>${g ? (gt.fallen ? 'Guild raid beaten!' : `Guild raid: ${esc(SO.graidNow().name)}`) : 'Guild chat, guild raids and weekly rewards.'}</span></button>
      </div>
      <h3 class="hv-h">More</h3>
      <div class="hn-mini-tiles">
        <button type="button" class="hn-mini ${free ? 'dot' : ''}" data-hn="forge"><b>Varka's Forge</b><small>${free ? `${free} bounty puck${free > 1 ? 's' : ''} waiting` : 'Bounty pucks and shards'}</small></button>
        <button type="button" class="hn-mini" data-hn="leaders"><b>Leaderboards</b><small>Season ladder, duels, raid and guilds</small></button>
        ${root.Update21 && root.Update21.on() ? '<button type="button" class="hn-mini" data-hn="findpilot"><b>Find a pilot</b><small>Look up anyone by callsign</small></button>' : ''}
        <button type="button" class="hn-mini" data-hn="databank"><b>Databank</b><small>${HN.HN_IDS.filter(HN.owns).length}/${HN.HN_IDS.length} cards · ${Object.keys(h.captured).length} bounties</small></button>
        <button type="button" class="hn-mini" data-hn="leagues"><b>Leagues &amp; Season</b><small>Season ${SO.seasonNo() % 100} · ${Math.max(0, Math.ceil(SO.seasonEnds() / 86400000))} days left</small></button>
      </div>`;
  };

  // =====================================================================
  // Leaderboards
  // =====================================================================
  let lbTab = 'season';
  const rowOf = (x, i, right) => {
    const me = x.me || x.uid === Net.me;
    const who = x.bot ? `<span class="hv-bot"><span class="pf-av sm"><span class="pic hv-botpic">${x.name.slice(0, 1).toUpperCase()}</span></span><span class="nm"><b>${esc(x.name)}</b></span></span>` : SO.chip(me ? 'me' : x.uid);
    return `<div class="g-row ${me ? 'me' : ''}"><span class="rk">${i + 1}</span>${who}<span class="r">${right}</span></div>`;
  };
  V.leaders = () => {
    const tabs = [['season', 'Season'], ['duels', 'Duel wins'], ['raid', 'Raid damage'], ['guilds', 'Guilds']];
    let body = '';
    if (lbTab === 'season') {
      const rows = seasonRows();
      const mine = rows.findIndex((x) => x.me);
      const shown = rows.slice(0, 25);
      body = `<div class="hn-sec"><h3>Season ${SO.seasonNo() % 100} rewards · ${Math.max(0, Math.ceil(SO.seasonEnds() / 86400000))} days left</h3>
          <div class="hv-rw">${LB_REWARD.map((r) => `<div><b>${r.label}</b><small>${esc(rewardText(r))}</small></div>`).join('')}</div>
          <p class="muted small" style="margin:0">Ranked by your best rating this season. Rewards are paid when the season ends.</p></div>
        <div class="g-list">${shown.map((x, i) => { const d = HN.divOf(x.best); return rowOf(x, i, `${A.badge(d.league, d.div)}<b>${fmt(x.best)}</b><small>${esc(d.name)}</small>`); }).join('')}</div>
        ${mine >= 25 ? `<div class="g-list" style="margin-top:6px">${rowOf(rows[mine], mine, `<b>${fmt(rows[mine].best)}</b>`)}</div>` : ''}`;
    } else if (lbTab === 'duels') {
      const st = SO.prof().st || {};
      const rows = Net.arena.filter((a) => a.uid !== Net.me && (a.dw || 0) > 0).map((a) => ({ uid: a.uid, dw: a.dw }));
      rows.push({ uid: Net.me || 'me', me: true, dw: st.dw || 0 });
      rows.push(...bots(SO.seasonNo(), seasonFrac()).map((b) => ({ ...b })));
      rows.sort((a, b) => b.dw - a.dw);
      body = `<p class="muted small" style="margin:0">Most Live Duel wins.</p><div class="g-list">${rows.slice(0, 25).map((x, i) => rowOf(x, i, `<b>${fmt(x.dw)}</b><small>wins</small>`)).join('')}</div>`;
    } else if (lbTab === 'raid') {
      const t = HN.raidTotals();
      body = `<p class="muted small" style="margin:0">Damage on ${esc(HN.raidNow().name)} this week.</p>${t.rows.length ? `<div class="g-list">${t.rows.slice(0, 25).map((x, i) => rowOf({ uid: x.uid === 'me' ? 'me' : x.uid, me: x.uid === Net.me || x.uid === 'me' }, i, `<b>${fmt(x.dmg)}</b><small>damage</small>`)).join('')}</div>` : '<div class="hn-free"><span class="grow">No damage yet this week. Be the first to hit the boss.</span></div>'}`;
    } else {
      const list = SO.G.guilds.slice().sort((a, b) => (b.xp || 0) - (a.xp || 0));
      body = `<p class="muted small" style="margin:0">Guilds by guild XP.</p>${list.length ? `<div class="g-list">${list.slice(0, 25).map((g, i) => `<div class="g-row ${g.id === SO.myGuildId() ? 'me' : ''}"><span class="rk">${i + 1}</span>${SO.emblem(g, 36)}<span class="nm"><b style="color:${g.color}">[${esc(g.tag)}] ${esc(g.name)}</b><small>${fmt(g.n || 1)} member${(g.n || 1) === 1 ? '' : 's'}</small></span><span class="r"><b>${fmt(g.xp || 0)}</b><small>XP</small></span></div>`).join('')}</div>` : '<div class="hn-free"><span class="grow">No guilds yet. Found the first one!</span></div>'}`;
    }
    return `${head('LEADERBOARDS', 'Tap a name to see their profile.', true)}
      ${root.Update21 && root.Update21.on() ? '<button type="button" class="hn-btn ghost hv-find" data-hn="findpilot">Find a pilot by callsign ›</button>' : ''}
      <div class="hn-seg hv-tabs" role="tablist">${tabs.map(([k, n]) => `<button type="button" class="${lbTab === k ? 'on' : ''}" data-hn="lbtab" data-k="${k}">${n}</button>`).join('')}</div>
      ${body}`;
  };
  CL.lbtab = (b, render) => { lbTab = b.dataset.k; if (lbTab === 'guilds') SO.loadGuilds(); if (lbTab === 'duels') Net.want('duels'); render(); };

  // =====================================================================
  // Databank: HoloNet cards and captured bounties in one place
  // =====================================================================
  let dbTab = 'cards';
  V.databank = (p) => {
    if (p && p.tab) dbTab = p.tab;
    return `${head('DATABANK', dbTab === 'cards' ? 'Arena-only cards. They never appear in crates or the Black Market.' : 'Every target you bring in is logged here. Finish a row for Beskar.', true)}
      <div class="hn-seg" role="tablist"><button type="button" class="${dbTab === 'cards' ? 'on' : ''}" data-hn="dbtab" data-k="cards">HoloNet cards</button><button type="button" class="${dbTab === 'bounties' ? 'on' : ''}" data-hn="dbtab" data-k="bounties">Bounties</button></div>
      ${dbTab === 'cards' ? V.vaultBody() : V.capturedBody()}`;
  };
  CL.dbtab = (b, render) => { dbTab = b.dataset.k; render(); };
  CL.databank = () => go('databank');
  CL.vault = () => go('databank', { tab: 'cards' });
  CL.captured = () => go('databank', { tab: 'bounties' });

  // =====================================================================
  // Guild: the founder can change the picture, colour and motto
  // =====================================================================
  // The Beskar Vault: members donate Beskar; the leader and co-leader spend
  // it on upgrades and on changing the guild picture.
  const bankSection = (gid) => {
    const lead = SO.canManage(gid);
    const glv = SO.guildLevel(gid).lv;
    const bank = SO.bankOf(gid);
    const dons = Object.entries(SO.donors(gid)).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const perk = (k) => {
      const P = SO.PERKS[k];
      const lv = SO.perkLevel(gid, k);
      const cost = SO.PERK_COST[lv];
      const needs = SO.PERK_NEEDS[lv];
      const locked = lv < 3 && glv < needs;
      const ok = !locked && bank >= cost;
      return `<div class="g-m ${lv ? 'ok' : ''}"><b>${esc(P.name)} <small>Lv ${lv}/3</small></b><small>${lv ? esc(P.desc(P.vals[lv])) : 'Not built yet'}${lv < 3 ? ` · next: ${esc(P.desc(P.vals[lv + 1]))}` : ''}</small>
        ${lv >= 3 ? '<button type="button" class="hn-btn ghost" disabled>Maxed</button>' : locked ? `<span class="muted small">Needs guild level ${needs}</span>` : lead ? `<button type="button" class="hn-btn ${ok ? 'gold' : 'ghost'}" data-hn="gperk" data-k="${k}" ${ok ? '' : 'disabled'}>Upgrade · ${bes(cost)}</button>` : `<span class="muted small">${bes(cost)} · the leader or co-leader upgrades</span>`}</div>`;
    };
    return `<div class="hn-sec"><h3>Beskar Vault · ${bes(bank)}</h3>
      <p class="muted small" style="margin:0">Donate Beskar to power up the whole guild. The leader and co-leader spend the Vault on upgrades and on changing the guild picture (${fmt(SO.PIC_COST)} Beskar).</p>
      <div class="hv-don">${[100, 500, 1000].map((n) => `<button type="button" class="hn-btn" data-hn="gdon" data-n="${n}" ${S().beskar >= n ? '' : 'disabled'}>Donate ${bes(n)}</button>`).join('')}</div>
      ${dons.length ? `<div class="hn-board">${dons.map(([uid, n], i) => `<div class="${uid === Net.me ? 'me' : ''}"><span>${i + 1}. ${esc(Net.name(uid))}</span><b>${fmt(n)}</b></div>`).join('')}</div>` : ''}
      <h3 style="margin-top:6px">Guild upgrades</h3><div class="g-ms">${Object.keys(SO.PERKS).map(perk).join('')}</div></div>`;
  };
  // Announcement board for the guild Home tab.
  const annBoard = (gid) => {
    const anns = SO.announcements(gid);
    return `<div class="hn-sec hv-ann"><h3>Announcements</h3>
      ${anns.length ? anns.map((l) => `<div class="hv-annl"><b>${esc(Net.name(l.uid))} <small>${SO.ROLE_NAME[SO.roleOf(l.uid, gid)]} · ${SO.ago(l.ts)}</small></b><p>${esc(l.t)}</p></div>`).join('') : '<p class="muted small" style="margin:0">No announcements yet.</p>'}
      ${SO.canAnnounce(Net.me, gid) ? '<form class="g-ann" data-noswipe><input class="pf-in" data-annin maxlength="140" placeholder="Post an announcement to the whole guild…" autocomplete="off"><button type="submit" class="hn-btn gold">Post</button></form>' : ''}</div>`;
  };
  CL.gdon = async (b, render) => {
    const gid = SO.myGuildId();
    const n = +b.dataset.n;
    if (!gid || S().beskar < n) return;
    if (n >= 500 && !(await UI.confirmBox('Donate to the Vault?', `Give ${fmt(n)} of your Beskar to the guild's Beskar Vault. Donations can't be taken back.`, `Donate ${fmt(n)}`))) return;
    const h = SO.P2();
    const d = h.soc.don && h.soc.don.g === gid ? h.soc.don : { g: gid, a: 0 };
    d.a += n;
    h.soc.don = d;
    h.beskar -= n;
    SO.addGP(Math.round(n / 50));
    HN.save(); Net.publish();
    sound('coins');
    toast(`Donated ${fmt(n)} Beskar to the Beskar Vault.`);
    setTimeout(() => SO.pushGuildStats(), 300);
    render();
  };
  // Leader spends from the bank (only the leader can write the guild doc).
  async function spend(gid, cost, change, what) {
    const raw = SO.gmap.get(gid);
    if (!raw || !SO.canManage(gid)) return false;
    if (SO.bankOf(gid) < cost) { toast('Not enough Beskar in the Beskar Vault.'); return false; }
    if (cost && !(await UI.confirmBox('Spend from the Beskar Vault?', `${what || 'This'} costs ${fmt(cost)} Beskar from the Vault (it has ${fmt(SO.bankOf(gid))}).`, `Spend ${fmt(cost)}`))) return false;
    const ok = await SO.writeGuild(gid, { ...change, dons: SO.donors(gid), spent: (raw.spent | 0) + cost });
    if (!ok) toast('Could not save. Try again.');
    return ok;
  }
  CL.annperm = async (b, render) => {
    const gid = SO.myGuildId();
    if (!gid || !SO.canManage(gid)) return;
    const raw = SO.gmap.get(gid) || {};
    const perm = { co: true, elder: false, ...(raw.annPerm || {}) };
    perm[b.dataset.k] = !perm[b.dataset.k];
    if (await spend(gid, 0, { annPerm: perm })) render();
  };
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('.g-ann');
    if (!f) return;
    e.preventDefault();
    const inp = f.querySelector('[data-annin]');
    const t = inp.value;
    inp.value = '';
    SO.sayLine(t, false, true).then(() => setTimeout(() => SO.rerender(), 300));
  });
  // A short-lived bar with an Undo button (used after removing a member).
  function undoBar(text, undo) {
    const old = document.querySelector('.hv-undo'); if (old) old.remove();
    const bar = document.createElement('div');
    bar.className = 'hv-undo';
    bar.innerHTML = `<span>${esc(text)}</span><button type="button" class="hn-btn gold">Undo</button><i></i>`;
    document.body.appendChild(bar);
    const t = setTimeout(() => bar.remove(), 8000);
    bar.querySelector('button').addEventListener('click', () => { clearTimeout(t); bar.remove(); undo(); });
  }
  CL.gmanage = (b) => {
    const gid = SO.myGuildId();
    const uid = b.dataset.uid;
    if (!gid || !SO.canManage(gid)) return;
    const raw = SO.gmap.get(gid) || {};
    const me = SO.roleOf(Net.me, gid);
    const role = SO.roleOf(uid, gid);
    const elders = raw.elders || [];
    const acts = [];
    if (role === 'member' && elders.length < SO.MAX_ELDERS) acts.push(['elder', 'Promote to Elder']);
    if (role === 'elder') acts.push(['member', 'Demote to Member']);
    if (me === 'leader' && role !== 'co') acts.push(['co', raw.co ? 'Make Co-leader (replaces the current one)' : 'Make Co-leader']);
    if (me === 'leader' && role === 'co') acts.push(['unco', 'Remove as Co-leader']);
    if (me === 'leader') acts.push(['lead', 'Make leader (you become co-leader)']);
    acts.push(['kick', 'Remove from guild']);
    const m = openModal(`<div class="hn-result"><h3 style="margin:0 0 6px">${esc(Net.name(uid))} · ${SO.ROLE_NAME[role]}</h3>
      <p class="muted small" style="margin:0 0 10px">Elders: ${elders.length}/${SO.MAX_ELDERS}</p>
      <div style="display:grid;gap:8px">${acts.map(([k, n]) => `<button type="button" class="btn ${k === 'kick' ? 'danger' : ''}" data-act="${k}">${esc(n)}</button>`).join('')}<button type="button" class="btn" data-act="x">Cancel</button></div></div>`, { small: true });
    m.root.addEventListener('click', async (e) => {
      const a = e.target.closest('[data-act]');
      if (!a) return;
      m.close();
      const k = a.dataset.act;
      if (k === 'x') return;
      if (k === 'kick' && !(await UI.confirmBox('Remove from guild?', `${Net.name(uid)} will be removed from the guild. You'll have a few seconds to undo it.`, 'Remove'))) return;
      if (k === 'lead' && !(await UI.confirmBox(`Make ${Net.name(uid)} the leader?`, 'They get full control of the guild, including disbanding it. You become the co-leader. Only they can give it back.', 'Hand over'))) return;
      if (k === 'co' && raw.co && !(await UI.confirmBox('Replace the co-leader?', `${Net.name(raw.co)} goes back to being a member.`, 'Replace'))) return;
      const r = SO.gmap.get(gid) || {};
      const el = (r.elders || []).filter((x) => x !== uid);
      const change = { elders: el };
      if (k === 'elder') change.elders = [...el, uid].slice(0, SO.MAX_ELDERS);
      if (k === 'co') { change.co = uid; }
      if (k === 'unco' || (k === 'kick' && r.co === uid)) change.co = '';
      if (k === 'kick') change.kicked = [...new Set([...(r.kicked || []), uid])];
      if (k === 'lead') { change.lead = uid; change.co = Net.me; change.leadSeen = Date.now(); }
      if (!(await spend(gid, 0, change))) return;
      if (k === 'kick') undoBar(`${Net.name(uid)} was removed.`, async () => {
        const g2 = SO.gmap.get(gid) || {};
        if (await SO.writeGuild(gid, { kicked: (g2.kicked || []).filter((x) => x !== uid) })) { toast(`${Net.name(uid)} is back in the guild.`); SO.rerender(); }
      });
      else if (k === 'lead') { toast(`${Net.name(uid)} is now the leader.`); SO.sayLine(`handed leadership to ${Net.name(uid)}.`, true); }
      else toast('Ranks updated.');
      SO.rerender();
    });
  };
  CL.gperk = async (b, render) => {
    const gid = SO.myGuildId();
    const k = b.dataset.k;
    const lv = SO.perkLevel(gid, k);
    if (lv >= 3 || SO.guildLevel(gid).lv < SO.PERK_NEEDS[lv]) return;
    const raw = SO.gmap.get(gid) || {};
    if (await spend(gid, SO.PERK_COST[lv], { perks: { ...(raw.perks || {}), [k]: lv + 1 } }, `${SO.PERKS[k].name} level ${lv + 1}`)) { sound('rankup'); toast(`${SO.PERKS[k].name} is now level ${lv + 1}!`); render(); }
  };
  // Beskar Haul: arena wins pay a little more.
  const baseResult = HN.arenaResult;
  HN.arenaResult = function (opp, won) {
    const r = baseResult.apply(this, arguments);
    const pct = HN.guildPerk ? HN.guildPerk('haul') : 0;
    if (r && r.won && r.beskar && pct) { const extra = Math.round(r.beskar * pct); S().beskar += extra; r.beskar += extra; HN.save(); }
    const xp = HN.guildPerk ? HN.guildPerk('xp') : 0;
    if (r && xp) HN.xp(Math.max(1, Math.round((won ? 60 : 15) * xp)));
    return r;
  };
  CL.gedit = () => {
    const gid = SO.myGuildId();
    const g = gid && SO.gmap.get(gid);
    if (!g || !SO.canManage(gid)) return;
    let pic = g.pic || '';
    let emblemI = g.emblem | 0;
    let color = g.color;
    const body = () => `<div class="pf-edit"><h2 style="margin:0">Edit guild</h2>
      <div style="display:flex;gap:12px;align-items:center">${SO.emblem({ ...g, pic, emblem: emblemI, color }, 64)}<b style="color:${color}">[${esc(g.tag)}] ${esc(g.name)}</b></div>
      <label class="pf-lbl">Motto <small>up to 70 letters</small><input class="pf-in" data-motto maxlength="70" value="${esc(g.motto || '')}"></label>
      <h3 class="pf-h">Picture <small>changing it costs ${fmt(SO.PIC_COST)} Beskar from the Beskar Vault (Vault: ${fmt(SO.bankOf(gid))})</small></h3>${SO.pickerHtml(pic, color, emblemI)}
      <h3 class="pf-h">Colour</h3><div class="g-pick">${SO.COLORS.map((c) => `<button type="button" class="g-c ${c === color ? 'on' : ''}" data-gc2="${c}" style="background:${c}"></button>`).join('')}</div>
      <div class="modal-actions"><button type="button" class="btn" data-x="cancel">Cancel</button><button type="button" class="btn btn-primary" data-x="save">Save</button></div></div>`;
    const m = openModal(`<div data-body>${body()}</div>`, {});
    let motto = g.motto || '';
    const redraw = () => { m.root.querySelector('[data-body]').innerHTML = body(); };
    m.root.addEventListener('input', (e) => { if (e.target.matches('[data-motto]')) motto = e.target.value; });
    m.root.addEventListener('click', async (e) => {
      const gcat = e.target.closest('[data-gcat]'); if (gcat) { SO.setPickCat(gcat.dataset.gcat); return redraw(); }
      const gp = e.target.closest('[data-gp]'); if (gp) { pic = gp.dataset.gp; return redraw(); }
      const ge = e.target.closest('[data-ge]'); if (ge) { pic = ''; emblemI = +ge.dataset.ge; return redraw(); }
      const gc = e.target.closest('[data-gc2]'); if (gc) { color = gc.dataset.gc2; return redraw(); }
      const x = e.target.closest('[data-x]');
      if (!x) return;
      if (x.dataset.x === 'save') {
        const mo = SO.cleanText(motto, 70);
        if (!SO.SAFE.ok(mo)) return toast('Keep it friendly: pick a different motto.');
        const picChanged = (pic || '') !== (g.pic || '') || (!pic && emblemI !== (g.emblem | 0));
        const cost = picChanged ? SO.PIC_COST : 0;
        if (cost && SO.bankOf(gid) < cost) return toast(`A new guild picture costs ${fmt(cost)} Beskar from the Beskar Vault. The Vault has ${fmt(SO.bankOf(gid))}.`);
        if (!(await spend(gid, cost, { motto: mo, pic, emblem: emblemI, color }, 'A new guild picture'))) return;
        toast(cost ? `Guild updated. ${fmt(cost)} Beskar spent from the Vault.` : 'Guild updated.');
      }
      m.close();
      SO.rerender();
    });
  };

  // Season check whenever the HoloNet opens.
  const baseGo = App.go;
  App.go = function (screen, params, opts) {
    const r = baseGo.call(this, screen, params, opts);
    if (App.current === 'holonet') setTimeout(checkLeaderboardSeason, 400);
    return r;
  };
  // Tester shortcut: end the season for the leaderboard too.
  const baseEnd = HN.dev && HN.dev.endSeason;
  if (HN.dev) HN.dev.endSeason = () => { const h = SO.P2(); h.lb = { season: SO.seasonNo() - 1, best: mySeasonBest() }; HN.save(); if (baseEnd) baseEnd(); };

  HN.v2 = { seasonRows, bots, rewardFor, checkLeaderboardSeason, bankSection, annBoard, spend, undoBar };

  // =====================================================================
  // Styles
  // =====================================================================
  const css = `
.hv-me { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; grid-template-areas: "av id lg" "av id wal"; align-items: center; gap: 2px 12px; padding: 12px 14px; border-radius: 16px; border: 1px solid color-mix(in srgb, var(--gc) 55%, transparent); background: linear-gradient(135deg, rgba(10, 30, 46, 0.95), rgba(6, 12, 22, 0.95)); color: #e6f6ff; font: inherit; text-align: left; cursor: pointer; }
.hv-me > .pf-av { grid-area: av; }
.hv-me .id { grid-area: id; min-width: 0; display: grid; gap: 2px; }
.hv-me .id small { font: 700 10px/1 var(--font-display); letter-spacing: .16em; color: var(--gc); }
.hv-me .id b { font-family: var(--font-display); font-size: clamp(16px, 4.4vw, 22px); letter-spacing: .06em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hv-me .id em { font-style: normal; font-size: 12px; color: #9fc4d8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hv-me .lg { grid-area: lg; display: flex; align-items: center; gap: 6px; justify-self: end; }
.hv-me .lg > svg, .hv-me .lg > .hn-lbadge, .hv-me .lg > :first-child { width: 34px; height: 34px; flex: none; }
.hv-me .lg span { display: grid; text-align: right; } .hv-me .lg b { font-family: var(--font-display); font-size: 16px; } .hv-me .lg small { font-size: 11px; color: #9fc4d8; }
.hv-me .wal { grid-area: wal; justify-self: end; }
.hv-h { margin: 6px 2px -4px; font: 700 12px/1 var(--font-display); letter-spacing: .18em; color: #8fe8ff; text-transform: uppercase; }
.hv-guild .bg { display: grid; place-items: center; background: radial-gradient(circle at 70% 40%, color-mix(in srgb, var(--gc) 30%, transparent), transparent 60%), #071420; }
.hv-gemb { justify-self: end; margin-right: 8%; opacity: .9; }
.hn-tile.dot::after { content: ''; position: absolute; top: 10px; right: 10px; width: 10px; height: 10px; border-radius: 50%; background: #ff3a5a; box-shadow: 0 0 0 2px #071420; }
.hv-tabs { flex-wrap: wrap; }
.hv-rw { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr)); gap: 6px; }
.hv-rw div { padding: 8px 10px; border-radius: 10px; border: 1px solid rgba(255, 210, 63, 0.3); background: rgba(40, 30, 6, 0.4); display: grid; gap: 2px; }
.hv-rw b { color: #ffd23f; font-family: var(--font-display); letter-spacing: .06em; } .hv-rw small { color: #d8c89a; font-size: 11px; }
.hv-don { display: flex; gap: 8px; flex-wrap: wrap; }
.g-mng { padding: 4px 8px; font-size: 11px; }
.hv-ann { border-color: rgba(255, 210, 63, 0.35); }
.hv-annl { padding: 8px 10px; border-radius: 10px; background: rgba(40, 30, 6, 0.45); border-left: 3px solid #ffd23f; }
.hv-annl b { font-size: 13px; color: #ffd86a; } .hv-annl small { color: #c8b88a; font-weight: 500; } .hv-annl p { margin: 4px 0 0; font-size: 14px; }
.g-ann { display: flex; gap: 8px; } .g-ann .pf-in { flex: 1; min-width: 0; }
.hv-perm { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.g-chat .msg.ann p { border: 1px solid #ffd23f; background: rgba(60, 44, 6, 0.7); }
[data-gpicker], .g-form, .pf-edit { min-width: 0; max-width: 100%; }
.g-cats { max-width: 100%; min-width: 0;
  display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
.g-cats button { flex: none; padding: 6px 10px; border-radius: 999px; border: 1px solid rgba(95, 216, 255, 0.3); background: rgba(8, 20, 32, 0.8); color: #bfe6f6; font: 600 12px var(--font-body, system-ui); cursor: pointer; }
.g-cats button.on { background: #5fd8ff; color: #04121c; border-color: #5fd8ff; }
.g-pick.g-pics { display: grid; grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); gap: 6px; }
.g-pics .g-e { display: grid; justify-items: center; gap: 2px; padding: 4px 2px; }
.g-pics .g-e small { font-size: 9px; line-height: 1.1; color: #bfe6f6; text-align: center; max-width: 64px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hv-bot { display: flex; align-items: center; gap: 8px; min-width: 0; }
.hv-bot .nm b { font-size: 13px; }
.hv-botpic { display: grid; place-items: center; width: 100%; height: 100%; font: 700 14px var(--font-display); color: #8fe8ff; background: #0c2030; border-radius: 50%; }
`;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
})(window);

// The guild screen as tabs: Home, Chat, Members, Vault and Raid. Only the open
// tab is drawn, so live updates (a new chat line, a donation) redraw a small
// piece of the page instead of the whole guild. Unread markers are body
// classes (see hn-social.js), so they never cause a redraw at all.
(function (root) {
  'use strict';
  const UI = root.UI;
  const App = UI.App;
  const HN = root.HN;
  const SO = HN.social;
  const V2 = HN.v2;
  const Net = HN.Net;
  const V = HN.VIEWS;
  const CL = HN.clicks;
  const { esc, fmt, toast } = UI;

  const TABS = [['home', 'Home'], ['chat', 'Chat'], ['members', 'Members'], ['vault', 'Vault'], ['raid', 'Raid']];
  const mark = (k) => (k === 'home' ? `<i class="mk-ann">${SO.MEGA}</i>` : k === 'chat' ? '<i class="mk-chat"></i>' : k === 'members' ? '<i class="mk-apps mk-n"></i>' : '');
  const tabBar = (t) => `<div class="g-tabs" role="tablist" data-noswipe>${TABS.map(([k, n]) => `<button type="button" role="tab" class="${k === t ? 'on' : ''}" aria-selected="${k === t}" data-hn="gtab" data-t="${k}">${n}${mark(k)}</button>`).join('')}</div>`;
  const strip = (gid) => {
    const g = SO.guildOf(gid);
    const lv = SO.guildLevel(gid);
    return `<div class="g-strip" style="--gc:${g.color}">${SO.emblem(g, 34)}<b>${esc(g.name)} <small>[${esc(g.tag)}]</small></b><span>Level ${lv.lv} · ${SO.membersOf(gid).length}/${SO.maxMembers(gid)}</span></div>`;
  };
  const raidLine = (gid) => {
    const t = SO.graidTotals(gid);
    const g = SO.graidNow();
    return `<button type="button" class="g-raidline" data-hn="gtab" data-t="raid" style="--rc:${g.color}"><span><small>GUILD RAID</small><b>${esc(g.name)}</b></span><span class="bars"><i style="width:${t.fallen ? 0 : (t.ground.left / t.ground.pool) * 100}%"></i><i style="width:${t.fallen ? 0 : (t.fleet.left / t.fleet.pool) * 100}%"></i></span><em>${t.fallen ? 'Beaten!' : 'Attack ›'}</em></button>`;
  };
  // Who leads, and what happens if they go quiet.
  const leadLine = (gid) => {
    const g = SO.gmap.get(gid) || {};
    const lead = SO.leaderOf(gid);
    const seen = g.leadSeen || g.created || 0;
    const role = SO.roleOf(Net.me, gid);
    const days = Math.floor((Date.now() - seen) / 86400000);
    const note = role === 'co' ? ' If the leader is away for 7 days, you take over automatically.' : role === 'leader' ? ' If you\'re away for 7 days, your co-leader takes over (no co-leader: your senior elder after 14 days).' : '';
    return `<p class="muted small" style="margin:0">Leader: <b>${esc(Net.name(lead))}</b>${lead === Net.me ? '' : ` · last active ${days < 1 ? 'today' : `${days} day${days === 1 ? '' : 's'} ago`}`}.${note}</p>`;
  };
  // Leader and co-leader settings: who can join, who reviews requests, who can announce.
  const settings = (gid) => {
    if (!SO.canManage(gid)) return '';
    const g = SO.gmap.get(gid) || {};
    const mode = SO.modeOf(g);
    const ann = g.annPerm || {};
    const app = g.appPerm || {};
    return `<div class="hn-sec"><h3>Guild settings</h3>
      <div class="hv-perm"><span class="muted small">Who can join:</span>${Object.entries(SO.MODES).map(([k, n]) => `<button type="button" class="hn-btn ${k === mode ? 'gold' : 'ghost'}" data-hn="gmode" data-k="${k}">${n}</button>`).join('')}</div>
      <div class="hv-perm"><span class="muted small">Elders review join requests and invite:</span><button type="button" class="hn-btn ${app.elder ? 'gold' : 'ghost'}" data-hn="gappperm">${app.elder ? 'ON' : 'OFF'}</button></div>
      <div class="hv-perm"><span class="muted small">Who can post announcements:</span> <span class="hn-chip">Leader</span>
        <button type="button" class="hn-btn ${ann.co !== false ? 'gold' : 'ghost'}" data-hn="annperm" data-k="co">Co-leader ${ann.co !== false ? 'ON' : 'OFF'}</button>
        <button type="button" class="hn-btn ${ann.elder === true ? 'gold' : 'ghost'}" data-hn="annperm" data-k="elder">Elders ${ann.elder === true ? 'ON' : 'OFF'}</button></div></div>`;
  };
  const actions = (gid) => {
    const leader = SO.roleOf(Net.me, gid) === 'leader';
    return `<div class="g-acts">${SO.canManage(gid) ? '<button type="button" class="hn-btn" data-hn="gedit">Edit guild</button>' : ''}<button type="button" class="hn-btn ghost" data-hn="gleave">${leader ? 'Disband guild' : 'Leave guild'}</button></div>`;
  };

  V.guild = () => {
    if (!Net.ready) return SO.offlineGuild();
    const gid = SO.myGuildId();
    if (!gid) return V.guilds();
    const g = SO.guildOf(gid);
    const t = SO.gtabNow();
    let body = '';
    if (t === 'home') body = `${SO.GP.hero(gid)}${V2.annBoard(gid)}${raidLine(gid)}${SO.GP.week(gid)}${SO.GP.levels(gid)}`;
    else if (t === 'chat') body = SO.GP.chat(gid);
    else if (t === 'members') body = `${SO.GP.apps(gid)}${SO.GP.members(gid)}${leadLine(gid)}${settings(gid)}${actions(gid)}`;
    else if (t === 'vault') body = V2.bankSection(gid);
    else body = SO.GP.raid(gid);
    // Opening a tab clears its marker.
    const u = SO.unread();
    if (t === 'home' && u.ann) setTimeout(() => SO.markSeen('ann'), 0);
    if (t === 'chat' && u.chat) setTimeout(() => SO.markSeen('chat'), 0);
    if (t === 'chat') setTimeout(() => { const c = document.querySelector('.g-chat'); if (c) c.scrollTop = c.scrollHeight; }, 0);
    setTimeout(SO.marks, 0);
    return `${HN.ui.head('GUILD', `[${esc(g.tag)}] ${esc(g.name)}`, true)}${t === 'home' ? '' : strip(gid)}${tabBar(t)}<div class="g-tab" data-tab="${t}">${body}</div>`;
  };
  V.gchat = () => V.guild();
  V.graid = () => V.guild();

  CL.gtab = (b, render) => {
    SO.setGtab(b.dataset.t);
    if ((App.params || {}).view !== 'guild') return HN.ui.go('guild');
    render();
    window.scrollTo(0, 0);
  };
  // Old entry points open the matching tab.
  CL.gchat = () => { SO.setGtab('chat'); HN.ui.go('guild'); };
  CL.graid = () => { SO.setGtab('raid'); HN.ui.go('guild'); };
  CL.gmode = async (b, render) => {
    const gid = SO.myGuildId();
    if (!gid || !SO.canManage(gid)) return;
    const k = b.dataset.k;
    if (SO.modeOf(SO.gmap.get(gid)) === k) return;
    if (await SO.writeGuild(gid, { mode: k })) { toast(`Your guild is now: ${SO.MODES[k]}.`); SO.watchMembers(); render(); } else toast('Could not save. Try again.');
  };
  CL.gappperm = async (b, render) => {
    const gid = SO.myGuildId();
    if (!gid || !SO.canManage(gid)) return;
    const g = SO.gmap.get(gid) || {};
    const app = { ...(g.appPerm || {}), elder: !(g.appPerm || {}).elder };
    if (await SO.writeGuild(gid, { appPerm: app })) render(); else toast('Could not save. Try again.');
  };

  // The guild tile on the hub carries the same markers.
  const baseHub = V.hub;
  V.hub = (p) => baseHub(p).replace(/(<button type="button" class="hn-tile hv-guild[^>]*>)/, `$1${SO.MKS}`);
  // Markers refresh whenever the screen changes.
  const baseGo = App.go;
  App.go = function (screen, params, opts) {
    const r = baseGo.call(this, screen, params, opts);
    if (screen !== 'holonet' || ((params || {}).view !== 'guild' && (params || {}).view !== 'gchat' && (params || {}).view !== 'graid')) { if (screen === 'holonet' && !(params || {}).view) SO.setGtab('home'); }
    setTimeout(SO.marks, 0);
    return r;
  };

  const css = `
.g-tabs { position: sticky; top: 0; z-index: 5; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; padding: 4px; border-radius: 14px; background: rgba(4, 12, 22, 0.92); border: 1px solid rgba(95, 216, 255, 0.25); }
.g-tabs button { position: relative; min-height: 40px; border: 0; border-radius: 10px; background: transparent; color: #a8c8dc; font: 700 12px/1 var(--font-display); letter-spacing: .08em; text-transform: uppercase; cursor: pointer; }
.g-tabs button.on { background: linear-gradient(180deg, #5fd8ff, #2a8ab8); color: #031018; }
.g-tabs i { position: absolute; top: 3px; right: 4px; }
.g-tab { display: grid; gap: 12px; min-width: 0; }
.g-strip { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 12px; border: 1px solid color-mix(in srgb, var(--gc) 50%, transparent); background: rgba(6, 16, 28, 0.85); }
.g-strip b { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #e6f6ff; }
.g-strip b small { color: var(--gc); }
.g-strip span { color: #8fb8cc; font-size: 12px; white-space: nowrap; }
.g-raidline { display: grid; grid-template-columns: minmax(0, 1fr) 90px auto; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; border: 1px solid color-mix(in srgb, var(--rc) 60%, transparent); background: linear-gradient(90deg, color-mix(in srgb, var(--rc) 18%, #06101c), #06101c); color: #e6f6ff; text-align: left; font: inherit; cursor: pointer; }
.g-raidline small { display: block; font: 700 10px/1 var(--font-display); letter-spacing: .14em; color: #8fe8ff; }
.g-raidline .bars { display: grid; gap: 4px; }
.g-raidline .bars i { display: block; height: 6px; border-radius: 3px; background: var(--rc); min-width: 2px; }
.g-raidline em { font-style: normal; font-weight: 700; color: #ffd23f; }
.g-acts { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.g-app { display: grid; gap: 8px; padding: 10px; border-radius: 12px; border: 1px solid rgba(255, 210, 63, 0.4); background: rgba(40, 30, 6, 0.35); }
.g-app-st { display: flex; flex-wrap: wrap; gap: 6px 14px; }
.g-app-st span { display: flex; align-items: center; gap: 4px; }
.g-app-st .hn-badge { width: 26px; height: auto; }
.g-app-st small { color: #8fb8cc; }
.g-app-act { display: flex; gap: 8px; justify-content: flex-end; }
.g-inv { border-color: rgba(255, 210, 63, 0.6) !important; }
.g-annflag { display: block; font: 700 9px/1 var(--font-display); letter-spacing: .14em; color: #ffd23f; margin-bottom: 3px; font-style: normal; }
.hn-mks { position: absolute; top: 3px; right: 8%; display: flex; gap: 3px; pointer-events: none; z-index: 2; }
.hv-guild { position: relative; }
.hv-guild .hn-mks { top: 8px; right: 8px; }
.main-nav [data-nav="holonet"] { position: relative; }
.mk-chat, .mk-ann, .mk-apps, .mk-inv { display: none; }
body.hn-u-chat .mk-chat { display: block; width: 10px; height: 10px; border-radius: 50%; background: #5fd8ff; box-shadow: 0 0 0 2px #04101c, 0 0 8px #5fd8ff; }
body.hn-u-ann .mk-ann { display: grid; place-items: center; width: 17px; height: 17px; border-radius: 50%; background: #ffd23f; box-shadow: 0 0 0 2px #04101c, 0 0 10px #ffb000; }
.mk-ann svg { width: 11px; height: 11px; display: block; }
body.hn-u-apps .mk-apps { display: block; min-width: 17px; height: 17px; padding: 0 4px; border-radius: 9px; background: #ff3a3a; color: #fff; font: 800 10px/17px system-ui, sans-serif; text-align: center; box-shadow: 0 0 0 2px #04101c; font-style: normal; }
body.hn-u-inv .mk-inv { display: block; width: 10px; height: 10px; border-radius: 50%; background: #ffd23f; box-shadow: 0 0 0 2px #04101c, 0 0 8px #ffd23f; }
.hv-undo { position: fixed; left: 50%; bottom: calc(var(--nav-h, 64px) + 16px + env(safe-area-inset-bottom, 0px)); transform: translateX(-50%); z-index: 9000; display: flex; align-items: center; gap: 12px; padding: 10px 12px 10px 16px; border-radius: 14px; background: #0b1e30; border: 1px solid rgba(95, 216, 255, 0.5); color: #e6f6ff; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); overflow: hidden; max-width: calc(100vw - 24px); }
.hv-undo i { position: absolute; left: 0; bottom: 0; height: 3px; background: #ffd23f; animation: hv-undo 8s linear forwards; }
@keyframes hv-undo { from { width: 100%; } to { width: 0; } }
.hv-annpop { position: fixed; left: 50%; top: calc(12px + env(safe-area-inset-top, 0px)); transform: translateX(-50%); z-index: 9000; display: flex; align-items: center; gap: 10px; width: min(460px, calc(100vw - 24px)); padding: 10px 14px; border-radius: 14px; border: 1px solid rgba(255, 210, 63, 0.7); background: linear-gradient(135deg, #2a2008, #0b1420); color: #fff6d8; text-align: left; font: inherit; cursor: pointer; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); animation: hv-annin .35s ease-out; }
.hv-annpop .ic { flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: #ffd23f; }
.hv-annpop .ic svg { width: 18px; height: 18px; }
.hv-annpop small { display: block; font: 700 10px/1.2 var(--font-display); letter-spacing: .12em; color: #ffd23f; }
.hv-annpop b { display: block; font-weight: 600; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
@keyframes hv-annin { from { opacity: 0; transform: translate(-50%, -12px); } to { opacity: 1; transform: translate(-50%, 0); } }
@media (max-width: 520px) { .g-tabs button { font-size: 10.5px; letter-spacing: .04em; } }
@media (prefers-reduced-motion: reduce) { .hv-annpop { animation: none; } .hv-undo i { animation: none; width: 0; } }
`;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
})(window);

// HoloNet tour: the first time a player opens the HoloNet, Admiral Ackbar
// walks them through it. They fight one Ground Arena and one Fleet Arena
// battle for real; the raid, guilds, Forge (Varka takes over there),
// leaderboards, Databank and their profile are explained on the spot.
// It can be replayed from the hub.
(function (root) {
  'use strict';
  const UI = root.UI;
  const App = UI.App;
  const HN = root.HN;
  const A = root.HNArt;
  const { esc, toast } = UI;
  const S = HN.S;
  const go = (...a) => HN.ui.go(...a);
  const sound = (n) => { if (root.Sound) root.Sound.play(n); };

  const T = () => { const h = S(); return (h.tour = h.tour || { step: 0, done: false, fought: {} }); };
  const varka = () => `<svg viewBox="0 0 100 100" aria-hidden="true">${A.varka()}</svg>`;

  // Each step: where to be, what to point at, what to say, and how it ends.
  const STEPS = [
    { view: 'hub', say: 'Welcome to the HoloNet, Commander! This is where you battle real players across the galaxy. Every win here pays <b>Beskar</b>, the HoloNet\'s own currency. Let me show you around.' },
    { view: 'hub', at: '.hv-me', say: 'This is your <b>HoloNet profile</b>. Other players see your picture, frame, callsign, best badges, rating and guild. Tap it any time to pick a callsign and show off your badges.' },
    { view: 'hub', at: '[data-hn="arena"][data-kind="character"]', say: 'The <b>Ground Arena</b>: your five best characters against another player\'s defense squad. Win to climb from Bronze all the way to Legend. Let\'s try one now.', next: 'Take me there' },
    { view: 'arena', params: { kind: 'character' }, at: '.hn-sq', say: 'This is your ground squad. It also defends you: when other players attack you, they fight this squad. Tap <b>Edit</b> any time to change it.' },
    { view: 'arena', params: { kind: 'character' }, at: '[data-hn="attack"][data-kind="character"]', say: 'Pick an opponent and hit <b>Attack</b>. Tougher opponents pay more Beskar, and every win in a row adds a streak bonus.', fight: 'character' },
    { view: 'arena', params: { kind: 'character' }, say: 'Good fight! Wins raise your <b>rating</b> and pay Beskar; losses cost a little rating. Each new division you reach pays a one-time bonus.' },
    { view: 'arena', params: { kind: 'ship' }, at: '[data-hn="attack"][data-kind="ship"]', say: 'The <b>Fleet Arena</b> works the same way with your five best ships. Launch an attack!', fight: 'ship' },
    { view: 'hub', at: '[data-hn="duels"]', say: '<b>Live Duels</b> are player against player, in real time, against someone who\'s online right now. Duel wins count for your rating too.' },
    { view: 'hub', at: '[data-hn="raid"]', say: 'The <b>community raid</b>: everyone in the HoloNet attacks the same giant boss each week. Bring a squad, team up with another player\'s squad, and when it falls everyone who hit it gets rewards.' },
    { view: 'hub', at: '[data-hn="guild"]', say: 'Join or found a <b>guild</b>. Guilds have their own chat, a two-front guild raid, weekly guild points with rewards, and guild levels. Your guild tag shows on your profile.' },
    { view: 'forge', at: '.hn-forge-top', host: 'varka', say: 'Varka here. Spend your Beskar at my <b>Forge</b>: bounty pucks capture new cards, and shard caches power up the ones you have. New bounties every day. Here\'s a free puck to start you off.', gift: true },
    { view: 'leaders', at: '.hv-rw', say: 'The <b>leaderboards</b> rank the season ladder, duel wins, raid damage and guilds. Finish a season in the top 25 and you earn rewards, with special frames for the top 3.' },
    { view: 'databank', at: '.hn-seg', say: 'The <b>Databank</b> keeps every HoloNet-only card and every bounty you\'ve captured. Finish a row of bounties for bonus Beskar.' },
    { view: 'hub', say: 'That\'s the HoloNet, Commander. Here\'s 500 Beskar to get you started. <b>One last step:</b> every pilot needs a callsign, the name other players will know you by.', next: 'Choose my callsign', end: true },
  ];

  let box = null;
  let ring = null;
  let timer = null;
  const want = () => {
    const t = T();
    return !t.done && HN.ui.unlocked() && App.current === 'holonet' && !App.battleActive && S().seen;
  };
  function hide() {
    if (box) { box.remove(); box = null; }
    if (ring) { ring.remove(); ring = null; }
    clearInterval(timer); timer = null;
  }
  function place() {
    const t = T();
    const st = STEPS[t.step];
    if (!want() || !st) return hide();
    const blocked = document.querySelector('.modal-backdrop, .walkout, .feat-show, .hn-capture, .bv-overlay, .battle-view');
    if (box) box.style.visibility = blocked ? 'hidden' : '';
    if (!ring) return;
    const target = st.at && document.querySelector(st.at);
    if (!target || blocked) { ring.style.display = 'none'; return; }
    const r = target.getBoundingClientRect();
    ring.style.display = '';
    ring.style.transform = `translate(${Math.round(r.left - 6)}px, ${Math.round(r.top - 6)}px)`;
    ring.style.width = `${Math.round(r.width + 12)}px`;
    ring.style.height = `${Math.round(r.height + 12)}px`;
  }
  function show() {
    const t = T();
    const st = STEPS[t.step];
    if (!want() || !st) return hide();
    const view = (App.params || {}).view || 'hub';
    const kind = (App.params || {}).kind || 'character';
    if (view !== st.view || (st.params && st.params.kind !== kind)) { go(st.view, st.params || {}); return; }
    // Fleet step with no ships: explain and move on.
    if (st.fight === 'ship' && !HN.squad('ship').length) { t.step += 1; HN.save(); return show(); }
    const target = st.at && document.querySelector(st.at);
    if (target && target.scrollIntoView) target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    hide();
    box = document.createElement('div');
    box.className = 'hv-tour';
    const host = st.host === 'varka' ? varka() : HN.ui.ACKBAR;
    const waiting = st.fight && !t.fought[st.fight];
    box.innerHTML = `<div class="who">${host}</div><div class="say"><small>${st.host === 'varka' ? 'VARKA · BESKAR BROKER' : 'ADMIRAL ACKBAR'} · ${t.step + 1}/${STEPS.length}</small><p>${st.say}</p>
      <div class="acts"><button type="button" class="hn-btn ghost" data-tour="skip">${st.end ? '' : 'Skip tour'}</button>${waiting ? '<span class="muted small">Win or lose, the tour carries on after the fight.</span>' : `<button type="button" class="hn-btn gold" data-tour="next">${esc(st.next || (st.end ? 'Finish' : 'Next'))}</button>`}</div></div>`;
    if (st.end) box.querySelector('[data-tour="skip"]').remove();
    document.body.appendChild(box);
    ring = document.createElement('div');
    ring.className = 'hv-ring';
    document.body.appendChild(ring);
    box.addEventListener('click', (e) => {
      const b = e.target.closest('[data-tour]');
      if (!b) return;
      if (b.dataset.tour === 'skip') return finish(true);
      advance();
    });
    setTimeout(place, 350);
    timer = setInterval(place, 300);
  }
  function advance() {
    const t = T();
    const st = STEPS[t.step];
    if (st && st.gift) { S().freePucks = (S().freePucks || []).concat('guild'); toast('Varka gave you a Guild bounty puck. Open it in the Forge.'); }
    if (st && st.end) return finish(false);
    t.step += 1;
    HN.save();
    sound('click');
    show();
  }
  function finish(skipped) {
    const t = T();
    t.done = true;
    t.step = 0;
    if (!skipped && !t.paid) { t.paid = true; S().beskar += 500; toast('+500 Beskar. Welcome to the HoloNet!'); sound('coins'); }
    HN.save();
    hide();
    go('hub');
    // The last step: pick a callsign (also asked after skipping the tour).
    if (HN.needName && HN.needName()) setTimeout(() => HN.askName(), 400);
  }

  // A fight during the tour moves it on once the battle is over.
  const baseResult = HN.arenaResult;
  HN.arenaResult = function (opp, won) {
    const r = baseResult.apply(this, arguments);
    const t = T();
    const st = STEPS[t.step];
    if (!t.done && st && st.fight) {
      const kind = opp && Array.isArray(opp.squad) && opp.squad[0] && root.GameData.UNIT_MAP[opp.squad[0].id] && root.GameData.UNIT_MAP[opp.squad[0].id].kind === 'ship' ? 'ship' : 'character';
      t.fought[kind] = true;
      if (kind === st.fight) t.step += 1;
      HN.save();
    }
    return r;
  };
  const baseGo = App.go;
  App.go = function (screen, params, opts) {
    const r = baseGo.call(this, screen, params, opts);
    // Check where we ended up: other wrappers can redirect (focus mode).
    if (App.current === 'holonet') setTimeout(show, 500); else hide();
    return r;
  };
  // Replay from the hub.
  HN.clicks.tour = () => { const t = T(); t.done = false; t.step = 0; t.fought = {}; HN.save(); go('hub'); };
  const baseHub = HN.VIEWS.hub;
  HN.VIEWS.hub = (p) => `${baseHub(p)}<button type="button" class="hn-btn ghost hv-replay" data-hn="tour">Replay the HoloNet tour</button>`;
  HN.tour = { show, hide, STEPS };
  // Already on the HoloNet when this loads (it starts after the first screen): show it now.
  if (App.current === 'holonet') setTimeout(show, 800);

  const css = `
.hv-tour { position: fixed; left: 50%; bottom: calc(var(--nav-h, 64px) + 12px + env(safe-area-inset-bottom, 0px)); transform: translateX(-50%); z-index: 400; width: min(560px, calc(100vw - 24px)); display: grid; grid-template-columns: 76px minmax(0, 1fr); gap: 12px; align-items: start; padding: 12px; border-radius: 16px; border: 1px solid rgba(95, 216, 255, 0.55); background: linear-gradient(160deg, #0b1e30, #050c16); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6); color: #e6f6ff; animation: hv-tour-in .3s ease-out; }
@keyframes hv-tour-in { from { opacity: 0; transform: translate(-50%, 16px); } to { opacity: 1; transform: translate(-50%, 0); } }
.hv-tour .who { width: 76px; height: 84px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(95, 216, 255, 0.35); background: #071420; }
.hv-tour .who svg { width: 100%; height: 100%; display: block; }
.hv-tour small { font: 700 10px/1 var(--font-display); letter-spacing: .14em; color: #8fe8ff; }
.hv-tour p { margin: 6px 0 10px; font-size: 14px; line-height: 1.45; }
.hv-tour p b { color: #ffd86a; }
.hv-tour .acts { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
.hv-ring { position: fixed; left: 0; top: 0; z-index: 399; border-radius: 16px; border: 3px solid #ffd23f; box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.45); pointer-events: none; transition: transform .25s, width .25s, height .25s; }
.hv-replay { justify-self: center; margin-top: 4px; }
@media (max-width: 520px) { .hv-tour { grid-template-columns: 56px minmax(0, 1fr); } .hv-tour .who { width: 56px; height: 64px; } .hv-tour p { font-size: 13px; } }
`;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
})(window);

// Friends (update 2.2): from account level 5, add pilots by callsign and
// challenge them to friendly battles: the live duel (bans, squads, every card
// at the same level), but unranked, with no rewards and nothing recorded.
//
// One doc per pair of pilots, friends/{a}_{b} (the two ids in order): who
// asked, and whether it's been accepted. Who's online comes from the duel
// lobby heartbeat, read only for your friends and only while the panel is open.
(function (root) {
  'use strict';
  const HN = root.HN;
  const UI = root.UI;
  const { esc, toast, openModal } = UI;
  const Net = HN.Net;
  const MAX = 50;
  const ONLINE_MS = 150000;
  const nameKey = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanNm = (s) => String(s || '').replace(/[^A-Za-z0-9_ .-]/g, '').trim().slice(0, 16);
  const myTag = () => { const n = String(Net.name(Net.me) || '').replace(/ \(you\)$/, ''); return n === 'You' ? '' : cleanNm(n); };
  const pairId = (x, y) => (x < y ? `${x}_${y}` : `${y}_${x}`);

  const F = {
    rows: new Map(), // pair id -> doc
    online: {}, // uid -> { at, busy }
    started: false,
    view: null,
    other(r) { return r.a === Net.me ? r.b : r.a; },
    otherName(r) { return cleanNm(r.a === Net.me ? r.nb : r.na) || 'Pilot'; },
    friends() { return [...this.rows.values()].filter((r) => r.ok); },
    incoming() { return [...this.rows.values()].filter((r) => !r.ok && r.by !== Net.me); },
    outgoing() { return [...this.rows.values()].filter((r) => !r.ok && r.by === Net.me); },
    isFriend(uid) { return this.friends().some((r) => this.other(r) === uid); },
  };

  const on = () => !!(root.Friends && root.Friends.unlocked());
  const dot = () => { if (root.Friends) root.Friends.dot(F.incoming().length > 0); };
  const redraw = () => { if (F.view) F.view(); };

  async function boot() {
    if (!on()) return;
    await Net.init();
    if (!Net.ready) return;
    if (!F.started) {
      F.started = true;
      const take = (side) => (snap) => {
        for (const [id, r] of F.rows) if (r[side] === Net.me && !snap.docs.some((d) => d.id === id)) F.rows.delete(id);
        for (const d of snap.docs) { const v = d.data(); if (v) F.rows.set(d.id, { ...v, id: d.id }); }
        dot(); redraw();
      };
      Net.db.collection('friends').where('a', '==', Net.me).limit(MAX * 2).onSnapshot(take('a'), () => {});
      Net.db.collection('friends').where('b', '==', Net.me).limit(MAX * 2).onSnapshot(take('b'), () => {});
    }
    // Being online for friends: the duel lobby heartbeat (also how challenges arrive).
    if (HN.Duel && HN.Duel.start) HN.Duel.start();
  }

  async function poll() {
    const ids = F.friends().map((r) => F.other(r));
    await Promise.all(ids.map(async (uid) => {
      try {
        const d = await Net.db.doc(`lobby/${uid}`).get();
        const v = d.exists ? d.data() : null;
        const t = v ? (v.ts && v.ts.toMillis ? v.ts.toMillis() : v.t || 0) : 0;
        F.online[uid] = { at: t, busy: !!(v && v.p && v.p.busy) };
      } catch (e) { /* leave as it was */ }
    }));
    redraw();
  }
  const isOnline = (uid) => { const o = F.online[uid]; return !!(o && Date.now() - o.at < ONLINE_MS); };

  async function add(q, st) {
    const key = nameKey(q);
    if (key.length < 3) return st('Callsigns have at least 3 letters or numbers.', 'bad');
    if (F.friends().length + F.outgoing().length >= MAX) return st(`You can have up to ${MAX} friends and requests.`, 'bad');
    st('Searching…');
    let uid = null;
    try { const d = await Net.db.doc(`names/${key}`).get(); uid = d.exists ? d.data().uid : null; } catch (e) { return st("Couldn't search right now. Try again.", 'bad'); }
    if (!uid) return st(`No pilot is called "${q}". Check the spelling.`, 'bad');
    if (uid === Net.me) return st("That's you!", 'bad');
    const id = pairId(Net.me, uid);
    const have = F.rows.get(id);
    if (have && have.ok) return st(`${F.otherName(have)} is already your friend.`, 'bad');
    if (have && have.by === Net.me) return st('Request already sent.', 'bad');
    if (have) return accept(have, st);
    const [a, b] = Net.me < uid ? [Net.me, uid] : [uid, Net.me];
    const mine = myTag();
    const theirs = cleanNm(q);
    try {
      await Net.db.doc(`friends/${id}`).set({ a, b, by: Net.me, ok: false, na: a === Net.me ? mine : theirs, nb: b === Net.me ? mine : theirs, t: Date.now() });
      F.rows.set(id, { id, a, b, by: Net.me, ok: false, na: a === Net.me ? mine : theirs, nb: b === Net.me ? mine : theirs });
      st(`Friend request sent to ${theirs}.`, 'good');
      redraw();
    } catch (e) { st("Couldn't send the request. They may have already sent you one: check Requests.", 'bad'); }
  }
  async function accept(r, st) {
    const mine = myTag();
    const body = { a: r.a, b: r.b, by: r.by, ok: true, na: r.a === Net.me ? mine : cleanNm(r.na), nb: r.b === Net.me ? mine : cleanNm(r.nb), t: Date.now() };
    try { await Net.db.doc(`friends/${r.id}`).set(body); F.rows.set(r.id, { ...body, id: r.id }); toast(`You and ${F.otherName(r)} are now friends!`); poll(); } catch (e) { if (st) st("Couldn't accept right now. Try again.", 'bad'); else toast("Couldn't accept right now. Try again."); }
    dot(); redraw();
  }
  async function drop(r, msg) {
    try { await Net.db.doc(`friends/${r.id}`).delete(); F.rows.delete(r.id); if (msg) toast(msg); } catch (e) { toast("Couldn't do that right now. Try again."); }
    dot(); redraw();
  }

  function challenge(r, kind) {
    const uid = F.other(r);
    if (!isOnline(uid)) return toast(`${F.otherName(r)} isn't online right now.`);
    if (!HN.Duel || !HN.Duel.challengeFriend) return toast('Connecting… try again in a moment.');
    HN.Duel.challengeFriend({ peer: uid, by: uid, nm: F.otherName(r) }, kind);
  }

  function open() {
    if (!on()) return;
    if (!Net.ready) { boot().then(() => (Net.ready ? open() : toast("Couldn't reach the HoloNet. Check your connection and try again."))); return; }
    if (!HN.hasProfile()) {
      toast('Pick a callsign first: friends find you by it.');
      return HN.setupProfile((ok) => { if (ok !== false && HN.hasProfile()) open(); }, false);
    }
    let tab = F.incoming().length ? 'req' : 'list';
    const m = openModal('<div class="frp" data-frp></div>', { cls: 'frp-modal', onClose: () => { clearInterval(timer); F.view = null; } });
    const host = m.root.querySelector('[data-frp]');
    let status = { msg: '', cls: '' };
    const st = (msg, cls) => { status = { msg, cls }; const n = host.querySelector('[data-st]'); if (n) { n.textContent = msg || ''; n.className = `pe-st ${cls || ''}`; } };
    const row = (r) => {
      const uid = F.other(r);
      const o = F.online[uid];
      const live = isOnline(uid);
      const busy = live && o && o.busy;
      return `<div class="fr-row"><span class="fr-av">${esc(F.otherName(r).slice(0, 2).toUpperCase())}</span>
        <span class="fr-who"><b>${esc(F.otherName(r))}</b><small class="${live ? (busy ? 'busy' : 'on') : ''}">${live ? (busy ? 'In a battle' : 'Online') : 'Offline'}</small></span>
        <span class="fr-go"><button type="button" class="btn" data-f="ground" data-id="${esc(r.id)}" ${live && !busy ? '' : 'disabled'}>Ground</button><button type="button" class="btn" data-f="fleet" data-id="${esc(r.id)}" ${live && !busy ? '' : 'disabled'}>Fleet</button><button type="button" class="fr-x" data-f="remove" data-id="${esc(r.id)}" aria-label="Remove friend">✕</button></span></div>`;
    };
    const render = () => {
      const fr = F.friends().sort((x, y) => Number(isOnline(F.other(y))) - Number(isOnline(F.other(x))) || F.otherName(x).localeCompare(F.otherName(y)));
      const inc = F.incoming();
      const out = F.outgoing();
      const body = tab === 'list'
        ? (fr.length ? `<div class="fr-list">${fr.map(row).join('')}</div>` : '<p class="muted small fr-empty">No friends yet. Tap <b>Add</b> and type a pilot\'s callsign.</p>')
        : tab === 'req'
          ? `${inc.length ? `<h4>Wants to be friends</h4><div class="fr-list">${inc.map((r) => `<div class="fr-row"><span class="fr-av">${esc(F.otherName(r).slice(0, 2).toUpperCase())}</span><span class="fr-who"><b>${esc(F.otherName(r))}</b><small>Friend request</small></span><span class="fr-go"><button type="button" class="btn" data-f="decline" data-id="${esc(r.id)}">Decline</button><button type="button" class="btn btn-primary" data-f="accept" data-id="${esc(r.id)}">Accept</button></span></div>`).join('')}</div>` : '<p class="muted small fr-empty">No new requests.</p>'}
            ${out.length ? `<h4>Sent</h4><div class="fr-list">${out.map((r) => `<div class="fr-row"><span class="fr-av">${esc(F.otherName(r).slice(0, 2).toUpperCase())}</span><span class="fr-who"><b>${esc(F.otherName(r))}</b><small>Waiting for them</small></span><span class="fr-go"><button type="button" class="btn" data-f="cancel" data-id="${esc(r.id)}">Cancel</button></span></div>`).join('')}</div>` : ''}`
          : `<p class="muted small">Type a pilot's callsign to send them a friend request. They'll see it next time they open Friends.</p>
            <div class="fp-row"><input class="pf-in" data-q maxlength="16" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Callsign"><button type="button" class="btn btn-primary" data-f="add">Send</button></div>
            <p class="muted small">Your callsign is <b>${esc(myTag())}</b>. Share it so friends can add you.</p>`;
      host.innerHTML = `<div class="fr-head"><div><p class="eyebrow">Friends</p><h2>Friendly battles</h2></div><button type="button" class="btn" data-f="close">Close</button></div>
        <p class="muted small fr-blurb">Challenge a friend who's online to a Ground or Fleet battle: you each ban a card, build a squad, and every card fights at the same level. Just for fun: no rating, no rewards.</p>
        <div class="fr-tabs"><button type="button" class="${tab === 'list' ? 'on' : ''}" data-tab="list">Friends <i>${fr.length}</i></button><button type="button" class="${tab === 'req' ? 'on' : ''}" data-tab="req">Requests ${inc.length ? `<i class="hot">${inc.length}</i>` : ''}</button><button type="button" class="${tab === 'add' ? 'on' : ''}" data-tab="add">Add</button></div>
        ${body}<p class="pe-st ${status.cls}" data-st>${esc(status.msg)}</p>`;
      if (tab === 'add') { const i = host.querySelector('[data-q]'); if (i) { i.addEventListener('keydown', (e) => { if (e.key === 'Enter') add(i.value.trim(), st); }); setTimeout(() => i.focus(), 60); } }
    };
    F.view = render;
    render();
    poll();
    const timer = setInterval(poll, 20000);
    host.addEventListener('click', (e) => {
      const t = e.target.closest('[data-tab]');
      if (t) { tab = t.dataset.tab; status = { msg: '', cls: '' }; render(); return; }
      const b = e.target.closest('[data-f]');
      if (!b || b.disabled) return;
      const r = b.dataset.id ? F.rows.get(b.dataset.id) : null;
      const f = b.dataset.f;
      if (f === 'close') return m.close();
      if (f === 'add') return add(host.querySelector('[data-q]').value.trim(), st);
      if (!r) return;
      if (f === 'accept') return accept(r, st);
      if (f === 'decline') return drop(r, 'Request declined.');
      if (f === 'cancel') return drop(r, 'Request cancelled.');
      if (f === 'remove') {
        return UI.confirmBox(`Remove ${F.otherName(r)}?`, 'They\'ll be taken off your friends list. You can add them again any time.', 'Remove').then((yes) => { if (yes) drop(r, `${F.otherName(r)} removed.`); });
      }
      if (f === 'ground' || f === 'fleet') { m.close(); challenge(r, f === 'fleet' ? 'ship' : 'character'); }
    });
  }

  HN.friends = { boot, open, isFriend: (uid) => F.isFriend(uid), F };

  const css = document.createElement('style');
  css.textContent = `.modal.frp-modal { width: min(560px, 100%); }
.frp { display: grid; gap: 10px; }
.fr-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.fr-head h2 { margin: 0; } .fr-head .eyebrow { margin: 0 0 2px; }
.fr-blurb { margin: 0; }
.fr-tabs { display: flex; gap: 6px; }
.fr-tabs button { flex: 1; padding: 9px 8px; border-radius: 10px; border: 1px solid rgba(95, 216, 255, 0.25); background: rgba(8, 20, 32, 0.85); color: #dff8ff; font: 700 13px var(--font-display, inherit); cursor: pointer; }
.fr-tabs button.on { border-color: #5fd8ff; background: rgba(95, 216, 255, 0.18); }
.fr-tabs i { font-style: normal; margin-left: 4px; opacity: .75; } .fr-tabs i.hot { display: inline-block; min-width: 18px; padding: 0 5px; border-radius: 9px; background: #ff5a3a; color: #fff; opacity: 1; }
.fr-list { display: grid; gap: 6px; max-height: 50vh; overflow-y: auto; }
.frp h4 { margin: 4px 0 0; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: #8fb4c8; }
.fr-row { display: grid; grid-template-columns: auto 1fr auto; gap: 10px; align-items: center; padding: 8px 10px; border-radius: 12px; background: rgba(8, 20, 32, 0.85); border: 1px solid rgba(95, 216, 255, 0.14); }
.fr-av { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; background: #0d2234; border: 1px solid #5fd8ff; font: 800 12px var(--font-display, inherit); color: #bfefff; }
.fr-who { display: grid; min-width: 0; } .fr-who b { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fr-who small { font-size: 11px; color: #7a8a9a; } .fr-who small.on { color: #4ade80; } .fr-who small.busy { color: #ffb03a; }
.fr-go { display: flex; gap: 6px; align-items: center; } .fr-go .btn { padding: 7px 10px; font-size: 12px; min-height: 34px; }
.fr-x { width: 30px; height: 30px; border-radius: 50%; border: 1px solid rgba(255, 122, 90, 0.4); background: transparent; color: #ff9a8a; cursor: pointer; }
.fr-empty { text-align: center; padding: 14px 0; margin: 0; }
@media (max-width: 460px) { .fr-row { grid-template-columns: auto 1fr; } .fr-go { grid-column: 1 / -1; justify-content: flex-end; } }`;
  document.head.appendChild(css);
})(window);

// HoloNet offline: when the HoloNet can't be reached (no Wi-Fi or data, or
// its servers don't answer), the HoloNet tab shows this screen instead: a
// drifting starfield, a relay dish with a broken signal and interference
// scrolling across it. The rest of the game carries on untouched.
// Also: players who have the HoloNet connect quietly during the loading
// screen, so unread markers are ready by the time they reach the menu.
(function (root) {
  'use strict';
  const UI = root.UI;
  const App = UI.App;
  const HN = root.HN;
  const Net = HN.Net;
  const S = HN.S;
  const { el } = UI;

  let lost = false;
  const offline = () => lost || Net.status === 'offline';
  HN.offline = offline;

  const DISH = `<svg viewBox="0 0 120 120" aria-hidden="true">
    <g class="ho-sway">
    <g class="ho-arcs" fill="none" stroke="#5fd8ff" stroke-linecap="round">
      <path d="M78 34 A26 26 0 0 1 92 58" stroke-width="3" opacity=".9"/>
      <path d="M84 22 A40 40 0 0 1 104 56" stroke-width="3" stroke-dasharray="6 7" opacity=".55"/>
      <path d="M90 10 A54 54 0 0 1 116 54" stroke-width="3" stroke-dasharray="3 10" opacity=".3"/>
    </g>
    <g transform="rotate(-30 60 60)"><path d="M30 56 A30 30 0 0 0 90 56Z" fill="#9ad0ec"/><path d="M30 56 A30 30 0 0 0 90 56" fill="none" stroke="#e8f6ff" stroke-width="2"/><path d="M60 56 L60 34" stroke="#cfe8f6" stroke-width="2.4"/><circle cx="60" cy="32" r="4" fill="#ff5a3a"/></g>
    </g>
    <path d="M58 70 L48 104 L72 104 L64 70Z" fill="#2a4a62"/>
    <rect x="40" y="102" width="40" height="6" rx="2" fill="#1a3248"/>
    <path d="M94 74 L102 84 M102 74 L94 84" stroke="#ff5a3a" stroke-width="3.4" stroke-linecap="round"/>
  </svg>`;

  function offlineHtml(retrying) {
    const why = typeof navigator !== 'undefined' && navigator.onLine === false
      ? 'Your device is offline. Check your Wi-Fi or mobile data.'
      : 'The HoloNet relay isn\'t answering right now. It might be your connection, or the relay is busy.';
    return `<div class="ho">
      <div class="ho-bg" aria-hidden="true"><i class="s1"></i><i class="s2"></i><i class="scan"></i><i class="noise"></i></div>
      <div class="ho-card">
        <div class="ho-dish">${DISH}</div>
        <p class="ho-k">SIGNAL LOST</p>
        <h2>HoloNet offline</h2>
        <p>${why}</p>
        <p class="muted small">Live battles, guilds, chat and leaderboards need a connection. Everything else still works: the campaign, crates, your collection and the Black Market.</p>
        <div class="ho-acts">
          <button type="button" class="hn-btn gold" data-ho="retry" ${retrying ? 'disabled' : ''}>${retrying ? '<span class="ho-spin"></span> Reconnecting…' : 'Try again'}</button>
          <button type="button" class="hn-btn ghost" data-ho="home">Back to the galaxy</button>
        </div>
        <p class="muted small ho-auto">We'll reconnect by ourselves as soon as your connection is back.</p>
      </div></div>`;
  }
  // A small inline version for places that render inside other screens.
  HN.ui.offline = () => offlineHtml(false);

  let retrying = false;
  async function retry(node) {
    if (retrying) return;
    retrying = true;
    if (node) node.innerHTML = offlineHtml(true);
    lost = typeof navigator !== 'undefined' && navigator.onLine === false;
    if (!lost) await Promise.race([Net.retry(), new Promise((r) => setTimeout(r, 12000))]);
    retrying = false;
    if (App.current === 'holonet') {
      if (offline()) { if (node) node.innerHTML = offlineHtml(false); UI.toast('Still offline. Try again in a moment.'); }
      else App.go('holonet', App.params || {});
    }
  }

  // The HoloNet screen: the offline panel while there's no connection.
  const baseScreen = UI.Screens.holonet;
  UI.Screens.holonet = (params = {}) => {
    if (!offline()) return baseScreen(params);
    const node = el('<section class="view hn hnv-offline"></section>');
    node.innerHTML = offlineHtml(retrying);
    node.addEventListener('click', (e) => {
      const b = e.target.closest('[data-ho]');
      if (!b) return;
      if (b.dataset.ho === 'retry') retry(node);
      if (b.dataset.ho === 'home') App.go('home');
    });
    return node;
  };

  // Losing and regaining the connection while playing.
  const reshow = () => { if (App.current === 'holonet' && !App.battleActive && !document.querySelector('.modal-backdrop')) App.go('holonet', App.params || {}); };
  window.addEventListener('offline', () => { lost = true; reshow(); });
  window.addEventListener('online', async () => {
    lost = false;
    if (!Net.ready) await Net.retry();
    if (Net.ready) { UI.toast('HoloNet connection restored.'); reshow(); }
  });
  // A failed connection attempt shows the panel if you're looking at the HoloNet.
  let lastStatus = Net.status;
  Net.on(() => { if (Net.status === lastStatus || Net.status === 'connecting') return; const was = lastStatus; lastStatus = Net.status; if ((Net.status === 'offline' && was !== 'offline') || (Net.status === 'online' && was === 'offline')) reshow(); });

  // Players with the HoloNet connect during the loading screen. Players who
  // haven't unlocked it yet never get here: this whole module isn't run for them.
  const early = () => { if (HN.ui.unlocked() && (S().seen || localStorage.getItem('dev-hnfocus') === '1')) Net.init(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(early, 0)); else setTimeout(early, 0);

  const css = `
.hnv-offline { min-height: calc(100vh - 160px); display: grid; }
.ho { position: relative; display: grid; place-items: center; min-height: 100%; padding: 24px 12px; overflow: hidden; border-radius: 18px; border: 1px solid rgba(95, 216, 255, 0.25); background: radial-gradient(ellipse at 50% 30%, #0e2840, #040a14 70%); }
.ho-bg { position: absolute; inset: 0; pointer-events: none; }
.ho-bg i { position: absolute; inset: -50%; display: block; }
.ho-bg .s1 { background-image: radial-gradient(1px 1px at 10% 20%, #fff, transparent), radial-gradient(1px 1px at 30% 70%, #cfe8ff, transparent), radial-gradient(1.5px 1.5px at 60% 40%, #fff, transparent), radial-gradient(1px 1px at 80% 80%, #9ad8ff, transparent), radial-gradient(1px 1px at 45% 10%, #fff, transparent), radial-gradient(1.5px 1.5px at 90% 30%, #fff, transparent); background-size: 260px 260px; opacity: .7; animation: ho-drift 60s linear infinite; }
.ho-bg .s2 { background-image: radial-gradient(1px 1px at 20% 50%, #fff, transparent), radial-gradient(1px 1px at 70% 15%, #cfe8ff, transparent), radial-gradient(1px 1px at 50% 85%, #fff, transparent); background-size: 180px 180px; opacity: .45; animation: ho-drift 100s linear infinite reverse; }
.ho-bg .scan { inset: 0; background: repeating-linear-gradient(180deg, rgba(95, 216, 255, 0.06) 0 2px, transparent 2px 5px); }
.ho-bg .noise { inset: auto 0 0 0; height: 30%; background: linear-gradient(180deg, transparent, rgba(95, 216, 255, 0.12) 50%, transparent); animation: ho-sweep 4.5s ease-in-out infinite; }
@keyframes ho-drift { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-260px, 130px, 0); } }
@keyframes ho-sweep { 0% { transform: translateY(-340%); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateY(120%); opacity: 0; } }
.ho-card { position: relative; display: grid; justify-items: center; gap: 8px; max-width: 460px; text-align: center; color: #e6f6ff; }
.ho-card h2 { margin: 0; font-family: var(--font-display); letter-spacing: .12em; text-transform: uppercase; color: #bfefff; text-shadow: 0 0 18px rgba(95, 216, 255, 0.6); }
.ho-card p { margin: 0; line-height: 1.45; }
.ho-k { font: 700 11px/1 var(--font-display); letter-spacing: .3em; color: #ff7a5a; animation: ho-blink 1.6s steps(1) infinite; }
@keyframes ho-blink { 50% { opacity: .35; } }
.ho-dish { width: 130px; height: 130px; }
.ho-sway { transform-box: view-box; transform-origin: 60px 66px; animation: ho-sway 7s ease-in-out infinite alternate; }
@keyframes ho-sway { from { transform: rotate(-16deg); } to { transform: rotate(18deg); } }
.ho-dish svg { width: 100%; height: 100%; display: block; }
.ho-arcs { animation: ho-flicker 2.2s steps(2) infinite; }
@keyframes ho-flicker { 0%, 100% { opacity: 1; } 40% { opacity: .25; } 55% { opacity: .8; } 70% { opacity: .1; } }
.ho-acts { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
.ho-auto { opacity: .8; }
.ho-spin { display: inline-block; width: 12px; height: 12px; margin-right: 6px; vertical-align: -2px; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: ho-rot .8s linear infinite; }
@keyframes ho-rot { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .ho-bg i, .ho-sway, .ho-arcs, .ho-k { animation: none !important; } }
`;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
})(window);

