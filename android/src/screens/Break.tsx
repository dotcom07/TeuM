import { useKeepAwake } from "expo-keep-awake";
import { useEffect, useRef, useState } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import { Eyebrow, Plate, PrimaryButton, SecondaryButton } from "../components/ui";
import { pad2 } from "../lib/time";
import { colors } from "../theme";

const ROUTINE_MS = 60_000;
const DONE_MS = 4_000;

/**
 * 1분 루틴 화면 (A-07) + O 응답 후 완료 상태 (A-08).
 * - 알람이 울리면 60초 동안 화면을 켜 둔다.
 * - 60초가 끝나도 자동으로 O 처리하지 않고 `어땠나요?` 상태에서 선택을 기다린다.
 * - 응답은 세 가지뿐: `5분 뒤에 다시` / `O 네, 챙겼어요` / `X 이번엔 넘길게요`.
 *   `완료`는 숙제처럼, `못 했어요`는 죄책감으로 느껴져 쓰지 않는다.
 * - 뒤로 가기는 X가 아니라 `응답 없음`으로 구분한다.
 */
export default function Break({
  nextLabel,
  onSnooze,
  onDone,
  onSkip,
  onUnanswered,
  onClose
}: {
  /** 완료 화면에 보여 줄 다음 알람 안내 (예: "약 1시간") */
  nextLabel: string;
  onSnooze: () => void;
  /** O — 누른 즉시 기록·다음 알람 계산. 화면은 완료 문구를 보여 준 뒤 onClose. */
  onDone: () => void;
  onSkip: () => void;
  /** 뒤로 가기 등 응답 없이 닫힘 */
  onUnanswered: () => void;
  /** 완료 문구 4초 노출 후 홈 복귀 */
  onClose: () => void;
}) {
  useKeepAwake();
  const startedAt = useRef(Date.now());
  const [now, setNow] = useState(Date.now());
  const [donePhase, setDonePhase] = useState(false);
  const respondedRef = useRef(false);
  // 부모가 매초 리렌더돼도 완료 타이머가 리셋되지 않게 ref로 고정한다.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const elapsed = now - startedAt.current;
  const asking = elapsed >= ROUTINE_MS;
  const secondsLeft = Math.max(0, Math.ceil((ROUTINE_MS - elapsed) / 1000));

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const respond = (handler: () => void, showDone = false) => {
    if (respondedRef.current) return;
    respondedRef.current = true;
    handler();
    if (showDone) setDonePhase(true);
  };

  useEffect(() => {
    if (!donePhase) return;
    const id = setTimeout(() => onCloseRef.current(), DONE_MS);
    return () => clearTimeout(id);
  }, [donePhase]);

  // 하드웨어 뒤로 가기 = 응답 없음 (X와 구분한다)
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      respond(onUnanswered);
      return true;
    });
    return () => sub.remove();
  }, []);

  if (donePhase) {
    return (
      <View style={styles.wrap}>
        <Plate background={colors.lavender} style={styles.plate}>
          <Eyebrow>WELL DONE</Eyebrow>
          <Text style={styles.doneTitle}>충분해요.</Text>
          <Text style={styles.doneCopy}>다시 당신의 흐름으로 돌아가요.</Text>
          <Text style={styles.doneSub}>{`다음 건강 알람은 ${nextLabel} 뒤에 울려요.`}</Text>
        </Plate>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Plate background={colors.lavender} style={styles.plate}>
        <Eyebrow>{asking ? "HOW WAS IT" : "ONE MINUTE PAUSE"}</Eyebrow>
        <Text style={styles.title}>1분의 틈</Text>
        {asking ? (
          <Text style={styles.askBadge}>어땠나요?</Text>
        ) : (
          <Text style={styles.clock} accessibilityLabel={`남은 시간 ${secondsLeft}초`}>
            {`0${Math.floor(secondsLeft / 60)}:${pad2(secondsLeft % 60)}`}
          </Text>
        )}
        <Text style={styles.copy}>
          물 한 모금 마시고,{"\n"}자리에서 일어나 가볍게 스트레칭해 보세요.
        </Text>
        <Text style={styles.question}>
          물 한 모금이나 스트레칭,{"\n"}하나라도 챙겼나요?
        </Text>
        <View style={styles.actions}>
          <SecondaryButton
            label="5분 뒤에 다시"
            onPress={() => respond(onSnooze)}
            style={styles.snoozeButton}
          />
          <View style={styles.answerRow}>
            <PrimaryButton
              label="O  네, 챙겼어요"
              onPress={() => respond(onDone, true)}
              style={styles.answer}
            />
            <SecondaryButton
              label="X  이번엔 넘길게요"
              onPress={() => respond(onSkip)}
              style={styles.answer}
            />
          </View>
        </View>
      </Plate>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 14 },
  plate: { flex: 1, alignItems: "center", justifyContent: "center", padding: 26 },
  title: {
    color: colors.surface,
    fontSize: 40,
    fontWeight: "900",
    textShadowColor: colors.chromeIndigo,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0
  },
  clock: {
    marginVertical: 26,
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: colors.carbon,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.chromeIndigo,
    fontSize: 38,
    fontWeight: "900",
    fontVariant: ["tabular-nums"]
  },
  askBadge: {
    marginVertical: 26,
    paddingHorizontal: 22,
    paddingVertical: 12,
    color: colors.carbon,
    backgroundColor: colors.amber,
    borderWidth: 3,
    borderColor: colors.chromeIndigo,
    fontSize: 22,
    fontWeight: "900"
  },
  copy: {
    color: colors.carbon,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    fontWeight: "700"
  },
  question: {
    marginTop: 18,
    color: colors.chromeIndigo,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    fontWeight: "700"
  },
  actions: { width: "100%", marginTop: 24, gap: 10 },
  snoozeButton: { width: "100%" },
  answerRow: { flexDirection: "row", gap: 10 },
  answer: { flex: 1 },
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
