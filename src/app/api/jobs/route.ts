import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { date: 'desc' },
      include: {
        _count: {
          select: { equipment: true }
        }
      }
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Failed to fetch jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, client, date } = body

    const job = await prisma.job.create({
      data: {
        title,
        client,
        date: new Date(date),
      },
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error('Failed to create job:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
} 