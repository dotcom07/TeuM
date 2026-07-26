import { Pressable, View } from "react-native";
import { colors } from "../theme";
import {
  DEFAULT_PLACEMENTS,
  DESK_SLOTS,
  DeskSceneState,
  EMPTY_PLACEMENT,
  itemById,
  PixelItem,
  sceneStateFor,
  SlotId,
  STRUCTURAL_SLOTS
} from "./catalog";
import { PixelGlyph, PixelRect } from "./PixelGlyph";

/** 아트 그리드 크기 — 아트 px 1칸 = 논리 4px (기획서 §3.1의 256×160 논리 캔버스) */
export const ART_W = 64;
export const ART_H = 40;

/** 슬롯에 실제로 그려질 아이템 id. 배치가 있으면 배치, 없으면 기본. 명시적 비움은 null. */
function itemIdForSlot(slot: SlotId, placements: Partial<Record<SlotId, string>>): string | null {
  const placed = placements[slot];
  if (placed === EMPTY_PLACEMENT) return null;
  return placed ?? DEFAULT_PLACEMENTS[slot] ?? null;
}

/** 기본 아이템의 하루 등장 규칙 (§6.3). 배치로 바꾼 아이템은 항상 보인다. */
function isVisible(itemId: string, state: DeskSceneState, customized: boolean) {
  if (customized) return true;
  if (itemId === "glass-basic") return state.glass;
  if (itemId === "plant-basic") return state.plant;
  return true;
}

/** 상태에 따른 도트맵 선택 — 모니터/스탠드의 active, 창문의 lit1/lit2 */
function rowsFor(item: PixelItem, state: DeskSceneState): string[] {
  if (state.windowLit > 0 && item.states) {
    const lit = item.states[`lit${state.windowLit}`];
    if (lit) return lit;
  }
  if (item.id === "monitor-basic" && state.monitorActive) return item.frames.active;
  if (item.id === "lamp-basic" && state.lampOn) return item.frames.active;
  return item.frames.base;
}

/** 장면 탭 대상 — 큰 배경 슬롯은 작은 슬롯을 가리므로 제외한다 (교체는 아이템란에서). */
const TAPPABLE_SLOTS = (Object.keys(DESK_SLOTS) as SlotId[]).filter(
  (slot) => !STRUCTURAL_SLOTS.has(slot) || slot === "wall-window" || slot === "desk-center"
);

/**
 * 픽셀 데스크 장면 (기획서 §3).
 * 벽지 → 바닥지 → 창문 → 책상 → 소품 순서(슬롯 지도 순서)로 전부 아이템을 합성한다.
 * 애니메이션 없음 — `움직임 줄이기` 설정과 무관하게 항상 정지 화면이다.
 */
export default function PixelScene({
  width,
  doneCount,
  paused,
  placements = {},
  accessibilityLabel,
  onSlotPress,
  showSlotHints = false,
  revealAll = false
}: {
  /** 표시 폭(dp). 높이는 비율(40/64)로 계산된다. */
  width: number;
  /** 오늘 챙긴 횟수. 기록 모드가 꺼져 있으면 null (기본 장면 유지). */
  doneCount: number | null;
  paused: boolean;
  /** 사용자가 바꾼 슬롯 배치 (teum.desk.v1) */
  placements?: Partial<Record<SlotId, string>>;
  accessibilityLabel: string;
  /** 픽셀 데스크 화면에서만: 슬롯 영역을 눌러 꾸미기 */
  onSlotPress?: (slot: SlotId) => void;
  /** 꾸미기 모드: 빈 슬롯을 실루엣으로 보여 준다 */
  showSlotHints?: boolean;
  /** 데스크 화면: 데일리 등장 규칙을 무시하고 배치된 아이템을 전부 보여 준다 */
  revealAll?: boolean;
}) {
  const scale = width / ART_W;
  const state: DeskSceneState = sceneStateFor(doneCount, paused);
  const allSlots = Object.keys(DESK_SLOTS) as SlotId[];

  return (
    <View
      accessible={!onSlotPress}
      accessibilityLabel={accessibilityLabel}
      style={{
        width,
        height: (width * ART_H) / ART_W,
        backgroundColor: colors.canvasSoft,
        borderWidth: 2,
        borderTopColor: colors.chromeIndigo,
        borderLeftColor: colors.chromeIndigo,
        borderRightColor: colors.highlight,
        borderBottomColor: colors.highlight,
        overflow: "hidden"
      }}
    >
      {/* 아이템 레이어 — 슬롯 지도 순서가 곧 z-순서 */}
      {allSlots.map((slot) => {
        const itemId = itemIdForSlot(slot, placements);
        if (!itemId) return null;
        const item = itemById(itemId);
        if (!item) return null;
        const customized = placements[slot] != null;
        if (!revealAll && !isVisible(itemId, state, customized)) return null;
        const rows = rowsFor(item, state);
        const slotBox = DESK_SLOTS[slot];
        // 아이템은 슬롯의 바닥선에 붙인다 (책상 위·바닥 위에 앉게)
        const yOffset = slotBox.maxH - rows.length;
        return (
          <PixelGlyph
            key={slot}
            rows={rows}
            x={slotBox.x}
            y={slotBox.y + Math.max(0, yOffset)}
            scale={scale}
          />
        );
      })}

      {/* 꾸미기 모드: 빈 슬롯 실루엣 — 어디를 꾸밀 수 있는지 보여 준다 */}
      {showSlotHints &&
        allSlots
          .filter((slot) => !STRUCTURAL_SLOTS.has(slot))
          .filter((slot) => itemIdForSlot(slot, placements) == null)
          .map((slot) => {
            const slotBox = DESK_SLOTS[slot];
            return (
              <View
                key={`hint-${slot}`}
                pointerEvents="none"
                style={{
                  position: "absolute",
                  left: slotBox.x * scale,
                  top: slotBox.y * scale,
                  width: slotBox.maxW * scale,
                  height: slotBox.maxH * scale,
                  borderWidth: 1.5,
                  borderStyle: "dashed",
                  borderColor: colors.mutedIndigo,
                  backgroundColor: "rgba(96, 97, 156, 0.22)"
                }}
              />
            );
          })}

      {/* 상태 점 — 일시정지면 멈춤 색 (§6.1) */}
      <PixelRect
        x={51}
        y={26}
        w={1}
        h={1}
        color={state.paused ? colors.mutedIndigo : colors.signal}
        scale={scale}
      />

      {/* 꾸미기 슬롯 터치 영역 (픽셀 데스크 화면 전용) */}
      {onSlotPress &&
        TAPPABLE_SLOTS.map((slot) => {
          const slotBox = DESK_SLOTS[slot];
          return (
            <Pressable
              key={`press-${slot}`}
              onPress={() => onSlotPress(slot)}
              accessibilityRole="button"
              accessibilityLabel={slot}
              style={{
                position: "absolute",
                left: slotBox.x * scale - 4,
                top: slotBox.y * scale - 4,
                width: slotBox.maxW * scale + 8,
                height: slotBox.maxH * scale + 8
              }}
            />
          );
        })}
    </View>
  );
}
