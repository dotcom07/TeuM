import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Panel, PrimaryButton } from "../components/ui";
import { useI18n } from "../i18n";
import { doneCountsByDay, recordsForDate } from "../lib/records";
import { dayLabels, fmtTime } from "../lib/time";
import { colors, MIN_TOUCH } from "../theme";
import { BreakRecord } from "../types";

/**
 * A-11 기록 달력 + A-12 날짜별 시간대 기록.
 * 목표 압박 없이 스스로 챙긴 횟수만 돌아본다 — 성공률·연속 일수·경고는 없다.
 * 파사드 언어: 플래티넘 패널 + 카본 라벨 탭, 오늘은 앰버 칩, 관례색(빨강/초록) 금지.
 */
export default function Records({
  records,
  now,
  onBack
}: {
  records: BreakRecord[];
  now: number;
  onBack: () => void;
}) {
  const { language, tr } = useI18n();
  const today = new Date(now);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<number | null>(today.getDate());

  const counts = useMemo(
    () => doneCountsByDay(records, viewYear, viewMonth),
    [records, viewYear, viewMonth]
  );
  const todayCount =
    viewYear === today.getFullYear() && viewMonth === today.getMonth()
      ? counts.get(today.getDate()) ?? 0
      : null;

  const moveMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setSelected(null);
  };

  // 달력 그리드: 앞쪽 빈칸 + 날짜들
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (day: number) =>
    viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();

  const dayRecords =
    selected != null ? recordsForDate(records, viewYear, viewMonth, selected) : [];

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Panel title={tr("나의 틈 기록", "My breaks")}>
        <View style={styles.monthRow}>
          <MonthButton direction="left" a11y={tr("이전 달", "Previous month")} onPress={() => moveMonth(-1)} />
          <Text style={styles.monthLabel}>
            {language === "ko"
              ? `${viewYear}년 ${viewMonth + 1}월`
              : new Date(viewYear, viewMonth, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </Text>
          <MonthButton direction="right" a11y={tr("다음 달", "Next month")} onPress={() => moveMonth(1)} />
        </View>

        <View style={styles.weekHeader}>
          {dayLabels(language).map((label, index) => (
            <Text key={index} style={styles.weekHeaderText}>
              {label}
            </Text>
          ))}
        </View>

        {Array.from({ length: cells.length / 7 }, (_, row) => (
          <View key={row} style={styles.weekRow}>
            {cells.slice(row * 7, row * 7 + 7).map((day, col) => {
              if (day == null) {
                return <View key={col} style={styles.cellEmpty} />;
              }
              const count = counts.get(day);
              const active = selected === day;
              return (
                <Pressable
                  key={col}
                  onPress={() => setSelected(day)}
                  accessibilityRole="button"
                  accessibilityLabel={language === "ko"
                    ? `${viewMonth + 1}월 ${day}일${count ? `, ${count}회 챙김` : ""}`
                    : `${new Date(viewYear, viewMonth, day).toLocaleDateString("en-US", { month: "long", day: "numeric" })}${count ? `, ${count} break${count === 1 ? "" : "s"} taken` : ""}`}
                  style={[styles.cell, isToday(day) && styles.cellToday, active && styles.cellSelected]}
                >
                  <Text style={[styles.cellDay, isToday(day) && styles.cellDayToday]}>{day}</Text>
                  {/* 기록 없는 날은 0회 대신 빈칸 — 실패처럼 보이지 않게 */}
                  <Text style={styles.cellCount}>{count ? (language === "ko" ? `${count}회` : `${count}×`) : " "}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}

        {todayCount != null && (
          <Text style={styles.todayLine}>
            {todayCount > 0
              ? language === "ko" ? `오늘 ${todayCount}번 챙겼어요.` : `You took ${todayCount} break${todayCount === 1 ? "" : "s"} today.`
              : tr("오늘의 틈이 아직 남아 있어요.", "Your first break of the day is still waiting.")}
          </Text>
        )}
      </Panel>

      {selected != null && (
        <Panel title={language === "ko"
          ? `${viewMonth + 1}월 ${selected}일`
          : new Date(viewYear, viewMonth, selected).toLocaleDateString("en-US", { month: "long", day: "numeric" })}>
          {dayRecords.length === 0 ? (
            <Text style={styles.emptyCopy}>{tr("이날은 남긴 기록이 없어요.", "No record for this day.")}</Text>
          ) : (
            dayRecords.map((r, index) => (
              <View
                key={r.id}
                style={[styles.recordRow, index === dayRecords.length - 1 && styles.recordRowLast]}
              >
                <Text style={styles.recordTime}>{fmtTime(r.resolvedAt, language)}</Text>
                <Text style={[styles.recordLabel, r.result === "done" && styles.recordLabelDone]}>
                  {r.result === "done"
                    ? tr("챙겼어요", "Took a break")
                    : r.result === "skipped"
                      ? tr("이번 틈은 넘겼어요", "Skipped this break")
                      : tr("화면을 닫았어요", "Closed the screen")}
                  {r.snoozed ? tr(" · 5분 미룸", " · delayed 5 min") : ""}
                </Text>
              </View>
            ))
          )}
        </Panel>
      )}

      <PrimaryButton label={tr("홈으로 돌아가기", "Back to home")} onPress={onBack} />
    </ScrollView>
  );
}

function MonthButton({
  direction,
  a11y,
  onPress
}: {
  direction: "left" | "right";
  a11y: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      style={({ pressed }) => [styles.monthButton, pressed && styles.monthButtonPressed]}
    >
      <Image
        source={{
          uri: direction === "left" ? "ic_teum_chevron_left" : "ic_teum_chevron_right"
        }}
        resizeMode="contain"
        style={styles.monthChevron}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 14 },
  monthRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  monthLabel: { color: colors.carbon, fontSize: 17, fontWeight: "900" },
  monthButton: {
    minWidth: MIN_TOUCH,
    minHeight: MIN_TOUCH,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.canvasSoft,
    borderWidth: 2,
    borderTopColor: colors.highlight,
    borderLeftColor: colors.highlight,
    borderRightColor: colors.hairline,
    borderBottomColor: colors.hairline
  },
  monthButtonPressed: { backgroundColor: colors.periwinkle },
  monthChevron: {
    width: 14,
    height: 14
  },
  weekHeader: { flexDirection: "row", marginBottom: 6 },
  weekHeaderText: {
    flex: 1,
    color: colors.chromeIndigo,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center"
  },
  weekRow: { flexDirection: "row", gap: 4, marginBottom: 4 },
  cellEmpty: { flex: 1, minHeight: 52 },
  cell: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline
  },
  cellToday: { backgroundColor: colors.amber },
  cellSelected: { borderWidth: 2, borderColor: colors.chromeIndigo },
  cellDay: { color: colors.carbon, fontSize: 13, fontWeight: "700" },
  cellDayToday: { color: colors.carbon },
  cellCount: {
    minHeight: 15,
    color: colors.chromeIndigo,
    fontSize: 11,
    fontWeight: "700",
    fontVariant: ["tabular-nums"]
  },
  todayLine: { marginTop: 10, color: colors.carbon, fontSize: 13, fontWeight: "700" },
  emptyCopy: { color: colors.mutedIndigo, fontSize: 12, lineHeight: 18 },
  recordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderStyle: "dotted",
    borderColor: colors.mutedIndigo
  },
  recordRowLast: { borderBottomWidth: 0 },
  recordTime: {
    width: 76,
    color: colors.carbon,
    fontSize: 12,
    fontVariant: ["tabular-nums"]
  },
  recordLabel: { flex: 1, color: colors.mutedIndigo, fontSize: 12 },
  recordLabelDone: { color: colors.carbon, fontWeight: "700" }
});
