import type { SubmissaoMaterial } from '@/types/submissaoMateriais';

export interface SubmissaoMateriaisEnhancement {
  id: string;
  type: 'performance' | 'quality' | 'automation' | 'analytics' | 'ui' | 'workflow';
  title: string;
  description: string;
  implementation: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: number;
  estimatedTime?: string;
  dependencies?: string[];
  benefits?: string[];
  risks?: string[];
}

export class SubmissaoMateriaisEnhancements {
  private static enhancements: SubmissaoMateriaisEnhancement[] = [
    // ALTA PRIORIDADE
    {
      id: 'perf-001',
      type: 'performance',
      title: 'Cache Inteligente',
      description: 'Sistema de cache com invalidação automática para submissões',
      implementation: 'Cache com TTL configurável e invalidação automática',
      impact: 'high',
      effort: 'low',
      status: 'pending',
      priority: 1
    },
    {
      id: 'ui-001',
      type: 'ui',
      title: 'Dashboard Premium',
      description: 'Dashboard avançado com analytics e KPIs em tempo real',
      implementation: 'Dashboard com gráficos interativos e métricas avançadas',
      impact: 'high',
      effort: 'medium',
      status: 'pending',
      priority: 2
    },
    {
      id: 'analytics-001',
      type: 'analytics',
      title: 'Analytics Avançados',
      description: 'Sistema de analytics com deteção de anomalias',
      implementation: 'Análise de tendências e deteção de padrões',
      impact: 'high',
      effort: 'medium',
      status: 'pending',
      priority: 3
    },
    {
      id: 'workflow-001',
      type: 'workflow',
      title: 'Workflow Inteligente',
      description: 'Sistema de aprovação com roteamento automático',
      implementation: 'Workflow baseado em regras e prioridades',
      impact: 'high',
      effort: 'high',
      status: 'pending',
      priority: 4
    },

    // MÉDIA PRIORIDADE
    {
      id: 'quality-001',
      type: 'quality',
      title: 'Validação Avançada',
      description: 'Sistema de validação com regras customizáveis',
      implementation: 'Validação em tempo real com feedback imediato',
      impact: 'medium',
      effort: 'medium',
      status: 'pending',
      priority: 5
    },
    {
      id: 'automation-001',
      type: 'automation',
      title: 'Notificações Automáticas',
      description: 'Sistema de notificações inteligentes',
      implementation: 'Notificações baseadas em eventos e deadlines',
      impact: 'medium',
      effort: 'low',
      status: 'pending',
      priority: 6
    },
    {
      id: 'perf-002',
      type: 'performance',
      title: 'Lazy Loading',
      description: 'Carregamento otimizado de listas grandes',
      implementation: 'Virtualização de listas com react-window',
      impact: 'medium',
      effort: 'low',
      status: 'pending',
      priority: 7
    },
    {
      id: 'ui-002',
      type: 'ui',
      title: 'Interface Responsiva',
      description: 'Interface otimizada para todos os dispositivos',
      implementation: 'Design responsivo com breakpoints otimizados',
      impact: 'medium',
      effort: 'medium',
      status: 'pending',
      priority: 8
    },

    // BAIXA PRIORIDADE
    {
      id: 'analytics-002',
      type: 'analytics',
      title: 'Relatórios Avançados',
      description: 'Relatórios com filtros avançados e exportação',
      implementation: 'Sistema de relatórios com múltiplos formatos',
      impact: 'low',
      effort: 'medium',
      status: 'pending',
      priority: 9
    },
    {
      id: 'automation-002',
      type: 'automation',
      title: 'Integração Externa',
      description: 'Integração com sistemas externos',
      implementation: 'APIs para integração com fornecedores',
      impact: 'low',
      effort: 'high',
      status: 'pending',
      priority: 10
    },
    {
      id: 'quality-002',
      type: 'quality',
      title: 'Auditoria Completa',
      description: 'Sistema de auditoria com logs detalhados',
      implementation: 'Logs de auditoria com rastreabilidade completa',
      impact: 'low',
      effort: 'medium',
      status: 'pending',
      priority: 11
    },
    {
      id: 'ui-003',
      type: 'ui',
      title: 'Temas Personalizáveis',
      description: 'Sistema de temas e personalização',
      implementation: 'Temas customizáveis com cores da empresa',
      impact: 'low',
      effort: 'low',
      status: 'pending',
      priority: 12
    }
  ];

  static getAll(): SubmissaoMateriaisEnhancement[] {
    return this.enhancements.sort((a, b) => a.priority - b.priority);
  }

  static getByType(type: SubmissaoMateriaisEnhancement['type']): SubmissaoMateriaisEnhancement[] {
    return this.enhancements.filter(e => e.type === type);
  }

  static getByStatus(status: SubmissaoMateriaisEnhancement['status']): SubmissaoMateriaisEnhancement[] {
    return this.enhancements.filter(e => e.status === status);
  }

  static getByPriority(priority: 'high' | 'medium' | 'low'): SubmissaoMateriaisEnhancement[] {
    return this.enhancements.filter(e => e.impact === priority);
  }

  static getRoadmap() {
    const highPriority = this.getByPriority('high');
    const mediumPriority = this.getByPriority('medium');
    const lowPriority = this.getByPriority('low');

    return [
      {
        phase: 'Fase 1 - Alta Prioridade',
        enhancements: highPriority
      },
      {
        phase: 'Fase 2 - Média Prioridade',
        enhancements: mediumPriority
      },
      {
        phase: 'Fase 3 - Baixa Prioridade',
        enhancements: lowPriority
      }
    ];
  }

  static updateStatus(id: string, status: SubmissaoMateriaisEnhancement['status']): void {
    const enhancement = this.enhancements.find(e => e.id === id);
    if (enhancement) {
      enhancement.status = status;
    }
  }

  static getProgress(): { completed: number; total: number; percentage: number } {
    const total = this.enhancements.length;
    const completed = this.enhancements.filter(e => e.status === 'completed').length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return { completed, total, percentage };
  }
}

export class SubmissaoMateriaisServices {
  static calculateMetrics(submissoes: SubmissaoMaterial[]) {
    if (!submissoes.length) {
      return {
        total: 0,
        aprovadas: 0,
        rejeitadas: 0,
        pendentes: 0,
        emRevisao: 0,
        urgentes: 0,
        criticas: 0,
        taxaAprovacao: 0,
        tempoMedioAprovacao: 0,
        impactoCustoTotal: 0,
        impactoPrazoTotal: 0,
        porTipo: {},
        porCategoria: {},
        porPrioridade: {},
        porEstado: {},
        tendencias: [],
        anomalias: []
      };
    }

    const total = submissoes.length;
    const aprovadas = submissoes.filter(s => s.estado === 'aprovado').length;
    const rejeitadas = submissoes.filter(s => s.estado === 'rejeitado').length;
    const pendentes = submissoes.filter(s => s.estado === 'pendente' || s.estado === 'submetido').length;
    const emRevisao = submissoes.filter(s => s.estado === 'em_revisao' || s.estado === 'aguardando_aprovacao').length;
    const urgentes = submissoes.filter(s => s.urgencia === 'urgente').length;
    const criticas = submissoes.filter(s => s.prioridade === 'critica').length;

    const taxaAprovacao = total > 0 ? (aprovadas / total) * 100 : 0;

    // Calcular tempo médio de aprovação
    const aprovadasComData = submissoes.filter(s => s.estado === 'aprovado' && s.data_aprovacao && s.data_submissao);
    const tempoMedioAprovacao = aprovadasComData.length > 0 
      ? aprovadasComData.reduce((acc, s) => {
          const dataSubmissao = new Date(s.data_submissao);
          const dataAprovacao = new Date(s.data_aprovacao!);
          return acc + (dataAprovacao.getTime() - dataSubmissao.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / aprovadasComData.length
      : 0;

    // Impacto total
    const impactoCustoTotal = submissoes.reduce((acc, s) => acc + (s.impacto_custo || 0), 0);
    const impactoPrazoTotal = submissoes.reduce((acc, s) => acc + (s.impacto_prazo || 0), 0);

    // Análise por tipo
    const porTipo = submissoes.reduce((acc, s) => {
      acc[s.tipo_material] = (acc[s.tipo_material] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por categoria
    const porCategoria = submissoes.reduce((acc, s) => {
      acc[s.categoria] = (acc[s.categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por prioridade
    const porPrioridade = submissoes.reduce((acc, s) => {
      acc[s.prioridade] = (acc[s.prioridade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por estado
    const porEstado = submissoes.reduce((acc, s) => {
      acc[s.estado] = (acc[s.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Tendências temporais
    const tendencias = this.calculateTrends(submissoes);

    // Deteção de anomalias
    const anomalias = this.detectAnomalies(submissoes);

    return {
      total,
      aprovadas,
      rejeitadas,
      pendentes,
      emRevisao,
      urgentes,
      criticas,
      taxaAprovacao,
      tempoMedioAprovacao,
      impactoCustoTotal,
      impactoPrazoTotal,
      porTipo,
      porCategoria,
      porPrioridade,
      porEstado,
      tendencias,
      anomalias
    };
  }

  private static calculateTrends(submissoes: SubmissaoMaterial[]) {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const trends = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = new Date().getMonth() - i;
      const monthName = months[monthIndex < 0 ? monthIndex + 12 : monthIndex];
      
      const monthSubmissoes = submissoes.filter(s => {
        const submissaoDate = new Date(s.data_submissao);
        return submissaoDate.getMonth() === monthIndex && submissaoDate.getFullYear() === new Date().getFullYear();
      });

      const total = monthSubmissoes.length;
      const aprovadas = monthSubmissoes.filter(s => s.estado === 'aprovado').length;
      const pendentes = monthSubmissoes.filter(s => s.estado === 'pendente' || s.estado === 'submetido').length;

      trends.push({
        mes: monthName,
        total,
        aprovadas,
        pendentes,
        taxaAprovacao: total > 0 ? (aprovadas / total) * 100 : 0
      });
    }

    return trends;
  }

  private static detectAnomalies(submissoes: SubmissaoMaterial[]) {
    const anomalias = [];

    // Submissões urgentes há muito tempo
    const urgentesAntigas = submissoes.filter(s => {
      const dataSubmissao = new Date(s.data_submissao);
      const daysDiff = (new Date().getTime() - dataSubmissao.getTime()) / (1000 * 3600 * 24);
      return s.urgencia === 'urgente' && daysDiff > 7 && s.estado !== 'aprovado';
    });

    urgentesAntigas.forEach(s => {
      anomalias.push({
        tipo: 'Urgente Antiga',
        descricao: `Submissão urgente há ${Math.floor((new Date().getTime() - new Date(s.data_submissao).getTime()) / (1000 * 3600 * 24))} dias`,
        prioridade: 'alta',
        submissao: s
      });
    });

    // Submissões com alto impacto
    const altoImpacto = submissoes.filter(s => {
      return (s.impacto_custo && s.impacto_custo > 50000) || (s.impacto_prazo && s.impacto_prazo > 30);
    });

    altoImpacto.forEach(s => {
      anomalias.push({
        tipo: 'Alto Impacto',
        descricao: `Impacto: Custo ${s.impacto_custo || 0}€, Prazo ${s.impacto_prazo || 0} dias`,
        prioridade: 'alta',
        submissao: s
      });
    });

    // Submissões sem documentação
    const semDocumentacao = submissoes.filter(s => {
      return !s.documentos_anexos || s.documentos_anexos.length === 0;
    });

    semDocumentacao.forEach(s => {
      anomalias.push({
        tipo: 'Sem Documentação',
        descricao: 'Submissão sem documentos anexos',
        prioridade: 'media',
        submissao: s
      });
    });

    return anomalias;
  }

  static validateSubmissao(submissao: Partial<SubmissaoMaterial>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!submissao.titulo?.trim()) {
      errors.push('Título é obrigatório');
    }

    if (!submissao.descricao?.trim()) {
      errors.push('Descrição é obrigatória');
    }

    if (!submissao.tipo_material) {
      errors.push('Tipo de material é obrigatório');
    }

    if (!submissao.categoria) {
      errors.push('Categoria é obrigatória');
    }

    if (!submissao.especificacoes_tecnicas?.trim()) {
      errors.push('Especificações técnicas são obrigatórias');
    }

    if (!submissao.justificativa_necessidade?.trim()) {
      errors.push('Justificativa da necessidade é obrigatória');
    }

    if (submissao.impacto_custo && submissao.impacto_custo < 0) {
      errors.push('Impacto de custo não pode ser negativo');
    }

    if (submissao.impacto_prazo && submissao.impacto_prazo < 0) {
      errors.push('Impacto de prazo não pode ser negativo');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static getRecommendations(submissoes: SubmissaoMaterial[]) {
    const recommendations = [];

    const taxaAprovacao = this.calculateMetrics(submissoes).taxaAprovacao;

    if (taxaAprovacao < 70) {
      recommendations.push({
        tipo: 'Taxa de Aprovação Baixa',
        descricao: 'Considerar revisão dos critérios de submissão',
        prioridade: 'alta'
      });
    }

    const tempoMedio = this.calculateMetrics(submissoes).tempoMedioAprovacao;
    if (tempoMedio > 14) {
      recommendations.push({
        tipo: 'Tempo de Aprovação Alto',
        descricao: 'Otimizar processo de aprovação',
        prioridade: 'media'
      });
    }

    const anomalias = this.detectAnomalies(submissoes);
    if (anomalias.length > 5) {
      recommendations.push({
        tipo: 'Muitas Anomalias',
        descricao: 'Revisar processos e critérios',
        prioridade: 'alta'
      });
    }

    return recommendations;
  }
}
