import { useState } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { DurationSheet, fmtDuration, TimeSheet } from "../components/TimePickerSheet";
import { Panel, PrimaryButton } from "../components/ui";
import { modeLabel, previewVibration } from "../lib/notifications";
import { DAY_LABELS, fmtHM } from "../lib/time";
import { colors, MIN_TOUCH } from "../theme";
import { Settings as SettingsType } from "../types";
import { DayChip, RadioRow } from "./Onboarding";

const PRIVACY_POLICY_URL =
  "https://aluminum-language-c6a.notion.site/TeuM-3a447d4c6bf180f7a6f6e221089a5012?pvs=73";

/**
 * 설정 화면 (A-10). 변경은 즉시 반영·저장된다.
 * 알림 간격은 60분으로 고정 — 바꿀 수 있는 것은 업무 시간과 요일뿐이다.
 */
export default function SettingsScreen({
  settings,
  permissionOk,
  onChange,
  onOpenSystemSettings,
  fullScreenAllowed,
  onOpenFullScreenSettings,
  onBack,
  onTestNotification,
  onClearRecords
}: {
  settings: SettingsType;
  permissionOk: boolean;
  onChange: (next: SettingsType) => void;
  onOpenSystemSettings: () => void;
  fullScreenAllowed: boolean;
  onOpenFullScreenSettings: () => void;
  onBack: () => void;
  onTestNotification: () => void;
  onClearRecords: () => void;
}) {
  const [picker, setPicker] = useState<"start" | "end" | "interval" | null>(null);

  const patch = (partial: Partial<SettingsType>) => onChange({ ...settings, ...partial });

  const toggleDay = (d: number) => {
    const days = settings.days.includes(d)
      ? settings.days.filter((x) => x !== d)
      : [...settings.days, d].sort();
    if (days.length === 0) return; // 최소 하루는 남긴다
    patch({ days });
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Panel title="업무 시간">
        <TimeRow label="시작" value={settings.startMin} onPress={() => setPicker("start")} />
        <TimeRow label="종료" value={settings.endMin} onPress={() => setPicker("end")} />
        <Pressable
          onPress={() => setPicker("interval")}
          accessibilityRole="button"
          accessibilityLabel={`알람 간격 ${fmtDuration(settings.intervalMin)}, 눌러서 변경`}
          style={styles.timeRow}
        >
          <Text style={styles.rowLabel}>알람 간격</Text>
          <Text style={styles.timeValue}>{fmtDuration(settings.intervalMin)}</Text>
        </Pressable>
        <Text style={[styles.rowLabel, styles.sectionGap]}>반복 요일</Text>
        <View style={styles.dayRow}>
          {DAY_LABELS.map((label, d) => (
            <DayChip
              key={d}
              label={label}
              active={settings.days.includes(d)}
              onPress={() => toggleDay(d)}
            />
          ))}
        </View>
      </Panel>

      <Panel title="알람 방식">
        <View style={styles.switchRow}>
          <Text style={styles.rowLabel}>건강 알람</Text>
          <Switch
            value={settings.notificationsOn}
            onValueChange={(v) => patch({ notificationsOn: v })}
            trackColor={{ false: colors.mutedIndigo, true: colors.amber }}
            thumbColor={colors.surface}
          />
        </View>
        <RadioRow
          label="무음 — 화면으로만 조용히 알려드려요"
          active={settings.mode === "silent"}
          onPress={() => patch({ mode: "silent" })}
        />
        <RadioRow
          label={modeLabel("gentle")}
          active={settings.mode === "gentle"}
          onPress={() => {
            patch({ mode: "gentle" });
            previewVibration("gentle");
          }}
        />
        <RadioRow
          label={modeLabel("clear")}
          active={settings.mode === "clear"}
          onPress={() => {
            patch({ mode: "clear" });
            previewVibration("clear");
          }}
        />
        <RadioRow
          label={modeLabel("strong")}
          active={settings.mode === "strong"}
          onPress={() => {
            patch({ mode: "strong" });
            previewVibration("strong");
          }}
        />
        {settings.notificationsOn && !permissionOk && (
          <View style={styles.permissionBox}>
            <Text style={styles.permissionCopy}>
              시스템 알림 권한이 꺼져 있어 알림을 보낼 수 없어요.
            </Text>
            <Pressable
              onPress={onOpenSystemSettings}
              accessibilityRole="button"
              style={styles.permissionButton}
            >
              <Text style={styles.permissionButtonText}>시스템 설정 열기</Text>
            </Pressable>
          </View>
        )}
      </Panel>

      {!fullScreenAllowed && (
        <Panel title="권한 필요" background={colors.ice}>
          <Text style={styles.permissionCopy}>
            잠금 화면에서도 1분의 틈을 바로 열려면 Android의 전체 화면 알림 권한이 필요해요.
          </Text>
          <Pressable
            onPress={onOpenFullScreenSettings}
            accessibilityRole="button"
            style={styles.permissionButton}
          >
            <Text style={styles.permissionButtonText}>전체 화면 알림 허용</Text>
          </Pressable>
        </Panel>
      )}

      <Panel title="기록">
        <RadioRow
          label="가볍게 사용 — 응답을 저장하지 않아요"
          active={!settings.recordMode}
          onPress={() => patch({ recordMode: false })}
        />
        <RadioRow
          label="기록 남기기 — O/X 결과를 이 기기에 저장해요"
          active={settings.recordMode}
          onPress={() => patch({ recordMode: true })}
        />
        <Pressable
          onPress={() =>
            Alert.alert("기록 모두 삭제", "저장된 O/X 기록을 모두 삭제해요. 되돌릴 수 없어요.", [
              { text: "취소", style: "cancel" },
              { text: "삭제", style: "destructive", onPress: onClearRecords }
            ])
          }
          accessibilityRole="button"
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>기록 모두 삭제</Text>
        </Pressable>
      </Panel>

      <Panel title="개인정보">
        <Text style={styles.privacy}>
          틈새움은 건강·행동 데이터를 수집하거나 외부로 전송하지 않습니다.{"\n"}
          모든 설정은 이 기기에만 저장됩니다.
        </Text>
        <Pressable
          onPress={() => void Linking.openURL(PRIVACY_POLICY_URL)}
          accessibilityRole="link"
          accessibilityLabel="개인정보처리방침 열기"
          style={styles.privacyLink}
        >
          <Text style={styles.privacyLinkText}>개인정보처리방침 보기 ↗</Text>
        </Pressable>
      </Panel>

      {__DEV__ && (
        <Panel title="개발 테스트">
          <Text style={styles.debugCopy}>
            선택한 알림 방식과 전체 화면 타이머를 실제 기기에서 확인합니다. 배포 빌드에는 포함되지 않습니다.
          </Text>
          <Pressable
            onPress={onTestNotification}
            accessibilityRole="button"
            accessibilityLabel="5초 뒤 전체 화면 알림 테스트"
            style={styles.debugButton}
          >
            <Text style={styles.debugButtonText}>전체 화면 알림 테스트 · 5초 뒤</Text>
          </Pressable>
          <Text style={styles.debugHint}>
            버튼을 누른 뒤 화면을 끄거나 다른 앱을 열어 두세요. 선택한 진동과 1분의 틈 화면을 함께 확인할 수 있어요.
          </Text>
        </Panel>
      )}

      <PrimaryButton label="홈으로 돌아가기" onPress={onBack} />

      <TimeSheet
        visible={picker === "start" || picker === "end"}
        title={picker === "start" ? "업무 시작 시각" : "업무 종료 시각"}
        initialMin={picker === "start" ? settings.startMin : settings.endMin}
        onCancel={() => setPicker(null)}
        onConfirm={(min) => {
          patch(picker === "start" ? { startMin: min } : { endMin: min });
          setPicker(null);
        }}
      />
      <DurationSheet
        visible={picker === "interval"}
        title="알람 간격"
        initialMin={settings.intervalMin}
        onCancel={() => setPicker(null)}
        onConfirm={(min) => {
          patch({ intervalMin: min });
          setPicker(null);
        }}
      />
    </ScrollView>
  );
}

function TimeRow({ label, value, onPress }: { label: string; value: number; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`업무 ${label} ${fmtHM(value)}, 눌러서 변경`}
      style={styles.timeRow}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.timeValue}>{fmtHM(value)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 14 },
  timeRow: {
    minHeight: MIN_TOUCH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline
  },
  rowLabel: { color: colors.carbon, fontSize: 13, fontWeight: "700" },
  sectionGap: { marginTop: 12, marginBottom: 8 },
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
  dayRow: { flexDirection: "row", gap: 6, marginTop: 8 },
  switchRow: {
    minHeight: MIN_TOUCH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4
  },
  permissionBox: {
    marginTop: 10,
    padding: 12,
    backgroundColor: colors.ice,
    borderWidth: 1,
    borderColor: colors.chromeIndigo
  },
  permissionCopy: { color: colors.carbon, fontSize: 12, lineHeight: 18, marginBottom: 10 },
  permissionButton: {
    minHeight: MIN_TOUCH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.amber,
    borderWidth: 2,
    borderTopColor: colors.amberHighlight,
    borderLeftColor: colors.amberHighlight,
    borderRightColor: colors.signalDeep,
    borderBottomColor: colors.signalDeep
  },
  permissionButtonText: { color: colors.carbon, fontSize: 12, fontWeight: "700" },
  privacy: { color: colors.chromeIndigo, fontSize: 12, lineHeight: 19 },
  clearButton: {
    minHeight: MIN_TOUCH,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderTopColor: colors.highlight,
    borderLeftColor: colors.highlight,
    borderRightColor: colors.hairline,
    borderBottomColor: colors.hairline
  },
  clearButtonText: { color: colors.mutedIndigo, fontSize: 12, fontWeight: "700" },
  privacyLink: {
    minHeight: MIN_TOUCH,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: colors.carbon,
    borderWidth: 2,
    borderTopColor: colors.canvasSoft,
    borderLeftColor: colors.canvasSoft,
    borderRightColor: colors.shadowDeep,
    borderBottomColor: colors.shadowDeep
  },
  privacyLinkText: { color: colors.surface, fontSize: 12, fontWeight: "700" },
  debugCopy: { color: colors.carbon, fontSize: 12, lineHeight: 18, marginBottom: 10 },
  debugButton: {
    minHeight: MIN_TOUCH,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: colors.carbon,
    borderWidth: 2,
    borderTopColor: colors.canvasSoft,
    borderLeftColor: colors.canvasSoft,
    borderRightColor: colors.shadowDeep,
    borderBottomColor: colors.shadowDeep
  },
  debugButtonText: { color: colors.surface, fontSize: 12, fontWeight: "700" },
  debugHint: { color: colors.chromeIndigo, fontSize: 11, lineHeight: 16, marginTop: 10 }
});
