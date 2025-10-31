'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { formatAmount, getProgressPercentage, getProgressColor } from '@/lib/water-calculations'
import { Calendar, BarChart3, LogOut } from 'lucide-react'

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

interface WaterLog {
  id: string
  userId: string
  amount: number
  loggedAt: string
  createdAt: string
}

interface DashboardProps {
  userProfile: UserProfile
  onLogout: () => void
}

export default function Dashboard({ userProfile, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today')
  const [historicalData, setHistoricalData] = useState<{date: string, total: number, logs: WaterLog[]}[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  // Fetch historical data
  useEffect(() => {
    if (!user || activeTab !== 'history') return

    const fetchHistoricalData = async () => {
      setIsLoading(true)
      
      // Get last 7 days of data
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7)

      const response = await fetch(`/api/water-logs?userId=${user.id}`)
      
      if (!response.ok) {
        console.error('Error fetching historical data')
        return
      }

      const data = await response.json()

      // Group data by date
      const groupedData = data?.reduce((acc: Record<string, {date: string, total: number, logs: WaterLog[]}>, log: WaterLog) => {
        const date = new Date(log.loggedAt).toDateString()
        if (!acc[date]) {
          acc[date] = {
            date,
            total: 0,
            logs: [],
          }
        }
        acc[date].total += Number(log.amount)
        acc[date].logs.push(log)
        return acc
      }, {})

      setHistoricalData(Object.values(groupedData || {}))
      setIsLoading(false)
    }

    fetchHistoricalData()
  }, [user, activeTab])

  const progressPercentage = getProgressPercentage(
    historicalData.find(d => d.date === new Date().toDateString())?.total || 0,
    userProfile?.dailyGoal || 1
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Water Tracker</h1>
              <p className="text-gray-600">Welcome back, {userProfile?.name || 'User'}!</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === 'today'
                ? 'bg-[#C2E7FF] text-gray-800'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Today
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === 'history'
                ? 'bg-[#C2E7FF] text-gray-800'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            History
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        {activeTab === 'today' && (
          <div className="space-y-6">
            {/* Daily Goal Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Goal Progress</h2>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-3xl font-bold text-gray-800">
                    {formatAmount(historicalData.find(d => d.date === new Date().toDateString())?.total || 0)}
                  </p>
                  <p className="text-gray-600">of {formatAmount(userProfile?.dailyGoal || 0)} goal</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: getProgressColor(progressPercentage) }}>
                    {progressPercentage}%
                  </p>
                  <p className="text-sm text-gray-600">Complete</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(progressPercentage, 100)}%`,
                    backgroundColor: getProgressColor(progressPercentage),
                  }}
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="text-xl font-semibold text-gray-800">{userProfile?.weight}kg</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Activity Level</p>
                  <p className="text-xl font-semibold text-gray-800 capitalize">
                    {userProfile?.activityLevel?.replace('_', ' ')}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Weather</p>
                  <p className="text-xl font-semibold text-gray-800 capitalize">
                    {userProfile?.weatherCondition}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Last 7 Days</h2>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C2E7FF] mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading data...</p>
                </div>
              ) : historicalData.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No data available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {historicalData.map((day) => {
                    const dayProgress = getProgressPercentage(day.total, userProfile?.dailyGoal || 1)
                    const isToday = day.date === new Date().toDateString()
                    
                    return (
                      <div
                        key={day.date}
                        className={`p-4 rounded-lg border ${
                          isToday ? 'border-[#C2E7FF] bg-[#C2E7FF] bg-opacity-10' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="font-medium text-gray-800">
                              {isToday ? 'Today' : new Date(day.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              {day.logs.length} entries
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-800">
                              {formatAmount(day.total)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {dayProgress}% of goal
                            </p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(dayProgress, 100)}%`,
                              backgroundColor: getProgressColor(dayProgress),
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
