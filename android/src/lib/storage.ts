import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_RHYTHM, DEFAULT_SETTINGS, Persisted } from "../types";

const KEY = "teum.persisted.v1";

export async function loadPersisted(): Promise<Persisted> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return fresh();
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      onboarded: parsed.onboarded ?? false,
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      rhythm: { ...DEFAULT_RHYTHM, ...parsed.rhythm }
    };
  } catch {
    return fresh();
  }
}

export async function savePersisted(p: Persisted) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // 저장 실패는 다음 변경 때 재시도된다. 기기 내 설정뿐이므로 치명적이지 않다.
  }
}

function fresh(): Persisted {
  return { onboarded: false, settings: { ...DEFAULT_SETTINGS }, rhythm: { ...DEFAULT_RHYTHM } };
}
