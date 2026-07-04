import { NextRequest, NextResponse } from 'next/server'
import { adbInstall, getConnectedEmulators } from '../lib/adb'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import os from 'os'

export async function POST(req: NextRequest) {
  const target = req.nextUrl.searchParams.get('serial') || getConnectedEmulators()[0]

  if (!target) {
    return NextResponse.json({ error: 'No emulator connected' }, { status: 503 })
  }

  const formData = await req.formData()
  const file = formData.get('apk') as File | null

  if (!file || !file.name.endsWith('.apk')) {
    return NextResponse.json({ error: 'No .apk file provided' }, { status: 400 })
  }

  // Write APK to a temp file so ADB can install it
  const tmpDir = path.join(os.tmpdir(), 'ars-apks')
  await mkdir(tmpDir, { recursive: true })
  const apkPath = path.join(tmpDir, `install-${Date.now()}.apk`)

  try {
    const bytes = await file.arrayBuffer()
    await writeFile(apkPath, Buffer.from(bytes))
    const output = adbInstall(target, apkPath)
    return NextResponse.json({ ok: true, output, apkName: file.name })
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Install failed' },
      { status: 500 }
    )
  } finally {
    unlink(apkPath).catch(() => {})
  }
}
