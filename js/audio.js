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

  // ---------- Music: original themes on a simple sequencer ----------
  // Each track is a list of bars; each bar has a chord (MIDI notes) and an
  // optional melody line in 8th notes (null = rest).
  const TRACKS = {
    menu: {
      bpm: 76,
      bars: [
        { chord: [48, 55, 60, 64], mel: [72, null, 79, null, 77, 76, 74, null] },
        { chord: [45, 52, 57, 60], mel: [76, null, null, 72, 74, null, 69, null] },
        { chord: [41, 48, 53, 57], mel: [69, null, 72, null, 77, null, 76, 74] },
        { chord: [43, 50, 55, 59], mel: [74, null, null, null, 79, null, 74, null] },
        { chord: [48, 55, 60, 64], mel: [72, null, 79, null, 84, null, 83, 81] },
        { chord: [44, 51, 56, 60], mel: [80, null, 79, null, 77, null, 75, null] },
        { chord: [46, 53, 58, 62], mel: [74, null, 77, null, 82, null, 81, 79] },
        { chord: [43, 50, 55, 59], mel: [79, null, null, null, 74, null, null, null] },
      ],
      drums: 'march',
    },
    battle: {
      bpm: 132,
      bars: [
        { chord: [45, 52, 57, 60], mel: [69, null, 72, 69, 76, null, 74, 72], ost: 45 },
        { chord: [45, 52, 57, 60], mel: [71, null, 69, null, 67, 69, null, null], ost: 45 },
        { chord: [41, 48, 53, 57], mel: [65, null, 69, 72, 77, null, 76, 74], ost: 41 },
        { chord: [43, 50, 55, 59], mel: [74, null, 71, null, 67, null, null, null], ost: 43 },
        { chord: [45, 52, 57, 60], mel: [81, null, 79, 77, 76, null, 72, null], ost: 45 },
        { chord: [46, 53, 58, 62], mel: [77, null, 74, null, 70, 74, 77, null], ost: 46 },
        { chord: [44, 51, 56, 60], mel: [75, null, 72, null, 68, null, 72, 75], ost: 44 },
        { chord: [40, 47, 52, 56], mel: [76, null, null, null, 68, 71, 74, 76], ost: 40 },
      ],
      drums: 'battle',
    },
  };

  const music = { track: null, timer: null, nextTime: 0, step: 0, el: null, custom: {} };

  function voice(type, n, t, d, v, opts) { osc(type, NOTE(n), 0, t, d, v, musicBus, opts); }

  function scheduleStep(tr, step, t) {
    const spb = 60 / tr.bpm / 2; // 8th-note length
    const bar = tr.bars[Math.floor(step / 8) % tr.bars.length];
    const i = step % 8;
    if (i === 0) {
      // Strings pad: detuned saws through a soft filter.
      for (const n of bar.chord) {
        voice('sawtooth', n, t, spb * 8, 0.022, { lp: 1100, a: 0.4, hold: spb * 5, rel: spb * 3 });
        voice('sawtooth', n + 12, t, spb * 8, 0.012, { lp: 1400, a: 0.5, hold: spb * 5, rel: spb * 3, detune: 9 });
      }
      voice('triangle', bar.chord[0] - 12, t, spb * 8, 0.06, { a: 0.05, hold: spb * 6, rel: spb * 2 });
    }
    const m = bar.mel[i];
    if (m) {
      // Brass lead.
      voice('sawtooth', m, t, spb * 1.6, 0.045, { lp: 2200, a: 0.03, hold: spb * 0.9, rel: spb * 0.7 });
      voice('square', m - 12, t, spb * 1.6, 0.015, { lp: 1600, a: 0.03, hold: spb * 0.9, rel: spb * 0.7 });
    }
    if (bar.ost) {
      // Driving string ostinato in 16ths.
      [0, 0.5].forEach((h, k) => voice('sawtooth', bar.ost + (k && i % 2 ? 7 : 12), t + h * spb, spb * 0.45, 0.02, { lp: 1800, a: 0.005, rel: spb * 0.4 }));
    }
    // Percussion: timpani and snare-like hits.
    if (tr.drums === 'march') {
      if (i === 0 || i === 4) { osc('sine', 90, 45, t, 0.4, 0.18, musicBus); }
      if (i === 6 || i === 7) noise(t, 0.08, 0.04, 'bandpass', 2500, null, musicBus, 1);
    } else {
      if (i % 4 === 0) osc('sine', 100, 40, t, 0.35, 0.22, musicBus);
      if (i % 4 === 2) noise(t, 0.12, 0.09, 'bandpass', 1800, null, musicBus, 1);
      if (i === 7) osc('sine', 130, 60, t, 0.25, 0.14, musicBus);
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
        music.nextTime += 60 / tr.bpm / 2;
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
