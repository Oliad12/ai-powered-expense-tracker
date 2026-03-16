import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import AddNewRecord from '@/components/AddNewRecord';
import RecordHistory from '@/components/RecordHistory';

export default async function TransactionsPage() {
  const user = await currentUser();
  if (!user) redirect('/');

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
      <div>
        <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>Transactions</h1>
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>Manage and track all your expenses</p>
      </div>

      <div className='flex-2 gap-4 space-y-10'>
        <div>
          <AddNewRecord />
        </div>
        <div className='lg:col-span-2'>
          <Suspense fallback={<div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse h-64' />}>
            <RecordHistory />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
