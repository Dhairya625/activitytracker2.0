'use client'

import { CheckCircle2, Clock, TrendingUp, Zap } from 'lucide-react'
import type { Member, Task } from '@/lib/types'

interface StatsBarProps {
  members: Member[]
  tasks: Task[]
}

export default function StatsBar({ members, tasks }: StatsBarProps) {
  const total = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const pending = total - completed
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0

  const stats = [
    { label: 'total tasks', value: total, icon: Zap, color: 'var(--accent)' },
    { label: 'completed', value: completed, icon: CheckCircle2, color: 'var(--success)' },
    { label: 'in progress', value: pending, icon: Clock, color: 'var(--warning)' },
    { label: 'completion', value: `${rate}%`, icon: TrendingUp, color: '#a78bfa' },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px',
    }}>
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="animate-fade-in"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: `${color}18`,
            border: `1px solid ${color}28`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={16} color={color} />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {value}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
