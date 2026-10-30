// Update 2.4 "Liberation": its release time, and the art that only it needs.
// Until 2.4 is on (released, or the tester switch on this device) the 2.4
// card art and stage scenes don't download at all. js/liberation24.js and
// js/changelog.js read REL24, so the date only needs setting here.
(function (root) {
  root.REL24 = Date.UTC(2026, 10, 11, 12, 50, 0); // 6:50 a.m. Central, Wednesday November 11, 2026
  var test = false;
  try { test = localStorage.getItem('swcg-v24-test') === '1'; } catch (e) { /* storage blocked */ }
  var at = root.__v24Test != null ? root.__v24Test : root.REL24;
  if (test || (at != null && Date.now() >= at)) document.write('<script src="js/liberation24-art.js"><\/script>');
  var on = (root.__l24art = test || (at != null && Date.now() >= at));

  // Stage scenes download the first time a battle needs them: the shared kit
  // (and Tatooine) first, then each world's own file. Later worlds reuse ships
  // and figures from the earlier files, so a world loads every file before it
  // too, in order.
  var FILES = ['art', 'hoth', 'dagobah', 'bespin', 'endor', 'scarif', 'coruscant', 'geonosis', 'mustafar', 'exegol', 'siege'];
  var FILE_OF = { tatooine: 0, hoth: 1, dagobah: 2, bespin: 3, endor: 4, scarif: 5, coruscant: 6, geonosis: 7, mustafar: 8, exegol: 9, coruscant_siege: 10 };
  var loaded = [];
  var need = function (p) { return on && p && p.type === 'stage' && FILE_OF[p.planet] != null ? FILE_OF[p.planet] : -1; };
  var have = function (p) { var S = root.StageArt24; return !!(S && S.worlds[p.planet]); };
  root.Stages24 = {
    ready: function (p) { return need(p) < 0 || have(p); },
    load: function (p) {
      var n = need(p);
      if (n < 0 || have(p)) return Promise.resolve();
      var jobs = [];
      for (var i = 0; i <= n; i++) {
        if (!loaded[i]) {
          loaded[i] = new Promise(function (res, rej) {
            var k = i;
            var sc = document.createElement('script');
            sc.src = 'js/stages24-' + FILES[k] + '.js';
            sc.async = false; // run in order, whatever order they arrive in
            sc.onload = res;
            sc.onerror = function () { loaded[k] = null; rej(new Error('offline')); };
            document.head.appendChild(sc);
          });
        }
        jobs.push(loaded[i]);
      }
      return Promise.all(jobs);
    },
  };
})(window);
