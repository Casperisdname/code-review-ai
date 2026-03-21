'use client'
import { useState } from 'react'
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

  const handleReview = async () => {
    if (!code) return
    setIsAnalyzing(true)
    setError(null)

    const formData = new FormData()
    formData.append('code', code)

    try {
      // Endpoint updated to port 8001 per backend specifications
      const response = await fetch('http://localhost:8001/review', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('API_UNREACHABLE')

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(
        'System Offline: The Architect Engine (Port 8001) is not responding. Check backend status.',
      )
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const copyToClipboard = () => {
    if (result?.refactored_code) {
      navigator.clipboard.writeText(result.refactored_code)
    }
  }

  return (
    <div className='relative min-h-150'>
      <AnimatePresence mode='wait'>
        {!result ? (
          <motion.div
            key='editor'
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className='space-y-6'
          >
            {/* Input Terminal */}
            <div className='bg-[#020617] border border-slate-800 shadow-[12px_12px_0px_0px_rgba(2,6,23,0.05)]'>
              <div className='border-b border-slate-800 p-5 flex justify-between items-center bg-slate-900/40'>
                <div className='flex items-center gap-4'>
                  <Terminal className='w-4 h-4 text-[#ff4f00]' />
                  <span className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-200'>
                    Architect_Input_Stream
                  </span>
                </div>
                {isAnalyzing && (
                  <div className='flex items-center gap-3'>
                    <div className='w-1.5 h-1.5 bg-[#ff4f00] rounded-full animate-ping' />
                    <span className='text-[10px] font-black text-[#ff4f00] uppercase tracking-widest'>
                      Analyzing via GPT-4o...
                    </span>
                  </div>
                )}
              </div>
              <textarea
                className='w-full h-125 p-8 focus:outline-none font-mono text-sm leading-relaxed resize-none bg-transparent text-slate-100 placeholder:text-slate-700 border-none'
                placeholder='// PASTE SOURCE CODE FOR ANALYSIS (ALL LANGUAGES)...'
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>

            {error && (
              <div className='bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 text-red-600 text-[11px] font-black uppercase tracking-tight'>
                <AlertTriangle className='w-4 h-4 shrink-0' /> {error}
              </div>
            )}

            <button
              onClick={handleReview}
              disabled={!code || isAnalyzing}
              className='w-full bg-[#ff4f00] text-white py-6 font-space font-black uppercase tracking-[0.3em] text-sm hover:bg-black transition-all disabled:opacity-30 disabled:cursor-not-allowed group'
            >
              {isAnalyzing ? (
                <span className='flex items-center justify-center gap-3'>
                  <RotateCcw className='w-4 h-4 animate-spin' /> Processing
                  Logic...
                </span>
              ) : (
                'Execute Audit'
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key='result'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='space-y-6'
          >
            {/* Header / New Audit */}
            <div className='flex justify-between items-center bg-white border border-black/10 p-6 shadow-sm'>
              <div className='flex items-center gap-4'>
                <Check className='w-5 h-5 text-green-600' />
                <h3 className='font-space font-black uppercase text-xs tracking-[0.3em] text-slate-900'>
                  Analysis Completed
                </h3>
              </div>
              <div className='flex gap-4'>
                <button
                  onClick={copyToClipboard}
                  className='flex items-center gap-2 px-5 py-2 border border-black text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all'
                >
                  <Copy className='w-3 h-3' /> Copy Code
                </button>
                <button
                  onClick={() => setResult(null)}
                  className='bg-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#ff4f00] transition-all'
                >
                  New Session
                </button>
              </div>
            </div>

            {/* Metrics Row */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-0 bg-slate-200 border border-slate-200 shadow-sm'>
              <div className='bg-white p-6 border-r border-slate-200 group hover:bg-red-50/30 transition-colors'>
                <div className='flex items-center gap-2 mb-3'>
                  <ShieldAlert className='w-4 h-4 text-red-600' />
                  <span className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>
                    Security
                  </span>
                </div>
                <div className='text-red-600 font-bold text-[11px] leading-relaxed'>
                  {result.security.length > 0
                    ? result.security.map((s, i) => <p key={i}>• {s}</p>)
                    : 'No vulnerabilities detected.'}
                </div>
              </div>

              <div className='bg-white p-6 border-r border-slate-200 group hover:bg-amber-50/30 transition-colors'>
                <div className='flex items-center gap-2 mb-3'>
                  <AlertTriangle className='w-4 h-4 text-amber-600' />
                  <span className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>
                    Logic / Bugs
                  </span>
                </div>
                <div className='text-amber-700 font-bold text-[11px] leading-relaxed'>
                  {result.bugs.length > 0
                    ? result.bugs.map((b, i) => <p key={i}>• {b}</p>)
                    : 'Logic structure is sound.'}
                </div>
              </div>

              <div className='bg-white p-6 group hover:bg-blue-50/30 transition-colors'>
                <div className='flex items-center gap-2 mb-3'>
                  <Zap className='w-4 h-4 text-blue-600' />
                  <span className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>
                    Performance
                  </span>
                </div>
                <div className='text-blue-600 font-bold text-[11px] leading-relaxed'>
                  {result.performance.length > 0
                    ? result.performance.map((p, i) => <p key={i}>• {p}</p>)
                    : 'Optimization optimal.'}
                </div>
              </div>
            </div>

            {/* Code Comparison */}
            <div className='bg-[#020617] border border-slate-800 shadow-2xl overflow-hidden'>
              <div className='bg-slate-900/50 p-4 border-b border-slate-800 flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <Cpu className='w-3 h-3 text-slate-500' />
                  <span className='text-[9px] font-black text-slate-500 uppercase tracking-widest'>
                    Architect_Diff_Engine
                  </span>
                </div>
                <div className='flex gap-6 font-mono text-[9px] font-bold uppercase'>
                  <span className='text-red-500/80'>--- Original</span>
                  <span className='text-green-500'>+++ Refactored</span>
                </div>
              </div>
              <ReactDiffViewer
                oldValue={code}
                newValue={result.refactored_code}
                splitView={true}
                useDarkTheme={true}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
