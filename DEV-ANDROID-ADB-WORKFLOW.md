# Android 실기기 adb 개발 루프

에뮬레이터나 별도 MCP 도구 없이, **USB로 연결된 실기기(Galaxy S23)를 adb로 직접 조작·캡처하면서 UI/UX를 다듬는 워크플로**다. TeuM 개발 전 과정(픽셀 데스크, 알림, 진동 검증)에서 사용했다.

## 0. 환경

```bash
ADB=/Volumes/SanDisk-SSD/Android/sdk/platform-tools/adb   # SDK가 외장 SSD에 있어 PATH에 없음
$ADB devices -l                                            # R3CW100L4EW = Galaxy S23
```

- 디버그 빌드(`com.teum.app`)가 설치돼 있고, JS는 Metro(8081)에서 내려받는다.
- Metro 연결: `adb reverse tcp:8081 tcp:8081` (USB만으로 localhost 연결).

## 1. 기본 루프 (코드 → 화면 확인)

```text
코드 수정
  ├─ JS/TSX만 수정  → Metro Fast Refresh (재빌드 불필요, ~3초)
  └─ 네이티브 수정  → cd android/android && ./gradlew :app:installDebug
adb reverse → am start → sleep N → screencap → 이미지 확인
  → input tap/swipe로 상호작용 → 다시 screencap → 반복
```

핵심 명령:

```bash
$ADB shell am force-stop com.teum.app                      # 콜드 스타트가 필요할 때만
$ADB shell am start -n com.teum.app/.MainActivity
$ADB exec-out screencap -p > cap.png                       # 캡처 (표시 배율 주의: 원본 1080×2340)
$ADB shell input tap X Y                                   # 좌표는 원본 픽셀 기준
$ADB shell input swipe X1 Y1 X2 Y2 400                     # 스크롤
$ADB shell input keyevent 223                              # 화면 끄기 (224 = 켜기)
$ADB shell cmd statusbar collapse                          # 내려온 알림 패널 접기
```

좌표 계산: 캡처를 축소해 볼 때는 표시 좌표 × (원본폭/표시폭)로 환산한다. 탭 직전에 반드시 최신 캡처로 좌표를 재확정한다 — **사용자가 폰을 실제로 쓰는 중이면 화면이 바뀌어 탭이 엉뚱한 곳을 누른다** (실제로 몇 번 발생).

## 2. 화면 너머의 상태 검증 (dumpsys)

눈으로 안 보이는 동작은 시스템 덤프로 실증한다. 이 프로젝트에서 실제로 결정적이었던 것들:

| 검증 대상 | 명령 | 실전 사례 |
|---|---|---|
| 알림 게시·플래그 | `dumpsys notification --noredact` | `sound: false`가 `flags=SILENT`를 만들어 진동·헤드업을 다 죽이던 버그 확정 |
| 알림 채널 설정 | 〃 (`mId='…' mSound=… mVibrationEnabled=…`) | 채널에 기본 알림음이 박혀 있던 것 발견 → 채널 v2 재생성 |
| 진동 실행 이력 | `dumpsys vibrator_manager` | 무음 모드에서 `usage: ALARM \| com.teum.app … finished` 로 알람 진동 전달 실증 |
| 알람 예약/취소 | `dumpsys alarm` | 정확한 알람 여부(`exactAllowReason`), 예약 1건 유지, 취소 이력 추적 |
| 권한 상태 | `dumpsys package com.teum.app` / `appops get` | SCHEDULE_EXACT_ALARM, POST_NOTIFICATIONS 확인 |
| 벨소리 모드 | `dumpsys audio` (`ringer mode muted streams`) | "진동이 안 와요" 원인이 기기 무음 모드였던 케이스 구분 |
| 타 앱 역공학 | `dumpsys package/notification` 대상 패키지 | Repeat Alarm이 채널 진동 없이(`mVibrationEnabled=false`) 직접 Vibrator를 쓰는 구조 파악 |

## 3. 앱 데이터 직접 읽기 (디버그 빌드 한정)

```bash
$ADB shell "run-as com.teum.app sh -c 'strings databases/RKStorage | grep onboarded'"
```

AsyncStorage(SQLite)를 그대로 읽어 "UI 표시 vs 저장 상태" 불일치를 판별한다. 실전: 홈이 오후 2:00을 보여줄 때 저장값은 10:00임을 확인해 표시/재계산 버그로 좁혔다.

## 4. 백그라운드·잠금 시나리오 테스트

```bash
# 테스트 버튼 탭 → 즉시 화면 끄기 → 발화 대기 → 덤프로 확인 → 깨워서 캡처
$ADB shell input tap …; sleep 0.5
$ADB shell input keyevent 223; sleep 9
$ADB shell dumpsys notification --noredact | grep -o "flags=[A-Z_|]*"
$ADB shell input keyevent 224; sleep 2; $ADB exec-out screencap -p > lock.png
```

## 5. 규칙

- **기기 상태를 존중한다**: 사용자 폰이므로 기록을 만드는 버튼(챙겼어요 등)은 꼭 필요할 때만 누르고, 테스트 후 바꾼 설정은 알려 준다. 사용자가 조작 중인 흔적(화면 전환, 언어 변경)이 보이면 탭을 멈춘다.
- **알림 패널이 내려와 있으면** 캡처가 가려진다 → `cmd statusbar collapse` 후 재캡처.
- **screencap에 개인 알림이 찍힐 수 있다** — 캡처는 검증 목적에만 쓰고 곧바로 폐기한다.
- 재설치 시 `appops`로 준 특별 권한이 풀릴 수 있으니 재확인한다.
- Metro가 죽으면 디버그 앱은 뜨지 않는다. 세션 종료 전 상태를 사용자에게 알린다.

## 6. 자주 쓰는 원라이너

```bash
# 빌드+설치 (네이티브 변경 시)
cd android/android && ANDROID_HOME=/Volumes/SanDisk-SSD/Android/sdk ./gradlew :app:installDebug -x lint

# 앱 재시작 + 캡처
$ADB reverse tcp:8081 tcp:8081 && $ADB shell am start -n com.teum.app/.MainActivity && sleep 5 \
  && $ADB exec-out screencap -p > cap.png

# TeuM 관련 진동 이력만
$ADB shell dumpsys vibrator_manager | grep "com.teum"

# TeuM 알람 예약 확인
$ADB shell dumpsys alarm | grep -A3 com.teum
```
