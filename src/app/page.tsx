'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import RegisterForm from '@/components/RegisterForm'
import LoginForm from '@/components/LoginForm'
import ProfileSetupForm from '@/components/ProfileSetupForm'
import Dashboard from '@/components/Dashboard'
import WaterTracker from '@/components/WaterTracker'
import { Droplets } from 'lucide-react'

interface UserProfile {
  id: string
  userId: string
  name: string
  weight: number
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  weatherCondition: 'cool' | 'mild' | 'warm' | 'hot'
  dailyGoal: number
  createdAt: string
  updatedAt: string
}

type AuthState = 'login' | 'register' | 'profile-setup' | 'dashboard'

export default function Home() {
  const { user, loading } = useAuth()
  const [authState, setAuthState] = useState<AuthState>('login')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [showWaterTracker, setShowWaterTracker] = useState(false)

  // Check if user has completed profile setup
  useEffect(() => {
    if (!user) {
      setProfileLoading(false)
      return
    }

    const checkProfile = async () => {
      // Check if user has a profile
      if (user?.profile) {
        setUserProfile(user.profile)
      }
      setProfileLoading(false)
    }

    checkProfile()
  }, [user])

  const handleAuthSuccess = () => {
    if (authState === 'register') {
      setAuthState('profile-setup')
    } else {
      setAuthState('dashboard')
    }
  }

  const handleProfileComplete = () => {
    setAuthState('dashboard')
    // Refresh user data to get updated profile
    if (user) {
      fetchUser(user.id)
    }
  }

  const fetchUser = async (userId: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        const { user: updatedUser } = await response.json()
        if (updatedUser.profile) {
          setUserProfile(updatedUser.profile)
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  const handleLogout = () => {
    setAuthState('login')
    setUserProfile(null)
  }

  const refreshLogs = () => {
    // This will trigger a refresh in WaterTracker component
    if (userProfile) {
      setUserProfile({ ...userProfile })
    }
  }

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C2E7FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Droplets className="w-12 h-12 text-[#C2E7FF]" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Water Tracker</h1>
            <p className="text-gray-600">Stay hydrated, stay healthy</p>
          </div>

          {/* Auth Forms */}
          {authState === 'login' && (
            <LoginForm
              onSuccess={handleAuthSuccess}
              onSwitchToRegister={() => setAuthState('register')}
            />
          )}
          {authState === 'register' && (
            <RegisterForm
              onSuccess={handleAuthSuccess}
              onSwitchToLogin={() => setAuthState('login')}
            />
          )}
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ProfileSetupForm onComplete={handleProfileComplete} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard userProfile={userProfile} onLogout={handleLogout} />
      
      {/* Toggle Button */}
      <button
        onClick={() => setShowWaterTracker(!showWaterTracker)}
        className="fixed bottom-6 right-6 bg-[#C2E7FF] text-gray-800 p-4 rounded-full shadow-lg hover:bg-[#B8D9FF] transition-colors z-50"
        aria-label="Toggle water tracker"
      >
        <Droplets className="w-6 h-6" />
      </button>
      
      {/* Floating Water Tracker - Toggleable */}
      {showWaterTracker && (
        <div className="fixed bottom-20 right-6 w-80 z-40">
          <WaterTracker 
            userProfile={userProfile} 
            onLogAdded={refreshLogs} 
            onClose={() => setShowWaterTracker(false)}
          />
        </div>
      )}
    </div>
  )
}
