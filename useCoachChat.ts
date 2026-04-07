import { useState } from 'react'
import type { CoachMessage } from '../../../types'

const API_BASE_URL = 'http://localhost:3001'

export function useCoachChat() {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      role: 'assistant',
      content: "Salut Jérémy ! Je suis ARIA, ton coach IA STRIDE. Que veux-tu travailler aujourd'hui ?",
    },
  ])
  const [loading, setLoading] = useState(false)

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const nextMessages = [...messages, { role: 'user' as const, content: trimmed }]
    setMessages(nextMessages)
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      const data = (await response.json()) as { reply?: string }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply ?? "Je n'ai pas pu répondre correctement.",
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Erreur réseau. Vérifie le serveur STRIDE puis réessaie.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return { messages, loading, sendMessage }
}
