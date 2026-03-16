'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export interface BudgetWithSpent {
  id: string;
  name: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  month: number;
  year: number;
  categoryId: string | null;
  categoryName: string | null;
  categoryColor: string | null;
}

export async function getBudgets(): Promise<BudgetWithSpent[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const startOfMonth = new Date(year, now.getMonth(), 1);
  const endOfMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);

  try {
    const budgets = await db.budget.findMany({
      where: { userId, month, year },
      include: { category: true },
      orderBy: { createdAt: 'asc' },
    });

    const expenses = await db.expense.findMany({
      where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
      select: { amount: true, categoryId: true },
    });

    return budgets.map((b) => {
      const spent = b.categoryId
        ? expenses.filter((e) => e.categoryId === b.categoryId).reduce((s, e) => s + e.amount, 0)
        : expenses.reduce((s, e) => s + e.amount, 0);

      const percentage = b.limit > 0 ? Math.min(Math.round((spent / b.limit) * 100), 100) : 0;

      return {
        id: b.id,
        name: b.name,
        limit: b.limit,
        spent,
        remaining: Math.max(b.limit - spent, 0),
        percentage,
        month: b.month,
        year: b.year,
        categoryId: b.categoryId ?? null,
        categoryName: b.category?.name ?? null,
        categoryColor: b.category?.color ?? null,
      };
    });
  } catch (e) {
    console.error('getBudgets error:', e);
    return [];
  }
}
