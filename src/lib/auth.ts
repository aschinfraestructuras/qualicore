import { pb } from './pocketbase'
import { User } from '@/types'

export interface AuthUser {
  id: string
  email: string
  nome: string
  perfil: 'admin' | 'qualidade' | 'producao' | 'fiscal'
  avatar?: string
  verified: boolean
  created: string
  updated: string
}

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

// Usuários mock para desenvolvimento
const mockUsers: AuthUser[] = [
  {
    id: '1',
    email: 'admin@qualicore.pt',
    nome: 'Administrador',
    perfil: 'admin',
    verified: true,
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  },
  {
    id: '2',
    email: 'qualidade@qualicore.pt',
    nome: 'Engenheiro de Qualidade',
    perfil: 'qualidade',
    verified: true,
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  },
  {
    id: '3',
    email: 'producao@qualicore.pt',
    nome: 'Responsável de Produção',
    perfil: 'producao',
    verified: true,
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  },
  {
    id: '4',
    email: 'fiscal@qualicore.pt',
    nome: 'Fiscal de Obra',
    perfil: 'fiscal',
    verified: true,
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  }
]

// Senhas mock (em produção, usar hash)
const mockPasswords = {
  'admin@qualicore.pt': 'admin123',
  'qualidade@qualicore.pt': 'qualidade123',
  'producao@qualicore.pt': 'producao123',
  'fiscal@qualicore.pt': 'fiscal123'
}

class AuthService {
  private currentUser: AuthUser | null = null
  private authChangeCallbacks: ((user: AuthUser | null) => void)[] = []

  constructor() {
    // Verificar se há uma sessão ativa no localStorage
    this.checkAuthFromStorage()
  }

  private checkAuthFromStorage() {
    const storedUser = localStorage.getItem('qualicore_user')
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser)
        this.notifyAuthChange(this.currentUser)
      } catch (error) {
        console.error('Erro ao carregar usuário do storage:', error)
        localStorage.removeItem('qualicore_user')
      }
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      // Verificar se é um usuário mock
      const mockPassword = mockPasswords[credentials.email as keyof typeof mockPasswords]
      
      if (mockPassword && credentials.password === mockPassword) {
        const user = mockUsers.find(u => u.email === credentials.email)
        if (user) {
          this.currentUser = user
          localStorage.setItem('qualicore_user', JSON.stringify(user))
          this.notifyAuthChange(user)
          return user
        }
      }

      // Tentar login real com PocketBase (se disponível)
      try {
        const authData = await pb.collection('users').authWithPassword(
          credentials.email,
          credentials.password
        )
        
        if (authData.record) {
          const user = await this.getCurrentUser()
          this.currentUser = user
          localStorage.setItem('qualicore_user', JSON.stringify(user))
          this.notifyAuthChange(user)
          return user
        }
      } catch (pbError) {
        console.log('PocketBase não disponível, usando mock users')
      }

      throw new Error('Credenciais inválidas')
    } catch (error) {
      console.error('Erro no login:', error)
      throw new Error('Falha na autenticação. Verifique suas credenciais.')
    }
  }

  async register(data: RegisterData): Promise<AuthUser> {
    try {
      // Para desenvolvimento, criar usuário mock
      const newUser: AuthUser = {
        id: Date.now().toString(),
        email: data.email,
        nome: data.nome,
        perfil: data.perfil,
        verified: true,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }

      // Adicionar às listas mock
      mockUsers.push(newUser)
      mockPasswords[data.email as keyof typeof mockPasswords] = data.password

      // Fazer login automaticamente
      this.currentUser = newUser
      localStorage.setItem('qualicore_user', JSON.stringify(newUser))
      this.notifyAuthChange(newUser)

      return newUser
    } catch (error) {
      console.error('Erro no registro:', error)
      throw new Error('Falha no registro. Verifique os dados fornecidos.')
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null
    localStorage.removeItem('qualicore_user')
    this.notifyAuthChange(null)
    
    // Tentar logout do PocketBase se disponível
    try {
      pb.authStore.clear()
    } catch (error) {
      console.log('PocketBase não disponível para logout')
    }
  }

  async getCurrentUser(): Promise<AuthUser> {
    if (!this.currentUser) {
      throw new Error('Usuário não autenticado')
    }
    return this.currentUser
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null
  }

  getUser(): AuthUser | null {
    return this.currentUser
  }

  hasPermission(permission: string): boolean {
    if (!this.currentUser) return false
    
    // Permissões baseadas no perfil
    const permissions = {
      admin: ['*'], // Admin tem todas as permissões
      qualidade: ['dashboard', 'ensaios', 'checklists', 'materiais', 'fornecedores', 'nao-conformidades', 'documentos', 'relatorios'],
      producao: ['dashboard', 'materiais', 'fornecedores', 'checklists'],
      fiscal: ['dashboard', 'ensaios', 'checklists', 'documentos', 'relatorios']
    }

    const userPermissions = permissions[this.currentUser.perfil] || []
    return userPermissions.includes('*') || userPermissions.includes(permission)
  }

  onAuthChange(callback: (user: AuthUser | null) => void): () => void {
    this.authChangeCallbacks.push(callback)
    
    // Retornar função para remover o callback
    return () => {
      const index = this.authChangeCallbacks.indexOf(callback)
      if (index > -1) {
        this.authChangeCallbacks.splice(index, 1)
      }
    }
  }

  private notifyAuthChange(user: AuthUser | null) {
    this.authChangeCallbacks.forEach(callback => callback(user))
  }

  // Métodos para recuperação de senha (mock)
  async requestPasswordReset(email: string): Promise<void> {
    // Simular envio de email
    console.log(`Email de reset enviado para: ${email}`)
  }

  async confirmPasswordReset(token: string, password: string, passwordConfirm: string): Promise<void> {
    // Simular confirmação
    console.log('Reset de senha confirmado')
  }

  // Métodos para verificação de email (mock)
  async requestEmailVerification(email: string): Promise<void> {
    // Simular envio de email
    console.log(`Email de verificação enviado para: ${email}`)
  }

  async confirmEmailVerification(token: string): Promise<void> {
    // Simular confirmação
    console.log('Email verificado')
  }
}

export const authService = new AuthService() 