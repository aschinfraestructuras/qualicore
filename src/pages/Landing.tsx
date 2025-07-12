import { useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-300 rounded-full opacity-30 blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse" />
      <motion.div 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7 }}
        className="z-10 flex flex-col items-center"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-glow border-2 border-white/40">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <span className="text-4xl font-extrabold text-blue-900 font-display tracking-wide drop-shadow-lg">Qualicore</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2 text-center">Gestão da Qualidade para Construção Civil</h2>
        <p className="text-lg text-blue-700 mb-8 text-center max-w-xl">Modernize o controlo de qualidade da sua obra com tecnologia de ponta, formulários inteligentes e dashboards em tempo real.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="btn btn-primary btn-lg text-lg px-8 py-3 shadow-glow hover:scale-105 transition-all"
            onClick={() => navigate('/login')}
          >
            Entrar no Sistema
          </button>
          <button
            className="btn btn-outline btn-lg text-lg px-8 py-3 hover:scale-105 transition-all"
            onClick={() => navigate('/dashboard')}
          >
            Ver Demo
          </button>
        </div>
        <div className="mt-12 text-blue-900/80 text-sm font-medium flex flex-col items-center">
          <span>Desenvolvido por</span>
          <span className="text-lg font-bold tracking-wide">José Antunes</span>
        </div>
      </motion.div>
    </div>
  )
} 