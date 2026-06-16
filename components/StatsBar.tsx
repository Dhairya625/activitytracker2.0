'use client'

import { CheckCircle2, CircleDashed, ListChecks, TrendingUp } from 'lucide-react'
import type { Task } from '@/lib/types'

interface StatsBarProps {
  tasks: Task[]
}

export default function StatsBar({ tasks }: StatsBarProps) {
  const total = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const pending = total - completed
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0

  const stats = [
    { label: 'total tasks', value: total, icon: ListChecks, color: 'var(--accent)', progress: 100 },
    { label: 'completed', value: completed, icon: CheckCircle2, color: 'var(--success)' },
    { label: 'in progress', value: pending, icon: CircleDashed, color: 'var(--warning)' },
    { label: 'completion', value: `${rate}%`, icon: TrendingUp, color: 'var(--accent)', progress: rate },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '12px',
    }}>
      {stats.map(({ label, value, icon: Icon, color, progress }) => (
        <div
          key={label}
          className="animate-fade-in"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            minHeight: '132px',
            boxShadow: 'inset 0 1px rgba(255,255,255,0.035)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 650 }}>
              {label}
            </div>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={15} color={color} />
            </div>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <div style={{ fontSize: '28px', fontWeight: 720, color: 'var(--text-primary)', lineHeight: 1 }}>
              {value}
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--bg-elevated)', borderRadius: '99px', overflow: 'hidden', marginTop: '14px' }}>
              <div style={{
                height: '100%',
                width: `${progress ?? (total > 0 ? Math.round((Number(value) / total) * 100) : 0)}%`,
                backgroundColor: color,
                opacity: 0.82,
                borderRadius: '99px',
                transition: 'width 0.35s ease',
              }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
