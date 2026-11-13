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
  // Update 2.3 goes live at 7:05 a.m. Central on November 4, 2026 (after DST ends).
  // The guild overhaul went live straight away on October 28, 2026.
  const LAUNCH_221 = root.__v22Test != null ? root.__v22Test : Date.UTC(2026, 9, 28, 12, 5, 0);
  const LAUNCH_23 = root.__v23Test != null ? root.__v23Test : Date.UTC(2026, 10, 4, 13, 5, 0);
  // Update 2.4 went live at 6:50 a.m. Central on November 11, 2026. This file
  // loads before js/gate24.js, so the date is written here too.
  const LAUNCH_24 = root.__v24Test != null ? root.__v24Test : root.REL24 != null ? root.REL24 : Date.UTC(2026, 10, 11, 12, 50, 0);
  // Update 2.5 "Cosmetic": hidden until 2.5 ships, but testers with the 2.5 switch
  // see it now. When the 2.5 date is set (js/cosmetic25.js RELEASE25), set it here too.
  const LAUNCH_25 = (() => { try { if (localStorage.getItem('swcg-v25-test') === '1') return 0; } catch (e) { /* storage blocked */ } return root.__v25Test != null ? root.__v25Test : Date.UTC(2026, 10, 22, 12, 0, 0); })();
  const ALL_UPDATES = [
    {
      v: '2.5', date: 'November 22, 2026', title: 'Cosmetic', from: LAUNCH_25,
      // Bigger than Liberation: a grand-opening marquee for the three shops.
      theme: 'cosmetic',
      stats: [['3', 'shops'], ['3', 'new cards'], ['40', 'titles'], ['6', 'title colours'], ['15', 'new frames'], ['42', 'banners'], ['14', 'victory poses'], ['16', 'win screens'], ['9', 'crate themes'], ['15', 'card backs'], ['11', 'battle intros'], ['100+', 'guild pictures']],
      decos: ['shops', 'wear', 'cards', 'casino', 'squad', 'holonet', 'credits', 'secret'],
      groups: [
        ['Three Shops Open', '⌂', 'Black Market opens|Luthen\'s Gallery, Coruscant|gallery pieces|New on Luthen'],
        ['Make It Yours', '✦', 'Cosmetics tab|titles|frames|banners|poses|win screens|crate themes|card backs|VS intro|guild pictures|Captain Rex'],
        ['Three New Cards', '⚔', 'Havoc|Embo|Marrok'],
        ['Watto\'s Wagers', '◈', 'Watto|Sabacc|Every casino|Shell Game'],
        ['Squads & Friends', '⚑', 'Favourite squads|Friends see|Guild ranks'],
        ['Raids & Ranked', '⚔', 'Raid|raid|leaderboard|placement|Unplaced'],
        ['Smoother', '▲', 'smoother'],
        ['One more thing…', '✧', ''],
      ],
      items: [
        'NEW|The Black Market opens three shops: Vekko the Fence for cards and crates, Luthen\'s Gallery for cosmetics, and Watto\'s Wagers for casino games. Switch between them with the tabs at the top.',
        'NEW|Luthen\'s Gallery, Coruscant\'s finest antiquities: titles, win screens, crate themes and card backs, with new pieces every Monday. While you browse, the top bar shows your Beskar, Kyber and Aurodium.',
        'NEW|36 gallery pieces rotate through the Gallery week by week: 22 banners, 7 win screens and 7 battle intros, each with its own animated scene.',
        'NEW|15 card backs for the face-down cards in every crate opening, from Twin Suns and Hoth Blizzard to Exegol Storm and Battle Station Plans, plus event exclusives on Luthen\'s Exclusives shelf. Give each crate its own back in the new Card backs tab: earn some by playing, and buy the rest at Luthen\'s Gallery.',
        'NEW|New on Luthen\'s plinth: the Boonta Eve Finish win screen, and the Kyber Geode, Bacta Tank and Sarlacc Pit crate themes. Win 150 all-ship battles for the Hyperspace Drop crate theme.',
        'NEW|The Cosmetics tab in your profile: frames, titles, poses, win screens and crate themes in one place. Preview anything on your card, equip what you own, and new items carry a red dot until you look.',
        'NEW|40 profile titles, 20 to earn and 20 to buy, each in up to 6 colours: Silver, Gold, Kyber, Crimson, Aurora and Holo.',
        'NEW|15 new profile frames, and the Bronze, Silver, Guild, Victor and Podium frames redrawn from scratch.',
        'NEW|20 animated banners for guilds and pilots, plus 22 more for pilots in the Gallery, flying on guild pages, leaderboards and profiles.',
        'NEW|Victory poses: after every win, the MVP (the card that did the most real work) strikes one of 14 poses.',
        'NEW|9 win screens play after the pose, from the Medal Ceremony to the Jedi Temple, with 7 more in Luthen\'s rotation. Tap to skip.',
        'NEW|9 crate themes: set one for a crate and it opens with its own scene, from the Sith Vault to a Sarlacc that spits your crate out.',
        'NEW|Live duels, wagers and friendly battles open with a VS intro, and you can swap it for one of 11 battle intros from the Gallery, from Bounty Posters to Sith vs Jedi, Trench Run and Mustafar Duel, in the new Intros tab. Some put both players\' pictures and frames right in the scene.',
        'NEW|More than 100 new guild pictures: cards, bosses, world scenes and crests.',
        'NEW|Captain Rex walks you through cosmetics the first time you visit.',
        'NEW|The Havoc (Legendary ship): six forward cannons, a dorsal ball turret that fires a free shot after every action, and a bomb bay that never runs dry.',
        'NEW|Embo (Legendary bounty hunter): throws his shield-hat through two enemies, raises it as a shield and sets his anooba on the weak. Ultimate: The Hunt.',
        'NEW|Marrok (Epic): Embo\'s anooba. Pounces and bleeds, howls the squad up and hunts as a pair with Embo. Ultimate: Savage Frenzy.',
        'NEW|Watto runs the tables now, with 4 games: Sabacc on his brand-new table, Holo-Chess Wager, Podrace Bets and Pazaak.',
        'NEW|Watto\'s Payout: every 5 minutes Watto pays one lucky pilot 1,000 credits. Check the board to see who won.',
        'IMPROVED|The Legendary Exchange has a new host: Watto, haggling over every card.',
        'IMPROVED|Every casino game takes the same bets (100, 250, 500 and 1,000) with the same credit chips.',
        'BALANCE|The Shell Game retires. Watto had it rigged anyway.',
        'NEW|Favourite squads: save up to 6 Ground or Fleet squads with a name, an emblem and a colour, and swap with one tap.',
        'IMPROVED|Friends see exactly what you\'re doing: a raid boss, a duel opponent, a campaign stage or a casino game.',
        'IMPROVED|Guild ranks: the leader\'s gold name shimmers, and chat bubbles carry the sender\'s rank colour.',
        'FIXED|Raids: when the pilot fighting beside you shares cards with your squad, they now bring their own next-best cards instead, so you always fight with 10 different cards.',
        'FIXED|Ranked: profiles no longer show a league or rating for the new season before your placement battles; until then they show your best rating.',
        'Ranked: Admiral Ackbar now reveals your placement result as soon as your fifth placement battle is done. It goes on the leaderboards and your profile when the season opens.',
        'IMPROVED|Simpler ship names: the A-wing, B-wing, X-wing, Y-wing and TIE Advanced no longer carry their factory model codes.',
        'IMPROVED|Raids: pick from 4 different allies on every run, real pilots first, with a fresh line-up after each run and no card shared between them.',
        'NEW|Raid squads: the HoloNet raid and guild raids now use their own squad (Edit on the raid screen), so you can bring a different team without touching your arena defense.',
        'BALANCE|The HoloNet raid boss now has about 9 billion health, hits harder and so do its guards, and the other raiders on the board hit like real pilots.',
        'IMPROVED|Between seasons, the Season leaderboard shows a countdown to the new season instead of last season\'s board, and it fills up as pilots finish their placement battles.',
        'FIXED|Until your placement battles are revealed you show as Unplaced, instead of carrying a league over from last season.',
        'IMPROVED|The Black Market and the menus run smoother: lighter glows and animations that use less battery.',
        'IMPROVED|Everything new runs smoother: scenes load only when you open them, pause when they\'re off screen and go easy on the battery.',
        'NEW|Luthen never puts everything on the plinth. Some pieces wait for the right buyer.',
      ],
    },
    {
      v: '2.4', date: 'November 11, 2026', title: 'Liberation', from: LAUNCH_24 == null ? Infinity : LAUNCH_24,
      // The biggest update yet gets its own log: a liberation banner and themed sections.
      theme: 'liberation',
      stats: [['110', 'stages'], ['22', 'bosses'], ['10', 'new cards'], ['85', 'doctrines'], ['2', 'fleet raids'], ['50', 'level cap']],
      groups: [
        ['Liberate the Galaxy', '◉', 'Liberat|bosses|Optional bosses|Zillo|110 stages|Siege|Already finished|scenes download|galaxy grows'],
        ['Cards & Doctrines', '✦', 'new cards|Doctrines|Elite|Common, rare and epic|level cap|Hoth Star Destroyer'],
        ['Command Your Squad', '⚑', 'Battle Plans|Turn Meter|Replay ×3'],
        ['HoloNet', '⌬', 'HoloNet raid|Axial|Sith Fleet|weekly raid|Champion|HoloNet Season|between seasons|Beskar Forging|Hunters & Clans|HoloNet card'],
        ['Ranked & Guilds', '⚔', 'Ranked|Placement|raid clock|Raids no longer|Guild|guild|catch fire|Leaderboards'],
        ['Credits & Rewards', '◈', 'results screen|Sell spare|Wallet|cost|Replaying|1.8×'],
        ['One more thing…', '✧', ''],
      ],
      items: [
        'NEW|Liberate the galaxy: every world now has 10 stages with its own cast of enemies, a main boss that liberates it and an optional boss on the side. A world counts as liberated once its main boss falls.',
        'NEW|11 new bosses: the Wampa on Hoth, the Cave\'s Vision on Dagobah, Carbonite Chamber Vader and Bossk with the Hound\'s Tooth on Bespin, the AT-ST Walker on Endor, Director Krennic on Scarif, Darth Sidious and Commander Cody on Coruscant, Jango Fett in the Geonosis arena, Emperor Reborn on Exegol and General Grievous, Warlord at the Siege of Coruscant. Each fights with its own tricks.',
        'NEW|Optional bosses: your first win opens a free Holocron (Jedi for the light side, Sith for the dark), and every win after that pays 1,500 credits and 1 Aurodium.',
        'NEW|Liberator of the Galaxy badge: beat all 22 bosses, main and optional, to earn it. What it brings stays a secret until you do.',
        'NEW|Beat the Zillo Beast, the last world\'s main boss, for the first time and a Sith Holocron spins for you: one guaranteed Mythic card.',
        'NEW|Every one of the 110 stages has its own battle scene: Mos Eisley and the Dune Sea, Echo Base and the Hoth trenches, the Dagobah swamps, Cloud City, the Endor forest, the Scarif beaches, the Jedi Temple, the Geonosis arena and foundries, Fortress Inquisitorius, the Sith Citadel on Exegol and the Battle of Coruscant.',
        'NEW|10 new cards to face in the new stages, and to find in crates: Gamorrean Guard, Snowtrooper, Cloud City Wing Guard, Scout Trooper, Shoretrooper, Clone Force 66 Trooper, Geonosian Warrior, Purge Trooper, Knight of Ren and BX Commando Droid.',
        'NEW|HoloNet raid: the Xyston Star Destroyer rises from the storms of Exegol, the first fleet raid. Bring your fleet and an ally fleet against 5,600,000 health, two Sith TIE Daggers and Sith Star Destroyer escorts.',
        'NEW|Axial Superlaser: the Xyston locks onto your strongest ship, warns you, then fires on its next turn for massive damage, and charges again every 4 turns. A locked ship with Defense Up takes half the blast.',
        'NEW|Sith Fleet: a new Sith Star Destroyer escort rises from the storm every 3 turns, and escorts can Taunt to screen the flagship. At half health the Final Order begins: every waiting destroyer rises at once and the whole fleet gains Offense Up. Its ultimate, Sith Armada, hits your whole fleet and Burns it.',
        'NEW|HoloNet raid: the Invisible Hand, General Grievous\'s flagship burning above Coruscant. A fresh wave of Droid Tri-Fighters launches every 2 turns, and below half health a Hull Breach makes it lose health every turn but hit much harder. Its ultimate, All Batteries, hits your whole fleet with Defense Down.',
        'IMPROVED|The weekly raid now rotates through six bosses, starting with the first full week after the update.',
        'NEW|Replay ×3 (level 15): cleared stages get a button that plays the battle three times on Auto.',
        'NEW|The results screen shows what you\'ve earned this play session and about how much that is an hour.',
        'NEW|Sell spare shards: once a card is at top level and top stars, its extra shards sell for credits (Kyber for Secret cards).',
        'NEW|Wallet caps: 10,000,000 credits and 10,000 Aurodium. Anything over the cap isn\'t lost: every 2,500 extra credits become 1 Aurodium, and extra Aurodium becomes 10 Kyber each. Fill your credit vault for the new Piggy Bank Saver badge.',
        'IMPROVED|Each world\'s stage scenes download the first time you fight there, so the game still opens fast.',
        'IMPROVED|The Hoth Star Destroyer has a new, detailed portrait.',
        'NEW|Card level cap raised to 50. Levels 41 to 50 add 7% health and attack each, so a level 50 card is about 19% stronger than at level 40.',
        'BALANCE|The galaxy grows with your cards: from Bespin on, stage and boss levels rise, up to level 46 at the Siege of Coruscant. Tatooine, Hoth and Dagobah stay as they were, and the Endless Tower now climbs to level 50.',
        'BALANCE|Levels 41 to 50 cost half again as much as the levels before them: about 261,000 credits to take a card from 40 to 50.',
        'BALANCE|Common, rare and epic cards are stronger: the gap to the top cards is smaller. A common card now has about 66% of a secret card\'s power at the same level and stars (was 62%), and rare, epic, legendary and mythic cards scale up with it.',
        'NEW|Elite promotion (unlocks at level 30): once a common, rare or epic card reaches 7★, promote it to Elite with Kyber (120, 180 or 260). It fights with the next rarity\'s strength, keeps its own abilities and gets a gold Elite frame.',
        'NEW|Battle Doctrines: every common, rare and epic card now brings a doctrine to its squad, shown on the back of the card. Build around a style: Grind (more credits, XP or Kyber), Speed (Turn Meter and speed), Defense (armor, health and healing) or Attack. Each doctrine works once per squad and in every mode, and credit and XP boosts cap at +40% each. Promote a card to Elite and its doctrine gets 25% stronger.',
        'NEW|Battle Plans: save whole squads as plans in the Collection, each with a Ground and a Fleet team, and load any of them before a battle. 2 plans open at level 15, 4 at level 25 and all 6 at level 40. Name them as you like, and make one your Flagship: Auto-continue and Replay ×3 fly with it. Edit every plan from the Plans button before a battle, or hide the panel in the Collection. Your main teams become your first plan.',
        'IMPROVED|Joined from a friend\'s invite link or QR code? Once you unlock Friends and pick a callsign, you automatically send them a friend request.',
        'NEW|Turn Meter track: a live race right under the turn order in every battle. Every fighter\'s portrait slides toward GO as their Turn Meter fills (your squad below the line, enemies above). Whoever reaches GO hops to the front and takes their turn, then warps back to the start. Faster cards race quicker, and faces glow just before they move.',
        'IMPROVED|Turn Meter, made easy: the blue bar under every battle card is bigger and glows when that card is about to move, tap a card\'s bars to see its Turn Meter, Ultimate and health, and Captain Rex teaches it in the opening tutorial with a Turn Meter race.',
        'NEW|Something out there has started to hum. Listen closely, Seekers.',
        'NEW|HoloNet Season 2 ends tonight, November 11, at 6:00 PM Central. Log in after it closes and Admiral Ackbar has your season recap ready: your final place in the world, your league, your record and your favorite card, then collect your reward.',
        'NEW|A break between seasons: after each season ends there are two days before the next one starts, so Season 3 begins Friday, November 13, at 6:00 PM Central. During the break the HoloNet counts down to the new season and ranked battles wait for it; raids, guilds and friendly battles carry on.',
        'NEW|Champion\'s Card: finish a HoloNet season in the Legend league as number one in the world, and Admiral Ackbar asks you to design a card of your own: its rarity, who it is, its job, its abilities, its look and how players find it. Once it\'s built you see it first, watch it fight, and approve it before it joins the galaxy with your callsign on it.',
        'BALANCE|Levelling a card from 31 up to 35 costs a quarter more.',
        'IMPROVED|Coruscant Under Siege gets tougher levels and BX Commando Droids in its ranks.',
        'BALANCE|Replaying a stage you\'ve already beaten pays 60% of its rewards.',
        'BALANCE|Beating a campaign stage for the first time gives 1.8× XP, so playing through the first 100 stages (their bosses included) takes you to about level 24, close to the HoloNet at 25.',
        'IMPROVED|Already finished a world before 2.4? You keep every stage you beat, your squad slots and the next worlds open. Go back for the new stages and the boss to liberate it.',
        'IMPROVED|Phones held sideways: the Turn Meter sits at the top right, your ability buttons are bigger and fill the space (an odd one out, like an Ultimate, runs full width), every card fits on screen, and Captain Rex\'s intel shows more at a glance.',
        'FIXED|The Death Star no longer shows upside down on its battle card.',
        'BALANCE|HoloNet cards rebalanced: 18 of them gain health and attack, and 12 hit harder or recharge faster, so each one stands with the best cards of its rarity. Cad Bane, Kelleran Beq, Hallway Vader and the Dark Trooper get the biggest boosts.',
        'NEW|Beskar Forging: every HoloNet card has its own five-tier upgrade, paid in Beskar. Each tier adds health and armor, and tier 5 unlocks a passive, so your HoloNet cards keep growing after the rest stop.',
        'NEW|Hunters & Clans: two Bounty Hunters or Mandalorians in a squad gain +10% crit chance; three gain more crit, crit damage and armor.',
        'NEW|HoloNet card pairings: Kelleran Beq with Grogu, Krrsantan with Boba Fett, Hallway Vader with Darth Vader, and the Armorer with any Mandalorian each unlock a bonus together.',
        'IMPROVED|HoloNet card jobs: IG-11\'s Nurse Protocol also clears debuffs, Paz Vizsla shares his armor with the squad, Todo 360 repairs droid allies every turn, Greef Karga pays extra credits as well as Beskar, and the Armorer\'s Beskar Plating now blocks the next hit completely, and the Dark Trooper gains Phase III Reboot: once per battle he comes back from a finishing blow.',
        'FIXED|Every HoloNet card\'s passive now works in battle exactly as written on the card.',
        'IMPROVED|Ranked rework: you only face pilots from your own division or one either side (Legend faces only Legend), with four new opponents after every fight. From next season, the leagues are wider, with Legend now starting at 2,500 rating, and wins in the higher leagues are worth more. Each opponent shows what a win is worth in rating and Beskar, and the Gold, Kyber and Legend leagues fight harder and pay more.',
        'NEW|Placement battles: from next season, ranked opens with five Ground placement battles. They open on the last day of the season break (or whenever you arrive), each one adapts to how you fight, and the last is the Boss Trial (fight brilliantly and it becomes an Elite Boss Trial against a fully synergized squad). When the season starts, Admiral Ackbar reveals the league you start in. Fleet ranked opens once they\'re done.',
        'IMPROVED|Every raid, guild raids included, now has a 5-minute raid clock on screen.',
        'FIXED|Raids no longer end early: a raid only ends when its clock runs out, the boss falls or your squad does.',
        'BALANCE|Raid bosses are built to last the week: far more health (about 150 million on the HoloNet raid, and guild raids grow with your guild), 3 runs a day each, and every raider\'s damage counts on the board.',
        'NEW|Some say a pilot who stands first everywhere at once earns something no one else can wear.',
        'IMPROVED|Guilds: leaders can now demote a co-leader or elder, the Manage button no longer covers a member\'s rank, and every member shows their profile frame.',
        'IMPROVED|Finding a guild: search sits at the top, Guilds you may like suggests ones you can join right now, more guilds are waiting to be found, and founding your own is tucked into a dropdown. Founding a guild now costs 100 Kyber and 500 Beskar.',
        'NEW|Guild polls and blacklist: leaders can start polls in guild chat that the whole guild votes on, and remove and blacklist a player so they can\'t rejoin or ask to join. The leader decides whether co-leaders and elders can use them too.',
        'NEW|Win streaks catch fire: hit 3 wins in a row and a flame appears by your name, burning hotter every 10 wins. Your arena and duel win streaks show on your profile.',
        'IMPROVED|Leaderboards show the top 50 pilots, each with their picture, frame and current win streak, plus a top-3 podium, your own spot with how far it is to the next rank, and daily up and down arrows. Ratings now sit right next to every name, and the raid damage board shows everyone hitting the boss this week.',
        'NEW|Tap anyone on the leaderboards to open their profile and add them as a friend, or tap a guild to see its members. Star your favorite friends to pin them to the top of your list.',
        'IMPROVED|Guild settings are tidier: who can join, requests, announcements, polls and the blacklist each fit on one line with simple switches.',
      ],
    },
    {
      v: '2.3', date: 'November 4, 2026', title: 'The Hutt\'s Vault', from: LAUNCH_23,
      items: [
        'NEW|The Legendary Exchange: once a week, at a time no one knows, a Hutt broker opens his vault for 30 minutes. Trade 5 Aurodium Ingots for 15,000 credits. Look under the gambling tables.',
        'NEW|Auto-open (level 30): open Black Market crates hands-free until you reach your number.',
        'NEW|Main teams: pick a Ground and a Fleet main team in the Collection, using its filters. Auto-continue (Next and Repeat) and Replay ×3 start every battle with them, unless you change your squad for that battle.',
        'NEW|Captain Rex joins every battle in place of the bonus chips. Tap him to see both squads side by side: every bonus and multiplier, each troop\'s boosts, the buffs and debuffs on them right now, and a guide to every battle icon.',
        'NEW|Tap any icon on a battle card to see what it does and how many turns it has left.',
        'NEW|Promote All (level 20): promote every card with a full shard bar at once, then scroll through a promotion report with each card\'s new stars and stats.',
        'NEW|Buy Chance Cubes and Loaded Dice several at a time: −10, −1, type any amount, +1, +10 or Max.',
        'BALANCE|Live Duels, Friendly Battles and Wager duels: you each ban two cards now (was one). You take turns: challenger, opponent, challenger, opponent.',
        'NEW|Season recap: when a HoloNet season ends, Admiral Ackbar welcomes you onto Home One\'s bridge with your final report: where you finished in the world (every pilot counted, bots included), your league and season best, your all-time high, your record, raids and favorite card of the season. Then collect your season reward.',
        'NEW|True Strength friendly battles: pick True Strength in Friends and every card fights at its real level and stars, so your level 40s take on their level 25s. Even mode (every card at Level 20 ★3) is still there. Just for fun: no rating, no rewards.',
        'NEW|Seekers who find hidden things now have somewhere to keep them, and every find gets its own moment. Keep your eyes open.',
        'IMPROVED|Open your Seeker\'s Codex straight from your Commander profile, and enter codes from inside it (both are still in Settings too).',
        'IMPROVED|Watching a card\'s ultimate from the Collection always starts at 1× speed, so you see all of it. The speed button still works there and doesn\'t change your battle speed.',
        'NEW|Wager duels: reach Silver III in a season to unlock a Wager tab in Live Duels. After bans you have 45 seconds to agree a stake of 1,000 to 100,000 credits (offer, counter or accept, and chat). The winner takes both wagers minus a 10% house tax. Rating counts, and leaving counts as a loss. Up to 5 a day with the same pilot.',
        'NEW|The Dark Trooper is now Mythic, and he\'s the first HoloNet card you can also use in the main game: campaign, bosses, the Endless Tower and more. He\'s still a rare guild raid drop (1 in 100 each time your guild beats the raid), and his Beskar Alloy passive now works: 25% less damage from attacks.',
        'IMPROVED|Chat while you fight: tap a new message to reply straight away, even mid-battle (the battle keeps going underneath). If a friend asks for a battle while you\'re busy, you see who asked and can tap to message them.',
        'IMPROVED|The results screen has a Home button, and the level-up celebration now waits until you leave your run of battles (Next, Repeat and Retry keep you in the fight), so it never pops up mid-battle.',
        'IMPROVED|Faster and smoother: after your first visit the game loads straight from your device, updates only download what changed, and the galaxy map, battle backdrops and glowing effects use far less power. Chromebooks and low-memory devices start in Performance mode (you can switch it off in Settings).',
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
        'IMPROVED|The Death Star\'s superlaser is rebuilt: the station looms over the battle, eight beams converge on its dish, then one massive beam strikes with a shockwave.',
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
      v: '2.2.1', date: 'October 28, 2026', title: 'Guild Overhaul', from: LAUNCH_221,
      items: [
        'NEW|Guild levels: leaders and co-leaders now level up the guild with Beskar from the Beskar Vault. Every level costs more than the last (2,500 Beskar for level 2, up to 70,000 for level 10), and higher levels open stronger upgrades. Guilds keep the level they already have.',
        'BALANCE|Guild upgrades are cheaper: 1,500, 3,500 and 7,000 Beskar for levels 1, 2 and 3.',
        'NEW|Rank badges: the leader, co-leader and elders each get a symbol and a coloured name everywhere in the HoloNet. The leader picks each rank\'s symbol and colour in Edit guild.',
        'NEW|Guild raids now have a 5-minute clock on screen. When it runs out: Time\'s up! Beat your best damage against a raid boss and the results show a big NEW BEST, with your previous best; otherwise you see the damage dealt and your best.',
        'BALANCE|Guild raids: 3 ground runs and 3 fleet runs a day per player.',
        'NEW|Guild chat comes alive: react to messages (👍 🔥 😂 ⚔️ ❤️), see rank badges by names, and the chat posts when the guild levels up, buys an upgrade or someone sets a new raid best.',
        'BALANCE|HoloNet: Beskar comes a little slower (arena wins, raids, guild raids, duels and guild rewards pay about 30% less), and Beskar pucks and Forge cards cost about 30% less to match.',
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
        'NEW|See what your friends are playing: Online · Playing the Campaign, In a Friendly Battle, Climbing the Tower and more (secret areas stay a secret). Don\'t want to share? Turn it off in Settings, under Friends.',
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
        'IMPROVED|Battles run lighter: health, turn and ultimate bars, target glows, glowing card frames and lightsabers no longer redraw the cards every frame, so battles stay smooth and use less battery. The loading screen logo downloads five times faster.',
        'FIXED|Some ultimates weren\'t playing their animations; Performance mode now keeps every card\'s own ultimate.',
        'FIXED|On phones, a friend\'s "Last online" tag no longer runs off the edge of their profile; long ones wrap onto a second line.',
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
    // themed: numbers glow gold and each note gets an icon on its tag.
    itemsHtml(items, themed) {
      const esc = root.UI.esc;
      const LABEL = { NEW: 'New', IMPROVED: 'Improved', BALANCE: 'Balance', FIXED: 'Fixed' };
      const ICON = { NEW: '✦', IMPROVED: '▲', BALANCE: '⚖', FIXED: '✚' };
      const glow = (t) => esc(t).replace(/(?<![#\d])(\d+(?:[.,]\d+)*(?:%|×|★)?)/g, '<b class="lbl-num">$1</b>');
      return `<ul class="ul-items">${items.map((line, k) => {
        const [tag, text] = line.includes('|') ? line.split('|') : ['NEW', line];
        return `<li class="ul-item t-${tag.toLowerCase()}" style="--k:${k}"><span class="ul-tag">${themed ? `<i>${ICON[tag] || '✦'}</i>` : ''}${LABEL[tag] || tag}</span><span class="ul-text">${themed ? glow(text) : esc(text)}</span></li>`;
      }).join('')}</ul>`;
    },

    // Themed logs come alive as you scroll: each note slides in when it
    // reaches the screen, and section headers draw their line and wake their
    // little animation. A bar at the top shows how far down you are.
    animate(scroller) {
      const box = scroller.querySelector('.lbl');
      if (!box) return;
      box.classList.add('anim');
      const io = 'IntersectionObserver' in root ? new IntersectionObserver((list) => {
        for (const e of list) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }, { root: scroller, threshold: 0.12 }) : null;
      box.querySelectorAll('.ul-item, .lbl-sec h3').forEach((n) => (io ? io.observe(n) : n.classList.add('in')));
    },

    entryHtml(u, open) {
      const esc = root.UI.esc;
      return `<details class="ul-entry ${u.theme ? `th-${u.theme}` : ''}" ${open ? 'open' : ''}>
        <summary><span class="ul-ver">v${esc(u.v)}</span><b>${esc(u.title)}</b><span class="ul-date">${esc(u.date)}</span><span class="ul-chev">▾</span></summary>
        ${u.theme ? this.themedHtml(u, true) : this.itemsHtml(u.items)}
      </details>`;
    },

    // A themed update: banner (every world lighting up), the numbers, then
    // its notes in sections. Each note goes in the first section it matches;
    // anything left over lands in the last one.
    themedHtml(u, compact) {
      const esc = root.UI.esc;
      const D = root.GameData;
      const worlds = (D && D.PLANETS ? D.PLANETS : []).map((p, i) => `<span class="lbl-w" style="--i:${i}" title="${esc(p.name)}"><canvas width="56" height="56" data-lblw="${esc(p.id)}"></canvas></span>`).join('');
      const left = u.items.slice();
      const take = (re) => { const out = []; for (let i = 0; i < left.length; i++) if (re && re.test(left[i])) { out.push(left[i]); left.splice(i--, 1); } return out; };
      const secs = u.groups.map(([title, icon, pat], k) => [title, icon, k === u.groups.length - 1 ? null : take(pat ? new RegExp(pat, 'i') : null)]);
      secs[secs.length - 1][2] = left;
      const decos = u.decos || ['galaxy', 'cards', 'squad', 'holonet', 'ranked', 'credits', 'secret'];
      const bulbs = (n) => `<div class="cos-bulbs">${Array.from({ length: n }, (_, i) => `<i style="--i:${i % 4}"></i>`).join('')}</div>`;
      const hero = u.theme === 'cosmetic'
        ? `<div class="lbl-hero cos">${bulbs(22)}
          <div class="cos-signs"><span class="cs vk">VEKKO<small>THE FENCE</small></span><span class="cs lu"><i></i>LUTHEN'S GALLERY<i></i></span><span class="cs wa">WATTO'S<small>WAGERS</small></span></div>
          <p class="lbl-kick">Update ${esc(u.v)} · Grand Opening</p><h2 class="lbl-title cos-t">${esc(u.title).toUpperCase()}</h2>${bulbs(22)}</div>`
        : `<div class="lbl-hero"><div class="lbl-stars"></div><div class="lbl-worlds">${worlds}</div>
          <p class="lbl-kick">Update ${esc(u.v)}</p><h2 class="lbl-title">${esc(u.title).toUpperCase()}</h2><p class="lbl-date">${esc(u.date)} · The biggest update yet</p></div>`;
      return `<div class="lbl ${compact ? 'compact' : ''} ${u.theme === 'cosmetic' ? 'cosm' : ''}">
        ${hero}
        <div class="lbl-stats ${(u.stats || []).length > 6 ? 'many' : ''}">${(u.stats || []).map(([n, l], i) => `<div style="--i:${i}"><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join('')}</div>
        ${secs.filter((x) => x[2].length).map(([title, icon, items], k, arr) => `<section class="lbl-sec deco-${decos[u.groups.findIndex((g) => g[0] === title)] || 'galaxy'} ${k === arr.length - 1 ? 'last' : ''}" style="--i:${k}"><h3><i>${icon}</i><span>${esc(title)}</span><em class="lbl-deco" aria-hidden="true"><b></b><b></b><b></b></em></h3>${this.itemsHtml(items, true)}</section>`).join('')}
      </div>`;
    },

    // Light up the banner's worlds (canvas spheres), one after another.
    paintWorlds(scope) {
      if (!root.drawPlanetSphere) return;
      scope.querySelectorAll('canvas[data-lblw]').forEach((c) => {
        if (c.dataset.done) return;
        c.dataset.done = '1';
        try { root.drawPlanetSphere(c.getContext('2d'), 28, 28, 20, c.dataset.lblw, 1.1, { halo: 0.35 }); } catch (e) { /* leave it blank */ }
      });
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
      this.paintWorlds(m.root);
      m.root.querySelectorAll('.ul-entry.th-liberation, .ul-entry.th-cosmetic').forEach(() => this.animate(list));
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

    // Owner preview of an update's What's New before it's out: Changelog.preview('2.4').
    preview(v) { const u = ALL_UPDATES.find((x) => x.v === v); if (u) this.showWhatsNew(u); },

    // After an update: show what's new once, the next time the game opens.
    showWhatsNew(only) {
      const UI = root.UI;
      const u = only || UPDATES[0];
      const m = UI.openModal(`${u.theme ? this.themedHtml(u) : `<div class="ul-head"><span class="ul-badge">What's new</span><span class="ul-ver big">v${UI.esc(u.v)}</span><h2>${UI.esc(u.title)}</h2></div>
        <p class="ul-date-line">${UI.esc(u.date)}</p>
        ${this.itemsHtml(u.items)}`}
        <p class="ul-safe">Your progress is safe: updates never reset your save.</p>
        ${RELOAD_NOTE}
        <div class="modal-actions"><button class="btn" type="button" data-all>Full update log</button><button class="btn btn-primary" type="button" data-close>${u.theme === 'liberation' ? 'Liberate the galaxy' : u.theme === 'cosmetic' ? 'Open the shops' : "Let's go"}</button></div>
        ${u.theme ? '<div class="lbl-foot"><button type="button" class="lbl-more" data-more>Keep scrolling ↓</button><div class="lbl-prog" aria-hidden="true"><i></i></div></div>' : ''}`, { small: true, cls: `update-modal ${u.theme ? `th-${u.theme}` : ''}`, dismissable: !u.theme });
      this.paintWorlds(m.root);
      // The biggest update: you read to the end before you can close it. The
      // buttons wait at the bottom, and Escape or a tap outside does nothing.
      if (u.theme) {
        const sc = m.root.querySelector('.modal');
        this.animate(sc);
        const bar = m.root.querySelector('.lbl-prog i');
        const more = m.root.querySelector('[data-more]');
        const btns = m.root.querySelectorAll('.modal-actions .btn');
        btns.forEach((b) => { b.disabled = true; });
        const onScroll = () => {
          const max = sc.scrollHeight - sc.clientHeight;
          const p = max > 0 ? Math.min(1, sc.scrollTop / max) : 1;
          bar.style.transform = `scaleX(${p})`;
          if (p > 0.985) { btns.forEach((b) => { b.disabled = false; }); more.classList.add('gone'); m.root.querySelector('.lbl-foot').classList.add('done'); m.root.querySelector('.modal-actions').classList.add('ready'); }
        };
        sc.addEventListener('scroll', onScroll, { passive: true });
        more.addEventListener('click', () => sc.scrollBy({ top: sc.clientHeight * 0.8, behavior: 'smooth' }));
        onScroll();
      }
      m.root.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) m.close();
        if (e.target.closest('[data-all]')) { m.close(); this.showAll(); }
        if (e.target.closest('[data-reload]')) location.reload();
      });
      this.markSeen();
    },

    seen() {
      // 2.4.1's notes moved into 2.5: anyone who opened 2.4.1 has seen 2.4.
      try { const v = localStorage.getItem(SEEN_KEY); return v === '2.4.1' && this.latest === '2.4' ? '2.4' : v; } catch (e) { return this.latest; }
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
