import { execSync, spawnSync } from 'child_process'
import path from 'path'

// ADB binary location — checks ANDROID_HOME env var, then common Windows paths
function getAdbPath(): string {
  if (process.env.ADB_PATH) return process.env.ADB_PATH

  const androidHome =
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk')

  const candidates = [
    path.join(androidHome, 'platform-tools', 'adb.exe'),
    path.join(androidHome, 'platform-tools', 'adb'),
    'adb', // fallback: hope it's on PATH
  ]

  for (const p of candidates) {
    try {
      execSync(`"${p}" version`, { stdio: 'pipe' })
      return p
    } catch {
      continue
    }
  }
  return 'adb'
}

export const ADB = getAdbPath()

// Returns list of connected device serials.
// Detects both local AVDs (emulator-5554) and TCP-connected devices (localhost:5555, 10.x.x.x:5555)
// which is how budtmo/docker-android appears on GCP.
export function getConnectedEmulators(): string[] {
  try {
    const out = execSync(`"${ADB}" devices`, { encoding: 'utf8', stdio: 'pipe' })
    return out
      .split('\n')
      .slice(1)
      .filter(line => line.includes('\tdevice'))
      .map(line => line.split('\t')[0].trim())
      .filter(serial => serial.length > 0)
  } catch {
    return []
  }
}

// Run an ADB shell command on a specific emulator
export function adbShell(serial: string, command: string): string {
  try {
    return execSync(`"${ADB}" -s ${serial} shell ${command}`, {
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 10000,
    })
  } catch (e: unknown) {
    throw new Error(`adb shell failed: ${e instanceof Error ? e.message : String(e)}`)
  }
}

// Capture screen as PNG buffer — uses exec-out so binary data isn't corrupted
export function adbScreencap(serial: string): Buffer {
  const result = spawnSync(ADB, ['-s', serial, 'exec-out', 'screencap', '-p'], {
    timeout: 8000,
    maxBuffer: 20 * 1024 * 1024, // 20MB
  })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error('screencap failed')
  return result.stdout as Buffer
}

// Install APK — returns adb install output
export function adbInstall(serial: string, apkPath: string): string {
  try {
    return execSync(`"${ADB}" -s ${serial} install -r "${apkPath}"`, {
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 120000,
    })
  } catch (e: unknown) {
    throw new Error(`adb install failed: ${e instanceof Error ? e.message : String(e)}`)
  }
}
