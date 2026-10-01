// Sound: synthesized effects (blasters, sabers, explosions, crate stings) and
// two original space-opera themes, all generated with the Web Audio API.
// Players can also pick their own music files; those stay in this browser.

(function (root) {
  const PREF_KEY = 'swcg-audio';
  const prefs = (() => {
    try { return { sfx: true, music: true, sfxVol: 0.6, musicVol: 0.35, ...JSON.parse(localStorage.getItem(PREF_KEY) || '{}') }; } catch (e) { return { sfx: true, music: true, sfxVol: 0.6, musicVol: 0.35 }; }
  })();
  const savePrefs = () => { try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (e) { /* storage blocked */ } };

  let ctx = null;
  let sfxBus = null;
  let musicBus = null;
  let noiseBuf = null;

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.connect(ctx.destination);
    sfxBus = ctx.createGain();
    sfxBus.gain.value = prefs.sfx ? prefs.sfxVol : 0;
    sfxBus.connect(comp);
    musicBus = ctx.createGain();
    musicBus.gain.value = prefs.music ? prefs.musicVol : 0;
    musicBus.connect(comp);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ctx;
  }

  // ---------- Building blocks ----------
  function env(g, t, a, peak, hold, rel) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + a);
    g.gain.setValueAtTime(Math.max(0.0002, peak), t + a + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + rel);
  }
  function osc(type, f0, f1, t, dur, peak, bus, opts = {}) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    if (opts.detune) o.detune.value = opts.detune;
    env(g, t, opts.a || 0.005, peak, opts.hold || 0, opts.rel || dur);
    let node = o;
    if (opts.lp) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(opts.lp, t);
      if (opts.lpEnd) f.frequency.exponentialRampToValueAtTime(opts.lpEnd, t + dur);
      f.Q.value = opts.q || 1;
      node.connect(f);
      node = f;
    }
    node.connect(g);
    g.connect(bus || sfxBus);
    o.start(t);
    o.stop(t + (opts.a || 0.005) + (opts.hold || 0) + (opts.rel || dur) + 0.05);
    return o;
  }
  function noise(t, dur, peak, type, f0, f1, bus, q) {
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = type || 'lowpass';
    f.frequency.setValueAtTime(f0 || 1200, t);
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    f.Q.value = q || 0.8;
    const g = ctx.createGain();
    env(g, t, 0.004, peak, 0, dur);
    s.connect(f); f.connect(g); g.connect(bus || sfxBus);
    s.start(t, Math.random() * 1.5);
    s.stop(t + dur + 0.05);
  }
  const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);

  // ---------- Sound effects ----------
  const SFX = {
    click(t) { osc('sine', 1400, 900, t, 0.05, 0.12); },
    hover(t) { osc('sine', 2200, 2400, t, 0.03, 0.03); },
    blaster(t) { osc('sawtooth', 1600, 180, t, 0.16, 0.22, null, { lp: 4000, lpEnd: 600 }); osc('square', 900, 120, t, 0.12, 0.08); },
    laser(t) { osc('sawtooth', 2400, 300, t, 0.2, 0.18, null, { lp: 5000, lpEnd: 900 }); noise(t, 0.08, 0.1, 'highpass', 3000); },
    saber(t) {
      osc('sawtooth', 95, 140, t, 0.38, 0.22, null, { lp: 900, lpEnd: 2200, a: 0.03, q: 4 });
      osc('sawtooth', 97, 150, t, 0.38, 0.16, null, { lp: 700, lpEnd: 1800, a: 0.03, detune: 12 });
      noise(t, 0.25, 0.1, 'bandpass', 600, 2400, null, 2);
    },
    ignite(t) { osc('sawtooth', 60, 110, t, 0.5, 0.25, null, { lp: 300, lpEnd: 1600, a: 0.05, q: 6 }); noise(t, 0.3, 0.12, 'bandpass', 300, 2000, null, 3); },
    hit(t) { osc('sine', 160, 50, t, 0.18, 0.4); noise(t, 0.1, 0.18, 'lowpass', 2000, 300); },
    crit(t) { SFX.hit(t); osc('square', 1200, 600, t, 0.12, 0.08); },
    explosion(t) { noise(t, 1.1, 0.7, 'lowpass', 1800, 80); osc('sine', 90, 30, t, 0.9, 0.6); },
    zap(t) { for (let i = 0; i < 6; i++) noise(t + i * 0.05, 0.05, 0.25, 'bandpass', 2000 + Math.random() * 3000, null, null, 6); osc('sawtooth', 120, 80, t, 0.35, 0.08); },
    lightning(t) { for (let i = 0; i < 14; i++) noise(t + i * 0.045 + Math.random() * 0.02, 0.04, 0.3, 'bandpass', 1500 + Math.random() * 4000, null, null, 5); osc('sawtooth', 70, 50, t, 0.8, 0.1, null, { lp: 400 }); },
    heal(t) { [72, 76, 79, 84].forEach((n, i) => osc('sine', NOTE(n), 0, t + i * 0.07, 0.4, 0.12, null, { rel: 0.5 })); },
    freeze(t) { noise(t, 0.6, 0.2, 'highpass', 4000, 9000); [96, 91, 88].forEach((n, i) => osc('triangle', NOTE(n), 0, t + i * 0.05, 0.3, 0.06)); },
    fire(t) { noise(t, 0.7, 0.35, 'bandpass', 400, 1600, null, 1.2); },
    whoosh(t) { noise(t, 0.45, 0.25, 'bandpass', 300, 3000, null, 1.5); },
    ult(t) { osc('sine', 50, 40, t, 1.2, 0.6); noise(t, 1, 0.25, 'lowpass', 200, 3000); [38, 45, 50].forEach((n, i) => osc('sawtooth', NOTE(n), 0, t + 0.05, 1.1, 0.07, null, { lp: 900, a: 0.2, detune: i * 5 })); },
    ko(t) { osc('sine', 220, 40, t, 0.5, 0.3); noise(t, 0.4, 0.2, 'lowpass', 1200, 100); },
    coins(t) { for (let i = 0; i < 10; i++) osc('triangle', NOTE(88 + (i % 4) * 3), 0, t + i * 0.05, 0.12, 0.08); },
    rumble(t, dur = 1.5) { noise(t, dur, 0.25, 'lowpass', 120, 400); osc('sine', 40, 60, t, dur, 0.3, null, { a: dur * 0.6 }); },
    crack(t) { noise(t, 0.12, 0.4, 'highpass', 1500); osc('square', 300, 80, t, 0.1, 0.1); },
    burst(t) { SFX.explosion(t); [60, 67, 72, 76].forEach((n, i) => osc('triangle', NOTE(n), 0, t + 0.05 + i * 0.03, 0.8, 0.07)); },
    glitch(t) { for (let i = 0; i < 12; i++) osc('square', 80 + Math.random() * 1600, 0, t + i * 0.06, 0.05, 0.08); noise(t, 0.8, 0.2, 'bandpass', 600, 4000, null, 8); },
    reveal_common(t) { osc('triangle', NOTE(72), 0, t, 0.25, 0.1); },
    reveal_rare(t) { [72, 79].forEach((n, i) => osc('triangle', NOTE(n), 0, t + i * 0.08, 0.4, 0.1)); },
    reveal_epic(t) { [67, 74, 79, 83].forEach((n, i) => osc('triangle', NOTE(n), 0, t + i * 0.08, 0.6, 0.11)); noise(t, 0.4, 0.08, 'highpass', 5000); },
    reveal_legendary(t) { [60, 67, 72, 76, 79, 84].forEach((n, i) => osc('sawtooth', NOTE(n), 0, t + i * 0.07, 1.2, 0.06, null, { lp: 3000 })); osc('sine', 48, 36, t, 1.5, 0.4); },
    reveal_mythic(t) { SFX.glitch(t); [49, 56, 61, 64, 68].forEach((n, i) => osc('sawtooth', NOTE(n), 0, t + 0.3 + i * 0.09, 1.6, 0.07, null, { lp: 2400 })); osc('sine', 40, 28, t + 0.3, 2, 0.5); },
    victory(t) {
      // An original brass fanfare: rising fourths into a major chord.
      const brass = (n, at, d, v = 0.09) => { osc('sawtooth', NOTE(n), 0, t + at, d, v, null, { lp: 1800, a: 0.03, hold: d * 0.6, rel: d * 0.5 }); osc('sawtooth', NOTE(n), 0, t + at, d, v * 0.7, null, { lp: 1500, a: 0.03, hold: d * 0.6, rel: d * 0.5, detune: 8 }); };
      brass(60, 0, 0.18); brass(65, 0.2, 0.18); brass(67, 0.4, 0.3); brass(72, 0.75, 0.9, 0.11);
      brass(64, 0.75, 0.9, 0.07); brass(67, 0.75, 0.9, 0.07); brass(48, 0.75, 1.0, 0.08);
      osc('sine', 60, 40, t + 0.75, 0.6, 0.4);
    },
    defeat(t) { [67, 63, 60, 55].forEach((n, i) => osc('sawtooth', NOTE(n), 0, t + i * 0.28, 0.5, 0.07, null, { lp: 1200, a: 0.04 })); osc('sine', 55, 30, t + 0.9, 1, 0.3); },
    jackpot(t) { SFX.coins(t); SFX.coins(t + 0.5); [72, 76, 79, 84, 88].forEach((n, i) => osc('square', NOTE(n), 0, t + i * 0.09, 0.3, 0.05)); },
    rankup(t) { [60, 64, 67, 72, 76].forEach((n, i) => osc('triangle', NOTE(n), 0, t + i * 0.08, 0.7, 0.1)); },
  };

  const lastPlayed = {};
  function play(name, arg) {
    if (!prefs.sfx || !SFX[name]) return;
    const now = performance.now();
    if (lastPlayed[name] && now - lastPlayed[name] < 55) return;
    lastPlayed[name] = now;
    if (!ensure() || ctx.state !== 'running') return;
    try { SFX[name](ctx.currentTime + 0.01, arg); } catch (e) { /* never break the game over a sound */ }
  }

  // ---------- Music: original cinematic themes ----------
  // Dark, slow and wide: evolving string pads over a sub drone, long brass
  // swells, deep war drums and a big reverb. No bouncy leads.
  // Each bar: chord (MIDI), horn line in quarter notes (null = hold/rest).
  const TRACKS = {
    menu: {
      bpm: 64,
      bars: [
        { chord: [38, 50, 53, 57], horn: [62, null, null, null] },
        { chord: [34, 50, 53, 58], horn: [65, null, 62, null] },
        { chord: [41, 48, 53, 57], horn: [60, null, null, null] },
        { chord: [36, 48, 52, 55], horn: [64, null, 67, null] },
        { chord: [38, 50, 53, 57], horn: [69, null, null, null] },
        { chord: [34, 50, 53, 58], horn: [70, null, 69, null] },
        { chord: [43, 50, 55, 58], horn: [67, null, 65, null] },
        { chord: [45, 49, 52, 57], horn: [64, null, null, null] },
      ],
      drums: 'slow',
      shimmer: true,
    },
    battle: {
      bpm: 96,
      bars: [
        { chord: [36, 48, 51, 55], horn: [60, null, null, null], ost: 36 },
        { chord: [36, 48, 51, 55], horn: [63, null, 62, null], ost: 36 },
        { chord: [32, 48, 51, 56], horn: [60, null, null, null], ost: 32 },
        { chord: [31, 50, 55, 58], horn: [62, null, 55, null], ost: 31 },
        { chord: [36, 48, 51, 55], horn: [67, null, null, null], ost: 36 },
        { chord: [39, 51, 55, 58], horn: [70, null, 67, null], ost: 39 },
        { chord: [32, 48, 51, 56], horn: [68, null, 65, null], ost: 32 },
        { chord: [31, 47, 50, 55], horn: [67, null, null, 62], ost: 31 },
      ],
      drums: 'war',
    },
  };

  const music = { track: null, timer: null, nextTime: 0, step: 0, el: null, custom: {} };
  let verb = null;

  // A long hall reverb built from decaying noise.
  function reverbSend() {
    if (verb) return verb;
    const len = ctx.sampleRate * 3.2;
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    const conv = ctx.createConvolver();
    conv.buffer = ir;
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    conv.connect(wet);
    wet.connect(musicBus);
    verb = ctx.createGain();
    verb.connect(conv);
    verb.connect(musicBus);
    return verb;
  }

  // Pad voice: several detuned saws through a slowly opening low-pass.
  function pad(n, t, dur, v) {
    const out = reverbSend();
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.Q.value = 0.7;
    f.frequency.setValueAtTime(280, t);
    f.frequency.linearRampToValueAtTime(900, t + dur * 0.5);
    f.frequency.linearRampToValueAtTime(420, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v, t + dur * 0.35);
    g.gain.linearRampToValueAtTime(v * 0.8, t + dur * 0.8);
    g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.6);
    f.connect(g);
    g.connect(out);
    for (const det of [-9, 0, 8]) {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = NOTE(n);
      o.detune.value = det;
      o.connect(f);
      o.start(t);
      o.stop(t + dur + 0.7);
    }
  }

  // Low brass swell: soft attack, filter that blooms and closes.
  function horn(n, t, dur, v) {
    const out = reverbSend();
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.Q.value = 1.2;
    f.frequency.setValueAtTime(300, t);
    f.frequency.linearRampToValueAtTime(1300, t + 0.35);
    f.frequency.linearRampToValueAtTime(600, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v, t + 0.3);
    g.gain.setValueAtTime(v, t + dur * 0.7);
    g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.4);
    f.connect(g);
    g.connect(out);
    for (const [type, mult, det] of [['sawtooth', 1, 0], ['sawtooth', 1, 6], ['triangle', 0.5, 0]]) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = NOTE(n) * mult;
      o.detune.value = det;
      o.connect(f);
      o.start(t);
      o.stop(t + dur + 0.5);
    }
  }

  // War drum: deep pitched thump plus a short burst of filtered noise.
  function drum(t, v, pitch = 70) {
    const out = reverbSend();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(pitch, t);
    o.frequency.exponentialRampToValueAtTime(pitch * 0.45, t + 0.35);
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    o.connect(g);
    g.connect(out);
    o.start(t);
    o.stop(t + 0.65);
    noise(t, 0.12, v * 0.25, 'lowpass', 900, 200, out);
  }

  function scheduleStep(tr, step, t) {
    const s16 = 60 / tr.bpm / 4;
    const bar = tr.bars[Math.floor(step / 16) % tr.bars.length];
    const i = step % 16;
    const barLen = s16 * 16;
    if (i === 0) {
      // Strings pad held across the bar, plus a sub drone an octave under the root.
      for (const n of bar.chord.slice(1)) pad(n, t, barLen, 0.018);
      osc('triangle', NOTE(bar.chord[0] - 12), 0, t, barLen, 0.07, reverbSend(), { a: 0.6, hold: barLen * 0.6, rel: barLen * 0.6 });
    }
    if (i % 4 === 0) {
      const n = bar.horn[i / 4];
      if (n) {
        let len = 1;
        while (i / 4 + len < 4 && bar.horn[i / 4 + len] === null) len++;
        horn(n, t, s16 * 4 * len, 0.032);
      }
    }
    if (bar.ost && i % 2 === 0) {
      // Low, muted string ostinato: root and fifth, staccato.
      const n = bar.ost + (i % 8 === 6 ? 7 : 12);
      osc('sawtooth', NOTE(n), 0, t, s16 * 0.9, 0.022, reverbSend(), { lp: 700, a: 0.008, rel: s16 * 0.8 });
    }
    if (tr.shimmer && i % 4 === 2 && Math.random() < 0.5) {
      // Distant star shimmer.
      const n = bar.chord[1 + Math.floor(Math.random() * 3)] + 24;
      osc('sine', NOTE(n), 0, t, 1.6, 0.01, reverbSend(), { a: 0.3, rel: 1.4 });
    }
    if (tr.drums === 'slow') {
      if (i === 0 && Math.floor(step / 16) % 2 === 0) drum(t, 0.35, 55);
      if (i === 12 && Math.floor(step / 16) % 4 === 3) drum(t, 0.22, 70);
    } else {
      if (i === 0 || i === 6 || i === 10) drum(t, i === 0 ? 0.42 : 0.28, i === 0 ? 60 : 78);
      if (i === 12 || i === 14) drum(t, 0.18, 95);
      if (i === 8) noise(t, 0.3, 0.05, 'bandpass', 3000, 1200, reverbSend(), 2);
    }
  }

  function startSynth(name) {
    const tr = TRACKS[name];
    music.step = 0;
    music.nextTime = ctx.currentTime + 0.1;
    clearInterval(music.timer);
    music.timer = setInterval(() => {
      if (!ctx || music.track !== name) return;
      while (music.nextTime < ctx.currentTime + 0.25) {
        scheduleStep(tr, music.step, music.nextTime);
        music.nextTime += 60 / tr.bpm / 4;
        music.step += 1;
      }
    }, 40);
  }

  function stopMusic() {
    clearInterval(music.timer);
    music.timer = null;
    if (music.el) { music.el.pause(); music.el = null; }
  }

  function setMusic(name) {
    if (music.track === name) return;
    music.track = name;
    stopMusic();
    if (!name || !prefs.music || !ensure() || ctx.state !== 'running') return;
    const blob = music.custom[name];
    if (blob) {
      const a = new Audio(URL.createObjectURL(blob));
      a.loop = true;
      a.volume = prefs.musicVol;
      a.play().catch(() => {});
      music.el = a;
      return;
    }
    startSynth(name);
  }

  // ---------- Your own music (kept in this browser via IndexedDB) ----------
  function db() {
    return new Promise((resolve, reject) => {
      try {
        const req = indexedDB.open('swcg-music', 1);
        req.onupgradeneeded = () => req.result.createObjectStore('tracks');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      } catch (e) { reject(e); }
    });
  }
  async function loadCustom() {
    try {
      const d = await db();
      for (const key of ['menu', 'battle']) {
        await new Promise((res) => {
          const r = d.transaction('tracks').objectStore('tracks').get(key);
          r.onsuccess = () => { if (r.result) music.custom[key] = r.result; res(); };
          r.onerror = () => res();
        });
      }
    } catch (e) { /* IndexedDB unavailable */ }
  }
  async function saveCustom(key, file) {
    music.custom[key] = file || null;
    if (!file) delete music.custom[key];
    try {
      const d = await db();
      const tx = d.transaction('tracks', 'readwrite');
      if (file) tx.objectStore('tracks').put(file, key); else tx.objectStore('tracks').delete(key);
    } catch (e) { /* keep for this session only */ }
    if (music.track === key) { const t = music.track; music.track = null; setMusic(t); }
  }

  function applyVolumes() {
    if (!ctx) return;
    sfxBus.gain.value = prefs.sfx ? prefs.sfxVol : 0;
    musicBus.gain.value = prefs.music ? prefs.musicVol : 0;
    if (music.el) music.el.volume = prefs.music ? prefs.musicVol : 0;
    if (!prefs.music) stopMusic();
    else if (music.track && !music.timer && !music.el) { const t = music.track; music.track = null; setMusic(t); }
  }

  // Browsers only allow audio after a user gesture.
  let wanted = 'menu';
  function unlock() {
    if (!ensure()) return;
    if (ctx.state !== 'running') ctx.resume().then(() => { const t = music.track || wanted; music.track = null; setMusic(t); });
  }
  window.addEventListener('pointerdown', unlock, { capture: true });
  window.addEventListener('keydown', unlock, { capture: true });
  loadCustom();

  root.Sound = {
    play,
    music: (name) => { wanted = name; if (ctx && ctx.state === 'running') setMusic(name); },
    prefs,
    set(key, value) { prefs[key] = value; savePrefs(); applyVolumes(); },
    saveCustom,
    hasCustom: (key) => !!music.custom[key],
  };
})(window);
