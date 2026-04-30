export const theme = {
  app: {
    maxWidth: 430,
    background: "#FFF7EC",
    backgroundAlt: "#FFF1E3",
  },

  fonts: {
    title: "'Sora', sans-serif",
    body: "'Nunito', sans-serif",
  },

  colors: {
    // Base
    cream: "#FFF7EC",
    cream2: "#FFF1E3",
    cream3: "#FFE8D2",
    white: "#FFFFFF",

    // Texte
    ink: "#172033",
    ink2: "#25324A",
    text: "#2D3142",
    muted: "#817A71",
    softText: "#A49B91",

    // Couleurs principales — plus pop / premium
    orange: "#FF7A2F",
    orangeDeep: "#F25C1D",
    orangeSoft: "#FFE3D0",

    coral: "#FF4F78",
    coralDeep: "#E93663",
    coralSoft: "#FFE0E8",

    yellow: "#FFC83D",
    yellowDeep: "#F5A900",
    yellowSoft: "#FFF1BC",

    green: "#38C976",
    greenDeep: "#13A65A",
    greenSoft: "#DDF9E9",

    teal: "#18C7B7",
    tealDeep: "#0FA899",
    tealSoft: "#DDF8F5",

    blue: "#4D8DFF",
    blueDeep: "#2563EB",
    blueSoft: "#E1ECFF",

    violet: "#8B5CFF",
    violetDeep: "#6D3DF2",
    violetSoft: "#EEE6FF",

    red: "#FF3B4F",
    redSoft: "#FFE0E5",

    border: "rgba(23, 32, 51, 0.08)",
    borderStrong: "rgba(23, 32, 51, 0.14)",

    shadow: "rgba(23, 32, 51, 0.12)",
  },

  gradients: {
    appBackground:
      "radial-gradient(circle at 20% 0%, rgba(255, 200, 61, 0.28) 0%, rgba(255, 247, 236, 0) 30%), radial-gradient(circle at 95% 12%, rgba(255, 79, 120, 0.18) 0%, rgba(255, 247, 236, 0) 28%), linear-gradient(180deg, #FFF7EC 0%, #FFF1E3 100%)",

    hero:
      "linear-gradient(135deg, #FF7A2F 0%, #FF9A3D 48%, #FFC83D 100%)",

    heroSoft:
      "radial-gradient(circle at 75% 20%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 38%), linear-gradient(135deg, #FF7A2F 0%, #FF9A3D 50%, #FFC83D 100%)",

    screenFree:
      "linear-gradient(135deg, #38C976 0%, #18C7B7 100%)",

    cure:
      "linear-gradient(135deg, #FF4F78 0%, #8B5CFF 100%)",

    activity:
      "linear-gradient(135deg, #FF7A2F 0%, #FF4F78 100%)",

    reward:
      "linear-gradient(135deg, #FFC83D 0%, #FF9A3D 100%)",

    calm:
      "linear-gradient(135deg, #4D8DFF 0%, #18C7B7 100%)",

    cardOrange:
      "linear-gradient(180deg, #FFF4EC 0%, #FFE1CC 100%)",

    cardGreen:
      "linear-gradient(180deg, #EEFFF5 0%, #D7F8E6 100%)",

    cardPink:
      "linear-gradient(180deg, #FFF0F5 0%, #FFE0E9 100%)",

    cardYellow:
      "linear-gradient(180deg, #FFF8DE 0%, #FFECA8 100%)",

    cardBlue:
      "linear-gradient(180deg, #EDF4FF 0%, #DCEAFF 100%)",

    glass:
      "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.76) 100%)",
  },

  radius: {
    xs: 10,
    sm: 14,
    md: 18,
    lg: 24,
    xl: 30,
    xxl: 36,
    pill: 999,
  },

  shadow: {
    xs: "0 4px 10px rgba(23, 32, 51, 0.06)",
    sm: "0 8px 20px rgba(23, 32, 51, 0.08)",
    md: "0 14px 34px rgba(23, 32, 51, 0.11)",
    lg: "0 22px 55px rgba(23, 32, 51, 0.14)",

    orange: "0 18px 42px rgba(255, 122, 47, 0.28)",
    coral: "0 18px 42px rgba(255, 79, 120, 0.25)",
    green: "0 18px 42px rgba(56, 201, 118, 0.23)",
    yellow: "0 18px 42px rgba(255, 200, 61, 0.25)",
    blue: "0 18px 42px rgba(77, 141, 255, 0.22)",

    insetLight: "inset 0 1px 0 rgba(255,255,255,0.75)",
    buttonPressed: "inset 0 4px 10px rgba(0,0,0,0.14)",
  },

  spacing: {
    pageX: 18,
    pageTop: 18,
    bottomNavHeight: 92,
  },

  motion: {
    fast: "160ms ease",
    normal: "260ms ease",
    slow: "460ms cubic-bezier(.2,.8,.2,1)",
    spring: "420ms cubic-bezier(.2, 1.4, .3, 1)",
  },

  blur: {
    glass: "blur(18px)",
  },

  z: {
    nav: 50,
    modal: 100,
    toast: 150,
  },
};

export const screenFreeLevels = [
  {
    id: "seed",
    name: "Graine",
    emoji: "🌱",
    min: 0,
    color: theme.colors.green,
    deep: theme.colors.greenDeep,
    gradient: "linear-gradient(135deg, #A8F5C8 0%, #38C976 100%)",
    message: "Chaque minute compte.",
  },
  {
    id: "sprout",
    name: "Pousse",
    emoji: "🌿",
    min: 30,
    color: theme.colors.teal,
    deep: theme.colors.tealDeep,
    gradient: "linear-gradient(135deg, #9DF7EC 0%, #18C7B7 100%)",
    message: "La routine commence à prendre.",
  },
  {
    id: "plant",
    name: "Plante",
    emoji: "🪴",
    min: 90,
    color: theme.colors.blue,
    deep: theme.colors.blueDeep,
    gradient: "linear-gradient(135deg, #AFCBFF 0%, #4D8DFF 100%)",
    message: "Belle progression aujourd’hui.",
  },
  {
    id: "tree",
    name: "Arbre",
    emoji: "🌳",
    min: 180,
    color: theme.colors.violet,
    deep: theme.colors.violetDeep,
    gradient: "linear-gradient(135deg, #BFA8FF 0%, #8B5CFF 100%)",
    message: "La famille reprend de l’espace.",
  },
  {
    id: "forest",
    name: "Forêt",
    emoji: "🌲",
    min: 360,
    color: theme.colors.orange,
    deep: theme.colors.orangeDeep,
    gradient: "linear-gradient(135deg, #FFC83D 0%, #FF7A2F 100%)",
    message: "Journée exceptionnelle.",
  },
];

export function getScreenFreeLevel(minutes = 0) {
  const safeMinutes = Math.max(0, Number(minutes) || 0);

  let current = screenFreeLevels[0];

  for (const level of screenFreeLevels) {
    if (safeMinutes >= level.min) {
      current = level;
    }
  }

  const currentIndex = screenFreeLevels.findIndex(
    (level) => level.id === current.id
  );

  const next = screenFreeLevels[currentIndex + 1];

  if (!next) {
    return {
      ...current,
      progress: 100,
      remaining: 0,
      nextName: "Niveau maximum",
      nextMin: current.min,
    };
  }

  const progress = Math.round(
    ((safeMinutes - current.min) / (next.min - current.min)) * 100
  );

  return {
    ...current,
    progress: Math.max(0, Math.min(100, progress)),
    remaining: Math.max(0, next.min - safeMinutes),
    nextName: next.name,
    nextMin: next.min,
  };
}

export const statThemes = {
  screenFree: {
    emoji: "🌱",
    label: "Temps sans écran",
    gradient: theme.gradients.cardGreen,
    accent: theme.colors.greenDeep,
    soft: theme.colors.greenSoft,
    shadow: theme.shadow.green,
  },
  sessions: {
    emoji: "⚡",
    label: "Séances",
    gradient: theme.gradients.cardPink,
    accent: theme.colors.coralDeep,
    soft: theme.colors.coralSoft,
    shadow: theme.shadow.coral,
  },
  badges: {
    emoji: "🏆",
    label: "Badges",
    gradient: theme.gradients.cardYellow,
    accent: theme.colors.yellowDeep,
    soft: theme.colors.yellowSoft,
    shadow: theme.shadow.yellow,
  },
};

export const navItems = [
  {
    id: "home",
    label: "Accueil",
    icon: "🏠",
    activeGradient: theme.gradients.activity,
  },
  {
    id: "activities",
    label: "Activités",
    icon: "⚡",
    activeGradient: theme.gradients.screenFree,
  },
  {
    id: "cure",
    label: "Cure",
    icon: "🌿",
    activeGradient: theme.gradients.cure,
  },
  {
    id: "parents",
    label: "Parents",
    icon: "💬",
    activeGradient: theme.gradients.calm,
  },
];

export const buttonStyles = {
  primary: {
    background: theme.gradients.activity,
    color: theme.colors.white,
    boxShadow: theme.shadow.orange,
  },
  green: {
    background: theme.gradients.screenFree,
    color: theme.colors.white,
    boxShadow: theme.shadow.green,
  },
  cure: {
    background: theme.gradients.cure,
    color: theme.colors.white,
    boxShadow: theme.shadow.coral,
  },
  reward: {
    background: theme.gradients.reward,
    color: theme.colors.ink,
    boxShadow: theme.shadow.yellow,
  },
  white: {
    background: theme.colors.white,
    color: theme.colors.ink,
    boxShadow: theme.shadow.md,
  },
};