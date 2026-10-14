// Invite friends (update 2.1): share your link or QR code. A friend who opens
// it gets a welcome gift after the tutorial, and once they reach level 5 the
// invite counts for you: 2 Kyber each, the Squadron Leader frame and badge at
// 10 friends, and the limited-time Recruiter Legend frame at 50.
//
// Your invite code is your HoloNet callsign, so you need a saved account and a
// callsign to invite. Counted invites are stored as invites/{friend's id} =
// { by: your id, code, lvl, t } in Firestore; the rules check the code really
// is your callsign.
(function (root) {
  'use strict';
  // The owner sets the end of the 50-friend frame window (null = open).
  const RECRUITER_UNTIL = null;
  const GIFT = { credits: 1000, crystals: 25 };
  const COUNT_LEVEL = 5;
  const KYBER_EACH = 2;
  // Extra rewards on the way from 10 to 50 friends (Kyber, or Aurodium ingots).
  const STEPS = [
    { n: 15, crystals: 15 }, { n: 20, aurodium: 3 }, { n: 25, crystals: 25 }, { n: 30, aurodium: 5 },
    { n: 35, crystals: 35 }, { n: 40, aurodium: 8 }, { n: 45, crystals: 50 },
  ];
  const stepText = (x) => (x.crystals ? `${x.crystals} Kyber` : `${x.aurodium} Aurodium`);
  const PENDING = 'swcg-invite';
  const CHECKED = 'swcg-invite-checked';
  const code = () => String.fromCharCode(83, 81, 85, 65, 68, 82, 79, 78, 53, 48);

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
  const fmt = (n) => (UI() ? UI().fmt(n) : String(n));
  const on = () => !!(root.Update21 && root.Update21.on());
  const keyOf = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanCode = (t) => String(t || '').replace(/[^A-Za-z0-9_ .-]/g, '').trim().slice(0, 16);
  const recruiterOpen = () => RECRUITER_UNTIL == null || Date.now() < RECRUITER_UNTIL;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const standalone = () => (root.matchMedia && root.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;

  // ---------- the link: ?invite=Callsign ----------
  // Saved right away (the save itself isn't loaded yet) and taken out of the address bar.
  try {
    const u = new URL(location.href);
    const c = cleanCode(u.searchParams.get('invite'));
    if (c && keyOf(c).length >= 3) {
      ls(PENDING, c);
      u.searchParams.delete('invite');
      history.replaceState(null, '', u.pathname + (u.search || '') + u.hash);
    }
  } catch (e) { /* old browser */ }

  async function fb() {
    if (root.__hnLoadFb && !root.__hnFb) await root.__hnLoadFb();
    if (!root.__hnFb) throw new Error('offline');
    const u = await root.__hnFb.signedIn();
    if (!u) throw new Error('offline');
    return root.__hnFb;
  }
  // Whose callsign is this? (null = nobody has it, undefined = couldn't check)
  async function owner(key) {
    try {
      const F = await fb();
      const d = await F.fs.doc(`hn/live/names/${key}`).get();
      return d.exists ? d.data().uid : null;
    } catch (e) { return undefined; }
  }

  const P = () => root.Player;
  const st = () => P() && P().state;
  const fresh = () => { const s = st(); return !!s && !(s.tutorial && s.tutorial.done) && ((s.account && s.account.level) || 1) <= 2; };

  // ---------- the invited friend ----------
  // A new player arriving from a link: welcome them (and offer the app) before the tutorial.
  function adopt() {
    const s = st();
    const c = ls(PENDING);
    if (!s || !c) return false;
    ls(PENDING, null);
    if (s.invite || !fresh()) return false;
    s.invite = { code: c, key: keyOf(c), gift: false, counted: false };
    P().save();
    return true;
  }

  function welcome(done) {
    // After the loading screen.
    const sp = document.querySelector('.app-splash');
    if (sp && !sp.classList.contains('out')) { setTimeout(() => welcome(done), 400); return; }
    const s = st();
    const inv = s.invite;
    const canInstall = root.Install && root.Install.available && root.Install.available();
    const m = UI().openModal(`<div class="inv inv-welcome">
      <div class="inv-hero">${root.Icons ? root.Icons.svg('starbird') : ''}</div>
      <p class="eyebrow">You've been invited</p>
      <h2>${esc(inv.code)} wants you in their squadron!</h2>
      <p class="muted">Finish the training mission to claim your welcome gift: <b>${fmt(GIFT.credits)} credits</b> and <b>${GIFT.crystals} Kyber</b>.</p>
      ${canInstall ? `<div class="inv-app">
        <img src="icons/icon-192.png" alt="">
        <div><b>Get the app first</b><span>Launch in one tap from your home screen, play full screen, keep playing offline, and keep your progress safe on this device.</span></div>
      </div>
      ${isIOS && on() ? `<p class="muted small inv-ios">On iPhone and iPad the app starts fresh, so open it and enter the invite code <b>${esc(inv.code)}</b> when it asks.</p>` : ''}` : ''}
      <div class="modal-actions">${canInstall ? '<button type="button" class="btn" data-w="play">Play here</button><button type="button" class="btn btn-primary" data-w="app">Install the app</button>' : '<button type="button" class="btn btn-primary" data-w="play">Start playing</button>'}</div></div>`, { small: true, dismissable: false, cls: 'inv-modal' });
    m.root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-w]');
      if (!b) return;
      if (b.dataset.w === 'app') root.Install.prompt();
      m.close();
      done();
    });
  }

  // iPhone/iPad app opened for the first time: the link's invite didn't come along, so ask.
  function askCode(done) {
    const m = UI().openModal(`<div class="inv">
      <p class="eyebrow">Welcome, pilot</p>
      <h2>Did a friend invite you?</h2>
      <p class="muted small">Enter their invite code (their callsign) to get a welcome gift after training.</p>
      <input class="acct-in" data-code maxlength="16" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Invite code">
      <p class="acct-st" data-st></p>
      <div class="modal-actions"><button type="button" class="btn" data-c="skip">No thanks</button><button type="button" class="btn btn-primary" data-c="ok">Claim</button></div></div>`, { small: true, dismissable: false, cls: 'inv-modal' });
    const $ = (q) => m.root.querySelector(q);
    m.root.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-c]');
      if (!b || b.disabled) return;
      if (b.dataset.c === 'skip') { m.close(); return done(); }
      const c = cleanCode($('[data-code]').value);
      if (keyOf(c).length < 3) { $('[data-st]').textContent = 'Codes are at least 3 letters or numbers.'; $('[data-st]').className = 'acct-st bad'; return; }
      b.disabled = true; b.textContent = 'Checking…';
      const who = await owner(keyOf(c));
      b.disabled = false; b.textContent = 'Claim';
      if (who === null) { $('[data-st]').textContent = `No pilot has the code "${c}". Check the spelling.`; $('[data-st]').className = 'acct-st bad'; return; }
      ls(PENDING, c);
      adopt();
      m.close();
      toast(`Invite from ${c} saved. Finish training for your gift!`);
      done();
    });
  }

  // The tutorial waits for the welcome.
  const T = root.Tutorial;
  if (T && T.start) {
    const start = T.start;
    T.start = function () {
      const self = this;
      const args = arguments;
      const go = () => start.apply(self, args);
      if (self.active || !UI() || !st()) return go();
      if (adopt()) return welcome(go);
      if (on() && standalone() && fresh() && !st().invite && !ls('swcg-invite-asked')) { ls('swcg-invite-asked', '1'); return askCode(go); }
      return go();
    };
  }

  // Training done (or skipped): the welcome gift, once the code checks out.
  let gifting = false;
  async function giftMaybe(tries = 0) {
    const s = st();
    const inv = s && s.invite;
    if (!inv || inv.gift || gifting || !(s.tutorial && s.tutorial.done)) return;
    const App = UI() && UI().App;
    if (!App || App.battleActive || document.querySelector('.app-splash, .modal-backdrop, .tut-intro, .tut-coach, .walkout, .feat-show, .feat-cine, .rank-up')) {
      if (tries < 60) setTimeout(() => giftMaybe(tries + 1), 3000);
      return;
    }
    gifting = true;
    const who = await owner(inv.key);
    gifting = false;
    if (who === undefined) { if (tries < 60) setTimeout(() => giftMaybe(tries + 1), 15000); return; }
    if (who === null) { inv.gift = true; inv.bad = true; P().save(); return; }
    inv.gift = true;
    inv.by = who;
    s.credits += GIFT.credits;
    s.crystals += GIFT.crystals;
    P().save();
    if (UI().updateWallet) UI().updateWallet();
    if (root.Sound) root.Sound.play('coins');
    const m = UI().openModal(`<div class="inv inv-gift">
      <div class="inv-hero gold">${root.Icons ? root.Icons.svg('crate') : ''}</div>
      <p class="eyebrow">Welcome to the galaxy</p>
      <h2>Thanks for joining, pilot!</h2>
      <p class="muted">${esc(inv.code)} brought you in. Here's a welcome gift from your friends at Galactic Card Battles:</p>
      <div class="inv-loot"><span>${UI().cur('credits', GIFT.credits)}</span><span>${UI().cur('crystals', GIFT.crystals)}</span></div>
      <p class="muted small">Reach level ${COUNT_LEVEL} to thank ${esc(inv.code)} with a reward of their own.</p>
      <div class="modal-actions"><button type="button" class="btn btn-primary" data-ok>Let's go</button></div></div>`, { small: true, cls: 'inv-modal' });
    m.root.addEventListener('click', (e) => { if (e.target.closest('[data-ok]')) m.close(); });
  }

  // Level 5: the invite counts for the friend who sent it.
  let counting = false;
  async function countMaybe() {
    const s = st();
    const inv = s && s.invite;
    if (!inv || inv.counted || inv.bad || counting || ((s.account && s.account.level) || 1) < COUNT_LEVEL) return;
    counting = true;
    try {
      const F = await fb();
      const me = F.auth.currentUser.uid;
      const by = inv.by || (await owner(inv.key));
      if (by === null) { inv.bad = true; P().save(); return; }
      if (!by || by === me) { if (by === me) { inv.bad = true; P().save(); } return; }
      const ref = F.fs.doc(`invites/${me}`);
      const d = await ref.get();
      if (!d.exists) await ref.set({ by, code: inv.key, lvl: s.account.level, t: F.firebase.firestore.FieldValue.serverTimestamp() });
      inv.counted = true;
      P().save();
    } catch (e) { /* offline: tries again next time */ } finally { counting = false; }
  }

  // ---------- the inviter ----------
  const inv0 = () => { const s = st(); if (!s.invites) s.invites = { paid: 0, n: 0 }; return s.invites; };
  // Count invites that reached level 5 and pay out the new ones.
  async function sync(force) {
    const m = root.Account && root.Account.meta();
    if (!on() || !m) return null;
    const last = Number(ls(CHECKED) || 0);
    if (!force && Date.now() - last < 3600000) return inv0().n;
    try {
      const F = await fb();
      const u = F.auth.currentUser;
      if (!u || u.uid !== m.uid) return null;
      const snap = await F.fs.collection('invites').where('by', '==', u.uid).get();
      ls(CHECKED, String(Date.now()));
      const n = snap.size;
      const iv = inv0();
      iv.n = n;
      const added = Math.max(0, n - (iv.paid || 0));
      const won = [];
      if (added) { iv.paid = n; st().crystals += added * KYBER_EACH; won.push(`${added} friend${added === 1 ? '' : 's'} reached level ${COUNT_LEVEL}: +${added * KYBER_EACH} Kyber`); }
      if (n >= 10 && !iv.squad) { iv.squad = true; won.push('Squadron Leader frame and badge unlocked!'); }
      for (const x of STEPS) {
        if (n < x.n || (iv.step || 0) >= x.n) continue;
        iv.step = x.n;
        st().crystals += x.crystals || 0;
        st().aurodium = (st().aurodium || 0) + (x.aurodium || 0);
        won.push(`${x.n} friends: +${stepText(x)}`);
      }
      if (n >= 50 && !iv.recruiter && recruiterOpen()) { iv.recruiter = true; won.push('Recruiter Legend frame unlocked!'); }
      if (added || won.length) { P().save(); if (UI().updateWallet) UI().updateWallet(); }
      if (won.length) { toast(won.join(' · ')); if (iv.squad && UI().celebrateFeat) setTimeout(() => UI().celebrateFeat('squadron'), 1500); }
      return n;
    } catch (e) { return null; }
  }

  function linkFor(tag) {
    const base = location.protocol === 'file:' ? 'https://starwarsgalacticbattle.com/' : `${location.origin}${location.pathname}`;
    return `${base}?invite=${encodeURIComponent(tag)}`;
  }
  let qrP = null;
  const loadQr = () => {
    if (root.qrcode) return Promise.resolve();
    if (!qrP) qrP = new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = 'js/qr.js'; sc.onload = res; sc.onerror = () => { qrP = null; rej(); }; document.head.appendChild(sc); });
    return qrP;
  };
  function qrSvg(text) {
    const q = root.qrcode(0, 'M');
    q.addData(text);
    q.make();
    return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  }

  async function open() {
    const m0 = root.Account && root.Account.meta();
    if (!m0) { toast('Save your game to an account first, so your invites follow you.'); return root.Account && root.Account.offer(true); }
    const prof = st().hn && st().hn.prof;
    if (!prof || !prof.key || !prof.tag) {
      const ok = await UI().confirmBox('Pick your callsign first', 'Your callsign is your invite code, so friends know who brought them in.', 'Set up profile');
      if (ok && root.Account.profile) root.Account.profile();
      return;
    }
    const link = linkFor(prof.tag);
    const iv = inv0();
    const bar = (n, need) => `<i class="inv-bar"><i style="width:${Math.min(100, (n / need) * 100)}%"></i></i>`;
    const m = UI().openModal(`<div class="inv inv-share">
      <p class="eyebrow">Invite friends</p>
      <h2>Build your squadron</h2>
      <p class="muted small">Your invite code is <b>${esc(prof.tag)}</b>. Friends get <b>${fmt(GIFT.credits)} credits</b> and <b>${GIFT.crystals} Kyber</b> after training. When they reach level ${COUNT_LEVEL}, you get rewards too.</p>
      <div class="inv-qr" data-qr><span class="muted small">Making your QR code…</span></div>
      <div class="inv-link"><input class="acct-in" readonly value="${esc(link)}" data-link><button type="button" class="btn btn-small" data-i="copy">Copy</button></div>
      <button type="button" class="btn btn-primary inv-sharebtn" data-i="share">Share my invite</button>
      <div class="inv-goals">
        <p class="eyebrow">Friends who reached level ${COUNT_LEVEL}: <b data-n>${iv.n || 0}</b></p>
        <div class="inv-goal"><b>Every friend</b><span>+${KYBER_EACH} Kyber</span></div>
        <div class="inv-goal ${iv.squad ? 'done' : ''}"><b>10 friends</b><span>Squadron Leader frame + badge${iv.squad ? ' ✓' : ''}</span>${bar(iv.n || 0, 10)}</div>
        ${STEPS.map((x) => `<div class="inv-goal small ${(iv.step || 0) >= x.n ? 'done' : ''}"><b>${x.n} friends</b><span>+${stepText(x)}${(iv.step || 0) >= x.n ? ' ✓' : ''}</span></div>`).join('')}
        <div class="inv-goal ${iv.recruiter ? 'done' : ''}"><b>50 friends</b><span>Recruiter Legend frame${iv.recruiter ? ' ✓' : recruiterOpen() ? ` · limited time${RECRUITER_UNTIL ? ` (until ${new Date(RECRUITER_UNTIL).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})` : ''}` : ' · no longer available'}</span>${bar(iv.n || 0, 50)}</div>
      </div>
      <div class="modal-actions"><button type="button" class="btn" data-i="close">Close</button></div></div>`, { small: true, cls: 'inv-modal' });
    const $ = (q) => m.root.querySelector(q);
    loadQr().then(() => { const q = $('[data-qr]'); if (q) q.innerHTML = qrSvg(link); }).catch(() => { const q = $('[data-qr]'); if (q) q.innerHTML = '<span class="muted small">Couldn\'t make the QR code offline. Share the link instead.</span>'; });
    sync(true).then((n) => { const e = $('[data-n]'); if (e && n != null) e.textContent = n; });
    m.root.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-i]');
      if (!b) return;
      if (b.dataset.i === 'close') return m.close();
      if (b.dataset.i === 'copy') {
        try { await navigator.clipboard.writeText(link); toast('Invite link copied.'); } catch (err) { const i = $('[data-link]'); i.select(); toast('Select the link and copy it.'); }
        return;
      }
      if (b.dataset.i === 'share') {
        const text = `Join my squadron in Galactic Card Battles! Use my code ${prof.tag} for 1,000 credits and 25 Kyber.`;
        if (navigator.share) { try { await navigator.share({ title: 'Galactic Card Battles', text, url: link }); } catch (err) { /* closed */ } } else { try { await navigator.clipboard.writeText(`${text} ${link}`); toast('Invite copied. Paste it anywhere.'); } catch (err) { toast('Copy the link above to share it.'); } }
      }
    });
  }

  // ---------- frames, badge, hooks ----------
  function init() {
    const H = UI() && UI().hooks;
    if (!H || !P()) return;
    H.feats.push((s) => (s.invites && s.invites.squad) || on() ? [{ id: 'squadron', icon: 'starbird', tier: 3, name: 'Squadron Leader', desc: 'Invite 10 friends who reach level 5', have: Math.min(10, (s.invites && s.invites.squad) ? 10 : (s.invites && s.invites.n) || 0), need: 10 }] : []);
    // Owner's test code: both invite frames and the badge.
    const before = H.redeem;
    H.redeem = (c) => {
      if (c !== code()) return before ? before(c) : false;
      const iv = inv0();
      iv.squad = true; iv.recruiter = true;
      P().save();
      toast('Squadron Leader and Recruiter Legend unlocked for testing.');
      return true;
    };
    // Level 5 for invited players.
    const gain = P().gainXp;
    P().gainXp = function () { const r = gain.apply(this, arguments); if (this.state.invite && !this.state.invite.counted) setTimeout(countMaybe, 0); return r; };
    const fin = P().finishTutorial;
    P().finishTutorial = function () { const r = fin.apply(this, arguments); setTimeout(() => giftMaybe(), 1500); return r; };
    giftMaybe();
    countMaybe();
    if (on() && root.Account && root.Account.meta()) setTimeout(() => sync(), 8000);
  }
  root.Invite = { open, sync, on, recruiterOpen, linkFor };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
  else setTimeout(init, 0);
})(window);
