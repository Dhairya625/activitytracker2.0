'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { MEMBER_COLORS } from '@/lib/types'
import { createMember } from '@/lib/api'

interface AddMemberModalProps {
  onClose: () => void
  onCreated: () => void
}

export default function AddMemberModal({ onClose, onCreated }: AddMemberModalProps) {
  const [name, setName] = useState('')
  const [color, setColor] = useState<string>(MEMBER_COLORS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Name required'); return }
    setLoading(true)
    setError('')
    try {
      await createMember(name.trim(), color)
      onCreated()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="animate-fade-in"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          width: '360px',
          maxWidth: 'calc(100vw - 32px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Add Member</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Add a teammate to the tracker</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex' }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: 600,
              marginBottom: '6px',
            }}>
              Name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Teammate name"
              autoFocus
              style={{
                width: '100%',
                padding: '9px 12px',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(0,212,255,0.4)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: 600,
              marginBottom: '10px',
            }}>
              Color
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {MEMBER_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: c,
                    border: color === c ? `2px solid white` : '2px solid transparent',
                    cursor: 'pointer',
                    boxShadow: color === c ? `0 0 8px ${c}88` : 'none',
                    transition: 'all 0.15s',
                  }}
                />
              ))}
            </div>

            <div style={{
              marginTop: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: `${color}22`,
                border: `1.5px solid ${color}55`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 700,
                color,
              }}>
                {name.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {name || 'Preview'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Member preview</div>
              </div>
            </div>
          </div>

          {error && (
            <div style={{ fontSize: '12px', color: 'var(--danger)', padding: '8px 10px', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'inherit',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                padding: '9px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(0,212,255,0.3)',
                backgroundColor: 'var(--accent-dim)',
                color: 'var(--accent)',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'inherit',
              }}
            >
              {loading ? 'Adding…' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
