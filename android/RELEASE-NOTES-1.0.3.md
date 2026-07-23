# 틈새움 1.0.3

## Google Play 한국어

알림 예약의 안정성을 개선했어요.

- 기기를 재부팅하거나 앱을 업데이트한 뒤에도 다음 건강 알람을 복구해요.
- 업무 시작 시각을 기준으로 다음 알람 시간을 더 정확하게 계산해요.
- 알람 간격을 빠르게 변경해도 마지막 설정만 적용돼요.
- 1분부터 24시간까지의 알람 간격 경계를 보완했어요.

## Google Play English

We improved reminder scheduling reliability.

- Restores the next health reminder after a device restart or app update.
- Calculates the next reminder more reliably from the start of your workday.
- Applies only your latest setting when reminder timing changes quickly.
- Improves scheduling across the full 1-minute to 24-hour interval range.

## 내부 확인 항목

- 업무 시작 전 첫 예약: `업무 시작 + 간격`
- 업무 중 첫 예약: 업무 시작 기준의 다음 정규 슬롯
- 업무 종료 뒤: 다음 선택 업무일의 시작 기준
- 알람 간격·요일·업무 시간 변경: 이전 예약 제거 후 한 건만 유지
- 앱 재실행·업데이트·기기 재부팅: 저장된 예약 복구
- 기기 시각·시간대 변경: 현지 업무 시간 기준으로 예약 복구
- 정확한 알람 권한 없음: 일반 유휴 허용 알람으로 대체
