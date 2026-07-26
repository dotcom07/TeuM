# 틈새움 픽셀 아이템 제작 방법론

## 1. 제작 원칙

틈새움의 픽셀 데스크는 PNG 스프라이트를 확대하는 방식이 아니라, 문자열 도트맵을 앱이 직접 사각형으로 렌더링한다. 외부 에셋을 그대로 복사하지 않고 상업적 이용 가능한 자료는 실루엣·색 덩어리·가독성 연구용으로만 참고한다.

- 소품 원화는 작은 기준 그리드에서 실루엣을 직접 설계한 뒤 Scale2x와 정수 클러스터로만 확대한다.
- 자동 안티앨리어싱, 흐림, 반투명 경계는 사용하지 않는다.
- 기본 원화는 테마 잉크를 쓰고, 실제 배경·옆 아이템과 3:1 미만으로 겹치는
  안쪽 경계만 테마별 `outline / halo / separator` 색으로 교체한다.
- 모든 아이템의 광원은 좌상단이다.
- 한 아이템은 보통 외곽선 포함 3~5색만 사용한다.
- 최종 320×180 장면에서는 3~8px 크기의 서로 연결된 색 덩어리를 우선한다.
- 단독 픽셀은 눈, 반짝임, 잎맥처럼 의미가 분명할 때만 허용한다.
- 5×5처럼 작은 슬롯은 내부 묘사보다 실루엣을 먼저 읽히게 한다.
- 320×140 배경은 큰 면 70%, 반복 무늬 20%, 강조색 10% 안쪽으로 유지한다.
- 펫은 9×11 종별 원화를 먼저 설계하고 Scale2x 뒤 3px 클러스터로 변환해 54×66으로 렌더링한다.
- 클래식냥이는 스토어 배포본의 짧은 몸·흰 눈·올라간 꼬리를 공통 문법으로 쓰되
  테마별 꽃·목도리·헬멧·모자·안경 같은 외곽 소품과 품종별 귀·몸통·꼬리를 달리한다.

## 2. 테마 설계

1.0.6에서는 14개 카테고리에 테마별 한 개씩, 총 42개를 추가한다.

| 테마 | 도착 시점 | 색과 형태 |
|---|---:|---|
| 라이벌 (기존 `cat-*` id 유지) | 누적 틈 1회 | 인디고·페리윙클, 귀·눈·발바닥을 닮은 수상한 실루엣 |
| 여름 | 누적 틈 12회 | 바다색·모래색, 파도·햇살·조개 |
| 가을 | 누적 틈 36회 | 황토·적갈색·나무색, 단풍·도토리·호박 |

테마 하나가 같은 시점에 전부 열리므로 벽지만 도착하고 책상은 없는 반쪽 세트가 생기지 않는다. 기존 개별 마일스톤 아이템은 그대로 유지한다.

## 3. 프로덕션 논리 해상도

방은 16:9 `320×180`이며 1280×720에서는 정확히 4배로 표시한다. 소품은
Scale2x 뒤 2px 클러스터(원화 대비 4배), 펫은 Scale2x 뒤 3px 클러스터(원화 대비
6배)를 쓴다. 클래식냥이의 원본 행은 배포본 그대로 고정하고 표시 단계에서만 42×54로
확대한다.

독립 캐릭터·사물은 장면 배치용 행을 바꾸지 않고 `128×128` 논리 캔버스 중앙에
정렬해 6배 `768×768` 또는 8배 `1024×1024`로 출력한다. 방은 4배 `1280×720`
또는 6배 `1920×1080` 출력만 허용한다.

| 카테고리 | 프로덕션 최대 도트 크기 |
|---|---:|
| 벽지 | 320×140 |
| 바닥지 | 320×40 |
| 창문 | 72×56 |
| 책상 | 252×36 |
| 모니터 | 64×44 |
| 컵 | 28×28 |
| 식물 | 32×36 |
| 조명 | 24×56 |
| 펫 | 54×66 |
| 클래식냥이 | 42×54 |

## 4. 코드 구조

- `themeItems.ts`: 42개 원본 도트맵과 이름, 해금 시점
- `catalog.ts`: 기존 아이템과 테마 아이템을 하나의 카탈로그로 합성
- `pixelDensity.ts`: 제작 원화를 Scale2x·클러스터 방식의 320×180 프로덕션 밀도로 변환
- `pixelCanvas.ts`: 128×128 단일 아이템 캔버스와 4×/6×·6×/8× 정수 출력 규격
- `pixelMotion.ts`: 선물 파티클의 position·velocity·acceleration·lifespan 궤적
- `petArtworkDense.ts`: 모든 펫의 9×11 수작업 원화
- `petSpriteBuilders.ts`: 고양이 체형·자세와 펫 크기 검증
- `storeCatVariants.ts`: 26테마 소품·16품종 스토어형 클래식냥이 원화와 품종 대응표
- `pixelSeparation.ts`: owner-aware 장면 합성과 적응형 내부 경계색
- `PixelGlyph.tsx`: 문자 팔레트를 가로 run 단위 사각형으로 변환
- `render-theme-pair.mjs`: 앱과 같은 합성기로 두 테마 장면·아이템을 SVG로 렌더링
- `render-pet-catalog.mjs`: 87개 펫을 실제 테마 배경 위에 렌더링

미리보기 생성:

```bash
cd android
node scripts/render-theme-pair.mjs spring,winter art/theme-pairs/01-spring-winter.svg
node scripts/render-pet-catalog.mjs
node scripts/render-theme-atlas.mjs
node scripts/render-item-128.mjs rainy-frog 8
node scripts/render-scene-output.mjs fantasy 6
```

생성 결과는 `android/art/theme-pairs/`, `android/art/theme-atlas.svg`,
`android/art/pet-catalog-320x180.png`, `android/art/pixel-ui-review-320x180.png`에
저장된다. SVG에는 `shape-rendering="crispEdges"`를
적용해 브라우저에서도 도트 경계가 흐려지지 않는다.

## 5. 검수 순서

1. 모든 행의 폭이 같은지 검사한다.
2. 도트맵이 슬롯의 최대 폭·높이를 넘지 않는지 검사한다.
3. 아틀라스에서 축소 실루엣이 이름 없이도 구분되는지 확인한다.
4. 완성 장면에서 모니터·컵·식물·조명이 서로 겹치지 않는지 확인한다.
5. 실제 Android 화면에서 비정수 배율 헤어라인과 색 대비를 확인한다.
6. 한국어·영어 이름이 아이템 셀 안에서 과도하게 잘리지 않는지 확인한다.
7. 모든 전경 아이템을 26개 테마 배경에 각각 놓아 외곽 대비 3:1 이상인지 검사한다.
8. 완성 방·혼합 방에서 서로 다른 owner의 4방향 경계가 같은 HEX로 이어지지 않는지 검사한다.
9. 분리색은 원래 실루엣 안쪽 픽셀만 바꾸고 다른 아이템 픽셀을 덮지 않는지 검사한다.

## 6. 참고 자료와 라이선스

- [The Nature of Code — Vectors](https://natureofcode.com/vectors/): 위치·속도·가속도 기반 움직임
- [The Nature of Code — Oscillation](https://natureofcode.com/oscillation/): 반복 움직임과 자연스러운 흔들림
- [The Nature of Code — Particle Systems](https://natureofcode.com/particles/): emitter·lifespan·alpha 기반 선물상자 연출
- [The Nature of Code — Building a Computational Creature](https://natureofcode.com/book/appendix--building-a-computational-creature/): 몸통과 종별 부속지로 실루엣 변주
- [Pixel Joint Pixel Art Tutorial](https://pixeljoint.com/forum/forum_posts.asp?TID=11299): 픽셀 클러스터, jaggies, 수동 안티앨리어싱, banding 검수 기준
- [Lospec](https://lospec.com/): 제한 팔레트와 색상 램프 연구
- [Kenney Roguelike Indoors](https://kenney.nl/assets/roguelike-indoors): 실내 소품 실루엣 참고, CC0
- [OpenGameArt A Cat](https://opengameart.org/content/a-cat): 작은 고양이 실루엣 참고, CC0
- [OpenGameArt Granny's House](https://opengameart.org/content/grannys-house): 고양이와 실내 타일 배치 참고, CC0
- [OpenGameArt Classy Furniture](https://opengameart.org/content/classy-furniture): 가구 명암 덩어리 참고, CC0

현재 앱에 포함된 1.0.6 도트맵은 위 에셋 파일을 복제하거나 변환한 것이 아니라, 틈새움 슬롯 규격과 브랜드 팔레트에 맞춰 코드로 새로 제작한 원본이다.
