'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import StatsBar from '@/components/StatsBar'
import Charts from '@/components/Charts'
import Leaderboard from '@/components/Leaderboard'
import TaskList from '@/components/TaskList'
import CalendarView from '@/components/CalendarView'
import FilterBar from '@/components/FilterBar'
import AddTaskModal from '@/components/AddTaskModal'
import { getMembers, getTasks } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import type { Member, Task } from '@/lib/types'
import type { ViewMode, Filters } from '@/components/FilterBar'

function Spinner() {
  return (
    <div style={{
      minHeight: '100vh', backgroundColor: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '10px', color: 'var(--text-muted)', fontSize: '13px',
    }}>
      <div style={{
        width: '16px', height: '16px',
        border: '2px solid var(--border)', borderTopColor: 'var(--accent)',
        borderRadius: '50%', animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const { user, member: currentMember, loading: authLoading } = useAuth()
  const [members, setMembers] = useState<Member[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [showAddTask, setShowAddTask] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [view, setView] = useState<ViewMode>('list')
  const [filters, setFilters] = useState<Filters>({ member: '', category: '', status: 'all' })

  const load = useCallback(async () => {
    try {
      const [m, t] = await Promise.all([getMembers(), getTasks()])
      setMembers(m)
      setTasks(t)
    } catch {
      // user sees empty state
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.replace('/login'); return }
    if (!currentMember) { router.replace('/setup'); return }
    const loadTimer = window.setTimeout(() => {
      void load()
    }, 0)
    return () => window.clearTimeout(loadTimer)
  }, [authLoading, user, currentMember, router, load])

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (filters.member && t.member_id !== filters.member) return false
      if (filters.category && t.category !== filters.category) return false
      if (filters.status === 'pending' && t.completed) return false
      if (filters.status === 'completed' && !t.completed) return false
      return true
    })
  }, [tasks, filters])

  if (authLoading || dataLoading) return <Spinner />

  if (!currentMember) return null

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
      <Header
        onAddTask={() => setShowAddTask(true)}
        taskCount={tasks.length}
        memberCount={members.length}
        currentMember={currentMember}
      />

      <main style={{
        maxWidth: '1400px', margin: '0 auto', padding: '24px',
        display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        <StatsBar tasks={tasks} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Charts members={members} tasks={tasks} />
            <FilterBar
              view={view}
              onViewChange={setView}
              filters={filters}
              onFiltersChange={setFilters}
              members={members}
              taskCount={tasks.length}
              filteredCount={filteredTasks.length}
            />
            {view === 'list' ? (
              <TaskList
                tasks={filteredTasks}
                onUpdate={load}
                currentMemberId={currentMember.id}
                onEdit={setEditingTask}
              />
            ) : (
              <CalendarView tasks={filteredTasks} />
            )}
          </div>
          <Leaderboard members={members} tasks={tasks} onUpdate={load} />
        </div>
      </main>

      {showAddTask && (
        <AddTaskModal
          currentMember={currentMember}
          onClose={() => setShowAddTask(false)}
          onCreated={load}
        />
      )}
      {editingTask && (
        <AddTaskModal
          currentMember={currentMember}
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onCreated={load}
        />
      )}
    </div>
  )
}
