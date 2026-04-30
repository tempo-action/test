import React from "react";
import { theme } from "../../styles/theme.js";

export default function ActivityMiniCard({
  activity,
  category,
  selectedAgeRange,
  onSelectActivity,
  isSuggestion = false,
  suggestionReasons = [],
}) {
  return (
    <button
      type="button"
      onClick={() => onSelectActivity?.(activity)}
      style={{
        ...styles.card,
        borderColor: category.color,
        background: `linear-gradient(180deg, ${category.bg} 0%, rgba(255,255,255,0.88) 100%)`,
      }}
    >
      <div style={styles.topRow}>
        <span
          style={{
            ...styles.categoryPill,
            color: category.color,
            background: "rgba(255,255,255,0.76)",
          }}
        >
          {category.shortLabel}
        </span>

        <span style={styles.durationPill}>
          {activity.timeLabel || `${activity.t} min`}
        </span>
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{activity.nm}</h3>

        <p style={styles.desc}>{activity.desc}</p>
      </div>

      <div style={styles.bottomRow}>
        <span style={styles.agePill}>{selectedAgeRange.label}</span>

        {isSuggestion && suggestionReasons.length > 0 && (
          <span style={styles.suggestionPill}>
            {suggestionReasons.join(" · ")}
          </span>
        )}
      </div>
    </button>
  );
}

const styles = {
  card: {
    width: "100%",
    minHeight: 196,
    border: "1.5px solid",
    borderRadius: 28,
    padding: 13,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "left",
    cursor: "pointer",
    boxShadow: "0 14px 34px rgba(23, 32, 51, 0.08)",
    fontFamily: theme.fonts.body,
    transition:
      "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
  },

  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  categoryPill: {
    display: "inline-flex",
    alignItems: "center",
    maxWidth: "72%",
    padding: "6px 9px",
    borderRadius: 999,
    fontFamily: theme.fonts.body,
    fontSize: 11,
    fontWeight: 950,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  durationPill: {
    flex: "0 0 auto",
    padding: "6px 8px",
    borderRadius: 999,
    background: "rgba(255, 122, 47, 0.12)",
    color: "#FF7A2F",
    fontFamily: theme.fonts.title,
    fontSize: 11,
    fontWeight: 950,
  },

  content: {
    marginTop: 12,
  },

  title: {
    margin: 0,
    fontFamily: theme.fonts.title,
    fontSize: 17,
    lineHeight: 1.08,
    letterSpacing: -0.35,
    color: theme.colors.ink,
    fontWeight: 950,
  },

  desc: {
    margin: "8px 0 0",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    color: theme.colors.muted,
    fontFamily: theme.fonts.body,
    fontSize: 13,
    lineHeight: 1.25,
    fontWeight: 800,
  },

  bottomRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 12,
  },

  agePill: {
    display: "inline-flex",
    padding: "6px 8px",
    borderRadius: 999,
    background: "rgba(23, 32, 51, 0.06)",
    color: theme.colors.ink,
    fontFamily: theme.fonts.body,
    fontSize: 11,
    fontWeight: 900,
  },

  suggestionPill: {
    display: "inline-flex",
    padding: "6px 8px",
    borderRadius: 999,
    background: "rgba(255, 122, 47, 0.12)",
    color: "#FF7A2F",
    fontFamily: theme.fonts.body,
    fontSize: 11,
    fontWeight: 950,
  },
};