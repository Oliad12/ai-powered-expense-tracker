'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function getCategories() {

  const { userId } = await auth()

  if (!userId) return []

  return db.category.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc'
    }
  })
}