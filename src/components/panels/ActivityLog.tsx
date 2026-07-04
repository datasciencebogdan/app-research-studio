'use client'
import { useSessionStore } from '@/store/sessionStore'
import { ActivityAction } from '@/types'
import { Trash2 } from 'lucide-react'

const actionIcon: Record<ActivityAction, string> = {
  app_launched: '🚀',
  app_closed: '❌',
  screenshot_taken: '📸',
  section_saved: '📁',
  recording_started: '⏺',
  recording_stopped: '⏹',
  comparison_activated: '⚖️',
  app_added: '➕',
  session_exported: '💾',
}

function formatTs(iso: string) {
  return new Date(iso).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function ActivityLog() {
  const activityLog = useSessionStore(s => s.activityLog)
  const clearActivityLog = useSessionStore(s => s.clearActivityLog)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 flex-shrink-0">
        <span className="text-xs text-slate-400">{activityLog.length} zdarzeń</span>
        {activityLog.length > 0 && (
          <button
            onClick={clearActivityLog}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Wyczyść
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activityLog.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-600 text-xs">
            Brak zdarzeń w tej sesji
          </div>
        ) : (
          <ul className="p-2 space-y-1">
            {activityLog.map(item => (
              <li
                key={item.id}
                className="flex items-start gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-700/40 transition-colors"
              >
                <span className="text-sm flex-shrink-0 mt-0.5">{actionIcon[item.action]}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-slate-300">{item.description}</span>
                  {item.appName && (
                    <span className="ml-1.5 text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full">
                      {item.appName}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-600 font-mono flex-shrink-0 tabular-nums">
                  {formatTs(item.timestamp)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
