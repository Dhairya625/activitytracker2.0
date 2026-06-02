'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Activity } from 'lucide-react'
import { updatePassword } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Supabase sets the session from the URL hash on this page
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setError('')
    setLoading(true)
    try {
      await updatePassword(password)
      setDone(true)
      setTimeout(() => router.replace('/'), 2000)
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
      minHeight: '100vh', backgroundColor: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '48px 48px', opacity: 0.4, pointerEvents: 'none',
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
            Set new password
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '28px',
        }}>
          {done ? (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                fontSize: '32px', width: '56px', height: '56px',
                backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto',
              }}>
                ✓
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Password updated</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Redirecting you in…</div>
            </div>
          ) : !ready ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '12px 0' }}>
              Verifying reset link…
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{
                  display: 'block', fontSize: '11px', color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '6px',
                }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="········"
                  required
                  minLength={6}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(0,212,255,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                  autoFocus
                />
              </div>

              <div>
                <label style={{
                  display: 'block', fontSize: '11px', color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '6px',
                }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="········"
                  required
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(0,212,255,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
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
                  marginTop: '4px',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = 'rgba(0,212,255,0.18)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = loading ? 'rgba(0,212,255,0.06)' : 'var(--accent-dim)' }}
              >
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
