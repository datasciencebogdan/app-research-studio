'use client'
import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { Smartphone, RefreshCw } from 'lucide-react'

interface AdbStatus {
  adbFound: boolean
  emulators: string[]
  message?: string
}

export function EmulatorPanel() {
  const apps = useSessionStore(s => s.apps)
  const runningApps = useSessionStore(s => s.runningApps)
  const launchRealApp = useSessionStore(s => s.launchRealApp)
  const closeApp = useSessionStore(s => s.closeApp)

  const [status, setStatus] = useState<AdbStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedSerial, setSelectedSerial] = useState<string>('')

  const poll = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/emulator/status')
      const data = await res.json()
      setStatus(data)
      if (data.emulators?.length && !selectedSerial) setSelectedSerial(data.emulators[0])
    } catch {
      setStatus({ adbFound: false, emulators: [], message: 'Nie można połączyć z ADB' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { poll() }, [])

  if (!status?.adbFound) {
    return (
      <div className="px-3 py-2.5 border-b border-slate-700">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Emulator</span>
          <button onClick={poll} className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          ADB niedostępne
        </div>
      </div>
    )
  }

  const connected = status.emulators.length > 0

  return (
    <div className="border-b border-slate-700 pb-1">
      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Smartphone className="w-3 h-3" /> Emulator
          </span>
          <button onClick={poll} className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {!connected ? (
          <div className="text-xs text-amber-400/80 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Brak połączonego emulatora
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400">Połączono</span>
              {status.emulators.length > 1 ? (
                <select
                  value={selectedSerial}
                  onChange={e => setSelectedSerial(e.target.value)}
                  className="ml-auto text-xs bg-slate-700 border border-slate-600 rounded px-1 py-0.5 text-slate-300 focus:outline-none"
                >
                  {status.emulators.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <span className="text-xs text-slate-500 ml-auto">{selectedSerial}</span>
              )}
            </div>

            <ul className="space-y-1">
              {apps.map(app => {
                const realInstance = runningApps.find(r => r.appId === app.id && r.adbSerial === selectedSerial)
                return (
                  <li key={app.id} className="flex items-center gap-2">
                    <span className="text-base flex-shrink-0">{app.icon}</span>
                    <span className="flex-1 text-xs text-slate-300 truncate">{app.name}</span>
                    <button
                      onClick={() => {
                        if (realInstance) closeApp(realInstance.instanceId)
                        else launchRealApp(app.id, selectedSerial)
                      }}
                      className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        realInstance
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-red-500/20 hover:text-red-400'
                          : 'bg-slate-700 text-slate-400 hover:bg-indigo-600/30 hover:text-indigo-400'
                      }`}
                    >
                      {realInstance ? '● Aktywny' : '▷ Uruchom'}
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
