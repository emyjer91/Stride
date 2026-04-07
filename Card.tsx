import type { CSSProperties, PropsWithChildren } from 'react'
import { T } from '../../theme/tokens'

type Props = PropsWithChildren<{
  style?: CSSProperties
}>

export default function Card({ children, style }: Props) {
  return (
    <div
      style={{
        background: T.glass,
        border: `1px solid ${T.border}`,
        borderRadius: 20,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
