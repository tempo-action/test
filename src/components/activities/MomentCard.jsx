import React from "react";
import { theme } from "../../styles/theme.js";

export default function MomentCard({ moment, isSelected = false, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(moment)}
      style={{
        ...styles.cardShell,
        ...(isSelected ? styles.cardShellSelected : {}),
      }}
    >
      <div
        style={{
          ...styles.cardSurface,
          ...(isSelected ? styles.cardSurfaceSelected : {}),
        }}
      >
        <div style={styles.imageWrap}>
          {moment.image ? (
            <img
              src={moment.image}
              alt=""
              style={{
                ...styles.image,
                objectPosition: moment.imagePosition,
                transform: `scale(${moment.imageScale})`,
              }}
            />
          ) : (
            <div style={styles.imageFallback} />
          )}

          <div style={styles.imageShade} />
        </div>

        <div style={styles.cardBody}>
          <h2 style={styles.cardTitle}>{moment.label}</h2>
          <p style={styles.cardText}>{moment.hint}</p>
        </div>

        {isSelected && (
          <div style={styles.selectedBadge}>
            <span style={styles.selectedDot}>✓</span>
          </div>
        )}
      </div>
    </button>
  );
}

const styles = {
  cardShell: {
    position: "relative",
    padding: 1,
    border: "none",
    borderRadius: 30,
    background: "rgba(255,255,255,0.72)",
    boxShadow: "0 14px 34px rgba(23, 32, 51, 0.08)",
    cursor: "pointer",
    fontFamily: theme.fonts.body,
    textAlign: "left",
    transition:
      "transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1), background 220ms ease",
  },

  cardShellSelected: {
    padding: 2,
    background:
      "linear-gradient(135deg, rgba(255,122,47,1) 0%, rgba(255,167,38,1) 55%, rgba(255,200,61,1) 100%)",
    boxShadow:
      "0 20px 48px rgba(255, 122, 47, 0.28), 0 8px 22px rgba(255, 200, 61, 0.16)",
    transform: "translateY(-4px) scale(1.018)",
  },

  cardSurface: {
    position: "relative",
    overflow: "hidden",
    height: "100%",
    borderRadius: 29,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.82) 100%)",
    transition: "background 220ms ease",
  },

  cardSurfaceSelected: {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,247,236,0.94) 100%)",
  },

  imageWrap: {
    position: "relative",
    height: 112,
    background: "linear-gradient(135deg, #FFE5C4 0%, #FFD6E1 100%)",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transformOrigin: "center center",
  },

  imageShade: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0) 45%, rgba(23,32,51,0.08) 100%)",
    pointerEvents: "none",
  },

  imageFallback: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #FFE5C4 0%, #FFD6E1 100%)",
  },

  cardBody: {
    padding: "13px 13px 15px",
  },

  cardTitle: {
    margin: 0,
    color: theme.colors.ink,
    fontFamily: theme.fonts.title,
    fontSize: 17,
    lineHeight: 1.05,
    fontWeight: 900,
  },

  cardText: {
    margin: "7px 0 0",
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 1.25,
    fontWeight: 800,
  },

  selectedBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 30,
    height: 30,
    display: "grid",
    placeItems: "center",
    borderRadius: 999,
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 10px 24px rgba(23, 32, 51, 0.14)",
    backdropFilter: "blur(10px)",
  },

  selectedDot: {
    width: 18,
    height: 18,
    display: "grid",
    placeItems: "center",
    borderRadius: 999,
    background: "linear-gradient(135deg, #FF7A2F 0%, #FFC83D 100%)",
    color: "white",
    fontSize: 11,
    lineHeight: 1,
    fontWeight: 950,
  },
};