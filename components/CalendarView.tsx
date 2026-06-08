'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react'
import type { Task } from '@/lib/types'

interface CalendarViewProps {
  tasks: Task[]
  currentMemberId: string
}

const CATEGORY_COLORS: Record<string, string> = {
  Engineering: '#00d4ff',
  Design: '#a78bfa',
  Marketing: '#f59e0b',
  Sales: '#10b981',
  Operations: '#fb923c',
  Research: '#60a5fa',
  Other: '#6b7280',
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarView({ tasks, currentMemberId }: CalendarViewProps) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  function prevMonth() {
    setSelectedDay(null)
    setViewDate(new Date(year, month - 1, 1))
  }
  function nextMonth() {
    setSelectedDay(null)
    setViewDate(new Date(year, month + 1, 1))
  }

  // Build calendar grid: pad start with empty cells
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  // Map tasks to date strings YYYY-MM-DD
  const tasksByDate: Record<string, Task[]> = {}
  for (const task of tasks) {
    const d = new Date(task.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (!tasksByDate[key]) tasksByDate[key] = []
    tasksByDate[key].push(task)
  }

  function dayKey(day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const selectedTasks = selectedDay ? (tasksByDate[selectedDay] ?? []) : []

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Calendar
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={prevMonth} style={navBtnStyle}>
            <ChevronLeft size={14} />
          </button>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', minWidth: '130px', textAlign: 'center' }}>
            {monthLabel}
          </span>
          <button onClick={nextMonth} style={navBtnStyle}>
            <ChevronRight size={14} />
          </button>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Day name row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
          {DAY_NAMES.map(d => (
            <div key={d} style={{
              textAlign: 'center', fontSize: '10px', fontWeight: 600,
              color: 'var(--text-muted)', letterSpacing: '0.06em',
              textTransform: 'uppercase', padding: '4px 0',
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />

            const key = dayKey(day)
            const dayTasks = tasksByDate[key] ?? []
            const isToday = key === todayKey
            const isSelected = key === selectedDay
            const completedCount = dayTasks.filter(t => t.completed).length
            const totalCount = dayTasks.length

            return (
              <button
                key={key}
                onClick={() => setSelectedDay(isSelected ? null : key)}
                style={{
                  position: 'relative',
                  minHeight: '64px',
                  padding: '6px 4px 4px',
                  borderRadius: '8px',
                  border: isSelected
                    ? '1px solid var(--accent)'
                    : isToday
                      ? '1px solid rgba(0,212,255,0.3)'
                      : '1px solid transparent',
                  backgroundColor: isSelected
                    ? 'rgba(0,212,255,0.08)'
                    : isToday
                      ? 'rgba(0,212,255,0.04)'
                      : 'transparent',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, background-color 0.15s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  textAlign: 'center',
                }}
                onMouseEnter={e => {
                  if (!isSelected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.03)'
                }}
                onMouseLeave={e => {
                  if (!isSelected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = isToday ? 'rgba(0,212,255,0.04)' : 'transparent'
                }}
              >
                <span style={{
                  fontSize: '12px', fontWeight: isToday ? 700 : 400,
                  color: isToday ? 'var(--accent)' : 'var(--text-primary)',
                  width: '22px', height: '22px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: isToday ? 'rgba(0,212,255,0.12)' : 'transparent',
                }}>
                  {day}
                </span>

                {/* Task dots */}
                {totalCount > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center', maxWidth: '40px' }}>
                    {dayTasks.slice(0, 5).map(t => (
                      <div key={t.id} style={{
                        width: '5px', height: '5px', borderRadius: '50%',
                        backgroundColor: t.completed
                          ? 'var(--success)'
                          : CATEGORY_COLORS[t.category] ?? '#6b7280',
                        opacity: t.completed ? 0.5 : 1,
                      }} />
                    ))}
                    {totalCount > 5 && (
                      <span style={{ fontSize: '8px', color: 'var(--text-muted)', lineHeight: 1.2 }}>
                        +{totalCount - 5}
                      </span>
                    )}
                  </div>
                )}

                {/* Count badge */}
                {totalCount > 0 && (
                  <span style={{
                    fontSize: '9px', color: 'var(--text-muted)',
                  }}>
                    {completedCount}/{totalCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day panel */}
      {selectedDay && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '16px 20px',
        }}>
          <div style={{
            fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px',
          }}>
            {new Date(selectedDay + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            <span style={{ fontWeight: 400, marginLeft: '8px' }}>
              — {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''}
            </span>
          </div>

          {selectedTasks.length === 0 ? (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
              No tasks on this day
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedTasks.map(task => {
                const catColor = CATEGORY_COLORS[task.category] ?? '#6b7280'
                const memberColor = task.member?.color ?? '#6b7280'
                return (
                  <div key={task.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 12px', borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.025)',
                    border: '1px solid var(--border)',
                  }}>
                    <span style={{ color: task.completed ? 'var(--success)' : 'var(--text-muted)', display: 'flex', flexShrink: 0 }}>
                      {task.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                    </span>
                    <span style={{
                      flex: 1, fontSize: '12px', minWidth: 0,
                      color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {task.title}
                    </span>
                    <span style={{
                      fontSize: '9px', padding: '2px 6px', borderRadius: '100px',
                      backgroundColor: `${catColor}15`, color: catColor, border: `1px solid ${catColor}25`,
                      flexShrink: 0,
                    }}>
                      {task.category}
                    </span>
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '50%',
                      backgroundColor: `${memberColor}22`, border: `1px solid ${memberColor}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '8px', fontWeight: 700, color: memberColor, flexShrink: 0,
                    }}>
                      {task.member?.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const navBtnStyle: React.CSSProperties = {
  background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
  padding: '4px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center',
  color: 'var(--text-muted)', transition: 'border-color 0.15s, color 0.15s',
}
