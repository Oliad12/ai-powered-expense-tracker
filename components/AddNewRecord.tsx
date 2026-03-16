'use client';
import { useRef, useState, useEffect } from 'react';
import addExpenseRecord from '@/app/actions/expenses/addExpense';
import { suggestCategory } from '@/app/actions/categories/suggestCategory';
import { getCategories } from '@/app/actions/categories/getCategories';

interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

const AddRecord = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [amount, setAmount] = useState(50);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [isCategorizingAI, setIsCategorizingAI] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then((cats) => setCategories(cats as Category[]));
  }, []);

  const clientAction = async (formData: FormData) => {
    setIsLoading(true);
    setAlertMessage(null);

    formData.set('amount', amount.toString());
    formData.set('category', categoryId);

    const { error } = await addExpenseRecord(formData);

    if (error) {
      setAlertMessage(`Error: ${error}`);
      setAlertType('error');
    } else {
      setAlertMessage('Expense added successfully!');
      setAlertType('success');
      formRef.current?.reset();
      setAmount(50);
      setCategoryId('');
      setDescription('');
    }

    setIsLoading(false);
  };

  const handleAISuggestCategory = async () => {
    if (!description.trim()) {
      setAlertMessage('Please enter a description first');
      setAlertType('error');
      return;
    }
    setIsCategorizingAI(true);
    setAlertMessage(null);
    try {
      const result = await suggestCategory(description);
      if (result.error) {
        setAlertMessage(`AI: ${result.error}`);
        setAlertType('error');
      } else {
        // Match suggested name to a real category id
        const match = categories.find(
          (c) => c.name.toLowerCase() === result.category.toLowerCase()
        );
        if (match) {
          setCategoryId(match.id);
          setAlertMessage(`AI suggested: ${match.name}`);
        } else {
          setAlertMessage(`AI suggested "${result.category}" — pick manually`);
        }
        setAlertType('success');
      }
    } catch {
      setAlertMessage('Failed to get AI suggestion');
      setAlertType('error');
    } finally {
      setIsCategorizingAI(false);
    }
  };

  return (
    <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-10 h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
          <span className='text-white text-lg'>💳</span>
        </div>
        <div>
          <h3 className='text-lg font-bold text-gray-900 dark:text-gray-100'>Add New Expense</h3>
          <p className='text-xs text-gray-500 dark:text-gray-400'>Track your spending with AI assistance</p>
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(formRef.current!);
          clientAction(formData);
        }}
        className='space-y-4'
      >
        {/* Description */}
        <div className='space-y-1.5'>
          <label className='flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300'>
            <span className='w-1.5 h-1.5 bg-emerald-500 rounded-full' />
            Description
          </label>
          <div className='relative'>
            <input
              type='text'
              name='text'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full pl-3 pr-12 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400'
              placeholder='Coffee, groceries, gas...'
              required
            />
            <button
              type='button'
              onClick={handleAISuggestCategory}
              disabled={isCategorizingAI || !description.trim()}
              className='absolute right-2 top-1/2 -translate-y-1/2 w-8 h-7 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:opacity-40 text-white rounded-lg text-xs flex items-center justify-center transition-all'
              title='AI suggest category'
            >
              {isCategorizingAI
                ? <div className='w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                : <span>✨</span>}
            </button>
          </div>
        </div>

        {/* Date */}
        <div className='space-y-1.5'>
          <label className='flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300'>
            <span className='w-1.5 h-1.5 bg-green-500 rounded-full' />
            Date
          </label>
          <input
            type='date'
            name='date'
            className='w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400'
            required
          />
        </div>

        {/* Category */}
        <div className='space-y-1.5'>
          <label className='flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300'>
            <span className='w-1.5 h-1.5 bg-teal-500 rounded-full' />
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className='w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400'
            required
          >
            <option value=''>Select category...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon ? `${c.icon} ` : ''}{c.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && (
            <p className='text-xs text-amber-600 dark:text-amber-400'>No categories yet — add one in Settings first.</p>
          )}
        </div>

        {/* Amount */}
        <div className='space-y-1.5'>
          <label className='flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300'>
            <span className='w-1.5 h-1.5 bg-violet-500 rounded-full' />
            Amount (ETB)
          </label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium'>ETB</span>
            <input
              type='number'
              name='amount'
              min='0'
              step='0.01'
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className='w-full pl-12 pr-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-gray-100 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400'
              required
            />
          </div>
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-60 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2'
        >
          {isLoading
            ? <><div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' /><span>Adding...</span></>
            : <><span>💫</span><span>Add Expense</span></>}
        </button>
      </form>

      {alertMessage && (
        <div className={`mt-4 p-3 rounded-xl border-l-4 text-sm font-medium ${
          alertType === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200'
            : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200'
        }`}>
          {alertType === 'success' ? '✅' : '⚠️'} {alertMessage}
        </div>
      )}
    </div>
  );
};

export default AddRecord;
