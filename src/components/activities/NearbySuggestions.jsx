import React from "react";
import { theme } from "../../styles/theme.js";
import ActivityCard from "./ActivityCard.jsx";

export default function NearbySuggestions({
  nearbyActivities,
  showNearbySuggestions,
  onToggleNearbySuggestions,
  getCategoryMeta,
  selectedAgeRange,
  selectedDuration,
  getSuggestionReasons,
}) {
  if (!nearbyActivities.length) {
    return null;
  }

  return (
    <section style={styles.nearbySection}>
      <button
        type="button"
        onClick={onToggleNearbySuggestions}
        style={{
          ...styles.nearbyButton,
          ...(showNearbySuggestions ? styles.nearbyButtonOpen : {}),
        }}
      >
        <span style={styles.nearbyButtonText}>
          Suggestions proches ({nearbyActivities.length})
        </span>

        <span
          style={{
            ...styles.accordionArrow,
            color: showNearbySuggestions ? "white" : "#FF7A2F",
            transform: showNearbySuggestions
              ? "rotate(180deg)"
              : "rotate(0deg)",
          }}
        >
          ⌄
        </span>
      </button>

      {showNearbySuggestions && (
  <div className="activity-accordion-panel" style={styles.accordionPanel}>
          <div style={styles.activityList}>
            {nearbyActivities.map((activity) => {
              const category = getCategoryMeta(activity.cat);

              return (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  category={category}
                  selectedAgeRange={selectedAgeRange}
                  suggestionReasons={getSuggestionReasons(
                    activity,
                    selectedDuration,
                    selectedAgeRange
                  )}
                />
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

const styles = {
  nearbySection: {
    marginTop: 14,
    display: "grid",
    gap: 10,
  },

  nearbyButton: {
    width: "100%",
    minHeight: 58,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    border: "none",
    borderRadius: 22,
    padding: "10px 14px",
    background: "rgba(255, 122, 47, 0.12)",
    color: "#FF7A2F",
    cursor: "pointer",
    fontFamily: theme.fonts.body,
    textAlign: "left",
    transition:
  "transform 180ms ease, box-shadow 180ms ease, background 180ms ease, color 180ms ease",
  },

  nearbyButtonOpen: {
  background: "linear-gradient(135deg, #FF7A2F 0%, #FFC83D 100%)",
  color: "white",
  boxShadow: "0 14px 30px rgba(255, 122, 47, 0.26)",
  transform: "translateY(-1px)",
},

  nearbyButtonText: {
    fontFamily: theme.fonts.title,
    fontSize: 16,
    fontWeight: 950,
  },

  accordionArrow: {
    flex: "0 0 auto",
    fontFamily: theme.fonts.title,
    fontSize: 20,
    fontWeight: 950,
    transition: "transform 160ms ease",
  },

  accordionPanel: {
    paddingTop: 2,
  },

  activityList: {
    display: "grid",
    gap: 12,
  },
};