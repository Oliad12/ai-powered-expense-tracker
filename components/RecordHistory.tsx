import { getExpenses } from '@/app/actions/expenses/getExpenses';
import RecordHistoryClient from '@/components/RecordHistoryClient';

const RecordHistory = async () => {
  const { records, error } = await getExpenses();

  if (error) {
    return (
      <div className='bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50'>
        <div className='bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-xl'>
          <p className='text-red-700 dark:text-red-400 text-sm font-medium'>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return <RecordHistoryClient records={records ?? []} />;
};

export default RecordHistory;
