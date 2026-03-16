'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

interface DeleteResult {
  message?: string
  error?: string
}

export async function deleteExpense(
  expenseId: string
): Promise<DeleteResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: 'Unauthorized user' };
    }

    const expense = await db.expense.findUnique({
      where: { id: expenseId }
    });

    if (!expense || expense.userId !== userId) {
      return { error: 'Expense not found or access denied' };
    }

    await db.expense.delete({
      where: { id: expenseId }
    });

    revalidatePath('/dashboard');
    return { message: 'Expense deleted successfully' };
  } catch (error) {
    console.error('Delete expense error:', error);
    return { error: 'Database error while deleting expense' };
  }
}

export default deleteExpense;
