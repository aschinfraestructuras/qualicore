export interface RFIEnhancement {
  id: string;
  type: 'performance' | 'quality' | 'automation' | 'analytics';
  title: string;
  description: string;
  implementation: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

export class RFIEnhancements {
  private static enhancements: RFIEnhancement[] = [
    // PERFORMANCE
    {
      id: 'perf-001',
      type: 'performance',
      title: 'Pesquisa Avançada com IA',
      description: 'Implementar pesquisa semântica e sugestões inteligentes para RFIs',
      implementation: 'Integrar AdvancedSearch com indexação específica de RFIs',
      impact: 'high',
      effort: 'medium',
      status: 'pending'
    },
    {
      id: 'perf-002',
      type: 'performance',
      title: 'Lazy Loading Otimizado',
      description: 'Carregamento progressivo de RFIs com virtualização',
      implementation: 'Implementar react-window para listas grandes de RFIs',
      impact: 'high',
      effort: 'low',
      status: 'pending'
    },
    {
      id: 'perf-003',
      type: 'performance',
      title: 'Cache Inteligente',
      description: 'Sistema de cache com invalidação automática para RFIs',
      implementation: 'React Query com cache persistente para RFIs',
      impact: 'medium',
      effort: 'low',
      status: 'completed'
    },

    // QUALIDADE
    {
      id: 'qual-001',
      type: 'quality',
      title: 'Workflow de Aprovação RFI',
      description: 'Sistema de aprovação em múltiplas etapas para RFIs',
      implementation: 'Estado machine com transições automáticas para RFIs',
      impact: 'high',
      effort: 'high',
      status: 'pending'
    },
    {
      id: 'qual-002',
      type: 'quality',
      title: 'Validação Avançada RFI',
      description: 'Validação em tempo real com regras de negócio específicas',
      implementation: 'Zod schemas com validação customizada para RFIs',
      impact: 'high',
      effort: 'medium',
      status: 'pending'
    },
    {
      id: 'qual-003',
      type: 'quality',
      title: 'Audit Trail RFI',
      description: 'Registo de todas as alterações e ações em RFIs',
      implementation: 'Logging automático com histórico visual para RFIs',
      impact: 'medium',
      effort: 'medium',
      status: 'pending'
    },

    // AUTOMAÇÃO
    {
      id: 'auto-001',
      type: 'automation',
      title: 'Notificações Inteligentes RFI',
      description: 'Alertas automáticos baseados em prioridade e prazo',
      implementation: 'Sistema de eventos com templates personalizáveis para RFIs',
      impact: 'high',
      effort: 'medium',
      status: 'pending'
    },
    {
      id: 'auto-002',
      type: 'automation',
      title: 'Relatórios Automáticos RFI',
      description: 'Geração automática de relatórios periódicos de RFIs',
      implementation: 'Cron jobs com templates dinâmicos para RFIs',
      impact: 'medium',
      effort: 'high',
      status: 'pending'
    },
    {
      id: 'auto-003',
      type: 'automation',
      title: 'Escalação Automática',
      description: 'Escalação automática de RFIs urgentes não respondidos',
      implementation: 'Sistema de alertas com escalação hierárquica',
      impact: 'high',
      effort: 'medium',
      status: 'pending'
    },

    // ANALYTICS
    {
      id: 'analytics-001',
      type: 'analytics',
      title: 'Dashboard de Métricas RFI',
      description: 'Dashboard avançado com KPIs e métricas de RFIs',
      implementation: 'Gráficos interativos com métricas em tempo real',
      impact: 'high',
      effort: 'medium',
      status: 'pending'
    },
    {
      id: 'analytics-002',
      type: 'analytics',
      title: 'Análise de Tendências RFI',
      description: 'Análise de tendências e padrões em RFIs',
      implementation: 'Machine learning para análise preditiva de RFIs',
      impact: 'medium',
      effort: 'high',
      status: 'pending'
    },
    {
      id: 'analytics-003',
      type: 'analytics',
      title: 'Benchmarking de Performance',
      description: 'Comparação de performance entre diferentes áreas',
      implementation: 'Sistema de benchmarking com métricas comparativas',
      impact: 'medium',
      effort: 'medium',
      status: 'pending'
    }
  ];

  static getAll(): RFIEnhancement[] {
    return this.enhancements;
  }

  static getByType(type: RFIEnhancement['type']): RFIEnhancement[] {
    return this.enhancements.filter(enhancement => enhancement.type === type);
  }

  static getByPriority(): RFIEnhancement[] {
    return this.enhancements.sort((a, b) => {
      const priorityA = this.getPriorityScore(a);
      const priorityB = this.getPriorityScore(b);
      return priorityB - priorityA;
    });
  }

  static getHighPriority(): RFIEnhancement[] {
    return this.enhancements.filter(enhancement => 
      enhancement.impact === 'high' && enhancement.effort === 'low'
    );
  }

  private static getPriorityScore(enhancement: RFIEnhancement): number {
    const impactScores = { high: 3, medium: 2, low: 1 };
    const effortScores = { high: 1, medium: 2, low: 3 };
    
    return impactScores[enhancement.impact] * effortScores[enhancement.effort];
  }

  static getRoadmap(): { phase: string; enhancements: RFIEnhancement[] }[] {
    const highPriority = this.getHighPriority();
    const mediumPriority = this.enhancements.filter(e => 
      !highPriority.includes(e) && (e.impact === 'high' || e.effort === 'low')
    );
    const lowPriority = this.enhancements.filter(e => 
      !highPriority.includes(e) && !mediumPriority.includes(e)
    );

    return [
      { phase: 'Fase 1 - Alto Impacto, Baixo Esforço', enhancements: highPriority },
      { phase: 'Fase 2 - Alto Impacto ou Baixo Esforço', enhancements: mediumPriority },
      { phase: 'Fase 3 - Melhorias Avançadas', enhancements: lowPriority }
    ];
  }
}

export class RFIServices {
  static calculateMetrics(rfis: any[]): any {
    const total = rfis.length;
    const pendentes = rfis.filter(r => r.status === 'pendente').length;
    const emAnalise = rfis.filter(r => r.status === 'em_analise').length;
    const respondidos = rfis.filter(r => r.status === 'respondido').length;
    const fechados = rfis.filter(r => r.status === 'fechado').length;
    
    const urgentes = rfis.filter(r => r.prioridade === 'urgente').length;
    const altas = rfis.filter(r => r.prioridade === 'alta').length;
    const medias = rfis.filter(r => r.prioridade === 'media').length;
    const baixas = rfis.filter(r => r.prioridade === 'baixa').length;

    const tempoMedioResposta = this.calculateAverageResponseTime(rfis);
    const taxaResolucao = total > 0 ? ((respondidos + fechados) / total) * 100 : 0;
    const impactoCustoTotal = rfis.reduce((sum, r) => sum + (r.impacto_custo || 0), 0);
    const impactoPrazoTotal = rfis.reduce((sum, r) => sum + (r.impacto_prazo || 0), 0);

    return {
      total,
      pendentes,
      emAnalise,
      respondidos,
      fechados,
      urgentes,
      altas,
      medias,
      baixas,
      tempoMedioResposta,
      taxaResolucao,
      impactoCustoTotal,
      impactoPrazoTotal,
      tendencias: this.calculateTrends(rfis),
      anomalias: this.detectAnomalies(rfis)
    };
  }

  private static calculateAverageResponseTime(rfis: any[]): number {
    const rfisComResposta = rfis.filter(r => r.data_resposta && r.data_solicitacao);
    if (rfisComResposta.length === 0) return 0;

    const tempos = rfisComResposta.map(r => {
      const solicitacao = new Date(r.data_solicitacao);
      const resposta = new Date(r.data_resposta);
      return (resposta.getTime() - solicitacao.getTime()) / (1000 * 60 * 60 * 24); // dias
    });

    return tempos.reduce((sum, tempo) => sum + tempo, 0) / tempos.length;
  }

  private static calculateTrends(rfis: any[]): any {
    // Agrupar por mês
    const rfisPorMes = rfis.reduce((acc, rfi) => {
      const mes = new Date(rfi.created_at).toISOString().slice(0, 7);
      if (!acc[mes]) acc[mes] = [];
      acc[mes].push(rfi);
      return acc;
    }, {} as Record<string, any[]>);

    return Object.entries(rfisPorMes).map(([mes, rfisMes]) => ({
      mes,
      total: rfisMes.length,
      pendentes: rfisMes.filter(r => r.status === 'pendente').length,
      respondidos: rfisMes.filter(r => r.status === 'respondido').length,
      fechados: rfisMes.filter(r => r.status === 'fechado').length
    }));
  }

  private static detectAnomalies(rfis: any[]): any[] {
    const anomalias = [];
    
    // RFIs urgentes não respondidos há mais de 3 dias
    const urgentesNaoRespondidos = rfis.filter(r => 
      r.prioridade === 'urgente' && 
      r.status === 'pendente' && 
      this.daysSince(r.data_solicitacao) > 3
    );

    if (urgentesNaoRespondidos.length > 0) {
      anomalias.push({
        tipo: 'urgente_nao_respondido',
        descricao: `${urgentesNaoRespondidos.length} RFIs urgentes não respondidos há mais de 3 dias`,
        rfis: urgentesNaoRespondidos,
        prioridade: 'alta'
      });
    }

    // RFIs com alto impacto de custo
    const altoImpactoCusto = rfis.filter(r => r.impacto_custo && r.impacto_custo > 10000);
    if (altoImpactoCusto.length > 0) {
      anomalias.push({
        tipo: 'alto_impacto_custo',
        descricao: `${altoImpactoCusto.length} RFIs com impacto de custo superior a €10.000`,
        rfis: altoImpactoCusto,
        prioridade: 'media'
      });
    }

    return anomalias;
  }

  private static daysSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  }

  static validateRFI(rfi: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!rfi.titulo || rfi.titulo.trim().length < 5) {
      errors.push('Título deve ter pelo menos 5 caracteres');
    }

    if (!rfi.descricao || rfi.descricao.trim().length < 10) {
      errors.push('Descrição deve ter pelo menos 10 caracteres');
    }

    if (!rfi.solicitante || rfi.solicitante.trim().length === 0) {
      errors.push('Solicitante é obrigatório');
    }

    if (!rfi.destinatario || rfi.destinatario.trim().length === 0) {
      errors.push('Destinatário é obrigatório');
    }

    if (!rfi.data_solicitacao) {
      errors.push('Data de solicitação é obrigatória');
    }

    if (rfi.data_resposta && new Date(rfi.data_resposta) < new Date(rfi.data_solicitacao)) {
      errors.push('Data de resposta não pode ser anterior à data de solicitação');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static generateRecommendations(rfis: any[]): string[] {
    const recommendations = [];
    const metrics = this.calculateMetrics(rfis);

    if (metrics.tempoMedioResposta > 7) {
      recommendations.push('Tempo médio de resposta elevado. Considere implementar alertas automáticos.');
    }

    if (metrics.pendentes > metrics.total * 0.3) {
      recommendations.push('Alto número de RFIs pendentes. Revise o processo de aprovação.');
    }

    if (metrics.urgentes > 0) {
      recommendations.push('Existem RFIs urgentes. Priorize a resposta a estes itens.');
    }

    if (metrics.impactoCustoTotal > 50000) {
      recommendations.push('Impacto de custo total elevado. Analise os RFIs com maior impacto.');
    }

    return recommendations;
  }
}
