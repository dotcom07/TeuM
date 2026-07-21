import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { AlertMode, Settings } from "../types";

export const CATEGORY_ID = "teum-break";
export const ACTION_NOW = "teum-now";
export const ACTION_SNOOZE = "teum-snooze";
export const ACTION_SKIP = "teum-skip";

// 앱이 켜져 있을 때는 배너 대신 홈 화면의 제안 플레이트로 안내한다.
// 알림 서랍에는 남겨 두어 나중에 확인할 수 있게 한다.
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
    { identifier: ACTION_NOW, buttonTitle: "지금 1분", options: { opensAppToForeground: true } },
    { identifier: ACTION_SNOOZE, buttonTitle: "5분 뒤", options: { opensAppToForeground: false } },
    { identifier: ACTION_SKIP, buttonTitle: "이번엔 넘기기", options: { opensAppToForeground: false } }
  ]);
}

// 채널 설정은 최초 생성 후 코드로 바꿀 수 없으므로, 설정을 바꿀 때는 버전을 올려
// 새 채널을 만들고 옛 채널을 지운다.
const CHANNEL_VERSION = "v2";

function channelId(mode: AlertMode, headsUp: boolean) {
  return `teum-${CHANNEL_VERSION}-${mode}-${headsUp ? "top" : "tray"}`;
}

/** 무음/진동 × 헤드업 유무 4개 채널을 미리 만든다. 소리는 어떤 채널에도 없다. */
export async function setupChannels() {
  if (Platform.OS !== "android") return;
  const modes: AlertMode[] = ["silent", "vibrate"];
  for (const mode of modes) {
    for (const headsUp of [true, false]) {
      await Notifications.setNotificationChannelAsync(channelId(mode, headsUp), {
        name:
          mode === "vibrate"
            ? `진동 알림${headsUp ? "" : " (조용히)"}`
            : `무음 알림${headsUp ? "" : " (조용히)"}`,
        importance: headsUp
          ? Notifications.AndroidImportance.MAX
          : Notifications.AndroidImportance.DEFAULT,
        // null이어야 소리가 완전히 꺼진다. undefined는 기본 알림음이 된다.
        sound: null,
        // 짧은 단일 진동만 사용한다. 연속·강한 진동은 쓰지 않는다.
        vibrationPattern: mode === "vibrate" ? [0, 180] : undefined,
        enableVibrate: mode === "vibrate",
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC
      });
    }
  }
  // 잘못된 설정(기본 알림음)으로 만들어졌던 v1 채널 정리
  for (const mode of modes) {
    for (const suffix of ["top", "tray"]) {
      await Notifications.deleteNotificationChannelAsync(`teum-${mode}-${suffix}`);
    }
  }
}

/**
 * 알림 content. `sound: false`를 넣으면 expo가 알림을 setSilent(true)로 만들어
 * 진동·헤드업·잠금화면 표시까지 전부 막아 버린다. 소리 없음은 채널(sound: null)이
 * 보장하므로 content에서는 sound를 건드리지 않는다.
 */
function tickContent(title: string, body: string, mode: AlertMode) {
  return {
    title,
    body,
    categoryIdentifier: CATEGORY_ID,
    // 안드로이드 8 미만 호환용. 8+에서는 채널 패턴이 우선한다.
    vibrate: mode === "vibrate" ? [0, 180] : undefined
  };
}

/** 예약된 알림을 모두 지우고, atMs에 휴식 제안 알림 하나만 예약한다. */
export async function scheduleTick(atMs: number | null, settings: Settings) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (atMs == null || !settings.notificationsOn) return;
  if (atMs <= Date.now()) return;
  await Notifications.scheduleNotificationAsync({
    content: tickContent("틈새움", "마무리할 틈이 생기면, 1분만 움직여요.", settings.mode),
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

/**
 * 개발 빌드 전용 수동 검증용 알림.
 * 정규 휴식 예약은 건드리지 않고, 5초 후 별도의 테스트 알림 하나만 보낸다.
 */
export async function scheduleDebugNotification(settings: Settings) {
  const permission = await hasPermission();
  if (!permission) return false;

  await Notifications.scheduleNotificationAsync({
    content: {
      ...tickContent(
        "틈새움 테스트",
        settings.mode === "vibrate" ? "진동과 알림 동작을 확인해 보세요." : "무음 알림 동작을 확인해 보세요.",
        settings.mode
      ),
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
