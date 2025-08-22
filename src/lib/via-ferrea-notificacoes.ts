import { supabase } from './supabase';
import toast from 'react-hot-toast';

// Interfaces para notificações da Via Férrea
export interface ViaFerreaNotificacao {
  id: string;
  tipo: ViaFerreaNotificacaoTipo;
  titulo: string;
  mensagem: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  categoria: 'inspecao' | 'manutencao' | 'seguranca' | 'qualidade' | 'sistema';
  elemento_id?: string;
  elemento_tipo?: 'trilho' | 'travessa';
  quilometro?: number;
  data_criacao: Date;
  data_leitura?: Date;
  lida: boolean;
  acao_requerida: boolean;
  url_acao?: string;
  dados_extras?: any;
}

export type ViaFerreaNotificacaoTipo = 
  | 'inspecao_vencida'
  | 'inspecao_proxima'
  | 'elemento_critico'
  | 'manutencao_urgente'
  | 'tensao_alta'
  | 'desgaste_excessivo'
  | 'geometria_fora_padrao'
  | 'sistema_alerta'
  | 'relatorio_disponivel'
  | 'nova_inspecao';

export interface ViaFerreaNotificacoesConfig {
  ativo: boolean;
  canais: {
    in_app: boolean;
    email: boolean;
    push: boolean;
  };
  tipos: {
    inspecao_vencida: boolean;
    inspecao_proxima: boolean;
    elemento_critico: boolean;
    manutencao_urgente: boolean;
    tensao_alta: boolean;
    desgaste_excessivo: boolean;
    geometria_fora_padrao: boolean;
    sistema_alerta: boolean;
    relatorio_disponivel: boolean;
    nova_inspecao: boolean;
  };
  prioridades: {
    baixa: boolean;
    media: boolean;
    alta: boolean;
    critica: boolean;
  };
  periodicidade_verificacao: number; // em minutos
}

class ViaFerreaNotificacoesService {
  private static instance: ViaFerreaNotificacoesService;
  private notificacoes: ViaFerreaNotificacao[] = [];
  private config: ViaFerreaNotificacoesConfig;
  private intervalId?: NodeJS.Timeout;

  private constructor() {
    this.config = this.getDefaultConfig();
    this.loadConfig();
    this.loadNotificacoes();
  }

  static getInstance(): ViaFerreaNotificacoesService {
    if (!ViaFerreaNotificacoesService.instance) {
      ViaFerreaNotificacoesService.instance = new ViaFerreaNotificacoesService();
    }
    return ViaFerreaNotificacoesService.instance;
  }

  // Configuração padrão
  private getDefaultConfig(): ViaFerreaNotificacoesConfig {
    return {
      ativo: true,
      canais: {
        in_app: true,
        email: true,
        push: false
      },
      tipos: {
        inspecao_vencida: true,
        inspecao_proxima: true,
        elemento_critico: true,
        manutencao_urgente: true,
        tensao_alta: true,
        desgaste_excessivo: true,
        geometria_fora_padrao: true,
        sistema_alerta: true,
        relatorio_disponivel: false,
        nova_inspecao: false
      },
      prioridades: {
        baixa: false,
        media: true,
        alta: true,
        critica: true
      },
      periodicidade_verificacao: 30 // 30 minutos
    };
  }

  // Carregar configuração do localStorage
  private loadConfig(): void {
    try {
      const savedConfig = localStorage.getItem('via_ferrea_notificacoes_config');
      if (savedConfig) {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.error('Erro ao carregar configuração de notificações:', error);
    }
  }

  // Salvar configuração no localStorage
  private saveConfig(): void {
    try {
      localStorage.setItem('via_ferrea_notificacoes_config', JSON.stringify(this.config));
    } catch (error) {
      console.error('Erro ao salvar configuração de notificações:', error);
    }
  }

  // Carregar notificações do localStorage
  private loadNotificacoes(): void {
    try {
      const savedNotificacoes = localStorage.getItem('via_ferrea_notificacoes');
      if (savedNotificacoes) {
        this.notificacoes = JSON.parse(savedNotificacoes).map((n: any) => ({
          ...n,
          data_criacao: new Date(n.data_criacao),
          data_leitura: n.data_leitura ? new Date(n.data_leitura) : undefined
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  }

  // Salvar notificações no localStorage
  private saveNotificacoes(): void {
    try {
      localStorage.setItem('via_ferrea_notificacoes', JSON.stringify(this.notificacoes));
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  }

  // Iniciar verificações periódicas
  startPeriodicChecks(trilhos: any[], travessas: any[], inspecoes: any[]): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    if (!this.config.ativo) return;

    this.intervalId = setInterval(() => {
      this.verificarAlertas(trilhos, travessas, inspecoes);
    }, this.config.periodicidade_verificacao * 60 * 1000);

    // Verificação inicial
    this.verificarAlertas(trilhos, travessas, inspecoes);
  }

  // Parar verificações periódicas
  stopPeriodicChecks(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  // Verificar alertas principais
  private async verificarAlertas(trilhos: any[], travessas: any[], inspecoes: any[]): Promise<void> {
    if (!this.config.ativo) return;

    try {
      await Promise.all([
        this.verificarInspecoesVencidas(trilhos, travessas),
        this.verificarInspecoesProximas(trilhos, travessas),
        this.verificarElementosCriticos(trilhos, travessas),
        this.verificarTensaoAlta(trilhos),
        this.verificarDesgasteExcessivo(trilhos, travessas),
        this.verificarGeometriaForaPadrao(trilhos),
        this.verificarManutencaoUrgente(trilhos, travessas)
      ]);
    } catch (error) {
      console.error('Erro ao verificar alertas da via férrea:', error);
    }
  }

  // Verificar inspeções vencidas
  private async verificarInspecoesVencidas(trilhos: any[], travessas: any[]): Promise<void> {
    if (!this.config.tipos.inspecao_vencida) return;

    const hoje = new Date();
    const elementosVencidos = [...trilhos, ...travessas].filter(elemento => {
      const proximaInspecao = new Date(elemento.proxima_inspecao);
      return proximaInspecao < hoje;
    });

    for (const elemento of elementosVencidos) {
      const notificacaoExiste = this.notificacoes.some(n => 
        n.tipo === 'inspecao_vencida' && 
        n.elemento_id === elemento.id &&
        !n.lida
      );

      if (!notificacaoExiste) {
        const diasVencido = Math.floor((hoje.getTime() - new Date(elemento.proxima_inspecao).getTime()) / (1000 * 60 * 60 * 24));
        
        await this.criarNotificacao({
          tipo: 'inspecao_vencida',
          titulo: 'Inspeção Vencida',
          mensagem: `${elemento.codigo} - Inspeção vencida há ${diasVencido} dia(s)`,
          prioridade: diasVencido > 30 ? 'critica' : diasVencido > 7 ? 'alta' : 'media',
          categoria: 'inspecao',
          elemento_id: elemento.id,
          elemento_tipo: elemento.comprimento ? 'trilho' : 'travessa',
          quilometro: elemento.km_inicial,
          acao_requerida: true,
          dados_extras: {
            dias_vencido: diasVencido,
            ultima_inspecao: elemento.ultima_inspecao
          }
        });
      }
    }
  }

  // Verificar inspeções próximas (próximos 7 dias)
  private async verificarInspecoesProximas(trilhos: any[], travessas: any[]): Promise<void> {
    if (!this.config.tipos.inspecao_proxima) return;

    const hoje = new Date();
    const proximaData = new Date();
    proximaData.setDate(hoje.getDate() + 7);

    const elementosProximos = [...trilhos, ...travessas].filter(elemento => {
      const proximaInspecao = new Date(elemento.proxima_inspecao);
      return proximaInspecao >= hoje && proximaInspecao <= proximaData;
    });

    for (const elemento of elementosProximos) {
      const notificacaoExiste = this.notificacoes.some(n => 
        n.tipo === 'inspecao_proxima' && 
        n.elemento_id === elemento.id &&
        !n.lida
      );

      if (!notificacaoExiste) {
        const diasRestantes = Math.floor((new Date(elemento.proxima_inspecao).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        
        await this.criarNotificacao({
          tipo: 'inspecao_proxima',
          titulo: 'Inspeção Próxima',
          mensagem: `${elemento.codigo} - Inspeção agendada em ${diasRestantes} dia(s)`,
          prioridade: diasRestantes <= 1 ? 'alta' : 'media',
          categoria: 'inspecao',
          elemento_id: elemento.id,
          elemento_tipo: elemento.comprimento ? 'trilho' : 'travessa',
          quilometro: elemento.km_inicial,
          acao_requerida: true,
          dados_extras: {
            dias_restantes: diasRestantes,
            data_agendada: elemento.proxima_inspecao
          }
        });
      }
    }
  }

  // Verificar elementos em estado crítico
  private async verificarElementosCriticos(trilhos: any[], travessas: any[]): Promise<void> {
    if (!this.config.tipos.elemento_critico) return;

    const elementosCriticos = [...trilhos, ...travessas].filter(elemento => 
      elemento.estado === 'critico' || elemento.estado === 'mau'
    );

    for (const elemento of elementosCriticos) {
      const notificacaoExiste = this.notificacoes.some(n => 
        n.tipo === 'elemento_critico' && 
        n.elemento_id === elemento.id &&
        !n.lida
      );

      if (!notificacaoExiste) {
        await this.criarNotificacao({
          tipo: 'elemento_critico',
          titulo: 'Elemento em Estado Crítico',
          mensagem: `${elemento.codigo} - Estado: ${elemento.estado}`,
          prioridade: elemento.estado === 'critico' ? 'critica' : 'alta',
          categoria: 'seguranca',
          elemento_id: elemento.id,
          elemento_tipo: elemento.comprimento ? 'trilho' : 'travessa',
          quilometro: elemento.km_inicial,
          acao_requerida: true,
          dados_extras: {
            estado_atual: elemento.estado,
            observacoes: elemento.observacoes
          }
        });
      }
    }
  }

  // Verificar tensão alta nos trilhos
  private async verificarTensaoAlta(trilhos: any[]): Promise<void> {
    if (!this.config.tipos.tensao_alta) return;

    const TENSAO_LIMITE = 200; // MPa - valor exemplo
    const trilhosAltaTensao = trilhos.filter(trilho => 
      trilho.tensao && trilho.tensao > TENSAO_LIMITE
    );

    for (const trilho of trilhosAltaTensao) {
      const notificacaoExiste = this.notificacoes.some(n => 
        n.tipo === 'tensao_alta' && 
        n.elemento_id === trilho.id &&
        !n.lida
      );

      if (!notificacaoExiste) {
        await this.criarNotificacao({
          tipo: 'tensao_alta',
          titulo: 'Tensão Elevada Detectada',
          mensagem: `${trilho.codigo} - Tensão: ${trilho.tensao} MPa (Limite: ${TENSAO_LIMITE} MPa)`,
          prioridade: trilho.tensao > TENSAO_LIMITE * 1.2 ? 'critica' : 'alta',
          categoria: 'qualidade',
          elemento_id: trilho.id,
          elemento_tipo: 'trilho',
          quilometro: trilho.km_inicial,
          acao_requerida: true,
          dados_extras: {
            tensao_atual: trilho.tensao,
            tensao_limite: TENSAO_LIMITE,
            percentual_excesso: ((trilho.tensao - TENSAO_LIMITE) / TENSAO_LIMITE * 100).toFixed(1)
          }
        });
      }
    }
  }

  // Verificar desgaste excessivo
  private async verificarDesgasteExcessivo(trilhos: any[], travessas: any[]): Promise<void> {
    if (!this.config.tipos.desgaste_excessivo) return;

    const elementosDesgastados = [...trilhos, ...travessas].filter(elemento => {
      // Simular cálculo de desgaste baseado no estado e idade
      const desgaste = this.calcularDesgaste(elemento);
      return desgaste > 70; // 70% de desgaste
    });

    for (const elemento of elementosDesgastados) {
      const notificacaoExiste = this.notificacoes.some(n => 
        n.tipo === 'desgaste_excessivo' && 
        n.elemento_id === elemento.id &&
        !n.lida
      );

      if (!notificacaoExiste) {
        const desgaste = this.calcularDesgaste(elemento);
        
        await this.criarNotificacao({
          tipo: 'desgaste_excessivo',
          titulo: 'Desgaste Excessivo',
          mensagem: `${elemento.codigo} - Desgaste estimado: ${desgaste}%`,
          prioridade: desgaste > 85 ? 'critica' : 'alta',
          categoria: 'manutencao',
          elemento_id: elemento.id,
          elemento_tipo: elemento.comprimento ? 'trilho' : 'travessa',
          quilometro: elemento.km_inicial,
          acao_requerida: true,
          dados_extras: {
            desgaste_percentual: desgaste,
            vida_util_restante: Math.max(0, 100 - desgaste)
          }
        });
      }
    }
  }

  // Verificar geometria fora do padrão
  private async verificarGeometriaForaPadrao(trilhos: any[]): Promise<void> {
    if (!this.config.tipos.geometria_fora_padrao) return;

    const trilhosForaPadrao = trilhos.filter(trilho => {
      if (!trilho.geometria) return false;
      
      // Limites exemplo (em mm)
      const LIMITE_ALINHAMENTO = 10;
      const LIMITE_NIVEL = 8;
      const LIMITE_BITOLA = 5;
      
      return (
        Math.abs(trilho.geometria.alinhamento) > LIMITE_ALINHAMENTO ||
        Math.abs(trilho.geometria.nivel) > LIMITE_NIVEL ||
        Math.abs(trilho.geometria.bitola - 1435) > LIMITE_BITOLA // 1435mm bitola padrão
      );
    });

    for (const trilho of trilhosForaPadrao) {
      const notificacaoExiste = this.notificacoes.some(n => 
        n.tipo === 'geometria_fora_padrao' && 
        n.elemento_id === trilho.id &&
        !n.lida
      );

      if (!notificacaoExiste) {
        await this.criarNotificacao({
          tipo: 'geometria_fora_padrao',
          titulo: 'Geometria Fora do Padrão',
          mensagem: `${trilho.codigo} - Verificar alinhamento, nível e bitola`,
          prioridade: 'alta',
          categoria: 'qualidade',
          elemento_id: trilho.id,
          elemento_tipo: 'trilho',
          quilometro: trilho.km_inicial,
          acao_requerida: true,
          dados_extras: {
            geometria: trilho.geometria,
            desvios: this.calcularDesviosGeometria(trilho.geometria)
          }
        });
      }
    }
  }

  // Verificar manutenção urgente
  private async verificarManutencaoUrgente(trilhos: any[], travessas: any[]): Promise<void> {
    if (!this.config.tipos.manutencao_urgente) return;

    const elementosUrgentes = [...trilhos, ...travessas].filter(elemento => {
      const ultimaInspecao = new Date(elemento.ultima_inspecao);
      const hoje = new Date();
      const diasSemInspecao = Math.floor((hoje.getTime() - ultimaInspecao.getTime()) / (1000 * 60 * 60 * 24));
      
      return (
        (elemento.estado === 'mau' && diasSemInspecao > 90) ||
        (elemento.estado === 'critico' && diasSemInspecao > 30)
      );
    });

    for (const elemento of elementosUrgentes) {
      const notificacaoExiste = this.notificacoes.some(n => 
        n.tipo === 'manutencao_urgente' && 
        n.elemento_id === elemento.id &&
        !n.lida
      );

      if (!notificacaoExiste) {
        await this.criarNotificacao({
          tipo: 'manutencao_urgente',
          titulo: 'Manutenção Urgente Necessária',
          mensagem: `${elemento.codigo} - Estado ${elemento.estado}, inspeção há mais de 90 dias`,
          prioridade: 'critica',
          categoria: 'manutencao',
          elemento_id: elemento.id,
          elemento_tipo: elemento.comprimento ? 'trilho' : 'travessa',
          quilometro: elemento.km_inicial,
          acao_requerida: true,
          dados_extras: {
            estado: elemento.estado,
            ultima_inspecao: elemento.ultima_inspecao
          }
        });
      }
    }
  }

  // Criar nova notificação
  private async criarNotificacao(dados: Omit<ViaFerreaNotificacao, 'id' | 'data_criacao' | 'lida' | 'data_leitura'>): Promise<void> {
    const notificacao: ViaFerreaNotificacao = {
      id: this.generateId(),
      data_criacao: new Date(),
      lida: false,
      ...dados
    };

    // Verificar se deve ser exibida baseado na configuração
    if (!this.config.prioridades[dados.prioridade]) {
      return;
    }

    this.notificacoes.unshift(notificacao);
    
    // Manter apenas as últimas 100 notificações
    this.notificacoes = this.notificacoes.slice(0, 100);
    
    this.saveNotificacoes();

    // Exibir notificação in-app se habilitado
    if (this.config.canais.in_app) {
      this.mostrarNotificacaoInApp(notificacao);
    }
  }

  // Mostrar notificação in-app
  private mostrarNotificacaoInApp(notificacao: ViaFerreaNotificacao): void {
    const icon = this.getNotificationIcon(notificacao.tipo);
    const message = `${notificacao.titulo}: ${notificacao.mensagem}`;
    
    switch (notificacao.prioridade) {
      case 'critica':
        toast.error(message);
        break;
      case 'alta':
        toast.error(message);
        break;
      case 'media':
        toast(message);
        break;
      case 'baixa':
        toast.success(message);
        break;
    }
  }

  // Métodos utilitários
  private calcularDesgaste(elemento: any): number {
    // Simular cálculo baseado no estado
    switch (elemento.estado) {
      case 'excelente': return Math.random() * 20;
      case 'bom': return 20 + Math.random() * 20;
      case 'regular': return 40 + Math.random() * 20;
      case 'mau': return 60 + Math.random() * 20;
      case 'critico': return 80 + Math.random() * 20;
      default: return 50;
    }
  }

  private calcularDesviosGeometria(geometria: any): any {
    return {
      alinhamento: Math.abs(geometria.alinhamento),
      nivel: Math.abs(geometria.nivel),
      bitola: Math.abs(geometria.bitola - 1435)
    };
  }

  private getNotificationIcon(tipo: ViaFerreaNotificacaoTipo): string {
    const icons = {
      inspecao_vencida: '🔍',
      inspecao_proxima: '📅',
      elemento_critico: '⚠️',
      manutencao_urgente: '🔧',
      tensao_alta: '⚡',
      desgaste_excessivo: '📉',
      geometria_fora_padrao: '📐',
      sistema_alerta: '🚨',
      relatorio_disponivel: '📊',
      nova_inspecao: '✅'
    };
    return icons[tipo] || '🔔';
  }

  private generateId(): string {
    return `via_ferrea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Métodos públicos
  getNotificacoes(): ViaFerreaNotificacao[] {
    return this.notificacoes;
  }

  getNotificacoesNaoLidas(): ViaFerreaNotificacao[] {
    return this.notificacoes.filter(n => !n.lida);
  }

  marcarComoLida(id: string): void {
    const notificacao = this.notificacoes.find(n => n.id === id);
    if (notificacao) {
      notificacao.lida = true;
      notificacao.data_leitura = new Date();
      this.saveNotificacoes();
    }
  }

  marcarTodasComoLidas(): void {
    this.notificacoes.forEach(n => {
      if (!n.lida) {
        n.lida = true;
        n.data_leitura = new Date();
      }
    });
    this.saveNotificacoes();
  }

  removerNotificacao(id: string): void {
    this.notificacoes = this.notificacoes.filter(n => n.id !== id);
    this.saveNotificacoes();
  }

  getConfig(): ViaFerreaNotificacoesConfig {
    return { ...this.config };
  }

  updateConfig(novaConfig: Partial<ViaFerreaNotificacoesConfig>): void {
    this.config = { ...this.config, ...novaConfig };
    this.saveConfig();
  }

  limparNotificacoes(): void {
    this.notificacoes = [];
    this.saveNotificacoes();
  }
}

// Exportar instância singleton
export const viaFerreaNotificacoesService = ViaFerreaNotificacoesService.getInstance();
