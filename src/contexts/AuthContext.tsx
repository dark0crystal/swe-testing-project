'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  username: string
  email: string
  createdAt: string
  profile?: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (name: string, username: string, email: string, password: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const userId = localStorage.getItem('userId')
    if (userId) {
      fetchUser(userId)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async (userId: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        const { user } = await response.json()
        setUser(user)
      } else {
        localStorage.removeItem('userId')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      localStorage.removeItem('userId')
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (name: string, username: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store user ID in localStorage
        localStorage.setItem('userId', data.user.id)
        setUser(data.user)
        return { error: null }
      } else {
        return { error: data.error || 'Registration failed' }
      }
    } catch (error) {
      return { error: 'Network error' }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store user ID in localStorage
        localStorage.setItem('userId', data.user.id)
        setUser(data.user)
        return { error: null }
      } else {
        return { error: data.error || 'Login failed' }
      }
    } catch (error) {
      return { error: 'Network error' }
    }
  }

  const signOut = () => {
    localStorage.removeItem('userId')
    setUser(null)
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}