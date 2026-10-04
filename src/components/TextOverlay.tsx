import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface TextOverlayProps {
  category: string;
  headline: string;
  highlightText?: string;
  subtitle?: string;
  delay?: number;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({
  category,
  headline,
  highlightText,
  subtitle,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  const opacity = interpolate(adjustedFrame, [0, 14], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const slideY = interpolate(translateY, [0, 1], [35, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slideY}px)`,
        textAlign: "center",
        marginBottom: 26,
        zIndex: 5,
      }}
    >
      {/* Category Pill */}
      <div
        style={{
          display: "inline-block",
          padding: "6px 18px",
          borderRadius: 999,
          background: "rgba(99, 102, 241, 0.15)",
          border: "1px solid rgba(129, 140, 248, 0.35)",
          color: "#a5b4fc",
          fontSize: 14,
          letterSpacing: 2,
          fontWeight: 700,
          textTransform: "uppercase",
          fontFamily: "system-ui, -apple-system, sans-serif",
          marginBottom: 12,
        }}
      >
        {category}
      </div>

      {/* Main Title with Gradient Glow */}
      <h1
        style={{
          color: "#ffffff",
          fontSize: 48,
          fontWeight: 800,
          letterSpacing: "-0.5px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          margin: 0,
          lineHeight: 1.2,
          textShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        {headline}{" "}
        {highlightText && (
          <span
            style={{
              background: "linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {highlightText}
          </span>
        )}
      </h1>

      {subtitle && (
        <p
          style={{
            color: "#94a3b8",
            fontSize: 20,
            marginTop: 10,
            marginBottom: 0,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
