'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Plus, UserCircle2 } from 'lucide-react'
import { getUnclaimedMembers, claimMember, createAndClaimMember, getMemberForUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { MEMBER_COLORS } from '@/lib/types'
import type { Member } from '@/lib/types'

export default function SetupPage() {
  const router = useRouter()
  const [unclaimed, setUnclaimed] = useState<Member[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState<string>(MEMBER_COLORS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession()
      if (!data.session) { router.replace('/login'); return }
      const uid = data.session.user.id
      setUserId(uid)
      const existing = await getMemberForUser(uid)
      if (existing) { router.replace('/'); return }
      const list = await getUnclaimedMembers()
      setUnclaimed(list)
      setPageLoading(false)
    }
    init()
  }, [router])

  async function handleClaim() {
    if (!userId) return
    setError('')
    setLoading(true)
    try {
      if (showNew) {
        if (!newName.trim()) { setError('Enter your name'); setLoading(false); return }
        await createAndClaimMember(newName.trim(), newColor, userId)
      } else {
        if (!selected) { setError('Pick your name'); setLoading(false); return }
        await claimMember(selected, userId)
      }
      router.replace('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed')
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: 'var(--bg-base)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)', fontSize: '13px', gap: '10px',
      }}>
        <div style={{
          width: '16px', height: '16px',
          border: '2px solid var(--border)', borderTopColor: 'var(--accent)',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
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

      <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1, width: '440px', maxWidth: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '10px',
            backgroundColor: 'var(--accent-dim)', border: '1px solid rgba(0,212,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', boxShadow: '0 0 24px var(--accent-glow)',
          }}>
            <UserCircle2 size={22} color="var(--accent)" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Who are you?</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Pick your name or add yourself to the team
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '24px',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {/* Existing unclaimed members */}
          {unclaimed.length > 0 && (
            <div>
              <div style={{
                fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase',
                letterSpacing: '0.06em', fontWeight: 600, marginBottom: '10px',
              }}>
                Existing members
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {unclaimed.map(m => {
                  const isSelected = selected === m.id && !showNew
                  return (
                    <button
                      key={m.id}
                      onClick={() => { setSelected(m.id); setShowNew(false) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${isSelected ? m.color + '55' : 'var(--border)'}`,
                        backgroundColor: isSelected ? `${m.color}10` : 'var(--bg-elevated)',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-hover)' }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border)' }}
                    >
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: `${m.color}22`, border: `1.5px solid ${m.color}55`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: 700, color: m.color, flexShrink: 0,
                      }}>
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ flex: 1, fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {m.name}
                      </span>
                      {isSelected && <Check size={15} color={m.color} />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Divider */}
          {unclaimed.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>or</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
            </div>
          )}

          {/* Add new */}
          {!showNew ? (
            <button
              onClick={() => { setShowNew(true); setSelected(null) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border)', backgroundColor: 'transparent',
                color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <Plus size={15} />
              <span style={{ fontSize: '13px' }}>I&apos;m not listed — add me</span>
            </button>
          ) : (
            <div style={{
              padding: '14px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)',
              display: 'flex', flexDirection: 'column', gap: '12px',
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Your name
              </div>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
                style={{
                  padding: '9px 12px', backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'inherit', outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(0,212,255,0.4)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  Your colour
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {MEMBER_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setNewColor(c)}
                      style={{
                        width: '26px', height: '26px', borderRadius: '6px',
                        backgroundColor: c, outline: 'none', cursor: 'pointer',
                        border: newColor === c ? '2px solid #fff' : '2px solid transparent',
                        boxShadow: newColor === c ? `0 0 0 2px ${c}66` : 'none',
                        transition: 'transform 0.1s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={() => { setShowNew(false); setNewName('') }}
                style={{
                  alignSelf: 'flex-start', background: 'none', border: 'none',
                  color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer', padding: 0,
                }}
              >
                ← Back to list
              </button>
            </div>
          )}

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
            onClick={handleClaim}
            disabled={loading || (!selected && !showNew)}
            style={{
              padding: '10px', borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(0,212,255,0.3)',
              backgroundColor: (loading || (!selected && !showNew)) ? 'rgba(0,212,255,0.04)' : 'var(--accent-dim)',
              color: (loading || (!selected && !showNew)) ? 'var(--text-muted)' : 'var(--accent)',
              cursor: (loading || (!selected && !showNew)) ? 'not-allowed' : 'pointer',
              fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
              transition: 'background-color 0.15s',
            }}
          >
            {loading ? 'Saving…' : "That's me — continue"}
          </button>
        </div>
      </div>
    </div>
  )
}
