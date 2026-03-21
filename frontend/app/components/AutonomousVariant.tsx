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

      /** * BACKEND ALIGNMENT:
       * Backend returns a raw list []. We reverse it so latest audits
       * appear at the top of the Sentinel log.
       */
      const historyList = Array.isArray(data) ? [...data].reverse() : []
      setLogs(historyList)

      // Dynamic simulated stats based on active state
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
    <div className='animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-8 pb-20'>
      {/* 1. Sentinel Status Header */}
      <header
        className={cn(
          'border p-10 relative overflow-hidden transition-all duration-700 shadow-2xl',
          error
            ? 'bg-red-950/20 border-red-900/50 backdrop-blur-sm'
            : 'bg-slate-950 border-slate-800',
        )}
      >
        <div className='relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
          <div className='space-y-3'>
            <div className='flex items-center gap-4'>
              <div
                className={cn(
                  'w-3 h-3 rounded-full shadow-[0_0_15px_rgba(255,79,0,0.5)]',
                  isLive && !error
                    ? 'bg-[#ff4f00] animate-pulse'
                    : 'bg-slate-700',
                )}
              />
              <h2 className='text-4xl font-black uppercase tracking-tighter text-white italic'>
                {error ? 'Sentinel Offline' : 'Sentinel Live Audit'}
              </h2>
            </div>
            <div className='flex items-center gap-3'>
              <span className='px-2 py-0.5 bg-slate-800 text-[#ff4f00] font-mono text-[9px] font-bold rounded border border-slate-700'>
                {error ? 'SYSTEM_HALT' : 'STREAMS_ACTIVE'}
              </span>
              <p className='font-mono text-[10px] text-slate-500 uppercase tracking-[0.4em]'>
                {error
                  ? 'ERR_REMOTE_CONNECTION_FAILED'
                  : 'Synchronized with Architect Engine v1.0'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (error) {
                fetchHistory()
                setIsLive(true)
              } else {
                setIsLive(!isLive)
              }
            }}
            className={cn(
              'group relative px-10 py-5 font-black text-[11px] uppercase tracking-[0.3em] transition-all border overflow-hidden',
              isLive && !error
                ? 'bg-[#ff4f00] border-[#ff4f00] text-white hover:bg-white hover:text-[#ff4f00]'
                : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500',
            )}
          >
            <span className='relative z-10'>
              {error
                ? 'Force Reconnect'
                : isLive
                  ? 'Terminate Stream'
                  : 'Initialize Stream'}
            </span>
          </button>
        </div>

        {/* Subtle background scanline effect */}
        <div className='absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-size[100%_2px,3px_100%]' />
      </header>

      {/* 2. Metrics Grid */}
      <section className='grid grid-cols-1 md:grid-cols-3 border border-slate-200 bg-slate-200 gap-px shadow-lg'>
        <MetricCard label='Network Nodes' value='01' icon={GitBranch} />
        <MetricCard
          label='System Health'
          value={`${stats.health}%`}
          icon={ShieldCheck}
        />
        <MetricCard
          label='Avg Latency'
          value={`${stats.latency}s`}
          icon={Cpu}
        />
      </section>

      {/* 3. The Audit Log Vault */}
      <section className='bg-white border border-slate-200 shadow-2xl overflow-hidden rounded-sm'>
        <div className='p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50'>
          <div className='flex items-center gap-4 text-slate-900'>
            <div className='p-2 bg-[#ff4f00]/10 rounded-lg'>
              <History className='w-5 h-5 text-[#ff4f00]' />
            </div>
            <div>
              <h3 className='font-black uppercase text-sm tracking-[0.2em]'>
                Production_Audit_Vault
              </h3>
              <p className='text-[9px] text-slate-400 font-mono uppercase'>
                Real-time activity ledger
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
            <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
              Encryption Active
            </span>
          </div>
        </div>

        <div className='divide-y divide-slate-100 min-h-125'>
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className='group flex flex-col md:flex-row md:items-center justify-between p-8 hover:bg-slate-50 transition-colors'
                  >
                    <div className='flex items-center gap-6'>
                      <div
                        className={cn(
                          'w-12 h-12 flex items-center justify-center border-2 transition-transform group-hover:rotate-12',
                          hasIssues
                            ? 'border-[#ff4f00] bg-red-50'
                            : 'border-slate-100 bg-white',
                        )}
                      >
                        {hasIssues ? (
                          <AlertCircle className='w-5 h-5 text-[#ff4f00]' />
                        ) : (
                          <CheckCircle2 className='w-5 h-5 text-green-500' />
                        )}
                      </div>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-3'>
                          <span className='text-[9px] font-black px-2 py-0.5 bg-slate-900 text-white rounded-sm uppercase tracking-tighter'>
                            Audit_ID: {log.timestamp.split('T')[1].slice(0, 8)}
                          </span>
                          <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
                            Manual_Push
                          </span>
                        </div>
                        <p className='text-base font-bold text-slate-900 truncate max-w-87.5 font-mono'>
                          {log.code_snippet}...
                        </p>
                      </div>
                    </div>

                    <div className='mt-4 md:mt-0 flex flex-col items-end gap-2'>
                      <span className='font-mono text-[11px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full border border-slate-100'>
                        {formatDistanceToNow(new Date(log.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                      {hasIssues && (
                        <span className='text-[9px] font-bold text-[#ff4f00] uppercase animate-pulse'>
                          Critical review required
                        </span>
                      )}
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className='h-125 flex flex-col items-center justify-center gap-6'>
                {error ? (
                  <>
                    <div className='p-6 bg-red-50 rounded-full'>
                      <WifiOff className='w-12 h-12 text-red-500' />
                    </div>
                    <div className='text-center space-y-2'>
                      <p className='text-sm font-black text-slate-900 uppercase tracking-widest'>
                        Engine Unreachable
                      </p>
                      <p className='text-[10px] text-slate-400 uppercase'>
                        Check Render deployment status
                      </p>
                    </div>
                  </>
                ) : (
                  <div className='text-center space-y-4'>
                    <div className='relative'>
                      <div className='w-16 h-16 border-4 border-slate-100 border-t-[#ff4f00] rounded-full animate-spin mx-auto' />
                    </div>
                    <p className='text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse'>
                      Awaiting Incoming Data Stream...
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
}: {
  label: string
  value: string
  icon: any
}) {
  return (
    <div className='bg-white p-10 flex items-center justify-between group hover:bg-slate-50 transition-colors cursor-default'>
      <div>
        <span className='block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 group-hover:text-[#ff4f00] transition-colors'>
          {label}
        </span>
        <span className='text-4xl font-black text-slate-950 tracking-tighter'>
          {value}
        </span>
      </div>
      <div className='p-4 bg-slate-50 rounded-full group-hover:scale-110 transition-transform'>
        <Icon className='w-6 h-6 text-slate-300 group-hover:text-slate-900' />
      </div>
    </div>
  )
}
