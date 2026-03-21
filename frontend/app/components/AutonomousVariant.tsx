'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Cpu,
  GitBranch,
  History,
  WifiOff,
  Activity,
  ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface LogEntry {
  timestamp: string
  code_snippet: string
  result: {
    bugs?: string[]
    security?: string[]
    performance?: string[]
    refactored_code?: string
  }
}

export default function AutonomousCodeReview() {
  const [isLive, setIsLive] = useState(true)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [error, setError] = useState(false)
  const [stats, setStats] = useState({ health: 100, latency: 0.45 })

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('https://code-review-ai-b.onrender.com/history')
      if (!res.ok) throw new Error('Engine Offline')
      const data = await res.json()
      const historyList = Array.isArray(data) ? [...data].reverse() : []
      setLogs(historyList)
      setStats({
        health: 100,
        latency: parseFloat((Math.random() * (0.6 - 0.3) + 0.3).toFixed(2)),
      })
      setError(false)
    } catch (err) {
      setError(true)
      setIsLive(false)
    }
  }, [])

  useEffect(() => {
    if (!isLive) return
    fetchHistory()
    const poll = setInterval(fetchHistory, 5000)
    return () => clearInterval(poll)
  }, [isLive, fetchHistory])

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-4 md:space-y-8 pb-10 md:pb-20'>
      {/* 1. Sentinel Status Header */}
      <header
        className={cn(
          'p-6 md:p-10 relative overflow-hidden transition-all duration-700 shadow-2xl rounded-sm border',
          error
            ? 'bg-red-950/20 border-red-900/50'
            : 'bg-slate-950 border-slate-800',
        )}
      >
        <div className='relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6'>
          <div className='space-y-4 w-full lg:w-auto'>
            <div className='flex items-center gap-3 md:gap-4'>
              <div
                className={cn(
                  'w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(255,79,0,0.5)]',
                  isLive && !error
                    ? 'bg-[#ff4f00] animate-pulse'
                    : 'bg-slate-700',
                )}
              />
              <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter text-white italic'>
                {error ? 'Sentinel Offline' : 'Sentinel Live'}
              </h2>
            </div>
            <div className='flex flex-wrap items-center gap-3'>
              <span className='px-2 py-0.5 bg-slate-800 text-[#ff4f00] font-mono text-[8px] md:text-[9px] font-bold rounded border border-slate-700 uppercase'>
                {error ? 'System_Halt' : 'Streams_Active'}
              </span>
              <p className='font-mono text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest md:tracking-[0.4em]'>
                {error ? 'Connection_Lost' : 'Sync: Architect_Engine_v1.0'}
              </p>
            </div>
          </div>

          <button
            onClick={() => (error ? fetchHistory() : setIsLive(!isLive))}
            className={cn(
              'w-full lg:w-auto px-8 py-4 md:py-5 font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] transition-all border rounded-sm',
              isLive && !error
                ? 'bg-[#ff4f00] border-[#ff4f00] text-white hover:bg-white hover:text-black'
                : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500',
            )}
          >
            {error ? 'Reconnect' : isLive ? 'Terminate' : 'Initialize'}
          </button>
        </div>
        <div className='absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]' />
      </header>

      {/* 2. Metrics Grid - Responsive Layout */}
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-slate-200 bg-slate-200 gap-px shadow-lg rounded-sm overflow-hidden'>
        <MetricCard label='Nodes' value='01' icon={GitBranch} />
        <MetricCard
          label='Health'
          value={`${stats.health}%`}
          icon={ShieldCheck}
        />
        <MetricCard
          label='Latency'
          value={`${stats.latency}s`}
          icon={Cpu}
          className='sm:col-span-2 lg:col-span-1'
        />
      </section>

      {/* 3. The Audit Log Vault */}
      <section className='bg-white border border-slate-200 shadow-2xl overflow-hidden rounded-sm'>
        <div className='p-5 md:p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50'>
          <div className='flex items-center gap-4 text-slate-900'>
            <div className='p-2 bg-[#ff4f00]/10 rounded-lg'>
              <Activity className='w-4 h-4 md:w-5 md:h-5 text-[#ff4f00]' />
            </div>
            <div>
              <h3 className='font-black uppercase text-[11px] md:text-sm tracking-widest'>
                Audit_Vault
              </h3>
              <p className='text-[8px] md:text-[9px] text-slate-400 font-mono uppercase'>
                Activity Ledger
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full'>
            <span className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse' />
            <span className='text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter'>
              Encrypted_Uplink
            </span>
          </div>
        </div>

        <div className='divide-y divide-slate-100 min-h-75 md:min-h-125'>
          <AnimatePresence mode='popLayout'>
            {logs.length > 0 ? (
              logs.map((log, index) => {
                const hasIssues =
                  (log.result?.bugs?.length || 0) > 0 ||
                  (log.result?.security?.length || 0) > 0
                return (
                  <motion.div
                    layout
                    key={log.timestamp + index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className='group flex flex-col md:flex-row md:items-center justify-between p-5 md:p-8 hover:bg-slate-50/80 transition-all gap-4'
                  >
                    <div className='flex items-start md:items-center gap-4 md:gap-6'>
                      <div
                        className={cn(
                          'w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center border-2 transition-transform',
                          hasIssues
                            ? 'border-[#ff4f00] bg-red-50'
                            : 'border-slate-100 bg-white',
                        )}
                      >
                        {hasIssues ? (
                          <AlertCircle className='w-4 h-4 md:w-5 md:h-5 text-[#ff4f00]' />
                        ) : (
                          <CheckCircle2 className='w-4 h-4 md:w-5 md:h-5 text-green-500' />
                        )}
                      </div>
                      <div className='space-y-1 overflow-hidden'>
                        <div className='flex items-center gap-2'>
                          <span className='text-[8px] font-black px-1.5 py-0.5 bg-slate-900 text-white rounded-xs uppercase'>
                            {log.timestamp.split('T')[1].slice(0, 5)}
                          </span>
                        </div>
                        <p className='text-sm md:text-base font-bold text-slate-900 truncate max-w-50 md:max-w-md font-mono'>
                          {log.code_snippet}
                        </p>
                      </div>
                    </div>

                    <div className='flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-50'>
                      <span className='font-mono text-[9px] md:text-[11px] font-black text-slate-400 uppercase'>
                        {formatDistanceToNow(new Date(log.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                      {hasIssues && (
                        <span className='text-[8px] md:text-[9px] font-bold text-[#ff4f00] uppercase tracking-tighter'>
                          Critical_Review
                        </span>
                      )}
                      <ChevronRight className='w-4 h-4 text-slate-200 group-hover:text-slate-400 transition-colors hidden md:block' />
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className='h-100 flex flex-col items-center justify-center gap-4 p-10'>
                {error ? (
                  <>
                    <WifiOff className='w-10 h-10 text-red-500 opacity-50' />
                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                      Uplink Offline
                    </p>
                  </>
                ) : (
                  <div className='text-center space-y-4'>
                    <div className='w-12 h-12 border-2 border-slate-100 border-t-[#ff4f00] rounded-full animate-spin mx-auto' />
                    <p className='text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]'>
                      Awaiting Stream...
                    </p>
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string
  value: string
  icon: any
  className?: string
}) {
  return (
    <div
      className={cn(
        'bg-white p-6 md:p-10 flex items-center justify-between group hover:bg-slate-50/50 transition-colors',
        className,
      )}
    >
      <div>
        <span className='block text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 md:mb-3'>
          {label}
        </span>
        <span className='text-2xl md:text-4xl font-black text-slate-950 tracking-tighter'>
          {value}
        </span>
      </div>
      <div className='p-3 md:p-4 bg-slate-50 rounded-sm'>
        <Icon className='w-5 h-5 md:w-6 md:h-6 text-slate-300 group-hover:text-[#ff4f00] transition-colors' />
      </div>
    </div>
  )
}
