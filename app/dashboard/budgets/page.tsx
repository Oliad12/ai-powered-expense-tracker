import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getBudgets } from '@/app/actions/budgets/getBudgets';
import { createBudget, deleteBudget } from '@/app/actions/budgets/createBudget';
import { getCategories } from '@/app/actions/categories/getCategories';

async function saveBudget(formData: FormData): Promise<void> {
  'use server';
  await createBudget(formData);
  redirect('/dashboard/budgets');
}

async function removeBudget(formData: FormData): Promise<void> {
  'use server';
  await deleteBudget(formData.get('id') as string);
  redirect('/dashboard/budgets');
}

export default async function BudgetsPage() {
  const user = await currentUser();
  if (!user) redirect('/');

  const [budgets, categories] = await Promise.all([getBudgets(), getCategories()]);

  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = Math.max(totalLimit - totalSpent, 0);
  const overallPct = totalLimit > 0 ? Math.min(Math.round((totalSpent / totalLimit) * 100), 100) : 0;
  const overBudget = budgets.filter((b) => b.percentage >= 100).length;
  const nearLimit = budgets.filter((b) => b.percentage >= 70 && b.percentage < 100).length;

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto'>

      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Budgets</h1>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>{monthName}</p>
        </div>
        <div className='flex items-center gap-2'>
          {overBudget > 0 && (
            <span className='text-xs font-medium px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full border border-red-100 dark:border-red-800'>
              {overBudget} over limit
            </span>
          )}
          {nearLimit > 0 && (
            <span className='text-xs font-medium px-2.5 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full border border-yellow-100 dark:border-yellow-800'>
              {nearLimit} near limit
            </span>
          )}
        </div>
      </div>

      {/* Summary cards */}
      {budgets.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div className='bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm'>
            <p className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>Total Budgeted</p>
            <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Total Spent</p>
            <p className='text-xl font-bold text-red-600 dark:text-red-400'>ETB {totalSpent.toFixed(2)}</p>
          </div>
          <div className='bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm'>
            <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Remaining</p>
            <p className='text-xl font-bold text-emerald-600 dark:text-emerald-400'>
              ETB {totalRemaining.toFixed(2)}
            </p>
          </div>
          <div className='bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm'>
            <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Overall Usage</p>
            <p className='text-xl font-bold text-gray-900 dark:text-gray-100'>{overallPct}%</p>
            <div className='w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-2'>
              <div
                className={`h-full rounded-full ${overallPct >= 100 ? 'bg-red-500' : overallPct >= 70 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className='flex flex-col gap-4 sm:gap-6'>
        {/* Create Budget Form */}
        <div className='bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm h-fit'>
          <div className='flex items-center gap-3 mb-5'>
            <div className='w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center'>
              <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
            </div>
            <div>
              <h3 className='text-base font-bold text-gray-900 dark:text-gray-100'>New Budget</h3>
              <p className='text-xs text-gray-500 dark:text-gray-400'>{monthName}</p>
            </div>
          </div>

          <form action={saveBudget} className='space-y-3'>
            {/* Name */}
            <div>
              <label className='text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5'>
                Budget Name
              </label>
              <input
                type='text'
                name='name'
                placeholder='e.g. Monthly Overall, Food Budget...'
                required
                className='w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400'
              />
            </div>

            {/* Category (optional) */}
            <div>
              <label className='text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5'>
                Category <span className='font-normal text-gray-400'>(optional)</span>
              </label>
              <select
                name='categoryId'
                className='w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400'
              >
                <option value=''>All categories (overall)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Limit */}
            <div>
              <label className='text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5'>
                Limit (ETB)
              </label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm'>ETB</span>
                <input
                  type='number'
                  name='limit'
                  min='1'
                  step='0.01'
                  placeholder='0.00'
                  required
                  className='w-full pl-12 pr-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400'
                />
              </div>
            </div>

            <button
              type='submit'
              className='w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all mt-1'
            >
              Save Budget
            </button>
          </form>
        </div>

        {/* Budget Cards */}
        <div className='lg:col-span-2 space-y-3'>
          {budgets.length === 0 ? (
            <div className='bg-white dark:bg-gray-900 rounded-2xl p-10 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center text-gray-400'>
              <svg className='w-12 h-12 mb-3 opacity-30' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <p className='text-sm font-medium'>No budgets for {monthName}</p>
              <p className='text-xs mt-1'>Create one using the form</p>
            </div>
          ) : (
            budgets.map((b) => {
              const statusColor =
                b.percentage >= 100 ? 'bg-red-500' :
                b.percentage >= 70  ? 'bg-yellow-500' :
                                      'bg-emerald-500';
              const statusText =
                b.percentage >= 100 ? 'text-red-600 dark:text-red-400' :
                b.percentage >= 70  ? 'text-yellow-600 dark:text-yellow-400' :
                                      'text-emerald-600 dark:text-emerald-400';
              const statusBg =
                b.percentage >= 100 ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800' :
                b.percentage >= 70  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800' :
                                      'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800';

              return (
                <div key={b.id} className='bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800 shadow-sm'>
                  <div className='flex items-start justify-between mb-3'>
                    <div className='flex items-center gap-2.5'>
                      {b.categoryColor && (
                        <div className='w-3 h-3 rounded-full flex-shrink-0' style={{ backgroundColor: b.categoryColor }} />
                      )}
                      <div>
                        <p className='text-sm font-semibold text-gray-900 dark:text-gray-100'>{b.name}</p>
                        {b.categoryName && (
                          <p className='text-xs text-gray-400 mt-0.5'>{b.categoryName}</p>
                        )}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusBg} ${statusText}`}>
                        {b.percentage}%
                      </span>
                      <form action={removeBudget}>
                        <input type='hidden' name='id' value={b.id} />
                        <button
                          type='submit'
                          className='p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
                          title='Delete budget'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                          </svg>
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className='w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-2'>
                    <div
                      className={`h-full rounded-full ${statusColor}`}
                      style={{ width: `${Math.max(b.percentage, b.spent > 0 ? 2 : 0)}%` }}
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-xs text-gray-500 dark:text-gray-400'>
                      <span className='font-semibold text-gray-700 dark:text-gray-300'>ETB {b.spent.toFixed(2)}</span> spent
                    </span>
                    <span className='text-xs text-gray-500 dark:text-gray-400'>
                      <span className={`font-semibold ${statusText}`}>ETB {b.remaining.toFixed(2)}</span> left of ETB {b.limit.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
