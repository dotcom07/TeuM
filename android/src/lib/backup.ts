import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { LanguageMode } from "../i18n";
import { DESK_SLOTS, EMPTY_PLACEMENT, itemById, SlotId } from "../pixel/catalog";
import { DeskState } from "../pixel/deskState";
import { BreakRecord, DEFAULT_RHYTHM, DEFAULT_SETTINGS, Persisted } from "../types";

const FORMAT = "teum-backup";
const VERSION = 1;
const MAX_BACKUP_CHARS = 2_000_000;

/**
 * 서버가 생긴 뒤에도 그대로 계정 단위 동기화 문서로 쓸 수 있는 최소 상태 묶음.
 * 현재는 이 데이터가 사용자가 직접 옮기는 .teum-backup.json 파일에만 담긴다.
 */
export interface BackupPayload {
  persisted: Persisted;
  records: BreakRecord[];
  desk: DeskState;
  languageMode: LanguageMode;
}

interface BackupFile {
  format: typeof FORMAT;
  version: typeof VERSION;
  createdAt: string;
  payload: BackupPayload;
}

export interface BackupSummary {
  createdAt: string;
  recordCount: number;
  itemCount: number;
}

export function summaryForBackup(payload: BackupPayload, createdAt = new Date().toISOString()): BackupSummary {
  return {
    createdAt,
    recordCount: payload.records.length,
    itemCount: Object.keys(payload.desk.placements).length
  };
}

export async function shareBackup(payload: BackupPayload): Promise<boolean> {
  if (!(await Sharing.isAvailableAsync())) return false;
  const createdAt = new Date().toISOString();
  const backup: BackupFile = { format: FORMAT, version: VERSION, createdAt, payload };
  const file = new File(Paths.cache, `teum-backup-${createdAt.slice(0, 10)}.json`);
  file.create({ overwrite: true });
  file.write(JSON.stringify(backup));
  await Sharing.shareAsync(file.uri, {
    dialogTitle: "TeuM backup",
    mimeType: "application/json"
  });
  return true;
}

/** 시스템 파일 선택기에서 고른 백업을 읽어, 복원 전에 검증한다. 취소 시 null. */
export async function pickBackup(): Promise<{ payload: BackupPayload; summary: BackupSummary } | null> {
  const picked = await DocumentPicker.getDocumentAsync({
    type: ["application/json", "text/json", "*/*"],
    copyToCacheDirectory: true,
    multiple: false
  });
  if (picked.canceled) return null;
  const raw = await new File(picked.assets[0].uri).text();
  if (raw.length > MAX_BACKUP_CHARS) throw new Error("backup-too-large");
  const backup = parseBackup(raw);
  return { payload: backup.payload, summary: summaryForBackup(backup.payload, backup.createdAt) };
}

export function parseBackup(raw: string): BackupFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("backup-invalid");
  }
  if (!isObject(parsed) || parsed.format !== FORMAT || parsed.version !== VERSION || !isObject(parsed.payload)) {
    throw new Error("backup-invalid");
  }
  return {
    format: FORMAT,
    version: VERSION,
    createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : new Date(0).toISOString(),
    payload: {
      persisted: normalizePersisted(parsed.payload.persisted),
      records: normalizeRecords(parsed.payload.records),
      desk: normalizeDesk(parsed.payload.desk),
      languageMode: parsed.payload.languageMode === "ko" || parsed.payload.languageMode === "en" ? parsed.payload.languageMode : "auto"
    }
  };
}

function normalizePersisted(value: unknown): Persisted {
  const raw = isObject(value) ? value : {};
  const settings = isObject(raw.settings) ? raw.settings : {};
  const rhythm = isObject(raw.rhythm) ? raw.rhythm : {};
  const days = Array.isArray(settings.days)
    ? settings.days.filter((day): day is number => Number.isInteger(day) && day >= 0 && day <= 6)
    : DEFAULT_SETTINGS.days;
  const startMin = validMinute(settings.startMin, DEFAULT_SETTINGS.startMin);
  const endMin = validMinute(settings.endMin, DEFAULT_SETTINGS.endMin);
  const intervalMin = validInterval(settings.intervalMin, DEFAULT_SETTINGS.intervalMin);
  return {
    onboarded: raw.onboarded === true,
    settings: {
      startMin,
      endMin,
      intervalMin,
      days: days.length > 0 ? [...new Set(days)].sort() : [...DEFAULT_SETTINGS.days],
      mode:
        settings.mode === "silent" || settings.mode === "gentle" || settings.mode === "clear" || settings.mode === "strong"
          ? settings.mode
          : DEFAULT_SETTINGS.mode,
      headsUp: settings.headsUp !== false,
      notificationsOn: settings.notificationsOn !== false,
      recordMode: settings.recordMode !== false
    },
    rhythm: {
      status: rhythm.status === "paused" ? "paused" : "running",
      nextTickAt: validTimestamp(rhythm.nextTickAt),
      pausedUntil: validTimestamp(rhythm.pausedUntil)
    }
  };
}

function normalizeRecords(value: unknown): BreakRecord[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (record): record is BreakRecord =>
        isObject(record) &&
        typeof record.id === "string" &&
        typeof record.scheduledAt === "number" &&
        typeof record.resolvedAt === "number" &&
        (record.result === "done" || record.result === "skipped" || record.result === "unanswered") &&
        typeof record.snoozed === "boolean"
    )
    .slice(-4000);
}

function normalizeDesk(value: unknown): DeskState {
  const raw = isObject(value) ? value : {};
  const placements: DeskState["placements"] = {};
  if (isObject(raw.placements)) {
    for (const [slot, id] of Object.entries(raw.placements)) {
      if (typeof id !== "string" || !(slot in DESK_SLOTS)) continue;
      if (id === EMPTY_PLACEMENT || itemById(id)) placements[slot as SlotId] = id;
    }
  }
  return {
    version: 1,
    cumulativeDone: Math.max(0, Number(raw.cumulativeDone) || 0),
    placements
  };
}

function validMinute(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value < 24 * 60 ? value : fallback;
}

function validInterval(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 24 * 60 ? value : fallback;
}

function validTimestamp(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null && !Array.isArray(value);
}
