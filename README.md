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
- **Abilities.** Each unit has a basic attack, one or two specials with cooldowns, and an **ultimate** that charges as the unit acts, deals damage and takes damage. Firing an ultimate plays a cutscene.
- **Status effects.** Stun, Taunt, Offense/Defense Up and Down, and Burn.
- **Two battle modes.** Ground battles use squads of 4 characters. Fleet battles use wings of 3 ships, which fire lasers instead of charging in.
- **Campaigns.** 10 ground stages and 7 fleet stages. Credits on every win, crystals on first clears.
- **Collection.** 21 characters and 10 ships across Common, Rare, Epic and Legendary rarities. Spend credits to level units (max 30) and shards to promote stars (max 7★).
- **Shop.** Character packs, ship packs, premium Holocron packs, a daily featured unit, and a crystal-to-credit exchange. Duplicate cards turn into shards.
- **Auto battle and 1×/2×/3× speed.** Keys 1–4 pick abilities on your turn.

## Project layout

| Path | Purpose |
| --- | --- |
| `js/data.js` | Units, abilities, ultimates, campaigns, packs and stat formulas |
| `js/battle.js` | Battle engine (no DOM): turn meter, damage, statuses, AI |
| `js/state.js` | Player save data, currencies, packs, upgrades, rewards |
| `js/ui.js` | Screens: home, campaign, squad select, collection, shop |
| `js/battle-ui.js` | Battle screen, animations, ultimate cutscenes, hyperspace intro |
| `js/main.js` | Boot and ambient starfield |
| `css/styles.css` | All styling and animation |
| `tests/sim.test.js` | Headless engine and balance checks (`npm test`) |

## Adding content

Add a unit by appending an entry to `UNITS` in `js/data.js`. Give it a unique ultimate in `ULTIMATES`, or leave that out to get the default ultimate for its role. Campaign stages are plain lists of enemy ids and a level.
