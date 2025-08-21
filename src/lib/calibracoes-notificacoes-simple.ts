import { supabase } from './supabase';
import toast from 'react-hot-toast';

// Tipos de notificações
export interface CalibracaoNotificacao {
  id: string;
  tipo: 'CALIBRACAO_VENCIDA' | 'CALIBRACAO_PROXIMA' | 'MANUTENCAO_PENDENTE' | 'EQUIPAMENTO_CRITICO' | 'AUDITORIA_PROXIMA' | 'CERTIFICACAO_VENCIDA';
  titulo: string;
  mensagem: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  equipamento_id?: string;
  calibracao_id?: string;
  manutencao_id?: string;
  data_criacao: string;
  lida: boolean;
  acao?: string;
  dados?: any;
}

// Configuração do sistema
export interface CalibracoesNotificacoesConfig {
  ativo: boolean;
  inApp: boolean;
  email: boolean;
  push: boolean;
  intervalos: {
    calibracao_proxima: number; // dias antes
    manutencao_pendente: number;
    auditoria_proxima: number;
  };
}

// Configuração padrão
const DEFAULT_CONFIG: CalibracoesNotificacoesConfig = {
  ativo: true,
  inApp: true,
  email: false,
  push: false,
  intervalos: {
    calibracao_proxima: 30,
    manutencao_pendente: 7,
    auditoria_proxima: 14
  }
};

class CalibracoesNotificacoesService {
  private config: CalibracoesNotificacoesConfig;
  private notificacoes: CalibracaoNotificacao[] = [];
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.config = this.loadConfig();
    this.notificacoes = this.loadNotificacoes();
    this.startPeriodicChecks();
  }

  // Carregar configuração do localStorage
  private loadConfig(): CalibracoesNotificacoesConfig {
    try {
      const saved = localStorage.getItem('calibracoes_notificacoes_config');
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  // Salvar configuração no localStorage
  private saveConfig(): void {
    try {
      localStorage.setItem('calibracoes_notificacoes_config', JSON.stringify(this.config));
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    }
  }

  // Carregar notificações do localStorage
  private loadNotificacoes(): CalibracaoNotificacao[] {
    try {
      const saved = localStorage.getItem('calibracoes_notificacoes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  // Salvar notificações no localStorage
  private saveNotificacoes(): void {
    try {
      localStorage.setItem('calibracoes_notificacoes', JSON.stringify(this.notificacoes));
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  }

  // Iniciar verificações periódicas
  private startPeriodicChecks(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    if (this.config.ativo) {
      this.checkInterval = setInterval(() => {
        this.verificarAlertas();
      }, 5 * 60 * 1000); // Verificar a cada 5 minutos
    }
  }

  // Verificar alertas automaticamente
  private async verificarAlertas(): Promise<void> {
    try {
      const hoje = new Date();
      
      // Verificar calibrações vencidas
      const { data: calibracoesVencidas } = await supabase
        .from('calibracoes')
        .select(`
          *,
          equipamentos!inner(*)
        `)
        .lt('data_proxima_calibracao', hoje.toISOString());

      if (calibracoesVencidas && calibracoesVencidas.length > 0) {
        calibracoesVencidas.forEach(calibracao => {
          this.criarNotificacao({
            tipo: 'CALIBRACAO_VENCIDA',
            titulo: `Calibração Vencida: ${calibracao.equipamentos?.nome || 'Equipamento'}`,
            mensagem: `A calibração do equipamento ${calibracao.equipamentos?.nome} venceu em ${new Date(calibracao.data_proxima_calibracao).toLocaleDateString('pt-PT')}`,
            prioridade: 'CRITICA',
            equipamento_id: calibracao.equipamento_id,
            calibracao_id: calibracao.id,
            acao: 'Verificar Calibrações',
            dados: { equipamento: calibracao.equipamentos, calibracao }
          });
        });
      }

      // Verificar calibrações próximas
      const dataLimite = new Date();
      dataLimite.setDate(hoje.getDate() + this.config.intervalos.calibracao_proxima);

      const { data: calibracoesProximas } = await supabase
        .from('calibracoes')
        .select(`
          *,
          equipamentos!inner(*)
        `)
        .gte('data_proxima_calibracao', hoje.toISOString())
        .lte('data_proxima_calibracao', dataLimite.toISOString());

      if (calibracoesProximas && calibracoesProximas.length > 0) {
        calibracoesProximas.forEach(calibracao => {
          const diasRestantes = Math.ceil(
            (new Date(calibracao.data_proxima_calibracao).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
          );

          this.criarNotificacao({
            tipo: 'CALIBRACAO_PROXIMA',
            titulo: `Calibração a Vencer: ${calibracao.equipamentos?.nome || 'Equipamento'}`,
            mensagem: `A calibração do equipamento ${calibracao.equipamentos?.nome} vence em ${diasRestantes} dias`,
            prioridade: diasRestantes <= 7 ? 'ALTA' : 'MEDIA',
            equipamento_id: calibracao.equipamento_id,
            calibracao_id: calibracao.id,
            acao: 'Agendar Calibração',
            dados: { equipamento: calibracao.equipamentos, calibracao, diasRestantes }
          });
        });
      }

      // Verificar equipamentos críticos (sem calibração válida)
      const { data: equipamentos } = await supabase
        .from('equipamentos')
        .select('*')
        .eq('estado', 'ativo');

      if (equipamentos) {
        for (const equipamento of equipamentos) {
          const { data: calibracaoValida } = await supabase
            .from('calibracoes')
            .select('*')
            .eq('equipamento_id', equipamento.id)
            .gt('data_proxima_calibracao', hoje.toISOString())
            .order('data_proxima_calibracao', { ascending: false })
            .limit(1);

          if (!calibracaoValida || calibracaoValida.length === 0) {
            this.criarNotificacao({
              tipo: 'EQUIPAMENTO_CRITICO',
              titulo: `Equipamento Crítico: ${equipamento.nome}`,
              mensagem: `O equipamento ${equipamento.nome} não possui calibração válida`,
              prioridade: 'ALTA',
              equipamento_id: equipamento.id,
              acao: 'Calibrar Equipamento',
              dados: { equipamento }
            });
          }
        }
      }

    } catch (error) {
      console.error('Erro ao verificar alertas:', error);
    }
  }

  // Criar nova notificação
  private criarNotificacao(dados: Omit<CalibracaoNotificacao, 'id' | 'data_criacao' | 'lida'>): void {
    const notificacao: CalibracaoNotificacao = {
      ...dados,
      id: `calib_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      data_criacao: new Date().toISOString(),
      lida: false
    };

    // Verificar se já existe notificação similar (evitar duplicados)
    const existeSimilar = this.notificacoes.some(n => 
      n.tipo === notificacao.tipo && 
      n.equipamento_id === notificacao.equipamento_id &&
      !n.lida &&
      new Date(n.data_criacao).getTime() > Date.now() - (24 * 60 * 60 * 1000) // Últimas 24h
    );

    if (!existeSimilar) {
      this.notificacoes.unshift(notificacao);
      this.saveNotificacoes();

      // Mostrar toast se ativo
      if (this.config.inApp) {
        toast(`${notificacao.titulo}: ${notificacao.mensagem}`, {
          duration: 5000,
          icon: this.getPrioridadeIcon(notificacao.prioridade),
          style: {
            background: this.getPrioridadeColor(notificacao.prioridade),
            color: 'white'
          }
        });
      }
    }
  }

  // Obter ícone baseado na prioridade
  private getPrioridadeIcon(prioridade: string): string {
    switch (prioridade) {
      case 'CRITICA': return '🚨';
      case 'ALTA': return '⚠️';
      case 'MEDIA': return '📢';
      case 'BAIXA': return 'ℹ️';
      default: return '📢';
    }
  }

  // Obter cor baseada na prioridade
  private getPrioridadeColor(prioridade: string): string {
    switch (prioridade) {
      case 'CRITICA': return '#dc2626';
      case 'ALTA': return '#ea580c';
      case 'MEDIA': return '#d97706';
      case 'BAIXA': return '#0891b2';
      default: return '#6b7280';
    }
  }

  // API Pública

  // Obter todas as notificações
  getNotificacoes(): CalibracaoNotificacao[] {
    return this.notificacoes;
  }

  // Obter notificações não lidas
  getNotificacoesNaoLidas(): CalibracaoNotificacao[] {
    return this.notificacoes.filter(n => !n.lida);
  }

  // Marcar notificação como lida
  marcarComoLida(id: string): void {
    const notificacao = this.notificacoes.find(n => n.id === id);
    if (notificacao) {
      notificacao.lida = true;
      this.saveNotificacoes();
    }
  }

  // Marcar todas como lidas
  marcarTodasComoLidas(): void {
    this.notificacoes.forEach(n => n.lida = true);
    this.saveNotificacoes();
  }

  // Eliminar notificação
  eliminarNotificacao(id: string): void {
    this.notificacoes = this.notificacoes.filter(n => n.id !== id);
    this.saveNotificacoes();
  }

  // Obter configuração
  getConfig(): CalibracoesNotificacoesConfig {
    return { ...this.config };
  }

  // Atualizar configuração
  atualizarConfig(novaConfig: Partial<CalibracoesNotificacoesConfig>): void {
    this.config = { ...this.config, ...novaConfig };
    this.saveConfig();
    this.startPeriodicChecks();
  }

  // Forçar verificação manual
  async verificarManual(): Promise<void> {
    await this.verificarAlertas();
  }

  // Obter estatísticas
  getEstatisticas() {
    const total = this.notificacoes.length;
    const naoLidas = this.notificacoes.filter(n => !n.lida).length;
    const porPrioridade = {
      CRITICA: this.notificacoes.filter(n => n.prioridade === 'CRITICA').length,
      ALTA: this.notificacoes.filter(n => n.prioridade === 'ALTA').length,
      MEDIA: this.notificacoes.filter(n => n.prioridade === 'MEDIA').length,
      BAIXA: this.notificacoes.filter(n => n.prioridade === 'BAIXA').length
    };

    return { total, naoLidas, porPrioridade };
  }

  // Limpar notificações antigas (mais de 30 dias)
  limparAntigas(): void {
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

    this.notificacoes = this.notificacoes.filter(n => 
      new Date(n.data_criacao) > trintaDiasAtras
    );
    this.saveNotificacoes();
  }
}

// Instância singleton
export const calibracoesNotificacoesService = new CalibracoesNotificacoesService();
