// Text filter for the main game (built from the HoloNet filter). Loaded on demand.
// HoloNet text safety: a family-friendly filter for chat, callsigns and guild
// names. Swears are masked (stars); slurs, hate and threats block the whole
// message. It sees through the usual tricks: s p a c e d letters, f.u.c.k,
// symbols for letters (sh1t, $hit, f*ck), and stretched letters (fuuuck),
// without flagging normal words that merely contain a bad one (class, hello,
// assassin, Dickens). Links, emails and phone numbers are masked too.
(function (root) {
  'use strict';


  // Words that block the whole message.
  const BLOCK = [
    'nigger', 'nigga', 'niggah', 'nigguh', 'niga', 'negro', 'faggot', 'fagot', 'fag', 'fags', 'retard', 'retarded', 'tranny', 'kike', 'spic', 'spick', 'chink', 'gook', 'wetback',
    'coon', 'dyke', 'beaner', 'raghead', 'towelhead', 'paki', 'jap', 'nazi', 'hitler', 'heil', 'kkk', 'rape', 'raped', 'rapist', 'raping', 'molest', 'pedo', 'pedophile', 'porn', 'porno',
    'kys', 'killyourself', 'killurself', 'killyoself', 'hangyourself', 'suicide',
    // More spellings and slurs.
    'nigg', 'nig', 'nigs', 'niggas', 'niggers', 'nigglet', 'nibba', 'nibbas', 'niqqa', 'niqqer', 'nigra', 'negroid', 'snigger', 'sniggers', 'faggots', 'fagg', 'faggy', 'fagboy', 'maricon', 'trannies',
    'retards', 'tard', 'spaz', 'mong', 'kikes', 'chinks', 'gooks', 'spics', 'coons', 'jigaboo', 'porchmonkey', 'junglebunny', 'sandnigger', 'gypo', 'gyppo', 'zipperhead', 'golliwog', 'wog',
    'whitepower', 'heilhitler', 'siegheil', 'nazis', 'swastika', 'rapes', 'rapey', 'molester', 'pedophiles', 'paedo', 'pedos', 'kms', 'killmyself', 'neckyourself', 'killurselfnow',
  ];
  // Words that are masked.
  const MASK = [
    'fuck', 'fucks', 'fucked', 'fucker', 'fuckers', 'fucking', 'fuckin', 'fck', 'fk', 'fuk', 'fuq', 'phuck', 'phuk', 'fvck', 'fvk', 'fcuk', 'fick', 'fyck', 'fvking', 'fvcking', 'motherfucker', 'wtf', 'stfu', 'gtfo',
    'shit', 'shits', 'shitty', 'shitting', 'bullshit', 'sht', 'bitch', 'bitches', 'bitchy', 'btch', 'biatch', 'bastard', 'asshole', 'ass', 'asses', 'arse', 'arsehole', 'jackass', 'dumbass', 'badass',
    'dick', 'dicks', 'dickhead', 'cock', 'cocks', 'pussy', 'cunt', 'cunts', 'twat', 'whore', 'whores', 'slut', 'sluts', 'piss', 'pissed', 'damn', 'dammit', 'goddamn', 'hell',
    'tits', 'titties', 'boobs', 'boob', 'penis', 'vagina', 'sex', 'sexy', 'nude', 'nudes', 'horny', 'wanker', 'bollocks', 'prick', 'douche', 'douchebag', 'thot',
    // More swears, rude words and spellings.
    'fking', 'fkn', 'fcking', 'fucken', 'fuckface', 'fuckwit', 'fux', 'fukc', 'fucc', 'fawk', 'effing', 'shite', 'shithead', 'shithole', 'shitter', 'azz', 'asshat', 'asswipe', 'arsed',
    'dildo', 'cum', 'cumming', 'jizz', 'blowjob', 'handjob', 'anal', 'anus', 'orgasm', 'masturbate', 'fap', 'milf', 'onlyfans', 'hentai', 'boner', 'erection', 'pornhub', 'xxx', 'stripper', 'hooker',
    'puta', 'puto', 'mierda', 'pendejo', 'cabron', 'joder', 'merde', 'scheisse', 'bellend', 'knobhead', 'tosser', 'minge', 'skank', 'cocaine', 'meth', 'heroin',
  ];
  // Squashed spellings caught even with no gaps at all ("shutthefuckup"),
  // limited to strings that don't hide inside ordinary words.
  const INSIDE = ['fuck', 'nigger', 'nigga', 'niqqa', 'nibba', 'faggot', 'motherfuck', 'motherfuk', 'mothafuck', 'mothafuk', 'muthafuck', 'muthafuk', 'bitch', 'asshole', 'dickhead', 'killyourself', 'killurself', 'neckyourself', 'hangyourself', 'whitepower', 'heilhitler', 'siegheil', 'blowjob', 'pornhub', 'onlyfans'];
  // Each squashed word as a pattern that allows stretched letters but keeps
  // doubled ones doubled: n+i+g{2,}e+r+ catches "niiiggger", not "Nigeria".
  const STRETCH = Object.fromEntries(INSIDE.map((x) => [x, new RegExp(x.match(/(.)\1*/g).map((run) => (run.length > 1 ? `${run[0]}{${run.length},}` : `${run}+`)).join(''))]));
  // Real words that contain a bad one; always fine.
  const ALLOW = new Set(['scunthorpe', 'cockpit', 'cockpits', 'cocktail', 'cocktails', 'peacock', 'hancock', 'dickens', 'dickensian', 'shiitake', 'hello', 'shell', 'shells', 'hellfire',
    'assassin', 'assassins', 'assault', 'assemble', 'class', 'classic', 'glass', 'grass', 'pass', 'passed', 'bass', 'mass', 'massive', 'sussex', 'essex', 'title', 'analysis', 'therapist', 'mitsubishi', 'matsushita', 'skyscraper', 'button', 'hitchhiker', 'spicy', 'japan', 'japanese', 'kyshotgun', 'cumulative', 'document', 'documents', 'cucumber', 'circumstance', 'scum', 'analyst', 'analog', 'canal', 'banal', 'knobs', 'knowing',
    'grape', 'drape', 'scrape', 'therapy', 'nightmare', 'night', 'nights', 'knight', 'knights', 'mongoose', 'mongolia', 'crackers', 'wogan', 'bsod', 'massage', 'messages', 'message', 'sextant', 'sextet', 'essex', 'shiite', 'shiites', 'cocky', 'cocked', 'cocking', 'cocker', 'cockers']);
  // Prefix matches only with these endings, so 'cockpit' and 'Dickens' are safe.
  const ENDS = ['', 's', 'es', 'er', 'ers', 'ed', 'ing', 'in', 'y', 'ty', 'ey', 'a', 'ah', 'as', 'az', 'head', 'heads', 'face', 'hole', 'holes', 'tard', 'bag', 'wit', 'off', 'up', 'z'];
  const stem = (f, roots) => roots.some((b) => f.startsWith(b) && ENDS.includes(f.slice(b.length)));
  const blockSet = new Set(BLOCK);
  const maskSet = new Set(MASK);

  const LEET = { 0: 'o', 1: 'i', 2: 'z', 3: 'e', 4: 'a', 5: 's', 6: 'g', 7: 't', 8: 'b', 9: 'g', '@': 'a', $: 's', '!': 'i', '|': 'i', '+': 't', '\u20ac': 'e', '\u00a3': 'l', '\u00a1': 'i', '*': '', '#': '' };
  const LOOK = { '\u0430': 'a', '\u0435': 'e', '\u043e': 'o', '\u0440': 'p', '\u0441': 'c', '\u0443': 'y', '\u0445': 'x', '\u0456': 'i', '\u0458': 'j', '\u0455': 's', '\u0501': 'd', '\u0261': 'g', '\u043a': 'k', '\u043d': 'h', '\u0442': 't', '\u0432': 'b', '\u043c': 'm', '\u0433': 'r',
    '\u03b1': 'a', '\u03bf': 'o', '\u03bd': 'v', '\u03b9': 'i', '\u03ba': 'k', '\u03c4': 't', '\u03c1': 'p', '\u03b5': 'e', '\u03c5': 'u', '\u0391': 'a', '\u0392': 'b', '\u0395': 'e', '\u0397': 'h', '\u0399': 'i', '\u039a': 'k', '\u039c': 'm', '\u039d': 'n', '\u039f': 'o', '\u03a1': 'p', '\u03a4': 't', '\u03a7': 'x', '\u00df': 'ss', '\u00f8': 'o', '\u0131': 'i' };
  const fold = (s) => s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^\x00-\x7f]/g, (c) => LOOK[c] || c);
  // A word as letters only, with symbol stand-ins turned back into letters.
  const letters = (w) => fold(w).split('').map((c) => (c in LEET ? LEET[c] : c)).join('').replace(/[^a-z]/g, '');
  const squeeze = (w) => w.replace(/(.)\1+/g, '$1');
  const f2 = (w) => w.replace(/(.)\1{2,}/g, '$1$1');
  // One word -> 'block' | 'mask' | null. Checks the word as written and with
  // stretched letters squeezed (fuuuuck -> fuck, assss -> as is fine).
  function judge(w) {
    if (!w) return null;
    if (ALLOW.has(w)) return null;
    // Sound-alike swaps: ph -> f, v -> u (fvck), y -> u (look-alike letters), ck/q -> k.
    // Stretched vowels count (fuuuck, shiiit), and 3+ repeats of a consonant
    // (fuckkk), but doubled consonants stay doubled so "rapping" isn't squashed.
    const vnorm = (f) => f.replace(/([aeiou])\1+/g, '$1').replace(/([^aeiou])\1{2,}/g, '$1');
    const base = [w, vnorm(w)];
    const forms = [...new Set(base.flatMap((f) => [f, f.replace(/ph/g, 'f'), f.replace(/v/g, 'u'), f.replace(/y/g, 'u'), (f[0] === 'f' ? f.replace(/ph/g, 'f').replace(/k$/, 'ck') : f)]))];
    for (const f of forms) if (blockSet.has(f) || stem(f, ['nigger', 'nigga', 'faggot', 'retard', 'rapist', 'pedophile'])) return 'block';
    for (const f of forms) if (maskSet.has(f) || stem(f, ['fuck', 'fuk', 'fucc', 'shit', 'bitch', 'cunt', 'whore', 'slut', 'pussy', 'bastard', 'asshole', 'motherfuck'])) return 'mask';
    // Swears glued inside one word ("shutthefuckup").
    if (INSIDE.some((x) => f2(w).includes(x))) return INSIDE.filter((x) => f2(w).includes(x)).some((x) => /^(nigg|niqq|nibb|fagg|kill|neck|hang|whitep|heil|sieg)/.test(x)) ? 'block' : 'mask';
    return null;
  }
  const PII = [
    /\b(?:https?:\/\/|www\.)\S+/gi,
    /\b[\w.-]+\.(?:com|net|org|gg|io|co|xyz|ly|me|tv|app|link|info|biz|us|uk)\b(?:\/\S*)?/gi,
    /\b[\w.+-]+@[\w-]+\.[\w.]+\b/g,
    /(?:\+?1[\s.-]?)?\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
    /\b\d{10,}\b/g,
    /\bdiscord(?:\.gg|app)?\b\S*/gi,
  ];
  const stars = (n) => '\u2605'.repeat(Math.max(3, Math.min(6, n)));

  // Filter a message. Returns { text, blocked, changed }.
  function clean(input) {
    let text = String(input || '').replace(/[\u200b-\u200f\u2060\ufeff]/g, '');
    for (const re of PII) text = text.replace(re, (m) => stars(m.length));
    // Tokens: runs of letters/digits/symbol stand-ins, with the gaps kept.
    const parts = text.split(/(\s+|[.,;:?_~^'"`()[\]{}<>\/\\=-]+)/);
    const toks = parts.map((p, i) => ({ p, i, w: i % 2 ? '' : letters(p) }));
    // Self-censored words (c*nt, a**hole, sh**, f!ck): each * # ! stands for any letter.
    for (const t of toks) {
      if (!t.w || !/[*#!]/.test(t.p) || t.p.length > 16) continue;
      const pat = fold(t.p).split('').map((c) => (/[*#!]/.test(c) ? '[a-z]' : c in LEET ? LEET[c] : /[a-z]/.test(c) ? c : '')).join('');
      if (!/[a-z]/.test(pat.replace(/\[a-z\]/g, ''))) continue;
      const re = new RegExp(`^${pat}$`);
      if (BLOCK.some((x) => re.test(x))) { t.wild = 'block'; } else if (MASK.some((x) => re.test(x))) t.wild = 'mask';
    }
    let blocked = false;
    const hit = new Set();
    for (const t of toks) {
      const j = t.wild || judge(t.w);
      if (j === 'block') blocked = true;
      if (j) hit.add(t.i);
    }
    // s p a c e d / f.u.c.k / f-u-c-k: join runs of tiny pieces and check them.
    const words = toks.filter((t) => t.w);
    for (let a = 0; a < words.length; a++) {
      if (words[a].w.length > 2) continue;
      let joined = '';
      for (let b = a; b < words.length && words[b].w.length <= 2 && b - a < 14; b++) {
        joined += words[b].w;
        if (b === a) continue;
        const j = judge(joined) || (joined.length >= 4 && INSIDE.some((x) => joined.includes(x)) ? 'mask' : null);
        if (j) {
          if (j === 'block' || BLOCK.some((x) => x.length >= 4 && joined.includes(x))) blocked = true;
          for (let k = a; k <= b; k++) hit.add(words[k].i);
        }
      }
    }
    // Whole message squashed together: the worst words can't hide.
    const flatRaw = letters(text.replace(/\s+/g, ''));
    for (const x of INSIDE) {
      const inOne = toks.some((t) => t.w && (ALLOW.has(t.w) ? false : f2(t.w).includes(x)));
      const anyAllowed = toks.some((t) => t.w && ALLOW.has(t.w) && t.w.includes(x));
      if (!inOne && !anyAllowed && STRETCH[x].test(flatRaw)) {
        if (BLOCK.includes(x) || /^(nigg|niqq|nibb|fagg|kill|neck|hang|whitep|heil|sieg)/.test(x)) blocked = true;
        // Mask every token that holds part of it.
        for (const t of toks) if (t.w && (x.includes(t.w) || t.w.includes(x.slice(0, 3))) && t.w.length >= 2) hit.add(t.i);
        if (![...hit].length) return { text: stars(text.length), blocked, changed: true };
      }
    }
    const out = parts.map((p, i) => (hit.has(i) ? stars(p.length) : p)).join('');
    return { text: out, blocked, changed: out !== String(input || '') };
  }
  // A name or motto: true when it's fine to show other players.
  const ok = (s) => { const r = clean(s); return !r.blocked && !r.changed; };

  root.Safe = { clean, ok };
})(window);
