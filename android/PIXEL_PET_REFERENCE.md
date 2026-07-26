# Pixel pet reference

## Open-source reference

- **Tiny Creatures — Clint Bellanger**
  https://opengameart.org/content/tiny-creatures
  License: CC0 1.0. The pack contains 180 static 16×16 sprites, including more
  than 50 animals. The author notes that the double outline limits most actual
  creature art to about 12×12 pixels.
- **Pixel Animals 16×16 — GrumpyDiamond**
  https://opengameart.org/content/pixel-animals-16x16
  License: CC0 1.0. Used as a second reference for livestock proportions.
- **Kenney Pixel Pack**
  https://kenney.nl/assets/pixel-pack
  License: CC0 1.0. Used to compare outline weight and low-resolution contrast.

No downloaded raster asset is shipped in the app. The production pets remain
symbolic TypeScript rows so that every pixel uses the room palette and adaptive
boundary separation. The CC0 sheets were used as visual references for:

1. putting one species landmark on the outer silhouette;
2. keeping the readable animal area compact instead of filling the whole slot;
3. using a wide head and a smaller body for pet-like proportions;
4. limiting facial detail to two eyes and one nose or beak;
5. reserving one contrasting patch for a muzzle, belly, wing, shell, or tail.

## Classic-cat freeze

`src/pixel/storeCatVariants.ts` was restored from the source content embedded
in the 2026-07-24 Android release sourcemap. These 26 theme cats and 15 breed
cats intentionally remain at the original 7×9 size and must not inherit later
9×11 pet-builder changes.
