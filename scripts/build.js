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
  .trim();
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);

const out = [
  title,
  fonts,
  `<style>\n${read('css/styles.css')}\n</style>`,
  body,
  ...scripts.map((src) => `<script>\n${read(src).replace(/<\/script/gi, '<\\/script')}\n</script>`),
].join('\n');

fs.mkdirSync(path.join(rootDir, 'dist'), { recursive: true });
const target = path.join(rootDir, 'dist', 'galactic-card-battles.html');
fs.writeFileSync(target, out + '\n');
console.log(`Built ${path.relative(rootDir, target)} (${(out.length / 1024).toFixed(1)} KB)`);
