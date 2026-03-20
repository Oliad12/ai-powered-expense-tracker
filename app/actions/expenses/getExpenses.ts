'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { Prisma } from '@prisma/client'

type ExpenseWithCategory = Prisma.ExpenseGetPayload<{ include: { category: true } }>

interface GetExpensesResult {
  records?: ExpenseWithCategory[]
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