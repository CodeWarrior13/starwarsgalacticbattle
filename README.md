# Galactic Card Battles

A turn-based Star Wars card battler inspired by *Star Wars: Galaxy of Heroes*. Collect heroes, villains and starfighters, level them up, earn stars, and lead squads through ground and fleet campaigns.

## Play

Open `index.html` in a modern browser. No build step or server is needed. Progress saves automatically in `localStorage`.

To produce a single self-contained HTML file (handy for sharing):

```
npm run build   # writes dist/galactic-card-battles.html
```

## How it plays

- **Turn meter combat.** Every unit fills a turn meter at its Speed; whoever reaches 100% acts next. The upcoming order is shown at the top of the battle screen.
- **Abilities.** Each unit has a basic attack, one or two specials with cooldowns, and an **ultimate** that charges as the unit fights. Firing an ultimate plays a cutscene.
- **Status effects.** Stun, Taunt, Offense/Defense Up and Down, and Burn.
- **Ground and fleet battles.** Ground squads of 4 characters; fleet wings of 3 ships that strafe, fire lasers and torpedoes, and explode when destroyed.
- **Boss battles.** The Rancor, a Krayt Dragon, Lord Vader, an Imperial Star Destroyer and the Death Star. Bosses are immune to Stun and become Enraged below 50% HP. First wins drop an Epic or Legendary card.
- **Collection.** 29 characters and 12 ships with hand-drawn cover art. Tap a card to open it: tap again to flip to its description, swipe left for stats and right for upgrades. Sort by strongest, weakest, rarity or name.
- **Auto-build.** One tap picks your strongest squad with a tank and a healer.
- **Black Market.** Crates (Contraband, Salvage, Kyber Vault, Aurodium Strongbox), rotating Hot Stock with discounts, lucky charms, a Sabacc table and a Kyber exchange.
- **Luck.** Every victory spins a credit multiplier (up to 5×, or 10× with Loaded Dice). Crates can drop Holo cards worth double, Chance Cubes boost Legendary odds, and a pity counter guarantees a Legendary every 20 crates.
- **Currencies.** Galactic Credits, Kyber Crystals and Aurodium Ingots (from bosses).
- **Auto battle and 1×/2×/3× speed.** Keys 1–4 pick abilities on your turn.

## Project layout

| Path | Purpose |
| --- | --- |
| `js/data.js` | Units, bosses, abilities, ultimates, bios, campaigns, crates, luck tables |
| `js/art.js` | SVG cover art for every unit, boss, crate and currency |
| `js/battle.js` | Battle engine (no DOM): turn meter, damage, statuses, AI |
| `js/state.js` | Save data, currencies, crates, luck, Black Market, auto-build, rewards |
| `js/ui.js` | Screens: home, campaign, bosses, squad select, collection, card inspector, Black Market |
| `js/battle-ui.js` | Battle screen, animations, ultimate cutscenes, hyperspace intro |
| `js/main.js` | Boot and ambient starfield |
| `css/styles.css` | All styling and animation |
| `tests/sim.test.js` | Headless engine and balance checks (`npm test`) |

## Adding content

Add a unit by appending an entry to `UNITS` in `js/data.js`, a bio to `BIOS`, and a drawing to `CHAR` (or a ship shape to `SHIPS`) in `js/art.js`. Give it a unique ultimate in `ULTIMATES`, or leave that out to get the default ultimate for its role. Campaign stages are plain lists of enemy ids and a level.
