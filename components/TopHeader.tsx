'use client';

import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import ThemeToggle from '@/components/ThemeToggle';

export default function TopHeader({ userName }: { userName?: string | null; userImage?: string | null }) {
  const [notifications] = useState([
    { id: 1, text: 'Budget limit at 80%', time: '2m ago', unread: true },
    { id: 2, text: 'New AI insight available', time: '1h ago', unread: true },
    { id: 3, text: 'Monthly report ready', time: '3h ago', unread: false },
  ]);
  const [showNotif, setShowNotif] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className='sticky top-0 z-20 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm'>
      {/* Search */}
      <div className='flex-1 max-w-md'>
        <div className='relative'>
          <svg className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
          <input
            type='text'
            placeholder='Search transactions...'
            className='w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all'
          />
        </div>
      </div>

      {/* Right side */}
      <div className='flex items-center gap-2 sm:gap-3 ml-4'>
        <div className="hidden lg:block">
        <ThemeToggle />
        </div>

        {/* Notifications */}
        <div className='relative'>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className='relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
            aria-label='Notifications'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
            </svg>
            {unreadCount > 0 && (
              <span className='absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold'>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <>
              <div className='fixed inset-0 z-10' onClick={() => setShowNotif(false)} />
              <div className='absolute right-0 top-12 z-20 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden'>
                <div className='px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between'>
                  <span className='text-sm font-semibold text-gray-900 dark:text-gray-100'>Notifications</span>
                  <span className='text-xs text-emerald-600 dark:text-emerald-400 font-medium cursor-pointer'>Mark all read</span>
                </div>
                {notifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${n.unread ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm text-gray-800 dark:text-gray-200'>{n.text}</p>
                      <p className='text-xs text-gray-400 mt-0.5'>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* User profile */}
        <div className='flex hidden lg:block items-center gap-2'>
          <div className='hidden block text-right'>
            <p className='text-sm font-semibold text-gray-800 dark:text-gray-200 leading-none'>{userName ?? 'User'}</p>
            <p className='text-xs text-gray-400 mt-0.5'>Personal</p>
          </div>
          <UserButton afterSignOutUrl='/' />
        </div>
      </div>
    </header>
  );
}
