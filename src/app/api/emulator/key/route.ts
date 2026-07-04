import { NextRequest, NextResponse } from 'next/server'
import { adbShell, getConnectedEmulators } from '../lib/adb'

// Android key codes: https://developer.android.com/reference/android/view/KeyEvent
// Common: KEYCODE_BACK=4, KEYCODE_HOME=3, KEYCODE_APP_SWITCH=187
export async function POST(req: NextRequest) {
  const { serial, keycode } = await req.json()
  const target = serial || getConnectedEmulators()[0]

  if (!target) {
    return NextResponse.json({ error: 'No emulator connected' }, { status: 503 })
  }

  try {
    await adbShell(target, `input keyevent ${keycode}`)
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Key event failed' },
      { status: 500 }
    )
  }
}
