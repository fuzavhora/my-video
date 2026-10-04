import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { InteractiveCursor, CursorKeyframe } from "./InteractiveCursor";
import { InteractiveSpotlight } from "./InteractiveSpotlight";

interface MultiDeviceStageProps {
  desktopImage: string;
  mobileImage?: string;
  urlLabel: string;
  cursorKeyframes?: CursorKeyframe[];
  spotlight?: {
    x: number;
    y: number;
    triggerFrame: number;
    label?: string;
  };
}

export const MultiDeviceStage: React.FC<MultiDeviceStageProps> = ({
  desktopImage,
  mobileImage,
  urlLabel,
  cursorKeyframes = [],
  spotlight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enter = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const translateY = interpolate(enter, [0, 1], [50, 0]);
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // Gentle 3D perspective breathing motion
  const rotY = Math.sin(frame / 40) * 2 - 2;
  const rotX = Math.cos(frame / 45) * 1.5;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
        transform: `translateY(${translateY}px)`,
        opacity,
        perspective: 1400,
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* 1. Desktop Browser Frame */}
      <div
        style={{
          width: 1040,
          height: 610,
          borderRadius: 20,
          background: "#090d16",
          border: "1px solid rgba(255, 255, 255, 0.16)",
          boxShadow: "0 35px 90px -15px rgba(0, 0, 0, 0.85), 0 0 50px rgba(99, 102, 241, 0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`,
          transformOrigin: "center center",
        }}
      >
        {/* Top Window Bar */}
        <div
          style={{
            height: 44,
            background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", gap: 7 }}>
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#f59e0b" }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#10b981" }} />
          </div>

          <div
            style={{
              margin: "0 auto",
              padding: "4px 30px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: 6,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#94a3b8",
              fontSize: 12,
              fontFamily: "system-ui, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ color: "#10b981" }}>🔒</span>
            <span>{urlLabel}</span>
          </div>
        </div>

        {/* Viewport with Screenshot */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#020617" }}>
          <Img
            src={staticFile(desktopImage)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top left",
            }}
          />

          {/* Interactive Spotlight on target feature */}
          {spotlight && (
            <InteractiveSpotlight
              x={spotlight.x}
              y={spotlight.y}
              triggerFrame={spotlight.triggerFrame}
              label={spotlight.label}
            />
          )}

          {/* Interactive Cursor with live guidance */}
          {cursorKeyframes.length > 0 && <InteractiveCursor keyframes={cursorKeyframes} />}
        </div>
      </div>

      {/* 2. Floating Mobile iPhone Companion Frame (if provided) */}
      {mobileImage && (
        <div
          style={{
            width: 250,
            height: 520,
            borderRadius: 38,
            background: "#0f172a",
            border: "3px solid rgba(255, 255, 255, 0.22)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(56, 189, 248, 0.25)",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            transform: `translateY(${Math.sin((frame + 15) / 25) * 8}px) rotateY(${rotY + 6}deg)`,
            flexShrink: 0,
          }}
        >
          {/* Dynamic Island / Notch */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 80,
              height: 20,
              borderRadius: 20,
              background: "#000000",
              zIndex: 30,
            }}
          />

          {/* Mobile Screen Img */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <Img
              src={staticFile(mobileImage)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
              }}
            />
          </div>

          {/* Floating Pill Tag */}
          <div
            style={{
              position: "absolute",
              bottom: 14,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(15, 23, 42, 0.9)",
              border: "1px solid rgba(56, 189, 248, 0.5)",
              color: "#38bdf8",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 999,
              whiteSpace: "nowrap",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            📱 Mobile Responsive
          </div>
        </div>
      )}
    </div>
  );
};
