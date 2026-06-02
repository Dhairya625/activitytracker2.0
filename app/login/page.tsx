'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Activity } from 'lucide-react'
import { signIn, signUp } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/')
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      if (mode === 'register') {
        const { user } = await signUp(email, password)
        if (user && !user.confirmed_at) {
          setInfo('Check your email to confirm your account, then sign in.')
          setLoading(false)
          return
        }
      } else {
        await signIn(email, password)
      }
      router.replace('/')
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
      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        opacity: 0.4,
        pointerEvents: 'none',
      }} />

      <div className="animate-fade-in" style={{
        position: 'relative', zIndex: 1,
        width: '380px',
        maxWidth: '100%',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '44px', height: '44px',
            borderRadius: '10px',
            backgroundColor: 'var(--accent-dim)',
            border: '1px solid rgba(0,212,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 0 24px var(--accent-glow)',
          }}>
            <Activity size={22} color="var(--accent)" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            flowtrack
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Startup activity tracker
          </div>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
        }}>
          {/* Mode toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-sm)',
            padding: '3px',
            marginBottom: '24px',
          }}>
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setInfo('') }}
                style={{
                  flex: 1,
                  padding: '7px',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: mode === m ? 'var(--bg-card)' : 'transparent',
                  color: mode === m ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: mode === m ? 600 : 400,
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                  boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                {m === 'login' ? 'Sign in' : 'Register'}
              </button>
            ))}
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

            <div>
              <label style={{
                display: 'block', fontSize: '11px', color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '6px',
              }}>
                Password
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

            {info && (
              <div style={{
                fontSize: '12px', color: 'var(--success)', padding: '8px 10px',
                backgroundColor: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}>
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(0,212,255,0.3)',
                backgroundColor: loading ? 'rgba(0,212,255,0.06)' : 'var(--accent-dim)',
                color: 'var(--accent)',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'background-color 0.15s',
                marginTop: '4px',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = 'rgba(0,212,255,0.18)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = loading ? 'rgba(0,212,255,0.06)' : 'var(--accent-dim)' }}
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
