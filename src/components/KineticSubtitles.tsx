import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface SubtitleCue {
  startFrame: number;
  endFrame: number;
  text: string;
  highlightWord?: string;
}

const CUES: SubtitleCue[] = [
  {
    startFrame: 0,
    endFrame: 75,
    text: "Stylish Creation keeps boutique rentals beautifully organised.",
    highlightWord: "beautifully organised",
  },
  {
    startFrame: 75,
    endFrame: 155,
    text: "Orders, customers, cash flow, and returns—in one clear view.",
    highlightWord: "one clear view",
  },
  {
    startFrame: 155,
    endFrame: 260,
    text: "Know exactly which garment is ready for its next moment.",
    highlightWord: "ready",
  },
  {
    startFrame: 260,
    endFrame: 360,
    text: "Turn each booking into a confident, repeatable workflow.",
    highlightWord: "confident",
  },
  {
    startFrame: 360,
    endFrame: 450,
    text: "Manage your studio with less chasing and more control.",
    highlightWord: "more control",
  },
  {
    startFrame: 450,
    endFrame: 540,
    text: "Stylish Creation—made for Sherwani and ethnic wear rentals.",
    highlightWord: "Stylish Creation",
  },
];

export const KineticSubtitles: React.FC = () => {
  const frame = useCurrentFrame();

  const activeCue = CUES.find((c) => frame >= c.startFrame && frame < c.endFrame);
  if (!activeCue) return null;

  const progress = frame - activeCue.startFrame;
  const opacity = interpolate(progress, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const translateY = interpolate(progress, [0, 8], [10, 0], { extrapolateRight: "clamp" });

  const parts = activeCue.highlightWord
    ? activeCue.text.split(activeCue.highlightWord)
    : [activeCue.text];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 50,
        left: "50%",
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        zIndex: 60,
        pointerEvents: "none",
        textAlign: "center",
        maxWidth: 1200,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 36px",
          background: "rgba(10, 15, 30, 0.92)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(56, 189, 248, 0.35)",
          borderRadius: 999,
          boxShadow: "0 15px 45px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.25)",
          color: "#ffffff",
          fontSize: 22,
          fontWeight: 700,
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: "-0.2px",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#38bdf8",
            boxShadow: "0 0 10px #38bdf8",
            flexShrink: 0,
          }}
        />
        <span>
          {parts[0]}
          {activeCue.highlightWord && (
            <span
              style={{
                background: "linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
                padding: "0 4px",
              }}
            >
              {activeCue.highlightWord}
            </span>
          )}
          {parts[1] || ""}
        </span>
      </div>
    </div>
  );
};
