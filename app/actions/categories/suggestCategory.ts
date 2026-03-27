'use server';

import { categorizeExpense } from '@/lib/ai';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function suggestCategory(
  description: string
): Promise<{ category: string; error?: string }> {
  try {
    if (!description || description.trim().length < 2) {
      return { category: 'Other', error: 'Description too short for AI analysis' };
    }

    const { userId } = await auth();
    let userCategories: string[] = [];

    if (userId) {
      const cats = await db.category.findMany({
        where: { userId },
        select: { name: true },
        orderBy: { name: 'asc' },
      });
      userCategories = cats.map((c) => c.name);
    }

    const category = await categorizeExpense(description.trim(), userCategories);
    return { category };
  } catch (error) {
    console.error('❌ Error in suggestCategory server action:', error);
    return { category: 'Other', error: 'Unable to suggest category at this time' };
  }
}
