import { assets } from "../assets/assets.js";

export const MOMENTS = [
  {
    id: "repas",
    label: "Au repas",
    image: assets.moments.auRepas,
    hint: "Remplacer le réflexe écran à table.",
    imagePosition: "center center",
    imageScale: 1.04,
  },
  {
    id: "parc",
    label: "Au parc",
    image: assets.moments.auParc,
    hint: "Jouer dehors sans téléphone.",
    imagePosition: "center center",
    imageScale: 1.04,
  },
  {
    id: "voiture",
    label: "En voiture",
    image: assets.moments.voiture,
    hint: "Occuper le trajet autrement.",
    imagePosition: "center center",
    imageScale: 1.04,
  },
  {
    id: "transcom",
    label: "Transports",
    image: assets.moments.bus,
    hint: "Bus, train, métro, tram.",
    imagePosition: "center center",
    imageScale: 1.04,
  },
  {
    id: "coucher",
    label: "Coucher",
    image: assets.moments.coucher,
    hint: "Retour au calme avant de dormir.",
    imagePosition: "center center",
    imageScale: 1.04,
  },
  {
    id: "restaurant",
    label: "Restaurant",
    image: assets.moments.restaurant,
    hint: "Patienter sans écran.",
    imagePosition: "center 62%",
    imageScale: 1.16,
  },
  {
    id: "attente",
    label: "Salle d’attente",
    image: assets.moments.salleAttente,
    hint: "Occuper les temps morts.",
    imagePosition: "center center",
    imageScale: 1.04,
  },
  {
    id: "vacances",
    label: "Vacances",
    image: assets.moments.vacances,
    hint: "Créer des souvenirs sans écran.",
    imagePosition: "center center",
    imageScale: 1.04,
  },
  {
    id: "ecole",
    label: "Après l’école",
    image: assets.moments.apresEcole,
    hint: "Décompresser autrement.",
    imagePosition: "center center",
    imageScale: 1.04,
  },
  {
    id: "poussette",
    label: "Poussette",
    image: assets.moments.poussette,
    hint: "Stimuler en douceur.",
    imagePosition: "center center",
    imageScale: 1.04,
  },
  {
    id: "fatigue",
    label: "Parent fatigué",
    image: assets.moments.fatigues,
    hint: "Des idées simples quand on n’a plus d’énergie.",
    imagePosition: "center center",
    imageScale: 1.04,
  },
  {
    id: "pluie",
    label: "Jour de pluie",
    image: assets.moments.jourDePluie,
    hint: "S’occuper à l’intérieur.",
    imagePosition: "center 64%",
    imageScale: 1.18,
  },
  {
    id: "maison",
    label: "À la maison",
    image: assets.moments.autonomie,
    hint: "Des activités faciles à lancer.",
    imagePosition: "center center",
    imageScale: 1.04,
  },
  {
    id: "cuisine",
    label: "Cuisine",
    image: assets.moments.ennui,
    hint: "Participer, toucher, sentir, nommer.",
    imagePosition: "center center",
    imageScale: 1.04,
  },
];

export const DURATIONS = [
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 20, label: "20 min" },
  { value: 30, label: "30 min" },
  { value: 60, label: "60 min" },
];

export const CATEGORY_META = {
  lien: {
    id: "lien",
    label: "Lien parent-enfant",
    shortLabel: "Lien",
    color: "#FF4F78",
    bg: "rgba(255, 79, 120, 0.11)",
  },
  langage: {
    id: "langage",
    label: "Langage",
    shortLabel: "Langage",
    color: "#4D8DFF",
    bg: "rgba(77, 141, 255, 0.11)",
  },
  moteur: {
    id: "moteur",
    label: "Motricité",
    shortLabel: "Motricité",
    color: "#38C976",
    bg: "rgba(56, 201, 118, 0.12)",
  },
  cognitif: {
    id: "cognitif",
    label: "Réflexion",
    shortLabel: "Réflexion",
    color: "#FF7A2F",
    bg: "rgba(255, 122, 47, 0.12)",
  },
  sensori: {
    id: "sensori",
    label: "Sensoriel",
    shortLabel: "Sensoriel",
    color: "#18C7B7",
    bg: "rgba(24, 199, 183, 0.12)",
  },
};

export const CATEGORY_ORDER = [
  "lien",
  "langage",
  "moteur",
  "cognitif",
  "sensori",
];

export function getCategoryMeta(categoryId) {
  return (
    CATEGORY_META[categoryId] || {
      id: categoryId || "autre",
      label: "Autres idées",
      shortLabel: "Autre",
      color: "#FF7A2F",
      bg: "rgba(255, 122, 47, 0.12)",
    }
  );
}