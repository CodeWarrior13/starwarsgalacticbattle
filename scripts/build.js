// Bundles index.html, the stylesheet and all scripts into one self-contained
// HTML file (dist/galactic-card-battles.html) that can be shared or hosted anywhere.
// Run with: node scripts/build.js

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(rootDir, p), 'utf8');

const html = read('index.html');
const title = html.match(/<title>.*<\/title>/)[0];
const fonts = html.match(/<link rel="stylesheet" href="https:\/\/fonts[^>]*>/)[0];
const body = html.match(/<body>([\s\S]*)<\/body>/)[1]
  .replace(/\s*<script src="[^"]+"><\/script>/g, '')
  .replace(/src="(icons\/[^"]+\.png)"/g, (m, file) => `src="data:image/png;base64,${fs.readFileSync(path.join(rootDir, file)).toString('base64')}"`)
  .trim();
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);

// Custom card art is embedded as data URIs so the single file stays self-contained.
function inlineArt() {
  global.window = global;
  delete global.ART_IMAGES;
  eval(read('js/art-images.js'));
  const map = global.ART_IMAGES || {};
  const types = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml' };
  const out = {};
  for (const [id, file] of Object.entries(map)) {
    const full = path.join(rootDir, file);
    if (!fs.existsSync(full)) continue;
    const ext = path.extname(file).slice(1).toLowerCase();
    out[id] = `data:${types[ext] || 'application/octet-stream'};base64,${fs.readFileSync(full).toString('base64')}`;
  }
  return `window.ART_IMAGES = ${JSON.stringify(out)};`;
}

const out = [
  title,
  fonts,
  `<style>\n${read('css/styles.css')}\n</style>`,
  body,
  ...scripts.map((src) => `<script>\n${(src === 'js/art-images.js' ? inlineArt() : read(src)).replace(/<\/script/gi, '<\\/script')}\n</script>`),
].join('\n');

fs.mkdirSync(path.join(rootDir, 'dist'), { recursive: true });
const target = path.join(rootDir, 'dist', 'galactic-card-battles.html');
fs.writeFileSync(target, out + '\n');
console.log(`Built ${path.relative(rootDir, target)} (${(out.length / 1024).toFixed(1)} KB)`);
