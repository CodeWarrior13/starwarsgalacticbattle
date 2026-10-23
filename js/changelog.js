// Update log. The newest entry shows once as "What's new" the next time a
// player opens the game after an update; Settings > Update log lists them all.
// Keep CHANGELOG.md in step with this list.
(function (root) {
  'use strict';

  const SEEN_KEY = 'swcg-seen-update';

  // Update 2.0 goes live at 7:00 a.m. Central on October 14, 2026; until then
  // its entry stays hidden.
  const LAUNCH_2 = root.__hnLaunchTest != null ? root.__hnLaunchTest : Date.UTC(2026, 9, 14, 12, 0, 0);
  // Update 2.1 goes live at 7:05 a.m. Central on October 21, 2026.
  const LAUNCH_21 = root.__v21Test != null ? root.__v21Test : Date.UTC(2026, 9, 21, 12, 5, 0);
  // Update 2.2 goes live at 7:05 a.m. Central on October 28, 2026.
  const LAUNCH_22 = root.__v22Test != null ? root.__v22Test : Date.UTC(2026, 9, 28, 12, 5, 0);
  // Update 2.3 goes live at 7:05 a.m. Central on November 11, 2026 (after DST ends).
  const LAUNCH_23 = root.__v23Test != null ? root.__v23Test : Date.UTC(2026, 10, 11, 13, 5, 0);
  const ALL_UPDATES = [
    {
      v: '2.3', date: 'November 11, 2026', title: 'The Hutt\'s Vault', from: LAUNCH_23,
      items: [
        'NEW|The Legendary Exchange: once a week, at a time no one knows, a Hutt broker opens his vault for 30 minutes. Trade 5 Aurodium Ingots for 15,000 credits. Look under the gambling tables.',
        'NEW|Auto-open (level 30): open Black Market crates hands-free until you reach your number.',
        'NEW|Wager duels: reach Silver III in a season to unlock a Wager tab in Live Duels. After bans you have 45 seconds to agree a stake of 1,000 to 100,000 credits (offer, counter or accept, and chat). The winner takes both wagers minus a 10% house tax. Rating counts, and leaving counts as a loss. Up to 5 a day with the same pilot.',
        'NEW|Wallet caps: 7,500,000 credits and 10,000 Aurodium. Anything over the cap isn\'t lost: every 2,500 extra credits become 1 Aurodium, and extra Aurodium becomes 10 Kyber each. Fill your credit vault for the new Piggy Bank Saver badge.',
        'IMPROVED|Optimized the Collection: only the cards near your screen are drawn, sized to your device, so scrolling is smoother and uses less battery.',
        'BALANCE|Chance Cubes now cost 10 Kyber (was 25).',
        'BALANCE|Jedi Holocrons now cost 40 Kyber (was 50).',
        'BALANCE|The Kyber Exchange now trades 10 Kyber for 1,000 credits.',
        'BALANCE|HoloNet: High-Value bounty pucks now cost 260-340 Kyber, and the Outrider costs 400.',
        'IMPROVED|On computers, click an enemy to aim and double-click it to attack, so you can choose your target first and then any ability.',
        'FIXED|HoloNet squad pickers: cards no longer squish or jump when you tap them, on phones, tablets and computers.',
        'FIXED|HoloNet profiles now count Mythic and Secret cards in the collection, and show secret badges (but not how they were earned).',
        'FIXED|The Training Complete screen shows every card in full on phones (names and stats were cut off).',
        'IMPROVED|Profiles run much smoother, especially on phones: badges and cards stay still until you tap one, and the galaxy map rests while a pop-up is open.',
        'IMPROVED|Squad screen: the enemy squad (and the boss) now sits on top with your squad underneath, and a Hide synergies & planet button folds that panel away so your roster is right there. It remembers your choice.',
        'IMPROVED|Smoother menus: ships flying across the galaxy pause behind pop-ups, small profile pictures stay still, and the Black Market\'s spinning rays are lighter.',
        'IMPROVED|Tap any badge to see it up close with what it\'s for and how far along you are. Secret badges keep their secret.',
        'FIXED|Replaying the tutorial goes straight to your reward instead of handing you the starter cards again.',
        'FIXED|Promoting or levelling a card in the Collection no longer sends you back to the top.',
        'FIXED|Cards in the Krayt Dragon battle now fit on phone screens.',
        'FIXED|Fixed Settings and other pop-ups not fitting at the top of phone screens.',
        'FIXED|Fixed the settings gear getting pushed off phone screens; big balances now show as 1.2M or 12.3K on phones.',
      ],
    },
    {
      v: '2.2', date: 'October 28, 2026', title: 'Friends and Foes', from: LAUNCH_22,
      items: [
        'NEW|Friends: from level 5, add pilots by callsign and play friendly battles (unranked, no rewards).',
        'NEW|A new Commander profile: tap your level to open it. Overview, Collection, Worlds, Badges, Friends and Stats tabs; tap your picture to change it, or your level to see what\'s coming up. Worlds light up in full colour once every stage and boss on them is beaten.',
        'NEW|Captain Rex is back to walk you through your Commander profile, and at level 5 he helps you make a profile and add your first friends.',
        'NEW|Find friends faster: start typing a callsign and matching pilots drop down, closest first. Tap the add button next to a name to send a request.',
        'NEW|Message your friends: tap Chat next to a friend to talk (filtered for bad language). A red number on your profile picture and the Friends button shows new friend requests and unread messages.',
        'NEW|Friend profiles: tap a friend to see their picture in the frame they wear, their level, stats, which world they\'re on, their collection and badges. Their HoloNet record shows too once they\'ve unlocked it.',
        'NEW|Invite friends to your guild: leaders and officers can invite a friend who\'s level 25 or higher. The invite arrives in your chat with the guild\'s emblem, name and member count, and they join with one tap.',
        'IMPROVED|A cleaner top bar: your profile chip now shows your picture, your level and the red number for friend news, with the Friends button right beside Settings for quick chats. On phones your currencies show shortened (5.4M). Tap one to see the full amount.',
        'NEW|Duel chat: in live duels and friendly battles, tap Chat to send a quick line or a short message (filtered for bad language). After a duel, add your opponent as a friend right from the results screen.',
        'NEW|Six new planet bosses: the Dragonsnake on Dagobah, Death Star II over Endor, the Acklay in the Geonosis arena, the Executor above Mustafar, the Sith Trooper Legion on Exegol and the Zillo Beast loose on Coruscant, each with its own battle tricks.',
        'NEW|General Grievous update: brand-new card art and a new "Jedi Killer" ultimate where he spins all four lightsabers through the enemy line.',
        'BALANCE|Buffed General Grievous: Four-Blade Frenzy hits harder, Jedi Hunter\'s Burn chance is up to 65%, Blade Whirlwind can now inflict Defense Down, and he\'s a little faster.',
        'NEW|15 new bounty targets, including Greedo, Hondo Ohnaka, Cad Bane and the Most Wanted Black Sun Vigo.',
        'NEW|7 new HoloNet cards: Bossk, Cad Bane, IG-11, Greef Karga, Cara Dune, Zuckuss and Todo 360.',
        'BALANCE|Raid bosses (weekly and guild) are much tougher: at least 5,000,000 health, harder-hitting bosses and guards.',
        'BALANCE|Leagues: seasons now last 3 weeks, and arena matchmaking is better at finding opponents that fit your league.',
        'BALANCE|Crate odds lowered: fewer Mythic, Legendary and Holo cards from every crate (Sith Holocron Mythic chance 3% → 1.5% per card, Legendary 30% → 24%).',
        'IMPROVED|Starkiller\'s Unleashed ultimate is bigger: he tears a Star Destroyer out of the sky for every enemy, one after another, and slams each one into its target.',
        'NEW|A "NEW CARD" ribbon marks cards you didn\'t have yet when you open a crate, and on the crate summary after.',
        'IMPROVED|The Hoth Star Destroyer boss has new art.',
        'IMPROVED|Big performance boost: smoother menus and battles on all devices.',
        'FIXED|Some ultimates weren\'t playing their animations; Performance mode now keeps every card\'s own ultimate.',
        'IMPROVED|Removing test code.',
      ],
    },
    {
      v: '2.1', date: 'October 21, 2026', title: 'Squadrons', from: LAUNCH_21,
      items: [
        'NEW|Save your game: sign in with Google or an email to keep your progress safe and play on any device. Find it in Settings.',
        'NEW|Save your game to earn the Holo Link profile frame and the Never Lost badge.',
        'NEW|Invite friends: share your link or QR code. Friends get a welcome gift of 1,000 credits and 25 Kyber, and you earn 2 Kyber for every friend who reaches level 5.',
        'NEW|Invite 10 friends for the Squadron Leader frame and badge, and 50 for the limited-time Recruiter Legend frame.',
        'NEW|Extra Kyber and Aurodium at 15, 20, 25, 30, 35, 40 and 45 friends.',
        'NEW|Your profile now lives in the Commander profile: tap your level to see your callsign, picture, frame and badges, and tap your picture to change them.',
        'NEW|Card level cap raised to 40, and levelling up costs far less: taking a card all the way to level 40 costs less than reaching level 30 used to. Live Duels stay at Level 20 ★3.',
        'NEW|Suggestion box in Settings: send your ideas for cards, ships, events and features straight to the team.',
        'NEW|Find a pilot: look up anyone in the HoloNet by their callsign to see their profile.',
        'NEW|Player collections: open any pilot\'s HoloNet profile to see their whole collection, favorite card, strongest cards, every badge and their full stats. Tap a card to compare it with yours.',
        'NEW|Collection: new HoloNet filter shows every HoloNet card, and how to earn the ones you\'re missing.',
        'NEW|The level-up pop-up and results screen now tell you what each level unlocks.',
        'NEW|The Rank road shows what each level unlocks, and what\'s coming up next.',
        'NEW|Duel bans: every card can be banned, even ones neither player owns. Sort by strongest, rarity, damage, health, defense, speed or name, and filter by class and by owner. Each card shows its duel stats.',
        'NEW|Auto-repeat can stop on its own: type how many battles to repeat (up to 100,000) on the results screen, or pick ∞ to keep going. When it reaches your number it switches itself off.',
        'BALANCE|Auto-repeat now unlocks at level 15, and Auto-continue at level 20.',
        'BALANCE|Auto-repeat earns far less XP from level 15: less the higher your level, and less the more you repeat in a day. Playing battles yourself still earns the full amount.',
        'NEW|Bounty pucks have their own opening: the target\'s hologram rises from the puck before it\'s frozen in carbonite, then the puck projects each card as a hologram and decrypts it into full colour, one at a time.',
        'FIXED|Your profile picture sat off-centre in its frame in the profile editor on phones.',
        'FIXED|Cards from bounty pucks are now centred on every screen.',
        'IMPROVED|The half-built Death Star II over Endor has been redrawn for fleet battles and the galaxy map, now with a slowly turning frame and blinking work lights.',
        'IMPROVED|Removing tester code.',
      ],
    },
    {
      v: '2.0', date: 'October 14, 2026', title: 'The HoloNet', from: LAUNCH_2,
      items: [
        'NEW|The HoloNet unlocks at account level 25: battle real players from across the galaxy. Admiral Ackbar welcomes you with a guided tour, a free bounty puck and 500 Beskar.',
        'NEW|Beskar, the HoloNet\'s own currency, earned from every HoloNet battle.',
        'NEW|Ground Arena and Fleet Arena: attack other players\' defense squads and climb from Bronze to Legend. Every new division pays a one-time Beskar bonus, and win streaks pay extra.',
        'NEW|Leagues and seasons: finish a season in the top 25 for rewards, with special profile frames for the top 3. Season 1 reward: Darth Vader · The Hallway (Mythic).',
        'NEW|Leaderboards for the season ladder, duel wins, raid damage and guilds.',
        'NEW|Community raid: everyone in the HoloNet attacks the same giant boss each week, and everyone who hits it shares the rewards.',
        'NEW|Varka\'s Forge: spend Beskar on bounty pucks that capture new HoloNet-only cards, and shard caches that power up the cards you have. New bounties every day.',
        'NEW|The Databank keeps every HoloNet-only card and every bounty you\'ve captured. Finish a row of bounties for bonus Beskar.',
        'NEW|Live Duels: ranked, real-time battles against players who are online right now. Wins and losses change your rating just like the arena.',
        'NEW|Duel ban phase: after a duel is accepted, each player bans one card that neither of you can use that duel.',
        'NEW|Both players build a squad for the duel before it starts.',
        'NEW|Every card fights at Level 20 ★3 in duels, so the better team wins, not the bigger collection.',
        'NEW|In duels you play every move yourself (no Auto), with 45 seconds per move.',
        'NEW|12-minute duels: if nobody has won when time runs out, whoever dealt more damage wins, and equal damage is a draw.',
        'NEW|Lose your connection in a duel and you get 45 seconds to get back in. Leaving a duel counts as a loss.',
        'BALANCE|Duel balance tweaks for a few effects that were too strong against real players.',
        'NEW|Guilds: found or join one, with its own chat, a pinned announcement board, a two-front guild raid, weekly guild points with rewards, and guild levels up to 10.',
        'NEW|Guild ranks: Leader, Co-leader and up to 4 Elders. Leaders can hand over leadership, and if a leader is away for 7 days the co-leader takes over.',
        'NEW|Join modes: open to all, request to join (leaders see the applicant\'s record and cards before accepting) or invite only. Invite anyone from their profile.',
        'NEW|The Beskar Vault: members donate Beskar, and leaders spend it on guild upgrades (Beskar Haul, Lucky Pucks, XP Boost, Guild XP Boost and Barracks for more member slots).',
        'NEW|Pick your guild\'s look from 100 pictures, plus a colour and a motto.',
        'NEW|Markers for new guild chat, announcements, join requests and invites, so you never miss anything.',
        'NEW|Are-you-sure prompts for removing a member (with an Undo), leaving, disbanding, handing over leadership and spending from the Vault.',
        'NEW|Your HoloNet profile: picture, frame, best badges, rating, record and guild. Tap anyone\'s name to see theirs.',
        'NEW|Unique callsigns: pick the name every player sees. Nobody else can have the same one.',
        'NEW|Profile frames earned from leagues, seasons and guilds.',
        'NEW|Derogatory word filter for chat, callsigns and guild names, and mute any player from their profile.',
        'NEW|If the HoloNet can\'t connect, you get an offline screen, and the rest of the game keeps working.',
        'FIXED|Reset all progress can no longer be tapped by accident: you now type RESET to confirm before anything is wiped.',
        'IMPROVED|Removing tester code.',
      ],
    },
    {
      v: '1.9', date: 'October 10, 2026', title: 'Starships',
      items: [
        'NEW|Cassian\'s Haulcraft (Epic ship): a Fondor hauler whose wings swing out for its Wings Out ultimate.',
        'NEW|Mando\'s N-1 (Legendary ship): Din Djarin\'s chrome-stripped Naboo starfighter, with Grogu riding in the droid socket.',
        'IMPROVED|U-wing rework: now Epic, with the new Door Gunner ultimate (the bay slides open and the gunner rakes every enemy).',
        'IMPROVED|Brand-new, far more detailed art for the Millennium Falcon, the Naboo N-1, the U-wing and the Hound\'s Tooth.',
        'NEW|Mythic ships: the Millennium Falcon and Darth Maul\'s Sith Infiltrator join the Ghost at Mythic rarity.',
        'NEW|The Sith Infiltrator gains a third ability, Seeker Swarm.',
        'IMPROVED|The Razor Crest and Slave I are now Legendary, each with a new third ability (Bounty Hunter\'s Code / Tracking Fob).',
        'NEW|Auto-continue (account level 15): jump straight into the next battle with your saved squad, or let it roll on automatically after each win.',
        'NEW|Auto-repeat (account level 20): Auto-continue can replay the same stage or boss after every win, for farming.',
        'NEW|Promote with Aurodium: any card can be promoted with Aurodium Ingots instead of shards. Commons, rares and epics cost 2, 3, 4, 5, 6, then 12 ingots per star; Legendary, Mythic and secret cards cost more.',
        'IMPROVED|The Sith Holocron now costs 8 Aurodium (was 12).',
        'IMPROVED|More Aurodium: bosses pay 8 on the first win and 2–3 on every repeat, finishing a planet pays 2, each new Endless Tower boss floor pays 2, and the daily streak pays Aurodium on days 2, 4, 5 and 7.',
        'NEW|A new loading screen with tips while the game gets ready.',
        'IMPROVED|The game opens instantly and loads everything during the loading screen, with more time to read each tip.',
        'IMPROVED|Smooth slide when switching between Galaxy, Collection and Black Market.',
        'IMPROVED|Collection opens about 10x faster, and the loading screen gets Collection and the Black Market ready so they open instantly.',
        'IMPROVED|Big Mythic ultimates run smoother, especially on older iPads.',
      ],
    },
    {
      // rev: bump when items are added to an update that already went out, so
      // "What's new" shows again for players who saw the earlier list.
      v: '1.8', rev: 2, date: 'October 7, 2026', title: 'Smooth running',
      items: [
        'NEW|Install the game as an app on your phone, tablet or computer: its own home-screen icon, full screen, and it works offline. Tap Install on the banner or in Settings → App.',
        'NEW|A fresh logo and launch screen: crossed lightsabers in hyperspace.',
        'NEW|Performance settings: choose Auto, iPhone, iPad, Android or PC in Settings to tune the graphics for your device.',
        'NEW|Performance mode: fewer effects, simpler ultimates and no screen shake for older devices or laggy battles.',
        'IMPROVED|Tap anywhere on a card\'s Ultimate page to watch it in action.',
        'IMPROVED|Smoother ultimates: Qui-Gon Jinn\'s Force wave and the big finishing rings are much lighter, and the background stars use less power.',
        'IMPROVED|Smoother battles on Safari and iPhone: lighter weather effects and card backgrounds.',
        'FIXED|Ultimates no longer skip their first targets when the game hitches (Anakin\'s saber throw could miss the first card on Safari).',
        'FIXED|Ultimate previews from the card inspector wait for the screen to load before playing.',
        'FIXED|The tutorial battlefield no longer gets squashed into a thin strip on computer screens.',
        'FIXED|Health numbers on small battle cards no longer run together.',
      ],
    },
    {
      v: '1.7', date: 'October 3, 2026', title: 'Boot camp',
      items: [
        'IMPROVED|The tutorial dogfight is tougher: three TIEs, including an Interceptor, now fly against you.',
        'NEW|The tutorial now teaches Auto battle and the speed settings once you\'ve learned to fight by hand.',
        'IMPROVED|Deeper lessons on squad bonuses, traits and Ultimates.',
        'NEW|A guided tour after training: your collection, a real card level-up, stars and shards, Ultimates and the Black Market.',
        'NEW|New players get a one-time Recruit Crate with the rest of their starter squad. Skipping the tutorial still gives you those cards.',
      ],
    },
    {
      v: '1.6', date: 'October 3, 2026', title: 'Smoother start',
      items: [
        'BALANCE|Early worlds are easier: Tatooine and Hoth enemies hit softer, and Jabba\'s Palace is no longer a wall.',
        'BALANCE|Enemy squads never outnumber yours: they grow only as your squad slots do.',
        'IMPROVED|The tutorial is longer: a ground fight and then a dogfight, with lessons on squad bonuses, planet terrain and hazards.',
        'IMPROVED|Tutorial tips are bigger, easier to read and tuck away so you can see the cards.',
        'IMPROVED|Your starter squad now arrives card by card, with your starting credits and Kyber counting up.',
        'NEW|This update log, in Settings.',
        'IMPROVED|Opening a version in the update log gives it the whole panel; scroll for the others.',
        'NEW|A reminder to reload if the game was open when an update came out.',
      ],
    },
    {
      v: '1.5', date: 'October 3, 2026', title: 'Events and celebrations',
      items: [
        'NEW|May the 4th: a Jedi-blue galaxy and a free Jedi Holocron plus 25 Kyber, once a year.',
        'NEW|Revenge of the Fifth: a Sith-red galaxy where your Dark side cards fight 20% stronger.',
        'NEW|Both events have their own legendary badge with a cutscene.',
        'NEW|Liberating every world now ends in a Hero of the Galaxy ceremony for your three best cards.',
        'NEW|Survivor achievement: win with a unit on its last 1% of health for a free Sith Holocron.',
      ],
    },
    {
      v: '1.4', date: 'October 2, 2026', title: 'Training day',
      items: [
        'NEW|New players start with a tutorial led by Captain Rex. Hold the button in the first 10 seconds to skip it.',
        'NEW|Replay the tutorial any time from Settings.',
        'IMPROVED|Achievement medals got an upgrade: Bronze, Silver, Credit and Kyber, each with its own showcase.',
        'IMPROVED|Captain Rex has a new look.',
      ],
    },
    {
      v: '1.3', date: 'October 2, 2026', title: 'Kyber rebalance',
      items: [
        'BALANCE|Kyber is rarer and worth more: 1 to 2 per first clear, with Night Market prices lowered to match.',
        'BALANCE|Daily rewards pay 130 Kyber over a full week.',
        'FIXED|Your credits and Kyber now stay visible at the top while you scroll the shop.',
        'FIXED|Reward cards on the results screen can be tapped to view them.',
      ],
    },
  ];
  const UPDATES = ALL_UPDATES.filter((u) => !u.from || Date.now() >= u.from);

  // Reminder that a page left open keeps running the old version.
  const RELOAD_NOTE = `<div class="ul-reload"><div><b>Not seeing the latest fixes?</b><span>If the game was open when an update came out, reload to get it. Your progress is kept.</span></div><button class="btn btn-small" type="button" data-reload>Reload now</button></div>`;

  const Changelog = {
    UPDATES,
    latest: UPDATES[0].v + (UPDATES[0].rev ? `.r${UPDATES[0].rev}` : ''),

    // Each line is "TAG|text"; the tag becomes a coloured label.
    itemsHtml(items) {
      const esc = root.UI.esc;
      const LABEL = { NEW: 'New', IMPROVED: 'Improved', BALANCE: 'Balance', FIXED: 'Fixed' };
      return `<ul class="ul-items">${items.map((line) => {
        const [tag, text] = line.includes('|') ? line.split('|') : ['NEW', line];
        return `<li class="ul-item t-${tag.toLowerCase()}"><span class="ul-tag">${LABEL[tag] || tag}</span><span class="ul-text">${esc(text)}</span></li>`;
      }).join('')}</ul>`;
    },

    entryHtml(u, open) {
      const esc = root.UI.esc;
      return `<details class="ul-entry" ${open ? 'open' : ''}>
        <summary><span class="ul-ver">v${esc(u.v)}</span><b>${esc(u.title)}</b><span class="ul-date">${esc(u.date)}</span><span class="ul-chev">▾</span></summary>
        ${this.itemsHtml(u.items)}
      </details>`;
    },

    // Settings > Update log: every update, newest first.
    showAll() {
      const UI = root.UI;
      const m = UI.openModal(`<div class="ul-head"><span class="ul-badge">Command Console</span><h2>Update log</h2><p class="ul-sub">Every update, newest first. Tap one to open it.</p></div>
        <div class="ul-list">${UPDATES.map((u, i) => this.entryHtml(u, i === 0)).join('')}</div>
        ${RELOAD_NOTE}
        <div class="modal-actions"><button class="btn btn-primary" type="button" data-close>Done</button></div>`, { small: true, cls: 'update-modal full' });
      // One version open at a time; the opened one scrolls to the top so it
      // fills the panel, and the others are a scroll away.
      const list = m.root.querySelector('.ul-list');
      m.root.querySelectorAll('.ul-entry').forEach((d) => d.addEventListener('toggle', () => {
        if (!d.open) return;
        m.root.querySelectorAll('.ul-entry[open]').forEach((o) => { if (o !== d) o.open = false; });
        requestAnimationFrame(() => list.scrollTo({ top: d.offsetTop - list.offsetTop, behavior: 'smooth' }));
      }));
      m.root.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) m.close();
        if (e.target.closest('[data-reload]')) location.reload();
      });
      this.markSeen();
    },

    // After an update: show what's new once, the next time the game opens.
    showWhatsNew() {
      const UI = root.UI;
      const u = UPDATES[0];
      const m = UI.openModal(`<div class="ul-head"><span class="ul-badge">What's new</span><span class="ul-ver big">v${UI.esc(u.v)}</span><h2>${UI.esc(u.title)}</h2></div>
        <p class="ul-date-line">${UI.esc(u.date)}</p>
        ${this.itemsHtml(u.items)}
        <p class="ul-safe">Your progress is safe: updates never reset your save.</p>
        ${RELOAD_NOTE}
        <div class="modal-actions"><button class="btn" type="button" data-all>Full update log</button><button class="btn btn-primary" type="button" data-close>Let's go</button></div>`, { small: true, cls: 'update-modal' });
      m.root.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) m.close();
        if (e.target.closest('[data-all]')) { m.close(); this.showAll(); }
        if (e.target.closest('[data-reload]')) location.reload();
      });
      this.markSeen();
    },

    seen() {
      try { return localStorage.getItem(SEEN_KEY); } catch (e) { return this.latest; }
    },

    markSeen() {
      try { localStorage.setItem(SEEN_KEY, this.latest); } catch (e) { /* storage unavailable */ }
    },

    // Called at startup. Brand-new players (tutorial still pending) are not
    // shown old news; they simply start on the current version.
    check() {
      if (root.Player.tutorialPending()) { if (!this.seen()) this.markSeen(); return; }
      if (this.seen() === this.latest) return;
      setTimeout(() => {
        if (document.querySelector('.modal-backdrop, .feat-cine, .feat-show, .tut-intro')) return setTimeout(() => this.check(), 1500);
        this.showWhatsNew();
      }, 1200);
    },
  };

  root.Changelog = Changelog;
})(window);
