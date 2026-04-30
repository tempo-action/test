import React, { useState } from "react";
import HomeHeader from "./components/home/HomeHeader.jsx";
import HomeHero from "./components/home/HomeHero.jsx";
import HomeStatsRow from "./components/home/HomeStatsRow.jsx";
import HomeCureProgress from "./components/home/HomeCureProgress.jsx";
import HomePrimaryAction from "./components/home/HomePrimaryAction.jsx";
import HomeNearbyIdeas from "./components/home/HomeNearbyIdeas.jsx";
import BottomNav from "./components/ui/BottomNav.jsx";
import { homeDemo } from "./data/homeDemo.js";
import { theme } from "./styles/theme.js";
import ActivitiesTab from "./components/activities/ActivitiesTab.jsx";

function HomeTab({ setTab }) {
  return (
    <main className="premium-page">
      <HomeHeader userName={homeDemo.userName} />

      <HomeHero
  minutesNoScreen={homeDemo.minutesNoScreen}
  userName={homeDemo.userName}
/>


      <HomeStatsRow
        minutesNoScreen={homeDemo.minutesNoScreen}
        sessionsDone={homeDemo.sessionsDone}
        badgesCount={homeDemo.badgesCount}
      />

      <HomeCureProgress cure={homeDemo.cure} />

      <HomePrimaryAction onClick={() => setTab("activities")} />

      <HomeNearbyIdeas
        city={homeDemo.nearby.city}
        suggestions={homeDemo.nearby.suggestions}
      />
    </main>
  );
}


function CureTab() {
  return (
    <main className="premium-page">
      <h1 style={styles.title}>Ma cure</h1>
      <p style={styles.text}>
        Ici, on branchera le diagnostic, le choix de programme et la cure active.
      </p>

      <div style={styles.previewCard}>
        <div style={styles.previewEmoji}>🌿</div>
        <h2 style={styles.previewTitle}>Cure guidée</h2>
        <p style={styles.previewText}>
          Diagnostic, choix 7 / 15 / 30 jours, timer, défis parentaux et bilan du
          soir.
        </p>
      </div>
    </main>
  );
}

function ParentsTab() {
  return (
    <main className="premium-page">
      <h1 style={styles.title}>Parents</h1>
      <p style={styles.text}>
        Ici, on mettra les conseils, les sorties sans écran et le suivi famille.
      </p>

      <div style={styles.previewCard}>
        <div style={styles.previewEmoji}>💬</div>
        <h2 style={styles.previewTitle}>Espace parents</h2>
        <p style={styles.previewText}>
          Conseils, suivi, partage et idées de sorties sans écran.
        </p>
      </div>
    </main>
  );
}

export default function AppPreview() {
  const [tab, setTab] = useState("home");

  return (
    <div style={styles.app}>
      {tab === "home" && <HomeTab setTab={setTab} />}
      {tab === "activities" && <ActivitiesTab />}
      {tab === "cure" && <CureTab />}
      {tab === "parents" && <ParentsTab />}

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: theme.gradients.appBackground,
  },

  title: {
    margin: "8px 0 8px",
    fontFamily: theme.fonts.title,
    fontSize: 36,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: -1.2,
    color: theme.colors.ink,
  },

  text: {
    margin: "0 0 24px",
    fontFamily: theme.fonts.body,
    fontSize: 16,
    lineHeight: 1.45,
    color: theme.colors.muted,
    fontWeight: 800,
  },

  previewCard: {
    borderRadius: theme.radius.xxl,
    padding: 22,
    background: theme.gradients.glass,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadow.lg,
  },

  previewEmoji: {
    width: 62,
    height: 62,
    borderRadius: 24,
    background: theme.gradients.activity,
    display: "grid",
    placeItems: "center",
    fontSize: 30,
    boxShadow: theme.shadow.orange,
    marginBottom: 16,
  },

  previewTitle: {
    margin: 0,
    fontFamily: theme.fonts.title,
    color: theme.colors.ink,
    fontSize: 24,
    lineHeight: 1.1,
  },

  previewText: {
    margin: "10px 0 0",
    color: theme.colors.muted,
    fontWeight: 800,
    lineHeight: 1.45,
  },
};