// Update 2.2 switch, and the main game's side of Friends.
// Friends unlock at account level 5: add pilots by callsign and play them in
// friendly 1v1 battles (the HoloNet's live duel, unranked and with no rewards).
// The panel itself lives in the HoloNet code (hn-friends), which loads on demand.
(function (root) {
  'use strict';
  // Update 2.2 goes live at 7:05 a.m. Central, Wednesday November 11, 2026 (13:05 UTC, after DST ends).
  const RELEASE22 = root.__v22Test != null ? root.__v22Test : Date.UTC(2026, 10, 11, 13, 5, 0);
  const on = () => RELEASE22 != null && Date.now() >= RELEASE22;
  root.Update22 = { on, at: RELEASE22 };

  const FRIENDS_LEVEL = 5;
  const level = () => (root.Player && root.Player.state && root.Player.state.account && root.Player.state.account.level) || 1;
  const unlocked = () => on() && level() >= FRIENDS_LEVEL;
  let btn = null;
  let booted = null;

  // The HoloNet code (and Firebase) load once a player can use Friends, so
  // friends can see them online and send them a friendly battle.
  function boot() {
    if (booted || !unlocked() || !root.__hnStartLive) return booted;
    booted = root.__hnStartLive().then(() => { if (root.HN && root.HN.friends) root.HN.friends.boot(); }).catch(() => { booted = null; });
    return booted;
  }
  async function open() {
    if (!unlocked()) return;
    if (root.HN && root.HN.friends) return root.HN.friends.open();
    if (root.UI) root.UI.toast('Connecting to the HoloNet…');
    await boot();
    if (root.HN && root.HN.friends) root.HN.friends.open();
    else if (root.UI) root.UI.toast("Couldn't reach the HoloNet. Check your connection and try again.");
  }
  function paint() {
    const bar = document.querySelector('.settings-btn');
    if (!bar) return;
    if (!unlocked()) { if (btn) btn.hidden = true; return; }
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'icon-btn friends-btn';
      btn.setAttribute('aria-label', 'Friends');
      btn.title = 'Friends';
      btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.4" fill="currentColor"/><path d="M2.6 19.4c.6-3.6 3.2-5.6 6.4-5.6s5.8 2 6.4 5.6z" fill="currentColor"/><circle cx="16.6" cy="9" r="2.6" fill="currentColor" opacity=".7"/><path d="M15.4 13.6c3.2-.4 5.6 1.4 6.2 4.6h-4.4c-.3-1.8-.9-3.4-1.8-4.6z" fill="currentColor" opacity=".7"/></svg><i class="fr-dot" hidden></i>';
      btn.addEventListener('click', open);
      bar.parentNode.insertBefore(btn, bar);
    }
    btn.hidden = false;
  }
  // The HoloNet code lights the dot for new requests and friendly-battle invites.
  root.Friends = { open, paint, boot, unlocked, dot: (v) => { if (btn) btn.querySelector('.fr-dot').hidden = !v; }, LEVEL: FRIENDS_LEVEL };

  function init() {
    paint();
    if (unlocked()) setTimeout(boot, 6000);
    // Reaching level 5: the button appears right away.
    const P = root.Player;
    if (P && P.gainXp && !P.__frWrap) {
      P.__frWrap = true;
      const gain = P.gainXp;
      P.gainXp = function () { const r = gain.apply(this, arguments); if (unlocked()) { paint(); boot(); } return r; };
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
  else setTimeout(init, 0);
})(window);
