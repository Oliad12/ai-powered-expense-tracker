import Guest from '@/components/Guest';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const user = await currentUser();
  if (user) redirect('/dashboard');
  return (
    <>
      <Navbar />
      <Guest />
      <Footer />
    </>
  );
}
