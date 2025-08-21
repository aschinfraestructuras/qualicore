import { Norma, CategoriaNorma, OrganismoNormativo, StatusNorma, PrioridadeNorma } from '../types/normas';
import { NormasAnalyticsService } from './normas-analytics';
import { NormasCacheService } from './normas-cache';

// Interfaces para relatórios avançados
export interface TemplateRelatorio {
  id: string;
  nome: string;
  descricao: string;
  categoria: 'executivo' | 'técnico' | 'conformidade' | 'auditoria' | 'personalizado';
  formato: 'pdf' | 'excel' | 'word' | 'html';
  secoes: SecaoRelatorio[];
  filtros: FiltrosRelatorio;
  agendamento?: AgendamentoRelatorio;
  ultimaGeracao?: Date;
  proximaGeracao?: Date;
}

export interface SecaoRelatorio {
  id: string;
  titulo: string;
  tipo: 'resumo' | 'tabela' | 'grafico' | 'metricas' | 'alertas' | 'anexos' | 'personalizada';
  configuracao: any;
  ordem: number;
  visivel: boolean;
}

export interface FiltrosRelatorio {
  categorias?: CategoriaNorma[];
  organismos?: OrganismoNormativo[];
  status?: StatusNorma[];
  prioridades?: PrioridadeNorma[];
  dataInicio?: Date;
  dataFim?: Date;
  palavrasChave?: string[];
  incluirAnexos?: boolean;
  incluirGraficos?: boolean;
  incluirMetricas?: boolean;
}

export interface AgendamentoRelatorio {
  ativo: boolean;
  frequencia: 'diario' | 'semanal' | 'mensal' | 'trimestral' | 'anual';
  diaSemana?: number; // 0-6 (domingo-sábado)
  diaMes?: number; // 1-31
  hora?: string; // HH:MM
  destinatarios?: string[];
  formato: 'pdf' | 'excel' | 'word' | 'html';
  incluirAnexos?: boolean;
}

export interface RelatorioGerado {
  id: string;
  templateId: string;
  nome: string;
  dataGeracao: Date;
  formato: string;
  tamanho: number;
  url?: string;
  estatisticas: {
    totalNormas: number;
    normasIncluidas: number;
    tempoGeracao: number;
    secoesGeradas: number;
  };
}

export interface ConfiguracaoGrafico {
  tipo: 'barras' | 'linhas' | 'pizza' | 'donut' | 'area' | 'scatter';
  dados: string[];
  agrupamento?: string;
  cores?: string[];
  animacoes?: boolean;
  legendas?: boolean;
}

class NormasRelatoriosAvancados {
  private templates: Map<string, TemplateRelatorio> = new Map();
  private relatoriosGerados: Map<string, RelatorioGerado> = new Map();
  private agendamentosAtivos: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.inicializarTemplatesPadrao();
    this.inicializarAgendamentos();
  }

  // Inicializar templates padrão
  private inicializarTemplatesPadrao(): void {
    const templates: TemplateRelatorio[] = [
      {
        id: 'executivo-mensal',
        nome: 'Relatório Executivo Mensal',
        descricao: 'Visão geral mensal das normas para gestão executiva',
        categoria: 'executivo',
        formato: 'pdf',
        secoes: [
          {
            id: 'resumo-executivo',
            titulo: 'Resumo Executivo',
            tipo: 'resumo',
            configuracao: { incluirKPIs: true, incluirTendencias: true },
            ordem: 1,
            visivel: true
          },
          {
            id: 'metricas-principais',
            titulo: 'Métricas Principais',
            tipo: 'metricas',
            configuracao: { 
              metricas: ['totalNormas', 'taxaConformidade', 'normasVencendo', 'organismosAtivos'],
              layout: 'grid'
            },
            ordem: 2,
            visivel: true
          },
          {
            id: 'tendencias-mensais',
            titulo: 'Tendências Mensais',
            tipo: 'grafico',
            configuracao: {
              tipo: 'linhas',
              dados: ['normasRecentes', 'conformidade', 'vencimentos'],
              periodo: '30d'
            },
            ordem: 3,
            visivel: true
          },
          {
            id: 'alertas-criticos',
            titulo: 'Alertas Críticos',
            tipo: 'alertas',
            configuracao: { 
              prioridade: 'alta',
              maxItems: 10,
              incluirAcoes: true
            },
            ordem: 4,
            visivel: true
          }
        ],
        filtros: {
          incluirGraficos: true,
          incluirMetricas: true
        }
      },
      {
        id: 'tecnico-detalhado',
        nome: 'Relatório Técnico Detalhado',
        descricao: 'Análise técnica detalhada das normas',
        categoria: 'técnico',
        formato: 'excel',
        secoes: [
          {
            id: 'lista-completa',
            titulo: 'Lista Completa de Normas',
            tipo: 'tabela',
            configuracao: {
              colunas: ['codigo', 'titulo', 'categoria', 'organismo', 'status', 'prioridade', 'dataVencimento'],
              ordenacao: 'codigo',
              filtros: true,
              paginacao: false
            },
            ordem: 1,
            visivel: true
          },
          {
            id: 'distribuicao-categorias',
            titulo: 'Distribuição por Categorias',
            tipo: 'grafico',
            configuracao: {
              tipo: 'pizza',
              dados: ['categoria'],
              cores: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
            },
            ordem: 2,
            visivel: true
          },
          {
            id: 'analise-organismos',
            titulo: 'Análise por Organismos',
            tipo: 'grafico',
            configuracao: {
              tipo: 'barras',
              dados: ['organismo'],
              agrupamento: 'status'
            },
            ordem: 3,
            visivel: true
          },
          {
            id: 'anexos-documentos',
            titulo: 'Documentos Anexos',
            tipo: 'anexos',
            configuracao: {
              incluirMetadados: true,
              agruparPorTipo: true
            },
            ordem: 4,
            visivel: true
          }
        ],
        filtros: {
          incluirAnexos: true,
          incluirGraficos: true
        }
      },
      {
        id: 'conformidade-auditoria',
        nome: 'Relatório de Conformidade e Auditoria',
        descricao: 'Relatório específico para auditorias de conformidade',
        categoria: 'conformidade',
        formato: 'pdf',
        secoes: [
          {
            id: 'status-conformidade',
            titulo: 'Status de Conformidade',
            tipo: 'metricas',
            configuracao: {
              metricas: ['conformes', 'naoConformes', 'pendentes', 'vencidas'],
              layout: 'cards',
              cores: ['#10B981', '#EF4444', '#F59E0B', '#DC2626']
            },
            ordem: 1,
            visivel: true
          },
          {
            id: 'normas-criticas',
            titulo: 'Normas Críticas',
            tipo: 'tabela',
            configuracao: {
              filtros: { prioridade: ['Alta', 'Critica'], status: ['NaoConforme', 'Vencida'] },
              colunas: ['codigo', 'titulo', 'prioridade', 'status', 'dataVencimento', 'acoes'],
              ordenacao: 'prioridade'
            },
            ordem: 2,
            visivel: true
          },
          {
            id: 'timeline-vencimentos',
            titulo: 'Timeline de Vencimentos',
            tipo: 'grafico',
            configuracao: {
              tipo: 'area',
              dados: ['vencimentos'],
              periodo: '90d',
              agrupamento: 'mes'
            },
            ordem: 3,
            visivel: true
          },
          {
            id: 'acoes-recomendadas',
            titulo: 'Ações Recomendadas',
            tipo: 'personalizada',
            configuracao: {
              template: 'acoes-auditoria',
              incluirPrioridades: true,
              incluirPrazos: true
            },
            ordem: 4,
            visivel: true
          }
        ],
        filtros: {
          incluirGraficos: true,
          incluirMetricas: true
        }
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  // Gerar relatório
  async gerarRelatorio(
    templateId: string,
    normas: Norma[],
    filtros?: FiltrosRelatorio,
    formato?: string
  ): Promise<RelatorioGerado> {
    const inicio = Date.now();
    const template = this.templates.get(templateId);
    
    if (!template) {
      throw new Error(`Template não encontrado: ${templateId}`);
    }

    // Aplicar filtros
    const normasFiltradas = this.aplicarFiltros(normas, filtros || template.filtros);
    
    // Gerar conteúdo das seções
    const secoesGeradas = await this.gerarSecoes(template.secoes, normasFiltradas);
    
    // Gerar relatório no formato especificado
    const formatoFinal = formato || template.formato;
    const conteudo = await this.gerarConteudo(formatoFinal, template, secoesGeradas, normasFiltradas);
    
    const tempoGeracao = Date.now() - inicio;
    
    const relatorio: RelatorioGerado = {
      id: `rel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      templateId,
      nome: template.nome,
      dataGeracao: new Date(),
      formato: formatoFinal,
      tamanho: conteudo.tamanho,
      url: conteudo.url,
      estatisticas: {
        totalNormas: normas.length,
        normasIncluidas: normasFiltradas.length,
        tempoGeracao,
        secoesGeradas: secoesGeradas.length
      }
    };

    this.relatoriosGerados.set(relatorio.id, relatorio);
    
    // Atualizar template
    template.ultimaGeracao = new Date();
    
    return relatorio;
  }

  // Aplicar filtros às normas
  private aplicarFiltros(normas: Norma[], filtros: FiltrosRelatorio): Norma[] {
    let normasFiltradas = [...normas];

    if (filtros.categorias && filtros.categorias.length > 0) {
      normasFiltradas = normasFiltradas.filter(n => filtros.categorias!.includes(n.categoria));
    }

    if (filtros.organismos && filtros.organismos.length > 0) {
      normasFiltradas = normasFiltradas.filter(n => filtros.organismos!.includes(n.organismoNormativo));
    }

    if (filtros.status && filtros.status.length > 0) {
      normasFiltradas = normasFiltradas.filter(n => filtros.status!.includes(n.status));
    }

    if (filtros.prioridades && filtros.prioridades.length > 0) {
      normasFiltradas = normasFiltradas.filter(n => filtros.prioridades!.includes(n.prioridade));
    }

    if (filtros.dataInicio) {
      normasFiltradas = normasFiltradas.filter(n => new Date(n.dataCriacao) >= filtros.dataInicio!);
    }

    if (filtros.dataFim) {
      normasFiltradas = normasFiltradas.filter(n => new Date(n.dataCriacao) <= filtros.dataFim!);
    }

    if (filtros.palavrasChave && filtros.palavrasChave.length > 0) {
      const keywords = filtros.palavrasChave.map(k => k.toLowerCase());
      normasFiltradas = normasFiltradas.filter(n => 
        keywords.some(keyword => 
          n.titulo.toLowerCase().includes(keyword) ||
          n.descricao.toLowerCase().includes(keyword) ||
          n.codigo.toLowerCase().includes(keyword)
        )
      );
    }

    return normasFiltradas;
  }

  // Gerar seções do relatório
  private async gerarSecoes(secoes: SecaoRelatorio[], normas: Norma[]): Promise<any[]> {
    const secoesGeradas = [];

    for (const secao of secoes.sort((a, b) => a.ordem - b.ordem)) {
      if (!secao.visivel) continue;

      try {
        const conteudo = await this.gerarSecao(secao, normas);
        secoesGeradas.push({
          ...secao,
          conteudo
        });
      } catch (error) {
        console.error(`Erro ao gerar seção ${secao.titulo}:`, error);
      }
    }

    return secoesGeradas;
  }

  // Gerar conteúdo de uma seção específica
  private async gerarSecao(secao: SecaoRelatorio, normas: Norma[]): Promise<any> {
    switch (secao.tipo) {
      case 'resumo':
        return this.gerarResumo(secao.configuracao, normas);
      
      case 'tabela':
        return this.gerarTabela(secao.configuracao, normas);
      
      case 'grafico':
        return this.gerarGrafico(secao.configuracao, normas);
      
      case 'metricas':
        return this.gerarMetricas(secao.configuracao, normas);
      
      case 'alertas':
        return this.gerarAlertas(secao.configuracao, normas);
      
      case 'anexos':
        return this.gerarAnexos(secao.configuracao, normas);
      
      case 'personalizada':
        return this.gerarSecaoPersonalizada(secao.configuracao, normas);
      
      default:
        throw new Error(`Tipo de seção não suportado: ${secao.tipo}`);
    }
  }

  // Gerar resumo executivo
  private async gerarResumo(config: any, normas: Norma[]): Promise<any> {
    const kpis = NormasAnalyticsService.calcularKPIs(normas);
    const tendencias = NormasAnalyticsService.calcularTendencias(normas);
    const anomalias = NormasAnalyticsService.detectarAnomalias(normas);

    return {
      kpis: config.incluirKPIs ? kpis : null,
      tendencias: config.incluirTendencias ? tendencias.slice(0, 5) : null,
      anomalias: anomalias.slice(0, 3),
      resumo: {
        totalNormas: normas.length,
        periodoAnalise: 'Últimos 30 dias',
        principaisAcoes: this.gerarPrincipaisAcoes(normas, kpis)
      }
    };
  }

  // Gerar tabela de dados
  private async gerarTabela(config: any, normas: Norma[]): Promise<any> {
    const colunas = config.colunas || ['codigo', 'titulo', 'categoria', 'status'];
    const dados = normas.map(norma => {
      const linha: any = {};
      colunas.forEach(col => {
        linha[col] = this.obterValorColuna(norma, col);
      });
      return linha;
    });

    // Aplicar ordenação
    if (config.ordenacao) {
      dados.sort((a, b) => {
        const aVal = a[config.ordenacao];
        const bVal = b[config.ordenacao];
        return aVal > bVal ? 1 : -1;
      });
    }

    return {
      colunas,
      dados,
      total: dados.length,
      filtros: config.filtros || false,
      paginacao: config.paginacao || false
    };
  }

  // Gerar gráfico
  private async gerarGrafico(config: ConfiguracaoGrafico, normas: Norma[]): Promise<any> {
    const dados = this.processarDadosGrafico(config, normas);
    
    return {
      tipo: config.tipo,
      dados,
      configuracao: {
        cores: config.cores || this.gerarCoresPadrao(),
        animacoes: config.animacoes !== false,
        legendas: config.legendas !== false,
        agrupamento: config.agrupamento
      }
    };
  }

  // Gerar métricas
  private async gerarMetricas(config: any, normas: Norma[]): Promise<any> {
    const kpis = NormasAnalyticsService.calcularKPIs(normas);
    const metricas = config.metricas || ['totalNormas', 'taxaConformidade'];
    
    const dados = metricas.map(metrica => ({
      nome: this.obterNomeMetrica(metrica),
      valor: kpis[metrica as keyof typeof kpis] || 0,
      unidade: this.obterUnidadeMetrica(metrica),
      cor: this.obterCorMetrica(metrica)
    }));

    return {
      layout: config.layout || 'grid',
      metricas: dados
    };
  }

  // Gerar alertas
  private async gerarAlertas(config: any, normas: Norma[]): Promise<any> {
    const alertas = [];
    const hoje = new Date();

    // Alertas de vencimento
    const normasVencendo = normas.filter(n => {
      const dataVencimento = new Date(n.dataVencimento);
      const diasAteVencimento = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      return diasAteVencimento <= 30 && diasAteVencimento > 0;
    });

    normasVencendo.forEach(norma => {
      const dataVencimento = new Date(norma.dataVencimento);
      const diasAteVencimento = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      alertas.push({
        tipo: 'vencimento',
        prioridade: diasAteVencimento <= 7 ? 'alta' : 'media',
        titulo: `Norma vencendo em ${diasAteVencimento} dias`,
        descricao: `${norma.codigo} - ${norma.titulo}`,
        acao: 'Renovar norma',
        prazo: dataVencimento
      });
    });

    // Alertas de conformidade
    const normasNaoConformes = normas.filter(n => n.status === 'NaoConforme');
    if (normasNaoConformes.length > 0) {
      alertas.push({
        tipo: 'conformidade',
        prioridade: 'alta',
        titulo: `${normasNaoConformes.length} normas não conformes`,
        descricao: 'Requer atenção imediata',
        acao: 'Revisar conformidade',
        prazo: new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 dias
      });
    }

    return {
      alertas: alertas.slice(0, config.maxItems || 10),
      total: alertas.length,
      incluirAcoes: config.incluirAcoes || false
    };
  }

  // Gerar anexos
  private async gerarAnexos(config: any, normas: Norma[]): Promise<any> {
    const anexos = [];
    
    normas.forEach(norma => {
      if ((norma as any).documentos_anexos && (norma as any).documentos_anexos.length > 0) {
        (norma as any).documentos_anexos.forEach((doc: any) => {
          anexos.push({
            norma: norma.codigo,
            titulo: norma.titulo,
            documento: doc.nome,
            tipo: doc.tipo || 'PDF',
            tamanho: doc.tamanho || 0,
            dataUpload: doc.dataUpload || norma.dataCriacao
          });
        });
      }
    });

    return {
      anexos,
      total: anexos.length,
      agruparPorTipo: config.agruparPorTipo || false,
      incluirMetadados: config.incluirMetadados || false
    };
  }

  // Gerar seção personalizada
  private async gerarSecaoPersonalizada(config: any, normas: Norma[]): Promise<any> {
    switch (config.template) {
      case 'acoes-auditoria':
        return this.gerarAcoesAuditoria(normas);
      
      default:
        return { mensagem: 'Template personalizado não encontrado' };
    }
  }

  // Gerar ações de auditoria
  private gerarAcoesAuditoria(normas: Norma[]): any {
    const acoes = [];
    const hoje = new Date();

    // Ações para normas vencidas
    const normasVencidas = normas.filter(n => new Date(n.dataVencimento) < hoje);
    if (normasVencidas.length > 0) {
      acoes.push({
        prioridade: 'crítica',
        acao: 'Renovar normas vencidas',
        descricao: `${normasVencidas.length} normas vencidas`,
        prazo: 'Imediato',
        responsavel: 'Gestor de Qualidade'
      });
    }

    // Ações para não conformidades
    const normasNaoConformes = normas.filter(n => n.status === 'NaoConforme');
    if (normasNaoConformes.length > 0) {
      acoes.push({
        prioridade: 'alta',
        acao: 'Corrigir não conformidades',
        descricao: `${normasNaoConformes.length} normas não conformes`,
        prazo: '7 dias',
        responsavel: 'Responsável Técnico'
      });
    }

    return {
      acoes,
      total: acoes.length,
      incluirPrioridades: true,
      incluirPrazos: true
    };
  }

  // Gerar conteúdo final do relatório
  private async gerarConteudo(
    formato: string,
    template: TemplateRelatorio,
    secoes: any[],
    normas: Norma[]
  ): Promise<{ tamanho: number; url?: string }> {
    const conteudo = {
      template: template.nome,
      dataGeracao: new Date().toISOString(),
      secoes,
      normas, // Incluir normas para o serviço profissional
      estatisticas: {
        totalNormas: normas.length,
        secoesGeradas: secoes.length
      }
    };

    switch (formato) {
      case 'pdf':
        return this.gerarPDF(conteudo);
      
      case 'excel':
        return this.gerarExcel(conteudo);
      
      case 'word':
        return this.gerarWord(conteudo);
      
      case 'html':
        return this.gerarHTML(conteudo);
      
      default:
        throw new Error(`Formato não suportado: ${formato}`);
    }
  }

  // Gerar PDF
  private async gerarPDF(conteudo: any): Promise<{ tamanho: number; url?: string }> {
    try {
      // Verificar se jsPDF está disponível
      if (typeof window !== 'undefined' && window.jsPDF) {
        return this.gerarPDFComJSPDF(conteudo);
      } else {
        // Fallback para geração básica de PDF
        return this.gerarPDFBasico(conteudo);
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw new Error('Método de geração de PDF não disponível');
    }
  }

  // Adicionar cabeçalho premium
  private adicionarCabecalhoPremium(doc: any, empresa: any, titulo: string) {
    // Configuração de cores
    const primaryColor = [30, 41, 59]; // Slate-800
    const secondaryColor = [59, 130, 246]; // Blue-500
    
    // Fundo do cabeçalho
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Linha decorativa
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(0, 0, 210, 3, 'F');
    
    // Logo/Nome da empresa
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(empresa.nome, 20, 20);
    
    // Informações da empresa
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(empresa.morada, 20, 28);
    doc.text(`Tel: ${empresa.telefone} | Email: ${empresa.email}`, 20, 32);
    
    // Título do relatório
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(titulo, 105, 25, { align: 'center' });
    
    // Data de geração
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 105, 35, { align: 'center' });
  }

  // Adicionar rodapé premium
  private adicionarRodapePremium(doc: any, empresa: any) {
    const pageCount = doc.getNumberOfPages();
    const primaryColor = [30, 41, 59];
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Fundo do rodapé
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 280, 210, 20, 'F');
      
      // Linha decorativa
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 280, 210, 2, 'F');
      
      // Texto do rodapé
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      
      const currentTime = new Date().toLocaleString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      doc.text(`${empresa.nome} | Tel: ${empresa.telefone} | Email: ${empresa.email}`, 20, 290);
      doc.text(`Página ${i} de ${pageCount} | Gerado em ${currentTime}`, 20, 295);
      doc.text(`Endereço: ${empresa.morada}`, 20, 300);
    }
  }

  // Gerar PDF usando serviço profissional
  private async gerarPDFComJSPDF(conteudo: any): Promise<{ tamanho: number; url?: string }> {
    try {
      // Importar o serviço profissional de PDF
      const { pdfProfessionalService } = await import('../services/pdfProfessionalService');
      
      // Extrair normas do conteúdo
      const normas = conteudo.normas || [];
      
      // Gerar PDF profissional baseado no tipo de template
      if (conteudo.template?.includes('Executivo') || conteudo.template?.includes('executivo')) {
        return await pdfProfessionalService.gerarRelatorioExecutivo(normas);
      } else {
        return await pdfProfessionalService.gerarPDFNormas(normas, conteudo.template || 'Relatório de Normas');
      }
    } catch (error) {
      console.error('Erro ao gerar PDF profissional:', error);
      // Fallback para método básico
      return this.gerarPDFBasico(conteudo);
    }
  }

  // Gerar PDF básico (fallback)
  private async gerarPDFBasico(conteudo: any): Promise<{ tamanho: number; url?: string }> {
    // Gerar HTML e converter para PDF usando print
    const html = this.gerarHTMLTemplate(conteudo);
    const tamanho = html.length;
    
    // Criar uma nova janela para impressão
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      
      // Aguardar carregamento e imprimir
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }

    // Retornar URL temporária
    const url = `data:text/html;base64,${btoa(html)}`;
    return { tamanho, url };
  }

  // Gerar Excel
  private async gerarExcel(conteudo: any): Promise<{ tamanho: number; url?: string }> {
    try {
      // Criar dados estruturados para Excel
      const dados = this.prepararDadosExcel(conteudo);
      
      // Gerar CSV como fallback (Excel pode abrir CSV)
      const csvContent = this.gerarCSV(dados);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const tamanho = blob.size;
      
      return { tamanho, url };
    } catch (error) {
      console.error('Erro ao gerar Excel:', error);
      // Fallback para dados simples
      const dados = JSON.stringify(conteudo, null, 2);
      const blob = new Blob([dados], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const tamanho = blob.size;
      
      return { tamanho, url };
    }
  }

  // Gerar Word
  private async gerarWord(conteudo: any): Promise<{ tamanho: number; url?: string }> {
    try {
      // Gerar HTML formatado que pode ser aberto no Word
      const htmlContent = this.gerarHTMLParaWord(conteudo);
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const tamanho = blob.size;
      
      return { tamanho, url };
    } catch (error) {
      console.error('Erro ao gerar Word:', error);
      // Fallback para texto simples
      const texto = this.gerarTextoSimples(conteudo);
      const blob = new Blob([texto], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const tamanho = blob.size;
      
      return { tamanho, url };
    }
  }

  // Preparar dados para Excel
  private prepararDadosExcel(conteudo: any): any[] {
    const dados: any[] = [];
    
    if (conteudo.secoes) {
      conteudo.secoes.forEach((secao: any) => {
        if (secao.tipo === 'tabela' && secao.conteudo && secao.conteudo.dados) {
          // Adicionar cabeçalho da seção
          dados.push([secao.titulo]);
          dados.push([]);
          
          // Adicionar cabeçalhos da tabela
          if (secao.conteudo.colunas) {
            dados.push(secao.conteudo.colunas);
          }
          
          // Adicionar dados da tabela
          secao.conteudo.dados.forEach((linha: any) => {
            const valores = secao.conteudo.colunas.map((col: string) => linha[col] || '');
            dados.push(valores);
          });
          
          dados.push([]);
          dados.push([]);
        }
      });
    }
    
    return dados;
  }

  // Gerar CSV
  private gerarCSV(dados: any[]): string {
    return dados.map(linha => 
      linha.map((celula: any) => `"${String(celula).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }

  // Gerar HTML para Word
  private gerarHTMLParaWord(conteudo: any): string {
    return `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
      <head>
        <meta charset="utf-8">
        <title>${conteudo.template || 'Relatório de Normas'}</title>
        <style>
          body { font-family: 'Calibri', sans-serif; font-size: 11pt; }
          h1 { color: #1e293b; font-size: 18pt; }
          h2 { color: #334155; font-size: 14pt; }
          table { border-collapse: collapse; width: 100%; margin: 10px 0; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
          th { background-color: #1e293b; color: white; }
          .header { background-color: #f1f5f9; padding: 20px; text-align: center; }
          .footer { background-color: #f1f5f9; padding: 10px; text-align: center; font-size: 9pt; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${conteudo.template || 'Relatório de Normas'}</h1>
          <p><strong>QUALICORE</strong> - Sistema de Gestão de Qualidade</p>
          <p>Gerado em: ${new Date().toLocaleString('pt-PT')}</p>
        </div>
        
        ${this.gerarConteudoWord(conteudo)}
        
        <div class="footer">
          <p><strong>QUALICORE</strong> | Rua da Qualidade, 123 | Tel: +351 123 456 789 | Email: info@qualicore.pt</p>
        </div>
      </body>
      </html>
    `;
  }

  // Gerar conteúdo para Word
  private gerarConteudoWord(conteudo: any): string {
    let html = '';
    
    if (conteudo.secoes) {
      conteudo.secoes.forEach((secao: any) => {
        html += `<h2>${secao.titulo}</h2>`;
        
        if (secao.tipo === 'tabela' && secao.conteudo && secao.conteudo.dados) {
          html += '<table>';
          
          // Cabeçalhos
          if (secao.conteudo.colunas) {
            html += '<tr>';
            secao.conteudo.colunas.forEach((col: string) => {
              html += `<th>${col}</th>`;
            });
            html += '</tr>';
          }
          
          // Dados
          secao.conteudo.dados.forEach((linha: any) => {
            html += '<tr>';
            secao.conteudo.colunas.forEach((col: string) => {
              html += `<td>${linha[col] || ''}</td>`;
            });
            html += '</tr>';
          });
          
          html += '</table>';
        } else if (secao.conteudo) {
          html += `<p>${JSON.stringify(secao.conteudo, null, 2)}</p>`;
        }
      });
    }
    
    return html;
  }

  // Gerar texto simples (fallback)
  private gerarTextoSimples(conteudo: any): string {
    let texto = `${conteudo.template || 'Relatório de Normas'}\n`;
    texto += `Gerado em: ${new Date().toLocaleString('pt-PT')}\n\n`;
    
    if (conteudo.secoes) {
      conteudo.secoes.forEach((secao: any) => {
        texto += `${secao.titulo}\n`;
        texto += '='.repeat(secao.titulo.length) + '\n\n';
        
        if (secao.conteudo) {
          texto += JSON.stringify(secao.conteudo, null, 2) + '\n\n';
        }
      });
    }
    
    return texto;
  }

  // Gerar HTML
  private async gerarHTML(conteudo: any): Promise<{ tamanho: number; url?: string }> {
    const html = this.gerarHTMLTemplate(conteudo);
    const tamanho = html.length;
    const url = `data:text/html;base64,${btoa(html)}`;
    
    return { tamanho, url };
  }

  // Gerar template HTML
  private gerarHTMLTemplate(conteudo: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${conteudo.template || 'Relatório de Normas'}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 0;
            background-color: #f8fafc;
          }
          .header { 
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-bottom: 4px solid #3b82f6;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header .subtitle {
            margin: 5px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .header .company-info {
            position: absolute;
            top: 20px;
            left: 20px;
            text-align: left;
            font-size: 12px;
          }
          .header .generation-info {
            position: absolute;
            top: 20px;
            right: 20px;
            text-align: right;
            font-size: 12px;
          }
          .content {
            padding: 30px;
            background: white;
            min-height: calc(100vh - 200px);
          }
          .section { 
            margin-bottom: 30px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .section h2 {
            background: #f1f5f9;
            margin: 0;
            padding: 15px 20px;
            font-size: 18px;
            color: #1e293b;
            border-bottom: 2px solid #e2e8f0;
          }
          .section-content {
            padding: 20px;
          }
          .metric { 
            display: inline-block; 
            margin: 10px; 
            padding: 15px; 
            border: 1px solid #e2e8f0; 
            border-radius: 6px;
            background: #f8fafc;
            min-width: 150px;
            text-align: center;
          }
          .metric .value {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
          }
          .metric .label {
            font-size: 12px;
            color: #64748b;
            margin-top: 5px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          th, td { 
            border: 1px solid #e2e8f0; 
            padding: 12px 8px; 
            text-align: left; 
          }
          th { 
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            font-weight: 600;
            font-size: 12px;
          }
          td {
            font-size: 11px;
            background: white;
          }
          tr:nth-child(even) td {
            background: #f8fafc;
          }
          .footer {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            padding: 15px 30px;
            text-align: center;
            font-size: 11px;
            border-top: 4px solid #3b82f6;
          }
          .footer .company {
            font-weight: bold;
            margin-bottom: 5px;
          }
          .footer .info {
            opacity: 0.8;
          }
          @media print {
            body { background-color: white; }
            .header, .footer { -webkit-print-color-adjust: exact; }
            th { -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <strong>QUALICORE</strong><br>
            Rua da Qualidade, 123<br>
            Tel: +351 123 456 789<br>
            Email: info@qualicore.pt
          </div>
          <div class="generation-info">
            Gerado em: ${new Date().toLocaleString('pt-PT')}<br>
            Relatório de Normas
          </div>
          <h1>${conteudo.template || 'Relatório de Normas'}</h1>
          <div class="subtitle">Sistema de Gestão de Qualidade</div>
        </div>
        
        <div class="content">
          <p>Gerado em: ${new Date(conteudo.dataGeracao).toLocaleString('pt-PT')}</p>
        </div>
        
        ${conteudo.secoes.map(secao => `
          <div class="section">
            <h2>${secao.titulo}</h2>
            <div>${JSON.stringify(secao.conteudo, null, 2)}</div>
          </div>
        `).join('')}
        
        <div class="section">
          <h2>Estatísticas</h2>
          <p>Total de normas: ${conteudo.estatisticas.totalNormas}</p>
          <p>Seções geradas: ${conteudo.estatisticas.secoesGeradas}</p>
                  </div>
        </div>
        
        <div class="footer">
          <div class="company">QUALICORE</div>
          <div class="info">
            Rua da Qualidade, 123 | Tel: +351 123 456 789 | Email: info@qualicore.pt<br>
            Gerado em ${new Date().toLocaleString('pt-PT')} | Sistema de Gestão de Qualidade
          </div>
        </div>
      </body>
    </html>
    `;
  }

  // Obter templates disponíveis
  getTemplates(): TemplateRelatorio[] {
    return Array.from(this.templates.values()).map(template => ({
      id: template.id,
      nome: template.nome,
      descricao: template.descricao,
      categoria: template.categoria,
      formato: template.formato
    }));
  }

  // Métodos auxiliares
  private obterValorColuna(norma: Norma, coluna: string): any {
    switch (coluna) {
      case 'codigo': return norma.codigo;
      case 'titulo': return norma.titulo;
      case 'categoria': return norma.categoria;
      case 'organismo': return norma.organismoNormativo;
      case 'status': return norma.status;
      case 'prioridade': return norma.prioridade;
      case 'dataVencimento': return new Date(norma.dataVencimento).toLocaleDateString('pt-PT');
      case 'dataCriacao': return new Date(norma.dataCriacao).toLocaleDateString('pt-PT');
      default: return norma[coluna as keyof Norma] || '';
    }
  }

  private processarDadosGrafico(config: ConfiguracaoGrafico, normas: Norma[]): any {
    // Implementação básica - pode ser expandida
    const dados = {};
    
    config.dados.forEach(campo => {
      normas.forEach(norma => {
        const valor = this.obterValorColuna(norma, campo);
        dados[valor] = (dados[valor] || 0) + 1;
      });
    });

    return Object.entries(dados).map(([label, value]) => ({ label, value }));
  }

  private gerarCoresPadrao(): string[] {
    return ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
  }

  private obterNomeMetrica(metrica: string): string {
    const nomes: Record<string, string> = {
      totalNormas: 'Total de Normas',
      taxaConformidade: 'Taxa de Conformidade',
      normasVencendo: 'Normas Vencendo',
      organismosAtivos: 'Organismos Ativos'
    };
    return nomes[metrica] || metrica;
  }

  private obterUnidadeMetrica(metrica: string): string {
    const unidades: Record<string, string> = {
      totalNormas: '',
      taxaConformidade: '%',
      normasVencendo: '',
      organismosAtivos: ''
    };
    return unidades[metrica] || '';
  }

  private obterCorMetrica(metrica: string): string {
    const cores: Record<string, string> = {
      totalNormas: '#3B82F6',
      taxaConformidade: '#10B981',
      normasVencendo: '#F59E0B',
      organismosAtivos: '#8B5CF6'
    };
    return cores[metrica] || '#6B7280';
  }

  private gerarPrincipaisAcoes(normas: Norma[], kpis: any): string[] {
    const acoes = [];
    
    if (kpis.normasVencendo > 0) {
      acoes.push(`Renovar ${kpis.normasVencendo} normas vencendo`);
    }
    
    if (kpis.taxaConformidade < 95) {
      acoes.push('Melhorar conformidade das normas');
    }
    
    if (kpis.normasRecentes > 0) {
      acoes.push(`Revisar ${kpis.normasRecentes} normas recentes`);
    }
    
    return acoes;
  }

  // Gerenciamento de templates
  async criarTemplate(template: Omit<TemplateRelatorio, 'id'>): Promise<TemplateRelatorio> {
    const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const novoTemplate: TemplateRelatorio = { ...template, id };
    
    this.templates.set(id, novoTemplate);
    return novoTemplate;
  }

  async atualizarTemplate(id: string, atualizacoes: Partial<TemplateRelatorio>): Promise<TemplateRelatorio> {
    const template = this.templates.get(id);
    if (!template) {
      throw new Error(`Template não encontrado: ${id}`);
    }

    const templateAtualizado = { ...template, ...atualizacoes };
    this.templates.set(id, templateAtualizado);
    return templateAtualizado;
  }

  async excluirTemplate(id: string): Promise<boolean> {
    return this.templates.delete(id);
  }

  getTemplates(): TemplateRelatorio[] {
    return Array.from(this.templates.values());
  }

  getTemplate(id: string): TemplateRelatorio | undefined {
    return this.templates.get(id);
  }

  // Gerenciamento de relatórios gerados
  getRelatoriosGerados(): RelatorioGerado[] {
    return Array.from(this.relatoriosGerados.values());
  }

  getRelatorio(id: string): RelatorioGerado | undefined {
    return this.relatoriosGerados.get(id);
  }

  async excluirRelatorio(id: string): Promise<boolean> {
    return this.relatoriosGerados.delete(id);
  }

  // Agendamento de relatórios
  async agendarRelatorio(
    templateId: string,
    agendamento: AgendamentoRelatorio
  ): Promise<void> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template não encontrado: ${templateId}`);
    }

    template.agendamento = agendamento;
    this.templates.set(templateId, template);

    if (agendamento.ativo) {
      this.configurarAgendamento(templateId, agendamento);
    }
  }

  private configurarAgendamento(templateId: string, agendamento: AgendamentoRelatorio): void {
    // Limpar agendamento existente
    const timeoutExistente = this.agendamentosAtivos.get(templateId);
    if (timeoutExistente) {
      clearTimeout(timeoutExistente);
    }

    // Calcular próximo agendamento
    const proximaExecucao = this.calcularProximaExecucao(agendamento);
    const delay = proximaExecucao.getTime() - Date.now();

    if (delay > 0) {
      const timeout = setTimeout(() => {
        this.executarRelatorioAgendado(templateId);
      }, delay);

      this.agendamentosAtivos.set(templateId, timeout);
    }
  }

  private calcularProximaExecucao(agendamento: AgendamentoRelatorio): Date {
    const agora = new Date();
    const proxima = new Date(agora);

    switch (agendamento.frequencia) {
      case 'diario':
        proxima.setDate(proxima.getDate() + 1);
        break;
      
      case 'semanal':
        if (agendamento.diaSemana !== undefined) {
          const diasAteProxima = (agendamento.diaSemana - proxima.getDay() + 7) % 7;
          proxima.setDate(proxima.getDate() + diasAteProxima);
        } else {
          proxima.setDate(proxima.getDate() + 7);
        }
        break;
      
      case 'mensal':
        if (agendamento.diaMes !== undefined) {
          proxima.setDate(agendamento.diaMes);
          if (proxima <= agora) {
            proxima.setMonth(proxima.getMonth() + 1);
          }
        } else {
          proxima.setMonth(proxima.getMonth() + 1);
        }
        break;
      
      case 'trimestral':
        proxima.setMonth(proxima.getMonth() + 3);
        break;
      
      case 'anual':
        proxima.setFullYear(proxima.getFullYear() + 1);
        break;
    }

    // Definir hora se especificada
    if (agendamento.hora) {
      const [hora, minuto] = agendamento.hora.split(':').map(Number);
      proxima.setHours(hora, minuto, 0, 0);
    } else {
      proxima.setHours(9, 0, 0, 0); // 9:00 por padrão
    }

    return proxima;
  }

  private async executarRelatorioAgendado(templateId: string): Promise<void> {
    try {
      const template = this.templates.get(templateId);
      if (!template || !template.agendamento?.ativo) return;

      // Obter normas do cache ou API
      const normas = NormasCacheService.getCachedNormas() || [];
      
      // Gerar relatório
      const relatorio = await this.gerarRelatorio(
        templateId,
        normas,
        template.filtros,
        template.agendamento.formato
      );

      // Enviar por email se destinatários especificados
      if (template.agendamento.destinatarios && template.agendamento.destinatarios.length > 0) {
        await this.enviarRelatorioPorEmail(relatorio, template.agendamento.destinatarios);
      }

      // Configurar próximo agendamento
      this.configurarAgendamento(templateId, template.agendamento);

    } catch (error) {
      console.error(`Erro ao executar relatório agendado ${templateId}:`, error);
    }
  }

  private async enviarRelatorioPorEmail(relatorio: RelatorioGerado, destinatarios: string[]): Promise<void> {
    // Implementação de envio por email
    console.log(`Enviando relatório ${relatorio.nome} para:`, destinatarios);
  }

  private inicializarAgendamentos(): void {
    this.templates.forEach((template, id) => {
      if (template.agendamento?.ativo) {
        this.configurarAgendamento(id, template.agendamento);
      }
    });
  }

  // Limpeza e manutenção
  async limparRelatoriosAntigos(dias: number = 30): Promise<number> {
    const limite = new Date();
    limite.setDate(limite.getDate() - dias);

    let removidos = 0;
    for (const [id, relatorio] of this.relatoriosGerados.entries()) {
      if (relatorio.dataGeracao < limite) {
        this.relatoriosGerados.delete(id);
        removidos++;
      }
    }

    return removidos;
  }

  getEstatisticas(): any {
    return {
      totalTemplates: this.templates.size,
      totalRelatorios: this.relatoriosGerados.size,
      agendamentosAtivos: Array.from(this.agendamentosAtivos.keys()).length,
      templatesPorCategoria: this.getTemplatesPorCategoria()
    };
  }

  private getTemplatesPorCategoria(): Record<string, number> {
    const categorias: Record<string, number> = {};
    
    this.templates.forEach(template => {
      categorias[template.categoria] = (categorias[template.categoria] || 0) + 1;
    });

    return categorias;
  }
}

// Instância singleton
export const normasRelatoriosAvancados = new NormasRelatoriosAvancados();

// Serviço de exportação
export const NormasRelatoriosService = {
  // Templates
  getTemplates: () => normasRelatoriosAvancados.getTemplates(),
  getTemplate: (id: string) => normasRelatoriosAvancados.getTemplate(id),
  criarTemplate: (template: Omit<TemplateRelatorio, 'id'>) => normasRelatoriosAvancados.criarTemplate(template),
  atualizarTemplate: (id: string, atualizacoes: Partial<TemplateRelatorio>) => normasRelatoriosAvancados.atualizarTemplate(id, atualizacoes),
  excluirTemplate: (id: string) => normasRelatoriosAvancados.excluirTemplate(id),

  // Relatórios
  gerarRelatorio: (templateId: string, normas: Norma[], filtros?: FiltrosRelatorio, formato?: string) => 
    normasRelatoriosAvancados.gerarRelatorio(templateId, normas, filtros, formato),
  getRelatoriosGerados: () => normasRelatoriosAvancados.getRelatoriosGerados(),
  getRelatorio: (id: string) => normasRelatoriosAvancados.getRelatorio(id),
  excluirRelatorio: (id: string) => normasRelatoriosAvancados.excluirRelatorio(id),

  // Agendamento
  agendarRelatorio: (templateId: string, agendamento: AgendamentoRelatorio) => 
    normasRelatoriosAvancados.agendarRelatorio(templateId, agendamento),

  // Manutenção
  limparRelatoriosAntigos: (dias?: number) => normasRelatoriosAvancados.limparRelatoriosAntigos(dias),
  getEstatisticas: () => normasRelatoriosAvancados.getEstatisticas()
};
