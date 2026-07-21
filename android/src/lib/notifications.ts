import * as Notifications from "expo-notifications";
import { Linking, NativeModules, Platform } from "react-native";
import { AlertMode, Settings } from "../types";

export const CATEGORY_ID = "teum-break";
export const ACTION_SNOOZE = "teum-snooze";
export const ACTION_SKIP = "teum-skip";

interface TeumReminderNativeModule {
  schedule(atMs: number, mode: AlertMode): Promise<void>;
  scheduleTest(atMs: number, mode: AlertMode): Promise<void>;
  cancel(): Promise<void>;
  vibrateNow(mode: AlertMode): Promise<void>;
  canUseFullScreenIntent(): Promise<boolean>;
  openFullScreenSettings(): Promise<void>;
  consumeBreakRequest(): Promise<boolean>;
}

const nativeReminder = NativeModules.TeumReminder as TeumReminderNativeModule | undefined;
const CHANNEL_VERSION = "v3";

// 앱이 켜져 있을 때는 JS가 1분 화면을 직접 연다. Expo Go 폴백 알림은 목록에만 남긴다.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: false,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export async function hasPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  return current.granted;
}

export async function requestPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function setupCategories() {
  await Notifications.setNotificationCategoryAsync(CATEGORY_ID, [
    { identifier: ACTION_SNOOZE, buttonTitle: "5분 뒤", options: { opensAppToForeground: false } },
    { identifier: ACTION_SKIP, buttonTitle: "이번엔 넘기기", options: { opensAppToForeground: false } }
  ]);
}

function channelId(mode: AlertMode, headsUp: boolean) {
  return `teum-${CHANNEL_VERSION}-${mode}-${headsUp ? "top" : "tray"}`;
}

/** Expo Go 폴백용 채널. 네이티브 빌드는 TeumReminder가 전체 화면 채널을 만든다. */
export async function setupChannels() {
  if (Platform.OS !== "android") return;
  const modes: AlertMode[] = ["silent", "gentle", "clear", "strong"];
  for (const mode of modes) {
    for (const headsUp of [true, false]) {
      await Notifications.setNotificationChannelAsync(channelId(mode, headsUp), {
        name: `${modeLabel(mode)}${headsUp ? "" : " (조용히)"}`,
        importance: headsUp
          ? Notifications.AndroidImportance.MAX
          : Notifications.AndroidImportance.DEFAULT,
        sound: null,
        vibrationPattern: mode === "silent" ? undefined : vibrationPattern(mode),
        enableVibrate: mode !== "silent",
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC
      });
    }
  }
}

function tickContent(title: string, body: string, mode: AlertMode) {
  return {
    title,
    body,
    categoryIdentifier: CATEGORY_ID,
    data: { teumOpenBreak: true },
    vibrate: mode === "silent" ? undefined : vibrationPattern(mode)
  };
}

/** 정규 알림은 네이티브 전체 화면 알람으로, Expo Go에서는 일반 알림으로 예약한다. */
export async function scheduleTick(atMs: number | null, settings: Settings) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (Platform.OS === "android" && nativeReminder) {
    await nativeReminder.cancel();
    if (atMs == null || !settings.notificationsOn || atMs <= Date.now()) return;
    await nativeReminder.schedule(atMs, settings.mode);
    return;
  }

  if (atMs == null || !settings.notificationsOn || atMs <= Date.now()) return;
  await Notifications.scheduleNotificationAsync({
    content: tickContent("틈새움", "일하는 나를 위한 1분을 시작해요.", settings.mode),
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(atMs),
      channelId: channelId(settings.mode, settings.headsUp)
    }
  });
}

export async function clearDelivered() {
  await Notifications.dismissAllNotificationsAsync();
}

export async function canUseFullScreenReminder() {
  if (Platform.OS !== "android" || !nativeReminder) return false;
  return nativeReminder.canUseFullScreenIntent();
}

export async function openFullScreenReminderSettings() {
  if (Platform.OS !== "android" || !nativeReminder) {
    await Linking.openSettings();
    return;
  }
  await nativeReminder.openFullScreenSettings();
}

export async function consumeFullScreenBreakRequest() {
  if (Platform.OS !== "android" || !nativeReminder) return false;
  return nativeReminder.consumeBreakRequest();
}

/** 정규 예약을 건드리지 않는 5초 뒤 전체 화면 테스트. */
export async function scheduleDebugNotification(settings: Settings) {
  if (!(await hasPermission())) return false;

  if (Platform.OS === "android" && nativeReminder) {
    await nativeReminder.scheduleTest(Date.now() + 5_000, settings.mode);
    return true;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      ...tickContent("틈새움 테스트", "선택한 알림 방식과 1분 화면을 확인해 보세요.", settings.mode),
      data: { teumDebugNotification: true }
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(Date.now() + 5_000),
      channelId: channelId(settings.mode, settings.headsUp)
    }
  });
  return true;
}

/**
 * 무음 모드에서도 울리는 즉시 진동 (알람 usage). 모드 선택 미리보기용.
 * Expo Go 등 네이티브 모듈이 없으면 조용히 무시한다.
 */
export function previewVibration(mode: AlertMode) {
  if (mode === "silent") return;
  void nativeReminder?.vibrateNow(mode).catch(() => undefined);
}

export function modeLabel(mode: AlertMode) {
  switch (mode) {
    case "gentle":
      return "가볍게 · 진동 1번";
    case "clear":
      return "또렷하게 · 진동 3번";
    case "strong":
      return "확실하게 · 진동 5번";
    default:
      return "무음 · 화면으로만";
  }
}

/** 둥(350ms)·쉼(250ms) 반복 — 네이티브 AlarmVibration.patternFor와 동일 */
function vibrationPattern(mode: AlertMode): number[] {
  const pulses = mode === "gentle" ? 1 : mode === "clear" ? 3 : mode === "strong" ? 5 : 0;
  if (pulses === 0) return [0];
  const pattern = [0];
  for (let i = 0; i < pulses; i += 1) {
    pattern.push(350);
    if (i < pulses - 1) pattern.push(250);
  }
  return pattern;
}
