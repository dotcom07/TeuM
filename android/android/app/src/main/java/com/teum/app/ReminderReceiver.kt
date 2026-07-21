package com.teum.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class ReminderReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    TeumReminderModule.breakRequested = true
    val mode = intent.getStringExtra(EXTRA_MODE) ?: "silent"
    val test = intent.getBooleanExtra(EXTRA_TEST, false)
    val channelId = createChannel(context, mode)
    val openIntent = Intent(Intent.ACTION_VIEW, Uri.parse("teum://break"), context, MainActivity::class.java).apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
    }
    val openPendingIntent = PendingIntent.getActivity(
      context,
      OPEN_REQUEST_CODE,
      openIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    val notification = NotificationCompat.Builder(context, channelId)
      .setSmallIcon(R.drawable.ic_stat_teum)
      .setContentTitle(if (test) "틈새움 테스트" else "틈새움")
      .setContentText("일하는 나를 위한 1분을 시작해요.")
      .setContentIntent(openPendingIntent)
      .setFullScreenIntent(openPendingIntent, true)
      .setPriority(NotificationCompat.PRIORITY_MAX)
      .setCategory(NotificationCompat.CATEGORY_ALARM)
      .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
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

  private fun createChannel(context: Context, mode: String): String {
    // v2: 채널 진동을 완전히 끈다. 진동은 AlarmVibration이 알람 usage로 직접 담당해
    // 무음 모드에서도 동작하고, 벨소리 모드에서 이중 진동도 나지 않는다.
    val channelId = "teum-fullscreen-v2-$mode"
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return channelId

    val manager = context.getSystemService(NotificationManager::class.java)
    val channel = NotificationChannel(
      channelId,
      channelName(mode),
      NotificationManager.IMPORTANCE_HIGH
    ).apply {
      description = "1분의 틈 전체 화면 알림"
      setSound(null, null)
      enableLights(true)
      lightColor = Color.rgb(236, 171, 55)
      lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
      enableVibration(false)
    }
    manager.createNotificationChannel(channel)
    manager.deleteNotificationChannel("teum-fullscreen-v1-$mode")
    return channelId
  }

  private fun channelName(mode: String) = when (mode) {
    "gentle" -> "가볍게 · 진동 1번"
    "clear" -> "또렷하게 · 진동 3번"
    "strong" -> "확실하게 · 진동 5번"
    else -> "무음 · 화면으로만"
  }

  companion object {
    const val EXTRA_MODE = "teum_mode"
    const val EXTRA_TEST = "teum_test"
    private const val NOTIFICATION_ID = 5201
    private const val OPEN_REQUEST_CODE = 5202
  }
}
