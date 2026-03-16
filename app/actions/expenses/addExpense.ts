'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

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

    return { data: recordData };
  } catch (error) {
    console.error('Create expense error:', error); 
    return {
      error: 'Failed to create expense.',
    };
  }
}

export default addExpense;
