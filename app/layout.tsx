import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'FlowTrack — Startup Activity Tracker',
  description: 'Track tasks, see who leads, stay accountable.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
