import { pb } from './pocketbase'
import toast from 'react-hot-toast'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  passwordConfirm: string
  nome: string
  perfil: 'qualidade' | 'producao' | 'fiscal'
}

// Sistema de autenticação com PocketBase online
export const auth = {
  // Login com PocketBase
  async login(credentials: LoginCredentials) {
    try {
      const authData = await pb.collection('users').authWithPassword(
        credentials.email,
        credentials.password
      )
      
      if (pb.authStore.isValid) {
        toast.success('Login realizado com sucesso!')
        return authData
      } else {
        throw new Error('Credenciais inválidas')
      }
    } catch (error: any) {
      // Tratar erros específicos do PocketBase
      if (error?.status === 400) {
        throw new Error('Email ou palavra-passe incorretos')
      } else if (error?.status === 401) {
        throw new Error('Credenciais inválidas')
      } else {
        throw new Error('Erro desconhecido')
      }
    }
  },

  // Registo com PocketBase
  async register(data: RegisterData) {
    try {
      const record = await pb.collection('users').create({
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        nome: data.nome,
        perfil: data.perfil
      })
      
      toast.success('Registo realizado com sucesso!')
      
      // Fazer login automaticamente após registo
      await this.login({
        email: data.email,
        password: data.password
      })
      
      return record
    } catch (error: any) {
      // Tratar erros específicos do PocketBase
      if (error?.data?.email?.code === 'validation_invalid_email') {
        throw new Error('Email inválido')
      } else if (error?.data?.password?.code === 'validation_min_length') {
        throw new Error('A palavra-passe deve ter pelo menos 8 caracteres')
      } else if (error?.data?.email?.code === 'validation_invalid_duplicate') {
        throw new Error('Este email já está registado')
      } else {
        throw new Error('Erro desconhecido')
      }
    }
  },

  // Logout
  logout() {
    pb.authStore.clear()
    localStorage.removeItem('pocketbase_auth')
    toast.success('Logout realizado com sucesso!')
  },

  // Verificar se está autenticado
  isAuthenticated() {
    return pb.authStore.isValid
  },

  // Obter utilizador atual
  getCurrentUser() {
    return pb.authStore.model
  },

  // Reset password
  async resetPassword(email: string) {
    try {
      await pb.collection('users').requestPasswordReset(email)
      toast.success('Email de reset enviado com sucesso!')
      return true
    } catch (error: any) {
      if (error?.data?.email?.code === 'validation_invalid_email') {
        throw new Error('Email inválido')
      } else if (error?.status === 404) {
        throw new Error('Utilizador não encontrado')
      } else {
        throw new Error('Erro desconhecido')
      }
    }
  }
}

// Exportar funções individuais para compatibilidade
export const login = auth.login
export const register = auth.register
export const logout = auth.logout
export const isAuthenticated = auth.isAuthenticated
export const getCurrentUser = auth.getCurrentUser
export const resetPassword = auth.resetPassword 