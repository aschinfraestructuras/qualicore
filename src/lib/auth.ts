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
        return authData
      } else {
        throw new Error('Credenciais inválidas')
      }
    } catch (error: any) {
      console.error('Erro no login:', error)
      throw new Error(error.message || 'Erro ao fazer login')
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
      
      // Fazer login automaticamente após registo
      await this.login({
        email: data.email,
        password: data.password
      })
      
      return record
    } catch (error: any) {
      console.error('Erro no registo:', error)
      throw new Error(error.message || 'Erro ao registar')
    }
  },

  // Logout
  logout() {
    pb.authStore.clear()
    localStorage.removeItem('pocketbase_auth')
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
      return true
    } catch (error: any) {
      console.error('Erro no reset password:', error)
      throw new Error(error.message || 'Erro ao resetar password')
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