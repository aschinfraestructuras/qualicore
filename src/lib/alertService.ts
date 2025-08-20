import { KPIData, NCData, SLAData } from './kpiService';

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'quality' | 'tests' | 'nc' | 'sla' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
  data?: any;
}

export interface AlertThresholds {
  qualityMin: number;
  testsPendingMax: number;
  ncCriticalThreshold: number;
  slaMin: number;
}

class AlertService {
  private alerts: Alert[] = [];
  private thresholds: AlertThresholds = {
    qualityMin: 85, // Qualidade mínima aceitável
    testsPendingMax: 10, // Máximo de ensaios pendentes
    ncCriticalThreshold: 5, // NCs críticas
    slaMin: 90 // SLA mínimo
  };

  // Gerar dados de tendência para sparklines
  generateTrendData(data: number[], days: number = 7): number[] {
    if (data.length === 0) {
      // Gerar dados simulados se não houver dados reais
      return Array.from({ length: days }, () => Math.random() * 100);
    }
    
    // Usar dados reais se disponíveis
    return data.slice(-days);
  }

  // Analisar KPIs e gerar alertas
  analyzeKPIs(kpiData: {
    today: KPIData | null;
    week: KPIData | null;
    month: KPIData | null;
    nc: NCData[];
    sla: SLAData[];
  }): Alert[] {
    const newAlerts: Alert[] = [];

    // Alerta de Qualidade Baixa
    if (kpiData.month && kpiData.month.qualidade_percent < this.thresholds.qualityMin) {
      newAlerts.push({
        id: `quality-${Date.now()}`,
        type: 'critical',
        category: 'quality',
        title: 'Qualidade Abaixo do Aceitável',
        message: `Qualidade global: ${kpiData.month.qualidade_percent}% (mínimo: ${this.thresholds.qualityMin}%)`,
        timestamp: new Date(),
        priority: 'high',
        isActive: true,
        data: { current: kpiData.month.qualidade_percent, threshold: this.thresholds.qualityMin }
      });
    }

    // Alerta de Ensaios Pendentes
    if (kpiData.week && kpiData.week.pendentes > this.thresholds.testsPendingMax) {
      newAlerts.push({
        id: `pending-${Date.now()}`,
        type: 'warning',
        category: 'tests',
        title: 'Ensaios Pendentes Elevados',
        message: `${kpiData.week.pendentes} ensaios pendentes (máximo: ${this.thresholds.testsPendingMax})`,
        timestamp: new Date(),
        priority: 'medium',
        isActive: true,
        data: { current: kpiData.week.pendentes, threshold: this.thresholds.testsPendingMax }
      });
    }

    // Alerta de NCs Críticas
    if (kpiData.nc.length > 0) {
      const criticalNCs = kpiData.nc.filter(nc => nc.nc_count >= this.thresholds.ncCriticalThreshold);
      if (criticalNCs.length > 0) {
        newAlerts.push({
          id: `nc-${Date.now()}`,
          type: 'critical',
          category: 'nc',
          title: 'Não Conformidades Críticas',
          message: `${criticalNCs.length} categorias com NCs críticas`,
          timestamp: new Date(),
          priority: 'high',
          isActive: true,
          data: { categories: criticalNCs }
        });
      }
    }

    // Alerta de SLA Baixo
    if (kpiData.sla.length > 0) {
      const lowSLA = kpiData.sla.filter(sla => sla.taxa_aprovacao < this.thresholds.slaMin);
      if (lowSLA.length > 0) {
        newAlerts.push({
          id: `sla-${Date.now()}`,
          type: 'warning',
          category: 'sla',
          title: 'SLA Laboratório Baixo',
          message: `${lowSLA.length} laboratórios com SLA abaixo de ${this.thresholds.slaMin}%`,
          timestamp: new Date(),
          priority: 'medium',
          isActive: true,
          data: { laboratorios: lowSLA }
        });
      }
    }

    // Alerta de Tendência Negativa
    if (kpiData.month && kpiData.week) {
      const qualityTrend = kpiData.month.qualidade_percent - kpiData.week.qualidade_percent;
      if (qualityTrend < -5) {
        newAlerts.push({
          id: `trend-${Date.now()}`,
          type: 'warning',
          category: 'quality',
          title: 'Tendência Negativa Detectada',
          message: `Qualidade caiu ${Math.abs(qualityTrend).toFixed(1)}% nos últimos 7 dias`,
          timestamp: new Date(),
          priority: 'medium',
          isActive: true,
          data: { trend: qualityTrend }
        });
      }
    }

    this.alerts = [...this.alerts, ...newAlerts];
    return newAlerts;
  }

  // Verificar se há alertas ativos para um KPI específico
  hasActiveAlerts(category: string): boolean {
    return this.alerts.some(alert => alert.category === category && alert.isActive);
  }

  // Obter alertas ativos
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => alert.isActive);
  }

  // Obter alertas por categoria
  getAlertsByCategory(category: string): Alert[] {
    return this.alerts.filter(alert => alert.category === category && alert.isActive);
  }

  // Marcar alerta como resolvido
  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isActive = false;
    }
  }

  // Limpar alertas antigos (mais de 24h)
  cleanupOldAlerts(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.alerts = this.alerts.filter(alert => alert.timestamp > oneDayAgo);
  }

  // Atualizar thresholds
  updateThresholds(newThresholds: Partial<AlertThresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  // Gerar dados de sparkline com alertas
  getSparklineDataWithAlerts(
    data: number[], 
    category: string, 
    days: number = 7
  ): { data: number[]; showAlert: boolean; color: string } {
    const trendData = this.generateTrendData(data, days);
    const hasAlert = this.hasActiveAlerts(category);
    
    let color = '#3B82F6'; // Azul padrão
    
    if (hasAlert) {
      const alerts = this.getAlertsByCategory(category);
      const hasCritical = alerts.some(a => a.type === 'critical');
      color = hasCritical ? '#EF4444' : '#F59E0B'; // Vermelho ou amarelo
    } else if (trendData.length >= 2) {
      const trend = trendData[trendData.length - 1] - trendData[0];
      if (trend < 0) color = '#F59E0B'; // Amarelo para tendência negativa
    }

    return {
      data: trendData,
      showAlert: hasAlert,
      color
    };
  }
}

export const alertService = new AlertService();
