import { useState } from "react";

export default function App() {
  const [tab, setTab] = useState("home");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "white",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>STRIDE 🔥</h1>

      {tab === "home" && <p>Accueil</p>}
      {tab === "run" && <p>Run</p>}
      {tab === "coach" && <p>Coach IA</p>}
      {tab === "social" && <p>Social</p>}
      {tab === "profile" && <p>Profil</p>}

      <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
        <button onClick={() => setTab("home")}>Home</button>
        <button onClick={() => setTab("run")}>Run</button>
        <button onClick={() => setTab("coach")}>Coach</button>
        <button onClick={() => setTab("social")}>Social</button>
        <button onClick={() => setTab("profile")}>Profil</button>
      </div>
    </div>
  );
}
