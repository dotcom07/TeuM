import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { TimeSheet } from "../components/TimePickerSheet";
import { Eyebrow, Plate, PrimaryButton } from "../components/ui";
import { useI18n } from "../i18n";
import { DAY_NAMES_EN, dayLabels, fmtHM } from "../lib/time";
import { modeLabel, previewVibration } from "../lib/notifications";
import { colors, MIN_TOUCH, spacing } from "../theme";
import { AlertMode, DEFAULT_SETTINGS, Settings } from "../types";

type Step = 0 | 1 | 2;

export default function Onboarding({
  onDone
}: {
  onDone: (settings: Settings) => void;
}) {
  const { language, tr } = useI18n();
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
          <Text style={styles.wordmark}>{tr("틈새움 TeuM", "TeuM")}</Text>
          <Text style={styles.tagline}>{tr("일하는 나를 위한 1분", "One minute for a healthier workday")}</Text>
          <Text style={styles.copy}>
            {tr(
              "업무 중 1시간마다,\n물 한 모금과 1분의 움직임을 제안해요.",
              "Every hour at work, take a sip of water\nand one minute to move."
            )}
          </Text>
          <PrimaryButton label={tr("시작하기", "Get started")} onPress={() => setStep(1)} style={styles.cta} />
          <Text style={styles.privacy}>{tr("건강 데이터를 수집하지 않아요.", "We don’t collect health data.")}</Text>
        </Plate>
      )}

      {step === 1 && (
        <Plate background={colors.platinum} style={styles.formPlate}>
          <Eyebrow>STEP 2 / 3</Eyebrow>
          <Text style={styles.stepTitle}>{tr("언제 알려드릴까요?", "When should we remind you?")}</Text>

          <TimeField label={tr("업무 시작", "Work starts")} value={startMin} onPress={() => setPicker("start")} />
          <TimeField label={tr("업무 종료", "Work ends")} value={endMin} onPress={() => setPicker("end")} />

          <Text style={styles.fieldLabel}>{tr("반복 요일", "Repeat on")}</Text>
          <View style={styles.dayRow}>
            {dayLabels(language).map((label, d) => (
              <DayChip key={d} dayIndex={d} label={label} active={days.includes(d)} onPress={() => toggleDay(d)} />
            ))}
          </View>
          {days.length === 0 && (
            <Text style={styles.hint}>{tr("요일을 하나 이상 선택하면 알림을 드릴 수 있어요.", "Choose at least one day for reminders.")}</Text>
          )}

          <PrimaryButton
            label={tr("다음", "Next")}
            onPress={() => days.length > 0 && setStep(2)}
            style={[styles.cta, days.length === 0 && styles.ctaDisabled]}
          />
        </Plate>
      )}

      {step === 2 && (
        <Plate background={colors.platinum} style={styles.formPlate}>
          <Eyebrow>STEP 3 / 3</Eyebrow>
          <Text style={styles.stepTitle}>{tr("어떻게 알려드릴까요?", "How should we alert you?")}</Text>

          <RadioRow
            label={tr("무음 — 화면으로만 조용히 알려드려요", "Silent — screen only")}
            active={mode === "silent"}
            onPress={() => setMode("silent")}
          />
          <RadioRow
            label={modeLabel("gentle", language)}
            active={mode === "gentle"}
            onPress={() => {
              setMode("gentle");
              previewVibration("gentle");
            }}
          />
          <RadioRow
            label={modeLabel("clear", language)}
            active={mode === "clear"}
            onPress={() => {
              setMode("clear");
              previewVibration("clear");
            }}
          />
          <RadioRow
            label={modeLabel("strong", language)}
            active={mode === "strong"}
            onPress={() => {
              setMode("strong");
              previewVibration("strong");
            }}
          />

          <Text style={styles.hint}>
            {tr(
              "정해 둔 업무 시간에만 1시간 간격으로 알려드려요. 시작 후 잠금 화면에서도 바로 열 수 있도록 Android 권한을 한 번 확인해 주세요.",
              "We’ll remind you hourly during work hours. Android will ask once for permission to open the one-minute screen from the lock screen."
            )}
          </Text>
          <PrimaryButton label={tr("틈새움 시작", "Start TeuM")} onPress={finish} style={styles.cta} />
        </Plate>
      )}

      <TimeSheet
        visible={picker !== null}
        title={picker === "start" ? tr("업무 시작 시각", "Work start time") : tr("업무 종료 시각", "Work end time")}
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
  const { tr } = useI18n();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label} ${fmtHM(value)}, ${tr("눌러서 변경", "tap to change")}`}
      style={styles.timeField}
    >
      <Text style={styles.fieldLabelInline}>{label}</Text>
      <Text style={styles.timeValue}>{fmtHM(value)}</Text>
    </Pressable>
  );
}

export function DayChip({
  dayIndex,
  label,
  active,
  onPress
}: {
  dayIndex: number;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { language, tr } = useI18n();
  const dayName = language === "ko" ? `${label}요일` : DAY_NAMES_EN[dayIndex];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${dayName}, ${active ? tr("선택됨", "selected") : tr("선택 안 됨", "not selected")}`}
      style={[styles.dayChip, active && styles.dayChipActive]}
    >
      <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function RadioRow({
  label,
  description,
  active,
  onPress
}: {
  label: string;
  description?: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      accessibilityLabel={description ? `${label}. ${description}` : label}
      style={styles.radioRow}
    >
      <Text style={styles.radio}>{active ? "●" : "○"}</Text>
      <View style={styles.radioCopy}>
        <Text style={styles.radioLabel}>{label}</Text>
        {description ? <Text style={styles.radioDescription}>{description}</Text> : null}
      </View>
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
  radioCopy: { flex: 1 },
  radioLabel: { color: colors.carbon, fontSize: 13, lineHeight: 19, fontWeight: "700" },
  radioDescription: { marginTop: 2, color: colors.chromeIndigo, fontSize: 11, lineHeight: 16 }
});
