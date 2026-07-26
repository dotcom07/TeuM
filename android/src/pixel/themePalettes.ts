/**
 * 테마별 도트 팔레트.
 *
 * 원본 도트맵은 C/I/M… 토큰으로 형태만 정의하고, 실제 색은 themeKey로 결정한다.
 * 테마 없는 기본 아이템만 BASE_PIXEL_COLORS를 사용한다.
 */
export const BASE_PIXEL_COLORS: Record<string, string> = {
  C: "#21242e",
  I: "#3d4f97",
  M: "#60619c",
  P: "#8ba1d4",
  K: "#9fbee7",
  E: "#c0d5e6",
  H: "#d7e9ff",
  W: "#ffffff",
  A: "#ecab37",
  S: "#e2954f",
  T: "#206479",
  L: "#dedede",
  B: "#4c91a6",
  Y: "#e6c77a",
  O: "#c56d3f",
  R: "#8f4438",
  G: "#617b52",
  N: "#86624b",
  Q: "#e6a7bb",
  V: "#acace7"
};

export type ThemePaletteRole =
  | "ink"
  | "shadow"
  | "background"
  | "surface"
  | "primary"
  | "secondary"
  | "accent";

export interface ThemeBoundaryPalette {
  /** 아이템 자체의 가장 어두운 외곽선. */
  outline: string;
  /** 어두운 배경에서도 실루엣을 살리는 밝은 외곽광. */
  halo: string;
  /** 서로 닿은 아이템을 분리하는 고채도 경계색. */
  separator: string;
}

export interface ThemePalette {
  key: string;
  labelKo: string;
  concept: string;
  backgroundToken: string;
  colors: Record<ThemePaletteRole, string>;
  boundary: ThemeBoundaryPalette;
  tokenRoles: Record<string, ThemePaletteRole>;
}

/**
 * 아이템 내부색과 독립적으로 사용하는 26개 방 전용 경계 팔레트.
 * 같은 색을 두 테마가 공유하지 않아 아틀라스에서도 테마 경계를 바로 식별할 수 있다.
 */
export const THEME_BOUNDARY_PALETTES: Record<string, ThemeBoundaryPalette> = {
  spring: { outline: "#233B49", halo: "#FFF3F7", separator: "#B23B62" },
  winter: { outline: "#0B1735", halo: "#F5FDFF", separator: "#FFB84D" },
  rival: { outline: "#211F3D", halo: "#F5F1FF", separator: "#E0B529" },
  summer: { outline: "#063441", halo: "#FFF9E8", separator: "#E34931" },
  autumn: { outline: "#291914", halo: "#FFF0CF", separator: "#556D2F" },
  calico: { outline: "#29201B", halo: "#FFFDF6", separator: "#B94337" },
  aquarium: { outline: "#073E52", halo: "#F2FFFF", separator: "#E75C34" },
  undersea: { outline: "#020D1E", halo: "#B8FFFF", separator: "#FFE258" },
  dream: { outline: "#0D162D", halo: "#FFF4DE", separator: "#16C9D8" },
  zoo: { outline: "#2D2119", halo: "#FFF3C9", separator: "#8F2E22" },
  sf: { outline: "#020509", halo: "#D8FFFA", separator: "#E8FF42" },
  space: { outline: "#010411", halo: "#E5FAFF", separator: "#FFDC64" },
  christmas: { outline: "#12271A", halo: "#FFF8E9", separator: "#D92C43" },
  sky: { outline: "#1C577D", halo: "#FFFFFF", separator: "#FF9B48" },
  fantasy: { outline: "#071C1A", halo: "#FFF0C8", separator: "#D65C28" },
  school: { outline: "#17374F", halo: "#FFFFF2", separator: "#F3C43A" },
  rainy: { outline: "#0B303B", halo: "#E7FAFF", separator: "#F04C53" },
  library: { outline: "#291714", halo: "#FFF0C7", separator: "#71862F" },
  cafe: { outline: "#1B0C09", halo: "#FFF6E9", separator: "#C92D2B" },
  bakery: { outline: "#3A1B0E", halo: "#FFF9E5", separator: "#A83C70" },
  camping: { outline: "#111724", halo: "#FFF2C6", separator: "#35D9E6" },
  greenhouse: { outline: "#17392A", halo: "#F8FFE9", separator: "#D6532E" },
  music: { outline: "#0A0915", halo: "#F8F4FF", separator: "#FF3C98" },
  arcade: { outline: "#05070A", halo: "#E9FFFF", separator: "#FF5BBA" },
  hanok: { outline: "#211A13", halo: "#FFF7D8", separator: "#B52B24" },
  "night-city": { outline: "#030817", halo: "#E9F5FF", separator: "#FF3DAD" }
};

const DEFAULT_TOKEN_ROLES: Record<string, ThemePaletteRole> = {
  C: "ink",
  I: "shadow",
  M: "primary",
  P: "secondary",
  K: "surface",
  E: "surface",
  H: "surface",
  W: "surface",
  A: "accent",
  S: "accent",
  T: "primary",
  L: "surface",
  B: "primary",
  Y: "secondary",
  O: "accent",
  R: "shadow",
  G: "primary",
  N: "shadow",
  Q: "accent",
  V: "secondary"
};

function palette(
  key: string,
  labelKo: string,
  concept: string,
  backgroundToken: string,
  colors: Record<ThemePaletteRole, string>,
  roleOverrides: Partial<Record<string, ThemePaletteRole>> = {}
): ThemePalette {
  const definedOverrides = Object.fromEntries(
    Object.entries(roleOverrides).filter((entry): entry is [string, ThemePaletteRole] => entry[1] != null)
  );
  const tokenRoles = {
    ...DEFAULT_TOKEN_ROLES,
    [backgroundToken]: "background" as const,
    ...definedOverrides
  };

  // C가 배경인 테마도 잉크 역할을 잃지 않게 한다. R은 기본 그림자 토큰이라
  // 다른 I/N 그림자를 보존하면서 음악실·오락실의 외곽선을 다시 분리할 수 있다.
  if (!Object.values(tokenRoles).includes("ink")) {
    tokenRoles.R = "ink";
  }

  return {
    key,
    labelKo,
    concept,
    backgroundToken,
    colors,
    boundary: THEME_BOUNDARY_PALETTES[key] ?? {
      outline: "#241B18",
      halo: "#FFF9F0",
      separator: "#C0443E"
    },
    tokenRoles
  };
}

/** 신규·레거시를 합친 26개 방의 시그니처 팔레트. */
export const THEME_PALETTES: Record<string, ThemePalette> = {
  spring: palette(
    "spring",
    "봄",
    "맑은 하늘 아래 흩날리는 벚꽃과 새잎",
    "K",
    {
      ink: "#33495C",
      shadow: "#6B7F8E",
      background: "#B9DDF2",
      surface: "#F8E9EE",
      primary: "#F08FA8",
      secondary: "#6FA36B",
      accent: "#F4C55E"
    },
    { Q: "primary", G: "secondary", Y: "accent" }
  ),
  winter: palette(
    "winter",
    "겨울",
    "짙은 겨울밤, 유리처럼 맑은 눈과 작은 등불",
    "I",
    {
      ink: "#17264D",
      shadow: "#41638A",
      background: "#263C73",
      surface: "#E7F4F8",
      primary: "#77B8D8",
      secondary: "#BFD9EA",
      accent: "#F4C76A"
    },
    { E: "secondary", P: "primary" }
  ),
  rival: palette(
    "rival",
    "라이벌",
    "보랏빛 경계심과 금색 단서가 남은 수상한 방",
    "K",
    {
      ink: "#30304D",
      shadow: "#5B538A",
      background: "#A9B7DA",
      surface: "#D8DDF0",
      primary: "#7D7FA9",
      secondary: "#665B91",
      accent: "#D0A63C"
    },
    { M: "secondary", P: "primary", I: "shadow" }
  ),
  summer: palette(
    "summer",
    "여름",
    "청록 바닷바람, 깊은 물빛과 모래·산호색 피크닉",
    "K",
    {
      ink: "#103E4A",
      shadow: "#276B78",
      background: "#78D2C2",
      surface: "#FFF1CF",
      primary: "#087F9C",
      secondary: "#F2C46D",
      accent: "#F06449"
    },
    { B: "primary", Y: "secondary", O: "accent", N: "shadow" }
  ),
  autumn: palette(
    "autumn",
    "가을",
    "황금빛 오후, 벽돌 단풍과 자두색 열매·올리브 잎",
    "Y",
    {
      ink: "#34231F",
      shadow: "#65433B",
      background: "#D6B07A",
      surface: "#F6E2BC",
      primary: "#B45235",
      secondary: "#713A45",
      accent: "#71834A"
    },
    { O: "primary", R: "secondary", G: "accent", N: "shadow" }
  ),
  calico: palette(
    "calico",
    "삼색고양이",
    "아이보리 햇살과 생강색·회갈색 털무늬",
    "W",
    {
      ink: "#3B302A",
      shadow: "#6B5448",
      background: "#F5EBDD",
      surface: "#FFF7E8",
      primary: "#77736D",
      secondary: "#C96A32",
      accent: "#D85745"
    },
    { N: "shadow", O: "primary", G: "secondary", Y: "surface", Q: "accent" }
  ),
  aquarium: palette(
    "aquarium",
    "아쿠아리움",
    "빛이 통과하는 수조 유리와 산호의 선명한 점색",
    "K",
    {
      ink: "#18556B",
      shadow: "#277185",
      background: "#8ACAE6",
      surface: "#E6F7F6",
      primary: "#168AA8",
      secondary: "#4C8A79",
      accent: "#F07A49"
    },
    { B: "primary", T: "shadow", G: "secondary", O: "accent" }
  ),
  undersea: palette(
    "undersea",
    "해저",
    "빛이 거의 닿지 않는 심해와 생물 발광",
    "I",
    {
      ink: "#081B33",
      shadow: "#102B49",
      background: "#143858",
      surface: "#78C6C8",
      primary: "#1D7183",
      secondary: "#16705D",
      accent: "#FFD34E"
    },
    { C: "ink", T: "primary", N: "secondary", G: "secondary", A: "accent" }
  ),
  dream: palette(
    "dream",
    "꿈",
    "새벽 열차 침대에 번지는 복숭아빛과 민트빛 꿈",
    "I",
    {
      ink: "#16213B",
      shadow: "#243354",
      background: "#4D5964",
      surface: "#F5E6CE",
      primary: "#9BCFC3",
      secondary: "#F3A88B",
      accent: "#F5D27C"
    },
    { V: "secondary", P: "primary", W: "surface" }
  ),
  zoo: palette(
    "zoo",
    "동물원",
    "초록 대신 모래·황토·테라코타로 읽히는 사파리 안내소",
    "Y",
    {
      ink: "#44352B",
      shadow: "#6B4732",
      background: "#D8A64A",
      surface: "#F4E0A3",
      primary: "#C7832E",
      secondary: "#A84C35",
      accent: "#7A3A2D"
    },
    { G: "primary", N: "secondary", O: "primary", A: "accent" }
  ),
  sf: palette(
    "sf",
    "SF",
    "흑연 연구실 위 전기 청록·레이저 라임 경고 신호",
    "C",
    {
      ink: "#0B0F14",
      shadow: "#151B24",
      background: "#202832",
      surface: "#526273",
      primary: "#20D6C7",
      secondary: "#A7E34B",
      accent: "#FF5B7F"
    },
    { R: "ink", I: "shadow", T: "primary", V: "secondary", Q: "accent" }
  ),
  space: palette(
    "space",
    "우주",
    "보랏빛 대신 진공 남색·궤도 파랑·태양 금색의 천문대",
    "I",
    {
      ink: "#050A1C",
      shadow: "#0B1635",
      background: "#142B52",
      surface: "#BDEFFF",
      primary: "#245AA6",
      secondary: "#6B8FC4",
      accent: "#F4C95D"
    },
    { P: "primary", V: "secondary", E: "secondary", W: "surface" }
  ),
  christmas: palette(
    "christmas",
    "크리스마스",
    "전나무 그림자, 크랜베리 장식과 따뜻한 금빛",
    "G",
    {
      ink: "#203528",
      shadow: "#36543A",
      background: "#47664A",
      surface: "#F6EAD4",
      primary: "#547C55",
      secondary: "#B83D4B",
      accent: "#F1B93A"
    },
    { R: "secondary", N: "primary", A: "accent" }
  ),
  sky: palette(
    "sky",
    "하늘",
    "맑은 수평선과 흰 구름, 한 점의 노을 주황",
    "K",
    {
      ink: "#316A91",
      shadow: "#5E91B4",
      background: "#8DC9F4",
      surface: "#F3F8FA",
      primary: "#3E91D0",
      secondary: "#CFEAFA",
      accent: "#FFB56B"
    },
    { B: "primary", E: "secondary", A: "accent" }
  ),
  fantasy: palette(
    "fantasy",
    "판타지",
    "고대 온실 서재의 에메랄드·양피지·구리 연금술",
    "I",
    {
      ink: "#102A28",
      shadow: "#183F3A",
      background: "#24534B",
      surface: "#EFD7A2",
      primary: "#2B7668",
      secondary: "#A7C5A5",
      accent: "#C56F3B"
    },
    { V: "secondary", G: "primary", N: "shadow", A: "accent" }
  ),
  school: palette(
    "school",
    "학교",
    "초록 칠판 대신 슬레이트 블루 게시판과 노란 표식",
    "G",
    {
      ink: "#2A465F",
      shadow: "#3F6F98",
      background: "#7397B5",
      surface: "#F4F0DC",
      primary: "#4F82AA",
      secondary: "#C9DCE7",
      accent: "#E4B83F"
    },
    { K: "secondary", Y: "surface", N: "primary", A: "accent" }
  ),
  rainy: palette(
    "rainy",
    "장마",
    "먹구름 청록, 빗물 파랑과 우산의 붉은 점색",
    "T",
    {
      ink: "#17424F",
      shadow: "#26697A",
      background: "#327A88",
      surface: "#BDDDE4",
      primary: "#55A7C2",
      secondary: "#2F8493",
      accent: "#D75C58"
    },
    { B: "primary", I: "secondary", N: "shadow", V: "surface", R: "accent" }
  ),
  library: palette(
    "library",
    "도서관",
    "옥스블러드 가죽, 오래된 종이와 올리브 책갈피",
    "N",
    {
      ink: "#3E2925",
      shadow: "#6B3D34",
      background: "#7B493A",
      surface: "#EAD9B3",
      primary: "#9B5B42",
      secondary: "#D8B97D",
      accent: "#8A8C4A"
    },
    { R: "primary", Y: "secondary", G: "accent" }
  ),
  cafe: palette(
    "cafe",
    "카페",
    "초록 벽이 아닌 크림 타일·에스프레소·벽돌 로스터리",
    "G",
    {
      ink: "#2B1C19",
      shadow: "#B66A3C",
      background: "#E6C7A3",
      surface: "#F6E8D2",
      primary: "#4A2C24",
      secondary: "#9C3F35",
      accent: "#D89A5B"
    },
    { N: "primary", T: "shadow", Y: "surface", I: "secondary", R: "secondary" }
  ),
  bakery: palette(
    "bakery",
    "베이커리",
    "버터빛 작업실, 구운 껍질과 베리 잼",
    "Y",
    {
      ink: "#5B321F",
      shadow: "#7B4728",
      background: "#F4D34E",
      surface: "#FFF2D0",
      primary: "#C77A22",
      secondary: "#CC4F73",
      accent: "#6F963B"
    },
    { N: "primary", R: "secondary", A: "accent" }
  ),
  camping: palette(
    "camping",
    "캠핑",
    "해 질 녘 남청, 주황 텐트와 황금빛 모닥불",
    "I",
    {
      ink: "#242B3B",
      shadow: "#394A70",
      background: "#50628A",
      surface: "#DCCB9E",
      primary: "#6C7B45",
      secondary: "#E4833F",
      accent: "#F7BF4E"
    },
    { N: "secondary", G: "primary", Y: "surface", O: "secondary" }
  ),
  greenhouse: palette(
    "greenhouse",
    "온실",
    "유리 민트, 짙은 잎과 테라코타 화분",
    "K",
    {
      ink: "#315442",
      shadow: "#48705A",
      background: "#B6DFD3",
      surface: "#E6F2D8",
      primary: "#3F805A",
      secondary: "#6AA56A",
      accent: "#C96C42"
    },
    { G: "primary", T: "secondary", N: "accent", O: "accent" }
  ),
  music: palette(
    "music",
    "음악실",
    "공연장 암청, 코발트 장비와 핫핑크 파형",
    "C",
    {
      ink: "#171725",
      shadow: "#282844",
      background: "#343653",
      surface: "#C8C1E8",
      primary: "#4E5FA6",
      secondary: "#9E8FE8",
      accent: "#E75E9C"
    },
    { I: "primary", V: "secondary", Q: "accent" }
  ),
  arcade: palette(
    "arcade",
    "오락실",
    "차콜 캐비닛, 아쿠아 화면·버블검 버튼·코인 주황",
    "C",
    {
      ink: "#111216",
      shadow: "#22232B",
      background: "#2D3038",
      surface: "#B4E5E2",
      primary: "#45C1C7",
      secondary: "#F07BA8",
      accent: "#FFD84A"
    },
    { B: "primary", Q: "secondary", A: "accent" }
  ),
  hanok: palette(
    "hanok",
    "한옥",
    "쌀종이 빛, 단청 적색·청자색·놋쇠의 사랑방",
    "Y",
    {
      ink: "#2F2A22",
      shadow: "#5B4635",
      background: "#E7C986",
      surface: "#F5E6BA",
      primary: "#6F9480",
      secondary: "#A44232",
      accent: "#D29A31"
    },
    { N: "shadow", R: "secondary", G: "primary", A: "accent" }
  ),
  "night-city": palette(
    "night-city",
    "밤도시",
    "아스팔트 남색, 네온 청록·마젠타와 택시 호박색",
    "I",
    {
      ink: "#0B1228",
      shadow: "#172447",
      background: "#22345F",
      surface: "#7286B8",
      primary: "#159CB0",
      secondary: "#D954A4",
      accent: "#F0A72E"
    },
    { T: "primary", B: "primary", Q: "secondary", A: "accent" }
  )
};

/** 방 테마 수에는 포함하지 않는 고양이 품종 도감용 털색 팔레트. */
const EXTRA_CAT_PALETTE = palette(
  "extra-cats",
  "고양이 품종",
  "회청색·생강색·크림색 털을 품종별로 구분",
  "K",
  {
    ink: "#352C28",
    shadow: "#725D50",
    background: "#F5EBDD",
    surface: "#FFF8ED",
    primary: "#758A96",
    secondary: "#D57B31",
    accent: "#D98278"
  },
  { G: "primary", O: "secondary", I: "shadow", N: "shadow", Y: "surface" }
);

export function themePaletteFor(themeKey?: string): ThemePalette | undefined {
  if (!themeKey) return undefined;
  if (themeKey === "extra-cats") return EXTRA_CAT_PALETTE;
  return THEME_PALETTES[themeKey];
}

export function pixelColorsForTheme(themeKey?: string): Record<string, string> {
  const selected = themePaletteFor(themeKey);
  if (!selected) return BASE_PIXEL_COLORS;
  return Object.fromEntries(
    Object.entries(selected.tokenRoles).map(([token, role]) => [token, selected.colors[role]])
  );
}

export function pixelColor(token: string, themeKey?: string): string | undefined {
  return pixelColorsForTheme(themeKey)[token] ?? BASE_PIXEL_COLORS[token];
}
