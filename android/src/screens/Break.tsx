import { useKeepAwake } from "expo-keep-awake";
import { useEffect, useRef, useState } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import { Eyebrow, Plate, SecondaryButton } from "../components/ui";
import { pad2 } from "../lib/time";
import { colors } from "../theme";

const ROUTINE_MS = 60_000;
const DONE_MS = 4_000;

/**
 * 1분 루틴 화면 (A-07) + 완료 상태 (A-08).
 * - 사용자가 직접 시작한 60초 동안만 화면을 켜 둔다.
 * - 60초가 지나면 완료 문구로 바꾸고 4초 뒤 부드럽게 홈으로 돌아간다.
 * - `지금은 그만`도 조용히 홈으로 돌아간다. 부정적 피드백은 없다.
 */
export default function Break({
  nextLabel,
  onFinish
}: {
  /** 완료 화면에 보여 줄 다음 틈 안내 (예: "약 1시간") */
  nextLabel: string;
  /** 루틴 종료(완료·중단 모두). 이 시점부터 다음 간격을 계산한다. */
  onFinish: () => void;
}) {
  useKeepAwake();
  const startedAt = useRef(Date.now());
  const [now, setNow] = useState(Date.now());
  const finishedRef = useRef(false);

  const elapsed = now - startedAt.current;
  const phase: "routine" | "done" = elapsed < ROUTINE_MS ? "routine" : "done";
  const secondsLeft = Math.max(0, Math.ceil((ROUTINE_MS - elapsed) / 1000));

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish();
  };

  useEffect(() => {
    if (elapsed >= ROUTINE_MS + DONE_MS) finish();
  }, [elapsed]);

  // 하드웨어 뒤로 가기 = 지금은 그만 (조용히 홈으로)
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      finish();
      return true;
    });
    return () => sub.remove();
  }, []);

  if (phase === "done") {
    return (
      <View style={styles.wrap}>
        <Plate background={colors.lavender} style={styles.plate}>
          <Eyebrow>WELL DONE</Eyebrow>
          <Text style={styles.doneTitle}>충분해요.</Text>
          <Text style={styles.doneCopy}>다시 당신의 흐름으로 돌아가요.</Text>
          <Text style={styles.doneSub}>{`다음 틈은 ${nextLabel} 뒤에 알려드릴게요.`}</Text>
        </Plate>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Plate background={colors.lavender} style={styles.plate}>
        <Eyebrow>ONE MINUTE PAUSE</Eyebrow>
        <Text style={styles.title}>1분의 틈</Text>
        <Text
          style={styles.clock}
          accessibilityLabel={`남은 시간 ${secondsLeft}초`}
        >
          {`0${Math.floor(secondsLeft / 60)}:${pad2(secondsLeft % 60)}`}
        </Text>
        <Text style={styles.copy}>
          물 한 모금 마시고,{"\n"}자리에서 일어나 몸을 가볍게 펴 보세요.
        </Text>
        <SecondaryButton label="지금은 그만" onPress={finish} style={styles.stop} />
      </Plate>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 14 },
  plate: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30 },
  title: {
    color: colors.surface,
    fontSize: 42,
    fontWeight: "900",
    textShadowColor: colors.chromeIndigo,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0
  },
  clock: {
    marginVertical: 32,
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: colors.carbon,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.chromeIndigo,
    fontSize: 40,
    fontWeight: "900",
    fontVariant: ["tabular-nums"]
  },
  copy: {
    color: colors.carbon,
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    fontWeight: "700"
  },
  stop: { width: 180, marginTop: 30 },
  doneTitle: {
    color: colors.surface,
    fontSize: 38,
    fontWeight: "900",
    textShadowColor: colors.chromeIndigo,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0
  },
  doneCopy: { marginTop: 12, color: colors.carbon, fontSize: 16, fontWeight: "700" },
  doneSub: { marginTop: 20, color: colors.chromeIndigo, fontSize: 12 }
});
