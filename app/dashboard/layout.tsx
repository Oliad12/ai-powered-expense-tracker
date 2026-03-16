import { SidebarProvider } from '@/contexts/SidebarContext';
import DashboardContent from '@/components/DashboardContent';
import { checkUser } from '@/lib/checkUser';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await checkUser();
  return (
    <SidebarProvider>
      <DashboardContent userName={user?.name?.split(' ')[0]} userImage={user?.imageUrl ?? undefined}>
        {children}
      </DashboardContent>
    </SidebarProvider>
  );
}
