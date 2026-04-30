import React from "react";
import { theme } from "../../styles/theme.js";
import ActivityCard from "./ActivityCard.jsx";

export default function ThemeAccordion({
  groupedActivities,
  openCategoryId,
  onToggleCategory,
  getCategoryMeta,
  selectedAgeRange,
}) {
  return (
    <section style={styles.themePicker}>
      <h3 style={styles.themePickerTitle}>Choisis un thème</h3>

      <div style={styles.themePickerGrid}>
        {groupedActivities.map(([categoryId, activities]) => {
          const category = getCategoryMeta(categoryId);
          const isOpen = openCategoryId === categoryId;

          return (
            <div key={categoryId} style={styles.accordionItem}>
              <button
                type="button"
                onClick={() => onToggleCategory(categoryId)}
                style={{
                  ...styles.themeButton,
                  ...(isOpen ? styles.themeButtonSelected : {}),
                }}
              >
                <span
                  style={{
                    ...styles.themeButtonDot,
                    background: isOpen ? "white" : category.color,
                  }}
                />

                <span
                  style={{
                    ...styles.themeButtonLabel,
                    color: isOpen ? "white" : theme.colors.ink,
                  }}
                >
                  {category.label} ({activities.length})
                </span>

                <span
                  style={{
                    ...styles.accordionArrow,
                    color: isOpen ? "white" : theme.colors.ink,
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  ⌄
                </span>
              </button>

              {isOpen && (
  <div className="activity-accordion-panel" style={styles.accordionPanel}>
                  <div style={styles.activityList}>
                    {activities.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        category={category}
                        selectedAgeRange={selectedAgeRange}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

const styles = {
  themePicker: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 30,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.78) 100%)",
    border: `1px solid ${theme.colors.border}`,
    boxShadow: "0 14px 34px rgba(23, 32, 51, 0.07)",
  },

  themePickerTitle: {
    margin: "0 0 12px",
    fontFamily: theme.fonts.title,
    fontSize: 20,
    lineHeight: 1.1,
    color: theme.colors.ink,
    fontWeight: 950,
  },

  themePickerGrid: {
    display: "grid",
    gap: 10,
  },

  accordionItem: {
    display: "grid",
    gap: 10,
  },

 themeButton: {
  width: "100%",
  minHeight: 58,
  display: "flex",
  alignItems: "center",
  gap: 10,
  border: "none",
  borderRadius: 22,
  padding: "10px 12px",
  background: "rgba(23, 32, 51, 0.045)",
  cursor: "pointer",
  fontFamily: theme.fonts.body,
  textAlign: "left",
  transition:
    "transform 180ms ease, box-shadow 180ms ease, background 180ms ease, color 180ms ease",
},

  themeButtonSelected: {
  background: "linear-gradient(135deg, #FF7A2F 0%, #FFC83D 100%)",
  boxShadow: "0 14px 30px rgba(255, 122, 47, 0.26)",
  transform: "translateY(-1px)",
},

  themeButtonDot: {
    width: 13,
    height: 13,
    borderRadius: 999,
    flex: "0 0 auto",
  },

  themeButtonLabel: {
    flex: 1,
    color: theme.colors.ink,
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