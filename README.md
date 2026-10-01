# Galactic Card Battles

A turn-based Star Wars card battler inspired by *Star Wars: Galaxy of Heroes*. Collect heroes, villains and starfighters, level them up, earn stars, and lead squads through ground and fleet campaigns.

## Play

Open `index.html` in a modern browser. No build step or server is needed. Progress saves automatically in `localStorage`.

To produce a single self-contained HTML file (handy for sharing):

```
npm run build   # writes dist/galactic-card-battles.html
```

## How it plays

- **The Galaxy hub.** One screen for every fight: an interactive galaxy map of your progress with dogfights, Star Destroyers, the Falcon jumping to lightspeed, Mando on his jetpack, Grogu's pram, R2's escape pod and probe droids drifting through. Toggle **Ground**, **Fleet**, **Bosses** and the **Endless Tower** at the top. Each world shows its stages as its own themed progress ring (twin suns on Tatooine, ice shards on Hoth, flames on Mustafar…). Tap a world to play its arrival cinematic (its living battlefield, spinning sabers and a title band), then pick a stage from the drop-down datapad; each world's finale boss and boss battles sit at the end of its list.
- **Endless Tower.** Infinite floors on random worlds with random squads (often a themed group like the Inquisitorius or Bad Batch) and a boss every 10 floors. Enemies get tougher and rewards grow as you climb; losing drops you back to the last checkpoint (floors 1, 11, 21…) and re-rolls the floors above.
- **Galaxy Map.** Eleven planet campaigns (Tatooine, Hoth, Dagobah, Bespin, Endor, Scarif, Coruscant, Geonosis, Mustafar, Exegol and the post-game Battle of Coruscant) with 70 stages mixing ground and space battles. Liberating a planet opens the hyperspace lane to the next one.
- **Battle of Coruscant.** Ten stages under battle-scarred skies: Venators and Separatist cruisers trade turbolaser fire, flak bursts, burning wreckage streaks down past the burning Jedi Temple, and LAAT gunships sweep the city. The Falling Wreckage hazard sends a hull section crashing into the battlefield.
- **Living battlefields.** Every planet has an animated backdrop on the surface and in orbit that reacts to the fight: blasts scatter snow and sand, lasers light up the scene, explosions jolt the parallax layers and leave scorch marks and smoke, and ultimates darken the sky.
- **Terrain and hazards.** Each planet favors certain traits (for both sides) and fires a hazard every few turns: sandstorms, blizzards, eruptions, orbital strikes, Sith lightning and more.
- **Commander profile.** Tap the level chip in the top bar for your profile: a Clash Royale-style rank road of every level reward, a badge for each liberated world, battle records, luck stats and feats to chase.
- **Account level and squad slots.** Every battle earns XP, including a little for losses; each account level pays out credits and Kyber, every 5th level pays a bigger Kyber bonus, and level-ups get a rank-up moment. Squads start with 3 slots (ground and fleet). Slot 4 needs account level 4 and Tatooine liberated; slot 5 needs level 6 and Hoth liberated. Enemy squads grow the same way (3 on Tatooine, 4 on Hoth, then 5).
- **Turn meter combat.** Every unit fills a turn meter at its Speed; whoever reaches 100% acts next.
- **Synergies.** Units carry traits (Jedi, Sith, Rebel, Empire, Scoundrel, Bounty Hunter, Droid, Trooper, Bad Batch, Nightsister, Inquisitor and more), and roles form their own synergies (Medical Corps for healers, Iron Wall for tanks, Strike Team for damage dealers). Fielding all five of the Bad Batch, or all five of the Inquisitorius (Grand Inquisitor, Second Sister, Fifth Brother, Seventh Sister, Eighth Brother), unlocks a full-squad bonus. Units fly into their squad slots and every new synergy plays an activation banner. Matching traits, all-Light or all-Dark squads, balanced roles and planet terrain stack bonuses to health, attack, armor, speed, crit, lifesteal, regeneration and the rare chance to double hit.
- **Abilities and ultimates.** Each unit has a basic attack, specials with cooldowns, and an ultimate with a cutscene plus a full-screen signature animation that breaks out of the battlefield. Every unit has its own mix of move, weapon, impact and color, and rarer units get a bigger show: Rare adds a charge-up, Epic adds cinematic bars and a shockwave finale, Legendary adds god-rays, a gold title and a slow-motion finale, and Mythic adds glitches, red lightning and a screen tear: thrown sabers that slice cards in half, Han's bolts ricocheting off the screen edges, Palpatine's lightning storm, Vader's choke lifting cards, Boba's homing rockets, Slave I's seismic charges shattering cards, X-wings and TIE formations strafing across the whole screen, healing auroras and shield walls for support ultimates.
- **Ability numbers.** In battle every ability shows what it will do: average damage against the target you have selected (per hit, or each for area attacks) and how much it heals, with the full breakdown under the buttons. Enemy health numbers are a little bigger so they are easy to read.
- **Squad bonuses in battle.** Both teams' active bonuses sit at the edge of the battlefield; tap one to drop down exactly what it does and who it affects.
- **Boss battles.** The Rancor, a Krayt Dragon, Lord Vader, an Imperial Star Destroyer and the Death Star. Bosses are immune to Stun and become Enraged below 50% HP.
- **Mythic cards.** A fifth rarity above Legendary, crate-only and very rare (0.4% in standard crates, up to 3% in the Aurodium Strongbox): Darth Revan, Starkiller, Jedi Master Luke and the Ghost, each with a one-of-a-kind ultimate.
- **Crate openings.** The crate's build-up scales with the best card inside (Mythic crates pretend to be rare, then glitch). Cards come out one at a time: the next one stays hidden under the deck until the current reveal finishes and you tap **Next card**, and a finished crate lays out everything you pulled. Every pull gets a FIFA-style walkout of about nine seconds: allegiance, class, homeworld (or hyperspace for ships), then the card with its stats popping up one by one.
- **Collection.** 64 characters and 17 ships (including droids like C-3PO, BB-8, K-2SO, Chopper, IG-88, IG-11, Droidekas and MagnaGuards, medics like 2-1B, Barriss Offee and Mother Talzin, and the Bad Batch) with hand-drawn cover art, filterable by class (Healer, Tank, Fighter, Ranged, Support, Force User, Droid, Starfighter, Bomber, Gunship) with a Light/Dark breakdown. Tap a card to flip it; swipe for stats, upgrades and its **Ultimate** page, where **Watch it in action** plays the ultimate in a training simulation.
- **Daily login streak.** Seven flip cards in the Night Market. The front shows the day and each day looks rarer than the last (bronze up to a holo day 7); tap a card to flip it and see what it pays. Miss a day and the streak restarts.
- **A secret.** Something in the Night Market answers to persistence. Four trials wait beyond the map, guarding six exclusive cards (two Light heroes, two Dark heroes and two ships) that show as ??? in your Collection, with no clues, until you win them. Each trial is sealed until you are ready: the Trial of Light needs account level 5 and Tatooine liberated, the Trial of Shadow level 9 and Dagobah, the Sealed Temple level 14, Endor and the Trial of Light, and the Rule of Two level 20, Geonosis and the Trial of Shadow. The first attempt is free; every defeat raises the next entry fee (5, 10, 15, 20, 25, then 50 Kyber) until you win. Trials pay out cards only, with the longest walkouts in the game.
- **Mechanic-changing ships.** The ARC-170, Delta-7, TIE Defender and TIE Silencer bring new effects: revive a fallen ally, cleanse debuffs, strip enemy buffs, and execute strikes that hit harder against wounded targets.
- **Nar Shaddaa Night Market.** Crates, hourly flash sales, rotating Hot Stock, lucky charms, a Sabacc table and the Droid Shell Game.
- **Luck.** Victory credit spins, Holo cards, Chance Cubes, Loaded Dice and a Legendary pity counter. Landing the top multiplier plays a full-screen Star Wars pun.
- **Premium feel.** Every button glints on hover, squashes and ripples on press, and primary actions throw sparks; currencies roll up to new totals.
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
