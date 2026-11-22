// Update 2.6 "Squadron Commander": guild analytics. Off until 2.6 ships (js/update26.js).
// A new Analytics tab in the guild for the Leader and Co-Leader (the Leader can let Elders see it;
// Members never do). Everything comes from what the guild screen already loaded: each member's
// public row (points, raid damage, donations, battles, last online) and the guild chat. The only
// new data is a tiny 7-day list (points, battles, chats per day) that rides along with the row
// each player already uploads, so there are no extra network calls. The tab is built only when
// it is opened, all pictures are still, and the promotion breakdown only ever suggests.
(function (root) {
  'use strict';
  if (!(root.Update26 && root.Update26.on())) return;
  const HN = root.HN; const UI = root.UI;
  if (!HN || !HN.social || !HN.VIEWS || !HN.clicks || !UI) return;
  if (HN.__g26) return; HN.__g26 = true;
  const SO = HN.social; const Net = HN.Net; const V = HN.VIEWS; const CL = HN.clicks;
  const { esc, fmt, toast } = UI;
  const DAY = 86400000;
  // Days count in Central time (UTC-6), so "today" matches the rest of the game.
  const dayNo = (t) => Math.floor(((t || Date.now()) - 6 * 3600000) / DAY);

  // ---------- Your own 7-day history (rides along with your public row) ----------
  const blank = () => ({ d: dayNo(), gp: [0, 0, 0, 0, 0, 0, 0], bt: [0, 0, 0, 0, 0, 0, 0], ch: [0, 0, 0, 0, 0, 0, 0] });
  const roll = (a, today) => {
    if (!a || !Array.isArray(a.gp) || a.gp.length !== 7) return blank();
    const k = Math.max(0, Math.min(7, today - (a.d | 0)));
    if (!k) return a;
    const sh = (arr) => arr.slice(k).concat(Array(k).fill(0));
    return { d: today, gp: sh(a.gp), bt: sh(a.bt || [0, 0, 0, 0, 0, 0, 0]), ch: sh(a.ch || [0, 0, 0, 0, 0, 0, 0]) };
  };
  const mine = () => {
    const h = SO.P2();
    const a = roll(h.a26, dayNo());
    const s = h.a26s || (h.a26s = { gpl: h.soc ? h.soc.gpl | 0 : 0, bt: 0, ts: Date.now() });
    // Points: everything added to your all-time guild points since the last look goes on today.
    const gpl = h.soc ? h.soc.gpl | 0 : 0;
    if (gpl > s.gpl) a.gp[6] += gpl - s.gpl;
    s.gpl = gpl;
    // Battles: wins and losses since the last look.
    const st = (h.prof && h.prof.st) || {};
    const bt = (st.w | 0) + (st.l | 0);
    if (s.bt && bt > s.bt) a.bt[6] += bt - s.bt;
    s.bt = bt;
    // Chats: your guild lines newer than the last look, counted on the day they were sent.
    try {
      const gid = SO.myGuildId();
      const myDoc = SO.G.chat.find((c) => c.uid === Net.me);
      let newest = s.ts | 0;
      for (const m of (myDoc && myDoc.msgs) || []) {
        if (!m || !m.ts || m.ts <= (s.ts | 0) || m.g !== gid || m.s) continue;
        const i = 6 - (dayNo() - dayNo(m.ts));
        if (i >= 0 && i <= 6) a.ch[i] += 1;
        newest = Math.max(newest, m.ts);
      }
      s.ts = newest;
    } catch (e) { /* chat not loaded yet */ }
    h.a26 = a;
    return { d: a.d, gp: a.gp.map((n) => n | 0), bt: a.bt.map((n) => n | 0), ch: a.ch.map((n) => n | 0) };
  };
  HN.a26 = mine;
  // Battles finish → note them (the next upload carries them; nothing extra is sent).
  if (UI.hooks && UI.hooks.battleEnd) UI.hooks.battleEnd.push(() => { try { mine(); } catch (e) { /* ignore */ } });

  // ---------- Who may look ----------
  const roleNow = (gid) => SO.roleOf(Net.me, gid);
  const eldersOk = (gid) => ((SO.gmap.get(gid) || {}).anaPerm) === true;
  const canSee = (gid) => { const r = roleNow(gid); return r === 'leader' || r === 'co' || (r === 'elder' && eldersOk(gid)); };
  const canAdvise = (gid) => { const r = roleNow(gid); return r === 'leader' || r === 'co'; };

  // ---------- Reading each member ----------
  const row = (uid) => (Net.arena || []).find((x) => x.uid === uid) || (Net.rows && Net.rows.get ? Net.rows.get(uid) : null) || null;
  // A spread of a weekly total over 7 days, steady for the same player (rows from older game versions).
  const spread = (uid, total) => {
    let s = 0; for (const ch of String(uid)) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
    const today = dayNo(); const w = [];
    for (let i = 0; i < 7; i++) { s = (s * 1664525 + 1013904223) >>> 0; w.push(((today - 6 + i) % 7 === s % 7) ? 0.15 : 0.4 + (s % 1000) / 1000); }
    const sum = w.reduce((a, b) => a + b, 0) || 1;
    return w.map((x) => Math.round((total * x) / sum));
  };
  function stats(gid, win) {
    const today = dayNo(); const now = Date.now();
    const raid = SO.graidTotals(gid); const dmg = {};
    for (const f of ['ground', 'fleet']) for (const r of raid[f].rows) dmg[r.uid] = (dmg[r.uid] || 0) + r.dmg;
    const dons = SO.donors(gid);
    const lines = SO.chatLines(gid).filter((l) => !l.s);
    const since = now - (win === 'day' ? DAY : 7 * DAY);
    const out = SO.membersOf(gid).map((uid) => {
      const me = uid === Net.me || uid === 'me';
      const id = me ? Net.me : uid;
      const p = SO.prof(uid); const r = me ? null : row(uid);
      const wk = SO.weekPoints(uid);
      let a = me ? mine() : r && r.a26 ? roll(r.a26, today) : null;
      if (!a) { const g = spread(id, wk); a = { gp: g, bt: g.map((n) => Math.round(n / 25)), ch: [0, 0, 0, 0, 0, 0, 0] }; }
      const chatSeen = lines.filter((l) => l.uid === id && l.ts >= since).length;
      const chats = Math.max(chatSeen, win === 'day' ? a.ch[6] : a.ch.reduce((x, y) => x + y, 0));
      const seen = me ? now : (r && r.updated) || 0;
      const days = a.gp.map((n, i) => n + a.bt[i] * 10 + a.ch[i] * 4);
      return {
        uid: id, me, p, r: SO.roleOf(uid, gid), pts: wk, gp7: a.gp.reduce((x, y) => x + y, 0), raid: dmg[id] || dmg[uid] || 0, don: dons[id] | 0,
        bt7: a.bt.reduce((x, y) => x + y, 0), chats, seen, days, active: days.filter((n) => n > 0).length,
      };
    });
    return out;
  }

  // ---------- Pictures ----------
  // Heat colours, like an elevation map: deep blue (quiet) up through cyan, green and yellow to red (busiest).
  const HEAT = ['#16233a', '#1f4f9a', '#2a8fd8', '#2fc6c4', '#4ad66a', '#c8e04a', '#f2c23a', '#ff8a2a', '#ff3a3a'];
  // Scaled from the quietest to the busiest value shown, so the spread is visible even when days are close.
  const heatC = (v, max, min = 0) => (v <= 0 || max <= 0 ? HEAT[0] : HEAT[Math.min(HEAT.length - 1, 1 + Math.floor(Math.max(0, (v - min) / Math.max(1, max - min)) * (HEAT.length - 1.001)))]);
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayLabels = () => { const t = dayNo(); return Array.from({ length: 7 }, (_, i) => DOW[((t - 6 + i) % 7 + 4 + 7) % 7]); };
  const avatar = (x) => { try { return SO.avatar(x.p, 'sm'); } catch (e) { return ''; } };
  const banner = (x) => { try { const B = SO.BANNERS[x.p.ban]; if (!B || !SO.gban) return ''; return SO.gban({ id: '_p', color: '#5fd8ff', banner: x.p.ban }, 'row', true); } catch (e) { return ''; } };
  const agoTxt = (t) => { if (!t) return 'a while ago'; const d = Math.floor((Date.now() - t) / DAY); return d < 1 ? 'Today' : d === 1 ? 'Yesterday' : `${d} days ago`; };

  // ---------- Hints and the promotion breakdown ----------
  function hints(list, gid) {
    const out = [];
    const raid = SO.graidTotals(gid);
    const rise = list.filter((x) => x.days[6] > 0 && x.days[5] > 0 && x.days[4] > 0 && x.days[6] >= x.days[4] && x.r === 'member').sort((a, b) => b.gp7 - a.gp7)[0];
    if (rise) out.push(['up', `<b>${esc(SO.prof(rise.uid).tag || Net.name(rise.uid))}</b> has played 3 days running and is still climbing.`]);
    const away = list.filter((x) => (x.r === 'elder' || x.r === 'co') && x.seen && Date.now() - x.seen > 5 * DAY)[0];
    if (away) out.push(['down', `<b>${esc(Net.name(away.uid))}</b> (${SO.ROLE_NAME[away.r]}) hasn't been on in ${Math.floor((Date.now() - away.seen) / DAY)} days.`]);
    const g = raid.ground; const f = raid.fleet;
    if (g.pool && f.pool && !raid.fallen) {
      const gp = g.dealt / g.pool; const fp = f.dealt / f.pool;
      if (Math.abs(gp - fp) > 0.2) out.push(['', `${gp > fp ? 'Fleet' : 'Ground'} raid is ${Math.round(Math.abs(gp - fp) * 100)}% behind. Ask ${gp > fp ? 'ship' : 'ground'} players to run it.`]);
    }
    const quiet = list.filter((x) => !x.active).length;
    if (quiet) out.push(['down', `${quiet} member${quiet === 1 ? '' : 's'} didn't play at all this week.`]);
    return out.slice(0, 4);
  }
  // A score from the numbers only: points, raid share, donations, days active and chat.
  function breakdown(list) {
    const max = (k) => Math.max(1, ...list.map((x) => x[k]));
    const M = { gp7: max('gp7'), raid: max('raid'), don: max('don'), chats: max('chats'), bt7: max('bt7') };
    const scored = list.map((x) => {
      const parts = [['points', x.gp7 / M.gp7, 0.32], ['raid damage', x.raid / M.raid, 0.24], ['days active', x.active / 7, 0.2], ['Beskar donated', x.don / M.don, 0.12], ['battles', x.bt7 / M.bt7, 0.08], ['chat', x.chats / M.chats, 0.04]];
      const score = Math.round(parts.reduce((a, [, v, w]) => a + v * w, 0) * 100);
      const best = parts.filter(([, v]) => v >= 0.6).map(([n]) => n);
      const low = parts.filter(([n, v]) => v < 0.25 && n !== 'chat').map(([n]) => n);
      return { ...x, score, best, low };
    }).sort((a, b) => b.score - a.score);
    const awayDays = (x) => (x.seen ? Math.floor((Date.now() - x.seen) / DAY) : 99);
    return scored.map((x, i) => {
      let call = 'Keep'; let why = '';
      const top = i < Math.max(2, Math.ceil(scored.length * 0.2));
      const bottom = i >= scored.length - Math.max(2, Math.ceil(scored.length * 0.2));
      if (x.r === 'member' && top && x.active >= 4) { call = 'Promote to Elder'; why = `Top ${i + 1} of ${scored.length}${x.best.length ? `: strong ${x.best.slice(0, 3).join(', ')}` : ''}, active ${x.active} of 7 days.`; }
      else if (x.r === 'elder' && (awayDays(x) >= 7 || (bottom && x.active <= 2))) { call = 'Consider demoting'; why = awayDays(x) >= 7 ? `Away ${awayDays(x)} days.` : `Near the bottom (${i + 1} of ${scored.length}), active ${x.active} of 7 days${x.low.length ? `; low ${x.low.slice(0, 2).join(' and ')}` : ''}.`; }
      else if (x.r === 'co' && awayDays(x) >= 7) { call = 'Check in'; why = `Co-Leader away ${awayDays(x)} days.`; }
      else why = x.best.length ? `Strong ${x.best.slice(0, 3).join(', ')}.` : x.active ? `Active ${x.active} of 7 days.` : 'No activity this week.';
      return { ...x, rank: i + 1, call, why };
    });
  }

  // ---------- The tab ----------
  let win = 'week'; let advise = false;
  function view(gid) {
    if (!canSee(gid)) return '<div class="hn-sec"><p class="muted" style="margin:0">Analytics is for the Leader and Co-Leader. The Leader can open it to Elders too.</p></div>';
    const t0 = performance.now();
    const list = stats(gid, win === 'day' ? 'day' : 'week');
    const labels = dayLabels();
    const guildDays = labels.map((_, i) => list.reduce((a, x) => a + x.days[i], 0));
    const gMax = Math.max(1, ...guildDays); const gMin = Math.min(...guildDays.filter((v) => v > 0), gMax) * 0.85;
    const mMax = Math.max(1, ...list.flatMap((x) => x.days));
    const raid = SO.graidTotals(gid);
    const pool = (raid.ground.pool || 0) + (raid.fleet.pool || 0); const dealt = raid.ground.dealt + raid.fleet.dealt;
    const tiles = [
      ['Active this week', `${list.filter((x) => x.active).length} / ${list.length}`],
      ['Guild points', fmt(list.reduce((a, x) => a + x.pts, 0))],
      ['Raid damage', fmt(dealt), pool ? `${Math.min(100, Math.round((dealt / pool) * 100))}% of the raid` : ''],
      [win === 'day' ? 'Chats, 24 hours' : 'Chats, 7 days', fmt(list.reduce((a, x) => a + x.chats, 0))],
    ];
    const heat = `<div class="ga-heat" role="img" aria-label="When the guild plays, busiest days in red">${guildDays.map((v, i) => `<div><i style="background:${heatC(v, gMax, gMin)}"></i><small>${labels[i]}</small></div>`).join('')}</div>
      <div class="ga-key"><span>Quiet</span><i style="background:linear-gradient(90deg,${HEAT.join(',')})"></i><span>Busiest</span></div>`;
    const sorted = list.slice().sort((a, b) => ['leader', 'co', 'elder', 'member'].indexOf(a.r) - ['leader', 'co', 'elder', 'member'].indexOf(b.r) || b.pts - a.pts);
    const members = sorted.map((x) => { const ban = banner(x); return `<div class="ga-m${ban ? ' has-ban' : ''}${x.active ? '' : ' idle'}">${ban ? `<span class="ga-ban" aria-hidden="true">${ban}</span>` : ''}
      <span class="ga-av">${avatar(x)}</span><span class="ga-nm"><b>${esc(Net.name(x.uid))}</b><small>${esc(SO.ROLE_NAME[x.r] || 'Member')} · ${agoTxt(x.seen)}</small></span>
      <span class="ga-days" aria-label="Last 7 days">${x.days.map((v, i) => `<i style="background:${heatC(v, mMax)}" title="${labels[i]}"></i>`).join('')}</span>
      <span class="ga-st"><span><b>${fmt(x.pts)}</b><small>points</small></span><span><b>${fmt(x.raid)}</b><small>raid</small></span><span><b>${fmt(x.don)}</b><small>Beskar</small></span><span><b>${fmt(x.bt7)}</b><small>battles</small></span><span><b>${fmt(x.chats)}</b><small>chats</small></span></span></div>`; }).join('');
    const hs = hints(list, gid);
    const lead = roleNow(gid) === 'leader';
    let adv = '';
    if (canAdvise(gid)) {
      const sw = `<button type="button" class="g-sw ${advise ? 'on' : ''}" data-hn="ga26adv" aria-pressed="${advise}"><i></i>Promotion breakdown</button>`;
      adv = `<div class="hn-sec ga-adv"><div class="ga-advh"><span><b>Promotion breakdown</b><small>Leader and Co-Leader only. Based purely on this week's numbers. It never promotes or demotes anyone by itself.</small></span>${sw}</div>
        ${advise ? `<ol class="ga-rank">${breakdown(list).map((x) => `<li class="${x.call === 'Promote to Elder' ? 'up' : x.call === 'Keep' ? '' : 'down'}"><span class="ga-rn">${x.rank}</span><span class="ga-av sm">${avatar(x)}</span><span class="ga-nm"><b>${esc(Net.name(x.uid))}</b><small>${esc(SO.ROLE_NAME[x.r] || 'Member')} · score ${x.score}</small></span><em>${x.call}</em><p>${esc(x.why)}</p></li>`).join('')}</ol>` : ''}</div>`;
    }
    const html = `<div class="ga">
      <div class="ga-top"><div class="hn-seg ga-seg"><button type="button" class="${win === 'day' ? 'on' : ''}" data-hn="ga26win" data-w="day">24 hours</button><button type="button" class="${win !== 'day' ? 'on' : ''}" data-hn="ga26win" data-w="week">7 days</button></div></div>
      <div class="ga-tiles">${tiles.map(([k, v, d]) => `<div class="ga-tile"><small>${k}</small><b>${v}</b>${d ? `<i>${d}</i>` : ''}</div>`).join('')}</div>
      <div class="hn-sec"><h3>When the guild plays</h3>${heat}</div>
      ${hs.length ? `<div class="hn-sec ga-tips"><h3>Worth a look</h3>${hs.map(([c, t]) => `<p><span class="dot ${c}"></span><span>${t}</span></p>`).join('')}</div>` : ''}
      <div class="hn-sec"><h3>Members · ${list.length}</h3><p class="muted small" style="margin:0 0 4px">Coloured squares are each member's last 7 days, oldest first: red is their busiest day.</p><div class="ga-list">${members}</div></div>
      ${adv}
      ${lead ? `<div class="hn-sec"><div class="g-sws"><span class="g-fix">Leader · Co-leader</span><button type="button" class="g-sw ${eldersOk(gid) ? 'on' : ''}" data-hn="ga26eld" aria-pressed="${eldersOk(gid)}"><i></i>Elders can see analytics</button></div></div>` : ''}
    </div>`;
    HN.__ga26ms = Math.round(performance.now() - t0);
    return html;
  }

  // Add the tab to the guild screen for those who may see it.
  const baseGuild = V.guild;
  V.guild = function () {
    const html = baseGuild.apply(this, arguments);
    const gid = SO.myGuildId();
    if (!gid || !canSee(gid) || typeof html !== 'string' || html.indexOf('class="g-tabs"') < 0) return html;
    const on = SO.gtabNow() === 'stats';
    let out = html.replace(/(<div class="g-tabs"[^>]*>[\s\S]*?)(<\/div>)/, `$1<button type="button" role="tab" class="${on ? 'on' : ''}" aria-selected="${on}" data-hn="gtab" data-t="stats">Analytics</button>$2`);
    if (on) {
      out = out.replace(/(<div class="g-tabs"[^>]*>[\s\S]*?<\/div>)/, (m) => m.replace(/ class="on" aria-selected="true" data-hn="gtab" data-t="(?!stats)/, ' class="" aria-selected="false" data-hn="gtab" data-t="'));
      out = out.replace(/<div class="g-tab" data-tab="[^"]*">[\s\S]*$/, `<div class="g-tab" data-tab="stats">${view(gid)}</div>`);
    }
    return out;
  };
  // Analytics only redraws when you touch it (live chat or donations don't rebuild it).
  CL.ga26win = (b, render) => { win = b.dataset.w === 'day' ? 'day' : 'week'; render(); };
  CL.ga26adv = (b, render) => { const gid = SO.myGuildId(); if (!gid || !canAdvise(gid)) return; advise = !advise; render(); };
  CL.ga26eld = async (b, render) => {
    const gid = SO.myGuildId();
    if (!gid || roleNow(gid) !== 'leader') return toast('Only the leader can change this.');
    const v = !eldersOk(gid);
    if (await SO.writeGuild(gid, { anaPerm: v })) { toast(v ? 'Elders can see Analytics now.' : 'Analytics is back to Leader and Co-Leader only.'); render(); } else toast('Could not save. Try again.');
  };

  const css = `
.ga{display:grid;gap:12px;min-width:0}
.ga *{animation-play-state:paused!important}
.ga-top{display:flex;justify-content:flex-end}
.ga-tiles{display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr))}
.ga-tile{display:grid;gap:2px;padding:10px 12px;border-radius:12px;background:var(--panel-2);border:1px solid var(--line);min-width:0}
.ga-tile small{color:var(--muted);font-size:12px}.ga-tile b{font:800 20px var(--font-display);overflow-wrap:anywhere}.ga-tile i{font-style:normal;font-size:12px;color:#8fe8ff}
.ga-heat{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}.ga-heat div{display:grid;gap:4px;justify-items:center}.ga-heat i{display:block;width:100%;height:clamp(34px,7vw,56px);border-radius:8px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}.ga-heat small{font:700 11px var(--font-display);color:var(--muted)}
.ga-key{display:flex;align-items:center;gap:8px;margin-top:8px;font-size:11px;color:var(--muted)}.ga-key i{flex:1;height:8px;border-radius:99px;max-width:260px}
.ga-tips p{margin:0;display:flex;gap:8px;align-items:baseline;font-size:14px}.ga-tips .dot{width:9px;height:9px;border-radius:50%;flex:none;background:#8fe8ff}.ga-tips .dot.up{background:#4ade80}.ga-tips .dot.down{background:#ff6a5a}
.ga-list{display:grid;gap:6px;content-visibility:auto;contain-intrinsic-size:auto 600px}
.ga-m{position:relative;overflow:hidden;display:grid;grid-template-columns:44px minmax(0,1fr) auto;grid-template-areas:"av nm days" "st st st";gap:6px 10px;align-items:center;padding:8px 10px;border-radius:12px;background:var(--panel-2);border:1px solid var(--line);isolation:isolate}
.ga-m.idle{opacity:.72}
.ga-ban{position:absolute;inset:0;z-index:-1;opacity:.55;pointer-events:none}.ga-ban>*{width:100%;height:100%}.ga-m.has-ban::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(6,12,22,.9),rgba(6,12,22,.55) 60%,rgba(6,12,22,.8))}
.ga-av{grid-area:av;width:44px;height:44px;display:block}.ga-av>*{width:44px!important;height:44px!important}.ga-av.sm,.ga-av.sm>*{width:34px!important;height:34px!important}
.ga-nm{grid-area:nm;display:grid;min-width:0}.ga-nm b{font:800 14px var(--font-display);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 2px rgba(0,0,0,.6)}.ga-nm small{font-size:11.5px;color:#c8d6e4}
.ga-days{grid-area:days;display:grid;grid-template-columns:repeat(7,12px);gap:3px}.ga-days i{display:block;width:12px;height:18px;border-radius:3px}
.ga-st{grid-area:st;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px}.ga-st span{display:grid;justify-items:center;padding:4px 2px;border-radius:8px;background:rgba(4,8,16,.55)}.ga-st b{font:800 13px var(--font-display)}.ga-st small{font-size:10.5px;color:var(--muted)}
@media (min-width:860px){.ga-m{grid-template-columns:44px minmax(140px,1fr) auto minmax(330px,1.4fr);grid-template-areas:"av nm days st"}}
.ga-advh{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap}.ga-advh span{display:grid;gap:2px;min-width:0;flex:1 1 220px}.ga-advh small{color:var(--muted);font-size:12px}
.ga-rank{list-style:none;margin:10px 0 0;padding:0;display:grid;gap:6px}
.ga-rank li{display:grid;grid-template-columns:26px 34px minmax(0,1fr) auto;grid-template-areas:"rn av nm call" "rn av why why";gap:2px 10px;align-items:center;padding:8px 10px;border-radius:12px;background:var(--panel-2);border:1px solid var(--line)}
.ga-rank li.up{border-color:rgba(74,222,128,.55)}.ga-rank li.down{border-color:rgba(255,106,90,.55)}
.ga-rn{grid-area:rn;font:800 15px var(--font-display);color:var(--muted);text-align:center}.ga-rank .ga-av{grid-area:av}.ga-rank .ga-nm{grid-area:nm}
.ga-rank em{grid-area:call;font:800 12px var(--font-display);font-style:normal;padding:3px 9px;border-radius:99px;border:1px solid var(--line);color:var(--muted);white-space:nowrap}.ga-rank li.up em{color:#4ade80;border-color:#4ade80}.ga-rank li.down em{color:#ff8a7a;border-color:#ff8a7a}
.ga-rank p{grid-area:why;margin:0;font-size:12.5px;color:#c8d6e4}
`;
  const s = document.createElement('style'); s.id = 'ga26-css'; s.textContent = css; document.head.appendChild(s);
  try { if (root.UI.App.current === 'holonet') HN.rerender ? HN.rerender() : SO.rerender(); } catch (e) { /* drawn on next open */ }
})(window);
