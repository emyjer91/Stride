import type { ClubItem, EventItem, LeaderboardUser } from '../../types'

export const LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Thomas L.', avatar: '🦁', km: 87.4, lvl: 34, status: 'ELITE', delta: 0 },
  { rank: 2, name: 'Marie C.', avatar: '🦊', km: 74.2, lvl: 31, status: 'ELITE', delta: 1 },
  { rank: 3, name: 'Lucas M.', avatar: '🐺', km: 68.9, lvl: 29, status: 'GOLD', delta: -1 },
  { rank: 4, name: 'Jérémy', avatar: '⚡', km: 42.8, lvl: 23, status: 'GOLD', delta: 2, isMe: true },
]

export const EVENTS: EventItem[] = [
  { title: 'Sprint du Dimanche', date: '06 Avr · 08:00', loc: 'Bois de Vincennes', runners: 24, dist: '10km', color: '#7B5CFF' },
  { title: 'Moonlight Run 🌙', date: '11 Avr · 21:00', loc: 'Paris Centre', runners: 56, dist: '5km', color: '#FF3B5C' },
]

export const CLUBS: ClubItem[] = [
  { name: 'Paris Elites', members: 1240, level: '⚡ Elite', badge: '🏆', active: true },
  { name: 'Night Runners FR', members: 580, level: '🌙 Nocturne', badge: '🌑', active: true },
]
