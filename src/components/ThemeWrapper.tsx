'use client'
import { useEffect } from 'react'
import { useSessionStore } from '@/store/sessionStore'

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const isDarkMode = useSessionStore(s => s.isDarkMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  return <>{children}</>
}
