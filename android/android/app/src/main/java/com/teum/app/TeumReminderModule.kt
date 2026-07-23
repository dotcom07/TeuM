package com.teum.app

import android.app.LocaleManager
import android.app.NotificationManager
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.LocaleList
import android.provider.Settings
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.Locale

class TeumReminderModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {
  override fun getName() = "TeumReminder"

  @ReactMethod
  fun schedule(
    atMs: Double,
    mode: String,
    language: String,
    startMin: Double,
    endMin: Double,
    intervalMin: Double,
    days: ReadableArray,
    promise: Promise
  ) {
    val daySet = buildSet {
      for (index in 0 until days.size()) {
        val day = days.getInt(index)
        if (day in 0..6) add(day)
      }
    }
    ReminderAlarmScheduler.scheduleRegular(
      reactContext,
      ReminderSchedule(
        atMs = atMs.toLong(),
        mode = mode,
        language = language,
        startMin = startMin.toInt(),
        endMin = endMin.toInt(),
        intervalMin = intervalMin.toInt(),
        days = daySet
      )
    )
    promise.resolve(null)
  }

  @ReactMethod
  fun scheduleTest(atMs: Double, mode: String, language: String, promise: Promise) {
    ReminderAlarmScheduler.scheduleTest(reactContext, atMs.toLong(), mode, language)
    promise.resolve(null)
  }

  @ReactMethod
  fun cancel(promise: Promise) {
    ReminderAlarmScheduler.cancelRegular(reactContext)
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
  fun getLanguageState(promise: Promise) {
    val result = Arguments.createMap()
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      val manager = reactContext.getSystemService(LocaleManager::class.java)
      val appLocales = manager.applicationLocales
      val systemLocales = manager.systemLocales
      result.putString("overrideLanguage", if (appLocales.isEmpty) "" else appLocales[0].toLanguageTag())
      result.putString("systemLanguage", if (systemLocales.isEmpty) "en" else systemLocales[0].toLanguageTag())
      result.putBoolean("supportsSystemSettings", true)
    } else {
      result.putString("overrideLanguage", "")
      result.putString("systemLanguage", Locale.getDefault().toLanguageTag())
      result.putBoolean("supportsSystemSettings", false)
    }
    promise.resolve(result)
  }

  @ReactMethod
  fun setAppLanguage(mode: String, promise: Promise) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      val manager = reactContext.getSystemService(LocaleManager::class.java)
      manager.applicationLocales =
        if (mode == "auto") LocaleList.getEmptyLocaleList() else LocaleList.forLanguageTags(mode)
    }
    promise.resolve(null)
  }

  @ReactMethod
  fun openAppLanguageSettings(promise: Promise) {
    val action = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      Settings.ACTION_APP_LOCALE_SETTINGS
    } else {
      Settings.ACTION_APPLICATION_DETAILS_SETTINGS
    }
    val intent = Intent(action, Uri.parse("package:${reactContext.packageName}"))
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

  @ReactMethod
  fun dismissBreakPresentation(promise: Promise) {
    val activity = reactContext.currentActivity
    if (activity !is MainActivity) {
      promise.resolve(false)
      return
    }

    activity.runOnUiThread {
      promise.resolve(activity.dismissBreakPresentation())
    }
  }

  companion object {
    @Volatile
    var breakRequested = false

  }
}
