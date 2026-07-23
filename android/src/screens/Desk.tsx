import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AmberButton, Panel, PrimaryButton } from "../components/ui";
import { useI18n } from "../i18n";
import {
  DEFAULT_PLACEMENTS,
  EMPTY_PLACEMENT,
  isOwned,
  ITEM_CATALOG,
  ownedItemsForSlot,
  PixelItem,
  SLOT_GROUPS,
  SlotId,
  STRUCTURAL_SLOTS
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
  // 소품은 정수 배율로 또렷하게, 벽지·책상처럼 큰 도트맵은 축소해 담는다.
  const raw = Math.min(box / w, box / h);
  const scale = raw >= 1 ? Math.floor(raw) : raw;
  return (
    <View
      style={{ width: box, height: box, alignItems: "center", justifyContent: "center", overflow: "hidden" }}
    >
      <View style={{ width: w * scale, height: h * scale }}>
        <PixelGlyph rows={rows} x={0} y={0} scale={scale} />
      </View>
    </View>
  );
}

/**
 * 픽셀 데스크 화면 (기획서 §4.7) — 가장 큰 뷰이자 꾸미기 공간.
 * - `책상 꾸미기`를 켜면 빈 자리가 실루엣으로 보이고, 자리를 눌러 아이템을 고른다.
 * - 내 아이템은 자리(그룹)별로 묶이고, 배치된 아이템은 표시되며 탭으로 해제/재배치된다.
 * - 도감은 전체 카탈로그를 보여 주되 미소장은 ?로 숨겨 모으고 싶게 만든다.
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
  /** slot의 배치를 바꾼다. null이면 기본으로, EMPTY_PLACEMENT면 비운다. */
  onPlace: (slot: SlotId, itemId: string | null) => void;
  onBack: () => void;
}) {
  const { language, tr } = useI18n();
  const insets = useSafeAreaInsets();
  const { width: windowW } = useWindowDimensions();
  const [pickerSlot, setPickerSlot] = useState<SlotId | null>(null);
  const [decorMode, setDecorMode] = useState(false);

  const ko = language === "ko";
  const sceneW = Math.min(360, windowW - 14 * 2 - 14 * 2 - 6);

  /** 슬롯에 실제로 놓인 아이템 id (명시적 비움이면 null) */
  const effective = (slot: SlotId): string | null => {
    const placed = desk.placements[slot];
    if (placed === EMPTY_PLACEMENT) return null;
    return placed ?? DEFAULT_PLACEMENTS[slot] ?? null;
  };

  const placedSlotOf = (item: PixelItem): SlotId | undefined =>
    item.slots.find((slot) => effective(slot) === item.id);

  /** 아이템 탭: 배치돼 있으면 해제, 아니면 빈 호환 자리 우선으로 배치. */
  const toggleItem = (item: PixelItem) => {
    const placedSlot = placedSlotOf(item);
    if (placedSlot) {
      // 구조 아이템(벽지·바닥지·창문·책상·모니터)은 방의 뼈대라 비울 수 없다. 교체만 가능.
      if (STRUCTURAL_SLOTS.has(placedSlot)) return;
      // 기본 아이템은 명시적으로 비우고, 교체 아이템은 걷어서 기본으로 되돌린다.
      if (DEFAULT_PLACEMENTS[placedSlot] === item.id) onPlace(placedSlot, EMPTY_PLACEMENT);
      else onPlace(placedSlot, null);
      return;
    }
    const empty = item.slots.find((slot) => effective(slot) == null);
    onPlace(empty ?? item.slots[0], item.id);
  };

  const decorCatalog = useMemo(() => ITEM_CATALOG, []);

  const groups = SLOT_GROUPS.map((group) => ({
    group,
    items: decorCatalog.filter(
      (item) => isOwned(item, desk.cumulativeDone) && group.slots.some((s) => item.slots.includes(s))
    )
  })).filter((entry) => entry.items.length > 0);

  const ownedCount = decorCatalog.filter((item) => isOwned(item, desk.cumulativeDone)).length;

  const summary =
    doneToday != null && doneToday > 0
      ? ko
        ? `오늘 ${doneToday}번 챙겼어요.`
        : `You took ${doneToday} break${doneToday === 1 ? "" : "s"} today.`
      : tr("오늘의 첫 틈을 기다리고 있어요.", "Waiting for today’s first break.");

  const pickerItems = pickerSlot ? ownedItemsForSlot(pickerSlot, desk.cumulativeDone) : [];
  const pickerHasDefault = pickerSlot != null && DEFAULT_PLACEMENTS[pickerSlot] != null;
  const pickerGroup = pickerSlot
    ? SLOT_GROUPS.find((group) => group.slots.includes(pickerSlot))
    : undefined;

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
            onSlotPress={decorMode ? (slot) => setPickerSlot(slot) : undefined}
            showSlotHints={decorMode}
            revealAll
          />
        </View>
        <Text style={styles.summary}>{summary}</Text>
        <AmberButton
          label={decorMode ? tr("꾸미기 끝내기", "Done decorating") : tr("책상 꾸미기", "Decorate desk")}
          onPress={() => setDecorMode((v) => !v)}
          style={styles.decorButton}
        />
        {decorMode && (
          <Text style={styles.hint}>
            {tr(
              "점선으로 표시된 빈 자리나 아이템을 눌러 바꿔 보세요.",
              "Tap a dashed empty spot or an item to change it."
            )}
          </Text>
        )}
      </Panel>

      <Panel title={tr("내 아이템", "My items")}>
        {groups.map(({ group, items }) => (
          <View key={group.key} style={styles.groupBlock}>
            <Text style={styles.groupLabel}>{ko ? group.ko : group.en}</Text>
            <View style={styles.itemGrid}>
              {items.map((item) => {
                const placed = placedSlotOf(item) != null;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => toggleItem(item)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: placed }}
                    accessibilityLabel={
                      ko
                        ? `${item.nameKo}${placed ? ", 배치됨. 누르면 해제" : ", 누르면 배치"}`
                        : `${item.nameEn}${placed ? ", placed. Tap to remove" : ", tap to place"}`
                    }
                    style={({ pressed }) => [
                      styles.itemCell,
                      placed && styles.itemCellPlaced,
                      pressed && styles.itemCellPressed
                    ]}
                  >
                    <ItemPreview item={item} box={44} />
                    <Text style={styles.itemName}>{ko ? item.nameKo : item.nameEn}</Text>
                    {placed && <View style={styles.placedDot} />}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
        <Text style={styles.hint}>
          {recordMode
            ? tr("틈을 챙기면 새 아이템이 도착해요.", "New items arrive as you take breaks.")
            : tr("기록하며 사용을 켜면 책상이 자라나요.", "Turn on record mode to grow your desk.")}
        </Text>
      </Panel>

      <Panel title={tr("도감", "Collection")}>
        <Text style={styles.collectionCount}>
          {ko
            ? `${ownedCount} / ${decorCatalog.length} 모았어요`
            : `${ownedCount} / ${decorCatalog.length} collected`}
        </Text>
        <View style={styles.itemGrid}>
          {decorCatalog.map((item) => {
            const owned = isOwned(item, desk.cumulativeDone);
            if (!owned) {
              return (
                <View
                  key={item.id}
                  accessible
                  accessibilityLabel={tr("아직 만나지 못한 아이템", "An item you haven’t met yet")}
                  style={[styles.itemCell, styles.itemCellUnknown]}
                >
                  <Text style={styles.unknownMark}>?</Text>
                  <Text style={[styles.itemName, styles.unknownName]}>???</Text>
                </View>
              );
            }
            return (
              <View key={item.id} style={styles.itemCell}>
                <ItemPreview item={item} box={44} />
                <Text style={styles.itemName}>{ko ? item.nameKo : item.nameEn}</Text>
              </View>
            );
          })}
        </View>
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
              {pickerGroup ? (ko ? pickerGroup.ko : pickerGroup.en) : ""}
            </Text>
            {pickerItems.length === 0 && (
              <Text style={styles.hint}>
                {tr("아직 이 자리에 둘 아이템이 없어요.", "No items for this spot yet.")}
              </Text>
            )}
            {pickerItems.map((item) => {
              const selected = pickerSlot != null && effective(pickerSlot) === item.id;
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
            {pickerSlot != null && !STRUCTURAL_SLOTS.has(pickerSlot) && (
              <Pressable
                onPress={() => {
                  if (pickerSlot) {
                    onPlace(pickerSlot, pickerHasDefault ? EMPTY_PLACEMENT : null);
                  }
                  setPickerSlot(null);
                }}
                accessibilityRole="button"
                style={({ pressed }) => [styles.sheetRow, pressed && styles.sheetRowPressed]}
              >
                <View style={{ width: 36 }} />
                <Text style={[styles.sheetRowText, styles.sheetMuted]}>{tr("비우기", "Leave empty")}</Text>
              </Pressable>
            )}
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
  decorButton: { marginTop: 12 },
  hint: { marginTop: 8, color: colors.chromeIndigo, fontSize: 11, lineHeight: 16 },
  groupBlock: { marginBottom: 12 },
  groupLabel: {
    marginBottom: 6,
    color: colors.chromeIndigo,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5
  },
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
  itemCellPlaced: {
    backgroundColor: colors.amberHighlight,
    borderTopColor: colors.amber,
    borderLeftColor: colors.amber,
    borderRightColor: colors.signalDeep,
    borderBottomColor: colors.signalDeep
  },
  itemCellPressed: { backgroundColor: colors.ice },
  itemCellUnknown: { backgroundColor: colors.platinum, justifyContent: "center", minHeight: 84 },
  unknownMark: { color: colors.mutedIndigo, fontSize: 26, fontWeight: "900" },
  unknownName: { color: colors.mutedIndigo },
  itemName: { marginTop: 4, color: colors.carbon, fontSize: 10, fontWeight: "700" },
  placedDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    backgroundColor: colors.signal,
    borderWidth: 1,
    borderColor: colors.signalDeep
  },
  collectionCount: { marginBottom: 10, color: colors.carbon, fontSize: 12, fontWeight: "700" },
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
