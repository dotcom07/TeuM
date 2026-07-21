import { useEffect, useMemo, useState } from "react";
import teumLogo from "./assets/teum-logo.png";

type View = "home" | "break" | "settings";
type Pause = "active" | "paused";

const HOUR = 60 * 60;

function formatRemaining(seconds: number) {
  const minutes = Math.max(0, Math.ceil(seconds / 60));
  return `${minutes}분`;
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [state, setState] = useState<Pause>("active");
  const [remaining, setRemaining] = useState(HOUR);
  const [breakSeconds, setBreakSeconds] = useState(60);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (state !== "active" || view === "break") return;
    const timer = window.setInterval(() => {
      setRemaining((value) => (value > 0 ? value - 1 : HOUR));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [state, view]);

  useEffect(() => {
    if (view !== "break") return;
    if (breakSeconds === 0) {
      setNotice("충분해요. 다시 당신의 흐름으로 돌아가요.");
      setRemaining(HOUR);
      setView("home");
      setBreakSeconds(60);
      return;
    }
    const timer = window.setTimeout(() => setBreakSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [view, breakSeconds]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const indicator = useMemo(
    () => `${Math.round((remaining / HOUR) * 100)}%`,
    [remaining]
  );

  const startBreak = () => {
    setBreakSeconds(60);
    setView("break");
  };

  const postpone = () => {
    setRemaining(5 * 60);
    setNotice("5분 뒤에 한 번만 다시 알려드릴게요.");
  };

  const skip = () => {
    setRemaining(HOUR);
    setNotice("괜찮아요. 다음 틈에 다시 만나요.");
  };

  return (
    <main className="app-shell">
      <header className="masthead">
        <div className="speech-bubble">흐름을 지키는 작은 틈!</div>
        <div className="pixel-spark" aria-hidden="true">✦</div>
        <div className="masthead-label">WORK RHYTHM CONSOLE · 01</div>
      </header>

      <nav className="command-bar" aria-label="주요 메뉴">
        <button className="logo-pill" onClick={() => setView("home")} aria-label="TeuM 홈으로">
          <img src={teumLogo} alt="" />
          <span>TeuM</span>
        </button>
        <span className="nav-status">틈새움</span>
        <span className="nav-status">매시간 1분</span>
        <button className="nav-button" onClick={() => setView("settings")}>설정</button>
      </nav>

      <div className="subnav">PC DESK MODE <span>•</span> 알림은 조용하게, 선택은 언제나 당신에게</div>

      {notice && <div className="toast" role="status">{notice}</div>}

      {view === "settings" ? (
        <Settings onBack={() => setView("home")} />
      ) : view === "break" ? (
        <BreakScreen seconds={breakSeconds} onFinish={() => {
          setNotice("괜찮아요. 다시 당신의 흐름으로 돌아가요.");
          setRemaining(HOUR);
          setView("home");
        }} />
      ) : (
        <section className="dashboard">
          <div className="hero-plate">
            <p className="eyebrow">NEXT PAUSE SIGNAL</p>
            <h1>다음 틈까지<br /><strong>{formatRemaining(remaining)}</strong></h1>
            <p className="hero-copy">마무리할 틈이 생기면, 물 한 모금과 1분의 움직임을 해요.</p>
            <div className="meter" aria-label={`다음 휴식까지 ${indicator}`}>
              <span style={{ width: indicator }} />
            </div>
          </div>

          <aside className="action-rail">
            <div className="rail-label">QUICK ACTION</div>
            <button className="primary-action" onClick={startBreak}>지금 1분 <span>▶</span></button>
            <button className="rail-button" onClick={postpone}>5분 뒤</button>
            <button className="rail-button" onClick={skip}>이번엔 넘기기</button>
          </aside>

          <section className="info-plate">
            <div className="plate-tab">TODAY'S RHYTHM</div>
            <p>업무 시간 <b>09:00–18:00</b></p>
            <p>알림 방식 <b>무음 · 화면 배너 12초</b></p>
            <p>현재 상태 <b>{state === "active" ? "알림 대기 중" : "잠시 멈춤"}</b></p>
          </section>

          <section className="info-plate control-plate">
            <div className="plate-tab">CONTROL PANEL</div>
            <p>지금은 알림을 {state === "active" ? "받고 있어요." : "잠시 멈춘 상태예요."}</p>
            <button
              className="amber-button"
              onClick={() => setState((value) => value === "active" ? "paused" : "active")}
            >
              {state === "active" ? "잠시 멈춤" : "다시 시작"}
            </button>
          </section>
        </section>
      )}

      <footer>TeuM · ONE MINUTE FOR A HEALTHIER WORKDAY · NO PERSONAL HEALTH DATA</footer>
    </main>
  );
}

function BreakScreen({ seconds, onFinish }: { seconds: number; onFinish: () => void }) {
  return (
    <section className="break-plate">
      <p className="eyebrow">ONE MINUTE PAUSE</p>
      <h1>1분의 틈</h1>
      <div className="break-clock">00:{String(seconds).padStart(2, "0")}</div>
      <p>물 한 모금 마시고,<br />자리에서 일어나 몸을 가볍게 펴 보세요.</p>
      <button className="rail-button stop-button" onClick={onFinish}>지금은 그만</button>
    </section>
  );
}

function Settings({ onBack }: { onBack: () => void }) {
  const [silent, setSilent] = useState(true);
  const [deferFullscreen, setDeferFullscreen] = useState(true);
  return (
    <section className="settings-plate">
      <div className="plate-tab">SETTINGS</div>
      <h1>업무 리듬 설정</h1>
      <label>업무 시작 <input type="time" defaultValue="09:00" /></label>
      <label>업무 종료 <input type="time" defaultValue="18:00" /></label>
      <p className="fixed-field">알림 간격 <b>매 60분</b></p>
      <label className="toggle-row"><input type="checkbox" checked={silent} onChange={(event) => setSilent(event.target.checked)} /> 무음 알림 사용</label>
      <label className="toggle-row"><input type="checkbox" checked={deferFullscreen} onChange={(event) => setDeferFullscreen(event.target.checked)} /> 전체 화면·화면 공유 중 알림 보류</label>
      <p className="privacy-copy">틈새움은 건강·행동 데이터를 수집하거나 외부로 전송하지 않습니다.</p>
      <button className="primary-action" onClick={onBack}>저장하고 돌아가기 <span>▶</span></button>
    </section>
  );
}
