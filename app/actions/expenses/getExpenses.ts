'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { Expense } from '@prisma/client'

interface GetExpensesResult {
  records?: Expense[]
  error?: string
}

export async function getExpenses(): Promise<GetExpensesResult> {

  const { userId } = await auth()

  if (!userId) {
    return { error: 'Unauthorized user' }
  }

  try {

    const records = await db.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      include: { category: true },
    })

    return { records }

  } catch (error) {

    console.error('Error fetching expenses:', error)

    return { error: 'Database error' }
  }
}