export interface Member {
  id: string
  name: string
  color: string
  created_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  member_id: string
  category: string
  completed: boolean
  task_date: string
  created_at: string
  member?: Member
}

export const CATEGORIES = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Operations',
  'Research',
  'Other',
] as const

export type Category = typeof CATEGORIES[number]

export const MEMBER_COLORS = [
  '#9CA3AF',
  '#A8A29E',
  '#87A987',
  '#B9A36A',
  '#A78B7A',
  '#8FA3A6',
  '#9B8EA5',
  '#B08C7A',
] as const

const LEGACY_MEMBER_COLOR_MAP: Record<string, typeof MEMBER_COLORS[number]> = {
  '#00D4FF': '#8FA3A6',
  '#7C3AED': '#9B8EA5',
  '#10B981': '#87A987',
  '#F59E0B': '#B9A36A',
  '#EF4444': '#B08C7A',
  '#EC4899': '#A78B7A',
  '#8B5CF6': '#9B8EA5',
  '#06B6D4': '#8FA3A6',
}

export function normalizeMemberColor(color: string | null | undefined) {
  if (!color) return MEMBER_COLORS[0]
  return LEGACY_MEMBER_COLOR_MAP[color.toUpperCase()] ?? color
}
