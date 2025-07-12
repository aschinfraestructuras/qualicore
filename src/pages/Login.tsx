import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Shield, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

type AuthMode = 'login' | 'register' | 'reset'

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('login')
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const handleLoginSuccess = () => {
    navigate(from, { replace: true })
  }

  const handleSwitchToRegister = () => setMode('register')
  const handleSwitchToLogin = () => setMode('login')
  const handleSwitchToReset = () => setMode('reset')

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center shadow-glow border border-white/30">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold font-display mb-4 tracking-tight">
            Qualicore
          </h1>
          
          <p className="text-xl lg:text-2xl text-blue-100 mb-6 font-light">
            Gestão da Qualidade para Construção Civil
          </p>
          
          <div className="space-y-4 text-blue-100">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Sistema de Gestão da Qualidade</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Controlo de Ensaios e Materiais</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Gestão de Não Conformidades</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Relatórios em Tempo Real</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Back to home button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </motion.button>

          {/* Auth Forms */}
          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <LoginForm
                  onSuccess={handleLoginSuccess}
                  onSwitchToRegister={handleSwitchToRegister}
                  onSwitchToReset={handleSwitchToReset}
                />
              </motion.div>
            )}

            {mode === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RegisterForm
                  onSuccess={handleLoginSuccess}
                  onSwitchToLogin={handleSwitchToLogin}
                />
              </motion.div>
            )}

            {mode === 'reset' && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ResetPasswordForm
                  onSwitchToLogin={handleSwitchToLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
} 