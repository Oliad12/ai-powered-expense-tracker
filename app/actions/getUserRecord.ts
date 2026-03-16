'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

interface UserExpenseSummary {
  totalAmount?: number;
  daysWithRecords?: number;
  error?: string;
}

export async function getUserExpenseSummary(): Promise<UserExpenseSummary> {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    // Fetch all expenses for the user
    const expenses = await db.expense.findMany({
      where: { userId },
      select: {
        amount: true,
        date: true
      }
    });

    // Total spent
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Count unique days with expenses
    const uniqueDays = new Set(
      expenses.map(e => e.date.toISOString().split('T')[0])
    );

    return {
      totalAmount,
      daysWithRecords: uniqueDays.size
    };

  } catch (error) {
    console.error('Error fetching user expenses:', error);
    return { error: 'Database error' };
  }
}

export default getUserExpenseSummary;