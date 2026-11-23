// Update 2.6: the bot brain. Off until 2.6 ships (js/update26.js). Owner-only plan: nothing here is ever
// described to players. Everything runs in the game from phrase sets and a small memory; no outside service.
//  - 8 personalities, each with its own voice, typing style, hours and chattiness.
//  - Nicknames (Rook_7 → Rook when nobody else in the guild starts with Rook).
//  - Explains slang and game words, small talk with follow-up questions, game answers from real game data.
//  - A small memory per player (favourite card, a test coming up) that fades; personal details are never kept.
//  - Live status (what they're doing) that follows real online hours: peak around 8 PM, quietest around 4 AM,
//    night owls up past midnight.
//  - Friendly battles with bot friends: they accept, or say they're busy and come back; they sometimes ask for a
//    rematch or to switch it up, and back off when you say you're done.
//  - Rare emoji reactions in bot guilds, strategy tips and update talk, and day-one promotions in bot guilds.
(function (root) {
  'use strict';
  if (!(root.Update26 && root.Update26.on())) return;
  const HN = root.HN; const UI = root.UI; const D = root.GameData;
  if (!HN || !HN.social || !UI || !D || HN.botBrain) return;
  const SO = HN.social; const Net = HN.Net; const { toast } = UI;
  const S = () => SO.P2();
  const hash = (s) => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const pick = (arr, k) => arr[Math.abs(k | 0) % arr.length];
  const rnd = Math.random;
  const ctHour = (t) => { const d = new Date((t || Date.now()) - 6 * 3600000); return d.getUTCHours(); };

  // ---------- Personalities ----------
  const PERS = [
    { id: 'rookie', emoji: 0.35, lower: 0.6, chat: 0.8, owl: 0, hours: [16, 21], em: ['😄', '🎉', '😮', '🙌'] },
    { id: 'veteran', emoji: 0.02, lower: 0, chat: 0.45, owl: 0, hours: [19, 23], em: [] },
    { id: 'joker', emoji: 0.3, lower: 0.5, chat: 0.85, owl: 0.1, hours: [18, 24], em: ['😂', '💀', '😆'] },
    { id: 'grinder', emoji: 0, lower: 1, chat: 0.2, owl: 0.6, hours: [22, 26], em: [] },
    { id: 'hype', emoji: 0.5, lower: 0, chat: 0.8, owl: 0.1, hours: [17, 23], em: ['🔥', '💪', '⚔️'] },
    { id: 'nerd', emoji: 0.1, lower: 0.3, chat: 0.7, owl: 0.35, hours: [18, 25], em: ['🤓', '✨'] },
    { id: 'helper', emoji: 0.3, lower: 0.2, chat: 0.75, owl: 0, hours: [15, 22], em: ['🙂', '👍'] },
    { id: 'rival', emoji: 0.25, lower: 0.5, chat: 0.65, owl: 0.15, hours: [18, 23], em: ['😤', '😏'] },
  ];
  const PROPER = new Set(); for (const u of D.UNITS) PROPER.add(u.name.split(' ')[0].toLowerCase()); ['i', 'i\'m', 'i\'ll'].forEach((w) => PROPER.add(w));
  const persOf = (uid) => PERS[hash(uid) % PERS.length];
  // How a personality types a line.
  function voice(p, text, k = rnd()) {
    let t = String(text);
    if (p.id === 'hype' && k < 0.45) t = t.toUpperCase();
    else if (rnd() < p.lower && !PROPER.has(t.split(/[\s,.!?']/)[0].toLowerCase())) t = t.charAt(0).toLowerCase() + t.slice(1);
    if (p.id === 'grinder') t = t.replace(/[!.]+$/, '');
    if (p.id === 'nerd' && k > 0.7 && !/^ok so/i.test(t)) t = `ok so ${PROPER.has(t.split(/[\s,.!?']/)[0].toLowerCase()) ? t : t.charAt(0).toLowerCase() + t.slice(1)}`;
    if (p.em.length && rnd() < p.emoji && !/\p{Extended_Pictographic}\s*$/u.test(t)) t += ` ${pick(p.em, hash(t))}`;
    return t.slice(0, 160);
  }

  // ---------- Nicknames ----------
  const cleanTag = (t) => String(t || '').replace(/\s*\(you\)\s*$/, '').trim();
  function nick(tag, others) {
    const full = cleanTag(tag);
    const m = full.match(/^[A-Za-z]{3,}/);
    if (!m) return full;
    let base = m[0];
    // CamelCase names shorten to their first word: KesselRunner → Kessel.
    const camel = base.match(/^[A-Z]?[a-z]{2,}(?=[A-Z])/);
    if (camel) base = camel[0];
    if (base.length === full.length) return full;
    const clash = (others || []).some((o) => { const c = cleanTag(o); return c && c !== full && c.toLowerCase().startsWith(base.toLowerCase()); });
    return clash ? full : base;
  }

  // ---------- Slang and game words ----------
  const GLOSS = {
    lol: 'laugh out loud', lmao: 'laughing my butt off (pretty much a bigger lol)', rofl: 'rolling on the floor laughing', gg: 'good game', ggs: 'good games', wp: 'well played', ggwp: 'good game, well played', brb: 'be right back', afk: 'away from keyboard, so not playing right now', idk: "I don't know", idc: "I don't care", imo: 'in my opinion', imho: 'in my humble opinion', ngl: 'not gonna lie', tbh: 'to be honest', fr: 'for real', irl: 'in real life', np: 'no problem', ty: 'thank you', thx: 'thanks', tysm: 'thank you so much', yw: "you're welcome", omg: 'oh my gosh', btw: 'by the way', jk: 'just kidding', smh: 'shaking my head', ikr: 'I know, right?', ily: 'I like you (friendly)', nvm: 'never mind', ofc: 'of course', pls: 'please', plz: 'please', rn: 'right now', ttyl: 'talk to you later', gtg: 'got to go', g2g: 'got to go', gn: 'good night', gm: 'good morning', wyd: 'what are you doing', wdym: 'what do you mean', hbu: 'how about you', wbu: 'what about you', ig: 'I guess', icl: "I can't lie", fyi: 'for your information', iirc: 'if I remember correctly', ez: 'easy (people say it after a win)', op: 'overpowered, way too strong', nerf: 'when a card gets made weaker in an update', buff: 'when a card gets made stronger in an update', meta: 'the cards and squads most people think are best right now', carry: 'when one player or card does most of the work for the team', noob: 'someone new to the game', newb: 'someone new to the game', pvp: 'player vs player', pve: 'player vs the game', dps: 'damage per second, basically how much damage something does', aoe: 'area of effect, a move that hits everyone', cd: 'cooldown, how many turns before a move is ready again', rng: 'random luck', tank: 'a card that soaks up hits for the team', heals: 'healing moves', clutch: 'winning when it looked lost', sus: 'suspicious', goat: 'greatest of all time', lowkey: 'kind of, a little', highkey: 'very much', bet: 'okay, sounds good', cap: 'a lie', nocap: 'no lie, for real', mid: 'just okay, average', w: 'a win', l: 'a loss', ratio: 'when a reply gets more likes than the post', vibe: 'the feeling or mood', salty: 'upset about losing', tryhard: 'someone playing super serious', grind: 'playing a lot to level up or earn stuff', f2p: 'free to play', gl: 'good luck', hf: 'have fun', glhf: 'good luck, have fun', ez4: 'easy for (someone)',
    kyber: 'the blue crystals, the rare currency for crates and big upgrades', beskar: 'the HoloNet metal you earn from the arena and raids', credits: 'the gold coins for upgrades and the Black Market', tm: 'Turn Meter, the bar that fills until a card gets its turn', ult: 'ultimate, a card\'s big move once its meter is full', doctrine: 'a bonus a card gives its whole squad', holo: 'a shiny foil version of a card you pulled', puck: 'a HoloNet crate you open for cards', elder: 'a guild rank between member and co-leader',
  };
  const SLANG_Q = [/\bwhat\s*(?:does|do|is|'s|s)\s+["'“]?([a-z0-9]{1,9})["'”]?\s*(?:mean|stand for)?\s*\??$/i, /\bwhat\s+(?:does|do)\s+["'“]?([a-z0-9]{1,9})["'”]?\s+mean/i, /^\s*["'“]?([a-z0-9]{1,9})["'”]?\s*\?+\s*$/i, /\bwhats?\s+["'“]?([a-z0-9]{1,9})["'”]?\s*\??$/i, /\bmeaning of\s+["'“]?([a-z0-9]{1,9})/i];
  const slangAsk = (t) => { for (const re of SLANG_Q) { const m = t.match(re); if (m) { const k = m[1].toLowerCase(); if (GLOSS[k]) return k; } } return null; };

  // ---------- Privacy: never ask for, keep or repeat personal details ----------
  const PERSONAL = [/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i, /\bmy (?:real )?name is\b/i, /\bi live (?:in|at|on)\b/i, /\bmy (?:home )?address\b/i, /\bi'?m \d{1,2}\s*(?:years?|yrs?|y\/?o)\b/i, /\bmy school is\b|\bi go to [a-z ]+ (?:school|elementary|middle|high)\b/i, /\b(?:snap|snapchat|insta|instagram|tiktok|discord|whatsapp)\b.*\b(?:is|me|add)\b/i, /\bpassword\b/i, /\bmy (?:phone|number)\b/i];
  const ASK_PERSONAL = [/\bhow old are you\b/i, /\bwhere (?:do )?you live\b/i, /\bwhat'?s your (?:real )?name\b/i, /\bwhat school\b/i, /\b(?:your|ur) (?:snap|insta|discord|number)\b/i];
  const PRIV = ["let's keep that private 🙂 you never have to share stuff like that here", "no need to share that, keep personal stuff private! anyway", "hey, keep that private 🙂 internet rule #1"];
  const PRIV_ME = ["haha I keep that stuff private, internet rules 🙂", "I don't share that kind of thing online, you shouldn't either 🙂", "secret 😄 but ask me anything about the game"];

  // ---------- Memory (tiny, game-only, fades after 3 weeks) ----------
  const MEM = () => { const h = S(); h.botMem = h.botMem || {}; return h.botMem; };
  const remember = (uid, key, val, follow) => { const m = MEM(); const r = m[uid] = m[uid] || {}; r[key] = { v: val, at: Date.now(), follow: follow || 0 }; const keys = Object.keys(r); if (keys.length > 10) delete r[keys.sort((a, b) => r[a].at - r[b].at)[0]]; HN.save(); };
  const recall = (uid, key) => { const r = (MEM()[uid] || {})[key]; return r && Date.now() - r.at < 21 * 86400000 ? r : null; };
  const findCard = (t) => { const s = t.toLowerCase(); let best = null; for (const u of D.UNITS) { if (u.boss || u.raid || u.exclusive) continue; const n = u.name.toLowerCase(); const short = n.split(' ').slice(-1)[0]; if (s.includes(n) || (short.length > 3 && new RegExp(`\\b${short}\\b`).test(s))) { if (!best || n.length > best.name.length) best = u; } } return best; };

  // ---------- Game answers ----------
  const raidBoss = () => { try { const g = SO.graidNow(); return { name: g.name, ground: D.UNIT_MAP[g.ground.boss] ? D.UNIT_MAP[g.ground.boss].name : 'the boss', fleet: D.UNIT_MAP[g.fleet.boss] ? D.UNIT_MAP[g.fleet.boss].name : 'the flagship' }; } catch (e) { return { name: 'the raid', ground: 'the boss', fleet: 'the flagship' }; } };
  function gameAnswer(t, p) {
    if (/how (?:do|can) (?:i|you|u) (?:get|earn|farm) (?:more )?kyber|need kyber/i.test(t)) return pick(['kyber comes from campaign stars, badges and events mostly. clear stages with all 3 stars', 'campaign 3-star clears and badge tiers are the steady kyber. events give a bunch too'], hash(t));
    if (/how (?:do|can) (?:i|you|u) (?:get|earn|farm) (?:more )?beskar|need beskar/i.test(t)) return pick(['beskar is arena wins, raids and guild rewards. hitting both raid fronts every day adds up fast', 'arena + raids. do your 3 raid runs a day and it stacks'], hash(t));
    if (/how (?:do|can) (?:i|you|u) (?:get|earn|farm) (?:more )?credits/i.test(t)) return 'credits come from pretty much every battle, campaign is the easiest farm';
    const lv = t.match(/what (?:unlocks|do (?:i|you) get) at (?:level |lvl |lv )?(\d{1,2})/i);
    if (lv && root.BattleUI && root.BattleUI.levelUnlocks) { const n = +lv[1]; const hit = root.BattleUI.levelUnlocks().filter((x) => x.level === n).map((x) => x.name); return hit.length ? `level ${n} gets you ${hit.join(' and ')}` : `nothing big at ${n} I think, the next unlocks are a few levels up`; }
    if (/raid/i.test(t) && /(tip|help|how|beat|squad|team)/i.test(t)) { const r = raidBoss(); return pick([`for ${r.name}: stun before ${r.ground} uses its big move, and save heals for after. fleet side, focus ${r.fleet} last`, `bring a tank with taunt for ${r.ground}, it hits hard. do both fronts every day`], hash(t)); }
    if (/(best|good) (?:squad|team)/i.test(t)) return p.id === 'veteran' ? 'tank, healer, two attackers and one support. then match doctrines, a whole squad with the same trait gets the bonus' : 'mix a tank, a healer and attackers, then try to match doctrines so the whole squad gets the bonus';
    const c = /\b(is|are|how good|thoughts on|opinion on|rate)\b/i.test(t) && findCard(t);
    if (c) { const r = c.rarity; return pick([`${c.name} is solid for a ${r}. ${c.abilities[1] ? `${c.abilities[1].name} is the move that matters` : 'easy to use'}`, `${c.name}? ${r === 'common' || r === 'rare' ? 'better than people think, especially with its doctrine' : 'yeah strong, build around it'}`], hash(c.id + t)); }
    return null;
  }
  // The lore nerd explains why things work the way they do.
  const NERD = ['the Vulture Droid walking on four legs actually makes sense, four legs is the most stable way to stand', 'the TIE Defender has three wings so it\'s steadier than a normal TIE, that\'s why it can carry shields', 'Droidekas roll because a ball is the fastest way to move on a flat floor, then they unfold and plant', 'the Jedi Starfighter uses an astromech in the wing because the cockpit is too small for one inside', 'Turn Meter is basically initiative, faster cards just get more turns, that\'s why speed is so good'];

  // ---------- Small talk ----------
  const TALK = {
    hi: ['hey!', 'yo whats up', 'hey hey', 'heyy', 'sup', 'hi! how\'s it going'],
    how: ['good! just grinding raids. you?', 'pretty good, pulled a nice card earlier. how about you?', 'tired lol but good. wbu', 'doing good, what are you up to?'],
    wyd: ['just doing my raid runs', 'opening crates rn', 'farming campaign stars', 'arena, trying to climb', 'nothing much, chilling. you?'],
    school: ['ugh school. at least you get to play after', 'school days are long fr. what class is the worst?', 'hang in there, weekend is close'],
    food: ['ok now I\'m hungry lol', 'that sounds so good', 'pizza is always the answer'],
    pet: ['aww what kind?', 'pets are the best', 'that\'s so cute'],
    weekend: ['weekend grind time', 'any plans this weekend?', 'raids all weekend for me lol'],
    movie: ['which one is your favourite?', 'the original trilogy is the best, change my mind', 'did you see the new one?'],
    thanks: ['np!', 'anytime', 'no problem 🙂', 'yw!'],
    nice: ['nice!!', 'lets gooo', 'that\'s huge', 'congrats!'],
    sad: ['oof, that happens, you\'ll get the next one', 'unlucky. rng is rough sometimes', 'happens to everyone, keep at it'],
  };
  function smallTalk(t, k) {
    if (/^\s*(?:hi+|hey+|yo|hello|sup|hiya|heyo)\b/i.test(t)) return pick(TALK.hi, k);
    if (/how (?:are|r) (?:you|u)|how'?s it going|hru\b/i.test(t)) return pick(TALK.how, k);
    if (/\bwyd\b|what (?:are|r) (?:you|u) doing/i.test(t)) return pick(TALK.wyd, k);
    if (/\b(?:school|homework|class|teacher)\b/i.test(t)) return pick(TALK.school, k);
    if (/\b(?:pizza|food|dinner|lunch|tacos|burger|snack|hungry)\b/i.test(t)) return pick(TALK.food, k);
    if (/\b(?:dog|cat|puppy|kitten|pet)\b/i.test(t)) return pick(TALK.pet, k);
    if (/\bweekend|saturday|sunday\b/i.test(t)) return pick(TALK.weekend, k);
    if (/\b(?:movie|film|show|mandalorian|andor|clone wars)\b/i.test(t)) return pick(TALK.movie, k);
    if (/\b(?:thanks|thank you|ty|thx|tysm)\b/i.test(t)) return pick(TALK.thanks, k);
    if (/\b(?:pulled|got|won|beat|promoted|legendary|mythic|holo)\b/i.test(t) && !/\?/.test(t)) return pick(TALK.nice, k);
    if (/\b(?:lost|unlucky|rip|ugh|hate)\b/i.test(t)) return pick(TALK.sad, k);
    return null;
  }

  // ---------- Live status, by real online hours ----------
  // Share of players online by local hour: peak around 8 PM, quietest around 4 AM (ByteBrew's study of 1B+ players).
  const CURVE = [0.22, 0.15, 0.11, 0.08, 0.06, 0.07, 0.11, 0.18, 0.24, 0.28, 0.31, 0.34, 0.38, 0.40, 0.43, 0.49, 0.58, 0.70, 0.84, 0.95, 1.0, 0.92, 0.70, 0.42];
  const onlineChance = (p, h) => { let c = CURVE[h] * 0.6; const [a, b] = p.hours; const hh = h < a - 12 ? h + 24 : h; if (hh >= a && hh <= b) c += 0.25; if (h <= 3 && p.owl) c += p.owl * 0.4; return Math.min(0.92, c); };
  function now(uid) {
    if (!/^(bot|npc):/.test(String(uid))) return null;
    const p = persOf(uid); const slot = Math.floor(Date.now() / 600000);
    const r = HN.rng(hash(uid) + slot * 131)(); const h = ctHour();
    const pending = (S().botInv || {})[uid];
    if (pending && pending.busyUntil > Date.now()) return { on: true, busy: true, txt: `Online · ${pending.doing}`, doing: pending.doing };
    if (pending && pending.played && Date.now() - pending.played < 15 * 60000) return { on: true, busy: false, txt: 'Online · In the friends list', doing: 'In the friends list' };
    if (r < onlineChance(p, h)) {
      const k = HN.rng(hash(uid) * 7 + slot)();
      const rb = raidBoss(); const planets = D.PLANETS || []; const pl = planets.length ? planets[Math.floor(k * planets.length)] : null;
      const cards = D.UNITS.filter((u) => !u.boss && !u.raid && !u.exclusive);
      const card = cards[Math.floor(k * 997) % cards.length];
      const acts = [`Fighting ${rb.ground}`, `Raiding ${rb.name}`, 'In an arena battle', 'In a duel', pl ? `On ${pl.name}, stage ${1 + Math.floor(k * 9)}` : 'In a campaign battle', 'Opening crates', `Upgrading ${card.name}`, 'Fighting Darth Vader', 'Browsing the Black Market', 'In the guild chat'];
      const doing = acts[Math.floor(k * acts.length)];
      return { on: true, busy: !/Browsing|guild chat|crates|Upgrading/.test(doing), txt: `Online · ${doing}`, doing };
    }
    const hrs = 1 + Math.floor(r * 20);
    return { on: false, txt: hrs < 24 ? `Last seen ${hrs}h ago` : 'Last seen yesterday' };
  }

  // ---------- Private chat replies ----------
  const API = () => HN.botChatApi || null;
  // Post a bot line into the private chat after a typing delay (longer lines take longer).
  function postDm(uid, text, delay) {
    const A = API(); if (!A) return;
    const c = A.BCH()[uid] || (A.BCH()[uid] = []);
    const t = Date.now() + Math.max(1500, delay || (1800 + text.length * 70));
    c.push({ x: String(text).slice(0, 160), t, pend: 1 });
    while (c.length > 40) c.shift();
    HN.save();
    setTimeout(() => A.redraw(), t - Date.now() + 150);
  }
  const DONE_RE = /\b(?:i'?m done|im done|i quit|rage ?quit(?:ting)?|gtg|g2g|gotta go|got to go|bye|cya|see ya|later|stop asking|no more|enough)\b/i;
  const BATTLE_RE = /\b(?:wanna|want to|lets|let's|can we|u want|you want)\b.*\b(?:battle|fight|1v1|duel|play|friendly)\b|\b(?:1v1|rematch|fight me|battle me|duel me)\b/i;
  function dm(uid, text) {
    const p = persOf(uid); const t = String(text).toLowerCase(); const k = hash(uid + t);
    const my = nick(SO.prof ? (SO.prof('me') || {}).tag : '', []);
    const st = S(); st.botCool = st.botCool || {};
    if (PERSONAL.some((re) => re.test(text))) return voice(p, pick(PRIV, k));
    if (ASK_PERSONAL.some((re) => re.test(text))) return voice(p, pick(PRIV_ME, k));
    if (DONE_RE.test(t)) { st.botCool[uid] = Date.now() + 6 * 3600000; HN.save(); return voice(p, pick(['all good, gg! catch you later', 'fair lol, gg. later!', 'ok ok no more, see ya 👋', 'np, good games today'], k)); }
    const s = slangAsk(t);
    if (s) return voice(p, `${s} means ${GLOSS[s]}${p.id === 'helper' || p.id === 'rookie' ? '! no worries, everyone has to learn it once' : ''}`);
    if (BATTLE_RE.test(t)) return battleAsk(uid, /fleet|ship|space/i.test(t) ? 'ship' : 'character', true);
    // Memory: a favourite card, a test coming up.
    const fav = t.match(/\bmy (?:fav|favorite|favourite|main)\b.*\b(?:is|=)\b/) || t.match(/\bi (?:love|main)\b/);
    if (fav) { const c = findCard(t); if (c) { remember(uid, 'fav', c.id); return voice(p, pick([`${c.name} is a great pick`, `${c.name}!! good taste`, `ok ${c.name} fan noted 😄`], k)); } }
    if (/\b(?:test|exam|quiz|tournament|game|match|recital)\b.*\b(?:tomorrow|tmrw|friday|monday|next week|soon)\b/i.test(t)) { remember(uid, 'event', /test|exam|quiz/i.test(t) ? 'test' : 'game', Date.now() + (1 + Math.floor(rnd() * 2)) * 86400000); return voice(p, pick(['good luck!! you got this', 'gl! let me know how it goes', 'you\'ll do great'], k)); }
    const g = gameAnswer(text, p); if (g) return voice(p, g);
    const sm = smallTalk(text, k); if (sm) return voice(p, sm);
    if (p.id === 'nerd' && rnd() < 0.3) return voice(p, pick(NERD, k));
    if (/\?\s*$/.test(t)) return voice(p, pick(['hmm good question', 'not sure tbh', 'probably yeah', 'maybe after this match'], k));
    return voice(p, pick(['lol', 'true', 'haha yeah', 'facts', 'same', 'nice', `yeah ${my || ''}`.trim()], k));
  }
  // Follow-ups from memory: "how'd the test go?" a day or two later.
  function followUps() {
    const A = API(); if (!A) return;
    for (const [uid, r] of Object.entries(MEM())) {
      const e = r.event; if (!e || !e.follow || Date.now() < e.follow) continue;
      const p = persOf(uid); e.follow = 0; HN.save();
      postDm(uid, voice(p, e.v === 'test' ? pick(['hey how\'d the test go?', 'did the test go ok?'], hash(uid)) : pick(['how did the game go?', 'did you win your game?'], hash(uid))), 4000);
    }
  }

  // ---------- Friendly battles with bot friends ----------
  const INV = () => { const h = S(); h.botInv = h.botInv || {}; return h.botInv; };
  const REC = () => { const h = S(); h.botRec = h.botRec || {}; return h.botRec; };
  const nameOf = (uid) => { const A = API(); const b = A && A.BF()[uid]; return (b && b.name) || Net.name(uid); };
  // Returns the bot's first line when it's answering a chat message; otherwise posts it.
  const low = (x) => { const w = String(x).split(' '); return [w[0].toLowerCase(), ...w.slice(1)].join(' '); };
  function battleAsk(uid, kind, inline) {
    const p = persOf(uid); const n = now(uid) || { on: true };
    const say = (line, wait) => { if (inline) return line; postDm(uid, line, wait); return null; };
    const v = INV()[uid];
    if (v && v.busyUntil > Date.now()) return say(voice(p, pick(['still finishing up, almost done!', 'one more min lol', 'almost done, hang on'], hash(uid))));
    if (!n.on) {
      // Offline: they see it when they get back on (the chat already waits a while for the reply).
      INV()[uid] = { kind, offerAt: Date.now() + 75000 + rnd() * 30000 }; HN.save();
      return say(voice(p, pick(['just saw this, yeah lets do it', 'oh hey just got on, sure', 'sorry was afk, im down'], hash(uid))), 60000);
    }
    if (n.busy) {
      const doing = n.doing || 'In a battle';
      const mins = 2 + Math.floor(rnd() * 4);
      INV()[uid] = { kind, busyUntil: Date.now() + mins * 60000, offerAt: Date.now() + mins * 60000 + 4500, back: 1, doing };
      HN.save();
      return say(voice(p, pick([`give me a sec, ${low(doing)} rn 😅`, `one sec, ${low(doing)}. I'll send you one after`, `brb finishing this, ${low(doing)}`], hash(uid + doing))));
    }
    INV()[uid] = { kind, offerAt: Date.now() + (inline ? 7000 : 4500) }; HN.save();
    return say(voice(p, pick(['sure! sending it', 'yeah lets go', 'bet, sending now', "ok you're on"], hash(uid + kind))));
  }
  // Sends the battles that are due (survives a reload).
  function dueOffers() {
    for (const [uid, v] of Object.entries(INV())) {
      if (!v.offerAt || Date.now() < v.offerAt) continue;
      if (UI.App.battleActive) continue;
      const late = Date.now() - v.offerAt > 30 * 60000; const kind = v.kind;
      v.offerAt = 0; HN.save();
      if (late) continue; // too long ago: the moment passed
      if (v.back) { postDm(uid, voice(persOf(uid), pick(['ok done! sending you one now', 'ok back, sending it', 'done lol, battle incoming'], hash(uid))), 1500); setTimeout(() => offer(uid, kind), 3500); } else offer(uid, kind);
    }
  }
  function offer(uid, kind) {
    const inv = INV()[uid] = { kind, busyUntil: 0, offered: Date.now() };
    HN.save();
    const nm = nameOf(uid);
    toast(`⚔ ${nm} sent you a friendly battle · ${kind === 'ship' ? 'Fleet' : 'Ground'}`, { onTap: () => start(uid, kind), tap: 'Tap to battle' });
    // A single "ready yet?" a few minutes later, never more.
    setTimeout(() => { const v = INV()[uid]; if (v && v.offered === inv.offered && !v.played && !v.nudged && !(S().botCool || {})[uid]) { v.nudged = 1; HN.save(); postDm(uid, voice(persOf(uid), pick(['you ready yet?', 'ready now?', 'still up for it?'], hash(uid)))); } }, (3 + Math.floor(rnd() * 3)) * 60000);
  }
  function botSquad(uid, kind) {
    let bp = null; try { bp = HN.botProfile ? HN.botProfile(uid) : null; } catch (e) { bp = null; }
    const rating = (bp && bp.rating) || (HN.S().rating || 1200);
    return HN.botSquad(kind, rating, HN.rng(hash(uid) + Date.now() % 997), true);
  }
  function start(uid, kind) {
    if (UI.App.battleActive) return toast('Finish your battle first.');
    const squad = HN.squadEntries ? HN.squadEntries(kind) : [];
    if (!squad.length) return toast('Pick a squad first.');
    document.querySelectorAll('#modal-root > *').forEach((n) => n.remove());
    const v = INV()[uid] || (INV()[uid] = {}); v.played = Date.now(); v.kind = kind; v.busyUntil = 0; HN.save();
    HN.hnStart({ type: 'hn', hn: 'botfr', kind, uid }, squad, botSquad(uid, kind), { name: `Friendly · vs ${nameOf(uid)}`, kind, planet: kind === 'ship' ? 'coruscant' : 'geonosis', intro: 'A friendly battle: no rating, nothing to lose.' });
  }
  function done(uid, kind, won) {
    const rec = REC()[uid] = REC()[uid] || { w: 0, l: 0 }; if (won) rec.w++; else rec.l++; HN.save();
    const p = persOf(uid); const nm = nameOf(uid);
    const line = won ? pick(['gg! you got me', 'gg, nice one', p.id === 'rival' ? 'ok you got me that time 😤' : 'gg wp'], hash(uid + rec.w)) : pick(['gg! that was close', 'gg ez... jk that was close lol', p.id === 'rival' ? 'gg, I\'m up now 😏' : 'ggs'], hash(uid + rec.l));
    postDm(uid, voice(p, line), 2500);
    const cool = (S().botCool || {})[uid] > Date.now();
    if (!cool && rnd() < 0.4) postDm(uid, voice(p, rnd() < 0.6 ? pick(['rematch?', 'run it back?', 'one more?'], hash(uid)) : pick([`wanna switch it up? ${kind === 'ship' ? 'ground' : 'fleet'} this time?`, 'switch it up, different mode?'], hash(uid))), 6500);
    const m = UI.openModal(`<div class="hn-result"><div class="result-title ${won ? 'win' : 'lose'}">${won ? 'VICTORY' : 'DEFEAT'}</div>
      <p style="text-align:center">Friendly battle against <b>${UI.esc(nm)}</b> · ${kind === 'ship' ? 'Fleet' : 'Ground'}</p>
      <div class="rows"><div><span>Your record vs ${UI.esc(nm)}</span><b class="bf26-r"><span class="w">${rec.w} W</span> · <span class="l">${rec.l} L</span></b></div></div>
      <div class="modal-actions"><button type="button" class="btn" data-bfx>Back to friends</button><button type="button" class="btn btn-primary" data-bfre>Rematch</button></div></div>`, { small: true, dismissable: false, cls: 'result-modal' });
    m.root.addEventListener('click', (e) => {
      const back = () => { m.close(); UI.App.go('holonet'); if (HN.friends && HN.friends.open) HN.friends.open(); };
      if (e.target.closest('[data-bfx]')) back();
      if (e.target.closest('[data-bfre]')) { back(); battleAsk(uid, kind); }
    });
  }
  const BUI = root.BattleUI;
  if (BUI && !BUI.__bots26) {
    BUI.__bots26 = true;
    const baseFinish = BUI.finish;
    BUI.finish = async function (winner) {
      const p = this.params || {};
      if (p.type !== 'hn' || p.hn !== 'botfr') return baseFinish.call(this, winner);
      this.ended = true; this.setActive(null);
      await new Promise((r) => setTimeout(r, 900));
      const won = winner === 'player';
      if (root.Sound) { root.Sound.play(won ? 'victory' : 'defeat'); root.Sound.music('menu'); }
      this.teardown();
      done(p.uid, p.kind, won);
    };
    const P = root.Player; const baseComplete = P.completeEncounter;
    P.completeEncounter = function (params, won, r) {
      if (params && params.type === 'hn' && params.hn === 'botfr') { const rec = REC()[params.uid] = REC()[params.uid] || { w: 0, l: 0 }; rec.l++; HN.save(); }
      return baseComplete.call(this, params, won, r);
    };
  }
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-fbotbat]'); if (!b) return; e.preventDefault(); e.stopPropagation();
    const uid = b.dataset.uid; const kind = b.dataset.fbotbat === 'ship' ? 'ship' : 'character'; const A = API();
    if (A) { const c = A.BCH()[uid] || (A.BCH()[uid] = []); c.push({ me: 1, x: `⚔ Friendly battle? · ${kind === 'ship' ? 'Fleet' : 'Ground'}`, t: Date.now() }); HN.save(); }
    battleAsk(uid, kind);
    if (HN.friends && HN.friends.F) { HN.friends.F.botChat = uid; if (A) A.redraw(); }
  }, true);

  // ---------- Bot guilds: replies, nicknames, reactions ----------
  const npcTag = (uid) => { try { return Net.name(uid); } catch (e) { return ''; } };
  function guildReply(gid, crew, said) {
    if (!crew || !crew.length) return;
    const h = S(); const t = String(said || '');
    h.npcChat = (h.npcChat || []).filter((m) => Date.now() - m.ts < 2 * 86400000).slice(-24);
    const meTag = (SO.prof('me') || {}).tag || ''; const my = nick(meTag, crew.map(npcTag));
    const byP = (id) => crew.filter((u) => persOf(u).id === id);
    const choose = (pref) => { const list = pref.map(byP).flat(); return list.length ? list[Math.floor(rnd() * list.length)] : crew[Math.floor(rnd() * crew.length)]; };
    const push = (uid, line, delay) => { h.npcChat.push({ g: gid, uid, t: line.slice(0, 140), ts: Date.now() + delay }); };
    let lead = null; let line = null;
    if (PERSONAL.some((re) => re.test(t))) { lead = choose(['helper', 'veteran']); line = `${my ? `${my}, ` : ''}${pick(PRIV, hash(t))}`; }
    else if (ASK_PERSONAL.some((re) => re.test(t))) { lead = choose(['joker', 'helper']); line = pick(PRIV_ME, hash(t)); }
    else { const s = slangAsk(t); if (s) { lead = choose(['helper', 'rookie', 'nerd']); line = `${s} = ${GLOSS[s]}${my ? ` ${my}` : ''}`; } }
    if (!line) { const g = gameAnswer(t, persOf(crew[0])); if (g) { lead = choose(['veteran', 'nerd', 'helper']); line = g; } }
    if (!line) { const sm = smallTalk(t, hash(t)); if (sm && rnd() < 0.85) { lead = choose(['rookie', 'joker', 'hype', 'helper']); line = /^(hey|yo|hi|sup)/i.test(sm) && my ? `${sm.replace(/!$/, '')} ${my}!` : sm; } }
    if (!line && rnd() < 0.45) { lead = choose(['joker', 'rookie', 'hype', 'rival']); line = pick(['lol', 'facts', 'true', 'haha', 'real', 'same tbh', 'W'], hash(t)); }
    if (line && lead) { const p = persOf(lead); const v = voice(p, line); push(lead, v, 2500 + v.length * 80 + rnd() * 9000); }
    // A greeting sometimes gets a second hello.
    if (line && /^(hey|yo|hi|hello|sup)/i.test(t) && rnd() < 0.35) { const u2 = choose(['hype', 'rookie']); if (u2 !== lead) push(u2, voice(persOf(u2), `${pick(['yo', 'hey', 'heyy'], hash(u2))}${my ? ` ${my}` : ''}`), 9000 + rnd() * 12000); }
    // A rare reaction on your message: about 1 in 15, never two in a row.
    h.botRx = h.botRx || {}; h.botRxLast = h.botRxLast || 0;
    if (rnd() < 1 / 15 && Date.now() - h.botRxLast > 60000) setTimeout(() => { const mine = SO.G.chat.find((c) => c.uid === Net.me); const last = mine && (mine.msgs || []).filter((m) => m.g === gid).slice(-1)[0]; if (!last) return; const e = /lol|haha|joke|😂/.test(t) ? '😂' : /pulled|won|beat|promot|legend|gg/i.test(t) ? '🔥' : pick(['👍', '❤️', '🔥'], hash(t)); h.botRx[`${Net.me}_${last.ts}`] = e; h.botRxLast = Date.now(); HN.save(); }, 2500);
    HN.save();
    setTimeout(() => { try { if (SO.gtabNow() === 'chat') SO.rerender(); } catch (e) { /* not open */ } }, 3000);
    setTimeout(() => { try { if (SO.gtabNow() === 'chat') SO.rerender(); } catch (e) { /* not open */ } }, 15000);
  }
  const rx = (gid, uid, ts) => { if (!(typeof gid === 'string' && gid.startsWith('npc_'))) return null; const m = S().botRx; return m ? m[`${uid}_${ts}`] || null : null; };

  // ---------- Update talk and strategy tips in bot guilds ----------
  const relAt = () => { const at = root.Update26.at; if (at != null) return at; const h = S(); if (!h.v26seen) { h.v26seen = Date.now(); HN.save(); } return h.v26seen; };
  const UPD_EARLY = ['2.6 is out!! anyone tried the new Vulture Droid yet?', 'wonder how the Jedi Starfighter plays now that Repair only cleanses', 'Force Sense on the Jedi Starfighter looks kinda strong for raids', 'new TIE Defender looks sick, Shield Array on the whole squad?', 'guild analytics is out, leaders go look at the promotion breakdown', 'what do we think of the Droideka rolling in now', 'Starkiller got buffed, finally'];
  const UPD_LATE = ['ok after testing: Vulture Droid + B2 + Grievous with the droid doctrine is actually nasty, Swarm Tactics softens everyone up', 'after a bunch of runs, Jedi Starfighter with Force Sense first then Twin Laser Burst is the play for fleet raid', 'tested TIE Defender all night: Tractor Lock always stuns now, save it for their healer', 'Hound\'s Tooth with Scent of the Prey then Trandoshan Hunt finishes people off so fast', 'Droideka Roll In early takes their offense down, then taunt. great raid tank', 'Rey strips buffs before Force Awakens now, she wrecks shielded tanks', 'Mando\'s N-1 Proton Torpedo on anything under 40% is a delete button'];
  const TIPS = ['tip: stun right before their ultimate is ready, not after', 'tip: a whole squad sharing a trait gets the doctrine bonus, it adds up fast', 'tip: Turn Meter boosts are better than they look, more turns = more damage', 'tip: do both raid fronts every day, the guild rewards need both', 'tip: save cleanses for burn and stun, not small debuffs', 'tip: put your tank first so taunt is up before their big hitters move'];
  function topical(gid, r) {
    const k = r();
    const since = (Date.now() - relAt()) / 3600000;
    if (since >= 0 && since < 24 * 7 && k < 0.35) return since < 4 ? pick(UPD_EARLY, Math.floor(r() * 1000)) : pick(since < 30 ? UPD_LATE.concat(UPD_EARLY.slice(0, 2)) : UPD_LATE, Math.floor(r() * 1000));
    if (k > 0.9) return pick(TIPS, Math.floor(r() * 1000));
    if (k > 0.86) return pick(NERD, Math.floor(r() * 1000));
    return null;
  }

  // ---------- Day-one promotions in bot guilds ----------
  function promotions() {
    try {
      const gid = SO.myGuildId(); if (!gid || !gid.startsWith('npc_')) return;
      const g = SO.gmap.get(gid); if (!g) return;
      const h = S(); h.npcRank = h.npcRank || {};
      const me = Net.me || 'me';
      if (h.npcRank[gid] === 'elder' && !(g.elders || []).includes(me)) g.elders = [...(g.elders || []), me];
      const wk = Math.floor((Date.now() - 6 * 3600000) / (7 * 86400000));
      if (h.npcRank.check === wk) return; // once a week
      const crew = SO.membersOf(gid);
      const pts = crew.map((u) => ({ u, p: SO.weekPoints(u) })).sort((a, b) => b.p - a.p);
      const myRank = pts.findIndex((x) => x.u === me || x.u === 'me') + 1;
      const a = HN.a26 ? HN.a26() : null; const days = a ? a.gp.filter((n, i) => n + a.bt[i] > 0).length : 0;
      const leader = g.lead; const say = (txt) => { h.npcChat = (h.npcChat || []).concat([{ g: gid, uid: leader, t: txt.slice(0, 140), ts: Date.now() + 4000 }]); };
      const myTag = nick((SO.prof('me') || {}).tag || '', crew.map(npcTag)) || 'you';
      if (h.npcRank[gid] !== 'elder' && myRank > 0 && myRank <= 3 && days >= 4) {
        h.npcRank[gid] = 'elder'; g.elders = [...(g.elders || []), me];
        say(`promoting ${myTag} to Elder: top ${myRank} in guild points this week and on ${days} of 7 days. well earned`);
      } else if (h.npcRank[gid] === 'elder' && days <= 1 && myRank > Math.max(5, crew.length - 3)) {
        if (!h.npcRank.warned) { h.npcRank.warned = wk; say(`hey ${myTag}, quiet week. elders keep the guild going, hope to see you on the raid`); }
        else if (wk > h.npcRank.warned) { delete h.npcRank[gid]; delete h.npcRank.warned; g.elders = (g.elders || []).filter((x) => x !== me); say(`moved ${myTag} back to member for now, the Elder seat goes to whoever's most active. come back anytime`); }
      }
      h.npcRank.check = wk; HN.save();
    } catch (e) { /* the guild isn't loaded yet */ }
  }

  HN.botBrain = { now, dm, guildReply, rx, topical, nick, persOf, start };
  setInterval(() => { if (!document.hidden) { followUps(); promotions(); } }, 60000);
  setInterval(() => { if (!document.hidden) dueOffers(); }, 5000);
  setTimeout(() => { followUps(); promotions(); }, 8000);
  const st = document.createElement('style');
  st.textContent = '.bf26-r .w{color:#7af0a0}.bf26-r .l{color:#ff7a7a}';
  document.head.appendChild(st);
})(window);
