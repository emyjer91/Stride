type Props = {
  value: number
}

export default function XPBar({ value }: Props) {
  return (
    <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
      <div
        style={{
          width: `${value}%`,
          height: '100%',
          background: 'linear-gradient(90deg,#7B5CFF,#00D4AA)',
          borderRadius: 999,
        }}
      />
    </div>
  )
}
