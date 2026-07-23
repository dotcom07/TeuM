import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

const SLOT_COUNT = 8;

/**
 * 오늘의 틈 8칸 (기획서 §4.2).
 * 완료 = amber, 미완료 = 카본 인셋. 넘긴 회차는 색을 바꾸지 않고 비워 둔다.
 * 8회를 넘으면 모두 채운 상태를 유지한다 — 숫자는 옆의 문장이 말한다.
 */
export default function PixelSlotMeter({
  count,
  label,
  accessibilityLabel
}: {
  count: number;
  label: string;
  accessibilityLabel: string;
}) {
  return (
    <View style={styles.row} accessible accessibilityLabel={accessibilityLabel}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.slots}>
        {Array.from({ length: SLOT_COUNT }, (_, index) => (
          <View
            key={index}
            style={[styles.slot, index < count ? styles.slotDone : styles.slotEmpty]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderStyle: "dotted",
    borderColor: colors.mutedIndigo
  },
  label: { color: colors.carbon, fontSize: 12 },
  slots: { flexDirection: "row", gap: 6 },
  slot: { width: 18, height: 18 },
  slotDone: {
    backgroundColor: colors.amber,
    borderWidth: 1,
    borderColor: colors.signalDeep
  },
  slotEmpty: {
    backgroundColor: colors.carbon,
    borderWidth: 1,
    borderColor: colors.hairline
  }
});
