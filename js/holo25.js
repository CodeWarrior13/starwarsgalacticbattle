// Update 2.5: holo cards. Pull a holo once and that card is holo for good. Its
// foil grows by itself as the card does: Silver when you pull it, Gold at
// level 50, Kyber at 7★, Prism after 100 wins with it (and Galactic for
// MAX OUT). Each card keeps its own: show the best one, pick any you've
// unlocked, or turn holo off, in the card's screen. Earned-only cards can't be
// pulled: once one reaches 7★, the next copy turns it holo, then it grows
// like any other. The foil is one sliding layer and a few glints (the
// compositor moves them, so it costs next to nothing); in grids it only moves
// when you point at a card, and Performance mode keeps it still. Off until 2.5.
(function (root) {
  'use strict';
  if (!(root.Update25 && root.Update25.on())) return;
  const UI = root.UI; const Player = root.Player; const D = root.GameData;
  if (!UI || !Player || !D) return;
  const FR = {"silver":"<svg class=\"f39-frame\" viewBox=\"0 0 170 277\" preserveAspectRatio=\"none\"><defs><linearGradient id=\"f39_0\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#7a8698\"/><stop offset=\".35\" stop-color=\"#f4f7fb\"/><stop offset=\".5\" stop-color=\"#9aa6b8\"/><stop offset=\".65\" stop-color=\"#ffffff\"/><stop offset=\"1\" stop-color=\"#7a8698\"/></linearGradient></defs>\n<rect x=\"2.5\" y=\"2.5\" width=\"165\" height=\"272\" rx=\"12\" fill=\"none\" stroke=\"url(#f39_0)\" stroke-width=\"5\"/><rect x=\"6.5\" y=\"6.5\" width=\"157\" height=\"264\" rx=\"9\" fill=\"none\" stroke=\"url(#f39_0)\" stroke-width=\"1\" opacity=\".7\"/>\n<g transform=\"translate(0 0) scale(1 1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_0)\"/></g><g transform=\"translate(170 0) scale(-1 1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_0)\"/></g><g transform=\"translate(0 277) scale(1 -1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_0)\"/></g><g transform=\"translate(170 277) scale(-1 -1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_0)\"/></g>\n</svg>","gold":"<svg class=\"f39-frame\" viewBox=\"0 0 170 277\" preserveAspectRatio=\"none\"><defs><linearGradient id=\"f39_1\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#8a5a08\"/><stop offset=\".35\" stop-color=\"#ffe7a0\"/><stop offset=\".5\" stop-color=\"#c8901a\"/><stop offset=\".65\" stop-color=\"#fff4c8\"/><stop offset=\"1\" stop-color=\"#8a5a08\"/></linearGradient></defs>\n<rect x=\"2.5\" y=\"2.5\" width=\"165\" height=\"272\" rx=\"12\" fill=\"none\" stroke=\"url(#f39_1)\" stroke-width=\"5\"/><rect x=\"6.5\" y=\"6.5\" width=\"157\" height=\"264\" rx=\"9\" fill=\"none\" stroke=\"url(#f39_1)\" stroke-width=\"1\" opacity=\".7\"/>\n<g transform=\"translate(0 0) scale(1 1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_1)\"/></g><g transform=\"translate(170 0) scale(-1 1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_1)\"/></g><g transform=\"translate(0 277) scale(1 -1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_1)\"/></g><g transform=\"translate(170 277) scale(-1 -1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_1)\"/></g>\n<path d=\"M70 2.5 h30\" stroke=\"#fff\" stroke-width=\"2\" opacity=\".7\"/><path d=\"M80 0 l5 5 l5 -5\" fill=\"url(#f39_1)\"/></svg>","kyber":"<svg class=\"f39-frame\" viewBox=\"0 0 170 277\" preserveAspectRatio=\"none\"><defs><linearGradient id=\"f39_2\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#1a6ad8\"/><stop offset=\".35\" stop-color=\"#bff4ff\"/><stop offset=\".5\" stop-color=\"#3ab8ff\"/><stop offset=\".65\" stop-color=\"#e8fbff\"/><stop offset=\"1\" stop-color=\"#1a6ad8\"/></linearGradient></defs>\n<rect x=\"2.5\" y=\"2.5\" width=\"165\" height=\"272\" rx=\"12\" fill=\"none\" stroke=\"url(#f39_2)\" stroke-width=\"5\"/><rect x=\"6.5\" y=\"6.5\" width=\"157\" height=\"264\" rx=\"9\" fill=\"none\" stroke=\"url(#f39_2)\" stroke-width=\"1\" opacity=\".7\"/>\n<g transform=\"translate(0 0) scale(1 1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_2)\"/><path d=\"M12 12 l3 -6 l3 6 l-3 6z\" fill=\"#fff\" opacity=\".85\"/></g><g transform=\"translate(170 0) scale(-1 1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_2)\"/><path d=\"M12 12 l3 -6 l3 6 l-3 6z\" fill=\"#fff\" opacity=\".85\"/></g><g transform=\"translate(0 277) scale(1 -1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_2)\"/><path d=\"M12 12 l3 -6 l3 6 l-3 6z\" fill=\"#fff\" opacity=\".85\"/></g><g transform=\"translate(170 277) scale(-1 -1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_2)\"/><path d=\"M12 12 l3 -6 l3 6 l-3 6z\" fill=\"#fff\" opacity=\".85\"/></g>\n<path d=\"M70 2.5 h30\" stroke=\"#fff\" stroke-width=\"2\" opacity=\".7\"/><path d=\"M80 0 l5 5 l5 -5\" fill=\"url(#f39_2)\"/></svg>","prism":"<svg class=\"f39-frame\" viewBox=\"0 0 170 277\" preserveAspectRatio=\"none\"><defs><linearGradient id=\"f39_3\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ff4a9a\"/><stop offset=\".2\" stop-color=\"#ffd23f\"/><stop offset=\".4\" stop-color=\"#5aff9a\"/><stop offset=\".6\" stop-color=\"#3ac8ff\"/><stop offset=\".8\" stop-color=\"#b06aff\"/><stop offset=\"1\" stop-color=\"#ff4a9a\"/></linearGradient></defs>\n<rect x=\"2.5\" y=\"2.5\" width=\"165\" height=\"272\" rx=\"12\" fill=\"none\" stroke=\"url(#f39_3)\" stroke-width=\"5\"/><rect x=\"6.5\" y=\"6.5\" width=\"157\" height=\"264\" rx=\"9\" fill=\"none\" stroke=\"url(#f39_3)\" stroke-width=\"1\" opacity=\".7\"/>\n<g transform=\"translate(0 0) scale(1 1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_3)\"/><path d=\"M12 12 l3 -6 l3 6 l-3 6z\" fill=\"#fff\" opacity=\".85\"/></g><g transform=\"translate(170 0) scale(-1 1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_3)\"/><path d=\"M12 12 l3 -6 l3 6 l-3 6z\" fill=\"#fff\" opacity=\".85\"/></g><g transform=\"translate(0 277) scale(1 -1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_3)\"/><path d=\"M12 12 l3 -6 l3 6 l-3 6z\" fill=\"#fff\" opacity=\".85\"/></g><g transform=\"translate(170 277) scale(-1 -1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_3)\"/><path d=\"M12 12 l3 -6 l3 6 l-3 6z\" fill=\"#fff\" opacity=\".85\"/></g>\n<path d=\"M70 2.5 h30\" stroke=\"#fff\" stroke-width=\"2\" opacity=\".7\"/><path d=\"M80 0 l5 5 l5 -5\" fill=\"url(#f39_3)\"/></svg>","galactic":"<svg class=\"f39-frame\" viewBox=\"0 0 170 277\" preserveAspectRatio=\"none\"><defs><linearGradient id=\"f39_g\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#2a1470\"/><stop offset=\".2\" stop-color=\"#7a5cff\"/><stop offset=\".4\" stop-color=\"#ff5ad0\"/><stop offset=\".6\" stop-color=\"#5ae8ff\"/><stop offset=\".8\" stop-color=\"#ffd8f4\"/><stop offset=\"1\" stop-color=\"#2a1470\"/></linearGradient></defs>\n<rect x=\"2.5\" y=\"2.5\" width=\"165\" height=\"272\" rx=\"12\" fill=\"none\" stroke=\"url(#f39_g)\" stroke-width=\"5\"/><rect x=\"6.5\" y=\"6.5\" width=\"157\" height=\"264\" rx=\"9\" fill=\"none\" stroke=\"url(#f39_g)\" stroke-width=\"1\" opacity=\".7\"/>\n<g transform=\"translate(0 0) scale(1 1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_g)\"/><path d=\"M12 12 l3 -6 l3 6 l-3 6z\" fill=\"#fff\" opacity=\".85\"/></g><g transform=\"translate(170 0) scale(-1 1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_g)\"/><path d=\"M12 12 l3 -6 l3 6 l-3 6z\" fill=\"#fff\" opacity=\".85\"/></g><g transform=\"translate(0 277) scale(1 -1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_g)\"/><path d=\"M12 12 l3 -6 l3 6 l-3 6z\" fill=\"#fff\" opacity=\".85\"/></g><g transform=\"translate(170 277) scale(-1 -1)\"><path d=\"M2 22 V8 Q2 2 8 2 H22 L18 6 H10 Q6 6 6 10 V18Z\" fill=\"url(#f39_g)\"/><path d=\"M12 12 l3 -6 l3 6 l-3 6z\" fill=\"#fff\" opacity=\".85\"/></g>\n<path d=\"M70 2.5 h30\" stroke=\"#fff\" stroke-width=\"2\" opacity=\".7\"/><path d=\"M80 0 l5 5 l5 -5\" fill=\"url(#f39_g)\"/></svg>"};
  const TIERS = [['silver', 'Silver', '#c8d0dc'], ['gold', 'Gold', '#ffcf5a'], ['kyber', 'Kyber', '#5ad0ff'], ['prism', 'Prism', '#ff6ad5'], ['galactic', 'Galactic', '#b8a8ff']];
  const save = () => { try { Player.save(); } catch (e) { /* storage blocked */ } };
  const unit = (id) => (Player.state && Player.state.units ? Player.state.units[id] : null);
  const wins = (id) => { const b = root.Col25 ? root.Col25.B() : null; return b && b.cw ? b.cw[id] | 0 : 0; };
  const isHolo = (id) => { const u = unit(id); return !!(u && u.holo); };
  // What each tier needs, as [done, label].
  const need = (id, t) => {
    const u = unit(id) || {};
    if (t === 'silver') return [!!u.holo, 'Unlocked'];
    if (t === 'gold') return [(u.level | 0) >= 50, (u.level | 0) >= 50 ? 'Lv 50 ✓' : `Lv ${u.level | 0} / 50`];
    if (t === 'kyber') return [(u.stars | 0) >= (D.MAX_STARS || 7), (u.stars | 0) >= (D.MAX_STARS || 7) ? '7★ ✓' : `${u.stars | 0}★ / 7★`];
    if (t === 'prism') return [wins(id) >= 100, wins(id) >= 100 ? '100 wins ✓' : `${wins(id)} / 100 wins`];
    return [!!(root.Max25 && root.Max25.done()), 'MAX OUT'];
  };
  const earned = (id) => (isHolo(id) ? TIERS.map((t) => t[0]).filter((t) => need(id, t)[0]) : []);
  // The frame a card shows: off, the one you picked, or the best one it has.
  const frameOf = (id) => {
    const u = unit(id); if (!u || !u.holo || u.hf === 'off') return null;
    const have = earned(id);
    if (u.hf && have.includes(u.hf)) return u.hf;
    // Galactic only shows when picked; by itself the foil tops out at Prism.
    const auto = have.filter((t) => t !== 'galactic');
    return auto[auto.length - 1] || null;
  };
  // Everything sits in one clipped layer over the art, so the card's own layout never changes.
  // The small HOLO tag in the card's corner, in the frame's colour (rainbow for Prism and Galactic). It never moves.
  const fxHtml = (t) => `<span class="f39-box" aria-hidden="true"><i class="f39-sheen"></i><i class="f39-glint g1"></i><i class="f39-glint g2"></i><i class="f39-glint g3"></i>${FR[t]}<b class="h25-tag h25-${t}">HOLO</b></span>`;
  // One letter per frame, for the shared profile row (other players' cards).
  const CODE = { silver: 's', gold: 'g', kyber: 'k', prism: 'p', galactic: 'x' };
  const FROM = { s: 'silver', g: 'gold', k: 'kyber', p: 'prism', x: 'galactic' };

  // ---------- Hooks used by js/ui.js and js/battle-ui.js ----------
  // cls(id): classes for the card; fx(id): the foil layers to put inside it.
  root.HoloCard = {
    cls: (id) => { const t = frameOf(id); return t ? ` foil-on f39-${t}` : ''; },
    fx: (id) => { const t = frameOf(id); return t ? fxHtml(t) : ''; },
    panel: (id) => panel(id),
    // Someone else's card, from the frame letter on their profile.
    code: (id) => { const t = frameOf(id); return t ? CODE[t] : ''; },
    clsT: (c) => (FROM[c] ? ` foil-on f39-${FROM[c]}` : ''),
    fxT: (c) => (FROM[c] ? fxHtml(FROM[c]) : ''),
  };

  // ---------- Recording holos ----------
  if (typeof Player.grantCard === 'function' && !Player.__holo25) {
    Player.__holo25 = true;
    const base = Player.grantCard;
    Player.grantCard = function (id, holo) {
      const def = D.UNIT_MAP[id]; const before = unit(id); const wasMax = !!before && (before.stars | 0) >= (D.MAX_STARS || 7);
      const r = base.call(this, id, holo);
      try {
        const u = unit(id);
        if (u && holo && !u.holo) { u.holo = 1; save(); }
        // Earned-only cards: a copy that arrives once the card is already 7★ turns it holo.
        else if (u && !holo && def && def.rarity === 'secret' && wasMax && !u.holo) {
          u.holo = 1; save();
          setTimeout(() => { if (UI.toast) UI.toast(`✦ ${def.name} turned holo!`); }, 1200);
          if (r) r.holo = true;
        }
      } catch (e) { /* the card itself is already granted */ }
      return r;
    };
  }
  // Wins with each card (for Prism).
  if (UI.hooks && UI.hooks.battleEnd && !UI.hooks.__holo25) {
    UI.hooks.__holo25 = true;
    UI.hooks.battleEnd.push((battle, params, won) => {
      try {
        if (!won || !battle || !battle.units || !root.Col25) return;
        const b = root.Col25.B(); b.cw = b.cw || {};
        const seen = new Set();
        for (const u of battle.units) if (u.side === 'player' && u.def && !seen.has(u.def.id) && Player.owns(u.def.id)) { seen.add(u.def.id); b.cw[u.def.id] = (b.cw[u.def.id] | 0) + 1; }
        save();
      } catch (e) { /* counting only */ }
    });
  }

  // ---------- The Holo panel in the card's screen ----------
  function panel(id) {
    const u = unit(id); if (!u) return '';
    if (!u.holo) {
      const def = D.UNIT_MAP[id] || {};
      const how = def.rarity === 'secret' ? 'Earned-only: once it reaches 7★, its next copy turns it holo.' : 'Pull this card as a holo from any crate to unlock its foil.';
      return `<div class="hp25" data-holo-id="${id}"><div class="row"><h4>HOLO</h4><span class="muted small">Not holo yet</span></div><small class="muted">${how}</small></div>`;
    }
    const cur = frameOf(id); const on = u.hf !== 'off';
    const show = TIERS.filter(([t]) => t !== 'galactic' || need(id, 'galactic')[0]);
    return `<div class="hp25" data-holo-id="${id}"><div class="row"><h4>HOLO</h4><span class="hp25-own">✦ HOLO OWNED</span></div>
      <div class="row"><span>Show holo</span><button type="button" class="hp25-sw${on ? ' on' : ''}" data-holo-toggle aria-pressed="${on}" aria-label="Show holo"></button></div>
      <div class="hp25-tiers" style="grid-template-columns:repeat(${show.length},1fr)">${show.map(([t, n, c]) => { const [ok, lab] = need(id, t); return `<button type="button" class="hp25-t${t === cur ? ' sel' : ''}${ok ? '' : ' lock'}" data-holo-tier="${t}" ${ok && on ? '' : 'disabled'}><i style="border-color:${c}"></i>${n}<small>${lab}</small></button>`; }).join('')}</div>
      <small class="muted">${u.hf && u.hf !== 'off' ? 'Showing the frame you picked.' : 'It shows its best frame by itself. Pick any frame you have unlocked; each card keeps its own.'}</small></div>`;
  }
  // Taps in the panel: change the card in place (no need to redraw the card screen).
  document.addEventListener('click', (e) => {
    const box = e.target.closest('.hp25'); if (!box) return;
    const id = box.dataset.holoId; const u = unit(id); if (!u || !u.holo) return;
    const tg = e.target.closest('[data-holo-toggle]');
    const ti = e.target.closest('[data-holo-tier]');
    if (tg) u.hf = u.hf === 'off' ? undefined : 'off';
    else if (ti && !ti.disabled) { const t = ti.dataset.holoTier; const auto = frameOf(id) === t && !u.hf; u.hf = auto ? undefined : t; }
    else return;
    if (u.hf === undefined) delete u.hf;
    save();
    box.outerHTML = panel(id);
    // The big card above the panel.
    const modal = e.target.closest('.modal') || document;
    const big = modal.querySelector('.bigcard'); const face = big && big.querySelector('.bigface.front');
    if (big && face) { big.className = big.className.replace(/\s?foil-on|\s?f39-[a-z]+/g, '') + root.HoloCard.cls(id); face.querySelectorAll('.f39-box').forEach((n) => n.remove()); face.insertAdjacentHTML('beforeend', root.HoloCard.fx(id)); }
  });

  const st = document.createElement('style');
  st.textContent = ".f39-frame{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}\n.f39-sheen{position:absolute;inset:-40% -120%;background:linear-gradient(115deg,transparent 38%,rgba(255,60,160,.28) 43%,rgba(255,210,60,.3) 46%,rgba(80,255,160,.3) 49%,rgba(60,190,255,.3) 52%,rgba(180,90,255,.28) 55%,transparent 60%);mix-blend-mode:color-dodge;will-change:transform;animation:f39S 4.2s ease-in-out infinite;pointer-events:none}\n.f39-gold .f39-sheen{animation-duration:3.8s}.f39-kyber .f39-sheen{background:linear-gradient(115deg,transparent 36%,rgba(90,200,255,.35) 44%,rgba(220,250,255,.45) 49%,rgba(140,120,255,.32) 54%,transparent 62%)}.f39-prism .f39-sheen{animation-duration:3.2s;background:linear-gradient(115deg,transparent 30%,rgba(255,60,160,.32) 37%,rgba(255,210,60,.34) 42%,rgba(80,255,160,.34) 47%,rgba(60,190,255,.34) 52%,rgba(180,90,255,.32) 57%,rgba(255,60,160,.3) 62%,transparent 68%)}\n@keyframes f39S{0%{transform:translateX(-30%)}55%,100%{transform:translateX(30%)}}\n.f39-glint{position:absolute;width:10px;height:10px;pointer-events:none;background:radial-gradient(circle,#fff 0 20%,transparent 60%);opacity:0;animation:f39G 3.6s ease-in-out infinite}.f39-glint::before{content:'';position:absolute;left:50%;top:-6px;bottom:-6px;width:1px;background:linear-gradient(transparent,#fff,transparent)}.f39-glint::after{content:'';position:absolute;top:50%;left:-6px;right:-6px;height:1px;background:linear-gradient(90deg,transparent,#fff,transparent)}\n.f39-glint.g1{left:18%;top:14%}.f39-glint.g2{left:72%;top:32%;animation-delay:1.2s}.f39-glint.g3{left:40%;top:62%;animation-delay:2.4s}@keyframes f39G{0%,70%,100%{opacity:0;transform:scale(.4)}80%{opacity:1;transform:scale(1)}}\n.f39-silver .f39-glint{display:none}\n@media (prefers-reduced-motion:reduce){.f39-sheen,.f39-glint{animation:none!important}}" + `
.f39-box{position:absolute;inset:0;overflow:hidden;border-radius:inherit;pointer-events:none;z-index:5;contain:paint}
.h25-tag{position:absolute;top:9px;left:9px;z-index:2;padding:2px 5px 1px;border-radius:5px;font:800 8.5px/1.1 var(--font-display,Oxanium,sans-serif);letter-spacing:.14em;color:#0a0f1a;background:#c8d0dc;box-shadow:0 1px 4px rgba(0,0,0,.45)}
.h25-gold{background:#ffcf5a}.h25-kyber{background:#5ad0ff}.h25-prism{background:linear-gradient(90deg,#ff6ad5,#ffd23f,#5aff9a,#5ad0ff,#b06aff)}.h25-galactic{background:linear-gradient(90deg,#7a5cff,#ff5ad0,#5ae8ff,#ffd8f4);}
.bigcard .h25-tag{top:10px;left:10px;font-size:11px;padding:3px 7px 2px;border-radius:6px}
.pc-fav .pt{position:relative}
.ucard.foil-on .f39-sheen,.ucard.foil-on .f39-glint{animation-play-state:paused}.ucard.foil-on:hover .f39-sheen,.ucard.foil-on:hover .f39-glint,.ucard.foil-on:focus-visible .f39-sheen{animation-play-state:running}
body.perf-on .f39-sheen,body.perf-on .f39-glint{animation:none!important}
.hp25{margin:12px auto 0;max-width:420px;background:rgba(10,16,30,.92);border:1px solid #2a3448;border-radius:14px;padding:12px;display:grid;gap:10px;color:#e8ecf3;font-size:13px;text-align:left}
.hp25 h4{margin:0;font:800 14px var(--font-display,Oxanium,sans-serif);letter-spacing:.06em}.hp25 .row{display:flex;align-items:center;justify-content:space-between;gap:10px}.hp25-own{color:#7afcff;font:800 11px var(--font-display,Oxanium,sans-serif)}
.hp25-sw{width:42px;height:24px;border-radius:12px;border:0;background:#2a3448;position:relative;cursor:pointer;padding:0}.hp25-sw.on{background:#3ab8ff}.hp25-sw::after{content:'';position:absolute;top:4px;left:4px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .2s}.hp25-sw.on::after{left:22px}
.hp25-tiers{display:grid;gap:6px}.hp25-t{border:1px solid #2a3448;border-radius:10px;padding:6px 4px;text-align:center;font:800 11px var(--font-display,Oxanium,sans-serif);display:grid;gap:3px;justify-items:center;background:#0b1020;color:#e8ecf3;cursor:pointer}
.hp25-t i{width:22px;height:30px;border-radius:4px;border:3px solid;display:block}.hp25-t small{font:500 10px sans-serif;color:#8a96a8}.hp25-t.sel{border-color:#ffd23f;box-shadow:0 0 0 1px #ffd23f inset}.hp25-t.lock{opacity:.45;cursor:default}.hp25-t.lock small{color:#ff8a6a}.hp25-t:disabled{cursor:default}`;
  document.head.appendChild(st);
  root.Holo25 = { isHolo, frameOf, earned, TIERS };
})(window);
