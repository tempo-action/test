import React from "react";
import { theme } from "../../styles/theme.js";

export default function SelectedMomentHero({ selectedMoment, onBack }) {
  if (!selectedMoment) {
    return null;
  }

  return (
    <>
      <section style={styles.topBar}>
        <button type="button" onClick={onBack} style={styles.backButton}>
          ← Retour
        </button>

        <div style={styles.stepPill}>Activités adaptées</div>
      </section>

      <section style={styles.momentHero}>
        <div style={styles.momentHeroImageWrap}>
          <img
            src={selectedMoment.image}
            alt=""
            style={{
              ...styles.momentHeroImage,
              objectPosition: selectedMoment.imagePosition,
              transform: `scale(${selectedMoment.imageScale})`,
            }}
          />

          <div style={styles.momentHeroShade} />
        </div>

        <div style={styles.momentHeroContent}>
          <div style={styles.badgeDark}>Moment choisi</div>

          <h1 style={styles.momentHeroTitle}>{selectedMoment.label}</h1>

          <p style={styles.momentHeroText}>{selectedMoment.hint}</p>
        </div>
      </section>
    </>
  );
}

const styles = {
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },

  backButton: {
    border: "none",
    background: "rgba(255,255,255,0.78)",
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

  momentHero: {
    position: "relative",
    minHeight: 210,
    borderRadius: 34,
    overflow: "hidden",
    marginBottom: 18,
    background: "#172033",
    boxShadow: "0 20px 50px rgba(23, 32, 51, 0.18)",
  },

  momentHeroImageWrap: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
  },

  momentHeroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transformOrigin: "center center",
  },

  momentHeroShade: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(23,32,51,0.06) 0%, rgba(23,32,51,0.38) 58%, rgba(23,32,51,0.78) 100%)",
  },

  momentHeroContent: {
    position: "relative",
    zIndex: 2,
    minHeight: 210,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 20,
    color: "white",
  },

  badgeDark: {
    alignSelf: "flex-start",
    padding: "7px 11px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.18)",
    color: "white",
    fontFamily: theme.fonts.body,
    fontWeight: 950,
    fontSize: 12,
    marginBottom: 10,
    backdropFilter: "blur(10px)",
  },

  momentHeroTitle: {
    margin: 0,
    fontFamily: theme.fonts.title,
    fontSize: 35,
    lineHeight: 1,
    fontWeight: 950,
    letterSpacing: -1.2,
  },

  momentHeroText: {
    margin: "9px 0 0",
    maxWidth: 320,
    fontFamily: theme.fonts.body,
    fontSize: 15,
    lineHeight: 1.35,
    color: "rgba(255,255,255,0.78)",
    fontWeight: 850,
  },
};