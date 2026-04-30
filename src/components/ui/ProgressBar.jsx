import React from "react";
import { theme } from "../../styles/theme";

export default function ProgressBar({
  value = 0,
  color = theme.colors.teal,
  height = 10,
  background = "rgba(19,43,69,0.08)",
  style = {},
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div
      style={{
        width: "100%",
        height,
        background,
        borderRadius: theme.radius.pill,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          width: `${safeValue}%`,
          height: "100%",
          borderRadius: theme.radius.pill,
          background: color,
          transition: "width 400ms ease",
        }}
      />
    </div>
  );
}