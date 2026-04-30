import React from "react";
import { theme } from "../../styles/theme.js";
import ActivityMiniCard from "./ActivityMiniCard.jsx";

export default function ActivityMiniGrid({
  title = "",
  subtitle = "",
  activities = [],
  selectedAgeRange,
  getCategoryMeta,
  onSelectActivity,
  isSuggestion = false,
  getSuggestionReasons,
  selectedDuration,
}) {
  if (!activities.length) {
    return null;
  }

  return (
    <section style={styles.section}>
      {(title || subtitle) && (
  <div style={styles.header}>
    <div>
      {title && <h3 style={styles.title}>{title}</h3>}
      {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
    </div>
  </div>
)}

      <div style={styles.grid}>
        {activities.map((activity) => {
          const category = getCategoryMeta(activity.cat);
          const suggestionReasons =
            isSuggestion && getSuggestionReasons
              ? getSuggestionReasons(activity, selectedDuration, selectedAgeRange)
              : [];

          return (
            <ActivityMiniCard
              key={activity.id}
              activity={activity}
              category={category}
              selectedAgeRange={selectedAgeRange}
              onSelectActivity={onSelectActivity}
              isSuggestion={isSuggestion}
              suggestionReasons={suggestionReasons}
            />
          );
        })}
      </div>
    </section>
  );
}

const styles = {
  section: {
    marginTop: 16,
  },

  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },

  title: {
    margin: 0,
    fontFamily: theme.fonts.title,
    fontSize: 21,
    lineHeight: 1.08,
    color: theme.colors.ink,
    fontWeight: 950,
  },

  subtitle: {
    margin: "5px 0 0",
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 1.35,
    fontWeight: 800,
  },

  count: {
    flex: "0 0 auto",
    width: 40,
    height: 40,
    display: "grid",
    placeItems: "center",
    borderRadius: 16,
    background: "linear-gradient(135deg, #FF7A2F 0%, #FFC83D 100%)",
    color: "white",
    fontFamily: theme.fonts.title,
    fontSize: 15,
    fontWeight: 950,
    boxShadow: "0 12px 28px rgba(255, 122, 47, 0.22)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
};