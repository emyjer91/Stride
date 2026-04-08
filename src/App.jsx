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

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceReady, setVoiceReady] = useState(false);
  const [announceSplits, setAnnounceSplits] = useState(true);

  const lastPositionRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const lastAnnouncedMinuteRef = useRef(null);

  const types = ["Footing facile", "Endurance", "Fractionné", "Sortie longue"];
  const durations = [20, 30, 45, 60];

  const targetSeconds = duration * 60;
  const progress = Math.min((elapsedSeconds / targetSeconds) * 100, 100);

  const pace = useMemo(() => {
    if (distance <= 0 || elapsedSeconds <= 0) return "--:--";
    const secondsPerKm = elapsedSeconds / distance;
    return formatPace(secondsPerKm);
  }, [distance, elapsedSeconds]);

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
      speak(
        voiceEnabled,
        `Séance terminée. Bravo. Tu as complété ${duration} minutes de ${runType.toLowerCase()}.`
      );
    }
  }, [elapsedSeconds, targetSeconds, isRunning, voiceEnabled, duration, runType]);

  useEffect(() => {
    if (!isRunning || !announceSplits || elapsedSeconds === 0) return;

    const currentMinute = Math.floor(elapsedSeconds / 60);
    const exactFiveMinuteMark = elapsedSeconds % 300 === 0;

    if (
      exactFiveMinuteMark &&
      currentMinute > 0 &&
      lastAnnouncedMinuteRef.current !== currentMinute
    ) {
      lastAnnouncedMinuteRef.current = currentMinute;
      const remainingMinutes = Math.max(
        Math.ceil((targetSeconds - elapsedSeconds) / 60),
        0
      );
      speak(
        voiceEnabled,
        `${currentMinute} minutes effectuées. Il reste environ ${remainingMinutes} minutes.`
      );
    }
  }, [elapsedSeconds, isRunning, announceSplits, targetSeconds, voiceEnabled]);

  function unlockVoice() {
    const ok = primeSpeech();
    setVoiceReady(ok);
    if (ok) {
      speak(true, "Voix STRIDE activée.");
    }
  }

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
    lastAnnouncedMinuteRef.current = null;
    startGPS();
    speak(
      voiceEnabled,
      `Séance démarrée. ${runType}. Objectif ${duration} minutes. Bonne séance.`
    );
  }

  function handlePauseResume() {
    if (isPaused) {
      setIsPaused(false);
      startGPS();
      speak(voiceEnabled, "Séance reprise.");
    } else {
      setIsPaused(true);
      stopGPS();
      speak(voiceEnabled, "Séance en pause.");
    }
  }

  function handleStop(withVoice = true) {
    setIsRunning(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setDistance(0);
    setSpeed(0);
    lastAnnouncedMinuteRef.current = null;
    stopGPS();

    if (withVoice) {
      speak(voiceEnabled, "Séance arrêtée.");
    }
  }

  function handleChangeType(item) {
    setRunType(item);
    handleStop(false);
  }

  function handleChangeDuration(item) {
    setDuration(item);
    handleStop(false);
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
        <Label>Voix coach</Label>

        <div style={{ display: "grid", gap: 10 }}>
          <button onClick={unlockVoice} style={secondaryButtonStyle}>
            {voiceReady ? "Voix prête" : "Activer la voix"}
          </button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            <button
              onClick={() => setVoiceEnabled((v) => !v)}
              style={{
                ...secondaryButtonStyle,
                background: voiceEnabled
                  ? "rgba(124,92,255,0.18)"
                  : "rgba(255,255,255,0.04)",
                border: voiceEnabled
                  ? "1px solid rgba(124,92,255,0.9)"
                  : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {voiceEnabled ? "Voix ON" : "Voix OFF"}
            </button>

            <button
              onClick={() => setAnnounceSplits((v) => !v)}
              style={{
                ...secondaryButtonStyle,
                background: announceSplits
                  ? "rgba(124,92,255,0.18)"
                  : "rgba(255,255,255,0.04)",
                border: announceSplits
                  ? "1px solid rgba(124,92,255,0.9)"
                  : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {announceSplits ? "Annonces 5 min ON" : "Annonces 5 min OFF"}
            </button>
          </div>

          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Active d’abord la voix, puis démarre la séance. Sur certains
            téléphones, le navigateur demande un premier clic pour autoriser la
            synthèse vocale.
          </div>
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
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

        <div style={{ fontSize: 14, marginBottom: 6 }}>
          Vitesse : {speed || 0} km/h
        </div>

        <div style={{ fontSize: 14, marginBottom: 14 }}>
          Allure : {pace} /km
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

              <button
                onClick={() => handleStop(true)}
                style={secondaryButtonStyle}
              >
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
        "Salut. Je suis ton coach STRIDE local. Je peux t’aider sur le sommeil, la fatigue, la perte de poids, le 5 km, le 10 km, le semi, l’allure, la récupération, la motivation et la séance du jour.",
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
        <div
          style={{
            padding: 18,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
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
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function formatPace(secondsPerKm) {
  if (!Number.isFinite(secondsPerKm) || secondsPerKm <= 0) return "--:--";
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
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
  const q = question.toLowerCase().trim();
  const has = (...words) => words.some((w) => q.includes(w));

  if (
    has(
      "sommeil",
      "dormir",
      "endormir",
      "endormissement",
      "insomnie",
      "insomnies",
      "réveil",
      "reveil",
      "réveils",
      "reveils",
      "nuit",
      "nuits",
      "je dors mal",
      "mal dormir",
      "mal à dormir",
      "mal a dormir",
      "du mal à dormir",
      "du mal a dormir",
      "du mal à trouver le sommeil",
      "du mal a trouver le sommeil",
      "je ne dors pas bien",
      "je me réveille",
      "je me reveille",
      "réveils nocturnes",
      "reveils nocturnes"
    )
  ) {
    return "Si tu as du mal à dormir, commence par regarder 5 points : évite les écrans et la lumière forte 60 à 90 minutes avant le coucher, garde des horaires assez réguliers, évite les boissons stimulantes en fin de journée, fais redescendre la pression avec une routine calme comme respiration lente ou lecture, et allège un peu l’intensité de tes séances si ton sommeil est mauvais depuis plusieurs jours.";
  }

  if (
    has(
      "poids",
      "poid",
      "maigrir",
      "mincir",
      "sécher",
      "secher",
      "gras",
      "ventre",
      "calorie",
      "calories",
      "régime",
      "regime",
      "perdre"
    )
  ) {
    return "Pour perdre du poids efficacement, vise surtout la régularité : 3 à 5 séances par semaine, beaucoup d’endurance facile, un léger déficit calorique, plus de marche au quotidien, un bon sommeil, et de la patience. Le plus important est d’éviter les excès et de tenir sur la durée.";
  }

  if (has("semi", "semi-marathon", "semi marathon")) {
    return "Pour préparer un semi, fais idéalement 3 à 4 sorties par semaine : un footing facile, une séance de qualité, une sortie longue progressive, et éventuellement une sortie récupération. Augmente le volume petit à petit sans brûler les étapes.";
  }

  if (has("10 km", "10km")) {
    return "Pour progresser sur 10 km, combine endurance facile, travail au seuil et un peu de vitesse. Une bonne base : un footing facile, une séance tempo ou seuil, une séance plus rythmée, et une sortie un peu plus longue.";
  }

  if (has("5 km", "5km")) {
    return "Pour un 5 km, garde une base d’endurance mais ajoute du travail de vitesse et de VO2. Il faut réussir à courir vite sans exploser trop tôt.";
  }

  if (has("fatigué", "fatigue", "crevé", "épuisé", "epuise")) {
    return "Si tu te sens fatigué, allège aujourd’hui. Un footing très facile, une marche active ou du repos peuvent être bien plus utiles qu’une grosse séance mal encaissée.";
  }

  if (has("récup", "recup", "récupération", "recuperation")) {
    return "Pour bien récupérer : sommeil, hydratation, alimentation correcte, et séance facile après un effort dur. La récupération fait partie de l’entraînement.";
  }

  if (has("aujourd", "quoi faire", "séance du jour", "seance du jour")) {
    return `Aujourd’hui, je te recommande plutôt une séance de ${context.runType.toLowerCase()} sur ${context.duration} minutes, en restant propre techniquement et sans te cramer.`;
  }

  if (has("allure", "vitesse", "rythme", "km/h", "min/km")) {
    return "Pour choisir la bonne allure, pars toujours un peu trop facile plutôt qu’un peu trop vite. Une séance propre vaut mieux qu’un départ trop ambitieux.";
  }

  if (has("fractionné", "fractionne", "intervalle", "intervalles", "vma")) {
    return "Le fractionné doit rester maîtrisé. Échauffe-toi bien, garde de la qualité, et ne cherche pas à te détruire sur chaque répétition.";
  }

  if (has("sortie longue", "longue")) {
    return "La sortie longue développe ton endurance générale. Pars facile, reste régulier, et évite de transformer chaque sortie longue en course.";
  }

  if (has("motivation", "motiver", "envie", "flemme", "pas motivé")) {
    return "La motivation bouge beaucoup, c’est normal. Le plus important est la régularité. Même une petite séance propre vaut mieux qu’une grosse séance que tu repousses sans cesse.";
  }

  if (
    has(
      "manger",
      "alimentation",
      "nutrition",
      "repas",
      "protéine",
      "protéines",
      "glucide",
      "glucides"
    )
  ) {
    return "Pour bien courir, garde une alimentation simple : assez de protéines, des glucides de qualité, des fruits, des légumes et une bonne hydratation. Évite surtout les excès et le désordre.";
  }

  if (has("stress", "angoisse", "anxiété", "anxiete", "pression")) {
    return "Si tu te sens stressé, baisse un peu la pression mentale. Reviens à des choses simples : respiration, routine stable, séance facile, objectif court terme. Le stress consomme aussi de l’énergie, donc il faut parfois alléger pour mieux repartir.";
  }

  if (has("bonjour", "salut", "hello", "coucou")) {
    return "Salut. Dis-moi ton objectif, ton niveau ou ton état de forme, et je te répondrai comme un coach running.";
  }

  return generateSmartFallback(question, context);
}

function generateSmartFallback(question, context) {
  const q = question.toLowerCase().trim();

  if (q.includes("plan")) {
    return "Je peux te construire un plan simple. Dis-moi ton objectif précis : 5 km, 10 km, semi, perte de poids, reprise, ou remise en forme.";
  }

  if (q.includes("combien") || q.includes("temps")) {
    return "Ça dépend de ton niveau actuel, de ton objectif et de ta fréquence d’entraînement. Donne-moi un peu plus de contexte et je te répondrai plus précisément.";
  }

  if (q.includes("comment")) {
    return "Je peux t’aider précisément. Reformule juste ton objectif en une phrase simple, par exemple : comment progresser sur 10 km, comment perdre du poids, comment mieux dormir, ou comment préparer un semi.";
  }

  if (q.includes("objectif")) {
    return "Donne-moi ton objectif principal : perdre du poids, courir plus vite, préparer un 10 km, préparer un semi, reprendre la course ou améliorer ton endurance.";
  }

  return `Je peux déjà t’aider sur :
- sommeil
- perte de poids
- 5 km
- 10 km
- semi-marathon
- fatigue
- récupération
- allure
- fractionné
- motivation
- séance du jour

Essaie une question simple comme :
- comment perdre du poids
- plan pour mon semi
- je suis fatigué
- j’ai du mal à dormir
- quoi faire aujourd’hui`;
}

function primeSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;

  try {
    const utterance = new SpeechSynthesisUtterance(" ");
    utterance.volume = 0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

function speak(enabled, text) {
  if (!enabled) return;
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {
    // no-op
  }
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
