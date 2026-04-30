import React, { useEffect, useRef, useState } from "react";
import { theme } from "../../styles/theme.js";

export default function HomeCureProgress({ cure }) {
  const cardRef = useRef(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.35,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEnteredView) return;

    setAnimatedProgress(0);

    const timeout = setTimeout(() => {
      setAnimatedProgress(cure.progressPercent || 0);
    }, 260);

    return () => clearTimeout(timeout);
  }, [hasEnteredView, cure.progressPercent]);

  const progress = Math.max(0, Math.min(100, animatedProgress));
  const daysDone = Math.max(0, cure.currentDay - 1);

  return (
    <section
      ref={cardRef}
      style={styles.card}
      className={`home-cure-card ${hasEnteredView ? "home-cure-card-visible" : ""}`}
    >
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />

      <div style={styles.header}>
        <div>
          <div style={styles.kicker}>Votre progression du moment</div>

          <h2 style={styles.title}>
            Cure <span style={styles.titleAccent}>{cure.name}</span>
          </h2>
        </div>

        <div style={styles.dayBadge}>
          <span style={styles.daySmall}>Jour</span>
          <span style={styles.dayMain}>
            {cure.currentDay}
            <span style={styles.dayTotal}>/{cure.totalDays}</span>
          </span>
        </div>
      </div>

      <div style={styles.progressBlock}>
        <div style={styles.progressTop}>
          <span style={styles.progressLabel}>Avancée de la cure</span>
          <span style={styles.progressPercent}>{Math.round(progress)}%</span>
        </div>

        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progress}%`,
            }}
          >
            {hasEnteredView && <div style={styles.progressShine} />}
          </div>
        </div>

        <div style={styles.timeline}>
          {Array.from({ length: 5 }).map((_, index) => {
            const stepProgress = (index + 1) * 20;
            const isActive = progress >= stepProgress;
            const isCurrent =
              progress >= index * 20 && progress < (index + 1) * 20;

            return (
              <div key={index} style={styles.timelineItem}>
                <div
                  style={{
                    ...styles.timelineDot,
                    ...(isActive ? styles.timelineDotActive : {}),
                    ...(isCurrent ? styles.timelineDotCurrent : {}),
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.infoGrid}>
        <InfoPill
          emoji="⏳"
          label="Restant"
          value={`${cure.daysLeft} jours`}
          color={theme.colors.orangeDeep}
          bg={theme.colors.orangeSoft}
        />
        <InfoPill
          emoji="🔥"
          label="Streak"
          value={`${cure.streak} jours`}
          color={theme.colors.coralDeep}
          bg={theme.colors.coralSoft}
        />
      </div>

      <div style={styles.rewardCard}>
        <div style={styles.rewardIcon}>🎁</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={styles.rewardLabel}>Prochaine récompense</div>
          <div style={styles.rewardText}>{cure.reward}</div>
        </div>
        <div style={styles.rewardChevron}>→</div>
      </div>

      <div style={styles.goalCard}>
        <div style={styles.goalTop}>
          <span style={styles.goalEmoji}>🎯</span>
          <span style={styles.goalLabel}>Objectif du jour</span>
        </div>

        <p style={styles.goalText}>{cure.todayGoal}</p>

        <div style={styles.goalFooter}>
          <span>{daysDone} jours déjà engagés</span>
          <span style={styles.goalChip}>Courage doux</span>
        </div>
      </div>
    </section>
  );
}

function InfoPill({ emoji, label, value, color, bg }) {
  return (
    <div style={{ ...styles.infoPill, background: bg }}>
      <div style={styles.infoEmoji}>{emoji}</div>
      <div>
        <div style={styles.infoLabel}>{label}</div>
        <div style={{ ...styles.infoValue, color }}>{value}</div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    position: "relative",
    borderRadius: 36,
    padding: 18,
    marginBottom: 18,
    overflow: "hidden",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,247,236,0.88) 100%)",
    border: "1px solid rgba(255,255,255,0.72)",
    boxShadow:
      "0 24px 58px rgba(23, 32, 51, 0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
  },

  glowOne: {
    position: "absolute",
    top: -70,
    right: -70,
    width: 180,
    height: 180,
    borderRadius: "50%",
    background: "rgba(255, 79, 120, 0.13)",
    pointerEvents: "none",
  },

  glowTwo: {
    position: "absolute",
    bottom: -90,
    left: -90,
    width: 200,
    height: 200,
    borderRadius: "50%",
    background: "rgba(255, 122, 47, 0.12)",
    pointerEvents: "none",
  },

  header: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 18,
  },

  kicker: {
    display: "inline-flex",
    alignItems: "center",
    padding: "7px 10px",
    borderRadius: 999,
    background: theme.colors.coralSoft,
    color: theme.colors.coralDeep,
    fontSize: 11,
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },

  title: {
    margin: 0,
    fontFamily: theme.fonts.title,
    fontSize: 24,
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: -0.8,
    color: theme.colors.ink,
  },

  titleAccent: {
    color: theme.colors.coralDeep,
  },

  dayBadge: {
    width: 78,
    minWidth: 78,
    height: 72,
    borderRadius: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: theme.gradients.cure,
    color: theme.colors.white,
    boxShadow: theme.shadow.coral,
    border: "1px solid rgba(255,255,255,0.38)",
  },

  daySmall: {
    fontSize: 10,
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    opacity: 0.9,
  },

  dayMain: {
    marginTop: 2,
    fontFamily: theme.fonts.title,
    fontSize: 24,
    lineHeight: 1,
    fontWeight: 900,
  },

  dayTotal: {
    fontSize: 14,
    opacity: 0.86,
    marginLeft: 1,
  },

  progressBlock: {
    position: "relative",
    zIndex: 1,
    borderRadius: 26,
    padding: 14,
    background: "rgba(255,255,255,0.68)",
    border: "1px solid rgba(23,32,51,0.06)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
    marginBottom: 12,
  },

  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  progressLabel: {
    color: theme.colors.muted,
    fontWeight: 950,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.55,
  },

  progressPercent: {
    fontFamily: theme.fonts.title,
    color: theme.colors.coralDeep,
    fontWeight: 900,
    fontSize: 17,
  },

  progressTrack: {
    height: 15,
    borderRadius: 999,
    background: "rgba(23,32,51,0.08)",
    overflow: "hidden",
    boxShadow: "inset 0 2px 6px rgba(23,32,51,0.08)",
  },

  progressFill: {
    position: "relative",
    height: "100%",
    borderRadius: 999,
    background: theme.gradients.cure,
    transition: "width 1900ms cubic-bezier(0.16, 1, 0.3, 1)",
    boxShadow: "0 8px 16px rgba(255,79,120,0.24)",
    overflow: "hidden",
  },

  progressShine: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.42) 45%, rgba(255,255,255,0) 80%)",
    transform: "translateX(-45%)",
    animation: "progressShimmer 1900ms ease-in-out 580ms both",
  },

  timeline: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 6,
    marginTop: 10,
  },

  timelineItem: {
    display: "flex",
    justifyContent: "center",
  },

  timelineDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    background: "rgba(23,32,51,0.13)",
    transition: "all 900ms cubic-bezier(0.16, 1, 0.3, 1)",
  },

  timelineDotActive: {
    background: theme.colors.coral,
    boxShadow: "0 0 0 5px rgba(255,79,120,0.12)",
  },

  timelineDotCurrent: {
    transform: "scale(1.25)",
    background: theme.colors.orange,
    boxShadow: "0 0 0 6px rgba(255,122,47,0.15)",
  },

  infoGrid: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 10,
  },

  infoPill: {
    borderRadius: 22,
    padding: 13,
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "1px solid rgba(255,255,255,0.65)",
  },

  infoEmoji: {
    width: 36,
    height: 36,
    borderRadius: 15,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.62)",
    fontSize: 20,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)",
  },

  infoLabel: {
    color: theme.colors.muted,
    fontWeight: 950,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.45,
    lineHeight: 1,
  },

  infoValue: {
    marginTop: 4,
    fontFamily: theme.fonts.title,
    fontWeight: 900,
    fontSize: 16,
    lineHeight: 1,
  },

  rewardCard: {
    position: "relative",
    zIndex: 1,
    borderRadius: 24,
    padding: 14,
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: theme.gradients.cardYellow,
    border: "1px solid rgba(255,255,255,0.72)",
    boxShadow: "0 12px 28px rgba(255,200,61,0.18)",
    marginBottom: 10,
  },

  rewardIcon: {
    width: 42,
    height: 42,
    borderRadius: 17,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.58)",
    fontSize: 22,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)",
  },

  rewardLabel: {
    color: theme.colors.muted,
    fontWeight: 950,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.45,
  },

  rewardText: {
    marginTop: 3,
    fontFamily: theme.fonts.title,
    color: theme.colors.ink,
    fontWeight: 900,
    fontSize: 16,
    lineHeight: 1.12,
  },

  rewardChevron: {
    width: 32,
    height: 32,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.52)",
    color: theme.colors.yellowDeep,
    fontWeight: 950,
    fontSize: 18,
  },

  goalCard: {
    position: "relative",
    zIndex: 1,
    borderRadius: 24,
    padding: 15,
    background:
      "linear-gradient(135deg, rgba(255,122,47,0.11) 0%, rgba(255,79,120,0.10) 100%)",
    border: "1px solid rgba(255,122,47,0.12)",
  },

  goalTop: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  goalEmoji: {
    fontSize: 20,
  },

  goalLabel: {
    color: theme.colors.orangeDeep,
    fontWeight: 950,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.55,
  },

  goalText: {
    margin: 0,
    color: theme.colors.ink,
    fontFamily: theme.fonts.title,
    fontWeight: 850,
    fontSize: 17,
    lineHeight: 1.25,
    letterSpacing: -0.25,
  },

  goalFooter: {
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: 900,
  },

  goalChip: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.66)",
    color: theme.colors.orangeDeep,
    whiteSpace: "nowrap",
  },
};