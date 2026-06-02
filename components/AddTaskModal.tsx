'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { Member } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'
import { createTask } from '@/lib/api'

interface AddTaskModalProps {
  currentMember: Member
  onClose: () => void
  onCreated: () => void
}

export default function AddTaskModal({ currentMember, onClose, onCreated }: AddTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>(CATEGORIES[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Title required'); return }
    setLoading(true)
    setError('')
    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        member_id: currentMember.id,
        category,
      })
      onCreated()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    backgroundColor: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: 600,
    marginBottom: '6px',
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, backdropFilter: 'blur(4px)',
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
          width: '420px',
          maxWidth: 'calc(100vw - 32px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Log Task</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
              <div style={{
                width: '14px', height: '14px', borderRadius: '50%',
                backgroundColor: `${currentMember.color}22`,
                border: `1.5px solid ${currentMember.color}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '8px', fontWeight: 700, color: currentMember.color,
              }}>
                {currentMember.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Logging as <span style={{ color: currentMember.color }}>{currentMember.name}</span>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex' }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Task Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What did you do?"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(0,212,255,0.4)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              autoFocus
            />
          </div>

          <div>
            <label style={labelStyle}>
              Description <span style={{ fontWeight: 400, textTransform: 'none', opacity: 0.6 }}>(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="More details..."
              rows={2}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={e => (e.target.style.borderColor = 'rgba(0,212,255,0.4)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={e => (e.target.style.borderColor = 'rgba(0,212,255,0.4)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
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

          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '9px', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)', backgroundColor: 'transparent',
                color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2, padding: '9px', borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(0,212,255,0.3)',
                backgroundColor: loading ? 'rgba(0,212,255,0.06)' : 'var(--accent-dim)',
                color: 'var(--accent)', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
              }}
            >
              {loading ? 'Logging…' : 'Log Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
