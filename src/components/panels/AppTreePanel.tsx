'use client'
import { useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { getMockAppTree } from '@/data/mockScreens'
import { AppTreeNode } from '@/types'
import { ChevronRight, ChevronDown } from 'lucide-react'

function TreeNode({ node, depth = 0 }: { node: AppTreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 1)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <button
        onClick={() => hasChildren && setOpen(v => !v)}
        className={`flex items-center gap-1.5 py-1 px-2 w-full text-left rounded-lg text-xs transition-colors ${
          hasChildren ? 'hover:bg-slate-700/50 text-slate-300 cursor-pointer' : 'text-slate-500 cursor-default'
        }`}
      >
        {hasChildren ? (
          open ? <ChevronDown className="w-3 h-3 flex-shrink-0" /> : <ChevronRight className="w-3 h-3 flex-shrink-0" />
        ) : (
          <span className="w-3 flex-shrink-0 text-slate-700">—</span>
        )}
        <span>{node.label}</span>
      </button>
      {hasChildren && open && (
        <div>
          {node.children!.map(child => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function AppTreePanel() {
  const apps = useSessionStore(s => s.apps)
  const selectedAppForTree = useSessionStore(s => s.selectedAppForTree)
  const setSelectedAppForTree = useSessionStore(s => s.setSelectedAppForTree)

  const tree = selectedAppForTree ? getMockAppTree(selectedAppForTree) : []

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-700 flex-shrink-0">
        <span className="text-xs text-slate-400">Aplikacja:</span>
        <select
          value={selectedAppForTree ?? ''}
          onChange={e => setSelectedAppForTree(e.target.value || null)}
          className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="">— Wybierz aplikację —</option>
          {apps.map(app => (
            <option key={app.id} value={app.id}>{app.icon} {app.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2">
        {!selectedAppForTree ? (
          <div className="flex items-center justify-center h-full text-slate-600 text-xs">
            Wybierz aplikację, aby wygenerować drzewo
          </div>
        ) : (
          tree.map(node => (
            <TreeNode key={node.id} node={node} depth={0} />
          ))
        )}
      </div>
    </div>
  )
}
