import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AIInsights from '@/components/AIInsights';
import { getInsightHistory } from '@/app/actions/getAIInsights';

export default async function AIInsightsPage() {
  const user = await currentUser();
  if (!user) redirect('/');

  const history = await getInsightHistory();
  const lastGenerated = history.length > 0 ? new Date() : null;

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>AI Insights</h1>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
            Personalized financial recommendations — cached for 1 hour, refreshes automatically
          </p>
        </div>
        {lastGenerated && (
          <div className='hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800'>
            <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
            {history.length} insights saved
          </div>
        )}
      </div>

      {/* Live AI Insights (with DB cache) */}
      <AIInsights />

      {/* Saved insight count info */}
      {history.length > 0 && (
        <div className='bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm'>
          <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
            <svg className='w-4 h-4 text-emerald-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582 4 8 4m0 0c4.418 0 8-1.79 8-4' />
            </svg>
            <span>{history.length} insights stored in your database — insights are cached for 1 hour to save AI API calls. Click Refresh to force regenerate.</span>
          </div>
        </div>
      )}
    </div>
  );
}
