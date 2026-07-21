import { ReactNode } from "react";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, MIN_TOUCH, plate, spacing } from "../theme";

export function Plate({
  background = colors.periwinkle,
  style,
  children
}: {
  background?: string;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  return <View style={[plate(background), style]}>{children}</View>;
}

/** 카본 라벨 탭이 상단에 붙은 패널 */
export function Panel({
  title,
  background = colors.platinum,
  children
}: {
  title: string;
  background?: string;
  children: ReactNode;
}) {
  return (
    <View style={[plate(background), styles.panel]}>
      <Text style={styles.panelTab}>{title}</Text>
      {children}
    </View>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

/** 시그널 오렌지 — 앞으로 나아가는 행동 전용 */
export function PrimaryButton({
  label,
  onPress,
  style
}: {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed, style]}
    >
      <Text style={styles.primaryText}>{label}  ▶</Text>
    </Pressable>
  );
}

/** 카본 슬랩 — 보조 행동 */
export function SecondaryButton({
  label,
  onPress,
  style
}: {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.secondary, pressed && styles.secondaryPressed, style]}
    >
      <Text style={styles.secondaryText}>{label}</Text>
    </Pressable>
  );
}

/** 앰버 — 도구성 행동(멈춤/재개 등) */
export function AmberButton({
  label,
  onPress,
  style
}: {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.amber, pressed && styles.amberPressed, style]}
    >
      <Text style={styles.amberText}>{label}</Text>
    </Pressable>
  );
}

export function InfoRow({
  label,
  value,
  last = false
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { padding: 14 },
  panelTab: {
    marginHorizontal: -14,
    marginTop: -14,
    marginBottom: 11,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    color: colors.canvasSoft,
    backgroundColor: colors.carbon,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8
  },
  eyebrow: {
    color: colors.amber,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: spacing.sm
  },
  primary: {
    minHeight: MIN_TOUCH,
    justifyContent: "center",
    padding: 13,
    borderWidth: 2,
    borderTopColor: colors.amberHighlight,
    borderLeftColor: colors.amberHighlight,
    borderRightColor: colors.signalDeep,
    borderBottomColor: colors.signalDeep,
    backgroundColor: colors.signal
  },
  primaryPressed: { backgroundColor: colors.navGold },
  primaryText: {
    color: colors.carbon,
    fontSize: 13,
    textAlign: "center",
    fontWeight: "700",
    letterSpacing: 0.3
  },
  secondary: {
    minHeight: MIN_TOUCH,
    justifyContent: "center",
    padding: 11,
    borderWidth: 2,
    borderTopColor: colors.highlight,
    borderLeftColor: colors.highlight,
    borderRightColor: colors.hairline,
    borderBottomColor: colors.hairline,
    backgroundColor: colors.carbon
  },
  secondaryPressed: { backgroundColor: colors.shadowDeep },
  secondaryText: { color: colors.surface, fontSize: 12, textAlign: "center", fontWeight: "700" },
  amber: {
    minHeight: MIN_TOUCH,
    justifyContent: "center",
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderWidth: 2,
    borderTopColor: colors.amberHighlight,
    borderLeftColor: colors.amberHighlight,
    borderRightColor: colors.signalDeep,
    borderBottomColor: colors.signalDeep,
    backgroundColor: colors.amber
  },
  amberPressed: { backgroundColor: colors.navGold },
  amberText: { color: colors.carbon, fontSize: 12, fontWeight: "700", textAlign: "center" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderStyle: "dotted",
    borderColor: colors.mutedIndigo
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLabel: { color: colors.carbon, fontSize: 12 },
  infoValue: { color: colors.chromeIndigo, fontSize: 12, fontWeight: "700" }
});
