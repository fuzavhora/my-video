import React from "react";
import { Img, staticFile } from "remotion";

interface PhoneFrameProps {
  imageSrc: string;
  label?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  imageSrc,
  label = "Mobile SOP",
}) => {
  return (
    <div
      style={{
        width: 320,
        height: 660,
        borderRadius: 48,
        background: "linear-gradient(180deg, #1e293b 0%, #020617 100%)",
        border: "4px solid rgba(255, 255, 255, 0.2)",
        boxShadow: `
          0 40px 80px -10px rgba(0, 0, 0, 0.95),
          0 0 40px rgba(56, 189, 248, 0.3),
          0 0 0 1px rgba(0, 0, 0, 0.8)
        `,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Dynamic Island Pill */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: 96,
          height: 24,
          borderRadius: 24,
          background: "#000000",
          zIndex: 30,
          boxShadow: "0 0 4px rgba(0,0,0,0.8)",
        }}
      />

      {/* Screen Container */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#0f172a" }}>
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

      {/* Bottom Floating Pill */}
      {label && (
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(15, 23, 42, 0.92)",
            border: "1px solid rgba(56, 189, 248, 0.5)",
            color: "#38bdf8",
            fontSize: 12,
            fontWeight: 800,
            padding: "5px 16px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            fontFamily: "system-ui, sans-serif",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          }}
        >
          📱 {label}
        </div>
      )}
    </div>
  );
};
