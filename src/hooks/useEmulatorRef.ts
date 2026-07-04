'use client'
import { useRef, useCallback } from 'react'
import { toPng } from 'html-to-image'

export function useEmulatorRef() {
  const ref = useRef<HTMLDivElement>(null)

  const captureScreenshot = useCallback(async (): Promise<string> => {
    if (!ref.current) return ''
    try {
      // GCP_INTEGRATION: replace with emulator screenshot API call when WebRTC backend is active
      return await toPng(ref.current, { quality: 0.92, pixelRatio: 1 })
    } catch {
      return ''
    }
  }, [])

  return { ref, captureScreenshot }
}
