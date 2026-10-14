// Suggestion box (update 2.1): any player can send an idea, up to 500
// characters. Ideas are stored without a name or id (just the text, the time
// and the player's level) in hn/live/suggestions. A friendly pop-up asks for
// ideas now and then.
(function (root) {
  'use strict';
  // The occasional "Got any suggestions?" pop-up; set to false to retire it.
  const POPUP = true;
  const MAX = 500;
  const DAY_LIMIT = 2;
  const SENT = 'swcg-sugg-day';
  const POPS = 'swcg-sugg-pop';
  const started = Date.now();

  const ls = (k, v) => {
    try {
      if (v === undefined) return localStorage.getItem(k);
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    } catch (e) { /* storage blocked */ }
    return null;
  };
  const UI = () => root.UI;
  const esc = (s) => (UI() ? UI().esc(s) : String(s));
  const toast = (msg) => UI() && UI().toast(msg);
  const on = () => !!(root.Update21 && root.Update21.on());
  const today = () => Math.floor(Date.now() / 86400000);
  const sentToday = () => { try { const d = JSON.parse(ls(SENT) || 'null'); return d && d.day === today() ? d.n : 0; } catch (e) { return 0; } };
  const LIMIT_MSG = "Thanks! You've sent your ideas for today. Come back tomorrow to share more.";

  let safeP = null;
  const loadSafe = () => {
    if (root.Safe) return Promise.resolve(root.Safe);
    if (!safeP) safeP = new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'js/safe.js'; s.onload = () => res(root.Safe); s.onerror = () => { safeP = null; rej(); }; document.head.appendChild(s); });
    return safeP;
  };
  async function fb() {
    if (root.__hnLoadFb && !root.__hnFb) await root.__hnLoadFb();
    if (!root.__hnFb) throw new Error('offline');
    const u = await root.__hnFb.signedIn();
    if (!u) throw new Error('offline');
    return root.__hnFb;
  }

  // Send one idea: the private daily counter goes up in the same write.
  async function send(text) {
    const F = await fb();
    const uid = F.auth.currentUser.uid;
    const lim = F.fs.doc(`hn/live/limits/${uid}`);
    const cur = await lim.get();
    const c = cur.exists ? cur.data() : null;
    const n = c && c.day === today() ? c.n + 1 : 1;
    if (n > DAY_LIMIT) return 'limit';
    const b = F.fs.batch();
    b.set(lim, { day: today(), n });
    b.set(F.fs.collection('hn/live/suggestions').doc(), { text, t: F.firebase.firestore.FieldValue.serverTimestamp(), lvl: (root.Player.state.account.level | 0) || 1 });
    await b.commit();
    ls(SENT, JSON.stringify({ day: today(), n }));
    return 'ok';
  }

  function open() {
    // The limit is only mentioned once someone tries a third time in a day.
    if (sentToday() >= DAY_LIMIT) {
      const lm = UI().openModal(`<div class="sug"><h2>Suggestion box</h2><p class="muted">${LIMIT_MSG}</p><div class="modal-actions"><button type="button" class="btn btn-primary" data-x>OK</button></div></div>`, { small: true });
      lm.root.addEventListener('click', (e) => { if (e.target.closest('[data-x]')) lm.close(); });
      return lm;
    }
    loadSafe().catch(() => {});
    const m = UI().openModal(`<div class="sug">
      <div class="sug-hero">${root.Icons ? root.Icons.svg('holocron') : ''}</div>
      <p class="eyebrow">Suggestion box</p>
      <h2>Got an idea for the game?</h2>
      <p class="muted small">New cards, ships, events, features, fixes: tell us anything. Every idea gets read, and the best ones make it into updates.</p>
      <textarea class="sug-in" data-text maxlength="${MAX}" rows="5" placeholder="My idea is…"></textarea>
      <div class="sug-row"><span class="acct-st" data-st></span><span class="sug-count" data-count>0/${MAX}</span></div>
      <div class="modal-actions"><button type="button" class="btn" data-s="close">Cancel</button><button type="button" class="btn btn-primary" data-s="send" disabled>Send idea</button></div></div>`, { small: true, cls: 'sug-modal' });
    const $ = (q) => m.root.querySelector(q);
    const ta = $('[data-text]');
    const btn = $('[data-s="send"]');
    const st = (msg, bad) => { $('[data-st]').textContent = msg || ''; $('[data-st]').className = `acct-st ${bad ? 'bad' : 'good'}`; };
    setTimeout(() => ta.focus(), 250);
    ta.addEventListener('input', () => { const n = ta.value.length; $('[data-count]').textContent = `${n}/${MAX}`; btn.disabled = ta.value.trim().length < 3; st(''); });
    m.root.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-s]');
      if (!b || b.disabled) return;
      if (b.dataset.s === 'close') return m.close();
      let text = ta.value.trim().slice(0, MAX);
      try {
        const S = await loadSafe();
        const r = S.clean(text);
        if (r.blocked) return st('Keep it friendly, please: reword your idea and try again.', true);
        text = r.text;
      } catch (err) { /* filter unavailable offline: the send fails anyway */ }
      btn.disabled = true; btn.textContent = 'Sending…';
      let r;
      try { r = await send(text); } catch (err) { r = 'error'; }
      btn.textContent = 'Send idea';
      if (r === 'limit') { ls(SENT, JSON.stringify({ day: today(), n: DAY_LIMIT })); return st(LIMIT_MSG, true); }
      if (r !== 'ok') { btn.disabled = false; return st("Couldn't send it right now. Check your connection and try again.", true); }
      m.close();
      toast('Idea sent. Thank you, pilot!');
    });
    return m;
  }

  // Settings section.
  function settingsHtml() {
    if (!on()) return '';
    return `<section class="set-sec"><h3>${root.Icons ? root.Icons.svg('holocron') : ''} Suggestion box</h3>
      <p class="muted small">Got an idea for a card, a ship, an event or anything else? Send it straight to the team.</p>
      <button class="btn" type="button" data-suggest>Share an idea</button></section>`;
  }

  // "Got any suggestions?" at most twice a week, never two days running.
  function maybePop(tries = 0) {
    if (!POPUP || !on()) return;
    const P = root.Player;
    const App = UI() && UI().App;
    if (!P || !P.state || !(P.state.tutorial && P.state.tutorial.done) || !App) return;
    let pops = [];
    try { pops = JSON.parse(ls(POPS) || '[]').filter((t) => Date.now() - t < 7 * 86400000); } catch (e) { pops = []; }
    if (pops.length >= 2 || (pops.length && Date.now() - Math.max(...pops) < 2 * 86400000)) return;
    const busy = App.battleActive || !['home', 'collection', 'market'].includes(App.current) || Date.now() - started < 120000
      || document.querySelector('.app-splash, .modal-backdrop, .tut-intro, .tut-coach, .walkout, .feat-show, .feat-cine, .rank-up, .hc, .code-entry, .inst-banner');
    if (busy) { if (tries < 30) setTimeout(() => maybePop(tries + 1), 30000); return; }
    pops.push(Date.now());
    ls(POPS, JSON.stringify(pops));
    const m = UI().openModal(`<div class="sug sug-pop">
      <div class="sug-hero">${root.Icons ? root.Icons.svg('holocron') : ''}</div>
      <h2>Got any suggestions for the game?</h2>
      <p class="muted small">We'd love to hear your ideas for new cards, ships, events and features.</p>
      <div class="modal-actions"><button type="button" class="btn" data-p="no">Not now</button><button type="button" class="btn btn-primary" data-p="yes">Share an idea</button></div></div>`, { small: true, cls: 'sug-modal' });
    m.root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-p]');
      if (!b) return;
      m.close();
      if (b.dataset.p === 'yes') open();
    });
  }

  // Owner's inbox: tap the game version in Settings five times.
  let taps = [];
  async function inbox() {
    const m = UI().openModal('<div class="sug"><h2>Suggestions</h2><div class="sug-list" data-list><p class="muted small">Loading…</p></div><div class="modal-actions"><button type="button" class="btn btn-primary" data-x>Close</button></div></div>', { cls: 'sug-modal' });
    m.root.addEventListener('click', (e) => { if (e.target.closest('[data-x]')) m.close(); });
    try {
      const F = await fb();
      const snap = await F.fs.collection('hn/live/suggestions').orderBy('t', 'desc').limit(100).get();
      const fmtT = (t) => (t && t.toDate ? t.toDate().toLocaleString('en-US', { timeZone: 'America/Chicago', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' CT' : '');
      const rows = snap.docs.map((d) => { const x = d.data(); return `<div class="sug-item"><small>${esc(fmtT(x.t))} · level ${x.lvl | 0}</small><p>${esc(x.text)}</p></div>`; }).join('');
      m.root.querySelector('[data-list]').innerHTML = rows || '<p class="muted small">No suggestions yet.</p>';
    } catch (e) { m.root.querySelector('[data-list]').innerHTML = '<p class="muted small">Couldn\'t load them. Check your connection.</p>'; }
  }

  function init() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-suggest]')) {
        const mb = e.target.closest('.modal-backdrop');
        if (mb) mb.remove();
        return open();
      }
      if (e.target.closest('[data-ver]')) {
        const now = Date.now();
        taps = taps.filter((t) => now - t < 3000);
        taps.push(now);
        if (taps.length >= 5) { taps = []; const mb = e.target.closest('.modal-backdrop'); if (mb) mb.remove(); inbox(); }
      }
    });
    setTimeout(() => maybePop(), 5000);
  }
  root.Suggest = { open, settingsHtml, inbox, maybePop };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
  else setTimeout(init, 0);
})(window);
