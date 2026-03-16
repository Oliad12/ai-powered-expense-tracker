'use client';

import { SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Insights',
    desc: 'Get personalized spending analysis and smart recommendations that actually help you save.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: '⚡',
    title: 'Instant Categorization',
    desc: 'AI suggests the right category for every expense automatically — no manual sorting.',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    icon: '🎯',
    title: 'Budget Tracking',
    desc: 'Set limits per category and get real-time alerts before you overspend.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: '📊',
    title: 'Visual Analytics',
    desc: 'Beautiful charts that turn raw numbers into clear stories about your money.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    desc: 'Enterprise-grade security with Clerk authentication and encrypted storage.',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: '🌙',
    title: 'Dark Mode',
    desc: 'Fully supported dark mode across every screen, easy on the eyes day or night.',
    gradient: 'from-slate-500 to-gray-600',
  },
];

const steps = [
  { step: '01', title: 'Create an account', desc: 'Sign up in seconds with your email or social login.' },
  { step: '02', title: 'Add your expenses', desc: 'Log expenses quickly — AI suggests categories as you type.' },
  { step: '03', title: 'Get insights', desc: 'See where your money goes and get AI tips to spend smarter.' },
];

const faqs = [
  {
    q: 'What is ExpenseTracker AI?',
    a: 'An intelligent personal finance app that uses AI to help you track spending, manage budgets, and get personalized insights — all in one place.',
  },
  {
    q: 'How does the AI work?',
    a: 'It analyzes your expense history to auto-categorize transactions, detect patterns, and generate actionable recommendations tailored to your habits.',
  },
  {
    q: 'Is it free to use?',
    a: 'Yes, completely free. Sign up and start tracking your expenses with full AI features right away.',
  },
  {
    q: 'Is my data safe?',
    a: 'Absolutely. We use Clerk for authentication and store all data in an encrypted PostgreSQL database. Your data is never shared.',
  },
];

const Guest = () => {
  return (
    <div className='font-sans bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200'>

      {/* Hero */}
      <section className='relative overflow-hidden min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32'>
        {/* Background blobs */}
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-emerald-400/20 via-teal-300/10 to-transparent rounded-full blur-3xl pointer-events-none' />
        <div className='absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-green-400/10 to-transparent rounded-full blur-3xl pointer-events-none' />

        <div className='relative z-10 max-w-5xl mx-auto'>
          <div className='inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-emerald-200/50 dark:border-emerald-700/50'>
            <span className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse' />
            AI-Powered Financial Management
          </div>

          <h1 className='text-5xl sm:text-5xl md:text-5xl lg:text-5xl font-extrabold mb-6 text-gray-900 dark:text-white leading-[1.05] tracking-tight'>
            Take control of{' '}
            <span className='bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500 bg-clip-text text-transparent'>
              your money
            </span>
          </h1>

          <p className='text-md sm:text-xl md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed'>
            ExpenseTracker AI helps you understand where your money goes, set smart budgets, and get AI insights — all in one clean dashboard.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <SignInButton>
              <button className='group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5'>
                <span className='relative z-10 flex items-center justify-center gap-2'>
                  Start for Free
                  <svg className='w-5 h-5 group-hover:translate-x-0.5 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                  </svg>
                </span>
              </button>
            </SignInButton>
            <Link href='/about' className='flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 hover:-translate-y-0.5'>
              Learn More
            </Link>
          </div>

          {/* Social proof */}
          <div className='mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400 dark:text-gray-500'>
            <div className='flex items-center gap-2'>
              <span className='text-emerald-500'>✓</span> Free forever
            </div>
            <div className='hidden sm:block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700' />
            <div className='flex items-center gap-2'>
              <span className='text-emerald-500'>✓</span> No credit card required
            </div>
            <div className='hidden sm:block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700' />
            <div className='flex items-center gap-2'>
              <span className='text-emerald-500'>✓</span> AI insights included
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className='py-24 px-4 bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium mb-4 border border-emerald-200/50 dark:border-emerald-700/50'>
              Features
            </div>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight'>
              Everything you need,{' '}
              <span className='text-emerald-500'>nothing you don&apos;t</span>
            </h2>
            <p className='text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto'>
              A focused set of tools designed to make personal finance effortless.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {features.map((f) => (
              <div key={f.title} className='group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-emerald-200
               dark:hover:border-emerald-800 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1'>
                <div className='flex gap-3 items-center'>
                <div className={`w-12 h-12 bg-gradient-to-br ${f.gradient} rounded-xl flex items-center justify-center text-2xl mb-5 shadow-sm`}>
                  {f.icon}
                </div>
                <h3 className='text-base font-bold text-gray-900 dark:text-white mb-2'>{f.title}</h3>
                </div>
                <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className='py-24 px-4 bg-white dark:bg-gray-950'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium mb-4 border border-emerald-200/50 dark:border-emerald-700/50'>
              How it works
            </div>
            <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight'>
              Up and running in{' '}
              <span className='text-emerald-500'>3 steps</span>
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {steps.map((s, i) => (
              <div key={s.step} className='relative text-center'>
                {i < steps.length - 1 && (
                  <div className='hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-emerald-200 to-transparent dark:from-emerald-800' />
                )}
                <div className='w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20'>
                  <span className='text-white font-bold text-lg'>{s.step}</span>
                </div>
                <h3 className='text-base font-bold text-gray-900 dark:text-white mb-2'>{s.title}</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className='py-24 px-4 bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-3xl mx-auto'>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium mb-4 border border-emerald-200/50 dark:border-emerald-700/50'>
              FAQ
            </div>
            <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight'>
              Common <span className='text-emerald-500'>questions</span>
            </h2>
          </div>

          <div className='space-y-4'>
            {faqs.map((faq) => (
              <div key={faq.q} className='bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm'>
                <h3 className='text-base font-bold text-gray-900 dark:text-white mb-2'>{faq.q}</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-24 px-4 bg-white dark:bg-gray-950'>
        <div className='max-w-3xl mx-auto'>
          <div className='relative overflow-hidden bg-gradient-to-br from-emerald-100/20 via-green-200/10 to-teal-200/20 rounded-3xl p-12 text-center shadow-2xl'>
            <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none' />
            <div className='absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none' />
            <div className='relative z-10'>
              <h2 className='text-3xl sm:text-4xl font-bold text-bold mb-4'>Ready to get started?</h2>
              <p className='text-lg mb-8 max-w-md mx-auto'>
                Join and start tracking your expenses with AI-powered insights today.
              </p>
              <SignInButton>
                <button className='inline-flex items-center gap-2 bg-white text-emerald-600 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 text-base'>
                  Get Started Free
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                  </svg>
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Guest;
