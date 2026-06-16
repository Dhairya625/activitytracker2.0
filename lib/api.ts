import { supabase } from './supabase'
import { normalizeMemberColor, type Member, type Task } from './types'

export async function getMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function createMember(name: string, color: string): Promise<Member> {
  const { data, error } = await supabase
    .from('members')
    .insert({ name, color })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateMemberColor(id: string, color: string): Promise<void> {
  const { error } = await supabase.from('members').update({ color }).eq('id', id)
  if (error) throw error
}

export async function deleteMember(id: string): Promise<void> {
  const { error } = await supabase.from('members').delete().eq('id', id)
  if (error) throw error
}

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, member:members(*)')
    .order('task_date', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export type TaskInput = {
  title: string
  description?: string
  member_id: string
  category: string
  task_date: string
}

export type TaskUpdateInput = Omit<TaskInput, 'member_id'> & {
  completed: boolean
}

export async function createTask(task: TaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...task, completed: false })
    .select('*, member:members(*)')
    .single()
  if (error) throw error
  return data
}

export async function updateTask(id: string, task: TaskUpdateInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update(task)
    .eq('id', id)
    .select('*, member:members(*)')
    .single()
  if (error) throw error
  return data
}

export async function toggleTask(id: string, completed: boolean): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', id)
  if (error) throw error
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}

export function getMemberStats(members: Member[], tasks: Task[]) {
  return members.map((m) => {
    const memberTasks = tasks.filter((t) => t.member_id === m.id)
    const completed = memberTasks.filter((t) => t.completed).length
    const total = memberTasks.length
    return {
      ...m,
      color: normalizeMemberColor(m.color),
      total,
      completed,
      pending: total - completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }).sort((a, b) => b.total - a.total)
}
