import React from "react";
import { theme } from "../../styles/theme";

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  full = false,
  icon = null,
  disabled = false,
  type = "button",
  style = {},
}) {
  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${theme.colors.teal}, #11A493)`,
      color: theme.colors.white,
      boxShadow: "0 12px 28px rgba(24, 183, 165, 0.28)",
    },
    orange: {
      background: `linear-gradient(135deg, ${theme.colors.orange}, #FF9A5F)`,
      color: theme.colors.white,
      boxShadow: theme.shadow.button,
    },
    coral: {
      background: `linear-gradient(135deg, ${theme.colors.coral}, #FF7C8F)`,
      color: theme.colors.white,
      boxShadow: "0 12px 28px rgba(240, 82, 110, 0.25)",
    },
    soft: {
      background: theme.colors.white,
      color: theme.colors.ink,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: theme.shadow.soft,
    },
    ghost: {
      background: "transparent",
      color: theme.colors.ink,
      boxShadow: "none",
    },
  };

  const sizes = {
    sm: {
      minHeight: 42,
      padding: "10px 14px",
      fontSize: 14,
    },
    md: {
      minHeight: 52,
      padding: "14px 18px",
      fontSize: 16,
    },
    lg: {
      minHeight: 60,
      padding: "16px 22px",
      fontSize: 18,
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: full ? "100%" : "auto",
        borderRadius: theme.radius.pill,
        fontFamily: theme.fonts.body,
        fontWeight: 900,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        opacity: disabled ? 0.55 : 1,
        pointerEvents: disabled ? "none" : "auto",
        transition: "transform 160ms ease, opacity 160ms ease",
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}