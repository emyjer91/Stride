import { useState } from "react";

export default function App() {
  const [tab, setTab] = useState("home");

  const renderTab = () => {
    switch (tab) {
      case "home":
        return <Home />;
      case "run":
        return <Run />;
      case "coach":
        return <Coach />;
      case "social":
        return <Social />;
      case "profile":
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", paddingBottom: 80 }}>
      {renderTab()}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );function Home() {
  return (
    <div style={{ padding: 20, color: "white" }}>
      <h1>STRIDE 🔥</h1>
      <p>Accueil premium</p>
    </div>
  );
}

function Run() {
  return (
    <div style={{ padding: 20, color: "white" }}>
      <h1>Run</h1>
      <p>Lancer une séance</p>
    </div>
  );
}

function Coach() {
  return (
    <div style={{ padding: 20, color: "white" }}>
      <h1>Coach IA</h1>
      <p>Conseils personnalisés</p>
    </div>
  );
}

function Social() {
  return (
    <div style={{ padding: 20, color: "white" }}>
      <h1>Social</h1>
      <p>Communauté running</p>
    </div>
  );
}

function Profile() {
  return (
    <div style={{ padding: 20, color: "white" }}>
      <h1>Profil</h1>
      <p>Stats utilisateur</p>
    </div>
  );
}
}
function BottomNav({ tab, setTab }) {
  const items = ["home", "run", "coach", "social", "profile"];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        maxWidth: 430,
        display: "flex",
        justifyContent: "space-around",
        background: "#111",
        padding: 10,
      }}
    >
      {items.map((item) => (
        <button
          key={item}
          onClick={() => setTab(item)}
          style={{
            color: tab === item ? "#7c5cff" : "#888",
            background: "none",
            border: "none",
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
