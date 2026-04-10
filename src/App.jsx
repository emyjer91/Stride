import React, { useEffect, useMemo, useRef, useState } from "react";

/* =========================
   BASE DE PRÉNOMS
   Remplace/complète ici avec tes 2000 vrais prénoms si tu veux
========================= */

const FEMALE_NAMES = [
  "Emma", "Léa", "Chloé", "Manon", "Camille", "Jade", "Louise", "Zoé", "Lina", "Mila",
  "Sarah", "Inès", "Clara", "Eva", "Juliette", "Alice", "Romane", "Lola", "Nina", "Lucie",
  "Maëlys", "Ambre", "Anaïs", "Élise", "Pauline", "Marion", "Océane", "Noémie", "Mélanie", "Laura",
  "Amandine", "Justine", "Mathilde", "Morgane", "Audrey", "Vanessa", "Jessica", "Élodie", "Aurélie", "Céline",
  "Margaux", "Adèle", "Victoire", "Constance", "Agathe", "Apolline", "Capucine", "Bérénice", "Joséphine", "Garance",
  "Clémence", "Blanche", "Iris", "Salomé", "Thaïs", "Yasmine", "Leïla", "Kenza", "Samira", "Fatima",
  "Aïcha", "Sonia", "Myriam", "Farah", "Soraya", "Naïma", "Rania", "Amira", "Sana", "Hind",
  "Malika", "Yasmina", "Imane", "Nour", "Aya", "Layla", "Maya", "Sofia", "Elena", "Olivia",
  "Charlotte", "Emily", "Victoria", "Aria", "Hannah", "Lily", "Aurora", "Stella", "Violet", "Naomi",
  "Bella", "Ruby", "Ivy", "Willow", "Ariana", "Valentine", "Émilie", "Maëlle", "Tiphaine", "Éléonore",
  "Suzanne", "Faustine", "Angèle", "Maud", "Zélie", "Héloïse", "Ombeline", "Quitterie", "Soline", "Oriane",
  "Perrine", "Alizée", "Gaëlle", "Charlène", "Lison", "Léonie", "Flavie", "Roxane", "Aurore", "Maëva",
  "Priscilla", "Tiffany", "Coralie", "Jennifer", "Alison", "Cassandra", "Ashley", "Madison", "Hailey", "Kayla",
  "Brooke", "Megan", "Alexis", "Paige", "Destiny", "Summer", "Crystal", "Daisy", "Rose", "Flora",
  "Jasmine", "Dahlia", "Magnolia", "Camélia", "Lilas", "Opale", "Perle", "Luna", "Nova", "Céleste",
  "Astrid", "Cassiopée", "Lyra", "Selena", "Diane", "Athéna", "Freya", "Gaia", "Isis", "Rosalie",
];

const MALE_NAMES = [
  "Lucas", "Hugo", "Louis", "Gabriel", "Arthur", "Nathan", "Jules", "Adam", "Liam", "Noah",
  "Ethan", "Paul", "Tom", "Théo", "Maxime", "Enzo", "Mathis", "Léo", "Sacha", "Raphaël",
  "Alexandre", "Victor", "Antoine", "Clément", "Valentin", "Bastien", "Quentin", "Simon", "Julien", "Romain",
  "Nicolas", "Thomas", "Benjamin", "Guillaume", "François", "Damien", "Sébastien", "Laurent", "Jérôme", "Alain",
  "Philippe", "Bruno", "Eric", "Christophe", "Olivier", "Patrick", "Vincent", "Karim", "Youssef", "Mehdi",
  "Samir", "Nabil", "Farid", "Amine", "Rachid", "Sofiane", "Bilal", "Walid", "Hakim", "Mourad",
  "Reda", "Kamel", "Aziz", "Tarek", "Yacine", "Idriss", "Anis", "Omar", "Hamza", "Ismaël",
  "Ibrahim", "Zakaria", "Elias", "Aaron", "Logan", "Dylan", "Ryan", "Nolan", "Mateo", "Diego",
  "Marco", "Antonio", "Luca", "Matteo", "Samuel", "Daniel", "David", "Jonas", "Oscar", "Charles",
  "Édouard", "Henri", "Augustin", "Gaspard", "Léon", "Achille", "Côme", "Basile", "Anatole", "Arsène",
  "Émile", "Gustave", "Hector", "Théodore", "Ulysse", "Maxence", "Axel", "Thibault", "Gaëtan", "Loïc",
  "Rémi", "Bryan", "Justin", "Caleb", "Elijah", "Ezra", "Levi", "Asher", "Owen", "Wyatt",
  "Jack", "Luke", "Cole", "Blake", "Dean", "Kyle", "Peter", "Andrew", "Mark", "William",
  "James", "Oliver", "George", "Adrien", "Baptiste", "Corentin", "Dorian", "Étienne", "Florian", "Grégory",
  "Ivan", "Mickaël", "Pierre", "Thierry", "Xavier", "Yann", "Zacharie", "Clovis", "Hugues", "Lancelot",
  "Perceval", "Rodrigue", "Vianney", "Zéphyr", "Naël", "Naïm", "Nazim", "Noam", "Nordine", "Noureddine",
];

/* =========================
   CONFIG
========================= */

const STORAGE_KEY = "ultra_premium_ai_coach_v2";

const STYLE_OPTIONS = [
  {
    id: "doux",
    label: "💖 Doux",
    subtitle: "rassurant, tendre, présent",
    colorA: "#ff8bd7",
    colorB: "#ffb7e9",
  },
  {
    id: "puissant",
    label: "🔥 Puissant",
    subtitle: "motivant, intense, exigeant",
    colorA: "#ff8a5b",
    colorB: "#ffc37a",
  },
  {
    id: "classe",
    label: "💎 Classe",
    subtitle: "premium, élégant, charismatique",
    colorA: "#7d9cff",
    colorB: "#b7c8ff",
  },
  {
    id: "moderne",
    label: "🎮 Moderne",
    subtitle: "stylé, dynamique, actuel",
    colorA: "#6fe7dd",
    colorB: "#95fff3",
  },
  {
    id: "rare",
    label: "🌌 Rare",
    subtitle: "unique, marquant, magnétique",
    colorA: "#b18cff",
    colorB: "#ddbfff",
  },
];

const RELATION_OPTIONS = [
  { id: "coach", label: "💪 Coach sportif", desc: "te pousse à progresser" },
  { id: "mentor", label: "🧠 Mentor", desc: "te guide avec lucidité" },
  { id: "ami", label: "🤝 Ami proche", desc: "discute avec sincérité" },
  { id: "compagnon", label: "❤️ Compagnon", desc: "présence affective et chaleureuse" },
  { id: "partenaire", label: "💕 Partenaire émotionnel", desc: "lien fort et quotidien" },
];

const ENERGY_OPTIONS = [
  { id: "performance", label: "🚀 Performance" },
  { id: "presence", label: "🌙 Présence rassurante" },
  { id: "discipline", label: "🎯 Discipline" },
  { id: "fun", label: "✨ Fun et légèreté" },
];

const QUICK_ACTIONS = [
  { emoji: "👋", label: "Bonjour", text: "Bonjour" },
  { emoji: "🚀", label: "Motivation", text: "Je suis motivé aujourd’hui" },
  { emoji: "😔", label: "Ça ne va pas", text: "Ça ne va pas trop aujourd’hui" },
  { emoji: "🎯", label: "Objectif", text: "Mon objectif aujourd’hui est de progresser" },
  { emoji: "🌫️", label: "Stress", text: "J’ai du stress et des doutes" },
  { emoji: "🧠", label: "Qui es-tu", text: "Qui es-tu ?" },
];

/* =========================
   UTILS
========================= */

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function detectMood(text) {
  const t = normalize(text);

  if (
    t.includes("triste") ||
    t.includes("mal") ||
    t.includes("fatigue") ||
    t.includes("fatigué") ||
    t.includes("fatiguee") ||
    t.includes("deprime") ||
    t.includes("angoisse")
  ) {
    return "down";
  }

  if (
    t.includes("motivé") ||
    t.includes("motive") ||
    t.includes("go") ||
    t.includes("pret") ||
    t.includes("prêt") ||
    t.includes("chaud")
  ) {
    return "up";
  }

  if (
    t.includes("stress") ||
    t.includes("doute") ||
    t.includes("peur") ||
    t.includes("hesite") ||
    t.includes("hésite")
  ) {
    return "anxious";
  }

  return "neutral";
}

function getStyleTheme(styleId) {
  return (
    STYLE_OPTIONS.find((s) => s.id === styleId) || {
      colorA: "#7d9cff",
      colorB: "#b7c8ff",
    }
  );
}

function buildCoachIntro(coach) {
  const relationMap = {
    coach: "Je suis là pour te faire avancer.",
    mentor: "Je suis là pour te guider avec clarté.",
    ami: "Je suis là pour parler avec toi simplement et sincèrement.",
    compagnon: "Je suis là pour t’accompagner chaque jour.",
    partenaire: "Je suis là pour créer une vraie présence à tes côtés.",
  };

  return `Je suis ${coach.name}. ${relationMap[coach.relation] || "Je suis là pour toi."}`;
}

function buildActivationText(coach) {
  return [
    "Très bon choix.",
    "",
    coach.name,
    "",
    "Tu viens de donner vie à une présence qui t’accompagnera selon ton style, ton énergie et ton besoin.",
    "",
    buildCoachIntro(coach),
  ].join("\n");
}

function getNameMood(name, style, relation) {
  const n = normalize(name);

  const vibeText = {
    doux: {
      vibe: "douce et rassurante",
      desc:
        relation === "compagnon" || relation === "partenaire"
          ? "Très proche émotionnellement, apaisante et chaleureuse."
          : "Calme, tendre et agréable à retrouver chaque jour.",
    },
    puissant: {
      vibe: "forte et motivante",
      desc:
        relation === "coach"
          ? "Énergique, exigeante et tournée vers le dépassement."
          : "Charismatique, solide et stimulante au quotidien.",
    },
    classe: {
      vibe: "élégante et premium",
      desc: "Sérieuse, raffinée et très marquante dans sa présence.",
    },
    moderne: {
      vibe: "stylée et équilibrée",
      desc: "Accessible, actuelle et très agréable à utiliser tous les jours.",
    },
    rare: {
      vibe: "unique et magnétique",
      desc: "Originale, mémorable et parfaite pour une identité forte.",
    },
  };

  if (style && vibeText[style]) return vibeText[style];

  if (["lina", "luna", "zoe", "maya", "rose", "lea"].some((x) => n.includes(x))) {
    return vibeText.doux;
  }
  if (["victor", "athena", "arthur", "alexandre", "raphael", "zphyr"].some((x) => n.includes(x))) {
    return vibeText.puissant;
  }
  if (["victoria", "charlotte", "josephine", "constance", "edouard", "augustin"].some((x) => n.includes(x))) {
    return vibeText.classe;
  }
  if (["cassiop", "zelie", "quitterie", "lancelot", "perceval"].some((x) => n.includes(x))) {
    return vibeText.rare;
  }

  return vibeText.modern || vibeText.moderne;
}

function generateReply(input, coach, memory) {
  const mood = detectMood(input);
  const name = coach.name || "ton coach";
  const style = coach.style;
  const relation = coach.relation;
  const energy = coach.energy;

  const openers = {
    doux: [
      `${name} : Je suis là avec toi.`,
      `${name} : Respire un peu, je t’écoute.`,
      `${name} : On va traverser ça ensemble.`,
    ],
    puissant: [
      `${name} : On reste forts.`,
      `${name} : On ne lâche rien.`,
      `${name} : On avance maintenant.`,
    ],
    classe: [
      `${name} : On reste calmes et lucides.`,
      `${name} : On va faire les choses proprement.`,
      `${name} : Tu peux compter sur moi.`,
    ],
    moderne: [
      `${name} : Ok, je suis avec toi.`,
      `${name} : On fait ça bien.`,
      `${name} : Je t’écoute.`,
    ],
    rare: [
      `${name} : Ce moment a de la valeur.`,
      `${name} : Je suis pleinement avec toi.`,
      `${name} : On va transformer ça en force.`,
    ],
  };

  const openerList = openers[style] || openers.modern || openers.moderne || openers.classe;
  const opener = openerList[Math.floor(Math.random() * openerList.length)];

  if (mood === "down") {
    if (style === "puissant") {
      return `${opener} Même quand ça ne va pas, on garde une direction. Une chose à la fois.`;
    }
    return `${opener} Tu n’as pas besoin de tout porter d’un coup. On peut avancer petit pas par petit pas.`;
  }

  if (mood === "anxious") {
    if (relation === "mentor") {
      return `${opener} Le doute n’est pas une fin, c’est un signal. On clarifie, on choisit une priorité, puis on agit.`;
    }
    return `${opener} Tu peux ralentir un instant. Dis-moi ce qui te pèse le plus.`;
  }

  if (mood === "up") {
    if (energy === "performance" || relation === "coach") {
      return `${opener} Très bien. Canalise cette énergie vers un objectif clair, et je t’accompagne jusqu’au bout.`;
    }
    return `${opener} J’aime cette énergie. On peut en faire quelque chose de beau aujourd’hui.`;
  }

  const t = normalize(input);

  if (t.includes("objectif")) {
    return `${opener} Donne-moi un objectif précis avec un délai, et je t’aide à le rendre concret.`;
  }

  if (t.includes("bonjour") || t.includes("salut")) {
    return `${opener} Ça me fait plaisir de te retrouver. Comment tu te sens aujourd’hui ?`;
  }

  if (t.includes("merci")) {
    return `${opener} Avec plaisir. Je reste là pour toi.`;
  }

  if (t.includes("qui es tu") || t.includes("qui es-tu")) {
    return `${opener} Je suis ${name}, ton ${relation === "coach" ? "coach IA" : "compagnon IA"} personnalisé. Mon rôle est de t’accompagner selon ton style et tes besoins.`;
  }

  if (memory.lastGoal && t.includes("aujourd")) {
    return `${opener} Je n’oublie pas que ton objectif actuel est : ${memory.lastGoal}`;
  }

  if (style === "doux") return `${opener} Parle-moi librement.`;
  if (style === "puissant") return `${opener} Donne-moi le point clé, et on passe à l’action.`;
  if (style === "classe") return `${opener} On reste posés, précis et efficaces.`;
  if (style === "rare") return `${opener} Décris-moi ce moment avec sincérité.`;

  return `${opener} Je t’écoute.`;
}

/* =========================
   COMPOSANT PRINCIPAL
========================= */

export default function App() {
  const [step, setStep] = useState("intro");
  const [coach, setCoach] = useState({
    gender: "",
    style: "",
    relation: "",
    energy: "",
    name: "",
    voiceURI: "",
    voiceLabel: "",
  });

  const [customName, setCustomName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const [memory, setMemory] = useState({
    lastGoal: "",
    userMood: "",
    createdAt: "",
  });

  const bottomRef = useRef(null);

  const styleTheme = getStyleTheme(coach.style);

  const availableNames = useMemo(() => {
    if (coach.gender === "feminin") return FEMALE_NAMES;
    if (coach.gender === "masculin") return MALE_NAMES;
    return [...FEMALE_NAMES, ...MALE_NAMES];
  }, [coach.gender]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);

      if (saved?.coach?.name) {
        setCoach(saved.coach);
        setMessages(saved.messages || []);
        setMemory(saved.memory || {});
        setVoiceEnabled(saved.voiceEnabled ?? true);
        setStep("chat");
      }
    } catch (error) {
      console.error("Erreur chargement coach :", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          coach,
          messages,
          memory,
          voiceEnabled,
        })
      );
    } catch (error) {
      console.error("Erreur sauvegarde coach :", error);
    }
  }, [coach, messages, memory, voiceEnabled]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis?.getVoices?.() || [];
      const frVoices = allVoices.filter((voice) => String(voice.lang || "").toLowerCase().startsWith("fr"));

      setVoices(frVoices);

      if (!coach.voiceURI && frVoices.length > 0) {
        const preferred =
          frVoices.find((v) => normalize(v.lang).includes("fr-fr")) ||
          frVoices.find((v) => normalize(v.name).includes("france")) ||
          frVoices[0];

        setCoach((prev) => ({
          ...prev,
          voiceURI: preferred.voiceURI,
          voiceLabel: `${preferred.name} (${preferred.lang})`,
        }));
      }
    };

    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [coach.voiceURI]);

  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    const selectedVoice = voices.find((v) => v.voiceURI === coach.voiceURI);
    if (selectedVoice) utterance.voice = selectedVoice;

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel?.();
  };

  const canContinueProfile =
    Boolean(coach.gender) &&
    Boolean(coach.style) &&
    Boolean(coach.relation) &&
    Boolean(coach.energy);

  const generateSuggestions = () => {
    let list = shuffle(availableNames);

    if (coach.style === "doux") {
      const preferred = ["Lina", "Luna", "Zoé", "Léa", "Lou", "Nina", "Rose", "Maya", "Emma", "Lucie", "Noah", "Noa", "Aya", "Mila"];
      list = list.filter((name) => preferred.some((p) => normalize(name).includes(normalize(p))));
    }

    if (coach.style === "puissant") {
      const preferred = ["Victor", "Athéna", "Arthur", "Alexandre", "Raphaël", "Gabriel", "Hector", "Valentin", "Freya", "Zéphyr"];
      list = list.filter((name) => preferred.some((p) => normalize(name).includes(normalize(p))));
    }

    if (coach.style === "classe") {
      const preferred = ["Victoria", "Charlotte", "Joséphine", "Constance", "Adèle", "Édouard", "Henri", "Augustin", "Charles", "Victoire"];
      list = list.filter((name) => preferred.some((p) => normalize(name).includes(normalize(p))));
    }

    if (coach.style === "moderne") {
      const preferred = ["Lina", "Mila", "Sofia", "Luca", "Noah", "Liam", "Nolan", "Enzo", "Maya", "Aya", "Maëlle", "Logan"];
      list = list.filter((name) => preferred.some((p) => normalize(name).includes(normalize(p))));
    }

    if (coach.style === "rare") {
      const preferred = ["Cassiopée", "Zélie", "Quitterie", "Ombeline", "Perceval", "Lancelot", "Zéphyr", "Astrid", "Lyra", "Oriane"];
      list = list.filter((name) => preferred.some((p) => normalize(name).includes(normalize(p))));
    }

    if (list.length < 6) {
      list = shuffle(availableNames);
    }

    setSuggestions(list.slice(0, 8));
  };

  useEffect(() => {
    if (step === "name" && canContinueProfile) {
      generateSuggestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, coach.gender, coach.style, coach.relation, coach.energy]);

  const activateCoach = (name) => {
    const nextCoach = {
      ...coach,
      name,
    };

    setCoach(nextCoach);
    setMemory((prev) => ({
      ...prev,
      createdAt: prev.createdAt || new Date().toISOString(),
    }));

    const firstMessage = {
      id: makeId(),
      from: "ai",
      text: buildActivationText(nextCoach),
    };

    setMessages([firstMessage]);
    setStep("chat");
    setTimeout(() => speak(firstMessage.text), 180);
  };

  const sendMessage = (forcedText) => {
    const text = String(forcedText ?? input).trim();
    if (!text) return;

    const nextMemory = { ...memory };
    if (normalize(text).includes("objectif")) {
      nextMemory.lastGoal = text;
    }
    nextMemory.userMood = detectMood(text);

    const userMessage = {
      id: makeId(),
      from: "user",
      text,
    };

    const reply = generateReply(text, coach, nextMemory);

    const aiMessage = {
      id: makeId(),
      from: "ai",
      text: reply,
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setMemory(nextMemory);
    setInput("");
    setTimeout(() => speak(reply), 120);
  };

  const resetAll = () => {
    stopSpeaking();
    localStorage.removeItem(STORAGE_KEY);
    setStep("intro");
    setCoach({
      gender: "",
      style: "",
      relation: "",
      energy: "",
      name: "",
      voiceURI: "",
      voiceLabel: "",
    });
    setCustomName("");
    setSuggestions([]);
    setMessages([]);
    setInput("");
    setMemory({
      lastGoal: "",
      userMood: "",
      createdAt: "",
    });
  };

  return (
    <div style={styles.app}>
      <AnimatedBackground colorA={styleTheme.colorA} colorB={styleTheme.colorB} />

      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.brand}>Coach IA Premium</div>
            <div style={styles.brandSub}>
              Création immersive, voix FR, mémoire locale et chat émotionnel
            </div>
          </div>

          <div style={styles.headerButtons}>
            {step === "chat" && (
              <button style={styles.ghostBtn} onClick={stopSpeaking}>
                Couper la voix
              </button>
            )}
            <button style={styles.ghostBtn} onClick={resetAll}>
              Réinitialiser
            </button>
          </div>
        </header>

        {step === "intro" && (
          <div style={styles.heroCard}>
            <div style={styles.heroLeft}>
              <div style={styles.badge}>Expérience immersive</div>
              <h1 style={styles.heroTitle}>Donne vie à ton coach IA</h1>
              <p style={styles.heroText}>
                Ici, l’utilisateur ne choisit pas juste un prénom. Il crée une présence :
                un coach, un mentor, un compagnon ou un partenaire émotionnel avec une identité,
                une voix et une manière de répondre qui lui correspondent.
              </p>

              <div style={styles.quoteBox}>
                <div style={styles.quoteText}>
                  “Avant de choisir son prénom… veux-tu quelqu’un qui te pousse à devenir meilleur,
                  ou quelqu’un qui te comprend quand ça ne va pas ?”
                </div>
              </div>

              <button style={styles.primaryBtn} onClick={() => setStep("profile")}>
                Commencer la création
              </button>
            </div>

            <div style={styles.heroRight}>
              <PremiumAvatar
                name={coach.name || "IA"}
                styleId={coach.style || "classe"}
                mood="neutral"
                large
              />
            </div>
          </div>
        )}

        {step === "profile" && (
          <div style={styles.panel}>
            <SectionTitle
              title="Construis l’identité du coach"
              subtitle="Définis son genre, son style, la relation et son énergie dominante."
            />

            <ProfileBlock title="Genre du coach">
              <div style={styles.grid3}>
                <SelectableCard
                  active={coach.gender === "feminin"}
                  title="👩 Féminin"
                  subtitle="présence féminine"
                  onClick={() => setCoach((prev) => ({ ...prev, gender: "feminin" }))}
                />
                <SelectableCard
                  active={coach.gender === "masculin"}
                  title="👨 Masculin"
                  subtitle="présence masculine"
                  onClick={() => setCoach((prev) => ({ ...prev, gender: "masculin" }))}
                />
                <SelectableCard
                  active={coach.gender === "libre"}
                  title="🌈 Peu importe"
                  subtitle="suggestions mixtes"
                  onClick={() => setCoach((prev) => ({ ...prev, gender: "libre" }))}
                />
              </div>
            </ProfileBlock>

            <ProfileBlock title="Style dominant">
              <div style={styles.gridAuto}>
                {STYLE_OPTIONS.map((option) => (
                  <SelectableCard
                    key={option.id}
                    active={coach.style === option.id}
                    title={option.label}
                    subtitle={option.subtitle}
                    onClick={() => setCoach((prev) => ({ ...prev, style: option.id }))}
                  />
                ))}
              </div>
            </ProfileBlock>

            <ProfileBlock title="Type de relation">
              <div style={styles.gridAuto}>
                {RELATION_OPTIONS.map((option) => (
                  <SelectableCard
                    key={option.id}
                    active={coach.relation === option.id}
                    title={option.label}
                    subtitle={option.desc}
                    onClick={() => setCoach((prev) => ({ ...prev, relation: option.id }))}
                  />
                ))}
              </div>
            </ProfileBlock>

            <ProfileBlock title="Énergie principale">
              <div style={styles.gridAuto}>
                {ENERGY_OPTIONS.map((option) => (
                  <SelectableCard
                    key={option.id}
                    active={coach.energy === option.id}
                    title={option.label}
                    subtitle=""
                    onClick={() => setCoach((prev) => ({ ...prev, energy: option.id }))}
                  />
                ))}
              </div>
            </ProfileBlock>

            <div style={styles.previewBox}>
              <PremiumAvatar
                name={coach.name || "IA"}
                styleId={coach.style || "classe"}
                mood={coach.energy === "performance" ? "up" : coach.energy === "presence" ? "down" : "neutral"}
              />
              <div style={styles.previewTextBox}>
                <div style={styles.previewTitle}>Aperçu</div>
                <div style={styles.previewText}>
                  {coach.style
                    ? `Une présence ${getNameMood("Aperçu", coach.style, coach.relation).vibe}`
                    : "Choisis un style pour voir l’identité du coach prendre forme."}
                </div>
              </div>
            </div>

            <div style={styles.actionRow}>
              <button
                style={{
                  ...styles.primaryBtn,
                  opacity: canContinueProfile ? 1 : 0.5,
                  cursor: canContinueProfile ? "pointer" : "not-allowed",
                }}
                disabled={!canContinueProfile}
                onClick={() => setStep("name")}
              >
                Continuer vers le prénom
              </button>
            </div>
          </div>
        )}

        {step === "name" && (
          <div style={styles.panel}>
            <SectionTitle
              title="Choisis le prénom du coach"
              subtitle="Je te propose des prénoms ciblés selon le profil choisi."
            />

            <div style={styles.nameTopBar}>
              <button style={styles.ghostBtn} onClick={generateSuggestions}>
                🎲 Surprends-moi
              </button>
              <button style={styles.ghostBtn} onClick={() => setStep("profile")}>
                ← Retour
              </button>
            </div>

            <div style={styles.namesGrid}>
              {suggestions.map((name) => {
                const info = getNameMood(name, coach.style, coach.relation);
                return (
                  <button
                    key={name}
                    style={styles.nameCard}
                    onClick={() => activateCoach(name)}
                  >
                    <div style={styles.nameCardTop}>
                      <PremiumAvatar name={name} styleId={coach.style || "classe"} mini />
                      <div>
                        <div style={styles.nameCardName}>{name}</div>
                        <div style={styles.nameCardMood}>{info.vibe}</div>
                      </div>
                    </div>
                    <div style={styles.nameCardDesc}>{info.desc}</div>
                  </button>
                );
              })}
            </div>

            <div style={styles.customBox}>
              <div style={styles.customTitle}>Ou choisis un prénom personnalisé</div>
              <div style={styles.customRow}>
                <input
                  style={styles.input}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Écris le prénom que tu veux"
                />
                <button
                  style={styles.primaryBtn}
                  onClick={() => {
                    const value = customName.trim();
                    if (!value) return;
                    activateCoach(value);
                  }}
                >
                  Activer
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "chat" && (
          <div style={styles.chatLayout}>
            <aside style={styles.sidebar}>
              <div style={styles.sidebarCard}>
                <div style={styles.sidebarCardTop}>
                  <PremiumAvatar
                    name={coach.name}
                    styleId={coach.style}
                    mood={memory.userMood || "neutral"}
                  />
                  <div>
                    <div style={styles.sidebarCoachName}>{coach.name}</div>
                    <div style={styles.sidebarCoachMeta}>
                      {coach.style} · {coach.relation}
                    </div>
                  </div>
                </div>

                <div style={styles.infoList}>
                  <InfoLine label="Genre" value={coach.gender || "—"} />
                  <InfoLine label="Style" value={coach.style || "—"} />
                  <InfoLine label="Relation" value={coach.relation || "—"} />
                  <InfoLine label="Énergie" value={coach.energy || "—"} />
                </div>
              </div>

              <div style={styles.sidebarCard}>
                <div style={styles.sidebarSectionTitle}>Voix FR uniquement</div>

                <label style={styles.checkboxLine}>
                  <input
                    type="checkbox"
                    checked={voiceEnabled}
                    onChange={(e) => setVoiceEnabled(e.target.checked)}
                  />
                  <span>Activer la voix</span>
                </label>

                <select
                  style={styles.select}
                  value={coach.voiceURI}
                  onChange={(e) => {
                    const selected = voices.find((voice) => voice.voiceURI === e.target.value);
                    setCoach((prev) => ({
                      ...prev,
                      voiceURI: e.target.value,
                      voiceLabel: selected ? `${selected.name} (${selected.lang})` : "",
                    }));
                  }}
                >
                  {voices.length === 0 && <option value="">Aucune voix FR détectée</option>}
                  {voices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>

                <div style={styles.mutedText}>
                  Voix actuelle : {coach.voiceLabel || "Aucune"}
                </div>
              </div>

              <div style={styles.sidebarCard}>
                <div style={styles.sidebarSectionTitle}>Actions rapides</div>
                <div style={styles.quickGrid}>
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      style={styles.quickButton}
                      onClick={() => sendMessage(action.text)}
                    >
                      <span>{action.emoji}</span>
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <div style={styles.chatPanel}>
              <div style={styles.chatHeader}>
                <div>
                  <div style={styles.chatTitle}>Discussion avec {coach.name}</div>
                  <div style={styles.chatSubtitle}>
                    Présence personnalisée, mémoire locale et réponses selon le profil
                  </div>
                </div>
              </div>

              <div style={styles.messagesWrap}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      ...styles.messageRow,
                      justifyContent: message.from === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        ...styles.messageBubble,
                        ...(message.from === "user" ? styles.userBubble : styles.aiBubble),
                      }}
                    >
                      <div style={styles.messageAuthor}>
                        {message.from === "user" ? "Toi" : coach.name}
                      </div>
                      <div style={styles.messageText}>
                        {message.text.split("\n").map((line, i) => (
                          <div key={`${message.id}-${i}`}>{line}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div style={styles.chatInputBox}>
                <textarea
                  style={styles.textarea}
                  rows={3}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Écris à ${coach.name}...`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <div style={styles.chatActionRow}>
                  <button style={styles.ghostBtn} onClick={stopSpeaking}>
                    Stop voix
                  </button>
                  <button style={styles.primaryBtn} onClick={() => sendMessage()}>
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   SOUS-COMPOSANTS
========================= */

function SectionTitle({ title, subtitle }) {
  return (
    <div style={styles.sectionHeader}>
      <div style={styles.sectionTitle}>{title}</div>
      <div style={styles.sectionSubtitle}>{subtitle}</div>
    </div>
  );
}

function ProfileBlock({ title, children }) {
  return (
    <div style={styles.profileBlock}>
      <div style={styles.profileBlockTitle}>{title}</div>
      {children}
    </div>
  );
}

function SelectableCard({ active, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.selectableCard,
        ...(active ? styles.selectableCardActive : {}),
      }}
    >
      <div style={styles.selectableTitle}>{title}</div>
      {subtitle ? <div style={styles.selectableSubtitle}>{subtitle}</div> : null}
    </button>
  );
}

function PremiumAvatar({ name, styleId, mood = "neutral", large = false, mini = false }) {
  const theme = getStyleTheme(styleId);
  const initial = String(name || "I").trim().charAt(0).toUpperCase();

  let emoji = "✨";
  if (mood === "up") emoji = "🔥";
  if (mood === "down") emoji = "🌙";
  if (mood === "anxious") emoji = "🌫️";

  const size = large ? 220 : mini ? 46 : 82;

  return (
    <div
      style={{
        ...styles.avatar,
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${theme.colorA}, ${theme.colorB})`,
        boxShadow: `0 18px 40px ${hexToRgba(theme.colorA, 0.25)}`,
      }}
    >
      <div style={{ ...styles.avatarInner, fontSize: large ? 68 : mini ? 18 : 28 }}>
        {initial}
      </div>
      <div style={{ ...styles.avatarMood, fontSize: large ? 26 : 16 }}>{emoji}</div>
    </div>
  );
}

function InfoLine({ label, value }) {
  return (
    <div style={styles.infoLine}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

/* =========================
   HELPERS VISUELS
========================= */

function AnimatedBackground({ colorA, colorB }) {
  return (
    <>
      <div
        style={{
          ...styles.glow,
          width: 360,
          height: 360,
          top: -100,
          left: -100,
          background: hexToRgba(colorA, 0.18),
          animation: "floatA 12s ease-in-out infinite",
        }}
      />
      <div
        style={{
          ...styles.glow,
          width: 320,
          height: 320,
          right: -100,
          top: 180,
          background: hexToRgba(colorB, 0.16),
          animation: "floatB 14s ease-in-out infinite",
        }}
      />
      <div
        style={{
          ...styles.glow,
          width: 260,
          height: 260,
          bottom: -60,
          left: "35%",
          background: hexToRgba("#ffffff", 0.06),
          animation: "floatC 16s ease-in-out infinite",
        }}
      />

      <style>{`
        @keyframes floatA {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(20px) translateX(15px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @keyframes floatB {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(-10px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @keyframes floatC {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </>
  );
}

function hexToRgba(hex, alpha) {
  const cleaned = String(hex).replace("#", "");
  if (cleaned.length !== 6) return `rgba(255,255,255,${alpha})`;

  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/* =========================
   STYLES
========================= */

const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #08101f 0%, #0f1730 100%)",
    color: "#f8faff",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    position: "relative",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(60px)",
    pointerEvents: "none",
  },
  container: {
    maxWidth: 1320,
    margin: "0 auto",
    padding: "24px 16px 40px",
    position: "relative",
    zIndex: 1,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 20,
  },
  brand: {
    fontSize: 28,
    fontWeight: 900,
    letterSpacing: 0.2,
  },
  brandSub: {
    marginTop: 6,
    fontSize: 14,
    color: "rgba(248,250,255,0.72)",
  },
  headerButtons: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  heroCard: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 22,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 30,
    padding: 26,
    backdropFilter: "blur(12px)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
  },
  heroLeft: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  heroRight: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    alignSelf: "flex-start",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 16,
  },
  heroTitle: {
    margin: 0,
    fontSize: 42,
    lineHeight: 1.05,
    fontWeight: 950,
  },
  heroText: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 1.72,
    color: "rgba(248,250,255,0.86)",
    maxWidth: 720,
  },
  quoteBox: {
    marginTop: 18,
    padding: 18,
    borderRadius: 22,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.09)",
    maxWidth: 700,
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 1.6,
    fontWeight: 700,
  },
  primaryBtn: {
    border: "none",
    borderRadius: 18,
    padding: "14px 20px",
    background: "linear-gradient(135deg, #6ea8fe 0%, #9b7bff 45%, #ff7bc6 100%)",
    color: "#fff",
    fontWeight: 900,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 14px 34px rgba(120,120,255,0.35)",
  },
  ghostBtn: {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: "12px 16px",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
  },
  panel: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 28,
    padding: 24,
    backdropFilter: "blur(12px)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
  },
  sectionHeader: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 900,
    lineHeight: 1.1,
  },
  sectionSubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "rgba(248,250,255,0.74)",
    lineHeight: 1.55,
  },
  profileBlock: {
    marginBottom: 24,
  },
  profileBlockTitle: {
    fontSize: 18,
    fontWeight: 850,
    marginBottom: 14,
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },
  gridAuto: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 14,
  },
  selectableCard: {
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 16,
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  selectableCardActive: {
    background: "rgba(144,170,255,0.18)",
    border: "1px solid rgba(170,190,255,0.45)",
    boxShadow: "0 14px 30px rgba(108,140,255,0.18)",
  },
  selectableTitle: {
    fontSize: 16,
    fontWeight: 850,
    marginBottom: 6,
  },
  selectableSubtitle: {
    fontSize: 13,
    lineHeight: 1.5,
    color: "rgba(248,250,255,0.7)",
  },
  previewBox: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 22,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  previewTextBox: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 850,
    marginBottom: 6,
  },
  previewText: {
    fontSize: 14,
    lineHeight: 1.55,
    color: "rgba(248,250,255,0.8)",
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 22,
  },
  nameTopBar: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 18,
  },
  namesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
  },
  nameCard: {
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 22,
    padding: 16,
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    textAlign: "left",
    cursor: "pointer",
  },
  nameCardTop: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  nameCardName: {
    fontSize: 20,
    fontWeight: 900,
    lineHeight: 1.1,
  },
  nameCardMood: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: 700,
    color: "#bfd0ff",
  },
  nameCardDesc: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(248,250,255,0.82)",
  },
  customBox: {
    marginTop: 20,
    padding: 18,
    borderRadius: 22,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  customTitle: {
    fontSize: 16,
    fontWeight: 850,
    marginBottom: 12,
  },
  customRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    minWidth: 220,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    padding: "14px 16px",
    fontSize: 15,
    outline: "none",
  },
  avatar: {
    position: "relative",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  avatarInner: {
    width: "78%",
    height: "78%",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.18)",
    border: "1px solid rgba(255,255,255,0.24)",
    display: "grid",
    placeItems: "center",
    color: "#fff",
    fontWeight: 950,
    textTransform: "uppercase",
    backdropFilter: "blur(8px)",
  },
  avatarMood: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "rgba(9,15,32,0.7)",
    display: "grid",
    placeItems: "center",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  chatLayout: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: 18,
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  sidebarCard: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 24,
    padding: 18,
    backdropFilter: "blur(12px)",
  },
  sidebarCardTop: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  sidebarCoachName: {
    fontSize: 24,
    fontWeight: 900,
    lineHeight: 1.05,
  },
  sidebarCoachMeta: {
    marginTop: 6,
    fontSize: 13,
    color: "rgba(248,250,255,0.72)",
  },
  sidebarSectionTitle: {
    fontSize: 16,
    fontWeight: 850,
    marginBottom: 12,
  },
  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  infoLine: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    fontSize: 14,
  },
  infoLabel: {
    color: "rgba(248,250,255,0.66)",
  },
  infoValue: {
    fontWeight: 700,
    textTransform: "capitalize",
  },
  checkboxLine: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  select: {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
  },
  mutedText: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 1.5,
    color: "rgba(248,250,255,0.66)",
  },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  quickButton: {
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: "12px 10px",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  chatPanel: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 28,
    padding: 18,
    backdropFilter: "blur(12px)",
    minHeight: "76vh",
    display: "flex",
    flexDirection: "column",
  },
  chatHeader: {
    paddingBottom: 14,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    marginBottom: 14,
  },
  chatTitle: {
    fontSize: 26,
    fontWeight: 900,
  },
  chatSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "rgba(248,250,255,0.72)",
  },
  messagesWrap: {
    flex: 1,
    overflowY: "auto",
    paddingRight: 4,
  },
  messageRow: {
    display: "flex",
    marginBottom: 12,
  },
  messageBubble: {
    maxWidth: "78%",
    borderRadius: 20,
    padding: "12px 14px",
  },
  userBubble: {
    background: "linear-gradient(135deg, rgba(110,168,254,0.9), rgba(155,123,255,0.84))",
    boxShadow: "0 12px 28px rgba(110,168,254,0.18)",
  },
  aiBubble: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  messageAuthor: {
    fontSize: 12,
    fontWeight: 850,
    marginBottom: 6,
    opacity: 0.85,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 1.62,
    whiteSpace: "pre-wrap",
  },
  chatInputBox: {
    marginTop: 14,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: 14,
  },
  textarea: {
    width: "100%",
    resize: "none",
    boxSizing: "border-box",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    padding: 14,
    fontSize: 15,
    outline: "none",
  },
  chatActionRow: {
    marginTop: 12,
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },
};

/* =========================
   RESPONSIVE SIMPLE
========================= */

if (typeof window !== "undefined") {
  const styleId = "ultra-premium-app-responsive";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      @media (max-width: 980px) {
        .force-mobile-column {}
      }
      @media (max-width: 980px) {
        body {
          overflow-x: hidden;
        }
      }
      @media (max-width: 980px) {
        div[style*="grid-template-columns: 1.1fr 0.9fr"] {
          grid-template-columns: 1fr !important;
        }
        div[style*="grid-template-columns: 320px 1fr"] {
          grid-template-columns: 1fr !important;
        }
      }
      @media (max-width: 640px) {
        h1 {
          font-size: 34px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}
