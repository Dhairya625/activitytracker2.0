'use client'

import { Activity, Plus, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'
import type { Member } from '@/lib/types'

interface HeaderProps {
  onAddTask: () => void
  taskCount: number
  memberCount: number
  currentMember: Member | null
}

export default function Header({ onAddTask, taskCount, memberCount, currentMember }: HeaderProps) {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.replace('/login')
  }

  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'var(--bg-surface)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto', padding: '0 24px',
        height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Left: logo + stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px',
            backgroundColor: 'var(--accent-dim)', border: '1px solid rgba(0,212,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity size={14} color="var(--accent)" />
          </div>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600, letterSpacing: '-0.02em' }}>
            flowtrack
          </span>
          <span style={{
            color: 'var(--text-muted)', fontSize: '12px',
            paddingLeft: '12px', borderLeft: '1px solid var(--border)',
          }}>
            {taskCount} tasks · {memberCount} members
          </span>
        </div>

        {/* Right: current user + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {currentMember && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '5px 10px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)',
            }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                backgroundColor: `${currentMember.color}22`,
                border: `1.5px solid ${currentMember.color}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 700, color: currentMember.color,
              }}>
                {currentMember.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {currentMember.name}
              </span>
            </div>
          )}

          <button
            onClick={onAddTask}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(0,212,255,0.3)', backgroundColor: 'var(--accent-dim)',
              color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(0,212,255,0.18)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--accent-dim)')}
          >
            <Plus size={13} />
            Log Task
          </button>

          <button
            onClick={handleSignOut}
            title="Sign out"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)', backgroundColor: 'transparent',
              color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--danger)'; e.currentTarget.style.color = 'var(--danger)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </header>
  )
}
