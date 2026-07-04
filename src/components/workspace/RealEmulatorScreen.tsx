'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

interface Props {
  serial: string
  onTap: (x: number, y: number) => void
}

const POLL_INTERVAL_MS = 600
const EMULATOR_W = 1080
const EMULATOR_H = 1920

export function RealEmulatorScreen({ serial, onTap }: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [touching, setTouching] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const blobUrlRef = useRef<string | null>(null)

  const fetchFrame = useCallback(async () => {
    try {
      const res = await fetch(`/api/emulator/screenshot?serial=${encodeURIComponent(serial)}`, {
        cache: 'no-store',
      })
      if (!res.ok) {
        setError(`ADB błąd ${res.status}`)
        return
      }
      const blob = await res.blob()
      // Revoke old blob URL to avoid memory leak
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
      const url = URL.createObjectURL(blob)
      blobUrlRef.current = url
      setImageSrc(url)
      setError(null)
    } catch {
      setError('Brak połączenia z emulatorem')
    }
  }, [serial])

  useEffect(() => {
    fetchFrame()
    pollRef.current = setInterval(fetchFrame, POLL_INTERVAL_MS)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    }
  }, [fetchFrame])

  const handleClick = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    const img = imgRef.current
    if (!img) return
    const rect = img.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width
    const relY = (e.clientY - rect.top) / rect.height
    const adbX = Math.round(relX * EMULATOR_W)
    const adbY = Math.round(relY * EMULATOR_H)
    setTouching(true)
    setTimeout(() => setTouching(false), 120)
    onTap(adbX, adbY)
  }, [onTap])

  const handleWheel = useCallback((e: React.WheelEvent<HTMLImageElement>) => {
    const img = imgRef.current
    if (!img) return
    const rect = img.getBoundingClientRect()
    const cx = Math.round(((e.clientX - rect.left) / rect.width) * EMULATOR_W)
    const cy = Math.round(((e.clientY - rect.top) / rect.height) * EMULATOR_H)
    const delta = e.deltaY > 0 ? 200 : -200
    // Swipe up = scroll down, swipe down = scroll up
    fetch('/api/emulator/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serial, x1: cx, y1: cy, x2: cx, y2: cy - delta, duration: 200 }),
    })
  }, [serial])

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 gap-3 p-4">
        <div className="text-3xl">📱</div>
        <div className="text-xs text-red-400 text-center">{error}</div>
        <div className="text-xs text-slate-500 text-center">
          Sprawdź czy emulator jest uruchomiony i ADB działa
        </div>
        <button
          onClick={fetchFrame}
          className="mt-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300 transition-colors"
        >
          Ponów
        </button>
      </div>
    )
  }

  if (!imageSrc) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xs text-slate-500">Łączenie z emulatorem...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <img
        ref={imgRef}
        src={imageSrc}
        alt="Android emulator"
        onClick={handleClick}
        onWheel={handleWheel}
        draggable={false}
        className={`w-full h-full object-cover cursor-pointer select-none transition-opacity ${
          touching ? 'opacity-80' : 'opacity-100'
        }`}
        style={{ touchAction: 'none' }}
      />
      {/* Touch ripple indicator */}
      {touching && (
        <div className="absolute inset-0 bg-white/5 pointer-events-none rounded-[32px]" />
      )}
    </div>
  )
}
