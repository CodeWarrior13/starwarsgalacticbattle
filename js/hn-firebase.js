// HoloNet online connector for the real website: signs the player in with
// Firebase and gives the HoloNet the same shared database it uses on the
// tester page (arena, raid, guilds, gchat), so no HoloNet code has to change.
//
// Load order in index.html, before the HoloNet scripts:
//   <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
//   <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>
//   <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
//   <script src="js/hn-firebase.js"></script>
(function (root) {
  'use strict';
  // Paste the firebaseConfig block from Firebase > Project settings > Your apps here.
  const firebaseConfig = {
    apiKey: 'AIzaSyC5wOKHuD51agc1jQt3sX4IW5dDsjDXpeY',
    authDomain: 'star-wars-glactic-battle.firebaseapp.com',
    projectId: 'star-wars-glactic-battle',
    storageBucket: 'star-wars-glactic-battle.firebasestorage.app',
    messagingSenderId: '187805254485',
    appId: '1:187805254485:web:d6d11c36c8e6b83e6065dc',
  };
  if (!root.firebase || firebaseConfig.apiKey === 'PASTE_HERE') return;

  // All HoloNet data lives under hn/<env>/...: 'live' for the real HoloNet,
  // 'beta' for tester sessions (the HOLOTESTER code), so test ratings, guilds
  // and duel records never mix with the real ones.
  const ENV = root.__hnEnv === 'beta' ? 'beta' : 'live';
  const P = (path) => `hn/${ENV}/${path}`;
  const app = root.firebase.initializeApp(firebaseConfig);
  const auth = app.auth();
  const fs = app.firestore();
  // The HoloNet's data can carry empty (undefined) fields, which Firestore
  // refuses; leave them out instead, like the tester page's store does.
  try { fs.settings({ ignoreUndefinedProperties: true }); } catch (e) { /* already set */ }
  // Local test runs only: point at the Firebase emulators.
  if (root.__hnEmulator) { auth.useEmulator('http://localhost:9099'); fs.useEmulator('localhost', 8089); }
  // Offline play keeps working; writes sync when the connection comes back.
  fs.enablePersistence({ synchronizeTabs: true }).catch(() => {});

  // Signed in silently with a guest account the first time; the same account
  // comes back on this device. (Google sign-in can be added to keep it across devices.)
  const signedIn = new Promise((resolve) => {
    auth.onAuthStateChanged((u) => { if (u) resolve(u); });
    auth.signInAnonymously().catch(() => resolve(null));
    setTimeout(() => resolve(auth.currentUser), 10000);
  });

  // The same small API the tester page provides: collections with
  // where / orderBy / limit, get and onSnapshot; documents with get, set,
  // update, delete and onSnapshot.
  const plain = (data) => JSON.parse(JSON.stringify(data, (k, v) => (v === undefined ? null : v)));
  const snapDoc = (d) => ({ id: d.id, exists: d.exists, data: () => (d.exists ? d.data() : undefined) });
  const wrapSnap = (snap) => ({ docs: snap.docs.map(snapDoc), size: snap.size, empty: snap.empty });
  const query = (q) => ({
    where: (f, op, v) => query(q.where(f, op, v)),
    orderBy: (f, dir) => query(q.orderBy(f, dir || 'asc')),
    limit: (n) => query(q.limit(n)),
    get: async () => wrapSnap(await q.get()),
    onSnapshot: (next, err) => q.onSnapshot((s) => next(wrapSnap(s)), err || (() => {})),
  });
  const db = {
    collection: (path) => ({ ...query(fs.collection(P(path))), path, doc: (id) => db.doc(`${path}/${id}`) }),
    doc: (path) => ({
      set: (data) => fs.doc(P(path)).set(plain(data)),
      update: (data) => fs.doc(P(path)).update(plain(data)),
      delete: () => fs.doc(P(path)).delete(),
      get: async () => snapDoc(await fs.doc(P(path)).get()),
      onSnapshot: (next, err) => fs.doc(P(path)).onSnapshot((d) => next(snapDoc(d)), err || (() => {})),
    }),
  };
  const user = {
    id: async () => { const u = await signedIn; return u ? u.uid : null; },
    // Other players show their HoloNet callsign; there are no real names online.
    profiles: async (ids) => Object.fromEntries(ids.map((id) => [id, { name: '' }])),
  };
  // Live Duels on Firestore, shaped like the tester page's room so the duel
  // code needs no changes:
  //   lobby/{uid}            who's online (a heartbeat every minute or so)
  //   challenges/{id}        a challenge or answer addressed to one player
  //   duels/{id}/moves/{id}  the moves of one match, readable by its two players
  // The lobby is only watched while the Duels screen or HoloNet hub is open
  // (or a duel is on), so it costs nothing the rest of the time.
  const ONLINE_MS = 150000;
  const BEAT_MS = 60000;
  const pairs = {}; // duel id -> the other player's uid
  const stamp = () => root.firebase.firestore.FieldValue.serverTimestamp();
  let roomP = null;
  function makeRoom(me) {
    const topics = {};
    const peerH = [];
    let myPres = {};
    let lastBeat = 0;
    let lastKey = '';
    let others = {};
    let lobbyOff = null;
    const meRow = () => ({ peer: me, by: me, isMe: true, sameTab: true, kind: 'viewer', guest: false, presence: myPres, updatedAt: Date.now() });
    const snap = () => [meRow(), ...Object.values(others)];
    const fire = (joined, left) => { const peers = snap(); for (const h of peerH) { try { h({ peers, joined, left, updated: [] }); } catch (e) { /* ignore */ } } };
    const deliver = (topic, msg) => { for (const h of topics[topic] || []) { try { h(msg); } catch (e) { /* ignore */ } } };
    // Lobby: watch only when it matters.
    const wanted = () => {
      const App = root.UI && root.UI.App;
      const HN = root.HN;
      if (HN && HN.Duel && HN.Duel.match) return true;
      return !!(App && App.current === 'holonet' && ['duels', 'hub', undefined].includes((App.params || {}).view) && document.visibilityState !== 'hidden');
    };
    const applyLobby = (docs) => {
      const now = Date.now();
      const next = {};
      for (const d of docs) {
        if (d.id === me) continue;
        const v = d.data() || {};
        const ts = v.ts && v.ts.toMillis ? v.ts.toMillis() : v.t || 0;
        if (now - ts > ONLINE_MS) continue;
        next[d.id] = { peer: d.id, by: d.id, isMe: false, sameTab: false, kind: 'viewer', guest: false, presence: v.p || {}, updatedAt: ts };
      }
      const joined = Object.values(next).filter((p) => !others[p.peer]);
      const left = Object.values(others).filter((p) => !next[p.peer]);
      others = next;
      fire(joined, left);
    };
    let lastDocs = [];
    setInterval(() => {
      const want = wanted();
      if (want && !lobbyOff) lobbyOff = fs.collection(P('lobby')).orderBy('t', 'desc').limit(20).onSnapshot((sn) => { lastDocs = sn.docs; applyLobby(lastDocs); }, () => {});
      if (!want && lobbyOff) { lobbyOff(); lobbyOff = null; }
      if (lobbyOff) applyLobby(lastDocs);
    }, 4000);
    // Messages addressed to me (challenges and answers).
    fs.collection(P('challenges')).where('to', '==', me).onSnapshot((sn) => {
      sn.docChanges().forEach((ch) => {
        if (ch.type !== 'added') return;
        const v = ch.doc.data() || {};
        ch.doc.ref.delete().catch(() => {});
        if (Date.now() - (v.t || 0) > 60000) return;
        const data = v.data || {};
        if (data && data.id) pairs[data.id] = v.from;
        deliver(v.topic, { topic: v.topic, data, peer: v.from, by: v.from, isMe: false, sameTab: false, kind: 'viewer', guest: false });
      });
    }, () => {});
    const room = {
      name: 'lobby',
      emit: async (topic, data) => {
        const to = data && data.to;
        if (!to) return;
        if (data.id) pairs[data.id] = to;
        await fs.collection(P('challenges')).add({ from: me, to, topic, data, t: Date.now() });
      },
      on: (topic, h) => { (topics[topic] = topics[topic] || []).push(h); return () => {}; },
      presence: async (patch) => {
        myPres = { ...myPres, ...patch };
        const key = JSON.stringify(myPres);
        if (key === lastKey && Date.now() - lastBeat < BEAT_MS) return;
        lastKey = key; lastBeat = Date.now();
        await fs.doc(P(`lobby/${me}`)).set({ p: myPres, t: Date.now(), ts: stamp() });
      },
      peers: snap,
      onPeers: (h) => { peerH.push(h); setTimeout(() => fire(snap(), []), 0); return () => {}; },
      connected: () => true,
      onConnection: (h) => { setTimeout(() => h(true), 0); return () => {}; },
      leave: async () => {},
      // One match: both players, moves in a subcollection.
      join: async (name) => {
        const id = String(name).replace(/^duel-/, '');
        const other = pairs[id];
        const duelRef = fs.doc(P(`duels/${id}`));
        if (other) await duelRef.set({ players: [me, other], t: Date.now() }).catch(() => {});
        const handlers = {};
        const since = Date.now() - 5000;
        let off = null;
        const listen = () => {
          off = duelRef.collection('moves').where('t', '>=', since).onSnapshot((sn) => {
            sn.docChanges().forEach((ch) => {
              if (ch.type !== 'added') return;
              const v = ch.doc.data() || {};
              const msg = { topic: v.topic, data: v.data, peer: v.by, by: v.by, isMe: v.by === me, sameTab: v.by === me, kind: 'viewer', guest: false };
              for (const h of handlers[v.topic] || []) { try { h(msg); } catch (e) { /* ignore */ } }
            });
          }, () => { off = null; setTimeout(listen, 1500); });
        };
        // The duel doc may still be landing; the rules need it before moves can be read.
        setTimeout(listen, other ? 0 : 800);
        // Heartbeats don't get a doc each (that would be dozens of writes a
        // minute): each player stamps hb_<uid> on the duel doc at most every
        // 5 seconds, and the other side's stamp arrives as a 'ping'.
        const sent = new Set();
        let lastHb = 0;
        let hbOff = null;
        const seenHb = {};
        const listenHb = () => {
          hbOff = duelRef.onSnapshot((d) => {
            const v = (d && d.data && d.data()) || {};
            for (const [k, t] of Object.entries(v)) {
              if (!k.startsWith('hb_') || k === `hb_${me}` || seenHb[k] === t) continue;
              seenHb[k] = t;
              const by = k.slice(3);
              for (const h of handlers.ping || []) { try { h({ topic: 'ping', data: {}, peer: by, by, isMe: false, sameTab: false, kind: 'viewer', guest: false }); } catch (e) { /* ignore */ } }
            }
          }, () => { hbOff = null; setTimeout(listenHb, 2000); });
        };
        setTimeout(listenHb, other ? 0 : 900);
        return {
          name,
          emit: async (topic, data) => {
            if (topic === 'pong') return;
            if (topic === 'ping') {
              if (Date.now() - lastHb < 5000) return;
              lastHb = Date.now();
              await duelRef.update({ [`hb_${me}`]: lastHb });
              return;
            }
            // Moves and acks are written once, under a fixed id: Firestore keeps
            // unsent writes and delivers them after a dropped connection, so the
            // game's re-send loop (needed for the live room) mustn't pile up copies.
            const seq = data && data.seq;
            if ((topic === 'move' || topic === 'ack') && seq != null) {
              const key = `${me}_${topic}_${seq}`;
              if (sent.has(key)) return;
              sent.add(key);
              await duelRef.collection('moves').doc(key).set({ by: me, topic, data: data || {}, t: Date.now() });
              return;
            }
            await duelRef.collection('moves').add({ by: me, topic, data: data || {}, t: Date.now() });
          },
          on: (topic, h) => { (handlers[topic] = handlers[topic] || []).push(h); return () => {}; },
          presence: async () => {},
          peers: () => [],
          onPeers: () => () => {},
          leave: async () => { if (off) off(); off = null; if (hbOff) hbOff(); hbOff = null; },
        };
      },
    };
    return room;
  }
  const prev = root.claude && root.claude.use;
  root.claude = {
    use: async (name) => {
      if (name === 'db') return (await signedIn) ? db : null;
      if (name === 'user') return (await signedIn) ? user : null;
      if (name === 'room') { const u = await signedIn; if (!u) return null; roomP = roomP || makeRoom(u.uid); return roomP; }
      return prev ? prev(name) : null;
    },
  };
})(window);
