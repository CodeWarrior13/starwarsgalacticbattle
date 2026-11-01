// Owner tool: Champion's Card designs and replies (js/champion.js).
// Signs in anonymously with the game's public web config, reads
// hn/live/champion and prints the ones sent or changed in the last N hours.
//   node scripts/champion.js [hours=26]
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'hn-firebase.js'), 'utf8');
const pick = (k) => (src.match(new RegExp(`${k}:\\s*'([^']+)'`)) || [])[1];
const KEY = pick('apiKey');
const PROJECT = pick('projectId');
const hours = Number(process.argv[2]) || 26;

const val = (v) => {
  if (!v) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, val(x)]));
  return null;
};
(async () => {
  const auth = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }),
  }).then((r) => r.json());
  if (!auth.idToken) throw new Error('Sign-in failed: ' + JSON.stringify(auth.error && auth.error.message));
  const base = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/hn/live/champion`;
  const j = await fetch(`${base}?pageSize=100`, { headers: { Authorization: `Bearer ${auth.idToken}` } }).then((r) => r.json());
  if (j.error) throw new Error('Read failed: ' + j.error.status);
  const since = Date.now() - hours * 36e5;
  const all = (j.documents || []).map((d) => ({ uid: d.name.split('/').pop(), ...Object.fromEntries(Object.entries(d.fields || {}).map(([k, v]) => [k, val(v)])) }));
  const recent = all.filter((d) => (d.t || 0) >= since);
  console.log(JSON.stringify({ hours, total: all.length, recent }, null, 1));
})().catch((e) => { console.error(e.message); process.exit(1); });
