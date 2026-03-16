'use client';

import { useState, useMemo } from 'react';
import RecordItem from './RecordItem';
import { Expense } from '@/types/Expense';

interface Props {
  records: Expense[];
}

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'date-asc', label: 'Oldest first' },
  { value: 'amount-desc', label: 'Highest amount' },
  { value: 'amount-asc', label: 'Lowest amount' },
];

export default function RecordHistoryClient({ records }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Build unique category list from records
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    records.forEach((r) => {
      const name = r.category?.name ?? r.categoryId;
      map.set(r.categoryId, name);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [records]);

  const filtered = useMemo(() => {
    let result = [...records];

    // Search by description or category name
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.description?.toLowerCase().includes(q) ||
          (r.category?.name ?? '').toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((r) => r.categoryId === selectedCategory);
    }

    // Filter by date range
    if (dateFrom) {
      result = result.filter((r) => new Date(r.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      result = result.filter((r) => new Date(r.date) <= new Date(dateTo + 'T23:59:59'));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [records, search, selectedCategory, sortBy, dateFrom, dateTo]);

  const totalFiltered = filtered.reduce((s, r) => s + r.amount, 0);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSortBy('date-desc');
    setDateFrom('');
    setDateTo('');
  };

  const hasFilters = search || selectedCategory || dateFrom || dateTo || sortBy !== 'date-desc';

  return (
    <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50'>
      {/* Header */}
      <div className='flex items-center justify-between mb-5'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white text-lg'>📝</span>
          </div>
          <div>
            <h3 className='text-lg font-bold text-gray-900 dark:text-gray-100'>Expense History</h3>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {filtered.length} of {records.length} records
              {filtered.length > 0 && (
                <span className='ml-2 text-emerald-600 dark:text-emerald-400 font-medium'>
                  · ETB {totalFiltered.toFixed(2)}
                </span>
              )}
            </p>
          </div>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className='text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1'
          >
            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
            Clear filters
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className='relative mb-3'>
        <svg className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
        </svg>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search by description or category...'
          className='w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400'
        />
        {search && (
          <button onClick={() => setSearch('')} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5'>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className='px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30'
        >
          <option value=''>All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className='px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30'
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <input
          type='date'
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className='px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30'
          placeholder='From'
          title='From date'
        />

        <input
          type='date'
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className='px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30'
          placeholder='To'
          title='To date'
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className='text-center py-12'>
          <div className='w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4'>
            <span className='text-3xl'>🔍</span>
          </div>
          <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>No results found</p>
          <p className='text-xs text-gray-400 mt-1'>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'>
          {filtered.map((record) => (
            <RecordItem key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
}
