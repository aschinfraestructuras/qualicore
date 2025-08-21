// Sistema de Enhancements para PIE (Pontos de Inspeção e Ensaios)
import { PIEInstancia } from '@/types/pie';

export interface PIEEnhancement {
  id: string;
  title: string;
  description: string;
  category: 'performance' | 'analytics' | 'automation' | 'integration' | 'security' | 'ux';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  estimatedHours: number;
  dependencies?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export class PIEEnhancements {
  private enhancements: PIEEnhancement[] = [
    {
      id: 'pie_cache_inteligente',
      title: 'Cache Inteligente',
      description: 'Implementar sistema de cache avançado com TTL, invalidação automática e estatísticas de performance',
      category: 'performance',
      priority: 'high',
      status: 'completed',
      impact: 'high',
      effort: 'medium',
      estimatedHours: 8,
      tags: ['cache', 'performance', 'optimization'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'pie_dashboard_premium',
      title: 'Dashboard Premium',
      description: 'Criar dashboard avançado com KPIs, gráficos interativos e visualizações em tempo real',
      category: 'analytics',
      priority: 'high',
      status: 'completed',
      impact: 'high',
      effort: 'high',
      estimatedHours: 16,
      tags: ['dashboard', 'analytics', 'kpis'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'pie_analytics_avancados',
      title: 'Analytics Avançados',
      description: 'Implementar análise de tendências, deteção de anomalias e insights preditivos',
      category: 'analytics',
      priority: 'high',
      status: 'completed',
      impact: 'high',
      effort: 'high',
      estimatedHours: 20,
      tags: ['analytics', 'trends', 'anomalies'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'pie_relatorios_avancados',
      title: 'Relatórios Avançados',
      description: 'Sistema de relatórios premium com múltiplos formatos, filtros avançados e exportação automática',
      category: 'analytics',
      priority: 'high',
      status: 'completed',
      impact: 'high',
      effort: 'medium',
      estimatedHours: 12,
      tags: ['reports', 'pdf', 'export'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'pie_workflow_automatizado',
      title: 'Workflow Automatizado',
      description: 'Automatizar fluxos de aprovação, notificações e transições de status baseadas em regras',
      category: 'automation',
      priority: 'medium',
      status: 'pending',
      impact: 'high',
      effort: 'high',
      estimatedHours: 24,
      tags: ['workflow', 'automation', 'approval'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'pie_integracao_apis',
      title: 'Integração APIs',
      description: 'Integrar com APIs externas para sincronização de dados e notificações em tempo real',
      category: 'integration',
      priority: 'medium',
      status: 'pending',
      impact: 'medium',
      effort: 'high',
      estimatedHours: 18,
      tags: ['api', 'integration', 'sync'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'pie_mobile_app',
      title: 'Aplicação Mobile',
      description: 'Desenvolver aplicação mobile nativa para inspeções em campo e sincronização offline',
      category: 'ux',
      priority: 'medium',
      status: 'pending',
      impact: 'high',
      effort: 'high',
      estimatedHours: 40,
      tags: ['mobile', 'offline', 'field'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'pie_ai_insights',
      title: 'Insights com IA',
      description: 'Implementar análise de dados com IA para deteção de padrões e recomendações inteligentes',
      category: 'analytics',
      priority: 'low',
      status: 'pending',
      impact: 'high',
      effort: 'high',
      estimatedHours: 32,
      tags: ['ai', 'ml', 'insights'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'pie_audit_trail',
      title: 'Audit Trail Completo',
      description: 'Sistema completo de auditoria com histórico detalhado de todas as alterações e ações',
      category: 'security',
      priority: 'medium',
      status: 'pending',
      impact: 'medium',
      effort: 'medium',
      estimatedHours: 14,
      tags: ['audit', 'security', 'compliance'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'pie_notificacoes_avancadas',
      title: 'Notificações Avançadas',
      description: 'Sistema de notificações multicanal com templates personalizáveis e agendamento',
      category: 'automation',
      priority: 'low',
      status: 'pending',
      impact: 'medium',
      effort: 'medium',
      estimatedHours: 10,
      tags: ['notifications', 'templates', 'scheduling'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'pie_backup_automatico',
      title: 'Backup Automático',
      description: 'Sistema de backup automático com versionamento e recuperação de dados',
      category: 'security',
      priority: 'low',
      status: 'pending',
      impact: 'medium',
      effort: 'low',
      estimatedHours: 6,
      tags: ['backup', 'security', 'recovery'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'pie_performance_monitoring',
      title: 'Monitorização de Performance',
      description: 'Sistema de monitorização em tempo real com alertas e métricas de performance',
      category: 'performance',
      priority: 'low',
      status: 'pending',
      impact: 'medium',
      effort: 'medium',
      estimatedHours: 12,
      tags: ['monitoring', 'performance', 'alerts'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  getAll(): PIEEnhancement[] {
    return this.enhancements;
  }

  getByStatus(status: PIEEnhancement['status']): PIEEnhancement[] {
    return this.enhancements.filter(e => e.status === status);
  }

  getByPriority(priority: PIEEnhancement['priority']): PIEEnhancement[] {
    return this.enhancements.filter(e => e.priority === priority);
  }

  getByCategory(category: PIEEnhancement['category']): PIEEnhancement[] {
    return this.enhancements.filter(e => e.category === category);
  }

  getCompleted(): PIEEnhancement[] {
    return this.enhancements.filter(e => e.status === 'completed');
  }

  getPending(): PIEEnhancement[] {
    return this.enhancements.filter(e => e.status === 'pending');
  }

  getProgress(): number {
    const completed = this.getCompleted().length;
    return Math.round((completed / this.enhancements.length) * 100);
  }

  getTotalHours(): number {
    return this.enhancements.reduce((total, e) => total + e.estimatedHours, 0);
  }

  getCompletedHours(): number {
    return this.getCompleted().reduce((total, e) => total + e.estimatedHours, 0);
  }
}

export class PIEServices {
  // Calcular KPIs principais
  static calculateKPIs(pies: PIEInstancia[]) {
    const total = pies.length;
    const emAndamento = pies.filter(p => p.status === 'em_andamento').length;
    const concluidos = pies.filter(p => p.status === 'concluido').length;
    const aprovados = pies.filter(p => p.status === 'aprovado').length;
    const reprovados = pies.filter(p => p.status === 'reprovado').length;
    const rascunho = pies.filter(p => p.status === 'rascunho').length;

    const altaPrioridade = pies.filter(p => p.prioridade === 'alta' || p.prioridade === 'urgente').length;
    const mediaPrioridade = pies.filter(p => p.prioridade === 'media' || p.prioridade === 'normal').length;
    const baixaPrioridade = pies.filter(p => p.prioridade === 'baixa').length;

    return {
      total,
      emAndamento,
      concluidos,
      aprovados,
      reprovados,
      rascunho,
      altaPrioridade,
      mediaPrioridade,
      baixaPrioridade,
      taxaConclusao: total > 0 ? ((concluidos + aprovados) / total) * 100 : 0,
      taxaAprovacao: total > 0 ? (aprovados / total) * 100 : 0,
      taxaReprovacao: total > 0 ? (reprovados / total) * 100 : 0
    };
  }

  // Calcular tendências
  static calculateTrends(pies: PIEInstancia[]) {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisMonth = pies.filter(p => new Date(p.created_at) >= lastMonth).length;
    const lastMonthCount = pies.filter(p => {
      const created = new Date(p.created_at);
      return created >= new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, lastMonth.getDate()) &&
             created < lastMonth;
    }).length;

    const thisWeek = pies.filter(p => new Date(p.created_at) >= lastWeek).length;
    const lastWeekCount = pies.filter(p => {
      const created = new Date(p.created_at);
      return created >= new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000) &&
             created < lastWeek;
    }).length;

    const crescimentoMensal = lastMonthCount > 0 ? ((thisMonth - lastMonthCount) / lastMonthCount) * 100 : 0;
    const crescimentoSemanal = lastWeekCount > 0 ? ((thisWeek - lastWeekCount) / lastWeekCount) * 100 : 0;

    return {
      crescimentoMensal,
      crescimentoSemanal,
      mediaDiaria: pies.length / 30,
      tendencia: crescimentoMensal > 0 ? 'crescente' : 'decrescente',
      thisMonth,
      lastMonthCount,
      thisWeek,
      lastWeekCount
    };
  }

  // Detetar anomalias
  static detectAnomalies(pies: PIEInstancia[], kpis: any) {
    const anomalies = [];

    // Anomalia: Taxa de reprovação alta
    if (kpis.taxaReprovacao > 20) {
      anomalies.push({
        type: 'Taxa de Reprovação Alta',
        severity: 'Alta',
        message: `Taxa de reprovação de ${kpis.taxaReprovacao.toFixed(1)}% está acima do limite recomendado (20%)`,
        recommendation: 'Revisar processos de inspeção e treinamento da equipa'
      });
    }

    // Anomalia: Muitos PIEs em rascunho
    if (kpis.rascunho > kpis.total * 0.3) {
      anomalies.push({
        type: 'Muitos PIEs em Rascunho',
        severity: 'Média',
        message: `${kpis.rascunho} PIEs (${((kpis.rascunho / kpis.total) * 100).toFixed(1)}%) estão em rascunho`,
        recommendation: 'Implementar processo para finalizar PIEs pendentes'
      });
    }

    // Anomalia: Alta prioridade não atendida
    if (kpis.altaPrioridade > 0 && kpis.emAndamento < kpis.altaPrioridade * 0.5) {
      anomalies.push({
        type: 'Prioridades Altas Não Atendidas',
        severity: 'Alta',
        message: `${kpis.altaPrioridade} PIEs de alta prioridade, mas apenas ${kpis.emAndamento} em andamento`,
        recommendation: 'Revisar alocação de recursos para PIEs de alta prioridade'
      });
    }

    return anomalies;
  }

  // Gerar recomendações
  static generateRecommendations(pies: PIEInstancia[], kpis: any, trends: any) {
    const recommendations = [];

    if (kpis.taxaConclusao < 70) {
      recommendations.push({
        title: 'Melhorar Taxa de Conclusão',
        priority: 'Alta',
        impact: 'Alto',
        effort: 'Médio',
        description: 'Implementar processo para acelerar conclusão de PIEs pendentes'
      });
    }

    if (trends.crescimentoMensal < 0) {
      recommendations.push({
        title: 'Reverter Tendência Negativa',
        priority: 'Média',
        impact: 'Alto',
        effort: 'Alto',
        description: 'Analisar causas da diminuição de PIEs e implementar ações corretivas'
      });
    }

    if (kpis.altaPrioridade > kpis.total * 0.2) {
      recommendations.push({
        title: 'Otimizar Priorização',
        priority: 'Média',
        impact: 'Médio',
        effort: 'Baixo',
        description: 'Revisar critérios de priorização para reduzir sobrecarga'
      });
    }

    return recommendations;
  }

  // Validar dados
  static validateData(pies: PIEInstancia[]) {
    const issues = [];

    pies.forEach(pie => {
      if (!pie.titulo || pie.titulo.trim().length === 0) {
        issues.push({
          type: 'Dados Inválidos',
          severity: 'Média',
          message: `PIE ${pie.codigo} sem título`,
          pieId: pie.id
        });
      }

      if (pie.data_planeada && new Date(pie.data_planeada) < new Date()) {
        issues.push({
          type: 'Data Expirada',
          severity: 'Baixa',
          message: `PIE ${pie.codigo} com data planeada expirada`,
          pieId: pie.id
        });
      }
    });

    return issues;
  }
}

// Instância singleton
export const pieEnhancements = new PIEEnhancements();
