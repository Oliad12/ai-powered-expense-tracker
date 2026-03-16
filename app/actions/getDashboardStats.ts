'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export interface DashboardStats {
  totalExpenses: number;
  lastMonthExpenses: number;
  expenseChange: number;       // % vs last month (+ means more spending)
  transactionCount: number;
  lastMonthCount: number;
  dailyAverage: number;
  highestExpense: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const empty: DashboardStats = {
    totalExpenses: 0, lastMonthExpenses: 0, expenseChange: 0,
    transactionCount: 0, lastMonthCount: 0, dailyAverage: 0, highestExpense: 0,
  };

  const { userId } = await auth();
  if (!userId) return empty;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  // Days elapsed in current month (at least 1)
  const daysElapsed = Math.max(now.getDate(), 1);

  try {
    const [thisMonth, lastMonth] = await Promise.all([
      db.expense.findMany({
        where: { userId, date: { gte: startOfMonth } },
        select: { amount: true },
      }),
      db.expense.findMany({
        where: { userId, date: { gte: startOfLastMonth, lte: endOfLastMonth } },
        select: { amount: true },
      }),
    ]);

    const totalExpenses = thisMonth.reduce((s, e) => s + e.amount, 0);
    const lastMonthExpenses = lastMonth.reduce((s, e) => s + e.amount, 0);
    const expenseChange = lastMonthExpenses > 0
      ? Math.round(((totalExpenses - lastMonthExpenses) / lastMonthExpenses) * 1000) / 10
      : 0;
    const highestExpense = thisMonth.length > 0 ? Math.max(...thisMonth.map((e) => e.amount)) : 0;

    return {
      totalExpenses,
      lastMonthExpenses,
      expenseChange,
      transactionCount: thisMonth.length,
      lastMonthCount: lastMonth.length,
      dailyAverage: totalExpenses / daysElapsed,
      highestExpense,
    };
  } catch {
    return empty;
  }
}
