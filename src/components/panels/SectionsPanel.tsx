'use client'
import { useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'

export function SectionsPanel() {
  const sections = useSessionStore(s => s.sections)
  const screenshots = useSessionStore(s => s.screenshots)
  const createSection = useSessionStore(s => s.createSection)
  const deleteSection = useSessionStore(s => s.deleteSection)
  const [expanded, setExpanded] = useState<string[]>([])
  const [newName, setNewName] = useState('')
  const [showInput, setShowInput] = useState(false)

  const toggleExpand = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleCreate = () => {
    if (!newName.trim()) return
    createSection(newName.trim())
    setNewName('')
    setShowInput(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 flex-shrink-0">
        <span className="text-xs text-slate-400">{sections.length} sekcji</span>
        <button
          onClick={() => setShowInput(v => !v)}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Nowa sekcja
        </button>
      </div>

      {showInput && (
        <div className="flex gap-2 px-4 py-2 border-b border-slate-700 flex-shrink-0">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            placeholder="Nazwa sekcji..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button onClick={handleCreate} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs text-white transition-colors">
            Dodaj
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sections.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-600 text-xs text-center px-4">
            Brak sekcji. Zrób screena i zapisz go do sekcji.
          </div>
        ) : (
          sections.map(section => {
            const sectionScreenshots = screenshots.filter(sc => sc.sectionId === section.id)
            const isExpanded = expanded.includes(section.id)
            return (
              <div key={section.id} className="bg-slate-700/40 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700/60 transition-colors"
                  onClick={() => toggleExpand(section.id)}
                >
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
                  <span className="text-sm">📁</span>
                  <span className="flex-1 text-xs font-medium text-slate-200 text-left">{section.name}</span>
                  <span className="text-[10px] text-slate-500">{sectionScreenshots.length} screeny</span>
                  <button
                    onClick={e => { e.stopPropagation(); deleteSection(section.id) }}
                    className="ml-1 text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3">
                    {sectionScreenshots.length === 0 ? (
                      <p className="text-[10px] text-slate-600 py-1">Brak screenów w tej sekcji</p>
                    ) : (
                      <div className="flex gap-2 flex-wrap">
                        {sectionScreenshots.map(sc => (
                          <div key={sc.id} className="relative group">
                            {sc.dataUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={sc.dataUrl}
                                alt={sc.screenName}
                                className="w-16 h-28 object-cover rounded-lg border border-slate-600"
                              />
                            ) : (
                              <div className="w-16 h-28 bg-slate-600 rounded-lg border border-slate-600 flex items-center justify-center text-slate-500 text-xs text-center p-1">
                                {sc.screenName}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                              <span className="text-[8px] text-white leading-tight">{sc.appName}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
