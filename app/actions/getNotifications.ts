'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export interface AppNotification {
  id: string;
  type: 'budget_exceeded' | 'budget_warning' | 'large_expense' | 'new_expense';
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export async function getNotifications(): Promise<AppNotification[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const startOfMonth = new Date(year, now.getMonth(), 1);
  const endOfMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);

  const [budgets, recentExpenses] = await Promise.all([
    db.budget.findMany({
      where: { userId, month, year },
      include: { category: true },
    }),
    db.expense.findMany({
      where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
      include: { category: true },
      orderBy: { date: 'desc' },
      take: 50,
    }),
  ]);

  const notifications: AppNotification[] = [];

  // Budget notifications
  for (const budget of budgets) {
    const spent = budget.categoryId
      ? recentExpenses.filter((e) => e.categoryId === budget.categoryId).reduce((s, e) => s + e.amount, 0)
      : recentExpenses.reduce((s, e) => s + e.amount, 0);

    const pct = budget.limit > 0 ? Math.round((spent / budget.limit) * 100) : 0;

    if (pct >= 100) {
      notifications.push({
        id: `budget-exceeded-${budget.id}`,
        type: 'budget_exceeded',
        title: 'Budget Exceeded',
        message: `"${budget.name}" is over limit (${pct}% used — ETB ${spent.toFixed(2)} / ${budget.limit.toFixed(2)})`,
        time: timeAgo(now),
        unread: true,
      });
    } else if (pct >= 80) {
      notifications.push({
        id: `budget-warning-${budget.id}`,
        type: 'budget_warning',
        title: 'Budget Warning',
        message: `"${budget.name}" is at ${pct}% — ETB ${(budget.limit - spent).toFixed(2)} remaining`,
        time: timeAgo(now),
        unread: true,
      });
    }
  }

  // Large expense notifications (top 3 this month above average)
  if (recentExpenses.length > 0) {
    const avg = recentExpenses.reduce((s, e) => s + e.amount, 0) / recentExpenses.length;
    const threshold = Math.max(avg * 2, 100);
    const large = recentExpenses.filter((e) => e.amount >= threshold).slice(0, 3);
    for (const exp of large) {
      notifications.push({
        id: `large-expense-${exp.id}`,
        type: 'large_expense',
        title: 'Large Expense',
        message: `ETB ${exp.amount.toFixed(2)} on ${exp.category?.name ?? 'Uncategorized'}${exp.description ? ` — ${exp.description}` : ''}`,
        time: timeAgo(exp.date),
        unread: false,
      });
    }
  }

  // 3 most recent expenses
  for (const exp of recentExpenses.slice(0, 3)) {
    notifications.push({
      id: `expense-${exp.id}`,
      type: 'new_expense',
      title: 'New Expense',
      message: `ETB ${exp.amount.toFixed(2)} — ${exp.category?.name ?? 'Uncategorized'}${exp.description ? `: ${exp.description}` : ''}`,
      time: timeAgo(exp.date),
      unread: false,
    });
  }

  return notifications;
}
