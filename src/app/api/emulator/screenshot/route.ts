import { NextRequest, NextResponse } from 'next/server'
import { adbScreencap, getConnectedEmulators } from '../lib/adb'

export async function GET(req: NextRequest) {
  const serial = req.nextUrl.searchParams.get('serial')

  // Use requested serial, or first available emulator
  const target = serial || getConnectedEmulators()[0]

  if (!target) {
    return NextResponse.json(
      { error: 'No emulator connected. Start one in Android Studio.' },
      { status: 503 }
    )
  }

  try {
    const png = adbScreencap(target)
    return new NextResponse(new Uint8Array(png), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store',
        'X-Emulator-Serial': target,
      },
    })
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Screenshot failed' },
      { status: 500 }
    )
  }
}
