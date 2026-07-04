'use client'
import { useSessionStore } from '@/store/sessionStore'
import { App } from '@/types'

const statusLabel: Record<string, string> = {
  available: 'Dostępna',
  running: 'Uruchomiona',
  stopped: 'Zatrzymana',
}

const statusColor: Record<string, string> = {
  available: 'bg-emerald-500',
  running: 'bg-indigo-500',
  stopped: 'bg-slate-500',
}

interface Props {
  app: App
}

export function AppItem({ app }: Props) {
  const runningApps = useSessionStore(s => s.runningApps)
  const launchApp = useSessionStore(s => s.launchApp)
  const closeApp = useSessionStore(s => s.closeApp)

  const runningInstance = runningApps.find(r => r.appId === app.id)
  const isRunning = !!runningInstance

  const handleToggle = () => {
    if (isRunning && runningInstance) {
      closeApp(runningInstance.instanceId)
    } else {
      launchApp(app.id)
    }
  }

  return (
    <li
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-slate-700/50 group"
      style={{ borderLeft: `3px solid ${isRunning ? app.brandColor : 'transparent'}` }}
      onClick={handleToggle}
    >
      <span className="text-xl flex-shrink-0">{app.icon}</span>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-200 truncate">{app.name}</div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusColor[app.status]}`} />
          <span className="text-xs text-slate-500">{statusLabel[app.status]}</span>
        </div>
      </div>

      <div className="flex-shrink-0">
        <div
          className={`w-10 h-5 rounded-full transition-colors relative ${
            isRunning ? 'bg-indigo-500' : 'bg-slate-600'
          }`}
        >
          <div
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow ${
              isRunning ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </div>
      </div>
    </li>
  )
}
