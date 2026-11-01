// Owner tool: card usage across players, from the daily counter (js/usage.js).
// Signs in anonymously with the game's public web config, reads hn/live/usage
// and prints, for every card, the share of players who have it in a squad.
//   node scripts/usage.js [days=14]
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'hn-firebase.js'), 'utf8');
const pick = (k) => (src.match(new RegExp(`${k}:\\s*'([^']+)'`)) || [])[1];
const KEY = pick('apiKey');
const PROJECT = pick('projectId');
const days = Number(process.argv[2]) || 14;

(async () => {
  const auth = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }),
  }).then((r) => r.json());
  if (!auth.idToken) throw new Error('Sign-in failed: ' + JSON.stringify(auth.error && auth.error.message));
  const base = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/hn/live/usage`;
  const docs = [];
  let page = '';
  do {
    const j = await fetch(`${base}?pageSize=300${page ? `&pageToken=${page}` : ''}`, { headers: { Authorization: `Bearer ${auth.idToken}` } }).then((r) => r.json());
    if (j.error) throw new Error('Read failed: ' + j.error.status);
    docs.push(...(j.documents || []));
    page = j.nextPageToken || '';
  } while (page);
  const since = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
  const list = (v) => ((v && v.arrayValue && v.arrayValue.values) || []).map((x) => x.stringValue).filter(Boolean);
  const rows = docs.map((d) => d.fields || {}).filter((f) => f.day && f.day.stringValue >= since)
    .map((f) => ({ lvl: Number(f.lvl && f.lvl.integerValue) || 0, g: list(f.g), f: list(f.f) }));
  const count = {};
  for (const r of rows) for (const id of new Set([...r.g, ...r.f])) count[id] = (count[id] || 0) + 1;
  const players = rows.length;
  const cards = Object.entries(count).sort((a, b) => b[1] - a[1]).map(([id, n]) => ({ id, players: n, pct: players ? Math.round((n / players) * 1000) / 10 : 0 }));
  console.log(JSON.stringify({ days, players, cards }, null, 1));
})().catch((e) => { console.error(e.message); process.exit(1); });
