import { useEffect, useMemo, useRef, useState } from "react";

export default function App() {
  const [tab, setTab] = useState("home");
  const [runType, setRunType] = useState("Footing facile");
  const [duration, setDuration] = useState(30);

  function handleStartFromHome() {
    setTab("run");
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

      <button onClick={onStartRun} style={primaryButtonStyle}>
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
    </div>
  );
}

function Run({ runType, setRunType, duration, setDuration }) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [watchId, setWatchId] = useState(null);

  const lastPositionRef = useRef(null);
  const lastTimestampRef = useRef(null);

  const types = ["Footing facile", "Endurance", "Fractionné", "Sortie longue"];
  const durations = [20, 30, 45, 60];

  const targetSeconds = duration * 60;
  const progress = Math.min((elapsedSeconds / targetSeconds) * 100, 100);

  const coachSuggestion = useMemo(() => {
    if (runType === "Fractionné") {
      return `Aujourd’hui : ${runType.toLowerCase()} sur ${duration} minutes si tu es en forme.`;
    }
    if (runType === "Sortie longue") {
      return `Aujourd’hui : ${runType.toLowerCase()} structurée sur ${duration} minutes avec départ tranquille.`;
    }
    return `Aujourd’hui : ${runType.toLowerCase()} recommandé sur ${duration} minutes.`;
  }, [runType, duration]);

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev >= targetSeconds) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, targetSeconds]);

  useEffect(() => {
    if (elapsedSeconds >= targetSeconds && targetSeconds > 0 && isRunning) {
      setIsRunning(false);
      setIsPaused(false);
      stopGPS();
    }
  }, [elapsedSeconds, targetSeconds, isRunning]);

  function startGPS() {
    if (!navigator.geolocation) {
      alert("GPS non supporté sur cet appareil.");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, speed: currentSpeed } = pos.coords;
        const current = { latitude, longitude };
        const now = pos.timestamp;

        if (lastPositionRef.current) {
          const dist = getDistance(lastPositionRef.current, current);
          setDistance((d) => d + dist);

          if (currentSpeed != null && !Number.isNaN(currentSpeed)) {
            setSpeed((currentSpeed * 3.6).toFixed(1));
          } else if (lastTimestampRef.current) {
            const deltaSeconds = (now - lastTimestampRef.current) / 1000;
            if (deltaSeconds > 0) {
              const speedKmH = (dist / deltaSeconds) * 3600;
              setSpeed(speedKmH.toFixed(1));
            }
          }
        }

        lastPositionRef.current = current;
        lastTimestampRef.current = now;
      },
      (err) => {
        console.log("Erreur GPS :", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );

    setWatchId(id);
  }

  function stopGPS() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    lastPositionRef.current = null;
    lastTimestampRef.current = null;
  }

  function handleStart() {
    setElapsedSeconds(0);
    setDistance(0);
    setSpeed(0);
    setIsRunning(true);
    setIsPaused(false);
    startGPS();
  }

  function handlePauseResume() {
    if (isPaused) {
      setIsPaused(false);
      startGPS();
    } else {
      setIsPaused(true);
      stopGPS();
    }
  }

  function handleStop() {
    setIsRunning(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setDistance(0);
    setSpeed(0);
    stopGPS();
  }

  function handleChangeType(item) {
    setRunType(item);
    handleStop();
  }

  function handleChangeDuration(item) {
    setDuration(item);
    handleStop();
  }

  const timeText = formatTime(elapsedSeconds);
  const remainingText = formatTime(Math.max(targetSeconds - elapsedSeconds, 0));

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

      <Card style={{ marginTop: 18 }}>
        <Label>Chrono live + GPS</Label>

        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: 1,
            marginBottom: 10,
          }}
        >
          {timeText}
        </div>

        <div
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.65)",
            marginBottom: 10,
          }}
        >
          Temps restant : {remainingText}
        </div>

        <div style={{ fontSize: 14, marginBottom: 6 }}>
          Distance : {distance.toFixed(2)} km
        </div>

        <div style={{ fontSize: 14, marginBottom: 14 }}>
          Vitesse : {speed || 0} km/h
        </div>

        <div
          style={{
            width: "100%",
            height: 12,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 999,
            overflow: "hidden",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(135deg, #9333ea, #2563eb)",
              transition: "width 0.4s ease",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isRunning ? "1fr 1fr" : "1fr",
            gap: 10,
          }}
        >
          {!isRunning ? (
            <button onClick={handleStart} style={primaryButtonStyle}>
              Démarrer la séance
            </button>
          ) : (
            <>
              <button onClick={handlePauseResume} style={primaryButtonStyle}>
                {isPaused ? "Reprendre" : "Pause"}
              </button>

              <button onClick={handleStop} style={secondaryButtonStyle}>
                Arrêter
              </button>
            </>
          )}
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Label>Type de séance</Label>
        <div style={{ display: "grid", gap: 10 }}>
          {types.map((item) => {
            const active = item === runType;
            return (
              <button
                key={item}
                onClick={() => handleChangeType(item)}
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
                onClick={() => handleChangeDuration(item)}
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
    </div>
  );
}

function Coach({ runType, duration, onGoRun }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Salut. Je suis ton coach STRIDE local. Pose-moi une question running, objectif, semi, 10 km, perte de poids ou récupération.",
    },
  ]);

  function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const userMessage = { role: "user", content: text };
    const answer = getCoachReply(text, { runType, duration });
    const botMessage = { role: "assistant", content: answer };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

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
        <Label>Charge récente</Label>
        <div style={{ fontSize: 18, fontWeight: 800 }}>
          Correcte • équilibre à surveiller
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Label>Sommeil & récupération</Label>
        <div style={{ fontSize: 18, fontWeight: 800 }}>
          Bonne base, mais marge d’optimisation
        </div>
      </Card>

      <button onClick={onGoRun} style={{ ...primaryButtonStyle, marginTop: 18 }}>
        Aller à ma séance
      </button>

      <Card style={{ marginTop: 18, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: 18, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Label>Parle à ton coach</Label>
        </div>

        <div
          style={{
            maxHeight: 360,
            overflowY: "auto",
            padding: 16,
            display: "grid",
            gap: 12,
          }}
        >
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "14px 16px",
                    borderRadius: 18,
                    lineHeight: 1.45,
                    fontSize: 17,
                    background: isUser
                      ? "linear-gradient(135deg, rgba(147,51,234,0.30), rgba(37,99,235,0.30))"
                      : "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 10,
            padding: 16,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Pose ta question..."
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "white",
              borderRadius: 16,
              padding: "14px 14px",
              fontSize: 16,
              outline: "none",
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              border: "none",
              borderRadius: 16,
              background: "linear-gradient(135deg, #9333ea, #2563eb)",
              color: "white",
              fontWeight: 800,
              padding: "0 18px",
              fontSize: 18,
            }}
          >
            →
          </button>
        </div>
      </Card>
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

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getDistance(pos1, pos2) {
  const R = 6371;
  const dLat = (pos2.latitude - pos1.latitude) * (Math.PI / 180);
  const dLon = (pos2.longitude - pos1.longitude) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((pos1.latitude * Math.PI) / 180) *
      Math.cos((pos2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getCoachReply(question, context) {
  const q = question.toLowerCase();

  if (q.includes("perdre du poids") || q.includes("maigrir") || q.includes("mincir")) {
    return "Pour perdre du poids, vise surtout la régularité : 3 à 5 séances par semaine, majorité en endurance facile, un léger déficit calorique, beaucoup de marche au quotidien, et une bonne récupération. Évite de vouloir aller trop vite dès le départ.";
  }

  if (q.includes("semi")) {
    return "Pour préparer un semi, construis ta base avec 3 à 4 sorties par semaine : 1 footing facile, 1 séance de qualité, 1 sortie longue progressive, et éventuellement 1 séance récupération. Monte le volume progressivement et garde une semaine plus légère régulièrement.";
  }

  if (q.includes("10 km") || q.includes("10km")) {
    return "Pour progresser sur 10 km, combine endurance facile, travail au seuil, et un peu de vitesse. Une bonne structure : 1 footing facile, 1 séance tempo ou seuil, 1 séance plus rythmée type fractionné, et 1 sortie plus longue légère.";
  }

  if (q.includes("5 km") || q.includes("5km")) {
    return "Pour un 5 km, garde une base d’endurance mais ajoute du travail de vitesse et de VO2. Il faut être capable de courir vite, mais aussi de tenir ton allure sans exploser après le 2e ou 3e kilomètre.";
  }

  if (q.includes("fatigué") || q.includes("fatigue") || q.includes("crevé")) {
    return "Si tu te sens fatigué, baisse l’intensité aujourd’hui. Un footing facile très court ou du repos peut être plus rentable qu’une grosse séance mal absorbée. Le but est de progresser, pas de t’épuiser.";
  }

  if (q.includes("récup") || q.includes("recup") || q.includes("récupération")) {
    return "Pour bien récupérer : sommeil, hydratation, alimentation correcte, et intensité facile le lendemain d’une séance dure. Une bonne récupération améliore directement la qualité des prochaines séances.";
  }

  if (q.includes("aujourd") || q.includes("quoi faire") || q.includes("séance du jour")) {
    return `Aujourd’hui, je te recommande plutôt une séance de ${context.runType.toLowerCase()} sur ${context.duration} minutes, en restant propre techniquement et sans te griller inutilement.`;
  }

  if (q.includes("allure")) {
    return "Pour choisir ton allure, pars toujours légèrement plus facile que trop vite. Si tu termines solide et propre, c’est beaucoup mieux qu’un départ trop ambitieux.";
  }

  if (q.includes("fractionné")) {
    return "Le fractionné doit rester maîtrisé. Il sert à travailler vite avec de la qualité, pas à finir détruit à chaque fois. Échauffe-toi bien, récupère correctement, et garde de la marge sur les premières répétitions.";
  }

  if (q.includes("sortie longue")) {
    return "La sortie longue construit ton endurance, ta résistance et ta capacité à durer. Commence facile, sois régulier, et n’essaie pas de la transformer en course à chaque fois.";
  }

  if (q.includes("bonjour") || q.includes("salut") || q.includes("hello")) {
    return "Salut. Dis-moi ton objectif et ton état de forme, et je te proposerai une réponse claire et utile.";
  }

  return "Je peux déjà bien t’aider sur : perte de poids, 5 km, 10 km, semi, fatigue, récupération, allure, fractionné et séance du jour. Pose-moi une question plus précise sur un de ces sujets.";
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
