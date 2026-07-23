package com.teum.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * 재부팅·앱 업데이트·기기 시각 변경으로 AlarmManager 예약이 사라지거나
 * 현지 시각 기준이 달라졌을 때 저장된 업무 시간 규칙으로 한 건만 복구한다.
 */
class ReminderScheduleReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    when (intent.action) {
      Intent.ACTION_TIME_CHANGED,
      Intent.ACTION_TIMEZONE_CHANGED ->
        ReminderAlarmScheduler.restoreRegular(
          context.applicationContext,
          recalculate = true
        )
      Intent.ACTION_BOOT_COMPLETED,
      Intent.ACTION_MY_PACKAGE_REPLACED,
      "android.app.action.SCHEDULE_EXACT_ALARM_PERMISSION_STATE_CHANGED" ->
        ReminderAlarmScheduler.restoreRegular(context.applicationContext)
    }
  }
}
