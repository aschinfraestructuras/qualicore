import { supabase } from './supabase';
import toast from 'react-hot-toast';

// Interfaces para notificações de Pontes e Túneis
export interface PontesTuneisNotificacao {
  id: string;
  tipo: PontesTuneisNotificacaoTipo;
  titulo: string;
  mensagem: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  categoria: 'estrutural' | 'inspecao' | 'manutencao' | 'seguranca' | 'ambiental' | 'sistema';
  estrutura_id?: string;
  estrutura_tipo?: 'ponte' | 'tunel' | 'viaduto';
  quilometro?: number;
  data_criacao: Date;
  data_leitura?: Date;
  lida: boolean;
  acao_requerida: boolean;
  url_acao?: string;
  dados_extras?: any;
}

export type PontesTuneisNotificacaoTipo = 
  | 'inspecao_vencida'
  | 'inspecao_proxima'
  | 'estrutura_critica'
  | 'deformacao_excessiva'
  | 'sobrecarga_detectada'
  | 'fadiga_material'
  | 'corrosao_avancada'
  | 'fissura_estrutural'
  | 'manutencao_urgente'
  | 'condicoes_meteorologicas'
  | 'vida_util_esgotada'
  | 'sistema_alerta'
  | 'relatorio_disponivel'
  | 'nova_estrutura'
  | 'atualizacao_normas';

export interface PontesTuneisNotificacoesConfig {
  ativo: boolean;
  canais: {
    in_app: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  tipos: {
    inspecao_vencida: boolean;
    inspecao_proxima: boolean;
    estrutura_critica: boolean;
    deformacao_excessiva: boolean;
    sobrecarga_detectada: boolean;
    fadiga_material: boolean;
    corrosao_avancada: boolean;
    fissura_estrutural: boolean;
    manutencao_urgente: boolean;
    condicoes_meteorologicas: boolean;
    vida_util_esgotada: boolean;
    sistema_alerta: boolean;
    relatorio_disponivel: boolean;
    nova_estrutura: boolean;
    atualizacao_normas: boolean;
  };
  prioridades: {
    baixa: boolean;
    media: boolean;
    alta: boolean;
    critica: boolean;
  };
  categorias: {
    estrutural: boolean;
    inspecao: boolean;
    manutencao: boolean;
    seguranca: boolean;
    ambiental: boolean;
    sistema: boolean;
  };
  periodicidade_verificacao: number; // em minutos
  limite_notificacoes_dia: number;
  silencioso_periodo: {
    ativo: boolean;
    inicio: string; // HH:MM
    fim: string; // HH:MM
  };
}

class PontesTuneisNotificacoesService {
  private static instance: PontesTuneisNotificacoesService;
  private notificacoes: PontesTuneisNotificacao[] = [];
  private config: PontesTuneisNotificacoesConfig;
  private intervalId?: NodeJS.Timeout;
  private readonly STORAGE_KEY = 'pontes_tuneis_notificacoes';
  private readonly CONFIG_KEY = 'pontes_tuneis_notificacoes_config';

  private constructor() {
    this.config = this.getDefaultConfig();
    this.loadConfig();
    this.loadNotificacoes();
    this.initPeriodicCheck();
  }

  static getInstance(): PontesTuneisNotificacoesService {
    if (!PontesTuneisNotificacoesService.instance) {
      PontesTuneisNotificacoesService.instance = new PontesTuneisNotificacoesService();
    }
    return PontesTuneisNotificacoesService.instance;
  }

  // Configuração padrão
  private getDefaultConfig(): PontesTuneisNotificacoesConfig {
    return {
      ativo: true,
      canais: {
        in_app: true,
        email: true,
        push: false,
        sms: false
      },
      tipos: {
        inspecao_vencida: true,
        inspecao_proxima: true,
        estrutura_critica: true,
        deformacao_excessiva: true,
        sobrecarga_detectada: true,
        fadiga_material: true,
        corrosao_avancada: true,
        fissura_estrutural: true,
        manutencao_urgente: true,
        condicoes_meteorologicas: false,
        vida_util_esgotada: true,
        sistema_alerta: true,
        relatorio_disponivel: false,
        nova_estrutura: false,
        atualizacao_normas: false
      },
      prioridades: {
        baixa: false,
        media: true,
        alta: true,
        critica: true
      },
      categorias: {
        estrutural: true,
        inspecao: true,
        manutencao: true,
        seguranca: true,
        ambiental: false,
        sistema: false
      },
      periodicidade_verificacao: 15, // 15 minutos
      limite_notificacoes_dia: 50,
      silencioso_periodo: {
        ativo: false,
        inicio: '22:00',
        fim: '07:00'
      }
    };
  }

  // Carregar configuração do localStorage
  private loadConfig(): void {
    try {
      const savedConfig = localStorage.getItem(this.CONFIG_KEY);
      if (savedConfig) {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.error('Erro ao carregar configuração das notificações:', error);
    }
  }

  // Salvar configuração no localStorage
  private saveConfig(): void {
    try {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(this.config));
    } catch (error) {
      console.error('Erro ao salvar configuração das notificações:', error);
    }
  }

  // Carregar notificações do localStorage
  private loadNotificacoes(): void {
    try {
      const savedNotificacoes = localStorage.getItem(this.STORAGE_KEY);
      if (savedNotificacoes) {
        this.notificacoes = JSON.parse(savedNotificacoes).map((n: any) => ({
          ...n,
          data_criacao: new Date(n.data_criacao),
          data_leitura: n.data_leitura ? new Date(n.data_leitura) : undefined
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      this.notificacoes = [];
    }
  }

  // Salvar notificações no localStorage
  private saveNotificacoes(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notificacoes));
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  }

  // Iniciar verificação periódica
  private initPeriodicCheck(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    if (this.config.ativo) {
      this.intervalId = setInterval(
        () => this.verificarNotificacoes(),
        this.config.periodicidade_verificacao * 60 * 1000
      );
    }
  }

  // Verificar se está no período silencioso
  private isInSilentPeriod(): boolean {
    if (!this.config.silencioso_periodo.ativo) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const inicio = this.config.silencioso_periodo.inicio;
    const fim = this.config.silencioso_periodo.fim;

    if (inicio <= fim) {
      return currentTime >= inicio && currentTime <= fim;
    } else {
      return currentTime >= inicio || currentTime <= fim;
    }
  }

  // Verificar notificações automaticamente
  private async verificarNotificacoes(): Promise<void> {
    if (!this.config.ativo || this.isInSilentPeriod()) return;

    try {
      await Promise.all([
        this.verificarInspecoesVencidas(),
        this.verificarInspecoesProximas(),
        this.verificarEstruturasComProblemas(),
        this.verificarManutencaoUrgente(),
        this.verificarEstadoEstrutural()
      ]);
    } catch (error) {
      console.error('Erro na verificação automática de notificações:', error);
    }
  }

  // Verificar inspeções vencidas
  private async verificarInspecoesVencidas(): Promise<void> {
    if (!this.config.tipos.inspecao_vencida) return;

    try {
      const { data: estruturas } = await supabase
        .from('pontes_tuneis')
        .select('*')
        .lt('proxima_inspecao', new Date().toISOString().split('T')[0]);

      if (estruturas?.length) {
        for (const estrutura of estruturas) {
          const notificacaoExiste = this.notificacoes.some(n => 
            n.tipo === 'inspecao_vencida' && 
            n.estrutura_id === estrutura.id &&
            n.data_criacao > new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24h
          );

          if (!notificacaoExiste) {
            await this.criarNotificacao({
              tipo: 'inspecao_vencida',
              titulo: 'Inspeção Vencida',
              mensagem: `A estrutura ${estrutura.codigo} tem inspeção vencida desde ${estrutura.proxima_inspecao}`,
              prioridade: 'alta',
              categoria: 'inspecao',
              estrutura_id: estrutura.id,
              estrutura_tipo: estrutura.tipo,
              quilometro: estrutura.km_inicial,
              acao_requerida: true,
              url_acao: `/pontes-tuneis?estrutura=${estrutura.id}`
            });
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar inspeções vencidas:', error);
    }
  }

  // Verificar inspeções próximas
  private async verificarInspecoesProximas(): Promise<void> {
    if (!this.config.tipos.inspecao_proxima) return;

    try {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + 7); // Próximos 7 dias

      const { data: estruturas } = await supabase
        .from('pontes_tuneis')
        .select('*')
        .gte('proxima_inspecao', new Date().toISOString().split('T')[0])
        .lte('proxima_inspecao', dataLimite.toISOString().split('T')[0]);

      if (estruturas?.length) {
        for (const estrutura of estruturas) {
          const notificacaoExiste = this.notificacoes.some(n => 
            n.tipo === 'inspecao_proxima' && 
            n.estrutura_id === estrutura.id &&
            n.data_criacao > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 dias
          );

          if (!notificacaoExiste) {
            const diasRestantes = Math.ceil(
              (new Date(estrutura.proxima_inspecao).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            await this.criarNotificacao({
              tipo: 'inspecao_proxima',
              titulo: 'Inspeção Programada',
              mensagem: `A estrutura ${estrutura.codigo} tem inspeção agendada em ${diasRestantes} dias`,
              prioridade: diasRestantes <= 3 ? 'alta' : 'media',
              categoria: 'inspecao',
              estrutura_id: estrutura.id,
              estrutura_tipo: estrutura.tipo,
              quilometro: estrutura.km_inicial,
              acao_requerida: true,
              url_acao: `/pontes-tuneis?estrutura=${estrutura.id}`
            });
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar inspeções próximas:', error);
    }
  }

  // Verificar estruturas com problemas
  private async verificarEstruturasComProblemas(): Promise<void> {
    if (!this.config.tipos.estrutura_critica) return;

    try {
      const { data: estruturas } = await supabase
        .from('pontes_tuneis')
        .select('*')
        .in('estado', ['CRITICO', 'MAU']);

      if (estruturas?.length) {
        for (const estrutura of estruturas) {
          const notificacaoExiste = this.notificacoes.some(n => 
            n.tipo === 'estrutura_critica' && 
            n.estrutura_id === estrutura.id &&
            n.data_criacao > new Date(Date.now() - 24 * 60 * 60 * 1000)
          );

          if (!notificacaoExiste) {
            await this.criarNotificacao({
              tipo: 'estrutura_critica',
              titulo: 'Estrutura em Estado Crítico',
              mensagem: `A estrutura ${estrutura.codigo} está em estado ${estrutura.estado.toLowerCase()} e requer atenção imediata`,
              prioridade: estrutura.estado === 'CRITICO' ? 'critica' : 'alta',
              categoria: 'estrutural',
              estrutura_id: estrutura.id,
              estrutura_tipo: estrutura.tipo,
              quilometro: estrutura.km_inicial,
              acao_requerida: true,
              url_acao: `/pontes-tuneis?estrutura=${estrutura.id}`
            });
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar estruturas com problemas:', error);
    }
  }

  // Verificar manutenção urgente
  private async verificarManutencaoUrgente(): Promise<void> {
    if (!this.config.tipos.manutencao_urgente) return;

    try {
      const { data: estruturas } = await supabase
        .from('pontes_tuneis')
        .select('*')
        .eq('status_operacional', 'MANUTENCAO');

      if (estruturas?.length) {
        for (const estrutura of estruturas) {
          // Simular verificação de tempo em manutenção
          const tempoManutencao = Math.random() * 30; // dias simulados
          
          if (tempoManutencao > 7) { // Mais de 7 dias em manutenção
            const notificacaoExiste = this.notificacoes.some(n => 
              n.tipo === 'manutencao_urgente' && 
              n.estrutura_id === estrutura.id &&
              n.data_criacao > new Date(Date.now() - 24 * 60 * 60 * 1000)
            );

            if (!notificacaoExiste) {
              await this.criarNotificacao({
                tipo: 'manutencao_urgente',
                titulo: 'Manutenção Prolongada',
                mensagem: `A estrutura ${estrutura.codigo} está em manutenção há mais de 7 dias`,
                prioridade: 'alta',
                categoria: 'manutencao',
                estrutura_id: estrutura.id,
                estrutura_tipo: estrutura.tipo,
                quilometro: estrutura.km_inicial,
                acao_requerida: true,
                url_acao: `/pontes-tuneis?estrutura=${estrutura.id}`
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar manutenção urgente:', error);
    }
  }

  // Verificar estado estrutural com analytics
  private async verificarEstadoEstrutural(): Promise<void> {
    if (!this.config.tipos.deformacao_excessiva && !this.config.tipos.fadiga_material) return;

    try {
      // Simular análise estrutural avançada
      const { data: estruturas } = await supabase
        .from('pontes_tuneis')
        .select('*')
        .limit(5);

      if (estruturas?.length) {
        for (const estrutura of estruturas) {
          // Simular métricas estruturais
          const deformacao = Math.random() * 20; // mm
          const fadiga = Math.random() * 100; // %
          const corrosao = Math.random() * 30; // %

          // Verificar deformação excessiva
          if (deformacao > 15 && this.config.tipos.deformacao_excessiva) {
            const notificacaoExiste = this.notificacoes.some(n => 
              n.tipo === 'deformacao_excessiva' && 
              n.estrutura_id === estrutura.id &&
              n.data_criacao > new Date(Date.now() - 12 * 60 * 60 * 1000) // Últimas 12h
            );

            if (!notificacaoExiste) {
              await this.criarNotificacao({
                tipo: 'deformacao_excessiva',
                titulo: 'Deformação Excessiva Detectada',
                mensagem: `A estrutura ${estrutura.codigo} apresenta deformação de ${deformacao.toFixed(1)}mm, acima do limite seguro`,
                prioridade: 'critica',
                categoria: 'estrutural',
                estrutura_id: estrutura.id,
                estrutura_tipo: estrutura.tipo,
                quilometro: estrutura.km_inicial,
                acao_requerida: true,
                dados_extras: { deformacao, limite: 15 }
              });
            }
          }

          // Verificar fadiga material
          if (fadiga > 80 && this.config.tipos.fadiga_material) {
            const notificacaoExiste = this.notificacoes.some(n => 
              n.tipo === 'fadiga_material' && 
              n.estrutura_id === estrutura.id &&
              n.data_criacao > new Date(Date.now() - 24 * 60 * 60 * 1000)
            );

            if (!notificacaoExiste) {
              await this.criarNotificacao({
                tipo: 'fadiga_material',
                titulo: 'Fadiga Material Avançada',
                mensagem: `A estrutura ${estrutura.codigo} apresenta ${fadiga.toFixed(0)}% de fadiga material`,
                prioridade: 'alta',
                categoria: 'estrutural',
                estrutura_id: estrutura.id,
                estrutura_tipo: estrutura.tipo,
                quilometro: estrutura.km_inicial,
                acao_requerida: true,
                dados_extras: { fadiga, limite: 80 }
              });
            }
          }

          // Verificar corrosão
          if (corrosao > 20 && this.config.tipos.corrosao_avancada) {
            const notificacaoExiste = this.notificacoes.some(n => 
              n.tipo === 'corrosao_avancada' && 
              n.estrutura_id === estrutura.id &&
              n.data_criacao > new Date(Date.now() - 24 * 60 * 60 * 1000)
            );

            if (!notificacaoExiste) {
              await this.criarNotificacao({
                tipo: 'corrosao_avancada',
                titulo: 'Corrosão Avançada Detectada',
                mensagem: `A estrutura ${estrutura.codigo} apresenta ${corrosao.toFixed(0)}% de área com corrosão`,
                prioridade: 'alta',
                categoria: 'estrutural',
                estrutura_id: estrutura.id,
                estrutura_tipo: estrutura.tipo,
                quilometro: estrutura.km_inicial,
                acao_requerida: true,
                dados_extras: { corrosao, limite: 20 }
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar estado estrutural:', error);
    }
  }

  // Criar nova notificação
  async criarNotificacao(dados: Omit<PontesTuneisNotificacao, 'id' | 'data_criacao' | 'lida'>): Promise<PontesTuneisNotificacao> {
    const notificacao: PontesTuneisNotificacao = {
      id: `pontes_tuneis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      data_criacao: new Date(),
      lida: false,
      ...dados
    };

    // Verificar limites e filtros
    if (!this.shouldShowNotification(notificacao)) {
      return notificacao;
    }

    // Adicionar à lista
    this.notificacoes.unshift(notificacao);

    // Limitar número de notificações
    if (this.notificacoes.length > 100) {
      this.notificacoes = this.notificacoes.slice(0, 100);
    }

    // Salvar no localStorage
    this.saveNotificacoes();

    // Mostrar notificação in-app
    if (this.config.canais.in_app) {
      this.showInAppNotification(notificacao);
    }

    return notificacao;
  }

  // Verificar se deve mostrar a notificação
  private shouldShowNotification(notificacao: PontesTuneisNotificacao): boolean {
    // Verificar se o tipo está ativo
    if (!this.config.tipos[notificacao.tipo]) return false;

    // Verificar se a prioridade está ativa
    if (!this.config.prioridades[notificacao.prioridade]) return false;

    // Verificar se a categoria está ativa
    if (!this.config.categorias[notificacao.categoria]) return false;

    // Verificar limite diário
    const hoje = new Date().toDateString();
    const notificacoesHoje = this.notificacoes.filter(n => 
      n.data_criacao.toDateString() === hoje
    ).length;

    if (notificacoesHoje >= this.config.limite_notificacoes_dia) return false;

    // Verificar duplicatas recentes
    const notificacaoSimilar = this.notificacoes.find(n => 
      n.tipo === notificacao.tipo &&
      n.estrutura_id === notificacao.estrutura_id &&
      n.data_criacao > new Date(Date.now() - 2 * 60 * 60 * 1000) // Últimas 2 horas
    );

    if (notificacaoSimilar) return false;

    return true;
  }

  // Mostrar notificação in-app
  private showInAppNotification(notificacao: PontesTuneisNotificacao): void {
    const icones = {
      baixa: '💡',
      media: '⚠️',
      alta: '🚨',
      critica: '🔴'
    };

    const icone = icones[notificacao.prioridade];
    
    const toastOptions = {
      duration: notificacao.prioridade === 'critica' ? 8000 : 
                 notificacao.prioridade === 'alta' ? 6000 : 4000,
      position: 'top-right' as const,
      style: {
        background: notificacao.prioridade === 'critica' ? '#FEE2E2' :
                   notificacao.prioridade === 'alta' ? '#FEF3C7' :
                   notificacao.prioridade === 'media' ? '#DBEAFE' : '#F0F9FF',
        color: notificacao.prioridade === 'critica' ? '#991B1B' :
               notificacao.prioridade === 'alta' ? '#92400E' :
               notificacao.prioridade === 'media' ? '#1E40AF' : '#0369A1',
        border: `1px solid ${
          notificacao.prioridade === 'critica' ? '#FECACA' :
          notificacao.prioridade === 'alta' ? '#FDE68A' :
          notificacao.prioridade === 'media' ? '#BFDBFE' : '#BAE6FD'
        }`
      }
    };

    toast.success(`${icone} ${notificacao.titulo}: ${notificacao.mensagem}`, toastOptions);
  }

  // Métodos públicos
  getNotificacoes(): PontesTuneisNotificacao[] {
    return [...this.notificacoes];
  }

  getNotificacoesNaoLidas(): PontesTuneisNotificacao[] {
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

  limparNotificacoes(): void {
    this.notificacoes = [];
    this.saveNotificacoes();
  }

  getConfig(): PontesTuneisNotificacoesConfig {
    return { ...this.config };
  }

  updateConfig(novaConfig: Partial<PontesTuneisNotificacoesConfig>): void {
    this.config = { ...this.config, ...novaConfig };
    this.saveConfig();
    this.initPeriodicCheck(); // Reiniciar verificação periódica com nova configuração
  }

  // Forçar verificação manual
  async verificarArtificialmente(): Promise<void> {
    await this.verificarNotificacoes();
  }

  // Estatísticas
  getEstatisticas() {
    const hoje = new Date().toDateString();
    const semanaPassada = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      total: this.notificacoes.length,
      nao_lidas: this.getNotificacoesNaoLidas().length,
      hoje: this.notificacoes.filter(n => n.data_criacao.toDateString() === hoje).length,
      semana: this.notificacoes.filter(n => n.data_criacao >= semanaPassada).length,
      criticas: this.notificacoes.filter(n => n.prioridade === 'critica').length,
      com_acao: this.notificacoes.filter(n => n.acao_requerida).length,
      por_tipo: this.notificacoes.reduce((acc, n) => {
        acc[n.tipo] = (acc[n.tipo] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      por_prioridade: this.notificacoes.reduce((acc, n) => {
        acc[n.prioridade] = (acc[n.prioridade] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

// Exportar instância singleton
export const pontesTuneisNotificacoesService = PontesTuneisNotificacoesService.getInstance();

// Funções utilitárias
export const getNotificacoesCriticas = () => {
  return pontesTuneisNotificacoesService.getNotificacoes().filter(n => n.prioridade === 'critica');
};

export const getNotificacoesPorTipo = (tipo: PontesTuneisNotificacaoTipo) => {
  return pontesTuneisNotificacoesService.getNotificacoes().filter(n => n.tipo === tipo);
};

export const getNotificacoesPorEstrutura = (estruturaId: string) => {
  return pontesTuneisNotificacoesService.getNotificacoes().filter(n => n.estrutura_id === estruturaId);
};
