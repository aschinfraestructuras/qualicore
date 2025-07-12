import { ReactNode } from 'react'
import Navbar from './Navbar'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex flex-col">
      <Navbar />
      <Header />
      <main className="flex-1 pt-20 px-8 pb-8 w-full max-w-7xl mx-auto" style={{ marginTop: '160px' }}>
        {children}
      </main>
    </div>
  )
} 