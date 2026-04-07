import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { formatSeconds } from '../../lib/format'
import { useRunSession } from './hooks/useRunSession'

export default function RunTab() {
  const { phase, elapsed, distance, kcal, pace, setPhase, reset, stop } = useRunSession()

  return (
    <div style={{ padding: '52px 16px 100px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 20 }}>Mode course</h1>

      <Card style={{ textAlign: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 10 }}>{phase.toUpperCase()}</div>
        <div style={{ fontSize: 56, fontWeight: 900 }}>{formatSeconds(elapsed)}</div>
        <div style={{ fontSize: 42, fontWeight: 900, marginTop: 10 }}>{distance.toFixed(2)} km</div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div>
            <div style={{ fontWeight: 800 }}>{pace}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Allure</div>
          </div>
          <div>
            <div style={{ fontWeight: 800 }}>{kcal}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Calories</div>
          </div>
          <div>
            <div style={{ fontWeight: 800 }}>162 bpm</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>FC</div>
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 10 }}>
        {phase === 'idle' && <Button onClick={() => setPhase('running')}>Démarrer</Button>}
        {phase === 'running' && (
          <>
            <Button variant="ghost" onClick={() => setPhase('paused')}>
              Pause
            </Button>
            <Button onClick={stop}>Terminer</Button>
          </>
        )}
        {phase === 'paused' && (
          <>
            <Button variant="ghost" onClick={() => setPhase('running')}>
              Reprendre
            </Button>
            <Button onClick={stop}>Terminer</Button>
          </>
        )}
        {phase === 'done' && <Button onClick={reset}>Nouvelle course</Button>}
      </div>
    </div>
  )
}
