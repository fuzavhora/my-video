import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface FeatureBadgeProps {
  icon: string;
  title: string;
  subtitle: string;
  delay?: number;
  position?: "left" | "right";
  top?: number;
}

export const FeatureBadge: React.FC<FeatureBadgeProps> = ({
  icon,
  title,
  subtitle,
  delay = 10,
  position = "right",
  top = 180,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);
  const pop = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const opacity = interpolate(adjustedFrame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateX = interpolate(
    pop,
    [0, 1],
    [position === "right" ? 50 : -50, 0]
  );

  return (
    <div
      style={{
        position: "absolute",
        top,
        [position]: 60,
        opacity,
        transform: `translateX(${translateX}px) scale(${pop})`,
        zIndex: 10,
        background: "rgba(15, 23, 42, 0.88)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.16)",
        borderRadius: 16,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.2)",
        maxWidth: 340,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            color: "#f8fafc",
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "#94a3b8",
            fontSize: 13,
            marginTop: 2,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};
