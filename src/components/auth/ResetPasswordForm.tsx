import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, AlertCircle, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { authService } from '@/lib/auth'
import toast from 'react-hot-toast'

const resetSchema = z.object({
  email: z.string().email('Email inválido'),
})

type ResetFormData = z.infer<typeof resetSchema>

interface ResetPasswordFormProps {
  onSwitchToLogin: () => void
}

export default function ResetPasswordForm({ onSwitchToLogin }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (data: ResetFormData) => {
    setIsLoading(true)
    try {
      await authService.requestPasswordReset(data.email)
      setIsSuccess(true)
      toast.success('Email de reset enviado com sucesso!')
    } catch (error) {
      console.error('Erro ao solicitar reset:', error)
      setError('root', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Erro ao solicitar reset'
      })
      toast.error('Falha ao solicitar reset de senha')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto text-center"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 font-display mb-4">
          Email Enviado!
        </h2>
        
        <p className="text-gray-600 mb-6">
          Enviámos um link para redefinir a sua senha. 
          Verifique a sua caixa de entrada e siga as instruções.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={onSwitchToLogin}
            className="btn btn-primary w-full"
          >
            Voltar ao Login
          </button>
          
          <button
            onClick={() => setIsSuccess(false)}
            className="btn btn-secondary w-full"
          >
            Enviar Novamente
          </button>
        </div>
      </motion.div>
    )
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
          Redefinir Senha
        </h2>
        <p className="text-gray-600">
          Introduza o seu email para receber instruções de reset
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
              disabled={isLoading}
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
          disabled={isLoading}
          className="btn btn-primary w-full h-12 text-base font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar Email de Reset'
          )}
        </button>

        {/* Link para login */}
        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="flex items-center justify-center text-primary-600 hover:text-primary-700 font-medium transition-colors mx-auto"
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Login
          </button>
        </div>
      </form>
    </motion.div>
  )
} 