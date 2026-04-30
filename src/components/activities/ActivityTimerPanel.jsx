import React, { useEffect, useMemo, useState } from "react";
import { theme } from "../../styles/theme.js";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

export default function ActivityTimerPanel({
  activity,
  onStartActivity,
  onFinishActivity,
}) {
  const totalSeconds = useMemo(() => {
    return Math.max(1, Number(activity?.t || 5)) * 60;
  }, [activity]);

  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [timerStatus, setTimerStatus] = useState("ready");

  const progress = remainingSeconds / totalSeconds;
  const progressDegrees = Math.max(0, Math.min(1, progress)) * 360;

  useEffect(() => {
    setRemainingSeconds(totalSeconds);
    setTimerStatus("ready");
  }, [totalSeconds, activity?.id]);

  useEffect(() => {
    if (timerStatus !== "running") return undefined;

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setTimerStatus("finished");
          onFinishActivity?.(activity);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerStatus, activity, onFinishActivity]);

  function startTimer() {
    setTimerStatus("running");
    onStartActivity?.(activity);
  }

  function pauseTimer() {
    setTimerStatus("paused");
  }

  function resumeTimer() {
    setTimerStatus("running");
  }

  function resetTimer() {
    setRemainingSeconds(totalSeconds);
    setTimerStatus("ready");
  }

  function finishTimer() {
    setRemainingSeconds(0);
    setTimerStatus("finished");
    onFinishActivity?.(activity);
  }

  const isReady = timerStatus === "ready";
  const isRunning = timerStatus === "running";
  const isPaused = timerStatus === "paused";
  const isFinished = timerStatus === "finished";

  return (
    <section style={styles.timerCard}>
      <div style={styles.timerHeader}>
        <div>
          <div style={styles.timerEyebrow}>Chrono d’activité</div>

          <h2 style={styles.timerTitle}>
            {isFinished ? "Activité terminée" : "Prêt à commencer"}
          </h2>

          <p style={styles.timerText}>
            {isReady &&
              "Installe l’activité, puis lance le chrono quand tout est prêt."}
            {isRunning &&
              "L’activité est en cours. Tu peux accompagner ton enfant sans écran."}
            {isPaused && "Le chrono est en pause. Tu peux reprendre quand tu veux."}
            {isFinished &&
              "Bravo, l’activité est terminée. L’évaluation viendra à l’étape suivante."}
          </p>
        </div>
      </div>

      <div style={styles.timerCenter}>
        <div
          style={{
            ...styles.timerRing,
            background: `conic-gradient(#FF7A2F ${progressDegrees}deg, rgba(255,122,47,0.12) ${progressDegrees}deg 360deg)`,
          }}
        >
          <div style={styles.timerInner}>
            <div style={styles.timerValue}>{formatTime(remainingSeconds)}</div>
            <div style={styles.timerLabel}>
              {activity?.timeLabel || `${activity?.t || 5} min`}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.actions}>
        {isReady && (
          <button type="button" onClick={startTimer} style={styles.primaryButton}>
            Démarrer
          </button>
        )}

        {isRunning && (
          <>
            <button type="button" onClick={pauseTimer} style={styles.secondaryButton}>
              Pause
            </button>

            <button type="button" onClick={finishTimer} style={styles.primaryButton}>
              Terminer
            </button>
          </>
        )}

        {isPaused && (
          <>
            <button type="button" onClick={resumeTimer} style={styles.primaryButton}>
              Reprendre
            </button>

            <button type="button" onClick={finishTimer} style={styles.secondaryButton}>
              Terminer
            </button>
          </>
        )}

        {isFinished && (
          <button type="button" onClick={resetTimer} style={styles.secondaryButton}>
            Recommencer
          </button>
        )}
      </div>
    </section>
  );
}

const styles = {
  timerCard: {
    marginTop: 16,
    padding: 18,
    borderRadius: 34,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,247,236,0.92) 100%)",
    border: `1px solid ${theme.colors.border}`,
    boxShadow: "0 18px 42px rgba(23, 32, 51, 0.08)",
  },

  timerHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
  },

  timerEyebrow: {
    display: "inline-flex",
    padding: "7px 11px",
    borderRadius: 999,
    background: "rgba(255, 122, 47, 0.12)",
    color: "#FF7A2F",
    fontFamily: theme.fonts.body,
    fontSize: 12,
    fontWeight: 950,
  },

  timerTitle: {
    margin: "12px 0 0",
    fontFamily: theme.fonts.title,
    color: theme.colors.ink,
    fontSize: 24,
    lineHeight: 1.05,
    fontWeight: 950,
  },

  timerText: {
    margin: "8px 0 0",
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 1.4,
    fontWeight: 800,
  },

  timerCenter: {
    display: "grid",
    placeItems: "center",
    marginTop: 18,
  },

  timerRing: {
    width: 188,
    height: 188,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    boxShadow:
      "0 18px 40px rgba(255, 122, 47, 0.18), inset 0 0 0 1px rgba(255,255,255,0.6)",
    transition: "background 260ms linear",
  },

  timerInner: {
    width: 146,
    height: 146,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    alignContent: "center",
    background: "rgba(255,255,255,0.94)",
    boxShadow: "inset 0 0 0 1px rgba(23,32,51,0.06)",
  },

  timerValue: {
    fontFamily: theme.fonts.title,
    color: theme.colors.ink,
    fontSize: 36,
    lineHeight: 1,
    fontWeight: 950,
    letterSpacing: -1,
  },

  timerLabel: {
    marginTop: 6,
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: 900,
  },

  actions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 18,
  },

  primaryButton: {
    minHeight: 54,
    border: "none",
    borderRadius: 20,
    background: "linear-gradient(135deg, #FF7A2F 0%, #FFC83D 100%)",
    color: "white",
    fontFamily: theme.fonts.title,
    fontSize: 16,
    fontWeight: 950,
    boxShadow: "0 14px 30px rgba(255, 122, 47, 0.24)",
    cursor: "pointer",
  },

  secondaryButton: {
    minHeight: 54,
    border: "none",
    borderRadius: 20,
    background: "rgba(23, 32, 51, 0.06)",
    color: theme.colors.ink,
    fontFamily: theme.fonts.title,
    fontSize: 16,
    fontWeight: 950,
    cursor: "pointer",
  },
};