import { env } from '../config/env'

export type CoachRequestMessage = {
  role: 'user' | 'assistant'
  content: string
}

const COACH_SYSTEM = `Tu es ARIA, le coach IA de l'application de running STRIDE. Tu réponds en français. Tu es précis, motivant, structuré et utile. Tu proposes des conseils réalistes pour un coureur sérieux. Tu restes concis sauf si l'utilisateur demande une analyse détaillée.`

export async function askAnthropic(messages: CoachRequestMessage[]) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.anthropicApiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: COACH_SYSTEM,
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Anthropic API error: ${response.status} ${errorText}`)
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>
  }

  const reply = Array.isArray(data.content)
    ? data.content
        .map((block) => block.text ?? '')
        .join('')
        .trim()
    : ''

  return reply || "Je n'ai pas pu générer de réponse correcte."
}
