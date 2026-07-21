import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { TimeSheet } from "../components/TimePickerSheet";
import { Eyebrow, Plate, PrimaryButton } from "../components/ui";
import { DAY_LABELS, fmtHM } from "../lib/time";
import { modeLabel, previewVibration } from "../lib/notifications";
import { colors, MIN_TOUCH, spacing } from "../theme";
import { AlertMode, DEFAULT_SETTINGS, Settings } from "../types";

type Step = 0 | 1 | 2;

export default function Onboarding({
  onDone
}: {
  onDone: (settings: Settings) => void;
}) {
  const [step, setStep] = useState<Step>(0);
  const [startMin, setStartMin] = useState(DEFAULT_SETTINGS.startMin);
  const [endMin, setEndMin] = useState(DEFAULT_SETTINGS.endMin);
  const [days, setDays] = useState<number[]>(DEFAULT_SETTINGS.days);
  const [mode, setMode] = useState<AlertMode>("silent");
  const [picker, setPicker] = useState<"start" | "end" | null>(null);

  const toggleDay = (d: number) =>
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()));

  const finish = () => {
    onDone({ ...DEFAULT_SETTINGS, startMin, endMin, days, mode });
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {step === 0 && (
        <Plate background={colors.lavender} style={styles.welcomePlate}>
          <Eyebrow>WELCOME</Eyebrow>
          <Text style={styles.wordmark}>틈새움 TeuM</Text>
          <Text style={styles.tagline}>흐름을 지키는 작은 틈</Text>
          <Text style={styles.copy}>
            업무 중 1시간마다,{"\n"}물 한 모금과 1분의 움직임을 제안해요.
          </Text>
          <PrimaryButton label="시작하기" onPress={() => setStep(1)} style={styles.cta} />
          <Text style={styles.privacy}>건강 데이터를 수집하지 않아요.</Text>
        </Plate>
      )}

      {step === 1 && (
        <Plate background={colors.platinum} style={styles.formPlate}>
          <Eyebrow>STEP 2 / 3</Eyebrow>
          <Text style={styles.stepTitle}>언제 알려드릴까요?</Text>

          <TimeField label="업무 시작" value={startMin} onPress={() => setPicker("start")} />
          <TimeField label="업무 종료" value={endMin} onPress={() => setPicker("end")} />

          <Text style={styles.fieldLabel}>반복 요일</Text>
          <View style={styles.dayRow}>
            {DAY_LABELS.map((label, d) => (
              <DayChip key={d} label={label} active={days.includes(d)} onPress={() => toggleDay(d)} />
            ))}
          </View>
          {days.length === 0 && (
            <Text style={styles.hint}>요일을 하나 이상 선택하면 알림을 드릴 수 있어요.</Text>
          )}

          <PrimaryButton
            label="다음"
            onPress={() => days.length > 0 && setStep(2)}
            style={[styles.cta, days.length === 0 && styles.ctaDisabled]}
          />
        </Plate>
      )}

      {step === 2 && (
        <Plate background={colors.platinum} style={styles.formPlate}>
          <Eyebrow>STEP 3 / 3</Eyebrow>
          <Text style={styles.stepTitle}>어떻게 알려드릴까요?</Text>

          <RadioRow
            label="무음 — 화면으로만 조용히 알려드려요"
            active={mode === "silent"}
            onPress={() => setMode("silent")}
          />
          <RadioRow
            label={modeLabel("gentle")}
            active={mode === "gentle"}
            onPress={() => {
              setMode("gentle");
              previewVibration("gentle");
            }}
          />
          <RadioRow
            label={modeLabel("clear")}
            active={mode === "clear"}
            onPress={() => {
              setMode("clear");
              previewVibration("clear");
            }}
          />
          <RadioRow
            label={modeLabel("strong")}
            active={mode === "strong"}
            onPress={() => {
              setMode("strong");
              previewVibration("strong");
            }}
          />

          <Text style={styles.hint}>
            정해 둔 업무 시간에만 1시간 간격으로 알려드려요. 시작 후 잠금 화면에서도 바로 열 수 있도록 Android 권한을 한 번 확인해 주세요.
          </Text>
          <PrimaryButton label="틈새움 시작" onPress={finish} style={styles.cta} />
        </Plate>
      )}

      <TimeSheet
        visible={picker !== null}
        title={picker === "start" ? "업무 시작 시각" : "업무 종료 시각"}
        initialMin={picker === "start" ? startMin : endMin}
        onCancel={() => setPicker(null)}
        onConfirm={(min) => {
          if (picker === "start") setStartMin(min);
          else setEndMin(min);
          setPicker(null);
        }}
      />
    </ScrollView>
  );
}

function TimeField({ label, value, onPress }: { label: string; value: number; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label} ${fmtHM(value)}, 눌러서 변경`}
      style={styles.timeField}
    >
      <Text style={styles.fieldLabelInline}>{label}</Text>
      <Text style={styles.timeValue}>{fmtHM(value)}</Text>
    </Pressable>
  );
}

export function DayChip({
  label,
  active,
  onPress
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${label}요일 ${active ? "선택됨" : "선택 안 됨"}`}
      style={[styles.dayChip, active && styles.dayChipActive]}
    >
      <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function RadioRow({
  label,
  active,
  onPress
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      style={styles.radioRow}
    >
      <Text style={styles.radio}>{active ? "●" : "○"}</Text>
      <Text style={styles.radioText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 14, flexGrow: 1, justifyContent: "center" },
  welcomePlate: { padding: 26, alignItems: "stretch" },
  wordmark: {
    color: colors.surface,
    fontSize: 36,
    fontWeight: "900",
    textShadowColor: colors.chromeIndigo,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0
  },
  tagline: { marginTop: 4, color: colors.carbon, fontSize: 14, fontWeight: "700" },
  copy: { marginTop: 18, color: colors.carbon, fontSize: 14, lineHeight: 22, fontWeight: "700" },
  cta: { marginTop: 24 },
  ctaDisabled: { opacity: 0.45 },
  privacy: { marginTop: 14, color: colors.chromeIndigo, fontSize: 11, textAlign: "center" },
  formPlate: { padding: 20 },
  stepTitle: { marginBottom: 18, color: colors.carbon, fontSize: 24, fontWeight: "900" },
  timeField: {
    minHeight: MIN_TOUCH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline
  },
  fieldLabelInline: { color: colors.carbon, fontSize: 13, fontWeight: "700" },
  fieldLabel: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    color: colors.chromeIndigo,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5
  },
  timeValue: {
    minWidth: 76,
    paddingVertical: 6,
    color: colors.chromeIndigo,
    borderWidth: 1,
    borderColor: colors.chromeIndigo,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center"
  },
  dayRow: { flexDirection: "row", gap: 6 },
  dayChip: {
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
  dayChipActive: { backgroundColor: colors.amber },
  dayChipText: { color: colors.mutedIndigo, fontSize: 13, fontWeight: "700" },
  dayChipTextActive: { color: colors.carbon },
  hint: { marginTop: 12, color: colors.chromeIndigo, fontSize: 11, lineHeight: 16 },
  radioRow: {
    minHeight: MIN_TOUCH,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9
  },
  radio: { width: 26, color: colors.navGold, fontSize: 20, lineHeight: 22 },
  radioText: { flex: 1, color: colors.carbon, fontSize: 13, lineHeight: 19 }
});
