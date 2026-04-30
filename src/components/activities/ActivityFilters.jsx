import React from "react";
import { theme } from "../../styles/theme.js";
import { DURATIONS } from "../../data/activityUiData.js";
import { OFFICIAL_AGE_RANGES } from "../../data/activityNormalizer.js";

export default function ActivityFilters({
  selectedDuration,
  selectedAgeRange,
  onSelectDuration,
  onSelectAgeRange,
}) {
  return (
    <>
      <section style={styles.filterBlock}>
        <div style={styles.filterHeader}>
          <h2 style={styles.filterTitle}>Combien de temps ?</h2>

          <p style={styles.filterText}>
            Les activités proposées tiendront dans ce temps disponible.
          </p>
        </div>

        <div style={styles.durationGrid}>
          {DURATIONS.map((duration) => {
            const isSelected = selectedDuration?.value === duration.value;

            return (
              <button
                key={duration.value}
                type="button"
                onClick={() => onSelectDuration(duration)}
                style={{
                  ...styles.durationChip,
                  ...(isSelected ? styles.durationChipSelected : {}),
                }}
              >
                {duration.label}
              </button>
            );
          })}
        </div>
      </section>

      <section style={styles.filterBlock}>
        <div style={styles.filterHeader}>
          <h2 style={styles.filterTitle}>Pour quel âge ?</h2>

          <p style={styles.filterText}>
            Les idées seront ajustées à la tranche d’âge de l’enfant.
          </p>
        </div>

        <div style={styles.ageGrid}>
          {OFFICIAL_AGE_RANGES.map((ageRange) => {
            const isSelected = selectedAgeRange?.id === ageRange.id;

            return (
              <button
                key={ageRange.id}
                type="button"
                onClick={() => onSelectAgeRange(ageRange)}
                style={{
                  ...styles.ageChip,
                  ...(isSelected ? styles.ageChipSelected : {}),
                }}
              >
                {ageRange.label}
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

const styles = {
  filterBlock: {
    marginTop: 14,
    padding: 16,
    borderRadius: 30,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.78) 100%)",
    border: `1px solid ${theme.colors.border}`,
    boxShadow: "0 14px 34px rgba(23, 32, 51, 0.07)",
  },

  filterHeader: {
    marginBottom: 12,
  },

  filterTitle: {
    margin: 0,
    fontFamily: theme.fonts.title,
    fontSize: 21,
    lineHeight: 1.1,
    color: theme.colors.ink,
    fontWeight: 950,
  },

  filterText: {
    margin: "5px 0 0",
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 1.35,
    fontWeight: 800,
  },

  durationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 8,
  },

  durationChip: {
    minHeight: 48,
    border: "none",
    borderRadius: 17,
    background: "rgba(255, 122, 47, 0.1)",
    color: "#FF7A2F",
    fontFamily: theme.fonts.title,
    fontSize: 14,
    fontWeight: 950,
    cursor: "pointer",
  },

  durationChipSelected: {
    background: "linear-gradient(135deg, #FF7A2F 0%, #FFC83D 100%)",
    color: "white",
    boxShadow: "0 12px 28px rgba(255, 122, 47, 0.24)",
  },

  ageGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },

  ageChip: {
    minHeight: 54,
    border: "none",
    borderRadius: 20,
    background: "rgba(255, 122, 47, 0.1)",
    color: "#FF7A2F",
    fontFamily: theme.fonts.title,
    fontSize: 16,
    fontWeight: 950,
    cursor: "pointer",
  },

  ageChipSelected: {
    background: "linear-gradient(135deg, #FF7A2F 0%, #FFC83D 100%)",
    color: "white",
    boxShadow: "0 12px 28px rgba(255, 122, 47, 0.24)",
  },
};