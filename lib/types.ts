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
  '#00D4FF',
  '#7C3AED',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#8B5CF6',
  '#06B6D4',
] as const
