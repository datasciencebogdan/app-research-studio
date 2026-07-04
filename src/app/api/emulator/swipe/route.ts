import { NextRequest, NextResponse } from 'next/server'
import { adbShell, getConnectedEmulators } from '../lib/adb'

// { serial?, x1, y1, x2, y2, duration? } — all coords in emulator pixels
export async function POST(req: NextRequest) {
  const { serial, x1, y1, x2, y2, duration = 300 } = await req.json()
  const target = serial || getConnectedEmulators()[0]

  if (!target) {
    return NextResponse.json({ error: 'No emulator connected' }, { status: 503 })
  }

  try {
    await adbShell(target, `input swipe ${x1} ${y1} ${x2} ${y2} ${duration}`)
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Swipe failed' },
      { status: 500 }
    )
  }
}
