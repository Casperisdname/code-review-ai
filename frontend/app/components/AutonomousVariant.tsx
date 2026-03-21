'use client'
import { useState, useEffect } from 'react'
import {
  Radio,
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
  id: string
  status: 'pass' | 'warn'
  repo: string
  msg: string
  timestamp: string // Coming from API as ISO string
}

export default function AutonomousCodeReview() {
  const [isLive, setIsLive] = useState(true)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [error, setError] = useState(false)
  const [stats, setStats] = useState({ health: 98, latency: 1.2 })

  const fetchHistory = async () => {
    try {
      const res = await fetch('https://code-review-ai-b.onrender.com/history')
      if (!res.ok) throw new Error('Engine Offline')

      const data = await res.json()
      setLogs(data.history) 
      setStats(data.stats) 
      setError(false)
    } catch (err) {
      setError(true)
      setIsLive(false)
    }
  }

  // Real-time Poll: Syncs with Backend every 5 seconds
  useEffect(() => {
    if (!isLive) return

    fetchHistory()
    const poll = setInterval(fetchHistory, 5000)

    return () => clearInterval(poll)
  }, [isLive])

  return (
    <div className='animate-in fade-in slide-in-from-right-4 duration-700 space-y-8 pb-20'>
      {/* 1. Sentinel Status Header */}
      <div
        className={cn(
          'border p-10 relative overflow-hidden transition-colors duration-500',
          error ? 'bg-red-950 border-red-800' : 'bg-[#020617] border-slate-800',
        )}
      >
        <div className='relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
          <div className='space-y-2'>
            <div className='flex items-center gap-4'>
              <div
                className={cn(
                  'w-3 h-3 rounded-full',
                  isLive && !error
                    ? 'bg-[#ff4f00] animate-ping'
                    : 'bg-slate-600',
                )}
              />
              <h2 className='text-3xl font-black uppercase tracking-tighter text-white'>
                {error ? 'Sentinel Connection Lost' : 'CI/CD Sentinel Live'}
              </h2>
            </div>
            <p className='font-mono text-[10px] text-slate-500 uppercase tracking-[0.3em]'>
              {error
                ? 'ERR_CONNECTION_REFUSED'
                : 'Handshaking with Architect Engine v1.0'}
            </p>
          </div>

          <button
            onClick={() => setIsLive(!isLive)}
            disabled={error}
            className={cn(
              'px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all border',
              isLive
                ? 'bg-[#ff4f00] border-[#ff4f00] text-white'
                : 'bg-slate-800 border-slate-700 text-slate-400',
            )}
          >
            {isLive ? 'Pause Stream' : 'Reconnect Engine'}
          </button>
        </div>
      </div>

      {/* 2. Real Metrics (Pulled from Backend) */}
      <div className='grid grid-cols-1 md:grid-cols-3 border border-slate-200 bg-slate-200 gap-px'>
        <MetricCard label='Active Listeners' value='12' icon={GitBranch} />
        <MetricCard
          label='Engine Health'
          value={`${stats.health}%`}
          icon={ShieldCheck}
        />
        <MetricCard
          label='API Latency'
          value={`${stats.latency}ms`}
          icon={Cpu}
        />
      </div>

      {/* 3. The Real Vault */}
      <div className='bg-white border border-black/5 shadow-sm overflow-hidden'>
        <div className='p-6 border-b border-black/5 flex items-center justify-between bg-slate-50/50'>
          <div className='flex items-center gap-3 text-slate-900'>
            <History className='w-4 h-4 text-[#ff4f00]' />
            <h3 className='font-space font-black uppercase text-xs tracking-widest'>
              Production_Audit_Log
            </h3>
          </div>
        </div>

        <div className='divide-y divide-black/5 min-h-100]'>
          <AnimatePresence mode='popLayout'>
            {logs.length > 0 ? (
              logs.map((log) => (
                <motion.div
                  layout
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-slate-50'
                >
                  <div className='flex items-center gap-4'>
                    <div
                      className={cn(
                        'w-10 h-10 flex items-center justify-center border-2',
                        log.status === 'pass'
                          ? 'border-slate-100'
                          : 'border-[#ff4f00] bg-red-50',
                      )}
                    >
                      {log.status === 'pass' ? (
                        <CheckCircle2 className='w-4 h-4 text-slate-400' />
                      ) : (
                        <AlertCircle className='w-4 h-4 text-[#ff4f00]' />
                      )}
                    </div>
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded'>
                          {log.repo}
                        </span>
                        <p className='text-sm font-bold text-slate-900'>
                          {log.msg}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className='font-mono text-[10px] font-black text-slate-400 uppercase'>
                    {formatDistanceToNow(new Date(log.timestamp), {
                      addSuffix: true,
                    })}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className='h-100 flex flex-col items-center justify-center gap-4'>
                {error ? (
                  <>
                    <WifiOff className='w-8 h-8 text-red-500' />
                    <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                      Check Backend Status on Port 8001
                    </p>
                  </>
                ) : (
                  <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse'>
                    Awaiting First Audit...
                  </p>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
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
    <div className='bg-white p-8 flex items-center justify-between'>
      <div>
        <span className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2'>
          {label}
        </span>
        <span className='text-2xl font-black text-slate-900'>{value}</span>
      </div>
      <Icon className='w-5 h-5 text-slate-200' />
    </div>
  )
}
