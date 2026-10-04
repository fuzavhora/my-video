import React from "react";
import {
  Sequence,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
  spring,
} from "remotion";
import { MacBookFrame } from "./components/MacBookFrame";
import { PhoneFrame } from "./components/PhoneFrame";
import { KineticSubtitles } from "./components/KineticSubtitles";
import { InteractiveCursor } from "./components/InteractiveCursor";
import { InteractiveSpotlight } from "./components/InteractiveSpotlight";
import { InteractiveAnnotation } from "./components/InteractiveAnnotation";

export interface PromoProps {
  audioSrc?: string;
}

export const ProductPromoComposition: React.FC<PromoProps> = ({ audioSrc = "" }) => {
  const { durationInFrames } = useVideoConfig();
  // Keep the composition silent until a dedicated Stylish Creation voiceover is added.
  void audioSrc;

  // Scene timing matching voiceover pacing:
  const S1_END = 145; // ~4.8s
  const S2_END = 285; // ~9.5s
  const S3_END = 415; // ~13.8s
  const S4_DURATION = durationInFrames - S3_END;

  return (
    <>
      <div
        style={{
          flex: 1,
          width: 1920,
          height: 1080,
          backgroundColor: "#030712",
          backgroundImage: `
            radial-gradient(ellipse at 50% 0%, #1e1b4b 0%, #030712 70%),
            radial-gradient(circle at 10% 85%, rgba(99, 102, 241, 0.18) 0%, transparent 45%),
            radial-gradient(circle at 90% 85%, rgba(56, 189, 248, 0.15) 0%, transparent 45%)
          `,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          overflow: "hidden",
          paddingTop: 30,
        }}
      >
        {/* Kinetic feature captions */}
        <KineticSubtitles />
      
        {/* =========================================================
            SCENE 1: EXECUTIVE DASHBOARD & RENTAL LEDGER (Frames 0 - 145)
            ========================================================= */}
        <Sequence durationInFrames={S1_END}>
          <SceneHeader
            category="Operations Command Center"
            headline="Your Boutique."
            highlight="In Full Control."
          />
      
          <div style={{ position: "relative", marginTop: 14 }}>
            <MacBookFrame
              imageSrc="dashboard.png"
              urlLabel="stylishcreation.erp/dashboard"
              zoom={1.02}
              brandOverlay="light"
            />
      
            {/* Interactive Live Cursor */}
            <InteractiveCursor
              keyframes={[
                { frame: 10, x: 200, y: 160 },
                { frame: 50, x: 540, y: 230, click: true, label: "Live collections" },
                { frame: 95, x: 800, y: 340, click: true, label: "Order health" },
              ]}
            />
      
            {/* Target Spotlight on Revenue */}
            <InteractiveSpotlight
              x={540}
              y={230}
              triggerFrame={50}
              label="Live business pulse"
            />
          </div>
      
          {/* Docked Left Feature Callout */}
          <InteractiveAnnotation
            icon="💎"
            badge="Business overview"
            title="One live picture"
            description="Orders, customers, collections, and fulfilment stay visible in one place."
            position="left"
            y={280}
            delay={25}
          />
      
          {/* Docked Right Feature Callout */}
          <InteractiveAnnotation
            icon="📈"
            badge="Rental health"
            title="Make faster calls"
            description="See the signals that matter before a busy day gets away from you."
            position="right"
            y={280}
            delay={40}
          />
        </Sequence>
      
        {/* =========================================================
            SCENE 2: GARMENT AVAILABILITY MATRIX & LOCKOUT (Frames 145 - 285)
            ========================================================= */}
        <Sequence from={S1_END} durationInFrames={S2_END - S1_END}>
          <SceneHeader
            category="Smart Scheduling"
            headline="Every Garment."
            highlight="Right On Time."
          />
      
          <Scene2Showcase />
      
          <InteractiveAnnotation
            icon="🛡️"
            badge="Availability"
            title="Prevent booking clashes"
            description="Know what is ready, rented, or in washing before confirming the next order."
            position="left"
            y={280}
            delay={20}
          />
      
          <InteractiveAnnotation
            icon="👗"
            badge="Garment lifecycle"
            title="Keep stock moving"
            description="Track styles, sizes, laundry, returns, and deposits throughout every rental."
            position="right"
            y={280}
            delay={35}
          />
        </Sequence>
      
        {/* =========================================================
            SCENE 3: AUTOMATED WHATSAPP INVOICING & BARCODES (Frames 285 - 415)
            ========================================================= */}
        <Sequence from={S2_END} durationInFrames={S3_END - S2_END}>
          <SceneHeader
            category="Frictionless Dispatch"
            headline="From Booking To"
            highlight="Confident Returns."
          />
      
          <Scene3Showcase />
      
          <InteractiveAnnotation
            icon="💬"
            badge="Faster billing"
            title="Clear customer updates"
            description="Keep every booking, payment, and return detail easy to review and share."
            position="left"
            y={280}
            delay={20}
          />
      
          <InteractiveAnnotation
            icon="🏷️"
            badge="Return ready"
            title="Reliable handovers"
            description="Bring dispatch, return checks, and deposit follow-up into a repeatable flow."
            position="right"
            y={280}
            delay={35}
          />
        </Sequence>
      
        {/* =========================================================
            SCENE 4: MULTI-DEVICE SHOWCASE & GRAND CTA (Frames 415 - End)
            ========================================================= */}
        <Sequence from={S3_END} durationInFrames={S4_DURATION}>
          <SceneHeader
            category="Built For Boutique Teams"
            headline="Keep Every Rental"
            highlight="Moving Smoothly."
          />
      
          <Scene4Showcase />
        </Sequence>
      </div>
    </>
  );
};

// Scene Header with Kinetic Typography
const SceneHeader: React.FC<{ category: string; headline: string; highlight: string }> = ({
  category,
  headline,
  highlight,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const translateY = interpolate(frame, [0, 8], [15, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: 10,
        opacity,
        transform: `translateY(${translateY}px)`,
        zIndex: 40,
        height: 85,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "4px 14px",
          borderRadius: 999,
          background: "rgba(56, 189, 248, 0.15)",
          border: "1px solid rgba(56, 189, 248, 0.35)",
          color: "#38bdf8",
          fontSize: 12,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 2,
          fontFamily: "system-ui, sans-serif",
          marginBottom: 6,
        }}
      >
        {category}
      </div>

      <h1
        style={{
          color: "#ffffff",
          fontSize: 42,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          letterSpacing: "-0.5px",
        }}
      >
        {headline}{" "}
        <span
          style={{
            background: "linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {highlight}
        </span>
      </h1>
    </div>
  );
};

// Scene 2 with smooth camera pan & zoom into inventory table
const Scene2Showcase: React.FC = () => {
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [0, 35], [1.02, 1.2], { extrapolateRight: "clamp" });
  const panY = interpolate(frame, [0, 35], [0, -30], { extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", marginTop: 14 }}>
      <MacBookFrame
        imageSrc="inventory.png"
        urlLabel="stylishcreation.erp/garments-fleet"
        zoom={zoom}
        panY={panY}
        brandOverlay="dark"
      />

      <InteractiveCursor
        keyframes={[
          { frame: 10, x: 280, y: 190 },
          { frame: 45, x: 620, y: 270, click: true, label: "Check availability" },
          { frame: 85, x: 840, y: 270, click: true, label: "Confirm rental window" },
        ]}
      />

      <InteractiveSpotlight
        x={620}
        y={270}
        triggerFrame={45}
        label="Always know what is ready"
      />
    </div>
  );
};

// Scene 3 with camera zoom into WhatsApp Billing Modal
const Scene3Showcase: React.FC = () => {
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [0, 35], [1.02, 1.22], { extrapolateRight: "clamp" });
  const panY = interpolate(frame, [0, 35], [0, -35], { extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", marginTop: 14 }}>
      <MacBookFrame
        imageSrc="whatsapp_billing.png"
        urlLabel="stylishcreation.erp/orders-billing"
        zoom={zoom}
        panY={panY}
        brandOverlay="light"
      />

      <InteractiveCursor
        keyframes={[
          { frame: 15, x: 300, y: 210 },
          { frame: 50, x: 670, y: 400, click: true, label: "Review order details" },
          { frame: 90, x: 730, y: 400, click: true, label: "Confirm payment status" },
        ]}
      />

      <InteractiveSpotlight
        x={670}
        y={400}
        triggerFrame={50}
        label="Every detail, easy to track"
      />
    </div>
  );
};

// Scene 4: Side-by-Side Multi-Device Finale & CTA
const Scene4Showcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        marginTop: 18,
        transform: `scale(${enter})`,
      }}
    >
      {/* Desktop ERP Frame */}
      <div style={{ width: 880, overflow: "hidden", borderRadius: 20 }}>
        <MacBookFrame
          imageSrc="live_orders.png"
          urlLabel="stylishcreation.erp/rental-orders"
          zoom={1.02}
        />
      </div>

      {/* Floating iPhone 15 Frame */}
      <PhoneFrame
        imageSrc="mobile_drawer.png"
        label="Mobile Client Agreement"
      />

      {/* High-Converting Grand CTA Box */}
      <div
        style={{
          width: 360,
          background: "linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)",
          border: "1px solid rgba(129, 140, 248, 0.4)",
          borderRadius: 24,
          padding: "32px 28px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9), 0 0 50px rgba(99, 102, 241, 0.35)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 16,
            background: "linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            marginBottom: 14,
            boxShadow: "0 10px 25px rgba(99, 102, 241, 0.5)",
          }}
        >
          ⚡
        </div>

        <h3
          style={{
            color: "#ffffff",
            fontSize: 22,
            fontWeight: 800,
            fontFamily: "system-ui, sans-serif",
            margin: 0,
            textAlign: "center",
          }}
        >
          Run Every Rental, Beautifully
        </h3>

        <p
          style={{
            color: "#94a3b8",
            fontSize: 13,
            marginTop: 8,
            marginBottom: 20,
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Bookings, customers, inventory, collections, and returns—one connected home.
        </p>

        <div
          style={{
            padding: "14px 30px",
            borderRadius: 999,
            background: "linear-gradient(90deg, #6366f1 0%, #38bdf8 100%)",
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 800,
            fontFamily: "system-ui, sans-serif",
            boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>Explore Stylish Creation</span>
          <span>→</span>
        </div>

        <div
          style={{
            color: "#64748b",
            fontSize: 11,
            marginTop: 12,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Sherwani & Ethnic Wear Rentals
        </div>
      </div>
    </div>
  );
};
