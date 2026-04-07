import dotenv from 'dotenv'

dotenv.config()

function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

export const env = {
  port: Number(process.env.PORT ?? 3001),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  anthropicApiKey: requireEnv('ANTHROPIC_API_KEY'),
}
