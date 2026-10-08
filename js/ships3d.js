// Detailed ships drawn from simple 3D models: each part is built in ship
// space, projected top-down (nose up, like every card) with a slight tilt for
// depth, then painted back to front. P3 is the projector, Ships3 the models.
// Tiny 3D helper for drawing ships at a three-quarter angle: parts are built
// in ship space (x forward, y right, z up), projected once, auto-fitted into
// the 100x100 frame and painted back to front.
(function (root) {
  let seq = 0;
  const f = (n) => Math.round(n * 10) / 10;
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const toHex = (c) => '#' + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  // k > 0 lightens toward white, k < 0 darkens toward black
  const tone = (h, k) => toHex(hex(h).map((v) => (k >= 0 ? v + (255 - v) * k : v * (1 + k))));
  const norm = (v) => { const l = Math.hypot(...v) || 1; return v.map((n) => n / l); };
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

  function hull(pts) {
    const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (p.length < 3) return p;
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = []; const up = [];
    for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (const q of p.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  // Douglas-Peucker: drop points that sit within a hair of the line between their neighbours
  function simplify(pts, tol = 0.12) {
    if (pts.length < 6) return pts;
    const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
    const stack = [[0, pts.length - 1]];
    while (stack.length) {
      const [a, b] = stack.pop(); const A = pts[a]; const B = pts[b];
      const dx = B[0] - A[0]; const dy = B[1] - A[1]; const L = Math.hypot(dx, dy) || 1e-9;
      let best = -1; let bi = -1;
      for (let i = a + 1; i < b; i++) { const d = Math.abs((pts[i][0] - A[0]) * dy - (pts[i][1] - A[1]) * dx) / L; if (d > best) { best = d; bi = i; } }
      if (best > tol) { keep[bi] = 1; stack.push([a, bi], [bi, b]); }
    }
    return pts.filter((_, i) => keep[i]);
  }
  const poly = (pts, close = true) => 'M' + simplify(pts).map((q) => f(q[0]) + ' ' + f(q[1])).join(' L') + (close ? 'Z' : '');

  function scene(opts) {
    const yaw = opts.yaw * Math.PI / 180; const pitch = opts.pitch * Math.PI / 180;
    const cy = Math.cos(yaw); const sy = Math.sin(yaw); const cp = Math.cos(pitch); const sp = Math.sin(pitch);
    const rl = (opts.roll || 0) * Math.PI / 180; const cr = Math.cos(rl); const sr = Math.sin(rl);
    const raw = ([x, y0, z0]) => { const y = y0 * cr - z0 * sr; const z = y0 * sr + z0 * cr; const x1 = x * cy - y * sy; const y1 = x * sy + y * cy; return [x1, -(z * cp + y1 * sp), y1 * cp - z * sp]; };
    const tv = [-sy * cp, -cy * cp, sp]; const toViewer = [tv[0], tv[1] * cr + tv[2] * sr, -tv[1] * sr + tv[2] * cr];
    const light = norm(opts.light || [0.3, -0.5, 0.8]);
    const parts = [];
    const defs = [];
    const id = () => 'p3' + (++seq).toString(36);
    const S = {
      tone, toViewer, light, defs, id,
      // generic gradient in user space between two projected ship-space points
      grad(stops, a, b) { const n = id(); S._grads.push([n, stops, a, b]); return `url(#${n})`; },
      _grads: [],
      // a body of revolution: profile rows are [x, halfWidth, halfHeight, zCenter, yCenter]
      body(profile, o = {}) {
        const N = o.n || 28; const rings = profile.map(([x, w, h, zc = 0, yc = 0]) => {
          const ring = [];
          for (let i = 0; i < N; i++) { const t = (i / N) * Math.PI * 2; ring.push({ p: [x, yc + w * Math.cos(t), zc + h * Math.sin(t)], n: norm([0, Math.cos(t) / (w || 1), Math.sin(t) / (h || 1)]), t }); }
          return ring;
        });
        parts.push({ kind: 'body', rings, o, z: o.z });
        return rings;
      },
      // flat polygon in ship space (a wing, a panel)
      face(pts, color, o = {}) { parts.push({ kind: 'face', pts, color, o, z: o.z }); },
      // an axis-aligned-ish box from 8 corners or [x0,x1,y0,y1,z0,z1]
      box(b, color, o = {}) {
        const [x0, x1, y0, y1, z0, z1] = b;
        const c = (x, y, z) => [x, y, z];
        const F = [
          [c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1), c(x1, y0, z1)], [c(x0, y0, z0), c(x0, y0, z1), c(x0, y1, z1), c(x0, y1, z0)],
          [c(x0, y1, z0), c(x0, y1, z1), c(x1, y1, z1), c(x1, y1, z0)], [c(x0, y0, z0), c(x1, y0, z0), c(x1, y0, z1), c(x0, y0, z1)],
          [c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1)], [c(x0, y0, z0), c(x0, y1, z0), c(x1, y1, z0), c(x1, y0, z0)],
        ];
        parts.push({ kind: 'solid', faces: F, color, o, z: o.z });
      },
      // a closed solid from a list of quads/polys (already wound outward)
      solid(faces, color, o = {}) { parts.push({ kind: 'solid', faces, color, o, z: o.z }); },
      // a thin plate: polygon top at its z, extruded down by thick
      plate(pts, thick, color, o = {}) {
        const bot = pts.map(([x, y, z]) => [x, y, z - thick]);
        const faces = [{ pts, fill: o.top, after: o.topAfter }, { pts: bot.slice().reverse() }];
        for (let i = 0; i < pts.length; i++) { const j = (i + 1) % pts.length; faces.push({ pts: [pts[i], pts[j], bot[j], bot[i]] }); }
        parts.push({ kind: 'solid', faces, color, o, z: o.z });
      },
      // loft: sections [x, [[y,z],...], zc?] with matching point counts; faces between neighbours plus end caps.
      // o.fill(seg, k) may return a fill for a side face; o.after(seg, k, pts3) may add markup on it.
      loft(sections, color, o = {}) {
        const S3 = sections.map(([x, pts, zc = 0, yc = 0]) => pts.map(([y, z]) => [x, yc + y, zc + z]));
        const faces = [];
        for (let i = 0; i < S3.length - 1; i++) {
          const A = S3[i]; const B = S3[i + 1]; const n = A.length;
          for (let k = 0; k < n; k++) { const j = (k + 1) % n; faces.push({ pts: [A[k], A[j], B[j], B[k]], fill: o.fill && o.fill(i, k), color: o.color && o.color(i, k), after: o.after && ((pr, sc) => o.after(i, k, [A[k], A[j], B[j], B[k]], pr, sc)) }); }
        }
        faces.push({ pts: S3[0].slice().reverse(), fill: o.capFill && o.capFill(0) }); faces.push({ pts: S3[S3.length - 1], fill: o.capFill && o.capFill(1) });
        parts.push({ kind: 'solid', faces, color, o, z: o.z });
        return S3;
      },
      // raw svg painted at a ship-space anchor; fn(pt, scale) returns markup
      at(p3, fn, o = {}) { parts.push({ kind: 'at', p: p3, fn, o, z: o.z }); },
      render(box = [5, 5, 95, 95]) {
        // fit
        const all = [];
        for (const pt of parts) {
          if (pt.kind === 'body') pt.rings.forEach((r) => r.forEach((q) => all.push(raw(q.p))));
          else if (pt.kind === 'face') pt.pts.forEach((q) => all.push(raw(q)));
          else if (pt.kind === 'solid') pt.faces.forEach((fc) => (fc.pts || fc).forEach((q) => all.push(raw(q))));
        }
        const xs = all.map((q) => q[0]); const ys = all.map((q) => q[1]);
        const [mx, Mx, my, My] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
        const s = Math.min((box[2] - box[0]) / (Mx - mx), (box[3] - box[1]) / (My - my));
        const ox = (box[0] + box[2]) / 2 - ((mx + Mx) / 2) * s; const oy = (box[1] + box[3]) / 2 - ((my + My) / 2) * s;
        const pr = (q) => { const r = raw(q); return [ox + r[0] * s, oy + r[1] * s, r[2]]; };
        S.pr = pr; S.scale = s;
        const lit = (n) => dot(n, light);
        const vis = (n) => dot(n, toViewer) > 0;
        const out = [];
        for (const pt of parts) {
          let depth; let svg = '';
          if (pt.kind === 'body') {
            const P2 = pt.rings.map((r) => r.map((q) => pr(q.p)));
            depth = pt.z != null ? pt.z : P2.flat().reduce((a, q) => a + q[2], 0) / P2.flat().length;
            const pick = (fn) => { const pts = []; pt.rings.forEach((r, i) => r.forEach((q, j) => { if (fn(q)) pts.push(P2[i][j]); })); return pts; };
            const o = pt.o; const base = o.color || '#c8ced6';
            const outline = hull(P2.flat());
            if (o.band) { const vr = (i) => { const seg = []; pt.rings[i].forEach((q, j) => { if (vis(q.n)) seg.push([j, P2[i][j]]); }); const N = pt.rings[i].length; let st = 0; for (let k = 0; k < seg.length; k++) { if ((seg[k][0] + 1) % N !== seg[(k + 1) % seg.length][0]) { st = (k + 1) % seg.length; break; } } return seg.slice(st).concat(seg.slice(0, st)).map((e) => e[1]); }; const A = vr(0); const B1 = vr(1); const gl = o.glowRing != null ? `<path d="${poly(o.glowRing ? B1 : A, false)}" fill="none" stroke="${o.glowColor || '#7ad8ff'}" stroke-width="${o.glowW || 1.1}" stroke-linecap="round" style="filter:drop-shadow(0 0 1.6px ${o.glowColor || '#7ad8ff'})"/>` : ''; out.push([depth, `<path d="${poly(A.concat(B1.slice().reverse()))}" fill="${base}" stroke="#0a0e14" stroke-opacity=".5" stroke-width=".4"/>` + gl, pt]); continue; }
            const a = pt.rings[0][0].p; const b = pt.rings[pt.rings.length - 1][0].p;
            if (o.chrome) {
              // chrome: banded reflections keyed to the surface normal -- pale sky on top,
              // a hot streak, a dark horizon line, dark ground below and a bounce light
              const C = o.chrome; const band = (fn, fill, op = 1) => { const pts = pick(fn); if (pts.length > 2) svg += `<path d="${poly(hull(pts))}" fill="${fill}" opacity="${op}"/>`; };
              const B = C.bands || [[-2, '#8b9aad'], [-0.35, '#5a687a'], [0.08, '#323d4b'], [0.34, '#a3b1c2'], [0.62, '#f4f8fc'], [0.9, '#cfd9e4']];
              B.forEach(([th, fill], i) => (i === 0 ? (svg += `<path d="${poly(outline)}" fill="${fill}"/>`) : band((q) => q.n[2] > th, fill)));
            } else {
              svg += `<path d="${poly(outline)}" fill="${base}"/>`;
              const dark = pick((q) => lit(q.n) < -0.05);
              if (dark.length > 2) svg += `<path d="${poly(hull(dark))}" fill="${tone(base, -0.42)}" opacity=".85"/>`;
              const mid = pick((q) => lit(q.n) < 0.35);
              if (mid.length > 2) svg += `<path d="${poly(hull(mid))}" fill="${tone(base, -0.2)}" opacity=".55"/>`;
              const hi = pick((q) => lit(q.n) > 0.8);
              if (hi.length > 2) svg += `<path d="${poly(hull(hi))}" fill="${tone(base, 0.55)}" opacity=".7"/>`;
            }
            const visRun = (i) => {
              const seg = []; pt.rings[i].forEach((q, j) => { if (vis(q.n)) seg.push([j, P2[i][j]]); });
              if (seg.length < 2) return [];
              const N = pt.rings[i].length; let start = 0; for (let k = 0; k < seg.length; k++) { const nx = seg[(k + 1) % seg.length][0]; if ((seg[k][0] + 1) % N !== nx) { start = (k + 1) % seg.length; break; } }
              return seg.slice(start).concat(seg.slice(0, start)).map((e) => e[1]);
            };
            if (o.rings) for (const i of o.rings) {
              const run = visRun(i); if (run.length < 2) continue;
              svg += `<path d="${poly(run, false)}" fill="none" stroke="${o.line || '#000'}" stroke-opacity="${o.lineOp || 0.35}" stroke-width="${o.lineW || 0.45}"/>`;
            }
            if (o.glowRing != null) { const run = visRun(o.glowRing); if (run.length > 1) svg += `<path d="${poly(run, false)}" fill="none" stroke="${o.glowColor || '#7ad8ff'}" stroke-width="${o.glowW || 1.2}" stroke-linecap="round" style="filter:drop-shadow(0 0 1.5px ${o.glowColor || '#7ad8ff'})"/>`; }
            if (o.edge !== false) svg += `<path d="${poly(outline)}" fill="none" stroke="${o.edgeColor || '#0a0e14'}" stroke-opacity=".55" stroke-width=".5"/>`;
            if (o.after) svg += o.after(pr, s);
          } else if (pt.kind === 'face') {
            const P2 = pt.pts.map(pr); depth = pt.z != null ? pt.z : P2.reduce((a, q) => a + q[2], 0) / P2.length;
            const n = norm(cross(sub(pt.pts[1], pt.pts[0]), sub(pt.pts[2], pt.pts[0])));
            const nn = vis(n) ? n : n.map((v) => -v);
            const k = pt.o.flat ? 0 : Math.max(-0.5, Math.min(0.4, lit(nn) * 0.5 - 0.1));
            svg += `<path d="${poly(P2)}" fill="${pt.o.fill || tone(pt.color, k)}" ${pt.o.extra || ''} stroke="#0a0e14" stroke-opacity="${pt.o.edgeOp == null ? 0.5 : pt.o.edgeOp}" stroke-width=".45" stroke-linejoin="round"/>`;
            if (pt.o.after) svg += pt.o.after(pr, s);
          } else if (pt.kind === 'solid') {
            const fs = [];
            const flat = pt.faces.flatMap((fc) => (fc.pts || fc));
            const cen = [0, 1, 2].map((k) => flat.reduce((a, q) => a + q[k], 0) / flat.length);
            for (const fr of pt.faces) {
              const fc0 = fr.pts ? fr : { pts: fr };
              const fc = fc0.pts;
              let n = norm(cross(sub(fc[1], fc[0]), sub(fc[2], fc[0])));
              const fcen = [0, 1, 2].map((k) => fc.reduce((a, q) => a + q[k], 0) / fc.length);
              if (dot(n, sub(fcen, cen)) < 0) n = n.map((v) => -v);
              if (!vis(n)) continue;
              const P2 = fc.map(pr);
              const k = Math.max(-0.55, Math.min(0.45, lit(n) * 0.55 - 0.1));
              fs.push([P2.reduce((a, q) => a + q[2], 0) / P2.length, `<path d="${poly(P2)}" fill="${fc0.fill || tone(fc0.color || pt.color, k)}" stroke="#0a0e14" stroke-opacity="${pt.o.edgeOp == null ? 0.5 : pt.o.edgeOp}" stroke-width=".45" stroke-linejoin="round"/>` + (fc0.after ? fc0.after(pr, s) : '')]);
            }
            const P2 = flat.map(pr); depth = pt.z != null ? pt.z : P2.reduce((a, q) => a + q[2], 0) / P2.length;
            svg = (pt.o.noSort ? fs : fs.sort((a, b) => b[0] - a[0])).map((e) => e[1]).join('') + (pt.o.after ? pt.o.after(pr, s) : '');
          } else if (pt.kind === 'at') {
            const q = pr(pt.p); depth = pt.z != null ? pt.z : q[2];
            svg = pt.fn(q, s, pr);
          }
          out.push([depth + ((pt.o && pt.o.zBias) || 0), svg, pt]);
        }
        // groups: every part sharing o.g paints right after the group's first part, in insertion order
        const gd = {}; out.forEach((e, i) => { e.i = i; const g = e[2].o && e[2].o.g; if (g == null) return; if (!(g in gd)) gd[g] = e[0]; e[0] = gd[g]; });
        out.sort((a, b) => b[0] - a[0] || a.i - b.i);
        const g = S._grads.map(([n, stops, a, b]) => { const A = pr(a); const B = pr(b); return `<linearGradient id="${n}" gradientUnits="userSpaceOnUse" x1="${f(A[0])}" y1="${f(A[1])}" x2="${f(B[0])}" y2="${f(B[1])}">${stops.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ''}/>`).join('')}</linearGradient>`; }).join('');
        return `<defs>${g}${defs.join('')}</defs>` + out.map((e) => e[1]).join('');
      },
    };
    return S;
  }
  const api = { scene, tone, hull, poly, f };
  root.P3 = api;
})(typeof window !== 'undefined' ? window : globalThis);

// Three-quarter ship renders built on P3.
(function (root) {
  const P3 = root.P3;
  const { tone } = P3;
  const f = P3.f;
  const SH = {};

  // ---------- Din Djarin's N-1: the classic Naboo needle, stripped to raw chrome ----------
  SH.mando_n1 = (o = {}) => {
    const S = P3.scene({ yaw: o.yaw || 90, pitch: o.pitch || 66, light: [0.35, -0.55, 0.75] });
    const pal = o.pal || {};
    const chrome = { chrome: pal };
    const classic = !!o.classic;
    const GOLD = { chrome: { bands: [[-2, '#8a5c0a'], [-0.35, '#a87410'], [0.08, '#5e3c06'], [0.34, '#e2b02a'], [0.62, '#fff2b0'], [0.9, '#f2c844']] } };
    // nacelles: rounded intake up front, a long radiator spike trailing behind
    for (const side of [-1, 1]) {
      const y = side * 18;
      S.body([[20, 0.8, 0.8], [19, 2.6, 2.6], [17.5, 3.6, 3.6], [14, 4.1, 4.1], [2, 4.1, 4.1], [-6, 3.7, 3.7], [-11, 2.8, 2.8], [-15, 1.5, 1.5], [-26, 0.7, 0.7], [-44, 0.14, 0.14]].map(([x, w, h]) => [x, w, h, -0.6, y]),
        { ...chrome, rings: [5], n: 24, g: 'nac' + side });
      if (classic) S.body([[20, 0.8, 0.8], [19, 2.6, 2.6], [17.5, 3.6, 3.6], [14, 4.1, 4.1], [1, 4.1, 4.1]].map(([x, w, h]) => [x, w, h, -0.6, y]), { ...GOLD, rings: [3], n: 24, g: 'nac' + side });
      else S.body([[20, 0.8, 0.8], [19, 2.6, 2.6], [17.5, 3.6, 3.6], [16.8, 3.85, 3.85]].map(([x, w, h]) => [x, w, h, -0.6, y]), { color: '#3e4856', g: 'nac' + side, n: 32 });
      // swept wing joining nacelle to fuselage
      const wz = -0.9;
      const W = [[9, side * 4.8, wz], [1, side * 14.8, wz], [-12, side * 14.8, wz], [-16, side * 4.8, wz]];
      S.plate(W, 0.9, '#7d8a9a', {
        top: classic ? S.grad([[0, '#fff2b0'], [0.4, '#e8b830'], [0.65, '#8a5c0a'], [1, '#c8941c']], [9, side * 5, wz], [-16, side * 14, wz]) : S.grad([[0, '#eef3f8'], [0.35, '#b9c5d3'], [0.6, '#56637a'], [1, '#93a1b3']], [9, side * 5, wz], [-16, side * 14, wz]),
        topAfter: (pr) => {
          const seg = (a, b, c = '#2a323e', w = 0.4, op = 0.6) => { const A = pr(a); const B = pr(b); return `<path d="M${f(A[0])} ${f(A[1])} L${f(B[0])} ${f(B[1])}" stroke="${c}" stroke-width="${w}" opacity="${op}"/>`; };
          return seg([4, side * 5, wz], [-3, side * 14.6, wz]) + seg([-9, side * 5, wz], [-10, side * 14.6, wz])
            + seg([7.6, side * 6.4, wz], [0.6, side * 14.2, wz], '#fff', 0.5, 0.8);
        },
      });
      // gunmetal intake charger collar, panel band, and the blue exhaust ring
      if (!classic) S.body([[16.6, 4.15, 4.15], [12.8, 4.15, 4.15]].map(([x, w, h]) => [x, w, h, -0.6, y]), { color: '#4a5464', band: true, g: 'nac' + side, n: 32 });
      if (!classic) S.body([[6.5, 4.12, 4.12], [5.4, 4.12, 4.12]].map(([x, w, h]) => [x, w, h, -0.6, y]), { color: '#2e3642', band: true, g: 'nac' + side, n: 32 });
      S.body([[-10.6, 3.05, 3.05], [-11.6, 2.55, 2.55]].map(([x, w, h]) => [x, w, h, -0.6, y]), { color: '#1e2630', band: true, g: 'nac' + side, n: 32, glowRing: 1 });
      // the heavier cannons Peli fitted under the nose
      S.body([[30, 0.35, 0.35], [29, 0.7, 0.7], [16, 0.8, 0.8], [14, 0.9, 0.9]].map(([x, w, h]) => [x, w, h, -2.4, side * 2.6]), { color: '#4a5260', edge: true });
    }
    // fuselage: needle nose, fat middle, long tapering tail
    S.body([[46, 0.2, 0.2, -0.4], [41, 1.6, 1.2, -0.3], [34, 2.9, 2.2, 0], [26, 4.0, 3.1, 0.2], [17, 5.0, 3.9, 0.4], [7, 5.8, 4.5, 0.4], [-3, 6.0, 4.6, 0.3], [-11, 5.3, 4.0, 0.2], [-18, 3.8, 3.0, 0.1], [-25, 2.2, 1.8, 0], [-33, 0.9, 0.9, 0], [-46, 0.15, 0.15, 0]],
      { ...chrome, rings: [3, 6, 8, 9], n: 24, z: 0, g: 'fus' });
    if (classic) S.body([[46, 0.2, 0.2, -0.4], [41, 1.6, 1.2, -0.3], [34, 2.9, 2.2, 0], [26, 4.0, 3.1, 0.2], [17, 5.0, 3.9, 0.4], [7, 5.8, 4.5, 0.4], [-2, 6.0, 4.6, 0.3]], { ...GOLD, rings: [3], n: 24, g: 'fus' });
    // cockpit canopy
    S.body([[21, 0.3, 0.3, 3.2], [18, 2.4, 1.6, 3.4], [12, 3.3, 2.4, 3.6], [5, 3.1, 2.2, 3.8], [0, 0.8, 0.8, 4.0]], {
      color: '#24456a', edge: true, z: -1, rings: [2], line: '#dfe8f2', lineOp: 0.9, lineW: 0.6,
      after: (pr, s) => { const a = pr([17, -1.4, 4.6]); const b = pr([8, -1.9, 5.8]); return `<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="#bfe6ff" stroke-width="${f(0.5 * s)}" stroke-linecap="round" opacity=".85"/>`; },
    });
    if (classic) {
      S.at([-6.5, 0, 5.0], (q, s) => {
        const r = 2.9 * s; const x = q[0]; const y = q[1];
        return `<ellipse cx="${f(x)}" cy="${f(y + r * 0.4)}" rx="${f(r * 1.05)}" ry="${f(r * 0.8)}" fill="#2a3240"/>`
          + `<path d="M${f(x - r)} ${f(y + r * 0.3)} A${f(r)} ${f(r * 0.95)} 0 0 1 ${f(x + r)} ${f(y + r * 0.3)}Z" fill="#e8ecf2" stroke="#0a0e14" stroke-opacity=".5" stroke-width=".35"/>`
          + `<path d="M${f(x - r * 0.95)} ${f(y + r * 0.05)} L${f(x + r * 0.95)} ${f(y + r * 0.05)}" stroke="#2a5ab8" stroke-width="${f(0.5 * s)}"/>`
          + `<rect x="${f(x - r * 0.35)}" y="${f(y - r * 0.55)}" width="${f(r * 0.7)}" height="${f(r * 0.38)}" fill="#2a5ab8"/><circle cx="${f(x + r * 0.15)}" cy="${f(y - r * 0.36)}" r="${f(r * 0.14)}" fill="#0a0e18"/><circle cx="${f(x - r * 0.5)}" cy="${f(y - r * 0.1)}" r="${f(r * 0.1)}" fill="#ff3a3a"/>`;
      }, { z: -2 });
    }
    // Grogu's bubble where the astromech used to ride
    if (!classic) S.at([-6.5, 0, 5.2], (q, s) => {
      const r = 3.1 * s; const x = q[0]; const y = q[1];
      return `<circle cx="${f(x)}" cy="${f(y + r * 0.35)}" r="${f(r * 1.1)}" fill="#3a4452" stroke="#0a0e14" stroke-opacity=".5" stroke-width=".4"/>`
        + `<path d="M${f(x - r * 1.9)} ${f(y - r * 0.3)} Q${f(x - r * 1.2)} ${f(y - r * 0.2)} ${f(x - r * 0.6)} ${f(y)} L${f(x - r * 0.6)} ${f(y + r * 0.3)} Q${f(x - r * 1.2)} ${f(y + r * 0.1)} ${f(x - r * 1.9)} ${f(y - r * 0.3)}Z" fill="#8aa06a"/>`
        + `<path d="M${f(x + r * 1.9)} ${f(y - r * 0.3)} Q${f(x + r * 1.2)} ${f(y - r * 0.2)} ${f(x + r * 0.6)} ${f(y)} L${f(x + r * 0.6)} ${f(y + r * 0.3)} Q${f(x + r * 1.2)} ${f(y + r * 0.1)} ${f(x + r * 1.9)} ${f(y - r * 0.3)}Z" fill="#8aa06a"/>`
        + `<ellipse cx="${f(x)}" cy="${f(y + r * 0.1)}" rx="${f(r * 0.72)}" ry="${f(r * 0.62)}" fill="#9ab47a"/>`
        + `<ellipse cx="${f(x - r * 0.28)}" cy="${f(y + r * 0.05)}" rx="${f(r * 0.17)}" ry="${f(r * 0.2)}" fill="#141008"/><ellipse cx="${f(x + r * 0.28)}" cy="${f(y + r * 0.05)}" rx="${f(r * 0.17)}" ry="${f(r * 0.2)}" fill="#141008"/>`
        + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#bfe8ff" opacity=".22" stroke="#e6f6ff" stroke-opacity=".7" stroke-width=".35"/>`
        + `<path d="M${f(x - r * 0.6)} ${f(y - r * 0.55)} Q${f(x - r * 0.2)} ${f(y - r * 0.85)} ${f(x + r * 0.25)} ${f(y - r * 0.8)}" stroke="#fff" stroke-width="${f(0.35 * s)}" fill="none" stroke-linecap="round" opacity=".9"/>`;
    }, { z: -2 });
    // dorsal stowage hatch ahead of the canopy (Din's jetpack rides here)
    if (!classic) S.at([26, 0, 3.3], (q, s) => `<ellipse cx="${f(q[0])}" cy="${f(q[1])}" rx="${f(2.2 * s)}" ry="${f(1.0 * s)}" transform="rotate(-28 ${f(q[0])} ${f(q[1])})" fill="none" stroke="#2a323e" stroke-width=".45" opacity=".75"/>`, { z: -1.5 });
    return S.render(o.box);
  };


  // chamfered box cross-section, counter-clockwise from the +y upper chamfer
  const oct = (w, h, c) => [[w, h - c], [w - c, h], [-(w - c), h], [-w, h - c], [-w, -(h - c)], [-(w - c), -h], [w - c, -h], [w, -(h - c)]];
  const seg = (pr, a, b, c, w, extra = '') => { const A = pr(a); const B = pr(b); return `<path d="M${f(A[0])} ${f(A[1])} L${f(B[0])} ${f(B[1])}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`; };
  const quad = (pr, pts, fill, extra = '') => `<path d="M${pts.map((q) => { const r = pr(q); return f(r[0]) + ' ' + f(r[1]); }).join(' L')}Z" fill="${fill}" ${extra}/>`;

  // the classic royal N-1: gold forward hull, chrome aft, R2 in the socket
  SH.n1 = (o = {}) => SH.mando_n1({ ...o, classic: true });

  // ---------- U-wing: three-quarter from the front, S-foils swept forward, door gunner at work ----------
  SH.uwing = (o = {}) => {
    const S = P3.scene({ yaw: o.yaw || 90, pitch: o.pitch || 62, roll: o.roll == null ? 24 : o.roll, light: [0.5, 0.6, 0.7] });
    const HULL = '#d9d6cc'; const BLUE = '#5d6e84'; const RUST = '#c4552c';
    // S-foils behind everything on the far side, in front on the near side
    for (const side of [-1, 1]) {
      const z0 = 7.2; const zt = 4.6;
      const W = [[-15, side * 6.5, z0], [9, side * 43, zt], [1, side * 45, zt], [-29, side * 6.5, z0]];
      S.plate(W, 1.1, '#a8a49a', {
        top: S.grad([[0, '#ece9e0'], [1, '#aaa69a']], [-15, side * 6, z0], [-29, side * 6, z0]),
        topAfter: (pr) => {
          const L = (t) => [-15 + 24 * t, side * (6.5 + 36.5 * t), z0 + (zt - z0) * t]; const T = (t) => [-29 + 30 * t, side * (6.5 + 38.5 * t), z0 + (zt - z0) * t];
          const mix = (a, b, u) => a.map((v, i) => v + (b[i] - v) * u);
          return quad(pr, [mix(L(0.08), T(0.08), 0.18), mix(L(0.62), T(0.62), 0.18), mix(L(0.62), T(0.62), 0.78), mix(L(0.08), T(0.08), 0.78)], BLUE, 'opacity=".85"')
            + quad(pr, [L(0.76), L(0.84), T(0.84), T(0.76)], RUST) + quad(pr, [L(0.88), L(0.92), T(0.92), T(0.88)], RUST)
            + [0.25, 0.45, 0.66].map((t) => seg(pr, L(t), T(t), '#4a4a44', 0.35, 'opacity=".5"')).join('')
            + seg(pr, L(0.02), L(0.98), '#fff', 0.5, 'opacity=".8"');
        },
      });
      // wingtip cap
      S.plate([[9.4, side * 43, zt + 0.4], [9.4, side * 45.6, zt + 0.4], [0.4, side * 45.6, zt + 0.4], [0.4, side * 43, zt + 0.4]], 2.6, '#9a9ea6', { edgeOp: 0.25 });
      // pivot housing on the dorsal spine
      S.box([-30, -14, side * 3.5, side * 7.2, 5.8, 8.6], '#c8c4ba', { edgeOp: 0.25 });
    }
    // engine block: four engines, two stacked each side
    for (const side of [-1, 1]) for (const zz of [3, -3]) {
      S.body([[-21, 2.2, 2.2], [-23, 2.9, 2.9], [-40, 2.9, 2.9], [-41, 2.4, 2.4]].map(([x, w, h]) => [x, w, h, zz, side * 9.6]), { color: '#bcb8ae', rings: [2], n: 24 });
    }
    // fuselage: blunt nose, long troop box, wider engine section
    const secs = [[52, oct(3.2, 2.4, 1.0), -1.4], [45, oct(5.6, 4.4, 1.6), -0.6], [35, oct(7, 6, 2)], [-18, oct(7, 6, 2)], [-21, oct(8.2, 6.6, 2.2)], [-38, oct(8.2, 6.6, 2.2)], [-41, oct(6.6, 5.2, 2)]];
    S.loft(secs, HULL, {
      fill: (i, k) => (i === 1 && k <= 2 ? '#1c2c40' : i === 0 && k === 1 ? '#2a3a50' : undefined),
      after: (i, k, q, pr, sc) => {
        let m = '';
        if (i === 1 && k <= 2) m += seg(pr, q[0], q[3], '#cfd8e2', 0.55) + seg(pr, [42, q[0][1] * 0.7 + q[1][1] * 0.3, q[0][2] * 0.7 + q[1][2] * 0.3], [38, q[3][1] * 0.6 + q[2][1] * 0.4, q[3][2] * 0.6 + q[2][2] * 0.4], '#9fd4ff', 0.5, 'opacity=".7"');
        if (i === 2 && k === 7) {
          // near side: the sliding troop door is open, door panel slid aft
          const zA = -4.2; const zB = 3.6; const y = 7.02;
          m += quad(pr, [[16, y, zB], [-10, y, zB], [-10, y, zA], [16, y, zA]], '#140c08');
          m += quad(pr, [[16, y, zB], [-10, y, zB], [-10, 6.4, zB - 0.6], [16, 6.4, zB - 0.6]], '#3a2a1e', 'opacity=".9"');
          m += quad(pr, [[14, y, 1.6], [-8, y, 1.6], [-8, y, -3], [14, y, -3]], '#ff4a1a', 'opacity=".16"');
          { const c = pr([-5, y, -0.6]); const r = sc * 1.1; m += `<path d="M${f(c[0] - 1.6 * r)} ${f(c[1] + 3 * r)} L${f(c[0] - 1.3 * r)} ${f(c[1] - 0.6 * r)} C${f(c[0] - 1 * r)} ${f(c[1] - 2 * r)} ${f(c[0] + 1 * r)} ${f(c[1] - 2 * r)} ${f(c[0] + 1.3 * r)} ${f(c[1] - 0.6 * r)} L${f(c[0] + 1.6 * r)} ${f(c[1] + 3 * r)}Z" fill="#2e2a20"/><circle cx="${f(c[0])}" cy="${f(c[1] - 2.8 * r)}" r="${f(1.1 * r)}" fill="#2e2a20"/>`; }
          m += quad(pr, [[-10, y, zB], [-10, y, zA], [-8, 6.2, zA + 0.4], [-8, 6.2, zB - 0.4]], '#5a4430');
          m += quad(pr, [[15, y, zB - 0.3], [-9, y, zB - 0.3], [-9, y, zB - 1.4], [15, y, zB - 1.4]], '#ff6a2a', 'opacity=".25"');
          m += quad(pr, [[-11, y + 0.35, zB + 0.4], [-33, y + 0.35, zB + 0.4], [-33, y + 0.35, zA - 0.4], [-11, y + 0.35, zA - 0.4]], '#cfccc2', 'stroke="#2a2a26" stroke-width=".45"');
          m += seg(pr, [-22, y + 0.4, zB - 1.4], [-22, y + 0.4, zA + 1.4], '#6a6a62', 0.45);
          m += quad(pr, [[30, y, 4], [20, y, 4], [20, y, 2.4], [30, y, 2.4]], RUST);
          m += quad(pr, [[30, y, 1.4], [20, y, 1.4], [20, y, 0.8], [30, y, 0.8]], RUST);
        }
        if (i === 4 && k === 7) m += quad(pr, [[-23, 8.22, 4], [-36, 8.22, 4], [-36, 8.22, -4], [-23, 8.22, -4]], BLUE, 'opacity=".8"') + seg(pr, [-29.5, 8.25, 4], [-29.5, 8.25, -4], '#2a3240', 0.4);
        if (i === 2 && k === 0) m += quad(pr, [[30, 6.4, 4.6], [18, 6.4, 4.6], [18, 5.6, 5.4], [30, 5.6, 5.4]], '#7a8698');
        if (i === 2 && k === 1) m += seg(pr, [30, -3, 6], [-14, -3, 6], '#77736a', 0.4) + seg(pr, [30, 3, 6], [-14, 3, 6], '#77736a', 0.4) + quad(pr, [[26, -4, 6], [18, -4, 6], [18, 4, 6], [26, 4, 6]], BLUE, 'opacity=".75"');
        return m;
      },
    });
    // the door gunner, braced in the doorway, repeater blazing
    S.at([3, 7.6, -1.2], (q, sc, pr) => {
      const k = sc * 1.45; const x = q[0]; const y = q[1];
      const g = (a, b) => [x + a * k, y + b * k];
      const pt = (a, b) => { const r = g(a, b); return f(r[0]) + ' ' + f(r[1]); };
      const muzzle = pr([9, 17, 0.2]); const butt = pr([3, 7.8, 0.8]);
      return `<path d="M${pt(-2.2, 3.4)} L${pt(-1.8, -1)} C${pt(-1.6, -2.4)} ${pt(1.6, -2.4)} ${pt(1.8, -1)} L${pt(2.2, 3.4)}Z" fill="#6c6a4a"/>`
        + `<path d="M${pt(-2, 0)} L${pt(2, 0)}" stroke="#3a3826" stroke-width="${f(0.5 * k)}"/>`
        + `<circle cx="${f(g(0, -3.4)[0])}" cy="${f(g(0, -3.4)[1])}" r="${f(1.35 * k)}" fill="#c89a74"/>`
        + `<path d="M${pt(-1.6, -3.6)} C${pt(-1.5, -5.3)} ${pt(1.5, -5.3)} ${pt(1.6, -3.6)} L${pt(1.9, -3.3)} L${pt(-1.9, -3.3)}Z" fill="#4e5a3a"/>`
        + `<path d="M${pt(-1.4, -3.1)} L${pt(1.4, -3.1)}" stroke="#1a1a12" stroke-width="${f(0.5 * k)}"/>`
        + `<path d="M${f(butt[0])} ${f(butt[1])} L${f(muzzle[0])} ${f(muzzle[1])}" stroke="#6a717c" stroke-width="${f(1.1 * k)}" stroke-linecap="round"/>`
        + `<path d="M${f(butt[0])} ${f(butt[1])} L${f((butt[0] + muzzle[0]) / 2)} ${f((butt[1] + muzzle[1]) / 2)}" stroke="#8a929e" stroke-width="${f(1.9 * k)}" stroke-linecap="round"/>`
        + `<path d="M${pt(-1.8, -0.6)} L${f((butt[0] * 0.6 + muzzle[0] * 0.4))} ${f((butt[1] * 0.6 + muzzle[1] * 0.4))}" stroke="#6c6a4a" stroke-width="${f(1 * k)}" stroke-linecap="round"/>`
        + `<circle cx="${f(muzzle[0])}" cy="${f(muzzle[1])}" r="${f(1.0 * k)}" fill="#ffe2a0" style="filter:drop-shadow(0 0 2px #ff6a2a)"/>`;
    }, { zBias: -50 });
    // bolts streaking off toward the target
    S.at([12, 26, 0.6], (q, sc, pr) => {
      const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
      return [[[11, 20, 0], [26, 42, -0.6]], [[12.4, 19.4, 1], [24, 36, 2.4]], [[10, 21, -1], [18, 38, -3]]].map(([a, b], n) => [0.06, 0.42, 0.78].map((t) => {
        const A = pr(lerp(a, b, t + n * 0.05)); const B = pr(lerp(a, b, t + n * 0.05 + 0.16));
        return `<path d="M${f(A[0])} ${f(A[1])} L${f(B[0])} ${f(B[1])}" stroke="#ff5a3a" stroke-width="${f(0.75 * sc)}" stroke-linecap="round" style="filter:drop-shadow(0 0 1.5px #ff3a1a)"/>`;
      }).join('')).join('');
    }, { zBias: -60 });
    return S.render(o.box);
  };

  // ---------- Fondor Haulcraft: three-quarter from the front, wings swinging out ----------
  SH.cassian_haulcraft = (o = {}) => {
    const S = P3.scene({ yaw: o.yaw || 90, pitch: o.pitch || 62, light: [0.5, -0.5, 0.75] });
    const HULL = '#8a867a'; const DARK = '#4a4842'; const OCHRE = '#c8963a';
    const ang = (o.wing == null ? 6 : o.wing) * Math.PI / 180;
    for (const side of [-1, 1]) {
      // wing: hinged along the upper hull edge, swung up and out
      const hy = side * 11.4; const hz = 5.4; const span = 27;
      const out = (x, d) => [x, hy + side * d * Math.cos(ang), hz + d * Math.sin(ang)];
      const W = [out(24, 0), out(13, span), out(-24, span), out(-26, 0)];
      S.plate(W, 1.6, '#77746a', {
        top: S.grad([[0, '#a8a496'], [0.6, '#827e72'], [1, '#5e5b52']], out(24, 0), out(0, span)),
        topAfter: (pr) => {
          let m = '';
          const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
          // panel grid
          for (const t of [0.25, 0.5, 0.75]) m += seg(pr, lerp(W[0], W[1], t), lerp(W[3], W[2], t), '#2e2c28', 0.4, 'opacity=".55"');
          for (const t of [0.33, 0.66]) m += seg(pr, lerp(W[0], W[3], t), lerp(W[1], W[2], t), '#2e2c28', 0.4, 'opacity=".55"');
          // dark intake panel and ochre hazard band near the tip
          m += quad(pr, [lerp(lerp(W[0], W[1], 0.1), lerp(W[3], W[2], 0.1), 0.15), lerp(lerp(W[0], W[1], 0.45), lerp(W[3], W[2], 0.45), 0.15), lerp(lerp(W[0], W[1], 0.45), lerp(W[3], W[2], 0.45), 0.45), lerp(lerp(W[0], W[1], 0.1), lerp(W[3], W[2], 0.1), 0.45)], DARK, 'opacity=".85"');
          m += quad(pr, [lerp(W[0], W[1], 0.82), lerp(W[0], W[1], 0.9), lerp(W[3], W[2], 0.9), lerp(W[3], W[2], 0.82)], OCHRE, 'opacity=".9"');
          // scorch streaks
          m += seg(pr, lerp(lerp(W[0], W[1], 0.6), lerp(W[3], W[2], 0.6), 0.6), lerp(lerp(W[0], W[1], 0.7), lerp(W[3], W[2], 0.7), 0.9), '#2a1a10', 0.9, 'opacity=".35"');
          // leading-edge highlight and tip running light
          m += seg(pr, W[0], W[1], '#e8e2d0', 0.5, 'opacity=".75"');
          const tip = pr(W[1]); m += `<circle cx="${f(tip[0])}" cy="${f(tip[1])}" r="${f(0.9 * S.scale)}" fill="${side > 0 ? '#ff4a3a' : '#5aff8a'}" style="filter:drop-shadow(0 0 2px ${side > 0 ? '#ff4a3a' : '#5aff8a'})"/>`;
          return m;
        },
      });
      // actuator arms pushing the wing out
      S.at([0, side * 12, 0], (q, sc, pr) => seg(pr, [6, side * 12.2, -1], out(6, 11).map((v, i) => (i === 2 ? v - 1.4 : v)), '#3a3934', 1.1 * sc * 0.5) + seg(pr, [-12, side * 12.2, -1], out(-12, 11).map((v, i) => (i === 2 ? v - 1.4 : v)), '#3a3934', 1.1 * sc * 0.5), { g: 'arm' + side });
      // a hidden cannon dropped out of the chin
      S.body([[42, 0.4, 0.4], [41, 0.7, 0.7], [33, 0.8, 0.8], [31, 1.2, 1.2]].map(([x, w, h]) => [x, w, h, -5.4, side * 4.2]), { color: '#3a3a3e' });
    }
    // three big thrusters on the stern
    for (const y of [-6.5, 0, 6.5]) S.body([[-27, 3.4, 3.4], [-29, 3.8, 3.8], [-35, 3.8, 3.8], [-36, 3.2, 3.2]].map(([x, w, h]) => [x, w, h, 0.4, y]), { color: '#6a675e', rings: [1], n: 24 });
    // the boxy hull: low blunt nose with the wide cockpit glazing
    const secs = [[37, oct(8.5, 3.4, 1.6), -1.6], [33, oct(10.6, 5.6, 2.4), -0.4], [26, oct(12, 7, 3)], [-24, oct(12, 7, 3)], [-28, oct(10.4, 5.6, 2.6)]];
    S.loft(secs, HULL, {
      fill: (i, k) => (i === 0 && (k === 0 || k === 1 || k === 2) ? '#18242e' : undefined),
      after: (i, k, q, pr, sc) => {
        let m = '';
        if (i === 0 && k <= 2) {
          // window frames
          const lerp = (a, b, t) => a.map((v, j) => v + (b[j] - v) * t);
          for (const t of [0.34, 0.67]) m += seg(pr, lerp(q[0], q[1], t), lerp(q[3], q[2], t), '#8a867a', 0.6);
          m += seg(pr, lerp(q[0], q[3], 0.2), lerp(q[1], q[2], 0.2), '#7fc4ff', 0.5, 'opacity=".55"');
        }
        if (i === 2 && k === 1) {
          // dorsal deck: hatches, a sensor dome, ochre stripes
          m += quad(pr, [[18, -5, 7], [4, -5, 7], [4, 5, 7], [18, 5, 7]], DARK, 'opacity=".9"');
          m += seg(pr, [11, -5, 7], [11, 5, 7], '#2a2826', 0.4);
          m += quad(pr, [[-4, -8, 7], [-18, -8, 7], [-18, -6, 7], [-4, -6, 7]], OCHRE, 'opacity=".9"');
          m += quad(pr, [[-4, 6, 7], [-18, 6, 7], [-18, 8, 7], [-4, 8, 7]], OCHRE, 'opacity=".9"');
          for (const x of [20, 0, -20]) m += seg(pr, [x, -8, 7], [x, 8, 7], '#3a3832', 0.4, 'opacity=".6"');
          const d = pr([-10, 0, 7]); m += `<ellipse cx="${f(d[0])}" cy="${f(d[1])}" rx="${f(2.6 * sc)}" ry="${f(1.5 * sc)}" fill="#5a5850" stroke="#2a2826" stroke-width=".4"/><ellipse cx="${f(d[0] - 0.5 * sc)}" cy="${f(d[1] - 0.5 * sc)}" rx="${f(1 * sc)}" ry="${f(0.5 * sc)}" fill="#c8c4b4" opacity=".7"/>`;
        }
        if (i === 2 && (k === 7 || k === 3)) {
          const y = k === 7 ? 12.02 : -12.02;
          m += quad(pr, [[22, y, 3], [6, y, 3], [6, y, -3], [22, y, -3]], DARK, 'opacity=".75"');
          m += quad(pr, [[-6, y, 2.2], [-20, y, 2.2], [-20, y, 0.8], [-6, y, 0.8]], OCHRE);
          for (const x of [14, -2, -14]) m += seg(pr, [x, y, 4], [x, y, -4], '#3a3832', 0.4, 'opacity=".55"');
        }
        if (i === 1 && k === 1) m += quad(pr, [[32, -3, 5.8], [27, -3, 6.8], [27, 3, 6.8], [32, 3, 5.8]], '#5a5850');
        return m;
      },
    });
    return S.render(o.box);
  };

  // ---------- Hound's Tooth: Bossk's YV-666, a tall armoured slab with the bridge riding on top ----------
  SH.houndstooth = (o = {}) => {
    const S = P3.scene({ yaw: o.yaw || 90, pitch: o.pitch || 66, light: [0.5, -0.45, 0.75] });
    const HULL = '#76604a'; const DARK = '#3e3026'; const RUST = '#a8482a'; const GREY = '#6c675e';
    const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
    // aft maneuvering fins, angled down and out
    for (const side of [-1, 1]) {
      const F = [[-8, side * 9.2, -3], [-20, side * 28, -10], [-33, side * 28, -10], [-33, side * 9.2, -3]];
      S.plate(F, 1.4, '#6e5a46', {
        top: S.grad([[0, '#a88a6a'], [1, '#5e4a38']], F[0], F[1]),
        topAfter: (pr) => quad(pr, [lerp(F[0], F[1], 0.62), lerp(F[0], F[1], 0.74), lerp(F[3], F[2], 0.74), lerp(F[3], F[2], 0.62)], RUST)
          + seg(pr, lerp(F[0], F[3], 0.5), lerp(F[1], F[2], 0.5), '#2a1e14', 0.4, 'opacity=".55"') + seg(pr, F[0], F[1], '#e0c8a8', 0.45, 'opacity=".6"'),
      });
    }
    // twin main thrusters
    for (const y of [-4.6, 4.6]) S.body([[-31, 3.6, 3.6], [-33, 4.1, 4.1], [-39, 4.1, 4.1], [-40, 3.4, 3.4]].map(([x, w, h]) => [x, w, h, -2, y]), { color: '#6a6258', rings: [1], n: 24 });
    // the tall three-deck hull with a wedge prow
    const secs = [[40, oct(5.5, 4.6, 1.6), -3.4], [33, oct(8.4, 7.6, 2.4), -1.6], [26, oct(9.2, 8.6, 2.8), -1], [-30, oct(9.2, 8.6, 2.8), -1], [-33, oct(8, 7.4, 2.4), -1.4]];
    S.loft(secs, HULL, {
      after: (i, k, q, pr, sc) => {
        let m = '';
        if (i === 2 && (k === 7 || k === 3)) {
          const y = k === 7 ? 9.22 : -9.22;
          // deck lines, the side ramp, rust patches and the painted mascot panel
          m += quad(pr, [[26, y, -3.6], [-30, y, -3.6], [-30, y, -9.6], [26, y, -9.6]], '#000', 'opacity=".22"');
          for (const z of [2.6, -3.6]) m += seg(pr, [26, y, z], [-30, y, z], '#2e2218', 0.45, 'opacity=".6"');
          m += quad(pr, [[-14, y, -4.2], [-26, y, -4.2], [-26, y, -9], [-14, y, -9]], DARK, 'opacity=".8"');
          m += quad(pr, [[22, y, 1.8], [8, y, 1.8], [8, y, -3], [22, y, -3]], GREY, 'opacity=".9"');
          m += quad(pr, [[20, y, 1], [10, y, 1], [10, y, -2.2], [20, y, -2.2]], '#3a2a1e', 'opacity=".55"');
          { const c = pr([15, y, -0.6]); const r = sc * 0.9; m += `<path d="M${f(c[0] - r)} ${f(c[1] + 1.4 * r)} L${f(c[0] - 0.6 * r)} ${f(c[1] - 0.6 * r)} C${f(c[0] - 0.4 * r)} ${f(c[1] - 1.4 * r)} ${f(c[0] + 0.4 * r)} ${f(c[1] - 1.4 * r)} ${f(c[0] + 0.6 * r)} ${f(c[1] - 0.6 * r)} L${f(c[0] + r)} ${f(c[1] + 1.4 * r)}Z" fill="#6a8a3a"/><circle cx="${f(c[0])}" cy="${f(c[1] - 1.8 * r)}" r="${f(0.55 * r)}" fill="#6a8a3a"/>`; }
          m += quad(pr, [[4, y, 6], [-8, y, 6], [-8, y, 4.4], [4, y, 4.4]], RUST, 'opacity=".9"');
          m += seg(pr, [-2, y, -5], [-10, y, -1], '#2a1a10', 1, 'opacity=".3"');
          // weathered plating: a deterministic scatter of patched panels
          for (let n = 0; n < 9; n++) { const x0 = 24 - ((n * 37) % 52); const z0 = 6 - ((n * 23) % 14); const w = 3 + (n % 3) * 1.6; const h = 1.6 + (n % 2) * 1.2; m += quad(pr, [[x0, y, z0], [x0 - w, y, z0], [x0 - w, y, z0 - h], [x0, y, z0 - h]], n % 3 ? '#5a4836' : '#8a7a62', 'opacity=".55"'); }
        }
        if (i === 2 && k === 1) {
          // dorsal deck: launch bay doors for the Nashtah Pup
          m += quad(pr, [[4, -5, 7.6], [-22, -5, 7.6], [-22, 5, 7.6], [4, 5, 7.6]], DARK, 'opacity=".85"');
          m += seg(pr, [-9, -5, 7.6], [-9, 5, 7.6], '#1a120c', 0.5) + seg(pr, [4, 0, 7.6], [-22, 0, 7.6], '#1a120c', 0.45);
          m += quad(pr, [[-24, -6.4, 7.6], [-28, -6.4, 7.6], [-28, 6.4, 7.6], [-24, 6.4, 7.6]], RUST, 'opacity=".9"');
          for (let n = 0; n < 7; n++) { const x0 = 24 - ((n * 29) % 50); const y0 = -7 + ((n * 17) % 12); m += quad(pr, [[x0, y0, 7.62], [x0 - 4, y0, 7.62], [x0 - 4, y0 + 2.4, 7.62], [x0, y0 + 2.4, 7.62]], n % 2 ? '#5a4836' : '#8a7a62', 'opacity=".5"'); }
          m += seg(pr, [26, -9, 7.6], [-30, -9, 7.6], '#d8c0a0', 0.5, 'opacity=".5"');
        }
        if (i === 0 && k === 1) m += quad(pr, [lerp(q[0], q[3], 0.25), lerp(q[1], q[2], 0.25), lerp(q[1], q[2], 0.7), lerp(q[0], q[3], 0.7)], DARK, 'opacity=".7"');
        if (i === 0 && (k === 7 || k === 3)) m += seg(pr, lerp(q[0], q[1], 0.5), lerp(q[3], q[2], 0.5), '#2e2218', 0.45, 'opacity=".6"');
        return m;
      },
    });
    // command bridge riding on top, segmented viewport wrapping the front
    S.loft([[32, oct(5.4, 2.6, 1.3), 9.2], [28, oct(7.2, 3.8, 1.6), 10.6], [14, oct(7.2, 3.8, 1.6), 10.6], [10, oct(6, 3, 1.4), 10]], '#86745c', {
      fill: (i, k) => (i === 0 && k !== 5 && k !== 4 && k !== 6 ? '#16222c' : undefined),
      after: (i, k, q, pr) => (i === 1 && k === 1 ? quad(pr, [lerp(q[0], q[1], 0.15), lerp(q[0], q[1], 0.85), lerp(q[3], q[2], 0.85), lerp(q[3], q[2], 0.15)], DARK, 'opacity=".55"') + seg(pr, lerp(lerp(q[0], q[1], 0.5), lerp(q[3], q[2], 0.5), 0.1), lerp(lerp(q[0], q[1], 0.5), lerp(q[3], q[2], 0.5), 0.9), '#1a120c', 0.4) : '') + (i === 0 && k !== 5 && k !== 4 && k !== 6 ? seg(pr, lerp(q[0], q[1], 0.5), lerp(q[3], q[2], 0.5), '#9a948a', 0.5) + seg(pr, lerp(q[0], q[3], 0.3), lerp(q[1], q[2], 0.3), '#ffb070', 0.45, 'opacity=".6"') : ''),
    });
    // quad laser turret midships
    S.body([[-2, 2.6, 1.4, 8.2], [-6, 2.8, 1.6, 8.6], [-10, 2.6, 1.4, 8.2]], { color: '#5a554c', n: 20, zBias: -3 });
    S.at([-6, 0, 9.6], (q, sc, pr) => [[-1.2, 0.6], [1.2, 0.6], [-1.2, -0.6], [1.2, -0.6]].map(([dy, dz]) => seg(pr, [-4, dy, 9.6 + dz], [6, dy, 10 + dz], '#2a2824', 0.5 * sc)).join(''), { zBias: -3.5 });
    for (const y of [-4.6, 4.6]) S.at([-40, y, -2], (q, sc) => `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f(4.4 * sc)}" fill="#ff9a4a" opacity=".35" style="filter:blur(1.4px)"/>`, { z: 1e3 });
    return S.render(o.box);
  };

  // ---------- Millennium Falcon: top-down YT-1300, mandibles forward, cockpit tube to starboard ----------
  SH.falcon = (o = {}) => {
    const S = P3.scene({ yaw: 90, pitch: o.pitch || 68, light: [0.25, 0.12, 1] });
    const HULL = '#cfd2d4'; const R = 30;
    const arcPts = (pr, r, a0, a1, z, n = 24) => { const pts = []; for (let i = 0; i <= n; i++) { const t = (a0 + (a1 - a0) * (i / n)) * Math.PI / 180; pts.push(pr([r * Math.cos(t), r * Math.sin(t), z])); } return pts; };
    const pl = (pts) => 'M' + pts.map((q) => f(q[0]) + ' ' + f(q[1])).join(' L');
    // mandibles
    for (const side of [-1, 1]) S.loft([[R + 15, oct(3.2, 1.8, 0.8), 0, side * 8], [R + 2, oct(3.6, 2.2, 0.9), 0, side * 8], [R - 12, oct(3.6, 2.6, 0.9), 0, side * 8]], '#c4c7ca', {
      after: (i, k, q, pr) => (k === 1 ? seg(pr, [R + 12, side * 8, 2.2], [R - 6, side * 8, 2.6], '#7a7e84', 0.45) + quad(pr, [[R + 8, side * 8 - 1.6, 2.25], [R + 2, side * 8 - 1.6, 2.3], [R + 2, side * 8 + 1.6, 2.3], [R + 8, side * 8 + 1.6, 2.25]], '#8a8e94') : ''), g: 'man' + side });
    // the saucer: thick in the middle, thin at the rim
    const prof = []; for (let i = 0; i <= 16; i++) { const x = R - (2 * R * i) / 16; const w = Math.sqrt(Math.max(0.01, R * R - x * x)); prof.push([x, w, 1.4 + 4.2 * Math.sqrt(Math.max(0, 1 - (x * x) / (R * R))) * 0.85]); }
    S.body(prof, { color: HULL, n: 40, z: 0, after: (pr, sc) => {
      let m = '';
      // radial panel lines and the raised central ring
      for (let a = 0; a < 360; a += 30) { const t = a * Math.PI / 180; m += seg(pr, [12 * Math.cos(t), 12 * Math.sin(t), 4.8], [29 * Math.cos(t), 29 * Math.sin(t), 1.9], '#7a7e84', 0.4, 'opacity=".6"'); }
      m += `<path d="${pl(arcPts(pr, 12, 0, 360, 4.9, 40))}Z" fill="#b8bcc0" stroke="#6a6e74" stroke-width=".45"/>`;
      m += `<path d="${pl(arcPts(pr, 20, 0, 360, 3.9, 48))}Z" fill="none" stroke="#6a6e74" stroke-width=".4" opacity=".7"/>`;
      // rust and grime panels
      for (const [r0, a0, da, c] of [[14, 40, 22, '#a89a84'], [16, 200, 30, '#8a8e94'], [22, 120, 18, '#a8846a'], [22, 300, 22, '#9aa0a6'], [15, 260, 16, '#b0a48e'], [23, 20, 14, '#8a8e94']]) {
        const a = arcPts(pr, r0, a0, a0 + da, 4.2, 6); const b = arcPts(pr, r0 + 5, a0 + da, a0, 3.2, 6); m += `<path d="${pl(a.concat(b))}Z" fill="${c}" opacity=".75"/>`;
      }
      if (o.trim) m += `<path d="${pl(arcPts(pr, R - 1.2, 0, 360, 1.8, 60))}Z" fill="none" stroke="${o.trim}" stroke-width="${f(0.9 * sc)}"/><path d="${pl(arcPts(pr, 12, 0, 360, 4.9, 40))}Z" fill="none" stroke="${o.trim}" stroke-width="${f(0.6 * sc)}"/>`;
      // engine glow along the stern
      m += `<path d="${pl(arcPts(pr, R - 0.6, 128, 232, 1.2, 30))}" fill="none" stroke="${o.engine || '#bfe8ff'}" stroke-width="${f(1.7 * sc)}" stroke-linecap="round" style="filter:drop-shadow(0 0 3px #4ab8ff)"/>`;
      // front slot between the mandibles
      m += quad(pr, [[R + 1, -4.4, 1.6], [R - 9, -3.4, 3.4], [R - 9, 3.4, 3.4], [R + 1, 4.4, 1.6]], '#3a3e44');
      for (let a = 15; a < 360; a += 45) { const tt = a * Math.PI / 180; const c = pr([16.5 * Math.cos(tt), 16.5 * Math.sin(tt), 4.4]); m += `<rect x="${f(c[0] - 1.2 * sc)}" y="${f(c[1] - 0.8 * sc)}" width="${f(2.4 * sc)}" height="${f(1.6 * sc)}" fill="#7a7e84" opacity=".8"/>`; }
      // side docking rings
      for (const side of [-1, 1]) { const c = pr([-2, side * (R - 1), 1.6]); m += `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(2.4 * sc)}" fill="#9a9ea4" stroke="#5a5e64" stroke-width=".4"/>`; }
      return m;
    } });
    // cockpit tube on the starboard side
    S.body([[25, 0.6, 0.6], [24, 3, 3], [21, 3.6, 3.6], [4, 3.6, 3.6], [-2, 3.2, 3.2]].map(([x, w, h]) => [x, w, h, 1.6, -25.5]), { color: '#c8cbce', rings: [2], zBias: -8, after: (pr, sc) => { const a = pr([24.5, -25.5, 2.8]); return `<ellipse cx="${f(a[0])}" cy="${f(a[1])}" rx="${f(2.2 * sc)}" ry="${f(1.6 * sc)}" fill="#14202c" stroke="#7a8088" stroke-width=".4"/><path d="M${f(a[0] - 1.2 * sc)} ${f(a[1] - 0.6 * sc)} L${f(a[0] + 0.6 * sc)} ${f(a[1] - 1 * sc)}" stroke="#9fd4ff" stroke-width=".5" opacity=".8"/>`; } });
    // dorsal quad-laser turret and the rectangular sensor dish
    S.at([-2, 0, 5.8], (q, sc, pr) => `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f(4.2 * sc)}" fill="#8a8e94" stroke="#4a4e54" stroke-width=".5"/><circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f(2.4 * sc)}" fill="#1a2430"/>` + [[-1.2], [1.2]].map(([dy]) => seg(pr, [0, dy, 6.4], [9, dy, 6.4], '#3a3e44', 0.6 * sc)).join(''), { zBias: -9 });
    S.at([-6, 15, 5], (q, sc) => `<ellipse cx="${f(q[0])}" cy="${f(q[1])}" rx="${f(4.6 * sc)}" ry="${f(3.4 * sc)}" fill="#e2e4e6" stroke="#6a6e74" stroke-width=".5"/><ellipse cx="${f(q[0] + 0.6 * sc)}" cy="${f(q[1] + 0.4 * sc)}" rx="${f(2.6 * sc)}" ry="${f(1.8 * sc)}" fill="#b4b8bc"/><circle cx="${f(q[0] + 0.6 * sc)}" cy="${f(q[1] + 0.4 * sc)}" r="${f(0.6 * sc)}" fill="#5a5e64"/>`, { zBias: -9 });
    return S.render(o.box);
  };

  root.Ships3 = SH;
})(typeof window !== 'undefined' ? window : globalThis);

// Register the three-quarter-lit ships with the card art.
(function (root) {
  const SH = root.Ships3;
  const map = { cassian_haulcraft: 'cassian_haulcraft', mando_n1: 'mando_n1', n1: 'n1', uwing: 'uwing', houndstooth: 'houndstooth', falcon: 'falcon' };
  for (const [shape, fn] of Object.entries(map)) root.Art.addArt('ship', shape, () => SH[fn]());
})(typeof window !== 'undefined' ? window : globalThis);
