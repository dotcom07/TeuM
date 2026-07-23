package com.teum.app

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build

object ReminderAlarmScheduler {
  private const val REGULAR_REQUEST_CODE = 41001
  private const val TEST_REQUEST_CODE = 41002

  fun scheduleRegular(context: Context, schedule: ReminderSchedule) {
    setAlarm(context, schedule.atMs, schedule.mode, schedule.language, false)
    ReminderScheduleStore.save(context, schedule)
  }

  fun scheduleTest(context: Context, atMs: Long, mode: String, language: String) {
    setAlarm(context, atMs, mode, language, true)
  }

  fun cancelRegular(context: Context, clearStored: Boolean = true) {
    alarmManager(context).cancel(alarmPendingIntent(context, false))
    if (clearStored) ReminderScheduleStore.clear(context)
  }

  fun restoreRegular(
    context: Context,
    nowMs: Long = System.currentTimeMillis(),
    recalculate: Boolean = false
  ) {
    val saved = ReminderScheduleStore.load(context) ?: return
    val triggerAt =
      if (recalculate) ReminderTime.nextAlignedTick(nowMs, saved)
      else ReminderTime.restoredTrigger(nowMs, saved)
    if (triggerAt == null) {
      cancelRegular(context)
      return
    }
    scheduleRegular(context, saved.copy(atMs = triggerAt))
  }

  private fun setAlarm(
    context: Context,
    atMs: Long,
    mode: String,
    language: String,
    test: Boolean
  ) {
    val pendingIntent = alarmPendingIntent(context, test, mode, language)
    val manager = alarmManager(context)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !manager.canScheduleExactAlarms()) {
      manager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, atMs, pendingIntent)
    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      manager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, atMs, pendingIntent)
    } else {
      manager.setExact(AlarmManager.RTC_WAKEUP, atMs, pendingIntent)
    }
  }

  private fun alarmManager(context: Context) =
    context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

  private fun alarmPendingIntent(
    context: Context,
    test: Boolean,
    mode: String = "silent",
    language: String = "ko"
  ): PendingIntent {
    val intent = Intent(context, ReminderReceiver::class.java).apply {
      putExtra(ReminderReceiver.EXTRA_MODE, mode)
      putExtra(ReminderReceiver.EXTRA_LANGUAGE, language)
      putExtra(ReminderReceiver.EXTRA_TEST, test)
    }
    return PendingIntent.getBroadcast(
      context,
      if (test) TEST_REQUEST_CODE else REGULAR_REQUEST_CODE,
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
  }
}
