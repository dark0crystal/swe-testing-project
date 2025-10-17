import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const date = searchParams.get('date')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const whereClause: { userId: string; loggedAt?: { gte: Date; lt: Date } } = { userId }

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      
      whereClause.loggedAt = {
        gte: startDate,
        lt: endDate
      }
    }

    const logs = await prisma.waterLog.findMany({
      where: whereClause,
      orderBy: { loggedAt: 'desc' }
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching water logs:', error)
    return NextResponse.json({ error: 'Failed to fetch water logs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, amount } = await request.json()

    const log = await prisma.waterLog.create({
      data: {
        userId,
        amount: parseFloat(amount),
      }
    })

    return NextResponse.json(log)
  } catch (error) {
    console.error('Error creating water log:', error)
    return NextResponse.json({ error: 'Failed to create water log' }, { status: 500 })
  }
}
