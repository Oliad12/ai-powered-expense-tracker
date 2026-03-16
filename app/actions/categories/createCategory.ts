'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

interface Result {
  message?: string
  error?: string
}

export async function createCategory(formData: FormData): Promise<Result> {

  const name = formData.get('name')?.toString()
  const color = formData.get('color')?.toString()
  const icon = formData.get('icon')?.toString()

  const { userId } = await auth()

  if (!userId) {
    return { error: 'Unauthorized user' }
  }

  if (!name) {
    return { error: 'Category name required' }
  }

  try {

    await db.category.create({
      data: {
        name,
        color,
        icon,
        userId
      }
    })

    revalidatePath('/dashboard')

    return { message: 'Category created' }

  } catch (error) {

    console.error('Create category error:', error)

    return { error: 'Failed to create category' }
  }
}