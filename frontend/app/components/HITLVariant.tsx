'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  Terminal,
  ShieldAlert,
  Zap,
  RotateCcw,
  Check,
  Copy,
  AlertTriangle,
  Cpu,
  Layout,
  ChevronRight,
} from 'lucide-react'

import { motion, AnimatePresence } from 'framer-motion'

import ReactDiffViewer from 'react-diff-viewer-continued'
import { cn } from '@/lib/utils'

interface ReviewResult {
  bugs: string[]
  security: string[]
  performance: string[]
  refactored_code: string
}

export default function CodeReviewHITL() {
  const [code, setCode] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isSplitView, setIsSplitView] = useState(true)

  const hasIssues = useMemo(() => {
    if (!result) return false
    return result.bugs.length > 0 || result.security.length > 0
  }, [result])

  const handleReview = async () => {
    if (!code || code.trim().length < 15) {
      setError(
        'Architect Buffer Underflow: Provide more context for a meaningful audit.',
      )
      return
    }

    setIsAnalyzing(true)
    setError(null)

    const formData = new FormData()
    formData.append('code', code)

    try {
      const response = await fetch(
        'https://code-review-ai-b.onrender.com/review',
        {
          method: 'POST',
          body: formData,
        },
      )

      if (!response.ok) throw new Error('SENTINEL_UNREACHABLE')
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (err) {
      setError(
        'Engine Disconnect: The Architect core is unreachable. Check your uplink.',
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  const copyToClipboard = useCallback(() => {
    if (result?.refactored_code) {
      navigator.clipboard.writeText(result.refactored_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [result])

  return (
    <div className='relative w-full max-w-7xl mx-auto min-h-125'>
      <AnimatePresence mode='wait'>
        {!result ? (
          <motion.div
            key='editor'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className='space-y-6'
          >
            <div className='group bg-[#020617] border border-slate-800 shadow-2xl rounded-sm overflow-hidden'>
              <div className='border-b border-slate-800 p-4 md:p-6 flex flex-wrap justify-between items-center gap-4 bg-slate-900/60 backdrop-blur-xl'>
                <div className='flex items-center gap-3'>
                  <div className='flex gap-1.5'>
                    <div className='w-2 h-2 rounded-full bg-red-500/40' />
                    <div className='w-2 h-2 rounded-full bg-amber-500/40' />
                    <div className='w-2 h-2 rounded-full bg-green-500/40' />
                  </div>
                  <div className='h-4 w-px bg-slate-800' />
                  <Terminal className='w-4 h-4 text-[#ff4f00]' />
                  <span className='text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>
                    Logic_Buffer
                  </span>
                </div>
                {isAnalyzing && (
                  <div className='flex items-center gap-2 bg-[#ff4f00]/10 px-3 py-1 rounded-full'>
                    <RotateCcw className='w-3 h-3 text-[#ff4f00] animate-spin' />
                    <span className='text-[8px] font-black text-[#ff4f00] uppercase tracking-widest'>
                      Analyzing
                    </span>
                  </div>
                )}
              </div>

              <textarea
                className='w-full h-87.5 md:h-125 p-6 md:p-10 focus:outline-none font-mono text-xs md:text-sm leading-relaxed resize-none bg-transparent text-slate-300 placeholder:text-slate-800 border-none selection:bg-[#ff4f00]/30 custom-scrollbar'
                placeholder='// SECURE CHANNEL OPEN. PASTE SOURCE FOR ARCHITECT ANALYSIS...'
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>

            {error && (
              <div className='bg-red-950/20 border-l-2 border-red-600 p-4 flex items-start gap-4 text-red-200 text-[10px] md:text-xs font-bold uppercase tracking-wide'>
                <AlertTriangle className='w-4 h-4 shrink-0 text-red-500' />
                {error}
              </div>
            )}

            <button
              onClick={handleReview}
              disabled={!code || isAnalyzing}
              className={cn(
                'w-full py-8 md:py-12 font-space font-black uppercase tracking-[0.4em] text-[10px] md:text-xs transition-all rounded-sm flex items-center justify-center gap-4',
                isAnalyzing
                  ? 'bg-slate-900 text-slate-600'
                  : 'bg-[#ff4f00] text-white hover:bg-white hover:text-black hover:shadow-[0_0_40px_rgba(255,79,0,0.2)]',
              )}
            >
              {isAnalyzing ? 'Processing Engine...' : 'Execute Audit'}
              {!isAnalyzing && <ChevronRight className='w-4 h-4' />}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key='result'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='space-y-6 md:space-y-8'
          >
            {/* Summary Header */}
            <div className='flex flex-col md:flex-row bg-white border border-slate-200 shadow-xl rounded-sm overflow-hidden'>
              <div className='p-6 md:p-8 flex items-center gap-6 flex-1 border-b md:border-b-0 md:border-r border-slate-100'>
                <div
                  className={cn(
                    'w-12 h-12 flex items-center justify-center rounded-sm',
                    hasIssues
                      ? 'bg-red-50 text-red-600'
                      : 'bg-green-50 text-green-600',
                  )}
                >
                  {hasIssues ? (
                    <ShieldAlert className='w-6 h-6' />
                  ) : (
                    <Check className='w-6 h-6' />
                  )}
                </div>
                <div>
                  <h3 className='font-space font-black uppercase text-sm md:text-base tracking-tight text-slate-950'>
                    {hasIssues ? 'Defects Found' : 'Architecture Optimized'}
                  </h3>
                  <p className='text-[8px] md:text-[9px] text-slate-400 font-mono uppercase tracking-widest'>
                    ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
                  </p>
                </div>
              </div>
              <div className='p-4 md:p-6 bg-slate-50/50 flex flex-wrap gap-2'>
                <button
                  onClick={copyToClipboard}
                  className={cn(
                    'flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-950 text-[9px] font-black uppercase tracking-widest transition-all',
                    copied
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'hover:bg-slate-950 hover:text-white',
                  )}
                >
                  {copied ? (
                    <Check className='w-3 h-3' />
                  ) : (
                    <Copy className='w-3 h-3' />
                  )}
                  {copied ? 'Copied' : 'Copy Result'}
                </button>
                <button
                  onClick={() => setResult(null)}
                  className='flex-1 md:flex-none bg-black text-white px-6 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-[#ff4f00] transition-all'
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Responsive Insight Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-sm overflow-hidden shadow-lg'>
              <InsightCard
                title='Security'
                items={result.security}
                icon={ShieldAlert}
                color='text-red-600'
                bg='bg-white'
              />
              <InsightCard
                title='Logic'
                items={result.bugs}
                icon={AlertTriangle}
                color='text-amber-600'
                bg='bg-white'
              />
              <InsightCard
                title='Performance'
                items={result.performance}
                icon={Zap}
                color='text-blue-600'
                bg='bg-white'
              />
            </div>

            {/* Diff Engine - Responsive Scroll */}
            <div className='bg-[#020617] border border-slate-800 rounded-sm overflow-hidden shadow-2xl'>
              <div className='bg-slate-900/90 p-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4'>
                <div className='flex items-center gap-3'>
                  <Cpu className='w-4 h-4 text-[#ff4f00]' />
                  <span className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>
                    Logic_Diff
                  </span>
                </div>
                <button
                  onClick={() => setIsSplitView(!isSplitView)}
                  className='hidden md:flex items-center gap-2 text-[9px] font-bold text-slate-500 hover:text-white uppercase'
                >
                  <Layout className='w-3 h-3' />{' '}
                  {isSplitView ? 'Unified' : 'Split'}
                </button>
              </div>
              <div className='overflow-x-auto overflow-y-hidden max-w-full'>
                <div className='min-w-150 md:min-w-full'>
                  <ReactDiffViewer
                    oldValue={code}
                    newValue={result.refactored_code}
                    splitView={isSplitView}
                    useDarkTheme={true}
                    styles={{
                      variables: {
                        dark: {
                          diffViewerBackground: '#020617',
                          addedBackground: 'rgba(34, 197, 94, 0.05)',
                          removedBackground: 'rgba(239, 68, 68, 0.05)',
                        },
                      },
                      contentText: {
                        fontSize: '12px',
                        fontFamily: 'JetBrains Mono, monospace',
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function InsightCard({ title, items, icon: Icon, color, bg }: any) {
  return (
    <div className={cn('p-6 md:p-8 flex flex-col', bg)}>
      <div className='flex items-center gap-3 mb-4'>
        <Icon className={cn('w-4 h-4', color)} />
        <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>
          {title}
        </span>
      </div>
      <div className='space-y-3'>
        {items?.length > 0 ? (
          items.map((item: string, i: number) => (
            <div
              key={i}
              className='flex gap-3 text-xs font-bold text-slate-700 leading-snug'
            >
              <span className='opacity-20 font-mono text-[9px] mt-0.5'>
                0{i + 1}
              </span>
              <p>{item}</p>
            </div>
          ))
        ) : (
          <p className='text-[10px] italic text-slate-400'>Verified_Secure</p>
        )}
      </div>
    </div>
  )
}
