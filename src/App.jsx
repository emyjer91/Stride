export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        background:
          "radial-gradient(circle at top, #1d1d1d 0%, #0b0b0b 45%, #050505 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "24px 18px 40px",
      }}
    >
      <div style={{ maxWidth: 430, margin: "0 auto" }}>
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
          STRIDE • Beta
        </div>

        <h1
          style={{
            fontSize: 42,
            lineHeight: 1.02,
            margin: 0,
            fontWeight: 800,
            letterSpacing: -1,
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
            fontSize: 16,
            lineHeight: 1.5,
          }}
        >
          Le coach running social nouvelle génération pour suivre tes séances,
          progresser plus vite et rester motivé chaque jour.
        </p>

        <div
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 22,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              Objectif semaine
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>
              42 km
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              borderRadius: 22,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
              Niveau
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>
              12
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: 18,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
              marginBottom: 10,
            }}
          >
            Coach IA
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.35 }}>
            “Aujourd’hui, fais une sortie facile de 35 minutes pour garder de la fraîcheur.”
          </div>
        </div>

        <button
          style={{
            marginTop: 20,
            width: "100%",
            padding: "16px 18px",
            borderRadius: 18,
            border: "none",
            fontSize: 16,
            fontWeight: 700,
            color: "white",
            background: "linear-gradient(135deg, #9333ea, #2563eb)",
          }}
        >
          Commencer ma séance
        </button>

        <div style={{ marginTop: 28, display: "grid", gap: 12 }}>
          {[
            ["Séance du jour", "Footing progressif • 35 min"],
            ["Progression", "+12% sur les 4 dernières semaines"],
            ["Communauté", "248 coureurs actifs aujourd’hui"],
          ].map(([title, value]) => (
            <div
              key={title}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 18,
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.58)",
                  marginBottom: 6,
                }}
              >
                {title}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
