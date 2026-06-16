'use client'

import { Bot, LogOut, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'
import { normalizeMemberColor, type Member } from '@/lib/types'

interface HeaderProps {
  onAddTask: () => void
  taskCount: number
  memberCount: number
  currentMember: Member | null
}

export default function Header({ onAddTask, taskCount, memberCount, currentMember }: HeaderProps) {
  const router = useRouter()
  const currentMemberColor = normalizeMemberColor(currentMember?.color)

  async function handleSignOut() {
    await signOut()
    router.replace('/login')
  }

  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'rgba(15,16,17,0.86)',
      position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(18px)',
    }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto', padding: '0 24px',
        height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Left: logo + stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-hover)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 1px rgba(255,255,255,0.06)',
          }}>
            <Bot size={15} color="var(--accent)" />
          </div>
          <span style={{ color: 'var(--text-primary)', fontWeight: 680, letterSpacing: '0' }}>
            Activity
          </span>
          <span style={{
            color: 'var(--text-muted)', fontSize: '12px',
            paddingLeft: '12px', borderLeft: '1px solid var(--border)',
          }}>
            {taskCount} tasks / {memberCount} members
          </span>
        </div>

        {/* Right: current user + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {currentMember && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '5px 10px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.025)',
            }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                backgroundColor: `${currentMemberColor}22`,
                border: `1.5px solid ${currentMemberColor}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 700, color: currentMemberColor,
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
              padding: '7px 12px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-hover)', backgroundColor: 'var(--text-primary)',
              color: 'var(--bg-base)', cursor: 'pointer', fontSize: '13px', fontWeight: 650,
              transition: 'transform 0.15s, background-color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.backgroundColor = '#ffffff' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = 'var(--text-primary)' }}
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
