'use client'
import { useState } from 'react'
import {
  Github,
  Radio,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Cpu,
  GitBranch,
  History,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AutonomousCodeReview() {
  const [isLive, setIsLive] = useState(true)

  const stats = [
    { label: 'Repos Monitored', value: '12', icon: GitBranch },
    { label: 'System Health', value: '98%', icon: ShieldCheck },
    { label: 'Avg Latency', value: '1.2s', icon: Cpu },
  ]

  const logs = [
    {
      status: 'pass',
      repo: 'architect-ui',
      msg: 'AuthMiddleware.ts: 0 vulnerabilities.',
      time: '2m ago',
    },
    {
      status: 'warn',
      repo: 'core-engine',
      msg: 'DatabaseService.py: Memory leak in L142.',
      time: '15m ago',
    },
    {
      status: 'pass',
      repo: 'api-gateway',
      msg: 'Routes.js: Logic refactor complete.',
      time: '1h ago',
    },
    {
      status: 'pass',
      repo: 'web-client',
      msg: 'tailwind.config.ts: Optimized bundle size.',
      time: '3h ago',
    },
  ]

  return (
    <div className='animate-in fade-in slide-in-from-right-4 duration-700 space-y-8'>
      {/* 1. Sentinel Status Header */}
      <div className='bg-[#020617] border border-slate-800 p-10 relative overflow-hidden shadow-[12px_12px_0px_0px_rgba(2,6,23,0.05)]'>
        <div className='relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='w-2 h-2 rounded-full bg-[#ff4f00] animate-ping' />
              <h2 className='text-3xl font-black uppercase tracking-tighter text-white'>
                CI/CD Sentinel
              </h2>
            </div>
            <p className='font-mono text-[10px] text-slate-500 uppercase tracking-[0.3em]'>
              Real-time Architectural Surveillance // Active
            </p>
          </div>

          <button
            onClick={() => setIsLive(!isLive)}
            className={cn(
              'px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all',
              isLive
                ? 'bg-[#ff4f00] text-white'
                : 'bg-slate-800 text-slate-400',
            )}
          >
            {isLive ? 'Shut Down Engine' : 'Reactivate System'}
          </button>
        </div>

        {/* Decorative Grid background */}
        <div
          className='absolute inset-0 opacity-10 pointer-events-none'
          style={{
            backgroundImage:
              'radial-gradient(#ff4f00 0.5px, transparent 0.5px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* 2. Real-time Metrics Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 border border-slate-200 bg-slate-200 gap-px'>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className='bg-white p-8 flex items-center justify-between'
          >
            <div>
              <span className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>
                {stat.label}
              </span>
              <span className='text-2xl font-black text-slate-900'>
                {stat.value}
              </span>
            </div>
            <stat.icon className='w-5 h-5 text-slate-300' />
          </div>
        ))}
      </div>

      {/* 3. Live Scan Log */}
      <div className='bg-white border border-black/5 shadow-sm'>
        <div className='p-6 border-b border-black/5 flex items-center justify-between bg-slate-50/50'>
          <div className='flex items-center gap-3'>
            <History className='w-4 h-4 text-slate-400' />
            <h3 className='font-space font-black uppercase text-xs tracking-widest text-slate-900'>
              Scan_History_Stream
            </h3>
          </div>
          <span className='text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic'>
            Live Feed
          </span>
        </div>

        <div className='divide-y divide-black/5'>
          {logs.map((log, i) => (
            <div
              key={i}
              className='flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-slate-50 transition-colors gap-4'
            >
              <div className='flex items-center gap-4'>
                <div
                  className={cn(
                    'w-8 h-8 flex items-center justify-center border',
                    log.status === 'pass'
                      ? 'bg-green-50 border-green-100 text-green-600'
                      : 'bg-red-50 border-red-100 text-[#ff4f00]',
                  )}
                >
                  {log.status === 'pass' ? (
                    <CheckCircle2 className='w-4 h-4' />
                  ) : (
                    <AlertCircle className='w-4 h-4' />
                  )}
                </div>
                <div>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='px-1.5 py-0.5 bg-slate-900 text-white font-mono text-[9px] font-bold rounded'>
                      {log.repo}
                    </span>
                    <span className='text-[11px] font-black text-slate-900'>
                      {log.msg}
                    </span>
                  </div>
                  <p className='text-[10px] text-slate-400 font-bold uppercase tracking-tighter'>
                    Status:{' '}
                    {log.status === 'pass' ? 'Cleared' : 'Critical Issue'}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Radio
                  className={cn(
                    'w-3 h-3',
                    log.status === 'pass'
                      ? 'text-slate-200'
                      : 'text-[#ff4f00] animate-pulse',
                  )}
                />
                <span className='font-mono text-[10px] text-slate-400'>
                  {log.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
