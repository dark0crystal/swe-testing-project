export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
export type WeatherCondition = 'cool' | 'mild' | 'warm' | 'hot'

export function calculateDailyWaterGoal(
  weight: number,
  activityLevel: ActivityLevel,
  weatherCondition: WeatherCondition
): number {
  // Base calculation: 35ml per kg of body weight
  const baseAmount = weight * 35

  // Activity level multipliers
  const activityMultipliers = {
    sedentary: 1.0,
    light: 1.1,
    moderate: 1.2,
    active: 1.3,
    very_active: 1.4,
  }

  // Weather condition adjustments
  const weatherAdjustments = {
    cool: 0,
    mild: 200,
    warm: 400,
    hot: 600,
  }

  // Calculate final amount
  const activityAdjusted = baseAmount * activityMultipliers[activityLevel]
  const finalAmount = activityAdjusted + weatherAdjustments[weatherCondition]

  // Round to nearest 50ml for practical purposes
  return Math.round(finalAmount / 50) * 50
}

export function formatAmount(amount: number): string {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}L`
  }
  return `${amount}ml`
}

export function getProgressPercentage(current: number, goal: number): number {
  return Math.min(Math.round((current / goal) * 100), 100)
}

export function getProgressColor(percentage: number): string {
  if (percentage < 50) return '#ef4444' // red
  if (percentage < 75) return '#f59e0b' // amber
  if (percentage < 90) return '#10b981' // emerald
  return '#059669' // green
}
