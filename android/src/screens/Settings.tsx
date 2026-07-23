import { useState } from "react";
import { Linking, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { DurationSheet, fmtDuration, TimeSheet } from "../components/TimePickerSheet";
import { Panel, PrimaryButton } from "../components/ui";
import { useI18n } from "../i18n";
import { BackupPayload, BackupSummary } from "../lib/backup";
import { modeLabel, previewVibration } from "../lib/notifications";
import { dayLabels, fmtHM } from "../lib/time";
import { colors, MIN_TOUCH } from "../theme";
import { Settings as SettingsType } from "../types";
import { DayChip, RadioRow } from "./Onboarding";

const PRIVACY_POLICY_URL =
  "https://aluminum-language-c6a.notion.site/TeuM-3a447d4c6bf180f7a6f6e221089a5012?pvs=73";

/**
 * 설정 화면 (A-10). 변경은 즉시 반영·저장된다.
 * 업무 시간·요일·간격·언어·알람 방식·기록 방식을 한곳에서 관리한다.
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
  onExportBackup,
  onPickBackup,
  onRestoreBackup,
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
  onExportBackup: () => Promise<boolean>;
  onPickBackup: () => Promise<{ payload: BackupPayload; summary: BackupSummary } | null>;
  onRestoreBackup: (backup: BackupPayload) => Promise<void>;
  onClearRecords: () => void;
}) {
  const { language, mode: languageMode, supportsSystemSettings, tr, setMode, openSystemLanguageSettings } = useI18n();
  const [picker, setPicker] = useState<"start" | "end" | "interval" | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [backupBusy, setBackupBusy] = useState(false);
  const [backupNote, setBackupNote] = useState<string | null>(null);
  const [pendingBackup, setPendingBackup] = useState<{ payload: BackupPayload; summary: BackupSummary } | null>(null);

  const patch = (partial: Partial<SettingsType>) => onChange({ ...settings, ...partial });

  const toggleDay = (d: number) => {
    const days = settings.days.includes(d)
      ? settings.days.filter((x) => x !== d)
      : [...settings.days, d].sort();
    if (days.length === 0) return; // 최소 하루는 남긴다
    patch({ days });
  };

  const createBackup = async () => {
    setBackupBusy(true);
    setBackupNote(null);
    try {
      const shared = await onExportBackup();
      if (!shared) {
        setBackupNote(tr("이 기기에서는 백업 파일을 만들 수 없어요.", "This device can’t create a backup file."));
      }
    } catch {
      setBackupNote(tr("백업 파일을 만들지 못했어요. 다시 시도해 주세요.", "Couldn’t create the backup. Please try again."));
    } finally {
      setBackupBusy(false);
    }
  };

  const chooseBackup = async () => {
    setBackupBusy(true);
    setBackupNote(null);
    try {
      const selected = await onPickBackup();
      if (selected) setPendingBackup(selected);
    } catch {
      setBackupNote(tr("틈새움 백업 파일을 확인하지 못했어요.", "That file isn’t a valid TeuM backup."));
    } finally {
      setBackupBusy(false);
    }
  };

  const restoreBackup = async () => {
    if (!pendingBackup) return;
    setBackupBusy(true);
    try {
      await onRestoreBackup(pendingBackup.payload);
      setPendingBackup(null);
    } catch {
      setBackupNote(tr("백업을 불러오지 못했어요. 다시 시도해 주세요.", "Couldn’t restore the backup. Please try again."));
    } finally {
      setBackupBusy(false);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.content}>
      <Panel title={tr("업무 시간", "Work hours")}>
        <TimeRow label={tr("시작", "Start")} value={settings.startMin} onPress={() => setPicker("start")} />
        <TimeRow label={tr("종료", "End")} value={settings.endMin} onPress={() => setPicker("end")} />
        <Pressable
          onPress={() => setPicker("interval")}
          accessibilityRole="button"
          accessibilityLabel={`${tr("알람 간격", "Reminder interval")} ${fmtDuration(settings.intervalMin, language)}, ${tr("눌러서 변경", "tap to change")}`}
          style={styles.timeRow}
        >
          <Text style={styles.rowLabel}>{tr("알람 간격", "Reminder interval")}</Text>
          <Text style={styles.timeValue}>{fmtDuration(settings.intervalMin, language)}</Text>
        </Pressable>
        <Text style={[styles.rowLabel, styles.sectionGap]}>{tr("반복 요일", "Repeat on")}</Text>
        <View style={styles.dayRow}>
          {dayLabels(language).map((label, d) => (
            <DayChip
              key={d}
              dayIndex={d}
              label={label}
              active={settings.days.includes(d)}
              onPress={() => toggleDay(d)}
            />
          ))}
        </View>
      </Panel>

      <Panel title={tr("언어", "Language")}>
        <RadioRow
          label={tr("자동", "Automatic")}
          description={tr("휴대폰 언어 설정을 따라요.", "Follows your phone language.")}
          active={languageMode === "auto"}
          onPress={() => void setMode("auto")}
        />
        <RadioRow label="한국어" active={languageMode === "ko"} onPress={() => void setMode("ko")} />
        <RadioRow label="English" active={languageMode === "en"} onPress={() => void setMode("en")} />
        {supportsSystemSettings && (
          <Pressable
            onPress={() => void openSystemLanguageSettings()}
            accessibilityRole="button"
            style={styles.systemLanguageButton}
          >
            <Text style={styles.systemLanguageButtonText}>{tr("휴대폰에서 앱 언어 설정", "Open app language settings")}</Text>
          </Pressable>
        )}
      </Panel>

      <Panel title={tr("알람 방식", "Alert style")}>
        <View style={styles.switchRow}>
          <Text style={styles.rowLabel}>{tr("건강 알람", "Health reminders")}</Text>
          <Switch
            value={settings.notificationsOn}
            onValueChange={(v) => patch({ notificationsOn: v })}
            trackColor={{ false: colors.mutedIndigo, true: colors.amber }}
            thumbColor={colors.surface}
          />
        </View>
        <RadioRow
          label={tr("무음 — 화면으로만 조용히 알려드려요", "Silent — screen only")}
          active={settings.mode === "silent"}
          onPress={() => patch({ mode: "silent" })}
        />
        <RadioRow
          label={modeLabel("gentle", language)}
          active={settings.mode === "gentle"}
          onPress={() => {
            patch({ mode: "gentle" });
            previewVibration("gentle");
          }}
        />
        <RadioRow
          label={modeLabel("clear", language)}
          active={settings.mode === "clear"}
          onPress={() => {
            patch({ mode: "clear" });
            previewVibration("clear");
          }}
        />
        <RadioRow
          label={modeLabel("strong", language)}
          active={settings.mode === "strong"}
          onPress={() => {
            patch({ mode: "strong" });
            previewVibration("strong");
          }}
        />
        {settings.notificationsOn && !permissionOk && (
          <View style={styles.permissionBox}>
            <Text style={styles.permissionCopy}>
              {tr("시스템 알림 권한이 꺼져 있어 알림을 보낼 수 없어요.", "System notification permission is off, so reminders can’t be delivered.")}
            </Text>
            <Pressable
              onPress={onOpenSystemSettings}
              accessibilityRole="button"
              style={styles.permissionButton}
            >
              <Text style={styles.permissionButtonText}>{tr("시스템 설정 열기", "Open system settings")}</Text>
            </Pressable>
          </View>
        )}
      </Panel>

      {!fullScreenAllowed && (
        <Panel title={tr("권한 필요", "Permission needed")} background={colors.ice}>
          <Text style={styles.permissionCopy}>
            {tr("잠금 화면에서도 1분의 틈을 바로 열려면 Android의 전체 화면 알림 권한이 필요해요.", "Android full-screen reminder permission is needed to open the one-minute break from the lock screen.")}
          </Text>
          <Pressable
            onPress={onOpenFullScreenSettings}
            accessibilityRole="button"
            style={styles.permissionButton}
          >
            <Text style={styles.permissionButtonText}>{tr("전체 화면 알림 허용", "Allow full-screen reminders")}</Text>
          </Pressable>
        </Panel>
      )}

      <Panel title={tr("틈 기록", "Break records")}>
        <RadioRow
          label={tr("가볍게 사용", "Keep it simple")}
          description={tr("알림만 받고, 실천 기록은 남기지 않아요.", "Get reminders without keeping a record.")}
          active={!settings.recordMode}
          onPress={() => patch({ recordMode: false })}
        />
        <RadioRow
          label={tr("기록하며 사용", "Keep a record")}
          description={tr("챙긴 틈과 넘긴 틈을 기록해요.", "Keep a record of breaks taken and skipped.")}
          active={settings.recordMode}
          onPress={() => patch({ recordMode: true })}
        />
        <Pressable
          onPress={() => setDeleteConfirmOpen(true)}
          accessibilityRole="button"
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>{tr("기록 모두 삭제", "Delete all records")}</Text>
        </Pressable>
      </Panel>

      <Panel title={tr("백업 및 기기 간 이동", "Backup & move to another device")}>
        <Text style={styles.backupCopy}>
          {tr(
            "계정 없이도 백업 파일을 직접 저장해 새 기기에서 이어 쓸 수 있어요.",
            "Save a backup file and restore it on a new device without an account."
          )}
        </Text>
        <Pressable
          onPress={() => void createBackup()}
          disabled={backupBusy}
          accessibilityRole="button"
          style={({ pressed }) => [styles.backupExportButton, (pressed || backupBusy) && styles.backupButtonPressed]}
        >
          <Text style={styles.backupExportText}>
            {backupBusy ? tr("백업 준비 중…", "Preparing backup…") : tr("백업 파일 만들기", "Create backup file")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => void chooseBackup()}
          disabled={backupBusy}
          accessibilityRole="button"
          style={({ pressed }) => [styles.backupImportButton, (pressed || backupBusy) && styles.backupButtonPressed]}
        >
          <Text style={styles.backupImportText}>{tr("백업 파일 불러오기", "Restore backup file")}</Text>
        </Pressable>
        {backupNote && <Text accessibilityLiveRegion="polite" style={styles.backupNote}>{backupNote}</Text>}
      </Panel>

      <Panel title={tr("개인정보", "Privacy")}>
        <Text style={styles.privacy}>
          {tr(
            "틈새움은 건강·행동 데이터를 수집하거나 외부로 전송하지 않습니다.\n모든 설정과 선택한 틈 기록은 이 기기에만 저장됩니다.",
            "TeuM does not collect or transmit health or activity data.\nAll settings and selected break records stay on this device."
          )}
        </Text>
        <Pressable
          onPress={() => void Linking.openURL(PRIVACY_POLICY_URL)}
          accessibilityRole="link"
          accessibilityLabel={tr("개인정보처리방침 열기", "Open privacy policy")}
          style={styles.privacyLink}
        >
          <Text style={styles.privacyLinkText}>{tr("개인정보처리방침 보기 ↗", "View privacy policy ↗")}</Text>
        </Pressable>
      </Panel>

      {__DEV__ && (
        <Panel title={tr("개발 테스트", "Developer test")}>
          <Text style={styles.debugCopy}>
            {tr("선택한 알림 방식과 전체 화면 타이머를 실제 기기에서 확인합니다. 배포 빌드에는 포함되지 않습니다.", "Check the selected alert style and full-screen timer on a real device. This is not included in release builds.")}
          </Text>
          <Pressable
            onPress={onTestNotification}
            accessibilityRole="button"
            accessibilityLabel={tr("5초 뒤 전체 화면 알림 테스트", "Test full-screen reminder in 5 seconds")}
            style={styles.debugButton}
          >
            <Text style={styles.debugButtonText}>{tr("전체 화면 알림 테스트 · 5초 뒤", "Test full-screen reminder · in 5 sec")}</Text>
          </Pressable>
          <Text style={styles.debugHint}>
            {tr("버튼을 누른 뒤 화면을 끄거나 다른 앱을 열어 두세요. 선택한 진동과 1분의 틈 화면을 함께 확인할 수 있어요.", "After tapping, turn off the screen or open another app. You can check the selected vibration and one-minute screen together.")}
          </Text>
        </Panel>
      )}

      <PrimaryButton label={tr("홈으로 돌아가기", "Back to home")} onPress={onBack} />

      <TimeSheet
        visible={picker === "start" || picker === "end"}
        title={picker === "start" ? tr("업무 시작 시각", "Work start time") : tr("업무 종료 시각", "Work end time")}
        initialMin={picker === "start" ? settings.startMin : settings.endMin}
        onCancel={() => setPicker(null)}
        onConfirm={(min) => {
          patch(picker === "start" ? { startMin: min } : { endMin: min });
          setPicker(null);
        }}
      />
      <DurationSheet
        visible={picker === "interval"}
        title={tr("알람 간격", "Reminder interval")}
        initialMin={settings.intervalMin}
        onCancel={() => setPicker(null)}
        onConfirm={(min) => {
          patch({ intervalMin: min });
          setPicker(null);
        }}
      />
      </ScrollView>

      <Modal
        transparent
        visible={deleteConfirmOpen}
        animationType="fade"
        onRequestClose={() => setDeleteConfirmOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setDeleteConfirmOpen(false)}>
          <Pressable
            accessibilityViewIsModal
            style={styles.modalPlate}
            onPress={() => undefined}
          >
            <Text style={styles.modalEyebrow}>RECORD RESET</Text>
            <Text accessibilityRole="header" style={styles.modalTitle}>
              {tr("기록을 모두 삭제할까요?", "Delete all records?")}
            </Text>
            <Text style={styles.modalCopy}>
              {tr(
                "저장된 틈 기록이 모두 사라져요.\n이 작업은 되돌릴 수 없어요.",
                "All saved break records will be removed.\nThis can’t be undone."
              )}
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setDeleteConfirmOpen(false)}
                accessibilityRole="button"
                style={({ pressed }) => [styles.modalCancel, pressed && styles.modalButtonPressed]}
              >
                <Text style={styles.modalCancelText}>{tr("취소", "Cancel")}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setDeleteConfirmOpen(false);
                  onClearRecords();
                }}
                accessibilityRole="button"
                style={({ pressed }) => [styles.modalDelete, pressed && styles.modalDeletePressed]}
              >
                <Text style={styles.modalDeleteText}>{tr("모두 삭제", "Delete all")}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        transparent
        visible={pendingBackup != null}
        animationType="fade"
        onRequestClose={() => setPendingBackup(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setPendingBackup(null)}>
          <Pressable accessibilityViewIsModal style={styles.modalPlate} onPress={() => undefined}>
            <Text style={styles.modalEyebrow}>RESTORE BACKUP</Text>
            <Text accessibilityRole="header" style={styles.modalTitle}>
              {tr("이 백업을 불러올까요?", "Restore this backup?")}
            </Text>
            <Text style={styles.modalCopy}>
              {tr(
                `현재 기기의 알람 설정, 기록 ${pendingBackup?.summary.recordCount ?? 0}개와 책상 배치가 이 백업으로 바뀌어요.`,
                `This replaces this device’s reminder settings, ${pendingBackup?.summary.recordCount ?? 0} records, and desk layout.`
              )}
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setPendingBackup(null)}
                disabled={backupBusy}
                accessibilityRole="button"
                style={({ pressed }) => [styles.modalCancel, pressed && styles.modalButtonPressed]}
              >
                <Text style={styles.modalCancelText}>{tr("취소", "Cancel")}</Text>
              </Pressable>
              <Pressable
                onPress={() => void restoreBackup()}
                disabled={backupBusy}
                accessibilityRole="button"
                style={({ pressed }) => [styles.modalDelete, pressed && styles.modalDeletePressed]}
              >
                <Text style={styles.modalDeleteText}>{tr("불러오기", "Restore")}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function TimeRow({ label, value, onPress }: { label: string; value: number; onPress: () => void }) {
  const { tr } = useI18n();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label} ${fmtHM(value)}, ${tr("눌러서 변경", "tap to change")}`}
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
  systemLanguageButton: {
    minHeight: MIN_TOUCH,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderTopColor: colors.highlight,
    borderLeftColor: colors.highlight,
    borderRightColor: colors.hairline,
    borderBottomColor: colors.hairline
  },
  systemLanguageButtonText: { color: colors.chromeIndigo, fontSize: 12, fontWeight: "700" },
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
  backupCopy: { color: colors.chromeIndigo, fontSize: 12, lineHeight: 18, marginBottom: 10 },
  backupExportButton: {
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
  backupExportText: { color: colors.carbon, fontSize: 12, fontWeight: "700" },
  backupImportButton: {
    minHeight: MIN_TOUCH,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderTopColor: colors.highlight,
    borderLeftColor: colors.highlight,
    borderRightColor: colors.hairline,
    borderBottomColor: colors.hairline
  },
  backupImportText: { color: colors.chromeIndigo, fontSize: 12, fontWeight: "700" },
  backupButtonPressed: { opacity: 0.68 },
  backupNote: { color: colors.signalDeep, fontSize: 11, lineHeight: 16, marginTop: 8 },
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
  debugHint: { color: colors.chromeIndigo, fontSize: 11, lineHeight: 16, marginTop: 10 },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(17, 19, 26, 0.72)"
  },
  modalPlate: {
    padding: 18,
    backgroundColor: colors.platinum,
    borderWidth: 3,
    borderTopColor: colors.highlight,
    borderLeftColor: colors.highlight,
    borderRightColor: colors.chromeIndigo,
    borderBottomColor: colors.chromeIndigo,
    elevation: 16
  },
  modalEyebrow: {
    marginHorizontal: -18,
    marginTop: -18,
    marginBottom: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.amber,
    backgroundColor: colors.carbon,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1
  },
  modalTitle: { color: colors.carbon, fontSize: 21, lineHeight: 28, fontWeight: "900" },
  modalCopy: { marginTop: 10, color: colors.chromeIndigo, fontSize: 13, lineHeight: 20 },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 22 },
  modalCancel: {
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
  modalButtonPressed: { backgroundColor: colors.canvasSoft },
  modalCancelText: { color: colors.carbon, fontSize: 12, fontWeight: "700" },
  modalDelete: {
    flex: 1,
    minHeight: MIN_TOUCH,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.carbon,
    borderWidth: 2,
    borderTopColor: colors.mutedIndigo,
    borderLeftColor: colors.mutedIndigo,
    borderRightColor: colors.shadowDeep,
    borderBottomColor: colors.shadowDeep
  },
  modalDeletePressed: { backgroundColor: colors.shadowDeep },
  modalDeleteText: { color: colors.surface, fontSize: 12, fontWeight: "700" }
});
