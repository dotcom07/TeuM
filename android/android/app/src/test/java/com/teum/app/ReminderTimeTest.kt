package com.teum.app

import java.util.Calendar
import java.util.TimeZone
import org.junit.Assert.assertEquals
import org.junit.Test

class ReminderTimeTest {
  private val utc = TimeZone.getTimeZone("UTC")
  private val base = ReminderSchedule(
    atMs = 0L,
    mode = "silent",
    language = "ko",
    startMin = 9 * 60,
    endMin = 18 * 60,
    intervalMin = 60,
    days = setOf(1, 2, 3, 4, 5)
  )

  @Test
  fun beforeWorkStartsAtFirstAlignedSlot() {
    assertEquals(
      at(2024, Calendar.JANUARY, 1, 10),
      ReminderTime.nextAlignedTick(at(2024, Calendar.JANUARY, 1, 8, 30), base, utc)
    )
  }

  @Test
  fun duringWorkUsesNextAlignedSlot() {
    assertEquals(
      at(2024, Calendar.JANUARY, 1, 12),
      ReminderTime.nextAlignedTick(at(2024, Calendar.JANUARY, 1, 11, 15), base, utc)
    )
  }

  @Test
  fun afterFridayWorkMovesToMonday() {
    assertEquals(
      at(2024, Calendar.JANUARY, 8, 10),
      ReminderTime.nextAlignedTick(at(2024, Calendar.JANUARY, 5, 18, 30), base, utc)
    )
  }

  @Test
  fun futureStoredTriggerIsPreserved() {
    val stored = base.copy(atMs = at(2024, Calendar.JANUARY, 1, 14))
    assertEquals(
      stored.atMs,
      ReminderTime.restoredTrigger(at(2024, Calendar.JANUARY, 1, 11), stored, utc)
    )
  }

  @Test
  fun expiredStoredTriggerReturnsNextAlignedSlot() {
    val stored = base.copy(atMs = at(2024, Calendar.JANUARY, 1, 10))
    assertEquals(
      at(2024, Calendar.JANUARY, 1, 12),
      ReminderTime.restoredTrigger(at(2024, Calendar.JANUARY, 1, 11, 15), stored, utc)
    )
  }

  @Test
  fun timeChangeCanRecalculateInsteadOfPreservingStoredTrigger() {
    val stored = base.copy(atMs = at(2024, Calendar.JANUARY, 1, 14))
    assertEquals(
      at(2024, Calendar.JANUARY, 1, 12),
      ReminderTime.nextAlignedTick(at(2024, Calendar.JANUARY, 1, 11, 15), stored, utc)
    )
  }

  @Test
  fun twentyFourHourIntervalMovesToNextWorkdayStart() {
    val daily = base.copy(intervalMin = 24 * 60)
    assertEquals(
      at(2024, Calendar.JANUARY, 2, 9),
      ReminderTime.nextAlignedTick(at(2024, Calendar.JANUARY, 1, 8, 30), daily, utc)
    )
  }

  private fun at(
    year: Int,
    month: Int,
    day: Int,
    hour: Int,
    minute: Int = 0
  ) = Calendar.getInstance(utc).apply {
    clear()
    set(year, month, day, hour, minute)
  }.timeInMillis
}
