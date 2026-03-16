import { getDashboardStats } from '@/app/actions/getDashboardStats';

const cards = [
  {
    key: 'totalExpenses' as const,
    label: 'Total Expenses',
    icon: (
      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 13l-5 5m0 0l-5-5m5 5V6' />
      </svg>
    ),
    gradient: 'from-red-500 to-rose-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    format: (v: number) => `ETB ${v.toFixed(2)}`,
  },
  {
    key: 'dailyAverage' as const,
    label: 'Daily Average',
    icon: (
      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
      </svg>
    ),
    gradient: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    format: (v: number) => `ETB ${v.toFixed(2)}`,
  },
  {
    key: 'highestExpense' as const,
    label: 'Highest Expense',
    icon: (
      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' />
      </svg>
    ),
    gradient: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-600 dark:text-orange-400',
    format: (v: number) => `ETB ${v.toFixed(2)}`,
  },
  {
    key: 'transactionCount' as const,
    label: 'Transactions',
    icon: (
      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
      </svg>
    ),
    gradient: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    text: 'text-violet-600 dark:text-violet-400',
    format: (v: number) => `${v}`,
  },
];

export default async function StatsCards() {
  const stats = await getDashboardStats();

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
      {cards.map((card) => {
        const value = stats[card.key];
        return (
          <div key={card.key} className='bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow'>
            <div className='flex items-center justify-between mb-3'>
              <div className={`w-9 h-9 rounded-xl ${card.bg} ${card.text} flex items-center justify-center`}>
                {card.icon}
              </div>
              {card.key === 'totalExpenses' && stats.expenseChange !== 0 && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stats.expenseChange > 0 ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'}`}>
                  {stats.expenseChange > 0 ? '+' : ''}{stats.expenseChange}%
                </span>
              )}
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-400 font-medium mb-1'>{card.label}</p>
            <p className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>
              {card.format(value)}
            </p>
            <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>This month</p>
          </div>
        );
      })}
    </div>
  );
}
