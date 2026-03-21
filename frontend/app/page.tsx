'use client'
import { useState } from 'react'
import {
  Terminal,
  ShieldCheck,
  Command,
  Activity,
  Box,
  BookOpen,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import CodeReviewHITL from './components/HITLVariant'
import AutonomousCodeReview from './components/AutonomousVariant'

export default function CodeReviewDashboard() {
  const [view, setView] = useState<'hitl' | 'auto'>('hitl')

  return (
    <div className='flex min-h-screen bg-[#f8fafc]'>
      {/* Structural Sidebar */}
      <aside className='w-20 md:w-64 border-r border-slate-200 bg-white flex flex-col py-8 shadow-sm'>
        <div className='px-6 mb-12'>
          <div className='w-12 h-12 bg-[#ff4f00] flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]'>
            <Command className='w-7 h-7' />
          </div>
        </div>

        <nav className='flex flex-col gap-2 w-full px-3'>
          <button
            onClick={() => setView('hitl')}
            className={cn(
              'flex items-center gap-4 p-4 transition-all duration-200 group',
              view === 'hitl'
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
            )}
          >
            <Terminal
              className={cn('w-5 h-5', view === 'hitl' ? 'text-[#ff4f00]' : '')}
            />
            <span className='hidden md:block font-space font-black text-[11px] uppercase tracking-[0.15em]'>
              Manual Audit
            </span>
          </button>

          <button
            onClick={() => setView('auto')}
            className={cn(
              'flex items-center gap-4 p-4 transition-all duration-200 group',
              view === 'auto'
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
            )}
          >
            <Activity
              className={cn('w-5 h-5', view === 'auto' ? 'text-[#ff4f00]' : '')}
            />
            <span className='hidden md:block font-space font-black text-[11px] uppercase tracking-[0.15em]'>
              Sentinel Mode
            </span>
          </button>
        </nav>

        <div className='mt-auto px-3 border-t border-slate-100 pt-6'>
          <button className='w-full flex items-center gap-4 p-4 text-slate-400 hover:text-slate-900 transition-colors'>
            <Settings className='w-5 h-5' />
            <span className='hidden md:block font-space font-bold text-[10px] uppercase tracking-widest'>
              Settings
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className='flex-1 flex flex-col overflow-y-auto'>
        {/* Top Header */}
        <header className='h-20 border-b border-slate-200 bg-white px-10 flex items-center justify-between sticky top-0 z-50'>
          <div className='flex items-center gap-4'>
            <Box className='w-5 h-5 text-[#ff4f00]' />
            <h1 className='font-space font-black text-sm uppercase tracking-[0.4em] text-slate-900'>
              Architect <span className='text-slate-300 mx-1'>|</span>{' '}
              <span className='text-[#ff4f00]'>Core</span>
            </h1>
          </div>

          <div className='flex items-center gap-8'>
            <div className='flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2'>
              <div className='relative flex h-2 w-2'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
              </div>
              <span className='text-[10px] font-black text-slate-600 uppercase tracking-widest'>
                Node: Active
              </span>
            </div>

            <button className='flex items-center gap-2 bg-black text-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-[#ff4f00] transition-all transform active:scale-95'>
              <BookOpen className='w-3 h-3' />
              Docs
            </button>
          </div>
        </header>

        {/* Dynamic View Section */}
        <div className='p-12 max-w-7xl mx-auto w-full'>
          <div className='mb-12 border-l-4 border-black pl-8 py-2'>
            <h2 className='text-5xl font-black tracking-tighter uppercase text-slate-900 mb-3'>
              {view === 'hitl' ? 'On-Demand Audit' : 'Sentinel Activity'}
            </h2>
            <p className='text-slate-500 text-base font-medium max-w-2xl leading-relaxed'>
              {view === 'hitl'
                ? 'Submit multi-language source code for deep architectural analysis, security vulnerability detection, and refactoring suggestions.'
                : 'Monitor real-time repository streams. Autonomous detection of memory leaks, security breaches, and performance bottlenecks.'}
            </p>
          </div>

          <section className='relative pb-20'>
            {view === 'hitl' ? <CodeReviewHITL /> : <AutonomousCodeReview />}
          </section>
        </div>
      </main>
    </div>
  )
}
