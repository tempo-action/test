import React from "react";
import { theme } from "../../styles/theme";

export default function Card({
  children,
  onClick,
  variant = "default",
  style = {},
  className = "",
}) {
  const variants = {
    default: {
      background: theme.colors.white,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: theme.shadow.card,
    },
    soft: {
      background: "rgba(255,255,255,0.78)",
      border: `1px solid ${theme.colors.border}`,
      boxShadow: theme.shadow.soft,
    },
    teal: {
      background: theme.colors.tealSoft,
      border: `1px solid rgba(24,183,165,0.22)`,
      boxShadow: theme.shadow.soft,
    },
    orange: {
      background: theme.colors.orangeSoft,
      border: `1px solid rgba(255,122,47,0.22)`,
      boxShadow: theme.shadow.soft,
    },
    coral: {
      background: theme.colors.coralSoft,
      border: `1px solid rgba(240,82,110,0.22)`,
      boxShadow: theme.shadow.soft,
    },
    green: {
      background: theme.colors.greenSoft,
      border: `1px solid rgba(76,175,106,0.22)`,
      boxShadow: theme.shadow.soft,
    },
  };

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        borderRadius: theme.radius.xl,
        padding: 18,
        cursor: onClick ? "pointer" : "default",
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </div>
  );
}