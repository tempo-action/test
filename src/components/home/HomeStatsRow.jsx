import React from "react";
import { statThemes, theme } from "../../styles/theme.js";

export default function HomeStatsRow({
  minutesNoScreen = 42,
  sessionsDone = 3,
  badgesCount = 6,
}) {
  const stats = [
    {
      id: "screenFree",
      ...statThemes.screenFree,
      value: `${minutesNoScreen}`,
      unit: "min",
      title: "Sans écran",
      subtitle: "Temps gagné",
      small: "+12 min",
      footer: "vs hier",
    },
    {
      id: "sessions",
      ...statThemes.sessions,
      value: sessionsDone,
      unit: "",
      title: "Séances",
      subtitle: "Terminées",
      small: "3/5",
      footer: "objectif",
    },
    {
      id: "badges",
      ...statThemes.badges,
      value: badgesCount,
      unit: "",
      title: "Badges",
      subtitle: "Débloqués",
      small: "🏆",
      footer: "bravo",
    },
  ];

  return (
    <section style={styles.wrapper}>
      {stats.map((stat, index) => (
        <StatCard key={stat.id} stat={stat} index={index} />
      ))}
    </section>
  );
}

function StatCard({ stat, index }) {
  return (
    <article
      className="home-stat-card premium-pressable"
      style={{
        ...styles.card,
        background: stat.gradient,
        boxShadow: stat.shadow,
        animationDelay: `${index * 90}ms`,
      }}
    >
      <div style={styles.shine} />

      <div style={styles.content}>
        <div style={styles.topRow}>
          <div style={styles.emojiBubble}>{stat.emoji}</div>

          <div
            style={{
              ...styles.miniBadge,
              color: stat.accent,
            }}
          >
            {stat.small}
          </div>
        </div>

        <div style={styles.middle}>
          <div style={styles.valueRow}>
            <span
              style={{
                ...styles.value,
                color: stat.accent,
              }}
            >
              {stat.value}
            </span>

            {stat.unit && (
              <span
                style={{
                  ...styles.unit,
                  color: stat.accent,
                }}
              >
                {stat.unit}
              </span>
            )}
          </div>

          <div style={styles.title}>{stat.title}</div>
          <div style={styles.subtitle}>{stat.subtitle}</div>
        </div>

        <div style={styles.footer}>
          <span
            style={{
              ...styles.footerDot,
              background: stat.accent,
            }}
          />
          <span>{stat.footer}</span>
        </div>
      </div>
    </article>
  );
}

const styles = {
  wrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    marginBottom: 18,
  },

  card: {
    position: "relative",
    minHeight: 166,
    borderRadius: 28,
    padding: 12,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.7)",
    animation: "statCardEnter 520ms cubic-bezier(.2, 1.1, .25, 1) both",
  },

  content: {
    position: "relative",
    zIndex: 1,
    height: "100%",
    minHeight: 142,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  shine: {
    position: "absolute",
    top: -34,
    right: -38,
    width: 88,
    height: 88,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.35)",
    pointerEvents: "none",
  },

  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },

  emojiBubble: {
    width: 38,
    height: 38,
    borderRadius: 16,
    display: "grid",
    placeItems: "center",
    fontSize: 22,
    background: "rgba(255,255,255,0.58)",
    boxShadow:
      "0 8px 18px rgba(23, 32, 51, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
  },

  miniBadge: {
    minWidth: 38,
    height: 28,
    padding: "0 8px",
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    fontSize: 11,
    fontWeight: 950,
    background: "rgba(255,255,255,0.68)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
    whiteSpace: "nowrap",
  },

  middle: {
    paddingTop: 12,
    paddingBottom: 10,
  },

  valueRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: 3,
    minHeight: 34,
  },

  value: {
    fontFamily: theme.fonts.title,
    fontSize: 31,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: -1.2,
  },

  unit: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    lineHeight: 1.05,
    fontWeight: 950,
    marginBottom: 2,
  },

  title: {
    marginTop: 8,
    color: theme.colors.ink,
    fontFamily: theme.fonts.title,
    fontSize: 13,
    fontWeight: 900,
    lineHeight: 1.05,
    letterSpacing: -0.2,
  },

  subtitle: {
    marginTop: 4,
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: 850,
    lineHeight: 1.1,
  },

  footer: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    minHeight: 18,
    color: theme.colors.muted,
    fontSize: 10,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 0.25,
  },

  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    boxShadow: "0 0 0 4px rgba(255,255,255,0.42)",
    flexShrink: 0,
  },
};