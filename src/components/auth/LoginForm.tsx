import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/auth'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSuccess: () => void
  onSwitchToRegister: () => void
  onSwitchToReset: () => void
}

export default function LoginForm({ onSuccess, onSwitchToRegister, onSwitchToReset }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, loading } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: any) => {
    // Garantir que email e password estão definidos
    if (!data.email || !data.password) {
      toast.error('Preencha o email e a password.');
      return;
    }
    
    const result = await signIn(data.email, data.password)
    if (result.success) {
      toast.success('Login efetuado com sucesso!')
      onSuccess()
    } else {
      toast.error(result.error || 'Erro ao fazer login')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 font-display mb-2">
          Bem-vindo de volta
        </h2>
        <p className="text-gray-600">
          Entre na sua conta para aceder ao sistema
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              {...register('email')}
              type="email"
              id="email"
              className="input pl-10 w-full"
              placeholder="seu@email.com"
              disabled={loading}
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-sm text-red-600 mt-1"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="input pl-10 pr-10 w-full"
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-sm text-red-600 mt-1"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.password.message}
            </motion.p>
          )}
        </div>

        {/* Error geral */}
        {errors.root && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
          >
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            {errors.root.message}
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full h-12 text-base font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </button>

        {/* Links */}
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={onSwitchToReset}
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            disabled={loading}
          >
            Esqueceu a senha?
          </button>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            disabled={loading}
          >
            Criar conta
          </button>
        </div>
      </form>

      {/* Demo credentials */}
      <div className="mt-8 p-4 bg-gray-50 rounded-xl">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Credenciais de Demo:</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Admin:</strong> admin@qualicore.pt / admin123</p>
          <p><strong>Qualidade:</strong> qualidade@qualicore.pt / qualidade123</p>
          <p><strong>Produção:</strong> producao@qualicore.pt / producao123</p>
        </div>
      </div>
    </motion.div>
  )
} 