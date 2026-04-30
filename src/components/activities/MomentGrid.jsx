import React from "react";
import { theme } from "../../styles/theme.js";
import { MOMENTS } from "../../data/activityUiData.js";
import MomentCard from "./MomentCard.jsx";

export default function MomentGrid({ onSelectMoment, selectedMomentId }) {
  return (
    <>
      <section style={styles.hero}>
        <div style={styles.badge}>Activités sans écran</div>

        <h1 style={styles.title}>
          Dans quel moment veux-tu éviter l’écran ?
        </h1>

        <p style={styles.subtitle}>
          Choisis la situation. Tempo proposera ensuite une activité adaptée à
          l’âge, au temps disponible et à l’énergie du moment.
        </p>
      </section>

      <section style={styles.grid}>
        {MOMENTS.map((moment) => (
          <MomentCard
            key={moment.id}
            moment={moment}
            isSelected={selectedMomentId === moment.id}
            onSelect={onSelectMoment}
          />
        ))}
      </section>
    </>
  );
}

const styles = {
  hero: {
    marginBottom: 22,
  },

  badge: {
    display: "inline-flex",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255, 122, 47, 0.13)",
    color: "#FF7A2F",
    fontFamily: theme.fonts.body,
    fontWeight: 900,
    fontSize: 13,
    marginBottom: 14,
  },

  title: {
    margin: 0,
    fontFamily: theme.fonts.title,
    fontSize: 34,
    lineHeight: 1.02,
    letterSpacing: -1.2,
    color: theme.colors.ink,
    fontWeight: 950,
  },

  subtitle: {
    margin: "12px 0 0",
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 1.45,
    fontWeight: 800,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },
};