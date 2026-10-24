// Update 2.4: a background scene for every stage, drawn world by world.
// Concept stage (Tatooine first, for approval). Each scene is a 160x90 SVG
// laid behind the battle; fleet stages keep a space backdrop.
(function (root) {
  'use strict';
  const K = root.ArtX;
  if (!K) return;
  const { P, E, C, R, L, LG, RG, stars } = K;
  const svg = (inner) => `<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${inner}</svg>`;
  const sky = (top, bottom) => { const [g, d] = LG([[0, top], [1, bottom]]); return d + R(0, 0, 160, 90, g); };
  const suns = (x, y) => C(x, y, 7, '#fff4d6') + C(x, y, 11, '#fff4d6', 'opacity=".18"') + C(x + 14, y + 6, 4.6, '#ffe3a3') + C(x + 14, y + 6, 8, '#ffe3a3', 'opacity=".16"');
  const dunes = (y, c1, c2) => P(`M0 ${y} Q40 ${y - 8} 80 ${y - 2} T160 ${y - 4} V90 H0Z`, c1) + P(`M0 ${y + 10} Q50 ${y + 2} 100 ${y + 8} T160 ${y + 6} V90 H0Z`, c2);
  const dome = (x, y, w, c) => P(`M${x - w} ${y} C${x - w} ${y - w * 1.1} ${x + w} ${y - w * 1.1} ${x + w} ${y}Z`, c) + R(x - w, y, w * 2, w * 0.7, c) + R(x - w * 0.3, y - w * 0.2, w * 0.6, w * 0.8, '#3a2412', 'rx="1"');
  const vaporator = (x, y, h) => R(x - 0.8, y - h, 1.6, h, '#8a8a8e') + R(x - 2, y - h * 0.6, 4, 1.4, '#a8a8ac') + R(x - 1.4, y - h - 2, 2.8, 2, '#c8c8cc') + L(x, y, x - 3, y + 1, '#6a6a6e', 0.6) + L(x, y, x + 3, y + 1, '#6a6a6e', 0.6);
  const tusken = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#3a2a1c">${P('M-2 0 L-2.6 -9 C-2.6 -12 2.6 -12 2.6 -9 L2 0Z', '#4a3a2a')}${C(0, -12, 2.2, '#c8b08a')}${R(-1.6, -12.6, 3.2, 1, '#2a1a10')}${L(2.6, -8, 6, -14, '#3a2a1c', 0.7)}</g>`;

  const S = {
    // 1 · Mos Eisley Outskirts: domed huts, vaporators and a landspeeder under the twin suns.
    mos_eisley: () => sky('#e8b874', '#f6dca8') + suns(118, 18) + dunes(62, '#d89a5a', '#c08446')
      + dome(28, 62, 9, '#d8b48a') + dome(46, 60, 6, '#cfa87c') + dome(132, 64, 11, '#d0aa80') + R(54, 50, 16, 12, '#c89e72') + P('M54 50 L62 44 L70 50Z', '#b88e62') + R(60, 54, 4, 8, '#3a2412')
      + vaporator(86, 66, 14) + vaporator(98, 68, 10) + vaporator(150, 70, 12)
      + `<g transform="translate(110 76)">${E(0, 0, 10, 2.6, '#c8402a')}${E(-2, -1.6, 4, 1.6, '#a8c8e8', 'opacity=".8"')}${E(0, 3.4, 9, 1.2, '#000', 'opacity=".25"')}</g>`,
    // 2 · Jundland Wastes: rock spires, a canyon floor, Tusken Raiders on the ridge and a bantha.
    jundland: () => sky('#d88a4a', '#f4c88a') + suns(30, 16)
      + P('M0 40 L18 30 L28 38 L40 22 L56 36 L70 28 L84 40 L100 26 L118 38 L136 24 L160 34 L160 90 L0 90Z', '#a05a2a')
      + P('M0 56 L22 48 L44 58 L70 50 L96 60 L124 52 L160 58 L160 90 L0 90Z', '#8a4a22') + P('M0 72 Q60 64 120 72 T160 70 V90 H0Z', '#c88a52')
      + tusken(60, 50, 1) + tusken(68, 51, 0.9) + `<g transform="translate(120 52)">${E(0, 0, 9, 5, '#5a3a22')}${C(-8, -2, 3.6, '#4a2e1a')}${P('M-10 -4 C-14 -8 -12 -12 -8 -10', 'none', 'stroke="#e8d8b8" stroke-width="1.2"')}${R(-6, 4, 1.6, 4, '#4a2e1a')}${R(4, 4, 1.6, 4, '#4a2e1a')}</g>`,
    // 3 · Beggar's Canyon (fleet): above Tatooine, the planet's curve and the twin suns.
    beggars: () => R(0, 0, 160, 90, '#04060c') + `<g transform="scale(1.6 1)">${stars(5, 60, 90)}</g>`
      + (() => { const [g, d] = RG([[0, '#f0c07a'], [0.7, '#c88a4a'], [1, '#5a3418']], 0.4, 0.3, 0.8); return d + C(80, 150, 90, g); })()
      + P('M10 80 Q60 66 120 74', 'none', 'stroke="#a86a32" stroke-width="2" opacity=".6"') + suns(26, 16),
    // 4 · Sandcrawler Ambush: a Jawa sandcrawler grinding over the dunes.
    sandcrawler: () => sky('#e4a868', '#f6d29a') + suns(132, 14) + dunes(58, '#d49656', '#ba7e42')
      + `<g transform="translate(40 34)">${P('M0 26 L4 6 L20 0 L56 0 L70 10 L74 26Z', '#8a6a4a', 'stroke="#4a3220" stroke-width=".8"')}${P('M4 6 L20 0 L56 0 L60 6Z', '#a08060')}${R(24, 2, 8, 3, '#2a1a10')}${R(36, 2, 8, 3, '#2a1a10')}${[8, 20, 32, 44, 56, 66].map((x) => R(x, 26, 9, 5, '#3a2a1a', 'rx="1"')).join('')}${R(60, 14, 10, 10, '#4a3220')}${C(18, 14, 1.4, '#ffcf3a')}${C(24, 14, 1.4, '#ffcf3a')}</g>`
      + [[30, 70], [36, 72], [112, 72]].map(([x, y]) => `<g transform="translate(${x} ${y})">${P('M-2 0 L-1.4 -5 C-1.4 -7 1.4 -7 1.4 -5 L2 0Z', '#6b4a2a')}${C(-0.6, -5, 0.5, '#ffcf3a')}${C(0.6, -5, 0.5, '#ffcf3a')}</g>`).join(''),
    // 5 · Chalmun's Cantina: the dim bar, booths, round lamps and the band on its stage.
    cantina: () => R(0, 0, 160, 90, '#2a1c12') + R(0, 0, 160, 30, '#3a2818')
      + [20, 60, 100, 140].map((x) => E(x, 10, 10, 3, '#5a4028') + C(x, 14, 3, '#ffd28a', 'opacity=".55"') + C(x, 14, 10, '#ffb04a', 'opacity=".1"')).join('')
      + P('M50 54 C50 44 110 44 110 54 L110 62 L50 62Z', '#5a3a22', 'stroke="#2a1a0c" stroke-width=".8"') + R(50, 54, 60, 2, '#8a5a32') + [60, 72, 84, 96].map((x) => R(x, 62, 3, 10, '#3a2412')).join('')
      + [[8, 50], [130, 50]].map(([x, y]) => P(`M${x} ${y} C${x} ${y - 10} ${x + 22} ${y - 10} ${x + 22} ${y} L${x + 22} ${y + 14} L${x} ${y + 14}Z`, '#4a2e1a')).join('')
      + R(118, 30, 36, 14, '#3a2414') + [124, 132, 140, 148].map((x) => E(x, 36, 2, 3, '#6a8aa8') + C(x, 32, 1.6, '#8aa8c8')).join('')
      + R(0, 72, 160, 18, '#1a120a') + E(80, 80, 40, 4, '#ffb04a', 'opacity=".08"'),
    // 6 · Jabba's Gate: the great iron door in the rock, the droid eye watching.
    jabbas_gate: () => sky('#e09a5a', '#f6cc90') + suns(20, 14)
      + P('M30 90 L34 30 Q80 10 126 30 L130 90Z', '#9a6a42') + P('M30 90 L34 30 Q80 10 126 30 L130 90', 'none', 'stroke="#6a4424" stroke-width="1"')
      + R(62, 44, 36, 46, '#3a2a1e', 'stroke="#1a120a" stroke-width="1"') + [52, 60, 68, 76, 84].map((y) => L(62, y, 98, y, '#5a4430', 0.8)).join('') + [70, 80, 90].map((x) => L(x, 44, x, 90, '#2a1c12', 0.6)).join('')
      + `<g transform="translate(80 40)">${L(0, 0, 0, -8, '#5a5a5e', 1)}${C(0, -9, 2.6, '#3a3a3e')}${C(0, -9, 1.2, '#ff3a2a', 'style="filter:drop-shadow(0 0 2px #ff3a2a)"')}</g>`
      + dunes(78, '#d49656', '#ba7e42'),
    // 7 · Dune Sea Pursuit (fleet): high over the Dune Sea, Tatooine filling the bottom of the sky.
    dune_sea_orbit: () => R(0, 0, 160, 90, '#05070e') + `<g transform="scale(1.6 1)">${stars(9, 50, 90)}</g>`
      + (() => { const [g, d] = LG([[0, '#f2c27e'], [1, '#a8662e']]); return d + P('M0 58 Q80 40 160 58 L160 90 L0 90Z', g); })()
      + P('M0 66 Q80 50 160 66', 'none', 'stroke="#ffe8c0" stroke-width="1" opacity=".5"') + suns(124, 12),
    // 8 · The Mandalorian's Bounty: dusk, a rocky outcrop and the Razor Crest parked on the sand.
    mando_bounty: () => sky('#6a4a6a', '#f0a868') + suns(40, 40)
      + P('M90 90 L96 44 L108 36 L120 46 L124 90Z', '#6a3e22') + dunes(66, '#b87a46', '#9a6236')
      + `<g transform="translate(30 62)">${P('M0 6 L40 0 L48 4 L44 10 L4 12Z', '#b8bec6', 'stroke="#4a5058" stroke-width=".6"')}${R(36, -2, 10, 4, '#8a929c')}${E(6, 9, 5, 3, '#6a727c')}${L(10, 12, 8, 16, '#4a5058', 0.8)}${L(36, 10, 38, 16, '#4a5058', 0.8)}</g>`,
    // 9 · Hunters' Den: a dark hideout, bounty pucks glowing on the board, crates and a lamp.
    hunters_den: () => R(0, 0, 160, 90, '#1a1410') + R(0, 0, 160, 60, '#241a14')
      + R(56, 12, 48, 30, '#0e0c0a', 'stroke="#3a2a1c" stroke-width="1"') + [[64, 18], [76, 18], [88, 18], [64, 30], [76, 30], [88, 30]].map(([x, y]) => R(x, y, 10, 8, '#5fd8ff', 'opacity=".25"') + C(x + 5, y + 4, 2, '#9fe8ff', 'opacity=".6"')).join('')
      + [[10, 60, 18, 14], [24, 66, 14, 10], [128, 62, 20, 12]].map(([x, y, w, h]) => R(x, y, w, h, '#4a3420', 'stroke="#2a1a0e" stroke-width=".6"') + L(x, y + h / 2, x + w, y + h / 2, '#2a1a0e', 0.6)).join('')
      + C(140, 30, 3, '#ffb04a') + C(140, 30, 14, '#ffb04a', 'opacity=".12"') + R(0, 76, 160, 14, '#120e0a'),
    // 10 · Jabba's Palace: the throne room, Jabba on his dais, Han on the wall, the rancor grate.
    jabbas_palace: () => R(0, 0, 160, 90, '#2a1a10') + R(0, 0, 160, 50, '#3a2414')
      + [0, 20, 40, 60, 80, 100, 120, 140].map((x) => R(x, 0, 18, 50, '#40281a', 'opacity=".6"')).join('') + [12, 148].map((x) => R(x - 2, 20, 4, 14, '#2a180c') + C(x, 18, 3, '#ffb04a', 'opacity=".8"') + C(x, 18, 10, '#ffb04a', 'opacity=".14"')).join('')
      + R(20, 22, 10, 18, '#6a7480', 'rx="1"') + P('M23 27 C23 24 27 24 27 27 L27 31 L23 31Z', '#8a96a4')
      + P('M60 62 C60 50 100 50 100 62Z', '#4a2e1a') + E(80, 56, 16, 6, '#6a7a3a') + C(72, 52, 5, '#7a8a4a') + C(70, 51, 0.8, '#ffb04a') + C(74, 51, 0.8, '#ffb04a')
      + E(80, 78, 30, 6, '#1a0e08', 'stroke="#5a3a22" stroke-width="1"') + [60, 70, 80, 90, 100].map((x) => L(x, 73, x, 83, '#5a3a22', 0.8)).join('')
      + [40, 120].map((x) => [0, 1, 2, 3, 4].map((i) => E(x, 4 + i * 3, 0.8, 1.2, 'none', 'stroke="#5a4a3a" stroke-width=".5"')).join('')).join(''),
  };
  const TATOOINE = ['mos_eisley', 'jundland', 'beggars', 'sandcrawler', 'cantina', 'jabbas_gate', 'dune_sea_orbit', 'mando_bounty', 'hunters_den', 'jabbas_palace'];
  root.StageArt24 = { scenes: S, svg, worlds: { tatooine: TATOOINE }, render: (id) => (S[id] ? svg(S[id]()) : '') };
})(typeof window !== 'undefined' ? window : globalThis);
