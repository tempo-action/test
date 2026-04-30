import React from "react";
import { theme } from "../../styles/theme.js";

export default function HomePrimaryAction({ onClick }) {
  return (
    <section style={styles.wrapper}>
      <button
        type="button"
        onClick={onClick}
        className="home-primary-action premium-pressable"
        style={styles.button}
      >
        <div style={styles.glowTop} />
        <div style={styles.glowBottom} />

        <div style={styles.left}>
          <div style={styles.iconOrbit}>
            <div style={styles.iconBubble}>⚡</div>
          </div>

          <div style={styles.texts}>
            <div style={styles.kicker}>Action rapide</div>
            <div style={styles.title}>Lancer une activité</div>
            <div style={styles.subtitle}>
              Une idée simple pour remplacer un écran maintenant.
            </div>
          </div>
        </div>

        <div style={styles.right}>
          <div style={styles.timeBadge}>5–30 min</div>
          <div style={styles.arrow}>→</div>
        </div>
      </button>
    </section>
  );
}

const styles = {
  wrapper: {
    marginBottom: 18,
  },

  button: {
    position: "relative",
    width: "100%",
    minHeight: 118,
    border: "none",
    borderRadius: 34,
    padding: 18,
    overflow: "hidden",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    textAlign: "left",
    background:
      "radial-gradient(circle at 20% 0%, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0) 34%), linear-gradient(135deg, #FF7A2F 0%, #FF4F78 54%, #8B5CFF 125%)",
    color: "#FFFFFF",
    boxShadow:
      "0 24px 58px rgba(255, 122, 47, 0.28), 0 10px 24px rgba(255, 79, 120, 0.16), inset 0 1px 0 rgba(255,255,255,0.34)",
  },

  glowTop: {
    position: "absolute",
    top: -76,
    right: -66,
    width: 190,
    height: 190,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.20)",
    pointerEvents: "none",
  },

  glowBottom: {
    position: "absolute",
    bottom: -86,
    left: -76,
    width: 180,
    height: 180,
    borderRadius: "50%",
    background: "rgba(255,200,61,0.22)",
    pointerEvents: "none",
  },

  left: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    gap: 14,
    minWidth: 0,
    flex: 1,
  },

  iconOrbit: {
    width: 62,
    height: 62,
    borderRadius: 24,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.16)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.32), 0 10px 26px rgba(23,32,51,0.12)",
    flexShrink: 0,
  },

  iconBubble: {
    width: 46,
    height: 46,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.92)",
    color: theme.colors.orangeDeep,
    fontSize: 25,
    boxShadow: "0 10px 22px rgba(23,32,51,0.16)",
  },

  texts: {
    minWidth: 0,
  },

  kicker: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 9px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.20)",
    color: "rgba(255,255,255,0.92)",
    fontSize: 10,
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: 0.75,
    marginBottom: 8,
  },

  title: {
    fontFamily: theme.fonts.title,
    fontSize: 23,
    lineHeight: 1.05,
    fontWeight: 900,
    letterSpacing: -0.75,
    color: "#FFFFFF",
    textShadow: "0 3px 12px rgba(65, 22, 8, 0.18)",
  },

  subtitle: {
    marginTop: 7,
    color: "rgba(255,255,255,0.88)",
    fontSize: 13,
    lineHeight: 1.28,
    fontWeight: 850,
    maxWidth: 220,
  },

  right: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    alignSelf: "stretch",
    flexShrink: 0,
  },

  timeBadge: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.22)",
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: 950,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
    whiteSpace: "nowrap",
  },

  arrow: {
    width: 46,
    height: 46,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.92)",
    color: theme.colors.coralDeep,
    fontSize: 25,
    fontWeight: 950,
    boxShadow:
      "0 12px 24px rgba(23,32,51,0.16), inset 0 1px 0 rgba(255,255,255,0.9)",
  },
};