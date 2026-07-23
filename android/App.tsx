import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  AppState,
  BackHandler,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { I18nProvider, useI18n } from "./src/i18n";
import { BackupPayload, pickBackup, shareBackup } from "./src/lib/backup";
import {
  ACTION_SKIP,
  ACTION_SNOOZE,
  canUseFullScreenReminder,
  clearDelivered,
  consumeFullScreenBreakRequest,
  dismissFullScreenBreak,
  hasPermission,
  openFullScreenReminderSettings,
  requestPermission,
  scheduleDebugNotification,
  scheduleTick,
  setupCategories,
  setupChannels
} from "./src/lib/notifications";
import { appendRecord, clearRecords, doneCountToday, loadRecords, replaceRecords } from "./src/lib/records";
import { loadPersisted, savePersisted } from "./src/lib/storage";
import {
  fmtDayTime,
  intervalMs,
  isWithinWork,
  nextTickFrom,
  nextTickFromWorkStart,
  SNOOZE_MS
} from "./src/lib/time";
import Break from "./src/screens/Break";
import Home from "./src/screens/Home";
import Onboarding from "./src/screens/Onboarding";
import { SlotId } from "./src/pixel/catalog";
import { DeskState, EMPTY_DESK, loadDeskState, saveDeskState } from "./src/pixel/deskState";
import Desk from "./src/screens/Desk";
import Records from "./src/screens/Records";
import SettingsScreen from "./src/screens/Settings";
import { colors } from "./src/theme";
import { BreakRecord, BreakResult, Persisted, Rhythm, Settings } from "./src/types";

type Screen = "home" | "break" | "settings" | "records" | "desk";

/** 놓친 알림 시각을 다음 정규 슬롯으로 넘긴다. 1시간 안에는 제안 상태를 유지한다. */
function rollForward(rhythm: Rhythm, settings: Settings, now: number): Rhythm {
  let nextTickAt = rhythm.nextTickAt;
  let guard = 0;
  while (nextTickAt != null && now - nextTickAt >= intervalMs(settings) && guard < 50) {
    nextTickAt = nextTickFrom(nextTickAt, settings);
    guard += 1;
  }
  let { status, pausedUntil } = rhythm;
  if (status === "paused" && pausedUntil != null && now >= pausedUntil) {
    status = "running";
    pausedUntil = null;
  }
  if (
    nextTickAt === rhythm.nextTickAt &&
    status === rhythm.status &&
    pausedUntil === rhythm.pausedUntil
  ) {
    return rhythm;
  }
  return { status, nextTickAt, pausedUntil };
}

export default function App() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <AppContent />
      </I18nProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { language, mode: languageMode, setMode, tr } = useI18n();
  const [persisted, setPersisted] = useState<Persisted | null>(null);
  const [screen, setScreen] = useState<Screen>("home");
  const [now, setNow] = useState(Date.now());
  const [permissionOk, setPermissionOk] = useState(false);
  const [fullScreenAllowed, setFullScreenAllowed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [records, setRecords] = useState<BreakRecord[]>([]);
  const [desk, setDesk] = useState<DeskState>(EMPTY_DESK);
  const deskRef = useRef<DeskState>(EMPTY_DESK);

  /** 데스크 상태 저장 단일 진입점 */
  const commitDesk = useCallback((next: DeskState) => {
    deskRef.current = next;
    setDesk(next);
    void saveDeskState(next);
  }, []);

  /** 꾸미기: 슬롯 배치 변경. null이면 기본으로 되돌린다. */
  const placeDeskItem = useCallback(
    (slot: SlotId, itemId: string | null) => {
      const placements = { ...deskRef.current.placements };
      if (itemId == null) delete placements[slot];
      else placements[slot] = itemId;
      commitDesk({ ...deskRef.current, placements });
    },
    [commitDesk]
  );

  const persistedRef = useRef<Persisted | null>(null);
  const screenRef = useRef<Screen>("home");
  const wasSuggestingRef = useRef(false);
  const recordsRef = useRef<BreakRecord[]>([]);
  const languageRef = useRef(language);
  // 현재 회차 추적 — 5분 미루기를 써도 같은 회차로 남긴다.
  const breakScheduledAtRef = useRef<number | null>(null);
  const breakSnoozedRef = useRef(false);
  screenRef.current = screen;
  recordsRef.current = records;
  languageRef.current = language;

  /** 1분 화면을 여는 단일 진입점. 회차 시각을 기억해 기록에 사용한다. */
  const openBreak = useCallback(() => {
    void clearDelivered();
    const rhythm = persistedRef.current?.rhythm;
    const t = Date.now();
    const firedTick =
      rhythm?.nextTickAt != null && rhythm.nextTickAt <= t ? rhythm.nextTickAt : t;
    const interval = persistedRef.current ? intervalMs(persistedRef.current.settings) : 0;
    // 5분 미룬 같은 회차면 최초 예정 시각을 유지한다.
    const keepSame =
      breakSnoozedRef.current &&
      breakScheduledAtRef.current != null &&
      t - breakScheduledAtRef.current < interval;
    if (!keepSame) {
      breakScheduledAtRef.current = firedTick;
      breakSnoozedRef.current = false;
    }
    setScreen("break");
  }, []);

  /** 기록하며 사용 중일 때만 사용자의 선택을 기기에 남긴다. */
  const recordResponse = useCallback((result: BreakResult) => {
    const current = persistedRef.current;
    const scheduledAt = breakScheduledAtRef.current;
    const snoozed = breakSnoozedRef.current;
    breakScheduledAtRef.current = null;
    breakSnoozedRef.current = false;
    if (!current?.settings.recordMode || scheduledAt == null) return;
    const record: BreakRecord = {
      id: `${scheduledAt}-${Date.now()}`,
      scheduledAt,
      resolvedAt: Date.now(),
      result,
      snoozed
    };
    void appendRecord(recordsRef.current, record).then(setRecords);
  }, []);

  const openBreakFromUrl = useCallback(
    (url: string | null) => {
      if (!url) return;
      if (url.startsWith("teum://respond/")) {
        void clearDelivered();
        const action = url.slice("teum://respond/".length);
        // 알림 액션에서 바로 선택한 경우 — 1분 화면 없이 처리한다.
        const rhythm = persistedRef.current?.rhythm;
        const t = Date.now();
        if (breakScheduledAtRef.current == null) {
          breakScheduledAtRef.current =
            rhythm?.nextTickAt != null && rhythm.nextTickAt <= t ? rhythm.nextTickAt : t;
        }
        if (action === "done") respondDoneRef.current?.();
        else if (action === "skip") respondSkipRef.current?.();
        else if (action === "snooze") respondSnoozeRef.current?.();
        setScreen("home");
        return;
      }
      if (url.startsWith("teum://break")) openBreak();
    },
    [openBreak]
  );

  /** 상태를 저장하고 예약 알림을 다시 잡는 단일 진입점 */
  const commit = useCallback((next: Persisted) => {
    persistedRef.current = next;
    setPersisted(next);
    void savePersisted(next);
    void scheduleTick(next.rhythm.nextTickAt, next.settings, languageRef.current);
  }, []);

  const patchRhythm = useCallback(
    (partial: Partial<Rhythm>) => {
      const current = persistedRef.current;
      if (!current) return;
      commit({ ...current, rhythm: { ...current.rhythm, ...partial } });
    },
    [commit]
  );

  // ── 초기화 ────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      await setupChannels(languageRef.current);
      await setupCategories(languageRef.current);
      setPermissionOk(await hasPermission());
      setFullScreenAllowed(await canUseFullScreenReminder());
      const loaded = await loadPersisted();
      const rolled = { ...loaded, rhythm: rollForward(loaded.rhythm, loaded.settings, Date.now()) };
      persistedRef.current = rolled;
      setPersisted(rolled);
      if (rolled.rhythm !== loaded.rhythm) void savePersisted(rolled);
      void scheduleTick(rolled.rhythm.nextTickAt, rolled.settings, languageRef.current);
      setRecords(await loadRecords());
      const loadedDesk = await loadDeskState();
      deskRef.current = loadedDesk;
      setDesk(loadedDesk);

      openBreakFromUrl(await Linking.getInitialURL());
      if (await consumeFullScreenBreakRequest()) {
        openBreak();
      }

      // Expo Go 폴백 알림의 본문을 눌러 앱이 열린 경우에도 1분 화면을 연다.
      const last = await Notifications.getLastNotificationResponseAsync();
      if (last?.notification.request.content.data?.teumOpenBreak === true) {
        openBreak();
        await Notifications.clearLastNotificationResponseAsync();
      }
    })();
  }, [openBreak, openBreakFromUrl]);

  useEffect(() => {
    void setupChannels(language);
    void setupCategories(language);
    const current = persistedRef.current;
    if (current) void scheduleTick(current.rhythm.nextTickAt, current.settings, language);
  }, [language]);

  // 실행 중인 앱에 전체 화면 알림 인텐트가 전달되는 경우.
  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => openBreakFromUrl(url));
    return () => sub.remove();
  }, [openBreakFromUrl]);

  // ── 1초 시계 + 일시정지 해제/놓친 틱 정리 ─────────────────
  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      void consumeFullScreenBreakRequest().then((requested) => {
        if (requested) openBreak();
      });
      const current = persistedRef.current;
      if (!current) return;
      const rolled = rollForward(current.rhythm, current.settings, t);
      if (rolled !== current.rhythm) commit({ ...current, rhythm: rolled });
    }, 1000);
    return () => clearInterval(id);
  }, [commit, openBreak]);

  // ── 설정 화면에서 뒤로 가기 = 홈으로 (앱 종료 방지) ────────
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (
        screenRef.current === "settings" ||
        screenRef.current === "records" ||
        screenRef.current === "desk"
      ) {
        setScreen("home");
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);

  // ── 포그라운드 복귀 시 권한·예약 상태 재확인 ───────────────
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if (state !== "active") return;
      setPermissionOk(await hasPermission());
      setFullScreenAllowed(await canUseFullScreenReminder());
      const current = persistedRef.current;
      if (!current) return;
      const rolled = rollForward(current.rhythm, current.settings, Date.now());
      if (rolled !== current.rhythm) {
        commit({ ...current, rhythm: rolled });
      } else {
        void scheduleTick(current.rhythm.nextTickAt, current.settings, languageRef.current);
      }
    });
    return () => sub.remove();
  }, [commit]);

  // ── 알림 액션 처리 ─────────────────────────────────────────
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const action = response.actionIdentifier;
      if (action === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        openBreakRef.current?.();
      } else if (action === ACTION_SNOOZE) {
        void clearDelivered();
        snoozeRef.current?.();
      } else if (action === ACTION_SKIP) {
        void clearDelivered();
        skipRef.current?.();
      }
    });
    return () => sub.remove();
  }, []);

  // ── 리듬 동작 ─────────────────────────────────────────────
  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  // ── 1분 화면 선택 ─────────────────────────────────────────
  // 챙김: 누른 시점부터 다음 간격을 계산한다.
  const respondDone = useCallback(() => {
    const current = persistedRef.current;
    if (!current) return;
    recordResponse("done");
    // 픽셀 데스크 누적 챙김 — 기록하며 사용에서만 오른다 (기획서 §4.7).
    if (current.settings.recordMode) {
      commitDesk({ ...deskRef.current, cumulativeDone: deskRef.current.cumulativeDone + 1 });
    }
    patchRhythm({
      status: "running",
      pausedUntil: null,
      nextTickAt: nextTickFrom(Date.now(), current.settings)
    });
  }, [commitDesk, patchRhythm, recordResponse]);

  // 넘김: 기존 정규 주기를 유지한다 (예정 시점 + 간격).
  const respondSkip = useCallback(() => {
    const current = persistedRef.current;
    if (!current) return;
    const base = breakScheduledAtRef.current ?? current.rhythm.nextTickAt ?? Date.now();
    recordResponse("skipped");
    patchRhythm({
      nextTickAt: nextTickFrom(
        Math.max(base, Date.now() - intervalMs(current.settings)),
        current.settings
      )
    });
    showToastRef.current?.(tr("괜찮아요. 다음 틈에 다시 만나요.", "That’s okay. We’ll meet at the next break."));
  }, [patchRhythm, recordResponse, tr]);

  // 5분 뒤에 다시: 같은 회차를 한 번만 미룬다. 기록은 최종 선택 때 남긴다.
  const respondSnooze = useCallback(() => {
    const current = persistedRef.current;
    if (!current) return;
    breakSnoozedRef.current = true;
    const t = Date.now();
    const inFive = t + SNOOZE_MS;
    const nextTickAt = isWithinWork(inFive, current.settings)
      ? inFive
      : nextTickFrom(t, current.settings);
    patchRhythm({ nextTickAt });
    showToastRef.current?.(tr("5분 뒤에 한 번만 다시 알려드릴게요.", "We’ll remind you once more in 5 minutes."));
  }, [patchRhythm, tr]);

  // 선택 없이 닫힘: 명시적으로 넘긴 경우와 구분해 저장하고, 정규 주기는 유지한다.
  const respondUnanswered = useCallback(() => {
    const current = persistedRef.current;
    if (!current) return;
    const base = breakScheduledAtRef.current ?? current.rhythm.nextTickAt ?? Date.now();
    recordResponse("unanswered");
    patchRhythm({
      nextTickAt: nextTickFrom(
        Math.max(base, Date.now() - intervalMs(current.settings)),
        current.settings
      )
    });
  }, [patchRhythm, recordResponse]);

  const closeBreak = useCallback(() => {
    setScreen("home");
    void dismissFullScreenBreak().catch(() => undefined);
  }, []);

  const snooze = useCallback(() => {
    const current = persistedRef.current;
    if (!current) return;
    const t = Date.now();
    const inFive = t + SNOOZE_MS;
    // 업무 시간 안이면 5분 뒤 한 번만. 업무가 끝났으면 다음 업무일로.
    const nextTickAt = isWithinWork(inFive, current.settings)
      ? inFive
      : nextTickFrom(t, current.settings);
    patchRhythm({ nextTickAt });
    showToast(tr("5분 뒤에 한 번만 다시 알려드릴게요.", "We’ll remind you once more in 5 minutes."));
  }, [patchRhythm, showToast, tr]);

  const skip = useCallback(() => {
    const current = persistedRef.current;
    if (!current) return;
    const base = current.rhythm.nextTickAt ?? Date.now();
    patchRhythm({
      nextTickAt: nextTickFrom(Math.max(base, Date.now() - intervalMs(current.settings)), current.settings)
    });
    showToast(tr("괜찮아요. 다음 틈에 다시 만나요.", "That’s okay. We’ll meet at the next break."));
  }, [patchRhythm, showToast, tr]);

  const snoozeRef = useRef(snooze);
  const skipRef = useRef(skip);
  const openBreakRef = useRef(openBreak);
  const showToastRef = useRef(showToast);
  const respondDoneRef = useRef(respondDone);
  const respondSkipRef = useRef(respondSkip);
  const respondSnoozeRef = useRef(respondSnooze);
  snoozeRef.current = snooze;
  skipRef.current = skip;
  openBreakRef.current = openBreak;
  showToastRef.current = showToast;
  respondDoneRef.current = respondDone;
  respondSkipRef.current = respondSkip;
  respondSnoozeRef.current = respondSnooze;

  const pause = useCallback(
    (untilMs: number | null) => {
      const current = persistedRef.current;
      if (!current) return;
      if (untilMs == null) {
        patchRhythm({ status: "paused", pausedUntil: null, nextTickAt: null });
        showToast(tr("알람을 멈춰 두었어요.", "Your health reminders are paused."));
        return;
      }
      // 해제 시각이 업무 시간 안이면 그때 바로, 아니면 다음 업무 흐름에 맞춰 알린다.
      const nextTickAt = isWithinWork(untilMs, current.settings)
        ? untilMs
        : nextTickFrom(untilMs - intervalMs(current.settings), current.settings);
      patchRhythm({ status: "paused", pausedUntil: untilMs, nextTickAt });
    },
    [patchRhythm, showToast, tr]
  );

  const resume = useCallback(() => {
    const current = persistedRef.current;
    if (!current) return;
    const now = Date.now();
    const nextTickAt = nextTickFromWorkStart(now, current.settings);
    patchRhythm({ status: "running", pausedUntil: null, nextTickAt });
    showToast(
      nextTickAt != null
        ? language === "ko"
          ? `건강 알람을 다시 시작했어요. 다음 알람은 ${fmtDayTime(nextTickAt, now, language)}이에요.`
          : `Health reminders resumed. Your next reminder is ${fmtDayTime(nextTickAt, now, language)}.`
        : tr("건강 알람을 다시 시작했어요.", "Health reminders resumed.")
    );
  }, [language, patchRhythm, showToast, tr]);

  const changeSettings = useCallback(
    (settings: Settings) => {
      const current = persistedRef.current;
      if (!current) return;
      let rhythm = current.rhythm;
      // 시간 관련 설정이 하나라도 바뀌면 예약을 항상 다시 계산한다.
      // (예: 간격을 바꿨다 되돌려도 이전 간격으로 잡힌 예약이 남지 않게)
      const timingChanged =
        settings.intervalMin !== current.settings.intervalMin ||
        settings.startMin !== current.settings.startMin ||
        settings.endMin !== current.settings.endMin ||
        settings.days.join(",") !== current.settings.days.join(",");
      if (
        rhythm.status === "running" &&
        (rhythm.nextTickAt == null || !isWithinWork(rhythm.nextTickAt, settings) || timingChanged)
      ) {
        rhythm = { ...rhythm, nextTickAt: nextTickFromWorkStart(Date.now(), settings) };
      }
      commit({ ...current, settings, rhythm });
    },
    [commit]
  );

  const finishOnboarding = useCallback(
    async (settings: Settings) => {
      const granted = await requestPermission();
      setPermissionOk(granted);
      commit({
        onboarded: true,
        settings,
        rhythm: {
          status: "running",
          pausedUntil: null,
          nextTickAt: nextTickFromWorkStart(Date.now(), settings)
        }
      });
      const allowed = await canUseFullScreenReminder();
      setFullScreenAllowed(allowed);
      if (!allowed) await openFullScreenReminderSettings();
    },
    [commit]
  );

  const openSystemSettings = useCallback(() => {
    void Linking.openSettings();
  }, []);

  const testNotification = useCallback(async () => {
    const current = persistedRef.current;
    if (!current) return;
    const granted = await requestPermission();
    setPermissionOk(granted);
    if (!granted) {
      showToast(tr("알림 권한을 켠 뒤 다시 테스트해 주세요.", "Turn on notification permission, then try the test again."));
      return;
    }
    try {
      const scheduled = await scheduleDebugNotification(current.settings, language);
      if (scheduled) {
        showToast(
          fullScreenAllowed
            ? tr("5초 뒤 선택한 방식으로 1분 화면을 열어요. 화면을 끄거나 다른 앱을 열어 보세요.", "The one-minute screen will open in 5 seconds. Turn off the screen or open another app.")
            : tr("5초 뒤 테스트해요. 전체 화면 권한이 꺼져 있으면 알림 배너로 표시돼요.", "The test runs in 5 seconds. If full-screen permission is off, it appears as a notification banner.")
        );
      }
    } catch (error) {
      console.warn("Failed to schedule TeuM debug notification", error);
      showToast(
        tr(
          "테스트 알림을 예약하지 못했어요. 앱 빌드와 알림 권한을 확인해 주세요.",
          "Couldn’t schedule the test reminder. Check the app build and notification permission."
        )
      );
    }
  }, [fullScreenAllowed, language, showToast, tr]);

  /** 서버 없이도 새 기기로 옮길 수 있는 백업 파일을 만든다. */
  const exportBackup = useCallback(async () => {
    const current = persistedRef.current;
    if (!current) return false;
    const shared = await shareBackup({
      persisted: current,
      records: recordsRef.current,
      desk: deskRef.current,
      languageMode
    });
    if (shared) {
      showToast(
        tr(
          "백업 파일을 만들었어요. 저장하거나 새 기기로 보내 주세요.",
          "Your backup is ready. Save it or send it to your new device."
        )
      );
    }
    return shared;
  }, [languageMode, showToast, tr]);

  /** 검증된 백업을 현재 기기에 적용한다. 서버 동기화도 나중에 이 경계를 재사용한다. */
  const restoreBackup = useCallback(
    async (backup: BackupPayload) => {
      const restoredRecords = await replaceRecords(backup.records);
      commitDesk(backup.desk);
      commit({
        ...backup.persisted,
        rhythm: rollForward(backup.persisted.rhythm, backup.persisted.settings, Date.now())
      });
      await setMode(backup.languageMode);
      setRecords(restoredRecords);
      showToast(tr("백업을 이 기기에 불러왔어요.", "Your backup has been restored to this device."));
    },
    [commit, commitDesk, setMode, showToast, tr]
  );

  // ── 예정 시각이 되면 수동 진입 없이 즉시 1분 화면을 연다. ───
  const suggesting =
    persisted != null &&
    persisted.rhythm.status === "running" &&
    persisted.rhythm.nextTickAt != null &&
    now >= persisted.rhythm.nextTickAt &&
    isWithinWork(now, persisted.settings);

  useEffect(() => {
    if (suggesting && !wasSuggestingRef.current) openBreak();
    wasSuggestingRef.current = suggesting;
  }, [suggesting, openBreak]);

  // ── 렌더 ──────────────────────────────────────────────────
  if (!persisted) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <View style={styles.appFrame} />
      </SafeAreaView>
    );
  }

  if (!persisted.onboarded) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <View style={styles.appFrame}>
          <Onboarding onDone={(settings) => void finishOnboarding(settings)} />
          <Footer />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.appFrame}>
        {screen !== "break" && (
          <Header
            onLogo={() => setScreen("home")}
            onSettings={() => setScreen(screen === "settings" ? "home" : "settings")}
            settingsOpen={screen === "settings"}
          />
        )}
        {toast && (
          <View style={styles.toast} accessibilityLiveRegion="polite">
            <Text style={styles.toastText}>{toast}</Text>
          </View>
        )}

        {screen === "home" && (
          <Home
            settings={persisted.settings}
            rhythm={persisted.rhythm}
            now={now}
            permissionOk={permissionOk}
            doneToday={persisted.settings.recordMode ? doneCountToday(records, now) : null}
            placements={desk.placements}
            onOpenRecords={() => setScreen("records")}
            onOpenDesk={() => setScreen("desk")}
            onPause={pause}
            onResume={resume}
            onOpenSystemSettings={openSystemSettings}
          />
        )}
        {screen === "break" && (
          <Break
            doneToday={persisted.settings.recordMode ? doneCountToday(records, now) : null}
            placements={desk.placements}
            onSnooze={() => {
              respondSnooze();
              closeBreak();
            }}
            onDone={() => {
              respondDone();
              closeBreak();
            }}
            onSkip={() => {
              respondSkip();
              closeBreak();
            }}
            onUnanswered={() => {
              respondUnanswered();
              closeBreak();
            }}
          />
        )}
        {screen === "records" && (
          <Records
            records={records}
            now={now}
            placements={desk.placements}
            onOpenDesk={() => setScreen("desk")}
            onBack={() => setScreen("home")}
          />
        )}
        {screen === "desk" && (
          <Desk
            desk={desk}
            doneToday={persisted.settings.recordMode ? doneCountToday(records, now) : null}
            paused={persisted.rhythm.status === "paused"}
            recordMode={persisted.settings.recordMode}
            onPlace={placeDeskItem}
            onBack={() => setScreen("home")}
          />
        )}
        {screen === "settings" && (
          <SettingsScreen
            settings={persisted.settings}
            permissionOk={permissionOk}
            onChange={changeSettings}
            onOpenSystemSettings={openSystemSettings}
            fullScreenAllowed={fullScreenAllowed}
            onOpenFullScreenSettings={() => void openFullScreenReminderSettings()}
            onBack={() => setScreen("home")}
            onTestNotification={() => void testNotification()}
            onExportBackup={() => exportBackup()}
            onPickBackup={() => pickBackup()}
            onRestoreBackup={(backup) => restoreBackup(backup)}
            onClearRecords={() => {
              void clearRecords();
              setRecords([]);
              showToast(tr("기록을 모두 삭제했어요.", "All records were deleted."));
            }}
          />
        )}
        <Footer />
      </View>
    </SafeAreaView>
  );
}

function Header({
  onLogo,
  onSettings,
  settingsOpen
}: {
  onLogo: () => void;
  onSettings: () => void;
  settingsOpen: boolean;
}) {
  const { tr } = useI18n();
  return (
    <View style={styles.commandBar}>
      <Pressable onPress={onLogo} accessibilityRole="button" accessibilityLabel={tr("홈으로", "Home")} style={styles.logoPill}>
        <Image source={require("./assets/teum-logo.png")} style={styles.logoImage} />
        <Text style={styles.logoText}>{tr("틈새움", "TeuM")}</Text>
      </Pressable>
      <View style={styles.commandSpacer} />
      <Pressable
        onPress={onSettings}
        accessibilityRole="button"
        accessibilityLabel={settingsOpen ? tr("설정 닫기", "Close settings") : tr("설정 열기", "Open settings")}
        hitSlop={10}
        style={styles.navActionWrap}
      >
        <Text style={styles.navAction}>{settingsOpen ? tr("닫기", "Close") : tr("설정", "Settings")}</Text>
      </Pressable>
    </View>
  );
}

function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>TeuM · ONE MINUTE FOR A HEALTHIER WORKDAY</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.carbon
  },
  appFrame: { flex: 1, backgroundColor: colors.canvas },
  commandBar: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 10,
    backgroundColor: colors.carbon,
    borderBottomWidth: 3,
    borderBottomColor: colors.shadowDeep
  },
  logoPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: colors.mutedIndigo,
    borderRadius: 999,
    backgroundColor: colors.lavender
  },
  logoImage: { width: 26, height: 26, borderRadius: 5 },
  logoText: { color: colors.carbon, fontSize: 13, fontWeight: "700", letterSpacing: 2 },
  commandSpacer: { flex: 1 },
  navActionWrap: {
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: colors.amber
  },
  navAction: { color: colors.carbon, fontSize: 11, fontWeight: "700" },
  // 패널(양쪽 14px)과 폭·위치가 겹치지 않게, 하단에 좁게 띄우는 떠 있는 칩 형태.
  toast: {
    position: "absolute",
    zIndex: 4,
    bottom: 96,
    alignSelf: "center",
    maxWidth: "82%",
    paddingHorizontal: 18,
    paddingVertical: 11,
    backgroundColor: colors.carbon,
    borderWidth: 2,
    borderColor: colors.amber,
    borderRadius: 999,
    elevation: 10
  },
  toastText: { color: colors.surface, fontSize: 12, fontWeight: "700", textAlign: "center" },
  footer: { paddingTop: 11, paddingHorizontal: 11, paddingBottom: 26, backgroundColor: colors.carbon },
  footerText: { color: colors.canvasSoft, fontSize: 8, textAlign: "center", letterSpacing: 0.4 }
});
