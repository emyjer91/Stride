import { T } from '../../theme/tokens'
import type { TabId } from '../../types'

type Props = {
  tab: TabId
  onChange: (tab: TabId) => void
}

const tabs: { id: TabId; icon: string; label: string }[] = [
  { id: 'home', icon: '⚡', label: 'Accueil' },
  { id: 'coach', icon: '🤖', label: 'Coach IA' },
  { id: 'run', icon: '▶', label: 'Courir' },
  { id: 'social', icon: '🌐', label: 'Social' },
  { id: 'me', icon: '◆', label: 'Profil' },
]

export default function BottomNav({ tab, onChange }: Props) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        padding: '8px 10px 12px',
        background: 'rgba(5,5,20,0.88)',
        borderTop: `1px solid ${T.border}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        {tabs.map((item) => {
          const active = item.id === tab
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              style={{
                flex: 1,
                background: active ? T.violetL : 'transparent',
                color: active ? T.violet : T.sub,
                border: `1px solid ${active ? T.borderV : 'transparent'}`,
                borderRadius: 16,
                padding: '10px 6px',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 18 }}>{item.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 800, marginTop: 4 }}>{item.label}</div>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
