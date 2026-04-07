export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1a1a1a 0%, #0b0b0b 45%, #050505 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "24px 20px 40px",
      }}
    >
      <div
        style={{
          maxWidth: 430,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            fontSize: 12,
            letterSpacing: 0.5,
            marginBottom: 18,
          }}
        >
          STRIDE • Beta
        </div>

        <h1
          style={{
            fontSize: 42,
            lineHeight: 1,
            margin: 0,
            fontWeight: 800,
          }}
        >
          Run smarter.
          <br />
          Progress faster.
        </h1>

        <p
          style={{
            marginTop: 18,
            color: "rgba(255,255,255,0.75)",
            fontSize: 16,
            lineHeight: 1.5,
          }}
        >
          Le coach running social nouvelle génération pour suivre tes séances,
          rester motivé et progresser avec style.
        </p>

        <div
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
              Objectif semaine
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>
              42 km
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              borderRadius: 20,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
              Niveau
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>
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
              fontSize: 14,
              color: "rgba(255,255,255,0.65)",
              marginBottom: 10,
            }}
          >
            Coach IA
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3 }}>
            “Aujourd’hui, fais une sortie facile de 35 minutes pour garder de la fraîcheur.”
          </div>
        </div>

        <button
          style={{
            marginTop: 22,
            width: "100%",
            border: "none",
            borderRadius: 18,
            padding: "16px 18px",
            fontSize: 16,
            fontWeight: 700,
            color: "white",
            background: "linear-gradient(135deg, #9333ea, #2563eb)",
          }}
        >
          Commencer ma séance
        </button>

        <div
          style={{
            marginTop: 28,
            display: "grid",
            gap: 12,
          }}
        >
          {[
            ["Séance du jour", "Footing progressif • 35 min"],
            ["Progression", "+12% sur 4 semaines"],
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
                  color: "rgba(255,255,255,0.6)",
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
