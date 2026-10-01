// Signature ultimates: every unit's ultimate breaks out of the battlefield
// onto the whole screen. Each one is a move (how the weapon travels), a prop
// (what travels), an impact (what happens to the cards it hits) and a colour.

(function (root) {
  const D = root.GameData;
  const B = root.BattleUI;
  const { el } = root.UI;
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // move / prop / impact / colour (+ options). Ally ultimates use ally moves.
  const SIG = {
    // Light side, ground
    rebel_soldier: { move: 'volley', prop: 'bolt', impact: 'knock', color: '#ff7a3a', n: 4 },
    clone_trooper: { move: 'aegis', color: '#5ab4ff', prop: 'laat' },
    ewok_warrior: { move: 'heal', color: '#9ad86a', prop: 'leaf' },
    han_solo: { move: 'ricochet', prop: 'bolt', impact: 'scorch', color: '#ff3a2a', n: 3, big: true },
    chewbacca: { move: 'shockwave', prop: 'roar', impact: 'knock', color: '#e0954a' },
    leia: { move: 'rally', color: '#ffd23f', prop: 'starbird' },
    r2d2: { move: 'heal', color: '#5ab4ff', prop: 'holo' },
    obi_wan: { move: 'dive', prop: 'saber', impact: 'slice', color: '#4aa8ff' },
    luke: { move: 'loop', prop: 'saber', impact: 'slice', color: '#3bff6a' },
    yoda: { move: 'shockwave', prop: 'force', impact: 'spin', color: '#8aff9a' },
    rey: { move: 'dive', prop: 'staff', impact: 'shatter', color: '#ffd23f' },
    jawa: { move: 'heal', color: '#ffb03a', prop: 'ion' },
    grogu: { move: 'heal', color: '#8aff9a', prop: 'force' },
    ahsoka: { move: 'loop', prop: 'twin', impact: 'xslash', color: '#f2f6ff' },
    din_djarin: { move: 'homing', prop: 'dart', impact: 'scorch', color: '#ffb03a', n: 5 },
    mace_windu: { move: 'dive', prop: 'saber', impact: 'xslash', color: '#b45aff' },
    c3po: { move: 'orbit', prop: 'gold', impact: 'spin', color: '#ffd23f', n: 6 },
    chopper: { move: 'heal', color: '#ff9a3a', prop: 'spark' },
    bb8: { move: 'roll', prop: 'bb8', impact: 'knock', color: '#ff9a3a' },
    k2so: { move: 'dive', prop: 'card', impact: 'crush', color: '#9aa8c0' },
    ig11: { move: 'turret', prop: 'bolt', impact: 'scorch', color: '#ff4a3a' },
    rebel_medic: { move: 'heal', color: '#52e08a', prop: 'plus' },
    two_onebee: { move: 'heal', color: '#6ad8ff', prop: 'bacta' },
    barriss: { move: 'heal', color: '#5affc8', prop: 'mote' },
    hunter: { move: 'dive', prop: 'knife', impact: 'xslash', color: '#ff8a3a' },
    wrecker: { move: 'rain', prop: 'detonator', impact: 'stamp', color: '#ff7a1a' },
    tech: { move: 'heal', color: '#5affe0', prop: 'scan' },
    crosshair: { move: 'beam', prop: 'snipe', impact: 'scorch', color: '#ff2a2a' },
    echo: { move: 'beam', prop: 'scomp', impact: 'shock', color: '#6ad8ff' },
    // Dark side, ground
    stormtrooper: { move: 'aegis', color: '#e8eef8', prop: 'trooper' },
    battle_droid: { move: 'volley', prop: 'bolt', impact: 'scorch', color: '#ff3a3a', n: 5, miss: 0.35 },
    tusken_raider: { move: 'rain', prop: 'spear', impact: 'knock', color: '#d8b07a' },
    boba_fett: { move: 'homing', prop: 'rocket', impact: 'burn', color: '#ff7a1a', n: 1 },
    tarkin: { move: 'beam', prop: 'orbital', impact: 'burn', color: '#3bff6a', sky: true },
    darth_maul: { move: 'dive', prop: 'staff', impact: 'slice', color: '#ff2a2a' },
    kylo_ren: { move: 'pull', prop: 'grip', impact: 'freeze', color: '#ff3a3a' },
    count_dooku: { move: 'arc', prop: 'arc', impact: 'shock', color: '#bfe6ff' },
    vader: { move: 'pull', prop: 'grip', impact: 'crush', color: '#ff2a2a' },
    palpatine: { move: 'storm', prop: 'arc', impact: 'shock', color: '#b48aff' },
    death_trooper: { move: 'beam', prop: 'snipe', impact: 'stamp', color: '#3bff6a' },
    grievous: { move: 'orbit', prop: 'saber', impact: 'xslash', color: '#46e070', n: 4, multi: ['#3d8bff', '#46e070', '#3d8bff', '#46e070'] },
    thrawn: { move: 'beam', prop: 'orbital', impact: 'stamp', color: '#5ab4ff', sky: true, n: 2 },
    b2_droid: { move: 'homing', prop: 'rocket', impact: 'stamp', color: '#ff9a3a', n: 2 },
    droideka: { move: 'turret', prop: 'bolt', impact: 'stamp', color: '#ff3a3a', shield: true },
    magnaguard: { move: 'dive', prop: 'electrostaff', impact: 'shock', color: '#c88aff' },
    ig88: { move: 'ricochet', prop: 'bolt', impact: 'stamp', color: '#ff2a2a', n: 2 },
    nightsister_acolyte: { move: 'heal', color: '#5aff8a', prop: 'mist' },
    talzin: { move: 'arc', prop: 'arc', impact: 'burn', color: '#5aff6a' },
    grand_inquisitor: { legacy: 'saberstorm' },
    second_sister: { move: 'loop', prop: 'spinner', impact: 'slice', color: '#ff2a2a' },
    fifth_brother: { move: 'dive', prop: 'spinner', impact: 'crush', color: '#ff2a2a', quake: true },
    seventh_sister: { move: 'orbit', prop: 'probe', impact: 'shock', color: '#ff3a3a', n: 5 },
    eighth_brother: { move: 'sweep', prop: 'spinner', impact: 'xslash', color: '#ff2a2a' },
    // Wave 6
    anakin: { move: 'dive', prop: 'saber', impact: 'burn', color: '#4aa8ff' },
    qui_gon: { move: 'shockwave', prop: 'force', impact: 'knock', color: '#46e070' },
    padme: { move: 'ricochet', prop: 'bolt', impact: 'spin', color: '#ff8ad0', n: 3 },
    lando: { move: 'rally', color: '#5ab4ff', prop: 'cape' },
    jango_fett: { move: 'ricochet', prop: 'bolt', impact: 'knock', color: '#ff5a3a', n: 2, big: true },
    asajj_ventress: { move: 'loop', prop: 'twin', impact: 'slice', color: '#ff2a2a' },
    cad_bane: { move: 'beam', prop: 'snipe', impact: 'burn', color: '#ff7a3a' },
    moff_gideon: { move: 'beam', prop: 'orbital', impact: 'shatter', color: '#e8eef8', sky: true },
    n1_starfighter: { move: 'flyby', prop: 'ship', impact: 'slice', color: '#ffd23f', roll: true },
    sith_infiltrator: { move: 'carpet', prop: 'probe', impact: 'shock', color: '#ff2a2a' },
    // Mythic: one-of-a-kind cinematics
    darth_revan: { move: 'mask', prop: 'mask', impact: 'xslash', color: '#c23bff' },
    starkiller: { move: 'unleash', prop: 'isd', impact: 'crush', color: '#7ac8ff' },
    master_luke: { move: 'suns', prop: 'projection', color: '#ffd27a' },
    ghost: { move: 'phantom', prop: 'ship', impact: 'stamp', color: '#ff8a3a' },
    // Ships
    a_wing: { move: 'flyby', prop: 'ship', impact: 'knock', color: '#ff5a3a', fast: true },
    y_wing: { move: 'aegis', color: '#8fd3ff', prop: 'ion' },
    x_wing: { move: 'flyby', prop: 'ship', impact: 'stamp', color: '#ff7a3a', torpedo: true },
    b_wing: { move: 'flyby', prop: 'ship', impact: 'crush', color: '#ff5a3a', roll: true },
    falcon: { move: 'flyby', prop: 'ship', impact: 'spin', color: '#ff5a3a', roll: true, n: 2 },
    z95: { move: 'flyby', prop: 'ship', impact: 'lift', color: '#ffb03a' },
    tie_fighter: { move: 'flyby', prop: 'ship', impact: 'scorch', color: '#3bff6a', wing: 2 },
    tie_bomber: { move: 'carpet', prop: 'bomb', impact: 'stamp', color: '#ff9a3a' },
    lambda_shuttle: { move: 'aegis', color: '#e8eef8', prop: 'deflector' },
    slave_one: { move: 'carpet', prop: 'seismic', impact: 'shatter', color: '#6ad8ff' },
    tie_advanced: { move: 'flyby', prop: 'ship', impact: 'xslash', color: '#3bff6a', lock: true },
    razor_crest: { move: 'flyby', prop: 'ship', impact: 'freeze', color: '#ffb03a', rail: true },
    tie_interceptor: { move: 'flyby', prop: 'ship', impact: 'shatter', color: '#3bff6a', fast: true, n: 2 },
    vulture_droid: { move: 'flyby', prop: 'ship', impact: 'burn', color: '#ff9a3a', wing: 3 },
  };

  // ---------- Props ----------
  function propEl(kind, color, actor, i) {
    const c = color;
    const svg = (inner, vb = '0 0 100 100') => `<svg viewBox="${vb}" width="100%" height="100%" aria-hidden="true">${inner}</svg>`;
    const make = (cls, size, inner, extra = '') => el(`<div class="sp-prop ${cls}" style="--c:${c};width:${size}px;height:${size}px;${extra}">${inner || ''}</div>`);
    switch (kind) {
      case 'saber': return make('sp-saber spin', 120, '<i></i><b></b>', i != null ? `--c:${i}` : '');
      case 'staff': return make('sp-staff spin', 140, '<i></i><i></i><b></b>');
      case 'twin': return make('sp-twin spin', 110, '<i></i><i></i><b></b><b></b>');
      case 'spinner': return el(`<div class="sp-prop spin-saber storm" style="width:130px;height:130px"><div class="ss-ring"><i></i><i></i><b></b></div></div>`);
      case 'knife': return make('sp-knife spin', 60, '<i></i>');
      case 'electrostaff': return make('sp-estaff spin', 140, '<i></i><b></b>');
      case 'bolt': return make('sp-bolt heading', 46, '<i></i>');
      case 'rocket': return make('sp-rocket heading', 58, svg(`<path d="M50 6 L60 26 L60 70 L40 70 L40 26Z" fill="#c8ccd2"/><path d="M40 60 L28 78 L40 72Z M60 60 L72 78 L60 72Z" fill="#8a3a2a"/><path d="M42 72 L50 98 L58 72Z" fill="#ffb03a"/><path d="M46 72 L50 88 L54 72Z" fill="#fff4c0"/><rect x="40" y="30" width="20" height="5" fill="#b8322a"/>`));
      case 'dart': return make('sp-rocket heading', 22, svg('<path d="M50 6 L58 30 L58 70 L42 70 L42 30Z" fill="#d8dce2"/><path d="M44 72 L50 98 L56 72Z" fill="#ffb03a"/>'));
      case 'detonator': return make('sp-det spin-slow', 34, svg('<circle cx="50" cy="50" r="40" fill="#9aa0aa"/><circle cx="50" cy="50" r="40" fill="none" stroke="#5a5f68" stroke-width="5"/><rect x="18" y="44" width="64" height="12" fill="#5a5f68"/><circle cx="34" cy="50" r="5" fill="#ff3a2a"/><circle cx="50" cy="50" r="5" fill="#ffd23f"/><circle cx="66" cy="50" r="5" fill="#ff3a2a"/>'));
      case 'spear': return make('sp-spear heading', 90, svg('<rect x="47" y="4" width="6" height="92" rx="3" fill="#8a6a40"/><path d="M50 0 L58 16 L50 22 L42 16Z" fill="#c8ccd2"/><rect x="45" y="60" width="10" height="8" fill="#5a3a20"/>'));
      case 'bomb': return make('sp-bomb', 30, svg('<ellipse cx="50" cy="50" rx="26" ry="40" fill="#2a2d33"/><rect x="40" y="6" width="20" height="10" fill="#5a5f68"/><circle cx="50" cy="56" r="7" fill="#ff5a3a"/>'));
      case 'seismic': return make('sp-seismic', 40, svg('<circle cx="50" cy="50" r="34" fill="#1a2028"/><circle cx="50" cy="50" r="22" fill="#6ad8ff"/><circle cx="50" cy="50" r="10" fill="#fff"/>'));
      case 'probe': return make('sp-probe', 44, svg(`${[-55, -25, 25, 55, 155, 205].map((a) => { const r = (a * Math.PI) / 180; return `<path d="M50 50 L${50 + Math.cos(r) * 32} ${50 + Math.sin(r) * 32 - 10} L${50 + Math.cos(r) * 46} ${50 + Math.sin(r) * 44 + 16}" stroke="#9aa0aa" stroke-width="3" fill="none"/>`; }).join('')}<ellipse cx="50" cy="50" rx="20" ry="17" fill="#1e2126"/><circle cx="50" cy="53" r="8" fill="#ff2a2a"/>`));
      case 'gold': return make('sp-gold spin-slow', 34, svg('<circle cx="50" cy="50" r="40" fill="#e8c14a"/><circle cx="50" cy="50" r="26" fill="#b8902a"/><circle cx="40" cy="44" r="7" fill="#fff6c0"/><circle cx="60" cy="44" r="7" fill="#fff6c0"/>'));
      case 'bb8': return make('sp-bb8 spin-slow', 70, svg('<circle cx="50" cy="50" r="46" fill="#f4f1ea"/><circle cx="50" cy="50" r="20" fill="none" stroke="#ff8a1a" stroke-width="8"/><circle cx="50" cy="50" r="8" fill="#c8ccd2"/><path d="M8 50 A42 42 0 0 1 30 14" stroke="#ff8a1a" stroke-width="8" fill="none"/><path d="M92 50 A42 42 0 0 1 70 86" stroke="#ff8a1a" stroke-width="8" fill="none"/>'));
      case 'card': {
        const card = B.cards[actor.uid];
        const r = card.getBoundingClientRect();
        const n = card.cloneNode(true);
        n.classList.add('sp-card');
        n.style.cssText = `position:absolute;left:0;top:0;width:${r.width}px;height:${r.height}px;margin:0;--c:${c}`;
        return n;
      }
      case 'ship': {
        const size = Math.min(window.innerWidth, window.innerHeight) * 0.3;
        return el(`<div class="sp-prop sp-ship heading" style="--c:${c};width:${size}px;height:${size}px">${root.Art.shipOnly(actor.def)}</div>`);
      }
      default: return make('sp-orb', 26, '');
    }
  }

  // Catmull-Rom path follower in viewport space.
  function follow(S, node, route, o = {}) {
    const cum = [0];
    for (let i = 1; i < route.length; i++) cum.push(cum[i - 1] + Math.hypot(route[i].x - route[i - 1].x, route[i].y - route[i - 1].y));
    const total = Math.max(1, cum[cum.length - 1]);
    // Short paths (single targets) still get a readable minimum flight time.
    const pxPerMs = Math.min((o.speed || 1.9) * S.speed, total / ((o.minMs || 0) / S.speed || 1));
    const cr = (p0, p1, p2, p3, u) => 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);
    const at = (d) => {
      let i = 1;
      while (i < cum.length - 1 && cum[i] < d) i++;
      const u = (d - cum[i - 1]) / Math.max(1, cum[i] - cum[i - 1]);
      const p0 = route[Math.max(0, i - 2)];
      const p1 = route[i - 1];
      const p2 = route[i];
      const p3 = route[Math.min(route.length - 1, i + 1)];
      return { x: cr(p0.x, p1.x, p2.x, p3.x, u), y: cr(p0.y, p1.y, p2.y, p3.y, u) };
    };
    const reached = new Set();
    let prev = route[0];
    const t0 = performance.now() + (o.delay || 0);
    S.layer.appendChild(node);
    node.style.opacity = o.delay ? '0' : '';
    return new Promise((resolve) => {
      const step = (now) => {
        if (!node.isConnected) return resolve();
        if (now < t0) return requestAnimationFrame(step);
        node.style.opacity = '';
        const d = Math.min(total, (now - t0) * pxPerMs);
        const p = at(d);
        const ang = (Math.atan2(p.y - prev.y, p.x - prev.x) * 180) / Math.PI;
        const rot = node.classList.contains('heading') && (p.x !== prev.x || p.y !== prev.y) ? ` rotate(${ang + 90}deg)` : '';
        node.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)${rot}${o.scale ? ` scale(${o.scale})` : ''}`;
        if (o.trail !== false) S.trail(prev, p, o.trail || S.color, o.trailWidth || 1);
        prev = p;
        route.forEach((r, i) => {
          if (i === 0 || reached.has(i) || d < cum[i] - 2) return;
          reached.add(i);
          if (o.onNode) o.onNode(r, i);
        });
        if (d >= total) {
          if (o.keep !== true) node.remove();
          return resolve();
        }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  Object.assign(B, {
    SIG,

    // A full-viewport stage with a fading trail canvas.
    sigStage(color, tint) {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const layer = el(`<div class="storm-layer sig-layer" style="--c:${color}" aria-hidden="true"><div class="sig-tint ${tint || ''}"></div><canvas></canvas></div>`);
      document.body.appendChild(layer);
      const cv = layer.querySelector('canvas');
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      cv.width = W * dpr;
      cv.height = H * dpr;
      const ctx = cv.getContext('2d');
      ctx.scale(dpr, dpr);
      let alive = true;
      const fade = () => {
        if (!alive) return;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,0.14)';
        ctx.fillRect(0, 0, W, H);
        requestAnimationFrame(fade);
      };
      fade();
      const S = {
        layer, ctx, W, H, color, speed: Math.min(this.speed, 2),
        trail(a, b, col, w = 1) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.lineCap = 'round';
          for (const [lw, al] of [[18 * w, 0.16], [7 * w, 0.55], [2.4 * w, 0.95]]) {
            ctx.strokeStyle = al > 0.9 ? 'rgba(255,255,255,0.9)' : hexA(col, al);
            ctx.lineWidth = lw;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        },
        end: () => new Promise((r) => {
          alive = false;
          layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, fill: 'forwards' }).onfinish = () => { layer.remove(); r(); };
        }),
      };
      return S;
    },

    toField(p) {
      const fr = this.field.getBoundingClientRect();
      return { x: p.x - fr.left, y: p.y - fr.top };
    },

    async sig(actor, targets, ev) {
      const spec = SIG[actor.id];
      const ally = ev && ev.offensive === false;
      const move = ally && !['heal', 'aegis', 'rally', 'suns'].includes(spec.move) ? 'rally' : spec.move;
      const S = this.sigStage(spec.color, move);
      const from = this.vp(actor.uid);
      const T = targets.filter((t) => this.cards[t.uid]).map((t) => ({ uid: t.uid, ...this.vp(t.uid) }));
      const hit = (t) => this.sigImpact(spec.impact, t.uid, spec.color, S);
      try {
        await this['mv_' + move](S, actor, from, T, spec, hit);
      } finally {
        await S.end();
      }
    },

    // ---------- Moves ----------
    // Thrown blade: loops the whole screen, carves every target, returns.
    async mv_loop(S, actor, from, T, spec, hit) {
      if (root.Sound) root.Sound.play('ignite');
      const { W, H } = S;
      const loop = [[0.88, 0.12], [0.94, 0.55], [0.62, 0.92], [0.1, 0.82], [0.06, 0.28], [0.42, 0.06]].map(([x, y]) => ({ x: x * W, y: y * H }));
      const route = [from, ...loop, ...T, { ...from }];
      await follow(S, propEl(spec.prop, spec.color, actor), route, { speed: 2.1, minMs: 1400, onNode: (r) => r.uid && hit(r) });
      this.env.flash(spec.color, 0.2);
    },

    // The unit's own card leaves the field and slams into each target.
    async mv_dive(S, actor, from, T, spec, hit) {
      const card = this.cards[actor.uid];
      const node = spec.prop === 'card' ? propEl('card', spec.color, actor) : null;
      const blade = spec.prop !== 'card' ? propEl(spec.prop, spec.color, actor) : null;
      const flyer = node || el(`<div class="sp-carrier" style="--c:${spec.color}"></div>`);
      if (node) card.style.visibility = 'hidden';
      const route = [from, { x: from.x, y: from.y - S.H * 0.35 }];
      T.forEach((t) => { route.push({ x: t.x, y: t.y - 90 }); route.push({ ...t }); });
      route.push({ x: from.x, y: from.y - S.H * 0.2 }, { ...from });
      if (blade) {
        flyer.appendChild(blade);
        blade.style.cssText += ';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)';
      }
      await follow(S, flyer, route, {
        speed: 2.3, minMs: 1300,
        scale: node ? 1.15 : 1,
        onNode: (r) => {
          if (!r.uid) return;
          hit(r);
          if (spec.quake) { this.env.blast(this.toField(r).x, this.toField(r).y + 20, spec.color, 1.6); this.shake(); }
        },
      });
      card.style.visibility = '';
    },

    // Straight volleys from the shooter's side of the screen.
    async mv_volley(S, actor, from, T, spec, hit) {
      const n = spec.n || 3;
      const enemySide = actor.side === 'enemy';
      const shots = [];
      T.forEach((t, ti) => {
        for (let k = 0; k < n; k++) {
          const miss = spec.miss && Math.random() < spec.miss;
          const sx = rand(0, S.W);
          const sy = enemySide ? -30 : S.H + 30;
          const tx = t.x + (miss ? rand(-140, 140) : rand(-18, 18));
          const ty = t.y + (miss ? rand(-90, 90) : rand(-20, 20));
          const end = miss ? { x: tx + (tx - sx) * 0.6, y: ty + (ty - sy) * 0.6 } : { x: tx, y: ty, uid: t.uid };
          shots.push(follow(S, propEl('bolt', spec.color, actor), [{ x: sx, y: sy }, end], {
            speed: 3.2, delay: (ti * n + k) * 70, trailWidth: 0.6,
            onNode: (r) => { if (r.uid) { if (k === 0) hit(r); else this.sigScorch(r, spec.color); } },
          }));
        }
      });
      await Promise.all(shots);
    },

    // Bolts that bank off the screen edges before finding their target.
    async mv_ricochet(S, actor, from, T, spec, hit) {
      const edge = () => pick([{ x: rand(0.1, 0.9) * S.W, y: 6 }, { x: S.W - 6, y: rand(0.1, 0.9) * S.H }, { x: rand(0.1, 0.9) * S.W, y: S.H - 6 }, { x: 6, y: rand(0.1, 0.9) * S.H }]);
      const shots = [];
      T.forEach((t, ti) => {
        for (let k = 0; k < (spec.n || 2); k++) {
          const route = [from, edge(), edge(), { ...t, x: t.x + rand(-14, 14), y: t.y + rand(-14, 14) }];
          const b = propEl('bolt', spec.color, actor);
          if (spec.big) b.classList.add('big');
          shots.push(follow(S, b, route, {
            speed: 3, delay: ti * 160 + k * 110, trailWidth: spec.big ? 1 : 0.7,
            onNode: (r, i) => {
              if (r.uid) { if (k === 0) hit(r); else this.sigScorch(r, spec.color); } else if (i > 0) this.sigSpark(r, spec.color);
            },
          }));
        }
      });
      await Promise.all(shots);
    },

    // Things fall out of the sky onto every target.
    async mv_rain(S, actor, from, T, spec, hit) {
      const drops = T.map((t, i) => follow(S, propEl(spec.prop, spec.color, actor), [{ x: t.x + rand(-160, 160), y: -80 }, { x: t.x + rand(-40, 40), y: t.y - S.H * 0.25 }, { ...t }], {
        speed: 1.9, delay: i * 140, trail: spec.prop === 'detonator' ? '#ffb03a' : '#c8a070', trailWidth: 0.5,
        onNode: (r) => r.uid && hit(r),
      }));
      await Promise.all(drops);
    },

    // Missiles launch skyward, then curve down onto their targets.
    async mv_homing(S, actor, from, T, spec, hit) {
      const shots = [];
      T.forEach((t, ti) => {
        for (let k = 0; k < (spec.n || 1); k++) {
          const apex = { x: from.x + rand(-S.W * 0.35, S.W * 0.35), y: rand(S.H * 0.04, S.H * 0.22) };
          const mid = { x: (apex.x + t.x) / 2 + rand(-80, 80), y: apex.y + rand(20, 80) };
          shots.push(follow(S, propEl(spec.prop, spec.color, actor), [from, apex, mid, { ...t, x: t.x + rand(-10, 10) }], {
            speed: spec.prop === 'dart' ? 1.6 : 1.15, delay: ti * 120 + k * 70, trail: '#b8b0a4', trailWidth: spec.prop === 'dart' ? 0.4 : 1.1,
            onNode: (r) => { if (r.uid) { if (k === 0) hit(r); else this.sigScorch(r, spec.color); } },
          }));
        }
      });
      await Promise.all(shots);
    },

    // Rolling droid: bounces along the bottom and launches into each target.
    async mv_roll(S, actor, from, T, spec, hit) {
      const route = [{ x: -60, y: S.H - 50 }];
      T.slice().sort((a, b) => a.x - b.x).forEach((t) => { route.push({ x: t.x - 60, y: S.H - 40 }); route.push({ ...t }); route.push({ x: t.x + 60, y: S.H - 40 }); });
      route.push({ x: S.W + 80, y: S.H - 50 });
      await follow(S, propEl('bb8', spec.color, actor), route, { speed: 1.8, trail: '#ff9a3a', trailWidth: 0.5, onNode: (r) => r.uid && hit(r) });
    },

    // Rotating radial fire from the unit itself.
    async mv_turret(S, actor, from, T, spec, hit) {
      const dur = 1100 / S.speed;
      const t0 = performance.now();
      if (spec.shield) {
        const dome = el(`<div class="sig-dome" style="left:${from.x}px;top:${from.y}px;--c:#ff8a5a"></div>`);
        S.layer.appendChild(dome);
      }
      const order = T.slice();
      const shots = [];
      let fired = 0;
      await new Promise((resolve) => {
        const step = (now) => {
          const k = (now - t0) / dur;
          if (Math.random() < 0.9) {
            const a = k * TAU * 2 + rand(-0.2, 0.2);
            const end = { x: from.x + Math.cos(a) * S.W, y: from.y + Math.sin(a) * S.W };
            shots.push(follow(S, propEl('bolt', spec.color, actor), [from, end], { speed: 3.4, trailWidth: 0.4 }));
          }
          while (fired < order.length && k > (fired + 1) / (order.length + 1)) {
            const t = order[fired++];
            shots.push(follow(S, propEl('bolt', spec.color, actor), [from, { ...t }], { speed: 3.4, trailWidth: 0.8, onNode: (r) => r.uid && hit(r) }));
          }
          if (k < 1) requestAnimationFrame(step); else resolve();
        };
        requestAnimationFrame(step);
      });
      await Promise.all(shots);
    },

    // Props swarm around the unit, then peel off to strike.
    async mv_orbit(S, actor, from, T, spec, hit) {
      const n = Math.max(spec.n || 4, T.length);
      const R = 90;
      const shots = Array.from({ length: n }, (_, i) => {
        const a0 = (i / n) * TAU;
        const ring = [0, 1, 2, 3].map((k) => ({ x: from.x + Math.cos(a0 + k * 1.6) * R, y: from.y - 60 + Math.sin(a0 + k * 1.6) * R * 0.6 }));
        const t = T[i % Math.max(1, T.length)];
        const color = spec.multi ? spec.multi[i % spec.multi.length] : spec.color;
        const node = propEl(spec.prop, color, actor);
        if (spec.multi) node.style.setProperty('--c', color);
        return follow(S, node, [from, ...ring, ...(t ? [{ ...t, first: i < T.length }] : [])], {
          speed: 1.6, delay: i * 60, trail: color, trailWidth: 0.5,
          onNode: (r) => { if (r.uid) { if (r.first) hit(r); else this.sigSpark(r, color); } },
        });
      });
      await Promise.all(shots);
    },

    // Beams: a sniper line from the shooter, or orbital strikes from the sky.
    async mv_beam(S, actor, from, T, spec, hit) {
      const reps = spec.n || 1;
      for (const t of T) {
        for (let k = 0; k < reps; k++) {
          const src = spec.sky ? { x: t.x + rand(-60, 60), y: -20 } : from;
          if (spec.prop === 'snipe') await this.sigReticle(S, t, spec.color);
          await this.sigBeam(S, src, t, spec.color, spec.sky ? 22 : 7, spec.sky ? 420 : 240);
          if (k === 0) hit(t); else this.sigScorch(t, spec.color);
        }
      }
    },

    // Jagged Force lightning that chains through every target.
    async mv_arc(S, actor, from, T, spec, hit) {
      if (root.Sound) root.Sound.play('lightning');
      const dur = 1000 / S.speed;
      const t0 = performance.now();
      T.forEach((t, i) => setTimeout(() => hit(t), (i * 160 + 120) / S.speed));
      await new Promise((resolve) => {
        const step = (now) => {
          const k = (now - t0) / dur;
          const lit = T.filter((_, i) => k > (i * 160) / 1000);
          let prev = from;
          for (const t of lit) {
            this.sigBolt(S, prev, t, spec.color);
            this.sigBolt(S, from, t, spec.color, 0.5);
            prev = t;
          }
          if (k < 1) requestAnimationFrame(step); else resolve();
        };
        requestAnimationFrame(step);
      });
    },

    // Lightning from the actor and from the sky at once.
    async mv_storm(S, actor, from, T, spec, hit) {
      if (root.Sound) { root.Sound.play('lightning'); setTimeout(() => root.Sound.play('lightning'), 600); }
      S.layer.classList.add('sig-storm');
      const dur = 1400 / S.speed;
      const t0 = performance.now();
      T.forEach((t, i) => setTimeout(() => hit(t), (i * 140 + 160) / S.speed));
      await new Promise((resolve) => {
        const step = (now) => {
          const k = (now - t0) / dur;
          for (const t of T) {
            this.sigBolt(S, from, t, spec.color);
            if (Math.random() < 0.35) this.sigBolt(S, { x: t.x + rand(-200, 200), y: -10 }, t, spec.color, 0.7);
          }
          if (Math.random() < 0.08) this.env.flash(spec.color, 0.25);
          if (k < 1) requestAnimationFrame(step); else resolve();
        };
        requestAnimationFrame(step);
      });
    },

    // A ring that expands past the edges of the screen.
    async mv_shockwave(S, actor, from, T, spec, hit) {
      if (root.Sound) root.Sound.play('whoosh');
      const maxR = Math.hypot(S.W, S.H);
      const dur = 900 / S.speed;
      for (let k = 0; k < (spec.prop === 'roar' ? 3 : 2); k++) {
        const ring = el(`<div class="sig-ring ${spec.prop}" style="left:${from.x}px;top:${from.y}px;--c:${spec.color}"></div>`);
        S.layer.appendChild(ring);
        ring.animate([{ width: '0px', height: '0px', opacity: 1 }, { width: `${maxR * 2}px`, height: `${maxR * 2}px`, opacity: 0 }], { duration: dur, delay: k * 140, easing: 'cubic-bezier(.2,.7,.4,1)', fill: 'both' }).onfinish = () => ring.remove();
      }
      this.env.push(this.toField(from).x, this.toField(from).y, 6);
      T.forEach((t) => {
        const d = Math.hypot(t.x - from.x, t.y - from.y);
        setTimeout(() => hit(t), (d / maxR) * dur * 0.6);
      });
      await this.wait(dur * 0.85);
    },

    // Choke / Force grip: targets rise and struggle, then the impact lands.
    async mv_pull(S, actor, from, T, spec, hit) {
      const hand = el(`<div class="sig-grip" style="left:${from.x}px;top:${from.y}px;--c:${spec.color}"></div>`);
      S.layer.appendChild(hand);
      const lifts = T.map((t) => {
        const card = this.cards[t.uid];
        const aura = el(`<div class="sig-aura" style="left:${t.x}px;top:${t.y}px;--c:${spec.color}"></div>`);
        S.layer.appendChild(aura);
        return card.animate([
          { transform: 'translateY(0)' },
          { transform: 'translateY(-34px) rotate(-2deg)', offset: 0.3 },
          { transform: 'translateY(-40px) rotate(2deg)', offset: 0.45 },
          { transform: 'translateY(-38px) rotate(-3deg)', offset: 0.6 },
          { transform: 'translateY(-44px) rotate(3deg)', offset: 0.75 },
          { transform: 'translateY(0)' },
        ], { duration: 1300 / S.speed, easing: 'ease-in-out' }).finished;
      });
      await this.wait(1000);
      T.forEach((t) => hit(t));
      await Promise.all(lifts).catch(() => {});
    },

    // Starfighter strafing run across the whole screen.
    async mv_flyby(S, actor, from, T, spec, hit) {
      if (root.Sound) root.Sound.play('whoosh');
      const passes = spec.n || 1;
      for (let pass = 0; pass < passes; pass++) {
        const ltr = pass % 2 === 0 ? actor.side === 'player' : actor.side !== 'player';
        const sorted = T.slice().sort((a, b) => (ltr ? a.x - b.x : b.x - a.x));
        const y0 = sorted.length ? sorted[0].y : S.H / 2;
        const route = [{ x: ltr ? -S.W * 0.2 : S.W * 1.2, y: y0 + S.H * 0.35 }];
        sorted.forEach((t) => route.push({ x: t.x, y: t.y - S.H * 0.18, target: t }));
        route.push({ x: ltr ? S.W * 1.25 : -S.W * 0.25, y: S.H * 0.05 });
        const ships = [];
        const wings = spec.wing || 1;
        for (let w = 0; w < wings; w++) {
          const off = (w - (wings - 1) / 2) * 90;
          const r = route.map((p) => ({ ...p, x: p.x - off * 0.6, y: p.y + Math.abs(off) * 0.5 }));
          const node = propEl('ship', spec.color, actor);
          if (spec.roll) node.classList.add('roll');
          ships.push(follow(S, node, r, {
            speed: spec.fast ? 2.6 : 2, minMs: 1000, delay: w * 120, trail: spec.color, trailWidth: 0.5,
            onNode: (p) => {
              if (!p.target) return;
              const t = p.target;
              if (spec.lock) this.sigReticle(S, t, spec.color);
              if (spec.rail) this.sigBeam(S, p, t, '#ffd27a', 6, 200);
              else if (spec.torpedo) follow(S, el('<div class="sp-prop sp-torp" style="--c:#7ac8ff;width:26px;height:26px"></div>'), [p, t], { speed: 2.4, trail: '#7ac8ff' });
              else for (let k = 0; k < 3; k++) follow(S, propEl('bolt', spec.color, actor), [{ x: p.x + rand(-20, 20), y: p.y }, { x: t.x + rand(-20, 20), y: t.y + rand(-16, 16) }], { speed: 3.6, delay: k * 50, trailWidth: 0.5 });
              setTimeout(() => { if (w === 0) hit(t); }, (spec.torpedo ? 280 : 140) / S.speed);
            },
          }));
        }
        await Promise.all(ships);
      }
      await this.wait(260);
    },

    // Bomber crosses overhead dropping a string of bombs.
    async mv_carpet(S, actor, from, T, spec, hit) {
      const ltr = actor.side === 'player';
      const y = S.H * 0.12;
      const node = propEl('ship', spec.color, actor);
      const route = [{ x: ltr ? -S.W * 0.2 : S.W * 1.2, y }];
      T.slice().sort((a, b) => (ltr ? a.x - b.x : b.x - a.x)).forEach((t) => route.push({ x: t.x, y, target: t }));
      route.push({ x: ltr ? S.W * 1.2 : -S.W * 0.2, y });
      const drops = [];
      await follow(S, node, route, {
        speed: 1.7, trail: false,
        onNode: (p) => {
          if (!p.target) return;
          const t = p.target;
          drops.push(follow(S, propEl(spec.prop, spec.color, actor), [{ x: p.x, y: p.y + 20 }, { ...t }], {
            speed: 1.5, trail: spec.prop === 'seismic' ? '#6ad8ff' : false, trailWidth: 0.4,
            onNode: (r) => {
              if (!r.uid) return;
              if (spec.prop === 'seismic') this.sigSeismic(S, r, spec.color);
              hit(r);
            },
          }));
        },
      });
      await Promise.all(drops);
      await this.wait(300);
    },

    // A disc-shaped spinner rides a horizontal sweep through every target.
    async mv_sweep(S, actor, from, T, spec, hit) {
      const ltr = actor.side === 'player';
      const sorted = T.slice().sort((a, b) => (ltr ? a.x - b.x : b.x - a.x));
      const route = [from, { x: ltr ? -60 : S.W + 60, y: S.H * 0.15 }, ...sorted, { x: ltr ? S.W + 80 : -80, y: S.H * 0.3 }, { x: S.W / 2, y: -60 }, { ...from }];
      await follow(S, propEl(spec.prop, spec.color, actor), route, { speed: 2.2, minMs: 1300, onNode: (r) => r.uid && hit(r) });
    },

    // ---------- Mythic moves ----------
    // Revan: the mask fills the sky, then twin blades cross the whole screen.
    async mv_mask(S, actor, from, T, spec, hit) {
      const mask = el(`<div class="sig-mask"><svg viewBox="0 0 100 100"><path d="M24 30 C24 18 36 12 50 12 C64 12 76 18 76 30 L76 66 C76 80 64 90 50 92 C36 90 24 80 24 66Z" fill="#9aa0aa"/><path d="M24 40 H76 V52 H24Z" fill="#14090c"/><rect x="32" y="43" width="14" height="5" rx="2" fill="#ff3a3a"/><rect x="54" y="43" width="14" height="5" rx="2" fill="#ff3a3a"/><path d="M50 12 V40 M50 52 V92" stroke="#4a4f58" stroke-width="1.5"/></svg></div>`);
      S.layer.appendChild(mask);
      mask.animate([{ opacity: 0, transform: 'translate(-50%,-50%) scale(1.6)' }, { opacity: 0.5, transform: 'translate(-50%,-50%) scale(1)', offset: 0.4 }, { opacity: 0.35, transform: 'translate(-50%,-50%) scale(.95)', offset: 0.8 }, { opacity: 0, transform: 'translate(-50%,-50%) scale(.9)' }], { duration: 2000 / S.speed, fill: 'forwards' });
      await this.wait(700);
      const corners = [[{ x: -80, y: -80 }, { x: S.W + 80, y: S.H + 80 }, '#ff2a2a'], [{ x: S.W + 80, y: -80 }, { x: -80, y: S.H + 80 }, '#c23bff']];
      await Promise.all(corners.map(([a, b, col], k) => {
        const route = [a, ...T.slice().sort((p, q) => (k ? q.x - p.x : p.x - q.x)).map((t) => ({ ...t })), b];
        const blade = propEl('saber', col, actor);
        blade.style.setProperty('--c', col);
        return follow(S, blade, route, { speed: 2.4, delay: k * 220, minMs: 900, trail: col, onNode: (r) => { if (r.uid) { if (k) hit(r); else this.cutCard(r.uid, S.layer, col); } } });
      }));
    },

    // Starkiller: drags a Star Destroyer out of the sky onto the enemy line.
    async mv_unleash(S, actor, from, T, spec, hit) {
      S.layer.classList.add('sig-quake');
      const cx = T.reduce((a, t) => a + t.x, 0) / Math.max(1, T.length);
      const cy = T.reduce((a, t) => a + t.y, 0) / Math.max(1, T.length);
      const dur = 1700 / S.speed;
      const t0 = performance.now();
      const ship = el(`<div class="sp-prop sig-isd">${root.Art.shipOnly({ shape: 'isd' })}</div>`);
      S.layer.appendChild(ship);
      const size = S.W * 0.55;
      ship.style.width = ship.style.height = size + 'px';
      await new Promise((resolve) => {
        const step = (now) => {
          const k = Math.min(1, (now - t0) / dur);
          // Lightning from his hands to the falling hull.
          const e = k * k * k;
          const sx = cx + (1 - e) * S.W * 0.25;
          const sy = -size * 0.6 + (cy + size * 0.6) * e;
          ship.style.transform = `translate(${sx}px, ${sy}px) translate(-50%,-50%) rotate(${200 - e * 30}deg) scale(${1.2 - e * 0.5})`;
          if (k < 0.9) this.sigBolt(S, from, { x: sx, y: sy }, spec.color, 0.9);
          if (Math.random() < 0.3) this.sigBolt(S, from, { x: sx + rand(-80, 80), y: sy + rand(-40, 40) }, spec.color, 0.5);
          if (k < 1) requestAnimationFrame(step); else resolve();
        };
        requestAnimationFrame(step);
      });
      ship.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
      this.env.flash('#ffd27a', 0.7);
      const f = this.toField({ x: cx, y: cy });
      this.boom(f, '#ff8a2a', 2.6);
      T.forEach((t) => hit(t));
      await this.wait(500);
    },

    // Master Luke: twin suns rise and his Force projection walks out to the squad.
    async mv_suns(S, actor, from, T, spec) {
      S.layer.classList.add('sig-dusk');
      const suns = el('<div class="sig-suns"><i></i><i></i></div>');
      S.layer.appendChild(suns);
      const ghost = propEl('card', '#7ac8ff', actor);
      ghost.classList.add('sig-projection');
      await follow(S, ghost, [from, { x: S.W / 2, y: S.H * 0.45 }], { speed: 0.6, minMs: 1100, trail: false, keep: true });
      T.forEach((t, i) => setTimeout(() => {
        const card = this.cards[t.uid];
        if (card) card.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.8) drop-shadow(0 0 20px #ffd27a)' }, { filter: 'brightness(1)' }], { duration: 800 });
        this.wave(this.toField(t), '#ffd27a', 3);
      }, i * 100));
      await this.wait(900);
      ghost.animate([{ opacity: 0.8 }, { opacity: 0, filter: 'blur(8px)' }], { duration: 500, fill: 'forwards' }).onfinish = () => ghost.remove();
      await this.wait(400);
    },

    // The Ghost decloaks overhead, rakes the line, then the Phantom peels off.
    async mv_phantom(S, actor, from, T, spec, hit) {
      const ship = propEl('ship', spec.color, actor);
      ship.classList.remove('heading');
      ship.classList.add('sig-decloak');
      const pos = { x: S.W / 2, y: S.H * 0.2 };
      ship.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%) rotate(180deg) scale(1.4)`;
      S.layer.appendChild(ship);
      await this.wait(700);
      for (const t of T) {
        for (let k = 0; k < 3; k++) follow(S, propEl('bolt', '#ff5a3a', actor), [{ x: pos.x + rand(-10, 10), y: pos.y + 20 }, { x: t.x + rand(-14, 14), y: t.y }], { speed: 3.4, delay: k * 60, trailWidth: 0.5 });
        setTimeout(() => hit(t), 160 / S.speed);
        await this.wait(200);
      }
      const phantom = el(`<div class="sp-prop sig-phantom heading" style="--c:#7ac8ff"><svg viewBox="0 0 100 100"><path d="M50 10 L70 60 L60 86 L40 86 L30 60Z" fill="#d8d2c0"/><path d="M42 30 L58 30 L56 44 L44 44Z" fill="#12263a"/><circle cx="44" cy="88" r="4" fill="#9fdcff"/><circle cx="56" cy="88" r="4" fill="#9fdcff"/></svg></div>`);
      await follow(S, phantom, [{ ...pos }, { x: S.W * 0.2, y: S.H * 0.6 }, { x: S.W * 0.8, y: S.H * 0.7 }, { x: S.W + 100, y: S.H * 0.3 }], { speed: 2.4, trail: '#7ac8ff' });
      ship.animate([{ opacity: 1 }, { opacity: 0, filter: 'blur(6px)' }], { duration: 400, fill: 'forwards' });
      await this.wait(300);
    },

    // ---------- Ally moves ----------
    async mv_heal(S, actor, from, T, spec) {
      S.layer.classList.add('sig-aurora');
      const glyph = { plus: '✚', leaf: '❦', zap: '⚡', mote: '•', mist: '❂', holo: '◈', ion: '◎', spark: '✷', scan: '▣', force: '◌', bacta: '◯' }[spec.prop] || '✦';
      // Each healer gets its own signature flourish on top of the healing motes.
      const extra = {
        holo: () => `<div class="hx-holo" style="left:${from.x}px;top:${from.y}px"></div>`,
        scan: () => '<div class="hx-scan"></div>',
        ion: () => T.map((t) => `<div class="hx-ion" style="left:${t.x}px;top:${t.y}px"></div>`).join(''),
        spark: () => `<div class="hx-spark" style="left:${from.x}px;top:${from.y}px"></div>`,
        force: () => `<div class="hx-force" style="left:${from.x}px;top:${from.y}px"></div>`,
        bacta: () => T.map((t) => `<div class="hx-bacta" style="left:${t.x}px;top:${t.y}px"></div>`).join(''),
        leaf: () => '<div class="hx-leaves"></div>',
        mist: () => '<div class="hx-mist"></div>',
        plus: () => `<div class="hx-cross" style="left:${S.W / 2}px;top:${S.H / 2}px"></div>`,
        mote: () => `<div class="hx-halo" style="left:${from.x}px;top:${from.y}px"></div>`,
      }[spec.prop];
      if (extra) S.layer.insertAdjacentHTML('beforeend', extra());
      const motes = [];
      T.forEach((t, i) => {
        for (let k = 0; k < 7; k++) {
          const m = el(`<div class="sp-prop sp-mote" style="--c:${spec.color}">${glyph}</div>`);
          motes.push(follow(S, m, [{ x: t.x + rand(-S.W * 0.3, S.W * 0.3), y: S.H + 30 }, { x: t.x + rand(-60, 60), y: t.y + rand(30, 120) }, { ...t }], {
            speed: 1.3, delay: i * 90 + k * 60, trail: spec.color, trailWidth: 0.3,
            onNode: (r) => {
              if (!r.uid || k) return;
              const card = this.cards[r.uid];
              if (card) card.animate([{ filter: 'brightness(1)', transform: 'scale(1)' }, { filter: `brightness(1.7) drop-shadow(0 0 18px ${spec.color})`, transform: 'scale(1.06)' }, { filter: 'brightness(1)', transform: 'scale(1)' }], { duration: 700 });
              const f = this.toField(r);
              this.wave(f, spec.color, 2.6);
              this.env.light(f.x, f.y, spec.color, 120, 0.6);
            },
          }));
        }
      });
      await Promise.all(motes);
    },

    async mv_aegis(S, actor, from, T, spec) {
      const wall = el(`<div class="sig-wall wall-${spec.prop}" style="--c:${spec.color}"></div>`);
      S.layer.appendChild(wall);
      const ltr = actor.side === 'player';
      wall.animate([{ transform: `translateX(${ltr ? '-110%' : '110%'})` }, { transform: `translateX(${ltr ? '110%' : '-110%'})` }], { duration: 1100 / S.speed, easing: 'cubic-bezier(.4,0,.6,1)' });
      T.forEach((t) => setTimeout(() => {
        const card = this.cards[t.uid];
        if (!card) return;
        const shield = el(`<div class="sig-shield" style="left:${t.x}px;top:${t.y}px;--c:${spec.color}"></div>`);
        S.layer.appendChild(shield);
        card.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 500 });
        this.env.light(this.toField(t).x, this.toField(t).y, spec.color, 140, 0.6);
      }, ((ltr ? t.x : S.W - t.x) / S.W) * (1100 / S.speed)));
      await this.wait(1250);
    },

    async mv_rally(S, actor, from, T, spec) {
      const star = Array.from({ length: 16 }, (_, i) => { const r = i % 2 ? 18 : 46; const a = (i / 16) * TAU - Math.PI / 2; return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`; }).join(' ');
      const flag = el(`<div class="sig-rally" style="--c:${spec.color}"><svg viewBox="0 0 100 100"><polygon points="${star}" fill="${spec.color}"/><circle cx="50" cy="50" r="12" fill="#fff"/></svg></div>`);
      S.layer.appendChild(flag);
      flag.animate([{ transform: 'translate(-50%, 40vh) scale(.4)', opacity: 0 }, { transform: 'translate(-50%, 0) scale(1.1)', opacity: 1, offset: 0.4 }, { transform: 'translate(-50%, -6vh) scale(1)', opacity: 0 }], { duration: 1300 / S.speed, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
      await this.wait(400);
      T.forEach((t, i) => setTimeout(() => {
        const card = this.cards[t.uid];
        if (card) card.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-22px)', filter: `drop-shadow(0 0 16px ${spec.color})` }, { transform: 'translateY(0)' }], { duration: 520, easing: 'cubic-bezier(.3,1.6,.5,1)' });
        this.wave(this.toField(t), spec.color, 2.4);
      }, i * 90));
      await this.wait(800);
    },

    // ---------- Visual helpers ----------
    sigSpark(p, color) {
      this.sparks(this.toField(p), color, 5);
    },

    sigScorch(p, color) {
      const f = this.toField(p);
      this.sparks(f, color, 4);
      this.env.impact(f.x, f.y, { power: 0.4, color });
    },

    sigBolt(S, a, b, color, w = 1) {
      const ctx = S.ctx;
      const pts = [a];
      const n = 9;
      for (let i = 1; i < n; i++) {
        const k = i / n;
        const len = Math.hypot(b.x - a.x, b.y - a.y);
        pts.push({ x: a.x + (b.x - a.x) * k + rand(-1, 1) * len * 0.05, y: a.y + (b.y - a.y) * k + rand(-1, 1) * len * 0.05 });
      }
      pts.push(b);
      ctx.globalCompositeOperation = 'lighter';
      for (const [lw, al] of [[9 * w, 0.18], [3.5 * w, 0.6], [1.4 * w, 1]]) {
        ctx.strokeStyle = al === 1 ? 'rgba(255,255,255,0.95)' : hexA(color, al);
        ctx.lineWidth = lw;
        ctx.beginPath();
        pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.stroke();
      }
    },

    sigBeam(S, a, b, color, width, ms) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const ext = { x: b.x + (dx / len) * 200, y: b.y + (dy / len) * 200 };
      const t0 = performance.now();
      const dur = ms / S.speed;
      return new Promise((resolve) => {
        const step = (now) => {
          const k = Math.min(1, (now - t0) / dur);
          const w = width * Math.sin(k * Math.PI);
          const ctx = S.ctx;
          ctx.globalCompositeOperation = 'lighter';
          for (const [m, al] of [[3, 0.2], [1.4, 0.6], [0.5, 1]]) {
            ctx.strokeStyle = al === 1 ? 'rgba(255,255,255,0.95)' : hexA(color, al);
            ctx.lineWidth = Math.max(0.5, w * m);
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(ext.x, ext.y); ctx.stroke();
          }
          if (k < 1) requestAnimationFrame(step); else resolve();
        };
        requestAnimationFrame(step);
      });
    },

    sigReticle(S, t, color) {
      const r = el(`<div class="sig-reticle" style="left:${t.x}px;top:${t.y}px;--c:${color}"><i></i></div>`);
      S.layer.appendChild(r);
      r.animate([{ transform: 'translate(-50%,-50%) scale(2.4) rotate(90deg)', opacity: 0 }, { transform: 'translate(-50%,-50%) scale(1) rotate(0)', opacity: 1 }], { duration: 300 / S.speed, fill: 'forwards' });
      setTimeout(() => r.remove(), 900);
      return this.wait(300);
    },

    sigSeismic(S, t, color) {
      const ring = el(`<div class="sig-ring seismic" style="left:${t.x}px;top:${t.y}px;--c:${color}"></div>`);
      S.layer.appendChild(ring);
      ring.animate([{ width: '0px', height: '6px', opacity: 1 }, { width: `${S.W * 0.9}px`, height: '40px', opacity: 0 }], { duration: 700, easing: 'cubic-bezier(.1,.7,.3,1)' }).onfinish = () => ring.remove();
      this.shake();
    },

    // ---------- Card impacts ----------
    sigImpact(kind, uid, color, S) {
      const card = this.cards[uid];
      if (!card || !card.isConnected) return;
      if (root.Sound) root.Sound.play({ slice: 'saber', xslash: 'saber', stamp: 'explosion', shock: 'zap', freeze: 'freeze', burn: 'fire', scorch: 'blaster', shatter: 'crack' }[kind] || 'hit');
      const f = this.center(uid);
      this.sparks(f, color, 10);
      this.env.impact(f.x, f.y, { power: 1.2, color });
      const r = card.getBoundingClientRect();
      const layer = S.layer;
      switch (kind) {
        case 'slice': this.cutCard(uid, layer, color); break;
        case 'xslash': this.cutCard(uid, layer, color); setTimeout(() => this.cutCard(uid, layer, color, true), 180); break;
        case 'shatter': this.shatterCard(uid, layer, color); break;
        case 'knock': {
          const dir = card.classList.contains('enemy') ? -1 : 1;
          card.animate([{ transform: 'none' }, { transform: `translate(${rand(-30, 30)}px, ${dir * -70}px) rotate(${rand(-18, 18)}deg)`, offset: 0.3 }, { transform: 'none' }], { duration: 700, easing: 'cubic-bezier(.2,.9,.3,1.3)' });
          this.wave(f, color, 2.4);
          break;
        }
        case 'crush':
          card.animate([{ transform: 'none' }, { transform: 'scale(1.2, .55) translateY(30%)', offset: 0.25 }, { transform: 'scale(.95, 1.08)', offset: 0.6 }, { transform: 'none' }], { duration: 650, easing: 'ease-out' });
          this.env.blast(f.x, f.y + r.height * 0.4, color, 1.4);
          this.shake();
          break;
        case 'spin':
          card.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(720deg) scale(.9)' }], { duration: 750, easing: 'cubic-bezier(.3,.7,.3,1)' });
          this.wave(f, color, 2.4);
          break;
        case 'lift':
          card.animate([{ transform: 'none' }, { transform: 'translateY(-40px)', offset: 0.4 }, { transform: 'none' }], { duration: 700 });
          break;
        case 'stamp':
          this.boom(f, color, 1.1);
          this.shake();
          break;
        default: this.overlayImpact(kind, r, color, layer);
      }
      if (['burn', 'freeze', 'shock', 'scorch'].includes(kind)) this.overlayImpact(kind, r, color, layer);
    },

    // Burn, freeze, shock and blaster scorch marks drawn over the card.
    overlayImpact(kind, r, color, layer) {
      const o = el(`<div class="imp imp-${kind}" style="left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;--c:${color}"></div>`);
      if (kind === 'scorch') {
        for (let i = 0; i < 4; i++) o.insertAdjacentHTML('beforeend', `<i style="left:${rand(15, 85)}%;top:${rand(12, 80)}%;--s:${rand(0.7, 1.3).toFixed(2)}"></i>`);
      }
      if (kind === 'shock') {
        const pts = () => Array.from({ length: 7 }, (_, i) => `${(i / 6) * 100},${rand(10, 90)}`).join(' ');
        o.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${pts()}"/><polyline points="${pts()}"/></svg>`;
      }
      if (kind === 'freeze') o.innerHTML = '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 0 L46 30 L60 46 L40 70 L52 100 M46 30 L20 40 M60 46 L88 38 M40 70 L14 82"/></svg>';
      if (kind === 'burn') {
        for (let i = 0; i < 10; i++) o.insertAdjacentHTML('beforeend', `<b style="left:${rand(5, 95)}%;--d:${rand(0, 0.5).toFixed(2)}s"></b>`);
      }
      layer.appendChild(o);
      setTimeout(() => o.remove(), kind === 'scorch' ? 1400 : 1000);
    },

    // Card bursts into shards that hang in the air, then snap back together.
    shatterCard(uid, layer, color) {
      const card = this.cards[uid];
      if (!card || !card.isConnected) return;
      const r = card.getBoundingClientRect();
      const cx = rand(35, 65);
      const cy = rand(35, 65);
      const ring = [[0, 0], [50, 0], [100, 0], [100, 50], [100, 100], [50, 100], [0, 100], [0, 50]];
      card.style.visibility = 'hidden';
      for (let i = 0; i < ring.length; i++) {
        const [ax, ay] = ring[i];
        const [bx, by] = ring[(i + 1) % ring.length];
        const c = card.cloneNode(true);
        c.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;margin:0;visibility:visible;z-index:1;clip-path:polygon(${cx}% ${cy}%, ${ax}% ${ay}%, ${bx}% ${by}%)`;
        layer.insertBefore(c, layer.querySelector('canvas'));
        const mx = ((ax + bx) / 2 - cx) * 0.9;
        const my = ((ay + by) / 2 - cy) * 0.9;
        const off = `translate(${mx}px, ${my}px) rotate(${rand(-25, 25)}deg)`;
        c.animate([{ transform: 'none' }, { transform: off, offset: 0.3 }, { transform: off, offset: 0.65 }, { transform: 'none' }], { duration: 1000, easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = () => c.remove();
      }
      const flash = el(`<div class="imp imp-flash" style="left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;--c:${color}"></div>`);
      layer.appendChild(flash);
      setTimeout(() => flash.remove(), 600);
      setTimeout(() => { if (card.isConnected) card.style.visibility = ''; }, 990);
      this.shake();
    },
  });

  function hexA(hex, a) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  // Route ultimates through the signature engine; legacy cinematics stay for bosses.
  const baseSuper = B.superMove;
  B.superMove = async function (anim, actor, targets, ev) {
    const spec = SIG[actor.id];
    if (!spec || spec.legacy || reduced()) return baseSuper.call(this, spec && spec.legacy ? spec.legacy : anim, actor, targets, ev);
    try {
      await this.sig(actor, targets, ev);
    } catch (err) {
      // Never let a cosmetic glitch stall the battle.
    }
  };
})(window);
