import Card from '../../components/ui/Card'
import { CLUBS, EVENTS, LEADERBOARD } from '../../data/mock/social'

export default function SocialTab() {
  return (
    <div style={{ padding: '52px 16px 100px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>Communauté</h1>

      <div style={{ fontWeight: 800, marginBottom: 10 }}>Classement</div>
      {LEADERBOARD.map((user) => (
        <Card key={user.rank} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 800 }}>
              #{user.rank} · {user.name}
            </div>
            <div>{user.km} km</div>
          </div>
        </Card>
      ))}

      <div style={{ fontWeight: 800, margin: '18px 0 10px' }}>Événements</div>
      {EVENTS.map((event) => (
        <Card key={event.title} style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 800 }}>{event.title}</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
            {event.date} · {event.loc}
          </div>
        </Card>
      ))}

      <div style={{ fontWeight: 800, margin: '18px 0 10px' }}>Clubs</div>
      {CLUBS.map((club) => (
        <Card key={club.name} style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 800 }}>{club.name}</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
            {club.members} membres · {club.level}
          </div>
        </Card>
      ))}
    </div>
  )
}
