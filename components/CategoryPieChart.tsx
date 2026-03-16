import { getCategoryBreakdown } from '@/app/actions/getCategoryBreakdown';
import PieChartClient from './PieChartClient';

export default async function CategoryPieChart() {
  const data = await getCategoryBreakdown();

  return (
    <div className='bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-gray-800 shadow-sm'>
      <div className='flex items-center gap-3 mb-5'>
        <div className='w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-sm'>
          <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' />
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' />
          </svg>
        </div>
        <div>
          <h3 className='text-base font-bold text-gray-900 dark:text-gray-100'>Category Breakdown</h3>
          <p className='text-xs text-gray-500 dark:text-gray-400'>This month</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-10 text-gray-400'>
          <svg className='w-12 h-12 mb-3 opacity-30' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' />
          </svg>
          <p className='text-sm'>No data this month</p>
        </div>
      ) : (
        <PieChartClient data={data} />
      )}
    </div>
  );
}
