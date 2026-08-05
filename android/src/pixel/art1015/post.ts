import { asset, compose } from "../themeArtKit";
import type { LateThemeArtPack } from "../themeArtKit";

// 1.0.15 우체국 테마 — 빨간 벽 아래 편지와 소포가 쌓인 아늑한 동네 우체국 창구.
// 팔레트 메모: 0(우체통 레드 벽) · N/Y(나무 카운터·크림 몰딩) · W/K(편지지) · B(항공우편 파랑) · C(끈·소인) · A(부리·전구·시계핀 3곳만)
export const POST_ART: LateThemeArtPack = {
  wallpaper: asset(
    "봉투와 우표 벽지",
    "Envelope and stamp wallpaper",
    compose(64, 31, "0", [
      // 크림 몰딩 — 천장 라인
      { x: 0, y: 0, rows: ["Y".repeat(64)] },
      // 파랑 우표 — 왼쪽 위 좁은 벽
      { x: 1, y: 2, rows: ["WWWW", "WBBW", "WBBW", "WWWW"] },
      // 흰 봉투 — 선반과 액자 사이 상단 벽
      { x: 39, y: 2, rows: ["WWWWW", "CWWWC", "WCWCW", "WWCWW"] },
      // 줄에 매달린 편지 두 통 — 창과 모니터 사이
      { x: 21, y: 4, rows: [".C.", ".C.", "WWW", "WKW", "WWW", ".C.", "WWW", "WKW", "WWW"] },
      // 소인 도장 자국 — 오른쪽 벽
      { x: 50, y: 13, rows: [".CC.", "C..C", "C..C", ".CC."] },
      // 나무 걸레받이 밴드 + 크림 카운터 라인(모니터·소포탑 뒤는 비움)
      { x: 0, y: 19, rows: Array.from({ length: 5 }, () => "N".repeat(64)) },
      { x: 0, y: 19, rows: ["Y".repeat(25)] },
      { x: 39, y: 19, rows: ["YYYYY"] },
      { x: 51, y: 19, rows: ["Y".repeat(13)] },
      // 걸레받이 세로 홈
      { x: 3, y: 20, rows: ["C", "C", "C", "C"] },
      { x: 10, y: 20, rows: ["C", "C", "C", "C"] },
      { x: 41, y: 20, rows: ["C", "C", "C", "C"] },
      { x: 52, y: 20, rows: ["C", "C", "C", "C"] },
      { x: 62, y: 20, rows: ["C", "C", "C", "C"] }
    ])
  ),
  flooring: asset(
    "우편실 마루",
    "Mailroom plank floor",
    compose(64, 9, "N", [
      { x: 0, y: 0, rows: ["O".repeat(64)] },
      { x: 0, y: 3, rows: ["C".repeat(64)] },
      { x: 0, y: 6, rows: ["C".repeat(64)] },
      { x: 22, y: 1, rows: ["C", "C"] },
      { x: 44, y: 4, rows: ["C", "C"] },
      { x: 8, y: 7, rows: ["C"] },
      { x: 52, y: 7, rows: ["C"] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  window: asset("우편차 골목 창", "Mail truck window", [
    "NNNNNNNNNNNNNNNN",
    "NKKKKKKKKKKKKKKN",
    "NKWWWKKKKKWWKKKN",
    "NKKKKKKKKKKKKKKN",
    "NKKKKKKKKKRRRKKN",
    "NGGGGGGGGGWWWGGN",
    "NGGGGGGGGGWCWGGN",
    "NGGBBBBBGGGGGGGN",
    "NYYBWWBBYYYYYYYN",
    "NYYYCYCYYYYYYYYN",
    "NNNNNNNNNNNNNNNN",
    "..NN........NN.."
  ]),
  desk: asset(
    "소포 접수대",
    "Parcel counter",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["H".repeat(54)] },
      { x: 0, y: 1, rows: ["Y".repeat(56), "N".repeat(56)] },
      { x: 3, y: 3, rows: ["C".repeat(50)] },
      { x: 4, y: 4, rows: ["NNN", "NCN", "NCN", "NNN"] },
      { x: 49, y: 4, rows: ["NNN", "NCN", "NCN", "NNN"] }
    ])
  ),
  monitor: asset("봉인 편지 화면", "Sealed letter screen", [
    ".CCCCCCCCCCCC.",
    "CKBBBBBBBBBKKC",
    "CKBBWWWWWBBKKC",
    "CKBWBWWWBWBKKC",
    "CKBWWBSBWWBKKC",
    "CKBWWWSWWWBKKC",
    "CKBBBBBBBBBKKC",
    ".CCCCCCCCCCCC.",
    "......CC......",
    "....CCCCCC...."
  ]),
  mug: asset("우표 스펀지 컵", "Stamp sponge cup", [
    ".TTT..",
    "TTTTT.",
    "EEEEE.",
    "EWWWEE",
    "EWWWE.",
    "EEEEE."
  ]),
  ornament: asset("소포 꾸러미 탑", "Tied parcel stack", [
    ".WWCWW.",
    ".WWCWW.",
    "YYYCYYY",
    "YYYCYYY",
    "CCCCCCC",
    "YYYCYYY",
    "YYYCYYY"
  ]),
  lamp: asset("우체통 스탠드", "Postbox lamp", [
    ".BBB.",
    "BBBBB",
    "BAAAB",
    "BBWBB",
    ".BBB.",
    "..CC.",
    "..CC.",
    "..CC.",
    "..CC.",
    "..CC.",
    ".CCC.",
    "CCCCC"
  ]),
  mat: asset("항공우편 매트", "Airmail stripe mat", ["BWSWBWSW", "WCCWWCCW", "WBWBWBWB"]),
  shelf: asset("편지 꽂이", "Letter rack", ["WW...", "WW.KK", "NNNNN", "NNNNN"]),
  frame: asset("기념 우표 액자", "Commemorative stamp frame", [
    "NNNNNN",
    "NKKKKN",
    "NKBBKN",
    "NKBBKN",
    "NBBBBN",
    "NKKKKN",
    "NNNNNN"
  ]),
  clock: asset("소인 도장 시계", "Postmark clock", [".BB.", "BWWB", "BCAB", ".BB."]),
  // 눈(C)은 y26(상판 위), y27 행은 L만 — 그림자 C와 분리. 파랑 모자·가방, 흰 편지 포인트.
  pet: asset("비둘기 집배원", "Pigeon courier", [
    ".BBBB.",
    ".LLLL.",
    ".LCLAA",
    ".LLLL.",
    ".LLLMM",
    "BWLLMM",
    "BBLLL.",
    ".A..A."
  ]),
  floorObject: asset("소포 수레", "Parcel cart", [
    ".WW...",
    "YYYY.C",
    "YYYY.C",
    "NNNNNN",
    "CC..CC",
    "CC..CC"
  ])
};
