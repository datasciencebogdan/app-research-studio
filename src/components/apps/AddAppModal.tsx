'use client'
import { useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { X } from 'lucide-react'

interface Props {
  onClose: () => void
}

export function AddAppModal({ onClose }: Props) {
  const addApp = useSessionStore(s => s.addApp)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('📱')
  const [color, setColor] = useState('#6366f1')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    addApp(name.trim(), icon || '📱', color)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-slate-800 rounded-2xl p-6 w-80 shadow-2xl border border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-slate-100">Dodaj aplikację</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Nazwa aplikacji</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="np. Żabka"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Emoji ikony</label>
            <input
              type="text"
              value={icon}
              onChange={e => setIcon(e.target.value)}
              placeholder="📱"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Kolor marki</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <span className="text-sm text-slate-300 font-mono">{color}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              Dodaj aplikację
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
