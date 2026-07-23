# TeuM 오픈소스 픽셀 자산 보관소

이 디렉터리에는 탐색·검토를 위한 원본 Git 저장소를 보관한다. 앱에 실제로 사용하는 파일만 별도 검토 후 `android/assets` 또는 `windows/src/assets`로 복사한다.
세 저장소 모두 원본 Git 이력을 포함한 로컬 clone이며, 앱 번들에는 포함하지 않는다. `pixel-agents`에서는 출처가 분리된 `characters/`와 `pets/`를 제거하고 사무용 자산만 남겼다.
현재 보관 기준은 상업 이용을 명시적으로 허용하는 MIT 또는 CC0 계열이다. 조건이 모호한 자산은 보관·사용하지 않는다.

## 내려받은 저장소

| 디렉터리 | 원본 | 라이선스 | 현재 판단 |
|---|---|---|---|
| `pixelarticons/` | https://github.com/halfmage/pixelarticons | MIT | 보조 UI 아이콘 후보. 필요한 SVG만 사용 |
| `pixel-agents/` | https://github.com/pixel-agents-hq/pixel-agents | 프로젝트 MIT. 일부 캐릭터 별도 출처 | 책상·PC·식물 레퍼런스. 캐릭터는 사용하지 않음 |
| `kenney-pack-1/` | https://github.com/iwenzhou/kenney | CC0-1.0 | 오래된 미러. 실제 배포 전 원 출처와 라이선스 재확인 |
| `opengameart-cc0-office/` | OpenGameArt CC0 개별 배포물 | CC0-1.0 | 사무실 책상·가구·화분·파티션의 픽셀 스타일 참고용. 원본 페이지와 파일별 출처를 함께 보관 |

## 내려받은 커밋

- `pixelarticons`: `efb6e17`
- `pixel-agents`: `cd0343b`
- `kenney-pack-1`: `b772928`

## 사용 규칙

1. 원본 저장소 전체를 앱 번들에 포함하지 않는다.
2. 실제로 복사한 파일만 `THIRD_PARTY_NOTICES.md`에 기록한다.
3. 라이선스가 섞여 있거나 캐릭터 원출처가 별도로 표시된 자산은 사용하지 않는다.
4. TeuM의 핵심 픽셀 데스크(물컵·창문·식물·스탠드)는 가능한 한 코드로 직접 제작한다.
5. `opengameart-cc0-office/`의 파일은 참고 보관물이다. 실제 채택 전에는 해당 파일의 원본 페이지·라이선스와 TeuM 팔레트 적합성을 다시 검토한다.
