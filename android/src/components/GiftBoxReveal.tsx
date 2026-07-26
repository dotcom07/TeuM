import { useEffect, useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useI18n } from "../i18n";
import { itemById, PixelItem } from "../pixel/catalog";
import type { RewardBox } from "../pixel/deskState";
import { PixelGlyph } from "../pixel/PixelGlyph";
import { createGiftParticles, giftParticleTrack } from "../pixel/pixelMotion";
import { themePaletteFor } from "../pixel/themePalettes";
import { colors, MIN_TOUCH } from "../theme";

const BOX_ROWS = [
  "CCCCCCCCCC",
  "CAAAACAAAC",
  "CAAAACAAAC",
  "CCCCCCCCCC",
  "CAAAACAAAC",
  "CAAAACAAAC",
  "CAAAACAAAC",
  "CCCCCCCCCC"
];
const LID_ROWS = ["..AA..AA..", ".AACCCCAA.", "CCCCCCCCCC"];

function ItemResult({ item }: { item: PixelItem }) {
  const rows = item.frames.base;
  const width = Math.max(...rows.map((row) => row.length));
  const height = rows.length;
  const box = 56;
  const raw = Math.min(box / width, box / height);
  const scale = raw >= 1 ? Math.floor(raw) : raw;
  const previewBackground = themePaletteFor(item.themeKey)?.colors.background ?? colors.canvasSoft;
  const separateEdges = !item.slots.some((slot) => slot === "wallpaper" || slot === "flooring");
  const { language } = useI18n();
  return (
    <View style={styles.itemResult}>
      <View
        style={{
          width: box,
          height: box,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: previewBackground
        }}
      >
        <View style={{ width: width * scale, height: height * scale }}>
          <PixelGlyph
            rows={rows}
            x={0}
            y={0}
            scale={scale}
            themeKey={item.themeKey}
            itemId={item.id}
            separateEdges={separateEdges}
            separationBackground={previewBackground}
          />
        </View>
      </View>
      <Text numberOfLines={2} style={styles.itemName}>
        {language === "ko" ? item.nameKo : item.nameEn}
      </Text>
    </View>
  );
}

export default function GiftBoxReveal({
  box,
  visible,
  onDismiss
}: {
  box: RewardBox | null;
  visible: boolean;
  onDismiss: () => void;
}) {
  const { tr } = useI18n();
  const progress = useRef(new Animated.Value(0)).current;
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const items = useMemo(
    () =>
      (box?.itemIds ?? [])
        .map((id) => itemById(id))
        .filter((item): item is PixelItem => item != null),
    [box]
  );
  const particles = useMemo(
    () => createGiftParticles(box?.id ?? "gift-preview").map((particle) => ({
      ...particle,
      track: giftParticleTrack(particle)
    })),
    [box?.id]
  );

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!visible || !box) return;
    setReady(false);
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: reduceMotion ? 250 : 1350,
      useNativeDriver: true
    });
    animation.start(({ finished }) => {
      if (finished) setReady(true);
    });
    return () => animation.stop();
  }, [box, progress, reduceMotion, visible]);

  const boxMotion = {
    opacity: progress.interpolate({
      inputRange: reduceMotion ? [0, 1] : [0, 0.08, 1],
      outputRange: reduceMotion ? [0, 1] : [0, 1, 1]
    }),
    transform: reduceMotion
      ? []
      : [
          {
            translateY: progress.interpolate({
              inputRange: [0, 0.15, 0.22, 1],
              outputRange: [16, -4, 0, 0]
            })
          },
          {
            translateX: progress.interpolate({
              inputRange: [0, 0.2, 0.26, 0.32, 0.38, 0.44, 0.5, 1],
              outputRange: [0, 0, -6, 6, -6, 6, 0, 0]
            })
          }
        ]
  };
  const lidMotion = {
    transform: reduceMotion
      ? []
      : [
          {
            translateY: progress.interpolate({
              inputRange: [0, 0.55, 0.78, 1],
              outputRange: [0, 0, -46, -46]
            })
          }
        ]
  };
  return (
    <Modal
      transparent
      visible={visible && box != null}
      animationType="fade"
      onRequestClose={() => {
        if (ready) onDismiss();
      }}
    >
      <View style={styles.backdrop}>
        <View accessibilityViewIsModal style={styles.plate}>
          <Text style={styles.eyebrow}>PIXEL GIFT · {box?.preview ? "PREVIEW" : "NEW"}</Text>
          <Text accessibilityRole="header" style={styles.title}>
            {tr("선물상자를 열었어요!", "Your gift box is open!")}
          </Text>
          <Text style={styles.copy}>
            {tr("슈류류륭— 새로운 책상 아이템이 도착했어요.", "Shrrring—new desk items have arrived.")}
          </Text>

          <View style={styles.stage}>
            {!reduceMotion && (
              <View pointerEvents="none" style={styles.particleField}>
                {particles.map((particle, index) => (
                  <Animated.View
                    key={index}
                    style={{
                      position: "absolute",
                      left: 88 - particle.size / 2,
                      top: 104 - particle.size / 2,
                      width: particle.size,
                      height: particle.size,
                      backgroundColor:
                        particle.colorIndex === 0
                          ? colors.surface
                          : particle.colorIndex === 1
                            ? colors.amber
                            : colors.lavender,
                      opacity: progress.interpolate({
                        inputRange: particle.track.inputRange,
                        outputRange: particle.track.opacity
                      }),
                      transform: [
                        {
                          translateX: progress.interpolate({
                            inputRange: particle.track.inputRange,
                            outputRange: particle.track.x
                          })
                        },
                        {
                          translateY: progress.interpolate({
                            inputRange: particle.track.inputRange,
                            outputRange: particle.track.y
                          })
                        }
                      ]
                    }}
                  />
                ))}
              </View>
            )}

            <Animated.View style={[styles.boxArt, boxMotion]}>
              <View style={styles.boxBody}>
                <PixelGlyph rows={BOX_ROWS} x={0} y={0} scale={8} />
              </View>
              <Animated.View style={[styles.boxLid, lidMotion]}>
                <PixelGlyph rows={LID_ROWS} x={0} y={0} scale={8} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.glow,
                  {
                    opacity: progress.interpolate({
                      inputRange: reduceMotion ? [0, 1] : [0, 0.52, 0.72, 0.86, 1],
                      outputRange: reduceMotion ? [0, 0] : [0, 0, 1, 0.2, 0]
                    }),
                    transform: [
                      {
                        scale: progress.interpolate({
                          inputRange: [0, 0.72, 0.9, 1],
                          outputRange: [0.2, 0.2, 1.5, 1.7]
                        })
                      }
                    ]
                  }
                ]}
              />
            </Animated.View>
          </View>

          <View style={styles.results}>
            {items.map((item, index) => {
              const start = 0.7 + index * 0.06;
              const peak = start + 0.12;
              const end = Math.min(0.98, peak + 0.05);
              return (
                <Animated.View
                  key={item.id}
                  style={{
                    flex: 1,
                    opacity: progress.interpolate({
                      inputRange: reduceMotion ? [0, 1] : [0, start, peak, 1],
                      outputRange: reduceMotion ? [0, 1] : [0, 0, 1, 1]
                    }),
                    transform: reduceMotion
                      ? []
                      : [
                          {
                            translateY: progress.interpolate({
                              inputRange: [0, start, peak, end, 1],
                              outputRange: [20, 20, -4, 0, 0]
                            })
                          }
                        ]
                  }}
                >
                  <ItemResult item={item} />
                </Animated.View>
              );
            })}
          </View>

          <Pressable
            disabled={!ready}
            onPress={onDismiss}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.confirm,
              !ready && styles.confirmDisabled,
              pressed && ready && styles.confirmPressed
            ]}
          >
            <Text style={styles.confirmText}>
              {ready ? tr("내 책상에서 보기", "See them on my desk") : tr("상자 여는 중…", "Opening…")}
            </Text>
          </Pressable>
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
    backgroundColor: "rgba(17, 19, 26, 0.82)"
  },
  plate: {
    width: "100%",
    maxWidth: 420,
    padding: 18,
    backgroundColor: colors.platinum,
    borderWidth: 3,
    borderTopColor: colors.highlight,
    borderLeftColor: colors.highlight,
    borderRightColor: colors.chromeIndigo,
    borderBottomColor: colors.chromeIndigo
  },
  eyebrow: {
    marginHorizontal: -18,
    marginTop: -18,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.amber,
    backgroundColor: colors.carbon,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2
  },
  title: { color: colors.carbon, fontSize: 22, lineHeight: 29, fontWeight: "900", textAlign: "center" },
  copy: { marginTop: 6, color: colors.chromeIndigo, fontSize: 12, lineHeight: 18, textAlign: "center" },
  stage: { height: 174, alignItems: "center", justifyContent: "center", overflow: "visible" },
  particleField: { position: "absolute", width: 176, height: 160 },
  boxArt: { width: 80, height: 86, marginTop: 38 },
  boxBody: { position: "absolute", left: 0, top: 22, width: 80, height: 64 },
  boxLid: { position: "absolute", left: 0, top: 14, width: 80, height: 24, zIndex: 3 },
  glow: {
    position: "absolute",
    left: 31,
    top: 6,
    width: 18,
    height: 18,
    backgroundColor: colors.surface,
    zIndex: 2
  },
  results: { flexDirection: "row", justifyContent: "center", gap: 8, minHeight: 94 },
  itemResult: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    padding: 6,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderTopColor: colors.highlight,
    borderLeftColor: colors.highlight,
    borderRightColor: colors.mutedIndigo,
    borderBottomColor: colors.mutedIndigo
  },
  itemName: { color: colors.carbon, fontSize: 10, lineHeight: 13, fontWeight: "800", textAlign: "center" },
  confirm: {
    minHeight: MIN_TOUCH,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    backgroundColor: colors.amber,
    borderWidth: 2,
    borderTopColor: colors.amberHighlight,
    borderLeftColor: colors.amberHighlight,
    borderRightColor: colors.signalDeep,
    borderBottomColor: colors.signalDeep
  },
  confirmDisabled: { opacity: 0.55 },
  confirmPressed: { transform: [{ translateY: 1 }] },
  confirmText: { color: colors.carbon, fontSize: 12, fontWeight: "900" }
});
