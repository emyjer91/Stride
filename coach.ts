import { Router } from 'express'
import { askAnthropic } from '../services/anthropic'

const router = Router()

type Body = {
  messages?: { role: 'user' | 'assistant'; content: string }[]
}

router.post('/coach', async (req, res) => {
  try {
    const body = req.body as Body

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return res.status(400).json({ error: 'messages is required' })
    }

    const sanitizedMessages = body.messages
      .filter((message) => message && typeof message.content === 'string')
      .slice(-12)
      .map((message) => ({
        role: message.role === 'assistant' ? 'assistant' : 'user',
        content: message.content.trim(),
      }))
      .filter((message) => message.content.length > 0)

    if (sanitizedMessages.length === 0) {
      return res.status(400).json({ error: 'No valid messages provided' })
    }

    const reply = await askAnthropic(sanitizedMessages)

    return res.json({ reply })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to generate coach response' })
  }
})

export default router
