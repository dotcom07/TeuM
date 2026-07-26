import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useI18n } from "../i18n";
import type { PixelItem } from "../pixel/catalog";
import { PixelGlyph } from "../pixel/PixelGlyph";
import { colors, MIN_TOUCH } from "../theme";

const CLOSED_BOX = [
  "...AA...",
  "..ACCA..",
  "CCCCCCCC",
  "CAACCAAC",
  "CCCCCCCC",
  "CPPCPPCP",
  "CPPCPPCP",
  "CCCCCCCC"
];

const OPEN_BOX = [
  "CC....CC",
  "CAACCAAC",
  ".CCCCCC.",
  "........",
  "CCCCCCCC",
  "CPPCPPCP",
  "CPPCPPCP",
  "CCCCCCCC"
];

function ItemArt({ item }: { item: PixelItem }) {
  const rows = item.frames.base;
  const width = Math.max(...rows.map((row) => row.length));
  const height = rows.length;
  const scale = Math.max(1, Math.min(10, Math.floor(Math.min(96 / width, 80 / height))));
  return (
    <View style={styles.itemArt}>
      <View style={{ width: width * scale, height: height * scale }}>
        <PixelGlyph rows={rows} x={0} y={0} scale={scale} />
      </View>
    </View>
  );
}

export default function GiftBox109({
  visible,
  pendingCount,
  onOpen,
  onDone
}: {
  visible: boolean;
  pendingCount: number;
  onOpen: () => PixelItem | null;
  onDone: () => void;
}) {
  const { language, tr } = useI18n();
  const insets = useSafeAreaInsets();
  const [item, setItem] = useState<PixelItem | null>(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!visible) {
      setItem(null);
      setOpened(false);
    }
  }, [visible]);

  const open = () => {
    const next = onOpen();
    setItem(next);
    setOpened(true);
  };

  const next = () => {
    if (pendingCount > 0) {
      setItem(null);
      setOpened(false);
    } else {
      onDone();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={opened ? next : undefined}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.card,
            { paddingBottom: Math.max(24, insets.bottom + 16) }
          ]}
        >
          <Text style={styles.eyebrow}>PIXEL GIFT</Text>
          <Text style={styles.title}>
            {opened
              ? tr("새 아이템을 만났어요!", "You found a new item!")
              : tr("선물상자가 도착했어요", "A gift box arrived")}
          </Text>

          <View style={styles.stage}>
            {opened && (
              <>
                <View style={[styles.spark, styles.sparkOne]} />
                <View style={[styles.spark, styles.sparkTwo]} />
                <View style={[styles.spark, styles.sparkThree]} />
                <View style={[styles.spark, styles.sparkFour]} />
              </>
            )}
            <View style={{ width: 80, height: 80 }}>
              <PixelGlyph
                rows={opened ? OPEN_BOX : CLOSED_BOX}
                x={0}
                y={0}
                scale={10}
              />
            </View>
          </View>

          {opened && item && (
            <View style={styles.result}>
              <ItemArt item={item} />
              <Text style={styles.itemName}>
                {language === "ko" ? item.nameKo : item.nameEn}
              </Text>
            </View>
          )}
          {opened && !item && (
            <Text style={styles.completeCopy}>
              {tr("도감을 모두 모았어요.", "Your collection is complete.")}
            </Text>
          )}

          <Pressable
            onPress={opened ? next : open}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]}
          >
            <Text style={styles.buttonText}>
              {!opened
                ? tr("열기", "Open")
                : pendingCount > 0
                  ? tr(`다음 상자 · ${pendingCount}개 남음`, `Next box · ${pendingCount} left`)
                  : tr("도감에서 보기", "View collection")}
            </Text>
          </Pressable>
          {!opened && pendingCount > 1 && (
            <Text style={styles.pendingCopy}>
              {tr(
                `기다리는 상자가 ${pendingCount}개 있어요.`,
                `${pendingCount} boxes are waiting.`
              )}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(17, 19, 26, 0.76)"
  },
  card: {
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.platinum,
    borderWidth: 4,
    borderTopColor: colors.highlight,
    borderLeftColor: colors.highlight,
    borderRightColor: colors.chromeIndigo,
    borderBottomColor: colors.chromeIndigo
  },
  eyebrow: {
    color: colors.chromeIndigo,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2
  },
  title: {
    marginTop: 8,
    color: colors.carbon,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center"
  },
  stage: {
    width: 176,
    height: 116,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    backgroundColor: colors.canvasSoft,
    borderWidth: 3,
    borderColor: colors.surface
  },
  spark: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: colors.amber
  },
  sparkOne: { left: 22, top: 24 },
  sparkTwo: { right: 28, top: 16, backgroundColor: colors.surface },
  sparkThree: { left: 38, bottom: 18, backgroundColor: colors.signal },
  sparkFour: { right: 20, bottom: 32, backgroundColor: colors.systemsTeal },
  result: { width: "100%", alignItems: "center", marginTop: 14 },
  itemArt: {
    width: 112,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.highlight
  },
  itemName: {
    marginTop: 10,
    color: colors.carbon,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center"
  },
  completeCopy: {
    marginTop: 18,
    color: colors.chromeIndigo,
    fontSize: 13,
    fontWeight: "700"
  },
  button: {
    width: "100%",
    minHeight: MIN_TOUCH,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    paddingHorizontal: 16,
    backgroundColor: colors.amber,
    borderWidth: 2,
    borderTopColor: colors.amberHighlight,
    borderLeftColor: colors.amberHighlight,
    borderRightColor: colors.signalDeep,
    borderBottomColor: colors.signalDeep
  },
  buttonPressed: { backgroundColor: colors.signal },
  buttonText: { color: colors.carbon, fontSize: 14, fontWeight: "900" },
  pendingCopy: {
    marginTop: 8,
    color: colors.mutedIndigo,
    fontSize: 11,
    fontWeight: "700"
  }
});
