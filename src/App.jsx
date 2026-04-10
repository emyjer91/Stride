import { useEffect, useMemo, useRef, useState } from "react";

export default function App() {
  const [tab, setTab] = useState("home");
  const [runType, setRunType] = useState("Footing facile");
  const [duration, setDuration] = useState(30);

  const [companionProfile, setCompanionProfile] = useState({
    name: "Alicia",
    identity: "femme",
    age: 25,
    role: "compagnon virtuel",
    tone: "chaleureux",
    passions: "running, bien-être, progression, motivation",
    hobbies: "course, lecture, musique, coaching",
  });

  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");

  useEffect(() => {
    function loadVoices() {
      if (typeof window === "undefined" || !window.speechSynthesis) return;

      const voices = window.speechSynthesis.getVoices() || [];
      const frenchVoices = voices.filter((voice) =>
        voice.lang?.toLowerCase().startsWith("fr")
      );

      const finalVoices = frenchVoices.length > 0 ? frenchVoices : voices;

      setAvailableVoices(finalVoices);

      if (!selectedVoiceURI && finalVoices.length > 0) {
        const femaleKeywords = [
          "female",
          "woman",
          "femme",
          "marie",
          "amelie",
          "audrey",
          "julie",
          "lea",
          "sarah",
          "claire",
          "celine",
          "virginie",
          "hortense",
          "susan",
          "zira",
          "alice",
        ];

        const defaultFemaleVoice =
          finalVoices.find((voice) =>
            femaleKeywords.some((keyword) =>
              voice.name.toLowerCase().includes(keyword)
            )
          ) || finalVoices[0];

        setSelectedVoiceURI(defaultFemaleVoice.voiceURI);
      }
    }

    loadVoices();

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectedVoiceURI]);

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
            companionProfile={companionProfile}
          />
        )}

        {tab === "run" && (
          <Run
            runType={runType}
            setRunType={setRunType}
            duration={duration}
            setDuration={setDuration}
            availableVoices={availableVoices}
            selectedVoiceURI={selectedVoiceURI}
            setSelectedVoiceURI={setSelectedVoiceURI}
          />
        )}

        {tab === "coach" && (
          <Coach
            runType={runType}
            duration={duration}
            onGoRun={() => setTab("run")}
            companionProfile={companionProfile}
            availableVoices={availableVoices}
            selectedVoiceURI={selectedVoiceURI}
            setSelectedVoiceURI={setSelectedVoiceURI}
          />
        )}

        {tab === "social" && (
          <Placeholder
            title="Social"
            text="La communauté STRIDE arrive bientôt."
          />
        )}

        {tab === "profile" && (
          <Profile
            duration={duration}
            runType={runType}
            companionProfile={companionProfile}
            setCompanionProfile={setCompanionProfile}
            availableVoices={availableVoices}
            selectedVoiceURI={selectedVoiceURI}
            setSelectedVoiceURI={setSelectedVoiceURI}
          />
        )}
      </div>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

function Home({ onStartRun, onOpenCoach, companionProfile }) {
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
        Live stronger.
      </h1>

      <p
        style={{
          marginTop: 16,
          color: "rgba(255,255,255,0.75)",
          fontSize: 18,
          lineHeight: 1.55,
        }}
      >
        Ton coach et compagnon virtuel pour progresser, garder confiance et
        avancer avec plus d’élan chaque jour.
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
          <Label light>Présence</Label>
          <Big>{companionProfile.name}</Big>
        </div>
      </div>

      <Card style={{ marginTop: 16 }}>
        <Label>{companionProfile.name}</Label>
        <div style={{ fontSize: 18, lineHeight: 1.45, fontWeight: 800 }}>
          “Tu n’as pas besoin d’être parfait pour avancer. Une bonne direction,
          un peu d’envie et de constance peuvent déjà déplacer énormément de
          choses.”
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
        Parler à {companionProfile.name}
      </button>
    </div>
  );
}

function Run({
  runType,
  setRunType,
  duration,
  setDuration,
  availableVoices,
  selectedVoiceURI,
  setSelectedVoiceURI,
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceReady, setVoiceReady] = useState(false);
  const [announceSplits, setAnnounceSplits] = useState(true);
  const [routePoints, setRoutePoints] = useState([]);

  const watchIdRef = useRef(null);
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
        `Séance terminée. Bravo. Tu as complété ${duration} minutes de ${runType.toLowerCase()}.`,
        selectedVoiceURI,
        availableVoices
      );
    }
  }, [
    elapsedSeconds,
    targetSeconds,
    isRunning,
    voiceEnabled,
    duration,
    runType,
    selectedVoiceURI,
    availableVoices,
  ]);

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
        `${currentMinute} minutes effectuées. Il reste environ ${remainingMinutes} minutes.`,
        selectedVoiceURI,
        availableVoices
      );
    }
  }, [
    elapsedSeconds,
    isRunning,
    announceSplits,
    targetSeconds,
    voiceEnabled,
    selectedVoiceURI,
    availableVoices,
  ]);

  function unlockVoice() {
    const ok = primeSpeech(selectedVoiceURI, availableVoices);
    setVoiceReady(ok);
    if (ok) {
      speak(
        true,
        "Voix STRIDE activée.",
        selectedVoiceURI,
        availableVoices
      );
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

        setRoutePoints((prev) => [...prev, current]);

        if (lastPositionRef.current) {
          const dist = getDistance(lastPositionRef.current, current);

          if (dist > 0.001) {
            setDistance((d) => d + dist);
          }

          if (
            currentSpeed != null &&
            !Number.isNaN(currentSpeed) &&
            currentSpeed >= 0
          ) {
            setSpeed(Number((currentSpeed * 3.6).toFixed(1)));
          } else if (lastTimestampRef.current) {
            const deltaSeconds = (now - lastTimestampRef.current) / 1000;
            if (deltaSeconds > 0) {
              const speedKmH = (dist / deltaSeconds) * 3600;
              setSpeed(Number(speedKmH.toFixed(1)));
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

    watchIdRef.current = id;
  }

  function stopGPS() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    lastPositionRef.current = null;
    lastTimestampRef.current = null;
  }

  function handleStart() {
    setElapsedSeconds(0);
    setDistance(0);
    setSpeed(0);
    setRoutePoints([]);
    setIsRunning(true);
    setIsPaused(false);
    lastAnnouncedMinuteRef.current = null;
    startGPS();
    speak(
      voiceEnabled,
      `Séance démarrée. ${runType}. Objectif ${duration} minutes. Bonne séance.`,
      selectedVoiceURI,
      availableVoices
    );
  }

  function handlePauseResume() {
    if (isPaused) {
      setIsPaused(false);
      startGPS();
      speak(
        voiceEnabled,
        "Séance reprise.",
        selectedVoiceURI,
        availableVoices
      );
    } else {
      setIsPaused(true);
      stopGPS();
      speak(
        voiceEnabled,
        "Séance en pause.",
        selectedVoiceURI,
        availableVoices
      );
    }
  }

  function handleStop(withVoice = true) {
    setIsRunning(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setDistance(0);
    setSpeed(0);
    setRoutePoints([]);
    lastAnnouncedMinuteRef.current = null;
    stopGPS();

    if (withVoice) {
      speak(
        voiceEnabled,
        "Séance arrêtée.",
        selectedVoiceURI,
        availableVoices
      );
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

          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              Voix utilisée
            </div>

            <select
              value={selectedVoiceURI}
              onChange={(e) => setSelectedVoiceURI(e.target.value)}
              style={inputStyle}
            >
              {availableVoices.map((voice) => (
                <option
                  key={voice.voiceURI}
                  value={voice.voiceURI}
                  style={{ color: "black" }}
                >
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                speak(
                  true,
                  "Bonjour. Je suis la voix actuellement sélectionnée dans STRIDE.",
                  selectedVoiceURI,
                  availableVoices
                )
              }
              style={secondaryButtonStyle}
            >
              Tester la voix
            </button>
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
          Vitesse : {(speed || 0).toFixed(1)} km/h
        </div>

        <div style={{ fontSize: 14, marginBottom: 14 }}>
          Allure : {pace} /km
        </div>

        <RouteMiniMap points={routePoints} />

        <div
          style={{
            width: "100%",
            height: 12,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 999,
            overflow: "hidden",
            marginTop: 14,
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

function RouteMiniMap({ points }) {
  const width = 320;
  const height = 180;
  const padding = 16;

  if (!points || points.length < 2) {
    return (
      <div
        style={{
          height,
          borderRadius: 18,
          background:
            "radial-gradient(circle at top, rgba(124,92,255,0.12), rgba(255,255,255,0.03))",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.5)",
          fontSize: 14,
        }}
      >
        Le tracé GPS apparaîtra ici
      </div>
    );
  }

  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latRange = maxLat - minLat || 0.0001;
  const lngRange = maxLng - minLng || 0.0001;

  const mapped = points.map((p) => {
    const x =
      padding + ((p.longitude - minLng) / lngRange) * (width - padding * 2);
    const y =
      height -
      padding -
      ((p.latitude - minLat) / latRange) * (height - padding * 2);
    return { x, y };
  });

  const pathD = mapped
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const start = mapped[0];
  const end = mapped[mapped.length - 1];

  return (
    <div
      style={{
        borderRadius: 18,
        overflow: "hidden",
        background:
          "radial-gradient(circle at top, rgba(124,92,255,0.14), rgba(255,255,255,0.03))",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        <path
          d={pathD}
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle cx={start.x} cy={start.y} r="5" fill="#22c55e" />
        <circle cx={end.x} cy={end.y} r="6" fill="#ffffff" />
      </svg>
    </div>
  );
}

function Profile({
  duration,
  runType,
  companionProfile,
  setCompanionProfile,
  availableVoices,
  selectedVoiceURI,
  setSelectedVoiceURI,
}) {
  function updateField(key, value) {
    setCompanionProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

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
        <Label>Compagnon virtuel</Label>

        <div style={{ display: "grid", gap: 12 }}>
          <InputRow
            label="Prénom"
            value={companionProfile.name}
            onChange={(value) => updateField("name", value)}
            placeholder="Alicia"
          />

          <SelectRow
            label="Identité"
            value={companionProfile.identity}
            onChange={(value) => updateField("identity", value)}
            options={["femme", "homme", "IA"]}
          />

          <InputRow
            label="Âge"
            value={String(companionProfile.age)}
            onChange={(value) => updateField("age", value)}
            placeholder="25"
          />

          <SelectRow
            label="Rôle"
            value={companionProfile.role}
            onChange={(value) => updateField("role", value)}
            options={[
              "coach",
              "compagnon virtuel",
              "présence bienveillante",
              "ami proche",
              "allié motivation",
              "partenaire de progression",
            ]}
          />

          <SelectRow
            label="Style"
            value={companionProfile.tone}
            onChange={(value) => updateField("tone", value)}
            options={[
              "chaleureux",
              "tendre",
              "rassurant",
              "motivant",
              "stratégique",
              "calme",
            ]}
          />

          <InputRow
            label="Passions"
            value={companionProfile.passions}
            onChange={(value) => updateField("passions", value)}
            placeholder="running, bien-être, motivation"
          />

          <InputRow
            label="Hobbies"
            value={companionProfile.hobbies}
            onChange={(value) => updateField("hobbies", value)}
            placeholder="lecture, musique, course"
          />
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Label>Voix du compagnon</Label>

        <div style={{ display: "grid", gap: 12 }}>
          <select
            value={selectedVoiceURI}
            onChange={(e) => setSelectedVoiceURI(e.target.value)}
            style={inputStyle}
          >
            {availableVoices.map((voice) => (
              <option
                key={voice.voiceURI}
                value={voice.voiceURI}
                style={{ color: "black" }}
              >
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              speak(
                true,
                `${companionProfile.name} est prêt${
                  companionProfile.identity === "femme" ? "e" : ""
                } à te parler avec cette voix.`,
                selectedVoiceURI,
                availableVoices
              )
            }
            style={secondaryButtonStyle}
          >
            Tester la voix du compagnon
          </button>
        </div>
      </Card>
    </div>
  );
}

function InputRow({ label, value, onChange, placeholder }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

function SelectRow({ label, value, onChange, options }) {
  return (
    <div>
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      >
        {options.map((option) => (
          <option key={option} value={option} style={{ color: "black" }}>
            {option}
          </option>
        ))}
      </select>
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
  let seconds = Math.round(secondsPerKm % 60);
  let safeMinutes = minutes;

  if (seconds === 60) {
    safeMinutes += 1;
    seconds = 0;
  }

  return `${String(safeMinutes).padStart(2, "0")}:${String(seconds).padStart(
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

function primeSpeech(selectedVoiceURI, availableVoices) {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;

  try {
    const utterance = new SpeechSynthesisUtterance(" ");
    utterance.volume = 0;

    const selectedVoice = availableVoices.find(
      (voice) => voice.voiceURI === selectedVoiceURI
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = "fr-FR";
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

function speak(enabled, text, selectedVoiceURI = "", availableVoices = []) {
  if (!enabled) return;
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  try {
    const utterance = new SpeechSynthesisUtterance(text);

    const selectedVoice = availableVoices.find(
      (voice) => voice.voiceURI === selectedVoiceURI
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = "fr-FR";
    }

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {}
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

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "white",
  borderRadius: 16,
  padding: "14px 14px",
  fontSize: 16,
  outline: "none",
};
