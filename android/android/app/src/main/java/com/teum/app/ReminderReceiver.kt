package com.teum.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.res.Configuration
import android.graphics.Color
import android.net.Uri
import android.os.Build
import java.util.Locale
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class ReminderReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    TeumReminderModule.breakRequested = true
    val mode = intent.getStringExtra(EXTRA_MODE) ?: "silent"
    val language = intent.getStringExtra(EXTRA_LANGUAGE) ?: "ko"
    val test = intent.getBooleanExtra(EXTRA_TEST, false)
    val textContext = localizedContext(context, language)
    val channelId = createChannel(context, textContext, mode, language)
    val openIntent = Intent(Intent.ACTION_VIEW, Uri.parse("teum://break"), context, MainActivity::class.java).apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
    }
    val openPendingIntent = PendingIntent.getActivity(
      context,
      OPEN_REQUEST_CODE,
      openIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    // 알림에서 바로 선택할 수 있는 세 가지 액션. Activity PendingIntent라
    // notification trampoline 제한에 걸리지 않는다.
    fun respondIntent(action: String, requestCode: Int): PendingIntent {
      val intent = Intent(
        Intent.ACTION_VIEW,
        Uri.parse("teum://respond/$action"),
        context,
        MainActivity::class.java
      ).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
      }
      return PendingIntent.getActivity(
        context,
        requestCode,
        intent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
      )
    }

    val notification = NotificationCompat.Builder(context, channelId)
      .setSmallIcon(R.drawable.ic_stat_teum)
      .setContentTitle(textContext.getString(if (test) R.string.notification_test_title else R.string.notification_title))
      .setContentText(textContext.getString(R.string.notification_body))
      .setContentIntent(openPendingIntent)
      .setFullScreenIntent(openPendingIntent, true)
      .setPriority(NotificationCompat.PRIORITY_MAX)
      .setCategory(NotificationCompat.CATEGORY_ALARM)
      .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
      .addAction(0, textContext.getString(R.string.notification_snooze), respondIntent("snooze", SNOOZE_REQUEST_CODE))
      .addAction(0, textContext.getString(R.string.notification_done), respondIntent("done", DONE_REQUEST_CODE))
      .addAction(0, textContext.getString(R.string.notification_skip), respondIntent("skip", SKIP_REQUEST_CODE))
      .setAutoCancel(true)
      .setOngoing(false)
      .build()

    NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, notification)

    // 채널 진동은 무음 모드에서 시스템이 막으므로, 알람 usage로 직접 진동시킨다.
    if (mode != "silent") {
      AlarmVibration.vibrate(context, AlarmVibration.patternFor(mode))
    }

    // Activity를 리시버에서 직접 열지 않는다. 시스템 fullScreenIntent가 잠금 화면을,
    // 실행 중인 앱의 JS 타이머가 포그라운드 1분 화면을 담당한다.
  }

  private fun createChannel(context: Context, textContext: Context, mode: String, language: String): String {
    // v2: 채널 진동을 완전히 끈다. 진동은 AlarmVibration이 알람 usage로 직접 담당해
    // 무음 모드에서도 동작하고, 벨소리 모드에서 이중 진동도 나지 않는다.
    val channelId = "teum-fullscreen-v3-$language-$mode"
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return channelId

    val manager = context.getSystemService(NotificationManager::class.java)
    val channel = NotificationChannel(
      channelId,
      channelName(textContext, mode),
      NotificationManager.IMPORTANCE_HIGH
    ).apply {
      description = textContext.getString(R.string.notification_channel_description)
      setSound(null, null)
      enableLights(true)
      lightColor = Color.rgb(236, 171, 55)
      lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
      enableVibration(false)
    }
    manager.createNotificationChannel(channel)
    manager.deleteNotificationChannel("teum-fullscreen-v1-$mode")
    manager.deleteNotificationChannel("teum-fullscreen-v2-$mode")
    return channelId
  }

  private fun channelName(context: Context, mode: String) = context.getString(when (mode) {
    "gentle" -> R.string.mode_gentle
    "clear" -> R.string.mode_clear
    "strong" -> R.string.mode_strong
    else -> R.string.mode_silent
  })

  private fun localizedContext(context: Context, language: String): Context {
    val configuration = Configuration(context.resources.configuration)
    configuration.setLocale(Locale.forLanguageTag(language))
    return context.createConfigurationContext(configuration)
  }

  companion object {
    const val EXTRA_MODE = "teum_mode"
    const val EXTRA_LANGUAGE = "teum_language"
    const val EXTRA_TEST = "teum_test"
    private const val NOTIFICATION_ID = 5201
    private const val OPEN_REQUEST_CODE = 5202
    private const val SNOOZE_REQUEST_CODE = 5203
    private const val DONE_REQUEST_CODE = 5204
    private const val SKIP_REQUEST_CODE = 5205
  }
}
