// Sistema de Analytics Avançados para Módulo Normas
// Cálculo de KPIs, tendências e deteção de anomalias

import { Norma, CategoriaNorma, OrganismoNormativo, StatusNorma, PrioridadeNorma } from '../types/normas';
import { NormasCacheService } from './normas-cache';

interface KPIsNormas {
  total_normas: number;
  normas_ativas: number;
  normas_revisao: number;
  normas_obsoletas: number;
  taxa_ativas: number;
  taxa_revisao: number;
  taxa_obsoletas: number;
  prioridade_critica: number;
  prioridade_alta: number;
  prioridade_media: number;
  prioridade_baixa: number;
  normas_recentes: number;
  normas_vencendo: number;
}

interface TendenciaNormas {
  periodo: string;
  total: number;
  ativas: number;
  revisao: number;
  obsoletas: number;
  crescimento: number;
}

interface AnomaliaNorma {
  tipo: 'OBSOLETA' | 'EM_REVISAO' | 'PROXIMA_VENCIMENTO' | 'PRIORIDADE_CRITICA' | 'SEM_APLICABILIDADE';
  norma: Norma;
  severidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  descricao: string;
  acao_recomendada: string;
}

interface DistribuicaoAnalytics {
  por_categoria: Record<CategoriaNorma, number>;
  por_organismo: Record<OrganismoNormativo, number>;
  por_status: Record<StatusNorma, number>;
  por_prioridade: Record<PrioridadeNorma, number>;
  por_aplicabilidade: Record<string, number>;
}

interface RecomendacaoAnalytics {
  tipo: 'CONFORMIDADE' | 'ATUALIZACAO' | 'APLICABILIDADE' | 'PRIORIZACAO';
  titulo: string;
  descricao: string;
  impacto: 'BAIXO' | 'MEDIO' | 'ALTO';
  acao: string;
  normas_envolvidas: string[];
}

class NormasAnalytics {
  private readonly ANOS_VENCIMENTO = 5; // Anos para considerar norma vencendo
  private readonly DIAS_RECENTES = 30; // Dias para considerar norma recente

  // Cálculo de KPIs principais
  calcularKPIs(normas: Norma[]): KPIsNormas {
    const total = normas.length;
    const ativas = normas.filter(n => n.status === 'ATIVA').length;
    const revisao = normas.filter(n => n.status === 'REVISAO').length;
    const obsoletas = normas.filter(n => n.status === 'OBSOLETA').length;
    
    const critica = normas.filter(n => n.prioridade === 'CRITICA').length;
    const alta = normas.filter(n => n.prioridade === 'ALTA').length;
    const media = normas.filter(n => n.prioridade === 'MEDIA').length;
    const baixa = normas.filter(n => n.prioridade === 'BAIXA').length;

    const recentes = this.calcularNormasRecentes(normas);
    const vencendo = this.calcularNormasVencendo(normas);

    return {
      total_normas: total,
      normas_ativas: ativas,
      normas_revisao: revisao,
      normas_obsoletas: obsoletas,
      taxa_ativas: total > 0 ? (ativas / total) * 100 : 0,
      taxa_revisao: total > 0 ? (revisao / total) * 100 : 0,
      taxa_obsoletas: total > 0 ? (obsoletas / total) * 100 : 0,
      prioridade_critica: critica,
      prioridade_alta: alta,
      prioridade_media: media,
      prioridade_baixa: baixa,
      normas_recentes: recentes,
      normas_vencendo: vencendo
    };
  }

  // Análise de tendências
  calcularTendencias(normas: Norma[]): TendenciaNormas[] {
    const tendencias: TendenciaNormas[] = [];
    const agora = new Date();
    
    // Últimos 12 meses
    for (let i = 11; i >= 0; i--) {
      const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
      const mesAnterior = new Date(agora.getFullYear(), agora.getMonth() - i - 1, 1);
      
      const normasMes = normas.filter(n => {
        const dataNorma = new Date(n.data_publicacao);
        return dataNorma.getMonth() === data.getMonth() && 
               dataNorma.getFullYear() === data.getFullYear();
      });

      const normasMesAnterior = normas.filter(n => {
        const dataNorma = new Date(n.data_publicacao);
        return dataNorma.getMonth() === mesAnterior.getMonth() && 
               dataNorma.getFullYear() === mesAnterior.getFullYear();
      });

      const total = normasMes.length;
      const ativas = normasMes.filter(n => n.status === 'ATIVA').length;
      const revisao = normasMes.filter(n => n.status === 'REVISAO').length;
      const obsoletas = normasMes.filter(n => n.status === 'OBSOLETA').length;
      
      const crescimento = normasMesAnterior.length > 0 
        ? ((total - normasMesAnterior.length) / normasMesAnterior.length) * 100 
        : 0;

      tendencias.push({
        periodo: data.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' }),
        total,
        ativas,
        revisao,
        obsoletas,
        crescimento
      });
    }

    return tendencias;
  }

  // Deteção de anomalias
  detectarAnomalias(normas: Norma[]): AnomaliaNorma[] {
    const anomalias: AnomaliaNorma[] = [];
    const agora = new Date();

    for (const norma of normas) {
      // Normas obsoletas
      if (norma.status === 'OBSOLETA') {
        anomalias.push({
          tipo: 'OBSOLETA',
          norma,
          severidade: 'ALTA',
          descricao: `Norma obsoleta: ${norma.codigo}`,
          acao_recomendada: 'Verificar se existe versão atualizada ou substituir por norma equivalente'
        });
      }

      // Normas em revisão há muito tempo
      if (norma.status === 'REVISAO') {
        const dataRevisao = new Date(norma.ultima_atualizacao);
        const diasRevisao = (agora.getTime() - dataRevisao.getTime()) / (1000 * 60 * 60 * 24);
        
        if (diasRevisao > 365) {
          anomalias.push({
            tipo: 'EM_REVISAO',
            norma,
            severidade: 'MEDIA',
            descricao: `Norma em revisão há ${Math.floor(diasRevisao)} dias`,
            acao_recomendada: 'Contactar organismo normativo para verificar status da revisão'
          });
        }
      }

      // Normas próximas do vencimento
      const dataPublicacao = new Date(norma.data_publicacao);
      const anosDecorridos = (agora.getTime() - dataPublicacao.getTime()) / (1000 * 60 * 60 * 24 * 365);
      
      if (anosDecorridos > this.ANOS_VENCIMENTO && norma.status === 'ATIVA') {
        anomalias.push({
          tipo: 'PROXIMA_VENCIMENTO',
          norma,
          severidade: 'MEDIA',
          descricao: `Norma publicada há ${Math.floor(anosDecorridos)} anos`,
          acao_recomendada: 'Verificar se existe versão atualizada disponível'
        });
      }

      // Normas de prioridade crítica sem aplicabilidade definida
      if (norma.prioridade === 'CRITICA' && norma.aplicabilidade.length === 0) {
        anomalias.push({
          tipo: 'PRIORIDADE_CRITICA',
          norma,
          severidade: 'CRITICA',
          descricao: 'Norma de prioridade crítica sem aplicabilidade definida',
          acao_recomendada: 'Definir aplicabilidade e requisitos específicos'
        });
      }

      // Normas sem aplicabilidade
      if (norma.aplicabilidade.length === 0) {
        anomalias.push({
          tipo: 'SEM_APLICABILIDADE',
          norma,
          severidade: 'BAIXA',
          descricao: 'Norma sem aplicabilidade definida',
          acao_recomendada: 'Definir aplicabilidade para melhor gestão'
        });
      }
    }

    return anomalias.sort((a, b) => {
      const severidadeOrder = { 'CRITICA': 4, 'ALTA': 3, 'MEDIA': 2, 'BAIXA': 1 };
      return severidadeOrder[b.severidade] - severidadeOrder[a.severidade];
    });
  }

  // Análise de distribuição
  calcularDistribuicao(normas: Norma[]): DistribuicaoAnalytics {
    const distribuicao: DistribuicaoAnalytics = {
      por_categoria: {} as Record<CategoriaNorma, number>,
      por_organismo: {} as Record<OrganismoNormativo, number>,
      por_status: {} as Record<StatusNorma, number>,
      por_prioridade: {} as Record<PrioridadeNorma, number>,
      por_aplicabilidade: {}
    };

    // Inicializar contadores
    for (const categoria of Object.keys(CATEGORIAS_NORMAS) as CategoriaNorma[]) {
      distribuicao.por_categoria[categoria] = 0;
    }

    for (const organismo of Object.keys(ORGANISMOS_NORMATIVOS) as OrganismoNormativo[]) {
      distribuicao.por_organismo[organismo] = 0;
    }

    for (const status of ['ATIVA', 'REVISAO', 'OBSOLETA', 'SUSPENSA', 'CANCELADA', 'PROJETO', 'EM_CONSULTA'] as StatusNorma[]) {
      distribuicao.por_status[status] = 0;
    }

    for (const prioridade of ['CRITICA', 'ALTA', 'MEDIA', 'BAIXA', 'INFORMATIVA'] as PrioridadeNorma[]) {
      distribuicao.por_prioridade[prioridade] = 0;
    }

    // Contar ocorrências
    for (const norma of normas) {
      distribuicao.por_categoria[norma.categoria]++;
      distribuicao.por_organismo[norma.organismo]++;
      distribuicao.por_status[norma.status]++;
      distribuicao.por_prioridade[norma.prioridade]++;

      for (const aplicabilidade of norma.aplicabilidade) {
        distribuicao.por_aplicabilidade[aplicabilidade] = 
          (distribuicao.por_aplicabilidade[aplicabilidade] || 0) + 1;
      }
    }

    return distribuicao;
  }

  // Geração de recomendações
  gerarRecomendacoes(normas: Norma[], kpis: KPIsNormas, anomalias: AnomaliaNorma[]): RecomendacaoAnalytics[] {
    const recomendacoes: RecomendacaoAnalytics[] = [];

    // Recomendações baseadas em KPIs
    if (kpis.taxa_obsoletas > 20) {
      recomendacoes.push({
        tipo: 'ATUALIZACAO',
        titulo: 'Taxa de normas obsoletas elevada',
        descricao: `${kpis.taxa_obsoletas.toFixed(1)}% das normas estão obsoletas`,
        impacto: 'ALTO',
        acao: 'Priorizar atualização de normas obsoletas críticas',
        normas_envolvidas: anomalias.filter(a => a.tipo === 'OBSOLETA').map(a => a.norma.codigo)
      });
    }

    if (kpis.prioridade_critica > 0) {
      recomendacoes.push({
        tipo: 'PRIORIZACAO',
        titulo: 'Normas de prioridade crítica identificadas',
        descricao: `${kpis.prioridade_critica} normas de prioridade crítica`,
        impacto: 'ALTO',
        acao: 'Revisar e aplicar normas críticas em projetos',
        normas_envolvidas: normas.filter(n => n.prioridade === 'CRITICA').map(n => n.codigo)
      });
    }

    // Recomendações baseadas em anomalias
    const anomaliasCriticas = anomalias.filter(a => a.severidade === 'CRITICA');
    if (anomaliasCriticas.length > 0) {
      recomendacoes.push({
        tipo: 'CONFORMIDADE',
        titulo: 'Anomalias críticas detectadas',
        descricao: `${anomaliasCriticas.length} anomalias críticas requerem atenção imediata`,
        impacto: 'ALTO',
        acao: 'Resolver anomalias críticas prioritariamente',
        normas_envolvidas: anomaliasCriticas.map(a => a.norma.codigo)
      });
    }

    // Recomendações de aplicabilidade
    const normasSemAplicabilidade = normas.filter(n => n.aplicabilidade.length === 0);
    if (normasSemAplicabilidade.length > 0) {
      recomendacoes.push({
        tipo: 'APLICABILIDADE',
        titulo: 'Normas sem aplicabilidade definida',
        descricao: `${normasSemAplicabilidade.length} normas sem aplicabilidade`,
        impacto: 'MEDIO',
        acao: 'Definir aplicabilidade para melhor gestão',
        normas_envolvidas: normasSemAplicabilidade.map(n => n.codigo)
      });
    }

    return recomendacoes.sort((a, b) => {
      const impactoOrder = { 'ALTO': 3, 'MEDIO': 2, 'BAIXO': 1 };
      return impactoOrder[b.impacto] - impactoOrder[a.impacto];
    });
  }

  // Validação de dados
  validarDados(normas: Norma[]): { validos: boolean; problemas: string[] } {
    const problemas: string[] = [];

    for (const norma of normas) {
      // Verificar campos obrigatórios
      if (!norma.codigo || !norma.titulo || !norma.categoria) {
        problemas.push(`Norma ${norma.id}: Campos obrigatórios em falta`);
      }

      // Verificar datas válidas
      if (isNaN(new Date(norma.data_publicacao).getTime())) {
        problemas.push(`Norma ${norma.codigo}: Data de publicação inválida`);
      }

      if (isNaN(new Date(norma.data_entrada_vigor).getTime())) {
        problemas.push(`Norma ${norma.codigo}: Data de entrada em vigor inválida`);
      }

      // Verificar consistência de datas
      const dataPublicacao = new Date(norma.data_publicacao);
      const dataVigor = new Date(norma.data_entrada_vigor);
      
      if (dataVigor < dataPublicacao) {
        problemas.push(`Norma ${norma.codigo}: Data de entrada em vigor anterior à publicação`);
      }

      // Verificar aplicabilidade
      if (norma.aplicabilidade.length === 0) {
        problemas.push(`Norma ${norma.codigo}: Sem aplicabilidade definida`);
      }
    }

    return {
      validos: problemas.length === 0,
      problemas
    };
  }

  // Métodos auxiliares
  private calcularNormasRecentes(normas: Norma[]): number {
    const agora = new Date();
    const dataLimite = new Date(agora.getTime() - this.DIAS_RECENTES * 24 * 60 * 60 * 1000);
    
    return normas.filter(norma => {
      const dataNorma = new Date(norma.data_publicacao);
      return dataNorma >= dataLimite;
    }).length;
  }

  private calcularNormasVencendo(normas: Norma[]): number {
    const agora = new Date();
    const dataLimite = new Date(agora.getTime() - this.ANOS_VENCIMENTO * 365 * 24 * 60 * 60 * 1000);
    
    return normas.filter(norma => {
      const dataNorma = new Date(norma.data_publicacao);
      return dataNorma <= dataLimite && norma.status === 'ATIVA';
    }).length;
  }
}

// Constantes para categorias e organismos (importadas dos tipos)
const CATEGORIAS_NORMAS = {
  CONSTRUCAO_CIVIL: 'Construção Civil',
  FERROVIARIA: 'Ferroviária',
  BETAO_ESTRUTURAL: 'Betão Estrutural',
  SOLOS_FUNDACOES: 'Solos e Fundações',
  ACOS_ARMADURA: 'Aços e Armaduras',
  MATERIAIS_CONSTRUCAO: 'Materiais de Construção',
  SEGURANCA_OBRAS: 'Segurança em Obras',
  QUALIDADE_GESTAO: 'Qualidade e Gestão',
  AMBIENTE_SUSTENTABILIDADE: 'Ambiente e Sustentabilidade',
  ACESSIBILIDADE: 'Acessibilidade',
  ENERGIA_EFICIENCIA: 'Energia e Eficiência',
  SINALIZACAO_SEGURANCA: 'Sinalização e Segurança',
  MANUTENCAO_OPERACAO: 'Manutenção e Operação',
  INSPECAO_CONTROLO: 'Inspeção e Controlo',
  DOCUMENTACAO_TECNICA: 'Documentação Técnica'
};

const ORGANISMOS_NORMATIVOS = {
  CEN: 'Comité Europeu de Normalização',
  ISO: 'Organização Internacional de Normalização',
  IPQ: 'Instituto Português da Qualidade',
  ASTM: 'American Society for Testing and Materials',
  UIC: 'Union Internationale des Chemins de fer',
  EN: 'Normas Europeias',
  NP: 'Normas Portuguesas',
  'NP EN': 'Normas Portuguesas baseadas em EN',
  'NP EN ISO': 'Normas Portuguesas baseadas em EN ISO',
  'EN ISO': 'Normas Europeias baseadas em ISO',
  'EN IEC': 'Normas Europeias baseadas em IEC',
  'NP EN IEC': 'Normas Portuguesas baseadas em EN IEC',
  INFRAESTRUTURAS_PT: 'Infraestruturas de Portugal',
  REFER: 'Rede Ferroviária Nacional',
  CP: 'Comboios de Portugal',
  ADIF: 'Administrador de Infraestructuras Ferroviarias (Espanha)',
  SNCF: 'Société Nationale des Chemins de fer Français',
  DB: 'Deutsche Bahn (Alemanha)',
  RFI: 'Rete Ferroviaria Italiana',
  OUTRO: 'Outro'
};

// Instância global
export const normasAnalytics = new NormasAnalytics();

// Serviços de analytics para Normas
export const NormasAnalyticsService = {
  // KPIs
  calcularKPIs: (normas: Norma[]) => normasAnalytics.calcularKPIs(normas),
  
  // Tendências
  calcularTendencias: (normas: Norma[]) => normasAnalytics.calcularTendencias(normas),
  
  // Anomalias
  detectarAnomalias: (normas: Norma[]) => normasAnalytics.detectarAnomalias(normas),
  
  // Distribuição
  calcularDistribuicao: (normas: Norma[]) => normasAnalytics.calcularDistribuicao(normas),
  
  // Recomendações
  gerarRecomendacoes: (normas: Norma[], kpis: KPIsNormas, anomalias: AnomaliaNorma[]) => 
    normasAnalytics.gerarRecomendacoes(normas, kpis, anomalias),
  
  // Validação
  validarDados: (normas: Norma[]) => normasAnalytics.validarDados(normas)
};
