// Update 2.3: currency caps with fallback rewards, and Auto-open in the Black Market.
// Everything here stays switched off until 2.3 (RELEASE23; null keeps it off).
(function (root) {
  'use strict';
  const RELEASE23 = root.__v23Test != null ? root.__v23Test : null;
  const on = () => RELEASE23 != null && Date.now() >= RELEASE23;
  // Hooks read the current switch, so a reload of this file never leaves a stale one behind.
  const live = () => !!(root.Update23 && root.Update23.on && root.Update23.on());
  const D = root.GameData;
  const P = () => root.Player;
  const UI = () => root.UI;
  const fmt = (n) => Number(n).toLocaleString('en-US');

  // ---------- Currency caps ----------
  // Credits stop at 7,500,000 and Aurodium at 10,000; Kyber has no cap. Nothing
  // is lost: extra credits fill an overflow bank that pays out 1 Aurodium per
  // 2,500, and extra Aurodium (when its vault is full) becomes 10 Kyber each.
  const CAPS = { credits: 7500000, aurodium: 10000 };
  const CR_PER_AU = 2500;
  const KY_PER_AU = 10;
  function settle(s) {
    const o = s.ovf || (s.ovf = { cr: 0 });
    let au = 0;
    let ky = 0;
    if (s.credits > CAPS.credits) { o.cr += s.credits - CAPS.credits; s.credits = CAPS.credits; }
    const n = Math.floor(o.cr / CR_PER_AU);
    if (n > 0) { o.cr -= n * CR_PER_AU; s.aurodium += n; au += n; }
    if (s.aurodium > CAPS.aurodium) { const x = s.aurodium - CAPS.aurodium; s.aurodium = CAPS.aurodium; au -= Math.min(au, x); s.crystals += x * KY_PER_AU; ky += x * KY_PER_AU; }
    return { au, ky };
  }
  let pend = { au: 0, ky: 0 };
  let pendT = 0;
  const notify = (g) => {
    pend.au += g.au; pend.ky += g.ky;
    clearTimeout(pendT);
    pendT = setTimeout(() => {
      const t = UI() && UI().toast;
      if (t && pend.au) t(`Credit vault full (${fmt(CAPS.credits)}): overflow turned into ${fmt(pend.au)} Aurodium.`);
      if (t && pend.ky) t(`Aurodium vault full (${fmt(CAPS.aurodium)}): overflow turned into ${fmt(pend.ky)} Kyber.`);
      pend = { au: 0, ky: 0 };
    }, 700);
  };
  const walletTitles = (s) => {
    if (typeof document === 'undefined') return;
    const c = document.getElementById('credits');
    const a = document.getElementById('aurodium');
    const o = (s.ovf && s.ovf.cr) || 0;
    if (c && c.closest('.currency')) c.closest('.currency').title = `Credits: ${fmt(s.credits)} / ${fmt(CAPS.credits)}${s.credits >= CAPS.credits ? ` · overflow ${fmt(o)} / ${fmt(CR_PER_AU)} toward 1 Aurodium` : ''}`;
    if (a && a.closest('.currency')) a.closest('.currency').title = `Aurodium: ${fmt(s.aurodium)} / ${fmt(CAPS.aurodium)}${s.aurodium >= CAPS.aurodium ? ` · extra Aurodium becomes ${KY_PER_AU} Kyber each` : ''}`;
  };
  const Pl = P();
  if (Pl && !Pl.__v23save) {
    Pl.__v23save = true;
    const base = Pl.save;
    Pl.save = function () {
      if (live() && this.state) {
        const g = root.Update23.settle(this.state);
        if (g.au || g.ky) notify(g);
      }
      const r = base.apply(this, arguments);
      if (live() && this.state) walletTitles(this.state);
      return r;
    };
  }

  // ---------- Auto-open ----------
  const AUTO_LEVEL = 30;
  // Holocrons roll lower odds while Auto-open runs; the delivery crates don't change.
  const AUTO_ODDS = {
    strongbox: { common: 0, rare: 0, epic: 77, legendary: 22, mythic: 1 },
    holocron: { common: 0, rare: 60, epic: 32, legendary: 7.2, mythic: 0.8 },
  };
  // How long each card's stats stay up before the next one (by rarity).
  const HOLD = { common: 4400, rare: 4400, epic: 4600, legendary: 6500, mythic: 9000, secret: 9000 };
  const level = () => ((P() && P().state && P().state.account) || {}).level || 1;
  const unlocked = () => live() && level() >= AUTO_LEVEL;
  if (Pl && !Pl.__v23odds) {
    Pl.__v23odds = true;
    const baseOdds = Pl.effectiveOdds;
    Pl.effectiveOdds = function (pack) {
      if (!this.__auto || !AUTO_ODDS[pack.id]) return baseOdds.call(this, pack);
      return baseOdds.call(this, { ...pack, odds: AUTO_ODDS[pack.id] });
    };
  }
  const v23 = () => { const s = P().state; return (s.v23 = s.v23 || {}); };

  // Secret badge: pull Jar Jar while Auto-opening. Tapping it replays his crate moment.
  const FEAT_JJ = { id: 'xq_jj_auto', secret: true, tier: 5, icon: 'spark', name: 'Meesa Autopilot', desc: 'Pulled Jar Jar while Auto-opening crates', have: 1, need: 1 };
  const H = UI() && UI().hooks;
  if (H && !H.__v23) {
    H.__v23 = true;
    H.feats.push((s) => (s.v23 && s.v23.jjAuto ? [FEAT_JJ] : []));
    H.scenes.xq_jj_auto = () => (root.__xq && root.__xq.jj ? root.__xq.jj() : null);
  }

  const RCOL = { common: '#9aa7b8', rare: '#46c2ff', epic: '#b77bff', legendary: '#ffb938', mythic: '#ff2a5a', secret: '#5affc8' };
  const costKey = (pack) => Object.keys(pack.cost)[0];
  const affordable = (pack) => { const k = costKey(pack); return Math.floor((P().state[k] || 0) / pack.cost[k]); };
  const oddsLine = (o) => ['common', 'rare', 'epic', 'legendary', 'mythic'].filter((k) => o[k] > 0).map((k) => `<span style="color:${RCOL[k]}">${D.RARITIES[k].label} ${o[k]}%</span>`).join(' · ');

  // Vekko gets his own little screen when you can't pay for the next crate: he
  // slides in from his alley, tells you how many you cracked and your best pull,
  // and waits until you tap.
  // Drop any SVG animations so the screen costs nothing while it waits.
  const still = (h) => String(h).replace(/<animate(?:Transform|Motion)?\b[^>]*\/>/g, '').replace(/<animate(?:Transform|Motion)?\b[^>]*>[\s\S]*?<\/animate(?:Transform|Motion)?>/g, '').replace(/class="(cc-[a-z]+)"/g, 'class="$1-still"');
  const RANK = { common: 0, rare: 1, epic: 2, legendary: 3, mythic: 4, secret: 5 };
  const CUR = { credits: 'credits', crystals: 'Kyber', aurodium: 'Aurodium' };
  function dealer(pack, t) {
    return new Promise((resolve) => {
      const u = UI();
      const art = root.__vekkoArt;
      const k = costKey(pack);
      const best = t && t.top ? D.UNIT_MAP[t.top] : null;
      const n = t ? t.opened : 0;
      const line2 = n ? `You cracked ${fmt(n)} ${u.esc(pack.name)}${n === 1 ? '' : 's'} on my watch.` : 'Not one crate this time.';
      const line3 = best ? `Best pull: <b style="color:${RCOL[best.rarity]}">${u.esc(best.name)}</b> (${u.esc(D.RARITIES[best.rarity].label)}). Not bad, friend.` : '';
      const node = document.createElement('div');
      node.className = 'v23-broke';
      node.setAttribute('role', 'dialog');
      node.setAttribute('aria-label', 'Out of ' + CUR[k]);
      node.innerHTML = `<div class="vb-alley">${still(art ? art.alley() : '')}</div><div class="vb-rain"></div>
        <div class="vb-vekko">${still(art ? art.vekko() : root.Art.merchantArt())}</div>
        <div class="vb-bub"><small>VEKKO THE FENCE</small><p>Looks like you ran out of ${CUR[k]}.</p><p>${line2}</p>${line3 ? `<p>${line3}</p>` : ''}<p>Come back when your pockets jingle again.</p></div>
        ${best ? `<div class="vb-best" style="--c:${RCOL[best.rarity]}">${root.Art.unitArt(best)}<span>${u.esc(best.name)}</span></div>` : ''}
        <span class="vb-tap">Tap to close</span>`;
      document.body.appendChild(node);
      if (root.Sound) root.Sound.play('whoosh');
      const close = () => {
        if (!node.classList.contains('ready')) return;
        node.classList.add('out');
        setTimeout(() => { node.remove(); resolve(); }, 350);
      };
      setTimeout(() => node.classList.add('ready'), 900);
      node.addEventListener('click', close);
    });
  }

  function summary(pack, t, reason) {
    const u = UI();
    const head = { done: `Opened ${t.opened} ${pack.name}${t.opened === 1 ? '' : 's'}`, broke: `Opened ${t.opened} before you ran out`, mythic: 'Stopped: MYTHIC pulled!', legendary: 'Stopped: Legendary pulled!', stop: `Stopped after ${t.opened}` }[reason];
    const rows = ['mythic', 'legendary', 'epic', 'rare', 'common'].filter((k) => t.r[k]).map((k) => `<div class="v23-r" style="--c:${RCOL[k]}"><b>${t.r[k]}</b><span>${D.RARITIES[k].label}</span></div>`).join('');
    const best = t.best.slice(0, 8).map((id) => `<button type="button" class="v23-best" data-inspect="${id}" style="--c:${RCOL[D.UNIT_MAP[id].rarity]}">${root.Art.unitArt(D.UNIT_MAP[id])}</button>`).join('');
    const spent = Object.entries(t.spent).map(([k, v]) => u.cur(k, v)).join(' ');
    const m = u.openModal(`<div class="v23-sum"><p class="eyebrow">Auto-open complete</p><h2>${u.esc(head)}</h2>
      <div class="v23-rows">${rows}</div>
      <div class="v23-meta"><span><b>${t.news}</b> new cards</span><span><b>${t.holos}</b> holo</span><span><b>${fmt(t.shards)}</b> shards</span>${t.jj ? '<span class="v23-jj">Jar Jar!</span>' : ''}</div>
      ${best ? `<h3>Best pulls</h3><div class="v23-bests">${best}</div>` : ''}
      <p class="muted small">Spent ${spent}</p>
      <div class="modal-actions" style="justify-content:center"><button class="btn btn-primary" type="button" data-ok>Done</button></div></div>`, { small: true, cls: 'v23-sum-modal' });
    m.root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-inspect]');
      if (b) return u.inspect(b.dataset.inspect);
      if (e.target.closest('[data-ok]')) m.close();
    });
  }

  let running = null;
  async function run(pack, count, stopM, stopL) {
    if (running) return;
    const u = UI();
    running = { stop: false };
    const t = { opened: 0, r: {}, news: 0, holos: 0, shards: 0, spent: {}, best: [], jj: false, top: null };
    let reason = 'done';
    try {
      for (let i = 1; count === Infinity || i <= count; i++) {
        if (running.stop) { reason = 'stop'; break; }
        if (!P().canAfford(pack.cost)) { await dealer(pack, t); reason = 'broke'; break; }
        P().__auto = true;
        let res;
        try { res = P().openPack(pack.id); } finally { P().__auto = false; }
        if (!res) { await dealer(pack, t); reason = 'broke'; break; }
        t.opened += 1;
        for (const [k, v] of Object.entries(pack.cost)) t.spent[k] = (t.spent[k] || 0) + v;
        let hitM = false;
        let hitL = false;
        for (const r of res) {
          const rar = D.UNIT_MAP[r.id].rarity;
          t.r[rar] = (t.r[rar] || 0) + 1;
          if (r.isNew) t.news += 1;
          if (r.holo) t.holos += 1;
          t.shards += r.shards || 0;
          if (rar === 'mythic' || rar === 'legendary' || r.jj) t.best.unshift(r.id);
          if (!t.top || RANK[rar] > RANK[D.UNIT_MAP[t.top].rarity]) t.top = r.id;
          if (rar === 'mythic') hitM = true;
          if (rar === 'legendary') hitL = true;
          if (r.jj) {
            t.jj = true;
            if (!v23().jjAuto) { v23().jjAuto = 1; P().save(); setTimeout(() => u.toast('Secret badge unlocked: Meesa Autopilot!'), 600); }
          }
        }
        u.updateWallet();
        await u.packReveal(res, pack.id, { auto: { label: `AUTO-OPEN · ${i} / ${count === Infinity ? '∞' : count}`, hold: (r) => HOLD[r] || 4400, onStop: () => { running.stop = true; } } });
        if (stopM && hitM) { reason = 'mythic'; break; }
        if (stopL && hitL) { reason = 'legendary'; break; }
      }
    } finally {
      running = null;
    }
    if (t.opened) summary(pack, t, reason);
    if (u.App && u.App.refresh) u.App.refresh();
  }

  function setup(packId) {
    const u = UI();
    const pack = D.PACKS.find((p) => p.id === packId);
    if (!pack) return;
    const last = v23().auto || { n: 10, m: true, l: false };
    const odds = AUTO_ODDS[pack.id] || pack.odds;
    const can = affordable(pack);
    const m = u.openModal(`<div class="v23-setup"><p class="eyebrow">Auto-open</p><h2>${u.esc(pack.name)}</h2>
      <p class="muted small">Opens crates one after another, plays every reveal, and moves on by itself. ${u.cur(costKey(pack), pack.cost[costKey(pack)])} each · you can afford <b>${fmt(can)}</b>.</p>
      <label class="v23-lbl">How many?</label>
      <div class="v23-n"><input type="number" min="1" max="100000" value="${last.n === Infinity || last.n === 'inf' ? '' : last.n}" placeholder="∞" data-n>${[10, 25, 50, 100].map((n) => `<button type="button" class="btn btn-small" data-preset="${n}">${n}</button>`).join('')}<button type="button" class="btn btn-small" data-preset="inf">∞</button></div>
      <label class="v23-chk"><input type="checkbox" data-sm ${last.m ? 'checked' : ''}> Stop when I pull a Mythic</label>
      <label class="v23-chk"><input type="checkbox" data-sl ${last.l ? 'checked' : ''}> Stop when I pull a Legendary</label>
      <p class="v23-odds">Auto-open odds per card: ${oddsLine(odds)}${AUTO_ODDS[pack.id] ? '<br><small>Holocrons have lower odds in Auto-open than when opened by hand.</small>' : ''}</p>
      <div class="modal-actions"><button class="btn" type="button" data-x>Cancel</button><button class="btn btn-primary" type="button" data-go ${can ? '' : 'disabled'}>Start</button></div></div>`, { small: true, cls: 'v23-setup-modal' });
    const inp = m.root.querySelector('[data-n]');
    m.root.addEventListener('click', (e) => {
      const pr = e.target.closest('[data-preset]');
      if (pr) { inp.value = pr.dataset.preset === 'inf' ? '' : pr.dataset.preset; return; }
      if (e.target.closest('[data-x]')) return m.close();
      if (e.target.closest('[data-go]')) {
        const raw = parseInt(inp.value, 10);
        const n = raw > 0 ? Math.min(100000, raw) : Infinity;
        const sm = m.root.querySelector('[data-sm]').checked;
        const sl = m.root.querySelector('[data-sl]').checked;
        v23().auto = { n: n === Infinity ? 'inf' : n, m: sm, l: sl };
        P().save();
        m.close();
        setTimeout(() => run(pack, n, sm, sl), 300);
      }
    });
  }

  // Auto-open buttons under each crate in the Black Market.
  const Screens = UI() && UI().Screens;
  if (Screens && Screens.market && !Screens.__v23) {
    Screens.__v23 = true;
    const baseMarket = Screens.market;
    Screens.market = function () {
      const v = baseMarket.apply(this, arguments);
      if (!live() || !v || !v.querySelectorAll) return v;
      for (const b of v.querySelectorAll('[data-pack]')) {
        const lock = !unlocked();
        b.insertAdjacentHTML('afterend', `<button class="btn pack-auto" type="button" data-auto-pack="${b.dataset.pack}" ${lock ? 'disabled' : ''}>${lock ? `Auto-open · unlocks at level ${AUTO_LEVEL}` : 'Auto-open'}</button>`);
      }
      v.addEventListener('click', (e) => { const a = e.target.closest('[data-auto-pack]'); if (a && !a.disabled) setup(a.dataset.autoPack); });
      return v;
    };
  }

  if (typeof document !== 'undefined' && !document.getElementById('v23-css')) {
    const st = document.createElement('style');
    st.id = 'v23-css';
    st.textContent = `.pack-auto{width:100%;margin-top:6px;border-color:rgba(255,210,63,.5);color:#ffd23f}.pack-auto:disabled{color:var(--muted);border-color:var(--line)}
.reveal-modal.auto-open [data-auto-stop]{margin-left:auto}
.v23-setup .v23-lbl{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}.v23-n{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:6px 0 10px}.v23-n input{width:110px;padding:8px;border-radius:8px;border:1px solid var(--line);background:#0a0f1a;color:#fff;font:600 16px var(--font-display);text-align:center}
.v23-chk{display:flex;gap:8px;align-items:center;justify-content:center;font-size:14px;margin:4px 0}.v23-odds{font-size:12px;color:#cde;background:var(--panel-2);border-radius:8px;padding:8px}
.v23-broke{position:fixed;inset:0;z-index:95;overflow:hidden;background:#05030a;cursor:pointer;animation:fade-in .3s}.v23-broke.out{animation:v23-out .35s forwards}@keyframes v23-out{to{opacity:0}}
.vb-alley{position:absolute;inset:0;opacity:.85}.vb-alley svg{width:100%;height:100%;display:block}.vb-rain{position:absolute;inset:0;background:repeating-linear-gradient(105deg,transparent 0 22px,rgba(160,190,255,.07) 22px 23px)}
.vb-vekko{position:absolute;right:-2%;bottom:0;width:clamp(190px,46vmin,360px);animation:vb-in .8s cubic-bezier(.2,.8,.3,1.1) both}.vb-vekko svg{width:100%;display:block}@keyframes vb-in{from{opacity:0;transform:translateX(45%)}}
.vb-bub{position:absolute;left:5%;right:36%;bottom:34%;padding:12px 16px;border-radius:14px 14px 4px 14px;background:rgba(10,6,18,.9);border:1px solid rgba(255,46,136,.55);color:#f2e8ff;font-family:var(--font-display);font-size:clamp(14px,2.6vw,19px);animation:vb-bub .5s .6s both}.vb-bub small{display:block;font-size:.6em;letter-spacing:.3em;color:#ff8ac0;margin-bottom:4px}.vb-bub p{margin:3px 0}@keyframes vb-bub{from{opacity:0;transform:translateY(8px)}}
.vb-best{position:absolute;left:5%;bottom:8%;width:clamp(110px,22vmin,160px);border-radius:12px;overflow:hidden;border:2px solid var(--c);box-shadow:0 0 24px var(--c);background:#000;animation:vb-bub .5s 1s both}.vb-best svg{width:100%;aspect-ratio:1;display:block}.vb-best span{display:block;padding:4px 6px;font:800 12px var(--font-display);text-align:center}
.vb-tap{position:absolute;bottom:14px;left:0;right:0;text-align:center;font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:rgba(255,255,255,.45);opacity:0;transition:opacity .3s}.v23-broke.ready .vb-tap{opacity:1}
@media (max-width:560px){.vb-bub{right:5%;bottom:46%}.vb-vekko{width:52vw}}
.v23-dealer{display:grid;gap:10px;justify-items:center}.v23-vekko{width:150px;height:150px;border-radius:50%;overflow:hidden;border:2px solid #ff2e88;box-shadow:0 0 24px rgba(255,46,136,.45);animation:v23-pop .5s cubic-bezier(.2,1.4,.4,1)}.v23-vekko svg{width:100%;height:100%;display:block}.v23-say{background:#1a0e1a;border:1px solid #ff2e8866;border-radius:12px;padding:10px 14px;text-align:left}.v23-say b{color:#ff6ab0;font-family:var(--font-display);letter-spacing:.08em}.v23-say p{margin:4px 0 0;font-style:italic}
@keyframes v23-pop{from{transform:translateY(40px) scale(.6);opacity:0}}
.v23-rows{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}.v23-r{min-width:70px;padding:8px;border-radius:10px;border:1px solid var(--c);background:color-mix(in srgb,var(--c) 14%,var(--panel-2))}.v23-r b{display:block;font:800 22px var(--font-display);color:var(--c)}.v23-r span{font-size:11px;color:var(--muted)}
.v23-meta{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;font-size:13px;color:var(--muted)}.v23-meta b{color:#fff}.v23-jj{color:#ffd23f;font-weight:800}
.v23-bests{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}.v23-best{width:58px;height:58px;padding:0;border-radius:10px;overflow:hidden;border:2px solid var(--c);background:#000;cursor:pointer}.v23-best svg{width:100%;height:100%;display:block}`;
    document.head.appendChild(st);
  }

  root.Update23 = { on, CAPS, CR_PER_AU, KY_PER_AU, AUTO_LEVEL, AUTO_ODDS, settle, unlocked, autoOpen: (id, n, m, l) => run(D.PACKS.find((p) => p.id === id), n, m, l), setup,
    // Tester preview of Vekko's out-of-funds screen.
    previewBroke: (id, opened, best) => dealer(D.PACKS.find((p) => p.id === (id || 'strongbox')), { opened: opened || 12, top: best || null }) };
})(typeof window !== 'undefined' ? window : globalThis);
