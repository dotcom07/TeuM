package com.teum.app

import android.content.Context
import java.util.Calendar
import java.util.TimeZone

data class ReminderSchedule(
  val atMs: Long,
  val mode: String,
  val language: String,
  val startMin: Int,
  val endMin: Int,
  val intervalMin: Int,
  val days: Set<Int>
)

object ReminderScheduleStore {
  private const val PREFS = "teum_reminder_schedule"
  private const val KEY_ENABLED = "enabled"
  private const val KEY_AT_MS = "at_ms"
  private const val KEY_MODE = "mode"
  private const val KEY_LANGUAGE = "language"
  private const val KEY_START_MIN = "start_min"
  private const val KEY_END_MIN = "end_min"
  private const val KEY_INTERVAL_MIN = "interval_min"
  private const val KEY_DAYS = "days"

  fun save(context: Context, schedule: ReminderSchedule) {
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
      .edit()
      .putBoolean(KEY_ENABLED, true)
      .putLong(KEY_AT_MS, schedule.atMs)
      .putString(KEY_MODE, schedule.mode)
      .putString(KEY_LANGUAGE, schedule.language)
      .putInt(KEY_START_MIN, schedule.startMin)
      .putInt(KEY_END_MIN, schedule.endMin)
      .putInt(KEY_INTERVAL_MIN, schedule.intervalMin)
      .putString(KEY_DAYS, schedule.days.sorted().joinToString(","))
      .apply()
  }

  fun load(context: Context): ReminderSchedule? {
    val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    if (!prefs.getBoolean(KEY_ENABLED, false)) return null
    val days = prefs.getString(KEY_DAYS, "")
      .orEmpty()
      .split(",")
      .mapNotNull(String::toIntOrNull)
      .filter { it in 0..6 }
      .toSet()
    val intervalMin = prefs.getInt(KEY_INTERVAL_MIN, 0)
    val startMin = prefs.getInt(KEY_START_MIN, 9 * 60)
    val endMin = prefs.getInt(KEY_END_MIN, 18 * 60)
    if (
      days.isEmpty() ||
      intervalMin !in 1..(24 * 60) ||
      startMin !in 0 until 24 * 60 ||
      endMin !in startMin until 24 * 60
    ) return null
    return ReminderSchedule(
      atMs = prefs.getLong(KEY_AT_MS, 0L),
      mode = prefs.getString(KEY_MODE, "silent") ?: "silent",
      language = prefs.getString(KEY_LANGUAGE, "ko") ?: "ko",
      startMin = startMin,
      endMin = endMin,
      intervalMin = intervalMin,
      days = days
    )
  }

  fun clear(context: Context) {
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().clear().apply()
  }
}

object ReminderTime {
  /**
   * 업무 시작 시각에 간격을 더한 슬롯 중 nowMs보다 뒤에 오는 첫 시각.
   * JS의 nextTickFromWorkStart와 같은 요일 체계(0=일요일 … 6=토요일)를 사용한다.
   */
  fun nextAlignedTick(
    nowMs: Long,
    schedule: ReminderSchedule,
    timeZone: TimeZone = TimeZone.getDefault()
  ): Long? {
    if (schedule.days.isEmpty() || schedule.intervalMin !in 1..(24 * 60)) return null
    if (schedule.startMin !in 0 until 24 * 60 || schedule.endMin !in 0 until 24 * 60) return null
    if (schedule.endMin < schedule.startMin) return null

    val base = Calendar.getInstance(timeZone).apply { timeInMillis = nowMs }
    val todayStart = workStart(base, schedule)
    val todayEnd = workEnd(todayStart, schedule)
    val todaySelected =
      todayStart.get(Calendar.DAY_OF_WEEK) - Calendar.SUNDAY in schedule.days
    val anchor =
      if (todaySelected && nowMs <= todayEnd) todayStart.timeInMillis
      else nextWindowStart(nowMs, schedule, timeZone)
    if (anchor == null) return null

    val workDurationMin = schedule.endMin - schedule.startMin
    if (schedule.intervalMin > workDurationMin) {
      val candidate = anchor + schedule.intervalMin * 60_000L
      return if (isWithinWork(candidate, schedule, timeZone)) candidate
      else nextWindowStart(candidate, schedule, timeZone)
    }

    var startMs: Long? = anchor
    for (dayOffset in 0..14) {
      val currentStartMs = startMs ?: break
      val start = Calendar.getInstance(timeZone).apply { timeInMillis = currentStartMs }
      val end = workEnd(start, schedule)
      var candidate = start.timeInMillis + schedule.intervalMin * 60_000L
      while (candidate <= nowMs && candidate <= end) {
        candidate += schedule.intervalMin * 60_000L
      }
      if (candidate > nowMs && candidate <= end) return candidate
      startMs = nextWindowStart(end, schedule, timeZone)
    }
    return null
  }

  fun restoredTrigger(
    nowMs: Long,
    schedule: ReminderSchedule,
    timeZone: TimeZone = TimeZone.getDefault()
  ): Long? =
    if (schedule.atMs > nowMs) schedule.atMs
    else nextAlignedTick(nowMs, schedule, timeZone)

  private fun nextWindowStart(
    afterMs: Long,
    schedule: ReminderSchedule,
    timeZone: TimeZone
  ): Long? {
    val base = Calendar.getInstance(timeZone).apply { timeInMillis = afterMs }
    for (dayOffset in 0..14) {
      val start = workStart(base, schedule).apply {
        add(Calendar.DAY_OF_MONTH, dayOffset)
      }
      val dayIndex = start.get(Calendar.DAY_OF_WEEK) - Calendar.SUNDAY
      if (start.timeInMillis > afterMs && dayIndex in schedule.days) {
        return start.timeInMillis
      }
    }
    return null
  }

  private fun isWithinWork(
    atMs: Long,
    schedule: ReminderSchedule,
    timeZone: TimeZone
  ): Boolean {
    val at = Calendar.getInstance(timeZone).apply { timeInMillis = atMs }
    val dayIndex = at.get(Calendar.DAY_OF_WEEK) - Calendar.SUNDAY
    if (dayIndex !in schedule.days) return false
    val minute = at.get(Calendar.HOUR_OF_DAY) * 60 + at.get(Calendar.MINUTE)
    return minute in schedule.startMin..schedule.endMin
  }

  private fun workStart(base: Calendar, schedule: ReminderSchedule) =
    (base.clone() as Calendar).apply {
      set(Calendar.HOUR_OF_DAY, schedule.startMin / 60)
      set(Calendar.MINUTE, schedule.startMin % 60)
      set(Calendar.SECOND, 0)
      set(Calendar.MILLISECOND, 0)
    }

  private fun workEnd(start: Calendar, schedule: ReminderSchedule) =
    (start.clone() as Calendar).apply {
      set(Calendar.HOUR_OF_DAY, schedule.endMin / 60)
      set(Calendar.MINUTE, schedule.endMin % 60)
    }.timeInMillis
}
