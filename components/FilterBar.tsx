'use client'

import { CalendarDays, List, X } from 'lucide-react'
import type { Member } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'

export type ViewMode = 'list' | 'calendar'
export type StatusFilter = 'all' | 'pending' | 'completed'

export interface Filters {
  member: string   // '' = all
  category: string // '' = all
  status: StatusFilter
}

interface FilterBarProps {
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  filters: Filters
  onFiltersChange: (f: Filters) => void
  members: Member[]
  taskCount: number
  filteredCount: number
}

export default function FilterBar({
  view, onViewChange, filters, onFiltersChange, members, taskCount, filteredCount,
}: FilterBarProps) {
  const hasActiveFilters = filters.member !== '' || filters.category !== '' || filters.status !== 'all'

  function clearAll() {
    onFiltersChange({ member: '', category: '', status: 'all' })
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '12px 16px',
      display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
      boxShadow: 'inset 0 1px rgba(255,255,255,0.035)',
    }}>
      {/* View toggle */}
      <div style={{
        display: 'flex', borderRadius: '8px',
        border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0,
      }}>
        <ViewBtn active={view === 'list'} onClick={() => onViewChange('list')}>
          <List size={13} />
          <span>List</span>
        </ViewBtn>
        <ViewBtn active={view === 'calendar'} onClick={() => onViewChange('calendar')}>
          <CalendarDays size={13} />
          <span>Calendar</span>
        </ViewBtn>
      </div>

      <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border)', flexShrink: 0 }} />

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
        {/* Status */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['all', 'pending', 'completed'] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => onFiltersChange({ ...filters, status: s })}
              style={{
                padding: '4px 10px', borderRadius: '100px', fontSize: '11px',
                fontWeight: 500, cursor: 'pointer', border: '1px solid',
                transition: 'all 0.15s',
                borderColor: filters.status === s ? 'var(--border-hover)' : 'var(--border)',
                backgroundColor: filters.status === s ? 'var(--accent-dim)' : 'transparent',
                color: filters.status === s ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              {s === 'all' ? 'All' : s === 'pending' ? 'Pending' : 'Done'}
            </button>
          ))}
        </div>

        {/* Member */}
        <SelectFilter
          value={filters.member}
          onChange={v => onFiltersChange({ ...filters, member: v })}
          placeholder="All members"
        >
          {members.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </SelectFilter>

        {/* Category */}
        <SelectFilter
          value={filters.category}
          onChange={v => onFiltersChange({ ...filters, category: v })}
          placeholder="All categories"
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </SelectFilter>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '11px', color: 'var(--text-muted)', padding: '4px 6px',
              borderRadius: '6px', transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <X size={11} />
            Clear
          </button>
        )}
      </div>

      {/* Count */}
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>
        {hasActiveFilters ? `${filteredCount} / ${taskCount}` : `${taskCount} tasks`}
      </div>
    </div>
  )
}

function ViewBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        padding: '5px 12px', fontSize: '11px', fontWeight: 500,
        background: active ? 'var(--accent-dim)' : 'transparent',
        color: active ? 'var(--text-primary)' : 'var(--text-muted)',
        border: 'none', cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}

function SelectFilter({
  value, onChange, placeholder, children,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  children: React.ReactNode
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: '4px 8px', borderRadius: '6px', fontSize: '11px',
        border: `1px solid ${value ? 'var(--border-hover)' : 'var(--border)'}`,
        backgroundColor: value ? 'var(--accent-dim)' : 'var(--bg-base)',
        color: value ? 'var(--text-primary)' : 'var(--text-muted)',
        cursor: 'pointer', outline: 'none',
        appearance: 'none', paddingRight: '20px',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236b7280'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center',
      }}
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  )
}
