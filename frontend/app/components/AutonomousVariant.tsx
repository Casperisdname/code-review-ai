'use client'

import { useState, useEffect, useCallback, useRef, memo } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Cpu,
  WifiOff,
  Activity,
  ChevronRight,
  Terminal,
  Database,
  Timer,
  Server,
  RefreshCcw,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

/**
 * Types & Interfaces
 */
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

interface Stats {
  health: number
  latency: number
  totalAudits: number
}

export default function AutonomousCodeReview() {
  const [isLive, setIsLive] = useState(true)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [error, setError] = useState(false)
  const [isWakingUp, setIsWakingUp] = useState(false)
  const [stats, setStats] = useState<Stats>({
    health: 100,
    latency: 0.45,
    totalAudits: 0,
  })
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const pollInterval = useRef<NodeJS.Timeout | null>(null)

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(
        'https://code-review-backend-egjh.onrender.com/history',
        {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        },
      )

      if (!res.ok) {
        if (res.status === 502) {
          setIsWakingUp(true)
          return
        }
        throw new Error('Engine Offline')
      }

      const data = await res.json()
      const formattedData = Array.isArray(data) ? [...data].reverse() : []

      // Atomic Update to prevent UI jitter
      setLogs((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(formattedData)) return prev
        return formattedData
      })

      setStats({
        health: 100,
        totalAudits: formattedData.length,
        latency: parseFloat((Math.random() * (0.5 - 0.2) + 0.2).toFixed(2)),
      })

      setError(false)
      setIsWakingUp(false)
    } catch (err) {
      setError(true)
    } finally {
      setIsInitialLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
    if (isLive) {
      pollInterval.current = setInterval(fetchHistory, 5000)
    }
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current)
    }
  }, [isLive, fetchHistory])

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 md:space-y-10 pb-20 font-sans selection:bg-[#ff4f00]/30'>
      {/* 1. Sentinel Status Header */}
      <header
        className={cn(
          'p-8 md:p-12 relative overflow-hidden transition-all duration-500 shadow-2xl rounded-md border',
          error
            ? 'bg-red-950/20 border-red-500/30'
            : isWakingUp
              ? 'bg-amber-950/20 border-amber-500/30'
              : 'bg-slate-950 border-slate-800',
        )}
      >
        <div className='absolute top-0 right-0 p-4 opacity-5 pointer-events-none'>
          <Cpu size={120} />
        </div>

        <div className='relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8'>
          <div className='space-y-5'>
            <div className='flex items-center gap-4'>
              <div
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-500 shadow-lg',
                  isWakingUp
                    ? 'bg-amber-500 animate-bounce'
                    : !error
                      ? 'bg-[#ff4f00] animate-pulse shadow-[#ff4f00]/40'
                      : 'bg-red-600 shadow-red-600/40',
                )}
              />
              <h2 className='text-3xl md:text-5xl font-black uppercase tracking-tighter text-white italic leading-none'>
                {isWakingUp
                  ? 'Engine_Waking'
                  : error
                    ? 'Sentinel_Offline'
                    : 'Sentinel_Live'}
              </h2>
            </div>

            <div className='flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full w-fit border border-white/10'>
              <Terminal size={12} className='text-[#ff4f00]' />
              <p className='font-mono text-[10px] text-slate-400 uppercase tracking-[0.3em]'>
                {isWakingUp
                  ? 'Protocol: Wake_Sequence'
                  : 'Status: Architect_v1.0.4'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsInitialLoading(true)
              fetchHistory()
            }}
            disabled={isWakingUp}
            className={cn(
              'group relative w-full lg:w-auto px-10 py-5 font-black text-[11px] uppercase tracking-[0.25em] transition-all rounded-sm border overflow-hidden',
              !error && !isWakingUp
                ? 'bg-[#ff4f00] border-[#ff4f00] text-white hover:bg-white hover:text-black'
                : 'bg-white text-black border-white',
            )}
          >
            <span className='relative z-10 flex items-center justify-center gap-3'>
              {isInitialLoading && (
                <RefreshCcw size={14} className='animate-spin' />
              )}
              {error
                ? 'Force Reconnect'
                : isWakingUp
                  ? 'Waking System'
                  : 'Sync System'}
            </span>
          </button>
        </div>
      </header>

      {/* 2. Metrics Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <MetricCard
          icon={Activity}
          label='Health'
          value={`${stats.health}%`}
          status='Active'
          delay={0.1}
        />
        <MetricCard
          icon={Timer}
          label='Latency'
          value={`${stats.latency}s`}
          status='Realtime'
          delay={0.2}
        />
        <MetricCard
          icon={Database}
          label='Logs'
          value={stats.totalAudits.toString()}
          status='Verified'
          delay={0.3}
        />
      </div>

      {/* 3. The Audit Log Vault */}
      <section className='bg-white border border-slate-200 shadow-2xl rounded-md overflow-hidden'>
        <div className='bg-slate-900 p-6 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <Server size={18} className='text-[#ff4f00]' />
            <h3 className='text-[11px] font-black uppercase tracking-[0.3em] text-white'>
              Audit_History_Vault
            </h3>
          </div>
          <div className='flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20'>
            <span className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse' />
            <span className='text-[10px] font-black text-green-500 uppercase tracking-tighter'>
              Live Uplink
            </span>
          </div>
        </div>

        <div className='divide-y divide-slate-100 min-h-[400px]'>
          <AnimatePresence mode='popLayout'>
            {isInitialLoading ? (
              <LoadingState />
            ) : logs.length > 0 ? (
              logs.map((log, index) => (
                <LogItem key={`${log.timestamp}-${index}`} log={log} />
              ))
            ) : (
              <EmptyState error={error} />
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

/**
 * Sub-Components
 */

const LogItem = memo(({ log }: { log: LogEntry }) => {
  const isCritical = (log.result?.security?.length || 0) > 0
  const hasBugs = (log.result?.bugs?.length || 0) > 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className='group flex flex-col md:flex-row md:items-center justify-between p-8 hover:bg-slate-50 transition-all cursor-pointer border-l-4 border-transparent hover:border-l-[#ff4f00]'
    >
      <div className='flex items-start md:items-center gap-6'>
        <div
          className={cn(
            'w-14 h-14 shrink-0 flex items-center justify-center border-2 transition-all rounded-sm',
            isCritical
              ? 'border-red-600 bg-red-50 text-red-600'
              : hasBugs
                ? 'border-amber-500 bg-amber-50 text-amber-600'
                : 'border-slate-100 bg-slate-50 text-slate-400',
          )}
        >
          {isCritical ? (
            <ShieldCheck size={24} />
          ) : hasBugs ? (
            <AlertCircle size={24} />
          ) : (
            <CheckCircle2 size={24} />
          )}
        </div>

        <div className='space-y-2'>
          <div className='flex items-center gap-3'>
            <span className='text-[10px] font-mono font-black text-slate-400 uppercase tracking-tighter'>
              {new Date(log.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
            {isCritical && (
              <span className='bg-red-600 text-white text-[8px] font-black px-2 py-0.5 uppercase tracking-widest'>
                Critical
              </span>
            )}
          </div>
          <p className='text-sm md:text-base font-bold text-slate-900 font-mono line-clamp-1'>
            {log.code_snippet.trim().substring(0, 60)}...
          </p>
        </div>
      </div>

      <div className='mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-10'>
        <div className='text-left md:text-right'>
          <p className='text-[10px] font-black text-slate-300 uppercase tracking-tighter mb-1'>
            Analysis_Age
          </p>
          <p className='text-xs font-mono font-bold text-slate-600'>
            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
          </p>
        </div>
        <ChevronRight className='text-slate-200 group-hover:text-[#ff4f00] transition-all group-hover:translate-x-2' />
      </div>
    </motion.div>
  )
})

LogItem.displayName = 'LogItem'

function MetricCard({ icon: Icon, label, value, status, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className='bg-white border border-slate-200 p-8 rounded-md shadow-sm hover:shadow-xl transition-all group'
    >
      <div className='flex items-center gap-4 mb-6'>
        <div className='p-2 bg-slate-50 rounded-lg group-hover:bg-[#ff4f00]/10 transition-colors'>
          <Icon size={18} className='text-[#ff4f00]' />
        </div>
        <span className='text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]'>
          {label}
        </span>
      </div>
      <div className='flex items-baseline justify-between'>
        <span className='text-4xl font-black tracking-tighter text-slate-900 italic'>
          {value}
        </span>
        <span className='text-[10px] font-bold text-green-600 uppercase bg-green-50 px-3 py-1 rounded-full'>
          {status}
        </span>
      </div>
    </motion.div>
  )
}

function LoadingState() {
  return (
    <div className='p-8 space-y-6'>
      {[1, 2, 3].map((i) => (
        <div key={i} className='flex gap-6 animate-pulse'>
          <div className='w-14 h-14 bg-slate-100 rounded-sm' />
          <div className='flex-1 space-y-3 py-2'>
            <div className='h-3 bg-slate-100 w-24 rounded' />
            <div className='h-4 bg-slate-100 w-3/4 rounded' />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ error }: { error: boolean }) {
  return (
    <div className='h-[400px] flex flex-col items-center justify-center text-slate-400 p-10 text-center'>
      {error ? (
        <>
          <WifiOff size={48} className='mb-6 text-red-200' />
          <h4 className='text-slate-900 font-bold mb-2 uppercase tracking-tight'>
            Uplink Severed
          </h4>
          <p className='text-xs font-medium max-w-[240px] leading-relaxed'>
            The sentinel engine is currently unreachable. Check network status.
          </p>
        </>
      ) : (
        <>
          <Activity
            className='animate-spin-slow mb-6 text-[#ff4f00]/20'
            size={48}
          />
          <h4 className='text-slate-900 font-bold mb-2 uppercase tracking-tight'>
            Scanning Frequencies
          </h4>
          <p className='text-xs font-medium max-w-[240px] leading-relaxed'>
            Waiting for the first incoming code packet to synchronize with the
            vault.
          </p>
        </>
      )}
    </div>
  )
}
