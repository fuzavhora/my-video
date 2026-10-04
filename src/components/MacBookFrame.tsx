import React from "react";
import { Img, staticFile } from "remotion";

interface MacBookFrameProps {
  imageSrc: string;
  urlLabel?: string;
  zoom?: number;
  panX?: number;
  panY?: number;
  brandOverlay?: "light" | "dark";
}

export const MacBookFrame: React.FC<MacBookFrameProps> = ({
  imageSrc,
  urlLabel = "app.alangkart.com",
  zoom = 1,
  panX = 0,
  panY = 0,
  brandOverlay,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Outer Aluminum Display Lid (1260 x 700) */}
      <div
        style={{
          width: 1260,
          height: 700,
          background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
          borderRadius: 20,
          padding: "8px 8px 0 8px",
          boxShadow: `
            0 40px 90px -15px rgba(0, 0, 0, 0.95),
            0 0 60px rgba(99, 102, 241, 0.22),
            0 0 0 1px rgba(255, 255, 255, 0.14)
          `,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Window / Menu Bar */}
        <div
          style={{
            height: 36,
            background: "#090d16",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 8,
            flexShrink: 0,
            borderRadius: "14px 14px 0 0",
          }}
        >
          {/* Traffic Light Buttons */}
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
          </div>

          {/* Browser Address Pill */}
          <div
            style={{
              margin: "0 auto",
              padding: "3px 28px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: 6,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#94a3b8",
              fontSize: 11,
              fontFamily: "system-ui, -apple-system, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 6,
              letterSpacing: 0.2,
            }}
          >
            <span style={{ color: "#10b981", fontSize: 10 }}>🔒</span>
            <span style={{ color: "#cbd5e1", fontWeight: 600 }}>{urlLabel}</span>
          </div>
        </div>

        {/* Screen Viewport with Camera Zoom & Pan */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            background: "#020617",
            borderRadius: "0 0 12px 12px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
              transformOrigin: "center center",
            }}
          >
            <Img
              src={staticFile(imageSrc)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top left",
                translate: "-2.6px 13.3px"
              }}
            />
          </div>

          {brandOverlay && (
            <div
              style={{
                position: "absolute",
                top: 13,
                left: 0,
                width: 250,
                height: 62,
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: 22,
                boxSizing: "border-box",
                background:
                  brandOverlay === "dark"
                    ? "linear-gradient(90deg, #020617 85%, rgba(2, 6, 23, 0))"
                    : "linear-gradient(90deg, #ffffff 85%, rgba(255, 255, 255, 0))",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              <div
                style={{
                  color: brandOverlay === "dark" ? "#f8fafc" : "#3b2418",
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: 0.1,
                  lineHeight: 1.1,
                }}
              >
                STYLISH CREATION
              </div>
              <div
                style={{
                  color: brandOverlay === "dark" ? "#cbd5e1" : "#7a685b",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  marginTop: 4,
                  textTransform: "uppercase",
                }}
              >
                Sherwani & Ethnic Rentals
              </div>
            </div>
          )}

          {/* Screen Glare Highlight */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* MacBook Bottom Base / Lip */}
      <div
        style={{
          width: 1380,
          height: 16,
          background: "linear-gradient(180deg, #334155 0%, #1e293b 100%)",
          borderRadius: "0 0 14px 14px",
          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.8)",
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 120,
            height: 5,
            background: "#0f172a",
            borderRadius: "0 0 5px 5px",
          }}
        />
      </div>
    </div>
  );
};
