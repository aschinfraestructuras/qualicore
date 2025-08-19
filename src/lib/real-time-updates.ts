export class RealTimeUpdates {
  private static updateInterval: NodeJS.Timeout | null = null;
  private static listeners: Map<string, Function[]> = new Map();
  private static lastUpdate: Date = new Date();

  // Configurar atualizações automáticas
  static setupAutoRefresh(intervalMs: number = 30000) {
    this.updateInterval = setInterval(() => {
      this.checkForUpdates();
    }, intervalMs);
  }

  // Verificar atualizações
  private static async checkForUpdates() {
    try {
      // Simular verificação de atualizações
      const hasUpdates = await this.checkDatabaseUpdates();
      
      if (hasUpdates) {
        this.notifyListeners('data-updated');
        this.lastUpdate = new Date();
      }
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
    }
  }

  // Verificar atualizações na base de dados
  private static async checkDatabaseUpdates(): Promise<boolean> {
    try {
      const { supabase } = await import('./supabase');
      
      // Verificar última atualização
      const { data, error } = await supabase
        .from('system_updates')
        .select('last_update')
        .single();

      if (error) {
        // Se não existir tabela, criar
        await this.createSystemUpdatesTable();
        return false;
      }

      const lastDbUpdate = new Date(data.last_update);
      return lastDbUpdate > this.lastUpdate;
    } catch (error) {
      console.error('Erro ao verificar DB:', error);
      return false;
    }
  }

  // Criar tabela de atualizações do sistema
  private static async createSystemUpdatesTable() {
    try {
      const { supabase } = await import('./supabase');
      
      await supabase.rpc('create_system_updates_table', {
        sql: `
          CREATE TABLE IF NOT EXISTS system_updates (
            id SERIAL PRIMARY KEY,
            last_update TIMESTAMP DEFAULT NOW(),
            update_type VARCHAR(50),
            description TEXT
          );
        `
      });
    } catch (error) {
      console.error('Erro ao criar tabela:', error);
    }
  }

  // Adicionar listener para atualizações
  static addListener(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // Remover listener
  static removeListener(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Notificar listeners
  private static notifyListeners(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Erro no listener:', error);
        }
      });
    }
  }

  // Forçar atualização
  static forceUpdate() {
    this.notifyListeners('force-update');
    this.lastUpdate = new Date();
  }

  // Parar atualizações automáticas
  static stopAutoRefresh() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Obter última atualização
  static getLastUpdate(): Date {
    return this.lastUpdate;
  }

  // Verificar se há atualizações pendentes
  static async hasPendingUpdates(): Promise<boolean> {
    return await this.checkDatabaseUpdates();
  }
}
