import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const InteractiveSpotlight: React.FC<{
  x: number;
  y: number;
  radius?: number;
  triggerFrame: number;
  label?: string;
}> = ({ x, y, radius = 90, triggerFrame, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < triggerFrame || frame > triggerFrame + 60) return null;

  const adjusted = frame - triggerFrame;
  const pulse = spring({
    frame: adjusted,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  const ringScale = interpolate(adjusted, [0, 50], [0.8, 1.6]);
  const ringOpacity = interpolate(adjusted, [0, 15, 50], [0, 0.8, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      {/* Outer Pulse Ring */}
      <div
        style={{
          width: radius * 2,
          height: radius * 2,
          borderRadius: "50%",
          border: "2px solid #38bdf8",
          boxShadow: "0 0 30px rgba(56, 189, 248, 0.6)",
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />

      {/* Target Focus Ring */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${pulse})`,
          width: radius * 1.3,
          height: radius * 1.3,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)",
          border: "2px dashed #38bdf8",
        }}
      />

      {/* Guidance Callout Tag */}
      {label && (
        <div
          style={{
            position: "absolute",
            top: radius + 14,
            left: "50%",
            transform: `translateX(-50%) scale(${pulse})`,
            padding: "6px 16px",
            background: "linear-gradient(135deg, #0284c7 0%, #6366f1 100%)",
            color: "#ffffff",
            fontSize: 13,
            fontWeight: 800,
            borderRadius: 999,
            fontFamily: "system-ui, sans-serif",
            whiteSpace: "nowrap",
            boxShadow: "0 8px 25px rgba(2, 132, 199, 0.5)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>🎯</span>
          <span>{label}</span>
        </div>
      )}
    </div>
  );
};
