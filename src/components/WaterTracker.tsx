'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { waterLogSchema, type WaterLogFormData } from '@/lib/validations'
import { formatAmount, getProgressPercentage, getProgressColor } from '@/lib/water-calculations'
import { useAuth } from '@/contexts/AuthContext'
import { Droplets, Plus, TrendingUp } from 'lucide-react'

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

interface WaterTrackerProps {
  userProfile: UserProfile
  onLogAdded: () => void
  onClose?: () => void
}

export default function WaterTracker({ userProfile, onLogAdded }: WaterTrackerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [todayLogs, setTodayLogs] = useState<WaterLog[]>([])
  const [todayTotal, setTodayTotal] = useState(0)
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaterLogFormData>({
    resolver: zodResolver(waterLogSchema),
  })

  // Fetch today's water logs
  useEffect(() => {
    if (!user) return

    const fetchTodayLogs = async () => {
      const today = new Date().toISOString().split('T')[0]
      
      const response = await fetch(`/api/water-logs?userId=${user.id}&date=${today}`)
      
      if (!response.ok) {
        console.error('Error fetching logs')
        return
      }

      const data = await response.json()
      setTodayLogs(data)
      const total = data?.reduce((sum: number, log: WaterLog) => sum + Number(log.amount), 0) || 0
      setTodayTotal(total)
    }

    fetchTodayLogs()
  }, [user, onLogAdded])

  const onSubmit = async (data: WaterLogFormData) => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/water-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: data.amount,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to add water log')
        return
      }

      reset()
      onLogAdded()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const quickAddAmounts = [100, 200, 250, 500]

  const progressPercentage = getProgressPercentage(todayTotal, userProfile?.dailyGoal || 1)
  const progressColor = getProgressColor(progressPercentage)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Today&apos;s Water Intake</h2>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Droplets className="w-5 h-5" />
          <span>{formatAmount(todayTotal)} / {formatAmount(userProfile?.dailyGoal || 0)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(progressPercentage, 100)}%`,
              backgroundColor: progressColor,
            }}
          />
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Quick Add:</p>
        <div className="grid grid-cols-2 gap-2">
          {quickAddAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => {
                reset({ amount })
                handleSubmit(onSubmit)()
              }}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-[#C2E7FF] text-gray-800 rounded-lg hover:bg-[#B8D9FF] transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {formatAmount(amount)}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Entry Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Add Water (ml)
          </label>
          <input
            {...register('amount', { valueAsNumber: true })}
            type="number"
            id="amount"
            min="1"
            max="1000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2E7FF] focus:border-transparent transition-colors"
            placeholder="Enter amount in ml"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#C2E7FF] text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-[#B8D9FF] focus:ring-2 focus:ring-[#C2E7FF] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add Water'}
        </button>
      </form>

      {/* Today's Logs */}
      {todayLogs.length > 0 && (
        <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Today&apos;s Entries
            </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {todayLogs.map((log) => (
              <div
                key={log.id}
                className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-600">
                  {new Date(log.loggedAt).toLocaleTimeString()}
                </span>
                <span className="font-medium text-gray-800">
                  {formatAmount(log.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
