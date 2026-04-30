import { ALL_ACTIVITIES } from "./activitiesData.js";

export const OFFICIAL_AGE_RANGES = [
  {
    id: "0-2",
    label: "0–2 ans",
    min: 0,
    max: 2,
  },
  {
    id: "3-5",
    label: "3–5 ans",
    min: 3,
    max: 5,
  },
  {
    id: "6-8",
    label: "6–8 ans",
    min: 6,
    max: 8,
  },
  {
    id: "9-11",
    label: "9–11 ans",
    min: 9,
    max: 11,
  },
];

export const OFFICIAL_MOMENT_IDS = [
  "repas",
  "voiture",
  "transcom",
  "parc",
  "restaurant",
  "coucher",
  "maison",
  "vacances",
  "pluie",
  "ecole",
  "poussette",
  "fatigue",
  "cuisine",
  "attente",
];

/**
 * Normalise fortement les textes :
 * - minuscules
 * - suppression accents
 * - apostrophes unifiées
 * - tirets unifiés
 * - espaces nettoyés
 *
 * Comme ça :
 * "Après l’école", "apres l'ecole", "après école", "école"
 * peuvent tous être reconnus correctement.
 */
function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("’", "'")
    .replaceAll("‘", "'")
    .replaceAll("`", "'")
    .replaceAll("–", "-")
    .replaceAll("—", "-")
    .replace(/\s+/g, " ");
}

/**
 * Toutes les clés ici doivent être écrites dans leur version normalisée :
 * sans accents, apostrophe simple, minuscules.
 */
const SITUATION_TO_MOMENT_ID = {
  // Repas / cuisine
  repas: "repas",
  "au repas": "repas",
  "les repas": "repas",
  "pendant les repas": "repas",
  "avant/apres les repas": "repas",

  cuisine: "cuisine",
  cuisiner: "cuisine",

  // Extérieur
  parc: "parc",
  "au parc": "parc",
  "jour de beau temps": "parc",
  dehors: "parc",
  exterieur: "parc",

  // Voiture / transports
  voiture: "voiture",
  "en voiture": "voiture",

  transcom: "transcom",
  transports: "transcom",
  transport: "transcom",
  "transport en commun": "transcom",
  "transports en commun": "transcom",
  "dans les transports en commun": "transcom",
  train: "transcom",
  "en train": "transcom",
  bus: "transcom",
  metro: "transcom",
  tram: "transcom",

  // Restaurant
  restaurant: "restaurant",
  "au restaurant": "restaurant",
  "restaurant / bar": "restaurant",
  "au restaurant / bar": "restaurant",
  bar: "restaurant",

  // Coucher / calme
  coucher: "coucher",
  "le coucher": "coucher",
  "au coucher": "coucher",
  "temps calme": "coucher",
  "fin de journee": "coucher",
  soir: "coucher",

  // Maison / temps libre / ennui
  maison: "maison",
  "a la maison": "maison",
  "à la maison": "maison",
  "temps libre": "maison",
  ennui: "maison",
  "l'enfant s'ennuie": "maison",
  "l enfant s ennuie": "maison",
  "en autonomie": "maison",
  autonomie: "maison",
  "conseil de famille": "maison",
  "fin de semaine": "maison",
  fete: "maison",
  "soins du quotidien": "maison",

  // Vacances
  vacances: "vacances",
  "en vacances": "vacances",

  // Pluie
  pluie: "pluie",
  "jour de pluie": "pluie",

  // Après l’école
  ecole: "ecole",
  école: "ecole",
  "apres ecole": "ecole",
  "apres l'ecole": "ecole",
  "apres l ecole": "ecole",
  "apres l'ecole": "ecole",
  "apres l’école": "ecole",
  "après école": "ecole",
  "après l’école": "ecole",
  "après l'ecole": "ecole",
  "après l'école": "ecole",
  "apres la classe": "ecole",
  "apres l'ecole": "ecole",
  "sortie d'ecole": "ecole",
  "sortie de l'ecole": "ecole",

  // Poussette
  poussette: "poussette",
  "en poussette": "poussette",

  // Parent fatigué
  fatigue: "fatigue",
  "parent fatigue": "fatigue",
  "parent fatigué": "fatigue",
  "parents fatigues": "fatigue",
  "parents fatigués": "fatigue",
  "apres une crise": "fatigue",
  "avant un repas calme": "fatigue",

  // Attente
  attente: "attente",
  "salle d'attente": "attente",
  "salle d’attente": "attente",
  "salle d'attente longue": "attente",
  "salle d’attente longue": "attente",
};

function normalizeMomentId(value) {
  if (!value) return null;

  const raw = String(value).trim();

  // Si c'est déjà un id officiel exact : on garde.
  if (OFFICIAL_MOMENT_IDS.includes(raw)) {
    return raw;
  }

  const normalized = normalizeText(raw);

  // Si après nettoyage c'est un id officiel : on garde.
  if (OFFICIAL_MOMENT_IDS.includes(normalized)) {
    return normalized;
  }

  // Sinon on passe par les alias.
  return SITUATION_TO_MOMENT_ID[normalized] || null;
}

function normalizeMomentIds(momentIds) {
  const source = Array.isArray(momentIds) ? momentIds : [];

  const normalized = source
    .map(normalizeMomentId)
    .filter(Boolean)
    .filter((id) => OFFICIAL_MOMENT_IDS.includes(id));

  return Array.from(new Set(normalized));
}

function getAgeBucketsFromRange(minAge, maxAge) {
  return OFFICIAL_AGE_RANGES.filter((range) => {
    return Number(minAge) <= range.max && Number(maxAge) >= range.min;
  }).map((range) => range.id);
}

function getPrimaryAgeLabel(ageBuckets) {
  const firstBucket = OFFICIAL_AGE_RANGES.find((range) =>
    ageBuckets.includes(range.id)
  );

  return firstBucket ? firstBucket.label : "Âge à préciser";
}

export function normalizeActivity(activity) {
  const minAge = Number(activity.minAge ?? 0);
  const maxAge = Number(activity.maxAge ?? minAge);
  const ageBuckets = getAgeBucketsFromRange(minAge, maxAge);
  const momentIds = normalizeMomentIds(activity.momentIds);

  return {
    ...activity,

    // On garde l’âge d’origine pour mémoire.
    originalAgeLabel: activity.ageLabel,

    // Tranches officielles utilisées par l’app.
    ageBuckets,

    // Affichage propre si on a besoin d’un âge par défaut.
    ageLabel: getPrimaryAgeLabel(ageBuckets),

    // Moments nettoyés avec uniquement les ids de l’app.
    momentIds,

    // Durée sécurisée en nombre.
    t: Number(activity.t),
    timeLabel: activity.timeLabel || `${Number(activity.t)} min`,
  };
}

export const NORMALIZED_ACTIVITIES = ALL_ACTIVITIES.map(normalizeActivity);