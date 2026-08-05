import { asset, compose } from "../themeArtKit";
import type { LateThemeArtPack } from "../themeArtKit";

// 1.0.15 미용실 테마 — 라일락 파스텔 살롱, 바버폴·금가위·후드 드라이어와 복슬 푸들.
// 팔레트: 3(라일락 마젠타 벽) · T(청록 카운터) · E/L(스틸·크롬) · W/K(구름털·타일) · A(금장 포인트 2곳).
export const SALON_ART: LateThemeArtPack = {
  wallpaper: asset(
    "라일락 살롱 벽지",
    "Lilac salon wallpaper",
    compose(64, 31, "3", [
      { x: 0, y: 0, rows: ["E".repeat(64)] },
      // 벽거울 — 선반과 액자 사이 상단 벽
      { x: 39, y: 1, rows: [".EEE.", "EWHHE", "EHHHE", "EHHHE", ".EEE."] },
      // 살롱 빗 — 왼쪽 위
      { x: 1, y: 2, rows: ["WWWW", "W.W.", "W.W.", "W.W."] },
      // 바버폴 — 좁은 벽
      { x: 21, y: 4, rows: ["EEE", "SWW", "WSW", "WWS", "BWW", "WBW", "WWB", "EEE"] },
      { x: 22, y: 13, rows: ["W.", ".H"] },
      // 고리에 걸린 가발 — 오른쪽 벽
      { x: 50, y: 12, rows: ["..C.", ".RRR", "RORR", "RROR", ".RR."] },
      // 웨인스코팅 밴드
      {
        x: 0,
        y: 19,
        rows: [
          "I".repeat(64),
          "PPPPPPPI".repeat(8),
          "PPPPPPPI".repeat(8),
          "PPPPPPPI".repeat(8),
          "PPPPPPPI".repeat(8)
        ]
      }
    ])
  ),
  flooring: asset(
    "파스텔 체크 타일",
    "Pastel checker tile",
    compose(64, 9, "K", [
      { x: 0, y: 0, rows: ["I".repeat(64)] },
      { x: 0, y: 1, rows: ["WW..".repeat(16), "WW..".repeat(16)] },
      { x: 0, y: 3, rows: ["..WW".repeat(16), "..WW".repeat(16)] },
      { x: 0, y: 5, rows: ["WW..".repeat(16), "WW..".repeat(16)] },
      { x: 0, y: 7, rows: ["..WW".repeat(16)] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  window: asset("마네킹 쇼윈도", "Mannequin show window", [
    "TTTTTTTTTTTTTTTT",
    "TKKKKKKKKKWEWWKT",
    "TKKKKKKKKKWEWWKT",
    "TKRRRRRRKKWEWWKT",
    "TKRLLRRRKKWEWWKT",
    "TKRLCLCLRKWEWWKT",
    "TKRSLLLSRKWEWWKT",
    "TKRLLLLRKKWEWWKT",
    "TKKKLLKKKKWEWWKT",
    "TKKEEEEKKKKWWKKT",
    "TTTTTTTTTTTTTTTT",
    "..TT........TT.."
  ]),
  desk: asset(
    "청록 스타일링 카운터",
    "Teal styling counter",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["H".repeat(54)] },
      { x: 0, y: 1, rows: ["T".repeat(56), "T".repeat(56)] },
      { x: 3, y: 3, rows: ["C".repeat(50)] },
      { x: 4, y: 4, rows: ["EEE", "ECE", "ECE", "EEE"] },
      { x: 49, y: 4, rows: ["EEE", "ECE", "ECE", "EEE"] }
    ])
  ),
  monitor: asset("헤어 카탈로그 화면", "Hair catalog screen", [
    ".CCCCCCCCCCCC.",
    "CWWWWWWWWWWWWC",
    "CWWRRRRWWKKWWC",
    "CWRRRRRLWWWWWC",
    "CWRRRLLLWKKWWC",
    "CWRRRRLLWWWWWC",
    "CWWWWWWWWTTWWC",
    ".CCCCCCCCCCCC.",
    "......CC......",
    "....CCCCCC...."
  ]),
  mug: asset("샴푸 펌프병", "Shampoo pump bottle", [
    "CCC...",
    "..C...",
    ".TTTT.",
    ".TWWT.",
    ".TWWT.",
    ".TTTT."
  ]),
  ornament: asset("파랑 헤어드라이어", "Blue hair dryer", [
    ".BBBBB.",
    "EEBBBBB",
    ".BBBBB.",
    "..CS...",
    "..CC...",
    "..CC..."
  ]),
  lamp: asset("후드 드라이어 스탠드", "Hood dryer stand", [
    ".EEE.",
    "EHHEE",
    "EHEEE",
    "EEEEE",
    ".CCE.",
    "..C..",
    "..C..",
    ".CAC.",
    "..C..",
    "..C..",
    ".CCC.",
    "CCCCC"
  ]),
  mat: asset("포갠 수건 매트", "Folded towel mat", ["KKKKKKKK", "WWWWWWWW", "KKKKKKKK"]),
  shelf: asset("염색약 세 병", "Three dye bottles", ["C.C.C", "S.B.G", "S.B.G", "NNNNN"]),
  frame: asset("단발 스타일 포스터", "Bob style poster", [
    "CCCCCC",
    "CWWWWC",
    "CWRRWC",
    "CWRRRC",
    "CWWRWC",
    "CYYYYC",
    "CCCCCC"
  ]),
  clock: asset("손거울 시계", "Hand-mirror clock", [".AA.", "AWCA", ".AA.", "..A."]),
  // 눈 행은 y26(카운터 상판 T 위), 코 행 y27은 R이라 그림자 C와 겹치지 않는다.
  pet: asset("복슬 푸들", "Fluffy poodle", [
    ".WWWW.",
    "WWWWWW",
    "WCWWCW",
    "WWRRWW",
    ".WWKW.",
    ".WWWWW",
    ".WKWW.",
    ".K.K.."
  ]),
  floorObject: asset("롤빗 트롤리", "Roll-brush trolley", [
    ".C.S..",
    "EEEEEE",
    "IIIIII",
    "IKWKWI",
    "IIIIII",
    "IWSWSI",
    "IIIIII",
    ".C..C."
  ])
};
