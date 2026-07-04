'use client'
import { useSessionStore } from '@/store/sessionStore'
import { EmulatorWindow } from './EmulatorWindow'
import { Smartphone } from 'lucide-react'

export function Workspace() {
  const runningApps = useSessionStore(s => s.runningApps)
  const apps = useSessionStore(s => s.apps)
  const count = runningApps.length

  if (count === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-slate-900 text-slate-500">
        <Smartphone className="w-16 h-16 opacity-20" />
        <div className="text-center">
          <p className="text-lg font-medium text-slate-400">Brak uruchomionych aplikacji</p>
          <p className="text-sm mt-1">Wybierz aplikację z listy po prawej stronie, aby rozpocząć</p>
        </div>
      </div>
    )
  }

  const gridClass =
    count === 1
      ? 'flex items-start justify-center'
      : count === 2
      ? 'grid grid-cols-2'
      : 'grid grid-cols-2 xl:grid-cols-3'

  return (
    <div className={`flex-1 overflow-auto bg-slate-900 p-6 gap-6 ${gridClass}`}>
      {runningApps.map(runningApp => {
        const app = apps.find(a => a.id === runningApp.appId)
        if (!app) return null
        return (
          <div key={runningApp.instanceId} className={count === 1 ? '' : 'flex justify-center'}>
            <EmulatorWindow runningApp={runningApp} app={app} />
          </div>
        )
      })}
    </div>
  )
}
