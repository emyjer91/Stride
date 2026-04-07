import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { T } from '../../theme/tokens'

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: 'primary' | 'ghost'
}

export default function Button({ children, variant = 'primary', style, ...props }: Props) {
  return (
    <button
      {...props}
      style={{
        border: 'none',
        borderRadius: 18,
        padding: '14px 18px',
        cursor: 'pointer',
        fontWeight: 800,
        color: 'white',
        background: variant === 'primary' ? 'linear-gradient(135deg,#7B5CFF,#4A30CC)' : T.surf,
        opacity: props.disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  )
}
