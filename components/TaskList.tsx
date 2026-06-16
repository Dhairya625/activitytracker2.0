'use client'

import { CalendarDays, CheckCircle2, Circle, Lock, Pencil, Tag, Trash2 } from 'lucide-react'
import type { Task } from '@/lib/types'
import { toggleTask, deleteTask } from '@/lib/api'
import { useState } from 'react'

interface TaskListProps {
  tasks: Task[]
  onUpdate: () => void
  currentMemberId: string
  onEdit: (task: Task) => void
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

export default function TaskList({ tasks, onUpdate, currentMemberId, onEdit }: TaskListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handleToggle(task: Task) {
    if (task.member_id !== currentMemberId) return
    setLoadingId(task.id)
    await toggleTask(task.id, !task.completed)
    onUpdate()
    setLoadingId(null)
  }

  async function handleDelete(id: string) {
    setLoadingId(id)
    await deleteTask(id)
    onUpdate()
    setLoadingId(null)
  }

  function formatTaskDate(task: Task) {
    const value = task.task_date || task.created_at
    const date = value.includes('T') ? new Date(value) : new Date(`${value}T12:00:00`)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (tasks.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '48px',
        textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px',
      }}>
        <div style={{ marginBottom: '8px', fontSize: '24px' }}>⚡</div>
        No tasks yet. Log your first task.
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Recent Tasks
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {tasks.filter(t => t.completed).length}/{tasks.length} done
        </div>
      </div>

      <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
        {tasks.map((task, i) => {
          const isOwn = task.member_id === currentMemberId
          const catColor = CATEGORY_COLORS[task.category] ?? '#6b7280'
          const memberColor = task.member?.color ?? '#6b7280'
          const isLoading = loadingId === task.id

          return (
            <div
              key={task.id}
              className="animate-fade-in"
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 20px',
                borderBottom: i < tasks.length - 1 ? '1px solid var(--border)' : 'none',
                opacity: isLoading ? 0.5 : 1,
                transition: 'opacity 0.15s',
                backgroundColor: isOwn ? 'rgba(255,255,255,0.01)' : 'transparent',
              }}
            >
              {/* Toggle — only own tasks */}
              <button
                onClick={() => handleToggle(task)}
                disabled={isLoading || !isOwn}
                title={isOwn ? undefined : 'You can only update your own tasks'}
                style={{
                  background: 'none', border: 'none', padding: 0,
                  display: 'flex', flexShrink: 0,
                  color: task.completed ? 'var(--success)' : isOwn ? 'var(--text-muted)' : 'var(--text-muted)',
                  cursor: isOwn ? 'pointer' : 'default',
                  opacity: isOwn ? 1 : 0.35,
                  transition: 'color 0.15s',
                }}
              >
                {task.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '13px',
                  color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {task.title}
                </div>
                {task.description && (
                  <div style={{
                    fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {task.description}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '2px 8px', borderRadius: '100px',
                  backgroundColor: `${catColor}15`, border: `1px solid ${catColor}25`,
                }}>
                  <Tag size={9} color={catColor} />
                  <span style={{ fontSize: '10px', color: catColor }}>{task.category}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    backgroundColor: `${memberColor}22`, border: `1px solid ${memberColor}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '9px', fontWeight: 700, color: memberColor,
                  }}>
                    {task.member?.name.charAt(0).toUpperCase()}
                  </div>
                  {task.member?.name}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '40px', textAlign: 'right' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CalendarDays size={10} />
                    {formatTaskDate(task)}
                  </span>
                </div>

                {/* Edit/delete - only own tasks */}
                {isOwn ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <button
                      onClick={() => onEdit(task)}
                      disabled={isLoading}
                      title="Edit task"
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '4px', display: 'flex', color: 'var(--text-muted)',
                        borderRadius: '4px', transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={isLoading}
                      title="Delete task"
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '4px', display: 'flex', color: 'var(--text-muted)',
                        borderRadius: '4px', transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <div style={{ width: '42px', display: 'flex', justifyContent: 'center', opacity: 0.2 }}>
                    <Lock size={11} color="var(--text-muted)" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
