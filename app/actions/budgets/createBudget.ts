'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { checkUser } from '@/lib/checkUser';

export async function createBudget(formData: FormData): Promise<{ message?: string; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  await checkUser();

  const name = formData.get('name')?.toString().trim();
  const limit = parseFloat(formData.get('limit')?.toString() ?? '0');
  const categoryId = formData.get('categoryId')?.toString() || null;

  if (!name) return { error: 'Budget name is required' };
  if (!limit || limit <= 0) return { error: 'Invalid budget limit' };

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  try {
    const existing = await db.budget.findFirst({
      where: {
        userId,
        month,
        year,
        categoryId: categoryId ?? null,
      },
    });

    if (existing) {
      await db.budget.update({
        where: { id: existing.id },
        data: { name, limit },
      });
    } else {
      await db.budget.create({
        data: { userId, name, limit, month, year, categoryId: categoryId ?? null },
      });
    }

    revalidatePath('/dashboard/budgets');
    return { message: 'Budget saved' };
  } catch (e) {
    console.error('createBudget error:', e);
    return { error: 'Failed to save budget' };
  }
}

export async function deleteBudget(id: string): Promise<{ message?: string; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  try {
    await db.budget.delete({ where: { id, userId } });
    revalidatePath('/dashboard/budgets');
    return { message: 'Budget deleted' };
  } catch (e) {
    console.error('deleteBudget error:', e);
    return { error: 'Failed to delete budget' };
  }
}
