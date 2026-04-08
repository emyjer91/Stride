import { useState } from "react";

export default function App() {
  const [tab, setTab] = useState("home");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "24px 20px 110px",
      }}
    >
      <div style={{ maxWidth: 430, margin: "0 auto" }}>
        {tab === "home" && <Home onStartRun={() => setTab("run")} />}
        {tab === "run" && <Run />}
        {tab === "coach" && <Coach />}
        {tab === "social" && <Placeholder title="Social" text="La communauté STRIDE arrive bientôt." />}
        {tab === "profile" && <Placeholder title="Profil" text="Ton profil et tes stats arriveront ici." />}
      </div>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

function Home({ onStartRun }) {
  return (
    <div>
      <div
        style={{
          display: "inline-block",
          padding: "10px 14px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.75)",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        STRIDE • Beta
      </div>

      <h1
        style={{
          fontSize: 46,
          lineHeight: 1.02,
          margin: "18px 0 0",
          fontWeight: 800,
          letterSpacing: -1.5,
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
          fontSize: 18,
          lineHeight: 1.55,
        }}
      >
        Le coach running social nouvelle génération pour suivre tes séances,
        progresser plus vite et rester motivé chaque jour.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginTop: 24,
        }}
      >
        <Card>
          <Label>Objectif semaine</Label>
          <Big>42 km</Big>
        </Card>

        <div
          style={{
            borderRadius: 22,
            padding: 18,
            background: "linear-gradient(135deg, #9333ea, #2563eb)",
            boxShadow: "0 14px 30px rgba(80,80,255,0.25)",
          }}
        >
          <Label light>Niveau</Label>
          <Big>12</Big>
        </div>
      </div>

      <Card style={{ marginTop: 16 }}>
        <Label>Coach IA</Label>
        <div style={{ fontSize: 18, lineHeight: 1.45, fontWeight: 800 }}>
          “Aujourd’hui, fais une sortie facile de 35 minutes pour garder de la
          fraîcheur.”
        </div>
      </Card>

      <button
        onClick={onStartRun}
        style={{
          width: "100%",
          marginTop: 18,
          border: "none",
          borderRadius: 20,
          padding: "18px 20px",
          fontSize: 18,
          fontWeight: 800,
          color: "white",
          background: "linear-gradient(135deg, #9333ea, #2563eb)",
          boxShadow: "0 14px 30px rgba(80,80,255,0.25)",
        }}
      >
        Commencer ma séance
      </button>

      <Card style={{ marginTop: 16 }}>
        <Label>Séance du jour</Label>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Footing progressif • 35 min</div>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Label>Progression</Label>
        <div style={{ fontSize: 18, fontWeight: 800 }}>+12% sur les 4 dernières semaines</div>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Label>Communauté</Label>
        <div style={{ fontSize: 18, fontWeight: 800 }}>248 coureurs actifs aujourd’hui</div>
      </Card>
    </div>
  );
}

function Run() {
  const [type, setType] = useState("Footing facile");
  const [duration, setDuration] = useState(30);

  const types = ["Footing facile", "Endurance", "Fractionné", "Sortie longue"];
  const durations = [20, 30, 45, 60];

  return (
    <div>
      <h1 style={{ fontSize: 36, margin: 0, fontWeight: 800 }}>Démarrer une séance</h1>
      <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 17, lineHeight: 1.5 }}>
        Choisis le type de séance, la durée, puis lance ton entraînement.
      </p>

      <Card style={{ marginTop: 22 }}>
        <Label>Type de séance</Label>
        <div style={{ display: "grid", gap: 10 }}>
          {types.map((item) => {
            const active = item === type;
            return (
              <button
                key={item}
                onClick={() => setType(item)}
                style={{
                  textAlign: "left",
                  borderRadius: 16,
                  border: active ? "1px solid rgba(124,92,255,0.9)" : "1px solid rgba(255,255,255,0.08)",
                  background: active ? "rgba(124,92,255,0.18)" : "rgba(255,255,255,0.03)",
                  color: "white",
                  padding: "16px 14px",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {item}
              </button>
            );
          })}
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Label>Durée</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {durations.map((item) => {
            const active = item === duration;
            return (
              <button
                key={item}
                onClick={() => setDuration(item)}
                style={{
                  borderRadius: 16,
                  border: active ? "1px solid rgba(124,92,255,0.9)" : "1px solid rgba(255,255,255,0.08)",
                  background: active ? "linear-gradient(135deg, #9333ea, #2563eb)" : "rgba(255,255,255,0.03)",
                  color: "white",
                  padding: "16px 0",
                  fontSize: 16,
                  fontWeight: 800,
                }}
              >
                {item}m
              </button>
            );
          })}
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Label>Suggestion IA</Label>
        <div style={{ fontSize: 18, lineHeight: 1.45, fontWeight: 800 }}>
          Aujourd’hui : {type.toLowerCase()} recommandé sur {duration} minutes.
        </div>
      </Card>

      <button
        style={{
          width: "100%",
          marginTop: 18,
          border: "none",
          borderRadius: 20,
          padding: "18px 20px",
          fontSize: 18,
          fontWeight: 800,
          color: "white",
          background: "linear-gradient(135deg, #9333ea, #2563eb)",
          boxShadow: "0 14px 30px rgba(80,80,255,0.25)",
        }}
      >
        Démarrer la séance
      </button>
    </div>
  );
}

function Coach() {
  return (
    <div>
      <h1 style={{ fontSize: 36, margin: 0, fontWeight: 800 }}>Coach IA</h1>
      <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 17, lineHeight: 1.5 }}>
        Un coach premium pour t’aider à mieux t’entraîner, récupérer et progresser.
      </p>

      <Card style={{ marginTop: 22 }}>
        <Label>Recommandation du jour</Label>
        <div style={{ fontSize: 18, lineHeight: 1.45, fontWeight: 800 }}>
          Tu sembles en bonne fraîcheur. Garde une intensité modérée aujourd’hui et vise la régularité.
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Label>Charge récente</Label>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Correcte • équilibre à surveiller</div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Label>Sommeil & récupération</Label>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Bonne base, mais marge d’optimisation</div>
      </Card>
    </div>
  );
}

function Placeholder({ title, text }) {
  return (
    <div>
      <h1 style={{ fontSize: 36, margin: 0, fontWeight: 800 }}>{title}</h1>
      <Card style={{ marginTop: 22 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{text}</div>
      </Card>
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
        left: 0,
        right: 0,
        bottom: 0,
        padding: "0 14px 14px",
        background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 8,
          padding: 8,
          borderRadius: 22,
          background: "rgba(12,12,12,0.96)",
          border: "1px solid rgba(255,255,255,0.08)",
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
                background: active ? "linear-gradient(135deg, #9333ea, #2563eb)" : "transparent",
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

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        padding: 18,
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Label({ children, light = false }) {
  return (
    <div
      style={{
        fontSize: 13,
        marginBottom: 10,
        color: light ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.6)",
      }}
    >
      {children}
    </div>
  );
}

function Big({ children }) {
  return <div style={{ fontSize: 30, fontWeight: 800 }}>{children}</div>;
}
