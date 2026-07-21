// DESIGN-nintendo-2001.md 토큰. 색은 여기서만 정의한다.
export const colors = {
  red: "#e60012",
  signal: "#e2954f",
  amber: "#ecab37",
  navGold: "#e48600",
  canvas: "#7a8aba",
  canvasSoft: "#9fbee7",
  lavender: "#acace7",
  ice: "#c0d5e6",
  periwinkle: "#8ba1d4",
  chromeIndigo: "#3d4f97",
  mutedIndigo: "#60619c",
  platinum: "#dedede",
  surface: "#ffffff",
  carbon: "#21242e",
  hairline: "#5a5f8c",
  systemsTeal: "#206479",
  signalDeep: "#a5672f",
  highlight: "#d7e9ff",
  amberHighlight: "#fff0b2",
  shadowDeep: "#11131a"
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
} as const;

// 베젤 플레이트: 위·왼쪽은 밝게, 오른쪽·아래는 어둡게.
export const plate = (background: string) => ({
  backgroundColor: background,
  borderWidth: 3,
  borderTopColor: colors.highlight,
  borderLeftColor: colors.highlight,
  borderRightColor: colors.chromeIndigo,
  borderBottomColor: colors.chromeIndigo,
  elevation: 3
});

export const MIN_TOUCH = 48;
