# 틈새움 TeuM

직장인의 업무 흐름을 존중하며, 매시간 물 한 모금과 1분의 움직임을 제안하는 앱입니다.

## 앱 구조

- `windows/`: Tauri 2 + React 기반 Windows 데스크톱 앱
- `android/`: Expo 기반 React Native Android 앱

두 앱 모두 `DESIGN-nintendo-2001.md`의 2001년 콘솔 페이스플레이트 스타일을 적용합니다. 건강·행동 데이터 수집, 계정, 서버 동기화는 포함하지 않습니다.

## 실행

의존성을 설치한 뒤 다음 명령을 사용합니다.

```bash
pnpm install
pnpm dev:windows
pnpm dev:android
```

Windows 앱의 네이티브 창 실행은 `windows/`에서 `pnpm tauri dev`를 사용합니다.

## Android 앱 참고

- Expo Go에서 바로 실행할 수 있습니다 (`pnpm dev:android` 후 QR 스캔).
- 로컬 알림(60분 주기, 무음 또는 3단계 진동, `5분 뒤`·`이번엔 넘기기`)을 사용합니다. 예정 시각에는 `1분의 틈` 타이머 화면을 열며, Android 권한 상태에 따라 일반 알림으로 대체될 수 있습니다.
- 홈 화면 위젯(A-09)은 Expo 관리 워크플로에서 네이티브 모듈이 필요해 MVP 이후 개발 빌드 전환 시 추가할 항목입니다.
- 모든 설정은 기기 내 AsyncStorage에만 저장하며, 건강·행동 데이터를 수집하지 않습니다.

Google Play 출시 준비와 정책 검토는 [ANDROID-PLAY-STORE-DEPLOYMENT.md](ANDROID-PLAY-STORE-DEPLOYMENT.md)를 참고하세요.
개인정보처리방침 공개본은 [Notion](https://aluminum-language-c6a.notion.site/TeuM-3a447d4c6bf180f7a6f6e221089a5012?pvs=73)에서 확인할 수 있습니다.
