'use client';

import { useState, useEffect } from 'react';
import { getNotifications, AppNotification } from '@/app/actions/getNotifications';

const iconMap = {
  budget_exceeded: { bg: 'bg-red-100 dark:bg-red-900/30', text: '🚨' },
  budget_warning:  { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: '⚠️' },
  large_expense:   { bg: 'bg-orange-100 dark:bg-orange-900/30', text: '💸' },
  new_expense:     { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: '📝' },
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then(setNotifications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggle = () => setOpen((v) => !v);
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  const dismiss = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className='relative'>
      <button
        onClick={toggle}
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

      {open && (
        <>
          <div className='fixed inset-0 z-10' onClick={() => setOpen(false)} />
          <div className='absolute right-0 top-12 z-20 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden'>
            <div className='px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between'>
              <span className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                Notifications
                {unreadCount > 0 && (
                  <span className='ml-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full'>
                    {unreadCount} new
                  </span>
                )}
              </span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className='text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline'>
                  Mark all read
                </button>
              )}
            </div>

            <div className='max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700'>
              {loading && (
                <div className='flex items-center justify-center py-8 text-gray-400 text-sm gap-2'>
                  <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                  </svg>
                  Loading...
                </div>
              )}

              {!loading && notifications.length === 0 && (
                <div className='flex flex-col items-center justify-center py-10 text-gray-400'>
                  <svg className='w-10 h-10 mb-2 opacity-30' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
                  </svg>
                  <p className='text-sm'>No notifications</p>
                </div>
              )}

              {!loading && notifications.map((n) => {
                const icon = iconMap[n.type];
                return (
                  <div
                    key={n.id}
                    className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${n.unread ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm ${icon.bg}`}>
                      {icon.text}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-xs font-semibold text-gray-700 dark:text-gray-300'>{n.title}</p>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed'>{n.message}</p>
                      <p className='text-xs text-gray-400 mt-1'>{n.time}</p>
                    </div>
                    <div className='flex flex-col items-center gap-1.5 flex-shrink-0'>
                      {n.unread && <span className='w-2 h-2 rounded-full bg-emerald-500' />}
                      <button
                        onClick={() => dismiss(n.id)}
                        className='text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 transition-colors'
                        aria-label='Dismiss'
                      >
                        <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
