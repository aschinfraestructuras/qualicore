import { create } from 'zustand'
import { User, Notification } from '@/types'

interface AppState {
  user: User | null
  currentModule: string
  sidebarOpen: boolean
  notifications: Notification[]
  setUser: (user: User | null) => void
  setCurrentModule: (module: string) => void
  toggleSidebar: () => void
  addNotification: (notification: Omit<Notification, 'id' | 'data' | 'lida'>) => void
  removeNotification: (id: string) => void
  markNotificationAsRead: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    id: '1',
    nome: 'José Antunes',
    email: 'jose.antunes@qualicore.pt',
    perfil: 'qualidade',
    avatar: '/avatars/joao.jpg'
  },
  currentModule: 'dashboard',
  sidebarOpen: true,
  notifications: [
    {
      id: '1',
      tipo: 'warning',
      titulo: 'Ensaio Não Conforme',
      mensagem: 'Ensaio de resistência do betão não atingiu valores esperados',
      data: new Date().toISOString(),
      lida: false
    },
    {
      id: '2',
      tipo: 'info',
      titulo: 'Nova Não Conformidade',
      mensagem: 'Nova NC registada na zona A - Fundações',
      data: new Date(Date.now() - 3600000).toISOString(),
      lida: true
    }
  ],
  setUser: (user) => set({ user }),
  setCurrentModule: (module) => set({ currentModule: module }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  addNotification: (notification) => set((state) => ({
    notifications: [
      {
        ...notification,
        id: Date.now().toString(),
        data: new Date().toISOString(),
        lida: false
      },
      ...state.notifications
    ]
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, lida: true } : n
    )
  }))
})) 