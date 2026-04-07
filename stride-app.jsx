import { useState, useEffect } from "react";

// ─── PALETTE ────────────────────────────────────────────────────
const C = {
  bg: "#06060F",
  surf: "#0C0C1C",
  card: "#101024",
  card2: "#15152C",
  border: "rgba(120,120,255,0.08)",
  borderGold: "rgba(240,192,64,0.2)",
  borderGreen: "rgba(38,222,126,0.2)",
  primary: "#5B8AFF",
  primaryLow: "rgba(91,138,255,0.12)",
  primaryMid: "rgba(91,138,255,0.25)",
  gold: "#F0C040",
  goldLow: "rgba(240,192,64,0.10)",
  green: "#26DE7E",
  greenLow: "rgba(38,222,126,0.10)",
  red: "#FF4F72",
  orange: "#FF8040",
  purple: "#9B5BFF",
  text: "#ECEEFF",
  sub: "#9090BB",
  muted: "#50507A",
};

// ─── DATA ───────────────────────────────────────────────────────
const RUNS = [
  { date: "Auj. 07:30", km: 8.4, time: "42:18", pace: "5'02\"", xp: 252, kcal: 520 },
  { date: "Mar. 19:15", km: 5.2, time: "26:30", pace: "5'06\"", xp: 156, kcal: 320 },
  { date: "Lun. 07:00", km: 12.1, time: "1:04:30", pace: "5'20\"", xp: 363, kcal: 748 },
];

const BADGES = [
  { icon: "👣", name: "Premier Pas", desc: "1ère course terminée", earned: true, rarity: "common" },
  { icon: "🎯", name: "5km Club", desc: "5 km complétés", earned: true, rarity: "common" },
  { icon: "🔥", name: "Streak 7J", desc: "7 jours de suite", earned: true, rarity: "rare" },
  { icon: "⚡", name: "Speed Demon", desc: "Pace < 4'30\"/km", earned: true, rarity: "rare" },
  { icon: "🏅", name: "10k Runner", desc: "10 km en une fois", earned: false, rarity: "epic" },
  { icon: "🦉", name: "Night Owl", desc: "Course après 22h", earned: false, rarity: "rare" },
  { icon: "🏆", name: "Marathon", desc: "42 km complétés", earned: false, rarity: "legendary" },
  { icon: "💎", name: "Centurion", desc: "100 courses totales", earned: false, rarity: "legendary" },
];

const LEADERBOARD = [
  { rank: 1, name: "Thomas L.", avatar: "🦁", km: 87.4, level: 34, delta: 0 },
  { rank: 2, name: "Marie C.", avatar: "🦊", km: 74.2, level: 31, delta: 1 },
  { rank: 3, name: "Lucas M.", avatar: "🐺", km: 68.9, level: 29, delta: -1 },
  { rank: 4, name: "Jérémy", avatar: "⚡", km: 42.8, level: 23, delta: 2, isMe: true },
  { rank: 5, name: "Camille D.", avatar: "🦅", km: 38.1, level: 22, delta: 0 },
];

const FEED = [
  { user: "Thomas L.", avatar: "🦁", action: "a couru 15.2 km", sub: "Nouveau record perso ! 🔥", time: "2h", likes: 12 },
  { user: "Marie C.", avatar: "🦊", action: 'a débloqué "10k Runner" 🎖️', sub: "Félicitez-la !", time: "5h", likes: 24 },
  { user: "Lucas M.", avatar: "🐺", action: 'a lancé un défi 🏁', sub: '"Course du vendredi" — Rejoignez-le!', time: "8h", likes: 7 },
];

const RARITIES = {
  common:    { color: "#8080AA", label: "Commun",    glow: "rgba(128,128,170,0.3)" },
  rare:      { color: "#5B8AFF", label: "Rare",      glow: "rgba(91,138,255,0.4)" },
  epic:      { color: "#C060FF", label: "Épique",    glow: "rgba(192,96,255,0.4)" },
  legendary: { color: "#F0C040", label: "Légendaire",glow: "rgba(240,192,64,0.4)" },
};

// ─── STYLES ─────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Barlow+Condensed:wght@700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .no-scroll::-webkit-scrollbar { display: none; }
  .no-scroll { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes glowPulse {
    0%,100% { box-shadow: 0 10px 40px rgba(91,138,255,0.4); }
    50%     { box-shadow: 0 10px 70px rgba(91,138,255,0.75), 0 0 100px rgba(91,138,255,0.18); }
  }
  @keyframes goldShimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes floatUp {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-9px); }
  }
  @keyframes dotBlink {
    0%,100% { opacity: 0.35; transform: scale(1); }
    50%     { opacity: 1;    transform: scale(1.35); }
  }
  @keyframes mapPulse {
    0%  { box-shadow: 0 0 0 0   rgba(91,138,255,0.7); }
    70% { box-shadow: 0 0 0 14px rgba(91,138,255,0); }
    100%{ box-shadow: 0 0 0 0   rgba(91,138,255,0); }
  }
  @keyframes slideUp {
    from { transform: translateY(22px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  @keyframes counterFlash {
    0%  { transform: scale(1); }
    35% { transform: scale(1.18); filter: brightness(1.5); }
    100%{ transform: scale(1); }
  }
  @keyframes ringRotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .run-glow    { animation: glowPulse 2.4s ease-in-out infinite; }
  .float-anim  { animation: floatUp 2.8s ease-in-out infinite; }
  .dot-blink   { animation: dotBlink 1.1s ease-in-out infinite; }
  .map-pulse   { animation: mapPulse 1.6s ease-in-out infinite; }
  .slide-up    { animation: slideUp 0.45s cubic-bezier(.22,.68,0,1.2) both; }
  .counter-flash { animation: counterFlash 0.7s ease; }

  .gold-text {
    background: linear-gradient(90deg,#F0C040 0%,#FFE07A 35%,#F0C040 55%,#CC8A10 100%);
    background-size: 220% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: goldShimmer 3.2s linear infinite;
  }
  .press { transition: transform .14s, opacity .14s; cursor: pointer; user-select: none; }
  .press:active { transform: scale(.96); opacity: .82; }
  .nav-item { transition: color .18s; cursor: pointer; user-select: none; }
  .nav-item:active { transform: scale(.88); }
  .xp-fill { transition: width 1.3s cubic-bezier(.4,0,.2,1); }
`;

// ─── ROOT ────────────────────────────────────────────────────────
export default function StrideApp() {
  const [tab, setTab]       = useState("home");
  const [running, setRun]   = useState(false);
  const [elapsed, setElap]  = useState(0);
  const [dist, setDist]     = useState(0);
  const [done, setDone]     = useState(false);
  const [liked, setLiked]   = useState({});

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setElap(e => e + 1);
      setDist(d => parseFloat((d + 0.00285).toFixed(4)));
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;

  const pace = dist > 0.06
    ? (() => {
        const v = (elapsed / 60) / dist;
        return `${Math.floor(v)}'${String(Math.round((v % 1) * 60)).padStart(2,"0")}`;
      })()
    : "--'--";

  const XP = 7420, XP_MAX = 10000, LEVEL = 23;
  const xpPct = Math.round(XP / XP_MAX * 100);

  const stopRun = () => { setRun(false); setDone(true); };
  const newRun  = () => { setDone(false); setElap(0); setDist(0); };

  const NAV = [
    { id:"home",         label:"Accueil",  e:"⚡" },
    { id:"run",          label:"Courir",   e:"🏃" },
    { id:"achievements", label:"Trophées", e:"🏆" },
    { id:"social",       label:"Social",   e:"🌐" },
    { id:"profile",      label:"Profil",   e:"👤" },
  ];

  const shared = { XP, XP_MAX, LEVEL, xpPct, fmt, liked, setLiked };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", maxWidth:430, margin:"0 auto", color:C.text, fontFamily:"'Sora',sans-serif", position:"relative" }}>
      <style>{CSS}</style>

      <div className="no-scroll" style={{ height:"100vh", overflowY:"auto", paddingBottom:74 }}>
        {tab==="home"         && <HomeTab        {...shared} onRun={()=>{setTab("run");setDone(false);}} />}
        {tab==="run"          && <RunTab         {...{...shared, running, elapsed, dist, pace, done, stopRun, newRun, setRun}} />}
        {tab==="achievements" && <AchievTab      {...shared} />}
        {tab==="social"       && <SocialTab      {...shared} />}
        {tab==="profile"      && <ProfileTab     {...shared} />}
      </div>

      {/* ── Bottom Nav ── */}
      <nav style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"rgba(6,6,15,0.96)", backdropFilter:"blur(28px)", borderTop:"1px solid rgba(120,120,255,0.10)", display:"flex", zIndex:999 }}>
        {NAV.map(n => (
          <div key={n.id} className="nav-item" onClick={()=>setTab(n.id)}
            style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 0 9px", color: tab===n.id ? C.primary : C.muted, fontSize:9.5, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", gap:4, position:"relative" }}>
            {tab===n.id && <div style={{ position:"absolute", top:0, width:28, height:2.5, background:`linear-gradient(90deg,${C.primary},${C.purple})`, borderRadius:2 }} />}
            <span style={{ fontSize:22 }}>{n.e}</span>
            {n.label}
          </div>
        ))}
      </nav>
    </div>
  );
}

// ─── HOME ────────────────────────────────────────────────────────
function HomeTab({ XP, XP_MAX, LEVEL, xpPct, onRun }) {
  return (
    <div>
      {/* Header */}
      <div style={{ padding:"52px 20px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <p style={{ fontSize:11.5, color:C.sub, fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase", marginBottom:5 }}>Bonjour Jérémy 👋</p>
          <h1 style={{ fontSize:26, fontWeight:800, letterSpacing:"-0.03em", lineHeight:1.1 }}>Prêt à courir ?</h1>
        </div>
        <div style={{ position:"relative" }}>
          <Ava size={48} emoji="⚡" bg={C.primaryLow} border={C.primary} />
          <div style={{ position:"absolute", top:-4, right:-4, width:19, height:19, background:C.red, borderRadius:"50%", border:`2.5px solid ${C.bg}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:900 }}>3</div>
        </div>
      </div>

      {/* Level card */}
      <div className="press" style={{ margin:"0 16px 14px", background:"linear-gradient(135deg,#0A1030 0%,#111230 55%,#180E40 100%)", border:"1px solid rgba(91,138,255,0.22)", borderRadius:24, padding:"20px", position:"relative", overflow:"hidden" }}>
        <Blob top={-55} right={-55} size={200} color="rgba(91,138,255,0.06)" />
        <Blob bottom={-40} left={-25} size={140} color="rgba(155,91,255,0.05)" />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
          <div>
            <Label>Niveau actuel</Label>
            <div style={{ display:"flex", alignItems:"baseline", gap:10 }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:60, fontWeight:900, lineHeight:1 }}>{LEVEL}</span>
              <div>
                <div style={{ fontSize:13.5, fontWeight:800, color:C.primary, letterSpacing:"-0.01em" }}>MARATHONIEN</div>
                <div style={{ fontSize:10.5, color:C.muted, fontWeight:500 }}>Prochain : Elite</div>
              </div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <Label>XP Total</Label>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, lineHeight:1, marginTop:3 }} className="gold-text">{XP.toLocaleString()}</div>
          </div>
        </div>
        <Label>{XP.toLocaleString()} XP vers {XP_MAX.toLocaleString()}</Label>
        <XPBar pct={xpPct} />
        <p style={{ fontSize:10, color:C.muted, textAlign:"right", marginTop:5 }}>{100-xpPct}% pour le niveau 24</p>
      </div>

      {/* Stats row */}
      <div style={{ display:"flex", gap:10, margin:"0 16px 14px" }}>
        {[
          { e:"📍", v:"42.8", u:"km", l:"Cette semaine", c:C.primary },
          { e:"🔥", v:"7",    u:"jours", l:"Streak",     c:"#FF6040" },
          { e:"🏆", v:"#156", u:"mondial", l:"Classement",c:C.gold },
        ].map((st,i) => (
          <div key={i} className="press" style={{ flex:1, background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"14px 8px", textAlign:"center" }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{st.e}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:25, fontWeight:900, color:st.c, lineHeight:1 }}>{st.v}</div>
            <div style={{ fontSize:9.5, color:C.muted, marginTop:3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>{st.u}</div>
            <div style={{ fontSize:9.5, color:C.muted, marginTop:2 }}>{st.l}</div>
          </div>
        ))}
      </div>

      {/* Run CTA */}
      <div style={{ margin:"0 16px 16px" }}>
        <div className="run-glow press" onClick={onRun}
          style={{ background:"linear-gradient(135deg,#5B8AFF,#3E5FE8)", borderRadius:22, padding:"22px 20px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <Blob top={-40} right={-40} size={150} color="rgba(255,255,255,0.06)" />
          <div style={{ fontSize:44, marginBottom:8 }}>🏃</div>
          <div style={{ fontSize:21, fontWeight:800, letterSpacing:"-0.01em" }}>Lancer une course</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginTop:5, fontWeight:500 }}>GPS activé · Tracking auto · +XP garanti</div>
        </div>
      </div>

      {/* Active challenge */}
      <div style={{ margin:"0 16px 16px" }}>
        <SectionLabel>Défi en cours</SectionLabel>
        <div className="press" style={{ background:C.card, border:`1px solid ${C.borderGold}`, borderRadius:18, padding:"16px", display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:54, height:54, borderRadius:14, background:C.goldLow, border:`1px solid rgba(240,192,64,0.3)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>🌙</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:800, fontSize:15, marginBottom:3 }}>Warrior de la semaine</div>
            <div style={{ fontSize:11.5, color:C.sub, marginBottom:9 }}>Courir 4× · <b style={{ color:C.gold }}>3/4</b> complétés</div>
            <div style={{ height:5, background:"rgba(255,255,255,0.05)", borderRadius:100 }}>
              <div style={{ width:"75%", height:"100%", background:"linear-gradient(90deg,#F0C040,#FF9040)", borderRadius:100 }} />
            </div>
          </div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:900, color:C.gold, flexShrink:0 }}>75%</div>
        </div>
      </div>

      {/* Recent runs */}
      <div style={{ margin:"0 16px 24px" }}>
        <SectionLabel>Courses récentes</SectionLabel>
        {RUNS.map((r,i) => (
          <div key={i} className="press" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"13px 15px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:42, height:42, borderRadius:12, background:C.primaryLow, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🏃</div>
              <div>
                <div style={{ fontWeight:700, fontSize:15 }}>{r.km} km</div>
                <div style={{ fontSize:11, color:C.sub }}>{r.date} · {r.pace}/km · {r.kcal} kcal</div>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ color:C.gold, fontWeight:800, fontSize:14 }}>+{r.xp} XP</div>
              <div style={{ fontSize:11, color:C.sub }}>{r.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RUN ─────────────────────────────────────────────────────────
function RunTab({ running, elapsed, dist, pace, done, stopRun, newRun, setRun, fmt }) {
  const xpEarned = Math.round(dist * 30 + (dist > 0 ? 50 : 0));

  if (done) {
    return (
      <div className="slide-up" style={{ padding:"64px 20px 30px", textAlign:"center" }}>
        <div className="float-anim" style={{ fontSize:72, marginBottom:16 }}>🎉</div>
        <h2 style={{ fontSize:28, fontWeight:800, marginBottom:8, letterSpacing:"-0.02em" }}>Course terminée !</h2>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:80, fontWeight:900, lineHeight:1 }} className="gold-text">+{xpEarned}</div>
        <div style={{ fontSize:16, color:C.sub, marginBottom:30, marginTop:4 }}>XP gagnés 🏆</div>
        <div style={{ display:"flex", gap:10, marginBottom:28 }}>
          {[
            { label:"Distance", value:`${dist.toFixed(2)} km`, icon:"📍" },
            { label:"Durée",    value:fmt(elapsed),           icon:"⏱" },
            { label:"Allure",   value:`${pace}\"/km`,          icon:"⚡" },
          ].map((s,i) => (
            <div key={i} style={{ flex:1, background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"16px 8px", textAlign:"center" }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{s.icon}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:21, fontWeight:900, color:C.text }}>{s.value}</div>
              <Label>{s.label}</Label>
            </div>
          ))}
        </div>
        <div className="run-glow press" onClick={newRun} style={{ background:"linear-gradient(135deg,#5B8AFF,#3E5FE8)", borderRadius:18, padding:"17px", textAlign:"center", fontSize:16, fontWeight:800 }}>Nouvelle course</div>
      </div>
    );
  }

  return (
    <div style={{ padding:"52px 0 0" }}>
      {/* Status */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:20 }}>
        <div style={{ width:9, height:9, borderRadius:"50%", background: running ? C.green : C.muted }} className={running ? "dot-blink" : ""} />
        <span style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color: running ? C.green : C.muted }}>
          {running ? "Course en cours" : elapsed > 0 ? "En pause" : "Prêt"}
        </span>
      </div>

      {/* Timer */}
      <div style={{ textAlign:"center", marginBottom:4 }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:98, fontWeight:900, letterSpacing:"-0.025em", lineHeight:1 }}>{fmt(elapsed)}</div>
        <Label>Temps écoulé</Label>
      </div>

      {/* Distance */}
      <div style={{ textAlign:"center", margin:"16px 0 22px" }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:72, fontWeight:900, color:C.primary, lineHeight:1 }}>{dist.toFixed(2)}</div>
        <div style={{ fontSize:22, color:C.sub, fontWeight:700, marginTop:2 }}>km</div>
      </div>

      {/* Stats strip */}
      <div style={{ margin:"0 16px 24px", background:C.card, border:`1px solid ${C.border}`, borderRadius:20, display:"flex", overflow:"hidden" }}>
        {[
          { label:"Allure",   value:`${pace}"/km`, icon:"⚡" },
          { label:"Calories", value:running ? `${Math.round(dist*62)} kcal` : "-- kcal", icon:"🔥" },
          { label:"Rythme",   value:running ? "168 bpm" : "-- bpm", icon:"❤️" },
        ].map((s,i) => (
          <div key={i} style={{ flex:1, padding:"16px 8px", textAlign:"center", borderRight: i<2 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ fontSize:20, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:800 }}>{s.value}</div>
            <Label>{s.label}</Label>
          </div>
        ))}
      </div>

      {/* Map placeholder */}
      <div style={{ margin:"0 16px 26px", height:155, background:C.card, border:`1px solid ${C.border}`, borderRadius:20, position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ color:C.muted, fontSize:14, fontWeight:600 }}>📍 Carte GPS</div>
        {/* Simulated route */}
        {running && Array.from({length:9}).map((_,i) => (
          <div key={i} style={{ position:"absolute", left:`${13+i*9}%`, top:`${42+Math.sin(i*0.9)*18}%`, width:5, height:5, borderRadius:"50%", background:C.primary, opacity:0.4+i*0.07 }} />
        ))}
        {running && <div className="map-pulse" style={{ position:"absolute", left:"90%", top:"40%", width:14, height:14, borderRadius:"50%", background:C.primary }} />}
        {/* Grid lines decoration */}
        {[0,1,2,3].map(i => <div key={i} style={{ position:"absolute", left:0, right:0, top:`${20+i*20}%`, height:1, background:"rgba(255,255,255,0.03)" }} />)}
        {[0,1,2,3,4].map(i => <div key={i} style={{ position:"absolute", top:0, bottom:0, left:`${15+i*17}%`, width:1, background:"rgba(255,255,255,0.03)" }} />)}
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:10, margin:"0 16px" }}>
        {running ? (
          <>
            <div className="press" onClick={()=>setRun(false)}
              style={{ flex:1, background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:"18px", textAlign:"center", fontSize:13, fontWeight:700, color:C.sub }}>
              ⏸ Pause
            </div>
            <div className="press" onClick={stopRun}
              style={{ flex:2, background:"linear-gradient(135deg,#FF4F72,#D52855)", borderRadius:18, padding:"18px", textAlign:"center", fontSize:15, fontWeight:800, color:"white" }}>
              ⏹ Terminer la course
            </div>
          </>
        ) : (
          <div className="run-glow press" onClick={()=>setRun(true)}
            style={{ flex:1, background:"linear-gradient(135deg,#5B8AFF,#3E5FE8)", borderRadius:20, padding:"22px", textAlign:"center", fontSize:18, fontWeight:800 }}>
            {elapsed > 0 ? "▶ Reprendre" : "▶ Démarrer"}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ACHIEVEMENTS ────────────────────────────────────────────────
function AchievTab({ XP, XP_MAX, LEVEL, xpPct }) {
  return (
    <div style={{ padding:"52px 16px 24px" }}>
      <h1 style={{ fontSize:24, fontWeight:800, letterSpacing:"-0.02em", marginBottom:4 }}>Trophées & Badges</h1>
      <p style={{ fontSize:13, color:C.sub, marginBottom:20 }}>4 débloqués · Niveau {LEVEL} · Marathonien</p>

      {/* Level visual */}
      <div style={{ background:"linear-gradient(135deg,#0A1030,#111232)", border:"1px solid rgba(91,138,255,0.22)", borderRadius:22, padding:"20px", marginBottom:20, position:"relative", overflow:"hidden" }}>
        <Blob top={-60} right={-60} size={200} color="rgba(91,138,255,0.05)" />
        <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:18 }}>
          <div style={{ width:76, height:76, borderRadius:"50%", background:"linear-gradient(135deg,#5B8AFF,#9B5BFF)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 0 32px rgba(91,138,255,0.45)" }}>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, lineHeight:1 }}>{LEVEL}</span>
            <span style={{ fontSize:8, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", opacity:.75 }}>niveau</span>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, fontSize:18, marginBottom:3 }}>Marathonien</div>
            <div style={{ fontSize:12.5, color:C.sub, marginBottom:9 }}>Suivant : <span style={{ color:C.primary, fontWeight:700 }}>Élite (niv. 24)</span></div>
            <XPBar pct={xpPct} />
            <div style={{ fontSize:10, color:C.muted, marginTop:5 }}>{XP.toLocaleString()} / {XP_MAX.toLocaleString()} XP</div>
          </div>
        </div>
        {/* Milestones */}
        <div style={{ display:"flex", gap:8 }}>
          {["1er km","10 runs","50km tot.","7j streak"].map((m,i) => (
            <div key={i} style={{ flex:1, background: i<3 ? C.primaryLow : "rgba(255,255,255,0.025)", border:`1px solid ${i<3 ? C.primaryMid : C.border}`, borderRadius:10, padding:"7px 5px", textAlign:"center", fontSize:9, fontWeight:700, color: i<3 ? C.primary : C.muted }}>
              {i<3 ? "✓ " : "○ "}{m}
            </div>
          ))}
        </div>
      </div>

      {/* Badge grid */}
      <SectionLabel>Badges collectés</SectionLabel>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
        {BADGES.map((b,i) => {
          const r = RARITIES[b.rarity];
          return (
            <div key={i} className="press" style={{ background: b.earned ? C.card2 : C.card, border:`1px solid ${b.earned ? r.color+"44" : C.border}`, borderRadius:20, padding:"18px 12px", textAlign:"center", opacity: b.earned ? 1 : 0.42, position:"relative", overflow:"hidden" }}>
              {b.earned && <div style={{ position:"absolute", top:0, right:0, background:r.color, padding:"3px 9px", fontSize:8.5, fontWeight:800, letterSpacing:"0.06em", textTransform:"uppercase", color: b.rarity==="legendary" ? "#111" : "white", borderBottomLeftRadius:10 }}>{r.label}</div>}
              <div style={{ fontSize:40, marginBottom:9, filter: b.earned ? `drop-shadow(0 0 12px ${r.glow})` : "none" }}>
                {b.earned ? b.icon : "🔒"}
              </div>
              <div style={{ fontWeight:700, fontSize:13, marginBottom:3, color: b.earned ? C.text : C.muted }}>{b.name}</div>
              <div style={{ fontSize:10.5, color:C.muted }}>{b.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Trophy showcase */}
      <SectionLabel>Trophées rares</SectionLabel>
      <div style={{ background:C.card, border:`1px solid ${C.borderGold}`, borderRadius:20, padding:"18px", textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:10 }}>🏆</div>
        <div style={{ fontWeight:800, fontSize:16, marginBottom:4, color:C.gold }}>Marathon Légendaire</div>
        <div style={{ fontSize:12, color:C.sub, marginBottom:14 }}>Terminez votre premier marathon pour débloquer ce trophée rare</div>
        <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:100 }}>
          <div style={{ width:"41%", height:"100%", background:"linear-gradient(90deg,#F0C040,#CC8A10)", borderRadius:100 }} />
        </div>
        <div style={{ fontSize:10.5, color:C.muted, marginTop:6 }}>41% — 17.2 km / 42.195 km</div>
      </div>
    </div>
  );
}

// ─── SOCIAL ──────────────────────────────────────────────────────
function SocialTab({ liked, setLiked }) {
  return (
    <div style={{ padding:"52px 16px 24px" }}>
      <h1 style={{ fontSize:24, fontWeight:800, letterSpacing:"-0.02em", marginBottom:4 }}>Communauté</h1>
      <p style={{ fontSize:13, color:C.sub, marginBottom:20 }}>Semaine du 31 mars → 6 avril 2026</p>

      {/* Leaderboard */}
      <div style={{ background:"linear-gradient(135deg,#090F20,#0E1228)", border:`1px solid ${C.borderGold}`, borderRadius:22, padding:"18px", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontWeight:800, fontSize:16 }}>🏆 Classement hebdo</div>
          <div style={{ fontSize:11, color:C.muted, fontWeight:700, background:C.goldLow, border:`1px solid rgba(240,192,64,0.25)`, padding:"3px 10px", borderRadius:20 }}>par km</div>
        </div>
        {LEADERBOARD.map((u,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", background: u.isMe ? "rgba(91,138,255,0.09)" : "transparent", border: u.isMe ? `1px solid rgba(91,138,255,0.25)` : "1px solid transparent", borderRadius:14, marginBottom:6 }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontWeight:900, width:30, textAlign:"center", color: i===0 ? C.gold : i===1 ? "#C0C0D0" : i===2 ? "#CC8040" : C.muted }}>#{u.rank}</div>
            <Ava size={40} emoji={u.avatar} bg={u.isMe ? C.primaryLow : "rgba(255,255,255,0.04)"} border={u.isMe ? C.primary : C.border} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight: u.isMe ? 800 : 600, fontSize:14, color: u.isMe ? C.primary : C.text }}>{u.name}{u.isMe ? " (moi)" : ""}</div>
              <div style={{ fontSize:11, color:C.sub }}>Niv.{u.level} · {u.km} km ce sem.</div>
            </div>
            <div style={{ fontSize:12, fontWeight:800, color: u.delta>0 ? C.green : u.delta<0 ? C.red : C.muted }}>
              {u.delta>0 ? `▲${u.delta}` : u.delta<0 ? `▼${Math.abs(u.delta)}` : "—"}
            </div>
          </div>
        ))}
      </div>

      {/* Community challenge */}
      <SectionLabel>Défi communautaire</SectionLabel>
      <div className="press" style={{ background:C.card, border:`1px solid ${C.borderGreen}`, borderRadius:18, padding:"16px", marginBottom:20 }}>
        <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
          <div style={{ fontSize:38 }}>🌍</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, fontSize:15, marginBottom:4 }}>Tour du monde collectif</div>
            <div style={{ fontSize:12, color:C.sub, marginBottom:12 }}>Objectif : 40 075 km ensemble · <span style={{ color:C.green, fontWeight:800 }}>28 340 km atteints</span></div>
            <div style={{ height:7, background:"rgba(255,255,255,0.05)", borderRadius:100, marginBottom:6 }}>
              <div style={{ width:"70.7%", height:"100%", background:"linear-gradient(90deg,#26DE7E,#18B058)", borderRadius:100 }} />
            </div>
            <div style={{ fontSize:10.5, color:C.muted }}>70.7% · 1 247 coureurs actifs</div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <SectionLabel>Fil d'activité</SectionLabel>
      {FEED.map((f,i) => (
        <div key={i} className="press" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:"14px 15px", marginBottom:10 }}>
          <div style={{ display:"flex", gap:12, marginBottom:10 }}>
            <Ava size={44} emoji={f.avatar} bg="rgba(255,255,255,0.04)" border={C.border} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13.5, fontWeight:700, lineHeight:1.4, marginBottom:3 }}>
                <span style={{ color:C.primary }}>{f.user}</span> {f.action}
              </div>
              <div style={{ fontSize:11.5, color:C.sub }}>{f.sub}</div>
            </div>
            <div style={{ fontSize:10.5, color:C.muted, flexShrink:0, marginTop:2 }}>{f.time}</div>
          </div>
          <div style={{ display:"flex", gap:18, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
            <div className="press" onClick={()=>setLiked(l=>({...l,[i]:!l[i]}))}
              style={{ display:"flex", alignItems:"center", gap:6, fontSize:12.5, color: liked[i] ? C.red : C.muted, fontWeight:700 }}>
              {liked[i] ? "❤️" : "🤍"} {f.likes + (liked[i] ? 1 : 0)}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12.5, color:C.muted, fontWeight:700 }}>💬 Commenter</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12.5, color:C.muted, fontWeight:700 }}>🔁 Partager</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── PROFILE ────────────────────────────────────────────────────
function ProfileTab({ LEVEL, XP, xpPct }) {
  return (
    <div style={{ padding:"52px 16px 24px" }}>
      {/* Avatar */}
      <div style={{ textAlign:"center", marginBottom:26 }}>
        <div style={{ position:"relative", display:"inline-block", marginBottom:16 }}>
          <div style={{ position:"absolute", inset:-6, borderRadius:"50%", background:`linear-gradient(135deg,${C.primary},${C.purple})`, padding:3 }}>
            <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:C.bg }} />
          </div>
          <div style={{ width:92, height:92, borderRadius:"50%", background:"linear-gradient(135deg,#1A1A40,#0E0E28)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:46, position:"relative", zIndex:1 }}>⚡</div>
          <div style={{ position:"absolute", bottom:2, right:2, width:30, height:30, background:`linear-gradient(135deg,${C.primary},${C.purple})`, borderRadius:"50%", border:`3px solid ${C.bg}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:900, zIndex:2 }}>{LEVEL}</div>
        </div>
        <h2 style={{ fontSize:24, fontWeight:800, marginBottom:4, letterSpacing:"-0.02em" }}>Jérémy</h2>
        <div style={{ fontSize:14, color:C.primary, fontWeight:800, marginBottom:5, letterSpacing:"0.01em" }}>MARATHONIEN · Niveau {LEVEL}</div>
        <div style={{ fontSize:12, color:C.sub }}>Membre depuis Janv. 2025 · Essonne, France 🇫🇷</div>
      </div>

      {/* Stats grid */}
      <SectionLabel>Statistiques globales</SectionLabel>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:22 }}>
        {[
          { e:"📍", label:"Distance totale",  v:"312.4 km" },
          { e:"🏃", label:"Courses totales",  v:"48 runs" },
          { e:"⚡", label:"Meilleur pace",    v:"4'12\"/km" },
          { e:"🔥", label:"Streak record",    v:"12 jours" },
          { e:"🏆", label:"XP accumulés",     v:"7 420 XP" },
          { e:"⏱",  label:"Temps total",      v:"42h 18m" },
        ].map((s,i) => (
          <div key={i} className="press" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"14px 15px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:24, flexShrink:0 }}>{s.e}</div>
            <div>
              <div style={{ fontWeight:800, fontSize:15, lineHeight:1.2 }}>{s.v}</div>
              <div style={{ fontSize:10.5, color:C.sub, marginTop:2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Earned badges strip */}
      <SectionLabel>Badges débloqués (4/8)</SectionLabel>
      <div style={{ display:"flex", gap:10, marginBottom:22, overflowX:"auto" }} className="no-scroll">
        {BADGES.filter(b=>b.earned).map((b,i) => (
          <div key={i} style={{ width:60, height:60, borderRadius:14, background:C.card2, border:`1px solid rgba(240,192,64,0.2)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>{b.icon}</div>
        ))}
        <div style={{ width:60, height:60, borderRadius:14, background:C.card, border:`1px solid ${C.border}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontSize:10, color:C.muted, fontWeight:700, flexShrink:0 }}>
          <div style={{ fontSize:14 }}>🔒</div>4 à venir
        </div>
      </div>

      {/* Premium CTA */}
      <div className="press" style={{ background:"linear-gradient(135deg,#1A1200,#2A1E00)", border:`1px solid rgba(240,192,64,0.3)`, borderRadius:20, padding:"18px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ fontSize:36 }}>👑</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:16, color:C.gold, marginBottom:3 }}>STRIDE Premium</div>
          <div style={{ fontSize:12, color:C.sub }}>Plans IA · Défis exclusifs · Stats avancées</div>
        </div>
        <div style={{ fontSize:12, fontWeight:800, color:C.gold, background:"rgba(240,192,64,0.15)", border:`1px solid rgba(240,192,64,0.3)`, padding:"6px 12px", borderRadius:20, flexShrink:0 }}>Voir →</div>
      </div>

      {/* Settings */}
      <SectionLabel>Paramètres</SectionLabel>
      {["Mon compte","Notifications","Confidentialité","Aide & Support","Se déconnecter"].map((item,i) => (
        <div key={i} className="press" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:14, fontWeight:600, color: i===4 ? C.red : C.text }}>{item}</span>
          <span style={{ color:C.muted, fontSize:18 }}>›</span>
        </div>
      ))}
    </div>
  );
}

// ─── PRIMITIVES ──────────────────────────────────────────────────
function Ava({ size, emoji, bg, border }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:bg, border:`1.5px solid ${border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.44, flexShrink:0 }}>
      {emoji}
    </div>
  );
}
function XPBar({ pct }) {
  return (
    <div style={{ height:8, background:"rgba(255,255,255,0.05)", borderRadius:100, overflow:"visible", position:"relative", marginTop:7 }}>
      <div className="xp-fill" style={{ width:`${pct}%`, height:"100%", background:"linear-gradient(90deg,#5B8AFF,#9B5BFF)", borderRadius:100, position:"relative" }}>
        <div style={{ position:"absolute", right:-1, top:"50%", transform:"translateY(-50%)", width:16, height:16, background:"white", borderRadius:"50%", boxShadow:"0 0 14px rgba(91,138,255,0.9)" }} />
      </div>
    </div>
  );
}
function Blob({ top, bottom, left, right, size, color }) {
  const style = { position:"absolute", width:size, height:size, borderRadius:"50%", background:color, pointerEvents:"none" };
  if (top    !== undefined) style.top    = top;
  if (bottom !== undefined) style.bottom = bottom;
  if (left   !== undefined) style.left   = left;
  if (right  !== undefined) style.right  = right;
  return <div style={style} />;
}
function SectionLabel({ children }) {
  return <div style={{ fontSize:10.5, fontWeight:800, letterSpacing:"0.11em", textTransform:"uppercase", color:C.muted, marginBottom:10, paddingLeft:2 }}>{children}</div>;
}
function Label({ children }) {
  return <div style={{ fontSize:10, color:C.muted, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginTop:4 }}>{children}</div>;
}
