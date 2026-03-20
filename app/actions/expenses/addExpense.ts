'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sendBudgetWarningEmail, sendLargeExpenseEmail } from '@/lib/sendEmail';

interface RecordData {
  description?: string;
  amount: number;
  categoryId: string;
  date: string;
}
interface RecordResult {
  data?: RecordData;
  error?: string;
}

async function addExpense(formData: FormData): Promise<RecordResult> {
  const textValue = formData.get('text') ?? formData.get('description');
  const amountValue = formData.get('amount');
  const categoryValue = formData.get('category');
  const dateValue = formData.get('date');

  if (!textValue || !amountValue || !categoryValue || categoryValue === '' || !dateValue || dateValue === '') {
    return { error: 'description, amount, category, or date is missing' };
  }

  const description: string = textValue.toString();
  const amount: number = parseFloat(amountValue.toString());
  const categoryId: string = categoryValue.toString(); 
  let date: string;
  try {
    const inputDate = dateValue.toString();
    const [year, month, day] = inputDate.split('-');
    const dateObj = new Date(
      Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0)
    );
    date = dateObj.toISOString();
  } catch (error) {
    console.error('Invalid date format:', error); // Log the error
    return { error: 'Invalid date format' };
  }

  // Get logged in user
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Unauthorized user' };
  }
  

  try {
  
    const createdRecord = await db.expense.create({
      data: {
        description,
        amount,
        categoryId,
        date, 
        userId,
      },
    });

    const recordData: RecordData = {
      description: createdRecord.description ?? '',
      amount: createdRecord.amount,
      categoryId: createdRecord.categoryId,
      date: createdRecord.date?.toISOString() || date,
    };

    revalidatePath('/dashboard');

    // --- Email notifications (non-blocking) ---
    try {
      const user = await db.user.findUnique({ where: { clerkUserId: userId } });
      if (user?.email) {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const startOfMonth = new Date(year, now.getMonth(), 1);
        const endOfMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);

        // Check budgets
        const budgets = await db.budget.findMany({
          where: { userId, month, year },
          include: { category: true },
        });
        const monthExpenses = await db.expense.findMany({
          where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
          select: { amount: true, categoryId: true },
        });

        for (const budget of budgets) {
          const spent = budget.categoryId
            ? monthExpenses.filter((e) => e.categoryId === budget.categoryId).reduce((s, e) => s + e.amount, 0)
            : monthExpenses.reduce((s, e) => s + e.amount, 0);
          const pct = budget.limit > 0 ? Math.round((spent / budget.limit) * 100) : 0;

          if (pct >= 80) {
            await sendBudgetWarningEmail({
              to: user.email,
              name: user.name ?? 'there',
              budgetName: budget.name,
              pct,
              spent,
              limit: budget.limit,
            });
          }
        }

        // Check large expense (2× above monthly average)
        const category = await db.category.findUnique({ where: { id: categoryId } });
        if (monthExpenses.length > 1) {
          const avg = monthExpenses.reduce((s, e) => s + e.amount, 0) / monthExpenses.length;
          if (amount >= avg * 2 && amount >= 100) {
            await sendLargeExpenseEmail({
              to: user.email,
              name: user.name ?? 'there',
              amount,
              category: category?.name ?? 'Uncategorized',
              description,
            });
          }
        }
      }
    } catch (emailErr) {
      console.error('Email notification error:', emailErr);
    }

    return { data: recordData };
  } catch (error) {
    console.error('Create expense error:', error); 
    return {
      error: 'Failed to create expense.',
    };
  }
}

export default addExpense;
