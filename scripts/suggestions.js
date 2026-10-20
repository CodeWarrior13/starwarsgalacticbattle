// Owner tool: prints the suggestion-box ideas from the last N days as JSON.
// Signs in anonymously with the game's public web config (the same way the
// game does), then reads hn/live/suggestions. Not loaded by the game.
//   node scripts/suggestions.js [days=7]
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'hn-firebase.js'), 'utf8');
const pick = (k) => (src.match(new RegExp(`${k}:\\s*'([^']+)'`)) || [])[1];
const KEY = pick('apiKey');
const PROJECT = pick('projectId');
const days = Number(process.argv[2]) || 7;

(async () => {
  const auth = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }),
  }).then((r) => r.json());
  if (!auth.idToken) throw new Error('Sign-in failed: ' + JSON.stringify(auth.error && auth.error.message));
  const since = Date.now() - days * 864e5;
  const base = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
  const rows = await fetch(`${base}/hn/live:runQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.idToken}` },
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'suggestions' }], orderBy: [{ field: { fieldPath: 't' }, direction: 'DESCENDING' }], limit: 500 } }),
  }).then((r) => r.json());
  if (!Array.isArray(rows)) throw new Error('Read failed: ' + JSON.stringify(rows).slice(0, 300));
  const val = (v) => (!v ? null : v.timestampValue ? Date.parse(v.timestampValue) : v.stringValue ?? Number(v.integerValue ?? v.doubleValue));
  const ideas = rows.filter((r) => r.document).map((r) => {
    const f = r.document.fields || {};
    return { id: r.document.name.split('/').pop(), text: val(f.text), t: val(f.t), lvl: val(f.lvl) };
  });
  const recent = ideas.filter((i) => i.t >= since);
  console.log(JSON.stringify({ days, total: ideas.length, recent: recent.length, ideas: recent }, null, 1));
})().catch((e) => { console.error(e.message); process.exit(1); });
