import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface CursorKeyframe {
  frame: number;
  x: number;
  y: number;
  click?: boolean;
  label?: string;
}

export const InteractiveCursor: React.FC<{
  keyframes: CursorKeyframe[];
}> = ({ keyframes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (keyframes.length === 0) return null;

  // Find surrounding keyframes
  const frames = keyframes.map((k) => k.frame);
  const xValues = keyframes.map((k) => k.x);
  const yValues = keyframes.map((k) => k.y);

  const currentX = interpolate(frame, frames, xValues, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const currentY = interpolate(frame, frames, yValues, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Check if currently clicking (any keyframe with click:true within 15 frames)
  const activeClick = keyframes.find(
    (k) => k.click && frame >= k.frame && frame <= k.frame + 20
  );

  let rippleScale = 0;
  let rippleOpacity = 0;
  if (activeClick) {
    const clickProgress = (frame - activeClick.frame) / 20;
    rippleScale = interpolate(clickProgress, [0, 1], [0.5, 2.5]);
    rippleOpacity = interpolate(clickProgress, [0, 1], [0.9, 0]);
  }

  // Active label
  const activeLabel = keyframes
    .slice()
    .reverse()
    .find((k) => k.label && frame >= k.frame && frame <= k.frame + 45);

  return (
    <div
      style={{
        position: "absolute",
        left: currentX,
        top: currentY,
        pointerEvents: "none",
        zIndex: 100,
        transform: "translate(-4px, -4px)",
      }}
    >
      {/* Click Ripple Wave */}
      {activeClick && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "2px solid #38bdf8",
            background: "rgba(56, 189, 248, 0.35)",
            transform: `translate(-16px, -16px) scale(${rippleScale})`,
            opacity: rippleOpacity,
          }}
        />
      )}

      {/* SVG Modern Cursor */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        style={{
          filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.6))",
        }}
      >
        <path
          d="M5.5 3.2L18.8 11.2C19.8 11.8 19.5 13.3 18.3 13.5L13.1 14.3L9.8 20.4C9.2 21.4 7.7 21.2 7.3 20.1L3.2 4.6C2.9 3.6 4.4 2.5 5.5 3.2Z"
          fill="#38bdf8"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Dynamic Cursor Tooltip / Action Guide */}
      {activeLabel?.label && (
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 14,
            padding: "4px 12px",
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid #38bdf8",
            borderRadius: 8,
            color: "#ffffff",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
            whiteSpace: "nowrap",
            boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#38bdf8" }} />
          {activeLabel.label}
        </div>
      )}
    </div>
  );
};
