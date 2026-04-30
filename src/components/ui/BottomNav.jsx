import React from "react";
import { navItems, theme } from "../../styles/theme";

export default function BottomNav({ active = "home", onChange }) {
  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) => item.id === active)
  );

  return (
    <div style={styles.safeArea}>
      <nav style={styles.nav}>
        <div
          style={{
            ...styles.activePill,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        {navItems.map((item) => {
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChange?.(item.id)}
              className="premium-pressable"
              style={styles.item}
            >
              <span
                style={{
                  ...styles.iconBubble,
                  ...(isActive
                    ? {
                        background: item.activeGradient,
                        boxShadow:
                          "0 12px 26px rgba(23, 32, 51, 0.20), inset 0 1px 0 rgba(255,255,255,0.45)",
                        transform: "translateY(-7px) scale(1.08)",
                      }
                    : {}),
                }}
              >
                <span
                  style={{
                    ...styles.icon,
                    transform: isActive ? "scale(1.08)" : "scale(1)",
                    filter: isActive
                      ? "drop-shadow(0 2px 4px rgba(0,0,0,0.18))"
                      : "none",
                  }}
                >
                  {item.icon}
                </span>
              </span>

              <span
                style={{
                  ...styles.label,
                  color: isActive ? theme.colors.ink : theme.colors.softText,
                  opacity: isActive ? 1 : 0.78,
                  fontWeight: isActive ? 950 : 850,
                  transform: isActive ? "translateY(-1px)" : "translateY(0)",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

const styles = {
  safeArea: {
    position: "fixed",
    left: "50%",
    bottom: 14,
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: theme.app.maxWidth,
    padding: "0 14px",
    zIndex: theme.z.nav,
    pointerEvents: "none",
  },

  nav: {
    position: "relative",
    height: 86,
    borderRadius: 32,
    padding: "9px 8px 10px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    overflow: "hidden",
    pointerEvents: "auto",

    background:
      "linear-gradient(180deg, rgba(255,255,255,0.74) 0%, rgba(255,255,255,0.52) 100%)",
    border: "1px solid rgba(255,255,255,0.72)",

    boxShadow:
      "0 24px 60px rgba(23, 32, 51, 0.20), 0 8px 18px rgba(255, 122, 47, 0.08), inset 0 1px 0 rgba(255,255,255,0.90)",

    backdropFilter: "blur(24px) saturate(1.45)",
    WebkitBackdropFilter: "blur(24px) saturate(1.45)",
  },

  activePill: {
    position: "absolute",
    top: 8,
    left: 8,
    width: "calc((100% - 16px) / 4)",
    height: 70,
    borderRadius: 26,

    background:
      "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,247,236,0.72) 100%)",
    boxShadow:
      "0 14px 34px rgba(23, 32, 51, 0.12), inset 0 1px 0 rgba(255,255,255,0.95)",

    transition: "transform 420ms cubic-bezier(.2, 1.2, .25, 1)",
    zIndex: 0,
  },

  item: {
    position: "relative",
    zIndex: 1,
    height: "100%",
    border: "none",
    background: "transparent",
    borderRadius: 26,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    padding: 0,
    cursor: "pointer",
  },

  iconBubble: {
    width: 45,
    height: 36,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0)",
    transition: "420ms cubic-bezier(.2, 1.2, .25, 1)",
  },

  icon: {
    fontSize: 22,
    lineHeight: 1,
    transition: "420ms cubic-bezier(.2, 1.2, .25, 1)",
  },

  label: {
    fontFamily: theme.fonts.body,
    fontSize: 11,
    letterSpacing: 0.05,
    lineHeight: 1.1,
    transition: "360ms cubic-bezier(.2, 1.1, .25, 1)",
  },
};