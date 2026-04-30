import React, { useMemo, useState } from "react";
import { assets } from "../../assets/assets.js";
import { theme } from "../../styles/theme.js";

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function getScreenFreeMinutes(totalSeconds) {
  return Math.max(1, Math.round(Number(totalSeconds || 0) / 60));
}

const MOOD_OPTIONS = [
  { id: "calmes", label: "Calmes" },
  { id: "epanouis", label: "Épanouis" },
  { id: "fatigues", label: "Fatigués" },
  { id: "excites", label: "Excités" },
  { id: "difficiles", label: "Difficiles" },
];

export default function ActivityEvaluationScreen({
  activity,
  session,
  onBack,
  onSaveEvaluation,
}) {
  const [rating, setRating] = useState(0);
  const [childMood, setChildMood] = useState("");
  const [wouldReplay, setWouldReplay] = useState("");

  const elapsedSeconds = session?.elapsedSeconds || 0;

  const screenFreeMinutes = useMemo(
    () => getScreenFreeMinutes(elapsedSeconds),
    [elapsedSeconds]
  );

  function handleSave() {
    const payload = {
      activityId: activity?.id,
      activityName: activity?.nm,
      elapsedSeconds,
      screenFreeMinutes,
      rating,
      childMood,
      wouldReplay,
      completedAt: new Date().toISOString(),
    };

    if (onSaveEvaluation) {
      onSaveEvaluation(payload);
      return;
    }

    console.log("Évaluation activité :", payload);
    onBack?.();
  }

  return (
    <section className="activity-screen-enter" style={styles.screen}>
      <section style={styles.topBar}>
        <button type="button" onClick={onBack} style={styles.backButton}>
          ← Retour
        </button>

        <div style={styles.stepPill}>Bilan</div>
      </section>

      <section style={styles.celebrationCard}>
        <div style={styles.celebrationGlow} />

        <div style={styles.celebrationText}>
          <div style={styles.eyebrow}>Bravo !</div>

          <h1 style={styles.bigResult}>+{screenFreeMinutes} min</h1>

          <p style={styles.resultText}>sans écran</p>

          <p style={styles.activityText}>
            Activité : <strong>{activity?.nm || "activité"}</strong>
          </p>

          <p style={styles.timeText}>
            Temps réalisé : {formatTime(elapsedSeconds)}
          </p>
        </div>

        <div style={styles.foxWrap}>
          {assets.foxCelebration ? (
            <video
              src={assets.foxCelebration}
              autoPlay
              muted
              loop
              playsInline
              style={styles.foxVideo}
            />
          ) : (
            <img src={assets.chrono} alt="" style={styles.foxFallback} />
          )}
        </div>
      </section>

      <section style={styles.orangeCard}>
        <div style={styles.orangeMirror} />

        <h2 style={styles.orangeCardTitle}>
          Comment s’est passée l’activité ?
        </h2>

        <div style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isSelected = rating >= star;

            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{
                  ...styles.starButton,
                  ...(isSelected ? styles.starButtonSelected : {}),
                }}
                aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
              >
                ★
              </button>
            );
          })}
        </div>
      </section>

      <section style={styles.orangeCard}>
        <div style={styles.orangeMirror} />

        <h2 style={styles.orangeCardTitle}>Comment étaient vos enfants ?</h2>

        <div style={styles.moodGrid}>
          {MOOD_OPTIONS.map((option) => {
            const isSelected = childMood === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setChildMood(option.id)}
                style={{
                  ...styles.choiceChip,
                  ...(isSelected ? styles.choiceChipSelected : {}),
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div style={styles.replayBlock}>
          <h3 style={styles.smallQuestion}>Recommenceriez-vous ?</h3>

          <div style={styles.replayRow}>
            <button
              type="button"
              onClick={() => setWouldReplay("yes")}
              style={{
                ...styles.replayButton,
                ...(wouldReplay === "yes" ? styles.replayButtonSelected : {}),
              }}
            >
              Oui
            </button>

            <button
              type="button"
              onClick={() => setWouldReplay("not_really")}
              style={{
                ...styles.replayButton,
                ...(wouldReplay === "not_really"
                  ? styles.replayButtonSelected
                  : {}),
              }}
            >
              Pas vraiment
            </button>
          </div>
        </div>
      </section>

      <button type="button" onClick={handleSave} style={styles.saveButton}>
        Valider ce moment
      </button>
    </section>
  );
}

const styles = {
  screen: {
    minHeight: "calc(100dvh - 108px)",
    paddingBottom: 20,
  },

  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },

  backButton: {
    border: "none",
    background: "rgba(255,255,255,0.82)",
    color: theme.colors.ink,
    borderRadius: 999,
    padding: "10px 13px",
    fontFamily: theme.fonts.body,
    fontSize: 14,
    fontWeight: 900,
    boxShadow: "0 10px 24px rgba(23, 32, 51, 0.07)",
    cursor: "pointer",
  },

  stepPill: {
    padding: "10px 13px",
    borderRadius: 999,
    background: "rgba(255, 122, 47, 0.12)",
    color: "#FF7A2F",
    fontFamily: theme.fonts.body,
    fontSize: 13,
    fontWeight: 950,
  },

  celebrationCard: {
    position: "relative",
    minHeight: 230,
    borderRadius: 36,
    padding: 20,
    overflow: "hidden",
    background: "#FFFFFF",
    border: "1px solid rgba(23, 32, 51, 0.06)",
    boxShadow:
      "0 18px 44px rgba(23, 32, 51, 0.07), inset 0 1px 0 rgba(255,255,255,1)",
    color: theme.colors.ink,
    isolation: "isolate",
  },

  celebrationGlow: {
    position: "absolute",
    right: -90,
    top: -90,
    width: 240,
    height: 240,
    borderRadius: 999,
    background:
      "radial-gradient(circle, rgba(255, 200, 61, 0.12) 0%, rgba(255, 122, 47, 0.04) 45%, rgba(255,255,255,0) 72%)",
    pointerEvents: "none",
  },

  celebrationText: {
    position: "relative",
    zIndex: 3,
    maxWidth: 188,
  },

  eyebrow: {
    display: "inline-flex",
    padding: "7px 11px",
    borderRadius: 999,
    background: "rgba(255, 122, 47, 0.12)",
    color: "#FF7A2F",
    fontFamily: theme.fonts.body,
    fontSize: 13,
    fontWeight: 950,
  },

  bigResult: {
    margin: "14px 0 0",
    fontFamily: theme.fonts.title,
    fontSize: 52,
    lineHeight: 0.92,
    letterSpacing: -2,
    fontWeight: 950,
    color: theme.colors.ink,
  },

  resultText: {
    margin: "4px 0 0",
    fontFamily: theme.fonts.title,
    fontSize: 22,
    lineHeight: 1,
    fontWeight: 950,
    color: theme.colors.ink,
  },

  activityText: {
    margin: "14px 0 0",
    fontFamily: theme.fonts.body,
    fontSize: 14,
    lineHeight: 1.3,
    fontWeight: 850,
    color: theme.colors.muted,
  },

  timeText: {
    margin: "5px 0 0",
    fontFamily: theme.fonts.body,
    fontSize: 13,
    fontWeight: 850,
    color: theme.colors.muted,
  },

  foxWrap: {
    position: "absolute",
    right: -18,
    top: 0,
    bottom: 0,
    width: 218,
    zIndex: 2,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    background: "transparent",
    overflow: "hidden",
    borderRadius: 0,
    pointerEvents: "none",
  },

  foxVideo: {
    height: "100%",
    width: "100%",
    objectFit: "contain",
    objectPosition: "center center",
    display: "block",
    background: "transparent",
    mixBlendMode: "multiply",
  },

  foxFallback: {
    height: "100%",
    width: "100%",
    objectFit: "contain",
    objectPosition: "center center",
    display: "block",
    background: "transparent",
    filter: "drop-shadow(0 14px 20px rgba(23,32,51,0.12))",
  },

  orangeCard: {
    position: "relative",
    marginTop: 16,
    padding: 18,
    borderRadius: 30,
    overflow: "hidden",
    background:
      "radial-gradient(circle at 86% 12%, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0) 30%), linear-gradient(135deg, #FF7A2F 0%, #FFC83D 115%)",
    boxShadow:
      "0 22px 50px rgba(255, 122, 47, 0.22), inset 0 1px 0 rgba(255,255,255,0.32)",
    border: "1px solid rgba(255,255,255,0.34)",
  },

  orangeMirror: {
    position: "absolute",
    top: -70,
    left: -60,
    width: 160,
    height: 220,
    transform: "rotate(22deg)",
    background:
      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0) 100%)",
    pointerEvents: "none",
  },

  orangeCardTitle: {
    position: "relative",
    zIndex: 2,
    margin: 0,
    fontFamily: theme.fonts.title,
    color: "white",
    fontSize: 21,
    lineHeight: 1.1,
    fontWeight: 950,
    textShadow: "0 2px 10px rgba(23,32,51,0.12)",
  },

  starsRow: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 15,
  },

  starButton: {
    flex: 1,
    height: 54,
    border: "1px solid rgba(255,255,255,0.32)",
    borderRadius: 20,
    background: "rgba(255,255,255,0.18)",
    color: "rgba(255,255,255,0.58)",
    fontSize: 28,
    lineHeight: 1,
    cursor: "pointer",
    backdropFilter: "blur(12px)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
    transition:
      "transform 160ms ease, background 160ms ease, color 160ms ease, box-shadow 160ms ease",
  },

  starButtonSelected: {
    background: "rgba(255,255,255,0.92)",
    color: "#FFC83D",
    transform: "translateY(-1px)",
    boxShadow: "0 12px 24px rgba(23,32,51,0.12)",
  },

  moodGrid: {
    position: "relative",
    zIndex: 2,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 14,
  },

  choiceChip: {
    minHeight: 48,
    border: "1px solid rgba(255,255,255,0.28)",
    borderRadius: 19,
    background: "rgba(255,255,255,0.18)",
    color: "white",
    fontFamily: theme.fonts.body,
    fontSize: 14,
    fontWeight: 950,
    cursor: "pointer",
    backdropFilter: "blur(12px)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)",
    transition:
      "transform 160ms ease, background 160ms ease, color 160ms ease, box-shadow 160ms ease",
  },

  choiceChipSelected: {
    background: "rgba(255,255,255,0.92)",
    color: "#FF7A2F",
    boxShadow: "0 12px 24px rgba(23,32,51,0.12)",
    transform: "translateY(-1px)",
  },

  replayBlock: {
    position: "relative",
    zIndex: 2,
    marginTop: 18,
    paddingTop: 16,
    borderTop: "1px solid rgba(255,255,255,0.24)",
  },

  smallQuestion: {
    margin: 0,
    fontFamily: theme.fonts.title,
    color: "white",
    fontSize: 18,
    lineHeight: 1.1,
    fontWeight: 950,
    textShadow: "0 2px 10px rgba(23,32,51,0.12)",
  },

  replayRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 12,
  },

  replayButton: {
    minHeight: 50,
    border: "1px solid rgba(255,255,255,0.28)",
    borderRadius: 20,
    background: "rgba(255,255,255,0.18)",
    color: "white",
    fontFamily: theme.fonts.title,
    fontSize: 15,
    fontWeight: 950,
    cursor: "pointer",
    backdropFilter: "blur(12px)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)",
    transition:
      "transform 160ms ease, background 160ms ease, color 160ms ease, box-shadow 160ms ease",
  },

  replayButtonSelected: {
    background: "rgba(255,255,255,0.92)",
    color: "#FF7A2F",
    boxShadow: "0 12px 24px rgba(23,32,51,0.12)",
    transform: "translateY(-1px)",
  },

  saveButton: {
    width: "100%",
    minHeight: 58,
    marginTop: 16,
    border: "none",
    borderRadius: 24,
    background: "linear-gradient(135deg, #FF7A2F 0%, #FFC83D 100%)",
    color: "white",
    fontFamily: theme.fonts.title,
    fontSize: 17,
    fontWeight: 950,
    boxShadow: "0 16px 34px rgba(255, 122, 47, 0.26)",
    cursor: "pointer",
  },
};