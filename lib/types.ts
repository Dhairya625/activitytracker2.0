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
