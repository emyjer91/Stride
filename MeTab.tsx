import Card from '../../components/ui/Card'
import StatusBadge from '../../components/ui/StatusBadge'
import XPBar from '../../components/ui/XPBar'
import { USER } from '../../data/mock/user'
import { getXpPercent } from '../../lib/format'

export default function MeTab() {
  const xpPercent = getXpPercent(USER.xp, USER.xpNext)

  return (
    <div style={{ padding: '52px 16px 100px' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 58, marginBottom: 12 }}>{USER.avatar}</div>
        <h1 style={{ fontSize: 24, fontWeight: 900 }}>{USER.name}</h1>
        <div style={{ marginTop: 8 }}>
          <StatusBadge status={USER.status} />
        </div>
      </div>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 800, marginBottom: 12 }}>Progression</div>
        <XPBar value={xpPercent} />
        <div style={{ fontSize: 11, opacity: 0.7, marginTop: 8 }}>
          {USER.xp} / {USER.xpNext} XP
        </div>
      </Card>

      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 800 }}>{USER.kmTotal} km</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Distance totale</div>
          </div>
          <div>
            <div style={{ fontWeight: 800 }}>{USER.runs}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Courses</div>
          </div>
          <div>
            <div style={{ fontWeight: 800 }}>{USER.bestPace}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Meilleur pace</div>
          </div>
          <div>
            <div style={{ fontWeight: 800 }}>#{USER.rank}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Classement</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
