import { useMemo, useState } from "react";

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
        {tab === "home" && <Home onStartRun={() => setTab("run")} />}
        {tab === "run" && <Run />}
        {tab === "coach" && (
          <Screen
            emoji="🧠"
            title="Coach IA"
            subtitle="Retrouve tes recommandations, ta charge d’entraînement et tes prochaines séances optimisées."
          />
        )}
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

function Home({ onStartRun }) {
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

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <GlassCard>
          <MutedLabel>Objectif semaine</MutedLabel>
          <BigValue>42 km</BigValue>
        </GlassCard>

        <div
          style={{
            background: "linear-gradient(135deg, #7c3aed, #2563eb)",
            borderRadius: 22,
            padding: 16,
            boxShadow: "0 12px 34px rgba(37,99,235,0.28)",
            transform: "translateZ(0)",
          }}
        >
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
            Niveau
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>12</div>
        </div>
      </div>

      <GlassCard style={{ marginTop: 18 }}>
        <MutedLabel>Coach IA</MutedLabel>
        <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.35 }}>
          “Aujourd’hui, fais une sortie facile de 35 minutes pour garder de la
          fraîcheur.”
        </div>
      </GlassCard>

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
          transition: "transform 0.15s ease, opacity 0.15s ease",
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.985)";
          e.currentTarget.style.opacity = "0.96";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.opacity = "1";
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
          <GlassCard key={title}>
            <MutedLabel>{title}</MutedLabel>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{value}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function Run() {
  const sessionTypes = [
    {
      id: "easy",
      emoji: "🟢",
      title: "Footing facile",
      desc: "Récupération active",
      accent: "#22c55e",
    },
    {
      id: "endurance",
      emoji: "🔵",
      title: "Endurance",
      desc: "Base aérobie solide",
      accent: "#3b82f6",
    },
    {
      id: "intervals",
      emoji: "🔴",
      title: "Fractionné",
      desc: "Vitesse et intensité",
      accent: "#ef4444",
    },
    {
      id: "long",
      emoji: "🟣",
      title: "Sortie longue",
      desc: "Volume et mental",
      accent: "#a855f7",
    },
  ];

  const durations = [20, 30, 45, 60];
  const [selectedType, setSelectedType] = useState("easy");
  const [selectedDuration, setSelectedDuration] = useState(35);

  const recommendation = useMemo(() => {
    if (selectedType === "easy") {
      return "Aujourd’hui : footing facile recommandé pour récupération.";
    }
    if (selectedType === "endurance") {
      return "Aujourd’hui : séance endurance idéale pour consolider ta base.";
    }
    if (selectedType === "intervals") {
      return "Aujourd’hui : fractionné conseillé si tu veux travailler ta vitesse.";
    }
    return "Aujourd’hui : sortie longue recommandée pour renforcer ton endurance.";
  }, [selectedType]);

  const selectedMeta =
    sessionTypes.find((type) => type.id === selectedType) || sessionTypes[0];

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
        RUN • Session Builder
      </div>

      <h1
        style={{
          fontSize: 36,
          lineHeight: 1.05,
          margin: 0,
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        Démarrer une séance
      </h1>

      <p
        style={{
          marginTop: 14,
          color: "rgba(255,255,255,0.74)",
          fontSize: 16,
          lineHeight: 1.55,
        }}
      >
        Choisis ton format d’entraînement, ajuste la durée et laisse STRIDE te
        guider.
      </p>

      <div
        style={{
          marginTop: 22,
          display: "grid",
          gap: 12,
        }}
      >
        {sessionTypes.map((type) => {
          const active = selectedType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              style={{
                textAlign: "left",
                border: active
                  ? `1px solid ${type.accent}`
                  : "1px solid rgba(255,255,255,0.08)",
                background: active
                  ? `linear-gradient(135deg, ${hexToRgba(
                      type.accent,
                      0.18
                    )}, rgba(255,255,255,0.04))`
                  : "rgba(255,255,255,0.04)",
                borderRadius: 22,
                padding: 16,
                color: "white",
                cursor: "pointer",
                transition: "all 0.18s ease",
                boxShadow: active
                  ? `0 10px 28px ${hexToRgba(type.accent, 0.18)}`
                  : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 24 }}>{type.emoji}</div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800 }}>
                      {type.title}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.62)",
                        marginTop: 4,
                      }}
                    >
                      {type.desc}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 999,
                    border: active
                      ? `6px solid ${type.accent}`
                      : "2px solid rgba(255,255,255,0.28)",
                    background: active ? "white" : "transparent",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <GlassCard style={{ marginTop: 18 }}>
        <MutedLabel>Durée</MutedLabel>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
            marginTop: 8,
          }}
        >
          {durations.map((duration) => {
            const active = selectedDuration === duration;
            return (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                style={{
                  border: active
                    ? "1px solid rgba(147,51,234,0.9)"
                    : "1px solid rgba(255,255,255,0.08)",
                  background: active
                    ? "linear-gradient(135deg, #9333ea, #2563eb)"
                    : "rgba(255,255,255,0.04)",
                  color: "white",
                  borderRadius: 16,
                  padding: "14px 10px",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                }}
              >
                {duration} min
              </button>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard style={{ marginTop: 18 }}>
        <MutedLabel>Coach IA</MutedLabel>
        <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4 }}>
          “{recommendation}”
        </div>
      </GlassCard>

      <div
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <GlassCard>
          <MutedLabel>Séance choisie</MutedLabel>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 8 }}>
            {selectedMeta.title}
          </div>
        </GlassCard>

        <GlassCard>
          <MutedLabel>Durée cible</MutedLabel>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 8 }}>
            {selectedDuration} min
          </div>
        </GlassCard>
      </div>

      <button
        onClick={() =>
          alert(
            `Séance prête : ${selectedMeta.title} • ${selectedDuration} min`
          )
        }
        style={{
          marginTop: 22,
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
        Démarrer la séance
      </button>
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

      <GlassCard style={{ marginTop: 24 }}>
        Module en cours de conception premium.
      </GlassCard>
    </div>
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
                transition: "all 0.18s ease",
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

function GlassCard({ children, style = {} }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        padding: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function MutedLabel({ children }) {
  return (
    <div
      style={{
        fontSize: 13,
        color: "rgba(255,255,255,0.6)",
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function BigValue({ children }) {
  return <div style={{ fontSize: 30, fontWeight: 800 }}>{children}</div>;
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
