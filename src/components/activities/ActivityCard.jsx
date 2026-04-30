import React from "react";
import { theme } from "../../styles/theme.js";

export default function ActivityCard({
  activity,
  category,
  selectedAgeRange,
  suggestionReasons = [],
}) {
  return (
    <article style={styles.activityCard}>
      <div style={styles.activityTop}>
        <div>
          <div
            style={{
              ...styles.categoryPill,
              color: category.color,
              background: category.bg,
            }}
          >
            {category.shortLabel}
          </div>

          <h4 style={styles.activityTitle}>{activity.nm}</h4>
        </div>

        <div style={styles.activityDuration}>
          {activity.timeLabel || `${activity.t} min`}
        </div>
      </div>

      <p style={styles.activityDesc}>{activity.desc}</p>

      <div style={styles.activityMetaRow}>
        <span style={styles.metaPill}>{selectedAgeRange.label}</span>

        <span style={styles.metaPill}>
          {activity.materiel ? "Matériel simple" : "Sans matériel"}
        </span>

        {suggestionReasons.map((reason) => (
          <span key={reason} style={styles.suggestionPill}>
            {reason}
          </span>
        ))}
      </div>

      {activity.objectif && (
        <div style={styles.activityObjective}>
          <strong>Objectif : </strong>
          {activity.objectif}
        </div>
      )}
    </article>
  );
}

const styles = {
  activityCard: {
    padding: 16,
    borderRadius: 30,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.84) 100%)",
    border: `1px solid ${theme.colors.border}`,
    boxShadow: "0 14px 34px rgba(23, 32, 51, 0.08)",
  },

  activityTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  categoryPill: {
    display: "inline-flex",
    padding: "6px 10px",
    borderRadius: 999,
    fontFamily: theme.fonts.body,
    fontSize: 12,
    fontWeight: 950,
    marginBottom: 9,
  },

  activityTitle: {
    margin: 0,
    fontFamily: theme.fonts.title,
    fontSize: 20,
    lineHeight: 1.1,
    color: theme.colors.ink,
    fontWeight: 950,
  },

  activityDuration: {
    flex: "0 0 auto",
    padding: "8px 10px",
    borderRadius: 15,
    background: "rgba(255, 122, 47, 0.11)",
    color: "#FF7A2F",
    fontFamily: theme.fonts.title,
    fontSize: 13,
    fontWeight: 950,
  },

  activityDesc: {
    margin: "10px 0 0",
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 1.38,
    fontWeight: 800,
  },

  activityMetaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },

  metaPill: {
    display: "inline-flex",
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(23, 32, 51, 0.06)",
    color: theme.colors.ink,
    fontFamily: theme.fonts.body,
    fontSize: 12,
    fontWeight: 900,
  },

  suggestionPill: {
    display: "inline-flex",
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(255, 122, 47, 0.12)",
    color: "#FF7A2F",
    fontFamily: theme.fonts.body,
    fontSize: 12,
    fontWeight: 950,
  },

  activityObjective: {
    marginTop: 12,
    padding: 12,
    borderRadius: 20,
    background: "rgba(255, 247, 236, 0.9)",
    color: theme.colors.ink,
    fontFamily: theme.fonts.body,
    fontSize: 13,
    lineHeight: 1.35,
    fontWeight: 800,
  },
};