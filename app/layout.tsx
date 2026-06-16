import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'Activity Tracker',
  description: 'Track tasks, compare team momentum, and maintain daily streaks.',
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
