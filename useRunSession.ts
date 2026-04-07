import { useEffect, useMemo, useState } from 'react'

export type RunPhase = 'idle' | 'running' | 'paused' | 'done'

export function useRunSession() {
  const [phase, setPhase] = useState<RunPhase>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    if (phase !== 'running') return

    const timer = window.setInterval(() => {
      setElapsed((prev) => prev + 1)
      setDistance((prev) => Number((prev + 0.00288).toFixed(4)))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [phase])

  const kcal = useMemo(() => Math.round(distance * 62), [distance])

  const pace = useMemo(() => {
    if (distance <= 0.08) return "--'--"
    const value = elapsed / 60 / distance
    const minutes = Math.floor(value)
    const seconds = String(Math.round((value % 1) * 60)).padStart(2, '0')
    return `${minutes}'${seconds}`
  }, [elapsed, distance])

  const reset = () => {
    setPhase('idle')
    setElapsed(0)
    setDistance(0)
  }

  const stop = () => setPhase('done')

  return {
    phase,
    elapsed,
    distance,
    kcal,
    pace,
    setPhase,
    reset,
    stop,
  }
}
