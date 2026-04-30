import React, { useState } from "react";
import { theme } from "../../styles/theme.js";

export default function HomeNearbyIdeas({
  city = "Saint-Brieuc",
  suggestions = ["Parcs", "Bibliothèques", "Ludothèques"],
}) {
  const [selected, setSelected] = useState(suggestions[0] || "Parcs");

  const categoryMap = {
    Parcs: {
      emoji: "🌳",
      label: "Parcs",
      color: theme.colors.greenDeep,
      bg: theme.colors.greenSoft,
    },
    Bibliothèques: {
      emoji: "📚",
      label: "Bibliothèques",
      color: theme.colors.blueDeep,
      bg: theme.colors.blueSoft,
    },
    Ludothèques: {
      emoji: "🧸",
      label: "Ludothèques",
      color: theme.colors.orangeDeep,
      bg: theme.colors.orangeSoft,
    },
  };

  return (
    <section className="nearby-card" style={styles.card}>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />

      <div style={styles.header}>
        <div style={styles.iconBadge}>📍</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={styles.kicker}>Sortie sans écran</div>
          <h2 style={styles.title}>Trouver une idée près de vous</h2>
          <p style={styles.subtitle}>
            Parcs, bibliothèques et ludothèques pour remplacer un temps d’écran.
          </p>
        </div>
      </div>

      <div style={styles.searchBox}>
        <div style={styles.inputWrap}>
          <span style={styles.inputIcon}>🏙️</span>
          <input
            defaultValue={city}
            placeholder="Votre ville"
            style={styles.input}
          />
        </div>

        <button type="button" className="premium-pressable" style={styles.searchButton}>
          <span>Chercher</span>
          <span style={styles.searchArrow}>→</span>
        </button>
      </div>

      <div style={styles.categories}>
        {suggestions.map((item) => {
          const cat = categoryMap[item] || {
            emoji: "✨",
            label: item,
            color: theme.colors.violetDeep,
            bg: theme.colors.violetSoft,
          };

          const isSelected = selected === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => setSelected(item)}
              className="premium-pressable"
              style={{
                ...styles.category,
                background: isSelected ? cat.bg : "rgba(255,255,255,0.68)",
                borderColor: isSelected
                  ? "rgba(255,255,255,0.85)"
                  : "rgba(23,32,51,0.06)",
                boxShadow: isSelected
                  ? "0 12px 28px rgba(23,32,51,0.10)"
                  : "inset 0 1px 0 rgba(255,255,255,0.74)",
              }}
            >
              <span style={styles.categoryEmoji}>{cat.emoji}</span>
              <span
                style={{
                  ...styles.categoryText,
                  color: isSelected ? cat.color : theme.colors.muted,
                }}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      <div style={styles.previewResult}>
        <div style={styles.previewTop}>
          <div>
            <div style={styles.previewLabel}>Suggestion rapide</div>
            <div style={styles.previewTitle}>
              {selected === "Parcs" && "Un parc calme à moins de 15 min"}
              {selected === "Bibliothèques" && "Une bibliothèque avec coin enfant"}
              {selected === "Ludothèques" && "Une ludothèque pour jouer ensemble"}
              {!["Parcs", "Bibliothèques", "Ludothèques"].includes(selected) &&
                "Une idée simple près de vous"}
            </div>
          </div>

          <div style={styles.previewDistance}>12 km</div>
        </div>

        <div style={styles.previewFooter}>
          <span>Sans écran</span>
          <span>·</span>
          <span>Famille</span>
          <span>·</span>
          <span>Gratuit ou faible coût</span>
        </div>
      </div>
    </section>
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
      "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(238,246,255,0.86) 100%)",
    border: "1px solid rgba(255,255,255,0.76)",
    boxShadow:
      "0 24px 58px rgba(23, 32, 51, 0.12), inset 0 1px 0 rgba(255,255,255,0.92)",
  },

  glowOne: {
    position: "absolute",
    top: -78,
    right: -78,
    width: 190,
    height: 190,
    borderRadius: "50%",
    background: "rgba(77, 141, 255, 0.16)",
    pointerEvents: "none",
  },

  glowTwo: {
    position: "absolute",
    bottom: -92,
    left: -92,
    width: 210,
    height: 210,
    borderRadius: "50%",
    background: "rgba(24, 199, 183, 0.14)",
    pointerEvents: "none",
  },

  header: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "flex-start",
    gap: 13,
    marginBottom: 16,
  },

  iconBadge: {
    width: 54,
    height: 54,
    borderRadius: 22,
    display: "grid",
    placeItems: "center",
    background: theme.gradients.calm,
    color: theme.colors.white,
    fontSize: 26,
    boxShadow: theme.shadow.blue,
    flexShrink: 0,
  },

  kicker: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 9px",
    borderRadius: 999,
    background: theme.colors.blueSoft,
    color: theme.colors.blueDeep,
    fontSize: 10,
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: 0.65,
    marginBottom: 8,
  },

  title: {
    margin: 0,
    fontFamily: theme.fonts.title,
    color: theme.colors.ink,
    fontSize: 24,
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: -0.8,
  },

  subtitle: {
    margin: "8px 0 0",
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 1.35,
    fontWeight: 850,
  },

  searchBox: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 10,
    marginBottom: 14,
  },

  inputWrap: {
    minWidth: 0,
    height: 54,
    borderRadius: 20,
    padding: "0 13px",
    display: "flex",
    alignItems: "center",
    gap: 9,
    background: "rgba(255,255,255,0.76)",
    border: "1px solid rgba(23,32,51,0.07)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.86)",
  },

  inputIcon: {
    fontSize: 20,
    flexShrink: 0,
  },

  input: {
    width: "100%",
    minWidth: 0,
    border: "none",
    outline: "none",
    background: "transparent",
    color: theme.colors.ink,
    fontFamily: theme.fonts.body,
    fontWeight: 900,
    fontSize: 15,
  },

  searchButton: {
    height: 54,
    border: "none",
    borderRadius: 20,
    padding: "0 13px 0 16px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: theme.gradients.calm,
    color: theme.colors.white,
    fontWeight: 950,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: theme.shadow.blue,
  },

  searchArrow: {
    width: 25,
    height: 25,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.22)",
    fontSize: 15,
  },

  categories: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 9,
    marginBottom: 13,
  },

  category: {
    border: "1px solid rgba(23,32,51,0.06)",
    borderRadius: 22,
    minHeight: 74,
    padding: "10px 7px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    cursor: "pointer",
  },

  categoryEmoji: {
    fontSize: 23,
    lineHeight: 1,
  },

  categoryText: {
    fontWeight: 950,
    fontSize: 11,
    lineHeight: 1.05,
    textAlign: "center",
  },

  previewResult: {
    position: "relative",
    zIndex: 1,
    borderRadius: 26,
    padding: 14,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.62) 100%)",
    border: "1px solid rgba(255,255,255,0.78)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
  },

  previewTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  previewLabel: {
    color: theme.colors.blueDeep,
    fontSize: 10,
    fontWeight: 950,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 5,
  },

  previewTitle: {
    fontFamily: theme.fonts.title,
    color: theme.colors.ink,
    fontSize: 16,
    lineHeight: 1.16,
    fontWeight: 900,
    letterSpacing: -0.25,
  },

  previewDistance: {
    padding: "7px 9px",
    borderRadius: 999,
    background: theme.colors.tealSoft,
    color: theme.colors.tealDeep,
    fontWeight: 950,
    fontSize: 12,
    whiteSpace: "nowrap",
  },

  previewFooter: {
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: 850,
  },
};