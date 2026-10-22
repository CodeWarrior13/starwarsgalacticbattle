// Saved accounts: sign in with Google or an email and password to keep your
// game in the cloud and play it on any device. Optional; without it the game
// saves in this browser as before.
//
// The cloud save is one private document per account, accounts/{uid} in
// Firestore: the same save the browser keeps (cards, currencies, progress,
// and the HoloNet with its callsign and picture), stored as a string with a
// revision number. Each device uploads a few seconds after you play and checks
// for a newer save from another device when the game opens.
(function (root) {
  'use strict';
  // Update 2.1 goes live for everyone at 7:05 a.m. Central on Wednesday,
  // October 21, 2026; until then only tester devices see it.
  const RELEASE = root.__v21Test != null ? root.__v21Test : Date.UTC(2026, 9, 21, 12, 5, 0);
  const released = () => Date.now() >= RELEASE;
  const SAVE_KEY = 'swcg-save-v1';
  const META = 'swcg-acct';
  const DIRTY = 'swcg-acct-dirty';
  const ASKED = 'swcg-acct-asked';
  const DEV = 'swcg-dev';
  const TEST = 'acct-test';
  const code = () => String.fromCharCode(72, 79, 76, 79, 83, 65, 86, 69, 50, 49);
  const UPLOAD_MS = 8000;

  const ls = (k, v) => {
    try {
      if (v === undefined) return localStorage.getItem(k);
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    } catch (e) { /* storage blocked */ }
    return null;
  };
  const enabled = () => released() || ls(TEST) === '1';
  const meta = () => { try { return JSON.parse(ls(META) || 'null'); } catch (e) { return null; } };
  const setMeta = (m) => ls(META, m ? JSON.stringify(m) : null);
  const devId = () => {
    let d = ls(DEV);
    if (!d) { d = `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`; ls(DEV, d); }
    return d;
  };
  const UI = () => root.UI;
  const esc = (s) => (UI() ? UI().esc(s) : String(s));
  const toast = (msg) => UI() && UI().toast(msg);
  const fmtN = (n) => (UI() ? UI().fmt(n) : String(n));
  const ago = (ms) => {
    if (!ms) return 'never';
    const s = Math.max(0, (Date.now() - ms) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.round(s / 60)} min ago`;
    if (s < 86400) return `${Math.round(s / 3600)} h ago`;
    return new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const sum = (raw) => {
    try {
      const s = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return { lvl: (s.account && s.account.level) || 1, cards: Object.keys(s.units || {}).length, credits: s.credits || 0, tag: (s.hn && s.hn.prof && s.hn.prof.tag) || '' };
    } catch (e) { return { lvl: 1, cards: 0, credits: 0, tag: '' }; }
  };

  // ---------- Firebase ----------
  let fbP = null;
  async function fb() {
    if (root.__hnFb) { await root.__hnFb.signedIn(); return root.__hnFb; }
    if (!fbP) {
      fbP = (async () => {
        if (root.__hnLoadFb) await root.__hnLoadFb();
        if (!root.__hnFb) throw new Error('offline');
        return root.__hnFb;
      })();
      fbP.catch(() => { fbP = null; });
    }
    const F = await fbP;
    await F.signedIn();
    return F;
  }
  const ref = (F, uid) => F.fs.doc(`accounts/${uid}`);
  const provOf = (u) => ((u.providerData || []).some((p) => p && p.providerId === 'google.com') ? 'google' : 'email');
  const errMsg = (e) => {
    const c = (e && e.code) || '';
    if (c === 'auth/email-already-in-use') return 'That email already has an account. Use Log in instead.';
    if (c === 'auth/invalid-email') return "That doesn't look like an email address.";
    if (c === 'auth/weak-password') return 'Pick a longer password: at least 6 characters.';
    if (['auth/wrong-password', 'auth/user-not-found', 'auth/invalid-credential', 'auth/invalid-login-credentials'].includes(c)) return "That email and password don't match an account.";
    if (c === 'auth/too-many-requests') return 'Too many tries. Wait a few minutes, then try again.';
    if (c === 'auth/network-request-failed' || (e && e.message === 'offline')) return "Couldn't connect. Check your internet and try again.";
    if (c === 'auth/operation-not-allowed') return 'This sign-in option isn’t switched on yet.';
    if (c === 'auth/requires-recent-login') return 'For your safety, sign out and back in, then try again.';
    return "Something went wrong. Try again in a moment.";
  };

  // ---------- signing in ----------
  // A guest on this device becomes the account (same id, so the HoloNet comes
  // with it). If the Google account or email already has a save, you sign in
  // to that one instead and choose which progress to keep.
  // The Google window has to open straight from the tap (browsers block it
  // otherwise), so Firebase is preloaded whenever these buttons are on screen.
  const preload = () => { fb().catch(() => {}); };
  async function google() {
    const ready = root.__hnFb && root.__hnFb.auth.currentUser;
    const F = ready ? root.__hnFb : await fb();
    const p = new F.firebase.auth.GoogleAuthProvider();
    p.setCustomParameters({ prompt: 'select_account' });
    const u = F.auth.currentUser;
    try {
      if (u && u.isAnonymous) return await finish((await u.linkWithPopup(p)).user, 'linked');
      return await finish((await F.auth.signInWithPopup(p)).user, 'signin');
    } catch (e) {
      if (e.code === 'auth/credential-already-in-use' && e.credential) return finish((await F.auth.signInWithCredential(e.credential)).user, 'signin');
      if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') return 'cancel';
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') {
        ls('swcg-acct-redirect', '1');
        if (u && u.isAnonymous) await u.linkWithRedirect(p);
        else await F.auth.signInWithRedirect(p);
        return 'redirect';
      }
      throw e;
    }
  }
  async function afterRedirect() {
    if (ls('swcg-acct-redirect') !== '1') return;
    ls('swcg-acct-redirect', null);
    const F = await fb();
    try {
      const r = await F.auth.getRedirectResult();
      if (r && r.user && !r.user.isAnonymous) await finish(r.user, r.operationType === 'link' ? 'linked' : 'signin');
    } catch (e) {
      if (e.code === 'auth/credential-already-in-use' && e.credential) await finish((await F.auth.signInWithCredential(e.credential)).user, 'signin');
      else toast(errMsg(e));
    }
  }
  async function emailCreate(email, pw) {
    const F = await fb();
    const u = F.auth.currentUser;
    if (u && u.isAnonymous) {
      const cred = F.firebase.auth.EmailAuthProvider.credential(email, pw);
      return finish((await u.linkWithCredential(cred)).user, 'linked');
    }
    return finish((await F.auth.createUserWithEmailAndPassword(email, pw)).user, 'linked');
  }
  async function emailLogin(email, pw) {
    const F = await fb();
    return finish((await F.auth.signInWithEmailAndPassword(email, pw)).user, 'signin');
  }
  async function resetPw(email) {
    const F = await fb();
    await F.auth.sendPasswordResetEmail(email);
  }

  // Signed in: link this device's game to the account, or load the account's.
  async function finish(user, how) {
    await user.getIdToken(true);
    const F = await fb();
    const m = { uid: user.uid, email: user.email || '', prov: provOf(user), rev: 0, at: 0 };
    let cloud = null;
    try { const d = await ref(F, user.uid).get(); cloud = d.exists ? d.data() : null; } catch (e) { cloud = null; }
    if (!cloud) {
      setMeta(m);
      markLinked();
      await upload(true);
      celebrate(m, how === 'linked');
      return 'ok';
    }
    // The account already has a saved game.
    const here = sum(ls(SAVE_KEY) || '{}');
    const there = sum(cloud.save);
    const fresh = here.lvl <= 2 && here.cards <= 12;
    const pick = fresh ? 'cloud' : await choose(there, cloud.ms, here);
    m.rev = cloud.rev;
    setMeta(m);
    if (pick === 'cloud') { applyCloud(cloud, `Welcome back! Loading your saved game (level ${there.lvl}).`); return 'ok'; }
    markLinked();
    await upload(true);
    celebrate(m, false);
    return 'ok';
  }

  function choose(there, ms, here) {
    return new Promise((resolve) => {
      const m = UI().openModal(`<div class="acct">
        <h2>This account already has a saved game</h2>
        <p class="muted small">Pick the progress to keep. The other one is replaced.</p>
        <div class="acct-pick">
          <button type="button" class="acct-opt on" data-pick="cloud"><b>Saved account</b><span>Level ${there.lvl} · ${there.cards} cards · ${fmtN(there.credits)} credits${there.tag ? ` · ${esc(there.tag)}` : ''}</span><small>Last saved ${esc(ago(ms))}</small></button>
          <button type="button" class="acct-opt" data-pick="device"><b>This device</b><span>Level ${here.lvl} · ${here.cards} cards · ${fmtN(here.credits)} credits${here.tag ? ` · ${esc(here.tag)}` : ''}</span><small>Playing now</small></button>
        </div>
        <div class="modal-actions"><button type="button" class="btn btn-primary" data-ok>Keep the saved account</button></div></div>`, { small: true, dismissable: false });
      let pick = 'cloud';
      m.root.addEventListener('click', (e) => {
        const o = e.target.closest('[data-pick]');
        if (o) {
          pick = o.dataset.pick;
          m.root.querySelectorAll('[data-pick]').forEach((n) => n.classList.toggle('on', n === o));
          m.root.querySelector('[data-ok]').textContent = pick === 'cloud' ? 'Keep the saved account' : "Keep this device's progress";
          return;
        }
        if (e.target.closest('[data-ok]')) { m.close(); resolve(pick); }
      });
    });
  }

  // Saving to an account earns the Holo Link frame and the Never Lost badge.
  function markLinked() {
    const P = root.Player;
    if (!P || !P.state || P.state.linked) return;
    P.state.linked = { at: Date.now() };
    P.save();
  }
  const CREST = () => `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="nlg" cx=".5" cy=".38" r=".7"><stop offset="0" stop-color="#1d3f7a"/><stop offset="1" stop-color="#081633"/></radialGradient></defs>
    <circle cx="50" cy="50" r="44" fill="url(#nlg)" stroke="#8fd3ff" stroke-width="4"/>
    <g fill="none" stroke-width="7" stroke-linecap="round" transform="rotate(-45 50 50)">
      <rect x="22" y="40" width="34" height="20" rx="10" stroke="#ea4335"/><rect x="44" y="40" width="34" height="20" rx="10" stroke="#4285f4"/>
      <path d="M44 40 h12" stroke="#fbbc05"/><path d="M44 60 h12" stroke="#34a853"/>
    </g></svg>`;

  // ---------- syncing ----------
  let applying = false;
  function applyCloud(c, msg) {
    applying = true;
    ls(SAVE_KEY, c.save);
    ls(DIRTY, null);
    const m = meta();
    if (m) { m.rev = c.rev; m.at = c.ms; setMeta(m); }
    if (msg) ls('swcg-acct-msg', msg);
    if (UI() && UI().App) UI().App.battleActive = false;
    location.reload();
  }

  let timer = 0;
  let busy = false;
  let state = 'idle';
  let seq = 0;
  function changed() {
    if (applying || !meta()) return;
    seq += 1;
    ls(DIRTY, '1');
    clearTimeout(timer);
    timer = setTimeout(() => upload(), UPLOAD_MS);
  }
  async function upload(force) {
    const m = meta();
    if (!m || busy || applying) return false;
    busy = true;
    clearTimeout(timer);
    state = 'saving'; paint();
    try {
      const F = await fb();
      const u = F.auth.currentUser;
      if (!u || u.uid !== m.uid || u.isAnonymous) { lost(); return false; }
      const raw = ls(SAVE_KEY);
      if (!raw) return false;
      const mine = seq;
      const ms = Date.now();
      const lvl = (root.Player && root.Player.state && root.Player.state.account.level) | 0;
      const r = ref(F, m.uid);
      const out = await F.fs.runTransaction(async (tx) => {
        const d = await tx.get(r);
        const c = d.exists ? d.data() : null;
        if (c && !force && c.rev > (m.rev || 0) && c.dev !== devId()) return { conflict: c };
        const rev = c ? c.rev + 1 : 1;
        tx.set(r, { save: raw, rev, ms, dev: devId(), lvl, v: 1, t: F.firebase.firestore.FieldValue.serverTimestamp() });
        return { rev };
      });
      if (out.conflict) { state = 'idle'; await conflict(out.conflict); return false; }
      const nm = meta();
      if (nm && nm.uid === m.uid) { nm.rev = out.rev; nm.at = ms; setMeta(nm); }
      // Played on while it uploaded: send the newer save too.
      if (seq === mine) ls(DIRTY, null);
      else timer = setTimeout(() => upload(), UPLOAD_MS);
      state = 'saved';
      return true;
    } catch (e) {
      state = 'offline';
      clearTimeout(timer);
      timer = setTimeout(() => upload(), 60000);
      return false;
    } finally {
      busy = false;
      paint();
    }
  }
  // Played on two devices without syncing in between: ask which to keep.
  async function conflict(c) {
    const pick = await choose(sum(c.save), c.ms, sum(ls(SAVE_KEY) || '{}'));
    if (pick === 'cloud') return applyCloud(c, 'Loaded your saved game.');
    const m = meta();
    if (m) { m.rev = c.rev; setMeta(m); }
    return upload(true);
  }
  // Signed out somewhere else (or the sign-in expired): keep playing on this device.
  function lost() {
    setMeta(null);
    ls(DIRTY, null);
    state = 'idle';
    toast('You were signed out of your saved account. Sign in again in Settings to keep saving.');
  }
  let recheck = false;
  async function check() {
    const m = meta();
    if (!m || applying) return;
    // Never reload in the middle of a battle: look again afterwards.
    if (UI() && UI().App && UI().App.battleActive) { recheck = true; return; }
    try {
      const F = await fb();
      const u = F.auth.currentUser;
      if (!u || u.uid !== m.uid || u.isAnonymous) return lost();
      const d = await ref(F, m.uid).get({ source: 'server' });
      if (!d.exists) return upload(true);
      const c = d.data();
      if (c.rev > (m.rev || 0) && c.dev !== devId()) {
        if (ls(DIRTY) === '1') return conflict(c);
        return applyCloud(c, `Synced: loaded your latest save (level ${sum(c.save).lvl}).`);
      }
      if (ls(DIRTY) === '1') upload();
      else { state = 'saved'; paint(); }
    } catch (e) { state = 'offline'; paint(); }
  }

  // ---------- sign out / delete ----------
  async function signOut() {
    const m = meta();
    if (!m) return;
    const ok = await UI().confirmBox('Sign out?', `Your progress is saved to ${m.email || 'your account'}. This device starts a new game, and signing in again brings everything back.`, 'Sign out');
    if (!ok) return;
    if (!(await upload())) {
      if (meta()) return toast("Couldn't save your latest progress. Connect to the internet, then sign out.");
    }
    const F = await fb();
    setMeta(null);
    ls(DIRTY, null);
    try { await F.auth.signOut(); } catch (e) { /* signed out locally anyway */ }
    root.Player.startOver();
    applying = true;
    try { for (const k of Object.keys(localStorage)) if (k.startsWith('swcg-') && ![SAVE_KEY, 'swcg-battle-prefs', DEV, ASKED].includes(k)) localStorage.removeItem(k); } catch (e) { /* ignore */ }
    ls('swcg-acct-msg', 'Signed out. Sign in from Settings any time to load your saved game.');
    location.reload();
  }
  async function del() {
    const m = meta();
    if (!m) return;
    const ok = await typed('Delete your saved account?', `The cloud save for ${m.email || 'this account'} is deleted for good, and your callsign is freed up. Your progress stays on this device only.`, 'DELETE');
    if (!ok) return;
    try {
      const F = await fb();
      const u = F.auth.currentUser;
      const key = root.Player.state.hn && root.Player.state.hn.prof && root.Player.state.hn.prof.key;
      if (key) { try { await F.fs.doc(`hn/live/names/${key}`).delete(); } catch (e) { /* not ours */ } root.Player.state.hn.prof = { ...root.Player.state.hn.prof, tag: '', key: '', kuid: '' }; }
      await ref(F, m.uid).delete();
      await u.delete();
      applying = true;
      setMeta(null);
      ls(DIRTY, null);
      root.Player.save();
      ls('swcg-acct-msg', 'Your saved account was deleted. Your progress is still on this device.');
      location.reload();
    } catch (e) { applying = false; toast(errMsg(e)); }
  }
  function typed(title, body, word) {
    return new Promise((resolve) => {
      let answered = false;
      const m = UI().openModal(`<h2>${esc(title)}</h2><p class="muted">${esc(body)}</p>
        <label class="reset-lbl"><span>Type <b>${word}</b> to confirm</span><input class="reset-in" data-in autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="${word.length}"></label>
        <div class="modal-actions"><button type="button" class="btn btn-primary" data-a="no">Keep it</button><button type="button" class="btn btn-danger" data-a="yes" disabled>Delete</button></div>`, { small: true, onClose: () => { if (!answered) resolve(false); } });
      const yes = m.root.querySelector('[data-a="yes"]');
      m.root.addEventListener('input', (e) => { if (e.target.matches('[data-in]')) yes.disabled = e.target.value.trim().toUpperCase() !== word; });
      m.root.addEventListener('click', (e) => {
        const a = e.target.closest('[data-a]');
        if (!a || a.disabled) return;
        answered = true; m.close(); resolve(a.dataset.a === 'yes');
      });
    });
  }

  // ---------- screens ----------
  const G_ICON = '<svg class="acct-g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  const choices = () => `<div class="acct-btns">
      <button type="button" class="btn acct-google" data-acct="google">${G_ICON}<span>Continue with Google</span></button>
      <button type="button" class="btn acct-mail" data-acct="email">Use email and password</button>
    </div>`;

  async function run(fn, btn) {
    const label = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Connecting…'; }
    try { return await fn(); } catch (e) { toast(errMsg(e)); return 'error'; } finally { if (btn && btn.isConnected) { btn.disabled = false; btn.innerHTML = label; } }
  }

  // "Enjoying the game?" Shown once, and the same choices live in Settings.
  function offer(fromSettings) {
    const m = UI().openModal(`<div class="acct acct-offer">
      <div class="acct-hero">${root.Icons ? root.Icons.svg('holocron') : ''}</div>
      <p class="eyebrow">Save your game</p>
      <h2>Enjoying the game?</h2>
      <p class="muted">Save your progress to an account and play on any device: your phone, tablet or computer. Your cards, currencies, campaign and HoloNet all come with you.</p>
      ${choices()}
      <p class="muted small acct-fine">Free and optional. Already saved on another device? Sign in with the same account to load it.</p>
      <div class="modal-actions"><button type="button" class="btn" data-acct="later">${fromSettings ? 'Close' : 'Not now'}</button></div></div>`, { small: true, cls: 'acct-modal' });
    preload();
    m.root.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-acct]');
      if (!b) return;
      if (b.dataset.acct === 'later') return m.close();
      if (b.dataset.acct === 'email') { m.close(); return emailForm('create'); }
      if (b.dataset.acct === 'google') { const r = await run(google, b); if (r === 'ok' || r === 'redirect') m.close(); }
    });
  }

  function emailForm(mode) {
    let tab = mode || 'create';
    const m = UI().openModal(`<div class="acct">
      <h2>Save with email</h2>
      <div class="acct-tabs" role="tablist"><button type="button" data-tab="create">Create account</button><button type="button" data-tab="login">Log in</button></div>
      <p class="muted small" data-hint></p>
      <label class="acct-lbl">Email<input class="acct-in" type="email" data-email autocomplete="email" autocapitalize="off" spellcheck="false" placeholder="you@example.com"></label>
      <label class="acct-lbl">Password<span class="acct-pw"><input class="acct-in" type="password" data-pw minlength="6" placeholder="At least 6 characters"><button type="button" class="btn btn-small" data-show>Show</button></span></label>
      <p class="acct-st" data-st></p>
      <button type="button" class="acct-link" data-forgot>Forgot your password?</button>
      <div class="modal-actions"><button type="button" class="btn" data-x="back">Back</button><button type="button" class="btn btn-primary" data-x="go"></button></div></div>`, { small: true, cls: 'acct-modal' });
    const $ = (q) => m.root.querySelector(q);
    const st = (msg, bad) => { $('[data-st]').textContent = msg || ''; $('[data-st]').className = `acct-st ${bad ? 'bad' : 'good'}`; };
    const paintTab = () => {
      m.root.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
      $('[data-hint]').textContent = tab === 'create' ? 'Your game on this device gets saved to this new account.' : 'Load the game you saved on another device.';
      $('[data-pw]').autocomplete = tab === 'create' ? 'new-password' : 'current-password';
      $('[data-x="go"]').textContent = tab === 'create' ? 'Create and save' : 'Log in';
      $('[data-forgot]').hidden = tab !== 'login';
      st('');
    };
    paintTab();
    preload();
    setTimeout(() => { const i = $('[data-email]'); if (i) i.focus(); }, 250);
    m.root.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('input')) $('[data-x="go"]').click(); });
    m.root.addEventListener('click', async (e) => {
      const t = e.target.closest('[data-tab]');
      if (t) { tab = t.dataset.tab; return paintTab(); }
      if (e.target.closest('[data-show]')) { const i = $('[data-pw]'); i.type = i.type === 'password' ? 'text' : 'password'; $('[data-show]').textContent = i.type === 'password' ? 'Show' : 'Hide'; return; }
      const email = $('[data-email]').value.trim();
      const pw = $('[data-pw]').value;
      if (e.target.closest('[data-forgot]')) {
        if (!/^\S+@\S+\.\S+$/.test(email)) return st('Type your email above first.', true);
        const r = await run(() => resetPw(email).then(() => 'sent'));
        if (r === 'sent') st(`Check ${email} for a link to pick a new password.`);
        return;
      }
      const x = e.target.closest('[data-x]');
      if (!x) return;
      if (x.dataset.x === 'back') { m.close(); return offer(true); }
      if (!/^\S+@\S+\.\S+$/.test(email)) return st("That doesn't look like an email address.", true);
      if (pw.length < 6) return st('Passwords need at least 6 characters.', true);
      const r = await run(() => (tab === 'create' ? emailCreate(email, pw) : emailLogin(email, pw)), x);
      if (r === 'ok') m.close();
    });
  }

  // Linked: say so, then set up the HoloNet callsign and picture if there's none yet.
  function celebrate(m, linked) {
    paint();
    const prof = root.Player.state.hn && root.Player.state.hn.prof;
    const hasProfile = !!(prof && prof.key);
    const node = UI().openModal(`<div class="acct acct-done">
      <div class="acct-hero ok">${root.Icons ? root.Icons.svg('holocron') : ''}</div>
      <h2>${linked ? 'Your game is saved!' : 'Signed in'}</h2>
      <p class="muted">Signed in as <b>${esc(m.email)}</b>. Sign in with ${m.prov === 'google' ? 'this Google account' : 'this email and password'} on any device to pick up where you left off. Progress saves automatically.</p>
      ${hasProfile ? '' : '<p class="muted small">One more thing: pick your callsign and picture now, so they\'re ready and waiting when you reach the HoloNet.</p>'}
      <div class="modal-actions">${hasProfile ? '<button type="button" class="btn btn-primary" data-d="ok">Done</button>' : '<button type="button" class="btn" data-d="ok">Later</button><button type="button" class="btn btn-primary" data-d="prof">Set up my profile</button>'}</div></div>`, { small: true, cls: 'acct-modal' });
    const award = () => UI().celebrateFeat && UI().celebrateFeat('linked');
    node.root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-d]');
      if (!b) return;
      node.close();
      if (b.dataset.d === 'prof') profile(award);
      else award();
    });
  }
  async function profile(then, edit) {
    try {
      if (!root.HN && root.__hnStartLive) await root.__hnStartLive();
      if (!root.HN || !root.HN.setupProfile) { toast("Couldn't load the profile editor. Try again from Settings."); if (then) then(); return; }
      const pr = myProf();
      root.HN.setupProfile((saved) => { if (saved) upload(); paintChip(); if (then) then(); }, edit && pr && pr.tag);
    } catch (e) { toast(errMsg(e)); if (then) then(); }
  }

  // ---------- Commander profile card + top chip (2.1) ----------
  // Guests see "Guest" and a way to save; signed-in players see their callsign,
  // picture, frame and badges, and tap the picture to change them.
  const myProf = () => (root.Player && root.Player.state && root.Player.state.hn && root.Player.state.hn.prof) || null;
  const GUEST_PIC = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#121a2b" stroke="#3a4a66" stroke-width="2"/><circle cx="24" cy="19" r="8" fill="#3a4a66"/><path d="M9 40c3-8 9-11 15-11s12 3 15 11" fill="#3a4a66"/></svg>';
  const picOf = (pr) => { const D = root.GameData; const u = D && (D.UNIT_MAP[pr.av] || D.UNIT_MAP.luke); return u && root.Art ? root.Art.unitArt(u) : ''; };
  function cardInner() {
    const m = meta();
    const pr = myProf();
    const lv = root.Player.state.account.level;
    if (!m) {
      return `<button type="button" class="cid-pic guest" data-cid="signin" aria-label="Save your game">${GUEST_PIC}</button>
        <div class="cid-txt"><b>Guest</b><span>Save your game to claim your callsign, picture and frame, and play on any device.</span></div>
        <button type="button" class="btn btn-small btn-primary cid-btn" data-cid="signin">Save your game</button>`;
    }
    if (!pr || !pr.tag) {
      return `<button type="button" class="cid-pic guest" data-cid="edit" aria-label="Set up your profile">${GUEST_PIC}</button>
        <div class="cid-txt"><b>Pilot</b><span>Signed in as ${esc(m.email)}. Pick your callsign and picture.</span></div>
        <button type="button" class="btn btn-small btn-primary cid-btn" data-cid="edit">Set up profile</button>`;
    }
    const HN = root.HN;
    const pic = HN && HN.avatarHtml ? HN.avatarHtml(pr, 'lg') : `<span class="cid-fallback"><span>${picOf(pr)}</span></span>`;
    let feats = [];
    try { const all = UI().achievements().filter((x) => x.have >= x.need); feats = (pr.feat || []).map((id) => all.find((x) => (x.id || x.name) === id)).filter(Boolean).slice(0, 6); } catch (e) { feats = []; }
    const badges = feats.length ? feats.map((x) => `<span class="cid-bdg" title="${esc(x.name)}">${UI().featBadge(x)}</span>`).join('') : '<span class="muted small">No badges shown yet</span>';
    return `<button type="button" class="cid-pic" data-cid="edit" aria-label="Edit your picture, frame and badges">${pic}<i class="cid-pen">${root.Icons ? root.Icons.svg('settings') : ''}</i></button>
      <div class="cid-txt"><b>${esc(pr.tag)}</b><span>Level ${lv} · ${esc(HN && HN.frameName ? HN.frameName(pr.frame) : 'Recruit')} frame</span><div class="cid-bdgs">${badges}</div></div>`;
  }
  function profileHtml() {
    if (!enabled()) return '';
    return `<div class="cid" data-cid-card>${cardInner()}</div>`;
  }
  let cardHost = null;
  function paintCard() { if (cardHost && cardHost.isConnected) cardHost.innerHTML = cardInner(); paintChip(); }
  function bindProfile(rootEl, modal) {
    cardHost = rootEl.querySelector('[data-cid-card]');
    if (!cardHost) return;
    // Signed in: fetch the HoloNet drawing so the frame shows too.
    const pr = myProf();
    if (meta() && pr && pr.tag && !(root.HN && root.HN.avatarHtml) && root.__hnStartLive) root.__hnStartLive().then(() => paintCard()).catch(() => {});
    cardHost.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cid]');
      if (!b) return;
      if (b.dataset.cid === 'signin') { if (modal) modal.close(); return offer(true); }
      if (modal) modal.close();
      return profile(null, true);
    });
  }
  // The level chip at the top: "Guest" until signed in, then your callsign.
  function paintChip() {
    const el = document.getElementById('acct-who');
    if (!el) return;
    if (!enabled()) { el.hidden = true; return; }
    const pr = myProf();
    const m = meta();
    el.hidden = false;
    el.innerHTML = m && pr && pr.tag ? `<i class="aw-pic">${picOf(pr)}</i><span>${esc(pr.tag)}</span>` : '<span>Guest</span>';
    el.classList.toggle('guest', !(m && pr && pr.tag));
  }

  // ---------- Settings ----------
  let host = null;
  function settingsHtml() {
    if (!enabled()) return '';
    return `<section class="set-sec acct-sec" data-acct-sec>${secInner()}</section>`;
  }
  function secInner() {
    const m = meta();
    const ico = root.Icons ? root.Icons.svg('holocron') : '';
    if (!m) {
      return `<h3>${ico} Save your game</h3>
        <p class="muted small">Sign in to keep your progress safe and play on any device. Already saved somewhere else? Sign in with the same account to load it.</p>
        ${choices()}`;
    }
    const prof = root.Player.state.hn && root.Player.state.hn.prof;
    const line = state === 'saving' ? 'Saving…' : state === 'offline' ? 'Waiting for a connection' : `Saved ${esc(ago(m.at))}`;
    return `<h3>${ico} Saved account</h3>
      <dl class="set-info">
        <div><dt>Signed in</dt><dd>${esc(m.email)}${m.prov === 'google' ? ' (Google)' : ''}</dd></div>
        <div><dt>Cloud save</dt><dd data-acct-line>${line}</dd></div>
        <div><dt>HoloNet callsign</dt><dd>${prof && prof.tag ? esc(prof.tag) : '<span class="muted">Not set yet</span>'}</dd></div>
      </dl>
      <div class="settings-btns">
        ${root.Invite ? '<button class="btn btn-primary" type="button" data-acct="invite">Invite friends</button>' : ''}
        <button class="btn" type="button" data-acct="sync">Save now</button>
        <button class="btn" type="button" data-acct="profile">${prof && prof.tag ? 'Edit profile' : 'Set up profile'}</button>
        <button class="btn" type="button" data-acct="out">Sign out</button>
        <button class="btn btn-danger btn-small" type="button" data-acct="delete">Delete account</button>
      </div>`;
  }
  function paint() {
    if (host && host.isConnected) host.innerHTML = secInner();
  }
  function bind(rootEl, modal) {
    host = rootEl.querySelector('[data-acct-sec]');
    if (!host) return;
    if (!meta()) preload();
    host.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-acct]');
      if (!b) return;
      const a = b.dataset.acct;
      if (a === 'google') { const r = await run(google, b); if (r === 'ok' && modal) modal.close(); return; }
      if (a === 'email') { if (modal) modal.close(); return emailForm('create'); }
      if (a === 'sync') { const ok = await upload(); toast(ok ? 'Game saved to your account.' : state === 'offline' ? "Couldn't reach the server. It saves as soon as you're back online." : 'Already up to date.'); return; }
      if (a === 'profile') { if (modal) modal.close(); return profile(); }
      if (a === 'invite') { if (modal) modal.close(); return root.Invite.open(); }
      if (a === 'out') { if (modal) modal.close(); return signOut(); }
      if (a === 'delete') { if (modal) modal.close(); return del(); }
    });
  }

  // ---------- start ----------
  function shouldOffer() {
    const P = root.Player;
    const App = UI() && UI().App;
    if (!enabled() || meta() || ls(ASKED) || !P || !P.state || !App) return false;
    if (!(P.state.tutorial && P.state.tutorial.done) || App.battleActive) return false;
    return ['home', 'collection', 'market'].includes(App.current);
  }
  // Waits for the loading screen and anything else on screen to finish first.
  const busyScreen = () => !!document.querySelector('.app-splash, .modal-backdrop, .tut-intro, .tut-coach, .walkout, .feat-show, .feat-cine, .rank-up, .hc, .code-entry, .inst-help');
  // Accounts saved before the badge existed get it the next time the game opens.
  function awardLater(tries = 0) {
    setTimeout(() => {
      const App = UI() && UI().App;
      if (busyScreen() || !App || App.battleActive) { if (tries < 40) awardLater(tries + 1); return; }
      if (UI().celebrateFeat) UI().celebrateFeat('linked');
    }, 3000);
  }
  let offerT = 0;
  function maybeOffer(tries = 0) {
    clearTimeout(offerT);
    offerT = setTimeout(() => {
      if (!shouldOffer()) return;
      if (busyScreen()) { if (tries < 40) maybeOffer(tries + 1); return; }
      ls(ASKED, String(Date.now()));
      offer(false);
    }, tries ? 3000 : 2500);
  }
  function init() {
    const P = root.Player;
    if (!P) return;
    const H = UI() && UI().hooks;
    // Tester switch: the same code turns it off again.
    if (H) {
      const before = H.redeem;
      H.redeem = (c) => {
        if (c !== code()) return before ? before(c) : false;
        // The same code also tests Friends (friends, friendly battles, duel chat,
        // Add friend after duels) until 2.2 is out; then it stops working.
        const U22 = root.Update22;
        const frOpen = U22 && U22.test && !U22.on();
        if (released()) {
          if (!frOpen) return before ? before(c) : false;
          // Always on (entering it again never switches it off): Friends, chat,
          // friendly battles, the new profile, and Rex's walkthrough replays.
          U22.test(true);
          if (root.ProfileV2) root.ProfileV2.preview(true);
          toast('2.2 test ON for this device: Friends, friend profiles, guild invites, the new profile, Rex\'s walkthrough and the new 2.2 bosses and cards. Reload the game to see the new bosses.');
          if (root.RexGuide) setTimeout(() => root.RexGuide.tester(), 900);
          return true;
        }
        const on = ls(TEST) !== '1';
        ls(TEST, on ? '1' : null);
        if (frOpen) U22.test(on);
        toast(on ? 'Saved accounts and Friends test: ON for this device. Open Settings to try it.' : 'Saved accounts and Friends test: OFF for this device.');
        paintChip();
        if (on) maybeOffer();
        return true;
      };
    }
    // The Never Lost badge: listed once saved accounts are out (or earned).
    if (H) {
      H.feats.push((s) => (s.linked || enabled() ? [{ id: 'linked', icon: 'shield', tier: 2, name: 'Never Lost', desc: 'Save your game to an account', have: s.linked ? 1 : 0, need: 1 }] : []));
      H.crests.linked = CREST;
    }
    // Every save also goes to the cloud a few seconds later.
    const base = P.save;
    let chipT = 0;
    P.save = function () {
      if (applying) return undefined;
      const r = base.apply(this, arguments);
      changed();
      clearTimeout(chipT); chipT = setTimeout(paintChip, 300);
      return r;
    };
    paintChip();
    // Leaving the page uploads; coming back (or back online) checks for a newer save.
    let seen = Date.now();
    document.addEventListener('visibilitychange', () => {
      if (!meta()) return;
      if (document.visibilityState === 'hidden') { if (ls(DIRTY) === '1') upload(); seen = Date.now(); } else if (Date.now() - seen > 30000) check();
    });
    root.addEventListener('online', () => { if (meta() && ls(DIRTY) === '1') upload(); });
    const App = UI() && UI().App;
    if (App) {
      const go = App.go;
      App.go = function (screen) {
        const r = go.apply(this, arguments);
        if (enabled() && !ls(ASKED) && !meta()) maybeOffer();
        return r;
      };
    }
    // A battle ended while a newer save was waiting: pick it up now.
    if (H && H.battleEnd) H.battleEnd.push(() => { if (recheck) { recheck = false; setTimeout(check, 6000); } });
    // Launch: the tester switch is no longer needed; a page left open over the launch gets a reload nudge.
    if (released()) ls(TEST, null);
    else if (RELEASE - Date.now() < 4 * 86400000) setTimeout(() => toast('Update 2.1 is live! Reload the game to get it.'), RELEASE - Date.now() + 2000);
    if (!enabled()) return;
    const msg = ls('swcg-acct-msg');
    if (msg) { ls('swcg-acct-msg', null); setTimeout(() => toast(msg), 1200); }
    if (ls('swcg-acct-redirect') === '1') afterRedirect();
    if (meta()) { markLinked(); check(); awardLater(); }
    maybeOffer();
  }
  root.Account = { settingsHtml, bind, enabled, offer, upload, check, profile, profileHtml, bindProfile, paintChip, meta: () => meta() };
  // Everything that ships with update 2.1 checks this.
  root.Update21 = { on: enabled };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
  else setTimeout(init, 0);
})(window);
