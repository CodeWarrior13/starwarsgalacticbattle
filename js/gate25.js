// Update 2.5 "Cosmetic": the heavy 2.5 files (Watto's casino and its games,
// the Cosmetics tab, Luthen's Gallery…) only download once 2.5 is on: when it
// ships, or with the tester switch on this device. Everyone else skips them.
(function (root) {
  if (!(root.Update25 && root.Update25.on())) return;
  var files = ['js/casino25.js', 'js/cosm25.js'];
  for (var i = 0; i < files.length; i++) document.write('<script src="' + (root.__ver ? root.__ver(files[i]) : files[i]) + '"><\/script>');
})(window);
