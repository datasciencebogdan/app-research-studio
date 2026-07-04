import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeWrapper } from '@/components/ThemeWrapper'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'App Research Studio',
  description: 'Środowisko badawcze i testowe dla aplikacji mobilnych',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="h-screen overflow-hidden bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  )
}
