import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Image from "next/image";


export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect('/');

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
      <div>
        <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>Settings</h1>
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>Manage your account and preferences</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
        {/* Profile */}
        <div className='bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm'>
          <h3 className='text-base font-bold text-gray-900 dark:text-gray-100 mb-4'>Profile</h3>
          <div className='flex items-center gap-4 mb-4'>
            <Image src={user.imageUrl} alt='Profile' width={56} height={56} className='w-14 h-14 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-sm' />
            <div>
              <p className='font-semibold text-gray-900 dark:text-gray-100'>{user.firstName} {user.lastName}</p>
              <p className='text-sm text-gray-500 dark:text-gray-400'>{user.emailAddresses[0]?.emailAddress}</p>
              <p className='text-xs text-gray-400 mt-0.5'>Joined {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className='text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl p-3'>
            Profile management is handled via Clerk. Click the user button in the header to update your profile.
          </div>
        </div>

        {/* Preferences */}
        <div className='bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm'>
          <h3 className='text-base font-bold text-gray-900 dark:text-gray-100 mb-4'>Preferences</h3>
          <div className='space-y-3'>
            {[
              { label: 'Email notifications', desc: 'Receive budget alerts via email' },
              { label: 'AI insights', desc: 'Auto-generate weekly insights' },
              { label: 'Monthly reports', desc: 'Get monthly spending summaries' },
            ].map((item) => (
              <div key={item.label} className='flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0'>
                <div>
                  <p className='text-sm font-medium text-gray-800 dark:text-gray-200'>{item.label}</p>
                  <p className='text-xs text-gray-400'>{item.desc}</p>
                </div>
                <div className='w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer'>
                  <div className='absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
