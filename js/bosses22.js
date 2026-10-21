// Update 2.2 planet bosses: one for each world that had none (Dagobah, Endor,
// Geonosis, Mustafar, Exegol, Battle of Coruscant), each with its own battle
// mechanics, plus new art for the Hoth Star Destroyer and General Grievous.
// Everything stays switched off until 2.2 (see Update22 in js/friends.js).
// The Xyston Star Destroyer and the Invisible Hand are drawn here too, saved
// for a future raid or boss battle; nothing uses them yet.
(function (root) {
  'use strict';
  const D = root.GameData;
  const live = () => (root.Update22 ? root.Update22.on() : root.__v22Test != null && Date.now() >= root.__v22Test);

  // ---------- Art ----------
  if (root.ArtX && root.Art) {
  const { P, E, C, R, L } = root.ArtX;
  const add = (id, fn) => root.Art.addArt('char', id, fn);
  const stars = (n, seed, maxY = 100, minR = 0.2) => { let s = seed; const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; let o = ''; for (let i = 0; i < n; i++) o += C((r() * 100).toFixed(1), (r() * maxY).toFixed(1), (r() * 0.5 + minR).toFixed(2), '#fff', `opacity="${(r() * 0.6 + 0.3).toFixed(2)}"`); return o; };
  const glow = (c, b = 2) => `style="filter:drop-shadow(0 0 ${b}px ${c})"`;
  const fighters = (list, c = '#9aa4b4') => list.map(([x, y, s = 1]) => `<g transform="translate(${x} ${y}) scale(${s})">${R(-1.6, -0.3, 3.2, 0.6, c)}${R(-1.8, -1.2, 0.5, 2.4, c)}${R(1.3, -1.2, 0.5, 2.4, c)}${C(0, 0, 0.6, c)}</g>`).join('');
  const bolt = (x1, y1, x2, y2, c) => `<g ${glow(c, 1.2)}>${L(x1, y1, x2, y2, c, 0.9)}</g>`;

  // ---------- Dagobah: the Dragonsnake bursting out of the swamp ----------
  add('dragonsnake', () => R(0, 0, 100, 100, '#0e1a14') + R(0, 0, 100, 58, '#1c3026') + E(50, 30, 46, 22, '#38584a', 'opacity=".45"') + E(50, 26, 26, 12, '#6a8a78', 'opacity=".25"')
    // gnarled trees, roots and hanging moss
    + P('M-4 0 L14 0 C12 14 16 26 22 34 C26 40 30 44 34 50 L26 52 C20 46 14 40 10 32 C4 22 0 12 -4 6Z', '#0a140e') + P('M10 32 C4 38 0 44 -4 50 L-4 56 C2 50 8 44 14 40Z M22 34 C24 42 22 48 18 54 L22 55 C26 49 28 42 26 36Z', '#0a140e')
    + P('M104 0 L86 0 C88 16 84 28 78 38 C74 44 70 48 68 54 L76 55 C80 48 84 42 88 34 C94 24 100 12 104 6Z', '#0a140e') + P('M88 34 C94 40 98 46 104 50 L104 56 C98 50 92 44 84 42Z', '#0a140e')
    + [[14, 8, 22], [20, 14, 18], [86, 6, 24], [80, 12, 20], [92, 10, 16]].map(([x, y, h]) => P(`M${x} ${y} C${x - 1} ${y + h * 0.4} ${x + 1} ${y + h * 0.7} ${x} ${y + h}`, 'none', 'stroke="#2a4a34" stroke-width="1.2" opacity=".8"')).join('')
    // the drowned X-wing, nose down in the bog
    + P('M8 60 L18 46 L21 47 L12 61Z', '#8a8e88') + P('M15 50 L6 46 L7 44 L16 48Z M17 49 L22 40 L24 41 L19 50Z', '#6a6e68') + C(19.6, 46.6, 0.8, '#c8402a')
    // water
    + R(0, 58, 100, 42, '#122219') + E(50, 60, 62, 5, '#2a4436', 'opacity=".9"') + [66, 74, 84, 94].map((y, i) => E(20 + (i % 2) * 50, y, 22, 1.2, '#4a6e5a', 'opacity=".45"')).join('')
    // back coils arching out of the water
    + P('M78 62 C78 46 92 46 92 62', 'none', 'stroke="#2c3a20" stroke-width="7.5" stroke-linecap="round"') + P('M78 62 C78 46 92 46 92 62', 'none', 'stroke="#4a5a2e" stroke-width="2.6" stroke-linecap="round" opacity=".7"')
    + [[80, 52], [84, 48.6], [88, 48.6], [91, 52]].map(([x, y]) => P(`M${x} ${y} l1 -3.4 l1.2 3.2Z`, '#1e2a14')).join('')
    + P('M64 64 C64 54 74 52 76 62', 'none', 'stroke="#2c3a20" stroke-width="6" stroke-linecap="round"')
    // the neck rising, ridged, with a pale belly
    + P('M46 66 C44 54 46 42 52 34 C56 28 58 22 54 16', 'none', 'stroke="#2c3a20" stroke-width="12" stroke-linecap="round"')
    + P('M43 66 C41 55 43 44 49 36 C52 32 54 27 52 21', 'none', 'stroke="#8a9a5a" stroke-width="3.2" stroke-linecap="round" opacity=".6"')
    + [[46, 60], [46, 52], [48, 44], [52, 37], [55, 30]].map(([x, y]) => P(`M${x + 3} ${y} l4 -2.6 l-0.6 3.6Z`, '#1e2a14')).join('')
    // head: long toothed snout, crest, glowing eye
    + P('M56 14 C48 10 34 10 22 14 C16 16 14 20 18 23 C24 26 38 26 48 24 C56 23 62 20 60 16Z', '#3e4e28') + P('M22 14 C34 10 48 10 56 14 L50 18 L24 19Z', '#56683a', 'opacity=".7"')
    + P('M18 23 C24 30 40 31 50 26 L48 24 C38 26 26 26 18 23Z', '#24300f') + [20, 24.5, 29, 33.5, 38, 42.5].map((x) => P(`M${x} 23.4 l1 3 l1 -3Z`, '#efe8cc')).join('') + [22, 27, 32, 37, 42].map((x) => P(`M${x} 28.6 l1 -2.6 l1 2.6Z`, '#efe8cc')).join('')
    + P('M56 14 L64 6 L62 13 L68 10 L62 18Z', '#56683a') + P('M50 12 L54 4 L54 12Z M44 11 L46 5 L48 11Z', '#3e4e28')
    + `<g ${glow('#ffd23f', 2.4)}>${E(48, 16.6, 2.6, 1.6, '#ffd23f')}</g>` + R(47.6, 15.2, 0.8, 2.8, '#1a1406') + C(20, 18, 0.8, '#0e1406') + C(23, 17, 0.6, '#0e1406')
    // splash and drips
    + E(46, 66, 14, 2.6, '#8acab0', 'opacity=".45"') + [[36, 62], [40, 58], [54, 60], [58, 63], [33, 66]].map(([x, y]) => C(x, y, 0.9, '#bfe8d8', 'opacity=".8"')).join('')
    + [[26, 26], [34, 27], [44, 26]].map(([x, y]) => P(`M${x} ${y} l0.5 3 l0.5 -3`, '#9acab8', 'opacity=".7"')).join('')
    + R(0, 0, 100, 100, '#bfe0d0', 'opacity=".06"'));

  // ---------- Endor: Death Star II over the forest moon, the battle raging ----------
  add('death_star_2', () => R(0, 0, 100, 100, '#04060c') + E(20, 30, 40, 26, '#2a1a5a', 'opacity=".35"') + E(86, 20, 30, 20, '#1a3a6a', 'opacity=".35"') + stars(60, 7, 70)
    + `<g ${glow('#fff2c8', 6)}>${C(90, 8, 2.4, '#fff8e0')}</g>` + L(70, 8, 100, 8, '#fff8e0', 0.4, 'opacity=".5"')
    // Endor: big moon with atmosphere and forests
    + C(30, 132, 64, '#16381e') + C(30, 132, 64, 'none', 'stroke="#7ae0a0" stroke-width="1.4" opacity=".55"') + C(30, 132, 66, 'none', 'stroke="#4ab8ff" stroke-width="2" opacity=".18"')
    + [[10, 76, 16], [34, 72, 12], [56, 80, 14], [22, 86, 10]].map(([x, y, r]) => E(x, y, r, r * 0.35, '#2a5a32', 'opacity=".7"')).join('') + [[18, 80], [44, 78], [62, 88]].map(([x, y]) => E(x, y, 7, 1.6, '#e8f0ff', 'opacity=".35"')).join('')
    // Death Star II
    + C(62, 36, 26, '#0a0e18') + C(62, 36, 28, '#9fd0ff', 'opacity=".05"')
    + `<clipPath id="ds2c2"><circle cx="62" cy="36" r="26"/></clipPath><g clip-path="url(#ds2c2)">`
    + R(36, 10, 52, 52, '#0e1624') + C(74, 26, 14, '#ff8a3a', 'opacity=".12"')
    + [-20, -13, -6, 1, 8, 15, 22].map((dy) => L(36, 36 + dy, 88, 36 + dy, '#9ab0d0', 0.45, 'opacity=".55"')).join('')
    + [5, 11, 17, 23].map((rx) => E(62, 36, rx, 26, 'none', 'stroke="#9ab0d0" stroke-width=".45" opacity=".5"')).join('')
    + [[70, 18], [76, 24], [80, 30], [72, 28], [66, 22]].map(([x, y]) => C(x, y, 0.6, '#ffb86a', 'opacity=".9"')).join('')
    + P('M36 12 L58 12 L60 17 L64 18 L66 22 L70 23 L72 28 L78 30 L80 34 L84 35 L88 40 L88 62 L36 62Z', '#a4aebe') + P('M62 62 L62 36 L88 40 L88 62Z', '#000', 'opacity=".22"')
    + [[40, 40, 8, 3], [50, 44, 6, 2.4], [42, 50, 10, 2.6], [56, 52, 8, 3], [66, 46, 6, 2], [72, 54, 9, 2.6], [48, 30, 6, 2.4], [40, 24, 7, 2.4], [52, 18, 5, 2], [78, 46, 5, 2.4]].map(([x, y, w, h]) => R(x, y, w, h, '#7e8898', 'opacity=".8"')).join('')
    + L(36, 37, 88, 37, '#2a3242', 1.6) + L(36, 37.8, 88, 37.8, '#c8d0dc', 0.3, 'opacity=".6"')
    + C(48, 28, 6.4, '#4e5868') + C(48, 28, 4.8, '#2a3240') + [3.4, 2.2].map((r) => C(48, 28, r, 'none', 'stroke="#6a7484" stroke-width=".4"')).join('') + `<g ${glow('#7aff9a', 1.4)}>${C(48, 28, 0.9, '#9affb0')}</g>`
    + [[58, 12], [62, 17], [66, 21], [70, 24], [74, 29], [80, 32], [85, 36]].map(([x, y]) => C(x, y, 0.55, '#ffd08a')).join('') + '</g>'
    + C(62, 36, 26, 'none', 'stroke="#d0dae8" stroke-width=".5" opacity=".55"')
    // the fleets and the fight
    + [[16, 30, 0.9], [24, 22, 0.7], [84, 62, 1], [92, 54, 0.8]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M0 -4 L3 3 L0 2 L-3 3Z', '#8a94a4')}</g>`).join('')
    + P('M6 50 C8 47 16 46 20 48 C18 50 10 52 6 50Z', '#8a7a6a') + C(7.6, 49.4, 0.6, '#9ad8ff')
    + fighters([[30, 40, 0.8], [36, 50, 0.7], [90, 40, 0.8], [84, 30, 0.6], [12, 62, 0.7]])
    + bolt(14, 54, 30, 46, '#ff3a3a') + bolt(20, 44, 34, 38, '#4aff8a') + bolt(86, 46, 94, 38, '#4aff8a') + bolt(82, 58, 90, 50, '#ff3a3a') + bolt(28, 36, 22, 26, '#ff3a3a')
    + `<g ${glow('#ffb03a', 3)}>${C(40, 44, 1.4, '#ffd08a')}${C(88, 44, 1.2, '#ffd08a')}</g>`);

  // ---------- Geonosis: the Acklay in the Petranaki arena ----------
  // Film look: crab-like shell, long neck, toothy reptile head, two giant raised claw-blades, four spiked legs.
  add('acklay', () => R(0, 0, 100, 100, '#b8502a') + R(0, 0, 100, 46, '#e08848') + R(0, 0, 100, 22, '#c86a3a', 'opacity=".6"') + C(84, 10, 4.4, '#ffe2a8', 'opacity=".9"') + C(84, 10, 8, '#ffd090', 'opacity=".25"')
    + P('M-10 30 Q50 4 110 18', 'none', 'stroke="#ffe0b0" stroke-width="1.6" opacity=".35"') + P('M-10 32 Q50 7 110 20', 'none', 'stroke="#a04a22" stroke-width=".6" stroke-dasharray=".6 1.2" opacity=".6"')
    + P('M0 46 L4 24 L7 28 L10 12 L13 30 L17 46Z', '#9a4420') + P('M66 46 L70 30 L73 34 L77 16 L80 32 L84 26 L88 46Z', '#9a4420') + P('M84 46 L90 20 L94 28 L100 22 L100 46Z', '#8a3c1c') + P('M20 46 L26 34 L30 38 L34 30 L38 46Z', '#ae5428', 'opacity=".8"')
    + [[10, 22], [12, 34], [77, 24], [74, 38], [92, 30]].map(([x, y]) => E(x, y, 0.9, 1.6, '#3a1608')).join('')
    + [[30, 14, 1], [66, 20, 0.8], [58, 8, 0.7], [20, 24, 0.6]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})">${E(0, 0, 0.8, 1.6, '#3a1a0c')}${P('M0 -0.4 L-3.4 -2 L-2.4 0.4Z M0 -0.4 L3.4 -2 L2.4 0.4Z', '#5a2a14', 'opacity=".8"')}</g>`).join('')
    + P('M0 44 C30 36 70 36 100 44 L100 60 C70 52 30 52 0 60Z', '#8a3a1a')
    + [6, 16, 26, 36, 46, 56, 66, 76, 86, 96].map((x) => { const y = 42 + Math.pow((x - 50) / 50, 2) * 6; return P(`M${x - 2} ${y + 10} L${x - 2} ${y + 6} Q${x} ${y + 3} ${x + 2} ${y + 6} L${x + 2} ${y + 10}Z`, '#4a1c0a'); }).join('')
    + [40, 43].map((y, i) => P(`M0 ${y + 4} C30 ${y - 4} 70 ${y - 4} 100 ${y + 4}`, 'none', `stroke="#4a1c0a" stroke-width=".7" stroke-dasharray=".8 1.1" opacity="${0.8 - i * 0.25}"`)).join('')
    + R(0, 58, 100, 42, '#c87438') + P('M0 58 C30 51 70 51 100 58 L100 62 C70 55 30 55 0 62Z', '#a05426')
    + [[18, 72, 10], [76, 74, 12], [50, 90, 22]].map(([x, y, r]) => E(x, y, r, r * 0.18, '#a85a2a', 'opacity=".5"')).join('')
    + E(50, 80, 30, 3, '#5a2810', 'opacity=".35"')
    // far legs (behind the shell)
    + [[42, 62, 34, 52, 30, 78], [58, 62, 66, 52, 70, 78]].map(([a, b, c, d, e, f]) => P(`M${a} ${b} L${c} ${d} L${e} ${f}`, 'none', 'stroke="#2e4a36" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"') + P(`M${e - 1} ${f - 1} L${e} ${f + 3} L${e + 1} ${f - 1}Z`, '#d8d0b0')).join('')
    // the shell: wide crab carapace with plates and a spiny rim
    + P('M24 58 C24 48 36 44 50 44 C64 44 76 48 76 58 C76 64 66 68 50 68 C34 68 24 64 24 58Z', '#4e7a5c')
    + P('M24 58 C24 48 36 44 50 44 L50 68 C34 68 24 64 24 58Z', '#000', 'opacity=".1"')
    + P('M28 56 C30 50 40 47 50 47 C60 47 70 50 72 56', 'none', 'stroke="#86b08a" stroke-width="1.2" opacity=".6"')
    + [[36, 49, 44, 58], [44, 47, 47, 60], [56, 47, 53, 60], [64, 49, 56, 58]].map(([a, b, c, d]) => P(`M${a} ${b} Q${(a + c) / 2 + (a < 50 ? -1 : 1)} ${(b + d) / 2} ${c} ${d}`, 'none', 'stroke="#2e4a36" stroke-width=".8" opacity=".7"')).join('')
    + [[30, 49], [37, 46], [44, 44.6], [56, 44.6], [63, 46], [70, 49]].map(([x, y]) => P(`M${x - 1.4} ${y + 0.6} L${x} ${y - 2.6} L${x + 1.4} ${y + 0.6}Z`, '#2e4a36')).join('')
    + [[34, 54], [40, 52], [60, 52], [66, 54], [46, 56], [54, 56], [38, 60], [62, 60]].map(([x, y]) => E(x, y, 1.4, 0.9, '#3c6448', 'opacity=".8"')).join('')
    + P('M30 63 C38 68 62 68 70 63 C64 70 36 70 30 63Z', '#c0d0a0', 'opacity=".55"')
    // near legs: spider-kneed, spiked feet
    + [[34, 62, 18, 50, 10, 80], [40, 66, 30, 64, 24, 82], [66, 62, 82, 50, 90, 80], [60, 66, 70, 64, 76, 82]].map(([a, b, c, d, e, f]) => P(`M${a} ${b} L${c} ${d}`, 'none', 'stroke="#4e7a5c" stroke-width="3.4" stroke-linecap="round"') + P(`M${a} ${b} L${c} ${d}`, 'none', 'stroke="#86b08a" stroke-width=".9" opacity=".55" transform="translate(0 -.8)"') + P(`M${c} ${d} L${e} ${f}`, 'none', 'stroke="#44705a" stroke-width="2.4" stroke-linecap="round"') + C(c, d, 1.8, '#2e4a36') + P(`M${c} ${d - 1.6} l${c < 50 ? -1.4 : 1.4} -2.4 l${c < 50 ? 2.2 : -2.2} 1.4Z`, '#d8d0b0') + P(`M${e - 1.2} ${f - 1.4} L${e} ${f + 3.4} L${e + 1.2} ${f - 1.4}Z`, '#e8e0c0')).join('')
    // the claw arms: thick segmented arms raised high, huge curved blades
    + [1, -1].map((s) => { const X = (x) => 50 + s * (x - 50); const pts = [[36, 52], [22, 40], [24, 18]];
      return P(`M${X(pts[0][0])} ${pts[0][1]} L${X(pts[1][0])} ${pts[1][1]}`, 'none', 'stroke="#4e7a5c" stroke-width="5" stroke-linecap="round"') + P(`M${X(pts[0][0])} ${pts[0][1] - 1.2} L${X(pts[1][0])} ${pts[1][1] - 1.2}`, 'none', 'stroke="#86b08a" stroke-width="1.2" opacity=".55"')
        + P(`M${X(pts[1][0])} ${pts[1][1]} L${X(pts[2][0])} ${pts[2][1]}`, 'none', 'stroke="#44705a" stroke-width="4" stroke-linecap="round"') + C(X(pts[1][0]), pts[1][1], 2.6, '#2e4a36') + C(X(24), 18, 2.4, '#2e4a36')
        + [[23, 34], [23.4, 29], [23.8, 24]].map(([x, y]) => P(`M${X(x + 1.6)} ${y} l${s * 2.6} -1 l${-s * 1} 2.4Z`, '#d8d0b0')).join('')
        + P(`M${X(24)} 18 C${X(16)} 8 ${X(6)} 10 ${X(2)} 26 C${X(1)} 30 ${X(4)} 30 ${X(5)} 27 C${X(9)} 17 ${X(15)} 15 ${X(22)} 20Z`, '#ece4c4') + P(`M${X(5)} 27 C${X(9)} 17 ${X(15)} 15 ${X(22)} 20`, 'none', 'stroke="#a49a78" stroke-width=".6"')
        + [[8, 18], [11, 15.6], [14.4, 14.6], [18, 15.4]].map(([x, y]) => P(`M${X(x)} ${y + 1.6} l${-s * 0.6} 2 l${s * 1.6} -1.2Z`, '#cfc6a2')).join(''); }).join('')
    // neck: thick, plated, pale throat
    + P('M45 50 C44 44 45 38 46 32 L54 32 C55 38 56 44 55 50Z', '#4e7a5c') + P('M48 50 C47.6 44 48 38 48.6 33 L51.4 33 C52 38 52.4 44 52 50Z', '#c0d0a0', 'opacity=".65"')
    + [36, 40, 44, 48].map((y) => P(`M${46 - (y - 32) * 0.06} ${y} Q50 ${y + 1.2} ${54 + (y - 32) * 0.06} ${y}`, 'none', 'stroke="#2e4a36" stroke-width=".6" opacity=".7"')).join('')
    // head: broad reptile skull, gaping toothy jaws, small dark eyes, back horns
    + P('M40 22 L36 14 L42 19Z M60 22 L64 14 L58 19Z', '#3c6448')
    + P('M38 26 C38 18 44 15 50 15 C56 15 62 18 62 26 L60 30 L40 30Z', '#5e8c66') + P('M40 22 C44 18 56 18 60 22', 'none', 'stroke="#2e4a36" stroke-width=".9"') + P('M44 17 C47 16 53 16 56 17', 'none', 'stroke="#96c098" stroke-width="1" opacity=".6"')
    + P('M40 30 L60 30 L58 33 L42 33Z', '#4a0e10') + P('M41 31 L59 31 L56 38 C53 40.4 47 40.4 44 38Z', '#557e5e') + P('M42 33 L58 33 L55.4 34.6 L44.6 34.6Z', '#6a1414')
    + [41, 43.2, 45.4, 47.6, 49.8, 52, 54.2, 56.4].map((x) => P(`M${x} 30 l1.1 2.6 l1.1 -2.6Z`, '#f4eedc')).join('') + [43, 45.4, 47.8, 50.2, 52.6, 55].map((x) => P(`M${x} 34.6 l1.1 -2.4 l1.1 2.4Z`, '#f4eedc')).join('')
    + C(43, 23, 1.5, '#141008') + C(57, 23, 1.5, '#141008') + C(43.5, 22.5, 0.45, '#ffd08a') + C(57.5, 22.5, 0.45, '#ffd08a') + P('M41.4 21 L45 21.6 M58.6 21 L55 21.6', 'none', 'stroke="#2e4a36" stroke-width=".8"')
    + P('M47.6 26 l.8 1 M52.4 26 l-.8 1', 'none', 'stroke="#1e3024" stroke-width=".7"')
    + [[10, 80], [24, 82], [90, 80], [76, 82]].map(([x, y]) => E(x, y + 1.6, 4, 1.2, '#e8b07a', 'opacity=".5"')).join('')
    + R(0, 0, 100, 100, '#ff9a4a', 'opacity=".06"'));

  // ---------- Mustafar: the Executor, nineteen kilometres of dagger ----------
  // Built in its own frame (stern at x 0, nose at x 120) and rotated into place so every line runs true.
  const rnd = (seed) => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
  const dagger = (len, hw, id, o = {}) => {
    const r = rnd(o.seed || 7); const t = o.edge || 2.4;
    let g = `<defs><linearGradient id="${id}a" x1="0" x2="1"><stop offset="0" stop-color="${o.top || '#b4bac4'}"/><stop offset="1" stop-color="${o.topFar || '#6e7480'}"/></linearGradient><linearGradient id="${id}b" x1="0" x2="1"><stop offset="0" stop-color="${o.low || '#6a707c'}"/><stop offset="1" stop-color="${o.lowFar || '#3a3e48'}"/></linearGradient></defs>`;
    // hull: lit upper face, shaded lower face, the side edge, rim light from the planet below
    g += P(`M0 ${-hw} L${len} 0 L0 0Z`, `url(#${id}a)`) + P(`M0 0 L${len} 0 L0 ${hw}Z`, `url(#${id}b)`) + P(`M0 ${hw} L${len} 0 L${len} .5 L0 ${hw + t}Z`, '#24262e');
    if (o.rim) g += P(`M0 ${hw + t} L${len} .5`, 'none', `stroke="${o.rim}" stroke-width=".5" opacity=".8"`);
    g += P(`M0 ${-hw} L${len} 0`, 'none', 'stroke="#e4e8ee" stroke-width=".35" opacity=".7"');
    // the central spine
    g += P(`M0 -1.3 L${len} 0 L0 1.3Z`, '#9ca2ae') + P(`M0 -1.3 L${len} 0`, 'none', 'stroke="#d8dce2" stroke-width=".25"');
    // longitudinal trenches and cross bulkheads
    g += [0.5, 0.78].map((k) => P(`M0 ${-hw * k} L${len} 0 M0 ${hw * k} L${len} 0`, 'none', 'stroke="#2c3038" stroke-width=".35" opacity=".7"')).join('');
    for (let x = len * 0.08; x < len * 0.92; x += len * (o.step || 0.075)) { const w = hw * (1 - x / len); g += P(`M${x.toFixed(1)} ${(-w).toFixed(2)} L${(x + w * 0.35).toFixed(1)} 0 L${x.toFixed(1)} ${w.toFixed(2)}`, 'none', 'stroke="#2c3038" stroke-width=".3" opacity=".6"'); }
    // surface city: blocks along the spine and plates across both faces
    if (o.city) {
      for (let x = 24; x < len - 10; x += 2.6) { const h = 0.6 + r() * 1.6; g += R(x.toFixed(1), (-1.3 - h).toFixed(2), (1.2 + r() * 1.2).toFixed(1), h.toFixed(2), r() < 0.5 ? '#c4c8d0' : '#8e94a0'); }
      for (let k = 0; k < o.city; k++) { const x = r() * len * 0.9; const w = hw * (1 - x / len); const y = (r() * 2 - 1) * w * 0.85; const dark = y > 0; g += R(x.toFixed(1), y.toFixed(2), (0.8 + r() * 2.4).toFixed(1), (0.3 + r() * 0.7).toFixed(2), dark ? '#2e323a' : '#8a909a', 'opacity=".75"'); }
    }
    if (o.lights) for (let k = 0; k < o.lights; k++) { const x = r() * len * 0.95; const w = hw * (1 - x / len); const y = (r() * 2 - 1) * w * 0.9; g += C(x.toFixed(1), y.toFixed(2), 0.22, '#ffdc9a', `opacity="${(0.5 + r() * 0.5).toFixed(2)}"`); }
    // the stern face and engines
    g += P(`M0 ${-hw} L-2.4 ${-hw + 1.2} L-2.4 ${hw + t + 0.6} L0 ${hw + t}Z`, '#2a2c34');
    if (o.engines) { let e = ''; const n = o.engines; for (let i = 0; i < n; i++) { const y = -hw + 2 + i * ((2 * hw + t - 3) / (n - 1)); const big = i % 4 === 0 || i === n - 1; e += C(-1.2, y.toFixed(2), big ? 1.1 : 0.75, '#c8ecff'); } g += `<g ${glow('#5ab4ff', 2.2)}>${e}</g>`; }
    return g;
  };
  add('executor', () => R(0, 0, 100, 100, '#07030a') + E(70, 24, 46, 30, '#4a0c16', 'opacity=".35"') + E(18, 70, 30, 20, '#2a0a30', 'opacity=".4"') + stars(80, 11, 90, 0.12)
    // Mustafar: cracked black crust, glowing lava rivers, a hot rim
    + `<defs><radialGradient id="b22mu" cx=".35" cy=".25" r=".8"><stop offset="0" stop-color="#3a1408"/><stop offset=".7" stop-color="#1a0704"/><stop offset="1" stop-color="#0c0402"/></radialGradient></defs>`
    + C(70, 128, 58, 'url(#b22mu)') + C(70, 128, 58, 'none', 'stroke="#ff6a1a" stroke-width="1.4" opacity=".85"') + C(70, 128, 60, 'none', 'stroke="#ff8a3a" stroke-width="3.4" opacity=".14"')
    + `<g ${glow('#ff5a10', 1.4)}>${[[24, 92, 36, 86, 48, 90, 58, 84], [44, 80, 56, 76, 66, 80, 78, 74], [70, 92, 80, 86, 92, 90, 100, 84], [86, 76, 94, 74, 100, 78, 100, 78], [34, 99, 48, 95, 60, 99, 72, 94]].map(([a, b, c, d, e, f, g2, h]) => P(`M${a} ${b} Q${c} ${d} ${e} ${f} T${g2} ${h}`, 'none', 'stroke="#ff8a2a" stroke-width=".9"') + P(`M${e} ${f} l2 4`, 'none', 'stroke="#ffb04a" stroke-width=".5"')).join('')}</g>`
    + [[58, 78, 4], [84, 82, 3]].map(([x, y, r]) => `<g ${glow('#ffb04a', 2)}>${C(x, y, r * 0.3, '#ffd08a')}</g>`).join('')
    // escort Star Destroyers, same build, small and far
    + [[14, 30, 0.2], [80, 58, 0.17], [30, 14, 0.14]].map(([x, y, s], i) => `<g transform="translate(${x} ${y}) rotate(-38) scale(${s})">${dagger(60, 18, 'b22esc' + i, { edge: 3, step: 0.2, engines: 3, top: '#9aa0aa', topFar: '#70767f' })}${R(4, -4, 10, 8, '#a8aeb8')}${R(3, -2, 4, 4, '#c0c6ce')}</g>`).join('')
    // the Executor
    + `<g transform="translate(16 76) rotate(-38) scale(.8)">`
    + dagger(120, 13, 'b22exe', { city: 90, lights: 90, engines: 13, rim: '#ff7a2a', seed: 19 })
    // command superstructure at the stern: stepped decks, bridge, twin domes, shadow on the far face
    + P('M2 9 L18 3.6 L26 5 L6 12Z', '#000', 'opacity=".3"')
    + P('M1 -9 L24 -3.2 L24 3.2 L1 9Z', '#8e94a0') + P('M1 -9 L24 -3.2 L24 0 L1 0Z', '#a6acb6')
    + P('M2 -6.4 L16 -2.6 L16 2.6 L2 6.4Z', '#b0b6c0') + P('M2 6.4 L16 2.6 L16 3.6 L2 7.6Z', '#5a606a')
    + R(2, -3, 8, 6, '#c4c9d0') + R(2, 3, 8, 1.2, '#5a606a') + R(1, -5, 2.4, 10, '#9aa0aa') + R(1, 5, 2.4, 1, '#4a4e58')
    + [0.4, 1.4, 2.4].map((d) => L(3, -2.4 + d * 1.8, 9.4, -2.4 + d * 1.8, '#ffd08a', 0.25)).join('')
    + C(2.2, -4.4, 1.4, '#dde1e6') + C(2.2, 4.4, 1.4, '#b8bcc4') + C(2.2, -4.6, 0.5, '#fff', 'opacity=".7"')
    + `</g>`
    // TIE screen
    + fighters([[40, 26, 0.55], [46, 34, 0.45], [74, 42, 0.5], [22, 52, 0.45], [88, 24, 0.4], [60, 62, 0.45]], '#7a808c'));

  // ---------- Exegol: the Sith Trooper Legion marching out of the Citadel ----------
  const sithTrooper = (x, y, s, o = 1) => `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}">${P('M-3 -5 C-3 -9 3 -9 3 -5 L3 -1 L1.4 1 L-1.4 1 L-3 -1Z', '#a8141e')}${P('M-2.2 -4 L2.2 -4 L1.2 -1.6 L.5 -1.4 L.5 .6 L-.5 .6 L-.5 -1.4 L-1.2 -1.6Z', '#140608')}${P('M-5 1 L5 1 L4 10 L-4 10Z', '#1a1012')}${R(-5.4, 1, 3, 2.4, '#a8141e')}${R(2.4, 1, 3, 2.4, '#a8141e')}${R(-2.4, 3, 4.8, 3, '#a8141e')}</g>`;
  add('sith_legion', () => R(0, 0, 100, 100, '#08060c') + R(0, 0, 100, 60, '#2a2440', 'opacity=".45"') + E(50, 18, 60, 22, '#4a4a8a', 'opacity=".25"')
    // lightning across the storm
    + [[6, 0, 12, 10, 8, 20, 14, 30], [94, 0, 88, 12, 92, 22, 86, 36], [62, 0, 58, 8, 64, 14]].map((pts) => { let d = `M${pts[0]} ${pts[1]}`; for (let i = 2; i < pts.length; i += 2) d += ` L${pts[i]} ${pts[i + 1]}`; return `<g ${glow('#a8b8ff', 2)}>${P(d, 'none', 'stroke="#eef2ff" stroke-width=".8"')}</g>`; }).join('')
    // the Sith Citadel: colossal hooded statues and spires in the gloom
    + [[12, 1], [88, -1]].map(([x, f]) => `<g transform="translate(${x} 0) scale(${f} 1)">${P('M-10 64 L-8 30 C-8 20 -4 14 0 14 C4 14 8 20 8 30 L10 64Z', '#16141e')}${P('M-4 22 C-4 18 4 18 4 22 L3 28 L-3 28Z', '#08060a')}${P('M8 30 L14 44 L10 46 L6 36Z', '#16141e')}${C(0, 25, 0.7, '#ff2a3a', 'opacity=".5"')}</g>`).join('')
    + P('M30 60 L34 34 L38 60Z M62 60 L66 30 L70 60Z M44 60 L50 22 L56 60Z', '#120f18') + `<g ${glow('#ff2a3a', 2)}>${C(50, 24, 0.8, '#ff4a4a')}</g>`
    // ranks of the legion fading back into the dark
    + [[54, 0.5, 0.35], [58, 0.65, 0.5], [63, 0.85, 0.7]].map(([y, s, o], row) => Array.from({ length: Math.round(9 / s) }, (_, i) => sithTrooper(((i + 0.5 + (row % 2) * 0.5) * 100 / Math.round(9 / s)).toFixed(1), y, s, o)).join('')).join('')
    + R(0, 66, 100, 34, '#0c0a10') + E(50, 66, 60, 3, '#2a2440', 'opacity=".5"')
    // the Legion commander in front: red armour, angular black visor, blaster rifle
    + P('M24 100 L26 72 C28 64 36 60 50 60 C64 60 72 64 74 72 L76 100Z', '#16100e')
    + P('M26 70 C28 62 36 60 42 60 L40 74 L28 76Z', '#b0161f') + P('M74 70 C72 62 64 60 58 60 L60 74 L72 76Z', '#b0161f') + P('M27 66 C30 62 36 61 41 61', 'none', 'stroke="#ff6a6a" stroke-width=".8" opacity=".6"')
    + P('M40 66 L60 66 L58 80 L50 84 L42 80Z', '#a0121b') + P('M42 70 L58 70 M43 75 L57 75', 'none', 'stroke="#5a0a10" stroke-width=".8"') + R(46, 66, 8, 3, '#2a0a0e')
    // helmet
    + P('M34 36 C34 18 66 18 66 36 L66 48 L60 58 L40 58 L34 48Z', '#b8182a') + P('M34 36 C34 18 50 17 50 17 L50 58 L40 58 L34 48Z', '#000', 'opacity=".12"')
    + P('M38 26 C42 21 58 21 62 26', 'none', 'stroke="#ff7a7a" stroke-width="1.2" opacity=".6"') + P('M50 18 L50 34', 'none', 'stroke="#7a0e16" stroke-width=".8"')
    + P('M37 34 L63 34 L59 42 L54 44 L54 54 L46 54 L46 44 L41 42Z', '#0c0406') + P('M39 35 L48 35 L45 39Z', '#3a2a40', 'opacity=".6"')
    + P('M40 52 L46 56 M60 52 L54 56', 'none', 'stroke="#5a0a10" stroke-width="1"') + R(47, 55, 6, 2.4, '#5a0a10') + [48, 50, 52].map((x) => L(x, 55.3, x, 57, '#1a0406', 0.4)).join('')
    // blaster rifle across the chest
    + P('M18 86 L74 70 L76 73 L20 89Z', '#1a1a1e') + R(56, 72, 10, 3, '#2a2a30', 'transform="rotate(-16 61 73)"') + P('M74 70 L84 67 L84.6 69 L75 72Z', '#2a2a30') + `<g ${glow('#ff3a3a', 1.4)}>${C(85, 68, 0.8, '#ff6a5a')}</g>`
    + R(0, 0, 100, 100, '#ff1a2a', 'opacity=".05"'));

  // ---------- Battle of Coruscant: the Zillo Beast loose in the city ----------
  add('zillo_beast', () => R(0, 0, 100, 100, '#1a1430') + R(0, 40, 100, 60, '#4a2a4a') + E(30, 62, 60, 20, '#ff8a4a', 'opacity=".35"') + stars(18, 5, 30, 0.15)
    // far skyline and the Senate dome
    + Array.from({ length: 16 }, (_, i) => { const x = i * 6.6; const h = 16 + ((i * 37) % 22); return R(x, 72 - h, 5.4, h + 30, '#2a1e38'); }).join('')
    + P('M66 60 C66 52 82 52 82 60Z', '#3a2a48') + R(64, 60, 20, 2, '#3a2a48')
    + Array.from({ length: 60 }, (_, k) => C(((k * 41) % 100).toFixed(1), (40 + (k * 17) % 34).toFixed(1), 0.3, '#ffc87a', `opacity="${0.3 + (k % 4) * 0.12}"`)).join('')
    // speeder traffic lanes
    + [30, 36].map((y, i) => P(`M0 ${y} Q50 ${y - 6} 100 ${y + 2}`, 'none', `stroke="#ffd8a0" stroke-width=".4" stroke-dasharray="1.6 2" opacity="${0.5 - i * 0.15}"`)).join('')
    // near towers the beast is tearing through
    + P('M0 100 L0 40 L10 36 L14 40 L14 100Z', '#1e1628') + P('M84 100 L84 30 L92 24 L100 28 L100 100Z', '#1e1628') + [[3, 44], [8, 50], [4, 60], [10, 70], [88, 36], [94, 44], [88, 56], [96, 66]].map(([x, y]) => R(x, y, 2, 1.2, '#ffc87a', 'opacity=".7"')).join('')
    // the beast: armoured body behind, huge spiked crest, roaring jaws, claw on a tower
    + P('M40 100 C34 80 40 64 56 58 C72 54 86 62 90 80 L92 100Z', '#5a5048') + P('M48 70 C56 62 70 60 80 66', 'none', 'stroke="#8a7e6c" stroke-width="1.2" opacity=".6"')
    + [[52, 66], [60, 61], [68, 60], [76, 62], [83, 67]].map(([x, y]) => P(`M${x - 3} ${y + 1} L${x} ${y - 5} L${x + 3} ${y + 1}Z`, '#a49680')).join('')
    + [[50, 76], [58, 72], [66, 70], [74, 72], [82, 76], [56, 84], [66, 80], [76, 84]].map(([x, y]) => E(x, y, 3.4, 2, '#6c6256', 'opacity=".9"') + P(`M${x - 3} ${y + 0.4} Q${x} ${y + 2.4} ${x + 3} ${y + 0.4}`, 'none', 'stroke="#3a342e" stroke-width=".5"')).join('')
    // neck
    + P('M30 66 C34 54 40 46 48 44 L56 52 C50 54 44 62 42 74Z', '#62584e') + P('M34 64 C38 56 42 50 48 48', 'none', 'stroke="#b8aa8e" stroke-width="1.6" opacity=".5"')
    // crest: a fan of long curved spikes behind the head
    + [[-78, 18], [-56, 24], [-34, 27], [-12, 26], [10, 22], [32, 17]].map(([a, l], i) => { const r = (a - 90) * Math.PI / 180; const cx = 44, cy = 32; const pt = (ang, d) => `${(cx + Math.cos(ang) * d).toFixed(1)} ${(cy + Math.sin(ang) * d).toFixed(1)}`; return P(`M${pt(r - 0.2, 5)} Q${pt(r - 0.12, l * 0.6)} ${pt(r + 0.08, l)} Q${pt(r + 0.1, l * 0.55)} ${pt(r + 0.22, 5)}Z`, i % 2 ? '#b8a684' : '#cdbb98') + P(`M${pt(r, 5)} Q${pt(r - 0.04, l * 0.6)} ${pt(r + 0.08, l * 0.96)}`, 'none', 'stroke="#7a6c58" stroke-width=".5"'); }).join('')
    + C(44, 32, 6, '#5a5048')
    // head: heavy armoured skull, glowing eye, jaws open in a roar
    + P('M24 34 C26 26 36 22 46 26 C52 28 54 34 52 38 L40 40 L22 42Z', '#6c6256') + P('M28 28 C34 25 42 25 48 28', 'none', 'stroke="#a49680" stroke-width="1" opacity=".7"')
    + P('M22 42 L40 40 L52 38 L50 50 C42 52 30 50 20 46Z', '#5a5048') + P('M23 41 L40 39.6 L50 38.6 L48 44 L26 46Z', '#4a1012')
    + [24, 27, 30, 33, 36, 39, 42, 45].map((x) => P(`M${x} ${41.6 - (x - 24) * 0.12} l1.1 2.6 l1.1 -2.8Z`, '#f2ead6')).join('') + [27, 31, 35, 39, 43].map((x) => P(`M${x} 46 l1.2 -2.6 l1.2 2.6Z`, '#f2ead6')).join('')
    + `<g ${glow('#ffb04a', 1.6)}>${E(40, 31, 1.8, 1.1, '#ffc04a')}</g>` + C(40.4, 31, 0.6, '#2a1404') + P('M36 29 L44 28', 'none', 'stroke="#3a342e" stroke-width="1"')
    + [[30, 30], [34, 28], [46, 32]].map(([x, y]) => E(x, y, 1.6, 1, '#5a5048')).join('')
    // claw gripping the tower
    + P('M70 62 C76 54 82 46 86 40 L90 42 C88 50 82 58 76 66Z', '#62584e') + [[86, 38], [89, 40], [91, 44]].map(([x, y]) => P(`M${x} ${y} l2.6 -3 l-.4 3.6Z`, '#e0d6c0')).join('')
    + [[86, 42], [84, 48], [90, 50]].map(([x, y]) => P(`M${x} ${y} l2 3 l-3 1Z`, '#3a2e44')).join('')
    // Republic gunships, searchlights and fire
    + [[60, 16, 1], [22, 12, 0.8], [80, 10, 0.7]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M-5 0 L4 -1 L6 0 L4 1.6 L-4 1.6Z', '#a8b098')}${R(-1, -3, 1.4, 3, '#8a9280')}${P('M-3 -1 L-7 -2 M2 -1 L7 -2', 'none', 'stroke="#8a9280" stroke-width=".8"')}${C(5, 0.4, 0.5, '#7ad0ff')}</g>`).join('')
    + P('M60 18 L36 40 L44 42Z', '#fff8d0', 'opacity=".12"') + P('M22 14 L30 34 L36 30Z', '#fff8d0', 'opacity=".1"')
    + bolt(58, 18, 48, 30, '#ff4a3a') + bolt(80, 12, 70, 36, '#ff4a3a') + bolt(20, 14, 32, 26, '#ff4a3a')
    + `<g ${glow('#ff8a2a', 3)}>${C(12, 52, 1.6, '#ffb03a')}${C(90, 60, 1.4, '#ffb03a')}</g>` + P('M12 50 C10 44 14 38 10 30', 'none', 'stroke="#2a2430" stroke-width="2.4" opacity=".5" stroke-linecap="round"'));

  // ---------- SAVED FOR LATER (raids): a Xyston Star Destroyer rising from the Exegol storm ----------
  add('xyston_22', () => R(0, 0, 100, 100, '#06050a') + R(0, 0, 100, 100, '#3a2a6a', 'opacity=".2"') + E(50, 10, 60, 18, '#5a5aa0', 'opacity=".18"')
    + [[12, 0, 16, 18, 10, 30, 14, 44], [88, 0, 84, 20, 90, 32, 86, 48], [64, 0, 60, 8, 66, 14]].map((pts) => { let d = `M${pts[0]} ${pts[1]}`; for (let i = 2; i < pts.length; i += 2) d += ` L${pts[i]} ${pts[i + 1]}`; return `<g ${glow('#a8b8ff', 2)}>${P(d, 'none', 'stroke="#e8eeff" stroke-width=".9"')}</g>`; }).join('')
    // the Sith fleet in the fog, each with its red cannon glow
    + [[14, 56, 0.5], [86, 52, 0.55], [30, 72, 0.36], [72, 70, 0.4], [6, 34, 0.3], [94, 30, 0.3]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})" opacity=".6">${P('M0 -16 L12 14 L-12 14Z', '#1c1a24')}${P('M0 -16 L-12 14 L0 12Z', '#24222e')}${C(0, -2, 1.6, '#ff2a3a', 'opacity=".8"')}</g>`).join('')
    + `<defs><linearGradient id="b22xyA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3644"/><stop offset="1" stop-color="#1e1c26"/></linearGradient><linearGradient id="b22xyB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4c4658"/><stop offset="1" stop-color="#2a2834"/></linearGradient></defs>`
    // hull: two faces, lightning rim on the edges
    + P('M50 4 L78 74 L50 67 L22 74Z', 'url(#b22xyA)') + P('M50 4 L22 74 L50 67Z', 'url(#b22xyB)')
    + P('M50 4 L22 74', 'none', 'stroke="#c8d0ff" stroke-width=".5" opacity=".8"') + P('M50 4 L78 74', 'none', 'stroke="#8a90c0" stroke-width=".35" opacity=".6"') + P('M22 74 L50 67 L78 74 L78 76 L50 69.4 L22 76Z', '#14121a')
    // plating bands and trenches lit red from inside
    + [16, 24, 32, 40, 48, 56, 64].map((y) => { const hw = (y - 4) * 0.4; return P(`M${50 - hw} ${y} L50 ${y - 1.4} L${50 + hw} ${y}`, 'none', 'stroke="#14121a" stroke-width=".45"'); }).join('')
    + [[0.45], [0.75]].map(([k]) => P(`M50 4 L${50 - 28 * k} ${4 + 70 * 1} M50 4 L${50 + 28 * k} 74`, 'none', 'stroke="#14121a" stroke-width=".35" opacity=".8"')).join('')
    + `<g ${glow('#ff2a3a', 1.2)}>${[28, 44, 60].map((y) => { const hw = (y - 4) * 0.4 * 0.8; return P(`M${50 - hw} ${y + 1} L${50 - hw * 0.3} ${y + 0.4} M${50 + hw * 0.3} ${y + 0.4} L${50 + hw} ${y + 1}`, 'none', 'stroke="#ff3a4a" stroke-width=".35" opacity=".85"'); }).join('')}</g>`
    + Array.from({ length: 50 }, (_, k) => { const y = 14 + ((k * 23) % 56); const hw = (y - 4) * 0.4 * 0.9; const x = 50 + (((k * 37) % 100) / 50 - 1) * hw; return R(x.toFixed(1), y, 1 + (k % 3) * 0.6, 0.5, k % 2 ? '#14121a' : '#5a5466', 'opacity=".8"'); }).join('')
    + Array.from({ length: 40 }, (_, k) => { const y = 12 + ((k * 31) % 60); const hw = (y - 4) * 0.4 * 0.85; const x = 50 + (((k * 53) % 100) / 50 - 1) * hw; return C(x.toFixed(1), y, 0.25, k % 5 ? '#ff6a6a' : '#ffd0c0', 'opacity=".75"'); }).join('')
    // the axial superlaser: long barrel down the keel, red emitter at the bow
    + P('M47.4 22 L52.6 22 L54 64 L46 64Z', '#2e2a36') + P('M47.4 22 L50 22 L50 64 L46 64Z', '#3e3848') + [30, 38, 46, 54].map((y) => L(46.8 - (y - 22) * 0.02, y, 53.2 + (y - 22) * 0.02, y, '#14121a', 0.5)).join('')
    + `<g ${glow('#ff2a3a', 4)}>${E(50, 20, 3.4, 2, '#ff3a3a')}${P('M48 21 L52 21 L50 8Z', '#ff5a4a', 'opacity=".55"')}</g>` + E(50, 20, 1.4, 0.8, '#ffe0d8')
    // command tower at the stern
    + P('M42 58 L58 58 L59 68 L41 68Z', '#3a3644') + R(44, 53, 12, 6, '#46404e') + R(46, 49, 8, 5, '#524a5a') + R(44, 52, 12, 1, '#ff3a4a', 'opacity=".5"') + C(45, 48.4, 1.3, '#5a5466') + C(55, 48.4, 1.3, '#5a5466')
    + `<g ${glow('#ff3a3a', 2)}>${[30, 40, 50, 60, 70].map((x) => C(x, 75, 1, '#ff6a5a')).join('')}</g>`
    + [[10, 86, 24], [36, 90, 22], [64, 88, 26], [90, 90, 22], [24, 98, 26], [76, 99, 28]].map(([x, y, r]) => E(x, y, r, r * 0.35, '#141220')).join('') + [[30, 84, 14], [70, 84, 16]].map(([x, y, r]) => E(x, y, r, r * 0.25, '#2a2440', 'opacity=".7"')).join('') + E(50, 80, 20, 4, '#ff2a3a', 'opacity=".08"'));

  // ---------- SAVED FOR LATER (raids): the Invisible Hand, burning over Coruscant ----------
  add('invisible_hand_22', () => R(0, 0, 100, 100, '#080a14') + stars(30, 31, 50)
    // Coruscant: the night side, city lights, atmosphere
    + C(50, 150, 82, '#140c10') + C(50, 150, 82, 'none', 'stroke="#ffb86a" stroke-width="1.4" opacity=".5"') + C(50, 150, 84, 'none', 'stroke="#4a8aff" stroke-width="2.4" opacity=".2"')
    + Array.from({ length: 70 }, (_, k) => { const a = (k * 37) % 100; const b = 74 + ((k * 13) % 24); const dx = a - 50; const dy = b - 150; return Math.hypot(dx, dy) < 81 ? C(a, b, 0.35 + (k % 3) * 0.15, '#ffc87a', `opacity="${0.4 + (k % 4) * 0.12}"`) : ''; }).join('')
    // Republic Venators and the crossfire
    + [[14, 22, 0.55], [86, 18, 0.5], [90, 46, 0.4]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) rotate(90) scale(${s})">${P('M0 -14 L8 10 L0 8 L-8 10Z', '#c8ccd4')}${P('M0 -12 L3 4 L-3 4Z', '#b83a2a', 'opacity=".8"')}</g>`).join('')
    + bolt(18, 26, 40, 40, '#4ab8ff') + bolt(84, 22, 66, 38, '#4ab8ff') + bolt(46, 46, 26, 60, '#ff3a3a') + bolt(70, 44, 90, 56, '#ff3a3a') + bolt(10, 40, 30, 50, '#4ab8ff')
    + fighters([[30, 30, 0.6], [74, 30, 0.5], [22, 56, 0.6], [80, 60, 0.5], [60, 22, 0.5]], '#c8ccd4')
    // the Invisible Hand: long hull, nose left, tall tower
    + P('M8 50 L22 46 L80 44 L92 46 L94 52 L80 56 L22 56 L8 54Z', '#6a7080') + P('M8 50 L22 46 L80 44 L92 46 L80 49 L22 50Z', '#8a909e') + P('M22 56 L80 56 L94 52 L80 53 L22 53Z', '#4a4e5a')
    + P('M54 45 L58 24 L66 22 L68 44Z', '#6a7080') + P('M58 24 L66 22 L68 44 L62 44Z', '#4e5260') + R(56, 20, 12, 5, '#7a808e', 'rx="1"') + R(57, 21, 10, 1.4, '#ffcf7a', 'opacity=".6"')
    + P('M58 56 L62 66 L66 66 L68 56Z', '#5a5e6a')
    + [26, 34, 42, 50, 72, 80].map((x) => R(x, 49, 4, 2, '#3a3e4a')).join('') + [28, 40, 52, 76].map((x) => C(x, 47.4, 0.5, '#ffd08a')).join('')
    + `<g ${glow('#6ab8ff', 2)}>${[48, 50.6, 53.2].map((y) => C(94.6, y, 1.2, '#bfe8ff')).join('')}</g>`
    // battle damage: fires and smoke
    + `<g ${glow('#ff8a2a', 3)}>${C(36, 46, 1.8, '#ffb03a')}${C(74, 55, 1.6, '#ffb03a')}${C(46, 54, 1.2, '#ffd08a')}</g>`
    + P('M36 45 C34 40 36 34 32 28', 'none', 'stroke="#3a3a40" stroke-width="2.4" opacity=".55" stroke-linecap="round"') + P('M74 54 C78 60 76 66 80 72', 'none', 'stroke="#3a3a40" stroke-width="2" opacity=".5" stroke-linecap="round"'));

  // ---------- REWORK: Imperial Star Destroyer over Hoth ----------
  add('star_destroyer_22', () => R(0, 0, 100, 100, '#03050b') + E(30, 20, 36, 22, '#1a2a5a', 'opacity=".35"') + stars(90, 21, 100, 0.15)
    // Hoth: ice world with cloud bands, craters and a terminator
    + C(82, 18, 14, '#d8e6f0') + `<clipPath id="hothc"><circle cx="82" cy="18" r="14"/></clipPath><g clip-path="url(#hothc)">`
    + [[78, 10, 9, 2.4], [86, 16, 10, 2], [80, 24, 12, 2.6], [74, 18, 6, 1.6]].map(([x, y, rx, ry]) => E(x, y, rx, ry, '#f4f8fc', 'opacity=".8"')).join('')
    + [[85, 22, 1.6], [78, 14, 1.2], [88, 11, 1]].map(([x, y, r]) => C(x, y, r, '#b4c8d8')).join('')
    + C(90, 24, 16, '#0a1424', 'opacity=".55"') + '</g>' + C(82, 18, 14, 'none', 'stroke="#bfe0ff" stroke-width=".8" opacity=".7"') + C(82, 18, 15.4, 'none', 'stroke="#6ab8ff" stroke-width="1.6" opacity=".2"')
    // hull
    + P('M50 4 L84 86 L50 80 L16 86Z', '#b4bac4') + P('M50 4 L16 86 L50 80Z', '#d6dae0') + P('M50 4 L84 86 L50 80Z', '#868c98')
    + L(50, 6, 50, 80, '#5a606c', 0.8) + [18, 28, 38, 48, 58, 68, 76].map((y) => { const hw = (y - 4) * 0.415; return L(50 - hw, y, 50 + hw, y, '#6a707c', 0.45, 'opacity=".7"'); }).join('')
    + [[0.25, -0.5], [0.4, -0.6], [0.55, -0.5], [0.7, -0.62], [0.32, 0.5], [0.48, 0.58], [0.62, 0.5], [0.78, 0.6]].map(([k, side]) => { const y = 4 + 76 * k; const x = 50 + side * (y - 4) * 0.36; return R(x - 2, y, 4, 2.4, side < 0 ? '#b0b6c0' : '#6e7480') + R(x - 1.2, y + 0.6, 2.4, 1, side < 0 ? '#9aa0aa' : '#5a606a'); }).join('')
    + [[30, 72], [36, 60], [62, 58], [70, 72], [44, 40], [56, 42], [24, 80], [76, 80]].map(([x, y]) => C(x, y, 0.4, '#ffe8b0', 'opacity=".9"')).join('')
    + P('M24 84 L30 82 M70 82 L76 84', 'none', 'stroke="#4a4e58" stroke-width="1"')
    // superstructure, bridge, shield domes
    + P('M40 52 L60 52 L62 72 L38 72Z', '#9aa0aa') + P('M40 52 L50 52 L50 72 L38 72Z', '#b0b6c0') + P('M43 58 L57 58 L58 70 L42 70Z', '#7a808a') + R(41, 70, 18, 6, '#8a909a')
    + R(46.5, 60, 7, 9, '#6a707a') + R(43.6, 57.6, 12.8, 3.2, '#5a606a') + C(44.4, 57, 1.8, '#d0d4da') + C(55.6, 57, 1.8, '#d0d4da') + L(44.4, 55.2, 44.4, 53.6, '#d0d4da', 0.5) + L(55.6, 55.2, 55.6, 53.6, '#d0d4da', 0.5)
    + R(46, 60.4, 8, 0.8, '#ffe8b0', 'opacity=".7"')
    + `<g ${glow('#4ab8ff', 3)}>${C(38, 87, 3, '#9ad8ff')}${C(50, 88, 3.6, '#bfe8ff')}${C(62, 87, 3, '#9ad8ff')}${C(44, 86.4, 1.4, '#9ad8ff')}${C(56, 86.4, 1.4, '#9ad8ff')}</g>`
    + fighters([[20, 44, 0.6], [26, 36, 0.5], [78, 50, 0.6]], '#7a808c'));

  // ---------- General Grievous update (2.2): new card portrait ----------
  {
  const { saber } = root.ArtX;
  const glow = (c, b = 2) => `style="filter:drop-shadow(0 0 ${b}px ${c})"`;
  const BONE = '#e4dcc4', BONE_S = '#bfb497', BONE_D = '#978c70', LIMB = '#3a3c42', LIMB_H = '#5e626a', STEEL = '#80858e', CAPE = '#4c5872', CAPE_D = '#2c3446';

  // A limb: dark skeletal upper arm, forearm sheathed in a bone plate, clawed hand.
  const limb = ([sx, sy], [ex, ey], [hx, hy], far) => {
    const k = far ? 0.8 : 1;
    const dx = hx - ex, dy = hy - ey, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len, w = 2.1 * k;
    const plate = `M${(ex + nx * w).toFixed(2)} ${(ey + ny * w).toFixed(2)} L${(ex + dx * 0.85 + nx * w * 0.7).toFixed(2)} ${(ey + dy * 0.85 + ny * w * 0.7).toFixed(2)} L${(ex + dx * 0.85 - nx * w * 0.4).toFixed(2)} ${(ey + dy * 0.85 - ny * w * 0.4).toFixed(2)} L${(ex - nx * w * 0.6).toFixed(2)} ${(ey - ny * w * 0.6).toFixed(2)}Z`;
    return L(sx, sy, ex, ey, LIMB, 2.8 * k) + L(sx, sy, ex, ey, LIMB_H, 0.6 * k) + L(ex, ey, hx, hy, LIMB, 2.3 * k)
      + P(plate, far ? BONE_S : BONE) + P(plate, 'none', `stroke="${BONE_D}" stroke-width=".3"`)
      + C(ex, ey, 1.5 * k, '#2a2c31') + C(ex, ey, 0.6 * k, STEEL) + C(sx, sy, 1.8 * k, '#2a2c31')
      + C(hx, hy, 1.2 * k, '#2a2c31');
  };

  // The head: long narrow skull mask, grooves through the eyes, sunken soulless eyes,
  // slatted grille at the end of the muzzle, tall curved side plates.
  const HEAD_OUT = 'M37 32 C37 24 39.4 19.6 43.4 18.4 C46 17.8 54 17.8 56.6 18.4 C60.6 19.6 63 24 63 32 L63 41 L58.2 47.6 L57.2 58 C56.6 61.6 53.2 63 50 63 C46.8 63 43.4 61.6 42.8 58 L41.8 47.6 L37 41Z';
  const head = () =>
    // mechanical innards behind the mask
    P('M34 28 C34 22 66 22 66 28 L66 56 L34 56Z', '#16171b') + [38, 44, 50].map((y) => L(35, y, 65, y, '#2a2c33', 0.8)).join('')
    // the tall curved side plates
    + [1, -1].map((s) => { const X = (x) => 50 + s * (x - 50); return P(`M${X(39.4)} 58 C${X(34.4)} 50 ${X(32.6)} 40 ${X(33.2)} 30 L${X(34.4)} 13 L${X(36.4)} 29 C${X(36)} 38 ${X(37.4)} 47 ${X(41.4)} 55Z`, s > 0 ? STEEL : '#666b74')
      + P(`M${X(34.5)} 15 L${X(36)} 29 C${X(35.6)} 38 ${X(36.8)} 46 ${X(40.6)} 53`, 'none', `stroke="${s > 0 ? '#b4b9c0' : '#8a8f96'}" stroke-width=".5"`)
      + [32, 37, 42].map((y) => L(X(33 + (y - 32) * 0.04), y, X(35.2 + (y - 32) * 0.04), y, '#4a4e56', 0.5)).join(''); }).join('')
    // the mask: rounded dome, straight sides, straight cheek lines into a short muzzle
    + P(HEAD_OUT, BONE)
    + P('M50 17.9 C54 17.9 55.4 18 56.6 18.4 C60.6 19.6 63 24 63 32 L63 41 L58.2 47.6 L57.2 58 C56.6 61.6 53.2 63 50 63Z', '#000', 'opacity=".15"')
    + P('M37.4 41.4 L42 47.6 M62.6 41.4 L58 47.6', 'none', `stroke="${BONE_D}" stroke-width=".6"`) + P('M41.8 47.6 L48 46.4 M58.2 47.6 L52 46.4', 'none', `stroke="${BONE_D}" stroke-width=".45"`) + P('M38.4 31 L38.4 40.6', 'none', 'stroke="#fff6e0" stroke-width=".6" opacity=".45"')
    + P('M44 19.2 C47 18.6 53 18.6 56 19.2', 'none', 'stroke="#fff6e0" stroke-width="1" opacity=".7"')
    + P('M38.4 30 C38.6 25 40.4 21.4 43.4 19.8', 'none', 'stroke="#fff6e0" stroke-width=".7" opacity=".5"')
    // the two grooves running down through the eyes
    + P('M45.2 18.6 C45 25 44.9 31 45 35.4 M54.8 18.6 C55 25 55.1 31 55 35.4', 'none', 'stroke="#2a241a" stroke-width="1"')
    + P('M45.3 41 C45.5 44 45.9 47 46.3 50 M54.7 41 C54.5 44 54.1 47 53.7 50', 'none', 'stroke="#5a5040" stroke-width=".6"')
    // sunken eyes: dark red-rimmed sockets, small yellow irises under heavy lids
    + '<g transform="translate(50 37.8) translate(-50 -39.9)">' + [1, -1].map((s) => { const X = (x) => 50 + s * (x - 50);
      return P(`M${X(39.4)} 38.4 C${X(41.4)} 35.6 ${X(46.6)} 35.8 ${X(48.6)} 39 C${X(47.4)} 43 ${X(42.4)} 43.6 ${X(39.8)} 41.6Z`, '#4a1812')
        + P(`M${X(39.8)} 38.6 C${X(41.8)} 36.2 ${X(46.4)} 36.4 ${X(48.1)} 39.2 C${X(47)} 42.6 ${X(42.6)} 43 ${X(40.2)} 41.3Z`, '#070302') + E(X(44.6), 40.2, 2.6, 1.9, '#000')
        + C(X(44.6), 40.3, 1.5, '#3a2a08') + `<g ${glow('#b8a42a', 0.6)}>${C(X(44.6), 40.3, 1.1, '#c8b838')}</g>` + C(X(44.6), 40.3, 0.5, '#0a0602') + C(X(44.2), 39.9, 0.2, '#fff8c8', 'opacity=".55"')
        + P(`M${X(39.2)} 38.2 C${X(41.6)} 36.4 ${X(46.8)} 36.6 ${X(48.8)} 39.4 C${X(46.6)} 39.6 ${X(42.6)} 39.2 ${X(39.4)} 39.6Z`, BONE_S)
        + P(`M${X(40)} 42 C${X(42.6)} 43.4 ${X(46.6)} 43 ${X(48.4)} 40.4`, 'none', `stroke="${BONE_D}" stroke-width=".5"`); }).join('') + '</g>'
    // muzzle ridge and the slatted grille
    + P('M50 41 L51.2 47 L50 50.5 L48.8 47Z', BONE_S, 'opacity=".7"')
    + P('M45.6 52.6 L54.4 52.6 L54 60.6 C53.2 62.2 46.8 62.2 46 60.6Z', '#24201a') + [47, 48.7, 50.4, 52.1].map((x) => R(x, 53.2, 0.9, 7.6, BONE_S)).join('') + R(45.6, 52.4, 8.8, 0.8, BONE_D);

  // Big skeletal claw gripping a saber hilt: palm, bone knuckle plate, three wrapped fingers, thumb.
  const hand = (hx, hy, tx, ty) => {
    const len = Math.hypot(tx - hx, ty - hy) || 1, ax = (tx - hx) / len, ay = (ty - hy) / len, nx = -ay, ny = ax;
    const pt = (a, n) => `${(hx + ax * a + nx * n).toFixed(2)} ${(hy + ay * a + ny * n).toFixed(2)}`;
    return C(hx, hy, 2.6, '#2a2c31')
      + P(`M${pt(-2.2, -2.8)} L${pt(2.2, -2.8)} L${pt(2.6, -1.2)} L${pt(-2.6, -1.2)}Z`, BONE) + P(`M${pt(-2.2, -2.8)} L${pt(2.2, -2.8)}`, 'none', `stroke="${BONE_D}" stroke-width=".35"`)
      + [-1.4, 0, 1.4].map((a) => L(+pt(a, -1.4).split(' ')[0], +pt(a, -1.4).split(' ')[1], +pt(a, 2.4).split(' ')[0], +pt(a, 2.4).split(' ')[1], '#2a2c31', 1.1) + C(+pt(a, 2.4).split(' ')[0], +pt(a, 2.4).split(' ')[1], 0.55, LIMB_H)).join('')
      + L(+pt(-2.4, 1).split(' ')[0], +pt(-2.4, 1).split(' ')[1], +pt(-3.6, 2.6).split(' ')[0], +pt(-3.6, 2.6).split(' ')[1], '#2a2c31', 1);
  };

  // B body, layered: cape hanging behind, rib cage, arms, cape draped over the shoulders, collar.
  const capeBack = () => P('M29 66 C17 70 9 82 5 100 L95 100 C91 82 83 70 71 66Z', CAPE)
    + P('M5 100 C9 84 15 76 24 71 L19 100Z', '#171c25') + P('M95 100 C91 84 85 76 76 71 L81 100Z', '#171c25')
    + P('M19 100 C19 90 21 80 24 71', 'none', 'stroke="#52607a" stroke-width=".7"') + P('M81 100 C81 90 79 80 76 71', 'none', 'stroke="#52607a" stroke-width=".7"')
    + P('M29 76 C27 84 27 92 28 100 M71 76 C73 84 73 92 72 100 M24 84 C23 90 23 95 23.6 100 M76 84 C77 90 77 95 76.4 100', 'none', `stroke="${CAPE_D}" stroke-width="1.1"`)
    + P('M26 80 C25 87 25 94 25.6 100 M74 80 C75 87 75 94 74.4 100', 'none', 'stroke="#6a7894" stroke-width=".7" opacity=".8"')
    + P('M29 66 C17 70 9 82 5 100', 'none', 'stroke="#8a98b4" stroke-width=".8" opacity=".7"') + P('M71 66 C83 70 91 82 95 100', 'none', 'stroke="#ff8a4a" stroke-width=".8" opacity=".6"');
  // Torso armour: layered bone plates down to the bottom of the card, dark machinery in the gaps.
  const ribcage = () => {
    const sym = (d, fill, extra = '') => P(d, fill, extra) + P(d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${(100 - +x).toFixed(2)} ${y}`), fill === BONE ? BONE_S : fill, extra);
    // machinery behind the plates
    let g = P('M37 72 L63 72 L61 104 L39 104Z', '#16171b')
      + [84, 90, 96, 102].map((y) => L(40, y, 60, y, '#2c2e35', 0.7)).join('')
      + P('M44 80 C43 88 45 96 44 104 M56 80 C57 88 55 96 56 104', 'none', 'stroke="#3a3d44" stroke-width="1.4"')
      + P('M47 82 L47 104 M53 82 L53 104', 'none', 'stroke="#5e626a" stroke-width=".6"');
    // chest plate under the collar
    g += P('M36.6 70 L63.4 70 L62 79 L55 81.4 L45 81.4 L38 79Z', BONE) + P('M50 70 L63.4 70 L62 79 L55 81.4 L50 81.4Z', '#000', 'opacity=".12"')
      + P('M38 79 L45 81.4 L55 81.4 L62 79', 'none', `stroke="${BONE_D}" stroke-width=".5"`) + L(54.4, 72.4, 56.6, 79.4, '#5a5040', 0.6) + L(42, 73, 44.6, 75.4, '#5a5040', 0.45)
      + [[40, 72.4], [60, 72.4], [41.4, 77.6], [58.6, 77.6]].map(([x, y]) => C(x, y, 0.45, BONE_D)).join('');
    // chevron plates stacked down the abdomen, each overlapping the next
    [[82.6, 11.4, 4.6], [88.4, 10.4, 4.4], [94, 9.6, 4.4], [99.6, 9, 5]].forEach(([y, w, h], i) => {
      g += sym(`M50 ${y + 2} L${50 - w} ${y} L${50 - w + 1} ${y + h} L50 ${y + h + 2}Z`, BONE)
        + P(`M${50 - w} ${y} L50 ${y + 2} L${50 + w} ${y}`, 'none', 'stroke="#fff6e0" stroke-width=".4" opacity=".6"')
        + P(`M${50 - w + 1} ${y + h} L50 ${y + h + 2} L${50 + w - 1} ${y + h}`, 'none', `stroke="${BONE_D}" stroke-width=".5"`)
        + C(50 - w + 2.2, y + 1.6, 0.4, BONE_D) + C(50 + w - 2.2, y + 1.6, 0.4, BONE_D);
      if (i === 1) g += L(52.6, y + 1.4, 55.4, y + 4.4, '#5a5040', 0.5);
    });
    // side plates over the flanks, and a small status light
    g += sym('M36.8 81 L40.6 82.4 L40 92 L37.6 90Z', BONE_S);
    return g;
  };
  // Motion trails behind a saber spinning around the hand: ghost blade and arcs.
  const spin = (hx, hy, tx, ty, color, dir) => {
    const r = Math.hypot(tx - hx, ty - hy), a0 = Math.atan2(ty - hy, tx - hx), sweep = -dir * 0.85;
    const at = (rr, a) => `${(hx + Math.cos(a) * rr).toFixed(2)} ${(hy + Math.sin(a) * rr).toFixed(2)}`;
    const arc = (rr, w, o) => P(`M${at(rr, a0)} A${rr.toFixed(2)} ${rr.toFixed(2)} 0 0 ${dir > 0 ? 0 : 1} ${at(rr, a0 + sweep)}`, 'none', `stroke="${color}" stroke-width="${w}" stroke-linecap="round" opacity="${o}"`);
    const ghost = (k, o) => L(+at(r * 0.15, a0 + sweep * k).split(' ')[0], +at(r * 0.15, a0 + sweep * k).split(' ')[1], +at(r, a0 + sweep * k).split(' ')[0], +at(r, a0 + sweep * k).split(' ')[1], color, 1.6).replace('/>', ` opacity="${o}"/>`);
    return `<g ${glow(color, 2)}>` + P(`M${at(r * 0.2, a0)} L${at(r, a0)} A${r.toFixed(2)} ${r.toFixed(2)} 0 0 ${dir > 0 ? 0 : 1} ${at(r, a0 + sweep * 0.7)} L${at(r * 0.2, a0 + sweep * 0.7)}Z`, color, 'opacity=".12"')
      + ghost(0.3, 0.32) + ghost(0.6, 0.16) + arc(r * 0.98, 1.2, 0.55) + arc(r * 0.8, 0.6, 0.4) + arc(r * 0.6, 0.5, 0.3) + '</g>';
  };
  const drapes = () => [1, -1].map((s) => { const X = (x) => 50 + s * (x - 50); return P(`M${X(16)} 76 C${X(20)} 66 ${X(32)} 63 ${X(41)} 67.6 L${X(39.4)} 75 C${X(32)} 73.4 ${X(24)} 76 ${X(17)} 84Z`, s > 0 ? CAPE : '#3c4760')
    + P(`M${X(18)} 76 C${X(23)} 69 ${X(31)} 67.4 ${X(38.6)} 70`, 'none', `stroke="${s > 0 ? '#5a6880' : '#3e4a5c'}" stroke-width=".7"`) + P(`M${X(17)} 84 C${X(24)} 76 ${X(32)} 73.4 ${X(39.4)} 75`, 'none', `stroke="${CAPE_D}" stroke-width=".8"`); }).join('');
  const collar = () => P('M27 69 C35.6 62 64.4 62 73 69 L71.4 76 C62 70.4 38 70.4 28.6 76Z', BONE) + P('M50 63.4 C59 63.6 66.6 65.4 73 69 L71.4 76 C64 71.8 57 70.8 50 70.8Z', '#000', 'opacity=".14"')
    + P('M30 72 C37.6 67.4 62.4 67.4 70 72', 'none', `stroke="${BONE_D}" stroke-width=".6"`) + L(35, 73.4, 41, 71.6, '#5a5040', 0.6) + L(59, 71.6, 65, 73.4, '#5a5040', 0.6);

  // General Grievous on the bridge of the Invisible Hand, the Coruscant battle burning outside.
  add('grievous_22', () => R(0, 0, 100, 100, '#101218')
    + P('M6 4 L94 4 L88 56 L12 56Z', '#1a0e14') + E(50, 70, 60, 26, '#ff6a2a', 'opacity=".25"')
    + C(50, 120, 66, '#1a1018') + C(50, 120, 66, 'none', 'stroke="#ffaa5a" stroke-width="1" opacity=".5"')
    + Array.from({ length: 40 }, (_, k) => C(((k * 37) % 76 + 12).toFixed(1), (6 + (k * 13) % 48).toFixed(1), 0.25, '#fff', `opacity="${0.3 + (k % 4) * 0.15}"`)).join('')
    + [[20, 20, 0.5], [78, 14, 0.42], [66, 34, 0.32]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M-14 0 L10 -4 L14 0 L10 4Z', '#c8ccd4')}${P('M-6 -2 L4 -2 L2 -8 L-4 -8Z', '#b83a2a', 'opacity=".8"')}</g>`).join('')
    + `<g ${glow('#ff4a3a', 1.2)}>${L(24, 24, 40, 34, '#ff5a4a', 0.7)}${L(74, 18, 60, 30, '#4ab8ff', 0.7)}${L(14, 42, 32, 48, '#4ab8ff', 0.7)}</g>`
    + `<g ${glow('#ff8a2a', 3)}>${C(30, 44, 1.6, '#ffb03a')}${C(82, 32, 1.2, '#ffd08a')}</g>`
    + P('M6 4 L94 4 L88 56 L12 56Z', 'none', 'stroke="#3a3e48" stroke-width="2.4"') + L(28, 4, 30, 56, '#3a3e48', 1.6) + L(72, 4, 70, 56, '#3a3e48', 1.6) + L(9, 30, 91, 30, '#3a3e48', 1.2)
    + R(0, 56, 100, 44, '#1a1c22') + R(0, 56, 100, 2, '#ff5a2a', 'opacity=".35"')
    + [[6, 62], [12, 64], [86, 62], [92, 64]].map(([x, y], i) => R(x, y, 3, 1.2, i % 2 ? '#ff4a3a' : '#ffb03a', 'opacity=".8"')).join('')
    // the cape hangs behind him, then the rib cage, the lower arms, the drape over his shoulders, the collar
    + capeBack() + ribcage()
    + limb([38, 80], [30, 92], [28, 86]) + limb([62, 80], [70, 92], [72, 86])
    + spin(28, 86, 16, 98, '#46e070', 1) + spin(72, 86, 84, 98, '#3d8bff', -1)
    + saber(28, 86, 16, 98, '#46e070') + saber(72, 86, 84, 98, '#3d8bff') + hand(28, 86, 16, 98) + hand(72, 86, 84, 98)
    + limb([30, 72], [21, 62], [22, 46]) + limb([70, 72], [79, 62], [78, 46])
    + drapes() + collar()
    + spin(22, 46, 15, 6, '#3d8bff', 1) + spin(78, 46, 85, 6, '#46e070', -1)
    + saber(22, 46, 15, 6, '#3d8bff') + saber(78, 46, 85, 6, '#46e070') + hand(22, 46, 15, 6) + hand(78, 46, 85, 6)
    + head()
    + P('M63 30 L63 41 L58.2 47.6 L57.2 58', 'none', 'stroke="#ff8a4a" stroke-width=".6" opacity=".75"'));
  }

  // Sith Trooper: the Legion's rank and file.
  add('sith_trooper', () => R(0, 0, 100, 100, '#0a080e') + R(0, 0, 100, 70, '#2a2440', 'opacity=".45"')
    + `<g style="filter:drop-shadow(0 0 2px #a8b8ff)">${P('M10 0 L16 12 L11 22 L17 34', 'none', 'stroke="#eef2ff" stroke-width=".8"')}${P('M90 0 L84 14 L89 24', 'none', 'stroke="#eef2ff" stroke-width=".8"')}</g>`
    + P('M2 70 L6 40 C6 32 10 28 14 28 C18 28 22 32 22 40 L26 70Z', '#16141e', 'opacity=".8"') + P('M74 70 L78 40 C78 32 82 28 86 28 C90 28 94 32 94 40 L98 70Z', '#16141e', 'opacity=".8"')
    + P('M22 100 L24 76 C26 68 36 64 50 64 C64 64 74 68 76 76 L78 100Z', '#16100e')
    + P('M24 74 C26 66 34 64 40 64 L38 78 L26 80Z', '#b0161f') + P('M76 74 C74 66 66 64 60 64 L62 78 L74 80Z', '#b0161f') + P('M40 70 L60 70 L58 86 L50 90 L42 86Z', '#a0121b')
    + P('M32 40 C32 20 68 20 68 40 L68 52 L61 62 L39 62 L32 52Z', '#b8182a') + P('M32 40 C32 20 50 19 50 19 L50 62 L39 62 L32 52Z', '#000', 'opacity=".12"') + P('M37 29 C42 24 58 24 63 29', 'none', 'stroke="#ff7a7a" stroke-width="1.2" opacity=".6"')
    + P('M35 38 L65 38 L60 46 L55 48 L55 58 L45 58 L45 48 L40 46Z', '#0c0406') + P('M37 39 L48 39 L44 43Z', '#3a2a40', 'opacity=".6"') + R(46.5, 59, 7, 2.4, '#5a0a10')
    + R(0, 0, 100, 100, '#ff1a2a', 'opacity=".05"'));
  }

  // ---------- Units ----------
  const dmg = (mult, hits) => ({ type: 'damage', mult, hits: hits || 1 });
  const heal = (pct) => ({ type: 'heal', pct });
  const buff = (status, turns) => ({ type: 'status', status, turns, chance: 1 });
  const debuff = (status, turns, chance) => ({ type: 'status', status, turns, chance: chance == null ? 1 : chance });
  const U = (name, target, effects, desc, quote) => ({ name, cd: 0, target, effects, desc, quote, ultimate: true });

  // mech: the boss's special rules, run by the battle hooks below.
  //   submerge {every, heal}       dives under every N of its turns: untargetable until its next turn, heals
  //   shield [ids]                 takes half damage while any escort with one of these ids is alive
  //   charge {every, turns, mult}  every N of its turns charges a superlaser for `turns` turns, then fires
  //   cleave                       single-target attacks also hit a second enemy
  //   frenzy                       below 50% health it acts twice in a row
  //   relaunch {ids, every, count} every N of its turns brings back fallen escorts with these ids
  //   aura {from, status}          while the escort `from` lives, every ally keeps `status`
  //   scales                       takes this fraction of damage from basic attacks
  const BOSSES22 = [
    {
      id: 'dragonsnake', name: 'The Dragonsnake', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 122,
      boss: { hp: 9, atk: 1.15, def: 1.2 }, mech: { submerge: { every: 3, heal: 0.1 } },
      abilities: [
        { name: 'Snapping Jaws', cd: 0, target: 'enemy', effects: [dmg(1.3)], desc: 'Deal damage to one enemy.' },
        { name: 'Swamp Drag', cd: 3, target: 'enemy', effects: [dmg(1.1), debuff('stun', 1)], desc: 'Drag one enemy under: damage and Stun.' },
        { name: 'Coil Thrash', cd: 4, target: 'allEnemies', effects: [dmg(0.8), debuff('defDown', 2, 0.4)], desc: 'Damage all enemies with a 40% chance of Defense Down.' },
      ],
      ultimate: U('Bog Terror', 'allEnemies', [dmg(1.8), debuff('stun', 1, 0.35)], 'Erupts from the swamp: heavy damage to all enemies with a 35% Stun chance.', 'Something moves beneath the water...'),
    },
    {
      id: 'death_star_2', name: 'Death Star II', kind: 'ship', faction: 'dark', rarity: 'legendary', role: 'support', shape: 'deathstar', portrait: 'death_star_2', spd: 92,
      boss: { hp: 7, atk: 1.3, def: 1.3 }, mech: { shield: ['lambda_shuttle'], charge: { every: 4, turns: 3, mult: 6 } },
      abilities: [
        { name: 'Turbolaser Grid', cd: 0, target: 'enemy', effects: [dmg(1.2)], desc: 'Deal damage to one enemy.' },
        { name: 'Defense Network', cd: 4, target: 'allEnemies', effects: [dmg(0.9), debuff('offDown', 2, 0.5)], desc: 'Damage all enemies with a 50% chance of Offense Down.' },
        { name: 'Reinforced Plating', cd: 4, target: 'self', effects: [heal(0.07), buff('defUp', 2)], desc: 'Heal 7% and gain Defense Up.' },
      ],
      ultimate: U('Fully Operational', 'enemy', [dmg(5.5)], 'The superlaser fires on one ship.', 'Fire at will, Commander.'),
    },
    {
      id: 'acklay', name: 'The Acklay', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 134,
      boss: { hp: 7, atk: 0.92, def: 1.15 }, mech: { cleave: true, frenzy: true },
      abilities: [
        { name: 'Scythe Claws', cd: 0, target: 'enemy', effects: [dmg(1.2)], desc: 'Slash one enemy; the second claw catches another.' },
        { name: 'Pincer Lunge', cd: 3, target: 'enemy', effects: [dmg(1.8), debuff('defDown', 2)], desc: 'Heavy damage and Defense Down.' },
        { name: 'Arena Stomp', cd: 4, target: 'allEnemies', effects: [dmg(0.85), debuff('stun', 1, 0.3)], desc: 'Damage all enemies with a 30% Stun chance.' },
      ],
      ultimate: U('Petranaki Massacre', 'allEnemies', [dmg(1.9), debuff('defDown', 2)], 'A whirl of claws: heavy damage and Defense Down to every enemy.', 'The crowd roars for blood.'),
    },
    {
      id: 'executor', name: 'The Executor', kind: 'ship', faction: 'dark', rarity: 'legendary', role: 'tank', shape: 'isd', portrait: 'executor', spd: 100,
      boss: { hp: 6, atk: 0.95, def: 1.2 }, mech: { relaunch: { ids: ['tie_fighter'], every: 2, count: 2, text: 'The Executor launches fresh TIE fighters!' }, aura: { from: 'tie_defender', status: 'offUp', text: 'Command Bridge: every Imperial ship gains Offense Up while the TIE Defender escort survives.' } },
      abilities: [
        { name: 'Turbolaser Barrage', cd: 0, target: 'enemy', effects: [dmg(1.2)], desc: 'Deal damage to one enemy.' },
        { name: 'Concussion Volley', cd: 3, target: 'allEnemies', effects: [dmg(0.85), debuff('burn', 2, 0.5)], desc: 'Damage all enemies with a 50% chance to Burn.' },
        { name: 'Tractor Lock', cd: 4, target: 'enemy', effects: [dmg(1.0), debuff('stun', 1), debuff('defDown', 2)], desc: 'Damage, Stun and Defense Down.' },
      ],
      ultimate: U('Nineteen Kilometres of Firepower', 'allEnemies', [dmg(2.1), debuff('burn', 2)], 'Every battery fires: heavy damage and Burn to all enemies.', 'Bring my shuttle.'),
    },
    {
      id: 'sith_legion', name: 'Sith Trooper Legion', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 130, traits: ['trooper'],
      boss: { hp: 7, atk: 1.1, def: 1.25 }, mech: { relaunch: { ids: ['sith_trooper'], every: 2, count: 1, text: 'Another Sith Trooper marches into the line!' } },
      abilities: [
        { name: 'Commander\'s Rifle', cd: 0, target: 'enemy', effects: [dmg(1.2)], desc: 'Deal damage to one enemy.' },
        { name: 'Red Volley', cd: 3, target: 'allEnemies', effects: [dmg(0.95)], desc: 'The whole legion fires: damage all enemies.' },
        { name: 'Hold the Line', cd: 4, target: 'allAllies', effects: [buff('offUp', 2), heal(0.08)], desc: 'All allies gain Offense Up and heal 8%.' },
      ],
      ultimate: U('The Final Order', 'allEnemies', [dmg(1.9), debuff('offDown', 2)], 'Ranks fire as one: heavy damage and Offense Down to every enemy.', 'The Sith Eternal will rise.'),
    },
    {
      id: 'zillo_beast', name: 'The Zillo Beast', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 115,
      boss: { hp: 10, atk: 1.2, def: 1.3 }, mech: { scales: 0.6 },
      abilities: [
        { name: 'Crushing Bite', cd: 0, target: 'enemy', effects: [dmg(1.35)], desc: 'Deal damage to one enemy.' },
        { name: 'Rampage', cd: 3, target: 'allEnemies', effects: [dmg(1.0), { type: 'stunOne' }], desc: 'Smash all enemies; a falling tower stuns one of them.' },
        { name: 'Armoured Hide', cd: 4, target: 'self', effects: [heal(0.06), buff('defUp', 2)], desc: 'Heal 6% and gain Defense Up.' },
      ],
      ultimate: U('Unstoppable', 'allEnemies', [dmg(2.0), debuff('stun', 1, 0.4)], 'Tears through the city: heavy damage to all enemies with a 40% Stun chance.', 'Nothing on Coruscant can hold it.'),
    },
  ];
  const MINIONS22 = [
    {
      id: 'sith_trooper', name: 'Sith Trooper', kind: 'character', faction: 'dark', rarity: 'rare', role: 'attacker', spd: 118, traits: ['trooper'],
      abilities: [
        { name: 'Sith Rifle', cd: 0, target: 'enemy', effects: [dmg(1.0)], desc: 'Deal damage to one enemy.' },
        { name: 'Guard the Throne', cd: 3, target: 'self', effects: [buff('taunt', 2), buff('defUp', 2)], desc: 'Gain Taunt and Defense Up for 2 turns.' },
      ],
    },
  ];
  const ENCOUNTERS22 = [
    { id: 'dragonsnake', name: 'The Drowned Swamp', kind: 'character', level: 12, minions: [], unlock: 'dagobah', planet: 'dagobah', place: 'The swamps of Dagobah' },
    { id: 'death_star_2', name: 'It\'s a Trap!', kind: 'ship', level: 16, minions: ['lambda_shuttle', 'tie_interceptor', 'lambda_shuttle', 'tie_fighter'], unlock: 'endor', planet: 'endor', place: 'Endor system' },
    { id: 'acklay', name: 'The Petranaki Arena', kind: 'character', level: 23, minions: [], unlock: 'geonosis', planet: 'geonosis', place: 'Petranaki Arena, Geonosis' },
    { id: 'executor', name: 'Vader\'s Flagship', kind: 'ship', level: 27, minions: ['tie_fighter', 'tie_defender', 'tie_fighter', 'tie_interceptor'], unlock: 'mustafar', planet: 'mustafar', place: 'Mustafar orbit' },
    { id: 'sith_legion', name: 'The Sith Citadel', kind: 'character', level: 32, minions: ['sith_trooper', 'sith_trooper'], unlock: 'exegol', planet: 'exegol', place: 'Sith Citadel, Exegol' },
    { id: 'zillo_beast', name: 'Rampage on Coruscant', kind: 'character', level: 33, minions: [], unlock: 'coruscant_siege', planet: 'coruscant_siege', place: 'Senate District, Coruscant' },
  ];
  const BIOS22 = {
    dragonsnake: 'A swamp predator that lurks under the black water of Dagobah. It swallowed R2-D2 and spat him straight back out.',
    death_star_2: 'The second Death Star, its superlaser fully operational while its hull is still a skeleton. Shielded from the moon below.',
    acklay: 'A Geonosian arena beast: a crab-like shell, a mouth full of teeth and claws like scythes. Built for executions.',
    executor: 'Darth Vader\'s nineteen-kilometre Super Star Destroyer, flagship of the Death Squadron.',
    sith_legion: 'The red-armoured troopers of the Sith Eternal, marching in endless ranks from the Citadel on Exegol.',
    zillo_beast: 'A colossal armoured beast from Malastare, almost impossible to wound. Brought to Coruscant, it broke loose.',
    sith_trooper: 'A soldier of the Sith Eternal\'s Final Order, armoured in red.',
  };
  const STATUS22 = {
    submerged: { label: 'Submerged', icon: '≋', kind: 'mech', desc: 'Under the swamp: cannot be targeted.' },
    shielded: { label: 'Shield Generator', icon: '◈', kind: 'mech', desc: 'Takes half damage while its shield escorts survive.' },
    charging: { label: 'Superlaser Charging', icon: '✹', kind: 'mech', desc: 'Fires at your strongest ship when the countdown ends.' },
  };

  // ---------- Battle hooks (only bosses with a `mech` use them) ----------
  const BP = root.Battle && root.Battle.prototype;
  if (BP && !BP.__b22) {
    BP.__b22 = true;
    const mech = (u) => u && u.def && u.def.mech;
    const say = (events, text) => events.push({ type: 'log', text, side: 'enemy' });
    const fallenEscorts = (b, boss, ids) => b.units.filter((u) => u.side === boss.side && !u.alive && ids.includes(u.id));
    const shieldUp = (b, boss) => b.living(boss.side).some((u) => u !== boss && mech(boss).shield.includes(u.id));
    const hideSubmerged = (list) => { const up = list.filter((u) => !u.statuses.submerged); return up.length ? up : list; };

    const baseAdvance = BP.advance;
    BP.advance = function () {
      if (!this.__b22i) {
        this.__b22i = true;
        for (const u of this.units) if (mech(u) && mech(u).shield && shieldUp(this, u)) u.statuses.shielded = 99;
      }
      return baseAdvance.call(this);
    };

    const baseBegin = BP.beginTurn;
    BP.beginTurn = function (unit) {
      const out = baseBegin.call(this, unit);
      const m = mech(unit);
      if (!m || !unit.alive) return out;
      const ev = out.events;
      unit.__bt = (unit.__bt || 0) + 1;
      const n = unit.__bt;
      if (m.submerge && n % m.submerge.every === 0) {
        unit.statuses.submerged = 1;
        const amount = Math.min(unit.maxHp - unit.hp, Math.round(unit.maxHp * m.submerge.heal));
        unit.hp += amount;
        ev.push({ type: 'b22', uid: unit.uid, text: 'Submerged!' });
        ev.push({ type: 'status', uid: unit.uid, status: 'submerged', turns: 1 });
        if (amount) ev.push({ type: 'heal', uid: unit.uid, amount, hp: unit.hp });
        say(ev, `${unit.def.name} dives under the swamp: it can't be targeted until its next turn.`);
      }
      if (m.charge) {
        if (unit.__charge) {
          unit.__charge -= 1;
          if (unit.__charge <= 0) {
            unit.__charge = 0;
            delete unit.statuses.charging;
            const foes = this.opponents(unit);
            if (foes.length) {
              const target = foes.slice().sort((a, b) => b.atk - a.atk)[0];
              ev.push({ type: 'b22', uid: unit.uid, text: 'Superlaser fired!' });
              say(ev, `${unit.def.name} fires its superlaser at ${target.def.name}!`);
              const { amount, crit } = this.rollDamage(unit, target, m.charge.mult);
              this.applyDamage(target, amount, crit, ev);
            }
          } else {
            unit.statuses.charging = unit.__charge;
            say(ev, `Superlaser charging: fires in ${unit.__charge} turn${unit.__charge === 1 ? '' : 's'}.`);
          }
        } else if (n % m.charge.every === 0) {
          unit.__charge = m.charge.turns;
          unit.statuses.charging = unit.__charge;
          ev.push({ type: 'b22', uid: unit.uid, text: 'Superlaser charging!' });
          ev.push({ type: 'status', uid: unit.uid, status: 'charging', turns: unit.__charge });
          say(ev, `⚠ ${unit.def.name} begins charging its superlaser. It fires at your strongest ship in ${unit.__charge} turns!`);
        }
      }
      if (m.relaunch && n % m.relaunch.every === 0) {
        const back = fallenEscorts(this, unit, m.relaunch.ids).slice(0, m.relaunch.count);
        for (const f of back) {
          f.alive = true;
          f.hp = Math.round(f.maxHp * 0.6);
          f.tm = 0;
          f.ult = 0;
          f.statuses = {};
          ev.push({ type: 'revive', uid: f.uid, hp: f.hp });
        }
        if (back.length) say(ev, m.relaunch.text);
      }
      if (m.aura) {
        const source = this.living(unit.side).some((u) => u.id === m.aura.from);
        if (source) {
          if (!unit.__aura) { unit.__aura = true; say(ev, m.aura.text); }
          for (const a of this.living(unit.side)) {
            const had = a.statuses[m.aura.status];
            a.statuses[m.aura.status] = Math.max(had || 0, 2);
            if (!had) ev.push({ type: 'status', uid: a.uid, status: m.aura.status, turns: 2 });
          }
        }
      }
      return out;
    };

    const baseValid = BP.validTargets;
    BP.validTargets = function (unit, abilityIndex) {
      const list = baseValid.call(this, unit, abilityIndex);
      return unit.abilities[abilityIndex].target === 'enemy' ? hideSubmerged(list) : list;
    };
    const baseResolve = BP.resolveTargets;
    BP.resolveTargets = function (unit, ab, targetUid) {
      const list = baseResolve.call(this, unit, ab, targetUid);
      return ab.target === 'allEnemies' ? hideSubmerged(list) : list;
    };

    const baseAct = BP.act;
    BP.act = function (unit, abilityIndex, targetUid) {
      const ab = unit.abilities[abilityIndex];
      this.__basic = abilityIndex === 0 && !ab.ultimate;
      let events;
      try { events = baseAct.call(this, unit, abilityIndex, targetUid); } finally { this.__basic = false; }
      const m = mech(unit);
      if (ab.effects.some((e) => e.type === 'stunOne')) {
        const pool = this.opponents(unit).filter((u) => !u.boss);
        if (pool.length) {
          const t = pool[Math.floor(this.rng() * pool.length)];
          t.statuses.stun = Math.max(t.statuses.stun || 0, 1);
          events.push({ type: 'status', uid: t.uid, status: 'stun', turns: 1 });
          say(events, `A falling tower crushes ${t.def.name}: Stunned!`);
        }
      }
      if (!m || !unit.alive) return events;
      if (m.cleave && ab.target === 'enemy') {
        const first = this.get(targetUid);
        const others = hideSubmerged(this.opponents(unit).filter((u) => u !== first));
        const dmgFx = ab.effects.filter((e) => e.type === 'damage' && !e.on);
        if (others.length && dmgFx.length) {
          const t = others[Math.floor(this.rng() * others.length)];
          say(events, `The other claw catches ${t.def.name}!`);
          for (const eff of dmgFx) if (t.alive) this.applyEffect(unit, t, eff, events);
        }
      }
      if (m.frenzy && unit.enraged && unit.alive) {
        if (!unit.__fx) {
          unit.__fx = true;
          unit.tm = 100;
          events.push({ type: 'b22', uid: unit.uid, text: 'Arena Frenzy!' });
          say(events, `Arena Frenzy! ${unit.def.name} strikes again.`);
        } else unit.__fx = false;
      }
      return events;
    };

    const baseDamage = BP.applyDamage;
    BP.applyDamage = function (target, amount, crit, events, source) {
      const m = mech(target);
      if (m && !source) {
        if (m.shield && target.statuses.shielded) amount = Math.max(1, Math.round(amount * 0.5));
        if (m.scales && this.__basic) amount = Math.max(1, Math.round(amount * m.scales));
      }
      const wasAlive = target.alive;
      baseDamage.call(this, target, amount, crit, events, source);
      // A shield escort going down can drop the boss's shield.
      if (wasAlive && !target.alive) {
        for (const u of this.living(target.side)) {
          if (mech(u) && mech(u).shield && u.statuses.shielded && !shieldUp(this, u)) {
            delete u.statuses.shielded;
            events.push({ type: 'statusEnd', uid: u.uid, status: 'shielded' });
            events.push({ type: 'b22', uid: u.uid, text: 'Shield down!' });
            say(events, `${u.def.name}'s shield is down! It takes full damage now.`);
          }
        }
      }
    };
  }

  // The battle screen shows the boss's special moments as a banner.
  const BUI = root.BattleUI;
  if (BUI && !BUI.__b22) {
    BUI.__b22 = true;
    const basePlay = BUI.play;
    BUI.play = async function (events) {
      if (!events.some((e) => e.type === 'b22')) return basePlay.call(this, events);
      let chunk = [];
      for (const ev of events) {
        if (ev.type !== 'b22') { chunk.push(ev); continue; }
        if (chunk.length) { await basePlay.call(this, chunk); chunk = []; }
        if (this.ended) return;
        const u = this.battle.get(ev.uid);
        if (u) { this.updateCard(u); this.float(u, ev.text, 'crit'); }
        if (this.banner) this.banner(ev.text, 'enemy');
        if (this.shake) this.shake();
        await this.wait(800);
      }
      if (chunk.length) await basePlay.call(this, chunk);
    };
  }

  // ---------- General Grievous update: "Jedi Killer" ultimate ----------
  // He looms over the field, ignites all four sabers into two spinning blade
  // wheels that tear through every enemy, then finishes with a four-blade slash.
  if (BUI && !BUI.mv_jedikiller) {
    const el = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };
    if (typeof document !== 'undefined' && !document.getElementById('gv-css')) {
      const st = document.createElement('style');
      st.id = 'gv-css';
      st.textContent = `.gv-face{position:absolute;z-index:3;pointer-events:none;border-radius:16px;overflow:hidden;opacity:0;-webkit-mask-image:radial-gradient(ellipse at 50% 45%,#000 52%,transparent 74%);mask-image:radial-gradient(ellipse at 50% 45%,#000 52%,transparent 74%)}
.gv-face svg{width:100%;height:100%;display:block}
.gv-quote{position:absolute;z-index:4;left:50%;transform:translateX(-50%);width:min(92vw,620px);text-align:center;font:italic 700 clamp(14px,2.4vw,22px)/1.3 system-ui,sans-serif;color:#f2ead6;text-shadow:0 2px 12px #000,0 0 18px #000;opacity:0;letter-spacing:.02em}
.gv-quote b{display:block;font:900 clamp(11px,1.6vw,14px)/1 system-ui,sans-serif;letter-spacing:.32em;color:#d8cc48;margin-bottom:6px;font-style:normal}
.gv-wheel{position:absolute;z-index:4;left:0;top:0;pointer-events:none;will-change:transform}
.gv-wheel>div{width:100%;height:100%;animation:gv-spin .16s linear infinite}
.gv-wheel.ccw>div{animation-direction:reverse}
.gv-wheel svg{width:100%;height:100%;overflow:visible}
@keyframes gv-spin{to{transform:rotate(360deg)}}`;
      document.head.appendChild(st);
    }
    const blades = (a, b) => `<svg viewBox="-50 -50 100 100"><circle r="46" fill="none" stroke="${a}" stroke-width="10" opacity=".14"/><circle r="40" fill="none" stroke="${b}" stroke-width="5" opacity=".2"/>`
      + [[a, 0], [b, 90]].map(([c, r]) => `<g transform="rotate(${r})" style="filter:drop-shadow(0 0 4px ${c}) drop-shadow(0 0 9px ${c})"><line x1="-46" y1="0" x2="46" y2="0" stroke="${c}" stroke-width="6" stroke-linecap="round"/><line x1="-44" y1="0" x2="44" y2="0" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g>`).join('')
      + '<circle r="5" fill="#2a2c31"/><circle r="2.4" fill="#9aa1ab"/></svg>';
    BUI.mv_jedikiller = async function (S, actor, from, T, spec, hit) {
      const Snd = root.Sound, sp = S.speed;
      const anim = (node, frames, ms, o = {}) => node.animate(frames, { duration: ms / sp, fill: 'forwards', easing: 'ease-out', ...o }).finished.catch(() => {});
      // 1. He looms over the field and speaks.
      const sz = Math.min(S.W, S.H) * (this.liteSig ? 0.42 : 0.56);
      const face = el(`<div class="gv-face" style="width:${sz}px;height:${sz}px;left:${S.W / 2 - sz / 2}px;top:${Math.max(8, S.H * 0.08)}px">${root.Art.unitArt(actor.def)}</div>`);
      const quote = el(`<div class="gv-quote" style="top:${Math.min(S.H - 90, S.H * 0.08 + sz + 6)}px"><b>JEDI KILLER</b>“Your lightsabers will make a fine addition to my collection.”</div>`);
      S.layer.appendChild(face); S.layer.appendChild(quote);
      if (Snd) Snd.play('ignite');
      await Promise.all([anim(face, [{ opacity: 0, transform: 'scale(1.18)' }, { opacity: 0.92, transform: 'scale(1)' }], 650), anim(quote, [{ opacity: 0, transform: 'translate(-50%, 10px)' }, { opacity: 1, transform: 'translate(-50%, 0)' }], 500, { delay: 200 / sp })]);
      await this.wait(this.liteSig ? 350 : 750);
      // 2. Four sabers ignite into two spinning blade wheels.
      const ws = Math.max(110, Math.min(S.W, S.H) * 0.2);
      const mk = (a, b, cls) => { const w = el(`<div class="gv-wheel ${cls}" style="width:${ws}px;height:${ws}px"><div>${blades(a, b)}</div></div>`); S.layer.appendChild(w); return w; };
      const wheels = [mk('#3d8bff', '#46e070', ''), mk('#46e070', '#3d8bff', 'ccw')];
      const at = (w, x, y, sc = 1) => `translate(${x - ws / 2}px, ${y - ws / 2}px) scale(${sc})`;
      const starts = [{ x: from.x - ws * 0.45, y: from.y - ws * 0.3 }, { x: from.x + ws * 0.45, y: from.y - ws * 0.3 }];
      await Promise.all(wheels.map((w, i) => anim(w, [{ transform: at(w, from.x, from.y, 0.1), opacity: 0 }, { transform: at(w, starts[i].x, starts[i].y, 1), opacity: 1 }], 380)));
      if (Snd) Snd.play('whoosh');
      anim(face, [{ opacity: 0.92 }, { opacity: 0.25 }], 500);
      anim(quote, [{ opacity: 1 }, { opacity: 0 }], 400);
      // 3. The wheels carve through every enemy in turn, one high, one low.
      const route = T.slice().sort((a, b) => a.x - b.x);
      let pos = starts.slice();
      for (const t of route) {
        const dest = [{ x: t.x - ws * 0.12, y: t.y - ws * 0.22 }, { x: t.x + ws * 0.12, y: t.y + ws * 0.22 }];
        await Promise.all(wheels.map((w, i) => anim(w, [{ transform: at(w, pos[i].x, pos[i].y) }, { transform: at(w, dest[i].x, dest[i].y) }], 260, { easing: 'cubic-bezier(.6,0,.4,1)' })));
        S.trail(pos[0], dest[0], '#3d8bff', 0.6); S.trail(pos[1], dest[1], '#46e070', 0.6);
        const r = ws * 0.55;
        S.trail({ x: t.x - r, y: t.y - r }, { x: t.x + r, y: t.y + r }, '#3d8bff', 0.9);
        S.trail({ x: t.x + r, y: t.y - r }, { x: t.x - r, y: t.y + r }, '#46e070', 0.9);
        hit(t);
        if (this.shake) this.shake();
        pos = dest;
        await this.wait(90);
      }
      // 4. Four-blade finishing slash across the whole field.
      await Promise.all(wheels.map((w, i) => anim(w, [{ transform: at(w, pos[i].x, pos[i].y), opacity: 1 }, { transform: at(w, S.W / 2, S.H * 0.45, 1.5), opacity: 0 }], 320)));
      wheels.forEach((w) => w.remove());
      if (Snd) Snd.play('whoosh');
      const ys = T.length ? T.reduce((a, t) => a + t.y, 0) / T.length : S.H / 2;
      [['#3d8bff', -0.32], ['#46e070', -0.1], ['#3d8bff', 0.1], ['#46e070', 0.32]].forEach(([c, k], i) => setTimeout(() => S.trail({ x: -40, y: ys + k * S.H - S.H * 0.18 }, { x: S.W + 40, y: ys + k * S.H + S.H * 0.18 }, c, 1.3), i * 70 / sp));
      if (this.env) this.env.flash('#e8f4ff', 0.35);
      await this.wait(420);
      anim(face, [{ opacity: 0.25 }, { opacity: 0 }], 300);
      await this.wait(150);
      face.remove(); quote.remove();
    };
  }

  // ---------- Starkiller update: "Unleashed" one destroyer at a time ----------
  // He tears a Star Destroyer out of the sky for EACH enemy, one after
  // another: lightning grips the hull, it drops nose-first, glowing from
  // re-entry, and slams into its target. The hull is a detailed top-down
  // wedge in the loading-screen style, with burning engines and scorch marks.
  if (BUI && !BUI.mv_starfall) {
    const el = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };
    const shipSvg = (() => {
      let seed = 7;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      // Point on the hull at depth k (0 back .. 1 nose), across u (-1 left .. 1 right).
      const pt = (k, u) => [60 + u * 56 * (1 - k), 12 + 184 * k];
      let greeble = '';
      for (let i = 0; i < 46; i++) {
        const k = 0.08 + rnd() * 0.8, u = (rnd() * 2 - 1) * 0.9, [x, y] = pt(k, u);
        const w = 2 + rnd() * 9 * (1 - k), h = 1.5 + rnd() * 6 * (1 - k);
        greeble += `<rect x="${(x - w / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${u < 0 ? '#5a626e' : '#1e242c'}" opacity="${(0.25 + rnd() * 0.35).toFixed(2)}"/>`;
      }
      let guns = '';
      for (let i = 1; i <= 7; i++) {
        const k = i / 9;
        for (const u of [-0.78, 0.78]) { const [x, y] = pt(k, u); guns += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.5" fill="${u < 0 ? '#3a424e' : '#0e1218'}"/><line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + (u < 0 ? 1.6 : -1.6)).toFixed(1)}" y2="${(y + 2.6).toFixed(1)}" stroke="#0e1218" stroke-width=".6"/>`; }
      }
      const scorch = [[38, 70, 9], [80, 104, 7], [52, 130, 6], [70, 52, 5]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.7}" fill="#120a06" opacity=".45"/><circle cx="${x}" cy="${y}" r="${r * 0.3}" fill="#ff7a1a" opacity=".7"/>`).join('');
      const trench = (u) => { const a = pt(0.06, u), b = pt(0.92, u * 0.4); return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${u < 0 ? '#8a929e' : '#0a0e14'}" stroke-width="1.6" opacity=".8"/>`; };
      return `<svg viewBox="-6 -14 132 216" width="100%" height="100%" aria-hidden="true"><defs>
<linearGradient id="skL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f2f5f8"/><stop offset="1" stop-color="#a6aeba"/></linearGradient>
<linearGradient id="skR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5e6672"/><stop offset="1" stop-color="#2c333d"/></linearGradient>
<linearGradient id="skHeat" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff2c0"/><stop offset=".18" stop-color="#ff9a2a" stop-opacity=".9"/><stop offset=".45" stop-color="#ff4a1a" stop-opacity=".35"/><stop offset="1" stop-color="#ff4a1a" stop-opacity="0"/></linearGradient>
<radialGradient id="skEng"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#9ad8ff"/><stop offset="1" stop-color="#2a8aff" stop-opacity="0"/></radialGradient></defs>
<g class="sk-eng">${[[24, 7], [44, 9], [60, 11], [76, 9], [96, 7]].map(([x, r]) => `<circle cx="${x}" cy="4" r="${r}" fill="url(#skEng)"/>`).join('')}</g>
<polygon points="60,196 4,12 60,12" fill="url(#skL)"/><polygon points="60,196 116,12 60,12" fill="url(#skR)"/>
${trench(-0.62)}${trench(0.62)}${greeble}${guns}${scorch}
<line x1="60" y1="12" x2="60" y2="196" stroke="#0a0e14" stroke-width="1.1"/>
<rect x="2" y="7" width="116" height="6" fill="#2c333d"/><rect x="2" y="7" width="58" height="6" fill="#8a929e"/>
<rect x="40" y="14" width="40" height="22" fill="#9aa2ae"/><rect x="60" y="14" width="20" height="22" fill="#4a525e"/>
<rect x="48" y="36" width="24" height="34" fill="#8a929e"/><rect x="60" y="36" width="12" height="34" fill="#3a424e"/>
<rect x="53" y="70" width="14" height="10" fill="#6a727e"/><rect x="60" y="70" width="7" height="10" fill="#2c333d"/>
<rect x="34" y="2" width="52" height="9" rx="1" fill="#c8d0da"/><rect x="60" y="2" width="26" height="9" rx="1" fill="#5a626e"/>
${Array.from({ length: 11 }, (_, i) => `<rect x="${37 + i * 4.3}" y="5.6" width="2.2" height="1.6" fill="#ffd27a"/>`).join('')}
<circle cx="38" cy="-2" r="5" fill="#e8eef4"/><circle cx="82" cy="-2" r="5" fill="#6a727e"/><rect x="58.6" y="-12" width="2.8" height="12" fill="#8a929e"/>
<polygon class="sk-heat" points="60,200 10,30 110,30" fill="url(#skHeat)" opacity="0"/></svg>`;
    })();
    BUI.mv_starfall = async function (S, actor, from, T, spec, hit) {
      const sp = S.speed, lite = this.liteSig, Snd = root.Sound;
      S.layer.classList.add('sig-quake');
      const w = Math.max(104, Math.min(200, S.W * 0.2)), h = w * 1.64;
      const route = T.slice().sort((a, b) => a.x - b.x);
      const one = (t, i) => new Promise((done) => {
        const ship = el(`<div class="sp-prop" style="position:absolute;left:0;top:0;width:${w}px;height:${h}px;z-index:4;pointer-events:none;will-change:transform;filter:drop-shadow(0 10px 18px rgba(0,0,0,.7))">${shipSvg}</div>`);
        S.layer.appendChild(ship);
        const heat = ship.querySelector('.sk-heat');
        const sx = Math.max(w / 2, Math.min(S.W - w / 2, t.x + (i % 2 ? 1 : -1) * S.W * (0.12 + Math.random() * 0.12)));
        // Held up in plain view above its target before the drop.
        const sy = Math.min(t.y - h * 0.75, Math.max(h * 0.62, S.H * 0.18));
        const ang = (Math.atan2(t.x - sx, t.y - sy) * 180) / Math.PI;
        const grip = 460 / sp, fall = 560 / sp;
        if (Snd) Snd.play('lightning');
        let t0 = null, last = null, el2 = 0, f = 0;
        const step = (now) => {
          if (last !== null) el2 += Math.min(now - last, 50);
          last = now;
          if (t0 === null) t0 = el2;
          const e = el2 - t0;
          let x, y, sc, rot;
          if (e < grip) {
            // Gripped: dragged into view, shuddering against the Force.
            const k = e / grip;
            const ease = 1 - (1 - k) * (1 - k);
            x = sx + Math.sin(e / 18) * 3; y = -h + (sy + h) * ease; sc = 1.25; rot = -ang * k + Math.sin(e / 25) * 2;
            if (f++ % (lite ? 4 : 2) === 0) BUI.sigBolt.call(this, S, from, { x, y: y + h * 0.3 }, spec.color, 0.8);
          } else {
            const k = Math.min(1, (e - grip) / fall), q = k * k * k;
            x = sx + (t.x - sx) * q; y = sy + (t.y - sy - h * 0.22) * q; sc = 1.25 - 0.55 * q; rot = -ang;
            heat.setAttribute('opacity', Math.min(1, k * 1.6).toFixed(2));
            if (!lite && k < 0.6 && f++ % 3 === 0) BUI.sigBolt.call(this, S, from, { x, y }, spec.color, 0.5);
            if (k >= 1) {
              ship.animate([{ opacity: 1, transform: ship.style.transform }, { opacity: 0, transform: `${ship.style.transform} scale(1.15, .6)` }], { duration: 220, fill: 'forwards' }).onfinish = () => ship.remove();
              this.boom(this.toField(t), '#ff8a2a', lite ? 1.4 : 2);
              if (this.env) this.env.flash('#ffd27a', 0.3);
              if (this.shake) this.shake();
              if (Snd) Snd.play('explosion');
              hit(t);
              return done();
            }
          }
          // Anchor at the nose so the point of the wedge lands on the card.
          ship.style.transform = `translate(${x - w / 2}px, ${y - h * 0.5}px) rotate(${rot}deg) scale(${sc})`;
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
      // One after another: the next hull is torn loose as the last one falls.
      const all = [];
      for (let i = 0; i < route.length; i++) {
        all.push(one(route[i], i));
        await this.wait(lite ? 380 : 560);
      }
      await Promise.all(all);
      if (this.env) this.env.flash('#ffd27a', 0.6);
      await this.wait(420);
    };
  }

  // Starkiller update: one Star Destroyer per enemy (live early, Oct 21; listed in the 2.2 notes).
  if (BUI && BUI.SIG && BUI.mv_starfall) BUI.SIG.starkiller = { move: 'starfall', prop: 'isd', impact: 'crush', color: '#7ac8ff' };

  // ---------- Switch on at 2.2 ----------
  if (!D) return;
  Object.assign(D.STATUS_INFO, STATUS22);
  if (!live() || D.UNIT_MAP.dragonsnake) return;
  for (const u of [...BOSSES22, ...MINIONS22]) D.UNIT_MAP[u.id] = u;
  D.BOSSES.push(...BOSSES22);
  D.BOSS_ENCOUNTERS.push(...ENCOUNTERS22);
  D.BOSS_ENCOUNTERS.sort((a, b) => a.level - b.level);
  Object.assign(D.BIOS, BIOS22);
  // The Hoth Star Destroyer gets its new portrait.
  if (D.UNIT_MAP.star_destroyer && root.Art && root.Art.CHARACTER_IDS.includes('star_destroyer_22')) D.UNIT_MAP.star_destroyer.portrait = 'star_destroyer_22';
  // General Grievous update: his new card art.
  if (D.UNIT_MAP.grievous && root.Art && root.Art.CHARACTER_IDS.includes('grievous_22')) D.UNIT_MAP.grievous.portrait = 'grievous_22';
  if (BUI && BUI.SIG && BUI.mv_jedikiller) BUI.SIG.grievous = { move: 'jedikiller', prop: 'saber', impact: 'xslash', color: '#46e070' };
  // General Grievous buff: one of the strongest epics, able to take on some legendaries.
  const gv = D.UNIT_MAP.grievous;
  if (gv && !gv.__buff22) {
    gv.__buff22 = true;
    gv.spd = 152;
    gv.abilities[0].effects[0].mult = 0.42;
    gv.abilities[1].effects = [gv.abilities[1].effects[0], { ...gv.abilities[1].effects[1], chance: 0.65 }];
    gv.abilities[1].desc = 'Deal heavy damage with a 65% chance to Burn.';
    gv.ultimate = U('Blade Whirlwind', 'allEnemies', [dmg(0.62, 3), debuff('defDown', 2, 0.25)], 'Strike all enemies three times, with a 25% chance of Defense Down.', 'Your lightsabers will make a fine addition to my collection.');
  }
})(typeof window !== 'undefined' ? window : globalThis);
