'use client'

import { useState, useRef, useEffect } from 'react'
import { Trophy, TrendingDown, Palette } from 'lucide-react'
import type { Member, Task } from '@/lib/types'
import { getMemberStats, updateMemberColor } from '@/lib/api'
import { MEMBER_COLORS } from '@/lib/types'

interface LeaderboardProps {
  members: Member[]
  tasks: Task[]
  onUpdate: () => void
}

function ColorPopover({
  anchorRef,
  color,
  onSelect,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLButtonElement | null>
  color: string
  onSelect: (c: string) => void
  onClose: () => void
}) {
  const popRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        popRef.current &&
        !popRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose, anchorRef])

  return (
    <div
      ref={popRef}
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        zIndex: 300,
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-hover)',
        borderRadius: 'var(--radius-md)',
        padding: '12px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
        width: '168px',
      }}
    >
      <div style={{
        fontSize: '10px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontWeight: 600,
        marginBottom: '10px',
      }}>
        Pick colour
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {MEMBER_COLORS.map(c => (
          <button
            key={c}
            onClick={() => { onSelect(c); onClose() }}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: c,
              border: color === c ? '2px solid #fff' : '2px solid transparent',
              cursor: 'pointer',
              outline: 'none',
              transition: 'transform 0.12s, box-shadow 0.12s',
              boxShadow: color === c ? `0 0 0 3px ${c}44` : 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.18)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
          />
        ))}
      </div>
    </div>
  )
}

function MemberRow({
  member,
  index,
  isLeader,
  isLagging,
  onColorSelect,
}: {
  member: ReturnType<typeof getMemberStats>[number]
  index: number
  isLeader: boolean
  isLagging: boolean
  onColorSelect: (id: string, color: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false) }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: isLeader ? 'rgba(0,212,255,0.05)' : 'transparent',
        border: `1px solid ${isLeader ? 'rgba(0,212,255,0.12)' : 'transparent'}`,
        transition: 'background-color 0.15s',
      }}
    >
      {/* Rank */}
      <div style={{
        width: '22px',
        textAlign: 'center',
        fontSize: '13px',
        fontWeight: 700,
        color: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#b45309' : 'var(--text-muted)',
        flexShrink: 0,
      }}>
        {index === 0 && member.total > 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
      </div>

      {/* Avatar */}
      <div style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundColor: `${member.color}22`,
        border: `1.5px solid ${member.color}55`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 700,
        color: member.color,
        flexShrink: 0,
      }}>
        {member.name.charAt(0).toUpperCase()}
      </div>

      {/* Name + edit */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '13px',
          color: 'var(--text-primary)',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {member.name}
          </span>
          {isLeader && <Trophy size={11} color="#fbbf24" />}
          {isLagging && <TrendingDown size={11} color="var(--danger)" />}

          {/* Colour edit button — visible on hover */}
          <div style={{ position: 'relative', marginLeft: '2px' }}>
            <button
              ref={btnRef}
              onClick={() => setOpen(o => !o)}
              title="Change colour"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 6px',
                borderRadius: '4px',
                border: `1px solid ${open ? 'var(--border-hover)' : 'var(--border)'}`,
                backgroundColor: open ? 'var(--bg-elevated)' : 'transparent',
                color: open ? 'var(--text-secondary)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '10px',
                opacity: hovered || open ? 1 : 0,
                transition: 'opacity 0.15s, background-color 0.15s',
                pointerEvents: hovered || open ? 'auto' : 'none',
              }}
            >
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: member.color,
                flexShrink: 0,
              }} />
              <Palette size={10} />
            </button>

            {open && (
              <ColorPopover
                anchorRef={btnRef}
                color={member.color}
                onSelect={c => onColorSelect(member.id, c)}
                onClose={() => setOpen(false)}
              />
            )}
          </div>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
          {member.completed}/{member.total} tasks · {member.completionRate}%
        </div>
      </div>

      {/* Progress + count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{
          width: '72px',
          height: '4px',
          backgroundColor: 'var(--border)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${member.completionRate}%`,
            height: '100%',
            backgroundColor: member.color,
            borderRadius: '2px',
            transition: 'width 0.4s ease',
          }} />
        </div>
        <div style={{
          fontSize: '13px',
          fontWeight: 700,
          color: member.color,
          minWidth: '24px',
          textAlign: 'right',
        }}>
          {member.total}
        </div>
      </div>
    </div>
  )
}

export default function Leaderboard({ members, tasks, onUpdate }: LeaderboardProps) {
  const stats = getMemberStats(members, tasks)

  async function handleColorSelect(memberId: string, color: string) {
    await updateMemberColor(memberId, color)
    onUpdate()
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
    }}>
      <div style={{
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '16px',
      }}>
        Leaderboard
      </div>

      {stats.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '12px', padding: '24px 0', textAlign: 'center' }}>
          No members yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {stats.map((member, index) => (
            <MemberRow
              key={member.id}
              member={member}
              index={index}
              isLeader={index === 0 && member.total > 0}
              isLagging={index === stats.length - 1 && stats.length > 1 && member.total < stats[0].total}
              onColorSelect={handleColorSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}
