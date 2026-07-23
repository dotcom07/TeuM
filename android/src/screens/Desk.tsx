import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Panel, PrimaryButton } from "../components/ui";
import { useI18n } from "../i18n";
import {
  DEFAULT_PLACEMENTS,
  itemById,
  ownedItems,
  ownedItemsForSlot,
  PixelItem,
  SlotId
} from "../pixel/catalog";
import { DeskState } from "../pixel/deskState";
import { PixelGlyph } from "../pixel/PixelGlyph";
import PixelScene from "../pixel/PixelScene";
import { colors, MIN_TOUCH } from "../theme";

/** 소장 아이템 도트 미리보기 — 박스 안에 맞춰 정수 배율로 그린다. */
function ItemPreview({ item, box }: { item: PixelItem; box: number }) {
  const rows = item.frames.base;
  const w = Math.max(...rows.map((row) => row.length));
  const h = rows.length;
  const scale = Math.max(1, Math.floor(Math.min(box / w, box / h)));
  return (
    <View style={{ width: box, height: box, alignItems: "center", justifyContent: "center" }}>
      <View style={{ width: w * scale, height: h * scale }}>
        <PixelGlyph rows={rows} x={0} y={0} scale={scale} />
      </View>
    </View>
  );
}

/** 슬롯의 한국어/영어 이름 */
function slotLabel(slot: SlotId, ko: boolean): string {
  const names: Record<SlotId, [string, string]> = {
    "wall-window": ["창문", "Window"],
    "wall-shelf-a": ["선반 왼쪽", "Shelf left"],
    "wall-shelf-b": ["선반 오른쪽", "Shelf right"],
    "wall-frame": ["벽 액자 자리", "Wall frame spot"],
    "wall-clock": ["벽시계 자리", "Wall clock spot"],
    "desk-left": ["책상 왼쪽", "Desk left"],
    "desk-center": ["모니터", "Monitor"],
    "desk-right": ["책상 오른쪽", "Desk right"],
    "desk-lamp": ["스탠드 자리", "Lamp spot"],
    "desk-front": ["책상 앞", "Desk front"],
    "floor-left": ["바닥 왼쪽", "Floor left"],
    "floor-right": ["바닥 오른쪽", "Floor right"]
  };
  return names[slot][ko ? 0 : 1];
}

/**
 * 픽셀 데스크 화면 (기획서 §4.7) — 가장 큰 뷰이자 꾸미기 공간.
 * 장면의 슬롯을 직접 누르거나, 아이템란에서 아이템을 눌러 배치한다.
 * 점수·진행률·다음 해금 압박 수치는 표시하지 않는다.
 */
export default function Desk({
  desk,
  doneToday,
  paused,
  recordMode,
  onPlace,
  onBack
}: {
  desk: DeskState;
  doneToday: number | null;
  paused: boolean;
  recordMode: boolean;
  /** slot의 배치를 itemId로 바꾼다. null이면 기본으로 되돌린다. */
  onPlace: (slot: SlotId, itemId: string | null) => void;
  onBack: () => void;
}) {
  const { language, tr } = useI18n();
  const insets = useSafeAreaInsets();
  const { width: windowW } = useWindowDimensions();
  const [pickerSlot, setPickerSlot] = useState<SlotId | null>(null);

  const ko = language === "ko";
  const sceneW = Math.min(360, windowW - 14 * 2 - 14 * 2 - 6);
  const owned = useMemo(() => ownedItems(desk.cumulativeDone), [desk.cumulativeDone]);
  const decorItems = owned.filter((item) => item.id !== "monitor-basic");

  const summary =
    doneToday != null && doneToday > 0
      ? ko
        ? `오늘 ${doneToday}번 챙겼어요.`
        : `You took ${doneToday} break${doneToday === 1 ? "" : "s"} today.`
      : tr("오늘의 첫 틈을 기다리고 있어요.", "Waiting for today’s first break.");

  /** 아이템 탭: 호환 슬롯 중 비어 있는 곳 우선으로 바로 배치한다. */
  const placeItem = (item: PixelItem) => {
    const current = (slot: SlotId) => desk.placements[slot] ?? DEFAULT_PLACEMENTS[slot] ?? null;
    const empty = item.slots.find((slot) => current(slot) == null);
    const target = empty ?? item.slots[0];
    onPlace(target, item.id);
  };

  const pickerItems = pickerSlot ? ownedItemsForSlot(pickerSlot, desk.cumulativeDone) : [];
  const pickerHasDefault = pickerSlot != null && DEFAULT_PLACEMENTS[pickerSlot] != null;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Panel title={tr("나의 책상", "My desk")}>
        <View style={styles.sceneWrap}>
          <PixelScene
            width={sceneW}
            doneCount={doneToday}
            paused={paused}
            placements={desk.placements}
            accessibilityLabel={summary}
            onSlotPress={(slot) => setPickerSlot(slot)}
          />
        </View>
        <Text style={styles.summary}>{summary}</Text>
        <Text style={styles.hint}>
          {tr("장면의 자리를 누르면 아이템을 바꿀 수 있어요.", "Tap a spot in the scene to change its item.")}
        </Text>
      </Panel>

      <Panel title={tr("내 아이템", "My items")}>
        <View style={styles.itemGrid}>
          {decorItems.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => placeItem(item)}
              accessibilityRole="button"
              accessibilityLabel={ko ? `${item.nameKo} 배치하기` : `Place ${item.nameEn}`}
              style={({ pressed }) => [styles.itemCell, pressed && styles.itemCellPressed]}
            >
              <ItemPreview item={item} box={44} />
              <Text style={styles.itemName}>{ko ? item.nameKo : item.nameEn}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.hint}>
          {recordMode
            ? tr("틈을 챙기면 새 아이템이 도착해요.", "New items arrive as you take breaks.")
            : tr("기록하며 사용을 켜면 책상이 자라나요.", "Turn on record mode to grow your desk.")}
        </Text>
      </Panel>

      <PrimaryButton label={tr("홈으로 돌아가기", "Back to home")} onPress={onBack} />

      {/* 슬롯 아이템 선택 시트 */}
      <Modal
        transparent
        visible={pickerSlot != null}
        animationType="slide"
        onRequestClose={() => setPickerSlot(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setPickerSlot(null)}>
          <Pressable
            style={[styles.sheet, { paddingBottom: Math.max(30, insets.bottom + 16) }]}
            onPress={() => undefined}
          >
            <Text style={styles.sheetTitle}>
              {pickerSlot ? slotLabel(pickerSlot, ko) : ""}
            </Text>
            {pickerItems.length === 0 && (
              <Text style={styles.hint}>
                {tr("아직 이 자리에 둘 아이템이 없어요.", "No items for this spot yet.")}
              </Text>
            )}
            {pickerItems.map((item) => {
              const selected =
                pickerSlot != null &&
                (desk.placements[pickerSlot] ?? DEFAULT_PLACEMENTS[pickerSlot]) === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    if (pickerSlot) onPlace(pickerSlot, item.id);
                    setPickerSlot(null);
                  }}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.sheetRow, pressed && styles.sheetRowPressed]}
                >
                  <ItemPreview item={item} box={36} />
                  <Text style={styles.sheetRowText}>{ko ? item.nameKo : item.nameEn}</Text>
                  {selected && <Text style={styles.sheetSelected}>{tr("배치됨", "Placed")}</Text>}
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => {
                if (pickerSlot) onPlace(pickerSlot, null);
                setPickerSlot(null);
              }}
              accessibilityRole="button"
              style={({ pressed }) => [styles.sheetRow, pressed && styles.sheetRowPressed]}
            >
              <View style={{ width: 36 }} />
              <Text style={[styles.sheetRowText, styles.sheetMuted]}>
                {pickerHasDefault ? tr("기본으로 되돌리기", "Back to default") : tr("비우기", "Leave empty")}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, gap: 14 },
  sceneWrap: { alignItems: "center" },
  summary: { marginTop: 12, color: colors.carbon, fontSize: 14, fontWeight: "700" },
  hint: { marginTop: 8, color: colors.chromeIndigo, fontSize: 11, lineHeight: 16 },
  itemGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  itemCell: {
    width: 72,
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderTopColor: colors.highlight,
    borderLeftColor: colors.highlight,
    borderRightColor: colors.hairline,
    borderBottomColor: colors.hairline
  },
  itemCellPressed: { backgroundColor: colors.ice },
  itemName: { marginTop: 4, color: colors.carbon, fontSize: 10, fontWeight: "700" },
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(17, 19, 26, 0.55)" },
  sheet: {
    padding: 18,
    backgroundColor: colors.platinum,
    borderTopWidth: 3,
    borderTopColor: colors.highlight
  },
  sheetTitle: { marginBottom: 12, color: colors.carbon, fontSize: 16, fontWeight: "900" },
  sheetRow: {
    minHeight: MIN_TOUCH,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderTopColor: colors.highlight,
    borderLeftColor: colors.highlight,
    borderRightColor: colors.hairline,
    borderBottomColor: colors.hairline
  },
  sheetRowPressed: { backgroundColor: colors.ice },
  sheetRowText: { flex: 1, color: colors.carbon, fontSize: 13, fontWeight: "700" },
  sheetMuted: { color: colors.mutedIndigo, fontWeight: "400" },
  sheetSelected: { color: colors.navGold, fontSize: 11, fontWeight: "700" }
});
