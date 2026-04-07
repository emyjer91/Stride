function CoachPremiumV1() {
  const [goal, setGoal] = useState("10k");
  const [weeklyVolume, setWeeklyVolume] = useState(35);
  const [recentLoad, setRecentLoad] = useState(6);
  const [temperature, setTemperature] = useState(18);

  const [sleep, setSleep] = useState(7);
  const [fatigue, setFatigue] = useState(4);
  const [motivation, setMotivation] = useState(8);
  const [legs, setLegs] = useState(5);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Salut Jérémy. Je suis STRIDE Coach V2. Je prends maintenant en compte ton objectif, ton volume hebdo, ta charge récente, la température, ton sommeil, ta fatigue, ta motivation et l’état de tes jambes.",
    },
  ]);

  const goalLabel = useMemo(() => {
    if (goal === "5k") return "Objectif 5 km";
    if (goal === "10k") return "Objectif 10 km";
    if (goal === "semi") return "Objectif semi-marathon";
    return "Objectif forme générale";
  }, [goal]);

  const readinessScore = useMemo(() => {
    const score =
      (sleep / 10) * 28 +
      ((10 - fatigue) / 10) * 24 +
      (motivation / 10) * 16 +
      ((10 - legs) / 10) * 18 +
      ((10 - recentLoad) / 10) * 8 +
      (temperature <= 20 ? 6 : temperature <= 26 ? 3 : 0);

    return Math.max(0, Math.min(100, Math.round(score)));
  }, [sleep, fatigue, motivation, legs, recentLoad, temperature]);

  const readinessState = useMemo(() => {
    if (readinessScore >= 78) {
      return {
        label: "Très bonne fenêtre",
        color: "#22c55e",
        advice:
          "Tu peux encaisser une séance de qualité aujourd’hui si elle est prévue dans ta logique hebdomadaire.",
      };
    }
    if (readinessScore >= 60) {
      return {
        label: "État intermédiaire",
        color: "#f59e0b",
        advice:
          "Bonne journée pour un travail utile mais contrôlé. Reste précis, pas héroïque.",
      };
    }
    return {
      label: "Charge à surveiller",
      color: "#ef4444",
      advice:
        "Aujourd’hui, la priorité est de préserver la fraîcheur. Allège ou bascule sur une séance facile.",
    };
  }, [readinessScore]);

  const todayRecommendation = useMemo(() => {
    const hot = temperature >= 27;

    if (readinessScore < 60) {
      return {
        title: "Séance recommandée",
        value: hot
          ? "Footing très facile 25 à 35 min + hydratation renforcée"
          : "Footing facile 30 à 40 min ou récupération active",
      };
    }

    if (goal === "5k") {
      return {
        title: "Séance recommandée",
        value:
          readinessScore >= 78
            ? "Fractionné court ou séance de vitesse contrôlée"
            : "Footing progressif + éducatifs de course",
      };
    }

    if (goal === "10k") {
      return {
        title: "Séance recommandée",
        value:
          readinessScore >= 78
            ? "Tempo / allure 10 km contrôlée"
            : "Endurance active 35 à 50 min",
      };
    }

    if (goal === "semi") {
      return {
        title: "Séance recommandée",
        value:
          readinessScore >= 78
            ? "Bloc seuil modéré ou sortie longue qualitative"
            : "Sortie endurance stable",
      };
    }

    return {
      title: "Séance recommandée",
      value:
        readinessScore >= 78
          ? "Séance cardio qualitative modérée"
          : "Sortie facile orientée régularité",
    };
  }, [goal, readinessScore, temperature]);

  const nutritionAdvice = useMemo(() => {
    if (temperature >= 27) {
      return "Hydrate-toi davantage aujourd’hui et simplifie l’effort. Si séance > 45 min, pense hydratation avant et après.";
    }
    if (readinessScore < 60) {
      return "Priorité récupération : hydratation, repas simple et suffisamment glucidique, pas de restriction inutile.";
    }
    return "Avant une séance utile : carburant simple, digestible, sans gras lourd. Après : hydratation + apport correct en glucides/protéines.";
  }, [temperature, readinessScore]);

  const quickReplies = [
    "Que faire aujourd’hui ?",
    "Analyse mon état du jour",
    "Je vise un meilleur 10 km",
    "Que manger avant ma séance ?",
    "Il fait chaud dehors, j’adapte comment ?",
    "Je suis fatigué mais motivé",
  ];

  function buildContextSummary() {
    return `Contexte actuel :
- ${goalLabel}
- Volume hebdo : ${weeklyVolume} km
- Charge récente : ${recentLoad}/10
- Température : ${temperature}°C
- Sommeil : ${sleep}/10
- Fatigue : ${fatigue}/10
- Motivation : ${motivation}/10
- Jambes : ${legs}/10
- Readiness : ${readinessScore}/100`;
  }

  function generateCoachReply(text) {
    const t = text.toLowerCase();
    const context = buildContextSummary();

    if (t.includes("aujourd")) {
      return `${context}

Diagnostic rapide :
Ton état actuel indique : ${readinessState.label.toLowerCase()}.

Ce que je te recommande aujourd’hui :
${todayRecommendation.value}

Pourquoi :
Je croise ton sommeil, ta fatigue, tes jambes, ta charge récente et la température.

Erreur à éviter :
Vouloir absolument faire une grosse séance si la fraîcheur n’est pas là.`;
    }

    if (t.includes("état") || t.includes("jour")) {
      return `${context}

Lecture coach :
- sommeil : ${sleep >= 7 ? "correct à bon" : "à surveiller"}
- fatigue : ${fatigue <= 4 ? "bien maîtrisée" : "présente"}
- jambes : ${legs <= 4 ? "fraîches" : "chargées"}
- motivation : ${motivation >= 7 ? "forte" : "moyenne"}

Verdict :
${readinessState.advice}`;
    }

    if (t.includes("10 km") || t.includes("10km")) {
      return `${context}

Pour progresser sur 10 km :
1. une séance tempo / seuil chaque semaine
2. une séance de vitesse ou de soutien d’allure
3. une base facile solide
4. une vraie récupération

Aujourd’hui, vu ton état :
${todayRecommendation.value}`;
    }

    if (t.includes("manger") || t.includes("nutrition")) {
      return `${context}

Conseil nutrition du jour :
${nutritionAdvice}

Si la séance est intense :
- mange simple
- laisse digérer
- évite le trop gras / trop lourd

Si tu es fatigué :
- ne sous-alimente pas la récupération.`;
    }

    if (
      t.includes("chaud") ||
      t.includes("chaleur") ||
      t.includes("température") ||
      t.includes("temperature")
    ) {
      return `${context}

Adaptation chaleur :
- baisse l’allure cible
- juge la séance à l’effort ressenti
- hydrate-toi davantage
- raccourcis si besoin

À ${temperature}°C, vouloir tenir les mêmes allures qu’en conditions fraîches est souvent une erreur.`;
    }

    if (t.includes("fatigu")) {
      return `${context}

Tu peux être motivé sans être prêt à encaisser.

Ma lecture :
- fatigue : ${fatigue}/10
- jambes : ${legs}/10
- sommeil : ${sleep}/10

Recommandation :
${readinessScore < 60 ? "allège franchement" : "travaille utile mais contrôle l’intensité"}

Objectif :
protéger ta progression au lieu de la saboter par excès.`;
    }

    return `${context}

Je peux t’aider sur :
- la séance du jour
- l’analyse fatigue / récupération
- le 5 km / 10 km / semi
- la chaleur / météo
- le sommeil
- la nutrition avant ou après séance

Pose-moi une question concrète et je te répondrai comme un vrai coach.`;
  }

  function sendMessage(textFromQuickReply) {
    const value = (textFromQuickReply ?? input).trim();
    if (!value) return;

    const userMessage = { role: "user", content: value };
    const coachMessage = {
      role: "assistant",
      content: generateCoachReply(value),
    };

    setMessages((prev) => [...prev, userMessage, coachMessage]);
    setInput("");
  }

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
        COACH • Premium V2
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
        Coach STRIDE
      </h1>

      <p
        style={{
          marginTop: 14,
          color: "rgba(255,255,255,0.74)",
          fontSize: 16,
          lineHeight: 1.55,
        }}
      >
        Un coach plus intelligent, qui prend en compte ton objectif, ta charge,
        ton état du jour et les conditions extérieures.
      </p>

      <GlassCard style={{ marginTop: 22 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <MutedLabel>Readiness du jour</MutedLabel>
            <div style={{ fontSize: 24, fontWeight: 800 }}>
              {readinessScore}/100
            </div>
          </div>
          <div
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              background: hexToRgba(readinessState.color, 0.15),
              color: readinessState.color,
              fontSize: 12,
              fontWeight: 800,
              border: `1px solid ${hexToRgba(readinessState.color, 0.35)}`,
            }}
          >
            {readinessState.label}
          </div>
        </div>

        <div style={{ marginTop: 12, fontSize: 15, lineHeight: 1.5 }}>
          {readinessState.advice}
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
          <MutedLabel>Objectif</MutedLabel>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: "12px 12px",
              fontSize: 14,
            }}
          >
            <option value="5k" style={{ color: "black" }}>
              5 km
            </option>
            <option value="10k" style={{ color: "black" }}>
              10 km
            </option>
            <option value="semi" style={{ color: "black" }}>
              Semi
            </option>
            <option value="shape" style={{ color: "black" }}>
              Forme générale
            </option>
          </select>
        </GlassCard>

        <GlassCard>
          <MutedLabel>Température extérieure</MutedLabel>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{temperature}°C</div>
          <input
            type="range"
            min="0"
            max="35"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            style={{ width: "100%", marginTop: 10 }}
          />
        </GlassCard>
      </div>

      <GlassCard style={{ marginTop: 18 }}>
        <MutedLabel>Contexte d’entraînement</MutedLabel>
        <div style={{ display: "grid", gap: 14, marginTop: 8 }}>
          <SliderRow
            label="Volume hebdo"
            value={weeklyVolume}
            setValue={setWeeklyVolume}
            minLabel="10 km"
            maxLabel="80 km"
            min={10}
            max={80}
            step={1}
            unit=" km"
          />
          <SliderRow
            label="Charge récente"
            value={recentLoad}
            setValue={setRecentLoad}
            minLabel="faible"
            maxLabel="très élevée"
          />
        </div>
      </GlassCard>

      <GlassCard style={{ marginTop: 18 }}>
        <MutedLabel>Check-in quotidien</MutedLabel>
        <div style={{ display: "grid", gap: 14, marginTop: 8 }}>
          <SliderRow
            label="Sommeil"
            value={sleep}
            setValue={setSleep}
            minLabel="faible"
            maxLabel="excellent"
          />
          <SliderRow
            label="Fatigue"
            value={fatigue}
            setValue={setFatigue}
            minLabel="faible"
            maxLabel="élevée"
          />
          <SliderRow
            label="Motivation"
            value={motivation}
            setValue={setMotivation}
            minLabel="basse"
            maxLabel="forte"
          />
          <SliderRow
            label="Jambes"
            value={legs}
            setValue={setLegs}
            minLabel="fraîches"
            maxLabel="lourdes"
          />
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
          <MutedLabel>{todayRecommendation.title}</MutedLabel>
          <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.4 }}>
            {todayRecommendation.value}
          </div>
        </GlassCard>

        <GlassCard>
          <MutedLabel>Conseil nutrition</MutedLabel>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>{nutritionAdvice}</div>
        </GlassCard>
      </div>

      <GlassCard style={{ marginTop: 18 }}>
        <MutedLabel>Suggestions rapides</MutedLabel>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginTop: 8,
          }}
        >
          {quickReplies.map((item) => (
            <button
              key={item}
              onClick={() => sendMessage(item)}
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: "white",
                padding: "10px 12px",
                borderRadius: 999,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard style={{ marginTop: 18 }}>
        <MutedLabel>Discussion coach</MutedLabel>

        <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
          {messages.slice(-8).map((message, index) => (
            <div
              key={index}
              style={{
                background:
                  message.role === "user"
                    ? "linear-gradient(135deg, #9333ea, #2563eb)"
                    : "rgba(255,255,255,0.05)",
                border:
                  message.role === "user"
                    ? "none"
                    : "1px solid rgba(255,255,255,0.08)",
                color: "white",
                borderRadius: 18,
                padding: "12px 14px",
                maxWidth: "88%",
                fontSize: 14,
                lineHeight: 1.55,
                whiteSpace: "pre-line",
                justifySelf: message.role === "user" ? "end" : "start",
              }}
            >
              {message.content}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: j’ai mal dormi et il fait 28°C, je fais quoi ?"
            style={{
              flex: 1,
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              color: "white",
              padding: "14px 14px",
              fontSize: 14,
              outline: "none",
            }}
          />
          <button
            onClick={() => sendMessage()}
            style={{
              border: "none",
              borderRadius: 16,
              background: "linear-gradient(135deg, #9333ea, #2563eb)",
              color: "white",
              fontWeight: 800,
              padding: "0 16px",
              cursor: "pointer",
            }}
          >
            Envoyer
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
