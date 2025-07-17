import { documentosAPI, ensaiosAPI, naoConformidadesAPI } from "@/lib/supabase-api";
import toast from "react-hot-toast";

export interface Notification {
  id: string;
  type: 'urgent' | 'high' | 'medium' | 'low';
  category: 'document' | 'test' | 'nc system';
  title: string;
  message: string;
  action?: {
    label: string;
    url: string;
  };
  timestamp: Date;
  read: boolean;
  relatedItem?: {
    type: string;
    id: string;
  };
}

class NotificationService {
  private notifications: Notification[] = [];
  private checkInterval: NodeJS.Timeout | null = null;

  // Iniciar verificações automáticas
  startAutoChecks() {
    if (this.checkInterval) return;
    
    this.checkInterval = setInterval(() => {
      this.checkExpiredDocuments();
      this.checkPendingTests();
      this.checkCriticalNCs();
    }, 5 * 60 * 1000); // Verificar a cada 5 minutos
  }

  // Parar verificações automáticas
  stopAutoChecks() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Verificar documentos vencidos
  async checkExpiredDocuments() {
    try {
      const documents = await documentosAPI.getAll();
      const expired = documents.filter(doc => 
        doc.data_validade && new Date(doc.data_validade) < new Date()
      );
      
      expired.forEach(doc => {
        this.createNotification({
          type: 'urgent',
          category: 'document',
          title: 'Documento Vencido',
          message: `O documento "${doc.codigo}" está vencido desde ${new Date(doc.data_validade).toLocaleDateString()}`,
          action: {
            label: 'Ver Documento',
            url: `/documentos/${doc.id}`
          },
          relatedItem: { type: 'document', id: doc.id }
        });
      });
    } catch (error) {
      console.error('Erro ao verificar documentos vencidos:', error);
    }
  }

  // Verificar ensaios pendentes
  async checkPendingTests() {
    try {
      const tests = await ensaiosAPI.getAll();
      const pending = tests.filter(test => 
        test.estado === 'pendente' &&
        test.data_ensaio && 
        new Date(test.data_ensaio) < new Date()
      );
      
      pending.forEach(test => {
        this.createNotification({
          type: 'high',
          category: 'test',
          title: 'Ensaio Pendente',
          message: `O ensaio "${test.tipo}" estava agendado para ${new Date(test.data_ensaio).toLocaleDateString()}`,
          action: {
            label: 'Ver Ensaio',
            url: `/ensaios/${test.id}`
          },
          relatedItem: { type: 'test', id: test.id }
        });
      });
    } catch (error) {
      console.error('Erro ao verificar ensaios pendentes:', error);
    }
  }

  // Verificar não conformidades críticas
  async checkCriticalNCs() {
    try {
      const ncs = await naoConformidadesAPI.getAll();
      const critical = ncs.filter(nc => 
        nc.severidade === 'critica'
        // && nc.estado === 'pendente' // Temporariamente comentado
      );
      
      critical.forEach(nc => {
        this.createNotification({
          type: 'urgent',
          category: 'nc system',
          title: 'Não Conformidade Crítica',
          message: `NC crítica pendente: ${nc.descricao.substring(0, 100)}...`,
          action: {
            label: 'Ver NC',
            url: `/nao-conformidades/${nc.id}`
          },
          relatedItem: { type: 'nc', id: nc.id }
        });
      });
    } catch (error) {
      console.error('Erro ao verificar NCs críticas:', error);
    }
  }

  // Criar notificação
  createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    
    // Mostrar toast baseado na prioridade
    switch (notification.type) {
      case 'urgent':
        toast.error(notification.message, {
          duration: 8000,
          icon: '🚨'
        });
        break;
      case 'high':
        toast(notification.message, {
          duration: 6000,
          icon: '⚠️'
        });
        break;
      case 'medium':
        toast(notification.message, {
          duration: 4000,
          icon: 'ℹ️'
        });
        break;
      case 'low':
        toast.success(notification.message, {
          duration: 3000
        });
        break;
    }

    // Salvar no localStorage
    this.saveNotifications();
  }

  // Obter todas as notificações
  getNotifications(): Notification[] {
    return this.notifications;
  }

  // Obter notificações não lidas
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }

  // Marcar como lida
  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  // Marcar todas como lidas
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
  }

  // Limpar notificações antigas (mais de 30 dias)
  clearOldNotifications() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    this.notifications = this.notifications.filter(n => 
      n.timestamp > thirtyDaysAgo
    );
    this.saveNotifications();
  }

  // Salvar no localStorage
  private saveNotifications() {
    try {
      localStorage.setItem('qualicore_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  }

  // Carregar do localStorage
  loadNotifications() {
    try {
      const saved = localStorage.getItem('qualicore_notifications');
      if (saved) {
        this.notifications = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  }

  // Obter contagem de não lidas
  getUnreadCount(): number {
    return this.getUnreadNotifications().length;
  }

  // Verificação manual (para testes)
  async runManualCheck() {
    await this.checkExpiredDocuments();
    await this.checkPendingTests();
    await this.checkCriticalNCs();
    toast.success('Verificação de notificações concluída');
  }
}

// Instância global
export const notificationService = new NotificationService();

// Inicializar
notificationService.loadNotifications();
notificationService.startAutoChecks();
notificationService.clearOldNotifications(); 