# TeuM pixel-theme review images

- `theme-atlas-320x180.png` / `theme-atlas.svg`: 13개 비교판·26테마 전체 아틀라스
- `pet-catalog-320x180.png` / `.svg`: 전체 펫의 생산 도트맵·테마 배경 검수판
- `classic-cat-catalog-320x180.png` / `.svg`: 배포본 원형을 고정한 클래식냥이 검수판
- `pixel-ui-review-320x180.png` / `pixel-ui-review.svg`: 298·328·360px 장면과 36·44·56px 실제 UI 크기 검수판
- `gift-box-storyboard.png` / `.svg`: 선물상자 1.35초 연출 4컷
- `item-128/`: 128×128 논리 캔버스를 8배로 출력한 1024×1024 단일 아이템 표본
- `scene-output/`: 320×180 장면의 정확한 4배·6배 출력 표본
- `theme-pairs/01-spring-winter.*`
- `theme-pairs/02-rival-calico.*` — 추가 고양이 16종 포함
- `theme-pairs/03-aquarium-undersea.*`
- `theme-pairs/04-dream-zoo.*`
- `theme-pairs/05-sf-space.*`
- `theme-pairs/06-christmas-sky.*`
- `theme-pairs/07-fantasy-school.*`
- `theme-pairs/08-rainy-library.*`
- `theme-pairs/09-cafe-bakery.*`
- `theme-pairs/10-camping-greenhouse.*`
- `theme-pairs/11-music-arcade.*`
- `theme-pairs/12-hanok-night-city.*`
- `theme-pairs/13-summer-autumn.*`

PNG는 육안 검수용, SVG는 무손실 확대·수정용이다. 모든 비교판은 실제 앱의
320×180 슬롯 지도와 명시적 z-order를 그대로 가져와 보간 없이 렌더한다. 배경과
아이템 내부색 또는 서로 다른 아이템의 외곽색이 겹칠 때는 앱과 같은 적응형 1px
경계색을 적용한다. 개별 아이템·펫 카드도 해당 테마의 실제 배경색 위에서 같은
경계 분리 함수를 거치므로 장면과 도감의 대비를 함께 확인할 수 있다.
