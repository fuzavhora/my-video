import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface AnnotationProps {
  icon: string;
  badge: string;
  title: string;
  description: string;
  delay?: number;
  position?: "left" | "right";
  y?: number;
}

export const InteractiveAnnotation: React.FC<AnnotationProps> = ({
  icon,
  badge,
  title,
  description,
  delay = 10,
  position = "left",
  y = 320,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjusted = Math.max(0, frame - delay);
  const pop = spring({
    frame: adjusted,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const opacity = interpolate(adjusted, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const translateY = interpolate(pop, [0, 1], [30, 0]);

  // If left, place at 40px; if right, place at 1610px (outside the 1260px MacBook)
  const leftPos = position === "left" ? 40 : 1610;

  return (
    <div
      style={{
        position: "absolute",
        left: leftPos,
        top: y,
        transform: `translateY(${translateY}px) scale(${pop})`,
        opacity,
        zIndex: 45,
        background: "rgba(15, 23, 42, 0.94)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(56, 189, 248, 0.4)",
        borderRadius: 20,
        padding: "20px 22px",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(56, 189, 248, 0.2)",
        width: 270,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            padding: "3px 10px",
            background: "rgba(56, 189, 248, 0.15)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            borderRadius: 999,
            color: "#38bdf8",
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: 1,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {badge}
        </span>
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>

      <div
        style={{
          color: "#ffffff",
          fontSize: 17,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#94a3b8",
          fontSize: 12,
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1.4,
        }}
      >
        {description}
      </div>
    </div>
  );
};
