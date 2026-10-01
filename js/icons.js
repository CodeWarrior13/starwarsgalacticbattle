/* Star Wars icon set.
 * Every symbol the game used to show as a plain emoji or dingbat is drawn here
 * as a small SVG instead: crossed sabers, an X-wing, the Death Star, the
 * Rebel starbird, the Imperial cog and friends. Glyphs that appear anywhere in
 * the page text are swapped for their icon automatically, so data tables can
 * keep using the short glyph as a key.
 */
(function (root) {
  'use strict';

  const S = (d, extra = '') => `<path d="${d}" fill-rule="evenodd" ${extra}/>`;
  const L = (d, w = 2) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const C = (cx, cy, r, extra = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" ${extra}/>`;
  const ring = (cx, cy, r, w = 2) => C(cx, cy, r, `fill="none" stroke="currentColor" stroke-width="${w}"`);

  const SHAPES = {
    sabers: L('M5 19L17.5 6.5', 2) + L('M19 19L6.5 6.5', 2) + L('M3.2 20.8l2.6-2.6', 4) + L('M20.8 20.8l-2.6-2.6', 4) + C(18.6, 5.4, 1.2) + C(5.4, 5.4, 1.2),
    xwing: S('M12 1.5l1.3 7.5v10l-1.3 3.2-1.3-3.2V9z') + L('M12 12L3.2 4.6M12 12l8.8-7.4M12 12l-8.8 7.4M12 12l8.8 7.4', 1.9) + C(3, 4.4, 1.3) + C(21, 4.4, 1.3) + C(3, 19.6, 1.3) + C(21, 19.6, 1.3),
    deathstar: C(12, 12, 9.2, 'fill-opacity=".28" stroke="currentColor" stroke-width="1.8"') + L('M3.4 12.6h17.2', 1.5) + C(8.4, 8.6, 2.6) + C(8.4, 8.6, 0.9, 'fill="#000" fill-opacity=".5"'),
    spire: S('M12 1.5l3.2 6.5V21H8.8V8z M11 9.5h2v3h-2z') + S('M4.5 21l4.3-9v9z M19.5 21l-4.3-9v9z') + L('M3 22h18', 1.6),
    lock: L('M8 11V8a4 4 0 0 1 8 0v3', 2.2) + S('M5 11h14v10.5H5z M12 13.6l2 1.15v2.3L12 18.2l-2-1.15v-2.3z'),
    bolt: S('M13.5 1.5L4 14h7l-1.2 8.5L20 9.5h-7z'),
    warn: S('M12 2l10.5 19h-21z M11 8.5h2v6.5h-2z M11 16.6h2v2.2h-2z'),
    shield: S('M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z M12 7l3.5 2v4L12 15l-3.5-2V9z'),
    cracked: S('M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z M12.8 5.5l-2.3 5.6 2.6 1-2.3 6.4 4-7.4-2.6-.9 1.6-4.7z'),
    bacta: S('M9.4 3h5.2v6.4H21v5.2h-6.4V21H9.4v-6.4H3V9.4h6.4z'),
    kyber: S('M12 1l5.2 7.2L12 23 6.8 8.2z M12 4.6L9.6 8.3 12 17.4l2.4-9.1z'),
    jedi: S('M11 1.5h2v13h-2z') + S('M9.6 14.5h4.8v2.2H9.6z') + S('M11 9.5C6.2 9.5 3 12.6 1.8 17 4.8 13.8 8 13 11 12.8z') + S('M13 9.5c4.8 0 8 3.1 9.2 7.5-3-3.2-6.2-4-9.2-4.2z') + S('M10.6 17.5C8 18.2 6.3 19.8 5.4 22.4c2.4-1.7 4-2.3 5.6-2.6z') + S('M13.4 17.5c2.6.7 4.3 2.3 5.2 4.9-2.4-1.7-4-2.3-5.6-2.6z'),
    sith: S('M12 1.5l9.5 5.6-3 13.2L12 22.5l-6.5-2.2-3-13.2z M6.4 11.2Q12 6.4 17.6 11.2 12 15.6 6.4 11.2z M10.6 15.6h2.8L12 20z'),
    starbird: S('M12 1.5c-2 4.2-2.1 8.2-1 11.6-3.1-1-5.3-3.2-6.4-6.3-1.2 5.4.9 10.4 5.1 12.5L9 22.2l3-2.2 3 2.2-.7-2.9c4.2-2.1 6.3-7.1 5.1-12.5-1.1 3.1-3.3 5.3-6.4 6.3 1.1-3.4 1-7.4-1-11.6z'),
    cog: ring(12, 12, 9.4, 2) + C(12, 12, 3.4) + L('M12 2.6v6M12 15.4v6M3.9 7.3l5.2 3M14.9 13.7l5.2 3M3.9 16.7l5.2-3M14.9 10.3l5.2-3', 2.2),
    republic: ring(12, 12, 9.6, 1.6) + C(12, 12, 2.6) + L('M12 2.4v5.6M12 16v5.6M2.4 12H8M16 12h5.6M5.2 5.2l3.9 3.9M14.9 14.9l3.9 3.9M5.2 18.8l3.9-3.9M14.9 9.1l3.9-3.9', 1.4),
    cis: L('M12 2l8.7 5v10L12 22l-8.7-5V7z', 1.8) + ring(12, 12, 3.2, 1.8) + L('M12 2v6.8M12 15.2V22M3.3 7l5.9 3.4M14.8 13.6l5.9 3.4M3.3 17l5.9-3.4M14.8 10.4l5.9-3.4', 1.5),
    blaster: S('M2 8.5h14l2-2h3.5v4H18v1.8h-5.2l-1.2 2H9.8L8.6 21H4.4l1.4-6.7H3z M6 4.8h7.2v2.4H6z'),
    rifle: S('M1.5 10h13.5l2-1.2h5.5V12h-4.2l-1 1.2H9.2l-1.1 4H4.6l1.1-4H1.5z M5.5 6.8h6.5v2.2H5.5z'),
    reticle: ring(12, 12, 7.2, 1.9) + L('M12 1.5v5M12 17.5v5M1.5 12h5M17.5 12h5', 1.9) + C(12, 12, 1.6),
    aggro: ring(12, 12, 9, 1.8) + ring(12, 12, 5, 1.8) + C(12, 12, 1.8),
    droid: S('M5 12.5a7 7 0 0 1 14 0V21H5z M12 7.4a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 1 1 0-3.8z M7.2 14h3.6v2H7.2z M13.2 14h3.6v2h-3.6z M7.2 17.6h9.6v1.4H7.2z') + L('M8.5 5.6l-1.5-2', 1.4),
    trooper: S('M12 2c-5 0-7.5 3.5-7.5 8v5l2.5 4 3 2h4l3-2 2.5-4v-5c0-4.5-2.5-8-7.5-8z M6.8 10.2l3.8.4-.5 2.6-2.8-.6z M17.2 10.2l-3.8.4.5 2.6 2.8-.6z M10.4 16h3.2l-.5 2.2h-2.2z'),
    leaf: S('M4.5 19.5C4.5 9.5 10.5 4 20 3.8 20 13 14.8 19.5 4.5 19.5z') + L('M3 21L13 11', 1.6),
    rank: S('M2.5 6.5h19v11h-19z M5 9h3v2.2H5z M10.5 9h3v2.2h-3z M16 9h3v2.2h-3z M5 13h3v2.2H5z M10.5 13h3v2.2h-3z'),
    mando: S('M12 2C7 2 5 5 5 10v10h4v-4h6v4h4V10c0-5-2-8-7-8z M7.4 8.8h9.2v2.5h-3.1v4.2h-3v-4.2H7.4z'),
    badge: S('M12 1.5L22 12 12 22.5 2 12z M7.6 9.6l4.4 4.2 4.4-4.2v2.8l-4.4 4.2-4.4-4.2z'),
    ringsaber: ring(12, 12, 8.4, 2.4) + C(12, 12, 2.6) + L('M3.6 12H9.4M14.6 12h5.8', 1.6) + L('M12 1.2v2.6M12 20.2v2.6', 3),
    crescent: S('M15 2.5a9.5 9.5 0 1 0 6.5 13 7.4 7.4 0 1 1-6.5-13z') + L('M8 20.5v2', 1.6),
    claws: L('M6.5 2.5c3 6 3 12.5-1 19M12 2.5c3 6 3 12.5-1 19M17.5 2.5c3 6 3 12.5-1 19', 2.1),
    gunship: S('M3.5 10.5l8.5-5 8.5 5-2 4.5h-13z M8 9.4a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 1 1 0-2.6z M16 9.4a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 1 1 0-2.6z') + S('M.8 12.4h4.6v2.2H.8z M18.6 12.4h4.6v2.2h-4.6z') + S('M9.5 15h5v4h-5z'),
    bomb: C(12, 14, 6.5) + S('M10 3h4v4.6h-4z') + L('M5 4l2 2M19 4l-2 2M12 .8v1', 1.5),
    flame: S('M12 1.5c2 4.2 6.2 6.2 6.2 12.5a6.2 6.2 0 0 1-12.4 0c0-4 2.6-5.2 3.2-8.2 1.4 2 1.8 3 2.4 4 1-2.2 1-5 .6-8.3z M12 13.2c.8 1.6 2.4 2.4 2.4 4.4a2.4 2.4 0 0 1-4.8 0c0-1.4 1-2 1.4-3 .4.6.6 1 1 .6z'),
    planet: C(12, 12, 6) + `<ellipse cx="12" cy="12" rx="11" ry="3.6" transform="rotate(-20 12 12)" fill="none" stroke="currentColor" stroke-width="1.6"/>`,
    sabacc: S('M7 2.5h11a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2z M12.5 6.5l3.5 5.5-3.5 5.5L9 12z') + L('M3 6v13a2 2 0 0 0 2 2', 1.4),
    cubes: S('M2.5 8.8L7.6 6l5.1 2.8v6.1L7.6 17.7l-5.1-2.8z M7.6 10.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 1 1 0-2.2z') + S('M11.3 13.2l5.1-2.8 5.1 2.8v6.1l-5.1 2.8-5.1-2.8z M14.4 15a1 1 0 1 1 0 2 1 1 0 1 1 0-2z M18.4 17a1 1 0 1 1 0 2 1 1 0 1 1 0-2z'),
    holocron: S('M12 1.5L22.5 12 12 22.5 1.5 12z M12 6l6 6-6 6-6-6z') + S('M12 9.5l2.5 2.5-2.5 2.5L9.5 12z'),
    kybercrown: S('M12 1l3.2 7.4L12 20.5 8.8 8.4z') + S('M5.6 5.5l2.7 5.3L6.9 21 3.8 11z') + S('M18.4 5.5l2 5.5L17.1 21l-1.4-10.2z') + L('M2.5 22.5h19', 1.6),
    spark: S('M12 1l2.4 8.6L23 12l-8.6 2.4L12 23l-2.4-8.6L1 12l8.6-2.4z'),
    settings: ring(12, 12, 4.2, 2) + S('M10.4 1.5h3.2l.6 3 2.4 1 2.6-1.7 2.3 2.3-1.7 2.6 1 2.4 3 .6v3.2l-3 .6-1 2.4 1.7 2.6-2.3 2.3-2.6-1.7-2.4 1-.6 3h-3.2l-.6-3-2.4-1-2.6 1.7-2.3-2.3 1.7-2.6-1-2.4-3-.6v-3.2l3-.6 1-2.4-1.7-2.6 2.3-2.3 2.6 1.7 2.4-1z M12 6.2a5.8 5.8 0 1 0 0 11.6 5.8 5.8 0 1 0 0-11.6z') + L('M12 9.5v5M9.5 12h5', 1.4),
    medal: S('M7 1.5h10l-2.5 7h-5z') + C(12, 15, 6.5, 'fill-opacity=".3" stroke="currentColor" stroke-width="1.8"') + S('M12 10.6l1.3 2.9 3.1.3-2.4 2 .8 3.1L12 17.3 9.2 18.9l.8-3.1-2.4-2 3.1-.3z'),
    trophy: S('M6.5 2.5h11V9a5.5 5.5 0 0 1-11 0z M10.5 15h3v3.5h3.5V21H7v-2.5h3.5z') + L('M6.5 4.5H3.5v1.5A3.5 3.5 0 0 0 7 9.5M17.5 4.5h3v1.5A3.5 3.5 0 0 1 17 9.5', 1.6),
    chart: S('M3 20h18v1.6H3z M4.5 12h3.4v7H4.5z M10.3 7h3.4v12h-3.4z M16.1 3h3.4v16h-3.4z'),
    crate: S('M3 7.5L12 3l9 4.5v9L12 21l-9-4.5z M12 11.2L5.6 8 12 4.8 18.4 8z M11 12.8v6.4l-6.4-3.2V9.6z M13 12.8l6.4-3.2V16L13 19.2z') + L('M8.5 6.2l6.6 3.4', 1.2),
    speaker: S('M3 9h4l5-4.5v15L7 15H3z') + L('M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12', 1.8),
  };

  // Glyph → icon. Anything not listed here stays as plain text (stars,
  // arrows and check marks read fine as type).
  const GLYPHS = {
    '⚔': 'sabers', '✈': 'xwing', '➶': 'xwing', '☠': 'deathstar', '♜': 'spire', '🔒': 'lock',
    '⚡': 'bolt', '⚠': 'warn', '⛨': 'shield', '⊘': 'cracked', '✚': 'bacta', '✦': 'kyber', '◆': 'kyber',
    '✧': 'jedi', '☀': 'jedi', '⛧': 'sith', '☾': 'sith', '✺': 'starbird', '⬢': 'cog', '⌬': 'republic',
    '⎔': 'cis', '☄': 'blaster', '⌖': 'reticle', '🎯': 'reticle', '◎': 'aggro', '⚙': 'droid', '⛉': 'trooper',
    '❦': 'leaf', '♛': 'rank', '⟁': 'mando', '⚑': 'badge', '⊗': 'ringsaber', '☽': 'crescent', '⚘': 'claws',
    '⛭': 'gunship', '✹': 'bomb', '➹': 'rifle', '🔥': 'flame', '◉': 'planet', '🎰': 'sabacc', '🎲': 'cubes',
    '◈': 'holocron', '👑': 'kybercrown', '🔊': 'speaker',
  };

  function svg(name, label) {
    const body = SHAPES[name];
    if (!body) return '';
    return `<svg class="swi swi-${name}" viewBox="0 0 24 24" fill="currentColor" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${body}</svg>`;
  }

  const RE = new RegExp(`(${Object.keys(GLYPHS).map((g) => g.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\uFE0F?`, 'gu');
  const SKIP = 'script,style,textarea,input,select,option,kbd,svg,canvas,title,[data-noico]';

  function swapText(node) {
    const text = node.nodeValue;
    RE.lastIndex = 0;
    if (!RE.test(text)) return;
    const parent = node.parentElement;
    if (!parent || parent.closest(SKIP)) return;
    const frag = document.createDocumentFragment();
    let last = 0;
    RE.lastIndex = 0;
    let m;
    while ((m = RE.exec(text))) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const span = document.createElement('span');
      span.className = 'swi-wrap';
      span.innerHTML = svg(GLYPHS[m[1]]);
      frag.appendChild(span);
      last = m.index + m[0].length;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.replaceWith(frag);
  }

  function swap(scope) {
    if (!scope) return;
    if (scope.nodeType === 3) return swapText(scope);
    if (scope.nodeType !== 1 || scope.closest(SKIP)) return;
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    const hits = [];
    let n;
    while ((n = walker.nextNode())) { RE.lastIndex = 0; if (RE.test(n.nodeValue)) hits.push(n); }
    hits.forEach(swapText);
  }

  // Watch the whole page so every screen, toast and modal gets the icons.
  function watch() {
    swap(document.body);
    let queue = [];
    let pending = false;
    const flush = () => { pending = false; const q = queue; queue = []; q.forEach((nd) => nd.isConnected && swap(nd)); };
    new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'characterData') queue.push(m.target);
        else m.addedNodes.forEach((nd) => queue.push(nd));
      }
      if (!pending) { pending = true; queueMicrotask(flush); }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  root.Icons = { svg, swap, watch, SHAPES, GLYPHS };
})(window);
