import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

interface DeviceMockupProps {
  imageSrc: string;
  urlLabel?: string;
  zoomScale?: number;
}

export const DeviceMockup: React.FC<DeviceMockupProps> = ({
  imageSrc,
  urlLabel = "app.alangkart.com/dashboard",
  zoomScale = 1.05,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 85 },
  });

  const scale = interpolate(enterProgress, [0, 1], [0.88, 1]);
  const translateY = interpolate(enterProgress, [0, 1], [60, 0]);
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Subtle continuous slow zoom for cinematic effect
  const slowZoom = interpolate(frame, [0, 150], [1, zoomScale], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Ambient Radial Backlight */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translate(-50%, -10%)",
          width: 900,
          height: 520,
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, rgba(56, 189, 248, 0.12) 45%, transparent 75%)",
          filter: "blur(50px)",
          zIndex: 0,
        }}
      />

      {/* Modern Desktop Window Mockup */}
      <div
        style={{
          width: 960,
          height: 560,
          borderRadius: 18,
          background: "#0f172a",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 30px 80px -15px rgba(0, 0, 0, 0.8), 0 0 50px rgba(99, 102, 241, 0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Browser Top Window Bar */}
        <div
          style={{
            height: 42,
            background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            gap: 8,
          }}
        >
          {/* Traffic Light Window Controls */}
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#f59e0b" }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#10b981" }} />
          </div>

          {/* URL Pill */}
          <div
            style={{
              margin: "0 auto",
              padding: "4px 28px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: 6,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#94a3b8",
              fontSize: 12,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.2px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ color: "#10b981" }}>🔒</span>
            {urlLabel}
          </div>
        </div>

        {/* Screenshot Viewport with Cinematic Zoom */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            background: "#020617",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${slowZoom})`,
              transformOrigin: "center top",
            }}
          >
            <Img
              src={staticFile(imageSrc)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
