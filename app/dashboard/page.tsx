import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import StatsCards from '@/components/StatsCards';
import RecordChart from '@/components/RecordChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import AIInsights from '@/components/AIInsights';
import RecordHistory from '@/components/RecordHistory';

function CardSkeleton() {
  return <div className='bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 animate-pulse h-28'/>;
}

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect('/');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
      {/* Page title */}
      <div>
        <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>
          {greeting}, {user.firstName} 👋
        </h1>
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
          Here&apos;s your financial overview for this month
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      }>
        <StatsCards />
      </Suspense>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
        <div className='lg:col-span-2'>
          <Suspense fallback={<div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse h-72'/>}>
            <RecordChart />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse h-72'/>}>
            <CategoryPieChart />
          </Suspense>
        </div>
      </div>

      {/* AI Insights */}
      <AIInsights />

      {/* Recent Transactions */}
      <Suspense fallback={<div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse h-48'/>}>
        <RecordHistory />
      </Suspense>
    </div>
  );
}
