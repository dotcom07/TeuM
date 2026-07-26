export const PET_SPRITE_WIDTH = 9;
export const PET_SPRITE_HEIGHT = 11;

/**
 * 펫 도트맵은 작은 화면에서도 종을 읽을 수 있도록 9×11로 고정한다.
 * 잘못된 한 줄이 조용히 잘리는 대신 개발 중 즉시 드러나게 한다.
 */
export function petSprite(...rows: string[]): string[] {
  if (rows.length !== PET_SPRITE_HEIGHT) {
    throw new Error(`Pet sprite must be ${PET_SPRITE_HEIGHT}px tall (received ${rows.length})`);
  }
  rows.forEach((row, index) => {
    if (row.length !== PET_SPRITE_WIDTH) {
      throw new Error(
        `Pet sprite row ${index} must be ${PET_SPRITE_WIDTH}px wide (received ${row.length})`
      );
    }
  });
  return rows;
}

export interface CatSpriteTokens {
  outline: string;
  body: string;
  patch: string;
  eye: string;
  nose: string;
  accent?: string;
}

export type CatSpritePose =
  | "classic"
  | "sit"
  | "loaf"
  | "curled"
  | "chubby"
  | "longhair"
  | "folded"
  | "low"
  | "sphynx"
  | "prowl";

/**
 * o outline · b body · p patch · e eye · n nose · a accent
 *
 * CC0 Tiny Creatures의 12px 안쪽 실루엣 원칙을 9×11 정면 펫에 맞게 다시
 * 해석했다. 얼굴은 몸보다 넓고, 표정은 눈 2px·코 1px만 남겨 읽기 쉽게 한다.
 */
const CAT_POSES: Record<CatSpritePose, readonly string[]> = {
  classic: [
    ".o.....o.",
    ".oopopoo.",
    "obbbbbbo.",
    "obebebbo.",
    "obbbnbbbo",
    ".obbbbbo.",
    "..obpbo..",
    ".obbbbboo",
    ".obabbboo",
    "..o.o.oo.",
    "........."
  ],
  sit: [
    "o.......o",
    "oo.....oo",
    ".obbbbbo.",
    "obebebbo.",
    "obbbnbbbo",
    ".obbbbbo.",
    "..obpbo.o",
    "..obbbboo",
    "..obbbboo",
    ".oob.bboo",
    ".oo...oo."
  ],
  loaf: [
    ".........",
    ".o.....o.",
    ".oopopoo.",
    "obbbbbbo.",
    "obebebbo.",
    "obbbnbbbo",
    ".obbbbbbo",
    "oobpabbbo",
    "obbbbbboo",
    ".ooooooo.",
    "........."
  ],
  curled: [
    ".........",
    "..o...o..",
    ".oopopoo.",
    "obbbbbbo.",
    "obebebbo.",
    "obbbnbbbo",
    ".obbbbboo",
    "..obbbboo",
    ".oobpbboo",
    "..oooooo.",
    "........."
  ],
  chubby: [
    ".o.....o.",
    ".oopopoo.",
    "obbbbbbo.",
    "obebebbo.",
    "obbbnbbbo",
    ".obbbbbo.",
    "obbbbbboo",
    "obpabbbbo",
    "obbbbbboo",
    "oo.b.b.oo",
    ".oo.o.oo."
  ],
  longhair: [
    "o.......o",
    "oo.....oo",
    "obbbbbbo.",
    "obebebboo",
    "obbbnbboo",
    "obbbbbboo",
    ".obbbbbbo",
    "oobbbbbbo",
    "obpabbboo",
    ".ob.b.boo",
    "..o.o.oo."
  ],
  folded: [
    ".oo...oo.",
    "oobbbbboo",
    "obbbbbbo.",
    "obebebbo.",
    "obbbnbbbo",
    ".obbbbbo.",
    "..obpbo.o",
    "..obbbboo",
    "..obbbboo",
    ".oob.bboo",
    ".oo...oo."
  ],
  low: [
    ".o...o...",
    ".oopooo..",
    "obebebboo",
    "obbbnbbbo",
    ".obbbbboo",
    "..obabbbo",
    "...oooooo",
    "...obbo..",
    "..oo..oo.",
    ".........",
    "........."
  ],
  sphynx: [
    "o.......o",
    "oo.....oo",
    ".obbbbbo.",
    ".obebebo.",
    "..obnbo..",
    "..obpbo..",
    "..obbbboo",
    "...obbbbo",
    "...o.b.o.",
    "..o..b..o",
    "...o...o."
  ],
  prowl: [
    "........o",
    ".o...o.oo",
    ".oopoo.ob",
    "obebebobb",
    "obbbnbbbb",
    ".obbbbbbo",
    "..opabbbo",
    "..ooboooo",
    "..o...o..",
    ".........",
    "........."
  ]
};

function mapCatPixel(pixel: string, tokens: Required<CatSpriteTokens>): string {
  switch (pixel) {
    case "o":
      return tokens.outline;
    case "b":
      return tokens.body;
    case "p":
      return tokens.patch;
    case "e":
      return tokens.eye;
    case "n":
      return tokens.nose;
    case "a":
      return tokens.accent;
    default:
      return pixel;
  }
}

export function catSprite(tokens: CatSpriteTokens, pose: CatSpritePose = "classic"): string[] {
  const completeTokens: Required<CatSpriteTokens> = {
    ...tokens,
    accent: tokens.accent ?? tokens.nose
  };
  return petSprite(
    ...CAT_POSES[pose].map((row) =>
      [...row].map((pixel) => mapCatPixel(pixel, completeTokens)).join("")
    )
  );
}
