(function (root) {
  'use strict';

const D = root.GameData;
const UI = root.UI;
const H = UI.hooks;
const K = root.Art.kit;
const { P, E, C, R, L, shade, SCENES, shoulders, SHIPS } = K;
const el = (h) => UI.el(h);
const esc = (t) => UI.esc(t);
const motion = () => UI.motionOK();
const Z = () => { const s = Player.state; s.z = s.z || {}; s.z.kt = s.z.kt || []; return s.z; };

// ---------- styles (injected so the stylesheet stays clean) ----------
const css = `
.xq-stage { position: absolute; inset: 0; z-index: 3; pointer-events: none; }
.xq-line { position: absolute; left: 0; right: 0; z-index: 4; text-align: center; padding: 0 16px; margin: 0; opacity: 0; font-family: var(--font-display); letter-spacing: 0.08em; font-size: clamp(16px, 3vw, 24px); color: #e8ecff; animation: jp-sub 0.5s var(--t) forwards; }
.feat-cine.reveal .xq-stage, .feat-cine.reveal .xq-line { display: none; }
.xq-pair { position: absolute; top: 18%; left: 0; right: 0; display: flex; justify-content: center; gap: clamp(16px, 8vw, 80px); }
.xq-who { width: clamp(100px, 24vmin, 160px); aspect-ratio: 3 / 4; border-radius: 12px; overflow: hidden; opacity: 0; }
.xq-who .portrait { width: 100%; height: 100%; }
.xq-who.v { border: 2px solid #ff2a3a; box-shadow: 0 0 30px rgba(255, 42, 58, 0.6); animation: xq-inl 0.8s 0.2s cubic-bezier(.2,.9,.3,1) forwards; }
.xq-who.l { border: 2px solid #46c46a; box-shadow: 0 0 30px rgba(70, 196, 106, 0.6); animation: xq-inr 0.8s 0.2s cubic-bezier(.2,.9,.3,1) forwards, xq-shake 0.08s 3.4s linear 12; }
@keyframes xq-inl { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: none; } }
@keyframes xq-inr { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: none; } }
@keyframes xq-shake { 50% { transform: translate(3px, -2px); } }
.xq-no { position: absolute; top: 56%; left: 0; right: 0; text-align: center; opacity: 0; font-family: var(--font-display); font-weight: 800; font-size: clamp(34px, 10vw, 80px); letter-spacing: 0.05em; color: #fff; text-shadow: 0 0 24px #46c46a; animation: xq-no 1.6s 3.3s forwards; }
@keyframes xq-no { 0% { opacity: 0; transform: scale(0.6); } 20% { opacity: 1; transform: scale(1.15); } 100% { opacity: 1; transform: scale(1.4); letter-spacing: 0.3em; } }
.feat-cine.xq-dad { background: radial-gradient(circle at 30% 40%, rgba(160, 10, 20, 0.45), transparent 55%), radial-gradient(circle at 70% 40%, rgba(20, 120, 50, 0.4), transparent 55%), #020308; }
.xq-bars::before, .xq-bars::after { content: ''; position: absolute; left: 0; right: 0; height: 0; background: #000; z-index: 7; animation: xq-bar 0.7s forwards; }
.xq-bars::before { top: 0; } .xq-bars::after { bottom: 0; }
@keyframes xq-bar { to { height: 10vh; } }
.feat-cine.reveal .xq-bars { display: none; }
.xq-fog { position: absolute; left: -10%; right: -10%; bottom: 0; height: 40%; background: radial-gradient(ellipse at 30% 100%, rgba(255, 60, 70, 0.22), transparent 60%), radial-gradient(ellipse at 70% 100%, rgba(70, 200, 110, 0.2), transparent 60%); filter: blur(10px); animation: xq-fog 6s ease-in-out infinite alternate; }
@keyframes xq-fog { to { transform: translateX(4%); } }
.xq-clash { position: absolute; top: calc(18% + clamp(100px, 24vmin, 160px) * 0.66); left: 50%; width: 10px; height: 10px; margin: -5px; border-radius: 50%; background: #fff; box-shadow: 0 0 30px 14px rgba(255, 255, 255, 0.9), -20px 0 40px 10px rgba(255, 42, 58, 0.8), 20px 0 40px 10px rgba(70, 196, 106, 0.8); opacity: 0; z-index: 4; animation: xq-clash 0.18s 2.4s steps(2) 6 forwards; }
@keyframes xq-clash { 50% { opacity: 1; transform: scale(1.6); } }
.xq-dad.play .xq-pair { animation: xq-quake 0.07s 3.3s linear 14; }
@keyframes xq-quake { 50% { transform: translate(4px, -3px); } }
.xq-flick { position: absolute; inset: 0; z-index: 2; opacity: 0; background: linear-gradient(90deg, rgba(255, 42, 58, 0.35), rgba(70, 196, 106, 0.35)); animation: xq-flick 0.12s 3.3s steps(2) 10; }
@keyframes xq-flick { 50% { opacity: 1; } }
.xq-dad .fc-text .fs-kicker { background: linear-gradient(90deg, #ff4a5a, #fff, #5ae07a); -webkit-background-clip: text; background-clip: text; color: transparent; }
.xq-dad .fc-text b { text-shadow: -4px 0 20px #ff2a3a, 4px 0 20px #46c46a; }

.feat-cine.xq-jj { background: radial-gradient(circle at 50% 40%, #4a3208, #120a02 55%, #020308 80%); }
.xq-rays { position: absolute; left: 50%; top: 40%; width: 160vmax; height: 160vmax; margin: -80vmax; background: repeating-conic-gradient(rgba(255, 210, 63, 0.18) 0 6deg, transparent 6deg 18deg); opacity: 0; animation: xq-rays-in 0.6s forwards, xq-rays-spin 20s linear infinite; }
@keyframes xq-rays-in { to { opacity: 1; } }
@keyframes xq-rays-spin { to { transform: rotate(360deg); } }
.xq-ban { position: absolute; top: 12%; left: 50%; transform: translateX(-50%); opacity: 0; font-family: var(--font-display); font-weight: 800; letter-spacing: 0.3em; font-size: clamp(24px, 7vw, 56px); color: #ffd23f; text-shadow: 0 0 30px rgba(255, 210, 63, 0.8); white-space: nowrap; animation: xq-ban 3s 0.15s forwards; }
@keyframes xq-ban { 0% { opacity: 0; transform: translateX(-50%) scale(1.6); } 14% { opacity: 1; transform: translateX(-50%) scale(1); } 52% { transform: translateX(-50%); } 58% { transform: translateX(-50%) rotate(-10deg); } 66% { transform: translateX(-56%) translateY(14px) rotate(12deg); } 100% { opacity: 0; transform: translateX(-70%) translateY(70vh) rotate(48deg); } }
.xq-jjcard { position: absolute; top: 24%; left: 50%; width: clamp(130px, 34vmin, 200px); margin-left: calc(clamp(130px, 34vmin, 200px) / -2); opacity: 0; animation: xq-tumble 2.2s 1s cubic-bezier(.3,.7,.4,1) forwards; }
@keyframes xq-tumble { 0% { opacity: 1; transform: translate(-70vw, -30vh) rotate(-540deg) scale(.6); } 55% { transform: translate(0, 4vh) rotate(-20deg) scale(1); } 66% { transform: translate(0, 0) rotate(8deg) scaleY(.86) scaleX(1.08); } 78% { transform: translateY(-3vh) rotate(-3deg) scaleY(1.05) scaleX(.97); } 90% { transform: translateY(0) rotate(1deg); } 100% { opacity: 1; transform: none; } }
.xq-jjcard .xq-tile { border-width: 3px; }
.xq-bubble { position: absolute; top: 31%; left: calc(50% + clamp(60px, 16vmin, 96px)); z-index: 5; padding: 8px 14px; border-radius: 16px 16px 16px 4px; background: #fff; color: #2a1a08; font-family: var(--font-display); font-weight: 800; font-size: clamp(14px, 3.4vw, 20px); white-space: nowrap; opacity: 0; transform-origin: bottom left; animation: xq-pop 0.45s 3.1s cubic-bezier(.2,.9,.3,1.5) forwards, xq-wob 0.5s 3.6s ease-in-out 2; }
@keyframes xq-pop { from { opacity: 0; transform: scale(0.2); } to { opacity: 1; transform: none; } }
@keyframes xq-wob { 50% { transform: rotate(-5deg) scale(1.05); } }
.xq-stats { position: absolute; top: calc(24% + clamp(130px, 34vmin, 200px) * 1.38); left: 50%; transform: translateX(-50%); display: grid; grid-template-columns: repeat(4, auto); gap: 6px; }
.xq-stats span { display: grid; justify-items: center; gap: 1px; width: clamp(64px, 19vw, 82px); padding: 6px 4px; box-sizing: border-box; border-radius: 10px; background: rgba(10, 8, 4, 0.8); border: 1px solid rgba(255, 210, 63, 0.5); opacity: 0; animation: xq-pop 0.4s var(--t) cubic-bezier(.2,.9,.3,1.4) forwards; }
.xq-stats em { font-style: normal; font-size: 10px; letter-spacing: 0.16em; color: #ffd9a0; }
.xq-stats b { font-family: var(--font-display); font-size: clamp(13px, 3.6vw, 18px); color: #fff; white-space: nowrap; }
.xq-tag { position: absolute; top: calc(24% - 30px); left: 50%; transform: translateX(-50%); padding: 3px 12px; border-radius: 999px; background: linear-gradient(90deg, #5ab4ff, #ff4a5a); color: #fff; font-family: var(--font-display); font-size: 11px; letter-spacing: 0.24em; opacity: 0; animation: xq-pop 0.4s 3.3s forwards; }
.xq-jj .fc-text .fs-kicker { background: linear-gradient(90deg, #ffb347, #fff1c8, #ffb347); -webkit-background-clip: text; background-clip: text; color: transparent; }
.xq-jj .fc-text b { text-shadow: 0 0 22px #ff9a2a; }

.feat-cine.xq-kr { background: radial-gradient(circle at 50% 45%, #0a1a30, #000 70%); }
.xq-warp { position: absolute; left: 50%; top: 45%; width: 0; height: 0; }
.xq-warp i { position: absolute; left: 0; top: 0; width: 50vmax; height: 2px; transform-origin: 0 50%; background: linear-gradient(90deg, transparent, #bfe8ff 60%, #fff); opacity: 0; animation: gr-streak 0.7s var(--d) linear infinite; }
.xq-time { position: absolute; top: 40%; left: 0; right: 0; text-align: center; font-family: var(--font-display); font-weight: 800; font-size: clamp(54px, 16vmin, 130px); color: #fff; text-shadow: 0 0 30px #4aa8ff; opacity: 0; animation: jp-sub 0.5s 0.6s forwards; font-variant-numeric: tabular-nums; }
.xq-kr .fc-text .fs-kicker { background: linear-gradient(90deg, #7cd0ff, #ffd23f, #7cd0ff); -webkit-background-clip: text; background-clip: text; color: transparent; }
.xq-kr .fc-text b { text-shadow: 0 0 22px #4aa8ff; }

.feat-cine.xq-cer { background: radial-gradient(ellipse at 50% 0%, #1a2a50 0%, #0a1024 45%, #03050c 80%); cursor: default; }
.feat-cine.xq-cer.reveal { cursor: pointer; background: radial-gradient(circle at 50% 42%, #2e3050 0%, #0a1024 45%, #03050c 80%); }
.xq-doors { position: absolute; inset: 0; z-index: 8; display: flex; pointer-events: none; }
.xq-doors i { flex: 1; background: linear-gradient(90deg, #14100a, #3a2c14 50%, #14100a); box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.8); }
.xq-doors i::after { content: ''; display: block; margin: 40vh auto 0; width: 24%; aspect-ratio: 1; border-radius: 50%; border: 3px solid rgba(255, 210, 63, 0.7); box-shadow: 0 0 20px rgba(255, 210, 63, 0.4); }
.xq-doors i:first-child { animation: xq-door-l 1.4s 0.5s cubic-bezier(.7,0,.3,1) forwards; }
.xq-doors i:last-child { animation: xq-door-r 1.4s 0.5s cubic-bezier(.7,0,.3,1) forwards; }
@keyframes xq-door-l { to { transform: translateX(-102%); } }
@keyframes xq-door-r { to { transform: translateX(102%); } }
.xq-shafts { position: absolute; inset: 0; overflow: hidden; }
.xq-window { position: absolute; top: 3%; left: 50%; width: min(56vw, 300px); height: 30%; transform: translateX(-50%); border-radius: 999px 999px 0 0; overflow: hidden; border: 2px solid rgba(255, 210, 63, 0.35); box-shadow: 0 0 40px rgba(90, 140, 255, 0.25), inset 0 0 30px rgba(0, 0, 0, 0.6); background: radial-gradient(1.5px 1.5px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 70% 20%, #fff, transparent), radial-gradient(1.5px 1.5px at 45% 60%, #cfe2ff, transparent), radial-gradient(1px 1px at 85% 55%, #fff, transparent), radial-gradient(1px 1px at 30% 80%, #fff, transparent), radial-gradient(1.2px 1.2px at 60% 85%, #fff, transparent), radial-gradient(circle at 70% 35%, rgba(255, 140, 90, 0.5) 0 8%, transparent 9%), linear-gradient(180deg, #0a1638, #1a2a5a); }
.xq-window::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 32%, rgba(255, 210, 63, 0.25) 32% 33%, transparent 33% 66%, rgba(255, 210, 63, 0.25) 66% 67%, transparent 67%); }
.xq-emblem { position: absolute; top: 14%; left: 50%; width: min(80vw, 420px); aspect-ratio: 1; transform: translateX(-50%); color: #ffd23f; opacity: 0.07; animation: xq-breathe 6s ease-in-out infinite; }
.xq-emblem svg { width: 100%; height: 100%; }
@keyframes xq-breathe { 50% { opacity: 0.13; } }
.xq-banner { position: absolute; top: 0; width: clamp(34px, 9vw, 60px); height: 48%; background: linear-gradient(180deg, #13245a, #0a1638 85%); border: 1px solid rgba(255, 210, 63, 0.45); border-top: 0; clip-path: polygon(0 0, 100% 0, 100% 92%, 50% 100%, 0 92%); box-shadow: inset 0 -20px 30px rgba(0, 0, 0, 0.4); animation: xq-wave 5s ease-in-out infinite alternate; transform-origin: top center; }
.xq-banner::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 6px; background: linear-gradient(90deg, #a86f08, #ffd23f, #a86f08); }
.xq-banner i { position: absolute; left: 50%; top: 34%; width: 70%; aspect-ratio: 1; transform: translateX(-50%); color: #ffd23f; opacity: 0.85; }
.xq-banner i svg { width: 100%; height: 100%; }
@keyframes xq-wave { to { transform: skewX(1.5deg) scaleY(1.01); } }
.xq-pillar { position: absolute; top: 0; bottom: 36%; width: clamp(14px, 4vw, 26px); background: linear-gradient(90deg, #0a1024, #1e2c56 45%, #0a1024); border-left: 1px solid rgba(255, 210, 63, 0.18); border-right: 1px solid rgba(255, 210, 63, 0.18); }
.xq-grid { position: absolute; left: -30%; right: -30%; bottom: 0; height: 36%; background: repeating-linear-gradient(90deg, rgba(255, 210, 63, 0.10) 0 1px, transparent 1px 48px), repeating-linear-gradient(0deg, rgba(255, 210, 63, 0.08) 0 1px, transparent 1px 34px); transform: perspective(380px) rotateX(62deg); transform-origin: top center; -webkit-mask-image: linear-gradient(180deg, #000 10%, transparent 90%); mask-image: linear-gradient(180deg, #000 10%, transparent 90%); }
.xq-shafts i { position: absolute; top: -10%; width: 18%; height: 90%; background: linear-gradient(180deg, rgba(200, 225, 255, 0.2), rgba(200, 225, 255, 0.04) 60%, transparent 85%); filter: blur(10px); transform-origin: top center; animation: xq-sway 7s ease-in-out infinite alternate; }
@keyframes xq-sway { from { transform: rotate(var(--r)) translateX(-4%); } to { transform: rotate(calc(var(--r) * -0.6)) translateX(4%); } }
.xq-dust { position: absolute; inset: 0; overflow: hidden; }
.xq-dust i { position: absolute; bottom: -4%; width: 3px; height: 3px; border-radius: 50%; background: #ffe7a8; box-shadow: 0 0 6px #ffd23f; opacity: 0; animation: xq-rise var(--s) var(--d) linear infinite; }
@keyframes xq-rise { 0% { opacity: 0; transform: translateY(0); } 15% { opacity: 0.9; } 100% { opacity: 0; transform: translate(var(--x), -100vh); } }
.xq-floor2 { position: absolute; left: 0; right: 0; bottom: 0; height: 36%; background: radial-gradient(ellipse at 50% 0%, rgba(120, 160, 255, 0.18), transparent 60%), linear-gradient(180deg, #0c1430, #03050c); border-top: 1px solid rgba(255, 210, 63, 0.35); box-shadow: 0 -1px 24px rgba(255, 210, 63, 0.15); }
.xq-title { position: absolute; top: 7%; left: 12px; right: 12px; z-index: 4; text-align: center; opacity: 0; animation: jp-sub 0.8s 1.7s forwards; }
.xq-title b { display: block; font-family: var(--font-display); font-weight: 800; letter-spacing: 0.22em; text-indent: 0.22em; font-size: clamp(17px, 4.6vw, 34px); white-space: nowrap; background: linear-gradient(180deg, #fff6c8, #ffd23f 55%, #a86f08); -webkit-background-clip: text; background-clip: text; color: transparent; }
.xq-title span { display: block; margin-top: 4px; font-size: clamp(10px, 2.4vw, 14px); letter-spacing: 0.14em; text-indent: 0.14em; text-transform: uppercase; color: #b8c8e8; }
.xq-podium { position: absolute; top: 24%; left: 0; right: 0; z-index: 5; display: flex; justify-content: center; align-items: flex-end; gap: clamp(10px, 3.4vw, 26px); pointer-events: auto; perspective: 900px; }
.xq-hero { position: relative; width: clamp(84px, 22vmin, 136px); display: grid; justify-items: center; gap: 0; opacity: 0; animation: xq-hero-in 0.8s var(--t) cubic-bezier(.2,.9,.3,1.2) forwards; }
.xq-hero.c { width: clamp(98px, 26vmin, 160px); }
@keyframes xq-hero-in { from { opacity: 0; transform: translateY(40px) scale(0.9); } to { opacity: 1; transform: none; } }
.xq-flip { position: relative; width: 100%; aspect-ratio: 3 / 4; cursor: pointer; transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(.2,.9,.3,1); }
.xq-hero.flipped .xq-flip { transform: rotateY(180deg); }
.xq-flip > div { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.xq-flip .xq-back { transform: rotateY(180deg); border-radius: 10px; border: 2px solid #ffd23f; background: radial-gradient(circle at 50% 30%, #1a2a50, #05070d); display: grid; align-content: center; justify-items: center; gap: 4px; padding: 8px; text-align: center; }
.xq-back b { font-family: var(--font-display); font-size: clamp(9px, 2vw, 12px); letter-spacing: 0.06em; text-transform: uppercase; color: #fff; }
.xq-back em { font-style: normal; font-family: var(--font-display); font-size: clamp(16px, 4vw, 24px); color: #ffd23f; }
.xq-back span { font-size: clamp(7.5px, 1.7vw, 10px); line-height: 1.3; color: #b8c8e8; letter-spacing: 0.1em; text-transform: uppercase; }
.xq-tiltwrap { width: 100%; transition: transform 0.15s; transform: rotateX(var(--ry, 0deg)) rotateY(var(--rx, 0deg)); transform-style: preserve-3d; }
.xq-step { width: 112%; margin-top: 10px; padding: 6px 0 calc(var(--h) * 1px); border-radius: 6px 6px 0 0; text-align: center; font-family: var(--font-display); font-weight: 800; letter-spacing: 0.2em; font-size: clamp(11px, 2.6vw, 15px); background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)); border: 1px solid var(--pc); border-bottom: 0; color: var(--pc); box-shadow: 0 -6px 20px color-mix(in srgb, var(--pc) 25%, transparent); }
.xq-hero.c .xq-tile { border-color: #ffd23f; box-shadow: 0 0 34px rgba(255, 210, 63, 0.55); }
.xq-hint { position: absolute; bottom: 15%; padding-left: 18%; left: 0; right: 0; z-index: 6; text-align: center; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: #b8c8e8; opacity: 0; animation: jp-sub 0.6s 3.6s forwards; }
.xq-cer .xq-go.btn { position: absolute; bottom: 7%; left: 50%; z-index: 6; transform: translateX(-50%); opacity: 0; pointer-events: auto; animation: xq-go-in 0.6s 3.9s forwards; }
@keyframes xq-go-in { from { opacity: 0; transform: translate(-50%, 12px); } to { opacity: 1; transform: translate(-50%, 0); } }
.xq-chewie { position: absolute; left: 3%; bottom: 16%; z-index: 5; width: clamp(50px, 12vmin, 76px); opacity: 0; animation: jp-sub 0.6s 4.4s forwards; text-align: center; }
.xq-chewie small { display: block; margin-top: 3px; font-size: 9px; line-height: 1.2; color: #b8c8e8; font-style: italic; }
.xq-roar { position: absolute; left: 2%; bottom: calc(16% + clamp(70px, 17vmin, 104px)); z-index: 5; font-family: var(--font-display); font-weight: 800; color: #fff; font-size: clamp(12px, 2.6vw, 16px); opacity: 0; animation: xq-roar 1.4s 5s forwards; }
@keyframes xq-roar { 0% { opacity: 0; transform: scale(0.6); } 20% { opacity: 1; transform: scale(1.2) rotate(-6deg); } 100% { opacity: 1; transform: scale(1) rotate(-6deg); } }
.feat-cine.reveal .xq-doors, .feat-cine.reveal .xq-go, .feat-cine.reveal .xq-hint, .feat-cine.reveal .xq-podium, .feat-cine.reveal .xq-title, .feat-cine.reveal .xq-chewie, .feat-cine.reveal .xq-roar, .feat-cine.reveal .xq-floor2 { display: none; }
.xq-cer .fc-text .fs-kicker { color: #ffd23f; }
.xq-cer .fc-text b { text-shadow: 0 0 22px rgba(255, 210, 63, 0.7); }
.feat-cine.xq-m4 { background: radial-gradient(circle at 50% 42%, #0e2a5a, #030814 70%); }
.feat-cine.xq-m5 { background: radial-gradient(circle at 50% 42%, #4a0a12, #0a0204 70%); }
.feat-cine.xq-sv { background: radial-gradient(circle at 50% 45%, #2a0a0e, #050103 70%); }
.xq-blade { position: absolute; top: 40%; left: calc(6% + 46px); right: 6%; height: 8px; border-radius: 4px; transform-origin: left center; transform: scaleX(0); animation: xq-ignite 0.9s 0.5s cubic-bezier(.2,.9,.3,1) forwards, xq-hum 0.12s 1.4s steps(2) infinite alternate; }
.xq-m4 .xq-blade { background: #eaf6ff; box-shadow: 0 0 12px #4aa8ff, 0 0 34px #4aa8ff, 0 0 70px #4aa8ff; }
.xq-m5 .xq-blade { background: #fff0f0; box-shadow: 0 0 12px #ff2a3a, 0 0 34px #ff2a3a, 0 0 70px #ff2a3a; }
.xq-hilt { position: absolute; top: calc(40% - 5px); left: 6%; width: 46px; height: 18px; border-radius: 4px; background: linear-gradient(180deg, #d8dde3, #6a717b); }
@keyframes xq-ignite { to { transform: scaleX(1); } }
@keyframes xq-hum { to { opacity: 0.86; } }
.xq-sym { position: absolute; top: 14%; left: 50%; width: clamp(80px, 22vmin, 130px); margin-left: calc(clamp(80px, 22vmin, 130px) / -2); opacity: 0; animation: jp-sub 0.8s 1.2s forwards; }
.xq-sym svg { width: 100%; height: auto; }
.xq-m4 .xq-sym { color: #9fd4ff; filter: drop-shadow(0 0 18px #4aa8ff); }
.xq-m5 .xq-sym { color: #ff8a8a; filter: drop-shadow(0 0 18px #ff2a3a); }
.xq-bolt { position: absolute; inset: 0; opacity: 0; pointer-events: none; animation: xq-bolt 2.2s var(--d) steps(1) infinite; }
.xq-bolt svg { width: 100%; height: 100%; }
@keyframes xq-bolt { 0%, 8%, 100% { opacity: 0; } 2%, 6% { opacity: 1; } }
.xq-ekg { position: absolute; top: 34%; left: 0; right: 0; height: 30%; }
.xq-ekg svg { width: 100%; height: 100%; }
.xq-ekg path { stroke-dasharray: 1600; stroke-dashoffset: 1600; animation: xq-draw 3.2s 0.3s linear forwards; }
@keyframes xq-draw { to { stroke-dashoffset: 0; } }
.xq-pulse { position: absolute; inset: 0; background: radial-gradient(circle, transparent 40%, rgba(255, 30, 50, 0.35)); opacity: 0; animation: xq-pulse 0.9s 3.4s ease-out 3; }
@keyframes xq-pulse { 0% { opacity: 0.9; } 100% { opacity: 0; } }
.xq-m4 .fc-text .fs-kicker { color: #9fd4ff; }
.xq-m4 .fc-text b { text-shadow: 0 0 22px #4aa8ff; }
.xq-m5 .fc-text .fs-kicker { color: #ff8a8a; }
.xq-m5 .fc-text b { text-shadow: 0 0 22px #ff2a3a; }
.xq-sv .fc-text .fs-kicker { color: #ff9aa6; }
.xq-sv .fc-text b { text-shadow: 0 0 22px #ff3a4a; }
.xq-tile { position: relative; aspect-ratio: 3 / 4; border-radius: 10px; overflow: hidden; border: 2px solid #c8a060; background: #0a0806; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6); }
.xq-tile.gold { border-color: #ffd23f; box-shadow: 0 0 30px rgba(255, 210, 63, 0.6); }
.xq-tile .portrait { width: 100%; height: 100%; }
.xq-tile b { position: absolute; left: 0; right: 0; bottom: 0; padding: 4px 4px 5px; font-family: var(--font-display); font-size: clamp(8px, 1.8vw, 11px); letter-spacing: 0.06em; text-transform: uppercase; text-align: center; color: #fff; background: linear-gradient(transparent, rgba(0, 0, 0, 0.85)); }
`;
document.head.appendChild(Object.assign(document.createElement('style'), { textContent: css }));

// ---------- cards ----------
const dmg = (mult, hits) => ({ type: 'damage', mult, hits: hits || 1 });
const heal = (pct) => ({ type: 'heal', pct });
const buff = (status, turns) => ({ type: 'status', status, turns, chance: 1 });
const debuff = (status, turns, chance) => ({ type: 'status', status, turns, chance: chance == null ? 1 : chance });
const tm = (amount) => ({ type: 'tm', amount });
const ult = (name, target, effects, desc, quote) => ({ name, cd: 0, target, effects, desc, quote, ultimate: true });
const revive = (pct) => ({ type: 'revive', pct });
const cleanse = () => ({ type: 'cleanse' });
const dispel = () => ({ type: 'dispel' });

const CARDS = [
  {
    id: 'jar_jar', name: 'Jar Jar Binks', kind: 'character', faction: 'light', rarity: 'secret', role: 'support', exclusive: true, accent: '#d9925a', spd: 148,
    traits: ['scoundrel'], home: 'endor', sig: { move: 'whirl', impact: 'stamp', color: '#ffb347' }, anim: 'rally',
    bio: 'A clumsy Gungan exile from Naboo whose accidents somehow keep winning battles.',
    abilities: [
      { name: 'Booma Toss', cd: 0, target: 'enemy', effects: [dmg(0.9), debuff('stun', 1, 0.25)], desc: 'Lob an energy ball at one enemy with a 25% chance to Stun.' },
      { name: 'Bombad Luck', cd: 3, target: 'allAllies', effects: [buff('defUp', 2), tm(25)], desc: 'Somehow it works out: all allies gain Defense Up and 25% Turn Meter.' },
    ],
    ultimate: ult('Meesa Sorry!', 'allEnemies', [dmg(1.3), debuff('stun', 1, 0.6), debuff('offDown', 2)], 'A catastrophic trip that somehow flattens every enemy: heavy damage, 60% Stun chance and Offense Down.', 'Exsqueeze me!'),
  },
  {
    id: 'falcon_kessel', name: 'Millennium Falcon · Kessel Run', kind: 'ship', faction: 'light', rarity: 'secret', role: 'attacker', exclusive: true, shape: 'falcon_kessel', spd: 172,
    traits: ['gunship', 'scoundrel', 'rebel'], home: 'tatooine', sig: { move: 'flyby', prop: 'ship', impact: 'shatter', color: '#7cd0ff', roll: true, n: 3 }, anim: 'strafe',
    bio: 'The Falcon as she was on her legendary run through the Maw: stripped down, overcharged and faster than anything in the galaxy.',
    abilities: [
      { name: 'Overcharged Quads', cd: 0, target: 'enemy', effects: [dmg(1.3, 2)], desc: 'Hit one enemy twice.' },
      { name: 'Maw Shortcut', cd: 3, target: 'allAllies', effects: [heal(0.15), buff('offUp', 2), tm(35)], desc: 'All allies heal 15%, gain Offense Up and 35% Turn Meter.' },
      { name: 'Smuggler\'s Gambit', cd: 3, target: 'enemy', effects: [dmg(2.8), debuff('stun', 1, 0.6)], desc: 'Deal massive damage with a 60% chance to Stun.' },
    ],
    ultimate: ult('Twelve Parsecs', 'allEnemies', [dmg(2.2), debuff('stun', 1, 0.5), { ...tm(50), on: 'allies' }], 'Punch through the Maw: heavy damage to every enemy with a 50% Stun chance; all allies gain 50% Turn Meter.', 'It\'s the ship that made the Kessel Run in less than twelve parsecs.'),
  },
  {
    id: 'holo_gatekeeper', name: 'The Gatekeeper', kind: 'character', faction: 'light', rarity: 'secret', role: 'support', exclusive: true, accent: '#7cd0ff', spd: 152,
    traits: ['jedi', 'leader'], home: 'coruscant', sig: { move: 'shockwave', prop: 'force', impact: 'freeze', color: '#7cd0ff' }, anim: 'shield',
    bio: 'The guardian hologram of an ancient Jedi holocron. It opens the archive only to seekers who prove themselves worthy.',
    abilities: [
      { name: 'Archive Beam', cd: 0, target: 'enemy', effects: [dmg(1.0), dispel()], desc: 'Damage one enemy and strip its buffs.' },
      { name: 'Lore of the Ancients', cd: 3, target: 'allAllies', effects: [heal(0.2), cleanse(), buff('defUp', 2)], desc: 'All allies heal 20%, are cleansed and gain Defense Up.' },
    ],
    ultimate: ult('The Archive Opens', 'allAllies', [revive(0.35), cleanse(), buff('offUp', 2), buff('defUp', 2), tm(30)], 'The holocron unfolds: revive a fallen ally at 35% HP; all allies are cleansed, gain Offense Up, Defense Up and 30% Turn Meter.', 'Knowledge is the truest weapon, seeker.'),
  },
];
for (const c of CARDS) {
  if (D.UNIT_MAP[c.id]) continue;
  D.UNITS.push(c);
  D.UNIT_MAP[c.id] = c;
  if (D.BIOS) D.BIOS[c.id] = c.bio;
  if (D.ULT_ANIM) D.ULT_ANIM[c.id] = c.anim;
}

root.Art.addArt('char', 'jar_jar', () => {
  const SK = '#d9925a';
  return SCENES.endor()
    + shoulders('#7a5a3a', { top: 76 }) + P('M38 78 L50 92 L62 78 L58 76 L50 84 L42 76Z', '#c8b48a')
    + P('M37 36 C25 46 23 68 29 84 C33 86 36 80 36 70 C36 57 39 47 43 40Z', '#c07a45') + P('M63 36 C75 46 77 68 71 84 C67 86 64 80 64 70 C64 57 61 47 57 40Z', '#c07a45')
    + R(45, 62, 10, 14, SK)
    + E(50, 42, 13.5, 15, SK) + shade('M50 27 C42 27 36.5 34 36.5 42 C36.5 51 42 57 50 57Z', 0.1)
    + C(43.5, 29, 5.6, SK) + C(56.5, 29, 5.6, SK) + C(43.5, 28.4, 3.8, '#f4eed8') + C(56.5, 28.4, 3.8, '#f4eed8')
    + C(44.2, 28.8, 1.9, '#d8a020') + C(55.8, 28.8, 1.9, '#d8a020') + C(44.2, 28.8, 1, '#120c06') + C(55.8, 28.8, 1, '#120c06')
    + P('M38.2 27 C40 23.4 47 23.4 48.8 27 C46 25.8 41 25.8 38.2 27Z', '#b06a38') + P('M61.8 27 C60 23.4 53 23.4 51.2 27 C54 25.8 59 25.8 61.8 27Z', '#b06a38')
    + P('M40 47 C40 63 45 70 50 70 C55 70 60 63 60 47 C56 50 44 50 40 47Z', '#e8b07a') + shade('M50 49 L50 70 C55 70 60 63 60 47 C56 50 52 49.6 50 49Z', 0.08)
    + C(47.2, 52.5, 0.9, '#7a3a1a') + C(52.8, 52.5, 0.9, '#7a3a1a')
    // open bill and the long tongue flopping out over the chin
    + P('M42 60.5 Q50 69 58 60.5 Q50 64.5 42 60.5Z', '#3a1408')
    + P('M48.4 63.6 C46.5 70 44.5 76 46.5 82 C47.8 85.5 51.8 85 52.3 81.4 C53 76.6 52.6 70.6 52.2 64Z', '#e8607a', 'stroke="#a8304a" stroke-width=".6"')
    + P('M50.3 65.5 C49.6 71 49.2 76 49.9 81', 'none', 'stroke="#b03a52" stroke-width=".7"')
    + E(49.6, 79.6, 1.4, 0.8, '#ff9aaa', 'opacity=".7"');
});
// The Gatekeeper: a hooded hologram elder inside a holocron's frame.
root.Art.addArt('char', 'holo_gatekeeper', () => {
  const H1 = '#7cd0ff';
  const scan = Array.from({ length: 24 }, (_, i) => L(0, i * 4.2 + 1, 100, i * 4.2 + 1, '#9fe0ff', 0.35, 'opacity=".25"')).join('');
  return R(0, 0, 100, 100, '#030812')
    + C(50, 46, 40, '#0a2a4a', 'opacity=".7"') + C(50, 46, 26, '#1a4a7a', 'opacity=".5"')
    // holocron cube frame behind the figure
    + P('M50 8 L84 26 L84 66 L50 84 L16 66 L16 26Z', 'none', `stroke="${H1}" stroke-width="1" opacity=".55"`) + P('M50 8 L50 48 M16 26 L50 48 L84 26', 'none', `stroke="${H1}" stroke-width=".8" opacity=".4"`)
    // robe and hood
    + P('M24 100 C26 78 36 64 50 62 C64 64 74 78 76 100Z', H1, 'opacity=".5"') + P('M50 62 L44 100 M50 62 L56 100', 'none', 'stroke="#d8f2ff" stroke-width=".8" opacity=".6"')
    + P('M34 50 C33 30 41 21 50 21 C59 21 67 30 66 50 C62 60 38 60 34 50Z', '#4aa8ff', 'opacity=".55"')
    + E(50, 45, 10.5, 12.5, '#bfe8ff', 'opacity=".65"') + P('M40 56 C44 66 56 66 60 56 C56 60 44 60 40 56Z', '#e8f8ff', 'opacity=".7"')
    + P('M43 42 L47.5 42.6 M52.5 42.6 L57 42', 'none', 'stroke="#ffffff" stroke-width="1.4" stroke-linecap="round"')
    + P('M46 50 Q50 52 54 50', 'none', 'stroke="#ffffff" stroke-width=".8" opacity=".8"')
    + P('M34 50 C33 30 41 21 50 21 C59 21 67 30 66 50', 'none', 'stroke="#e8f8ff" stroke-width="1" opacity=".8"')
    // floating holocron in his hands
    + P('M50 72 L58 76.5 L58 85.5 L50 90 L42 85.5 L42 76.5Z', '#bfe8ff', 'opacity=".85"') + P('M50 72 L50 81 M42 76.5 L50 81 L58 76.5', 'none', 'stroke="#2a6aa8" stroke-width=".8"')
    + C(50, 81, 12, H1, 'opacity=".18"') + scan;
});

root.Art.addArt('ship', 'falcon_kessel', () => [[8, 20, 30], [4, 46, 26], [10, 70, 34], [70, 14, 26], [72, 84, 24], [6, 88, 20]].map(([x, y, w]) => L(x, y, x + w, y, '#9fdcff', 1, 'opacity=".55"')).join('')
  + root.Ships3.falcon({ trim: '#ffd23f', engine: '#ffffff' }));

// ---------- feats ----------
const FEATS = {
  dad: { id: 'xq_dad', secret: true, tier: 5, icon: 'sith', name: 'Bad Father\'s Day', desc: 'Pulled Darth Vader and Luke Skywalker from the same crate', have: 1, need: 1 },
  jj: { id: 'xq_jj', secret: true, tier: 5, icon: 'spark', name: 'Meesa Sorry', desc: 'Something went very, very wrong in a crate', have: 1, need: 1 },
  kr: { id: 'xq_kr', secret: true, tier: 6, icon: 'xwing', name: 'Less Than Twelve Parsecs', desc: 'Cleared 12 tower floors in a row in under 12 minutes', have: 1, need: 1 },
};
H.feats.push((s) => {
  const z = s.z || {};
  const out = [
    { id: 'xq_sv', tier: 3, icon: 'bacta', name: 'Survivor', desc: 'Win a battle with a unit on its last 1% of health', have: z.b ? 1 : 0, need: 1 },
    { id: 'xq_m4', tier: 4, icon: 'jedi', name: 'May the 4th Be With You', desc: 'Claim the May the 4th gift', have: z.m4 ? 1 : 0, need: 1 },
    { id: 'xq_m5', tier: 4, icon: 'sith', name: 'Revenge of the Fifth', desc: 'Win a battle on May the 5th', have: z.m5 ? 1 : 0, need: 1 },
  ];
  if (z.f) out.push(FEATS.dad);
  if (z.j) out.push(FEATS.jj);
  if (z.k) out.push(FEATS.kr);
  return out;
});

// ---------- crests ----------
let seq = 0;
const anim = {
  spin: (dur, rev) => (motion() ? `<animateTransform attributeName="transform" type="rotate" from="${rev ? 360 : 0} 0 0" to="${rev ? 0 : 360} 0 0" dur="${dur}s" repeatCount="indefinite"/>` : ''),
  fade: (v, dur, begin = 0) => (motion() ? `<animate attributeName="opacity" values="${v}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>` : ''),
  rock: (deg, dur) => (motion() ? `<animateTransform attributeName="transform" type="rotate" values="${-deg};${deg};${-deg}" dur="${dur}s" repeatCount="indefinite"/>` : ''),
  dash: (len, dur, begin) => (motion() ? `<animate attributeName="stroke-dashoffset" from="${len}" to="0" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>` : ''),
};
const frame = (u, inner, word, opts = {}) => `<svg class="mc" viewBox="-100 -100 200 200" aria-hidden="true">
  <defs>
    <linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c8"/><stop offset=".35" stop-color="#ffd23f"/><stop offset=".7" stop-color="#a86f08"/><stop offset="1" stop-color="#ffe98a"/></linearGradient>
    <radialGradient id="${u}h"><stop offset="0" stop-color="${opts.glow || '#ffd23f'}" stop-opacity=".6"/><stop offset="1" stop-color="${opts.glow || '#ffd23f'}" stop-opacity="0"/></radialGradient>
    <radialGradient id="${u}c"><stop offset="0" stop-color="${opts.core || '#1a2030'}"/><stop offset="1" stop-color="#05070d"/></radialGradient>
    <filter id="${u}f" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="${u}bl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>
    <clipPath id="${u}k"><circle r="70"/></clipPath>
  </defs>
  <circle r="99" fill="url(#${u}h)">${anim.fade('1;.5;1', 2.8)}</circle>
  ${opts.back || ''}
  <circle r="76" fill="url(#${u}c)" stroke="url(#${u}g)" stroke-width="6"/>
  <circle r="69" fill="none" stroke="url(#${u}g)" stroke-width="1.2" opacity=".7"/>
  <g clip-path="url(#${u}k)">${inner}</g>
  <path d="M-50,77 H-72 L-63,86 L-72,95 H-50Z M50,77 H72 L63,86 L72,95 H50Z" fill="${opts.tail || '#7a5200'}" stroke="#2a1a00" stroke-width="1"/>
  <rect x="-58" y="72" width="116" height="20" rx="2" fill="url(#${u}g)" stroke="#2a1a00" stroke-width="1.2"/>
  <text y="86.5" text-anchor="middle" font-size="10.5" font-weight="800" letter-spacing="3" fill="#2a1a00" font-family="inherit">${word}</text>
</svg>`;

const crestDad = () => {
  const u = `xd${++seq}`;
  const saber = (x1, x2, color) => `<line x1="${x1}" y1="58" x2="${x2}" y2="-58" stroke="${color}" stroke-width="11" opacity=".75" filter="url(#${u}bl)"/><line x1="${x1}" y1="58" x2="${x2}" y2="-58" stroke="#fff" stroke-width="4.5">${anim.fade('1;.82;1', 0.15)}</line>`;
  const inner = `<rect x="-80" y="-80" width="80" height="160" fill="#3a0a10"/><rect x="0" y="-80" width="80" height="160" fill="#0a2a14"/>
    <g stroke-linecap="round">${saber(-44, 44, '#ff2a3a')}${saber(44, -44, '#46c46a')}</g>
    <g transform="translate(-30,8)"><path d="M-16,-6 C-16,-22 16,-22 16,-6 L18,14 L8,10 L0,18 L-8,10 L-18,14Z" fill="#0a0a0c" stroke="#ff4a5a" stroke-width="1.2"/><path d="M-9,-2 L-3,-2 L-4,3 L-9,3Z M9,-2 L3,-2 L4,3 L9,3Z" fill="#ff4a5a"/></g>
    <g transform="translate(30,8)"><circle r="14" fill="#e8b896"/><path d="M-14,-4 C-14,-18 14,-18 14,-4 C10,-12 -10,-12 -14,-4Z" fill="#c89a4a"/><circle cx="-5" cy="0" r="1.6" fill="#2a3a6a"/><circle cx="5" cy="0" r="1.6" fill="#2a3a6a"/><ellipse cx="0" cy="8" rx="4" ry="5" fill="#3a1010"/></g>`;
  return frame(u, inner, 'NOOOOO!', { glow: '#ff6a6a', tail: '#5a0a10' });
};
const crestJJ = () => {
  const u = `xj${++seq}`;
  const stars = [0, 72, 144, 216, 288].map((a) => `<g transform="rotate(${a}) translate(0,-46)"><path d="M0,-6 L1.6,-1.6 L6,0 L1.6,1.6 L0,6 L-1.6,1.6 L-6,0 L-1.6,-1.6Z" fill="#ffd23f" filter="url(#${u}f)"/></g>`).join('');
  const head = `<g>${anim.rock(10, 2.2)}
    <path d="M-12,-8 C-26,0 -28,24 -22,38 C-18,40 -16,34 -16,26 C-16,14 -12,4 -8,-2Z" fill="#c07a45"/><path d="M12,-8 C26,0 28,24 22,38 C18,40 16,34 16,26 C16,14 12,4 8,-2Z" fill="#c07a45"/>
    <ellipse cx="0" cy="-2" rx="14" ry="16" fill="#d9925a"/>
    <circle cx="-7" cy="-16" r="6" fill="#d9925a"/><circle cx="7" cy="-16" r="6" fill="#d9925a"/><circle cx="-7" cy="-16.6" r="4" fill="#f4eed8"/><circle cx="7" cy="-16.6" r="4" fill="#f4eed8"/>
    <circle cx="-5.8" cy="-15" r="1.5" fill="#120c06"/><circle cx="8.2" cy="-18" r="1.5" fill="#120c06"/>
    <path d="M-10,4 C-10,20 -5,26 0,26 C5,26 10,20 10,4 C6,7 -6,7 -10,4Z" fill="#e8b07a"/><path d="M-6,18 Q0,23 6,18 Q0,21 -6,18Z" fill="#5a2210"/><path d="M2,20 C3,24 6,24 6,21Z" fill="#e86a7a"/></g>`;
  return frame(u, `<g>${anim.spin(4)}${stars}</g>${head}`, 'MEESA SORRY', { glow: '#ffb347', core: '#2a1a08', tail: '#7a3a00' });
};
const crestKR = () => {
  const u = `xk${++seq}`;
  const streaks = Array.from({ length: 18 }, (_, k) => { const a = (k / 18) * Math.PI * 2; return `<line stroke-dasharray="12 70" x1="${(Math.cos(a) * 16).toFixed(1)}" y1="${(Math.sin(a) * 16).toFixed(1)}" x2="${(Math.cos(a) * 72).toFixed(1)}" y2="${(Math.sin(a) * 72).toFixed(1)}" stroke="#bfe8ff" stroke-width="1.6" stroke-linecap="round" opacity=".8">${anim.dash(82, 0.7, -k * 0.04)}</line>`; }).join('');
  // twelve parsec markers that light up one after another
  const ticks = Array.from({ length: 12 }, (_, k) => { const a = ((k * 30 - 90) * Math.PI) / 180; return `<circle cx="${(Math.cos(a) * 62).toFixed(1)}" cy="${(Math.sin(a) * 62).toFixed(1)}" r="2.6" fill="#ffd23f" filter="url(#${u}f)" opacity=".25">${motion() ? `<animate attributeName="opacity" values=".25;1;1;.25" keyTimes="0;.08;.9;1" dur="3.6s" begin="${(k * 0.25).toFixed(2)}s" repeatCount="indefinite"/>` : ''}</circle>`; }).join('');
  const bank = motion() ? '<animateTransform attributeName="transform" type="rotate" values="-6;6;-6" dur="3s" repeatCount="indefinite" additive="sum"/>' : '';
  const ship = `<g><g transform="translate(0,2)">${bank}<g transform="scale(.9) translate(-50,-56)">${SHIPS.falcon()}</g></g></g>`;
  const engines = `<path d="M-30,24 A31,31 0 0 0 30,24" stroke="#ffffff" stroke-width="3" fill="none" filter="url(#${u}f)">${anim.fade('1;.45;1', 0.6)}</path>`;
  const back = `<g fill="#7cd0ff" opacity=".28">${anim.spin(30)}${Array.from({ length: 20 }, (_, k) => `<polygon points="0,${k % 2 ? -86 : -100} 4,0 -4,0" transform="rotate(${k * 18})"/>`).join('')}</g>
    <circle r="84" fill="none" stroke="#7cd0ff" stroke-width="1.5" stroke-dasharray="2 8" opacity=".8">${anim.spin(12, true)}</circle>`;
  return frame(u, `${streaks}${ticks}${engines}${ship}`, 'KESSEL RUN', { glow: '#7cd0ff', core: '#0a1a30', tail: '#123a6a', back });
};
const glyph = (name, size, color) => {
  const inner = root.Icons.svg(name).replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  return `<g transform="translate(${-size / 2},${-size / 2}) scale(${size / 24})" fill="${color}" color="${color}">${inner}</g>`;
};
const crestSide = (side) => {
  const jedi = side === 'jedi';
  const u = `xs${++seq}`;
  const c = jedi ? '#4aa8ff' : '#ff2a3a';
  const blade = `<line x1="-62" y1="40" x2="62" y2="-40" stroke="${c}" stroke-width="10" opacity=".7" filter="url(#${u}bl)"/><line x1="-62" y1="40" x2="62" y2="-40" stroke="#fff" stroke-width="4">${anim.fade('1;.8;1', 0.14)}</line>`;
  const stars = Array.from({ length: 8 }, (_, k) => `<g transform="rotate(${k * 45}) translate(0,-54)"><circle r="2.2" fill="#fff" filter="url(#${u}f)">${anim.fade('1;.2;1', 1.6, -k * 0.2)}</circle></g>`).join('');
  const bolts = jedi ? '' : [[-60, -30, -20, -10, -36, 10, 4, 30], [60, -36, 22, -14, 40, 6, -2, 34]].map((pts, k) => `<polyline points="${pts.join(',').replace(/(-?\d+),(-?\d+),?/g, '$1,$2 ')}" fill="none" stroke="#ffb0b8" stroke-width="2.2" filter="url(#${u}f)" opacity="0">${anim.fade('0;1;0;0;0', 1.2, -k * 0.5)}</polyline>`).join('');
  const inner = `<g>${anim.spin(jedi ? 18 : 10, !jedi)}${stars}</g>${bolts}${blade}<g filter="url(#${u}f)">${glyph(jedi ? 'jedi' : 'sith', 64, jedi ? '#dff0ff' : '#ffd6da')}</g>`;
  return frame(u, inner, jedi ? 'MAY THE 4TH' : 'REVENGE', { glow: c, core: jedi ? '#0a1a3a' : '#2a0508', tail: jedi ? '#123a6a' : '#5a0a10',
    back: `<g fill="${c}" opacity=".3">${anim.spin(26)}${Array.from({ length: 20 }, (_, k) => `<polygon points="0,${k % 2 ? -86 : -100} 4,0 -4,0" transform="rotate(${k * 18})"/>`).join('')}</g>` });
};
const crestSV = () => {
  const u = `xv${++seq}`;
  const ekg = 'M-70,6 L-38,6 L-30,-4 L-24,6 L-14,6 L-8,-46 L0,40 L8,-14 L14,6 L30,6 L36,-2 L42,6 L70,6';
  const inner = `<path d="${ekg}" fill="none" stroke="#3a0a10" stroke-width="5"/>
    <path d="${ekg}" fill="none" stroke="#ff4a5a" stroke-width="3" stroke-linejoin="round" stroke-dasharray="70 300" filter="url(#${u}f)">${anim.dash(370, 1.8, 0)}</path>
    <g transform="translate(0,-36) scale(.9)">${glyph('bacta', 26, '#ff9aa6')}</g>`;
  return frame(u, inner, 'SURVIVOR', { glow: '#ff3a4a', core: '#1a0508', tail: '#5a0a10' });
};
Object.assign(H.crests, { xq_dad: crestDad, xq_jj: crestJJ, xq_kr: crestKR, xq_sv: crestSV, xq_sv_show: crestSV, xq_m4: () => crestSide('jedi'), xq_m5: () => crestSide('sith') });

// Portrait tile with a name plate (works whether or not the card is owned).
const tile = (def, cls = '') => `<div class="xq-tile ${cls}">${UI.portrait(def, { plate: false })}<b>${esc(def.name)}</b></div>`;

// ---------- scene runner ----------
function scene(x, cls, stage, ms, onDone, sounds, kicker, setup) {
  const node = el(`<div class="feat-cine ${cls}" role="dialog" aria-label="${esc(x.name)}">
    <div class="xq-stage">${stage}</div>
    <i class="fc-flash"></i>
    ${UI.featBadge(x, 'fc-badge')}
    ${Array.from({ length: 70 }, (_, k) => `<i class="fs-spark" style="--a:${(k * 137.5) % 360}deg;--d:${(k % 9) * 0.05}s;--r:${22 + (k % 6) * 7}vmin;--c:${k % 2 ? '#ffd23f' : '#ffffff'}"></i>`).join('')}
    <div class="fs-text fc-text"><span class="fs-kicker">${esc(kicker || 'Secret achievement')}</span><b>${esc(x.name)}</b><span>${esc(x.desc)}</span></div>
    <span class="pc-skip">Tap to skip</span>
  </div>`);
  document.body.appendChild(node);
  const S = root.Sound;
  const timers = [];
  const at = (t, fn) => timers.push(setTimeout(() => node.isConnected && fn(), t));
  if (S && sounds) sounds(S, at);
  node.classList.add('play');
  const manual = ms == null;
  return new Promise((resolve) => {
    let done = false;
    const reveal = (skip) => {
      if (node.classList.contains('reveal')) return;
      node.classList.add('reveal'); if (skip) node.classList.add('skip');
      node.querySelector('.pc-skip').textContent = 'Tap to close';
      if (S) { S.play('burst'); S.play('reveal_mythic'); }
    };
    if (setup) setup(node, () => reveal(false));
    node.addEventListener('click', (e) => {
      if (!node.classList.contains('reveal')) { if (manual) return; return reveal(true); }
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      node.classList.add('out');
      setTimeout(() => { node.remove(); Promise.resolve(onDone && onDone()).then(resolve); }, 450);
    });
    if (!manual) at(ms, () => reveal(false));
  });
}

const sceneDad = (x) => {
  const v = D.UNIT_MAP.vader; const l = D.UNIT_MAP.luke;
  const stage = `<div class="xq-fog"></div><div class="xq-flick"></div><div class="xq-bars"></div>
    <div class="xq-pair"><div class="xq-who v">${UI.portrait(v, { plate: false })}</div><div class="xq-who l">${UI.portrait(l, { plate: false })}</div></div><i class="xq-clash"></i>
    <p class="xq-line" style="top:52%;--t:1.2s;color:#ff8a8a">"Luke… I am your father."</p><div class="xq-no">NOOOOO!</div>`;
  return scene(x, 'xq-dad', stage, 5800, null, (S, at) => { S.play('ignite'); at(900, () => S.play('saber')); at(1200, () => S.play('ult')); at(2400, () => S.play('crit')); at(3300, () => S.play('glitch')); });
};
const sceneJJ = (x) => {
  const def = D.UNIT_MAP.jar_jar;
  const own = Player.unit('jar_jar') || { level: 1, stars: 1 };
  const st = D.unitStats(def, own.level, own.stars);
  const chips = [['HP', st.hp], ['ATK', st.atk], ['DEF', st.def], ['SPD', st.spd || def.spd]].map(([k, v], i) => `<span style="--t:${3.6 + i * 0.25}s"><em>${k}</em><b>${UI.fmt(v)}</b></span>`).join('');
  const stage = `<div class="xq-rays"></div><div class="xq-ban">LEGENDARY</div>
    <span class="xq-tag">SECRET</span><div class="xq-jjcard">${tile(def, 'gold')}</div><div class="xq-bubble">Meesa sorry!</div>
    <div class="xq-stats">${chips}</div>`;
  return scene(x, 'xq-jj', stage, 6600, null, (S, at) => { S.play('reveal_legendary'); at(1000, () => S.play('whoosh')); at(1900, () => S.play('crack')); at(2300, () => S.play('hit')); at(3100, () => S.play('ko')); [0, 1, 2, 3].forEach((i) => at(3600 + i * 250, () => S.play('click'))); });
};
const sceneKR = (x, mins) => {
  const stage = `<div class="xq-warp">${Array.from({ length: 50 }, (_, k) => `<i style="--a:${(k * 137.5) % 360}deg;--d:${((k * 13) % 20) * -0.04}s"></i>`).join('')}</div>
    <div class="xq-time">${mins ? mins.toFixed(1) : '11.9'}<small style="font-size:.35em"> min</small></div>
    <p class="xq-line" style="top:66%;--t:1.6s">"It's the ship that made the Kessel Run…"</p><p class="xq-line" style="top:72%;--t:2.8s;color:#ffd23f">"…in less than twelve parsecs."</p>`;
  return scene(x, 'xq-kr', stage, 5200, null, (S, at) => { S.play('whoosh'); at(600, () => S.play('ult')); });
};
const top3 = () => Object.keys(Player.state.units).filter((id) => D.UNIT_MAP[id] && id !== 'chewbacca')
  .map((id) => ({ id, p: D.power(D.UNIT_MAP[id], Player.state.units[id].level, Player.state.units[id].stars) }))
  .sort((a, b) => b.p - a.p).slice(0, 3);
const sceneCer = (x) => {
  const best = top3();
  const PLACE = [['1ST', '#ffd23f', 46], ['2ND', '#dfe6ee', 26], ['3RD', '#d08a4a', 12]];
  const slots = best.length === 3 ? [1, 0, 2] : best.map((_, i) => i);
  const heroes = slots.map((rank, k) => {
    const b = best[rank]; if (!b) return '';
    const def = D.UNIT_MAP[b.id]; const u = Player.state.units[b.id];
    const [label, pc, h] = PLACE[rank];
    return `<div class="xq-hero ${rank === 0 ? 'c' : ''}" style="--t:${2 + k * 0.3}s" data-hero>
      <div class="xq-tiltwrap"><div class="xq-flip"><div>${tile(def)}</div><div class="xq-back"><span>${label} place</span><b>${esc(def.name)}</b><em>${UI.fmt(b.p)}</em><span>Power</span><span>Lv ${u.level} · ${u.stars}★</span></div></div></div>
      <div class="xq-step" style="--pc:${pc};--h:${h}">${label}</div></div>`;
  }).join('');
  const shafts = [[18, 14], [40, -6], [62, 8], [82, -14]].map(([l, r]) => `<i style="left:${l}%;--r:${r}deg"></i>`).join('');
  const dust = Array.from({ length: 40 }, (_, k) => `<i style="left:${(k * 37) % 100}%;--s:${6 + (k % 5)}s;--d:${-(k % 9) * 0.8}s;--x:${(k % 2 ? 1 : -1) * (10 + (k % 4) * 8)}px"></i>`).join('');
  const emblem = root.Icons.svg('starbird');
  const stage = `<div class="xq-window"></div><div class="xq-emblem">${emblem}</div>
    <span class="xq-pillar" style="left:22%"></span><span class="xq-pillar" style="right:22%"></span>
    <span class="xq-banner" style="left:4%"><i>${emblem}</i></span><span class="xq-banner" style="right:4%;animation-delay:-2.5s"><i>${emblem}</i></span>
    <div class="xq-shafts">${shafts}</div><div class="xq-dust">${dust}</div><div class="xq-floor2"><div class="xq-grid"></div></div>
    <div class="xq-title"><b>HEROES OF THE GALAXY</b><span>For valor in the liberation of every world</span></div>
    <div class="xq-podium">${heroes}</div>
    <p class="xq-hint">Tap a hero to see their record</p>
    <button class="btn btn-primary xq-go" type="button" data-xq-go>Continue</button>
    <div class="xq-chewie">${tile(D.UNIT_MAP.chewbacca)}<small>(no medal, as is tradition)</small></div><div class="xq-roar">RRAARGH!</div>
    <div class="xq-doors"><i></i><i></i></div>`;
  const hx = { ...x, name: 'Heroes of the Rebellion', desc: 'Every world liberated. The galaxy salutes you.' };
  const setup = (node, go) => {
    node.querySelector('.xq-stage').style.pointerEvents = 'auto';
    node.querySelectorAll('[data-hero]').forEach((h) => h.addEventListener('click', (e) => { e.stopPropagation(); h.classList.toggle('flipped'); if (root.Sound) root.Sound.play('whoosh'); }));
    node.querySelector('[data-xq-go]').addEventListener('click', (e) => { e.stopPropagation(); go(); });
    // Cards lean toward the pointer or finger.
    node.addEventListener('pointermove', (e) => {
      const rx = ((e.clientX / innerWidth) - 0.5) * 18; const ry = ((e.clientY / innerHeight) - 0.5) * -14;
      node.querySelectorAll('.xq-tiltwrap').forEach((w) => { w.style.setProperty('--rx', `${rx}deg`); w.style.setProperty('--ry', `${ry}deg`); });
    });
  };
  return scene(hx, 'xq-cer', stage, null, null, (S, at) => { S.play('whoosh'); at(500, () => S.play('ignite')); at(1800, () => S.play('victory')); at(2100, () => S.play('coins')); at(5000, () => S.play('crit')); }, 'Hero of the Galaxy', setup);
};
const sceneSide = (x, side) => {
  const jedi = side === 'jedi';
  const bolts = jedi ? '' : [0, 0.7, 1.4].map((d, k) => `<div class="xq-bolt" style="--d:${d}s"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${k % 2 ? '100,10 70,26 78,34 50,48 58,56 30,70' : '0,8 26,24 18,32 46,44 38,52 66,66'}" fill="none" stroke="#ffd6da" stroke-width=".8"/></svg></div>`).join('');
  const stage = `${bolts}<div class="xq-sym">${root.Icons.svg(jedi ? 'jedi' : 'sith')}</div><i class="xq-hilt"></i><i class="xq-blade"></i>
    <p class="xq-line" style="top:52%;--t:1.6s">${jedi ? 'May the 4th be with you…' : 'Revenge of the Fifth.'}</p>
    <p class="xq-line" style="top:59%;--t:2.8s;color:${jedi ? '#9fd4ff' : '#ff8a8a'}">${jedi ? '…always.' : 'The Sith will have their revenge.'}</p>`;
  return scene(x, jedi ? 'xq-m4' : 'xq-m5', stage, 4600, null, (S, at) => { S.play('ignite'); at(500, () => S.play('saber')); if (!jedi) { at(700, () => S.play('lightning')); at(2100, () => S.play('lightning')); } else at(1600, () => S.play('heal')); }, 'Legendary achievement');
};
const sceneSV = (x) => {
  const stage = `<div class="xq-pulse"></div><div class="xq-ekg"><svg viewBox="0 0 400 100" preserveAspectRatio="none"><path d="M0,50 L120,50 L130,40 L138,50 L250,50 L262,50 L268,10 L276,92 L284,36 L292,50 L400,50" fill="none" stroke="#ff4a5a" stroke-width="2.4" stroke-linejoin="round" style="filter:drop-shadow(0 0 6px #ff3a4a)"/></svg></div>
    <p class="xq-line" style="top:68%;--t:2.2s;color:#ff9aa6">Flatlined…</p><p class="xq-line" style="top:75%;--t:3.4s">…still standing.</p>`;
  return scene(x, 'xq-sv', stage, 4800, null, (S, at) => { [0, 700].forEach((t) => at(t, () => S.play('click'))); at(1500, () => S.play('hit')); at(3300, () => S.play('heal')); at(3500, () => S.play('crit')); }, 'Achievement');
};

Object.assign(H.scenes, {
  xq_sv: (x) => sceneSV(x),
  xq_sv_show: (x) => sceneSV(x),
  xq_m4: (x) => sceneSide(x, 'jedi'),
  xq_m5: (x) => sceneSide(x, 'sith'),
  xq_dad: (x) => sceneDad(x),
  xq_jj: (x) => sceneJJ(x),
  xq_kr: (x) => sceneKR(x, Z().km),
  hero: (x) => sceneCer(x),
});

// ---------- queue: run moments once the screen is free ----------
const queue = [];
let running = false;
const busy = () => UI.App.battleActive || document.querySelector('.result-modal, .feat-show, .feat-cine, .walkout, .tut-intro, .tut-victory, .tut-welcome, .modal-backdrop');
function pump() {
  if (running || !queue.length) return;
  if (busy()) { setTimeout(pump, 500); return; }
  running = true;
  const job = queue.shift();
  Promise.resolve(job()).catch(() => {}).then(() => { running = false; setTimeout(pump, 400); });
}
const later = (job) => { queue.push(job); setTimeout(pump, 600); };

const allWorlds = () => D.PLANETS.every((p) => Player.planetComplete(p.id));
const ceremonyCheck = () => {
  if (!allWorlds() || Z().c || Player.tutorialPending()) return;
  Z().c = 1; Player.save();
  later(() => sceneCer({ id: 'hero', tier: 4, icon: 'starbird', name: 'Hero of the Galaxy', desc: 'Liberate every world', have: 1, need: 1 }));
};

// ---------- crates: the father moment and the 1-in-3000 trip ----------
let pair = null;
const openPack = Player.openPack.bind(Player);
Player.openPack = function (id, rng, opts) {
  const out = openPack(id, rng, opts);
  if (!out) return out;
  const ids = out.map((r) => r.id);
  pair = ids.includes('vader') && ids.includes('luke') && !Z().f ? { seen: 0 } : null;
  const random = rng || Math.random;
  if (Player.__nx || random() < 1 / 3000) {
    Player.__nx = false;
    const r = Player.grantCard('jar_jar', false);
    r.jj = true;
    out.push(r);
    Player.save();
  }
  return out;
};
H.reveal = (r, def) => {
  if (r.jj) {
    Z().j = 1; Player.save(); UI.markFeatSeen('xq_jj');
    return sceneJJ(FEATS.jj);
  }
  if (pair && (r.id === 'vader' || r.id === 'luke')) {
    pair.seen += 1;
    if (pair.seen === 2) {
      pair = null;
      Z().f = 1; Player.save(); UI.markFeatSeen('xq_dad');
      return sceneDad(FEATS.dad);
    }
  }
  return null;
};

// ---------- battles: tower streak, survivor, ceremony ----------
const start = root.BattleUI.start.bind(root.BattleUI);
root.BattleUI.start = function (params) {
  if (params && params.type === 'tower') { Z().ts = Date.now(); }
  return start(params);
};
H.battleEnd.push((battle, params, won) => {
  if (!params || params.type === 'tutorial' || params.type === 'preview') return;
  const z = Z();
  if (params.type === 'tower') {
    if (won) {
      z.kt.push(z.ts || Date.now());
      z.kt = z.kt.slice(-12);
      const span = Date.now() - z.kt[0];
      if (!z.k && z.kt.length >= 12 && span < 12 * 60000) {
        z.k = 1; z.km = span / 60000;
        const g = Player.grantCard('falcon_kessel', false);
        UI.markFeatSeen('xq_kr');
        later(() => sceneKR(FEATS.kr, z.km).then(() => UI.walkout(D.UNIT_MAP.falcon_kessel, 'secret', false, { exclusive: true, isNew: g.isNew, shards: g.shards })));
      }
    } else z.kt = [];
  }
  if (won && !z.b && battle.side('player').some((u) => u.alive && u.hp <= Math.max(1, Math.floor(u.maxHp * 0.01)))) {
    z.b = 1;
    UI.markFeatSeen('xq_sv');
    later(() => sceneSV({ id: 'xq_sv_show', tier: 3, icon: 'bacta', name: 'Survivor', desc: 'Won on the last 1% of health. A free Sith Holocron is yours.', have: 1, need: 1 }).then(() => {
      const results = Player.openPack('strongbox', null, { free: true });
      UI.updateWallet();
      if (results) return UI.packReveal(results, 'strongbox');
      return null;
    }));
  }
  const ev = root.Events && root.Events.active();
  if (won && ev && ev.id === 'may5' && !z.m5) {
    z.m5 = 1;
    UI.markFeatSeen('xq_m5');
    later(() => sceneSide({ id: 'xq_m5', tier: 4, icon: 'sith', name: 'Revenge of the Fifth', desc: 'Won a battle on May the 5th', have: 1, need: 1 }, 'sith'));
  }
  Player.save();
  if (won) setTimeout(ceremonyCheck, 50);
});

// Claiming the May the 4th gift earns its badge.
if (root.Events) {
  const claim = root.Events.claimGift.bind(root.Events);
  root.Events.claimGift = function () {
    const e = this.active();
    const first = e && e.id === 'may4' && !Z().m4;
    claim();
    if (first) {
      Z().m4 = 1; Player.save(); UI.markFeatSeen('xq_m4');
      later(() => sceneSide({ id: 'xq_m4', tier: 4, icon: 'jedi', name: 'May the 4th Be With You', desc: 'Claimed the May the 4th gift', have: 1, need: 1 }, 'jedi'));
    }
  };
}

// Saves that already liberated everything get their ceremony once.
setTimeout(ceremonyCheck, 2500);

// ---------- the holocron puzzle ----------
// Ten fragments hide around the game; each shows one letter and its place.
// The word goes into Settings > Enter a code.
const WORD = 'GATEKEEPER';
const SPOTS = [
  { at: () => document.querySelector('#screen .hub .home-galaxy'), pos: 'left:10px;bottom:56px' },
  { at: () => UI.App.current === 'collection' && document.querySelector('#screen .view-head'), pos: 'right:4px;top:4px' },
  { at: () => document.querySelector('.daily-panel'), pos: 'right:10px;bottom:8px' },
  { at: () => document.querySelector('#screen .squad-layout'), pos: 'left:4px;top:4px' },
  { at: () => document.querySelector('.profile-modal'), pos: 'right:14px;bottom:14px' },
  { at: () => document.querySelector('.settings-modal'), pos: 'left:14px;bottom:14px' },
  { at: () => document.querySelector('.inspect-modal'), pos: 'left:10px;top:10px' },
  { at: () => document.querySelector('.result-modal'), pos: 'right:12px;top:12px' },
  { at: () => document.querySelector('.tower-panel'), pos: 'right:10px;bottom:10px' },
  { at: () => { const n = document.querySelector('.reveal-summary'); return n && !n.hidden && n; }, pos: 'right:0;bottom:-18px' },
];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const found = () => { const z = Z(); z.hf = z.hf || []; return z.hf; };
document.head.appendChild(Object.assign(document.createElement('style'), { textContent: `
.xq-frag { position: absolute; z-index: 30; width: 16px; height: 16px; padding: 0; border: 0; background: none; cursor: pointer; opacity: .32; animation: xq-frag 3.4s ease-in-out infinite; }
.xq-frag svg { width: 100%; height: 100%; display: block; }
@keyframes xq-frag { 50% { opacity: .75; filter: drop-shadow(0 0 4px #7cd0ff); } }
.xq-fpop { position: fixed; inset: 0; z-index: 280; display: grid; place-items: center; align-content: center; gap: 8px; background: radial-gradient(circle at 50% 45%, #0a2040, #02040a 70%); text-align: center; animation: fade-in .3s; cursor: pointer; }
.xq-fpop.out { opacity: 0; transition: opacity .3s; }
.xq-fpop .xq-cube { width: 90px; height: 90px; animation: xq-unfold .9s cubic-bezier(.2,.9,.3,1.3) both; filter: drop-shadow(0 0 20px #4aa8ff); }
@keyframes xq-unfold { from { transform: scale(.2) rotate(-90deg); opacity: 0; } to { transform: none; opacity: 1; } }
.xq-fpop b { font-family: var(--font-display); font-size: clamp(60px, 20vmin, 120px); color: #e8f8ff; text-shadow: 0 0 30px #4aa8ff; line-height: 1; animation: jp-sub .6s .5s both; }
.xq-fpop span { letter-spacing: .3em; text-transform: uppercase; font-size: 12px; color: #9fd4ff; animation: jp-sub .6s .8s both; }
.xq-fpop em { font-style: normal; font-size: 12px; color: #6a8ab0; animation: jp-sub .6s 1.1s both; }
.feat-cine.xq-hp { background: radial-gradient(circle at 50% 42%, #0a2448, #02040a 72%); }
.xq-word { position: absolute; top: 18%; left: 0; right: 0; display: flex; justify-content: center; gap: clamp(2px, 1vw, 8px); }
.xq-word i { font-style: normal; font-family: var(--font-display); font-weight: 800; font-size: clamp(20px, 6vw, 40px); color: #e8f8ff; text-shadow: 0 0 18px #4aa8ff; opacity: 0; animation: xq-fly .7s calc(.4s + var(--k) * .14s) cubic-bezier(.2,.9,.3,1.2) forwards; }
@keyframes xq-fly { from { opacity: 0; transform: translate(var(--x), var(--y)) scale(2) rotate(var(--r)); } to { opacity: 1; transform: none; } }
.xq-holo { position: absolute; top: 34%; left: 50%; width: clamp(110px, 30vmin, 170px); margin-left: calc(clamp(110px, 30vmin, 170px) / -2); opacity: 0; animation: xq-holo 1s 2.3s ease forwards; }
@keyframes xq-holo { 0% { opacity: 0; transform: scaleY(.02); filter: brightness(3); } 40% { opacity: 1; transform: scaleY(1.05); } 100% { opacity: 1; transform: none; filter: none; } }
.xq-holo .xq-tile { border-color: #7cd0ff; box-shadow: 0 0 34px rgba(124, 208, 255, .6); }
.xq-beam { position: absolute; top: 34%; left: 50%; width: 46%; height: 50%; margin-left: -23%; background: linear-gradient(0deg, rgba(124, 208, 255, .35), transparent); clip-path: polygon(40% 100%, 60% 100%, 100% 0, 0 0); opacity: 0; animation: jp-sub .6s 2.1s forwards; }
.xq-hp .fc-text .fs-kicker { background: linear-gradient(90deg, #7cd0ff, #fff, #7cd0ff); -webkit-background-clip: text; background-clip: text; color: transparent; }
.xq-hp .fc-text b { text-shadow: 0 0 22px #4aa8ff; }
` }));
const cubeShapes = (glow = '#7cd0ff') => `<path d="M20 3 L35 11.5 L35 28.5 L20 37 L5 28.5 L5 11.5Z" fill="#0a2a4a" stroke="${glow}" stroke-width="1.6"/><path d="M20 3 L20 20 M5 11.5 L20 20 L35 11.5 M20 20 L20 37" stroke="${glow}" stroke-width="1" opacity=".7"/><circle cx="20" cy="20" r="3.4" fill="#e8f8ff"/>`;
const cubeSvg = (glow) => `<svg viewBox="0 0 40 40" aria-hidden="true">${cubeShapes(glow)}</svg>`;

function collectFrag(i) {
  const f = found();
  if (f.includes(i)) return;
  f.push(i); Player.save();
  if (root.Sound) { root.Sound.play('glitch'); setTimeout(() => root.Sound.play('reveal_rare'), 300); }
  const pop = el(`<div class="xq-fpop" role="dialog"><div class="xq-cube">${cubeSvg()}</div><b>${WORD[i]}</b><span>Holocron fragment · ${ROMAN[i]}</span><em>${f.length} of ${WORD.length} found</em></div>`);
  document.body.appendChild(pop);
  const close = () => { if (!pop.isConnected || pop.classList.contains('out')) return; pop.classList.add('out'); setTimeout(() => pop.remove(), 300); };
  pop.addEventListener('click', close);
  setTimeout(close, 4500);
}
function placeFrags() {
  const f = found();
  SPOTS.forEach((sp, i) => {
    if (f.includes(i)) return;
    const host = sp.at();
    if (!host || host.querySelector(`.xq-frag[data-f="${i}"]`)) return;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    const b = el(`<button class="xq-frag" type="button" data-f="${i}" aria-label="?" style="${sp.pos}">${cubeSvg()}</button>`);
    b.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); b.remove(); collectFrag(i); });
    host.appendChild(b);
  });
}
let fragTick = null;
new MutationObserver(() => { clearTimeout(fragTick); fragTick = setTimeout(placeFrags, 250); }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });

FEATS.hp = { id: 'xq_hp', secret: true, tier: 6, icon: 'holocron', name: 'Holocron Puzzler', desc: 'Found the hidden fragments and opened the Gatekeeper\'s holocron', have: 1, need: 1 };
H.feats.push((s) => ((s.z || {}).hp ? [FEATS.hp] : []));

const crestHP = () => {
  const u = `xh${++seq}`;
  const letters = WORD.split('').map((ch, k) => `<g transform="rotate(${k * 36}) translate(0,-58)"><text text-anchor="middle" y="4" font-size="11" font-weight="800" fill="#e8f8ff" font-family="inherit" filter="url(#${u}f)">${ch}</text></g>`).join('');
  const cube = `<g transform="scale(2.1) translate(-20,-20)" filter="url(#${u}f)">${cubeShapes('#bfe8ff')}</g>`;
  const inner = `<g>${anim.spin(20, true)}${letters}</g><circle r="22" fill="#7cd0ff" opacity=".15">${anim.fade('1;.3;1', 2)}</circle>${cube}
    <g stroke="#9fe0ff" stroke-width="1" opacity=".5">${Array.from({ length: 6 }, (_, k) => `<line x1="0" y1="0" x2="0" y2="-70" transform="rotate(${k * 60})">${anim.fade('.1;.8;.1', 2.4, -k * 0.4)}</line>`).join('')}</g>`;
  return frame(u, inner, 'HOLOCRON', { glow: '#7cd0ff', core: '#0a1a30', tail: '#123a6a',
    back: `<g fill="#7cd0ff" opacity=".3">${anim.spin(30)}${Array.from({ length: 20 }, (_, k) => `<polygon points="0,${k % 2 ? -86 : -100} 4,0 -4,0" transform="rotate(${k * 18})"/>`).join('')}</g>` });
};
H.crests.xq_hp = crestHP;

const sceneHP = (x, onDone) => {
  const word = WORD.split('').map((ch, k) => `<i style="--k:${k};--x:${(k % 2 ? 1 : -1) * (40 + k * 12)}vw;--y:${(k % 3 - 1) * 30}vh;--r:${(k % 2 ? 1 : -1) * 180}deg">${ch}</i>`).join('');
  const stage = `<div class="xq-word">${word}</div><div class="xq-beam"></div><div class="xq-holo">${tile(D.UNIT_MAP.holo_gatekeeper)}</div>
    <p class="xq-line" style="top:72%;--t:3.2s;color:#9fd4ff">"Seeker… you have found every piece."</p><p class="xq-line" style="top:78%;--t:4.4s">"The archive is yours."</p>`;
  return scene(x, 'xq-hp', stage, 6400, onDone, (S, at) => { for (let k = 0; k < 10; k++) at(400 + k * 140, () => S.play('click')); at(2100, () => S.play('ult')); at(2300, () => S.play('heal')); });
};
H.scenes.xq_hp = (x) => sceneHP(x);

H.redeem = (code) => {
  if (code !== WORD) return false;
  const z = Z();
  if (z.hp) { UI.toast('The holocron is already open.'); return true; }
  z.hp = 1;
  const g = Player.grantCard('holo_gatekeeper', false);
  Player.save();
  UI.markFeatSeen('xq_hp');
  later(() => sceneHP(FEATS.hp).then(() => {
    const results = Player.openPack('holocron', null, { free: true });
    UI.updateWallet();
    return results ? UI.packReveal(results, 'holocron') : null;
  }).then(() => new Promise((res) => { const wait = () => (document.querySelector('.reveal-modal, .walkout, .modal-backdrop') ? setTimeout(wait, 400) : res()); setTimeout(wait, 600); }))
    .then(() => UI.walkout(D.UNIT_MAP.holo_gatekeeper, 'secret', false, { exclusive: true, isNew: g.isNew, shards: g.shards })));
  return true;
};

// Testing hook (tester panel only).
root.__xq = { dad: () => sceneDad(FEATS.dad), jj: () => sceneJJ(FEATS.jj), kr: () => sceneKR(FEATS.kr, 11.4), cer: () => sceneCer({ id: 'hero', tier: 4, icon: 'starbird', name: 'Hero of the Galaxy', desc: '', have: 1, need: 1 }), sv: () => sceneSV({ id: 'xq_sv_show', tier: 3, icon: 'bacta', name: 'Survivor', desc: 'Won on the last 1% of health. A free Sith Holocron is yours.', have: 1, need: 1 }), m4: () => sceneSide({ id: 'xq_m4', tier: 4, icon: 'jedi', name: 'May the 4th Be With You', desc: 'Claimed the May the 4th gift', have: 1, need: 1 }, 'jedi'), hp: () => sceneHP(FEATS.hp), frags: () => { Z().hf = []; Player.save(); placeFrags(); }, m5: () => sceneSide({ id: 'xq_m5', tier: 4, icon: 'sith', name: 'Revenge of the Fifth', desc: 'Won a battle on May the 5th', have: 1, need: 1 }, 'sith') };

// ---------- snapshot: screenshot a secret the moment it is unlocked ----------
// Reflect: every hit taken goes back at the attacker instead.
D.STATUS_INFO.reflect = { label: 'Reflect', icon: '⟲', kind: 'buff', desc: 'All damage taken is sent back at the attacker.' };

const SNAP_CARD = {
  id: 'mace_shatter', name: 'Mace Windu · Shatterpoint', kind: 'character', faction: 'light', rarity: 'secret', role: 'tank', exclusive: true, accent: '#b45aff', spd: 146,
  traits: ['jedi', 'republic', 'leader'], home: 'coruscant', xqReflect: true,
  sig: { move: 'shatter', prop: 'saber', impact: 'xslash', color: '#b45aff' }, anim: 'shield',
  bio: 'Mace in the instant he sees every shatterpoint at once. Vaapad Guard: every other turn he reflects all damage he takes back at the attacker until his next turn.',
  abilities: [
    { name: 'Vaapad Strike', cd: 0, target: 'enemy', effects: [dmg(1.2), debuff('defDown', 2, 0.35)], desc: 'Strike one enemy with a 35% chance to inflict Defense Down.' },
    { name: 'Fault Lines', cd: 4, target: 'self', effects: [buff('reflect', 2), buff('taunt', 2)], desc: 'Draw every attack: gain Taunt and Reflect for 2 turns.' },
  ],
  ultimate: ult('Shatterpoint', 'allEnemies', [dmg(2.0), debuff('stun', 1, 0.5), { ...buff('reflect', 2), on: 'self' }], 'Freeze the moment and break it: heavy damage to every enemy with a 50% Stun chance, then gain Reflect for 2 turns.', 'This party\'s over.'),
};
if (!D.UNIT_MAP[SNAP_CARD.id]) {
  D.UNITS.push(SNAP_CARD);
  D.UNIT_MAP[SNAP_CARD.id] = SNAP_CARD;
  if (D.BIOS) D.BIOS[SNAP_CARD.id] = SNAP_CARD.bio;
  if (D.ULT_ANIM) D.ULT_ANIM[SNAP_CARD.id] = SNAP_CARD.anim;
}

// Art: Mace framed in a camera viewfinder, the frame cracked along its fault lines.
root.Art.addArt('char', 'mace_shatter', () => {
  const base = root.Art.unitArt({ id: 'mace_windu', kind: 'character' }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const V = '#d9a8ff';
  const corner = (x, y, dx, dy) => P(`M${x} ${y + dy * 9} L${x} ${y} L${x + dx * 9} ${y}`, 'none', `stroke="${V}" stroke-width="1.6" stroke-linecap="round"`);
  return base
    + R(0, 0, 100, 100, '#3a0a6a', 'opacity=".22"')
    + P('M58 0 L54 22 L63 34 L52 52 L60 70 L55 100', 'none', 'stroke="#f2e2ff" stroke-width=".9" opacity=".85"')
    + P('M54 22 L36 18 M63 34 L86 28 M52 52 L30 58 M60 70 L82 78', 'none', 'stroke="#c88aff" stroke-width=".7" opacity=".8"')
    + C(54, 22, 1.6, '#ffffff') + C(63, 34, 1.4, '#ffffff') + C(52, 52, 1.8, '#ffffff') + C(60, 70, 1.3, '#ffffff')
    + corner(6, 6, 1, 1) + corner(94, 6, -1, 1) + corner(6, 94, 1, -1) + corner(94, 94, -1, -1)
    + C(12, 13, 1.8, '#ff3a4a') + P('M17 11.5 L17 14.5', 'none', `stroke="${V}" stroke-width="0"`);
});

// Engine: Vaapad Guard and Reflect, added from here so the core stays generic.
const BP = root.Battle && root.Battle.prototype;
if (BP && !BP.__xqr) {
  BP.__xqr = true;
  const baseBegin = BP.beginTurn;
  BP.beginTurn = function (unit) {
    const out = baseBegin.call(this, unit);
    if (unit.def && unit.def.xqReflect && unit.alive) {
      unit.__xt = (unit.__xt || 0) + 1;
      if (unit.__xt % 2 === 0) {
        unit.statuses.reflect = Math.max(unit.statuses.reflect || 0, 1);
        out.events.push({ type: 'status', uid: unit.uid, status: 'reflect' });
        out.events.push({ type: 'log', text: `${unit.def.name} enters Vaapad Guard: attacks will be reflected.`, side: unit.side === 'player' ? '' : 'enemy' });
      }
    }
    return out;
  };
  const baseEffect = BP.applyEffect;
  BP.applyEffect = function (source, target, eff, events) {
    if (eff.type === 'damage' && source && target && target.alive && target.statuses.reflect && source.side !== target.side) {
      this.__rf = { from: target, to: source };
      try { return baseEffect.call(this, source, target, eff, events); } finally { this.__rf = null; }
    }
    return baseEffect.call(this, source, target, eff, events);
  };
  const baseDamage = BP.applyDamage;
  BP.applyDamage = function (target, amount, crit, events, source) {
    const rf = this.__rf;
    if (rf && target === rf.from && source !== 'reflect' && rf.to.alive) {
      events.push({ type: 'log', text: `${target.def.name} reflects the attack back at ${rf.to.def.name}!`, side: target.side === 'player' ? '' : 'enemy' });
      baseDamage.call(this, rf.to, amount, crit, events, 'reflect');
      const last = events.filter((e) => e.type === 'damage').pop();
      if (last) last.from = target.uid;
      return;
    }
    return baseDamage.call(this, target, amount, crit, events, source);
  };
}

const B = root.BattleUI;
if (B && !B.__xqr) {
  B.__xqr = true;
  const baseHit = B.hit;
  B.hit = function (u, ev) {
    if (ev && ev.source === 'reflect') {
      if (ev.from && this.cards[ev.from]) this.wave(this.center(ev.from), '#b45aff', 2.2);
      this.slash(this.center(u.uid), '#d9a8ff', -30);
      this.float(u, 'Reflected!', 'bad', 22);
    }
    return baseHit.call(this, u, ev);
  };
  // The Shatterpoint ultimate: a camera shutter freezes the frame, fault lines
  // race across each enemy, then the frozen moment breaks.
  B.mv_shatter = async function (S, actor, from, T, spec, hit) {
    const Snd = root.Sound;
    const vf = el('<div class="xq-vf"><b></b><b></b><b></b><b></b><span>● REC</span><em>1/8000</em></div>');
    const shut = el('<div class="xq-shut"><i></i><i></i></div>');
    S.layer.appendChild(vf);
    S.layer.appendChild(shut);
    if (Snd) Snd.play('glitch');
    await this.wait(420);
    this.field.classList.add('xq-frozen');
    for (const t of T) {
      const pts = [];
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2 + Math.random() * 0.6;
        let p = { x: t.x, y: t.y };
        for (let j = 0; j < 4; j++) {
          const n = { x: p.x + Math.cos(a + (Math.random() - 0.5) * 0.9) * 22, y: p.y + Math.sin(a + (Math.random() - 0.5) * 0.9) * 22 };
          pts.push([p, n]);
          p = n;
        }
      }
      pts.forEach(([a, b], i) => setTimeout(() => S.trail(a, b, spec.color, 0.5), i * 12));
      const g = el(`<i class="xq-glint" style="left:${t.x}px;top:${t.y}px"></i>`);
      S.layer.appendChild(g);
      if (Snd) Snd.play('click');
      await this.wait(170);
    }
    await this.wait(380);
    shut.classList.add('snap');
    if (Snd) Snd.play('saber');
    for (const t of T) {
      this.shatterCard(t.uid, S.layer, spec.color);
      hit(t);
      await this.wait(120);
    }
    this.field.classList.remove('xq-frozen');
    await this.wait(500);
    vf.classList.add('out');
    setTimeout(() => { vf.remove(); shut.remove(); }, 400);
  };
}

const FEAT_SS = { id: 'xq_ss', secret: true, tier: 6, icon: 'cracked', name: 'Picture Perfect', desc: 'Captured a secret the instant it happened', have: 1, need: 1 };
H.feats.push((s) => ((s.z || {}).ss ? [FEAT_SS] : []));

// Crest: a camera aperture with spinning blades around a lens flare.
H.crests.xq_ss = () => {
  const u = `xs${++seq}`;
  const blades = Array.from({ length: 6 }, (_, k) => `<path d="M0 -60 L34 -40 L10 -6 Z" fill="#2a1240" stroke="#d9a8ff" stroke-width="1.4" transform="rotate(${k * 60})"/>`).join('');
  const inner = `<g>${anim.spin(14)}${blades}</g><circle r="14" fill="#b45aff" opacity=".35">${anim.fade('1;.2;1', 1.6)}</circle><circle r="6" fill="#ffffff"/>
    <g stroke="#ffffff" stroke-width="1.2" opacity=".8">${[[-46, -46, -30, -46, -46, -30], [46, -46, 30, -46, 46, -30], [-46, 46, -30, 46, -46, 30], [46, 46, 30, 46, 46, 30]].map(([x, y, x2, y2, x3, y3]) => `<polyline fill="none" points="${x2},${y2} ${x},${y} ${x3},${y3}"/>`).join('')}</g>`;
  return frame(u, inner, 'SNAPSHOT', { glow: '#b45aff', core: '#140820', tail: '#3a1a5a',
    back: `<g fill="#d9a8ff" opacity=".25">${anim.spin(40, true)}${Array.from({ length: 16 }, (_, k) => `<rect x="-2" y="-100" width="4" height="22" transform="rotate(${k * 22.5})"/>`).join('')}</g>` });
};

const sceneSS = (x, onDone) => {
  const stage = `<div class="xq-vf big"><b></b><b></b><b></b><b></b><span>● REC</span><em>1/8000</em></div><div class="xq-shut big"><i></i><i></i></div>
    <div class="xq-polaroid">${tile(D.UNIT_MAP.mace_shatter)}<span>the moment it broke</span></div>
    <p class="xq-line" style="top:74%;--t:3.4s;color:#d9a8ff">"Most people miss the moment."</p><p class="xq-line" style="top:80%;--t:4.6s">"You captured it."</p>`;
  return scene(x, 'xq-ss', stage, 6600, onDone, (S, at) => { at(300, () => S.play('click')); at(900, () => S.play('glitch')); at(1500, () => S.play('saber')); at(2200, () => S.play('reveal_epic')); });
};
H.scenes.xq_ss = (x) => sceneSS(x);

// Detection. Only a live secret unlock counts (never a replay from the
// Profile), and it is a one-time reward.
const SECRET_LABELS = ['Into the Unknown', 'Master of the Monolith', 'Galactic Grinder', 'Back for More?', FEATS.dad.name, FEATS.jj.name, FEATS.kr.name, FEATS.hp.name];
let liveCine = null;
let snapped = false;
const isSecretLabel = (label) => {
  const name = String(label || '').split(' · ')[0];
  if (SECRET_LABELS.includes(name)) return true;
  try { return UI.achievements().some((a) => a.secret && a.id !== 'xq_ss' && a.name.split(' · ')[0] === name); } catch (e) { return false; }
};
new MutationObserver((muts) => {
  for (const m of muts) {
    for (const n of m.addedNodes) {
      if (n.nodeType !== 1 || !n.classList.contains('feat-cine') || n.classList.contains('xq-ss')) continue;
      if (document.querySelector('.profile-modal')) continue;
      if (isSecretLabel(n.getAttribute('aria-label'))) liveCine = n;
    }
    for (const n of m.removedNodes) if (n === liveCine) { liveCine = null; if (snapped) awardSnap(); }
  }
}).observe(document.body, { childList: true });

const shutterFlash = () => {
  const f = el('<div class="xq-camflash"></div>');
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 700);
  if (root.Sound) root.Sound.play('click');
};
const caught = () => {
  if (!liveCine || !liveCine.isConnected || snapped || Z().ss) return;
  snapped = true;
  Z().ss = 1;
  Player.save();
  shutterFlash();
};
function awardSnap() {
  snapped = false;
  const g = Player.grantCard('mace_shatter', false);
  Player.save();
  UI.markFeatSeen('xq_ss');
  later(() => sceneSS(FEAT_SS).then(() => UI.walkout(D.UNIT_MAP.mace_shatter, 'secret', false, { exclusive: true, isNew: g.isNew, shards: g.shards })));
}
// Screenshot keys: Print Screen, Mac Cmd+Shift(+3/4/5), Windows Win+Shift(+S),
// ChromeOS Ctrl(+Shift)+Show windows. The OS often keeps the last key for
// itself, so holding the modifier pair during the scene is enough.
const held = new Set();
document.addEventListener('keydown', (e) => {
  held.add(e.key);
  if (!liveCine) return;
  const k = e.key;
  if (k === 'PrintScreen' || e.keyCode === 44) return caught();
  if ((k === 'LaunchApplication1' || k === 'ShowAllWindows' || e.keyCode === 182) && (e.ctrlKey || held.has('Control'))) return caught();
  if ((held.has('Meta') || e.metaKey) && (held.has('Shift') || e.shiftKey)) return caught();
  if ((held.has('Control') || e.ctrlKey) && (held.has('Shift') || e.shiftKey) && (held.size <= 3)) return caught();
}, true);
document.addEventListener('keyup', (e) => {
  held.delete(e.key);
  if (liveCine && (e.key === 'PrintScreen' || e.keyCode === 44)) caught();
}, true);
window.addEventListener('blur', () => held.clear());

const cssSS = `
.xq-vf { position: absolute; inset: 7%; z-index: 5; pointer-events: none; animation: fade-in .25s; }
.xq-vf b { position: absolute; width: 34px; height: 34px; border: 3px solid #e8d2ff; filter: drop-shadow(0 0 6px #b45aff); }
.xq-vf b:nth-child(1) { left: 0; top: 0; border-right: 0; border-bottom: 0; } .xq-vf b:nth-child(2) { right: 0; top: 0; border-left: 0; border-bottom: 0; }
.xq-vf b:nth-child(3) { left: 0; bottom: 0; border-right: 0; border-top: 0; } .xq-vf b:nth-child(4) { right: 0; bottom: 0; border-left: 0; border-top: 0; }
.xq-vf span { position: absolute; left: 44px; top: 6px; font: 700 13px/1 var(--font-display); letter-spacing: .14em; color: #ff4a5a; animation: xq-rec 1s steps(2) infinite; }
.xq-vf em { position: absolute; right: 44px; bottom: 6px; font: 700 12px/1 var(--font-display); font-style: normal; letter-spacing: .12em; color: #e8d2ff; }
.xq-vf.out { opacity: 0; transition: opacity .35s; }
.xq-vf.big { inset: 5%; }
@keyframes xq-rec { 50% { opacity: .2; } }
.xq-shut { position: absolute; inset: 0; z-index: 6; pointer-events: none; }
.xq-shut i { position: absolute; left: 0; right: 0; height: 50%; background: #05020a; transform: scaleY(0); }
.xq-shut i:first-child { top: 0; transform-origin: top; } .xq-shut i:last-child { bottom: 0; transform-origin: bottom; }
.xq-shut i { animation: xq-shut .32s ease-in-out; }
.xq-shut.snap i { animation: xq-shut .28s ease-in-out; }
.xq-shut.big i { animation: xq-shut .4s ease-in-out .8s both; }
@keyframes xq-shut { 0%, 100% { transform: scaleY(0); } 45%, 55% { transform: scaleY(1); } }
.xq-glint { position: absolute; width: 16px; height: 16px; margin: -8px 0 0 -8px; border-radius: 50%; background: #fff; box-shadow: 0 0 18px 6px #b45aff; z-index: 4; animation: xq-glint .9s ease-out forwards; }
@keyframes xq-glint { 0% { transform: scale(0); } 30% { transform: scale(1.4); } 100% { transform: scale(.4); opacity: 0; } }
.field.xq-frozen .bcard { filter: grayscale(.85) contrast(1.15); transition: filter .2s; }
.xq-camflash { position: fixed; inset: 0; z-index: 9999; background: #fff; pointer-events: none; animation: xq-camflash .6s ease-out forwards; }
@keyframes xq-camflash { from { opacity: .9; } to { opacity: 0; } }
.xq-ss { background: radial-gradient(ellipse at center, #1a0a2a, #05020a 70%); }
.xq-polaroid { position: absolute; left: 50%; top: 40%; width: min(220px, 46vw); padding: 10px 10px 30px; background: #f4f0ea; border-radius: 4px; box-shadow: 0 20px 60px rgba(0,0,0,.6), 0 0 40px rgba(180,90,255,.4); transform: translate(-50%, -50%) rotate(-4deg); opacity: 0; animation: xq-pol 1s cubic-bezier(.2,.9,.3,1.2) 1.4s forwards; }
.xq-polaroid .xq-tile { width: 100%; aspect-ratio: 1; }
.xq-polaroid .monogram, .xq-polaroid .xq-tile b { display: none; }
.xq-polaroid span { position: absolute; left: 0; right: 0; bottom: 8px; text-align: center; font: italic 600 13px/1 Georgia, serif; color: #3a2a4a; }
@keyframes xq-pol { from { opacity: 0; transform: translate(-50%, -30%) rotate(8deg) scale(.6); } to { opacity: 1; transform: translate(-50%, -50%) rotate(-4deg); } }
`;
document.head.appendChild(Object.assign(document.createElement('style'), { textContent: cssSS }));

Object.assign(root.__xq, { ss: () => sceneSS(FEAT_SS), ssReset: () => { delete Z().ss; snapped = false; Player.save(); }, ssLive: () => !!liveCine });

})(window);
