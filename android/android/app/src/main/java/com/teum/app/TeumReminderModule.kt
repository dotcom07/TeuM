package com.teum.app

import android.app.AlarmManager
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class TeumReminderModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {
  override fun getName() = "TeumReminder"

  @ReactMethod
  fun schedule(atMs: Double, mode: String, promise: Promise) {
    scheduleAlarm(atMs.toLong(), mode, false)
    promise.resolve(null)
  }

  @ReactMethod
  fun scheduleTest(atMs: Double, mode: String, promise: Promise) {
    scheduleAlarm(atMs.toLong(), mode, true)
    promise.resolve(null)
  }

  @ReactMethod
  fun cancel(promise: Promise) {
    alarmManager().cancel(alarmPendingIntent(false))
    promise.resolve(null)
  }

  /** 무음 모드에서도 울리는 즉시 진동 (모드 미리보기·테스트용) */
  @ReactMethod
  fun vibrateNow(mode: String, promise: Promise) {
    AlarmVibration.vibrate(reactContext, AlarmVibration.patternFor(mode))
    promise.resolve(null)
  }

  @ReactMethod
  fun canUseFullScreenIntent(promise: Promise) {
    val allowed = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
      reactContext.getSystemService(NotificationManager::class.java).canUseFullScreenIntent()
    } else {
      true
    }
    promise.resolve(allowed)
  }

  @ReactMethod
  fun openFullScreenSettings(promise: Promise) {
    val intent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
      Intent(
        Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT,
        Uri.parse("package:${reactContext.packageName}")
      )
    } else {
      Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:${reactContext.packageName}"))
    }
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    reactContext.startActivity(intent)
    promise.resolve(null)
  }

  @ReactMethod
  fun consumeBreakRequest(promise: Promise) {
    val requested = breakRequested
    breakRequested = false
    promise.resolve(requested)
  }

  private fun scheduleAlarm(atMs: Long, mode: String, test: Boolean) {
    val pendingIntent = alarmPendingIntent(test, mode)
    val alarmManager = alarmManager()
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarmManager.canScheduleExactAlarms()) {
      alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, atMs, pendingIntent)
    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, atMs, pendingIntent)
    } else {
      alarmManager.setExact(AlarmManager.RTC_WAKEUP, atMs, pendingIntent)
    }
  }

  private fun alarmManager() =
    reactContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager

  private fun alarmPendingIntent(test: Boolean, mode: String = "silent"): PendingIntent {
    val intent = Intent(reactContext, ReminderReceiver::class.java).apply {
      putExtra(ReminderReceiver.EXTRA_MODE, mode)
      putExtra(ReminderReceiver.EXTRA_TEST, test)
    }
    return PendingIntent.getBroadcast(
      reactContext,
      if (test) TEST_REQUEST_CODE else REGULAR_REQUEST_CODE,
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
  }

  companion object {
    @Volatile
    var breakRequested = false

    private const val REGULAR_REQUEST_CODE = 41001
    private const val TEST_REQUEST_CODE = 41002
  }
}
