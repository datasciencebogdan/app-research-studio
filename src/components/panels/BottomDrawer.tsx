'use client'
import { useSessionStore } from '@/store/sessionStore'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { ActivityLog } from './ActivityLog'
import { SectionsPanel } from './SectionsPanel'
import { RecordingsPanel } from './RecordingsPanel'
import { AppTreePanel } from './AppTreePanel'

type Tab = 'log' | 'sections' | 'recordings' | 'tree'

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'log', label: 'Dziennik', icon: '📋' },
  { id: 'sections', label: 'Sekcje', icon: '📁' },
  { id: 'recordings', label: 'Nagrania', icon: '⏺' },
  { id: 'tree', label: 'Drzewo', icon: '🌳' },
]

export function BottomDrawer() {
  const { activeBottomTab, setActiveBottomTab, isBottomDrawerOpen, toggleBottomDrawer } = useSessionStore()
  const activityLog = useSessionStore(s => s.activityLog)
  const sections = useSessionStore(s => s.sections)
  const recordings = useSessionStore(s => s.recordings)

  const counts: Record<Tab, number | null> = {
    log: activityLog.length || null,
    sections: sections.length || null,
    recordings: recordings.length || null,
    tree: null,
  }

  return (
    <div
      className="flex-shrink-0 bg-slate-800 border-t border-slate-700 transition-all duration-300 z-10"
      style={{ height: isBottomDrawerOpen ? 280 : 44 }}
    >
      {/* Tab bar */}
      <div className="flex items-center h-11 px-2 gap-1 border-b border-slate-700">
        <div className="flex gap-1 flex-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveBottomTab(tab.id)
                if (!isBottomDrawerOpen) toggleBottomDrawer()
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors font-medium ${
                activeBottomTab === tab.id && isBottomDrawerOpen
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {counts[tab.id] !== null && (
                <span className="bg-indigo-500/30 text-indigo-300 text-[9px] px-1.5 rounded-full">
                  {counts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={toggleBottomDrawer}
          className="ml-auto p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
        >
          {isBottomDrawerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Panel content */}
      {isBottomDrawerOpen && (
        <div className="h-[calc(100%-44px)] overflow-hidden">
          {activeBottomTab === 'log' && <ActivityLog />}
          {activeBottomTab === 'sections' && <SectionsPanel />}
          {activeBottomTab === 'recordings' && <RecordingsPanel />}
          {activeBottomTab === 'tree' && <AppTreePanel />}
        </div>
      )}
    </div>
  )
}
