import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { AppState, NativeModules } from "react-native";

export type AppLanguage = "ko" | "en";
export type LanguageMode = "auto" | AppLanguage;

interface NativeLanguageState {
  overrideLanguage: string;
  systemLanguage: string;
  supportsSystemSettings: boolean;
}

interface TeumReminderLanguageModule {
  getLanguageState?: () => Promise<NativeLanguageState>;
  setAppLanguage?: (mode: LanguageMode) => Promise<void>;
  openAppLanguageSettings?: () => Promise<void>;
}

interface I18nValue {
  language: AppLanguage;
  mode: LanguageMode;
  supportsSystemSettings: boolean;
  tr: (ko: string, en: string) => string;
  setMode: (mode: LanguageMode) => Promise<void>;
  openSystemLanguageSettings: () => Promise<void>;
}

const STORAGE_KEY = "teum.language-mode.v1";
const nativeLanguage = NativeModules.TeumReminder as TeumReminderLanguageModule | undefined;

async function readNativeLanguageState() {
  try {
    return (await nativeLanguage?.getLanguageState?.()) ?? null;
  } catch {
    return null;
  }
}

function supportedLanguage(tag: string | null | undefined): AppLanguage {
  return tag?.toLowerCase().startsWith("ko") ? "ko" : "en";
}

function runtimeLanguage() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale;
  } catch {
    return "en";
  }
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>(() => supportedLanguage(runtimeLanguage()));
  const [mode, setModeState] = useState<LanguageMode>("auto");
  const [supportsSystemSettings, setSupportsSystemSettings] = useState(false);

  const refresh = useCallback(async () => {
    let stored: string | null = null;
    try {
      stored = await AsyncStorage.getItem(STORAGE_KEY);
    } catch {
      // 저장소를 읽지 못해도 휴대폰 언어로 앱을 시작한다.
    }
    const storedMode: LanguageMode =
      stored === "ko" || stored === "en" || stored === "auto" ? stored : "auto";
    const nativeState = await readNativeLanguageState();
    const nativeMode: LanguageMode = nativeState?.overrideLanguage
      ? supportedLanguage(nativeState.overrideLanguage)
      : "auto";
    const nextMode = nativeState?.supportsSystemSettings ? nativeMode : storedMode;
    const nextLanguage =
      nextMode === "auto"
        ? supportedLanguage(nativeState?.systemLanguage ?? runtimeLanguage())
        : nextMode;

    setSupportsSystemSettings(nativeState?.supportsSystemSettings ?? false);
    setModeState(nextMode);
    setLanguage(nextLanguage);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") void refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  const setMode = useCallback(async (nextMode: LanguageMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, nextMode);
    } catch {
      // 현재 실행 중인 앱에는 그대로 반영한다.
    }
    const nativeState = await readNativeLanguageState();
    const nextLanguage =
      nextMode === "auto"
        ? supportedLanguage(nativeState?.systemLanguage ?? runtimeLanguage())
        : nextMode;
    setModeState(nextMode);
    setLanguage(nextLanguage);
    if (nativeState?.supportsSystemSettings) {
      await nativeLanguage?.setAppLanguage?.(nextMode).catch(() => undefined);
    }
  }, []);

  const tr = useCallback((ko: string, en: string) => (language === "ko" ? ko : en), [language]);

  const openSystemLanguageSettings = useCallback(async () => {
    await nativeLanguage?.openAppLanguageSettings?.().catch(() => undefined);
  }, []);

  return (
    <I18nContext.Provider
      value={{ language, mode, supportsSystemSettings, tr, setMode, openSystemLanguageSettings }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
