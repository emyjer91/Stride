import { useState } from "react";

export default function App() {
  const [tab, setTab] = useState("home");

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1d1d1d 0%, #0b0b0b 45%, #050505 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 430, margin: "0 auto", paddingBottom: 90 }}>
        {tab === "home" && <Home />}
        {tab === "run" && <Run />}
        {tab === "coach" && <Coach />}
        {tab === "social" && <Social />}
        {tab === "profile" && <Profile />}
      </div>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

function Home() {
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
          lineHeight: 1.5,
        }}
      >
        Le coach running social nouvelle génération pour suivre tes séances,
        progresser plus vite et rester motivé chaque jour.
      </p>

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 22,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Objectif semaine
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>
            42 km
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #7c3aed, #2563eb)",
            borderRadius: 22,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
            Niveau
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>
            12
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: 18,
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.6)",
            marginBottom: 10,
          }}
        >
          Coach IA
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.35 }}>
          “Aujourd’hui, fais une sortie facile de 35 minutes pour garder de la
          fraîcheur.”
        </div>
      </div>

      <button
        style={{
          marginTop: 20,
          width: "100%",
          padding: "16px 18px",
          borderRadius: 18,
          border: "none",
          fontSize: 16,
          fontWeight: 700,
          color: "white",
          background: "linear-gradient(135deg, #9333ea, #2563eb)",
        }}
      >
        Commencer ma séance
      </button>

      <div style={{ marginTop: 28, display: "grid", gap: 12 }}>
        {[
          ["Séance du jour", "Footing progressif • 35 min"],
          ["Progression", "+12% sur les 4 dernières semaines"],
          ["Communauté", "248 coureurs actifs aujourd’hui"],
        ].map(([title, value]) => (
          <div
            key={title}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 18,
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.58)",
                marginBottom: 6,
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Screen({ title, subtitle, emoji }) {
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
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 22,
          padding: 18,
        }}
      >
        Module en cours de conception premium.
      </div>
    </div>
  );
}

function Run() {
  return (
    <Screen
      emoji="🏃"
      title="Run"
      subtitle="Lance tes séances, suis ton effort et transforme chaque sortie en progression."
    />
  );
}

function Coach() {
  return (
    <Screen
      emoji="🧠"
      title="Coach IA"
      subtitle="Des recommandations intelligentes, personnalisées et motivantes au bon moment."
    />
  );
}

function Social() {
  return (
    <Screen
      emoji="👥"
      title="Social"
      subtitle="Partage tes runs, compare tes progrès et crée une vraie dynamique de communauté."
    />
  );
}

function Profile() {
  return (
    <Screen
      emoji="👤"
      title="Profil"
      subtitle="Retrouve tes stats, ton niveau, tes badges et ton évolution globale."
    />
  );
}

function BottomNav({ tab, setTab }) {
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
