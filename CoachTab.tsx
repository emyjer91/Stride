import { useState } from 'react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useCoachChat } from './hooks/useCoachChat'

export default function CoachTab() {
  const { messages, loading, sendMessage } = useCoachChat()
  const [input, setInput] = useState('')

  return (
    <div style={{ padding: '52px 16px 100px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>ARIA · Coach IA</h1>

      <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
        {messages.map((message, index) => (
          <Card key={index}>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
              {message.role === 'assistant' ? 'ARIA' : 'Toi'}
            </div>
            <div style={{ lineHeight: 1.5 }}>{message.content}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Demande à ARIA..."
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '14px 16px',
            color: 'white',
          }}
        />
        <Button
          disabled={loading}
          onClick={() => {
            sendMessage(input)
            setInput('')
          }}
        >
          Envoyer
        </Button>
      </div>
    </div>
  )
}
