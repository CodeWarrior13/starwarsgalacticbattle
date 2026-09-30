# Galactic Card Battles

A turn-based Star Wars card battler inspired by *Star Wars: Galaxy of Heroes*. Collect heroes, villains and starfighters, level them up, earn stars, and lead squads through ground and fleet campaigns.

## Play

Open `index.html` in a modern browser. No build step or server is needed. Progress saves automatically in `localStorage`.

To produce a single self-contained HTML file (handy for sharing):

```
npm run build   # writes dist/galactic-card-battles.html
```

## How it plays

- **Galaxy Map.** Ten planet campaigns (Tatooine, Hoth, Dagobah, Bespin, Endor, Scarif, Coruscant, Geonosis, Mustafar, Exegol) with 60 stages mixing ground and space battles. Liberating a planet opens the hyperspace lane to the next one.
- **Living battlefields.** Every planet has an animated backdrop on the surface and in orbit that reacts to the fight: blasts scatter snow and sand, lasers light up the scene, explosions jolt the parallax layers and leave scorch marks and smoke, and ultimates darken the sky.
- **Terrain and hazards.** Each planet favors certain traits (for both sides) and fires a hazard every few turns: sandstorms, blizzards, eruptions, orbital strikes, Sith lightning and more.
- **Account level and squad slots.** Every battle earns XP; each account level pays out credits and Kyber. Squads start with 3 slots (ground and fleet). Slot 4 needs account level 4 and Tatooine liberated; slot 5 needs level 6 and Hoth liberated. Enemy squads grow the same way (3 on Tatooine, 4 on Hoth, then 5).
- **Turn meter combat.** Every unit fills a turn meter at its Speed; whoever reaches 100% acts next.
- **Synergies.** Units carry traits (Jedi, Sith, Rebel, Empire, Scoundrel, Bounty Hunter, Droid, Trooper, Bad Batch, Nightsister and more), and roles form their own synergies (Medical Corps for healers, Iron Wall for tanks, Strike Team for damage dealers). Fielding all five of the Bad Batch unlocks a full-squad bonus. Units fly into their squad slots and every new synergy plays an activation banner. Matching traits, all-Light or all-Dark squads, balanced roles and planet terrain stack bonuses to health, attack, armor, speed, crit, lifesteal, regeneration and the rare chance to double hit.
- **Abilities and ultimates.** Each unit has a basic attack, specials with cooldowns, and an ultimate with a cutscene plus a signature animation (strafing runs, bombing runs, torpedoes, Force lightning, chokes, saber dashes, leaps, orbital strikes and more).
- **Boss battles.** The Rancor, a Krayt Dragon, Lord Vader, an Imperial Star Destroyer and the Death Star. Bosses are immune to Stun and become Enraged below 50% HP.
- **Collection.** 49 characters and 13 ships (including droids like C-3PO, BB-8, K-2SO, Chopper, IG-88, IG-11, Droidekas and MagnaGuards, medics like 2-1B, Barriss Offee and Mother Talzin, and the Bad Batch) with hand-drawn cover art, filterable by class (Healer, Tank, Fighter, Ranged, Support, Force User, Droid, Starfighter, Bomber, Gunship) with a Light/Dark breakdown. Tap a card to flip it; swipe for stats and upgrades.
- **Nar Shaddaa Night Market.** Crates, flash sales with countdowns, rotating Hot Stock, lucky charms, a Sabacc table and the Droid Shell Game.
- **Luck.** Victory credit spins, Holo cards, Chance Cubes, Loaded Dice and a Legendary pity counter.
- **PC controls.** 1–5 pick abilities, R picks the ultimate, ←/→ move the target, Enter attacks, A toggles auto, F changes speed, ? shows help.

## Project layout

| Path | Purpose |
| --- | --- |
| `js/data.js` | Units, bosses, abilities, ultimates, traits, synergies, classes, planets, crates, luck tables |
| `js/art.js` | SVG cover art for every unit, boss, crate and currency |
| `js/env.js` | Animated, reactive planet backdrops (surface and orbit) and the Galaxy Map |
| `js/battle.js` | Battle engine (no DOM): turn meter, damage, statuses, AI |
| `js/state.js` | Save data, currencies, crates, luck, Black Market, auto-build, rewards |
| `js/ui.js` | Screens: home, campaign, bosses, squad select, collection, card inspector, Black Market |
| `js/battle-ui.js` | Battle screen, animations, ultimate cutscenes, hyperspace intro |
| `js/main.js` | Boot and ambient starfield |
| `css/styles.css` | All styling and animation |
| `tests/sim.test.js` | Headless engine and balance checks (`npm test`) |

## Adding content

Add a unit by appending an entry to `UNITS` in `js/data.js`, a bio to `BIOS`, and a drawing to `CHAR` (or a ship shape to `SHIPS`) in `js/art.js`. Give it a unique ultimate in `ULTIMATES`, or leave that out to get the default ultimate for its role. Planet stages are plain lists of enemy ids and a level; squads are topped up to 5 with the planet's reinforcements.
