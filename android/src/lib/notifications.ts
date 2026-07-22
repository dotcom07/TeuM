import * as Notifications from "expo-notifications";
import { Linking, NativeModules, Platform } from "react-native";
import type { AppLanguage } from "../i18n";
import { AlertMode, Settings } from "../types";

export const CATEGORY_ID = "teum-break";
export const ACTION_SNOOZE = "teum-snooze";
export const ACTION_SKIP = "teum-skip";

interface TeumReminderNativeModule {
  schedule(atMs: number, mode: AlertMode, language: AppLanguage): Promise<void>;
  schedule(atMs: number, mode: AlertMode): Promise<void>;
  scheduleTest(atMs: number, mode: AlertMode, language: AppLanguage): Promise<void>;
  scheduleTest(atMs: number, mode: AlertMode): Promise<void>;
  cancel(): Promise<void>;
  vibrateNow(mode: AlertMode): Promise<void>;
  canUseFullScreenIntent(): Promise<boolean>;
  openFullScreenSettings(): Promise<void>;
  consumeBreakRequest(): Promise<boolean>;
  dismissBreakPresentation(): Promise<boolean>;
}

const nativeReminder = NativeModules.TeumReminder as TeumReminderNativeModule | undefined;
const CHANNEL_VERSION = "v3";

/** 언어 인자가 없던 기존 개발 빌드와 현재 네이티브 빌드를 모두 지원한다. */
async function scheduleNative(
  test: boolean,
  atMs: number,
  mode: AlertMode,
  language: AppLanguage
) {
  if (!nativeReminder) return false;

  const currentCall = () =>
    test
      ? nativeReminder.scheduleTest(atMs, mode, language)
      : nativeReminder.schedule(atMs, mode, language);
  const legacyCall = () =>
    test ? nativeReminder.scheduleTest(atMs, mode) : nativeReminder.schedule(atMs, mode);

  try {
    await currentCall();
  } catch (currentError) {
    try {
      await legacyCall();
    } catch {
      throw currentError;
    }
  }
  return true;
}

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

export async function setupCategories(language: AppLanguage) {
  await Notifications.setNotificationCategoryAsync(CATEGORY_ID, [
    {
      identifier: ACTION_SNOOZE,
      buttonTitle: language === "ko" ? "5분 뒤" : "In 5 min",
      options: { opensAppToForeground: false }
    },
    {
      identifier: ACTION_SKIP,
      buttonTitle: language === "ko" ? "이번엔 넘길게요" : "I’ll skip this one",
      options: { opensAppToForeground: false }
    }
  ]);
}

function channelId(mode: AlertMode, headsUp: boolean, language: AppLanguage) {
  return `teum-${CHANNEL_VERSION}-${language}-${mode}-${headsUp ? "top" : "tray"}`;
}

/** Expo Go 폴백용 채널. 네이티브 빌드는 TeumReminder가 전체 화면 채널을 만든다. */
export async function setupChannels(language: AppLanguage) {
  if (Platform.OS !== "android") return;
  const modes: AlertMode[] = ["silent", "gentle", "clear", "strong"];
  for (const mode of modes) {
    for (const headsUp of [true, false]) {
      await Notifications.setNotificationChannelAsync(channelId(mode, headsUp, language), {
        name: `${modeLabel(mode, language)}${headsUp ? "" : language === "ko" ? " (조용히)" : " (quiet)"}`,
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
export async function scheduleTick(atMs: number | null, settings: Settings, language: AppLanguage) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (Platform.OS === "android" && nativeReminder) {
    await nativeReminder.cancel();
    if (atMs == null || !settings.notificationsOn || atMs <= Date.now()) return;
    await scheduleNative(false, atMs, settings.mode, language);
    return;
  }

  if (atMs == null || !settings.notificationsOn || atMs <= Date.now()) return;
  await Notifications.scheduleNotificationAsync({
    content: tickContent(
      language === "ko" ? "틈새움" : "TeuM",
      language === "ko"
        ? "물 한 모금과 가벼운 스트레칭을 챙길 시간이에요."
        : "Time for a sip of water and a gentle stretch.",
      settings.mode
    ),
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(atMs),
      channelId: channelId(settings.mode, settings.headsUp, language)
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

/** 전체 화면 알람으로 앱이 앞으로 나온 경우 잠금 화면 표시를 끝내고 이전 화면으로 복귀한다. */
export async function dismissFullScreenBreak() {
  if (Platform.OS !== "android" || !nativeReminder) return false;
  return nativeReminder.dismissBreakPresentation();
}

/** 정규 예약을 건드리지 않는 5초 뒤 전체 화면 테스트. */
export async function scheduleDebugNotification(settings: Settings, language: AppLanguage) {
  if (!(await hasPermission())) return false;

  if (Platform.OS === "android" && nativeReminder) {
    return scheduleNative(true, Date.now() + 5_000, settings.mode, language);
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      ...tickContent(
        language === "ko" ? "틈새움 테스트" : "TeuM test",
        language === "ko"
          ? "선택한 알림 방식과 1분 화면을 확인해 보세요."
          : "Check the selected alert style and one-minute screen.",
        settings.mode
      ),
      data: { teumDebugNotification: true }
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(Date.now() + 5_000),
      channelId: channelId(settings.mode, settings.headsUp, language)
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

export function modeLabel(mode: AlertMode, language: AppLanguage = "ko") {
  if (language === "en") {
    switch (mode) {
      case "gentle":
        return "Gentle · 1 vibration";
      case "clear":
        return "Clear · 3 vibrations";
      case "strong":
        return "Strong · 5 vibrations";
      default:
        return "Silent · screen only";
    }
  }
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
