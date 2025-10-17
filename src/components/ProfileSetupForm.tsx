'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormData } from '@/lib/validations'
import { calculateDailyWaterGoal } from '@/lib/water-calculations'
import { useAuth } from '@/contexts/AuthContext'

interface ProfileSetupFormProps {
  onComplete: () => void
}

export default function ProfileSetupForm({ onComplete }: ProfileSetupFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [calculatedGoal, setCalculatedGoal] = useState<number | null>(null)
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  const watchedValues = watch()

  // Calculate goal when form values change
  React.useEffect(() => {
    if (watchedValues.weight && watchedValues.activityLevel && watchedValues.weatherCondition) {
      const goal = calculateDailyWaterGoal(
        watchedValues.weight,
        watchedValues.activityLevel,
        watchedValues.weatherCondition
      )
      setCalculatedGoal(goal)
    }
  }, [watchedValues])

  const onSubmit = async (data: ProfileFormData) => {
    if (!user || !calculatedGoal) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          weight: data.weight,
          activityLevel: data.activityLevel,
          weatherCondition: data.weatherCondition,
          dailyGoal: calculatedGoal,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create profile')
        return
      }

      onComplete()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Setup Your Profile</h2>
        <p className="text-gray-600">Help us calculate your daily water goal</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
            Weight (kg)
          </label>
          <input
            {...register('weight', { valueAsNumber: true })}
            type="number"
            id="weight"
            step="0.1"
            min="30"
            max="300"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2E7FF] focus:border-transparent transition-colors text-black"
            placeholder="Enter your weight"
          />
          {errors.weight && (
            <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-2">
            Activity Level
          </label>
          <select
            {...register('activityLevel')}
            id="activityLevel"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2E7FF] focus:border-transparent transition-colors text-black"
          >
            <option value="">Select your activity level</option>
            <option value="sedentary">Sedentary (little to no exercise)</option>
            <option value="light">Light (light exercise 1-3 days/week)</option>
            <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
            <option value="active">Active (heavy exercise 6-7 days/week)</option>
            <option value="very_active">Very Active (very heavy exercise, physical job)</option>
          </select>
          {errors.activityLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.activityLevel.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="weatherCondition" className="block text-sm font-medium text-gray-700 mb-2">
            Weather Condition
          </label>
          <select
            {...register('weatherCondition')}
            id="weatherCondition"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2E7FF] focus:border-transparent transition-colors text-black"
          >
            <option value="">Select current weather</option>
            <option value="cool">Cool (below 20°C)</option>
            <option value="mild">Mild (20-25°C)</option>
            <option value="warm">Warm (25-30°C)</option>
            <option value="hot">Hot (above 30°C)</option>
          </select>
          {errors.weatherCondition && (
            <p className="mt-1 text-sm text-red-600">{errors.weatherCondition.message}</p>
          )}
        </div>

        {calculatedGoal && (
          <div className="bg-[#C2E7FF] bg-opacity-20 border border-[#C2E7FF] rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Your Daily Water Goal</h3>
            <p className="text-2xl font-bold text-gray-800">{calculatedGoal}ml</p>
            <p className="text-sm text-gray-600 mt-1">
              Based on your weight, activity level, and weather conditions
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !calculatedGoal}
          className="w-full bg-[#C2E7FF] text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-[#B8D9FF] focus:ring-2 focus:ring-[#C2E7FF] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Setting up...' : 'Complete Setup'}
        </button>
      </form>
    </div>
  )
}
