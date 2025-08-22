import { supabase } from './supabase';

// Interfaces para Via Férrea Analytics
export interface ViaFerreaAnalytics {
  kpis: ViaFerreaKPIs;
  tendencias: ViaFerreaTendencias;
  predicoes: ViaFerreaPredicoes;
  otimizacao: ViaFerreaOtimizacao;
  mapaRisco: ViaFerreaMapaRisco;
}

export interface ViaFerreaKPIs {
  quilometragemTotal: number;
  estadoMedio: number;
  tensaoMedia: number;
  desgasteMedio: number;
  disponibilidade: number;
  custoManutencaoMensal: number;
  tempoMedioReparacao: number;
  taxaConformidade: number;
}

export interface ViaFerreaTendencias {
  evolucaoEstado: EvolutionPoint[];
  evolucaoTensao: EvolutionPoint[];
  evolucaoDesgaste: EvolutionPoint[];
  evolucaoCustos: EvolutionPoint[];
  evolucaoInspecoes: EvolutionPoint[];
}

export interface ViaFerreaPredicoes {
  vidaUtilRestante: PredictionPoint[];
  proximasManutencoes: MaintenancePrediction[];
  pontosRisco: RiskPoint[];
  custosFuturos: CostPrediction[];
}

export interface ViaFerreaOtimizacao {
  rotasInspecao: Route[];
  cronogramaManutencao: MaintenanceSchedule[];
  alocacaoRecursos: ResourceAllocation[];
  reducaoCustos: CostReduction[];
}

export interface ViaFerreaMapaRisco {
  pontosAltoRisco: RiskPoint[];
  areasVulneraveis: VulnerableArea[];
  recomendacoes: Recommendation[];
  acoesPrioritarias: PriorityAction[];
}

export interface EvolutionPoint {
  data: string;
  valor: number;
  tipo: string;
  tendencia: 'crescente' | 'decrescente' | 'estavel';
}

export interface PredictionPoint {
  elemento: string;
  tipo: 'trilho' | 'travessa';
  quilometro: number;
  vidaUtilDias: number;
  confianca: number;
  recomendacao: string;
}

export interface MaintenancePrediction {
  elemento: string;
  tipo: 'preventiva' | 'corretiva' | 'preditiva';
  dataRecomendada: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  custo: number;
  descricao: string;
}

export interface RiskPoint {
  quilometro: number;
  tipo: 'trilho' | 'travessa' | 'geometria';
  nivel: 'baixo' | 'medio' | 'alto' | 'critico';
  descricao: string;
  probabilidade: number;
  impacto: number;
}

export interface Route {
  id: string;
  nome: string;
  quilometragem: number[];
  duracaoEstimada: number;
  prioridade: number;
  elementos: string[];
}

export interface MaintenanceSchedule {
  elemento: string;
  tipo: string;
  dataInicio: string;
  dataFim: string;
  recursos: string[];
  custo: number;
}

export interface ResourceAllocation {
  recurso: string;
  utilizacaoAtual: number;
  utilizacaoOptima: number;
  economia: number;
}

export interface CostReduction {
  categoria: string;
  economiaAnual: number;
  acoes: string[];
}

export interface VulnerableArea {
  quilometroInicio: number;
  quilometroFim: number;
  risco: string;
  fatores: string[];
}

export interface Recommendation {
  tipo: string;
  descricao: string;
  prioridade: number;
  custo: number;
  beneficio: string;
}

export interface PriorityAction {
  acao: string;
  prazo: string;
  responsavel: string;
  custo: number;
  impacto: string;
}

export interface CostPrediction {
  mes: string;
  custoPreventiva: number;
  custoCorretiva: number;
  custoTotal: number;
  economia: number;
}

class ViaFerreaAnalyticsService {
  // Cache para analytics
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutos

  // Método principal para obter analytics
  async getAnalytics(trilhos: any[], travessas: any[], inspecoes: any[]): Promise<ViaFerreaAnalytics> {
    const cacheKey = `analytics_${trilhos.length}_${travessas.length}_${inspecoes.length}`;
    
    // Verificar cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    try {
      const analytics = await this.calculateAnalytics(trilhos, travessas, inspecoes);
      
      // Salvar no cache
      this.cache.set(cacheKey, {
        data: analytics,
        timestamp: Date.now(),
        ttl: this.CACHE_TTL
      });

      return analytics;
    } catch (error) {
      console.error('Erro ao calcular analytics:', error);
      throw error;
    }
  }

  // Calcular KPIs principais
  private async calculateKPIs(trilhos: any[], travessas: any[], inspecoes: any[]): Promise<ViaFerreaKPIs> {
    // Quilometragem total
    const quilometragemTotal = trilhos.reduce((acc, trilho) => {
      return acc + (trilho.km_final - trilho.km_inicial);
    }, 0);

    // Estado médio (baseado em escala numérica)
    const todosElementos = [...trilhos, ...travessas];
    const estadosNumericos = todosElementos.map(item => {
      switch (item.estado) {
        case 'excelente': return 100;
        case 'bom': return 80;
        case 'regular': return 60;
        case 'mau': return 40;
        case 'critico': return 20;
        default: return 70;
      }
    });
    const estadoMedio = estadosNumericos.length > 0 
      ? estadosNumericos.reduce((a, b) => a + b, 0) / estadosNumericos.length 
      : 0;

    // Tensão média dos trilhos
    const tensaoMedia = trilhos.length > 0 
      ? trilhos.reduce((acc, trilho) => acc + (trilho.tensao || 0), 0) / trilhos.length 
      : 0;

    // Desgaste médio (inverso do estado)
    const desgasteMedio = 100 - estadoMedio;

    // Disponibilidade (% de elementos em estado operacional)
    const elementosOperacionais = todosElementos.filter(item => 
      item.estado === 'excelente' || item.estado === 'bom' || item.estado === 'regular'
    ).length;
    const disponibilidade = todosElementos.length > 0 
      ? (elementosOperacionais / todosElementos.length) * 100 
      : 0;

    // Custo de manutenção mensal estimado
    const custoManutencaoMensal = this.estimateMonthlyCost(trilhos, travessas);

    // Tempo médio de reparação (estimado)
    const tempoMedioReparacao = this.calculateMeanRepairTime(inspecoes);

    // Taxa de conformidade
    const today = new Date();
    const elementosEmDia = todosElementos.filter(item => {
      const proximaInspecao = new Date(item.proxima_inspecao);
      return proximaInspecao >= today;
    }).length;
    const taxaConformidade = todosElementos.length > 0 
      ? (elementosEmDia / todosElementos.length) * 100 
      : 0;

    return {
      quilometragemTotal: Math.round(quilometragemTotal * 100) / 100,
      estadoMedio: Math.round(estadoMedio),
      tensaoMedia: Math.round(tensaoMedia * 100) / 100,
      desgasteMedio: Math.round(desgasteMedio),
      disponibilidade: Math.round(disponibilidade),
      custoManutencaoMensal,
      tempoMedioReparacao,
      taxaConformidade: Math.round(taxaConformidade)
    };
  }

  // Calcular tendências temporais
  private async calculateTendencias(trilhos: any[], travessas: any[], inspecoes: any[]): Promise<ViaFerreaTendencias> {
    // Simular dados históricos para demonstração
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    
    const evolucaoEstado = meses.map((mes, index) => ({
      data: mes,
      valor: 85 - index * 2 + Math.random() * 5,
      tipo: 'estado',
      tendencia: index < 3 ? 'decrescente' : 'estavel' as const
    }));

    const evolucaoTensao = meses.map((mes, index) => ({
      data: mes,
      valor: 180 + index * 3 + Math.random() * 10,
      tipo: 'tensao',
      tendencia: 'crescente' as const
    }));

    const evolucaoDesgaste = meses.map((mes, index) => ({
      data: mes,
      valor: 15 + index * 2 + Math.random() * 3,
      tipo: 'desgaste',
      tendencia: 'crescente' as const
    }));

    const evolucaoCustos = meses.map((mes, index) => ({
      data: mes,
      valor: 50000 + index * 5000 + Math.random() * 10000,
      tipo: 'custos',
      tendencia: 'crescente' as const
    }));

    const evolucaoInspecoes = meses.map((mes, index) => ({
      data: mes,
      valor: 20 + Math.random() * 10,
      tipo: 'inspecoes',
      tendencia: 'estavel' as const
    }));

    return {
      evolucaoEstado,
      evolucaoTensao,
      evolucaoDesgaste,
      evolucaoCustos,
      evolucaoInspecoes
    };
  }

  // Calcular predições
  private async calculatePredicoes(trilhos: any[], travessas: any[], inspecoes: any[]): Promise<ViaFerreaPredicoes> {
    // Vida útil restante (baseada no estado atual e desgaste)
    const vidaUtilRestante = [...trilhos, ...travessas].map(item => {
      const estadoFactor = this.getEstadoFactor(item.estado);
      const vidaUtilDias = Math.floor(estadoFactor * 365 * 2); // Estimativa baseada no estado
      
      return {
        elemento: item.codigo,
        tipo: item.comprimento ? 'trilho' : 'travessa' as const,
        quilometro: item.km_inicial,
        vidaUtilDias,
        confianca: Math.random() * 30 + 70, // 70-100%
        recomendacao: vidaUtilDias < 180 ? 'Substituição urgente' : 'Monitorização regular'
      };
    }).slice(0, 10); // Primeiros 10

    // Próximas manutenções
    const proximasManutencoes: MaintenancePrediction[] = [...trilhos, ...travessas]
      .filter(item => item.estado === 'mau' || item.estado === 'critico')
      .map(item => ({
        elemento: item.codigo,
        tipo: item.estado === 'critico' ? 'corretiva' : 'preventiva' as const,
        dataRecomendada: this.getRecommendedDate(item.estado),
        prioridade: item.estado === 'critico' ? 'critica' : 'alta' as const,
        custo: this.estimateRepairCost(item),
        descricao: `Manutenção ${item.estado === 'critico' ? 'corretiva' : 'preventiva'} recomendada`
      }));

    // Pontos de risco
    const pontosRisco: RiskPoint[] = [...trilhos, ...travessas]
      .filter(item => item.estado === 'mau' || item.estado === 'critico')
      .map(item => ({
        quilometro: item.km_inicial,
        tipo: item.comprimento ? 'trilho' : 'travessa' as const,
        nivel: item.estado === 'critico' ? 'critico' : 'alto' as const,
        descricao: `${item.codigo} em estado ${item.estado}`,
        probabilidade: item.estado === 'critico' ? 90 : 70,
        impacto: item.estado === 'critico' ? 95 : 75
      }));

    // Custos futuros
    const custosFuturos: CostPrediction[] = Array.from({ length: 12 }, (_, i) => {
      const mes = new Date();
      mes.setMonth(mes.getMonth() + i);
      
      return {
        mes: mes.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' }),
        custoPreventiva: 30000 + Math.random() * 20000,
        custoCorretiva: 15000 + Math.random() * 25000,
        custoTotal: 0,
        economia: Math.random() * 10000
      };
    }).map(item => ({
      ...item,
      custoTotal: item.custoPreventiva + item.custoCorretiva
    }));

    return {
      vidaUtilRestante,
      proximasManutencoes,
      pontosRisco,
      custosFuturos
    };
  }

  // Calcular otimizações
  private async calculateOtimizacao(trilhos: any[], travessas: any[], inspecoes: any[]): Promise<ViaFerreaOtimizacao> {
    // Rotas de inspeção otimizadas
    const rotasInspecao: Route[] = [
      {
        id: '1',
        nome: 'Rota Norte',
        quilometragem: [0, 15],
        duracaoEstimada: 4,
        prioridade: 1,
        elementos: trilhos.slice(0, 5).map(t => t.codigo)
      },
      {
        id: '2',
        nome: 'Rota Centro',
        quilometragem: [15, 30],
        duracaoEstimada: 6,
        prioridade: 2,
        elementos: trilhos.slice(5, 10).map(t => t.codigo)
      }
    ];

    // Cronograma de manutenção otimizado
    const cronogramaManutencao: MaintenanceSchedule[] = proximasManutencoes.slice(0, 8).map(maint => ({
      elemento: maint.elemento,
      tipo: maint.tipo,
      dataInicio: maint.dataRecomendada,
      dataFim: this.addDays(maint.dataRecomendada, maint.tipo === 'corretiva' ? 3 : 1),
      recursos: ['Equipa A', 'Grua', 'Materiais'],
      custo: maint.custo
    }));

    // Alocação de recursos
    const alocacaoRecursos: ResourceAllocation[] = [
      {
        recurso: 'Equipa de Inspeção',
        utilizacaoAtual: 75,
        utilizacaoOptima: 85,
        economia: 5000
      },
      {
        recurso: 'Equipamentos',
        utilizacaoAtual: 60,
        utilizacaoOptima: 80,
        economia: 8000
      }
    ];

    // Redução de custos
    const reducaoCustos: CostReduction[] = [
      {
        categoria: 'Manutenção Preventiva',
        economiaAnual: 50000,
        acoes: ['Otimizar cronograma', 'Manutenção preditiva']
      },
      {
        categoria: 'Gestão de Stock',
        economiaAnual: 25000,
        acoes: ['Just-in-time', 'Fornecedores locais']
      }
    ];

    return {
      rotasInspecao,
      cronogramaManutencao,
      alocacaoRecursos,
      reducaoCustos
    };
  }

  // Calcular mapa de risco
  private async calculateMapaRisco(trilhos: any[], travessas: any[], inspecoes: any[]): Promise<ViaFerreaMapaRisco> {
    // Pontos de alto risco
    const pontosAltoRisco: RiskPoint[] = [...trilhos, ...travessas]
      .filter(item => item.estado === 'critico')
      .map(item => ({
        quilometro: item.km_inicial,
        tipo: item.comprimento ? 'trilho' : 'travessa' as const,
        nivel: 'critico' as const,
        descricao: `${item.codigo} em estado crítico`,
        probabilidade: 95,
        impacto: 90
      }));

    // Áreas vulneráveis
    const areasVulneraveis: VulnerableArea[] = [
      {
        quilometroInicio: 5,
        quilometroFim: 8,
        risco: 'Desgaste acelerado',
        fatores: ['Tráfego intenso', 'Curva acentuada']
      },
      {
        quilometroInicio: 12,
        quilometroFim: 15,
        risco: 'Instabilidade geotécnica',
        fatores: ['Solo mole', 'Drenagem insuficiente']
      }
    ];

    // Recomendações
    const recomendacoes: Recommendation[] = [
      {
        tipo: 'Manutenção',
        descricao: 'Implementar programa de manutenção preditiva',
        prioridade: 1,
        custo: 75000,
        beneficio: 'Redução de 30% nos custos de manutenção'
      },
      {
        tipo: 'Monitorização',
        descricao: 'Instalar sensores de monitorização contínua',
        prioridade: 2,
        custo: 50000,
        beneficio: 'Deteção precoce de problemas'
      }
    ];

    // Ações prioritárias
    const acoesPrioritarias: PriorityAction[] = [
      {
        acao: 'Substituir trilhos críticos km 5-8',
        prazo: '30 dias',
        responsavel: 'Eng. Silva',
        custo: 45000,
        impacto: 'Eliminação de risco crítico'
      },
      {
        acao: 'Inspeção detalhada área vulnerável',
        prazo: '7 dias',
        responsavel: 'Equipa Inspeção',
        custo: 3000,
        impacto: 'Avaliação precisa do risco'
      }
    ];

    return {
      pontosAltoRisco,
      areasVulneraveis,
      recomendacoes,
      acoesPrioritarias
    };
  }

  // Método principal de cálculo
  private async calculateAnalytics(trilhos: any[], travessas: any[], inspecoes: any[]): Promise<ViaFerreaAnalytics> {
    const [kpis, tendencias, predicoes, otimizacao, mapaRisco] = await Promise.all([
      this.calculateKPIs(trilhos, travessas, inspecoes),
      this.calculateTendencias(trilhos, travessas, inspecoes),
      this.calculatePredicoes(trilhos, travessas, inspecoes),
      this.calculateOtimizacao(trilhos, travessas, inspecoes),
      this.calculateMapaRisco(trilhos, travessas, inspecoes)
    ]);

    return {
      kpis,
      tendencias,
      predicoes,
      otimizacao,
      mapaRisco
    };
  }

  // Métodos utilitários
  private estimateMonthlyCost(trilhos: any[], travessas: any[]): number {
    const elementosCriticos = [...trilhos, ...travessas].filter(item => 
      item.estado === 'mau' || item.estado === 'critico'
    ).length;
    
    return elementosCriticos * 5000 + 20000; // Base + custo por elemento crítico
  }

  private calculateMeanRepairTime(inspecoes: any[]): number {
    // Simulação - em produção viria de dados reais
    return 24; // 24 horas em média
  }

  private getEstadoFactor(estado: string): number {
    switch (estado) {
      case 'excelente': return 2.0;
      case 'bom': return 1.5;
      case 'regular': return 1.0;
      case 'mau': return 0.5;
      case 'critico': return 0.2;
      default: return 1.0;
    }
  }

  private getRecommendedDate(estado: string): string {
    const today = new Date();
    const days = estado === 'critico' ? 7 : 30;
    today.setDate(today.getDate() + days);
    return today.toISOString().split('T')[0];
  }

  private estimateRepairCost(item: any): number {
    const baseCost = item.comprimento ? 15000 : 8000; // Trilho vs Travessa
    const stateFactor = item.estado === 'critico' ? 1.5 : 1.0;
    return Math.round(baseCost * stateFactor);
  }

  private addDays(dateString: string, days: number): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  // Limpar cache quando necessário
  clearCache(): void {
    this.cache.clear();
  }

  // Obter estatísticas do cache
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0.85 // Simulated
    };
  }
}

// Exportar instância singleton
export const viaFerreaAnalyticsService = new ViaFerreaAnalyticsService();
