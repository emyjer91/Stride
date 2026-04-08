import { useState } from "react";
import CoachTab from "./CoachTab";

function Screen({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div style={{ padding: "28px 18px 32px" }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
          marginBottom: 18,
        }}
      >
        {emoji}
      </div>

      <h1 style={{ fontSize: 34, margin: 0, fontWeight: 800 }}>{title}</h1>
      <p
        style={{
          marginTop: 12,
          color: "rgba(255,255,255,0.72)",
          fontSize: 16,
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </p>

      <div
        style={{
          marginTop: 24,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 22,
          padding: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        }}
      >
        Module en cours de conception premium.
      </div>
    </div>
  );
}

function HomeTab({ onStartRun }: { onStartRun: () => void }) {
  return (
    <div style={{ padding: "24px 18px 32px" }}>
      <div
        style={{
          display: "inline-block",
          padding: "8px 12px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          fontSize: 12,
          marginBottom: 18,
          boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
        }}
      >
        STRIDE • Beta
      </div>

      <h1
        style={{
          fontSize: 42,
          lineHeight: 1.02,
          margin: 0,
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        Run smarter.
        <br />
        Progress faster.
      </h1>

      <p
        style={{
          marginTop: 16,
          color: "rgba(255,255,255,0.75)",
          fontSize: 16,
          lineHeight: 1.55,
        }}
      >
        Le coach running social nouvelle génération pour suivre tes séances,
        progresser plus vite et rester motivé chaque jour.
      </p>

      <button
        onClick={onStartRun}
        style={{
          marginTop: 20,
          width: "100%",
          padding: "16px 18px",
          borderRadius: 18,
          border: "none",
          fontSize: 16,
          fontWeight: 800,
          color: "white",
          background: "linear-gradient(135deg, #9333ea, #2563eb)",
          boxShadow: "0 14px 30px rgba(88,66,255,0.28)",
          cursor: "pointer",
        }}
      >
        Commencer ma séance
      </button>
    </div>
  );
}

function RunTab() {
  return (
    <Screen
      emoji="🏃"
      title="Run"
      subtitle="Prépare, démarre et suis tes séances de running."
    />
  );
}

function BottomNav({
  tab,
  setTab,
}: {
  tab: string;
  setTab: (tab: string) => void;
}) {
  const items = [
    ["home", "Accueil"],
    ["run", "Run"],
    ["coach", "Coach"],
    ["social", "Social"],
    ["profile", "Profil"],
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        padding: "0 14px 14px",
        background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 8,
          background: "rgba(12,12,12,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: 8,
          backdropFilter: "blur(10px)",
        }}
      >
        {items.map(([key, label]) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                border: "none",
                borderRadius: 14,
                padding: "10px 6px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                color: active ? "white" : "rgba(255,255,255,0.55)",
                background: active
                  ? "linear-gradient(135deg, #9333ea, #2563eb)"
                  : "transparent",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1d1d1d 0%, #0b0b0b 45%, #050505 100%)",
        color: "white",
        fontFamily:
          'Inter, Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div style={{ maxWidth: 430, margin: "0 auto", paddingBottom: 96 }}>
        {tab === "home" && <HomeTab onStartRun={() => setTab("run")} />}
        {tab === "run" && <RunTab />}
        {tab === "coach" && <CoachTab />}
        {tab === "social" && (
          <Screen
            emoji="👥"
            title="Social"
            subtitle="Partage tes runs, compare tes progrès et motive ta communauté."
          />
        )}
        {tab === "profile" && (
          <Screen
            emoji="👤"
            title="Profil"
            subtitle="Consulte ton niveau, tes stats, tes badges et ton évolution."
          />
        )}
      </div>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}
