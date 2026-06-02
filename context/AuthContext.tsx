'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { getMemberForUser } from '@/lib/auth'
import type { Member } from '@/lib/types'

interface AuthContextValue {
  user: User | null
  member: Member | null
  loading: boolean
  refreshMember: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  member: null,
  loading: true,
  refreshMember: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshMember = useCallback(async () => {
    const { data } = await supabase.auth.getUser()
    if (data.user) {
      const m = await getMemberForUser(data.user.id)
      setMember(m)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) {
        getMemberForUser(u.id).then(m => {
          setMember(m)
          setLoading(false)
        }).catch(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        getMemberForUser(u.id).then(setMember).catch(() => setMember(null))
      } else {
        setMember(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, member, loading, refreshMember }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
