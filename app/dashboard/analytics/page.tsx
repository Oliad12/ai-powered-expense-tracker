import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import RecordChart from '@/components/RecordChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import ExpenseStats from '@/components/ExpenseStats';

export default async function AnalyticsPage() {
  const user = await currentUser();
  if (!user) redirect('/');

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
      <div>
        <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>Analytics</h1>
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>Deep dive into your spending patterns</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
        <div className='lg:col-span-2'>
          <Suspense fallback={<div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse h-72' />}>
            <RecordChart />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse h-72' />}>
            <CategoryPieChart />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse h-48' />}>
        <ExpenseStats />
      </Suspense>
    </div>
  );
}
