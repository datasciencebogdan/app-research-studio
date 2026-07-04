'use client'
import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { Moon, Sun, Download, Circle, Square } from 'lucide-react'

function formatTime(seconds: number) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

export function TopBar() {
  const { isDarkMode, toggleDarkMode, isRecording, startRecording, stopRecording } = useSessionStore()
  const { apps, runningApps, screenshots, sections, recordings, activityLog } = useSessionStore()
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      apps,
      runningApps,
      screenshots: screenshots.map(s => ({ ...s, dataUrl: '[base64 omitted]' })),
      sections,
      recordings,
      activityLog,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ars-session-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    useSessionStore.getState().clearActivityLog()
    useSessionStore.getState().setActiveBottomTab('log')
  }

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-slate-800 border-b border-slate-700 flex-shrink-0 z-20">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl">🔬</span>
        <span className="font-semibold text-slate-100 text-sm">App Research Studio</span>
      </div>

      {/* Session timer */}
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <span className="text-slate-500 text-xs">Sesja</span>
        <span className="font-mono text-slate-200 text-sm tabular-nums">{formatTime(elapsed)}</span>
        {isRecording && (
          <span className="flex items-center gap-1 text-red-400 text-xs animate-pulse">
            <Circle className="w-2 h-2 fill-red-400" />
            NAGRYWA
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            isRecording
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
          }`}
        >
          {isRecording ? (
            <><Square className="w-3 h-3" /> Zatrzymaj</>
          ) : (
            <><Circle className="w-3 h-3" /> Nagraj</>
          )}
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          title={isDarkMode ? 'Tryb jasny' : 'Tryb ciemny'}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
        >
          <Download className="w-3 h-3" />
          Eksportuj sesję
        </button>
      </div>
    </header>
  )
}
