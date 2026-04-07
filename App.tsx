import { useState } from 'react'
import HomeTab from '../features/home/HomeTab'
import CoachTab from '../features/coach/CoachTab'
import RunTab from '../features/run/RunTab'
import SocialTab from '../features/social/SocialTab'
import MeTab from '../features/profile/MeTab'
import type { TabId } from '../types'
import BottomNav from './navigation/BottomNav'

export default function App() {
  const [tab, setTab] = useState<TabId>('home')

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh', position: 'relative' }}>
      {tab === 'home' && <HomeTab />}
      {tab === 'coach' && <CoachTab />}
      {tab === 'run' && <RunTab />}
      {tab === 'social' && <SocialTab />}
      {tab === 'me' && <MeTab />}
      <BottomNav tab={tab} onChange={setTab} />
    </div>
  )
}
