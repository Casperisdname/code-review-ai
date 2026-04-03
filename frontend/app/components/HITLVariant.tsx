'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
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
  FileCode,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactDiffViewer from 'react-diff-viewer-continued'
import { cn } from '@/lib/utils'

/**
 * Interfaces for Type Safety
 */
interface ReviewResult {
  bugs: string[]
  security: string[]
  performance: string[]
  refactored_code: string
  error?: string
}

interface InsightCardProps {
  title: string
  items: string[]
  icon: React.ElementType
  color: string
}

export default function CodeReviewHITL() {
  const [code, setCode] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedType, setCopiedType] = useState<'refactor' | 'original' | null>(
    null,
  )
  const [isSplitView, setIsSplitView] = useState(true)

  // Stable Audit Reference
  const auditRef = useMemo(
    () =>
      result ? Math.random().toString(36).substring(2, 8).toUpperCase() : null,
    [result],
  )

  // Responsive layout adjustment
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSplitView(false)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const hasIssues = useMemo(() => {
    if (!result) return false
    return (result.bugs?.length || 0) > 0 || (result.security?.length || 0) > 0
  }, [result])

  /**
   * API Handler
   */
  const handleReview = async () => {
    if (!code.trim()) return

    setIsAnalyzing(true)
    setError(null)

    const payload = new FormData()
    payload.append('code', code)

    try {
      const response = await fetch(
        'https://code-review-backend-egjh.onrender.com/review',
        {
          method: 'POST',
          body: payload,
        },
      )

      if (!response.ok) {
        const errorMsg =
          response.status === 502
            ? 'Engine is initializing. Please retry in 20 seconds.'
            : `Server Error: ${response.status}`
        throw new Error(errorMsg)
      }

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Check your connection or backend status.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCopy = useCallback(
    (text: string, type: 'refactor' | 'original') => {
      if (!text) return
      navigator.clipboard.writeText(text)
      setCopiedType(type)
      setTimeout(() => setCopiedType(null), 2000)
    },
    [],
  )

  return (
    <div className='relative w-full max-w-7xl mx-auto min-h-[600px] font-sans pb-20'>
      <AnimatePresence mode='wait'>
        {!result ? (
          <motion.div
            key='editor'
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className='space-y-6'
          >
            {/* Main Input Area */}
            <div className='group relative bg-[#020617] border border-slate-800 shadow-2xl rounded-md overflow-hidden'>
              {isAnalyzing && (
                <motion.div
                  initial={{ top: 0 }}
                  animate={{ top: '100%' }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className='absolute left-0 right-0 h-[2px] bg-[#ff4f00] shadow-[0_0_20px_#ff4f00] z-20'
                />
              )}

              <div className='border-b border-slate-800 p-4 flex justify-between items-center bg-slate-900/40 backdrop-blur-md'>
                <div className='flex items-center gap-3'>
                  <Terminal className='w-4 h-4 text-[#ff4f00]' />
                  <span className='text-[10px] font-bold uppercase tracking-widest text-slate-400'>
                    Source_Input
                  </span>
                </div>
                {isAnalyzing && (
                  <span className='text-[10px] text-[#ff4f00] animate-pulse font-bold uppercase'>
                    Processing Logic...
                  </span>
                )}
              </div>

              <textarea
                className='w-full h-[500px] p-8 focus:outline-none font-mono text-sm leading-relaxed resize-none bg-transparent text-slate-300 placeholder:text-slate-700 selection:bg-[#ff4f00]/40 custom-scrollbar'
                placeholder='// Paste your code here for architectural audit...'
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                disabled={isAnalyzing}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='bg-red-500/10 border-l-4 border-red-600 p-4 flex items-center gap-4 text-red-200 text-xs font-medium uppercase'
              >
                <AlertTriangle className='w-4 h-4 text-red-500' /> {error}
              </motion.div>
            )}

            <button
              onClick={handleReview}
              disabled={!code.trim() || isAnalyzing}
              className={cn(
                'w-full py-10 font-bold uppercase tracking-[0.3em] text-[11px] transition-all rounded-md flex items-center justify-center gap-4 border',
                isAnalyzing
                  ? 'bg-slate-900 border-slate-800 text-slate-600'
                  : 'bg-[#ff4f00] border-[#ff4f00] text-white hover:bg-white hover:text-black hover:shadow-2xl shadow-lg shadow-[#ff4f00]/10',
              )}
            >
              {isAnalyzing ? (
                <>
                  <RotateCcw className='w-4 h-4 animate-spin' /> Running
                  Analysis
                </>
              ) : (
                <>
                  Execute Audit <ChevronRight className='w-4 h-4' />
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key='result'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='space-y-6'
          >
            {/* Header / Summary Bar */}
            <div className='flex flex-col lg:flex-row bg-white border border-slate-200 shadow-xl rounded-md'>
              <div className='p-6 lg:p-8 flex items-center gap-6 flex-1'>
                <div
                  className={cn(
                    'w-14 h-14 flex items-center justify-center rounded-full',
                    hasIssues
                      ? 'bg-red-50 text-red-600'
                      : 'bg-green-50 text-green-600',
                  )}
                >
                  {hasIssues ? (
                    <ShieldAlert className='w-7 h-7' />
                  ) : (
                    <Check className='w-7 h-7' />
                  )}
                </div>
                <div>
                  <h3 className='font-black uppercase text-base tracking-tight text-slate-950'>
                    {hasIssues
                      ? 'Vulnerabilities Detected'
                      : 'Clean Architecture Verified'}
                  </h3>
                  <p className='text-[10px] text-slate-400 font-mono'>
                    REPORT_ID: {auditRef}
                  </p>
                </div>
              </div>

              <div className='p-4 bg-slate-50 flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-200'>
                <button
                  onClick={() => handleCopy(result.refactored_code, 'refactor')}
                  className={cn(
                    'px-6 py-3 border-2 border-slate-950 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm flex items-center gap-2',
                    copiedType === 'refactor'
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'hover:bg-slate-950 hover:text-white',
                  )}
                >
                  {copiedType === 'refactor' ? (
                    <Check className='w-3 h-3' />
                  ) : (
                    <Copy className='w-3 h-3' />
                  )}
                  {copiedType === 'refactor' ? 'Copied' : 'Refactor'}
                </button>
                <button
                  onClick={() => setResult(null)}
                  className='bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#ff4f00] transition-colors rounded-sm'
                >
                  New Audit
                </button>
              </div>
            </div>

            {/* Insight Grid */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-md overflow-hidden'>
              <InsightCard
                title='Security'
                items={result.security}
                icon={ShieldAlert}
                color='text-red-600'
              />
              <InsightCard
                title='Core Logic'
                items={result.bugs}
                icon={AlertTriangle}
                color='text-amber-600'
              />
              <InsightCard
                title='Performance'
                items={result.performance}
                icon={Zap}
                color='text-blue-600'
              />
            </div>

            {/* Diff Engine View */}
            <div className='bg-[#020617] border border-slate-800 rounded-md overflow-hidden shadow-2xl'>
              <div className='bg-slate-900/90 p-4 border-b border-slate-800 flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                  <Cpu className='w-4 h-4 text-[#ff4f00]' />
                  <span className='text-[10px] font-black text-slate-400 uppercase tracking-tighter'>
                    Architect_Comparison_Engine
                  </span>
                </div>
                <div className='flex items-center gap-4'>
                  <button
                    onClick={() => handleCopy(code, 'original')}
                    className='text-[9px] font-bold text-slate-500 hover:text-white flex items-center gap-1.5 transition-colors uppercase'
                  >
                    <FileCode className='w-3 h-3' />
                    {copiedType === 'original' ? 'Saved' : 'Copy Original'}
                  </button>
                  <button
                    onClick={() => setIsSplitView(!isSplitView)}
                    className='hidden md:flex items-center gap-2 text-[9px] font-bold text-slate-500 hover:text-white uppercase transition-colors'
                  >
                    <Layout className='w-3 h-3' />
                    {isSplitView ? 'Unified' : 'Split View'}
                  </button>
                </div>
              </div>
              <ReactDiffViewer
                oldValue={code}
                newValue={result.refactored_code || ''}
                splitView={isSplitView}
                useDarkTheme={true}
                styles={{
                  variables: {
                    dark: {
                      diffViewerBackground: '#020617',
                      addedBackground: '#064e3b',
                      removedBackground: '#450a0a',
                    },
                  },
                  contentText: { fontSize: '13px', lineHeight: '1.6' },
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Professional Sub-component for Findings
 */
function InsightCard({ title, items, icon: Icon, color }: InsightCardProps) {
  return (
    <div className='p-6 bg-white hover:bg-slate-50/80 transition-all group'>
      <div className='flex items-center gap-3 mb-5'>
        <div
          className={cn(
            'p-2 rounded-lg bg-slate-50 group-hover:bg-white transition-colors',
          )}
        >
          <Icon className={cn('w-4 h-4', color)} />
        </div>
        <span className='text-[11px] font-black text-slate-500 uppercase tracking-[0.1em]'>
          {title}
        </span>
      </div>
      <div className='space-y-4'>
        {items?.length > 0 ? (
          items.map((item, i) => (
            <div
              key={i}
              className='flex gap-4 text-[13px] text-slate-700 leading-relaxed group/item'
            >
              <span className='text-[10px] font-mono text-slate-300 mt-1 font-bold'>
                {(i + 1).toString().padStart(2, '0')}
              </span>
              <p className='group-hover/item:text-slate-950 transition-colors'>
                {item}
              </p>
            </div>
          ))
        ) : (
          <div className='py-2 flex items-center gap-2'>
            <Check className='w-3 h-3 text-green-500' />
            <p className='text-[11px] font-medium italic text-slate-400 uppercase'>
              Optimization Targets: 0
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
