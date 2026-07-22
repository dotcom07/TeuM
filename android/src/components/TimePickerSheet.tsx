import { ReactNode, useEffect, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, MIN_TOUCH, spacing } from "../theme";
import { pad2 } from "../lib/time";
import { AppLanguage, useI18n } from "../i18n";

/** "45분" / "1시간" / "1시간 25분" */
export function fmtDuration(min: number, language: AppLanguage = "ko") {
  if (min < 60) return language === "ko" ? `${min}분` : `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (language === "ko") return m === 0 ? `${h}시간` : `${h}시간 ${m}분`;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
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
  const { tr } = useI18n();
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
              <Text style={styles.cancelText}>{tr("취소", "Cancel")}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onConfirm}
              style={({ pressed }) => [styles.confirm, pressed && styles.confirmPressed]}
            >
              <Text style={styles.confirmText}>{tr("확인", "Done")}</Text>
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
  const { language, tr } = useI18n();
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    if (!visible) return;
    setHour(Math.floor(initialMin / 60) % 24);
    setMinute(Math.round((initialMin % 60) / 5) * 5 % 60);
  }, [visible, initialMin]);

  const meridiem = language === "ko" ? (hour < 12 ? "오전" : "오후") : hour < 12 ? "AM" : "PM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const preview = language === "ko"
    ? `${meridiem} ${hour12}:${pad2(minute)}`
    : `${hour12}:${pad2(minute)} ${meridiem}`;

  return (
    <Sheet
      visible={visible}
      title={title}
      onCancel={onCancel}
      onConfirm={() => onConfirm(hour * 60 + minute)}
    >
      <Text style={styles.preview}>{preview}</Text>
      <View style={styles.clockRow}>
        <View style={styles.digitColumn}>
          <StepButton label="▲" a11yLabel={tr("1시간 늘리기", "Increase by 1 hour")} onStep={() => setHour((h) => (h + 1) % 24)} />
          <View style={styles.digitPlate}>
            <Text style={styles.digitText}>{pad2(hour)}</Text>
          </View>
          <StepButton label="▼" a11yLabel={tr("1시간 줄이기", "Decrease by 1 hour")} onStep={() => setHour((h) => (h + 23) % 24)} />
          <Text style={styles.digitCaption}>{tr("시", "hour")}</Text>
        </View>
        <Text style={styles.colon}>:</Text>
        <View style={styles.digitColumn}>
          <StepButton label="▲" a11yLabel={tr("5분 늘리기", "Increase by 5 minutes")} onStep={() => setMinute((m) => (m + 5) % 60)} />
          <View style={styles.digitPlate}>
            <Text style={styles.digitText}>{pad2(minute)}</Text>
          </View>
          <StepButton label="▼" a11yLabel={tr("5분 줄이기", "Decrease by 5 minutes")} onStep={() => setMinute((m) => (m + 55) % 60)} />
          <Text style={styles.digitCaption}>{tr("분", "minute")}</Text>
        </View>
      </View>
    </Sheet>
  );
}

const DURATION_MIN = 1;
const DURATION_MAX = 24 * 60;
const DURATION_PRESETS = [30, 45, 60, 90, 120];

/** 알림 간격 선택 시트 — 1분~24시간, 직접 입력 또는 빠른 조절 */
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
  const { language, tr } = useI18n();
  const [value, setValue] = useState(60);
  const [editing, setEditing] = useState(false);
  const [hours, setHours] = useState("1");
  const [minutes, setMinutes] = useState("0");

  useEffect(() => {
    if (!visible) return;
    const next = Math.min(DURATION_MAX, Math.max(DURATION_MIN, Math.round(initialMin)));
    setValue(next);
    setHours(String(Math.floor(next / 60)));
    setMinutes(String(next % 60));
    setEditing(false);
  }, [visible, initialMin]);

  const add = (delta: number) =>
    setValue((v) => Math.min(DURATION_MAX, Math.max(DURATION_MIN, v + delta)));

  const inputValue = () => {
    const hour = Math.min(24, Math.max(0, Number.parseInt(hours || "0", 10) || 0));
    const minute = Math.min(59, Math.max(0, Number.parseInt(minutes || "0", 10) || 0));
    return Math.min(DURATION_MAX, Math.max(DURATION_MIN, hour * 60 + minute));
  };

  const beginEditing = () => {
    setHours(String(Math.floor(value / 60)));
    setMinutes(String(value % 60));
    setEditing(true);
  };

  const applyInput = () => {
    const next = inputValue();
    setValue(next);
    setHours(String(Math.floor(next / 60)));
    setMinutes(String(next % 60));
    setEditing(false);
  };

  return (
    <Sheet
      visible={visible}
      title={title}
      onCancel={onCancel}
      onConfirm={() => {
        const next = editing ? inputValue() : value;
        if (editing) applyInput();
        onConfirm(next);
      }}
    >
      <View style={styles.presetRow}>
        {DURATION_PRESETS.map((min) => (
          <Pressable
            key={min}
            accessibilityRole="button"
            accessibilityState={{ selected: value === min }}
            onPress={() => {
              setValue(min);
              setHours(String(Math.floor(min / 60)));
              setMinutes(String(min % 60));
              setEditing(false);
            }}
            style={[styles.preset, value === min && styles.presetActive]}
          >
            <Text style={[styles.presetText, value === min && styles.presetTextActive]}>
              {fmtDuration(min, language)}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.durationRow}>
        <StepButton label="−15" a11yLabel={tr("15분 줄이기", "Decrease by 15 minutes")} onStep={() => { setEditing(false); add(-15); }} />
        <StepButton label="−5" a11yLabel={tr("5분 줄이기", "Decrease by 5 minutes")} onStep={() => { setEditing(false); add(-5); }} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={tr("알림 간격 직접 입력", "Enter reminder interval")}
          onPress={beginEditing}
          style={styles.durationPlate}
        >
          {editing ? (
            <View style={styles.durationInputRow}>
              <TextInput
                autoFocus
                value={hours}
                onChangeText={(text) => setHours(text.replace(/[^0-9]/g, "").slice(0, 2))}
                keyboardType="number-pad"
                maxLength={2}
                selectTextOnFocus
                style={styles.durationInput}
                accessibilityLabel={tr("시간 입력", "Hours")}
              />
              <Text style={styles.durationUnit}>{tr("시간", "h")}</Text>
              <TextInput
                value={minutes}
                onChangeText={(text) => setMinutes(text.replace(/[^0-9]/g, "").slice(0, 2))}
                keyboardType="number-pad"
                maxLength={2}
                selectTextOnFocus
                style={styles.durationInput}
                accessibilityLabel={tr("분 입력", "Minutes")}
              />
              <Text style={styles.durationUnit}>{tr("분", "m")}</Text>
            </View>
          ) : (
            <Text style={styles.durationText}>{fmtDuration(value, language)}</Text>
          )}
        </Pressable>
        <StepButton label="+5" a11yLabel={tr("5분 늘리기", "Increase by 5 minutes")} onStep={() => { setEditing(false); add(5); }} />
        <StepButton label="+15" a11yLabel={tr("15분 늘리기", "Increase by 15 minutes")} onStep={() => { setEditing(false); add(15); }} />
      </View>
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
  durationInputRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 },
  durationInput: {
    width: 44,
    padding: 0,
    color: colors.carbon,
    fontSize: 19,
    fontWeight: "900",
    textAlign: "center",
    fontVariant: ["tabular-nums"]
  },
  durationUnit: { color: colors.mutedIndigo, fontSize: 12, fontWeight: "700" },
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
