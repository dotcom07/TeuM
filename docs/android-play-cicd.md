# Android Play CI/CD

`vMAJOR.MINOR.PATCH` 태그를 푸시하면 `.github/workflows/android-play.yml`이
테스트, 픽셀 아트 감사, 서명된 AAB 빌드, Google Play 비공개 테스트 Alpha
100% 배포까지 실행한다. 일반 PR과 브랜치 푸시는 품질 검사만 실행한다.

## GitHub Environment

`google-play-alpha` Environment에 다음 Secret을 등록한다.

- `ANDROID_UPLOAD_KEYSTORE_BASE64`
- `ANDROID_UPLOAD_STORE_PASSWORD`
- `ANDROID_UPLOAD_KEY_ALIAS`
- `ANDROID_UPLOAD_KEY_PASSWORD`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_PLAY_SERVICE_ACCOUNT`

업로드 키는 `base64 < upload-key.jks | pbcopy`로 인코딩할 수 있다. 원본 키와
`keystore.properties`는 저장소에 커밋하지 않는다.

## Google Cloud와 Play Console

1. Google Cloud 프로젝트에서 Google Play Android Developer API를 활성화한다.
2. 전용 서비스 계정과 GitHub OIDC Workload Identity Provider를 만든다.
3. Provider는 `dotcom07/TeuM` 저장소만 신뢰하도록 제한한다.
4. 서비스 계정을 Play Console의 사용자 및 권한에 초대한다.
5. `틈새움(com.teum.app)`의 출시 관리 권한만 부여한다.

## 출시

출시 노트를 `android/play/release-notes/ko-KR.txt`에 작성하고 태그를 푸시한다.

```bash
git tag v1.0.10
git push origin v1.0.10
```

태그에서 Android `versionName`과 `versionCode`가 자동 생성된다. 예를 들어
`v1.0.10`은 `versionName 1.0.10`, `versionCode 1000010`으로 빌드된다.
Play 배포 API는 새 edit 생성, AAB 업로드, Alpha 트랙 100% 갱신, 검증, commit
순서로 실행된다.
