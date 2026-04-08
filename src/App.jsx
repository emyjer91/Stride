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

function Run({ runType, setRunType, duration, setDuration }) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceReady, setVoiceReady] = useState(false);
  const [announceSplits, setAnnounceSplits] = useState(true);

  const lastAnnouncedMinuteRef = useRef(null);

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

    if (exactFiveMinuteMark && currentMinute > 0 && lastAnnouncedMinuteRef.current !== currentMinute) {
      lastAnnouncedMinuteRef.current = currentMinute;
      const remainingMinutes = Math.max(Math.ceil((targetSeconds - elapsedSeconds) / 60), 0);
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

  function handleStart() {
    setElapsedSeconds(0);
    setIsRunning(true);
    setIsPaused(false);
    lastAnnouncedMinuteRef.current = null;
    speak(
      voiceEnabled,
      `Séance démarrée. ${runType}. Objectif ${duration} minutes. Bonne séance.`
    );
  }

  function handlePauseResume() {
    if (isPaused) {
      setIsPaused(false);
      speak(voiceEnabled, "Séance reprise.");
    } else {
      setIsPaused(true);
      speak(voiceEnabled, "Séance en pause.");
    }
  }

  function handleStop() {
    setIsRunning(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    lastAnnouncedMinuteRef.current = null;
    speak(voiceEnabled, "Séance arrêtée.");
  }

  function handleChangeType(item) {
    setRunType(item);
    setIsRunning(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    lastAnnouncedMinuteRef.current = null;
  }

  function handleChangeDuration(item) {
    setDuration(item);
    setIsRunning(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    lastAnnouncedMinuteRef.current = null;
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
          <button
            onClick={unlockVoice}
            style={secondaryButtonStyle}
          >
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
            Active d’abord la voix, puis démarre la séance. Sur certains téléphones,
            le navigateur demande un premier clic pour autoriser la synthèse vocale.
          </div>
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Label>Chrono live</Label>
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
            marginBottom: 14,
          }}
        >
          Temps restant : {remainingText}
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
