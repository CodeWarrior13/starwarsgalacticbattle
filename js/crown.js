// The Triple Crown: first on the season ladder, first in Live Duel wins, and
// first in at least one week's raid damage, all in the same season. It pays a
// frame nobody else can wear and a secret badge, with its own scene. The
// HoloNet decides who earned it when a season ends (holonet.js); this file
// keeps the badge on the player's shelf and plays the scene.
(function (root) {
  'use strict';
  const UI = root.UI;
  if (!UI || !UI.hooks) return;
  const H = UI.hooks;
  const P = () => root.Player;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const crowns = () => { const s = P() && P().state; return (s && Array.isArray(s.crowns)) ? s.crowns : []; };
  const label = (n) => { try { return root.HN && root.HN.seasonLabel ? root.HN.seasonLabel(n) : String(n); } catch (e) { return String(n); } };
  const feat = () => {
    const c = crowns();
    return { id: 'xq_crown', secret: true, tier: 6, icon: 'kybercrown', name: 'Triple Crown', desc: `First on the ladder, in duels and in a raid week, all in one season${c.length ? ` · Season ${c.map(label).join(', ')}` : ''}`, have: 1, need: 1 };
  };
  H.feats.push(() => (crowns().length ? [feat()] : []));

  // ---------- the scene ----------
  const CSS = `
.tc-scene{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;background:radial-gradient(circle at 50% 45%,#1a1030 0%,#05030c 70%);overflow:hidden;color:#fff;font-family:var(--font-display,system-ui);cursor:pointer;animation:tcIn .5s ease both}
.tc-scene.out{animation:tcOut .45s ease both}
@keyframes tcIn{from{opacity:0}to{opacity:1}}@keyframes tcOut{to{opacity:0}}
.tc-stars{position:absolute;inset:-10%;background-image:radial-gradient(1px 1px at 20% 30%,#fff8,transparent),radial-gradient(1px 1px at 70% 60%,#fff6,transparent),radial-gradient(1.5px 1.5px at 40% 80%,#ffe9a6aa,transparent),radial-gradient(1px 1px at 85% 20%,#fff7,transparent),radial-gradient(1px 1px at 10% 70%,#fff5,transparent);background-size:300px 300px;animation:tcDrift 30s linear infinite;opacity:.8}
@keyframes tcDrift{to{transform:translateY(-300px)}}
.tc-stage{position:relative;width:min(92vw,560px);height:min(92vh,620px);display:grid;place-items:center}
.tc-med{position:absolute;top:50%;left:50%;width:min(26vw,128px);aspect-ratio:1;margin:calc(min(26vw,128px)/-2) 0 0 calc(min(26vw,128px)/-2);display:grid;place-items:center;border-radius:50%;opacity:0;transform:translate(var(--x),var(--y)) scale(.2)}
.tc-med svg{width:100%;height:100%;filter:drop-shadow(0 0 18px var(--c))}
.tc-med b{position:absolute;bottom:-26px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:12px;letter-spacing:.18em;color:var(--c);text-shadow:0 0 10px var(--c)}
.tc-scene.s1 .tc-med.m1,.tc-scene.s2 .tc-med.m2,.tc-scene.s3 .tc-med.m3{animation:tcDrop .7s cubic-bezier(.2,1.4,.4,1) both}
@keyframes tcDrop{0%{opacity:0;transform:translate(var(--x),calc(var(--y) - 160px)) scale(1.6)}60%{opacity:1}100%{opacity:1;transform:translate(var(--x),var(--y)) scale(1)}}
.tc-scene.merge .tc-med{animation:tcMerge .8s cubic-bezier(.6,0,.4,1) both!important}
@keyframes tcMerge{from{opacity:1;transform:translate(var(--x),var(--y)) scale(1)}to{opacity:0;transform:translate(0,0) scale(.3) rotate(240deg)}}
.tc-flash{position:absolute;inset:0;background:radial-gradient(circle,#fff 0%,#ffe9a6 30%,transparent 70%);opacity:0;pointer-events:none}
.tc-scene.merge .tc-flash{animation:tcFlash 1.1s ease .6s both}
@keyframes tcFlash{0%{opacity:0;transform:scale(.2)}30%{opacity:1}100%{opacity:0;transform:scale(2.4)}}
.tc-hero{position:relative;width:min(52vw,250px);aspect-ratio:1;opacity:0;transform:scale(.6);margin-top:max(-24vh,-170px)}
.tc-scene.crown .tc-hero{animation:tcHero 1s cubic-bezier(.2,1.3,.4,1) both}
@keyframes tcHero{to{opacity:1;transform:scale(1)}}
.tc-hero .pic{position:absolute;inset:17%;border-radius:50%;overflow:hidden;background:#0c0820;box-shadow:0 0 40px #ffd23f66}
.tc-hero .pic svg{width:100%;height:100%}
.tc-hero .fr{position:absolute;inset:-8%}
.tc-hero .fr svg{width:100%;height:100%}
@keyframes tcSpin{to{transform:rotate(360deg)}}
.tc-rays{position:absolute;inset:-60%;background:repeating-conic-gradient(from 0deg,#ffd23f22 0 6deg,transparent 6deg 18deg);border-radius:50%;opacity:0;animation:tcSpin 40s linear infinite}
.tc-scene.crown .tc-rays{opacity:1;transition:opacity 1.2s}
.tc-text{position:absolute;bottom:2%;left:0;right:0;text-align:center;opacity:0;transform:translateY(20px)}
.tc-scene.crown .tc-text{animation:tcText .9s ease .7s both}
@keyframes tcText{to{opacity:1;transform:none}}
.tc-text small{display:block;font-size:12px;letter-spacing:.4em;color:#ffd86a}
.tc-text h2{margin:6px 0;font-size:clamp(34px,9vw,58px);letter-spacing:.12em;background:linear-gradient(180deg,#fff8d8,#ffd23f 45%,#b0700a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 16px #ffb02088)}
.tc-text p{margin:0 auto;max-width:440px;font-family:var(--font-body,system-ui);font-size:14px;color:#e8dcff;padding:0 16px}
.tc-skip{position:absolute;bottom:12px;right:16px;font:600 11px var(--font-body,system-ui);color:#ffffff88;letter-spacing:.1em}
@media (prefers-reduced-motion:reduce){.tc-scene *{animation-duration:.01s!important;transition:none!important}}`;
  const medal = (c1, c2, glyph) => `<svg viewBox="-60 -60 120 120"><defs><radialGradient id="tg${c1.slice(1)}" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient></defs>
    ${Array.from({ length: 16 }, (_, k) => `<path d="M0 -58 L4 -46 L-4 -46Z" fill="${c1}" transform="rotate(${k * 22.5})"/>`).join('')}
    <circle r="44" fill="url(#tg${c1.slice(1)})" stroke="#fff6" stroke-width="2"/><circle r="36" fill="none" stroke="#0006" stroke-width="2" stroke-dasharray="2 4"/>${glyph}</svg>`;
  const G_SEASON = '<path d="M-20 10 L-24 -14 L-10 -2 L0 -22 L10 -2 L24 -14 L20 10Z" fill="#3a2400"/><rect x="-20" y="13" width="40" height="7" rx="2" fill="#3a2400"/>';
  const G_DUEL = '<path d="M-22 22 L14 -14 M22 22 L-14 -14" stroke="#2a0008" stroke-width="7" stroke-linecap="round"/><circle cx="-16" cy="-18" r="5" fill="#2a0008"/><circle cx="16" cy="-18" r="5" fill="#2a0008"/>';
  const G_RAID = '<path d="M0 -24 C14 -24 22 -12 22 0 C22 10 16 16 12 18 L12 26 L-12 26 L-12 18 C-16 16 -22 10 -22 0 C-22 -12 -14 -24 0 -24Z" fill="#1a0030"/><circle cx="-8" cy="-2" r="5" fill="#d0a0ff"/><circle cx="8" cy="-2" r="5" fill="#d0a0ff"/>';
  function scene(x) {
    if (!document.getElementById('tc-css')) { const st = document.createElement('style'); st.id = 'tc-css'; st.textContent = CSS; document.head.appendChild(st); }
    const S = root.Sound;
    const HN = root.HN;
    let pic = '';
    try { const p = HN && HN.social ? HN.social.prof('me') : null; pic = root.Art.unitArt(root.GameData.UNIT_MAP[(p && p.av) || 'luke'] || root.GameData.UNIT_MAP.luke); } catch (e) { pic = ''; }
    let frame = '';
    try { frame = HN && HN.social && HN.social.frameSvg ? HN.social.frameSvg('tcrown') : ''; } catch (e) { frame = ''; }
    const season = crowns().length ? label(crowns()[crowns().length - 1]) : '';
    const node = document.createElement('div');
    node.className = 'tc-scene';
    node.setAttribute('role', 'dialog');
    node.setAttribute('aria-label', 'Triple Crown');
    node.innerHTML = `<i class="tc-stars"></i><div class="tc-stage"><i class="tc-rays"></i>
      <div class="tc-med m1" style="--x:calc(min(26vw,128px) * -1.25);--y:calc(min(26vw,128px) * -0.2);--c:#ffd23f">${medal('#ffd23f', '#8a5a08', G_SEASON)}<b>SEASON #1</b></div>
      <div class="tc-med m2" style="--x:calc(min(26vw,128px) * 1.25);--y:calc(min(26vw,128px) * -0.2);--c:#ff4a5a">${medal('#ff4a5a', '#6a0814', G_DUEL)}<b>DUELS #1</b></div>
      <div class="tc-med m3" style="--x:0px;--y:calc(min(26vw,128px) * -1.45);--c:#b070ff">${medal('#b070ff', '#3a0a6a', G_RAID)}<b>RAID #1</b></div>
      <div class="tc-hero"><span class="pic">${pic}</span><span class="fr">${frame}</span></div>
      <i class="tc-flash"></i>
      <div class="tc-text"><small>${season ? `SEASON ${esc(season)}` : 'SECRET'}</small><h2>TRIPLE CROWN</h2><p>First on the ladder. First in duels. First against the raid boss. One season, three crowns, and a frame no one else in the galaxy can wear.</p></div></div>
      <span class="tc-skip">Tap to continue</span>`;
    document.body.appendChild(node);
    const at = (ms, f) => setTimeout(f, ms);
    if (S) S.play('whoosh');
    at(500, () => { node.classList.add('s1'); if (S) S.play('reveal_epic'); });
    at(1300, () => { node.classList.add('s2'); if (S) S.play('reveal_epic'); });
    at(2100, () => { node.classList.add('s3'); if (S) S.play('reveal_epic'); });
    at(3200, () => { node.classList.add('merge'); if (S) S.play('ult'); });
    at(3900, () => { node.classList.add('crown'); if (S) { S.play('reveal_legendary'); at(400, () => S.play('victory')); } });
    return new Promise((done) => {
      const close = () => { node.classList.add('out'); setTimeout(() => { node.remove(); if (S && S.music) S.music('menu'); done(); }, 450); };
      at(4600, () => node.addEventListener('click', close));
    });
  }
  H.scenes.xq_crown = (x) => scene(x || feat());

  // Called by the HoloNet when a season ends with all three firsts.
  function award(season) {
    const s = P().state;
    s.crowns = Array.isArray(s.crowns) ? s.crowns : [];
    if (s.crowns.includes(season)) return Promise.resolve(false);
    s.crowns.push(season);
    P().save();
    return scene(feat()).then(() => { if (UI.markFeatSeen) try { UI.markFeatSeen('xq_crown'); } catch (e) { /* ignore */ } return true; });
  }
  root.Crown = { award, scene: () => scene(feat()), has: () => crowns().length > 0 };
})(typeof window !== 'undefined' ? window : globalThis);
