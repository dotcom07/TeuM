import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TimeSheet } from "../components/TimePickerSheet";
import { AmberButton, Eyebrow, InfoRow, Panel, Plate, PrimaryButton } from "../components/ui";
import { useI18n } from "../i18n";
import { modeLabel } from "../lib/notifications";
import {
  endOfWorkToday,
  fmtHM,
  fmtDayTime,
  fmtRemaining,
  intervalMs,
  isWithinWork,
  nextTickFromWorkStart
} from "../lib/time";
import { colors, MIN_TOUCH } from "../theme";
import { Rhythm, Settings } from "../types";

export default function Home({
  settings,
  rhythm,
  now,
  permissionOk,
  doneToday,
  onOpenRecords,
  onPause,
  onResume,
  onOpenSystemSettings
}: {
  settings: Settings;
  rhythm: Rhythm;
  now: number;
  permissionOk: boolean;
  /** 기록 모드가 꺼져 있으면 null — 홈에 기록 진입을 노출하지 않는다. */
  doneToday: number | null;
  onOpenRecords: () => void;
  onPause: (untilMs: number | null) => void;
  onResume: () => void;
  onOpenSystemSettings: () => void;
}) {
  const { language, tr } = useI18n();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [customPicker, setCustomPicker] = useState(false);

  const paused = rhythm.status === "paused";
  const pausedUntilResume = paused && rhythm.pausedUntil == null;
  const suggesting =
    !paused && rhythm.nextTickAt != null && now >= rhythm.nextTickAt && isWithinWork(now, settings);
  const remainingMs = rhythm.nextTickAt != null ? rhythm.nextTickAt - now : null;
  const offDuty = !paused && !suggesting && (rhythm.nextTickAt == null || !isWithinWork(now, settings));
  const progress =
    remainingMs != null && remainingMs > 0
      ? Math.min(1, Math.max(0, remainingMs / intervalMs(settings)))
      : 0;

  const workHours = `${fmtHM(settings.startMin)}–${fmtHM(settings.endMin)}`;
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {settings.notificationsOn && !permissionOk && (
        <Panel title="NOTICE" background={colors.ice}>
          <Text style={styles.noticeCopy}>{tr("알림을 켜면 틈새움을 시작할 수 있어요.", "Turn on notifications to start TeuM.")}</Text>
          <AmberButton label={tr("시스템 설정 열기", "Open system settings")} onPress={onOpenSystemSettings} />
        </Panel>
      )}

      {paused ? (
        <Plate background={colors.canvasSoft} style={styles.heroPlate}>
          <Eyebrow>PAUSED</Eyebrow>
          <Text style={styles.heroTitle}>
            {pausedUntilResume
              ? tr("건강 알람을\n멈춰 두었어요.", "Your health reminders\nare paused.")
              : tr("지금은\n쉬어 가는 중이에요.", "Reminders are\npaused for now.")}
          </Text>
          <Text style={styles.heroCopy}>
            {pausedUntilResume
              ? tr("다시 시작을 누를 때까지 알리지 않아요.", "You won’t be reminded until you resume.")
              : language === "ko"
                ? `건강 알람이 잠시 멈춰 있어요.\n${fmtDayTime(rhythm.pausedUntil!, now, language)}에 다시 알려드릴게요.`
                : `Your health reminders are paused.\nNext reminder: ${fmtDayTime(rhythm.pausedUntil!, now, language)}.`}
          </Text>
          <PrimaryButton label={tr("알람 다시 시작", "Resume reminders")} onPress={onResume} style={styles.heroButton} />
        </Plate>
      ) : suggesting ? (
        <Plate background={colors.systemsTeal} style={styles.heroPlate}>
          <Eyebrow>PAUSE SIGNAL</Eyebrow>
          <Text style={styles.heroTitleLight}>{tr("1분의 틈을\n여는 중이에요.", "Your one-minute\nbreak is starting.")}</Text>
          <Text style={styles.heroCopyLight}>{tr("물 한 모금과 가벼운 움직임으로 몸을 잠깐 쉬어 주세요.", "Take a sip of water and gently move your body.")}</Text>
        </Plate>
      ) : (
        <Plate background={colors.systemsTeal} style={styles.heroPlate}>
          <Eyebrow>NEXT PAUSE SIGNAL</Eyebrow>
          {offDuty ? (
            <>
              <Text style={styles.heroTitleLight}>{tr("다음 건강 알람은", "Your next health reminder")}</Text>
              <Text style={styles.heroNumberSmall}>
                {rhythm.nextTickAt != null ? fmtDayTime(rhythm.nextTickAt, now, language) : "—"}
              </Text>
              <Text style={styles.heroCopyLight}>
                {tr("지금은 업무 시간이 아니에요.\n그때 다시 만나요.", "You’re outside work hours.\nWe’ll see you then.")}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.heroTitleLight}>{tr("다음 건강 알람까지", "Until your next health reminder")}</Text>
              <Text style={styles.heroNumber}>
                {remainingMs == null ? "—" : fmtRemaining(remainingMs, language)}
              </Text>
              <Text style={styles.heroCopyLight}>
                {tr("물 한 모금과 1분의 움직임,\n가능한 순간에 가볍게 챙겨요.", "A sip of water and one minute to move,\nwhenever the moment works for you.")}
              </Text>
              <View style={styles.meter} accessibilityElementsHidden>
                <View style={[styles.meterFill, { width: `${Math.round(progress * 100)}%` }]} />
              </View>
            </>
          )}
        </Plate>
      )}

      <Panel title="TODAY'S RHYTHM">
        <InfoRow label={tr("오늘의 업무 시간", "Today’s work hours")} value={workHours} />
        <InfoRow label={tr("알람 방식", "Alert style")} value={modeLabel(settings.mode, language)} />
        <InfoRow
          label={tr("현재 상태", "Status")}
          value={paused
            ? pausedUntilResume
              ? tr("다시 시작 전까지 멈춤", "Paused until you resume")
              : tr("잠시 멈춤", "Paused")
            : suggesting
              ? tr("1분의 틈 진행 중", "One-minute break in progress")
              : offDuty
                ? tr("업무 시간 아님", "Outside work hours")
                : tr("알람 대기 중", "Waiting for next reminder")}
          last
        />
      </Panel>

      {doneToday != null && (
        <Panel title={tr("나의 틈 기록", "My breaks")}>
          <Text style={styles.panelCopy}>
            {doneToday > 0
              ? language === "ko" ? `오늘 ${doneToday}번 챙겼어요.` : `You took ${doneToday} break${doneToday === 1 ? "" : "s"} today.`
              : tr("오늘의 틈이 아직 남아 있어요.", "Your first break of the day is still waiting.")}
          </Text>
          <AmberButton label={tr("기록 보기", "View record")} onPress={onOpenRecords} />
        </Panel>
      )}

      {!paused && (
        <Panel title="CONTROL PANEL">
          <Text style={styles.panelCopy}>{tr("건강 알람이 켜져 있어요.", "Health reminders are on.")}</Text>
          <AmberButton label={tr("알람 멈추기", "Pause reminders")} onPress={() => setSheetOpen(true)} />
        </Panel>
      )}

      <Modal transparent visible={sheetOpen} animationType="slide" onRequestClose={() => setSheetOpen(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setSheetOpen(false)}>
          <Pressable
            style={[styles.sheet, { paddingBottom: Math.max(30, insets.bottom + 16) }]}
            onPress={() => undefined}
          >
            <Text style={styles.sheetTitle}>{tr("얼마나 멈춰둘까요?", "How long should we pause?")}</Text>
            <SheetOption
              label={tr("30분", "30 minutes")}
              onPress={() => {
                setSheetOpen(false);
                onPause(now + 30 * 60000);
              }}
            />
            <SheetOption
              label={tr("오늘은 그만", "For today")}
              onPress={() => {
                setSheetOpen(false);
                const nextWorkdayAlarm = nextTickFromWorkStart(
                  endOfWorkToday(now, settings) + 1,
                  settings
                );
                if (nextWorkdayAlarm != null) onPause(nextWorkdayAlarm);
              }}
            />
            <SheetOption
              label={tr("시간 정하기", "Choose a time")}
              onPress={() => {
                setSheetOpen(false);
                setCustomPicker(true);
              }}
            />
            <SheetOption
              label={tr("직접 다시 시작할 때까지", "Until I resume")}
              separated
              onPress={() => {
                setSheetOpen(false);
                onPause(null);
              }}
            />
            <SheetOption label={tr("닫기", "Close")} muted onPress={() => setSheetOpen(false)} />
          </Pressable>
        </Pressable>
      </Modal>

      <TimeSheet
        visible={customPicker}
        title={tr("언제 다시 시작할까요?", "When should reminders resume?")}
        initialMin={(() => {
          const d = new Date(now + 30 * 60000);
          return d.getHours() * 60 + d.getMinutes();
        })()}
        onCancel={() => setCustomPicker(false)}
        onConfirm={(min) => {
          setCustomPicker(false);
          let until = new Date(now);
          until.setHours(Math.floor(min / 60), min % 60, 0, 0);
          // 이미 지난 시각을 고르면 내일 그 시각으로 해석한다.
          if (until.getTime() <= now) until = new Date(until.getTime() + 24 * 3600 * 1000);
          onPause(until.getTime());
        }}
      />
    </ScrollView>
  );
}

function SheetOption({
  label,
  muted = false,
  separated = false,
  onPress
}: {
  label: string;
  muted?: boolean;
  separated?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.sheetOption,
        separated && styles.sheetOptionSeparated,
        pressed && styles.sheetOptionPressed
      ]}
    >
      <Text style={[styles.sheetOptionText, muted && styles.sheetOptionMuted]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 14 },
  noticeCopy: { color: colors.carbon, fontSize: 13, fontWeight: "700", marginBottom: 12 },
  heroPlate: { padding: 22 },
  heroTitle: {
    color: colors.carbon,
    fontSize: 27,
    lineHeight: 35,
    fontWeight: "900"
  },
  heroTitleLight: {
    color: colors.surface,
    fontSize: 27,
    lineHeight: 35,
    fontWeight: "900",
    textShadowColor: colors.chromeIndigo,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0
  },
  heroNumber: {
    color: colors.surface,
    fontSize: 52,
    lineHeight: 62,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
    textShadowColor: colors.chromeIndigo,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0
  },
  heroNumberSmall: {
    marginTop: 4,
    color: colors.surface,
    fontSize: 34,
    lineHeight: 44,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
    textShadowColor: colors.chromeIndigo,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0
  },
  heroCopy: { marginTop: 12, color: colors.carbon, fontSize: 13, lineHeight: 20, fontWeight: "700" },
  heroCopyLight: { marginTop: 12, color: colors.surface, fontSize: 13, lineHeight: 20, fontWeight: "700" },
  heroButton: { marginTop: 18 },
  meter: {
    height: 14,
    marginTop: 18,
    padding: 2,
    backgroundColor: colors.carbon,
    borderWidth: 1,
    borderColor: colors.ice
  },
  meterFill: { height: "100%", backgroundColor: colors.signal },
  panelCopy: { color: colors.carbon, marginBottom: 12, fontSize: 12 },
  sheetBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(17, 19, 26, 0.55)" },
  sheet: {
    padding: 18,
    paddingBottom: 28,
    backgroundColor: colors.platinum,
    borderTopWidth: 3,
    borderTopColor: colors.highlight
  },
  sheetTitle: { marginBottom: 12, color: colors.carbon, fontSize: 16, fontWeight: "900" },
  sheetOption: {
    minHeight: MIN_TOUCH,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderTopColor: colors.highlight,
    borderLeftColor: colors.highlight,
    borderRightColor: colors.hairline,
    borderBottomColor: colors.hairline
  },
  sheetOptionSeparated: { marginTop: 8 },
  sheetOptionPressed: { backgroundColor: colors.ice },
  sheetOptionText: { color: colors.carbon, fontSize: 14, fontWeight: "700" },
  sheetOptionMuted: { color: colors.mutedIndigo, fontWeight: "400" }
});
