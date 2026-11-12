// Update 2.5 "Cosmetic": the heavy 2.5 files (Watto's casino and its games,
// the Cosmetics tab, Luthen's Gallery, victory scenes…) only download once 2.5
// is on: when it ships, or with the tester switch on this device. Everyone
// else skips them. The casino loads just after start; the scenes file waits
// until the page is idle.
(function (root) {
  if (!(root.Update25 && root.Update25.on())) return;
  var v = function (p) { return root.__ver ? root.__ver(p) : p; };
  var files = ['js/cosm25.js', 'js/social25.js'];
  for (var i = 0; i < files.length; i++) document.write('<script src="' + v(files[i]) + '"><\/script>');
  var later = function () { var s = document.createElement('script'); s.src = v('js/fx25.js'); s.async = true; document.head.appendChild(s); };
  // Watto's casino (the biggest file) loads right after the game is up instead
  // of holding up the start; if you're already in the Black Market it redraws.
  var casino = function () { var s = document.createElement('script'); s.src = v('js/casino25.js'); s.async = true; s.onload = function () { try { var A = root.UI && root.UI.App; if (A && A.current === 'market' && !A.battleActive) A.refresh(); } catch (e) { /* ignore */ } }; document.head.appendChild(s); };
  root.addEventListener('load', function () { setTimeout(casino, 50); });
  root.addEventListener('load', function () { if (root.requestIdleCallback) root.requestIdleCallback(later, { timeout: 4000 }); else setTimeout(later, 1500); });
})(window);
