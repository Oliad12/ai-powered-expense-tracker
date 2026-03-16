'use client';

import Sidebar from '@/components/Sidebar';
import TopHeader from '@/components/TopHeader';
import { useSidebar } from '@/contexts/SidebarContext';

interface Props {
  children: React.ReactNode;
  userName?: string | null;
  userImage?: string | null;
}

export default function DashboardContent({ children, userName, userImage }: Props) {
  const { collapsed } = useSidebar();
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300'>
      <Sidebar />
      <div className={`transition-all duration-300 pt-14 lg:pt-0 ${collapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
        <TopHeader userName={userName} userImage={userImage} />
        <main className='min-h-[calc(100vh-4rem)]'>
          {children}
        </main>
      </div>
    </div>
  );
}
