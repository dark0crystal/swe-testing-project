import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        user: true
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, weight, activityLevel, weatherCondition, dailyGoal } = await request.json()

    const profile = await prisma.userProfile.create({
      data: {
        userId,
        weight: parseFloat(weight),
        activityLevel,
        weatherCondition,
        dailyGoal: parseFloat(dailyGoal),
      },
      include: {
        user: true
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error creating profile:', error)
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
  }
}
