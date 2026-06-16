'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Activity, ArrowLeft } from 'lucide-react'
import { sendPasswordReset } from '@/lib/auth'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await sendPasswordReset(email)
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        opacity: 0.4,
        pointerEvents: 'none',
      }} />

      <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1, width: '380px', maxWidth: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '10px',
            backgroundColor: 'var(--accent-dim)', border: '1px solid rgba(0,212,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', boxShadow: '0 0 24px var(--accent-glow)',
          }}>
            <Activity size={22} color="var(--accent)" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            flowtrack
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Reset your password
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '28px',
        }}>
          {sent ? (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                fontSize: '32px', width: '56px', height: '56px',
                backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto',
              }}>
                ✓
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Check your email
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Sent reset link to <span style={{ color: 'var(--text-secondary)' }}>{email}</span>.
                Click the link to set a new password.
              </div>
              <button
                onClick={() => router.push('/login')}
                style={{
                  marginTop: '8px', padding: '9px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)', backgroundColor: 'transparent',
                  color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
                }}
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
                Enter your email and we&apos;ll send a reset link.
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{
                    display: 'block', fontSize: '11px', color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '6px',
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = 'rgba(0,212,255,0.4)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                    autoFocus
                  />
                </div>

                {error && (
                  <div style={{
                    fontSize: '12px', color: 'var(--danger)', padding: '8px 10px',
                    backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(239,68,68,0.2)',
                  }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px', borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(0,212,255,0.3)',
                    backgroundColor: loading ? 'rgba(0,212,255,0.06)' : 'var(--accent-dim)',
                    color: 'var(--accent)', cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = 'rgba(0,212,255,0.18)' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = loading ? 'rgba(0,212,255,0.06)' : 'var(--accent-dim)' }}
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '8px', borderRadius: 'var(--radius-sm)',
                    border: 'none', backgroundColor: 'transparent',
                    color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit',
                  }}
                >
                  <ArrowLeft size={12} />
                  Back to sign in
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
