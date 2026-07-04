'use client'
import { useSessionStore } from '@/store/sessionStore'
import { AppItem } from './AppItem'

export function AppList() {
  const apps = useSessionStore(s => s.apps)

  return (
    <ul className="space-y-1 px-2">
      {apps.map(app => (
        <AppItem key={app.id} app={app} />
      ))}
    </ul>
  )
}
