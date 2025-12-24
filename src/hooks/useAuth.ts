'use client'

import { useEffect, useState } from 'react'
import { User, Coins } from 'lucide-react'

interface UserProfile {
  uid: string
  email: string
  role: 'user' | 'admin'
  coins: number
  isVip: boolean
}

interface AuthState {
  user: UserProfile | null
  userProfile: UserProfile | null
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userProfile: null,
    loading: false,
  })

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }))

    try {
      // In production, call Firebase auth here
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (result.success) {
        const userProfile: UserProfile = {
          uid: result.uid,
          email: result.email,
          role: 'user',
          coins: 0,
          isVip: false,
        }

        setAuthState({
          user: { uid: result.uid, email: result.email },
          userProfile,
          loading: false,
        })

        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(userProfile))
      } else {
        setAuthState(prev => ({ ...prev, loading: false }))
        alert(result.message || 'Login gagal')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const signUp = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }))

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (result.success) {
        const userProfile: UserProfile = {
          uid: result.uid,
          email: result.email,
          role: 'user',
          coins: 0,
          isVip: false,
        }

        setAuthState({
          user: { uid: result.uid, email: result.email },
          userProfile,
          loading: false,
        })

        localStorage.setItem('user', JSON.stringify(userProfile))
      } else {
        setAuthState(prev => ({ ...prev, loading: false }))
        alert(result.message || 'Register gagal')
      }
    } catch (error) {
      console.error('Sign up error:', error)
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }))

    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const result = await response.json()

      if (result.success) {
        setAuthState({
          user: null,
          userProfile: null,
          loading: false,
        })

        localStorage.removeItem('user')
        alert(result.message || 'Logout berhasil')
      } else {
        setAuthState(prev => ({ ...prev, loading: false }))
        alert(result.message || 'Logout gagal')
      }
    } catch (error) {
      console.error('Sign out error:', error)
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const userProfile: UserProfile = JSON.parse(storedUser)
        setAuthState({
          user: { uid: userProfile.uid, email: userProfile.email },
          userProfile,
          loading: false,
        })
      } catch (error) {
        console.error('Error parsing user from localStorage:', error)
      }
    }
  }, [])

  return {
    user: authState.user,
    userProfile: authState.userProfile,
    loading: authState.loading,
    signIn,
    signUp,
    signOut,
  }
}
