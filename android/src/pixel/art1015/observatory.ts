import { asset, compose } from "../themeArtKit";
import type { LateThemeArtPack } from "../themeArtKit";

// 1.0.15 천문대 테마 — 산꼭대기 관측소의 조용한 별밤. 성도와 돔 슬릿, 야간시력을 지키는 붉은 관측등.
// 팔레트: 1(심야 남색 벽) · M/I(몰딩·밴드·은하수) · L/E(돔 스틸) · C(화면·너구리 마스크) · S(관측등) · K/W(별빛) · A(포인트 3곳: 머그 별·토성·달 시계).
export const OBSERVATORY_ART: LateThemeArtPack = {
  wallpaper: asset(
    "은하수 별자리 벽지",
    "Milky-way constellation wallpaper",
    compose(64, 31, "1", [
      { x: 0, y: 0, rows: ["M".repeat(64)] },
      // 북두칠성 — 선반과 액자 사이 상단 벽 (W 별 + P 연결선)
      { x: 39, y: 1, rows: ["..W.W", "..P.P", "..WPW", ".P...", "W...."] },
      // 별똥별 — 왼쪽 위
      { x: 1, y: 2, rows: ["E...", ".E..", "..WW"] },
      // 은하수 세로 띠 — 창과 모니터 사이 좁은 벽
      {
        x: 21,
        y: 4,
        rows: ["..MM", ".MMM", ".MWM", ".MM.", "MMM.", "MKM.", "MM..", "MMM.", ".MM.", ".MMM", "..MM", "..MK"]
      },
      // 플레이아데스 성단 — 아래 망원경이 겨냥하는 곳
      { x: 50, y: 13, rows: [".KW.", "W..K", "..W."] },
      // 흩뿌린 별
      { x: 11, y: 1, rows: ["K"] },
      { x: 18, y: 2, rows: ["W"] },
      { x: 25, y: 2, rows: ["K"] },
      { x: 33, y: 1, rows: ["W"] },
      { x: 36, y: 3, rows: ["K"] },
      { x: 52, y: 2, rows: ["W"] },
      { x: 61, y: 3, rows: ["K"] },
      { x: 61, y: 10, rows: ["W"] },
      { x: 2, y: 9, rows: ["W"] },
      { x: 0, y: 14, rows: ["K"] },
      { x: 8, y: 16, rows: ["K"] },
      { x: 19, y: 16, rows: ["W"] },
      // 관측실 하단 패널 밴드
      { x: 0, y: 19, rows: ["M".repeat(64), "I".repeat(64), "I".repeat(64), "I".repeat(64), "M".repeat(64)] },
      // 패널 이음선 — 아이템이 덮지 않는 열에만
      { x: 2, y: 20, rows: ["C", "C", "C"] },
      { x: 10, y: 20, rows: ["C", "C", "C"] },
      { x: 22, y: 20, rows: ["C", "C", "C"] },
      { x: 41, y: 20, rows: ["C", "C", "C"] },
      { x: 52, y: 20, rows: ["C", "C", "C"] },
      { x: 61, y: 20, rows: ["C", "C", "C"] }
    ])
  ),
  flooring: asset(
    "강철 관측 데크",
    "Steel observing deck",
    compose(64, 9, "T", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      { x: 0, y: 3, rows: ["C".repeat(64)] },
      { x: 0, y: 6, rows: ["C".repeat(64)] },
      { x: 20, y: 1, rows: ["C", "C"] },
      { x: 44, y: 4, rows: ["C", "C"] },
      { x: 26, y: 2, rows: ["M"] },
      { x: 48, y: 5, rows: ["M"] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  window: asset("돔 슬릿 창", "Dome slit window", [
    "LLLLLLLLLLLLLLLL",
    "LEEME111111EMEEL",
    "LEEME1W1111EMEEL",
    "LEEME1111K1EMEEL",
    "LEEME111111EMEEL",
    "LEEME11W111EMEEL",
    "LEEME111111EMEEL",
    "LEEME111W11EMEEL",
    "LEEME1K1111EMEEL",
    "LEEME111111EMEEL",
    "LLLLLLLLLLLLLLLL",
    "..LL........LL.."
  ]),
  desk: asset(
    "관제 콘솔 책상",
    "Control console desk",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["H".repeat(54)] },
      { x: 0, y: 1, rows: ["E".repeat(56), "E".repeat(56)] },
      { x: 3, y: 3, rows: ["C".repeat(50)] },
      { x: 4, y: 4, rows: ["EEE", "ECE", "ECE", "EEE"] },
      { x: 49, y: 4, rows: ["EEE", "ECE", "ECE", "EEE"] }
    ])
  ),
  monitor: asset("성도 화면", "Star chart screen", [
    ".LLLLLLLLLLLL.",
    "LCWCCCCCKCCCCL",
    "LCCPCCCCCCCCCL",
    "LCCCWPWCCCCCCL",
    "LCCCCCCCCTCTCL",
    "LCCCCCCCCCWCCL",
    "LCCCCCCCCTCTCL",
    ".LLLLLLLLLLLL.",
    "......LL......",
    "....LLLLLL...."
  ]),
  mug: asset("별 코코아 머그", "Star cocoa mug", [
    "...H..",
    ".WWWW.",
    ".WAWWE",
    ".WWWWE",
    ".WWWW.",
    ".TTTT."
  ]),
  ornament: asset("미니 굴절 망원경", "Mini refractor telescope", [
    "....LLK",
    "...LLL.",
    "..LLL..",
    "..EE...",
    "..NN...",
    ".N..N..",
    ".N..N..",
    "N....N."
  ]),
  lamp: asset("붉은 관측등", "Red observing lantern", [
    "..L..",
    ".SSS.",
    ".SWS.",
    ".SSS.",
    "..E..",
    "..E..",
    "..E..",
    "..E..",
    "..E..",
    "..E..",
    ".EEE.",
    "EEEEE"
  ]),
  mat: asset("별지도 매트", "Star map mat", ["IIIIIIII", "IWIPPWII", "IIIIIIII"]),
  shelf: asset("행성 모형 트리오", "Planet model trio", ["B.A.K", "NNNNN", ".N.N."]),
  frame: asset("성운 사진 액자", "Nebula photo frame", [
    "LLLLLL",
    "LCCCWL",
    "LCCPML",
    "LCPKML",
    "LPMCCL",
    "LWCCCL",
    "LLLLLL"
  ]),
  clock: asset("달 위상 시계", "Moon phase clock", [".LL.", "LCAL", "LCAL", ".LL."]),
  // 눈 행은 y26(C 마스크 안 W 눈), y27(책상 그림자 행)에는 C를 두지 않는다. 발 행은 E/L이라 바닥 C와 분리된다.
  pet: asset("너구리 관측대원", "Raccoon observer", [
    ".L..L.",
    "LLLLLL",
    "CWCCWC",
    "EWWWWE",
    ".SSSS.",
    ".EEEEL",
    ".EEEEC",
    ".E.E.L"
  ]),
  floorObject: asset("운석 보관함", "Meteorite display case", [
    ".KKK.",
    "KKKKK",
    "KRROK",
    "KRRRK",
    "NSNNN",
    "NNNNN"
  ])
};
