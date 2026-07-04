'use client'
import { useSessionStore } from '@/store/sessionStore'
import { Play, Circle } from 'lucide-react'

function formatDuration(startIso: string, endIso?: string): string {
  const start = new Date(startIso).getTime()
  const end = endIso ? new Date(endIso).getTime() : Date.now()
  const secs = Math.floor((end - start) / 1000)
  const m = String(Math.floor(secs / 60)).padStart(2, '0')
  const s = String(secs % 60).padStart(2, '0')
  return `${m}:${s}`
}

function formatTs(iso: string) {
  return new Date(iso).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
}

export function RecordingsPanel() {
  const recordings = useSessionStore(s => s.recordings)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-4 py-2 border-b border-slate-700 flex-shrink-0">
        <span className="text-xs text-slate-400">{recordings.length} nagrań</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {recordings.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-600 text-xs">
            Brak nagrań w tej sesji
          </div>
        ) : (
          recordings.slice().reverse().map(rec => (
            <div
              key={rec.id}
              className="flex items-center gap-3 bg-slate-700/40 rounded-xl px-3 py-2.5"
            >
              {rec.status === 'recording' ? (
                <Circle className="w-3.5 h-3.5 text-red-400 fill-red-400 animate-pulse flex-shrink-0" />
              ) : (
                <div className="w-7 h-7 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Play className="w-3 h-3 text-slate-400" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-200 truncate">{rec.name}</div>
                <div className="text-[10px] text-slate-500 truncate">
                  {rec.appNames.join(', ') || 'Brak aplikacji'} · {formatTs(rec.startTime)}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-mono text-xs text-slate-400 tabular-nums">
                  {formatDuration(rec.startTime, rec.endTime)}
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                  rec.status === 'recording'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {rec.status === 'recording' ? 'Nagrywa' : 'Zakończono'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* UX Agent placeholder */}
      <div className="px-4 py-2 border-t border-slate-700 bg-slate-800/50 flex-shrink-0">
        <div className="flex items-center gap-2 opacity-40">
          <span className="text-sm">🤖</span>
          <span className="text-xs text-slate-400 italic">Agent UX zostanie dodany w następnej fazie.</span>
        </div>
      </div>
    </div>
  )
}
