import cors from 'cors'
import express from 'express'
import { env } from './config/env'
import coachRouter from './routes/coach'

const app = express()

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  }),
)

app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'stride-server' })
})

app.use('/api', coachRouter)

app.listen(env.port, () => {
  console.log(`STRIDE server running on http://localhost:${env.port}`)
})
