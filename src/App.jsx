import { useMemo, useState } from "react";

export default function App() {
  const [tab, setTab] = useState("home");
  const [runType, setRunType] = useState("Footing facile");
  const [duration, setDuration] = useState(30);
  const [started, setStarted] = useState(false);

  function handleStartFromHome() {
    setTab("run");
  }

  function handleLaunchRun() {
    setStarted(true);
  }

  function handleBackHome() {
    setStarted(false);
    setTab("home");
  }

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
        {tab === "home" && (
          <Home
            onStartRun={handleStartFromHome}
            onOpenCoach={() => setTab("coach")}
          />
        )}

        {tab === "run" && (
          <Run
            runType={runType}
            setRunType={setRunType}
            duration={duration}
            setDuration={setDuration}
            started={started}
            onLaunchRun={handleLaunchRun}
            onBackHome={handleBackHome}
          />
        )}

        {tab === "coach" && (
          <Coach
            runType={runType}
            duration={duration}
            onGoRun={() => setTab("run")}
          />
        )}

        {tab === "social" && (
          <Placeholder
            title="Social"
            text="La communauté STRIDE arrive bientôt."
          />
        )}

        {tab === "profile" && (
          <Profile duration={duration} runType={runType} />
        )}
      </div>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

function Home({ onStartRun, onOpenCoach }) {
  return (
    <div>
      <Badge>STRIDE • Beta</Badge>

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
        style={primaryButtonStyle}
      >
        Commencer ma séance
      </button>

      <button
        onClick={onOpenCoach}
        style={{
          ...secondaryButtonStyle,
          marginTop: 10,
        }}
      >
        Voir mon coach IA
      </button>

      <Card style={{ marginTop: 16 }}>
        <Label>Séance du jour</Label>
        <div style={{ fontSize: 18, fontWeight: 800 }}>
          Footing progressif • 35 min
        </div>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Label>Progression</Label>
        <div style={{ fontSize: 18, fontWeight: 800 }}>
          +12% sur les 4 dernières semaines
        </div>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Label>Communauté</Label>
        <div style={{ fontSize: 18, fontWeight: 800 }}>
          248 coureurs actifs aujourd’hui
        </div>
      </Card>
    </div>
  );
}

function Run({
  runType,
  setRunType,
  duration,
  setDuration,
  started,
  onLaunchRun,
  onBackHome,
}) {
  const types = ["Footing facile", "Endurance", "Fractionné", "Sortie longue"];
  const durations = [20, 30, 45, 60];

  const coachSuggestion = useMemo(() => {
    if (runType === "Fractionné") {
      return `Aujourd’hui : ${runType.toLowerCase()} sur ${duration} minutes si tu es en forme.`;
    }
    if (runType === "Sortie longue") {
      return `Aujourd’hui : ${runType.toLowerCase()} structurée sur ${duration} minutes avec départ tranquille.`;
    }
    return `Aujourd’hui : ${runType.toLowerCase()} recommandé sur ${duration} minutes.`;
  }, [runType, duration]);

  return (
    <div>
      <h1 style={{ fontSize: 36, margin: 0, fontWeight: 800 }}>
        Démarrer une séance
      </h1>

      <p
        style={{
          color: "rgba(255,255,255,0.72)",
          fontSize: 17,
          lineHeight: 1.5,
        }}
      >
        Choisis le type de séance, la durée, puis lance ton entraînement.
      </p>

      {started && (
        <div
          style={{
            marginTop: 18,
            borderRadius: 18,
            padding: 16,
            background: "rgba(34,197,94,0.14)",
            border: "1px solid rgba(34,197,94,0.35)",
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.8 }}>Séance lancée</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>
            {runType} • {duration} min
          </div>
          <div style={{ marginTop: 8, color: "rgba(255,255,255,0.82)" }}>
            Flow prêt. On pourra ensuite ajouter chrono, pause et GPS.
          </div>
        </div>
      )}

      <Card style={{ marginTop: 22 }}>
        <Label>Type de séance</Label>
        <div style={{ display: "grid", gap: 10 }}>
          {types.map((item) => {
            const active = item === runType;
            return (
              <button
                key={item}
                onClick={() => {
                  setRunType(item);
                  if (started) onBackHome();
                }}
                style={{
                  textAlign: "left",
                  borderRadius: 16,
                  border: active
                    ? "1px solid rgba(124,92,255,0.9)"
                    : "1px solid rgba(255,255,255,0.08)",
                  background: active
                    ? "rgba(124,92,255,0.18)"
                    : "rgba(255,255,255,0.03)",
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
          }}
        >
          {durations.map((item) => {
            const active = item === duration;
            return (
              <button
                key={item}
                onClick={() => {
                  setDuration(item);
                  if (started) onBackHome();
                }}
                style={{
                  borderRadius: 16,
                  border: active
                    ? "1px solid rgba(124,92,255,0.9)"
                    : "1px solid rgba(255,255,255,0.08)",
                  background: active
                    ? "linear-gradient(135deg, #9333ea, #2563eb)"
                    : "rgba(255,255,255,0.03)",
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
          {coachSuggestion}
        </div>
      </Card>

      {!started ? (
        <button onClick={onLaunchRun} style={{ ...primaryButtonStyle, marginTop: 18 }}>
          Démarrer la séance
        </button>
      ) : (
        <button onClick={onBackHome} style={{ ...secondaryButtonStyle, marginTop: 18 }}>
          Retour à l’accueil
        </button>
      )}
    </div>
  );
}

function Coach({ runType, duration, onGoRun }) {
  const readiness = useMemo(() => {
    if (runType === "Fractionné") return "Charge nerveuse à surveiller";
    if (runType === "Sortie longue") return "Bonne disponibilité aérobie";
    return "Bonne fraîcheur générale";
  }, [runType]);

  return (
    <div>
      <h1 style={{ fontSize: 36, margin: 0, fontWeight: 800 }}>Coach IA</h1>

      <p
        style={{
          color: "rgba(255,255,255,0.72)",
          fontSize: 17,
          lineHeight: 1.5,
        }}
      >
        Un coach premium pour t’aider à mieux t’entraîner, récupérer et
        progresser.
      </p>

      <Card style={{ marginTop: 22 }}>
        <Label>Recommandation du jour</Label>
        <div style={{ fontSize: 18, lineHeight: 1.45, fontWeight: 800 }}>
          Aujourd’hui, ta meilleure option est une séance de type{" "}
          {runType.toLowerCase()} sur {duration} minutes, avec départ progressif
          et ressenti maîtrisé.
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Label>État de forme estimé</Label>
        <div style={{ fontSize: 18, fontWeight: 800 }}>{readiness}</div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Label>Récupération</Label>
        <div style={{ fontSize: 18, fontWeight: 800 }}>
          Sommeil correct • hydratation à renforcer • jambes plutôt disponibles
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Label>Conseil premium</Label>
        <div style={{ fontSize: 17, lineHeight: 1.5 }}>
          Si tu te sens lourd dès l’échauffement, garde 10 minutes très faciles
          avant d’accélérer. Le but n’est pas de forcer, mais de construire de
          la qualité.
        </div>
      </Card>

      <button onClick={onGoRun} style={{ ...primaryButtonStyle, marginTop: 18 }}>
        Aller à ma séance
      </button>
    </div>
  );
}

function Profile({ duration, runType }) {
  return (
    <div>
      <h1 style={{ fontSize: 36, margin: 0, fontWeight: 800 }}>Profil</h1>

      <Card style={{ marginTop: 22 }}>
        <Label>Dernière préférence</Label>
        <div style={{ fontSize: 18, fontWeight: 800 }}>
          {runType} • {duration} min
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Label>Statut</Label>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Base STRIDE active</div>
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

function Badge({ children }) {
  return (
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
      {children}
    </div>
  );
}

const primaryButtonStyle = {
  width: "100%",
  border: "none",
  borderRadius: 20,
  padding: "18px 20px",
  fontSize: 18,
  fontWeight: 800,
  color: "white",
  background: "linear-gradient(135deg, #9333ea, #2563eb)",
  boxShadow: "0 14px 30px rgba(80,80,255,0.25)",
};

const secondaryButtonStyle = {
  width: "100%",
  borderRadius: 18,
  padding: "16px 18px",
  fontSize: 16,
  fontWeight: 800,
  color: "white",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};
