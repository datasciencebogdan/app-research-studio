'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  App,
  RunningApp,
  Screenshot,
  SavedSection,
  Recording,
  ActivityLogItem,
  ActivityAction,
} from '@/types'
import { mockApps } from '@/data/mockApps'
import { getMockScreens } from '@/data/mockScreens'

type PersistedKeys =
  | 'apps'
  | 'runningApps'
  | 'screenshots'
  | 'sections'
  | 'recordings'
  | 'activityLog'
  | 'isRecording'
  | 'currentRecordingId'
  | 'isDarkMode'
  | 'activeBottomTab'
  | 'selectedAppForTree'
  | 'isBottomDrawerOpen'

interface SessionState {
  apps: App[]
  runningApps: RunningApp[]
  screenshots: Screenshot[]
  sections: SavedSection[]
  recordings: Recording[]
  activityLog: ActivityLogItem[]
  isRecording: boolean
  currentRecordingId: string | null
  isDarkMode: boolean
  activeBottomTab: 'log' | 'sections' | 'recordings' | 'tree'
  selectedAppForTree: string | null
  isBottomDrawerOpen: boolean

  launchApp: (appId: string) => void
  launchRealApp: (appId: string, adbSerial: string) => void
  closeApp: (instanceId: string) => void
  navigateScreen: (instanceId: string, screenId: string) => void
  takeScreenshot: (instanceId: string, dataUrl: string, screenName: string) => void
  createSection: (name: string) => string
  addScreenshotToSection: (screenshotId: string, sectionId: string) => void
  startRecording: () => void
  stopRecording: () => void
  addApp: (name: string, icon: string, brandColor: string) => void
  toggleDarkMode: () => void
  setActiveBottomTab: (tab: 'log' | 'sections' | 'recordings' | 'tree') => void
  setSelectedAppForTree: (appId: string | null) => void
  toggleBottomDrawer: () => void
  clearActivityLog: () => void
  deleteSection: (sectionId: string) => void
}

function genId(): string {
  return Math.random().toString(36).slice(2, 11)
}

function addLog(
  set: (fn: (s: SessionState) => Partial<SessionState>) => void,
  action: ActivityAction,
  description: string,
  appId?: string,
  appName?: string
) {
  const item: ActivityLogItem = {
    id: genId(),
    timestamp: new Date().toISOString(),
    action,
    appId,
    appName,
    description,
  }
  set(s => ({ activityLog: [item, ...s.activityLog].slice(0, 100) }))
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      apps: mockApps,
      runningApps: [],
      screenshots: [],
      sections: [],
      recordings: [],
      activityLog: [],
      isRecording: false,
      currentRecordingId: null,
      isDarkMode: true,
      activeBottomTab: 'log',
      selectedAppForTree: null,
      isBottomDrawerOpen: false,

      launchApp: (appId) => {
        const { apps, runningApps } = get()
        const app = apps.find(a => a.id === appId)
        if (!app || runningApps.find(r => r.appId === appId)) return
        const instanceId = genId()
        const firstScreen = getMockScreens(appId)[0]?.id ?? 'home'
        set(s => ({
          runningApps: [
            ...s.runningApps,
            { appId, instanceId, currentScreen: firstScreen, startedAt: new Date().toISOString() },
          ],
          apps: s.apps.map(a => a.id === appId ? { ...a, status: 'running' } : a),
        }))
        addLog(set, 'app_launched', `Uruchomiono: ${app.name}`, appId, app.name)
        const after = get().runningApps
        if (after.length >= 2) {
          const names = after.map(r => get().apps.find(a => a.id === r.appId)?.name ?? r.appId)
          addLog(set, 'comparison_activated', `Tryb porównawczy: ${names.join(' vs ')}`)
        }
      },

      launchRealApp: (appId, adbSerial) => {
        const { apps, runningApps } = get()
        const app = apps.find(a => a.id === appId)
        if (!app) return
        // Allow multiple instances when using different serials
        const existing = runningApps.find(r => r.appId === appId && r.adbSerial === adbSerial)
        if (existing) return
        const instanceId = genId()
        set(s => ({
          runningApps: [
            ...s.runningApps,
            { appId, instanceId, currentScreen: 'real', startedAt: new Date().toISOString(), adbSerial },
          ],
          apps: s.apps.map(a => a.id === appId ? { ...a, status: 'running' } : a),
        }))
        addLog(set, 'app_launched', `Uruchomiono rzeczywisty: ${app.name} (${adbSerial})`, appId, app.name)
      },

      closeApp: (instanceId) => {
        const { runningApps, apps } = get()
        const running = runningApps.find(r => r.instanceId === instanceId)
        if (!running) return
        const app = apps.find(a => a.id === running.appId)
        set(s => ({
          runningApps: s.runningApps.filter(r => r.instanceId !== instanceId),
          apps: s.apps.map(a => a.id === running.appId ? { ...a, status: 'stopped' } : a),
        }))
        addLog(set, 'app_closed', `Zamknięto: ${app?.name}`, running.appId, app?.name)
      },

      navigateScreen: (instanceId, screenId) => {
        set(s => ({
          runningApps: s.runningApps.map(r =>
            r.instanceId === instanceId ? { ...r, currentScreen: screenId } : r
          ),
        }))
      },

      takeScreenshot: (instanceId, dataUrl, screenName) => {
        const { runningApps, apps } = get()
        const running = runningApps.find(r => r.instanceId === instanceId)
        if (!running) return
        const app = apps.find(a => a.id === running.appId)
        const screenshot: Screenshot = {
          id: genId(),
          appId: running.appId,
          appName: app?.name ?? running.appId,
          timestamp: new Date().toISOString(),
          dataUrl,
          screenName,
        }
        set(s => ({ screenshots: [screenshot, ...s.screenshots] }))
        addLog(set, 'screenshot_taken', `Zrzut: ${app?.name} — ${screenName}`, running.appId, app?.name)
      },

      createSection: (name) => {
        const id = genId()
        set(s => ({
          sections: [...s.sections, { id, name, screenshotIds: [], createdAt: new Date().toISOString() }],
        }))
        addLog(set, 'section_saved', `Utworzono sekcję: ${name}`)
        return id
      },

      addScreenshotToSection: (screenshotId, sectionId) => {
        set(s => ({
          sections: s.sections.map(sec =>
            sec.id === sectionId && !sec.screenshotIds.includes(screenshotId)
              ? { ...sec, screenshotIds: [...sec.screenshotIds, screenshotId] }
              : sec
          ),
          screenshots: s.screenshots.map(sc =>
            sc.id === screenshotId ? { ...sc, sectionId } : sc
          ),
        }))
      },

      startRecording: () => {
        const { runningApps, apps } = get()
        const recApps = runningApps.map(r => ({
          id: r.appId,
          name: apps.find(a => a.id === r.appId)?.name ?? r.appId,
        }))
        const rec: Recording = {
          id: genId(),
          name: `Nagranie ${new Date().toLocaleTimeString('pl-PL')}`,
          appIds: recApps.map(a => a.id),
          appNames: recApps.map(a => a.name),
          startTime: new Date().toISOString(),
          status: 'recording',
        }
        set(s => ({
          isRecording: true,
          currentRecordingId: rec.id,
          recordings: [...s.recordings, rec],
        }))
        addLog(set, 'recording_started', `Rozpoczęto nagrywanie: ${rec.name}`)
      },

      stopRecording: () => {
        const { currentRecordingId } = get()
        if (!currentRecordingId) return
        set(s => ({
          isRecording: false,
          currentRecordingId: null,
          recordings: s.recordings.map(r =>
            r.id === currentRecordingId
              ? { ...r, status: 'stopped', endTime: new Date().toISOString() }
              : r
          ),
        }))
        addLog(set, 'recording_stopped', 'Zatrzymano nagrywanie')
      },

      addApp: (name, icon, brandColor) => {
        const app: App = {
          id: genId(),
          name,
          packageName: `com.custom.${name.toLowerCase().replace(/\s+/g, '')}`,
          brandColor,
          icon,
          status: 'available',
        }
        set(s => ({ apps: [...s.apps, app] }))
        addLog(set, 'app_added', `Dodano aplikację: ${name}`)
      },

      toggleDarkMode: () => set(s => ({ isDarkMode: !s.isDarkMode })),
      setActiveBottomTab: (tab) => set({ activeBottomTab: tab }),
      setSelectedAppForTree: (appId) => set({ selectedAppForTree: appId }),
      toggleBottomDrawer: () => set(s => ({ isBottomDrawerOpen: !s.isBottomDrawerOpen })),
      clearActivityLog: () => set({ activityLog: [] }),

      deleteSection: (sectionId) => {
        set(s => ({
          sections: s.sections.filter(sec => sec.id !== sectionId),
          screenshots: s.screenshots.map(sc =>
            sc.sectionId === sectionId ? { ...sc, sectionId: undefined } : sc
          ),
        }))
      },
    }),
    {
      name: 'ars-session',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} }
        }
        return localStorage
      }),
      partialize: (s): Pick<SessionState, PersistedKeys> => ({
        apps: s.apps,
        runningApps: s.runningApps,
        screenshots: s.screenshots,
        sections: s.sections,
        recordings: s.recordings,
        activityLog: s.activityLog,
        isRecording: s.isRecording,
        currentRecordingId: s.currentRecordingId,
        isDarkMode: s.isDarkMode,
        activeBottomTab: s.activeBottomTab,
        selectedAppForTree: s.selectedAppForTree,
        isBottomDrawerOpen: s.isBottomDrawerOpen,
      }),
    }
  )
)
