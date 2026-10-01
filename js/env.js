// Living battlefields: an animated canvas scene for every planet, on the
// ground and in orbit, that reacts to the fight. Blasts scatter snow and
// sand, lasers light up the scenery, explosions jolt the parallax layers and
// leave scorch marks and smoke, ultimates darken the sky, and each planet
// has its own hazard animation. Also draws the animated Galaxy Map.

(function (root) {
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function seeded(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  function vGrad(ctx, h, stops) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    stops.forEach(([o, c]) => g.addColorStop(o, c));
    return g;
  }

  function glow(ctx, x, y, r, color, a) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, hexA(color, a));
    g.addColorStop(1, hexA(color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // ---------- Planet spheres (orbit views and Galaxy Map) ----------
  const SPHERES = {
    tatooine: { base: '#d9a05a', bands: ['#c48646', '#e8bc80', '#b8763e', '#e0ae6a'], atmo: '#ffd9a0' },
    hoth: { base: '#dfeaf5', bands: ['#c5d6e8', '#f4f8fc', '#b0c4dc', '#e8f0f8'], atmo: '#cfe8ff' },
    dagobah: { base: '#4a6a4a', bands: ['#3a5a3e', '#6a8a5a', '#2e4a34', '#58785a'], atmo: '#a8d0a0', clouds: true },
    bespin: { base: '#e8905a', bands: ['#d0704a', '#f4b07a', '#c0603a', '#f8c890', '#e08050'], atmo: '#ffc8a0' },
    endor: { base: '#5a8a4a', bands: ['#4a7a3e', '#7aa05a', '#3e6a36', '#68904e'], atmo: '#b8e0a8', clouds: true },
    scarif: { base: '#2a8ac8', bands: ['#1f7ab8', '#46a8d8', '#2a90cc', '#e8dca0'], atmo: '#9fe0ff', clouds: true },
    coruscant: { base: '#5a4a6a', bands: ['#4a3a5a', '#7a6a8a', '#5a4a6a', '#6a5a7a'], atmo: '#d0b0ff', lights: true },
    geonosis: { base: '#b25a2e', bands: ['#9a4a22', '#d9773a', '#8a3e1c', '#c8683a'], atmo: '#ffb07a' },
    exegol: { base: '#1a1630', bands: ['#141028', '#2a2250', '#1e1a3a', '#241e44'], atmo: '#8a7aff', cracks: true },
    mustafar: { base: '#3a1a14', bands: ['#2a100c', '#4a2018', '#361410', '#40180f'], atmo: '#ff6a3a', cracks: true },
    coruscant_siege: { base: '#4a3440', bands: ['#3a2430', '#6a4a50', '#4a3040', '#5a3a44'], atmo: '#ff9a5a', lights: true, cracks: true },
  };

  function drawSphere(ctx, x, y, r, id, t, opts = {}) {
    const sp = SPHERES[id] || SPHERES.tatooine;
    const rng = seeded(id.length * 97 + 13);
    ctx.save();
    // Atmosphere halo.
    glow(ctx, x, y, r * 1.35, sp.atmo, opts.halo != null ? opts.halo : 0.35);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.clip();
    ctx.fillStyle = sp.base;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    // Rotating bands.
    const n = 14;
    for (let i = 0; i < n; i++) {
      const by = y - r + (i / n) * r * 2;
      const bh = (r * 2) / n + 1;
      ctx.fillStyle = sp.bands[i % sp.bands.length];
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      const shift = t * 6 * (1 + (i % 3) * 0.3);
      for (let k = 0; k <= 16; k++) {
        const bx = x - r + (k / 16) * r * 2;
        const wob = Math.sin(k * 0.9 + i + shift * 0.05) * bh * 0.35;
        if (k === 0) ctx.moveTo(bx, by + wob);
        else ctx.lineTo(bx, by + wob);
      }
      ctx.lineTo(x + r, by + bh);
      ctx.lineTo(x - r, by + bh);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (sp.clouds) {
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      for (let i = 0; i < 9; i++) {
        const cx = x - r + ((rng() * r * 2 + t * 4) % (r * 2.4)) - r * 0.2;
        const cy = y - r * 0.8 + rng() * r * 1.6;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * (0.15 + rng() * 0.2), r * 0.04, 0, 0, TAU);
        ctx.fill();
      }
    }
    if (sp.cracks) {
      ctx.strokeStyle = 'rgba(255,90,26,0.85)';
      ctx.lineWidth = Math.max(1, r * 0.018);
      ctx.shadowColor = '#ff5a1a';
      ctx.shadowBlur = r * 0.08;
      for (let i = 0; i < 10; i++) {
        let cx = x - r + rng() * r * 2;
        let cy = y - r + rng() * r * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        for (let k = 0; k < 5; k++) {
          cx += (rng() - 0.5) * r * 0.35;
          cy += (rng() - 0.5) * r * 0.35;
          ctx.lineTo(cx, cy);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }
    // Terminator: night side.
    const lx = opts.lightX != null ? opts.lightX : 0.55;
    const tg = ctx.createRadialGradient(x + r * lx, y - r * 0.5, r * 0.2, x + r * lx * 0.4, y - r * 0.2, r * 1.9);
    tg.addColorStop(0, 'rgba(0,0,0,0)');
    tg.addColorStop(0.55, 'rgba(0,0,0,0.15)');
    tg.addColorStop(1, 'rgba(0,0,6,0.92)');
    ctx.fillStyle = tg;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    if (sp.lights) {
      for (let i = 0; i < 90; i++) {
        const a = rng() * TAU;
        const d = Math.sqrt(rng()) * r;
        const px = x + Math.cos(a) * d;
        const py = y + Math.sin(a) * d;
        if (px - x > r * 0.1 && py - y > -r * 0.2) {
          ctx.fillStyle = rng() > 0.5 ? 'rgba(255,210,120,0.85)' : 'rgba(255,170,90,0.7)';
          ctx.fillRect(px, py, Math.max(1, r * 0.012), Math.max(1, r * 0.012));
        }
      }
    }
    ctx.restore();
    // Rim light.
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = hexA(sp.atmo, 0.5);
    ctx.lineWidth = Math.max(1, r * 0.03);
    ctx.beginPath();
    ctx.arc(x, y, r, -Math.PI * 0.95, -Math.PI * 0.05);
    ctx.stroke();
    ctx.restore();
  }

  // ---------- Silhouettes ----------
  function atat(ctx, x, base, s, phase, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3.4 * s;
    ctx.lineCap = 'round';
    const bob = Math.sin(phase * 2) * 1.5 * s;
    const by = base - 64 * s + bob;
    const legs = [-22, -10, 10, 22];
    legs.forEach((lx, i) => {
      const ph = phase + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0);
      const step = Math.sin(ph) * 5 * s;
      const kneeX = x + lx * s + step * 0.5;
      const kneeY = by + 30 * s;
      ctx.beginPath();
      ctx.moveTo(x + lx * s, by + 12 * s);
      ctx.lineTo(kneeX + 2 * s, kneeY);
      ctx.lineTo(x + lx * s + step, base - Math.max(0, Math.cos(ph)) * 3 * s);
      ctx.stroke();
      ctx.fillRect(x + lx * s + step - 4 * s, base - 3 * s, 8 * s, 3 * s);
    });
    ctx.beginPath();
    ctx.moveTo(x - 30 * s, by + 14 * s);
    ctx.lineTo(x - 28 * s, by);
    ctx.lineTo(x + 26 * s, by);
    ctx.lineTo(x + 30 * s, by + 14 * s);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(x + 28 * s, by + 3 * s, 8 * s, 4 * s);
    ctx.beginPath();
    ctx.moveTo(x + 36 * s, by + 1 * s);
    ctx.lineTo(x + 50 * s, by + 3 * s);
    ctx.lineTo(x + 50 * s, by + 12 * s);
    ctx.lineTo(x + 36 * s, by + 12 * s);
    ctx.closePath();
    ctx.fill();
  }

  function starDestroyer(ctx, x, y, s, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - 60 * s, y);
    ctx.lineTo(x + 50 * s, y - 14 * s);
    ctx.lineTo(x + 50 * s, y + 14 * s);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(x + 26 * s, y - 20 * s, 12 * s, 8 * s);
    ctx.fillRect(x + 30 * s, y - 25 * s, 5 * s, 5 * s);
    ctx.fillStyle = 'rgba(140,200,255,0.9)';
    for (let i = -1; i <= 1; i++) ctx.fillRect(x + 50 * s, y + i * 6 * s - 1.5 * s, 3 * s, 3 * s);
  }

  function palm(ctx, x, base, s, color, t) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 5 * s;
    ctx.lineCap = 'round';
    const topX = x + 18 * s;
    const topY = base - 120 * s;
    ctx.beginPath();
    ctx.moveTo(x, base);
    ctx.quadraticCurveTo(x - 6 * s, base - 70 * s, topX, topY);
    ctx.stroke();
    ctx.lineWidth = 4 * s;
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI * 0.95 + (i / 6) * Math.PI * 0.9 + Math.sin(t * 1.2 + i) * 0.05;
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.quadraticCurveTo(topX + Math.cos(a) * 30 * s, topY + Math.sin(a) * 30 * s - 10 * s, topX + Math.cos(a) * 58 * s, topY + Math.sin(a) * 40 * s + 16 * s);
      ctx.stroke();
    }
  }

  function gnarledTree(ctx, x, base, s, color, rng) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 14 * s, base);
    ctx.quadraticCurveTo(x - 4 * s, base - 60 * s, x - 10 * s, base - 130 * s);
    ctx.lineTo(x + 10 * s, base - 130 * s);
    ctx.quadraticCurveTo(x + 6 * s, base - 60 * s, x + 16 * s, base);
    ctx.fill();
    for (let i = 0; i < 5; i++) {
      const by = base - (60 + rng() * 70) * s;
      const dir = rng() > 0.5 ? 1 : -1;
      ctx.lineWidth = (3 + rng() * 4) * s;
      ctx.beginPath();
      ctx.moveTo(x, by);
      ctx.quadraticCurveTo(x + dir * 30 * s, by - 20 * s, x + dir * (50 + rng() * 40) * s, by + (rng() * 30 - 10) * s);
      ctx.stroke();
      ctx.lineWidth = 1 * s;
      for (let k = 0; k < 3; k++) {
        const vx = x + dir * (20 + rng() * 40) * s;
        ctx.beginPath();
        ctx.moveTo(vx, by - 6 * s);
        ctx.lineTo(vx + (rng() - 0.5) * 6 * s, by + (20 + rng() * 40) * s);
        ctx.stroke();
      }
    }
    for (let i = -2; i <= 2; i++) {
      ctx.lineWidth = 3 * s;
      ctx.beginPath();
      ctx.moveTo(x + i * 5 * s, base - 10 * s);
      ctx.quadraticCurveTo(x + i * 18 * s, base - 4 * s, x + i * 24 * s, base + 4 * s);
      ctx.stroke();
    }
  }

  // ---------- Ground themes ----------
  // Each theme: init(env) builds static geometry; sky, layers(), weather
  // particle spawner, impact dust colors and ambient extras.
  const THEMES = {};

  THEMES.desert = {
    horizon: 0.64,
    dust: ['#e0b070', '#c89050', '#f0d0a0'],
    weather: { count: 110, spawn: (e) => ({ x: rand(0, e.w), y: rand(e.h * 0.3, e.h), vx: rand(60, 140), vy: rand(-6, 6), size: rand(0.6, 1.8), color: pick(['#f0d0a0', '#e0b070', '#fff0d0']), alpha: rand(0.3, 0.8), kind: 'sand' }) },
    sky: (e) => [[0, '#1b2750'], [0.32, '#5a4a80'], [0.56, '#e89a5a'], [0.64, '#f8c88a']],
    init(e, r) {
      e.g.mesas = Array.from({ length: 7 }, (_, i) => ({ x: i / 6, w: rand(0.08, 0.2), h: rand(0.05, 0.12) }));
      e.g.vapor = Array.from({ length: 4 }, () => ({ x: r() }));
    },
    draw(e, ctx, w, h, t, J) {
      const hz = h * 0.64;
      ctx.save();
      ctx.translate(J.x * 0.1, J.y * 0.1);
      glow(ctx, w * 0.7, h * 0.34, h * 0.35, '#ffe0a0', 0.5);
      glow(ctx, w * 0.8, h * 0.42, h * 0.25, '#fff0c0', 0.4);
      ctx.fillStyle = '#fff6dc';
      ctx.beginPath(); ctx.arc(w * 0.7, h * 0.34, h * 0.05, 0, TAU); ctx.fill();
      ctx.fillStyle = '#ffe9b8';
      ctx.beginPath(); ctx.arc(w * 0.8, h * 0.42, h * 0.034, 0, TAU); ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.translate(J.x * 0.3, J.y * 0.3);
      ctx.fillStyle = 'rgba(140,80,58,0.75)';
      for (const m of e.g.mesas) {
        const mx = m.x * w;
        ctx.beginPath();
        ctx.moveTo(mx - m.w * w * 0.6, hz + 2);
        ctx.lineTo(mx - m.w * w * 0.45, hz - m.h * h);
        ctx.lineTo(mx + m.w * w * 0.45, hz - m.h * h);
        ctx.lineTo(mx + m.w * w * 0.6, hz + 2);
        ctx.fill();
      }
      // Sandcrawler creeping along the horizon.
      const sx = ((t * 6) % (w + 200)) - 100;
      ctx.fillStyle = 'rgba(95,60,45,0.8)';
      ctx.beginPath();
      ctx.moveTo(sx - 34, hz); ctx.lineTo(sx - 26, hz - 16); ctx.lineTo(sx + 10, hz - 22); ctx.lineTo(sx + 30, hz - 12); ctx.lineTo(sx + 34, hz);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.translate(J.x * 0.6, J.y * 0.6);
      ctx.fillStyle = '#d68d50';
      ctx.beginPath();
      ctx.moveTo(-20, h);
      for (let x = -20; x <= w + 20; x += 16) ctx.lineTo(x, hz + h * 0.04 + Math.sin(x * 0.008 + 1.3) * h * 0.03);
      ctx.lineTo(w + 20, h);
      ctx.fill();
      ctx.strokeStyle = 'rgba(40,30,30,0.7)';
      ctx.lineWidth = 2;
      for (const v of e.g.vapor) {
        const vx = v.x * w;
        const vy = hz + h * 0.04 + Math.sin(vx * 0.008 + 1.3) * h * 0.03;
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(vx, vy - 24); ctx.stroke();
        ctx.fillStyle = 'rgba(40,30,30,0.7)';
        ctx.fillRect(vx - 4, vy - 18, 8, 3);
      }
      ctx.restore();
      ctx.save();
      ctx.translate(J.x, J.y);
      ctx.fillStyle = '#c27a3e';
      ctx.beginPath();
      ctx.moveTo(-30, h + 30);
      for (let x = -30; x <= w + 30; x += 14) ctx.lineTo(x, h * 0.82 + Math.sin(x * 0.006 + 4) * h * 0.05);
      ctx.lineTo(w + 30, h + 30);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,220,170,0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = -30; x <= w + 30; x += 14) {
        const y = h * 0.82 + Math.sin(x * 0.006 + 4) * h * 0.05;
        if (x === -30) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    },
  };

  THEMES.snow = {
    horizon: 0.6,
    dust: ['#ffffff', '#e0ecf8', '#c8dcf0'],
    weather: { count: 170, spawn: (e) => { const d = rand(0.3, 1); return { x: rand(0, e.w), y: rand(-e.h, e.h), vx: rand(-10, 10), vy: 20 + d * 40, size: 0.6 + d * 2.2, color: '#ffffff', alpha: 0.4 + d * 0.5, kind: 'snow', depth: d }; } },
    sky: () => [[0, '#4d6b94'], [0.35, '#8fadd0'], [0.6, '#dfeaf6']],
    init(e) {
      e.g.far = Array.from({ length: 12 }, (_, i) => ({ x: i / 11, h: rand(0.1, 0.22) }));
      e.g.mid = Array.from({ length: 8 }, (_, i) => ({ x: i / 7, h: rand(0.06, 0.12) }));
      e.g.walkers = [{ x: rand(0, 1), s: 0.55, sp: 3.2 }, { x: rand(0, 1), s: 0.8, sp: 4.5 }];
    },
    draw(e, ctx, w, h, t, J) {
      const hz = h * 0.6;
      ctx.save();
      ctx.translate(J.x * 0.25, J.y * 0.25);
      ctx.fillStyle = '#b8cbe0';
      ctx.beginPath();
      ctx.moveTo(-40, hz);
      e.g.far.forEach((m, i) => { ctx.lineTo(m.x * w - 20, hz - m.h * h); ctx.lineTo(m.x * w + 20 + (i % 2) * 20, hz - m.h * h * 0.6); });
      ctx.lineTo(w + 40, hz);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      e.g.far.forEach((m) => {
        ctx.beginPath();
        ctx.moveTo(m.x * w - 20, hz - m.h * h);
        ctx.lineTo(m.x * w - 30, hz - m.h * h * 0.8);
        ctx.lineTo(m.x * w - 8, hz - m.h * h * 0.82);
        ctx.fill();
      });
      ctx.restore();
      ctx.save();
      ctx.translate(J.x * 0.5, J.y * 0.5);
      for (const wk of e.g.walkers) {
        const x = ((wk.x * (w + 300) + t * wk.sp) % (w + 300)) - 150;
        atat(ctx, x, hz + 6 * wk.s, wk.s, t * 1.4 * (wk.sp / 4), wk.s > 0.7 ? 'rgba(96,110,132,0.85)' : 'rgba(130,148,172,0.7)');
      }
      ctx.fillStyle = '#d9e6f2';
      ctx.beginPath();
      ctx.moveTo(-40, h);
      ctx.lineTo(-40, hz + 4);
      e.g.mid.forEach((m) => ctx.lineTo(m.x * w, hz + 4 - m.h * h * 0.3));
      ctx.lineTo(w + 40, hz + 4);
      ctx.lineTo(w + 40, h);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.translate(J.x, J.y);
      ctx.fillStyle = '#f3f8fc';
      ctx.fillRect(-40, h * 0.74, w + 80, h * 0.3);
      ctx.fillStyle = 'rgba(150,180,215,0.25)';
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.ellipse((i / 5) * w, h * 0.78 + (i % 2) * 10, w * 0.12, 6, 0, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    },
  };

  THEMES.swamp = {
    horizon: 0.62,
    dust: ['#4a6a4a', '#6a8a5a', '#2e4a34'],
    weather: { count: 60, spawn: (e) => ({ x: rand(0, e.w), y: rand(e.h * 0.2, e.h * 0.95), vx: rand(-8, 8), vy: rand(-6, 6), size: rand(1.2, 2.6), color: '#d8ff7a', alpha: 0, kind: 'firefly', phase: rand(0, TAU) }) },
    sky: () => [[0, '#0c1a12'], [0.4, '#23402c'], [0.62, '#4f6e58']],
    init(e, r) {
      e.g.far = Array.from({ length: 5 }, (_, i) => ({ x: (i + r() * 0.5) / 5, s: 0.5 + r() * 0.3, seed: r() * 1e6 }));
      e.g.near = [{ x: 0.04, s: 1.3, seed: 11 }, { x: 0.95, s: 1.2, seed: 29 }];
      e.g.mist = Array.from({ length: 7 }, () => ({ x: r(), y: 0.45 + r() * 0.45, w: 0.3 + r() * 0.4, sp: 4 + r() * 10, a: 0.06 + r() * 0.08 }));
    },
    draw(e, ctx, w, h, t, J) {
      const hz = h * 0.62;
      ctx.save();
      ctx.translate(J.x * 0.3, J.y * 0.3);
      for (const tr of e.g.far) gnarledTree(ctx, tr.x * w, hz + 10, tr.s * h / 320, 'rgba(24,44,30,0.75)', seeded(tr.seed));
      ctx.restore();
      ctx.save();
      ctx.translate(J.x * 0.7, J.y * 0.7);
      ctx.fillStyle = '#162a1e';
      ctx.fillRect(-40, hz + 6, w + 80, h);
      ctx.strokeStyle = 'rgba(160,210,170,0.18)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
        const y = hz + 16 + i * (h - hz) / 12;
        const off = Math.sin(t * 0.8 + i) * 20;
        ctx.beginPath();
        ctx.moveTo(w * 0.1 + off + i * 13 % 80, y);
        ctx.lineTo(w * 0.1 + off + 60 + i * 13 % 80, y);
        ctx.moveTo(w * 0.6 - off + i * 7 % 60, y + 4);
        ctx.lineTo(w * 0.6 - off + 50 + i * 7 % 60, y + 4);
        ctx.stroke();
      }
      ctx.restore();
      ctx.save();
      for (const m of e.g.mist) {
        const mx = ((m.x * (w + 400) + t * m.sp) % (w + 400)) - 200;
        ctx.fillStyle = `rgba(180,210,185,${m.a})`;
        ctx.beginPath();
        ctx.ellipse(mx + J.x * 0.5, m.y * h, m.w * w, h * 0.05, 0, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
      ctx.save();
      ctx.translate(J.x, J.y);
      for (const tr of e.g.near) gnarledTree(ctx, tr.x * w, h + 20, tr.s * h / 260, '#0b150e', seeded(tr.seed));
      ctx.restore();
    },
  };

  THEMES.clouds = {
    horizon: 0.72,
    dust: ['#ffd0a0', '#ffb070', '#ffffff'],
    weather: { count: 40, spawn: (e) => ({ x: rand(0, e.w), y: rand(0, e.h), vx: rand(-20, -6), vy: rand(-2, 2), size: rand(0.6, 1.4), color: '#fff2e0', alpha: rand(0.3, 0.7), kind: 'sparkle', phase: rand(0, TAU) }) },
    sky: () => [[0, '#2e2260'], [0.35, '#b04a78'], [0.6, '#ff935a'], [0.75, '#ffc98a']],
    init(e, r) {
      e.g.layers = [0.35, 0.6, 1].map((depth, li) => Array.from({ length: 7 }, () => ({ x: r(), y: 0.5 + li * 0.14 + r() * 0.1, s: (0.6 + r() * 0.8) * (0.6 + depth * 0.6), depth })));
      e.g.car = { t: -99 };
    },
    draw(e, ctx, w, h, t, J) {
      ctx.save();
      ctx.translate(J.x * 0.1, J.y * 0.1);
      glow(ctx, w * 0.28, h * 0.64, h * 0.45, '#ffdca0', 0.55);
      ctx.fillStyle = '#fff1d0';
      ctx.beginPath(); ctx.arc(w * 0.28, h * 0.64, h * 0.07, 0, TAU); ctx.fill();
      ctx.restore();
      const colors = ['rgba(255,176,130,0.7)', 'rgba(240,140,140,0.8)', 'rgba(220,110,130,0.95)'];
      e.g.layers.forEach((layer, li) => {
        ctx.save();
        ctx.translate(J.x * layer[0].depth, J.y * layer[0].depth);
        if (li === 1) {
          // Cloud City rises between the cloud layers.
          const cx = w * 0.72;
          const cy = h * 0.56;
          ctx.fillStyle = 'rgba(90,52,86,0.85)';
          ctx.beginPath(); ctx.ellipse(cx, cy, w * 0.09, h * 0.022, 0, 0, TAU); ctx.fill();
          for (let i = -4; i <= 4; i++) ctx.fillRect(cx + i * w * 0.015 - 3, cy - h * (0.02 + (4 - Math.abs(i)) * 0.012), 6, h * (0.02 + (4 - Math.abs(i)) * 0.012));
          ctx.beginPath(); ctx.moveTo(cx - 6, cy); ctx.lineTo(cx, cy + h * 0.16); ctx.lineTo(cx + 6, cy); ctx.fill();
          const cl = (t * 40) % (w + 400) - 200;
          ctx.fillStyle = 'rgba(80,40,60,0.9)';
          ctx.beginPath(); ctx.arc(cl, h * 0.42, 4, 0, TAU); ctx.arc(cl + 12, h * 0.42, 4, 0, TAU); ctx.fill();
          ctx.fillRect(cl, h * 0.42 - 1, 12, 2);
        }
        ctx.fillStyle = colors[li];
        for (const c of layer) {
          const cx = ((c.x * (w + 500) - t * (4 + c.depth * 14)) % (w + 500) + (w + 500)) % (w + 500) - 250;
          const cy = c.y * h;
          const r = h * 0.08 * c.s;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, TAU);
          ctx.arc(cx + r * 0.9, cy + r * 0.2, r * 0.8, 0, TAU);
          ctx.arc(cx - r * 0.9, cy + r * 0.25, r * 0.7, 0, TAU);
          ctx.arc(cx + r * 1.7, cy + r * 0.45, r * 0.55, 0, TAU);
          ctx.fill();
        }
        ctx.restore();
      });
    },
  };

  THEMES.forest = {
    horizon: 0.7,
    dust: ['#6a8a3a', '#5a4a2a', '#8aa04a'],
    weather: { count: 70, spawn: (e) => ({ x: rand(0, e.w), y: rand(0, e.h), vx: rand(-6, 6), vy: rand(-4, 8), size: rand(0.8, 2), color: '#f0ffb0', alpha: rand(0.2, 0.7), kind: 'spore', phase: rand(0, TAU) }) },
    sky: () => [[0, '#0b1e12'], [0.5, '#1f3f24'], [0.8, '#2a4a28']],
    init(e, r) {
      e.g.far = Array.from({ length: 14 }, (_, i) => ({ x: (i + r() * 0.6) / 14, w: 0.012 + r() * 0.02 }));
      e.g.mid = Array.from({ length: 7 }, (_, i) => ({ x: (i + r() * 0.5) / 7, w: 0.03 + r() * 0.03 }));
      e.g.bike = { x: -1 };
    },
    draw(e, ctx, w, h, t, J) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 4; i++) {
        const a = 0.05 + Math.sin(t * 0.4 + i) * 0.025;
        ctx.fillStyle = `rgba(210,255,170,${a})`;
        const x = w * (0.15 + i * 0.25) + J.x * 0.2;
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x + w * 0.08, 0); ctx.lineTo(x + w * 0.2, h); ctx.lineTo(x + w * 0.05, h);
        ctx.fill();
      }
      ctx.restore();
      ctx.save();
      ctx.translate(J.x * 0.3, J.y * 0.3);
      ctx.fillStyle = 'rgba(40,58,34,0.85)';
      for (const tr of e.g.far) ctx.fillRect(tr.x * w, 0, tr.w * w, h * 0.75);
      ctx.restore();
      ctx.save();
      ctx.translate(J.x * 0.6, J.y * 0.6);
      ctx.fillStyle = '#2e2116';
      for (const tr of e.g.mid) {
        ctx.fillRect(tr.x * w, 0, tr.w * w, h * 0.85);
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(tr.x * w + tr.w * w * 0.6, 0, tr.w * w * 0.4, h * 0.85);
        ctx.fillStyle = '#2e2116';
      }
      // Speeder bike zipping between the trees.
      const bx = ((t * 260) % (w * 3)) - w;
      if (bx > -60 && bx < w + 60) {
        ctx.fillStyle = 'rgba(30,30,34,0.95)';
        ctx.fillRect(bx, h * 0.62, 26, 4);
        ctx.fillRect(bx + 18, h * 0.6, 6, 6);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(bx - 50, h * 0.625, 48, 2);
      }
      ctx.restore();
      ctx.save();
      ctx.translate(J.x, J.y);
      ctx.fillStyle = '#1a3a18';
      ctx.beginPath();
      ctx.moveTo(-40, h);
      for (let x = -40; x <= w + 40; x += 10) ctx.lineTo(x, h * 0.86 - Math.abs(Math.sin(x * 0.07)) * h * 0.06);
      ctx.lineTo(w + 40, h);
      ctx.fill();
      ctx.fillStyle = '#1c130c';
      ctx.fillRect(-10, 0, w * 0.07, h);
      ctx.fillRect(w * 0.94, 0, w * 0.08, h);
      ctx.restore();
    },
  };

  THEMES.beach = {
    horizon: 0.56,
    dust: ['#f0dca0', '#e0c880', '#ffffff'],
    weather: { count: 30, spawn: (e) => ({ x: rand(0, e.w), y: rand(e.h * 0.5, e.h), vx: rand(10, 30), vy: rand(-4, 4), size: rand(0.6, 1.4), color: '#ffffff', alpha: rand(0.2, 0.5), kind: 'sand' }) },
    sky: () => [[0, '#1d74c0'], [0.4, '#6cc0ec'], [0.56, '#cfeefa']],
    init(e, r) {
      e.g.clouds = Array.from({ length: 6 }, () => ({ x: r(), y: 0.08 + r() * 0.25, s: 0.5 + r() }));
      e.g.palms = [{ x: 0.08, s: 1 }, { x: 0.2, s: 0.7 }, { x: 0.86, s: 0.9 }];
    },
    draw(e, ctx, w, h, t, J) {
      const hz = h * 0.56;
      ctx.save();
      ctx.translate(J.x * 0.1, J.y * 0.1);
      ctx.strokeStyle = `rgba(170,230,255,${0.18 + Math.sin(t * 2) * 0.05})`;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(w * 0.5, h * 0.9, w * 0.9, h * 0.85, 0, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      for (const c of e.g.clouds) {
        const cx = ((c.x * (w + 300) + t * 6) % (w + 300)) - 150;
        ctx.beginPath();
        ctx.ellipse(cx, c.y * h, 50 * c.s, 10 * c.s, 0, 0, TAU);
        ctx.ellipse(cx + 26 * c.s, c.y * h - 6 * c.s, 30 * c.s, 10 * c.s, 0, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
      ctx.save();
      ctx.translate(J.x * 0.3, J.y * 0.3);
      ctx.fillStyle = 'rgba(70,96,110,0.8)';
      ctx.fillRect(w * 0.62, hz - h * 0.26, w * 0.035, h * 0.26);
      ctx.beginPath(); ctx.ellipse(w * 0.6375, hz - h * 0.26, w * 0.05, h * 0.018, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#1f98b8';
      ctx.fillRect(-40, hz, w + 80, h * 0.12);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 5; i++) {
        const y = hz + 4 + i * h * 0.024;
        const off = (t * (10 + i * 4)) % 80;
        ctx.beginPath();
        for (let x = -80 + off; x < w + 80; x += 80) { ctx.moveTo(x, y); ctx.lineTo(x + 30, y); }
        ctx.stroke();
      }
      ctx.restore();
      ctx.save();
      ctx.translate(J.x, J.y);
      ctx.fillStyle = '#f0dca0';
      ctx.beginPath();
      ctx.moveTo(-40, h);
      ctx.lineTo(-40, h * 0.7);
      ctx.quadraticCurveTo(w * 0.5, h * 0.64 + Math.sin(t) * 2, w + 40, h * 0.7);
      ctx.lineTo(w + 40, h);
      ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${0.35 + Math.sin(t * 1.3) * 0.15})`;
      ctx.beginPath();
      ctx.moveTo(-40, h * 0.7);
      ctx.quadraticCurveTo(w * 0.5, h * 0.64 + Math.sin(t) * 2, w + 40, h * 0.7);
      ctx.lineTo(w + 40, h * 0.71);
      ctx.quadraticCurveTo(w * 0.5, h * 0.66 + Math.sin(t) * 2, -40, h * 0.71);
      ctx.fill();
      for (const p of e.g.palms) palm(ctx, p.x * w, h * 0.98, p.s * h / 300, '#1e4a2a', t);
      ctx.restore();
    },
  };

  THEMES.city = {
    horizon: 0.62,
    dust: ['#ffd27a', '#ff9a4a', '#ffffff'],
    weather: { count: 0, spawn: () => null },
    sky: () => [[0, '#110826'], [0.35, '#3c2260'], [0.62, '#c86a66']],
    init(e, r) {
      const mk = (n, minH, maxH) => Array.from({ length: n }, (_, i) => {
        const b = { x: i / n, w: 1 / n * (0.7 + r() * 0.5), h: minH + r() * (maxH - minH), win: [] };
        for (let k = 0; k < 14; k++) b.win.push([r(), r(), r()]);
        return b;
      });
      e.g.far = mk(22, 0.15, 0.4);
      e.g.mid = mk(12, 0.25, 0.6);
      e.g.lanes = [0.22, 0.34, 0.46].map((y, i) => ({ y, dir: i % 2 ? -1 : 1, sp: 60 + i * 40, cars: Array.from({ length: 16 }, () => r()) }));
    },
    draw(e, ctx, w, h, t, J) {
      const hz = h * 0.62;
      const drawBuildings = (list, color, winA, depth) => {
        ctx.save();
        ctx.translate(J.x * depth, J.y * depth);
        for (const b of list) {
          const bx = b.x * w;
          const bw = b.w * w;
          const bh = b.h * h;
          ctx.fillStyle = color;
          ctx.fillRect(bx, hz + h * 0.1 - bh, bw, bh + h);
          for (const [wx, wy, ph] of b.win) {
            const on = Math.sin(t * 0.7 + ph * 40) > -0.6;
            if (!on) continue;
            ctx.fillStyle = ph > 0.5 ? `rgba(255,214,140,${winA})` : `rgba(160,200,255,${winA})`;
            ctx.fillRect(bx + wx * bw * 0.9, hz + h * 0.1 - bh + wy * bh, 2, 2);
          }
        }
        ctx.restore();
      };
      drawBuildings(e.g.far, 'rgba(38,26,70,0.95)', 0.5, 0.25);
      ctx.save();
      ctx.translate(J.x * 0.45, J.y * 0.45);
      ctx.globalCompositeOperation = 'lighter';
      for (const lane of e.g.lanes) {
        for (const c of lane.cars) {
          const x = (((c * (w + 200) + lane.dir * t * lane.sp * (e.rush || 1)) % (w + 200)) + (w + 200)) % (w + 200) - 100;
          ctx.fillStyle = lane.dir > 0 ? 'rgba(255,240,210,0.9)' : 'rgba(255,90,90,0.85)';
          ctx.fillRect(x, lane.y * h, 3, 1.6);
          ctx.fillStyle = lane.dir > 0 ? 'rgba(255,240,210,0.18)' : 'rgba(255,90,90,0.16)';
          ctx.fillRect(x - lane.dir * 16 * (e.rush || 1), lane.y * h, 16 * (e.rush || 1), 1.6);
        }
      }
      for (let i = 0; i < 2; i++) {
        const a = -Math.PI / 2 + Math.sin(t * 0.5 + i * 2) * 0.5;
        const sx = w * (0.3 + i * 0.4);
        ctx.fillStyle = 'rgba(200,200,255,0.05)';
        ctx.beginPath();
        ctx.moveTo(sx, h);
        ctx.lineTo(sx + Math.cos(a - 0.05) * h * 1.2, h + Math.sin(a - 0.05) * h * 1.2);
        ctx.lineTo(sx + Math.cos(a + 0.05) * h * 1.2, h + Math.sin(a + 0.05) * h * 1.2);
        ctx.fill();
      }
      ctx.restore();
      drawBuildings(e.g.mid, 'rgba(24,16,46,1)', 0.7, 0.6);
      ctx.save();
      ctx.translate(J.x, J.y);
      ctx.fillStyle = '#100a1e';
      ctx.fillRect(-40, h * 0.86, w + 80, h * 0.2);
      ctx.fillStyle = 'rgba(255,120,200,0.5)';
      ctx.fillRect(-40, h * 0.86, w + 80, 2);
      ctx.restore();
    },
  };

  THEMES.lava = {
    horizon: 0.62,
    dust: ['#ff8a3a', '#ffcf6a', '#ff4a1a'],
    weather: { count: 120, spawn: (e) => (Math.random() < 0.5
      ? { x: rand(0, e.w), y: rand(0, e.h), vx: rand(-8, 8), vy: rand(10, 26), size: rand(0.8, 2), color: '#6a5a58', alpha: rand(0.3, 0.6), kind: 'ash' }
      : { x: rand(0, e.w), y: rand(e.h * 0.4, e.h), vx: rand(-10, 10), vy: rand(-40, -14), size: rand(0.8, 2), color: '#ffae4a', alpha: rand(0.4, 0.9), kind: 'ember', phase: rand(0, TAU) }) },
    sky: () => [[0, '#0e0303'], [0.4, '#3a0a06'], [0.62, '#8a2a0a']],
    init(e) {
      e.g.volcanoes = [{ x: 0.18, s: 1 }, { x: 0.55, s: 0.7 }, { x: 0.86, s: 1.2 }];
      e.g.erupt = 0;
    },
    draw(e, ctx, w, h, t, J) {
      const hz = h * 0.62;
      ctx.save();
      ctx.translate(J.x * 0.25, J.y * 0.25);
      for (const v of e.g.volcanoes) {
        const vx = v.x * w;
        const vh = h * 0.2 * v.s;
        glow(ctx, vx, hz - vh, vh * (0.8 + e.g.erupt * 1.5), '#ff5a1a', 0.35 + Math.sin(t * 2 + v.x * 10) * 0.08 + e.g.erupt * 0.4);
        ctx.fillStyle = '#1e0704';
        ctx.beginPath();
        ctx.moveTo(vx - vh * 1.6, hz + 4);
        ctx.lineTo(vx - vh * 0.18, hz - vh);
        ctx.lineTo(vx + vh * 0.18, hz - vh);
        ctx.lineTo(vx + vh * 1.6, hz + 4);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,100,30,0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(vx, hz - vh);
        ctx.quadraticCurveTo(vx + vh * 0.3, hz - vh * 0.5, vx + vh * 0.2, hz);
        ctx.stroke();
        if (Math.random() < 0.06 + e.g.erupt * 0.8) {
          e.fx.push({ x: vx + J.x * 0.25, y: hz - vh + J.y * 0.25, vx: rand(-40, 40) * (1 + e.g.erupt * 2), vy: rand(-140, -60) * (1 + e.g.erupt), life: 0, max: rand(1, 2.2), size: rand(1.5, 3.5), color: pick(['#ff6a1a', '#ffb03a', '#ff3a0a']), grav: 120, drag: 0.3, type: 'ember' });
        }
      }
      ctx.restore();
      e.g.erupt = Math.max(0, e.g.erupt - 0.005);
      ctx.save();
      ctx.translate(J.x * 0.6, J.y * 0.6);
      ctx.fillStyle = '#140404';
      ctx.fillRect(-40, hz, w + 80, h);
      ctx.fillStyle = 'rgba(30,10,8,1)';
      ctx.fillRect(w * 0.64, hz - h * 0.08, w * 0.05, h * 0.1);
      ctx.fillRect(w * 0.6, hz - h * 0.1, w * 0.13, h * 0.02);
      ctx.fillRect(w * 0.25, hz - h * 0.05, w * 0.03, h * 0.06);
      ctx.restore();
      ctx.save();
      ctx.translate(J.x, J.y);
      for (let k = 0; k < 2; k++) {
        const baseY = h * (0.76 + k * 0.13);
        ctx.fillStyle = k ? '#ff7a1a' : '#e0480e';
        ctx.shadowColor = '#ff5a1a';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(-40, baseY);
        for (let x = -40; x <= w + 40; x += 20) ctx.lineTo(x, baseY + Math.sin(x * 0.02 + t * (1 + k) + k * 3) * 5);
        for (let x = w + 40; x >= -40; x -= 20) ctx.lineTo(x, baseY + 12 + k * 6 + Math.sin(x * 0.03 - t * 1.4) * 4);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,230,140,0.6)';
        for (let x = 0; x < w; x += 60) {
          const fx = (x + t * 30 * (k ? -1 : 1) + w * 2) % w;
          ctx.fillRect(fx, baseY + 4 + Math.sin(fx * 0.02 + t) * 3, 14, 1.5);
        }
      }
      ctx.fillStyle = '#0a0202';
      ctx.beginPath();
      ctx.moveTo(-40, h);
      ctx.lineTo(-40, h * 0.84);
      ctx.lineTo(w * 0.12, h * 0.8);
      ctx.lineTo(w * 0.2, h * 0.86);
      ctx.lineTo(w * 0.2, h);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(w + 40, h);
      ctx.lineTo(w + 40, h * 0.82);
      ctx.lineTo(w * 0.85, h * 0.84);
      ctx.lineTo(w * 0.8, h);
      ctx.fill();
      ctx.restore();
    },
  };

  THEMES.canyon = {
    horizon: 0.66,
    dust: ['#d9773a', '#b25a2e', '#f2a060'],
    weather: { count: 90, spawn: (e) => ({ x: rand(0, e.w), y: rand(e.h * 0.2, e.h), vx: rand(40, 110), vy: rand(-8, 8), size: rand(0.6, 1.8), color: pick(['#f2a060', '#d9773a', '#ffcf9a']), alpha: rand(0.25, 0.7), kind: 'sand' }) },
    sky: () => [[0, '#4a1a10'], [0.35, '#a04a22'], [0.66, '#f0a060']],
    init(e, r) {
      e.g.spires = Array.from({ length: 9 }, (_, i) => ({ x: (i + r() * 0.6) / 9, h: 0.18 + r() * 0.3, w: 0.02 + r() * 0.03, depth: r() > 0.5 ? 0.3 : 0.55 }));
      e.g.smoke = Array.from({ length: 3 }, () => ({ x: 0.2 + r() * 0.6 }));
    },
    draw(e, ctx, w, h, t, J) {
      const hz = h * 0.66;
      ctx.save();
      ctx.translate(J.x * 0.1, J.y * 0.1);
      glow(ctx, w * 0.2, h * 0.3, h * 0.3, '#ffd0a0', 0.4);
      ctx.fillStyle = 'rgba(255,230,200,0.8)';
      ctx.beginPath(); ctx.arc(w * 0.2, h * 0.3, h * 0.04, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(220,180,160,0.35)';
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(w * (0.12 + i * 0.05), h * (0.14 + i * 0.03), h * (0.012 + i * 0.004), 0, TAU); ctx.fill(); }
      ctx.restore();
      for (const layer of [0.3, 0.55]) {
        ctx.save();
        ctx.translate(J.x * layer, J.y * layer);
        ctx.fillStyle = layer < 0.5 ? 'rgba(140,56,30,0.8)' : '#7a2e16';
        for (const sp of e.g.spires.filter((x) => x.depth === layer)) {
          const x = sp.x * w;
          const top = hz - sp.h * h;
          ctx.beginPath();
          ctx.moveTo(x - sp.w * w, hz + 4);
          ctx.quadraticCurveTo(x - sp.w * w * 0.6, top + sp.h * h * 0.4, x - sp.w * w * 0.2, top);
          ctx.lineTo(x + sp.w * w * 0.3, top + 6);
          ctx.quadraticCurveTo(x + sp.w * w * 0.7, top + sp.h * h * 0.5, x + sp.w * w, hz + 4);
          ctx.fill();
          if (layer > 0.5) {
            ctx.fillStyle = 'rgba(255,160,90,0.5)';
            ctx.fillRect(x - 1, top + sp.h * h * 0.3, 2, 2);
            ctx.fillRect(x + 3, top + sp.h * h * 0.5, 2, 2);
            ctx.fillStyle = '#7a2e16';
          }
        }
        ctx.restore();
      }
      for (const sm of e.g.smoke) {
        if (Math.random() < 0.08) e.fx.push({ x: sm.x * w + J.x * 0.4, y: hz - 10, vx: rand(-6, 6), vy: rand(-26, -12), life: 0, max: rand(3, 5), size: rand(8, 16), color: '#3a2a26', grav: -2, drag: 0.2, type: 'smoke' });
      }
      ctx.save();
      ctx.translate(J.x, J.y);
      ctx.fillStyle = '#b25a2e';
      ctx.beginPath();
      ctx.moveTo(-30, h + 30);
      for (let x = -30; x <= w + 30; x += 18) ctx.lineTo(x, h * 0.8 + Math.sin(x * 0.01 + 2) * h * 0.03);
      ctx.lineTo(w + 30, h + 30);
      ctx.fill();
      ctx.strokeStyle = 'rgba(80,30,16,0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(w * 0.5, h * 0.95, w * 0.42, h * 0.1, 0, Math.PI, TAU); ctx.stroke();
      ctx.restore();
    },
  };

  THEMES.storm = {
    horizon: 0.64,
    dust: ['#8a7aff', '#4a3a8a', '#d8d0ff'],
    weather: { count: 160, spawn: (e) => ({ x: rand(0, e.w), y: rand(-e.h, e.h), vx: rand(-40, -20), vy: rand(380, 520), size: rand(0.6, 1.2), color: '#a8b0d8', alpha: rand(0.2, 0.5), kind: 'rain' }) },
    sky: () => [[0, '#05040c'], [0.4, '#141030'], [0.64, '#2a2250']],
    init(e, r) {
      e.g.spires = Array.from({ length: 7 }, (_, i) => ({ x: (i + r() * 0.5) / 7, h: 0.16 + r() * 0.24 }));
      e.g.fleet = Array.from({ length: 6 }, () => ({ x: r(), y: 0.08 + r() * 0.2, s: 0.25 + r() * 0.3 }));
      e.g.bolt = null;
    },
    draw(e, ctx, w, h, t, J) {
      const hz = h * 0.64;
      if (!e.g.bolt && Math.random() < 0.012 + (e.storm > 1 ? 0.08 : 0)) {
        const pts = [];
        let x = rand(w * 0.1, w * 0.9);
        for (let y = 0; y < hz; y += h * 0.06) { pts.push([x, y]); x += rand(-30, 30); }
        e.g.bolt = { pts, life: 0 };
        e.flash('#c8c0ff', 0.25);
      }
      ctx.save();
      ctx.translate(J.x * 0.15, J.y * 0.15);
      for (const f of e.g.fleet) {
        const x = ((f.x * (w + 300) + t * 3) % (w + 300)) - 150;
        starDestroyer(ctx, x, f.y * h, f.s, 'rgba(40,34,60,0.95)');
        ctx.fillStyle = 'rgba(255,40,40,0.9)';
        ctx.fillRect(x - 10 * f.s, f.y * h + 10 * f.s, 30 * f.s, 2);
      }
      ctx.restore();
      if (e.g.bolt) {
        e.g.bolt.life += e.dt;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = `rgba(210,200,255,${1 - e.g.bolt.life / 0.35})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#9a8aff';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        e.g.bolt.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.stroke();
        ctx.restore();
        if (e.g.bolt.life > 0.35) e.g.bolt = null;
      }
      ctx.save();
      ctx.translate(J.x * 0.5, J.y * 0.5);
      ctx.fillStyle = '#0c0a18';
      for (const sp of e.g.spires) {
        const x = sp.x * w;
        ctx.beginPath();
        ctx.moveTo(x - 18, hz + 4);
        ctx.lineTo(x - 4, hz - sp.h * h);
        ctx.lineTo(x + 4, hz - sp.h * h);
        ctx.lineTo(x + 18, hz + 4);
        ctx.fill();
        ctx.fillStyle = 'rgba(160,140,255,0.6)';
        ctx.fillRect(x - 1, hz - sp.h * h + 8, 2, 4);
        ctx.fillStyle = '#0c0a18';
      }
      ctx.fillStyle = '#100c20';
      ctx.fillRect(-40, hz, w + 80, h);
      ctx.restore();
      ctx.save();
      ctx.translate(J.x, J.y);
      ctx.fillStyle = '#07060e';
      ctx.fillRect(-40, h * 0.84, w + 80, h * 0.2);
      ctx.strokeStyle = 'rgba(140,120,255,0.35)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo((i / 7) * w, h * 0.84); ctx.lineTo(w / 2 + ((i / 7) - 0.5) * w * 2.4, h); ctx.stroke(); }
      ctx.restore();
    },
  };

  // ---------- Battle of Coruscant (Revenge of the Sith / Battlefront II) ----------
  // Republic Venator: long white dagger with twin bridge towers and a red stripe.
  function venator(ctx, x, y, s, dir, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s * dir, s);
    ctx.fillStyle = 'rgba(40,20,20,0.35)';
    ctx.beginPath(); ctx.moveTo(90, 6); ctx.lineTo(-60, 16); ctx.lineTo(-60, 4); ctx.fill();
    const g = ctx.createLinearGradient(0, -14, 0, 14);
    g.addColorStop(0, '#e8e2dc');
    g.addColorStop(0.55, '#a8a09c');
    g.addColorStop(1, '#4a3a38');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(92, 2);
    ctx.lineTo(-58, -10);
    ctx.lineTo(-64, 0);
    ctx.lineTo(-58, 12);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#c8322a';
    ctx.beginPath(); ctx.moveTo(60, 1); ctx.lineTo(-40, -6); ctx.lineTo(-40, -3); ctx.lineTo(60, 2.5); ctx.fill();
    ctx.fillStyle = '#b8b0aa';
    ctx.fillRect(-48, -20, 7, 12);
    ctx.fillRect(-36, -20, 7, 12);
    ctx.fillRect(-50, -23, 11, 4);
    ctx.fillRect(-38, -23, 11, 4);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) glow(ctx, -66, -5 + i * 6, 7 + Math.sin(t * 9 + i) * 1.5, '#7ab8ff', 0.8);
    ctx.restore();
  }

  // Separatist cruiser (Invisible Hand style): bulbous prow, tall fins, engine bank.
  function sepCruiser(ctx, x, y, s, dir, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s * dir, s);
    const g = ctx.createLinearGradient(0, -12, 0, 12);
    g.addColorStop(0, '#9a9488');
    g.addColorStop(1, '#3a342e');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-80, -4);
    ctx.quadraticCurveTo(40, -10, 72, -7);
    ctx.quadraticCurveTo(92, 0, 72, 8);
    ctx.quadraticCurveTo(40, 10, -80, 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#6e685e';
    ctx.beginPath(); ctx.moveTo(-10, -6); ctx.lineTo(10, -34); ctx.lineTo(22, -34); ctx.lineTo(18, -7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-10, 6); ctx.lineTo(8, 26); ctx.lineTo(18, 26); ctx.lineTo(18, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,190,110,0.8)';
    for (let i = 0; i < 9; i++) ctx.fillRect(-60 + i * 13, -1, 3, 1.5);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 4; i++) glow(ctx, -84, -4 + i * 3.4, 6 + Math.sin(t * 8 + i) * 1.2, '#ffb05a', 0.8);
    ctx.restore();
  }

  // LAAT/i gunship silhouette with blinking nav lights.
  function laat(ctx, x, y, s, dir, t, ph) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s * dir, s);
    ctx.fillStyle = '#2a1e1c';
    ctx.beginPath();
    ctx.moveTo(14, 0); ctx.lineTo(8, -4); ctx.lineTo(-10, -4); ctx.lineTo(-14, -1); ctx.lineTo(-10, 3); ctx.lineTo(10, 3);
    ctx.fill();
    ctx.fillRect(-4, -9, 3, 5);
    ctx.fillRect(-12, -2, 24, 1.5);
    ctx.fillRect(-9, -5, 3, -4);
    const blink = Math.sin(t * 6 + ph) > 0.6;
    if (blink) {
      ctx.fillStyle = '#ff4a3a'; ctx.fillRect(-13, -2.5, 2, 2);
      ctx.fillStyle = '#6aff8a'; ctx.fillRect(11, -2.5, 2, 2);
    }
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, -15, 0, 5, '#ffcf8a', 0.6);
    ctx.restore();
  }

  function smokePlume(ctx, x, base, s, t, ph, dark) {
    for (let i = 0; i < 9; i++) {
      const k = ((t * 0.12 + ph + i / 9) % 1);
      const px = x + Math.sin(k * 5 + ph * 7) * 10 * s + k * 60 * s;
      const py = base - k * 170 * s;
      ctx.fillStyle = dark ? `rgba(18,10,10,${0.5 * (1 - k)})` : `rgba(70,50,44,${0.35 * (1 - k)})`;
      ctx.beginPath(); ctx.arc(px, py, (6 + k * 26) * s, 0, TAU); ctx.fill();
    }
  }

  // Jedi Temple ziggurat with its five spires (Order 66 / Battlefront II assault).
  function jediTemple(ctx, cx, base, s, t, burn) {
    ctx.fillStyle = '#1c1210';
    ctx.beginPath();
    ctx.moveTo(cx - 90 * s, base);
    ctx.lineTo(cx - 62 * s, base - 46 * s);
    ctx.lineTo(cx + 62 * s, base - 46 * s);
    ctx.lineTo(cx + 90 * s, base);
    ctx.fill();
    const spire = (x, hgt, wdt) => {
      ctx.beginPath();
      ctx.moveTo(x - wdt, base - 46 * s);
      ctx.lineTo(x - wdt * 0.5, base - 46 * s - hgt);
      ctx.lineTo(x, base - 52 * s - hgt);
      ctx.lineTo(x + wdt * 0.5, base - 46 * s - hgt);
      ctx.lineTo(x + wdt, base - 46 * s);
      ctx.fill();
    };
    spire(cx, 70 * s, 9 * s);
    spire(cx - 44 * s, 42 * s, 7 * s);
    spire(cx + 44 * s, 42 * s, 7 * s);
    spire(cx - 22 * s, 36 * s, 5 * s);
    spire(cx + 22 * s, 36 * s, 5 * s);
    ctx.fillStyle = `rgba(255,200,120,${0.5 + Math.sin(t * 2) * 0.15})`;
    for (let i = 0; i < 12; i++) ctx.fillRect(cx - 55 * s + i * 10 * s, base - 30 * s, 2, 3);
    if (burn) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, cx - 30 * s, base - 40 * s, 34 * s, '#ff6a1a', 0.5 + Math.sin(t * 7) * 0.1);
      glow(ctx, cx + 38 * s, base - 20 * s, 26 * s, '#ff8a2a', 0.45 + Math.sin(t * 5 + 1) * 0.1);
      ctx.restore();
    }
  }

  THEMES.siege = {
    horizon: 0.64,
    dust: ['#ff9a4a', '#ffd27a', '#6a5a58'],
    weather: { count: 120, spawn: (e) => (Math.random() < 0.55
      ? { x: rand(0, e.w), y: rand(0, e.h), vx: rand(-14, -4), vy: rand(10, 26), size: rand(0.8, 2.2), color: pick(['#5a4a48', '#7a6a66', '#3a302e']), alpha: rand(0.3, 0.6), kind: 'ash' }
      : { x: rand(0, e.w), y: rand(e.h * 0.3, e.h), vx: rand(-12, 12), vy: rand(-40, -14), size: rand(0.7, 1.8), color: pick(['#ffae4a', '#ff7a2a', '#ffd27a']), alpha: rand(0.4, 0.9), kind: 'ember', phase: rand(0, TAU) }) },
    sky: () => [[0, '#120406'], [0.22, '#3a0e0c'], [0.46, '#8a2e14'], [0.6, '#e0742a'], [0.66, '#ffb05a']],
    init(e, r) {
      const mk = (n, minH, maxH, spire) => Array.from({ length: n }, (_, i) => {
        const b = { x: i / n + (r() - 0.5) * 0.02, w: 1 / n * (0.55 + r() * 0.5), h: minH + r() * (maxH - minH), spire: spire && r() > 0.45, fire: r() > 0.72, win: [] };
        for (let k = 0; k < 16; k++) b.win.push([r(), r(), r()]);
        return b;
      });
      e.g.far = mk(26, 0.1, 0.3, true);
      // Leave the middle open so the burning Jedi Temple stays in view.
      e.g.mid = mk(12, 0.12, 0.3, false).filter((b) => Math.abs(b.x + b.w / 2 - 0.5) > 0.2);
      e.g.caps = [
        { side: 'rep', x: 0.16, y: 0.14, s: 0.9, bob: r() * TAU },
        { side: 'rep', x: 0.34, y: 0.27, s: 0.55, bob: r() * TAU },
        { side: 'sep', x: 0.8, y: 0.17, s: 0.85, bob: r() * TAU },
        { side: 'sep', x: 0.62, y: 0.3, s: 0.5, bob: r() * TAU },
      ];
      e.g.bolts = [];
      e.g.flak = [];
      e.g.fall = Array.from({ length: 4 }, () => ({ x: r(), y: -r() * 0.5, vx: 0.02 + r() * 0.05, vy: 0.08 + r() * 0.06, s: 0.6 + r() * 0.9 }));
      e.g.gunships = Array.from({ length: 3 }, (_, i) => ({ ph: r() * 10, y: 0.36 + i * 0.07, sp: 40 + r() * 30, dir: i % 2 ? -1 : 1 }));
      e.g.plumes = Array.from({ length: 5 }, () => ({ x: r(), ph: r(), s: 0.6 + r() * 0.8 }));
      e.g.crash = null;
    },
    draw(e, ctx, w, h, t, J) {
      const hz = h * 0.64;
      const dt = e.dt;
      // Glow of a planet-wide city burning below the clouds.
      glow(ctx, w * 0.5, hz, w * 0.7, '#ff6a1a', 0.3 + Math.sin(t * 0.9) * 0.05);
      // Capital ships trading turbolaser fire.
      ctx.save();
      ctx.translate(J.x * 0.12, J.y * 0.12);
      for (const c of e.g.caps) {
        c.px = c.x * w + Math.sin(t * 0.08 + c.bob) * 18;
        c.py = c.y * h + Math.sin(t * 0.3 + c.bob) * 3;
        const sc = c.s * h / 380;
        if (c.side === 'rep') venator(ctx, c.px, c.py, sc, 1, t);
        else sepCruiser(ctx, c.px, c.py, sc, -1, t);
      }
      if (Math.random() < 0.22 * (e.storm || 1)) {
        const from = pick(e.g.caps);
        const foes = e.g.caps.filter((c) => c.side !== from.side);
        const to = pick(foes);
        const sx = from.px + rand(-40, 40) * from.s;
        const sy = from.py + rand(-6, 6);
        const tx = to.px + rand(-60, 60) * to.s;
        const ty = to.py + rand(-14, 14);
        const d = Math.hypot(tx - sx, ty - sy);
        e.g.bolts.push({ sx, sy, tx, ty, k: 0, sp: 900 / d, color: from.side === 'rep' ? '#ff5a3a' : '#5aff6a', hit: Math.random() < 0.35 });
      }
      ctx.globalCompositeOperation = 'lighter';
      e.g.bolts = e.g.bolts.filter((b) => {
        b.k += b.sp * dt;
        if (b.k >= 1) {
          if (b.hit) e.g.flak.push({ x: b.tx, y: b.ty, life: 0, max: 0.5, r: rand(6, 14), color: '#ffcf8a' });
          return false;
        }
        const x = b.sx + (b.tx - b.sx) * b.k;
        const y = b.sy + (b.ty - b.sy) * b.k;
        const tl = 0.04;
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - (b.tx - b.sx) * tl, y - (b.ty - b.sy) * tl); ctx.stroke();
        return true;
      });
      // Flak bursts across the upper sky.
      if (Math.random() < 0.12) e.g.flak.push({ x: rand(0, w), y: rand(h * 0.05, h * 0.45), life: 0, max: rand(0.35, 0.7), r: rand(4, 10), color: pick(['#ffd27a', '#ff9a4a', '#fff0c0']) });
      e.g.flak = e.g.flak.filter((f) => {
        f.life += dt;
        const k = f.life / f.max;
        glow(ctx, f.x, f.y, f.r * (1 + k * 2.5), f.color, 0.9 * (1 - k));
        return k < 1;
      });
      ctx.globalCompositeOperation = 'source-over';
      for (const f of e.g.flak) {
        const k = f.life / f.max;
        ctx.fillStyle = `rgba(30,20,20,${0.4 * k * (1 - k) * 4})`;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (1 + k * 2), 0, TAU); ctx.fill();
      }
      ctx.restore();
      // Burning wreckage streaking down with smoke trails.
      ctx.save();
      ctx.translate(J.x * 0.2, J.y * 0.2);
      for (const d of e.g.fall) {
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (d.y * h > hz - 10) {
          e.g.flak.push({ x: d.x * w, y: hz - 6, life: 0, max: 0.8, r: 14 * d.s, color: '#ff8a2a' });
          d.x = Math.random() * 0.9; d.y = -0.1 - Math.random() * 0.3; d.vx = 0.02 + Math.random() * 0.05; d.vy = 0.08 + Math.random() * 0.06;
        }
        const x = d.x * w;
        const y = d.y * h;
        const tx = -d.vx * w * 1.6;
        const ty = -d.vy * h * 1.6;
        const sg = ctx.createLinearGradient(x, y, x + tx, y + ty);
        sg.addColorStop(0, 'rgba(60,40,36,0.55)');
        sg.addColorStop(1, 'rgba(60,40,36,0)');
        ctx.strokeStyle = sg;
        ctx.lineWidth = 6 * d.s;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + tx, y + ty); ctx.stroke();
        ctx.globalCompositeOperation = 'lighter';
        const fg = ctx.createLinearGradient(x, y, x + tx * 0.35, y + ty * 0.35);
        fg.addColorStop(0, 'rgba(255,220,140,0.95)');
        fg.addColorStop(1, 'rgba(255,90,20,0)');
        ctx.strokeStyle = fg;
        ctx.lineWidth = 3 * d.s;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + tx * 0.35, y + ty * 0.35); ctx.stroke();
        glow(ctx, x, y, 8 * d.s, '#ffb05a', 0.9);
        ctx.globalCompositeOperation = 'source-over';
      }
      // A big crash triggered by the Falling Wreckage hazard.
      if (e.g.crash) {
        const c = e.g.crash;
        c.life += dt;
        const k = Math.min(1, c.life / c.max);
        const x = c.x0 + (c.x1 - c.x0) * k;
        const y = -40 + (hz + 10) * k * k;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(0.5 + c.life * 1.5);
        ctx.fillStyle = '#4a3e3a';
        ctx.fillRect(-26, -7, 52, 14);
        ctx.fillStyle = '#a8a09c';
        ctx.fillRect(-26, -7, 52, 4);
        ctx.restore();
        ctx.globalCompositeOperation = 'lighter';
        glow(ctx, x, y, 40, '#ff7a2a', 0.8);
        ctx.globalCompositeOperation = 'source-over';
        if (k >= 1) {
          e.blast(x, hz + 12, '#ff7a2a', 2.6);
          e.flash('#ffb05a', 0.4);
          e.g.crash = null;
        }
      }
      ctx.restore();
      // Far skyline with spires and fires.
      const drawBuildings = (list, color, winA, depth, fires) => {
        ctx.save();
        ctx.translate(J.x * depth, J.y * depth);
        for (const b of list) {
          const bx = b.x * w;
          const bw = b.w * w;
          const top = hz + h * 0.08 - b.h * h;
          ctx.fillStyle = color;
          ctx.fillRect(bx, top, bw, h);
          if (b.spire) {
            ctx.beginPath(); ctx.moveTo(bx, top); ctx.lineTo(bx + bw / 2, top - bw * 1.4); ctx.lineTo(bx + bw, top); ctx.fill();
          }
          for (const [wx, wy, ph] of b.win) {
            if (Math.sin(t * 0.5 + ph * 40) < -0.5) continue;
            ctx.fillStyle = ph > 0.4 ? `rgba(255,200,120,${winA})` : `rgba(255,120,60,${winA})`;
            ctx.fillRect(bx + wx * bw * 0.85, top + 4 + wy * b.h * h, 2, 2);
          }
          if (fires && b.fire) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            glow(ctx, bx + bw * 0.5, top + 6, bw * 0.9, '#ff6a1a', 0.55 + Math.sin(t * 8 + b.x * 30) * 0.15);
            ctx.restore();
          }
        }
        ctx.restore();
      };
      drawBuildings(e.g.far, 'rgba(46,18,16,0.92)', 0.45, 0.25, true);
      // Gunships sweeping across the district.
      ctx.save();
      ctx.translate(J.x * 0.35, J.y * 0.35);
      for (const g of e.g.gunships) {
        for (let k = 0; k < 3; k++) {
          const span = w + 240;
          const x = ((((g.ph * 97 + t * g.sp * (e.rush || 1)) * g.dir - k * 26) % span) + span) % span - 120;
          laat(ctx, x, g.y * h + k * 6 + Math.sin(t * 2 + k) * 2, h / 420, g.dir, t, g.ph + k);
        }
      }
      ctx.restore();
      // Smoke plumes rising from the city.
      ctx.save();
      ctx.translate(J.x * 0.4, J.y * 0.4);
      for (const p of e.g.plumes) smokePlume(ctx, p.x * w, hz + h * 0.04, p.s * h / 400, t, p.ph, false);
      ctx.restore();
      // Mid layer: the burning Jedi Temple framed by towers.
      ctx.save();
      ctx.translate(J.x * 0.6, J.y * 0.6);
      jediTemple(ctx, w * 0.5, hz + h * 0.12, h / 360, t, true);
      smokePlume(ctx, w * 0.47, hz - h * 0.02, h / 300, t, 0.2, true);
      ctx.restore();
      drawBuildings(e.g.mid, 'rgba(26,12,12,1)', 0.65, 0.6, true);
      // Foreground landing platform.
      ctx.save();
      ctx.translate(J.x, J.y);
      ctx.fillStyle = '#140a0a';
      ctx.fillRect(-40, h * 0.86, w + 80, h * 0.2);
      ctx.fillStyle = 'rgba(255,140,60,0.55)';
      ctx.fillRect(-40, h * 0.86, w + 80, 2);
      ctx.fillStyle = `rgba(255,70,40,${0.5 + Math.sin(t * 3) * 0.4})`;
      for (let i = 0; i < 6; i++) ctx.fillRect((i + 0.5) * w / 6 - 3, h * 0.86 + 5, 6, 2);
      ctx.restore();
    },
  };

  // ---------- Space (orbit) theme ----------
  const SPACE_NEBULA = {
    tatooine: ['#ff9a4a', '#6a3aa0'], hoth: ['#5aa8ff', '#9fd0ff'], dagobah: ['#4a8a5a', '#2a5a4a'], bespin: ['#ff7a5a', '#c04a8a'],
    geonosis: ['#ff8a4a', '#a04a22'], exegol: ['#6a5aff', '#2a1a6a'], endor: ['#3a8a5a', '#5a6ad0'], scarif: ['#3ab0ff', '#40e0d0'], coruscant: ['#a06aff', '#ff6ab0'], mustafar: ['#ff3a1a', '#8a1a3a'], coruscant_siege: ['#ff6a2a', '#8a2a6a'],
  };

  function spaceInit(e, r) {
    e.g.stars = [0.2, 0.5, 1].map((d) => Array.from({ length: Math.round(90 * (1.2 - d * 0.6)) }, () => ({ x: r(), y: r(), s: 0.4 + d * 1.2, d, tw: r() * TAU })));
    e.g.ships = [{ x: r() * 0.6 + 0.2, y: 0.18 + r() * 0.1, s: 0.5 + r() * 0.3, sp: 3 + r() * 3 }, { x: r(), y: 0.3 + r() * 0.12, s: 0.3, sp: 5 }];
    e.g.rocks = e.planet === 'hoth' ? Array.from({ length: 16 }, () => ({ x: r(), y: r(), s: 4 + r() * 16, rot: r() * TAU, vr: (r() - 0.5) * 0.6, sp: 8 + r() * 20, pts: Array.from({ length: 7 }, () => 0.6 + r() * 0.4) })) : [];
    e.g.skirmish = [];
  }

  function spaceDraw(e, ctx, w, h, t, J) {
    const neb = SPACE_NEBULA[e.planet] || SPACE_NEBULA.tatooine;
    ctx.save();
    ctx.translate(J.x * 0.05, J.y * 0.05);
    glow(ctx, w * (0.3 + Math.sin(t * 0.03) * 0.05), h * 0.3, h * 0.9, neb[0], 0.16);
    glow(ctx, w * 0.8, h * (0.2 + Math.cos(t * 0.04) * 0.05), h * 0.7, neb[1], 0.14);
    ctx.restore();
    e.g.stars.forEach((layer) => {
      ctx.save();
      ctx.translate(J.x * layer[0].d, J.y * layer[0].d);
      for (const s of layer) {
        const y = ((s.y * h + t * 14 * s.d * (e.warp || 1)) % h + h) % h;
        ctx.globalAlpha = 0.5 + Math.sin(t * 2 + s.tw) * 0.3;
        ctx.fillStyle = '#e8f0ff';
        if (e.warp > 1.5 && s.d > 0.4) ctx.fillRect(s.x * w, y - s.s * e.warp * 3, s.s * 0.8, s.s * e.warp * 3);
        else ctx.fillRect(s.x * w, y, s.s, s.s);
      }
      ctx.restore();
    });
    ctx.globalAlpha = 1;
    // The planet you are fighting over.
    ctx.save();
    ctx.translate(J.x * 0.12, J.y * 0.12);
    const pr = h * 0.62;
    const special = e.planet;
    if (special === 'tatooine') {
      glow(ctx, w * 0.86, h * 0.12, h * 0.25, '#fff0c0', 0.6);
      glow(ctx, w * 0.93, h * 0.2, h * 0.18, '#ffe0a0', 0.5);
    }
    drawSphere(ctx, w * 0.12, h * 1.18, pr, e.planet, t, { halo: 0.4 });
    if (special === 'scarif') {
      ctx.strokeStyle = `rgba(160,230,255,${0.35 + Math.sin(t * 2) * 0.1})`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(w * 0.12, h * 1.18, pr * 1.18, pr * 1.1, 0, 0, TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(120,130,150,0.9)';
      ctx.beginPath(); ctx.arc(w * 0.12 + pr * 0.95, h * 1.18 - pr * 0.68, 5, 0, TAU); ctx.fill();
    }
    if (special === 'endor') {
      const dx = w * 0.82;
      const dy = h * 0.28;
      const dr = h * 0.14;
      ctx.fillStyle = 'rgba(150,158,170,0.9)';
      ctx.beginPath(); ctx.arc(dx, dy, dr, Math.PI * 0.15, Math.PI * 1.35); ctx.fill();
      ctx.strokeStyle = 'rgba(150,158,170,0.6)';
      ctx.lineWidth = 1;
      for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.arc(dx, dy, dr * (i / 5), Math.PI * 1.35, Math.PI * 2.15); ctx.stroke(); }
      for (let a = 1.35; a < 2.15; a += 0.12) { ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(dx + Math.cos(a * Math.PI) * dr, dy + Math.sin(a * Math.PI) * dr); ctx.stroke(); }
      ctx.fillStyle = 'rgba(80,200,120,0.9)';
      ctx.beginPath(); ctx.arc(dx - dr * 0.35, dy - dr * 0.3, dr * 0.14, 0, TAU); ctx.fill();
    }
    ctx.restore();
    if (special === 'coruscant_siege') {
      // The whole Republic and Separatist fleets locked in orbit.
      ctx.save();
      ctx.translate(J.x * 0.18, J.y * 0.18);
      const s = h / 520;
      const caps = [[0.3, 0.16, 1, 'rep'], [0.55, 0.42, 0.6, 'rep'], [0.86, 0.26, 1.1, 'sep'], [0.7, 0.08, 0.5, 'sep']];
      e.g.siegeCaps = caps.map(([x, y, sc, side], i) => {
        const px = x * w + Math.sin(t * 0.07 + i) * 20;
        const py = y * h + Math.sin(t * 0.25 + i) * 4;
        if (side === 'rep') venator(ctx, px, py, sc * s, 1, t); else sepCruiser(ctx, px, py, sc * s, -1, t);
        return { px, py, side };
      });
      ctx.restore();
      if (Math.random() < 0.3) {
        const from = pick(e.g.siegeCaps);
        const to = pick(e.g.siegeCaps.filter((c) => c.side !== from.side));
        const d = Math.hypot(to.px - from.px, to.py - from.py) || 1;
        e.g.skirmish.push({ x: from.px + rand(-30, 30), y: from.py, vx: (to.px - from.px) / d * 520, vy: (to.py - from.py) / d * 520, life: 0, max: d / 520, color: from.side === 'rep' ? '#ff5a3a' : '#5aff6a' });
      }
      if (Math.random() < 0.08) e.light(rand(0, w), rand(0, h * 0.6), pick(['#ffb05a', '#ff7a3a']), rand(30, 70), 0.4);
    }
    // Distant capital ships trading fire.
    ctx.save();
    ctx.translate(J.x * 0.25, J.y * 0.25);
    e.g.ships.forEach((s, i) => {
      const x = ((s.x * (w + 300) + t * s.sp) % (w + 300)) - 150;
      starDestroyer(ctx, x, s.y * h, s.s, i ? 'rgba(110,120,140,0.65)' : 'rgba(150,160,178,0.8)');
      s.px = x;
    });
    if (Math.random() < 0.05) {
      const a = e.g.ships[0];
      e.g.skirmish.push({ x: a.px + rand(-30, 30) * a.s, y: a.y * h, vx: rand(-200, 200), vy: rand(40, 120), life: 0, max: 0.6, color: Math.random() > 0.5 ? '#3bff6a' : '#ff3b3b' });
    }
    e.g.skirmish = e.g.skirmish.filter((b) => (b.life += e.dt) < b.max);
    ctx.globalCompositeOperation = 'lighter';
    for (const b of e.g.skirmish) {
      ctx.strokeStyle = hexA(b.color, 1 - b.life / b.max);
      ctx.lineWidth = 1.2;
      const x = b.x + b.vx * b.life;
      const y = b.y + b.vy * b.life;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - b.vx * 0.04, y - b.vy * 0.04); ctx.stroke();
    }
    ctx.restore();
    if (e.g.rocks.length) {
      ctx.save();
      ctx.translate(J.x * 0.8, J.y * 0.8);
      for (const r of e.g.rocks) {
        r.rot += r.vr * e.dt;
        const x = ((r.x * (w + 100) - t * r.sp * (e.storm || 1)) % (w + 100) + (w + 100)) % (w + 100) - 50;
        const y = ((r.y * h + t * r.sp * 0.4 * (e.storm || 1)) % h + h) % h;
        ctx.fillStyle = '#5a5a62';
        ctx.beginPath();
        r.pts.forEach((p, k) => {
          const a = r.rot + (k / r.pts.length) * TAU;
          const px = x + Math.cos(a) * r.s * p;
          const py = y + Math.sin(a) * r.s * p;
          if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
        });
        ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath(); ctx.arc(x + r.s * 0.2, y + r.s * 0.2, r.s * 0.5, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
  }

  // ---------- Hazard animations ----------
  const HAZARDS = {
    sandstorm(e) { e.windBoost = 6; e.overlay = { color: '#c88a4a', a: 0.5, dur: 3 }; e.spawnWeather(160); },
    blizzard(e) { e.windBoost = 5; e.overlay = { color: '#e8f2ff', a: 0.55, dur: 3 }; e.spawnWeather(200); e.storm = 3; },
    vision(e) {
      e.overlay = { color: '#7affb0', a: 0.3, dur: 2.5 };
      for (let i = 0; i < 60; i++) e.fx.push({ x: rand(0, e.w), y: e.h + 10, vx: rand(-10, 10), vy: rand(-90, -40), life: 0, max: rand(1.5, 2.8), size: rand(1, 2.6), color: '#b8ffcf', grav: 0, drag: 0, type: 'glowdot' });
    },
    carbonite(e) { e.flash('#bfe6ff', 0.8); e.overlay = { color: '#9fd8ff', a: 0.35, dur: 2 }; },
    traps(e) {
      e.jolt(10);
      for (let i = 0; i < 70; i++) e.fx.push({ x: rand(0, e.w), y: -10, vx: rand(-40, 40), vy: rand(40, 160), life: 0, max: rand(1.5, 2.5), size: rand(2, 4), color: pick(['#6a8a3a', '#8aa04a', '#5a4a2a']), grav: 40, drag: 0.5, type: 'leaf', rot: rand(0, TAU) });
    },
    orbital(e) {
      const x = rand(e.w * 0.2, e.w * 0.8);
      e.beam = { x, life: 0, max: 0.9 };
      setTimeout(() => e.blast(x, e.h * 0.75, '#9fe0ff', 2.2), 250);
    },
    traffic(e) { e.rush = 5; e.warp = 4; e.overlay = { color: '#ff7ad0', a: 0.18, dur: 2 }; },
    swarm(e) {
      e.jolt(6);
      for (let i = 0; i < 80; i++) e.fx.push({ x: rand(-40, 0), y: rand(0, e.h * 0.8), vx: rand(160, 320), vy: rand(-30, 30), life: 0, max: rand(1.8, 3), size: rand(1.5, 3), color: '#3a2418', grav: 0, drag: 0, type: 'leaf', rot: rand(0, TAU) });
      e.overlay = { color: '#a04a22', a: 0.25, dur: 2 };
    },
    lightning(e) { e.storm = 4; e.flash('#d8d0ff', 0.8); e.jolt(12); e.overlay = { color: '#6a5aff', a: 0.3, dur: 2.5 }; },
    debris(e) {
      if (e.g.fall) {
        e.g.crash = { x0: rand(e.w * 0.1, e.w * 0.5), x1: rand(e.w * 0.4, e.w * 0.9), life: 0, max: 1.1 };
        e.g.fall.forEach((d) => { d.vy *= 2.5; });
      }
      e.overlay = { color: '#ff5a1a', a: 0.22, dur: 2.5 };
      e.jolt(8);
      for (let i = 0; i < 60; i++) e.fx.push({ x: rand(0, e.w), y: -10, vx: rand(-30, 60), vy: rand(80, 220), life: 0, max: rand(1.2, 2.2), size: rand(1.5, 3.5), color: pick(['#ffae4a', '#ff6a1a', '#5a4a48']), grav: 120, drag: 0.2, type: i % 3 ? 'ember' : 'debris', rot: rand(0, TAU) });
      setTimeout(() => e.blast(rand(e.w * 0.2, e.w * 0.8), e.h * 0.8, '#ff7a2a', 1.8), 700);
    },
    eruption(e) { if (e.g.erupt != null) e.g.erupt = 1; e.jolt(16); e.flash('#ff5a1a', 0.5); e.overlay = { color: '#ff3a0a', a: 0.3, dur: 3 }; },
  };

  // ---------- Environment ----------
  class Env {
    constructor(canvas, planetId, mode, opts = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.planet = planetId;
      this.mode = mode === 'space' ? 'space' : 'ground';
      const planet = root.GameData && root.GameData.PLANET_MAP[planetId];
      this.theme = this.mode === 'space' ? null : THEMES[planet ? planet.env : 'desert'];
      this.static = !!opts.static;
      this.g = {};
      this.fx = [];
      this.weatherP = [];
      this.lights = [];
      this.decals = [];
      this.rings = [];
      this.J = { x: 0, y: 0, vx: 0, vy: 0 };
      this.flashC = null;
      this.chargeA = 0;
      this.chargeTarget = 0;
      this.chargeColor = '#ffffff';
      this.mood = null;
      this.t = 0;
      this.dt = 0.016;
      this.windBoost = 0;
      this.rush = 1;
      this.warp = 1;
      this.storm = 1;
      this.reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.resize();
      const r = seeded(planetId.length * 131 + (this.mode === 'space' ? 7 : 3));
      if (this.mode === 'space') spaceInit(this, r);
      else this.theme.init(this, r);
      this.spawnWeather();
      this.onResize = () => this.resize();
      window.addEventListener('resize', this.onResize);
      this.running = true;
      this.last = performance.now();
      this.frame = this.frame.bind(this);
      requestAnimationFrame(this.frame);
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.w = Math.max(1, rect.width);
      this.h = Math.max(1, rect.height);
      this.dpr = Math.min(1.5, window.devicePixelRatio || 1);
      this.canvas.width = Math.round(this.w * this.dpr);
      this.canvas.height = Math.round(this.h * this.dpr);
      this.skyGrad = null;
    }

    spawnWeather(extra) {
      const spec = this.mode === 'space'
        ? { count: 50, spawn: (e) => ({ x: rand(0, e.w), y: rand(0, e.h), vx: 0, vy: rand(160, 320), size: rand(0.5, 1.2), color: '#cfe0ff', alpha: rand(0.15, 0.4), kind: 'streak' }) }
        : this.theme.weather;
      const n = extra || spec.count;
      for (let i = 0; i < n; i++) {
        const p = spec.spawn(this);
        if (p) {
          p.temp = !!extra;
          p.life = 0;
          this.weatherP.push(p);
        }
      }
    }

    stop() {
      this.running = false;
      window.removeEventListener('resize', this.onResize);
    }

    // ---------- Reactions ----------
    jolt(power) {
      if (this.reduced) return;
      const a = rand(0, TAU);
      this.J.vx += Math.cos(a) * power * 60;
      this.J.vy += Math.sin(a) * power * 60;
    }

    light(x, y, color, radius, dur) {
      this.lights.push({ x, y, color, r: radius || 120, life: 0, max: dur || 0.35 });
    }

    flash(color, a) {
      this.flashC = { color, a: a || 0.5 };
    }

    // Push weather particles away from a blast.
    push(x, y, power) {
      const R = 160 * power;
      for (const p of this.weatherP) {
        const dx = p.x - x;
        const dy = p.y - y;
        const d = Math.hypot(dx, dy);
        if (d < R && d > 0.1) {
          const f = (1 - d / R) * 420 * power;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
      }
    }

    impact(x, y, opts = {}) {
      const power = opts.power || 1;
      const color = opts.color || '#ffb24a';
      const n = Math.round(10 * power);
      const colors = this.mode === 'space' ? ['#ffb24a', '#ffd27a', '#ff7a3a'] : this.theme.dust;
      for (let i = 0; i < n; i++) {
        const a = rand(0, TAU);
        const sp = rand(40, 180) * power;
        this.fx.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (this.mode === 'space' ? 0 : 60), life: 0, max: rand(0.5, 1.1), size: rand(1.2, 3.2), color: pick(colors), grav: this.mode === 'space' ? 0 : 220, drag: 1.2, type: 'dust' });
      }
      if (this.mode === 'space' && power > 0.8) {
        for (let i = 0; i < 4; i++) this.fx.push({ x, y, vx: rand(-90, 90), vy: rand(-90, 90), life: 0, max: rand(1.2, 2), size: rand(2, 5), color: '#6a6f7a', grav: 0, drag: 0.2, type: 'debris', rot: rand(0, TAU) });
      }
      this.light(x, y, color, 90 + 60 * power, 0.3 + 0.1 * power);
      this.push(x, y, 0.6 * power);
      this.jolt(0.8 * power);
    }

    blast(x, y, color, power) {
      const p = power || 1.5;
      this.impact(x, y, { power: p, color });
      this.rings.push({ x, y, life: 0, max: 0.7, r: 30 + 60 * p, color: color || '#ffb24a' });
      for (let i = 0; i < 8 * p; i++) this.fx.push({ x: x + rand(-10, 10), y: y + rand(-6, 6), vx: rand(-20, 20), vy: rand(-50, -20), life: 0, max: rand(1.8, 3.5), size: rand(8, 18), color: '#2a2a2e', grav: -6, drag: 0.4, type: 'smoke' });
      if (this.mode === 'ground' && y > this.h * this.theme.horizon) this.decals.push({ x, y: y + 12, r: 14 + 10 * p, life: 0, max: 14 });
      this.jolt(2 * p);
      this.flash(color || '#ffb24a', 0.15 * p);
    }

    charge(color) {
      this.chargeTarget = 1;
      this.chargeColor = color || '#ffffff';
    }

    release() {
      this.chargeTarget = 0;
      this.flash(this.chargeColor, 0.55);
      this.push(this.w / 2, this.h / 2, 3);
      this.jolt(4);
    }

    setMood(color) {
      this.mood = color;
    }

    hazard(id) {
      const fn = HAZARDS[id];
      if (fn) fn(this);
    }

    // ---------- Frame ----------
    frame(now) {
      if (!this.running) return;
      if (!this.canvas.isConnected) return this.stop();
      this.dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.t += this.reduced ? this.dt * 0.2 : this.dt;
      this.update();
      this.draw();
      if (!this.static || this.t < 0.1) requestAnimationFrame(this.frame);
      else setTimeout(() => requestAnimationFrame(this.frame), 60);
    }

    update() {
      const dt = this.dt;
      const J = this.J;
      J.vx += -J.x * 90 * dt;
      J.vy += -J.y * 90 * dt;
      J.vx *= Math.pow(0.02, dt);
      J.vy *= Math.pow(0.02, dt);
      J.x += J.vx * dt;
      J.y += J.vy * dt;
      this.windBoost = Math.max(0, this.windBoost - dt * 1.5);
      this.rush = Math.max(1, this.rush - dt * 1.8);
      this.warp = Math.max(1, this.warp - dt * 1.5);
      this.storm = Math.max(1, this.storm - dt * 0.8);
      this.chargeA += (this.chargeTarget - this.chargeA) * Math.min(1, dt * 4);
      if (this.overlay) {
        this.overlay.dur -= dt;
        if (this.overlay.dur <= 0) this.overlay = null;
      }
      if (this.beam) {
        this.beam.life += dt;
        if (this.beam.life > this.beam.max) this.beam = null;
      }
      const w = this.w;
      const h = this.h;
      const wind = this.windBoost * 60;
      this.weatherP = this.weatherP.filter((p) => {
        p.life += dt;
        if (p.temp && p.life > 3) return false;
        p.vx += (p.kind === 'snow' ? Math.sin(this.t + p.x * 0.05) * 6 : 0) * dt + wind * dt * 4;
        const base = p.kind === 'sand' ? 90 : p.kind === 'snow' ? 0 : 0;
        p.vx += ((base + (p.kind === 'snow' ? 0 : 0)) - p.vx) * 0.02 * (p.kind === 'sand' ? 1 : 0);
        if (p.kind === 'snow' || p.kind === 'ash') {
          p.vx *= 0.98;
          p.vy += ((p.kind === 'snow' ? 20 + (p.depth || 0.5) * 40 : 18) - p.vy) * 0.03;
        }
        if (p.kind === 'firefly' || p.kind === 'spore' || p.kind === 'sparkle') {
          p.vx += Math.sin(this.t * 1.3 + p.phase) * 3 * dt;
          p.vy += Math.cos(this.t * 1.1 + p.phase) * 3 * dt;
          p.vx *= 0.97;
          p.vy *= 0.97;
        }
        if (p.kind === 'ember') p.vy += (-26 - p.vy) * 0.02;
        if (p.kind === 'rain') { p.vy += (450 - p.vy) * 0.05; p.vx += (-30 - p.vx) * 0.05; }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x > w + 20) p.x = -20;
        if (p.x < -20) p.x = w + 20;
        if (p.y > h + 20) { p.y = -20; if (p.kind === 'streak' || p.kind === 'rain') p.x = rand(0, w); }
        if (p.y < -30) p.y = h + 10;
        return true;
      });
      this.fx = this.fx.filter((p) => {
        p.life += dt;
        if (p.life > p.max) return false;
        p.vy += (p.grav || 0) * dt;
        const drag = Math.pow(1 - Math.min(0.9, (p.drag || 0) * dt), 1);
        p.vx *= drag;
        p.vy *= drag;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.rot != null) p.rot += dt * 3;
        return true;
      });
      if (this.fx.length > 700) this.fx.splice(0, this.fx.length - 700);
      this.lights = this.lights.filter((l) => (l.life += dt) < l.max);
      this.rings = this.rings.filter((r) => (r.life += dt) < r.max);
      this.decals = this.decals.filter((d) => (d.life += dt) < d.max);
      if (this.flashC) {
        this.flashC.a -= dt * 1.6;
        if (this.flashC.a <= 0) this.flashC = null;
      }
    }

    draw() {
      const ctx = this.ctx;
      const w = this.w;
      const h = this.h;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      const J = { x: this.J.x, y: this.J.y };
      if (this.mode === 'space') {
        ctx.fillStyle = '#03050b';
        ctx.fillRect(0, 0, w, h);
        spaceDraw(this, ctx, w, h, this.t, J);
      } else {
        if (!this.skyGrad) this.skyGrad = vGrad(ctx, h, this.theme.sky(this));
        ctx.fillStyle = this.skyGrad;
        ctx.fillRect(0, 0, w, h);
        this.theme.draw(this, ctx, w, h, this.t, J);
        // Scorch marks on the ground.
        ctx.save();
        ctx.translate(J.x, J.y);
        for (const d of this.decals) {
          const a = 0.45 * (1 - d.life / d.max);
          ctx.fillStyle = `rgba(20,14,10,${a})`;
          ctx.beginPath();
          ctx.ellipse(d.x, d.y, d.r * 1.6, d.r * 0.45, 0, 0, TAU);
          ctx.fill();
        }
        ctx.restore();
      }

      // Weather.
      ctx.save();
      for (const p of this.weatherP) {
        let a = p.alpha;
        if (p.kind === 'firefly') a = Math.max(0, Math.sin(this.t * 2 + p.phase)) * 0.9;
        if (p.temp) a *= Math.max(0, 1 - p.life / 3);
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        if (p.kind === 'sand' || p.kind === 'streak' || p.kind === 'rain') {
          const len = p.kind === 'streak' ? p.vy * 0.03 : p.kind === 'rain' ? 12 : 3 + this.windBoost * 3;
          if (p.kind === 'streak' || p.kind === 'rain') ctx.fillRect(p.x, p.y, p.size, len);
          else ctx.fillRect(p.x, p.y, len, p.size);
        } else if (p.kind === 'firefly' || p.kind === 'ember' || p.kind === 'spore' || p.kind === 'sparkle') {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, TAU); ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, TAU); ctx.fill();
        }
      }
      ctx.restore();

      // Effect particles.
      ctx.save();
      for (const p of this.fx) {
        const k = 1 - p.life / p.max;
        ctx.globalAlpha = p.type === 'smoke' ? k * 0.45 : k;
        ctx.fillStyle = p.color;
        if (p.type === 'smoke') {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1.6 - k * 0.6), 0, TAU); ctx.fill();
        } else if (p.type === 'leaf' || p.type === 'debris') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillRect(-p.size, -p.size * 0.4, p.size * 2, p.size * 0.8);
          ctx.restore();
        } else {
          if (p.type === 'ember' || p.type === 'glowdot') { ctx.shadowColor = p.color; ctx.shadowBlur = 8; }
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, TAU); ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      ctx.restore();

      // Lights illuminate the scene.
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const l of this.lights) glow(ctx, l.x, l.y, l.r, l.color, 0.55 * (1 - l.life / l.max));
      for (const r of this.rings) {
        const k = r.life / r.max;
        ctx.strokeStyle = hexA(r.color, 0.7 * (1 - k));
        ctx.lineWidth = 3 * (1 - k) + 1;
        ctx.beginPath(); ctx.ellipse(r.x, r.y, r.r * (0.3 + k * 1.5), r.r * (0.3 + k * 1.5) * (this.mode === 'ground' ? 0.45 : 1), 0, 0, TAU); ctx.stroke();
      }
      if (this.beam) {
        const k = this.beam.life / this.beam.max;
        const bw = 26 * Math.sin(k * Math.PI);
        const g = ctx.createLinearGradient(this.beam.x - bw, 0, this.beam.x + bw, 0);
        g.addColorStop(0, 'rgba(160,230,255,0)');
        g.addColorStop(0.5, 'rgba(230,250,255,0.95)');
        g.addColorStop(1, 'rgba(160,230,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(this.beam.x - bw, 0, bw * 2, h * 0.78);
      }
      ctx.restore();

      // Hazard overlay, ultimate charge, mood and flash.
      if (this.overlay) {
        ctx.fillStyle = hexA(this.overlay.color, this.overlay.a * Math.min(1, this.overlay.dur));
        ctx.fillRect(0, 0, w, h);
      }
      if (this.mood) {
        ctx.fillStyle = hexA(this.mood, 0.14 + Math.sin(this.t * 3) * 0.04);
        ctx.fillRect(0, 0, w, h);
      }
      if (this.chargeA > 0.01) {
        ctx.fillStyle = `rgba(0,0,0,${0.55 * this.chargeA})`;
        ctx.fillRect(0, 0, w, h);
        const g = ctx.createRadialGradient(w / 2, h / 2, h * 0.1, w / 2, h / 2, Math.max(w, h) * 0.7);
        g.addColorStop(0, hexA(this.chargeColor, 0));
        g.addColorStop(1, hexA(this.chargeColor, 0.35 * this.chargeA));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      if (this.flashC) {
        ctx.fillStyle = hexA(this.flashC.color, Math.max(0, this.flashC.a));
        ctx.fillRect(0, 0, w, h);
      }
    }
  }

  // ---------- Per-planet progress rings ----------
  // Every world shows its stages as its own themed segments around the sphere.
  const PROGRESS_STYLE = {
    tatooine: 'suns', hoth: 'shards', dagobah: 'leaves', bespin: 'clouds', endor: 'chevrons', scarif: 'hex',
    coruscant: 'lights', geonosis: 'spikes', mustafar: 'flames', exegol: 'bolts', coruscant_siege: 'blasts',
  };
  function glyph(ctx, style, s, lit) {
    ctx.beginPath();
    switch (style) {
      case 'suns': ctx.arc(-s * 0.35, 0, s * 0.42, 0, TAU); ctx.moveTo(s * 0.62, 0); ctx.arc(s * 0.4, 0, s * 0.28, 0, TAU); break;
      case 'shards': ctx.moveTo(0, -s); ctx.lineTo(s * 0.45, 0); ctx.lineTo(0, s); ctx.lineTo(-s * 0.45, 0); break;
      case 'leaves': ctx.moveTo(0, -s); ctx.quadraticCurveTo(s * 0.8, 0, 0, s); ctx.quadraticCurveTo(-s * 0.8, 0, 0, -s); break;
      case 'clouds': ctx.arc(-s * 0.3, s * 0.1, s * 0.4, 0, TAU); ctx.arc(s * 0.25, -s * 0.05, s * 0.48, 0, TAU); break;
      case 'chevrons': ctx.moveTo(-s * 0.6, -s * 0.5); ctx.lineTo(0, s * 0.3); ctx.lineTo(s * 0.6, -s * 0.5); ctx.lineTo(s * 0.6, 0); ctx.lineTo(0, s * 0.8); ctx.lineTo(-s * 0.6, 0); break;
      case 'hex': for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU; ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * s * 0.7, Math.sin(a) * s * 0.7); } break;
      case 'lights': ctx.rect(-s * 0.25, -s * 0.9, s * 0.5, s * 1.8); break;
      case 'spikes': ctx.moveTo(-s * 0.5, s * 0.7); ctx.lineTo(0, -s); ctx.lineTo(s * 0.5, s * 0.7); break;
      case 'flames': ctx.moveTo(0, -s); ctx.quadraticCurveTo(s * 0.7, s * 0.2, 0, s * 0.8); ctx.quadraticCurveTo(-s * 0.7, s * 0.2, 0, -s); break;
      case 'bolts': ctx.moveTo(s * 0.2, -s); ctx.lineTo(-s * 0.4, s * 0.1); ctx.lineTo(s * 0.05, s * 0.1); ctx.lineTo(-s * 0.2, s); ctx.lineTo(s * 0.45, -s * 0.15); ctx.lineTo(0, -s * 0.15); break;
      case 'blasts': for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU; const rr = i % 2 ? s * 0.4 : s; ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * rr, Math.sin(a) * rr); } break;
      default: ctx.arc(0, 0, s * 0.5, 0, TAU);
    }
    ctx.closePath();
    if (lit) ctx.fill(); else ctx.stroke();
  }
  function drawProgress(ctx, p, x, y, r, cleared, t) {
    const n = p.stages.length;
    const style = PROGRESS_STYLE[p.id] || 'dots';
    const color = p.color || '#ffd23f';
    const done = cleared >= n;
    const R = r + 12;
    const s = Math.max(4, Math.min(8, r * 0.2));
    ctx.save();
    // Thin track the glyphs sit on.
    ctx.strokeStyle = hexA(color, 0.18);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.stroke();
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i / n) * TAU + (done ? t * 0.25 : 0);
      const lit = i < cleared;
      const next = i === cleared;
      ctx.save();
      ctx.translate(x + Math.cos(a) * R, y + Math.sin(a) * R);
      ctx.rotate(a + Math.PI / 2);
      const pulse = next ? 1 + Math.sin(t * 5) * 0.25 : 1;
      ctx.scale(pulse, pulse);
      ctx.fillStyle = done ? '#ffffff' : color;
      ctx.strokeStyle = next ? hexA(color, 0.95) : 'rgba(255,255,255,0.28)';
      ctx.lineWidth = 1;
      if (lit || next) { ctx.shadowColor = color; ctx.shadowBlur = lit ? 8 : 12; }
      glyph(ctx, style, s, lit);
      ctx.restore();
    }
    if (done) {
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, x, y, R * 1.4, color, 0.18 + Math.sin(t * 2) * 0.06);
    }
    ctx.restore();
  }

  // ---------- Galaxy Map ----------
  class GalaxyMap {
    constructor(canvas, planets, getState) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.planets = planets;
      this.getState = getState;
      this.t = 0;
      this.hover = null;
      const r = seeded(4242);
      this.stars = Array.from({ length: 700 }, () => {
        const arm = Math.floor(r() * 3);
        const d = Math.pow(r(), 0.7);
        const a = arm * (TAU / 3) + d * 5.2 + (r() - 0.5) * 0.6;
        return { a, d, s: r() * 1.3 + 0.2, c: r() > 0.85 ? '#ffd9a8' : r() > 0.7 ? '#a8c8ff' : '#ffffff', tw: r() * TAU };
      });
      // Drifting nebula clouds and the odd comet.
      this.nebulae = Array.from({ length: 7 }, () => ({ x: r(), y: r(), rad: 0.18 + r() * 0.25, c: pick(['#6a3aa0', '#2a6ad0', '#c04a8a', '#3aa08a', '#d07a3a']), sp: (r() - 0.5) * 0.004, ph: r() * TAU }));
      this.comets = [];
      this.resize();
      this.onResize = () => this.resize();
      window.addEventListener('resize', this.onResize);
      this.last = performance.now();
      this.frame = this.frame.bind(this);
      requestAnimationFrame(this.frame);
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.w = Math.max(1, rect.width);
      this.h = Math.max(1, rect.height);
      this.dpr = Math.min(1.5, window.devicePixelRatio || 1);
      this.canvas.width = Math.round(this.w * this.dpr);
      this.canvas.height = Math.round(this.h * this.dpr);
    }

    frame(now) {
      if (!this.canvas.isConnected) {
        window.removeEventListener('resize', this.onResize);
        return;
      }
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.t += dt;
      this.draw();
      requestAnimationFrame(this.frame);
    }

    draw() {
      const { ctx, w, h, t } = this;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.fillStyle = '#04060d';
      ctx.fillRect(0, 0, w, h);
      const cx = w * 0.5;
      const cy = h * 0.5;
      const R = Math.max(w, h) * 0.62;
      glow(ctx, cx, cy, R * 0.45, '#ffd9a8', 0.18);
      glow(ctx, cx, cy, R * 0.9, '#6a5aff', 0.08);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const n of this.nebulae) {
        const nx = ((n.x + t * n.sp) % 1 + 1) % 1;
        glow(ctx, nx * w, n.y * h, n.rad * Math.max(w, h), n.c, 0.07 + Math.sin(t * 0.4 + n.ph) * 0.025);
      }
      ctx.restore();
      if (Math.random() < 0.004) this.comets.push({ x: Math.random() * w, y: -10, vx: (Math.random() - 0.5) * 220, vy: 120 + Math.random() * 120, life: 0 });
      this.comets = this.comets.filter((c) => (c.life += 0.016) < 3 && c.y < h + 40);
      for (const c of this.comets) {
        c.x += c.vx * 0.016;
        c.y += c.vy * 0.016;
        const g = ctx.createLinearGradient(c.x, c.y, c.x - c.vx * 0.35, c.y - c.vy * 0.35);
        g.addColorStop(0, 'rgba(220,240,255,0.9)');
        g.addColorStop(1, 'rgba(120,180,255,0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x - c.vx * 0.35, c.y - c.vy * 0.35); ctx.stroke();
        glow(ctx, c.x, c.y, 6, '#dff0ff', 0.8);
      }
      for (const s of this.stars) {
        const a = s.a + t * 0.01;
        const x = cx + Math.cos(a) * s.d * R;
        const y = cy + Math.sin(a) * s.d * R * 0.55;
        ctx.globalAlpha = 0.35 + Math.sin(t * 1.5 + s.tw) * 0.25;
        ctx.fillStyle = s.c;
        ctx.fillRect(x, y, s.s, s.s);
      }
      ctx.globalAlpha = 1;
      const st = this.getState();
      const pos = this.planets.map((p) => ({ p, x: (p.map.x / 100) * w, y: (p.map.y / 100) * h }));
      // Hyperspace lanes.
      for (let i = 1; i < pos.length; i++) {
        const a = pos[i - 1];
        const b = pos[i];
        const open = st.unlocked(b.p.id);
        ctx.strokeStyle = open ? 'rgba(255,210,63,0.55)' : 'rgba(140,150,180,0.2)';
        ctx.lineWidth = open ? 2 : 1;
        ctx.setLineDash(open ? [] : [4, 6]);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 - 30, b.x, b.y);
        ctx.stroke();
        if (open) {
          const k = (t * 0.35 + i * 0.2) % 1;
          const mx = (1 - k) * (1 - k) * a.x + 2 * (1 - k) * k * ((a.x + b.x) / 2) + k * k * b.x;
          const my = (1 - k) * (1 - k) * a.y + 2 * (1 - k) * k * ((a.y + b.y) / 2 - 30) + k * k * b.y;
          glow(ctx, mx, my, 10, '#ffd23f', 0.9);
        }
      }
      ctx.setLineDash([]);
      const r0 = Math.min(w, h) * 0.055;
      for (const { p, x, y } of pos) {
        const unlocked = st.unlocked(p.id);
        const current = st.current === p.id;
        const r = r0 * (current ? 1.25 : 1) * (this.hover === p.id ? 1.12 : 1);
        if (current) {
          ctx.strokeStyle = `rgba(255,210,63,${0.5 + Math.sin(t * 3) * 0.3})`;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(x, y, r * 1.5 + Math.sin(t * 3) * 3, 0, TAU); ctx.stroke();
        }
        ctx.globalAlpha = unlocked ? 1 : 0.35;
        drawSphere(ctx, x, y, r, p.id, t, { halo: unlocked ? 0.45 : 0.1 });
        ctx.globalAlpha = 1;
        if (unlocked) drawProgress(ctx, p, x, y, r, st.cleared(p.id), t);
      }
    }
  }

  root.Env = Env;
  root.GalaxyMap = GalaxyMap;
  root.drawPlanetSphere = drawSphere;
})(window);
