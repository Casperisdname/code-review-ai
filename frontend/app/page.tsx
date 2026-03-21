'use client'

import { useState, useEffect } from 'react'
import {
  Terminal,
  Command,
  Activity,
  Box,
  BookOpen,
  Settings,
  Menu,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import CodeReviewHITL from './components/HITLVariant'
import AutonomousCodeReview from './components/AutonomousVariant'

export default function CodeReviewDashboard() {
  const [view, setView] = useState<'hitl' | 'auto'>('hitl')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const NavItems = () => (
    <div className='flex flex-col gap-2 w-full'>
      <button
        onClick={() => {
          setView('hitl')
          setIsMobileMenuOpen(false)
        }}
        className={cn(
          'flex items-center gap-4 p-4 transition-all duration-300 group rounded-sm',
          view === 'hitl'
            ? 'bg-slate-900 text-white shadow-[8px_8px_0px_0px_rgba(255,79,0,0.3)]'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
        )}
      >
        <Terminal
          className={cn(
            'w-5 h-5 shrink-0',
            view === 'hitl' ? 'text-[#ff4f00]' : '',
          )}
        />
        <span className='font-space font-black text-[11px] uppercase tracking-[0.15em] whitespace-nowrap'>
          Manual Audit
        </span>
      </button>

      <button
        onClick={() => {
          setView('auto')
          setIsMobileMenuOpen(false)
        }}
        className={cn(
          'flex items-center gap-4 p-4 transition-all duration-300 group rounded-sm',
          view === 'auto'
            ? 'bg-slate-900 text-white shadow-[8px_8px_0px_0px_rgba(255,79,0,0.3)]'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
        )}
      >
        <Activity
          className={cn(
            'w-5 h-5 shrink-0',
            view === 'auto' ? 'text-[#ff4f00]' : '',
          )}
        />
        <span className='font-space font-black text-[11px] uppercase tracking-[0.15em] whitespace-nowrap'>
          Sentinel Mode
        </span>
      </button>
    </div>
  )

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-[#f8fafc]'>
      {/* --- Sidebar (Desktop) --- */}
      <aside className='hidden md:flex w-20 lg:w-72 border-r border-slate-200 bg-white flex-col py-8 sticky top-0 h-screen'>
        <div className='px-6 mb-12'>
          <div className='w-12 h-12 bg-[#ff4f00] flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]'>
            <Command className='w-7 h-7' />
          </div>
        </div>

        <nav className='flex-1 px-3'>
          <NavItems />
        </nav>

        <div className='px-3 border-t border-slate-100 pt-6'>
          <button className='w-full flex items-center gap-4 p-4 text-slate-400 hover:text-slate-900 transition-colors group'>
            <Settings className='w-5 h-5 group-hover:rotate-90 transition-transform duration-500' />
            <span className='hidden lg:block font-space font-bold text-[10px] uppercase tracking-widest'>
              System Config
            </span>
          </button>
        </div>
      </aside>

      {/* --- Mobile Overlay Navigation --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className='fixed inset-0 z-110 bg-slate-950/40 backdrop-blur-sm md:hidden'
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed top-0 left-0 bottom-0 w-[80%] max-w-sm z-120 bg-white p-8 md:hidden shadow-2xl flex flex-col'
            >
              <div className='flex justify-between items-center mb-12'>
                <div className='flex items-center gap-3'>
                  <Command className='w-8 h-8 text-[#ff4f00]' />
                  <span className='font-space font-black text-xs tracking-widest'>
                    ARCHITECT
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='p-2 bg-slate-50 rounded-full'
                >
                  <X className='w-6 h-6 text-slate-900' />
                </button>
              </div>
              <nav className='flex-1'>
                <NavItems />
              </nav>
              <div className='border-t border-slate-100 pt-6'>
                <p className='text-[10px] font-mono text-slate-400 uppercase tracking-widest'>
                  Core_v1.0.4_Stable
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Main Content Area --- */}
      <main className='flex-1 flex flex-col min-w-0'>
        {/* Top Header */}
        <header className='h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 md:px-10 flex items-center justify-between sticky top-0 z-100'>
          <div className='flex items-center gap-4'>
            <button
              className='md:hidden p-2 -ml-2 hover:bg-slate-50 rounded-md transition-colors'
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label='Toggle Menu'
            >
              <Menu className='w-6 h-6 text-slate-900' />
            </button>
            <Box className='hidden sm:block w-5 h-5 text-[#ff4f00]' />
            <h1 className='font-space font-black text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-900 truncate'>
              Architect{' '}
              <span className='text-slate-300 mx-1 hidden xs:inline'>|</span>{' '}
              <span className='text-[#ff4f00]'>Core</span>
            </h1>
          </div>

          <div className='flex items-center gap-3 md:gap-8'>
            <div className='hidden sm:flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-sm'>
              <div className='relative flex h-2 w-2'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
              </div>
              <span className='text-[10px] font-black text-slate-600 uppercase tracking-widest'>
                Node_Active
              </span>
            </div>

            <button className='flex items-center gap-2 bg-black text-white px-4 md:px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-[#ff4f00] transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]'>
              <BookOpen className='w-3 h-3 hidden md:block' />
              Docs
            </button>
          </div>
        </header>

        {/* Dynamic View Section */}
        <div className='p-6 md:p-12 lg:p-16 max-w-7xl mx-auto w-full'>
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='mb-10 md:mb-16 border-l-4 border-slate-900 pl-6 md:pl-10 py-2'
          >
            <h2 className='text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-slate-900 mb-4 leading-none'>
              {view === 'hitl' ? 'Manual Audit' : 'Sentinel Mode'}
            </h2>
            <p className='text-slate-500 text-sm md:text-lg font-medium max-w-3xl leading-relaxed'>
              {view === 'hitl'
                ? 'High-fidelity logic audit. Paste source code to trigger the Architect Engine for deep structural analysis.'
                : 'Continuous environmental surveillance. The Sentinel monitors real-time data streams for architectural drift.'}
            </p>
          </motion.div>

          <section className='relative pb-10 md:pb-20'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={view}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.2 }}
              >
                {view === 'hitl' ? (
                  <CodeReviewHITL />
                ) : (
                  <AutonomousCodeReview />
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  )
}
