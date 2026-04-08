import { useState } from "react";

export default function App() {
  const [tab, setTab] = useState("home");

  return (
    <div style={{ padding: 20, color: "white" }}>
      <h1>STRIDE 🔥</h1>

      {tab === "home" && <p>Accueil</p>}
      {tab === "run" && <p>Run</p>}
      {tab === "coach" && <p>Coach IA</p>}
      {tab === "social" && <p>Social</p>}
      {tab === "profile" && <p>Profil</p>}

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setTab("home")}>Home</button>
        <button onClick={() => setTab("run")}>Run</button>
        <button onClick={() => setTab("coach")}>Coach</button>
        <button onClick={() => setTab("social")}>Social</button>
        <button onClick={() => setTab("profile")}>Profil</button>
      </div>
    </div>
  );
}
