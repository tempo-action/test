import React, { useMemo, useState } from "react";
import { theme } from "../../styles/theme.js";
import { NORMALIZED_ACTIVITIES } from "../../data/activityNormalizer.js";
import { getCategoryMeta } from "../../data/activityUiData.js";
import {
  getFilteredActivities,
  getNearbyActivities,
  getSuggestionReasons,
} from "../../data/activityLogic.js";

import MomentGrid from "./MomentGrid.jsx";
import SelectedMomentHero from "./SelectedMomentHero.jsx";
import ActivityFilters from "./ActivityFilters.jsx";
import ActivityMiniGrid from "./ActivityMiniGrid.jsx";
import ActivityDetailScreen from "./ActivityDetailScreen.jsx";
import ActivityEvaluationScreen from "./ActivityEvaluationScreen.jsx";

const MIN_EXACT_RESULTS_BEFORE_SUGGESTIONS = 4;

export default function ActivitiesTab() {
  const [page, setPage] = useState("moments");
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [pendingMomentId, setPendingMomentId] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedAgeRange, setSelectedAgeRange] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [completedSession, setCompletedSession] = useState(null);

  const hasFilters = Boolean(
    selectedMoment && selectedDuration && selectedAgeRange
  );

  const filteredActivities = useMemo(() => {
    return getFilteredActivities({
      activities: NORMALIZED_ACTIVITIES,
      selectedMoment,
      selectedDuration,
      selectedAgeRange,
    });
  }, [selectedMoment, selectedDuration, selectedAgeRange]);

  const nearbyActivities = useMemo(() => {
    return getNearbyActivities({
      activities: NORMALIZED_ACTIVITIES,
      filteredActivities,
      selectedMoment,
      selectedDuration,
      selectedAgeRange,
      limit: 6,
    });
  }, [filteredActivities, selectedMoment, selectedDuration, selectedAgeRange]);

  const shouldShowNearbySuggestions =
    hasFilters &&
    nearbyActivities.length > 0 &&
    filteredActivities.length < MIN_EXACT_RESULTS_BEFORE_SUGGESTIONS;

  function openMoment(moment) {
    setPendingMomentId(moment.id);
    setSelectedMoment(moment);
    setSelectedDuration(null);
    setSelectedAgeRange(null);
    setSelectedActivity(null);
    setCompletedSession(null);

    window.setTimeout(() => {
      setPage("filters");
      setPendingMomentId(null);
    }, 220);
  }

  function backToMoments() {
    setPage("moments");
    setSelectedDuration(null);
    setSelectedAgeRange(null);
    setSelectedActivity(null);
    setCompletedSession(null);
    setPendingMomentId(null);
  }

  function backToFilters() {
    setPage("filters");
    setSelectedActivity(null);
    setCompletedSession(null);
  }

  function selectDuration(duration) {
    setSelectedDuration(duration);
    setSelectedActivity(null);
    setCompletedSession(null);
  }

  function selectAgeRange(ageRange) {
    setSelectedAgeRange(ageRange);
    setSelectedActivity(null);
    setCompletedSession(null);
  }

  function handleSelectActivity(activity) {
    setSelectedActivity(activity);
    setCompletedSession(null);
    setPage("detail");
  }

  function handleStartActivity(activity) {
    console.log("Démarrer l’activité :", activity);
  }

  function handleFinishActivity(activity, sessionData) {
    setSelectedActivity(activity);
    setCompletedSession({
      activityId: activity?.id,
      elapsedSeconds: sessionData?.elapsedSeconds || 0,
      completed: true,
    });
    setPage("evaluation");
  }

  function handleSaveEvaluation(payload) {
    console.log("Évaluation sauvegardée :", payload);

    setCompletedSession(null);
    setSelectedActivity(null);
    setPage("filters");
  }

  return (
    <main className="premium-page">
      {page === "moments" && (
        <section className="activity-screen-enter">
          <MomentGrid
            onSelectMoment={openMoment}
            selectedMomentId={pendingMomentId}
          />
        </section>
      )}

      {page === "filters" && selectedMoment && (
        <section className="activity-screen-enter">
          <SelectedMomentHero
            selectedMoment={selectedMoment}
            onBack={backToMoments}
          />

          <ActivityFilters
            selectedDuration={selectedDuration}
            selectedAgeRange={selectedAgeRange}
            onSelectDuration={selectDuration}
            onSelectAgeRange={selectAgeRange}
          />

          <section style={styles.resultsSection}>
            {!hasFilters && (
              <div style={styles.emptyCard}>
                <h3 style={styles.emptyTitle}>Choisis une durée et un âge</h3>

                <p style={styles.emptyText}>
                  Les activités apparaîtront ici sous forme de petites cartes.
                </p>
              </div>
            )}

            {hasFilters && filteredActivities.length === 0 && (
              <div style={styles.emptyCard}>
                <h3 style={styles.emptyTitle}>Aucune activité exacte</h3>

                <p style={styles.emptyText}>
                  Pas de panique : Tempo te propose juste en dessous des idées
                  proches, avec un temps ou une tranche d’âge légèrement
                  différente.
                </p>
              </div>
            )}

            {hasFilters && filteredActivities.length > 0 && (
              <ActivityMiniGrid
                activities={filteredActivities}
                selectedAgeRange={selectedAgeRange}
                selectedDuration={selectedDuration}
                getCategoryMeta={getCategoryMeta}
                onSelectActivity={handleSelectActivity}
              />
            )}

            {shouldShowNearbySuggestions && (
              <ActivityMiniGrid
                title="Suggestions proches"
                subtitle="Quelques idées utiles si tu peux ajuster un peu le temps ou l’âge."
                activities={nearbyActivities}
                selectedAgeRange={selectedAgeRange}
                selectedDuration={selectedDuration}
                getCategoryMeta={getCategoryMeta}
                onSelectActivity={handleSelectActivity}
                isSuggestion
                getSuggestionReasons={getSuggestionReasons}
              />
            )}
          </section>
        </section>
      )}

      {page === "detail" && selectedActivity && (
        <ActivityDetailScreen
          activity={selectedActivity}
          category={getCategoryMeta(selectedActivity.cat)}
          selectedAgeRange={selectedAgeRange}
          onBack={backToFilters}
          onStartActivity={handleStartActivity}
          onFinishActivity={handleFinishActivity}
        />
      )}

      {page === "evaluation" && selectedActivity && completedSession && (
        <ActivityEvaluationScreen
          activity={selectedActivity}
          session={completedSession}
          onBack={() => setPage("detail")}
          onSaveEvaluation={handleSaveEvaluation}
        />
      )}
    </main>
  );
}

const styles = {
  resultsSection: {
    marginTop: 22,
    paddingBottom: 18,
  },

  emptyCard: {
    padding: 18,
    borderRadius: 28,
    background: "rgba(255,255,255,0.82)",
    border: `1px solid ${theme.colors.border}`,
    boxShadow: "0 14px 34px rgba(23, 32, 51, 0.07)",
  },

  emptyTitle: {
    margin: 0,
    fontFamily: theme.fonts.title,
    color: theme.colors.ink,
    fontSize: 20,
    fontWeight: 950,
  },

  emptyText: {
    margin: "7px 0 0",
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 1.4,
    fontWeight: 800,
  },
};