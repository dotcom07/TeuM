import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  BackHandler,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  Vibration,
  View
} from "react-native";
import {
  ACTION_NOW,
  ACTION_SKIP,
  ACTION_SNOOZE,
  clearDelivered,
  hasPermission,
  requestPermission,
  scheduleDebugNotification,
  scheduleTick,
  setupCategories,
  setupChannels
} from "./src/lib/notifications";
import { loadPersisted, savePersisted } from "./src/lib/storage";
import { fmtIntervalKorean, intervalMs, isWithinWork, nextTickFrom, SNOOZE_MS } from "./src/lib/time";
import Break from "./src/screens/Break";
import Home from "./src/screens/Home";
import Onboarding from "./src/screens/Onboarding";
import SettingsScreen from "./src/screens/Settings";
import { colors } from "./src/theme";
import { Persisted, Rhythm, Settings } from "./src/types";

type Screen = "home" | "break" | "settings";

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
  const [persisted, setPersisted] = useState<Persisted | null>(null);
  const [screen, setScreen] = useState<Screen>("home");
  const [now, setNow] = useState(Date.now());
  const [permissionOk, setPermissionOk] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const persistedRef = useRef<Persisted | null>(null);
  const screenRef = useRef<Screen>("home");
  const wasSuggestingRef = useRef(false);
  screenRef.current = screen;

  /** 상태를 저장하고 예약 알림을 다시 잡는 단일 진입점 */
  const commit = useCallback((next: Persisted) => {
    persistedRef.current = next;
    setPersisted(next);
    void savePersisted(next);
    void scheduleTick(next.rhythm.nextTickAt, next.settings);
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
      await setupChannels();
      await setupCategories();
      setPermissionOk(await hasPermission());
      const loaded = await loadPersisted();
      const rolled = { ...loaded, rhythm: rollForward(loaded.rhythm, loaded.settings, Date.now()) };
      persistedRef.current = rolled;
      setPersisted(rolled);
      void scheduleTick(rolled.rhythm.nextTickAt, rolled.settings);

      // 앱이 종료된 사이 사용자가 알림의 `지금 1분`을 눌러 열었을 수 있다.
      const last = await Notifications.getLastNotificationResponseAsync();
      if (last?.actionIdentifier === ACTION_NOW) {
        void clearDelivered();
        setScreen("break");
      }
    })();
  }, []);

  // ── 1초 시계 + 일시정지 해제/놓친 틱 정리 ─────────────────
  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      const current = persistedRef.current;
      if (!current) return;
      const rolled = rollForward(current.rhythm, current.settings, t);
      if (rolled !== current.rhythm) commit({ ...current, rhythm: rolled });
    }, 1000);
    return () => clearInterval(id);
  }, [commit]);

  // ── 설정 화면에서 뒤로 가기 = 홈으로 (앱 종료 방지) ────────
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (screenRef.current === "settings") {
        setScreen("home");
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);

  // ── 포그라운드 복귀 시 권한 재확인 ─────────────────────────
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if (state !== "active") return;
      setPermissionOk(await hasPermission());
    });
    return () => sub.remove();
  }, []);

  // ── 알림 액션 처리 ─────────────────────────────────────────
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const action = response.actionIdentifier;
      if (action === ACTION_NOW) {
        void clearDelivered();
        setScreen("break");
      } else if (action === ACTION_SNOOZE) {
        void clearDelivered();
        snoozeRef.current?.();
      } else if (action === ACTION_SKIP) {
        void clearDelivered();
        skipRef.current?.();
      }
      // 본문 탭(기본 액션)은 앱만 연다. 홈의 제안 플레이트가 이어받는다.
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

  const startBreak = useCallback(() => {
    void clearDelivered();
    setScreen("break");
  }, []);

  const finishBreak = useCallback(() => {
    const current = persistedRef.current;
    if (!current) return;
    // 완료 시점부터 다음 60분을 계산한다.
    patchRhythm({
      status: "running",
      pausedUntil: null,
      nextTickAt: nextTickFrom(Date.now(), current.settings)
    });
    setScreen("home");
  }, [patchRhythm]);

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
    showToast("5분 뒤에 한 번만 다시 알려드릴게요.");
  }, [patchRhythm, showToast]);

  const skip = useCallback(() => {
    const current = persistedRef.current;
    if (!current) return;
    const base = current.rhythm.nextTickAt ?? Date.now();
    patchRhythm({
      nextTickAt: nextTickFrom(Math.max(base, Date.now() - intervalMs(current.settings)), current.settings)
    });
    showToast("괜찮아요. 다음 틈에 다시 만나요.");
  }, [patchRhythm, showToast]);

  const snoozeRef = useRef(snooze);
  const skipRef = useRef(skip);
  snoozeRef.current = snooze;
  skipRef.current = skip;

  const pause = useCallback(
    (untilMs: number) => {
      const current = persistedRef.current;
      if (!current) return;
      // 해제 시각이 업무 시간 안이면 그때 바로, 아니면 다음 업무 흐름에 맞춰 알린다.
      const nextTickAt = isWithinWork(untilMs, current.settings)
        ? untilMs
        : nextTickFrom(untilMs - intervalMs(current.settings), current.settings);
      patchRhythm({ status: "paused", pausedUntil: untilMs, nextTickAt });
    },
    [patchRhythm]
  );

  const resume = useCallback(() => {
    const current = persistedRef.current;
    if (!current) return;
    patchRhythm({
      status: "running",
      pausedUntil: null,
      nextTickAt: nextTickFrom(Date.now(), current.settings)
    });
    showToast(`다시 시작할게요. 다음 틈은 ${fmtIntervalKorean(current.settings.intervalMin)} 뒤예요.`);
  }, [patchRhythm, showToast]);

  const changeSettings = useCallback(
    (settings: Settings) => {
      const current = persistedRef.current;
      if (!current) return;
      let rhythm = current.rhythm;
      // 바뀐 업무 시간 밖에 걸렸거나 간격이 달라진 예약은 다시 계산한다.
      if (
        rhythm.status === "running" &&
        (rhythm.nextTickAt == null ||
          !isWithinWork(rhythm.nextTickAt, settings) ||
          settings.intervalMin !== current.settings.intervalMin)
      ) {
        rhythm = { ...rhythm, nextTickAt: nextTickFrom(Date.now(), settings) };
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
          nextTickAt: nextTickFrom(Date.now(), settings)
        }
      });
    },
    [commit]
  );

  const openSystemSettings = useCallback(() => {
    void Linking.openSettings();
  }, []);

  const testVibration = useCallback(() => {
    Vibration.cancel();
    Vibration.vibrate(180);
    showToast("180ms 진동을 보냈어요.");
  }, [showToast]);

  const testNotification = useCallback(async () => {
    const current = persistedRef.current;
    if (!current) return;
    const granted = await requestPermission();
    setPermissionOk(granted);
    if (!granted) {
      showToast("알림 권한을 켠 뒤 다시 테스트해 주세요.");
      return;
    }
    const scheduled = await scheduleDebugNotification(current.settings);
    if (scheduled) {
      showToast("5초 뒤 테스트 알림을 보내요. 휴대폰 홈 화면으로 나가 확인해 보세요.");
    }
  }, [showToast]);

  // ── 제안 시작 순간, 진동 모드면 짧게 한 번 ──────────────────
  const suggesting =
    persisted != null &&
    persisted.rhythm.status === "running" &&
    persisted.rhythm.nextTickAt != null &&
    now >= persisted.rhythm.nextTickAt &&
    isWithinWork(now, persisted.settings);

  useEffect(() => {
    if (suggesting && !wasSuggestingRef.current && persisted?.settings.mode === "vibrate") {
      Vibration.vibrate(180);
    }
    wasSuggestingRef.current = suggesting;
  }, [suggesting, persisted?.settings.mode]);

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
            onStartBreak={startBreak}
            onSnooze={snooze}
            onSkip={skip}
            onPause={pause}
            onResume={resume}
            onOpenSystemSettings={openSystemSettings}
          />
        )}
        {screen === "break" && (
          <Break nextLabel={fmtIntervalKorean(persisted.settings.intervalMin)} onFinish={finishBreak} />
        )}
        {screen === "settings" && (
          <SettingsScreen
            settings={persisted.settings}
            permissionOk={permissionOk}
            onChange={changeSettings}
            onOpenSystemSettings={openSystemSettings}
            onBack={() => setScreen("home")}
            onTestVibration={testVibration}
            onTestNotification={() => void testNotification()}
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
  return (
    <View style={styles.commandBar}>
      <Pressable onPress={onLogo} accessibilityRole="button" accessibilityLabel="홈으로" style={styles.logoPill}>
        <Image source={require("./assets/teum-logo.png")} style={styles.logoImage} />
        <Text style={styles.logoText}>틈새움</Text>
      </Pressable>
      <View style={styles.commandSpacer} />
      <Pressable
        onPress={onSettings}
        accessibilityRole="button"
        accessibilityLabel={settingsOpen ? "설정 닫기" : "설정 열기"}
        hitSlop={10}
        style={styles.navActionWrap}
      >
        <Text style={styles.navAction}>{settingsOpen ? "닫기" : "설정"}</Text>
      </Pressable>
    </View>
  );
}

function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>TeuM · A SMALL PAUSE THAT KEEPS YOUR FLOW MOVING</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.carbon,
    paddingTop: RNStatusBar.currentHeight ?? 0
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
  toast: {
    position: "absolute",
    zIndex: 4,
    top: 64,
    right: 14,
    left: 14,
    padding: 11,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.chromeIndigo,
    elevation: 8
  },
  toastText: { color: colors.carbon, fontSize: 12, fontWeight: "700", textAlign: "center" },
  footer: { paddingTop: 11, paddingHorizontal: 11, paddingBottom: 26, backgroundColor: colors.carbon },
  footerText: { color: colors.canvasSoft, fontSize: 8, textAlign: "center", letterSpacing: 0.4 }
});
