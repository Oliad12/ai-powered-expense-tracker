'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export interface CategoryBreakdown {
  name: string;
  total: number;
  color: string;
  percentage: number;
}

const DEFAULT_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

export async function getCategoryBreakdown(): Promise<CategoryBreakdown[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    const expenses = await db.expense.findMany({
      where: { userId, date: { gte: startOfMonth } },
      include: { category: true },
    });

    const map = new Map<string, { total: number; color: string }>();
    for (const e of expenses) {
      const name = e.category?.name ?? 'Other';
      const color = e.category?.color ?? DEFAULT_COLORS[map.size % DEFAULT_COLORS.length];
      const existing = map.get(name);
      map.set(name, { total: (existing?.total ?? 0) + e.amount, color: existing?.color ?? color });
    }

    const grandTotal = Array.from(map.values()).reduce((s, v) => s + v.total, 0);

    return Array.from(map.entries()).map(([name, { total, color }]) => ({
      name,
      total,
      color,
      percentage: grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0,
    })).sort((a, b) => b.total - a.total);
  } catch {
    return [];
  }
}
