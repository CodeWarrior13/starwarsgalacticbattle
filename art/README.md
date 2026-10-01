# Custom card art

Drop images in this folder named after a unit's id, then run `npm run art`.
Matching images replace the drawn cover art on cards, in battle and in the
Collection; units without an image keep their drawn art.

- Formats: `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg`
- Square images work best (they are cropped to fill the card)
- Example: `luke.png`, `slave_one.jpg`, `grand_inquisitor.webp`

`npm run build` embeds the images into the single-file build.

Unit ids are listed in `js/data.js` (`UNITS`), or run:

```
node -e "global.window=global;require('./js/data.js');console.log(GameData.UNITS.map(u=>u.id).join('\n'))"
```

Images you download are still owned by their creators. Keep a build that
uses them for your own private play, and don't publish or share it.
