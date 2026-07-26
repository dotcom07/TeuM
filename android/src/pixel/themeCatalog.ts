import type { Acquire, PixelItem } from "./catalog";
import type { ThemeArtItem, ThemeArtwork } from "./themeArtwork";
import { AQUARIUM_UNDERSEA_ARTWORK } from "./themes/aquariumUndersea.ts";
import { CAFE_BAKERY_ARTWORK } from "./themes/cafeBakery.ts";
import { CALICO_ARTWORK, EXTRA_CAT_ARTWORK } from "./themes/rivalCalico.ts";
import { CAMPING_GREENHOUSE_ARTWORK } from "./themes/campingGreenhouse.ts";
import { CHRISTMAS_SKY_ARTWORK } from "./themes/christmasSky.ts";
import { DREAM_ZOO_ARTWORK } from "./themes/dreamZoo.ts";
import { FANTASY_SCHOOL_ARTWORK } from "./themes/fantasySchool.ts";
import { HANOK_NIGHT_CITY_ARTWORK } from "./themes/hanokNightCity.ts";
import { MUSIC_ARCADE_ARTWORK } from "./themes/musicArcade.ts";
import { RAINY_LIBRARY_ARTWORK } from "./themes/rainyLibrary.ts";
import { SF_SPACE_ARTWORK } from "./themes/sfSpace.ts";
import { SPRING_WINTER_ARTWORK } from "./themes/springWinter.ts";
import {
  STORE_BREED_CAT_ARTWORK,
  STORE_THEME_CAT_ARTWORK
} from "./storeCatVariants.ts";

export interface DateWindow {
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

export interface ThemeRewardRule {
  key: string;
  labelKo: string;
  labelEn: string;
  unlockAt: number;
  limitedWindow: DateWindow;
}

export const ALL_THEME_ARTWORK: ThemeArtwork[] = [
  ...SPRING_WINTER_ARTWORK,
  ...CALICO_ARTWORK,
  ...AQUARIUM_UNDERSEA_ARTWORK,
  ...DREAM_ZOO_ARTWORK,
  ...SF_SPACE_ARTWORK,
  ...CHRISTMAS_SKY_ARTWORK,
  ...FANTASY_SCHOOL_ARTWORK,
  ...RAINY_LIBRARY_ARTWORK,
  ...CAFE_BAKERY_ARTWORK,
  ...CAMPING_GREENHOUSE_ARTWORK,
  ...MUSIC_ARCADE_ARTWORK,
  ...HANOK_NIGHT_CITY_ARTWORK
];

const RULE_INPUT: Record<string, { unlockAt: number; window: DateWindow }> = {
  spring: { unlockAt: 1, window: { startMonth: 3, startDay: 1, endMonth: 5, endDay: 31 } },
  rainy: { unlockAt: 90, window: { startMonth: 6, startDay: 1, endMonth: 7, endDay: 31 } },
  winter: { unlockAt: 15, window: { startMonth: 12, startDay: 1, endMonth: 2, endDay: 29 } },
  christmas: { unlockAt: 90, window: { startMonth: 12, startDay: 1, endMonth: 12, endDay: 25 } },
  sky: { unlockAt: 1, window: { startMonth: 4, startDay: 1, endMonth: 6, endDay: 30 } },
  space: { unlockAt: 35, window: { startMonth: 8, startDay: 1, endMonth: 8, endDay: 31 } },
  sf: { unlockAt: 35, window: { startMonth: 11, startDay: 1, endMonth: 11, endDay: 30 } },
  fantasy: { unlockAt: 35, window: { startMonth: 10, startDay: 1, endMonth: 10, endDay: 31 } },
  school: { unlockAt: 1, window: { startMonth: 3, startDay: 1, endMonth: 3, endDay: 31 } },
  library: { unlockAt: 60, window: { startMonth: 9, startDay: 1, endMonth: 9, endDay: 30 } },
  cafe: { unlockAt: 1, window: { startMonth: 1, startDay: 1, endMonth: 1, endDay: 31 } },
  bakery: { unlockAt: 60, window: { startMonth: 2, startDay: 1, endMonth: 2, endDay: 29 } },
  undersea: { unlockAt: 35, window: { startMonth: 7, startDay: 1, endMonth: 8, endDay: 31 } },
  camping: { unlockAt: 15, window: { startMonth: 5, startDay: 1, endMonth: 6, endDay: 30 } },
  greenhouse: { unlockAt: 15, window: { startMonth: 4, startDay: 1, endMonth: 5, endDay: 31 } },
  music: { unlockAt: 15, window: { startMonth: 6, startDay: 1, endMonth: 6, endDay: 30 } },
  arcade: { unlockAt: 60, window: { startMonth: 7, startDay: 1, endMonth: 7, endDay: 31 } },
  hanok: { unlockAt: 60, window: { startMonth: 1, startDay: 1, endMonth: 2, endDay: 29 } },
  "night-city": { unlockAt: 90, window: { startMonth: 11, startDay: 1, endMonth: 12, endDay: 31 } },
  dream: { unlockAt: 90, window: { startMonth: 12, startDay: 26, endMonth: 1, endDay: 15 } },
  calico: { unlockAt: 1, window: { startMonth: 8, startDay: 8, endMonth: 8, endDay: 31 } },
  aquarium: { unlockAt: 15, window: { startMonth: 7, startDay: 1, endMonth: 8, endDay: 31 } },
  zoo: { unlockAt: 60, window: { startMonth: 5, startDay: 1, endMonth: 5, endDay: 31 } }
};

export const THEME_REWARD_RULES: ThemeRewardRule[] = ALL_THEME_ARTWORK.map((theme) => {
  const rule = RULE_INPUT[theme.key];
  if (!rule) throw new Error(`Missing reward rule for ${theme.key}`);
  return {
    key: theme.key,
    labelKo: theme.labelKo,
    labelEn: theme.labelEn,
    unlockAt: rule.unlockAt,
    limitedWindow: rule.window
  };
});

function asPixelItem(
  art: ThemeArtItem,
  acquire: Acquire,
  themeKey: string,
  addedIn = "1.0.7"
): PixelItem {
  return {
    id: art.id,
    nameKo: art.nameKo,
    nameEn: art.nameEn,
    slots: art.slots,
    frames: { base: art.rows, active: art.rows },
    acquire,
    themeKey,
    addedIn
  };
}

export const NEW_THEME_ITEMS: PixelItem[] = ALL_THEME_ARTWORK.flatMap((theme) => {
  const rule = RULE_INPUT[theme.key];
  return theme.items.map((art) =>
    asPixelItem(
      art,
      {
        type: "reward",
        unlockAt: rule.unlockAt,
        limited: art.limited
      },
      theme.key
    )
  );
});

const EXTRA_CAT_UNLOCK_AT: Record<string, number> = {
  "cat-chubby": 8,
  "cat-cheese": 20,
  "cat-tabby": 35,
  "cat-black": 50,
  "cat-white": 70,
  "cat-calico-loaf": 90,
  "cat-siamese": 120,
  "cat-sleepy": 150,
  "cat-maine-coon": 180,
  "cat-scottish-fold": 210,
  "cat-russian-blue": 240,
  "cat-bengal": 270,
  "cat-persian": 300,
  "cat-munchkin": 330,
  "cat-ragdoll": 360,
  "cat-sphynx": 400
};

export const EXTRA_CAT_ITEMS: PixelItem[] = EXTRA_CAT_ARTWORK.map((art) =>
  asPixelItem(
    art,
    { type: "reward", unlockAt: EXTRA_CAT_UNLOCK_AT[art.id], limited: false },
    "extra-cats"
  )
);

function storeThemeUnlockAt(themeKey: string): number {
  if (themeKey === "rival") return 1;
  if (themeKey === "summer") return 12;
  if (themeKey === "autumn") return 36;
  const rule = RULE_INPUT[themeKey];
  if (!rule) throw new Error(`Missing classic cat unlock rule for ${themeKey}`);
  return rule.unlockAt;
}

export const STORE_THEME_CAT_ITEMS: PixelItem[] = STORE_THEME_CAT_ARTWORK.map((art) =>
  asPixelItem(
    art,
    {
      type: "reward",
      unlockAt: storeThemeUnlockAt(art.themeKey),
      limited: false
    },
    art.themeKey,
    "1.0.8"
  )
);

export const STORE_BREED_CAT_ITEMS: PixelItem[] = STORE_BREED_CAT_ARTWORK.map((art) =>
  asPixelItem(
    art,
    {
      type: "reward",
      unlockAt: EXTRA_CAT_UNLOCK_AT[art.baseBreedId],
      limited: false
    },
    "extra-cats",
    "1.0.8"
  )
);

const EGG_ART: Array<{
  id: string;
  nameKo: string;
  nameEn: string;
  slots: PixelItem["slots"];
  rows: string[];
}> = [
  {
    id: "egg-0707-alarm",
    nameKo: "07:07 자명종",
    nameEn: "07:07 alarm",
    slots: ["wall-clock"],
    rows: [".AA.", "AWCC", "AACC", ".CC."]
  },
  {
    id: "egg-1818-exit",
    nameKo: "18:18 퇴근 표지",
    nameEn: "18:18 exit sign",
    slots: ["wall-frame"],
    rows: ["CCCCCC", "CRRRRC", "CRWWRC", "CRRARC", "CRRRRC", "CWWWWC", "CCCCCC"]
  },
  {
    id: "egg-0909-1818-train",
    nameKo: "출퇴근 열차",
    nameEn: "Commuter train",
    slots: ["wall-shelf-a", "wall-shelf-b"],
    rows: ["CCCCC", "CWWWC", "CBABC", "CCCCC"]
  },
  {
    id: "egg-1111-ticket",
    nameKo: "11:11 행운표",
    nameEn: "11:11 lucky ticket",
    slots: ["desk-front"],
    rows: ["AAAAAAAA", "AWAWAWAA", "AAAAAAAA"]
  },
  {
    id: "egg-2222-moon",
    nameKo: "22:22 졸린 달",
    nameEn: "22:22 sleepy moon",
    slots: ["desk-lamp"],
    rows: [".WWW.", "WII..", "WIA..", ".WWW.", "..C..", "..C..", "..C..", "..C..", "..C..", "..C..", ".CCC.", "CCCCC"]
  },
  {
    id: "egg-seven-rainbow",
    nameKo: "일곱 빛 머그",
    nameEn: "Seven-color mug",
    slots: ["desk-left"],
    rows: [".Q.Q..", ".Q.QC.", "CQRAB.", "CGYBV.", "CWWWW.", ".CCCC."]
  },
  {
    id: "egg-snooze-snail",
    nameKo: "오분 달팽이",
    nameEn: "Five-minute snail",
    slots: ["floor-left"],
    rows: ["....G.", ".NN.GG", "NGGGG.", "NGWGG.", ".NNNNG", "GGGGGG", ".GGGG.", "......"]
  },
  {
    id: "egg-leap-frog",
    nameKo: "윤년 개구리",
    nameEn: "Leap-day frog",
    slots: ["floor-left"],
    rows: ["G....G", "GGGGGG", "GWGGWG", "GGAGGG", ".GGGG.", "GGGGGG", ".G..G.", "G....G"]
  }
];

export const EASTER_EGG_ITEMS: PixelItem[] = EGG_ART.map((egg) => ({
  ...egg,
  frames: { base: egg.rows, active: egg.rows },
  acquire: { type: "easterEgg", eggId: egg.id },
  themeKey: "easter-eggs",
  addedIn: "1.0.7"
}));

export const EXPANSION_ITEMS: PixelItem[] = [
  ...NEW_THEME_ITEMS,
  ...EXTRA_CAT_ITEMS,
  ...STORE_THEME_CAT_ITEMS,
  ...STORE_BREED_CAT_ITEMS,
  ...EASTER_EGG_ITEMS
];
