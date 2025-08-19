export interface EnsaioEnhancement {
  id: string;
  type: 'performance' | 'quality' | 'automation' | 'analytics';
  title: string;
  description: string;
  implementation: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

export class EnsaioEnhancements {
  private static enhancements: EnsaioEnhancement[] = [
    // PERFORMANCE
    {
      id: 'perf-001',
      type: 'performance',
      title: 'Pesquisa Avançada com IA',
      description: 'Implementar pesquisa semântica e sugestões inteligentes',
      implementation: 'Integrar AdvancedSearch com indexação específica de ensaios',
      impact: 'high',
      effort: 'medium',
      status: 'pending'
    },
    {
      id: 'perf-002',
      type: 'performance',
      title: 'Lazy Loading Otimizado',
      description: 'Carregamento progressivo de ensaios com virtualização',
      implementation: 'Implementar react-window para listas grandes',
      impact: 'high',
      effort: 'low',
      status: 'pending'
    },
    {
      id: 'perf-003',
      type: 'performance',
      title: 'Cache Inteligente',
      description: 'Sistema de cache com invalidação automática',
      implementation: 'React Query com cache persistente',
      impact: 'medium',
      effort: 'low',
      status: 'pending'
    },

    // QUALIDADE
    {
      id: 'qual-001',
      type: 'quality',
      title: 'Validação Avançada',
      description: 'Validação em tempo real com regras de negócio',
      implementation: 'Zod schemas com validação customizada',
      impact: 'high',
      effort: 'medium',
      status: 'pending'
    },
    {
      id: 'qual-002',
      type: 'quality',
      title: 'Workflow de Aprovação',
      description: 'Sistema de aprovação em múltiplas etapas',
      implementation: 'Estado machine com transições automáticas',
      impact: 'high',
      effort: 'high',
      status: 'pending'
    },
    {
      id: 'qual-003',
      type: 'quality',
      title: 'Audit Trail Completo',
      description: 'Registo de todas as alterações e ações',
      implementation: 'Logging automático com histórico visual',
      impact: 'medium',
      effort: 'medium',
      status: 'pending'
    },

    // AUTOMAÇÃO
    {
      id: 'auto-001',
      type: 'automation',
      title: 'Notificações Inteligentes',
      description: 'Alertas automáticos baseados em regras',
      implementation: 'Sistema de eventos com templates personalizáveis',
      impact: 'high',
      effort: 'medium',
      status: 'pending'
    },
    {
      id: 'auto-002',
      type: 'automation',
      title: 'Relatórios Automáticos',
      description: 'Geração automática de relatórios periódicos',
      implementation: 'Cron jobs com templates dinâmicos',
      impact: 'medium',
      effort: 'high',
      status: 'pending'
    },
    {
      id: 'auto-003',
      type: 'automation',
      title: 'Importação em Lote',
      description: 'Upload e processamento de múltiplos ensaios',
      implementation: 'Drag & drop com validação em lote',
      impact: 'medium',
      effort: 'medium',
      status: 'pending'
    },

    // ANALYTICS
    {
      id: 'anal-001',
      type: 'analytics',
      title: 'Dashboard de Métricas',
      description: 'Visualização avançada de KPIs de ensaios',
      implementation: 'Gráficos interativos com drill-down',
      impact: 'high',
      effort: 'medium',
      status: 'pending'
    },
    {
      id: 'anal-002',
      type: 'analytics',
      title: 'Análise de Tendências',
      description: 'Identificação de padrões e anomalias',
      implementation: 'Algoritmos de ML para deteção de outliers',
      impact: 'medium',
      effort: 'high',
      status: 'pending'
    },
    {
      id: 'anal-003',
      type: 'analytics',
      title: 'Comparação de Laboratórios',
      description: 'Benchmarking automático entre laboratórios',
      implementation: 'Métricas comparativas com rankings',
      impact: 'medium',
      effort: 'medium',
      status: 'pending'
    }
  ];

  // Obter todas as melhorias
  static getAllEnhancements(): EnsaioEnhancement[] {
    return this.enhancements;
  }

  // Obter melhorias por tipo
  static getEnhancementsByType(type: EnsaioEnhancement['type']): EnsaioEnhancement[] {
    return this.enhancements.filter(e => e.type === type);
  }

  // Obter melhorias por prioridade (impacto alto + esforço baixo)
  static getHighPriorityEnhancements(): EnsaioEnhancement[] {
    return this.enhancements.filter(e => 
      e.impact === 'high' && e.effort === 'low'
    );
  }

  // Obter roadmap de implementação
  static getImplementationRoadmap(): EnsaioEnhancement[] {
    return this.enhancements.sort((a, b) => {
      // Priorizar por impacto e esforço
      const aScore = this.calculatePriorityScore(a);
      const bScore = this.calculatePriorityScore(b);
      return bScore - aScore;
    });
  }

  // Calcular score de prioridade
  private static calculatePriorityScore(enhancement: EnsaioEnhancement): number {
    const impactScore = { high: 3, medium: 2, low: 1 }[enhancement.impact];
    const effortScore = { high: 1, medium: 2, low: 3 }[enhancement.effort];
    return impactScore * effortScore;
  }

  // Marcar melhoria como em progresso
  static markInProgress(id: string): void {
    const enhancement = this.enhancements.find(e => e.id === id);
    if (enhancement) {
      enhancement.status = 'in-progress';
    }
  }

  // Marcar melhoria como concluída
  static markCompleted(id: string): void {
    const enhancement = this.enhancements.find(e => e.id === id);
    if (enhancement) {
      enhancement.status = 'completed';
    }
  }

  // Obter estatísticas de progresso
  static getProgressStats() {
    const total = this.enhancements.length;
    const completed = this.enhancements.filter(e => e.status === 'completed').length;
    const inProgress = this.enhancements.filter(e => e.status === 'in-progress').length;
    const pending = this.enhancements.filter(e => e.status === 'pending').length;

    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate: Math.round((completed / total) * 100)
    };
  }

  // Obter próximas melhorias recomendadas
  static getNextRecommendations(count: number = 3): EnsaioEnhancement[] {
    return this.getImplementationRoadmap()
      .filter(e => e.status === 'pending')
      .slice(0, count);
  }
}

// Serviços específicos para ensaios
export class EnsaioServices {
  // Validação avançada de ensaios
  static validateEnsaio(ensaio: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validações básicas
    if (!ensaio.codigo?.trim()) {
      errors.push('Código do ensaio é obrigatório');
    }

    if (!ensaio.tipo?.trim()) {
      errors.push('Tipo de ensaio é obrigatório');
    }

    if (!ensaio.data_ensaio) {
      errors.push('Data do ensaio é obrigatória');
    }

    // Validações de negócio
    if (ensaio.data_ensaio && new Date(ensaio.data_ensaio) > new Date()) {
      errors.push('Data do ensaio não pode ser futura');
    }

    if (ensaio.resultado && !['aprovado', 'reprovado', 'pendente'].includes(ensaio.resultado)) {
      errors.push('Resultado deve ser aprovado, reprovado ou pendente');
    }

    // Validações de formato
    if (ensaio.codigo && !/^[A-Z]{2,3}-\d{4}-\d{2}$/.test(ensaio.codigo)) {
      errors.push('Código deve seguir o formato XX-YYYY-ZZ');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Cálculo de métricas de qualidade
  static calculateQualityMetrics(ensaios: any[]) {
    const total = ensaios.length;
    if (total === 0) return { total: 0, aprovados: 0, reprovados: 0, pendentes: 0, taxaAprovacao: 0 };

    const aprovados = ensaios.filter(e => e.resultado === 'aprovado').length;
    const reprovados = ensaios.filter(e => e.resultado === 'reprovado').length;
    const pendentes = ensaios.filter(e => e.resultado === 'pendente').length;

    return {
      total,
      aprovados,
      reprovados,
      pendentes,
      taxaAprovacao: Math.round((aprovados / total) * 100)
    };
  }

  // Análise de tendências
  static analyzeTrends(ensaios: any[]) {
    const monthlyData = ensaios.reduce((acc, ensaio) => {
      const month = new Date(ensaio.data_ensaio).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = { total: 0, aprovados: 0, reprovados: 0 };
      }
      acc[month].total++;
      if (ensaio.resultado === 'aprovado') acc[month].aprovados++;
      if (ensaio.resultado === 'reprovado') acc[month].reprovados++;
      return acc;
    }, {});

    return Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
      month,
      ...data,
      taxaAprovacao: Math.round((data.aprovados / data.total) * 100)
    }));
  }

  // Deteção de anomalias
  static detectAnomalies(ensaios: any[]) {
    const recentEnsaios = ensaios
      .filter(e => new Date(e.data_ensaio) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .slice(-50);

    const taxaMedia = this.calculateQualityMetrics(recentEnsaios).taxaAprovacao;
    const anomalias = [];

    // Detetar laboratórios com performance muito baixa
    const labPerformance = recentEnsaios.reduce((acc, ensaio) => {
      if (!acc[ensaio.laboratorio]) {
        acc[ensaio.laboratorio] = { total: 0, aprovados: 0 };
      }
      acc[ensaio.laboratorio].total++;
      if (ensaio.resultado === 'aprovado') acc[ensaio.laboratorio].aprovados++;
      return acc;
    }, {});

    Object.entries(labPerformance).forEach(([lab, data]: [string, any]) => {
      const taxaLab = Math.round((data.aprovados / data.total) * 100);
      if (taxaLab < taxaMedia - 20 && data.total >= 5) {
        anomalias.push({
          type: 'laboratorio_baixa_performance',
          laboratorio: lab,
          taxa: taxaLab,
          media: taxaMedia,
          diferenca: taxaMedia - taxaLab
        });
      }
    });

    return anomalias;
  }

  // Geração de relatórios automáticos
  static generateAutoReport(ensaios: any[]) {
    const metrics = this.calculateQualityMetrics(ensaios);
    const trends = this.analyzeTrends(ensaios);
    const anomalies = this.detectAnomalies(ensaios);

    return {
      timestamp: new Date().toISOString(),
      metrics,
      trends: trends.slice(-6), // Últimos 6 meses
      anomalies,
      recommendations: this.generateRecommendations(metrics, anomalies)
    };
  }

  // Geração de recomendações
  private static generateRecommendations(metrics: any, anomalies: any[]) {
    const recommendations = [];

    if (metrics.taxaAprovacao < 80) {
      recommendations.push({
        priority: 'high',
        title: 'Melhorar Taxa de Aprovação',
        description: `Taxa atual de ${metrics.taxaAprovacao}% está abaixo do objetivo de 80%`,
        action: 'Revisar processos de controlo de qualidade'
      });
    }

    if (anomalies.length > 0) {
      recommendations.push({
        priority: 'medium',
        title: 'Investigar Laboratórios com Baixa Performance',
        description: `${anomalies.length} laboratório(s) com performance abaixo da média`,
        action: 'Auditoria aos laboratórios identificados'
      });
    }

    if (metrics.pendentes > metrics.total * 0.1) {
      recommendations.push({
        priority: 'medium',
        title: 'Reduzir Ensaios Pendentes',
        description: `${Math.round((metrics.pendentes / metrics.total) * 100)}% dos ensaios estão pendentes`,
        action: 'Implementar sistema de follow-up automático'
      });
    }

    return recommendations;
  }
}
