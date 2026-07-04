'use client'
import { useState, useRef, useCallback } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { App, RunningApp } from '@/types'
import { MockScreenContent } from './MockScreenContent'
import { RealEmulatorScreen } from './RealEmulatorScreen'
import { getMockScreens } from '@/data/mockScreens'
import { toPng } from 'html-to-image'
import { X, Camera, FolderPlus, ChevronDown, Upload } from 'lucide-react'

interface Props {
  runningApp: RunningApp
  app: App
}

export function EmulatorWindow({ runningApp, app }: Props) {
  const { closeApp, navigateScreen, takeScreenshot, sections, createSection, addScreenshotToSection } =
    useSessionStore()
  const [showSectionMenu, setShowSectionMenu] = useState(false)
  const [newSectionName, setNewSectionName] = useState('')
  const [capturing, setCapturing] = useState(false)
  const [installing, setInstalling] = useState(false)
  const [installStatus, setInstallStatus] = useState<string | null>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isRealMode = !!runningApp.adbSerial

  const screens = getMockScreens(app.id)
  const currentScreenDef = screens.find(s => s.id === runningApp.currentScreen)

  const handleScreenshot = useCallback(async () => {
    if (capturing) return
    setCapturing(true)
    try {
      let dataUrl = ''
      if (isRealMode) {
        // Capture current screenshot from ADB
        const res = await fetch(`/api/emulator/screenshot?serial=${runningApp.adbSerial}`)
        if (res.ok) {
          const blob = await res.blob()
          dataUrl = await new Promise<string>(resolve => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.readAsDataURL(blob)
          })
        }
      } else {
        // Capture mock screen DOM
        if (screenRef.current) {
          dataUrl = await toPng(screenRef.current, { quality: 0.92, pixelRatio: 1 })
        }
      }
      if (dataUrl) {
        const label = isRealMode ? `Ekran rzeczywisty` : (currentScreenDef?.label ?? runningApp.currentScreen)
        takeScreenshot(runningApp.instanceId, dataUrl, label)
      }
    } finally {
      setCapturing(false)
    }
  }, [capturing, isRealMode, runningApp, currentScreenDef, takeScreenshot])

  const handleInstallApk = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setInstalling(true)
    setInstallStatus('Instalowanie...')
    try {
      const form = new FormData()
      form.append('apk', file)
      const res = await fetch(`/api/emulator/install?serial=${runningApp.adbSerial}`, {
        method: 'POST',
        body: form,
      })
      const data = await res.json()
      setInstallStatus(res.ok ? `✓ Zainstalowano: ${file.name}` : `✗ Błąd: ${data.error}`)
      setTimeout(() => setInstallStatus(null), 5000)
    } catch {
      setInstallStatus('✗ Błąd instalacji')
      setTimeout(() => setInstallStatus(null), 3000)
    } finally {
      setInstalling(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSaveToSection = (sectionId: string) => {
    const { screenshots } = useSessionStore.getState()
    const latest = screenshots.find(sc => sc.appId === app.id)
    if (latest) addScreenshotToSection(latest.id, sectionId)
    setShowSectionMenu(false)
  }

  const handleCreateSection = () => {
    if (!newSectionName.trim()) return
    const id = createSection(newSectionName.trim())
    const { screenshots } = useSessionStore.getState()
    const latest = screenshots.find(sc => sc.appId === app.id)
    if (latest) addScreenshotToSection(latest.id, id)
    setNewSectionName('')
    setShowSectionMenu(false)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Window controls */}
      <div className="flex items-center gap-2 w-full max-w-[280px]">
        <span className="text-base">{app.icon}</span>
        <span className="flex-1 text-sm font-medium text-slate-200 truncate">{app.name}</span>
        {isRealMode && (
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full flex-shrink-0">
            ● Rzeczywisty
          </span>
        )}

        {/* APK install button — only in real mode */}
        {isRealMode && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".apk"
              onChange={handleInstallApk}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={installing}
              title="Zainstaluj APK"
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {/* Section save menu */}
        <div className="relative">
          <button
            onClick={() => setShowSectionMenu(v => !v)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition-colors"
          >
            <FolderPlus className="w-3 h-3" />
            <ChevronDown className="w-3 h-3" />
          </button>

          {showSectionMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl z-30 p-1.5">
              {sections.length > 0 && (
                <>
                  <div className="text-xs text-slate-500 px-2 py-1">Zapisz do sekcji</div>
                  {sections.map(sec => (
                    <button key={sec.id} onClick={() => handleSaveToSection(sec.id)}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                      📁 {sec.name}
                    </button>
                  ))}
                  <div className="border-t border-slate-700 my-1" />
                </>
              )}
              <div className="text-xs text-slate-500 px-2 py-1">Nowa sekcja</div>
              <div className="flex gap-1 px-1.5 pb-1">
                <input autoFocus value={newSectionName} onChange={e => setNewSectionName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateSection()}
                  placeholder="Nazwa sekcji..."
                  className="flex-1 bg-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none border border-slate-600 focus:border-indigo-500" />
                <button onClick={handleCreateSection}
                  className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs text-white transition-colors">
                  OK
                </button>
              </div>
            </div>
          )}
        </div>

        <button onClick={handleScreenshot} disabled={capturing} title="Zrób screena"
          className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors disabled:opacity-50">
          <Camera className="w-3.5 h-3.5" />
        </button>

        <button onClick={() => closeApp(runningApp.instanceId)} title="Zamknij"
          className="p-1.5 rounded-lg bg-slate-700 hover:bg-red-600/30 text-slate-400 hover:text-red-400 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* APK install status */}
      {installStatus && (
        <div className={`text-xs px-3 py-1 rounded-full w-full max-w-[280px] text-center ${
          installStatus.startsWith('✓') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {installStatus}
        </div>
      )}

      {/* Phone frame */}
      <div className="relative bg-zinc-900 rounded-[44px] p-2.5 shadow-2xl border-2 border-zinc-800" style={{ width: 280 }}>
        <div className="w-16 h-4 bg-zinc-900 rounded-b-2xl mx-auto mb-1 relative z-10" />

        {/* Screen area */}
        <div ref={screenRef} className="rounded-[32px] overflow-hidden bg-white" style={{ height: 520 }}>
          {isRealMode ? (
            // GCP_INTEGRATION: swap RealEmulatorScreen for a WebRTC <video> stream when using cloud emulator
            <RealEmulatorScreen
              serial={runningApp.adbSerial!}
              onTap={(x, y) =>
                fetch('/api/emulator/tap', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ serial: runningApp.adbSerial, x, y }),
                })
              }
            />
          ) : (
            <MockScreenContent
              appId={app.id}
              screenId={runningApp.currentScreen}
              onNavigate={screenId => navigateScreen(runningApp.instanceId, screenId)}
            />
          )}
        </div>

        <div className="w-20 h-1 bg-zinc-700 rounded-full mx-auto mt-2" />
      </div>

      {/* Screen nav pills — only in mock mode */}
      {!isRealMode && (
        <div className="flex flex-wrap gap-1 justify-center max-w-[280px]">
          {screens.map(screen => (
            <button key={screen.id}
              onClick={() => navigateScreen(runningApp.instanceId, screen.id)}
              className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                runningApp.currentScreen === screen.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}>
              {screen.label}
            </button>
          ))}
        </div>
      )}

      {/* Android nav buttons — only in real mode */}
      {isRealMode && (
        <div className="flex gap-4 justify-center">
          {[
            { label: '◁', keycode: 4, title: 'Wstecz' },
            { label: '○', keycode: 3, title: 'Home' },
            { label: '□', keycode: 187, title: 'Ostatnie' },
          ].map(btn => (
            <button key={btn.keycode}
              title={btn.title}
              onClick={() =>
                fetch('/api/emulator/key', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ serial: runningApp.adbSerial, keycode: btn.keycode }),
                })
              }
              className="w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 text-base transition-colors">
              {btn.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
