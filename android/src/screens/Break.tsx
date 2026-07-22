import { useKeepAwake } from "expo-keep-awake";
import { useEffect, useRef, useState } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import { Eyebrow, Plate, PrimaryButton, SecondaryButton } from "../components/ui";
import { useI18n } from "../i18n";
import { pad2 } from "../lib/time";
import { colors } from "../theme";

const ROUTINE_MS = 60_000;

/**
 * 1분 루틴 화면 (A-07).
 * - 알람이 울리면 60초 동안 화면을 켜 둔다.
 * - 60초가 끝나도 자동으로 챙김 처리하지 않고 `어땠나요?` 상태에서 선택을 기다린다.
 * - 선택은 세 가지뿐: `5분 뒤에 다시` / `네, 챙겼어요` / `이번엔 넘길게요`.
 *   `완료`는 숙제처럼, `못 했어요`는 죄책감으로 느껴져 쓰지 않는다.
 * - 뒤로 가기는 `이번엔 넘길게요`와 구분해 저장한다.
 */
export default function Break({
  onSnooze,
  onDone,
  onSkip,
  onUnanswered
}: {
  onSnooze: () => void;
  /** 챙김 — 누른 즉시 기록·다음 알람 계산 후 홈으로 돌아간다. */
  onDone: () => void;
  onSkip: () => void;
  /** 뒤로 가기 등 선택 없이 닫힘 */
  onUnanswered: () => void;
}) {
  const { tr } = useI18n();
  useKeepAwake();
  const startedAt = useRef(Date.now());
  const [now, setNow] = useState(Date.now());
  const respondedRef = useRef(false);

  const elapsed = now - startedAt.current;
  const asking = elapsed >= ROUTINE_MS;
  const secondsLeft = Math.max(0, Math.ceil((ROUTINE_MS - elapsed) / 1000));

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const respond = (handler: () => void) => {
    if (respondedRef.current) return;
    respondedRef.current = true;
    handler();
  };

  // 하드웨어 뒤로 가기는 명시적으로 넘긴 선택과 구분한다.
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      respond(onUnanswered);
      return true;
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.wrap}>
      <Plate background={colors.lavender} style={styles.plate}>
        <Eyebrow>{asking ? "HOW WAS IT" : "ONE MINUTE PAUSE"}</Eyebrow>
        <Text style={styles.title}>{tr("1분의 틈", "One-minute break")}</Text>
        {asking ? (
          <Text style={styles.askBadge}>{tr("어땠나요?", "How did it go?")}</Text>
        ) : (
          <Text style={styles.clock} accessibilityLabel={tr(`남은 시간 ${secondsLeft}초`, `${secondsLeft} seconds remaining`)}>
            {`0${Math.floor(secondsLeft / 60)}:${pad2(secondsLeft % 60)}`}
          </Text>
        )}
        <Text style={styles.copy}>
          {tr(
            "물 한 모금 마시고,\n자리에서 일어나 가볍게 스트레칭해 보세요.",
            "Take a sip of water,\nstand up, and stretch gently."
          )}
        </Text>
        <Text style={styles.question}>
          {tr(
            "물 한 모금이나 스트레칭,\n하나라도 챙겼나요?",
            "Did you take a sip of water\nor stretch?"
          )}
        </Text>
        <View style={styles.actions}>
          <SecondaryButton
            label={tr("5분 뒤에 다시", "Remind me in 5 min")}
            onPress={() => respond(onSnooze)}
            style={styles.snoozeButton}
          />
          <View style={styles.answerRow}>
            <PrimaryButton
              label={tr("네, 챙겼어요", "Yes, I did")}
              onPress={() => respond(onDone)}
              style={styles.answer}
            />
            <SecondaryButton
              label={tr("이번엔 넘길게요", "I’ll skip this one")}
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
});
