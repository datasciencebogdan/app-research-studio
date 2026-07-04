import { NextRequest, NextResponse } from 'next/server'
import { adbShell, getConnectedEmulators } from '../lib/adb'

// Expects JSON body: { serial?: string, x: number, y: number, screenW: number, screenH: number }
// x/y are pixel coords in the displayed image; screenW/H are the emulator's actual resolution
export async function POST(req: NextRequest) {
  const { serial, x, y, screenW = 1080, screenH = 1920 } = await req.json()
  const target = serial || getConnectedEmulators()[0]

  if (!target) {
    return NextResponse.json({ error: 'No emulator connected' }, { status: 503 })
  }

  try {
    await adbShell(target, `input tap ${Math.round(x)} ${Math.round(y)}`)
    return NextResponse.json({ ok: true, tapped: { x, y }, serial: target })
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Tap failed' },
      { status: 500 }
    )
  }
}
