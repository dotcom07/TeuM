import { Pressable, View } from "react-native";
import { colors } from "../theme";
import {
  DEFAULT_PLACEMENTS,
  DESK_SLOTS,
  DeskSceneState,
  itemById,
  sceneStateFor,
  SlotId
} from "./catalog";
import { PixelGlyph, PixelRect } from "./PixelGlyph";

/** 아트 그리드 크기 — 아트 px 1칸 = 논리 4px (기획서 §3.1의 256×160 논리 캔버스) */
export const ART_W = 64;
export const ART_H = 40;

/** 벽 창문 — 카본 틀 + 2×2 유리칸. 켜진 칸은 amber. */
function Window({ lit, scale }: { lit: 0 | 1 | 2; scale: number }) {
  const slot = DESK_SLOTS["wall-window"];
  const { x, y } = slot;
  const paneW = 6;
  const paneH = 4;
  const panes: { px: number; py: number; w: number; on: boolean }[] = [
    { px: x + 1, py: y + 1, w: paneW, on: lit >= 1 },
    { px: x + 1 + paneW + 1, py: y + 1, w: paneW + 1, on: lit >= 2 },
    { px: x + 1, py: y + 1 + paneH + 1, w: paneW, on: false },
    { px: x + 1 + paneW + 1, py: y + 1 + paneH + 1, w: paneW + 1, on: false }
  ];
  return (
    <>
      <PixelRect x={x} y={y} w={16} h={12} color={colors.carbon} scale={scale} />
      {panes.map((pane, index) => (
        <PixelRect
          key={index}
          x={pane.px}
          y={pane.py}
          w={pane.w}
          h={paneH}
          color={pane.on ? colors.amber : colors.chromeIndigo}
          scale={scale}
        />
      ))}
    </>
  );
}

/** 슬롯에 실제로 그려질 아이템 id. 배치가 있으면 배치, 없으면 기본. */
function itemIdForSlot(slot: SlotId, placements: Partial<Record<SlotId, string>>): string | null {
  return placements[slot] ?? DEFAULT_PLACEMENTS[slot] ?? null;
}

/** 기본 아이템의 하루 등장 규칙 (§6.3). 배치로 바꾼 아이템은 항상 보인다. */
function isVisible(slot: SlotId, itemId: string, state: DeskSceneState, customized: boolean) {
  if (customized) return true;
  if (itemId === "glass-basic") return state.glass;
  if (itemId === "plant-basic") return state.plant;
  return true;
}

function frameFor(itemId: string, state: DeskSceneState): "base" | "active" {
  if (itemId === "monitor-basic") return state.monitorActive ? "active" : "base";
  if (itemId === "lamp-basic") return state.lampOn ? "active" : "base";
  return "base";
}

/**
 * 픽셀 데스크 장면 (기획서 §3).
 * 벽 → 창문 → 책상 → 아이템(슬롯 배치) → 상태 점 순서로 합성한다.
 * 애니메이션 없음 — `움직임 줄이기` 설정과 무관하게 항상 정지 화면이다.
 */
export default function PixelScene({
  width,
  doneCount,
  paused,
  placements = {},
  accessibilityLabel,
  onSlotPress
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
}) {
  const scale = width / ART_W;
  const state: DeskSceneState = sceneStateFor(doneCount, paused);

  const itemSlots = (Object.keys(DESK_SLOTS) as SlotId[]).filter(
    (slot) => slot !== "wall-window"
  );

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
      {/* 바닥·걸레받이 (지평선 고정 — §3.3.1) */}
      <PixelRect x={0} y={31} w={ART_W} h={1} color={colors.mutedIndigo} scale={scale} />
      <PixelRect x={0} y={32} w={ART_W} h={8} color={colors.periwinkle} scale={scale} />

      {/* 창문 */}
      <Window lit={state.windowLit} scale={scale} />

      {/* 책상 — 상판 하이라이트 + 몸체 + 다리 */}
      <PixelRect x={4} y={24} w={56} h={1} color={colors.highlight} scale={scale} />
      <PixelRect x={4} y={25} w={56} h={2} color={colors.chromeIndigo} scale={scale} />
      <PixelRect x={6} y={27} w={2} h={5} color={colors.chromeIndigo} scale={scale} />
      <PixelRect x={56} y={27} w={2} h={5} color={colors.chromeIndigo} scale={scale} />

      {/* 아이템 레이어 — 슬롯 좌표는 카탈로그가 아니라 장면(슬롯 지도)이 소유 */}
      {itemSlots.map((slot) => {
        const itemId = itemIdForSlot(slot, placements);
        if (!itemId) return null;
        const item = itemById(itemId);
        if (!item) return null;
        const customized = placements[slot] != null;
        if (!isVisible(slot, itemId, state, customized)) return null;
        const rows = item.frames[frameFor(itemId, state)];
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
        itemSlots
          .filter((slot) => slot !== "desk-center")
          .map((slot) => {
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
