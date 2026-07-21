package com.teum.app

import android.content.Context
import android.media.AudioAttributes
import android.os.Build
import android.os.VibrationAttributes
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager

/**
 * 무음 모드에서도 울리는 진동.
 *
 * 알림 채널 진동은 벨소리 모드(무음)에 묶여 있어 무음이면 시스템이 막는다.
 * 알람 앱들처럼 Vibrator를 USAGE_ALARM 속성으로 직접 호출하면
 * 벨소리 모드와 무관하게 시스템의 "알람 진동" 설정만 따른다.
 */
object AlarmVibration {
  /**
   * 모드별 진동 패턴 — 길이가 아니라 횟수로 구분한다.
   * 가볍게=둥(1번), 또렷하게=둥둥둥(3번), 확실하게=둥둥둥둥둥(5번).
   */
  fun patternFor(mode: String): LongArray {
    val pulses = when (mode) {
      "gentle" -> 1
      "clear" -> 3
      "strong" -> 5
      else -> 0
    }
    if (pulses == 0) return longArrayOf(0)
    val pattern = mutableListOf(0L)
    repeat(pulses) { index ->
      pattern.add(350L)
      if (index < pulses - 1) pattern.add(250L)
    }
    return pattern.toLongArray()
  }

  fun vibrate(context: Context, pattern: LongArray) {
    if (pattern.size < 2) return
    val vibrator: Vibrator =
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val manager =
          context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
        manager.defaultVibrator
      } else {
        @Suppress("DEPRECATION")
        context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
      }
    if (!vibrator.hasVibrator()) return

    val effect = VibrationEffect.createWaveform(pattern, -1)
    when {
      Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU -> {
        vibrator.vibrate(
          effect,
          VibrationAttributes.createForUsage(VibrationAttributes.USAGE_ALARM)
        )
      }
      Build.VERSION.SDK_INT >= Build.VERSION_CODES.R -> {
        vibrator.vibrate(
          effect,
          VibrationAttributes.Builder().setUsage(VibrationAttributes.USAGE_ALARM).build()
        )
      }
      else -> {
        @Suppress("DEPRECATION")
        vibrator.vibrate(
          effect,
          AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_ALARM)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()
        )
      }
    }
  }
}
