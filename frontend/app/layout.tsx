import './globals.css'
import { Space_Grotesk, Inter } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
})
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'Architect // AI Code Review',
  description: 'Automated code auditing and refactoring infrastructure.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-sans bg-[#fcfcfc] text-[#0f172a]`}
      >
        {children}
      </body>
    </html>
  )
}
