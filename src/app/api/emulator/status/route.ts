import { NextResponse } from 'next/server'
import { getConnectedEmulators, ADB } from '../lib/adb'
import { execSync } from 'child_process'

export async function GET() {
  let adbVersion = 'not found'
  try {
    adbVersion = execSync(`"${ADB}" version`, { encoding: 'utf8', stdio: 'pipe' }).split('\n')[0]
  } catch {
    return NextResponse.json({
      adbFound: false,
      emulators: [],
      message: 'ADB not found. Install Android Studio and make sure the emulator is running.',
    })
  }

  const emulators = getConnectedEmulators()

  return NextResponse.json({
    adbFound: true,
    adbVersion,
    emulators,
    message:
      emulators.length > 0
        ? `${emulators.length} emulator(s) connected`
        : 'ADB found but no emulators running. Start an Android emulator in Android Studio.',
  })
}
