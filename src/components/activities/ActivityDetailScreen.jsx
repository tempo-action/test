import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets.js";
import { theme } from "../../styles/theme.js";

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  if (!value) return [];

  return String(value)
    .split(/\n|•|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getMainInstruction(activity) {
  const steps = normalizeList(
    activity.steps ||
      activity.etapes ||
      activity.instructions ||
      activity.consignes ||
      activity.deroulement
  );

  if (steps.length > 0) {
    return steps.slice(0, 4).join(" ");
  }

  return (
    activity.desc ||
    "Installe l’activité, explique la consigne simplement, puis accompagne ton enfant."
  );
}

function getMaterialItems(activity) {
  return normalizeList(activity.materiel || activity.materials || activity.matos);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function formatDurationLabel(value) {
  return String(value || "").replace(/(\d+)\s*min/i, "$1 min");
}

export default function ActivityDetailScreen({
  activity,
  category,
  onBack,
  onStartActivity,
  onFinishActivity,
}) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerStatus, setTimerStatus] = useState("ready");
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);

  useEffect(() => {
    setElapsedSeconds(0);
    setTimerStatus("ready");
    setIsInstructionOpen(false);
  }, [activity?.id]);

  useEffect(() => {
    if (timerStatus !== "running") return undefined;

    const interval = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerStatus]);

  if (!activity) return null;

  const instruction = getMainInstruction(activity);
  const materials = getMaterialItems(activity);
  const durationLabel = activity.timeLabel || `${activity.t} min`;

  const isReady = timerStatus === "ready";
  const isRunning = timerStatus === "running";
  const isPaused = timerStatus === "paused";

  function toggleTimer() {
    if (isReady) {
      setTimerStatus("running");
      onStartActivity?.(activity);
      return;
    }

    if (isRunning) {
      setTimerStatus("paused");
      return;
    }

    if (isPaused) {
      setTimerStatus("running");
    }
  }

  function handleFinish() {
    setTimerStatus("paused");

    if (onFinishActivity) {
      onFinishActivity(activity, {
        elapsedSeconds,
        completed: true,
      });

      return;
    }

    onBack?.();
  }

  return (
    <section className="activity-screen-enter" style={styles.screen}>
      <section
        style={{
          ...styles.calmLayer,
          opacity: isRunning ? 0 : 1,
          transform: isRunning ? "scale(0.965)" : "scale(1)",
          filter: isRunning ? "blur(28px)" : "blur(0)",
          pointerEvents: isRunning ? "none" : "auto",
        }}
      >
        <section style={styles.topBar}>
          <button type="button" onClick={onBack} style={styles.backButton}>
            ← Retour
          </button>

          <div style={styles.stepPill}>Chronomètre</div>
        </section>

        <section style={styles.header}>
          <div style={styles.reminderRow}>
            <span
              style={{
                ...styles.categoryPill,
                color: category.color,
                background: category.bg,
              }}
            >
              {category.shortLabel}
            </span>

            <span style={styles.timePill}>
              Repère : {formatDurationLabel(durationLabel)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsInstructionOpen(true)}
            style={styles.titleButton}
          >
            <span style={styles.title}>{activity.nm}</span>
            <span style={styles.titleHint}>Consigne</span>
          </button>
        </section>

        <section style={styles.timerZone}>
          <div style={styles.timerAuraWrap}>
            <div className="activity-chrono-glow" style={styles.timerGlow} />

            <div
              className="activity-chrono-wave activity-chrono-wave-delay"
              style={styles.waveRing}
            />

            <div className="activity-chrono-wave" style={styles.waveRingSoft} />

            <div
              className="activity-chrono-aura-slow"
              style={styles.timerAuraOuter}
            />

            <div
              className="activity-chrono-aura-reverse"
              style={styles.timerAuraInner}
            />

            <div className="activity-chrono-orbit" style={styles.orbitTrack}>
              <span style={{ ...styles.orbitDot, ...styles.orbitDot1 }} />
              <span style={{ ...styles.orbitDot, ...styles.orbitDot2 }} />
              <span style={{ ...styles.orbitDot, ...styles.orbitDot3 }} />
            </div>

            <div
              className={`activity-chrono-core ${
                isRunning ? "activity-chrono-core-running" : ""
              }`}
              style={styles.timerRing}
            >
              <div style={styles.timerInner}>
                <div style={styles.timerValue}>
                  {formatTime(elapsedSeconds)}
                </div>

                <div style={styles.timerText}>
                  {isPaused ? "pause" : "prêt"}
                </div>
              </div>
            </div>
          </div>

          <div style={styles.calmControls}>
            <button
              type="button"
              onClick={toggleTimer}
              className="activity-play-icon-button"
              style={styles.playButton}
              aria-label={isPaused ? "Reprendre" : "Lancer"}
              title={isPaused ? "Reprendre" : "Lancer"}
            >
              <span style={styles.playIcon}>▶</span>
            </button>

            <button
              type="button"
              onClick={handleFinish}
              style={styles.finishButton}
            >
              J’ai terminé
            </button>
          </div>
        </section>

        <img src={assets.chrono} alt="" style={styles.foxImage} />
      </section>

      <section
        style={{
          ...styles.videoLayer,
          opacity: isRunning ? 1 : 0,
          transform: isRunning ? "scale(1)" : "scale(1.045)",
          filter: isRunning ? "blur(0)" : "blur(34px)",
          pointerEvents: isRunning ? "auto" : "none",
        }}
      >
        <video
          src={assets.activityLoop}
          autoPlay
          muted
          loop
          playsInline
          style={styles.video}
        />

        <div style={styles.videoShade} />

        <div style={styles.videoTop}>
          <button
            type="button"
            onClick={() => setIsInstructionOpen(true)}
            style={styles.videoInfoButton}
          >
            Consigne
          </button>
        </div>

        <div style={styles.videoBottom}>
          <button
            type="button"
            onClick={handleFinish}
            style={styles.videoFinishButton}
          >
            J’ai terminé
          </button>

          <div style={styles.miniChrono}>{formatTime(elapsedSeconds)}</div>

          <button
            type="button"
            onClick={toggleTimer}
            style={styles.pauseButton}
            aria-label="Pause"
            title="Pause"
          >
            <span style={styles.pauseIcon}>Ⅱ</span>
          </button>
        </div>
      </section>

      {isInstructionOpen && (
        <div style={styles.sheetOverlay}>
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setIsInstructionOpen(false)}
            style={styles.sheetBackdrop}
          />

          <section className="activity-accordion-panel" style={styles.sheet}>
            <div style={styles.sheetHandle} />

            <div style={styles.sheetHeader}>
              <div>
                <div style={styles.sheetEyebrow}>Consigne</div>
                <h2 style={styles.sheetTitle}>{activity.nm}</h2>
              </div>

              <button
                type="button"
                onClick={() => setIsInstructionOpen(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>

            <div style={styles.sheetContent}>
              <div style={styles.sheetBlock}>
                <h3 style={styles.sheetBlockTitle}>À faire</h3>
                <p style={styles.sheetText}>{instruction}</p>
              </div>

              {activity.objectif && (
                <div style={styles.sheetBlock}>
                  <h3 style={styles.sheetBlockTitle}>Objectif</h3>
                  <p style={styles.sheetText}>{activity.objectif}</p>
                </div>
              )}

              <div style={styles.sheetBlock}>
                <h3 style={styles.sheetBlockTitle}>Matériel</h3>

                {materials.length > 0 ? (
                  <div style={styles.materialRow}>
                    {materials.map((item, index) => (
                      <span key={`${item}-${index}`} style={styles.materialPill}>
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={styles.sheetText}>Aucun matériel spécifique.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

const styles = {
  screen: {
    position: "relative",
    height: "calc(100dvh - 108px)",
    minHeight: 620,
    overflow: "hidden",
  },

  calmLayer: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    paddingBottom: 10,
    transition:
      "opacity 2600ms cubic-bezier(0.16, 1, 0.3, 1), transform 2600ms cubic-bezier(0.16, 1, 0.3, 1), filter 2600ms cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "opacity, transform, filter",
  },

  videoLayer: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    borderRadius: 34,
    background: "#172033",
    transition:
      "opacity 3000ms cubic-bezier(0.16, 1, 0.3, 1), transform 3000ms cubic-bezier(0.16, 1, 0.3, 1), filter 3000ms cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "opacity, transform, filter",
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  videoShade: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(23,32,51,0.18) 0%, rgba(23,32,51,0.08) 45%, rgba(23,32,51,0.58) 100%)",
    pointerEvents: "none",
  },

  videoTop: {
    position: "absolute",
    top: 14,
    left: 14,
    right: 14,
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 2,
  },

  videoInfoButton: {
    border: "none",
    borderRadius: 999,
    padding: "10px 13px",
    background: "rgba(255,255,255,0.72)",
    color: theme.colors.ink,
    backdropFilter: "blur(14px)",
    fontFamily: theme.fonts.body,
    fontSize: 13,
    fontWeight: 950,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(23, 32, 51, 0.08)",
  },

  videoBottom: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    zIndex: 2,
  },

  videoFinishButton: {
    border: "none",
    minHeight: 44,
    padding: "0 13px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.22)",
    color: "white",
    fontFamily: theme.fonts.body,
    fontSize: 13,
    fontWeight: 950,
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.14)",
    cursor: "pointer",
  },

  miniChrono: {
    minWidth: 94,
    height: 48,
    display: "grid",
    placeItems: "center",
    borderRadius: 999,
    background: "rgba(255,255,255,0.78)",
    color: theme.colors.ink,
    backdropFilter: "blur(14px)",
    fontFamily: theme.fonts.title,
    fontSize: 20,
    fontWeight: 950,
    boxShadow: "0 12px 26px rgba(23,32,51,0.12)",
  },

  pauseButton: {
    width: 48,
    height: 48,
    border: "none",
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #FF7A2F 0%, #FFC83D 100%)",
    color: "white",
    boxShadow: "0 12px 26px rgba(255,122,47,0.28)",
    cursor: "pointer",
  },

  pauseIcon: {
    fontFamily: theme.fonts.title,
    fontSize: 16,
    fontWeight: 950,
    lineHeight: 1,
  },

  topBar: {
    flex: "0 0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
    position: "relative",
    zIndex: 5,
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

  header: {
    flex: "0 0 auto",
    textAlign: "center",
    padding: "4px 12px 0",
    position: "relative",
    zIndex: 4,
  },

  reminderRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },

  categoryPill: {
    display: "inline-flex",
    padding: "7px 11px",
    borderRadius: 999,
    fontFamily: theme.fonts.body,
    fontSize: 12,
    fontWeight: 950,
  },

  timePill: {
    display: "inline-flex",
    padding: "7px 11px",
    borderRadius: 999,
    background: "rgba(255, 122, 47, 0.12)",
    color: "#FF7A2F",
    fontFamily: theme.fonts.body,
    fontSize: 12,
    fontWeight: 950,
  },

  titleButton: {
    border: "none",
    background: "transparent",
    padding: 0,
    cursor: "pointer",
    display: "grid",
    justifyItems: "center",
    gap: 6,
    width: "100%",
  },

  title: {
    fontFamily: theme.fonts.title,
    fontSize: 27,
    lineHeight: 1.04,
    letterSpacing: -0.7,
    color: theme.colors.ink,
    fontWeight: 950,
  },

  titleHint: {
    display: "inline-flex",
    padding: "6px 11px",
    borderRadius: 999,
    background: "rgba(23, 32, 51, 0.06)",
    color: theme.colors.muted,
    fontFamily: theme.fonts.body,
    fontSize: 12,
    fontWeight: 900,
  },

  timerZone: {
    flex: "1 1 auto",
    minHeight: 310,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 86,
    position: "relative",
    zIndex: 3,
  },

  timerAuraWrap: {
    position: "relative",
    width: 276,
    height: 276,
    display: "grid",
    placeItems: "center",
  },

  timerGlow: {
    position: "absolute",
    width: 248,
    height: 248,
    borderRadius: 999,
    background:
      "radial-gradient(circle, rgba(255, 190, 70, 0.28) 0%, rgba(255, 122, 47, 0.12) 42%, rgba(255, 122, 47, 0.02) 72%, transparent 100%)",
    filter: "blur(8px)",
  },

  waveRing: {
    position: "absolute",
    width: 246,
    height: 246,
    borderRadius: 999,
    border: "1.5px solid rgba(255, 122, 47, 0.18)",
  },

  waveRingSoft: {
    position: "absolute",
    width: 224,
    height: 224,
    borderRadius: 999,
    border: "1px solid rgba(255, 200, 61, 0.22)",
  },

  timerAuraOuter: {
    position: "absolute",
    inset: 12,
    borderRadius: 999,
    background:
      "conic-gradient(from 0deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.24) 50deg, rgba(255,200,61,0.22) 120deg, rgba(255,122,47,0.18) 190deg, rgba(255,255,255,0) 280deg, rgba(255,255,255,0.18) 360deg)",
    filter: "blur(6px)",
  },

  timerAuraInner: {
    position: "absolute",
    inset: 32,
    borderRadius: 999,
    background:
      "conic-gradient(from 0deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.16) 90deg, rgba(255,122,47,0.2) 170deg, rgba(255,200,61,0.16) 260deg, rgba(255,255,255,0) 360deg)",
    filter: "blur(4px)",
  },

  orbitTrack: {
    position: "absolute",
    inset: 22,
    borderRadius: 999,
    border: "1px dashed rgba(255,255,255,0.18)",
    pointerEvents: "none",
  },

  orbitDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 999,
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 0 14px rgba(255,255,255,0.75)",
  },

  orbitDot1: {
    top: -5,
    left: "50%",
    transform: "translateX(-50%)",
  },

  orbitDot2: {
    right: 24,
    bottom: 18,
  },

  orbitDot3: {
    left: 18,
    bottom: 30,
  },

  timerRing: {
    position: "relative",
    width: 224,
    height: 224,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    background:
      "radial-gradient(circle at 32% 24%, rgba(255,255,255,0.96) 0%, rgba(255,210,82,0.7) 22%, rgba(255,122,47,0.98) 64%, rgba(255,100,34,0.84) 100%)",
    boxShadow:
      "0 24px 48px rgba(255, 122, 47, 0.22), inset 0 0 0 1px rgba(255,255,255,0.62)",
    zIndex: 3,
  },

  timerInner: {
    width: 170,
    height: 170,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    alignContent: "center",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,247,236,0.95) 100%)",
    boxShadow:
      "inset 0 0 0 1px rgba(23,32,51,0.06), 0 12px 28px rgba(23,32,51,0.08)",
  },

  timerValue: {
    fontFamily: theme.fonts.title,
    color: theme.colors.ink,
    fontSize: 44,
    lineHeight: 1,
    fontWeight: 950,
    letterSpacing: -1.3,
  },

  timerText: {
    marginTop: 7,
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  calmControls: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    position: "relative",
    zIndex: 5,
  },

  playButton: {
    width: 54,
    height: 54,
    border: "none",
    borderRadius: 999,
    background: "linear-gradient(135deg, #FF7A2F 0%, #FFC83D 100%)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    boxShadow:
      "0 14px 28px rgba(255, 122, 47, 0.24), inset 0 1px 0 rgba(255,255,255,0.3)",
    position: "relative",
    zIndex: 5,
  },

  playIcon: {
    color: "white",
    fontFamily: theme.fonts.title,
    fontSize: 16,
    fontWeight: 950,
    lineHeight: 1,
  },

  finishButton: {
    border: "none",
    minHeight: 40,
    padding: "0 16px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.82)",
    color: theme.colors.ink,
    fontFamily: theme.fonts.body,
    fontSize: 13,
    fontWeight: 950,
    boxShadow: "0 10px 24px rgba(23, 32, 51, 0.08)",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
  },

  foxImage: {
    position: "absolute",
    left: -16,
    bottom: -10,
    width: 188,
    maxHeight: 220,
    objectFit: "contain",
    zIndex: 1,
    pointerEvents: "none",
    filter: "drop-shadow(0 20px 30px rgba(23,32,51,0.18))",
  },

  sheetOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 20,
    pointerEvents: "auto",
  },

  sheetBackdrop: {
    position: "absolute",
    inset: 0,
    border: "none",
    background:
      "linear-gradient(180deg, rgba(23,32,51,0.04) 0%, rgba(23,32,51,0.18) 100%)",
    cursor: "pointer",
  },

  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "62%",
    overflow: "hidden",
    borderRadius: "34px 34px 0 0",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,247,236,0.96) 100%)",
    border: `1px solid ${theme.colors.border}`,
    boxShadow: "0 -18px 44px rgba(23, 32, 51, 0.18)",
    padding: "10px 18px 18px",
  },

  sheetHandle: {
    width: 46,
    height: 5,
    borderRadius: 999,
    background: "rgba(23, 32, 51, 0.14)",
    margin: "0 auto 12px",
  },

  sheetHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },

  sheetEyebrow: {
    display: "inline-flex",
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255, 122, 47, 0.12)",
    color: "#FF7A2F",
    fontFamily: theme.fonts.body,
    fontSize: 12,
    fontWeight: 950,
    marginBottom: 8,
  },

  sheetTitle: {
    margin: 0,
    fontFamily: theme.fonts.title,
    fontSize: 22,
    lineHeight: 1.08,
    color: theme.colors.ink,
    fontWeight: 950,
  },

  closeButton: {
    width: 38,
    height: 38,
    border: "none",
    borderRadius: 999,
    background: "rgba(23, 32, 51, 0.06)",
    color: theme.colors.ink,
    fontFamily: theme.fonts.title,
    fontSize: 24,
    fontWeight: 950,
    cursor: "pointer",
  },

  sheetContent: {
    maxHeight: "calc(62dvh - 120px)",
    overflowY: "auto",
    paddingRight: 2,
  },

  sheetBlock: {
    padding: "12px 0",
    borderTop: "1px solid rgba(23,32,51,0.07)",
  },

  sheetBlockTitle: {
    margin: 0,
    fontFamily: theme.fonts.title,
    fontSize: 16,
    color: theme.colors.ink,
    fontWeight: 950,
  },

  sheetText: {
    margin: "7px 0 0",
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 1.42,
    fontWeight: 800,
  },

  materialRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 9,
  },

  materialPill: {
    display: "inline-flex",
    padding: "8px 10px",
    borderRadius: 999,
    background: "rgba(23, 32, 51, 0.06)",
    color: theme.colors.ink,
    fontFamily: theme.fonts.body,
    fontSize: 12,
    fontWeight: 900,
  },
};