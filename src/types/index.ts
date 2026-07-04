export type AppStatus = 'available' | 'running' | 'stopped'

export interface App {
  id: string
  name: string
  packageName: string
  brandColor: string
  icon: string
  status: AppStatus
}

export interface RunningApp {
  appId: string
  instanceId: string
  currentScreen: string
  startedAt: string
  adbSerial?: string
  // GCP_INTEGRATION: WebRTC stream URL from android-emulator-container gRPC bridge
  emulatorStreamUrl?: string
}

export interface Screenshot {
  id: string
  appId: string
  appName: string
  timestamp: string
  dataUrl: string
  sectionId?: string
  screenName: string
}

export interface SavedSection {
  id: string
  name: string
  screenshotIds: string[]
  createdAt: string
}

export interface Recording {
  id: string
  name: string
  appIds: string[]
  appNames: string[]
  startTime: string
  endTime?: string
  status: 'recording' | 'stopped'
  // GCP_INTEGRATION: connect to emulator screen recording API
  streamUrl?: string
}

export type ActivityAction =
  | 'app_launched'
  | 'app_closed'
  | 'screenshot_taken'
  | 'section_saved'
  | 'recording_started'
  | 'recording_stopped'
  | 'comparison_activated'
  | 'app_added'
  | 'session_exported'

export interface ActivityLogItem {
  id: string
  timestamp: string
  action: ActivityAction
  appId?: string
  appName?: string
  description: string
}

export interface AppTreeNode {
  id: string
  label: string
  children?: AppTreeNode[]
}
