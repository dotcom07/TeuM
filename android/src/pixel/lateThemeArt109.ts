interface ThemeArtAsset {
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

const asset = (nameKo: string, nameEn: string, rows: string[]): ThemeArtAsset => ({
  nameKo,
  nameEn,
  rows
});

const compose = (
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
    ".....IIIIII.....",
    "...IIWWWWWWII...",
    "..IWWWWWWWWWWI..",
    ".IWWGWWWWGWWWWI.",
    "IWWWWWWWWWWWWWWI",
    "IWWWWAWWAWWWWWWI",
    "IWWAWWAAWWAWWWWI",
    "IWWWWAWWAWWWWWWI",
    ".IWWWWWWWWWWWWI.",
    "..IIWWWWWWWWII..",
    "....IIIIIIII....",
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
  mug: asset("사탕지팡이 코코아", "Candy-cane cocoa", [".I.A..", ".IAA..", "IWWWII", "IWRWII", "IWWWI.", ".IIII."]),
  ornament: asset("탁상 꼬마 트리", "Tiny desk tree", ["...A...", "..GGG..", ".GGRGG.", "GGGGGGG", "..GNG..", "...N...", ".IIIII.", "..III.."]),
  lamp: asset("별 꼭대기 트리등", "Tree-top star lamp", ["..A..", ".AAA.", "AAGAA", ".GGG.", "GGGGG", "..N..", "..N..", "..N..", "..N..", ".INI.", "INNNI", "IIIII"]),
  mat: asset("포장지 리본 매트", "Wrapping-ribbon mat", ["RRRAARRR", "IWWAAWWI", "IIIIIIII"]),
  shelf: asset("양말 속 선물", "Stocking gift", [".IR..", "IRRR.", "IRWR.", ".III."]),
  frame: asset("루돌프 우편 포스터", "Rudolph mail poster", ["IIIIII", "IRRRRI", "IRNNRI", "INWNNI", "INARNI", "IRRRRI", "IIIIII"]),
  clock: asset("방울 리스 시계", "Bell-wreath clock", [".GG.", "GWWG", "GAAG", ".II."]),
  pet: asset("루돌프 강아지", "Rudolph puppy", ["A.AA.A", "AA..AA", ".INNI.", "INWWNI", "INRNNI", "INNNNI", ".INNI.", ".I..I."]),
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
  ornament: asset("종이비행기 모빌", "Paper-plane mobile", ["W.....W", ".WW.WW.", "..WWW..", "...Y...", "...Y...", ".M.Y.M.", ".M...M.", "MMM.MMM"]),
  lamp: asset("햇살 기상등", "Sunbeam weather lamp", ["..A..", ".AAA.", "AAWAA", ".AAA.", "..Y..", "..Y..", "..Y..", "..Y..", "..Y..", ".MYM.", "MYYYM", "MMMMM"]),
  mat: asset("상승기류 매트", "Updraft mat", ["BWBBWBBW", "WBBWWBBW", "MMMMMMMM"]),
  shelf: asset("미니 열기구", "Mini hot-air balloon", [".AAA.", "AWWWA", ".AYA.", "..Y.."]),
  frame: asset("구름 고도 지도", "Cloud-altitude map", ["MMMMMM", "MBBBBM", "MBWWBM", "MWWWWM", "MBBABM", "MBBBBM", "MMMMMM"]),
  clock: asset("태양 고도 시계", "Sun-altitude clock", [".AA.", "AWWA", "ABAA", ".MM."]),
  pet: asset("파랑새", "Bluebird", ["......", ".MM...", "MBBWMM", "MBCBAM", ".MBBBM", "..MMM.", "..M.M.", "......"]),
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
  monitor: asset("펼쳐진 마법서", "Open spellbook", [
    "......MM......",
    "....MMMMMM....",
    "MMMMMMMMMMMMMM",
    "MYYYYMMYYYYYYM",
    "MYAWYMMYWAYYYM",
    "MYTWYMMYWTYYYM",
    "MYYYYMMYYYYYYM",
    ".MMMM..MMMMMM.",
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
  pet: asset("별빛 토끼", "Starlight rabbit", ["M....M", "MY..YM", ".MYYM.", "MYYYYM", "MYWWYM", "MYAYYM", "MMYYMM", ".M..M."]),
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
  pet: asset("책가방 강아지", "Backpack puppy", ["T.T...", "TYYT..", "TYWW..", "TYAT..", "TYYTT.", "TYIITT", ".T..T.", "..T..."]),
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
  monitor: asset("강수 레이더", "Rainfall radar", [
    "...MMMMMMMM...",
    ".MMBBBBBBBBMM.",
    "MBBBTBBBBTBBBM",
    "MBBBBTTTTBBBBM",
    "MBBTTTSTTTBBBM",
    "MBBBBTTTTBBBBM",
    "MBBBTBBBBTBBBM",
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
  pet: asset("우비 개구리", "Raincoat frog", ["M....M", "MW..WM", ".MBBM.", "MBWABM", "MBBBBM", ".MBBM.", "MM..MM", ".M..M."]),
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
  pet: asset("책벌레 부엉이", "Bookworm owl", ["I....I", "IIYYII", "IYWWYI", "IYCCYI", "IYAYYI", "IIYYII", ".IYYI.", ".I..I."]),
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
  pet: asset("베레모 바리스타냥이", "Beret barista cat", [".TTT..", "TNNNT.", "TNWWT.", "TNAAT.", "TNNNTT", "TNWWTT", ".T..T.", "..T..."]),
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
  pet: asset("셰프모자 빵집 곰", "Chef-hat bakery bear", [".WWW..", "WWWWW.", "I.I...", "IYIYI.", "IYWWYI", "IYAYYI", ".IYYI.", ".I..I."]),
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
      { x: 0, y: 22, rows: ["G".repeat(64), "G".repeat(64), "N".repeat(64), "N".repeat(64), "B".repeat(64), "B".repeat(64), "C".repeat(64), "C".repeat(64), "C".repeat(64)] },
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
  monitor: asset("캠프 지도 보드", "Camp map board", ["..MMMMMMMMMM..", ".MGGGGGGGGGM..", "MGGNNGGNNGGGM.", "MGYYYYGGGGGGM.", "MGGGOOGGGGGGM.", "MGGGGGGGGGGGM.", "MGGNNGGYYYYGM.", "..MMMMMMMMMM..", "....MNNNM.....", "..MMMMMMMMMM.."]),
  mug: asset("법랑 캠프컵", "Enamel camp mug", [".M.A..", ".MAA..", "MYYYYM", "MYOGMM", "MYYYYM", ".MMMM."]),
  ornament: asset("미니 모닥불", "Mini campfire", ["...A...", "..ASA..", ".ASSSA.", "..NNN..", ".MNNNM.", "MNNNNNM", ".M.M.M.", "M.....M"]),
  lamp: asset("가스 랜턴", "Gas lantern", ["..M..", ".MNM.", "M...M", "MAAWM", "MAAWM", "MWWWM", ".MMM.", "..N..", "..N..", ".MNM.", "MNNNM", "MMMMM"]),
  mat: asset("산길 지도 매트", "Trail-map mat", ["MGMMGMMG", "MYNNYNYM", "MMMMMMMM"]),
  shelf: asset("캠프 나침반", "Camp compass", [".MM..", "MWWM.", "MWAM.", ".MM.."]),
  frame: asset("국립공원 배지판", "National-park badge board", ["MMMMMM", "MGGGGM", "MGYNGM", "MYNNYM", "MGAGGM", "MGGGGM", "MMMMMM"]),
  clock: asset("통나무 나이테 시계", "Log-ring clock", [".NN.", "NYYN", "NAYN", ".MM."]),
  pet: asset("텐트후드 강아지", "Tent-hood puppy", [".M.M..", "MO.MO.", "MOOOM.", "MOWOM.", "MOOOM.", "MOOOMM", "MOGGMM", ".M..M."]),
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
  pet: asset("새싹 토끼", "Sprout rabbit", [".GGG..", "IG..GI", "IG..GI", ".IGGI.", "IGWWGI", "IGAGGI", ".IGGI.", ".I..I."]),
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
  pet: asset("헤드폰 파랑새", "Headphone bluebird", [".TTT..", "TBBBTT", "TBWBT.", "TBABTT", ".TBBT.", "..TT..", ".T..T.", "......"]),
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
  window: asset("게임 포털 스크린", "Game portal screen", ["....NNNNNNNN....", "..NNPPPPPPPPNN..", ".NPPBBBBBBBBPPN.", "NPPBSSSSSSSSBPPN", "NPBSSGGGGGGSSBPN", "NPBSGGAWWAGGSSPN", "NPBSSGGGGGGSSBPN", "NPPBSSSSSSSSBPPN", ".NPPBBBBBBBBPPN.", "..NNPPPPPPPPNN..", "....NNNNNNNN....", "......BBBB......"]),
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
  pet: asset("픽셀 유령", "Pixel ghost", [".GGG..", "GPPPG.", "GPWPG.", "GPAAG.", "GPPPG.", "GBBBG.", "G.G.G.", ".G.G.."]),
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
      { x: 6, y: 20, rows: ["....W....", ".WWWWWWW.", "WWWWWWWWW", "...GGG..."] },
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
  monitor: asset("펼친 서책 받침", "Open scroll stand", ["......II......", "....IIIIII....", "IIIIIIIIIIIIII", "IWWWWIIWWWWWWI", "IWNNWIIWNNWWWI", "IWRRWIIWRRWWWI", "IWWWWIIWWWWWWI", ".IIII..IIIIII.", ".....INI......", "...IIIIIIII..."]),
  mug: asset("백자 찻잔", "White porcelain cup", [".I.W..", ".IWW..", "IWWWWI", "IWGWII", "IWWWWI", ".IIII."]),
  ornament: asset("매화 백자 화병", "Plum-blossom vase", [".R...R.", "RWR.RWR", ".G...G.", "..NNN..", "...N...", ".IWWWI.", ".IWGWI.", "..III.."]),
  lamp: asset("한지 사각등", "Hanji square lamp", ["IIIII", "IWWWI", "IWRWI", "IWWWI", "IIIII", "..N..", "..N..", "..N..", "..N..", ".INI.", "INNNI", "IIIII"]),
  mat: asset("보자기 조각 매트", "Patchwork bojagi mat", ["IGIIYIIG", "IGWWGWGI", "IIIIIIII"]),
  shelf: asset("청자 향로", "Celadon incense burner", ["..G..", ".GGG.", "IGGGI", "IIIII"]),
  frame: asset("산수화 족자", "Landscape scroll", ["IIIIII", "IWWWWI", "IWNNWI", "INGGNI", "IGWWGI", "IYYYYI", "IIIIII"]),
  clock: asset("단청 꽃 시계", "Dancheong flower clock", [".RR.", "RGGR", "RAAR", ".II."]),
  pet: asset("갓 쓴 마당냥이", "Courtyard cat in gat", [".III..", "IIIIII", "I.I...", "INNI..", "INWW..", "INAN.I", "INNIII", ".I..I."]),
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
  pet: asset("네온 검정냥이", "Neon black cat", ["T.T...", "TBPT..", "TWTW..", "TPSP..", "TPPT.T", "TPPTTT", ".T..T.", "..TT.."]),
  floorObject: asset("도시 배달가방", "City delivery bag", ["..TT..", ".T..T.", "TBBBBT", "TBTTBT", "TBASBT", "TBBBBT", "TTTTTT", ".PPPP."])
};

export const LATE_THEME_ART_109: Record<string, LateThemeArtPack> = {
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
