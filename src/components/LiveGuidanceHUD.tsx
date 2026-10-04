import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface StepItem {
  id: number;
  label: string;
}

const STEPS: StepItem[] = [
  { id: 1, label: "Analytics & SOP" },
  { id: 2, label: "Stock & Date Lock" },
  { id: 3, label: "WhatsApp Invoice" },
  { id: 4, label: "Mobile Handover" },
];

export const LiveGuidanceHUD: React.FC<{ activeStepIndex: number }> = ({
  activeStepIndex,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Pulsing live recording badge
  const recDotOpacity = interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [0.3, 1]);

  const currentSeconds = Math.floor(frame / fps);
  const totalSeconds = Math.floor(durationInFrames / fps);
  const timeString = `00:${currentSeconds.toString().padStart(2, "0")} / 00:${totalSeconds.toString().padStart(2, "0")}`;

  return (
    <div
      style={{
        position: "absolute",
        top: 24,
        left: 40,
        right: 40,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(10, 15, 30, 0.75)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: 16,
        padding: "10px 24px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Brand & Recording Status */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 10px",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: 999,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ef4444",
              opacity: recDotOpacity,
              boxShadow: "0 0 10px #ef4444",
            }}
          />
          <span
            style={{
              color: "#f87171",
              fontSize: 11,
              fontWeight: 800,
              fontFamily: "system-ui, sans-serif",
              letterSpacing: 1.5,
            }}
          >
            INTERACTIVE GUIDE
          </span>
        </div>

        <div style={{ color: "#ffffff", fontSize: 15, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>
          Alangkart Creation ERP <span style={{ color: "#64748b", fontWeight: 400 }}>| Guided Walkthrough</span>
        </div>
      </div>

      {/* 4-Step Interactive Breadcrumbs */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {STEPS.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isDone = idx < activeStepIndex;

          return (
            <div
              key={step.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 8,
                background: isActive
                  ? "rgba(56, 189, 248, 0.2)"
                  : isDone
                  ? "rgba(34, 197, 94, 0.15)"
                  : "rgba(255, 255, 255, 0.04)",
                border: isActive
                  ? "1px solid #38bdf8"
                  : isDone
                  ? "1px solid rgba(34, 197, 94, 0.4)"
                  : "1px solid rgba(255, 255, 255, 0.08)",
                color: isActive ? "#38bdf8" : isDone ? "#4ade80" : "#64748b",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "system-ui, sans-serif",
                transition: "all 0.3s ease",
              }}
            >
              <span>{isDone ? "✓" : step.id}</span>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Frame Timer */}
      <div
        style={{
          color: "#94a3b8",
          fontSize: 13,
          fontFamily: "monospace",
          fontWeight: 600,
          background: "rgba(0, 0, 0, 0.3)",
          padding: "4px 12px",
          borderRadius: 6,
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        {timeString}
      </div>
    </div>
  );
};
