import { asset, compose } from "./themeArtKit";
import { POST_ART } from "./art1015/post";
import { OBSERVATORY_ART } from "./art1015/observatory";
import { MINE_ART } from "./art1015/mine";
import { SALON_ART } from "./art1015/salon";
import { CONVENIENCE_ART } from "./art1015/convenience";

export type { LateThemeArtPack, ThemeArtAsset } from "./themeArtKit";
import type { LateThemeArtPack } from "./themeArtKit";

const CHRISTMAS_ART: LateThemeArtPack = {
  wallpaper: asset(
    "눈 내리는 선물마을 벽지",
    "Snowy gift-village wallpaper",
    compose(64, 31, "G", [
      { x: 0, y: 0, rows: ["R".repeat(64)] },
      { x: 0, y: 25, rows: Array.from({ length: 6 }, () => "W".repeat(64)) },
      { x: 6, y: 5, rows: ["..W....W..", "W....W....", "....W...W."] },
      { x: 39, y: 3, rows: ["....A....", "...AAA...", "..AAAAA..", ".AAAAAAA.", "....N...."] },
      { x: 43, y: 9, rows: ["....G....", "...GGG...", "..GAGGG..", ".GGGGGGG.", "GGGRGGGGG", "....N....", "....N...."] },
      { x: 7, y: 17, rows: ["...RRRR...", "..RWWWWR..", ".RRRRRRRR.", ".RRAARRRR.", "CCCCCCCCCC"] },
      { x: 26, y: 20, rows: ["WW..WW", ".WWWW.", "..WW.."] }
    ])
  ),
  flooring: asset(
    "리본 러너 나무바닥",
    "Ribbon-runner wood floor",
    compose(64, 9, "N", [
      { x: 0, y: 0, rows: ["S".repeat(64)] },
      { x: 18, y: 1, rows: Array.from({ length: 7 }, () => "R".repeat(28)) },
      { x: 30, y: 1, rows: ["WWWW", "AAAA", "WWWW", "AAAA", "WWWW", "AAAA", "WWWW"] },
      { x: 0, y: 8, rows: ["A".repeat(64)] }
    ])
  ),
  window: asset("눈꽃 아치창", "Snowflake arch window", [
    ".....NNNNNN.....",
    "...NNIIIIIINN...",
    "..NIIIIIIIIIIN..",
    ".NIIIWIWIWIIIIN.",
    "NIIIIIWWWIIIIIIN",
    "NIIIIWWIWWIIIIIN",
    "NIIIIIWWWIIIIIIN",
    "NIIIWIWIWIIIWIIN",
    ".NIIWWWWWWWIIIN.",
    "..NNWWWWWWWWNN..",
    "....NNNNNNNN....",
    "......NNNN......"
  ]),
  desk: asset(
    "선물 포장대 책상",
    "Gift-wrapping desk",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["R".repeat(54)] },
      { x: 0, y: 1, rows: ["C".repeat(56)] },
      { x: 2, y: 2, rows: ["H".repeat(52)] },
      { x: 25, y: 2, rows: ["AAAAAA"] },
      { x: 4, y: 3, rows: ["CNC", "CNC", "CNC", "CNC", "CNC"] },
      { x: 49, y: 3, rows: ["CNC", "CNC", "CNC", "CNC", "CNC"] }
    ])
  ),
  monitor: asset("북극 우편 분류기", "North-pole mail sorter", [
    "..IIIIIIIIII..",
    ".IRRRRRRRRRI..",
    "IRRWWRRWWRRRI.",
    "IRRRRAARRRRRI.",
    "IRRWWRRWWRRRI.",
    ".IRRRRRRRRRI..",
    "...INNNNI.....",
    "..INNNNNNI....",
    ".IIIIIIIIIIII.",
    ".............."
  ]),
  // 지팡이는 오른쪽 기둥 — 뒤 벽지의 사탕집(R)과 겹치지 않는 열이다.
  mug: asset("사탕지팡이 코코아", "Candy-cane cocoa", ["....RW", "....WR", ".WWWW.", ".WGWW.", ".WWWW.", ".IIII."]),
  ornament: asset("탁상 꼬마 트리", "Tiny desk tree", ["...A...", "..GGG..", ".GGRGG.", "GGGGGGG", "..GNG..", "...N...", ".IIIII.", "..III.."]),
  lamp: asset("별 꼭대기 트리등", "Tree-top star lamp", ["..A..", ".AAA.", "AAGAA", ".GGG.", "GGGGG", "..N..", "..N..", "..N..", "..N..", ".INI.", "INNNI", "IIIII"]),
  mat: asset("포장지 리본 매트", "Wrapping-ribbon mat", ["RRRAARRR", "IWWAAWWI", "IIIIIIII"]),
  shelf: asset("양말 속 선물", "Stocking gift", [".IR..", "IRRR.", "IRWR.", ".III."]),
  frame: asset("루돌프 우편 포스터", "Rudolph mail poster", ["IIIIII", "IRRRRI", "IRNNRI", "INWNNI", "INARNI", "IRRRRI", "IIIIII"]),
  clock: asset("방울 리스 시계", "Bell-wreath clock", [".GG.", "GWWG", "GAAG", ".II."]),
  pet: asset("루돌프 강아지", "Rudolph puppy", ["A.AA.A", "AA..AA", ".INNI.", "INWNWI", "INRNNI", "INNNNI", ".INNI.", ".I..I."]),
  floorObject: asset("큰 리본 선물상자", "Big ribbon present", ["..AA..", "IIAAII", "IRRRRI", "IRARRI", "IAAAAI", "IRARRI", "IRRRRI", "IIIIII"])
};

const SKY_ART: LateThemeArtPack = {
  wallpaper: asset(
    "높은 구름섬 벽지",
    "High cloud-island wallpaper",
    compose(64, 31, "E", [
      { x: 0, y: 0, rows: ["B".repeat(64)] },
      { x: 48, y: 3, rows: ["..AAA..", ".AAAAA.", "AAAAAAA", ".AAAAA.", "..AAA.."] },
      { x: 4, y: 8, rows: ["..WWWW.....", "WWWWWWWWW..", ".WWWWWWWWWW", "....WWWW..."] },
      { x: 26, y: 17, rows: ["....WWWWW....", ".WWWWWWWWWWW.", "WWWWWWWWWWWWW", "....GGGGG....", ".....NNN....."] },
      { x: 52, y: 21, rows: [".WWWW.", "WWWWWW", ".WWWW."] },
      { x: 12, y: 20, rows: ["B", "..B", "....B"] }
    ])
  ),
  flooring: asset(
    "하늘빛 유리 발판",
    "Sky-glass platform",
    compose(64, 9, "W", [
      { x: 0, y: 0, rows: ["B".repeat(64)] },
      { x: 0, y: 3, rows: ["E".repeat(64)] },
      { x: 8, y: 1, rows: ["BBBBBBBBBB"] },
      { x: 34, y: 4, rows: ["BBBBBBBBBBBBBBBB"] },
      { x: 52, y: 6, rows: ["BBBBBBBB"] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  window: asset("열린 비행선 창", "Open airship window", [
    "....MMMMMMMM....",
    "..MMBBBBBBBBMM..",
    ".MBBBBBBBBBBBBM.",
    "MBBBBWWWWBBBBBBM",
    "MBBBWWWWWWBBBBBM",
    "MBBBBWWWWBBBBBBM",
    "MBBBBBBBBBAABBBM",
    "MBBBBBBBBABBBABM",
    ".MBBBBBBBBBBBBM.",
    "..MMBBBBBBBBMM..",
    "....MMMMMMMM....",
    "......YYYY......"
  ]),
  desk: asset(
    "비행선 날개 책상",
    "Airship-wing desk",
    compose(56, 8, ".", [
      { x: 5, y: 0, rows: ["W".repeat(46)] },
      { x: 1, y: 1, rows: ["B".repeat(54)] },
      { x: 0, y: 2, rows: ["C".repeat(56)] },
      { x: 4, y: 3, rows: ["CYC", "CYC", "CYC", "CYC", "CYC"] },
      { x: 49, y: 3, rows: ["CYC", "CYC", "CYC", "CYC", "CYC"] }
    ])
  ),
  monitor: asset("기류 항로 태블릿", "Air-current route tablet", [
    ".MMMMMMMMMMMM.",
    "MBBBBBBBBBBBBM",
    "MBBWWBBBBWWBBM",
    "MBBBBWWWWBBBBM",
    "MBBBAAAAABBBBM",
    "MBBBBBBBBBBBBM",
    "MBBBBBBBBBBBBM",
    ".MMMMMMMMMMMM.",
    ".....MYM......",
    "...MMMMMMMM..."
  ]),
  mug: asset("구름 거품잔", "Cloud-foam cup", ["..WW..", ".WWWW.", "MBBBBM", "MBWWMM", "MBBBBM", ".MMMM."]),
  ornament: asset("종이비행기 모빌", "Paper-plane mobile", ["..MMMMM", "..Y...M", ".WWWW.M", "..WWW.M", "...W..M", "......M", "......M", "....MMM"]),
  lamp: asset("햇살 기상등", "Sunbeam weather lamp", ["..A..", ".AAA.", "AAWAA", ".AAA.", "..Y..", "..Y..", "..Y..", "..Y..", "..Y..", ".MYM.", "MYYYM", "MMMMM"]),
  mat: asset("상승기류 매트", "Updraft mat", ["BWBBWBBW", "WBBWWBBW", "MMMMMMMM"]),
  shelf: asset("미니 열기구", "Mini hot-air balloon", [".AAA.", "AWWWA", ".AYA.", "..Y.."]),
  frame: asset("구름 고도 지도", "Cloud-altitude map", ["MMMMMM", "MBBBBM", "MBWWBM", "MWWWWM", "MBBABM", "MBBBBM", "MMMMMM"]),
  clock: asset("태양 고도 시계", "Sun-altitude clock", [".AA.", "AWWA", "ABAA", ".MM."]),
  pet: asset("파랑새", "Bluebird", ["..MM..", ".MBBM.", "MWBBWM", "MBAABM", "MMBBMM", ".MBBM.", "..MM..", ".M..M."]),
  floorObject: asset("여행용 구름가방", "Cloud travel bag", ["..MM..", ".M..M.", "MWWWWM", "MWBBWM", "MWAAWM", "MWWWWM", "MMMMMM", ".YYYY."])
};

const FANTASY_ART: LateThemeArtPack = {
  wallpaper: asset(
    "에메랄드 마법숲 벽지",
    "Emerald magic-forest wallpaper",
    compose(64, 31, "T", [
      { x: 0, y: 0, rows: ["G".repeat(64)] },
      { x: 0, y: 26, rows: Array.from({ length: 5 }, () => "N".repeat(64)) },
      { x: 5, y: 6, rows: ["....Y....", "...YYY...", "..YAYYY..", ".YYYYYYY.", "YYYYYYYYY", "....N....", "....N...."] },
      { x: 40, y: 3, rows: ["...AAA...", ".AAAWAAA.", "AAWWWWWAA", ".AAAWAAA.", "...AAA..."] },
      { x: 24, y: 15, rows: ["..W..", ".WWW.", "WWAWW", ".WWW.", "..W.."] },
      { x: 50, y: 18, rows: ["G..G..G", ".GGGGG.", "..GGG..", "...N..."] },
      { x: 12, y: 20, rows: ["A", "...A", ".....A"] }
    ])
  ),
  flooring: asset(
    "룬석 원형 바닥",
    "Runestone-circle floor",
    compose(64, 9, "Y", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      { x: 18, y: 1, rows: ["....AAAAAAAAAAAA....", "..AAYYYYYYYYYYAA..", "AAYYYYYYYYYYYYYYAA", "..AAYYYYYYYYYYAA..", "....AAAAAAAAAAAA...."] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  window: asset("달빛 마법문", "Moonlit magic portal", [
    ".....MMMMMM.....",
    "...MMYYYYYYMM...",
    "..MYYTTTTTTYYM..",
    ".MYTTTTTTTTTTYM.",
    "MYTTTAAAAAATTTYM",
    "MYTTAAWWWAAATTYM",
    "MYTTTAAAAAATTTYM",
    ".MYTTTTTTTTTTYM.",
    "..MYYTTTTTTYYM..",
    "...MMYYYYYYMM...",
    ".....MMMMMM.....",
    "......NNNN......"
  ]),
  desk: asset(
    "연금술 곡선 책상",
    "Alchemy curved desk",
    compose(56, 8, ".", [
      { x: 3, y: 0, rows: ["Y".repeat(50)] },
      { x: 1, y: 1, rows: ["N".repeat(54)] },
      { x: 5, y: 2, rows: ["A".repeat(46)] },
      { x: 10, y: 3, rows: ["Y..W..Y..W..Y..W..Y..W..Y"] },
      { x: 6, y: 4, rows: ["MGM", "MGM", "MGM", "MGM"] },
      { x: 47, y: 4, rows: ["MGM", "MGM", "MGM", "MGM"] }
    ])
  ),
  monitor: asset("마법진 화면", "Magic-circle screen", [
    ".MMMMMMMMMMMM.",
    "MCCCCCCCCCCCCM",
    "MCCCAAAACCCWCM",
    "MCCACWCCACCCCM",
    "MCCACCCCACCCCM",
    "MCCCAAAACCCCCM",
    "MCCCCCCCCCCCCM",
    ".MMMMMMMMMMMM.",
    ".....MNM......",
    "...MMMMMMMM..."
  ]),
  mug: asset("마나 물약잔", "Mana potion cup", ["..MMM.", ".MTTM.", "MTWWTM", "MTAATM", "MTTTTM", ".MMMM."]),
  ornament: asset("수정구 받침", "Crystal orb stand", ["..WWW..", ".WTTTW.", "WTAAATW", ".WTTTW.", "..MMM..", "..MNM..", ".MNNNM.", "MMMMMMM"]),
  lamp: asset("반딧불 지팡이등", "Firefly wand lamp", ["..A..", ".AWA.", "..A..", "..Y..", ".YMY.", "..Y..", "..Y..", "..Y..", "..Y..", ".MNM.", "MNNNM", "MMMMM"]),
  mat: asset("고대 룬 매트", "Ancient rune mat", ["MYMMYMMY", "MATTATTM", "MMMMMMMM"]),
  shelf: asset("미니 마법솥", "Mini cauldron", ["M...M", "MTTTM", ".MTM.", "..M.."]),
  frame: asset("용의 계곡 지도", "Dragon-valley map", ["MMMMMM", "MYYYYM", "MYGGYM", "MGTTGM", "MYAGYM", "MYYYYM", "MMMMMM"]),
  clock: asset("별자리 룬 시계", "Constellation rune clock", [".YY.", "YWAY", "YTTY", ".MM."]),
  pet: asset("별빛 토끼", "Starlight rabbit", ["M....M", "MY..YM", ".MYYM.", "MYYYYM", "MYWYWM", "MYYYYM", "MMYYMM", ".M..M."]),
  floorObject: asset("봉인된 보물서", "Sealed treasure tome", ["..AA..", ".AYYA.", "MYYYYM", "MYMMYM", "MYAAYM", "MYYYYM", "MMMMMM", ".NNNN."])
};

const SCHOOL_ART: LateThemeArtPack = {
  wallpaper: asset(
    "햇살 교실 벽지",
    "Sunny classroom wallpaper",
    compose(64, 31, "K", [
      { x: 0, y: 0, rows: ["Y".repeat(64)] },
      { x: 0, y: 27, rows: ["I".repeat(64), "I".repeat(64), "N".repeat(64), "N".repeat(64)] },
      { x: 5, y: 4, rows: ["CCCCCCCCCCCCCCCCCC", "CGGGGGGGGGGGGGGGC", "CGWGGGGAGGGWGGGGC", "CGGGGGGGGGGGGGGGC", "CCCCCCCCCCCCCCCCCC"] },
      { x: 31, y: 5, rows: ["..W...", ".WWW..", "WWWWW.", "..N...", "..N..."] },
      { x: 48, y: 3, rows: ["CCCCCCCC", "CWWWWWWC", "CWAAWWWC", "CWWWWWWC", "CCCCCCCC"] },
      { x: 37, y: 18, rows: ["I", "III", "IIIII"] }
    ])
  ),
  flooring: asset(
    "복도 체크 바닥",
    "Hallway checker floor",
    compose(64, 9, "W", [
      { x: 0, y: 0, rows: ["N".repeat(64)] },
      { x: 0, y: 1, rows: Array.from({ length: 7 }, (_, y) => (y % 2 === 0 ? "YI".repeat(32) : "IY".repeat(32))) },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  window: asset("운동장 교실창", "Schoolyard classroom window", [
    "TTTTTTTTTTTTTTTT",
    "TBBBBBBBBBBBBBBT",
    "TBBBAAABBBBBBBBT",
    "TBBAAAAABBBBBBBT",
    "TBBBBBBBBGGGGGBT",
    "TBBBBBGGGGGGGGBT",
    "TGGGGGGGGGGGGGGT",
    "TYYYYYYYYYYYYYYT",
    "TYYYYYYIIYYYYYYT",
    "TYYYYYYIIYYYYYYT",
    "TTTTTTTTTTTTTTTT",
    "TIIITT....TTIIIT"
  ]),
  desk: asset(
    "서랍 달린 학생책상",
    "Student desk with drawer",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["N".repeat(54)] },
      { x: 0, y: 1, rows: ["C".repeat(56)] },
      { x: 3, y: 2, rows: ["Y".repeat(50)] },
      { x: 19, y: 3, rows: ["CCCCCCCCCCCCCCCCCC", "CYYYYYYYYYYYYYYYYC", "CCCCCCCCCCCCCCCCCC"] },
      { x: 4, y: 3, rows: ["CIC", "CIC", "CIC", "CIC", "CIC"] },
      { x: 49, y: 3, rows: ["CIC", "CIC", "CIC", "CIC", "CIC"] }
    ])
  ),
  monitor: asset("출석부 태블릿", "Attendance tablet", [
    "..TTTTTTTTTT..",
    ".TWWWWWWWWWT..",
    "TWIWIWIWIWIWT.",
    "TWWWWWWWWWWWT.",
    "TWIIIWWIIIWWT.",
    "TWWWWWWWWWWWT.",
    "TWAAAWWAAAWWT.",
    "..TTTTTTTTTT..",
    "....TNNNT.....",
    "..TTTTTTTTTT.."
  ]),
  mug: asset("연필꽂이 컵", "Pencil-holder cup", ["..A.N.", ".A.N..", "TYYYYT", "TYAIYT", "TYYYYT", ".TTTT."]),
  ornament: asset("책상 위 지구본", "Desk globe", ["..BBB..", ".BGGGB.", "BGYWGGB", ".BGGGB.", "..TTT..", "..TNT..", ".TNNNT.", "TTTTTTT"]),
  lamp: asset("독서실 스탠드", "Study-room lamp", ["TTTT.", "TWWWT", ".TTT.", "...T.", "..TT.", ".TT..", ".T...", ".T...", ".T...", ".T...", ".TNT.", "TTTTT"]),
  mat: asset("공책 줄 매트", "Notebook-line mat", ["WIWIWIWI", "WAAWAAWA", "TTTTTTTT"]),
  shelf: asset("분필과 지우개", "Chalk and eraser", ["W.W.W", "WWWWW", ".NNN.", "TTTTT"]),
  frame: asset("오늘의 시간표", "Today's timetable", ["TTTTTT", "TWWWWT", "TWIWIT", "TWAWAT", "TWIWIT", "TWWWWT", "TTTTTT"]),
  clock: asset("교실 종 시계", "Class bell clock", [".AA.", "AWWA", "AIWA", ".TT."]),
  pet: asset("책가방 강아지", "Backpack puppy", ["T.T...", "TYYT..", "TWTW..", "TYNT..", "TYYTT.", "TYIITT", ".T..T.", "..T..."]),
  floorObject: asset("노란 통학가방", "Yellow school bag", ["..TT..", ".T..T.", "TYYYYT", "TYTTYT", "TYAAYT", "TYYYYT", "TTTTTT", ".IIII."])
};

const RAINY_ART: LateThemeArtPack = {
  wallpaper: asset(
    "창밖 소나기 벽지",
    "Rain-shower window wallpaper",
    compose(64, 31, "B", [
      { x: 0, y: 0, rows: ["E".repeat(64)] },
      { x: 3, y: 4, rows: ["..CCCCCCCCCCCC..", ".CEEEEEEEEEEEEC.", "CEEBEEEBEEEBEEEC", "CEETEEETEEETEEEC", "CEEBEEEBEEEBEEEC", ".CEEEEEEEEEEEEC.", "..CCCCCCCCCCCC.."] },
      { x: 29, y: 7, rows: ["..EEEE.....", "EEEEEEEEE..", ".EEEEEEEEEE", "....EEEE..."] },
      { x: 37, y: 13, rows: ["T...T...T", "..T...T..", "T...T...T", "..T...T..", "T...T...T"] },
      { x: 5, y: 22, rows: ["....TTTT.....", ".TTTTTTTTTT..", "TTTTTTTTTTTTT", "...BBBBBBB..."] },
      { x: 49, y: 21, rows: ["..S..", ".SSS.", "SSSSS", "..N..", "..N.."] }
    ])
  ),
  flooring: asset(
    "빗물 고인 타일",
    "Rain-puddle tiles",
    compose(64, 9, "E", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      { x: 7, y: 2, rows: [".BBBBBBBB.", "BBBBBBBBBB"] },
      { x: 31, y: 5, rows: [".TTTTTTTTTTTT.", "TTTTTTTTTTTTTT"] },
      { x: 53, y: 2, rows: ["BBBBBBB"] },
      { x: 0, y: 8, rows: ["B".repeat(64)] }
    ])
  ),
  window: asset("빗방울 격자창", "Raindrop lattice window", [
    "IIIIIIIIIIIIIIII",
    "IBBBBBBIBBBBBBBI",
    "IBBTBBBIBBBTBBBI",
    "IBBBBBBIBBBBBBBI",
    "IBTBBBBIBTBBBBBI",
    "IIIIIIIIIIIIIIII",
    "IBBBTBBIBBBTBBBI",
    "IBBBBBBIBBBBBBBI",
    "IBTBBBBIBBBBBBBI",
    "IBBBBBBIBTBBBBBI",
    "IIIIIIIIIIIIIIII",
    "IIIICC....CCIIII"
  ]),
  desk: asset(
    "우산 손잡이 곡선 책상",
    "Umbrella-handle curved desk",
    compose(56, 8, ".", [
      { x: 2, y: 0, rows: ["I".repeat(52)] },
      { x: 0, y: 1, rows: ["T".repeat(56)] },
      { x: 4, y: 2, rows: ["E".repeat(48)] },
      { x: 4, y: 3, rows: ["IBI", "IBI", "IBI", "IBI", "IBI"] },
      { x: 49, y: 3, rows: ["IBI", "IBI", "IBI", "IBI", "IBI"] },
      { x: 18, y: 3, rows: ["..SSSSSSSS....", "SSSSSSSSSSSS..", "....SSSSSSSSSS"] }
    ])
  ),
  monitor: asset("갬 예보 화면", "Clearing-forecast screen", [
    "...MMMMMMMM...",
    ".MMBBBBBBBBMM.",
    "MBBBWWWWBBAABM",
    "MBBWWWWWWBAABM",
    "MBBBKBKBKBBBBM",
    "MBBKBKBKBBBBBM",
    "MBBBKBKBKBBBBM",
    ".MMBBBBBBBBMM.",
    "...MMMMMMMM...",
    ".....MNM......"
  ]),
  mug: asset("장화 손잡이 잔", "Rain-boot mug", [".M.T..", ".MTT..", "MBBBBM", "MBSTMM", "MBBBBM", ".MMMM."]),
  ornament: asset("탁상 빗물 측정기", "Desk rain gauge", ["..MMM..", ".MBBBM.", ".MBTBM.", ".MBBBM.", ".MBTBM.", ".MBBBM.", "..MNM..", ".MNNNM."]),
  lamp: asset("우산 갓 조명", "Umbrella-shade lamp", ["..M..", ".MSM.", "MSSSM", "MMMMM", "..N..", "..N..", "..N..", "..N..", "..N..", ".MNM.", "MNNNM", "MMMMM"]),
  mat: asset("물결 빗줄기 매트", "Ripple-rain mat", ["MTMMTMMT", "MBBSSBBM", "MMMMMMMM"]),
  shelf: asset("접힌 우산", "Folded umbrella", [".MS..", "MS...", "MS...", ".MMM."]),
  frame: asset("일기예보 포스터", "Weather forecast poster", ["MMMMMM", "MBBBBM", "MBEEBM", "METTEM", "MBSSBM", "MBBBBM", "MMMMMM"]),
  clock: asset("물방울 시계", "Raindrop clock", ["..T.", ".TBT", "TBAT", ".MM."]),
  pet: asset("우비 개구리", "Raincoat frog", ["M....M", "MW..WM", ".MBBM.", "MBWCBM", "MBBBBM", ".MBBM.", "MM..MM", ".M..M."]),
  floorObject: asset("젖은 장우산", "Wet long umbrella", ["..MM..", ".MSSM.", "MSSSSM", "MMMMMM", "...N..", "...N..", "...N..", "..MNM."])
};

const LIBRARY_ART: LateThemeArtPack = {
  wallpaper: asset(
    "사다리 서가 벽지",
    "Rolling-ladder bookshelf wallpaper",
    compose(64, 31, "N", [
      { x: 0, y: 0, rows: ["R".repeat(64)] },
      { x: 3, y: 3, rows: ["CCCCCCCCCCCCCCCCCC", "CYYYYRYYYYRYYYYRRC", "CYYYYRYYYYRYYYYRRC", "CWWWWRYYYYRWWWWRRC", "CYYYYRWWWWRYYYYRRC", "CCCCCCCCCCCCCCCCCC"] },
      { x: 31, y: 8, rows: ["CCCCCCCCCCCCCCCCCCCCCCCCCC", "CYYYYRYYYYRYYYYRYYYYRYYYRC", "CWWWWRYYYYRWWWWRYYYYRYYYRC", "CYYYYRWWWWRYYYYRWWWWRYYYRC", "CCCCCCCCCCCCCCCCCCCCCCCCCC"] },
      { x: 43, y: 14, rows: ["T...T", "T...T", "TTTTT", "T...T", "T...T", "T...T", "T...T", "T...T"] },
      { x: 7, y: 20, rows: ["..W..", ".WWW.", "WWAWW", ".WWW.", "..N.."] },
      { x: 0, y: 28, rows: ["Y".repeat(64), "Y".repeat(64), "C".repeat(64)] }
    ])
  ),
  flooring: asset(
    "헤링본 독서실 바닥",
    "Herringbone reading-room floor",
    compose(64, 9, "Y", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      { x: 0, y: 1, rows: Array.from({ length: 7 }, (_, y) => (y % 2 === 0 ? "NNRY".repeat(16) : "YRNN".repeat(16))) },
      { x: 0, y: 8, rows: ["R".repeat(64)] }
    ])
  ),
  window: asset("아치형 열람실 창", "Arched reading-room window", [
    ".....TTTTTT.....",
    "...TTWWWWWWTT...",
    "..TWWYYYYYYWWT..",
    ".TWYYYYYYYYYYWT.",
    "TWYYYYYYYYYYYYWT",
    "TWYYNNNNNNNNYYWT",
    "TWYYNNNNNNNNYYWT",
    "TWYYYYYYYYYYYYWT",
    ".TWYYYYYYYYYYWT.",
    "..TTWWWWWWWWTT..",
    "....TTTTTTTT....",
    "......RRRR......"
  ]),
  desk: asset(
    "긴 공동 열람책상",
    "Long communal reading desk",
    compose(56, 8, ".", [
      { x: 0, y: 0, rows: ["T".repeat(56)] },
      { x: 2, y: 1, rows: ["N".repeat(52)] },
      { x: 4, y: 2, rows: ["Y".repeat(48)] },
      { x: 9, y: 3, rows: ["TRT", "TRT", "TRT", "TRT", "TRT"] },
      { x: 44, y: 3, rows: ["TRT", "TRT", "TRT", "TRT", "TRT"] }
    ])
  ),
  monitor: asset("전자책 펼침 단말", "Open e-book terminal", [
    "......II......",
    "....IIIIII....",
    "IIIIIIIIIIIIII",
    "IYYYYIIYYYYYYI",
    "IYRYYIIYYRYYYI",
    "IYYYYIIYYYYYYI",
    "IYRYRIIYRYRYYI",
    ".IIII..IIIIII.",
    ".....INI......",
    "...IIIIIIII..."
  ]),
  mug: asset("책등 무늬 찻잔", "Book-spine teacup", [".I.W..", ".IWW..", "IYYYYI", "IYRRYI", "IYYYYI", ".IIII."]),
  ornament: asset("황동 독서대", "Brass book stand", ["...I...", ".IIIII.", "IYYYYYI", "IYRRRYI", ".IYYYI.", "...N...", "..NNN..", ".IIIII."]),
  lamp: asset("초록 갓 독서등", "Green-shade reading lamp", ["..I..", ".IGI.", "IGGGI", ".III.", "..N..", "..N..", "..N..", "..N..", "..N..", ".INI.", "INNNI", "IIIII"]),
  mat: asset("도서 대출카드 매트", "Library-card mat", ["IRIIWIRI", "IRWWRWRI", "IIIIIIII"]),
  shelf: asset("세 권의 고서", "Three old books", [".IR..", "IYYYY", "IRRRR", "IIIII"]),
  frame: asset("도서관 평면도", "Library floor plan", ["IIIIII", "IYYYYI", "IYNNYI", "INYYNI", "IYNNYI", "IYYYYI", "IIIIII"]),
  clock: asset("책갈피 시계", "Bookmark clock", [".RR.", "RWWR", "RAAR", ".II."]),
  pet: asset("책벌레 부엉이", "Bookworm owl", ["I....I", "IIYYII", "IWYYWI", "IYCCYI", "IYAYYI", "IIYYII", ".IYYI.", ".I..I."]),
  floorObject: asset("반납 도서 카트", "Book-return cart", ["..II..", ".I..I.", "IYYYYI", "IRRRRI", "IYYYYI", "IIIIII", ".N..N.", "I....I"])
};

const CAFE_ART: LateThemeArtPack = {
  wallpaper: asset(
    "골목 로스터리 벽지",
    "Alley roastery wallpaper",
    compose(64, 31, "Y", [
      { x: 0, y: 0, rows: ["N".repeat(64)] },
      { x: 4, y: 4, rows: ["CCCCCCCCCCCCCCCC", "CWWWWWWWWWWWWWWC", "CWWNNWWNNWWNNWWC", "CWWWWWWWWWWWWWWC", "CCCCCCCCCCCCCCCC"] },
      { x: 29, y: 3, rows: ["..RRRRRRRRRRRRRRRR..", ".RWRWRWRWRWRWRWRWR.", "RWRWRWRWRWRWRWRWRWR", "CCCCCCCCCCCCCCCCCCCC"] },
      { x: 34, y: 8, rows: ["CCCCCCCCCCCCCC", "CYYYYYYYYYYYYC", "CYNNRNNRNNYYYC", "CYYYYYYYYYYYYC", "CCCCCCCCCCCCCC"] },
      { x: 8, y: 17, rows: ["..WWW..", ".WNNNW.", "WNNANNW", ".WNNNW.", "..CCC..", "..NNN.."] },
      { x: 50, y: 20, rows: ["G...G", "GG.GG", ".GGG.", "..N..", "..N.."] }
    ])
  ),
  flooring: asset(
    "테라코타 카페 바닥",
    "Terracotta cafe floor",
    compose(64, 9, "O", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      { x: 0, y: 3, rows: ["N".repeat(64)] },
      { x: 0, y: 6, rows: ["N".repeat(64)] },
      { x: 12, y: 1, rows: ["N", "N"] },
      { x: 38, y: 4, rows: ["N", "N"] },
      { x: 0, y: 8, rows: ["R".repeat(64)] }
    ])
  ),
  window: asset("줄무늬 어닝 창", "Striped-awning window", [
    "IRIRIRIRIRIRIRIR",
    "IWWWWWWWWWWWWWWI",
    "IWWNNWWNNWWNNWWI",
    "IWWWWWWWWWWWWWWI",
    "IYYYYYYYYYYYYYYI",
    "IYYNNYYYYNNYYYYI",
    "IYYYYYYYYYYYYYYI",
    "IYYYYYYYYYYYYYYI",
    "IYYYYYYYYYYYYYYI",
    "INNNNNNNNNNNNNNI",
    "IIIIIIIIIIIIIIII",
    "IINNII....IINNII"
  ]),
  desk: asset(
    "에스프레소 바 책상",
    "Espresso bar desk",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["I".repeat(54)] },
      { x: 0, y: 1, rows: ["N".repeat(56)] },
      { x: 3, y: 2, rows: ["Y".repeat(50)] },
      { x: 14, y: 3, rows: ["RRRRRRRRRRRRRRRRRRRRRRRRRRRR"] },
      { x: 4, y: 3, rows: ["INI", "INI", "INI", "INI", "INI"] },
      { x: 49, y: 3, rows: ["INI", "INI", "INI", "INI", "INI"] }
    ])
  ),
  monitor: asset("주문표 포스기", "Order-ticket POS", [
    "..TTTTTTTTTT..",
    ".TYYYYYYYYYT..",
    ".TYWWYYYYWWYT.",
    ".TYYYYYYYYYYT.",
    ".TYRRRYYRRRYT.",
    ".TYYYYYYYYYYT.",
    ".TYNNNYYNNNYT.",
    "..TTTTTTTTTT..",
    "....TNNNT.....",
    "..TTTTTTTTTT.."
  ]),
  mug: asset("라테아트 잔", "Latte-art cup", [".T.A..", ".TAA..", "TYYYYT", "TYWWTT", "TYAYYT", ".TTTT."]),
  ornament: asset("핸드드립 서버", "Pour-over server", ["..TTT..", ".TWWWT.", "TWNWAWT", ".TWWWT.", "..TTT..", "..TNT..", ".TNNNT.", "TTTTTTT"]),
  lamp: asset("카페 펜던트등", "Cafe pendant lamp", ["..T..", "..N..", "..N..", ".TNT.", "TNNNT", "NAAAN", ".TTT.", "..N..", "..N..", ".TNT.", "TNNNT", "TTTTT"]),
  mat: asset("원두 자루 매트", "Coffee-sack mat", ["TNTTNTTN", "TRYYRYRT", "TTTTTTTT"]),
  shelf: asset("원두 틴 세트", "Coffee bean tins", ["T.T.T", "TNTNT", "TRTRT", "TTTTT"]),
  frame: asset("오늘의 원두 메뉴", "Today's bean menu", ["TTTTTT", "TYYYYT", "TYNNYT", "TYRRYT", "TYNNYT", "TYYYYT", "TTTTTT"]),
  clock: asset("커피 필터 시계", "Coffee-filter clock", [".NN.", "NWWN", "NAAN", ".TT."]),
  pet: asset("베레모 바리스타냥이", "Beret barista cat", [".TTT..", "TNNNT.", "TWNWT.", "TNRNT.", "TNNNTT", "TNWWTT", ".T..T.", "..T..."]),
  floorObject: asset("생두 포대", "Green-bean sack", ["..TT..", ".T..T.", "TNNNNT", "TNYYNT", "TNRRNT", "TNNNNT", "TTTTTT", ".RRRR."])
};

const BAKERY_ART: LateThemeArtPack = {
  wallpaper: asset(
    "새벽 빵공방 벽지",
    "Dawn bread-workshop wallpaper",
    compose(64, 31, "O", [
      { x: 0, y: 0, rows: ["Y".repeat(64)] },
      { x: 4, y: 4, rows: ["..CCCCCCCCCCCC..", ".CYYYYYYYYYYYYC.", "CYYOOOOOOOOOOYYC", "CYYOAAAAAAAOOYYC", "CYYOAAAAAAAOOYYC", ".CYYOOOOOOYYYC.", "..CCCCCCCCCCCC.."] },
      { x: 31, y: 3, rows: ["CCCCCCCCCCCCCCCCCCCC", "CYYYYYYYYYYYYYYYYYYC", "CYAAAYYOOOYYAAAAAYC", "CYYYYYYYYYYYYYYYYYYC", "CCCCCCCCCCCCCCCCCCCC"] },
      { x: 37, y: 11, rows: ["..AAA...", ".AAAAA..", "AAYYYAA.", "AYYYYYA.", ".AAAAA.."] },
      { x: 8, y: 18, rows: ["NNNNNNNNNN", "NYYYYYYYYN", "NYAAOOAAYN", "NNNNNNNNNN"] },
      { x: 51, y: 20, rows: ["..W..", ".WWW.", "WWAWW", "..N..", "..N.."] }
    ])
  ),
  flooring: asset(
    "밀가루 자국 나무바닥",
    "Flour-dusted wood floor",
    compose(64, 9, "N", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      { x: 7, y: 2, rows: ["..WWW..", ".WWWWW."] },
      { x: 29, y: 5, rows: [".WWWWWWWW.", "WWWWWWWWWW"] },
      { x: 52, y: 2, rows: ["..WWW.."] },
      { x: 0, y: 8, rows: ["O".repeat(64)] }
    ])
  ),
  window: asset("빵 진열 격자창", "Bread-display grid window", [
    "TTTTTTTTTTTTTTTT",
    "TYYYYYYYYYYYYYYT",
    "TYYAAAYYYYAAAYYT",
    "TYAAAAAYYAAAAAYT",
    "TYYYYYYYYYYYYYYT",
    "TTTTTTTTTTTTTTTT",
    "TYYOOOYYYYOOOYYT",
    "TYOOOOOYYOOOOOYT",
    "TYYYYYYYYYYYYYYT",
    "TYYYYYYYYYYYYYYT",
    "TTTTTTTTTTTTTTTT",
    "TNNNTT....TTNNNT"
  ]),
  desk: asset(
    "반죽 작업대 책상",
    "Dough-prep workbench",
    compose(56, 8, ".", [
      { x: 0, y: 0, rows: ["T".repeat(56)] },
      { x: 2, y: 1, rows: ["Y".repeat(52)] },
      { x: 4, y: 2, rows: ["W".repeat(48)] },
      { x: 20, y: 2, rows: ["AAAAAAAAAAAAAAAA"] },
      { x: 5, y: 3, rows: ["TNT", "TNT", "TNT", "TNT", "TNT"] },
      { x: 48, y: 3, rows: ["TNT", "TNT", "TNT", "TNT", "TNT"] }
    ])
  ),
  monitor: asset("오븐 타이머 패널", "Oven timer panel", [
    "..IIIIIIIIII..",
    ".IOOOOOOOOOI..",
    "IOOAAOOAAOOOI.",
    "IOOOOOOOOOOOI.",
    "IOYYYYYYYYOOI.",
    "IOOAAOOAAOOOI.",
    "IOOOOOOOOOOOI.",
    "..IIIIIIIIII..",
    "....INNNI.....",
    "..IIIIIIIIII.."
  ]),
  mug: asset("식빵 손잡이 잔", "Toast-handle cup", [".I.A..", ".IAA..", "IOOOOI", "IYOOII", "IYYYYI", ".IIII."]),
  ornament: asset("탁상 반죽기", "Mini dough mixer", ["..III..", ".IWWWI.", "IWAAAWI", ".IWWWI.", "..INI..", "..INI..", ".INNNI.", "IIIIIII"]),
  lamp: asset("바게트 펜던트등", "Baguette pendant lamp", ["..I..", "..N..", "..N..", ".INI.", "INNNI", "NAAAN", ".III.", "..N..", "..N..", ".INI.", "INNNI", "IIIII"]),
  mat: asset("밀 이삭 매트", "Wheat-stalk mat", ["IOIIOIIO", "IYOOYOYI", "IIIIIIII"]),
  shelf: asset("크루아상 바구니", "Croissant basket", [".IAA.", "IAAAI", "IYOYI", "IIIII"]),
  frame: asset("빵 굽기 순서표", "Bread-baking chart", ["IIIIII", "IYYYYI", "IYAAYI", "IYOOYI", "IYWWYI", "IYYYYI", "IIIIII"]),
  clock: asset("도넛 시계", "Doughnut clock", [".OO.", "OYYO", "OAYO", ".II."]),
  pet: asset("셰프모자 빵집 곰", "Chef-hat bakery bear", [".WWW..", "WWWWW.", "I.I...", "IYIYI.", "IWYYWI", "IYNYYI", ".IYYI.", ".I..I."]),
  floorObject: asset("바게트 배달 바구니", "Baguette delivery basket", ["A.A.A.", "AAAAAA", "IYYYYI", "IYOOYI", "IYOOYI", "IYYYYI", "IIIIII", ".NNNN."])
};

const CAMPING_ART: LateThemeArtPack = {
  wallpaper: asset(
    "별밤 호숫가 캠프 벽지",
    "Starry lakeside-camp wallpaper",
    compose(64, 31, "I", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      { x: 7, y: 4, rows: ["W", "...W", "......W", "..A"] },
      { x: 46, y: 3, rows: ["..AAA..", ".AAAAA.", "AAAAAAA", ".AAAAA.", "..AAA.."] },
      // 잔디→모래톱→호수 — 검은 띠 대신 호수가 바닥까지 이어진다
      { x: 0, y: 22, rows: ["G".repeat(64), "G".repeat(64), "N".repeat(64), "N".repeat(64), "B".repeat(64), "B".repeat(64), "B".repeat(64), "B".repeat(64), "G".repeat(64)] },
      { x: 10, y: 27, rows: ["WW"] },
      { x: 44, y: 28, rows: ["WW"] },
      { x: 8, y: 12, rows: ["....G....", "...GGG...", "..GGGGG..", ".GGGGGGG.", "....N....", "....N...."] },
      { x: 27, y: 16, rows: [".....O.....", "...OOOOO...", ".OOOOOOOOO.", "OOOYYYYYOOO", "NNNNNNNNNNN"] },
      { x: 51, y: 17, rows: ["..A..", ".ASA.", "SSSSS", ".NNN.", "N...N"] }
    ])
  ),
  flooring: asset("캠프 데크와 잔디", "Camp deck and grass", compose(64, 9, "G", [
    { x: 0, y: 0, rows: ["C".repeat(64)] },
    { x: 17, y: 1, rows: Array.from({ length: 7 }, () => "N".repeat(31)) },
    { x: 17, y: 3, rows: ["R".repeat(31)] },
    { x: 17, y: 6, rows: ["R".repeat(31)] },
    { x: 0, y: 8, rows: ["Y".repeat(64)] }
  ])),
  window: asset("텐트 입구 창", "Tent-opening window", [
    ".......TT.......",
    "......TYYT......",
    ".....TYYYYT.....",
    "....TYYYYYYT....",
    "...TYYYIIYYYT...",
    "..TYYYIIIYYYYT..",
    ".TYYYYIIIIYYYYT.",
    "TYYYYYIIIIYYYYYT",
    "TYYYYYIIIIYYYYYT",
    "TYYYYYYYYYYYYYYT",
    "TTTTTTTTTTTTTTTT",
    "......NNNN......"
  ]),
  desk: asset("접이식 캠프 테이블", "Folding camp table", compose(56, 8, ".", [
    { x: 3, y: 0, rows: ["T".repeat(50)] },
    { x: 1, y: 1, rows: ["R".repeat(54)] },
    { x: 5, y: 2, rows: ["Y".repeat(46)] },
    { x: 8, y: 3, rows: ["T.N", ".TN", "..T", ".NT", "N.T"] },
    { x: 45, y: 3, rows: ["N.T", ".NT", "..T", "TN.", "T.N"] }
  ])),
  // 중앙 하단에 밝은 덩어리를 두면 얼굴로 읽혀서, 달과 능선의 밤 풍경으로 그린다
  monitor: asset("밤 능선 화면", "Night-ridge screen", [".NNNNNNNNNNNN.", "NCCCCCCCCCCCCN", "NCCWCCCCCAACCN", "NCCCCCCCCAACCN", "NCCCCCCCCCCCCN", "NCCGGGCCCCGGCN", "NCGGGGGCCGGGGN", "NGGGGGGGGGGGGN", ".NNNNNNNNNNNN.", "....NNNNNN...."]),
  mug: asset("법랑 캠프컵", "Enamel camp mug", [".M.A..", ".MAA..", "MYYYYM", "MYOGMM", "MYYYYM", ".MMMM."]),
  ornament: asset("미니 모닥불", "Mini campfire", ["...A...", "..ASA..", ".ASSSA.", "..NNN..", ".MNNNM.", "MNNNNNM", ".M.M.M.", "M.....M"]),
  lamp: asset("가스 랜턴", "Gas lantern", ["..M..", ".MNM.", "M...M", "MAAWM", "MAAWM", "MWWWM", ".MMM.", "..N..", "..N..", ".MNM.", "MNNNM", "MMMMM"]),
  mat: asset("산길 지도 매트", "Trail-map mat", ["MGMMGMMG", "MYNNYNYM", "MMMMMMMM"]),
  shelf: asset("캠프 나침반", "Camp compass", [".MM..", "MWWM.", "MWAM.", ".MM.."]),
  frame: asset("국립공원 배지판", "National-park badge board", ["MMMMMM", "MGGGGM", "MGYNGM", "MYNNYM", "MGAGGM", "MGGGGM", "MMMMMM"]),
  clock: asset("통나무 나이테 시계", "Log-ring clock", [".NN.", "NYYN", "NAYN", ".MM."]),
  // 눈 행은 y26(책상 상판 Y 위), 주둥이 행은 y27(호수 B 위)라 배경과 분리된다.
  pet: asset("모닥불 여우", "Campfire fox", [".S..S.", "SSSSSS", "SCSSCS", "SWCCWS", "SSSSSS", "SSSSSS", "SSSSWW", ".S.S.."]),
  floorObject: asset("말아 둔 침낭", "Rolled sleeping bag", ["..MM..", ".MGGM.", "MGYYGM", "MGYYGM", "MGYYGM", ".MGGM.", "..MM..", ".NNNN."])
};

const GREENHOUSE_ART: LateThemeArtPack = {
  wallpaper: asset(
    "유리온실 덩굴 벽지",
    "Vine-covered glasshouse wallpaper",
    compose(64, 31, "E", [
      { x: 0, y: 0, rows: ["W".repeat(64)] },
      { x: 0, y: 1, rows: ["T".repeat(64)] },
      { x: 0, y: 10, rows: ["T".repeat(64)] },
      { x: 0, y: 20, rows: ["T".repeat(64)] },
      { x: 15, y: 1, rows: Array.from({ length: 30 }, () => "T") },
      { x: 36, y: 1, rows: Array.from({ length: 30 }, () => "T") },
      { x: 55, y: 1, rows: Array.from({ length: 30 }, () => "T") },
      { x: 4, y: 4, rows: ["G...G...G", "GG.GG.GGG", ".GGG...GG", "..G....G.", "..N....N."] },
      { x: 22, y: 13, rows: ["..G..", ".GGG.", "GGSGG", ".GGG.", "..N..", "..N.."] },
      { x: 43, y: 22, rows: ["G.G.G.G", ".GGGGG.", "..GGG..", "...N..."] }
    ])
  ),
  flooring: asset("촉촉한 온실 벽돌길", "Damp greenhouse brick path", compose(64, 9, "N", [
    { x: 0, y: 0, rows: ["C".repeat(64)] },
    { x: 12, y: 1, rows: Array.from({ length: 7 }, () => "O".repeat(39)) },
    { x: 12, y: 3, rows: ["G".repeat(39)] },
    { x: 12, y: 6, rows: ["G".repeat(39)] },
    { x: 0, y: 8, rows: ["T".repeat(64)] }
  ])),
  window: asset("빗물 맺힌 온실창", "Dewy greenhouse window", ["MMMMMMMMMMMMMMMM", "MEEEEEEEEEEEEEEM", "MEETEEEETEEEEETM", "MEEEEEEEEEEEEEEM", "MEEGEEEEEEGEEEEM", "MMMMMMMMMMMMMMMM", "MEEGGEEEEGGEEEEM", "MEEEEGEEGEEEEEEM", "MEEEEGGGGEEEEEEM", "MEEEEEEEEEEEEEEM", "MMMMMMMMMMMMMMMM", "MMNNMM....MMNNMM"]),
  desk: asset("화분 작업대 책상", "Potting workbench", compose(56, 8, ".", [
    { x: 0, y: 0, rows: ["M".repeat(56)] },
    { x: 2, y: 1, rows: ["N".repeat(52)] },
    { x: 4, y: 2, rows: ["G".repeat(48)] },
    { x: 9, y: 3, rows: ["MNM", "MNM", "MNM", "MNM", "MNM"] },
    { x: 44, y: 3, rows: ["MNM", "MNM", "MNM", "MNM", "MNM"] }
  ])),
  monitor: asset("생장 기록 태블릿", "Growth-log tablet", ["..IIIIIIIIII..", ".IEEEEEEEEEI..", "IEEGEEGEEGEEI.", "IEEGGGGEEGEEI.", "IEEGSGGEEGEEI.", "IEEGGGGEEGEEI.", "IEEGEEGEEGEEI.", "..IIIIIIIIII..", "....INNNI.....", "..IIIIIIIIII.."]),
  mug: asset("새싹 유리컵", "Sprout glass cup", ["..G...", ".GGG..", "IEEEII", "IEGGEI", "IEEEEI", ".IIII."]),
  ornament: asset("자동 물뿌리개", "Automatic watering can", ["...I...", ".IIIII.", "ITTTTII", "ITWTTTI", "ITTTTTI", ".IIIII.", "..I.I..", ".I...I."]),
  lamp: asset("성장등 스탠드", "Grow-light stand", ["IIIII", "IWWWI", ".III.", "..N..", "..N..", "..N..", "..N..", "..N..", "..N..", ".INI.", "INNNI", "IIIII"]),
  mat: asset("잎맥 관찰 매트", "Leaf-vein mat", ["ITIITITI", "IGSSGSGI", "IIIIIIII"]),
  shelf: asset("다육이 세 화분", "Three succulents", ["G.G.G", "GGGGG", "ININI", "IIIII"]),
  frame: asset("식물 생장표", "Plant growth chart", ["IIIIII", "IEEEEI", "IEGGEI", "IEGGGI", "IEGSEI", "IEEEEI", "IIIIII"]),
  clock: asset("해바라기 시계", "Sunflower clock", [".SS.", "SAYS", "SGGS", ".II."]),
  pet: asset("새싹 토끼", "Sprout rabbit", [".GGG..", "IG..GI", "IG..GI", ".IGGI.", "IWGGWI", "IGGGGI", ".IGGI.", ".I..I."]),
  floorObject: asset("큰 몬스테라 화분", "Large monstera pot", ["G..G.G", "GGGGGG", ".GGGG.", "..NN..", ".INNI.", "INNNNI", "INNNNI", "IIIIII"])
};

const MUSIC_ART: LateThemeArtPack = {
  wallpaper: asset(
    "방음 패널 음악실 벽지",
    "Acoustic-panel music-room wallpaper",
    compose(64, 31, "M", [
      { x: 0, y: 0, rows: ["I".repeat(64)] },
      { x: 3, y: 3, rows: ["PPPPPPPPPPPP", "PWWWWWWWWWWP", "PWPPWPPWPPWP", "PWWWWWWWWWWP", "PPPPPPPPPPPP"] },
      { x: 21, y: 5, rows: ["CCCCCCCCCCCCCCCCCC", "CMMMMMMMMMMMMMMMMC", "CMMPPMMPPMMPPMMMC", "CMMMMMMMMMMMMMMMMC", "CCCCCCCCCCCCCCCCCC"] },
      { x: 46, y: 3, rows: ["..S.", ".SS.", "..S.", "..S.", "SSS."] },
      { x: 52, y: 13, rows: [".A...", "AAA..", ".A...", ".A...", "AAA.."] },
      { x: 7, y: 17, rows: ["...W...", "..WWW..", ".WWWWW.", "WWWPWWW", "...N...", "...N..."] },
      { x: 0, y: 27, rows: ["P".repeat(64), "P".repeat(64), "C".repeat(64), "C".repeat(64)] }
    ])
  ),
  flooring: asset("오선보 카펫 바닥", "Music-staff carpet", compose(64, 9, "P", [
    { x: 0, y: 0, rows: ["C".repeat(64)] },
    { x: 0, y: 2, rows: ["W".repeat(64)] },
    { x: 0, y: 4, rows: ["W".repeat(64)] },
    { x: 0, y: 6, rows: ["W".repeat(64)] },
    { x: 15, y: 1, rows: ["S", "S", "SS", "S"] },
    { x: 41, y: 4, rows: ["A", "A", "AA", "A"] },
    { x: 0, y: 8, rows: ["I".repeat(64)] }
  ])),
  window: asset("녹음실 이중창", "Studio double window", ["NNNNNNNNNNNNNNNN", "NIIIIIIIIIIIIIIN", "NIIMMMMMMMMMMIIN", "NIMMMMMMMMMMMMIN", "NIMMPPMMPPMMMMIN", "NIMMMMMMMMMMMMIN", "NIIMMMMMMMMMMIIN", "NIIIIIIIIIIIIIIN", "NIPPPPPPPPPPPPIN", "NIIIIIIIIIIIIIIN", "NNNNNNNNNNNNNNNN", "NNIINN....NNIINN"]),
  desk: asset("건반형 작곡 책상", "Keyboard composer desk", compose(56, 8, ".", [
    { x: 0, y: 0, rows: ["N".repeat(56)] },
    { x: 2, y: 1, rows: ["W".repeat(52)] },
    { x: 4, y: 2, rows: ["CWCWCWCWCWCWCWCWCWCWCWCWCWCWCWCWCWCWCWCWCWCWCWCW"] },
    { x: 7, y: 3, rows: ["NIN", "NIN", "NIN", "NIN", "NIN"] },
    { x: 46, y: 3, rows: ["NIN", "NIN", "NIN", "NIN", "NIN"] }
  ])),
  monitor: asset("파형 믹싱 콘솔", "Waveform mixing console", [".TTTTTTTTTTTT.", "TIIIIIIIIIIIIT", "TIMMMMMMMMMMIT", "TIMPMPMPMPMMIT", "TIMMSSMMMSSMIT", "TIMPMPMPMPMMIT", "TIMMMMMMMMMMIT", ".TTTTTTTTTTTT.", ".....TNT......", "...TTTTTTTT..."]),
  mug: asset("음표 손잡이 잔", "Music-note mug", [".T.S..", ".TSS..", "TWWWWT", "TWSPTT", "TWWWWT", ".TTTT."]),
  ornament: asset("미니 턴테이블", "Mini turntable", [".......", ".TTTTT.", "TIIIIIT", "TIIPAIT", "TIIIIIT", ".TTTTT.", "..TNT..", ".TTTTT."]),
  lamp: asset("마이크 스탠드등", "Microphone stand lamp", ["..TT.", ".TWWT", ".TWWT", "..TT.", "..N..", "..N..", "..N..", "..N..", "..N..", ".TNT.", "TNNNT", "TTTTT"]),
  mat: asset("리듬 패드 매트", "Rhythm-pad mat", ["TSTTATTS", "TPMMPMPT", "TTTTTTTT"]),
  shelf: asset("메트로놈", "Metronome", ["..T..", ".TAT.", "TPMPT", "TTTTT"]),
  frame: asset("공연 세트리스트", "Concert setlist", ["TTTTTT", "TWWWWT", "TWSPWT", "TWAWST", "TWSPWT", "TWWWWT", "TTTTTT"]),
  clock: asset("레코드판 시계", "Record clock", [".II.", "IPAI", "IMAI", ".TT."]),
  pet: asset("헤드폰 파랑새", "Headphone bluebird", [".TTTT.", "TTBBTT", "TWBBWT", "TBAABT", "TTBBTT", ".TBBT.", "..TT..", ".T..T."]),
  floorObject: asset("기타 하드케이스", "Guitar hard case", ["..TT..", ".TPPT.", "TPPPPT", "TPAPPT", "TPPPPT", ".TPPT.", "..TT..", ".NNNN."])
};

const ARCADE_ART: LateThemeArtPack = {
  wallpaper: asset(
    "네온 게임센터 벽지",
    "Neon game-center wallpaper",
    compose(64, 31, "C", [
      { x: 0, y: 0, rows: ["I".repeat(64)] },
      { x: 3, y: 4, rows: ["GGGGGGGGGG", "GPPPPPPPPG", "GPWPAAPWPG", "GPPPPPPPPG", "GGGGGGGGGG", "G..G..G..G"] },
      { x: 21, y: 3, rows: ["AAAAAAAAAAAA", "ABBBBBBBBBBA", "ABSPSSPSSPBA", "ABBBBBBBBBBA", "AAAAAAAAAAAA", "A..A..A..A."] },
      { x: 42, y: 5, rows: ["PPPPPPPPPPPPPP", "PBIBIBIBIBIBBP", "PBSBSBSBSBSBBP", "PBIBIBIBIBIBBP", "PPPPPPPPPPPPPP"] },
      { x: 7, y: 19, rows: ["..S..", ".SSS.", "SSWSS", ".SSS.", "..N.."] },
      { x: 0, y: 27, rows: ["B".repeat(64), "B".repeat(64), "P".repeat(64), "P".repeat(64)] }
    ])
  ),
  flooring: asset("발광 격자 바닥", "Glowing grid floor", compose(64, 9, "I", [
    { x: 0, y: 0, rows: ["T".repeat(64)] },
    { x: 0, y: 3, rows: ["B".repeat(64)] },
    { x: 0, y: 6, rows: ["B".repeat(64)] },
    { x: 13, y: 1, rows: ["B", "B"] },
    { x: 35, y: 4, rows: ["B", "B"] },
    { x: 55, y: 7, rows: ["B"] },
    { x: 0, y: 8, rows: ["P".repeat(64)] }
  ])),
  // 인베이더 다섯 무리 + 점수바 + 함선 — 마크가 드문드문하면 얼굴로 읽힌다
  window: asset("인베이더 스크린", "Invader screen", ["....NNNNNNNN....", "..NNCCCCCCCCNN..", ".NCAACCCCCCCCCN.", "NCGCGCGCGCGCGCCN", "NCGGGCGGGCGGGCCN", "NCCCCCCCCCCCCCCN", "NCCCGCGCGCGCCCCN", "NCCCGGGCGGGCCCCN", ".NCCACCCCCCCCCN.", "..NNAAACCCCCNN..", "....NNNNNNNN....", "......BBBB......"]),
  desk: asset("아케이드 조작 패널 책상", "Arcade control-panel desk", compose(56, 8, ".", [
    { x: 1, y: 0, rows: ["N".repeat(54)] },
    { x: 0, y: 1, rows: ["B".repeat(56)] },
    { x: 4, y: 2, rows: ["A..S..A..S..A..S..A..S..A..S..A..S..A..S"] },
    { x: 5, y: 3, rows: ["NIN", "NIN", "NIN", "NIN", "NIN"] },
    { x: 48, y: 3, rows: ["NIN", "NIN", "NIN", "NIN", "NIN"] }
  ])),
  monitor: asset("보스전 와이드 스크린", "Boss-battle widescreen", [".GGGGGGGGGGGG.", "GIIIIIIIIIIIIG", "GIBBBBBBBBBBIG", "GIBPPGGPPGBBIG", "GIBGGAAGGBBBIG", "GIBPPGGPPGBBIG", "GIBBBBBBBBBBIG", ".GGGGGGGGGGGG.", ".....GNG......", "...GGGGGGGG..."]),
  mug: asset("코인 슬롯 컵", "Coin-slot cup", [".G.A..", ".GAA..", "GIIIIG", "GIAGGG", "GIIIIG", ".GGGG."]),
  ornament: asset("미니 집게기계", "Mini claw machine", [".GGGGG.", "GPPPPPG", "GPWAWPG", "GP.G.PG", "GPAAAPG", "GBBBBBG", "GIIIIIG", ".GGGGG."]),
  lamp: asset("픽셀 번개 조명", "Pixel lightning lamp", ["...A.", "..AA.", ".AA..", "AA...", ".AA..", "..AA.", "...A.", "...N.", "...N.", ".GNG.", "GNNNG", "GGGGG"]),
  mat: asset("방향키 매트", "D-pad mat", ["GIGGIGGI", "GIAGAIGG", "GGGGGGGG"]),
  shelf: asset("골드 코인 스택", "Gold coin stack", [".GAG.", "GIIIG", ".GAG.", "GGGGG"]),
  frame: asset("최고점수 포스터", "High-score poster", ["GGGGGG", "GPPPPG", "GPAAPG", "GPAAPG", "GPBBPG", "GPPPPG", "GGGGGG"]),
  clock: asset("타이머 게이지 시계", "Timer-gauge clock", [".BB.", "BWWB", "BAAB", ".GG."]),
  // 아랫단은 B 스커트 — 벽지 하단 P 밴드(y29~30)와 겹치지 않는다.
  pet: asset("픽셀 유령", "Pixel ghost", [".PPPP.", "PPPPPP", "PWPPWP", "PPPPPP", "BPPPPB", "BBBBBB", "B.BB.B"]),
  floorObject: asset("코인 교환기", "Token changer", ["..GG..", ".GPPG.", "GPIIPG", "GPAAPG", "GPIIPG", "GBBBBG", "GBBBBG", "GGGGGG"])
};

const HANOK_ART: LateThemeArtPack = {
  wallpaper: asset(
    "달빛 한옥 마당 벽지",
    "Moonlit hanok-courtyard wallpaper",
    compose(64, 31, "Y", [
      { x: 0, y: 0, rows: ["N".repeat(64)] },
      { x: 45, y: 3, rows: ["..WWW..", ".WWWWW.", "WWWWWWW", ".WWWWW.", "..WWW.."] },
      { x: 2, y: 7, rows: [".....RRRRRRRRRRRRRRRRRRRRRRRR.....", "...RRRRRRRRRRRRRRRRRRRRRRRRRRRR...", "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN", "NWWWWNWWWWNWWWWNWWWWNWWWWNWWWWN", "NGGGGNGGGGNGGGGNGGGGNGGGGNGGGGN", "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN"] },
      { x: 39, y: 17, rows: ["..G..", ".GGG.", "GGGGG", "..N..", "..N.."] },
      // 장독대 — 흰 덩어리 대신 옹기 두 개로, 찻잔(x12~) 열과 겹치지 않게 x5~11에 둔다
      { x: 5, y: 19, rows: [".NN..N.", "RRRR.RR", "RRRR.RR", "RRRR.RR", ".RR..RR"] },
      { x: 0, y: 27, rows: ["G".repeat(64), "G".repeat(64), "R".repeat(64), "C".repeat(64)] }
    ])
  ),
  flooring: asset("툇마루와 마당돌", "Porch and courtyard stones", compose(64, 9, "G", [
    { x: 0, y: 0, rows: ["C".repeat(64)] },
    { x: 17, y: 1, rows: Array.from({ length: 7 }, () => "N".repeat(31)) },
    { x: 17, y: 3, rows: ["R".repeat(31)] },
    { x: 17, y: 6, rows: ["R".repeat(31)] },
    { x: 3, y: 3, rows: [".YYYY.", "YYYYYY"] },
    { x: 52, y: 2, rows: [".YYYY.", "YYYYYY"] },
    { x: 0, y: 8, rows: ["Y".repeat(64)] }
  ])),
  window: asset("창호 격자문", "Lattice paper door", ["TTTTTTTTTTTTTTTT", "TWWWTWWWTWWWTWWT", "TWWWTWWWTWWWTWWT", "TTTTTTTTTTTTTTTT", "TWWWTWWWTWWWTWWT", "TWWWTWWWTWWWTWWT", "TTTTTTTTTTTTTTTT", "TWWWTWWWTWWWTWWT", "TWWWTWWWTWWWTWWT", "TTTTTTTTTTTTTTTT", "TTTTTTTTTTTTTTTT", "TTNNTT....TTNNTT"]),
  desk: asset("낮은 소반 책상", "Low soban desk", compose(56, 8, ".", [
    { x: 6, y: 0, rows: ["T".repeat(44)] },
    { x: 3, y: 1, rows: ["N".repeat(50)] },
    { x: 8, y: 2, rows: ["R".repeat(40)] },
    { x: 10, y: 3, rows: ["TNT", "TNT", "TNT", "TNT", "TTT"] },
    { x: 43, y: 3, rows: ["TNT", "TNT", "TNT", "TNT", "TTT"] }
  ])),
  monitor: asset("산수화 화면", "Ink-landscape screen", [".IIIIIIIIIIII.", "IWWWWWWWWWWWWI", "IWWWWWWWWWRRWI", "IWWWWNWWWWWWWI", "IWWWNNNWWNWWWI", "IWWNNNNNWNNWWI", "IWNNNNNNNNNNWI", ".IIIIIIIIIIII.", ".....INI......", "...IIIIIIII..."]),
  mug: asset("백자 찻잔", "White porcelain cup", [".E.E..", ".WWW..", "WWWWW.", "WWGWW.", "WWWWW.", ".NNN.."]),
  ornament: asset("매화 백자 화병", "Plum-blossom vase", [".R...R.", "RWR.RWR", ".G...G.", "..NNN..", "...N...", ".IWWWI.", ".IWGWI.", "..III.."]),
  lamp: asset("한지 사각등", "Hanji square lamp", ["IIIII", "IWWWI", "IWRWI", "IWWWI", "IIIII", "..N..", "..N..", "..N..", "..N..", ".INI.", "INNNI", "IIIII"]),
  mat: asset("보자기 조각 매트", "Patchwork bojagi mat", ["IGIIYIIG", "IGWWGWGI", "IIIIIIII"]),
  shelf: asset("청자 향로", "Celadon incense burner", ["..G..", ".GGG.", "IGGGI", "IIIII"]),
  frame: asset("산수화 족자", "Landscape scroll", ["IIIIII", "IWWWWI", "IWNNWI", "INGGNI", "IGWWGI", "IYYYYI", "IIIIII"]),
  clock: asset("단청 꽃 시계", "Dancheong flower clock", [".RR.", "RGGR", "RAAR", ".II."]),
  pet: asset("갓 쓴 마당냥이", "Courtyard cat in gat", [".III..", "IIIIII", "I.I...", "INNI..", "IWNW..", "INRN.I", "INNIII", ".I..I."]),
  floorObject: asset("장독대 항아리", "Courtyard crock", ["..II..", ".INNI.", "INNNNI", "INRNNI", "INNNNI", ".INNI.", "..II..", ".YYYY."])
};

const NIGHT_CITY_ART: LateThemeArtPack = {
  wallpaper: asset(
    "네온 고층도시 벽지",
    "Neon high-rise city wallpaper",
    compose(64, 31, "C", [
      { x: 0, y: 0, rows: ["I".repeat(64)] },
      { x: 3, y: 5, rows: ["PPPPPPPPPP", "PWPWPWPWPP", "PPPPPPPPPP", "PAPAPAPAPP", "PPPPPPPPPP", "PWPWPWPWPP", "PPPPPPPPPP", "PPPPPPPPPP", "PPPPPPPPPP", "PPPPPPPPPP", "PPPPPPPPPP", "PPPPPPPPPP", "PPPPPPPPPP", "PPPPPPPPPP", "PPPPPPPPPP", "PPPPPPPPPP", "PPPPPPPPPP", "PPPPPPPPPP", "PPPPPPPPPP", "PPPPPPPPPP", "PPPPPPPPPP", "PPPPPPPPPP"] },
      { x: 19, y: 9, rows: ["BBBBBBBBBBBBBB", "BSBSBSBSBSBSBB", "BBBBBBBBBBBBBB", "BWBWBWBWBWBWBB", "BBBBBBBBBBBBBB", "BBBBBBBBBBBBBB", "BBBBBBBBBBBBBB", "BBBBBBBBBBBBBB", "BBBBBBBBBBBBBB", "BBBBBBBBBBBBBB", "BBBBBBBBBBBBBB", "BBBBBBBBBBBBBB", "BBBBBBBBBBBBBB", "BBBBBBBBBBBBBB", "BBBBBBBBBBBBBB", "BBBBBBBBBBBBBB", "BBBBBBBBBBBBBB", "BBBBBBBBBBBBBB"] },
      { x: 40, y: 3, rows: ["AAAAAAAAAAAAAAAAAAAA", "AIWIAIWIAIWIAIWIAIIA", "AAAAAAAAAAAAAAAAAAAA", "ASIASIASIASIASIASIIA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAA"] },
      { x: 0, y: 28, rows: ["B".repeat(64), "S".repeat(64), "C".repeat(64)] }
    ])
  ),
  flooring: asset("젖은 네온 아스팔트", "Wet neon asphalt", compose(64, 9, "I", [
    { x: 0, y: 0, rows: ["C".repeat(64)] },
    { x: 6, y: 2, rows: ["PPPPPPPPPPPP", ".BBBBBBBBBB."] },
    { x: 29, y: 5, rows: ["SSSSSSSSSSSSSSSS", ".BBBBBBBBBBBBBB."] },
    { x: 52, y: 2, rows: ["AAAAAAAAA", ".BBBBBBB."] },
    { x: 0, y: 8, rows: ["B".repeat(64)] }
  ])),
  window: asset("전철 파노라마 창", "Metro panorama window", ["....NNNNNNNN....", "..NNIIIIIIIINN..", ".NIIIIIIIIIIIIN.", "NIIIIPPPPIIIIIIN", "NIIIPWPWPIIIIIIN", "NIIIIPPPPIIIIIIN", "NIIIBBBBIIIIIIIN", "NIIIBWBWIIIIIIIN", ".NIIIIIIIIIIIIN.", "..NNIIIIIIIINN..", "....NNNNNNNN....", "......BBBB......"]),
  desk: asset("야간 관제 콘솔", "Night traffic-control console", compose(56, 8, ".", [
    { x: 0, y: 0, rows: ["N".repeat(56)] },
    { x: 2, y: 1, rows: ["M".repeat(52)] },
    { x: 5, y: 2, rows: ["S..G..S..G..S..G..S..G..S..G..S..G..S..G"] },
    { x: 6, y: 3, rows: ["NIN", "NIN", "NIN", "NIN", "NIN"] },
    { x: 47, y: 3, rows: ["NIN", "NIN", "NIN", "NIN", "NIN"] }
  ])),
  monitor: asset("실시간 지하철 노선도", "Live metro map", [".TTTTTTTTTTTT.", "TIIIIIIIIIIIIT", ".TIPPPPPPPPPPT", ".TIPTPTPTPTPIT", ".TIBBBBSBBBBIT", ".TIBIBIBIBIBIT", ".TIAAAAPAAAAIT", ".TTTTTTTTTTTT.", ".....TNT......", "...TTTTTTTT..."]),
  mug: asset("네온 테이크아웃컵", "Neon takeaway cup", [".TTTT.", ".TPPT.", "TPPPPT", "TPSPPT", "TPPPPT", ".TTTT."]),
  ornament: asset("미니 택시 모형", "Mini taxi model", [".......", "..TTT..", ".TAAAT.", "TAAAAAT", "TBBBBBT", ".T.T.T.", "T...T..", "......."]),
  lamp: asset("신호등 스탠드", "Traffic-light stand", [".TTT.", "TPPPT", "TAAAT", "TSSST", ".TTT.", "..N..", "..N..", "..N..", "..N..", ".TNT.", "TNNNT", "TTTTT"]),
  mat: asset("횡단보도 매트", "Crosswalk mat", ["TWTIWTIW", "TWTIWTIW", "TTTTTTTT"]),
  shelf: asset("도시 교통카드", "City transit card", ["TTTTT", "TBBBT", "TBABT", "TTTTT"]),
  frame: asset("야경 노선 포스터", "Night-route poster", ["TTTTTT", "TIIIIT", "TIPPIT", "TIBSIT", "TIABIT", "TIIIIT", "TTTTTT"]),
  clock: asset("역 전광판 시계", "Station-board clock", ["TTTT", "TPPT", "TSAT", "TTTT"]),
  pet: asset("네온 검정냥이", "Neon black cat", ["T.T...", "TBPT..", "TWTW..", "TPRP..", "TPPT.T", "TPPTTT", ".T..T.", "..TT.."]),
  floorObject: asset("도시 배달가방", "City delivery bag", ["..TT..", ".T..T.", "TBBBBT", "TBTTBT", "TBASBT", "TBBBBT", "TTTTTT", ".PPPP."])
};

// 1.0.13 온천 테마 — PIXEL-THEME-ONSEN-PLAN.md 기준.
// 팔레트: Q(온천 세이지 벽) · N(히노키) · E(김·안개) · K(물) · W(우유병·수건·설산) · A(바가지·초롱).
const ONSEN_ART: LateThemeArtPack = {
  wallpaper: asset(
    "안개 낀 욕장 벽지",
    "Misty bathhouse wallpaper",
    compose(64, 31, "Q", [
      { x: 0, y: 0, rows: ["N".repeat(64)] },
      // 허리 타일 밴드 — 책상 위로 보이는 하단 벽
      { x: 0, y: 19, rows: ["H".repeat(64), "E".repeat(64), "E".repeat(64), "K".repeat(64), "E".repeat(64)] },
      // 남색 노렌 — 선반(x26~38)과 액자(x44~) 사이 상단 벽에 늘어뜨린다
      {
        x: 39,
        y: 1,
        rows: ["IIIII", "IIIII", "II.II", "II.II", "IW.II", "II.II", "II.II"]
      },
      // 김 두 가닥 — 창문과 모니터 사이 좁은 벽
      { x: 22, y: 11, rows: ["H.", "H.", ".H", ".H", "H."] },
      { x: 23, y: 17, rows: [".H", "H.", "H."] },
      // 대나무 스텐실
      { x: 50, y: 12, rows: ["T.T", "T.T", "C.C", "T.T", "T.T", "C.C", "T.T"] }
    ])
  ),
  flooring: asset(
    "히노키 욕장 바닥",
    "Hinoki bath floor",
    compose(64, 9, "N", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      { x: 0, y: 3, rows: ["R".repeat(64)] },
      { x: 0, y: 6, rows: ["R".repeat(64)] },
      { x: 20, y: 1, rows: ["R", "R"] },
      { x: 44, y: 4, rows: ["R", "R"] },
      // 흰 발수건 매트
      { x: 8, y: 4, rows: ["WWWWWWWWWW", "EWWEWWEWWE", "WWWWWWWWWW"] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  window: asset("김 서린 창", "Steamed-up window", [
    "NNNNNNNNNNNNNNNN",
    "NEEEEEEEEEEEEEEN",
    "NEEEEEEEEEEEEEEN",
    "NEEKKEEEEEEEEEEN",
    "NEKKKKEEEEEEEEEN",
    "NEEKKEEEEEEEEEEN",
    "NEEEEEEEKKKEEEEN",
    "NEEEEEEKKKKKEEEN",
    "NEEEEEEEKKKEEEEN",
    "NEEEEEEEEEEEEEEN",
    "NNNNNNNNNNNNNNNN",
    "..NN........NN.."
  ]),
  desk: asset(
    "히노키 평상 책상",
    "Hinoki bench desk",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["H".repeat(54)] },
      { x: 0, y: 1, rows: ["N".repeat(56), "N".repeat(56)] },
      { x: 3, y: 3, rows: ["C".repeat(50)] },
      { x: 4, y: 4, rows: ["NNN", "NCN", "NCN", "NNN"] },
      { x: 49, y: 4, rows: ["NNN", "NCN", "NCN", "NNN"] }
    ])
  ),
  monitor: asset("탕 안내판 모니터", "Bath-sign monitor", [
    ".NNNNNNNNNNNN.",
    "NIIIIIIIIIIIIN",
    "NIIIEIEIEIIIIN",
    "NIIIEIEIEIIIIN",
    "NIIEIIIIIEIIIN",
    "NIIIEEEEEIIIIN",
    "NIIIIIIIIIIIIN",
    ".NNNNNNNNNNNN.",
    "......NN......",
    "....NNNNNN...."
  ]),
  mug: asset("목욕탕 우유병", "Bathhouse milk bottle", [
    "..KK..",
    "..WW..",
    ".WWWW.",
    ".WHWW.",
    ".WWWW.",
    ".WWWW."
  ]),
  ornament: asset("대나무 화분", "Bamboo planter", [
    ".T..T..",
    ".TC.TT.",
    ".T..T..",
    ".TT.TC.",
    ".T..T..",
    ".NNNNN.",
    ".NNNNN.",
    "..NNN.."
  ]),
  lamp: asset("종이 초롱 스탠드", "Paper-lantern lamp", [
    "..C..",
    ".EEE.",
    "EAAAE",
    "EAAAE",
    ".EEE.",
    "..C..",
    "..C..",
    "..C..",
    "..C..",
    "..C..",
    ".CCC.",
    "NNNNN"
  ]),
  mat: asset("대나무 발 매트", "Bamboo-blind mat", ["TTTTTTTT", "NNCNNCNN", "TTTTTTTT"]),
  shelf: asset("노란 바가지와 수건", "Yellow basin and towel", [".AAA.", "AAAAA", "WWWWW", "CCCCC"]),
  frame: asset("후지산 벽화", "Fuji mural", [
    "CCCCCC",
    "CKKKKC",
    "CKWWKC",
    "CIWWIC",
    "CIIIIC",
    "CIIIIC",
    "CCCCCC"
  ]),
  clock: asset("탕 마크 시계", "Bath-mark clock", [".NN.", "NWWN", "NWCN", ".NN."]),
  // 몸통은 O(오커) — 히노키 책상(N)과 한 덩어리로 보이지 않게 분리한다.
  pet: asset("수건 카피바라", "Towel capybara", [
    "WWWW..",
    "OOOOO.",
    "OCOSO.",
    "EOOOOO",
    "OOOOOO",
    "OOOOOO",
    "OOOOOO",
    ".O..O."
  ]),
  floorObject: asset("나무 목욕통", "Wooden bath tub", [
    ".E..E.",
    "..E...",
    "CKKKKC",
    "CNNNNC",
    "CNNNNC",
    "CNNNNC",
    "CNNNNC",
    ".NNNN."
  ])
};

// 1.0.13 코인 런드리 테마 — 자취방 옆 세탁방의 리셋 감성.
// 팔레트: U(세탁 파우더블루 벽) · W(세탁기·거품) · I(스틸) · K(물·세제) · E(타일) · A(러버덕·동전).
const LAUNDRY_ART: LateThemeArtPack = {
  wallpaper: asset(
    "비눗방울 타일 벽지",
    "Soap-bubble tile wallpaper",
    compose(64, 31, "U", [
      { x: 0, y: 0, rows: ["W".repeat(64)] },
      // 옷걸이에 걸린 줄무늬 수건 — 선반과 액자 사이 상단 벽
      { x: 39, y: 1, rows: ["..C..", ".CCC.", "WWWWW", "WWWWW", "KKKKK", "WWWWW"] },
      // 떠다니는 비눗방울들
      { x: 1, y: 2, rows: [".WW.", "W..H", "W..W", ".WW."] },
      { x: 22, y: 3, rows: ["WW", "WH"] },
      { x: 21, y: 6, rows: ["WW", "HW"] },
      { x: 22, y: 12, rows: ["WW", "HW"] },
      { x: 50, y: 13, rows: ["WW.", "WW."] },
      { x: 51, y: 16, rows: [".WW", ".WW"] },
      // 욕실 타일 밴드 — 파랑 보더와 체커 줄
      {
        x: 0,
        y: 19,
        rows: ["K".repeat(64), "E".repeat(64), "E".repeat(64), "KE".repeat(32), "E".repeat(64)]
      }
    ])
  ),
  flooring: asset(
    "물빛 타일 바닥",
    "Water-tile floor",
    compose(64, 9, "E", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      { x: 0, y: 3, rows: ["W".repeat(64)] },
      { x: 0, y: 6, rows: ["W".repeat(64)] },
      { x: 20, y: 1, rows: ["W", "W"] },
      { x: 44, y: 4, rows: ["W", "W"] },
      { x: 10, y: 7, rows: ["H"] },
      { x: 50, y: 2, rows: ["H"] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  window: asset("빨랫줄 창문", "Clothesline window", [
    "IIIIIIIIIIIIIIII",
    "IKKKKKKKKKKKKKKI",
    "ICCCCCCCCCCCCCCI",
    "IKWWKTTKSSKKKKKI",
    "IKWWKTTKSSKKKKKI",
    "IKKKKKKKKKKKKKKI",
    "IKKKKKKKKKWWKKKI",
    "IKKKKKKKKWWWWKKI",
    "IKKKKKKKKKKKKKKI",
    "IKKKKKKKKKKKKKKI",
    "IIIIIIIIIIIIIIII",
    "..II........II.."
  ]),
  desk: asset(
    "스틸 접이 테이블",
    "Steel folding table",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["H".repeat(54)] },
      { x: 0, y: 1, rows: ["I".repeat(56), "I".repeat(56)] },
      { x: 3, y: 3, rows: ["C".repeat(50)] },
      { x: 4, y: 4, rows: ["III", "ICI", "ICI", "III"] },
      { x: 49, y: 4, rows: ["III", "ICI", "ICI", "III"] }
    ])
  ),
  monitor: asset("드럼 세탁기 모니터", "Drum-washer monitor", [
    ".WWWWWWWWWWWW.",
    "WEEEEEEEEEEKAW",
    "WWWIIIIIIWWWWW",
    "WWIKWKWKKIWWWW",
    "WWIKKKKKKIWWWW",
    "WWIKWKKWKIWWWW",
    "WWWIIIIIIWWWWW",
    ".WWWWWWWWWWWW.",
    "......CC......",
    "....CCCCCC...."
  ]),
  mug: asset("계량컵 세제", "Detergent measuring cup", [
    ".W.W..",
    "WKKKW.",
    "WKKKW.",
    "WIIIW.",
    "WWWWW."
  ]),
  ornament: asset("빨래 바구니", "Laundry basket", [
    "..T.S..",
    ".TT.SS.",
    "PPPPPPP",
    "PCPCPCP",
    "PPPPPPP",
    "PCPCPCP",
    "PPPPPPP"
  ]),
  lamp: asset("형광등 스탠드", "Fluorescent stand", [
    "WWWWW",
    "HHHHH",
    "..I..",
    "..I..",
    "..I..",
    "..I..",
    "..I..",
    "..I..",
    "..I..",
    "..I..",
    ".III.",
    "IIIII"
  ]),
  mat: asset("파랑 체크 발매트", "Blue check foot mat", ["KWKWKWKW", "WKWKWKWK", "KWKWKWKW"]),
  shelf: asset("세제 콤비", "Detergent duo", ["WW.WW", "II.TT", "II.TT", "CCCCC"]),
  frame: asset("세탁 안내 액자", "Washing-guide frame", [
    "CCCCCC",
    "CWWWWC",
    "CTTTTC",
    "CWTTWC",
    "CWTTWC",
    "CCCCCC"
  ]),
  clock: asset("세탁 타이머", "Wash timer", [".CC.", "CWWC", "CWAC", ".CC."]),
  // 눈 행은 y26(책상 상판 I 위), 부리 행은 y27(그림자 C 위)라 C 눈·S 부리가 배경과 분리된다.
  pet: asset("비눗방울 오리", "Bubble duck", [
    ".W....",
    "..AA..",
    ".AACA.",
    "SSAAA.",
    ".AAAAA",
    ".AAAAA",
    "..AAA.",
    "..A.A."
  ]),
  floorObject: asset("거품 빨래통", "Sudsy wash bucket", [
    ".W..W.",
    "WWWWWW",
    "CCCCCC",
    "IIIIII",
    "IIIIII",
    "IIIIII",
    "IIIIII",
    ".IIII."
  ])
};

// 1.0.13 할로윈 테마 — 크리스마스와 짝을 이루는 시즈널 세트.
// 팔레트: X(마녀 자두빛 벽) · C(실루엣) · R(고택 나무) · S(호박) · M(거미줄·보라) · A(달·촛불).
const HALLOWEEN_ART: LateThemeArtPack = {
  wallpaper: asset(
    "박쥐 나는 밤 벽지",
    "Bat-flight night wallpaper",
    compose(64, 31, "X", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      // 보름달 — 선반과 액자 사이 상단 벽
      { x: 39, y: 1, rows: [".AAA.", "AAAAA", "AAWAA", "AAAAA", ".AAA."] },
      // 박쥐들 — 창문 위와 좁은 벽
      { x: 9, y: 1, rows: ["C...C", "CCCCC"] },
      { x: 21, y: 5, rows: ["C.C", "CCC"] },
      { x: 22, y: 12, rows: ["C.C", "CCC"] },
      // 대롱대롱 거미 — 오른쪽 상단 벽
      { x: 51, y: 1, rows: ["M.", "M.", "M.", "CC", "CC"] },
      // 반짝이 별 스텐실
      { x: 50, y: 13, rows: [".W.", "WWW", ".W."] },
      // 고택 웨인스코팅 밴드
      {
        x: 0,
        y: 19,
        rows: ["C".repeat(64), "R".repeat(64), "R".repeat(64), "R".repeat(64), "C".repeat(64)]
      }
    ])
  ),
  flooring: asset(
    "삐걱대는 마루",
    "Creaky plank floor",
    compose(64, 9, "R", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      { x: 0, y: 3, rows: ["C".repeat(64)] },
      { x: 0, y: 6, rows: ["C".repeat(64)] },
      { x: 14, y: 1, rows: ["C", "C"] },
      { x: 38, y: 4, rows: ["C", "C"] },
      { x: 52, y: 7, rows: ["C"] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  window: asset("보름달 밤 창문", "Full-moon night window", [
    "NNNNNNNNNNNNNNNN",
    "NIIIIIIIIIIIIIIN",
    "NIIAAAIIIIIIWIIN",
    "NIAAAAAIIIIIIIIN",
    "NIAAWAAIIIIIIIIN",
    "NIIAAAIIICICIIIN",
    "NIIIIIIIICCCIIIN",
    "NIWIIIIIIIIIIIIN",
    "NIIIWIIIIIIIIIIN",
    "NIIIIIIIIIIIIIIN",
    "NNNNNNNNNNNNNNNN",
    "..NN........NN.."
  ]),
  desk: asset(
    "고택 나무 책상",
    "Old-manor wooden desk",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["H".repeat(54)] },
      { x: 0, y: 1, rows: ["R".repeat(56), "R".repeat(56)] },
      { x: 3, y: 3, rows: ["C".repeat(50)] },
      { x: 4, y: 4, rows: ["RRR", "RCR", "RCR", "RRR"] },
      { x: 49, y: 4, rows: ["RRR", "RCR", "RCR", "RRR"] }
    ])
  ),
  monitor: asset("유령 마법서 모니터", "Ghost-grimoire monitor", [
    ".MMMMMMMMMMMM.",
    "MIIIIIIIIIIIIM",
    "MIIIWWWIIIIIIM",
    "MIIWWWWWIIIIIM",
    "MIIWCWCWIIIIIM",
    "MIIWWWWWIIIIIM",
    "MIIWIWIWIIIIIM",
    ".MMMMMMMMMMMM.",
    "......MM......",
    "....MMMMMM...."
  ]),
  mug: asset("초록 물약 병", "Green potion flask", [
    ".T....",
    "..EE..",
    "..EE..",
    ".ETTE.",
    "ETTTTE",
    ".EEEE."
  ]),
  ornament: asset("잭오랜턴", "Jack-o'-lantern", [
    "...G...",
    ".SSSSS.",
    "SSCSCSS",
    "SSSSSSS",
    "SCAAACS",
    ".SSSSS."
  ]),
  lamp: asset("촛불 스탠드", "Candle stand", [
    "..A..",
    "..A..",
    ".WWW.",
    ".WWW.",
    ".WWW.",
    "..M..",
    "..M..",
    "..M..",
    "..M..",
    "..M..",
    ".MMM.",
    "MMMMM"
  ]),
  mat: asset("캔디콘 매트", "Candy-corn mat", ["WWWWWWWW", "SSSSSSSS", "WWWWWWWW"]),
  shelf: asset("물약병 선반", "Potion-bottle shelf", ["N.N.N", "T.G.M", "T.G.M", "CCCCC"]),
  frame: asset("묘비 그림", "Tombstone picture", [
    "CCCCCC",
    "CMMMMC",
    "CMWWMC",
    "CMWWMC",
    "CWWWWC",
    "CCCCCC"
  ]),
  clock: asset("박쥐 시계", "Bat clock", ["C..C", "CCCC", "CWWC", ".CC."]),
  // 눈 행은 y26(책상 상판 R 위)라 C 눈이 그림자 행(y27)과 겹치지 않는다.
  pet: asset("꼬마 유령", "Little ghost", [
    ".WWW..",
    "WWWWW.",
    "WCWCW.",
    "WWWWW.",
    "WWCWW.",
    "WWWWW.",
    "WWWWW.",
    "W.W.W."
  ]),
  floorObject: asset("사탕 호박 바구니", "Candy pumpkin pail", [
    ".WPT..",
    ".SSSS.",
    "SSSSSS",
    "SCSSCS",
    "SSCCSS",
    ".SSSS."
  ])
};

// 1.0.14 목장 테마 — 아침 목초지와 헛간.
// 팔레트: D(목장 라임 벽) · N(나무) · R(헛간 레드) · W(울타리·우유) · A(병아리·해바라기) · Y(건초) · G(풀).
const FARM_ART: LateThemeArtPack = {
  wallpaper: asset(
    "아침 목초지 벽지",
    "Morning meadow wallpaper",
    compose(64, 31, "D", [
      { x: 0, y: 0, rows: ["N".repeat(64)] },
      // 노른자 해 — 선반과 액자 사이 상단 벽
      { x: 39, y: 1, rows: [".AAA.", "AAAAA", "AAAAA", ".AAA."] },
      // 구름들
      { x: 1, y: 2, rows: [".WWW", "WWWW"] },
      { x: 21, y: 4, rows: ["WW.", "WWW"] },
      { x: 22, y: 12, rows: ["W.", "WW"] },
      // 해바라기 한 송이 — 오른쪽 벽
      { x: 50, y: 12, rows: [".A.", "ANA", ".A.", ".G.", ".G."] },
      // 흰 울타리 밴드와 풀밭
      { x: 0, y: 19, rows: ["W".repeat(64), "W..".repeat(21) + "W", "W".repeat(64), "G".repeat(64), "G".repeat(64)] }
    ])
  ),
  flooring: asset(
    "마당 흙길",
    "Farmyard dirt path",
    compose(64, 9, "Y", [
      { x: 0, y: 0, rows: ["G".repeat(64)] },
      { x: 0, y: 3, rows: ["N".repeat(64)] },
      { x: 0, y: 6, rows: ["N".repeat(64)] },
      { x: 18, y: 1, rows: ["N", "N"] },
      { x: 42, y: 4, rows: ["N", "N"] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  window: asset("목초지 헛간 창", "Barn meadow window", [
    "RRRRRRRRRRRRRRRR",
    "RKKKKKKKKKKKKKKR",
    "RKKKWWKKKKKKKKKR",
    "RKKKKKKKKKWWKKKR",
    "RKKKKKKKKKKKKKKR",
    "RKKGGKKKKKKKKKKR",
    "RGGGGGGKKGGGGGGR",
    "RGGGGGGGGGGGGGGR",
    "RGGWGGGGGGGWGGGR",
    "RGGGGGGGGGGGGGGR",
    "RRRRRRRRRRRRRRRR",
    "..RR........RR.."
  ]),
  desk: asset(
    "농장 작업대",
    "Farm workbench",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["H".repeat(54)] },
      { x: 0, y: 1, rows: ["N".repeat(56), "N".repeat(56)] },
      { x: 3, y: 3, rows: ["C".repeat(50)] },
      { x: 4, y: 4, rows: ["NNN", "NCN", "NCN", "NNN"] },
      { x: 49, y: 4, rows: ["NNN", "NCN", "NCN", "NNN"] }
    ])
  ),
  monitor: asset("해바라기 화면", "Sunflower screen", [
    ".NNNNNNNNNNNN.",
    "NIIIIIIIIIIIIN",
    "NIIIAAIIIIIIIN",
    "NIIAANAAIIWIIN",
    "NIIIAAIIIIIIIN",
    "NIIIIGIIIIIIIN",
    "NIIIGGGIIIIIIN",
    ".NNNNNNNNNNNN.",
    "......NN......",
    "....NNNNNN...."
  ]),
  mug: asset("법랑 우유컵", "Enamel milk cup", [
    "EEEEE.",
    "EWWWE.",
    "EWWWEE",
    "EWWWE.",
    "EEEEE."
  ]),
  ornament: asset("건초 롤", "Hay roll", [
    ".YYYY.",
    "YYYYYY",
    "YYNNYY",
    "YYNNYY",
    "YYYYYY",
    ".YYYY."
  ]),
  lamp: asset("수탉 풍향계", "Rooster weathervane", [
    "..S..",
    ".AAA.",
    "AAAAA",
    "..N..",
    "..N..",
    "..N..",
    "..N..",
    "..N..",
    "..N..",
    "..N..",
    ".NNN.",
    "NNNNN"
  ]),
  mat: asset("깅엄 소풍보", "Gingham picnic cloth", ["RWRWRWRW", "WRWRWRWR", "RWRWRWRW"]),
  shelf: asset("달걀 바구니", "Egg basket", [".WWW.", "NWWWN", ".NNN."]),
  frame: asset("젖소 그림", "Cow picture", [
    "CCCCCC",
    "CWWWWC",
    "CCWWCC",
    "CWWWWC",
    "CPPPPC",
    "CCCCCC"
  ]),
  clock: asset("달걀 시계", "Egg clock", [".WW.", "WAAW", "WCAW", ".WW."]),
  // 눈 행은 y26(작업대 상판 N 위), 부리 행은 y27(그림자 C 위)라 배경과 분리된다.
  pet: asset("노랑 병아리", "Yellow chick", [
    ".AAA..",
    "AAAAA.",
    "ACACA.",
    "AASAA.",
    "AAAAA.",
    "AAAAA.",
    ".AAA..",
    ".S.S.."
  ]),
  floorObject: asset("우유 캔", "Milk churn", [
    "..EE..",
    ".EEEE.",
    "EEEEEE",
    "CEEEEC",
    "EWWWWE",
    "EEEEEE",
    "EEEEEE",
    ".EEEE."
  ])
};

// 1.0.14 유원지 테마 — 솜사탕빛 축제 저녁.
// 팔레트: F(솜사탕 핑크 벽) · M(보라 텐트) · S/W(스트라이프) · A(전구·별) · Y(크림) · P(솜사탕).
const FAIR_ART: LateThemeArtPack = {
  wallpaper: asset(
    "풍선 축제 벽지",
    "Balloon festival wallpaper",
    compose(64, 31, "F", [
      { x: 0, y: 0, rows: ["M".repeat(64)] },
      // 풍선 두 개 — 선반과 액자 사이 상단 벽
      { x: 39, y: 1, rows: ["WW.AA", "WW.AA", ".C.C.", "..C..", "..C.."] },
      // 깃발 가랜드 — 왼쪽 위와 좁은 벽
      { x: 1, y: 2, rows: ["CCCC", "MSMS"] },
      { x: 21, y: 3, rows: ["CCCC", "SMSM"] },
      // 솜사탕 구름 — 오른쪽 벽
      { x: 50, y: 12, rows: [".WW", "WWW", "WW.", ".C.", ".C."] },
      { x: 22, y: 12, rows: ["A.", ".A"] },
      // 서커스 텐트 자락 밴드
      {
        x: 0,
        y: 19,
        rows: ["C".repeat(64), "SSWW".repeat(16), "SSWW".repeat(16), "SSWW".repeat(16), "SSWW".repeat(16)]
      }
    ])
  ),
  flooring: asset(
    "축제 광장 바닥",
    "Fairground floor",
    compose(64, 9, "Y", [
      { x: 0, y: 0, rows: ["M".repeat(64)] },
      { x: 10, y: 2, rows: ["S"] },
      { x: 26, y: 5, rows: ["M"] },
      { x: 40, y: 3, rows: ["A"] },
      { x: 54, y: 6, rows: ["S"] },
      { x: 5, y: 6, rows: ["M"] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  window: asset("회전목마 창", "Carousel window", [
    "MMMMMMMMMMMMMMMM",
    "MKKKKKKKKKKKKKKM",
    "MKKSWSWSWSKKKKKM",
    "MKKKSWSWSKKKKKKM",
    "MKKKWKWKWKKKKKKM",
    "MKKKWKWKWKKKKKKM",
    "MKKKYYYYYKKKKKKM",
    "MKKKKKKKKKKKKKKM",
    "MKKAKKKKKKKAKKKM",
    "MKKKKKKKKKKKKKKM",
    "MMMMMMMMMMMMMMMM",
    "..MM........MM.."
  ]),
  desk: asset(
    "매표소 카운터",
    "Ticket-booth counter",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["H".repeat(54)] },
      { x: 0, y: 1, rows: ["W".repeat(56), "S".repeat(56)] },
      { x: 3, y: 3, rows: ["C".repeat(50)] },
      { x: 4, y: 4, rows: ["WWW", "WCW", "WCW", "WWW"] },
      { x: 49, y: 4, rows: ["WWW", "WCW", "WCW", "WWW"] }
    ])
  ),
  monitor: asset("축제 전광판", "Fair marquee screen", [
    ".MMMMMMMMMMMM.",
    "MCCCCCCCCCCCCM",
    "MCCCCACCCCCCCM",
    "MCCCAAACCCWCCM",
    "MCAAAAAAACCCCM",
    "MCCCAAACCCCCCM",
    "MCCACCCACCCCCM",
    ".MMMMMMMMMMMM.",
    "......MM......",
    "....MMMMMM...."
  ]),
  mug: asset("솜사탕", "Cotton candy", [
    ".PPP..",
    "PPPPP.",
    "PPPPP.",
    ".PPP..",
    "..Y..."
  ]),
  ornament: asset("회전목마 오르골", "Carousel music box", [
    "...A...",
    ".SSSSS.",
    ".SWSWS.",
    ".Y.Y.Y.",
    ".Y.Y.Y.",
    ".YYYYY.",
    ".MMMMM.",
    ".MMMMM."
  ]),
  lamp: asset("풍선 조명", "Balloon lamp", [
    ".AAA.",
    "AWAAA",
    "AAAAA",
    ".AAA.",
    "..M..",
    "..M..",
    "..M..",
    "..M..",
    "..M..",
    "..M..",
    ".MMM.",
    "MMMMM"
  ]),
  mat: asset("티켓 매트", "Ticket mat", ["YYYYYYYY", "YCCYYCCY", "YYYYYYYY"]),
  shelf: asset("곰인형 트로피", "Teddy trophy", [".N.N.", ".NNN.", ".NNN.", "CCCCC"]),
  frame: asset("서커스 포스터", "Circus poster", [
    "MMMMMM",
    "MYYYYM",
    "MYSSYM",
    "MSSSSM",
    "MYYYYM",
    "MMMMMM"
  ]),
  clock: asset("과녁 시계", "Bullseye clock", [".SS.", "SWWS", "SWCS", ".SS."]),
  // 눈 행은 y26(카운터 상판 S 위), 목 행은 y27(그림자 C 위)라 배경과 분리된다.
  pet: asset("풍선 강아지", "Balloon puppy", [
    "PP.PP.",
    "PPPPP.",
    "PCPPP.",
    ".PP...",
    ".PPPPP",
    ".PP.PP",
    ".PP.PP",
    ".P...P"
  ]),
  floorObject: asset("팝콘 카트", "Popcorn cart", [
    "SWSWSW",
    "SWSWSW",
    ".KWWK.",
    ".MMMM.",
    ".MMMM.",
    ".MMMM.",
    ".MMMM.",
    ".C..C."
  ])
};

// 1.0.14 사막 테마 — 사구와 오아시스의 대상 캠프.
// 팔레트: J(사막 샌드 벽) · Y(모래) · N(나무·낙타) · T(오아시스 청록) · S(테라코타) · A(해·램프) · G(야자).
const DESERT_ART: LateThemeArtPack = {
  wallpaper: asset(
    "사구 대상 벽지",
    "Dune caravan wallpaper",
    compose(64, 31, "J", [
      { x: 0, y: 0, rows: ["N".repeat(64)] },
      // 조각보 가랜드 — 선반과 액자 사이 상단 벽
      { x: 39, y: 1, rows: ["CCCCC", "TWTWT", "TWTWT", ".W.T."] },
      // 태양 — 왼쪽 위
      { x: 1, y: 1, rows: [".AA.", "AAAA", "AAAA", ".AA."] },
      // 미니 선인장 — 좁은 벽
      { x: 21, y: 12, rows: [".G.", ".GG", ".G.", "GG.", ".G."] },
      // 물항아리 — 오른쪽 벽
      { x: 50, y: 14, rows: [".T.", "TTT", "TTT", ".T."] },
      // 사구 지층 밴드
      {
        x: 0,
        y: 19,
        rows: ["S".repeat(64), "Y".repeat(64), "S".repeat(64), "Y".repeat(64), "N".repeat(64)]
      }
    ])
  ),
  flooring: asset(
    "물결 모래밭",
    "Rippled sand floor",
    compose(64, 9, "Y", [
      { x: 0, y: 0, rows: ["N".repeat(64)] },
      { x: 6, y: 2, rows: ["NNNNNNNN"] },
      { x: 30, y: 4, rows: ["NNNNNNNNNN"] },
      { x: 48, y: 6, rows: ["NNNNNNN"] },
      { x: 14, y: 6, rows: ["NNNNNN"] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  window: asset("오아시스 창", "Oasis window", [
    "NNNNNNNNNNNNNNNN",
    "NKKKKKKKKKKKKKKN",
    "NKKKKKAKKKKKKKKN",
    "NKKKKKKKKKGGGKKN",
    "NKKKKKKKKKKNKKKN",
    "NYYYYKKKKKKNKKKN",
    "NYYYYYYKKYYYYYYN",
    "NYYTTTTTYYYYYYYN",
    "NYYYTTTYYYYYYYYN",
    "NYYYYYYYYYYYYYYN",
    "NNNNNNNNNNNNNNNN",
    "..NN........NN.."
  ]),
  desk: asset(
    "대상 나무 좌탁",
    "Caravan low table",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["H".repeat(54)] },
      { x: 0, y: 1, rows: ["N".repeat(56), "N".repeat(56)] },
      { x: 3, y: 3, rows: ["C".repeat(50)] },
      { x: 4, y: 4, rows: ["NNN", "NCN", "NCN", "CCC"] },
      { x: 49, y: 4, rows: ["NNN", "NCN", "NCN", "CCC"] }
    ])
  ),
  monitor: asset("대상 지도 화면", "Caravan map screen", [
    ".TTTTTTTTTTTT.",
    "TYYYYYYYYYYYYT",
    "TYYYYYYYYSYYYT",
    "TYNYNYNYYYYYYT",
    "TYYYYYNYYYYYYT",
    "TYYGYYYNYNYYYT",
    "TYYYYYYYYYYYYT",
    ".TTTTTTTTTTTT.",
    "......TT......",
    "....TTTTTT...."
  ]),
  mug: asset("선인장 화분", "Potted cactus", [
    ".G.G..",
    ".GGG..",
    "..G...",
    ".SSS..",
    ".SSS.."
  ]),
  ornament: asset("낙타 인형", "Camel doll", [
    "NN.N.N.",
    "NWNNNNN",
    ".NSSNN.",
    ".NNNNN.",
    ".C..C..",
    ".C..C.."
  ]),
  lamp: asset("요술 램프", "Genie lamp", [
    "..W..",
    ".W...",
    "..W..",
    ".AAA.",
    "AAAAA",
    "AAAAA",
    "AAAAA",
    ".AAA.",
    "..N..",
    "..N..",
    ".CCC.",
    "CCCCC"
  ]),
  mat: asset("페르시안 미니 러그", "Mini persian rug", ["TTTTTTTT", "TSWSSWST", "TTTTTTTT"]),
  shelf: asset("모래시계", "Hourglass", ["WWWWW", ".YYY.", "..Y..", "WWWWW"]),
  frame: asset("피라미드 그림", "Pyramid picture", [
    "CCCCCC",
    "CKKKAC",
    "CKYYKC",
    "CYYYYC",
    "CYYYYC",
    "CCCCCC"
  ]),
  clock: asset("나침반 시계", "Compass clock", [".NN.", "NWWN", "NWSN", ".NN."]),
  // 눈 행은 y26(좌탁 상판 N 위), 코 행은 y28이라 그림자(y27)와 겹치지 않는다.
  pet: asset("사막여우", "Fennec fox", [
    "YY.YY.",
    "YYYYY.",
    "YCYCY.",
    "YWWWY.",
    "YWCWY.",
    "YYYYY.",
    "YYYYWW",
    ".Y.Y.."
  ]),
  floorObject: asset("오아시스 항아리", "Oasis water jar", [
    ".G..G.",
    ".GGGG.",
    ".TTTT.",
    "TTTTTT",
    "TWTTTT",
    "TTTTTT",
    ".TTTT.",
    "..CC.."
  ])
};

// 1.0.14 정글 테마 — 폭포와 캐노피 그늘.
// 팔레트: V(정글 그린 벽) · G(잎) · N(나무·늘보) · T(짙은 잎) · K(폭포) · A(바나나·불) · S(열대꽃).
const JUNGLE_ART: LateThemeArtPack = {
  wallpaper: asset(
    "캐노피 덩굴 벽지",
    "Canopy vine wallpaper",
    compose(64, 31, "V", [
      { x: 0, y: 0, rows: ["G".repeat(64)] },
      // 늘어진 덩굴 — 선반과 액자 사이 상단 벽
      { x: 39, y: 1, rows: ["G.G.G", "G.G.G", ".G.G.", ".S.G.", "...S."] },
      // 앵무새 실루엣 — 왼쪽 위
      { x: 1, y: 2, rows: [".SS", "SSS", ".S."] },
      // 대나무 줄기 — 좁은 벽
      { x: 22, y: 11, rows: ["G.", "G.", ".G", ".G", "G."] },
      // 열대꽃 — 오른쪽 벽
      { x: 50, y: 13, rows: [".S.", "SAS", ".S.", ".G.", ".G."] },
      // 수풀 밴드
      {
        x: 0,
        y: 19,
        rows: ["G".repeat(64), "T".repeat(64), "G".repeat(64), "T".repeat(64), "G".repeat(64)]
      }
    ])
  ),
  flooring: asset(
    "이끼 낀 흙바닥",
    "Mossy jungle floor",
    compose(64, 9, "N", [
      { x: 0, y: 0, rows: ["G".repeat(64)] },
      { x: 8, y: 2, rows: ["GG", ".G"] },
      { x: 33, y: 5, rows: ["G.", "GG"] },
      { x: 52, y: 2, rows: [".G", "GG"] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  window: asset("폭포 캐노피 창", "Waterfall canopy window", [
    "NNNNNNNNNNNNNNNN",
    "NGGGKKGGGGGGGGGN",
    "NGGGKKGGGGSGGGGN",
    "NGGGKKGGGGGGGGGN",
    "NGGGKKGGGGGGGGGN",
    "NGGGKKGGSGGGGGGN",
    "NGGGKKGGGGGGGGGN",
    "NGGKKKKGGGGGGGGN",
    "NGKKWKKKGGGGGGGN",
    "NGKKKKKKGGGGGGGN",
    "NNNNNNNNNNNNNNNN",
    "..NN........NN.."
  ]),
  desk: asset(
    "통나무 책상",
    "Log desk",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["H".repeat(54)] },
      { x: 0, y: 1, rows: ["N".repeat(56), "N".repeat(56)] },
      { x: 3, y: 3, rows: ["C".repeat(50)] },
      { x: 4, y: 4, rows: ["NNN", "NCN", "NCN", "NNN"] },
      { x: 49, y: 4, rows: ["NNN", "NCN", "NCN", "NNN"] }
    ])
  ),
  monitor: asset("열대 잎 화면", "Tropical-leaf screen", [
    ".NNNNNNNNNNNN.",
    "NCCCCCCCCCCCCN",
    "NCCCGGCCCCCWCN",
    "NCCGGGGCCCCCCN",
    "NCGGGGGGCCCCCN",
    "NCCCGNGCCCCCCN",
    "NCCCCNCCCCCCCN",
    ".NNNNNNNNNNNN.",
    "......NN......",
    "....NNNNNN...."
  ]),
  mug: asset("코코넛 컵", "Coconut cup", [
    ".T....",
    "..T...",
    ".NNN..",
    "NWWWN.",
    "NWWWN.",
    ".NNN.."
  ]),
  ornament: asset("히비스커스 화분", "Hibiscus pot", [
    "..SSS..",
    ".SSASS.",
    "..SSS..",
    "..NNN..",
    ".NNNNN.",
    ".NNNNN."
  ]),
  lamp: asset("티키 횃불", "Tiki torch", [
    "..A..",
    ".AAA.",
    ".AAA.",
    "..N..",
    "..N..",
    "..N..",
    "..N..",
    "..N..",
    "..N..",
    "..N..",
    ".NNN.",
    "NNNNN"
  ]),
  mat: asset("바나나잎 매트", "Banana-leaf mat", ["GGGGGGGG", "GYGGYGGY", "GGGGGGGG"]),
  shelf: asset("바나나 송이", "Banana bunch", ["AA.AA", "AAAAA", ".AAA.", "..N.."]),
  frame: asset("앵무새 그림", "Parrot picture", [
    "CCCCCC",
    "CSSGGC",
    "CSSAGC",
    "CSSGGC",
    "CGSGGC",
    "CCCCCC"
  ]),
  clock: asset("잎사귀 시계", "Leaf clock", [".GG.", "GWWG", "GWCG", ".GG."]),
  // 눈 행은 y26(통나무 상판 N 위)이고 y27(그림자 C)에는 C를 쓰지 않는다.
  pet: asset("아기 나무늘보", "Baby sloth", [
    ".NNNN.",
    "NWWWW.",
    "NCWCW.",
    "NWWWWN",
    "NNNNNN",
    "NNNNNN",
    "NNNNNN",
    ".N..N."
  ]),
  floorObject: asset("나무 드럼", "Wooden drum", [
    "..YY..",
    ".YYYY.",
    ".YYYY.",
    "NNNNNN",
    "NCNNCN",
    "NNNNNN",
    "NCNNCN",
    ".NNNN."
  ])
};

// 1.0.14 탐정 테마 — 블라인드 너머 저녁의 사무소.
// 팔레트: Z(탐정 웜그레이 벽) · C(실루엣) · N(원목) · R(가죽) · Y(서류) · W(종이) · A(회중시계·가스등) · K(유리) · E(금고).
const DETECTIVE_ART: LateThemeArtPack = {
  wallpaper: asset(
    "단서 보드 벽지",
    "Clue board wallpaper",
    compose(64, 31, "Z", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      // 단서 게시판 — 선반과 액자 사이 상단 벽
      { x: 39, y: 1, rows: ["NNNNN", "NWYWN", "NYSWN", "NWYWN", "NNNNN"] },
      // 지문 소용돌이 — 왼쪽 위
      { x: 1, y: 2, rows: [".CCC", "CC.C", "C.CC", "CCC."] },
      // 걸린 중절모 — 좁은 벽
      { x: 21, y: 4, rows: [".CC.", "CCCC", "..N.", "..N."] },
      // 벽 가스등 — 오른쪽 벽
      { x: 50, y: 12, rows: [".A.", "AAA", ".A.", ".C.", ".C."] },
      // 웨인스코팅 밴드
      {
        x: 0,
        y: 19,
        rows: ["C".repeat(64), "N".repeat(64), "N".repeat(64), "N".repeat(64), "C".repeat(64)]
      }
    ])
  ),
  flooring: asset(
    "헤링본 마루",
    "Herringbone floor",
    compose(64, 9, "N", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      { x: 0, y: 3, rows: ["R".repeat(64)] },
      { x: 0, y: 6, rows: ["R".repeat(64)] },
      { x: 16, y: 1, rows: ["R", "R"] },
      { x: 40, y: 4, rows: ["N", "N"] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  window: asset("블라인드 창", "Blinds window", [
    "CCCCCCCCCCCCCCCC",
    "CWWWWWWWWWWWWWWC",
    "CEEEEEEEEEEEEEEC",
    "CWWWWWWWWWWWWWWC",
    "CEEEEEEEEEEEEEEC",
    "CWWWWWWWWWWWWWWC",
    "CEEEEEEEEEEEEEEC",
    "CWWWWWWWWWWWWWWC",
    "CEEEEEEEEEEEEEEC",
    "CWWWWWWWWWWWWWWC",
    "CCCCCCCCCCCCCCCC",
    "..CC........CC.."
  ]),
  desk: asset(
    "가죽 상판 책상",
    "Leather-top desk",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["R".repeat(54)] },
      { x: 0, y: 1, rows: ["N".repeat(56), "N".repeat(56)] },
      { x: 3, y: 3, rows: ["C".repeat(50)] },
      { x: 4, y: 4, rows: ["NNN", "NCN", "NCN", "NNN"] },
      { x: 49, y: 4, rows: ["NNN", "NCN", "NCN", "NNN"] }
    ])
  ),
  monitor: asset("단서 화면", "Evidence screen", [
    ".RRRRRRRRRRRR.",
    "RCCCCCCCCCCCCR",
    "RCWWWWCCCCCCCR",
    "RCWCCWCCCWWCCR",
    "RCWWWWCCCWWCCR",
    "RCCCCCYYYYCCCR",
    "RCCCCCCCCCCCCR",
    ".RRRRRRRRRRRR.",
    "......RR......",
    "....RRRRRR...."
  ]),
  mug: asset("홍차 잔", "Black-tea cup", [
    "..E...",
    ".E....",
    ".WWWW.",
    ".WNNWW",
    ".WWWW.",
    "WWWWWW"
  ]),
  ornament: asset("돋보기", "Magnifying glass", [
    "..AAA..",
    ".AKKKA.",
    ".AKWKA.",
    ".AKKKA.",
    "..AAA..",
    "....R..",
    ".....R."
  ]),
  lamp: asset("가스등 스탠드", "Gas-lamp stand", [
    "..C..",
    ".KKK.",
    ".KAK.",
    ".KAK.",
    ".KKK.",
    "..C..",
    "..R..",
    "..R..",
    "..R..",
    "..R..",
    ".RRR.",
    "RRRRR"
  ]),
  mat: asset("사건 서류 매트", "Case-file mat", ["YYYYYYYY", "YCCYCCYY", "YYYYYYYY"]),
  shelf: asset("사건 파일함", "Case file box", ["Y.Y.Y", "RRRRR", "RRRRR", "CCCCC"]),
  frame: asset("미제 사건 전단", "Cold-case flyer", [
    "CCCCCC",
    "CYCCYC",
    "CYYYCC",
    "CYYCYC",
    "CYYYYC",
    "CYYCYC",
    "CCCCCC"
  ]),
  clock: asset("회중시계", "Pocket watch", [".AA.", "AWWA", "AWCA", "..A."]),
  // 눈 행은 y26(책상 상판 N 위 — 귀는 R), 코 행은 y28이라 그림자(y27)와 겹치지 않는다.
  pet: asset("탐정 비글", "Detective beagle", [
    ".CCC..",
    "CCCCC.",
    "RCWCR.",
    "NWWWN.",
    "NWCWN.",
    "NNNNN.",
    "NNNNNN",
    ".N.N.."
  ]),
  floorObject: asset("미스터리 금고", "Mystery safe", [
    "EEEEEE",
    "EEEEEE",
    "EECCEE",
    "EECCEE",
    "EEEEEE",
    "EEAEEE",
    "EEEEEE",
    ".EEEE."
  ])
};

export const LATE_THEME_ART_109: Record<string, LateThemeArtPack> = {
  onsen: ONSEN_ART,
  laundry: LAUNDRY_ART,
  halloween: HALLOWEEN_ART,
  farm: FARM_ART,
  fair: FAIR_ART,
  desert: DESERT_ART,
  jungle: JUNGLE_ART,
  detective: DETECTIVE_ART,
  post: POST_ART,
  observatory: OBSERVATORY_ART,
  mine: MINE_ART,
  salon: SALON_ART,
  convenience: CONVENIENCE_ART,
  christmas: CHRISTMAS_ART,
  sky: SKY_ART,
  fantasy: FANTASY_ART,
  school: SCHOOL_ART,
  rainy: RAINY_ART,
  library: LIBRARY_ART,
  cafe: CAFE_ART,
  bakery: BAKERY_ART,
  camping: CAMPING_ART,
  greenhouse: GREENHOUSE_ART,
  music: MUSIC_ART,
  arcade: ARCADE_ART,
  hanok: HANOK_ART,
  "night-city": NIGHT_CITY_ART
};
