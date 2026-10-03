# Galactic Card Battles

A turn-based Star Wars card battler inspired by *Star Wars: Galaxy of Heroes*. Collect heroes, villains and starfighters, level them up, earn stars, and lead squads through ground and fleet campaigns.

## Play

**In your browser:** https://codewarrior13.github.io/turn-based-star-wars-card-game/ (once GitHub Pages is switched on for this repo).

**On your own computer:** click the green **Code** button above, choose **Download ZIP**, unzip it and open `index.html` in Chrome, Edge, Firefox or Safari. No install, build step or server is needed. Progress saves automatically in your browser.

Works on PC (mouse and keyboard: 1–5 abilities, ←/→ targets, Enter attacks) and on phones in portrait or landscape (swipe between tabs).

### Testers

This is an early build. Things worth trying: the galaxy campaign, ground and fleet battles, opening relics in the Black Market, upgrading cards in the Collection, the Endless Tower and boss fights. If something looks wrong, a screenshot plus what you tapped right before it helps a lot. Settings (gear icon, top right) has sound options and a progress reset.

To produce a single self-contained HTML file (handy for sharing):

```
npm run build   # writes dist/galactic-card-battles.html
```

## How it plays

- **The Galaxy hub.** One screen for every fight: an interactive galaxy map of your progress with dogfights, Star Destroyers, the Falcon jumping to lightspeed, Mando on his jetpack, Grogu's pram, R2's escape pod and probe droids drifting through. Toggle **Ground**, **Fleet**, **Bosses** and the **Endless Tower** at the top. Each world shows its stages as its own themed progress ring (twin suns on Tatooine, ice shards on Hoth, flames on Mustafar…). Tap a world to play its arrival cinematic (its living battlefield, spinning sabers and a title band), then pick a stage from the drop-down datapad; each world's finale boss and boss battles sit at the end of its list.
- **A galaxy that changes as you go.** The map's backdrop follows the newest world you have reached, and each of the 11 worlds has its own: Tatooine's twin suns and drifting sand, Hoth's aurora and snow, Dagobah's mist and fireflies, Bespin's cloud banks and Cloud City, Endor's half-built Death Star, Scarif's shield-gate grid, Coruscant's skyline and traffic lanes, Geonosis's asteroid ring, Mustafar's lava glow and embers, Exegol's lightning storm and the Battle of Coruscant's flak. That sector's ships cross the map trading laser fire, stars drift past in three parallax layers, and reaching a new world announces the new sector.
- **Endless Tower.** Infinite floors on random worlds with random squads (often a themed group like the Inquisitorius or Bad Batch) and a boss every 10 floors. Enemies get tougher and rewards grow as you climb; losing drops you back to the last checkpoint (floors 1, 11, 21…) and re-rolls the floors above.
- **Galaxy Map.** Eleven planet campaigns (Tatooine, Hoth, Dagobah, Bespin, Endor, Scarif, Coruscant, Geonosis, Mustafar, Exegol and the post-game Battle of Coruscant) with 70 stages mixing ground and space battles. Liberating a planet opens the hyperspace lane to the next one.
- **Battle of Coruscant.** Ten stages under battle-scarred skies: Venators and Separatist cruisers trade turbolaser fire, flak bursts, burning wreckage streaks down past the burning Jedi Temple, and LAAT gunships sweep the city. The Falling Wreckage hazard sends a hull section crashing into the battlefield.
- **Living battlefields.** Every planet has an animated backdrop on the surface and in orbit that reacts to the fight: blasts scatter snow and sand, lasers light up the scene, explosions jolt the parallax layers and leave scorch marks and smoke, and ultimates darken the sky.
- **Terrain and hazards.** Each planet favors certain traits (for both sides) and fires a hazard every few turns: sandstorms, blizzards, eruptions, orbital strikes, Sith lightning and more.
- **Tutorial.** On a device's first open, Captain Rex briefs you and coaches you through a training battle on Tatooine: health, abilities and cooldowns, turn order, Ultimates, squad bonuses and focus fire. Win it to unlock the 10 starter cards, 600 credits and 100 Kyber, take a quick tour of the tabs, and earn the Tutorial Complete badge. Players who already know the game can hold the skip button during the first 10 seconds (the starter squad still unlocks). It runs once per save; replay it any time from Settings, which pays out nothing extra. Saves from before the tutorial get it once and keep everything they own.
- **Calendar events.** On May the 4th the galaxy turns Jedi blue and offers a free Jedi Holocron plus 25 Kyber (once a year). On Revenge of the Fifth (May 5th) it turns Sith red and your Dark side cards fight with 20% more attack and health. Events follow your device's date.
- **Commander profile.** Tap the level chip in the top bar for your profile: a Clash Royale-style rank road of every level reward, a badge for each liberated world, battle records, luck stats and feats to chase. Feats earn Bronze, Silver, Credit or Kyber medals; tap an earned one to replay its moment, which gets bigger the harder the feat was.
- **Account level and squad slots.** Every battle earns XP, including a little for losses; each account level pays out credits and Kyber, every 5th level pays a bigger Kyber bonus, and level-ups get a rank-up moment. Squads start with 3 slots (ground and fleet). Slot 4 needs account level 4 and Tatooine liberated; slot 5 needs level 6 and Hoth liberated. Enemy squads grow the same way (3 on Tatooine, 4 on Hoth, then 5).
- **Turn meter combat.** Every unit fills a turn meter at its Speed; whoever reaches 100% acts next.
- **Synergies.** Units carry traits (Jedi, Sith, Rebel, Empire, Scoundrel, Bounty Hunter, Droid, Trooper, Bad Batch, Nightsister, Inquisitor and more), and roles form their own synergies (Medical Corps for healers, Iron Wall for tanks, Strike Team for damage dealers). Fielding all five of the Bad Batch, or all five of the Inquisitorius (Grand Inquisitor, Second Sister, Fifth Brother, Seventh Sister, Eighth Brother), unlocks a full-squad bonus. Units fly into their squad slots and every new synergy plays an activation banner. Matching traits, all-Light or all-Dark squads, balanced roles and planet terrain stack bonuses to health, attack, armor, speed, crit, lifesteal, regeneration and the rare chance to double hit.
- **Abilities and ultimates.** Each unit has a basic attack, specials with cooldowns, and an ultimate with a cutscene plus a full-screen signature animation that breaks out of the battlefield. Every unit has its own mix of move, weapon, impact and color, and rarer units get a bigger show: Rare adds a charge-up, Epic adds cinematic bars and a shockwave finale, Legendary adds god-rays, a gold title and a slow-motion finale, and Mythic adds glitches, red lightning and a screen tear: thrown sabers that slice cards in half, Han's bolts ricocheting off the screen edges, Palpatine's lightning storm, Vader's choke lifting cards, Boba's homing rockets, Slave I's seismic charges shattering cards, X-wings and TIE formations strafing across the whole screen, healing auroras and shield walls for support ultimates.
- **Ability numbers.** In battle every ability shows what it will do: average damage against the target you have selected (per hit, or each for area attacks) and how much it heals, with the full breakdown under the buttons. Enemy health numbers are a little bigger so they are easy to read.
- **Squad bonuses in battle.** Both teams' active bonuses sit at the edge of the battlefield; tap one to drop down exactly what it does and who it affects.
- **Boss battles.** The Rancor, a Krayt Dragon, Lord Vader, an Imperial Star Destroyer and the Death Star. Bosses are immune to Stun and become Enraged below 50% HP.
- **Mythic cards.** A fifth rarity above Legendary, very rare (0.4% from the Astromech Delivery and Carbonite Block, up to 3% in the Sith Holocron): Darth Revan, Starkiller, Jedi Master Luke and the Ghost, each with a one-of-a-kind ultimate.
- **Relics instead of crates.** Cards come from Star Wars objects: an **Astromech Delivery** (an R2 unit with hero datacards), a **Carbonite Block** (ships), a **Jedi Holocron** (rare or better) and a **Sith Holocron** (guaranteed Legendary). Each floats over a glowing pedestal in the shop with a colour-coded odds bar and its own idle animation. Two other complete sets are built in: faction crates (Rebel supply drop, Imperial cargo, Jedi vault, Hutt chest) and holographic projections. Set `CRATE_STYLE` near the top of the crate section in `js/art.js` to `'faction'` or `'holo'` to switch.
- **Crate openings.** The crate's build-up scales with the best card inside (Mythic crates pretend to be rare, then glitch). Cards come out one at a time: the next one stays hidden under the deck until the current reveal finishes and you tap **Next card**, and a finished crate lays out everything you pulled. Once a card is revealed, tap it to deal and open the next one. Every pull gets a FIFA-style walkout of about nine seconds: allegiance, class, homeworld (or hyperspace for ships), then the card with its stats popping up one by one.
- **Collection.** 93 cards: 69 characters and 24 ships (including Cal Kestis, Bo-Katan, Sabine, Hondo Ohnaka, Savage Opress, the U-Wing, the Upsilon shuttle and the Hound's Tooth, droids like C-3PO, BB-8, K-2SO, Chopper, IG-88, IG-11, Droidekas and MagnaGuards, medics like 2-1B, Barriss Offee and Mother Talzin, and the Bad Batch) with hand-drawn cover art, filterable by class (Healer, Tank, Fighter, Ranged, Support, Force User, Droid, Starfighter, Bomber, Gunship; each card leads with its role, and Fighter or Ranged marks damage dealers) with a Light/Dark breakdown, tucked into a **Filter & sort** drop-down so the cards get the screen (a summary line shows what is active). Tap a card to flip it; swipe for stats, upgrades and its **Ultimate** page, and keep swiping past the Ultimate page to deal in the next card's cover art (or back past Stats to the previous card's cover). Upgrade feedback appears as one badge above the full-width Close bar ("Level 11! ×6") instead of a stack of pop-ups, where **Watch it in action** plays the ultimate in a training simulation.
- **Daily login streak.** Seven flip cards in the Night Market. The front shows the day and each day looks rarer than the last (bronze up to a holo day 7); tap a card to flip it and see what it pays. A full week pays 130 Kyber (20 on day 3, 30 on day 5, 80 on day 7). Miss a day and the streak restarts.
- **Kyber is rare.** Battles pay 1 Kyber for a first clear (2 for a world's final stage), bosses 3 on the first win, liberating a world 5, and tower floors 1 every fifth floor (2 for a boss floor). Account levels pay 2 (10 every fifth level). Night Market Kyber prices match: the Jedi Holocron is 50, Chance Cubes 25, a restock 10, and the Kyber Exchange trades 20 Kyber for 1,000 credits. Reward cards on the results screen open in the card viewer when tapped.
- **Mechanic-changing ships.** The ARC-170, Delta-7, TIE Defender and TIE Silencer bring new effects: revive a fallen ally, cleanse debuffs, strip enemy buffs, and execute strikes that hit harder against wounded targets.
- **Nar Shaddaa Night Market.** Crates, hourly flash sales, rotating Hot Stock, lucky charms, a Sabacc table and the Droid Shell Game.
- **Luck.** Victory credit spins, Holo cards, Chance Cubes, Loaded Dice and a Legendary pity counter. Landing the top multiplier plays a full-screen Star Wars pun.
- **Premium feel.** Every button glints on hover, squashes and ripples on press, and primary actions throw sparks; currencies roll up to new totals.
- **Squad filters.** On the squad screen, one slim bar filters your roster by role (Attacker, Tank, Healer, Support) and by trait (Jedi, Rebel, Trooper…). Trait chips show how many you own and how many are already in your squad, glowing green when the squad already has some, so building synergies is quick.
- **Auto-build.** Builds a balanced squad: one tank, one healer and one support at most, then damage dealers, favoring units that complete synergies.
- **Sound and music.** Synthesized blasters, sabers, explosions, lightning, crate rumbles, reveal stings and fanfares, plus two original cinematic themes: a slow, dark galaxy theme and a war-drum battle theme, with strings, low brass and a big hall reverb. The settings button in the top bar holds volumes, your own music files (which stay in your browser) and the progress reset.
- **Phones, portrait or landscape.** On a phone the tabs move to a starship-console bar (a side rail in landscape) with hexagonal holo buttons and a lightsaber that slides to the active tab (blue for Galaxy, green for Collection, red for the Black Market) and you can swipe left and right between Galaxy, Collection and Black Market. Landscape battles put the battlefield on the left and your abilities on the right.
- **Star Wars icons.** Every icon is a custom drawing (crossed sabers, X-wings, the Death Star, the Rebel starbird, the Imperial cog, trooper helmets) instead of emoji.
- **PC controls.** 1–5 pick abilities, R picks the ultimate, ←/→ move the target, Enter attacks, A toggles auto, F changes speed, ? shows help.

## Custom card art

Drop images named after unit ids (for example `luke.png` or `slave_one.jpg`) into `art/`, run `npm run art`, then `npm run build`. Matching images replace the drawn cover art everywhere and are embedded in the single-file build. See `art/README.md`.

## Project layout

| Path | Purpose |
| --- | --- |
| `js/data.js` | Units, bosses, abilities, ultimates, traits, synergies, classes, planets, crates, luck tables |
| `js/art.js` | SVG cover art for every unit, boss, crate and currency |
| `js/env.js` | Animated, reactive planet backdrops (surface and orbit) and the Galaxy Map |
| `js/battle.js` | Battle engine (no DOM): turn meter, damage, statuses, AI |
| `js/state.js` | Save data, currencies, crates, luck, Black Market, auto-build, rewards |
| `js/events.js` | Calendar events (May the 4th, Revenge of the Fifth): theme, gift and battle boost |
| `js/tutorial.js` | First-run tutorial: Rex's briefing, coached training battle, hold-to-skip, starter unlock, tab tour and badge |
| `js/ui.js` | Screens: Galaxy hub (modes, planet cinematic, stage datapad, tower), squad select, collection, card inspector, Black Market, daily streak, profile and settings |
| `js/icons.js` | Star Wars SVG icon set; swaps glyphs in page text for icons automatically |
| `js/battle-ui.js` | Battle screen, animations, ultimate cutscenes, hyperspace intro |
| `js/audio.js` | Synthesized sound effects, original music themes and custom music |
| `js/ults.js` | Full-screen signature ultimates: moves, props and card impacts for every unit |
| `js/art-images.js` | Generated map of custom card art in `art/` (`npm run art`) |
| `js/main.js` | Boot and ambient starfield |
| `css/styles.css` | All styling and animation |
| `tests/sim.test.js` | Headless engine and balance checks (`npm test`) |

## Adding content

Add a unit by appending an entry to `UNITS` in `js/data.js`, a bio to `BIOS`, and a drawing to `CHAR` (or a ship shape to `SHIPS`) in `js/art.js`. Give it a unique ultimate in `ULTIMATES`, or leave that out to get the default ultimate for its role. Planet stages are plain lists of enemy ids and a level; squads are topped up to 5 with the planet's reinforcements.
