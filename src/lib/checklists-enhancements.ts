import { Checklist } from "@/types";

export interface ChecklistsEnhancement {
  id: string;
  title: string;
  description: string;
  category: 'performance' | 'analytics' | 'automation' | 'integration' | 'security';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  dependencies?: string[];
  estimatedTime?: string;
  benefits: string[];
}

export class ChecklistsEnhancements {
  private enhancements: ChecklistsEnhancement[] = [
    {
      id: 'cache-inteligente',
      title: 'Cache Inteligente',
      description: 'Sistema de cache avançado para otimizar performance e reduzir latência',
      category: 'performance',
      priority: 'high',
      status: 'pending',
      impact: 'high',
      effort: 'medium',
      estimatedTime: '2-3 dias',
      benefits: [
        'Redução de 70% no tempo de carregamento',
        'Melhoria na experiência do usuário',
        'Redução de carga no servidor'
      ]
    },
    {
      id: 'dashboard-premium',
      title: 'Dashboard Premium',
      description: 'Dashboard avançado com KPIs, gráficos interativos e métricas em tempo real',
      category: 'analytics',
      priority: 'high',
      status: 'pending',
      impact: 'high',
      effort: 'high',
      estimatedTime: '4-5 dias',
      benefits: [
        'Visão geral completa dos checklists',
        'Análise de tendências e padrões',
        'Tomada de decisão baseada em dados'
      ]
    },
    {
      id: 'analytics-avancados',
      title: 'Analytics Avançados',
      description: 'Sistema de análise preditiva e deteção de anomalias',
      category: 'analytics',
      priority: 'medium',
      status: 'pending',
      impact: 'high',
      effort: 'high',
      estimatedTime: '5-6 dias',
      benefits: [
        'Deteção precoce de problemas',
        'Otimização de processos',
        'Relatórios preditivos'
      ]
    },
    {
      id: 'relatorios-avancados',
      title: 'Relatórios Avançados',
      description: 'Sistema de relatórios profissionais com múltiplos formatos',
      category: 'analytics',
      priority: 'medium',
      status: 'pending',
      impact: 'medium',
      effort: 'medium',
      estimatedTime: '3-4 dias',
      benefits: [
        'Relatórios personalizados',
        'Exportação em múltiplos formatos',
        'Templates profissionais'
      ]
    },
    {
      id: 'automacao-workflow',
      title: 'Automação de Workflow',
      description: 'Automação inteligente de processos de checklist',
      category: 'automation',
      priority: 'medium',
      status: 'pending',
      impact: 'high',
      effort: 'high',
      estimatedTime: '6-7 dias',
      benefits: [
        'Redução de trabalho manual',
        'Processos mais eficientes',
        'Menos erros humanos'
      ]
    },
    {
      id: 'integracao-mobile',
      title: 'Integração Mobile',
      description: 'Sincronização perfeita com aplicações móveis',
      category: 'integration',
      priority: 'medium',
      status: 'pending',
      impact: 'medium',
      effort: 'high',
      estimatedTime: '5-6 dias',
      benefits: [
        'Acesso offline',
        'Sincronização automática',
        'Experiência mobile otimizada'
      ]
    },
    {
      id: 'notificacoes-inteligentes',
      title: 'Notificações Inteligentes',
      description: 'Sistema de notificações baseado em IA',
      category: 'automation',
      priority: 'low',
      status: 'pending',
      impact: 'medium',
      effort: 'medium',
      estimatedTime: '3-4 dias',
      benefits: [
        'Notificações relevantes',
        'Redução de spam',
        'Melhor engajamento'
      ]
    },
    {
      id: 'auditoria-avancada',
      title: 'Auditoria Avançada',
      description: 'Sistema completo de auditoria e rastreabilidade',
      category: 'security',
      priority: 'medium',
      status: 'pending',
      impact: 'high',
      effort: 'medium',
      estimatedTime: '4-5 dias',
      benefits: [
        'Conformidade regulatória',
        'Rastreabilidade completa',
        'Segurança reforçada'
      ]
    },
    {
      id: 'templates-dinamicos',
      title: 'Templates Dinâmicos',
      description: 'Sistema de templates inteligentes e reutilizáveis',
      category: 'automation',
      priority: 'low',
      status: 'pending',
      impact: 'medium',
      effort: 'medium',
      estimatedTime: '3-4 dias',
      benefits: [
        'Criação rápida de checklists',
        'Consistência nos processos',
        'Reutilização de templates'
      ]
    },
    {
      id: 'colaboracao-tempo-real',
      title: 'Colaboração em Tempo Real',
      description: 'Sistema de colaboração e comentários em tempo real',
      category: 'integration',
      priority: 'low',
      status: 'pending',
      impact: 'medium',
      effort: 'high',
      estimatedTime: '5-6 dias',
      benefits: [
        'Colaboração eficiente',
        'Comunicação melhorada',
        'Resolução rápida de problemas'
      ]
    },
    {
      id: 'machine-learning',
      title: 'Machine Learning',
      description: 'Sistema de ML para otimização automática de checklists',
      category: 'analytics',
      priority: 'low',
      status: 'pending',
      impact: 'high',
      effort: 'high',
      estimatedTime: '8-10 dias',
      benefits: [
        'Otimização automática',
        'Previsões inteligentes',
        'Melhoria contínua'
      ]
    },
    {
      id: 'api-avancada',
      title: 'API Avançada',
      description: 'API RESTful completa para integrações externas',
      category: 'integration',
      priority: 'low',
      status: 'pending',
      impact: 'medium',
      effort: 'high',
      estimatedTime: '6-7 dias',
      benefits: [
        'Integração com sistemas externos',
        'Automação de processos',
        'Escalabilidade'
      ]
    }
  ];

  getAll(): ChecklistsEnhancement[] {
    return this.enhancements;
  }

  getByStatus(status: ChecklistsEnhancement['status']): ChecklistsEnhancement[] {
    return this.enhancements.filter(enhancement => enhancement.status === status);
  }

  getByPriority(priority: ChecklistsEnhancement['priority']): ChecklistsEnhancement[] {
    return this.enhancements.filter(enhancement => enhancement.priority === priority);
  }

  getByCategory(category: ChecklistsEnhancement['category']): ChecklistsEnhancement[] {
    return this.enhancements.filter(enhancement => enhancement.category === category);
  }

  updateStatus(id: string, status: ChecklistsEnhancement['status']): void {
    const enhancement = this.enhancements.find(e => e.id === id);
    if (enhancement) {
      enhancement.status = status;
    }
  }

  getRoadmap(): { pending: number; in_progress: number; completed: number } {
    return {
      pending: this.getByStatus('pending').length,
      in_progress: this.getByStatus('in_progress').length,
      completed: this.getByStatus('completed').length
    };
  }
}

export class ChecklistsServices {
  static calculateKPIs(checklists: Checklist[]) {
    const total = checklists.length;
    const completados = checklists.filter(c => c.status === 'completo').length;
    const emProgresso = checklists.filter(c => c.status === 'em_progresso').length;
    const pendentes = checklists.filter(c => c.status === 'pendente').length;
    const conformes = checklists.filter(c => c.estado === 'conforme').length;
    const naoConformes = checklists.filter(c => c.estado === 'nao_conforme').length;

    return {
      total,
      completados,
      emProgresso,
      pendentes,
      conformes,
      naoConformes,
      taxaConformidade: total > 0 ? (conformes / total) * 100 : 0,
      taxaCompletude: total > 0 ? (completados / total) * 100 : 0,
      taxaProgresso: total > 0 ? (emProgresso / total) * 100 : 0
    };
  }

  static calculateTrends(checklists: Checklist[]) {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisMonth = checklists.filter(c => new Date(c.created_at) >= lastMonth);
    const lastMonthData = checklists.filter(c => {
      const date = new Date(c.created_at);
      return date >= new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, lastMonth.getDate()) && date < lastMonth;
    });

    const thisWeek = checklists.filter(c => new Date(c.created_at) >= lastWeek);
    const lastWeekData = checklists.filter(c => {
      const date = new Date(c.created_at);
      return date >= new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000) && date < lastWeek;
    });

    return {
      crescimentoMensal: lastMonthData.length > 0 ? ((thisMonth.length - lastMonthData.length) / lastMonthData.length) * 100 : 0,
      crescimentoSemanal: lastWeekData.length > 0 ? ((thisWeek.length - lastWeekData.length) / lastWeekData.length) * 100 : 0,
      mediaDiaria: thisWeek.length / 7,
      tendencia: thisMonth.length > lastMonthData.length ? 'crescente' : 'decrescente'
    };
  }

  static detectAnomalies(checklists: Checklist[]) {
    const kpis = this.calculateKPIs(checklists);
    const trends = this.calculateTrends(checklists);
    
    const anomalies = [];

    // Detectar anomalias na conformidade
    if (kpis.taxaConformidade < 80) {
      anomalies.push({
        type: 'conformidade_baixa',
        severity: 'high',
        message: `Taxa de conformidade baixa: ${kpis.taxaConformidade.toFixed(1)}%`,
        recommendation: 'Revisar processos de inspeção e treinamento da equipe'
      });
    }

    // Detectar anomalias na completude
    if (kpis.taxaCompletude < 70) {
      anomalies.push({
        type: 'completude_baixa',
        severity: 'medium',
        message: `Taxa de completude baixa: ${kpis.taxaCompletude.toFixed(1)}%`,
        recommendation: 'Otimizar fluxo de trabalho e reduzir gargalos'
      });
    }

    // Detectar tendências negativas
    if (trends.crescimentoMensal < -10) {
      anomalies.push({
        type: 'tendencia_negativa',
        severity: 'medium',
        message: `Tendência negativa: ${trends.crescimentoMensal.toFixed(1)}%`,
        recommendation: 'Investigar causas da redução na atividade'
      });
    }

    return anomalies;
  }

  static generateRecommendations(checklists: Checklist[]) {
    const kpis = this.calculateKPIs(checklists);
    const trends = this.calculateTrends(checklists);
    const anomalies = this.detectAnomalies(checklists);

    const recommendations = [];

    // Recomendações baseadas em KPIs
    if (kpis.taxaConformidade < 85) {
      recommendations.push({
        priority: 'high',
        category: 'processo',
        title: 'Melhorar Taxa de Conformidade',
        description: 'Implementar treinamento adicional e revisar procedimentos',
        impact: 'Alto impacto na qualidade geral',
        effort: 'Médio esforço'
      });
    }

    if (kpis.taxaCompletude < 75) {
      recommendations.push({
        priority: 'medium',
        category: 'workflow',
        title: 'Otimizar Fluxo de Trabalho',
        description: 'Identificar e resolver gargalos no processo',
        impact: 'Melhoria na eficiência operacional',
        effort: 'Baixo esforço'
      });
    }

    // Recomendações baseadas em tendências
    if (trends.tendencia === 'decrescente') {
      recommendations.push({
        priority: 'medium',
        category: 'engajamento',
        title: 'Aumentar Engajamento da Equipe',
        description: 'Implementar incentivos e melhorar comunicação',
        impact: 'Aumento na produtividade',
        effort: 'Médio esforço'
      });
    }

    return recommendations;
  }

  static validateChecklist(checklist: Checklist) {
    const errors = [];

    if (!checklist.titulo || checklist.titulo.trim().length < 3) {
      errors.push('Título deve ter pelo menos 3 caracteres');
    }

    if (!checklist.responsavel) {
      errors.push('Responsável é obrigatório');
    }

    if (!checklist.zona) {
      errors.push('Zona é obrigatória');
    }

    if (!checklist.data_inspecao) {
      errors.push('Data de inspeção é obrigatória');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Instância singleton
export const checklistsEnhancements = new ChecklistsEnhancements();
