import { CATEGORY_ORDER } from "./activityUiData.js";

export function activityMatchesMoment(activity, moment) {
  if (!activity || !moment) return false;

  return (
    Array.isArray(activity.momentIds) &&
    activity.momentIds.includes(moment.id)
  );
}

export function activityMatchesDuration(activity, duration) {
  if (!activity || !duration) return false;

  return Number(activity.t) <= duration.value;
}

export function activityMatchesAge(activity, ageRange) {
  if (!activity || !ageRange) return false;

  return (
    Array.isArray(activity.ageBuckets) &&
    activity.ageBuckets.includes(ageRange.id)
  );
}

export function getAgeDistance(activity, ageRange) {
  if (!activity || !ageRange) return 99;

  const minAge = Number(activity.minAge ?? 0);
  const maxAge = Number(activity.maxAge ?? minAge);

  if (minAge <= ageRange.max && maxAge >= ageRange.min) {
    return 0;
  }

  if (maxAge < ageRange.min) {
    return ageRange.min - maxAge;
  }

  if (minAge > ageRange.max) {
    return minAge - ageRange.max;
  }

  return 99;
}

export function getDurationOverrun(activity, duration) {
  if (!activity || !duration) return 99;

  return Math.max(0, Number(activity.t) - duration.value);
}

export function getSuggestionScore(activity, duration, ageRange) {
  const ageDistance = getAgeDistance(activity, ageRange);
  const durationOverrun = getDurationOverrun(activity, duration);

  return ageDistance * 20 + durationOverrun;
}

export function getSuggestionReasons(activity, duration, ageRange) {
  const reasons = [];
  const durationOverrun = getDurationOverrun(activity, duration);
  const ageDistance = getAgeDistance(activity, ageRange);

  if (durationOverrun > 0) {
    reasons.push(`+${durationOverrun} min`);
  }

  if (ageDistance > 0) {
    reasons.push("âge voisin");
  }

  if (reasons.length === 0) {
    reasons.push("proche");
  }

  return reasons;
}

export function groupActivitiesByCategory(activities) {
  const groups = {};

  activities.forEach((activity) => {
    const categoryId = activity.cat || "autre";

    if (!groups[categoryId]) {
      groups[categoryId] = [];
    }

    groups[categoryId].push(activity);
  });

  return Object.entries(groups).sort(([catA], [catB]) => {
    const indexA = CATEGORY_ORDER.indexOf(catA);
    const indexB = CATEGORY_ORDER.indexOf(catB);

    if (indexA === -1 && indexB === -1) {
      return catA.localeCompare(catB);
    }

    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
}

export function getFilteredActivities({
  activities,
  selectedMoment,
  selectedDuration,
  selectedAgeRange,
}) {
  if (!selectedMoment || !selectedDuration || !selectedAgeRange) {
    return [];
  }

  return activities.filter((activity) => {
    return (
      activityMatchesMoment(activity, selectedMoment) &&
      activityMatchesDuration(activity, selectedDuration) &&
      activityMatchesAge(activity, selectedAgeRange)
    );
  });
}

export function getNearbyActivities({
  activities,
  filteredActivities,
  selectedMoment,
  selectedDuration,
  selectedAgeRange,
  limit = 6,
}) {
  if (!selectedMoment || !selectedDuration || !selectedAgeRange) {
    return [];
  }

  const exactActivityIds = new Set(
    filteredActivities.map((activity) => activity.id)
  );

  return activities
    .filter((activity) => {
      if (exactActivityIds.has(activity.id)) return false;
      if (!activityMatchesMoment(activity, selectedMoment)) return false;

      const ageDistance = getAgeDistance(activity, selectedAgeRange);
      const durationOverrun = getDurationOverrun(activity, selectedDuration);

      return ageDistance <= 2 && durationOverrun <= 30;
    })
    .sort((activityA, activityB) => {
      return (
        getSuggestionScore(
          activityA,
          selectedDuration,
          selectedAgeRange
        ) -
        getSuggestionScore(
          activityB,
          selectedDuration,
          selectedAgeRange
        )
      );
    })
    .slice(0, limit);
}