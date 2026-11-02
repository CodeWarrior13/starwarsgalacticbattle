// Gives every script and stylesheet in index.html a version made from its
// own contents (file.js?v=1a2b3c4d). Run before publishing: only files that
// actually changed get a new address, so players re-download just those and
// load everything else from their device.
// Run with: node scripts/version.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.join(__dirname, '..');
const file = path.join(root, 'index.html');
let html = fs.readFileSync(file, 'utf8');
let changed = 0;
html = html.replace(/((?:src|href)=")((?:js|css)\/[^"?]+\.(?:js|css))(\?v=[^"]*)?"/g, (m, pre, rel, old) => {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) return m;
  const v = crypto.createHash('sha1').update(fs.readFileSync(p)).digest('hex').slice(0, 8);
  if (old !== `?v=${v}`) changed += 1;
  return `${pre}${rel}?v=${v}"`;
});
// Files the game loads later (the HoloNet, 2.4 stage scenes, the text
// filter…) get their versions from a small table, js/__ver(path).
const tagged = new Set([...html.matchAll(/src="(js\/[^"?]+\.js)/g)].map((m) => m[1]));
const later = {};
for (const f of fs.readdirSync(path.join(root, 'js'))) {
  const rel = `js/${f}`;
  if (!f.endsWith('.js') || tagged.has(rel)) continue;
  later[rel] = crypto.createHash('sha1').update(fs.readFileSync(path.join(root, rel))).digest('hex').slice(0, 8);
}
const table = `<script id="ver">window.__V=${JSON.stringify(later)};window.__ver=function(p){return window.__V[p]?p+'?v='+window.__V[p]:p};</script>`;
if (/<script id="ver">[\s\S]*?<\/script>/.test(html)) html = html.replace(/<script id="ver">[\s\S]*?<\/script>/, table);
else html = html.replace('<script src="js/loading.js', `${table}\n  <script src="js/loading.js`);
fs.writeFileSync(file, html);
console.log(`index.html: ${changed} file version${changed === 1 ? '' : 's'} updated`);
