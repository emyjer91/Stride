import { T } from '../../theme/tokens'
import type { StatusLevel } from '../../types'

const config = {
  FREE: { color: '#7878A0', bg: 'rgba(120,120,160,0.12)', label: 'Free' },
  SILVER: { color: T.plat, bg: 'rgba(184,197,214,0.12)', label: 'Silver' },
  GOLD: { color: T.gold, bg: T.goldL, label: 'Gold' },
  ELITE: { color: '#D0A0FF', bg: 'rgba(208,160,255,0.10)', label: 'Elite' },
} as const

type Props = {
  status: StatusLevel
}

export default function StatusBadge({ status }: Props) {
  const item = config[status]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        borderRadius: 999,
        color: item.color,
        background: item.bg,
        fontSize: 11,
        fontWeight: 800,
      }}
    >
      {item.label}
    </span>
  )
}
