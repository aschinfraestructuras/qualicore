import { supabase } from './supabase';
import toast from 'react-hot-toast';

// Tipos de notificações
export interface NaoConformidadeNotificacao {
  id: string;
  tipo: 'prazo_vencido' | 'prazo_proximo' | 'nc_critica' | 'tendencia_aumento' | 'custo_alto' | 'area_critica';
  titulo: string;
  mensagem: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  data_criacao: Date;
  lida: boolean;
  dados?: any;
  acao?: string;
}

export interface NaoConformidadesNotificacoesConfig {
  ativo: boolean;
  inApp: boolean;
  email: boolean;
  push: boolean;
  verificarPrazos: boolean;
  verificarCriticas: boolean;
  verificarTendencias: boolean;
  verificarCustos: boolean;
  intervaloVerificacao: number; // em minutos
}

const DEFAULT_CONFIG: NaoConformidadesNotificacoesConfig = {
  ativo: true,
  inApp: true,
  email: false,
  push: false,
  verificarPrazos: true,
  verificarCriticas: true,
  verificarTendencias: true,
  verificarCustos: true,
  intervaloVerificacao: 30
};

class NaoConformidadesNotificacoesService {
  private notificacoes: NaoConformidadeNotificacao[] = [];
  private config: NaoConformidadesNotificacoesConfig = DEFAULT_CONFIG;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.loadConfig();
    this.loadNotificacoes();
    this.startPeriodicChecks();
  }

  // Carregar configuração do localStorage
  private loadConfig(): void {
    try {
      const saved = localStorage.getItem('naoConformidadesNotificacoesConfig');
      if (saved) {
        this.config = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Erro ao carregar configuração de notificações:', error);
    }
  }

  // Salvar configuração no localStorage
  private saveConfig(): void {
    try {
      localStorage.setItem('naoConformidadesNotificacoesConfig', JSON.stringify(this.config));
    } catch (error) {
      console.error('Erro ao salvar configuração de notificações:', error);
    }
  }

  // Carregar notificações do localStorage
  private loadNotificacoes(): void {
    try {
      const saved = localStorage.getItem('naoConformidadesNotificacoes');
      if (saved) {
        this.notificacoes = JSON.parse(saved).map((n: any) => ({
          ...n,
          data_criacao: new Date(n.data_criacao)
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  }

  // Salvar notificações no localStorage
  private saveNotificacoes(): void {
    try {
      localStorage.setItem('naoConformidadesNotificacoes', JSON.stringify(this.notificacoes));
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  }

  // Iniciar verificações periódicas
  private startPeriodicChecks(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    if (this.config.ativo) {
      this.intervalId = setInterval(() => {
        this.verificarAlertas();
      }, this.config.intervaloVerificacao * 60 * 1000);

      // Verificação inicial
      this.verificarAlertas();
    }
  }

  // Verificar alertas
  private async verificarAlertas(): Promise<void> {
    try {
      if (this.config.verificarPrazos) {
        await this.verificarPrazosVencidos();
        await this.verificarPrazosProximos();
      }

      if (this.config.verificarCriticas) {
        await this.verificarNCsCriticas();
      }

      if (this.config.verificarTendencias) {
        await this.verificarTendencias();
      }

      if (this.config.verificarCustos) {
        await this.verificarCustosAltos();
      }

      await this.verificarAreasCriticas();
    } catch (error) {
      console.error('Erro ao verificar alertas:', error);
    }
  }

  // Verificar NCs com prazos vencidos
  private async verificarPrazosVencidos(): Promise<void> {
    const hoje = new Date();
    
    const { data: ncsVencidas, error } = await supabase
      .from('nao_conformidades')
      .select('*')
      .is('data_resolucao', null)
      .lt('data_limite_resolucao', hoje.toISOString());

    if (error) {
      console.error('Erro ao buscar NCs vencidas:', error);
      return;
    }

    if (ncsVencidas && ncsVencidas.length > 0) {
      this.criarNotificacao({
        tipo: 'prazo_vencido',
        titulo: `${ncsVencidas.length} NC(s) com prazo vencido`,
        mensagem: `${ncsVencidas.length} não conformidade(s) ultrapassaram o prazo limite de resolução.`,
        prioridade: 'critica',
        dados: { ncs: ncsVencidas },
        acao: `/nao-conformidades?status=vencidas`
      });
    }
  }

  // Verificar NCs com prazos próximos
  private async verificarPrazosProximos(): Promise<void> {
    const hoje = new Date();
    const proximos7Dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const { data: ncsProximas, error } = await supabase
      .from('nao_conformidades')
      .select('*')
      .is('data_resolucao', null)
      .gte('data_limite_resolucao', hoje.toISOString())
      .lte('data_limite_resolucao', proximos7Dias.toISOString());

    if (error) {
      console.error('Erro ao buscar NCs próximas do prazo:', error);
      return;
    }

    if (ncsProximas && ncsProximas.length > 0) {
      this.criarNotificacao({
        tipo: 'prazo_proximo',
        titulo: `${ncsProximas.length} NC(s) com prazo próximo`,
        mensagem: `${ncsProximas.length} não conformidade(s) têm prazo limite nos próximos 7 dias.`,
        prioridade: 'alta',
        dados: { ncs: ncsProximas },
        acao: `/nao-conformidades?status=proximas`
      });
    }
  }

  // Verificar NCs críticas
  private async verificarNCsCriticas(): Promise<void> {
    const { data: ncsCriticas, error } = await supabase
      .from('nao_conformidades')
      .select('*')
      .eq('severidade', 'critica')
      .is('data_resolucao', null);

    if (error) {
      console.error('Erro ao buscar NCs críticas:', error);
      return;
    }

    if (ncsCriticas && ncsCriticas.length > 0) {
      this.criarNotificacao({
        tipo: 'nc_critica',
        titulo: `${ncsCriticas.length} NC(s) crítica(s) pendente(s)`,
        mensagem: `${ncsCriticas.length} não conformidade(s) crítica(s) aguardam resolução.`,
        prioridade: 'critica',
        dados: { ncs: ncsCriticas },
        acao: `/nao-conformidades?severidade=critica`
      });
    }
  }

  // Verificar tendências de aumento
  private async verificarTendencias(): Promise<void> {
    const hoje = new Date();
    const ultimos30Dias = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
    const periodoAnterior = new Date(ultimos30Dias.getTime() - 30 * 24 * 60 * 60 * 1000);

    // NCs dos últimos 30 dias
    const { data: ncsAtuais, error: errorAtuais } = await supabase
      .from('nao_conformidades')
      .select('*')
      .gte('data_deteccao', ultimos30Dias.toISOString());

    // NCs do período anterior
    const { data: ncsAnteriores, error: errorAnteriores } = await supabase
      .from('nao_conformidades')
      .select('*')
      .gte('data_deteccao', periodoAnterior.toISOString())
      .lt('data_deteccao', ultimos30Dias.toISOString());

    if (errorAtuais || errorAnteriores) {
      console.error('Erro ao verificar tendências:', errorAtuais || errorAnteriores);
      return;
    }

    const countAtuais = ncsAtuais?.length || 0;
    const countAnteriores = ncsAnteriores?.length || 0;

    if (countAnteriores > 0 && countAtuais > countAnteriores * 1.5) {
      const aumento = Math.round(((countAtuais - countAnteriores) / countAnteriores) * 100);
      this.criarNotificacao({
        tipo: 'tendencia_aumento',
        titulo: `Tendência de aumento detectada`,
        mensagem: `Aumento de ${aumento}% no número de NCs comparado ao período anterior.`,
        prioridade: 'alta',
        dados: { 
          atual: countAtuais, 
          anterior: countAnteriores, 
          aumento 
        },
        acao: `/nao-conformidades?analytics=trends`
      });
    }
  }

  // Verificar custos altos
  private async verificarCustosAltos(): Promise<void> {
    const { data: ncs, error } = await supabase
      .from('nao_conformidades')
      .select('custo_real, custo_estimado')
      .not('custo_real', 'is', null);

    if (error) {
      console.error('Erro ao verificar custos:', error);
      return;
    }

    if (ncs && ncs.length > 0) {
      const custoTotal = ncs.reduce((acc, nc) => acc + (nc.custo_real || 0), 0);
      const custoMedio = custoTotal / ncs.length;

      // Alertar se o custo total for muito alto (> 50k EUR)
      if (custoTotal > 50000) {
        this.criarNotificacao({
          tipo: 'custo_alto',
          titulo: `Custo total de NCs elevado`,
          mensagem: `Custo total de ${custoTotal.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })} em NCs.`,
          prioridade: 'alta',
          dados: { custoTotal, custoMedio },
          acao: `/nao-conformidades?analytics=custos`
        });
      }
    }
  }

  // Verificar áreas críticas
  private async verificarAreasCriticas(): Promise<void> {
    const { data: ncs, error } = await supabase
      .from('nao_conformidades')
      .select('area_afetada, severidade')
      .is('data_resolucao', null);

    if (error) {
      console.error('Erro ao verificar áreas críticas:', error);
      return;
    }

    if (ncs && ncs.length > 0) {
      const areasCount = ncs.reduce((acc, nc) => {
        acc[nc.area_afetada] = (acc[nc.area_afetada] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const areasCriticas = Object.entries(areasCount)
        .filter(([, count]) => count >= 5) // 5 ou mais NCs pendentes
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);

      if (areasCriticas.length > 0) {
        this.criarNotificacao({
          tipo: 'area_critica',
          titulo: `${areasCriticas.length} área(s) crítica(s) identificada(s)`,
          mensagem: `${areasCriticas.map(([area, count]) => `${area} (${count} NCs)`).join(', ')}.`,
          prioridade: 'media',
          dados: { areasCriticas },
          acao: `/nao-conformidades?analytics=areas`
        });
      }
    }
  }

  // Criar nova notificação
  private criarNotificacao(dados: Omit<NaoConformidadeNotificacao, 'id' | 'data_criacao' | 'lida'>): void {
    const notificacao: NaoConformidadeNotificacao = {
      id: `nc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...dados,
      data_criacao: new Date(),
      lida: false
    };

    // Verificar se já existe notificação similar (evitar duplicatas)
    const existeSimilar = this.notificacoes.some(n => 
      n.tipo === notificacao.tipo && 
      n.titulo === notificacao.titulo &&
      new Date().getTime() - n.data_criacao.getTime() < 60 * 60 * 1000 // 1 hora
    );

    if (!existeSimilar) {
      this.notificacoes.unshift(notificacao);
      this.saveNotificacoes();

      // Mostrar notificação in-app
      if (this.config.inApp) {
        this.mostrarNotificacaoInApp(notificacao);
      }

      // Aqui seria implementado envio de email e push notifications
      if (this.config.email) {
        // this.enviarEmail(notificacao);
      }

      if (this.config.push) {
        // this.enviarPushNotification(notificacao);
      }
    }
  }

  // Mostrar notificação in-app
  private mostrarNotificacaoInApp(notificacao: NaoConformidadeNotificacao): void {
    const getIcon = () => {
      switch (notificacao.prioridade) {
        case 'critica': return '🔴';
        case 'alta': return '🟠';
        case 'media': return '🟡';
        case 'baixa': return '🟢';
        default: return 'ℹ️';
      }
    };

    // Usar toast simples em vez de custom para evitar JSX em arquivo .ts
    toast.success(`${getIcon()} ${notificacao.titulo}`, {
      description: notificacao.mensagem,
      duration: 6000,
      position: 'top-right'
    });
  }

  // Métodos públicos
  public getNotificacoes(): NaoConformidadeNotificacao[] {
    return this.notificacoes;
  }

  public getNotificacoesNaoLidas(): NaoConformidadeNotificacao[] {
    return this.notificacoes.filter(n => !n.lida);
  }

  public marcarComoLida(id: string): void {
    const notificacao = this.notificacoes.find(n => n.id === id);
    if (notificacao) {
      notificacao.lida = true;
      this.saveNotificacoes();
    }
  }

  public marcarTodasComoLidas(): void {
    this.notificacoes.forEach(n => n.lida = true);
    this.saveNotificacoes();
  }

  public removerNotificacao(id: string): void {
    this.notificacoes = this.notificacoes.filter(n => n.id !== id);
    this.saveNotificacoes();
  }

  public limparNotificacoes(): void {
    this.notificacoes = [];
    this.saveNotificacoes();
  }

  public getConfig(): NaoConformidadesNotificacoesConfig {
    return { ...this.config };
  }

  public atualizarConfig(novaConfig: Partial<NaoConformidadesNotificacoesConfig>): void {
    this.config = { ...this.config, ...novaConfig };
    this.saveConfig();
    this.startPeriodicChecks();
  }

  public ativar(): void {
    this.config.ativo = true;
    this.saveConfig();
    this.startPeriodicChecks();
  }

  public desativar(): void {
    this.config.ativo = false;
    this.saveConfig();
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public destruir(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

// Instância singleton
export const naoConformidadesNotificacoesService = new NaoConformidadesNotificacoesService();
