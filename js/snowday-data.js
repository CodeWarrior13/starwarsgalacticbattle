// Snow Day at Echo Base (Christmas 2026): the advent calendar's data, Rex's and Luthen's lines,
// and the hand-drawn scenes. js/snowday.js builds the screens from this. Testers only until approved.
(function (root) {
  'use strict';
  const C = (cx, cy, r, f, x = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" ${x}/>`;
  const P = (d, f, x = '') => `<path d="${d}" fill="${f}" ${x}/>`;
  const R = (x, y, w, h, f, e = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${e}/>`;
  const E = (cx, cy, rx, ry, f, x = '') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" ${x}/>`;
  const BUL = ['#ff4a5a', '#ffd23f', '#4ad46a', '#4aa8ff', '#ff7ad9'];
  const rnd = (seed) => { let s = seed; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); };
  const sag = (x1, y1, x2, y2, s, n) => Array.from({ length: n }, (_, i) => { const t = (i + .5) / n; return [+(x1 + (x2 - x1) * t).toFixed(1), +(y1 + (y2 - y1) * t + Math.sin(Math.PI * t) * s).toFixed(1)]; });
  const lights = (x1, y1, x2, y2, s, n, r = 1.3, cls = 'sd-tw') => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + s * 2} ${x2} ${y2}" stroke="#1d331d" stroke-width=".7" fill="none"/><g class="${cls}">${sag(x1, y1, x2, y2, s, n).map(([x, y], i) => `${C(x, y + r, r * 2.2, BUL[i % 5], 'opacity=".28"')}${E(x, y + r, r * .7, r, BUL[i % 5])}`).join('')}</g>`;
  const santaHat = (cx, y, w, t, id) => `<g transform="rotate(${t} ${cx} ${y})"><defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#ff4a52"/><stop offset=".6" stop-color="#d8232f"/><stop offset="1" stop-color="#9a1018"/></linearGradient></defs>${P(`M${cx - w / 2} ${y} Q${cx - w * .12} ${y - w * .95} ${cx + w * .58} ${y - w * .58} Q${cx + w * .3} ${y - w * .34} ${cx + w / 2} ${y}Z`, `url(#${id})`)}${R(cx - w / 2 - 2, y - 3.6, w + 4, 7.2, '#f6f3ee', 'rx="3.6"')}${C(cx + w * .58, y - w * .58, w * .12, '#f6f3ee')}</g>`;

  // ---------- Dates: midnight Central = 06:00 UTC ----------
  const START = Date.UTC(2026, 10, 29, 6); // Sunday Nov 29, 2026
  const DOORS = 27; // Nov 29 .. Dec 25

  // ---------- The 27 doors ----------
  // m: mission { k, n, ... } — see js/snowday.js track(). r: rewards.
  const DAYS = [
    { d: 'Nov 29', t: 'Advent begins', m: { k: 'login' }, r: [['banner', 'Snowfall on Hoth'], ['beskar', 200]], rex: ['Merry Christmas, trooper. Well, early Christmas. Echo Base has a calendar now: 27 doors, one a day.', 'Today\'s easy. You showed up. Open door one.'] },
    { d: 'Nov 30', t: 'Light the tree', m: { k: 'wins', n: 5 }, r: [['skin', 'r2d2'], ['credits', 1500]], rex: ['The tree\'s up, but the generator\'s sulking. Win 5 battles anywhere and we\'ll call it power.', 'R2 has already volunteered to wear the hat. Nobody asked him to.'] },
    { d: 'Dec 1', t: 'Wrapping party', m: { k: 'crates', n: 2 }, r: [['pfp', 'Porg in a Beanie'], ['credits', 2000]], rex: ['Supply run came in. Open 2 crates, any kind.', 'If a porg climbs out of one, it is not mine.'] },
    { d: 'Dec 2', t: 'Snowball fight', m: { k: 'duel', n: 1, low: 5 }, r: [['skin', 'stormtrooper'], ['beskar', 150]], rex: ['Snowball fight in the north trench. Win a friendly battle or a Live Duel.', 'Still green? Then win 5 battles. Same snow, fewer snowballs to the face.'] },
    { d: 'Dec 3', t: 'Letters to Santa Yoda', m: { k: 'ults', n: 5 }, r: [['skin', 'yoda'], ['kyber', 15]], rex: ['Master Yoda\'s reading letters by the chimney. He wants proof you mean it.', 'Use 5 ultimates. Big ones. He says "write loudly, you must."'] },
    { d: 'Dec 4', t: 'Gift wrap', m: { k: 'wins', n: 5, planet: 'hoth' }, r: [['back', 'Wrapping Paper (red)'], ['credits', 2500]], rex: ['Out of wrapping paper. The Empire has plenty on Hoth.', 'Win 5 battles there and bring some back. Red, if they have it.'] },
    { d: 'Dec 5', t: 'Ewok elves', m: { k: 'upgrade' }, r: [['pfp', 'Ewok Elf'], ['kyber', 25]], rex: ['The Ewok elves want to see your workshop. Promote a card by 1 star and level your cards up 5 times.', 'Every card already maxed out? Then 10 level-ups and they\'ll be impressed.'] },
    { d: 'Dec 6', t: 'The Wampa stirs', m: { k: 'boss', n: 1 }, r: [['kyber', 30], ['beskar', 300]], rex: ['Something big got into the cookie stores. Wampa tracks, and they\'re huge.', 'Go into the cave and fight the Wampa King. One full battle. Win or lose, I need eyes on him.'] },
    { d: 'Dec 7', t: 'Sweater weather', m: { k: 'wins', n: 3, squad: ['c3po', 'commander_cody'], alt: 5 }, r: [['skin', 'c3po'], ['back', 'C-3PO Wrapping Paper']], rex: ['Threepio knitted Cody a sweater. Cody is wearing it. I\'m not asking questions.', 'Win 3 battles with either of them in your squad, or any 5 wins.'] },
    { d: 'Dec 8', t: 'Gonk delivers', m: { k: 'streak', n: 3 }, r: [['pfp', 'Gonk in Lights'], ['credits', 3000]], rex: ['The Gonk droid is delivering presents. Slowly. Very slowly.', 'Win 3 battles in a row without a loss and he\'ll be done by New Year.'] },
    { d: 'Dec 9', t: 'Onto the Frostline', m: { k: 'camp', n: 3 }, r: [['shot', 'Candy Cane'], ['beskar', 200]], rex: ['Scouts found Imperials along the Frostline, right where the presents were stashed.', 'Clear the first 3 stages of the Frostline. Dress warm.'] },
    { d: 'Dec 10', t: 'Gingerbread bakery', m: { k: 'wins', n: 5, planet: 'tatooine' }, r: [['skin', 'vader'], ['beskar', 300]], rex: ['The bakery needs ginger. Apparently it grows on Tatooine. Apparently.', 'Win 5 battles on Tatooine. Don\'t eat the Vader cookie.'] },
    { d: 'Dec 11', t: 'Twinkle lights', m: { k: 'help', n: 10 }, r: [['frame', 'Twinkle Lights'], ['back', 'R2-D2 Wrapping Paper']], rex: ['Teamwork lights up the base. Use 10 abilities that help an ally.', 'Heals, shields, buffs: they all count.'] },
    { d: 'Dec 12', t: 'Wampa night', m: { k: 'boss', n: 1 }, r: [['skin', 'commander_cody'], ['kyber', 20]], rex: ['The Wampa King took the tree topper. That was the good star.', 'One full battle against him. Bring it back if you can.'] },
    { d: 'Dec 13', t: 'Life Day', m: { k: 'wins', n: 1, wookiee: true, alt: 3 }, r: [['banner', 'Life Day on Kashyyyk'], ['back', 'Wrapping Paper (green)']], rex: ['Happy Life Day. The Wookiees invited us over, which is generous and loud.', 'Win a battle with a Wookiee in your squad, or any 3 wins.'] },
    { d: 'Dec 14', t: 'Duel in the snow', m: { k: 'duel', n: 3, low: 5, arena: true }, r: [['frame', 'Gingerbread Frame'], ['shot', 'Gingerbread Blaster']], rex: ['Pilots are settling who wraps the most presents. With blasters.', 'Win 3 Live Duels or arena battles. Still under level 25? Win 5 battles in the campaign.'] },
    { d: 'Dec 15', t: 'Ewok village', m: { k: 'wins', n: 5, planet: 'endor' }, r: [['banner', 'Ewok Village Lights'], ['kyber', 30]], rex: ['The Ewoks lit their whole village. The Empire noticed.', 'Win 5 battles on Endor and keep the lights on.'] },
    { d: 'Dec 16', t: 'Frostline finale', m: { k: 'camp', n: 6 }, r: [['skin', 'din_djarin'], ['beskar', 300]], rex: ['The last of the stolen presents are in the Wampa King\'s cave at the end of the Frostline.', 'Clear all 6 stages. I\'ll keep the cocoa hot.'] },
    { d: 'Dec 17', t: 'Holocron hunt', m: { k: 'crates', n: 3 }, r: [['kyber', 40], ['credits', 2500]], rex: ['Inventory day. Open 3 crates and tell me what we\'ve got.', 'Yes, they count if you open them for yourself.'] },
    { d: 'Dec 18', t: 'Fleet parade', m: { k: 'wins', n: 5, ship: true }, r: [['skin', 'tie_advanced'], ['skin', 'x_wing']], rex: ['Holiday fleet parade over the base. Pilots, show us what you\'ve got.', 'Win 5 fleet battles. Bonus points for not crashing into the tree.'] },
    { d: 'Dec 19', t: 'Wampa rush', m: { k: 'boss', n: 2 }, r: [['skin', 'darth_maul'], ['beskar', 250]], rex: ['He\'s back, and he\'s brought friends.', 'Two full battles against the Wampa King today.'] },
    { d: 'Dec 20', t: 'Tree lighting', m: { k: 'ults', n: 10 }, r: [['win', 'Tree Lighting win screen'], ['credits', 3000]], rex: ['Tree lighting tonight. We need a lot of power.', 'Use 10 ultimates and we\'ll flip the switch together.'] },
    { d: 'Dec 21', t: 'Longest night', m: { k: 'night', n: 3 }, r: [['back', 'Wrapping Paper (red and green)'], ['back', 'Droid Pair Wrapping Paper']], rex: ['Longest night of the year. The best fights happen after dark.', 'Win 3 battles after 6 PM Central.'] },
    { d: 'Dec 22', t: 'Deck the halls', m: { k: 'equip' }, r: [['beskar', 400], ['kyber', 30]], rex: ['Inspection day. Show me your holiday colours.', 'Equip any holiday item you\'ve earned: a skin, frame, banner, picture or card back.'] },
    { d: 'Dec 23', t: 'Last-minute shopping', m: { k: 'visit' }, r: [['banner', 'Holiday Hyperspace'], ['credits', 3000]], rex: ['Two days to go and I haven\'t bought anything. Don\'t tell anyone.', 'Go see Luthen at his stall. You don\'t have to buy anything. Just go.'] },
    { d: 'Dec 24', t: 'Christmas Eve', m: { k: 'boss', n: 1 }, r: [['banner', 'Christmas Eve on Coruscant'], ['crate', 'Gift Box crate theme']], rex: ['Christmas Eve. The Wampa King\'s last stand before he hibernates.', 'One more full battle. Then we all get some sleep.'] },
    { d: 'Dec 25', t: 'Christmas Day', m: { k: 'login' }, r: [['kyber', 100], ['beskar', 1000], ['holocron', 1], ['pfp', 'Grogu with a Candy Cane'], ['win', 'Gift Box win screen'], ['win', 'Snow Globe MVP win screen']], rex: ['Merry Christmas, trooper. Look under the tree.', 'Thanks for everything this month. Truly.'] },
  ];
  // Sold at Luthen's pop-up stall during Advent (Beskar).
  const STALL = [
    { key: 'skin:falcon', n: 'Holiday Falcon skin', cost: 1500 },
    { key: 'banner:Gingerbread Cantina', n: 'Gingerbread Cantina banner', cost: 1200 },
    { key: 'frame:Ornament Ring', n: 'Ornament Ring frame', cost: 900 },
    { key: 'shot:Ornament Shot', n: 'Ornament Shot', cost: 900 },
  ];
  const LUTHEN = {
    hello: ['Ah. A customer who reads signs.', 'Everything here is honest work, give or take.', 'Christmas week is good for business. Don\'t tell Rex I said that.'],
    merry: 'Merry Christmas? To me? ...It has been a long time since anyone said that.',
    gift: 'You would give an old trader a gift? Then choose something from my stall. Anything. Consider it returned.',
    thanks: 'Generosity is the bravest thing in the galaxy. Merry Christmas, friend.',
    noGift: 'Then Merry Christmas to you as well. Truly.',
  };
  // ---------- Frostline: 6 Hoth stages, every level, sized to your squad ----------
  const FROST = [
    { n: 'Supply depot raid', en: ['snowtrooper', 'snowtrooper', 'snowtrooper'], pay: ['credits', 800], d: 'Snowtroopers are loading the base\'s presents onto a cargo sled.' },
    { n: 'Probe droid hunt', en: ['sd_probe', 'snowtrooper', 'sd_probe'], pay: ['beskar', 100], d: 'Probe droids are scanning for the gift tent. Shoot them down before they report in.' },
    { n: 'Lost tauntauns', en: ['sd_beast', 'snowtrooper', 'sd_beast'], pay: ['credits', 1200], d: 'A blizzard scattered the tauntauns, and something hungry is following them.' },
    { n: 'The gift tent', en: ['snowtrooper', 'sd_atst', 'snowtrooper'], pay: ['beskar', 150], d: 'An AT-ST is parked on top of the gift tent. Get it off.' },
    { n: 'Hangar wampa', en: ['sd_beast', 'sd_beast', 'sd_beast'], pay: ['credits', 1600], d: 'Three wampas got into the hangar. One of them is wearing the tinsel.' },
    { n: 'The Wampa King\'s cave', en: ['sd_beast', 'sd_wampa', 'sd_beast'], pay: ['kyber', 30], boss: 1, d: 'The cave at the end of the Frostline, piled with stolen presents.' },
  ];
  const WISH_TYPES = [['skin', 'Card skin', '🎨'], ['card', 'New card design', '🃏'], ['frame', 'Frame', '⭕'], ['banner', 'Banner', '🎏'], ['win', 'Win screen', '🏆'], ['pfp', 'Profile picture', '🙂'], ['shot', 'Blaster shot', '✨'], ['hit', 'Hit effect', '💥'], ['guild', 'Guild picture', '🛡'], ['back', 'Card back', '🂠'], ['crate', 'Crate theme', '📦'], ['custom', 'Something else', '✏']];

  // ---------- Art ----------
  const snow = (n, seed, w, h) => { const r = rnd(seed); return Array.from({ length: n }, () => `<circle class="sd-fl" cx="${(r() * w).toFixed(1)}" cy="${(r() * h).toFixed(1)}" r="${(.5 + r() * 1.2).toFixed(2)}" fill="#fff" opacity="${(.5 + r() * .45).toFixed(2)}" style="animation-duration:${(5 + r() * 5).toFixed(1)}s;animation-delay:-${(r() * 8).toFixed(1)}s"/>`).join(''); };
  // Christmas Rex: phase 2 helmet with Rex's blue, a Santa hat and a knitted scarf.
  const REX = (id = 'rx') => `<svg viewBox="0 0 100 100" class="sd-rex"><defs><radialGradient id="${id}b" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#2a4a7e"/><stop offset="1" stop-color="#0b1630"/></radialGradient><linearGradient id="${id}h" x1="0" x2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e6eaee"/><stop offset="1" stop-color="#b4bcc6"/></linearGradient><pattern id="${id}k" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#c8102e"/><path d="M0 0 L2 2 L4 0" stroke="#9a0a18" stroke-width=".7" fill="none"/></pattern></defs>
    ${R(0, 0, 100, 100, `url(#${id}b)`)}${lights(0, 10, 100, 8, 5, 8, 1.2)}
    ${P('M12 100 C14 84 28 76 50 76 C72 76 86 84 88 100Z', '#eef1f4')}${P('M50 76 C72 76 86 84 88 100 H56Z', '#000', 'opacity=".08"')}${P('M14 92 Q22 82 32 80 L30 100 H14Z', '#2a62c8', 'opacity=".9"')}${P('M86 92 Q78 82 68 80 L70 100 H86Z', '#2a62c8', 'opacity=".9"')}${R(42, 84, 16, 16, '#3a3e46', 'rx="2"')}
    ${P('M40 66 H60 L62 78 H38Z', '#24262c')}
    ${P('M29 44 C29 24 38 16 50 16 C62 16 71 24 71 44 L71 60 Q60 68 50 68 Q40 68 29 60Z', `url(#${id}h)`)}
    ${P('M33 26 Q50 16 67 26 L66 33 Q50 26 34 33Z', '#2a62c8')}${P('M46 18 H54 L53 34 H47Z', '#2a62c8')}
    ${P('M33 38 H67 L65 46 H55 V60 H45 V46 H35Z', '#101216')}${P('M35 39 H48 V44 H36Z', '#3a4a6a', 'opacity=".55"')}
    ${P('M31 52 L36 62 M69 52 L64 62', 'none', 'stroke="#2a62c8" stroke-width="2.6" stroke-linecap="round"')}${C(40, 64, 1.4, '#8a94a4')}${C(60, 64, 1.4, '#8a94a4')}
    ${P('M26 66 Q50 80 74 66 L76 74 Q50 90 24 74Z', `url(#${id}k)`)}${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${28 + i * 9} ${70 + Math.sin(i / 5 * Math.PI) * 6} v5" stroke="#1f7a3e" stroke-width="2"/>`).join('')}${P('M60 76 L64 96 L71 94 L66 74Z', `url(#${id}k)`)}${P('M64 96 L71 94 L72 98 L65 100Z', '#1f7a3e')}
    ${santaHat(50, 22, 44, -10, id + 's')}</svg>`;
  // Christmas Luthen: swept-back grey hair, beard, dark high-collared coat, a Santa hat and a green scarf.
  const LUTH = (id = 'lu') => `<svg viewBox="0 0 100 100" class="sd-luthen"><defs><radialGradient id="${id}b" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#5a3a2a"/><stop offset="1" stop-color="#1a0e0a"/></radialGradient><radialGradient id="${id}f" cx=".45" cy=".38" r=".7"><stop offset="0" stop-color="#f0c8a8"/><stop offset=".7" stop-color="#d8a482"/><stop offset="1" stop-color="#b07a5a"/></radialGradient><pattern id="${id}k" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#1f7a3e"/><path d="M0 0 L2 2 L4 0" stroke="#14501f" stroke-width=".7" fill="none"/></pattern></defs>
    ${R(0, 0, 100, 100, `url(#${id}b)`)}${C(84, 22, 14, '#ffcf7a', 'opacity=".18"')}${lights(0, 8, 100, 12, 5, 8, 1.2)}
    ${P('M10 100 C12 82 26 74 50 74 C74 74 88 82 90 100Z', '#2a2230')}${P('M50 74 C74 74 88 82 90 100 H58Z', '#000', 'opacity=".2"')}${P('M34 74 L50 92 L66 74 L60 72 L50 84 L40 72Z', '#1a1420')}${P('M36 70 L30 86 L42 78Z M64 70 L70 86 L58 78Z', '#3a3040')}
    ${P('M43 60 H57 L58 74 H42Z', `url(#${id}f)`)}${P('M43 64 Q50 68 57 64 L57 66 Q50 70 43 66Z', '#000', 'opacity=".15"')}
    ${P('M34 44 C34 28 41 21 50 21 C59 21 66 28 66 44 C66 54 62 62 55 65 Q50 67 45 65 C38 62 34 54 34 44Z', `url(#${id}f)`)}
    ${P('M35 50 Q37 64 50 67 Q63 64 65 50 Q62 58 56 60 Q50 62 44 60 Q38 58 35 50Z', '#b8b4ae')}${P('M44 58 Q50 56 56 58 Q50 61 44 58Z', '#9a958e')}
    ${P('M32 42 C30 26 40 16 52 16 C64 16 70 26 68 42 C66 32 60 26 50 26 C42 26 36 32 32 42Z', '#c8c4bc')}${P('M34 34 Q44 22 62 26', 'none', 'stroke="#a8a49c" stroke-width="1"')}${P('M32 42 Q30 52 33 56 L35 46Z M68 42 Q70 52 67 56 L65 46Z', '#c8c4bc')}
    ${P('M39 41 Q43 39 47 41 M53 41 Q57 39 61 41', 'none', 'stroke="#6a5a52" stroke-width="1.3" stroke-linecap="round"')}${E(43, 45, 2, 1.4, '#2a2420')}${E(57, 45, 2, 1.4, '#2a2420')}${C(43.6, 44.6, .5, '#fff')}${C(57.6, 44.6, .5, '#fff')}
    ${P('M49 45 L48 52 Q50 53.4 52 52 L51 45', 'none', 'stroke="#b07a5a" stroke-width=".9"')}${P('M45 56 Q50 58.4 55 56', 'none', 'stroke="#7a4a3a" stroke-width="1.1" stroke-linecap="round"')}
    ${P('M28 68 Q50 80 72 68 L74 76 Q50 90 26 76Z', `url(#${id}k)`)}${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${30 + i * 8.4} ${72 + Math.sin(i / 5 * Math.PI) * 6} v5" stroke="#e8252f" stroke-width="2"/>`).join('')}${P('M34 78 L30 98 L38 98 L40 78Z', `url(#${id}k)`)}${P('M30 98 L38 98 L37 100 H29Z', '#e8252f')}
    ${santaHat(52, 24, 40, 8, id + 's')}</svg>`;

  // Echo Base, decorated: the hub. Hotspots are placed over this in js/snowday.js (percent of 400 x 240).
  const HUB = () => { const r = rnd(5);
    return `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" class="sd-hub-svg" aria-hidden="true"><defs>
      <linearGradient id="sdhw" x2="0" y2="1"><stop offset="0" stop-color="#1c2c4c"/><stop offset="1" stop-color="#3a5276"/></linearGradient>
      <linearGradient id="sdhf" x2="0" y2="1"><stop offset="0" stop-color="#8aa2c4"/><stop offset="1" stop-color="#c8d8ec"/></linearGradient>
      <linearGradient id="sdho" x2="0" y2="1"><stop offset="0" stop-color="#101c3a"/><stop offset="1" stop-color="#4a6a98"/></linearGradient>
      <radialGradient id="sdhg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>
      <radialGradient id="sdhc" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#05080f"/><stop offset="1" stop-color="#2a3a56"/></radialGradient>
      <pattern id="sdhp" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#b3121f"/><path d="M4 1 v6 M1 4 h6" stroke="#ffd23f" stroke-width=".6" opacity=".6"/></pattern></defs>
      ${R(0, 0, 400, 240, 'url(#sdhw)')}
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${-20 + i * 55} 0 Q${10 + i * 55} 60 ${-10 + i * 55} 150" stroke="#5a7aa4" stroke-width="10" fill="none" opacity=".35"/>`).join('')}
      ${P('M0 0 H400 V30 Q300 16 200 22 T0 30Z', '#2a3e60')}${Array.from({ length: 30 }, (_, i) => P(`M${i * 14} 24 l4 ${8 + (i % 4) * 4} l4 ${-8 - (i % 4) * 4}Z`, '#d8e8fa', 'opacity=".85"')).join('')}
      <!-- open hangar doors onto the blizzard -->
      ${P('M150 150 V70 Q200 40 250 70 V150Z', 'url(#sdho)')}${snow(26, 3, 400, 240).replace(/class="sd-fl"/g, 'class="sd-fl" clip-path="none"').slice(0, 0)}
      <g clip-path="none">${Array.from({ length: 16 }, () => C((154 + r() * 92).toFixed(1), (72 + r() * 76).toFixed(1), (.6 + r()).toFixed(1), '#fff', 'class="sd-fl" opacity=".8"')).join('')}</g>
      ${P('M160 150 L170 128 L190 126 L200 118 L216 126 L236 128 L244 150Z', '#cfe0f5')}${P('M196 130 l6 -6 h12 l4 6Z', '#e6ebf0')}
      ${P('M146 152 V68 Q200 34 254 68 V152', 'none', 'stroke="#6a84aa" stroke-width="6"')}${P('M146 152 V68 Q200 34 254 68 V152', 'none', 'stroke="#c8d8ec" stroke-width="1.4" opacity=".7"')}
      ${lights(146, 70, 254, 70, 10, 12, 1.5)}
      <!-- floor -->
      ${P('M0 150 H400 V240 H0Z', 'url(#sdhf)')}${P('M0 150 H400 V156 H0Z', '#6a84aa', 'opacity=".5"')}${Array.from({ length: 8 }, (_, i) => `<path d="M${i * 60 - 40} 240 L${150 + i * 14} 156" stroke="#9ab0cc" stroke-width="1" opacity=".5"/>`).join('')}
      <!-- the calendar wall, behind the hangar door frame on the left -->
      <g transform="translate(6 36) scale(.68)">${R(-4, -6, 108, 92, '#2a3a5a', 'rx="4"')}${R(-4, -6, 108, 6, '#c8102e', 'rx="2"')}<text x="50" y="-1.4" text-anchor="middle" font-family="Fredoka,Arial" font-weight="700" font-size="5" fill="#fff">ADVENT CALENDAR</text>
        ${Array.from({ length: 27 }, (_, i) => { const x = (i % 7) * 14.4 + 1, y = Math.floor(i / 7) * 20 + 4; const pc = ['#b3121f', '#1a6a35', '#123a7a', '#c89a2c'][i % 4]; return `${R(x, y, 12, 16, pc, 'rx="1"')}${R(x + 5.2, y, 1.6, 16, '#ffd23f')}${R(x, y + 7, 12, 1.6, '#ffd23f')}<text x="${x + 6}" y="${y + 13.4}" text-anchor="middle" font-family="Fredoka,Arial" font-weight="700" font-size="4.4" fill="#fff">${i + 1}</text>`; }).join('')}</g>
      <!-- Christmas tree -->
      <g transform="translate(118 152)">${C(0, -40, 34, 'url(#sdhg)')}${P('M0 -84 L16 -60 H9 L24 -38 H14 L30 -14 H18 L36 0 H-36 L-18 -14 H-30 L-14 -38 H-24 L-9 -60 H-16Z', '#14552c')}${P('M0 -84 L16 -60 H9 L24 -38 H14 L30 -14 H18 L36 0 H0Z', '#000', 'opacity=".18"')}${R(-4, 0, 8, 6, '#4a2a16')}
        <g class="sd-tw">${[[-6, -66], [7, -56], [-12, -48], [12, -40], [-4, -36], [-18, -26], [16, -22], [2, -18], [-24, -8], [22, -6], [-8, -6], [10, -10]].map(([x, y], i) => C(x, y, 1.8, BUL[i % 5])).join('')}</g>
        <path d="M-12 -52 Q0 -46 13 -54 M-20 -30 Q0 -22 21 -32 M-28 -8 Q0 0 29 -10" stroke="#ffd23f" stroke-width="1" fill="none" opacity=".7"/>
        ${P('M0 -94 L2.6 -88 L9 -87.4 L4.2 -83 L5.6 -76.6 L0 -80 L-5.6 -76.6 L-4.2 -83 L-9 -87.4 L-2.6 -88Z', '#ffd23f', 'class="sd-glow"')}
        ${[[-30, 0, 12, 9, '#b3121f'], [-16, 2, 10, 8, '#1a6a35'], [18, 1, 12, 10, '#123a7a'], [30, 3, 9, 7, '#c89a2c']].map(([x, y, w, h, c]) => `${R(x, y - h, w, h, c, 'rx=".8"')}${R(x + w / 2 - .8, y - h, 1.6, h, '#ffd23f')}${R(x, y - h / 2 - .8, w, 1.6, '#ffd23f')}`).join('')}</g>
      <!-- the wish box (a mailbox by the tree) -->
      <g transform="translate(160 186)">${R(-1.4, 0, 2.8, 20, '#5a6474')}${R(-9, -12, 18, 13, '#c8102e', 'rx="6"')}${R(-9, -6, 18, 7, '#c8102e')}${R(-6, -6, 12, 1.6, '#3a0a10')}${R(8, -16, 1.4, 8, '#5a6474')}${R(8, -16, 6, 4, '#ffd23f')}<text x="0" y="5" text-anchor="middle" font-family="Fredoka,Arial" font-weight="700" font-size="4" fill="#fff">WISHES</text></g>
      <!-- Rex's command post: a holo-table -->
      <g transform="translate(72 206)">${E(0, 6, 34, 6, '#000', 'opacity=".2"')}${R(-28, -6, 56, 10, '#3a4a62', 'rx="2"')}${R(-24, 4, 48, 6, '#2a3448')}${E(0, -10, 22, 5, '#4aa8ff', 'opacity=".25"')}<g class="sd-holo">${P('M-16 -12 Q0 -24 16 -12', 'none', 'stroke="#9ad0ff" stroke-width="1"')}${C(0, -16, 4, 'none', 'stroke="#9ad0ff" stroke-width=".8"')}${R(-10, -14, 6, 4, 'none', 'stroke="#9ad0ff" stroke-width=".6"')}</g><text x="0" y="1.4" text-anchor="middle" font-family="Fredoka,Arial" font-weight="700" font-size="4.6" fill="#9ad0ff">REX · MISSIONS</text></g>
      <!-- Luthen's pop-up stall -->
      <g transform="translate(300 152)">${E(0, 44, 46, 6, '#000', 'opacity=".2"')}${R(-36, -40, 4, 84, '#5a3a22')}${R(32, -40, 4, 84, '#5a3a22')}${P('M-44 -36 L0 -58 L44 -36Z', '#c8102e')}${Array.from({ length: 8 }, (_, i) => P(`M${-44 + i * 11} -36 l5.5 8 l5.5 -8Z`, i % 2 ? '#f6f3ee' : '#c8102e')).join('')}${lights(-44, -34, 44, -34, 4, 10, 1.3)}
        ${R(-34, 10, 68, 26, '#6a4a2a')}${R(-34, 10, 68, 3, '#8a6a3a')}${[[-26, 4, '#b3121f'], [-12, 2, '#1a6a35'], [4, 4, '#c89a2c'], [18, 3, '#123a7a']].map(([x, y, c]) => `${R(x, y, 10, 8, c, 'rx=".8"')}${R(x + 4.2, y, 1.6, 8, '#ffd23f')}`).join('')}
        ${R(-30, -20, 60, 12, '#2a1a12', 'rx="2"')}<text x="0" y="-11.6" text-anchor="middle" font-family="Fredoka,Arial" font-weight="700" font-size="6.4" fill="#ffd23f">LUTHEN'S</text></g>
      <!-- the Wampa King's cave -->
      <g transform="translate(372 120)">${P('M-26 32 Q-26 -22 2 -26 Q30 -22 30 32Z', '#9ab0cc')}${P('M-18 32 Q-18 -10 2 -14 Q22 -10 22 32Z', 'url(#sdhc)')}${Array.from({ length: 6 }, (_, i) => P(`M${-14 + i * 6} ${-12 + Math.abs(i - 2.5) * 2} l2 7 l2 -7Z`, '#eef4ff')).join('')}<g class="sd-eyes">${C(-3, 10, 1.6, '#ffd23f')}${C(7, 10, 1.6, '#ffd23f')}</g><text x="2" y="42" text-anchor="middle" font-family="Fredoka,Arial" font-weight="700" font-size="5" fill="#fff">WAMPA CAVE</text></g>
      <!-- Frostline route board and a snowspeeder -->
      <g transform="translate(200 186)">${R(-1.4, 0, 2.8, 22, '#5a6474')}${R(-24, -18, 48, 20, '#eef4ff', 'rx="2"')}${R(-24, -18, 48, 5, '#2a62c8', 'rx="2"')}<text x="0" y="-14" text-anchor="middle" font-family="Fredoka,Arial" font-weight="700" font-size="4" fill="#fff">FROSTLINE</text><path d="M-18 -4 L-8 -8 L0 -3 L10 -9 L18 -5" stroke="#c8102e" stroke-width="1" fill="none" stroke-dasharray="1.6 1.2"/>${[-18, -8, 0, 10, 18].map((x, i) => C(x, [-4, -8, -3, -9, -5][i], 1.3, i === 4 ? '#c8102e' : '#2a62c8')).join('')}</g>
      <g transform="translate(252 226) scale(.9)">${P('M-22 -2 L-6 -7 L14 -6 L26 -1 L26 2 L14 5 L-6 6 L-22 2Z', '#e6ebf0')}${P('M2 -11 L11 -11 L12.6 -6.6 L4 -6.6Z', '#2a3a5a')}${P('M6 -5 L22 -2 L22 -.6 L6 -3Z', '#ff8a3a')}${santaHat(4, -10, 8, -14, 'sdsp')}</g>
      ${lights(0, 34, 146, 70, 6, 12, 1.4)}${lights(254, 70, 400, 34, 6, 12, 1.4)}
      ${Array.from({ length: 22 }, () => C((r() * 400).toFixed(1), (r() * 150).toFixed(1), (.6 + r()).toFixed(1), '#fff', 'class="sd-fl" opacity=".6"')).join('')}
    </svg>`; };

  // A wrapped door for the calendar wall (number, paper pattern from the day, bow).
  const PAPERS = [['#b3121f', '#ffd23f', '#ffe3e6'], ['#1a6a35', '#e8252f', '#cdeed8'], ['#123a7a', '#e8252f', '#cfe0ff'], ['#c89a2c', '#b3121f', '#fff6c0'], ['#6a1a8a', '#ffd23f', '#f0d0ff'], ['#0e6a6a', '#ffd23f', '#c8fff6']];
  const DOOR = (i) => { const [base, rib, dot] = PAPERS[i % PAPERS.length]; const id = 'sdd' + i; const pat = i % 3;
    return `<svg viewBox="0 0 60 80" class="sd-door-svg" aria-hidden="true"><defs><pattern id="${id}" width="10" height="10" patternUnits="userSpaceOnUse">${R(0, 0, 10, 10, base)}${pat === 0 ? `<path d="M5 1.6 v6.8 M1.6 5 h6.8 M2.6 2.6 l4.8 4.8 M7.4 2.6 l-4.8 4.8" stroke="${dot}" stroke-width=".6" opacity=".7"/>` : pat === 1 ? `${C(2.5, 2.5, 1.1, dot, 'opacity=".75"')}${C(7.5, 7.5, 1.1, dot, 'opacity=".75"')}` : `${R(0, 0, 5, 5, '#000', 'opacity=".12"')}${R(5, 5, 5, 5, '#000', 'opacity=".12"')}<path d="M0 2.5 h10 M2.5 0 v10" stroke="${dot}" stroke-width=".4" opacity=".6"/>`}</pattern></defs>
      ${R(0, 0, 60, 80, `url(#${id})`, 'rx="5"')}${R(0, 0, 60, 80, 'none', 'stroke="#000" stroke-opacity=".25" stroke-width="2" rx="5"')}${R(26, 0, 8, 80, rib)}${R(0, 36, 60, 8, rib)}${R(27.4, 0, 1.6, 80, '#fff', 'opacity=".3"')}${R(0, 37.4, 60, 1.6, '#fff', 'opacity=".3"')}
      ${P('M30 40 C22 30 12 32 16 39 C19 44 26 42 30 40 C34 42 41 44 44 39 C48 32 38 30 30 40Z', rib)}${C(30, 40, 3.6, rib)}${C(29, 39, 1.2, '#fff', 'opacity=".5"')}
      ${C(13, 14, 9, '#fff8ef')}${C(13, 14, 9, 'none', `stroke="${rib}" stroke-width="1.6"`)}<text x="13" y="17.6" text-anchor="middle" font-family="Fredoka,Arial" font-weight="700" font-size="10" fill="#2a1c00">${i + 1}</text></svg>`; };

  // The Christmas Day tree (cutscene and present room).
  const TREE = () => `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" class="sd-xt-svg" aria-hidden="true"><defs><radialGradient id="sdxg" cx=".5" cy=".45" r=".55"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".5"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient><linearGradient id="sdxt" x1="0" x2="1"><stop offset="0" stop-color="#1f8a45"/><stop offset=".55" stop-color="#14552c"/><stop offset="1" stop-color="#0c3a1c"/></linearGradient></defs>
    ${C(200, 140, 170, 'url(#sdxg)', 'class="sd-xt-glow"')}
    <g class="sd-xt-tree">${[[0, 40, 70], [1, 80, 100], [2, 120, 130], [3, 165, 160], [4, 210, 190]].map(([i, y, w]) => `${P(`M200 ${y - 54} L${200 + w / 2} ${y} Q200 ${y + 10} ${200 - w / 2} ${y}Z`, 'url(#sdxt)')}<path d="M${200 - w / 2} ${y} Q200 ${y + 10} ${200 + w / 2} ${y}" stroke="#eef4ff" stroke-width="2" fill="none" opacity=".8"/>`).join('')}${R(192, 210, 16, 22, '#4a2a16')}</g>
    <g class="sd-xt-lights">${[[200, 40, 3], [200, 80, 5], [200, 120, 6], [200, 165, 8], [200, 210, 9]].map(([cx, y, n], ti) => Array.from({ length: n }, (_, k) => { const t = (k + .5) / n; const w = [60, 90, 120, 150, 180][ti]; const x = cx - w / 2 + t * w; return `${C(x.toFixed(1), y - 6 - Math.sin(t * Math.PI) * 3, 6, BUL[(k + ti) % 5], 'opacity=".3"')}${C(x.toFixed(1), y - 6 - Math.sin(t * Math.PI) * 3, 3, BUL[(k + ti) % 5])}`; }).join('')).join('')}</g>
    <g class="sd-xt-garland">${[[200, 52, 50], [200, 96, 80], [200, 140, 110], [200, 186, 140]].map(([cx, y, w]) => `<path d="M${cx - w / 2} ${y} Q${cx} ${y + 14} ${cx + w / 2} ${y - 6}" stroke="#ffd23f" stroke-width="2" fill="none"/>`).join('')}</g>
    <g class="sd-xt-star">${C(200, -10, 18, '#ffd23f', 'opacity=".3"')}${P('M200 -26 L205 -15 L217 -14 L208 -6 L211 6 L200 0 L189 6 L192 -6 L183 -14 L195 -15Z', '#ffd23f')}</g>
    ${P('M0 262 Q200 244 400 262 V300 H0Z', '#eef4ff')}</svg>`;
  // A present for the Christmas Day room. kind picks the paper.
  const PRESENT = (i) => { const [base, rib] = PAPERS[i % PAPERS.length]; return `<svg viewBox="0 0 60 60" aria-hidden="true">${E(30, 56, 24, 3, '#000', 'opacity=".25"')}<g class="sd-pb">${R(8, 22, 44, 34, base, 'rx="2"')}${R(26, 22, 8, 34, rib)}${R(8, 22, 44, 34, 'none', 'stroke="#000" stroke-opacity=".2" stroke-width="1.4" rx="2"')}</g><g class="sd-pl">${R(5, 14, 50, 10, base, 'rx="2"')}${R(26, 14, 8, 10, rib)}${P('M30 14 C22 2 12 6 16 12 C19 16 26 15 30 14 C34 15 41 16 44 12 C48 6 38 2 30 14Z', rib)}${C(30, 14, 3, rib)}</g></svg>`; };
  // The Generosity badge cutscene: Luthen in his Santa hat, warm lamplight, falling snow.
  const GEN = () => `<svg viewBox="0 0 300 200" class="sd-gen-svg" aria-hidden="true"><defs><radialGradient id="sdgl" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".7"/><stop offset="1" stop-color="#2a140a" stop-opacity="0"/></radialGradient></defs>${R(0, 0, 300, 200, '#1a0e0a')}${C(150, 90, 130, 'url(#sdgl)')}${lights(0, 10, 300, 12, 10, 16, 2)}<g transform="translate(95 30) scale(1.1)">${LUTH('sdgx').replace('<svg viewBox="0 0 100 100" class="sd-luthen">', '').replace(/<\/svg>$/, '')}</g>${snow(24, 9, 300, 200)}</svg>`;

  root.SnowDayData = { START, DOORS, DAYS, STALL, LUTHEN, FROST, WISH_TYPES, REX, LUTH, HUB, DOOR, TREE, PRESENT, GEN, santaHat, lights, C, P, R, E, BUL };
})(window);
