'use client'
import { TopBar } from '@/components/layout/TopBar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { Workspace } from '@/components/workspace/Workspace'
import { BottomDrawer } from '@/components/panels/BottomDrawer'

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-900">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Workspace />
        <RightSidebar />
      </div>
      <BottomDrawer />
    </div>
  )
}
