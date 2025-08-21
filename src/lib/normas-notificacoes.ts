import type { Norma } from '../types/normas';
import { supabase } from './supabase';

// Tipos de notificação
export type TipoNotificacao = 
  | 'NORMAS_VENCENDO'
  | 'NORMAS_VENCIDAS'
  | 'NORMAS_CRITICAS'
  | 'NORMAS_REVISAO'
  | 'NORMAS_OBSOLETAS'
  | 'CONFORMIDADE_BAIXA'
  | 'ORGANISMO_ATUALIZACAO'
  | 'SISTEMA_ALERTA';

export type PrioridadeNotificacao = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  prioridade: PrioridadeNotificacao;
  titulo: string;
  mensagem: string;
  detalhes?: string;
  acao?: string;
  url?: string;
  dataCriacao: Date;
  dataLeitura?: Date;
  lida: boolean;
  dados?: any;
}

export interface ConfiguracaoNotificacoes {
  ativo: boolean;
  email: boolean;
  push: boolean;
  inApp: boolean;
  tipos: TipoNotificacao[];
  prioridades: PrioridadeNotificacao[];
  frequencia: 'IMEDIATO' | 'DIARIO' | 'SEMANAL';
  horario?: string; // HH:MM
}

export class NormasNotificacoesService {
  private static instance: NormasNotificacoesService;
  private notificacoes: Notificacao[] = [];
  private configuracao: ConfiguracaoNotificacoes = {
    ativo: true,
    email: false,
    push: false,
    inApp: true,
    tipos: ['NORMAS_VENCENDO', 'NORMAS_VENCIDAS', 'NORMAS_CRITICAS'],
    prioridades: ['ALTA', 'CRITICA'],
    frequencia: 'IMEDIATO'
  };

  private constructor() {
    this.carregarConfiguracao();
    this.inicializarNotificacoes();
  }

  static getInstance(): NormasNotificacoesService {
    if (!NormasNotificacoesService.instance) {
      NormasNotificacoesService.instance = new NormasNotificacoesService();
    }
    return NormasNotificacoesService.instance;
  }

  // Carregar configuração do localStorage
  private carregarConfiguracao(): void {
    try {
      const config = localStorage.getItem('normas-notificacoes-config');
      if (config) {
        this.configuracao = { ...this.configuracao, ...JSON.parse(config) };
      }
    } catch (error) {
      console.error('Erro ao carregar configuração de notificações:', error);
    }
  }

  // Salvar configuração no localStorage
  private salvarConfiguracao(): void {
    try {
      localStorage.setItem('normas-notificacoes-config', JSON.stringify(this.configuracao));
    } catch (error) {
      console.error('Erro ao salvar configuração de notificações:', error);
    }
  }

  // Inicializar sistema de notificações
  private async inicializarNotificacoes(): Promise<void> {
    if (!this.configuracao.ativo) return;

    // Carregar notificações existentes
    await this.carregarNotificacoes();

    // Configurar verificação periódica
    setInterval(() => {
      this.verificarAlertas();
    }, 5 * 60 * 1000); // Verificar a cada 5 minutos

    // Verificação inicial
    setTimeout(() => {
      this.verificarAlertas();
    }, 1000);
  }

  // Carregar notificações do localStorage
  private async carregarNotificacoes(): Promise<void> {
    try {
      const notificacoes = localStorage.getItem('normas-notificacoes');
      if (notificacoes) {
        this.notificacoes = JSON.parse(notificacoes).map((n: any) => ({
          ...n,
          dataCriacao: new Date(n.dataCriacao),
          dataLeitura: n.dataLeitura ? new Date(n.dataLeitura) : undefined
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      this.notificacoes = [];
    }
  }

  // Salvar notificações no localStorage
  private salvarNotificacoes(): void {
    try {
      localStorage.setItem('normas-notificacoes', JSON.stringify(this.notificacoes));
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  }

  // Verificar alertas e criar notificações
  async verificarAlertas(): Promise<void> {
    if (!this.configuracao.ativo) return;

    try {
      // Buscar normas da base de dados
      const { data: normas, error } = await supabase
        .from('normas')
        .select('*')
        .order('data_entrada_vigor', { ascending: true });

      if (error) {
        console.error('Erro ao buscar normas para alertas:', error);
        return;
      }

      if (!normas) return;

      // Verificar diferentes tipos de alertas
      await this.verificarNormasVencendo(normas);
      await this.verificarNormasVencidas(normas);
      await this.verificarNormasCriticas(normas);
      await this.verificarNormasRevisao(normas);
      await this.verificarNormasObsoletas(normas);
      await this.verificarConformidadeGeral(normas);

    } catch (error) {
      console.error('Erro ao verificar alertas:', error);
    }
  }

  // Verificar normas vencendo em breve (30 dias)
  private async verificarNormasVencendo(normas: Norma[]): Promise<void> {
    if (!this.configuracao.tipos.includes('NORMAS_VENCENDO')) return;

    const hoje = new Date();
    const trintaDias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);

    const normasVencendo = normas.filter(norma => {
      const dataVencimento = new Date(norma.data_entrada_vigor);
      return dataVencimento > hoje && dataVencimento <= trintaDias;
    });

    for (const norma of normasVencendo) {
      const diasAteVencimento = Math.ceil(
        (new Date(norma.data_entrada_vigor).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
      );

      const prioridade: PrioridadeNotificacao = diasAteVencimento <= 7 ? 'CRITICA' : 
                                               diasAteVencimento <= 15 ? 'ALTA' : 'MEDIA';

      if (this.configuracao.prioridades.includes(prioridade)) {
        await this.criarNotificacao({
          tipo: 'NORMAS_VENCENDO',
          prioridade,
          titulo: `Norma vencendo em ${diasAteVencimento} dias`,
          mensagem: `A norma ${norma.codigo} - ${norma.titulo} vence em ${diasAteVencimento} dias`,
          detalhes: `Data de vencimento: ${new Date(norma.data_entrada_vigor).toLocaleDateString('pt-PT')}`,
          acao: 'Verificar norma',
          url: `/normas/${norma.id}`,
          dados: { normaId: norma.id, diasAteVencimento }
        });
      }
    }
  }

  // Verificar normas já vencidas
  private async verificarNormasVencidas(normas: Norma[]): Promise<void> {
    if (!this.configuracao.tipos.includes('NORMAS_VENCIDAS')) return;

    const hoje = new Date();
    const normasVencidas = normas.filter(norma => {
      const dataVencimento = new Date(norma.data_entrada_vigor);
      return dataVencimento < hoje;
    });

    if (normasVencidas.length > 0) {
      await this.criarNotificacao({
        tipo: 'NORMAS_VENCIDAS',
        prioridade: 'CRITICA',
        titulo: `${normasVencidas.length} norma(s) vencida(s)`,
        mensagem: `Existem ${normasVencidas.length} norma(s) com data de vencimento ultrapassada`,
        detalhes: `Normas: ${normasVencidas.map(n => n.codigo).join(', ')}`,
        acao: 'Verificar normas vencidas',
        url: '/normas?status=vencidas',
        dados: { normasVencidas: normasVencidas.map(n => n.id) }
      });
    }
  }

  // Verificar normas críticas
  private async verificarNormasCriticas(normas: Norma[]): Promise<void> {
    if (!this.configuracao.tipos.includes('NORMAS_CRITICAS')) return;

    const normasCriticas = normas.filter(norma => norma.prioridade === 'CRITICA');

    if (normasCriticas.length > 0) {
      await this.criarNotificacao({
        tipo: 'NORMAS_CRITICAS',
        prioridade: 'ALTA',
        titulo: `${normasCriticas.length} norma(s) crítica(s)`,
        mensagem: `Existem ${normasCriticas.length} norma(s) com prioridade crítica`,
        detalhes: `Normas: ${normasCriticas.map(n => n.codigo).join(', ')}`,
        acao: 'Verificar normas críticas',
        url: '/normas?prioridade=CRITICA',
        dados: { normasCriticas: normasCriticas.map(n => n.id) }
      });
    }
  }

  // Verificar normas em revisão
  private async verificarNormasRevisao(normas: Norma[]): Promise<void> {
    if (!this.configuracao.tipos.includes('NORMAS_REVISAO')) return;

    const normasRevisao = normas.filter(norma => norma.status === 'REVISAO');

    if (normasRevisao.length > 0) {
      await this.criarNotificacao({
        tipo: 'NORMAS_REVISAO',
        prioridade: 'MEDIA',
        titulo: `${normasRevisao.length} norma(s) em revisão`,
        mensagem: `Existem ${normasRevisao.length} norma(s) em processo de revisão`,
        detalhes: `Normas: ${normasRevisao.map(n => n.codigo).join(', ')}`,
        acao: 'Verificar normas em revisão',
        url: '/normas?status=REVISAO',
        dados: { normasRevisao: normasRevisao.map(n => n.id) }
      });
    }
  }

  // Verificar normas obsoletas
  private async verificarNormasObsoletas(normas: Norma[]): Promise<void> {
    if (!this.configuracao.tipos.includes('NORMAS_OBSOLETAS')) return;

    const normasObsoletas = normas.filter(norma => norma.status === 'OBSOLETA');

    if (normasObsoletas.length > 0) {
      await this.criarNotificacao({
        tipo: 'NORMAS_OBSOLETAS',
        prioridade: 'BAIXA',
        titulo: `${normasObsoletas.length} norma(s) obsoleta(s)`,
        mensagem: `Existem ${normasObsoletas.length} norma(s) marcadas como obsoletas`,
        detalhes: `Normas: ${normasObsoletas.map(n => n.codigo).join(', ')}`,
        acao: 'Verificar normas obsoletas',
        url: '/normas?status=OBSOLETA',
        dados: { normasObsoletas: normasObsoletas.map(n => n.id) }
      });
    }
  }

  // Verificar conformidade geral
  private async verificarConformidadeGeral(normas: Norma[]): Promise<void> {
    if (!this.configuracao.tipos.includes('CONFORMIDADE_BAIXA')) return;

    const normasAtivas = normas.filter(n => n.status === 'ATIVA');
    const taxaConformidade = normasAtivas.length > 0 ? 
      (normasAtivas.length / normas.length) * 100 : 0;

    if (taxaConformidade < 80) {
      await this.criarNotificacao({
        tipo: 'CONFORMIDADE_BAIXA',
        prioridade: 'ALTA',
        titulo: 'Taxa de conformidade baixa',
        mensagem: `A taxa de conformidade das normas está em ${taxaConformidade.toFixed(1)}%`,
        detalhes: `${normasAtivas.length} de ${normas.length} normas estão ativas`,
        acao: 'Analisar conformidade',
        url: '/normas/dashboard',
        dados: { taxaConformidade, normasAtivas: normasAtivas.length, totalNormas: normas.length }
      });
    }
  }

  // Criar nova notificação
  async criarNotificacao(dados: Omit<Notificacao, 'id' | 'dataCriacao' | 'lida'>): Promise<void> {
    const notificacao: Notificacao = {
      id: this.gerarId(),
      ...dados,
      dataCriacao: new Date(),
      lida: false
    };

    // Verificar se já existe notificação similar (evitar duplicados)
    const notificacaoExistente = this.notificacoes.find(n => 
      n.tipo === notificacao.tipo && 
      n.dados?.normaId === notificacao.dados?.normaId &&
      !n.lida &&
      (new Date().getTime() - n.dataCriacao.getTime()) < 24 * 60 * 60 * 1000 // 24 horas
    );

    if (notificacaoExistente) {
      return; // Não criar duplicado
    }

    this.notificacoes.unshift(notificacao);
    this.salvarNotificacoes();

    // Mostrar notificação se configurado
    if (this.configuracao.inApp) {
      this.mostrarNotificacaoInApp(notificacao);
    }

    // Enviar email se configurado
    if (this.configuracao.email) {
      await this.enviarEmailNotificacao(notificacao);
    }

    // Enviar push se configurado
    if (this.configuracao.push) {
      await this.enviarPushNotificacao(notificacao);
    }
  }

  // Gerar ID único para notificação
  private gerarId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Mostrar notificação na aplicação
  private mostrarNotificacaoInApp(notificacao: Notificacao): void {
    // Usar toast ou sistema de notificações da aplicação
    if (typeof window !== 'undefined' && window.toast) {
      window.toast({
        title: notificacao.titulo,
        description: notificacao.mensagem,
        status: this.getStatusFromPrioridade(notificacao.prioridade),
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    }
  }

  // Enviar email de notificação
  private async enviarEmailNotificacao(notificacao: Notificacao): Promise<void> {
    // Implementar integração com serviço de email
    console.log('Enviando email de notificação:', notificacao);
  }

  // Enviar push notification
  private async enviarPushNotificacao(notificacao: Notificacao): Promise<void> {
    // Implementar integração com push notifications
    console.log('Enviando push notification:', notificacao);
  }

  // Obter status do toast baseado na prioridade
  private getStatusFromPrioridade(prioridade: PrioridadeNotificacao): string {
    switch (prioridade) {
      case 'CRITICA': return 'error';
      case 'ALTA': return 'warning';
      case 'MEDIA': return 'info';
      case 'BAIXA': return 'success';
      default: return 'info';
    }
  }

  // Obter todas as notificações
  getNotificacoes(filtros?: {
    lidas?: boolean;
    tipo?: TipoNotificacao;
    prioridade?: PrioridadeNotificacao;
    limit?: number;
  }): Notificacao[] {
    let notificacoes = [...this.notificacoes];

    if (filtros?.lidas !== undefined) {
      notificacoes = notificacoes.filter(n => n.lida === filtros.lidas);
    }

    if (filtros?.tipo) {
      notificacoes = notificacoes.filter(n => n.tipo === filtros.tipo);
    }

    if (filtros?.prioridade) {
      notificacoes = notificacoes.filter(n => n.prioridade === filtros.prioridade);
    }

    if (filtros?.limit) {
      notificacoes = notificacoes.slice(0, filtros.limit);
    }

    return notificacoes;
  }

  // Obter notificações não lidas
  getNotificacoesNaoLidas(): Notificacao[] {
    return this.getNotificacoes({ lidas: false });
  }

  // Obter contagem de notificações não lidas
  getContagemNaoLidas(): number {
    return this.getNotificacoesNaoLidas().length;
  }

  // Marcar notificação como lida
  marcarComoLida(id: string): void {
    const notificacao = this.notificacoes.find(n => n.id === id);
    if (notificacao) {
      notificacao.lida = true;
      notificacao.dataLeitura = new Date();
      this.salvarNotificacoes();
    }
  }

  // Marcar todas como lidas
  marcarTodasComoLidas(): void {
    this.notificacoes.forEach(n => {
      n.lida = true;
      n.dataLeitura = new Date();
    });
    this.salvarNotificacoes();
  }

  // Excluir notificação
  excluirNotificacao(id: string): void {
    this.notificacoes = this.notificacoes.filter(n => n.id !== id);
    this.salvarNotificacoes();
  }

  // Limpar notificações antigas (mais de 30 dias)
  limparNotificacoesAntigas(): void {
    const trintaDiasAtras = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    this.notificacoes = this.notificacoes.filter(n => 
      n.dataCriacao > trintaDiasAtras
    );
    this.salvarNotificacoes();
  }

  // Obter configuração
  getConfiguracao(): ConfiguracaoNotificacoes {
    return { ...this.configuracao };
  }

  // Atualizar configuração
  atualizarConfiguracao(config: Partial<ConfiguracaoNotificacoes>): void {
    this.configuracao = { ...this.configuracao, ...config };
    this.salvarConfiguracao();
  }

  // Ativar/desativar sistema
  ativarSistema(ativo: boolean): void {
    this.configuracao.ativo = ativo;
    this.salvarConfiguracao();
  }

  // Obter estatísticas de notificações
  getEstatisticas(): {
    total: number;
    naoLidas: number;
    porTipo: Record<TipoNotificacao, number>;
    porPrioridade: Record<PrioridadeNotificacao, number>;
  } {
    const naoLidas = this.getContagemNaoLidas();
    const porTipo: Record<TipoNotificacao, number> = {} as any;
    const porPrioridade: Record<PrioridadeNotificacao, number> = {} as any;

    this.notificacoes.forEach(notificacao => {
      porTipo[notificacao.tipo] = (porTipo[notificacao.tipo] || 0) + 1;
      porPrioridade[notificacao.prioridade] = (porPrioridade[notificacao.prioridade] || 0) + 1;
    });

    return {
      total: this.notificacoes.length,
      naoLidas,
      porTipo,
      porPrioridade
    };
  }
}

// Instância singleton
export const normasNotificacoesService = NormasNotificacoesService.getInstance();
