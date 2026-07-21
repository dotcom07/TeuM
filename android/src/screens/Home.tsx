import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { TimeSheet } from "../components/TimePickerSheet";
import { AmberButton, Eyebrow, InfoRow, Panel, Plate, PrimaryButton } from "../components/ui";
import { modeLabel } from "../lib/notifications";
import {
  endOfWorkToday,
  fmtHM,
  fmtKoreanDayTime,
  fmtKoreanTime,
  fmtRemaining,
  intervalMs,
  isWithinWork
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
  onPause: (untilMs: number) => void;
  onResume: () => void;
  onOpenSystemSettings: () => void;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [customPicker, setCustomPicker] = useState(false);

  const paused = rhythm.status === "paused";
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
          <Text style={styles.noticeCopy}>알림을 켜면 틈새움을 시작할 수 있어요.</Text>
          <AmberButton label="시스템 설정 열기" onPress={onOpenSystemSettings} />
        </Panel>
      )}

      {paused ? (
        <Plate background={colors.canvasSoft} style={styles.heroPlate}>
          <Eyebrow>PAUSED</Eyebrow>
          <Text style={styles.heroTitle}>지금은{"\n"}쉬어 가는 중이에요.</Text>
          <Text style={styles.heroCopy}>
            건강 알람이 잠시 멈춰 있어요.
            {rhythm.pausedUntil != null &&
              `\n${fmtKoreanTime(rhythm.pausedUntil)}에 다시 알려드릴게요.`}
          </Text>
          <PrimaryButton label="다시 시작" onPress={onResume} style={styles.heroButton} />
        </Plate>
      ) : suggesting ? (
        <Plate background={colors.systemsTeal} style={styles.heroPlate}>
          <Eyebrow>PAUSE SIGNAL</Eyebrow>
          <Text style={styles.heroTitleLight}>1분의 틈을{"\n"}여는 중이에요.</Text>
          <Text style={styles.heroCopyLight}>물 한 모금과 가벼운 움직임으로 몸을 잠깐 쉬어 주세요.</Text>
        </Plate>
      ) : (
        <Plate background={colors.systemsTeal} style={styles.heroPlate}>
          <Eyebrow>NEXT PAUSE SIGNAL</Eyebrow>
          {offDuty ? (
            <>
              <Text style={styles.heroTitleLight}>다음 건강 알람은</Text>
              <Text style={styles.heroNumberSmall}>
                {rhythm.nextTickAt != null ? fmtKoreanDayTime(rhythm.nextTickAt, now) : "—"}
              </Text>
              <Text style={styles.heroCopyLight}>
                지금은 업무 시간이 아니에요.{"\n"}그때 다시 만나요.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.heroTitleLight}>다음 건강 알람까지</Text>
              <Text style={styles.heroNumber}>
                {remainingMs == null ? "—" : fmtRemaining(remainingMs)}
              </Text>
              <Text style={styles.heroCopyLight}>
                물 한 모금과 1분의 움직임,{"\n"}흐름을 해치지 않을 때 해요.
              </Text>
              <View style={styles.meter} accessibilityElementsHidden>
                <View style={[styles.meterFill, { width: `${Math.round(progress * 100)}%` }]} />
              </View>
            </>
          )}
        </Plate>
      )}

      <Panel title="TODAY'S RHYTHM">
        <InfoRow label="오늘의 업무 시간" value={workHours} />
        <InfoRow label="알람 방식" value={modeLabel(settings.mode)} />
        <InfoRow
          label="현재 상태"
          value={paused ? "잠시 멈춤" : suggesting ? "1분의 틈 진행 중" : offDuty ? "업무 시간 아님" : "알람 대기 중"}
          last
        />
      </Panel>

      {doneToday != null && (
        <Panel title="나의 틈 기록">
          <Text style={styles.panelCopy}>
            {doneToday > 0 ? `오늘 ${doneToday}번 챙겼어요.` : "오늘의 틈이 아직 남아 있어요."}
          </Text>
          <AmberButton label="기록 보기" onPress={onOpenRecords} />
        </Panel>
      )}

      {!paused && (
        <Panel title="CONTROL PANEL">
          <Text style={styles.panelCopy}>건강 알람이 켜져 있어요.</Text>
          <AmberButton label="잠시 멈춤" onPress={() => setSheetOpen(true)} />
        </Panel>
      )}

      <Modal transparent visible={sheetOpen} animationType="slide" onRequestClose={() => setSheetOpen(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setSheetOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => undefined}>
            <Text style={styles.sheetTitle}>언제 다시 시작할까요?</Text>
            <SheetOption
              label="30분 뒤"
              onPress={() => {
                setSheetOpen(false);
                onPause(now + 30 * 60000);
              }}
            />
            <SheetOption
              label="오늘 업무 종료까지"
              onPress={() => {
                setSheetOpen(false);
                onPause(Math.max(now + 60000, endOfWorkToday(now, settings)));
              }}
            />
            <SheetOption
              label="직접 선택"
              onPress={() => {
                setSheetOpen(false);
                setCustomPicker(true);
              }}
            />
            <SheetOption label="닫기" muted onPress={() => setSheetOpen(false)} />
          </Pressable>
        </Pressable>
      </Modal>

      <TimeSheet
        visible={customPicker}
        title="언제 다시 시작할까요?"
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
  onPress
}: {
  label: string;
  muted?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.sheetOption, pressed && styles.sheetOptionPressed]}
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
  sheetOptionPressed: { backgroundColor: colors.ice },
  sheetOptionText: { color: colors.carbon, fontSize: 14, fontWeight: "700" },
  sheetOptionMuted: { color: colors.mutedIndigo, fontWeight: "400" }
});
