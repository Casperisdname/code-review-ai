'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  Terminal,
  ShieldAlert,
  Zap,
  Code2,
  RotateCcw,
  Check,
  Copy,
  AlertTriangle,
  Cpu,
  RefreshCcw,
  Layout,
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

  // Memoized stats to prevent layout shifts
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
        'Engine Disconnect: The Architect core is currently unreachable. Retrying might restore the link.',
      )
      console.error('Core Audit Error:', err)
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
    <div className='relative min-h-175 w-full max-w-7xl mx-auto'>
      <AnimatePresence mode='wait'>
        {!result ? (
          <motion.div
            key='editor-view'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className='space-y-8'
          >
            {/* Input Terminal */}
            <div className='group bg-[#020617] border border-slate-800 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] rounded-md overflow-hidden transition-all duration-500 focus-within:border-[#ff4f00]/50'>
              <div className='border-b border-slate-800 p-6 flex justify-between items-center bg-slate-900/60 backdrop-blur-xl'>
                <div className='flex items-center gap-4'>
                  <div className='flex gap-2'>
                    <div className='w-2.5 h-2.5 rounded-full bg-slate-800 group-focus-within:bg-red-500/60 transition-colors' />
                    <div className='w-2.5 h-2.5 rounded-full bg-slate-800 group-focus-within:bg-amber-500/60 transition-colors' />
                    <div className='w-2.5 h-2.5 rounded-full bg-slate-800 group-focus-within:bg-green-500/60 transition-colors' />
                  </div>
                  <div className='h-5 w-px bg-slate-800 mx-2' />
                  <div className='flex items-center gap-3'>
                    <Terminal className='w-4 h-4 text-[#ff4f00]' />
                    <span className='text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-focus-within:text-slate-200 transition-colors'>
                      Input_Logic_Buffer
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className='flex items-center gap-3 bg-[#ff4f00]/10 px-4 py-1.5 rounded-full border border-[#ff4f00]/20'
                    >
                      <span className='text-[9px] font-black text-[#ff4f00] uppercase tracking-widest'>
                        Processing_Core_Heuristics
                      </span>
                      <RotateCcw className='w-3 h-3 text-[#ff4f00] animate-spin' />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <textarea
                className='w-full h-137.5 p-12 focus:outline-none font-mono text-sm leading-relaxed resize-none bg-transparent text-slate-300 placeholder:text-slate-800 border-none selection:bg-[#ff4f00]/40 custom-scrollbar'
                placeholder='// SECURE CHANNEL OPEN. PASTE SOURCE FOR ARCHITECT ANALYSIS...'
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className='bg-red-950/30 border-l-4 border-red-600 p-6 flex items-center gap-5 text-red-200 text-xs font-bold uppercase tracking-wide shadow-lg'
              >
                <AlertTriangle className='w-5 h-5 shrink-0 text-red-500' />{' '}
                {error}
              </motion.div>
            )}

            <button
              onClick={handleReview}
              disabled={!code || isAnalyzing}
              className={cn(
                'w-full py-10 font-space font-black uppercase tracking-[0.5em] text-xs transition-all relative overflow-hidden group rounded-md',
                isAnalyzing
                  ? 'bg-slate-900 text-slate-600'
                  : 'bg-[#ff4f00] text-white hover:bg-white hover:text-black',
              )}
            >
              <span className='relative z-10'>
                {isAnalyzing
                  ? 'Synchronizing Neural Paths...'
                  : 'Execute Structural Audit'}
              </span>
              <div className='absolute inset-0 bg-black/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300' />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key='result-view'
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className='space-y-8'
          >
            {/* Analysis Summary Header */}
            <div className='flex flex-col lg:flex-row justify-between items-stretch bg-white border border-slate-200 shadow-2xl rounded-md overflow-hidden'>
              <div className='p-10 flex items-center gap-8 lg:border-r border-slate-100 flex-1'>
                <div
                  className={cn(
                    'w-16 h-16 flex items-center justify-center rounded-2xl transition-colors shrink-0',
                    hasIssues
                      ? 'bg-red-50 text-red-600'
                      : 'bg-green-50 text-green-600',
                  )}
                >
                  {hasIssues ? (
                    <ShieldAlert className='w-8 h-8' />
                  ) : (
                    <Check className='w-8 h-8' />
                  )}
                </div>
                <div>
                  <h3 className='font-space font-black uppercase text-lg tracking-tighter text-slate-950'>
                    {hasIssues
                      ? 'Vulnerabilities Identified'
                      : 'Architecture Verified'}
                  </h3>
                  <p className='text-[10px] text-slate-400 font-mono uppercase tracking-[0.3em]'>
                    Session_Token:{' '}
                    {Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </p>
                </div>
              </div>

              <div className='bg-slate-50/50 p-8 flex items-center gap-4 flex-wrap'>
                <button
                  onClick={copyToClipboard}
                  className={cn(
                    'flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-4 border-2 border-slate-950 text-[10px] font-black uppercase tracking-widest transition-all',
                    copied
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'hover:bg-slate-950 hover:text-white',
                  )}
                >
                  {copied ? (
                    <Check className='w-4 h-4' />
                  ) : (
                    <Copy className='w-4 h-4' />
                  )}
                  {copied ? 'Captured' : 'Copy Optimized Code'}
                </button>
                <button
                  onClick={() => setResult(null)}
                  className='flex-1 lg:flex-none bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#ff4f00] transition-all'
                >
                  Terminate Session
                </button>
              </div>
            </div>

            {/* Insight Grid */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-slate-200 shadow-xl rounded-md overflow-hidden'>
              <InsightCard
                title='Security Threat'
                items={result.security}
                icon={ShieldAlert}
                color='text-red-600'
                bg='hover:bg-red-50/30'
                emptyMsg='No critical security leaks found.'
              />
              <InsightCard
                title='Logical Defects'
                items={result.bugs}
                icon={AlertTriangle}
                color='text-amber-600'
                bg='hover:bg-amber-50/30'
                emptyMsg='Logical integrity is 100%.'
              />
              <InsightCard
                title='Performance'
                items={result.performance}
                icon={Zap}
                color='text-blue-600'
                bg='hover:bg-blue-50/30'
                emptyMsg='Performance peak reached.'
              />
            </div>

            {/* Comparison Engine */}
            <div className='bg-[#020617] border border-slate-800 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)] rounded-md overflow-hidden'>
              <div className='bg-slate-900/90 p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 backdrop-blur-md'>
                <div className='flex items-center gap-4'>
                  <Cpu className='w-4 h-4 text-[#ff4f00]' />
                  <span className='text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]'>
                    Logic_Diff_Viewer
                  </span>
                </div>

                <div className='flex items-center gap-6'>
                  <button
                    onClick={() => setIsSplitView(!isSplitView)}
                    className='hidden sm:flex items-center gap-2 text-[9px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors'
                  >
                    <Layout className='w-3 h-3' />
                    {isSplitView ? 'Unified View' : 'Split View'}
                  </button>
                  <div className='flex gap-6 font-mono text-[10px] font-bold'>
                    <span className='text-red-500/80 uppercase tracking-tighter'>
                      - DEPRECATED
                    </span>
                    <span className='text-green-500 uppercase tracking-tighter'>
                      + OPTIMIZED
                    </span>
                  </div>
                </div>
              </div>

              <div className='diff-viewer-container overflow-x-auto'>
                <ReactDiffViewer
                  oldValue={code}
                  newValue={result.refactored_code}
                  splitView={isSplitView}
                  useDarkTheme={true}
                  styles={{
                    variables: {
                      dark: {
                        diffViewerBackground: 'transparent',
                        codeFoldGutterBackground: '#020617',
                        addedBackground: 'rgba(34, 197, 94, 0.08)',
                        addedGutterBackground: 'rgba(34, 197, 94, 0.12)',
                        removedBackground: 'rgba(239, 68, 68, 0.08)',
                        removedGutterBackground: 'rgba(239, 68, 68, 0.12)',
                        wordAddedBackground: 'rgba(34, 197, 94, 0.25)',
                        wordRemovedBackground: 'rgba(239, 68, 68, 0.25)',
                      },
                    },
                    contentText: {
                      fontSize: '13px',
                      lineHeight: '22px',
                      fontFamily: 'JetBrains Mono, Menlo, monospace',
                    },
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function InsightCard({ title, items, icon: Icon, color, bg, emptyMsg }: any) {
  return (
    <div
      className={cn(
        'bg-white p-10 transition-all duration-500 border-none h-full',
        bg,
      )}
    >
      <div className='flex items-center gap-4 mb-6'>
        <div className={cn('p-2 rounded-lg bg-slate-50', color)}>
          <Icon className='w-5 h-5' />
        </div>
        <span className='text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]'>
          {title}
        </span>
      </div>
      <div
        className={cn('font-bold text-[13px] leading-relaxed space-y-4', color)}
      >
        {items && items.length > 0 ? (
          items.map((item: string, i: number) => (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className='flex gap-4 group/item'
            >
              <span className='opacity-30 font-mono text-[10px] mt-1'>
                0{i + 1}
              </span>
              <p className='flex-1'>{item}</p>
            </motion.div>
          ))
        ) : (
          <div className='flex items-center gap-3 opacity-40 italic font-medium'>
            <Check className='w-4 h-4 text-slate-400' />
            <p>{emptyMsg}</p>
          </div>
        )}
      </div>
    </div>
  )
}
