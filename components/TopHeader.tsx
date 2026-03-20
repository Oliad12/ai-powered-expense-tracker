'use client';

import { UserButton } from '@clerk/nextjs';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationBell from '@/components/NotificationBell';

export default function TopHeader({ userName }: { userName?: string | null; userImage?: string | null }) {

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
        <NotificationBell />

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
