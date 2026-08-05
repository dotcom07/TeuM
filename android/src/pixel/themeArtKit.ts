/** 테마 아트 팩 공용 타입·헬퍼 — 팩 파일들이 순환 참조 없이 가져다 쓴다. */
export interface ThemeArtAsset {
  nameKo: string;
  nameEn: string;
  rows: string[];
}

export interface LateThemeArtPack {
  wallpaper: ThemeArtAsset;
  flooring: ThemeArtAsset;
  window: ThemeArtAsset;
  desk: ThemeArtAsset;
  monitor: ThemeArtAsset;
  mug: ThemeArtAsset;
  ornament: ThemeArtAsset;
  lamp: ThemeArtAsset;
  mat: ThemeArtAsset;
  shelf: ThemeArtAsset;
  frame: ThemeArtAsset;
  clock: ThemeArtAsset;
  pet: ThemeArtAsset;
  floorObject: ThemeArtAsset;
}

export const asset = (nameKo: string, nameEn: string, rows: string[]): ThemeArtAsset => ({
  nameKo,
  nameEn,
  rows
});

export const compose = (
  width: number,
  height: number,
  fill: string,
  layers: Array<{ x: number; y: number; rows: string[] }>
): string[] => {
  const pixels = Array.from({ length: height }, () => Array(width).fill(fill));
  for (const layer of layers) {
    layer.rows.forEach((row, offsetY) => {
      [...row].forEach((token, offsetX) => {
        if (token === ".") return;
        const x = layer.x + offsetX;
        const y = layer.y + offsetY;
        if (pixels[y]?.[x] != null) pixels[y][x] = token;
      });
    });
  }
  return pixels.map((row) => row.join(""));
};
