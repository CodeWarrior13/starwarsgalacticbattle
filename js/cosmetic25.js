// Update 2.5 "Cosmetic": three new cards from the owner's saved ideas.
//  - The Havoc (Legendary ship): Captain Nym's Scurrg H-6 prototype bomber.
//    Six forward cannons, a dorsal ball turret that fires a free shot after
//    every action, and a bomb bay that never runs dry (but drains its power).
//  - Embo (Legendary bounty hunter): the Kyuzo in the shield-hat. Throws the
//    hat through two enemies, raises it as a shield, and sets his anooba on
//    the weak. Ultimate: The Hunt.
//  - Marrok (Epic companion): Embo's anooba. Pounces and bleeds, howls the
//    squad up, and hunts as a pair with Embo. Ultimate: Savage Frenzy.
// Off until 2.5 ships. Testers switch it on with its code (or the master key);
// the code also hands over all three cards so they can be played straight away.
(function (root) {
  'use strict';
  const D = root.GameData;
  const UI = root.UI;
  const Player = root.Player;
  if (!D || !UI || !Player || !root.Battle) return;

  // ---------- Release switch ----------
  const RELEASE25 = root.__v25Test != null ? root.__v25Test : null;
  const TEST_KEY = 'swcg-v25-test';
  const test = (v) => {
    try {
      if (v === undefined) return localStorage.getItem(TEST_KEY) === '1';
      if (v) localStorage.setItem(TEST_KEY, '1'); else localStorage.removeItem(TEST_KEY);
    } catch (e) { return false; }
    return !!v;
  };
  const released = () => RELEASE25 != null && Date.now() >= RELEASE25;
  const on = () => released() || test();
  root.Update25 = { on, test, released, at: RELEASE25 };
  const IDS = ['havoc', 'embo', 'marrok'];
  const code = () => String.fromCharCode(67, 79, 83, 77, 69, 84, 73, 67, 50, 53);
  const H = UI.hooks;
  // Testers start with all three at a level they can actually fight with.
  const grantAll = () => {
    const s = Player.state;
    const lv = Math.max(10, Math.min(D.MAX_LEVEL || 50, Math.round(Object.values(s.units).reduce((a, u) => Math.max(a, u.level || 1), 1))));
    for (const id of IDS) {
      if (!D.UNIT_MAP[id]) continue;
      if (!Player.owns(id)) Player.grantCard(id, false);
      const u = s.units[id];
      u.level = Math.max(u.level || 1, lv);
      u.stars = Math.max(u.stars || 1, 5);
    }
    Player.save();
  };
  if (H) {
    const before = H.redeem;
    H.redeem = (c) => {
      if (c !== code()) return before ? before(c) : false;
      const was = test();
      test(!was);
      if (!was) { try { localStorage.setItem('swcg-v25-grant', '1'); } catch (e) { /* storage blocked */ } }
      UI.toast(was ? '2.5 Cosmetic test OFF for this device. Reloading…' : '2.5 Cosmetic test ON: the Havoc, Embo and Marrok are in your collection, plus the new frames. Reloading…');
      setTimeout(() => location.reload(), 1600);
      return true;
    };
  }
  if (!on()) return;

  // ---------- Art ----------
  // Ship shapes are drawn nose-up on a 100 × 100 board.
  const havocShip = () => `<defs>
    <linearGradient id="hv25h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2140"/><stop offset=".3" stop-color="#6a5896"/><stop offset=".5" stop-color="#a493d0"/><stop offset=".7" stop-color="#6a5896"/><stop offset="1" stop-color="#2a2140"/></linearGradient>
    <linearGradient id="hv25w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a78b8"/><stop offset="1" stop-color="#352a52"/></linearGradient>
    <linearGradient id="hv25m" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2f3a"/><stop offset=".5" stop-color="#8a92a4"/><stop offset="1" stop-color="#2a2f3a"/></linearGradient>
    <radialGradient id="hv25g" cx=".4" cy=".35"><stop offset="0" stop-color="#e8fbff"/><stop offset=".45" stop-color="#4ab0e0"/><stop offset="1" stop-color="#0a2440"/></radialGradient>
    <radialGradient id="hv25f"><stop offset="0" stop-color="#fff6c8"/><stop offset=".35" stop-color="#ffa040"/><stop offset="1" stop-color="#ff4a10" stop-opacity="0"/></radialGradient>
  </defs><g transform="translate(9 7) scale(0.82)">
  <ellipse cx="35" cy="95" rx="6" ry="9" fill="url(#hv25f)"/><ellipse cx="65" cy="95" rx="6" ry="9" fill="url(#hv25f)"/>
  <path d="M30 56 L4 74 L6 82 L32 76Z" fill="url(#hv25w)" stroke="#140e24" stroke-width="1"/><path d="M70 56 L96 74 L94 82 L68 76Z" fill="url(#hv25w)" stroke="#140e24" stroke-width="1"/>
  <path d="M8 76 L30 66" stroke="#e8742a" stroke-width="2.2"/><path d="M92 76 L70 66" stroke="#e8742a" stroke-width="2.2"/>
  <path d="M6 82 L4 74 L10 72 L12 80Z" fill="#ff5a4a" opacity=".85"/><path d="M94 82 L96 74 L90 72 L88 80Z" fill="#ff5a4a" opacity=".85"/>
  <rect x="28" y="58" width="14" height="34" rx="5" fill="url(#hv25m)" stroke="#0e1118" stroke-width="1"/><rect x="58" y="58" width="14" height="34" rx="5" fill="url(#hv25m)" stroke="#0e1118" stroke-width="1"/>
  <path d="M29 66 H41 M29 72 H41 M29 78 H41 M59 66 H71 M59 72 H71 M59 78 H71" stroke="#141820" stroke-width=".9"/>
  <ellipse cx="35" cy="91" rx="5" ry="2.4" fill="#ffb060"/><ellipse cx="65" cy="91" rx="5" ry="2.4" fill="#ffb060"/>
  <path d="M40 16 L60 16 L66 30 L68 84 L60 92 L40 92 L32 84 L34 30Z" fill="url(#hv25h)" stroke="#140e24" stroke-width="1.4"/>
  <path d="M42 18 L58 18 L62 30 L38 30Z" fill="#c4b4ec" opacity=".35"/>
  <path d="M50 18 V90" stroke="#e8742a" stroke-width="2.6"/><path d="M47.6 20 V88" stroke="#ffb060" stroke-width=".7" opacity=".7"/>
  <path d="M36 40 H64 M35 56 H65 M34 72 H66" stroke="#1a1330" stroke-width=".9" opacity=".8"/>
  <g fill="#d9cdf2" opacity=".7"><circle cx="38" cy="36" r=".9"/><circle cx="62" cy="36" r=".9"/><circle cx="37" cy="62" r=".9"/><circle cx="63" cy="62" r=".9"/><circle cx="37" cy="80" r=".9"/><circle cx="63" cy="80" r=".9"/></g>
  <rect x="42" y="62" width="16" height="18" rx="2" fill="#12091f" stroke="#e8742a" stroke-width=".8"/>
  <g fill="#2e3340" stroke="#aeb8cc" stroke-width=".5"><circle cx="46" cy="67" r="2.2"/><circle cx="54" cy="67" r="2.2"/><circle cx="46" cy="75" r="2.2"/><circle cx="54" cy="75" r="2.2"/></g>
  <g fill="#ff5a4a"><circle cx="46" cy="67" r=".7"/><circle cx="54" cy="67" r=".7"/><circle cx="46" cy="75" r=".7"/><circle cx="54" cy="75" r=".7"/></g>
  <path d="M44 22 Q50 18 56 22 L56 32 Q50 36 44 32Z" fill="url(#hv25g)" stroke="#0b1424" stroke-width="1"/><path d="M46 23 Q50 21 53 23" stroke="#fff" stroke-width=".9" opacity=".8" fill="none"/>
  <g fill="url(#hv25m)" stroke="#0c0f15" stroke-width=".5">${[37.5, 40.5, 43.5, 56.5, 59.5, 62.5].map((x) => `<rect x="${x - 0.9}" y="3" width="1.8" height="17" rx=".6"/>`).join('')}</g>
  <g fill="#ffd8a0">${[37.5, 40.5, 43.5, 56.5, 59.5, 62.5].map((x) => `<rect x="${x - 0.9}" y="2.4" width="1.8" height="1.6"/>`).join('')}</g>
  <rect x="35" y="17" width="30" height="3.4" rx="1.4" fill="#2a2f3c" stroke="#0c0f15" stroke-width=".6"/>
  <g><circle cx="50" cy="48" r="6" fill="url(#hv25m)" stroke="#0c0f15" stroke-width="1"/><circle cx="48.4" cy="46.4" r="1.6" fill="#fff" opacity=".4"/>
  <rect x="48.4" y="35" width="1.2" height="10" rx=".5" fill="#2a2f3c" stroke="#0c0f15" stroke-width=".4"/><rect x="50.6" y="35" width="1.2" height="10" rx=".5" fill="#2a2f3c" stroke="#0c0f15" stroke-width=".4"/>
  <circle cx="50" cy="48" r="1.5" fill="#ff5a4a"/></g>
  <g transform="translate(50 86)"><circle r="3.4" fill="#12091f" stroke="#ff5a4a" stroke-width=".7"/><circle cx="-1.1" cy="-.5" r=".7" fill="#ff5a4a"/><circle cx="1.1" cy="-.5" r=".7" fill="#ff5a4a"/><path d="M-1.4 1.5H1.4" stroke="#ff5a4a" stroke-width=".6"/></g></g>`;

  // Card portraits (200 × 200 drawings, shown at half size).
  const ART25_EMBO = "<defs>\n  <linearGradient id=\"eb_sky\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#14122a\"/><stop offset=\".45\" stop-color=\"#4a2a44\"/><stop offset=\".75\" stop-color=\"#b8563a\"/><stop offset=\"1\" stop-color=\"#f0a050\"/></linearGradient>\n  <linearGradient id=\"eb_hat\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#3a414c\"/><stop offset=\".3\" stop-color=\"#8e98a6\"/><stop offset=\".5\" stop-color=\"#e6ebf1\"/><stop offset=\".62\" stop-color=\"#a8b2be\"/><stop offset=\"1\" stop-color=\"#2e343e\"/></linearGradient>\n  <linearGradient id=\"eb_brim\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#1c2028\"/><stop offset=\"1\" stop-color=\"#3a414c\"/></linearGradient>\n  <linearGradient id=\"eb_metal\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#e2e7ee\"/><stop offset=\".45\" stop-color=\"#8a94a2\"/><stop offset=\"1\" stop-color=\"#2a3038\"/></linearGradient>\n  <linearGradient id=\"eb_cloak\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#7a5a3a\"/><stop offset=\"1\" stop-color=\"#2a1c10\"/></linearGradient>\n  <linearGradient id=\"eb_scarf\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#4a5628\"/><stop offset=\".5\" stop-color=\"#8a9a52\"/><stop offset=\"1\" stop-color=\"#3a4420\"/></linearGradient>\n  <linearGradient id=\"eb_plate\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#5a5248\"/><stop offset=\"1\" stop-color=\"#26221e\"/></linearGradient>\n  <linearGradient id=\"eb_wood\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#8a5a30\"/><stop offset=\"1\" stop-color=\"#3a2210\"/></linearGradient>\n  <radialGradient id=\"eb_eye\"><stop offset=\"0\" stop-color=\"#fffbd0\"/><stop offset=\".35\" stop-color=\"#ffc030\"/><stop offset=\"1\" stop-color=\"#ff7a00\" stop-opacity=\"0\"/></radialGradient>\n  <radialGradient id=\"eb_sun\" cx=\".5\" cy=\".5\"><stop offset=\"0\" stop-color=\"#fff0c0\"/><stop offset=\".4\" stop-color=\"#ffb060\" stop-opacity=\".8\"/><stop offset=\"1\" stop-color=\"#ff7a30\" stop-opacity=\"0\"/></radialGradient>\n  <radialGradient id=\"eb_rim\" cx=\".5\" cy=\"1\"><stop offset=\"0\" stop-color=\"#ffb060\" stop-opacity=\".35\"/><stop offset=\"1\" stop-color=\"#ffb060\" stop-opacity=\"0\"/></radialGradient>\n</defs>\n<rect width=\"200\" height=\"200\" fill=\"url(#eb_sky)\"/>\n<g fill=\"#fff\" opacity=\".7\"><circle cx=\"18\" cy=\"16\" r=\".8\"/><circle cx=\"44\" cy=\"30\" r=\".6\"/><circle cx=\"70\" cy=\"10\" r=\".7\"/><circle cx=\"130\" cy=\"14\" r=\".6\"/><circle cx=\"160\" cy=\"28\" r=\".9\"/><circle cx=\"186\" cy=\"12\" r=\".6\"/><circle cx=\"100\" cy=\"24\" r=\".5\"/></g>\n<circle cx=\"160\" cy=\"70\" r=\"34\" fill=\"url(#eb_sun)\"/><circle cx=\"160\" cy=\"70\" r=\"11\" fill=\"#fff4d0\"/><circle cx=\"132\" cy=\"58\" r=\"6\" fill=\"#ffe0b0\" opacity=\".9\"/>\n<path d=\"M0 118 L18 98 L30 104 L44 86 L62 100 L80 92 L96 106 L120 94 L138 104 L156 90 L176 102 L200 92 V200 H0Z\" fill=\"#5a2e2c\" opacity=\".75\"/>\n<path d=\"M0 132 L14 122 L28 128 L36 112 L52 114 L60 126 L84 120 L110 128 L140 116 L162 124 L184 114 L200 120 V200 H0Z\" fill=\"#3a1e1e\"/>\n<g transform=\"translate(28 52) scale(.12)\" opacity=\".7\"><path d=\"M0 40 L200 30 L260 50 L200 70 L0 60Z\" fill=\"#2a1a2a\"/><rect x=\"40\" y=\"10\" width=\"40\" height=\"80\" fill=\"#2a1a2a\"/></g>\n<rect y=\"140\" width=\"200\" height=\"60\" fill=\"url(#eb_rim)\"/>\n<!-- cloak and shoulders -->\n<path d=\"M6 200 L16 160 Q34 134 100 130 Q166 134 184 160 L194 200Z\" fill=\"url(#eb_cloak)\" stroke=\"#1a1008\" stroke-width=\"1.6\"/>\n<path d=\"M24 200 L34 166 M52 200 L58 152 M148 200 L142 152 M176 200 L166 166\" stroke=\"#1a1008\" stroke-width=\"1.2\" opacity=\".5\"/>\n<!-- chest armour: layered plates -->\n<path d=\"M58 152 Q100 138 142 152 L136 200 H64Z\" fill=\"url(#eb_plate)\" stroke=\"#120e0a\" stroke-width=\"1.6\"/>\n<path d=\"M62.64 160 Q100 152 137.36 160\" fill=\"none\" stroke=\"#8a8070\" stroke-width=\"1.2\" opacity=\".75\"/><path d=\"M62.64 161.6 Q100 153.6 137.36 161.6\" fill=\"none\" stroke=\"#120e0a\" stroke-width=\".9\"/><path d=\"M63.6 172 Q100 164 136.4 172\" fill=\"none\" stroke=\"#8a8070\" stroke-width=\"1.2\" opacity=\".75\"/><path d=\"M63.6 173.6 Q100 165.6 136.4 173.6\" fill=\"none\" stroke=\"#120e0a\" stroke-width=\".9\"/><path d=\"M64.56 184 Q100 176 135.44 184\" fill=\"none\" stroke=\"#8a8070\" stroke-width=\"1.2\" opacity=\".75\"/><path d=\"M64.56 185.6 Q100 177.6 135.44 185.6\" fill=\"none\" stroke=\"#120e0a\" stroke-width=\".9\"/>\n<path d=\"M92 150 L108 150 L106 198 L94 198Z\" fill=\"#3a332c\" stroke=\"#120e0a\" stroke-width=\"1\"/><circle cx=\"96\" cy=\"156\" r=\"1.3\" fill=\"#e8d8a8\" stroke=\"#4a3a1a\" stroke-width=\".6\"/><circle cx=\"104\" cy=\"156\" r=\"1.3\" fill=\"#e8d8a8\" stroke=\"#4a3a1a\" stroke-width=\".6\"/><circle cx=\"96\" cy=\"176\" r=\"1.3\" fill=\"#e8d8a8\" stroke=\"#4a3a1a\" stroke-width=\".6\"/><circle cx=\"104\" cy=\"176\" r=\"1.3\" fill=\"#e8d8a8\" stroke=\"#4a3a1a\" stroke-width=\".6\"/>\n<path d=\"M70 168 L76 158 M130 168 L124 158\" stroke=\"#c8b890\" stroke-width=\"1\" opacity=\".5\"/>\n<!-- belt pouches peeking at the bottom -->\n<rect x=\"66\" y=\"190\" width=\"14\" height=\"10\" rx=\"2\" fill=\"#5a3a20\" stroke=\"#1a1008\"/><rect x=\"120\" y=\"190\" width=\"14\" height=\"10\" rx=\"2\" fill=\"#5a3a20\" stroke=\"#1a1008\"/>\n<!-- bandolier -->\n<g transform=\"rotate(-34 100 170)\"><rect x=\"30\" y=\"162\" width=\"140\" height=\"15\" rx=\"2\" fill=\"#4a2e18\" stroke=\"#120a04\" stroke-width=\"1.2\"/>\n<rect x=\"36\" y=\"163.5\" width=\"7\" height=\"12\" rx=\"1.6\" fill=\"#d9a43a\" stroke=\"#6a4a10\" stroke-width=\".7\"/><rect x=\"36\" y=\"163.5\" width=\"7\" height=\"3.6\" rx=\"1.6\" fill=\"#fff0b0\"/><rect x=\"48\" y=\"163.5\" width=\"7\" height=\"12\" rx=\"1.6\" fill=\"#d9a43a\" stroke=\"#6a4a10\" stroke-width=\".7\"/><rect x=\"48\" y=\"163.5\" width=\"7\" height=\"3.6\" rx=\"1.6\" fill=\"#fff0b0\"/><rect x=\"60\" y=\"163.5\" width=\"7\" height=\"12\" rx=\"1.6\" fill=\"#d9a43a\" stroke=\"#6a4a10\" stroke-width=\".7\"/><rect x=\"60\" y=\"163.5\" width=\"7\" height=\"3.6\" rx=\"1.6\" fill=\"#fff0b0\"/><rect x=\"72\" y=\"163.5\" width=\"7\" height=\"12\" rx=\"1.6\" fill=\"#d9a43a\" stroke=\"#6a4a10\" stroke-width=\".7\"/><rect x=\"72\" y=\"163.5\" width=\"7\" height=\"3.6\" rx=\"1.6\" fill=\"#fff0b0\"/><rect x=\"84\" y=\"163.5\" width=\"7\" height=\"12\" rx=\"1.6\" fill=\"#d9a43a\" stroke=\"#6a4a10\" stroke-width=\".7\"/><rect x=\"84\" y=\"163.5\" width=\"7\" height=\"3.6\" rx=\"1.6\" fill=\"#fff0b0\"/><rect x=\"96\" y=\"163.5\" width=\"7\" height=\"12\" rx=\"1.6\" fill=\"#d9a43a\" stroke=\"#6a4a10\" stroke-width=\".7\"/><rect x=\"96\" y=\"163.5\" width=\"7\" height=\"3.6\" rx=\"1.6\" fill=\"#fff0b0\"/><rect x=\"108\" y=\"163.5\" width=\"7\" height=\"12\" rx=\"1.6\" fill=\"#d9a43a\" stroke=\"#6a4a10\" stroke-width=\".7\"/><rect x=\"108\" y=\"163.5\" width=\"7\" height=\"3.6\" rx=\"1.6\" fill=\"#fff0b0\"/><rect x=\"120\" y=\"163.5\" width=\"7\" height=\"12\" rx=\"1.6\" fill=\"#d9a43a\" stroke=\"#6a4a10\" stroke-width=\".7\"/><rect x=\"120\" y=\"163.5\" width=\"7\" height=\"3.6\" rx=\"1.6\" fill=\"#fff0b0\"/><rect x=\"132\" y=\"163.5\" width=\"7\" height=\"12\" rx=\"1.6\" fill=\"#d9a43a\" stroke=\"#6a4a10\" stroke-width=\".7\"/><rect x=\"132\" y=\"163.5\" width=\"7\" height=\"3.6\" rx=\"1.6\" fill=\"#fff0b0\"/><rect x=\"144\" y=\"163.5\" width=\"7\" height=\"12\" rx=\"1.6\" fill=\"#d9a43a\" stroke=\"#6a4a10\" stroke-width=\".7\"/><rect x=\"144\" y=\"163.5\" width=\"7\" height=\"3.6\" rx=\"1.6\" fill=\"#fff0b0\"/><rect x=\"156\" y=\"163.5\" width=\"7\" height=\"12\" rx=\"1.6\" fill=\"#d9a43a\" stroke=\"#6a4a10\" stroke-width=\".7\"/><rect x=\"156\" y=\"163.5\" width=\"7\" height=\"3.6\" rx=\"1.6\" fill=\"#fff0b0\"/></g>\n<!-- pauldrons -->\n<g><ellipse cx=\"38\" cy=\"152\" rx=\"28\" ry=\"15\" fill=\"url(#eb_metal)\" stroke=\"#12161c\" stroke-width=\"1.6\"/><path d=\"M12 150 Q38 142 64 150\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.2\" opacity=\".5\"/><path d=\"M14 158 Q38 164 62 158\" fill=\"none\" stroke=\"#12161c\" stroke-width=\"1\"/><circle cx=\"20\" cy=\"154\" r=\"1.8\" fill=\"#e8d8a8\" stroke=\"#4a3a1a\" stroke-width=\".6\"/><circle cx=\"32\" cy=\"150\" r=\"1.8\" fill=\"#e8d8a8\" stroke=\"#4a3a1a\" stroke-width=\".6\"/><circle cx=\"44\" cy=\"150\" r=\"1.8\" fill=\"#e8d8a8\" stroke=\"#4a3a1a\" stroke-width=\".6\"/><circle cx=\"56\" cy=\"154\" r=\"1.8\" fill=\"#e8d8a8\" stroke=\"#4a3a1a\" stroke-width=\".6\"/><path d=\"M44 146 l-8 6\" stroke=\"#5a6270\" stroke-width=\"1\"/></g><g><ellipse cx=\"162\" cy=\"152\" rx=\"28\" ry=\"15\" fill=\"url(#eb_metal)\" stroke=\"#12161c\" stroke-width=\"1.6\"/><path d=\"M136 150 Q162 142 188 150\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.2\" opacity=\".5\"/><path d=\"M138 158 Q162 164 186 158\" fill=\"none\" stroke=\"#12161c\" stroke-width=\"1\"/><circle cx=\"144\" cy=\"154\" r=\"1.8\" fill=\"#e8d8a8\" stroke=\"#4a3a1a\" stroke-width=\".6\"/><circle cx=\"156\" cy=\"150\" r=\"1.8\" fill=\"#e8d8a8\" stroke=\"#4a3a1a\" stroke-width=\".6\"/><circle cx=\"168\" cy=\"150\" r=\"1.8\" fill=\"#e8d8a8\" stroke=\"#4a3a1a\" stroke-width=\".6\"/><circle cx=\"180\" cy=\"154\" r=\"1.8\" fill=\"#e8d8a8\" stroke=\"#4a3a1a\" stroke-width=\".6\"/><path d=\"M156 146 l8 6\" stroke=\"#5a6270\" stroke-width=\"1\"/></g>\n<!-- the bowcaster, held across the body -->\n<g transform=\"rotate(-26 100 168)\">\n  <path d=\"M-6 166 L40 162 L52 172 L-6 178Z\" fill=\"url(#eb_wood)\" stroke=\"#1a0e04\" stroke-width=\"1.4\"/>\n  <path d=\"M2 168 L36 165\" stroke=\"#c88a50\" stroke-width=\"1\" opacity=\".6\"/>\n  <rect x=\"38\" y=\"160\" width=\"132\" height=\"14\" rx=\"3\" fill=\"url(#eb_wood)\" stroke=\"#1a0e04\" stroke-width=\"1.4\"/>\n  <rect x=\"80\" y=\"156\" width=\"96\" height=\"8\" rx=\"2\" fill=\"url(#eb_metal)\" stroke=\"#12161c\" stroke-width=\"1\"/>\n  <rect x=\"90\" y=\"157\" width=\"3\" height=\"6\" fill=\"#2a3038\"/><rect x=\"104\" y=\"157\" width=\"3\" height=\"6\" fill=\"#2a3038\"/><rect x=\"118\" y=\"157\" width=\"3\" height=\"6\" fill=\"#2a3038\"/><rect x=\"132\" y=\"157\" width=\"3\" height=\"6\" fill=\"#2a3038\"/><rect x=\"146\" y=\"157\" width=\"3\" height=\"6\" fill=\"#2a3038\"/><rect x=\"160\" y=\"157\" width=\"3\" height=\"6\" fill=\"#2a3038\"/>\n  <rect x=\"96\" y=\"146\" width=\"34\" height=\"9\" rx=\"3\" fill=\"#2a3038\" stroke=\"#12161c\" stroke-width=\"1\"/><circle cx=\"130\" cy=\"150.5\" r=\"5\" fill=\"#7ad8ff\" stroke=\"#12161c\" stroke-width=\"1\"/><circle cx=\"128.6\" cy=\"149\" r=\"1.6\" fill=\"#fff\"/>\n  <rect x=\"60\" y=\"173\" width=\"14\" height=\"22\" rx=\"3\" fill=\"#3a2414\" stroke=\"#1a0e04\" stroke-width=\"1.2\"/>\n  <rect x=\"104\" y=\"173\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#4a5a2a\" stroke=\"#1a0e04\"/><rect x=\"108\" y=\"175\" width=\"12\" height=\"6\" rx=\"1\" fill=\"#9aff7a\" opacity=\".85\"/>\n  <path d=\"M168 132 Q196 166 168 200\" fill=\"none\" stroke=\"#12161c\" stroke-width=\"9\" stroke-linecap=\"round\"/>\n  <path d=\"M168 132 Q196 166 168 200\" fill=\"none\" stroke=\"url(#eb_metal)\" stroke-width=\"6\" stroke-linecap=\"round\"/>\n  <path d=\"M168 134 L176 166 L168 198\" fill=\"none\" stroke=\"#e8ecf2\" stroke-width=\"1\"/>\n  <rect x=\"164\" y=\"154\" width=\"12\" height=\"24\" rx=\"3\" fill=\"#2a3038\" stroke=\"#12161c\" stroke-width=\"1\"/>\n  <rect x=\"176\" y=\"163\" width=\"28\" height=\"7\" rx=\"3\" fill=\"#ff8a3a\"/><rect x=\"198\" y=\"164.5\" width=\"10\" height=\"4\" rx=\"2\" fill=\"#fff4c0\"/>\n  <ellipse cx=\"200\" cy=\"166.5\" rx=\"12\" ry=\"7\" fill=\"#ffb060\" opacity=\".35\"/>\n</g>\n<!-- glove on the grip -->\n<ellipse cx=\"148\" cy=\"148\" rx=\"10\" ry=\"8\" fill=\"#3a2a1c\" stroke=\"#120a04\" stroke-width=\"1.2\"/><path d=\"M141 146 h14 M141 150 h14\" stroke=\"#120a04\" stroke-width=\".8\"/>\n<!-- head in shadow, scarf wraps over the face -->\n<ellipse cx=\"100\" cy=\"112\" rx=\"34\" ry=\"34\" fill=\"#0c0a0a\"/>\n<path d=\"M66 116 Q100 104 134 116 L138 146 Q100 162 62 146Z\" fill=\"url(#eb_scarf)\" stroke=\"#1a2008\" stroke-width=\"1.6\"/>\n<path d=\"M68 124 Q100 116 132 124 M66 134 Q100 128 134 134 M68 143 Q100 138 132 143\" fill=\"none\" stroke=\"#2a3412\" stroke-width=\"1.6\"/>\n<path d=\"M126 130 Q160 148 152 192 L140 184 L134 192 Q140 160 124 146Z\" fill=\"url(#eb_scarf)\" stroke=\"#1a2008\" stroke-width=\"1.4\"/><path d=\"M134 150 Q146 164 144 182\" stroke=\"#2a3412\" stroke-width=\"1.2\" fill=\"none\"/>\n<!-- glowing eyes -->\n<ellipse cx=\"86\" cy=\"108\" rx=\"22\" ry=\"13\" fill=\"url(#eb_eye)\" opacity=\".85\"/><ellipse cx=\"114\" cy=\"108\" rx=\"22\" ry=\"13\" fill=\"url(#eb_eye)\" opacity=\".85\"/><ellipse cx=\"100\" cy=\"108\" rx=\"34\" ry=\"12\" fill=\"#ffb020\" opacity=\".18\"/>\n<path d=\"M76 109 Q86 101 96 109 Q86 113 76 109Z\" fill=\"#fff4b0\" stroke=\"#ffd040\" stroke-width=\".8\"/><path d=\"M104 109 Q114 101 124 109 Q114 113 104 109Z\" fill=\"#fff4b0\" stroke=\"#ffd040\" stroke-width=\".8\"/>\n<rect x=\"85\" y=\"104.5\" width=\"2.6\" height=\"8\" rx=\"1.3\" fill=\"#2a1500\"/><rect x=\"113\" y=\"104.5\" width=\"2.6\" height=\"8\" rx=\"1.3\" fill=\"#2a1500\"/>\n<!-- the shield-hat: wide, flat, with a raised point -->\n<g transform=\"translate(0 -9)\">\n<ellipse cx=\"100\" cy=\"94\" rx=\"99\" ry=\"15\" fill=\"url(#eb_brim)\"/>\n<path d=\"M1 92 Q100 62 100 56 Q100 62 199 92 Q100 106 1 92Z\" fill=\"url(#eb_hat)\" stroke=\"#12161c\" stroke-width=\"1.8\"/>\n<path d=\"M100 56 Q100 62 199 92 Q180 95 160 96 Q120 72 100 60Z\" fill=\"#000\" opacity=\".12\"/>\n<path d=\"M12 92 Q100 70 188 92\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1\" opacity=\".35\"/>\n<path d=\"M30 92 Q100 76 170 92\" fill=\"none\" stroke=\"#12161c\" stroke-width=\".8\" opacity=\".5\"/>\n<path d=\"M1 92 Q100 106 199 92 Q100 112 1 92Z\" fill=\"#2b323c\" stroke=\"#12161c\" stroke-width=\"1.4\"/>\n<path d=\"M6 94 Q100 108 194 94\" fill=\"none\" stroke=\"#d9a43a\" stroke-width=\"1.6\" stroke-dasharray=\"1 7\" stroke-linecap=\"round\"/>\n<g stroke=\"#5a6270\" stroke-width=\".8\" opacity=\".6\"><path d=\"M100 58 L60 90 M100 58 L140 90 M100 58 L82 98 M100 58 L118 98\"/></g>\n<path d=\"M60 86 l8 -3 M136 84 l7 3\" stroke=\"#d6dde6\" stroke-width=\".8\" opacity=\".6\"/>\n<path d=\"M97 56 L100 40 L103 56Z\" fill=\"url(#eb_metal)\" stroke=\"#12161c\" stroke-width=\"1\"/><circle cx=\"100\" cy=\"40\" r=\"2.6\" fill=\"#d9a43a\" stroke=\"#6a4a10\" stroke-width=\".6\"/></g>";
  const ART25_MARROK = "<defs>\n  <linearGradient id=\"mr_sky\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#0a0e20\"/><stop offset=\".55\" stop-color=\"#2a2048\"/><stop offset=\"1\" stop-color=\"#6a3a3a\"/></linearGradient>\n  <radialGradient id=\"mr_moon\"><stop offset=\"0\" stop-color=\"#f6efe0\"/><stop offset=\".7\" stop-color=\"#d8ccb4\"/><stop offset=\"1\" stop-color=\"#b0a48c\"/></radialGradient>\n  <radialGradient id=\"mr_halo\"><stop offset=\"0\" stop-color=\"#bfd8ff\" stop-opacity=\".35\"/><stop offset=\"1\" stop-color=\"#bfd8ff\" stop-opacity=\"0\"/></radialGradient>\n  <linearGradient id=\"mr_rock\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#5a3a40\"/><stop offset=\"1\" stop-color=\"#22141c\"/></linearGradient>\n  <linearGradient id=\"mr_fur\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#c8ae84\"/><stop offset=\".55\" stop-color=\"#8e7454\"/><stop offset=\"1\" stop-color=\"#4a3826\"/></linearGradient>\n  <linearGradient id=\"mr_back\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#a68a64\"/><stop offset=\"1\" stop-color=\"#5a4430\"/></linearGradient>\n  <linearGradient id=\"mr_dark\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#5a4632\"/><stop offset=\"1\" stop-color=\"#20160c\"/></linearGradient>\n  <linearGradient id=\"mr_belly\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#e0cca4\"/><stop offset=\"1\" stop-color=\"#a08460\"/></linearGradient>\n  <linearGradient id=\"mr_leather\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#7a5232\"/><stop offset=\"1\" stop-color=\"#2e1a0c\"/></linearGradient>\n  <radialGradient id=\"mr_eye\" cx=\".45\" cy=\".4\"><stop offset=\"0\" stop-color=\"#fffbd0\"/><stop offset=\".45\" stop-color=\"#ffc030\"/><stop offset=\"1\" stop-color=\"#c86a00\"/></radialGradient>\n  <radialGradient id=\"mr_eyeg\"><stop offset=\"0\" stop-color=\"#ffb020\" stop-opacity=\".7\"/><stop offset=\"1\" stop-color=\"#ffb020\" stop-opacity=\"0\"/></radialGradient>\n  <radialGradient id=\"mr_win\"><stop offset=\"0\" stop-color=\"#ffd890\"/><stop offset=\"1\" stop-color=\"#ff8a30\" stop-opacity=\"0\"/></radialGradient>\n</defs>\n<rect width=\"200\" height=\"200\" fill=\"url(#mr_sky)\"/>\n<g fill=\"#fff\"><circle cx=\"7\" cy=\"3\" r=\"1.1\" opacity=\"0.4\"/><circle cx=\"68\" cy=\"40\" r=\"0.6\" opacity=\"0.6000000000000001\"/><circle cx=\"129\" cy=\"77\" r=\"0.6\" opacity=\"0.8\"/><circle cx=\"190\" cy=\"24\" r=\"0.6\" opacity=\"0.4\"/><circle cx=\"51\" cy=\"61\" r=\"0.6\" opacity=\"0.6000000000000001\"/><circle cx=\"112\" cy=\"8\" r=\"0.6\" opacity=\"0.8\"/><circle cx=\"173\" cy=\"45\" r=\"1.1\" opacity=\"0.4\"/><circle cx=\"34\" cy=\"82\" r=\"0.6\" opacity=\"0.6000000000000001\"/><circle cx=\"95\" cy=\"29\" r=\"0.6\" opacity=\"0.8\"/><circle cx=\"156\" cy=\"66\" r=\"0.6\" opacity=\"0.4\"/><circle cx=\"17\" cy=\"13\" r=\"0.6\" opacity=\"0.6000000000000001\"/><circle cx=\"78\" cy=\"50\" r=\"0.6\" opacity=\"0.8\"/><circle cx=\"139\" cy=\"87\" r=\"1.1\" opacity=\"0.4\"/><circle cx=\"0\" cy=\"34\" r=\"0.6\" opacity=\"0.6000000000000001\"/><circle cx=\"61\" cy=\"71\" r=\"0.6\" opacity=\"0.8\"/><circle cx=\"122\" cy=\"18\" r=\"0.6\" opacity=\"0.4\"/><circle cx=\"183\" cy=\"55\" r=\"0.6\" opacity=\"0.6000000000000001\"/><circle cx=\"44\" cy=\"2\" r=\"0.6\" opacity=\"0.8\"/><circle cx=\"105\" cy=\"39\" r=\"1.1\" opacity=\"0.4\"/><circle cx=\"166\" cy=\"76\" r=\"0.6\" opacity=\"0.6000000000000001\"/><circle cx=\"27\" cy=\"23\" r=\"0.6\" opacity=\"0.8\"/><circle cx=\"88\" cy=\"60\" r=\"0.6\" opacity=\"0.4\"/><circle cx=\"149\" cy=\"7\" r=\"0.6\" opacity=\"0.6000000000000001\"/><circle cx=\"10\" cy=\"44\" r=\"0.6\" opacity=\"0.8\"/><circle cx=\"71\" cy=\"81\" r=\"1.1\" opacity=\"0.4\"/><circle cx=\"132\" cy=\"28\" r=\"0.6\" opacity=\"0.6000000000000001\"/><circle cx=\"193\" cy=\"65\" r=\"0.6\" opacity=\"0.8\"/><circle cx=\"54\" cy=\"12\" r=\"0.6\" opacity=\"0.4\"/><circle cx=\"115\" cy=\"49\" r=\"0.6\" opacity=\"0.6000000000000001\"/><circle cx=\"176\" cy=\"86\" r=\"0.6\" opacity=\"0.8\"/><circle cx=\"37\" cy=\"33\" r=\"1.1\" opacity=\"0.4\"/><circle cx=\"98\" cy=\"70\" r=\"0.6\" opacity=\"0.6000000000000001\"/><circle cx=\"159\" cy=\"17\" r=\"0.6\" opacity=\"0.8\"/><circle cx=\"20\" cy=\"54\" r=\"0.6\" opacity=\"0.4\"/></g>\n<circle cx=\"150\" cy=\"40\" r=\"36\" fill=\"url(#mr_halo)\"/><circle cx=\"150\" cy=\"40\" r=\"17\" fill=\"url(#mr_moon)\"/><circle cx=\"145\" cy=\"35\" r=\"3\" fill=\"#c8bca4\" opacity=\".7\"/><circle cx=\"155\" cy=\"45\" r=\"2\" fill=\"#c8bca4\" opacity=\".7\"/>\n<circle cx=\"176\" cy=\"22\" r=\"5\" fill=\"#e8dcc8\" opacity=\".8\"/>\n<!-- far mesas and a lit outpost -->\n<path d=\"M0 102 L12 92 L22 96 L30 84 L46 86 L52 98 L70 94 L84 100 L100 90 L118 96 L132 88 L150 94 L168 86 L186 92 L200 88 V130 H0Z\" fill=\"#3a2440\" opacity=\".85\"/>\n<g transform=\"translate(118 98)\"><path d=\"M0 12 Q0 0 14 0 Q28 0 28 12Z\" fill=\"#4a3040\"/><rect x=\"-6\" y=\"10\" width=\"40\" height=\"8\" fill=\"#3a2434\"/><circle cx=\"8\" cy=\"8\" r=\"2\" fill=\"#ffd890\"/><circle cx=\"20\" cy=\"8\" r=\"2\" fill=\"#ffd890\"/><circle cx=\"14\" cy=\"12\" r=\"10\" fill=\"url(#mr_win)\" opacity=\".35\"/><rect x=\"30\" y=\"-6\" width=\"2\" height=\"16\" fill=\"#3a2434\"/><circle cx=\"31\" cy=\"-7\" r=\"1.4\" fill=\"#ff5a4a\"/></g>\n<!-- rock arch and near cliffs -->\n<path d=\"M0 118 Q20 100 40 112 L44 140 H0Z\" fill=\"url(#mr_rock)\"/><path d=\"M150 140 L160 108 Q176 96 200 104 V140Z\" fill=\"url(#mr_rock)\"/>\n<path d=\"M0 130 Q60 118 120 128 T200 124 V200 H0Z\" fill=\"#3a2230\"/><path d=\"M0 150 Q70 140 140 150 T200 148 V200 H0Z\" fill=\"#2a1822\"/>\n<g fill=\"#5a3a40\" opacity=\".7\"><ellipse cx=\"30\" cy=\"172\" rx=\"10\" ry=\"3\"/><ellipse cx=\"170\" cy=\"186\" rx=\"14\" ry=\"4\"/><ellipse cx=\"120\" cy=\"190\" rx=\"6\" ry=\"2\"/></g>\n<!-- Embo's silhouette on the ridge -->\n<g transform=\"translate(176 92)\" opacity=\".9\"><path d=\"M-9 0 Q0 -6 9 0 Q0 2 -9 0Z\" fill=\"#1a1020\"/><rect x=\"-2.6\" y=\"0\" width=\"5.2\" height=\"11\" fill=\"#1a1020\"/><path d=\"M-4 11 L-3 18 M3 11 L4 18\" stroke=\"#1a1020\" stroke-width=\"2\"/></g>\n<ellipse cx=\"110\" cy=\"182\" rx=\"74\" ry=\"8\" fill=\"#000\" opacity=\".45\"/>\n<!-- tail, high and bushy, at the back -->\n<path d=\"M178 104 Q196 84 188 62 Q186 74 176 82 Q172 92 166 100Z\" fill=\"url(#mr_dark)\" stroke=\"#16100a\" stroke-width=\"1.4\"/>\n<!-- far hind leg -->\n<path d=\"M164 118 L172 146 L168 166 L178 168 L180 146 L174 116Z\" fill=\"#4a3826\" stroke=\"#16100a\" stroke-width=\"1.2\"/>\n<!-- body going back -->\n<path d=\"M84 104 Q104 84 140 88 Q170 90 178 104 Q184 118 172 128 Q150 136 120 134 Q98 134 86 124Z\" fill=\"url(#mr_back)\" stroke=\"#16100a\" stroke-width=\"2\"/>\n<path d=\"M98 124 Q130 136 168 124\" fill=\"none\" stroke=\"url(#mr_belly)\" stroke-width=\"5\" opacity=\".7\"/>\n<g stroke=\"#3a2a18\" stroke-width=\"2.4\" stroke-linecap=\"round\" opacity=\".85\"><path d=\"M110 92 l5 14 M124 89 l5 15 M138 89 l4 14 M152 92 l3 13 M164 96 l2 12\"/></g>\n<path d=\"M96 96 Q130 80 172 98\" fill=\"none\" stroke=\"#2a1c10\" stroke-width=\"3\" opacity=\".75\"/>\n<!-- near hind leg and haunch -->\n<path d=\"M150 112 Q172 110 174 128 L164 150 L170 170 L156 172 L156 150 L146 130Z\" fill=\"url(#mr_fur)\" stroke=\"#16100a\" stroke-width=\"1.6\"/>\n<g stroke=\"#16100a\" stroke-width=\"1.6\" stroke-linecap=\"round\"><path d=\"M158 172 v3 M163 172 v3 M168 172 v3\"/></g>\n<!-- harness strap around the body -->\n<path d=\"M118 88 Q112 112 122 134\" fill=\"none\" stroke=\"url(#mr_leather)\" stroke-width=\"8\"/><circle cx=\"117\" cy=\"94\" r=\"2\" fill=\"#d8dee8\" stroke=\"#2a2f38\" stroke-width=\".7\"/><circle cx=\"116\" cy=\"106\" r=\"2\" fill=\"#d8dee8\" stroke=\"#2a2f38\" stroke-width=\".7\"/><circle cx=\"117\" cy=\"118\" r=\"2\" fill=\"#d8dee8\" stroke=\"#2a2f38\" stroke-width=\".7\"/><circle cx=\"117\" cy=\"128\" r=\"2\" fill=\"#d8dee8\" stroke=\"#2a2f38\" stroke-width=\".7\"/>\n<!-- far front leg -->\n<path d=\"M92 128 L96 160 L92 176 L104 178 L106 158 L102 126Z\" fill=\"#5a4630\" stroke=\"#16100a\" stroke-width=\"1.4\"/>\n<!-- neck and chest mane -->\n<path d=\"M56 96 Q66 70 92 76 Q108 82 108 104 Q104 126 86 134 Q66 134 58 118Z\" fill=\"url(#mr_fur)\" stroke=\"#16100a\" stroke-width=\"2\"/>\n<path d=\"M62 112 l-4 8 l7 -2 l-1 8 l7 -5 l2 7 l5 -7 l4 6 l3 -8\" fill=\"url(#mr_belly)\" stroke=\"#16100a\" stroke-width=\"1\"/>\n<path d=\"M80 74 l6 -6 l2 8 l6 -5 l1 8 l6 -3 l-2 8\" fill=\"url(#mr_dark)\" stroke=\"#16100a\" stroke-width=\"1\"/>\n<!-- near front leg, big and close -->\n<path d=\"M64 124 Q60 150 66 168 L56 180 L82 182 L82 166 Q84 146 82 124Z\" fill=\"url(#mr_fur)\" stroke=\"#16100a\" stroke-width=\"1.8\"/>\n<path d=\"M68 140 l4 10 M76 136 l-2 12\" stroke=\"#3a2a18\" stroke-width=\"1.6\" stroke-linecap=\"round\" opacity=\".7\"/>\n<path d=\"M58 180 l-1 5\" stroke=\"#1a1208\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><path d=\"M56.8 184 l-.3 2.4\" stroke=\"#e8e0c8\" stroke-width=\".8\"/><path d=\"M65 180 l-1 5\" stroke=\"#1a1208\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><path d=\"M63.8 184 l-.3 2.4\" stroke=\"#e8e0c8\" stroke-width=\".8\"/><path d=\"M72 180 l-1 5\" stroke=\"#1a1208\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><path d=\"M70.8 184 l-.3 2.4\" stroke=\"#e8e0c8\" stroke-width=\".8\"/><path d=\"M79 180 l-1 5\" stroke=\"#1a1208\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><path d=\"M77.8 184 l-.3 2.4\" stroke=\"#e8e0c8\" stroke-width=\".8\"/>\n<!-- collar, studs and the red scarf -->\n<path d=\"M58 100 Q80 114 104 102 L106 112 Q80 126 56 110Z\" fill=\"url(#mr_leather)\" stroke=\"#120a04\" stroke-width=\"1.3\"/>\n<circle cx=\"62\" cy=\"107\" r=\"2\" fill=\"#d8dee8\" stroke=\"#2a2f38\" stroke-width=\".7\"/><circle cx=\"70\" cy=\"110.52671151375483\" r=\"2\" fill=\"#d8dee8\" stroke=\"#2a2f38\" stroke-width=\".7\"/><circle cx=\"78\" cy=\"112.70633909777092\" r=\"2\" fill=\"#d8dee8\" stroke=\"#2a2f38\" stroke-width=\".7\"/><circle cx=\"86\" cy=\"112.70633909777092\" r=\"2\" fill=\"#d8dee8\" stroke=\"#2a2f38\" stroke-width=\".7\"/><circle cx=\"94\" cy=\"110.52671151375483\" r=\"2\" fill=\"#d8dee8\" stroke=\"#2a2f38\" stroke-width=\".7\"/><circle cx=\"101\" cy=\"107\" r=\"2\" fill=\"#d8dee8\" stroke=\"#2a2f38\" stroke-width=\".7\"/>\n<path d=\"M72 112 Q84 120 90 132 Q80 136 72 128Z\" fill=\"#a8301e\" stroke=\"#4a0e06\" stroke-width=\"1.1\"/><path d=\"M86 128 Q96 140 92 152 L86 146 L82 152 Q84 140 86 128Z\" fill=\"#8a2416\" stroke=\"#4a0e06\" stroke-width=\"1\"/><circle cx=\"80\" cy=\"118\" r=\"3\" fill=\"#d9a43a\" stroke=\"#6a4a10\" stroke-width=\".6\"/>\n<!-- head: long canine snout pointing at you, turned slightly -->\n<path d=\"M44 46 L40 10 Q54 24 64 46Z\" fill=\"url(#mr_dark)\" stroke=\"#16100a\" stroke-width=\"1.6\"/><path d=\"M46 42 L44 20 Q52 30 58 44Z\" fill=\"#7a4a3a\"/>\n<path d=\"M78 46 L90 12 Q94 32 88 52Z\" fill=\"url(#mr_dark)\" stroke=\"#16100a\" stroke-width=\"1.6\"/><path d=\"M80 46 L88 22 Q90 36 86 50Z\" fill=\"#7a4a3a\"/>\n<path d=\"M36 64 Q38 40 64 38 Q90 40 94 62 Q96 76 86 86 L74 94 L48 94 L38 84 Q34 74 36 64Z\" fill=\"url(#mr_fur)\" stroke=\"#16100a\" stroke-width=\"2\"/>\n<g stroke=\"#3a2a18\" stroke-width=\"2.2\" stroke-linecap=\"round\" opacity=\".85\"><path d=\"M64 42 v10 M56 43 l2 9 M72 43 l-2 9\"/><path d=\"M40 66 l8 3 M88 66 l-8 3\"/></g>\n<path d=\"M44 60 Q52 54 60 60 M84 60 Q76 54 68 60\" fill=\"none\" stroke=\"#2a1c10\" stroke-width=\"2.6\" stroke-linecap=\"round\"/>\n<ellipse cx=\"52\" cy=\"66\" rx=\"11\" ry=\"8\" fill=\"url(#mr_eyeg)\"/><ellipse cx=\"76\" cy=\"66\" rx=\"11\" ry=\"8\" fill=\"url(#mr_eyeg)\"/>\n<path d=\"M45 67 Q52 60 59 66 Q52 71 45 67Z\" fill=\"url(#mr_eye)\" stroke=\"#1a0e00\" stroke-width=\"1\"/><path d=\"M83 67 Q76 60 69 66 Q76 71 83 67Z\" fill=\"url(#mr_eye)\" stroke=\"#1a0e00\" stroke-width=\"1\"/>\n<rect x=\"51\" y=\"62\" width=\"2\" height=\"8\" rx=\"1\" fill=\"#1a0e00\"/><rect x=\"75\" y=\"62\" width=\"2\" height=\"8\" rx=\"1\" fill=\"#1a0e00\"/><circle cx=\"50.4\" cy=\"63.4\" r=\".9\" fill=\"#fff\"/><circle cx=\"74.4\" cy=\"63.4\" r=\".9\" fill=\"#fff\"/>\n<path d=\"M52 72 Q64 68 76 72 L74 96 Q64 104 54 96Z\" fill=\"url(#mr_belly)\" stroke=\"#16100a\" stroke-width=\"1.6\"/>\n<path d=\"M58 76 Q64 74 70 76 L68 90 Q64 92 60 90Z\" fill=\"#a08460\" opacity=\".55\"/>\n<path d=\"M56 92 Q64 86 72 92 Q72 99 64 99 Q56 99 56 92Z\" fill=\"#0e0a08\"/><ellipse cx=\"61\" cy=\"92\" rx=\"1.6\" ry=\"1\" fill=\"#3a3030\"/><ellipse cx=\"67\" cy=\"92\" rx=\"1.6\" ry=\"1\" fill=\"#3a3030\"/><path d=\"M60 90 Q64 88 67 90\" stroke=\"#fff\" stroke-width=\".7\" opacity=\".5\" fill=\"none\"/>\n<path d=\"M50 96 Q64 112 78 96 Q76 108 64 110 Q52 108 50 96Z\" fill=\"#3a0e0a\" stroke=\"#16100a\" stroke-width=\"1.1\"/>\n<path d=\"M53 98 l2 6 l2 -5 M71 98 l2 5 l2 -6\" fill=\"#f4eedc\" stroke=\"#16100a\" stroke-width=\".6\"/><path d=\"M60 101 l1.2 3 l1.2 -3 M66 101 l1.2 3 l1.2 -3\" fill=\"#f4eedc\" stroke=\"#16100a\" stroke-width=\".5\"/>\n<path d=\"M58 104 Q64 108 70 104\" fill=\"#c84a5a\" opacity=\".85\"/>\n<path d=\"M40 50 Q64 34 92 52\" fill=\"none\" stroke=\"#bfd8ff\" stroke-width=\"1.2\" opacity=\".35\"/>";
  const ART25_HAVOC = "<defs>\n  <radialGradient id=\"hp_neb\" cx=\".72\" cy=\".28\" r=\".85\"><stop offset=\"0\" stop-color=\"#4a2a64\"/><stop offset=\".5\" stop-color=\"#181232\"/><stop offset=\"1\" stop-color=\"#05040e\"/></radialGradient>\n  <radialGradient id=\"hp_planet\" cx=\".35\" cy=\".3\"><stop offset=\"0\" stop-color=\"#e8b070\"/><stop offset=\".6\" stop-color=\"#9a4a2a\"/><stop offset=\"1\" stop-color=\"#2a0e10\"/></radialGradient>\n  <linearGradient id=\"hp_top\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#d4c6f6\"/><stop offset=\".5\" stop-color=\"#7e6cac\"/><stop offset=\"1\" stop-color=\"#3c305c\"/></linearGradient>\n  <linearGradient id=\"hp_side\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4c3e72\"/><stop offset=\"1\" stop-color=\"#1a142e\"/></linearGradient>\n  <linearGradient id=\"hp_wing\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#6a5a98\"/><stop offset=\"1\" stop-color=\"#2e2448\"/></linearGradient>\n  <linearGradient id=\"hp_metal\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#c8d0dc\"/><stop offset=\".5\" stop-color=\"#727a8a\"/><stop offset=\"1\" stop-color=\"#2a2e38\"/></linearGradient>\n  <radialGradient id=\"hp_glass\" cx=\".35\" cy=\".3\"><stop offset=\"0\" stop-color=\"#eafcff\"/><stop offset=\".45\" stop-color=\"#4ab0e0\"/><stop offset=\"1\" stop-color=\"#0a2440\"/></radialGradient>\n  <radialGradient id=\"hp_fire\"><stop offset=\"0\" stop-color=\"#fff8d0\"/><stop offset=\".35\" stop-color=\"#ffa040\"/><stop offset=\"1\" stop-color=\"#ff3a10\" stop-opacity=\"0\"/></radialGradient>\n</defs>\n<rect width=\"200\" height=\"200\" fill=\"url(#hp_neb)\"/>\n<g fill=\"#fff\"><circle cx=\"11\" cy=\"5\" r=\"1.1\" opacity=\"0.35\"/><circle cx=\"84\" cy=\"136\" r=\"0.6\" opacity=\"0.5\"/><circle cx=\"157\" cy=\"67\" r=\"0.6\" opacity=\"0.6499999999999999\"/><circle cx=\"30\" cy=\"198\" r=\"0.6\" opacity=\"0.7999999999999999\"/><circle cx=\"103\" cy=\"129\" r=\"0.6\" opacity=\"0.35\"/><circle cx=\"176\" cy=\"60\" r=\"0.6\" opacity=\"0.5\"/><circle cx=\"49\" cy=\"191\" r=\"0.6\" opacity=\"0.6499999999999999\"/><circle cx=\"122\" cy=\"122\" r=\"1.1\" opacity=\"0.7999999999999999\"/><circle cx=\"195\" cy=\"53\" r=\"0.6\" opacity=\"0.35\"/><circle cx=\"68\" cy=\"184\" r=\"0.6\" opacity=\"0.5\"/><circle cx=\"141\" cy=\"115\" r=\"0.6\" opacity=\"0.6499999999999999\"/><circle cx=\"14\" cy=\"46\" r=\"0.6\" opacity=\"0.7999999999999999\"/><circle cx=\"87\" cy=\"177\" r=\"0.6\" opacity=\"0.35\"/><circle cx=\"160\" cy=\"108\" r=\"0.6\" opacity=\"0.5\"/><circle cx=\"33\" cy=\"39\" r=\"1.1\" opacity=\"0.6499999999999999\"/><circle cx=\"106\" cy=\"170\" r=\"0.6\" opacity=\"0.7999999999999999\"/><circle cx=\"179\" cy=\"101\" r=\"0.6\" opacity=\"0.35\"/><circle cx=\"52\" cy=\"32\" r=\"0.6\" opacity=\"0.5\"/><circle cx=\"125\" cy=\"163\" r=\"0.6\" opacity=\"0.6499999999999999\"/><circle cx=\"198\" cy=\"94\" r=\"0.6\" opacity=\"0.7999999999999999\"/><circle cx=\"71\" cy=\"25\" r=\"0.6\" opacity=\"0.35\"/><circle cx=\"144\" cy=\"156\" r=\"1.1\" opacity=\"0.5\"/><circle cx=\"17\" cy=\"87\" r=\"0.6\" opacity=\"0.6499999999999999\"/><circle cx=\"90\" cy=\"18\" r=\"0.6\" opacity=\"0.7999999999999999\"/><circle cx=\"163\" cy=\"149\" r=\"0.6\" opacity=\"0.35\"/><circle cx=\"36\" cy=\"80\" r=\"0.6\" opacity=\"0.5\"/><circle cx=\"109\" cy=\"11\" r=\"0.6\" opacity=\"0.6499999999999999\"/><circle cx=\"182\" cy=\"142\" r=\"0.6\" opacity=\"0.7999999999999999\"/><circle cx=\"55\" cy=\"73\" r=\"1.1\" opacity=\"0.35\"/><circle cx=\"128\" cy=\"4\" r=\"0.6\" opacity=\"0.5\"/><circle cx=\"1\" cy=\"135\" r=\"0.6\" opacity=\"0.6499999999999999\"/><circle cx=\"74\" cy=\"66\" r=\"0.6\" opacity=\"0.7999999999999999\"/><circle cx=\"147\" cy=\"197\" r=\"0.6\" opacity=\"0.35\"/><circle cx=\"20\" cy=\"128\" r=\"0.6\" opacity=\"0.5\"/><circle cx=\"93\" cy=\"59\" r=\"0.6\" opacity=\"0.6499999999999999\"/><circle cx=\"166\" cy=\"190\" r=\"1.1\" opacity=\"0.7999999999999999\"/><circle cx=\"39\" cy=\"121\" r=\"0.6\" opacity=\"0.35\"/><circle cx=\"112\" cy=\"52\" r=\"0.6\" opacity=\"0.5\"/><circle cx=\"185\" cy=\"183\" r=\"0.6\" opacity=\"0.6499999999999999\"/><circle cx=\"58\" cy=\"114\" r=\"0.6\" opacity=\"0.7999999999999999\"/><circle cx=\"131\" cy=\"45\" r=\"0.6\" opacity=\"0.35\"/><circle cx=\"4\" cy=\"176\" r=\"0.6\" opacity=\"0.5\"/><circle cx=\"77\" cy=\"107\" r=\"1.1\" opacity=\"0.6499999999999999\"/><circle cx=\"150\" cy=\"38\" r=\"0.6\" opacity=\"0.7999999999999999\"/><circle cx=\"23\" cy=\"169\" r=\"0.6\" opacity=\"0.35\"/><circle cx=\"96\" cy=\"100\" r=\"0.6\" opacity=\"0.5\"/></g>\n<circle cx=\"162\" cy=\"40\" r=\"28\" fill=\"url(#hp_planet)\"/><path d=\"M138 34 Q162 40 188 32\" fill=\"none\" stroke=\"#5a2010\" stroke-width=\"1.4\" opacity=\".5\"/>\n<!-- exhaust -->\n<ellipse cx=\"190\" cy=\"34\" rx=\"16\" ry=\"7\" fill=\"url(#hp_fire)\" transform=\"rotate(-32 190 34)\"/><ellipse cx=\"190\" cy=\"66\" rx=\"20\" ry=\"9\" fill=\"url(#hp_fire)\" transform=\"rotate(-32 190 66)\"/>\n<!-- far wing (behind the hull), with its engine mounted on it -->\n<path d=\"M110 95 L170 38 L184 44 L150 72Z\" fill=\"url(#hp_wing)\" stroke=\"#120c22\" stroke-width=\"1.4\"/>\n<path d=\"M126 82 L174 42\" stroke=\"#e8742a\" stroke-width=\"2.6\"/>\n<path d=\"M150 58 L182 38\" stroke=\"#0e1118\" stroke-width=\"14\" stroke-linecap=\"round\"/><path d=\"M150 58 L182 38\" stroke=\"url(#hp_metal)\" stroke-width=\"11\" stroke-linecap=\"round\"/><path d=\"M150 55.58 L182 35.58\" stroke=\"#e8eef6\" stroke-width=\"1.3\" stroke-linecap=\"round\" opacity=\".55\"/><ellipse cx=\"183\" cy=\"37.4\" rx=\"3.4\" ry=\"5.6\" fill=\"#ffb060\" transform=\"rotate(-32 183 37.4)\"/>\n<!-- hull: top, side and nose faces -->\n<path d=\"M28 148 L150 70 L172 84 L52 164Z\" fill=\"url(#hp_top)\" stroke=\"#140e24\" stroke-width=\"2\"/>\n<path d=\"M52 164 L172 84 L172 100 L58 178Z\" fill=\"url(#hp_side)\" stroke=\"#140e24\" stroke-width=\"2\"/>\n<path d=\"M28 148 L52 164 L58 178 L32 160Z\" fill=\"#2c2440\" stroke=\"#140e24\" stroke-width=\"1.6\"/>\n<path d=\"M40 156 L160 78\" stroke=\"#e8742a\" stroke-width=\"4\"/><path d=\"M42 159 L162 81\" stroke=\"#ffb060\" stroke-width=\"1.1\" opacity=\".7\"/>\n<path d=\"M76 126 L96 140 M108 106 L128 120 M138 86 L156 98\" stroke=\"#1a1330\" stroke-width=\"1.3\" opacity=\".8\"/>\n<path d=\"M70 160 L84 151 M96 150 L110 141 M122 133 L136 124\" stroke=\"#0e0a1e\" stroke-width=\"1.2\" opacity=\".7\"/>\n<!-- main engine, bolted along the tail -->\n<path d=\"M132 98 L180 68\" stroke=\"#0e1118\" stroke-width=\"21\" stroke-linecap=\"round\"/><path d=\"M132 98 L180 68\" stroke=\"url(#hp_metal)\" stroke-width=\"18\" stroke-linecap=\"round\"/><path d=\"M132 94.04 L180 64.04\" stroke=\"#e8eef6\" stroke-width=\"2.2\" stroke-linecap=\"round\" opacity=\".55\"/><path d=\"M144 100 L150 86 M156 92 L162 78\" stroke=\"#141820\" stroke-width=\"1.2\"/>\n<ellipse cx=\"181\" cy=\"67.4\" rx=\"5\" ry=\"9\" fill=\"#ffb060\" transform=\"rotate(-32 181 67.4)\"/><ellipse cx=\"181\" cy=\"67.4\" rx=\"2.4\" ry=\"5\" fill=\"#fff4c8\" transform=\"rotate(-32 181 67.4)\"/>\n<!-- cockpit -->\n<path d=\"M58 132 Q70 118 86 120 L92 130 Q80 142 62 142Z\" fill=\"url(#hp_glass)\" stroke=\"#0b1424\" stroke-width=\"1.6\"/><path d=\"M64 131 Q74 122 84 124\" stroke=\"#fff\" stroke-width=\"1.6\" opacity=\".7\" fill=\"none\"/>\n<!-- dorsal ball turret, sitting on the hull -->\n<ellipse cx=\"112\" cy=\"100\" rx=\"11\" ry=\"4\" fill=\"#2a2f3c\" stroke=\"#0c0f15\" stroke-width=\"1\"/><path d=\"M103 99 Q112 84 121 99Z\" fill=\"url(#hp_metal)\" stroke=\"#0c0f15\" stroke-width=\"1.3\"/><circle cx=\"109\" cy=\"92\" r=\"2.2\" fill=\"#fff\" opacity=\".45\"/>\n<path d=\"M106 93 L86 84 M107 97 L87 88\" stroke=\"#2a2f3c\" stroke-width=\"2.6\" stroke-linecap=\"round\"/>\n<!-- near wing (in front), joined along the hull's lower edge -->\n<path d=\"M96 150 L148 192 L164 186 L128 128Z\" fill=\"url(#hp_top)\" stroke=\"#140e24\" stroke-width=\"1.6\"/><path d=\"M112 154 L154 186\" stroke=\"#e8742a\" stroke-width=\"3.2\"/>\n<!-- six cannons out of the nose -->\n<path d=\"M32 152 L8 164\" stroke=\"#0c0f15\" stroke-width=\"3.4\" stroke-linecap=\"round\"/><path d=\"M32 152 L8 164\" stroke=\"#a8b0c0\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M37 156 L13 168\" stroke=\"#0c0f15\" stroke-width=\"3.4\" stroke-linecap=\"round\"/><path d=\"M37 156 L13 168\" stroke=\"#a8b0c0\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M42 160 L18 172\" stroke=\"#0c0f15\" stroke-width=\"3.4\" stroke-linecap=\"round\"/><path d=\"M42 160 L18 172\" stroke=\"#a8b0c0\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M36 162 L12 174\" stroke=\"#0c0f15\" stroke-width=\"3.4\" stroke-linecap=\"round\"/><path d=\"M36 162 L12 174\" stroke=\"#a8b0c0\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M42 166 L18 178\" stroke=\"#0c0f15\" stroke-width=\"3.4\" stroke-linecap=\"round\"/><path d=\"M42 166 L18 178\" stroke=\"#a8b0c0\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M48 170 L24 182\" stroke=\"#0c0f15\" stroke-width=\"3.4\" stroke-linecap=\"round\"/><path d=\"M48 170 L24 182\" stroke=\"#a8b0c0\" stroke-width=\"2\" stroke-linecap=\"round\"/>";
  const emboArt = () => `<g transform="scale(.5)">${ART25_EMBO}</g>`;
  const havocCard = () => `<g transform="scale(.5)">${ART25_HAVOC}</g>`;
  // Marrok: the anooba mid-stride, harness and red scarf, one amber eye on you.
  const marrokBody = (u) => `
    <path d="M74 78 Q34 76 22 40 Q20 30 26 26 Q34 58 80 64Z" fill="url(#${u}d)" stroke="#16100a" stroke-width="2"/>
    <path d="M94 108 Q84 134 96 154 L84 160 H112 L110 112Z" fill="#2e2418" stroke="#16100a" stroke-width="1.6"/>
    <path d="M176 108 L180 152 L170 160 H196 L194 112Z" fill="#2e2418" stroke="#16100a" stroke-width="1.6"/>
    <path d="M66 82 Q92 52 150 56 Q198 58 206 84 Q208 108 186 114 L100 118 Q60 112 66 82Z" fill="url(#${u}f)" stroke="#16100a" stroke-width="2.4"/>
    <g stroke="#3a2f22" stroke-width="2.2" stroke-linecap="round" opacity=".75"><path d="M92 66 l8 14 M108 62 l8 16 M126 60 l8 16 M144 60 l8 15 M162 62 l8 14"/></g>
    <path d="M100 116 Q140 126 186 114" fill="none" stroke="#c4b08c" stroke-width="3" opacity=".5"/>
    <path d="M82 104 Q64 132 80 154 L66 162 H100 L106 112Z" fill="url(#${u}f)" stroke="#16100a" stroke-width="2"/>
    <path d="M170 106 L176 154 L162 162 H198 L196 112Z" fill="url(#${u}f)" stroke="#16100a" stroke-width="2"/>
    <g stroke="#16100a" stroke-width="2" stroke-linecap="round"><path d="M70 162 v5 M80 162 v5 M90 162 v5 M166 162 v5 M176 162 v5 M186 162 v5"/></g>
    <path d="M186 66 Q204 34 228 44 L256 76 Q262 88 246 92 L220 92 Q208 106 194 104Z" fill="url(#${u}f)" stroke="#16100a" stroke-width="2.4"/>
    <path d="M228 44 L224 18 L212 38Z" fill="url(#${u}d)" stroke="#16100a" stroke-width="2"/><path d="M214 44 L206 20 L198 46Z" fill="url(#${u}d)" stroke="#16100a" stroke-width="2"/>
    <path d="M226 90 L254 80 L248 90Z" fill="#2a1a10"/><path d="M232 90 l4 7 l4 -7 M242 90 l3 6 l3 -6" fill="#fff" stroke="#16100a" stroke-width="1"/>
    <ellipse cx="252" cy="76" rx="4.5" ry="3.6" fill="#0a0806"/>
    <ellipse cx="226" cy="62" rx="11" ry="7" fill="url(#${u}e)"/><path d="M219 63 Q226 55 233 63 Q226 66 219 63Z" fill="#ffd45a"/><rect x="225" y="58" width="3" height="8" rx="1.5" fill="#1a0e00"/>
    <path d="M176 62 Q172 90 186 110" fill="none" stroke="url(#${u}l)" stroke-width="10" stroke-linecap="round"/>
    <path d="M92 70 Q96 96 104 116" fill="none" stroke="url(#${u}l)" stroke-width="9" stroke-linecap="round"/>
    <path d="M92 72 Q140 58 176 64" fill="none" stroke="url(#${u}l)" stroke-width="8"/>
    <g fill="#cfd6e0" stroke="#16100a" stroke-width=".8"><circle cx="124" cy="63" r="2.6"/><circle cx="148" cy="62" r="2.6"/><circle cx="174" cy="74" r="2.6"/><circle cx="178" cy="92" r="2.6"/><circle cx="96" cy="88" r="2.6"/></g>
    <path d="M190 70 Q214 74 218 62" fill="none" stroke="#a02a1a" stroke-width="5" stroke-linecap="round"/><circle cx="206" cy="72" r="3.4" fill="#d9a43a"/>`;
  const marrokDefs = (u) => `<linearGradient id="${u}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a89474"/><stop offset=".55" stop-color="#6e5c44"/><stop offset="1" stop-color="#3a2f22"/></linearGradient>
    <linearGradient id="${u}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4a36"/><stop offset="1" stop-color="#241c12"/></linearGradient>
    <linearGradient id="${u}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a4a2c"/><stop offset="1" stop-color="#2a1a0c"/></linearGradient>
    <radialGradient id="${u}e"><stop offset="0" stop-color="#fff2a0"/><stop offset=".6" stop-color="#ffb020"/><stop offset="1" stop-color="#ff7a00" stop-opacity="0"/></radialGradient>`;
  const marrokArt = () => `<g transform="scale(.5)">${ART25_MARROK}</g>`;
  // A loose Marrok for the battle effects (Sic 'Em, The Hunt, Savage Frenzy).
  let mkSeq = 0;
  const marrokSprite = () => { const u = `mks${++mkSeq}`; return `<svg viewBox="10 10 255 160" width="100%" height="100%" aria-hidden="true"><defs>${marrokDefs(u)}</defs>${marrokBody(u)}</svg>`; };
  const hatDisc = () => `<svg viewBox="0 0 80 80" width="100%" height="100%" aria-hidden="true"><defs><radialGradient id="hd25"><stop offset="0" stop-color="#f3f6fa"/><stop offset=".6" stop-color="#8e98a6"/><stop offset="1" stop-color="#3a424e"/></radialGradient></defs>
    <circle cx="40" cy="40" r="36" fill="url(#hd25)" stroke="#12161c" stroke-width="3"/><circle cx="40" cy="40" r="28" fill="none" stroke="#d9a43a" stroke-width="2" stroke-dasharray="2 5"/>
    <rect x="24" y="22" width="5" height="36" rx="2.5" fill="#07090c"/><rect x="37.5" y="14" width="5" height="52" rx="2.5" fill="#07090c"/><rect x="51" y="22" width="5" height="36" rx="2.5" fill="#07090c"/></svg>`;

  if (root.Art && root.Art.addArt) {
    root.Art.addArt('ship', 'havoc', havocShip);
    root.Art.addArt('char', 'embo', emboArt);
    root.Art.addArt('char', 'marrok', marrokArt);
    root.Art.addArt('char', 'havoc_card', havocCard);
  }

  // ---------- Statuses ----------
  D.STATUS_INFO.bleed = { label: 'Bleeding', icon: '🩸', kind: 'debuff', desc: 'Loses 6% max HP at the start of each turn.' };
  D.STATUS_INFO.hatShield = { label: 'Hat Shield', icon: '🛡', kind: 'buff', desc: 'Takes 70% less damage from attacks.' };

  // ---------- Cards ----------
  const dmg = (mult, hits) => ({ type: 'damage', mult, hits: hits || 1 });
  const buff = (status, turns) => ({ type: 'status', status, turns, chance: 1 });
  const debuff = (status, turns, chance) => ({ type: 'status', status, turns, chance: chance == null ? 1 : chance });
  const tm = (amount) => ({ type: 'tm', amount });
  const execute = (mult, below, bonus) => ({ type: 'damage', mult, hits: 1, execute: { below, bonus } });
  const A = (name, cd, target, effects, desc) => ({ name, cd, target, effects, desc });
  const U = (name, target, effects, desc, quote) => ({ name, cd: 0, target, effects, desc, quote, ultimate: true });
  const crates = released();
  const CARDS = [
    {
      id: 'havoc', name: 'The Havoc', kind: 'ship', faction: 'dark', rarity: 'legendary', role: 'attacker', shape: 'havoc', portrait: 'havoc_card', spd: 150, accent: '#ff8a3a', traits: ['scoundrel'],
      exclusive: !crates, v25: true, sig: { move: 'bomblet', impact: 'scorch', color: '#ff8a3a' },
      bio: "Captain Nym's modified Scurrg H-6 prototype bomber, out of the Lok pirate fleet: six forward laser cannons, an automated dorsal ball turret, and a bomblet generator that never runs dry. Passive, Auto-Turret: after every action, the turret fires a free shot at a random enemy.",
      abilities: [
        A('Cannon Burst', 0, 'enemy', [dmg(0.72, 2)], 'Two cannon shots at one enemy. Passive Auto-Turret: after every action, a free turret shot at a random enemy.'),
        A('Laser Wall', 3, 'enemy', [dmg(0.7, 3), debuff('defDown', 2, 0.5)], 'All six cannons fire: one enemy is hit 3 times, with a 50% chance of Defense Down.'),
      ],
      ultimate: U('Bomblet Storm', 'allEnemies', [dmg(0.62, 4), debuff('burn', 2, 0.5), { ...tm(-25), on: 'self' }], 'The bomb bay empties over the whole enemy line: every enemy is hit 4 times, with a 50% chance to Burn. The generator drains the Havoc\'s power: it loses 25% Turn Meter.', 'Let\'s see how they like the bomb bay.'),
    },
    {
      id: 'embo', name: 'Embo', kind: 'character', faction: 'dark', rarity: 'legendary', role: 'attacker', spd: 150, accent: '#d9a43a', traits: ['bounty'], home: 'tatooine',
      exclusive: !crates, v25: true, sig: { move: 'hunt', impact: 'slice', color: '#d9a43a' },
      bio: 'A Kyuzo bounty hunter of few words and great patience. His wide shield-hat is armour, weapon and shield at once, and his anooba Marrok is never far behind. Hunting Pair: with Marrok in the squad, Embo deals 15% more damage to any enemy Marrok has hit.',
      abilities: [
        A('Hat Throw', 0, 'enemy', [dmg(1.15)], 'Throws his shield-hat: it hits one enemy, bounces into a second for 75% damage and comes back.'),
        A('Shield Up', 3, 'self', [buff('hatShield', 2), buff('offUp', 2), { ...tm(25), on: 'self' }], 'Raises the hat as a shield: takes 70% less damage for 2 turns, gains Offense Up and 25% Turn Meter.'),
        A("Sic 'Em", 2, 'enemy', [execute(1.9, 0.5, 2)], 'Marrok leaps on one enemy for heavy damage. Double damage against an enemy under 50% health.'),
      ],
      ultimate: U('The Hunt', 'enemy', [debuff('stun', 1), dmg(0.7), dmg(0.6, 5)], 'The hat pins the target and Stuns it, then Marrok mauls it: 5 bites in a row.', 'Ka-ta-ka.'),
    },
    {
      id: 'marrok', name: 'Marrok', kind: 'character', faction: 'dark', rarity: 'epic', role: 'attacker', spd: 170, accent: '#c8743a', traits: ['bounty', 'beast'], home: 'tatooine',
      exclusive: !crates, v25: true, sig: { move: 'frenzy', impact: 'xslash', color: '#ff8a4a' },
      bio: "Embo's anooba: fast, loyal and impossible to shake off. Hunting Pair: with Embo in the squad, Marrok deals 25% more damage to any enemy Embo has hit.",
      abilities: [
        A('Pounce', 0, 'enemy', [dmg(1.1), debuff('bleed', 2, 0.75)], 'Leaps on one enemy and bites, with a 75% chance to make it Bleed for 2 turns.'),
        A('Howl', 3, 'allAllies', [buff('offUp', 2), { ...tm(15), on: 'allies' }], 'A rallying howl: all allies gain Offense Up for 2 turns and 15% Turn Meter.'),
      ],
      ultimate: U('Savage Frenzy', 'enemy', [dmg(0.6), debuff('bleed', 2, 1)], 'Four rapid leaps across the enemy line, each harder than the last; the first target Bleeds.', '*snarl*'),
    },
  ];
  for (const c of CARDS) {
    c.abilities = [...c.abilities, c.ultimate];
    if (!D.UNIT_MAP[c.id]) { D.UNIT_MAP[c.id] = c; D.UNITS.push(c); }
    if (D.BIOS) D.BIOS[c.id] = c.bio;
    if (D.TRAITS && !D.TRAITS[c.id]) D.TRAITS[c.id] = c.traits;
  }
  // The rest of the game reads the ultimate from .ultimate; abilities stays the two/three moves.
  for (const c of CARDS) c.abilities = c.abilities.filter((a) => !a.ultimate);

  // Testers get all three the moment the code goes in.
  try { if (localStorage.getItem('swcg-v25-grant') === '1') { localStorage.removeItem('swcg-v25-grant'); setTimeout(grantAll, 400); } } catch (e) { /* storage blocked */ }
  root.Update25.grant = grantAll;

  // ---------- Frame counters ----------
  // Wins with an all-ship, all Light Side or all Dark Side squad (for the Kessel Runner, Jedi Order and Sith Lord frames).
  if (H && H.battleEnd && !H.__c25) {
    H.__c25 = true;
    H.battleEnd.push((battle, params, won) => {
      if (!won || !battle || !battle.units) return;
      const mine = battle.units.filter((u) => u.side === 'player');
      if (!mine.length) return;
      const c = Player.state.c25 || (Player.state.c25 = { fleet: 0, light: 0, dark: 0 });
      if (mine.every((u) => u.def.kind === 'ship')) c.fleet += 1;
      if (mine.every((u) => u.def.faction === 'light')) c.light += 1;
      if (mine.every((u) => u.def.faction === 'dark')) c.dark += 1;
      Player.save();
    });
  }

  // ---------- Battle mechanics ----------
  const BP = root.Battle.prototype;
  if (!BP.__c25) {
    BP.__c25 = true;
    const alive = (b, side) => b.units.filter((u) => u.alive && u.side === side);
    const foes = (b, u) => alive(b, u.side === 'player' ? 'enemy' : 'player');
    const pickRnd = (b, list) => list[Math.floor(b.rng() * list.length)];
    const strike = (b, src, tgt, mult, events, mark) => {
      if (!tgt || !tgt.alive) return;
      const { amount, crit } = b.rollDamage(src, tgt, mult);
      b.applyDamage(tgt, amount, crit, events);
      if (mark) tgt[mark] = true;
    };
    // Hunting Pair: each one hits harder on the enemies the other has already hit.
    const baseRoll = BP.rollDamage;
    BP.rollDamage = function (source, target, mult) {
      let m = mult;
      if (source && target) {
        const side = alive(this, source.side);
        if (source.id === 'marrok' && target.emboHit && side.some((u) => u.id === 'embo')) m *= 1.25;
        if (source.id === 'embo' && target.marrokHit && side.some((u) => u.id === 'marrok')) m *= 1.15;
      }
      return baseRoll.call(this, source, target, m);
    };
    // Hat Shield: 70% less damage from attacks.
    const baseDmg = BP.applyDamage;
    BP.applyDamage = function (target, amount, crit, events, source) {
      if (target && target.statuses && target.statuses.hatShield && amount > 0 && !['burn', 'bleed', 'hazard'].includes(source)) amount = Math.max(1, Math.round(amount * 0.3));
      return baseDmg.call(this, target, amount, crit, events, source);
    };
    // Bleed ticks at the start of the bleeding unit's turn.
    const baseBegin = BP.beginTurn;
    BP.beginTurn = function (unit) {
      const bled = unit && unit.alive && unit.statuses && unit.statuses.bleed;
      const r = baseBegin.call(this, unit);
      if (bled && unit.alive) {
        const ev = [];
        const amount = Math.max(1, Math.round(unit.maxHp * (unit.boss && unit.def.raid ? 0.005 : 0.06)));
        this.applyDamage(unit, amount, false, ev, 'bleed');
        ev.push({ type: 'log', text: `${unit.def.name} bleeds.`, side: unit.side });
        r.events.splice(1, 0, ...ev);
        if (!unit.alive) { r.skipped = true; unit.tm = 0; }
      }
      return r;
    };
    const baseAct = BP.act;
    BP.act = function (unit, abilityIndex, targetUid) {
      const events = baseAct.call(this, unit, abilityIndex, targetUid);
      if (!unit || !IDS.includes(unit.id)) return events;
      const use = events.find((e) => e.type === 'use') || {};
      const ab = unit.abilities[abilityIndex];
      const tgts = (use.targets || []).map((u) => this.get(u)).filter(Boolean);
      if (unit.id === 'embo') {
        tgts.forEach((t) => { if (use.offensive) t.emboHit = true; });
        // Hat Throw bounces into a second enemy.
        if (abilityIndex === 0 && !ab.ultimate) {
          const second = pickRnd(this, foes(this, unit).filter((u) => !tgts.includes(u)));
          if (second) { use.bounce = second.uid; strike(this, unit, second, 0.75, events, 'emboHit'); }
        }
      }
      if (unit.id === 'marrok') {
        tgts.forEach((t) => { if (use.offensive) t.marrokHit = true; });
        // Savage Frenzy: three more leaps, each harder than the last.
        if (ab.ultimate) {
          use.frenzy = [];
          [0.7, 0.85, 1.0].forEach((m) => {
            const list = foes(this, unit);
            if (!list.length || !unit.alive) return;
            const t = pickRnd(this, list);
            use.frenzy.push(t.uid);
            strike(this, unit, t, m, events, 'marrokHit');
          });
          if (use.frenzy.length) { events.push({ type: 'log', text: `${unit.def.name} tears through the line: ${use.frenzy.length + 1} leaps!`, side: unit.side }); use.targets = [...use.targets, ...use.frenzy]; }
        }
      }
      // Auto-Turret: a free shot after every action the Havoc takes.
      if (unit.id === 'havoc' && unit.alive) {
        const t = pickRnd(this, foes(this, unit));
        if (t) {
          use.turret = t.uid;
          events.push({ type: 'log', text: `${unit.def.name}'s Auto-Turret fires at ${t.def.name}.`, side: unit.side });
          strike(this, unit, t, 0.42, events);
        }
      }
      return events;
    };
  }

  // ---------- Battle animations ----------
  const B = root.BattleUI;
  if (!B || B.__c25) return;
  B.__c25 = true;
  const motion = () => !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const mk = (html, css) => { const d = document.createElement('div'); d.innerHTML = html; const n = d.firstElementChild; if (css) n.style.cssText += css; return n; };
  const fly = (node, from, to, ms, o = {}) => node.animate([
    { transform: `translate(${from.x}px, ${from.y}px) translate(-50%, -50%) rotate(0deg) scale(${o.s0 || 1})` },
    ...(o.arc ? [{ transform: `translate(${(from.x + to.x) / 2}px, ${(from.y + to.y) / 2 - o.arc}px) translate(-50%, -50%) rotate(${(o.spin || 0) / 2}deg) scale(${o.s1 || 1})`, offset: 0.5 }] : []),
    { transform: `translate(${to.x}px, ${to.y}px) translate(-50%, -50%) rotate(${o.spin || 0}deg) scale(${o.s1 || 1})` },
  ], { duration: ms, easing: o.ease || 'ease-in-out', fill: 'forwards' }).finished.catch(() => {});
  const spot = (layer, p, size) => { const n = mk(`<div style="position:absolute;left:0;top:0;width:${size}px;height:${size}px;pointer-events:none;z-index:6"></div>`); layer.appendChild(n); n.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`; return n; };
  const boom = (layer, p, color, size, ms) => {
    const n = mk(`<div style="position:absolute;left:0;top:0;width:${size}px;height:${size}px;border-radius:50%;pointer-events:none;z-index:6;background:radial-gradient(circle,#fff 0%,${color} 35%,transparent 70%)"></div>`);
    layer.appendChild(n);
    n.animate([{ transform: `translate(${p.x}px,${p.y}px) translate(-50%,-50%) scale(.2)`, opacity: 1 }, { transform: `translate(${p.x}px,${p.y}px) translate(-50%,-50%) scale(1.3)`, opacity: 0 }], { duration: ms || 420, fill: 'forwards' }).onfinish = () => n.remove();
  };
  const baseUse = B.animateUse;
  B.animateUse = async function (ev) {
    const actor = this.battle && this.battle.get(ev.uid);
    if (!actor || !IDS.includes(actor.id) || ev.ultimate || !motion()) {
      const r = await baseUse.call(this, ev);
      if (actor && actor.id === 'havoc' && ev.turret && !ev.ultimate) await this.c25Turret(actor, ev.turret);
      return r;
    }
    const ab = actor.abilities[ev.abilityIndex];
    if (ev.abilityIndex > 0) this.banner(ab.name, actor.side);
    const from = this.center(actor.uid);
    const tg = (ev.targets || []).map((u) => this.center(u));
    const sp = this.speed || 1;
    if (actor.id === 'havoc') {
      if (root.Sound) root.Sound.play('laser');
      const n = ev.abilityIndex === 0 ? 2 : 6;
      for (let i = 0; i < n; i++) { this.laser({ x: from.x + (i % 2 ? 8 : -8), y: from.y }, tg[0], '#ff5a4a', i * (ev.abilityIndex === 0 ? 110 : 60), { big: ev.abilityIndex > 0 }); }
      await this.wait(ev.abilityIndex === 0 ? 360 : 520);
      if (ev.abilityIndex > 0) { this.shake(); this.env.impact(tg[0].x, tg[0].y, { power: 0.9, color: '#ff5a4a' }); }
      if (ev.turret) await this.c25Turret(actor, ev.turret);
      return;
    }
    if (actor.id === 'embo') {
      if (ev.abilityIndex === 0) {
        if (root.Sound) root.Sound.play('saber');
        const hat = spot(this.fx, from, 54); hat.innerHTML = hatDisc();
        hat.firstElementChild.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(1440deg)' }], { duration: 1100 / sp });
        await fly(hat, from, tg[0], 300 / sp, { arc: 30 });
        this.slash(tg[0], '#e8eef6', -60); this.env.impact(tg[0].x, tg[0].y, { power: 0.5, color: '#d9a43a' });
        let last = tg[0];
        if (ev.bounce) { const b2 = this.center(ev.bounce); await fly(hat, last, b2, 260 / sp); this.slash(b2, '#e8eef6', 40); last = b2; }
        await fly(hat, last, from, 320 / sp, { arc: -20 });
        hat.remove();
        return;
      }
      if (ev.abilityIndex === 1) {
        if (root.Sound) root.Sound.play('heal');
        const s = spot(this.fx, { x: from.x, y: from.y }, 120);
        s.innerHTML = `<div style="position:absolute;inset:0;border-radius:50%;border:3px solid #7ae8ff;background:radial-gradient(circle,#7ae8ff11,#7ae8ff55);box-shadow:0 0 26px #7ae8ff"></div><div style="position:absolute;inset:26%">${hatDisc()}</div>`;
        s.animate([{ opacity: 0, transform: `translate(${from.x}px,${from.y}px) translate(-50%,-50%) scale(.2)` }, { opacity: 1, transform: `translate(${from.x}px,${from.y}px) translate(-50%,-50%) scale(1)` }], { duration: 260 / sp, fill: 'forwards' });
        await this.wait(620);
        s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260 / sp, fill: 'forwards' }).onfinish = () => s.remove();
        return;
      }
      // Sic 'Em: Marrok bounds in from Embo's side.
      return this.c25Leap(from, [tg[0]], 1);
    }
    if (actor.id === 'marrok') {
      if (ev.abilityIndex === 1) {
        if (root.Sound) root.Sound.play('ult');
        for (let i = 0; i < 3; i++) { this.wave(from, '#c890ff', 4 + i * 2); await this.wait(140); }
        for (const t of (ev.targets || [])) this.env.light(this.center(t).x, this.center(t).y, '#ffd23f', 80, 0.5);
        await this.wait(260);
        return;
      }
      return this.c25Leap(from, [tg[0]], 1, '#ff5a4a');
    }
    return baseUse.call(this, ev);
  };
  // The Havoc's dorsal turret: a quick free shot.
  B.c25Turret = async function (actor, uid) {
    if (!this.cards[uid] || !this.cards[actor.uid]) return;
    const from = this.center(actor.uid);
    const to = this.center(uid);
    this.flashAt({ x: from.x, y: from.y - 10 }, '#ff7a5a');
    this.laser({ x: from.x, y: from.y - 10 }, to, '#ff9a6a', 0);
    await this.wait(240);
  };
  // Marrok (or Marrok leaping for Embo) bounding to each point, with slashes.
  B.c25Leap = async function (from, points, bites, color) {
    if (root.Sound) root.Sound.play('saber');
    const w = Math.min(150, (this.field.getBoundingClientRect().width || 400) * 0.22);
    const dog = spot(this.fx, from, w);
    dog.innerHTML = marrokSprite();
    const sp = this.speed || 1;
    let at = from;
    for (const p of points) {
      const flip = p.x < at.x ? -1 : 1;
      dog.firstElementChild.style.transform = `scaleX(${flip})`;
      await fly(dog, at, { x: p.x - flip * 20, y: p.y }, 300 / sp, { arc: 46 });
      for (let i = 0; i < bites; i++) { this.slash(p, color || '#ffe0b0', -40 + i * 35); await this.wait(70); }
      this.env.impact(p.x, p.y, { power: 0.7, color: color || '#ff8a4a' });
      at = { x: p.x - flip * 20, y: p.y };
    }
    await fly(dog, at, from, 280 / sp, { arc: 30 });
    dog.remove();
  };

  // ---------- Signature ultimates ----------
  // Bomblet Storm: the Havoc sweeps over the top of the screen and the bomb bay opens.
  B.mv_bomblet = async function (S, actor, from, T, spec, hit) {
    const W = S.W; const Hh = S.H;
    const size = Math.min(W, Hh) * 0.32;
    const ship = mk(`<div style="position:absolute;left:0;top:0;width:${size}px;height:${size}px;z-index:5;filter:drop-shadow(0 0 18px #ff8a3a)"><svg viewBox="0 0 100 100" width="100%" height="100%">${havocShip()}</svg></div>`);
    S.layer.appendChild(ship);
    const y = Hh * 0.2;
    const a = { x: -size, y }; const b = { x: W + size, y };
    if (root.Sound) root.Sound.play('whoosh');
    const dur = 2000 / S.speed;
    ship.animate([{ transform: `translate(${a.x}px,${a.y}px) translate(-50%,-50%) rotate(90deg)` }, { transform: `translate(${b.x}px,${b.y}px) translate(-50%,-50%) rotate(90deg)` }], { duration: dur, easing: 'linear', fill: 'forwards' });
    const sorted = T.slice().sort((p, q) => p.x - q.x);
    const drops = [];
    sorted.forEach((t) => {
      const when = ((t.x + size) / (W + size * 2)) * dur;
      for (let k = 0; k < 4; k++) {
        drops.push(new Promise((res) => setTimeout(() => {
          const sx = t.x + (k - 1.5) * 22;
          const bomb = mk(`<div style="position:absolute;left:0;top:0;width:18px;height:18px;border-radius:50%;z-index:4;background:radial-gradient(circle at 35% 30%,#fff,#ff7a5a 40%,#5a1008);box-shadow:0 0 12px #ff5a4a"></div>`);
          S.layer.appendChild(bomb);
          const tx = t.x + (k - 1.5) * 18; const ty = t.y + (k % 2 ? 12 : -8);
          bomb.animate([{ transform: `translate(${sx}px,${y}px) translate(-50%,-50%) scale(.6)` }, { transform: `translate(${tx}px,${ty}px) translate(-50%,-50%) scale(1)` }], { duration: 420 / S.speed, easing: 'cubic-bezier(.5,0,1,.6)', fill: 'forwards' }).onfinish = () => {
            bomb.remove();
            boom(S.layer, { x: tx, y: ty }, '#ffb060', 120, 480);
            if (k === 0) { hit(t); if (this.shake) this.shake(); if (root.Sound) root.Sound.play('explosion'); }
            if (k === 3 && S.trail) S.trail({ x: tx - 30, y: ty }, { x: tx + 30, y: ty }, '#ff8a3a', 1.4);
            res();
          };
        }, when + k * 90 / S.speed)));
      }
    });
    await Promise.all(drops);
    await new Promise((r) => setTimeout(r, Math.max(0, dur * 0.25)));
    // Power drain: the engines sputter as it leaves.
    const tag = mk(`<div style="position:absolute;left:50%;top:${y + size * 0.55}px;transform:translateX(-50%);z-index:6;font:800 22px var(--font-display,system-ui);letter-spacing:.2em;color:#ff5a4a;text-shadow:0 0 12px #ff5a4a">POWER DRAIN</div>`);
    S.layer.appendChild(tag);
    tag.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }, { opacity: 0 }], { duration: 900 / S.speed, fill: 'forwards' }).onfinish = () => tag.remove();
    await new Promise((r) => setTimeout(r, 700 / S.speed));
    ship.remove();
  };
  // The Hunt: the hat pins the target, then Marrok mauls it.
  B.mv_hunt = async function (S, actor, from, T, spec, hit) {
    const t = T[0];
    if (!t) return;
    const hsz = Math.min(S.W, S.H) * 0.12;
    const hat = mk(`<div style="position:absolute;left:0;top:0;width:${hsz}px;height:${hsz}px;z-index:5;filter:drop-shadow(0 0 14px #d9a43a)">${hatDisc()}</div>`);
    S.layer.appendChild(hat);
    if (root.Sound) root.Sound.play('saber');
    hat.firstElementChild.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(1800deg)' }], { duration: 1400 / S.speed, fill: 'forwards' });
    await fly(hat, from, { x: t.x, y: t.y }, 520 / S.speed, { arc: S.H * 0.18 });
    boom(S.layer, t, '#ffd23f', 200, 500);
    const stun = mk(`<div style="position:absolute;left:${t.x}px;top:${t.y - hsz}px;transform:translate(-50%,-50%);z-index:6;font:800 26px var(--font-display,system-ui);color:#ffd23f;text-shadow:0 0 14px #ffb020">⚡ STUNNED</div>`);
    S.layer.appendChild(stun);
    stun.animate([{ opacity: 0, transform: 'translate(-50%,-30%)' }, { opacity: 1, transform: 'translate(-50%,-50%)' }], { duration: 260, fill: 'forwards' });
    await fly(hat, t, { x: t.x, y: t.y - hsz * 1.1 }, 260 / S.speed, { s1: 0.8 });
    await new Promise((r) => setTimeout(r, 300 / S.speed));
    // Marrok comes out of nowhere.
    const w = Math.min(S.W, S.H) * 0.4;
    const dog = mk(`<div style="position:absolute;left:0;top:0;width:${w}px;height:${w * 0.63}px;z-index:7;filter:drop-shadow(0 0 16px #ff8a4a)">${marrokSprite()}</div>`);
    S.layer.appendChild(dog);
    const flip = t.x < from.x ? -1 : 1;
    dog.firstElementChild.style.transform = `scaleX(${flip})`;
    if (root.Sound) root.Sound.play('ult');
    await fly(dog, { x: from.x - flip * S.W * 0.2, y: S.H + w }, { x: t.x - flip * w * 0.25, y: t.y }, 520 / S.speed, { arc: S.H * 0.3, s0: 0.6, s1: 1.1 });
    for (let i = 0; i < 5; i++) {
      if (S.trail) S.trail({ x: t.x - 60 + i * 10, y: t.y - 50 + i * 6 }, { x: t.x + 50 - i * 6, y: t.y + 50 - i * 10 }, i % 2 ? '#ffe0b0' : '#ff8a4a', 1.2);
      if (i === 2) hit(t);
      if (this.shake) this.shake();
      await new Promise((r) => setTimeout(r, 120 / S.speed));
    }
    boom(S.layer, t, '#ff8a4a', 260, 520);
    stun.remove();
    await fly(dog, { x: t.x - flip * w * 0.25, y: t.y }, { x: t.x + flip * S.W, y: t.y - S.H * 0.2 }, 420 / S.speed, { arc: 60 });
    dog.remove(); hat.remove();
  };
  // Savage Frenzy: four leaps across the line, each one bigger.
  B.mv_frenzy = async function (S, actor, from, T, spec, hit) {
    const w = Math.min(S.W, S.H) * 0.34;
    const dog = mk(`<div style="position:absolute;left:0;top:0;width:${w}px;height:${w * 0.63}px;z-index:7;filter:drop-shadow(0 0 16px #ff8a4a)">${marrokSprite()}</div>`);
    S.layer.appendChild(dog);
    if (root.Sound) root.Sound.play('ult');
    let at = from;
    const stops = T.length ? T : [];
    for (let i = 0; i < stops.length; i++) {
      const t = stops[i];
      const flip = t.x < at.x ? -1 : 1;
      dog.firstElementChild.style.transform = `scaleX(${flip})`;
      const scale = 0.85 + i * 0.12;
      await fly(dog, at, { x: t.x - flip * w * 0.2, y: t.y }, 300 / S.speed, { arc: S.H * 0.16, s0: scale - 0.1, s1: scale });
      for (let k = 0; k < 2 + i; k++) { if (S.trail) S.trail({ x: t.x - 50 + k * 12, y: t.y - 40 }, { x: t.x + 40 - k * 8, y: t.y + 45 }, k % 2 ? '#fff0d0' : '#ff8a4a', 1 + i * 0.25); }
      boom(S.layer, t, i === stops.length - 1 ? '#ffd23f' : '#ff8a4a', 140 + i * 50, 420);
      hit(t);
      if (this.shake) this.shake();
      at = { x: t.x - flip * w * 0.2, y: t.y };
    }
    await fly(dog, at, from, 360 / S.speed, { arc: 40 });
    dog.remove();
  };
})(typeof window !== 'undefined' ? window : globalThis);
