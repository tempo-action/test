import React, { useEffect, useMemo, useState } from "react";
import hero from "../../assets/hero.png";
import { getScreenFreeLevel, theme } from "../../styles/theme.js";

export default function HomeHero({ minutesNoScreen = 42 }) {
  const level = useMemo(
    () => getScreenFreeLevel(minutesNoScreen),
    [minutesNoScreen]
  );

  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    setAnimatedProgress(0);

    const timeout = setTimeout(() => {
      setAnimatedProgress(level.progress);
    }, 550);

    return () => clearTimeout(timeout);
  }, [level.progress]);

  return (
    <section style={styles.wrapper}>
      <div className="home-hero-card premium-card-shine" style={styles.heroCard}>
        <div style={styles.copy}>
          <div style={styles.kicker}>Temps sans écran</div>

          <h2 style={styles.title}>Aujourd’hui, Tempo grandit avec vous.</h2>

          <p style={styles.subtitle}>
            Chaque activité lancée ajoute du temps sans écran et fait évoluer
            votre niveau.
          </p>
        </div>

        <div style={styles.heroWrap}>
          <img src={hero} alt="Famille Tempo" style={styles.heroImage} />
        </div>
      </div>

      <div style={styles.progressPanel}>
        <div style={styles.ringWrap}>
          <ScreenFreeRing progress={animatedProgress} />

          <div style={styles.ringCenter}>
            <div style={styles.levelEmoji}>{level.emoji}</div>
            <AnimatedNumber value={minutesNoScreen} />
            <div style={styles.minutesLabel}>min</div>
          </div>
        </div>

        <div style={styles.levelContent}>
          <div style={styles.levelBadge}>
            <span style={styles.levelDot} />
            Niveau {level.name}
          </div>

          <h3 style={styles.levelTitle}>{level.message}</h3>

          <div style={styles.nextLine}>
            Encore <strong>{level.remaining} min</strong> pour atteindre{" "}
            <strong>{level.nextName}</strong>.
          </div>

          <div style={styles.levelScaleCard}>
            <div style={styles.scaleItem}>
              <span>🌱</span>
              <strong>Graine</strong>
            </div>
            <div style={styles.scaleArrow}>→</div>
            <div style={styles.scaleItem}>
              <span>🌿</span>
              <strong>Pousse</strong>
            </div>
            <div style={styles.scaleArrow}>→</div>
            <div style={styles.scaleItem}>
              <span>🌳</span>
              <strong>Arbre</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame;
    const duration = 1900;
    const delay = 350;
    const start = performance.now() + delay;

    const easeOutExpo = (t) => {
      if (t === 1) return 1;
      return 1 - Math.pow(2, -10 * t);
    };

    const animate = (now) => {
      if (now < start) {
        frame = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(1, (now - start) / duration);
      const eased = easeOutExpo(progress);

      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <div style={styles.minutes}>{displayValue}</div>;
}

function ScreenFreeRing({ progress = 0 }) {
  const size = 138;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeProgress = Math.max(0, Math.min(100, progress));
  const dash = circumference - (safeProgress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={styles.ringSvg}
    >
      <defs>
        <linearGradient
          id="screenFreeGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={theme.colors.green} />
          <stop offset="48%" stopColor={theme.colors.teal} />
          <stop offset="100%" stopColor={theme.colors.yellow} />
        </linearGradient>

        <filter id="ringGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(23,32,51,0.08)"
        strokeWidth={stroke}
        fill="none"
      />

      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#screenFreeGradient)"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dash}
        filter="url(#ringGlow)"
        style={{
          transition:
            "stroke-dashoffset 2200ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </svg>
  );
}

const styles = {
  wrapper: {
    marginBottom: 18,
  },

  heroCard: {
    marginBottom: 14,
    minHeight: 246,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    alignItems: "center",
    gap: 4,
  },

  copy: {
    position: "relative",
    zIndex: 3,
    minWidth: 0,
  },

  kicker: {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.28)",
    color: "#FFFFFF",
    fontFamily: theme.fonts.body,
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    fontSize: 11,
    marginBottom: 12,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.34)",
  },

  title: {
    margin: 0,
    fontFamily: theme.fonts.title,
    fontWeight: 900,
    fontSize: 30,
    lineHeight: 1.02,
    letterSpacing: -1.1,
    color: "#FFFFFF",
    textShadow: "0 3px 14px rgba(91, 39, 12, 0.16)",
  },

  subtitle: {
    margin: "10px 0 0",
    color: "rgba(255,255,255,0.92)",
    fontFamily: theme.fonts.body,
    fontWeight: 850,
    fontSize: 14,
    lineHeight: 1.35,
  },

  heroWrap: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    height: "100%",
    minWidth: 0,
  },

  heroImage: {
    width: "150%",
    maxWidth: 270,
    height: 230,
    objectFit: "contain",
    objectPosition: "center bottom",
    display: "block",
    transform: "translate(12px, 16px)",
    filter: "drop-shadow(0 18px 18px rgba(122, 52, 14, 0.18))",
  },

  progressPanel: {
    borderRadius: 32,
    padding: 16,
    display: "flex",
    alignItems: "center",
    gap: 16,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.84) 100%)",
    border: "1px solid rgba(255,255,255,0.76)",
    boxShadow:
      "0 18px 42px rgba(23, 32, 51, 0.12), inset 0 1px 0 rgba(255,255,255,0.95)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
  },

  ringWrap: {
    width: 138,
    height: 138,
    position: "relative",
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    background:
      "radial-gradient(circle at 35% 20%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.62) 46%, rgba(255,255,255,0.32) 100%)",
    boxShadow:
      "0 15px 32px rgba(23, 32, 51, 0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
  },

  ringSvg: {
    position: "absolute",
    inset: 0,
    transform: "rotate(-90deg)",
  },

  ringCenter: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    color: theme.colors.ink,
  },

  levelEmoji: {
    fontSize: 28,
    lineHeight: 1,
    marginBottom: 3,
  },

  minutes: {
    fontFamily: theme.fonts.title,
    fontSize: 30,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: -1,
  },

  minutesLabel: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: 950,
    color: theme.colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  levelContent: {
    flex: 1,
    minWidth: 0,
  },

  levelBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "7px 10px",
    borderRadius: 999,
    background: theme.colors.greenSoft,
    color: theme.colors.greenDeep,
    fontWeight: 950,
    fontSize: 12,
    marginBottom: 9,
  },

  levelDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: theme.colors.green,
    boxShadow: "0 0 0 5px rgba(56,201,118,0.14)",
  },

  levelTitle: {
    margin: 0,
    fontFamily: theme.fonts.title,
    fontSize: 20,
    lineHeight: 1.08,
    color: theme.colors.ink,
    letterSpacing: -0.5,
  },

  nextLine: {
    marginTop: 7,
    color: theme.colors.muted,
    fontWeight: 850,
    fontSize: 13,
    lineHeight: 1.25,
  },

  levelScaleCard: {
    marginTop: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    padding: "10px 11px",
    borderRadius: 20,
    background:
      "linear-gradient(180deg, rgba(255,247,236,0.92) 0%, rgba(255,241,227,0.72) 100%)",
    border: "1px solid rgba(23,32,51,0.06)",
  },

  scaleItem: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    color: theme.colors.ink,
    fontSize: 10,
    lineHeight: 1.1,
    textAlign: "center",
  },

  scaleArrow: {
    color: theme.colors.softText,
    fontWeight: 900,
    fontSize: 12,
    transform: "translateY(-1px)",
  },
};