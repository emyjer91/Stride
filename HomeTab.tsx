import Card from '../../components/ui/Card'
import StatusBadge from '../../components/ui/StatusBadge'
import XPBar from '../../components/ui/XPBar'
import { RUNS_DATA } from '../../data/mock/runs'
import { USER } from '../../data/mock/user'
import { getXpPercent } from '../../lib/format'

export default function HomeTab() {
  const xpPercent = getXpPercent(USER.xp, USER.xpNext)

  return (
    <div style={{ padding: '52px 16px 100px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>Bonjour {USER.name} 👋</div>
        <h1 style={{ fontSize: 28, fontWeight: 900 }}>Prêt à dépasser tes limites ?</h1>
      </div>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Niveau actuel</div>
            <div style={{ fontSize: 52, fontWeight: 900 }}>{USER.level}</div>
          </div>
          <StatusBadge status={USER.status} />
        </div>
        <XPBar value={xpPercent} />
        <div style={{ fontSize: 11, opacity: 0.7, marginTop: 8 }}>
          {USER.xp} / {USER.xpNext} XP
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>Stats rapides</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div>
            <div style={{ fontWeight: 800 }}>{USER.kmWeek} km</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Semaine</div>
          </div>
          <div>
            <div style={{ fontWeight: 800 }}>{USER.streak} jours</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Streak</div>
          </div>
          <div>
            <div style={{ fontWeight: 800 }}>#{USER.rank}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Classement</div>
          </div>
        </div>
      </Card>

      <div style={{ fontWeight: 800, marginBottom: 10 }}>Courses récentes</div>
      {RUNS_DATA.slice(0, 3).map((run) => (
        <Card key={run.id} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 800 }}>
                {run.km} km · {run.type}
              </div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
                {run.date} · {run.pace}/km
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800 }}>+{run.xp} XP</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>{run.time}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
