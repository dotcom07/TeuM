import { ReactNode, useEffect, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, MIN_TOUCH, spacing } from "../theme";
import { pad2 } from "../lib/time";

/** "45분" / "1시간" / "1시간 25분" */
export function fmtDuration(min: number) {
  if (min < 60) return `${min}분`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}시간` : `${h}시간 ${m}분`;
}

/** 길게 누르면 반복 입력되는 베벨 스테퍼 버튼 */
function StepButton({
  label,
  a11yLabel,
  onStep
}: {
  label: string;
  a11yLabel: string;
  onStep: () => void;
}) {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const delay = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = () => {
    if (delay.current) clearTimeout(delay.current);
    if (timer.current) clearInterval(timer.current);
    delay.current = null;
    timer.current = null;
  };

  useEffect(() => stop, []);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      onPress={onStep}
      onPressIn={() => {
        delay.current = setTimeout(() => {
          timer.current = setInterval(onStep, 110);
        }, 380);
      }}
      onPressOut={stop}
      style={({ pressed }) => [styles.step, pressed && styles.stepPressed]}
    >
      <Text style={styles.stepText}>{label}</Text>
    </Pressable>
  );
}

function Sheet({
  visible,
  title,
  children,
  onCancel,
  onConfirm
}: {
  visible: boolean;
  title: string;
  children: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.sheet} onPress={() => undefined}>
          <Text style={styles.title}>{title}</Text>
          {children}
          <View style={styles.footerRow}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [styles.cancel, pressed && styles.cancelPressed]}
            >
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onConfirm}
              style={({ pressed }) => [styles.confirm, pressed && styles.confirmPressed]}
            >
              <Text style={styles.confirmText}>확인</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/**
 * 시각 선택 시트 — 시(±1)·분(±5)을 스테퍼로 고른다.
 * 안드로이드 기본 시계 대신 파사드 디자인에 맞춘 자체 UI.
 */
export function TimeSheet({
  visible,
  title,
  initialMin,
  onCancel,
  onConfirm
}: {
  visible: boolean;
  title: string;
  /** 자정 기준 분 */
  initialMin: number;
  onCancel: () => void;
  onConfirm: (min: number) => void;
}) {
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    if (!visible) return;
    setHour(Math.floor(initialMin / 60) % 24);
    setMinute(Math.round((initialMin % 60) / 5) * 5 % 60);
  }, [visible, initialMin]);

  const meridiem = hour < 12 ? "오전" : "오후";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return (
    <Sheet
      visible={visible}
      title={title}
      onCancel={onCancel}
      onConfirm={() => onConfirm(hour * 60 + minute)}
    >
      <Text style={styles.preview}>{`${meridiem} ${hour12}:${pad2(minute)}`}</Text>
      <View style={styles.clockRow}>
        <View style={styles.digitColumn}>
          <StepButton label="▲" a11yLabel="1시간 늘리기" onStep={() => setHour((h) => (h + 1) % 24)} />
          <View style={styles.digitPlate}>
            <Text style={styles.digitText}>{pad2(hour)}</Text>
          </View>
          <StepButton label="▼" a11yLabel="1시간 줄이기" onStep={() => setHour((h) => (h + 23) % 24)} />
          <Text style={styles.digitCaption}>시</Text>
        </View>
        <Text style={styles.colon}>:</Text>
        <View style={styles.digitColumn}>
          <StepButton label="▲" a11yLabel="5분 늘리기" onStep={() => setMinute((m) => (m + 5) % 60)} />
          <View style={styles.digitPlate}>
            <Text style={styles.digitText}>{pad2(minute)}</Text>
          </View>
          <StepButton label="▼" a11yLabel="5분 줄이기" onStep={() => setMinute((m) => (m + 55) % 60)} />
          <Text style={styles.digitCaption}>분</Text>
        </View>
      </View>
    </Sheet>
  );
}

const DURATION_MIN = 15;
const DURATION_MAX = 240;
const DURATION_PRESETS = [30, 45, 60, 90, 120];

/** 알림 간격 선택 시트 — 프리셋 + 5분 단위 자유 조절 */
export function DurationSheet({
  visible,
  title,
  initialMin,
  onCancel,
  onConfirm
}: {
  visible: boolean;
  title: string;
  initialMin: number;
  onCancel: () => void;
  onConfirm: (min: number) => void;
}) {
  const [value, setValue] = useState(60);

  useEffect(() => {
    if (!visible) return;
    setValue(Math.min(DURATION_MAX, Math.max(DURATION_MIN, Math.round(initialMin / 5) * 5)));
  }, [visible, initialMin]);

  const add = (delta: number) =>
    setValue((v) => Math.min(DURATION_MAX, Math.max(DURATION_MIN, v + delta)));

  return (
    <Sheet visible={visible} title={title} onCancel={onCancel} onConfirm={() => onConfirm(value)}>
      <View style={styles.presetRow}>
        {DURATION_PRESETS.map((min) => (
          <Pressable
            key={min}
            accessibilityRole="button"
            accessibilityState={{ selected: value === min }}
            onPress={() => setValue(min)}
            style={[styles.preset, value === min && styles.presetActive]}
          >
            <Text style={[styles.presetText, value === min && styles.presetTextActive]}>
              {fmtDuration(min)}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.durationRow}>
        <StepButton label="−15" a11yLabel="15분 줄이기" onStep={() => add(-15)} />
        <StepButton label="−5" a11yLabel="5분 줄이기" onStep={() => add(-5)} />
        <View style={styles.durationPlate}>
          <Text style={styles.durationText}>{fmtDuration(value)}</Text>
        </View>
        <StepButton label="+5" a11yLabel="5분 늘리기" onStep={() => add(5)} />
        <StepButton label="+15" a11yLabel="15분 늘리기" onStep={() => add(15)} />
      </View>
      <Text style={styles.hint}>{`${DURATION_MIN}분부터 ${fmtDuration(DURATION_MAX)}까지, 5분 단위로 고를 수 있어요.`}</Text>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(17, 19, 26, 0.55)" },
  sheet: {
    padding: 18,
    paddingBottom: 30,
    backgroundColor: colors.platinum,
    borderTopWidth: 3,
    borderTopColor: colors.highlight
  },
  title: { marginBottom: 14, color: colors.carbon, fontSize: 16, fontWeight: "900" },
  preview: {
    marginBottom: 14,
    color: colors.chromeIndigo,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center"
  },
  clockRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: spacing.md
  },
  digitColumn: { alignItems: "center", gap: spacing.sm },
  digitPlate: {
    minWidth: 92,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderTopColor: colors.hairline,
    borderLeftColor: colors.hairline,
    borderRightColor: colors.highlight,
    borderBottomColor: colors.highlight
  },
  digitText: {
    color: colors.carbon,
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    fontVariant: ["tabular-nums"]
  },
  digitCaption: { color: colors.mutedIndigo, fontSize: 11, fontWeight: "700" },
  colon: { marginTop: 58, color: colors.carbon, fontSize: 28, fontWeight: "900" },
  step: {
    minWidth: 56,
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
  stepPressed: { backgroundColor: colors.periwinkle },
  stepText: { color: colors.carbon, fontSize: 15, fontWeight: "900" },
  presetRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 14 },
  preset: {
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderTopColor: colors.highlight,
    borderLeftColor: colors.highlight,
    borderRightColor: colors.hairline,
    borderBottomColor: colors.hairline
  },
  presetActive: { backgroundColor: colors.amber },
  presetText: { color: colors.mutedIndigo, fontSize: 12, fontWeight: "700" },
  presetTextActive: { color: colors.carbon },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm
  },
  durationPlate: {
    flex: 1,
    maxWidth: 170,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderTopColor: colors.hairline,
    borderLeftColor: colors.hairline,
    borderRightColor: colors.highlight,
    borderBottomColor: colors.highlight
  },
  durationText: {
    color: colors.carbon,
    fontSize: 19,
    fontWeight: "900",
    textAlign: "center",
    fontVariant: ["tabular-nums"]
  },
  hint: { marginTop: 12, color: colors.chromeIndigo, fontSize: 11, lineHeight: 16 },
  footerRow: { flexDirection: "row", gap: spacing.sm, marginTop: 20 },
  cancel: {
    flex: 1,
    minHeight: MIN_TOUCH,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderTopColor: colors.highlight,
    borderLeftColor: colors.highlight,
    borderRightColor: colors.hairline,
    borderBottomColor: colors.hairline
  },
  cancelPressed: { backgroundColor: colors.ice },
  cancelText: { color: colors.mutedIndigo, fontSize: 13, fontWeight: "700" },
  confirm: {
    flex: 2,
    minHeight: MIN_TOUCH,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.signal,
    borderWidth: 2,
    borderTopColor: colors.amberHighlight,
    borderLeftColor: colors.amberHighlight,
    borderRightColor: colors.signalDeep,
    borderBottomColor: colors.signalDeep
  },
  confirmPressed: { backgroundColor: colors.navGold },
  confirmText: { color: colors.carbon, fontSize: 13, fontWeight: "700" }
});
