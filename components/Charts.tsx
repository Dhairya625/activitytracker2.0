'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import type { Member, Task } from '@/lib/types'
import { getMemberStats } from '@/lib/api'

interface ChartsProps {
  members: Member[]
  tasks: Task[]
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number; name: string; fill: string }>
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      backgroundColor: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: '8px 12px',
      fontSize: '12px',
    }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.fill, display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-primary)' }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

const CustomPieTooltip = ({ active, payload }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { color: string } }>
}) => {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div style={{
      backgroundColor: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: '8px 12px',
      fontSize: '12px',
    }}>
      <div style={{ color: item.payload.color, fontWeight: 600 }}>{item.name}</div>
      <div style={{ color: 'var(--text-secondary)' }}>{item.value} tasks</div>
    </div>
  )
}

const CHART_ACCENTS = ['#A8A29E', '#87A987', '#B9A36A', '#8FA3A6', '#9B8EA5', '#A78B7A', '#B08C7A', '#9CA3AF']

export default function Charts({ members, tasks }: ChartsProps) {
  const stats = getMemberStats(members, tasks)

  const barData = stats.map((s, index) => ({
    name: s.name.length > 10 ? s.name.slice(0, 10) + '…' : s.name,
    fullName: s.name,
    Completed: s.completed,
    Pending: s.pending,
    fill: CHART_ACCENTS[index % CHART_ACCENTS.length],
  }))

  const pieData = stats
    .filter(s => s.total > 0)
    .map((s, index) => ({
      name: s.name,
      value: s.total,
      color: CHART_ACCENTS[index % CHART_ACCENTS.length],
    }))

  const cardStyle = {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '16px',
    boxShadow: 'inset 0 1px rgba(255,255,255,0.035)',
  }

  const labelStyle = {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    marginBottom: '16px',
  }

  if (members.length === 0) {
    return (
      <div style={{ ...cardStyle, textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
        Add members to see charts
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
      {/* Bar chart */}
      <div style={cardStyle}>
        <div style={labelStyle}>Task Distribution</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} barGap={2} barCategoryGap="30%">
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'inherit' }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'inherit' }}
              axisLine={false}
              tickLine={false}
              width={24}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="Completed" radius={[3, 3, 0, 0]}>
              {barData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} fillOpacity={0.9} />
              ))}
            </Bar>
            <Bar dataKey="Pending" radius={[3, 3, 0, 0]}>
              {barData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} fillOpacity={0.3} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--success)', opacity: 0.9 }} />
            Completed
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
            Pending
          </div>
        </div>
      </div>

      {/* Pie chart */}
      <div style={cardStyle}>
        <div style={labelStyle}>Share of Work</div>
        {pieData.length === 0 ? (
          <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            No tasks yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)', paddingTop: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
