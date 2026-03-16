'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const features = [
  { icon: '🤖', title: 'AI-Powered Insights', desc: 'Get personalized spending analysis and smart recommendations powered by advanced AI to help you make better financial decisions.' },
  { icon: '📊', title: 'Visual Analytics', desc: 'Beautiful charts and graphs that turn your raw expense data into clear, actionable visual stories about your spending habits.' },
  { icon: '🎯', title: 'Budget Tracking', desc: 'Set monthly budgets per category and track your progress in real time with color-coded alerts before you overspend.' },
  { icon: '⚡', title: 'Instant Categorization', desc: 'AI automatically suggests the right category for every expense, saving you time and keeping your data organized.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Your financial data is protected with enterprise-grade security via Clerk authentication and encrypted database storage.' },
  { icon: '🌙', title: 'Dark Mode', desc: 'Easy on the eyes day or night. Full dark mode support across every screen in the app.' },
];

const stats = [
  { value: '100%', label: 'Free to Use' },
  { value: 'AI', label: 'Powered Insights' },
  { value: 'ETB', label: 'Local Currency' },
  { value: '24/7', label: 'Always Available' },
];

const stack = [
  { name: 'Next.js 15', color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' },
  { name: 'TypeScript', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' },
  { name: 'Prisma ORM', color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' },
  { name: 'PostgreSQL', color: 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300' },
  { name: 'Tailwind CSS', color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300' },
  { name: 'Clerk Auth', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' },
  { name: 'Google Gemini', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' },
  { name: 'Chart.js', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' },
];

export default function AboutPage() {
  return (
    <>
    <Navbar />
    <div className='font-sans bg-gradient-to-br from-gray-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20 text-gray-800 dark:text-gray-200 min-h-screen'>

      {/* Hero */}
      <section className='relative overflow-hidden flex flex-col items-center justify-center text-center py-20 sm:py-28 px-4 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 dark:from-emerald-900/30 dark:via-green-900/20 dark:to-teal-900/30'>
        <div className='relative z-10 max-w-4xl mx-auto'>
          <div className='inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg'>
            <span className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse'></span>
            About ExpenseTracker AI
          </div>
          <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100 leading-tight'>
            Smart Money,{' '}
            <span className='bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent'>
              Smarter You
            </span>
          </h1>
          <p className='text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed'>
            ExpenseTracker AI is a modern personal finance app built to help you understand, manage, and optimize your spending — powered by artificial intelligence.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className='py-12 px-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-y border-gray-100 dark:border-gray-700'>
        <div className='max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center'>
          {stats.map((s) => (
            <div key={s.label}>
              <p className='text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent'>{s.value}</p>
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className='py-16 sm:py-20 px-4'>
        <div className='max-w-3xl mx-auto text-center'>
          <div className='inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium mb-6'>
            <span className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></span>
            Our Mission
          </div>
          <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6'>
            Built for people who want{' '}
            <span className='text-emerald-600 dark:text-emerald-400'>control</span> over their finances
          </h2>
          <p className='text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4'>
            Most people don&apos;t track their expenses because it&apos;s tedious. We built ExpenseTracker AI to remove that friction — add an expense in seconds, let AI categorize it, and get insights that actually tell you something useful.
          </p>
          <p className='text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed'>
            Whether you&apos;re saving for a goal, trying to cut back, or just curious where your money goes — this app gives you the clarity to act.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className='py-16 sm:py-20 px-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm relative overflow-hidden'>
        <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500'></div>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium mb-4'>
              <span className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></span>
              Features
            </div>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100'>
              Everything you need to{' '}
              <span className='text-emerald-600 dark:text-emerald-400'>stay on track</span>
            </h2>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {features.map((f) => (
              <div key={f.title} className='group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200'>
                <div className='flex items-center gap-3'>
                <div className='w-11 h-11 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl flex items-center justify-center text-2xl mb-4'>
                  {f.icon}
                </div>
                <h3 className='text-base font-bold text-gray-900 dark:text-gray-100 mb-2'>{f.title}</h3>
                </div>
                <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className='py-16 sm:py-20 px-4'>
        <div className='max-w-4xl mx-auto text-center'>
          <div className='inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium mb-6'>
            <span className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></span>
            Tech Stack
          </div>
          <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
            Built with modern tools
          </h2>
          <p className='text-gray-500 dark:text-gray-400 mb-10'>A carefully chosen stack for performance, reliability, and developer experience.</p>
          <div className='flex flex-wrap justify-center gap-3'>
            {stack.map((t) => (
              <span key={t.name} className={`px-4 py-2 rounded-full text-sm font-semibold ${t.color}`}>{t.name}</span>
            ))}
          </div>
        </div>
      </section>
      <section className='py-24 px-4 bg-gradient-to-br from-emerald-600/20 via-green-700/10 to-teal-900/10'>
        <div className='max-w-2xl mx-auto text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold text-bold mb-4'>Ready to take control?</h2>
          <p className='text-lg mb-8'>Start tracking your expenses today — it takes less than a minute to get started.</p>
          <Link
            href='/sign-up'
            className='inline-flex items-center gap-2 bg-white text-emerald-600 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200'
          >
            Get Started Free
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
            </svg>
          </Link>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}
