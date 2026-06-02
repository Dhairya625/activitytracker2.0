import { supabase } from './supabase'
import type { Member } from './types'

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function getMemberForUser(userId: string): Promise<Member | null> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getUnclaimedMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .is('user_id', null)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function claimMember(memberId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('members')
    .update({ user_id: userId })
    .eq('id', memberId)
    .is('user_id', null)
  if (error) throw error
}

export async function createAndClaimMember(name: string, color: string, userId: string): Promise<Member> {
  const { data, error } = await supabase
    .from('members')
    .insert({ name, color, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function sendPasswordReset(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}

export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}
