'use client'
import { useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { AppList } from '@/components/apps/AppList'
import { AddAppModal } from '@/components/apps/AddAppModal'
import { EmulatorPanel } from '@/components/apps/EmulatorPanel'
import { Plus } from 'lucide-react'

export function RightSidebar() {
  const apps = useSessionStore(s => s.apps)
  const runningCount = useSessionStore(s => s.runningApps.length)
  const [showModal, setShowModal] = useState(false)

  return (
    <aside className="w-72 flex-shrink-0 flex flex-col bg-slate-800 border-l border-slate-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Aplikacje
          </h2>
          <span className="text-xs text-slate-500">{apps.length} zainstalowanych</span>
        </div>
        {runningCount > 0 && (
          <div className="mt-1.5 text-xs text-indigo-400">
            {runningCount} {runningCount === 1 ? 'uruchomiona' : 'uruchomione'}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <EmulatorPanel />
        <div className="py-2">
          <AppList />
        </div>
      </div>

      <div className="p-3 border-t border-slate-700">
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition-colors border border-slate-600"
        >
          <Plus className="w-4 h-4" />
          Dodaj aplikację
        </button>
      </div>

      {showModal && <AddAppModal onClose={() => setShowModal(false)} />}
    </aside>
  )
}
