'use client'

import { Flame, GitCompareArrows, Target } from 'lucide-react'
import type { Member, Task } from '@/lib/types'

interface StreakPanelProps {
  members: Member[]
  tasks: Task[]
  currentMember: Member
}

function localDateKey(date: Date) {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60 * 1000).toISOString().slice(0, 10)
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function taskDateKey(task: Task) {
  return task.task_date || task.created_at.slice(0, 10)
}

export default function StreakPanel({ members, tasks, currentMember }: StreakPanelProps) {
  const currentMemberTasks = tasks.filter(task => task.member_id === currentMember.id)
  const activeDays = new Set(currentMemberTasks.map(taskDateKey))
  const today = new Date()
  const todayKey = localDateKey(today)
  const startDate = activeDays.has(todayKey) ? today : addDays(today, -1)

  let streak = 0
  for (let i = 0; i < 365; i += 1) {
    const key = localDateKey(addDays(startDate, -i))
    if (!activeDays.has(key)) break
    streak += 1
  }

  const lastFourteen = Array.from({ length: 14 }, (_, index) => {
    const date = addDays(today, index - 13)
    const key = localDateKey(date)
    return {
      key,
      label: date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1),
      active: activeDays.has(key),
      isToday: key === todayKey,
    }
  })

  const leaderTotal = Math.max(0, ...members.map(member => tasks.filter(task => task.member_id === member.id).length))
  const ownTotal = currentMemberTasks.length
  const teamPosition = members
    .map(member => ({ member, total: tasks.filter(task => task.member_id === member.id).length }))
    .sort((a, b) => b.total - a.total)
    .findIndex(item => item.member.id === currentMember.id) + 1
  const pace = leaderTotal > 0 ? Math.round((ownTotal / leaderTotal) * 100) : 0

  return (
    <section style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '18px',
      boxShadow: 'inset 0 1px rgba(255,255,255,0.035)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            fontSize: '11px',
            fontWeight: 650,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            <Flame size={13} />
            Streak
          </div>
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ color: 'var(--text-primary)', fontSize: '36px', lineHeight: 1, fontWeight: 720 }}>
              {streak}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              day{streak === 1 ? '' : 's'} active
            </span>
          </div>
          <p style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.5 }}>
            Log at least one task each day to keep your chain alive.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div className="pixel-companion" aria-hidden="true">
            <div className="pixel-companion__face" />
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>daily companion</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, minmax(0, 1fr))', gap: '5px', marginTop: '18px' }}>
        {lastFourteen.map(day => (
          <div key={day.key} title={day.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
            <div style={{
              width: '100%',
              height: '34px',
              borderRadius: '5px',
              border: day.isToday ? '1px solid var(--border-hover)' : '1px solid var(--border)',
              backgroundColor: day.active ? 'rgba(135,169,135,0.28)' : 'var(--bg-elevated)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {day.active && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.12), transparent)',
                  transformOrigin: 'left',
                  animation: 'progressSweep 0.55s ease both',
                }} />
              )}
            </div>
            <span style={{ color: day.isToday ? 'var(--text-secondary)' : 'var(--text-muted)', fontSize: '10px' }}>
              {day.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginTop: '18px',
      }}>
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px', backgroundColor: 'var(--bg-card-soft)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <GitCompareArrows size={13} />
            Team pace
          </div>
          <div style={{ marginTop: '8px', color: 'var(--text-primary)', fontSize: '18px', fontWeight: 680 }}>{pace}%</div>
        </div>
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px', backgroundColor: 'var(--bg-card-soft)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <Target size={13} />
            Rank
          </div>
          <div style={{ marginTop: '8px', color: 'var(--text-primary)', fontSize: '18px', fontWeight: 680 }}>
            {teamPosition > 0 ? `${teamPosition}/${Math.max(members.length, 1)}` : '1/1'}
          </div>
        </div>
      </div>
    </section>
  )
}
